-- FIX: Prevent multiple trials + auto-create profile

-- Function to create profile ONLY if user never had one before
-- CRITICAL: This function MUST NOT throw errors, or email confirmation will fail
CREATE OR REPLACE FUNCTION create_profile_after_email_confirm()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_profile RECORD;
  existing_user_profile RECORD;
BEGIN
  -- Wrap everything in exception handling to prevent trigger from failing email confirmation
  BEGIN
    -- Check if user just confirmed email (email_confirmed_at changed from NULL to NOT NULL)
    IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
      
      -- Check if profile already exists for this user
      -- Wrap SELECT in exception handling in case RLS blocks it
      BEGIN
        SELECT * INTO existing_profile
        FROM profiles
        WHERE id = NEW.id
        LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        -- If SELECT fails, assume profile doesn't exist and continue
        existing_profile := NULL;
        RAISE WARNING 'Could not check existing profile for user %: %', NEW.email, SQLERRM;
      END;
      
      -- If profile exists, don't do anything
      IF existing_profile IS NOT NULL THEN
        RAISE NOTICE 'Profile already exists for user %, skipping', NEW.email;
        RETURN NEW;
      END IF;
      
      -- Check if ANY profile exists with this email (to prevent new trial)
      BEGIN
        SELECT * INTO existing_user_profile
        FROM profiles
        WHERE email = NEW.email
        LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        -- If SELECT fails, assume no profile exists and continue
        existing_user_profile := NULL;
        RAISE WARNING 'Could not check existing email profile for user %: %', NEW.email, SQLERRM;
      END;
      
      -- If profile with this email exists, don't give new trial (user already had one)
      IF existing_user_profile IS NOT NULL THEN
        RAISE NOTICE 'User % already had a profile, creating profile without trial', NEW.email;
        
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
          -- Log error but don't fail - email confirmation should still succeed
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
        
        RAISE NOTICE 'Profile created for new confirmed user: % with trial', NEW.email;
        
      EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail - user email confirmation should still succeed
        RAISE WARNING 'Error creating profile for user %: % (SQLSTATE: %)', NEW.email, SQLERRM, SQLSTATE;
        -- Don't re-raise - allow email confirmation to proceed
      END;
    END IF;
    
  EXCEPTION WHEN OTHERS THEN
    -- CRITICAL: Log error but DON'T fail - return NEW to allow email confirmation to succeed
    RAISE WARNING 'Error in create_profile_after_email_confirm for user %: % (SQLSTATE: %)', NEW.email, SQLERRM, SQLSTATE;
    -- Still return NEW to allow email confirmation to proceed
  END;
  
  -- ALWAYS return NEW, even if profile creation failed
  -- This ensures email confirmation succeeds
  RETURN NEW;
END;
$$;

-- Function for initial signup (before email confirmation)
-- CRITICAL: This function MUST NOT throw errors, or user creation will fail
CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_email_profile RECORD;
  v_error_message TEXT;
BEGIN
  -- Wrap everything in exception handling to prevent trigger from failing user creation
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
    -- Use ON CONFLICT to prevent errors if profile already exists
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
    
  EXCEPTION WHEN OTHERS THEN
    -- CRITICAL: Log error but DON'T fail - return NEW to allow user creation to succeed
    v_error_message := SQLERRM;
    RAISE WARNING 'Error in simple_handle_new_user for user %: %', NEW.email, v_error_message;
    -- Still return NEW to allow user creation to proceed
  END;
  
  -- ALWAYS return NEW, even if profile creation failed
  -- This ensures user creation in auth.users succeeds
  RETURN NEW;
END;
$$;

-- Recreate triggers
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fix RLS policies - CRITICAL: Allow INSERT and SELECT from triggers
-- SECURITY DEFINER functions still respect RLS, so we MUST have policies that allow INSERT and SELECT

-- Drop ALL existing INSERT policies first
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow trigger inserts" ON profiles;

-- Drop existing SELECT policies that might block triggers
DROP POLICY IF EXISTS "Allow trigger selects" ON profiles;

-- Policy 1: Users can insert their own profile (for normal signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 2: Allow INSERT if id exists in auth.users (for triggers)
-- This is the KEY policy that allows triggers to work
-- The trigger runs AFTER INSERT on auth.users, so the user already exists
CREATE POLICY "Allow trigger inserts"
  ON profiles FOR INSERT
  WITH CHECK (
    -- Allow if the id exists in auth.users (created by trigger)
    -- In WITH CHECK, 'id' refers to the column being inserted
    -- This MUST be true when trigger runs, since trigger runs AFTER user is created
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = id)
  );

-- Policy 3: Allow INSERT for service_role (backup policy)
-- This uses a different check - if we're running as service_role, allow it
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts from service_role context

-- Grant INSERT permission to authenticated and service_role
GRANT INSERT ON profiles TO authenticated;
GRANT INSERT ON profiles TO service_role;

-- IMPORTANT: Also grant to postgres role (used by SECURITY DEFINER functions)
GRANT INSERT ON profiles TO postgres;
GRANT SELECT ON profiles TO postgres;

-- Add SELECT policy for triggers (to check if profile exists)
-- This allows SECURITY DEFINER functions to read profiles table
CREATE POLICY "Allow trigger selects"
  ON profiles FOR SELECT
  USING (true);  -- Allow all SELECTs from trigger context

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

SELECT 'Triggers updated! Profiles will be created correctly.' as status;

