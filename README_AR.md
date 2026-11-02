# حزمة تحديث تطبيق CRTE عبر Firebase Hosting

## شنو كاين فالحزمة؟
- `public/index.html`: نسخة التطبيق المستقلة `index_modifie_v2(1).html` كما هي، بلا تغيير منطق التخزين المحلي.
- `public/sw.js`: Service Worker جديد بإصدار `crte-app-shell-v23`، كيجلب صفحة التطبيق من الإنترنت أولاً، وكيستعمل النسخة المخزنة غير إلا ماكانش الإنترنت.
- الأيقونات الأصلية.
- `firebase.json` و`.firebaserc` وGitHub Actions للنشر التلقائي.

## مهم قبل النقل
التطبيق الحالي حسب الدليل السابق منشور على GitHub Pages: `https://naimiaziz03-tech.github.io/Crte/`.
Firebase Hosting غادي يعطيك Origin/رابط مختلف. المتصفح كيعتبر الرابط الجديد موقعاً مختلفاً، وبالتالي التثبيت القديم ما كيتحدّثش تلقائياً عبر الرابط الجديد، والبيانات المحلية المرتبطة بالرابط القديم ما كتنتقلش وحدها. **ما تحذفش التطبيق القديم وما تمسحش بيانات Chrome** قبل تجربة النسخة الجديدة والتأكد من نقل البيانات بالطريقة المناسبة.

## النشر عبر GitHub Actions
1. فعّل Firebase Hosting للمشروع `preparation-ce84e` من Firebase Console.
2. أنشئ Service Account بصلاحية النشر على Firebase Hosting (من Google Cloud IAM)، وحمّل ملف JSON ديالو. ما تضعش هاد الملف داخل الحزمة أو المستودع.
3. في GitHub repository افتح: Settings → Secrets and variables → Actions → New repository secret.
4. الاسم بالضبط: `FIREBASE_SERVICE_ACCOUNT_PREPARATION_CE84E`، والقيمة هي محتوى JSON كامل ديال Service Account.
5. ارفع محتويات هاد المجلد إلى جذر مستودع GitHub (بما فيه مجلد `.github`). خليه على branch `main`.
6. من Actions شغّل `Deploy CRTE to Firebase Hosting` أو دير Push. من بعد النشر غادي يعطيك Firebase رابطاً من نوع `https://PROJECT_ID.web.app`.
7. أي تعديل مستقبلي على `public/index.html` أو `public/sw.js` ثم Push إلى `main` كينشر النسخة الجديدة.

## حماية البيانات
- ما كاين لا Firebase Auth داخل واجهة التطبيق ولا Firestore ولا رفع لبيانات الاستعمال.
- بيانات التطبيق باقية في `localStorage` ديال نفس المتصفح/نفس Origin، كما كان في الملف الأصلي.
- Service Worker ما كيمسحش `localStorage` ولا `IndexedDB`؛ كيمسح فقط Cache Storage القديم اللي الاسم ديالو كيبدا بـ `crte-app-shell-`.
- صلاحية النشر محصورة في GitHub Secret/Actions؛ ما تحطش Service Account JSON في HTML أو في ملفات `public`.

## ملاحظة على تسجيل دخول المسؤول
المصادقة Email/Password ديال Firebase ما كتمنحش بوحدها صلاحية نشر ملفات Hosting. هاد الحزمة كتخلي النشر للمسؤول اللي عندو صلاحية المستودع وGitHub Actions secret. هادي طريقة آمنة وبسيطة بلا ما نعرّض مفاتيح النشر داخل التطبيق.

## فحص النسخة
الملف المستقل `index_modifie_v2(1).html` أكبر ومختلف عن `index.html` داخل ZIP القديم؛ لذلك استعملنا الملف المستقل كمصدر للتطبيق، وما اعتمدناش ZIP القديم اللي فيه Service Worker أقدم.
