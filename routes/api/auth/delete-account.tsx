import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const handler = define.handlers({
  async POST(ctx) {
    try {
      console.log('Delete account: Request received');
      
      // Get user from authorization header
      const authHeader = ctx.req.headers.get("Authorization");
      if (!authHeader) {
        console.error('Delete account: No authorization header');
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.replace("Bearer ", "");
      console.log('Delete account: Token received, verifying user...');
      
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        console.error('Delete account: Auth error or no user:', authError?.message);
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log('Delete account: User verified:', user.email);
      console.log('Delete account: Deleting account completely for ID:', user.id);

      // Mark email as used trial BEFORE deleting from auth.users
      // This ensures email is tracked in used_trials table even after account deletion
      // The trigger will also handle this, but we do it explicitly here too for safety
      const { error: markTrialError } = await supabaseAdmin
        .from('used_trials')
        .upsert({
          email: user.email,
          first_used_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        });

      if (markTrialError) {
        console.warn('Delete account: Could not mark trial as used (trigger will handle it):', markTrialError);
      } else {
        console.log('Delete account: Email marked as used trial:', user.email);
      }

      // Delete related subscriptions first (optional, keep data clean)
      const { error: subsDeleteError } = await supabaseAdmin
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (subsDeleteError) {
        console.warn('Delete account: Could not delete subscriptions:', subsDeleteError);
      }

      // Delete profile row (will be deleted automatically via CASCADE when auth.users is deleted)
      // But we delete it explicitly first to ensure clean deletion
      const { error: profileDeleteError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileDeleteError) {
        console.warn('Delete account: Could not delete profile (will be deleted via CASCADE):', profileDeleteError);
      }

      // Delete user from auth.users (this will trigger mark_trial_before_user_deletion)
      // This ensures email is tracked in used_trials even if something goes wrong
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

      if (deleteUserError) {
        console.error('Delete account: Failed to delete user from auth.users:', deleteUserError);
        return new Response(JSON.stringify({ error: "Failed to delete user account" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log('Delete account: Account completely deleted. Email tracked in used_trials:', user.email);

      // Clear cookies
      return new Response(JSON.stringify({ success: true, message: 'Account completely deleted' }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": [
            "sb-access-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
            "sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
          ].join(", "),
        },
      });
    } catch (error) {
      console.error("Delete account error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

