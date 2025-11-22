# ⚡ Hitro Dodajanje Webhook-a (Production)

## Korak 1: Najdi svoj Deno Deploy URL

1. Odpri: https://dash.deno.com
2. Izberi svoj projekt (Pluto.si)
3. V "Domains" ali "Deployments" boš videl URL
4. Primer URL-ja: `pluto-si-abc123.deno.dev` ali `your-app.deno.dev`

**Tvoj webhook URL bo:**
```
https://[tvoj-url].deno.dev/api/stripe/webhook
```

---

## Korak 2: Dodaj Webhook v Stripe

1. **Odpri Stripe Dashboard:**
   https://dashboard.stripe.com/webhooks

2. **Klikni "Add endpoint"**

3. **Vnesi Endpoint URL:**
   ```
   https://[tvoj-deno-deploy-url].deno.dev/api/stripe/webhook
   ```
   (Zamenjaj `[tvoj-deno-deploy-url]` s svojim pravilnim URL-jem)

4. **Izberi Events:**
   - ☑ `customer.subscription.created`
   - ☑ `customer.subscription.updated`
   - ☑ `customer.subscription.deleted`
   - ☑ `invoice.payment_succeeded`
   - ☑ `invoice.payment_failed`

5. **Klikni "Add endpoint"**

6. **Kopiraj Signing secret:**
   - Klikni na novi endpoint
   - V razdelku "Signing secret" klikni "Reveal"
   - Kopiraj `whsec_...`
   - To je tvoj **STRIPE_WEBHOOK_SECRET**

---

## Korak 3: Dodaj v Deno Deploy Environment Variables

1. Odpri: https://dash.deno.com
2. Izberi svoj projekt
3. **Settings** → **Environment Variables**
4. Dodaj ali posodobi:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (tvoj kopirani secret)
5. Klikni **Save**

---

## ✅ Preveri

1. V Stripe Dashboard → Webhooks → [Tvoj endpoint
2. Klikni "Send test webhook"
3. Izberi event in pošlji
4. Preveri, da se webhook uspešno pošlje (zelena ikona ✅)

**To je to!** 🎉

