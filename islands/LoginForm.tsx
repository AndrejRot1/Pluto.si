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
    sl: { title: 'Dobrodošli nazaj', subtitle: 'Prijavite se v svoj račun', email: 'Email', password: 'Geslo', forgotPassword: 'Pozabljeno geslo?', loginButton: 'Prijava', loggingIn: 'Prijavljanje...', successMessage: '✅ Uspešna prijava! Preusmerjanje...', noAccount: 'Nimate računa?', register: 'Registrirajte se →', orContinueWith: 'ali nadaljuj z', continueWithGoogle: 'Nadaljuj z Google' },
    en: { title: 'Welcome back', subtitle: 'Log in to your account', email: 'Email', password: 'Password', forgotPassword: 'Forgot password?', loginButton: 'Log in', loggingIn: 'Logging in...', successMessage: '✅ Login successful! Redirecting...', noAccount: 'No account?', register: 'Register →', orContinueWith: 'or continue with', continueWithGoogle: 'Continue with Google' },
    it: { title: 'Bentornato', subtitle: 'Accedi al tuo account', email: 'Email', password: 'Password', forgotPassword: 'Password dimenticata?', loginButton: 'Accedi', loggingIn: 'Accesso...', successMessage: '✅ Accesso riuscito! Reindirizzamento...', noAccount: 'Nessun account?', register: 'Registrati →', orContinueWith: 'o continua con', continueWithGoogle: 'Continua con Google' },
    de: { title: 'Willkommen zurück', subtitle: 'Melden Sie sich in Ihrem Konto an', email: 'E-Mail', password: 'Passwort', forgotPassword: 'Passwort vergessen?', loginButton: 'Anmelden', loggingIn: 'Anmelden...', successMessage: '✅ Anmeldung erfolgreich! Weiterleitung...', noAccount: 'Kein Konto?', register: 'Registrieren →', orContinueWith: 'oder fortfahren mit', continueWithGoogle: 'Mit Google fortfahren' },
    fr: { title: 'Bon retour', subtitle: 'Connectez-vous à votre compte', email: 'Email', password: 'Mot de passe', forgotPassword: 'Mot de passe oublié ?', loginButton: 'Se connecter', loggingIn: 'Connexion...', successMessage: '✅ Connexion réussie ! Redirection...', noAccount: 'Pas de compte ?', register: 'S\'inscrire →', orContinueWith: 'ou continuer avec', continueWithGoogle: 'Continuer avec Google' },
    es: { title: 'Bienvenido de nuevo', subtitle: 'Inicia sesión en tu cuenta', email: 'Correo', password: 'Contraseña', forgotPassword: '¿Olvidaste tu contraseña?', loginButton: 'Iniciar sesión', loggingIn: 'Iniciando sesión...', successMessage: '✅ ¡Inicio de sesión exitoso! Redirigiendo...', noAccount: '¿No tienes cuenta?', register: 'Registrarse →', orContinueWith: 'o continúa con', continueWithGoogle: 'Continuar con Google' },
    pl: { title: 'Witamy ponownie', subtitle: 'Zaloguj się do swojego konta', email: 'Email', password: 'Hasło', forgotPassword: 'Zapomniałeś hasła?', loginButton: 'Zaloguj się', loggingIn: 'Logowanie...', successMessage: '✅ Logowanie udane! Przekierowanie...', noAccount: 'Nie masz konta?', register: 'Zarejestruj się →', orContinueWith: 'lub kontynuuj z', continueWithGoogle: 'Kontynuuj z Google' },
    ro: { title: 'Bine ai revenit', subtitle: 'Conectează-te la contul tău', email: 'Email', password: 'Parolă', forgotPassword: 'Ai uitat parola?', loginButton: 'Conectare', loggingIn: 'Conectare...', successMessage: '✅ Conectare reușită! Redirecționare...', noAccount: 'Nu ai cont?', register: 'Înregistrează-te →', orContinueWith: 'sau continuă cu', continueWithGoogle: 'Continuă cu Google' }
  };

  const t = translations[lang];

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        setMessage(lang === 'sl' ? '❌ Napaka pri prijavi z Google' : '❌ Google login error');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setMessage(lang === 'sl' ? '❌ Napaka pri prijavi z Google' : '❌ Google login error');
    }
  }

  async function handleLogin(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Login form: Sending login request for', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login form: Response status:', response.status);
      
      const data = await response.json();
      console.log('Login form: Response data:', data);

      if (!response.ok || data.error) {
        console.error('Login form: Error:', data.error);
        const errorMsg = data.error || 'Login failed';
        
        // Translate common errors
        let displayError = errorMsg;
        if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('Email not confirmed')) {
          displayError = lang === 'sl' ? '❌ Napačen email ali geslo. Preverite tudi ali ste potrdili email.' :
                        lang === 'en' ? '❌ Invalid email or password. Also check if you confirmed your email.' :
                        lang === 'it' ? '❌ Email o password non validi. Controlla anche se hai confermato la tua email.' :
                        lang === 'de' ? '❌ Ungültige E-Mail oder Passwort. Überprüfen Sie auch, ob Sie Ihre E-Mail bestätigt haben.' :
                        lang === 'fr' ? '❌ Email ou mot de passe invalide. Vérifiez également si vous avez confirmé votre email.' :
                        lang === 'es' ? '❌ Email o contraseña inválidos. Comprueba también si has confirmado tu email.' :
                        lang === 'pl' ? '❌ Nieprawidłowy email lub hasło. Sprawdź również, czy potwierdziłeś swój email.' :
                        '❌ Email sau parolă invalidă. Verifică și dacă ai confirmat email-ul.';
        }
        
        setMessage(displayError);
        setLoading(false);
      } else {
        console.log('Login form: Success! Redirecting...');
        setMessage(t.successMessage);
        
        // Cookies are set by server via Set-Cookie header
        // Redirect to main app
        setTimeout(() => {
          window.location.href = '/app';
        }, 300);
      }
    } catch (error: any) {
      console.error('Login form: Catch error:', error);
      setMessage(`❌ ${lang === 'sl' ? 'Napaka pri prijavi' : lang === 'en' ? 'Login error' : 'Errore di accesso'}: ${error?.message || 'Unknown error'}`);
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
        
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">{t.orContinueWith}</span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          type="button"
          class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t.continueWithGoogle}
        </button>
        
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

