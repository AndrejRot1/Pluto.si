# 🔑 Kje Dobiš Vse Stripe Ključe - Hitri Pregled

## 📍 Lokacija v Stripe Dashboard

### 1. API Keys (Secret Key in Publishable Key)

**Lokacija:**
```
Stripe Dashboard → Developers → API keys
```

**Koraki:**
1. Odpri: https://dashboard.stripe.com
2. V levem meniju klikni **"Developers"**
3. Klikni **"API keys"**
4. Preveri, da si v pravilnem mode:
   - **Test mode**: Toggle v zgornjem levem kotu prikaže "Test mode"
   - **Live mode**: Toggle prikaže "Live mode"

**Kaj kopirati:**
- **Secret key** (`sk_test_...` ali `sk_live_...`) → `STRIPE_SECRET_KEY`
- **Publishable key** (`pk_test_...` ali `pk_live_...`) → Trenutno ne uporabljamo, vendar ga lahko shraniš

**⚠️ POMEMBNO:**
- Test ključi se začnejo z `sk_test_` in `pk_test_`
- Live ključi se začnejo z `sk_live_` in `pk_live_`
- Secret key je občutljiv - nikoli ga ne deli javno!

---

### 2. Price ID (Produkt ID)

**Lokacija:**
```
Stripe Dashboard → Products → [Tvoj produkt] → Pricing
```

**Koraki:**
1. Odpri: https://dashboard.stripe.com
2. V levem meniju klikni **"Products"**
3. Klikni na tvoj produkt (npr. "Pluto.si Premium")
4. V razdelku **"Pricing"** poišči **"Price ID"**
5. Kopiraj Price ID (npr. `price_1ABC123def456GHI789`)

**Kaj kopirati:**
- **Price ID** (`price_1...`) → `STRIPE_PRICE_ID`

**⚠️ POMEMBNO:**
- Vsak produkt ima svoj Price ID
- Test mode in Live mode imata RAZLIČNA Price ID-ja
- Preveri, da si v pravilnem mode (test/live)

---

### 3. Webhook Secret

**Lokacija:**
```
Stripe Dashboard → Developers → Webhooks → [Tvoj endpoint] → Signing secret
```

**Koraki:**
1. Odpri: https://dashboard.stripe.com
2. V levem meniju klikni **"Developers"**
3. Klikni **"Webhooks"**
4. Klikni na tvoj webhook endpoint (ali **"Add endpoint"** če ga še nimaš)
5. V razdelku **"Signing secret"** klikni **"Reveal"** ali **"Click to reveal"**
6. Kopiraj Signing secret (začne se z `whsec_...`)

**Kaj kopirati:**
- **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

**⚠️ POMEMBNO:**
- Vsak webhook endpoint ima svoj Signing secret
- Test mode in Live mode imata RAZLIČNA Signing secret-a
- Če webhook endpoint še ne obstaja, ga moraš najprej ustvariti

---

## 🆕 Kako Ustvariti Webhook Endpoint (če ga še nimaš)

**Lokacija:**
```
Stripe Dashboard → Developers → Webhooks → Add endpoint
```

**Koraki:**
1. Odpri: https://dashboard.stripe.com
2. V levem meniju klikni **"Developers"** → **"Webhooks"**
3. Klikni **"Add endpoint"**
4. Vnesi **Endpoint URL**:
   - Za test: `http://localhost:5174/api/stripe/webhook` (ali uporabi Stripe CLI)
   - Za production: `https://your-app.deno.dev/api/stripe/webhook`
5. V **"Select events to listen to"** izberi:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Klikni **"Add endpoint"**
7. Po ustvarjanju klikni na endpoint in kopiraj **Signing secret**

---

## 📋 Povzetek - Vsi Ključi na Enem Mestu

| Ključ | Lokacija | Format | Environment Variable |
|-------|----------|--------|---------------------|
| **Secret Key** | Developers → API keys | `sk_test_...` ali `sk_live_...` | `STRIPE_SECRET_KEY` |
| **Price ID** | Products → [Produkt] → Pricing | `price_1...` | `STRIPE_PRICE_ID` |
| **Webhook Secret** | Developers → Webhooks → [Endpoint] | `whsec_...` | `STRIPE_WEBHOOK_SECRET` |

---

## 🔄 Test vs Live Mode

### Test Mode
- **Secret Key**: `sk_test_...`
- **Price ID**: `price_1ABC...` (test produkt)
- **Webhook Secret**: `whsec_...` (test webhook)

### Live Mode
- **Secret Key**: `sk_live_...`
- **Price ID**: `price_1XYZ...` (live produkt)
- **Webhook Secret**: `whsec_...` (live webhook)

**⚠️ POMEMBNO:**
- Test in Live ključi so RAZLIČNI
- Ne mešaj test in live ključev!
- V production uporabljaj samo live ključe

---

## ✅ Checklist

- [ ] Secret Key kopiran (test ali live)
- [ ] Price ID kopiran (test ali live)
- [ ] Webhook endpoint ustvarjen
- [ ] Webhook Secret kopiran (test ali live)
- [ ] Environment variables nastavljeni

---

## 🆘 Hitra Navigacija

**Direktni linki:**
- API Keys: https://dashboard.stripe.com/apikeys
- Products: https://dashboard.stripe.com/products
- Webhooks: https://dashboard.stripe.com/webhooks

**Preveri mode:**
- Toggle v zgornjem levem kotu Stripe Dashboard-a
- "Test mode" = test ključi
- "Live mode" = live ključi

