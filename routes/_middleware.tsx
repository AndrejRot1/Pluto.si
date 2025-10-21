import { define } from "../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

export const handler = define.middleware(async (ctx) => {
  // Če je to auth stran ali API, dovoli dostop
  if (ctx.url.pathname.startsWith('/auth/') || ctx.url.pathname.startsWith('/api/')) {
    return await ctx.next();
  }
  
  // Preveri session cookie
  const authCookie = ctx.req.headers.get('cookie');
  
  if (!authCookie) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth/register',
      },
    });
  }

  // Parse cookies to get session tokens
  const cookies = Object.fromEntries(
    authCookie.split(';').map(c => {
      const [key, ...v] = c.trim().split('=');
      return [key, v.join('=')];
    })
  );

  const accessToken = cookies['sb-access-token'];
  const refreshToken = cookies['sb-refresh-token'];

  console.log('Cookies found:', { 
    hasAccessToken: !!accessToken, 
    hasRefreshToken: !!refreshToken 
  });

  if (!accessToken && !refreshToken) {
    console.log('No auth cookies, redirecting to register');
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth/register',
      },
    });
  }

  // For now, just check if cookie exists - skip Supabase verification to debug
  // If cookie exists, assume user is authenticated
  console.log('Auth cookie exists, allowing access');
  
  // Store a mock user in context (we'll verify properly later)
  ctx.state.user = {
    email: 'authenticated@user.com' // placeholder
  };
  
  return await ctx.next();
});

