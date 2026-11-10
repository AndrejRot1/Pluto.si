-- ============================================
-- Pluto.si — secure billing + subscriptions table
-- Run in Supabase SQL Editor (re-run safe)
-- ============================================

-- 1) Subscriptions table (Stripe webhook target)
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

-- 2) Profiles: allow SELECT only for users (no client UPDATE)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 3) Freeze billing fields unless JWT role is service_role
-- IMPORTANT: do NOT use current_user here — SECURITY DEFINER runs as postgres,
-- so current_user would always look like postgres and incorrectly allow updates.
CREATE OR REPLACE FUNCTION protect_profile_billing_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW.subscription_status := OLD.subscription_status;
  NEW.trial_helps_used := OLD.trial_helps_used;
  NEW.trial_ends_at := OLD.trial_ends_at;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_billing_fields_trigger ON profiles;
CREATE TRIGGER protect_profile_billing_fields_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_billing_fields();

COMMENT ON COLUMN profiles.trial_helps_used IS
  'Number of free AI helps used. Limit is 10 while subscription_status = trial.';

SELECT
  'migrate-secure-billing applied' AS status,
  (SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'subscriptions') AS subscriptions_table,
  (SELECT COUNT(*) FROM pg_policies
     WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') AS user_update_policies;
