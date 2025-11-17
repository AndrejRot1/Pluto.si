-- ============================================
-- PREVENT TRIAL ABUSE - Even After Account Deletion
-- ============================================
-- This creates a separate table to track emails that have used trials
-- This table is NOT deleted when accounts are deleted, preventing abuse

-- 1. Create table to track used trials (separate from profiles)
CREATE TABLE IF NOT EXISTS used_trials (
  email TEXT PRIMARY KEY,
  first_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_used_trials_email ON used_trials(email);

-- 3. Enable RLS (but we'll allow SELECT for triggers)
ALTER TABLE used_trials ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow triggers to read and insert
DROP POLICY IF EXISTS "Allow trigger access to used_trials" ON used_trials;
CREATE POLICY "Allow trigger access to used_trials"
  ON used_trials FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Grant permissions to postgres role (for SECURITY DEFINER functions)
GRANT SELECT, INSERT ON used_trials TO postgres;
GRANT SELECT, INSERT ON used_trials TO service_role;

-- 6. Function to check if email has used trial
CREATE OR REPLACE FUNCTION has_used_trial(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trial_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM used_trials WHERE email = email_to_check
  ) INTO trial_exists;
  
  RETURN COALESCE(trial_exists, false);
END;
$$;

-- 7. Function to mark email as having used trial
CREATE OR REPLACE FUNCTION mark_trial_used(email_to_mark TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO used_trials (email, first_used_at)
  VALUES (email_to_mark, NOW())
  ON CONFLICT (email) DO NOTHING; -- Don't update if already exists
END;
$$;

-- 8. Update create_profile_after_email_confirm to check used_trials
CREATE OR REPLACE FUNCTION create_profile_after_email_confirm()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_profile RECORD;
  existing_user_profile RECORD;
  email_has_used_trial BOOLEAN;
BEGIN
  -- Wrap everything in exception handling to prevent trigger from failing email confirmation
  BEGIN
    -- Check if user just confirmed email (email_confirmed_at changed from NULL to NOT NULL)
    IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
      
      -- Check if profile already exists for this user
      BEGIN
        SELECT * INTO existing_profile
        FROM profiles
        WHERE id = NEW.id
        LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        existing_profile := NULL;
        RAISE WARNING 'Could not check existing profile for user %: %', NEW.email, SQLERRM;
      END;
      
      -- If profile exists, don't do anything
      IF existing_profile IS NOT NULL THEN
        RAISE NOTICE 'Profile already exists for user %, skipping', NEW.email;
        RETURN NEW;
      END IF;
      
      -- CRITICAL: Check if email has EVER used a trial (even if account was deleted)
      BEGIN
        SELECT has_used_trial(NEW.email) INTO email_has_used_trial;
      EXCEPTION WHEN OTHERS THEN
        email_has_used_trial := false; -- If check fails, assume no trial used (safer)
        RAISE WARNING 'Could not check used_trials for user %: %', NEW.email, SQLERRM;
      END;
      
      -- If email has used trial before, don't give new trial
      IF email_has_used_trial THEN
        RAISE NOTICE 'Email % has already used trial, creating profile without trial', NEW.email;
        
        -- Create profile WITHOUT trial (status = 'expired')
        BEGIN
          INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
          VALUES (
            NEW.id,
            NEW.email,
            NOW(), -- No trial, expired immediately
            'expired', -- User already used their trial
            NOW()
          )
          ON CONFLICT (id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Error creating profile without trial for user %: %', NEW.email, SQLERRM;
        END;
        
        RETURN NEW;
      END IF;
      
      -- Check if ANY profile exists with this email (backup check)
      BEGIN
        SELECT * INTO existing_user_profile
        FROM profiles
        WHERE email = NEW.email
        LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        existing_user_profile := NULL;
        RAISE WARNING 'Could not check existing email profile for user %: %', NEW.email, SQLERRM;
      END;
      
      -- If profile with this email exists, don't give new trial
      IF existing_user_profile IS NOT NULL THEN
        RAISE NOTICE 'User % already had a profile, creating profile without trial', NEW.email;
        
        -- Mark as used trial
        BEGIN
          PERFORM mark_trial_used(NEW.email);
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Could not mark trial as used for user %: %', NEW.email, SQLERRM;
        END;
        
        -- Create profile WITHOUT trial
        BEGIN
          INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
          VALUES (
            NEW.id,
            NEW.email,
            NOW(),
            'expired',
            NOW()
          )
          ON CONFLICT (id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Error creating profile without trial for user %: %', NEW.email, SQLERRM;
        END;
        
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
        
        -- Mark email as having used trial
        BEGIN
          PERFORM mark_trial_used(NEW.email);
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Could not mark trial as used for user %: %', NEW.email, SQLERRM;
        END;
        
        RAISE NOTICE 'Profile created for new confirmed user: % with trial', NEW.email;
        
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error creating profile for user %: % (SQLSTATE: %)', NEW.email, SQLERRM, SQLSTATE;
      END;
    END IF;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in create_profile_after_email_confirm for user %: % (SQLSTATE: %)', NEW.email, SQLERRM, SQLSTATE;
  END;
  
  RETURN NEW;
END;
$$;

-- 9. Update simple_handle_new_user to also check used_trials
CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_email_profile RECORD;
  email_has_used_trial BOOLEAN;
  v_error_message TEXT;
BEGIN
  BEGIN
    -- CRITICAL: Check if email has EVER used a trial (even if account was deleted)
    BEGIN
      SELECT has_used_trial(NEW.email) INTO email_has_used_trial;
    EXCEPTION WHEN OTHERS THEN
      email_has_used_trial := false;
      RAISE WARNING 'Could not check used_trials for user %: %', NEW.email, SQLERRM;
    END;
    
    -- If email has used trial, don't create profile with trial
    IF email_has_used_trial THEN
      RAISE NOTICE 'Email % has already used trial, skipping profile creation', NEW.email;
      RETURN NEW;
    END IF;
    
    -- Check if ANY profile exists with this email (backup check)
    BEGIN
      SELECT * INTO existing_email_profile
      FROM profiles
      WHERE email = NEW.email
      LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      existing_email_profile := NULL;
      RAISE WARNING 'Could not check existing email profile for user %: %', NEW.email, SQLERRM;
    END;
    
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
    
    -- Mark email as having used trial (even if not confirmed yet)
    BEGIN
      PERFORM mark_trial_used(NEW.email);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Could not mark trial as used for user %: %', NEW.email, SQLERRM;
    END;
    
    RAISE NOTICE 'Trigger executed for new user: %', NEW.email;
    
  EXCEPTION WHEN OTHERS THEN
    v_error_message := SQLERRM;
    RAISE WARNING 'Error in simple_handle_new_user for user %: %', NEW.email, v_error_message;
  END;
  
  RETURN NEW;
END;
$$;

-- 10. Create trigger to mark email as used trial BEFORE account deletion
-- This ensures email is tracked even if account is deleted
CREATE OR REPLACE FUNCTION mark_trial_before_user_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark email as having used trial before user is deleted
  -- This prevents user from getting new trial after account deletion
  IF OLD.email IS NOT NULL THEN
    BEGIN
      PERFORM mark_trial_used(OLD.email);
      RAISE NOTICE 'Marked email % as used trial before account deletion', OLD.email;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Could not mark trial as used for % before deletion: %', OLD.email, SQLERRM;
    END;
  END IF;
  
  RETURN OLD;
END;
$$;

-- Create trigger on auth.users BEFORE DELETE
DROP TRIGGER IF EXISTS mark_trial_before_user_deletion ON auth.users;
CREATE TRIGGER mark_trial_before_user_deletion
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION mark_trial_before_user_deletion();

-- 12. Migrate existing profiles to used_trials (one-time migration)
-- This marks all existing emails as having used trial
INSERT INTO used_trials (email, first_used_at, created_at)
SELECT DISTINCT email, created_at, created_at
FROM profiles
WHERE email IS NOT NULL
ON CONFLICT (email) DO NOTHING;

-- 13. Verify setup
SELECT 
  'used_trials table created' as status,
  COUNT(*) as existing_trials_tracked
FROM used_trials;

SELECT 'Trial abuse prevention setup complete!' as status;

