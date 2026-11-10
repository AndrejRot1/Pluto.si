import { useEffect, useState } from "preact/hooks";
import GoogleLoginButton from "./GoogleLoginButton.tsx";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<
    "sl" | "en" | "it" | "de" | "fr" | "es" | "pl" | "ro"
  >("en");

  useEffect(() => {
    const savedLang =
      (localStorage.getItem("pluto-lang") as
        | "sl"
        | "en"
        | "it"
        | "de"
        | "fr"
        | "es"
        | "pl"
        | "ro") || "en";
    setLang(savedLang);

    const params = new URLSearchParams(globalThis.location.search);
    const err = params.get("error");
    if (err === "credentials" || err === "session" || err === "missing") {
      setMessage(
        savedLang === "sl"
          ? "❌ Prijava ni uspela. Preveri email in geslo."
          : "❌ Login failed. Check email and password.",
      );
    }
  }, []);

  const translations = {
    sl: {
      title: "Dobrodošli nazaj",
      subtitle: "Prijavite se v svoj račun",
      email: "Email",
      password: "Geslo",
      forgotPassword: "Pozabljeno geslo?",
      loginButton: "Prijava",
      loggingIn: "Prijavljanje...",
      successMessage: "✅ Uspešna prijava! Preusmerjanje...",
      noAccount: "Nimate računa?",
      register: "Registrirajte se →",
      or: "ali",
    },
    en: {
      title: "Welcome back",
      subtitle: "Log in to your account",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      loginButton: "Log in",
      loggingIn: "Logging in...",
      successMessage: "✅ Login successful! Redirecting...",
      noAccount: "No account?",
      register: "Register →",
      or: "or",
    },
    it: {
      title: "Bentornato",
      subtitle: "Accedi al tuo account",
      email: "Email",
      password: "Password",
      forgotPassword: "Password dimenticata?",
      loginButton: "Accedi",
      loggingIn: "Accesso...",
      successMessage: "✅ Accesso riuscito! Reindirizzamento...",
      noAccount: "Nessun account?",
      register: "Registrati →",
      or: "oppure",
    },
    de: {
      title: "Willkommen zurück",
      subtitle: "Melden Sie sich in Ihrem Konto an",
      email: "E-Mail",
      password: "Passwort",
      forgotPassword: "Passwort vergessen?",
      loginButton: "Anmelden",
      loggingIn: "Anmelden...",
      successMessage: "✅ Anmeldung erfolgreich! Weiterleitung...",
      noAccount: "Kein Konto?",
      register: "Registrieren →",
      or: "oder",
    },
    fr: {
      title: "Bon retour",
      subtitle: "Connectez-vous à votre compte",
      email: "Email",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      loginButton: "Se connecter",
      loggingIn: "Connexion...",
      successMessage: "✅ Connexion réussie ! Redirection...",
      noAccount: "Pas de compte ?",
      register: "S'inscrire →",
      or: "ou",
    },
    es: {
      title: "Bienvenido de nuevo",
      subtitle: "Inicia sesión en tu cuenta",
      email: "Correo",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Iniciar sesión",
      loggingIn: "Iniciando sesión...",
      successMessage: "✅ ¡Inicio de sesión exitoso! Redirigiendo...",
      noAccount: "¿No tienes cuenta?",
      register: "Registrarse →",
      or: "o",
    },
    pl: {
      title: "Witamy ponownie",
      subtitle: "Zaloguj się do swojego konta",
      email: "Email",
      password: "Hasło",
      forgotPassword: "Zapomniałeś hasła?",
      loginButton: "Zaloguj się",
      loggingIn: "Logowanie...",
      successMessage: "✅ Logowanie udane! Przekierowanie...",
      noAccount: "Nie masz konta?",
      register: "Zarejestruj się →",
      or: "lub",
    },
    ro: {
      title: "Bine ai revenit",
      subtitle: "Conectează-te la contul tău",
      email: "Email",
      password: "Parolă",
      forgotPassword: "Ai uitat parola?",
      loginButton: "Conectare",
      loggingIn: "Conectare...",
      successMessage: "✅ Conectare reușită! Redirecționare...",
      noAccount: "Nu ai cont?",
      register: "Înregistrează-te →",
      or: "sau",
    },
  };

  const t = translations[lang];

  async function handleLogin(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.error) {
        const errorMsg = String(data.error || "Login failed");
        let displayError = errorMsg;
        if (
          errorMsg.includes("Invalid login credentials") ||
          errorMsg.includes("Email not confirmed")
        ) {
          displayError = lang === "sl"
            ? "❌ Napačen email ali geslo."
            : "❌ Invalid email or password.";
        }
        setMessage(displayError);
        setLoading(false);
        return;
      }

      setMessage(t.successMessage);
      // Hard navigation so cookies from Set-Cookie are definitely used
      globalThis.location.href = "/app";
    } catch (error: any) {
      setMessage(
        `❌ ${
          lang === "sl" ? "Napaka pri prijavi" : "Login error"
        }: ${error?.message || "Unknown error"}`,
      );
      setLoading(false);
    }
  }

  return (
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-3xl font-bold text-gray-900">{t.title}</h1>
          <p class="text-gray-600">{t.subtitle}</p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur">
          {/* Classic form POST works even if the island JS fails to hydrate */}
          <form
            method="POST"
            action="/api/auth/login"
            class="space-y-4"
            onSubmit={handleLogin}
          >
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                autocomplete="email"
                value={email}
                onInput={(e) =>
                  setEmail((e.target as HTMLInputElement).value)}
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <div class="mb-1 flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-700">
                  {t.password}
                </label>
                <a
                  href="/auth/forgot-password"
                  class="text-sm text-blue-600 hover:underline"
                >
                  {t.forgotPassword}
                </a>
              </div>
              <input
                type="password"
                name="password"
                autocomplete="current-password"
                value={password}
                onInput={(e) =>
                  setPassword((e.target as HTMLInputElement).value)}
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              class="min-h-[48px] w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t.loggingIn : t.loginButton}
            </button>
          </form>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-3 text-gray-500">{t.or}</span>
            </div>
          </div>

          <GoogleLoginButton
            lang={lang}
            onError={(msg) => setMessage(`❌ ${msg}`)}
          />

          {message && (
            <div
              class={`mt-5 rounded-xl p-3 text-center text-sm ${
                message.includes("✅")
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div class="mt-6 text-center">
            <p class="mb-3 text-sm text-gray-600">{t.noAccount}</p>
            <a
              href="/auth/register"
              class="inline-block w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              {t.register}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
