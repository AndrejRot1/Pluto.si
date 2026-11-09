-- ============================================
-- PLUTO.SI - Fresh Supabase Setup
-- Zaženi v SQL Editorju NOVEGA Supabase projekta
-- ============================================

-- 1. Profiles table
-- Trial is usage-based: 5 AI helps (trial_helps_used), not calendar days.
-- trial_ends_at is kept for compatibility / metadata only.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_helps_used INT NOT NULL DEFAULT 0,
  subscription_status TEXT DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'expired', 'canceled')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL
    CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Used trials (preprečevanje zlorabe)
CREATE TABLE IF NOT EXISTS used_trials (
  email TEXT PRIMARY KEY,
  first_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_used_trials_email ON used_trials(email);
ALTER TABLE used_trials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow trigger access to used_trials" ON used_trials;
CREATE POLICY "Allow trigger access to used_trials"
  ON used_trials FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Functions & triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION has_used_trial(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM used_trials WHERE email = email_to_check);
END;
$$;

CREATE OR REPLACE FUNCTION mark_trial_used(email_to_mark TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO used_trials (email, first_used_at)
  VALUES (email_to_mark, NOW())
  ON CONFLICT (email) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION simple_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF has_used_trial(NEW.email) THEN
    INSERT INTO profiles (id, email, trial_ends_at, trial_helps_used, subscription_status, created_at)
    VALUES (NEW.id, NEW.email, NOW(), 5, 'expired', COALESCE(NEW.created_at, NOW()))
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO profiles (id, email, trial_ends_at, trial_helps_used, subscription_status, created_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.created_at, NOW()),
      0,
      'trial',
      COALESCE(NEW.created_at, NOW())
    )
    ON CONFLICT (id) DO NOTHING;
    PERFORM mark_trial_used(NEW.email);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in simple_handle_new_user for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_profile_on_email_confirm()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
      IF has_used_trial(NEW.email) THEN
        INSERT INTO profiles (id, email, trial_ends_at, trial_helps_used, subscription_status, created_at)
        VALUES (NEW.id, NEW.email, NOW(), 5, 'expired', COALESCE(NEW.created_at, NOW()))
        ON CONFLICT (id) DO NOTHING;
      ELSE
        INSERT INTO profiles (id, email, trial_ends_at, trial_helps_used, subscription_status, created_at)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.created_at, NOW()),
          0,
          'trial',
          COALESCE(NEW.created_at, NOW())
        )
        ON CONFLICT (id) DO NOTHING;
        PERFORM mark_trial_used(NEW.email);
      END IF;
    END IF;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in create_profile_on_email_confirm for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION simple_handle_new_user();

DROP TRIGGER IF EXISTS create_profile_on_email_confirm_trigger ON auth.users;
CREATE TRIGGER create_profile_on_email_confirm_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION create_profile_on_email_confirm();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Learning progress events
CREATE TABLE IF NOT EXISTS learning_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL DEFAULT 'math'
    CHECK (subject IN ('math', 'physics', 'chemistry', 'biology')),
  topic TEXT,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('exercise_started', 'answer_checked', 'solution_viewed')),
  is_correct BOOLEAN,
  difficulty INT DEFAULT 1,
  duration_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_events_user_id ON learning_events(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_events_created_at ON learning_events(created_at DESC);

ALTER TABLE learning_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own learning events" ON learning_events;
CREATE POLICY "Users can view own learning events"
  ON learning_events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own learning events" ON learning_events;
CREATE POLICY "Users can insert own learning events"
  ON learning_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT, UPDATE ON subscriptions TO authenticated;
GRANT SELECT, INSERT ON used_trials TO service_role;
GRANT SELECT, INSERT ON learning_events TO authenticated;
GRANT SELECT, INSERT ON learning_events TO service_role;

-- 6. Verify
SELECT 'Setup complete' AS status, COUNT(*) AS trigger_count
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'create_profile_on_email_confirm_trigger');
