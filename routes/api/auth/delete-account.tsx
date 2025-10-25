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
      console.log('Delete account: Attempting to delete user ID:', user.id);

      // Delete user from auth.users (cascade will delete profile and subscriptions)
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

      if (deleteError) {
        console.error("Delete user error:", deleteError);
        return new Response(JSON.stringify({ error: "Failed to delete account" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log('Delete account: User successfully deleted:', user.email);

      // Clear cookies
      return new Response(JSON.stringify({ success: true }), {
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

