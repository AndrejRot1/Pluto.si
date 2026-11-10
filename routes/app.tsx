import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import YearSidebar from "../islands/YearSidebar.tsx";
import ChatPanel from "../islands/ChatPanel.tsx";
import UpgradeButton from "../islands/UpgradeButton.tsx";
import { isAdminEmail } from "../utils/admin.ts";

export default define.page(function Home(props) {
  const user = props.state.user;
  const profile = props.state.profile;
  const isTrial = profile?.subscription_status === 'trial';
  const isAdmin = isAdminEmail(user?.email);
  
  // Get access token from cookies (server-side)
  const authCookie = props.req.headers.get('cookie');
  let accessToken = '';
  if (authCookie) {
    const cookies = Object.fromEntries(
      authCookie.split(';').map(c => {
        const [key, ...v] = c.trim().split('=');
        return [key, v.join('=')];
      })
    );
    accessToken = cookies['sb-access-token'] || '';
  }
  
  return (
    <div class="flex h-[100dvh] max-h-[100dvh] overflow-hidden bg-[radial-gradient(1200px_600px_at_10%_-10%,#d1fae5_0%,transparent_55%),radial-gradient(900px_500px_at_90%_0%,#e0f2fe_0%,transparent_50%),linear-gradient(180deg,#f8fafc_0%,#f3f6f4_100%)]">
      <Head>
        <title>Pluto.si • STEM tutor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>
      
      {/* Sidebar: drawer on phone/tablet, always-visible from lg (desktop) */}
      <div
        id="mobile-sidebar"
        class="fixed inset-0 z-50 hidden bg-black/40 lg:static lg:inset-auto lg:z-auto lg:block lg:bg-transparent"
      >
        <div class="absolute left-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col border-r border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur sm:w-[min(22rem,70vw)] lg:relative lg:h-full lg:w-72 lg:shadow-none">
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 lg:hidden">
            <h2 class="font-display text-base font-semibold text-slate-900">Teme</h2>
            <button
              id="close-sidebar"
              type="button"
              class="min-h-[44px] min-w-[44px] rounded-lg p-2 hover:bg-gray-100"
              aria-label="Zapri"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto">
            <YearSidebar />
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <main class="flex min-w-0 flex-1 flex-col h-full">
        {/* Fixed header */}
        <header class="flex-shrink-0 border-b border-slate-200/70 bg-white/70 px-2 py-2 backdrop-blur-md sm:px-4 sm:py-3">
          <div class="mx-auto flex max-w-5xl items-center justify-between gap-1.5 sm:gap-4">
            <div class="flex min-w-0 items-center gap-1.5 sm:gap-2">
              {/* Hamburger menu - mobile only */}
              <button 
                id="open-sidebar"
                class="min-h-[44px] min-w-[44px] rounded-xl p-2 hover:bg-slate-100 lg:hidden"
                aria-label="Odpri menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div class="min-w-0">
                <h1 class="font-display text-base font-semibold tracking-tight text-slate-900 sm:text-xl">Pluto</h1>
                <p class="hidden text-[11px] text-slate-500 sm:block">STEM tutor · korak za korakom</p>
              </div>
            </div>
            <div class="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <label class="flex items-center gap-1 text-sm text-gray-600 sm:gap-2">
                <span class="hidden sm:inline">Language</span>
                <select 
                  id="lang-select"
                  class="max-w-[4.75rem] rounded-md border border-gray-300 bg-white px-1.5 py-1.5 text-xs hover:bg-gray-50 sm:max-w-[7.5rem] sm:px-2 sm:text-sm lg:max-w-none"
                >
                  <option value="sl">Slovenščina</option>
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="pl">Polski</option>
                  <option value="ro">Română</option>
                </select>
              </label>
              <script dangerouslySetInnerHTML={{__html: `
                (function() {
                  const sel = document.getElementById('lang-select');
                  
                  const translations = {
                    sl: { label: 'Prijavljen kot', settings: 'Nastavitve', logout: 'Odjava' },
                    en: { label: 'Logged in as', settings: 'Settings', logout: 'Logout' },
                    it: { label: 'Connesso come', settings: 'Impostazioni', logout: 'Disconnetti' },
                    de: { label: 'Angemeldet als', settings: 'Einstellungen', logout: 'Abmelden' },
                    fr: { label: 'Connecté en tant que', settings: 'Paramètres', logout: 'Déconnexion' },
                    es: { label: 'Conectado como', settings: 'Configuración', logout: 'Cerrar sesión' },
                    pl: { label: 'Zalogowany jako', settings: 'Ustawienia', logout: 'Wyloguj' },
                    ro: { label: 'Conectat ca', settings: 'Setări', logout: 'Deconectare' }
                  };
                  
                  function updateUserMenu() {
                    const lang = localStorage.getItem('pluto-lang') || 'sl';
                    const label = document.getElementById('user-menu-label');
                    const settings = document.getElementById('user-menu-settings');
                    const logout = document.getElementById('user-menu-logout');
                    
                    if (label) label.textContent = translations[lang].label;
                    if (settings) settings.textContent = translations[lang].settings;
                    if (logout) logout.textContent = translations[lang].logout;
                  }
                  
                  // Auto-detect language on first visit
                  let defaultLang = localStorage.getItem('pluto-lang');
                  if (!defaultLang) {
                    // Use browser language preference
                    const browserLang = navigator.language || navigator.userLanguage;
                    if (browserLang.startsWith('sl')) {
                      defaultLang = 'sl';
                    } else if (browserLang.startsWith('it')) {
                      defaultLang = 'it';
                    } else if (browserLang.startsWith('de')) {
                      defaultLang = 'de';
                    } else if (browserLang.startsWith('fr')) {
                      defaultLang = 'fr';
                    } else if (browserLang.startsWith('es')) {
                      defaultLang = 'es';
                    } else if (browserLang.startsWith('pl')) {
                      defaultLang = 'pl';
                    } else if (browserLang.startsWith('ro')) {
                      defaultLang = 'ro';
                    } else if (browserLang.startsWith('en')) {
                      defaultLang = 'en';
                    } else {
                      defaultLang = 'en'; // Default to English
                    }
                    localStorage.setItem('pluto-lang', defaultLang);
                  }
                  
                  sel.value = defaultLang;
                  updateUserMenu();
                  
                  sel.addEventListener('change', (e) => {
                    localStorage.setItem('pluto-lang', e.target.value);
                    updateUserMenu();
                    // Trigger custom event for same-page updates
                    globalThis.dispatchEvent(new CustomEvent('pluto-lang-change'));
                  });
                })();
              `}} />
              
              {user ? (
                <>
                  {isTrial && (
                    <UpgradeButton
                      class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      text="Upgrade to Plus"
                      accessToken={accessToken}
                    />
                  )}
                  <details class="relative">
                    <summary class="cursor-pointer list-none">
                      <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </summary>
                    <div class="absolute right-0 mt-2 w-[min(16rem,calc(100vw-1.5rem))] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <div class="px-4 py-2 border-b border-gray-200">
                        <p id="user-menu-label" class="text-xs text-gray-500">Prijavljen kot</p>
                        <p class="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      {isTrial && (
                        <div class="px-2 py-1">
                          <UpgradeButton
                            class="w-full px-4 py-2 text-sm bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            text="⚡ Upgrade to Plus"
                            accessToken={accessToken}
                          />
                        </div>
                      )}
                      <a 
                        href="/progress"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        📊 Napredek
                      </a>
                      {isAdmin && (
                        <a
                          href="/admin"
                          class="block px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
                        >
                          🛡️ Admin
                        </a>
                      )}
                      <a 
                        href="/settings"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        ⚙️ <span id="user-menu-settings">Nastavitve</span>
                      </a>
                      <a 
                        href="/auth/logout"
                        class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        🚪 <span id="user-menu-logout">Odjava</span>
                      </a>
                    </div>
                  </details>
                </>
              ) : (
                <>
                  <a 
                    href="/auth/login"
                    class="text-xs sm:text-sm text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span class="hidden sm:inline">Prijava</span>
                    <span class="sm:hidden">🔑</span>
                  </a>
                  <a 
                    href="/auth/register"
                    class="text-xs sm:text-sm bg-blue-600 text-white px-2 sm:px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span class="hidden sm:inline">Registracija</span>
                    <span class="sm:hidden">✨</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </header>
        
        {/* Scrollable chat area */}
        <ChatPanel profile={profile} accessToken={accessToken} />
      </main>

      {/* Mobile/tablet sidebar toggle script */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          const sidebar = document.getElementById('mobile-sidebar');
          const openBtn = document.getElementById('open-sidebar');
          const closeBtn = document.getElementById('close-sidebar');
          const mq = window.matchMedia('(min-width: 1024px)');

          function syncSidebar() {
            if (!sidebar) return;
            if (mq.matches) {
              sidebar.classList.remove('hidden');
            } else {
              sidebar.classList.add('hidden');
            }
          }
          
          if (openBtn && sidebar) {
            openBtn.addEventListener('click', () => {
              sidebar.classList.remove('hidden');
            });
          }
          
          if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', () => {
              sidebar.classList.add('hidden');
            });
          }
          
          if (sidebar) {
            sidebar.addEventListener('click', (e) => {
              if (e.target === sidebar && !mq.matches) {
                sidebar.classList.add('hidden');
              }
            });
          }

          if (mq.addEventListener) mq.addEventListener('change', syncSidebar);
          else mq.addListener(syncSidebar);
          syncSidebar();
        })();
      `}} />
    </div>
  );
});

function EmptyWelcome() {
  return (
    <div class="text-center text-gray-500 pt-16">
      <p class="text-lg mb-2">Pozdravljeni v pomočniku za matematiko.</p>
      <p class="text-sm">Na dnu je tipkovnica za matematične simbole in funkcije.</p>
    </div>
  );
}
