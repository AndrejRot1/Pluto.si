import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { email, password } = body;

      console.log('Login attempt for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return Response.json({ error: error.message }, { status: 400 });
      }

      if (!data.session) {
        console.error('No session returned for user:', email);
        return Response.json({ error: 'No session returned' }, { status: 400 });
      }

      console.log('Login successful for:', email);

      // Set cookies via Set-Cookie header
      // Secure flag only on production (HTTPS)
      const isProduction = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined;
      const secureFlag = isProduction ? ' Secure;' : '';
      
      const headers = new Headers();
      headers.append('Set-Cookie', `sb-access-token=${data.session.access_token}; Path=/; Max-Age=3600; HttpOnly;${secureFlag} SameSite=Lax`);
      headers.append('Set-Cookie', `sb-refresh-token=${data.session.refresh_token}; Path=/; Max-Age=604800; HttpOnly;${secureFlag} SameSite=Lax`);
      headers.append('Content-Type', 'application/json');
      
      console.log('Cookies set with Secure flag:', isProduction);

      return new Response(
        JSON.stringify({ success: true, user: data.user }),
        { headers }
      );
    } catch (error: any) {
      console.error('Login handler error:', error);
      return Response.json({ error: error?.message || 'Internal server error' }, { status: 500 });
    }
  },
});

