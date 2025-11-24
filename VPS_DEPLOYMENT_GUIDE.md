# Nigerland Consult - VPS Deployment Guide (MySQL)

## 🎯 Complete MySQL Setup for Fasthost VPS

This guide will deploy your Nigerland Consult website to your Fasthost VPS with **MySQL database only** (no MongoDB).

---

## 📋 Prerequisites

- Fasthost VPS with Ubuntu (20.04 or later)
- Root SSH access
- Domain: nigerlandconsult.com pointed to VPS IP

---

## 🚀 Complete Deployment Steps

### Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Install System Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y python3 python3-pip python3-venv nginx \
    mariadb-server mariadb-client libmariadb-dev \
    certbot python3-certbot-nginx curl git build-essential

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Yarn
npm install -g yarn

# Verify installations
python3 --version
node --version
yarn --version
mysql --version
```

### Step 3: Setup MySQL Database

```bash
# Start MySQL service
systemctl start mariadb
systemctl enable mariadb

# Secure MySQL installation (optional but recommended)
mysql_secure_installation
# Answer:
# - Set root password? [Y/n] Y (enter a strong password)
# - Remove anonymous users? [Y/n] Y
# - Disallow root login remotely? [Y/n] Y
# - Remove test database? [Y/n] Y
# - Reload privilege tables? [Y/n] Y

# Create database
mysql -u root -p << 'SQL'
CREATE DATABASE nigerland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EXIT;
SQL
```

### Step 4: Upload Application Files

**From your local machine:**

```bash
# Create deployment package (run this where your project is)
cd /path/to/your/app
zip -r nigerland.zip backend frontend deployment \
    Nigerland_Database.sql insert_sample_data.sql \
    -x "*node_modules*" "*__pycache__*" "*.git*" "*venv*"

# Upload to VPS
scp nigerland.zip root@YOUR_VPS_IP:/tmp/
```

**On VPS:**

```bash
# Extract files
mkdir -p /var/www/nigerland
cd /var/www/nigerland
unzip /tmp/nigerland.zip
```

### Step 5: Import Database Schema and Data

```bash
cd /var/www/nigerland

# Import database schema
mysql -u root -p nigerland_db < Nigerland_Database.sql

# Import sample data
mysql -u root -p nigerland_db < insert_sample_data.sql

# Verify data imported
mysql -u root -p -e "USE nigerland_db; SELECT COUNT(*) as total_books FROM books;"
# Should show 10 books
```

### Step 6: Setup Python Backend

```bash
cd /var/www/nigerland/backend

# Create virtual environment
python3 -m venv /var/www/nigerland/venv
source /var/www/nigerland/venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure environment variables
nano .env
```

**Update your `.env` file:**

```env
# MySQL Configuration
MYSQL_USER="root"
MYSQL_PASSWORD="YOUR_MYSQL_ROOT_PASSWORD"
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_DATABASE="nigerland_db"

# Application URLs
CORS_ORIGINS="https://nigerlandconsult.com,https://www.nigerlandconsult.com"
FRONTEND_URL="https://nigerlandconsult.com"

# Paystack Configuration
PAYSTACK_PUBLIC_KEY="YOUR_PAYSTACK_PUBLIC_KEY"
PAYSTACK_SECRET_KEY="YOUR_PAYSTACK_SECRET_KEY"

# SendGrid Configuration
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"
SENDGRID_FROM_EMAIL="info@nigerlandconsult.com"
SENDGRID_FROM_NAME="Nigerland Consult Limited"

# JWT Configuration
JWT_SECRET_KEY="GENERATE_A_STRONG_SECRET_KEY_HERE"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24
```

**Test backend:**

```bash
# Start test server
source /var/www/nigerland/venv/bin/activate
cd /var/www/nigerland/backend
uvicorn server:app --host 0.0.0.0 --port 8001 &

# Test API
curl http://localhost:8001/api/
curl http://localhost:8001/api/books

# If working, kill test server
pkill -f uvicorn
```

### Step 7: Build Frontend

```bash
cd /var/www/nigerland/frontend

# Configure environment
nano .env
```

**Add to `.env`:**

```env
REACT_APP_BACKEND_URL=https://nigerlandconsult.com
```

**Build frontend:**

```bash
yarn install
yarn build

# Verify build
ls -la build/
```

### Step 8: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/nigerland
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name nigerlandconsult.com www.nigerlandconsult.com;
    
    # Will be redirected to HTTPS after SSL setup
    
    root /var/www/nigerland/frontend/build;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files with caching
    location /static {
        alias /var/www/nigerland/frontend/build/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Assets
    location /assets {
        alias /var/www/nigerland/frontend/build/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
}
```

**Enable site:**

```bash
# Enable site
ln -sf /etc/nginx/sites-available/nigerland /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 9: Setup SSL Certificate

```bash
# Install SSL certificate with Let's Encrypt
certbot --nginx -d nigerlandconsult.com -d www.nigerlandconsult.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)

# Verify SSL
curl -I https://nigerlandconsult.com
```

### Step 10: Setup Backend Service

```bash
# Create systemd service file
nano /etc/systemd/system/backend.service
```

**Add this configuration:**

```ini
[Unit]
Description=Nigerland Consult Backend API
After=network.target mariadb.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/nigerland/backend
Environment="PATH=/var/www/nigerland/venv/bin"
ExecStart=/var/www/nigerland/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**Start service:**

```bash
# Reload systemd
systemctl daemon-reload

# Enable service to start on boot
systemctl enable backend

# Start service
systemctl start backend

# Check status
systemctl status backend

# View logs
journalctl -u backend -f
```

### Step 11: Configure Firewall (Optional but Recommended)

```bash
# Install UFW if not installed
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### Step 12: Verify Deployment

```bash
# Check all services are running
systemctl status nginx
systemctl status backend
systemctl status mariadb

# Test API
curl https://nigerlandconsult.com/api/
curl https://nigerlandconsult.com/api/books

# Check backend logs
journalctl -u backend -n 50

# Check Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://nigerlandconsult.com
- [ ] SSL certificate is valid (green padlock)
- [ ] API endpoints respond correctly
- [ ] Admin login works (https://nigerlandconsult.com/admin)
- [ ] Books page loads with all 10 books
- [ ] Conference registration form works
- [ ] Contact form works
- [ ] Payment system initializes (test with Paystack)

**Admin Login:**
- URL: https://nigerlandconsult.com/admin
- Username: `admin`
- Password: `admin123`
- ⚠️ **CHANGE THIS PASSWORD IMMEDIATELY!**

---

## 🔧 Common Commands

### Service Management

```bash
# Restart backend
systemctl restart backend

# Restart Nginx
systemctl restart nginx

# View backend logs
journalctl -u backend -f

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

### Database Management

```bash
# Access MySQL
mysql -u root -p

# Backup database
mysqldump -u root -p nigerland_db > /backups/nigerland_$(date +%Y%m%d).sql

# Restore database
mysql -u root -p nigerland_db < /backups/nigerland_20250101.sql

# View database tables
mysql -u root -p -e "USE nigerland_db; SHOW TABLES;"

# Count records
mysql -u root -p -e "USE nigerland_db; 
SELECT 'books' as table_name, COUNT(*) as count FROM books
UNION SELECT 'registrations', COUNT(*) FROM registrations
UNION SELECT 'contacts', COUNT(*) FROM contacts;"
```

### Update Application

```bash
# Upload new version
scp nigerland_update.zip root@YOUR_VPS_IP:/tmp/

# On VPS
cd /var/www/nigerland
unzip -o /tmp/nigerland_update.zip

# Update backend
systemctl restart backend

# Update frontend (if changed)
cd /var/www/nigerland/frontend
yarn build
systemctl restart nginx
```

---

## 🛡️ Security Recommendations

### 1. Change Default Passwords

```bash
# Change admin panel password
mysql -u root -p nigerland_db

UPDATE admins SET password = '$2b$12$NEW_BCRYPT_HASH' WHERE username = 'admin';
```

### 2. Setup Automatic Backups

```bash
# Create backup directory
mkdir -p /backups

# Add to crontab (daily backup at 2 AM)
crontab -e

# Add this line:
0 2 * * * mysqldump -u root -pYOUR_PASSWORD nigerland_db > /backups/nigerland_$(date +\%Y\%m\%d).sql
```

### 3. Keep SSL Certificate Auto-Renewed

```bash
# Certbot automatically sets up renewal
# Verify renewal works:
certbot renew --dry-run
```

### 4. Monitor Disk Space

```bash
# Check disk usage
df -h

# Check MySQL database size
mysql -u root -p -e "SELECT table_schema AS 'Database', 
ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' 
FROM information_schema.tables 
WHERE table_schema = 'nigerland_db';"
```

---

## 🆘 Troubleshooting

### Backend Won't Start

```bash
# Check logs
journalctl -u backend -n 100

# Check if port is in use
ss -tlnp | grep 8001

# Test Python environment
source /var/www/nigerland/venv/bin/activate
cd /var/www/nigerland/backend
python3 -c "import sqlalchemy; print('SQLAlchemy OK')"
python3 -c "import pymysql; print('PyMySQL OK')"

# Test database connection
python3 -c "
from database import engine
print('Database connection:', engine.url)
"
```

### MySQL Connection Errors

```bash
# Check MySQL status
systemctl status mariadb

# Check MySQL logs
tail -f /var/log/mysql/error.log

# Test connection
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'nigerland%';"
```

### Frontend Not Loading

```bash
# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Verify build directory exists
ls -la /var/www/nigerland/frontend/build/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew

# If renewal fails
certbot delete -d nigerlandconsult.com
certbot --nginx -d nigerlandconsult.com -d www.nigerlandconsult.com
```

---

## 📞 Support

- **GitHub Issues:** (if you have a repo)
- **Email:** info@nigerlandconsult.com
- **Documentation:** See this guide

---

## 🎉 Deployment Complete!

Your Nigerland Consult website is now live at:
**https://nigerlandconsult.com**

Enjoy your new website! 🚀
