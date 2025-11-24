# Nigerland Consult - Fasthost VPS Deployment Guide

## 📋 Prerequisites

### On Your Fasthost VPS:
- Ubuntu Server (20.04 or later)
- Root/sudo access
- MySQL installed and running
- Domain pointed to VPS IP (nigerlandconsult.com)

### Required Information:
- VPS IP Address
- MySQL root password
- SSH access credentials

## 🚀 Quick Deployment Steps

### Step 1: Connect to Your VPS
```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Upload Application Files

From your local machine, upload the entire project:
```bash
# Create a zip of the project (exclude node_modules and .git)
zip -r nigerland.zip backend frontend deployment -x "*node_modules*" "*.git*" "*__pycache__*"

# Upload to VPS
scp nigerland.zip root@YOUR_VPS_IP:/tmp/

# On VPS, extract files
ssh root@YOUR_VPS_IP
mkdir -p /var/www/nigerland
cd /var/www/nigerland
unzip /tmp/nigerland.zip
```

### Step 3: Configure Environment Variables

#### Backend (.env)
Edit `/var/www/nigerland/backend/.env`:
```bash
nano /var/www/nigerland/backend/.env
```

Update MySQL password:
```env
MYSQL_PASSWORD="your_mysql_root_password"
```

#### Frontend (.env)
Edit `/var/www/nigerland/frontend/.env`:
```bash
nano /var/www/nigerland/frontend/.env
```

Ensure it contains:
```env
REACT_APP_BACKEND_URL=https://nigerlandconsult.com
```

### Step 4: Run Deployment Script

```bash
cd /var/www/nigerland/deployment
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Install all system dependencies
2. Setup Python virtual environment
3. Install backend Python packages
4. Create MySQL database
5. Migrate data from MongoDB export to MySQL
6. Build React frontend
7. Configure Nginx
8. Setup SSL certificate with Let's Encrypt
9. Start backend service

### Step 5: Verify Deployment

1. **Check Backend Status:**
```bash
systemctl status backend
journalctl -u backend -f
```

2. **Check Nginx Status:**
```bash
systemctl status nginx
nginx -t
```

3. **Test API:**
```bash
curl https://nigerlandconsult.com/api/books
```

4. **Visit Website:**
Open browser: https://nigerlandconsult.com

## 🔧 Manual Step-by-Step Deployment

If you prefer manual deployment or the script fails:

### 1. Install System Dependencies
```bash
apt update
apt install -y python3 python3-pip python3-venv nginx mysql-server \
    libmysqlclient-dev pkg-config certbot python3-certbot-nginx \
    curl git build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g yarn
```

### 2. Setup Application Directory
```bash
mkdir -p /var/www/nigerland
cd /var/www/nigerland
# Upload your files here
```

### 3. Setup Python Backend
```bash
cd /var/www/nigerland/backend
python3 -m venv /var/www/nigerland/venv
source /var/www/nigerland/venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure MySQL
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE nigerland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 5. Setup Environment Files
```bash
cd /var/www/nigerland/backend
cp .env.production .env
# Edit .env and set MYSQL_PASSWORD
nano .env
```

### 6. Migrate Database
```bash
cd /var/www/nigerland/backend
source /var/www/nigerland/venv/bin/activate
python3 migrate_to_mysql.py
```

### 7. Build Frontend
```bash
cd /var/www/nigerland/frontend
cp .env.production .env
yarn install
yarn build
```

### 8. Configure Nginx
```bash
cp /var/www/nigerland/deployment/nginx.conf /etc/nginx/sites-available/nigerland
ln -sf /etc/nginx/sites-available/nigerland /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 9. Setup SSL Certificate
```bash
certbot --nginx -d nigerlandconsult.com -d www.nigerlandconsult.com
```

### 10. Setup Backend Service
```bash
cp /var/www/nigerland/deployment/backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable backend
systemctl start backend
systemctl status backend
```

## 🔍 Troubleshooting

### Backend Won't Start
```bash
# Check logs
journalctl -u backend -n 50

# Check if port 8001 is in use
ss -tlnp | grep 8001

# Restart backend
systemctl restart backend
```

### Frontend Not Loading
```bash
# Check Nginx logs
tail -f /var/log/nginx/error.log

# Verify build exists
ls -la /var/www/nigerland/frontend/build/

# Restart Nginx
systemctl restart nginx
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u root -p nigerland_db

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Verify .env file
cat /var/www/nigerland/backend/.env | grep MYSQL
```

### SSL Certificate Issues
```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew --dry-run

# If failed, try manual setup
certbot certonly --nginx -d nigerlandconsult.com
```

## 🔄 Updating the Application

### Backend Updates
```bash
cd /var/www/nigerland/backend
source /var/www/nigerland/venv/bin/activate
# Update code
git pull  # or upload new files
pip install -r requirements.txt
systemctl restart backend
```

### Frontend Updates
```bash
cd /var/www/nigerland/frontend
# Update code
git pull  # or upload new files
yarn install
yarn build
# No restart needed - Nginx serves static files
```

## 📊 Monitoring

### Check Application Health
```bash
# Backend status
systemctl status backend

# Nginx status
systemctl status nginx

# MySQL status
systemctl status mysql

# View backend logs in real-time
journalctl -u backend -f

# View Nginx access logs
tail -f /var/log/nginx/access.log

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# Create backup
mysqldump -u root -p nigerland_db > /backups/nigerland_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p nigerland_db < /backups/nigerland_20250101.sql
```

## 🔐 Security Recommendations

1. **Change Default Passwords:**
   - Update MySQL root password
   - Change admin panel default password
   - Update JWT secret key in .env

2. **Configure Firewall:**
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

3. **Setup Automatic Backups:**
```bash
# Add to crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * mysqldump -u root -pYOUR_PASSWORD nigerland_db > /backups/nigerland_$(date +\%Y\%m\%d).sql
```

4. **Enable Fail2Ban:**
```bash
apt install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

## 📞 Support

If you encounter issues during deployment:
1. Check the troubleshooting section
2. Review logs: `journalctl -u backend -n 100`
3. Verify all environment variables are correctly set
4. Ensure domain DNS is properly configured

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://nigerlandconsult.com
- [ ] Admin panel accessible at /admin
- [ ] Payment system working (test with small amount)
- [ ] Email notifications working
- [ ] All pages load correctly
- [ ] Book purchase flow working
- [ ] Conference registration working
- [ ] Contact form submitting correctly
- [ ] Admin CRUD operations functional
- [ ] SSL certificate valid
- [ ] Backups configured
- [ ] Firewall configured
- [ ] Default passwords changed

---

**Deployment Date:** _____________
**Deployed By:** _____________
**VPS IP:** _____________
