import { define } from "../../../utils.ts";
import { supabase } from "../../../utils/supabase.ts";
import { authSetCookieHeaders } from "../../../utils/auth-cookies.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const body = await ctx.req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // If email confirmation is disabled, user gets session immediately
    if (data.session) {
      const headers = new Headers();
      for (
        const c of authSetCookieHeaders(
          data.session.access_token,
          data.session.refresh_token,
        )
      ) {
        headers.append("Set-Cookie", c);
      }
      headers.set("Content-Type", "application/json");

      return new Response(
        JSON.stringify({ success: true, hasSession: true, user: data.user }),
        { headers },
      );
    }

    // Email confirmation required
    return Response.json({
      success: true,
      hasSession: false,
      message: "Preverite email za potrditev",
    });
  },
});

