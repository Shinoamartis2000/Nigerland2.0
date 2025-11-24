<?php
// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Database
define('DB_HOST', $_ENV['MYSQL_HOST'] ?? 'localhost');
define('DB_USER', $_ENV['MYSQL_USER'] ?? 'root');
define('DB_PASS', $_ENV['MYSQL_PASSWORD'] ?? '');
define('DB_NAME', $_ENV['MYSQL_DATABASE'] ?? 'nigerland_db');

// Site
define('SITE_NAME', 'Nigerland Consult Limited');
define('SITE_URL', 'https://nigerlandconsult.com');

// API Keys
define('PAYSTACK_PUBLIC_KEY', $_ENV['PAYSTACK_PUBLIC_KEY'] ?? '');
define('PAYSTACK_SECRET_KEY', $_ENV['PAYSTACK_SECRET_KEY'] ?? '');
define('SENDGRID_API_KEY', $_ENV['SENDGRID_API_KEY'] ?? '');
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'change-this-secret-key');

// Start session
session_start();

// Error handling
ini_set('display_errors', 1);
error_reporting(E_ALL);
date_default_timezone_set('Africa/Lagos');
