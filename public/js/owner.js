// Owner page functionality
let ownerGarages = [];
let ownerBookings = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadOwnerData();
    setupEventListeners();
});

// Load owner's garages and bookings from API
async function loadOwnerData() {
    try {
        const user = window.getCurrentUser ? window.getCurrentUser() : null;
        if (!user || !user.id) {
            console.error('User not found');
            return;
        }

        // Load owner's garages
        if (window.apiService && window.apiService.getOwnerGarages) {
            const garagesResponse = await window.apiService.getOwnerGarages(user.id);
            if (garagesResponse.success && garagesResponse.data) {
                ownerGarages = garagesResponse.data.map(garage => ({
                    id: garage.id,
                    name: garage.name,
                    nameEn: garage.name_en || garage.name,
                    location: garage.address,
                    locationEn: garage.address_en || garage.address,
                    totalSpaces: garage.total_spaces,
                    occupiedSpaces: garage.occupied_spaces || 0,
                    hourlyRate: garage.hourly_rate
                }));
            }
        }

        // Load owner's bookings
        if (window.apiService && window.apiService.getOwnerBookings) {
            const bookingsResponse = await window.apiService.getOwnerBookings(user.id);
            if (bookingsResponse.success && bookingsResponse.data) {
                ownerBookings = bookingsResponse.data;
            }
        }

        renderOwnerGarages();
        renderOwnerBookings();
        updateStats();
    } catch (error) {
        console.error('Error loading owner data:', error);
        // Fallback to empty data
        ownerGarages = [];
        ownerBookings = [];
        renderOwnerGarages();
        renderOwnerBookings();
        updateStats();
    }
}

// Render owner bookings
function renderOwnerBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    if (ownerBookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">${isArabic ? 'لا توجد حجوزات' : 'No bookings'}</td></tr>`;
        return;
    }

    tbody.innerHTML = ownerBookings.map(booking => {
        const garageName = isArabic ? (booking.garage_name || booking.garage_name_en) : (booking.garage_name_en || booking.garage_name);
        const startTime = new Date(booking.start_time).toLocaleString(isArabic ? 'ar-EG' : 'en-US');
        const status = booking.status || 'active';
        const statusText = isArabic ? 
            (status === 'active' ? 'نشط' : status === 'completed' ? 'مكتمل' : 'ملغي') :
            status;
        
        // Build car information string
        let carInfo = '';
        if (booking.car_license || booking.car_type || booking.car_color) {
            const carParts = [];
            if (booking.car_license) {
                carParts.push(`${isArabic ? 'لوحة' : 'Plate'}: ${booking.car_license}`);
            }
            if (booking.car_type) {
                const carTypeText = isArabic ? 
                    (booking.car_type === 'sedan' ? 'سيدان' :
                     booking.car_type === 'suv' ? 'دفع رباعي' :
                     booking.car_type === 'hatchback' ? 'هاتشباك' :
                     booking.car_type === 'coupe' ? 'كوبيه' :
                     booking.car_type === 'pickup' ? 'بيك أب' :
                     booking.car_type === 'van' ? 'فان' : booking.car_type) :
                    booking.car_type;
                carParts.push(`${isArabic ? 'نوع' : 'Type'}: ${carTypeText}`);
            }
            if (booking.car_color) {
                const colorText = isArabic ?
                    (booking.car_color === 'white' ? 'أبيض' :
                     booking.car_color === 'black' ? 'أسود' :
                     booking.car_color === 'silver' ? 'فضي' :
                     booking.car_color === 'gray' ? 'رمادي' :
                     booking.car_color === 'red' ? 'أحمر' :
                     booking.car_color === 'blue' ? 'أزرق' :
                     booking.car_color === 'green' ? 'أخضر' :
                     booking.car_color === 'yellow' ? 'أصفر' :
                     booking.car_color === 'brown' ? 'بني' : booking.car_color) :
                    booking.car_color;
                carParts.push(`${isArabic ? 'لون' : 'Color'}: ${colorText}`);
            }
            carInfo = carParts.join(' | ');
        } else {
            carInfo = isArabic ? 'غير متاح' : 'N/A';
        }
        
        // Build user info with phone if available
        let userInfo = booking.user_name || booking.user_email || 'Guest';
        if (booking.user_phone) {
            userInfo += ` (${booking.user_phone})`;
        }
        if (booking.driving_license) {
            userInfo += `<br><small style="color: var(--gray-600);">${isArabic ? 'رخصة' : 'License'}: ${booking.driving_license}</small>`;
        }
        
        return `
            <tr>
                <td>${garageName || 'N/A'}</td>
                <td>${userInfo}</td>
                <td>${carInfo}</td>
                <td>${startTime}</td>
                <td>${booking.duration_hours} ${isArabic ? 'ساعة' : 'hours'}</td>
                <td>${booking.total_cost} ${isArabic ? 'جنيه' : 'EGP'}</td>
                <td><span class="status ${status}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

function renderOwnerGarages() {
    const tbody = document.getElementById('garagesTableBody');
    if (!tbody) return;

    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    const editText = isArabic ? 'تعديل' : 'Edit';
    const deleteText = isArabic ? 'حذف' : 'Delete';

    tbody.innerHTML = ownerGarages.map(garage => {
        const name = isArabic ? garage.name : garage.nameEn;
        const location = isArabic ? garage.location : garage.locationEn;
        const occupancyRate = ((garage.occupiedSpaces / garage.totalSpaces) * 100).toFixed(0);
        
        return `
            <tr style="border-bottom: 1px solid var(--gray-100); transition: background-color 0.2s;">
                <td style="padding: 1rem; font-size: 0.875rem; font-weight: 500; color: var(--gray-900);">${name}</td>
                <td style="padding: 1rem; font-size: 0.875rem; color: var(--gray-600);">${location}</td>
                <td style="padding: 1rem; font-size: 0.875rem; color: var(--gray-600);">${garage.totalSpaces}</td>
                <td style="padding: 1rem; font-size: 0.875rem; color: var(--gray-600);">${garage.occupiedSpaces}</td>
                <td style="padding: 1rem; font-size: 0.875rem; color: var(--gray-600); font-weight: 500;">${garage.hourlyRate} ${isArabic ? 'جنيه/ساعة' : 'EGP/hr'}</td>
                <td style="padding: 1rem;">
                    <span style="padding: 0.25rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
                        ${isArabic ? 'نشط' : 'Active'}
                    </span>
                </td>
                <td style="padding: 1rem;">
                    <div class="table-actions" style="display: flex; align-items: center; gap: 0.5rem;">
                        <button class="btn btn-outline btn-icon" onclick="editGarage(${garage.id})" title="${editText}" style="padding: 0.5rem; color: var(--primary-blue); border-radius: 0.5rem; transition: background-color 0.2s;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline btn-icon" onclick="deleteGarage(${garage.id})" title="${deleteText}" style="padding: 0.5rem; color: #ef4444; border-radius: 0.5rem; transition: background-color 0.2s;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStats() {
    const totalSpaces = ownerGarages.reduce((sum, g) => sum + g.totalSpaces, 0);
    const totalOccupied = ownerGarages.reduce((sum, g) => sum + g.occupiedSpaces, 0);
    const occupancyRate = totalSpaces > 0 ? ((totalOccupied / totalSpaces) * 100).toFixed(0) : 0;
    
    // Calculate today's revenue from active bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = ownerBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime() && (b.status === 'active' || b.status === 'completed');
    });
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (parseFloat(b.total_cost) || 0), 0);
    
    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyBookings = ownerBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear && 
               (b.status === 'active' || b.status === 'completed');
    });
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (parseFloat(b.total_cost) || 0), 0);
    
    // Count active bookings
    const activeBookings = ownerBookings.filter(b => b.status === 'active').length;

    // Update main stats
    document.getElementById('totalSpaces').textContent = totalSpaces;
    document.getElementById('occupiedSpaces').textContent = totalOccupied;
    document.getElementById('occupancyRate').textContent = `${occupancyRate}%`;
    document.getElementById('todayRevenue').innerHTML = `${todayRevenue.toLocaleString()} <span style="font-size: 1rem;">جنيه</span>`;
    
    // Update owner-specific stats
    const todayRevenueEl = document.getElementById('todayRevenueDetailed');
    if (todayRevenueEl) {
        todayRevenueEl.innerHTML = `${todayRevenue.toLocaleString()} <span style="font-size: 1rem;">جنيه</span>`;
    }
    
    const monthlyRevenueEl = document.getElementById('monthlyRevenue');
    if (monthlyRevenueEl) {
        monthlyRevenueEl.innerHTML = `${monthlyRevenue.toLocaleString()} <span style="font-size: 1rem;">جنيه</span>`;
    }
    
    const totalGaragesEl = document.getElementById('totalGaragesCount');
    if (totalGaragesEl) {
        totalGaragesEl.textContent = ownerGarages.length;
    }
    
    const activeBookingsEl = document.getElementById('activeBookingsCount');
    if (activeBookingsEl) {
        activeBookingsEl.textContent = activeBookings;
    }
}

function setupEventListeners() {
    // Add garage modal
    const addGarageBtn = document.getElementById('addGarageBtn');
    const addGarageModal = document.getElementById('addGarageModal');
    const closeAddGarageModal = document.getElementById('closeAddGarageModal');
    const cancelAddGarageBtn = document.getElementById('cancelAddGarageBtn');
    const addGarageForm = document.getElementById('addGarageForm');

    if (addGarageBtn) {
        addGarageBtn.addEventListener('click', () => {
            addGarageModal.classList.add('active');
        });
    }

    if (closeAddGarageModal) {
        closeAddGarageModal.addEventListener('click', () => {
            addGarageModal.classList.remove('active');
        });
    }

    if (cancelAddGarageBtn) {
        cancelAddGarageBtn.addEventListener('click', () => {
            addGarageModal.classList.remove('active');
        });
    }

    if (addGarageModal) {
        addGarageModal.addEventListener('click', (e) => {
            if (e.target === addGarageModal) {
                addGarageModal.classList.remove('active');
            }
        });
    }

    if (addGarageForm) {
        addGarageForm.addEventListener('submit', handleAddGarage);
    }

    // Export data
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
}

async function handleAddGarage(e) {
    e.preventDefault();
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!user || !user.id) {
        window.languageManager.showNotification(
            isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please login first',
            'error'
        );
        return;
    }
    
    try {
        // Try to create via API
        if (window.apiService && window.apiService.createGarage) {
            const garageData = {
                name: document.getElementById('garageName').value,
                name_en: document.getElementById('garageName').value,
                address: document.getElementById('garageAddress').value,
                address_en: document.getElementById('garageAddress').value,
                latitude: 31.2000, // Default - should be set via map
                longitude: 29.9167, // Default - should be set via map
                total_spaces: parseInt(document.getElementById('garageCapacity').value),
                hourly_rate: parseFloat(document.getElementById('garageRate').value),
                type: document.getElementById('garageType').value,
                owner_id: user.id
            };
            
            const response = await window.apiService.createGarage(garageData);
            if (response.success) {
                // Reload owner data
                await loadOwnerData();
                
                window.languageManager.showNotification(
                    isArabic ? 'تم إضافة الموقف بنجاح!' : 'Garage added successfully!',
                    'success'
                );
                
                document.getElementById('addGarageModal').classList.remove('active');
                document.getElementById('addGarageForm').reset();
                return;
            }
        }
        
        // Fallback: Add locally
        const newGarage = {
            id: ownerGarages.length + 1,
            name: document.getElementById('garageName').value,
            nameEn: document.getElementById('garageName').value,
            location: document.getElementById('garageAddress').value,
            locationEn: document.getElementById('garageAddress').value,
            totalSpaces: parseInt(document.getElementById('garageCapacity').value),
            occupiedSpaces: 0,
            hourlyRate: parseFloat(document.getElementById('garageRate').value),
            type: document.getElementById('garageType').value
        };

        ownerGarages.push(newGarage);
        renderOwnerGarages();
        updateStats();
        
        window.languageManager.showNotification(
            isArabic ? 'تم إضافة الموقف بنجاح! (محلياً)' : 'Garage added successfully! (local)',
            'success'
        );

        document.getElementById('addGarageModal').classList.remove('active');
        document.getElementById('addGarageForm').reset();
    } catch (error) {
        console.error('Error adding garage:', error);
        window.languageManager.showNotification(
            isArabic ? 'حدث خطأ أثناء إضافة الموقف' : 'Error adding garage',
            'error'
        );
    }
}

function editGarage(id) {
    const garage = ownerGarages.find(g => g.id === id);
    if (!garage) return;

    // In a real app, this would open an edit modal
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    window.languageManager.showNotification(
        isArabic ? 'ميزة التعديل قيد التطوير' : 'Edit feature coming soon',
        'info'
    );
}

function deleteGarage(id) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذا الموقف؟' : 'Are you sure you want to delete this garage?')) {
        const index = ownerGarages.findIndex(g => g.id === id);
        if (index > -1) {
            ownerGarages.splice(index, 1);
            renderOwnerGarages();
            updateStats();
            window.languageManager.showNotification(
                isArabic ? 'تم حذف الموقف' : 'Garage deleted',
                'success'
            );
        }
    }
}

function exportData() {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Create CSV content
    const headers = isArabic 
        ? ['اسم الموقف', 'الموقع', 'السعة', 'المشغول', 'السعر']
        : ['Garage Name', 'Location', 'Capacity', 'Occupied', 'Rate'];
    
    const rows = ownerGarages.map(garage => {
        const name = isArabic ? garage.name : garage.nameEn;
        const location = isArabic ? garage.location : garage.locationEn;
        return [name, location, garage.totalSpaces, garage.occupiedSpaces, garage.hourlyRate];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rakna-garages-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.languageManager.showNotification(
        isArabic ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully',
        'success'
    );
}

// Re-render when language changes
if (window.languageManager) {
    const originalApplyLanguage = window.languageManager.applyLanguage.bind(window.languageManager);
    window.languageManager.applyLanguage = function() {
        originalApplyLanguage();
        if (document.getElementById('garagesTableBody')) {
            renderOwnerGarages();
        }
        if (document.getElementById('bookingsTableBody')) {
            renderOwnerBookings();
        }
    };
}

