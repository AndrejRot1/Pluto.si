import { useEffect, useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage(data.error || 'Login failed');
        setLoading(false);
      } else {
        setMessage('✅ Uspešna prijava! Preusmerjanje...');
        
        // Cookies are set by server via Set-Cookie header
        // Redirect immediately
        setTimeout(() => {
          window.location.href = '/';
        }, 300);
      }
    } catch (error) {
      setMessage('Napaka pri prijavi');
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-center mb-6">Prijava</h1>
        
        <form onSubmit={handleLogin} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Prijavljanje...' : 'Prijava'}
          </button>
        </form>
        
        <p class="mt-4 text-center text-sm text-gray-600">
          Nimate računa?{" "}
          <a href="/auth/register" class="text-blue-600 hover:underline">
            Registrirajte se
          </a>
        </p>
        
        {message && (
          <div class={`mt-4 text-center text-sm ${message.includes('Uspešna') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

