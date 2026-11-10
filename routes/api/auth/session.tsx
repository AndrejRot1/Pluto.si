import { define } from "../../../utils.ts";
import { authSetCookieHeaders } from "../../../utils/auth-cookies.ts";
import { supabaseAdmin } from "../../../utils/supabase-admin.ts";

async function ensureProfile(userId: string, email: string | undefined) {
  if (!email) return;
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (existing) return;

  const { data: used } = await supabaseAdmin
    .from("used_trials")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (used) {
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      trial_ends_at: new Date().toISOString(),
      trial_helps_used: 10,
      subscription_status: "expired",
    }, { onConflict: "id" });
    return;
  }

  await supabaseAdmin.from("profiles").upsert({
    id: userId,
    email,
    trial_ends_at: new Date().toISOString(),
    trial_helps_used: 0,
    subscription_status: "trial",
  }, { onConflict: "id" });

  await supabaseAdmin.from("used_trials").upsert({
    email,
    first_used_at: new Date().toISOString(),
  }, { onConflict: "email" });
}

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const accessToken = String(body.access_token || "").trim();
      const refreshToken = String(body.refresh_token || "").trim();

      if (!accessToken || !refreshToken) {
        return Response.json(
          { error: "Missing tokens" },
          { status: 400 },
        );
      }

      const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
      if (error || !data.user) {
        return Response.json(
          { error: "Invalid session" },
          { status: 401 },
        );
      }

      await ensureProfile(data.user.id, data.user.email);

      const headers = new Headers({ "Content-Type": "application/json" });
      for (const c of authSetCookieHeaders(accessToken, refreshToken)) {
        headers.append("Set-Cookie", c);
      }

      return new Response(
        JSON.stringify({ success: true, user: { id: data.user.id, email: data.user.email } }),
        { headers },
      );
    } catch (e: any) {
      console.error("Session handler error:", e);
      return Response.json(
        { error: e?.message || "Internal server error" },
        { status: 500 },
      );
    }
  },
});
