import { define } from "../utils.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibXR2bnFucHNiZ254YXNlamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTk2OTAsImV4cCI6MjA3NjU3NTY5MH0.qVtDmSgAaEwYVAi8LKSXZbfKt02HU3A_fV1QC0-bESs';

export const handler = define.middleware(async (ctx) => {
  // Dovoli dostop do javnih strani (auth, api, trial-expired)
  const publicPaths = ['/auth/', '/api/', '/trial-expired'];
  if (publicPaths.some(path => ctx.url.pathname.startsWith(path) || ctx.url.pathname === path)) {
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

    // Check if trial has expired
    if (profile) {
      const now = new Date();
      const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
      const trialEnded = profile.subscription_status === 'trial' && 
                         trialEndsAt && 
                         trialEndsAt < now;
      
      // Auto-update status to 'expired' if trial has ended
      if (trialEnded) {
        console.log('Trial expired, updating status to expired');
        await supabase
          .from('profiles')
          .update({ subscription_status: 'expired' })
          .eq('id', user.id);
        
        // Update local profile object
        profile.subscription_status = 'expired';
        ctx.state.profile = profile;
      }
      
      const isExpired = profile.subscription_status === 'expired';
      const hasActiveSubscription = profile.subscription_status === 'active';

      // Redirect to trial-expired page (except for settings page where they can upgrade)
      if (isExpired && !hasActiveSubscription && ctx.url.pathname !== '/settings') {
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

