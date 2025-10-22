# 💳 Stripe Integration Setup

## 1. Zaženi SQL v Supabase

Zaženi `supabase-additions.sql` v Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/vbmtvnqnpsbgnxasejcg/sql

## 2. Ustvari Stripe Račun

1. Pojdi na: https://dashboard.stripe.com/register
2. Izberi **Slovenia** kot državo
3. Aktiviraj test mode (v zgornjem levem kotu)

## 3. Ustvari Produkt v Stripe

1. **Dashboard → Products → Add product**
2. Nastavitve:
   - Name: `Pluto.si Premium`
   - Description: `Polni dostop do matematičnega asistenta`
   - Price: `€9.99/mesec` (ali po tvoji izbiri)
   - Billing period: `Monthly`
3. **Shrani** in kopiraj **Price ID** (npr. `price_1ABC...`)

## 4. Nastavi Webhook

1. **Dashboard → Developers → Webhooks**
2. Klikni **Add endpoint**
3. Endpoint URL: `https://your-app.deno.dev/api/stripe/webhook`
   - (zamenjaj `your-app` s svojim Deno Deploy URL-jem)
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Add endpoint**
6. **Kopiraj Signing secret** (začne se z `whsec_...`)

## 5. Pridobi API Keys

1. **Dashboard → Developers → API keys**
2. Kopiraj:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)

## 6. Dodaj Environment Variables

### V Deno Deploy:
1. Pojdi na: https://dash.deno.com
2. Izberi svoj projekt
3. **Settings → Environment Variables**
4. Dodaj:

```
SUPABASE_URL=https://vbmtvnqnpsbgnxasejcg.supabase.co
SUPABASE_ANON_KEY=<tvoj-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DEEPSEEK_API_KEY=<tvoj-deepseek-key>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

### Lokalno (`.env` file):
Kopiraj `.env.example` v `.env` in izpolni vrednosti.

## 7. Testiranje

### Test Cards (Stripe test mode):
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

Uporabi katerikoli:
- CVC: `123`
- Date: Prihodnji datum (npr. `12/34`)
- ZIP: `12345`

## 8. Production Mode

Ko si pripravljen za production:

1. **Stripe Dashboard → Activate account**
2. Izpolni business details
3. **Switch to Live mode**
4. Ustvari nov produkt v live mode
5. Ustvari nov webhook v live mode
6. Zamenjaj vse `sk_test_...` z `sk_live_...` in `pk_test_...` z `pk_live_...`

## API Endpoints

### `/api/stripe/checkout` (POST)
Ustvari Stripe Checkout Session za upgrade na premium.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `/api/stripe/webhook` (POST)
Stripe webhook handler (avtomatsko).

### `/api/stripe/portal` (POST)
Ustvari Stripe Customer Portal Session za upravljanje naročnine.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

## Supabase Tables

### `profiles`
```sql
- id (UUID, PK)
- email (TEXT)
- trial_ends_at (TIMESTAMPTZ)
- subscription_status ('trial' | 'active' | 'expired' | 'canceled')
- stripe_customer_id (TEXT)
- stripe_subscription_id (TEXT)
```

### `subscriptions`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- stripe_customer_id (TEXT)
- stripe_subscription_id (TEXT)
- status ('active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete')
- current_period_start (TIMESTAMPTZ)
- current_period_end (TIMESTAMPTZ)
- cancel_at_period_end (BOOLEAN)
```

## Troubleshooting

### Webhook ne dela?
- Preveri, ali je URL pravilen
- Preveri webhook secret v environment variables
- Poglej Stripe logs: Dashboard → Developers → Webhooks → [tvoj endpoint] → Events

### Checkout session error?
- Preveri STRIPE_PRICE_ID
- Preveri STRIPE_SECRET_KEY
- Poglej browser console in server logs

### User nima profila?
- Preveri, ali je trigger `on_auth_user_created` aktiven
- Manualno dodaj profil v Supabase Table Editor

## Resources

- Stripe Docs: https://stripe.com/docs
- Stripe Test Cards: https://stripe.com/docs/testing
- Stripe Webhooks: https://stripe.com/docs/webhooks
- Supabase Docs: https://supabase.com/docs

