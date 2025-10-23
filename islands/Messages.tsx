import { useEffect } from "preact/hooks";

export type ChatMessage = { id: number; role: "user" | "assistant"; content: string };

export default function Messages(props: { items: ChatMessage[] }) {
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
              
              w.functionPlot!({
                target: container,
                width: width,
                height: height,
                grid: true,
                data: [{
                  fn: funcStr,
                  color: '#2563eb'
                }]
              });
            } catch (e) {
              console.error('Graph rendering error:', e);
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
    
    // First extract graphs
    const graphRegex = /\[GRAPH:([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    
    while ((match = graphRegex.exec(content)) !== null) {
      // Add text before graph
      if (match.index > lastIndex) {
        const textPart = content.substring(lastIndex, match.index);
        // Parse math in this text part
        parseMath(textPart, parts);
      }
      // Add graph
      parts.push({ type: 'graph', content: match[1] });
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

  return (
    <div id="messages" class="max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {props.items.map((m) => (
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
        </div>
      ))}
    </div>
  );
}


