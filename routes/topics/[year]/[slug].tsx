import { define } from "../../../utils.ts";

async function readContent(year: string, slug: string): Promise<string | null> {
  const path = `${Deno.cwd()}/content/si/${year}/${slug}.md`;
  try {
    const text = await Deno.readTextFile(path);
    return text;
  } catch {
    return null;
  }
}

const FALLBACK_MD: Record<string, string> = {
  // 1. letnik
  "1/naravna-stevila": `# Naravna števila — razlaga in primer

Naravna števila so števila za štetje: 1, 2, 3, … (včasih vključimo tudi 0).

## Lastnosti
- Zaporedje: 1, 2, 3, 4, …
- Seštevanje/množenje: zaprto na N (rezultat je spet naravno število).

## Primer
Naloga: Vsota prvih 10 naravnih števil.

Rešitev:
- Formula: Sₙ = n·(n+1)/2
- S₁₀ = 10·11/2 = 55

Odgovor: 55.
`,
  "1/enacbe": `# Enačbe — linearne osnove

Enačba je enakost z neznanko/ami.

## Primer
Reši: 2 + x = 5

Koraki:
- Prenesi 2 na desno: x = 5 − 2
- Rezultat: x = 3
`,
  "1/neenacbe": `# Neenačbe — osnove

Neenačba primerja izraze z <, >, ≤, ≥.

## Primer
Reši: 3x − 6 ≥ 0

Koraki:
- 3x ≥ 6
- x ≥ 2
`,
  "1/kotne-funkcije": `# Kotne funkcije

Sin, cos, tan definiramo na enotski krožnici.

## Primer
Za 30° velja: sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3.
`,
  "1/trikotniki": `# Trikotniki — osnove

Vsota notranjih kotov je 180°.

## Primer
Pravokotni trikotnik s katetama a=3, b=4 → c = 5 (Pitagora).
`,
  // 2. letnik
  "2/linearne": `# Linearne funkcije

f(x) = kx + n, graf je premica.

## Primer
f(x)=2x+1: ničla je pri x = −1/2; presečišče z y-osjo je 1.
`,
  "2/kvadratne": `# Kvadratne funkcije

f(x)=ax²+bx+c. Ničle z diskriminanto D=b²−4ac.

## Primer
f(x)=x²−5x+6 → D=25−24=1, ničle: x=(5±1)/2 → x=2, x=3.
`,
  "2/faktorizacija": `# Faktorizacija polinomov

Razstavi izraz v produkt linearnih/kvadratnih faktorjev.

## Primer
x²−5x+6 = (x−2)(x−3).
`,
  "2/nicle": `# Ničle funkcije

Ničle so vrednosti x, kjer f(x)=0.

## Primer
f(x)=x²−1 → f(x)=0 pri x=±1.
`,
  // 3. letnik
  "3/limite": `# Limite — osnove

Limita opisuje vedenje funkcije pri približevanju argumenta določeni vrednosti.

## Primer
lim_{x→0} sin(x)/x = 1.
`,
  "3/zveznost": `# Zveznost

f je zvezna v a, če lim_{x→a} f(x) = f(a).

## Primer
Polinomi so povsod zvezni.
`,
  "3/sinus": `# Sinusna funkcija

Graf: perioda 2π, amplitude 1.

## Primer
Največje vrednosti pri x=π/2+2kπ.
`,
  "3/kosinus": `# Kosinusna funkcija

Graf: perioda 2π, amplitude 1.

## Primer
Največje vrednosti pri x=2kπ.
`,
  "3/tangens": `# Tangens

tan x = sin x / cos x, asimptote pri x=π/2 + kπ.
`,
  // 4. letnik
  "4/pravila-odvajanja": `# Pravila odvajanja

(x^n)' = n x^{n−1}, (sin x)' = cos x, (cos x)' = −sin x, …

## Primer
f(x)=x^3 → f'(x)=3x^2.
`,
  "4/ekstremi": `# Ekstremi

Stacionarne točke: f'(x)=0; preveri znak odvodov oz. drugo derivacijo.
`,
  "4/nedoloceni": `# Nedoločeni integrali

∫ x^n dx = x^{n+1}/(n+1) + C (n≠−1).
`,
  "4/doloceni": `# Določeni integrali

∫_a^b f(x) dx — površina pod grafom med a in b.
`,
  "4/kombinatorika": `# Kombinatorika — osnove

Permutacije, variacije, kombinacije.

## Primer
Kombinacije: C(n,k) = n!/(k!(n−k)!).
`,
  "4/porazdelitve": `# Porazdelitve

Diskretne: binomska, Poissonova; zvezne: normalna …
`,
};

export const handler = define.handlers({
  async GET(ctx) {
    const { year, slug } = ctx.params;
    let md = await readContent(year, slug);
    if (!md) {
      const key = `${year}/${slug}`;
      md = FALLBACK_MD[key] ?? null;
    }
    if (!md) return new Response("Ni vsebine", { status: 404 });
    // Simple MD → HTML (basic): replace # and code blocks minimalistically
    // For production, plug a proper Markdown renderer.
    const html = md
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-2">$1</h2>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>');

    const page = (
      `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${year} – ${slug}</title></head><body><main class="max-w-3xl mx-auto p-4 prose">${html}</main></body></html>`
    );
    return new Response(page, { headers: { "content-type": "text/html; charset=utf-8" } });
  },
});


