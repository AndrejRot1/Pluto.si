import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (with service role key)
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
        .select("stripe_customer_id, email, subscription_status, trial_ends_at")
        .eq("id", user.id)
        .single();

      let customerId = profile?.stripe_customer_id;
      
      // Check if user is still in trial period
      const isInTrial = profile?.subscription_status === 'trial' && 
                       profile?.trial_ends_at && 
                       new Date(profile.trial_ends_at) > new Date();
      
      // Calculate remaining trial days (if in trial)
      let trialEndDays = 0;
      if (isInTrial && profile?.trial_ends_at) {
        const trialEnd = new Date(profile.trial_ends_at);
        const now = new Date();
        const diffTime = trialEnd.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        trialEndDays = Math.max(0, diffDays);
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
      console.log("🔵 Is in trial:", isInTrial, "Trial days remaining:", trialEndDays);
      
      // Build checkout session parameters
      const checkoutParams: Record<string, string> = {
        customer: customerId || "",
        mode: "subscription",
        "line_items[0][price]": STRIPE_PRICE_ID,
        "line_items[0][quantity]": "1",
        success_url: `${origin}/auth/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/settings?payment=canceled`,
        "metadata[supabase_user_id]": user.id,
      };
      
      // If user is in trial, add trial period to subscription
      // This ensures Stripe will automatically charge after trial ends
      if (isInTrial && trialEndDays > 0) {
        // Set trial end date (in Unix timestamp)
        const trialEndDate = new Date(profile.trial_ends_at);
        const trialEndUnix = Math.floor(trialEndDate.getTime() / 1000);
        
        checkoutParams["subscription_data[trial_end]"] = trialEndUnix.toString();
        console.log("🔵 Adding trial period to subscription, ends at:", trialEndDate);
      }
      
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

