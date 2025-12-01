// Login page functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(inputId + 'Toggle');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check for email in URL and auto-login
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const autoLogin = urlParams.get('auto') === 'true';
    
    if (emailFromUrl) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = emailFromUrl;
            
            // If auto-login is requested, try to login immediately
            if (autoLogin) {
                // Check if it's an admin email
                if (window.isAdminEmail && window.isAdminEmail(emailFromUrl)) {
                    if (window.autoLoginAdmin && window.autoLoginAdmin(emailFromUrl)) {
                        const redirect = urlParams.get('redirect') || 'admin.html';
                        setTimeout(() => {
                            window.location.href = redirect;
                        }, 500);
                        return;
                    }
                }
                
                // Try to auto-login by email
                if (window.authManager && window.authManager.autoLoginByEmail) {
                    window.authManager.autoLoginByEmail(emailFromUrl).then(success => {
                        if (success) {
                            // Already redirected
                            return;
                        }
                    });
                }
            }
        }
    }

    // Check if user is already logged in
    const user = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (user || isLoggedIn || isAdmin) {
        // Redirect to appropriate page if already logged in
        const userObj = user ? JSON.parse(user) : null;
        let redirectUrl = 'driver.html';
        
        if (isAdmin || (userObj && userObj.role === 'admin')) {
            redirectUrl = 'admin.html';
        } else if (userObj && userObj.role === 'owner') {
            redirectUrl = 'owner.html';
        } else if (userObj && userObj.role === 'driver') {
            redirectUrl = 'driver.html';
        }
        
        // Check for redirect parameter
        const redirect = urlParams.get('redirect');
        if (redirect) {
            redirectUrl = redirect;
        }
        
        window.location.href = redirectUrl;
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Check if email is an admin email - auto-login without password
    if (window.isAdminEmail && window.isAdminEmail(email)) {
        if (window.autoLoginAdmin && window.autoLoginAdmin(email)) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'تم تسجيل الدخول كمدير بنجاح' : 'Logged in as admin successfully',
                    'success'
                );
            }
            
            // Redirect based on redirect parameter or default to admin page
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || 'admin.html';
            
            setTimeout(() => {
                window.location.href = redirect;
            }, 1000);
            return;
        }
    }
    
    const formData = {
        email: email,
        password: password,
        rememberMe: rememberMe
    };

    try {
        // Try to login via API
        if (window.apiService && window.apiService.login) {
            const response = await window.apiService.login(formData);
            if (response.success) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                window.languageManager.showNotification(
                    isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!',
                    'success'
                );
                
                // Store user data
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                
                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                // Redirect based on user role
                const redirectUrl = response.user.role === 'admin' ? 'admin.html' : 
                                  response.user.role === 'owner' ? 'owner.html' : 'driver.html';
                
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            }
        } else {
            // Fallback: Check localStorage for registered users
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.email === formData.email) {
                    // Simple password check (in real app, this would be hashed)
                    const storedPassword = localStorage.getItem('password_' + user.email);
                    if (storedPassword === formData.password || !storedPassword) {
                        localStorage.setItem('isLoggedIn', 'true');
                        if (formData.rememberMe) {
                            localStorage.setItem('rememberMe', 'true');
                        }
                        
                        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                        window.languageManager.showNotification(
                            isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!',
                            'success'
                        );
                        
                        setTimeout(() => {
                            window.location.href = user.role === 'admin' ? 'admin.html' : 
                                                user.role === 'owner' ? 'owner.html' : 'driver.html';
                        }, 1000);
                        return;
                    }
                }
            }
            
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            window.languageManager.showNotification(
                isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password',
                'error'
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'حدث خطأ أثناء تسجيل الدخول' : 'Login error occurred',
            'error'
        );
    }
}

// Export for use in other files
window.togglePassword = togglePassword;

