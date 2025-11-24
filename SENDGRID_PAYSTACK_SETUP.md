# SendGrid & Paystack Configuration Guide

## Issue: Emails Not Sending & Payment Initialization Failing

Both SendGrid (emails) and Paystack (payments) are returning **401 Unauthorized** errors.

---

## 🔧 Fix 1: SendGrid Email Configuration

### Problem
- SendGrid API returning 401 Unauthorized
- Emails not being sent for registrations, purchases, etc.

### Root Cause
Domain "nigerlandconsult.com" is not verified in SendGrid, OR the API key is invalid.

### Solution Options:

#### **Option A: Verify Your Domain (Recommended for Production)**

1. **Login to SendGrid Dashboard**
   - Go to: https://app.sendgrid.com/login
   - Use your SendGrid account credentials

2. **Navigate to Sender Authentication**
   - Click on **Settings** in the left sidebar
   - Click **Sender Authentication**

3. **Authenticate Your Domain**
   - Click **"Authenticate Your Domain"**
   - Choose your DNS host (e.g., GoDaddy, Namecheap, Cloudflare)
   - Follow the wizard to add DNS records:
     - **CNAME records** for email authentication
     - **TXT records** for domain verification

4. **Add DNS Records**
   - Go to your domain registrar (where you bought nigerlandconsult.com)
   - Add the CNAME and TXT records provided by SendGrid
   - Example records:
     ```
     Type: CNAME
     Name: em1234.nigerlandconsult.com
     Value: u1234567.wl123.sendgrid.net
     
     Type: CNAME
     Name: s1._domainkey.nigerlandconsult.com
     Value: s1.domainkey.u1234567.wl123.sendgrid.net
     ```

5. **Verify Domain**
   - Return to SendGrid dashboard
   - Click **"Verify"** button
   - SendGrid will check your DNS records (may take 24-48 hours)

6. **Update Email Sender (After Verification)**
   - Keep current `.env` setting:
     ```
     SENDGRID_FROM_EMAIL="info@nigerlandconsult.com"
     ```

---

#### **Option B: Use Single Sender Verification (Quick Fix for Testing)**

1. **Login to SendGrid Dashboard**
   - https://app.sendgrid.com/login

2. **Go to Sender Identity**
   - Settings → Sender Authentication
   - Click **"Verify a Single Sender"**

3. **Add Your Email Address**
   - Click **"Create New Sender"**
   - Fill in the form:
     - **From Name**: Nigerland Consult Limited
     - **From Email Address**: **YOUR_GMAIL_OR_VERIFIED_EMAIL**
     - Reply To: Same as From Email
     - Company Address: Your business address
     - City, State, Zip, Country

4. **Verify Email**
   - SendGrid will send a verification email to the address you entered
   - Click the verification link in that email

5. **Update Backend Environment Variable**
   - Edit `/app/backend/.env`:
     ```bash
     # Replace with your verified email
     SENDGRID_FROM_EMAIL="your-verified-email@gmail.com"
     ```

6. **Restart Backend**
   ```bash
   sudo supervisorctl restart backend
   ```

---

#### **Option C: Check/Regenerate API Key**

If domain/sender is verified but still getting 401:

1. **Go to API Keys Section**
   - Settings → API Keys
   - https://app.sendgrid.com/settings/api_keys

2. **Check Current Key Status**
   - Look for your API key (starts with `SG.`)
   - Check if it's **Active**

3. **Create New API Key (If Needed)**
   - Click **"Create API Key"**
   - Name: `Nigerland Consult Website`
   - API Key Permissions: **Full Access** (or Mail Send)
   - Click **"Create & View"**
   - **COPY THE KEY IMMEDIATELY** (you won't see it again)

4. **Update Backend Environment Variable**
   - Edit `/app/backend/.env`:
     ```bash
     SENDGRID_API_KEY="SG.YOUR_NEW_API_KEY_HERE"
     ```

5. **Restart Backend**
   ```bash
   sudo supervisorctl restart backend
   ```

---

## 💳 Fix 2: Paystack Payment Configuration

### Problem
- Paystack API returning 401 Unauthorized
- Book purchases and MoreLife registrations failing at payment step

### Root Cause
Paystack Live API keys are invalid or expired.

### Solution:

1. **Login to Paystack Dashboard**
   - Go to: https://dashboard.paystack.com/login
   - Use your Paystack account credentials

2. **Navigate to API Keys**
   - Click on **Settings** in the sidebar
   - Click **API Keys & Webhooks**

3. **Check Key Status**
   - You should see:
     - **Public Key** (starts with `pk_live_`)
     - **Secret Key** (starts with `sk_live_`)
   - If keys show as **"Invalid"** or **"Disabled"**, regenerate them

4. **Generate New Keys (If Needed)**
   - Click **"Regenerate Keys"** or **"Generate New Keys"**
   - **IMPORTANT**: Copy both keys immediately
   
5. **Update Backend Environment Variables**
   - Edit `/app/backend/.env`:
     ```bash
     PAYSTACK_PUBLIC_KEY="pk_live_YOUR_NEW_PUBLIC_KEY"
     PAYSTACK_SECRET_KEY="sk_live_YOUR_NEW_SECRET_KEY"
     ```

6. **Restart Backend**
   ```bash
   sudo supervisorctl restart backend
   ```

---

## ✅ Testing After Configuration

### Test SendGrid (Emails)
1. Register for a conference
2. Check if you receive confirmation email
3. Check backend logs:
   ```bash
   tail -n 50 /var/log/supervisor/backend.err.log | grep sendgrid
   ```

### Test Paystack (Payments)
1. Try to purchase a book
2. Should redirect to Paystack payment page
3. Check backend logs:
   ```bash
   tail -n 50 /var/log/supervisor/backend.err.log | grep paystack
   ```

---

## 🚨 Quick Fix Summary

**For immediate testing (use Option B for SendGrid):**

1. Verify a single sender email in SendGrid
2. Update `.env` with your verified email
3. Check Paystack keys are valid
4. Restart backend: `sudo supervisorctl restart backend`

**For production (use Option A for SendGrid):**

1. Authenticate your domain in SendGrid
2. Add DNS records to your domain registrar
3. Wait for verification (24-48 hours)
4. Keep `info@nigerlandconsult.com` as sender

---

## 📞 Need Help?

- **SendGrid Support**: https://support.sendgrid.com
- **SendGrid Docs**: https://docs.sendgrid.com
- **Paystack Support**: https://paystack.com/support
- **Paystack Docs**: https://paystack.com/docs

---

## Current Configuration Files

- Backend env: `/app/backend/.env`
- SendGrid client: `/app/backend/utils/sendgrid_client.py`
- Paystack client: `/app/backend/utils/paystack.py`
