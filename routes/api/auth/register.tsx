import { define } from "../../../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handler = define.handlers({
  async POST(ctx) {
    const body = await ctx.req.json();
    const { email, password } = body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // If email confirmation is disabled, user gets session immediately
    if (data.session) {
      const headers = new Headers();
      headers.append('Set-Cookie', `sb-access-token=${data.session.access_token}; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax`);
      headers.append('Set-Cookie', `sb-refresh-token=${data.session.refresh_token}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`);
      headers.append('Content-Type', 'application/json');

      return new Response(
        JSON.stringify({ success: true, hasSession: true, user: data.user }),
        { headers }
      );
    }

    // Email confirmation required
    return Response.json({ success: true, hasSession: false, message: 'Preverite email za potrditev' });
  },
});

