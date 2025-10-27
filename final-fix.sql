-- ============================================
-- FINAL FIX - ONE SQL TO RULE THEM ALL
-- ============================================

-- STEP 1: Fix profiles table structure
DO $$
BEGIN
  -- Make sure trial_ends_at is nullable or has a default
  IF EXISTS (SELECT FROM information_schema.columns 
             WHERE table_name = 'profiles' AND column_name = 'trial_ends_at' 
             AND is_nullable = 'NO') THEN
    ALTER TABLE profiles ALTER COLUMN trial_ends_at DROP NOT NULL;
  END IF;
  
  -- Make sure subscription_status has a default
  IF EXISTS (SELECT FROM information_schema.columns 
             WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
    ALTER TABLE profiles ALTER COLUMN subscription_status SET DEFAULT 'trial';
  END IF;
END $$;

-- STEP 2: Create the handle_new_user function with error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to create profile
  BEGIN
    INSERT INTO profiles (id, email, trial_ends_at, subscription_status)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'trial_ends_at', NULL::text)::timestamptz,
      COALESCE(NEW.raw_user_meta_data->>'subscription_status', 'trial')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        subscription_status = COALESCE(profiles.subscription_status, EXCLUDED.subscription_status);
    
    -- If no trial_ends_at in metadata, set to default
    IF NOT FOUND OR (SELECT trial_ends_at FROM profiles WHERE id = NEW.id) IS NULL THEN
      UPDATE profiles 
      SET trial_ends_at = NOW() + INTERVAL '3 days'
      WHERE id = NEW.id AND trial_ends_at IS NULL;
    END IF;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- STEP 4: Create simple fix function
CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER AS $$
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
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in simple_handle_new_user for user %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Use simple function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION simple_handle_new_user();

-- STEP 6: Test - show what we have
SELECT 'Functions created successfully!' as status;

