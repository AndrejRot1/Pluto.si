import { useEffect, useState } from "preact/hooks";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterForm() {
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
    sl: { title: 'Ustvari račun', subtitle: 'Začni svojo matematično pot', trialInfo: '✨ 3-dnevno brezplačno preizkusno obdobje', trialBenefits: '✓ Kreditna kartica ni potrebna\n✓ Koraki rešitev\n✓ Podpora za vse teme', email: 'Email', password: 'Geslo', minChars: 'Najmanj 6 znakov', startTrial: 'Začni brezplačno preizkusno obdobje', creating: 'Ustvarjanje računa...', haveAccount: 'Že imate račun?', login: 'Prijavite se', successMessage: 'Registracija uspešna! Preverite svoj email za potrditev računa.', errorMessage: 'Registracija ni uspela. Poskusite znova.', orContinueWith: 'ali nadaljuj z', continueWithGoogle: 'Nadaljuj z Google' },
    en: { title: 'Create Account', subtitle: 'Start your math learning journey', trialInfo: '✨ 3-day free trial', trialBenefits: '✓ No credit card required\n✓ Step-by-step solutions\n✓ Support for all math topics', email: 'Email', password: 'Password', minChars: 'Minimum 6 characters', startTrial: 'Start Free Trial', creating: 'Creating account...', haveAccount: 'Already have an account?', login: 'Log in', successMessage: 'Registration successful! Please check your email to confirm your account.', errorMessage: 'Registration failed. Please try again.', orContinueWith: 'or continue with', continueWithGoogle: 'Continue with Google' },
    it: { title: 'Crea Account', subtitle: 'Inizia il tuo viaggio di apprendimento matematico', trialInfo: '✨ Prova gratuita di 3 giorni', trialBenefits: '✓ Nessuna carta di credito richiesta\n✓ Soluzioni passo-passo\n✓ Supporto per tutti gli argomenti', email: 'Email', password: 'Password', minChars: 'Minimo 6 caratteri', startTrial: 'Inizia Prova Gratuita', creating: 'Creazione account...', haveAccount: 'Hai già un account?', login: 'Accedi', successMessage: 'Registrazione riuscita! Controlla la tua email per confermare il tuo account.', errorMessage: 'Registrazione fallita. Riprova.', orContinueWith: 'o continua con', continueWithGoogle: 'Continua con Google' },
    de: { title: 'Konto Erstellen', subtitle: 'Beginne deine Mathe-Lernreise', trialInfo: '✨ 3 Tage kostenlose Testversion', trialBenefits: '✓ Keine Kreditkarte erforderlich\n✓ Schritt-für-Schritt-Lösungen\n✓ Unterstützung für alle Themen', email: 'E-Mail', password: 'Passwort', minChars: 'Mindestens 6 Zeichen', startTrial: 'Kostenlose Testversion Starten', creating: 'Konto wird erstellt...', haveAccount: 'Bereits ein Konto?', login: 'Anmelden', successMessage: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mail, um dein Konto zu bestätigen.', errorMessage: 'Registrierung fehlgeschlagen. Bitte versuche es erneut.', orContinueWith: 'oder fortfahren mit', continueWithGoogle: 'Mit Google fortfahren' },
    fr: { title: 'Créer un Compte', subtitle: "Commence ton voyage d'apprentissage des mathématiques", trialInfo: '✨ Essai gratuit de 3 jours', trialBenefits: '✓ Aucune carte de crédit requise\n✓ Solutions étape par étape\n✓ Support pour tous les sujets', email: 'Email', password: 'Mot de passe', minChars: 'Minimum 6 caractères', startTrial: "Commencer l'Essai Gratuit", creating: 'Création du compte...', haveAccount: 'Vous avez déjà un compte ?', login: 'Se connecter', successMessage: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.', errorMessage: 'Inscription échouée. Veuillez réessayer.', orContinueWith: 'ou continuer avec', continueWithGoogle: 'Continuer avec Google' },
    es: { title: 'Crear Cuenta', subtitle: 'Comienza tu viaje de aprendizaje matemático', trialInfo: '✨ Prueba gratuita de 3 días', trialBenefits: '✓ No se requiere tarjeta de crédito\n✓ Soluciones paso a paso\n✓ Soporte para todos los temas', email: 'Correo', password: 'Contraseña', minChars: 'Mínimo 6 caracteres', startTrial: 'Comenzar Prueba Gratuita', creating: 'Creando cuenta...', haveAccount: '¿Ya tienes una cuenta?', login: 'Iniciar sesión', successMessage: '¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.', errorMessage: 'Registro fallido. Por favor intenta de nuevo.', orContinueWith: 'o continúa con', continueWithGoogle: 'Continuar con Google' },
    pl: { title: 'Utwórz Konto', subtitle: 'Rozpocznij swoją matematyczną podróż', trialInfo: '✨ 3-dniowy bezpłatny okres próbny', trialBenefits: '✓ Karta kredytowa nie jest wymagana\n✓ Rozwiązania krok po kroku\n✓ Wsparcie dla wszystkich tematów', email: 'Email', password: 'Hasło', minChars: 'Minimum 6 znaków', startTrial: 'Rozpocznij Bezpłatny Okres Próbny', creating: 'Tworzenie konta...', haveAccount: 'Masz już konto?', login: 'Zaloguj się', successMessage: 'Rejestracja udana! Sprawdź swoją pocztę, aby potwierdzić swoje konto.', errorMessage: 'Rejestracja nie powiodła się. Spróbuj ponownie.', orContinueWith: 'lub kontynuuj z', continueWithGoogle: 'Kontynuuj z Google' },
    ro: { title: 'Creează Cont', subtitle: 'Începe călătoria ta de învățare matematică', trialInfo: '✨ Perioadă de probă gratuită de 3 zile', trialBenefits: '✓ Nu este necesară cardul de credit\n✓ Soluții pas cu pas\n✓ Suport pentru toate subiectele', email: 'Email', password: 'Parolă', minChars: 'Minimum 6 caractere', startTrial: 'Începe Perioada de Probă Gratuită', creating: 'Creare cont...', haveAccount: 'Ai deja un cont?', login: 'Conectare', successMessage: 'Înregistrare reușită! Te rugăm să verifici email-ul pentru a-ți confirma contul.', errorMessage: 'Înregistrare eșuată. Te rugăm să încerci din nou.', orContinueWith: 'sau continuă cu', continueWithGoogle: 'Continuă cu Google' }
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

  async function handleRegister(e: Event) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // First check if email already exists
      console.log('RegisterForm: Checking if email exists:', email);
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log('RegisterForm: Check response status:', checkResponse.status);
      
      const checkData = await checkResponse.json();
      console.log('RegisterForm: Email check result:', checkData);

      if (checkData.exists) {
        console.log('RegisterForm: Email already exists, showing error message');
        const existsMsg = lang === 'sl' ? '⚠️ Ta email naslov je že registriran. Poskusite se prijaviti ali ponastaviti geslo.' :
                         lang === 'en' ? '⚠️ This email is already registered. Try logging in or resetting your password.' :
                         lang === 'it' ? '⚠️ Questa email è già registrata. Prova ad accedere o reimpostare la password.' :
                         lang === 'de' ? '⚠️ Diese E-Mail ist bereits registriert. Versuchen Sie sich anzumelden oder das Passwort zurückzusetzen.' :
                         lang === 'fr' ? '⚠️ Cet email est déjà enregistré. Essayez de vous connecter ou de réinitialiser votre mot de passe.' :
                         lang === 'es' ? '⚠️ Este correo ya está registrado. Intenta iniciar sesión o restablecer tu contraseña.' :
                         lang === 'pl' ? '⚠️ Ten adres email jest już zarejestrowany. Spróbuj się zalogować lub zresetować hasło.' :
                         '⚠️ Acest email este deja înregistrat. Încearcă să te conectezi sau să resetezi parola.';
        console.log('RegisterForm: Setting error message:', existsMsg);
        setMessage(existsMsg);
        setLoading(false);
        return;
      }

      // Proceed with registration
      console.log('RegisterForm: Email is available, proceeding with registration');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setMessage(t.successMessage);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = error?.message || t.errorMessage;
      setMessage(`${t.errorMessage} (${errorMsg})`);
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
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p class="text-gray-600">
            {t.subtitle}
          </p>
        </div>
          
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p class="text-sm text-blue-800 font-medium mb-2">
              {t.trialInfo}
            </p>
            <p class="text-xs text-blue-700 whitespace-pre-line">
              {t.trialBenefits}
            </p>
          </div>
          
          <form onSubmit={handleRegister} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                required
                minlength={6}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p class="text-xs text-gray-500 mt-1">{t.minChars}</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-base"
            >
              {loading ? t.creating : t.startTrial}
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
          
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 mb-3">{t.haveAccount}</p>
            <a 
              href="/auth/login" 
              class="inline-block w-full py-2.5 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm"
            >
              {t.login}
            </a>
          </div>
          
          {message && (
            <div class={`mt-4 text-center text-sm p-3 rounded-md ${
              message.includes('success') || message.includes('riusc') || message.includes('erfolgreich') || message.includes('réussie') || message.includes('exitoso') || message.includes('udana') || message.includes('reușită')
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
