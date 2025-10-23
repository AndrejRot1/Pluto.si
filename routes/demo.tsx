import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function DemoPage() {
  return (
    <>
      <Head>
        <title>Demo - Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"
          integrity="sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx"
          crossOrigin="anonymous"
        ></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
          integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05"
          crossOrigin="anonymous"
        ></script>
      </Head>
      
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
        {/* Header */}
        <header class="bg-white/80 backdrop-blur border-b border-gray-200 p-4">
          <div class="max-w-4xl mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">🚀 Pluto.si Demo</h1>
            <a 
              id="back-link"
              href="/" 
              class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              ← Back
            </a>
          </div>
        </header>

        {/* Demo Chat */}
        <div class="flex-1 flex items-center justify-center p-4">
          <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 id="demo-header-title" class="text-xl font-semibold text-gray-800">Welcome to Pluto.si 🚀</h2>
              <p id="demo-header-subtitle" class="text-sm text-gray-600 mt-1">Your personal AI math tutor</p>
            </div>
            
            <div id="demo-chat" class="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {/* Intro message */}
              <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div id="intro-text" class="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                  {/* Will be filled by JS */}
                </div>
              </div>
              
              {/* Problem */}
              <div id="problem-container" class="hidden">
                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md ml-auto">
                  <p class="text-gray-800 font-medium text-base" id="problem-text"></p>
                </div>
              </div>
              
              {/* Solution */}
              <div id="solution-container" class="hidden">
                <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div id="solution-text" class="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 text-base">
                    {/* Will be filled by JS */}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 text-center">
              <p id="cta-text" class="text-sm text-gray-700 mb-3">
                ✨ Ready to start learning?
              </p>
              <a 
                id="cta-button"
                href="/auth/register" 
                class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Register Now - Free Trial
              </a>
            </div>
          </div>
        </div>

        {/* Demo Animation Script */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Get language from localStorage (set by landing page)
          const lang = localStorage.getItem('pluto-lang') || 'en';
          
          const translations = {
            sl: {
              backLink: '← Nazaj',
              headerTitle: 'Dobrodošli v Pluto.si 🚀',
              headerSubtitle: 'Vaš osebni AI matematični tutor',
              ctaText: '✨ Pripravljeni začeti učenje?',
              ctaButton: 'Registriraj se zdaj - Brezplačno preizkusno obdobje',
              introText: \`Pozdravljeni! 👋

Pluto.si je vaš osebni matematični asistent, zasnovan za učence in dijake, ki želijo **izboljšati svoje razumevanje matematike** in dosegati **boljše rezultate**.

**Kaj vam ponujamo:**

✓ **Korak-po-korak razlage** – Vsak problem rešujemo sistematično, da razumete *zakaj* in ne samo *kako*.

✓ **Podpora za vsa področja** – Od osnovne algebre do integralov in diferenciala.

✓ **Interaktivna tipkovnica** – Enostavno vstavljanje matematičnih simbolov in formul.

✓ **Vizualizacije grafov** – Prikaz funkcij za boljše razumevanje.

✓ **Večjezična podpora** – Slovenščina, angleščina in italijanščina.

**Oglejmo si primer:**\`,
              problem: 'Reši enačbo: 3x + 5 = 20',
              solution: \`**Reševanje linearne enačbe**

**Korak 1:** Odštejemo 5 z obeh strani
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Korak 2:** Delimo z 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Rešitev:** x = 5

✅ Preverimo: 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            en: {
              backLink: '← Back',
              headerTitle: 'Welcome to Pluto.si 🚀',
              headerSubtitle: 'Your personal AI math tutor',
              ctaText: '✨ Ready to start learning?',
              ctaButton: 'Register Now - Free Trial',
              introText: \`Hello! 👋

Pluto.si is your personal mathematics assistant, designed to help you **improve your understanding** and **achieve better results**.

**What we offer:**

✓ **Step-by-step explanations** – We solve each problem systematically so you understand *why*, not just *how*.

✓ **Support for all topics** – From basic algebra to integrals and calculus.

✓ **Interactive keyboard** – Easy input of mathematical symbols and formulas.

✓ **Graph visualizations** – Display functions for better understanding.

✓ **Multilingual support** – Slovenian, English, and Italian.

**Let's see an example:**\`,
              problem: 'Solve the equation: 3x + 5 = 20',
              solution: \`**Solving a Linear Equation**

**Step 1:** Subtract 5 from both sides
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Step 2:** Divide by 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Solution:** x = 5

✅ We can verify: 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            it: {
              backLink: '← Indietro',
              headerTitle: 'Benvenuto a Pluto.si 🚀',
              headerSubtitle: 'Il tuo tutor di matematica AI personale',
              ctaText: '✨ Pronto per iniziare a imparare?',
              ctaButton: 'Registrati Ora - Prova Gratuita',
              introText: \`Ciao! 👋

Pluto.si è il tuo assistente matematico personale, progettato per aiutarti a **migliorare la tua comprensione** e **ottenere risultati migliori**.

**Cosa offriamo:**

✓ **Spiegazioni passo-passo** – Risolviamo ogni problema sistematicamente così capisci il *perché*, non solo il *come*.

✓ **Supporto per tutti gli argomenti** – Dall'algebra di base agli integrali e al calcolo.

✓ **Tastiera interattiva** – Inserimento facile di simboli matematici e formule.

✓ **Visualizzazioni grafiche** – Visualizza funzioni per una migliore comprensione.

✓ **Supporto multilingue** – Sloveno, inglese e italiano.

**Vediamo un esempio:**\`,
              problem: 'Risolvi l\\'equazione: 3x + 5 = 20',
              solution: \`**Risoluzione di un'Equazione Lineare**

**Passo 1:** Sottraiamo 5 da entrambi i lati
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Passo 2:** Dividiamo per 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Soluzione:** x = 5

✅ Possiamo verificare: 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            de: {
              backLink: '← Zurück',
              headerTitle: 'Willkommen bei Pluto.si 🚀',
              headerSubtitle: 'Ihr persönlicher KI-Mathe-Tutor',
              ctaText: '✨ Bereit zum Lernen?',
              ctaButton: 'Jetzt registrieren - Kostenlose Testversion',
              introText: \`Hallo! 👋

Pluto.si ist Ihr persönlicher Mathematik-Assistent für Schüler und Studenten, die ihr **mathematisches Verständnis verbessern** und **bessere Ergebnisse erzielen** möchten.

**Was wir bieten:**

✓ **Schritt-für-Schritt-Erklärungen** – Wir lösen jedes Problem systematisch, damit Sie verstehen *warum*, nicht nur *wie*.

✓ **Unterstützung für alle Themen** – Von grundlegender Algebra bis zu Integralen und Analysis.

✓ **Interaktive Tastatur** – Einfache Eingabe mathematischer Symbole und Formeln.

✓ **Grafische Visualisierungen** – Funktionen für besseres Verständnis anzeigen.

✓ **Mehrsprachige Unterstützung** – Slowenisch, Englisch und Italienisch.

**Schauen wir uns ein Beispiel an:**\`,
              problem: 'Löse die Gleichung: 3x + 5 = 20',
              solution: \`**Lösen einer linearen Gleichung**

**Schritt 1:** Subtrahiere 5 von beiden Seiten
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Schritt 2:** Dividiere durch 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Lösung:** x = 5

✅ Überprüfung: 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            fr: {
              backLink: '← Retour',
              headerTitle: 'Bienvenue sur Pluto.si 🚀',
              headerSubtitle: 'Votre tuteur de mathématiques IA personnel',
              ctaText: '✨ Prêt à commencer à apprendre ?',
              ctaButton: 'S\\'inscrire maintenant - Essai gratuit',
              introText: \`Bonjour ! 👋

Pluto.si est votre assistant mathématique personnel, conçu pour les élèves et étudiants qui souhaitent **améliorer leur compréhension** et **obtenir de meilleurs résultats**.

**Ce que nous offrons :**

✓ **Explications étape par étape** – Nous résolvons chaque problème systématiquement pour que vous compreniez *pourquoi*, pas seulement *comment*.

✓ **Support pour tous les sujets** – De l'algèbre de base aux intégrales et au calcul.

✓ **Clavier interactif** – Saisie facile de symboles et formules mathématiques.

✓ **Visualisations graphiques** – Afficher les fonctions pour une meilleure compréhension.

✓ **Support multilingue** – Slovène, anglais et italien.

**Voyons un exemple :**\`,
              problem: 'Résoudre l\\'équation : 3x + 5 = 20',
              solution: \`**Résolution d'une équation linéaire**

**Étape 1 :** Soustraire 5 des deux côtés
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Étape 2 :** Diviser par 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Solution :** x = 5

✅ Vérification : 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            es: {
              backLink: '← Atrás',
              headerTitle: 'Bienvenido a Pluto.si 🚀',
              headerSubtitle: 'Tu tutor personal de matemáticas con IA',
              ctaText: '✨ ¿Listo para empezar a aprender?',
              ctaButton: 'Registrarse ahora - Prueba gratuita',
              introText: \`¡Hola! 👋

Pluto.si es tu asistente matemático personal, diseñado para estudiantes que desean **mejorar su comprensión** y **lograr mejores resultados**.

**Lo que ofrecemos:**

✓ **Explicaciones paso a paso** – Resolvemos cada problema sistemáticamente para que entiendas el *por qué*, no solo el *cómo*.

✓ **Soporte para todos los temas** – Desde álgebra básica hasta integrales y cálculo.

✓ **Teclado interactivo** – Entrada fácil de símbolos y fórmulas matemáticas.

✓ **Visualizaciones gráficas** – Mostrar funciones para una mejor comprensión.

✓ **Soporte multilingüe** – Esloveno, inglés e italiano.

**Veamos un ejemplo:**\`,
              problem: 'Resolver la ecuación: 3x + 5 = 20',
              solution: \`**Resolución de una ecuación lineal**

**Paso 1:** Restar 5 de ambos lados
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Paso 2:** Dividir por 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Solución:** x = 5

✅ Verificación: 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            pl: {
              backLink: '← Wstecz',
              headerTitle: 'Witamy w Pluto.si 🚀',
              headerSubtitle: 'Twój osobisty korepetytor matematyki AI',
              ctaText: '✨ Gotowy, aby zacząć się uczyć?',
              ctaButton: 'Zarejestruj się teraz - Bezpłatny okres próbny',
              introText: \`Cześć! 👋

Pluto.si to Twój osobisty asystent matematyczny, zaprojektowany dla uczniów i studentów, którzy chcą **poprawić swoje zrozumienie** i **osiągnąć lepsze wyniki**.

**Co oferujemy:**

✓ **Wyjaśnienia krok po kroku** – Rozwiązujemy każdy problem systematycznie, abyś rozumiał *dlaczego*, a nie tylko *jak*.

✓ **Wsparcie dla wszystkich tematów** – Od podstawowej algebry do całek i rachunku.

✓ **Interaktywna klawiatura** – Łatwe wprowadzanie symboli i formuł matematycznych.

✓ **Wizualizacje graficzne** – Wyświetlanie funkcji dla lepszego zrozumienia.

✓ **Wsparcie wielojęzyczne** – Słoweński, angielski i włoski.

**Zobaczmy przykład:**\`,
              problem: 'Rozwiąż równanie: 3x + 5 = 20',
              solution: \`**Rozwiązywanie równania liniowego**

**Krok 1:** Odejmij 5 z obu stron
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Krok 2:** Podziel przez 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Rozwiązanie:** x = 5

✅ Sprawdzenie: 3(5) + 5 = 15 + 5 = 20 ✓\`
            },
            ro: {
              backLink: '← Înapoi',
              headerTitle: 'Bun venit la Pluto.si 🚀',
              headerSubtitle: 'Tutorele tău personal de matematică cu AI',
              ctaText: '✨ Gata să începi să înveți?',
              ctaButton: 'Înregistrează-te acum - Perioadă de probă gratuită',
              introText: \`Salut! 👋

Pluto.si este asistentul tău personal de matematică, conceput pentru elevi și studenți care doresc să **îmbunătățească înțelegerea** și să **obțină rezultate mai bune**.

**Ce oferim:**

✓ **Explicații pas cu pas** – Rezolvăm fiecare problemă sistematic pentru ca tu să înțelegi *de ce*, nu doar *cum*.

✓ **Suport pentru toate subiectele** – De la algebră de bază la integrale și calcul.

✓ **Tastatură interactivă** – Introducere ușoară de simboluri și formule matematice.

✓ **Vizualizări grafice** – Afișează funcții pentru o mai bună înțelegere.

✓ **Suport multilingv** – Slovenă, engleză și italiană.

**Să vedem un exemplu:**\`,
              problem: 'Rezolvă ecuația: 3x + 5 = 20',
              solution: \`**Rezolvarea unei ecuații liniare**

**Pasul 1:** Scade 5 din ambele părți
\\\\[
3x + 5 - 5 = 20 - 5
\\\\]
\\\\[
3x = 15
\\\\]

**Pasul 2:** Împarte la 3
\\\\[
\\\\frac{3x}{3} = \\\\frac{15}{3}
\\\\]
\\\\[
x = 5
\\\\]

**Soluție:** x = 5

✅ Verificare: 3(5) + 5 = 15 + 5 = 20 ✓\`
            }
          };
          
          const t = translations[lang];
          
          // Apply translations to static elements
          document.getElementById('back-link').textContent = t.backLink;
          document.getElementById('demo-header-title').textContent = t.headerTitle;
          document.getElementById('demo-header-subtitle').textContent = t.headerSubtitle;
          document.getElementById('cta-text').textContent = t.ctaText;
          document.getElementById('cta-button').textContent = t.ctaButton;
          
          const introText = t.introText;
          const demoProblem = t.problem;
          const demoSolution = t.solution;

          let typedIntro = '';
          let typedSolution = '';
          let charIndex = 0;
          let solutionCharIndex = 0;
          
          // Type intro text
          const introInterval = setInterval(() => {
            if (charIndex < introText.length) {
              typedIntro += introText[charIndex];
              document.getElementById('intro-text').innerHTML = typedIntro + 
                '<span class="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse"></span>';
              charIndex++;
            } else {
              clearInterval(introInterval);
              document.getElementById('intro-text').innerHTML = typedIntro;
              
              // Show problem after delay
              setTimeout(() => {
                document.getElementById('problem-container').classList.remove('hidden');
                document.getElementById('problem-text').textContent = demoProblem;
                
                // Type solution after another delay
                setTimeout(() => {
                  document.getElementById('solution-container').classList.remove('hidden');
                  
                  const solutionInterval = setInterval(() => {
                    if (solutionCharIndex < demoSolution.length) {
                      typedSolution += demoSolution[solutionCharIndex];
                      document.getElementById('solution-text').innerHTML = typedSolution + 
                        '<span class="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse"></span>';
                      solutionCharIndex++;
                    } else {
                      clearInterval(solutionInterval);
                      document.getElementById('solution-text').innerHTML = typedSolution;
                      
                      // Render math after typing is done
                      setTimeout(() => {
                        if (window.renderMathInElement) {
                          renderMathInElement(document.getElementById('demo-chat'), {
                            delimiters: [
                              { left: "$$", right: "$$", display: true },
                              { left: "$", right: "$", display: false },
                              { left: "\\\\[", right: "\\\\]", display: true },
                              { left: "\\\\(", right: "\\\\)", display: false }
                            ],
                            throwOnError: false
                          });
                        }
                      }, 100);
                    }
                  }, 15); // Typing speed
                }, 1000);
              }, 500);
            }
          }, 20); // Typing speed
        ` }} />
      </div>
    </>
  );
});

