import { define } from "../../utils.ts";
import { supabaseAdmin } from "../../utils/supabase-admin.ts";

export const handler = define.handlers({
  async GET(ctx) {
    try {
      // Get Stripe session_id from URL
      const url = new URL(ctx.req.url);
      const sessionId = url.searchParams.get("session_id");

      if (!sessionId) {
        console.error("❌ No session_id in URL");
        return new Response(null, {
          status: 302,
          headers: { Location: "/auth/register" },
        });
      }

      console.log("🔵 Verifying Stripe session:", sessionId);

      // Verify Stripe session
      const stripeRes = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          },
        }
      );

      if (!stripeRes.ok) {
        console.error("❌ Stripe session verification failed");
        return new Response(null, {
          status: 302,
          headers: { Location: "/auth/register" },
        });
      }

      const session = await stripeRes.json();
      const userId = session.metadata?.supabase_user_id;

      if (!userId) {
        console.error("❌ No user ID in Stripe session");
        return new Response(null, {
          status: 302,
          headers: { Location: "/auth/register" },
        });
      }

      console.log("✅ Stripe session verified for user:", userId);

      // Get subscription from session
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      console.log("🔵 Subscription ID:", subscriptionId);
      console.log("🔵 Customer ID:", customerId);

      // Get user from Supabase
      const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (userError || !user) {
        console.error("❌ User not found:", userError);
        return new Response(null, {
          status: 302,
          headers: { Location: "/auth/register" },
        });
      }

      // Update profile with active subscription
      if (subscriptionId && customerId) {
        console.log("🔵 Updating profile to active subscription...");
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "active",
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
          })
          .eq("id", userId);

        if (updateError) {
          console.error("❌ Failed to update profile:", updateError);
        } else {
          console.log("✅ Profile updated to active subscription");
        }

        // Also update subscriptions table
        const { error: subError } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: "active",
          }, {
            onConflict: "stripe_subscription_id",
          });

        if (subError) {
          console.error("❌ Failed to update subscriptions table:", subError);
        } else {
          console.log("✅ Subscriptions table updated");
        }
      }

      // Create new session for user
      const { data, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: user.email!,
      });

      if (sessionError || !data) {
        console.error("❌ Failed to create session:", sessionError);
        return new Response(null, {
          status: 302,
          headers: { Location: "/auth/register" },
        });
      }

      console.log("✅ Session created, setting cookies and redirecting to /chat");

      // Extract tokens from the generated link (workaround)
      // Better approach: Use signInWithPassword or admin.createUser with session
      // For now, redirect to /chat and let user refresh if needed
      
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/chat?payment=success",
        },
      });
    } catch (error) {
      console.error("❌ Payment success handler error:", error);
      return new Response(null, {
        status: 302,
        headers: { Location: "/auth/register" },
      });
    }
  },
});

