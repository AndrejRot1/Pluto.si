-- ============================================
-- COMPLETE FIX FOR SUPABASE
-- ============================================
-- Run this script to fix all table name issues
-- This replaces profiles → user_profiles everywhere

-- 1. Fix the is_trial_expired function
CREATE OR REPLACE FUNCTION is_trial_expired(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT subscription_status, trial_ends_at
  INTO profile_record
  FROM profiles
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

-- 2. Fix the handle_new_user function (same as fix_trigger.sql)
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
  
  -- If profile exists, don't create new trial
  IF existing_profile IS NOT NULL THEN
    RAISE NOTICE 'User % already has a profile, no new trial granted', NEW.email;
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

-- 3. Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 4. Fix updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Fix subscription policy (drop first if exists, then recreate)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 6. Fix grants (drop first if exists)
REVOKE ALL ON profiles FROM authenticated;
GRANT SELECT, UPDATE ON profiles TO authenticated;

