-- ============================================
-- MIGRATE FROM "profiles" TO "user_profiles"
-- ============================================
-- Run this only if your table is called "profiles"

-- 1. Rename existing table
ALTER TABLE IF EXISTS profiles RENAME TO user_profiles;

-- 2. Update any indexes
ALTER INDEX IF EXISTS idx_user_profiles_email RENAME TO idx_user_profiles_email;
ALTER INDEX IF EXISTS idx_user_profiles_stripe_customer RENAME TO idx_user_profiles_stripe_customer;

-- 3. Fix the handle_new_user() function
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

-- 4. Fix is_trial_expired() function
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

-- 5. Fix trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 6. Fix updated_at trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Fix grants
REVOKE ALL ON profiles FROM authenticated;
GRANT SELECT, UPDATE ON user_profiles TO authenticated;

