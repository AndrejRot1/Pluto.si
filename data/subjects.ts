export type LangCode = "sl" | "en" | "it" | "de" | "fr" | "es" | "pl" | "ro";
export type Localized = Record<LangCode, string>;
export type TopicCategory = { title: Localized; items: Localized[] };
export type SubjectId = "math" | "physics" | "chemistry" | "biology";

export type Subject = {
  id: SubjectId;
  label: Localized;
  emoji: string;
  topics: TopicCategory[];
};

const L = (
  sl: string,
  en: string,
  it = en,
  de = en,
  fr = en,
  es = en,
  pl = en,
  ro = en,
): Localized => ({ sl, en, it, de, fr, es, pl, ro });

export const subjects: Subject[] = [
  {
    id: "math",
    label: L("Matematika", "Mathematics", "Matematica", "Mathematik", "Mathématiques", "Matemáticas", "Matematyka", "Matematică"),
    emoji: "∑",
    topics: [
      {
        title: L("Števila", "Numbers", "Numeri", "Zahlen", "Nombres", "Números", "Liczby", "Numere"),
        items: [
          L("Naravna števila", "Natural numbers"),
          L("Cela števila", "Integers"),
          L("Racionalna števila", "Rational numbers"),
          L("Realna števila", "Real numbers"),
          L("Kompleksna števila", "Complex numbers"),
        ],
      },
      {
        title: L("Algebra", "Algebra", "Algebra", "Algebra", "Algèbre", "Álgebra"),
        items: [
          L("Enačbe", "Equations"),
          L("Neenačbe", "Inequalities"),
          L("Sistemi enačb", "Systems of equations"),
          L("Kvadratne enačbe", "Quadratic equations"),
          L("Polinomi", "Polynomials"),
          L("Faktorizacija", "Factorization"),
          L("Razstavljanje izrazov", "Factoring expressions"),
        ],
      },
      {
        title: L("Funkcije", "Functions", "Funzioni", "Funktionen", "Fonctions", "Funciones", "Funkcje", "Funcții"),
        items: [
          L("Linearne funkcije", "Linear functions"),
          L("Kvadratne funkcije", "Quadratic functions"),
          L("Eksponentne funkcije", "Exponential functions"),
          L("Logaritemske funkcije", "Logarithmic functions"),
          L("Trigonometrične funkcije", "Trigonometric functions"),
        ],
      },
      {
        title: L("Geometrija", "Geometry", "Geometria", "Geometrie", "Géométrie", "Geometría"),
        items: [
          L("Trikotniki", "Triangles"),
          L("Krogi", "Circles"),
          L("Pitagorov izrek", "Pythagorean theorem"),
          L("Podobnost", "Similarity"),
          L("Prostorska geometrija", "Spatial geometry"),
          L("Površina", "Area"),
          L("Volumen", "Volume"),
        ],
      },
      {
        title: L("Analiza", "Analysis", "Analisi", "Analysis", "Analyse", "Análisis", "Analiza", "Analiză"),
        items: [
          L("Limite", "Limits"),
          L("Odvodi", "Derivatives"),
          L("Integrali", "Integrals"),
          L("Ekstremi", "Extrema"),
        ],
      },
      {
        title: L("Verjetnost in statistika", "Probability and statistics"),
        items: [
          L("Kombinatorika", "Combinatorics"),
          L("Verjetnostni račun", "Probability theory"),
          L("Povprečje", "Average"),
          L("Mediana", "Median"),
        ],
      },
      {
        title: L("Vektorji in matrike", "Vectors and matrices"),
        items: [
          L("Vektorji", "Vectors"),
          L("Skalarni produkt", "Dot product"),
          L("Vektorski produkt", "Cross product"),
          L("Matrike", "Matrices"),
          L("Determinante", "Determinants"),
        ],
      },
    ],
  },
  {
    id: "physics",
    label: L("Fizika", "Physics", "Fisica", "Physik", "Physique", "Física", "Fizyka", "Fizică"),
    emoji: "⚛",
    topics: [
      {
        title: L("Mehanika", "Mechanics"),
        items: [
          L("Kinematika", "Kinematics"),
          L("Newtonovi zakoni", "Newton's laws"),
          L("Delo in energija", "Work and energy"),
          L("Gibalna količina", "Momentum"),
          L("Kroženje", "Circular motion"),
        ],
      },
      {
        title: L("Elektrika in magnetizem", "Electricity and magnetism"),
        items: [
          L("Električni naboj", "Electric charge"),
          L("Ohmov zakon", "Ohm's law"),
          L("Tokokrogi", "Circuits"),
          L("Magnetno polje", "Magnetic field"),
          L("Elektromagnetna indukcija", "Electromagnetic induction"),
        ],
      },
      {
        title: L("Valovanje in optika", "Waves and optics"),
        items: [
          L("Zvočni valovi", "Sound waves"),
          L("Svetloba", "Light"),
          L("Odboj in lom", "Reflection and refraction"),
          L("Leče", "Lenses"),
        ],
      },
      {
        title: L("Termodinamika", "Thermodynamics"),
        items: [
          L("Temperatura in toplota", "Temperature and heat"),
          L("Plinski zakoni", "Gas laws"),
          L("Toplotni stroji", "Heat engines"),
        ],
      },
      {
        title: L("Sodobna fizika", "Modern physics"),
        items: [
          L("Atomska zgradba", "Atomic structure"),
          L("Radioaktivnost", "Radioactivity"),
          L("Osnove kvantne fizike", "Intro to quantum physics"),
        ],
      },
    ],
  },
  {
    id: "chemistry",
    label: L("Kemija", "Chemistry", "Chimica", "Chemie", "Chimie", "Química", "Chemia", "Chimie"),
    emoji: "🧪",
    topics: [
      {
        title: L("Osnove", "Fundamentals"),
        items: [
          L("Atom in periodni sistem", "Atom and periodic table"),
          L("Kemijske vezi", "Chemical bonds"),
          L("Mol in množina snovi", "Mole and amount of substance"),
          L("Stehiometrija", "Stoichiometry"),
        ],
      },
      {
        title: L("Reakcije", "Reactions"),
        items: [
          L("Tipi reakcij", "Types of reactions"),
          L("Oksidacija in redukcija", "Oxidation and reduction"),
          L("Hitrost reakcij", "Reaction rates"),
          L("Kemijsko ravnotežje", "Chemical equilibrium"),
        ],
      },
      {
        title: L("Raztopine in kisline", "Solutions and acids"),
        items: [
          L("Koncentracija", "Concentration"),
          L("pH in kisline/baze", "pH and acids/bases"),
          L("Titracija", "Titration"),
        ],
      },
      {
        title: L("Organska kemija", "Organic chemistry"),
        items: [
          L("Ogljikovodiki", "Hydrocarbons"),
          L("Funkcionalne skupine", "Functional groups"),
          L("Polimeri", "Polymers"),
        ],
      },
    ],
  },
  {
    id: "biology",
    label: L("Biologija", "Biology", "Biologia", "Biologie", "Biologie", "Biología", "Biologia", "Biologie"),
    emoji: "🧬",
    topics: [
      {
        title: L("Celica", "Cell"),
        items: [
          L("Zgradba celice", "Cell structure"),
          L("Fotosinteza", "Photosynthesis"),
          L("Celično dihanje", "Cellular respiration"),
          L("Mitaza in mejoza", "Mitosis and meiosis"),
        ],
      },
      {
        title: L("Genetika", "Genetics"),
        items: [
          L("DNA in RNA", "DNA and RNA"),
          L("Dedovanje", "Inheritance"),
          L("Mutacije", "Mutations"),
        ],
      },
      {
        title: L("Človeško telo", "Human body"),
        items: [
          L("Kri in obtok", "Blood and circulation"),
          L("Dihalni sistem", "Respiratory system"),
          L("Živčevje", "Nervous system"),
          L("Prebavila", "Digestive system"),
        ],
      },
      {
        title: L("Ekologija", "Ecology"),
        items: [
          L("Ekosistemi", "Ecosystems"),
          L("Prehranjevalne verige", "Food chains"),
          L("Biodiversiteta", "Biodiversity"),
        ],
      },
      {
        title: L("Evolucija", "Evolution"),
        items: [
          L("Naravna selekcija", "Natural selection"),
          L("Adaptacije", "Adaptations"),
          L("Klasifikacija organizmov", "Classification of organisms"),
        ],
      },
    ],
  },
];

export function getSubject(id: SubjectId | string | null | undefined): Subject {
  return subjects.find((s) => s.id === id) ?? subjects[0];
}

export function isSubjectId(id: string): id is SubjectId {
  return subjects.some((s) => s.id === id);
}

export function subjectSystemPrompt(subjectId: SubjectId | string, language: string): string {
  const subject = getSubject(subjectId);
  const name = subject.label.en;
  const langMap: Record<string, string> = {
    sl: "Respond in Slovenian",
    en: "Respond in English",
    it: "Respond in Italian",
    de: "Respond in German",
    fr: "Respond in French",
    es: "Respond in Spanish",
    pl: "Respond in Polish",
    ro: "Respond in Romanian",
  };
  const langInstruction = langMap[language] || langMap.en;

  const latexRules = `
LATEX FORMATTING (critical - UI renders KaTeX + mhchem):
- ALWAYS wrap EVERY formula/equation/chemical formula in $...$ (inline) or $$...$$ (display).
- Put important equations alone on their own line inside $$...$$.
- NEVER leave raw LaTeX like \\frac, \\mathrm, \\ce outside dollar delimiters.
- Physics: $$F = m a$$, $E = \\frac{1}{2} m v^{2}$, units as $\\mathrm{m/s}$.
- Chemistry: ALWAYS use mhchem, e.g. $\\ce{H2O}$, $\\ce{2H2 + O2 -> 2H2O}$, $\\ce{H2SO4}$.
- Biology: genetics/rates in $...$; organism names in plain text or *italics*.
- Do NOT use \\( \\) or \\[ \\]. Use only $ and $$.
- Do NOT put formulas only in markdown code fences.

DIAGRAMS (especially chemistry & biology):
- When a figure helps (cell, organelle, apparatus, molecule sketch, cycle), include a simple educational SVG fenced as \`\`\`svg ... \`\`\`.
- Keep SVG under ~40 elements, high contrast, labels in the reply language.
- Do NOT invent http(s) image URLs (they break). Prefer SVG.
- For math y=f(x) graphs, you may use [GRAPH:expression] with JS math (x^2, 2*x, sin(x)).`;

  return `You are an expert ${name} tutor for secondary-school and early university students.
${langInstruction}.
Be precise, encouraging, and exam-oriented. Prefer clear step-by-step reasoning with short paragraphs.
Use correct scientific terminology and units.
${latexRules}
If the question is outside ${name}, briefly say so and still help if related to school STEM.
Never invent false scientific facts. If unsure, say what is uncertain.`;
}
