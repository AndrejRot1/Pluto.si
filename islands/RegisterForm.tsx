import { useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      });

      if (error) throw error;

      if (data?.user) {
        setMessage('Registration successful! Please check your email to confirm your account.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span class="text-3xl">🚀</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p class="text-gray-600">
            Start your math learning journey
          </p>
        </div>
          
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p class="text-sm text-blue-800 font-medium mb-2">
              ✨ 3-day free trial
            </p>
            <p class="text-xs text-blue-700">
              ✓ No credit card required<br/>
              ✓ Step-by-step solutions<br/>
              ✓ Support for all math topics
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
                placeholder="you@email.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                required
                minlength={6}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-base"
            >
              {loading ? 'Creating account...' : 'Start Free Trial'}
            </button>
          </form>
          
          <p class="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" class="text-blue-600 hover:underline font-medium">
              Log in
            </a>
          </p>
          
          {message && (
            <div class={`mt-4 text-center text-sm p-3 rounded-md ${
              message.includes('successful') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
