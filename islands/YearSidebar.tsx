import { useState, useEffect } from "preact/hooks";

interface Topic {
  title: { sl: string; en: string; it: string };
  items: Array<{ sl: string; en: string; it: string }>;
}

const topics: Topic[] = [
  { 
    title: { sl: "Števila", en: "Numbers", it: "Numeri" },
    items: [
      { sl: "Naravna števila", en: "Natural numbers", it: "Numeri naturali" },
      { sl: "Cela števila", en: "Integers", it: "Numeri interi" },
      { sl: "Racionalna števila", en: "Rational numbers", it: "Numeri razionali" },
      { sl: "Realna števila", en: "Real numbers", it: "Numeri reali" },
      { sl: "Kompleksna števila", en: "Complex numbers", it: "Numeri complessi" }
    ]
  },
  { 
    title: { sl: "Algebra", en: "Algebra", it: "Algebra" },
    items: [
      { sl: "Enačbe", en: "Equations", it: "Equazioni" },
      { sl: "Neenačbe", en: "Inequalities", it: "Disequazioni" },
      { sl: "Sistemi enačb", en: "Systems of equations", it: "Sistemi di equazioni" },
      { sl: "Kvadratne enačbe", en: "Quadratic equations", it: "Equazioni quadratiche" },
      { sl: "Polinomi", en: "Polynomials", it: "Polinomi" },
      { sl: "Faktorizacija", en: "Factorization", it: "Fattorizzazione" }
    ]
  },
  { 
    title: { sl: "Funkcije", en: "Functions", it: "Funzioni" },
    items: [
      { sl: "Linearne funkcije", en: "Linear functions", it: "Funzioni lineari" },
      { sl: "Kvadratne funkcije", en: "Quadratic functions", it: "Funzioni quadratiche" },
      { sl: "Eksponentne funkcije", en: "Exponential functions", it: "Funzioni esponenziali" },
      { sl: "Logaritemske funkcije", en: "Logarithmic functions", it: "Funzioni logaritmiche" },
      { sl: "Trigonometrične funkcije", en: "Trigonometric functions", it: "Funzioni trigonometriche" }
    ]
  },
  { 
    title: { sl: "Geometrija", en: "Geometry", it: "Geometria" },
    items: [
      { sl: "Trikotniki", en: "Triangles", it: "Triangoli" },
      { sl: "Krogi", en: "Circles", it: "Cerchi" },
      { sl: "Pitagorov izrek", en: "Pythagorean theorem", it: "Teorema di Pitagora" },
      { sl: "Podobnost", en: "Similarity", it: "Similitudine" },
      { sl: "Prostorska geometrija", en: "Spatial geometry", it: "Geometria spaziale" },
      { sl: "Površina", en: "Area", it: "Area" },
      { sl: "Volumen", en: "Volume", it: "Volume" }
    ]
  },
  { 
    title: { sl: "Trigonometrija", en: "Trigonometry", it: "Trigonometria" },
    items: [
      { sl: "Sinus", en: "Sine", it: "Seno" },
      { sl: "Kosinus", en: "Cosine", it: "Coseno" },
      { sl: "Tangens", en: "Tangent", it: "Tangente" },
      { sl: "Kotne funkcije", en: "Angular functions", it: "Funzioni angolari" },
      { sl: "Trigonometrične enačbe", en: "Trigonometric equations", it: "Equazioni trigonometriche" }
    ]
  },
  { 
    title: { sl: "Analiza", en: "Analysis", it: "Analisi" },
    items: [
      { sl: "Limite", en: "Limits", it: "Limiti" },
      { sl: "Zveznost", en: "Continuity", it: "Continuità" },
      { sl: "Odvodi", en: "Derivatives", it: "Derivate" },
      { sl: "Integrali", en: "Integrals", it: "Integrali" },
      { sl: "Ekstremi", en: "Extrema", it: "Estremi" }
    ]
  },
  { 
    title: { sl: "Verjetnost in statistika", en: "Probability and statistics", it: "Probabilità e statistica" },
    items: [
      { sl: "Kombinatorika", en: "Combinatorics", it: "Combinatoria" },
      { sl: "Verjetnostni račun", en: "Probability theory", it: "Teoria della probabilità" },
      { sl: "Porazdelitve", en: "Distributions", it: "Distribuzioni" },
      { sl: "Povprečje", en: "Average", it: "Media" },
      { sl: "Mediana", en: "Median", it: "Mediana" }
    ]
  },
  { 
    title: { sl: "Vektorji in matrike", en: "Vectors and matrices", it: "Vettori e matrici" },
    items: [
      { sl: "Vektorji", en: "Vectors", it: "Vettori" },
      { sl: "Skalarni produkt", en: "Dot product", it: "Prodotto scalare" },
      { sl: "Vektorski produkt", en: "Cross product", it: "Prodotto vettoriale" },
      { sl: "Matrike", en: "Matrices", it: "Matrici" },
      { sl: "Determinante", en: "Determinants", it: "Determinanti" }
    ]
  },
];

const translations = {
  title: { sl: "Teme", en: "Topics", it: "Argomenti" }
};

export default function YearSidebar() {
  const [lang, setLang] = useState<'sl' | 'en' | 'it'>('sl');
  const [activeTab, setActiveTab] = useState<'topics' | 'exercises'>('topics');

  useEffect(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' || 'sl';
    setLang(stored);

    // Listen for language changes
    const handleStorage = () => {
      const newLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' || 'sl';
      setLang(newLang);
    };

    window.addEventListener('storage', handleStorage);
    
    // Custom event for same-page updates
    const handleLangChange = () => {
      const newLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' || 'sl';
      setLang(newLang);
    };
    globalThis.addEventListener('pluto-lang-change', handleLangChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      globalThis.removeEventListener('pluto-lang-change', handleLangChange);
    };
  }, []);

  function handleTopicClick(topic: string) {
    try {
      console.log('Loading topic:', topic);
      
      // Send topic to AI for explanation
      const prompt = `Razloži matematično temo "${topic}". Podaj:
1. Kratko definicijo teme
2. Enostaven primer z rešitvijo
3. Kako se tema povezuje z drugimi matematičnimi koncepti`;
      
      const event = new CustomEvent("pluto-send", { detail: prompt });
      globalThis.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to load topic:', error);
    }
  }

  async function handleExerciseClick(topic: string) {
    try {
      console.log('Generating exercise for:', topic);
      
      // Dispatch loading event
      const loadingEvent = new CustomEvent("pluto-exercise-loading", { detail: true });
      globalThis.dispatchEvent(loadingEvent);
      
      // Generate exercise for the topic (send directly to API, not via chat UI)
      const prompts = {
        sl: `Generiraj 1 enostavno nalogo iz teme "${topic}". 
        
Navodila:
- Podaj samo nalogo (brez rešitve)
- Nalogo postavi jasno in razumljivo
- Primerna za vajo in utrjevanje znanja
- Na koncu dodaj: "Klikni 'Rešitev' za prikaz rešitve."`,
        en: `Generate 1 simple exercise on "${topic}". 

Instructions:
- Provide only the problem (without solution)
- State the problem clearly and understandably
- Suitable for practice and knowledge reinforcement
- At the end add: "Click 'Solution' to show the solution."`,
        it: `Genera 1 esercizio semplice su "${topic}". 

Istruzioni:
- Fornisci solo il problema (senza soluzione)
- Esponi il problema in modo chiaro e comprensibile
- Adatto per la pratica e il consolidamento delle conoscenze
- Alla fine aggiungi: "Clicca 'Soluzione' per mostrare la soluzione."`
      };
      
      // Send directly to API without showing in chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: prompts[lang],
          language: lang 
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
      console.error('Failed to generate exercise:', error);
      
      // Clear loading state on error
      const loadingOffEvent = new CustomEvent("pluto-exercise-loading", { detail: false });
      globalThis.dispatchEvent(loadingOffEvent);
    }
  }

  const tabLabels = {
    topics: { sl: "Teme", en: "Topics", it: "Argomenti" },
    exercises: { sl: "Naloge", en: "Exercises", it: "Esercizi" }
  };

  return (
    <aside class="w-72 bg-white border-r border-gray-200 p-3 sm:p-4 overflow-y-auto h-screen flex-shrink-0">
      {/* Tab buttons */}
      <div class="flex gap-2 mb-3 sm:mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('topics')}
          class={`flex-1 py-2.5 sm:py-2 px-3 text-sm font-medium rounded-lg transition-colors min-h-[44px] sm:min-h-0 ${
            activeTab === 'topics' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tabLabels.topics[lang]}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('exercises')}
          class={`flex-1 py-2.5 sm:py-2 px-3 text-sm font-medium rounded-lg transition-colors min-h-[44px] sm:min-h-0 ${
            activeTab === 'exercises' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tabLabels.exercises[lang]}
        </button>
      </div>
      
      {/* Topics/Exercises list */}
      <div class="space-y-1.5 sm:space-y-2">
        {topics.map((category) => (
          <details class="group">
            <summary class="cursor-pointer list-none flex items-center justify-between select-none py-3 sm:py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] sm:min-h-0">
              <span class="text-sm font-medium text-gray-700">{category.title[lang]}</span>
              <span class="text-xs text-gray-400 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div class="mt-1 ml-2 space-y-0.5">
              {category.items.map((item) => (
                <button
                  type="button"
                  onClick={() => activeTab === 'topics' ? handleTopicClick(item[lang]) : handleExerciseClick(item[lang])}
                  class="block w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-3 py-2.5 sm:py-2 transition-colors min-h-[44px] sm:min-h-0"
                >
                  {item[lang]}
                  {activeTab === 'exercises' && <span class="ml-1 text-xs text-blue-600">📝</span>}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </aside>
  );
}