import { define } from "../../../utils.ts";
import { supabaseAdmin } from "../../../utils/supabase-admin.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_PRICE_ID = Deno.env.get("STRIPE_PRICE_ID") || ""; // e.g., price_1ABC...

export const handler = define.handlers({
  async POST(ctx) {
    try {
      // Get user from authorization header
      const authHeader = ctx.req.headers.get("Authorization");
      
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
        .select("stripe_customer_id, email, subscription_status, trial_helps_used")
        .eq("id", user.id)
        .single();

      let customerId = profile?.stripe_customer_id;

      // Verify existing customer ID is valid for current mode (test/live)
      if (customerId) {
        const verifyCustomerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          },
        });

        if (!verifyCustomerRes.ok) {
          const error = await verifyCustomerRes.json();
          // If customer doesn't exist in current mode (test/live mismatch), clear it
          if (error.error?.code === 'resource_missing') {
            console.log("⚠️ Customer ID exists in different mode, creating new one...");
            customerId = null;
            // Clear invalid customer ID from database
            await supabaseAdmin
              .from("profiles")
              .update({ stripe_customer_id: null })
              .eq("id", user.id);
          }
        }
      }

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
            "metadata[supabase_user_id]": user.id,
          }),
        });

        const customer = await createCustomerRes.json();
        console.log("✅ Created Stripe customer:", customer);

        if (!createCustomerRes.ok || !customer.id) {
          console.error("❌ Failed to create customer:", customer);
          return new Response(JSON.stringify({ error: "Failed to create Stripe customer" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        customerId = customer.id;

        // Save customer ID to profile
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }

      // Create Stripe Checkout Session
      const origin = ctx.url.origin;
      console.log("🔵 Creating checkout with customer ID:", customerId);
      console.log("🔵 Price ID:", STRIPE_PRICE_ID);
      console.log("🔵 Profile status:", profile?.subscription_status);
      
      // Usage-based free helps: subscription starts immediately (no Stripe calendar trial)
      const checkoutParams: Record<string, string> = {
        customer: customerId || "",
        mode: "subscription",
        "line_items[0][price]": STRIPE_PRICE_ID,
        "line_items[0][quantity]": "1",
        success_url: `${origin}/auth/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/settings?payment=canceled`,
        "metadata[supabase_user_id]": user.id,
      };
      
      const checkoutRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(checkoutParams),
      });

      const session = await checkoutRes.json();

      if (!checkoutRes.ok) {
        console.error("❌ Stripe checkout error:", session);
        return new Response(JSON.stringify({ error: "Failed to create checkout session" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("✅ Checkout session created:", session.url);

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

