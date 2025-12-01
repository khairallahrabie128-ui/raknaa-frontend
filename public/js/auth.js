// Authentication utility functions
class AuthManager {
    constructor() {
        // Auto-login on page load if account is saved
        this.autoLoginIfSaved();
        this.checkAuth();
    }
    
    // Auto-login if user account is saved
    autoLoginIfSaved() {
        // Check for saved user account
        const userStr = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const isAdmin = localStorage.getItem('isAdmin');
        
        // If already logged in, no need to do anything
        if (isLoggedIn || isAdmin) {
            return;
        }
        
        // If user data exists but not logged in, restore session
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.email) {
                    // Check if it's an admin email
                    if (window.isAdminEmail && window.isAdminEmail(user.email)) {
                        if (window.autoLoginAdmin) {
                            window.autoLoginAdmin(user.email);
                            return;
                        }
                    }
                    
                    // Restore login session
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    // If user has rememberMe, keep them logged in
                    const rememberMe = localStorage.getItem('rememberMe');
                    if (rememberMe === 'true') {
                        // Session is already restored
                        return;
                    }
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        // Check for email in URL
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email') || urlParams.get('admin');
        
        if (emailFromUrl) {
            // Check if it's an admin email
            if (window.isAdminEmail && window.isAdminEmail(emailFromUrl)) {
                if (window.autoLoginAdmin) {
                    window.autoLoginAdmin(emailFromUrl);
                    return;
                }
            }
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        const user = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const isAdmin = localStorage.getItem('isAdmin');
        return !!(user || isLoggedIn || isAdmin);
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Check if current user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        const isAdmin = localStorage.getItem('isAdmin');
        return !!(isAdmin || (user && user.role === 'admin'));
    }

    // Check authentication and redirect if needed
    checkAuth() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Don't check auth on login/register/visitor/driver/index pages (allow public access)
        if (currentPage === 'login.html' || 
            currentPage === 'register.html' || 
            currentPage === 'visitor.html' || 
            currentPage === 'driver.html' ||
            currentPage === 'index.html') {
            return;
        }
        
        // Try auto-login for other pages (but not index.html)
        if (this.attemptAutoLogin()) {
            return;
        }

        // Special handling for admin page
        if (currentPage === 'admin.html') {
            // Check if already authenticated as admin
            if (this.isAdmin()) {
                return;
            }
            
            // If not admin, redirect to login
            window.location.href = 'login.html?redirect=admin.html';
            return;
        }

        // Special handling for owner page
        if (currentPage === 'owner.html') {
            // Check if user is authenticated
            if (!this.isAuthenticated()) {
                window.location.href = 'login.html?redirect=owner.html';
                return;
            }
            const user = this.getCurrentUser();
            // Allow both owners and admins to access owner page
            if (user && user.role !== 'owner' && user.role !== 'admin') {
                window.location.href = 'driver.html';
                return;
            }
            // Don't redirect away from owner page if user is owner or admin
            return;
        }

        // For other pages, check if user is authenticated
        if (!this.isAuthenticated()) {
            // Allow access to driver page without auth
            if (currentPage !== 'driver.html') {
                // Redirect to register page (first time users)
                window.location.href = 'register.html';
            }
        }
    }

    // Attempt auto-login from saved account or URL
    attemptAutoLogin() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Don't attempt auto-login on index.html (let index.html handle it)
        if (currentPage === 'index.html') {
            return false;
        }
        
        // Check for email in URL
        const urlParams = new URLSearchParams(window.location.search);
        const emailFromUrl = urlParams.get('email') || urlParams.get('admin');
        
        if (emailFromUrl) {
            // Check if it's an admin email
            if (window.isAdminEmail && window.isAdminEmail(emailFromUrl)) {
                if (window.autoLoginAdmin) {
                    window.autoLoginAdmin(emailFromUrl);
                    // Only redirect if not already on admin page
                    if (currentPage !== 'admin.html') {
                        window.location.href = 'admin.html';
                    }
                    return true;
                }
            } else {
                // Try to find user by email in backend or localStorage
                this.autoLoginByEmail(emailFromUrl);
                return true;
            }
        }
        
        // Check if user is already logged in (but don't redirect if already on correct page)
        if (this.isAuthenticated()) {
            const user = this.getCurrentUser();
            if (user) {
                // Allow admins to access owner page, and owners to access their page
                // Only redirect if user is trying to access a page they shouldn't access
                if (currentPage === 'owner.html') {
                    // Allow both owners and admins to access owner page
                    if (user.role === 'owner' || user.role === 'admin') {
                        return true; // Stay on owner page
                    }
                    // If not owner or admin, redirect to appropriate page
                    const expectedPage = user.role === 'admin' ? 'admin.html' : 'driver.html';
                    window.location.href = expectedPage;
                    return true;
                }
                
                const expectedPage = user.role === 'admin' ? 'admin.html' :
                                   user.role === 'owner' ? 'owner.html' :
                                   'driver.html';
                // Only redirect if not on the expected page and not trying to access owner page as admin
                if (currentPage !== expectedPage && currentPage !== 'index.html' && !(currentPage === 'owner.html' && user.role === 'admin')) {
                    window.location.href = expectedPage;
                    return true;
                }
            }
            return true;
        }
        
        // Check for saved user account
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.email) {
                    // Check if it's an admin email
                    if (window.isAdminEmail && window.isAdminEmail(user.email)) {
                        if (window.autoLoginAdmin) {
                            window.autoLoginAdmin(user.email);
                            if (currentPage !== 'admin.html') {
                                window.location.href = 'admin.html';
                            }
                            return true;
                        }
                    }
                    
                    // User is already saved, they're logged in
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    // Allow admins to access owner page, and owners to access their page
                    if (currentPage === 'owner.html') {
                        // Allow both owners and admins to access owner page
                        if (user.role === 'owner' || user.role === 'admin') {
                            return true; // Stay on owner page
                        }
                    }
                    
                    const expectedPage = (user.role || 'driver') === 'admin' ? 'admin.html' :
                                       (user.role || 'driver') === 'owner' ? 'owner.html' :
                                       'driver.html';
                    // Only redirect if not on the expected page and not trying to access owner page as admin
                    if (currentPage !== expectedPage && currentPage !== 'index.html' && !(currentPage === 'owner.html' && (user.role || 'driver') === 'admin')) {
                        window.location.href = expectedPage;
                        return true;
                    }
                    return true;
                }
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        }
        
        return false;
    }
    
    // Auto-login by email (check backend or localStorage)
    async autoLoginByEmail(email) {
        if (!email) return false;
        
        try {
            // Try to get user from backend API
            if (window.apiService && window.apiService.getUserByEmail) {
                const response = await window.apiService.getUserByEmail(email);
                if (response.success && response.data) {
                    const user = response.data;
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('isLoggedIn', 'true');
                    this.redirectToUserPage(user.role || 'driver');
                    return true;
                }
            }
            
            // Check if email is admin
            if (window.isAdminEmail && window.isAdminEmail(email)) {
                if (window.autoLoginAdmin) {
                    window.autoLoginAdmin(email);
                    this.redirectToUserPage('admin');
                    return true;
                }
            }
            
            // Try to find in localStorage (for registered users)
            const allUsers = this.getAllStoredUsers();
            const foundUser = allUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
            
            if (foundUser) {
                localStorage.setItem('user', JSON.stringify(foundUser));
                localStorage.setItem('isLoggedIn', 'true');
                this.redirectToUserPage(foundUser.role || 'driver');
                return true;
            }
        } catch (error) {
            console.error('Error auto-logging in by email:', error);
        }
        
        return false;
    }
    
    // Get all stored users from localStorage
    getAllStoredUsers() {
        const users = [];
        // Check localStorage for user data
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === 'user') {
                try {
                    const user = JSON.parse(localStorage.getItem(key));
                    if (user && user.email) {
                        users.push(user);
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }
        return users;
    }
    
    // Redirect to appropriate page based on user role
    redirectToUserPage(role) {
        const currentPage = window.location.pathname.split('/').pop();
        let targetPage = 'driver.html'; // Default to driver page
        
        // Only redirect to admin if role is explicitly 'admin'
        if (role === 'admin') {
            targetPage = 'admin.html';
        } else if (role === 'owner') {
            targetPage = 'owner.html';
        } else {
            // For driver, guest, or any other role, go to driver page
            targetPage = 'driver.html';
        }
        
        // Only redirect if not already on the correct page and not on index
        if (currentPage !== targetPage && currentPage !== 'index.html') {
            window.location.href = targetPage;
        }
    }

    // Logout user
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('isAdmin');
        window.location.href = 'login.html';
    }

    // Require authentication for a page
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'register.html';
            return false;
        }
        return true;
    }
}

// Create global auth manager instance
window.authManager = new AuthManager();

// Export functions
window.isAuthenticated = () => window.authManager.isAuthenticated();
window.getCurrentUser = () => window.authManager.getCurrentUser();
window.logout = () => window.authManager.logout();
window.requireAuth = () => window.authManager.requireAuth();
window.isAdmin = () => window.authManager.isAdmin();

// Auto-login on page load if email is in URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email') || urlParams.get('admin');
    
    if (emailFromUrl && window.authManager) {
        // Try auto-login
        window.authManager.autoLoginByEmail(emailFromUrl).then(success => {
            if (success) {
                // User will be redirected automatically
                console.log('Auto-login successful');
            }
        });
    }
});

