import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      console.log("🔵 Portal called");
      
      // Get user from authorization header
      const authHeader = ctx.req.headers.get("Authorization");
      if (!authHeader) {
        console.log("❌ No auth header");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        console.log("❌ Auth error:", authError);
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("✅ User authenticated:", user.email);

      // Get user's Stripe customer ID
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();

      console.log("🔵 Profile:", profile);

      if (!profile?.stripe_customer_id) {
        console.log("❌ No customer ID found");
        return new Response(JSON.stringify({ error: "No Stripe customer found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Create Stripe billing portal session
      const origin = ctx.url.origin;
      console.log("🔵 Creating portal for customer:", profile.stripe_customer_id);
      
      const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          customer: profile.stripe_customer_id,
          return_url: `${origin}/settings`,
        }),
      });

      const session = await portalRes.json();
      console.log("🔵 Stripe response:", session);

      if (!portalRes.ok) {
        console.error("❌ Stripe portal error:", session);
        return new Response(JSON.stringify({ error: session.error?.message || "Failed to create portal session" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("✅ Portal created:", session.url);

      return new Response(JSON.stringify({ url: session.url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Portal error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

