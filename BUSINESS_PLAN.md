# 💰 PLUTO.SI - POSLOVNA ANALIZA & CENOVNA STRATEGIJA

## 📊 1. STROŠKI NA UPORABNIKA (mesečno)

### A) DeepSeek API Stroški
**Pricing:**
- Input: $0.27 / 1M tokens (~$0.00027 / 1K tokens)
- Output: $1.10 / 1M tokens (~$0.0011 / 1K tokens)

**Povprečna uporaba na aktivnega uporabnika:**
- 150 vprašanj/mesec (5 vprašanj/dan)
- Povprečna velikost prompta: 200 tokens
- Povprečen odgovor: 500 tokens

**Izračun:**
```
Input:  150 × 200 tokens = 30,000 tokens = $0.0081/mesec
Output: 150 × 500 tokens = 75,000 tokens = $0.0825/mesec
────────────────────────────────────────────────────────
SKUPAJ DeepSeek: ~$0.09/uporabnik/mesec
```

### B) Stripe Stroški
**Pricing:**
- 2.9% + €0.25 na transakcijo (kartice)
- 0.25% na recurring subscriptions (po prvi transakciji)

**Če je naročnina €9.99/mesec:**
```
Prva transakcija: (€9.99 × 2.9%) + €0.25 = €0.54
Recurring mesečno: €9.99 × 0.25% = €0.025
────────────────────────────────────────────────────────
Povprečno: ~€0.30/mesec (če uporabnik ostane 6+ mesecev)
```

### C) Infrastruktura (Deno Deploy + Supabase)
**Deno Deploy Pro:**
- $20/mesec za 500,000 requests
- Dodatno: $40/1M requests

**Supabase Pro:**
- $25/mesec (do 100,000 MAU)

**Skupaj za 1000 aktivnih uporabnikov:**
```
Deno Deploy: $20-60/mesec (odvisno od traffica)
Supabase: $25/mesec
────────────────────────────────────────────────────────
= $45-85/mesec → ~$0.06/uporabnik/mesec
```

### D) Reklamni Stroški (pridobitev uporabnika)
**Google Ads / Meta Ads / TikTok Ads:**
- CPC (cost per click): €0.50 - €2.00
- Conversion rate: 2-5%
- **CAC (Customer Acquisition Cost): €20-40/uporabnik**

**Organsko:**
- SEO, social media, word-of-mouth: ~€5/uporabnik

---

## 💵 2. SKUPNI STROŠKI NA UPORABNIKA

### Mesečni operativni stroški:
```
DeepSeek API:        $0.09  (€0.08)
Stripe fees:         €0.30
Infrastruktura:      €0.06
────────────────────────────────
SKUPAJ: ~€0.44/uporabnik/mesec
```

### Enkratni stroški:
```
CAC (pridobitev):    €20-40 (paid ads)
                     €5-10 (organic)
```

---

## 🎯 3. CENOVNA STRATEGIJA

### Opcija A: AGRESIVNO RAST (nizka cena)
**€4.99/mesec ali €49.99/leto**

**Analiza:**
```
Mesečni prihodek:        €4.99
Stripe fee:              -€0.30
DeepSeek + infra:        -€0.14
────────────────────────────────
Profit na mesec:         €4.55

CAC (paid ads):          €30
Break-even:              6.6 mesecev
LTV (12 mesecev):        €54.60
LTV/CAC ratio:           1.82 ⚠️
```

**Zaključek:** Premalo profitabilno za paid ads! Potrebuješ organsko rast.

---

### Opcija B: BALANSIRANA (priporočeno) ✅
**€9.99/mesec ali €89.99/leto (10% popust)**

**Analiza:**
```
Mesečni prihodek:        €9.99
Stripe fee:              -€0.30
DeepSeek + infra:        -€0.14
────────────────────────────────
Profit na mesec:         €9.55

CAC (paid ads):          €30
Break-even:              3.1 meseca
LTV (12 mesecev):        €114.60
LTV/CAC ratio:           3.82 ✅ (odlično!)
LTV (24 mesecev):        €229.20
Retention 50% @ 12M:     €172.20
```

**Letno:**
```
Letni prihodek:          €89.99
Stripe fee (1× €0.54):   -€0.54
DeepSeek + infra (12×):  -€1.68
────────────────────────────────
Profit na leto:          €87.77 (97.5% margin!)
```

**Zaključek:** Odličen LTV/CAC ratio! Profitabilno že po 3 mesecih.

---

### Opcija C: PREMIUM
**€14.99/mesec ali €149.99/leto**

**Analiza:**
```
Mesečni prihodek:        €14.99
Stripe fee:              -€0.30
DeepSeek + infra:        -€0.14
────────────────────────────────
Profit na mesec:         €14.55

CAC (paid ads):          €30
Break-even:              2.1 meseca
LTV (12 mesecev):        €174.60
LTV/CAC ratio:           5.82 ✅✅ (izvrstno!)
```

**Ampak:** Nižja conversion rate (verjetno -30-50%)

---

## 📈 4. PROJEKCIJE PRIHODKOV

### Scenario: €9.99/mesec (priporočena cena)

| Uporabniki | Mesečni prihodek | Letni prihodek | Profit (letni, 95%) |
|------------|------------------|----------------|---------------------|
| 100        | €999             | €11,988        | €11,388             |
| 500        | €4,995           | €59,940        | €56,943             |
| 1,000      | €9,990           | €119,880       | €113,886            |
| 5,000      | €49,950          | €599,400       | €569,430            |
| 10,000     | €99,900          | €1,198,800     | €1,138,860          |

**Opomba:** To predpostavlja 70% retention po 12 mesecih.

---

## 🎓 5. KONKURENČNA ANALIZA

### Podobne aplikacije:
| App          | Cena/mesec | Target       | Features          |
|--------------|------------|--------------|-------------------|
| Photomath    | €9.99      | K-12         | Photo → solution  |
| Symbolab     | €6.99      | K-12, Uni    | Step-by-step      |
| Mathway      | €9.99      | K-12, Uni    | Multi-topic       |
| Wolfram|Alpha| €6.99      | Uni, Pro     | Advanced math     |
| **Pluto.si** | **€9.99**  | **SLO K-12** | **AI tutor + exercises** |

**Tvoja prednost:**
- 🇸🇮 Slovenščina (+ 7 drugih jezikov)
- 🎓 Curriculum-aligned content (slovenski učni načrt)
- 🤖 Conversational AI tutor
- 📊 Progressive difficulty exercises
- 💰 Competitive pricing

---

## 💡 6. STRATEGIJA MAKSIMIZACIJE ZASLUŽKA

### A) Launch Strategy (mesec 1-3):
```
✅ 3-day free trial (brez kreditne kartice)
✅ Early bird: €7.99/mesec (lifetime) za prvih 100
✅ Referral program: 1 mesec free za obe strani
✅ Študentski popust: 20% off z @uni.si emailom
```

### B) Growth Strategy (mesec 3-12):
```
✅ SEO: Blog posts za "matematika pomoč", "reševanje enačb"
✅ YouTube: Tutoriali v slovenščini
✅ TikTok/IG Reels: Kratki math tricks
✅ Partnership z učitelji/šolami
✅ Affiliate program: 30% komisije za 3 mesece
```

### C) Monetization Optimization:
```
✅ Annual plan: €89.99/leto (2 meseca free)
✅ Family plan: €14.99/mesec (do 3 uporabnikov)
✅ School license: €199/razred/leto (25 učencev)
```

---

## 🚀 7. REALNA PROJEKCIJA (1 LETO)

**Predpostavke:**
- Launch: Januar 2025
- Marketing budget: €500/mesec (prvi 6 mesecev)
- Organic growth: 20% MoM po mesecu 6
- Paid ads: €30 CAC, 2% conversion

**Mesec po mesec:**

| Mesec | Marketing € | Novi users | Total users | MRR €    | Stroški € | Profit € |
|-------|-------------|------------|-------------|----------|-----------|----------|
| 1     | €500        | 30         | 30          | €300     | -€200     | €100     |
| 2     | €500        | 35         | 55          | €550     | -€150     | €400     |
| 3     | €500        | 40         | 85          | €850     | -€100     | €750     |
| 6     | €500        | 70         | 250         | €2,500   | €0        | €2,500   |
| 12    | €200        | 120        | 1,000       | €10,000  | €400      | €9,600   |

**Po 12 mesecih:**
```
Mesečni prihodek (MRR):  €10,000
Letni prihodek (ARR):    €120,000
Skupni profit (leto 1):  ~€50,000 - €70,000
```

**Če dodaš še šolske licence (5 šol × €199 × 10 razredov):**
```
+ €10,000/leto dodatnega prihodka
```

---

## 🎯 8. PRIPOROČILO

### Cenovna struktura:
```
🔹 Mesečno:  €9.99
🔹 Letno:    €89.99 (10% popust)
🔹 Študent:  €7.99 (z @uni.si)
🔹 Family:   €14.99 (3 uporabniki)
🔹 Šola:     €199/razred/leto
```

### Zakaj €9.99?
✅ Sweet spot: dostopno + profitabilno  
✅ LTV/CAC = 3.82 (odlično za SaaS)  
✅ Break-even v 3 mesecih  
✅ €114.60 profit/uporabnik/leto  
✅ Konkurenčno z Photomath, Mathway  

### Potencialni zaslužek:
```
500 uporabnikov:   ~€50,000/leto
1000 uporabnikov:  ~€110,000/leto
5000 uporabnikov:  ~€570,000/leto
```

**S šolskimi licencami in organsko rastjo lahko presežeš €100k ARR v 12-18 mesecih!** 🚀

---

## 📝 NASLEDNJI KORAKI

1. ✅ Dodaj Stripe payment flow (že implementirano)
2. ✅ Nastavi trial period (3 dni, že narejeno)
3. 🔄 Dodaj referral sistem
4. 🔄 Ustvari landing page z jasnimi cenami
5. 🔄 Launch early bird akcija (€7.99)
6. 🔄 Začni z content marketing (blog, YouTube)
7. 🔄 Kontaktiraj šole za pilot program

---

**Avtor:** Pluto.si Business Analysis  
**Datum:** Oktober 2025  
**Verzija:** 1.0
