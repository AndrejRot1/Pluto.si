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
      </Head>
      
      {/* Fixed sidebar */}
      <YearSidebar />

      {/* Main chat area */}
      <main class="flex-1 flex flex-col h-screen">
        {/* Fixed header */}
        <header class="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <h1 class="text-xl font-semibold text-gray-800">Matematični asistent</h1>
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 flex items-center gap-2">
                <span class="hidden sm:inline">Language</span>
                <select class="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50">
                  <option value="sl">Slovenščina</option>
                  <option value="en">English</option>
                  <option value="it">Italiano</option>
                </select>
              </label>
              
              {user ? (
                <details class="relative">
                  <summary class="cursor-pointer list-none">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </summary>
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <a 
                      href="/auth/logout"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Odjava
                    </a>
                  </div>
                </details>
              ) : (
                <>
                  <a 
                    href="/auth/login"
                    class="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Prijava
                  </a>
                  <a 
                    href="/auth/register"
                    class="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Registracija
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
