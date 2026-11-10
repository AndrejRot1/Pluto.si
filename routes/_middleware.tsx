import { define } from "../utils.ts";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "../utils/supabase-env.ts";
import { supabaseAdmin } from "../utils/supabase-admin.ts";
import { isTrialExhausted } from "../utils/trial.ts";
import {
  parseCookies,
  withAuthCookies,
} from "../utils/auth-cookies.ts";

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig();

export const handler = define.middleware(async (ctx) => {
  const publicPaths = [
    "/auth/",
    "/api/",
    "/trial-expired",
    "/demo",
    "/terms",
    "/privacy",
  ];
  if (
    ctx.url.pathname === "/" ||
    publicPaths.some((path) =>
      ctx.url.pathname.startsWith(path) || ctx.url.pathname === path
    )
  ) {
    return await ctx.next();
  }

  const authCookie = ctx.req.headers.get("cookie");
  if (!authCookie) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/auth/login" },
    });
  }

  const cookies = parseCookies(authCookie);
  let accessToken = cookies["sb-access-token"] || "";
  let refreshToken = cookies["sb-refresh-token"] || "";

  if (!accessToken && !refreshToken) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/auth/login" },
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let user = null;
    let refreshed = false;

    if (accessToken) {
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (!error && data.user) {
        user = data.user;
      }
    }

    // Access JWT expired / missing — refresh with refresh token
    if (!user && refreshToken) {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (!error && data.session?.access_token) {
        accessToken = data.session.access_token;
        refreshToken = data.session.refresh_token || refreshToken;
        refreshed = true;
        if (data.user) {
          user = data.user;
        } else {
          const again = await supabase.auth.getUser(accessToken);
          user = again.data.user;
        }
      }
    }

    if (!user) {
      console.log("Invalid session, redirecting to login");
      return new Response(null, {
        status: 302,
        headers: { Location: "/auth/login" },
      });
    }

    const authed = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    });

    const { data: profile } = await authed
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("User authenticated:", user.email, "Profile:", profile);

    ctx.state.user = {
      id: user.id,
      email: user.email,
    };
    ctx.state.profile = profile;

    if (profile) {
      if (
        profile.subscription_status === "trial" &&
        isTrialExhausted(profile)
      ) {
        console.log("Trial helps exhausted, updating status to expired");
        // Service role only — clients can no longer UPDATE billing fields via RLS
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_status: "expired" })
          .eq("id", user.id);

        profile.subscription_status = "expired";
        ctx.state.profile = profile;
      }

      const isExpired = profile.subscription_status === "expired";
      const hasActiveSubscription = profile.subscription_status === "active";

      if (
        isExpired &&
        !hasActiveSubscription &&
        ctx.url.pathname !== "/settings"
      ) {
        console.log("Trial expired, redirecting to trial-expired page");
        const expiredResp = new Response(null, {
          status: 302,
          headers: { Location: "/trial-expired" },
        });
        return refreshed
          ? withAuthCookies(expiredResp, accessToken, refreshToken)
          : expiredResp;
      }
    }

    const response = await ctx.next();
    return refreshed
      ? withAuthCookies(response, accessToken, refreshToken)
      : response;
  } catch (err) {
    console.error("Middleware error:", err);
    return new Response(null, {
      status: 302,
      headers: { Location: "/auth/login" },
    });
  }
});
