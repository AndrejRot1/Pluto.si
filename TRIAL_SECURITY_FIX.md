# 🔒 TRIAL SECURITY FIX - Prevent Re-registration

## ❌ PROBLEM:

User se lahko ponovno registrira z istim emailom in dobi nov 3-day trial!

Flow:
1. User registers → Gets 3-day trial
2. Trial expires → subscription_status = 'expired'
3. User deletes account or re-registers with SAME email
4. User gets ANOTHER 3-day trial! ❌

---

## ✅ SOLUTION:

Update the `handle_new_user()` function in Supabase to check if a profile with the same email already exists (even if expired).

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_profile RECORD;
BEGIN
  -- Check if profile already exists with this email
  SELECT * INTO existing_profile
  FROM profiles
  WHERE email = NEW.email
  LIMIT 1;
  
  -- If profile exists, don't create new trial
  IF existing_profile IS NOT NULL THEN
    -- Log the attempt but don't give new trial
    RAISE NOTICE 'User % already has a profile, no new trial granted', NEW.email;
    RETURN NEW;
  END IF;
  
  -- Create new profile with trial (first time registration only)
  INSERT INTO profiles (id, email, trial_ends_at, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    NOW() + INTERVAL '3 days',
    'trial'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔧 HOW TO APPLY:

1. Go to Supabase Dashboard → SQL Editor
2. Paste the updated function
3. Run it
4. Test by trying to re-register with same email

---

## 📝 TESTING:

1. Register new account with email test@example.com
2. Wait 3 days (or manually set trial_ends_at to yesterday)
3. Delete account OR register again with same email
4. **Expected:** No new trial granted, user stays expired

---

## ⚠️ IMPORTANT:

This prevents users from getting unlimited free trials by re-registering!

---

**File:** `supabase-schema.sql` (updated)

