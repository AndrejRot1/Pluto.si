import { define } from "../../utils.ts";
import { supabase } from "../../utils/supabase.ts";

export const handler = define.handlers({
  async GET(ctx) {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear cookies and redirect to register page
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/auth/register',
        'Set-Cookie': [
          'sb-access-token=; Path=/; Max-Age=0',
          'sb-refresh-token=; Path=/; Max-Age=0',
        ].join(', '),
      },
    });
  },
});

