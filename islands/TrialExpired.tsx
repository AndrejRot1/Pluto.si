import { useState, useEffect } from "preact/hooks";

type Lang = 'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro';

const translations: Record<Lang, {
  title: string;
  subtitle: string;
  premiumTitle: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  price: string;
  perMonth: string;
  cancelAnytime: string;
  upgradeNow: string;
  logout: string;
  questions: string;
  support: string;
}> = {
  sl: {
    title: "Brezplačni preskus je potekel",
    subtitle: "Vaš 3-dnevni brezplačni preskus je potekel. Nadgradite na Premium za neomejen dostop!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Neomejen dostop do AI asistenta",
    feature2: "Korak-po-korak rešitve",
    feature3: "Interaktivni grafi in vizualizacije",
    feature4: "Večjezična podpora",
    price: "€9.99",
    perMonth: "/mesec",
    cancelAnytime: "Prekličite kadarkoli",
    upgradeNow: "Nadgradi zdaj",
    logout: "Odjavi se",
    questions: "Imate vprašanja? Pišite nam na",
    support: "support@pluto.si",
  },
  en: {
    title: "Free Trial Expired",
    subtitle: "Your 3-day free trial has expired. Upgrade to Premium for unlimited access!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Unlimited access to AI assistant",
    feature2: "Step-by-step solutions",
    feature3: "Interactive graphs and visualizations",
    feature4: "Multi-language support",
    price: "€9.99",
    perMonth: "/month",
    cancelAnytime: "Cancel anytime",
    upgradeNow: "Upgrade Now",
    logout: "Log Out",
    questions: "Have questions? Contact us at",
    support: "support@pluto.si",
  },
  it: {
    title: "Prova gratuita scaduta",
    subtitle: "La tua prova gratuita di 3 giorni è scaduta. Passa a Premium per accesso illimitato!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Accesso illimitato all'assistente AI",
    feature2: "Soluzioni passo-passo",
    feature3: "Grafici interattivi e visualizzazioni",
    feature4: "Supporto multilingua",
    price: "€9.99",
    perMonth: "/mese",
    cancelAnytime: "Annulla in qualsiasi momento",
    upgradeNow: "Aggiorna ora",
    logout: "Esci",
    questions: "Hai domande? Scrivici a",
    support: "support@pluto.si",
  },
  de: {
    title: "Kostenlose Testversion abgelaufen",
    subtitle: "Ihre 3-tägige kostenlose Testversion ist abgelaufen. Upgraden Sie auf Premium für unbegrenzten Zugang!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Unbegrenzter Zugang zum KI-Assistenten",
    feature2: "Schritt-für-Schritt-Lösungen",
    feature3: "Interaktive Graphen und Visualisierungen",
    feature4: "Mehrsprachiger Support",
    price: "€9.99",
    perMonth: "/Monat",
    cancelAnytime: "Jederzeit kündbar",
    upgradeNow: "Jetzt upgraden",
    logout: "Abmelden",
    questions: "Haben Sie Fragen? Kontaktieren Sie uns unter",
    support: "support@pluto.si",
  },
  fr: {
    title: "Essai gratuit expiré",
    subtitle: "Votre essai gratuit de 3 jours a expiré. Passez à Premium pour un accès illimité!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Accès illimité à l'assistant IA",
    feature2: "Solutions étape par étape",
    feature3: "Graphiques et visualisations interactifs",
    feature4: "Support multilingue",
    price: "€9.99",
    perMonth: "/mois",
    cancelAnytime: "Annulez à tout moment",
    upgradeNow: "Passer à Premium",
    logout: "Se déconnecter",
    questions: "Des questions? Contactez-nous à",
    support: "support@pluto.si",
  },
  es: {
    title: "Prueba gratuita expirada",
    subtitle: "Tu prueba gratuita de 3 días ha expirado. ¡Actualiza a Premium para acceso ilimitado!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Acceso ilimitado al asistente IA",
    feature2: "Soluciones paso a paso",
    feature3: "Gráficos y visualizaciones interactivas",
    feature4: "Soporte multiidioma",
    price: "€9.99",
    perMonth: "/mes",
    cancelAnytime: "Cancela en cualquier momento",
    upgradeNow: "Actualizar ahora",
    logout: "Cerrar sesión",
    questions: "¿Tienes preguntas? Contáctanos en",
    support: "support@pluto.si",
  },
  pl: {
    title: "Darmowy okres próbny wygasł",
    subtitle: "Twój 3-dniowy darmowy okres próbny wygasł. Przejdź na Premium, aby uzyskać nieograniczony dostęp!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Nieograniczony dostęp do asystenta AI",
    feature2: "Rozwiązania krok po kroku",
    feature3: "Interaktywne wykresy i wizualizacje",
    feature4: "Obsługa wielu języków",
    price: "€9.99",
    perMonth: "/miesiąc",
    cancelAnytime: "Anuluj w dowolnym momencie",
    upgradeNow: "Przejdź na Premium",
    logout: "Wyloguj się",
    questions: "Masz pytania? Skontaktuj się z nami:",
    support: "support@pluto.si",
  },
  ro: {
    title: "Perioada de încercare gratuită expirată",
    subtitle: "Perioada dvs. de încercare gratuită de 3 zile a expirat. Faceți upgrade la Premium pentru acces nelimitat!",
    premiumTitle: "Pluto.si Premium",
    feature1: "Acces nelimitat la asistentul AI",
    feature2: "Soluții pas cu pas",
    feature3: "Grafice și vizualizări interactive",
    feature4: "Suport multi-limbă",
    price: "€9.99",
    perMonth: "/lună",
    cancelAnytime: "Anulați oricând",
    upgradeNow: "Faceți upgrade acum",
    logout: "Deconectare",
    questions: "Aveți întrebări? Contactați-ne la",
    support: "support@pluto.si",
  },
};

export default function TrialExpired() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem('pluto-lang') as Lang | null;
    
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    } else {
      // Detect from browser
      const browserLang = navigator.language || (navigator as any).userLanguage;
      
      let detectedLang: Lang = 'en';
      if (browserLang.startsWith('sl')) detectedLang = 'sl';
      else if (browserLang.startsWith('it')) detectedLang = 'it';
      else if (browserLang.startsWith('de')) detectedLang = 'de';
      else if (browserLang.startsWith('fr')) detectedLang = 'fr';
      else if (browserLang.startsWith('es')) detectedLang = 'es';
      else if (browserLang.startsWith('pl')) detectedLang = 'pl';
      else if (browserLang.startsWith('ro')) detectedLang = 'ro';
      else if (browserLang.startsWith('en')) detectedLang = 'en';
      
      setLang(detectedLang);
    }
  }, []);

  const t = translations[lang];

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">⏰</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p class="text-gray-600">{t.subtitle}</p>
        </div>
        
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
            <p class="text-sm text-blue-900 font-bold mb-3 flex items-center gap-2">
              <span class="text-lg">✨</span>
              {t.premiumTitle}
            </p>
            <div class="space-y-1.5 text-xs text-blue-800">
              <p class="flex items-center gap-2">
                <span class="text-green-600 font-bold">✓</span>
                {t.feature1}
              </p>
              <p class="flex items-center gap-2">
                <span class="text-green-600 font-bold">✓</span>
                {t.feature2}
              </p>
              <p class="flex items-center gap-2">
                <span class="text-green-600 font-bold">✓</span>
                {t.feature3}
              </p>
              <p class="flex items-center gap-2">
                <span class="text-green-600 font-bold">✓</span>
                {t.feature4}
              </p>
            </div>
          </div>
          
          <div class="text-center mb-6">
            <p class="text-3xl font-bold text-gray-900 mb-2">
              {t.price}
              <span class="text-lg font-normal text-gray-600">{t.perMonth}</span>
            </p>
            <p class="text-sm text-gray-500">{t.cancelAnytime}</p>
          </div>
          
          <a 
            href="/settings"
            class="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 mb-4"
          >
            {t.upgradeNow}
          </a>
          
          <a 
            href="/auth/logout"
            class="block w-full text-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            {t.logout}
          </a>
        </div>
        
        <p class="text-center text-sm text-gray-600">
          {t.questions}{" "}
          <a href="mailto:support@pluto.si" class="text-blue-600 hover:underline font-medium">
            {t.support}
          </a>
        </p>
      </div>
    </div>
  );
}

