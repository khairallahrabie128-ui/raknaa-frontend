// Real parking data for Al-Attarin district, Alexandria, Egypt
// Fallback data if API is not available
let garages = []; // Global garages array
const garagesFallback = [
    {
        id: 1,
        name: 'جراج المنشية',
        nameEn: 'جراج المنشية',
        address: 'بجوار جراج المنشية، العطارين، الإسكندرية',
        addressEn: 'Near جراج المنشية, Al-Attarin, Alexandria',
        latitude: 31.198,
        longitude: 29.9065,
        totalSpaces: 50,
        occupiedSpaces: 15,
        hourlyRate: 10,
        rating: 4.4,
        reviews: 69,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.0,
        type: 'public'
    },
    {
        id: 2,
        name: 'Parking',
        nameEn: 'Parking',
        address: 'بجوار Parking، العطارين، الإسكندرية',
        addressEn: 'Near Parking, Al-Attarin, Alexandria',
        latitude: 31.202,
        longitude: 29.9135,
        totalSpaces: 70,
        occupiedSpaces: 21,
        hourlyRate: 20,
        overnightRate: 200,
        monthlyRate: 1200,
        rating: 4.1,
        reviews: 144,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.1,
        type: 'public'
    },
    {
        id: 3,
        name: 'جراج الشرق',
        nameEn: 'جراج الشرق',
        address: 'بجوار جراج الشرق، العطارين، الإسكندرية',
        addressEn: 'Near جراج الشرق, Al-Attarin, Alexandria',
        latitude: 31.202,
        longitude: 29.911,
        totalSpaces: 40,
        occupiedSpaces: 12,
        hourlyRate: 20,
        overnightRate: 100,
        rating: 4,
        reviews: 122,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.2,
        type: 'public'
    },
    {
        id: 4,
        name: 'جراج البريد المصري',
        nameEn: 'جراج البريد المصري',
        address: 'بجوار جراج البريد المصري، العطارين، الإسكندرية',
        addressEn: 'Near جراج البريد المصري, Al-Attarin, Alexandria',
        latitude: 31.1985,
        longitude: 29.907,
        totalSpaces: 30,
        occupiedSpaces: 9,
        hourlyRate: 0,
        rating: 4.3,
        reviews: 145,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة","مجاني للموظفين"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard","Free for Employees"],
        distance: 0.3,
        type: 'public',
        notes: 'مجاني للموظفين',
        notesEn: 'Free for employees'
    },
    {
        id: 5,
        name: 'Garage',
        nameEn: 'Garage',
        address: 'بجوار Garage، العطارين، الإسكندرية',
        addressEn: 'Near Garage, Al-Attarin, Alexandria',
        latitude: 31.1985,
        longitude: 29.9095,
        totalSpaces: 50,
        occupiedSpaces: 15,
        hourlyRate: 20,
        rating: 4.2,
        reviews: 68,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.4,
        type: 'public'
    },
    {
        id: 6,
        name: 'جراج سيدي متولي',
        nameEn: 'جراج سيدي متولي',
        address: 'بجوار جراج سيدي متولي، العطارين، الإسكندرية',
        addressEn: 'Near جراج سيدي متولي, Al-Attarin, Alexandria',
        latitude: 31.201,
        longitude: 29.91,
        totalSpaces: 40,
        occupiedSpaces: 12,
        hourlyRate: 20,
        overnightRate: 100,
        rating: 4.2,
        reviews: 84,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.5,
        type: 'public'
    },
    {
        id: 7,
        name: 'جراج التحرير',
        nameEn: 'جراج التحرير',
        address: 'بجوار جراج التحرير، العطارين، الإسكندرية',
        addressEn: 'Near جراج التحرير, Al-Attarin, Alexandria',
        latitude: 31.2,
        longitude: 29.9085,
        totalSpaces: 60,
        occupiedSpaces: 18,
        hourlyRate: 10,
        rating: 4.2,
        reviews: 125,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.6,
        type: 'public'
    },
    {
        id: 8,
        name: 'جراج الاتحاد الاشتراكي',
        nameEn: 'جراج الاتحاد الاشتراكي',
        address: 'بجوار جراج الاتحاد الاشتراكي، العطارين، الإسكندرية',
        addressEn: 'Near جراج الاتحاد الاشتراكي, Al-Attarin, Alexandria',
        latitude: 31.1995,
        longitude: 29.908,
        totalSpaces: 60,
        occupiedSpaces: 18,
        hourlyRate: 20,
        rating: 4.3,
        reviews: 130,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.7,
        type: 'public'
    },
    {
        id: 9,
        name: 'جراج الاوقاف',
        nameEn: 'جراج الاوقاف',
        address: 'بجوار جراج الاوقاف، العطارين، الإسكندرية',
        addressEn: 'Near جراج الاوقاف, Al-Attarin, Alexandria',
        latitude: 31.2005,
        longitude: 29.9105,
        totalSpaces: 30,
        occupiedSpaces: 9,
        hourlyRate: 10,
        overnightRate: 50,
        rating: 4.1,
        reviews: 91,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.8,
        type: 'public'
    },
    {
        id: 10,
        name: 'موقف سيارات',
        nameEn: 'موقف سيارات',
        address: 'بجوار موقف سيارات، العطارين، الإسكندرية',
        addressEn: 'Near موقف سيارات, Al-Attarin, Alexandria',
        latitude: 31.21,
        longitude: 29.91,
        totalSpaces: 25,
        occupiedSpaces: 7,
        hourlyRate: 20,
        rating: 4.1,
        reviews: 86,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 0.9,
        type: 'public'
    },
    {
        id: 11,
        name: 'Parking Area',
        nameEn: 'Parking Area',
        address: 'بجوار Parking Area، العطارين، الإسكندرية',
        addressEn: 'Near Parking Area, Al-Attarin, Alexandria',
        latitude: 31.204,
        longitude: 29.914,
        totalSpaces: 20,
        occupiedSpaces: 6,
        hourlyRate: 10,
        rating: 4.5,
        reviews: 116,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.0,
        type: 'public'
    },
    {
        id: 12,
        name: 'جراج 26 يوليو',
        nameEn: 'جراج 26 يوليو',
        address: 'بجوار جراج 26 يوليو، العطارين، الإسكندرية',
        addressEn: 'Near جراج 26 يوليو, Al-Attarin, Alexandria',
        latitude: 31.2065,
        longitude: 29.9075,
        totalSpaces: 100,
        occupiedSpaces: 30,
        hourlyRate: 10,
        additionalHourRate: 5,
        rating: 4,
        reviews: 132,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.1,
        type: 'public'
    },
    {
        id: 13,
        name: 'جراج المطافى',
        nameEn: 'جراج المطافى',
        address: 'بجوار جراج المطافى، العطارين، الإسكندرية',
        addressEn: 'Near جراج المطافى, Al-Attarin, Alexandria',
        latitude: 31.1995,
        longitude: 29.917,
        totalSpaces: 50,
        occupiedSpaces: 15,
        hourlyRate: 20,
        rating: 4.4,
        reviews: 70,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.2,
        type: 'public'
    },
    {
        id: 14,
        name: 'جراج سان مارك',
        nameEn: 'جراج سان مارك',
        address: 'بجوار جراج سان مارك، العطارين، الإسكندرية',
        addressEn: 'Near جراج سان مارك, Al-Attarin, Alexandria',
        latitude: 31.199,
        longitude: 29.9075,
        totalSpaces: 20,
        occupiedSpaces: 6,
        hourlyRate: 15,
        rating: 4.2,
        reviews: 50,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.3,
        type: 'public'
    },
    {
        id: 15,
        name: 'جراج اولاد عمارة',
        nameEn: 'جراج اولاد عمارة',
        address: 'بجوار جراج اولاد عمارة، العطارين، الإسكندرية',
        addressEn: 'Near جراج اولاد عمارة, Al-Attarin, Alexandria',
        latitude: 31.2045,
        longitude: 29.9145,
        totalSpaces: 30,
        occupiedSpaces: 9,
        hourlyRate: 20,
        additionalHourRate: 10,
        monthlyRate: 900,
        rating: 4.1,
        reviews: 117,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.4,
        type: 'public'
    },
    {
        id: 16,
        name: 'جراج اليكس تاور',
        nameEn: 'Alex Tower Garage',
        address: 'بجوار جراج اليكس تاور، العطارين، الإسكندرية',
        addressEn: 'Near Alex Tower Garage, Al-Attarin, Alexandria',
        latitude: 31.206,
        longitude: 29.912,
        totalSpaces: 100,
        occupiedSpaces: 30,
        hourlyRate: 20,
        overnightRate: 100,
        monthlyRate: 1500,
        waitingDailyMonthlyRate: 1000,
        rating: 4.2,
        reviews: 93,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.5,
        type: 'public'
    },
    {
        id: 17,
        name: 'جراج الحاج احمد سبرتو',
        nameEn: 'جراج الحاج احمد سبرتو',
        address: 'بجوار جراج الحاج احمد سبرتو، العطارين، الإسكندرية',
        addressEn: 'Near جراج الحاج احمد سبرتو, Al-Attarin, Alexandria',
        latitude: 31.2065,
        longitude: 29.9115,
        totalSpaces: 20,
        occupiedSpaces: 6,
        hourlyRate: 10,
        overnightRate: 50,
        rating: 4.3,
        reviews: 73,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.6,
        type: 'public'
    },
    {
        id: 18,
        name: 'Pastroudis Parking',
        nameEn: 'Pastroudis Parking',
        address: 'بجوار Pastroudis Parking، العطارين، الإسكندرية',
        addressEn: 'Near Pastroudis Parking, Al-Attarin, Alexandria',
        latitude: 31.2025,
        longitude: 29.913,
        totalSpaces: 20,
        occupiedSpaces: 6,
        hourlyRate: 10,
        rating: 4.2,
        reviews: 148,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.7,
        type: 'public'
    },
    {
        id: 19,
        name: 'جراج المحطة',
        nameEn: 'جراج المحطة',
        address: 'بجوار جراج المحطة، العطارين، الإسكندرية',
        addressEn: 'Near جراج المحطة, Al-Attarin, Alexandria',
        latitude: 31.2,
        longitude: 29.917,
        totalSpaces: 40,
        occupiedSpaces: 12,
        hourlyRate: 10,
        additionalHourRate: 5,
        rating: 4.2,
        reviews: 87,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.8,
        type: 'public'
    },
    {
        id: 20,
        name: 'جراج الخالدين',
        nameEn: 'جراج الخالدين',
        address: 'بجوار جراج الخالدين، العطارين، الإسكندرية',
        addressEn: 'Near جراج الخالدين, Al-Attarin, Alexandria',
        latitude: 31.209,
        longitude: 29.9115,
        totalSpaces: 70,
        occupiedSpaces: 21,
        hourlyRate: 25,
        additionalHourRate: 5,
        overnightRate: 100,
        rating: 4.3,
        reviews: 105,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 1.9,
        type: 'public'
    },
    {
        id: 21,
        name: 'جراج القائد ابراهيم',
        nameEn: 'جراج القائد ابراهيم',
        address: 'بجوار جراج القائد ابراهيم، العطارين، الإسكندرية',
        addressEn: 'Near جراج القائد ابراهيم, Al-Attarin, Alexandria',
        latitude: 31.21,
        longitude: 29.911,
        totalSpaces: 30,
        occupiedSpaces: 9,
        hourlyRate: 10,
        overnightRate: 50,
        rating: 4.5,
        reviews: 70,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.0,
        type: 'public'
    },
    {
        id: 22,
        name: 'جراج الجامعة',
        nameEn: 'University Garage',
        address: 'بجوار جراج الجامعة، العطارين، الإسكندرية',
        addressEn: 'Near University Garage, Al-Attarin, Alexandria',
        latitude: 31.2095,
        longitude: 29.9105,
        totalSpaces: 20,
        occupiedSpaces: 6,
        hourlyRate: 0,
        rating: 4.1,
        reviews: 101,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة","مجاني للموظفين"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard","Free for Employees"],
        distance: 2.1,
        type: 'public',
        notes: 'مجاني للموظفين',
        notesEn: 'Free for employees'
    },
    {
        id: 23,
        name: 'جراج السكه الحديد',
        nameEn: 'جراج السكه الحديد',
        address: 'بجوار جراج السكه الحديد، العطارين، الإسكندرية',
        addressEn: 'Near جراج السكه الحديد, Al-Attarin, Alexandria',
        latitude: 31.1998,
        longitude: 29.9178,
        totalSpaces: 60,
        occupiedSpaces: 18,
        hourlyRate: 15,
        rating: 4.2,
        reviews: 103,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.2,
        type: 'public'
    },
    {
        id: 24,
        name: 'جراج ديليس',
        nameEn: 'جراج ديليس',
        address: 'بجوار جراج ديليس، العطارين، الإسكندرية',
        addressEn: 'Near جراج ديليس, Al-Attarin, Alexandria',
        latitude: 31.206,
        longitude: 29.908,
        totalSpaces: 30,
        occupiedSpaces: 9,
        hourlyRate: 15,
        rating: 4.1,
        reviews: 122,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.3,
        type: 'public'
    },
    {
        id: 25,
        name: 'جراج الثغر',
        nameEn: 'جراج الثغر',
        address: 'بجوار جراج الثغر، العطارين، الإسكندرية',
        addressEn: 'Near جراج الثغر, Al-Attarin, Alexandria',
        latitude: 31.205,
        longitude: 29.9115,
        totalSpaces: 40,
        occupiedSpaces: 12,
        hourlyRate: 20,
        overnightRate: 100,
        monthlyRate: 1100,
        rating: 4.3,
        reviews: 78,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.4,
        type: 'public'
    },
    {
        id: 26,
        name: 'جراج مترو',
        nameEn: 'جراج مترو',
        address: 'بجوار جراج مترو، العطارين، الإسكندرية',
        addressEn: 'Near جراج مترو, Al-Attarin, Alexandria',
        latitude: 31.203,
        longitude: 29.9125,
        totalSpaces: 10,
        occupiedSpaces: 3,
        hourlyRate: 10,
        rating: 4.3,
        reviews: 66,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.5,
        type: 'public'
    },
    {
        id: 27,
        name: 'جراج طلعت حرب',
        nameEn: 'جراج طلعت حرب',
        address: 'بجوار جراج طلعت حرب، العطارين، الإسكندرية',
        addressEn: 'Near جراج طلعت حرب, Al-Attarin, Alexandria',
        latitude: 31.2035,
        longitude: 29.912,
        totalSpaces: 60,
        occupiedSpaces: 18,
        hourlyRate: 10,
        rating: 4.1,
        reviews: 125,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.6,
        type: 'public'
    },
    {
        id: 28,
        name: 'Parking',
        nameEn: 'Parking',
        address: 'بجوار Parking، العطارين، الإسكندرية',
        addressEn: 'Near Parking, Al-Attarin, Alexandria',
        latitude: 31.202,
        longitude: 29.9135,
        totalSpaces: 20,
        occupiedSpaces: 6,
        hourlyRate: 10,
        rating: 4.3,
        reviews: 81,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.7,
        type: 'public'
    },
    {
        id: 29,
        name: 'جراج السلام العمومي',
        nameEn: 'جراج السلام العمومي',
        address: 'بجوار جراج السلام العمومي، العطارين، الإسكندرية',
        addressEn: 'Near جراج السلام العمومي, Al-Attarin, Alexandria',
        latitude: 31.207,
        longitude: 29.9165,
        totalSpaces: 40,
        occupiedSpaces: 12,
        hourlyRate: 10,
        rating: 4.1,
        reviews: 71,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.8,
        type: 'public'
    },
    {
        id: 30,
        name: 'جراج بنك مصر كوم الدكة',
        nameEn: 'Banque Misr Kom El Dekka Garage',
        address: 'بجوار جراج بنك مصر كوم الدكة، العطارين، الإسكندرية',
        addressEn: 'Near Banque Misr Kom El Dekka Garage, Al-Attarin, Alexandria',
        latitude: 31.206,
        longitude: 29.912,
        totalSpaces: 50,
        occupiedSpaces: 15,
        hourlyRate: 30,
        overnightRate: 100,
        monthlyRate: 1500,
        rating: 4.3,
        reviews: 138,
        availability: 'available',
        operatingHours: '24 hours',
        amenities: ["كاميرات مراقبة","إضاءة LED","حراسة"],
        amenitiesEn: ["Security Cameras","LED Lighting","Security Guard"],
        distance: 2.9,
        type: 'public'
    }
];
;

// Al-Attarin district center coordinates
const ALATTARIN_CENTER = {
    lat: 31.2000,
    lng: 29.9167
};

// Load garages from API (from parking_system (1) database)
async function loadGaragesFromAPI(userLat, userLng) {
    try {
        // First, try to load from LPKX JSON file (GARAGE.lpkx)
        try {
            const response = await fetch('garage_points_for_map.json');
            if (response.ok) {
                const lpkxData = await response.json();
                if (lpkxData.garages && lpkxData.garages.length > 0) {
                    console.log(`Loaded ${lpkxData.garages.length} garages from GARAGE.lpkx file`);
                    
                    // Use LPKX data as primary source - update or add garages
                    lpkxData.garages.forEach(lpkxGarage => {
                        const existingGarage = garagesFallback.find(g => 
                            g.id === lpkxGarage.id || 
                            g.name === lpkxGarage.name || 
                            g.nameEn === lpkxGarage.name_en ||
                            (Math.abs(parseFloat(g.latitude) - parseFloat(lpkxGarage.latitude)) < 0.0001 &&
                             Math.abs(parseFloat(g.longitude) - parseFloat(lpkxGarage.longitude)) < 0.0001)
                        );
                        
                        if (existingGarage) {
                            // Update existing garage with LPKX coordinates and data
                            existingGarage.latitude = parseFloat(lpkxGarage.latitude);
                            existingGarage.longitude = parseFloat(lpkxGarage.longitude);
                            if (lpkxGarage.total_spaces) {
                                existingGarage.totalSpaces = lpkxGarage.total_spaces;
                            }
                            // Update name if available from LPKX
                            if (lpkxGarage.name) {
                                existingGarage.name = lpkxGarage.name;
                            }
                            if (lpkxGarage.name_en) {
                                existingGarage.nameEn = lpkxGarage.name_en;
                            }
                        } else {
                            // Add new garage from LPKX to fallback data
                            garagesFallback.push({
                                id: lpkxGarage.id || (garagesFallback.length + 1),
                                name: lpkxGarage.name || '',
                                nameEn: lpkxGarage.name_en || lpkxGarage.name || '',
                                address: '',
                                addressEn: '',
                                latitude: parseFloat(lpkxGarage.latitude),
                                longitude: parseFloat(lpkxGarage.longitude),
                                totalSpaces: lpkxGarage.total_spaces || 20,
                                occupiedSpaces: 0,
                                hourlyRate: 10,
                                rating: 0,
                                reviews: 0,
                                availability: 'available',
                                operatingHours: '24 hours',
                                amenities: [],
                                amenitiesEn: [],
                                distance: 0,
                                type: 'public'
                            });
                        }
                    });
                    
                    console.log(`Updated garagesFallback with ${lpkxData.garages.length} garages from GARAGE.lpkx`);
                }
            }
        } catch (fetchError) {
            console.log('Could not load GARAGE.lpkx file:', fetchError);
        }
        
        if (!window.apiService) {
            console.warn('API service not available, using fallback data');
            garages = garagesFallback;
            return garages;
        }

        // Load parking places from parking_system (1) backend database
        console.log('Loading parking places from parking_system (1) database...');
        const response = await window.apiService.getGarages(userLat, userLng);
        
        if (response.success && response.data && response.data.length > 0) {
            console.log(`Loaded ${response.data.length} parking places from database`);
            
            // Transform API data to match frontend format
            // USE COORDINATES FROM DATABASE (parking_system database)
            garages = response.data.map((garage, index) => {
                // Use coordinates from database (from parking_system)
                const lat = parseFloat(garage.latitude) || 0;
                const lng = parseFloat(garage.longitude) || 0;
                
                // Log coordinates for debugging
                console.log(`Garage: ${garage.name} (ID: ${garage.id}), Database Lat: ${lat}, Lng: ${lng}`);
                
                return {
                    id: garage.id,
                    name: garage.name, // Use exact name from database
                    nameEn: garage.name_en || garage.name, // Use exact name_en from database
                    address: garage.address, // Use exact address from database
                    addressEn: garage.address_en || garage.address, // Use exact address_en from database
                    latitude: lat, // USE COORDINATES FROM DATABASE
                    longitude: lng, // USE COORDINATES FROM DATABASE
                totalSpaces: garage.total_spaces,
                occupiedSpaces: garage.occupied_spaces || 0,
                hourlyRate: parseFloat(garage.hourly_rate),
                additionalHourRate: garage.additional_hour_rate ? parseFloat(garage.additional_hour_rate) : null,
                overnightRate: garage.overnight_rate ? parseFloat(garage.overnight_rate) : null,
                monthlyRate: garage.monthly_rate ? parseFloat(garage.monthly_rate) : null,
                waitingDailyMonthlyRate: garage.waiting_daily_monthly_rate ? parseFloat(garage.waiting_daily_monthly_rate) : null,
                rating: parseFloat(garage.rating) || 0,
                reviews: garage.reviews_count || 0,
                availability: garage.availability || 'available',
                operatingHours: garage.operating_hours || '24/7',
                amenities: garage.amenities || [], // Use exact amenities from database
                amenitiesEn: garage.amenities_en || garage.amenities || [], // Use exact amenities_en from database
                distance: garage.distance || 0,
                type: garage.type || 'public'
                };
            });
            
            console.log('Successfully loaded parking places from parking_system (1) database');
            return garages;
        } else {
            console.warn('No data received from API, using fallback data');
            throw new Error('Invalid API response or no data');
        }
    } catch (error) {
        console.error('Error loading garages from parking_system (1) API:', error);
        console.log('Using fallback data');
        garages = garagesFallback;
        return garages;
    }
}

// Helper functions for garage data
function getGarageName(garage) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    return isArabic ? (garage.name || garage.nameEn || 'Garage') : (garage.nameEn || garage.name || 'Garage');
}

function getGarageAddress(garage) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    return isArabic ? (garage.address || '') : (garage.addressEn || garage.address || '');
}

function getGarageAmenities(garage) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    return isArabic ? (garage.amenities || []) : (garage.amenitiesEn || garage.amenities || []);
}

function getAvailabilityText(availability) {
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    const texts = {
        'available': isArabic ? 'متاح' : 'Available',
        'limited': isArabic ? 'محدود' : 'Limited',
        'full': isArabic ? 'ممتلئ' : 'Full'
    };
    return texts[availability] || (isArabic ? 'غير معروف' : 'Unknown');
}

// Render garages in the grid
function renderGarages(filteredGarages = null) {
    const garageGrid = document.getElementById('garageGrid');
    if (!garageGrid) {
        console.error('garageGrid element not found!');
        return;
    }
    
    const garagesToRender = filteredGarages || garages;
    
    if (!garagesToRender || garagesToRender.length === 0) {
        console.warn('⚠️ No garages to render');
        // Try to use fallback data
        if (typeof garagesFallback !== 'undefined' && garagesFallback && garagesFallback.length > 0) {
            console.log('Using garagesFallback instead');
            garages = [...garagesFallback];
            return renderGarages(); // Recursive call with fallback data
        }
        garageGrid.innerHTML = '<p style="text-align: center; padding: var(--spacing-xl); color: var(--gray-600);">لا توجد جراجات متاحة</p>';
        return;
    }
    
    console.log(`🔄 Rendering ${garagesToRender.length} garages in garageGrid`);
    
    console.log(`Rendering ${garagesToRender.length} garages in garageGrid`);
    
    // Sort by availability and distance
    const sortedGarages = [...garagesToRender].map(g => ({
        ...g,
        distance: g.distance || 0,
        rating: g.rating || 0,
        reviews: g.reviews || 0,
        occupiedSpaces: g.occupiedSpaces || 0,
        totalSpaces: g.totalSpaces || 0,
        hourlyRate: g.hourlyRate || 0,
        operatingHours: g.operatingHours || '24/7'
    })).sort((a, b) => {
        if (a.availability === 'available' && b.availability !== 'available') return -1;
        if (b.availability === 'available' && a.availability !== 'available') return 1;
        return a.distance - b.distance;
    });
    
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    const spacesText = isArabic ? 'أماكن' : 'spaces';
    const kmText = isArabic ? 'كم' : 'km';
    const priceText = isArabic ? 'جنيه/ساعة' : 'EGP/hour';
    const bookText = isArabic ? 'احجز الآن' : 'Book Now';
    
    // Price labels
    const additionalHourText = isArabic ? 'ساعة إضافية' : 'Additional hour';
    const overnightText = isArabic ? 'ليلة' : 'Overnight';
    const monthlyText = isArabic ? 'شهري' : 'Monthly';
    const waitingDailyText = isArabic ? 'انتظار يومي (شهري)' : 'Daily waiting (monthly)';
    const egpText = isArabic ? 'جنيه' : 'EGP';
    
    garageGrid.innerHTML = sortedGarages.map(garage => `
        <div class="garage-card" data-garage-id="${garage.id}">
            <div class="garage-header">
                <h3>${getGarageName(garage)}</h3>
                <div class="garage-rating">
                    <span class="rating">${garage.rating}</span>
                    <div class="stars">${'★'.repeat(Math.floor(garage.rating))}${'☆'.repeat(5-Math.floor(garage.rating))}</div>
                    <span class="reviews">(${garage.reviews})</span>
                </div>
            </div>
            
            <div class="garage-address">
                <i class="fas fa-map-marker-alt"></i>
                <span>${getGarageAddress(garage)}</span>
            </div>
            
            <div class="garage-info">
                <div class="info-item">
                    <i class="fas fa-car"></i>
                    <span>${garage.occupiedSpaces}/${garage.totalSpaces} ${spacesText}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>${garage.operatingHours}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-route"></i>
                    <span>${(garage.distance || 0).toFixed(1)} ${kmText}</span>
                </div>
            </div>
            
            <div class="garage-amenities">
                ${getGarageAmenities(garage).map(amenity => `
                    <span class="amenity-tag">${amenity}</span>
                `).join('')}
            </div>
            
            <div class="garage-footer">
                <div class="price-info" style="flex: 1;">
                    <div class="price">
                        <span class="price-main">${garage.hourlyRate}</span>
                        <span class="price-unit">${priceText}</span>
                    </div>
                    ${garage.additionalHourRate ? `<div class="price-extra" style="font-size: var(--font-size-xs); color: var(--gray-600); margin-top: 4px;">
                        <i class="fas fa-clock" style="margin-left: 4px;"></i> ${isArabic ? 'ساعة إضافية' : 'Additional hour'}: ${garage.additionalHourRate} ${egpText}
                    </div>` : ''}
                    ${garage.overnightRate ? `<div class="price-extra" style="font-size: var(--font-size-xs); color: var(--gray-600); margin-top: 4px;">
                        <i class="fas fa-moon" style="margin-left: 4px;"></i> ${isArabic ? 'ليلة' : 'Overnight'}: ${garage.overnightRate} ${egpText}
                    </div>` : ''}
                    ${garage.monthlyRate ? `<div class="price-extra" style="font-size: var(--font-size-xs); color: var(--gray-600); margin-top: 4px;">
                        <i class="fas fa-calendar-alt" style="margin-left: 4px;"></i> ${isArabic ? 'شهري' : 'Monthly'}: ${garage.monthlyRate} ${egpText}
                    </div>` : ''}
                    ${garage.waitingDailyMonthlyRate ? `<div class="price-extra" style="font-size: var(--font-size-xs); color: var(--gray-600); margin-top: 4px;">
                        <i class="fas fa-hourglass-half" style="margin-left: 4px;"></i> ${isArabic ? 'انتظار يومي (شهري)' : 'Daily waiting (monthly)'}: ${garage.waitingDailyMonthlyRate} ${egpText}
                    </div>` : ''}
                </div>
                <div class="status ${garage.availability}" style="margin-left: var(--spacing-md);">
                    ${getAvailabilityText(garage.availability)}
                </div>
            </div>
            
            <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
                <button class="btn btn-primary" onclick="bookGarage(${garage.id})" style="flex: 1;">
                    <i class="fas fa-bookmark"></i>
                    ${bookText}
                </button>
                <button class="btn btn-outline" onclick="showRouteToGarage(${garage.id})" style="flex: 0 0 auto; padding: var(--spacing-md);" title="${isArabic ? 'عرض المسار' : 'Show Route'}">
                    <i class="fas fa-route"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ Successfully rendered ${sortedGarages.length} garages in garageGrid`);
}

// Book garage function
function bookGarage(garageId) {
    const garage = garages.find(g => g.id === garageId);
    if (!garage) {
        const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
        window.languageManager.showNotification(
            isArabic ? 'الموقف غير موجود' : 'Garage not found',
            'error'
        );
        return;
    }

    const modal = document.getElementById('bookingModal');
    if (modal) {
        const garageNameInput = document.getElementById('bookingGarageName');
        garageNameInput.value = getGarageName(garage);
        garageNameInput.dataset.garageId = garageId; // Store garage ID
        
        // Populate available spaces
        const spaceSelect = document.getElementById('bookingSpace');
        spaceSelect.innerHTML = '';
        const availableSpaces = garage.totalSpaces - garage.occupiedSpaces;
        
        if (availableSpaces <= 0) {
            const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
            window.languageManager.showNotification(
                isArabic ? 'لا توجد مساحات متاحة' : 'No available spaces',
                'error'
            );
            return;
        }
        
        for (let i = 1; i <= Math.min(availableSpaces, 10); i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}`;
            spaceSelect.appendChild(option);
        }

        // Set default start time to now (using real-time)
        const now = window.getCurrentTime ? window.getCurrentTime() : new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        const startTimeInput = document.getElementById('bookingStartTime');
        if (startTimeInput) {
            startTimeInput.value = window.getFormattedDateTime ? window.getFormattedDateTime() : now.toISOString().slice(0, 16);
            // Set minimum time to current time
            startTimeInput.min = now.toISOString().slice(0, 16);
        }

        // Calculate cost
        updateBookingCost(garage.hourlyRate);
        
        // Update price type options based on garage availability
        const priceTypeSelect = document.getElementById('bookingPriceType');
        if (priceTypeSelect) {
            // Enable/disable options based on what's available
            const options = priceTypeSelect.querySelectorAll('option');
            options.forEach(option => {
                const value = option.value;
                if (value === 'hourly') {
                    option.disabled = false;
                } else if (value === 'additionalHour') {
                    option.disabled = !garage.additionalHourRate;
                } else if (value === 'overnight') {
                    option.disabled = !garage.overnightRate;
                } else if (value === 'monthly') {
                    option.disabled = !garage.monthlyRate;
                } else if (value === 'waitingDailyMonthly') {
                    option.disabled = !garage.waitingDailyMonthlyRate;
                }
            });
            // Reset to hourly if current selection is disabled
            if (priceTypeSelect.value && priceTypeSelect.querySelector(`option[value="${priceTypeSelect.value}"]`).disabled) {
                priceTypeSelect.value = 'hourly';
            }
        }
        
        // Update cost with current price type
        if (typeof updateBookingCostInDriver === 'function') {
            updateBookingCostInDriver();
        }

        // Check if payment is required (for guests OR drivers on first booking)
        const paymentSection = document.getElementById('paymentSection');
        if (paymentSection) {
            // Check if user is authenticated
            const isAuthenticated = (window.isAuthenticated && typeof window.isAuthenticated === 'function') ? window.isAuthenticated() : false;
            const user = (window.getCurrentUser && typeof window.getCurrentUser === 'function') ? window.getCurrentUser() : null;
            
            // Payment required for:
            // 1. Guests (not authenticated)
            // 2. Drivers on first booking
            if (!isAuthenticated) {
                // Guest users - always require payment
                paymentSection.style.display = 'block';
            } else if (user && user.role === 'driver') {
                // Driver - check if first booking
                checkPaymentRequired().then(required => {
                    if (required) {
                        paymentSection.style.display = 'block';
                    } else {
                        paymentSection.style.display = 'none';
                    }
                }).catch(() => {
                    // On error, show payment (assume first booking)
                    paymentSection.style.display = 'block';
                });
            } else {
                // Owner/Admin - no payment required
                paymentSection.style.display = 'none';
            }
        }

        // Reset payment form
        const paymentMethod = document.getElementById('paymentMethod');
        const cardDetails = document.getElementById('cardDetails');
        const walletDetails = document.getElementById('walletDetails');
        if (paymentMethod) paymentMethod.value = '';
        if (cardDetails) cardDetails.style.display = 'none';
        if (walletDetails) walletDetails.style.display = 'none';

        modal.classList.add('active');
    }
}

// Check if payment is required (only for drivers on first booking)
async function checkPaymentRequired() {
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!user) return false;
    
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

// Update booking cost
function updateBookingCost(hourlyRate) {
    const durationInput = document.getElementById('bookingDuration');
    const costInput = document.getElementById('bookingTotalCost');
    
    if (!durationInput) return;
    
    const duration = parseFloat(durationInput.value) || 1;
    const hourlyRateValue = hourlyRate || 10; // Default rate
    const cost = hourlyRateValue * duration;
    const isArabic = window.languageManager && window.languageManager.currentLanguage === 'ar';
    
    if (costInput) {
        costInput.value = `${cost.toFixed(2)} ${isArabic ? 'جنيه' : 'EGP'}`;
    }
}
window.updateBookingCost = updateBookingCost;

// Initialize garages with fallback data immediately
// Make sure garagesFallback is defined before using it
if (typeof garagesFallback !== 'undefined' && garagesFallback && Array.isArray(garagesFallback) && garagesFallback.length > 0) {
    garages = [...garagesFallback];
    console.log(`✅ Initialized ${garages.length} garages from fallback data in main.js`);
} else {
    console.warn('garagesFallback is not available, initializing empty array');
    garages = [];
    // Try to initialize from window if available
    if (typeof window !== 'undefined' && window.garagesFallback) {
        garages = [...window.garagesFallback];
        console.log(`✅ Initialized ${garages.length} garages from window.garagesFallback`);
    }
}

// Export for use in other files
Object.defineProperty(window, 'garages', {
    get: () => garages,
    set: (value) => { garages = value; }
});
window.garagesFallback = garagesFallback;
window.ALATTARIN_CENTER = ALATTARIN_CENTER;
window.renderGarages = renderGarages;
window.loadGaragesFromAPI = loadGaragesFromAPI;
window.bookGarage = bookGarage;
window.getAvailabilityText = getAvailabilityText;
window.getGarageName = getGarageName;
window.getGarageAddress = getGarageAddress;
window.getGarageAmenities = getGarageAmenities;

// Close booking modal function
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        const form = document.getElementById('bookingForm');
        if (form) form.reset();
    }
}
window.closeBookingModal = closeBookingModal;

// Toggle payment details based on payment method
function togglePaymentDetails() {
    const paymentMethod = document.getElementById('paymentMethod');
    const cardDetails = document.getElementById('cardDetails');
    
    if (!paymentMethod || !cardDetails) return;
    
    const method = paymentMethod.value.toUpperCase();
    const showCardDetails = method === 'VISA' || method === 'MIZA' || method === 'CREDIT' || method === 'INSTAPAY';
    
    cardDetails.style.display = showCardDetails ? 'block' : 'none';
}
window.togglePaymentDetails = togglePaymentDetails;


