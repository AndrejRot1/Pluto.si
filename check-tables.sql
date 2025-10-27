-- ============================================
-- CHECK WHICH TABLES EXIST IN YOUR DATABASE
-- ============================================
-- Run this first to see what tables you have

-- Check if 'profiles' table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles')
    THEN 'profiles EXISTS ✓'
    ELSE 'profiles DOES NOT EXIST ✗'
  END as profiles_status;

-- Check if 'user_profiles' table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles')
    THEN 'user_profiles EXISTS ✓'
    ELSE 'user_profiles DOES NOT EXIST ✗'
  END as user_profiles_status;

-- List all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

