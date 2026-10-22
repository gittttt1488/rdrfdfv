# คู่มือการนำเกม Tovs Kavo World ขึ้น Google Play Store และเชื่อมต่อ Firebase

โปรเจกต์นี้ได้รับการปรับปรุงเรียบร้อยแล้ว:
1. **เปลี่ยนชื่อเกมเป็น "Tovs Kavo World"** (Package Name: `com.tovskavo.world`) เพื่อป้องกันการโดนปฏิเสธหรือระงับบัญชีจาก Google Play Store เรื่องเครื่องหมายการค้า
2. **เพิ่มระบบ Local & Firebase Game Adapter** (`lib/game-adapter.ts`) ทำให้ตัวเกมทำงานได้สมบูรณ์ 100% บนมือถือ Android รองรับการเล่นออฟไลน์ เซฟตัวละคร ห้อง มินิเกม 10 เกม เหรียญ และร้านค้าในเครื่องโดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ Cloudflare หรือ ChatGPT เดิม
3. **เตรียมไฟล์คอนฟิกสำหรับ Google Firebase และ Capacitor** เพื่อพร้อมสำหรับคอมไพล์เป็น APK / AAB ทันที

---

## วิธีที่ 1: สร้างไฟล์ APK / AAB ด้วย Capacitor + Android Studio (แนะนำที่สุด)

วิธีนี้เหมาะสำหรับสร้างเป็นแอปพลิเคชันแบบ Native บน Android เล่นออฟไลน์ได้ 100%

### ขั้นตอนที่ 1: ติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์โปรเจกต์:
```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### ขั้นตอนที่ 2: Build โปรเจกต์เว็บ
```bash
npm run build
```

### ขั้นตอนที่ 3: เพิ่ม Android Platform และเปิดใน Android Studio
```bash
npx cap add android
npx cap open android
```

### ขั้นตอนที่ 4: สร้างไฟล์สำหรับ Play Store
1. ใน Android Studio ให้รอ Gradle Sync จนเสร็จสมบูรณ์
2. ไปที่เมนูด้านบน: **Build** > **Generate Signed Bundle / APK...**
3. เลือก **Android App Bundle (.aab)** สำหรับส่งขึ้น Google Play Store (หรือเลือก **APK** หากต้องการนำไปติดตั้งทดสอบในมือถือโดยตรง)
4. สร้าง KeyStore (หรือเลือกไฟล์คีย์ที่มีอยู่) แล้วกด **Create**
5. คุณจะได้ไฟล์ `.aab` พร้อมอัปโหลดขึ้น Google Play Console ทันที

---

## วิธีที่ 2: ดีพลอยขึ้น Google Firebase + สร้าง AAB ด้วย Bubblewrap (TWA)

หากต้องการให้ตัวเกมรันอยู่บน Google Cloud / Firebase และเปิดเล่นผ่านเว็บหรือแพ็กเป็นแอป Play Store:

### ขั้นตอนที่ 1: สร้างโปรเจกต์ใน Firebase Console
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. กด **Create a project** และตั้งชื่อโปรเจกต์ เช่น `tovs-kavo-world`
3. เปิดใช้งาน **Hosting** และ **Firestore Database** (โหมดทดสอบ)

### ขั้นตอนที่ 2: ดีพลอยเว็บขึ้น Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# เลือก Use an existing project -> เลือก tovs-kavo-world
# Public directory: dist
# Configure as a single-page app: Yes
firebase deploy
```
คุณจะได้ URL เว็บไซต์ เช่น `https://tovs-kavo-world.web.app`

### ขั้นตอนที่ 3: แปลงเป็น Google Play Store ด้วย Bubblewrap
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://tovs-kavo-world.web.app/manifest.json
bubblewrap build
```
คำสั่งนี้จะสร้างไฟล์ `app-release-bundle.aab` ให้อัตโนมัติ

---

## สิ่งสำคัญในการส่งตรวจที่ Google Play Console

1. **Category:** Games > Simulation หรือ Casual (ครอบครัว / เด็ก)
2. **Target Audience (กลุ่มเป้าหมาย):** 
   - หากเลือกเด็กอายุต่ำกว่า 13 ปี ต้องเข้าร่วมโครงการ **Designed for Families**
   - ต้องแนบลิงก์ **Privacy Policy** (นโยบายความเป็นส่วนตัว) ที่ระบุว่าไม่มีการเก็บข้อมูลส่วนตัวของเด็ก
3. **รูปภาพที่ต้องเตรียม:**
   - App Icon: 512 x 512 px (PNG 32-bit)
   - Feature Graphic: 1024 x 500 px (PNG หรือ JPEG)
   - ภาพหน้าจอ (Screenshots) ในเกมอย่างน้อย 4 ภาพ
