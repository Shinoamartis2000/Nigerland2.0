# 🚀 Setup Instructions - Start Here!

## ⚠️ Important: API Keys Required

This application requires API keys that you must obtain yourself. **No API keys are included in this repository.**

---

## Step 1: Get Your API Keys

### A. Paystack (Payment Processing)

1. Go to https://paystack.com
2. Create an account or login
3. Navigate to: **Settings → API Keys & Webhooks**
4. Copy both keys:
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

**Note:** Use **test keys** for development, **live keys** for production.

### B. SendGrid (Email Service)

1. Go to https://sendgrid.com
2. Create an account or login
3. Navigate to: **Settings → API Keys**
4. Click **"Create API Key"**
5. Name it (e.g., "Nigerland Consult")
6. Select **"Full Access"**
7. Copy the API key (starts with `SG.`)

**Important:** Also verify your sender email:
- Go to **Settings → Sender Authentication**
- Verify your domain or single sender email

### C. MySQL Database

During MySQL installation, you set a root password. You'll need this.

If you forgot it:
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```

### D. JWT Secret Key

Generate a secure random key:
```bash
openssl rand -base64 32
```

Or use: https://www.random.org/strings/

---

## Step 2: Configure Backend

```bash
cd backend

# Copy the template
cp .env.example .env

# Open .env file
nano .env  # or use any text editor
```

**Fill in your credentials:**

```env
# MySQL Configuration
MYSQL_USER="root"
MYSQL_PASSWORD="YOUR_MYSQL_PASSWORD_HERE"
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_DATABASE="nigerland_db"

# Application URLs
CORS_ORIGINS="*"
FRONTEND_URL="http://localhost:3000"

# Paystack Configuration
PAYSTACK_PUBLIC_KEY="pk_test_YOUR_KEY_HERE"
PAYSTACK_SECRET_KEY="sk_test_YOUR_KEY_HERE"

# SendGrid Configuration
SENDGRID_API_KEY="SG.YOUR_KEY_HERE"
SENDGRID_FROM_EMAIL="your-verified-email@yourdomain.com"
SENDGRID_FROM_NAME="Nigerland Consult Limited"

# JWT Configuration
JWT_SECRET_KEY="YOUR_GENERATED_SECRET_KEY_HERE"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24
```

Save and close the file.

---

## Step 3: Install & Run

### Install Dependencies

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
yarn install
```

### Setup Database

```bash
# Create database
mysql -u root -p
> CREATE DATABASE nigerland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# Import schema and data
mysql -u root -p nigerland_db < Nigerland_Database.sql
mysql -u root -p nigerland_db < insert_sample_data.sql
```

### Run Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
yarn start
```

---

## Step 4: Test Everything

### Test Backend

Open: http://localhost:8001/docs

You should see the API documentation.

### Test Frontend

Open: http://localhost:3000

You should see the homepage with books.

### Test Admin

1. Go to: http://localhost:3000/admin
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. You should see the admin dashboard

---

## ✅ Checklist

- [ ] Obtained Paystack API keys
- [ ] Obtained SendGrid API key
- [ ] Verified SendGrid sender email
- [ ] Generated JWT secret key
- [ ] Created `backend/.env` file
- [ ] Added all credentials to `.env`
- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Created MySQL database
- [ ] Imported database schema
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Can access admin panel
- [ ] Books page loads correctly

---

## 🐛 Troubleshooting

### "Module not found" errors

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules
yarn install
```

### "Database connection failed"

- Check MySQL is running: `systemctl status mysql`
- Verify password in `.env` matches MySQL root password
- Test: `mysql -u root -p -e "USE nigerland_db; SELECT 1;"`

### "401 Unauthorized" from Paystack

- Double-check your Paystack secret key
- Make sure you copied the entire key
- Verify no extra spaces in `.env` file

### "SendGrid errors"

- Verify your API key is correct
- Check sender email is verified in SendGrid dashboard
- Ensure email address matches verified sender

---

## 📚 Next Steps

Once everything is working:

1. **Change admin password** (in admin panel)
2. **Test payment flow** with Paystack test cards
3. **Test email notifications**
4. **Read deployment guide** (`VPS_DEPLOYMENT_GUIDE.md`)

---

## 🔐 Security Reminder

- ✅ `.env` files are in `.gitignore` - they won't be committed
- ✅ Never share your API keys publicly
- ✅ Use test keys in development
- ✅ Switch to live keys only in production

---

**Need Help?**

Check `SECURITY.md` and `README.md` for more information.

**Questions?** Email: info@nigerlandconsult.com
