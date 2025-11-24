-- ================================================
-- Nigerland Consult Database Export
-- Database: nigerland_db
-- Export Date: 2025-11-15
-- Total Records: 58
-- ================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS nigerland_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nigerland_db;

-- ================================================
-- TABLE STRUCTURES
-- ================================================

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    pdf_url TEXT,
    is_paid BOOLEAN DEFAULT TRUE,
    category VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Book Purchases Table
CREATE TABLE IF NOT EXISTS book_purchases (
    id VARCHAR(36) PRIMARY KEY,
    purchase_id VARCHAR(20) UNIQUE NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_reference VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_purchase_id (purchase_id),
    INDEX idx_email (email),
    INDEX idx_payment_reference (payment_reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conference Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id VARCHAR(36) PRIMARY KEY,
    registration_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    organization VARCHAR(255),
    profession VARCHAR(255),
    conference VARCHAR(255) NOT NULL,
    conference_date VARCHAR(100),
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_reference VARCHAR(100),
    amount DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_registration_id (registration_id),
    INDEX idx_email (email),
    INDEX idx_payment_reference (payment_reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conferences Table
CREATE TABLE IF NOT EXISTS conferences (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    date VARCHAR(100),
    location VARCHAR(255),
    fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    image TEXT,
    `order` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    image TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    `order` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Training Programs Table
CREATE TABLE IF NOT EXISTS training_programs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    duration VARCHAR(100),
    fee DECIMAL(10,2),
    objectives TEXT,
    target_audience VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Training Enrollments Table
CREATE TABLE IF NOT EXISTS training_enrollments (
    id VARCHAR(36) PRIMARY KEY,
    enrollment_id VARCHAR(20) UNIQUE NOT NULL,
    program_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    organization VARCHAR(255),
    position VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_reference VARCHAR(100),
    amount DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_enrollment_id (enrollment_id),
    INDEX idx_email (email),
    INDEX idx_payment_reference (payment_reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MoreLife Assessments Table
CREATE TABLE IF NOT EXISTS morelife_assessments (
    id VARCHAR(36) PRIMARY KEY,
    assessment_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    age INT,
    education VARCHAR(255),
    specific_challenge TEXT,
    likely_cause TEXT,
    duration_of_challenge VARCHAR(255),
    triggering_incident TEXT,
    on_drugs VARCHAR(50),
    commencement_month VARCHAR(100),
    session_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_reference VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_email (email),
    INDEX idx_payment_reference (payment_reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- DATA INSERTS (Exported from MongoDB)
-- ================================================

-- Insert Admin (1 record)
-- Note: Password is hashed with bcrypt
INSERT INTO admins (id, username, password, email, created_at) VALUES
('8a2f4e1d-7c3b-4f9a-a1e2-5b6c7d8e9f0a', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5yvZ5L8KGvqse', 'admin@nigerlandconsult.com', '2025-11-15 10:00:00');

-- Note: The remaining data (10 books, 11 book purchases, 17 registrations, 8 contacts, 2 team members, 3 projects, 2 announcements, 4 morelife assessments) 
-- should be inserted using the migrate_to_mysql.py script which reads from mongodb_export.json
-- This ensures data integrity and proper format conversion

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_book_purchases_status ON book_purchases(payment_status, created_at);
CREATE INDEX idx_registrations_status ON registrations(payment_status, created_at);
CREATE INDEX idx_contacts_status_date ON contacts(status, created_at);

-- ================================================
-- NOTES
-- ================================================
-- 1. This SQL file creates the database structure
-- 2. To import actual data, run: python3 migrate_to_mysql.py
-- 3. The migration script reads from mongodb_export.json
-- 4. All 58 records will be properly migrated
-- 5. Default admin: username=admin, password=admin123 (CHANGE IN PRODUCTION!)
-- ================================================
