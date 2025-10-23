import { useState, useEffect } from "preact/hooks";

interface Topic {
  title: { sl: string; en: string; it: string; de: string; fr: string; es: string; pl: string; ro: string };
  items: Array<{ sl: string; en: string; it: string; de: string; fr: string; es: string; pl: string; ro: string }>;
}

const topics: Topic[] = [
  { 
    title: { sl: "Števila", en: "Numbers", it: "Numeri", de: "Zahlen", fr: "Nombres", es: "Números", pl: "Liczby", ro: "Numere" },
    items: [
      { sl: "Naravna števila", en: "Natural numbers", it: "Numeri naturali", de: "Natürliche Zahlen", fr: "Nombres naturels", es: "Números naturales", pl: "Liczby naturalne", ro: "Numere naturale" },
      { sl: "Cela števila", en: "Integers", it: "Numeri interi", de: "Ganze Zahlen", fr: "Nombres entiers", es: "Números enteros", pl: "Liczby całkowite", ro: "Numere întregi" },
      { sl: "Racionalna števila", en: "Rational numbers", it: "Numeri razionali", de: "Rationale Zahlen", fr: "Nombres rationnels", es: "Números racionales", pl: "Liczby wymierne", ro: "Numere raționale" },
      { sl: "Realna števila", en: "Real numbers", it: "Numeri reali", de: "Reelle Zahlen", fr: "Nombres réels", es: "Números reales", pl: "Liczby rzeczywiste", ro: "Numere reale" },
      { sl: "Kompleksna števila", en: "Complex numbers", it: "Numeri complessi", de: "Komplexe Zahlen", fr: "Nombres complexes", es: "Números complejos", pl: "Liczby zespolone", ro: "Numere complexe" }
    ]
  },
  { 
    title: { sl: "Algebra", en: "Algebra", it: "Algebra", de: "Algebra", fr: "Algèbre", es: "Álgebra", pl: "Algebra", ro: "Algebră" },
    items: [
      { sl: "Enačbe", en: "Equations", it: "Equazioni", de: "Gleichungen", fr: "Équations", es: "Ecuaciones", pl: "Równania", ro: "Ecuații" },
      { sl: "Neenačbe", en: "Inequalities", it: "Disequazioni", de: "Ungleichungen", fr: "Inéquations", es: "Inecuaciones", pl: "Nierówności", ro: "Inecuații" },
      { sl: "Sistemi enačb", en: "Systems of equations", it: "Sistemi di equazioni", de: "Gleichungssysteme", fr: "Systèmes d'équations", es: "Sistemas de ecuaciones", pl: "Układy równań", ro: "Sisteme de ecuații" },
      { sl: "Kvadratne enačbe", en: "Quadratic equations", it: "Equazioni quadratiche", de: "Quadratische Gleichungen", fr: "Équations quadratiques", es: "Ecuaciones cuadráticas", pl: "Równania kwadratowe", ro: "Ecuații pătratice" },
      { sl: "Polinomi", en: "Polynomials", it: "Polinomi", de: "Polynome", fr: "Polynômes", es: "Polinomios", pl: "Wielomiany", ro: "Polinoame" },
      { sl: "Faktorizacija", en: "Factorization", it: "Fattorizzazione", de: "Faktorisierung", fr: "Factorisation", es: "Factorización", pl: "Faktoryzacja", ro: "Factorizare" }
    ]
  },
  { 
    title: { sl: "Funkcije", en: "Functions", it: "Funzioni", de: "Funktionen", fr: "Fonctions", es: "Funciones", pl: "Funkcje", ro: "Funcții" },
    items: [
      { sl: "Linearne funkcije", en: "Linear functions", it: "Funzioni lineari", de: "Lineare Funktionen", fr: "Fonctions linéaires", es: "Funciones lineales", pl: "Funkcje liniowe", ro: "Funcții liniare" },
      { sl: "Kvadratne funkcije", en: "Quadratic functions", it: "Funzioni quadratiche", de: "Quadratische Funktionen", fr: "Fonctions quadratiques", es: "Funciones cuadráticas", pl: "Funkcje kwadratowe", ro: "Funcții pătratice" },
      { sl: "Eksponentne funkcije", en: "Exponential functions", it: "Funzioni esponenziali", de: "Exponentialfunktionen", fr: "Fonctions exponentielles", es: "Funciones exponenciales", pl: "Funkcje wykładnicze", ro: "Funcții exponențiale" },
      { sl: "Logaritemske funkcije", en: "Logarithmic functions", it: "Funzioni logaritmiche", de: "Logarithmische Funktionen", fr: "Fonctions logarithmiques", es: "Funciones logarítmicas", pl: "Funkcje logarytmiczne", ro: "Funcții logaritmice" },
      { sl: "Trigonometrične funkcije", en: "Trigonometric functions", it: "Funzioni trigonometriche", de: "Trigonometrische Funktionen", fr: "Fonctions trigonométriques", es: "Funciones trigonométricas", pl: "Funkcje trygonometryczne", ro: "Funcții trigonometrice" }
    ]
  },
  { 
    title: { sl: "Geometrija", en: "Geometry", it: "Geometria", de: "Geometrie", fr: "Géométrie", es: "Geometría", pl: "Geometria", ro: "Geometrie" },
    items: [
      { sl: "Trikotniki", en: "Triangles", it: "Triangoli", de: "Dreiecke", fr: "Triangles", es: "Triángulos", pl: "Trójkąty", ro: "Triunghiuri" },
      { sl: "Krogi", en: "Circles", it: "Cerchi", de: "Kreise", fr: "Cercles", es: "Círculos", pl: "Okręgi", ro: "Cercuri" },
      { sl: "Pitagorov izrek", en: "Pythagorean theorem", it: "Teorema di Pitagora", de: "Satz des Pythagoras", fr: "Théorème de Pythagore", es: "Teorema de Pitágoras", pl: "Twierdzenie Pitagorasa", ro: "Teorema lui Pitagora" },
      { sl: "Podobnost", en: "Similarity", it: "Similitudine", de: "Ähnlichkeit", fr: "Similitude", es: "Semejanza", pl: "Podobieństwo", ro: "Asemănare" },
      { sl: "Prostorska geometrija", en: "Spatial geometry", it: "Geometria spaziale", de: "Raumgeometrie", fr: "Géométrie spatiale", es: "Geometría espacial", pl: "Geometria przestrzenna", ro: "Geometrie spațială" },
      { sl: "Površina", en: "Area", it: "Area", de: "Fläche", fr: "Aire", es: "Área", pl: "Powierzchnia", ro: "Arie" },
      { sl: "Volumen", en: "Volume", it: "Volume", de: "Volumen", fr: "Volume", es: "Volumen", pl: "Objętość", ro: "Volum" }
    ]
  },
  { 
    title: { sl: "Trigonometrija", en: "Trigonometry", it: "Trigonometria", de: "Trigonometrie", fr: "Trigonométrie", es: "Trigonometría", pl: "Trygonometria", ro: "Trigonometrie" },
    items: [
      { sl: "Sinus", en: "Sine", it: "Seno", de: "Sinus", fr: "Sinus", es: "Seno", pl: "Sinus", ro: "Sinus" },
      { sl: "Kosinus", en: "Cosine", it: "Coseno", de: "Kosinus", fr: "Cosinus", es: "Coseno", pl: "Cosinus", ro: "Cosinus" },
      { sl: "Tangens", en: "Tangent", it: "Tangente", de: "Tangens", fr: "Tangente", es: "Tangente", pl: "Tangens", ro: "Tangentă" },
      { sl: "Kotne funkcije", en: "Angular functions", it: "Funzioni angolari", de: "Winkelfunktionen", fr: "Fonctions angulaires", es: "Funciones angulares", pl: "Funkcje kątowe", ro: "Funcții unghiulare" },
      { sl: "Trigonometrične enačbe", en: "Trigonometric equations", it: "Equazioni trigonometriche", de: "Trigonometrische Gleichungen", fr: "Équations trigonométriques", es: "Ecuaciones trigonométricas", pl: "Równania trygonometryczne", ro: "Ecuații trigonometrice" }
    ]
  },
  { 
    title: { sl: "Analiza", en: "Analysis", it: "Analisi", de: "Analysis", fr: "Analyse", es: "Análisis", pl: "Analiza", ro: "Analiză" },
    items: [
      { sl: "Limite", en: "Limits", it: "Limiti", de: "Grenzwerte", fr: "Limites", es: "Límites", pl: "Granice", ro: "Limite" },
      { sl: "Zveznost", en: "Continuity", it: "Continuità", de: "Stetigkeit", fr: "Continuité", es: "Continuidad", pl: "Ciągłość", ro: "Continuitate" },
      { sl: "Odvodi", en: "Derivatives", it: "Derivate", de: "Ableitungen", fr: "Dérivées", es: "Derivadas", pl: "Pochodne", ro: "Derivate" },
      { sl: "Integrali", en: "Integrals", it: "Integrali", de: "Integrale", fr: "Intégrales", es: "Integrales", pl: "Całki", ro: "Integrale" },
      { sl: "Ekstremi", en: "Extrema", it: "Estremi", de: "Extremwerte", fr: "Extrema", es: "Extremos", pl: "Ekstrema", ro: "Extreme" }
    ]
  },
  { 
    title: { sl: "Verjetnost in statistika", en: "Probability and statistics", it: "Probabilità e statistica", de: "Wahrscheinlichkeit und Statistik", fr: "Probabilités et statistiques", es: "Probabilidad y estadística", pl: "Prawdopodobieństwo i statystyka", ro: "Probabilitate și statistică" },
    items: [
      { sl: "Kombinatorika", en: "Combinatorics", it: "Combinatoria", de: "Kombinatorik", fr: "Combinatoire", es: "Combinatoria", pl: "Kombinatoryka", ro: "Combinatorică" },
      { sl: "Verjetnostni račun", en: "Probability theory", it: "Teoria della probabilità", de: "Wahrscheinlichkeitstheorie", fr: "Théorie des probabilités", es: "Teoría de la probabilidad", pl: "Teoria prawdopodobieństwa", ro: "Teoria probabilității" },
      { sl: "Porazdelitve", en: "Distributions", it: "Distribuzioni", de: "Verteilungen", fr: "Distributions", es: "Distribuciones", pl: "Rozkłady", ro: "Distribuții" },
      { sl: "Povprečje", en: "Average", it: "Media", de: "Durchschnitt", fr: "Moyenne", es: "Promedio", pl: "Średnia", ro: "Medie" },
      { sl: "Mediana", en: "Median", it: "Mediana", de: "Median", fr: "Médiane", es: "Mediana", pl: "Mediana", ro: "Mediană" }
    ]
  },
  { 
    title: { sl: "Vektorji in matrike", en: "Vectors and matrices", it: "Vettori e matrici", de: "Vektoren und Matrizen", fr: "Vecteurs et matrices", es: "Vectores y matrices", pl: "Wektory i macierze", ro: "Vectori și matrici" },
    items: [
      { sl: "Vektorji", en: "Vectors", it: "Vettori", de: "Vektoren", fr: "Vecteurs", es: "Vectores", pl: "Wektory", ro: "Vectori" },
      { sl: "Skalarni produkt", en: "Dot product", it: "Prodotto scalare", de: "Skalarprodukt", fr: "Produit scalaire", es: "Producto escalar", pl: "Iloczyn skalarny", ro: "Produs scalar" },
      { sl: "Vektorski produkt", en: "Cross product", it: "Prodotto vettoriale", de: "Kreuzprodukt", fr: "Produit vectoriel", es: "Producto vectorial", pl: "Iloczyn wektorowy", ro: "Produs vectorial" },
      { sl: "Matrike", en: "Matrices", it: "Matrici", de: "Matrizen", fr: "Matrices", es: "Matrices", pl: "Macierze", ro: "Matrici" },
      { sl: "Determinante", en: "Determinants", it: "Determinanti", de: "Determinanten", fr: "Déterminants", es: "Determinantes", pl: "Wyznaczniki", ro: "Determinanți" }
    ]
  },
];

const translations = {
  title: { sl: "Teme", en: "Topics", it: "Argomenti", de: "Themen", fr: "Sujets", es: "Temas", pl: "Tematy", ro: "Subiecte" }
};

export default function YearSidebar() {
  const [lang, setLang] = useState<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro'>('sl');
  const [activeTab, setActiveTab] = useState<'topics' | 'exercises'>('topics');
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);

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
      const prompts: Record<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro', string> = {
        sl: `Razloži matematično temo "${topic}". Podaj:
1. Kratko definicijo teme
2. Enostaven primer z rešitvijo
3. Kako se tema povezuje z drugimi matematičnimi koncepti`,
        en: `Explain the mathematical topic "${topic}". Provide:
1. A brief definition of the topic
2. A simple example with solution
3. How the topic relates to other mathematical concepts`,
        it: `Spiega l'argomento matematico "${topic}". Fornisci:
1. Una breve definizione dell'argomento
2. Un esempio semplice con soluzione
3. Come l'argomento si collega ad altri concetti matematici`,
        de: `Erkläre das mathematische Thema "${topic}". Gib an:
1. Eine kurze Definition des Themas
2. Ein einfaches Beispiel mit Lösung
3. Wie sich das Thema zu anderen mathematischen Konzepten verhält`,
        fr: `Explique le sujet mathématique "${topic}". Fournis:
1. Une brève définition du sujet
2. Un exemple simple avec solution
3. Comment le sujet se rapporte à d'autres concepts mathématiques`,
        es: `Explica el tema matemático "${topic}". Proporciona:
1. Una breve definición del tema
2. Un ejemplo simple con solución
3. Cómo se relaciona el tema con otros conceptos matemáticos`,
        pl: `Wyjaśnij temat matematyczny "${topic}". Podaj:
1. Krótką definicję tematu
2. Prosty przykład z rozwiązaniem
3. Jak temat odnosi się do innych koncepcji matematycznych`,
        ro: `Explică subiectul matematic "${topic}". Furnizează:
1. O definiție scurtă a subiectului
2. Un exemplu simplu cu soluție
3. Cum se raportează subiectul la alte concepte matematice`
      };
      
      const prompt = prompts[lang] || prompts['en']; // Fallback to English
      console.log('Topic explanation - lang:', lang, 'has prompt:', !!prompt);
      const event = new CustomEvent("pluto-send", { detail: prompt });
      globalThis.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to load topic:', error);
    }
  }

  async function handleExerciseClick(topic: string, resetDifficulty: boolean = true) {
    try {
      console.log('Generating exercise for:', topic, 'difficulty:', resetDifficulty ? 1 : difficultyLevel);
      
      // Reset difficulty if new topic selected
      if (resetDifficulty || currentTopic !== topic) {
        setCurrentTopic(topic);
        setDifficultyLevel(1);
      }
      
      const currentDiff = resetDifficulty ? 1 : difficultyLevel;
      
      // Dispatch loading event
      const loadingEvent = new CustomEvent("pluto-exercise-loading", { detail: true });
      globalThis.dispatchEvent(loadingEvent);
      
      // Difficulty descriptors
      const difficultyDescriptors = {
        1: { sl: "zelo enostavno", en: "very simple", it: "molto semplice", de: "sehr einfach", fr: "très simple", es: "muy simple", pl: "bardzo łatwe", ro: "foarte simplu" },
        2: { sl: "enostavno", en: "simple", it: "semplice", de: "einfach", fr: "simple", es: "simple", pl: "łatwe", ro: "simplu" },
        3: { sl: "srednje težko", en: "medium difficulty", it: "difficoltà media", de: "mittlerer Schwierigkeitsgrad", fr: "difficulté moyenne", es: "dificultad media", pl: "średni poziom", ro: "dificultate medie" },
        4: { sl: "težko", en: "difficult", it: "difficile", de: "schwierig", fr: "difficile", es: "difícil", pl: "trudne", ro: "dificil" },
        5: { sl: "zelo težko", en: "very difficult", it: "molto difficile", de: "sehr schwierig", fr: "très difficile", es: "muy difícil", pl: "bardzo trudne", ro: "foarte dificil" }
      };
      
      const diffDesc = difficultyDescriptors[Math.min(currentDiff, 5) as 1 | 2 | 3 | 4 | 5][lang];
      
      // Generate exercise for the topic (send directly to API, not via chat UI)
      const prompts: Record<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro', string> = {
        sl: `Generiraj 1 ${diffDesc} nalogo iz teme "${topic}". 
        
Navodila:
- Podaj samo nalogo (brez rešitve)
- Nalogo postavi jasno in razumljivo
- Težavnost: ${diffDesc} (stopnja ${currentDiff}/5)
- Primerna za vajo in utrjevanje znanja
- Na koncu dodaj: "Klikni 'Rešitev' za prikaz rešitve."`,
        en: `Generate 1 ${diffDesc} exercise on "${topic}". 

Instructions:
- Provide only the problem (without solution)
- State the problem clearly and understandably
- Difficulty: ${diffDesc} (level ${currentDiff}/5)
- Suitable for practice and knowledge reinforcement
- At the end add: "Click 'Solution' to show the solution."`,
        it: `Genera 1 esercizio ${diffDesc} su "${topic}". 

Istruzioni:
- Fornisci solo il problema (senza soluzione)
- Esponi il problema in modo chiaro e comprensibile
- Difficoltà: ${diffDesc} (livello ${currentDiff}/5)
- Adatto per la pratica e il consolidamento delle conoscenze
- Alla fine aggiungi: "Clicca 'Soluzione' per mostrare la soluzione."`,
        de: `Generiere 1 ${diffDesc} Übung zu "${topic}". 

Anweisungen:
- Gib nur die Aufgabe an (ohne Lösung)
- Stelle die Aufgabe klar und verständlich
- Schwierigkeit: ${diffDesc} (Stufe ${currentDiff}/5)
- Geeignet für Übung und Wissensvertiefung
- Am Ende hinzufügen: "Klicke 'Lösung' um die Lösung anzuzeigen."`,
        fr: `Génère 1 exercice ${diffDesc} sur "${topic}". 

Instructions:
- Fournis seulement le problème (sans solution)
- Énonce le problème de manière claire et compréhensible
- Difficulté: ${diffDesc} (niveau ${currentDiff}/5)
- Approprié pour la pratique et le renforcement des connaissances
- À la fin ajoute: "Clique 'Solution' pour afficher la solution."`,
        es: `Genera 1 ejercicio ${diffDesc} sobre "${topic}". 

Instrucciones:
- Proporciona solo el problema (sin solución)
- Presenta el problema de manera clara y comprensible
- Dificultad: ${diffDesc} (nivel ${currentDiff}/5)
- Adecuado para práctica y refuerzo del conocimiento
- Al final añade: "Haz clic en 'Solución' para mostrar la solución."`,
        pl: `Wygeneruj 1 ${diffDesc} zadanie na temat "${topic}". 

Instrukcje:
- Podaj tylko zadanie (bez rozwiązania)
- Przedstaw zadanie jasno i zrozumiale
- Trudność: ${diffDesc} (poziom ${currentDiff}/5)
- Odpowiednie do ćwiczeń i utrwalania wiedzy
- Na końcu dodaj: "Kliknij 'Rozwiązanie' aby pokazać rozwiązanie."`,
        ro: `Generează 1 exercițiu ${diffDesc} despre "${topic}". 

Instrucțiuni:
- Furnizează doar problema (fără soluție)
- Prezintă problema clar și comprehensibil
- Dificultate: ${diffDesc} (nivel ${currentDiff}/5)
- Potrivit pentru practică și consolidarea cunoștințelor
- La final adaugă: "Click 'Soluție' pentru a afișa soluția."`
      };
      
      const selectedPrompt = prompts[lang] || prompts['en']; // Fallback to English
      console.log('Exercise generation - lang:', lang, 'has prompt:', !!selectedPrompt);
      
      // Send directly to API without showing in chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: selectedPrompt,
          language: lang 
        })
      });
      
      const data = await response.json();
      
      // Dispatch event to add only AI response to chat
      const responseEvent = new CustomEvent("pluto-exercise-response", { 
        detail: { 
          content: data.reply,
          topic: topic,
          difficulty: currentDiff,
          isExercise: true 
        } 
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

  // Listen for next exercise requests
  useEffect(() => {
    const handleNextExercise = (e: Event) => {
      const ce = e as CustomEvent<{ topic: string }>;
      console.log('Next exercise requested for:', ce.detail.topic);
      
      // Increment difficulty
      setDifficultyLevel(prev => Math.min(prev + 1, 5));
      
      // Generate next exercise with increased difficulty
      setTimeout(() => {
        handleExerciseClick(ce.detail.topic, false);
      }, 100);
    };
    
    globalThis.addEventListener('pluto-next-exercise', handleNextExercise as EventListener);
    
    return () => {
      globalThis.removeEventListener('pluto-next-exercise', handleNextExercise as EventListener);
    };
  }, [difficultyLevel, currentTopic]);

  const tabLabels = {
    topics: { sl: "Teme", en: "Topics", it: "Argomenti", de: "Themen", fr: "Sujets", es: "Temas", pl: "Tematy", ro: "Subiecte" },
    exercises: { sl: "Naloge", en: "Exercises", it: "Esercizi", de: "Übungen", fr: "Exercices", es: "Ejercicios", pl: "Zadania", ro: "Exerciții" }
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