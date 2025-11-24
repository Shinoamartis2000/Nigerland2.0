# Security Policy

## 🔐 Sensitive Information

This repository **DOES NOT** contain any API keys, passwords, or sensitive credentials in the codebase.

All sensitive information must be stored in `.env` files which are:
- ✅ Listed in `.gitignore`
- ✅ Never committed to the repository
- ✅ Created from `.env.example` templates

## 🛡️ Required Credentials

You need to obtain your own credentials from:

### 1. Paystack API Keys
- **Get them:** https://dashboard.paystack.com/#/settings/developer
- **What you need:**
  - Public Key (pk_test_... or pk_live_...)
  - Secret Key (sk_test_... or sk_live_...)

### 2. SendGrid API Key
- **Get it:** https://app.sendgrid.com/settings/api_keys
- **What you need:**
  - API Key with "Full Access" permissions
  - Verified sender email/domain

### 3. MySQL Database
- **What you need:**
  - Database username (usually 'root')
  - Database password (set during MySQL installation)
  - Database name (nigerland_db)

### 4. JWT Secret
- **Generate a strong secret:**
  ```bash
  openssl rand -base64 32
  ```

## 📝 Setup Instructions

1. **Copy environment template:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Add your credentials to `backend/.env`:**
   ```env
   MYSQL_PASSWORD="your_actual_password"
   PAYSTACK_SECRET_KEY="your_actual_paystack_key"
   SENDGRID_API_KEY="your_actual_sendgrid_key"
   JWT_SECRET_KEY="your_generated_secret"
   ```

3. **Verify .env is ignored:**
   ```bash
   git status
   # .env should NOT appear in the list
   ```

## ⚠️ What NOT to Do

- ❌ Never commit `.env` files
- ❌ Never hardcode API keys in code
- ❌ Never share API keys publicly
- ❌ Never use production keys in development
- ❌ Never commit database passwords

## ✅ What TO Do

- ✅ Use `.env.example` as template
- ✅ Keep `.env` in `.gitignore`
- ✅ Use environment variables for all secrets
- ✅ Rotate API keys regularly
- ✅ Use test keys in development
- ✅ Use strong passwords (min 32 characters for JWT)

## 🔍 If You Find Exposed Secrets

If you discover any exposed API keys or credentials:

1. **Immediately revoke** the exposed keys
2. **Generate new keys** from the service provider
3. **Update your .env file** with new keys
4. **Report the incident** to info@nigerlandconsult.com

## 📚 Additional Resources

- [How to Secure API Keys](https://github.com/security/best-practices)
- [Environment Variables Best Practices](https://12factor.net/config)
- [Git Secrets Prevention](https://git-secret.io/)

---

**Security is everyone's responsibility!**
