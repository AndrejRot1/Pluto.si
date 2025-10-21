import { useEffect } from "preact/hooks";

export type ChatMessage = { id: number; role: "user" | "assistant"; content: string };

export default function Messages(props: { items: ChatMessage[] }) {
  useEffect(() => {
    // trigger KaTeX auto-render when messages change
    const renderMath = () => {
      const w = globalThis as unknown as { 
        renderMathInElement?: (el: Element, opts: { delimiters: { left: string; right: string; display: boolean }[] }) => void;
        functionPlot?: (opts: { target: Element; width: number; height: number; grid: boolean; data: Array<{ fn: string; color: string }> }) => void;
      };
      
      if (w.renderMathInElement) {
        const messagesEl = document.getElementById("messages");
        if (messagesEl) {
          w.renderMathInElement(messagesEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\(", right: "\\)", display: false },
              { left: "\\[", right: "\\]", display: true },
            ],
          });
        }
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

  // Parse content and extract graphs
  function parseContent(content: string) {
    const parts: Array<{ type: 'text' | 'graph', content: string }> = [];
    const graphRegex = /\[GRAPH:([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    
    while ((match = graphRegex.exec(content)) !== null) {
      // Add text before graph
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
      }
      // Add graph
      parts.push({ type: 'graph', content: match[1] });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.substring(lastIndex) });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content }];
  }

  return (
    <div id="messages" class="max-w-3xl mx-auto space-y-4">
      {props.items.map((m) => (
        <div class={m.role === "user" ? "bg-white/90 rounded-xl p-3" : "bg-gray-50 rounded-xl p-3"}>
          <div class="prose prose-sm max-w-none">
            {parseContent(m.content).map((part, idx) => {
              if (part.type === 'graph') {
                return (
                  <div 
                    key={idx}
                    class="graph-container my-4 w-full max-w-full overflow-x-auto" 
                    data-function={part.content}
                    style="height: min(400px, 50vh);"
                  />
                );
              } else {
                return (
                  <div key={idx} class="whitespace-pre-wrap">{part.content}</div>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


