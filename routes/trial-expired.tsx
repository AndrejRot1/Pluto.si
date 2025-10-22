import { define } from "../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function TrialExpiredPage() {
  return (
    <>
      <Head>
        <title>Trial potekel - Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div class="max-w-md w-full">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">⏰</div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Brezplačni preskus je potekel</h1>
            <p class="text-gray-600">
              Vaš 3-dnevni brezplačni preskus je potekel. Nadgradite na Premium za neomejen dostop!
            </p>
          </div>
          
          <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
              <p class="text-sm text-blue-900 font-bold mb-3 flex items-center gap-2">
                <span class="text-lg">✨</span>
                Pluto.si Premium
              </p>
              <div class="space-y-1.5 text-xs text-blue-800">
                <p class="flex items-center gap-2">
                  <span class="text-green-600 font-bold">✓</span>
                  Neomejen dostop do AI asistenta
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-green-600 font-bold">✓</span>
                  Korak-po-korak rešitve
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-green-600 font-bold">✓</span>
                  Interaktivni grafi in vizualizacije
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-green-600 font-bold">✓</span>
                  Večjezična podpora
                </p>
              </div>
            </div>
            
            <div class="text-center mb-6">
              <p class="text-3xl font-bold text-gray-900 mb-2">€9.99<span class="text-lg font-normal text-gray-600">/mesec</span></p>
              <p class="text-sm text-gray-500">Prekličite kadarkoli</p>
            </div>
            
            <a 
              href="/settings"
              class="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 mb-4"
            >
              Nadgradi zdaj
            </a>
            
            <a 
              href="/auth/logout"
              class="block w-full text-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Odjavi se
            </a>
          </div>
          
          <p class="text-center text-sm text-gray-600">
            Imate vprašanja? Pišite nam na{" "}
            <a href="mailto:support@pluto.si" class="text-blue-600 hover:underline font-medium">
              support@pluto.si
            </a>
          </p>
        </div>
      </div>
    </>
  );
});
