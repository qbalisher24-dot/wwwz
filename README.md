# WWWZ.UZ — Subdomen Backend (1-qadam)

## Papka tuzilishi
```
wwwz-backend/
├── server.js       ← backend logikasi (subdomenni aniqlash)
├── vercel.json      ← Vercel konfiguratsiyasi
├── package.json
└── public/
    └── index.html   ← sizning frontendingiz (asosiy wwwz.uz sahifasi)
```

## Qanday ishlaydi
1. `wwwz.uz` ga kirilsa → oddiy `public/index.html` (sizning frontend) ko'rsatiladi.
2. `HAR-QANDAY-NOM.wwwz.uz` ga kirilsa → backend Host headerdan
   subdomenni o'qib, "subdomen ishladi" sahifasini avtomatik chiqaradi.
3. Yangi subdomen uchun **hech qanday qo'shimcha sozlash kerak emas** —
   chunki DNS darajasida wildcard (`*.wwwz.uz`) sozlangan bo'lgani uchun
   barcha subdomenlar avtomatik shu loyihaga kelaveradi.

## Deploy qilish (Vercel)

### 1) Loyihani Vercel'ga joylash
```bash
npm install -g vercel
cd wwwz-backend
vercel
```
yoki GitHub repo orqali Vercel Dashboard'dan import qiling.

### 2) Wildcard domenni ulash (ENG MUHIM QADAM)
Vercel Dashboard → sizning loyihangiz → **Settings → Domains** →
`*.wwwz.uz` ni kiriting va qo'shing.

Keyin domen provayderingizda (masalan wwwz.uz ni qayerdan sotib olgan
bo'lsangiz o'sha joyda, masalan Cloudflare/Namecheap) DNS bo'limiga
quyidagi yozuvni qo'shing — Vercel buni domen qo'shganingizda o'zi
ko'rsatib beradi (odatda shunday bo'ladi):

```
Turi:   CNAME
Nom:    *
Qiymat: cname.vercel-dns.com
```

Agar asosiy `wwwz.uz` (root, www siz) uchun ham kerak bo'lsa, uni ham
alohida qo'shishingiz kerak (Vercel A record beradi, masalan `76.76.21.21`).

### 3) Tekshirish
DNS tarqalishi (odatda bir necha daqiqadan bir necha soatgacha) tugagach:
- `https://wwwz.uz` → sizning frontend sahifangiz
- `https://test123.wwwz.uz` → "subdomen ishladi" sahifasi chiqishi kerak

## Local test qilish
```bash
npm install
npm start
```
Keyin brauzerda `http://localhost:3000` — lekin subdomen (`Host` header)
faqat haqiqiy domenda ishlaganda to'g'ri ishlaydi. Local'da subdomenni
test qilish uchun `hosts` faylingizga qo'shing:
```
127.0.0.1 test.wwwz.uz
```
va `http://test.wwwz.uz:3000` ga kiring.

## Keyingi qadamlar (kelgusida)
- Foydalanuvchi formadan subdomen so'raganda, uni ma'lumotlar bazasiga
  (masalan MongoDB/Postgres/Redis) yozib qo'yish.
- Har bir subdomen uchun foydalanuvchi tanlagan tarkib/sahifani ko'rsatish.
- Band nomlarni tekshirish endpointini frontend bilan bog'lash
  (`btnCheck` tugmasi hozir faqat tasodifiy simulyatsiya qiladi).
