import { useEffect, useState } from "preact/hooks";

export type ChatMessage = { 
  id: number; 
  role: "user" | "assistant"; 
  content: string;
  topic?: string;
  difficulty?: number;
  isExercise?: boolean;
};

export default function Messages(props: { items: ChatMessage[] }) {
  const [solutionShownFor, setSolutionShownFor] = useState<Set<number>>(new Set());
  const [lang, setLang] = useState<'sl' | 'en' | 'it'>('sl');

  useEffect(() => {
    // Initialize language from localStorage
    const stored = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' || 'sl';
    setLang(stored);

    // Listen for language changes
    const handleLangChange = () => {
      const newLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' || 'sl';
      setLang(newLang);
    };
    globalThis.addEventListener('pluto-lang-change', handleLangChange);

    return () => {
      globalThis.removeEventListener('pluto-lang-change', handleLangChange);
    };
  }, []);
  useEffect(() => {
    // trigger KaTeX auto-render when messages change
    const renderMath = () => {
      const w = globalThis as unknown as { 
        renderMathInElement?: (el: Element, opts: { delimiters: { left: string; right: string; display: boolean }[]; throwOnError?: boolean }) => void;
        functionPlot?: (opts: { target: Element; width: number; height: number; grid: boolean; data: Array<{ fn: string; color: string }> }) => void;
      };
      
      if (w.renderMathInElement) {
        const messagesEl = document.getElementById("messages");
        if (messagesEl) {
          console.log('Rendering math in messages...');
          w.renderMathInElement(messagesEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\(", right: "\\)", display: false },
              { left: "\\[", right: "\\]", display: true },
            ],
            throwOnError: false
          });
          console.log('Math rendering completed');
        }
      } else {
        console.log('KaTeX renderMathInElement not available yet');
      }
      
      // Render graphs
      if (w.functionPlot) {
        const graphContainers = document.querySelectorAll('.graph-container');
        graphContainers.forEach((container) => {
          const funcStr = container.getAttribute('data-function');
          if (funcStr && container.children.length === 0) {
            try {
              const containerWidth = (container as HTMLElement).offsetWidth || 500;
              const width = Math.min(containerWidth, 500);
              const height = Math.min(400, globalThis.innerHeight * 0.5);
              
              console.log('Rendering graph for function:', funcStr);
              
              (w.functionPlot as any)({
                target: container,
                width: width,
                height: height,
                grid: true,
                xAxis: { domain: [-10, 10] },
                yAxis: { domain: [-10, 10] },
                data: [{
                  fn: funcStr,
                  color: '#2563eb'
                }]
              });
              
              console.log('Graph rendered successfully');
            } catch (e) {
              console.error('Graph rendering error for function:', funcStr, e);
              // Show error message in container
              (container as HTMLElement).innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <p><strong>Napaka pri risanju grafa:</strong></p>
                  <p>Funkcija: ${funcStr}</p>
                  <p class="text-xs mt-1">${e}</p>
                </div>
              `;
            }
          }
        });
      }
    };
    
    // Try multiple times to ensure libraries are loaded
    setTimeout(renderMath, 100);
    setTimeout(renderMath, 500);
    setTimeout(renderMath, 1000);
  }, [props.items]);

  // Parse content and extract graphs and math
  function parseContent(content: string) {
    const parts: Array<{ type: 'text' | 'graph' | 'math', content: string }> = [];
    
    // First extract graphs - support multiple formats
    // Format 1: [GRAPH:f(x)]
    // Format 2: Graf funkcije f(x) = ...
    const graphRegex = /\[GRAPH:([^\]]+)\]|Graf(?:ikon)?\s+funkcije\s+(?:f\(x\)\s*=\s*)?([^\n.]+)/gi;
    let lastIndex = 0;
    let match;
    
    while ((match = graphRegex.exec(content)) !== null) {
      // Add text before graph
      if (match.index > lastIndex) {
        const textPart = content.substring(lastIndex, match.index);
        // Parse math in this text part
        parseMath(textPart, parts);
      }
      // Add graph (use whichever capture group matched)
      const funcStr = match[1] || match[2];
      if (funcStr) {
        parts.push({ type: 'graph', content: funcStr.trim() });
      }
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      const textPart = content.substring(lastIndex);
      parseMath(textPart, parts);
    } else if (lastIndex === 0) {
      // No graphs found, just parse math
      parseMath(content, parts);
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content }];
  }
  
  // Helper to parse math expressions
  function parseMath(text: string, parts: Array<{ type: 'text' | 'graph' | 'math', content: string }>) {
    // Check for $ delimited math
    const mathRegex = /\$([^\$]+)\$/g;
    let lastIdx = 0;
    let m;
    
    while ((m = mathRegex.exec(text)) !== null) {
      // Add text before math
      if (m.index > lastIdx) {
        parts.push({ type: 'text', content: text.substring(lastIdx, m.index) });
      }
      // Add math (keep the $ delimiters)
      parts.push({ type: 'math', content: `$${m[1]}$` });
      lastIdx = m.index + m[0].length;
    }
    
    // Add remaining text
    if (lastIdx < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIdx) });
    } else if (lastIdx === 0) {
      // No math found
      parts.push({ type: 'text', content: text });
    }
  }

  // Check if message is an exercise (contains exercise trigger phrases)
  function isExercise(content: string): boolean {
    const triggers = {
      sl: ['Klikni \'Rešitev\'', 'za prikaz rešitve'],
      en: ['Click \'Solution\'', 'to show the solution'],
      it: ['Clicca \'Soluzione\'', 'per mostrare la soluzione']
    };
    
    return triggers[lang].some(trigger => content.includes(trigger));
  }

  // Request solution for the exercise
  async function handleSolutionClick(exerciseContent: string, messageId: number) {
    // Mark that solution was requested for this message
    setSolutionShownFor(prev => new Set(prev).add(messageId));
    const prompts = {
      sl: `Pokaži podrobno rešitev za to nalogo:\n\n${exerciseContent}\n\nNavodila:\n- Podaj vse korake rešitve\n- Razloži vsak korak\n- Uporabi matematične zapise (LaTeX)\n- Na koncu podaj končen odgovor`,
      en: `Show a detailed solution for this exercise:\n\n${exerciseContent}\n\nInstructions:\n- Provide all solution steps\n- Explain each step\n- Use mathematical notation (LaTeX)\n- Provide the final answer at the end`,
      it: `Mostra una soluzione dettagliata per questo esercizio:\n\n${exerciseContent}\n\nIstruzioni:\n- Fornisci tutti i passaggi della soluzione\n- Spiega ogni passaggio\n- Usa la notazione matematica (LaTeX)\n- Fornisci la risposta finale alla fine`
    };
    
    try {
      // Show loading indicator
      const loadingEvent = new CustomEvent("pluto-exercise-loading", { detail: true });
      globalThis.dispatchEvent(loadingEvent);
      
      // Send directly to API without showing prompt
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: prompts[lang],
          language: lang 
        })
      });
      
      const data = await response.json();
      
      // Dispatch event to add only AI response to chat
      const responseEvent = new CustomEvent("pluto-exercise-response", { 
        detail: { content: data.reply } 
      });
      globalThis.dispatchEvent(responseEvent);
      
      // Clear loading state
      const loadingOffEvent = new CustomEvent("pluto-exercise-loading", { detail: false });
      globalThis.dispatchEvent(loadingOffEvent);
    } catch (error) {
      console.error('Failed to get solution:', error);
      
      // Clear loading state on error
      const loadingOffEvent = new CustomEvent("pluto-exercise-loading", { detail: false });
      globalThis.dispatchEvent(loadingOffEvent);
    }
  }

  // Handle next exercise click
  function handleNextExercise(topic: string) {
    const event = new CustomEvent("pluto-next-exercise", { detail: { topic } });
    globalThis.dispatchEvent(event);
  }

  const solutionButtonLabels = {
    sl: "Rešitev",
    en: "Solution",
    it: "Soluzione"
  };

  const nextExerciseLabels = {
    sl: "Naslednja naloga",
    en: "Next exercise",
    it: "Esercizio successivo"
  };

  return (
    <div id="messages" class="max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {props.items.map((m, index) => {
        const showSolutionButton = m.role === "assistant" && isExercise(m.content) && !solutionShownFor.has(m.id);
        
        // Check if next message is a solution (for showing "Next exercise" button)
        const nextMessage = props.items[index + 1];
        const isSolutionShown = solutionShownFor.has(m.id) || 
          (nextMessage && nextMessage.role === "assistant" && !isExercise(nextMessage.content));
        const showNextExerciseButton = m.isExercise && isSolutionShown && m.topic;
        
        return (
          <div class={m.role === "user" ? "bg-white/90 rounded-xl p-3 sm:p-4" : "bg-gray-50 rounded-xl p-3 sm:p-4"}>
            <div class="prose prose-sm max-w-none text-sm sm:text-base">
              {parseContent(m.content).map((part, idx) => {
                if (part.type === 'graph') {
                  return (
                    <div 
                      key={idx}
                      class="graph-container my-3 sm:my-4 w-full max-w-full overflow-x-auto" 
                      data-function={part.content}
                      style="height: min(300px, 40vh); max-height: 400px;"
                    />
                  );
                } else if (part.type === 'math') {
                  return (
                    <span key={idx} class="math-inline text-sm sm:text-base">{part.content}</span>
                  );
                } else {
                  return (
                    <span key={idx} class="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{part.content}</span>
                  );
                }
              })}
            </div>
            
            {/* Solution button for exercises */}
            {showSolutionButton && (
              <div class="mt-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleSolutionClick(m.content, m.id)}
                  class="inline-flex items-center gap-2 px-4 sm:px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] sm:min-h-0"
                >
                  <span>✓</span>
                  <span>{solutionButtonLabels[lang]}</span>
                </button>
              </div>
            )}
            
            {/* Next exercise button - shown after solution */}
            {showNextExerciseButton && (
              <div class="mt-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleNextExercise(m.topic!)}
                  class="inline-flex items-center gap-2 px-4 sm:px-4 py-2.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] sm:min-h-0"
                >
                  <span>→</span>
                  <span>{nextExerciseLabels[lang]}</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


