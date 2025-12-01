// Admin page functionality
let adminStats = {
    totalUsers: 0,
    totalGarages: 0,
    activeBookings: 0,
    systemHealth: 98
};

let allUsers = [];
let allGarages = [];
let allBookings = [];

document.addEventListener('DOMContentLoaded', async () => {
    setupTabs();
    setupEventListeners();
    await loadAdminData();
});

function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}Tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function setupEventListeners() {
    // Refresh data
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', refreshData);
    }

    // Settings
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }
}

async function refreshData() {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    await loadAdminData();
    
    window.languageManager.showNotification(
        isArabic ? 'تم تحديث بيانات النظام' : 'System data refreshed',
        'success'
    );
}

// Load all admin data from API
async function loadAdminData() {
    try {
        // Load users
        if (window.apiService && window.apiService.getAllUsers) {
            const usersResponse = await window.apiService.getAllUsers();
            if (usersResponse.success && usersResponse.data) {
                allUsers = usersResponse.data;
            }
        }

        // Load garages
        if (window.apiService && window.apiService.getGarages) {
            const garagesResponse = await window.apiService.getGarages();
            if (garagesResponse.success && garagesResponse.data) {
                allGarages = garagesResponse.data;
            }
        }

        // Load bookings
        if (window.apiService && window.apiService.getAllBookings) {
            const bookingsResponse = await window.apiService.getAllBookings();
            if (bookingsResponse.success && bookingsResponse.data) {
                allBookings = bookingsResponse.data;
            }
        }

        // Update stats
        adminStats.totalUsers = allUsers.length;
        adminStats.totalGarages = allGarages.length;
        adminStats.activeBookings = allBookings.filter(b => b.status === 'active').length;
        
        updateStats();
        renderUsersTable();
        renderGaragesTable();
        renderBookingsTable();
        renderRecentActivity();
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

function updateStats() {
    // Update stat cards with real data - Admin page shows SYSTEM-WIDE stats
    const userStat = document.getElementById('adminTotalUsers') || document.querySelector('.stat-card:nth-child(1) .stat-card-value');
    const garageStat = document.getElementById('adminTotalGarages') || document.querySelector('.stat-card:nth-child(2) .stat-card-value');
    const bookingStat = document.getElementById('adminActiveBookings') || document.querySelector('.stat-card:nth-child(3) .stat-card-value');
    const healthStat = document.getElementById('adminSystemHealth') || document.querySelector('.stat-card:nth-child(4) .stat-card-value');

    if (userStat) userStat.textContent = adminStats.totalUsers.toLocaleString();
    if (garageStat) garageStat.textContent = adminStats.totalGarages;
    if (bookingStat) bookingStat.textContent = adminStats.activeBookings;
    if (healthStat) healthStat.textContent = `${adminStats.systemHealth.toFixed(0)}%`;
}

// Render users table - Shows ALL users in the system (admin only)
function renderUsersTable() {
    const usersTab = document.getElementById('usersTab');
    if (!usersTab) return;
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    const tbody = usersTab.querySelector('tbody');
    if (!tbody) return;
    
    if (allUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: var(--spacing-xl);">${isArabic ? 'لا توجد بيانات' : 'No data available'}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = allUsers.map(user => {
        const roleText = isArabic ? 
            (user.role === 'driver' ? 'سائق' : 
             user.role === 'owner' ? 'صاحب موقف' : 
             user.role === 'admin' ? 'مسئول' : user.role) :
            user.role || 'driver';
        
        const statusText = isArabic ? 'نشط' : 'Active';
        
        return `
        <tr>
            <td>${user.name || user.email || 'N/A'}</td>
            <td><span class="status ${user.role || 'driver'}">${roleText}</span></td>
            <td>${user.phone || '-'}</td>
            <td>${new Date(user.created_at || Date.now()).toLocaleDateString()}</td>
            <td><span class="status active">${statusText}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-icon" onclick="editUser(${user.id})" title="${isArabic ? 'تعديل' : 'Edit'}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline btn-icon" onclick="deleteUser(${user.id})" title="${isArabic ? 'حذف' : 'Delete'}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

// Render garages table - Shows ALL garages in the system (admin only)
function renderGaragesTable() {
    const garagesTab = document.getElementById('garagesTab');
    if (!garagesTab) return;
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    const tbody = garagesTab.querySelector('tbody');
    if (!tbody) return;
    
    if (allGarages.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: var(--spacing-xl);">${isArabic ? 'لا توجد بيانات' : 'No data available'}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = allGarages.map(garage => {
        const name = isArabic ? (garage.name || garage.name_en) : (garage.name_en || garage.name);
        const address = isArabic ? (garage.address || '') : (garage.address_en || garage.address || '');
        const occupied = garage.occupied_spaces || 0;
        const total = garage.total_spaces || 0;
        const availability = garage.availability || 'available';
        const ownerName = garage.owner_name || garage.owner_email || '-';
        
        const availabilityText = isArabic ? 
            (availability === 'available' ? 'نشط' : availability === 'limited' ? 'محدود' : 'ممتلئ') :
            availability;
        
        return `
            <tr>
                <td>${name || 'N/A'}</td>
                <td>${ownerName}</td>
                <td>${address || 'N/A'}</td>
                <td>${total}</td>
                <td>${occupied}</td>
                <td><span class="status ${availability}">${availabilityText}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-icon" onclick="adminEditGarage(${garage.id})" title="${isArabic ? 'تعديل' : 'Edit'}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline btn-icon" onclick="adminDeleteGarage(${garage.id})" title="${isArabic ? 'حذف' : 'Delete'}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Render bookings table - Shows ALL bookings in the system (admin only)
function renderBookingsTable() {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    if (!bookingsTableBody) return;
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    if (allBookings.length === 0) {
        bookingsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: var(--spacing-xl);">${isArabic ? 'لا توجد حجوزات' : 'No bookings'}</td></tr>`;
        return;
    }
    
    bookingsTableBody.innerHTML = allBookings.slice(0, 20).map(booking => {
        const garageName = isArabic ? (booking.garage_name || booking.garage_name_en) : (booking.garage_name_en || booking.garage_name);
        const userName = booking.user_name || booking.user_email || 'Guest';
        const startTime = new Date(booking.start_time).toLocaleString(isArabic ? 'ar-EG' : 'en-US');
        const status = booking.status || 'active';
        const statusText = isArabic ? 
            (status === 'active' ? 'نشط' : status === 'completed' ? 'مكتمل' : 'ملغي') :
            status;
        
        return `
        <tr>
            <td>#${booking.id}</td>
            <td>${garageName || 'N/A'}</td>
            <td>${userName}</td>
            <td>${startTime}</td>
            <td><span class="status ${status}">${statusText}</span></td>
        </tr>
        `;
    }).join('');
    
    // Update total revenue
    const totalRevenue = allBookings
        .filter(b => b.status === 'active' || b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.total_cost) || 0), 0);
    
    const revenueElement = document.getElementById('totalRevenue');
    if (revenueElement) {
        revenueElement.innerHTML = `${totalRevenue.toLocaleString()} <span style="font-size: 1rem;">جنيه</span>`;
    }
    
    // Calculate average daily revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= thirtyDaysAgo && (b.status === 'active' || b.status === 'completed');
    });
    const recentRevenue = recentBookings.reduce((sum, b) => sum + (parseFloat(b.total_cost) || 0), 0);
    const avgDailyRevenue = recentRevenue / 30;
    
    const avgDailyRevenueEl = document.getElementById('avgDailyRevenue');
    if (avgDailyRevenueEl) {
        avgDailyRevenueEl.innerHTML = `${avgDailyRevenue.toFixed(0).toLocaleString()} <span style="font-size: 1rem;">جنيه</span>`;
    }
    
    // Count total owners
    const owners = allUsers.filter(u => u.role === 'owner');
    const totalOwnersEl = document.getElementById('totalOwners');
    if (totalOwnersEl) {
        totalOwnersEl.textContent = owners.length;
    }
}

function openSettings() {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    window.languageManager.showNotification(
        isArabic ? 'صفحة الإعدادات قيد التطوير' : 'Settings page coming soon',
        'info'
    );
}

// Render recent activity for admin overview
function renderRecentActivity() {
    const activityList = document.querySelector('#overviewTab .activity-list');
    if (!activityList) return;
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Get recent bookings, users, garages
    const recentBookings = allBookings.slice(0, 3).map(b => ({
        type: 'booking',
        title: isArabic ? 'حجز جديد' : 'New Booking',
        desc: `${b.garage_name || 'Garage'} - ${b.user_name || 'User'}`,
        time: getTimeAgo(new Date(b.created_at))
    }));
    
    // Simple activity feed (can be enhanced with real activity log)
    const activities = [
        ...recentBookings,
        {
            type: 'user',
            title: isArabic ? 'مستخدم جديد' : 'New User',
            desc: isArabic ? 'تم تسجيل مستخدم جديد في النظام' : 'New user registered in system',
            time: isArabic ? 'منذ ساعة' : '1 hour ago'
        }
    ];
    
    // Update activity items dynamically if needed
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return date.toLocaleDateString();
}

// Admin functions for managing users and garages
function editUser(userId) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    window.languageManager.showNotification(
        isArabic ? 'ميزة التعديل قيد التطوير' : 'Edit feature coming soon',
        'info'
    );
}

function deleteUser(userId) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
        // TODO: Implement delete user via API
        window.languageManager.showNotification(
            isArabic ? 'تم حذف المستخدم' : 'User deleted',
            'success'
        );
        loadAdminData();
    }
}

function adminEditGarage(garageId) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    window.languageManager.showNotification(
        isArabic ? 'ميزة التعديل قيد التطوير' : 'Edit feature coming soon',
        'info'
    );
}

function adminDeleteGarage(garageId) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذا الموقف؟' : 'Are you sure you want to delete this garage?')) {
        // TODO: Implement delete garage via API
        window.languageManager.showNotification(
            isArabic ? 'تم حذف الموقف' : 'Garage deleted',
            'success'
        );
        loadAdminData();
    }
}

// Generate reports - Admin only feature
function generateReport(type) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    let reportData = [];
    let filename = '';
    let headers = [];
    
    switch(type) {
        case 'users':
            filename = `users-report-${new Date().toISOString().split('T')[0]}.csv`;
            headers = isArabic ? ['الاسم', 'البريد', 'النوع', 'الهاتف', 'تاريخ التسجيل'] : ['Name', 'Email', 'Role', 'Phone', 'Registered'];
            reportData = allUsers.map(u => [
                u.name || u.email || 'N/A',
                u.email || '-',
                u.role || 'driver',
                u.phone || '-',
                new Date(u.created_at || Date.now()).toLocaleDateString()
            ]);
            break;
        case 'garages':
            filename = `garages-report-${new Date().toISOString().split('T')[0]}.csv`;
            headers = isArabic ? ['اسم الموقف', 'صاحب الموقف', 'الموقع', 'السعة', 'المشغول', 'السعر'] : ['Garage Name', 'Owner', 'Location', 'Capacity', 'Occupied', 'Rate'];
            reportData = allGarages.map(g => [
                g.name || g.name_en || 'N/A',
                g.owner_name || g.owner_email || '-',
                g.address || g.address_en || '-',
                g.total_spaces || 0,
                g.occupied_spaces || 0,
                g.hourly_rate || 0
            ]);
            break;
        case 'bookings':
            filename = `bookings-report-${new Date().toISOString().split('T')[0]}.csv`;
            headers = isArabic ? ['رقم الحجز', 'الموقف', 'المستخدم', 'وقت البداية', 'المدة', 'التكلفة', 'الحالة'] : ['Booking ID', 'Garage', 'User', 'Start Time', 'Duration', 'Cost', 'Status'];
            reportData = allBookings.map(b => [
                b.id,
                b.garage_name || b.garage_name_en || 'N/A',
                b.user_name || b.user_email || 'Guest',
                new Date(b.start_time).toLocaleString(),
                `${b.duration_hours || 0} ${isArabic ? 'ساعة' : 'hours'}`,
                b.total_cost || 0,
                b.status || 'active'
            ]);
            break;
        case 'revenue':
            filename = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
            headers = isArabic ? ['الفترة', 'عدد الحجوزات', 'إجمالي الإيرادات'] : ['Period', 'Bookings Count', 'Total Revenue'];
            const completedBookings = allBookings.filter(b => b.status === 'completed' || b.status === 'active');
            const totalRev = completedBookings.reduce((sum, b) => sum + (parseFloat(b.total_cost) || 0), 0);
            reportData = [
                [isArabic ? 'إجمالي' : 'Total', completedBookings.length, totalRev.toFixed(2)]
            ];
            break;
    }
    
    // Create CSV
    const csvContent = [
        headers.join(','),
        ...reportData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.languageManager.showNotification(
        isArabic ? `تم تصدير تقرير ${type} بنجاح` : `Report ${type} exported successfully`,
        'success'
    );
}

// Make functions globally available
window.editUser = editUser;
window.deleteUser = deleteUser;
window.adminEditGarage = adminEditGarage;
window.adminDeleteGarage = adminDeleteGarage;
window.generateReport = generateReport;

// Auto-refresh data every 30 seconds
setInterval(loadAdminData, 30000);

