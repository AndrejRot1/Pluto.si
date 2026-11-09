import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import ProgressPanel from "../islands/ProgressPanel.tsx";

export default define.page(function ProgressPage() {
  return (
    <>
      <Head>
        <title>Napredek • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-4 py-3">
          <div class="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/app" class="text-sm text-blue-600 hover:underline">
              ← Nazaj na chat
            </a>
            <h1 class="text-sm font-semibold text-gray-800">Napredek</h1>
            <a href="/settings" class="text-sm text-gray-600 hover:underline">
              Nastavitve
            </a>
          </div>
        </header>
        <ProgressPanel />
      </div>
    </>
  );
});
