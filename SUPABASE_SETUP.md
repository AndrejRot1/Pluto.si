# Nastavitev novega Supabase projekta

Stari Supabase projekt je bil izbrisan. Sledi korakom spodaj.

## 1. Ustvari nov projekt

1. Odpri [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → ime npr. `pluto-si`, geslo za bazo, regija (Frankfurt)
3. Počakaj ~2 minuti, da se projekt ustvari

## 2. Nastavi bazo

1. V Supabase Dashboard → **SQL Editor**
2. Odpri datoteko `setup-fresh-supabase.sql` iz tega repozitorija
3. Kopiraj vsebino in klikni **Run**

Če projekt že obstaja in manjkata tabela `subscriptions` / zaščita billing polj, zaženi še:
`migrate-secure-billing.sql`

## 3. Nastavi Auth

**Authentication → URL Configuration:**

- **Site URL:** `http://localhost:5174`
- **Redirect URLs** (dodaj vsakega posebej):
  ```
  http://localhost:5174/auth/confirm
  http://127.0.0.1:5174/auth/confirm
  ```

Za produkcijo dodaj še svoj domen (npr. `https://teachmathai.com/auth/confirm`).

**Authentication → Providers → Email:** pusti vklopljeno (Confirm email = ON za produkcijo).

## 4. Kopiraj API ključe

**Project Settings → API:**

| Spremenljivka | Kje jo najdeš |
|---|---|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (tajno!) |

## 5. Posodobi `.env`

V **korenu projekta** (`.env`, ne `routes/.env`):

```env
SUPABASE_URL=https://TVOJ-PROJEKT.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Za brskalnik (islands) — isti URL in anon key:
VITE_SUPABASE_URL=https://TVOJ-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

DEEPSEEK_API_KEY=tvoj-deepseek-key
```

## 6. Zaženi aplikacijo

```bash
deno task dev
```

Odpri http://localhost:5174 in registriraj testni račun.

## Trial model

Brezplačni preskus je **usage-based**: **10 AI pomoči** (`trial_helps_used`), ne 3 dni.

Če imaš že ustvarjen projekt, zaženi v SQL Editorju:
1. `migrate-usage-trial.sql`
2. `migrate-subjects-progress.sql` (napredek + learning_events)

## Kaj je izgubljeno?

- Vsi stari uporabniki in gesla
- Trial podatki
- Stripe customer ID-ji (če jih imaš, jih moraš ponovno povezati)

## Kaj še deluje brez baze?

- Chat (DeepSeek API)
- Vaje in demo strani
- Landing page

## Google OAuth

1. V Google Cloud Console ustvari OAuth Client (Web) in dodaj redirect URI:
```
https://TVOJ-PROJEKT.supabase.co/auth/v1/callback
```
2. V Supabase → **Authentication → Providers → Google** vklopi provider in vnesi Client ID + Secret.
3. V Supabase → **Authentication → URL Configuration → Redirect URLs** dodaj:
```
http://localhost:5174/auth/callback
https://teachmathai.com/auth/callback
https://www.teachmathai.com/auth/callback
```

Podrobna navodila: `GOOGLE_OAUTH_SETUP.md`.
