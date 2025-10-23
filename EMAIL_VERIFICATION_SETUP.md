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

Za **70% profit** z DeepSeek API:

### Priporočilo:
**€9.99/mesec** - Unlimited dostop

### Stripe Live Price Setup:

1. **Stripe Dashboard** → **Products** → **Create product**
2. **Name**: `Pluto.si Premium`
3. **Description**: `Neomejen dostop do AI matematičnega asistenta`
4. **Pricing**:
   - **Price**: `€9.99`
   - **Billing period**: `Monthly`
   - **Recurring**
5. **Save & Copy Price ID** (npr. `price_1ABC...`)
6. Dodaj v `.env`:
   ```
   STRIPE_PRICE_ID=price_1ABC...
   ```

### Alternativni paketi:

| Paket | Cena | Chati/mesec | Profit margin |
|-------|------|-------------|---------------|
| Basic | €4.99 | 500 | 88% |
| Pro | €9.99 | 2000 | 76% |
| Unlimited | €19.99 | ∞ | 50-75% |

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

