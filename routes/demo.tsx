import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function DemoPage() {
  return (
    <>
      <Head>
        <title>Demo - Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"
          integrity="sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx"
          crossOrigin="anonymous"
        ></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
          integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05"
          crossOrigin="anonymous"
        ></script>
      </Head>
      
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        {/* Header */}
        <header class="bg-white/80 backdrop-blur border-b border-gray-200 p-4">
          <div class="max-w-4xl mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">🚀 Pluto.si Demo</h1>
            <a 
              href="/" 
              class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              ← Back
            </a>
          </div>
        </header>

        {/* Demo Chat */}
        <div class="flex-1 flex items-center justify-center p-4">
          <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 class="text-xl font-semibold text-gray-800">Welcome to Pluto.si 🚀</h2>
              <p class="text-sm text-gray-600 mt-1">Your personal AI math tutor</p>
            </div>
            
            <div id="demo-chat" class="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {/* Intro message */}
              <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div id="intro-text" class="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                  {/* Will be filled by JS */}
                </div>
              </div>
              
              {/* Problem */}
              <div id="problem-container" class="hidden">
                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md ml-auto">
                  <p class="text-gray-800 font-medium text-base" id="problem-text"></p>
                </div>
              </div>
              
              {/* Solution */}
              <div id="solution-container" class="hidden">
                <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div id="solution-text" class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 text-base">
                    {/* Will be filled by JS */}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 text-center">
              <p class="text-sm text-gray-700 mb-3">
                ✨ Ready to start learning?
              </p>
              <a 
                href="/auth/register" 
                class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Register Now - Free Trial
              </a>
            </div>
          </div>
        </div>

        {/* Demo Animation Script */}
        <script dangerouslySetInnerHTML={{ __html: `
          const introText = \`Hello! 👋

Pluto.si is your personal mathematics assistant, designed to help you **improve your understanding** and **achieve better results**.

**What we offer:**

✓ **Step-by-step explanations** – We solve each problem systematically so you understand *why*, not just *how*.

✓ **Support for all topics** – From basic algebra to integrals and calculus.

✓ **Interactive keyboard** – Easy input of mathematical symbols and formulas.

✓ **Graph visualizations** – Display functions for better understanding.

✓ **Multilingual support** – Slovenian, English, and Italian.

**Let's see an example:**\`;

          const demoProblem = 'Solve the equation: 3x + 5 = 20';

          const demoSolution = \`**Solving a Linear Equation**

**Step 1:** Subtract 5 from both sides
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Step 2:** Divide by 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Solution:** x = 5

✅ We can verify: 3(5) + 5 = 15 + 5 = 20 ✓\`;

          let typedIntro = '';
          let typedSolution = '';
          let charIndex = 0;
          let solutionCharIndex = 0;
          
          // Type intro text
          const introInterval = setInterval(() => {
            if (charIndex < introText.length) {
              typedIntro += introText[charIndex];
              document.getElementById('intro-text').innerHTML = typedIntro + 
                '<span class="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse"></span>';
              charIndex++;
            } else {
              clearInterval(introInterval);
              document.getElementById('intro-text').innerHTML = typedIntro;
              
              // Show problem after delay
              setTimeout(() => {
                document.getElementById('problem-container').classList.remove('hidden');
                document.getElementById('problem-text').textContent = demoProblem;
                
                // Type solution after another delay
                setTimeout(() => {
                  document.getElementById('solution-container').classList.remove('hidden');
                  
                  const solutionInterval = setInterval(() => {
                    if (solutionCharIndex < demoSolution.length) {
                      typedSolution += demoSolution[solutionCharIndex];
                      document.getElementById('solution-text').innerHTML = typedSolution + 
                        '<span class="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse"></span>';
                      solutionCharIndex++;
                    } else {
                      clearInterval(solutionInterval);
                      document.getElementById('solution-text').innerHTML = typedSolution;
                      
                      // Render math after typing is done
                      setTimeout(() => {
                        if (window.renderMathInElement) {
                          renderMathInElement(document.getElementById('demo-chat'), {
                            delimiters: [
                              { left: "$$", right: "$$", display: true },
                              { left: "$", right: "$", display: false },
                              { left: "\\\\[", right: "\\\\]", display: true },
                              { left: "\\\\(", right: "\\\\)", display: false }
                            ],
                            throwOnError: false
                          });
                        }
                      }, 100);
                    }
                  }, 15); // Typing speed
                }, 1000);
              }, 500);
            }
          }, 20); // Typing speed
        ` }} />
      </div>
    </>
  );
});

