class LanguageManager {
    constructor() {
        this.translations = {
            'ar': {
                'nav.home': 'الرئيسية',
                'nav.drivers': 'للسائقين',
                'nav.owners': 'لأصحاب المواقف',
                'nav.admin': 'للإدارة',
                'nav.profile': 'الملف الشخصي',
                'nav.login': 'تسجيل الدخول',
                'nav.register': 'إنشاء حساب',
                'nav.logout': 'تسجيل الخروج',
                'register.title': 'إنشاء حساب جديد',
                'register.subtitle': 'سجل الآن للاستفادة من خدمات Rakna',
                'register.name': 'الاسم الكامل',
                'register.name.placeholder': 'أدخل اسمك الكامل',
                'register.email': 'البريد الإلكتروني',
                'register.email.placeholder': 'example@email.com',
                'register.role': 'نوع الحساب',
                'register.role.select': 'اختر نوع الحساب',
                'register.role.driver': 'سائق',
                'register.role.owner': 'صاحب موقف',
                'register.role.admin': 'مدير',
                'register.phone': 'رقم الهاتف',
                'register.phone.placeholder': '01X XXX XXXX',
                'register.nationalId': 'الرقم القومي',
                'register.nationalId.placeholder': '14 رقم',
                'register.drivingLicense': 'رخصة القيادة',
                'register.drivingLicense.placeholder': 'رقم رخصة القيادة',
                'register.carLicense': 'رقم لوحة السيارة',
                'register.carLicense.placeholder': 'XXX-XXXX',
                'register.carType': 'نوع السيارة',
                'register.carType.placeholder': 'اختر نوع السيارة',
                'register.carType.select': 'اختر نوع السيارة',
                'register.carType.sedan': 'سيدان',
                'register.carType.suv': 'دفع رباعي',
                'register.carType.hatchback': 'هاتشباك',
                'register.carType.coupe': 'كوبيه',
                'register.carType.pickup': 'بيك أب',
                'register.carType.van': 'فان',
                'register.carType.other': 'أخرى',
                'register.carColor': 'لون السيارة',
                'register.carColor.placeholder': 'اختر لون السيارة',
                'register.carColor.select': 'اختر لون السيارة',
                'register.carColor.white': 'أبيض',
                'register.carColor.black': 'أسود',
                'register.carColor.silver': 'فضي',
                'register.carColor.gray': 'رمادي',
                'register.carColor.red': 'أحمر',
                'register.carColor.blue': 'أزرق',
                'register.carColor.green': 'أخضر',
                'register.carColor.yellow': 'أصفر',
                'register.carColor.brown': 'بني',
                'register.carColor.other': 'أخرى',
                'register.password': 'كلمة المرور',
                'register.password.placeholder': 'كلمة مرور قوية',
                'register.confirmPassword': 'تأكيد كلمة المرور',
                'register.confirmPassword.placeholder': 'أعد إدخال كلمة المرور',
                'register.agreeTerms': 'أوافق على',
                'register.terms': 'الشروط والأحكام',
                'register.privacy': 'سياسة الخصوصية',
                'register.submit': 'إنشاء حساب',
                'register.haveAccount': 'لديك حساب بالفعل؟',
                'register.login': 'تسجيل الدخول',
                'login.title': 'تسجيل الدخول',
                'login.subtitle': 'مرحباً بعودتك إلى Rakna',
                'login.email': 'البريد الإلكتروني',
                'login.email.placeholder': 'example@email.com',
                'login.password': 'كلمة المرور',
                'login.password.placeholder': 'كلمة المرور',
                'login.forgotPassword': 'نسيت كلمة المرور؟',
                'login.rememberMe': 'تذكرني',
                'login.submit': 'تسجيل الدخول',
                'login.noAccount': 'ليس لديك حساب؟',
                'login.register': 'إنشاء حساب جديد',
                'visitor.title': 'مرحباً بك في Rakna',
                'visitor.subtitle': 'نظام ركنة ذكي للإسكندرية - حلول ذكية لمواقف السيارات في منطقة العطارين',
                'visitor.stats.garages': 'موقف متاح',
                'visitor.stats.users': 'مستخدم نشط',
                'visitor.stats.satisfaction': 'معدل الرضا',
                'visitor.cta.drivers': 'ابدأ الرحلة',
                'visitor.cta.owners': 'إدارة الموقف',
                'features.title': 'مميزات النظام',
                'features.search.title': 'بحث ذكي',
                'features.search.desc': 'ابحث عن أقرب موقف متاح في منطقة العطارين بسهولة وسرعة',
                'features.booking.title': 'حجز فوري',
                'features.booking.desc': 'احجز موقفك في ثوانٍ معدودة بدون تعقيدات',
                'features.map.title': 'خرائط تفاعلية',
                'features.map.desc': 'شاهد المواقف على الخريطة مباشرة مع تحديثات فورية',
                'features.security.title': 'آمن ومضمون',
                'features.security.desc': 'نظام دفع آمن ومراقبة 24/7 لضمان سلامتك',
                'howitworks.title': 'كيف يعمل النظام',
                'howitworks.step1.title': 'ابحث عن موقف',
                'howitworks.step1.desc': 'استخدم الخريطة للعثور على أقرب موقف متاح في منطقة العطارين',
                'howitworks.step2.title': 'احجز موقفك',
                'howitworks.step2.desc': 'اختر الوقت والمدة المناسبة واحجز موقفك بضغطة واحدة',
                'howitworks.step3.title': 'ادفع بسهولة',
                'howitworks.step3.desc': 'ادفع عبر طرق دفع آمنة ومتعددة (بطاقات، محافظ رقمية)',
                'howitworks.step4.title': 'استمتع بالرحلة',
                'howitworks.step4.desc': 'اذهب إلى موقفك المحدد واستمتع برحلتك بدون قلق',
                'footer.title': 'Rakna',
                'footer.subtitle': 'نظام ركنة ذكي للإسكندرية',
                'footer.quicklinks': 'روابط سريعة',
                'footer.support': 'الدعم',
                'footer.help': 'مساعدة',
                'footer.faq': 'الأسئلة الشائعة',
                'footer.contact': 'اتصل بنا',
                'footer.contactinfo': 'معلومات الاتصال',
                'footer.contact.address': 'الإسكندرية، مصر',
                'footer.copyright': '© 2025 Rakna - جميع الحقوق محفوظة',
                'driver.title': 'ابحث عن موقف في العطارين',
                'driver.subtitle': 'مواقف ذكية متاحة في الوقت الفعلي',
                'driver.search.placeholder': 'أدخل موقعك أو المنطقة',
                'driver.search.button': 'بحث',
                'driver.filters.price': 'أي سعر',
                'driver.filters.price.0-10': '0-10 جنيه/ساعة',
                'driver.filters.price.10-20': '10-20 جنيه/ساعة',
                'driver.filters.price.20+': '20+ جنيه/ساعة',
                'driver.filters.type': 'أي نوع',
                'driver.filters.type.regular': 'عادي',
                'driver.filters.type.handicap': 'ذوي الاحتياجات',
                'driver.filters.type.electric': 'سيارة كهربائية',
                'driver.filters.button': 'فلترة',
                'driver.map.center': 'توسيط الخريطة',
                'driver.map.refresh': 'تحديث الخريطة',
                'driver.findClosest': 'أقرب موقف لي',
                'driver.location.status': 'جاري تحديد موقعك...',
                'driver.location.found': 'تم تحديد موقعك',
                'driver.location.error': 'لا يمكن الوصول إلى موقعك',
                'driver.traffic.light': 'مرور خفيف',
                'driver.traffic.moderate': 'مرور متوسط',
                'driver.traffic.heavy': 'ازدحام',
                'driver.traffic.veryHeavy': 'ازدحام شديد',
                'driver.traffic.alternative': 'مسار بديل',
                'driver.traffic.eta': 'الوقت المتوقع',
                'driver.legend.available': 'متاح',
                'driver.legend.limited': 'محدود',
                'driver.legend.full': 'ممتلئ',
                'driver.garages.title': 'المواقف المتاحة',
                'driver.garages.view.grid': 'عرض الشبكة',
                'driver.garages.view.list': 'عرض القائمة',
                'driver.booking.title': 'حجز موقف',
                'driver.booking.garage': 'الموقف',
                'driver.booking.space': 'رقم المكان',
                'driver.booking.starttime': 'وقت البداية',
                'driver.booking.duration': 'المدة (ساعات)',
                'driver.booking.cost': 'التكلفة الإجمالية',
                'driver.booking.cancel': 'إلغاء',
                'driver.booking.confirm': 'تأكيد الحجز',
                'driver.booking.pay': 'دفع وتأكيد الحجز',
                'driver.booking.firstTime': 'هذه أول حجز لك. يرجى إتمام الدفع.',
                'driver.payment.title': 'معلومات الدفع',
                'driver.payment.method': 'طريقة الدفع',
                'driver.payment.method.select': 'اختر طريقة الدفع',
                'driver.payment.method.visa': 'فيزا',
                'driver.payment.method.miza': 'ميزة',
                'driver.payment.method.credit': 'بطاقة ائتمانية',
                'driver.payment.method.instapay': 'إنستاباي',
                'driver.payment.method.wallet': 'محفظة رقمية',
                'driver.payment.cardNumber': 'رقم البطاقة',
                'driver.payment.cardNumber.placeholder': '1234 5678 9012 3456',
                'driver.payment.expiry': 'تاريخ الانتهاء',
                'driver.payment.expiry.placeholder': 'MM/YY',
                'driver.payment.cvv': 'CVV',
                'driver.payment.cvv.placeholder': '123',
                'driver.payment.cardholder': 'اسم حامل البطاقة',
                'driver.payment.cardholder.placeholder': 'اسم حامل البطاقة',
                'driver.payment.wallet': 'رقم المحفظة',
                'driver.payment.wallet.placeholder': 'رقم المحفظة',
                'owner.title': 'لوحة تحكم صاحب الموقف',
                'owner.actions.export': 'تصدير البيانات',
                'owner.actions.add': 'إضافة موقف',
                'owner.stats.totalspaces': 'إجمالي الأماكن',
                'owner.stats.occupied': 'مشغول',
                'owner.stats.occupancyrate': 'معدل الإشغال',
                'owner.stats.revenue': 'إيرادات اليوم',
                'owner.garages.title': 'مواقفي',
                'owner.garages.table.name': 'اسم الموقف',
                'owner.garages.table.location': 'الموقع',
                'owner.garages.table.spaces': 'الأماكن',
                'owner.garages.table.occupied': 'مشغول',
                'owner.garages.table.rate': 'السعر',
                'owner.garages.table.actions': 'الإجراءات',
                'owner.addgarage.title': 'إضافة موقف جديد',
                'owner.addgarage.name': 'اسم الموقف',
                'owner.addgarage.address': 'العنوان',
                'owner.addgarage.capacity': 'إجمالي السعة',
                'owner.addgarage.rate': 'السعر بالساعة (جنيه)',
                'owner.addgarage.type': 'نوع الموقف',
                'owner.addgarage.type.private': 'خاص',
                'owner.addgarage.type.public': 'عام',
                'owner.addgarage.cancel': 'إلغاء',
                'owner.addgarage.confirm': 'إضافة الموقف',
                'owner.bookings.title': 'الحجوزات',
                'owner.bookings.table.garage': 'الموقف',
                'owner.bookings.table.user': 'المستخدم',
                'owner.bookings.table.carInfo': 'معلومات السيارة',
                'owner.bookings.table.start': 'وقت البداية',
                'owner.bookings.table.duration': 'المدة',
                'owner.bookings.table.cost': 'التكلفة',
                'owner.bookings.table.status': 'الحالة',
                'admin.title': 'إدارة النظام',
                'admin.actions.refresh': 'تحديث البيانات',
                'admin.actions.settings': 'الإعدادات',
                'admin.stats.totalusers': 'إجمالي المستخدمين',
                'admin.stats.totalgarages': 'إجمالي المواقف',
                'admin.stats.activebookings': 'الحجوزات النشطة',
                'admin.stats.systemhealth': 'صحة النظام',
                'admin.tabs.overview': 'نظرة عامة',
                'admin.tabs.users': 'المستخدمين',
                'admin.tabs.garages': 'المواقف',
                'admin.tabs.analytics': 'التحليلات',
                'admin.overview.recentactivity': 'النشاط الأخير',
                'admin.overview.systemstatus': 'حالة النظام',
                'admin.status.api': 'حالة API',
                'admin.status.db': 'قاعدة البيانات',
                'admin.status.sensors': 'المستشعرات',
                'admin.status.connected': 'متصل',
                'admin.status.partial': 'جزئي',
                'admin.status.disconnected': 'غير متصل',
                'notification.language.changed': 'تم تغيير اللغة إلى العربية',
                'notification.booking.success': 'تم إنشاء الحجز بنجاح!',
                'notification.booking.error': 'حدث خطأ أثناء الحجز.',
                'notification.garage.notfound': 'الموقف غير موجود',
                'notification.garage.closed': 'الموقف مغلق حالياً',
                'notification.garage.no_spaces': 'لا توجد مساحات متاحة',
                'notification.addgarage.success': 'تم إضافة الموقف بنجاح!',
                'notification.addgarage.error': 'حدث خطأ أثناء إضافة الموقف.',
                'notification.location.error': 'تعذر تحديد موقعك.',
                'notification.location.denied': 'تم رفض الوصول إلى الموقع.',
                'notification.location.unavailable': 'معلومات الموقع غير متاحة.',
                'notification.location.timeout': 'انتهت مهلة طلب الموقع.',
                'notification.location.unsupported': 'متصفحك لا يدعم تحديد الموقع الجغرافي.',
                'notification.map.centered': 'تم توسيط الخريطة على موقعك.',
                'notification.map.refreshed': 'تم تحديث بيانات المواقف.',
                'notification.data.exported': 'تم تصدير البيانات بنجاح.',
                'notification.data.refreshed': 'تم تحديث بيانات النظام.',
                'notification.settings.saved': 'تم حفظ الإعدادات بنجاح.',
                'notification.settings.error': 'حدث خطأ أثناء حفظ الإعدادات.'
            },
            'en': {
                'nav.home': 'Home',
                'nav.drivers': 'Drivers',
                'nav.owners': 'Owners',
                'nav.admin': 'Admin',
                'nav.profile': 'Profile',
                'nav.login': 'Login',
                'nav.register': 'Sign Up',
                'nav.logout': 'Logout',
                'register.title': 'Create New Account',
                'register.subtitle': 'Sign up now to enjoy Rakna services',
                'register.name': 'Full Name',
                'register.name.placeholder': 'Enter your full name',
                'register.email': 'Email',
                'register.email.placeholder': 'example@email.com',
                'register.role': 'Account Type',
                'register.role.select': 'Select account type',
                'register.role.driver': 'Driver',
                'register.role.owner': 'Parking Owner',
                'register.role.admin': 'Admin',
                'register.phone': 'Phone Number',
                'register.phone.placeholder': '01X XXX XXXX',
                'register.nationalId': 'National ID',
                'register.nationalId.placeholder': '14 digits',
                'register.drivingLicense': 'Driving License',
                'register.drivingLicense.placeholder': 'Driving license number',
                'register.carLicense': 'Car License Plate',
                'register.carLicense.placeholder': 'XXX-XXXX',
                'register.carType': 'Car Type',
                'register.carType.placeholder': 'Select car type',
                'register.carType.select': 'Select car type',
                'register.carType.sedan': 'Sedan',
                'register.carType.suv': 'SUV',
                'register.carType.hatchback': 'Hatchback',
                'register.carType.coupe': 'Coupe',
                'register.carType.pickup': 'Pickup',
                'register.carType.van': 'Van',
                'register.carType.other': 'Other',
                'register.carColor': 'Car Color',
                'register.carColor.placeholder': 'Select car color',
                'register.carColor.select': 'Select car color',
                'register.carColor.white': 'White',
                'register.carColor.black': 'Black',
                'register.carColor.silver': 'Silver',
                'register.carColor.gray': 'Gray',
                'register.carColor.red': 'Red',
                'register.carColor.blue': 'Blue',
                'register.carColor.green': 'Green',
                'register.carColor.yellow': 'Yellow',
                'register.carColor.brown': 'Brown',
                'register.carColor.other': 'Other',
                'register.password': 'Password',
                'register.password.placeholder': 'Strong password',
                'register.confirmPassword': 'Confirm Password',
                'register.confirmPassword.placeholder': 'Re-enter password',
                'register.agreeTerms': 'I agree to',
                'register.terms': 'Terms and Conditions',
                'register.privacy': 'Privacy Policy',
                'register.submit': 'Create Account',
                'register.haveAccount': 'Already have an account?',
                'register.login': 'Login',
                'login.title': 'Login',
                'login.subtitle': 'Welcome back to Rakna',
                'login.email': 'Email',
                'login.email.placeholder': 'example@email.com',
                'login.password': 'Password',
                'login.password.placeholder': 'Password',
                'login.forgotPassword': 'Forgot password?',
                'login.rememberMe': 'Remember me',
                'login.submit': 'Login',
                'login.noAccount': 'Don\'t have an account?',
                'login.register': 'Create new account',
                'visitor.title': 'Welcome to Rakna',
                'visitor.subtitle': 'Smart Parking System for Alexandria - Intelligent Solutions for Parking in Al-Attarin District',
                'visitor.stats.garages': 'Available Garages',
                'visitor.stats.users': 'Active Users',
                'visitor.stats.satisfaction': 'Satisfaction Rate',
                'visitor.cta.drivers': 'Start Your Journey',
                'visitor.cta.owners': 'Manage Your Garage',
                'features.title': 'System Features',
                'features.search.title': 'Smart Search',
                'features.search.desc': 'Find the nearest available parking in Al-Attarin district easily and quickly',
                'features.booking.title': 'Instant Booking',
                'features.booking.desc': 'Book your parking spot in seconds without complications',
                'features.map.title': 'Interactive Maps',
                'features.map.desc': 'View parking spots directly on the map with real-time updates',
                'features.security.title': 'Safe & Secure',
                'features.security.desc': 'Secure payment system and 24/7 monitoring to ensure your safety',
                'howitworks.title': 'How It Works',
                'howitworks.step1.title': 'Find a Parking Spot',
                'howitworks.step1.desc': 'Use the map to find the nearest available parking in Al-Attarin district',
                'howitworks.step2.title': 'Book Your Spot',
                'howitworks.step2.desc': 'Choose the suitable time and duration and book your spot with one click',
                'howitworks.step3.title': 'Pay Easily',
                'howitworks.step3.desc': 'Pay via secure and multiple payment methods (cards, digital wallets)',
                'howitworks.step4.title': 'Enjoy Your Trip',
                'howitworks.step4.desc': 'Go to your reserved spot and enjoy your trip without worry',
                'footer.title': 'Rakna',
                'footer.subtitle': 'Smart Parking System for Alexandria',
                'footer.quicklinks': 'Quick Links',
                'footer.support': 'Support',
                'footer.help': 'Help',
                'footer.faq': 'FAQ',
                'footer.contact': 'Contact Us',
                'footer.contactinfo': 'Contact Info',
                'footer.contact.address': 'Alexandria, Egypt',
                'footer.copyright': '© 2025 Rakna - All Rights Reserved',
                'driver.title': 'Find Parking in Al-Attarin',
                'driver.subtitle': 'Smart parking spots available in real-time',
                'driver.search.placeholder': 'Enter your location or area',
                'driver.search.button': 'Search',
                'driver.filters.price': 'Any Price',
                'driver.filters.price.0-10': '0-10 EGP/hour',
                'driver.filters.price.10-20': '10-20 EGP/hour',
                'driver.filters.price.20+': '20+ EGP/hour',
                'driver.filters.type': 'Any Type',
                'driver.filters.type.regular': 'Regular',
                'driver.filters.type.handicap': 'Handicap',
                'driver.filters.type.electric': 'Electric Car',
                'driver.filters.button': 'Filter',
                'driver.map.center': 'Center Map',
                'driver.map.refresh': 'Refresh Map',
                'driver.findClosest': 'Find Closest Facility',
                'driver.location.status': 'Getting your location...',
                'driver.location.found': 'Location found',
                'driver.location.error': 'Cannot access your location',
                'driver.traffic.light': 'Light Traffic',
                'driver.traffic.moderate': 'Moderate Traffic',
                'driver.traffic.heavy': 'Heavy Traffic',
                'driver.traffic.veryHeavy': 'Very Heavy Traffic',
                'driver.traffic.alternative': 'Alternative Route',
                'driver.traffic.eta': 'Estimated Time',
                'driver.legend.available': 'Available',
                'driver.legend.limited': 'Limited',
                'driver.legend.full': 'Full',
                'driver.garages.title': 'Available Garages',
                'driver.garages.view.grid': 'Grid View',
                'driver.garages.view.list': 'List View',
                'driver.booking.title': 'Book Parking',
                'driver.booking.garage': 'Garage',
                'driver.booking.space': 'Space Number',
                'driver.booking.starttime': 'Start Time',
                'driver.booking.duration': 'Duration (hours)',
                'driver.booking.cost': 'Total Cost',
                'driver.booking.cancel': 'Cancel',
                'driver.booking.confirm': 'Confirm Booking',
                'driver.booking.pay': 'Pay & Confirm Booking',
                'driver.booking.firstTime': 'This is your first booking. Please complete payment.',
                'driver.payment.title': 'Payment Information',
                'driver.payment.method': 'Payment Method',
                'driver.payment.method.select': 'Select payment method',
                'driver.payment.method.visa': 'VISA',
                'driver.payment.method.miza': 'MIZA',
                'driver.payment.method.credit': 'Credit Card',
                'driver.payment.method.instapay': 'InstaPay',
                'driver.payment.method.wallet': 'Digital Wallet',
                'driver.payment.cardNumber': 'Card Number',
                'driver.payment.cardNumber.placeholder': '1234 5678 9012 3456',
                'driver.payment.expiry': 'Expiry Date',
                'driver.payment.expiry.placeholder': 'MM/YY',
                'driver.payment.cvv': 'CVV',
                'driver.payment.cvv.placeholder': '123',
                'driver.payment.cardholder': 'Cardholder Name',
                'driver.payment.cardholder.placeholder': 'Cardholder Name',
                'driver.payment.wallet': 'Wallet Number',
                'driver.payment.wallet.placeholder': 'Wallet Number',
                'owner.title': 'Garage Owner Dashboard',
                'owner.actions.export': 'Export Data',
                'owner.actions.add': 'Add Garage',
                'owner.stats.totalspaces': 'Total Spaces',
                'owner.stats.occupied': 'Occupied',
                'owner.stats.occupancyrate': 'Occupancy Rate',
                'owner.stats.revenue': 'Today\'s Revenue',
                'owner.garages.title': 'My Garages',
                'owner.garages.table.name': 'Garage Name',
                'owner.garages.table.location': 'Location',
                'owner.garages.table.spaces': 'Spaces',
                'owner.garages.table.occupied': 'Occupied',
                'owner.garages.table.rate': 'Rate',
                'owner.garages.table.actions': 'Actions',
                'owner.addgarage.title': 'Add New Garage',
                'owner.addgarage.name': 'Garage Name',
                'owner.addgarage.address': 'Address',
                'owner.addgarage.capacity': 'Total Capacity',
                'owner.addgarage.rate': 'Hourly Rate (EGP)',
                'owner.addgarage.type': 'Garage Type',
                'owner.addgarage.type.private': 'Private',
                'owner.addgarage.type.public': 'Public',
                'owner.addgarage.cancel': 'Cancel',
                'owner.addgarage.confirm': 'Add Garage',
                'owner.bookings.title': 'Bookings',
                'owner.bookings.table.garage': 'Garage',
                'owner.bookings.table.user': 'User',
                'owner.bookings.table.carInfo': 'Car Information',
                'owner.bookings.table.start': 'Start Time',
                'owner.bookings.table.duration': 'Duration',
                'owner.bookings.table.cost': 'Cost',
                'owner.bookings.table.status': 'Status',
                'admin.title': 'System Administration',
                'admin.actions.refresh': 'Refresh Data',
                'admin.actions.settings': 'Settings',
                'admin.stats.totalusers': 'Total Users',
                'admin.stats.totalgarages': 'Total Garages',
                'admin.stats.activebookings': 'Active Bookings',
                'admin.stats.systemhealth': 'System Health',
                'admin.tabs.overview': 'Overview',
                'admin.tabs.users': 'Users',
                'admin.tabs.garages': 'Garages',
                'admin.tabs.analytics': 'Analytics',
                'admin.overview.recentactivity': 'Recent Activity',
                'admin.overview.systemstatus': 'System Status',
                'admin.status.api': 'API Status',
                'admin.status.db': 'Database',
                'admin.status.sensors': 'Sensors',
                'admin.status.connected': 'Connected',
                'admin.status.partial': 'Partial',
                'admin.status.disconnected': 'Disconnected',
                'notification.language.changed': 'Language changed to English',
                'notification.booking.success': 'Booking created successfully!',
                'notification.booking.error': 'Error creating booking.',
                'notification.garage.notfound': 'Garage not found',
                'notification.garage.closed': 'Garage is currently closed',
                'notification.garage.no_spaces': 'No available spaces',
                'notification.addgarage.success': 'Garage added successfully!',
                'notification.addgarage.error': 'Error adding garage.',
                'notification.location.error': 'Could not determine your location.',
                'notification.location.denied': 'Location access denied.',
                'notification.location.unavailable': 'Location information is unavailable.',
                'notification.location.timeout': 'The request to get user location timed out.',
                'notification.location.unsupported': 'Your browser does not support geolocation.',
                'notification.map.centered': 'Map centered on your location.',
                'notification.map.refreshed': 'Parking data refreshed.',
                'notification.data.exported': 'Data exported successfully.',
                'notification.data.refreshed': 'System data refreshed.',
                'notification.settings.saved': 'Settings saved successfully.',
                'notification.settings.error': 'Error saving settings.'
            }
        };

        this.currentLanguage = localStorage.getItem('language') || 'ar';
        this.applyLanguage();
        this.setupLanguageSwitcher();
    }

    applyLanguage() {
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';

        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                element.placeholder = this.translations[this.currentLanguage][key];
            }
        });

        document.querySelectorAll('select').forEach(selectElement => {
            selectElement.querySelectorAll('option').forEach(optionElement => {
                const key = optionElement.getAttribute('data-translate');
                if (key && this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                    optionElement.textContent = this.translations[this.currentLanguage][key];
                }
            });
        });

        if (typeof renderGarages === 'function') {
            renderGarages();
        }
        if (typeof renderFilteredGarages === 'function') {
            renderFilteredGarages();
        }
    }

    switchLanguage(lang) {
        if (this.currentLanguage === lang) return;
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.applyLanguage();
        this.updateLanguageSwitcher();
        this.showNotification(this.translations[lang]['notification.language.changed'], 'info');
    }

    setupLanguageSwitcher() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        let switcher = document.querySelector('.language-switcher');
        if (!switcher) {
            switcher = document.createElement('div');
            switcher.className = 'language-switcher';
            navMenu.prepend(switcher);
        } else {
            switcher.innerHTML = '';
        }

        const arBtn = document.createElement('button');
        arBtn.className = `language-btn ${this.currentLanguage === 'ar' ? 'active' : ''}`;
        arBtn.innerHTML = '<i class="fas fa-globe"></i> العربية';
        arBtn.addEventListener('click', () => this.switchLanguage('ar'));
        switcher.appendChild(arBtn);

        const enBtn = document.createElement('button');
        enBtn.className = `language-btn ${this.currentLanguage === 'en' ? 'active' : ''}`;
        enBtn.innerHTML = '<i class="fas fa-globe"></i> English';
        enBtn.addEventListener('click', () => this.switchLanguage('en'));
        switcher.appendChild(enBtn);
    }

    updateLanguageSwitcher() {
        document.querySelectorAll('.language-btn').forEach((btn, index) => {
            btn.classList.remove('active');
            if ((this.currentLanguage === 'ar' && index === 0) || (this.currentLanguage === 'en' && index === 1)) {
                btn.classList.add('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});


