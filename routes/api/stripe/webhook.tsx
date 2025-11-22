import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";

/**
 * Verify Stripe webhook signature using HMAC SHA256
 * Based on: https://stripe.com/docs/webhooks/signatures
 */
async function verifyStripeWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Parse signature header (format: "t=timestamp,v1=signature,v1=signature2,...")
    const elements = signature.split(",");
    const sigHeader: Record<string, string> = {};
    
    for (const element of elements) {
      const [key, value] = element.split("=");
      if (key && value) {
        sigHeader[key] = value;
      }
    }
    
    // Get timestamp and signature
    const timestamp = sigHeader.t;
    const signatures = Object.entries(sigHeader)
      .filter(([key]) => key.startsWith("v"))
      .map(([, value]) => value);
    
    if (!timestamp || signatures.length === 0) {
      return false;
    }
    
    // Check timestamp (reject if older than 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const eventTime = parseInt(timestamp);
    if (Math.abs(currentTime - eventTime) > 300) {
      console.warn("⚠️ Webhook timestamp too old or too far in future");
      return false;
    }
    
    // Create signed payload
    const signedPayload = `${timestamp}.${payload}`;
    
    // Compute HMAC SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(signedPayload);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );
    
    // Convert to hex
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    
    // Compare with provided signatures
    for (const providedSig of signatures) {
      if (signatureHex === providedSig) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const signature = ctx.req.headers.get("stripe-signature");
      if (!signature) {
        return new Response("No signature", { status: 400 });
      }

      const body = await ctx.req.text();

      // Verify webhook signature for security (if secret is set)
      if (STRIPE_WEBHOOK_SECRET) {
        try {
          const isValid = await verifyStripeWebhookSignature(
            body,
            signature,
            STRIPE_WEBHOOK_SECRET
          );
          
          if (!isValid) {
            console.error("Webhook signature verification failed");
            return new Response("Invalid signature", { status: 400 });
          }
        } catch (error) {
          console.error("Webhook verification error:", error);
          return new Response("Webhook verification failed", { status: 400 });
        }
      }
      
      const event = JSON.parse(body);

      console.log("Stripe webhook event:", event.type);

      // Handle different event types
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          let userId = subscription.metadata?.supabase_user_id;

          // If no userId in subscription metadata, try to get it from customer
          if (!userId) {
            console.log("No user ID in subscription metadata, checking customer...");
            // Get customer to check metadata
            const customerRes = await fetch(`https://api.stripe.com/v1/customers/${subscription.customer}`, {
              headers: {
                "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
              },
            });
            
            if (customerRes.ok) {
              const customer = await customerRes.json();
              userId = customer.metadata?.supabase_user_id;
              console.log("Found user ID from customer:", userId);
            }

            // Last resort: find user by stripe_customer_id in profiles
            if (!userId) {
              console.log("Checking profiles table for customer ID...");
              const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("id")
                .eq("stripe_customer_id", subscription.customer)
                .single();
              
              if (profile) {
                userId = profile.id;
                console.log("Found user ID from profiles:", userId);
              }
            }
          }

          if (!userId) {
            console.error("No user ID found for subscription:", subscription.id);
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
          // Map Stripe status to our app status
          let appStatus = "trial";
          if (subscription.status === "active" || subscription.status === "trialing") {
            appStatus = "active";
          } else if (subscription.status === "canceled" || subscription.status === "past_due" || subscription.status === "incomplete") {
            appStatus = "expired";
          }
          
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: appStatus,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
            })
            .eq("id", userId);

          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          let userId = subscription.metadata?.supabase_user_id;

          // If no userId in subscription metadata, try to get it from customer or profiles
          if (!userId) {
            const customerRes = await fetch(`https://api.stripe.com/v1/customers/${subscription.customer}`, {
              headers: {
                "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
              },
            });
            
            if (customerRes.ok) {
              const customer = await customerRes.json();
              userId = customer.metadata?.supabase_user_id;
            }

            if (!userId) {
              const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("id")
                .eq("stripe_customer_id", subscription.customer)
                .single();
              
              if (profile) {
                userId = profile.id;
              }
            }
          }

          if (!userId) {
            console.error("No user ID found for deleted subscription:", subscription.id);
            break;
          }

          // Delete subscription record
          await supabaseAdmin
            .from("subscriptions")
            .delete()
            .eq("stripe_subscription_id", subscription.id);

          // Update profile to expired
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "expired",
              stripe_subscription_id: null,
            })
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

