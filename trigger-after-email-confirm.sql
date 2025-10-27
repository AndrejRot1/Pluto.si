-- ============================================
-- CREATE TRIGGER AFTER EMAIL CONFIRMATION
-- ============================================
-- This trigger creates a profile when user confirms their email

-- Function to create profile after email confirmation
CREATE OR REPLACE FUNCTION create_profile_on_email_confirm()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if email was just confirmed (was NULL, now has value)
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    BEGIN
      -- Try to create profile
      INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.created_at, NOW()) + INTERVAL '3 days',
        'trial',
        COALESCE(NEW.created_at, NOW())
      )
      ON CONFLICT (id) DO NOTHING;
      
      RAISE NOTICE 'Profile created for user % after email confirmation', NEW.email;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error creating profile for user %: %', NEW.email, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on UPDATE (when email gets confirmed)
DROP TRIGGER IF EXISTS create_profile_on_email_confirm_trigger ON auth.users;
CREATE TRIGGER create_profile_on_email_confirm_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION create_profile_on_email_confirm();

-- Also keep the simple_handle_new_user for initial signup
CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

-- Ensure trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION simple_handle_new_user();

-- Verify triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth'
ORDER BY trigger_name;

