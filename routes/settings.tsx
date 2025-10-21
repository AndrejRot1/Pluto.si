import { define } from "../utils.ts";

export default define.page(function Settings(props) {
  const user = props.state.user;
  
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nastavitve - Pluto.si</title>
      </head>
      <body>
        <div class="min-h-screen bg-gray-50">
          {/* Header */}
          <header class="bg-white border-b border-gray-200">
            <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 class="text-xl font-semibold">Nastavitve računa</h1>
              <a href="/" class="text-blue-600 hover:underline">← Nazaj na chat</a>
            </div>
          </header>

          {/* Content */}
          <div class="max-w-3xl mx-auto px-4 py-8">
            {/* Account Info */}
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h2 class="text-lg font-semibold mb-4">Podatki o računu</h2>
              <div class="space-y-3">
                <div>
                  <label class="text-sm text-gray-600">Email</label>
                  <p class="text-gray-900 font-medium">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Status</label>
                  <p class="text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Aktiven
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h2 class="text-lg font-semibold mb-4">Spremeni geslo</h2>
              <a 
                href="/auth/forgot-password" 
                class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pošlji povezavo za ponastavitev
              </a>
            </div>

            {/* Logout */}
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold mb-4">Odjava</h2>
              <a 
                href="/auth/logout" 
                class="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Odjavi se
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
});

