import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import SettingsPanel from "../islands/SettingsPanel.tsx";

export default define.page(function Settings(props) {
  const user = props.state.user;
  const profile = props.state.profile;
  
  return (
    <>
      <Head>
        <title>Settings • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
        <script dangerouslySetInnerHTML={{__html: `
          const t = {
            sl: { title: '⚙️ Nastavitve računa', back: '← Nazaj na chat' },
            en: { title: '⚙️ Account Settings', back: '← Back to chat' },
            it: { title: '⚙️ Impostazioni Account', back: '← Torna alla chat' }
          };
          
          function updateHeader() {
            const lang = localStorage.getItem('pluto-lang') || 'sl';
            const h1 = document.getElementById('settings-title');
            const link = document.getElementById('back-link');
            if (h1) h1.textContent = t[lang].title;
            if (link) link.textContent = t[lang].back;
          }
          
          document.addEventListener('DOMContentLoaded', updateHeader);
          window.addEventListener('pluto-lang-change', updateHeader);
        `}} />
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <header class="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
          <div class="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
            <h1 id="settings-title" class="text-2xl font-bold text-gray-900">⚙️ Nastavitve računa</h1>
            <a 
              id="back-link"
              href="/app" 
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              ← Nazaj na chat
            </a>
          </div>
        </header>
        <SettingsPanel user={user} profile={profile} />
      </div>
    </>
  );
});
