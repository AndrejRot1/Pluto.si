import { useState, useEffect } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const translations = {
  sl: {
    accountSettings: "Nastavitve računa",
    backToChat: "← Nazaj na chat",
    accountInfo: "Podatki o računu",
    personalProfile: "Vaš osebni profil",
    email: "Email",
    registeredFrom: "Registriran od",
    status: "Status",
    premiumActive: "Premium Aktiven",
    freeTrial: "Brezplačni preskus",
    trialExpires: "Preskus poteče:",
    inactive: "Neaktiven",
    upgradeTitle: "Nadgradi na Premium",
    upgradeDesc: "Pridobi polni dostop do vseh funkcij Pluto.si!",
    unlimitedAccess: "Neomejen dostop do AI asistenta",
    stepByStep: "Korak-po-korak rešitve",
    graphViz: "Vizualizacije grafov",
    multiLang: "Večjezična podpora",
    upgradeNow: "Nadgradi zdaj",
    preparing: "Pripravljam plačilo...",
    manageSubscription: "Upravljanje naročnine",
    manageDesc: "Spremeni način plačila, preklopi naročnino ali preglej račune.",
    openPortal: "Odpri Stripe Portal",
    loading: "Nalaganje...",
    changePassword: "Spremeni geslo",
    changePasswordDesc: "Pošljemo vam povezavo za ponastavitev gesla na vaš email naslov.",
    sendResetLink: "Pošlji povezavo za ponastavitev",
    logout: "Odjava",
    logoutDesc: "Odjavite se iz svojega računa. Vedno se lahko prijavite ponovno.",
    logoutBtn: "Odjavi se",
    dangerZone: "Nevarno območje",
    dangerZoneDesc: "Trajno izbrišite svoj račun in vse povezane podatke. Ta akcija je nepovratna!",
    deleteAccount: "Izbriši račun",
    deleting: "Brisanje...",
    notLoggedIn: "Niste prijavljeni",
  },
  en: {
    accountSettings: "Account Settings",
    backToChat: "← Back to chat",
    accountInfo: "Account Information",
    personalProfile: "Your personal profile",
    email: "Email",
    registeredFrom: "Registered since",
    status: "Status",
    premiumActive: "Premium Active",
    freeTrial: "Free Trial",
    trialExpires: "Trial expires:",
    inactive: "Inactive",
    upgradeTitle: "Upgrade to Premium",
    upgradeDesc: "Get full access to all Pluto.si features!",
    unlimitedAccess: "Unlimited AI assistant access",
    stepByStep: "Step-by-step solutions",
    graphViz: "Graph visualizations",
    multiLang: "Multi-language support",
    upgradeNow: "Upgrade now",
    preparing: "Preparing payment...",
    manageSubscription: "Manage Subscription",
    manageDesc: "Change payment method, cancel subscription, or view invoices.",
    openPortal: "Open Stripe Portal",
    loading: "Loading...",
    changePassword: "Change Password",
    changePasswordDesc: "We'll send you a password reset link to your email address.",
    sendResetLink: "Send reset link",
    logout: "Logout",
    logoutDesc: "Log out from your account. You can always log in again.",
    logoutBtn: "Log out",
    dangerZone: "Danger Zone",
    dangerZoneDesc: "Permanently delete your account and all associated data. This action is irreversible!",
    deleteAccount: "Delete Account",
    deleting: "Deleting...",
    notLoggedIn: "Not logged in",
  },
  it: {
    accountSettings: "Impostazioni Account",
    backToChat: "← Torna alla chat",
    accountInfo: "Informazioni Account",
    personalProfile: "Il tuo profilo personale",
    email: "Email",
    registeredFrom: "Registrato dal",
    status: "Stato",
    premiumActive: "Premium Attivo",
    freeTrial: "Prova Gratuita",
    trialExpires: "Prova scade:",
    inactive: "Inattivo",
    upgradeTitle: "Passa a Premium",
    upgradeDesc: "Ottieni accesso completo a tutte le funzionalità di Pluto.si!",
    unlimitedAccess: "Accesso illimitato all'assistente AI",
    stepByStep: "Soluzioni passo dopo passo",
    graphViz: "Visualizzazioni grafiche",
    multiLang: "Supporto multilingue",
    upgradeNow: "Aggiorna ora",
    preparing: "Preparazione pagamento...",
    manageSubscription: "Gestisci Abbonamento",
    manageDesc: "Cambia metodo di pagamento, annulla l'abbonamento o visualizza le fatture.",
    openPortal: "Apri Stripe Portal",
    loading: "Caricamento...",
    changePassword: "Cambia Password",
    changePasswordDesc: "Ti invieremo un link per reimpostare la password al tuo indirizzo email.",
    sendResetLink: "Invia link di reset",
    logout: "Disconnetti",
    logoutDesc: "Disconnettiti dal tuo account. Puoi sempre accedere di nuovo.",
    logoutBtn: "Disconnetti",
    dangerZone: "Zona Pericolosa",
    dangerZoneDesc: "Elimina permanentemente il tuo account e tutti i dati associati. Questa azione è irreversibile!",
    deleteAccount: "Elimina Account",
    deleting: "Eliminazione...",
    notLoggedIn: "Non autenticato",
  }
};

export default function SettingsPanel(props: { 
  user: { email: string }, 
  profile?: { 
    subscription_status: string, 
    trial_ends_at: string,
    created_at?: string
  } 
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lang, setLang] = useState<'sl' | 'en' | 'it'>('sl');

  const { user, profile } = props;
  const isActive = profile?.subscription_status === "active";
  const isTrial = profile?.subscription_status === "trial";

  const t = translations[lang];

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it';
    if (savedLang) {
      setLang(savedLang);
    }

    // Listen for language changes
    const handleLangChange = () => {
      const newLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' || 'sl';
      setLang(newLang);
    };

    window.addEventListener('pluto-lang-change', handleLangChange);
    
    return () => {
      window.removeEventListener('pluto-lang-change', handleLangChange);
    };
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    setMessage("");

    try {
      // Get session from Supabase
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setMessage(`❌ ${t.notLoggedIn}`);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(`❌ ${data.error || "Payment error"}`);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      setMessage("❌ Connection error");
      setLoading(false);
    }
  }

  async function handleManageSubscription() {
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setMessage(`❌ ${t.notLoggedIn}`);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(`❌ ${data.error || "Error"}`);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      setMessage("❌ Connection error");
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmMsg = lang === 'sl' ? "Ali ste prepričani, da želite izbrisati račun? Ta akcija je nepovrljiva!" :
                       lang === 'en' ? "Are you sure you want to delete your account? This action is irreversible!" :
                       "Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile!";
    if (!confirm(confirmMsg)) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setMessage(`❌ ${t.notLoggedIn}`);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(`❌ ${data.error || "Delete error"}`);
        setLoading(false);
        return;
      }

      // Redirect to home/register
      const successMsg = lang === 'sl' ? "✅ Račun uspešno izbrisan" :
                         lang === 'en' ? "✅ Account successfully deleted" :
                         "✅ Account eliminato con successo";
      alert(successMsg);
      window.location.href = "/auth/register";
    } catch (error) {
      console.error("Delete account error:", error);
      setMessage("❌ Connection error");
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Account Info */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {user.email[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{t.accountInfo}</h2>
            <p class="text-sm text-gray-500">{t.personalProfile}</p>
          </div>
        </div>
        <div class="space-y-4 bg-gray-50 rounded-xl p-6">
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.email}</label>
            <p class="text-gray-900 font-medium text-lg mt-1">{user.email}</p>
          </div>
          {profile?.created_at && (
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.registeredFrom}</label>
              <p class="text-gray-700 text-sm mt-1">{formatDate(profile.created_at)}</p>
            </div>
          )}
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.status}</label>
            <div class="mt-2">
              {isActive && (
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  {t.premiumActive}
                </span>
              )}
              {isTrial && profile?.trial_ends_at && (
                <div>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {t.freeTrial}
                  </span>
                  <p class="text-sm text-gray-600 mt-2">
                    {t.trialExpires} <strong>{formatDate(profile.trial_ends_at)}</strong>
                  </p>
                </div>
              )}
              {!isActive && !isTrial && (
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  {t.inactive}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      {!isActive && (
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">✨</span>
            <h2 class="text-lg font-bold text-gray-900">{t.upgradeTitle}</h2>
          </div>
          <p class="text-sm text-gray-700 mb-4">
            {t.upgradeDesc}
          </p>
          <ul class="text-sm text-gray-700 mb-6 space-y-2">
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              {t.unlimitedAccess}
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              {t.stepByStep}
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              {t.graphViz}
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              {t.multiLang}
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.preparing : t.upgradeNow}
          </button>
        </div>
      )}

      {isActive && (
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">💳</span>
            <h2 class="text-lg font-bold text-gray-900">{t.manageSubscription}</h2>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            {t.manageDesc}
          </p>
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.loading : t.openPortal}
          </button>
        </div>
      )}

      {message && (
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {message}
        </div>
      )}

      {/* Change Password */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🔑</span>
          <h2 class="text-lg font-bold text-gray-900">{t.changePassword}</h2>
        </div>
        <p class="text-sm text-gray-600 mb-6">
          {t.changePasswordDesc}
        </p>
        <a 
          href="/auth/forgot-password" 
          class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30"
        >
          {t.sendResetLink}
        </a>
      </div>

      {/* Logout */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🚪</span>
          <h2 class="text-lg font-bold text-gray-900">{t.logout}</h2>
        </div>
        <p class="text-sm text-gray-600 mb-6">
          {t.logoutDesc}
        </p>
        <a 
          href="/auth/logout" 
          class="inline-block px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg shadow-gray-500/30"
        >
          {t.logoutBtn}
        </a>
      </div>

      {/* Delete Account */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-red-300 p-4 sm:p-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">⚠️</span>
          <h2 class="text-lg font-bold text-gray-900">{t.dangerZone}</h2>
        </div>
        <p class="text-sm text-gray-600 mb-6">
          {t.dangerZoneDesc}
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t.deleting : t.deleteAccount}
        </button>
      </div>
    </div>
  );
}

