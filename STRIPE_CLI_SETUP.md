# Stripe CLI Setup za lokalne webhookse

## 1️⃣ Namesti Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

## 2️⃣ Prijavi se v Stripe

```bash
stripe login
```

## 3️⃣ Posluši webhookse

```bash
stripe listen --forward-to localhost:5174/api/stripe/webhook
```

To bo izpisalo **webhook signing secret** (`whsec_...`) → dodaj v `.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_tvoj_secret
```

## 4️⃣ Testiraj plačilo

V drugem terminalskem oknu:
```bash
stripe trigger checkout.session.completed
```

Ali naredi pravo plačilo preko Stripe Checkout UI.

## ✅ Zdaj se bodo webhooksi klicali lokalno!

