import { useRef, useState } from "preact/hooks";

type KeyboardKey = { label: string; insert: string; cursorOffset?: number };
type KeyboardCategory = { id: string; label: string; keys: KeyboardKey[] };

export default function ChatComposer() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [activeCat, setActiveCat] = useState<string>("osnovno");
  const [isDragging, setIsDragging] = useState(false);
  const [template, setTemplate] = useState<
    | { type: "integral-def" | "integral-indef" }
    | { type: "power" }
    | { type: "root" }
    | { type: "fraction" }
    | { type: "piecewise" }
    | null
  >(null);

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
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 220) + "px";
  }

  const categories: KeyboardCategory[] = [
    {
      id: "osnovno",
      label: "Osnovno",
      keys: [
        { label: "π", insert: "π" },
        { label: "∞", insert: "∞" },
        { label: "→", insert: "→" },
        { label: "≤", insert: "≤" },
        { label: "≥", insert: "≥" },
        { label: "≠", insert: "≠" },
        { label: "√", insert: "√()", cursorOffset: 2 },
        { label: "x²", insert: "x^2" },
        { label: "xⁿ", insert: "x^{}", cursorOffset: 3 },
        { label: "ₙ", insert: "_{}", cursorOffset: 2 },
      ],
    },
    {
      id: "funkcije",
      label: "Funkcije",
      keys: [
        { label: "sin", insert: "sin()", cursorOffset: 4 },
        { label: "cos", insert: "cos()", cursorOffset: 4 },
        { label: "tan", insert: "tan()", cursorOffset: 4 },
        { label: "ln", insert: "ln()", cursorOffset: 3 },
        { label: "log", insert: "log_{10}()", cursorOffset: 8 },
        { label: "e^x", insert: "e^{}", cursorOffset: 2 },
        { label: "|x|", insert: "| |", cursorOffset: 2 },
      ],
    },
    {
      id: "integrali",
      label: "Integrali",
      keys: [
        { label: "∫ a→b", insert: "__TEMPLATE_INTEGRAL_DEF__" },
        { label: "∫ f(x) dx", insert: "__TEMPLATE_INTEGRAL_INDEF__" },
        { label: "∫ u dv", insert: "∫ u dv" },
      ],
    },
    {
      id: "potence",
      label: "Potence",
      keys: [
        { label: "a^b", insert: "__TEMPLATE_POWER__" },
        { label: "n-ti koren", insert: "__TEMPLATE_ROOT__" },
      ],
    },
    {
      id: "limite",
      label: "Limite",
      keys: [
        { label: "lim", insert: "lim_{x→}", cursorOffset: 6 },
        { label: "x→∞", insert: "x→∞" },
        { label: "x→0", insert: "x→0" },
        { label: "x→a", insert: "x→a" },
      ],
    },
    {
      id: "vsote",
      label: "Vsote",
      keys: [
        { label: "∑", insert: "∑()", cursorOffset: 2 },
        { label: "∑_{i=1}^n", insert: "∑_{i=1}^{n} ()", cursorOffset: 14 },
        { label: "∏", insert: "∏()", cursorOffset: 2 },
      ],
    },
    {
      id: "odvodi",
      label: "Odvodi",
      keys: [
        { label: "d/dx", insert: "d/dx ()", cursorOffset: 6 },
        { label: "f′(x)", insert: "f′(x)" },
        { label: "∂/∂x", insert: "∂/∂x ()", cursorOffset: 5 },
        { label: "∇", insert: "∇" },
        { label: "f′", insert: "f′" },
      ],
    },
    {
      id: "sablone",
      label: "Šablone",
      keys: [
        { label: "ulomek", insert: "__TEMPLATE_FRACTION__" },
        { label: "kosovno", insert: "__TEMPLATE_PIECEWISE__" },
        { label: "mat 2x2", insert: "[[ , ], [ , ]]", cursorOffset: 2 },
      ],
    },
  ];

  // No attachment state: dropped files are inserted as symbolic tags only

  return (
    <div
      class={`rounded-xl p-2 bg-white/80 shadow ${isDragging ? "ring-2 ring-blue-400" : ""}`}
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
          const list = Array.from(dt.files).slice(0, 4);
          const labels = list.map((f) => `[priponka: ${f.name}]`).join(" ");
          insertAtCaret(labels + (labels ? " " : ""));
        }
      }}
    >
      <textarea
        ref={textareaRef}
        class="w-full resize-none outline-none bg-transparent p-3 rounded text-sm leading-6 placeholder:text-gray-400"
        rows={3}
        value={value}
        onInput={(e) => {
          const target = e.currentTarget as HTMLTextAreaElement;
          setValue(target.value);
          autoResize();
        }}
        placeholder="Vnesite vprašanje..."
      />
      {/* No previews: files are represented only as symbolic tags in text */}
      <div class="flex items-center justify-between gap-2 px-2 pb-1">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1 mb-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                type="button"
                class={
                  "px-3 py-1 text-xs rounded-full " +
                  (activeCat === c.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              class="ml-auto px-2 py-1 text-xs rounded-full hover:bg-gray-100"
              onClick={() => setExpanded((v) => !v)}
              aria-pressed={expanded}
            >
              {expanded ? "Skrij" : "Pokaži"}
            </button>
          </div>
          {expanded && (
            <div class="flex flex-wrap gap-1">
              {categories
                .find((c) => c.id === activeCat)!
                .keys.map((k) => (
                  <button
                    type="button"
                    class="px-2 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-[0.98] transition"
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
          )}
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Vstavi priponko"
            title="Vstavi priponko"
            onClick={() => {
              const name = globalThis.prompt?.("Ime priponke (npr. slika.jpg)") || "priponka";
              insertAtCaret(`[priponka: ${name}] `);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-700">
              <path d="M16.5 6.75v7.5a4.5 4.5 0 1 1-9 0v-9a3 3 0 1 1 6 0v8.25a1.5 1.5 0 1 1-3 0V7.5h-1.5v6.75a3 3 0 1 0 6 0v-8.25a4.5 4.5 0 1 0-9 0v9a6 6 0 1 0 12 0v-7.5h-1.5z"/>
            </svg>
          </button>
          <button type="button" class="px-3 py-1.5 bg-black text-white rounded-lg text-sm shadow hover:bg-gray-900" onClick={() => {
            const text = value.trim();
            if (!text) return;
            const evt = new CustomEvent("pluto-send", { detail: text });
            globalThis.dispatchEvent(evt);
            setValue("");
          }}>
            Pošlji
          </button>
        </div>
      </div>
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
        return `∫[${a}, ${b}] ${fx} d${dx}`;
      case "integral-indef":
        return `∫ ${fx} d${dx}`;
      case "power":
        return `${base}^${exp}`;
      case "root":
        return `√[${rootN}](${rootArg})`;
      case "fraction":
        return `(${num}) / (${den})`;
      case "piecewise":
        return `{ ${pwExpr1} (če ${pwCond1}); ${pwExpr2} (če ${pwCond2}) }`;
    }
  }

  return (
    <div class="mt-2 px-2">
      {props.template.type === "integral-def" && (
        <div class="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2">
          <span class="text-sm">∫</span>
          <input class="w-14 text-sm px-2 py-1 rounded bg-white" placeholder="a" value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} />
          <span class="text-sm">→</span>
          <input class="w-14 text-sm px-2 py-1 rounded bg-white" placeholder="b" value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} />
          <input class="flex-1 min-w-[8rem] text-sm px-2 py-1 rounded bg-white" placeholder="f(x)" value={fx} onInput={(e) => setFx((e.target as HTMLInputElement).value)} />
          <span class="text-sm">d</span>
          <input class="w-12 text-sm px-2 py-1 rounded bg-white" placeholder="x" value={dx} onInput={(e) => setDx((e.target as HTMLInputElement).value)} />
          <div class="ml-auto flex gap-2">
            <button type="button" class="px-2 py-1 text-sm rounded hover:bg-gray-200" onClick={props.onCancel}>Prekliči</button>
            <button type="button" class="px-2 py-1 text-sm rounded bg-black text-white" onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "integral-indef" && (
        <div class="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2">
          <span class="text-sm">∫</span>
          <input class="flex-1 min-w-[8rem] text-sm px-2 py-1 rounded bg-white" placeholder="f(x)" value={fx} onInput={(e) => setFx((e.target as HTMLInputElement).value)} />
          <span class="text-sm">d</span>
          <input class="w-12 text-sm px-2 py-1 rounded bg-white" placeholder="x" value={dx} onInput={(e) => setDx((e.target as HTMLInputElement).value)} />
          <div class="ml-auto flex gap-2">
            <button type="button" class="px-2 py-1 text-sm rounded hover:bg-gray-200" onClick={props.onCancel}>Prekliči</button>
            <button type="button" class="px-2 py-1 text-sm rounded bg-black text-white" onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "power" && (
        <div class="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2">
          <input class="w-20 text-sm px-2 py-1 rounded bg-white" placeholder="osnova" value={base} onInput={(e) => setBase((e.target as HTMLInputElement).value)} />
          <span class="text-sm">^</span>
          <input class="w-16 text-sm px-2 py-1 rounded bg-white" placeholder="eksponent" value={exp} onInput={(e) => setExp((e.target as HTMLInputElement).value)} />
          <div class="ml-auto flex gap-2">
            <button type="button" class="px-2 py-1 text-sm rounded hover:bg-gray-200" onClick={props.onCancel}>Prekliči</button>
            <button type="button" class="px-2 py-1 text-sm rounded bg-black text-white" onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "root" && (
        <div class="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2">
          <span class="text-sm">√</span>
          <input class="w-16 text-sm px-2 py-1 rounded bg-white" placeholder="n" value={rootN} onInput={(e) => setRootN((e.target as HTMLInputElement).value)} />
          <span class="text-sm">(</span>
          <input class="flex-1 min-w-[8rem] text-sm px-2 py-1 rounded bg-white" placeholder="argument" value={rootArg} onInput={(e) => setRootArg((e.target as HTMLInputElement).value)} />
          <span class="text-sm">)</span>
          <div class="ml-auto flex gap-2">
            <button type="button" class="px-2 py-1 text-sm rounded hover:bg-gray-200" onClick={props.onCancel}>Prekliči</button>
            <button type="button" class="px-2 py-1 text-sm rounded bg-black text-white" onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "fraction" && (
        <div class="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2">
          <input class="flex-1 min-w-[6rem] text-sm px-2 py-1 rounded bg-white" placeholder="števec" value={num} onInput={(e) => setNum((e.target as HTMLInputElement).value)} />
          <span class="text-sm">/</span>
          <input class="flex-1 min-w-[6rem] text-sm px-2 py-1 rounded bg-white" placeholder="imenovalec" value={den} onInput={(e) => setDen((e.target as HTMLInputElement).value)} />
          <div class="ml-auto flex gap-2">
            <button type="button" class="px-2 py-1 text-sm rounded hover:bg-gray-200" onClick={props.onCancel}>Prekliči</button>
            <button type="button" class="px-2 py-1 text-sm rounded bg-black text-white" onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
      {props.template.type === "piecewise" && (
        <div class="flex flex-col gap-2 bg-gray-50 rounded-lg p-2">
          <div class="flex items-center gap-2">
            <span class="text-sm">1.</span>
            <input class="flex-1 min-w-[6rem] text-sm px-2 py-1 rounded bg-white" placeholder="izraz" value={pwExpr1} onInput={(e) => setPwExpr1((e.target as HTMLInputElement).value)} />
            <span class="text-sm">če</span>
            <input class="flex-1 min-w-[6rem] text-sm px-2 py-1 rounded bg-white" placeholder="pogoj" value={pwCond1} onInput={(e) => setPwCond1((e.target as HTMLInputElement).value)} />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm">2.</span>
            <input class="flex-1 min-w-[6rem] text-sm px-2 py-1 rounded bg-white" placeholder="izraz" value={pwExpr2} onInput={(e) => setPwExpr2((e.target as HTMLInputElement).value)} />
            <span class="text-sm">če</span>
            <input class="flex-1 min-w-[6rem] text-sm px-2 py-1 rounded bg-white" placeholder="pogoj" value={pwCond2} onInput={(e) => setPwCond2((e.target as HTMLInputElement).value)} />
          </div>
          <div class="ml-auto flex gap-2">
            <button type="button" class="px-2 py-1 text-sm rounded hover:bg-gray-200" onClick={props.onCancel}>Prekliči</button>
            <button type="button" class="px-2 py-1 text-sm rounded bg-black text-white" onClick={() => props.onInsert(build())}>Vstavi</button>
          </div>
        </div>
      )}
    </div>
  );
}


