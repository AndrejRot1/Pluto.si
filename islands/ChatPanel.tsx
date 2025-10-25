import { useEffect, useRef, useState } from "preact/hooks";
import ChatComposer from "./ChatComposer.tsx";
import Messages, { type ChatMessage } from "./Messages.tsx";

const thinkingText = {
  sl: "Razmišljam...",
  en: "Thinking...",
  it: "Sto pensando...",
  de: "Denke nach...",
  fr: "Je réfléchis...",
  es: "Pensando...",
  pl: "Myślę...",
  ro: "Mă gândesc..."
};

export type ExtendedChatMessage = ChatMessage & {
  topic?: string;
  difficulty?: number;
  isExercise?: boolean;
  imageUrl?: string;
  fileName?: string;
};

export default function ChatPanel(props?: {
  profile?: {
    subscription_status: string;
    trial_ends_at: string;
  }
}) {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lang, setLang] = useState<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro'>('sl');
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isTrial = props?.profile?.subscription_status === 'trial';

  useEffect(() => {
    // Initialize language from localStorage
    const stored = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro' || 'sl';
    setLang(stored);

    // Listen for language changes
    const handleLangChange = () => {
      const newLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro' || 'sl';
      setLang(newLang);
    };
    globalThis.addEventListener('pluto-lang-change', handleLangChange);

    return () => {
      globalThis.removeEventListener('pluto-lang-change', handleLangChange);
    };
  }, []);

  useEffect(() => {
    // scroll to bottom when messages update or thinking state changes
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  // Helper function to wrap LaTeX expressions in delimiters
  function wrapLatex(text: string): string {
    // If already has delimiters, return as-is
    if (text.includes('$') || text.includes('\\[') || text.includes('\\(')) {
      return text;
    }
    
    // Check if text contains LaTeX commands or math notation
    const hasLatexCommand = /\\(int|frac|sqrt|sum|prod|lim|sin|cos|tan|ln|log|pi|infty|to|leq|geq|neq|left|right|begin|end|text|partial|nabla|times|div|pm)/.test(text);
    const hasMathNotation = /[\^_{}]/.test(text) && /[a-zA-Z0-9]/.test(text);
    
    if (hasLatexCommand || hasMathNotation) {
      // Wrap inline LaTeX with $...$
      return `$${text}$`;
    }
    
    return text;
  }

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const wrappedContent = wrapLatex(trimmed);
    console.log('Original text:', trimmed);
    console.log('Wrapped content:', wrappedContent);
    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: wrappedContent };
    setMessages((m) => [...m, userMsg]);
    setSending(true);
    setThinking(true);
    try {
      // Get language from localStorage
      const language = localStorage.getItem('pluto-lang') || 'sl';
      
      // Use non-streaming API for now to avoid issues
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, language }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const assistant: ChatMessage = { id: Date.now() + 1, role: "assistant", content: data.reply ?? "Oprostite, prišlo je do napake." };
        setThinking(false);
        setMessages((m) => [...m, assistant]);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      console.error('Error in handleSend:', e);
      setThinking(false);
      setMessages((m) => [...m, { id: Date.now() + 2, role: "assistant", content: "Prišlo je do napake pri obdelavi vprašanja." }]);
    } finally {
      setSending(false);
    }
  }

  function handleClear() {
    setMessages([]);
  }

  function handleExerciseResponse(data: { content: string; topic?: string; difficulty?: number; isExercise?: boolean }) {
    // Add only AI response to messages (no user prompt shown)
    const assistantMsg: ExtendedChatMessage = { 
      id: Date.now(), 
      role: "assistant", 
      content: data.content,
      topic: data.topic,
      difficulty: data.difficulty,
      isExercise: data.isExercise
    };
    setMessages((m) => [...m, assistantMsg]);
    setThinking(false); // Stop thinking indicator
  }

  function handleExerciseLoading(isLoading: boolean) {
    setThinking(isLoading);
  }

  async function handleImageUpload(data: { imageUrl: string; text: string; fileName: string }) {
    console.log('Image upload data:', { text: data.text, fileName: data.fileName, hasImage: !!data.imageUrl });
    
    // Add user message with image
    const userMsg: ExtendedChatMessage = {
      id: Date.now(),
      role: "user",
      content: data.text || "Prosim reši to matematično nalogo iz slike:",
      imageUrl: data.imageUrl,
      fileName: data.fileName
    };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);

    // Send extracted text to DeepSeek
    try {
      const language = localStorage.getItem('pluto-lang') || 'sl';
      
      // If no text extracted, ask user to describe the problem
      if (!data.text || data.text.trim().length === 0) {
        console.warn('No text extracted from OCR');
        setThinking(false);
        const errorMsg: ExtendedChatMessage = { 
          id: Date.now() + 1, 
          role: "assistant", 
          content: language === 'sl' 
            ? "Žal nisem mogel prebrati besedila iz slike. Prosim opiši nalogo z besedami ali poskusi z bolj čitljivo sliko." 
            : "Sorry, I couldn't extract text from the image. Please describe the problem or try a clearer image." 
        };
        setMessages((m) => [...m, errorMsg]);
        return;
      }

      const prompt = `Solve this math problem: ${data.text}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt, language }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const resData = await res.json();
      const assistantMsg: ExtendedChatMessage = { 
        id: Date.now() + 1, 
        role: "assistant", 
        content: resData.reply 
      };
      setMessages((m) => [...m, assistantMsg]);
      setThinking(false);
    } catch (error) {
      console.error("Error processing image:", error);
      setThinking(false);
      const language = localStorage.getItem('pluto-lang') || 'sl';
      setMessages((m) => [
        ...m,
        { 
          id: Date.now() + 1, 
          role: "assistant", 
          content: language === 'sl' 
            ? "Žal je prišlo do napake pri obdelavi slike. Prosim poskusi znova." 
            : "Sorry, I couldn't process the image. Please try again." 
        }
      ]);
    }
  }

  const upgradeText = {
    sl: {
      title: "Nadgradite na Plus",
      desc: "Neomejene naloge, koraki rešitev in vse funkcije",
      button: "Nadgradite",
    },
    en: {
      title: "Upgrade to Plus",
      desc: "Unlimited exercises, step-by-step solutions, and all features",
      button: "Upgrade",
    },
    it: {
      title: "Passa a Plus",
      desc: "Esercizi illimitati, soluzioni passo-passo e tutte le funzionalità",
      button: "Aggiorna",
    },
    de: {
      title: "Auf Plus upgraden",
      desc: "Unbegrenzte Aufgaben, Schritt-für-Schritt-Lösungen und alle Funktionen",
      button: "Upgraden",
    },
    fr: {
      title: "Passer à Plus",
      desc: "Exercices illimités, solutions étape par étape et toutes les fonctionnalités",
      button: "Mettre à niveau",
    },
    es: {
      title: "Actualizar a Plus",
      desc: "Ejercicios ilimitados, soluciones paso a paso y todas las funciones",
      button: "Actualizar",
    },
    pl: {
      title: "Przejdź na Plus",
      desc: "Nieograniczone ćwiczenia, rozwiązania krok po kroku i wszystkie funkcje",
      button: "Uaktualnij",
    },
    ro: {
      title: "Treci la Plus",
      desc: "Exerciții nelimitate, soluții pas cu pas și toate funcțiile",
      button: "Actualizează",
    },
  };
  
  return (
    <div class="flex-1 flex flex-col h-full">
      {/* Upgrade banner for trial users - ChatGPT style */}
      {isTrial && (
        <div class="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex-shrink-0">
          <div class="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <div class="text-center sm:text-left">
              <h3 class="text-xs sm:text-sm font-medium text-gray-900 mb-0.5">{upgradeText[lang].title}</h3>
              <p class="text-xs text-gray-600">{upgradeText[lang].desc}</p>
            </div>
            <a 
              href="/settings"
              class="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              {upgradeText[lang].button}
            </a>
          </div>
        </div>
      )}
      
      {/* Scrollable messages area */}
      <div ref={scrollerRef} class="flex-1 overflow-y-auto bg-white">
        <div class="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div class="text-center text-gray-500 pt-12 sm:pt-16 px-4">
              <p class="text-base sm:text-lg mb-2">Pozdravljeni v pomočniku za matematiko.</p>
              <p class="text-xs sm:text-sm">Na dnu je tipkovnica za matematične simbole in funkcije.</p>
            </div>
          ) : (
            <div class="px-3 sm:px-4 py-3 sm:py-4">
              <Messages items={messages} />
              {thinking && (
                <div class="bg-gray-50 rounded-xl p-3 sm:p-4 mt-3 sm:mt-4 flex items-center gap-3">
                  <div class="flex gap-1">
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                  <span class="text-xs sm:text-sm text-gray-600">{thinkingText[lang]}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
        {/* Fixed input area */}
        <div class="bg-white p-2 sm:p-4 flex-shrink-0">
          <div class="max-w-3xl mx-auto">
            <ChatComposer />
          </div>
        </div>
      
      {/* Bridge: capture composer sends via custom event to avoid prop drilling after earlier API revert */}
      <ComposerBridge 
        onSend={handleSend} 
        onClear={handleClear} 
        onExerciseResponse={handleExerciseResponse}
        onExerciseLoading={handleExerciseLoading}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}

// Small helper to tap into composer value via a CustomEvent it dispatches
function ComposerBridge(props: { 
  onSend: (text: string) => void; 
  onClear: () => void;
  onExerciseResponse?: (data: { content: string; topic?: string; difficulty?: number; isExercise?: boolean }) => void;
  onExerciseLoading?: (isLoading: boolean) => void;
  onImageUpload?: (data: { imageUrl: string; text: string; fileName: string }) => void;
}) {
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
    function onExerciseResponseEvt(e: Event) {
      const ce = e as CustomEvent<{ content: string; topic?: string; difficulty?: number; isExercise?: boolean }>;
      console.log('Received pluto-exercise-response event:', ce.detail);
      if (props.onExerciseResponse) {
        props.onExerciseResponse(ce.detail);
      }
    }
    function onExerciseLoadingEvt(e: Event) {
      const ce = e as CustomEvent<boolean>;
      console.log('Received pluto-exercise-loading event:', ce.detail);
      if (props.onExerciseLoading) {
        props.onExerciseLoading(ce.detail);
      }
    }
    function onImageUploadEvt(e: Event) {
      const ce = e as CustomEvent<{ imageUrl: string; text: string; fileName: string }>;
      console.log('Received pluto-image-upload event:', ce.detail);
      if (props.onImageUpload) {
        props.onImageUpload(ce.detail);
      }
    }
    globalThis.addEventListener("pluto-send", onSendEvt as EventListener);
    globalThis.addEventListener("pluto-clear", onClearEvt as EventListener);
    globalThis.addEventListener("pluto-exercise-response", onExerciseResponseEvt as EventListener);
    globalThis.addEventListener("pluto-exercise-loading", onExerciseLoadingEvt as EventListener);
    globalThis.addEventListener("pluto-image-upload", onImageUploadEvt as EventListener);
    return () => {
      globalThis.removeEventListener("pluto-send", onSendEvt as EventListener);
      globalThis.removeEventListener("pluto-clear", onClearEvt as EventListener);
      globalThis.removeEventListener("pluto-exercise-response", onExerciseResponseEvt as EventListener);
      globalThis.removeEventListener("pluto-exercise-loading", onExerciseLoadingEvt as EventListener);
      globalThis.removeEventListener("pluto-image-upload", onImageUploadEvt as EventListener);
    };
  }, [props.onSend, props.onClear, props.onExerciseResponse, props.onExerciseLoading, props.onImageUpload]);
  return null;
}


