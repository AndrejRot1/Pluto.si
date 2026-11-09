-- ============================================
-- Subjects + Progress tracking
-- ============================================

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
CREATE INDEX IF NOT EXISTS idx_learning_events_subject ON learning_events(subject);
CREATE INDEX IF NOT EXISTS idx_learning_events_topic ON learning_events(topic);

ALTER TABLE learning_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own learning events" ON learning_events;
CREATE POLICY "Users can view own learning events"
  ON learning_events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own learning events" ON learning_events;
CREATE POLICY "Users can insert own learning events"
  ON learning_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON learning_events TO authenticated;
GRANT SELECT, INSERT ON learning_events TO service_role;

SELECT 'Subjects + progress migration complete' AS status;
