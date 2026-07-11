# باغچه‌ی من — راه‌اندازی و ساخت اپ اندروید

## فایل‌ها
- `index.html` — خود اپ (Jalali calendar، localStorage، هشدار مرورگری، و پل ارتباطی به Kodular)
- `manifest.json` — برای نصب‌شدنی کردن اپ روی گوشی (PWA)
- `sw.js` — سرویس ورکر، برای کارکرد آفلاین
- `icon.svg` — آیکون فعلی (جایگزینش کن با فایل export شده از Canva اگه خواستی)

---

## مرحله‌ی ۱: هاست کردن (دقیقاً مثل homogen-app)

۱. یه ریپوی گیت‌هاب جدید بساز، مثلاً `plant-care-app`.
۲. هر ۴ فایل بالا رو تو ریشه‌ی همون ریپو آپلود کن (کنار هم، توی یه پوشه).
۳. لینک خام رو از githack بگیر:

```
https://rawcdn.githack.com/USERNAME/plant-care-app/main/index.html
```

۴. لینک رو تو مرورگر گوشی باز کن و مطمئن شو همه‌چیز درست کار می‌کنه (گیاه اضافه کن، تاریخ شمسی رو چک کن).

---

## مرحله‌ی ۲: ساخت پروژه‌ی Kodular

۱. یه پروژه‌ی جدید بساز، اسمش رو بذار «باغچه من».
۲. از Palette این کامپوننت‌ها رو به Screen1 اضافه کن:
   - **WebViewer** (از دسته‌ی User Interface) — این همون چیزیه که HTML رو نشون می‌ده.
   - **Notifier** (از دسته‌ی User Interface) — برای هشدار داخل‌اپی.
   - **Clock** (از دسته‌ی Sensors) — TimerInterval رو بذار روی ۶۰۰۰۰ (هر ۱ دقیقه)، TimerEnabled = true.
   - **TinyDB** (از دسته‌ی Storage) — برای اینکه یادش بمونه کدوم هشدار رو قبلاً نشون داده و دوباره تکرار نکنه.
3. تو Properties کامپوننت WebViewer:
   - `HomeUrl` / `Source` = همون لینک githack بالا
   - `UsesLocation` = false
   - اگه گزینه‌ی جاوااسکریپت هست (`JavaScriptEnabled` یا مشابه) حتماً روشنش کن.

### بلوک‌ها (Blocks)

**when Screen1.Initialize**
```
call WebViewer1.GoToUrl  url: "لینک githack"
```

**when Clock1.Timer** (هر ۱ دقیقه اجرا می‌شه)
```
set jsonStr to  WebViewer1.WebViewString
if  jsonStr ≠ ""  then
    set scheduleList to  Web1.JsonTextDecodeWithDictionaries(jsonStr)   // این بلوک تو دسته‌ی Web هست، نیازی به کامپوننت Web نداره فقط از drawer اون میاد
    for each item in scheduleList:
        if  get item "overdue" = true  then
            set taskKey to  join(get item "taskId", "-", get item "nextDue")
            if  TinyDB1.GetValue(taskKey, "") = ""  then
                call Notifier1.ShowAlert  (یا ShowMessageDialog)  با متن:
                     join("وقت ", get item "taskLabel", " برای ", get item "plantName", " شد 🌱")
                call TinyDB1.StoreValue  tag: taskKey   valueToStore: "1"
```

این دقیقاً از داده‌ای استفاده می‌کنه که خود `index.html` هر بار رندر، خودکار توش می‌ذاره (`window.AppInventor.setWebViewString(...)`) — یعنی لازم نیست چیزی تو HTML عوض کنی، فقط تو Kodular بلوک‌های بالا رو بساز.

⚠️ محدودیت این روش: چون از Clock استفاده می‌کنیم، فقط تا وقتی اپ باز یا در پس‌زمینه‌ی نزدیک (نه کاملاً kill‌شده) هست کار می‌کنه — دقیقاً مثل قبل، نه یه AlarmManager واقعی.

---

## مرحله‌ی ۳ (اختیاری، برای هشدار واقعی حتی با اپ کاملاً بسته)

اگه خواستی هشدار حتی وقتی اپ رو کامل بستی هم کار کنه، باید یه Extension مثل **Taifun's LocalNotification** (رایگان، معروف تو کامیونیتی Kodular/App Inventor) اضافه کنی. این extension با AlarmManager اندروید کار می‌کنه، یعنی مستقل از این‌که اپ روشنه یا نه، سر وقت هشدار می‌ده.
منطقش: همون `scheduleList` که از WebViewString گرفتیم رو، به‌جای Notifier، به بلوک `LocalNotification1.AlarmSchedule` با زمان `nextDue` هر تسک می‌دیم. اگه به این مرحله رسیدی و خواستی، دقیق‌تر با بلوک‌های همین extension قدم‌به‌قدم پیش می‌ریم.

---

## مرحله‌ی ۴: آیکون و اسم اپ
- تو Project Properties، Icon رو بذار روی فایل PNG که از Canva دانلود کردی (یا از `icon.svg` یه اسکرین‌شات/اکسپورت بگیر).
- `AppName` = «باغچه من»
- `PackageName` رو یکتا انتخاب کن (مثلاً `com.samsakian4.baghche`)

## مرحله‌ی ۵: Build
از منوی Build گزینه‌ی APK رو بزن، دانلودش کن، رو گوشیت نصب کن.

---

## لینک‌های آیکون Canva
- https://www.canva.com/d/CzW8_wt0cOhkGkL
- https://www.canva.com/d/P_GXINFHpfcUjok
- https://www.canva.com/d/G7h-RygWUoFw0rV
- https://www.canva.com/d/qQAc9y6MsNlN4aN
