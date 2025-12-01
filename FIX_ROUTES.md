# 🔧 حل مشكلة "Cannot GET /dashboard/owner"

## الخطوات:

### 1. تأكد من أنك في المجلد الصحيح
```bash
cd frontend
```

### 2. تثبيت المكتبات (إذا لم تكن مثبتة)
```bash
npm install
```

### 3. امسح الـ cache
```bash
# في PowerShell:
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# أو في CMD:
rmdir /s /q .next
```

### 4. أعد تشغيل السيرفر
```bash
npm run dev
```

### 5. افتح المتصفح
افتح: **http://localhost:3000/dashboard/owner**

## إذا استمرت المشكلة:

### تحقق من الملفات:
- ✅ `app/dashboard/owner/page.tsx` موجود
- ✅ `components/Navbar.tsx` موجود
- ✅ `components/LanguageSwitcher.tsx` موجود

### تحقق من الأخطاء:
- افتح Console في المتصفح (F12)
- تحقق من Terminal الذي يعمل فيه `npm run dev`
- ابحث عن أي أخطاء في التجميع

### إعادة تثبيت المكتبات:
```bash
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

