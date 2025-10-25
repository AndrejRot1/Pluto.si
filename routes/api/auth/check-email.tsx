import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { email } = body;

      if (!email) {
        return Response.json({ error: 'Email required' }, { status: 400 });
      }

      if (!supabaseServiceKey) {
        console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
        // Don't block registration if service key not configured
        return Response.json({ exists: false });
      }

      // Use service role to check if user exists
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();

      if (error) {
        console.error('Error checking email:', error);
        // Don't block registration on error
        return Response.json({ exists: false });
      }

      // Check if email exists in users list
      const userExists = data.users.some(user => user.email === email);

      return Response.json({ exists: userExists });
    } catch (error: any) {
      console.error('Check email handler error:', error);
      // Don't block registration on error
      return Response.json({ exists: false });
    }
  },
});

