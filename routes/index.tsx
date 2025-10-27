import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function LandingPage() {
  return (
    <>
      <Head>
        <title>Pluto.si - AI Math Tutor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI-powered math learning platform with progressive difficulty exercises" />
      </Head>
      
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header with Login/Register */}
        <header class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🚀</span>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Pluto.si</h1>
                <p id="header-planet-text" class="text-xs text-gray-500 -mt-1">
                  A planet orbiting teachmathai.com • More planets coming soon!
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <a 
                href="/auth/login" 
                id="login-btn"
                class="px-4 sm:px-5 py-2 sm:py-2.5 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors shadow-sm"
              >
                Login
              </a>
              <a 
                href="/auth/register" 
                id="register-btn"
                class="px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Register now
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto text-center">
            <h2 id="hero-title" class="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Master Mathematics with AI
            </h2>
            <p id="hero-subtitle" class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Personalized math tutoring powered by artificial intelligence. 
              Progressive difficulty, step-by-step solutions, and instant feedback.
            </p>
            <a 
              href="/auth/register" 
              id="hero-cta"
              class="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Start Learning Free
            </a>
            <p id="trial-text" class="text-sm text-gray-500 mt-4">
              3-day free trial • No credit card required
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div class="max-w-7xl mx-auto">
            <h3 id="features-title" class="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Pluto.si?
            </h3>
            
            <div class="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div class="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="text-4xl mb-4">🎯</div>
                <h4 id="feature1-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Progressive Difficulty
                </h4>
                <p id="feature1-desc" class="text-gray-600">
                  Start easy and gradually increase difficulty. Our AI adapts to your skill level with 5 difficulty tiers.
                </p>
              </div>

              {/* Feature 2 */}
              <div class="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="text-4xl mb-4">📊</div>
                <h4 id="feature2-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Visual Learning
                </h4>
                <p id="feature2-desc" class="text-gray-600">
                  Interactive graphs, step-by-step solutions with LaTeX rendering, and visual explanations.
                </p>
              </div>

              {/* Feature 3 */}
              <div class="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="text-4xl mb-4">🌍</div>
                <h4 id="feature3-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Multilingual Support
                </h4>
                <p id="feature3-desc" class="text-gray-600">
                  Learn in Slovenian, English, or Italian. Switch languages anytime to match your preference.
                </p>
              </div>

              {/* Feature 4 */}
              <div class="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="text-4xl mb-4">🧮</div>
                <h4 id="feature4-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Comprehensive Topics
                </h4>
                <p id="feature4-desc" class="text-gray-600">
                  From basic arithmetic to advanced calculus. Algebra, geometry, functions, derivatives, and more.
                </p>
              </div>

              {/* Feature 5 */}
              <div class="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="text-4xl mb-4">💡</div>
                <h4 id="feature5-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Instant Solutions
                </h4>
                <p id="feature5-desc" class="text-gray-600">
                  Get detailed explanations instantly. See every step of the solution process with clear reasoning.
                </p>
              </div>

              {/* Feature 6 */}
              <div class="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                <div class="text-4xl mb-4">📱</div>
                <h4 id="feature6-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Mobile Friendly
                </h4>
                <p id="feature6-desc" class="text-gray-600">
                  Learn anywhere, anytime. Fully responsive design optimized for phones, tablets, and desktops.
                </p>
              </div>

              {/* Feature 7 - Try Demo */}
              <div class="p-6 rounded-xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all cursor-pointer md:col-span-3">
                <a href="/demo" class="block">
                  <div class="flex items-center justify-center gap-4">
                    <div class="text-5xl">🎯</div>
                    <div>
                      <h4 id="demo-title" class="text-2xl font-bold mb-2 text-blue-900">
                        Try Interactive Demo
                      </h4>
                      <p id="demo-desc" class="text-gray-700">
                        See Pluto.si in action! Experience step-by-step problem solving with our interactive demonstration.
                      </p>
                    </div>
                    <div class="text-blue-600 text-3xl">→</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div class="max-w-7xl mx-auto">
            <h3 class="text-4xl font-bold text-center text-gray-900 mb-4">
              Simple Pricing: Just €9.99/month
            </h3>
            <p class="text-center text-gray-600 mb-8">
              After your 3-day free trial
            </p>
            
            <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 text-center">
              <h4 class="text-2xl font-bold text-gray-900 mb-4">Plus Plan</h4>
              <div class="flex items-baseline justify-center gap-2 mb-6">
                <span class="text-5xl font-bold text-gray-900">€9.99</span>
                <span class="text-xl text-gray-600">/month</span>
              </div>
              <a 
                href="/auth/register" 
                class="inline-block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Start Free Trial
              </a>
              <p class="text-sm text-gray-500 mt-4">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div class="max-w-4xl mx-auto text-center">
            <h3 id="cta-title" class="text-4xl font-bold text-white mb-6">
              Ready to Excel in Math?
            </h3>
            <p id="cta-subtitle" class="text-xl text-blue-100 mb-8">
              Join thousands of students improving their math skills with AI-powered tutoring.
            </p>
            <a 
              href="/auth/register" 
              id="cta-button"
              class="inline-block px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold rounded-xl transition-colors shadow-lg"
            >
              Get Started Now
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer class="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400 text-center">
          <p>© 2025 Pluto.si - AI Math Tutor</p>
        </footer>

        {/* Language Detection & Translation Script */}
        <script dangerouslySetInnerHTML={{ __html: `
          (async function() {
            const translations = {
              sl: {
                login: "Prijava",
                register: "Registriraj se",
                headerPlanetText: "Planet, ki kroži okoli teachmathai.com • Kmalu več planetov!",
                heroTitle: "Obvladaj matematiko z AI",
                heroSubtitle: "Personalizirano matematično tutorstvo s pomočjo umetne inteligence. Progresivna težavnost, koraki rešitev in takojšnja povratna informacija.",
                heroCta: "Začni se učiti brezplačno",
                trialText: "3-dnevno brezplačno preizkusno obdobje • Kreditna kartica ni potrebna",
                featuresTitle: "Zakaj izbrati Pluto.si?",
                feature1Title: "Progresivna težavnost",
                feature1Desc: "Začni enostavno in postopoma povečuj težavnost. Naš AI se prilagaja tvojemu nivoju znanja s 5 stopnjami težavnosti.",
                feature2Title: "Vizualno učenje",
                feature2Desc: "Interaktivni grafi, koraki rešitev z LaTeX renderingom in vizualne razlage.",
                feature3Title: "Večjezična podpora",
                feature3Desc: "Uči se v slovenščini, angleščini ali italijanščini. Spremeni jezik kadarkoli.",
                feature4Title: "Obsežne teme",
                feature4Desc: "Od osnovne aritmetike do naprednega računanja. Algebra, geometrija, funkcije, odvodi in več.",
                feature5Title: "Takojšnje rešitve",
                feature5Desc: "Pridobi podrobne razlage takoj. Vidi vsak korak rešitve z jasnim razmišljanjem.",
                feature6Title: "Mobilno prijazen",
                feature6Desc: "Uči se kjerkoli, kadarkoli. Popolnoma odziven dizajn optimiziran za telefone, tablice in namizne računalnike.",
                demoTitle: "Preizkusi interaktivni demo",
                demoDesc: "Poglej Pluto.si v akciji! Doživite reševanje problemov korak-po-korak z našo interaktivno demonstracijo.",
                ctaTitle: "Pripravljen izstopati v matematiki?",
                ctaSubtitle: "Pridruži se tisočim študentov, ki izboljšujejo svoje matematične veščine z AI tutorstvom.",
                ctaButton: "Začni zdaj"
              },
              en: {
                login: "Login",
                register: "Register now",
                headerPlanetText: "A planet orbiting teachmathai.com • More planets coming soon!",
                heroTitle: "Master Mathematics with AI",
                heroSubtitle: "Personalized math tutoring powered by artificial intelligence. Progressive difficulty, step-by-step solutions, and instant feedback.",
                heroCta: "Start Learning Free",
                trialText: "3-day free trial • No credit card required",
                featuresTitle: "Why Choose Pluto.si?",
                feature1Title: "Progressive Difficulty",
                feature1Desc: "Start easy and gradually increase difficulty. Our AI adapts to your skill level with 5 difficulty tiers.",
                feature2Title: "Visual Learning",
                feature2Desc: "Interactive graphs, step-by-step solutions with LaTeX rendering, and visual explanations.",
                feature3Title: "Multilingual Support",
                feature3Desc: "Learn in Slovenian, English, or Italian. Switch languages anytime to match your preference.",
                feature4Title: "Comprehensive Topics",
                feature4Desc: "From basic arithmetic to advanced calculus. Algebra, geometry, functions, derivatives, and more.",
                feature5Title: "Instant Solutions",
                feature5Desc: "Get detailed explanations instantly. See every step of the solution process with clear reasoning.",
                feature6Title: "Mobile Friendly",
                feature6Desc: "Learn anywhere, anytime. Fully responsive design optimized for phones, tablets, and desktops.",
                demoTitle: "Try Interactive Demo",
                demoDesc: "See Pluto.si in action! Experience step-by-step problem solving with our interactive demonstration.",
                ctaTitle: "Ready to Excel in Math?",
                ctaSubtitle: "Join thousands of students improving their math skills with AI-powered tutoring.",
                ctaButton: "Get Started Now"
              },
              it: {
                login: "Accedi",
                register: "Registrati ora",
                heroTitle: "Padroneggia la Matematica con l'AI",
                heroSubtitle: "Tutoraggio matematico personalizzato alimentato dall'intelligenza artificiale. Difficoltà progressiva, soluzioni passo-passo e feedback istantaneo.",
                heroCta: "Inizia a Imparare Gratis",
                trialText: "Prova gratuita di 3 giorni • Nessuna carta di credito richiesta",
                featuresTitle: "Perché scegliere Pluto.si?",
                feature1Title: "Difficoltà Progressiva",
                feature1Desc: "Inizia facilmente e aumenta gradualmente la difficoltà. La nostra AI si adatta al tuo livello con 5 livelli di difficoltà.",
                feature2Title: "Apprendimento Visivo",
                feature2Desc: "Grafici interattivi, soluzioni passo-passo con rendering LaTeX e spiegazioni visive.",
                feature3Title: "Supporto Multilingue",
                feature3Desc: "Impara in sloveno, inglese o italiano. Cambia lingua in qualsiasi momento.",
                feature4Title: "Argomenti Completi",
                feature4Desc: "Dall'aritmetica di base al calcolo avanzato. Algebra, geometria, funzioni, derivate e altro.",
                feature5Title: "Soluzioni Istantanee",
                feature5Desc: "Ottieni spiegazioni dettagliate istantaneamente. Vedi ogni passaggio del processo di soluzione con ragionamento chiaro.",
                feature6Title: "Mobile Friendly",
                feature6Desc: "Impara ovunque, in qualsiasi momento. Design completamente responsive ottimizzato per telefoni, tablet e desktop.",
                demoTitle: "Prova la Demo Interattiva",
                demoDesc: "Vedi Pluto.si in azione! Sperimenta la risoluzione dei problemi passo-passo con la nostra dimostrazione interattiva.",
                ctaTitle: "Pronto a Eccellere in Matematica?",
                ctaSubtitle: "Unisciti a migliaia di studenti che migliorano le loro abilità matematiche con il tutoraggio AI.",
                ctaButton: "Inizia Ora"
              },
              de: {
                login: "Anmelden",
                register: "Jetzt registrieren",
                heroTitle: "Mathematik mit KI meistern",
                heroSubtitle: "Personalisiertes Mathe-Tutoring mit künstlicher Intelligenz. Progressive Schwierigkeit, Schritt-für-Schritt-Lösungen und sofortiges Feedback.",
                heroCta: "Kostenlos lernen starten",
                trialText: "3 Tage kostenlose Testversion • Keine Kreditkarte erforderlich",
                featuresTitle: "Warum Pluto.si wählen?",
                feature1Title: "Progressive Schwierigkeit",
                feature1Desc: "Beginne einfach und steigere die Schwierigkeit allmählich. Unsere KI passt sich Ihrem Niveau mit 5 Schwierigkeitsstufen an.",
                feature2Title: "Visuelles Lernen",
                feature2Desc: "Interaktive Graphen, Schritt-für-Schritt-Lösungen mit LaTeX-Rendering und visuelle Erklärungen.",
                feature3Title: "Mehrsprachige Unterstützung",
                feature3Desc: "Lerne auf Slowenisch, Englisch oder Italienisch. Wechsle jederzeit die Sprache.",
                feature4Title: "Umfassende Themen",
                feature4Desc: "Von grundlegender Arithmetik bis zu fortgeschrittenem Calculus. Algebra, Geometrie, Funktionen, Ableitungen und mehr.",
                feature5Title: "Sofortige Lösungen",
                feature5Desc: "Erhalte sofort detaillierte Erklärungen. Sehe jeden Schritt des Lösungsprozesses mit klarer Begründung.",
                feature6Title: "Mobilfreundlich",
                feature6Desc: "Lerne überall und jederzeit. Vollständig responsives Design optimiert für Telefone, Tablets und Desktops.",
                demoTitle: "Interaktive Demo ausprobieren",
                demoDesc: "Sehen Sie Pluto.si in Aktion! Erlebe Schritt-für-Schritt-Problemlösung mit unserer interaktiven Demonstration.",
                ctaTitle: "Bereit, in Mathe zu glänzen?",
                ctaSubtitle: "Schließe dich Tausenden von Schülern an, die ihre Mathe-Fähigkeiten mit KI-gestütztem Tutoring verbessern.",
                ctaButton: "Jetzt loslegen"
              },
              fr: {
                login: "Connexion",
                register: "S'inscrire maintenant",
                heroTitle: "Maîtrisez les Mathématiques avec l'IA",
                heroSubtitle: "Tutorat mathématique personnalisé propulsé par l'intelligence artificielle. Difficulté progressive, solutions étape par étape et feedback instantané.",
                heroCta: "Commencer à apprendre gratuitement",
                trialText: "Essai gratuit de 3 jours • Aucune carte de crédit requise",
                featuresTitle: "Pourquoi choisir Pluto.si ?",
                feature1Title: "Difficulté Progressive",
                feature1Desc: "Commencez facilement et augmentez progressivement la difficulté. Notre IA s'adapte à votre niveau avec 5 niveaux de difficulté.",
                feature2Title: "Apprentissage Visuel",
                feature2Desc: "Graphiques interactifs, solutions étape par étape avec rendu LaTeX et explications visuelles.",
                feature3Title: "Support Multilingue",
                feature3Desc: "Apprenez en slovène, anglais ou italien. Changez de langue à tout moment.",
                feature4Title: "Sujets Complets",
                feature4Desc: "De l'arithmétique de base au calcul avancé. Algèbre, géométrie, fonctions, dérivées et plus encore.",
                feature5Title: "Solutions Instantanées",
                feature5Desc: "Obtenez des explications détaillées instantanément. Voyez chaque étape du processus de solution avec un raisonnement clair.",
                feature6Title: "Compatible Mobile",
                feature6Desc: "Apprenez n'importe où, n'importe quand. Design entièrement responsive optimisé pour téléphones, tablettes et ordinateurs.",
                demoTitle: "Essayer la Démo Interactive",
                demoDesc: "Voir Pluto.si en action ! Découvrez la résolution de problèmes étape par étape avec notre démonstration interactive.",
                ctaTitle: "Prêt à exceller en mathématiques ?",
                ctaSubtitle: "Rejoignez des milliers d'étudiants qui améliorent leurs compétences en mathématiques avec le tutorat alimenté par l'IA.",
                ctaButton: "Commencer maintenant"
              },
              es: {
                login: "Iniciar sesión",
                register: "Registrarse ahora",
                heroTitle: "Domina las Matemáticas con IA",
                heroSubtitle: "Tutoría matemática personalizada impulsada por inteligencia artificial. Dificultad progresiva, soluciones paso a paso y retroalimentación instantánea.",
                heroCta: "Comenzar a aprender gratis",
                trialText: "Prueba gratuita de 3 días • No se requiere tarjeta de crédito",
                featuresTitle: "¿Por qué elegir Pluto.si?",
                feature1Title: "Dificultad Progresiva",
                feature1Desc: "Comienza fácil y aumenta gradualmente la dificultad. Nuestra IA se adapta a tu nivel con 5 niveles de dificultad.",
                feature2Title: "Aprendizaje Visual",
                feature2Desc: "Gráficos interactivos, soluciones paso a paso con renderizado LaTeX y explicaciones visuales.",
                feature3Title: "Soporte Multilingüe",
                feature3Desc: "Aprende en esloveno, inglés o italiano. Cambia el idioma en cualquier momento.",
                feature4Title: "Temas Completos",
                feature4Desc: "Desde aritmética básica hasta cálculo avanzado. Álgebra, geometría, funciones, derivadas y más.",
                feature5Title: "Soluciones Instantáneas",
                feature5Desc: "Obtén explicaciones detalladas al instante. Ve cada paso del proceso de solución con razonamiento claro.",
                feature6Title: "Compatible con Móviles",
                feature6Desc: "Aprende en cualquier lugar, en cualquier momento. Diseño totalmente responsive optimizado para teléfonos, tabletas y computadoras.",
                demoTitle: "Probar Demo Interactiva",
                demoDesc: "¡Ve Pluto.si en acción! Experimenta la resolución de problemas paso a paso con nuestra demostración interactiva.",
                ctaTitle: "¿Listo para sobresalir en matemáticas?",
                ctaSubtitle: "Únete a miles de estudiantes que mejoran sus habilidades matemáticas con tutoría impulsada por IA.",
                ctaButton: "Comenzar ahora"
              },
              pl: {
                login: "Zaloguj się",
                register: "Zarejestruj się teraz",
                heroTitle: "Opanuj Matematykę z AI",
                heroSubtitle: "Spersonalizowane korepetycje z matematyki napędzane sztuczną inteligencją. Progresywna trudność, rozwiązania krok po kroku i natychmiastowa opinia.",
                heroCta: "Zacznij uczyć się za darmo",
                trialText: "3-dniowy bezpłatny okres próbny • Karta kredytowa nie jest wymagana",
                featuresTitle: "Dlaczego wybrać Pluto.si?",
                feature1Title: "Progresywna Trudność",
                feature1Desc: "Zacznij łatwo i stopniowo zwiększaj trudność. Nasza AI dostosowuje się do Twojego poziomu z 5 poziomami trudności.",
                feature2Title: "Nauka Wizualna",
                feature2Desc: "Interaktywne wykresy, rozwiązania krok po kroku z renderowaniem LaTeX i wyjaśnienia wizualne.",
                feature3Title: "Wsparcie Wielojęzyczne",
                feature3Desc: "Ucz się po słoweńsku, angielsku lub włosku. Zmień język w dowolnym momencie.",
                feature4Title: "Kompleksowe Tematy",
                feature4Desc: "Od podstawowej arytmetyki po zaawansowany rachunek. Algebra, geometria, funkcje, pochodne i więcej.",
                feature5Title: "Natychmiastowe Rozwiązania",
                feature5Desc: "Uzyskaj szczegółowe wyjaśnienia natychmiast. Zobacz każdy krok procesu rozwiązania z jasnym rozumowaniem.",
                feature6Title: "Przyjazny dla Urządzeń Mobilnych",
                feature6Desc: "Ucz się wszędzie i zawsze. W pełni responsywny design zoptymalizowany pod telefony, tablety i komputery.",
                demoTitle: "Wypróbuj Interaktywne Demo",
                demoDesc: "Zobacz Pluto.si w akcji! Doświadcz rozwiązywania problemów krok po kroku z naszą interaktywną demonstracją.",
                ctaTitle: "Gotowy, aby osiągnąć sukces w matematyce?",
                ctaSubtitle: "Dołącz do tysięcy studentów poprawiających swoje umiejętności matematyczne dzięki korepetycjom napędzanym przez AI.",
                ctaButton: "Zacznij teraz"
              },
              ro: {
                login: "Autentificare",
                register: "Înregistrează-te acum",
                heroTitle: "Stăpânește Matematica cu AI",
                heroSubtitle: "Meditații matematice personalizate alimentate de inteligența artificială. Dificultate progresivă, soluții pas cu pas și feedback instant.",
                heroCta: "Începe să înveți gratuit",
                trialText: "Perioadă de probă gratuită de 3 zile • Nu este necesară cardul de credit",
                featuresTitle: "De ce să alegi Pluto.si?",
                feature1Title: "Dificultate Progresivă",
                feature1Desc: "Începe ușor și crește gradual dificultatea. AI-ul nostru se adaptează la nivelul tău cu 5 niveluri de dificultate.",
                feature2Title: "Învățare Vizuală",
                feature2Desc: "Grafice interactive, soluții pas cu pas cu redare LaTeX și explicații vizuale.",
                feature3Title: "Suport Multilingv",
                feature3Desc: "Învață în slovenă, engleză sau italiană. Schimbă limba oricând.",
                feature4Title: "Subiecte Complete",
                feature4Desc: "De la aritmetică de bază la calcul avansat. Algebră, geometrie, funcții, derivate și multe altele.",
                feature5Title: "Soluții Instantanee",
                feature5Desc: "Obține explicații detaliate instantaneu. Vezi fiecare pas al procesului de soluționare cu raționament clar.",
                feature6Title: "Prietenos cu Dispozitivele Mobile",
                feature6Desc: "Învață oriunde, oricând. Design complet responsive optimizat pentru telefoane, tablete și desktop-uri.",
                demoTitle: "Încearcă Demo Interactiv",
                demoDesc: "Vezi Pluto.si în acțiune! Experimentează rezolvarea problemelor pas cu pas cu demonstrația noastră interactivă.",
                ctaTitle: "Gata să excelezi la matematică?",
                ctaSubtitle: "Alătură-te miilor de studenți care își îmbunătățesc abilitățile matematice cu meditații alimentate de AI.",
                ctaButton: "Începe acum"
              }
            };

            // Detect language (IP-based geolocation + browser fallback)
            let detectedLang = 'en'; // default
            
            // Try IP-based geolocation first (with fallback)
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 1500); // Shorter timeout
              const geoResponse = await fetch('https://ipapi.co/json/', { 
                signal: controller.signal,
                cache: 'no-cache'
              });
              clearTimeout(timeoutId);
              
              if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                const countryCode = geoData.country_code; // e.g., "SI", "IT", "US"
                
                // Map country codes to languages
                if (countryCode === 'SI') {
                  detectedLang = 'sl';
                } else if (countryCode === 'IT') {
                  detectedLang = 'it';
                } else if (countryCode === 'DE' || countryCode === 'AT' || countryCode === 'CH') {
                  detectedLang = 'de';
                } else if (countryCode === 'FR' || countryCode === 'BE' || countryCode === 'LU') {
                  detectedLang = 'fr';
                } else if (countryCode === 'ES') {
                  detectedLang = 'es';
                } else if (countryCode === 'PL') {
                  detectedLang = 'pl';
                } else if (countryCode === 'RO') {
                  detectedLang = 'ro';
                } else {
                  detectedLang = 'en';
                }
                console.log('Language detected by IP:', detectedLang, '(Country:', countryCode, ')');
              } else {
                throw new Error('Geolocation API failed');
              }
            } catch (error) {
              // Fallback to browser language (silently, no error shown to user)
              console.warn('IP geolocation unavailable, using browser language fallback');
              const browserLang = navigator.language || navigator.userLanguage;
              
              if (browserLang.startsWith('sl')) {
                detectedLang = 'sl';
              } else if (browserLang.startsWith('it')) {
                detectedLang = 'it';
              } else if (browserLang.startsWith('de')) {
                detectedLang = 'de';
              } else if (browserLang.startsWith('fr')) {
                detectedLang = 'fr';
              } else if (browserLang.startsWith('es')) {
                detectedLang = 'es';
              } else if (browserLang.startsWith('pl')) {
                detectedLang = 'pl';
              } else if (browserLang.startsWith('ro')) {
                detectedLang = 'ro';
              }
            }

            // Apply translations
            const t = translations[detectedLang];
            
            document.getElementById('login-btn').textContent = t.login;
            document.getElementById('register-btn').textContent = t.register;
            const planetTextEl = document.getElementById('header-planet-text');
            if (planetTextEl && t.headerPlanetText) planetTextEl.textContent = t.headerPlanetText;
            document.getElementById('hero-title').textContent = t.heroTitle;
            document.getElementById('hero-subtitle').textContent = t.heroSubtitle;
            document.getElementById('hero-cta').textContent = t.heroCta;
            document.getElementById('trial-text').textContent = t.trialText;
            document.getElementById('features-title').textContent = t.featuresTitle;
            document.getElementById('feature1-title').textContent = t.feature1Title;
            document.getElementById('feature1-desc').textContent = t.feature1Desc;
            document.getElementById('feature2-title').textContent = t.feature2Title;
            document.getElementById('feature2-desc').textContent = t.feature2Desc;
            document.getElementById('feature3-title').textContent = t.feature3Title;
            document.getElementById('feature3-desc').textContent = t.feature3Desc;
            document.getElementById('feature4-title').textContent = t.feature4Title;
            document.getElementById('feature4-desc').textContent = t.feature4Desc;
            document.getElementById('feature5-title').textContent = t.feature5Title;
            document.getElementById('feature5-desc').textContent = t.feature5Desc;
            document.getElementById('feature6-title').textContent = t.feature6Title;
            document.getElementById('feature6-desc').textContent = t.feature6Desc;
            document.getElementById('demo-title').textContent = t.demoTitle;
            document.getElementById('demo-desc').textContent = t.demoDesc;
            document.getElementById('cta-title').textContent = t.ctaTitle;
            document.getElementById('cta-subtitle').textContent = t.ctaSubtitle;
            document.getElementById('cta-button').textContent = t.ctaButton;

            // Store detected language for app
            localStorage.setItem('pluto-lang', detectedLang);
          })();
        ` }} />
      </div>
    </>
  );
});

