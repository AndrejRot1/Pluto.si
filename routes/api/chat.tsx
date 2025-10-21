import { define } from "../../utils.ts";
import { izjaveInMnoziceExercises } from "../../data/exercises.ts";

// Cache for HTML exercises
let htmlExercisesCache: Array<Record<string, unknown>> | null = null;

async function _loadHtmlExercises() {
  if (htmlExercisesCache) return htmlExercisesCache;
  
  try {
    const response = await fetch('/api/html-exercises');
    htmlExercisesCache = await response.json();
    return htmlExercisesCache;
  } catch (error) {
    console.error('Failed to load HTML exercises:', error);
    return [];
  }
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json; charset=utf-8" },
    ...init,
  });
}

function isLikelyMath(text: string): boolean {
  const lower = text.toLowerCase();
  // English
  if (/\b(limit|integral|derivative|matrix|solve|equation|polynomial|vector|probability|statistics|function|algebra|geometry|prime\s+number|definition)\b/.test(lower)) return true;
  // Slovenian
  if (/(limita|integral|odvod|matrika|reši|enačb|polinom|vektor|verjetnost|statistika|funkcija|algebra|geometrija|praštevil|prastevil|prastevilo|definicija|izberi|nalogo|naloge)/.test(lower)) return true;
  // Italian
  if (/(limite|integrale|derivata|matrice|risolvi|equazione|polinomio|vettore|probabilità|statistica|funzione|algebra|geometria|numero\s+primo|definizione)/.test(lower)) return true;
  if (/[∫∑√≤≥≠→^_π∞]/.test(text)) return true;
  if (/[=<>≤≥]/.test(text)) return true;
  if (/\b(lim|sin|cos|tan|log|ln|exp)\b/.test(lower)) return true;
  if (/\d+\s*[+\-*/^]\s*\d+/.test(lower)) return true;
  return false;
}

function explainTopic(text: string): string {
  // Extract topic and year from the text
  const topicMatch = text.match(/Tema: (.+)/);
  const yearMatch = text.match(/Letnik: (.+)/);
  
  const topic = topicMatch ? topicMatch[1].trim() : 'neznana tema';
  const year = yearMatch ? yearMatch[1].trim() : 'neznan letnik';
  
  // Generate topic explanation based on topic and year
  const explanations: Record<string, Record<string, string>> = {
    // Osnovna šola
    'Seštevanje': {
      '5. razred': `**Seštevanje** (5. razred)

**Definicija:** Seštevanje je osnovna matematična operacija, ki združuje dve ali več števil v eno vsoto.

**Osnovna pravila:**
- Komutativnost: $a + b = b + a$
- Asociativnost: $(a + b) + c = a + (b + c)$
- Ničla: $a + 0 = a$

**Primer:** Izračunaj $25 + 37$
**Rešitev:** 
$25 + 37 = 62$
Ali: $25 + 37 = 25 + (30 + 7) = (25 + 30) + 7 = 55 + 7 = 62$

**Povezave:** Seštevanje je osnova za vse druge operacije in vsakdanje življenje.`
    },
    'Množenje': {
      '5. razred': `**Množenje** (5. razred)

**Definicija:** Množenje je ponavljanje seštevanja istega števila.

**Osnovna pravila:**
- Komutativnost: $a \\times b = b \\times a$
- Asociativnost: $(a \\times b) \\times c = a \\times (b \\times c)$
- Distributivnost: $a \\times (b + c) = a \\times b + a \\times c$

**Primer:** Izračunaj $7 \\times 8$
**Rešitev:** 
$7 \\times 8 = 56$
Ali: $7 \\times 8 = 7 \\times (4 + 4) = 7 \\times 4 + 7 \\times 4 = 28 + 28 = 56$

**Povezave:** Množenje je osnova za deljenje, potenciranje in geometrijo.`
    },
    'Osnovni ulomki': {
      '5. razred': `**Osnovni ulomki** (5. razred)

**Definicija:** Ulomek predstavlja del celote. Zapisujemo ga kot $\\frac{a}{b}$, kjer je $a$ števec in $b$ imenovalec.

**Osnovni koncepti:**
- Pravilni ulomek: $\\frac{a}{b}$ kjer $a < b$
- Nepravilni ulomek: $\\frac{a}{b}$ kjer $a \\geq b$
- Mešano število: $c\\frac{a}{b}$

**Primer:** Predstavi $\\frac{3}{4}$ kot del pizze
**Rešitev:** 
$\\frac{3}{4}$ pizze pomeni, da smo pizzo razdelili na 4 enake dele in vzeli 3 dele.

**Povezave:** Ulomki so osnova za decimalna števila, procente in razmerja.`
    },
    'Decimalna števila': {
      '6. razred': `**Decimalna števila** (6. razred)

**Definicija:** Decimalna števila so števila z decimalno vejico, ki predstavljajo del celega števila.

**Osnovni koncepti:**
- Desetinke: $0,1 = \\frac{1}{10}$
- Stotinke: $0,01 = \\frac{1}{100}$
- Tisočinke: $0,001 = \\frac{1}{1000}$

**Primer:** Pretvori $\\frac{3}{4}$ v decimalno število
**Rešitev:** 
$\\frac{3}{4} = 3 \\div 4 = 0,75$

**Povezave:** Decimalna števila so povezana z ulomki, procenti in merjenjem.`
    },
    'Procenti': {
      '6. razred': `**Osnovni procenti** (6. razred)

**Definicija:** Procent je del od 100. 1% = $\\frac{1}{100} = 0,01$

**Osnovni koncepti:**
- $1\\% = \\frac{1}{100} = 0,01$
- $50\\% = \\frac{50}{100} = \\frac{1}{2} = 0,5$
- $100\\% = \\frac{100}{100} = 1$

**Primer:** Koliko je 25% od 80?
**Rešitev:** 
$25\\% \\text{ od } 80 = 0,25 \\times 80 = 20$

**Povezave:** Procenti so povezani z ulomki, decimalnimi števili in vsakdanjim življenjem.`
    },
    // Srednja šola
    'Naravna števila': {
      '1. letnik': `**Naravna števila** (1. letnik)

**Definicija:** Naravna števila so pozitivna cela števila, ki se začnejo z 1: {1, 2, 3, 4, 5, ...}

**Osnovne operacije:**
- Seštevanje: $a + b$
- Množenje: $a \\times b$
- Potenciranje: $a^n$

**Primer:** Izračunaj $3 + 4 \\times 2$
**Rešitev:** $3 + 4 \\times 2 = 3 + 8 = 11$ (upoštevamo vrstni red operacij)

**Povezave:** Naravna števila so osnova za cela števila, racionalna števila in realna števila.`
    },
    'Enačbe': {
      '1. letnik': `**Enačbe** (1. letnik)

**Definicija:** Enačba je matematični izraz z enačajem, ki povezuje dve strani z neznanko.

**Osnovne vrste:**
- Linearne enačbe: $ax + b = 0$
- Kvadratne enačbe: $ax^2 + bx + c = 0$

**Primer:** Reši enačbo $2x + 5 = 13$
**Rešitev:** 
$2x + 5 = 13$
$2x = 13 - 5$
$2x = 8$
$x = 4$

**Povezave:** Enačbe so osnova za reševanje problemov v algebri, geometriji in fiziki.`
    },
    'Funkcije': {
      '2. letnik': `**Funkcije** (2. letnik)

**Definicija:** Funkcija je pravilo, ki vsakemu elementu iz definicijskega območja priredi natanko en element iz zaloge vrednosti.

**Osnovne vrste:**
- Linearne: $f(x) = ax + b$
- Kvadratne: $f(x) = ax^2 + bx + c$

**Primer:** Funkcija $f(x) = 2x + 3$
**Rešitev:** 
- $f(0) = 2(0) + 3 = 3$
- $f(1) = 2(1) + 3 = 5$
- Graf je premica s smernim koeficientom 2

**Povezave:** Funkcije so osnova za analizo, geometrijo in aplikacije v naravoslovju.`
    },
    'Odvodi': {
      '4. letnik': `**Odvodi** (4. letnik)

**Definicija:** Odvod funkcije v točki je smerni koeficient tangente na graf funkcije v tej točki.

**Osnovna pravila:**
- $(x^n)' = nx^{n-1}$
- $(\\sin x)' = \\cos x$
- $(\\cos x)' = -\\sin x$

**Primer:** Odvodi $f(x) = x^3 + 2x^2 + 5x + 1$
**Rešitev:** 
$f'(x) = 3x^2 + 4x + 5$

**Povezave:** Odvodi so osnova za optimizacijo, fiziko (hitrost, pospešek) in ekonomijo.`
    }
  };
  
  if (explanations[topic] && explanations[topic][year]) {
    return explanations[topic][year];
  }
  
  // Fallback for unknown topics
  return `**${topic}** (${year})

**Definicija:** ${topic} je pomembna matematična tema, ki se obravnava v ${year}.

**Osnovni koncepti:**
- Temeljni principi
- Osnovne operacije
- Aplikacije

**Primer:** [Primer bo dodan kmalu]

**Povezave:** Ta tema se povezuje z drugimi matematičnimi koncepti in ima praktične aplikacije.`;
}

function explainMath(text: string): string {
  // Check if user is asking about a topic
  if (text.includes('Razloži matematično temo') || text.includes('Tema:') || text.includes('Letnik:')) {
    return explainTopic(text);
  }
  
  // Check if user is selecting a static exercise
  const exerciseMatch = text.match(/^(\d+)$/);
  if (exerciseMatch) {
    const exerciseNum = parseInt(exerciseMatch[1]) - 1;
    
    // Use static exercises (better formatted)
    if (exerciseNum >= 0 && exerciseNum < izjaveInMnoziceExercises.length) {
      const exercise = izjaveInMnoziceExercises[exerciseNum];
      return `**${exercise.title}**\n\n${exercise.content}\n\n**Rešitev:**\n${exercise.solution || 'Rešitev bo dodana kmalu.'}`;
    }
  }
  
  const concept = conceptDefinition(text);
  if (concept) return concept;
  const solvedEq = solveLinearEquation(text);
  if (solvedEq) return solvedEq;

  const integ = integratePowerExpression(text);
  if (integ) return integ;

  const lim = limitStandard(text);
  if (lim) return lim;

  if (/∫|integral/i.test(text)) {
    return "Koraki za integral: 1) Prepoznaj obliko, 2) Izberi metodo (substitucija, delna integracija), 3) Izračun, 4) Dodaj C ali vstavitev mej.";
  }
  if (/limit|lim\b/i.test(text)) {
    return "Koraki za limite: 1) Vstavitev, 2) Preoblikovanje (faktorizacija, racionalizacija), 3) Pravila za lim in e^x, 4) L'Hôpital po potrebi.";
  }
  if (/derivative|odvod|d\/dx|f′/i.test(text)) {
    return "Koraki za odvod: 1) Pravila (potenčno, produkt, kvocient, verižna), 2) Poenostavi, 3) Uporabi vrednosti ali poišči ekstreme.";
  }
  if (/[=<>≤≥]/.test(text) || /solve|enačb|equation|x\^2|kvadrat/i.test(text)) {
    return "Reševanje enačb: 1) Uredi izraze, 2) Prenesi na eno stran, 3) Faktoriziraj ali uporabi formulo, 4) Preveri pogoje.";
  }
  return "To je matematično vprašanje. Za natančne korake podaj več podrobnosti (izraz, meje, spremenljivke).";
}

function conceptDefinition(input: string): string | null {
  const lower = input.toLowerCase();
  if (/praštevil|prastevil|prastevilo|prime\s+number|numero\s+primo/.test(lower) || /kaj\s+je\s+pra/.test(lower)) {
    return [
      "Praštevilо: naravno število večje od 1, ki ima natanko dva različna delitelja: 1 in samo sebe.",
      "Primeri: 2, 3, 5, 7, 11, 13 …",
      "Ni praštevila: 1 (ima le enega delitelja), 4 = 2·2, 6 = 2·3, 9 = 3·3 …",
    ].join("\n");
  }
  return null;
}

// Optional: DeepSeek integration (OpenAI-compatible API)
interface DeepSeekMessage { role: "system" | "user" | "assistant"; content: string }
interface DeepSeekChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{ index: number; finish_reason: string; message: { role: string; content: string } }>;
}

async function callDeepSeek(prompt: string, stream = false, language = "sl"): Promise<Response | string> {
  // Try to load from .env file first, then from environment
  let apiKey = (globalThis as unknown as { Deno?: typeof Deno }).Deno?.env.get("DEEPSEEK_API_KEY");
  
  if (!apiKey) {
    try {
      const envContent = await Deno.readTextFile(".env");
      const envLines = envContent.split('\n');
      for (const line of envLines) {
        if (line.startsWith('DEEPSEEK_API_KEY=')) {
          apiKey = line.split('=')[1];
          break;
        }
      }
    } catch (_error) {
      console.log('No .env file found, using environment variables');
    }
  }
  if (!apiKey) {
    return "(DeepSeek ni konfiguriran. Nastavite DEEPSEEK_API_KEY v okolju strežnika.)\n" + explainMath(prompt);
  }
  
  // Map language codes to instructions
  const langMap: Record<string, string> = {
    sl: "Respond in Slovenian",
    en: "Respond in English",
    it: "Respond in Italian"
  };
  const langInstruction = langMap[language] || langMap.sl;
  
  const endpoint = "https://api.deepseek.com/chat/completions";
  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content:
        `You are a helpful math tutor. Answer ONLY math questions. If not math, politely refuse. ${langInstruction}. Show clear step-by-step reasoning and final result where applicable.`,
    },
    { role: "user", content: prompt },
  ];
  const body: Record<string, unknown> = {
    model: "deepseek-chat",
    messages,
    temperature: 0.2,
  };
  if (stream) body.stream = true;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (stream) return res; // return raw response for SSE/NDJSON
  if (!res.ok) {
    return `(DeepSeek napaka ${res.status})\n` + explainMath(prompt);
  }
  const data = (await res.json()) as DeepSeekChatCompletion;
  const msg = data.choices?.[0]?.message?.content?.trim();
  return msg || explainMath(prompt);
}

function solveLinearEquation(input: string): string | null {
  if (!/[=]/.test(input)) return null;
  const raw = input.replace(/\s+/g, "");
  const parts = raw.split("=");
  if (parts.length !== 2) return null;
  const [left, right] = parts;

  const coeffX = (expr: string): number => {
    const re = /([+\-]?)(\d*\.?\d*)x/gi;
    let m: RegExpExecArray | null;
    let sum = 0;
    while ((m = re.exec(expr))) {
      const sign = m[1] === "-" ? -1 : 1;
      const numStr = m[2];
      const coef = numStr === "" ? 1 : parseFloat(numStr);
      if (!Number.isNaN(coef)) sum += sign * coef;
    }
    return sum;
  };

  const constSum = (expr: string): number => {
    const re = /([+\-]?\d*\.?\d+)(?!x)/gi;
    let m: RegExpExecArray | null;
    let sum = 0;
    while ((m = re.exec(expr))) {
      const val = parseFloat(m[1]);
      if (!Number.isNaN(val)) sum += val;
    }
    return sum;
  };

  const aL = coeffX(left);
  const aR = coeffX(right);
  const bL = constSum(left);
  const bR = constSum(right);

  const a = aL - aR;
  const b = bR - bL;
  if (Math.abs(a) < 1e-12) return null;
  const x = b / a;
  return [
    `Podana enačba: ${input.trim()}`,
    `Prenesemo člene z x na levo: ${aL}x − ${aR}x = ${bR} − ${bL}`,
    `Dobimo: ${a}x = ${b}`,
    `Delimo z ${a}: x = ${x}`,
  ].join("\n");
}

function integratePowerExpression(input: string): string | null {
  const m1 = /∫\s*x\^(\-?\d+)\s*dx/i.exec(input);
  if (m1) {
    const n = parseInt(m1[1]);
    if (n !== -1) {
      const p = n + 1;
      return [
        `Uporabimo potenčno pravilo: ∫ x^n dx = x^(n+1)/(n+1) + C`,
        `Tu je n = ${n}, zato ∫ x^${n} dx = x^${p}/${p} + C`,
      ].join("\n");
    } else {
      return [`Za n = -1 velja: ∫ x^(-1) dx = ∫ 1/x dx = ln|x| + C`].join("\n");
    }
  }
  const m2 = /∫\s*x\s*dx/i.exec(input);
  if (m2) return [`∫ x dx = x^2/2 + C (potenčno pravilo z n=1)`].join("\n");
  return null;
}

function limitStandard(input: string): string | null {
  const m = /(lim|limit)[^\n]*x\s*→\s*0[^\n]*sin\(x\)\s*\/\s*x/i.exec(input);
  if (m) {
    return [
      `Standardna limita: lim_{x→0} sin(x)/x = 1`,
      `Razlaga: geometrijski dokaz ali L'Hôpital (odvod sin je cos, odvod x je 1; cos(0)=1).`,
    ].join("\n");
  }
  return null;
}

export const handler = define.handlers({
  async POST(ctx) {
    try {
      let parsed: unknown;
      try {
        parsed = await ctx.req.json();
      } catch (_e) {
        return json({ reply: "Prosim, vnesite vprašanje." }, { status: 200 });
      }
      const text = (typeof parsed === "object" && parsed !== null && "text" in parsed)
        ? String((parsed as { text?: unknown }).text ?? "")
        : "";
      const language = (typeof parsed === "object" && parsed !== null && "language" in parsed)
        ? String((parsed as { language?: unknown }).language ?? "sl")
        : "sl";
      if (!text.trim()) return json({ reply: "Prosim, vnesite vprašanje." });
      const looksMath = isLikelyMath(text);
      if (!looksMath) {
        // If DeepSeek is configured, defer the gate to model's system prompt (it will refuse non-math).
        const maybe = await callDeepSeek(text, false, language);
        if (typeof maybe === "string") return json({ reply: maybe });
        return json({ reply: "Lahko odgovarjam samo na matematična vprašanja." });
      }
      const wantsStream = /stream=1/.test(new URL(ctx.req.url).search);
      if (wantsStream) {
        const ds = await callDeepSeek(text, true, language);
        if (ds instanceof Response && ds.ok) {
          // proxy the stream transparently
          return new Response(ds.body, { headers: { "content-type": ds.headers.get("content-type") ?? "text/event-stream" } });
        }
        const fallback = typeof ds === "string" ? ds : explainMath(text);
        return json({ reply: fallback });
      } else {
        const explanation = await callDeepSeek(text, false, language);
        if (typeof explanation === "string") return json({ reply: explanation });
        return json({ reply: explainMath(text) });
      }
    } catch (_e) {
      return json({ reply: "Prišlo je do napake pri obdelavi vprašanja." }, { status: 200 });
    }
  },
});


