/** Normalize AI LaTeX so KaTeX can render it reliably across STEM subjects. */

function wrapBalancedCommand(src: string, cmd: string): string {
  const needle = `\\${cmd}{`;
  let out = "";
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf(needle, i);
    if (idx === -1) {
      out += src.slice(i);
      break;
    }
    out += src.slice(i, idx);
    let depth = 0;
    let j = idx + needle.length - 1; // at '{'
    for (; j < src.length; j++) {
      const ch = src[j];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    const full = src.slice(idx, j);
    const before = out;
    const prev = before.replace(/\s+$/, "");
    const alreadyMath = /(?:\$|\$\$)$/.test(prev) || /\\\]$/.test(prev);
    out += alreadyMath ? full : `$${full}$`;
    i = j;
  }
  return out;
}

function stripOuterDollars(s: string): string {
  const t = s.trim();
  if (t.startsWith("$$") && t.endsWith("$$") && t.length > 4) {
    return t.slice(2, -2).trim();
  }
  if (t.startsWith("$") && t.endsWith("$") && t.length > 2) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export function normalizeLatex(content: string): string {
  let s = content;

  // Fenced latex/tex/math code blocks -> display math (keep svg/html fences intact)
  s = s.replace(
    /```(?:latex|tex|math)\s*([\s\S]*?)```/gi,
    (_m, inner: string) => {
      const t = stripOuterDollars(String(inner));
      return `\n$$\n${t}\n$$\n`;
    },
  );

  // \[ ... \] -> $$ ... $$
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => {
    return `\n$$\n${String(inner).trim()}\n$$\n`;
  });

  // \( ... \) -> $ ... $
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner: string) => {
    return `$${String(inner).trim()}$`;
  });

  // Wrap bare formulas first, but only outside existing math / \ce regions
  s = mapOutsideMath(s, (chunk) =>
    chunk.replace(
      /(^|[^\\A-Za-z])((?:H2O|CO2|O2|N2|NH3|CH4|C6H12O6|H2SO4|HCl|NaCl|NaOH|CaCO3|Fe2O3|HNO3|H3PO4|SO2|SO3|NO2|H2O2))(?![A-Za-z0-9])/g,
      (_m, lead: string, formula: string) => `${lead}$\\ce{${formula}}$`,
    )
  );

  // Chemistry / biology macros that must be in math mode (balanced braces)
  s = wrapBalancedCommand(s, "ce");
  s = wrapBalancedCommand(s, "pu");

  return s;
}

/** Apply fn only to text outside $...$ / $$...$$ and outside \ce{...}/\pu{...}. */
function mapOutsideMath(src: string, fn: (chunk: string) => string): string {
  const protectedSpans: Array<{ start: number; end: number }> = [];

  const protect = (re: RegExp) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) {
      protectedSpans.push({ start: m.index, end: m.index + m[0].length });
    }
  };
  protect(/\$\$[\s\S]+?\$\$/g);
  protect(/(?<!\$)\$(?!\$)[\s\S]+?(?<!\$)\$(?!\$)/g);

  // Protect \ce{...} / \pu{...} with balanced braces
  for (const cmd of ["ce", "pu"]) {
    const needle = `\\${cmd}{`;
    let i = 0;
    while (i < src.length) {
      const idx = src.indexOf(needle, i);
      if (idx === -1) break;
      let depth = 0;
      let j = idx + needle.length - 1;
      for (; j < src.length; j++) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") {
          depth--;
          if (depth === 0) {
            j++;
            break;
          }
        }
      }
      protectedSpans.push({ start: idx, end: j });
      i = j;
    }
  }

  protectedSpans.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const span of protectedSpans) {
    const last = merged[merged.length - 1];
    if (last && span.start <= last.end) {
      last.end = Math.max(last.end, span.end);
    } else {
      merged.push({ ...span });
    }
  }

  let out = "";
  let cursor = 0;
  for (const span of merged) {
    if (span.start > cursor) {
      out += fn(src.slice(cursor, span.start));
    }
    out += src.slice(span.start, span.end);
    cursor = span.end;
  }
  if (cursor < src.length) out += fn(src.slice(cursor));
  return out;
}

export type LatexPart = {
  type: "text" | "math" | "graph" | "image" | "svg" | "code";
  content: string;
  display?: boolean;
  alt?: string;
  lang?: string;
};

/** Sanitize AI SVG: drop scripts and event handlers. */
export function sanitizeSvg(raw: string): string {
  let s = raw.trim();
  if (!/^<svg[\s>]/i.test(s)) {
    const m = s.match(/<svg[\s\S]*?<\/svg>/i);
    if (!m) return "";
    s = m[0];
  }
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  s = s.replace(/javascript:/gi, "");
  if (!/\bxmlns=/.test(s)) {
    s = s.replace(/^<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return s;
}

/**
 * Split assistant content into renderable parts: SVG, images, graphs, math, text.
 */
export function parseContentParts(content: string): LatexPart[] {
  const normalized = normalizeLatex(content);
  const parts: LatexPart[] = [];

  type Block =
    | { kind: "svg"; start: number; end: number; body: string }
    | { kind: "code"; start: number; end: number; body: string; lang: string }
    | { kind: "image"; start: number; end: number; alt: string; url: string }
    | { kind: "graph"; start: number; end: number; fn: string };

  const blocks: Block[] = [];

  const fenceRe = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  let fm: RegExpExecArray | null;
  while ((fm = fenceRe.exec(normalized)) !== null) {
    const lang = (fm[1] || "").toLowerCase();
    const body = fm[2].trim();
    if (lang === "svg" || /^<svg[\s>]/i.test(body)) {
      blocks.push({
        kind: "svg",
        start: fm.index,
        end: fm.index + fm[0].length,
        body,
      });
    } else if (lang === "latex" || lang === "tex" || lang === "math") {
      // already normalized to $$ elsewhere; treat leftover fences as display math
      blocks.push({
        kind: "code",
        start: fm.index,
        end: fm.index + fm[0].length,
        body: `$$${stripOuterDollars(body)}$$`,
        lang: "math",
      });
    } else if (lang) {
      blocks.push({
        kind: "code",
        start: fm.index,
        end: fm.index + fm[0].length,
        body,
        lang,
      });
    }
  }

  const imgRe = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let im: RegExpExecArray | null;
  while ((im = imgRe.exec(normalized)) !== null) {
    blocks.push({
      kind: "image",
      start: im.index,
      end: im.index + im[0].length,
      alt: im[1] || "",
      url: im[2],
    });
  }

  const graphRe =
    /\[GRAPH:([^\]]+)\]|Graf(?:ikon)?\s+funkcije\s+(?:f\(x\)\s*=\s*)?([^\n.]+)/gi;
  let gm: RegExpExecArray | null;
  while ((gm = graphRe.exec(normalized)) !== null) {
    const fn = (gm[1] || gm[2] || "").trim();
    if (fn) {
      blocks.push({
        kind: "graph",
        start: gm.index,
        end: gm.index + gm[0].length,
        fn,
      });
    }
  }

  blocks.sort((a, b) => a.start - b.start || b.end - a.end);
  const filtered: Block[] = [];
  let lastEnd = 0;
  for (const b of blocks) {
    if (b.start >= lastEnd) {
      filtered.push(b);
      lastEnd = b.end;
    }
  }

  let cursor = 0;
  for (const b of filtered) {
    if (b.start > cursor) {
      parts.push(...parseLatexParts(normalized.slice(cursor, b.start)));
    }
    if (b.kind === "svg") {
      const svg = sanitizeSvg(b.body);
      if (svg) parts.push({ type: "svg", content: svg });
    } else if (b.kind === "image") {
      if (/^https?:\/\//i.test(b.url) || b.url.startsWith("data:image/")) {
        parts.push({ type: "image", content: b.url, alt: b.alt });
      }
    } else if (b.kind === "graph") {
      parts.push({ type: "graph", content: b.fn });
    } else if (b.kind === "code") {
      if (b.lang === "math") {
        parts.push(...parseLatexParts(b.body));
      } else {
        parts.push({ type: "code", content: b.body, lang: b.lang });
      }
    }
    cursor = b.end;
  }
  if (cursor < normalized.length) {
    parts.push(...parseLatexParts(normalized.slice(cursor)));
  }

  return parts.length > 0
    ? parts
    : [{ type: "text", content: normalized }];
}

/**
 * Split text into text/math parts. Handles $$ $$ before $ $ so display math
 * is not broken by the simpler dollar regex.
 */
export function parseLatexParts(text: string): LatexPart[] {
  type Match = { start: number; end: number; content: string; display: boolean };
  const matches: Match[] = [];

  const collect = (re: RegExp, display: boolean) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        content: m[1],
        display,
      });
    }
  };

  collect(/\$\$([\s\S]+?)\$\$/g, true);
  collect(/(?<!\$)\$(?!\$)([\s\S]+?)(?<!\$)\$(?!\$)/g, false);

  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  if (filtered.length === 0) {
    return text ? [{ type: "text", content: text }] : [];
  }

  const parts: LatexPart[] = [];
  let cursor = 0;
  for (const m of filtered) {
    if (m.start > cursor) {
      parts.push({ type: "text", content: text.slice(cursor, m.start) });
    }
    const body = m.content.trim();
    // Store raw latex WITHOUT delimiters for katex.render
    parts.push({
      type: "math",
      display: m.display,
      content: body,
    });
    cursor = m.end;
  }
  if (cursor < text.length) {
    parts.push({ type: "text", content: text.slice(cursor) });
  }
  return parts;
}

/** Lightweight inline markdown for text segments (bold/italic/code/breaks). */
export function renderInlineMarkdown(text: string): Array<{
  type: "text" | "bold" | "italic" | "code" | "br";
  content: string;
}> {
  const out: Array<{
    type: "text" | "bold" | "italic" | "code" | "br";
    content: string;
  }> = [];
  const lines = text.split(/\n/);
  lines.forEach((line, li) => {
    const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) {
        out.push({ type: "text", content: line.slice(last, m.index) });
      }
      const token = m[0];
      if (token.startsWith("**")) {
        out.push({ type: "bold", content: token.slice(2, -2) });
      } else if (token.startsWith("*")) {
        out.push({ type: "italic", content: token.slice(1, -1) });
      } else {
        out.push({ type: "code", content: token.slice(1, -1) });
      }
      last = m.index + token.length;
    }
    if (last < line.length) out.push({ type: "text", content: line.slice(last) });
    if (li < lines.length - 1) out.push({ type: "br", content: "" });
  });
  return out;
}
