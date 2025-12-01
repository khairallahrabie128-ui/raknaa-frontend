# 🔧 حل مشكلة "Cannot GET /dashboard/owner"

## ✅ الخطوات المضمونة:

### 1. تأكد من أنك في المجلد الصحيح
```powershell
cd D:\sps\frontend
```

### 2. تحقق من وجود الملفات
```powershell
Test-Path "app\dashboard\owner\page.tsx"
# يجب أن يرجع: True
```

### 3. امسح الـ cache والـ build
```powershell
# احذف مجلد .next إذا كان موجود
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# احذف node_modules إذا كان هناك مشاكل
# Remove-Item -Recurse -Force node_modules
```

### 4. تثبيت المكتبات (إذا لم تكن مثبتة)
```powershell
npm install
```

### 5. شغّل السيرفر
```powershell
npm run dev
```

### 6. افتح المتصفح
افتح: **http://localhost:3000/dashboard/owner**

## ⚠️ إذا استمرت المشكلة:

### تحقق من:
1. ✅ أن السيرفر يعمل (يجب أن ترى رسالة "Ready" في Terminal)
2. ✅ أن المنفذ 3000 غير مستخدم من برنامج آخر
3. ✅ أن المتصفح لا يستخدم cache قديم (جرب Ctrl+Shift+R)

### أخطاء شائعة:
- **"Port 3000 is already in use"**: غير المنفذ في `package.json` أو أغلق البرنامج الآخر
- **"Module not found"**: شغّل `npm install` مرة أخرى
- **"Cannot find module '@/components/...'"**: تحقق من `tsconfig.json` أن `paths` صحيح

### إعادة تثبيت كاملة:
```powershell
# احذف كل شيء
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json

# أعد التثبيت
npm install
npm run dev
```

## 📝 ملاحظات:
- تأكد من أن Next.js 14+ مثبت
- تأكد من أن React 18+ مثبت
- تأكد من أن TypeScript 5+ مثبت

