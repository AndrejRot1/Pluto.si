# 🔐 Google OAuth Setup - Navodila

## Kaj so Google OAuth credentials?

**Client ID** in **Client Secret** sta identifikatorja, ki jih Google potrebuje, da ve, kdo poskuša uporabiti Google login. To je podobno kot uporabniško ime in geslo za dostop do Google API-ja.

---

## 📋 KORAKI ZA NASTAVITEV

### 1. Google Cloud Console Setup

1. **Odpri Google Cloud Console**
   - Pojdi na: https://console.cloud.google.com
   - Prijavi se s svojim Google računom

2. **Ustvari ali izberi projekt**
   - Če nimaš projekta: klikni "Create Project"
   - Ime projekta: npr. "Pluto.si" ali "Pluto App"
   - Klikni "Create"

3. **Omogoči Google+ API**
   - V levem meniju: **APIs & Services** → **Library**
   - Poišči "Google+ API" ali "Google Identity Services"
   - Klikni "Enable"

4. **Ustvari OAuth credentials**
   - Pojdi na: **APIs & Services** → **Credentials**
   - Klikni **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   
   - Če te vpraša za "OAuth consent screen":
     - **User Type**: "External" (za javno aplikacijo)
     - **App name**: "Pluto.si"
     - **User support email**: tvoj email
     - **Developer contact**: tvoj email
     - Klikni "Save and Continue"
     - **Scopes**: klikni "Save and Continue" (default je dovolj)
     - **Test users**: klikni "Save and Continue" (za testiranje)
     - Klikni "Back to Dashboard"

5. **Ustvari OAuth Client ID**
   - **Application type**: "Web application"
   - **Name**: "Pluto.si Web Client"
   
   - **Authorized redirect URIs** (DODAJ VSE):
     ```
     https://vbmtvnqnpsbgnxasejcg.supabase.co/auth/v1/callback
     http://localhost:5174/auth/callback
     https://teachmathai.com/auth/callback
     https://www.teachmathai.com/auth/callback
     ```
   
   - Klikni **"Create"**

6. **Kopiraj credentials**
   - Prikaže se okno z **Client ID** in **Client Secret**
   - **Kopiraj oba** (ali jih shrani varno)
   - Primer:
     - Client ID: `123456789-abc123def456.apps.googleusercontent.com`
     - Client Secret: `GOCSPX-abc123def456ghi789`

---

### 2. Supabase Setup

1. **Odpri Supabase Dashboard**
   - Pojdi na: https://supabase.com/dashboard
   - Izberi svoj projekt

2. **Omogoči Google Provider**
   - Pojdi na: **Authentication** → **Providers**
   - Poišči **"Google"** v seznamu
   - Klikni toggle, da ga **vklopiš** (ON)

3. **Vnesi credentials**
   - **Client ID (for OAuth)**: prilepi Client ID iz Google Cloud Console
   - **Client Secret (for OAuth)**: prilepi Client Secret iz Google Cloud Console
   - Klikni **"Save"**

4. **Nastavi Redirect URLs**
   - Pojdi na: **Authentication** → **URL Configuration**
   - V **Redirect URLs** dodaj (vsak v svojo vrstico):
     ```
     http://localhost:5174/auth/callback
     https://teachmathai.com/auth/callback
     https://www.teachmathai.com/auth/callback
     ```
   - **POMEMBNO**: Ne uporabljaj wildcards `/**`!
   - Klikni **"Save"**

---

## ✅ PREVERJANJE

1. **Preveri Google Cloud Console**:
   - **APIs & Services** → **Credentials**
   - Preveri, da je OAuth client ID ustvarjen
   - Preveri, da so redirect URIs pravilno nastavljeni

2. **Preveri Supabase**:
   - **Authentication** → **Providers** → **Google**
   - Preveri, da je toggle ON
   - Preveri, da sta Client ID in Client Secret vnesena

3. **Testiraj**:
   - Odpri `/auth/register` ali `/auth/login`
   - Klikni "Continue with Google"
   - Morala bi se odpreti Google prijavna stran
   - Po prijavi bi moral biti redirect na `/auth/callback` in nato na `/app`

---

## 🔒 VARNOST

- **Client Secret** je občutljiv podatek - ne ga deliti javno
- Ne commitaj Client Secret v git (če ga slučajno dodaš, ga takoj spremeni)
- Uporabljaj različne credentials za development in production

---

## ❓ POGOSTE NAPAKE

### "redirect_uri_mismatch"
- **Vzrok**: Redirect URI v Google Cloud Console se ne ujema s tistim, ki ga uporablja Supabase
- **Rešitev**: Preveri, da so vsi redirect URIs dodani v Google Cloud Console

### "invalid_client"
- **Vzrok**: Napačen Client ID ali Client Secret v Supabase
- **Rešitev**: Preveri, da sta pravilno kopirana (brez presledkov)

### "access_denied"
- **Vzrok**: OAuth consent screen ni pravilno nastavljen
- **Rešitev**: Preveri OAuth consent screen v Google Cloud Console

---

## 📝 POVZETEK

1. ✅ Google Cloud Console → Ustvari projekt
2. ✅ Omogoči Google+ API
3. ✅ Ustvari OAuth Client ID (Web application)
4. ✅ Dodaj redirect URIs
5. ✅ Kopiraj Client ID in Client Secret
6. ✅ Supabase → Authentication → Providers → Google → ON
7. ✅ Vnesi Client ID in Client Secret
8. ✅ Dodaj redirect URIs v Supabase
9. ✅ Testiraj Google login

**Čas nastavitve**: ~10-15 minut

