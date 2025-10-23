import { define } from "../../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function ConfirmEmail() {
  return (
    <>
      <Head>
        <title>Potrditev emaila • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
        <script dangerouslySetInnerHTML={{__html: `
          // Parse hash params from Supabase redirect
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          if (type === 'signup' && accessToken && refreshToken) {
            // Store tokens in cookies
            document.cookie = \`sb-access-token=\${accessToken}; Path=/; Max-Age=3600; SameSite=Lax\`;
            document.cookie = \`sb-refresh-token=\${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax\`;
            
            // Show success and redirect to main app
            setTimeout(() => {
              window.location.href = '/app';
            }, 2000);
          } else {
            // Show error
            document.getElementById('status').innerHTML = \`
              <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div class="text-5xl mb-4">❌</div>
                <h2 class="text-xl font-bold text-red-900 mb-2">Napaka pri potrditvi</h2>
                <p class="text-red-700 mb-4">Povezava ni veljavna ali je potekla.</p>
                <a href="/auth/register" class="inline-block px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold">
                  Poskusi ponovno
                </a>
              </div>
            \`;
          }
        `}} />
      </Head>
      
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div class="max-w-md w-full">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Pluto.si</h1>
            <p class="text-gray-600">Matematični asistent</p>
          </div>
          
          <div id="status" class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Potrjujem email...</h2>
            <p class="text-gray-600">Prosimo počakajte</p>
          </div>
        </div>
      </div>
    </>
  );
});

