import { useEffect, useRef } from "preact/hooks";
import {
  parseContentParts,
  renderInlineMarkdown,
  type LatexPart,
} from "../utils/latex.ts";

type KatexApi = {
  render: (
    tex: string,
    el: HTMLElement,
    opts: {
      displayMode?: boolean;
      throwOnError?: boolean;
      trust?: boolean;
    },
  ) => void;
};

function MathNode(props: { latex: string; display?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const katex = (globalThis as unknown as { katex?: KatexApi }).katex;
    if (!el || !katex) return;
    el.textContent = "";
    try {
      katex.render(props.latex, el, {
        displayMode: Boolean(props.display),
        throwOnError: false,
        trust: true,
      });
    } catch {
      el.textContent = props.latex;
    }
  }, [props.latex, props.display]);

  if (props.display) {
    return (
      <div
        ref={ref}
        class="math-display my-3 overflow-x-auto text-[0.95em] leading-normal"
      />
    );
  }
  return (
    <div
      ref={ref}
      class="math-inline mx-0.5 inline-block align-middle text-[0.95em] leading-normal"
    />
  );
}

function TextNode(props: { content: string }) {
  const bits = renderInlineMarkdown(props.content);
  return (
    <span class="leading-relaxed">
      {bits.map((b, i) => {
        if (b.type === "br") return <br key={i} />;
        if (b.type === "bold") {
          return (
            <strong key={i} class="font-semibold text-slate-900">
              {b.content}
            </strong>
          );
        }
        if (b.type === "italic") {
          return (
            <em key={i} class="italic text-slate-800">
              {b.content}
            </em>
          );
        }
        if (b.type === "code") {
          return (
            <code
              key={i}
              class="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800"
            >
              {b.content}
            </code>
          );
        }
        return <span key={i}>{b.content}</span>;
      })}
    </span>
  );
}

function PartView(props: { part: LatexPart; index: number }) {
  const { part, index } = props;
  if (part.type === "math") {
    return <MathNode key={index} latex={part.content} display={part.display} />;
  }
  if (part.type === "graph") {
    return (
      <div
        key={index}
        class="graph-container my-3 w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white"
        data-function={part.content}
        style="height: min(300px, 40vh); max-height: 400px;"
      />
    );
  }
  if (part.type === "image") {
    return (
      <figure key={index} class="my-3">
        <img
          src={part.content}
          alt={part.alt || "Diagram"}
          class="max-h-[420px] w-full rounded-xl border border-slate-200 bg-white object-contain"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.display = "none";
            const note = img.nextElementSibling as HTMLElement | null;
            if (note) note.hidden = false;
          }}
        />
        <figcaption hidden class="mt-1 text-xs text-slate-500">
          {part.alt || "Slika ni na voljo"}
        </figcaption>
      </figure>
    );
  }
  if (part.type === "svg") {
    return (
      <div
        key={index}
        class="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 [&_svg]:mx-auto [&_svg]:max-h-[360px] [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: part.content }}
      />
    );
  }
  if (part.type === "code") {
    return (
      <pre
        key={index}
        class="my-3 overflow-x-auto rounded-xl bg-slate-900 px-3 py-2.5 text-xs leading-relaxed text-slate-100"
      >
        <code>{part.content}</code>
      </pre>
    );
  }
  return <TextNode key={index} content={part.content} />;
}

export default function RichContent(props: { content: string; class?: string }) {
  const parts = parseContentParts(props.content);
  return (
    <div
      class={`prose-stem text-sm text-slate-800 sm:text-[0.95rem] ${
        props.class || ""
      }`}
    >
      {parts.map((part, idx) => <PartView key={idx} part={part} index={idx} />)}
    </div>
  );
}
