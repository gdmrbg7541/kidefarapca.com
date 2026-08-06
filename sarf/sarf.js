/* =========================================================
   FIREBASE AYAR BLOĞU — DOLU, DEĞİŞTİRMENE GEREK YOK
   ---------------------------------------------------------
   Sağ üstteki "اِتَّصِلْ" rozeti (Dijital Yarışma) Firestore
   üzerinden çalışır. Aşağıdaki değerler senin kendi Firebase
   projenden alındı:

       Proje  : sarf-ddee5   ("Sarf", Spark plan)
       Kaynak : Firebase Console → ⚙ Project settings
                → Your apps → sarf (web) → SDK setup → Config

   Bu apiKey GİZLİ BİR ŞİFRE DEĞİLDİR. Firebase'in web anahtarları
   tasarım gereği tarayıcıya açıktır; veriyi koruyan şey anahtar
   değil, aşağıda anlatılan güvenlik kurallarıdır. Dosyayı
   öğrencilerle paylaşmanda bir sakınca yok.

   Başka bir projeye taşımak istersen: o projede bir web app kaydet,
   çıkan Config bloğundaki değerleri buraya yapıştır ve güvenlik
   kurallarını da o projeye ekle. apiKey boşaltılırsa yarışma
   rozeti açılır ama içeride "ayar yapılmamış" uyarısı görünür;
   diğer üç oyun bundan hiç etkilenmez, internetsiz de çalışır.

   SARF_KOLEKSIYON : Firestore'da odaların yazılacağı koleksiyon
                     adı. Aynı veritabanını başka bir oyunla
                     paylaşacaksan sadece bu satırı değiştir.

   GÜVENLİK KURALLARI: yanındaki "firestore.rules" dosyasının içeriği
   Firebase Console → Firestore Database → Rules ekranına yapıştırılıp
   Publish edilmiş olmalı. Kurallar yalnızca sarfYarismasi koleksiyonunu
   açar ve 1 Eylül 2027'de kendiliğinden kapanır (tarihi ileri alabilirsin).
========================================================= */
const SARF_FIREBASE_CONFIG = {
    apiKey:            "AIzaSyAu0jie2Av9AZOwh6B2GEHVpSwtAQa0cX4",
    authDomain:        "sarf-ddee5.firebaseapp.com",
    projectId:         "sarf-ddee5",
    storageBucket:     "sarf-ddee5.firebasestorage.app",
    messagingSenderId: "379852586048",
    appId:             "1:379852586048:web:5fedce66a3e3d1bc9c33a5"
};
const SARF_KOLEKSIYON  = "sarfYarismasi";   // Firestore koleksiyon adı
const SARF_SORU_SURESI = 30;                // her sorunun süresi (saniye)
const SARF_TEMEL_PUAN  = 100;               // doğru cevabın taban puanı
const SARF_HIZ_PUAN    = 50;                // hız bonusunun üst sınırı
/* ===================== AYAR BLOĞU BİTTİ ===================== */

/* =========================================================
   VERİ (DATA) — Kökler, türeyen kelimeler, kalıplar
========================================================= */
const ROOTS_GAME1 = [
    {
        root: "د ر س",
        targets: [
            { emoji:"👨‍🏫", word:"مُدَرِّس" },
            { emoji:"🏫",  word:"مَدْرَسَة" },
            { emoji:"📖",  word:"دَرْس" },
            { emoji:"📚",  word:"دُروس" }
        ]
    },
    {
        root: "ع ل م",
        targets: [
            { emoji:"🧑‍🏫", word:"مُعَلِّم" },
            { emoji:"🎓",  word:"عالِم" },
            { emoji:"📘",  word:"عِلْم" },
            { emoji:"✅",  word:"مَعْلوم" }
        ]
    },
    {
        root: "ك ت ب",
        targets: [
            { emoji:"✍️",  word:"كاتِب" },
            { emoji:"📖",  word:"كِتاب" },
            { emoji:"🏛️",  word:"مَكْتَبَة" },
            { emoji:"✉️",  word:"مَكْتوب" }
        ]
    },
    {
        root: "س ل م",
        targets: [
            { emoji:"🙋",  word:"سالِم" },
            { emoji:"💚",  word:"سَليم" },
            { emoji:"🤲",  word:"مُسْلِم" },
            { emoji:"☪️",  word:"إسْلام" },
            { emoji:"🤝",  word:"تَسْليم" }
        ]
    },
    {
        root: "ف ك ر",
        targets: [
            { emoji:"🧠",  word:"فِكْر" },
            { emoji:"💡",  word:"فِكْرَة" },
            { emoji:"🧘",  word:"تَفَكُّر" },
            { emoji:"💭",  word:"أَفْكار" }
        ]
    },
    {
        root: "ع ر ف",
        targets: [
            { emoji:"🧓",  word:"عارِف" },
            { emoji:"📝",  word:"تَعْريف" },
            { emoji:"🔍",  word:"مَعْرِفَة" },
            { emoji:"🕯️",  word:"عِرْفان" },
            { emoji:"📜",  word:"عُرْف" }
        ]
    }
];

/* Oyun 2 üç tura bölündü; her tur 5 kelime. Kelimeler yalnızca
   öğretmenin verdiği listeden seçildi. 1. tur "مَ" zaid, 2. tur
   "مُ/تَ" zaid, 3. tur ise ح م د + ق د ر ailesi (iki kök, beş kelime). */
/* ---------- FİİL ÇEKİMİ (yalnızca oyun 1'deki kökler için) ----------
   Her kök, öğretmenin istediği bab'dan çekiliyor:
     I. bab  (sülâsî mücerred, فَعَلَ)  → د ر س , ك ت ب
     II. bab (فَعَّلَ, şeddeli)          → س ل م , ف ك ر , ع ر ف
     V. bab  (تَفَعَّلَ, başta zaid تَ)   → ع ل م
   60 kelimeyi tek tek yazmak yerine her bab için mâzî/muzâri gövdesi,
   muzâri ön ekinin harekesi ve emirdeki vasıl hemzesi tarif ediliyor;
   gerisini buildConjugation üretiyor. Sülâsîde emir hemzesi muzâri
   harekesine göre damme (يَكْتُبُ → اُكْتُبْ) ya da kesre (يَعْلَمُ → اِعْلَمْ)
   alır; II. ve V. babda gövde zaten harekeli başladığı için vasıl
   hemzesi YOKTUR (سَلِّمْ , تَعَلَّمْ). */
const FATHA = '\u064E', DAMMA = '\u064F', KASRA = '\u0650', SUKUN = '\u0652';
const SHADDA = '\u0651';
const HARAKA = { a: FATHA, u: DAMMA, i: KASRA };

const VERB_FORMS = {
    "د ر س": { bab: 'I',  past: 'a', pres: 'u' },  // دَرَسَ  – يَدْرُسُ   – اُدْرُسْ
    "ك ت ب": { bab: 'I',  past: 'a', pres: 'u' },  // كَتَبَ  – يَكْتُبُ   – اُكْتُبْ
    "ع ل م": { bab: 'V' },                          // تَعَلَّمَ – يَتَعَلَّمُ – تَعَلَّمْ
    "س ل م": { bab: 'II' },                         // سَلَّمَ  – يُسَلِّمُ  – سَلِّمْ
    "ف ك ر": { bab: 'II' },                         // فَكَّرَ  – يُفَكِّرُ  – فَكِّرْ
    "ع ر ف": { bab: 'II' }                          // عَرَّفَ  – يُعَرِّفُ  – عَرِّفْ
};

function buildConjugation(root) {
    const v = VERB_FORMS[root];
    if (!v) return null;
    const p = root.split(' ');
    if (p.length !== 3) return null;
    const f = p[0], a = p[1], l = p[2];

    /* madiStem / mudStem : son kök harfinden ÖNCEKİ kısım.
       onEk  : muzâri ön ekinin (أ ت ي) harekesi.
       wasl  : emirde başa gelen vasıl hemzesi ('' ise hiç gelmez). */
    let madiStem, mudStem, onEk, wasl;
    if (v.bab === 'II') {
        madiStem = f + FATHA + a + SHADDA + FATHA;                 // سَلَّ
        mudStem  = f + FATHA + a + SHADDA + KASRA;                 // سَلِّ
        onEk     = DAMMA;                                          // يُسَلِّمُ
        wasl     = '';                                             // سَلِّمْ
    } else if (v.bab === 'V') {
        madiStem = 'ت' + FATHA + f + FATHA + a + SHADDA + FATHA;   // تَعَلَّ
        mudStem  = madiStem;                                       // يَتَعَلَّمُ
        onEk     = FATHA;
        wasl     = '';                                             // تَعَلَّمْ
    } else {
        madiStem = f + FATHA + a + HARAKA[v.past];                 // كَتَ
        mudStem  = f + SUKUN + a + HARAKA[v.pres];                 // كْتُ
        onEk     = FATHA;
        wasl     = 'ا' + (v.pres === 'u' ? DAMMA : KASRA);         // اُ / اِ
    }
    return {
        madi: [
            ['أَنا',   madiStem + l + SUKUN + 'ت' + DAMMA],
            ['أَنْتَ', madiStem + l + SUKUN + 'ت' + FATHA],
            ['أَنْتِ', madiStem + l + SUKUN + 'ت' + KASRA],
            ['هُوَ',   madiStem + l + FATHA],
            ['هِيَ',   madiStem + l + FATHA + 'ت' + SUKUN]
        ],
        mudari: [
            ['أَنا',   'أ' + onEk + mudStem + l + DAMMA],
            ['أَنْتَ', 'ت' + onEk + mudStem + l + DAMMA],
            ['أَنْتِ', 'ت' + onEk + mudStem + l + 'ين' + FATHA],
            ['هُوَ',   'ي' + onEk + mudStem + l + DAMMA],
            ['هِيَ',   'ت' + onEk + mudStem + l + DAMMA]
        ],
        /* Emir yalnızca muhataba (أَنْتَ / أَنْتِ) yapılır; diğer üç zamirde çekim
           YOKTUR. Tablo yine de 5 satır basılıyor (null = tire), ki üç zamanın
           satırları birebir aynı hizada dursun. */
        amr: [
            ['أَنا',   null],
            ['أَنْتَ', wasl + mudStem + l + SUKUN],
            ['أَنْتِ', wasl + mudStem + l + 'ي'],
            ['هُوَ',   null],
            ['هِيَ',   null]
        ]
    };
}

/* Birleşik fabrika (revizyon 50): her turun 5 kelimesi 5 FARKLI kökten
   gelir ve her kökün atölyede en az iki vezin karşılığı vardır; böylece
   öğütülen her külçe ustanın elinde mutlaka yeni bir kelimeye dönüşebilir. */
const GAME2_ROUNDS = [
    [
        { word:"مَكْتَب",   root:"ك ت ب" },
        { word:"مُحْتَرَم",  root:"ح ر م" },
        { word:"مَحْمود",   root:"ح م د" },
        { word:"مَدْرَسَة",  root:"د ر س" },
        { word:"عُلوم",     root:"ع ل م" }
    ],
    [
        { word:"مُقْتَدِر",  root:"ق د ر" },
        { word:"سَلام",     root:"س ل م" },
        { word:"عالَم",     root:"ع ل م" },
        { word:"مُحَمَّد",   root:"ح م د" },
        { word:"كِتاب",     root:"ك ت ب" }
    ],
    [
        { word:"أَحْمَد",    root:"ح م د" },
        { word:"قُدْرَة",    root:"ق د ر" },
        { word:"دُروس",     root:"د ر س" },
        { word:"حَرام",     root:"ح ر م" },
        { word:"عُلَماء",    root:"ع ل م" }
    ]
];

/* Oyun 3 atölyesi: örs ipucu (boş kalıba silik çizilir) ve çekiçli usta.
   Usta tek parça SVG'dir; sadece .usta-kol grubu (omuzdan itibaren kol + çekiç)
   CSS ile döner. Dış <g> konumlandırır, iç <g> animasyon alır — böylece CSS
   transform'u SVG konum transform'unu ezmez. */
const G3_ORS_SVG = `
<svg viewBox="0 0 120 74" class="g3-ors-cizim" aria-hidden="true">
  <path d="M14,18 L106,18 L106,30 C92,34 84,40 80,48 L74,48 L74,56 L84,66 L36,66 L46,56 L46,48 L40,48 C34,38 24,32 14,30 Z"
        fill="none" stroke="#6f7d8c" stroke-width="5" stroke-linejoin="round"/>
</svg>`;

const G3_USTA_SVG = `
<svg viewBox="0 0 160 190" class="g3-usta-cizim" aria-hidden="true">
  <!-- gövde: teal gömlek + deri önlük -->
  <path d="M48,74 Q70,60 92,74 L96,96 L44,96 Z" fill="#16A085"/>
  <!-- bacaklar + ayakkabılar (önlüğün altından görünür) -->
  <rect x="53" y="160" width="14" height="24" rx="5" fill="#34495e"/>
  <rect x="75" y="160" width="14" height="24" rx="5" fill="#34495e"/>
  <rect x="53" y="179" width="23" height="8" rx="4" fill="#2c3e50"/>
  <rect x="75" y="179" width="23" height="8" rx="4" fill="#2c3e50"/>
  <path d="M46,86 L94,86 L102,168 L38,168 Z" fill="#8a5a2c"/>
  <path d="M56,86 L60,66 M84,86 L80,66" stroke="#6f4621" stroke-width="6" stroke-linecap="round" fill="none"/>
  <rect x="40" y="122" width="60" height="9" rx="4" fill="#6f4621"/>
  <rect x="56" y="138" width="28" height="20" rx="5" fill="#a9743f"/>
  <!-- baş: kasketli, bıyıklı güleç usta -->
  <circle cx="70" cy="40" r="17" fill="#f6c9a0"/>
  <path d="M52,36 Q54,20 70,20 Q86,20 88,34 L94,36 Q94,41 88,40 Q70,34 52,38 Z" fill="#8a5a2c"/>
  <circle cx="77" cy="39" r="2.2" fill="#2c3e50"/>
  <path d="M70,49 Q76,53 82,48" stroke="#b0713e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M72,45 Q77,48 82,44" stroke="#6f4621" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- uzak kol: maşayla örsü tutar -->
  <path d="M50,78 Q40,104 56,122" stroke="#127a66" stroke-width="11" fill="none" stroke-linecap="round"/>
  <circle cx="58" cy="124" r="6.5" fill="#f6c9a0"/>
  <path d="M62,126 L86,136 M62,129 L84,142" stroke="#7f8c8d" stroke-width="3.4" stroke-linecap="round"/>
  <!-- yakın kol + çekiç: omuz (92,80) etrafında döner -->
  <g transform="translate(92,80)">
    <g class="usta-kol">
      <path d="M0,0 Q16,-6 28,-20" stroke="#16A085" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="30" cy="-22" r="7" fill="#f6c9a0"/>
      <rect x="26" y="-27" width="40" height="8" rx="3.5" transform="rotate(-38 30 -22)" fill="#a9743f"/>
      <g transform="rotate(-38 30 -22)">
        <rect x="60" y="-38" width="16" height="30" rx="4" fill="#7f8c8d"/>
        <rect x="60" y="-38" width="16" height="9" rx="4" fill="#95a5a6"/>
      </g>
    </g>
  </g>
</svg>`;

/* Oyun 3'te türeyen her kelimenin anlamını sezdiren emoji.
   Kelime çıkış kutusunda kelimenin üzerinde büyükçe gösterilir. */
const GAME3_EMOJI = {
    "عالِم":"🎓", "كاتِب":"✍️", "سالِم":"🙋", "حامِد":"🙏", "قادِر":"💪",
    "مُدَرِّس":"👨‍🏫", "مُعَلِّم":"🧑‍🏫",
    "مَعْلوم":"✅", "مَكْتوب":"✉️", "مَحْمود":"👏", "مَحْروم":"😔",
    "مَدْروس":"📖", "مَقْدور":"🏋️",
    "تَسْليم":"🤝", "تَدْريس":"📚", "تَقْدير":"🏅",
    "تَعْليم":"📘", "تَحْميد":"📿", "تَحْريم":"⛔"
};

/* Dört vezin (revizyon 50: تَفْعيل eklendi ve مَفْعول genişletildi) —
   böylece öğütücüden çıkan HER kökün en az iki vezin seçeneği olur. */
const GAME3_PATTERNS = [
    {
        name: "فاعِل",
        zaid: [1], // ا (elif)
        map: { "ع ل م":"عالِم", "ك ت ب":"كاتِب", "س ل م":"سالِم", "ح م د":"حامِد", "ق د ر":"قادِر" }
    },
    {
        name: "مُفَعِّل",
        zaid: [0], // م
        map: { "د ر س":"مُدَرِّس", "ع ل م":"مُعَلِّم" }
    },
    {
        name: "مَفْعول",
        zaid: [0, 3], // م و
        map: { "ع ل م":"مَعْلوم", "ك ت ب":"مَكْتوب", "ح م د":"مَحْمود", "ح ر م":"مَحْروم", "د ر س":"مَدْروس", "ق د ر":"مَقْدور" }
    },
    {
        name: "تَفْعيل",
        zaid: [0, 3], // ت ي
        map: { "س ل م":"تَسْليم", "د ر س":"تَدْريس", "ق د ر":"تَقْدير", "ع ل م":"تَعْليم", "ح م د":"تَحْميد", "ح ر م":"تَحْريم" }
    }
];

/* =========================================================
   Kök harflerini "bitişik" (harf bağlantı) biçiminde göstermek
   için yardımcı fonksiyon — veri anahtarları (eşleşme/lookup)
   değişmeden kalır, sadece EKRANDA GÖSTERİLEN metin biçimlenir.
   Örn: "ك ت ب" -> "كـ ـتـ ـب", "د ر س" -> "د ر س" (bağlanmaz).
========================================================= */
const NON_CONNECTOR_LETTERS = new Set(['ا', 'أ', 'إ', 'آ', 'ٱ', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ']);
function formatRootDisplay(root) {
    const letters = root.split(' ').filter(Boolean);
    return letters.map((letter, i) => {
        const prevConnects = i > 0 && !NON_CONNECTOR_LETTERS.has(letters[i - 1]);
        const nextConnects = i < letters.length - 1 && !NON_CONNECTOR_LETTERS.has(letter);
        let out = letter;
        if (prevConnects) out = 'ـ' + out;
        if (nextConnects) out = out + 'ـ';
        return out;
    }).join(' ');
}

/* =========================================================
   HER KÖKE AYRI RENK — üç oyunda da aynı kök aynı renkle görünür,
   böylece öğrenci kökü renginden de tanıyabilir.
   Kırmızı (zaid harfler) ve yeşil (doğru cevap) bilinçli olarak
   palete alınmadı; karışmasın.
========================================================= */
const ROOT_COLORS = {
    "د ر س": ["#7c3aed", "#a78bfa"], // mor
    "ع ل م": ["#0891b2", "#67e8f9"], // camgöbeği
    "ك ت ب": ["#1d4ed8", "#93c5fd"], // mavi
    "س ل م": ["#d97706", "#fcd34d"], // kehribar
    "ح م د": ["#047857", "#6ee7b7"], // zümrüt
    "ح ر م": ["#c026d3", "#f0abfc"], // fuşya
    "ق د ر": ["#92400e", "#e0ac82"], // bronz
    "ج ل س": ["#4338ca", "#a5b4fc"], // çivit
    "س ج د": ["#0f766e", "#5eead4"], // petrol
    "ف ك ر": ["#be185d", "#fbcfe8"], // gül
    "ع ر ف": ["#0369a1", "#7dd3fc"]  // gök mavisi
};
const DEFAULT_ROOT_COLOR = ["#7c3aed", "#a78bfa"];
/* Tanımlı listede olmayan kökler için renk havuzu: rastgele gelen HER kök
   de kendi rengini alır (oturum boyunca aynı kalır). */
const RASTGELE_RENKLER = [
    ["#0e7490", "#67e8f9"], ["#b45309", "#fcd34d"], ["#15803d", "#86efac"],
    ["#be123c", "#fda4af"], ["#6d28d9", "#c4b5fd"], ["#0369a1", "#7dd3fc"],
    ["#a16207", "#fde68a"], ["#065f46", "#6ee7b7"], ["#9d174d", "#f9a8d4"],
    ["#4338ca", "#a5b4fc"], ["#c2410c", "#fdba74"], ["#0f766e", "#5eead4"]
];
const rastgeleRenkCache = {};
function rootColors(root) {
    if (ROOT_COLORS[root]) return ROOT_COLORS[root];
    if (!rastgeleRenkCache[root]) {
        let h = 0;
        for (const ch of root) h = (h * 31 + ch.charCodeAt(0)) % 9973;
        rastgeleRenkCache[root] = RASTGELE_RENKLER[h % RASTGELE_RENKLER.length];
    }
    return rastgeleRenkCache[root];
}
function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
/* Dolu (gradyanlı) kutular: kök çipleri, sürükleme hayaletleri. */
function paintRootChip(el, root) {
    const [dark, light] = rootColors(root);
    el.style.background = `linear-gradient(135deg, ${dark}, ${light})`;
    el.style.boxShadow = `0 8px 22px ${hexToRgba(dark, .35)}`;
}
/* Açık zeminli kutular (hedef hücreler, oyun 3 çıkış kutusu): rengi CSS
   değişkeniyle veriyoruz ki durum sınıfları (".solved", ".filled") normal
   şekilde üzerine yazabilsin — satır içi stil verilseydi hiçbir sınıf onu
   geçemezdi.
   --root-line/--root-fill : boş (henüz çözülmemiş) hâl, soluk
   --root-solid/--root-tint: çözülmüş/dolmuş hâl, belirgin
   Çözülen kutu ARTIK YEŞİLE DÖNMÜYOR; kökün kendi rengini koruyor, böylece
   türetilmiş kelime de ait olduğu kökün renginden tanınabiliyor. */
function paintRootOutline(el, root) {
    const [dark] = rootColors(root);
    el.style.setProperty('--root-line', hexToRgba(dark, .55));
    el.style.setProperty('--root-fill', hexToRgba(dark, .06));
    el.style.setProperty('--root-solid', dark);
    el.style.setProperty('--root-tint', hexToRgba(dark, .10));
}
/* İnce çerçeveli rozetler: oyun 2'deki kök sonuç kutuları. */
function paintRootBadge(el, root) {
    const [dark] = rootColors(root);
    el.style.borderColor = dark;
    el.style.background = hexToRgba(dark, .08);
    el.style.color = dark;
}

/* =========================================================
   Kalıp (vezin) adını harf kümelerine (harf + üzerindeki harekeler)
   ayırıp, kökten gelmeyen "zaid" harfleri kırmızı renkte gösteren
   yardımcı fonksiyon. pattern.zaid, harf kümesi index'lerini tutar
   (ör. مَفْعول -> [مَ, فْ, ع, و, ل] -> zaid: [0,3] -> م ve و kırmızı).
========================================================= */
const ARABIC_COMBINING_MARK = /[\u064B-\u065F\u0670]/;
function splitArabicClusters(str) {
    const clusters = [];
    for (const ch of str) {
        if (ARABIC_COMBINING_MARK.test(ch) && clusters.length) {
            clusters[clusters.length - 1] += ch;
        } else {
            clusters.push(ch);
        }
    }
    return clusters;
}
/* Zaid harfi <span> içine almak, tarayıcının Arapça harf birleştirmesini
   (contextual shaping) eleman sınırında kestiği için harfler kopuk görünür.
   Sınırın iki yanına ZWJ (U+200D) eklersek harfler yine birleşik biçimde
   çizilir. ZWJ yalnızca gerçekten birleşmesi gereken yerlere eklenir:
   ا د ذ ر ز و ؤ kendinden sonraki harfe bağlanmaz, ء ise öncekine bağlanmaz. */
const ZWJ = '‍';
function formatZaidDisplay(text, zaid) {
    const clusters = splitArabicClusters(text);
    zaid = zaid || [];
    const bases = clusters.map(c => c[0]);
    const isZaid = (i) => zaid.includes(i);
    return clusters.map((c, i) => {
        // Bu kümenin komşusuyla arasında bir <span> sınırı oluşuyor mu?
        const breakPrev = i > 0 && isZaid(i) !== isZaid(i - 1);
        const breakNext = i < clusters.length - 1 && isZaid(i) !== isZaid(i + 1);
        // Arapça kurallarına göre gerçekten bağlanması gerekiyor mu?
        const linkPrev = i > 0 && !NON_CONNECTOR_LETTERS.has(bases[i - 1]) && bases[i] !== 'ء';
        const linkNext = i < clusters.length - 1 && !NON_CONNECTOR_LETTERS.has(bases[i]) && bases[i + 1] !== 'ء';
        let out = c;
        if (breakPrev && linkPrev) out = ZWJ + out;
        if (breakNext && linkNext) out = out + ZWJ;
        return isZaid(i) ? `<span class="zaid-letter">${out}</span>` : out;
    }).join('');
}
/* Kalıbın kendisi (ör. مَفْعول) ve o kalıptan türeyen kelime (ör. مَعْلوم) aynı
   harf-kümesi dizilimine sahip olduğu için, pattern.zaid index'leri her ikisinde
   de aynı harflere denk gelir; böylece türeyen kelimede de zaid harfler kırmızı
   gösterilebiliyor. */
function formatPatternDisplay(pattern) {
    return formatZaidDisplay(pattern.name, pattern.zaid);
}
function formatDerivedDisplay(word, pattern) {
    return formatZaidDisplay(word, pattern.zaid);
}
/* Kalıp bilgisi olmadan, kelimeyi kökle karşılaştırarak zaid harfleri bulur:
   kelimenin harf kümeleri sırayla gezilir, kök harfleriyle sırayla eşleşenler
   asli (kök) harf sayılır, eşleşmeyen her küme zaid'dir.
   Ör. مَدْرَسَة + "د ر س" -> [مَ,دْ,رَ,سَ,ة] -> zaid: مَ ve ة. */
function computeZaidIndices(word, root) {
    const clusters = splitArabicClusters(word);
    const rootLetters = root.split(' ').filter(Boolean);
    const zaid = [];
    let k = 0;
    clusters.forEach((c, i) => {
        if (k < rootLetters.length && c[0] === rootLetters[k]) k++;
        else zaid.push(i);
    });
    // Kök harflerinin tamamı bulunamadıysa güvenli tarafta kal: hiçbir harfi
    // kırmızıya boyama (yanlış bilgi vermektense renksiz göstermek yeğdir).
    return k === rootLetters.length ? zaid : [];
}
function formatWordVsRoot(word, root) {
    return formatZaidDisplay(word, computeZaidIndices(word, root));
}

/* =========================================================
   APP ÇEKİRDEĞİ — ekran geçişleri, ses, ortak yardımcılar
========================================================= */
const App = {
    dom: {},
    state: { audioCtx: null },

    init() {
        this.dom.screens = document.querySelectorAll('.screen');
        this.dom.doneOverlay = document.getElementById('done-overlay');

        /* Menü kartındaki fabrika önizlemesi: oyunun kendi SVG'leriyle
           mini sahne (vitrin + usta/örs + öğütücü makine). */
        const mf = document.getElementById('mfOnizleme');
        if (mf) {
            /* Canlı vitrin: öğütücü ile usta AYNI ANDA çalışır —
               kök külçesi huniye düşer, öğütülen harfler oluktan
               uçarak ustanın örsüne gider, usta durmadan döver. */
            mf.innerHTML =
                `<div class="mf-vitrin"><div class="mf-tente"></div><div class="mf-cam">✨</div></div>` +
                `<div class="mf-usta">${G3_USTA_SVG}<div class="mf-ors">${G2_ORS2_SVG}</div></div>` +
                `<div class="mf-makine">${G2_MAKINE_SVG}` +
                    `<div class="mf-kok">كتب</div>` +
                    `<div class="mf-parca p1">ك</div>` +
                    `<div class="mf-parca p2">ت</div>` +
                    `<div class="mf-parca p3">ب</div>` +
                `</div>`;
        }

        /* Üç oyun kartı + sağ üstteki bağlantı rozeti aynı yönlendirmeyi kullanır. */
        document.querySelectorAll('.menu-card, .menu-connect').forEach(card => {
            card.addEventListener('click', () => {
                this.playSound('click');
                const target = card.dataset.goto;
                if (target === 'game1-screen') Game1.start();
                else if (target === 'game2-screen') { this.yonergeSesCal(); Game2.start(); }
                else if (target === 'game3-screen') Game3.start();
                else if (target === 'quiz-screen') { Quiz.start(); }
                this.showScreen(target);
            });
        });

        document.getElementById('done-menu').addEventListener('click', () => {
            this.playSound('click');
            this.hideDone();
            if (this.tekOyunCikis()) return;
            this.showScreen('start-screen');
        });

        const initAudio = () => {
            if (this.state.audioCtx) return;
            try { this.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
        };
        document.addEventListener('click', initAudio);
        document.addEventListener('touchstart', initAudio);

        /* Öğrenci bağlantısı: ...sarf.html?oda=KOD  →  doğrudan yarışma ekranı.
           Kod alanı hazır gelir, öğrenci sadece takım adını yazar. */
        let odaKod = null;
        try { odaKod = new URLSearchParams(location.search).get('oda'); } catch (e) {}
        if (odaKod) { Quiz.katilimlaBasla(odaKod.trim().toUpperCase()); return; }

        /* Tek oyun kipi (koktengorsele.html → game1, sarf.html → game2):
           menü ekranı hiç gösterilmez, sayfa açılır açılmaz kendi oyununu
           kurar; geri tuşları da menüye değil siteye döner. */
        const tek = document.body.dataset.tekOyun;
        if (tek) { this.tekOyunBaslat(tek); this.showScreen(tek + '-screen'); return; }

        this.showScreen('start-screen');
    },

    /* Tek oyun kipindeki sayfanın oyununu kurar (menüdeki kart tıklamasının
       karşılığı). Ses yönergesi burada ÇALINMAZ: sayfa yüklenirken çalan
       sesi tarayıcılar zaten engeller, oyun ilk dokunuşta kendi çalar. */
    tekOyunBaslat(tek) {
        if (tek === 'game1') Game1.start();
        else if (tek === 'game2') Game2.start();
        else if (tek === 'game3') Game3.start();
    },

    /* Tek oyun kipinde "menüye dön" anlamı yoktur: siteye dönülür. */
    tekOyunCikis() {
        if (!document.body.dataset.tekOyun) return false;
        try { if (window.kidefGeri) { kidefGeri(); return true; } } catch (e) {}
        location.href = 'index.html';
        return true;
    },

    showScreen(id) {
        /* Tek oyun kipinde "menü" diye bir ekran yoktur (sayfadaki
           start-screen boştur). Menüye dönmek isteyen her yol — örneğin
           yarışma askıya alınınca — sayfanın kendi oyununa döner; oyun
           henüz kurulmadıysa (?oda= ile girilmişse) burada kurulur. */
        const tek = document.body.dataset.tekOyun;
        if (id === 'start-screen' && tek) {
            id = tek + '-screen';
            const e = document.getElementById(id);
            if (e && !e.innerHTML.trim()) this.tekOyunBaslat(tek);
        }
        this.dom.screens.forEach(s => s.classList.remove('active'));
        const t = document.getElementById(id);
        if (t) t.classList.add('active');
    },

    /* Yönerge sesi: tıklama jestinin İÇİNDE başlatılır ki tarayıcının
       otomatik oynatma engeline takılmasın. Tek Audio nesnesi paylaşılır;
       yonergeGoster çift çalmayı önlemek için bunu kontrol eder. */
    yonergeSes: null,
    yonergeSesCal() {
        try {
            if (!this.yonergeSes) this.yonergeSes = new Audio('sarf/ses/yonergesarf.mp3');
            this.yonergeSes.currentTime = 0;
            this.yonergeSes.play().catch(() => {});
        } catch (e) {}
    },

    playSound(key) {
        /* Bağlam henüz kurulmadıysa (örn. sayfadaki İLK tıklama) burada kur:
           çağrı zaten bir kullanıcı jesti içinden geliyor. */
        if (!this.state.audioCtx) {
            try { this.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
            if (!this.state.audioCtx) return;
        }
        if (this.state.audioCtx.state === 'suspended') this.state.audioCtx.resume();
        const ctx = this.state.audioCtx;
        /* Çok notalı ezgiler — dijital yarışmanın canlı anları için.
           (katildi: odaya biri girdi · hepsiCevap: herkes cevapladı ·
            sonucAcildi: sonuç sahnesi · siraDegisti: sıralama oynadı ·
            zafer: yarışma bitti) */
        const ezgiler = {
            katildi:     [{f:659,t:0,d:.12},{f:988,t:.10,d:.18}],
            hepsiCevap:  [{f:523,t:0,d:.11},{f:659,t:.09,d:.11},{f:784,t:.18,d:.20}],
            sonucAcildi: [{f:392,t:0,d:.14},{f:587,t:.12,d:.24}],
            siraDegisti: [{f:494,t:0,d:.10},{f:740,t:.08,d:.10},{f:988,t:.16,d:.20}],
            zafer:       [{f:523,t:0,d:.16},{f:659,t:.14,d:.16},{f:784,t:.28,d:.18},{f:1047,t:.42,d:.5}]
        };
        const ezgi = ezgiler[key];
        if (ezgi) {
            const t0 = ctx.currentTime + 0.01;
            ezgi.forEach(n => {
                const b = t0 + n.t;
                const eg = ctx.createGain(); eg.connect(ctx.destination);
                eg.gain.setValueAtTime(0.0001, b);
                eg.gain.exponentialRampToValueAtTime(0.13, b + 0.02);
                eg.gain.exponentialRampToValueAtTime(0.0001, b + n.d);
                const eo = ctx.createOscillator(); eo.type = 'sine';
                eo.frequency.setValueAtTime(n.f, b);
                eo.connect(eg); eo.start(b); eo.stop(b + n.d + 0.03);
            });
            return;
        }
        /* Fabrika sesleri: düz sinüs yerine katmanlı sentez —
           gürültü kaynağı + filtre + zarf. Dosya yok, lisans yok,
           çevrimdışı çalışır ve her cihazda aynı tınlar. */
        if (key === 'grind' || key === 'hammer' || key === 'forklift' ||
            key === 'clink' || key === 'ding') {
            this.fabrikaSesi(key, ctx);
            return;
        }
        const sounds = {
            click:   { f:520, t:'square',   d:.07 },
            correct: { f:520, t:'sine',     d:.22, glide:880 },
            wrong:   { f:220, t:'sawtooth', d:.18, glide:110 },
            gear:    { f:180, t:'triangle', d:.35 }
        };
        const s = sounds[key]; if (!s) return;
        const g = ctx.createGain(); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + s.d);
        const o = ctx.createOscillator(); o.type = s.t; o.frequency.setValueAtTime(s.f, ctx.currentTime);
        if (s.glide) o.frequency.linearRampToValueAtTime(s.glide, ctx.currentTime + s.d);
        o.connect(g); o.start(); o.stop(ctx.currentTime + s.d);
    },

    /* Tek seferlik beyaz gürültü tamponu (tüm gürültü sesleri bundan beslenir) */
    gurultuTamponu(ctx) {
        if (!this.state.gurultuBuf) {
            const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
            this.state.gurultuBuf = b;
        }
        return this.state.gurultuBuf;
    },

    /* Atölye/fabrika ses tasarımı:
       grind    = öğütücü (derin gürleme + çakıl gürültüsü + devir dalgası)
       hammer   = çekiç (tok darbe + metal çınlama + kıvılcım tıssı)
       forklift = kaldırıcı (motor homurtusu + geri vites bip-bip'i)
       clink    = külçe (kısa metalik tınlama)
       ding     = vitrin zili (sıcak çan + parıltı) */
    fabrikaSesi(key, ctx) {
        const t = ctx.currentTime + .01;
        const cikis = ctx.destination;
        const gurultu = (bas, sure, tip, frek, q, tepe) => {
            const src = ctx.createBufferSource();
            src.buffer = this.gurultuTamponu(ctx); src.loop = true;
            const f = ctx.createBiquadFilter(); f.type = tip; f.frequency.value = frek; f.Q.value = q;
            const g = ctx.createGain();
            g.gain.setValueAtTime(.0001, bas);
            g.gain.exponentialRampToValueAtTime(tepe, bas + .03);
            g.gain.exponentialRampToValueAtTime(.0001, bas + sure);
            src.connect(f); f.connect(g); g.connect(cikis);
            src.start(bas); src.stop(bas + sure + .05);
        };
        const ton = (bas, sure, tip, f0, f1, tepe) => {
            const o = ctx.createOscillator(); o.type = tip;
            o.frequency.setValueAtTime(f0, bas);
            if (f1) o.frequency.exponentialRampToValueAtTime(f1, bas + sure);
            const g = ctx.createGain();
            g.gain.setValueAtTime(.0001, bas);
            g.gain.exponentialRampToValueAtTime(tepe, bas + .015);
            g.gain.exponentialRampToValueAtTime(.0001, bas + sure);
            o.connect(g); g.connect(cikis);
            o.start(bas); o.stop(bas + sure + .05);
            return o;
        };

        if (key === 'grind') {
            gurultu(t, 1.15, 'lowpass', 480, .8, .3);
            gurultu(t, 1.15, 'bandpass', 1100, 2.5, .16);
            const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 52;
            const og = ctx.createGain();
            og.gain.setValueAtTime(.0001, t);
            og.gain.exponentialRampToValueAtTime(.14, t + .06);
            og.gain.exponentialRampToValueAtTime(.0001, t + 1.15);
            const lfo = ctx.createOscillator(); lfo.frequency.value = 9;
            const lg = ctx.createGain(); lg.gain.value = 6;
            lfo.connect(lg); lg.connect(o.frequency);
            o.connect(og); og.connect(cikis);
            o.start(t); lfo.start(t); o.stop(t + 1.2); lfo.stop(t + 1.2);
        } else if (key === 'hammer') {
            ton(t, .09, 'sine', 150, 58, .5);
            ton(t + .004, .22, 'triangle', 420, 0, .22);
            ton(t + .004, .18, 'triangle', 637, 0, .17);
            ton(t + .004, .14, 'triangle', 988, 0, .12);
            gurultu(t, .07, 'highpass', 2600, 1, .18);
        } else if (key === 'forklift') {
            const o = ctx.createOscillator(); o.type = 'sawtooth';
            o.frequency.setValueAtTime(78, t);
            o.frequency.linearRampToValueAtTime(96, t + .7);
            o.frequency.linearRampToValueAtTime(80, t + 1.5);
            const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380; f.Q.value = 1;
            const g = ctx.createGain();
            g.gain.setValueAtTime(.0001, t);
            g.gain.exponentialRampToValueAtTime(.17, t + .08);
            g.gain.exponentialRampToValueAtTime(.0001, t + 1.55);
            const lfo = ctx.createOscillator(); lfo.frequency.value = 13;
            const lg = ctx.createGain(); lg.gain.value = 5;
            lfo.connect(lg); lg.connect(o.frequency);
            o.connect(f); f.connect(g); g.connect(cikis);
            o.start(t); lfo.start(t); o.stop(t + 1.6); lfo.stop(t + 1.6);
            ton(t + .5, .14, 'square', 988, 0, .08);   // bip
            ton(t + .9, .14, 'square', 988, 0, .08);   // bip
        } else if (key === 'clink') {
            ton(t, .1, 'triangle', 1180, 0, .26);
            ton(t + .008, .16, 'triangle', 1770, 0, .14);
            gurultu(t, .03, 'highpass', 4000, 1, .1);
        } else if (key === 'ding') {
            ton(t, .5, 'sine', 880, 0, .2);
            ton(t, .55, 'sine', 1318, 0, .1);
            ton(t + .09, .4, 'sine', 1760, 0, .07);
        }
    },

    showDone(emoji, text) {
        document.getElementById('done-emoji').textContent = emoji;
        document.getElementById('done-text').textContent = text;
        this.dom.doneOverlay.classList.add('show');
    },
    hideDone() { this.dom.doneOverlay.classList.remove('show'); },

    /* Genel amaçlı, dokunma + fare destekli sürükle-bırak yardımcısı.
       draggableEl: sürüklenecek eleman
       opts.getClone(): sürüklenirken ekranda gezecek "hayalet" elemanı üretir (yoksa orijinal klonlanır)
       opts.onDragStart(), opts.onDrop(targetEl), opts.onCancel() */
    makeDraggable(draggableEl, opts) {
        let ghost = null, startX = 0, startY = 0, dragging = false;

        const pointerDown = (e) => {
            if (draggableEl.classList.contains('disabled')) return;
            e.preventDefault();
            dragging = true;
            const rect = draggableEl.getBoundingClientRect();
            startX = rect.left; startY = rect.top;
            const point = e.touches ? e.touches[0] : e;

            ghost = opts.getClone ? opts.getClone() : draggableEl.cloneNode(true);
            ghost.style.position = 'fixed';
            ghost.style.left = rect.left + 'px';
            ghost.style.top = rect.top + 'px';
            ghost.style.width = rect.width + 'px';
            ghost.style.height = rect.height + 'px';
            ghost.style.zIndex = 999;
            ghost.style.pointerEvents = 'none';
            ghost.style.transition = 'none';
            ghost.classList.add('drag-ghost');
            document.body.appendChild(ghost);

            draggableEl.classList.add('dragging-source');
            const offsetX = point.clientX - rect.left;
            const offsetY = point.clientY - rect.top;

            if (opts.onDragStart) opts.onDragStart();

            const move = (ev) => {
                if (!dragging) return;
                const p = ev.touches ? ev.touches[0] : ev;
                ghost.style.left = (p.clientX - offsetX) + 'px';
                ghost.style.top = (p.clientY - offsetY) + 'px';
            };
            const up = (ev) => {
                if (!dragging) return;
                dragging = false;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('touchmove', move);
                document.removeEventListener('mouseup', up);
                document.removeEventListener('touchend', up);

                const p = ev.changedTouches ? ev.changedTouches[0] : ev;
                ghost.style.display = 'none';
                const under = document.elementFromPoint(p.clientX, p.clientY);
                ghost.style.display = '';

                const dropTarget = under ? under.closest('.drop-zone') : null;
                ghost.remove(); ghost = null;
                draggableEl.classList.remove('dragging-source');

                // Öğrenci bir kez sürükleyip bıraktıysa "sürüklenebilir" ipucuna
                // artık gerek yok; tüm oyunlarda animasyon kalıcı olarak susar.
                document.body.classList.add('drag-learned');

                if (dropTarget && opts.onDrop) opts.onDrop(dropTarget);
                else if (opts.onCancel) opts.onCancel();
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('touchmove', move, { passive:false });
            document.addEventListener('mouseup', up);
            document.addEventListener('touchend', up);
        };

        draggableEl.addEventListener('mousedown', pointerDown);
        draggableEl.addEventListener('touchstart', pointerDown, { passive:false });
    }
};

const BACK_SVG = '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>';

/* =========================================================
   OYUN 1 — مِنَ الجَذْرِ إِلى الصّورَة (kökten kalıba/emojiye)
========================================================= */
const Game1 = {
    /* selected: seçili kökün ROOTS_GAME1 içindeki sırası (-1 = hiçbiri).
       done: tamamlanan köklerin sıraları. solvedCount: seçili kökte çözülen kutu sayısı. */
    state: { selected: -1, solvedCount: 0, done: [] },

    start() {
        this.state.selected = -1;
        this.state.solvedCount = 0;
        this.state.done = [];
        this.render();
    },

    conjMarkup(root) {
        /* Pencerenin tepesindeki "kunye" seridi: secili kokun sira numarasi ve
           ebced degeri. Numara sistemi veri_kok_numaralari.js'ten gelir; o dosya
           yuklenmemisse serit hic basilmaz, pencere eskisi gibi calisir. */
        let kunye = '';
        if (root && typeof KokNo !== 'undefined') {
            const rk = KokNo.rakam(root);
            if (rk) {
                kunye = '<div class="g1-kok-kunye" dir="rtl">'
                      + '<span class="kk-kok">' + formatRootDisplay(root) + '</span>'
                      + '<span class="kk-etiket" dir="ltr">K\u00d6K <b>' + rk + '</b></span>'
                      + '<span class="kk-etiket kk-ebced" dir="ltr">EBCED <b>' + KokNo.ebced(root) + '</b></span>'
                      + '</div>';
            }
        }
        return `
            <div class="g1-conj-btn" id="g1-conj-btn">
                <span>تَصْريفُ الفِعْل</span><span class="caret">\u25BC</span>
            </div>
            <div class="g1-conj-panel" id="g1-conj-panel">${kunye}
                <div class="g1-conj-tabs">
                    <div class="g1-conj-tab" data-t="madi">الماضي</div>
                    <div class="g1-conj-tab" data-t="mudari">المُضارِع</div>
                    <div class="g1-conj-tab" data-t="amr">الأَمْر</div>
                </div>
                <div class="g1-conj-list" id="g1-conj-list"></div>
                <div class="g1-conj-hint" id="g1-conj-hint">اِخْتَرْ زَمَنًا لِتَرى التَّصْريف</div>
            </div>`;
    },

    /* Sağ üstteki (ilerleme rozetinin altındaki) "تَصْريفُ الفِعْل" penceresi: üç zaman başlığı yatay durur,
       tıklananın tekil çekimi altta açılır. Çekim, SEÇİLİ kökten üretilir;
       zaid (kökten gelmeyen) harfler burada da kırmızı gösterilir.
       root null ise (henüz kök seçilmediyse) düğme pasif/soluk kalır.
       Pencere her seferinde sıfırdan yazıldığı için eski dinleyiciler birikmiyor. */
    setupConjugation(root) {
        const host = document.getElementById('g1-conj-host');
        host.innerHTML = this.conjMarkup(root);
        const btn = document.getElementById('g1-conj-btn');
        const panel = document.getElementById('g1-conj-panel');
        const list = document.getElementById('g1-conj-list');
        const hint = document.getElementById('g1-conj-hint');

        if (this._conjOutside) { document.removeEventListener('click', this._conjOutside); this._conjOutside = null; }

        const table = root ? buildConjugation(root) : null;
        if (!table) { btn.classList.add('disabled'); return; }

        paintRootOutline(btn, root);
        paintRootOutline(panel, root);
        panel.querySelectorAll('.g1-conj-tab').forEach(t => paintRootOutline(t, root));

        const close = () => { panel.classList.remove('open'); btn.classList.remove('open'); };
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            App.playSound('click');
            panel.classList.toggle('open');
            btn.classList.toggle('open');
        });
        panel.addEventListener('click', (e) => e.stopPropagation());
        this._conjOutside = close;
        document.addEventListener('click', this._conjOutside);

        panel.querySelectorAll('.g1-conj-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const wasActive = tab.classList.contains('active');
                panel.querySelectorAll('.g1-conj-tab').forEach(x => x.classList.remove('active'));
                list.classList.remove('show');
                if (wasActive) { hint.style.display = ''; return; }
                tab.classList.add('active');
                hint.style.display = 'none';
                App.playSound('click');
                /* Her satirin sonuna KOK·KALIP·SIGA adresi basiliyor:
                   014·001·13 = kok 14 (كتب), kalip 1 (فَعَلَ), siga 13 (ben).
                   Cekimi olmayan zamirlerde (emirde أنا/هوَ/هِيَ) adres basilmaz;
                   numara sistemi yuklu degilse de satir eskisi gibi gorunur. */
                const vf = (typeof VERB_FORMS !== 'undefined') ? VERB_FORMS[root] : null;
                const zaman = tab.dataset.t;
                list.innerHTML = table[zaman].map(pair => {
                    let adres = '';
                    if (pair[1] && typeof KokNo !== 'undefined') {
                        const a = KokNo.cekimAdresi(root, vf, zaman, pair[0]);
                        if (a.metin) {
                            const k = KokNo.kalipBilgi(a.kalip);
                            adres = `<span class="cekim-no" dir="ltr" title="${k.tr || ''}">${a.metin}</span>`;
                        }
                    }
                    return `<div class="g1-conj-row"><span class="pron">${pair[0]}</span>` +
                        (pair[1]
                            ? `<span class="verb"><span class="g3-pattern-text">${formatWordVsRoot(pair[1], root)}</span></span>`
                            : `<span class="verb none">\u2014</span>`) +
                        adres + `</div>`;
                }).join('');
                list.querySelectorAll('.g1-conj-row').forEach(r => paintRootOutline(r, root));
                void list.offsetWidth;   // animasyon her seferinde yeniden başlasın
                list.classList.add('show');
            });
        });
    },

    /* Ekran bir kez kuruluyor: geri düğmesi, sayaç, çekim penceresi kabı,
       üstteki kök şeridi ve (başlangıçta boş) tahta. */
    render() {
        const screen = document.getElementById('game1-screen');
        screen.innerHTML = `
            <div class="back-btn" id="g1-back">${BACK_SVG}</div>
            <div class="progress-pill" id="g1-pill">0 / ${ROOTS_GAME1.length}</div>
            <div class="g1-wrap">
                <div class="g1-title" dir="rtl">اُسْحَبِ الْجَذْرَ إِلَى الصُّورَةِ الْمُنَاسِبَةِ.</div>
                <div class="g1-root-bar" id="g1-root-bar" dir="rtl">
                    <div class="g1-conj-host" id="g1-conj-host"></div>
                </div>
                <div class="g1-circle" id="g1-circle"></div>
            </div>
        `;
        document.getElementById('g1-back').addEventListener('click', () => {
            App.playSound('click');
            if (App.tekOyunCikis()) return;
            App.showScreen('start-screen');
        });

        const bar = document.getElementById('g1-root-bar');
        ROOTS_GAME1.forEach((r, i) => {
            const c = document.createElement('div');
            c.className = 'g1-root-bar-chip';
            c.dataset.index = i;
            c.dir = 'rtl';
            /* Cip = kok metni + kucuk sira numarasi rozeti. Numara sistemi
               (veri_kok_numaralari.js) yoksa cip eskisi gibi duz metin kalir. */
            const rk = (typeof KokNo !== 'undefined') ? KokNo.rakam(r.root) : '';
            if (rk) {
                c.innerHTML = '<span class="kok-metin">' + formatRootDisplay(r.root) + '</span>'
                            + '<span class="kok-no" dir="ltr">' + rk + '</span>';
                c.title = 'K\u00f6k ' + rk + ' \u00b7 Ebced ' + KokNo.ebced(r.root);
            } else {
                c.textContent = formatRootDisplay(r.root);
            }
            paintRootOutline(c, r.root);
            c.addEventListener('click', () => this.selectRoot(i));
            bar.appendChild(c);
        });

        this.updatePill();
        this.setupConjugation(null);   // kök seçilene kadar pasif
        this.showPickHint();
    },

    updatePill() {
        const pill = document.getElementById('g1-pill');
        if (pill) pill.textContent = `${this.state.done.length} / ${ROOTS_GAME1.length}`;
    },

    /* Hiçbir kök seçili değilken tahta boş kalır; ortada yönlendirme yazısı durur.
       Sürüklenecek kök çipi de olmadığı için sürükle-bırak kapalıdır. */
    showPickHint() {
        const grid = document.getElementById('g1-circle');
        grid.innerHTML = '<div class="g1-pick-hint" dir="rtl">اِخْتَرْ جَذْرًا مِنَ الأَعْلى</div>';
    },

    selectRoot(i) {
        if (this.state.selected === i) return;
        App.playSound('click');
        this.state.selected = i;
        this.state.solvedCount = 0;
        document.querySelectorAll('.g1-root-bar-chip').forEach(c =>
            c.classList.toggle('active', parseInt(c.dataset.index, 10) === i));
        const round = ROOTS_GAME1[i];
        this.setupConjugation(round.root);   // çekim penceresi artık etkin
        this.buildBoard(round);              // sürükle-bırak artık etkin
    },

    buildBoard(round) {
        const grid = document.getElementById('g1-circle');
        grid.innerHTML = '';
        const n = round.targets.length;
        const radiusPct = 38;
        round.targets.forEach((t, i) => {
            const angle = -Math.PI / 2 + i * (2 * Math.PI / n);
            const leftPct = 50 + radiusPct * Math.cos(angle);
            const topPct = 50 + radiusPct * Math.sin(angle);
            const cell = document.createElement('div');
            cell.className = 'drop-zone g1-cell';
            cell.dataset.index = i;
            cell.style.left = leftPct + '%';
            cell.style.top = topPct + '%';
            cell.innerHTML = `<div class="g1-emoji">${t.emoji}</div><div class="g1-word-label"></div>`;
            // Hedef kutular da seçili kökün rengini alıyor.
            paintRootOutline(cell, round.root);
            grid.appendChild(cell);
        });

        const chip = document.createElement('div');
        chip.className = 'g1-root-chip';
        chip.id = 'g1-root';
        chip.dir = 'rtl';
        chip.textContent = formatRootDisplay(round.root);
        paintRootChip(chip, round.root);
        grid.appendChild(chip);

        App.makeDraggable(chip, {
            getClone: () => {
                const c = document.createElement('div');
                c.className = 'g1-ghost';
                c.dir = 'rtl';
                c.textContent = formatRootDisplay(round.root);
                paintRootChip(c, round.root);
                return c;
            },
            onDrop: (target) => this.handleDrop(target, round)
        });
    },

    handleDrop(target, round) {
        if (!target.classList.contains('g1-cell')) return;
        if (target.classList.contains('solved')) {
            App.playSound('wrong');
            target.classList.add('flash-bad');
            setTimeout(() => target.classList.remove('flash-bad'), 400);
            return;
        }
        const i = parseInt(target.dataset.index, 10);
        const t = round.targets[i];
        target.classList.add('solved', 'flash-good');
        target.querySelector('.g1-word-label').innerHTML =
            `<span class="g1-word-ar">${t.word}</span>`;
        App.playSound('correct');
        setTimeout(() => target.classList.remove('flash-good'), 500);

        this.state.solvedCount++;
        if (this.state.solvedCount === round.targets.length) {
            setTimeout(() => this.finishRoot(), 1100);
        }
    },

    /* Bir kök bitince o kök şeritte "bitti" işaretlenir, seçim kaldırılır ve
       oyun yeniden "kök seç" durumuna döner (otomatik yeni kök SEÇİLMEZ). */
    finishRoot() {
        const i = this.state.selected;
        if (i < 0) return;
        if (this.state.done.indexOf(i) === -1) this.state.done.push(i);
        const chip = document.querySelector('.g1-root-bar-chip[data-index="' + i + '"]');
        if (chip) { chip.classList.remove('active'); chip.classList.add('done'); }
        this.state.selected = -1;
        this.state.solvedCount = 0;
        this.updatePill();

        if (this.state.done.length >= ROOTS_GAME1.length) {
            App.showDone('🎉', 'أَحْسَنْتَ! لَقَدْ أَتْمَمْتَ كُلَّ الْجُذُورِ.');
            document.getElementById('done-replay').onclick = () => {
                App.hideDone();
                this.start();
            };
            return;
        }
        this.setupConjugation(null);
        this.showPickHint();
    }
};

/* =========================================================
   OYUN 2 — اِسْتَخْرِج الجَذْر (kelimeyi köküne ayırma)
   ---------------------------------------------------------
   ÖĞÜTÜCÜ FABRİKA: kelime sağdaki yürüyen banda biner, makineye
   girip kaybolur; makine titreyerek öğütür; soldan çıkan "saf
   metal" (altın külçe üzerinde kök) eğimli rampadan yukarı taşınır
   ve rampanın ucundan şeffaf cam konteynıra düşer.
========================================================= */
const G2_MAKINE_SVG = `
<svg viewBox="0 0 230 170" class="g2-makine-svg" aria-hidden="true">
  <defs>
    <linearGradient id="g2met" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eef1f5"/><stop offset="1" stop-color="#c3cad4"/>
    </linearGradient>
  </defs>
  <!-- baca + duman (duman sadece öğütürken görünür) -->
  <rect x="50" y="6" width="20" height="30" rx="5" fill="#8f9aa8"/>
  <circle class="g2-duman d1" cx="60" cy="0" r="7" fill="#cfd8e3" opacity="0"/>
  <circle class="g2-duman d2" cx="66" cy="-6" r="9" fill="#dde5ee" opacity="0"/>
  <!-- gövde -->
  <rect x="26" y="30" width="170" height="122" rx="15" fill="url(#g2met)" stroke="#9aa6b3" stroke-width="2"/>
  <rect x="26" y="30" width="170" height="24" rx="12" fill="#7C3AED" opacity=".85"/>
  <circle cx="38" cy="42" r="2.6" fill="#e6d9ff"/><circle cx="184" cy="42" r="2.6" fill="#e6d9ff"/>
  <circle cx="38" cy="140" r="2.6" fill="#93a0af"/><circle cx="184" cy="140" r="2.6" fill="#93a0af"/>
  <!-- giriş ağzı (sağ): huni -->
  <path d="M196,82 L226,66 L226,120 L196,104 Z" fill="#8f9aa8"/>
  <rect x="192" y="78" width="10" height="30" rx="4" fill="#77828f"/>
  <!-- pencere: içinde birbirine ters dönen iki kırıcı -->
  <circle cx="111" cy="102" r="37" fill="#2c3e50"/>
  <circle cx="111" cy="102" r="32" fill="#34495e"/>
  <g transform="translate(98,102) scale(1.25)"><g class="g2-kirici">
    <circle r="11" fill="#95a5a6"/><circle r="3.6" fill="#5d6d7e"/>
    <rect x="-2.4" y="-16" width="4.8" height="6" rx="2" fill="#95a5a6"/>
    <rect x="-2.4" y="10" width="4.8" height="6" rx="2" fill="#95a5a6"/>
    <rect x="-16" y="-2.4" width="6" height="4.8" rx="2" fill="#95a5a6"/>
    <rect x="10" y="-2.4" width="6" height="4.8" rx="2" fill="#95a5a6"/>
    <rect x="-2.4" y="-16" width="4.8" height="6" rx="2" fill="#95a5a6" transform="rotate(45)"/>
    <rect x="-2.4" y="10" width="4.8" height="6" rx="2" fill="#95a5a6" transform="rotate(45)"/>
    <rect x="-16" y="-2.4" width="6" height="4.8" rx="2" fill="#95a5a6" transform="rotate(45)"/>
    <rect x="10" y="-2.4" width="6" height="4.8" rx="2" fill="#95a5a6" transform="rotate(45)"/>
  </g></g>
  <g transform="translate(129,102)"><g class="g2-kirici ters">
    <circle r="11" fill="#aab7b8"/><circle r="3.6" fill="#5d6d7e"/>
    <rect x="-2.4" y="-16" width="4.8" height="6" rx="2" fill="#aab7b8"/>
    <rect x="-2.4" y="10" width="4.8" height="6" rx="2" fill="#aab7b8"/>
    <rect x="-16" y="-2.4" width="6" height="4.8" rx="2" fill="#aab7b8"/>
    <rect x="10" y="-2.4" width="6" height="4.8" rx="2" fill="#aab7b8"/>
    <rect x="-2.4" y="-16" width="4.8" height="6" rx="2" fill="#aab7b8" transform="rotate(45)"/>
    <rect x="-2.4" y="10" width="4.8" height="6" rx="2" fill="#aab7b8" transform="rotate(45)"/>
    <rect x="-16" y="-2.4" width="6" height="4.8" rx="2" fill="#aab7b8" transform="rotate(45)"/>
    <rect x="10" y="-2.4" width="6" height="4.8" rx="2" fill="#aab7b8" transform="rotate(45)"/>
  </g></g>
  <!-- çıkış oluğu (sol alt): rampaya döker -->
  <path d="M26,120 L2,130 L2,146 L26,140 Z" fill="#8f9aa8"/>
</svg>`;

/* Otomatik kaldırıcı (forklift): külçeleri konteynırdan alıp
   atölyedeki kök rafına taşır. Çatal sağa bakar; dönüşte geri
   geri gider (forkliftler gibi), yük çatalda kalır. */
/* Atölye örsü: kesikli kutu yerine, ahşap kütüğün üstünde duran DOLU bir örs.
   Kök harfleri örs tablasının üzerinde belirir. */
const G2_ORS2_SVG = `
<svg viewBox="0 0 220 175" class="g2-ors2-svg" aria-hidden="true">
  <!-- ahşap kütük -->
  <rect x="52" y="118" width="116" height="44" fill="#8a5a2c"/>
  <ellipse cx="110" cy="162" rx="58" ry="9" fill="#6f4621"/>
  <ellipse cx="110" cy="118" rx="58" ry="10" fill="#a9743f"/>
  <ellipse cx="110" cy="118" rx="40" ry="6.5" fill="none" stroke="#8a5a2c" stroke-width="2"/>
  <ellipse cx="110" cy="118" rx="20" ry="3.4" fill="none" stroke="#8a5a2c" stroke-width="1.6"/>
  <!-- örs -->
  <path d="M44,62 L176,62 L176,76 C158,81 146,89 140,99 L130,99 L130,107 L146,120 L74,120 L90,107 L90,99 L80,99 C70,88 56,80 44,76 Z" fill="#7f8c8d"/>
  <rect x="38" y="54" width="144" height="13" rx="6.5" fill="#95a5a6"/>
  <rect x="38" y="54" width="144" height="5" rx="2.5" fill="#aab7b8"/>
</svg>`;

const G2_FORKLIFT_SVG = `
<svg viewBox="0 0 150 100" class="g2-forklift-svg" aria-hidden="true">
  <rect x="14" y="60" width="76" height="11" rx="5" fill="#d98c0a"/>
  <rect x="18" y="44" width="64" height="22" rx="7" fill="#F39C12"/>
  <path d="M30,46 L34,24 L64,24 L64,46 Z" fill="#f7b955"/>
  <rect x="38" y="29" width="20" height="13" rx="3" fill="#e8f6ff" stroke="#d98c0a" stroke-width="1.5"/>
  <circle cx="32" cy="77" r="12" fill="#2c3e50"/><circle cx="32" cy="77" r="5" fill="#95a5a6"/>
  <circle cx="74" cy="77" r="12" fill="#2c3e50"/><circle cx="74" cy="77" r="5" fill="#95a5a6"/>
  <rect x="92" y="14" width="7" height="62" rx="3" fill="#7f8c8d"/>
  <rect x="88" y="10" width="20" height="6" rx="3" fill="#7f8c8d"/>
  <rect x="99" y="70" width="44" height="6" rx="3" fill="#95a5a6"/>
</svg>`;

/* =========================================================
   MERKEZÎ KÖK VERİSİ KÖPRÜSÜ (revizyon 62)
   Atölyedeki isim vezinleri artık veri_kokler.js'teki
   wordEasterEggs'ten gelir — kaliplartablosu'ndaki "Günün Kökü"
   ile birebir aynı süzgeç: fiil numaraları dışlanır, kalan her
   numara o köke tanımlı bir İSİM veznidir.
========================================================= */
const G2_FIIL_NOLARI = new Set([
    "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16",
    "52","53","54","58","59","60","64","65","66","71","72","73","77","78","79",
    "83","84","85","88","89","90","94","95","96","100","101","102"
]);

/* root ('ك ت ب') → o köke tanımlı isim vezinleri:
   [{ no, vezinAr, word, emoji, tr }] (numara sırasıyla) */
function g2KokIsimVezinleri(root) {
    const liste = [];
    if (typeof wordEasterEggs !== 'undefined') {
        const d = wordEasterEggs[root.replace(/ /g, '')];
        if (d) {
            Object.keys(d).forEach(no => {
                if (G2_FIIL_NOLARI.has(no)) return;
                const b = d[no] && d[no].base;
                if (!b || !b.arText) return;
                const vezinAr = (typeof KALIP_DATA !== 'undefined' && KALIP_DATA[no]) ? KALIP_DATA[no].ar : '';
                liste.push({ no, vezinAr, word: b.arText, emoji: b.emoji || '⭐', tr: b.trText || '' });
            });
        }
    }
    // Emniyet: merkezî veri yüklenemezse eski yerleşik kalıplara düş
    if (!liste.length) {
        GAME3_PATTERNS.forEach(p => {
            const w = p.map[root];
            if (w) liste.push({ no: 'g3-' + p.name, vezinAr: p.name, word: w, emoji: GAME3_EMOJI[w] || '⭐', tr: '' });
        });
    }
    return liste;
}

const Game2 = {
    /* BİRLEŞİK FABRİKA (revizyon 50): iki sahneli tek oyun.
       Sağ sahne = öğütücü (kelime → kök), sol sahne = usta atölyesi
       (kök + vezin → yeni kelime). Tur akışı:
         1. 5 kelime öğütülür, külçeler konteynıra düşer
         2. kamera sola kayar, forklift külçeleri kök rafına taşır
         3. öğrenci raftan kök seçer → yalnız o kökle çalışan vezinler açılır
         4. vezin seçilince usta döver, kelime emojisiyle vitrine çıkar
         5. tüm kökler işlenince kamera sağa döner, yeni parti gelir */
    state: { roundIdx: 0, words: [], grindCount: 0, doneTotal: 0,
             bekleyen: [],            // öğütülüp konteynırda bekleyen kökler
             shelf: [],               // şu an rafta duran parti
             forgedPairs: new Set(),  // bu turda dövülen kök|vezin çiftleri
             forgedRoots: new Set(),  // bu turda en az bir kez dövülen kökler
             selRoot: null, phase: 'grind' },

    /* Bir kökün isim vezinleri (merkezî veriden) ve kalan (dövülmemiş) sayısı */
    kokVezinleri(root) {
        return g2KokIsimVezinleri(root);
    },
    kalanVezin(root) {
        return this.kokVezinleri(root).filter(e => !this.state.forgedPairs.has(root + '|' + e.no)).length;
    },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /* Toplam iş = öğütülecek kelimeler + dövülecek kökler (her tur 5+5) */
    totalWords() {
        return GAME2_ROUNDS.reduce((sum, r) => sum + r.length * 2, 0);
    },

    start() {
        this.state.roundIdx = 0;
        this.state.doneTotal = 0;
        this.ilkYonerge = true; // ses yalnız oyunun en başında çalar
        this.render();
        this.rondKur(false);
    },

    /* Yönergeyi ekranın ortasında gösterir, 3 sn sonra kaybolur.
       sesliMi=true ise sarf/ses/yonergesarf.mp3 de çalınır (dosya yoksa
       sessiz geçer). */
    yonergeZaman: null,
    yonergeGoster(metin, sesliMi, sure) {
        const y = document.getElementById('g2-yonerge');
        if (!y) return;
        y.innerHTML = metin;
        y.classList.add('goster');
        clearTimeout(this.yonergeZaman);
        this.yonergeZaman = setTimeout(() => y.classList.remove('goster'), sure || 3000);
        if (sesliMi) {
            /* Menü kartına tıklanırken ses çoktan başladıysa dokunma;
               başka bir yoldan gelindiyse (örn. مِنْ جَدِيدٍ) burada başlat. */
            const ses = App.yonergeSes;
            if (!(ses && !ses.paused && !ses.ended)) App.yonergeSesCal();
        }
    },

    render() {
        const screen = document.getElementById('game2-screen');
        screen.innerHTML = `
            <div class="back-btn" id="g2-back">${BACK_SVG}</div>
            <!-- Yönerge artık üstte sabit durmaz: faz başında ekranın
                 ortasında belirir, (ilk sefer sarf/ses/yonergesarf.mp3 ile) okunur
                 ve kendiliğinden kaybolur -->
            <div class="g2-yonerge" id="g2-yonerge" dir="rtl"></div>
            <div class="g2-dunya" id="g2-dunya">
                <!-- SOL SAHNE: USTA ATÖLYESİ -->
                <section class="g2-sahne">
                    <div class="g2-atolye-ic">
                        <!-- SOL: dikey uzun vitrin -->
                        <div class="g3-vitrin">
                            <div class="g3-tente"></div>
                            <div class="g3-output-slot" id="g2-vitrinKutu"><span class="g3-out-bekle">✨</span></div>
                            <div class="g3-raf"></div>
                        </div>
                        <!-- SAĞ: üstte vezinler (2 satır), altta usta + kökler -->
                        <div class="g2-sag">
                            <div class="g2-vezinler" id="g2-vezinler"></div>
                            <div class="g2-sag-alt">
                                <div class="g3-ors-kutu" id="g2-orsKutu">
                                    <div class="g2-ors2" id="g2-ors" dir="rtl">${G2_ORS2_SVG}<span class="g2-ors-kok-yazi" id="g2-orsIc"></span></div>
                                    <div class="g3-usta" id="g2-usta">${G3_USTA_SVG}</div>
                                    <div class="g3-kivilcimlar" id="g2-kivilcimlar2"></div>
                                </div>
                                <div class="g2-kokraf" id="g2-kokraf"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <!-- (dunya kapanmadan önce her iki sahneyi de görebilen öğeler yok;
                     kaydırak dünya DIŞINDA sabit durur) -->
                <!-- SAĞ SAHNE: ÖĞÜTÜCÜ -->
                <section class="g2-sahne">
                    <div class="g2-stage" id="g2-stage">
                        <!-- Fabrika sahnesinin tamamı bırakma alanıdır -->
                        <div class="g2-fabrika drop-zone g2-machine" id="g2-fabrika">
                            <div class="g2-kap" id="g2-kap"><div class="g2-kap-ic" id="g2-kapIc"></div></div>
                            <div class="g2-rampa" id="g2-rampa"></div>
                            <div class="g2-govde" id="g2-govde">${G2_MAKINE_SVG}</div>
                            <div class="g2-bant" id="g2-bant"></div>
                        </div>
                        <div class="g2-kelimeler" id="g2-kelimeler"></div>
                    </div>
                    <!-- Tur başında görünür: kelime setini merkezî veriden
                         rastgele yeniler (ilk kelime öğütülünce kaybolur) -->
                    <div class="g2-gecis-tus g2-yenile" id="g2-karistirTus" title="كَلِمات جَديدَة">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="#ffffff"/>
                        </svg>
                    </div>
                </section>
                <!-- Forklift dünyaya aittir (sahnelere değil): hep konteynırın
                     altında bekler, kök türetilince vurgulanır, tıklanınca
                     kesintisiz tek sahne boyunca rafa taşır -->
                <div class="g2-forklift" id="g2-forklift" title="اِنْقُلِ الجُذور">${G2_FORKLIFT_SVG}<div class="g2-fork-yuk" id="g2-forkYuk"></div></div>
            </div>
        `;
        document.getElementById('g2-back').addEventListener('click', () => {
            App.playSound('click');
            if (App.tekOyunCikis()) return;      /* sarf.html: menü yok → siteye dön */
            App.showScreen('start-screen');
        });
        // Forklift: kök varken tıklanırsa o anki külçeler ustaya gider
        document.getElementById('g2-forklift').addEventListener('click', () => {
            this.atolyeyeGec();
        });
        // Rastgele kelime seti
        document.getElementById('g2-karistirTus').addEventListener('click', () => {
            this.kelimeleriKaristir();
        });
        this.jestleriKur();
    },

    /* Çift parmak jestleri: trackpad'de yatay iki parmak kaydırması (wheel
       deltaX) ve dokunmatikte iki parmakla sürükleme de kamerayı gezdirir.
       Tek parmak serbest kalır (kelime sürükleme bozulmaz); jest bitince
       kamera en yakın sahneye oturur. */
    jestleriKur() {
        if (this.jestlerHazir) return; // ekran elemanı kalıcı, bir kez bağla
        this.jestlerHazir = true;
        const ekran = document.getElementById('game2-screen');

        /* HASSASİYET: ekranın ~%40'ı kadar sürüklemek sahne değiştirmeye
           yeter (2.5×). Ayrıca kısa ama kararlı bir itiş (%10) bile
           bırakınca kamerayı o yöne oturtur — uzun uzun çekmek gerekmez. */
        const HIZ = 2.5, ESIK = .10;
        const yonSnap = (basKam) => {
            const fark = this.kamDeger - basKam;
            const hedef = fark > ESIK ? 1 : (fark < -ESIK ? 0 : (this.kamDeger > .5 ? 1 : 0));
            this.kamera(hedef, 550);
        };

        let wheelZaman = null, wheelBasKam = null;
        ekran.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // dikey scroll'a karışma
            e.preventDefault();
            if (wheelBasKam === null) wheelBasKam = this.kamDeger;
            const k = Math.max(0, Math.min(1, this.kamDeger - e.deltaX * 1.6 / window.innerWidth));
            this.kamera(k, 0);
            clearTimeout(wheelZaman);
            wheelZaman = setTimeout(() => {
                yonSnap(wheelBasKam);
                wheelBasKam = null;
            }, 170);
        }, { passive: false });

        /* Tıklanabilir/sürüklenebilir öğeler pan'a KARIŞMAZ; boşluklardan
           tek parmak / fare sürüklemesiyle de sahne kaydırılabilir. */
        const etkilesimli = '.g2-word-chip, .g2-kok-kulce, .g2-vezin, .g2-forklift-tus, ' +
            '.g2-gecis-tus, .back-btn, .progress-pill, input, a, button';
        let panX = null, panY = null, panAktif = false, panBasKam = 0;
        const panBas = (x, y, hedef) => {
            if (hedef && hedef.closest && hedef.closest(etkilesimli)) return false;
            panX = x; panY = y; panAktif = false; panBasKam = this.kamDeger;
            return true;
        };
        const panHareket = (x, y) => {
            if (panX === null) return false;
            const dx = x - panX, dy = y - panY;
            if (!panAktif) {
                if (Math.abs(dx) < 6) return false;
                if (Math.abs(dy) > Math.abs(dx)) { panX = null; return false; } // dikey niyet
                panAktif = true;
            }
            const k = Math.max(0, Math.min(1, this.kamDeger + dx * HIZ / window.innerWidth));
            panX = x; panY = y;
            this.kamera(k, 0);
            return true;
        };
        const panBirak = () => {
            if (panX !== null && panAktif) yonSnap(panBasKam);
            panX = null; panAktif = false;
        };
        ekran.addEventListener('mousedown', (e) => { if (panBas(e.clientX, e.clientY, e.target)) e.preventDefault(); });
        window.addEventListener('mousemove', (e) => panHareket(e.clientX, e.clientY));
        window.addEventListener('mouseup', panBirak);

        let dokunX = null, dokunBasKam = 0;
        ekran.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                dokunX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                dokunBasKam = this.kamDeger;
                panX = null;
            } else if (e.touches.length === 1) {
                panBas(e.touches[0].clientX, e.touches[0].clientY, e.target);
            }
        }, { passive: true });
        ekran.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && dokunX !== null) {
                e.preventDefault();
                const x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const k = Math.max(0, Math.min(1, this.kamDeger + (x - dokunX) * HIZ / window.innerWidth));
                dokunX = x;
                this.kamera(k, 0);
            } else if (e.touches.length === 1) {
                if (panHareket(e.touches[0].clientX, e.touches[0].clientY)) e.preventDefault();
            }
        }, { passive: false });
        ekran.addEventListener('touchend', (e) => {
            if (dokunX !== null && e.touches.length < 2) {
                dokunX = null;
                yonSnap(dokunBasKam);
            }
            if (e.touches.length === 0) panBirak();
        });
    },

    /* Kamera: kam=0 öğütücü (sağ sahne), kam=1 atölye (sol sahne). ms=0 → anında. */
    kamDeger: 0,
    kamera(kam, ms) {
        const dunya = document.getElementById('g2-dunya');
        if (!dunya) return;
        this.kamDeger = kam;
        dunya.style.transition = ms ? `transform ${ms}ms cubic-bezier(.65,0,.3,1)` : 'none';
        dunya.style.transform = `translateX(${(kam - 1) * 50}%)`;
    },

    /* Bir turu kurar: öğütücü tarafını yeni kelimelerle doldurur,
       atölye tarafını sıfırlar. gecisli=true ise kamera sağa dönerek gelir. */
    rondKur(gecisli) {
        const s = this.state;
        // Her tur (ilk açılış dahil) rastgele kelimelerle kurulur; merkezî
        // veri yüklenemezse yerleşik turlara düşülür.
        s.words = this.rastgeleKelimeSeti() || this.shuffle(GAME2_ROUNDS[s.roundIdx].slice());
        s.grindCount = 0;
        s.bekleyen = [];
        s.shelf = [];
        s.forgedPairs = new Set();
        s.forgedRoots = new Set();
        s.selRoot = null;
        s.phase = 'grind';
        this.dusumSayisi = 0;
        const fl = document.getElementById('g2-forklift');
        fl.classList.remove('hazir', 'donus');

        this.kamera(0, gecisli ? 1700 : 0);

        // İKİ yönerge TEK kartta, tam harekeli ve nokta ile; yalnız oyunun
        // EN BAŞINDA gösterilir, sonraki faz geçişlerinde bir daha çıkmaz.
        if (this.ilkYonerge) {
            this.ilkYonerge = false;
            this.yonergeGoster(
                'اِضْغَطْ عَلَى الْكَلِمَةِ لِتَسْتَخْرِجَ جَذْرَهَا.' +
                '<br>' +
                'اِخْتَرْ جَذْرًا ثُمَّ وَزْنًا لِتَصْنَعَ كَلِمَةً جَدِيدَةً.',
                true, 5200);
        }
        document.getElementById('g2-kapIc').innerHTML = '';
        document.getElementById('g2-kokraf').innerHTML = '';
        document.getElementById('g2-forkYuk').innerHTML = '';
        this.vitrinKok = null;
        this.vitrinSifirla();
        this.orsBosalt();
        this.vezinleriGuncelle();
        this.kelimeleriDoldur();
        document.getElementById('g2-karistirTus').classList.add('gorunur');
        // Ekran .active olduktan sonra ölç (start() showScreen'den önce çalışır)
        setTimeout(() => this.parkKur(), 60);
    },

    /* Rastgele kelime seti: en az 5 isim vezni olan 5 FARKLI kök seçilir,
       her birinden rastgele bir kelime alınır. Sete giren tanımsız köklere
       o an havuzdan BENZERSİZ renkler atanır (set içinde çakışma olmaz). */
    rastgeleKelimeSeti() {
        if (typeof wordEasterEggs === 'undefined') return null;
        const uygun = Object.keys(wordEasterEggs).filter(r => {
            if (r.length !== 3) return false;                     // üç harfli kökler
            return g2KokIsimVezinleri(r.split('').join(' ')).length >= 5;
        });
        if (uygun.length < 5) return null;
        const secilen = this.shuffle(uygun.slice()).slice(0, 5);
        const renkPaketi = this.shuffle(RASTGELE_RENKLER.slice());
        return secilen.map(r => {
            const spaced = r.split('').join(' ');
            if (!ROOT_COLORS[spaced] && !rastgeleRenkCache[spaced] && renkPaketi.length) {
                rastgeleRenkCache[spaced] = renkPaketi.pop();
            }
            const vezinler = g2KokIsimVezinleri(spaced);
            const secim = vezinler[Math.floor(Math.random() * vezinler.length)];
            return { word: secim.word, root: spaced };
        });
    },

    kelimeleriKaristir() {
        if (this.state.phase !== 'grind' || this.state.grindCount > 0) return;
        const yeni = this.rastgeleKelimeSeti();
        if (!yeni) return;
        App.playSound('click');
        this.state.words = yeni;
        this.kelimeleriDoldur();
    },

    /* Tek kelimelik yedek: hariç tutulan köklerin DIŞINDA, en az 5 isim
       vezinli rastgele bir kökten rastgele bir kelime getirir. Sete yeni
       giren köke, mevcut köklerle çakışmayan bir renk atanır. */
    rastgeleTekKelime(haricKokler) {
        if (typeof wordEasterEggs === 'undefined') return null;
        const aday = Object.keys(wordEasterEggs).filter(r => {
            if (r.length !== 3) return false;
            const spaced = r.split('').join(' ');
            if (haricKokler.has(spaced)) return false;
            return g2KokIsimVezinleri(spaced).length >= 5;
        });
        if (!aday.length) return null;
        const r = aday[Math.floor(Math.random() * aday.length)];
        const spaced = r.split('').join(' ');
        if (!ROOT_COLORS[spaced] && !rastgeleRenkCache[spaced]) {
            const kullanilan = new Set([...haricKokler].map(k => rootColors(k)[0]));
            const renk = this.shuffle(RASTGELE_RENKLER.slice()).find(c => !kullanilan.has(c[0]));
            rastgeleRenkCache[spaced] = renk || RASTGELE_RENKLER[Math.floor(Math.random() * RASTGELE_RENKLER.length)];
        }
        const vezinler = g2KokIsimVezinleri(spaced);
        return { word: vezinler[Math.floor(Math.random() * vezinler.length)].word, root: spaced };
    },

    /* ✕ ile çıkarılan kelimenin yerine anında yeni bir kelime gelir.
       (Amaç: Türkçede yaşayan türevleri olan kökleri seçebilmek.) */
    kelimeDegistir(i) {
        const s = this.state;
        if (this.state.phase !== 'grind') return;
        if (!s.words[i] || s.words[i].used) return;
        const haric = new Set(s.words.map(w => w.root).concat(s.bekleyen));
        const yeni = this.rastgeleTekKelime(haric);
        if (!yeni) return;
        App.playSound('click');
        s.words[i] = yeni;
        this.kelimeleriDoldur();
    },

    /* Forklift'in daimî park yeri: konteynırın tam altı (gerçek yerleşimden
       ölçülür; her ekran boyutunda konteynırı bulur). */
    parkYeri: 51,
    parkKur() {
        const fl = document.getElementById('g2-forklift');
        const kap = document.getElementById('g2-kap');
        const dunya = document.getElementById('g2-dunya');
        if (!fl || !kap || !dunya) return;
        const dr = dunya.getBoundingClientRect();
        const kr = kap.getBoundingClientRect();
        const flw = fl.getBoundingClientRect().width || 150;
        if (dr.width < 10) { setTimeout(() => this.parkKur(), 150); return; } // ekran henüz görünmüyor
        this.parkYeri = ((kr.left + kr.width * .5 - flw * .5 - dr.left) / dr.width) * 100;
        fl.style.transition = 'none';
        fl.style.left = this.parkYeri + '%';
        requestAnimationFrame(() => { fl.style.transition = ''; });
    },

    kelimeleriDoldur() {
        const liste = document.getElementById('g2-kelimeler');
        liste.innerHTML = '';
        this.state.words.forEach((w, i) => {
            const chip = document.createElement('div');
            chip.className = 'g2-word-chip' + (w.used ? ' used' : '');
            chip.dir = 'rtl';
            chip.style.animationDelay = (i * 0.16) + 's';
            // Zaid (kökten gelmeyen ek) harfler burada da kırmızı gösteriliyor.
            chip.innerHTML = `<span class="g3-pattern-text">${formatWordVsRoot(w.word, w.root)}</span>` +
                `<span class="g2-cikar" title="كَلِمَة أُخْرَى">×</span>`;
            chip.dataset.index = i;
            // Kelimenin çerçevesi ait olduğu kökün rengini alıyor.
            paintRootBadge(chip, w.root);
            liste.appendChild(chip);

            // Sürükleme yok: kelimeye TIKLANINCA kendiliğinden banda uçar
            chip.addEventListener('click', () => this.kelimeTikla(chip, w));
            // ✕: bu kelimeyi çıkar, yerine başka kökten yenisi gelsin
            chip.querySelector('.g2-cikar').addEventListener('click', (e) => {
                e.stopPropagation();
                this.kelimeDegistir(i);
            });
        });
    },

    grinds: 0,

    /* Tıklanan kelime kutusundan bandın ucuna kısa bir uçuş, sonra öğütme */
    kelimeTikla(chip, w) {
        // Atölye fazındayken kaydırıp geri gelen oyuncu kelimeye tıklarsa
        // öğütmeye kendiliğinden dönülür (raftaki kökler kaybolmaz).
        if (this.state.phase === 'forge' && !this.dovuyor) this.state.phase = 'grind';
        if (this.state.phase !== 'grind') return;
        if (chip.classList.contains('used')) return;
        chip.classList.add('used');
        w.used = true; // liste yeniden çizilirse durum korunur
        App.playSound('click');
        // İlk kelime yola çıktı: karıştırma tuşu kaybolur
        document.getElementById('g2-karistirTus').classList.remove('gorunur');

        const bant = document.getElementById('g2-bant');
        const cr = chip.getBoundingClientRect(), br = bant.getBoundingClientRect();
        const ucan = document.createElement('div');
        ucan.className = 'g2-ghost g2-ucan';
        ucan.dir = 'rtl';
        ucan.innerHTML = `<span class="g3-pattern-text">${formatWordVsRoot(w.word, w.root)}</span>`;
        paintRootBadge(ucan, w.root);
        ucan.style.left = (cr.left + cr.width / 2) + 'px';
        ucan.style.top = (cr.top + cr.height / 2) + 'px';
        document.body.appendChild(ucan);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            ucan.style.left = (br.right - 6) + 'px';
            ucan.style.top = (br.top - 2) + 'px';
            ucan.style.transform = 'translate(-50%,-100%) scale(.8)';
        }));
        setTimeout(() => { ucan.remove(); this.ogut(w); }, 480);
    },

    ogut(w) {
        const fab = document.getElementById('g2-fabrika');
        const bant = document.getElementById('g2-bant');
        const govde = document.getElementById('g2-govde');
        const rampa = document.getElementById('g2-rampa');
        const kap = document.getElementById('g2-kap');
        const fr = fab.getBoundingClientRect();

        /* 1) Kelime, giriş bandının sağ ucuna biner ve makinenin
              ağzına doğru kayar; ağza varınca küçülüp kaybolur. */
        const gez = document.createElement('div');
        gez.className = 'g2-gezgin';
        gez.dir = 'rtl';
        gez.innerHTML = `<span class="g3-pattern-text">${formatWordVsRoot(w.word, w.root)}</span>`;
        paintRootBadge(gez, w.root);
        fab.appendChild(gez);
        const br = bant.getBoundingClientRect(), gr = govde.getBoundingClientRect();
        gez.style.left = (br.right - fr.left - 8) + 'px';
        gez.style.top = (br.top - fr.top - 4) + 'px';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            gez.style.left = (gr.right - fr.left - 6) + 'px';
            gez.style.transform = 'translate(-50%,-100%) scale(.4)';
            gez.style.opacity = '0';
        }));

        setTimeout(() => {
            gez.remove();
            /* 2) Makine öğütür: gövde zorlanır gibi titrer, kırıcılar
                  hızlanır, bacadan duman tüter. Aynı anda birden çok
                  kelime öğütülebilsin diye sayaç tutuluyor. */
            this.grinds++;
            fab.classList.add('grinding');
            App.playSound('grind');

            setTimeout(() => {
                this.grinds--;
                if (this.grinds <= 0) fab.classList.remove('grinding');

                /* 3) Saf metal çıktı: kök yazılı altın külçe, eğimli
                      rampanın dibinden tepesine tırmanır. */
                const rr = rampa.getBoundingClientRect();
                const kulce = document.createElement('div');
                kulce.className = 'g2-kulce g2-kulce-gezgin';
                kulce.dir = 'rtl';
                kulce.textContent = formatRootDisplay(w.root);
                fab.appendChild(kulce);
                kulce.style.left = (rr.right - fr.left - 20) + 'px';
                kulce.style.top = (rr.bottom - fr.top - 12) + 'px';
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    kulce.style.left = (rr.left - fr.left + 22) + 'px';
                    kulce.style.top = (rr.top - fr.top - 2) + 'px';
                }));

                setTimeout(() => {
                    /* 4) Rampanın ucundan şeffaf konteynıra düşer. Düşüş noktası
                          her seferinde farklı: külçeler simetrik yığılmaz,
                          gerçek bir kap gibi rastgele savrulup birikir. */
                    const kr = kap.getBoundingClientRect();
                    /* Külçeler sırayla bir SOLA bir SAĞA savrulur (asimetrik) */
                    this.dusumSayisi = (this.dusumSayisi || 0) + 1;
                    const solda = this.dusumSayisi % 2 === 1;
                    const dagilX = solda ? (.14 + Math.random() * .24) : (.6 + Math.random() * .24);
                    const donme = (Math.random() * 26 - 13).toFixed(1);
                    kulce.classList.add('dusuyor');
                    kulce.style.left = (kr.left - fr.left + kr.width * dagilX) + 'px';
                    kulce.style.top = (kr.top - fr.top + kr.height * (.34 + Math.random() * .2)) + 'px';
                    kulce.style.transform = `translate(-50%,-50%) rotate(${donme}deg) scale(.94)`;

                    setTimeout(() => {
                        kulce.remove();
                        const kalici = document.createElement('div');
                        kalici.className = 'g2-kulce';
                        kalici.dir = 'rtl';
                        kalici.textContent = formatRootDisplay(w.root);
                        // Kapta da çarpık dursun; sol/sağ tarafına yaslanarak biriksin
                        kalici.style.transform = `rotate(${donme}deg)`;
                        if (solda) {
                            kalici.style.marginRight = 'auto';
                            kalici.style.marginLeft = Math.round(Math.random() * 8) + 'px';
                        } else {
                            kalici.style.marginLeft = 'auto';
                            kalici.style.marginRight = Math.round(Math.random() * 8) + 'px';
                        }
                        document.getElementById('g2-kapIc').appendChild(kalici);
                        App.playSound('clink');

                        this.state.grindCount++;
                        this.state.bekleyen.push(w.root);
                        this.state.doneTotal++;
                        // Konteynırda külçe var: bekleyen forklift vurgulanır
                        if (this.state.phase === 'grind') {
                            document.getElementById('g2-forklift').classList.add('hazir');
                        }
                        if (this.state.grindCount === this.state.words.length) {
                            // Bütün kelimeler öğütüldü: kamera atölyeye kayar.
                            setTimeout(() => this.atolyeyeGec(), 900);
                        }
                    }, 460);
                }, 1000);
            }, 1150);
        }, 900);
    },

    /* ---------- 2. PERDE: ATÖLYE ---------- */

    atolyeyeGec() {
        // Yalnız öğütme fazında ve konteynırda külçe varken çalışır
        if (this.state.phase !== 'grind' || !this.state.bekleyen.length) return;
        this.state.phase = 'pan';
        // Raftaki vezni bitmemiş kökler YERİNDE kalır (yeniden taşınmaz);
        // forklift yalnız konteynırdaki YENİ kökleri getirir.
        const yarimlar = this.state.shelf.filter(r => this.kalanVezin(r) > 0);
        const yeniler = [...new Set(this.state.bekleyen)].filter(r => !yarimlar.includes(r));
        this.state.shelf = [...yarimlar, ...yeniler];
        this.state.tasinan = yeniler;
        this.state.bekleyen = [];
        document.getElementById('g2-forklift').classList.remove('hazir');
        // Rafı komple silme: yalnız vezinleri bitmiş (pasif) çipler kalkar,
        // yarım köklerin çipleri işaretleriyle birlikte rafta durur.
        document.querySelectorAll('.g2-kok-kulce').forEach(k => {
            if (!yarimlar.includes(k.dataset.kok)) k.remove();
        });
        App.playSound('forklift');
        this.kamera(1, 1700);
        this.forkliftTasi(); // kamera kayarken forklift de yola çıkar
    },

    /* Forklift zaten konteynırın altında bekler: yükü alır, burnunu
       çevirir, kesintisiz sahne boyunca rafın dibine sürer, boşaltır,
       sonra park yerine döner. */
    forkliftTasi() {
        const fl = document.getElementById('g2-forklift');
        const yuk = document.getElementById('g2-forkYuk');
        const raf = document.getElementById('g2-kokraf');
        const dunya = document.getElementById('g2-dunya');

        setTimeout(() => {
            // Yük çatala biner, konteynır boşalır, burun rafa döner
            document.getElementById('g2-kapIc').innerHTML = '';
            const tasinan = this.state.tasinan || this.state.shelf;
            yuk.innerHTML = tasinan.map(r =>
                `<div class="g2-kulce g2-mini" dir="rtl">${formatRootDisplay(r)}</div>`).join('');
            fl.classList.add('donus');
            const dr = dunya.getBoundingClientRect();
            const rr = raf.getBoundingClientRect();
            const flw = fl.getBoundingClientRect().width;
            const hedef = Math.max(.5, ((rr.left - dr.left - flw * .92) / dr.width) * 100);
            fl.style.left = hedef + '%';
            App.playSound('forklift');
        }, 450);

        setTimeout(() => {
            // Külçeler rafın dibinde tek tek boşaltılır (yalnız yeni gelenler)
            const tasinan = this.state.tasinan || this.state.shelf;
            tasinan.forEach((r, i) => {
                setTimeout(() => {
                    if (yuk.firstElementChild) yuk.firstElementChild.remove();
                    const k = document.createElement('div');
                    k.className = 'g2-kulce g2-kok-kulce';
                    k.dir = 'rtl';
                    k.dataset.kok = r;
                    k.textContent = formatRootDisplay(r);
                    k.style.color = rootColors(r)[0];
                    k.addEventListener('click', () => this.kokSec(r, k));
                    // Önceki partiden gelen, en az bir kez dövülmüş kök ✓ ile iner
                    if (this.state.forgedRoots.has(r)) {
                        k.classList.add('islendi');
                        k.insertAdjacentHTML('beforeend', '<span class="g2-kk-check">✓</span>');
                    }
                    raf.appendChild(k);
                    App.playSound('clink');
                }, i * 240);
            });
            setTimeout(() => {
                this.state.phase = 'forge';
                // Boşaltma bitti: konteynırın altındaki yerine döner
                fl.style.left = this.parkYeri + '%';
                App.playSound('forklift');
                setTimeout(() => fl.classList.remove('donus'), 1550);
            }, tasinan.length * 240 + 250);
        }, 450 + 1650);
    },

    kokSec(root, chipEl) {
        if (this.state.phase !== 'forge') return;
        if (this.kalanVezin(root) === 0) return; // bütün vezinleri kullanılmış
        if (this.dovuyor) return;
        this.state.selRoot = root;
        App.playSound('click');
        // Vitrin tek kökün dükkânıdır: başka köke geçilince raflar boşalır
        if (this.vitrinKok && this.vitrinKok !== root) {
            this.vitrinSifirla();
            this.vitrinDoldur(root); // bu kökün önceden dövülenleri hatırlanır
        }
        this.vitrinKok = root;
        document.querySelectorAll('.g2-kok-kulce').forEach(k => k.classList.remove('secili'));
        chipEl.classList.add('secili');
        // Seçilen kök örse konur (kendi rengiyle); usta çekicini kaldırır
        document.getElementById('g2-orsIc').innerHTML =
            `<span style="color:${rootColors(root)[0]}">${formatRootDisplay(root)}</span>`;
        document.getElementById('g2-orsKutu').classList.add('hazir');
        this.vezinleriGuncelle();
    },

    /* Vitrin tek kökün ürünlerini sergiler; boşaltmak için */
    vitrinKok: null,

    /* Çift yüzlü ürün kartı: ön = emoji + kelime, arka = Türkçe anlam.
       Hem dövme anında hem vitrini hafızadan geri doldururken kullanılır. */
    urunKartiEkle(out, root, vezin) {
        const urun = document.createElement('div');
        urun.className = 'g2-urun';
        urun.dir = 'rtl';
        urun.style.borderColor = rootColors(root)[0];
        urun.innerHTML =
            `<div class="g2-urun-ic">` +
            `<div class="g2-urun-on"><span class="g2-urun-emoji">${vezin.emoji}</span><span class="g2-urun-kelime"><span class="g3-pattern-text">${formatWordVsRoot(vezin.word, root)}</span></span></div>` +
            `<div class="g2-urun-arka" dir="ltr">${vezin.tr || '—'}</div>` +
            `</div>`;
        urun.addEventListener('click', () => {
            App.playSound('click');
            urun.classList.toggle('cevrik');
        });
        out.appendChild(urun);
        return urun;
    },

    /* Kökler arasında gezinme hafızası: bu kök için daha önce dövülmüş
       kelimeler (forgedPairs) vitrine geri dizilir — emek kaybolmaz. */
    vitrinDoldur(root) {
        const out = document.getElementById('g2-vitrinKutu');
        if (!out) return;
        const eskiler = this.kokVezinleri(root)
            .filter(v => this.state.forgedPairs.has(root + '|' + v.no));
        if (!eskiler.length) return;
        const bekle = out.querySelector('.g3-out-bekle');
        if (bekle) bekle.remove();
        eskiler.forEach(v => this.urunKartiEkle(out, root, v));
        this.vitrinYerlestir();
    },

    vitrinSifirla() {
        const vit = document.getElementById('g2-vitrinKutu');
        if (!vit) return;
        vit.classList.remove('filled', 'invalid');
        vit.style.gridTemplateColumns = '1fr';
        vit.style.gridTemplateRows = '';
        vit.style.gridAutoFlow = '';
        vit.innerHTML = '<span class="g3-out-bekle">✨</span>';
    },

    /* SABİT vitrinde akıllı yerleşim: n kelime için tüm satır×sütun
       kombinasyonları denenir, kelimeleri EN BÜYÜK gösteren seçilir.
       (6 kelime → 2 sütun × 3 raf, 9 kelime → 3 sütun × 3 raf gibi) */
    vitrinYerlestir() {
        const out = document.getElementById('g2-vitrinKutu');
        if (!out) return;
        const n = out.querySelectorAll('.g2-urun').length;
        if (!n) return;
        const st = getComputedStyle(out);
        const W = out.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight);
        const H = out.clientHeight - parseFloat(st.paddingTop) - parseFloat(st.paddingBottom);
        /* Sütun sayısı kökün TOPLAM vezin sayısına bağlı: 10 ve üzeri
           vezni olan kökte 3 sütun, daha az olanda 2 sütun. Yazı boyu da
           toplamdan hesaplanır: kelimeler dövüldükçe kart boyutu oynamaz,
           hepsi bitince vitrin tam dolar. */
        const kok = this.vitrinKok;
        const toplam = Math.max(n, kok ? this.kokVezinleri(kok).length : n);
        const SUTUN = toplam >= 10 ? 3 : 2;
        const satir = Math.max(2, Math.ceil(toplam / SUTUN));
        const araY = parseFloat(getComputedStyle(out).rowGap) || 0;
        const font = Math.min((W / SUTUN) / 5.0, ((H - (satir - 1) * araY) / satir) / 3.3);
        out.style.gridTemplateColumns = `repeat(${SUTUN}, 1fr)`;
        /* Akış SÜTUN SÜTUN: ilk kelime sağ üstte, sonraki hemen ALTINA gelir;
           sütun (planlanan raf sayısı kadar) dolunca soldaki sütuna geçilir.
           Satırlar 1fr: vitrin yüksekliği her zaman eşit paylaşılır. */
        out.style.gridAutoFlow = 'column';
        out.style.gridTemplateRows = `repeat(${satir}, 1fr)`;
        out.style.setProperty('--uf', Math.min(48, Math.max(12, font)).toFixed(1) + 'px');
    },

    /* Örs boşalır, usta çekicini indirir (dinlenme pozu) */
    orsBosalt() {
        const ic = document.getElementById('g2-orsIc');
        if (ic) ic.innerHTML = '';
        const kutu = document.getElementById('g2-orsKutu');
        if (kutu) kutu.classList.remove('hazir');
    },

    /* Vezin levhaları: kök seçili değilken panel boştur; kök seçilince
       YALNIZ o köke veri_kokler.js'te tanımlı İSİM vezinleri belirir.
       Vezin adındaki zaid harfler ف ع ل köküne göre kırmızı boyanır. */
    vezinleriGuncelle() {
        const panel = document.getElementById('g2-vezinler');
        panel.innerHTML = '';
        const root = this.state.selRoot;
        panel.style.removeProperty('--vf');
        if (!root) return;
        const liste = this.kokVezinleri(root);
        /* Çok vezinli köklerde panel 3 satıra çıkar. Akış SATIR SATIR:
           önce üst satır sağdan sola dolar, sonra alttaki — böylece liste
           yukarıdan aşağıya doğru okunur. */
        const satirSayisi = liste.length > 8 ? 3 : 2;
        const sutunSayisi = Math.max(1, Math.ceil(liste.length / satirSayisi));
        panel.style.gridTemplateRows = '';
        panel.style.gridTemplateColumns = `repeat(${sutunSayisi}, max-content)`;
        liste.forEach(e => {
            const b = document.createElement('div');
            b.dir = 'rtl';
            const dovulmus = this.state.forgedPairs.has(root + '|' + e.no);
            // Dövülmüş vezin ✓ ile işaretli kalır; kök diğer vezinleriyle
            // çalışmaya devam edebilir (tek vezinle pasifleşmez).
            b.className = 'g2-vezin' + (dovulmus ? ' bitti' : ' aktif');
            b.innerHTML = `<span class="g3-pattern-text">${formatWordVsRoot(e.vezinAr || e.word, 'ف ع ل')}</span>`;
            if (!dovulmus) b.addEventListener('click', () => this.dovVeUret(e, b));
            panel.appendChild(b);
        });
        this.vezinleriSigdir();
    },

    /* Levhalar sahneye sığana kadar yazı boyu kademeli küçültülür
       (vitrindeki "en büyük boyut" mantığının vezin paneli karşılığı). */
    vezinleriSigdir() {
        const panel = document.getElementById('g2-vezinler');
        const ic = panel && panel.parentElement;
        if (!ic) return;
        let deneme = 0;
        const adim = () => {
            if (deneme++ > 12) return;
            /* scrollWidth ortalanmış (margin:auto) taşmayı her tarayıcıda
               saymaz; panelin kendi genişliği kapla karşılaştırılır. */
            const panelW = panel.getBoundingClientRect().width;
            if (panelW <= ic.clientWidth + 2 && ic.scrollWidth <= ic.clientWidth + 2) return; // sığdı
            const ornek = panel.querySelector('.g2-vezin');
            if (!ornek) return;
            const su = parseFloat(getComputedStyle(ornek).fontSize);
            panel.style.setProperty('--vf', (su * .88).toFixed(1) + 'px');
            requestAnimationFrame(adim);
        };
        requestAnimationFrame(adim);
    },

    /* Usta seçilen kökü seçilen vezinle döver; kelime vitrine uçar.
       vezin = g2KokIsimVezinleri'nden bir kayıt: {no, vezinAr, word, emoji, tr} */
    dovuyor: false,
    dovVeUret(vezin, vezinEl) {
        if (this.state.phase !== 'forge' || this.dovuyor) return;
        const root = this.state.selRoot;
        const word = root && vezin.word;
        if (!word) return;
        this.dovuyor = true;
        vezinEl.classList.add('secili');

        const usta = document.getElementById('g2-usta');
        const orsKutu = document.getElementById('g2-orsKutu');
        const ors = document.getElementById('g2-ors');
        const kivilcimlar = document.getElementById('g2-kivilcimlar2');
        const out = document.getElementById('g2-vitrinKutu');

        usta.classList.add('calisiyor');
        const VURUS_ARASI = 340, VURUS_SAYISI = 3;
        const kivilcimSac = () => {
            for (let i = 0; i < 9; i++) {
                const k = document.createElement('span');
                k.className = 'g3-kivilcim';
                const aci = (Math.random() * .9 + .05) * Math.PI;
                const uzak = 34 + Math.random() * 52;
                k.style.setProperty('--kx', (Math.cos(aci) * uzak).toFixed(0) + 'px');
                k.style.setProperty('--ky', (-Math.sin(aci) * uzak).toFixed(0) + 'px');
                k.style.background = Math.random() < .5 ? '#f6b93b' : '#e67e22';
                kivilcimlar.appendChild(k);
                setTimeout(() => k.remove(), 650);
            }
        };
        for (let v = 0; v < VURUS_SAYISI; v++) {
            setTimeout(() => {
                App.playSound('hammer');
                kivilcimSac();
                orsKutu.classList.add('sarsil');
                setTimeout(() => orsKutu.classList.remove('sarsil'), 220);
            }, 260 + v * VURUS_ARASI);
        }

        setTimeout(() => {
            usta.classList.remove('calisiyor');
            App.playSound('ding');

            // Kelime örsten vitrine süzülür (zaid harfler köke göre kırmızı)
            const wordHtml = `<span class="g3-pattern-text">${formatWordVsRoot(word, root)}</span>`;
            const oR = ors.getBoundingClientRect();
            // Kart önce GİZLİ eklenir; kelime vitrinin ortasına değil,
            // kartın gerçekten çıkacağı rafa/hücreye uçar.
            const bekle = out.querySelector('.g3-out-bekle');
            if (bekle) bekle.remove();
            const urun = this.urunKartiEkle(out, root, vezin);
            urun.style.visibility = 'hidden';
            this.vitrinYerlestir();
            const hedefR = urun.getBoundingClientRect();
            const flow = document.createElement('div');
            flow.className = 'g3-flow-word';
            flow.dir = 'rtl';
            flow.innerHTML = wordHtml;
            flow.style.setProperty('--root-solid', rootColors(root)[0]);
            flow.style.left = (oR.left + oR.width / 2) + 'px';
            flow.style.top = (oR.top + oR.height / 2) + 'px';
            document.body.appendChild(flow);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                flow.style.left = (hedefR.left + hedefR.width / 2) + 'px';
                flow.style.top = (hedefR.top + hedefR.height / 2) + 'px';
                flow.style.transform = 'translate(-50%, -50%) scale(.55)';
                flow.style.opacity = '0';
            }));

            setTimeout(() => {
                flow.remove();
                // Uçuş bitti: gizli kart yerinde belirir (popIn yeniden oynar)
                urun.style.visibility = '';
                urun.style.animation = 'none';
                void urun.offsetWidth;
                urun.style.animation = '';

                // Çift işlendi olarak kaydedilir; kök ilk kez dövüldüyse sayaç ilerler
                this.state.forgedPairs.add(root + '|' + vezin.no);
                if (!this.state.forgedRoots.has(root)) {
                    this.state.forgedRoots.add(root);
                    this.state.doneTotal++;
                }

                // Raf külçesi: bütün vezinleri bittiyse pasifleşir, yoksa
                // ✓ rozetiyle AKTİF kalır (başka vezinlerle tekrar dövülebilir)
                const secilikulce = document.querySelector('.g2-kok-kulce.secili');
                if (this.kalanVezin(root) === 0) {
                    this.state.selRoot = null;
                    this.orsBosalt();
                    if (secilikulce) {
                        secilikulce.classList.remove('secili', 'islendi');
                        secilikulce.classList.add('kullanildi');
                    }
                } else if (secilikulce) {
                    secilikulce.classList.add('islendi'); // kök seçili ve örste kalır
                    if (!secilikulce.querySelector('.g2-kk-check')) {
                        secilikulce.insertAdjacentHTML('beforeend', '<span class="g2-kk-check">✓</span>');
                    }
                }
                this.vezinleriGuncelle();
                this.dovuyor = false;

                // Tuşsuz akış: yalnız partideki TÜM vezinler dövülünce
                // kendiliğinden ilerler. Tek vezin dövmek atölyeden atmaz;
                // isteyen kalan vezinlerle üretmeye devam eder, isteyen
                // kaydırıp öğütücüye döner (kelimeye tıklamak yeter).
                const hepsiDovuldu = this.state.shelf.every(r => this.kalanVezin(r) === 0);
                if (hepsiDovuldu) {
                    setTimeout(() => this.ilerle(), 1300);
                }
            }, 1450);
        }, 260 + VURUS_SAYISI * VURUS_ARASI + 120);
    },

    /* Parti bitti: sırada ne varsa oraya — konteynırda bekleyen külçe varsa
       yeni parti, öğütülmemiş kelime varsa değirmene dönüş, yoksa yeni tur. */
    ilerle() {
        if (this.dovuyor) return;
        if (this.state.phase !== 'forge') return; // çifte tetiklenme koruması
        this.state.selRoot = null;
        this.orsBosalt();

        if (this.state.bekleyen.length) {
            // Atölyedeyken yeni külçeler birikmiş: forklift yeni partiyi getirsin
            this.state.phase = 'grind';
            this.atolyeyeGec();
            return;
        }
        if (this.state.grindCount < this.state.words.length) {
            // Öğütülecek kelime kaldı: kamera değirmene döner
            this.state.phase = 'grind';
            this.kamera(0, 1700);
            document.getElementById('g2-kokraf').innerHTML = '';
            this.vezinleriGuncelle();
            return;
        }
        this.rondBitti();
    },

    rondBitti() {
        this.state.roundIdx++;
        if (this.state.roundIdx >= GAME2_ROUNDS.length) {
            /* NOT: Kelime Fabrikasi PUAN URETMEZ (yanlis yolu yok) — sure
               takibi gorevkopru'nun sureTakibiBaslat() kanaliyla yapilir. */
            App.showDone('🏭', 'أَحْسَنْتَ! مِنَ الْكَلِمَةِ إِلَى الْجَذْرِ وَمِنَ الْجَذْرِ إِلَى الْكَلِمَةِ.');
            document.getElementById('done-replay').onclick = () => {
                App.hideDone();
                this.start();
            };
            return;
        }
        // Kamera sağa döner, yeni kelime partisi hazır bekler
        this.rondKur(true);
    }
};

/* =========================================================
   OYUN 3 — الجَذْر وَالوَزْن (çoklu kökü aynı kalıba/vezne atma)
========================================================= */
const Game3 = {
    state: { patternIdx: 0, doneSet: new Set() },

    totalValid() {
        return GAME3_PATTERNS.reduce((sum, p) => sum + Object.keys(p.map).length, 0);
    },

    start() {
        this.state.patternIdx = 0;
        this.state.doneSet = new Set();
        this.render();
    },

    render() {
        const pattern = GAME3_PATTERNS[this.state.patternIdx];
        const screen = document.getElementById('game3-screen');
        screen.innerHTML = `
            <div class="back-btn" id="g3-back">${BACK_SVG}</div>
            <div class="progress-pill" id="g3-progress">${this.state.doneSet.size} / ${this.totalValid()}</div>
            <div class="g3-wrap">
                <div class="g1-title" dir="rtl">اُسْحَبِ الْجَذْرَ إِلَى الْوَزْنِ لِتَصْنَعَ كَلِمَةً جَدِيدَةً.</div>
                <div class="g3-stage">
                    <!-- VİTRİN: türeyen kelime, tenteli bir dükkân vitrininde sergilenir -->
                    <div class="g3-vitrin">
                        <div class="g3-tente"></div>
                        <div class="g3-output-slot" id="g3-output"><span class="g3-out-bekle">✨</span></div>
                        <div class="g3-raf"></div>
                    </div>
                    <!-- ATÖLYE: vezin, çekiç kullanan bir USTA; kök vezin levhasının
                         altındaki örse bırakılır, usta onu dövüp işler -->
                    <div class="g3-pattern-box">
                        <div class="g3-pattern-nav">
                            <div class="g3-pattern-arrow" id="g3-prev">‹</div>
                            <div class="g3-ors-kutu" id="g3-orsKutu">
                                <div class="g3-vezin-levha" dir="rtl"><span class="g3-pattern-text">${formatPatternDisplay(pattern)}</span></div>
                                <div class="drop-zone g3-pattern-slot" id="g3-slot" dir="rtl"><span class="g3-slot-ic" id="g3-slotIc">${G3_ORS_SVG}</span></div>
                                <div class="g3-usta" id="g3-usta">${G3_USTA_SVG}</div>
                                <div class="g3-kivilcimlar" id="g3-kivilcimlar"></div>
                                <div class="g3-tezgah"></div>
                            </div>
                            <div class="g3-pattern-arrow" id="g3-next">›</div>
                        </div>
                    </div>
                    <div class="g3-roots" id="g3-roots"></div>
                </div>
            </div>
        `;
        document.getElementById('g3-back').addEventListener('click', () => {
            App.playSound('click');
            if (App.tekOyunCikis()) return;
            App.showScreen('start-screen');
        });
        document.getElementById('g3-prev').addEventListener('click', () => {
            App.playSound('click');
            this.changePattern(-1);
        });
        document.getElementById('g3-next').addEventListener('click', () => {
            App.playSound('click');
            this.changePattern(1);
        });

        const rootsWrap = document.getElementById('g3-roots');
        Object.keys(pattern.map).forEach((r) => {
            const chip = document.createElement('div');
            chip.className = 'g3-root-chip';
            chip.dir = 'rtl';
            chip.textContent = formatRootDisplay(r);
            paintRootChip(chip, r);
            rootsWrap.appendChild(chip);

            App.makeDraggable(chip, {
                getClone: () => {
                    const c = document.createElement('div');
                    c.className = 'g3-ghost';
                    c.dir = 'rtl';
                    c.textContent = formatRootDisplay(r);
                    paintRootChip(c, r);
                    return c;
                },
                onDrop: (target) => this.handleDrop(target, r)
            });
        });
    },

    changePattern(delta) {
        if (this.forging) return; // usta çalışırken sahne değişmez
        this.state.patternIdx = (this.state.patternIdx + delta + GAME3_PATTERNS.length) % GAME3_PATTERNS.length;
        this.render();
    },

    handleDrop(target, root) {
        if (!target.classList.contains('g3-pattern-slot')) return;
        if (this.forging) return; // çekiç çalışırken yeni kök alınmaz
        const pattern = GAME3_PATTERNS[this.state.patternIdx];
        const word = pattern.map[root];
        const slot = document.getElementById('g3-slot');
        const out = document.getElementById('g3-output');
        out.classList.remove('filled', 'invalid');
        // Çıkış kutusu, bırakılan kökün rengini alır ve kelime belirdikten
        // sonra da o renkte kalır (yeşile dönmez).
        paintRootOutline(out, root);

        if (!word) {
            App.playSound('wrong');
            slot.classList.add('shake');
            setTimeout(() => slot.classList.remove('shake'), 400);
            out.classList.add('invalid');
            out.innerHTML = `<span class="empty-msg">لا تُوجَد كَلِمَة بِهٰذا الوَزْن 🚫</span>`;
            return;
        }

        // Türeyen kelimede de zaid harfler kırmızı gösteriliyor (kalıptaki
        // zaid index'leri türeyen kelimede aynı harflere denk gelir).
        const wordHtml = `<span class="g3-pattern-text">${formatDerivedDisplay(word, pattern)}</span>`;
        // Önce atölye çalışır: usta çekicini 3 kez indirir, kıvılcımlar saçılır;
        // ancak ondan sonra işlenmiş kelime vitrine süzülür.
        this.dov(slot, root, () => {
            App.playSound('correct');
            this.flowWordToOutput(wordHtml, slot, out, root, () => {
            out.classList.add('filled');
            // Sadece emoji + büyük kelime; "kök + vezin" bilgi satırı bilinçli
            // olarak gösterilmiyor (öğrenci zaten o ikisini birleştirdi).
            const emoji = GAME3_EMOJI[word] || '⭐';
            out.innerHTML = `<div class="g3-out-emoji">${emoji}</div><div class="g3-out-word">${wordHtml}</div>`;

            const key = pattern.name + '|' + root;
            if (!this.state.doneSet.has(key)) {
                this.state.doneSet.add(key);
                document.getElementById('g3-progress').textContent = `${this.state.doneSet.size} / ${this.totalValid()}`;
                if (this.state.doneSet.size === this.totalValid()) {
                    setTimeout(() => {
                        App.showDone('🏆', 'أَحْسَنْتَ! لَقَدِ اكْتَشَفْتَ كُلَّ الِاشْتِقَاقَاتِ.');
                        document.getElementById('done-replay').onclick = () => {
                            App.hideDone();
                            this.start();
                        };
                    }, 900);
                }
            }
            });
        });
    },

    /* ATÖLYE EFEKTİ — usta çekicini örsteki kökün üzerine 3 kez indirir; her
       vuruşta örs sarsılır, kıvılcım saçılır ve "tak" sesi çalar. Dövme boyunca
       bırakılan kök örsün üstünde görünür; bitince done() çağrılır. */
    forging: false,
    dov(slot, root, done) {
        this.forging = true;
        const usta = document.getElementById('g3-usta');
        const kivilcimlar = document.getElementById('g3-kivilcimlar');
        const orsKutu = document.getElementById('g3-orsKutu');
        const slotIc = document.getElementById('g3-slotIc');
        if (!usta || !orsKutu) { this.forging = false; done(); return; }

        // Kök, işlenmek üzere örsün üstüne konur (kendi rengiyle)
        if (slotIc) {
            slotIc.innerHTML = `<span class="g3-slot-kok" style="color:${rootColors(root)[0]}">${formatRootDisplay(root)}</span>`;
        }

        usta.classList.add('calisiyor');
        const VURUS_ARASI = 340, VURUS_SAYISI = 3;

        const kivilcimSac = () => {
            for (let i = 0; i < 9; i++) {
                const k = document.createElement('span');
                k.className = 'g3-kivilcim';
                const aci = (Math.random() * .9 + .05) * Math.PI;   // yukarı yarım daire
                const uzak = 34 + Math.random() * 52;
                k.style.setProperty('--kx', (Math.cos(aci) * uzak).toFixed(0) + 'px');
                k.style.setProperty('--ky', (-Math.sin(aci) * uzak).toFixed(0) + 'px');
                k.style.background = Math.random() < .5 ? '#f6b93b' : '#e67e22';
                kivilcimlar.appendChild(k);
                setTimeout(() => k.remove(), 650);
            }
        };

        for (let v = 0; v < VURUS_SAYISI; v++) {
            setTimeout(() => {
                App.playSound('hammer');
                kivilcimSac();
                orsKutu.classList.add('sarsil');
                setTimeout(() => orsKutu.classList.remove('sarsil'), 220);
            }, 260 + v * VURUS_ARASI);
        }

        setTimeout(() => {
            usta.classList.remove('calisiyor');
            // İş bitti: örs boşalır, kelime vitrine doğru yola çıkar
            if (slotIc) slotIc.innerHTML = G3_ORS_SVG;
            this.forging = false;
            done();
        }, 260 + VURUS_SAYISI * VURUS_ARASI + 120);
    },

    /* Doğru kelimenin kalıptan süzülerek çıkış kutusuna uçtuğu görsel efekt.
       wordHtml, zaid harfleri kırmızı gösteren hazır HTML'dir; uçan kelime de
       kökün rengiyle çizilir (varış kutusuyla aynı renk). */
    flowWordToOutput(wordHtml, slot, out, root, onArrive) {
        const slotRect = slot.getBoundingClientRect();
        const outRect = out.getBoundingClientRect();
        const flow = document.createElement('div');
        flow.className = 'g3-flow-word';
        flow.dir = 'rtl';
        flow.innerHTML = wordHtml;
        flow.style.setProperty('--root-solid', rootColors(root)[0]);
        flow.style.left = (slotRect.left + slotRect.width / 2) + 'px';
        flow.style.top = (slotRect.top + slotRect.height / 2) + 'px';
        document.body.appendChild(flow);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                flow.style.left = (outRect.left + outRect.width / 2) + 'px';
                flow.style.top = (outRect.top + outRect.height / 2) + 'px';
                flow.style.transform = 'translate(-50%, -50%) scale(.55)';
                flow.style.opacity = '0';
            });
        });

        setTimeout(() => {
            flow.remove();
            onArrive();
        }, 1450); // .g3-flow-word geçiş süresiyle (1.4s) uyumlu
    }
};


/* =========================================================
   OYUN 4: DİJİTAL YARIŞMA — "اِتَّصِلْ"
   ---------------------------------------------------------
   Öğretmen bir oda kurar (4 harfli kod + karekod + link),
   öğrenciler telefonlarından takım adıyla katılır, sorular
   herkeste eşzamanlı akar. Sorular BU DOSYANIN kendi
   verisinden (ROOTS_GAME1 / GAME2_ROUNDS / GAME3_PATTERNS /
   buildConjugation) üretilir; ayrı bir soru bankası yoktur.

   Firestore şeması:
     {SARF_KOLEKSIYON}/{ODA}          → { durum, faz, index, sure,
                                          soruZamani, sorular[] }
     {..}/{ODA}/takimlar/{id}         → { ad, puan, olusturmaZamani }
     {..}/{ODA}/cevaplar/{takim_idx}  → { takimId, index, secim,
                                          dogru, puan, zaman }
========================================================= */

function qzKaristir(dizi) {
    const x = dizi.slice();
    for (let i = x.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = x[i]; x[i] = x[j]; x[j] = t;
    }
    return x;
}

/* Doğru şıkkı havuzdaki 3 çeldiriciyle karıştırıp
   { secenekler, dogru } döndürür. */
function qzSoruYap(dogru, havuz) {
    const benzersiz = [];
    havuz.forEach(v => { if (v !== dogru && benzersiz.indexOf(v) === -1) benzersiz.push(v); });
    const hepsi = qzKaristir([dogru].concat(qzKaristir(benzersiz).slice(0, 3)));
    return { secenekler: hepsi, dogru: hepsi.indexOf(dogru) };
}

/* ---------------------------------------------------------
   SORU ÜRETİCİ — merkezî veriden (veri_kokler.js) beslenir.
   Dokuz soru ailesi:
   1) kelime → kök              2) kök → türeyen kelime
   3) kelime → vezin            4) kök + vezin → kelime
   5) fiil çekimi (mâzî/muzâri/emir)
   6) kelime → Türkçe anlam     7) anlam → kelime
   8) örnek cümlede boşluk      9) farklı kökten olanı bul
   10) zâid harfi bul
   Oda kurulurken üretilir, karıştırılıp istenen sayıda soru alınır.
--------------------------------------------------------- */

/* Merkezî isim-vezni kayıtları: {root, no, vezinAr, word, tr, ornek} */
function qzMerkeziKayitlar() {
    const L = [];
    if (typeof wordEasterEggs === 'undefined') return L;
    Object.keys(wordEasterEggs).forEach(duz => {
        if (duz.length < 3 || duz.length > 4) return;
        const root = duz.split('').join(' ');
        const d = wordEasterEggs[duz];
        Object.keys(d).forEach(no => {
            if (G2_FIIL_NOLARI.has(no)) return;
            const bs = d[no] && d[no].base;
            if (!bs || !bs.arText) return;
            L.push({
                root, no,
                vezinAr: (typeof KALIP_DATA !== 'undefined' && KALIP_DATA[no]) ? KALIP_DATA[no].ar : '',
                word: bs.arText,
                tr: bs.trText || '',
                ornek: (bs.ornek && bs.ornek.ar) ? bs.ornek : null
            });
        });
    });
    return L;
}

function quizSorulariUret() {
    const S = [];
    const M = qzMerkeziKayitlar();
    const ornekle = (dizi, n) => qzKaristir(dizi.slice()).slice(0, n);

    if (M.length) {
        const kokSet = new Set(M.map(x => x.root));
        const kokGorunum = Array.from(kokSet).map(r => formatRootDisplay(r));
        const tumKelimeler = M.map(x => x.word);
        const vezinAdlari = [];
        M.forEach(x => { if (x.vezinAr && vezinAdlari.indexOf(x.vezinAr) === -1) vezinAdlari.push(x.vezinAr); });
        const kokKelimeleri = {};
        M.forEach(x => { (kokKelimeleri[x.root] = kokKelimeleri[x.root] || []).push(x); });
        const kokler = Object.keys(kokKelimeleri);

        /* 1) Kelime → kök */
        ornekle(M, 26).forEach(x => {
            const k = qzSoruYap(formatRootDisplay(x.root), kokGorunum);
            S.push({ ar: x.word,
                s: 'ما جَذْرُ هٰذِهِ الكَلِمَة؟', tr: 'Bu kelimenin kökü hangisidir?',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 2) Kök → türeyen kelime */
        ornekle(kokler, 26).forEach(r => {
            const kendi = kokKelimeleri[r];
            const dogru = kendi[Math.floor(Math.random() * kendi.length)].word;
            const disHavuz = M.filter(y => y.root !== r).map(y => y.word);
            const k = qzSoruYap(dogru, disHavuz);
            S.push({ ar: formatRootDisplay(r),
                s: 'أَيُّ كَلِمَةٍ مُشْتَقَّةٌ مِنْ هٰذا الجَذْر؟', tr: 'Bu kökten türeyen kelime hangisidir?',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 3) Kelime → vezin */
        ornekle(M.filter(x => x.vezinAr), 26).forEach(x => {
            const k = qzSoruYap(x.vezinAr, vezinAdlari);
            S.push({ ar: x.word,
                s: 'ما وَزْنُ هٰذِهِ الكَلِمَة؟', tr: 'Bu kelimenin vezni hangisidir?',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 4) Kök + vezin → kelime (çeldiriciler önce AYNI kökün öbür vezinleri) */
        ornekle(M.filter(x => x.vezinAr), 26).forEach(x => {
            const aynikok = kokKelimeleri[x.root].filter(y => y.word !== x.word).map(y => y.word);
            const havuz = qzKaristir(aynikok).concat(qzKaristir(tumKelimeler.filter(w => w !== x.word)));
            const k = qzSoruYap(x.word, havuz);
            S.push({ ar: formatRootDisplay(x.root),
                s: 'أَيُّ كَلِمَةٍ عَلى وَزْنِ «' + x.vezinAr + '» مِنْ هٰذا الجَذْر؟',
                tr: '«' + x.vezinAr + '» vezninde bu kökten gelen kelime hangisidir?',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 6) Kelime → Türkçe anlam */
        const anlamli = M.filter(x => x.tr);
        ornekle(anlamli, 26).forEach(x => {
            const disAnlam = anlamli.filter(y => y.root !== x.root).map(y => y.tr);
            const k = qzSoruYap(x.tr, disAnlam);
            S.push({ ar: x.word,
                s: 'ما مَعْنى هٰذِهِ الكَلِمَة؟', tr: 'Bu kelimenin anlamı nedir?',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 7) Türkçe anlam → kelime */
        ornekle(anlamli, 26).forEach(x => {
            const disKelime = anlamli.filter(y => y.root !== x.root).map(y => y.word);
            const k = qzSoruYap(x.word, disKelime);
            S.push({ ar: '«' + x.tr + '»',
                s: 'أَيُّ كَلِمَةٍ تَحْمِلُ هٰذا المَعْنى؟', tr: 'Bu anlamı taşıyan kelime hangisidir?',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 8) Örnek cümlede boşluk doldurma */
        const cumleli = M.filter(x => x.ornek && x.ornek.ar &&
            x.ornek.ar.split(/\s+/).indexOf(x.word) !== -1);
        ornekle(cumleli, 26).forEach(x => {
            const aynikok = kokKelimeleri[x.root].filter(y => y.word !== x.word).map(y => y.word);
            const havuz = qzKaristir(aynikok).concat(qzKaristir(tumKelimeler.filter(w => w !== x.word)));
            const k = qzSoruYap(x.word, havuz);
            S.push({ ar: x.ornek.ar.split(/\s+/).map(t => t === x.word ? '______' : t).join(' '),
                s: 'أَكْمِلِ الفَراغ.', tr: 'Boşluğa uygun kelimeyi seç.',
                secenekler: k.secenekler, dogru: k.dogru });
        });

        /* 9) Farklı kökten olanı bul */
        const zenginKokler = kokler.filter(r => kokKelimeleri[r].length >= 3);
        ornekle(zenginKokler, 18).forEach(r => {
            const ucu = ornekle(kokKelimeleri[r], 3).map(y => y.word);
            const digerKok = ornekle(kokler.filter(q => q !== r), 1)[0];
            if (!digerKok) return;
            const yabanci = kokKelimeleri[digerKok][Math.floor(Math.random() * kokKelimeleri[digerKok].length)].word;
            const secenekler = qzKaristir(ucu.concat([yabanci]));
            S.push({ ar: '',
                s: 'أَيُّ كَلِمَةٍ مِنْ جَذْرٍ مُخْتَلِف؟', tr: 'Hangi kelime diğerlerinden FARKLI bir kökten gelir?',
                secenekler: secenekler, dogru: secenekler.indexOf(yabanci) });
        });

        /* 10) Zâid harfi bul: kelimede kökten OLMAYAN harf. Kök harfleriyle
           çakışan zâid harfler (ör. mîm'li köklerde ön ek م) atlanır ki tek
           doğru cevap kalsın. */
        const zaidli = [];
        M.forEach(x => {
            const rootHarf = x.root.split(' ').filter(Boolean);
            if (rootHarf.length !== 3) return;
            if (new Set(rootHarf).size !== 3) return; // tekrarlı kök harfi → çift seçenek olurdu
            const kumeler = splitArabicClusters(x.word);
            const zi = computeZaidIndices(x.word, x.root);
            if (!zi.length) return;
            const adaylar = zi.map(i => kumeler[i] && kumeler[i][0])
                .filter(h => h && rootHarf.indexOf(h) === -1);
            if (!adaylar.length) return;
            // ة gibi tek başına okunması güç işaretler de sorulabilir; sorun değil
            zaidli.push({ word: x.word, dogru: adaylar[0], rootHarf });
        });
        ornekle(zaidli, 18).forEach(x => {
            const secenekler = qzKaristir([x.dogru].concat(x.rootHarf));
            S.push({ ar: x.word,
                s: 'أَيُّ حَرْفٍ زائِدٌ في هٰذِهِ الكَلِمَة؟', tr: 'Bu kelimedeki zâid (kökten olmayan) harf hangisidir?',
                secenekler: secenekler, dogru: secenekler.indexOf(x.dogru) });
        });
    }

    /* 5) Fiil çekimi — mâzî / muzâri / emir (yerleşik çekim verisinden) */
    const zamanAd = {
        madi:   ['الماضي',    'geçmiş zaman (mâzî)'],
        mudari: ['المُضارِع',  'geniş/şimdiki zaman (muzâri)'],
        amr:    ['الأَمْر',    'emir']
    };
    const tumFiiller = [];
    const fiilSorulari = [];
    Object.keys(VERB_FORMS).forEach(r => {
        const c = buildConjugation(r);
        if (!c) return;
        ['madi', 'mudari', 'amr'].forEach(z => c[z].forEach(p => { if (p[1]) tumFiiller.push(p[1]); }));
    });
    Object.keys(VERB_FORMS).forEach(root => {
        const c = buildConjugation(root);
        if (!c) return;
        ['madi', 'mudari', 'amr'].forEach(z => c[z].forEach(pair => {
            if (!pair[1]) return;               // emirde çekimi olmayan zamirler atlanır
            fiilSorulari.push({ root, z, pair });
        }));
    });
    ornekle(fiilSorulari, 30).forEach(f => {
        const k = qzSoruYap(f.pair[1], tumFiiller);
        S.push({
            ar: formatRootDisplay(f.root),
            s: 'ما ' + zamanAd[f.z][0] + ' مِنْ هٰذا الجَذْرِ لِـ «' + f.pair[0] + '»؟',
            tr: 'Bu kökün ' + zamanAd[f.z][1] + ' çekimi (' + f.pair[0] + ') hangisidir?',
            secenekler: k.secenekler, dogru: k.dogru
        });
    });

    /* Emniyet: merkezî veri yüklenmediyse en azından fiil soruları vardır;
       o da yoksa eski küçük listelerden temel sorular üretilebilirdi ama
       bu durumda oda kuran taraf zaten sarf.html'i tam yüklemiş demektir. */
    return S;
}

/* =========================================================
   QUIZ — ekran yönetimi + Firestore canlı bağlantısı
========================================================= */
const Quiz = {
    _db: null,
    _gorunum: null,
    /* Geri tuşuyla ekrandan ayrılınca oda KAPANMAZ; buraya alınır ve
       "اِتَّصِلْ" rozetine tekrar basılınca kaldığı yerden devam eder. */
    _saklanan: null,
    state: {},

    /* --- Firebase tembel başlatma; ayar boşsa null döner --- */
    db() {
        if (this._db) return this._db;
        if (typeof firebase === 'undefined') return null;
        /* apiKey de şart: projectId dolu ama apiKey boşsa Firebase sessizce
           hata verirdi; bu kontrol o durumda düzgün uyarı ekranı göstertir. */
        if (!SARF_FIREBASE_CONFIG || !SARF_FIREBASE_CONFIG.apiKey || !SARF_FIREBASE_CONFIG.projectId) return null;
        try {
            /* ISIMLI uygulama: sayfadaki VARSAYILAN firebase uygulamasi
               kidefarapca'ya (gorevkopru/giris) aittir. Yarisin onune gecmek
               icin sarf kendi projesine 'sarf' ADIYLA baglanir — iki proje
               ayni sayfada cakismadan calisir. */
            var sarfApp;
            try { sarfApp = firebase.app('sarf'); }
            catch (eYok) { sarfApp = firebase.initializeApp(SARF_FIREBASE_CONFIG, 'sarf'); }
            this._db = sarfApp.firestore();
        } catch (e) {
            console.error('[sarf] Firebase başlatılamadı:', e);
            return null;
        }
        return this._db;
    },
    odaRef() { return this.db().collection(SARF_KOLEKSIYON).doc(this.state.odaKod); },

    /* ================= giriş noktaları ================= */
    start() {
        this.temizle();
        /* Askıya alınmış bir oturum varsa doğrudan ona dön. */
        if (this._saklanan && this.db()) { this.devamEt(); return; }
        this.state = { rol: null, soruSayisi: 10, secim: null };
        if (!this.db()) { this.uyariCiz(); return; }
        this.girisCiz();
    },

    /* Geri tuşu: odayı kapatmaz, katılanları atmaz. Sadece dinlemeyi
       durdurup menüye döner; oda Firestore'da olduğu gibi kalır. */
    askiyaAl() {
        this._saklanan = {
            rol: this.state.rol,
            odaKod: this.state.odaKod,
            takimId: this.state.takimId,
            takimAdi: this.state.takimAdi,
            soruSayisi: this.state.soruSayisi || 10
        };
        this.temizle();
        App.showScreen('start-screen');
        const rozet = document.querySelector('.menu-connect');
        if (rozet) rozet.classList.add('devam');
    },

    /* Askıdaki oturuma dönüş: aynı odayı yeniden dinlemeye başlarız,
       oda hangi aşamadaysa ekran oraya kendiliğinden kurulur. */
    devamEt() {
        const s = this._saklanan;
        this._saklanan = null;
        const rozet = document.querySelector('.menu-connect');
        if (rozet) rozet.classList.remove('devam');
        this.state = {
            rol: s.rol, odaKod: s.odaKod, takimId: s.takimId,
            takimAdi: s.takimAdi, soruSayisi: s.soruSayisi, secim: null
        };
        this.ciz(
            this.baslikHtml() +
            '<div class="qz-kart">' +
              '<div class="qz-bekle">🔌 Odaya yeniden bağlanılıyor…</div>' +
              '<div class="qz-durum" style="margin-top:10px">Oda: <b>' +
                this.kacis(s.odaKod) + '</b></div>' +
            '</div>'
        );
        this.dinle(s.odaKod);
    },

    /* Geri (←) tuşu. Odadaysak çıkmak değil, askıya almak gerekir. */
    geriBas() {
        if (this.state.odaKod) { this.askiyaAl(); return; }
        this.cik();
    },

    /* Öğrenci linki: ...sarf.html?oda=KOD */
    katilimlaBasla(kod) {
        this.temizle();
        this.state = { rol: null, soruSayisi: 10, secim: null, hazirKod: kod };
        App.showScreen('quiz-screen');
        if (!this.db()) { this.uyariCiz(); return; }
        this.girisCiz();
    },

    temizle() {
        (this.state.abone || []).forEach(f => { try { f(); } catch (e) {} });
        if (this.state.sayacTimer) clearInterval(this.state.sayacTimer);
        (this.state.sonucTimer || []).forEach(t => clearTimeout(t));
        const onay = document.getElementById('qz-onay');
        if (onay) onay.remove();
        document.querySelectorAll('.qz-konfeti-kap').forEach(k => k.remove());
        this.state = {};
        this._gorunum = null;
    },
    cik() {
        this.temizle();
        this._saklanan = null;
        const rozet = document.querySelector('.menu-connect');
        if (rozet) rozet.classList.remove('devam');
        App.showScreen('start-screen');
    },

    /* --------- sayfa içi onay penceresi ---------
       Tarayıcının confirm() kutusu kullanılmaz; sayfa içi katman çizilir. */
    onaySor(baslik, mesaj, evetMetin, evetFn) {
        const eski = document.getElementById('qz-onay');
        if (eski) eski.remove();
        const kat = document.createElement('div');
        kat.className = 'qz-onay show';
        kat.id = 'qz-onay';
        kat.innerHTML =
            '<div class="qz-onay-kart">' +
              '<div class="qz-onay-emoji">⚠️</div>' +
              '<h3>' + this.kacis(baslik) + '</h3>' +
              '<p>' + this.kacis(mesaj) + '</p>' +
              '<div class="qz-satir" style="margin-top:6px">' +
                '<button class="qz-btn gri" id="qz-onay-hayir">Vazgeç</button>' +
                '<button class="qz-btn kirmizi" id="qz-onay-evet">' + this.kacis(evetMetin) + '</button>' +
              '</div>' +
            '</div>';
        document.body.appendChild(kat);
        const kapat = () => { if (kat.parentNode) kat.parentNode.removeChild(kat); };
        document.getElementById('qz-onay-hayir')
            .addEventListener('click', () => { App.playSound('click'); kapat(); });
        document.getElementById('qz-onay-evet')
            .addEventListener('click', () => { App.playSound('click'); kapat(); evetFn(); });
        kat.addEventListener('click', e => { if (e.target === kat) kapat(); });
    },

    /* ================= ortak çizim ================= */
    ekran() { return document.getElementById('quiz-screen'); },
    ciz(icHtml) {
        this.ekran().innerHTML =
            '<div class="back-btn" id="qz-back">' + BACK_SVG + '</div>' +
            '<div class="qz-wrap">' + icHtml + '</div>';
        const b = document.getElementById('qz-back');
        if (b) b.addEventListener('click', () => { App.playSound('click'); this.geriBas(); });
    },
    baslikHtml() {
        return '<div class="qz-baslik" dir="rtl">اِتَّصِلْ · المُسابَقَة الرَّقَمِيَّة</div>';
    },

    uyariCiz() {
        this.ciz(
            this.baslikHtml() +
            '<div class="qz-uyari">' +
              '<b>Dijital yarışma için Firebase ayarı gerekiyor.</b><br>' +
              'Dosyanın en üstündeki <code>SARF_FIREBASE_CONFIG</code> bloğunu kendi ' +
              'Firebase projenin web ayarlarıyla doldur (Firebase Console → Project settings → Your apps → Config). ' +
              'Oda kayıtları <code>' + SARF_KOLEKSIYON + '</code> koleksiyonuna yazılır; ' +
              'başka bir yere bağlamak istersen sadece o satırı değiştirmen yeterli.<br><br>' +
              'Diğer üç oyun bu ayardan etkilenmez, internetsiz de çalışır.' +
            '</div>'
        );
    },

    /* ================= 1. ekran: kur / katıl ================= */
    girisCiz() {
        const sayilar = [5, 10, 15, 20, 30];
        /* Karekod ya da davet linkiyle gelen kişi yalnızca KATILIR:
           oda kurma kartı (ve içindeki soru sayısı seçimi) hiç çizilmez. */
        const katilimci = !!this.state.hazirKod;
        this.ciz(
            this.baslikHtml() +
            '<div class="qz-alt">' + (katilimci
                ? 'Bir yarışma odasına davet edildin. Takımının adını ya da kendi adını yaz ve katıl; ' +
                  'sorular, odayı kuran kişi yarışmayı başlattığında burada belirecek.'
                : 'Bir kişi oda kurar; katılmak isteyenler karekodu okutup ya da linke tıklayıp ' +
                  'takım adıyla veya kendi adıyla girer — odaya bir takım da tek bir kişi de katılabilir. ' +
                  'Sorular bu dosyadaki köklerden, vezinlerden ve fiil çekimlerinden üretilir.') + '</div>' +

            (katilimci ? '' :
            '<div class="qz-kart">' +
              '<h3>🎓 Yeni oda kur</h3>' +
              '<div class="qz-sayi-secim" id="qz-sayilar">' +
                '<span style="opacity:.7">Soru sayısı:</span>' +
                sayilar.map(n => '<button class="qz-sayi' + (n === this.state.soruSayisi ? ' secili' : '') +
                                 '" data-n="' + n + '">' + n + '</button>').join('') +
              '</div>' +
              '<div class="qz-satir" style="margin-top:16px">' +
                '<button class="qz-btn" id="qz-kur">🚀 Odayı Kur</button>' +
              '</div>' +
            '</div>') +

            '<div class="qz-kart">' +
              '<h3>👥 Odaya katıl</h3>' +
              '<div class="qz-satir">' +
                '<input class="qz-input" id="qz-kod-in" placeholder="Oda kodu" maxlength="6" ' +
                       'value="' + (this.state.hazirKod || '') + '" style="max-width:150px;text-transform:uppercase">' +
                '<input class="qz-input" id="qz-ad-in" placeholder="Takım / kişi adı" maxlength="24">' +
                '<button class="qz-btn yesil" id="qz-katil">Katıl</button>' +
              '</div>' +
              '<div class="qz-durum" id="qz-giris-durum" style="margin-top:10px"></div>' +
              '<div class="qz-kod-not" style="margin-top:8px">Tek başına da katılabilirsin; ' +
              'ad kutusuna kendi adını yazman yeterli.</div>' +
            '</div>'
        );

        const sayiKutu = document.getElementById('qz-sayilar');
        if (sayiKutu) sayiKutu.addEventListener('click', e => {
            const b = e.target.closest('.qz-sayi'); if (!b) return;
            this.state.soruSayisi = parseInt(b.dataset.n, 10);
            document.querySelectorAll('#qz-sayilar .qz-sayi').forEach(x => x.classList.remove('secili'));
            b.classList.add('secili');
            App.playSound('click');
        });
        const kurBtn = document.getElementById('qz-kur');
        if (kurBtn) kurBtn.addEventListener('click', () => this.odaKur());
        document.getElementById('qz-katil').addEventListener('click', () => this.takimKatil());
        document.getElementById('qz-ad-in').addEventListener('keydown', e => {
            if (e.key === 'Enter') this.takimKatil();
        });
        if (this.state.hazirKod) document.getElementById('qz-ad-in').focus();
    },

    kodUret() {
        const harfler = 'ABCDEFGHJKLMNPRSTUVYZ23456789';   // karışan harfler (I,O,Q,X) yok
        let k = '';
        for (let i = 0; i < 4; i++) k += harfler[Math.floor(Math.random() * harfler.length)];
        return k;
    },

    async odaKur() {
        const db = this.db(); if (!db) return;
        const btn = document.getElementById('qz-kur');
        if (btn) { btn.disabled = true; btn.textContent = 'Oda kuruluyor…'; }
        try {
            const kod = this.kodUret();
            const sorular = qzKaristir(quizSorulariUret()).slice(0, this.state.soruSayisi);
            await db.collection(SARF_KOLEKSIYON).doc(kod).set({
                olusturma: Date.now(),
                durum: 'lobi', faz: 'soru', index: 0,
                sure: SARF_SORU_SURESI,
                soruZamani: 0,
                sorular: sorular
            });
            this.state.rol = 'yonetici';
            this.state.odaKod = kod;
            App.playSound('correct');
            this.dinle(kod);
        } catch (e) {
            console.error('[sarf] oda kurulamadı:', e);
            if (btn) { btn.disabled = false; btn.textContent = '🚀 Odayı Kur'; }
            const d = document.getElementById('qz-giris-durum');
            if (d) d.textContent = 'Oda kurulamadı: ' + (e.message || e);
        }
    },

    async takimKatil() {
        const db = this.db(); if (!db) return;
        const durum = document.getElementById('qz-giris-durum');
        const kod = (document.getElementById('qz-kod-in').value || '').trim().toUpperCase();
        const ad  = (document.getElementById('qz-ad-in').value || '').trim();
        if (!kod || !ad) { durum.textContent = 'Oda kodu ve bir ad (takım ya da kişi adı) gerekli.'; return; }
        durum.textContent = 'Bağlanılıyor…';
        try {
            const ref = db.collection(SARF_KOLEKSIYON).doc(kod);
            const snap = await ref.get();
            if (!snap.exists) { durum.textContent = 'Böyle bir oda yok: ' + kod; return; }
            const doc = await ref.collection('takimlar').add({
                ad: ad, puan: 0, olusturmaZamani: Date.now()
            });
            this.state.rol = 'takim';
            this.state.odaKod = kod;
            this.state.takimId = doc.id;
            this.state.takimAdi = ad;
            App.playSound('correct');
            this.dinle(kod);
        } catch (e) {
            console.error('[sarf] katılım hatası:', e);
            durum.textContent = 'Katılamadı: ' + (e.message || e);
        }
    },

    /* ================= canlı dinleme ================= */
    dinle(kod) {
        const db = this.db();
        const ref = db.collection(SARF_KOLEKSIYON).doc(kod);
        this.state.abone = [];
        this.state.takimlar = [];
        this.state.cevaplar = [];
        this.state.veriGeldi = false;
        /* Katılım sesi için: ilk anlık görüntü sessiz geçer, sonrasında
           listeye yeni bir kimlik eklendiğinde odadaki her cihaz ses çalar. */
        this.state.katilSet = null;
        this.state.hepsiSesIndex = -1;
        this.state.abone.push(ref.onSnapshot(s => {
            if (!s.exists) {
                /* Odayı kapatan biziz: sessizce çık. */
                if (this.state.kapatiliyor) return;
                /* Hiç veri gelmeden yoksa: oda zaten kapanmış (ör. askıdan
                   dönüş). Veri geldikten sonra kaybolduysa: kuran kişi çıktı. */
                if (this.state.veriGeldi) this.iptalCiz();
                else this.odaYokCiz(kod);
                return;
            }
            this.state.veriGeldi = true;
            this.state.oda = s.data();
            this.guncelle();
        }));
        this.state.abone.push(ref.collection('takimlar').onSnapshot(q => {
            this.state.takimlar = q.docs.map(d => Object.assign({ id: d.id }, d.data()))
                .sort((a, b) => (a.olusturmaZamani || 0) - (b.olusturmaZamani || 0));
            /* Odaya yeni biri katıldıysa: odayı kuranın ve önceden bağlanmış
               herkesin cihazında kısa bir "ding" çalar. */
            const simdiki = new Set(this.state.takimlar.map(t => t.id));
            if (this.state.katilSet) {
                let yeni = false;
                simdiki.forEach(id => { if (!this.state.katilSet.has(id)) yeni = true; });
                if (yeni) App.playSound('katildi');
            }
            this.state.katilSet = simdiki;
            this.guncelle();
        }));
        this.state.abone.push(ref.collection('cevaplar').onSnapshot(q => {
            this.state.cevaplar = q.docs.map(d => d.data());
            this.guncelle();
        }));
    },

    /* Görünüm anahtarı değişmedikçe DOM yeniden kurulmaz;
       yalnızca dinamik parçalar (takım listesi, sayaç, işaretler)
       yamalanır — böylece karekod ve odak kaybolmaz. */
    guncelle() {
        const o = this.state.oda;
        if (!o) return;
        const anahtar = [o.durum, o.faz, o.index, this.state.rol].join('|');
        if (anahtar !== this._gorunum) {
            this._gorunum = anahtar;
            this.state.secim = null;
            this.gorunumCiz();
        }
        this.yamala();
    },

    gorunumCiz() {
        const o = this.state.oda;
        if (o.durum === 'lobi')      this.lobiCiz();
        else if (o.durum === 'oyun') {
            /* Soru fazı ve sonuç fazı artık iki ayrı ekran:
               sonuç, adım adım açılan bir sahne olarak gösterilir. */
            if (o.faz === 'sonuc') this.sonucCiz(); else this.oyunCiz();
        }
        else                          this.bitisCiz();
    },

    /* Oda ortadan kalktı: katılanlara soru göstermeye devam etmek yerine
       ne olduğunu açıkça söyleyen bir ekran çizilir. */
    iptalCiz() {
        const bittiMi = !!(this.state.oda && this.state.oda.durum === 'bitti');
        this.temizle();
        this._saklanan = null;
        this.ciz(
            this.baslikHtml() +
            '<div class="qz-kart qz-iptal">' +
              '<div class="qz-iptal-emoji">' + (bittiMi ? '🏁' : '🚪') + '</div>' +
              '<h3>' + (bittiMi ? 'Yarışma sona erdi' : 'Yarışma iptal edildi') + '</h3>' +
              '<div class="qz-durum" style="margin-top:6px">' + (bittiMi
                  ? 'Odayı kuran kişi odayı kapattı. Katıldığın için teşekkürler!'
                  : 'Odayı kuran kişi yarışmadan çıktı, bu yüzden yarışma iptal edildi. ' +
                    'Kalan soru yok; yeni bir oda kodu geldiğinde tekrar katılabilirsin.') + '</div>' +
              '<div class="qz-satir" style="margin-top:18px">' +
                '<button class="qz-btn" id="qz-iptal-tamam">Tamam</button>' +
              '</div>' +
            '</div>'
        );
        const t = document.getElementById('qz-iptal-tamam');
        if (t) t.addEventListener('click', () => { App.playSound('click'); this.start(); });
    },

    /* Askıdan dönerken oda artık yoksa: giriş ekranına not düşerek dön. */
    odaYokCiz(kod) {
        this.temizle();
        this._saklanan = null;
        this.state = { rol: null, soruSayisi: 10, secim: null };
        this.girisCiz();
        const d = document.getElementById('qz-giris-durum');
        if (d) d.textContent = 'Oda ' + kod + ' artık açık değil — yarışma kapatılmış görünüyor.';
    },

    /* ================= lobi ================= */
    katilimLinki() {
        const temel = location.href.split('#')[0].split('?')[0];
        return temel + '?oda=' + this.state.odaKod;
    },

    lobiCiz() {
        const yonetici = this.state.rol === 'yonetici';
        const link = this.katilimLinki();
        this.ciz(
            this.baslikHtml() +
            (yonetici
                ? '<div class="qz-kart">' +
                    '<div class="qz-kod">' + this.state.odaKod + '</div>' +
                    '<div class="qz-kod-not">Oda kodu · öğrenciler karekodu okutabilir ya da bu kodu girebilir</div>' +
                    '<div class="qz-lobi-orta" style="margin-top:16px">' +
                      '<div class="qz-qr" id="qz-qr"></div>' +
                      '<div><div class="qz-link">' + link + '</div>' +
                      '<div class="qz-kod-not" style="margin-top:8px">Karekodun telefondan açılabilmesi için ' +
                      'dosyanın bir sunucudan (ya da paylaşılan bir adresten) yayınlanması gerekir.</div></div>' +
                    '</div>' +
                    '<div class="qz-takimlar" id="qz-takimlar"></div>' +
                    '<div class="qz-satir" style="margin-top:18px">' +
                      '<button class="qz-btn yesil" id="qz-baslat">🚀 Yarışı Başlat</button>' +
                      '<button class="qz-btn kirmizi" id="qz-kapat">Odayı Kapat</button>' +
                    '</div>' +
                    '<div class="qz-durum" id="qz-lobi-durum" style="margin-top:10px"></div>' +
                    '<div class="qz-kod-not" style="margin-top:8px">Geri (←) tuşu odayı kapatmaz: ' +
                    'menüye dönersin, katılanlar odada kalır ve “اِتَّصِلْ” rozetine basınca ' +
                    'her şey kaldığı yerden devam eder.</div>' +
                  '</div>'
                : '<div class="qz-kart">' +
                    '<div class="qz-bekle">أَهْلاً وَسَهْلاً، ' + this.kacis(this.state.takimAdi) + ' 👋</div>' +
                    '<div class="qz-durum" style="margin-top:10px">Oda: <b>' + this.state.odaKod + '</b> · ' +
                    'Öğretmen başlatınca ilk soru burada belirecek.</div>' +
                    '<div class="qz-takimlar" id="qz-takimlar"></div>' +
                  '</div>')
        );

        if (yonetici) {
            const kutu = document.getElementById('qz-qr');
            if (kutu && typeof QRCode !== 'undefined') {
                try { new QRCode(kutu, { text: link, width: 190, height: 190 }); }
                catch (e) { kutu.textContent = '—'; }
            } else if (kutu) {
                kutu.remove();
            }
            document.getElementById('qz-baslat').addEventListener('click', () => this.yarisiBaslat());
            document.getElementById('qz-kapat').addEventListener('click', () => this.kapatmayiSor());
        }
    },

    async yarisiBaslat() {
        /* Yarışma iki taraf olmadan anlamlı değil: en az iki takım ya da
           iki kişi odada olmalı. */
        if ((this.state.takimlar || []).length < 2) {
            const d = document.getElementById('qz-lobi-durum');
            if (d) d.textContent = 'Başlatmak için odada en az iki takım (ya da iki kişi) olmalı — şu an ' +
                                   (this.state.takimlar || []).length + '.';
            App.playSound('wrong');
            return;
        }
        App.playSound('click');
        await this.odaRef().update({
            durum: 'oyun', faz: 'soru', index: 0, soruZamani: Date.now()
        });
    },

    /* Odayı kapatmak geri dönüşü olmayan bir iş: önce onay sorulur. */
    kapatmayiSor() {
        App.playSound('click');
        const oynuyor = !!(this.state.oda && this.state.oda.durum === 'oyun');
        this.onaySor(
            oynuyor ? 'Yarışmadan çıkmak istiyor musun?' : 'Odayı kapatmak istiyor musun?',
            oynuyor
                ? 'Yarışma iptal edilir, oda silinir ve katılanların ekranında “yarışma iptal edildi” yazar. ' +
                  'Sadece ekrandan ayrılmak istiyorsan geri (←) tuşunu kullan; o zaman yarışma devam eder.'
                : 'Oda silinir ve katılanların bağlantısı kesilir. Sadece menüye dönmek istiyorsan ' +
                  'geri (←) tuşunu kullan; oda açık kalır.',
            oynuyor ? 'Evet, yarışmayı bitir' : 'Evet, odayı kapat',
            () => this.odayiKapat()
        );
    },

    async odayiKapat() {
        this.state.kapatiliyor = true;
        try { await this.odaRef().delete(); } catch (e) {}
        this.cik();
    },

    /* ================= canlı soru ================= */
    /* Yönetici (yansıtılan) ekranda soru başta GİZLİDİR; göz tuşuyla açılır
       (bilgiyarismasivezinler'deki davranışın aynısı). Öğrenci ekranını
       etkilemez. Puan durumu soru ekranında gösterilmez; sonuç sahnesinde
       ve final tablosunda zaten var. */
    soruGizli: true,
    _gozSvg(gizli) {
        return gizli
            ? '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
            : '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    },
    soruGizleToggle() {
        this.soruGizli = !this.soruGizli;
        const icerik = document.getElementById('qz-soru-icerik');
        const goz = document.getElementById('qz-goz');
        if (icerik) icerik.classList.toggle('gizli', this.soruGizli);
        if (goz) {
            goz.innerHTML = this._gozSvg(this.soruGizli);
            goz.title = this.soruGizli ? 'Soruyu göster' : 'Soruyu gizle';
        }
    },
    oyunCiz() {
        const o = this.state.oda;
        const soru = o.sorular[o.index];
        const yonetici = this.state.rol === 'yonetici';
        const harfler = ['أ', 'ب', 'ج', 'د'];
        const gizli = yonetici && this.soruGizli;
        this.ciz(
            '<div class="qz-ust">' +
              '<span>' + (o.index + 1) + ' / ' + o.sorular.length + '</span>' +
              '<span class="qz-sayac" id="qz-sayac">--</span>' +
              (yonetici
                ? '<button class="qz-goz" id="qz-goz" title="' +
                  (gizli ? 'Soruyu göster' : 'Soruyu gizle') + '">' + this._gozSvg(gizli) + '</button>'
                : '') +
              '<span id="qz-cevap-sayi"></span>' +
            '</div>' +
            '<div class="qz-kart">' +
              '<div class="qz-soru-sar">' +
                '<div id="qz-soru-icerik" class="qz-soru-icerik' + (gizli ? ' gizli' : '') + '">' +
                  '<div class="qz-soru" dir="rtl">' + this.kacis(soru.s) + '</div>' +
                  '<div class="qz-soru-ar">' + this.kacis(soru.ar) + '</div>' +
                  '<div class="qz-durum">' + this.kacis(soru.tr) + '</div>' +
                  '<div class="qz-secenekler" id="qz-secenekler">' +
                    soru.secenekler.map((sec, i) =>
                        '<div class="qz-secenek' + (yonetici ? ' kilit' : '') + '" data-i="' + i + '">' +
                          '<span class="harf">' + harfler[i] + '</span>' +
                          '<span class="metin">' + this.kacis(sec) + '</span>' +
                        '</div>').join('') +
                  '</div>' +
                '</div>' +
                (yonetici ? '<div class="qz-gizli-not">Soru gizli — göstermek için göz tuşuna bas</div>' : '') +
              '</div>' +
              '<div class="qz-durum" id="qz-oyun-durum" style="margin-top:12px"></div>' +
              (yonetici
                ? '<div class="qz-satir" style="margin-top:14px">' +
                    '<button class="qz-btn gri" id="qz-sonuc">👁 Cevabı Göster</button>' +
                    '<button class="qz-btn" id="qz-sonraki">' +
                      (o.index + 1 < o.sorular.length ? 'Sonraki Soru ▶' : 'Yarışı Bitir 🏁') +
                    '</button>' +
                    '<button class="qz-btn kirmizi" id="qz-oyundan-cik">🚪 Oyundan Çık</button>' +
                  '</div>' +
                  '<div class="qz-kod-not" style="margin-top:8px">Yarışmayı iptal etmek için ' +
                  '“Oyundan Çık” tuşunu kullan. Geri (←) tuşu yarışmayı bitirmez; sadece menüye ' +
                  'dönersin, “اِتَّصِلْ” rozetiyle aynı soruya geri gelirsin.</div>'
                : '') +
            '</div>'
        );

        if (!yonetici) {
            document.getElementById('qz-secenekler').addEventListener('click', e => {
                const el = e.target.closest('.qz-secenek');
                if (el) this.cevapVer(parseInt(el.dataset.i, 10));
            });
        } else {
            document.getElementById('qz-goz').addEventListener('click', () => this.soruGizleToggle());
            document.getElementById('qz-sonuc').addEventListener('click', () => this.sonucaGec());
            document.getElementById('qz-sonraki').addEventListener('click', () => this.sonrakiSoru());
            document.getElementById('qz-oyundan-cik').addEventListener('click', () => this.kapatmayiSor());
        }
        this.sayaciKur();
    },

    sayaciKur() {
        if (this.state.sayacTimer) clearInterval(this.state.sayacTimer);
        const o = this.state.oda;
        const el = () => document.getElementById('qz-sayac');
        const tik = () => {
            const s = this.state.oda;
            const kutu = el();
            if (!kutu || !s) return;
            if (s.faz !== 'soru') { kutu.textContent = '⏹'; kutu.classList.remove('az'); return; }
            const kalan = Math.max(0, Math.ceil((s.sure || SARF_SORU_SURESI) -
                          (Date.now() - (s.soruZamani || Date.now())) / 1000));
            kutu.textContent = kalan + 's';
            kutu.classList.toggle('az', kalan <= 5);
            if (kalan === 0 && this.state.rol === 'yonetici') this.sonucaGec();
        };
        tik();
        if (o.faz === 'soru') this.state.sayacTimer = setInterval(tik, 250);
    },

    async cevapVer(i) {
        const o = this.state.oda;
        if (!o || o.faz !== 'soru' || this.state.secim !== null) return;
        this.state.secim = i;
        this.yamala();
        const soru = o.sorular[o.index];
        const dogru = (i === soru.dogru);
        const sure = o.sure || SARF_SORU_SURESI;
        const gecen = (Date.now() - (o.soruZamani || Date.now())) / 1000;
        const oran = Math.max(0, Math.min(1, 1 - gecen / sure));
        const puan = dogru ? SARF_TEMEL_PUAN + Math.round(SARF_HIZ_PUAN * oran) : 0;
        App.playSound(dogru ? 'correct' : 'click');
        try {
            const ref = this.odaRef();
            await ref.collection('cevaplar').doc(this.state.takimId + '_' + o.index).set({
                takimId: this.state.takimId, index: o.index,
                secim: i, dogru: dogru, puan: puan, zaman: Date.now()
            });
            if (puan > 0) {
                await ref.collection('takimlar').doc(this.state.takimId).update({
                    puan: firebase.firestore.FieldValue.increment(puan)
                });
            }
        } catch (e) { console.error('[sarf] cevap yazılamadı:', e); }
    },

    async sonucaGec() {
        if (this.state.oda.faz === 'sonuc') return;
        if (this.state.sayacTimer) clearInterval(this.state.sayacTimer);
        try { await this.odaRef().update({ faz: 'sonuc' }); } catch (e) {}
    },
    async sonrakiSoru() {
        const o = this.state.oda;
        App.playSound('click');
        if (o.index + 1 >= o.sorular.length) {
            try { await this.odaRef().update({ durum: 'bitti', faz: 'sonuc' }); } catch (e) {}
            return;
        }
        try {
            await this.odaRef().update({ index: o.index + 1, faz: 'soru', soruZamani: Date.now() });
        } catch (e) {}
    },

    /* ================= puan / sıra yardımcıları =================
       Puanlar hem takım belgesindeki "puan" alanında hem de her cevapta
       tutulur. Sıra değişimini (▲▼) gösterebilmek için "şu soruya kadar"
       ve "bir önceki soruya kadar" toplamları cevaplardan hesaplanır. */
    puanKumul(sonIndex) {
        const t = {};
        (this.state.cevaplar || []).forEach(c => {
            if (c.index <= sonIndex && c.puan) t[c.takimId] = (t[c.takimId] || 0) + c.puan;
        });
        return t;
    },
    siraDizisi(puanMap) {
        return (this.state.takimlar || []).map(t => t.id)
            .sort((a, b) => (puanMap[b] || 0) - (puanMap[a] || 0));
    },
    rankHaritasi(puanMap) {
        const ids = (this.state.takimlar || []).map(t => t.id);
        const r = {};
        ids.forEach(id => {
            const p = puanMap[id] || 0;
            r[id] = 1 + ids.filter(o => (puanMap[o] || 0) > p).length;
        });
        return r;
    },
    adBul(id) {
        const t = (this.state.takimlar || []).find(x => x.id === id);
        return t ? t.ad : '';
    },

    /* ================= soru sonucu (adım adım sahne) =================
       Akış: (0) soru + doğru şık → (1) kim ne dedi → (2) puan durumu.
       Alt taraftaki üç çizgiye basarak sahneler arasında gezilebilir. */
    sonucCiz() {
        const o = this.state.oda;
        const idx = o.index;
        const soru = o.sorular[idx];
        const yonetici = this.state.rol === 'yonetici';
        const harfler = ['أ', 'ب', 'ج', 'د'];
        if (this.state.sayacTimer) clearInterval(this.state.sayacTimer);
        const taze = (this.state.sonucAnimIndex !== idx);
        const son = (idx + 1 >= o.sorular.length);

        const sikHtml = soru.secenekler.map((sec, i) =>
            '<div class="qz-secenek kilit' + (i === soru.dogru ? ' dogru' : ' solgun') + '">' +
              '<span class="harf">' + harfler[i] + '</span>' +
              '<span class="metin">' + this.kacis(sec) + '</span>' +
              (i === soru.dogru ? '<span class="tik">✓</span>' : '') +
            '</div>').join('');

        this.ciz(
            '<div class="qz-sonuc-ekran" id="qz-sonuc-ekran" data-step="' + (taze ? 0 : 2) + '">' +
              '<div class="qz-sonuc-baslik">📊 Sonuç · Soru ' + (idx + 1) + ' / ' + o.sorular.length + '</div>' +
              '<div class="qz-sonuc-sahne">' +
                /* SAHNE 1 — soru ve doğru şık */
                '<div class="qz-sahne-oge oge-dogru">' +
                  '<div class="qz-soru" dir="rtl">' + this.kacis(soru.s) + '</div>' +
                  '<div class="qz-soru-ar">' + this.kacis(soru.ar) + '</div>' +
                  '<div class="qz-durum">' + this.kacis(soru.tr) + '</div>' +
                  '<div class="qz-secenekler">' + sikHtml + '</div>' +
                '</div>' +
                /* SAHNE 2 — kim ne cevapladı */
                '<div class="qz-sahne-oge oge-reveal">' +
                  '<h4 class="qz-sahne-baslik">🙋 Kim ne dedi?</h4>' +
                  '<table class="qz-rev-tablo">' +
                    '<thead><tr><th>Takım / kişi</th><th>Seçtiği</th><th>Durum</th></tr></thead>' +
                    '<tbody id="qz-rev-body"></tbody>' +
                  '</table>' +
                '</div>' +
                /* SAHNE 3 — puan durumu */
                '<div class="qz-sahne-oge oge-lider">' +
                  '<h4 class="qz-sahne-baslik">🏆 Puan Durumu</h4>' +
                  '<ol class="qz-lider-ol" id="qz-lider-ol"></ol>' +
                '</div>' +
              '</div>' +
              '<div class="qz-sonuc-nokta" id="qz-sonuc-nokta">' +
                '<button class="qz-nokta" data-adim="0" title="Soru ve doğru şık"></button>' +
                '<button class="qz-nokta" data-adim="1" title="Verilen cevaplar"></button>' +
                '<button class="qz-nokta" data-adim="2" title="Puan durumu"></button>' +
              '</div>' +
              '<div class="qz-sonuc-kontrol">' +
                (yonetici
                  ? '<div class="qz-satir">' +
                      '<button class="qz-btn" id="qz-sonraki">' +
                        (son ? 'Yarışı Bitir 🏁' : 'Sonraki Soru ▶') +
                      '</button>' +
                      '<button class="qz-btn kirmizi" id="qz-oyundan-cik">🚪 Oyundan Çık</button>' +
                    '</div>'
                  : '<div class="qz-durum" id="qz-benim-sonuc"></div>' +
                    '<div class="qz-kod-not" style="margin-top:8px">' +
                      (son ? 'Yarışmanın bitmesi bekleniyor…' : 'Sonraki soru bekleniyor…') +
                    '</div>') +
              '</div>' +
            '</div>'
        );

        const nokta = document.getElementById('qz-sonuc-nokta');
        if (nokta) nokta.addEventListener('click', e => {
            const b = e.target.closest('.qz-nokta');
            if (b) { App.playSound('click'); this.sonucAdim(parseInt(b.dataset.adim, 10)); }
        });
        if (yonetici) {
            document.getElementById('qz-sonraki').addEventListener('click', () => this.sonrakiSoru());
            document.getElementById('qz-oyundan-cik').addEventListener('click', () => this.kapatmayiSor());
        }

        const degisti = this.sonucYamala();
        if (taze) {
            this.state.sonucAnimIndex = idx;
            App.playSound('sonucAcildi');
            this.sonucOynat(degisti);
        }
    },

    /* Sonuç sahnesinin dinamik parçaları: cevap tablosu, puan durumu ve
       katılımcının kendi sonucu. Sıra değişip değişmediğini döndürür. */
    sonucYamala() {
        const o = this.state.oda;
        if (!o || !document.getElementById('qz-sonuc-ekran')) return false;
        const idx = o.index;
        const soru = o.sorular[idx];
        const harfler = ['أ', 'ب', 'ج', 'د'];
        const buCevaplar = {};
        (this.state.cevaplar || []).forEach(c => { if (c.index === idx) buCevaplar[c.takimId] = c; });

        const govde = document.getElementById('qz-rev-body');
        if (govde) {
            const takimlar = this.state.takimlar || [];
            govde.innerHTML = takimlar.length
                ? takimlar.map((tk, ri) => {
                    const c = buCevaplar[tk.id];
                    const dogruMu = !!c && c.secim === soru.dogru;
                    const secim = c
                        ? '<b class="qz-rev-harf">' + harfler[c.secim] + '</b> ' +
                          '<span class="qz-rev-metin" dir="rtl">' + this.kacis(soru.secenekler[c.secim]) + '</span>'
                        : '<span class="qz-rev-yok">—</span>';
                    const durum = c ? (dogruMu ? '✅ Doğru' : '❌ Yanlış') : '⏳ Cevapsız';
                    return '<tr class="' + (c ? (dogruMu ? 'dogru' : 'yanlis') : 'yok') + '" style="--r:' + ri + '">' +
                             '<td>' + this.kacis(tk.ad) + '</td>' +
                             '<td class="qz-rev-sik">' + secim + '</td>' +
                             '<td>' + durum + '</td>' +
                           '</tr>';
                  }).join('')
                : '<tr class="yok"><td colspan="3">Katılan yok.</td></tr>';
        }

        const yeniP = this.puanKumul(idx), oncekiP = this.puanKumul(idx - 1);
        const sira = this.siraDizisi(yeniP);
        const yeniR = this.rankHaritasi(yeniP), oncekiR = this.rankHaritasi(oncekiP);
        const ol = document.getElementById('qz-lider-ol');
        if (ol) {
            ol.innerHTML = sira.length
                ? sira.map(id => {
                    const ns = yeniR[id] || sira.length, ps = oncekiR[id] || sira.length;
                    const fark = ps - ns;
                    const ok = fark > 0 ? '<span class="qz-ok yukari">▲</span>'
                             : (fark < 0 ? '<span class="qz-ok asagi">▼</span>'
                                         : '<span class="qz-ok sabit"></span>');
                    const cls = fark > 0 ? ' yukari' : (fark < 0 ? ' asagi' : '');
                    return '<li class="qz-lider-satir' + cls + (id === this.state.takimId ? ' benim' : '') + '">' +
                             '<span class="qz-lider-sira">' + ns + '</span>' + ok +
                             '<span class="qz-lider-ad">' + this.kacis(this.adBul(id)) + '</span>' +
                             '<b>' + (yeniP[id] || 0) + '</b>' +
                           '</li>';
                  }).join('')
                : '<li class="qz-lider-satir bos">Henüz puan yok.</li>';
        }

        const benim = document.getElementById('qz-benim-sonuc');
        if (benim && this.state.rol === 'takim') {
            const c = buCevaplar[this.state.takimId];
            benim.innerHTML = !c
                ? '⏳ Bu soruya cevap veremedin.'
                : (c.secim === soru.dogru
                    ? '🎉 Doğru! <b>+' + (c.puan || 0) + '</b> puan · toplam <b>' +
                      (yeniP[this.state.takimId] || 0) + '</b>'
                    : '❌ Bu sefer olmadı · toplam <b>' + (yeniP[this.state.takimId] || 0) + '</b>');
        }

        return sira.some(id => (oncekiR[id] || sira.length) !== (yeniR[id] || sira.length));
    },

    /* Sahneleri sırayla açar; sıralama değiştiyse puan durumu belirirken
       kısa bir "sıra değişti" ezgisi çalar. */
    sonucOynat(degisti) {
        (this.state.sonucTimer || []).forEach(t => clearTimeout(t));
        this.state.sonucTimer = [];
        const ayarla = n => {
            const e = document.getElementById('qz-sonuc-ekran');
            if (e) e.setAttribute('data-step', String(n));
        };
        this.state.sonucTimer.push(setTimeout(() => ayarla(1), 4500));
        this.state.sonucTimer.push(setTimeout(() => ayarla(2), 8000));
        if (degisti) this.state.sonucTimer.push(setTimeout(() => App.playSound('siraDegisti'), 8200));
    },

    /* Alt çizgilerden birine basılınca otomatik akış durur, o sahne açılır. */
    sonucAdim(n) {
        (this.state.sonucTimer || []).forEach(t => clearTimeout(t));
        this.state.sonucTimer = [];
        const e = document.getElementById('qz-sonuc-ekran');
        if (e) e.setAttribute('data-step', String(n));
    },

    /* Yarışma bitti — harici kütüphane olmadan konfeti. */
    konfetiPatlat() {
        const renkler = ['#7c3aed', '#a78bfa', '#fbbf24', '#28a745', '#2980b9', '#ef4444', '#f472b6', '#ffffff'];
        const kap = document.createElement('div');
        kap.className = 'qz-konfeti-kap';
        let h = '';
        for (let i = 0; i < 120; i++) {
            const sol = (Math.random() * 100).toFixed(2);
            const renk = renkler[(Math.random() * renkler.length) | 0];
            const gecikme = (Math.random() * 0.9).toFixed(2);
            const sure = (2.6 + Math.random() * 2.2).toFixed(2);
            const don = ((Math.random() * 900 - 450) | 0);
            const en = 6 + (Math.random() * 8 | 0);
            const yuvarlak = Math.random() < 0.35;
            const boy = yuvarlak ? en : Math.max(4, (en * 0.5) | 0);
            const sx = ((Math.random() * 46 - 23) | 0);
            h += '<i style="left:' + sol + '%;background:' + renk + ';width:' + en + 'px;height:' + boy +
                 'px;border-radius:' + (yuvarlak ? '50%' : '2px') + ';animation-delay:' + gecikme +
                 's;animation-duration:' + sure + 's;--don:' + don + 'deg;--sx:' + sx + 'px"></i>';
        }
        kap.innerHTML = h;
        (this.ekran() || document.body).appendChild(kap);
        setTimeout(() => { if (kap.parentNode) kap.parentNode.removeChild(kap); }, 8000);
    },

    /* ================= bitiş ================= */
    bitisCiz() {
        const yonetici = this.state.rol === 'yonetici';
        this.ciz(
            '<div class="qz-kart qz-final">' +
              '<div class="qz-final-logo">🏆</div>' +
              '<div class="qz-bekle" dir="rtl">اِنْتَهَتِ المُسابَقَة</div>' +
              '<div class="qz-final-alt">Yarışma bitti!</div>' +
              '<div id="qz-final-benim"></div>' +
              '<ol class="qz-final-ol" id="qz-final-ol"></ol>' +
              (yonetici
                ? '<div class="qz-satir" style="margin-top:20px">' +
                    '<button class="qz-btn kirmizi" id="qz-kapat">🚪 Odayı Kapat</button>' +
                  '</div>' +
                  '<div class="qz-kod-not" style="margin-top:8px">Odayı kapatınca katılanların ' +
                  'ekranında “yarışma sona erdi” yazar. Geri (←) tuşu odayı kapatmaz.</div>'
                : '<div class="qz-kod-not" style="margin-top:16px">Sıralama yukarıda; odayı kuran ' +
                  'kişi odayı kapatana kadar bu ekran açık kalır.</div>') +
            '</div>'
        );
        const k = document.getElementById('qz-kapat');
        if (k) k.addEventListener('click', () => this.kapatmayiSor());
        this.finalYamala();
        if (!this.state.finalKonfeti) {
            this.state.finalKonfeti = true;
            App.playSound('zafer');
            this.konfetiPatlat();
        }
    },

    /* Final tablosu: madalyalı podyum + katılımcıya kendi derecesi. */
    finalYamala() {
        const ol = document.getElementById('qz-final-ol');
        if (!ol) return;
        const P = this.puanKumul(1e9);
        const puanOf = t => (t.puan != null ? t.puan : (P[t.id] || 0));
        const sirali = (this.state.takimlar || []).slice().sort((a, b) => puanOf(b) - puanOf(a));
        const madalya = ['🥇', '🥈', '🥉'];
        ol.innerHTML = sirali.length
            ? sirali.map((t, i) =>
                '<li class="' + (i < 3 ? 'podyum' : '') + (i === 0 ? ' birinci' : '') +
                    (t.id === this.state.takimId ? ' benim' : '') + '" style="--i:' + i + '">' +
                  '<span class="qz-final-sira">' + (madalya[i] || (i + 1)) + '</span>' +
                  '<span class="qz-final-ad">' + this.kacis(t.ad) + '</span>' +
                  '<b>' + puanOf(t) + '</b>' +
                '</li>').join('')
            : '<li class="bos">Katılan yok.</li>';

        const benim = document.getElementById('qz-final-benim');
        if (benim && this.state.rol === 'takim') {
            const yer = sirali.findIndex(t => t.id === this.state.takimId) + 1;
            if (!yer) { benim.className = ''; benim.innerHTML = ''; return; }
            benim.className = 'qz-final-benim' + (yer === 1 ? ' bir' : '');
            benim.innerHTML =
                '<div class="qz-fb-emoji">' + (yer === 1 ? '🎉' : '🏅') + '</div>' +
                '<h4>' + (yer === 1 ? 'Tebrikler, birinci oldun! 🥇' : yer + '. oldun') + '</h4>' +
                '<div class="qz-durum">Toplam puanın: <b>' + puanOf(sirali[yer - 1]) + '</b></div>';
            /* NOT: Dijital yarisma gorev sistemine BILDIRILMEZ — ogretmen
               yarismayi sinifta canli uygular, sonuc tahtasi yeterlidir. */
        }
    },

    /* ================= dinamik yamalar ================= */
    /* Yönetici, lobideki bir çipe tıklayınca çip yerinde giriş kutusuna
       dönüşür; Enter/odak kaybı kaydeder, Esc vazgeçer. Yeni ad Firestore'a
       yazılır — takımın kendi ekranı dahil herkese anında yansır. */
    takimDuzenleme: false,
    takimAdiDuzenle(cip) {
        if (this.takimDuzenleme) return;
        if (!this.state.oda || this.state.rol !== 'yonetici') return;
        const id = cip.dataset.tid;
        const t = (this.state.takimlar || []).find(x => x.id === id);
        if (!t) return;
        this.takimDuzenleme = true;
        cip.innerHTML = '';
        const inp = document.createElement('input');
        inp.className = 'qz-cip-input';
        inp.dir = 'auto';
        inp.maxLength = 24;
        inp.value = t.ad || '';
        cip.appendChild(inp);
        inp.focus(); inp.select();
        const bitir = (kaydet) => {
            if (!this.takimDuzenleme) return;
            this.takimDuzenleme = false;
            const yeni = inp.value.trim();
            if (kaydet && yeni && yeni !== t.ad) {
                this.odaRef().collection('takimlar').doc(id).update({ ad: yeni }).catch(() => {});
                t.ad = yeni; // anlık görünüm; kalıcısı zaten Firestore'dan gelecek
            }
            this.yamala();
        };
        inp.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); bitir(true); }
            else if (e.key === 'Escape') { e.preventDefault(); bitir(false); }
        });
        inp.addEventListener('blur', () => bitir(true));
    },

    yamala() {
        const o = this.state.oda; if (!o) return;
        const takimlar = this.state.takimlar || [];

        /* Ayrı ekranlar: sonuç sahnesi ve final tablosu kendi yamalarını ister. */
        if (document.getElementById('qz-sonuc-ekran')) this.sonucYamala();
        if (document.getElementById('qz-final-ol'))    this.finalYamala();

        /* Lobideki takım/kişi çipleri. Odayı kuran (yönetici) bir çipe
           tıklayıp takımın adını değiştirebilir; düzenleme sürerken gelen
           anlık güncellemeler kutucuğu silmesin diye yeniden çizim atlanır. */
        const cipler = document.getElementById('qz-takimlar');
        if (cipler && !this.takimDuzenleme) {
            const duzenleyebilir = this.state.rol === 'yonetici';
            cipler.innerHTML = takimlar.length
                ? takimlar.map(t =>
                    '<span class="qz-takim-cip' + (duzenleyebilir ? ' duzenlenebilir' : '') +
                    '" data-tid="' + t.id + '"' +
                    (duzenleyebilir ? ' title="Adı değiştirmek için tıkla"' : '') + '>' +
                    this.kacis(t.ad) +
                    (duzenleyebilir ? '<span class="qz-cip-kalem">✎</span>' : '') +
                    '</span>').join('')
                : '<span class="qz-kod-not">Henüz katılan yok…</span>';
            if (duzenleyebilir) {
                cipler.querySelectorAll('.qz-takim-cip').forEach(c =>
                    c.addEventListener('click', () => this.takimAdiDuzenle(c)));
            }
        }

        /* Başlat tuşu iki katılımcıya kadar kilitli kalır. */
        const baslatBtn = document.getElementById('qz-baslat');
        if (baslatBtn) baslatBtn.disabled = (takimlar.length < 2);
        const lobiDurum = document.getElementById('qz-lobi-durum');
        if (lobiDurum && this.state.rol === 'yonetici' && o.durum === 'lobi') {
            lobiDurum.textContent = takimlar.length < 2
                ? 'Başlamak için en az iki takım (ya da iki kişi) gerekli — şu an ' + takimlar.length + '.'
                : takimlar.length + ' katılımcı hazır; istediğin an başlatabilirsin.';
        }

        /* Sıralama tablosu */
        const sira = document.getElementById('qz-sira');
        if (sira) {
            const s = takimlar.slice().sort((a, b) => (b.puan || 0) - (a.puan || 0));
            sira.innerHTML = s.length
                ? s.map((t, i) =>
                    '<div class="qz-sira-satir' + (i === 0 ? ' bir' : '') + '">' +
                      '<span class="yer">' + (i + 1) + '</span>' +
                      '<span class="ad">' + this.kacis(t.ad) + '</span>' +
                      '<span class="puan">' + (t.puan || 0) + '</span>' +
                    '</div>').join('')
                : '<div class="qz-kod-not">Henüz katılan yok.</div>';
        }

        if (o.durum !== 'oyun') return;

        /* Cevaplayan sayısı (yalnızca yönetici ekranında) */
        const sayi = document.getElementById('qz-cevap-sayi');
        const buSoru = (this.state.cevaplar || []).filter(c => c.index === o.index);
        if (sayi && this.state.rol === 'yonetici') {
            sayi.textContent = '✔ ' + buSoru.length + ' / ' + takimlar.length;
        }

        /* Herkes cevapladıysa: her cihazda kısa bir ezgi, yöneticide de
           kısa bir gecikmeyle sonuç sahnesi açılır. */
        if (o.faz === 'soru' && takimlar.length > 0 && buSoru.length >= takimlar.length &&
            this.state.hepsiSesIndex !== o.index) {
            this.state.hepsiSesIndex = o.index;
            App.playSound('hepsiCevap');
            if (this.state.rol === 'yonetici') {
                setTimeout(() => {
                    const s = this.state.oda;
                    if (s && s.durum === 'oyun' && s.faz === 'soru' && s.index === o.index) this.sonucaGec();
                }, 700);
            }
        }

        /* Kendi cevabımı hatırla (sayfa yeniden çizilirse) */
        if (this.state.rol === 'takim' && this.state.secim === null) {
            const benim = buSoru.find(c => c.takimId === this.state.takimId);
            if (benim) this.state.secim = benim.secim;
        }

        /* Şık işaretleri */
        const kutular = document.querySelectorAll('#qz-secenekler .qz-secenek');
        if (!kutular.length) return;
        const soru = o.sorular[o.index];
        const acik = (o.faz === 'sonuc');
        kutular.forEach(el => {
            const i = parseInt(el.dataset.i, 10);
            el.classList.toggle('secili', this.state.secim === i);
            el.classList.toggle('dogru', acik && i === soru.dogru);
            el.classList.toggle('yanlis', acik && this.state.secim === i && i !== soru.dogru);
            el.classList.toggle('kilit', this.state.rol === 'yonetici' || this.state.secim !== null || acik);
        });

        const durum = document.getElementById('qz-oyun-durum');
        if (durum) {
            if (this.state.rol === 'yonetici') {
                durum.textContent = acik ? 'Cevap açıkta — sınıfa gösterebilirsin.' : 'Katılanlar cevaplıyor…';
            } else if (acik) {
                durum.textContent = this.state.secim === null
                    ? 'Cevap veremedin.'
                    : (this.state.secim === soru.dogru ? 'Doğru! 🎉' : 'Bu sefer olmadı.');
            } else {
                durum.textContent = this.state.secim === null
                    ? 'Bir şık seç.'
                    : 'Cevabın kaydedildi, diğerleri bekleniyor…';
            }
        }
    },

    kacis(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
