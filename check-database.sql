-- ============================================
-- CHECK DATABASE STATUS
-- ============================================
-- Run this to see what's in your database

-- 1. List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check if 'profiles' table exists and its structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check if 'user_profiles' table exists
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 4. Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 5. Check if function exists
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 6. Count users in auth.users
SELECT COUNT(*) as total_users FROM auth.users;

-- 7. Count profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- 8. Show recent users
SELECT 
  email,
  created_at,
  id
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 9. Show recent profiles
SELECT 
  email,
  created_at,
  subscription_status,
  trial_ends_at,
  id
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- 10. Find users without profiles
SELECT 
  au.email,
  au.created_at as user_created,
  au.id as user_id,
  p.id as profile_id
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;

