# ⚠️ IMPORTANT: Setup Required Before Running

## 🚨 This Application WILL NOT RUN Without Setup

The application requires API keys that are **NOT included** in this repository for security reasons.

---

## 📝 Quick Setup (5 minutes)

### Step 1: Create Environment File

```bash
cd backend
cp .env.example .env
```

### Step 2: Get Your API Keys

You need 3 sets of credentials:

#### A. Paystack (Payment Gateway)
1. Visit: https://dashboard.paystack.com
2. Sign up or login
3. Go to: Settings → API Keys & Webhooks
4. Copy:
   - Public Key (pk_test_...)
   - Secret Key (sk_test_...)

#### B. SendGrid (Email Service)
1. Visit: https://app.sendgrid.com
2. Sign up or login  
3. Go to: Settings → API Keys
4. Create new API key with "Full Access"
5. Copy the API key (SG....)

#### C. MySQL Password
- Use the password you set during MySQL installation
- If you don't have MySQL installed yet, install it first

### Step 3: Add Keys to .env File

Open `backend/.env` and replace placeholders:

```env
MYSQL_PASSWORD="your_mysql_root_password"
PAYSTACK_PUBLIC_KEY="pk_test_your_actual_key"
PAYSTACK_SECRET_KEY="sk_test_your_actual_key"
SENDGRID_API_KEY="SG.your_actual_key"
JWT_SECRET_KEY="generate_random_32_char_string"
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### Step 4: Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE nigerland_db;"

# Import schema
mysql -u root -p nigerland_db < Nigerland_Database.sql
mysql -u root -p nigerland_db < insert_sample_data.sql
```

### Step 5: Run Application

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload

# Frontend (new terminal)
cd frontend
yarn install
yarn start
```

---

## 📚 Detailed Instructions

For complete setup instructions, see:
- `SETUP_INSTRUCTIONS.md` - Full setup guide
- `README.md` - Project overview
- `SECURITY.md` - Security best practices

---

## ❓ Why Are Keys Not Included?

API keys are sensitive credentials that should NEVER be committed to version control.

**Security Best Practices:**
- ✅ Each developer gets their own API keys
- ✅ Keys are stored in `.env` files (ignored by Git)
- ✅ Production uses different keys than development
- ✅ Keys can be revoked if compromised

---

## 🆘 Need Help?

1. Read `SETUP_INSTRUCTIONS.md` for step-by-step guide
2. Check `SECURITY.md` for common issues
3. Email: info@nigerlandconsult.com

---

**Don't skip this setup - the application cannot function without API keys!**
