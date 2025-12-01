// Registration page functionality
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
    // Check for email in URL and pre-fill
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = emailFromUrl;
        }
        
        // If it's an admin email, redirect to login (admins can't register)
        if (window.isAdminEmail && window.isAdminEmail(emailFromUrl)) {
            window.location.href = `login.html?email=${encodeURIComponent(emailFromUrl)}`;
            return;
        }
    }
    
    // Check if user is already registered/logged in
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
        
        window.location.href = redirectUrl;
        return;
    }

    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Role selection handler - show/hide driver/owner fields
    const userRoleSelect = document.getElementById('userRole');
    const driverFields = document.getElementById('driverFields');
    const ownerFields = document.getElementById('ownerFields');
    const drivingLicenseInput = document.getElementById('drivingLicense');
    const carLicenseInput = document.getElementById('carLicense');
    const carTypeInput = document.getElementById('carType');
    const carColorInput = document.getElementById('carColor');
    const ownerGarageSelect = document.getElementById('ownerGarage');
    
    // Load garages for owner selection
    loadGaragesForOwner();
    
    if (userRoleSelect && driverFields && ownerFields) {
        userRoleSelect.addEventListener('change', (e) => {
            const role = e.target.value;
            if (role === 'driver') {
                // Show driver fields and make them required
                driverFields.style.display = 'block';
                ownerFields.style.display = 'none';
                if (drivingLicenseInput) {
                    drivingLicenseInput.setAttribute('required', 'required');
                }
                if (carLicenseInput) {
                    carLicenseInput.setAttribute('required', 'required');
                }
                if (carTypeInput) {
                    carTypeInput.setAttribute('required', 'required');
                }
                if (carColorInput) {
                    carColorInput.setAttribute('required', 'required');
                }
                if (ownerGarageSelect) {
                    ownerGarageSelect.removeAttribute('required');
                    ownerGarageSelect.value = '';
                }
            } else if (role === 'owner') {
                // Show owner fields and make them required
                driverFields.style.display = 'none';
                ownerFields.style.display = 'block';
                if (drivingLicenseInput) {
                    drivingLicenseInput.removeAttribute('required');
                    drivingLicenseInput.value = '';
                }
                if (carLicenseInput) {
                    carLicenseInput.removeAttribute('required');
                    carLicenseInput.value = '';
                }
                if (carTypeInput) {
                    carTypeInput.removeAttribute('required');
                    carTypeInput.value = '';
                }
                if (carColorInput) {
                    carColorInput.removeAttribute('required');
                    carColorInput.value = '';
                }
                if (ownerGarageSelect) {
                    ownerGarageSelect.setAttribute('required', 'required');
                }
            } else {
                // Hide all role-specific fields
                driverFields.style.display = 'none';
                ownerFields.style.display = 'none';
                if (drivingLicenseInput) {
                    drivingLicenseInput.removeAttribute('required');
                    drivingLicenseInput.value = '';
                }
                if (carLicenseInput) {
                    carLicenseInput.removeAttribute('required');
                    carLicenseInput.value = '';
                }
                if (carTypeInput) {
                    carTypeInput.removeAttribute('required');
                    carTypeInput.value = '';
                }
                if (carColorInput) {
                    carColorInput.removeAttribute('required');
                    carColorInput.value = '';
                }
                if (ownerGarageSelect) {
                    ownerGarageSelect.removeAttribute('required');
                    ownerGarageSelect.value = '';
                }
            }
        });
    }

    // Validate National ID (14 digits)
    const nationalIdInput = document.getElementById('nationalId');
    if (nationalIdInput) {
        nationalIdInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 14);
        });
    }

    // Validate phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
        });
    }

    // Validate password match
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
});

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity('كلمات المرور غير متطابقة');
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const userRole = document.getElementById('userRole').value;
    const email = document.getElementById('email').value.trim();
    
    // Prevent admin registration
    if (window.isAdminEmail && window.isAdminEmail(email)) {
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'لا يمكن التسجيل كمدير. يرجى استخدام تسجيل الدخول المباشر.' : 'Cannot register as admin. Please use direct login.',
            'error'
        );
        return;
    }
    
    const formData = {
        name: document.getElementById('fullName').value.trim(),
        email: email,
        phone: document.getElementById('phone').value.trim(),
        nationalId: document.getElementById('nationalId').value.trim(),
        role: userRole || 'driver',
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Only include driver-specific fields if role is driver
    if (userRole === 'driver') {
        formData.drivingLicense = document.getElementById('drivingLicense').value.trim();
        formData.carLicense = document.getElementById('carLicense').value.trim();
        formData.carType = document.getElementById('carType').value.trim();
        formData.carColor = document.getElementById('carColor').value.trim();
        
        // Validate driver fields
        if (!formData.drivingLicense || !formData.carLicense || !formData.carType || !formData.carColor) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            window.languageManager.showNotification(
                isArabic ? 'جميع حقول السائق مطلوبة (رخصة القيادة، رقم اللوحة، نوع السيارة، لون السيارة)' : 'All driver fields are required (driving license, car license, car type, car color)',
                'error'
            );
            return;
        }
    }
    
    // Only include owner-specific fields if role is owner
    if (userRole === 'owner') {
        const garageId = document.getElementById('ownerGarage').value;
        if (!garageId) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            window.languageManager.showNotification(
                isArabic ? 'يرجى اختيار الجراج الذي تملكه' : 'Please select the garage you own',
                'error'
            );
            return;
        }
        formData.garageId = parseInt(garageId);
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
            'error'
        );
        return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters',
            'error'
        );
        return;
    }

    // Validate National ID
    if (formData.nationalId.length !== 14) {
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'الرقم القومي يجب أن يكون 14 رقم' : 'National ID must be 14 digits',
            'error'
        );
        return;
    }

    try {
        // Try to register via API
        if (window.apiService && window.apiService.register) {
            const response = await window.apiService.register(formData);
            if (response.success) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                window.languageManager.showNotification(
                    isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!',
                    'success'
                );
                
                // Store user data
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                
                // Redirect to driver page
                setTimeout(() => {
                    window.location.href = 'driver.html';
                }, 1500);
            }
        } else {
            // Fallback: Store in localStorage
            const userData = {
                id: Date.now(),
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                nationalId: formData.nationalId,
                role: formData.role || 'driver',
                registeredAt: new Date().toISOString()
            };
            
            // Only include driver fields if role is driver
            if (formData.role === 'driver') {
                userData.drivingLicense = formData.drivingLicense;
                userData.carLicense = formData.carLicense;
            }
            
            // Only include owner fields if role is owner
            if (formData.role === 'owner') {
                userData.garageId = formData.garageId;
            }
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isRegistered', 'true');
            // Store password for login (in real app, this would be hashed on backend)
            localStorage.setItem('password_' + formData.email, formData.password);
            
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            window.languageManager.showNotification(
                isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!',
                'success'
            );
            
            setTimeout(() => {
                window.location.href = 'driver.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Registration error:', error);
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى' : 'Registration error. Please try again',
            'error'
        );
    }
}

// Load garages for owner selection
async function loadGaragesForOwner() {
    const ownerGarageSelect = document.getElementById('ownerGarage');
    if (!ownerGarageSelect) return;
    
    try {
        // Try to load from API
        if (window.apiService && window.apiService.getGarages) {
            const response = await window.apiService.getGarages();
            if (response.success && response.data && response.data.length > 0) {
                // Clear existing options
                ownerGarageSelect.innerHTML = '<option value="" data-translate="register.ownerGarage.select">اختر الجراج</option>';
                
                // Add garages to select
                response.data.forEach(garage => {
                    const option = document.createElement('option');
                    option.value = garage.id;
                    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                    option.textContent = isArabic ? (garage.name || garage.name_en) : (garage.name_en || garage.name);
                    ownerGarageSelect.appendChild(option);
                });
                return;
            }
        }
        
        // Fallback: Use garages from main.js if available
        if (typeof garages !== 'undefined' && garages && garages.length > 0) {
            ownerGarageSelect.innerHTML = '<option value="" data-translate="register.ownerGarage.select">اختر الجراج</option>';
            
            garages.forEach(garage => {
                const option = document.createElement('option');
                option.value = garage.id;
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                option.textContent = isArabic ? (garage.name || garage.nameEn) : (garage.nameEn || garage.name);
                ownerGarageSelect.appendChild(option);
            });
        } else {
            // Load from fallback data
            if (typeof garagesFallback !== 'undefined' && garagesFallback && garagesFallback.length > 0) {
                ownerGarageSelect.innerHTML = '<option value="" data-translate="register.ownerGarage.select">اختر الجراج</option>';
                
                garagesFallback.forEach(garage => {
                    const option = document.createElement('option');
                    option.value = garage.id;
                    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                    option.textContent = isArabic ? (garage.name || garage.nameEn) : (garage.nameEn || garage.name);
                    ownerGarageSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading garages for owner selection:', error);
    }
}

// Export for use in other files
window.togglePassword = togglePassword;

