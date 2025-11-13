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
      console.log('Delete account: Deleting profile (keeping auth.users) for ID:', user.id);

      // Delete related subscriptions first (optional, keep data clean)
      const { error: subsDeleteError } = await supabaseAdmin
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (subsDeleteError) {
        console.warn('Delete account: Could not delete subscriptions:', subsDeleteError);
      }

      // Delete profile row only, do NOT delete from auth.users
      const { error: profileDeleteError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileDeleteError) {
        console.error('Delete account: Failed to delete profile:', profileDeleteError);
        return new Response(JSON.stringify({ error: "Failed to delete profile" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log('Delete account: Profile deleted. Auth user retained:', user.email);

      // Clear cookies
      return new Response(JSON.stringify({ success: true, message: 'Profile deleted, auth user retained' }), {
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

