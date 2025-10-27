-- ============================================
-- DEBUG REGISTRATION ISSUE
-- ============================================
-- Run this to see what's happening

-- 1. Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. Check last 5 users created
SELECT 
  email,
  created_at,
  id
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check last 5 profiles
SELECT 
  email,
  created_at,
  subscription_status,
  trial_ends_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- 5. Find users without profiles
SELECT 
  au.email,
  au.created_at as user_created,
  p.id as profile_exists
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;

-- 6. Test the function manually (replace 'YOUR_EMAIL@test.com' with a test email)
-- DON'T RUN THIS UNLESS YOU WANT TO TEST
/*
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('testpassword', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
*/

