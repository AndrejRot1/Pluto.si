import { useState } from "preact/hooks";

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

  const { user, profile } = props;
  const isActive = profile?.subscription_status === "active";
  const isTrial = profile?.subscription_status === "trial";

  async function handleUpgrade() {
    setLoading(true);
    setMessage("");

    try {
      // Get access token from cookies
      const cookies = document.cookie.split("; ");
      const accessToken = cookies.find((c) => c.startsWith("sb-access-token="))?.split("=")[1];

      if (!accessToken) {
        setMessage("❌ Niste prijavljeni");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(`❌ ${data.error || "Napaka pri ustvarjanju plačila"}`);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      setMessage("❌ Napaka pri povezavi");
      setLoading(false);
    }
  }

  async function handleManageSubscription() {
    setLoading(true);
    setMessage("");

    try {
      const cookies = document.cookie.split("; ");
      const accessToken = cookies.find((c) => c.startsWith("sb-access-token="))?.split("=")[1];

      if (!accessToken) {
        setMessage("❌ Niste prijavljeni");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(`❌ ${data.error || "Napaka"}`);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      setMessage("❌ Napaka pri povezavi");
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Ali ste prepričani, da želite izbrisati račun? Ta akcija je nepovrljiva!")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const cookies = document.cookie.split("; ");
      const accessToken = cookies.find((c) => c.startsWith("sb-access-token="))?.split("=")[1];

      if (!accessToken) {
        setMessage("❌ Niste prijavljeni");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(`❌ ${data.error || "Napaka pri brisanju računa"}`);
        setLoading(false);
        return;
      }

      // Redirect to home/register
      alert("✅ Račun uspešno izbrisan");
      window.location.href = "/auth/register";
    } catch (error) {
      console.error("Delete account error:", error);
      setMessage("❌ Napaka pri povezavi");
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div class="max-w-3xl mx-auto px-6 py-12">
      {/* Account Info */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {user.email[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Podatki o računu</h2>
            <p class="text-sm text-gray-500">Vaš osebni profil</p>
          </div>
        </div>
        <div class="space-y-4 bg-gray-50 rounded-xl p-6">
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
            <p class="text-gray-900 font-medium text-lg mt-1">{user.email}</p>
          </div>
          {profile?.created_at && (
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registriran od</label>
              <p class="text-gray-700 text-sm mt-1">{formatDate(profile.created_at)}</p>
            </div>
          )}
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <div class="mt-2">
              {isActive && (
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  Premium Aktiven
                </span>
              )}
              {isTrial && profile?.trial_ends_at && (
                <div>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Brezplačni preskus
                  </span>
                  <p class="text-sm text-gray-600 mt-2">
                    Preskus poteče: <strong>{formatDate(profile.trial_ends_at)}</strong>
                  </p>
                </div>
              )}
              {!isActive && !isTrial && (
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Neaktiven
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Management */}
      {!isActive && (
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-xl p-8 mb-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">✨</span>
            <h2 class="text-lg font-bold text-gray-900">Nadgradi na Premium</h2>
          </div>
          <p class="text-sm text-gray-700 mb-4">
            Pridobi polni dostop do vseh funkcij Pluto.si!
          </p>
          <ul class="text-sm text-gray-700 mb-6 space-y-2">
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              Neomejen dostop do AI asistenta
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              Korak-po-korak rešitve
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600 font-bold">✓</span>
              Interaktivni grafi in vizualizacije
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Nalaganje..." : "Nadgradi zdaj - €9.99/mesec"}
          </button>
        </div>
      )}

      {isActive && (
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">💳</span>
            <h2 class="text-lg font-bold text-gray-900">Upravljaj naročnino</h2>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            Spremeni način plačila, preklici naročnino ali preglej račune.
          </p>
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Nalaganje..." : "Odpri Stripe Portal"}
          </button>
        </div>
      )}

      {message && (
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {message}
        </div>
      )}

      {/* Change Password */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🔑</span>
          <h2 class="text-lg font-bold text-gray-900">Spremeni geslo</h2>
        </div>
        <p class="text-sm text-gray-600 mb-6">
          Pošljemo vam povezavo za ponastavitev gesla na vaš email naslov.
        </p>
        <a 
          href="/auth/forgot-password" 
          class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30"
        >
          Pošlji povezavo za ponastavitev
        </a>
      </div>

      {/* Logout */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">🚪</span>
          <h2 class="text-lg font-bold text-gray-900">Odjava</h2>
        </div>
        <p class="text-sm text-gray-600 mb-6">
          Odjavite se iz svojega računa. Vedno se lahko prijavite ponovno.
        </p>
        <a 
          href="/auth/logout" 
          class="inline-block px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg shadow-gray-500/30"
        >
          Odjavi se
        </a>
      </div>

      {/* Delete Account */}
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-red-300 p-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">⚠️</span>
          <h2 class="text-lg font-bold text-gray-900">Nevarno območje</h2>
        </div>
        <p class="text-sm text-gray-600 mb-6">
          Trajno izbrišite svoj račun in vse povezane podatke. <strong>Ta akcija je nepovratna!</strong>
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Brisanje..." : "Izbriši račun"}
        </button>
      </div>
    </div>
  );
}

