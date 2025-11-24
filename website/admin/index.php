<?php
require_once '../includes/config.php';
require_once '../includes/database.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

$db = Database::connect();

// Get statistics
$stats = [];
$stats['books'] = $db->query("SELECT COUNT(*) as count FROM books")->fetch()['count'];
$stats['registrations'] = $db->query("SELECT COUNT(*) as count FROM registrations")->fetch()['count'];
$stats['contacts'] = $db->query("SELECT COUNT(*) as count FROM contacts WHERE status='unread'")->fetch()['count'];
$stats['revenue'] = $db->query("SELECT SUM(amount) as total FROM book_purchases WHERE payment_status='completed'")->fetch()['total'] ?? 0;
$stats['revenue'] += $db->query("SELECT SUM(amount) as total FROM registrations WHERE payment_status='completed'")->fetch()['total'] ?? 0;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <div class="admin-container">
        <?php include 'sidebar.php'; ?>
        
        <div class="admin-content">
            <div class="admin-header">
                <h1>Dashboard</h1>
                <a href="logout.php" class="btn-logout">Logout</a>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Books</h3>
                    <p class="stat-number"><?php echo $stats['books']; ?></p>
                </div>
                <div class="stat-card">
                    <h3>Registrations</h3>
                    <p class="stat-number"><?php echo $stats['registrations']; ?></p>
                </div>
                <div class="stat-card">
                    <h3>Unread Messages</h3>
                    <p class="stat-number"><?php echo $stats['contacts']; ?></p>
                </div>
                <div class="stat-card">
                    <h3>Total Revenue</h3>
                    <p class="stat-number">₦<?php echo number_format($stats['revenue'], 2); ?></p>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="section">
                <h2>Recent Activity</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Details</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Get recent registrations
                        $recent = $db->query("SELECT 'Registration' as type, full_name as details, created_at, payment_status as status FROM registrations ORDER BY created_at DESC LIMIT 5")->fetchAll();
                        foreach ($recent as $item):
                        ?>
                        <tr>
                            <td><?php echo $item['type']; ?></td>
                            <td><?php echo htmlspecialchars($item['details']); ?></td>
                            <td><?php echo date('Y-m-d H:i', strtotime($item['created_at'])); ?></td>
                            <td><span class="badge badge-<?php echo $item['status']; ?>"><?php echo $item['status']; ?></span></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
