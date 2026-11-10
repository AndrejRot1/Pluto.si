import { useEffect, useRef, useState } from "preact/hooks";

type KeyboardKey = { label: string; insert: string; cursorOffset?: number };
type KeyboardCategory = { id: string; label: string; keys: KeyboardKey[] };

export default function ChatComposer() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [activeCat, setActiveCat] = useState<string>("osnovno");
  const [isDragging, setIsDragging] = useState(false);
  const [lang, setLang] = useState<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro'>('sl');
  const [uploading, setUploading] = useState(false);
  const [template, setTemplate] = useState<
    | { type: "integral-def" | "integral-indef" }
    | { type: "power" }
    | { type: "root" }
    | { type: "fraction" }
    | { type: "piecewise" }
    | null
  >(null);

  useEffect(() => {
    const stored = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro' || 'sl';
    setLang(stored);

    const handleLangChange = () => {
      const newLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro' || 'sl';
      setLang(newLang);
    };
    globalThis.addEventListener('pluto-lang-change', handleLangChange);

    return () => {
      globalThis.removeEventListener('pluto-lang-change', handleLangChange);
    };
  }, []);

  function insertAtCaret(text: string, cursorOffset?: number) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    // Ensure focus so selectionStart/End are reliable across browsers
    textarea.focus();
    const selStart = (typeof textarea.selectionStart === "number") ? textarea.selectionStart : value.length;
    const selEnd = (typeof textarea.selectionEnd === "number") ? textarea.selectionEnd : value.length;
    const start = selStart;
    const end = selEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const next = before + text + after;
    setValue(next);
    // Place caret smartly
    queueMicrotask(() => {
      const pos = start + (cursorOffset ?? text.length);
      textarea.setSelectionRange(pos, pos);
      autoResize();
    });
  }

  function autoResize() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const max =
      globalThis.matchMedia("(max-width: 639px)").matches
        ? 120
        : globalThis.matchMedia("(max-width: 1023px)").matches
        ? 160
        : 220;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, max) + "px";
  }

  async function handleImageDrop(files: File[]) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploading(true);

    for (const file of imageFiles) {
      try {
        // Convert image to base64 for preview
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const base64 = await base64Promise;

        // Send image to OCR endpoint
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', lang);

        const response = await fetch('/api/ocr', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('OCR failed');
        }

        const data = await response.json();
        const extractedText = data.text || '';

        console.log('OCR extracted:', extractedText);

        // Dispatch custom event with image and extracted text
        const event = new CustomEvent('pluto-image-upload', {
          detail: {
            imageUrl: base64,
            text: extractedText,
            fileName: file.name
          }
        });
        globalThis.dispatchEvent(event);

      } catch (error) {
        console.error('Image processing error:', error);
        alert('Failed to process image. Please try again.');
      }
    }

    setUploading(false);
  }

  const translations = {
    sl: { basic: "Osnovno", functions: "Funkcije", integrals: "Integrali", templates: "Vstavi", hide: "Skrij", show: "Pokaži", placeholder: "Vprašaj tutorja…", send: "Pošlji", clear: "Izbriši", attachment: "priponka" },
    en: { basic: "Basic", functions: "Functions", integrals: "Integrals", templates: "Insert", hide: "Hide", show: "Show", placeholder: "Ask the tutor…", send: "Send", clear: "Clear", attachment: "attachment" },
    it: { basic: "Base", functions: "Funzioni", integrals: "Integrali", templates: "Inserisci", hide: "Nascondi", show: "Mostra", placeholder: "Chiedi al tutor…", send: "Invia", clear: "Cancella", attachment: "allegato" },
    de: { basic: "Basis", functions: "Funktionen", integrals: "Integrale", templates: "Einfügen", hide: "Weg", show: "An", placeholder: "Tutor fragen…", send: "Senden", clear: "Löschen", attachment: "Anhang" },
    fr: { basic: "Base", functions: "Fonctions", integrals: "Intégrales", templates: "Insérer", hide: "Masquer", show: "Afficher", placeholder: "Demander au tuteur…", send: "Envoyer", clear: "Effacer", attachment: "pièce jointe" },
    es: { basic: "Básico", functions: "Funciones", integrals: "Integrales", templates: "Insertar", hide: "Ocultar", show: "Mostrar", placeholder: "Pregunta al tutor…", send: "Enviar", clear: "Borrar", attachment: "adjunto" },
    pl: { basic: "Podstawy", functions: "Funkcje", integrals: "Całki", templates: "Wstaw", hide: "Ukryj", show: "Pokaż", placeholder: "Zapytaj tutora…", send: "Wyślij", clear: "Wyczyść", attachment: "załącznik" },
    ro: { basic: "Bază", functions: "Funcții", integrals: "Integrale", templates: "Inserează", hide: "Ascunde", show: "Arată", placeholder: "Întreabă tutorele…", send: "Trimite", clear: "Șterge", attachment: "atașament" }
  };

  const t = translations[lang];

  const categories: KeyboardCategory[] = [
    {
      id: "osnovno",
      label: t.basic,
      keys: [
        { label: "π", insert: "\\pi" },
        { label: "∞", insert: "\\infty" },
        { label: "≤", insert: "\\leq" },
        { label: "≥", insert: "\\geq" },
        { label: "≠", insert: "\\neq" },
        { label: "±", insert: "\\pm" },
        { label: "×", insert: "\\times" },
        { label: "÷", insert: "\\div" },
        { label: "√", insert: "\\sqrt{}", cursorOffset: 6 },
      ],
    },
    {
      id: "funkcije",
      label: t.functions,
      keys: [
        { label: "sin", insert: "\\sin()", cursorOffset: 5 },
        { label: "cos", insert: "\\cos()", cursorOffset: 5 },
        { label: "tan", insert: "\\tan()", cursorOffset: 5 },
        { label: "ln", insert: "\\ln()", cursorOffset: 4 },
        { label: "log", insert: "\\log_{10}()", cursorOffset: 11 },
        { label: "e^x", insert: "e^{x}" },
        { label: "|x|", insert: "\\left| \\right|", cursorOffset: 7 },
      ],
    },
    {
      id: "integrali",
      label: t.integrals,
      keys: [
        { label: "∫ a→b", insert: "__TEMPLATE_INTEGRAL_DEF__" },
        { label: "∫ f(x) dx", insert: "__TEMPLATE_INTEGRAL_INDEF__" },
        { label: "∫ u dv", insert: "\\int u \\, dv" },
      ],
    },
    {
      id: "vstavljanje",
      label: t.templates,
      keys: [
        { label: "x^n", insert: "__TEMPLATE_POWER__" },
        { label: "a/b", insert: "__TEMPLATE_FRACTION__" },
        { label: "ⁿ√x", insert: "__TEMPLATE_ROOT__" },
        { label: "∫ a→b", insert: "__TEMPLATE_INTEGRAL_DEF__" },
        { label: "lim", insert: "\\lim_{x \\to }", cursorOffset: 1 },
      ],
    },
  ];

  // No attachment state: dropped files are inserted as symbolic tags only

  return (
    <div
      class={`relative rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm sm:p-2 ${isDragging ? "ring-2 ring-teal-400" : ""} ${uploading ? "pointer-events-none opacity-50" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const dt = e.dataTransfer;
        if (!dt) return;
        const text = dt.getData("text/plain");
        if (text) {
          insertAtCaret(text);
        }
        if (dt.files && dt.files.length > 0) {
          const files = Array.from(dt.files);
          handleImageDrop(files);
        }
      }}
    >
      {uploading && (
        <div class="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl z-10">
          <div class="flex items-center gap-2">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
            <span class="text-sm text-gray-700">Processing image...</span>
          </div>
        </div>
      )}
      {/* Input + primary actions always visible above keyboard */}
      <div class="flex items-end gap-2 px-1 pt-1">
        <textarea
          ref={textareaRef}
          class="min-w-0 flex-1 resize-none rounded bg-transparent px-2 pt-2 pb-2 text-base leading-6 outline-none placeholder:text-gray-400 md:px-3 md:text-sm"
          rows={2}
          enterkeyhint="send"
          autocomplete="off"
          autocorrect="off"
          value={value}
          onInput={(e) => {
            const target = e.currentTarget as HTMLTextAreaElement;
            setValue(target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const text = value.trim();
              if (!text) return;
              const evt = new CustomEvent("pluto-send", { detail: text });
              globalThis.dispatchEvent(evt);
              setValue("");
            }
          }}
          placeholder={t.placeholder}
        />
        <div class="mb-1 flex shrink-0 items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.files && input.files.length > 0) {
                const files = Array.from(input.files);
                handleImageDrop(files);
                input.value = "";
              }
            }}
          />
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 md:h-9 md:w-9"
            aria-label={t.attachment}
            title={t.attachment}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5 text-gray-700">
              <path d="M16.5 6.75v7.5a4.5 4.5 0 1 1-9 0v-9a3 3 0 1 1 6 0v8.25a1.5 1.5 0 1 1-3 0V7.5h-1.5v6.75a3 3 0 1 0 6 0v-8.25a4.5 4.5 0 1 0-9 0v9a6 6 0 1 0 12 0v-7.5h-1.5z" />
            </svg>
          </button>
          <button
            type="button"
            class="hidden h-10 items-center justify-center rounded-xl bg-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-300 sm:inline-flex md:h-9"
            onClick={() => {
              const evt = new CustomEvent("pluto-clear");
              globalThis.dispatchEvent(evt);
            }}
          >
            {t.clear}
          </button>
          <button
            type="button"
            class="flex h-10 min-w-[2.75rem] items-center justify-center rounded-xl bg-teal-800 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 md:h-9 md:px-4"
            onClick={() => {
              const text = value.trim();
              if (!text) return;
              const evt = new CustomEvent("pluto-send", { detail: text });
              globalThis.dispatchEvent(evt);
              setValue("");
            }}
          >
            <span class="hidden sm:inline">{t.send}</span>
            <span class="sm:hidden">↑</span>
          </button>
        </div>
      </div>

      {/* Categories — full width, scrollable on narrow screens */}
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 pb-1">
        {categories.map((c) => (
          <button
            type="button"
            key={c.id}
            class={
              "min-h-[32px] shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors " +
              (activeCat === c.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200")
            }
            onClick={() => {
              setActiveCat(c.id);
              setExpanded(true);
            }}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          class="ml-auto min-h-[32px] shrink-0 rounded-lg px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
          onClick={() => setExpanded((v) => !v)}
          aria-pressed={expanded}
        >
          {expanded ? t.hide : t.show}
        </button>
      </div>

      {/* Math keyboard — full-width grid; scroll if tall on short phones */}
      {expanded && (
        <div class="max-h-[min(30vh,11rem)] overflow-y-auto overscroll-contain px-1.5 pb-1 sm:max-h-[14rem] md:max-h-none md:overflow-visible">
          <div class="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-8 lg:flex lg:flex-wrap lg:gap-1.5">
            {categories
              .find((c) => c.id === activeCat)!
              .keys.map((k) => (
                <button
                  type="button"
                  key={k.label + k.insert}
                  class="flex min-h-[42px] touch-manipulation items-center justify-center rounded-lg bg-slate-100 px-1.5 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-slate-200 active:scale-[0.98] sm:min-h-[40px] lg:min-h-[2.25rem] lg:min-w-[2.5rem] lg:px-2.5 lg:py-1.5"
                  onClick={() => {
                    if (k.insert === "__TEMPLATE_INTEGRAL_DEF__") {
                      setTemplate({ type: "integral-def" });
                      return;
                    }
                    if (k.insert === "__TEMPLATE_INTEGRAL_INDEF__") {
                      setTemplate({ type: "integral-indef" });
                      return;
                    }
                    if (k.insert === "__TEMPLATE_POWER__") {
                      setTemplate({ type: "power" });
                      return;
                    }
                    if (k.insert === "__TEMPLATE_ROOT__") {
                      setTemplate({ type: "root" });
                      return;
                    }
                    if (k.insert === "__TEMPLATE_FRACTION__") {
                      setTemplate({ type: "fraction" });
                      return;
                    }
                    if (k.insert === "__TEMPLATE_PIECEWISE__") {
                      setTemplate({ type: "piecewise" });
                      return;
                    }
                    insertAtCaret(k.insert, k.cursorOffset);
                  }}
                >
                  {k.label}
                </button>
              ))}
          </div>
        </div>
      )}
      {template && (
        <TemplateBar
          template={template}
          onCancel={() => setTemplate(null)}
          onInsert={(text) => {
            insertAtCaret(text);
            setTemplate(null);
          }}
        />
      )}
    </div>
  );
}

function TemplateBar(props: {
  template: { type: "integral-def" | "integral-indef" | "power" | "root" | "fraction" | "piecewise" };
  onInsert: (text: string) => void;
  onCancel: () => void;
}) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [fx, setFx] = useState("");
  const [dx, setDx] = useState("x");
  const [base, setBase] = useState("x");
  const [exp, setExp] = useState("2");
  const [rootN, setRootN] = useState("2");
  const [rootArg, setRootArg] = useState("x");
  const [num, setNum] = useState("");
  const [den, setDen] = useState("");
  const [pwCond1, setPwCond1] = useState("");
  const [pwExpr1, setPwExpr1] = useState("");
  const [pwCond2, setPwCond2] = useState("");
  const [pwExpr2, setPwExpr2] = useState("");

  function build() {
    switch (props.template.type) {
      case "integral-def":
        return `\\int_{${a}}^{${b}} ${fx} \\, d${dx}`;
      case "integral-indef":
        return `\\int ${fx} \\, d${dx}`;
      case "power":
        return `${base}^{${exp}}`;
      case "root":
        return `\\sqrt[${rootN}]{${rootArg}}`;
      case "fraction":
        return `\\frac{${num}}{${den}}`;
      case "piecewise":
        return `\\begin{cases} ${pwExpr1} & \\text{če } ${pwCond1} \\\\ ${pwExpr2} & \\text{če } ${pwCond2} \\end{cases}`;
    }
  }

  const field =
    "min-h-[40px] min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-base outline-none focus:border-teal-500 sm:min-h-0 sm:text-sm";
  const actions =
    "mt-2 flex w-full gap-2 sm:ml-auto sm:mt-0 sm:w-auto";
  const cancelBtn =
    "min-h-[40px] flex-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 sm:flex-none";
  const insertBtn =
    "min-h-[40px] flex-1 rounded-lg bg-teal-800 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 sm:flex-none";

  return (
    <div class="mt-2 border-t border-slate-100 px-1.5 pt-2 sm:px-2">
      {props.template.type === "integral-def" && (
        <div class="flex flex-col gap-2 rounded-xl border border-sky-200 bg-sky-50 p-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 sm:p-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xl">∫</span>
            <input class={`${field} max-w-[4.5rem]`} placeholder="a" value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} />
            <span>→</span>
            <input class={`${field} max-w-[4.5rem]`} placeholder="b" value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} />
            <input class={field} placeholder="f(x)" value={fx} onInput={(e) => setFx((e.target as HTMLInputElement).value)} />
            <span>d</span>
            <input class={`${field} max-w-[3rem]`} placeholder="x" value={dx} onInput={(e) => setDx((e.target as HTMLInputElement).value)} />
          </div>
          <div class={actions}>
            <button type="button" class={cancelBtn} onClick={props.onCancel}>Prekliči</button>
            <button type="button" class={insertBtn} onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "integral-indef" && (
        <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <div class="flex flex-wrap items-center gap-2">
            <span>∫</span>
            <input class={field} placeholder="f(x)" value={fx} onInput={(e) => setFx((e.target as HTMLInputElement).value)} />
            <span>d</span>
            <input class={`${field} max-w-[3rem]`} placeholder="x" value={dx} onInput={(e) => setDx((e.target as HTMLInputElement).value)} />
          </div>
          <div class={actions}>
            <button type="button" class={cancelBtn} onClick={props.onCancel}>Prekliči</button>
            <button type="button" class={insertBtn} onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "power" && (
        <div class="flex flex-col gap-2 rounded-xl border border-violet-200 bg-violet-50 p-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <div class="flex flex-wrap items-center gap-2">
            <input class={field} placeholder="baza" value={base} onInput={(e) => setBase((e.target as HTMLInputElement).value)} />
            <span class="font-bold">^</span>
            <input class={field} placeholder="n" value={exp} onInput={(e) => setExp((e.target as HTMLInputElement).value)} />
          </div>
          <div class={actions}>
            <button type="button" class={cancelBtn} onClick={props.onCancel}>Prekliči</button>
            <button type="button" class={insertBtn} onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "root" && (
        <div class="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <div class="flex flex-wrap items-center gap-2">
            <span>ⁿ√</span>
            <input class={`${field} max-w-[4rem]`} placeholder="n" value={rootN} onInput={(e) => setRootN((e.target as HTMLInputElement).value)} />
            <input class={field} placeholder="x" value={rootArg} onInput={(e) => setRootArg((e.target as HTMLInputElement).value)} />
          </div>
          <div class={actions}>
            <button type="button" class={cancelBtn} onClick={props.onCancel}>Prekliči</button>
            <button type="button" class={insertBtn} onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "fraction" && (
        <div class="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5">
          <input class={`${field} text-center`} placeholder="števec" value={num} onInput={(e) => setNum((e.target as HTMLInputElement).value)} />
          <div class="h-px bg-slate-400" />
          <input class={`${field} text-center`} placeholder="imenovalec" value={den} onInput={(e) => setDen((e.target as HTMLInputElement).value)} />
          <div class={actions}>
            <button type="button" class={cancelBtn} onClick={props.onCancel}>Prekliči</button>
            <button type="button" class={insertBtn} onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "piecewise" && (
        <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span class="text-sm">1.</span>
            <input class={field} placeholder="izraz" value={pwExpr1} onInput={(e) => setPwExpr1((e.target as HTMLInputElement).value)} />
            <span class="text-sm">če</span>
            <input class={field} placeholder="pogoj" value={pwCond1} onInput={(e) => setPwCond1((e.target as HTMLInputElement).value)} />
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <span class="text-sm">2.</span>
            <input class={field} placeholder="izraz" value={pwExpr2} onInput={(e) => setPwExpr2((e.target as HTMLInputElement).value)} />
            <span class="text-sm">če</span>
            <input class={field} placeholder="pogoj" value={pwCond2} onInput={(e) => setPwCond2((e.target as HTMLInputElement).value)} />
          </div>
          <div class={actions}>
            <button type="button" class={cancelBtn} onClick={props.onCancel}>Prekliči</button>
            <button type="button" class={insertBtn} onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
    </div>
  );
}


