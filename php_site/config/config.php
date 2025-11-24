<?php
// Application Configuration

// Database Configuration
define('DB_HOST', getenv('MYSQL_HOST') ?: 'localhost');
define('DB_USER', getenv('MYSQL_USER') ?: 'root');
define('DB_PASS', getenv('MYSQL_PASSWORD') ?: '');
define('DB_NAME', getenv('MYSQL_DATABASE') ?: 'nigerland_db');

// Site Configuration
define('SITE_NAME', 'Nigerland Consult Limited');
define('SITE_URL', getenv('FRONTEND_URL') ?: 'https://nigerlandconsult.com');
define('ADMIN_EMAIL', 'info@nigerlandconsult.com');

// Paystack Configuration
define('PAYSTACK_PUBLIC_KEY', getenv('PAYSTACK_PUBLIC_KEY') ?: 'YOUR_PUBLIC_KEY');
define('PAYSTACK_SECRET_KEY', getenv('PAYSTACK_SECRET_KEY') ?: 'YOUR_SECRET_KEY');

// SendGrid Configuration
define('SENDGRID_API_KEY', getenv('SENDGRID_API_KEY') ?: 'YOUR_SENDGRID_KEY');
define('SENDGRID_FROM_EMAIL', getenv('SENDGRID_FROM_EMAIL') ?: 'info@nigerlandconsult.com');
define('SENDGRID_FROM_NAME', getenv('SENDGRID_FROM_NAME') ?: 'Nigerland Consult Limited');

// JWT Configuration
define('JWT_SECRET', getenv('JWT_SECRET_KEY') ?: 'your-secret-key-change-in-production');
define('JWT_EXPIRATION', 86400); // 24 hours

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
session_start();

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Africa/Lagos');
