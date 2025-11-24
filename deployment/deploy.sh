#!/bin/bash

# Nigerland Consult Deployment Script for Fasthost VPS
# Run this script on your VPS as root

set -e

echo "====================================="
echo "Nigerland Consult Deployment Script"
echo "====================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root${NC}"
   exit 1
fi

echo -e "${GREEN}Step 1: Installing System Dependencies${NC}"
apt update
apt install -y python3 python3-pip python3-venv nginx mysql-server libmysqlclient-dev pkg-config certbot python3-certbot-nginx curl git

echo -e "${GREEN}Step 2: Installing Node.js and Yarn${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g yarn

echo -e "${GREEN}Step 3: Creating Application Directory${NC}"
mkdir -p /var/www/nigerland
cd /var/www/nigerland

echo -e "${GREEN}Step 4: Setting up Python Virtual Environment${NC}"
python3 -m venv venv
source venv/bin/activate

echo -e "${YELLOW}Please upload your application files to /var/www/nigerland${NC}"
echo -e "${YELLOW}Upload both 'backend' and 'frontend' folders${NC}"
read -p "Press Enter after uploading files..."

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: backend or frontend directory not found!${NC}"
    exit 1
fi

echo -e "${GREEN}Step 5: Installing Backend Dependencies${NC}"
cd /var/www/nigerland/backend
pip install -r requirements.txt

echo -e "${GREEN}Step 6: MySQL Database Setup${NC}"
echo -e "${YELLOW}Creating MySQL database...${NC}"
mysql -e "CREATE DATABASE IF NOT EXISTS nigerland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo -e "${GREEN}Database created!${NC}"

echo -e "${GREEN}Step 7: Running Database Migration${NC}"
cp .env.production .env
echo -e "${YELLOW}Please edit /var/www/nigerland/backend/.env and set your MySQL password${NC}"
read -p "Press Enter after editing .env file..."

python3 migrate_to_mysql.py

echo -e "${GREEN}Step 8: Building Frontend${NC}"
cd /var/www/nigerland/frontend
cp .env.production .env
yarn install
yarn build

echo -e "${GREEN}Step 9: Configuring Nginx${NC}"
cp /var/www/nigerland/deployment/nginx.conf /etc/nginx/sites-available/nigerland
ln -sf /etc/nginx/sites-available/nigerland /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo -e "${GREEN}Step 10: Setting up SSL Certificate${NC}"
echo -e "${YELLOW}Running Certbot...${NC}"
certbot --nginx -d nigerlandconsult.com -d www.nigerlandconsult.com

echo -e "${GREEN}Step 11: Setting up Backend Service${NC}"
cp /var/www/nigerland/deployment/backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable backend
systemctl start backend

echo -e "${GREEN}Step 12: Checking Service Status${NC}"
systemctl status backend --no-pager

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "Your application is now running at:"
echo -e "${GREEN}https://nigerlandconsult.com${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  View backend logs: journalctl -u backend -f"
echo -e "  Restart backend: systemctl restart backend"
echo -e "  Restart nginx: systemctl restart nginx"
echo -e "  Check backend status: systemctl status backend"
echo ""
