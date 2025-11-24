<?php
require_once 'includes/config.php';
require_once 'includes/database.php';

$db = Database::connect();

// Get books
$stmt = $db->query("SELECT * FROM books ORDER BY created_at DESC LIMIT 6");
$books = $stmt->fetchAll();

// Get announcements
$stmt = $db->query("SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC LIMIT 3");
$announcements = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Professional Consulting Services</title>
    <link rel="icon" href="assets/images/favicon.svg">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Welcome to Nigerland Consult Limited</h1>
            <p>Professional consulting services for your business success</p>
            <div class="hero-buttons">
                <a href="books.php" class="btn btn-primary">Browse Books</a>
                <a href="conferences.php" class="btn btn-secondary">View Conferences</a>
            </div>
        </div>
    </section>

    <!-- Announcements -->
    <?php if (!empty($announcements)): ?>
    <section class="announcements">
        <div class="container">
            <?php foreach ($announcements as $ann): ?>
                <div class="announcement-<?php echo htmlspecialchars($ann['type']); ?>">
                    <strong><?php echo htmlspecialchars($ann['title']); ?>:</strong>
                    <?php echo htmlspecialchars($ann['message']); ?>
                </div>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- Featured Books -->
    <section class="featured-books">
        <div class="container">
            <h2>Featured Books</h2>
            <div class="books-grid">
                <?php foreach ($books as $book): ?>
                    <div class="book-card">
                        <img src="<?php echo htmlspecialchars($book['image']); ?>" alt="<?php echo htmlspecialchars($book['title']); ?>">
                        <h3><?php echo htmlspecialchars($book['title']); ?></h3>
                        <p class="author">by <?php echo htmlspecialchars($book['author']); ?></p>
                        <p class="price">₦<?php echo number_format($book['price'], 2); ?></p>
                        <a href="book-detail.php?id=<?php echo $book['id']; ?>" class="btn">View Details</a>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="text-center">
                <a href="books.php" class="btn btn-primary">View All Books</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about-preview">
        <div class="container">
            <h2>About Us</h2>
            <p>Nigerland Consult Limited is a leading consulting firm providing professional services in business development, training, and advisory services.</p>
            <a href="about.php" class="btn">Learn More</a>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>
    <script src="assets/js/main.js"></script>
</body>
</html>
