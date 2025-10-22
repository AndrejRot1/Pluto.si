import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import YearSidebar from "../islands/YearSidebar.tsx";
import ChatPanel from "../islands/ChatPanel.tsx";

export default define.page(function Home(props) {
  const user = props.state.user;
  return (
    <div class="h-screen bg-gray-50 flex">
      <Head>
        <title>Pluto.si • Pogovorni asistent za matematiko</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      
      {/* Fixed sidebar - hidden on mobile */}
      <div class="hidden lg:block">
        <YearSidebar />
      </div>

      {/* Main chat area */}
      <main class="flex-1 flex flex-col h-screen">
        {/* Fixed header */}
        <header class="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3 flex-shrink-0">
          <div class="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <h1 class="text-base sm:text-xl font-semibold text-gray-800">Matematični asistent</h1>
            <div class="flex items-center gap-2 sm:gap-3">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <span class="hidden sm:inline">Language</span>
                <select 
                  id="lang-select"
                  class="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50"
                >
                  <option value="sl">Slovenščina</option>
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                </select>
              </label>
              <script dangerouslySetInnerHTML={{__html: `
                (function() {
                  const sel = document.getElementById('lang-select');
                  
                  const translations = {
                    sl: { label: 'Prijavljen kot', settings: 'Nastavitve', logout: 'Odjava' },
                    en: { label: 'Logged in as', settings: 'Settings', logout: 'Logout' },
                    it: { label: 'Connesso come', settings: 'Impostazioni', logout: 'Disconnetti' }
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
                    } else if (browserLang.startsWith('en')) {
                      defaultLang = 'en';
                    } else {
                      defaultLang = 'sl'; // Default to Slovenian
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
                <details class="relative">
                  <summary class="cursor-pointer list-none">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </summary>
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <div class="px-4 py-2 border-b border-gray-200">
                      <p id="user-menu-label" class="text-xs text-gray-500">Prijavljen kot</p>
                      <p class="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
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
        <ChatPanel />
      </main>
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
