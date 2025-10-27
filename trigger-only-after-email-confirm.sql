-- ============================================
-- TRIGGER ONLY AFTER EMAIL CONFIRMATION
-- ============================================
-- This creates profile ONLY when email is confirmed

-- Drop all existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS create_profile_on_email_confirm_trigger ON auth.users;
DROP TRIGGER IF EXISTS profile_after_email_confirm ON auth.users;

-- Function to create profile ONLY after email confirmation
CREATE OR REPLACE FUNCTION create_profile_after_email_confirm()
RETURNS TRIGGER AS $$
BEGIN
  -- This trigger fires when email_confirmed_at changes from NULL to NOT NULL
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    
    BEGIN
      -- Create profile with 3-day trial
      INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
      VALUES (
        NEW.id,
        NEW.email,
        NOW() + INTERVAL '3 days',
        'trial',
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
      
      RAISE NOTICE '✅ Profile created for confirmed user: %', NEW.email;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '❌ Error creating profile for user %: %', NEW.email, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on UPDATE (when email gets confirmed)
CREATE TRIGGER profile_after_email_confirm
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at))
  EXECUTE FUNCTION create_profile_after_email_confirm();

-- Verify trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'profile_after_email_confirm';

-- Test message
SELECT 'Trigger created! Profile will be created ONLY after email confirmation.' as status;
