import { define } from "../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

export const handler = define.middleware(async (ctx) => {
  // Če je to auth stran, API ali trial-expired, dovoli dostop
  if (ctx.url.pathname.startsWith('/auth/') || ctx.url.pathname.startsWith('/api/') || ctx.url.pathname === '/trial-expired') {
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

  // Verify user with Supabase
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('Invalid session, redirecting to register');
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/auth/register',
        },
      });
    }

    // Get user profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('User authenticated:', user.email, 'Profile:', profile);

    // Store user and profile in context
    ctx.state.user = {
      id: user.id,
      email: user.email,
    };
    ctx.state.profile = profile;

    // Check if trial has expired (only if not on settings page)
    if (profile && ctx.url.pathname !== '/settings') {
      const trialEnded = profile.subscription_status === 'trial' && 
                         profile.trial_ends_at && 
                         new Date(profile.trial_ends_at) < new Date();
      
      const isExpired = profile.subscription_status === 'expired';

      if ((trialEnded || isExpired) && profile.subscription_status !== 'active') {
        console.log('Trial expired, redirecting to trial-expired page');
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/trial-expired',
          },
        });
      }
    }

    return await ctx.next();
  } catch (err) {
    console.error('Middleware error:', err);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth/register',
      },
    });
  }
});

