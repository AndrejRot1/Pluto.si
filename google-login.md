# Google Login Setup - Pluto.si

## 1. Supabase OAuth Configuration

### A. Enable Google Provider in Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle it **ON**
6. You'll need:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

### B. Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create new project OR select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   https://vbmtvnqnpsbgnxasejcg.supabase.co/auth/v1/callback
   http://localhost:8000/auth/v1/callback (for local testing)
   ```
7. Copy **Client ID** and **Client Secret**
8. Paste into Supabase **Authentication** → **Providers** → **Google**

---

## 2. Update Trigger for OAuth Users

Run this SQL in Supabase SQL Editor:

```sql
-- Update trigger to handle OAuth users (Google, etc.)
CREATE OR REPLACE FUNCTION create_profile_after_email_confirm()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle both email confirmation AND OAuth signup (Google, etc.)
  -- OAuth users have email_confirmed_at set immediately
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    
    BEGIN
      INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
      VALUES (
        NEW.id,
        NEW.email,
        NOW() + INTERVAL '3 days',
        'trial',
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
      
      RAISE NOTICE '✅ Profile created for user: %', NEW.email;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '❌ Error creating profile for user %: %', NEW.email, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. Add Google Login Button

Create new file: `islands/GoogleLogin.tsx`

```tsx
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vbmtvnqnpsbgnxasejcg.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GoogleLogin() {
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      console.error('Google login error:', error);
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  );
}
```

---

## 4. Add OAuth Callback Handler

Create: `routes/auth/callback.tsx`

```tsx
import { define } from "../../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function OAuthCallback() {
  return (
    <>
      <Head>
        <title>Prijava • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script dangerouslySetInnerHTML={{__html: `
          // Parse hash params from Supabase OAuth redirect
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            // Store tokens in cookies
            document.cookie = \`sb-access-token=\${accessToken}; Path=/; Max-Age=3600; SameSite=Lax\`;
            document.cookie = \`sb-refresh-token=\${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax\`;
            
            // Redirect to app
            setTimeout(() => {
              window.location.href = '/app';
            }, 1000);
          } else {
            // Error
            document.getElementById('status').innerHTML = 'Error during login';
          }
        `}} />
      </Head>
      
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 class="text-xl font-bold text-gray-900">Prijaš...</h2>
          <p id="status">Prosimo počakajte</p>
        </div>
      </div>
    </>
  );
});
```

---

## 5. Update Registration/Login Forms

Add Google login button to:
- `islands/RegisterForm.tsx`
- `islands/LoginForm.tsx`

Import and use the GoogleLogin component:

```tsx
import GoogleLogin from "./GoogleLogin.tsx";

// In the form JSX:
<div class="relative my-6">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-gray-300"></div>
  </div>
  <div class="relative flex justify-center text-sm">
    <span class="px-2 bg-white text-gray-500">ali</span>
  </div>
</div>

<GoogleLogin />
```

---

## 6. Testing

1. Run: `trigger-only-after-email-confirm.sql` in Supabase
2. Restart your Deno server
3. Go to `/auth/register`
4. Click "Continue with Google"
5. Sign in with Google
6. Check `profiles` table - should have new user with trial

---

## 7. Cost Considerations

- **Google OAuth**: Free
- **Trial**: Still 3 days for all users
- **DeepSeek API**: Same cost per user
- **No additional costs**

---

## 8. Security Notes

- Uses secure OAuth 2.0 flow
- Tokens stored in HttpOnly cookies
- Same security as email/password registration
- Profile created automatically via trigger

---

**Ready to implement?**

