import { useEffect, useRef, useState } from "preact/hooks";
import { normalizeLatex } from "../utils/latex.ts";
import RichContent from "./RichContent.tsx";

type FunctionPlotFn = (options: {
  target: Element;
  width: number;
  height: number;
  grid: boolean;
  xAxis: { domain: [number, number] };
  yAxis: { domain: [number, number] };
  data: Array<{ fn: string; color: string }>;
}) => void;

export type ChatMessage = { 
  id: number; 
  role: "user" | "assistant"; 
  content: string;
  topic?: string;
  difficulty?: number;
  isExercise?: boolean;
  subject?: string;
  imageUrl?: string;
  fileName?: string;
};

export default function Messages(props: { items: ChatMessage[] }) {
  const [solutionShownFor, setSolutionShownFor] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [checkResults, setCheckResults] = useState<
    Record<number, { correct: boolean; feedback: string }>
  >({});
  const [startedAt, setStartedAt] = useState<Record<number, number>>({});
  const [lang, setLang] = useState<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro'>('sl');
  const advancingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    setStartedAt((prev) => {
      const next = { ...prev };
      for (const m of props.items) {
        if (m.isExercise && next[m.id] == null) {
          next[m.id] = Date.now();
        }
      }
      return next;
    });
  }, [props.items]);

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
    const renderGraphs = () => {
      const w = globalThis as unknown as {
        functionPlot?: FunctionPlotFn;
      };
      if (!w.functionPlot) return;
      document.querySelectorAll(".graph-container").forEach((container) => {
        const funcStr = container.getAttribute("data-function");
        if (!funcStr || container.children.length > 0) return;
        try {
          const containerWidth = (container as HTMLElement).offsetWidth || 500;
          const width = Math.min(containerWidth, 500);
          const height = Math.min(400, globalThis.innerHeight * 0.5);
          w.functionPlot!({
            target: container,
            width,
            height,
            grid: true,
            xAxis: { domain: [-10, 10] },
            yAxis: { domain: [-10, 10] },
            data: [{ fn: funcStr, color: "#0f766e" }],
          });
        } catch (e) {
          (container as HTMLElement).innerHTML =
            `<div class="p-3 text-sm text-red-700">Graf ni uspel: ${funcStr}<div class="text-xs mt-1">${e}</div></div>`;
        }
      });
    };
    setTimeout(renderGraphs, 120);
    setTimeout(renderGraphs, 500);
  }, [props.items, checkResults]);

  // Check if message is an exercise (contains exercise trigger phrases)
  function isExercise(content: string): boolean {
    const triggers = {
      sl: ['Klikni \'Rešitev\'', 'za prikaz rešitve'],
      en: ['Click \'Solution\'', 'to show the solution'],
      it: ['Clicca \'Soluzione\'', 'per mostrare la soluzione'],
      de: ['Klicke \'Lösung\'', 'um die Lösung anzuzeigen'],
      fr: ['Clique \'Solution\'', 'pour afficher la solution'],
      es: ['Haz clic en \'Solución\'', 'para mostrar la solución'],
      pl: ['Kliknij \'Rozwiązanie\'', 'aby pokazać rozwiązanie'],
      ro: ['Click \'Soluție\'', 'pentru a afișa soluția']
    };
    
    return triggers[lang].some(trigger => content.includes(trigger));
  }

  async function handleCheckAnswer(m: ChatMessage) {
    const answer = (answers[m.id] || "").trim();
    if (!answer || checkingId === m.id) return;
    setCheckingId(m.id);
    try {
      const duration_ms = Math.max(
        0,
        Date.now() - (startedAt[m.id] || Date.now()),
      );
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise: m.content,
          answer,
          subject: m.subject || localStorage.getItem("pluto-subject") || "math",
          topic: m.topic,
          language: lang,
          difficulty: m.difficulty || 1,
          duration_ms,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const correct = Boolean(data.correct);
        const feedback = normalizeLatex(String(data.feedback || ""));
        setCheckResults((prev) => ({
          ...prev,
          [m.id]: { correct, feedback },
        }));
        if (correct) {
          setSolutionShownFor((prev) => new Set(prev).add(m.id));
          if (m.topic && !advancingRef.current.has(m.id)) {
            advancingRef.current.add(m.id);
            setTimeout(() => handleNextExercise(m.topic!), 900);
          }
        }
      } else {
        setCheckResults((prev) => ({
          ...prev,
          [m.id]: {
            correct: false,
            feedback: data.error || "Napaka pri preverjanju",
          },
        }));
      }
    } catch {
      setCheckResults((prev) => ({
        ...prev,
        [m.id]: { correct: false, feedback: "Napaka pri preverjanju" },
      }));
    } finally {
      setCheckingId(null);
    }
  }

  // Request solution for the exercise
  async function handleSolutionClick(exerciseContent: string, messageId: number, topic?: string) {
    // Mark that solution was requested for this message
    setSolutionShownFor(prev => new Set(prev).add(messageId));
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "solution_viewed",
        subject: localStorage.getItem("pluto-subject") || "math",
        topic,
        duration_ms: Math.max(0, Date.now() - (startedAt[messageId] || Date.now())),
      }),
    }).catch(() => {});
    const prompts = {
      sl: `Pokaži podrobno rešitev za to nalogo:\n\n${exerciseContent}\n\nNavodila:\n- Podaj vse korake rešitve\n- Razloži vsak korak\n- Uporabi matematične zapise (LaTeX)\n- Na koncu podaj končen odgovor`,
      en: `Show a detailed solution for this exercise:\n\n${exerciseContent}\n\nInstructions:\n- Provide all solution steps\n- Explain each step\n- Use mathematical notation (LaTeX)\n- Provide the final answer at the end`,
      it: `Mostra una soluzione dettagliata per questo esercizio:\n\n${exerciseContent}\n\nIstruzioni:\n- Fornisci tutti i passaggi della soluzione\n- Spiega ogni passaggio\n- Usa la notazione matematica (LaTeX)\n- Fornisci la risposta finale alla fine`,
      de: `Zeige eine detaillierte Lösung für diese Aufgabe:\n\n${exerciseContent}\n\nAnweisungen:\n- Gib alle Lösungsschritte an\n- Erkläre jeden Schritt\n- Verwende mathematische Notation (LaTeX)\n- Gib am Ende die endgültige Antwort`,
      fr: `Montre une solution détaillée pour cet exercice:\n\n${exerciseContent}\n\nInstructions:\n- Fournis toutes les étapes de la solution\n- Explique chaque étape\n- Utilise la notation mathématique (LaTeX)\n- Fournis la réponse finale à la fin`,
      es: `Muestra una solución detallada para este ejercicio:\n\n${exerciseContent}\n\nInstrucciones:\n- Proporciona todos los pasos de la solución\n- Explica cada paso\n- Usa notación matemática (LaTeX)\n- Proporciona la respuesta final al final`,
      pl: `Pokaż szczegółowe rozwiązanie tego zadania:\n\n${exerciseContent}\n\nInstrukcje:\n- Podaj wszystkie kroki rozwiązania\n- Wyjaśnij każdy krok\n- Użyj notacji matematycznej (LaTeX)\n- Podaj ostateczną odpowiedź na końcu`,
      ro: `Arată o soluție detaliată pentru acest exercițiu:\n\n${exerciseContent}\n\nInstrucțiuni:\n- Furnizează toți pașii soluției\n- Explică fiecare pas\n- Folosește notație matematică (LaTeX)\n- Furnizează răspunsul final la sfârșit`
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
          language: lang,
          subject: localStorage.getItem("pluto-subject") || "math",
          forceDeepSeek: true
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
    it: "Soluzione",
    de: "Lösung",
    fr: "Solution",
    es: "Solución",
    pl: "Rozwiązanie",
    ro: "Soluție"
  };

  const nextExerciseLabels = {
    sl: "Naslednja naloga",
    en: "Next exercise",
    it: "Esercizio successivo",
    de: "Nächste Übung",
    fr: "Exercice suivant",
    es: "Siguiente ejercicio",
    pl: "Następne zadanie",
    ro: "Exercițiul următor"
  };

  const difficultyLabels = {
    1: { sl: "Zelo enostavno", en: "Very Simple", it: "Molto Semplice", de: "Sehr einfach", fr: "Très simple", es: "Muy simple", pl: "Bardzo łatwe", ro: "Foarte simplu", color: "bg-green-100 text-green-800" },
    2: { sl: "Enostavno", en: "Simple", it: "Semplice", de: "Einfach", fr: "Simple", es: "Simple", pl: "Łatwe", ro: "Simplu", color: "bg-blue-100 text-blue-800" },
    3: { sl: "Srednje", en: "Medium", it: "Medio", de: "Mittel", fr: "Moyen", es: "Medio", pl: "Średni", ro: "Mediu", color: "bg-yellow-100 text-yellow-800" },
    4: { sl: "Težko", en: "Difficult", it: "Difficile", de: "Schwierig", fr: "Difficile", es: "Difícil", pl: "Trudne", ro: "Dificil", color: "bg-orange-100 text-orange-800" },
    5: { sl: "Zelo težko", en: "Very Difficult", it: "Molto Difficile", de: "Sehr schwierig", fr: "Très difficile", es: "Muy difícil", pl: "Bardzo trudne", ro: "Foarte dificil", color: "bg-red-100 text-red-800" }
  };

  return (
    <div id="messages" class="mx-auto max-w-3xl space-y-3 sm:space-y-4">
      {props.items.map((m, index) => {
        const isExerciseMsg = m.role === "assistant" &&
          (m.isExercise || isExercise(m.content));
        const hasCheckResult = Boolean(checkResults[m.id]);
        const showSolutionButton = isExerciseMsg &&
          !solutionShownFor.has(m.id);
        const showCheckPanel = showSolutionButton ||
          (isExerciseMsg && hasCheckResult);
        
        // Check if next message is a solution (for showing "Next exercise" button)
        const nextMessage = props.items[index + 1];
        const isSolutionShown = solutionShownFor.has(m.id) || 
          (nextMessage && nextMessage.role === "assistant" && !isExercise(nextMessage.content));
        // Don't show manual next button if we already auto-advanced after a correct check
        const showNextExerciseButton = m.isExercise && isSolutionShown && m.topic &&
          !checkResults[m.id]?.correct;
        
        // Get difficulty badge info
        const difficultyLevel = m.difficulty || 1;
        const difficultyInfo = difficultyLabels[Math.min(difficultyLevel, 5) as 1 | 2 | 3 | 4 | 5];
        
        return (
          <div
            class={m.role === "user"
              ? "ml-4 rounded-2xl rounded-br-md border border-teal-100 bg-teal-50/70 p-3 sm:ml-12 sm:p-4"
              : "mr-2 rounded-2xl rounded-bl-md border border-slate-200/80 bg-white/90 p-3 shadow-sm sm:mr-8 sm:p-4"}
          >
            {/* Difficulty badge for exercises */}
            {m.isExercise && m.difficulty && (
              <div class="mb-2.5 flex flex-wrap items-center gap-2">
                <span class={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${difficultyInfo.color}`}>
                  {difficultyInfo[lang]} · {difficultyLevel}/5
                </span>
                {m.topic && (
                  <span class="text-xs text-slate-500">
                    {m.topic}
                  </span>
                )}
              </div>
            )}
            
            {/* Image preview for uploaded images */}
            {m.imageUrl && (
              <div class="mb-3">
                <img 
                  src={m.imageUrl} 
                  alt={m.fileName || "Uploaded image"} 
                  class="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                  style="max-height: 400px; object-fit: contain;"
                />
                {m.fileName && (
                  <p class="text-xs text-gray-500 mt-1">📎 {m.fileName}</p>
                )}
              </div>
            )}
            
            <RichContent content={m.content} />
            
            {/* Answer check + solution for exercises */}
            {showCheckPanel && (
              <div class="mt-3 space-y-2.5 border-t border-slate-200/80 pt-3">
                {!checkResults[m.id]?.correct && (
                  <div class="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={answers[m.id] || ""}
                      onInput={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [m.id]: (e.target as HTMLInputElement).value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          (answers[m.id] || "").trim() &&
                          checkingId !== m.id
                        ) {
                          e.preventDefault();
                          handleCheckAnswer(m);
                        }
                      }}
                      placeholder={lang === "sl"
                        ? "Tvoj odgovor..."
                        : "Your answer..."}
                      class="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckAnswer(m)}
                      disabled={checkingId === m.id || !(answers[m.id] || "").trim()}
                      class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {checkingId === m.id
                        ? (lang === "sl" ? "Preverjam..." : "Checking...")
                        : (lang === "sl" ? "Preveri" : "Check")}
                    </button>
                  </div>
                )}
                {checkResults[m.id] && (
                  <div
                    class={`rounded-xl px-3.5 py-3 text-sm leading-relaxed ${
                      checkResults[m.id].correct
                        ? "border border-emerald-200/80 bg-emerald-50 text-emerald-900"
                        : "border border-amber-200/80 bg-amber-50 text-amber-950"
                    }`}
                  >
                    <div class="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-80">
                      <span>{checkResults[m.id].correct ? "✓" : "!"}</span>
                      <span>
                        {checkResults[m.id].correct
                          ? (lang === "sl" ? "Pravilno" : "Correct")
                          : (lang === "sl" ? "Poskusi znova" : "Try again")}
                      </span>
                    </div>
                    <RichContent content={checkResults[m.id].feedback} />
                    {checkResults[m.id].correct && m.topic && (
                      <p class="mt-2 text-xs text-emerald-700/80">
                        {lang === "sl"
                          ? "Nalagam naslednjo nalogo…"
                          : "Loading next exercise…"}
                      </p>
                    )}
                  </div>
                )}
                {!checkResults[m.id]?.correct && showSolutionButton && (
                  <button
                    type="button"
                    onClick={() => handleSolutionClick(m.content, m.id, m.topic)}
                    class="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {solutionButtonLabels[lang]}
                  </button>
                )}
              </div>
            )}
            
            {/* Next exercise button - shown after solution */}
            {showNextExerciseButton && (
              <div class="mt-3 border-t border-slate-200/80 pt-3">
                <button
                  type="button"
                  onClick={() => handleNextExercise(m.topic!)}
                  class="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
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


