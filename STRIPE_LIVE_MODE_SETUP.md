# 🚀 Stripe Live Mode Setup - Podrobno Navodilo

## Kaj je Live Mode?

**Test mode** = testiranje brez dejanskih plačil (test kartice)
**Live mode** = prave transakcije z dejanskimi kreditnimi karticami

---

## ⚠️ POMEMBNO PRED PREKLOPOM

1. ✅ Preveri, da vse deluje v test mode
2. ✅ Testiraj celoten flow (checkout, webhook, portal)
3. ✅ Preveri, da so vsi environment variables nastavljeni
4. ✅ Pripravi backup test ključev (za morebitne teste v prihodnosti)

---

## 📋 KORAKI ZA LIVE MODE

### 1. Aktiviraj Stripe Račun

1. **Stripe Dashboard** → **Activate account** (ali **Settings** → **Activate account**)
2. Izpolni **business details**:
   - **Business type**: Individual ali Company
   - **Business name**: Tvoje ime ali ime podjetja
   - **Business address**: Tvoj naslov
   - **Phone number**: Tvoja telefonska številka
   - **Website**: `https://teachmathai.com` (ali tvoj domain)
   - **Tax ID** (če ga imaš): Npr. davčna številka
3. Klikni **Continue**

### 2. Dodaj Bank Account (za izplačila)

1. **Settings** → **Payouts** → **Add bank account**
2. Izberi **Slovenia**
3. Vnesi:
   - **Account holder name**: Tvoje ime
   - **IBAN**: Tvoj IBAN (npr. `SI56...`)
   - **BIC/SWIFT**: BIC tvoje banke
4. Klikni **Add bank account**
5. Stripe bo poslal 2 majhni depozit (€0.01-0.02) za verifikacijo
6. Po 1-2 dneh preveri bančni račun in vnesi zneska v Stripe za verifikacijo

### 3. Preklopi v Live Mode

1. V **Stripe Dashboard** (zgornji levi kot) klikni toggle **"Test mode"**
2. Izberi **"Activate live mode"**
3. Potrdi preklop
4. **POMEMBNO**: Vse, kar si naredil v test mode, se NE prenese v live mode!

---

### 4. Ustvari Live Produkt

1. **Products** → **Add product**
2. Nastavitve (ISTE kot v test mode):
   - **Name**: `Pluto.si Premium`
   - **Description**: `Polni dostop do matematičnega asistenta`
   - **Pricing model**: `Standard pricing`
   - **Price**: `€9.99` (ali po tvoji izbiri)
   - **Billing period**: `Monthly` (ali `Yearly`)
3. Klikni **Save product**
4. **Kopiraj Price ID** (npr. `price_1ABC123def456GHI789`)
   - To je tvoj nov **STRIPE_PRICE_ID** za live mode
   - ⚠️ To je DRUGAČEN od test price ID!

---

### 5. Pridobi Live API Keys

1. **Developers** → **API keys**
2. Preveri, da si v **Live mode** (toggle v zgornjem levem kotu)
3. Kopiraj:
   - **Secret key** (`sk_live_...`) → To je tvoj nov **STRIPE_SECRET_KEY** za live
   - **Publishable key** (`pk_live_...`) → Za frontend (trenutno ne uporabljamo)

**⚠️ POMEMBNO:**
- Live ključi se začnejo z `sk_live_` in `pk_live_`
- Test ključi se začnejo z `sk_test_` in `pk_test_`
- **NIKOLI ne mešaj test in live ključev!**

---

### 6. Nastavi Live Webhook

1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**:
   ```
   https://your-app.deno.dev/api/stripe/webhook
   ```
   (zamenjaj `your-app` s svojim Deno Deploy URL-jem)
3. **Select events to listen to**:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Klikni **Add endpoint**
5. **Kopiraj Signing secret** (začne se z `whsec_...`)
   - To je tvoj nov **STRIPE_WEBHOOK_SECRET** za live mode
   - ⚠️ To je DRUGAČEN od test webhook secret!

---

### 7. Posodobi Environment Variables

#### A. V Deno Deploy (Production)

1. Pojdi na: https://dash.deno.com
2. Izberi svoj projekt
3. **Settings** → **Environment Variables**
4. **Zamenjaj** obstoječe vrednosti:
   - **STRIPE_SECRET_KEY**: `sk_test_...` → `sk_live_...`
   - **STRIPE_PRICE_ID**: `price_1ABC...` (test) → `price_1XYZ...` (live)
   - **STRIPE_WEBHOOK_SECRET**: `whsec_...` (test) → `whsec_...` (live)
5. Klikni **Save** za vsak ključ

**⚠️ POMEMBNO:**
- Preveri, da so VSI trije ključi posodobljeni
- Ne mešaj test in live ključev!

#### B. Lokalno (za morebitne teste)

**NE posodabljaj lokalnih environment variables!**
- Obdrži test ključe lokalno
- Live ključe uporabljaj samo v production (Deno Deploy)

---

### 8. Preveri Nastavitve

1. **Stripe Dashboard** → Preveri, da si v **Live mode**
2. **Products** → Preveri, da je live produkt ustvarjen
3. **Developers** → **API keys** → Preveri, da so live ključi vidni
4. **Developers** → **Webhooks** → Preveri, da je live webhook nastavljen
5. **Deno Deploy** → Preveri, da so environment variables posodobljeni

---

## 🧪 Testiranje Live Mode

### ⚠️ POZOR: To so PRAVE transakcije!

1. Odpri production aplikacijo (ne localhost!)
2. Ustvari test račun ali uporabi svoj račun
3. Klikni "Upgrade to Premium"
4. Uporabi **PRAVO kreditno kartico** (ali test kartico, če Stripe dovoli)
5. Preveri, da se naročnina ustvari v Stripe Dashboard (Live mode)

### Test Kartice v Live Mode

**⚠️ POZOR**: V live mode test kartice NE delujejo!
- Uporabiš lahko samo prave kreditne kartice
- Stripe bo zaračunal prave transakcije
- Za testiranje uporabi majhen znesek ali test račun

---

## 🔄 Vrnitev v Test Mode (če potrebuješ)

1. **Stripe Dashboard** → Toggle **"Live mode"** → **"Test mode"**
2. Vse live podatki ostanejo, vendar se ne uporabljajo
3. Test podatki so ločeni od live podatkov

---

## 📊 Monitoring Live Mode

### Stripe Dashboard

1. **Dashboard** → Pregled transakcij
2. **Payments** → Vse plačila
3. **Customers** → Vsi kupci
4. **Subscriptions** → Vse naročnine

### Deno Deploy Logs

1. **Deno Deploy Dashboard** → **Logs**
2. Preveri, da se webhook-i pravilno procesirajo
3. Preveri, da ni error-jev

---

## 🔒 VARNOST

### ✅ DO:
- Shrani live ključe v environment variables (NE v kodi)
- Uporabljaj live ključe samo v production
- Redno rotiraj ključe (vsakih 90 dni)
- Spremljaj transakcije v Stripe Dashboard

### ❌ NE:
- Nikoli ne commitaj live ključev v git
- Nikoli ne deli live ključev javno
- Nikoli ne uporabljaj live ključev lokalno
- Nikoli ne mešaj test in live ključev

---

## 💰 Izplačila

### Kdaj dobiš denar?

1. **Stripe procesira plačilo** → Denar gre v Stripe account
2. **Payout schedule** (običajno):
   - **Daily**: Če imaš > €100 na računu
   - **Weekly**: Če imaš < €100 na računu
   - **Manual**: Če ročno zahtevaš izplačilo
3. **Payout time**: 2-7 dni (odvisno od banke)

### Kako preveriš izplačila?

1. **Stripe Dashboard** → **Balance** → **Payouts**
2. Vidiš vse izplačila in njihov status
3. Preveri bančni račun po 2-7 dneh

---

## 🐛 Troubleshooting

### "Invalid API Key" v production
- **Vzrok**: Uporabljaš test ključ v production
- **Rešitev**: Preveri, da so v Deno Deploy nastavljeni live ključi

### "No such price"
- **Vzrok**: Uporabljaš test price ID v production
- **Rešitev**: Preveri, da je STRIPE_PRICE_ID posodobljen na live price ID

### "Webhook signature verification failed"
- **Vzrok**: Uporabljaš test webhook secret v production
- **Rešitev**: Preveri, da je STRIPE_WEBHOOK_SECRET posodobljen na live secret

### Transakcije se ne procesirajo
- **Vzrok**: Stripe account ni aktiviran
- **Rešitev**: Preveri, da si aktiviral account in dodal bank account

---

## 📝 Checklist za Live Mode

- [ ] Stripe account aktiviran
- [ ] Bank account dodan in verificiran
- [ ] Preklopljeno v Live mode
- [ ] Live produkt ustvarjen
- [ ] Live Price ID kopiran
- [ ] Live Secret Key kopiran
- [ ] Live webhook nastavljen
- [ ] Live Webhook Secret kopiran
- [ ] Environment variables posodobljeni v Deno Deploy
- [ ] Test kartice testirane (če možno)
- [ ] Prava transakcija testirana (majhen znesek)
- [ ] Webhook testiran (preveri Deno Deploy logs)
- [ ] Monitoring nastavljen

---

## 📚 Dodatni Viri

- [Stripe Activation Guide](https://stripe.com/docs/account/activation)
- [Stripe Payouts](https://stripe.com/docs/payouts)
- [Stripe Live Mode Testing](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)

---

## ⚡ Hitri Povzetek

1. ✅ Aktiviraj Stripe account
2. ✅ Dodaj bank account
3. ✅ Preklopi v Live mode
4. ✅ Ustvari live produkt
5. ✅ Kopiraj live API keys
6. ✅ Nastavi live webhook
7. ✅ Posodobi environment variables v Deno Deploy
8. ✅ Testiraj z majhno transakcijo

**Čas nastavitve**: ~30-60 minut (plus čakanje na verifikacijo bank account)

