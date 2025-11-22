# 🔗 Stripe Webhook Setup - Podrobno Navodilo

## 📍 Kje Dodati Webhook Endpoint

### Lokacija:
```
Stripe Dashboard → Developers → Webhooks → Add endpoint
```

**Direktni link:** https://dashboard.stripe.com/webhooks

---

## 🧪 Za Test Mode (Lokalno Testiranje)

### Možnost 1: Stripe CLI (Priporočeno)

**Stripe CLI** omogoča lokalno testiranje webhook-ov brez potrebe po production URL-ju.

1. **Namesti Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Ali prenesi iz: https://stripe.com/docs/stripe-cli
   ```

2. **Prijavi se v Stripe:**
   ```bash
   stripe login
   ```

3. **Zaženi webhook forwarding:**
   ```bash
   stripe listen --forward-to localhost:5174/api/stripe/webhook
   ```
   
   To bo izpisalo **webhook signing secret** (`whsec_...`) → dodaj v environment variables:
   ```bash
   export STRIPE_WEBHOOK_SECRET=whsec_tvoj_secret
   ```

4. **V Stripe Dashboard:**
   - Stripe CLI avtomatsko posreduje webhook-e na tvoj localhost
   - **NI POTREBNO** dodati endpoint v Stripe Dashboard za lokalno testiranje!

### Možnost 2: Localhost URL (Manj priporočeno)

**⚠️ POZOR:** Stripe ne more direktno dostopati do `localhost`. Potrebuješ:
- **ngrok** ali podoben tool za tunneling
- Ali pa uporabi Stripe CLI (lažje)

**Če uporabljaš ngrok:**
1. Namesti ngrok: https://ngrok.com
2. Zaženi: `ngrok http 5174`
3. Kopiraj HTTPS URL (npr. `https://abc123.ngrok.io`)
4. V Stripe Dashboard dodaj endpoint: `https://abc123.ngrok.io/api/stripe/webhook`

---

## 🚀 Za Production (Deno Deploy)

### Koraki:

1. **Pojdi na:** https://dashboard.stripe.com
2. **Preveri mode:**
   - Za test: Toggle v zgornjem levem kotu → "Test mode"
   - Za live: Toggle → "Live mode"

3. **Dodaj Webhook:**
   - V levem meniju klikni **"Developers"**
   - Klikni **"Webhooks"**
   - Klikni **"Add endpoint"**

4. **Vnesi Endpoint URL:**
   ```
   https://your-app.deno.dev/api/stripe/webhook
   ```
   
   **⚠️ POMEMBNO:** Zamenjaj `your-app` s svojim pravilnim Deno Deploy URL-jem!
   
   **Kako najti svoj Deno Deploy URL:**
   - Pojdi na: https://dash.deno.com
   - Izberi svoj projekt
   - V "Domains" ali "Deployments" boš videl URL (npr. `pluto-si-abc123.deno.dev`)

5. **Izberi Events:**
   V "Select events to listen to" izberi:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

6. **Dodaj Endpoint:**
   - Klikni **"Add endpoint"**

7. **Kopiraj Signing Secret:**
   - Po ustvarjanju klikni na endpoint
   - V razdelku **"Signing secret"** klikni **"Reveal"**
   - Kopiraj secret (začne se z `whsec_...`)
   - To je tvoj **STRIPE_WEBHOOK_SECRET**

---

## 📋 Primer: Dodajanje Webhook-a v Stripe Dashboard

### Korak za korakom:

1. **Odpri Stripe Dashboard:**
   ```
   https://dashboard.stripe.com
   ```

2. **Navigacija:**
   ```
   Levi meni → Developers → Webhooks
   ```

3. **Klikni "Add endpoint"**

4. **Endpoint URL:**
   - **Test mode (lokalno)**: Uporabi Stripe CLI (glej zgoraj)
   - **Test mode (production)**: `https://your-app.deno.dev/api/stripe/webhook`
   - **Live mode**: `https://your-app.deno.dev/api/stripe/webhook`

5. **Events:**
   ```
   ☑ customer.subscription.created
   ☑ customer.subscription.updated
   ☑ customer.subscription.deleted
   ☑ invoice.payment_succeeded
   ☑ invoice.payment_failed
   ```

6. **Klikni "Add endpoint"**

7. **Kopiraj Signing secret:**
   - Klikni na novi endpoint
   - Klikni "Reveal" pri Signing secret
   - Kopiraj `whsec_...`

---

## ✅ Preverjanje Webhook-a

### V Stripe Dashboard:

1. **Developers** → **Webhooks** → [Tvoj endpoint]
2. Preveri:
   - ✅ Endpoint URL je pravilen
   - ✅ Events so izbrani
   - ✅ Status je "Enabled"
   - ✅ Signing secret je vidljiv

### Test Webhook:

1. V Stripe Dashboard → **Webhooks** → [Tvoj endpoint]
2. Klikni **"Send test webhook"**
3. Izberi event (npr. `customer.subscription.created`)
4. Klikni **"Send test webhook"**
5. Preveri, da se webhook uspešno pošlje (zelena ikona ✅)

### V Aplikaciji:

Preveri server logs, da se webhook pravilno procesira:
```bash
# V terminalu, kjer teče aplikacija
# Bi moral videti:
# ✅ Webhook signature verified
# Stripe webhook event: customer.subscription.created
```

---

## 🐛 Troubleshooting

### "Webhook endpoint not reachable"
- **Vzrok**: URL ni pravilen ali aplikacija ne teče
- **Rešitev**: 
  - Preveri, da je URL pravilen
  - Preveri, da aplikacija teče na tem URL-ju
  - Za localhost uporabi Stripe CLI

### "Webhook signature verification failed"
- **Vzrok**: Napačen STRIPE_WEBHOOK_SECRET
- **Rešitev**: 
  - Preveri, da si kopiral pravilen secret
  - Preveri, da si v pravilnem mode (test/live)
  - Preveri environment variables

### "No events received"
- **Vzrok**: Events niso izbrani ali webhook ni aktiven
- **Rešitev**: 
  - Preveri, da so events izbrani v Stripe Dashboard
  - Preveri, da je webhook "Enabled"
  - Testiraj z "Send test webhook"

---

## 📝 Checklist

- [ ] Stripe Dashboard odprt
- [ ] Pravilni mode izbran (test/live)
- [ ] Webhook endpoint dodan
- [ ] Endpoint URL pravilen
- [ ] Events izbrani
- [ ] Signing secret kopiran
- [ ] STRIPE_WEBHOOK_SECRET nastavljen v environment variables
- [ ] Test webhook uspešen

---

## 🆘 Hitra Pomagala

**Direktni linki:**
- Webhooks: https://dashboard.stripe.com/webhooks
- Stripe CLI: https://stripe.com/docs/stripe-cli
- Deno Deploy: https://dash.deno.com

**Preveri mode:**
- Toggle v zgornjem levem kotu Stripe Dashboard-a
- "Test mode" = test webhook
- "Live mode" = live webhook

