import { useEffect, useRef, useState } from "preact/hooks";
import ChatComposer from "./ChatComposer.tsx";
import Messages, { type ChatMessage } from "./Messages.tsx";

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom when messages update
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    try {
      // Use non-streaming API for now to avoid issues
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const assistant: ChatMessage = { id: Date.now() + 1, role: "assistant", content: data.reply ?? "Oprostite, prišlo je do napake." };
        setMessages((m) => [...m, assistant]);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      console.error('Error in handleSend:', e);
      setMessages((m) => [...m, { id: Date.now() + 2, role: "assistant", content: "Prišlo je do napake pri obdelavi vprašanja." }]);
    } finally {
      setSending(false);
    }
  }

  function handleClear() {
    setMessages([]);
  }

  return (
    <div class="flex-1 flex flex-col h-full">
      {/* Scrollable messages area */}
      <div ref={scrollerRef} class="flex-1 overflow-y-auto bg-white">
        <div class="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div class="text-center text-gray-500 pt-16 px-4">
              <p class="text-lg mb-2">Pozdravljeni v pomočniku za matematiko.</p>
              <p class="text-sm">Na dnu je tipkovnica za matematične simbole in funkcije.</p>
            </div>
          ) : (
            <div class="px-4 py-4">
              <Messages items={messages} />
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed input area */}
      <div class="bg-white p-4 flex-shrink-0">
        <div class="max-w-3xl mx-auto">
          <ChatComposer />
        </div>
      </div>
      
      {/* Bridge: capture composer sends via custom event to avoid prop drilling after earlier API revert */}
      <ComposerBridge onSend={handleSend} onClear={handleClear} />
    </div>
  );
}

// Small helper to tap into composer value via a CustomEvent it dispatches
function ComposerBridge(props: { onSend: (text: string) => void; onClear: () => void }) {
  useEffect(() => {
    function onSendEvt(e: Event) {
      const ce = e as CustomEvent<string>;
      console.log('Received pluto-send event:', ce.detail);
      props.onSend(ce.detail);
    }
    function onClearEvt() {
      console.log('Received pluto-clear event');
      props.onClear();
    }
    globalThis.addEventListener("pluto-send", onSendEvt as EventListener);
    globalThis.addEventListener("pluto-clear", onClearEvt as EventListener);
    return () => {
      globalThis.removeEventListener("pluto-send", onSendEvt as EventListener);
      globalThis.removeEventListener("pluto-clear", onClearEvt as EventListener);
    };
  }, [props.onSend, props.onClear]);
  return null;
}


