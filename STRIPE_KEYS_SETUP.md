# 🔑 Stripe API Keys Setup - Podrobno Navodilo

## Kaj so Stripe API Keys?

Stripe API keys so identifikatorji, ki omogočajo tvoji aplikaciji komunikacijo s Stripe API-jem za procesiranje plačil.

**Potrebuješ 3 ključe:**
1. **STRIPE_SECRET_KEY** - Za server-side operacije (skrit, nikoli v frontend)
2. **STRIPE_PRICE_ID** - ID tvojega produkta v Stripe (npr. `price_1ABC...`)
3. **STRIPE_WEBHOOK_SECRET** - Za verifikacijo webhook-ov (skrit)

---

## 📋 KORAKI ZA NASTAVITEV

### 1. Ustvari Stripe Račun (če še nimaš)

1. Pojdi na: https://dashboard.stripe.com/register
2. Izberi **Slovenia** kot državo
3. Izpolni business podatke
4. **POMEMBNO**: Za začetek uporabljaj **Test mode** (toggle v zgornjem levem kotu)

---

### 2. Ustvari Produkt v Stripe

1. **Stripe Dashboard** → **Products** → **Add product**
2. Nastavitve:
   - **Name**: `Pluto.si Premium`
   - **Description**: `Polni dostop do matematičnega asistenta`
   - **Pricing model**: `Standard pricing`
   - **Price**: `€9.99` (ali po tvoji izbiri)
   - **Billing period**: `Monthly` (ali `Yearly`)
3. Klikni **Save product**
4. **Kopiraj Price ID** (npr. `price_1ABC123def456GHI789`)
   - To je tvoj **STRIPE_PRICE_ID**

---

### 3. Pridobi API Keys

1. **Stripe Dashboard** → **Developers** → **API keys**
2. Preveri, da si v **Test mode** (toggle v zgornjem levem kotu)
3. Kopiraj:
   - **Secret key** (`sk_test_...`) → To je tvoj **STRIPE_SECRET_KEY**
   - **Publishable key** (`pk_test_...`) → Za frontend (trenutno ne uporabljamo)

**⚠️ POMEMBNO:**
- **Secret key** je občutljiv - nikoli ga ne deli javno
- **Test mode** ključi se začnejo z `sk_test_` in `pk_test_`
- **Live mode** ključi se začnejo z `sk_live_` in `pk_live_`

---

### 4. Nastavi Webhook (za avtomatske posodobitve)

1. **Stripe Dashboard** → **Developers** → **Webhooks**
2. Klikni **Add endpoint**
3. **Endpoint URL**:
   - Za lokalno testiranje: `http://localhost:5174/api/stripe/webhook` (uporabi Stripe CLI - glej spodaj)
   - Za production: `https://your-app.deno.dev/api/stripe/webhook`
4. **Select events to listen to**:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Klikni **Add endpoint**
6. **Kopiraj Signing secret** (začne se z `whsec_...`)
   - To je tvoj **STRIPE_WEBHOOK_SECRET**

---

### 5. Nastavi Environment Variables

#### A. Za lokalno razvojno okolje (Deno)

Deno bere environment variables iz sistema. Nastavi jih v terminalu:

**macOS/Linux:**
```bash
export STRIPE_SECRET_KEY="sk_test_..."
export STRIPE_PRICE_ID="price_1ABC..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Windows (PowerShell):**
```powershell
$env:STRIPE_SECRET_KEY="sk_test_..."
$env:STRIPE_PRICE_ID="price_1ABC..."
$env:STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Ali ustvari `.env` file** (če uporabljaš deno-dotenv):
```bash
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_1ABC...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Za trajno nastavitev** (macOS/Linux):
Dodaj v `~/.zshrc` ali `~/.bashrc`:
```bash
export STRIPE_SECRET_KEY="sk_test_..."
export STRIPE_PRICE_ID="price_1ABC..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
```

Nato:
```bash
source ~/.zshrc  # ali source ~/.bashrc
```

#### B. Za Production (Deno Deploy)

1. Pojdi na: https://dash.deno.com
2. Izberi svoj projekt
3. **Settings** → **Environment Variables**
4. Dodaj vsak ključ posebej:
   - **Key**: `STRIPE_SECRET_KEY` → **Value**: `sk_live_...` (ali `sk_test_...` za test)
   - **Key**: `STRIPE_PRICE_ID` → **Value**: `price_1ABC...`
   - **Key**: `STRIPE_WEBHOOK_SECRET` → **Value**: `whsec_...`
5. Klikni **Save** za vsak ključ

---

### 6. Preveri Nastavitve

Preveri, da aplikacija bere environment variables:

**V terminalu:**
```bash
# Preveri, da so nastavljeni
echo $STRIPE_SECRET_KEY
echo $STRIPE_PRICE_ID
echo $STRIPE_WEBHOOK_SECRET
```

**V aplikaciji** (dodaj v `routes/api/stripe/checkout.tsx` za testiranje):
```typescript
console.log("STRIPE_SECRET_KEY:", STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing");
console.log("STRIPE_PRICE_ID:", STRIPE_PRICE_ID ? "✅ Set" : "❌ Missing");
```

---

## 🧪 Testiranje (Test Mode)

### Test Credit Cards

Ko si v **Test mode**, uporabi te test kartice:

| Card Number | Rezultat |
|------------|----------|
| `4242 4242 4242 4242` | ✅ Uspešna transakcija |
| `4000 0000 0000 0002` | ❌ Zavrnjena |
| `4000 0025 0000 3155` | ⚠️ Zahteva 3D Secure |

**Za vse test kartice:**
- **CVC**: `123`
- **Expiry**: Prihodnji datum (npr. `12/34`)
- **ZIP**: `12345`

### Test Flow

1. Odpri `/app` ali `/settings`
2. Klikni "Upgrade to Premium"
3. Preusmeri te na Stripe Checkout
4. Uporabi test kartico `4242 4242 4242 4242`
5. Preveri, da se naročnina ustvari v Stripe Dashboard

---

## 🚀 Production Mode

Ko si pripravljen za production:

### 1. Aktiviraj Stripe Account

1. **Stripe Dashboard** → **Activate account**
2. Izpolni business details:
   - Business type
   - Business address
   - Tax ID (če ga imaš)
   - Bank account (za izplačila)
3. Počakaj na verifikacijo (običajno 1-2 dni)

### 2. Switch to Live Mode

1. V Stripe Dashboard klikni **"Activate test mode"** toggle → **"Activate live mode"**
2. Potrdi preklop

### 3. Ustvari Live Produkt

1. **Products** → **Add product**
2. Isti produkt kot v test mode, vendar v **Live mode**
3. Kopiraj nov **Price ID** (začne se z `price_1...`)

### 4. Ustvari Live Webhook

1. **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://your-app.deno.dev/api/stripe/webhook`
3. Izbiraj iste events
4. Kopiraj nov **Signing secret**

### 5. Posodobi Environment Variables

**V Deno Deploy:**
- Zamenjaj `sk_test_...` z `sk_live_...`
- Zamenjaj `price_1ABC...` z novim live price ID
- Zamenjaj `whsec_...` z novim live webhook secret

**⚠️ POMEMBNO:**
- Nikoli ne mešaj test in live ključev!
- V production uporabljaj samo live ključe
- Test ključe uporabljaj samo lokalno

---

## 🔒 VARNOST

### ✅ DO:
- Shrani ključe v environment variables (NE v kodi)
- Uporabljaj različne ključe za test in production
- Redno rotiraj ključe (vsakih 90 dni)
- Uporabljaj najmanjše potrebne dovoljenja

### ❌ NE:
- Nikoli ne commitaj ključev v git
- Nikoli ne deli ključev javno
- Nikoli ne uporabljaj live ključev v test okolju
- Nikoli ne shranjuj ključev v localStorage ali cookies

---

## 🐛 Troubleshooting

### "Invalid API Key"
- **Vzrok**: Napačen STRIPE_SECRET_KEY
- **Rešitev**: Preveri, da je ključ pravilno kopiran (brez presledkov)

### "No such price"
- **Vzrok**: Napačen STRIPE_PRICE_ID
- **Rešitev**: Preveri, da je price ID pravilen in da si v pravilnem mode (test/live)

### "Webhook signature verification failed"
- **Vzrok**: Napačen STRIPE_WEBHOOK_SECRET
- **Rešitev**: Preveri, da je webhook secret pravilen in da ustreza endpoint-u

### Environment variables se ne berejo
- **Vzrok**: Deno ne bere .env file-ov avtomatsko
- **Rešitev**: Uporabi `export` v terminalu ali nastavi v Deno Deploy

---

## 📝 Checklist

- [ ] Stripe račun ustvarjen
- [ ] Produkt ustvarjen (test mode)
- [ ] STRIPE_SECRET_KEY kopiran
- [ ] STRIPE_PRICE_ID kopiran
- [ ] Webhook nastavljen (test mode)
- [ ] STRIPE_WEBHOOK_SECRET kopiran
- [ ] Environment variables nastavljeni (lokalno)
- [ ] Environment variables nastavljeni (Deno Deploy)
- [ ] Test checkout deluje
- [ ] Test webhook deluje
- [ ] Account aktiviran (za production)
- [ ] Live produkt ustvarjen
- [ ] Live webhook nastavljen
- [ ] Live environment variables nastavljeni

---

## 📚 Dodatni Viri

- [Stripe API Docs](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Deno Environment Variables](https://deno.land/manual/basics/env_variables)

