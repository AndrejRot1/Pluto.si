import { useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Gesli se ne ujemata');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Geslo mora biti dolgo vsaj 6 znakov');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage(error.message);
        setSuccess(false);
      } else {
        setMessage('✅ Geslo je bilo uspešno spremenjeno!');
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    } catch (error) {
      setMessage('Prišlo je do napake. Poskusite ponovno.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Novo geslo</h1>
          <p class="text-gray-600">
            Vnesite novo geslo za svoj račun.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-8">
          {!success ? (
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Novo geslo</label>
                <input
                  type="password"
                  value={password}
                  onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                  required
                  minlength={6}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Potrdi geslo</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                  required
                  minlength={6}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-base"
              >
                {loading ? 'Shranjujem...' : 'Spremeni geslo'}
              </button>
            </form>
          ) : (
            <div class="text-center py-4">
              <div class="text-green-600 text-5xl mb-4">✓</div>
              <p class="text-gray-700 mb-4">{message}</p>
              <p class="text-sm text-gray-500">Preusmerjanje na prijavo...</p>
            </div>
          )}
          
          {message && !success && (
            <div class="mt-4 text-center text-sm p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

