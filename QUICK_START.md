# 🚀 Quick Start Guide

## تشغيل المشروع

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. تشغيل السيرفر
```bash
npm run dev
```

### 3. فتح المتصفح
افتح: **http://localhost:3000**

## الصفحات المتاحة

- **الصفحة الرئيسية**: http://localhost:3000
- **تسجيل الدخول**: http://localhost:3000/login
- **التسجيل**: http://localhost:3000/register
- **لوحة تحكم المستخدم**: http://localhost:3000/dashboard/user
- **لوحة تحكم المالك**: http://localhost:3000/dashboard/owner
- **لوحة تحكم المسئول**: http://localhost:3000/dashboard/admin

## حل المشاكل

### إذا ظهرت رسالة "Cannot GET /dashboard/owner"

1. **أوقف السيرفر** (اضغط Ctrl+C)
2. **امسح مجلد .next**:
   ```bash
   Remove-Item -Recurse -Force .next
   ```
3. **أعد تشغيل السيرفر**:
   ```bash
   npm run dev
   ```

### إذا لم تعمل الصفحات

1. تأكد من تثبيت جميع المكتبات:
   ```bash
   npm install
   ```
2. تأكد من أن السيرفر يعمل على المنفذ 3000
3. تحقق من وجود الملفات في:
   - `app/dashboard/owner/page.tsx`
   - `app/dashboard/user/page.tsx`
   - `app/dashboard/admin/page.tsx`

