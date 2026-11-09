import { define } from "../../../utils.ts";
import { supabase } from "../../../utils/supabase.ts";
import { authSetCookieHeaders } from "../../../utils/auth-cookies.ts";

async function readCredentials(req: Request): Promise<{ email: string; password: string }> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json();
    return {
      email: String(body.email || "").trim().toLowerCase(),
      password: String(body.password || ""),
    };
  }
  const form = await req.formData();
  return {
    email: String(form.get("email") || "").trim().toLowerCase(),
    password: String(form.get("password") || ""),
  };
}

function wantsHtmlRedirect(req: Request): boolean {
  const ct = req.headers.get("content-type") || "";
  // Classic HTML form posts (island hydration fallback)
  return ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data");
}

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const { email, password } = await readCredentials(ctx.req);
      const html = wantsHtmlRedirect(ctx.req);

      console.log("Login attempt for:", email);

      if (!email || !password) {
        if (html) {
          return Response.redirect(
            new URL("/auth/login?error=missing", ctx.url).href,
            303,
          );
        }
        return Response.json(
          { error: "Email and password required" },
          { status: 400 },
        );
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        if (html) {
          return Response.redirect(
            new URL("/auth/login?error=credentials", ctx.url).href,
            303,
          );
        }
        return Response.json({ error: error.message }, { status: 400 });
      }

      if (!data.session) {
        console.error("No session returned for user:", email);
        if (html) {
          return Response.redirect(
            new URL("/auth/login?error=session", ctx.url).href,
            303,
          );
        }
        return Response.json(
          {
            error:
              "Email not confirmed or no session. Check your inbox for the confirmation link.",
          },
          { status: 400 },
        );
      }

      console.log("Login successful for:", email);

      const headers = new Headers();
      for (
        const c of authSetCookieHeaders(
          data.session.access_token,
          data.session.refresh_token,
        )
      ) {
        headers.append("Set-Cookie", c);
      }

      if (html) {
        headers.set("Location", "/app");
        return new Response(null, { status: 303, headers });
      }

      headers.set("Content-Type", "application/json");
      return new Response(
        JSON.stringify({
          success: true,
          user: data.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
        { headers },
      );
    } catch (error: any) {
      console.error("Login handler error:", error);
      return Response.json(
        { error: error?.message || "Internal server error" },
        { status: 500 },
      );
    }
  },
});
