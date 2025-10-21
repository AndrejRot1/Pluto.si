import { useEffect, useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo messages for preview
const demoMessages = [
  {
    role: 'user',
    content: 'Reši enačbo: 3x + 5 = 20'
  },
  {
    role: 'assistant',
    content: `**Reševanje linearne enačbe**

**Korak 1:** Odštejemo 5 z obeh strani
\\[
3x + 5 - 5 = 20 - 5
\\]
\\[
3x = 15
\\]

**Korak 2:** Delimo z 3
\\[
\\frac{3x}{3} = \\frac{15}{3}
\\]
\\[
x = 5
\\]

**Rešitev:** x = 5

**Preverjanje:** 3(5) + 5 = 15 + 5 = 20 ✓`
  }
];

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    console.log('RegisterForm mounted, registrationSuccess:', registrationSuccess);
    
    // Show demo message after 1 second
    setTimeout(() => {
      console.log('Showing demo');
      setShowDemo(true);
    }, 1000);
    
    // Render math after demo shows
    setTimeout(() => {
      const w = globalThis as unknown as { renderMathInElement?: (el: Element, opts: any) => void };
      console.log('KaTeX available:', !!w.renderMathInElement);
      if (w.renderMathInElement) {
        const demoEl = document.getElementById('demo-chat');
        console.log('Demo element found:', !!demoEl);
        if (demoEl) {
          w.renderMathInElement(demoEl, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\[", right: "\\]", display: true },
              { left: "\\(", right: "\\)", display: false },
            ],
          });
          console.log('KaTeX rendered on demo chat');
        }
      }
    }, 1500);
  }, []);

  async function handleRegister(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(data.error || 'Registracija ni uspela');
        setLoading(false);
      } else if (data.hasSession) {
        // User has session immediately (email confirmation disabled)
        setRegistrationSuccess(true);
        setMessage('✅ Uspešna registracija! Preusmerjanje...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        // Email confirmation required
        setRegistrationSuccess(true);
        setMessage('✅ Uspešna registracija! Preverite email za potrditev.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 3000);
      }
    } catch (error) {
      setMessage('Napaka pri registraciji');
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side - Registration form */}
      <div class={`flex items-center justify-center px-4 py-12 transition-all duration-500 ${
        registrationSuccess ? 'w-full' : 'w-full lg:w-1/2'
      }`}>
        <div class="max-w-md w-full">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Začni s Pluto.si</h1>
            <p class="text-gray-600">
              Tvoj osebni matematični asistent
            </p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-8">
            <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p class="text-sm text-blue-800 font-medium mb-2">
                ✨ 3-dnevni brezplačni preskus
              </p>
              <p class="text-xs text-blue-700">
                ✓ Brez kreditne kartice<br/>
                ✓ Korak po korak rešitve<br/>
                ✓ Podpora za vsa področja matematike
              </p>
            </div>
            
            <form onSubmit={handleRegister} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="vas@email.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Geslo</label>
                <input
                  type="password"
                  value={password}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                  required
                  minlength={6}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p class="text-xs text-gray-500 mt-1">Najmanj 6 znakov</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-base"
              >
                {loading ? 'Ustvarjanje računa...' : 'Začni brezplačni preskus'}
              </button>
            </form>
            
            <p class="mt-6 text-center text-sm text-gray-600">
              Že imate račun?{" "}
              <a href="/auth/login" class="text-blue-600 hover:underline font-medium">
                Prijavite se
              </a>
            </p>
            
            {message && (
              <div class={`mt-4 text-center text-sm p-3 rounded-md ${
                message.includes('Uspešna') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Demo chat */}
      {!registrationSuccess && (
        <div class="hidden lg:flex w-full lg:w-1/2 bg-white border-l border-gray-200 flex-col">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-800">Primer reševanja</h2>
          <p class="text-sm text-gray-500">Poglej, kako Pluto.si rešuje matematične probleme</p>
        </div>
        
        <div id="demo-chat" class="flex-1 overflow-y-auto p-6 space-y-4">
          {/* User message */}
          <div class="bg-white border border-gray-200 rounded-lg p-4 max-w-lg">
            <p class="text-gray-800">{demoMessages[0].content}</p>
          </div>
          
          {/* Assistant message - always show, animate with CSS */}
          <div class={`bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all duration-500 ${
            showDemo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <div class="prose prose-sm max-w-none whitespace-pre-wrap">
              {demoMessages[1].content}
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <p class="text-sm text-gray-600 text-center">
            💡 Registriraj se za neomejene rešitve in razlage
          </p>
        </div>
        </div>
      )}
    </div>
  );
}
