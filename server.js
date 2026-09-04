/**
 * WWWZ.UZ — 1-QADAM: ENG SODDA SUBDOMEN BACKEND
 * ------------------------------------------------
 * G'OYA:
 *   Vercel loyihangizga BITTA marta "*.wwwz.uz" (wildcard) domenini
 *   qo'shasiz. Shundan keyin foydalanuvchi qanday nom yozmasin
 *   (masalan: ali.wwwz.uz, shop.wwwz.uz), so'rov baribir shu
 *   loyihaga keladi. Backend vazifasi — HTTP so'rovdagi "Host"
 *   headeridan subdomen nomini ajratib olib, mos sahifani ko'rsatish.
 *
 *   Bu bosqichda ma'lumotlar bazasi yo'q — faqat asosiy domendan
 *   subdomenni ajratish va "subdomen ishladi" degan tasdiq sahifasini
 *   chiqarish. Keyingi qadamlarda (ro'yxatdan o'tkazish, DB, DNS
 *   yozuvlari va h.k.) shu asos ustiga qo'shiladi.
 */

const express = require('express');
const app = express();

// Asosiy domeningiz (kerak bo'lsa .env orqali o'zgartiring)
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'wwwz.uz';
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Host headerdan subdomenni ajratib oluvchi yordamchi funksiya.
 * Masalan: "ali.wwwz.uz" -> "ali"
 *          "wwwz.uz"     -> null (asosiy domen, subdomen emas)
 *          "www.wwwz.uz" -> null ("www" ni asosiy sayt deb hisoblaymiz)
 */
function extractSubdomain(host) {
    if (!host) return null;

    // Portni olib tashlash (masalan localhost:3000)
    const hostname = host.split(':')[0].toLowerCase();

    // Local test uchun: agar ROOT_DOMAIN hostnameda umuman bo'lmasa
    if (!hostname.endsWith(ROOT_DOMAIN)) return null;

    const withoutRoot = hostname.slice(0, -1 * (ROOT_DOMAIN.length + 1)); // ".wwwz.uz" ni olib tashlash
    if (!withoutRoot || withoutRoot === 'www') return null;

    return withoutRoot;
}

/**
 * MIDDLEWARE: har bir so'rovda subdomenni tekshiradi.
 * Agar subdomen mavjud bo'lsa — "ishladi" sahifasini ko'rsatadi.
 * Agar subdomen yo'q bo'lsa (asosiy wwwz.uz) — keyingi handlerlarga o'tadi
 * (ya'ni sizning index.html frontendingiz ko'rsatiladi).
 */
app.use((req, res, next) => {
    const subdomain = extractSubdomain(req.headers.host);

    if (!subdomain) {
        return next(); // asosiy sayt — frontendga o'tkazamiz
    }

    // --- Bu yerda kelajakda: subdomen ma'lumotlar bazasida bor-yo'qligini
    // --- tekshirish, egasiga tegishli sahifani chiqarish va hokazo bo'ladi.
    // --- Hozircha 1-QADAM: shunchaki tasdiqlovchi sahifa.

    res.status(200).send(renderSubdomainPage(subdomain));
});

// Bu yerga faqat subdomen bo'lmagan (asosiy wwwz.uz) so'rovlar yetib keladi
app.use(express.static('public'));

function renderSubdomainPage(subdomain) {
    return `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subdomain}.${ROOT_DOMAIN}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    background:#0a0a0a; color:#fff;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    text-align:center;
  }
  .box { padding:2rem; }
  .badge {
    display:inline-flex; align-items:center; gap:.5rem;
    background:#16a34a22; color:#22c55e;
    border:1px solid #22c55e44;
    padding:.5rem 1rem; border-radius:999px;
    font-size:.85rem; font-weight:600; margin-bottom:1.5rem;
  }
  .dot { width:8px; height:8px; border-radius:50%; background:#22c55e; }
  h1 { font-size:2rem; margin-bottom:.5rem; }
  p { color:#a1a1aa; font-size:1rem; }
  code {
    font-family:'JetBrains Mono',monospace;
    background:#1c1c1c; padding:.2rem .6rem; border-radius:6px;
    color:#fff;
  }
</style>
</head>
<body>
  <div class="box">
    <div class="badge"><span class="dot"></span> Subdomen faol</div>
    <h1>subdomen ishladi 🎉</h1>
    <p><code>${subdomain}.${ROOT_DOMAIN}</code> muvaffaqiyatli ishlayapti.</p>
  </div>
</body>
</html>`;
}

// Sog'lik tekshiruvi (Vercel/monitoring uchun foydali)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', rootDomain: ROOT_DOMAIN });
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
    console.log(`ROOT_DOMAIN = ${ROOT_DOMAIN}`);
});

module.exports = app;
