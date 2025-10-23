# 📧 Email Verification Setup - Pluto.si

## 1. Supabase Email Configuration

### A. Uredi Email Templates (Supabase Dashboard)

1. Pojdi na [Supabase Dashboard](https://supabase.com/dashboard)
2. Izberi projekt: **Pluto.si**
3. Navigiraj: **Authentication** → **Email Templates**

### B. Nastavi "Confirm signup" template

**Subject:**
```
Potrdite svoj Pluto.si račun
```

**Body (HTML):**
```html
<h2>Dobrodošli na Pluto.si! 🚀</h2>

<p>Pozdravljeni,</p>

<p>Hvala za registracijo na Pluto.si - vašem osebnem matematičnem asistentu!</p>

<p>Za aktivacijo vašega 3-dnevnega brezplačnega preskusa kliknite na spodnjo povezavo:</p>

<p>
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
    Potrdi email naslov
  </a>
</p>

<p>Ali kopirajte in prilepite to povezavo v brskalnik:</p>
<p style="color: #666; font-size: 12px;">{{ .ConfirmationURL }}</p>

<p>Ta povezava poteče čez 24 ur.</p>

<p>Če niste ustvarili računa na Pluto.si, ignorirajte ta email.</p>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

<p style="color: #666; font-size: 12px;">
  Pluto.si - Matematika postane enostavnejša<br>
  © 2025 Pluto.si. Vse pravice pridržane.
</p>
```

### C. Nastavi Redirect URL

1. V Supabase Dashboard → **Authentication** → **URL Configuration**
2. Dodaj v **Redirect URLs**:
   ```
   http://localhost:5174/auth/confirm
   https://pluto.si/auth/confirm
   ```
3. Klikni **Save**

### D. Email Providers (za produkcijo)

Za **live** (produkcijo) nastavi custom SMTP:

#### Opcija 1: Gmail (Brezplačno, ampak omejena količina)
1. **Settings** → **Custom SMTP**
2. **Sender name**: `Pluto.si`
3. **Sender email**: `tvoj.email@gmail.com`
4. **Host**: `smtp.gmail.com`
5. **Port**: `587`
6. **Username**: `tvoj.email@gmail.com`
7. **Password**: [Ustvari App Password](https://myaccount.google.com/apppasswords)
   - Pojdi na Google Account → Security → 2-Step Verification → App passwords
   - Generiraj password za "Mail"
   - Kopiraj 16-mestno geslo (brez presledkov)

#### Opcija 2: SendGrid (Priporočeno za produkcijo)
- Brezplačno do 100 emailov/dan
- Registracija: https://sendgrid.com/
- **Host**: `smtp.sendgrid.net`
- **Port**: `587`
- **Username**: `apikey`
- **Password**: [Your SendGrid API Key]

#### Opcija 3: AWS SES (Najcenejše za večje količine)
- $0.10 per 1000 emailov
- Odlično za scaling

### E. Enable Email Confirmation

1. Supabase Dashboard → **Authentication** → **Settings**
2. **Email Auth** sekcija:
   - ✅ **Enable email confirmations** (vključi to!)
   - ✅ **Enable email change confirmations**
3. Klikni **Save**

---

## 2. Lokalni razvoj (localhost)

Za testiranje lokalno (brez pravega emaila):

1. Supabase pošlje email z linkom
2. Link izgleda: `http://localhost:5174/auth/confirm#access_token=...&type=signup`
3. Odpri **Supabase Dashboard** → **Authentication** → **Users**
4. Najdi svojega user-ja in ročno klikni **Verify email**

**ALI** preveri Supabase logs za confirmation URL:
- Dashboard → **Logs** → **Auth Logs**
- Poišči "signup" event
- Kopiraj URL iz emaila

---

## 3. Testiranje

### A. Registriraj nov račun
```
Email: test@example.com
Password: Test123!
```

### B. Preveri inbox (ali Supabase logs)

### C. Klikni "Potrdi email naslov"

### D. Redirect na chat → Trial začne!

---

## 📊 Cenovna nastavitev v Stripe

### Analiza stroškov (na uporabnika/mesec):

#### DeepSeek API stroški:
- **Input tokens**: $0.27 per 1M tokens
- **Output tokens**: $1.10 per 1M tokens
- **Povprečen chat**: ~500 input + ~1000 output tokens
- **Strošek na chat**: ~$0.00124 (0.124¢)

#### Stripe fees (evropske kartice):
- **EU kartice**: 1.5% + €0.25 per transakcija
- **Non-EU kartice**: 2.9% + €0.25 per transakcija
- **Povprečno**: ~2% + €0.25

---

### Izračun profita (z vsemi stroški):

| Uporaba | Cena | DeepSeek | Stripe Fee | **Skupaj stroški** | **Profit** | **Profit %** |
|---------|------|----------|------------|-------------------|-----------|--------------|
| **500 chatov** | €4.99 | €0.60 | €0.35 | **€0.95** | **€4.04** | **81%** ✅ |
| **2000 chatov** | €9.99 | €2.40 | €0.45 | **€2.85** | **€7.14** | **71%** ✅ |
| **5000 chatov** | €14.99 | €6.00 | €0.55 | **€6.55** | **€8.44** | **56%** ✅ |
| **∞ unlimited** | €19.99 | ~€8-12 | €0.65 | **€8.65-12.65** | **€7.34-11.34** | **37-57%** ⚠️ |

**Stripe fee izračun:**
- €9.99 × 2% = €0.20
- €0.20 + €0.25 = **€0.45** per transakcijo

---

### ✅ Priporočilo: **€9.99/mesec** (Unlimited dostop)

**Zakaj?**
- 71% profit margin pri povprečni uporabi (2000 chatov)
- Konkurenčno glede na ChatGPT Plus ($20/mesec)
- Enostavno za uporabnika (brez limitov)
- Prostor za skaliranje

**Alternativa za začetek:** **€14.99/mesec**
- 56% profit pri intenzivni uporabi (5000 chatov)
- Premium pozicioniranje
- Večja varnostna marža

---

### Stripe Live Price Setup:

1. **Stripe Dashboard** → **Products** → **Create product**
2. **Name**: `Pluto.si Premium`
3. **Description**: `Neomejen dostop do AI matematičnega asistenta`
4. **Pricing**:
   - **Price**: `€9.99` (ali `€14.99` za premium)
   - **Billing period**: `Monthly`
   - **Recurring**
5. **Save & Copy Price ID** (npr. `price_1ABC...`)
6. Dodaj v `.env`:
   ```
   STRIPE_PRICE_ID=price_1ABC...
   ```

---

### Stroškovna primerjava:

| Cena | Pri 100 uporabnikih | Stroški (2000 chatov avg) | Profit |
|------|---------------------|---------------------------|--------|
| €4.99 | €499 | €95 | **€404/mesec** |
| €9.99 | €999 | €285 | **€714/mesec** ✅ |
| €14.99 | €1499 | €655 | **€844/mesec** |
| €19.99 | €1999 | €865-1265 | **€734-1134/mesec** |

**Optimalna cena:** **€9.99-14.99/mesec** za največji profit pri scaling.

---

## 🚀 Production Checklist

- [ ] Email templates narejeni (SL/EN/IT)
- [ ] SMTP provider konfiguriran (Gmail/SendGrid/SES)
- [ ] Email confirmation enabled
- [ ] Redirect URLs dodani
- [ ] Stripe product & price ustvarjen
- [ ] `.env` posodobljen z `STRIPE_PRICE_ID`
- [ ] Test registracija deluje
- [ ] Email confirmation deluje

---

## 💡 Naslednji koraki

1. Testiraj registracijo lokalno
2. Nastavi Gmail SMTP
3. Testiraj celoten flow (signup → email → confirm → trial)
4. Deploy na Deno Deploy
5. Nastavi Stripe live mode

