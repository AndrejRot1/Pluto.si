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
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Dobrodošli nazaj</h1>
          <p class="text-gray-600">Prijavite se v svoj račun</p>
        </div>
        
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8">
        
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
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700">Geslo</label>
              <a href="/auth/forgot-password" class="text-sm text-blue-600 hover:underline">
                Pozabljeno geslo?
              </a>
            </div>
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
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium min-h-[48px]"
          >
            {loading ? 'Prijavljanje...' : 'Prijava'}
          </button>
        </form>
        
        {message && (
          <div class={`mt-5 text-center text-sm p-3 rounded-xl ${
            message.includes('Uspešna') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
        
        <p class="mt-6 text-center text-sm text-gray-600">
          Nimate računa?{" "}
          <a href="/auth/register" class="text-blue-600 hover:text-blue-700 font-semibold">
            Registrirajte se →
          </a>
        </p>
        </div>
      </div>
    </div>
  );
}

