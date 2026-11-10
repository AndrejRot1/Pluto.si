import { useState, useEffect, useRef } from "preact/hooks";
import {
  subjects,
  getSubject,
  type SubjectId,
  type LangCode,
} from "../data/subjects.ts";
import {
  mostUsedExercises,
  mostUsedTabLabel,
} from "../data/most-used-exercises.ts";

/** Desktop + mobile each mount YearSidebar — only one next-exercise run at a time. */
let nextExerciseLock = false;
let nextExerciseLockTimer: ReturnType<typeof setTimeout> | null = null;

function acquireNextExerciseLock(): boolean {
  if (nextExerciseLock) return false;
  nextExerciseLock = true;
  if (nextExerciseLockTimer) clearTimeout(nextExerciseLockTimer);
  // Safety unlock so a failed/early-return path cannot freeze generation forever
  nextExerciseLockTimer = setTimeout(() => {
    nextExerciseLock = false;
    nextExerciseLockTimer = null;
  }, 30_000);
  return true;
}

function releaseNextExerciseLock() {
  nextExerciseLock = false;
  if (nextExerciseLockTimer) {
    clearTimeout(nextExerciseLockTimer);
    nextExerciseLockTimer = null;
  }
}

export default function YearSidebar() {
  const [lang, setLang] = useState<LangCode>("sl");
  const [subjectId, setSubjectId] = useState<SubjectId>("math");
  const [activeTab, setActiveTab] = useState<
    "topics" | "exercises" | "popular"
  >("topics");
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const difficultyRef = useRef(1);
  const topicRef = useRef<string | null>(null);
  const subjectRef = useRef<SubjectId>("math");
  const langRef = useRef<LangCode>("sl");
  const generatingRef = useRef(false);
  const popularSetIdRef = useRef<string | null>(null);
  const generateExerciseRef = useRef<
    (
      topic: string,
      resetDifficulty?: boolean,
      difficultyOverride?: number,
    ) => Promise<void>
  >(() => Promise.resolve());
  const mostUsedClickRef = useRef<
    (id: string, label: string) => Promise<void>
  >(() => Promise.resolve());

  const subject = getSubject(subjectId);

  useEffect(() => {
    difficultyRef.current = difficultyLevel;
  }, [difficultyLevel]);
  useEffect(() => {
    topicRef.current = currentTopic;
  }, [currentTopic]);
  useEffect(() => {
    subjectRef.current = subjectId;
  }, [subjectId]);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);
  useEffect(() => {
    generatingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    const storedLang = (localStorage.getItem("pluto-lang") as LangCode) || "sl";
    setLang(storedLang);
    const storedSubject =
      (localStorage.getItem("pluto-subject") as SubjectId) || "math";
    if (subjects.some((s) => s.id === storedSubject)) {
      setSubjectId(storedSubject);
    }

    const handleLangChange = () => {
      setLang((localStorage.getItem("pluto-lang") as LangCode) || "sl");
    };
    globalThis.addEventListener("pluto-lang-change", handleLangChange);
    return () => {
      globalThis.removeEventListener("pluto-lang-change", handleLangChange);
    };
  }, []);

  function changeSubject(id: SubjectId) {
    setSubjectId(id);
    localStorage.setItem("pluto-subject", id);
    setCurrentTopic(null);
    setDifficultyLevel(1);
    popularSetIdRef.current = null;
    if (id !== "math" && activeTab === "popular") {
      setActiveTab("topics");
    }
    globalThis.dispatchEvent(
      new CustomEvent("pluto-subject-change", { detail: { subject: id } }),
    );
  }

  async function handleMostUsedClick(id: string, label: string) {
    if (generatingRef.current) {
      releaseNextExerciseLock();
      return;
    }
    closeMobileSidebar();
    popularSetIdRef.current = id;
    setCurrentTopic(label);
    topicRef.current = label;
    try {
      setIsGenerating(true);
      generatingRef.current = true;
      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-loading", { detail: true }),
      );

      const response = await fetch("/api/arnes-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, language: langRef.current }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Failed");
      }

      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-response", {
          detail: {
            content: data.reply,
            topic: label,
            difficulty: 2,
            isExercise: true,
            subject: "math",
          },
        }),
      );

      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "exercise_started",
          subject: "math",
          topic: label,
          difficulty: 2,
        }),
      }).catch(() => {});
    } catch (error) {
      console.error("Most-used exercise failed:", error);
      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-response", {
          detail: {
            content: langRef.current === "sl"
              ? "Naloge s strani trenutno ni bilo mogoče naložiti. Poskusi znova."
              : "Could not load the exercise from the source page. Please try again.",
            subject: "math",
          },
        }),
      );
    } finally {
      setIsGenerating(false);
      generatingRef.current = false;
      releaseNextExerciseLock();
      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-loading", { detail: false }),
      );
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById("mobile-sidebar");
    if (sidebar && globalThis.matchMedia("(max-width: 767px)").matches) {
      sidebar.classList.add("hidden");
    }
  }

  function handleTopicClick(topic: string) {
    closeMobileSidebar();
    popularSetIdRef.current = null;
    const subjectName = subject.label[lang];
    const prompts: Record<LangCode, string> = {
      sl:
        `Razloži temo "${topic}" pri predmetu ${subjectName}. Podaj:\n` +
        `1. Kratko, natančno definicijo\n2. Enostaven primer z rešitvijo\n3. Tipične napake\n4. Povezavo z drugimi temami`,
      en:
        `Explain the topic "${topic}" in ${subjectName}. Provide:\n` +
        `1. A precise short definition\n2. A simple worked example\n3. Common mistakes\n4. Links to related topics`,
      it: `Spiega l'argomento "${topic}" in ${subjectName}. Definizione, esempio, errori comuni, collegamenti.`,
      de: `Erkläre das Thema "${topic}" in ${subjectName}. Definition, Beispiel, typische Fehler, Verbindungen.`,
      fr: `Explique le sujet "${topic}" en ${subjectName}. Définition, exemple, erreurs fréquentes, liens.`,
      es: `Explica el tema "${topic}" en ${subjectName}. Definición, ejemplo, errores comunes y relaciones.`,
      pl: `Wyjaśnij temat "${topic}" z przedmiotu ${subjectName}. Definicja, przykład, typowe błędy, powiązania.`,
      ro: `Explică subiectul "${topic}" la ${subjectName}. Definiție, exemplu, greșeli tipice, legături.`,
    };
    globalThis.dispatchEvent(
      new CustomEvent("pluto-send", { detail: prompts[lang] || prompts.en }),
    );
  }

  async function handleExerciseClick(
    topic: string,
    resetDifficulty: boolean = true,
    difficultyOverride?: number,
  ) {
    if (generatingRef.current) {
      releaseNextExerciseLock();
      return;
    }
    if (typeof difficultyOverride !== "number") {
      closeMobileSidebar();
      popularSetIdRef.current = null;
    }
    try {
      const langNow = langRef.current;
      const subjectNow = subjectRef.current;
      const subjectMeta = getSubject(subjectNow);

      let currentDiff: number;
      if (typeof difficultyOverride === "number") {
        currentDiff = Math.min(Math.max(difficultyOverride, 1), 5);
        setCurrentTopic(topic);
        setDifficultyLevel(currentDiff);
        difficultyRef.current = currentDiff;
        topicRef.current = topic;
      } else if (resetDifficulty || topicRef.current !== topic) {
        currentDiff = 1;
        setCurrentTopic(topic);
        setDifficultyLevel(1);
        difficultyRef.current = 1;
        topicRef.current = topic;
      } else {
        currentDiff = difficultyRef.current;
      }

      setIsGenerating(true);
      generatingRef.current = true;
      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-loading", { detail: true }),
      );

      const difficultyDescriptors = {
        1: { sl: "zelo enostavno", en: "very simple", it: "molto semplice", de: "sehr einfach", fr: "très simple", es: "muy simple", pl: "bardzo łatwe", ro: "foarte simplu" },
        2: { sl: "enostavno", en: "simple", it: "semplice", de: "einfach", fr: "simple", es: "simple", pl: "łatwe", ro: "simplu" },
        3: { sl: "srednje težko", en: "medium difficulty", it: "difficoltà media", de: "mittlerer Schwierigkeitsgrad", fr: "difficulté moyenne", es: "dificultad media", pl: "średni poziom", ro: "dificultate medie" },
        4: { sl: "težko", en: "difficult", it: "difficile", de: "schwierig", fr: "difficile", es: "difícil", pl: "trudne", ro: "dificil" },
        5: { sl: "zelo težko", en: "very difficult", it: "molto difficile", de: "sehr schwierig", fr: "très difficile", es: "muy difícil", pl: "bardzo trudne", ro: "foarte dificil" },
      } as const;

      const diffDesc =
        difficultyDescriptors[Math.min(currentDiff, 5) as 1 | 2 | 3 | 4 | 5][langNow];
      const subjectName = subjectMeta.label[langNow];
      const variant = Math.random().toString(36).slice(2, 8);

      const needsDiagram = subjectNow === "chemistry" || subjectNow === "biology";
      const diagramHint = needsDiagram
        ? `\n- If the exercise benefits from a figure, include ONE simple educational SVG in a \`\`\`svg fence (cell/apparatus/molecule sketch). No fake image URLs.`
        : "";

      const prompts: Record<LangCode, string> = {
        sl: `Generiraj 1 ${diffDesc} nalogo iz predmeta ${subjectName}, tema "${topic}".
Navodila:
- Podaj samo nalogo (brez rešitve)
- Naloga naj bo jasna in primerna za srednjo šolo
- Vse formule v LaTeX: $...$ ali $$...$$; kemija vedno z $\\ce{...}$ (npr. $\\ce{H2O}$, $\\ce{2H2 + O2 -> 2H2O}$)
- Težavnost: ${diffDesc} (${currentDiff}/5)
- Variant ID: ${variant}${diagramHint}
- Na koncu dodaj vrstico: Klikni 'Rešitev' za prikaz rešitve`,
        en: `Generate 1 ${diffDesc} exercise for ${subjectName}, topic "${topic}".
Only the exercise (no solution).
All formulas in $...$ or $$...$$; chemistry always with $\\ce{...}$.
Difficulty ${currentDiff}/5. Variant ${variant}.${diagramHint}
End with: Click 'Solution' to show the solution`,
        it: `Genera 1 esercizio ${diffDesc} di ${subjectName}, argomento "${topic}". Solo esercizio, LaTeX/mhchem. Variant ${variant}.${diagramHint} Fine: Clicca 'Soluzione' per mostrare la soluzione`,
        de: `Generiere 1 ${diffDesc} Übung in ${subjectName}, Thema "${topic}". Nur Aufgabe, LaTeX/mhchem. Variant ${variant}.${diagramHint} Ende: Klicke 'Lösung' um die Lösung anzuzeigen`,
        fr: `Génère 1 exercice ${diffDesc} de ${subjectName}, sujet "${topic}". Seulement l'exercice, LaTeX/mhchem. Variant ${variant}.${diagramHint} Fin: Clique 'Solution' pour afficher la solution`,
        es: `Genera 1 ejercicio ${diffDesc} de ${subjectName}, tema "${topic}". Solo el ejercicio, LaTeX/mhchem. Variant ${variant}.${diagramHint} Fin: Haz clic en 'Solución' para mostrar la solución`,
        pl: `Wygeneruj 1 ${diffDesc} zadanie z ${subjectName}, temat "${topic}". Tylko treść, LaTeX/mhchem. Variant ${variant}.${diagramHint} Koniec: Kliknij 'Rozwiązanie' aby pokazać rozwiązanie`,
        ro: `Generează 1 exercițiu ${diffDesc} la ${subjectName}, subiect "${topic}". Doar enunțul, LaTeX/mhchem. Variant ${variant}.${diagramHint} Final: Click 'Soluție' pentru a afișa soluția`,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: prompts[langNow] || prompts.en,
          language: langNow,
          subject: subjectNow,
          forceDeepSeek: true,
        }),
      });
      const data = await response.json();

      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-response", {
          detail: {
            content: data.reply,
            topic,
            difficulty: currentDiff,
            isExercise: true,
            subject: subjectNow,
          },
        }),
      );

      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "exercise_started",
          subject: subjectNow,
          topic,
          difficulty: currentDiff,
        }),
      }).catch(() => {});
    } catch (error) {
      console.error("Failed to generate exercise:", error);
    } finally {
      setIsGenerating(false);
      generatingRef.current = false;
      releaseNextExerciseLock();
      globalThis.dispatchEvent(
        new CustomEvent("pluto-exercise-loading", { detail: false }),
      );
    }
  }

  generateExerciseRef.current = handleExerciseClick;
  mostUsedClickRef.current = handleMostUsedClick;

  useEffect(() => {
    const handleNextExercise = (e: Event) => {
      if (generatingRef.current || !acquireNextExerciseLock()) return;
      const ce = e as CustomEvent<{ topic: string }>;
      const topic = ce.detail?.topic;
      if (!topic) {
        releaseNextExerciseLock();
        return;
      }
      const popularId = popularSetIdRef.current;
      if (popularId) {
        setTimeout(() => {
          mostUsedClickRef.current(popularId, topic);
        }, 80);
        return;
      }
      const nextDiff = Math.min(difficultyRef.current + 1, 5);
      difficultyRef.current = nextDiff;
      setDifficultyLevel(nextDiff);
      setTimeout(() => {
        generateExerciseRef.current(topic, false, nextDiff);
      }, 80);
    };
    globalThis.addEventListener(
      "pluto-next-exercise",
      handleNextExercise as EventListener,
    );
    return () => {
      globalThis.removeEventListener(
        "pluto-next-exercise",
        handleNextExercise as EventListener,
      );
    };
  }, []);

  const tabLabels = {
    topics: { sl: "Teme", en: "Topics", it: "Argomenti", de: "Themen", fr: "Sujets", es: "Temas", pl: "Tematy", ro: "Subiecte" },
    exercises: { sl: "Naloge", en: "Exercises", it: "Esercizi", de: "Übungen", fr: "Exercices", es: "Ejercicios", pl: "Zadania", ro: "Exerciții" },
  };

  const generatingLabels = {
    sl: "Generiram nalogo...",
    en: "Generating exercise...",
    it: "Generazione esercizio...",
    de: "Übung wird generiert...",
    fr: "Génération d'exercice...",
    es: "Generando ejercicio...",
    pl: "Generowanie zadania...",
    ro: "Generare exercițiu...",
  };

  const popularLoading = {
    sl: "Nalagam nalogo s strani...",
    en: "Loading exercise from source...",
    it: "Caricamento esercizio...",
    de: "Aufgabe wird geladen...",
    fr: "Chargement de l'exercice...",
    es: "Cargando ejercicio...",
    pl: "Ładowanie zadania...",
    ro: "Se încarcă exercițiul...",
  };

  const showPopular = subjectId === "math";

  return (
    <aside class="flex h-full w-full flex-col bg-white p-3 sm:p-4">
      <div class="mb-3 grid grid-cols-2 gap-1.5">
        {subjects.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => changeSubject(s.id)}
            class={`min-h-[40px] rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
              subjectId === s.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span class="mr-1">{s.emoji}</span>
            {s.label[lang]}
          </button>
        ))}
      </div>

      <div class={`mb-3 grid gap-1 rounded-xl bg-slate-100 p-1 sm:mb-4 ${showPopular ? "grid-cols-3" : "grid-cols-2"}`}>
        <button
          type="button"
          onClick={() => setActiveTab("topics")}
          class={`min-h-[40px] rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
            activeTab === "topics"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {tabLabels.topics[lang]}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("exercises")}
          class={`min-h-[40px] rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
            activeTab === "exercises"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {tabLabels.exercises[lang]}
        </button>
        {showPopular && (
          <button
            type="button"
            onClick={() => setActiveTab("popular")}
            class={`min-h-[40px] rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
              activeTab === "popular"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {mostUsedTabLabel(lang)}
          </button>
        )}
      </div>

      {isGenerating && (
        <div class="mb-3 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 sm:mb-4">
          <div class="flex items-center gap-2">
            <div class="flex gap-1">
              <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-600" style="animation-delay: 0ms" />
              <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-600" style="animation-delay: 150ms" />
              <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-600" style="animation-delay: 300ms" />
            </div>
            <span class="text-xs font-medium text-sky-800 sm:text-sm">
              {activeTab === "popular"
                ? popularLoading[lang]
                : generatingLabels[lang]}
            </span>
          </div>
        </div>
      )}

      {activeTab === "popular" && showPopular
        ? (
          <div class="space-y-1">
            <p class="mb-2 px-1 text-xs text-slate-500">
              {lang === "sl"
                ? "Naloge s strani Arnes (mpavle1) — DeepSeek izbere in reši eno."
                : "Exercises from Arnes (mpavle1) — DeepSeek picks one and solves it."}
            </p>
            {mostUsedExercises.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleMostUsedClick(item.id, item.label[lang])}
                class="block w-full min-h-[44px] rounded-md px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-900 sm:min-h-0 sm:py-2"
              >
                {item.label[lang]}
              </button>
            ))}
          </div>
        )
        : (
          <div class="space-y-1">
            {subject.topics.map((category) => (
              <details class="group" key={category.title.en}>
                <summary class="flex min-h-[44px] cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50 sm:min-h-0 sm:py-2">
                  <span class="text-sm font-medium text-slate-700">
                    {category.title[lang]}
                  </span>
                  <span class="text-xs text-slate-400 transition-transform group-open:rotate-90">›</span>
                </summary>
                <div class="ml-1 mt-0.5 space-y-0.5 border-l border-slate-100 pl-2">
                  {category.items.map((item) => (
                    <button
                      type="button"
                      key={item.en}
                      onClick={() =>
                        activeTab === "topics"
                          ? handleTopicClick(item[lang])
                          : handleExerciseClick(item[lang])
                      }
                      class="block w-full min-h-[44px] rounded-md px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:min-h-0 sm:py-2"
                    >
                      {item[lang]}
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
    </aside>
  );
}
