# Ročna posodobitev subscription statusa

Ker Stripe webhook ne deluje lokalno, lahko ročno posodobiš uporabnika v Supabase:

## 1️⃣ Pojdi v Supabase Dashboard
https://supabase.com/dashboard/project/vbmtvnqnpsbgnxasejcg/editor

## 2️⃣ SQL Editor
Izvedi ta SQL query:

```sql
UPDATE profiles
SET 
  subscription_status = 'active',
  stripe_customer_id = 'cus_THWPnWyPro7qGK',
  stripe_subscription_id = 'sub_TVOJ_ID'  -- dobi iz Stripe Dashboard
WHERE email = 'andrej.rot1@gmail.com';
```

## 3️⃣ Dobi subscription ID iz Stripe
https://dashboard.stripe.com/test/subscriptions
→ klikni na svojo subscription
→ kopiraj ID (začne se s `sub_...`)

## 4️⃣ Osveži stran
Hard refresh in preveri da je status "Premium Aktiven"

