-- ============================================
-- COMPLETE REGISTRATION FIX
-- ============================================
-- Run this in Supabase SQL Editor

-- STEP 1: Drop everything first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS is_trial_expired(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- STEP 2: Create update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Create is_trial_expired function
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

-- STEP 4: Create handle_new_user function
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
    RAISE NOTICE 'User % already has a profile, skipping profile creation', NEW.email;
    RETURN NEW;
  END IF;
  
  -- Create new profile with trial
  BEGIN
    INSERT INTO profiles (id, email, trial_ends_at, subscription_status)
    VALUES (
      NEW.id,
      NEW.email,
      NOW() + INTERVAL '3 days',
      'trial'
    );
    RAISE NOTICE 'Created profile for user % with trial', NEW.email;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile for user %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- STEP 6: Create updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- STEP 7: Fix subscription policy
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- STEP 8: Fix grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, UPDATE ON subscriptions TO authenticated;

-- STEP 9: Verify it worked
SELECT 
  'Functions created successfully' as status,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

