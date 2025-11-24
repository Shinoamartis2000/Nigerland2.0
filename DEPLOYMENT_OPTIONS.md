# Nigerland Consult - Deployment Options Guide

## 🎯 You Have Two Database Options

Your application is **currently running on MongoDB** (working perfectly).

I've provided both database systems so you can choose:
1. **Option A:** Deploy with MongoDB (Recommended - Less setup)
2. **Option B:** Deploy with MySQL (Optional - Traditional SQL)

---

## 📦 What You Have

### Working MongoDB Version (Current) ✅
- All backend files configured for MongoDB
- 58 records in MongoDB
- Tested and working perfectly
- **Located in:** `/app/backend/` (active files)

### MySQL Version (Optional) 📋
- All backend files converted to MySQL/SQLAlchemy
- Ready to use if you prefer MySQL
- **Located in:** `/app/backend/*_mysql_version.py`
- **SQL Schema:** `/app/Nigerland_Database.sql`
- **Migration Script:** `/app/backend/migrate_to_mysql.py`

---

## 🚀 OPTION A: Deploy with MongoDB (Recommended)

### Why Choose MongoDB?
- ✅ Already working perfectly
- ✅ Less setup required
- ✅ Faster deployment
- ✅ All data already in place

### Deployment Steps

#### 1. Upload to VPS
```bash
# From local machine
cd /app
zip -r nigerland_mongodb.zip backend frontend deployment mongodb_export.json \
    -x "*node_modules*" "*__pycache__*" "*.git*" "*_mysql_version.py"

scp nigerland_mongodb.zip root@YOUR_VPS_IP:/tmp/
```

#### 2. On VPS - Install Dependencies
```bash
ssh root@YOUR_VPS_IP

# Install system packages
apt update
apt install -y python3 python3-pip python3-venv nginx mongodb \
    certbot python3-certbot-nginx curl git nodejs npm

# Install Node.js 18 and Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g yarn

# Start MongoDB
systemctl start mongodb
systemctl enable mongodb
```

#### 3. Setup Application
```bash
# Extract files
mkdir -p /var/www/nigerland
cd /var/www/nigerland
unzip /tmp/nigerland_mongodb.zip

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt

# Configure environment
nano .env
# Update FRONTEND_URL to: https://nigerlandconsult.com
# Update CORS_ORIGINS to: https://nigerlandconsult.com,https://www.nigerlandconsult.com
```

#### 4. Restore MongoDB Data
```bash
# Import the MongoDB export
cd /var/www/nigerland
mongorestore --db nigerland_db --drop mongodb_export_folder/
# Or if you have JSON files:
mongoimport --db nigerland_db --collection books --file mongodb_export.json --jsonArray
# Repeat for each collection
```

#### 5. Build Frontend
```bash
cd /var/www/nigerland/frontend
nano .env
# Set: REACT_APP_BACKEND_URL=https://nigerlandconsult.com
yarn install
yarn build
```

#### 6. Configure Nginx
```bash
# Update nginx config for MongoDB version
nano /etc/nginx/sites-available/nigerland

# Use this config:
server {
    listen 80;
    server_name nigerlandconsult.com www.nigerlandconsult.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nigerlandconsult.com www.nigerlandconsult.com;

    # SSL (will be configured by certbot)
    
    root /var/www/nigerland/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
ln -sf /etc/nginx/sites-available/nigerland /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

#### 7. Setup SSL
```bash
certbot --nginx -d nigerlandconsult.com -d www.nigerlandconsult.com
```

#### 8. Setup Backend Service
```bash
nano /etc/systemd/system/backend.service

# Add:
[Unit]
Description=Nigerland Consult Backend
After=network.target mongodb.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/nigerland/backend
Environment="PATH=/var/www/nigerland/venv/bin"
ExecStart=/var/www/nigerland/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target

# Start service
systemctl daemon-reload
systemctl enable backend
systemctl start backend
systemctl status backend
```

---

## 🗄️ OPTION B: Deploy with MySQL (Optional)

### Why Choose MySQL?
- Traditional SQL database
- Familiar to many developers
- Better for complex reporting
- Industry standard for many hosting providers

### Deployment Steps

#### 1. Upload to VPS
```bash
# From local machine
cd /app
zip -r nigerland_mysql.zip backend frontend deployment \
    Nigerland_Database.sql mongodb_export.json \
    -x "*node_modules*" "*__pycache__*" "*.git*" "*_mongodb_backup.py"

scp nigerland_mysql.zip root@YOUR_VPS_IP:/tmp/
```

#### 2. On VPS - Install Dependencies
```bash
ssh root@YOUR_VPS_IP

# Install system packages
apt update
apt install -y python3 python3-pip python3-venv nginx mysql-server \
    libmysqlclient-dev pkg-config certbot python3-certbot-nginx \
    curl git nodejs npm

# Install Node.js 18 and Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g yarn
```

#### 3. Setup MySQL Database
```bash
# Secure MySQL installation
mysql_secure_installation

# Create database
mysql -u root -p

# In MySQL:
CREATE DATABASE nigerland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import SQL schema
mysql -u root -p nigerland_db < /var/www/nigerland/Nigerland_Database.sql
```

#### 4. Switch to MySQL Backend Files
```bash
cd /var/www/nigerland/backend

# Activate MySQL versions
mv server.py server_mongodb.py
mv routes_admin.py routes_admin_mongodb.py
mv conference_payment.py conference_payment_mongodb.py
mv routes_morelife.py routes_morelife_mongodb.py
mv routes_training.py routes_training_mongodb.py

# Use MySQL versions
mv server_mysql_version.py server.py
mv routes_admin_mysql_version.py routes_admin.py
mv conference_payment_mysql_version.py conference_payment.py
mv routes_morelife_mysql_version.py routes_morelife.py
mv routes_training_mysql_version.py routes_training.py

# Setup Python environment
python3 -m venv /var/www/nigerland/venv
source /var/www/nigerland/venv/bin/activate
pip install -r requirements.txt
```

#### 5. Configure MySQL Environment
```bash
nano /var/www/nigerland/backend/.env

# Set these:
MYSQL_USER="root"
MYSQL_PASSWORD="YOUR_MYSQL_ROOT_PASSWORD"
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_DATABASE="nigerland_db"
FRONTEND_URL="https://nigerlandconsult.com"
CORS_ORIGINS="https://nigerlandconsult.com,https://www.nigerlandconsult.com"
# ... (keep other variables)
```

#### 6. Migrate Data from MongoDB Export
```bash
cd /var/www/nigerland/backend
python3 migrate_to_mysql.py
# This will import all 58 records from mongodb_export.json to MySQL
```

#### 7. Complete Steps 5-8 from Option A
Follow the same frontend build, Nginx, SSL, and service setup steps as Option A.

---

## 🔄 Switching Between Databases Later

### From MongoDB to MySQL
```bash
cd /var/www/nigerland/backend

# Backup current files
for file in server routes_admin conference_payment routes_morelife routes_training; do
    mv ${file}.py ${file}_mongodb.py
    mv ${file}_mysql_version.py ${file}.py
done

# Update .env for MySQL
# Run migration: python3 migrate_to_mysql.py
# Restart: systemctl restart backend
```

### From MySQL to MongoDB
```bash
cd /var/www/nigerland/backend

# Backup current files
for file in server routes_admin conference_payment routes_morelife routes_training; do
    mv ${file}.py ${file}_mysql.py
    mv ${file}_mongodb.py ${file}.py
done

# Update .env for MongoDB
# Restart: systemctl restart backend
```

---

## 📋 Quick Reference

### MongoDB (Current/Recommended)
- **Pros:** Already working, faster setup, flexible schema
- **Setup Time:** ~30 minutes
- **Database:** MongoDB 5.0+
- **Active Files:** `server.py`, `routes_admin.py`, etc.

### MySQL (Optional)
- **Pros:** Traditional SQL, familiar, good reporting
- **Setup Time:** ~45 minutes
- **Database:** MySQL 8.0+
- **Conversion:** Use `migrate_to_mysql.py` script
- **SQL Schema:** `Nigerland_Database.sql`

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://nigerlandconsult.com
- [ ] SSL certificate is valid
- [ ] Admin login works (/admin)
- [ ] Books load and purchase works
- [ ] Conference registration works
- [ ] Payment processing works (test with small amount)
- [ ] Contact form submits
- [ ] Email notifications send
- [ ] All admin CRUD operations work

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
systemctl status mongodb

# Check MongoDB logs
tail -f /var/log/mongodb/mongodb.log

# Test connection
mongo nigerland_db --eval "db.books.count()"
```

### MySQL Connection Issues
```bash
# Check MySQL status
systemctl status mysql

# Check MySQL logs
tail -f /var/log/mysql/error.log

# Test connection
mysql -u root -p -e "USE nigerland_db; SHOW TABLES;"
```

### Backend Won't Start
```bash
# Check backend logs
journalctl -u backend -n 50

# Check if port is in use
ss -tlnp | grep 8001

# Restart backend
systemctl restart backend
```

---

## 📞 Support Files Included

1. **MongoDB Export:** `mongodb_export.json` (58 records)
2. **SQL Schema:** `Nigerland_Database.sql`
3. **Migration Script:** `backend/migrate_to_mysql.py`
4. **MySQL Backend:** `backend/*_mysql_version.py`
5. **MongoDB Backend:** `backend/*_mongodb_backup.py` or active files
6. **Deployment Scripts:** `deployment/` folder

---

**Recommendation:** Start with **Option A (MongoDB)** since it's already working perfectly. You can always switch to MySQL later if needed.

Good luck with your deployment! 🚀
