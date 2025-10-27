# 🧪 Testing Checklist - Pluto.si

Complete manual testing guide for all functionality.

---

## ✅ **AUTHENTICATION**

### 1. **User Registration**
- [ ] Navigate to `/auth/register`
- [ ] Enter valid email and password (min 6 chars)
- [ ] Click "Register"
- [ ] **Expected:** Success message, confirmation email sent
- [ ] Try to register with SAME email again
- [ ] **Expected:** "⚠️ Ta email naslov je že registriran..."
- [ ] Try password < 6 characters
- [ ] **Expected:** Browser validation error

### 2. **User Login**
- [ ] Navigate to `/auth/login`
- [ ] Enter valid credentials
- [ ] Click "Log in"
- [ ] **Expected:** Redirect to `/app`, cookies set
- [ ] Try invalid credentials
- [ ] **Expected:** "❌ Invalid email or password..."
- [ ] Try unconfirmed email
- [ ] **Expected:** Error message about email confirmation

### 3. **Password Reset**
- [ ] Navigate to `/auth/forgot-password`
- [ ] Enter registered email
- [ ] Click "Send reset link"
- [ ] **Expected:** Success message
- [ ] Check email inbox
- [ ] **Expected:** Email with reset link
- [ ] Click reset link
- [ ] **Expected:** Redirect to `/auth/reset-password`
- [ ] Enter new password
- [ ] **Expected:** Password updated, redirect to login
- [ ] Try to reset with NON-EXISTENT email
- [ ] **Expected:** Success message (security: don't reveal if email exists)

### 4. **Rate Limit Testing**
- [ ] Try password reset 5+ times quickly
- [ ] **Expected:** "❌ Too many requests. Please wait 1 minute..."
- [ ] Wait 2 minutes
- [ ] Try again
- [ ] **Expected:** Works again

### 5. **Delete Account**
- [ ] Log in
- [ ] Navigate to `/settings`
- [ ] Click "Delete Account"
- [ ] **Expected:** Confirmation dialog (multi-language)
- [ ] Click "Confirm"
- [ ] **Expected:** Account deleted, cookies cleared, redirect to home
- [ ] Try to log in with deleted account
- [ ] **Expected:** "Invalid email or password"

---

## ✅ **UI/UX**

### 6. **Multi-language Support**
- [ ] Change language in header dropdown
- [ ] **Expected:** All UI elements translated
- [ ] Topics in sidebar translated
- [ ] Exercise difficulty labels translated
- [ ] Settings page translated
- [ ] Register/Login forms translated
- [ ] Error messages translated

### 7. **Mobile Responsiveness**
- [ ] Open on mobile device or browser DevTools mobile view
- [ ] **Expected:** Sidebar hidden, hamburger menu visible
- [ ] Click hamburger menu
- [ ] **Expected:** Sidebar slides in from left
- [ ] Click outside sidebar or close button
- [ ] **Expected:** Sidebar closes
- [ ] Header responsive
- [ ] Forms responsive
- [ ] Chat composer responsive

### 8. **Dark Mode** (if applicable)
- [ ] Toggle dark mode
- [ ] **Expected:** All UI elements support dark mode

---

## ✅ **MATH FUNCTIONALITY**

### 9. **Math Keyboard**
- [ ] Click on each category button
- [ ] **Expected:** Different symbols appear
- [ ] Click on symbol button
- [ ] **Expected:** Symbol inserted at cursor position
- [ ] Test: ^ (power), ∫ (integral), √ (root), ÷ (fraction)
- [ ] Test templates (integral, power, root, fraction, piecewise)
- [ ] **Expected:** Template dialog appears

### 10. **Chat with AI**
- [ ] Type math question (e.g., "What is 2+2?")
- [ ] Click "Send" or press Enter
- [ ] **Expected:** AI responds with answer
- [ ] Type in different languages (SL, EN, IT, DE, FR, ES, PL, RO)
- [ ] **Expected:** AI responds in selected language

### 11. **Graph Rendering**
- [ ] Ask: "Draw the function f(x) = x^2"
- [ ] **Expected:** Graph appears below message
- [ ] Ask: "Graph y = sin(x)"
- [ ] **Expected:** Sine wave graph
- [ ] Ask: "Plot x^2 + y^2 = 1"
- [ ] **Expected:** Circle graph

### 12. **Image OCR (Math Solving)**
- [ ] Take photo or screenshot of math problem
- [ ] Drag and drop onto chat composer
- [ ] **Expected:** Image preview appears
- [ ] **Expected:** Text extracted from image
- [ ] **Expected:** Text sent to AI for solving
- [ ] **Expected:** AI responds with solution

### 13. **Exercise Generation**
- [ ] Click on topic in sidebar (e.g., "Algebra")
- [ ] **Expected:** "Razmišljam..." indicator
- [ ] **Expected:** Exercise generated with difficulty badge
- [ ] Click "Rešitev" button
- [ ] **Expected:** Step-by-step solution
- [ ] Click "Naslednja naloga" button
- [ ] **Expected:** Slightly harder exercise
- [ ] Continue clicking "Next"
- [ ] **Expected:** Difficulty increases progressively

---

## ✅ **SUBSCRIPTION & PAYMENTS**

### 14. **Trial User Experience**
- [ ] Register new account
- [ ] **Expected:** 3-day trial starts
- [ ] Check `/settings` page
- [ ] **Expected:** "Trial ends on [date]" message
- [ ] **Expected:** "Upgrade to Plus" button visible
- [ ] Use app for 3 days
- [ ] **Expected:** Access blocked after trial expires
- [ ] **Expected:** Redirect to `/trial-expired` page

### 15. **Upgrade Flow**
- [ ] Click "Upgrade to Plus" button (header or banner)
- [ ] **Expected:** Direct redirect to Stripe Checkout
- [ ] **Expected:** NO redirect to `/settings` page
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Enter CVC: `123`, Date: `12/25`
- [ ] Complete checkout
- [ ] **Expected:** Redirect back to `/chat?payment=success`
- [ ] **Expected:** User still logged in
- [ ] Check `/settings` page
- [ ] **Expected:** "Active subscription" message
- [ ] **Expected:** "Manage Subscription" button visible

### 16. **Payment Management**
- [ ] Click "Manage Subscription" button
- [ ] **Expected:** Redirect to Stripe Customer Portal
- [ ] Update payment method
- [ ] Cancel subscription
- [ ] **Expected:** Subscription status updated in app

---

## ✅ **SETTINGS & USER MANAGEMENT**

### 17. **Settings Page**
- [ ] Navigate to `/settings`
- [ ] **Expected:** User email displayed
- [ ] **Expected:** Subscription status displayed
- [ ] **Expected:** "Change Password" section
- [ ] **Expected:** "Delete Account" section
- [ ] **Expected:** All text in selected language

### 18. **Change Password**
- [ ] Enter current password (incorrect)
- [ ] **Expected:** Error message
- [ ] Enter correct current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] **Expected:** Password updated
- [ ] Log out and log in with NEW password
- [ ] **Expected:** Login successful

---

## ✅ **ERROR HANDLING**

### 19. **Network Errors**
- [ ] Disable internet connection
- [ ] Try to send message
- [ ] **Expected:** Error message displayed
- [ ] Re-enable internet
- [ ] **Expected:** Retry works

### 20. **API Errors**
- [ ] Try to register with invalid email format
- [ ] **Expected:** Browser validation error
- [ ] Try to login with non-existent email
- [ ] **Expected:** "Invalid email or password" (security: don't reveal if email exists)

---

## ✅ **PERFORMANCE**

### 21. **Loading States**
- [ ] Send chat message
- [ ] **Expected:** "Razmišljam..." with bouncing dots
- [ ] Click on exercise
- [ ] **Expected:** "Razmišljam..." indicator
- [ ] Upload image
- [ ] **Expected:** "Processing image..." indicator

### 22. **Scroll Behavior**
- [ ] Send multiple messages
- [ ] **Expected:** Auto-scroll to bottom
- [ ] Scroll up to read previous messages
- [ ] **Expected:** Stays at scrolled position (not forcing to bottom)

---

## ✅ **SECURITY**

### 23. **Cookie Handling**
- [ ] Log in
- [ ] Check browser cookies
- [ ] **Expected:** `sb-access-token` and `sb-refresh-token` set
- [ ] Log out
- [ ] **Expected:** Cookies cleared
- [ ] Try to access `/app` directly
- [ ] **Expected:** Redirect to landing page

### 24. **Session Management**
- [ ] Log in
- [ ] Close browser
- [ ] Reopen browser
- [ ] Navigate to `/app`
- [ ] **Expected:** Still logged in (session persisted)

---

## ✅ **EDGE CASES**

### 25. **Very Long Math Expressions**
- [ ] Type extremely long LaTeX expression
- [ ] **Expected:** No overflow, renders correctly

### 26. **Special Characters**
- [ ] Type message with special chars: `!@#$%^&*()`
- [ ] **Expected:** Handled correctly

### 27. **Empty Inputs**
- [ ] Click "Send" with empty message
- [ ] **Expected:** Button disabled or no action

### 28. **File Upload Edge Cases**
- [ ] Upload non-image file
- [ ] **Expected:** Error or ignored
- [ ] Upload very large image (>10MB)
- [ ] **Expected:** Error message or compression

---

## ✅ **BROWSER COMPATIBILITY**

### 29. **Cross-browser Testing**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] **Expected:** All functions work identically

---

## 📊 **TESTING METRICS**

### Completion Status:
- **Total Tests:** 29 categories
- **Passed:** ___ / 29
- **Failed:** ___ / 29
- **Skipped:** ___ / 29

### Known Issues:
(Note any bugs found during testing)

1. ____________________________
2. ____________________________
3. ____________________________

---

**Last Updated:** January 2025
**Tested By:** ________________
**Environment:** Production / Staging

