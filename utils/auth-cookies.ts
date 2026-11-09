export function parseCookies(
  cookieHeader: string | null,
): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=");
      const raw = v.join("=");
      try {
        return [key, decodeURIComponent(raw)];
      } catch {
        return [key, raw];
      }
    }),
  );
}

export function getAccessTokenFromRequest(req: Request): string | null {
  const cookies = parseCookies(req.headers.get("cookie"));
  return cookies["sb-access-token"] || null;
}

export function getRefreshTokenFromRequest(req: Request): string | null {
  const cookies = parseCookies(req.headers.get("cookie"));
  return cookies["sb-refresh-token"] || null;
}

function isProduction(): boolean {
  return Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
}

/** Build Set-Cookie lines for Supabase auth tokens. */
export function authSetCookieHeaders(
  accessToken: string,
  refreshToken: string,
): string[] {
  const secure = isProduction() ? "; Secure" : "";
  // Keep access cookie around long enough that refresh can run after JWT expiry.
  return [
    `sb-access-token=${encodeURIComponent(accessToken)}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax${secure}`,
    `sb-refresh-token=${encodeURIComponent(refreshToken)}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${secure}`,
  ];
}

export function clearAuthSetCookieHeaders(): string[] {
  const secure = isProduction() ? "; Secure" : "";
  return [
    `sb-access-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
    `sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
  ];
}

export function withAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
): Response {
  const headers = new Headers(response.headers);
  for (const c of authSetCookieHeaders(accessToken, refreshToken)) {
    headers.append("Set-Cookie", c);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
