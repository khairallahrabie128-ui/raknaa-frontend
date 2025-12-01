// Driver page functionality
let map;
let markers = [];
let userLocation = null;
let currentRoute = null; // Store current route control
let alternativeRoutes = []; // Store alternative routes
let trafficData = {}; // Store traffic information
let activeRoute = null; // Store active route info (from, to, destination)
let routeMonitor = null; // Store route monitoring interval
let locationWatcher = null; // Store geolocation watch ID
let lastTrafficCheck = null; // Store last traffic check location
let editMode = false; // Edit mode for adding garages manually
let mapClickHandler = null; // Store map click handler

document.addEventListener('DOMContentLoaded', async () => {
    // Wait for main.js to load
    if (typeof ALATTARIN_CENTER === 'undefined') {
        console.error('main.js not loaded. Please ensure js/main.js is loaded before js/driver.js');
        return;
    }
    
    // Try to get user location for better garage sorting
    let userLat, userLng;
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve, 
                    reject, 
                    { 
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0 // Always get fresh location
                    }
                );
            });
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            userLocation = {
                lat: userLat,
                lng: userLng
            };
            addUserMarker();
        } catch (error) {
            console.log('Could not get user location, using default');
            // Request location permission with better message
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'يرجى السماح بالوصول إلى موقعك للعثور على أقرب موقف' : 'Please allow location access to find the closest parking',
                    'info'
                );
            }
        }
    }
    
    // Load garages from API (will use updated coordinates from fallback data)
    try {
        if (typeof loadGaragesFromAPI === 'function') {
            await loadGaragesFromAPI(userLat, userLng);
            console.log('Garages loaded with updated coordinates from fallback data');
        }
    } catch (error) {
        console.error('Error loading garages:', error);
    }
    
    // Ensure garages are loaded immediately - use fallback data
    // Wait a moment for main.js to fully load
    setTimeout(() => {
        // Check if garageGrid exists
        const garageGrid = document.getElementById('garageGrid');
        if (!garageGrid) {
            console.error('garageGrid element not found!');
            return;
        }
        
        if (typeof garages === 'undefined' || !garages || garages.length === 0) {
            console.log('Garages not loaded yet, using fallback data immediately');
            if (typeof garagesFallback !== 'undefined' && garagesFallback && garagesFallback.length > 0) {
                garages = [...garagesFallback];
                console.log(`✅ Loaded ${garages.length} garages from fallback data immediately`);
            } else {
                console.warn('garagesFallback is not available yet');
                garageGrid.innerHTML = '<p style="text-align: center; padding: var(--spacing-xl); color: var(--gray-600);">جارٍ تحميل الجراجات...</p>';
                return;
            }
        }
        
        // Render garages immediately in the grid
        if (typeof renderGarages === 'function' && garages && garages.length > 0) {
            try {
                renderGarages();
                console.log(`✅ Rendered ${garages.length} garages in driver page immediately`);
            } catch (error) {
                console.error('Error rendering garages:', error);
                garageGrid.innerHTML = `<p style="text-align: center; padding: var(--spacing-xl); color: var(--error);">خطأ في عرض الجراجات: ${error.message}</p>`;
            }
        } else {
            console.warn('renderGarages function not found or no garages available');
            if (garages && garages.length > 0) {
                // Try manual rendering
                console.log('Attempting manual rendering...');
                garageGrid.innerHTML = garages.map(g => `<div>${g.name || g.nameEn || 'Garage'}</div>`).join('');
            } else {
                garageGrid.innerHTML = '<p style="text-align: center; padding: var(--spacing-xl); color: var(--gray-600);">لا توجد جراجات متاحة</p>';
            }
        }
    }, 100);
    
    initializeMap();
    setupEventListeners();
    
    // Wait a bit for language manager to initialize, then update map markers and re-render
    setTimeout(() => {
        // Ensure garages are loaded - use fallback data if needed
        if (typeof garages === 'undefined' || garages.length === 0) {
            console.log('Garages not loaded yet, using fallback data');
            if (typeof garagesFallback !== 'undefined' && garagesFallback.length > 0) {
                garages = [...garagesFallback];
                console.log(`Loaded ${garages.length} garages from fallback data`);
            }
        }
        
        // Re-render garages in the grid (in case data was updated)
        if (typeof renderGarages === 'function') {
            renderGarages();
            console.log(`✅ Re-rendered ${garages.length} garages in driver page`);
        }
        
        // Update map markers with new coordinates
        if (typeof updateMapMarkers === 'function') {
            updateMapMarkers();
        } else {
            console.error('updateMapMarkers function not found');
        }
    }, 500);
    
    // Also try to render after a longer delay to ensure everything is loaded
    setTimeout(() => {
        const garageGrid = document.getElementById('garageGrid');
        if (!garageGrid) {
            console.error('❌ garageGrid still not found after 1 second!');
            return;
        }
        
        if (typeof garages !== 'undefined' && garages && garages.length > 0) {
            if (typeof renderGarages === 'function') {
                try {
                    renderGarages();
                    console.log(`✅ Final render: ${garages.length} garages`);
                } catch (error) {
                    console.error('❌ Error in final render:', error);
                }
            } else {
                console.error('❌ renderGarages function not found in final render!');
            }
        } else if (typeof garagesFallback !== 'undefined' && garagesFallback && garagesFallback.length > 0) {
            garages = [...garagesFallback];
            if (typeof renderGarages === 'function') {
                try {
                    renderGarages();
                    console.log(`✅ Final render from fallback: ${garages.length} garages`);
                } catch (error) {
                    console.error('❌ Error in final render from fallback:', error);
                }
            } else {
                console.error('❌ renderGarages function not found in final render from fallback!');
            }
        } else {
            console.error('❌ No garages available at all!');
            if (garageGrid) {
                garageGrid.innerHTML = '<p style="text-align: center; padding: var(--spacing-xl); color: var(--gray-600);">لا توجد جراجات متاحة. يرجى تحديث الصفحة.</p>';
            }
        }
    }, 1000);
});

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    console.log('Map element found, initializing map...');
    
    if (typeof ALATTARIN_CENTER === 'undefined') {
        console.error('ALATTARIN_CENTER not defined');
        return;
    }
    
    console.log('ALATTARIN_CENTER:', ALATTARIN_CENTER);
    
    // Initialize map centered on Al-Attarin district
    try {
        map = L.map('map').setView([ALATTARIN_CENTER.lat, ALATTARIN_CENTER.lng], 14);
        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        return;
    }

    // Add multiple map layers for better visualization
    // Base layer: OpenStreetMap
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    });
    
    // Satellite/Imagery layer (optional, can be switched)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
    });
    
    // Add base layer
    osmLayer.addTo(map);
    
    // Add Al-Attarin district boundary polygon
    const alAttarinBoundary = L.polygon([
        [31.1970, 29.9050], // Southwest
        [31.2110, 29.9050], // Southeast
        [31.2110, 29.9190], // Northeast
        [31.1970, 29.9190]  // Northwest
    ], {
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5'
    }).addTo(map);
    
    // Add district label
    const districtLabel = L.marker([31.204, 29.912], {
        icon: L.divIcon({
            className: 'district-label',
            html: '<div style="background: rgba(37, 99, 235, 0.9); color: white; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); white-space: nowrap;">حي العطارين<br><small style="font-size: 11px; opacity: 0.9;">Al-Attarin District</small></div>',
            iconSize: [120, 50],
            iconAnchor: [60, 25]
        })
    }).addTo(map);
    
    // Store layers for layer control
    window.mapLayers = {
        base: osmLayer,
        satellite: satelliteLayer
    };

    // DELETE ALL CIRCLES - NO CIRCLES IN AL-ATTARIN OR ANYWHERE ELSE
    cleanMapFromRouteMarkers();
    
    // Add garage markers (only in Al-Attarin district) - NO CIRCLES, ONLY MARKERS
    updateMapMarkers();

    // Try to get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                addUserMarker();
            },
            (error) => {
                console.log('Geolocation error:', error);
            }
        );
    }
}

// Clean map from ALL circles and route markers - DELETE ALL CIRCLES EVERYWHERE
function cleanMapFromRouteMarkers() {
    if (!map) return;
    
    // Remove ALL circles from map - NO CIRCLES ANYWHERE (Al-Attarin or anywhere else)
    map.eachLayer(layer => {
        // Remove ALL circle markers, circles, polygons, and polylines
        if (layer instanceof L.CircleMarker || 
            layer instanceof L.Circle || 
            layer instanceof L.Polygon ||
            layer instanceof L.Polyline) {
            try {
                map.removeLayer(layer);
            } catch (e) {
                // Ignore errors if layer already removed
            }
        }
        // Remove any routing markers (waypoints, route markers)
        if (layer instanceof L.Marker) {
            // Keep only user marker
            if (!layer.options || !layer.options.isUserMarker) {
                const icon = layer.options.icon;
                if (icon && icon.options && icon.options.className) {
                    const className = icon.options.className;
                    // Remove Leaflet Routing Machine markers
                    if (className.includes('leaflet-routing') || 
                        className.includes('routing') ||
                        className.includes('waypoint') ||
                        className.includes('route')) {
                        try {
                            map.removeLayer(layer);
                        } catch (e) {
                            // Ignore errors
                        }
                    }
                }
            }
        }
    });
    
    // Double check - remove any remaining circles
    map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker || layer instanceof L.Circle) {
            try {
                map.removeLayer(layer);
            } catch (e) {
                // Ignore errors
            }
        }
    });
}

function updateMapMarkers() {
    if (!map) {
        console.error('Map not initialized');
        return;
    }
    
    if (typeof garages === 'undefined' || !garages || garages.length === 0) {
        console.log('No garages data available for map markers, trying fallback...');
        // Try to use fallback data
        if (typeof garagesFallback !== 'undefined' && garagesFallback.length > 0) {
            garages = [...garagesFallback];
            console.log(`Using fallback data: ${garages.length} garages`);
        } else {
            console.error('No garages data available at all');
            return;
        }
    }
    
    // Remove ALL circles first
    cleanMapFromRouteMarkers();
    
    // Remove existing garage markers (keep user marker)
    markers.forEach(marker => {
        if (marker.options && !marker.options.isUserMarker) {
            map.removeLayer(marker);
        }
    });
    // Keep only user marker in array
    markers = markers.filter(m => m.options && m.options.isUserMarker);
    
    // Remove any route-related markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            if (!layer.options || !layer.options.isUserMarker) {
                const icon = layer.options.icon;
                if (icon && icon.options && icon.options.className) {
                    const className = icon.options.className;
                    if (className.includes('leaflet-routing') || 
                        className.includes('routing') ||
                        className.includes('waypoint')) {
                        map.removeLayer(layer);
                    }
                }
            }
        }
    });
    
    // Add garage markers from GARAGE.lpkx data
    loadGaragePointsFromLPKX();
    
    // Re-add user marker if it exists
    if (userLocation) {
        addUserMarker();
    }
}

// Check if garage coordinates are within the service area
// Includes: Al-Manshiya (المنشية), Kom El-Dikka (كوم الدكة), Raml Station (محطة الرمل), and Al-Attarin (حي العطارين)
function isGarageInAlAttarin(lat, lng) {
    // Expanded boundaries to include all areas:
    // - Al-Manshiya (المنشية): South-west ~31.1980, 29.9060
    // - Kom El-Dikka (كوم الدكة): South-east, near railway ~31.1990, 29.9170
    // - Raml Station (محطة الرمل): North ~31.2100, 29.9100
    // - Al-Attarin district (حي العطارين): Central area ~31.2000-31.2080, 29.9060-29.9180
    const minLat = 31.1970;  // South boundary (includes Al-Manshiya and Kom El-Dikka)
    const maxLat = 31.2110;  // North boundary (includes Raml Station)
    const minLng = 29.9050;  // West boundary
    const maxLng = 29.9190;  // East boundary (includes Kom El-Dikka and railway area)
    
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

// Toggle edit mode for adding garages manually
function toggleEditMode() {
    editMode = !editMode;
    const editModeBtn = document.getElementById('editModeBtn');
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    if (editMode) {
        // Enable edit mode
        if (editModeBtn) {
            editModeBtn.classList.add('active');
            editModeBtn.style.background = '#ef4444';
            editModeBtn.title = isArabic ? 'إيقاف وضع التعديل' : 'Exit Edit Mode';
        }
        
        // Add click handler to map
        if (map) {
            map.on('click', handleMapClickForAddGarage);
            map.getContainer().style.cursor = 'crosshair';
            
            // Show notification
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'انقر على الخريطة لإضافة جراج جديد' : 'Click on the map to add a new garage',
                    'info'
                );
            }
        }
    } else {
        // Disable edit mode
        if (editModeBtn) {
            editModeBtn.classList.remove('active');
            editModeBtn.style.background = '';
            editModeBtn.title = isArabic ? 'وضع التعديل - إضافة جراجات' : 'Edit Mode - Add Garages';
        }
        
        // Remove click handler from map
        if (map) {
            map.off('click', handleMapClickForAddGarage);
            map.getContainer().style.cursor = '';
        }
        
        // Remove temporary marker if exists
        if (window.tempGarageMarker) {
            map.removeLayer(window.tempGarageMarker);
            window.tempGarageMarker = null;
        }
    }
}

// Handle map click in edit mode
function handleMapClickForAddGarage(e) {
    if (!editMode) return;
    
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Fill coordinates in form
    const garageLatitude = document.getElementById('garageLatitude');
    const garageLongitude = document.getElementById('garageLongitude');
    
    if (garageLatitude) garageLatitude.value = lat.toFixed(6);
    if (garageLongitude) garageLongitude.value = lng.toFixed(6);
    
    // Show modal
    const addGarageModal = document.getElementById('addGarageModal');
    if (addGarageModal) {
        addGarageModal.classList.add('active');
    }
    
    // Add temporary marker
    const tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'temp-garage-marker',
            html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);
    
    // Store marker to remove if user cancels
    window.tempGarageMarker = tempMarker;
}

// Handle add garage form submission
async function handleAddGarage(e) {
    e.preventDefault();
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Get form values
    const garageData = {
        name: document.getElementById('garageNameAr').value,
        name_en: document.getElementById('garageNameEn').value,
        address: document.getElementById('garageAddressAr').value,
        address_en: document.getElementById('garageAddressEn').value,
        latitude: parseFloat(document.getElementById('garageLatitude').value),
        longitude: parseFloat(document.getElementById('garageLongitude').value),
        total_spaces: parseInt(document.getElementById('garageTotalSpaces').value),
        hourly_rate: parseFloat(document.getElementById('garageHourlyRate').value),
        operating_hours: document.getElementById('garageOperatingHours').value,
        rating: 0,
        reviews_count: 0,
        type: 'public',
        amenities: [],
        amenities_en: []
    };
    
    try {
        // Try to save to backend API
        if (window.apiService) {
            const response = await window.apiService.createGarage(garageData);
            if (response.success) {
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'تم إضافة الجراج بنجاح!' : 'Garage added successfully!',
                        'success'
                    );
                }
                
                // Reload garages
                if (typeof loadGaragesFromAPI === 'function') {
                    await loadGaragesFromAPI(userLocation?.lat, userLocation?.lng);
                    updateMapMarkers();
                }
            } else {
                throw new Error(response.message || 'Failed to add garage');
            }
        } else {
            // Fallback: save to localStorage
            let customGarages = JSON.parse(localStorage.getItem('customGarages') || '[]');
            garageData.id = Date.now(); // Temporary ID
            customGarages.push(garageData);
            localStorage.setItem('customGarages', JSON.stringify(customGarages));
            
            // Add to current garages array
            if (typeof garages !== 'undefined') {
                garages.push({
                    id: garageData.id,
                    name: garageData.name,
                    nameEn: garageData.name_en,
                    address: garageData.address,
                    addressEn: garageData.address_en,
                    latitude: garageData.latitude,
                    longitude: garageData.longitude,
                    totalSpaces: garageData.total_spaces,
                    occupiedSpaces: 0,
                    hourlyRate: garageData.hourly_rate,
                    rating: garageData.rating,
                    reviews: garageData.reviews_count,
                    availability: 'available',
                    operatingHours: garageData.operating_hours,
                    amenities: garageData.amenities,
                    amenitiesEn: garageData.amenities_en,
                    distance: 0,
                    type: garageData.type
                });
                
                updateMapMarkers();
            }
            
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'تم إضافة الجراج بنجاح! (محفوظ محلياً)' : 'Garage added successfully! (saved locally)',
                    'success'
                );
            }
        }
        
        // Close modal and reset form
        const addGarageModal = document.getElementById('addGarageModal');
        if (addGarageModal) {
            addGarageModal.classList.remove('active');
        }
        document.getElementById('addGarageForm').reset();
        
        // Remove temporary marker
        if (window.tempGarageMarker) {
            map.removeLayer(window.tempGarageMarker);
            window.tempGarageMarker = null;
        }
        
        // Exit edit mode
        toggleEditMode();
        
    } catch (error) {
        console.error('Error adding garage:', error);
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabic ? 'حدث خطأ أثناء إضافة الجراج' : 'Error adding garage',
                'error'
            );
        }
    }
}

// Load garage points from GARAGE.lpkx JSON file and add to map
async function loadGaragePointsFromLPKX() {
    try {
        // First, try to load from LPKX JSON file
        try {
            const response = await fetch('garage_points_for_map.json');
            if (response.ok) {
                const lpkxData = await response.json();
                if (lpkxData.garages && lpkxData.garages.length > 0) {
                    console.log(`Loaded ${lpkxData.garages.length} garages from LPKX file (GARAGE.lpkx)`);
                    
                    // Clear existing garages and use LPKX data as primary source
                    const lpkxGarages = [];
                    
                    lpkxData.garages.forEach(lpkxGarage => {
                        // Check if garage already exists in garages array
                        const existingGarage = garages.find(g => 
                            g.id === lpkxGarage.id || 
                            (g.name === lpkxGarage.name || g.nameEn === lpkxGarage.name_en) ||
                            (Math.abs(parseFloat(g.latitude) - parseFloat(lpkxGarage.latitude)) < 0.0001 &&
                             Math.abs(parseFloat(g.longitude) - parseFloat(lpkxGarage.longitude)) < 0.0001)
                        );
                        
                        if (existingGarage) {
                            // Update existing garage with LPKX coordinates and ALL data (prices, capacity, operating hours)
                            existingGarage.latitude = parseFloat(lpkxGarage.latitude);
                            existingGarage.longitude = parseFloat(lpkxGarage.longitude);
                            if (lpkxGarage.total_spaces) {
                                existingGarage.totalSpaces = lpkxGarage.total_spaces;
                            }
                            // Update name if available
                            if (lpkxGarage.name) {
                                existingGarage.name = lpkxGarage.name;
                            }
                            if (lpkxGarage.name_en) {
                                existingGarage.nameEn = lpkxGarage.name_en;
                            }
                            // Update ALL pricing data from LPKX
                            if (lpkxGarage.hourly_rate !== undefined) {
                                existingGarage.hourlyRate = lpkxGarage.hourly_rate;
                            }
                            if (lpkxGarage.additional_hour_rate !== undefined) {
                                existingGarage.additionalHourRate = lpkxGarage.additional_hour_rate;
                            }
                            if (lpkxGarage.overnight_rate !== undefined) {
                                existingGarage.overnightRate = lpkxGarage.overnight_rate;
                            }
                            if (lpkxGarage.monthly_rate !== undefined) {
                                existingGarage.monthlyRate = lpkxGarage.monthly_rate;
                            }
                            if (lpkxGarage.waiting_daily_monthly_rate !== undefined) {
                                existingGarage.waitingDailyMonthlyRate = lpkxGarage.waiting_daily_monthly_rate;
                            }
                            // Update operating hours
                            if (lpkxGarage.operating_hours) {
                                existingGarage.operatingHours = lpkxGarage.operating_hours;
                            }
                            lpkxGarages.push(existingGarage);
                        } else {
                            // Add new garage from LPKX - use LPKX data as primary source with ALL pricing data
                            const newGarage = {
                                id: lpkxGarage.id || (garages.length + lpkxGarages.length + 1),
                                name: lpkxGarage.name || '',
                                nameEn: lpkxGarage.name_en || lpkxGarage.name || '',
                                address: lpkxGarage.address || '',
                                addressEn: lpkxGarage.address_en || lpkxGarage.address || '',
                                latitude: parseFloat(lpkxGarage.latitude),
                                longitude: parseFloat(lpkxGarage.longitude),
                                totalSpaces: lpkxGarage.total_spaces || 20,
                                occupiedSpaces: lpkxGarage.occupied_spaces || 0,
                                hourlyRate: lpkxGarage.hourly_rate || 10,
                                additionalHourRate: lpkxGarage.additional_hour_rate || null,
                                overnightRate: lpkxGarage.overnight_rate || null,
                                monthlyRate: lpkxGarage.monthly_rate || null,
                                waitingDailyMonthlyRate: lpkxGarage.waiting_daily_monthly_rate || null,
                                rating: lpkxGarage.rating || 0,
                                reviews: lpkxGarage.reviews || 0,
                                availability: lpkxGarage.availability || 'available',
                                operatingHours: lpkxGarage.operating_hours || '24 hours',
                                amenities: lpkxGarage.amenities || [],
                                amenitiesEn: lpkxGarage.amenities_en || [],
                                distance: 0,
                                type: lpkxGarage.type || 'public'
                            };
                            lpkxGarages.push(newGarage);
                        }
                    });
                    
                    // If we have LPKX garages, prioritize them - USE LPKX AS PRIMARY SOURCE
                    if (lpkxGarages.length > 0) {
                        console.log(`Using ${lpkxGarages.length} garages from GARAGE.lpkx as PRIMARY source`);
                        // Replace all garages with LPKX data - LPKX is the source of truth for locations
                        garages = lpkxGarages;
                        console.log(`Replaced all garages with ${garages.length} garages from GARAGE.lpkx`);
                    }
                }
            }
        } catch (fetchError) {
            console.log('Could not load LPKX file, using existing data:', fetchError);
        }
        
        // Use garages from main.js (which has occupiedSpaces data)
        if (typeof garages === 'undefined' || !garages || garages.length === 0) {
            console.log('No garages data available, trying fallback...');
            // Try to use fallback data
            if (typeof garagesFallback !== 'undefined' && garagesFallback.length > 0) {
                garages = [...garagesFallback];
                console.log(`Using fallback data: ${garages.length} garages`);
            } else {
                console.error('No garages data available at all');
                return;
            }
        }
        
        console.log(`Loading ${garages.length} garage points with availability colors...`);
        
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        
        garages.forEach(garage => {
        if (!garage.latitude || !garage.longitude || 
            isNaN(parseFloat(garage.latitude)) || isNaN(parseFloat(garage.longitude))) {
            return;
        }
        
        const lat = parseFloat(garage.latitude);
        const lng = parseFloat(garage.longitude);
        
        // Validate coordinates are in Alexandria range
        if (lat < 31.19 || lat > 31.22 || lng < 29.90 || lng > 29.93) {
            return;
        }
        
        // Calculate availability based on spaces (using same logic as backend)
        let availability = 'available';
        const occupiedSpaces = garage.occupiedSpaces || 0;
        const totalSpaces = garage.totalSpaces || 0;
        
        if (totalSpaces > 0) {
            const occupancyRate = (occupiedSpaces / totalSpaces) * 100;
            
            if (occupancyRate >= 90) {
                availability = 'full';
            } else if (occupancyRate >= 70) {
                availability = 'limited';
            } else {
                availability = 'available';
            }
        } else if (garage.availability) {
            availability = garage.availability;
        }
        
        // Get color from legend key
        const markerColor = getMarkerColor(availability);
            
            // Create marker for garage with color from legend
            const garageMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'garage-point-marker',
                    html: `
                        <div style="
                            background: ${markerColor};
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            cursor: pointer;
                        "></div>
                    `,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                })
            }).addTo(map);
            
            // Store availability in marker
            garageMarker.availability = availability;
            
            // Get garage name
            const garageName = isArabic ? (garage.name || garage.nameEn) : (garage.nameEn || garage.name);
            const garageAddress = isArabic ? (garage.address || '') : (garage.addressEn || garage.address || '');
            
            // Create popup with all pricing information
            const priceInfo = [];
            if (garage.hourlyRate) {
                priceInfo.push(`<div style="margin: 4px 0; font-size: 13px;"><strong>${isArabic ? 'الساعة' : 'Hour'}:</strong> ${garage.hourlyRate} ${isArabic ? 'جنيه' : 'EGP'}</div>`);
            }
            if (garage.additionalHourRate) {
                priceInfo.push(`<div style="margin: 4px 0; font-size: 12px; color: #666;"><strong>${isArabic ? 'ساعة إضافية' : 'Additional Hour'}:</strong> ${garage.additionalHourRate} ${isArabic ? 'جنيه' : 'EGP'}</div>`);
            }
            if (garage.overnightRate) {
                priceInfo.push(`<div style="margin: 4px 0; font-size: 12px; color: #666;"><strong>${isArabic ? 'ليلة' : 'Overnight'}:</strong> ${garage.overnightRate} ${isArabic ? 'جنيه' : 'EGP'}</div>`);
            }
            if (garage.monthlyRate) {
                priceInfo.push(`<div style="margin: 4px 0; font-size: 12px; color: #666;"><strong>${isArabic ? 'شهري' : 'Monthly'}:</strong> ${garage.monthlyRate} ${isArabic ? 'جنيه' : 'EGP'}</div>`);
            }
            if (garage.waitingDailyMonthlyRate) {
                priceInfo.push(`<div style="margin: 4px 0; font-size: 12px; color: #666;"><strong>${isArabic ? 'انتظار يومي (شهري)' : 'Daily Waiting (Monthly)'}:</strong> ${garage.waitingDailyMonthlyRate} ${isArabic ? 'جنيه' : 'EGP'}</div>`);
            }
            
            const popupContent = `
                <div style="text-align: ${isArabic ? 'right' : 'left'}; min-width: 220px;">
                    <h4 style="margin: 0 0 8px 0; font-weight: 700; color: #1f2937;">${garageName}</h4>
                    ${garageAddress ? `
                    <p style="margin: 4px 0; font-size: 14px; color: #666;">
                        <i class="fas fa-map-marker-alt" style="color: #2563eb;"></i> ${garageAddress}
                    </p>
                    ` : ''}
                    ${garage.totalSpaces ? `
                    <p style="margin: 4px 0; font-size: 14px;">
                        <i class="fas fa-car" style="color: ${markerColor};"></i> 
                        <strong>${garage.totalSpaces - (garage.occupiedSpaces || 0)}</strong> / <strong>${garage.totalSpaces}</strong> ${isArabic ? 'متاح' : 'available'}
                    </p>
                    <p style="margin: 4px 0; font-size: 12px; color: #666;">
                        ${isArabic ? 'الحالة:' : 'Status:'} 
                        <span style="color: ${markerColor}; font-weight: 600;">
                            ${availability === 'full' ? (isArabic ? 'ممتلئ' : 'Full') : 
                              availability === 'limited' ? (isArabic ? 'محدود' : 'Limited') : 
                              (isArabic ? 'متاح' : 'Available')}
                        </span>
                    </p>
                    ` : ''}
                    ${priceInfo.length > 0 ? `
                    <div style="margin: 8px 0; padding: 8px; background: #f3f4f6; border-radius: 6px; border-left: 3px solid #2563eb;">
                        <div style="font-weight: 600; margin-bottom: 4px; font-size: 13px; color: #1f2937;">${isArabic ? 'الأسعار' : 'Pricing'}:</div>
                        ${priceInfo.join('')}
                    </div>
                    ` : ''}
                    <button class="btn btn-primary" onclick="openBookingModal(${garage.id || 0})" style="margin-top: 8px; width: 100%; padding: 8px; border-radius: 6px; background: #2563eb; color: white; border: none; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-calendar-check"></i> ${isArabic ? 'احجز الآن' : 'Book Now'}
                    </button>
                </div>
            `;
            
            garageMarker.bindPopup(popupContent);
            
            // Store garage data in marker with availability and pricing
            garageMarker.garageData = {
                ...garage,
                availability: availability,
                occupiedSpaces: occupiedSpaces,
                totalSpaces: totalSpaces,
                hourlyRate: garage.hourlyRate,
                additionalHourRate: garage.additionalHourRate,
                overnightRate: garage.overnightRate,
                monthlyRate: garage.monthlyRate,
                waitingDailyMonthlyRate: garage.waitingDailyMonthlyRate
            };
            
                // Add click event to show route when marker is clicked
                garageMarker.on('click', function() {
                    // Store garage data in marker for easy access
                    const garageData = {
                        id: garage.id,
                        name: garage.name,
                        nameEn: garage.nameEn || garage.name,
                        name_en: garage.nameEn || garage.name, // For compatibility
                        latitude: garage.latitude,
                        longitude: garage.longitude,
                        availability: availability,
                        occupiedSpaces: occupiedSpaces,
                        totalSpaces: totalSpaces,
                        hourlyRate: garage.hourlyRate,
                        additionalHourRate: garage.additionalHourRate,
                        overnightRate: garage.overnightRate,
                        monthlyRate: garage.monthlyRate,
                        waitingDailyMonthlyRate: garage.waitingDailyMonthlyRate
                    };
                    
                    if (userLocation) {
                        showRouteToSelectedGarage(garage.latitude, garage.longitude, garageData);
                    } else {
                        // Try to get user location first
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    userLocation = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude
                                    };
                                    addUserMarker();
                                    showRouteToSelectedGarage(garage.latitude, garage.longitude, garageData);
                                },
                                (error) => {
                                    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                                    if (window.languageManager) {
                                        window.languageManager.showNotification(
                                            isArabic ? 'يرجى السماح بالوصول إلى موقعك لعرض المسار' : 'Please allow location access to show route',
                                            'warning'
                                        );
                                    }
                                }
                            );
                        }
                    }
                });
            
            markers.push(garageMarker);
        });
        
        console.log(`✅ Added ${garages.length} garage points to map with availability colors`);
    } catch (error) {
        console.error('Error loading garage points:', error);
    }
}

function getMarkerColor(availability) {
    switch (availability) {
        case 'available': return '#10b981';
        case 'limited': return '#f59e0b';
        case 'full': return '#ef4444';
        default: return '#6b7280';
    }
}

function addUserMarker() {
    if (!userLocation) return;
    
    // Remove existing user marker if any
    markers.forEach(marker => {
        if (marker.options && marker.options.isUserMarker) {
            map.removeLayer(marker);
        }
    });
    markers = markers.filter(m => !(m.options && m.options.isUserMarker));
    
    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
            className: 'user-marker',
            html: '<div style="width: 20px; height: 20px; background: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20]
        }),
        isUserMarker: true // Mark as user marker (not parking, not road)
    }).addTo(map);
    
    markers.push(userMarker);
}

function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const locationSearch = document.getElementById('locationSearch');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (locationSearch) {
        locationSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Filter functionality
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', handleFilter);
    }

    // Map controls
    const centerMapBtn = document.getElementById('centerMapBtn');
    if (centerMapBtn) {
        centerMapBtn.addEventListener('click', centerMapOnUser);
    }

    // Find closest facility button
    const findClosestBtn = document.getElementById('findClosestBtn');
    if (findClosestBtn) {
        findClosestBtn.addEventListener('click', findClosestFacility);
    }

    const refreshMapBtn = document.getElementById('refreshMapBtn');
    if (refreshMapBtn) {
        refreshMapBtn.addEventListener('click', refreshMap);
    }

    // Route selection button
    const showRouteSelectionBtn = document.getElementById('showRouteSelectionBtn');
    const routeSelection = document.getElementById('routeSelection');
    if (showRouteSelectionBtn && routeSelection) {
        showRouteSelectionBtn.addEventListener('click', () => {
            const isVisible = routeSelection.style.display !== 'none';
            routeSelection.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Route selection buttons
    const routeButtons = document.querySelectorAll('.route-btn');
    routeButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const routeType = this.getAttribute('data-route');
            
            // Get selected garage from booking form or last clicked garage
            const garageNameInput = document.getElementById('bookingGarageName');
            let garageId = null;
            let garage = null;
            
            if (garageNameInput && garageNameInput.dataset.garageId) {
                garageId = parseInt(garageNameInput.dataset.garageId);
                garage = garages.find(g => g.id === garageId);
            } else if (window.lastSelectedGarage) {
                garage = window.lastSelectedGarage;
            }
            
            if (!garage) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'يرجى اختيار جراج أولاً' : 'Please select a garage first',
                        'warning'
                    );
                }
                return;
            }
            
            // Get user location
            let fromLat, fromLng;
            if (userLocation && userLocation.lat && userLocation.lng) {
                fromLat = userLocation.lat;
                fromLng = userLocation.lng;
            } else {
                try {
                    const position = await new Promise((resolve, reject) => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        } else {
                            reject(new Error('Geolocation not supported'));
                        }
                    });
                    fromLat = position.coords.latitude;
                    fromLng = position.coords.longitude;
                    userLocation = { lat: fromLat, lng: fromLng };
                    addUserMarker();
                } catch (error) {
                    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                    if (window.languageManager) {
                        window.languageManager.showNotification(
                            isArabic ? 'لا يمكن الوصول إلى موقعك' : 'Cannot access your location',
                            'error'
                        );
                    }
                    return;
                }
            }
            
            // Show selected route
            if (typeof selectRoute === 'function') {
                await selectRoute(routeType, fromLat, fromLng, garage.latitude, garage.longitude, garage);
                // Hide route selection panel
                if (routeSelection) {
                    routeSelection.style.display = 'none';
                }
            }
        });
        
        // Add hover effect
        btn.addEventListener('mouseenter', function() {
            this.style.background = '#f0f9ff';
            this.style.borderColor = '#2563eb';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'var(--white)';
            this.style.borderColor = 'var(--gray-300)';
        });
    });

    // Toggle map layer button
    const toggleMapLayerBtn = document.getElementById('toggleMapLayerBtn');
    let currentMapLayer = 'osm'; // 'osm' or 'satellite'
    if (toggleMapLayerBtn) {
        toggleMapLayerBtn.addEventListener('click', () => {
            if (!map || !window.mapLayers) return;
            
            if (currentMapLayer === 'osm') {
                map.removeLayer(window.mapLayers.base);
                window.mapLayers.satellite.addTo(map);
                currentMapLayer = 'satellite';
                toggleMapLayerBtn.title = 'تبديل إلى الخريطة العادية';
            } else {
                map.removeLayer(window.mapLayers.satellite);
                window.mapLayers.base.addTo(map);
                currentMapLayer = 'osm';
                toggleMapLayerBtn.title = 'تبديل إلى الخريطة الفضائية';
            }
        });
    }

    // Edit mode button
    const editModeBtn = document.getElementById('editModeBtn');
    if (editModeBtn) {
        editModeBtn.addEventListener('click', toggleEditMode);
    }

    // Add garage modal
    const addGarageModal = document.getElementById('addGarageModal');
    const closeAddGarageModal = document.getElementById('closeAddGarageModal');
    const cancelAddGarageBtn = document.getElementById('cancelAddGarageBtn');
    const addGarageForm = document.getElementById('addGarageForm');

    if (closeAddGarageModal) {
        closeAddGarageModal.addEventListener('click', () => {
            addGarageModal.classList.remove('active');
            toggleEditMode(); // Exit edit mode when closing modal
        });
    }

    if (cancelAddGarageBtn) {
        cancelAddGarageBtn.addEventListener('click', () => {
            addGarageModal.classList.remove('active');
            toggleEditMode(); // Exit edit mode when canceling
        });
    }

    if (addGarageForm) {
        addGarageForm.addEventListener('submit', handleAddGarage);
    }

    // Booking modal
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModal = document.getElementById('closeBookingModal');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    const bookingForm = document.getElementById('bookingForm');
    const bookingDuration = document.getElementById('bookingDuration');

    if (closeBookingModal) {
        closeBookingModal.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
    }

    if (cancelBookingBtn) {
        cancelBookingBtn.addEventListener('click', () => {
            bookingModal.classList.remove('active');
        });
    }

    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    if (bookingDuration) {
        bookingDuration.addEventListener('input', () => {
            if (typeof updateBookingCostInDriver === 'function') {
                updateBookingCostInDriver();
            } else {
                const garageNameInput = document.getElementById('bookingGarageName');
                const garageId = garageNameInput ? parseInt(garageNameInput.dataset.garageId) : null;
                if (garageId) {
                    const garage = garages.find(g => g.id === garageId);
                    if (garage) {
                        updateBookingCost(garage.hourlyRate);
                    }
                }
            }
        });
    }
    
    // Add event listener for price type change
    const priceTypeSelect = document.getElementById('bookingPriceType');
    if (priceTypeSelect) {
        priceTypeSelect.addEventListener('change', () => {
            if (typeof updateBookingCostInDriver === 'function') {
                updateBookingCostInDriver();
            }
        });
    }
    
    // Add event listener for route selection - show route on map when selected
    const routeSelect = document.getElementById('bookingRoute');
    if (routeSelect) {
        routeSelect.addEventListener('change', async () => {
            const garageNameInput = document.getElementById('bookingGarageName');
            const garageId = garageNameInput ? parseInt(garageNameInput.dataset.garageId) : null;
            if (!garageId || !map) {
                console.log('Missing garageId or map');
                return;
            }
            
            const garage = garages.find(g => g.id === garageId);
            if (!garage) {
                console.log('Garage not found');
                return;
            }
            
            // Get user location
            let fromLat, fromLng;
            if (userLocation && userLocation.lat && userLocation.lng) {
                fromLat = userLocation.lat;
                fromLng = userLocation.lng;
            } else {
                // Try to get location from geolocation
                try {
                    const position = await new Promise((resolve, reject) => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        } else {
                            reject(new Error('Geolocation not supported'));
                        }
                    });
                    fromLat = position.coords.latitude;
                    fromLng = position.coords.longitude;
                } catch (error) {
                    console.error('Cannot get user location:', error);
                    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                    if (window.languageManager) {
                        window.languageManager.showNotification(
                            isArabic ? 'لا يمكن الوصول إلى موقعك لعرض المسار' : 'Cannot access location to show route',
                            'error'
                        );
                    }
                    return;
                }
            }
            
            const selectedRoute = routeSelect.value;
            console.log('Route selected:', selectedRoute, 'From:', fromLat, fromLng, 'To:', garage.latitude, garage.longitude);
            
            // Show route on map based on selection
            if (typeof selectRoute === 'function') {
                await selectRoute(selectedRoute, fromLat, fromLng, garage.latitude, garage.longitude, garage);
            } else {
                console.error('selectRoute function not found');
            }
        });
    }

// Check if payment is required (for guests OR drivers on first booking)
async function checkPaymentRequired() {
    // Check if user is authenticated
    const isAuthenticated = window.isAuthenticated ? window.isAuthenticated() : false;
    
    // Guests always need payment
    if (!isAuthenticated) {
        return true;
    }
    
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!user) return true; // Require payment if no user data
    
    // Only drivers need payment on first booking
    if (user.role && user.role !== 'driver') {
        return false;
    }
    
    // Check if user has previous bookings
    try {
        if (window.apiService && window.apiService.hasPreviousBookings && user.id) {
            const hasPrevious = await window.apiService.hasPreviousBookings(user.id);
            return !hasPrevious; // Payment required if no previous bookings
        }
    } catch (error) {
        console.error('Error checking previous bookings:', error);
        // If we can't check, assume first booking (require payment)
        return true;
    }
    
    // Default: require payment for drivers (assume first booking)
    return true;
}

    // Payment method change handler
    const paymentMethod = document.getElementById('paymentMethod');
    const cardDetails = document.getElementById('cardDetails');
    const walletDetails = document.getElementById('walletDetails');
    
    if (paymentMethod) {
        paymentMethod.addEventListener('change', (e) => {
            const method = e.target.value;
            // Show card details for: visa, miza, credit, instapay
            const showCardDetails = method === 'visa' || method === 'miza' || method === 'credit' || method === 'instapay';
            if (cardDetails) cardDetails.style.display = showCardDetails ? 'block' : 'none';
            if (walletDetails) walletDetails.style.display = method === 'wallet' ? 'block' : 'none';
            
            // Clear validation
            if (cardDetails) {
                const cardInputs = cardDetails.querySelectorAll('input');
                cardInputs.forEach(input => input.removeAttribute('required'));
            }
            if (walletDetails) {
                const walletInputs = walletDetails.querySelectorAll('input');
                walletInputs.forEach(input => input.removeAttribute('required'));
            }
            
            // Set required based on method
            if (showCardDetails) {
                if (cardDetails) {
                    const cardInputs = cardDetails.querySelectorAll('input');
                    cardInputs.forEach(input => input.setAttribute('required', 'required'));
                }
            } else if (method === 'wallet') {
                if (walletDetails) {
                    const walletInputs = walletDetails.querySelectorAll('input');
                    walletInputs.forEach(input => input.setAttribute('required', 'required'));
                }
            }
        });
    }

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
            e.target.value = formattedValue;
        });
    }

    // Format expiry date input
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Format CVV input (numbers only)
    const cardCVVInput = document.getElementById('cardCVV');
    if (cardCVVInput) {
        cardCVVInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    // View toggle
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            const garageGrid = document.getElementById('garageGrid');
            if (garageGrid) {
                garageGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
            }
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => {
            const garageGrid = document.getElementById('garageGrid');
            if (garageGrid) {
                garageGrid.style.gridTemplateColumns = '1fr';
            }
        });
    }
}

async function handleSearch() {
    if (typeof garages === 'undefined' || typeof renderGarages !== 'function') return;
    
    const searchInput = document.getElementById('locationSearch');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        // Reload from API if available
        try {
            if (typeof loadGaragesFromAPI === 'function') {
                await loadGaragesFromAPI();
            }
        } catch (error) {
            console.error('Error reloading garages:', error);
        }
        renderGarages();
        return;
    }

    const filtered = garages.filter(garage => {
        const name = getGarageName(garage).toLowerCase();
        const address = getGarageAddress(garage).toLowerCase();
        return name.includes(query) || address.includes(query);
    });

    renderGarages(filtered);
    
    // Center map on first result
    if (filtered.length > 0 && map) {
        map.setView([filtered[0].latitude, filtered[0].longitude], 15);
    }
}

function handleFilter() {
    if (typeof garages === 'undefined' || typeof renderGarages !== 'function') return;
    
    const priceFilter = document.getElementById('priceFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;

    let filtered = garages;

    // Filter by price
    if (priceFilter) {
        filtered = filtered.filter(garage => {
            if (priceFilter === '0-10') return garage.hourlyRate <= 10;
            if (priceFilter === '10-20') return garage.hourlyRate > 10 && garage.hourlyRate <= 20;
            if (priceFilter === '20+') return garage.hourlyRate > 20;
            return true;
        });
    }

    // Filter by type
    if (typeFilter) {
        // For now, we'll filter by availability status
        // In a real app, you'd have a type field
        if (typeFilter === 'handicap') {
            filtered = filtered.filter(garage => 
                getGarageAmenities(garage).some(a => 
                    a.toLowerCase().includes('handicap') || 
                    a.toLowerCase().includes('احتياجات')
                )
            );
        }
    }

    renderGarages(filtered);
    updateMapMarkers();
}

function centerMapOnUser() {
    if (!map) return;
    
    if (userLocation && map) {
        map.setView([userLocation.lat, userLocation.lng], 15);
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabic ? 'تم توسيط الخريطة على موقعك' : 'Map centered on your location',
                'info'
            );
        }
    } else {
        // Center on Al-Attarin if no user location
        if (typeof ALATTARIN_CENTER !== 'undefined') {
            map.setView([ALATTARIN_CENTER.lat, ALATTARIN_CENTER.lng], 14);
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    addUserMarker();
                    map.setView([userLocation.lat, userLocation.lng], 15);
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            );
        }
    }
}

async function refreshMap() {
    // Clean map from route markers first
    cleanMapFromRouteMarkers();
    
    // Reload garages from API
    try {
        if (typeof loadGaragesFromAPI === 'function') {
            await loadGaragesFromAPI();
            if (typeof renderGarages === 'function') {
                renderGarages();
            }
        }
    } catch (error) {
        console.error('Error refreshing garages:', error);
    }
    
    updateMapMarkers();
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    if (window.languageManager) {
        window.languageManager.showNotification(
            isArabic ? 'تم تحديث بيانات المواقف' : 'Parking data refreshed',
            'success'
        );
    }
}

async function findClosestFacility() {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Check if garages are loaded
    if (typeof garages === 'undefined' || garages.length === 0) {
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabic ? 'لا توجد مواقف متاحة حالياً' : 'No parking facilities available',
                'error'
            );
        }
        return;
    }

    // Show loading message
    if (window.languageManager) {
        window.languageManager.showNotification(
            isArabic ? 'جاري تحديد موقعك...' : 'Getting your location...',
            'info'
        );
    }

    // Get user location with high accuracy
    if (!userLocation) {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve, 
                        reject, 
                        { 
                            enableHighAccuracy: true, // Use GPS for better accuracy
                            timeout: 15000,
                            maximumAge: 0 // Always get fresh location
                        }
                    );
                });
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                addUserMarker();
                
                // Show location found message
                if (window.languageManager) {
                    const accuracyText = userLocation.accuracy < 100 
                        ? isArabic ? `دقة: ${Math.round(userLocation.accuracy)} متر` 
                        : `Accuracy: ${Math.round(userLocation.accuracy)} meters`
                        : '';
                    window.languageManager.showNotification(
                        isArabic ? `تم تحديد موقعك ${accuracyText}` : `Location found ${accuracyText}`,
                        'success'
                    );
                }
            } catch (error) {
                if (window.languageManager) {
                    let errorMsg = isArabic 
                        ? 'لا يمكن الوصول إلى موقعك. يرجى تفعيل خدمات الموقع في إعدادات المتصفح.' 
                        : 'Cannot access your location. Please enable location services in browser settings.';
                    
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMsg = isArabic 
                            ? 'تم رفض الوصول إلى الموقع. يرجى السماح بالوصول في إعدادات المتصفح.' 
                            : 'Location access denied. Please allow location access in browser settings.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMsg = isArabic 
                            ? 'موقعك غير متاح حالياً. يرجى المحاولة مرة أخرى.' 
                            : 'Your location is currently unavailable. Please try again.';
                    }
                    
                    window.languageManager.showNotification(errorMsg, 'error');
                }
                return;
            }
        } else {
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'المتصفح لا يدعم خدمات الموقع' : 'Browser does not support location services',
                    'error'
                );
            }
            return;
        }
    } else {
        // Update location if already exists (get fresh location)
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve, 
                        reject, 
                        { 
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 30000 // Accept location up to 30 seconds old
                        }
                    );
                });
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                // Update user marker
                markers.forEach(m => {
                    if (m.options && m.options.isUserMarker) {
                        map.removeLayer(m);
                    }
                });
                markers = markers.filter(m => !m.options || !m.options.isUserMarker);
                addUserMarker();
            } catch (error) {
                console.log('Could not update location, using cached location');
            }
        }
    }

    // Show location status
    const locationStatus = document.getElementById('locationStatus');
    if (locationStatus) {
        locationStatus.style.display = 'block';
        locationStatus.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>${isArabic ? 'موقعك: ' : 'Location: '}${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}</span>
        `;
    }

    // Calculate distances and find closest
    let closestGarage = null;
    let minDistance = Infinity;
    const garagesWithDistance = [];

    garages.forEach(garage => {
        if (garage.latitude && garage.longitude) {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                garage.latitude,
                garage.longitude
            );
            
            garagesWithDistance.push({ ...garage, calculatedDistance: distance });
            
            if (distance < minDistance) {
                minDistance = distance;
                closestGarage = { ...garage, calculatedDistance: distance };
            }
        }
    });

    // Sort garages by distance for display
    garagesWithDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance);

    if (closestGarage) {
        // Update garage distance
        closestGarage.distance = minDistance;

        // Center map on closest garage and show route
        if (map) {
            // Remove existing route if any
            if (currentRoute) {
                map.removeControl(currentRoute);
                currentRoute = null;
            }
            if (routePolyline) {
                map.removeLayer(routePolyline);
                routePolyline = null;
            }
            
            // Show route from user location to closest garage
            if (userLocation && closestGarage.latitude && closestGarage.longitude) {
                // Don't show route - map shows only parking circles
                map.setView([closestGarage.latitude, closestGarage.longitude], 16);
            }
            
            // Fit map to show both user location and garage with route
            if (userLocation) {
                const bounds = L.latLngBounds(
                    [userLocation.lat, userLocation.lng],
                    [closestGarage.latitude, closestGarage.longitude]
                );
                map.fitBounds(bounds, { padding: [80, 80] });
            } else {
                map.setView([closestGarage.latitude, closestGarage.longitude], 16);
            }
            
            // Highlight the closest garage marker
            markers.forEach((marker) => {
                if (marker.options && marker.options.garageId === closestGarage.id) {
                    // Remove existing highlight
                    markers.forEach(m => {
                        if (m.options && m.options.highlighted) {
                            const garage = garages.find(g => g.id === m.options.garageId);
                            m.setIcon(L.divIcon({
                                className: 'garage-marker',
                                html: `<div style="width: 20px; height: 20px; background: ${getMarkerColor(garage ? garage.availability : 'available')}; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
                                iconSize: [20, 20]
                            }));
                            m.options.highlighted = false;
                        }
                    });
                    
                    // Highlight closest garage
                    marker.setIcon(L.divIcon({
                        className: 'garage-marker closest',
                        html: `<div style="width: 30px; height: 30px; background: #2563eb; border: 4px solid #fbbf24; border-radius: 50%; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5); animation: pulse 2s infinite;"></div>`,
                        iconSize: [30, 30]
                    }));
                    marker.options.highlighted = true;
                    marker.openPopup();
                }
            });
        }

        // Scroll to closest garage in the list
        const garageCard = document.querySelector(`[data-garage-id="${closestGarage.id}"]`);
        if (garageCard) {
            garageCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            garageCard.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.3)';
            garageCard.style.border = '2px solid #2563eb';
            setTimeout(() => {
                garageCard.style.boxShadow = '';
                garageCard.style.border = '';
            }, 3000);
        }

        // Show notification with location info
        if (window.languageManager) {
            const distanceText = minDistance < 1 
                ? `${(minDistance * 1000).toFixed(0)} ${isArabic ? 'متر' : 'meters'}` 
                : `${minDistance.toFixed(2)} ${isArabic ? 'كم' : 'km'}`;
            
            const locationInfo = userLocation.accuracy 
                ? ` (${isArabic ? 'دقة' : 'Accuracy'}: ${Math.round(userLocation.accuracy)}${isArabic ? 'م' : 'm'})`
                : '';
            
            window.languageManager.showNotification(
                isArabic 
                    ? `أقرب موقف: ${closestGarage.name} - ${distanceText}${locationInfo}`
                    : `Closest facility: ${closestGarage.nameEn || closestGarage.name} - ${distanceText}${locationInfo}`,
                'success'
            );
        }
        
        // Update location status with distance info
        if (locationStatus) {
            const distanceText = minDistance < 1 
                ? `${(minDistance * 1000).toFixed(0)} ${isArabic ? 'م' : 'm'}` 
                : `${minDistance.toFixed(2)} ${isArabic ? 'كم' : 'km'}`;
            locationStatus.innerHTML = `
                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                <span>${isArabic ? 'أقرب موقف: ' : 'Closest: '}${distanceText}</span>
            `;
        }

        // Open booking modal for closest garage
        setTimeout(() => {
            if (typeof openBookingModal === 'function') {
                openBookingModal(closestGarage.id);
            }
        }, 1500);
    } else {
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabic ? 'لم يتم العثور على أقرب موقف' : 'Closest facility not found',
                'error'
            );
        }
    }
}

// Check traffic conditions (simulated - in production, use real traffic API)
async function checkTrafficConditions(fromLat, fromLng, toLat, toLng) {
    // Simulate traffic detection based on time of day and route
    const now = new Date();
    const hour = now.getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    
    // Calculate route distance
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
    
    // Simulate traffic levels
    let trafficLevel = 'light'; // light, moderate, heavy, very-heavy
    let congestionFactor = 1.0; // Time multiplier
    
    if (isRushHour) {
        if (distance < 1) {
            trafficLevel = 'moderate';
            congestionFactor = 1.3;
        } else if (distance < 3) {
            trafficLevel = 'heavy';
            congestionFactor = 1.6;
        } else {
            trafficLevel = 'very-heavy';
            congestionFactor = 2.0;
        }
    } else {
        // Random traffic during non-rush hours
        const random = Math.random();
        if (random > 0.7) {
            trafficLevel = 'moderate';
            congestionFactor = 1.2;
        }
    }
    
    return {
        level: trafficLevel,
        congestionFactor: congestionFactor,
        estimatedTime: distance * 2 * congestionFactor, // Base 2 min/km
        distance: distance
    };
}

// Show route on map when parking is selected
async function showRoute(fromLat, fromLng, toLat, toLng, showAlternatives = true) {
    if (!map) return;
    
    // Stop any existing route monitoring
    stopRouteMonitoring();
    
    // Remove all existing route-related elements
    if (currentRoute) {
        map.removeControl(currentRoute);
        currentRoute = null;
    }
    alternativeRoutes.forEach(route => {
        if (route.control) map.removeControl(route.control);
        if (route.polyline) map.removeLayer(route.polyline);
    });
    alternativeRoutes = [];
    
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    // Check traffic conditions
    const traffic = await checkTrafficConditions(fromLat, fromLng, toLat, toLng);
    
    // Get route color based on traffic
    let routeColor = '#10b981'; // Green for light traffic
    if (traffic.level === 'moderate') {
        routeColor = '#f59e0b'; // Orange for moderate
    } else if (traffic.level === 'heavy' || traffic.level === 'very-heavy') {
        routeColor = '#ef4444'; // Red for heavy
    }
    
    // Try to use Leaflet Routing Machine if available
    if (typeof L.Routing !== 'undefined') {
        try {
            currentRoute = L.Routing.control({
                waypoints: [
                    L.latLng(fromLat, fromLng),
                    L.latLng(toLat, toLng)
                ],
                routeWhileDragging: false,
                createMarker: function() { return null; }, // Don't create markers
                lineOptions: {
                    styles: [
                        {color: routeColor, opacity: 0.8, weight: 5}
                    ]
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map);
            
            currentRoute.on('routesfound', function(e) {
                const routes = e.routes;
                if (routes && routes.length > 0) {
                    const route = routes[0];
                    displayTrafficInfo(route, traffic);
                    
                    // If traffic is heavy and alternatives are available, show them
                    if (showAlternatives && routes.length > 1 && (traffic.level === 'heavy' || traffic.level === 'very-heavy')) {
                        displayAlternativeRoutes(routes.slice(1), traffic);
                    }
                }
            });
            
            return;
        } catch (error) {
            console.log('Leaflet Routing Machine error, using simple route:', error);
        }
    }
    
    // Fallback: Use simple polyline
    showSimpleRoute(fromLat, fromLng, toLat, toLng, traffic);
}

// Show route to selected garage
async function showRouteToSelectedGarage(garageLat, garageLng, garage) {
    console.log('showRouteToSelectedGarage called', { garageLat, garageLng, garage, userLocation });
    
    if (!userLocation) {
        console.log('User location not available');
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabic ? 'يرجى السماح بالوصول إلى موقعك لعرض المسار' : 'Please allow location access to show route',
                'warning'
            );
        }
        return;
    }
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Check traffic conditions first
    let traffic;
    try {
        traffic = await checkTrafficConditions(userLocation.lat, userLocation.lng, garageLat, garageLng);
        console.log('Traffic conditions:', traffic);
    } catch (error) {
        console.error('Error checking traffic:', error);
        traffic = { level: 'normal', estimatedTime: 0 };
    }
    
    // Show route selection modal with 4 roads
    console.log('Showing route selection modal with params:', {
        fromLat: userLocation.lat,
        fromLng: userLocation.lng,
        toLat: garageLat,
        toLng: garageLng,
        garage: garage,
        traffic: traffic
    });
    showRouteSelectionModal(userLocation.lat, userLocation.lng, garageLat, garageLng, garage, traffic);
}

// Show route selection modal with 4 real roads
function showRouteSelectionModal(fromLat, fromLng, toLat, toLng, garage, traffic) {
    console.log('showRouteSelectionModal called', { fromLat, fromLng, toLat, toLng, garage, traffic });
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Ensure traffic has a default value
    if (!traffic) {
        traffic = { level: 'normal', estimatedTime: 0 };
    }
    
    // Store garage data globally for use in selectRoute
    window.currentRouteGarage = garage;
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay active" id="routeSelectionModal" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            visibility: visible;
        ">
            <div class="modal" style="
                max-width: 500px;
                width: 90%;
                background: white;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                z-index: 10001;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <div class="modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #e5e7eb;
                ">
                    <h3 class="modal-title" style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 700;
                        color: #111827;
                    ">${isArabic ? 'اختر طريقك' : 'Choose Your Route'}</h3>
                    <button class="modal-close" onclick="closeRouteSelectionModal()" style="
                        background: none;
                        border: none;
                        font-size: 28px;
                        color: #6b7280;
                        cursor: pointer;
                        padding: 0;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 4px;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#f3f4f6'; this.style.color='#111827';" onmouseout="this.style.background='none'; this.style.color='#6b7280';">&times;</button>
                </div>
                <div style="padding: var(--spacing-lg);">
                    ${traffic.level === 'heavy' || traffic.level === 'very-heavy' ? `
                    <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: var(--border-radius); padding: var(--spacing-md); margin-bottom: var(--spacing-lg);">
                        <p style="margin: 0; color: #92400e; font-size: var(--font-size-sm);">
                            ${isArabic ? '⚠️ الطريق المباشر مزدحم. اختر مساراً بديلاً:' : '⚠️ Direct route is crowded. Choose an alternative route:'}
                        </p>
                    </div>
                    ` : `
                    <p style="margin-bottom: var(--spacing-lg); color: var(--gray-600);">
                        ${isArabic ? 'اختر الطريق الذي تريد السير فيه:' : 'Choose the route you want to take:'}
                    </p>
                    `}
                    
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        <button class="route-option-btn" data-route="direct" style="
                            padding: var(--spacing-md);
                            border: 2px solid var(--gray-300);
                            border-radius: var(--border-radius);
                            background: white;
                            cursor: pointer;
                            text-align: ${isArabic ? 'right' : 'left'};
                            transition: all 0.3s;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0 0 4px 0; color: var(--gray-900);">${isArabic ? 'المسار المباشر' : 'Direct Route'}</h4>
                                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--gray-600);">${isArabic ? 'أقصر مسافة' : 'Shortest distance'}</p>
                                </div>
                                <i class="fas fa-route" style="font-size: 24px; color: #3b82f6;"></i>
                            </div>
                        </button>
                        
                        <button class="route-option-btn" data-route="corniche" style="
                            padding: var(--spacing-md);
                            border: 2px solid var(--gray-300);
                            border-radius: var(--border-radius);
                            background: white;
                            cursor: pointer;
                            text-align: ${isArabic ? 'right' : 'left'};
                            transition: all 0.3s;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0 0 4px 0; color: var(--gray-900);">${isArabic ? 'الكورنيش' : 'Corniche'}</h4>
                                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--gray-600);">${isArabic ? 'طريق ساحلي' : 'Coastal road'}</p>
                                </div>
                                <i class="fas fa-water" style="font-size: 24px; color: #3b82f6;"></i>
                            </div>
                        </button>
                        
                        <button class="route-option-btn" data-route="tram" style="
                            padding: var(--spacing-md);
                            border: 2px solid var(--gray-300);
                            border-radius: var(--border-radius);
                            background: white;
                            cursor: pointer;
                            text-align: ${isArabic ? 'right' : 'left'};
                            transition: all 0.3s;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0 0 4px 0; color: var(--gray-900);">${isArabic ? 'طريق الترام' : 'Tram Route'}</h4>
                                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--gray-600);">${isArabic ? 'عبر وسط المدينة' : 'Through city center'}</p>
                                </div>
                                <i class="fas fa-train" style="font-size: 24px; color: #3b82f6;"></i>
                            </div>
                        </button>
                        
                        <button class="route-option-btn" data-route="abu_qir" style="
                            padding: var(--spacing-md);
                            border: 2px solid var(--gray-300);
                            border-radius: var(--border-radius);
                            background: white;
                            cursor: pointer;
                            text-align: ${isArabic ? 'right' : 'left'};
                            transition: all 0.3s;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0 0 4px 0; color: var(--gray-900);">${isArabic ? 'شارع أبو قير' : 'Abu Qir Street'}</h4>
                                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--gray-600);">${isArabic ? 'طريق شرقي' : 'East route'}</p>
                                </div>
                                <i class="fas fa-map-marked-alt" style="font-size: 24px; color: #ec4899;"></i>
                            </div>
                        </button>
                        
                        <button class="route-option-btn" data-route="mahmoudiya" style="
                            padding: var(--spacing-md);
                            border: 2px solid var(--gray-300);
                            border-radius: var(--border-radius);
                            background: white;
                            cursor: pointer;
                            text-align: ${isArabic ? 'right' : 'left'};
                            transition: all 0.3s;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0 0 4px 0; color: var(--gray-900);">${isArabic ? 'طريق المحمودية' : 'Mahmoudiya Road'}</h4>
                                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--gray-600);">${isArabic ? 'طريق جنوبي' : 'South route'}</p>
                                </div>
                                <i class="fas fa-road" style="font-size: 24px; color: #10b981;"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('routeSelectionModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    try {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('Modal HTML inserted into body');
        
        // Verify it was added
        const checkModal = document.getElementById('routeSelectionModal');
        if (!checkModal) {
            console.error('Modal was not found immediately after insertion!');
            // Try alternative method
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modalHTML;
            const modalElement = tempDiv.firstElementChild;
            document.body.appendChild(modalElement);
            console.log('Modal added using alternative method');
        }
    } catch (error) {
        console.error('Error inserting modal HTML:', error);
        return;
    }
    
    // Force modal to be visible immediately - use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        const modal = document.getElementById('routeSelectionModal');
        if (modal) {
            // Remove any conflicting classes or styles
            modal.className = 'modal-overlay active';
            
            // Set all styles inline to override any CSS
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: rgba(0, 0, 0, 0.5) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 99999 !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
                margin: 0 !important;
                padding: 0 !important;
            `;
            
            // Also style the inner modal div
            const innerModal = modal.querySelector('.modal');
            if (innerModal) {
                innerModal.style.cssText = `
                    max-width: 500px !important;
                    width: 90% !important;
                    background: white !important;
                    border-radius: 12px !important;
                    padding: 24px !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
                    z-index: 100000 !important;
                    max-height: 90vh !important;
                    overflow-y: auto !important;
                    position: relative !important;
                    display: block !important;
                    margin: 0 !important;
                `;
            }
            
            console.log('Modal should be visible now', modal);
            console.log('Modal computed styles:', window.getComputedStyle(modal));
            console.log('Modal parent:', modal.parentElement);
            console.log('Modal offsetParent:', modal.offsetParent);
            
            // Force a reflow to ensure styles are applied
            void modal.offsetHeight;
        } else {
            console.error('Modal element not found after insertion!');
            console.error('Body children:', document.body.children.length);
            console.error('Body HTML length:', document.body.innerHTML.length);
        }
    });
    
    // Set up event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
        const modalAfterDelay = document.getElementById('routeSelectionModal');
        if (!modalAfterDelay) {
            console.error('Modal not found after delay');
            return;
        }
        
        // Add click event listeners to buttons
        const routeButtons = document.querySelectorAll('.route-option-btn');
        console.log('Found route buttons:', routeButtons.length);
        
        routeButtons.forEach((btn, index) => {
            console.log(`Setting up button ${index}:`, btn.getAttribute('data-route'));
            
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const routeType = this.getAttribute('data-route');
                console.log('Route selected:', routeType);
                selectRoute(routeType, fromLat, fromLng, toLat, toLng, garage);
            });
            
            // Add hover effects
            btn.addEventListener('mouseenter', function() {
                this.style.borderColor = '#2563eb';
                this.style.background = '#f0f9ff';
                this.style.transform = 'translateX(-2px)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.borderColor = '#d1d5db';
                this.style.background = 'white';
                this.style.transform = 'translateX(0)';
            });
        });
        
        // Also add click to close on overlay
        const overlay = document.getElementById('routeSelectionModal');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeRouteSelectionModal();
                }
            });
        }
    }, 100);
}

// Close route selection modal
function closeRouteSelectionModal() {
    const modal = document.getElementById('routeSelectionModal');
    if (modal) {
        modal.remove();
    }
}

// Select route based on user choice
async function selectRoute(routeType, fromLat, fromLng, toLat, toLng, garage) {
    closeRouteSelectionModal();
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    let waypointLat, waypointLng, routeName, routeColor;
    
    // Calculate midpoint
    const midLat = (fromLat + toLat) / 2;
    const midLng = (fromLng + toLng) / 2;
    
    // Set waypoint based on route type
    switch(routeType) {
        case 'direct':
            // Direct route - no waypoint
            showRoute(fromLat, fromLng, toLat, toLng, false);
            if (window.languageManager) {
                const garageName = isArabic ? (garage.name || garage.name_en) : (garage.name_en || garage.name);
                window.languageManager.showNotification(
                    isArabic ? `عرض المسار المباشر إلى ${garageName}` : `Showing direct route to ${garageName}`,
                    'info'
                );
            }
            return;
            
        case 'corniche':
            waypointLat = 31.2100; // Corniche (north, coastal)
            waypointLng = midLng;
            routeName = isArabic ? 'الكورنيش' : 'Corniche';
            routeColor = '#3b82f6'; // Blue
            break;
            
        case 'tram':
            waypointLat = midLat;
            waypointLng = 29.9120; // Tram route (east-west)
            routeName = isArabic ? 'طريق الترام' : 'Tram Route';
            routeColor = '#8b5cf6'; // Purple
            break;
            
        case 'abuQir':
        case 'abu_qir':
            waypointLat = midLat;
            waypointLng = 29.9150; // Abu Qir Street (east)
            routeName = isArabic ? 'شارع أبو قير' : 'Abu Qir Street';
            routeColor = '#ec4899'; // Pink
            break;
            
        case 'mahmoudiya':
            waypointLat = 31.1950; // Mahmoudiya Road (south)
            waypointLng = midLng;
            routeName = isArabic ? 'طريق المحمودية' : 'Mahmoudiya Road';
            routeColor = '#10b981'; // Green
            break;
    }
    
    // Show route with waypoint
    if (typeof L.Routing !== 'undefined') {
        try {
            // Remove existing route
            if (currentRoute) {
                map.removeControl(currentRoute);
                currentRoute = null;
            }
            if (routePolyline) {
                map.removeLayer(routePolyline);
                routePolyline = null;
            }
            
            // Use waypoint for selected route
            currentRoute = L.Routing.control({
                waypoints: [
                    L.latLng(fromLat, fromLng),
                    L.latLng(waypointLat, waypointLng), // Waypoint
                    L.latLng(toLat, toLng) // Destination
                ],
                routeWhileDragging: false,
                createMarker: function() { return null; },
                lineOptions: {
                    styles: [
                        {color: routeColor, opacity: 0.8, weight: 5}
                    ]
                },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map);
            
            currentRoute.on('routesfound', function(e) {
                const routes = e.routes;
                if (routes && routes.length > 0) {
                    const route = routes[0];
                    const traffic = {
                        level: 'light',
                        distance: route.summary.totalDistance / 1000,
                        estimatedTime: route.summary.totalTime / 60
                    };
                    displayTrafficInfo(route, traffic);
                }
            });
        } catch (error) {
            // Fallback to simple route
            showSimpleRouteWithWaypoint(fromLat, fromLng, waypointLat, waypointLng, toLat, toLng, null);
        }
    } else {
        // Fallback to simple route with waypoint
        showSimpleRouteWithWaypoint(fromLat, fromLng, waypointLat, waypointLng, toLat, toLng, null);
    }
    
    // Show notification
    if (window.languageManager) {
        const garageName = isArabic ? (garage.name || garage.name_en) : (garage.name_en || garage.name);
        window.languageManager.showNotification(
            isArabic ? `عرض المسار عبر ${routeName} إلى ${garageName}` : `Showing route via ${routeName} to ${garageName}`,
            'success'
        );
    }
}

// Function to show route to garage (called from garage card button)
function showRouteToGarage(garageId) {
    console.log('🔵 showRouteToGarage called with garageId:', garageId);
    const garage = garages.find(g => g.id === garageId);
    console.log('🔵 Found garage:', garage);
    
    // Store last selected garage for route selection
    if (garage) {
        window.lastSelectedGarage = garage;
    }
    
    if (!garage) {
        console.error('❌ Garage not found:', garageId);
        return;
    }
    
    if (!garage.latitude || !garage.longitude) {
        console.error('❌ Garage missing coordinates:', garage);
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabic ? 'الجراج لا يحتوي على إحداثيات صحيحة' : 'Garage does not have valid coordinates',
                'error'
            );
        }
        return;
    }
    
    console.log('🔵 Calling showRouteToSelectedGarage with:', {
        lat: garage.latitude,
        lng: garage.longitude,
        garage: garage
    });
    showRouteToSelectedGarage(garage.latitude, garage.longitude, garage);
}

// Make functions global
window.closeRouteSelectionModal = closeRouteSelectionModal;
window.selectRoute = selectRoute;
window.showRouteToGarage = showRouteToGarage;
window.showRouteSelectionModal = showRouteSelectionModal;
window.showRouteToSelectedGarage = showRouteToSelectedGarage;

// Test function to show modal directly (for debugging)
window.testRouteModal = function() {
    console.log('Testing route modal...');
    const testGarage = {
        id: 1,
        name: 'Test Garage',
        name_en: 'Test Garage',
        latitude: 31.2000,
        longitude: 29.9000
    };
    const testTraffic = { level: 'normal', estimatedTime: 10 };
    showRouteSelectionModal(31.2000, 29.9000, 31.2100, 29.9100, testGarage, testTraffic);
};

// Start monitoring route for traffic changes and auto-redirect
function startRouteMonitoring(destinationLat, destinationLng) {
    // Route monitoring completely disabled
    // Map shows only parking circles, no route tracking
    return;
}

// Find and automatically switch to alternative route
async function findAndSwitchToAlternativeRoute(currentLat, currentLng, destinationLat, destinationLng, currentTraffic) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Calculate direction to destination
    const directDistance = calculateDistance(currentLat, currentLng, destinationLat, destinationLng);
    
    // Generate alternative waypoints (simulating different road paths)
    // In a real implementation, you would use a routing service API
    const alternatives = [];
    
    // Calculate midpoint for waypoint
    const midLat = (currentLat + destinationLat) / 2;
    const midLng = (currentLng + destinationLng) / 2;
    
    // Real roads in Alexandria near Al-Attarin district
    // Alternative 1: الكورنيش (Corniche) - Coastal road along the Mediterranean
    // Corniche runs along the coast, north of Al-Attarin (~31.2100)
    const cornicheWaypointLat = 31.2100; // North, near the coast
    const cornicheWaypointLng = midLng; // Same longitude, go north then east/west
    alternatives.push({ 
        lat: cornicheWaypointLat, 
        lng: cornicheWaypointLng, 
        name: isArabic ? 'الكورنيش' : 'Corniche',
        finalLat: destinationLat,
        finalLng: destinationLng,
        roadType: 'corniche'
    });
    
    // Alternative 2: طريق الترام (Tram Route) - Tram line route
    // Tram line runs through central Alexandria, parallel to main streets (~29.9120)
    const tramWaypointLat = midLat; // Central
    const tramWaypointLng = 29.9120; // Along tram line (east-west)
    alternatives.push({ 
        lat: tramWaypointLat, 
        lng: tramWaypointLng, 
        name: isArabic ? 'طريق الترام' : 'Tram Route',
        finalLat: destinationLat,
        finalLng: destinationLng,
        roadType: 'tram'
    });
    
    // Alternative 3: شارع أبو قير (Abu Qir Street)
    // Abu Qir Street runs east-west, connecting to Abu Qir area (~29.9150)
    const abuQirWaypointLat = midLat;
    const abuQirWaypointLng = 29.9150; // East, along Abu Qir Street
    alternatives.push({ 
        lat: abuQirWaypointLat, 
        lng: abuQirWaypointLng, 
        name: isArabic ? 'شارع أبو قير' : 'Abu Qir Street',
        finalLat: destinationLat,
        finalLng: destinationLng,
        roadType: 'abu_qir'
    });
    
    // Alternative 4: طريق المحمودية (Mahmoudiya Road)
    // Mahmoudiya Road runs south, connecting to Mahmoudiya area (~31.1950)
    const mahmoudiyaWaypointLat = 31.1950; // South
    const mahmoudiyaWaypointLng = midLng; // Along Mahmoudiya Road (north-south)
    alternatives.push({ 
        lat: mahmoudiyaWaypointLat, 
        lng: mahmoudiyaWaypointLng, 
        name: isArabic ? 'طريق المحمودية' : 'Mahmoudiya Road',
        finalLat: destinationLat,
        finalLng: destinationLng,
        roadType: 'mahmoudiya'
    });
    
    let bestAlternative = null;
    let bestTraffic = currentTraffic;
    let bestDistance = directDistance;
    
    // Check each alternative route
    for (const alt of alternatives) {
        // Check traffic for first segment (current to waypoint)
        const traffic1 = await checkTrafficConditions(currentLat, currentLng, alt.lat, alt.lng);
        // Check traffic for second segment (waypoint to destination)
        const traffic2 = await checkTrafficConditions(alt.lat, alt.lng, alt.finalLat, alt.finalLng);
        
        // Calculate total distance
        const dist1 = calculateDistance(currentLat, currentLng, alt.lat, alt.lng);
        const dist2 = calculateDistance(alt.lat, alt.lng, alt.finalLat, alt.finalLng);
        const totalDist = dist1 + dist2;
        
        // Prefer routes with lighter traffic (even if slightly longer)
        const avgTrafficLevel = (traffic1.level === 'very-heavy' ? 4 : 
                                 traffic1.level === 'heavy' ? 3 :
                                 traffic1.level === 'moderate' ? 2 : 1) +
                               (traffic2.level === 'very-heavy' ? 4 : 
                                traffic2.level === 'heavy' ? 3 :
                                traffic2.level === 'moderate' ? 2 : 1);
        
        // If this alternative has better traffic, use it
        const currentTrafficLevel = currentTraffic.level === 'very-heavy' ? 4 :
                                   currentTraffic.level === 'heavy' ? 3 :
                                   currentTraffic.level === 'moderate' ? 2 : 1;
        
        if (avgTrafficLevel < currentTrafficLevel * 2 || (avgTrafficLevel === currentTrafficLevel * 2 && totalDist < bestDistance * 1.2)) {
            bestAlternative = alt;
            bestTraffic = traffic1.level === 'heavy' || traffic1.level === 'very-heavy' ? traffic1 : traffic2;
            bestDistance = totalDist;
        }
    }
    
    // If we found a better alternative, return it
    if (bestAlternative) {
        return bestAlternative;
    }
    
    return null;
}

// Update route line color - DISABLED: No route lines on map
function updateRouteLineColor(traffic) {
    // No route lines to update - map shows only parking circles
    return;
}

// Stop route monitoring
function stopRouteMonitoring() {
    if (locationWatcher !== null) {
        navigator.geolocation.clearWatch(locationWatcher);
        locationWatcher = null;
    }
    
    if (routeMonitor !== null) {
        clearInterval(routeMonitor);
        routeMonitor = null;
    }
    
    activeRoute = null;
    lastTrafficCheck = null;
}

// Display traffic information
function displayTrafficInfo(route, traffic) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    if (!route || !route.summary) return;
    
    const distance = (route.summary.totalDistance / 1000).toFixed(2); // Convert to km
    const time = Math.round(route.summary.totalTime / 60); // Convert to minutes
    const trafficTime = Math.round(time * traffic.congestionFactor);
    
    const trafficIcon = traffic.level === 'very-heavy' ? '🔴' : // Red for crowded
                       traffic.level === 'heavy' ? '🔴' : // Red for crowded
                       traffic.level === 'moderate' ? '🟠' : // Orange for medium
                       '🟢'; // Green for empty/light
    
    const trafficText = traffic.level === 'very-heavy' ? (isArabic ? 'ازدحام شديد' : 'Very Heavy/Crowded') :
                       traffic.level === 'heavy' ? (isArabic ? 'ازدحام' : 'Heavy/Crowded') :
                       traffic.level === 'moderate' ? (isArabic ? 'متوسط' : 'Moderate') :
                       (isArabic ? 'خفيف' : 'Light/Empty');
    
    if (window.languageManager) {
        window.languageManager.showNotification(
                isArabic 
                    ? `${trafficIcon} حالة المرور: ${trafficText} | المسافة: ${distance} كم | الوقت المتوقع: ${trafficTime} دقيقة`
                    : `${trafficIcon} Traffic: ${trafficText} | Distance: ${distance} km | ETA: ${trafficTime} min`,
                traffic.level === 'very-heavy' || traffic.level === 'heavy' ? 'error' : // Red for crowded
                traffic.level === 'moderate' ? 'warning' : // Orange for medium
                'success' // Green for empty/light
            );
    }
}

// Display alternative routes on map
function displayAlternativeRoutes(routes, traffic) {
    if (!routes || routes.length === 0) return;
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Remove existing alternative routes
    alternativeRoutes.forEach(route => {
        if (route.polyline) map.removeLayer(route.polyline);
    });
    alternativeRoutes = [];
    
    // Display alternative routes as colored lines
    routes.forEach((route, index) => {
        if (index >= 3) return; // Limit to 3 alternatives
        
        if (!route.coordinates || route.coordinates.length === 0) return;
        
        // Alternative routes use different colors (lighter shades)
        const altColors = ['#3b82f6', '#8b5cf6', '#ec4899']; // Blue, Purple, Pink
        const altColor = altColors[index % altColors.length];
        
        // Create polyline for alternative route
        const altPolyline = L.polyline(route.coordinates, {
            color: altColor,
            weight: 4,
            opacity: 0.6,
            dashArray: '15, 10'
        }).addTo(map);
        
        // Store alternative route
        alternativeRoutes.push({
            polyline: altPolyline,
            distance: route.summary ? (route.summary.totalDistance / 1000).toFixed(2) : 'N/A',
            time: route.summary ? Math.round(route.summary.totalTime / 60) : 'N/A',
            index: index
        });
        
        // Add click handler to switch to this alternative
        altPolyline.on('click', function() {
            // Remove current route
            if (currentRoute) {
                map.removeControl(currentRoute);
                currentRoute = null;
            }
            if (routePolyline) {
                map.removeLayer(routePolyline);
                routePolyline = null;
            }
            
            // Make this alternative the main route
            routePolyline = altPolyline;
            routePolyline.setStyle({
                color: routeColor,
                weight: 5,
                opacity: 0.8,
                dashArray: null
            });
            
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic 
                        ? `تم التبديل إلى المسار البديل ${index + 1}` 
                        : `Switched to alternative route ${index + 1}`,
                    'success'
                );
            }
        });
    });
    
    if (window.languageManager && routes.length > 0) {
        window.languageManager.showNotification(
            isArabic 
                ? `تم العثور على ${routes.length} مسار بديل - انقر على أي مسار للتبديل إليه` 
                : `Found ${routes.length} alternative route${routes.length > 1 ? 's' : ''} - Click any route to switch`,
            'info'
        );
    }
}

// Simple route using polyline (fallback)
let routePolyline = null;
function showSimpleRoute(fromLat, fromLng, toLat, toLng, traffic = null) {
    if (!map) return;
    
    // Remove existing polyline if any
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    // Get route color based on traffic
    let routeColor = '#10b981'; // Green for light traffic
    if (traffic && traffic.level === 'moderate') {
        routeColor = '#f59e0b'; // Orange for moderate
    } else if (traffic && (traffic.level === 'heavy' || traffic.level === 'very-heavy')) {
        routeColor = '#ef4444'; // Red for heavy
    }
    
    // Create polyline for route
    routePolyline = L.polyline(
        [[fromLat, fromLng], [toLat, toLng]],
        {
            color: routeColor,
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 5'
        }
    ).addTo(map);
    
    // Show traffic information
    if (traffic) {
        displayTrafficInfo({
            summary: {
                totalDistance: traffic.distance * 1000,
                totalTime: traffic.estimatedTime * 60
            }
        }, traffic);
    }
    
    // Center map between start and end points
    const routeCoordinates = [
        [fromLat, fromLng],
        [toLat, toLng]
    ];
    map.fitBounds(routeCoordinates, { padding: [50, 50] });
}

// Show simple route with waypoint (for alternative routes)
function showSimpleRouteWithWaypoint(fromLat, fromLng, waypointLat, waypointLng, toLat, toLng, traffic) {
    if (!map) return;
    
    // Remove existing polyline
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    // Get route color based on traffic
    let routeColor = '#3b82f6'; // Blue for alternative route
    
    // Create polyline with waypoint
    const routeCoordinates = [
        [fromLat, fromLng],
        [waypointLat, waypointLng],
        [toLat, toLng]
    ];
    
    routePolyline = L.polyline(routeCoordinates, {
        color: routeColor,
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 5'
    }).addTo(map);
    
    // Show traffic information
    if (traffic) {
        displayTrafficInfo({
            summary: {
                totalDistance: traffic.distance * 1000,
                totalTime: traffic.estimatedTime * 60
            }
        }, traffic);
    }
    
    // Center map on route
    map.fitBounds(routeCoordinates, { padding: [50, 50] });
}

// Show route to specific garage (called from garage list) - DUPLICATE REMOVED
// This function is now handled by the first showRouteToGarage function above (line 2354)

// Export function globally
window.showRouteToGarage = showRouteToGarage;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopRouteMonitoring();
});

async function handleBookingSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 ========== BOOKING SUBMIT STARTED ==========');
    console.log('🚀 Event:', e);
    console.log('🚀 Form:', e.target);
    console.log('🚀 Timestamp:', new Date().toISOString());
    
    // Show loading state on submit button
    const submitButton = e.target.querySelector('button[type="submit"]') || 
                        document.getElementById('confirmBookingBtn') ||
                        document.querySelector('#bookingForm button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    const originalButtonDisabled = submitButton ? submitButton.disabled : false;
    
    if (submitButton) {
        submitButton.disabled = true;
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        submitButton.textContent = isArabic ? 'جاري المعالجة...' : 'Processing...';
    }
    
    try {
        if (typeof garages === 'undefined') {
            console.error('Garages data not available');
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'بيانات الجراجات غير متاحة' : 'Garages data not available',
                    'error'
                );
            }
            restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
            return;
        }
    
    const garageNameInput = document.getElementById('bookingGarageName');
    const garageId = garageNameInput ? parseInt(garageNameInput.dataset.garageId) : null;
    
        if (!garageId) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'الموقف غير موجود' : 'Garage not found',
                    'error'
                );
            }
            restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
            return;
        }

        const garage = garages.find(g => g.id === garageId);
        
        // Get booking details
        const duration = parseInt(document.getElementById('bookingDuration').value) || 1;
        const priceType = document.getElementById('bookingPriceType') ? document.getElementById('bookingPriceType').value : 'hourly';
        const selectedRoute = document.getElementById('bookingRoute') ? document.getElementById('bookingRoute').value : 'direct';
        const spaceNumber = document.getElementById('bookingSpace') ? document.getElementById('bookingSpace').value : '';
        const startTime = document.getElementById('bookingStartTime') ? document.getElementById('bookingStartTime').value : '';
    
    // Check if payment is required (for guests OR drivers on first booking)
    const isAuthenticated = window.isAuthenticated ? window.isAuthenticated() : false;
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    const isDriver = user && user.role === 'driver';
    const isGuest = !isAuthenticated;
    const paymentSection = document.getElementById('paymentSection');
    const paymentRequired = paymentSection && paymentSection.style.display !== 'none';
    
    let paymentData = null;
    
    // Validate payment if required (guests OR drivers on first booking)
    if (paymentRequired && (isGuest || isDriver)) {
        const paymentMethod = document.getElementById('paymentMethod').value;
            if (!paymentMethod) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'يرجى اختيار طريقة الدفع' : 'Please select a payment method',
                        'error'
                    );
                }
                restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
                return;
            }

        // Validate payment details based on method
        paymentData = { method: paymentMethod };
        
        if (paymentMethod === 'visa' || paymentMethod === 'miza' || paymentMethod === 'credit' || paymentMethod === 'instapay') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        const cardholderName = document.getElementById('cardholderName').value.trim();
        
            if (!cardNumber || cardNumber.length < 16) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'رقم البطاقة غير صحيح' : 'Invalid card number',
                        'error'
                    );
                }
                restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
                return;
            }
            
            if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'تاريخ الانتهاء غير صحيح' : 'Invalid expiry date',
                        'error'
                    );
                }
                restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
                return;
            }
            
            if (!cardCVV || cardCVV.length < 3) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'CVV غير صحيح' : 'Invalid CVV',
                        'error'
                    );
                }
                restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
                return;
            }
            
            if (!cardholderName) {
                const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabic ? 'اسم حامل البطاقة مطلوب' : 'Cardholder name required',
                        'error'
                    );
                }
                restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
                return;
            }
        
        paymentData = {
            method: paymentMethod,
            cardNumber: cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask card number
            cardExpiry: cardExpiry,
            cardholderName: cardholderName
        };
    } else if (paymentMethod === 'wallet') {
        const walletNumber = document.getElementById('walletNumber').value.trim();
        
        if (!walletNumber) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'رقم المحفظة مطلوب' : 'Wallet number required',
                    'error'
                );
            }
            restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
            return;
        }
        
        paymentData = {
            method: paymentMethod,
            walletNumber: walletNumber
        };
    }
    }
    
        if (!garage) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'الموقف غير موجود' : 'Garage not found',
                    'error'
                );
            }
            restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
            return;
        }

        // Check availability
        if (garage.availability === 'full') {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'الموقف ممتلئ حالياً' : 'Garage is currently full',
                    'error'
                );
            }
            restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
            return;
        }

        // Check if there are available spaces (client-side check before API call)
        const availableSpaces = garage.totalSpaces - (garage.occupiedSpaces || 0);
        if (availableSpaces <= 0) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            if (window.languageManager) {
                window.languageManager.showNotification(
                    isArabic ? 'لا توجد مساحات متاحة' : 'No available spaces',
                    'error'
                );
            }
            restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText);
            return;
        }

    // Process payment and create booking (only if payment required)
    const isArabicLang = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    // Show payment processing message only if payment is required
    if (paymentRequired && paymentData && (isGuest || isDriver)) {
        if (window.languageManager) {
            window.languageManager.showNotification(
                isArabicLang ? 'جاري معالجة الدفع...' : 'Processing payment...',
                'info'
            );
        }

        // Payment processing (no simulation - handled by backend)
    }

    // Try to create booking via API (if available)
    try {
        console.log('🔵 Attempting to create booking...');
        console.log('🔵 API Service available:', !!window.apiService);
        console.log('🔵 createBooking method available:', !!(window.apiService && window.apiService.createBooking));
        
        if (window.apiService && window.apiService.createBooking) {
            const user = window.getCurrentUser ? window.getCurrentUser() : null;
            const spaceNumber = document.getElementById('bookingSpace') ? document.getElementById('bookingSpace').value : null;
            
            console.log('🔵 User:', user);
            console.log('🔵 Space Number:', spaceNumber);
            console.log('🔵 Garage ID:', garageId);
            
            // For guests, use a default user_id or create a guest booking
            let userId = 1; // Default guest user
            if (user && user.id) {
                userId = user.id;
            } else if (user && user.userId) {
                userId = user.userId;
            } else if (user && user.user_id) {
                userId = user.user_id;
            }
            
            // Handle space selection - spaceNumber could be a space number (string) or space ID (number)
            // If it's a small number (1-100), treat it as space_number, otherwise as space_id
            const spaceValue = spaceNumber ? spaceNumber.trim() : null;
            let space_id = null;
            let space_number = null;
            
            if (spaceValue) {
                const spaceNum = parseInt(spaceValue);
                // If it's a reasonable space number (1-1000), treat as space_number
                // Otherwise, treat as space_id (actual database ID)
                if (spaceNum > 0 && spaceNum <= 1000) {
                    space_number = spaceValue; // Keep as string for space_number
                } else {
                    space_id = spaceNum; // Use as space_id
                }
            }
            
            // Get and format start time
            const startTimeInput = document.getElementById('bookingStartTime');
            let startTime = startTimeInput.value;
            
            // Convert datetime-local format to ISO string if needed
            if (startTime && !startTime.includes('T')) {
                // If it's in YYYY-MM-DD HH:MM format, convert to ISO
                startTime = new Date(startTime).toISOString();
            } else if (startTime && !startTime.endsWith('Z') && !startTime.includes('+')) {
                // If it's datetime-local format (YYYY-MM-DDTHH:MM), add timezone
                const date = new Date(startTime);
                startTime = date.toISOString();
            }
            
            const bookingData = {
                user_id: userId,
                garage_id: garageId,
                start_time: startTime,
                duration_hours: parseFloat(document.getElementById('bookingDuration').value),
                price_type: priceType || 'hourly',
                selected_route: selectedRoute || 'direct'
            };
            
            // Add space information if provided
            if (space_id) {
                bookingData.space_id = space_id;
            } else if (space_number) {
                bookingData.space_number = space_number;
            }
            
            // Add driver information if user is a driver
            if (user && user.role === 'driver') {
                // Get driver data from user object or localStorage
                bookingData.driver_info = {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    driving_license: user.drivingLicense || user.driving_license || '',
                    car_license: user.carLicense || user.car_license || '',
                    car_type: user.carType || user.car_type || '',
                    car_color: user.carColor || user.car_color || ''
                };
            }
            
            // Only include payment data if payment was required
            if (paymentData) {
                bookingData.payment = paymentData;
            }
            
            // Prepare booking data for API
            
            const response = await window.apiService.createBooking(bookingData);
            
            console.log('✅ API Response received:', JSON.stringify(response, null, 2));
            
            if (response && response.success) {
                console.log('✅ Booking created successfully!');
                console.log('✅ Booking ID:', response.data?.id);
                console.log('✅ Booking details:', response.data);
                
                // Update garage availability locally after successful booking
                if (garage) {
                    garage.occupiedSpaces = Math.min((garage.occupiedSpaces || 0) + 1, garage.totalSpaces);
                    const occupancyRate = (garage.occupiedSpaces / garage.totalSpaces) * 100;
                    if (occupancyRate >= 90) {
                        garage.availability = 'full';
                    } else if (occupancyRate >= 70) {
                        garage.availability = 'limited';
                    } else {
                        garage.availability = 'available';
                    }
                }
                
                // Refresh the display
                try {
                    if (typeof loadGaragesFromAPI === 'function') {
                        await loadGaragesFromAPI();
                    }
                } catch (error) {
                    console.error('Error reloading garages:', error);
                }
                
                if (typeof renderGarages === 'function') {
                    renderGarages();
                }
                if (typeof updateMapMarkers === 'function') {
                    updateMapMarkers();
                }
                
                // Show success message
                if (window.languageManager) {
                    window.languageManager.showNotification(
                        isArabicLang ? 'تم إنشاء الحجز بنجاح!' : 'Booking created successfully!',
                        'success'
                    );
                }
                
                // Close modal
                const bookingModal = document.getElementById('bookingModal');
                if (bookingModal) {
                    bookingModal.classList.remove('active');
                }
                
                // Reset form
                const bookingForm = document.getElementById('bookingForm');
                if (bookingForm) {
                    bookingForm.reset();
                }
                if (garageNameInput) {
                    delete garageNameInput.dataset.garageId;
                }
                
                // Restore button
                if (submitButton) {
                    submitButton.disabled = originalButtonDisabled;
                    submitButton.textContent = originalButtonText;
                }
                
                console.log('✅ ========== BOOKING SUCCESS ==========');
                return; // Exit early on success
            } else {
                throw new Error(response.message || response.error || 'Failed to create booking');
            }
        } else {
            console.log('⚠️ API Service not available, using fallback mode');
        }
    } catch (error) {
        console.error('❌ ========== BOOKING ERROR ==========');
        console.error('❌ Error creating booking:', error);
        console.error('❌ Error details:', {
            message: error.message,
            status: error.status,
            data: error.data,
            stack: error.stack
        });
        
        // Restore button on error
        if (submitButton) {
            submitButton.disabled = originalButtonDisabled;
            submitButton.textContent = originalButtonText;
        }
        
        // Handle specific error types
        const errorMessage = error.data?.message || error.message || 'Failed to create booking';
        const errorStatus = error.status || 500;
        
        // Check if it's an availability error
        if (errorStatus === 409 || errorMessage.includes('not available') || 
            errorMessage.includes('already occupied') || 
            errorMessage.includes('already booked') ||
            error.data?.error === 'AVAILABILITY_ERROR') {
            if (window.languageManager) {
                const isArabic = window.languageManager.currentLanguage === 'ar';
                window.languageManager.showNotification(
                    isArabic ? `الموقف غير متاح: ${errorMessage}` : `Slot unavailable: ${errorMessage}`,
                    'error'
                );
            }
            return; // Don't continue with local update
        }
        
        // For other errors, show error message but don't prevent local update as fallback
        if (window.languageManager) {
            const isArabic = window.languageManager.currentLanguage === 'ar';
            window.languageManager.showNotification(
                isArabic ? `خطأ في إنشاء الحجز: ${errorMessage}` : `Booking error: ${errorMessage}`,
                'error'
            );
        }
        
        // For API errors, show error and exit - no fallback simulation
        if (window.apiService && window.apiService.createBooking) {
            console.log('❌ API booking failed. Please check your connection and try again.');
            return; // Exit on error - no simulation
        } else {
            // If API service doesn't exist, show error
            if (window.languageManager) {
                const isArabic = window.languageManager.currentLanguage === 'ar';
                window.languageManager.showNotification(
                    isArabic ? 'خدمة الحجز غير متاحة. يرجى المحاولة لاحقاً.' : 'Booking service unavailable. Please try again later.',
                    'error'
                );
            }
            return;
        }
    }
    } finally {
        // Always restore button state
        if (submitButton) {
            submitButton.disabled = originalButtonDisabled;
            submitButton.textContent = originalButtonText;
        }
    }
}

// Helper function to restore button state
function restoreBookingButton(submitButton, originalButtonDisabled, originalButtonText) {
    if (submitButton) {
        submitButton.disabled = originalButtonDisabled;
        submitButton.textContent = originalButtonText;
    }
}

// Update booking cost when duration changes
window.updateBookingCost = updateBookingCost;

// Update booking cost in driver page with price type selection
function updateBookingCostInDriver() {
    const garageNameInput = document.getElementById('bookingGarageName');
    const garageId = garageNameInput ? parseInt(garageNameInput.dataset.garageId) : null;
    if (!garageId) return;
    
    const garage = garages.find(g => g.id === garageId);
    if (!garage) return;
    
    const durationInput = document.getElementById('bookingDuration');
    const priceTypeSelect = document.getElementById('bookingPriceType');
    const costInput = document.getElementById('bookingCost');
    
    if (!durationInput || !priceTypeSelect || !costInput) return;
    
    const duration = parseFloat(durationInput.value) || 1;
    const priceType = priceTypeSelect.value || 'hourly';
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    let rate = 0;
    let cost = 0;
    
    // Get rate based on price type
    switch (priceType) {
        case 'hourly':
            rate = garage.hourlyRate || 0;
            cost = rate * duration;
            break;
        case 'additionalHour':
            rate = garage.additionalHourRate || garage.hourlyRate || 0;
            cost = rate * duration;
            break;
        case 'overnight':
            rate = garage.overnightRate || garage.hourlyRate * 12 || 0;
            cost = rate; // Overnight is fixed price
            break;
        case 'monthly':
            rate = garage.monthlyRate || garage.hourlyRate * 24 * 30 || 0;
            cost = rate; // Monthly is fixed price
            break;
        case 'waitingDailyMonthly':
            rate = garage.waitingDailyMonthlyRate || garage.hourlyRate * 8 || 0;
            cost = rate; // Daily waiting monthly is fixed price
            break;
        default:
            rate = garage.hourlyRate || 0;
            cost = rate * duration;
    }
    
    costInput.value = `${cost.toFixed(2)} ${isArabic ? 'جنيه' : 'EGP'}`;
}
window.updateBookingCostInDriver = updateBookingCostInDriver;
window.handleBookingSubmit = handleBookingSubmit;

