# مشروع CRTE — الرفع إلى GitHub والنشر على Firebase

هذه الحزمة مبنية على النسخة الصحيحة `crte-github-app_2.zip`، وعنوان التطبيق داخلها هو **تقرير الأشغال والاختبارات CRTE**.

## محتويات المجلد
- `public/index.html`: ملف التطبيق الأصلي، بدون تغيير.
- `public/sw.js`: Service Worker بإصدار `crte-v23` لتحديث ملفات التطبيق.
- `public/crte-app.webmanifest` والأيقونات: ملفات PWA الأصلية.
- `firebase.json` و`.firebaserc`: إعداد Firebase Hosting للمشروع `preparation-ce84e`.
- `.github/workflows/firebase-deploy.yml`: نشر تلقائي عند كل Push إلى `main`.

## الرفع إلى GitHub
1. افتح مستودع GitHub الصحيح الخاص بمشروع CRTE.
2. ارفع **محتويات هذا المجلد كلها** إلى جذر المستودع، وليس مجلد `CRTE_GitHub_Firebase` كطبقة إضافية.
3. تأكد أن GitHub يعرض `.github/workflows/firebase-deploy.yml` وأن مجلد `public` موجود في الجذر.
4. اعمل Commit إلى الفرع `main`.

## إعداد النشر
1. من Firebase Console افتح المشروع `preparation-ce84e` وفعّل Firebase Hosting إذا لم يكن مفعلاً.
2. أنشئ Service Account مخصصاً للنشر، بصلاحية مناسبة لـ Firebase Hosting فقط قدر الإمكان، وحمّل JSON الخاص به.
3. في GitHub: Settings → Secrets and variables → Actions → New repository secret.
4. اسم السر بالضبط: `FIREBASE_SERVICE_ACCOUNT_PREPARATION_CE84E`.
5. ضع محتوى JSON الخاص بحساب الخدمة كاملاً في قيمة السر. لا تضع ملف JSON داخل المستودع ولا تشاركه في المحادثة.
6. أعد تشغيل Workflow من Actions أو ادفع Commit جديداً إلى `main`.

## حماية البيانات المحلية
- ملف `index.html` الأصلي لم يتم تعديله.
- بيانات التطبيق التي يخزنها في `localStorage` تبقى محلية على الجهاز.
- `sw.js` لا يقرأ أو يمسح `localStorage` أو `IndexedDB`.
- عند تفعيل العامل الجديد، يمسح فقط Cache Storage القديم الذي يبدأ اسمه بـ `crte-`، ولا يمسح مخازن تطبيقات أخرى.

## تنبيه مهم قبل اعتماد Firebase كرابط التطبيق
إذا كان التطبيق مثبتاً حالياً من GitHub Pages، فإن Firebase Hosting سيعطي Origin/رابطاً مختلفاً. بيانات `localStorage` مرتبطة بالـ Origin، لذلك لن تظهر تلقائياً في الرابط الجديد. لا تحذف التطبيق القديم ولا توقف GitHub Pages قبل اختبار النسخة الجديدة وتصدير/استرجاع نسخة احتياطية داخل التطبيق.

هذه الحزمة لا تنشر شيئاً وحدها؛ النشر يبدأ بعد إعداد GitHub Secret وتشغيل Workflow.
