import { useEffect } from "preact/hooks";

export type ChatMessage = { id: number; role: "user" | "assistant"; content: string };

export default function Messages(props: { items: ChatMessage[] }) {
  useEffect(() => {
    // trigger KaTeX auto-render when messages change
    const renderMath = () => {
      const w = globalThis as unknown as { renderMathInElement?: (el: Element, opts: { delimiters: { left: string; right: string; display: boolean }[] }) => void };
      console.log('KaTeX available:', !!w.renderMathInElement);
      console.log('Messages count:', props.items.length);
      
      if (w.renderMathInElement) {
        const messagesEl = document.getElementById("messages");
        console.log('Messages element found:', !!messagesEl);
        if (messagesEl) {
          console.log('Messages element content:', messagesEl.innerHTML.substring(0, 200));
          w.renderMathInElement(messagesEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\(", right: "\\)", display: false },
              { left: "\\[", right: "\\]", display: true },
            ],
          });
          console.log('KaTeX rendering triggered');
        }
      } else {
        console.log('KaTeX not available, checking window object:', Object.keys(globalThis));
      }
    };
    
    // Try multiple times to ensure KaTeX is loaded
    setTimeout(renderMath, 100);
    setTimeout(renderMath, 500);
    setTimeout(renderMath, 1000);
  }, [props.items]);

  return (
    <div id="messages" class="max-w-3xl mx-auto space-y-4">
      {props.items.map((m) => (
        <div class={m.role === "user" ? "bg-white/90 rounded-xl p-3" : "bg-gray-50 rounded-xl p-3"}>
          <div class="prose prose-sm max-w-none whitespace-pre-wrap">
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}


