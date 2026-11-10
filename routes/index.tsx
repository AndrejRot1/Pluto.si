import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function LandingPage() {
  return (
    <>
      <Head>
        <title>Pluto.si - AI STEM Tutor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI tutor for math, physics, chemistry and biology with progress tracking" />
      </Head>
      
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header with Login/Register */}
        <header class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🚀</span>
              <div>
                <div class="flex items-center gap-1.5">
                  <h1 class="text-xl font-bold text-gray-900">Pluto</h1>
                  <span class="text-xs text-gray-500 font-medium">by TeachMath AI</span>
                </div>
                <p id="header-planet-text" class="text-xs text-gray-500 -mt-1">
                  Next-generation AI STEM tutor
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
              Master STEM with AI
            </h2>
            <p id="hero-subtitle" class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Math, physics, chemistry and biology — with progress tracked per subject.
            </p>
            <a 
              href="/auth/register" 
              id="hero-cta"
              class="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Start Learning Free
            </a>
            <p id="trial-text" class="text-sm text-gray-500 mt-4">
              10 free AI helps • No credit card required
            </p>
          </div>
        </section>

        <section class="px-4 sm:px-6 lg:px-8 pb-8">
          <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            <div id="subject-math" class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center font-medium text-gray-800">∑ Mathematics</div>
            <div id="subject-physics" class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center font-medium text-gray-800">⚛ Physics</div>
            <div id="subject-chemistry" class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center font-medium text-gray-800">🧪 Chemistry</div>
            <div id="subject-biology" class="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center font-medium text-gray-800">🧬 Biology</div>
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
                <div class="text-4xl mb-4">📈</div>
                <h4 id="feature2-title" class="text-xl font-semibold mb-3 text-gray-900">
                  Progress Tracking
                </h4>
                <p id="feature2-desc" class="text-gray-600">
                  See accuracy, correct answers, time spent and topic performance as you learn.
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
            <h3 id="pricing-title" class="text-4xl font-bold text-center text-gray-900 mb-4">
              Simple pricing
            </h3>
            <p id="pricing-subtitle" class="text-center text-gray-600 mb-10">
              After your free AI helps — choose monthly or yearly
            </p>
            
            <div class="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              <div class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md">
                <h4 id="pricing-monthly-plan" class="mb-4 text-xl font-bold text-gray-900">Monthly</h4>
                <div class="mb-2 flex items-baseline justify-center gap-2">
                  <span id="pricing-monthly-amount" class="text-4xl font-bold text-gray-900">€9.99</span>
                  <span id="pricing-monthly-period" class="text-lg text-gray-600">/month</span>
                </div>
                <p id="pricing-monthly-hint" class="mb-6 text-sm text-gray-500">Flexible — cancel anytime</p>
                <a 
                  href="/auth/register" 
                  id="pricing-monthly-cta"
                  class="inline-block w-full rounded-xl bg-slate-800 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  Start Free Trial
                </a>
              </div>

              <div class="relative rounded-2xl border-2 border-blue-500 bg-white p-8 text-center shadow-xl">
                <span id="pricing-yearly-badge" class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Save 2 months
                </span>
                <h4 id="pricing-yearly-plan" class="mb-4 text-xl font-bold text-gray-900">Yearly</h4>
                <div class="mb-2 flex items-baseline justify-center gap-2">
                  <span id="pricing-yearly-amount" class="text-4xl font-bold text-gray-900">€89.99</span>
                  <span id="pricing-yearly-period" class="text-lg text-gray-600">/year</span>
                </div>
                <p id="pricing-yearly-hint" class="mb-6 text-sm text-gray-500">≈ €7.50/month</p>
                <a 
                  href="/auth/register" 
                  id="pricing-yearly-cta"
                  class="inline-block w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
            <p id="pricing-note" class="mt-8 text-center text-sm text-gray-500">
              No credit card required • Cancel anytime
            </p>
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
        <footer class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div class="max-w-7xl mx-auto">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
              {/* About */}
              <div>
                <h4 class="text-white font-semibold mb-3">About Pluto</h4>
                <p class="text-gray-400 text-sm">
                  AI-powered math tutoring platform. 
                  Personalized learning with progressive difficulty.
                </p>
              </div>
              
              {/* Products */}
              <div>
                <h4 class="text-white font-semibold mb-3">Products</h4>
                <ul class="space-y-2 text-sm">
                  <li><a href="/" class="text-gray-400 hover:text-white transition-colors">Pluto - Math Tutor</a></li>
                  <li class="text-gray-500">More coming soon...</li>
                </ul>
              </div>
              
              {/* Support */}
              <div>
                <h4 class="text-white font-semibold mb-3">Support</h4>
                <ul class="space-y-2 text-sm">
                  <li><a href="mailto:support@teachmathai.com" class="text-gray-400 hover:text-white transition-colors">Email Support</a></li>
                  <li><a href="/demo" class="text-gray-400 hover:text-white transition-colors">Try Demo</a></li>
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h4 class="text-white font-semibold mb-3">Legal</h4>
                <ul class="space-y-2 text-sm">
                  <li><a href="/terms" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            {/* Bottom */}
            <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p class="text-gray-400 text-sm">© 2025 TeachMath AI - Pluto. All rights reserved.</p>
              <div class="flex items-center gap-2">
                <a href="https://teachmathai.com" class="text-gray-400 hover:text-white transition-colors text-sm">
                  teachmathai.com
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Language Detection & Translation Script */}
        <script dangerouslySetInnerHTML={{ __html: `
          (async function() {
            const translations = {
              sl: {
                login: "Prijava",
                register: "Registriraj se",
                headerPlanetText: "Nova generacija AI učiteljev za STEM",
                heroTitle: "Obvladaj STEM z AI",
                heroSubtitle: "Matematika, fizika, kemija in biologija — napredek ločeno po predmetih.",
                heroCta: "Začni se učiti brezplačno",
                trialText: "10 brezplačnih AI pomoči • Kreditna kartica ni potrebna",
                subjectMath: "∑ Matematika",
                subjectPhysics: "⚛ Fizika",
                subjectChemistry: "🧪 Kemija",
                subjectBiology: "🧬 Biologija",
                featuresTitle: "Zakaj izbrati Pluto.si?",
                feature1Title: "Progresivna težavnost",
                feature1Desc: "Začni enostavno in postopoma povečuj težavnost. Naš AI se prilagaja tvojemu nivoju znanja s 5 stopnjami težavnosti.",
                feature2Title: "Spremljanje napredka",
                feature2Desc: "Natančnost, pravilni odgovori, čas učenja in uspešnost po temah.",
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
                pricingTitle: "Enostavne cene",
                pricingSubtitle: "Po porabljenih brezplačnih AI pomočeh — izberi mesečno ali letno",
                pricingMonthlyPlan: "Mesečno",
                pricingMonthlyAmount: "9,99 €",
                pricingMonthlyPeriod: "/mesec",
                pricingMonthlyHint: "Prilagodljivo — prekliči kadarkoli",
                pricingMonthlyCta: "Začni brezplačno",
                pricingYearlyPlan: "Letno",
                pricingYearlyAmount: "89,99 €",
                pricingYearlyPeriod: "/leto",
                pricingYearlyHint: "≈ 7,50 €/mesec",
                pricingYearlyBadge: "2 meseca gratis",
                pricingYearlyCta: "Začni brezplačno",
                pricingNote: "Kreditna kartica ni potrebna • Kadarkoli prekličeš",
                ctaTitle: "Pripravljen izstopati v matematiki?",
                ctaSubtitle: "Pridruži se tisočim študentov, ki izboljšujejo svoje matematične veščine z AI tutorstvom.",
                ctaButton: "Začni zdaj"
              },
              en: {
                login: "Login",
                register: "Register now",
                headerPlanetText: "Next-generation AI STEM tutor",
                heroTitle: "Master STEM with AI",
                heroSubtitle: "Math, physics, chemistry and biology — with progress tracked per subject.",
                heroCta: "Start Learning Free",
                trialText: "10 free AI helps • No credit card required",
                subjectMath: "∑ Mathematics",
                subjectPhysics: "⚛ Physics",
                subjectChemistry: "🧪 Chemistry",
                subjectBiology: "🧬 Biology",
                featuresTitle: "Why Choose Pluto.si?",
                feature1Title: "Progressive Difficulty",
                feature1Desc: "Start easy and gradually increase difficulty. Our AI adapts to your skill level with 5 difficulty tiers.",
                feature2Title: "Progress Tracking",
                feature2Desc: "See accuracy, correct answers, time spent and topic performance as you learn.",
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
                pricingTitle: "Simple pricing",
                pricingSubtitle: "After your free AI helps — choose monthly or yearly",
                pricingMonthlyPlan: "Monthly",
                pricingMonthlyAmount: "€9.99",
                pricingMonthlyPeriod: "/month",
                pricingMonthlyHint: "Flexible — cancel anytime",
                pricingMonthlyCta: "Start Free Trial",
                pricingYearlyPlan: "Yearly",
                pricingYearlyAmount: "€89.99",
                pricingYearlyPeriod: "/year",
                pricingYearlyHint: "≈ €7.50/month",
                pricingYearlyBadge: "Save 2 months",
                pricingYearlyCta: "Start Free Trial",
                pricingNote: "No credit card required • Cancel anytime",
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
                subjectMath: "∑ Matematica",
                subjectPhysics: "⚛ Fisica",
                subjectChemistry: "🧪 Chimica",
                subjectBiology: "🧬 Biologia",
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
                pricingTitle: "Prezzi semplici",
                pricingSubtitle: "Dopo gli aiuti AI gratuiti — mensile o annuale",
                pricingMonthlyPlan: "Mensile",
                pricingMonthlyAmount: "€9,99",
                pricingMonthlyPeriod: "/mese",
                pricingMonthlyHint: "Flessibile — annulla quando vuoi",
                pricingMonthlyCta: "Inizia gratis",
                pricingYearlyPlan: "Annuale",
                pricingYearlyAmount: "€89,99",
                pricingYearlyPeriod: "/anno",
                pricingYearlyHint: "≈ €7,50/mese",
                pricingYearlyBadge: "2 mesi gratis",
                pricingYearlyCta: "Inizia gratis",
                pricingNote: "Nessuna carta di credito richiesta • Annulla quando vuoi",
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
                subjectMath: "∑ Mathematik",
                subjectPhysics: "⚛ Physik",
                subjectChemistry: "🧪 Chemie",
                subjectBiology: "🧬 Biologie",
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
                pricingTitle: "Einfache Preise",
                pricingSubtitle: "Nach den kostenlosen KI-Hilfen — monatlich oder jährlich",
                pricingMonthlyPlan: "Monatlich",
                pricingMonthlyAmount: "€9,99",
                pricingMonthlyPeriod: "/Monat",
                pricingMonthlyHint: "Flexibel — jederzeit kündbar",
                pricingMonthlyCta: "Kostenlos starten",
                pricingYearlyPlan: "Jährlich",
                pricingYearlyAmount: "€89,99",
                pricingYearlyPeriod: "/Jahr",
                pricingYearlyHint: "≈ €7,50/Monat",
                pricingYearlyBadge: "2 Monate gratis",
                pricingYearlyCta: "Kostenlos starten",
                pricingNote: "Keine Kreditkarte erforderlich • Jederzeit kündbar",
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
                subjectMath: "∑ Mathématiques",
                subjectPhysics: "⚛ Physique",
                subjectChemistry: "🧪 Chimie",
                subjectBiology: "🧬 Biologie",
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
                pricingTitle: "Tarifs simples",
                pricingSubtitle: "Après vos aides IA gratuites — mensuel ou annuel",
                pricingMonthlyPlan: "Mensuel",
                pricingMonthlyAmount: "9,99 €",
                pricingMonthlyPeriod: "/mois",
                pricingMonthlyHint: "Flexible — annulez à tout moment",
                pricingMonthlyCta: "Commencer gratuitement",
                pricingYearlyPlan: "Annuel",
                pricingYearlyAmount: "89,99 €",
                pricingYearlyPeriod: "/an",
                pricingYearlyHint: "≈ 7,50 €/mois",
                pricingYearlyBadge: "2 mois offerts",
                pricingYearlyCta: "Commencer gratuitement",
                pricingNote: "Aucune carte de crédit requise • Annulez à tout moment",
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
                subjectMath: "∑ Matemáticas",
                subjectPhysics: "⚛ Física",
                subjectChemistry: "🧪 Química",
                subjectBiology: "🧬 Biología",
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
                pricingTitle: "Precios simples",
                pricingSubtitle: "Después de tus ayudas de IA gratis — mensual o anual",
                pricingMonthlyPlan: "Mensual",
                pricingMonthlyAmount: "9,99 €",
                pricingMonthlyPeriod: "/mes",
                pricingMonthlyHint: "Flexible — cancela cuando quieras",
                pricingMonthlyCta: "Empezar gratis",
                pricingYearlyPlan: "Anual",
                pricingYearlyAmount: "89,99 €",
                pricingYearlyPeriod: "/año",
                pricingYearlyHint: "≈ 7,50 €/mes",
                pricingYearlyBadge: "2 meses gratis",
                pricingYearlyCta: "Empezar gratis",
                pricingNote: "No se requiere tarjeta de crédito • Cancela cuando quieras",
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
                subjectMath: "∑ Matematyka",
                subjectPhysics: "⚛ Fizyka",
                subjectChemistry: "🧪 Chemia",
                subjectBiology: "🧬 Biologia",
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
                pricingTitle: "Proste ceny",
                pricingSubtitle: "Po darmowych pomocach AI — miesięcznie lub rocznie",
                pricingMonthlyPlan: "Miesięcznie",
                pricingMonthlyAmount: "9,99 €",
                pricingMonthlyPeriod: "/miesiąc",
                pricingMonthlyHint: "Elastycznie — anuluj w każdej chwili",
                pricingMonthlyCta: "Zacznij za darmo",
                pricingYearlyPlan: "Rocznie",
                pricingYearlyAmount: "89,99 €",
                pricingYearlyPeriod: "/rok",
                pricingYearlyHint: "≈ 7,50 €/miesiąc",
                pricingYearlyBadge: "2 miesiące gratis",
                pricingYearlyCta: "Zacznij za darmo",
                pricingNote: "Karta kredytowa nie jest wymagana • Anuluj w każdej chwili",
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
                subjectMath: "∑ Matematică",
                subjectPhysics: "⚛ Fizică",
                subjectChemistry: "🧪 Chimie",
                subjectBiology: "🧬 Biologie",
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
                pricingTitle: "Prețuri simple",
                pricingSubtitle: "După ajutoarele AI gratuite — lunar sau anual",
                pricingMonthlyPlan: "Lunar",
                pricingMonthlyAmount: "9,99 €",
                pricingMonthlyPeriod: "/lună",
                pricingMonthlyHint: "Flexibil — anulează oricând",
                pricingMonthlyCta: "Începe gratuit",
                pricingYearlyPlan: "Anual",
                pricingYearlyAmount: "89,99 €",
                pricingYearlyPeriod: "/an",
                pricingYearlyHint: "≈ 7,50 €/lună",
                pricingYearlyBadge: "2 luni gratis",
                pricingYearlyCta: "Începe gratuit",
                pricingNote: "Nu este necesar cardul de credit • Anulează oricând",
                ctaTitle: "Gata să excelezi la matematică?",
                ctaSubtitle: "Alătură-te miilor de studenți care își îmbunătățesc abilitățile matematice cu meditații alimentate de AI.",
                ctaButton: "Începe acum"
              }
            };

            // Prefer saved language, then IP geolocation, then browser fallback
            const savedLang = localStorage.getItem('pluto-lang');
            let detectedLang = (savedLang && translations[savedLang]) ? savedLang : 'en';

            if (savedLang && translations[savedLang]) {
              console.log('Using saved language:', detectedLang);
            } else try {
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
            document.getElementById('subject-math').textContent = t.subjectMath;
            document.getElementById('subject-physics').textContent = t.subjectPhysics;
            document.getElementById('subject-chemistry').textContent = t.subjectChemistry;
            document.getElementById('subject-biology').textContent = t.subjectBiology;
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
            document.getElementById('pricing-title').textContent = t.pricingTitle;
            document.getElementById('pricing-subtitle').textContent = t.pricingSubtitle;
            document.getElementById('pricing-monthly-plan').textContent = t.pricingMonthlyPlan;
            document.getElementById('pricing-monthly-amount').textContent = t.pricingMonthlyAmount;
            document.getElementById('pricing-monthly-period').textContent = t.pricingMonthlyPeriod;
            document.getElementById('pricing-monthly-hint').textContent = t.pricingMonthlyHint;
            document.getElementById('pricing-monthly-cta').textContent = t.pricingMonthlyCta;
            document.getElementById('pricing-yearly-plan').textContent = t.pricingYearlyPlan;
            document.getElementById('pricing-yearly-amount').textContent = t.pricingYearlyAmount;
            document.getElementById('pricing-yearly-period').textContent = t.pricingYearlyPeriod;
            document.getElementById('pricing-yearly-hint').textContent = t.pricingYearlyHint;
            document.getElementById('pricing-yearly-badge').textContent = t.pricingYearlyBadge;
            document.getElementById('pricing-yearly-cta').textContent = t.pricingYearlyCta;
            document.getElementById('pricing-note').textContent = t.pricingNote;
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

