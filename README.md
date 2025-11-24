# Nigerland Consult Website

Professional consulting services website with e-commerce, conference registration, and admin management.

## 🚀 Features

- **E-Book Store** - Purchase and download books
- **Conference Registration** - Register and pay for conferences  
- **Training Programs** - Enroll in training courses
- **MoreLife Sessions** - Book counseling sessions
- **Admin Dashboard** - Comprehensive content management
- **Payment Integration** - Paystack payment gateway
- **Email Notifications** - SendGrid email service

## 🛠️ Tech Stack

**Frontend:** React 18, Tailwind CSS, Shadcn UI  
**Backend:** Python FastAPI, SQLAlchemy, MySQL  
**Services:** Paystack, SendGrid

## 🔧 Quick Start

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env and add your API keys
```

### 2. Database Setup

```bash
mysql -u root -p
CREATE DATABASE nigerland_db;
EXIT;

mysql -u root -p nigerland_db < Nigerland_Database.sql
mysql -u root -p nigerland_db < insert_sample_data.sql
```

### 3. Frontend Setup

```bash
cd frontend
yarn install
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
```

### 4. Run Application

```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate
uvicorn server:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend && yarn start
```

## 🔐 Required API Keys

**Get your API keys from:**

1. **Paystack:** https://dashboard.paystack.com/#/settings/developer
2. **SendGrid:** https://app.sendgrid.com/settings/api_keys

Add them to `backend/.env`:

```env
PAYSTACK_PUBLIC_KEY="pk_test_xxxxx"
PAYSTACK_SECRET_KEY="sk_test_xxxxx"
SENDGRID_API_KEY="SG.xxxxx"
```

⚠️ **Never commit .env files to Git!**

## 👤 Admin Access

- **URL:** http://localhost:3000/admin
- **Username:** admin
- **Password:** admin123

**Change password in production!**

## 📦 Deployment

See `VPS_DEPLOYMENT_GUIDE.md` for complete deployment instructions.

## 📚 Documentation

- `VPS_DEPLOYMENT_GUIDE.md` - Production deployment
- `SENDGRID_PAYSTACK_SETUP.md` - API setup guide
- API Docs: http://localhost:8001/docs (when running)

## ⚠️ Security Checklist

- [ ] Change admin password
- [ ] Use production API keys
- [ ] Enable HTTPS
- [ ] Set strong JWT secret
- [ ] Never commit .env files

## 📞 Support

**Email:** info@nigerlandconsult.com  
**Website:** https://nigerlandconsult.com

---

Built by Nigerland Consult Limited
