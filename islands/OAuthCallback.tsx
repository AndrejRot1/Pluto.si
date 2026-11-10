import { useEffect, useState } from "preact/hooks";
import { getSupabaseBrowser } from "../utils/supabase-browser.ts";

export default function OAuthCallback() {
  const [status, setStatus] = useState("Prijava poteka...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function finishOAuth() {
      try {
        const url = new URL(globalThis.location.href);
        const errorDesc =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error");
        if (errorDesc) {
          throw new Error(errorDesc);
        }

        const supabase = getSupabaseBrowser();
        const code = url.searchParams.get("code");

        let accessToken = "";
        let refreshToken = "";

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code,
          );
          if (error) throw error;
          accessToken = data.session?.access_token || "";
          refreshToken = data.session?.refresh_token || "";
        } else {
          // Implicit / hash fragment fallback
          const hash = new URLSearchParams(
            globalThis.location.hash.replace(/^#/, ""),
          );
          accessToken = hash.get("access_token") || "";
          refreshToken = hash.get("refresh_token") || "";

          if (!accessToken) {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            accessToken = data.session?.access_token || "";
            refreshToken = data.session?.refresh_token || "";
          }
        }

        if (!accessToken || !refreshToken) {
          throw new Error("No session returned from Google login");
        }

        const res = await fetch("/api/auth/session", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        });

        const body = await res.json().catch(() => ({}));
        if (!res.ok || body.error) {
          throw new Error(body.error || "Could not establish session");
        }

        if (!cancelled) {
          setStatus("Uspešna prijava! Preusmerjanje...");
          globalThis.location.replace("/app");
        }
      } catch (e: any) {
        console.error("OAuth callback failed:", e);
        if (!cancelled) {
          setFailed(true);
          setStatus(
            e?.message
              ? `Prijava ni uspela: ${e.message}`
              : "Prijava ni uspela. Poskusi znova.",
          );
        }
      }
    }

    finishOAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
        {!failed && (
          <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        )}
        <h1 class="mb-2 text-xl font-semibold text-gray-900">
          {failed ? "Napaka pri prijavi" : "Google prijava"}
        </h1>
        <p class="text-sm text-gray-600">{status}</p>
        {failed && (
          <a
            href="/auth/login"
            class="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nazaj na prijavo
          </a>
        )}
      </div>
    </div>
  );
}
