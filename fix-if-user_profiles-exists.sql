-- ============================================
-- FIX IF TABLE IS ALREADY CALLED "user_profiles"
-- ============================================
-- Run this if your table is already "user_profiles" but functions are broken

-- 1. Fix the handle_new_user() function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
BEGIN
  SELECT * INTO existing_profile
  FROM user_profiles
  WHERE email = NEW.email
  LIMIT 1;
  
  IF existing_profile IS NOT NULL THEN
    RAISE NOTICE 'User % already has a profile, no new trial granted', NEW.email;
    RETURN NEW;
  END IF;
  
  INSERT INTO user_profiles (id, email, trial_ends_at, subscription_status)
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

-- 2. Fix is_trial_expired() function
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
    RETURN TRUE;
  END IF;
  
  IF profile_record.subscription_status = 'active' THEN
    RETURN FALSE;
  END IF;
  
  IF profile_record.subscription_status = 'trial' AND profile_record.trial_ends_at < NOW() THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fix trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 4. Fix subscription policy
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Fix grants
REVOKE ALL ON profiles FROM authenticated;
GRANT SELECT, UPDATE ON user_profiles TO authenticated;

