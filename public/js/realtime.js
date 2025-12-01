// Real-time Date and Time Manager
class RealTimeManager {
    constructor() {
        this.timeElement = null;
        this.dateElement = null;
        this.updateInterval = null;
        this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.init();
    }

    init() {
        // Create time display elements
        this.createTimeDisplay();
        
        // Start updating time
        this.startUpdating();
        
        // Sync with server time if possible
        this.syncWithServer();
    }

    createTimeDisplay() {
        // Check if time display already exists
        const existingTime = document.getElementById('realtime-clock');
        if (existingTime) {
            this.timeElement = existingTime;
            this.dateElement = document.getElementById('realtime-date');
            return;
        }

        // Create time display container
        const timeContainer = document.createElement('div');
        timeContainer.id = 'realtime-container';
        timeContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-xs);
            padding: var(--spacing-sm) var(--spacing-md);
            background: rgba(255, 255, 255, 0.95);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            font-family: var(--font-family);
        `;

        // Time element
        this.timeElement = document.createElement('div');
        this.timeElement.id = 'realtime-clock';
        this.timeElement.style.cssText = `
            font-size: var(--font-size-lg);
            font-weight: 700;
            color: var(--primary-blue);
            font-variant-numeric: tabular-nums;
        `;

        // Date element
        this.dateElement = document.createElement('div');
        this.dateElement.id = 'realtime-date';
        this.dateElement.style.cssText = `
            font-size: var(--font-size-sm);
            color: var(--gray-600);
        `;

        timeContainer.appendChild(this.timeElement);
        timeContainer.appendChild(this.dateElement);

        // Insert into navbar if it exists
        const navbar = document.querySelector('.nav-menu');
        if (navbar) {
            navbar.insertBefore(timeContainer, navbar.firstChild);
        } else {
            // Insert into body if no navbar
            document.body.insertBefore(timeContainer, document.body.firstChild);
        }
    }

    getCurrentTime() {
        return new Date();
    }

    formatTime(date, isArabic = false) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        if (isArabic) {
            return date.toLocaleTimeString('ar-EG', options);
        } else {
            return date.toLocaleTimeString('en-US', options);
        }
    }

    formatDate(date, isArabic = false) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        if (isArabic) {
            return date.toLocaleDateString('ar-EG', options);
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }

    updateDisplay() {
        if (!this.timeElement || !this.dateElement) return;

        const now = this.getCurrentTime();
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';

        // Update time
        this.timeElement.textContent = this.formatTime(now, isArabic);

        // Update date
        this.dateElement.textContent = this.formatDate(now, isArabic);
    }

    startUpdating() {
        // Update immediately
        this.updateDisplay();

        // Update every second
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async syncWithServer() {
        try {
            // Try to get server time from API
            if (window.apiService && window.apiService.healthCheck) {
                const response = await fetch('http://localhost:5000/api/v1/health');
                if (response.ok) {
                    const data = await response.json();
                    if (data.serverTime) {
                        // Sync with server time
                        const serverTime = new Date(data.serverTime);
                        const clientTime = new Date();
                        this.timeOffset = serverTime.getTime() - clientTime.getTime();
                    }
                }
            }
        } catch (error) {
            console.log('Could not sync with server time, using local time');
            this.timeOffset = 0;
        }
    }

    getCurrentTime() {
        const now = new Date();
        if (this.timeOffset) {
            return new Date(now.getTime() + this.timeOffset);
        }
        return now;
    }

    // Get formatted current time for forms
    getFormattedDateTime() {
        const now = this.getCurrentTime();
        return now.toISOString().slice(0, 16);
    }

    // Get current timestamp
    getCurrentTimestamp() {
        return this.getCurrentTime().getTime();
    }

    // Get current date string (YYYY-MM-DD)
    getCurrentDateString() {
        const now = this.getCurrentTime();
        return now.toISOString().split('T')[0];
    }

    // Get current time string (HH:MM:SS)
    getCurrentTimeString() {
        const now = this.getCurrentTime();
        return now.toTimeString().split(' ')[0];
    }
}

// Initialize real-time manager
let realTimeManager = null;

document.addEventListener('DOMContentLoaded', () => {
    realTimeManager = new RealTimeManager();
    window.realTimeManager = realTimeManager;
});

// Export for use in other files
window.getCurrentTime = () => realTimeManager ? realTimeManager.getCurrentTime() : new Date();
window.getFormattedDateTime = () => realTimeManager ? realTimeManager.getFormattedDateTime() : new Date().toISOString().slice(0, 16);
window.getCurrentTimestamp = () => realTimeManager ? realTimeManager.getCurrentTimestamp() : Date.now();

