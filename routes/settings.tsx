import { define } from "../utils.ts";
import SettingsPanel from "../islands/SettingsPanel.tsx";

export default define.page(function Settings(props) {
  const user = props.state.user;
  const profile = props.state.profile; // Assuming middleware adds this
  
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nastavitve - Pluto.si</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-gradient-to-br from-gray-50 to-blue-50">
        <div class="min-h-screen">
          {/* Header */}
          <header class="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
            <div class="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
              <h1 class="text-2xl font-bold text-gray-900">⚙️ Nastavitve računa</h1>
              <a 
                href="/" 
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                ← Nazaj na chat
              </a>
            </div>
          </header>

          {/* Content */}
          <SettingsPanel user={user} profile={profile} />
        </div>
      </body>
    </html>
  );
});
