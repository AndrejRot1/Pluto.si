-- ============================================
-- PLUTO.SI - Supabase Database Schema
-- ============================================

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '3 days'),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'canceled')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON user_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if user's trial has expired
CREATE OR REPLACE FUNCTION is_trial_expired(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT subscription_status, trial_ends_at
  INTO profile_record
  FROM user_profiles
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN TRUE; -- No profile = expired
  END IF;
  
  -- If user has active subscription, trial doesn't matter
  IF profile_record.subscription_status = 'active' THEN
    RETURN FALSE;
  END IF;
  
  -- If trial status and trial period ended
  IF profile_record.subscription_status = 'trial' AND profile_record.trial_ends_at < NOW() THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
BEGIN
  -- Check if profile already exists
  SELECT * INTO existing_profile
  FROM profiles
  WHERE email = NEW.email
  LIMIT 1;
  
  -- If profile exists and trial has expired, don't create new trial
  IF existing_profile IS NOT NULL THEN
    -- Check if previous trial has expired
    IF existing_profile.trial_ends_at < NOW() AND existing_profile.subscription_status != 'active' THEN
      -- User already used their trial, don't give them another one
      RAISE NOTICE 'User % attempted to register again but trial already expired at %', NEW.email, existing_profile.trial_ends_at;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Create new profile with trial (first time registration)
  INSERT INTO profiles (id, email, trial_ends_at, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    NOW() + INTERVAL '3 days',
    'trial'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Update existing users to have profiles (if any exist)
-- INSERT INTO user_profiles (id, email, trial_ends_at)
-- SELECT id, email, NOW() + INTERVAL '3 days'
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM user_profiles)
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- GRANTS (for authenticated users)
-- ============================================

GRANT SELECT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT ON subscriptions TO authenticated;

-- ============================================
-- NOTES
-- ============================================
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Make sure to enable RLS in Supabase Dashboard → Authentication → Policies
-- 3. Set up Stripe webhook endpoint: /api/stripe/webhook
-- 4. Add environment variables in Deno Deploy:
--    - SUPABASE_URL
--    - SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY (for admin operations)
--    - STRIPE_SECRET_KEY
--    - STRIPE_WEBHOOK_SECRET

