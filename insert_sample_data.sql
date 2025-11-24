USE nigerland_db;

-- Insert books
INSERT IGNORE INTO books (id, title, description, author, price, image, pdf_url, is_paid, category, created_at) VALUES
('book-001', 'Nigeria\'s Hero Vol 1', 'Inspiring stories of Nigerian heroes and their contributions to nation building', 'Kelechi Ngwaba', 2500, '/assets/books/hero-vol1.jpg', NULL, 1, 'History', NOW()),
('book-002', 'Nigeria\'s Hero Vol 2', 'Continuation of inspiring stories', 'Kelechi Ngwaba', 2500, '/assets/books/hero-vol2.jpg', NULL, 1, 'History', NOW()),
('book-003', 'Yomi and the Three Thieves', 'An engaging children\'s story teaching important life lessons', 'Kelechi Ngwaba', 2000, '/assets/books/yomi.jpg', NULL, 1, 'Children\'s Literature', NOW()),
('book-004', 'Building Nations', 'A guide to nation building principles', 'Kelechi Ngwaba', 3500, '/assets/books/building-nations.jpg', NULL, 1, 'Business', NOW()),
('book-005', 'Tax Planning Guide 2025', 'Comprehensive tax planning strategies', 'Nigerland Consult', 5000, '/assets/books/tax-guide.jpg', NULL, 1, 'Finance', NOW()),
('book-006', 'Leadership Principles', 'Essential leadership skills', 'Kelechi Ngwaba', 3000, '/assets/books/leadership.jpg', NULL, 1, 'Business', NOW()),
('book-007', 'Financial Management', 'Managing your business finances', 'Nigerland Consult', 4500, '/assets/books/finance.jpg', NULL, 1, 'Finance', NOW()),
('book-008', 'Marketing Excellence', 'Modern marketing strategies', 'Nigerland Consult', 4000, '/assets/books/marketing.jpg', NULL, 1, 'Business', NOW()),
('book-009', 'Business Ethics', 'Ethical practices in business', 'Kelechi Ngwaba', 3500, '/assets/books/ethics.jpg', NULL, 1, 'Business', NOW()),
('book-010', 'Strategic Planning', 'Planning for business success', 'Nigerland Consult', 5500, '/assets/books/strategy.jpg', NULL, 1, 'Business', NOW());

-- Insert team members
INSERT IGNORE INTO team_members (id, name, position, bio, image, `order`, created_at) VALUES
('team-001', 'Kelechi Ngwaba', 'CEO & Founder', 'Visionary leader with 20+ years experience in consulting', '/assets/team/kelechi.jpg', 1, NOW()),
('team-002', 'Uduak Nkanga Ngwaba', 'Managing Director', 'Expert in business development and strategy', '/assets/team/uduak.jpg', 2, NOW());

-- Insert projects
INSERT IGNORE INTO projects (id, title, description, image, category, status, `order`, created_at) VALUES
('proj-001', 'Children Foundation', 'Supporting underprivileged children through education', '/assets/projects/foundation.jpg', 'Social Impact', 'active', 1, NOW()),
('proj-002', 'Business Consulting', 'Helping businesses achieve excellence', '/assets/projects/consulting.jpg', 'Consulting', 'active', 2, NOW()),
('proj-003', 'Tax Advisory Services', 'Professional tax planning and compliance', '/assets/projects/tax-advisory.jpg', 'Finance', 'active', 3, NOW());

-- Insert announcements
INSERT IGNORE INTO announcements (id, title, message, type, is_active, created_at) VALUES
('ann-001', 'Tax Conference 2025', 'Register now for our annual tax conference!', 'info', 1, NOW()),
('ann-002', 'New Book Release', 'Nigeria\'s Hero Vol 2 now available', 'success', 1, NOW());

