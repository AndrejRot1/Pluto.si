import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (with service role key)
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_PRICE_ID = Deno.env.get("STRIPE_PRICE_ID") || ""; // e.g., price_1ABC...

export const handler = define.handlers({
  async POST(req) {
    try {
      // Get user from authorization header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get or create Stripe customer
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("stripe_customer_id, email")
        .eq("id", user.id)
        .single();

      let customerId = profile?.stripe_customer_id;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const createCustomerRes = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: user.email || profile?.email || "",
            metadata: JSON.stringify({ supabase_user_id: user.id }),
          }),
        });

        const customer = await createCustomerRes.json();
        customerId = customer.id;

        // Save customer ID to profile
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }

      // Create Stripe Checkout Session
      const origin = new URL(req.url).origin;
      const checkoutRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          customer: customerId,
          mode: "subscription",
          "line_items[0][price]": STRIPE_PRICE_ID,
          "line_items[0][quantity]": "1",
          success_url: `${origin}/?success=true`,
          cancel_url: `${origin}/?canceled=true`,
          "metadata[supabase_user_id]": user.id,
        }),
      });

      const session = await checkoutRes.json();

      if (!checkoutRes.ok) {
        console.error("Stripe error:", session);
        return new Response(JSON.stringify({ error: "Failed to create checkout session" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ url: session.url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

