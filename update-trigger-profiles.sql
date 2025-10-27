-- ============================================
-- UPDATE TRIGGER TO USE 'profiles' TABLE
-- ============================================
-- Fix the simple_handle_new_user function to use 'profiles'

CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to create profile in 'profiles' table
  INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.created_at, NOW()) + INTERVAL '3 days',
    'trial',
    COALESCE(NEW.created_at, NOW())
  )
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Trigger executed for user: %', NEW.email;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in simple_handle_new_user for user %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is on 'profiles'
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION simple_handle_new_user();

-- Verify trigger exists and uses 'profiles'
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

