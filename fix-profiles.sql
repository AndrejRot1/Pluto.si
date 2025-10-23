-- ============================================
-- Ročno dodaj obstoječe user-je v profiles tabelo
-- ============================================

-- Dodaj vse user-je iz auth.users v profiles (če še ne obstajajo)
INSERT INTO profiles (id, email, trial_ends_at, subscription_status, created_at)
SELECT 
  au.id,
  au.email,
  NOW() + INTERVAL '3 days' AS trial_ends_at,
  'trial' AS subscription_status,
  au.created_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
);

-- Preveri da so vsi user-ji zdaj v profiles
SELECT 
  au.email,
  au.created_at,
  CASE 
    WHEN p.id IS NOT NULL THEN 'V profiles ✓'
    ELSE 'NI v profiles ✗'
  END AS status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

