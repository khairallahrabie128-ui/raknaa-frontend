// Admin Configuration
// Add admin emails here - they will have automatic access without registration/login
const ADMIN_EMAILS = [
    'sond00ss122@gmail.com',
    'yousefkhairallah3@gmail.com',
    'Marwansalah832@gmail.com',
    'mohammeds2004r@gmail.com',
    'mohamed33tarek00@gmail.com',
    'abedo3420@gmail.com',
    'salma.heerz@gmail.com',
    'fatmaosmanhh22.mo@gmail.com',
    'hassassan@icloud.com'
];

// Check if email is an admin email
function isAdminEmail(email) {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// Auto-login admin if email is in admin list
function autoLoginAdmin(email) {
    if (!isAdminEmail(email)) return false;
    
    const adminUser = {
        id: 'admin_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        email: email.toLowerCase().trim(),
        name: 'Admin User',
        role: 'admin',
        isAdmin: true
    };
    
    localStorage.setItem('user', JSON.stringify(adminUser));
    localStorage.setItem('token', 'admin_token_' + Date.now());
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', 'true');
    
    return true;
}

// Export functions
window.ADMIN_EMAILS = ADMIN_EMAILS;
window.isAdminEmail = isAdminEmail;
window.autoLoginAdmin = autoLoginAdmin;

