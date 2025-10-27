# 📋 Manual Testing Guide - Pluto.si

Step-by-step guide for testing all functionality manually.

---

## 🚀 **QUICK START**

### Prerequisites:
1. Deno server running: `deno task dev` (http://localhost:8000)
2. Browser open (Chrome recommended)
3. Test email account ready
4. Stripe test mode enabled (for payment testing)

---

## 1️⃣ **AUTHENTICATION TESTING**

### Test: User Registration

**Steps:**
1. Navigate to `http://localhost:8000/auth/register`
2. Fill in email: `test@example.com`
3. Fill in password: `test123` (min 6 chars)
4. Click "Start Free Trial" button
5. Wait for success message

**Expected Results:**
- ✅ Success message appears: "Registration successful! Please check your email..."
- ✅ Email sent to test@example.com
- ✅ User account created in Supabase

**Test Duplicate Email:**
1. Try to register again with SAME email
2. **Expected:** "⚠️ Ta email naslov je že registriran. Poskusite se prijaviti ali ponastaviti geslo."

---

### Test: User Login

**Steps:**
1. Navigate to `http://localhost:8000/auth/login`
2. Enter email from registered account
3. Enter password
4. Click "Log in" button
5. Wait for redirect

**Expected Results:**
- ✅ Redirect to `/app` page
- ✅ Session cookies set (check browser DevTools → Application → Cookies)
- ✅ User menu visible in header
- ✅ No error messages

**Test Invalid Credentials:**
1. Enter wrong password
2. **Expected:** "❌ Invalid email or password..."

---

### Test: Password Reset

**Steps:**
1. Navigate to `http://localhost:8000/auth/forgot-password`
2. Enter registered email
3. Click "Send reset link" button
4. Wait for success message

**Expected Results:**
- ✅ Success message: "Email za ponastavitev gesla je bil poslan..."
- ✅ Email received with reset link
- ✅ Click reset link → redirects to `/auth/reset-password`
- ✅ Enter new password → password updated
- ✅ Can log in with new password

---

### Test: Delete Account

**Steps:**
1. Log in to your account
2. Navigate to `/settings`
3. Scroll to "Delete Account" section
4. Click "Delete Account" button
5. Confirm in dialog

**Expected Results:**
- ✅ Confirmation dialog appears (in selected language)
- ✅ Account deleted from Supabase
- ✅ Cookies cleared
- ✅ Redirect to home page
- ✅ Cannot log in with deleted account

---

## 2️⃣ **MATH FUNCTIONALITY TESTING**

### Test: Chat with AI

**Steps:**
1. Navigate to `/app` (logged in)
2. Type in chat: `"What is 2+2?"`
3. Click "Pošlji" or press Enter
4. Wait for response

**Expected Results:**
- ✅ "Razmišljam..." indicator appears (with bouncing dots)
- ✅ AI responds with answer
- ✅ Answer displayed in chat
- ✅ Math formulas render correctly (KaTeX)

**Test Different Languages:**
1. Change language dropdown (e.g., to English)
2. Ask question in English
3. **Expected:** AI responds in English
4. Repeat for other languages (IT, DE, FR, ES, PL, RO)

---

### Test: Graph Rendering

**Steps:**
1. Ask: `"Draw the function f(x) = x^2"`
2. Wait for response
3. Check if graph appears

**Expected Results:**
- ✅ AI responds with explanation
- ✅ Graph container visible below message
- ✅ Function plotted correctly
- ✅ X and Y axes visible
- ✅ Grid/labels visible

**Test Multiple Graphs:**
1. Ask: `"Graph y = sin(x)"`
2. Ask: `"Plot x^2 + y^2 = 1"` (circle)
3. **Expected:** Different graphs rendered correctly

---

### Test: Image OCR (Math Solving)

**Steps:**
1. Take photo or screenshot of math problem (with text/equations)
2. Drag and drop onto chat composer
3. Wait for processing

**Expected Results:**
- ✅ "Processing image..." indicator appears
- ✅ Image preview displayed in chat
- ✅ Text extracted from image
- ✅ AI analyzes and solves the problem
- ✅ Solution displayed

**Test with Non-math Image:**
1. Upload regular photo (landscape, no text)
2. **Expected:** Error or "No text extracted" message

---

### Test: Exercise Generation

**Steps:**
1. Open sidebar (topics menu)
2. Click on a topic (e.g., "Algebra")
3. Wait for exercise to generate

**Expected Results:**
- ✅ "Razmišljam..." indicator
- ✅ Exercise appears in chat with difficulty badge (1/5)
- ✅ Exercise content relevant to topic
- ✅ "Rešitev" button visible

**Test Exercise Progression:**
1. Click "Rešitev" button
2. Wait for solution
3. Click "Naslednja naloga" button
4. **Expected:** New exercise with difficulty 2/5
5. Repeat (3/5, 4/5, 5/5)

---

## 3️⃣ **SUBSCRIPTION & PAYMENTS TESTING**

### Test: Trial User Experience

**Steps:**
1. Register new account
2. Check trial period
3. Navigate to `/settings`

**Expected Results:**
- ✅ "Trial" status displayed
- ✅ "Trial ends on [date]" message (3 days from registration)
- ✅ "Upgrade to Plus" banner visible in chat
- ✅ "Upgrade to Plus" button in header

---

### Test: Upgrade to Plus

**Steps:**
1. Click "Upgrade to Plus" button (anywhere)
2. Wait for redirect
3. Complete Stripe checkout

**Expected Results:**
- ✅ **Direct redirect to Stripe Checkout** (NOT to /settings)
- ✅ Stripe checkout page loads
- ✅ Enter test card: `4242 4242 4242 4242`
- ✅ Enter CVC: `123`, Date: `12/25`
- ✅ Complete payment
- ✅ Redirect back to `/chat?payment=success`
- ✅ Still logged in
- ✅ Subscription status updated to "active"

**Test Upgrade Button Locations:**
1. Header button (desktop)
2. User dropdown menu
3. Chat banner (for trial users)
- ✅ All should redirect to Stripe Checkout

---

### Test: Payment Management

**Steps:**
1. Go to `/settings`
2. Click "Manage Subscription"
3. Check Stripe Customer Portal

**Expected Results:**
- ✅ Redirect to Stripe Customer Portal
- ✅ View subscription details
- ✅ Update payment method
- ✅ Cancel subscription (if desired)

---

## 4️⃣ **UI/UX TESTING**

### Test: Multi-language Support

**Steps:**
1. Open language dropdown in header
2. Select different language (e.g., English)
3. Navigate through pages

**Expected Results:**
- ✅ All UI elements translated
  - Topics in sidebar (e.g., "Algebra" → "Algebra")
  - Exercise difficulty labels
  - Settings page labels
  - Error messages
  - Chat composer buttons
- ✅ Language persisted (refresh page → still in selected language)

---

### Test: Mobile Responsiveness

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Navigate to app

**Expected Results:**
- ✅ Sidebar hidden by default
- ✅ Hamburger menu visible in header
- ✅ Click hamburger → sidebar slides in
- ✅ Forms fit on screen
- ✅ Chat composer accessible
- ✅ Buttons touch-friendly (min 44px height)

---

## 5️⃣ **EDGE CASES TESTING**

### Test: Empty Inputs

**Steps:**
1. Try to send empty message
2. Click "Send" button with empty textarea

**Expected Results:**
- ✅ Button disabled or no action
- ✅ Or browser validation prevents submission

---

### Test: Very Long Messages

**Steps:**
1. Paste very long text (1000+ characters)
2. Try to send

**Expected Results:**
- ✅ No overflow
- ✅ Text wraps correctly
- ✅ Chat scrollable

---

### Test: Special Characters

**Steps:**
1. Type: `!@#$%^&*()[]{}|;:'\",.<>?/~\``
2. Send message

**Expected Results:**
- ✅ Handled correctly
- ✅ No errors
- ✅ Renders properly

---

## 6️⃣ **SECURITY TESTING**

### Test: Cookie Security

**Steps:**
1. Log in
2. Open browser DevTools → Application → Cookies
3. Check cookie flags

**Expected Results:**
- ✅ `sb-access-token` cookie present
- ✅ `sb-refresh-token` cookie present
- ✅ Cookies marked as HttpOnly (in production)
- ✅ Cookies marked as Secure (HTTPS only)

---

### Test: Session Management

**Steps:**
1. Log in
2. Close browser tab
3. Reopen browser
4. Navigate to `/app`

**Expected Results:**
- ✅ Still logged in (session persisted)
- ✅ Cookies maintained
- ✅ No need to log in again

---

## 7️⃣ **ERROR HANDLING TESTING**

### Test: Network Errors

**Steps:**
1. Open browser DevTools → Network tab
2. Set throttling to "Offline"
3. Try to send message

**Expected Results:**
- ✅ Error message displayed
- ✅ "Connection error" or similar
- ✅ User-friendly error message

---

### Test: API Rate Limiting

**Steps:**
1. Send multiple requests quickly (5+ password resets in 1 minute)
2. Wait for rate limit

**Expected Results:**
- ✅ Error message: "Too many requests. Please wait..."
- ✅ Multi-language support
- ✅ Wait 2 minutes → works again

---

## 📊 **TESTING SUMMARY**

### Quick Test Checklist:
- [ ] Registration works
- [ ] Login works
- [ ] Password reset works
- [ ] Delete account works
- [ ] Chat with AI works
- [ ] Graph rendering works
- [ ] Exercise generation works
- [ ] Image OCR works
- [ ] Upgrade to Plus works
- [ ] Multi-language works
- [ ] Mobile responsive
- [ ] Error handling works

### Known Issues:
(List any bugs found)

### Tested On:
- Browser: Chrome / Firefox / Safari / Edge
- Device: Desktop / Mobile
- Date: __________

---

**Last Updated:** January 2025
**Total Test Cases:** 40+

