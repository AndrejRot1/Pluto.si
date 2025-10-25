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
  const [lang, setLang] = useState<'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('pluto-lang') as 'sl' | 'en' | 'it' | 'de' | 'fr' | 'es' | 'pl' | 'ro' || 'en';
    setLang(savedLang);
  }, []);

  const translations = {
    sl: { title: 'Dobrodošli nazaj', subtitle: 'Prijavite se v svoj račun', email: 'Email', password: 'Geslo', forgotPassword: 'Pozabljeno geslo?', loginButton: 'Prijava', loggingIn: 'Prijavljanje...', successMessage: '✅ Uspešna prijava! Preusmerjanje...', noAccount: 'Nimate računa?', register: 'Registrirajte se →' },
    en: { title: 'Welcome back', subtitle: 'Log in to your account', email: 'Email', password: 'Password', forgotPassword: 'Forgot password?', loginButton: 'Log in', loggingIn: 'Logging in...', successMessage: '✅ Login successful! Redirecting...', noAccount: 'No account?', register: 'Register →' },
    it: { title: 'Bentornato', subtitle: 'Accedi al tuo account', email: 'Email', password: 'Password', forgotPassword: 'Password dimenticata?', loginButton: 'Accedi', loggingIn: 'Accesso...', successMessage: '✅ Accesso riuscito! Reindirizzamento...', noAccount: 'Nessun account?', register: 'Registrati →' },
    de: { title: 'Willkommen zurück', subtitle: 'Melden Sie sich in Ihrem Konto an', email: 'E-Mail', password: 'Passwort', forgotPassword: 'Passwort vergessen?', loginButton: 'Anmelden', loggingIn: 'Anmelden...', successMessage: '✅ Anmeldung erfolgreich! Weiterleitung...', noAccount: 'Kein Konto?', register: 'Registrieren →' },
    fr: { title: 'Bon retour', subtitle: 'Connectez-vous à votre compte', email: 'Email', password: 'Mot de passe', forgotPassword: 'Mot de passe oublié ?', loginButton: 'Se connecter', loggingIn: 'Connexion...', successMessage: '✅ Connexion réussie ! Redirection...', noAccount: 'Pas de compte ?', register: 'S\'inscrire →' },
    es: { title: 'Bienvenido de nuevo', subtitle: 'Inicia sesión en tu cuenta', email: 'Correo', password: 'Contraseña', forgotPassword: '¿Olvidaste tu contraseña?', loginButton: 'Iniciar sesión', loggingIn: 'Iniciando sesión...', successMessage: '✅ ¡Inicio de sesión exitoso! Redirigiendo...', noAccount: '¿No tienes cuenta?', register: 'Registrarse →' },
    pl: { title: 'Witamy ponownie', subtitle: 'Zaloguj się do swojego konta', email: 'Email', password: 'Hasło', forgotPassword: 'Zapomniałeś hasła?', loginButton: 'Zaloguj się', loggingIn: 'Logowanie...', successMessage: '✅ Logowanie udane! Przekierowanie...', noAccount: 'Nie masz konta?', register: 'Zarejestruj się →' },
    ro: { title: 'Bine ai revenit', subtitle: 'Conectează-te la contul tău', email: 'Email', password: 'Parolă', forgotPassword: 'Ai uitat parola?', loginButton: 'Conectare', loggingIn: 'Conectare...', successMessage: '✅ Conectare reușită! Redirecționare...', noAccount: 'Nu ai cont?', register: 'Înregistrează-te →' }
  };

  const t = translations[lang];

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
        setMessage(t.successMessage);
        
        // Cookies are set by server via Set-Cookie header
        // Redirect to main app
        setTimeout(() => {
          window.location.href = '/app';
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
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p class="text-gray-600">{t.subtitle}</p>
        </div>
        
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-8">
        
        <form onSubmit={handleLogin} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700">{t.password}</label>
              <a href="/auth/forgot-password" class="text-sm text-blue-600 hover:underline">
                {t.forgotPassword}
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
            {loading ? t.loggingIn : t.loginButton}
          </button>
        </form>
        
        {message && (
          <div class={`mt-5 text-center text-sm p-3 rounded-xl ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 mb-3">{t.noAccount}</p>
          <a 
            href="/auth/register" 
            class="inline-block w-full py-2.5 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm"
          >
            {t.register}
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

