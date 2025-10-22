import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const signature = ctx.req.headers.get("stripe-signature");
      if (!signature) {
        return new Response("No signature", { status: 400 });
      }

      const body = await ctx.req.text();

      // Verify webhook signature (simplified - in production use crypto.subtle)
      // For now, we trust the webhook (add proper verification later)
      
      const event = JSON.parse(body);

      console.log("Stripe webhook event:", event.type);

      // Handle different event types
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          const userId = subscription.metadata?.supabase_user_id;

          if (!userId) {
            console.error("No user ID in subscription metadata");
            break;
          }

          // Update or insert subscription
          await supabaseAdmin
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_customer_id: subscription.customer,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            }, {
              onConflict: "stripe_subscription_id",
            });

          // Update profile subscription status
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: subscription.status === "active" ? "active" : "trial",
              stripe_subscription_id: subscription.id,
            })
            .eq("id", userId);

          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const userId = subscription.metadata?.supabase_user_id;

          if (!userId) {
            console.error("No user ID in subscription metadata");
            break;
          }

          // Update subscription status
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscription.id);

          // Update profile
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_status: "expired" })
            .eq("id", userId);

          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          console.log("Payment succeeded for:", invoice.customer);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          console.log("Payment failed for:", invoice.customer);
          
          // Optionally update user status
          const { data: subscription } = await supabaseAdmin
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription)
            .single();

          if (subscription) {
            await supabaseAdmin
              .from("profiles")
              .update({ subscription_status: "expired" })
              .eq("id", subscription.user_id);
          }
          break;
        }

        default:
          console.log("Unhandled event type:", event.type);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

