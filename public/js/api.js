// API Configuration - Uses Vercel serverless functions
const API_BASE_URL = (() => {
  // Use relative path for Vercel serverless functions
  // In production, /api routes are automatically handled by Vercel
  return '/api';
})();

// API Service Class
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Generic fetch method
    async fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            console.log('🌐 API Request:', {
                url: url,
                method: config.method || 'GET',
                body: config.body ? JSON.parse(config.body) : null
            });
            
            const response = await window.fetch(url, config);
            const data = await response.json();
            
            console.log('🌐 API Response:', {
                status: response.status,
                ok: response.ok,
                data: data
            });
            
            if (!response.ok) {
                // Return error data with status code
                const error = new Error(data.message || `HTTP error! status: ${response.status}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            // If error already has data, re-throw it
            if (error.data) {
                throw error;
            }
            // Otherwise wrap it
            const wrappedError = new Error(error.message || 'API request failed');
            wrappedError.status = error.status || 500;
            wrappedError.data = { success: false, message: error.message };
            throw wrappedError;
        }
    }

    // Get all garages
    async getGarages(lat, lng) {
        const params = new URLSearchParams();
        if (lat) params.append('lat', lat);
        if (lng) params.append('lng', lng);
        
        const queryString = params.toString();
        const endpoint = `/garages${queryString ? `?${queryString}` : ''}`;
        
        return this.fetch(endpoint);
    }
    
    // Get data endpoint
    async getData() {
        return this.fetch('/data');
    }

    // Get garage by ID
    async getGarageById(id) {
        return this.fetch(`/garages/${id}`);
    }

    // Register new user
    async register(userData) {
        const body = {
            email: userData.email,
            password: userData.password,
            name: userData.name,
            phone: userData.phone,
            nationalId: userData.nationalId,
            role: userData.role || 'driver'
        };
        
        // Add driver-specific fields
        if (userData.drivingLicense) {
            body.drivingLicense = userData.drivingLicense;
        }
        if (userData.carLicense) {
            body.carLicense = userData.carLicense;
        }
        if (userData.carType) {
            body.carType = userData.carType;
        }
        if (userData.carColor) {
            body.carColor = userData.carColor;
        }
        
        // Add owner-specific fields
        if (userData.garageId) {
            body.garageId = userData.garageId;
        }
        
        return this.fetch('/auth', {
            method: 'POST',
            body: JSON.stringify({
                ...body,
                action: 'register'
            })
        });
    }

    // Login user
    async login(credentials) {
        return this.fetch('/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                action: 'login'
            })
        });
    }

    // Get current user
    async getCurrentUser() {
        const token = localStorage.getItem('token');
        return this.fetch('/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Create new garage
    async createGarage(garageData) {
        const token = localStorage.getItem('token');
        return this.fetch('/garages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(garageData)
        });
    }

    // Check if user has previous bookings (for first-time payment check)
    async hasPreviousBookings(userId) {
        const token = localStorage.getItem('token');
        try {
            const response = await this.fetch(`/bookings/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return Array.isArray(response) && response.length > 0;
        } catch (error) {
            // If endpoint doesn't exist or error, assume first booking
            return false;
        }
    }

    // Create booking - sends real POST request to backend API
    async createBooking(bookingData) {
        const token = localStorage.getItem('token');
        
        // Prepare booking payload with all required data
        const bookingPayload = {
            user_id: bookingData.user_id || 1,
            garage_id: bookingData.garage_id,
            start_time: bookingData.start_time,
            duration_hours: bookingData.duration_hours,
            space_id: bookingData.space_id,
            space_number: bookingData.space_number,
            price_type: bookingData.price_type || 'hourly',
            selected_route: bookingData.selected_route || 'direct',
            driver_info: bookingData.driver_info,
            payment: bookingData.payment
        };
        
        // Remove undefined fields
        Object.keys(bookingPayload).forEach(key => {
            if (bookingPayload[key] === undefined) {
                delete bookingPayload[key];
            }
        });
        
        return this.fetch('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(bookingPayload)
        });
    }

    // Get bookings by user
    async getUserBookings(userId) {
        const token = localStorage.getItem('token');
        return this.fetch(`/bookings/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Get bookings by garage (for owners)
    async getGarageBookings(garageId) {
        const token = localStorage.getItem('token');
        return this.fetch(`/bookings/garage/${garageId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Get bookings by owner (all garages)
    async getOwnerBookings(ownerId) {
        const token = localStorage.getItem('token');
        return this.fetch(`/bookings/owner/${ownerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Get all bookings (admin)
    async getAllBookings() {
        const token = localStorage.getItem('token');
        return this.fetch('/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Get garages by owner
    async getOwnerGarages(ownerId) {
        const token = localStorage.getItem('token');
        return this.fetch(`/garages/owner/${ownerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Get all users (admin)
    async getAllUsers() {
        const token = localStorage.getItem('token');
        return this.fetch('/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Get user by email (for auto-login)
    async getUserByEmail(email) {
        try {
            // Try to get from backend
            const token = localStorage.getItem('token');
            const response = await this.fetch(`/users/email/${encodeURIComponent(email)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            // Fallback: return null if user not found
            return { success: false, data: null };
        }
    }

    // Health check
    async healthCheck() {
        return this.fetch('/health');
    }
}

// Create API service instance
const apiService = new ApiService(API_BASE_URL);

// Export for use in other files
window.apiService = apiService;

