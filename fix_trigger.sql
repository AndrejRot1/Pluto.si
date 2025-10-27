-- Fix: handle_new_user() should insert into correct table name
-- This function creates a profile when a new user signs up

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
BEGIN
  -- Check if profile already exists with this email in user_profiles table
  SELECT * INTO existing_profile
  FROM user_profiles
  WHERE email = NEW.email
  LIMIT 1;
  
  -- If profile exists, don't create new trial
  IF existing_profile IS NOT NULL THEN
    RAISE NOTICE 'User % already has a profile, no new trial granted', NEW.email;
    RETURN NEW;
  END IF;
  
  -- Create new profile with trial (first time registration only)
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

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

