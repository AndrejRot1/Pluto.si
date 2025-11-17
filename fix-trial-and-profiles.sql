-- ============================================
-- FIX: Prevent multiple trials + auto-create profile
-- ============================================

-- 1. Function to create profile ONLY if user never had one before
CREATE OR REPLACE FUNCTION create_profile_after_email_confirm()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
  existing_user_profile RECORD;
BEGIN
  -- Check if user just confirmed email (email_confirmed_at changed from NULL to NOT NULL)
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    
    -- Check if profile already exists for this user
    SELECT * INTO existing_profile
    FROM profiles
    WHERE id = NEW.id
    LIMIT 1;
    
    -- If profile exists, don't do anything
    IF existing_profile IS NOT NULL THEN
      RAISE NOTICE 'Profile already exists for user %, skipping', NEW.email;
      RETURN NEW;
    END IF;
    
    -- Check if ANY profile exists with this email (to prevent new trial)
    SELECT * INTO existing_user_profile
    FROM profiles
    WHERE email = NEW.email
    LIMIT 1;
    
    -- If profile with this email exists, don't give new trial (user already had one)
    IF existing_user_profile IS NOT NULL THEN
      RAISE NOTICE 'User % already had a profile, creating profile without trial', NEW.email;
      
      -- Create profile WITHOUT trial (status = 'expired')
      INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
      VALUES (
        NEW.id,
        NEW.email,
        NOW(), -- No trial, expired immediately
        'expired', -- User already used their trial
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
      
      RETURN NEW;
    END IF;
    
    -- First time user - create profile WITH trial
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
      
      RAISE NOTICE '✅ Profile created for new confirmed user: % with trial', NEW.email;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '❌ Error creating profile for user %: %', NEW.email, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function for initial signup (before email confirmation)
CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_email_profile RECORD;
BEGIN
  -- Check if ANY profile exists with this email (to prevent new trial)
  SELECT * INTO existing_email_profile
  FROM profiles
  WHERE email = NEW.email
  LIMIT 1;
  
  -- If profile with this email exists, don't create profile (wait for email confirmation)
  IF existing_email_profile IS NOT NULL THEN
    RAISE NOTICE 'User % already had a profile, skipping profile creation until email confirmation', NEW.email;
    RETURN NEW;
  END IF;
  
  -- First time user - create profile with trial (will be confirmed after email verification)
  INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW() + INTERVAL '3 days',
    'trial',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Trigger executed for new user: %', NEW.email;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in simple_handle_new_user for user %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate triggers
DROP TRIGGER IF EXISTS profile_after_email_confirm ON auth.users;
CREATE TRIGGER profile_after_email_confirm
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at))
  EXECUTE FUNCTION create_profile_after_email_confirm();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION simple_handle_new_user();

-- 4. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger for updated_at on profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Verify triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth'
ORDER BY trigger_name;

SELECT '✅ Triggers updated! Profiles will be created correctly.' as status;

