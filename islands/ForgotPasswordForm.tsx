import { useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setMessage(error.message);
        setSuccess(false);
      } else {
        setMessage('✅ Email za ponastavitev gesla je bil poslan. Preverite svoj inbox.');
        setSuccess(true);
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
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Pozabljeno geslo?</h1>
          <p class="text-gray-600">
            Vnesite svoj email naslov in poslali vam bomo povezavo za ponastavitev gesla.
          </p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-8">
          {!success ? (
            <form onSubmit={handleSubmit} class="space-y-4">
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
              
              <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-base"
              >
                {loading ? 'Pošiljanje...' : 'Pošlji povezavo'}
              </button>
            </form>
          ) : (
            <div class="text-center py-4">
              <div class="text-green-600 text-5xl mb-4">✓</div>
              <p class="text-gray-700 mb-4">{message}</p>
              <a 
                href="/auth/login" 
                class="text-blue-600 hover:underline font-medium"
              >
                ← Nazaj na prijavo
              </a>
            </div>
          )}
          
          {!success && (
            <p class="mt-6 text-center text-sm text-gray-600">
              Se spomnite gesla?{" "}
              <a href="/auth/login" class="text-blue-600 hover:underline font-medium">
                Prijavite se
              </a>
            </p>
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

