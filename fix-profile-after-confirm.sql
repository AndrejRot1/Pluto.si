-- ============================================
-- FIX: Create profile for existing users
-- ============================================
-- This creates profiles for users who confirmed email but don't have a profile

-- Create profiles for all users in auth.users who don't have one
INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.created_at + INTERVAL '3 days', NOW() + INTERVAL '3 days'),
  'trial',
  au.created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Verify - show users with and without profiles
SELECT 
  au.email as user_email,
  au.created_at as user_created,
  CASE 
    WHEN p.id IS NOT NULL THEN '✓ Has profile'
    ELSE '✗ No profile'
  END as profile_status,
  p.subscription_status,
  p.trial_ends_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 20;

-- Count
SELECT 
  COUNT(DISTINCT au.id) as total_users,
  COUNT(DISTINCT p.id) as total_profiles,
  COUNT(DISTINCT au.id) - COUNT(DISTINCT p.id) as missing_profiles
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id;

