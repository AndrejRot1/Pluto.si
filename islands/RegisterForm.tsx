import { useEffect, useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Full intro text that will be typed
const introText = `Pozdravljeni! 👋

Pluto.si je vaš osebni matematični asistent, zasnovan za učence in dijake, ki želijo **izboljšati svoje razumevanje matematike** in dosegati **boljše rezultate**.

**Kaj vam ponujamo:**

✓ **Korak-po-korak razlage** – Vsak problem rešujemo sistematično, da razumete *zakaj* in ne samo *kako*.

✓ **Podpora za vsa področja** – Od osnovne algebre do integralov in diferenciala.

✓ **Interaktivna tipkovnica** – Enostavno vstavljanje matematičnih simbolov in formul.

✓ **Vizualizacije grafov** – Prikaz funkcij za boljše razumevanje.

✓ **Večjezična podpora** – Slovenščina, angleščina in italijanščina.

**Oglejmo si primer:**`;

// Demo problem after intro
const demoProblem = 'Reši enačbo: 3x + 5 = 20';

const demoSolution = `**Reševanje linearne enačbe**

**Korak 1:** Odštejemo 5 z obeh strani
\\[
3x + 5 - 5 = 20 - 5
\\]
\\[
3x = 15
\\]

**Korak 2:** Delimo z 3
\\[
\\frac{3x}{3} = \\frac{15}{3}
\\]
\\[
x = 5
\\]

**Rešitev:** x = 5

**Preverjanje:** 3(5) + 5 = 15 + 5 = 20 ✓

---

**Pripravljeni začeti?** Registrirajte se za 3-dnevni brezplačni preskus in odkrijte, kako lahko matematika postane enostavnejša! 🚀`;

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [typedIntro, setTypedIntro] = useState('');
  const [showProblem, setShowProblem] = useState(false);
  const [typedSolution, setTypedSolution] = useState('');
  const [mathRendered, setMathRendered] = useState(false);

  // Typing animation
  useEffect(() => {
    if (registrationSuccess) return;
    
    let typeIntro: number | undefined;
    let typeSol: number | undefined;
    let showProblemTimeout: number | undefined;
    let typeSolTimeout: number | undefined;
    
    // Type intro
    let i = 0;
    typeIntro = setInterval(() => {
      if (i <= introText.length) {
        setTypedIntro(introText.substring(0, i));
        i += 3;
      } else {
        clearInterval(typeIntro);
        // Show problem
        showProblemTimeout = setTimeout(() => {
          setShowProblem(true);
          // Type solution
          typeSolTimeout = setTimeout(() => {
            let j = 0;
            typeSol = setInterval(() => {
              if (j <= demoSolution.length) {
                setTypedSolution(demoSolution.substring(0, j));
                j += 5;
              } else {
                clearInterval(typeSol);
                // Trigger math rendering
                setMathRendered(true);
              }
            }, 20);
          }, 300);
        }, 500);
      }
    }, 30);
    
    return () => {
      if (typeIntro) clearInterval(typeIntro);
      if (typeSol) clearInterval(typeSol);
      if (showProblemTimeout) clearTimeout(showProblemTimeout);
      if (typeSolTimeout) clearTimeout(typeSolTimeout);
    };
  }, [registrationSuccess]);

  // Render math after typing
  useEffect(() => {
    if (!mathRendered) return;
    
    setTimeout(() => {
      const w = globalThis as unknown as { renderMathInElement?: (el: Element, opts: Record<string, unknown>) => void };
      if (w.renderMathInElement) {
        const demoEl = document.getElementById('demo-chat');
        if (demoEl) {
          console.log('Rendering KaTeX');
          w.renderMathInElement(demoEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\[", right: "\\]", display: true },
              { left: "\\(", right: "\\)", display: false },
            ],
            throwOnError: false
          });
        }
      }
    }, 100);
  }, [mathRendered]);

  async function handleRegister(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(data.error || 'Registracija ni uspela');
        setLoading(false);
      } else if (data.hasSession) {
        // User has session immediately (email confirmation disabled)
        setRegistrationSuccess(true);
        setMessage('✅ Uspešna registracija! Preusmerjanje...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        // Email confirmation required
        setMessage('✅ Registracija uspešna! Preverite svoj email za potrditev računa.');
        setLoading(false);
      }
    } catch (error) {
      setMessage('Napaka pri registraciji');
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side - Registration form */}
      <div class={`px-4 py-12 transition-all duration-500 ${
        registrationSuccess ? 'w-full' : 'w-full lg:w-1/2'
      }`}>
        <div class="max-w-md w-full mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Začni s Pluto.si</h1>
            <p class="text-gray-600">
              Tvoj osebni matematični asistent
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-8">
            <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p class="text-sm text-blue-800 font-medium mb-2">
                ✨ 3-dnevni brezplačni preskus
              </p>
              <p class="text-xs text-blue-700">
                ✓ Brez kreditne kartice<br/>
                ✓ Korak po korak rešitve<br/>
                ✓ Podpora za vsa področja matematike
              </p>
            </div>
            
            <form onSubmit={handleRegister} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="vas@email.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Geslo</label>
                <input
                  type="password"
                  value={password}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                  required
                  minlength={6}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p class="text-xs text-gray-500 mt-1">Najmanj 6 znakov</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-base"
              >
                {loading ? 'Ustvarjanje računa...' : 'Začni brezplačni preskus'}
              </button>
            </form>
            
            <p class="mt-6 text-center text-sm text-gray-600">
              Že imate račun?{" "}
              <a href="/auth/login" class="text-blue-600 hover:underline font-medium">
                Prijavite se
              </a>
            </p>
            
            {message && (
              <div class={`mt-4 text-center text-sm p-3 rounded-md ${
                message.includes('Uspešna') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Demo chat */}
      {!registrationSuccess && (
        <div class="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 border-l border-gray-200 flex-col" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;">
        <div class="border-b border-gray-200 px-6 py-4 bg-white/80 backdrop-blur">
          <h2 class="text-xl font-semibold text-gray-800">Dobrodošli v Pluto.si 🚀</h2>
          <p class="text-sm text-gray-600 mt-1">Vaš osebni matematični asistent</p>
        </div>
        
        <div id="demo-chat" class="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Intro message with typing */}
          {typedIntro && (
            <div class="bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-gray-200">
              <div class="whitespace-pre-wrap text-gray-800 leading-relaxed" style="font-size: 15px; line-height: 1.6;">
                {typedIntro}
                {typedIntro.length < introText.length && <span class="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse"></span>}
              </div>
            </div>
          )}
          
          {/* Problem */}
          {showProblem && (
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md ml-auto">
              <p class="text-gray-800 font-medium" style="font-size: 15px;">{demoProblem}</p>
            </div>
          )}
          
          {/* Solution with typing */}
          {typedSolution && (
            <div class="bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-gray-200">
              <div class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800" style="font-size: 15px; line-height: 1.7;">
                {typedSolution}
                {typedSolution.length < demoSolution.length && <span class="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse"></span>}
              </div>
            </div>
          )}
        </div>
        
        <div class="border-t border-gray-200 px-6 py-4 bg-white/80 backdrop-blur">
          <p class="text-sm text-gray-700 text-center font-medium">
            ✨ Pripravljeni začeti? Registrirajte se zdaj! 
          </p>
        </div>
        </div>
      )}
    </div>
  );
}
