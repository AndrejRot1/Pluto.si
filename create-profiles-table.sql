-- ============================================
-- CREATE PROFILES TABLE IF IT DOESN'T EXIST
-- ============================================

-- Check what columns exist in profiles table
DO $$
BEGIN
  -- Check if 'profiles' table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE NOTICE 'Table "profiles" does not exist. Creating it...';
    
    CREATE TABLE profiles (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL,
      trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '3 days'),
      subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'canceled')),
      stripe_customer_id TEXT UNIQUE,
      stripe_subscription_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Add foreign key to auth.users
    ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Table "profiles" created successfully';
  ELSE
    RAISE NOTICE 'Table "profiles" exists. Checking columns...';
    
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'trial_ends_at') THEN
      ALTER TABLE profiles ADD COLUMN trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '3 days');
      RAISE NOTICE 'Added column "trial_ends_at"';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
      ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'trial';
      RAISE NOTICE 'Added column "subscription_status"';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
      ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
      RAISE NOTICE 'Added column "stripe_customer_id"';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_subscription_id') THEN
      ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
      RAISE NOTICE 'Added column "stripe_subscription_id"';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
      ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
      RAISE NOTICE 'Added column "created_at"';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
      ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
      RAISE NOTICE 'Added column "updated_at"';
    END IF;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Grant permissions
GRANT SELECT, UPDATE ON profiles TO authenticated;

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

