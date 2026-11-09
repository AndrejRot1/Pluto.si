-- ============================================
-- PLUTO.SI - Migrate to usage-based trial (5 helps)
-- Zaženi v SQL Editorju OBSTOJEČEGA projekta
-- ============================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trial_helps_used INT NOT NULL DEFAULT 0;

-- Existing trial users keep status; counter starts at 0
-- Date-based trial_ends_at is kept for compatibility but no longer gates access

COMMENT ON COLUMN profiles.trial_helps_used IS
  'Number of successful AI helps used during free trial (limit = 5)';

SELECT 'Usage trial migration complete' AS status;
