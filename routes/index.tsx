import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import YearSidebar from "../islands/YearSidebar.tsx";
import ChatPanel from "../islands/ChatPanel.tsx";

export default define.page(function Home() {
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
            <label class="text-sm text-gray-600 flex items-center gap-2">
              <span>Language</span>
              <select class="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50">
                <option value="sl">Slovenščina</option>
                <option value="en">English</option>
                <option value="it">Italiano</option>
              </select>
            </label>
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
