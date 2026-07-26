/* =========================================================
   FIREBASE AYAR BLOĞU — DOLU, DEĞİŞTİRMENE GEREK YOK
   ---------------------------------------------------------
   Sağ üstteki "اِتَّصِلْ" rozeti (Dijital Yarışma) Firestore
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
            { emoji:"👨‍🏫", word:"مُدَرِّس" },
            { emoji:"🏫",  word:"مَدْرَسَة" },
            { emoji:"📖",  word:"دَرْس" },
            { emoji:"📚",  word:"دُروس" }
        ]
    },
    {
        root: "ع ل م",
        targets: [
            { emoji:"🧑‍🏫", word:"مُعَلِّم" },
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
            { emoji:"🧘",  word:"تَفَكُّر" },
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
     II. bab (فَعَّلَ, şeddeli)          → س ل م , ف ك ر , ع ر ف
     V. bab  (تَفَعَّلَ, başta zaid تَ)   → ع ل م
   60 kelimeyi tek tek yazmak yerine her bab için mâzî/muzâri gövdesi,
   muzâri ön ekinin harekesi ve emirdeki vasıl hemzesi tarif ediliyor;
   gerisini buildConjugation üretiyor. Sülâsîde emir hemzesi muzâri
   harekesine göre damme (يَكْتُبُ → اُكْتُبْ) ya da kesre (يَعْلَمُ → اِعْلَمْ)
   alır; II. ve V. babda gövde zaten harekeli başladığı için vasıl
   hemzesi YOKTUR (سَلِّمْ , تَعَلَّمْ). */
const FATHA = '\u064E', DAMMA = '\u064F', KASRA = '\u0650', SUKUN = '\u0652';
const SHADDA = '\u0651';
const HARAKA = { a: FATHA, u: DAMMA, i: KASRA };

const VERB_FORMS = {
    "د ر س": { bab: 'I',  past: 'a', pres: 'u' },  // دَرَسَ  – يَدْرُسُ   – اُدْرُسْ
    "ك ت ب": { bab: 'I',  past: 'a', pres: 'u' },  // كَتَبَ  – يَكْتُبُ   – اُكْتُبْ
    "ع ل م": { bab: 'V' },                          // تَعَلَّمَ – يَتَعَلَّمُ – تَعَلَّمْ
    "س ل م": { bab: 'II' },                         // سَلَّمَ  – يُسَلِّمُ  – سَلِّمْ
    "ف ك ر": { bab: 'II' },                         // فَكَّرَ  – يُفَكِّرُ  – فَكِّرْ
    "ع ر ف": { bab: 'II' }                          // عَرَّفَ  – يُعَرِّفُ  – عَرِّفْ
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
        madiStem = f + FATHA + a + SHADDA + FATHA;                 // سَلَّ
        mudStem  = f + FATHA + a + SHADDA + KASRA;                 // سَلِّ
        onEk     = DAMMA;                                          // يُسَلِّمُ
        wasl     = '';                                             // سَلِّمْ
    } else if (v.bab === 'V') {
        madiStem = 'ت' + FATHA + f + FATHA + a + SHADDA + FATHA;   // تَعَلَّ
        mudStem  = madiStem;                                       // يَتَعَلَّمُ
        onEk     = FATHA;
        wasl     = '';                                             // تَعَلَّمْ
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

const GAME2_ROUNDS = [
    [
        { word:"مَسْجِد",  root:"س ج د" },
        { word:"مَجْلِس",  root:"ج ل س" },
        { word:"مُحْتَرَم", root:"ح ر م" },
        { word:"مَحْمود",  root:"ح م د" },
        { word:"مَدْرَسَة", root:"د ر س" }
    ],
    [
        { word:"تَقْدير",  root:"ق د ر" },
        { word:"مُحَمَّد",  root:"ح م د" },
        { word:"تَسْليم",  root:"س ل م" },
        { word:"مُقْتَدِر", root:"ق د ر" },
        { word:"مَعْلوم",  root:"ع ل م" }
    ],
    [
        { word:"أَحْمَد",   root:"ح م د" },
        { word:"اِقْتِدار", root:"ق د ر" },
        { word:"قُدْرَة",   root:"ق د ر" },
        { word:"حَمْد",    root:"ح م د" },
        { word:"قَدَر",    root:"ق د ر" }
    ]
];

const GAME3_PATTERNS = [
    {
        name: "فاعِل",
        zaid: [1], // ا (elif)
        map: { "ع ل م":"عالِم", "ك ت ب":"كاتِب", "س ل م":"سالِم", "ح م د":"حامِد", "ق د ر":"قادِر" }
    },
    {
        name: "مُفَعِّل",
        zaid: [0], // م
        map: { "د ر س":"مُدَرِّس", "ع ل م":"مُعَلِّم" }
    },
    {
        name: "مَفْعول",
        zaid: [0, 3], // م و
        map: { "ع ل م":"مَعْلوم", "ك ت ب":"مَكْتوب", "ح م د":"مَحْمود", "ح ر م":"مَحْروم" }
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
function rootColors(root) { return ROOT_COLORS[root] || DEFAULT_ROOT_COLOR; }
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

        /* Üç oyun kartı + sağ üstteki bağlantı rozeti aynı yönlendirmeyi kullanır. */
        document.querySelectorAll('.menu-card, .menu-connect').forEach(card => {
            card.addEventListener('click', () => {
                this.playSound('click');
                const target = card.dataset.goto;
                if (target === 'game1-screen') Game1.start();
                else if (target === 'game2-screen') Game2.start();
                else if (target === 'game3-screen') Game3.start();
                else if (target === 'quiz-screen') { Quiz.start(); }
                this.showScreen(target);
            });
        });

        document.getElementById('done-menu').addEventListener('click', () => {
            this.playSound('click');
            this.hideDone();
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

        this.showScreen('start-screen');
    },

    showScreen(id) {
        this.dom.screens.forEach(s => s.classList.remove('active'));
        const t = document.getElementById(id);
        if (t) t.classList.add('active');
    },

    playSound(key) {
        if (!this.state.audioCtx) return;
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

    conjMarkup() {
        return `
            <div class="g1-conj-btn" id="g1-conj-btn">
                <span>تَصْريفُ الفِعْل</span><span class="caret">\u25BC</span>
            </div>
            <div class="g1-conj-panel" id="g1-conj-panel">
                <div class="g1-conj-tabs">
                    <div class="g1-conj-tab" data-t="madi">الماضي</div>
                    <div class="g1-conj-tab" data-t="mudari">المُضارِع</div>
                    <div class="g1-conj-tab" data-t="amr">الأَمْر</div>
                </div>
                <div class="g1-conj-list" id="g1-conj-list"></div>
                <div class="g1-conj-hint" id="g1-conj-hint">اِخْتَرْ زَمَنًا لِتَرى التَّصْريف</div>
            </div>`;
    },

    /* Sağ üstteki (ilerleme rozetinin altındaki) "تَصْريفُ الفِعْل" penceresi: üç zaman başlığı yatay durur,
       tıklananın tekil çekimi altta açılır. Çekim, SEÇİLİ kökten üretilir;
       zaid (kökten gelmeyen) harfler burada da kırmızı gösterilir.
       root null ise (henüz kök seçilmediyse) düğme pasif/soluk kalır.
       Pencere her seferinde sıfırdan yazıldığı için eski dinleyiciler birikmiyor. */
    setupConjugation(root) {
        const host = document.getElementById('g1-conj-host');
        host.innerHTML = this.conjMarkup();
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
                list.innerHTML = table[tab.dataset.t].map(pair =>
                    `<div class="g1-conj-row"><span class="pron">${pair[0]}</span>` +
                    (pair[1]
                        ? `<span class="verb"><span class="g3-pattern-text">${formatWordVsRoot(pair[1], root)}</span></span>`
                        : `<span class="verb none">\u2014</span>`) +
                    `</div>`
                ).join('');
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
                <div class="g1-title" dir="rtl">اُسْحَبِ الجَذْرَ إِلى الصّورَةِ المُناسِبَة</div>
                <div class="g1-root-bar" id="g1-root-bar" dir="rtl">
                    <div class="g1-conj-host" id="g1-conj-host"></div>
                </div>
                <div class="g1-circle" id="g1-circle"></div>
            </div>
        `;
        document.getElementById('g1-back').addEventListener('click', () => {
            App.playSound('click');
            App.showScreen('start-screen');
        });

        const bar = document.getElementById('g1-root-bar');
        ROOTS_GAME1.forEach((r, i) => {
            const c = document.createElement('div');
            c.className = 'g1-root-bar-chip';
            c.dataset.index = i;
            c.dir = 'rtl';
            c.textContent = formatRootDisplay(r.root);
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
            App.showDone('🎉', 'أَحْسَنْتَ! لَقَد أَتْمَمْتَ كُلَّ الجُذور');
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
========================================================= */
const Game2 = {
    /* Oyun 2 artık üç turdan oluşuyor (bkz. GAME2_ROUNDS).
       roundIdx = kaçıncı tur, usedCount = bu turda çözülen, doneTotal = toplam. */
    state: { roundIdx: 0, words: [], usedCount: 0, doneTotal: 0 },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    totalWords() {
        return GAME2_ROUNDS.reduce((sum, r) => sum + r.length, 0);
    },

    start() {
        this.state.roundIdx = 0;
        this.state.doneTotal = 0;
        this.renderRound();
    },

    renderRound() {
        this.state.words = this.shuffle(GAME2_ROUNDS[this.state.roundIdx].slice());
        this.state.usedCount = 0;
        this.render();
    },

    nextRound() {
        this.state.roundIdx++;
        if (this.state.roundIdx >= GAME2_ROUNDS.length) {
            App.showDone('⚙️', 'أَحْسَنْتَ! لَقَد اسْتَخْرَجْتَ كُلَّ الجُذور');
            document.getElementById('done-replay').onclick = () => {
                App.hideDone();
                this.start();
            };
            return;
        }
        this.renderRound();
    },

    render() {
        const screen = document.getElementById('game2-screen');
        screen.innerHTML = `
            <div class="back-btn" id="g2-back">${BACK_SVG}</div>
            <div class="progress-pill" id="g2-progress">${this.state.doneTotal} / ${this.totalWords()}</div>
            <div class="g2-wrap">
                <div class="g1-title" dir="rtl">اُسْحَبِ الكَلِمَةَ إِلى الآلَةِ لِتَسْتَخْرِجَ جَذْرَها</div>
                <div class="g2-stage" id="g2-stage" style="--g2-satir:${this.state.words.length}">
                    <div class="drop-zone g2-machine" id="g2-machine">
                        <div class="g2-gear-visual" id="g2-gear">
                            <span class="gear">⚙️</span><span class="gear g2">⚙️</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('g2-back').addEventListener('click', () => {
            App.playSound('click');
            App.showScreen('start-screen');
        });

        const stage = document.getElementById('g2-stage');
        this.state.words.forEach((w, i) => {
            /* Önce o kelimeye ait (şimdilik boş) kök yuvası, hemen ardından
               kelime kutusu ekleniyor. Izgara ikisini aynı satıra yerleştirdiği
               için çıkan kök kelimesinin tam karşısında beliriyor. */
            const slot = document.createElement('div');
            slot.className = 'g2-root-slot';
            slot.id = 'g2-slot-' + i;
            stage.appendChild(slot);

            const chip = document.createElement('div');
            chip.className = 'g2-word-chip';
            chip.dir = 'rtl';
            /* Sürükleme ipucu dalgası sırayla gelsin: kutular artık yuvalarla
               dönüşümlü sıralandığı için gecikme CSS'teki nth-child yerine
               buradan veriliyor. */
            chip.style.animationDelay = (i * 0.16) + 's';
            // Zaid (kökten gelmeyen ek) harfler burada da kırmızı gösteriliyor.
            chip.innerHTML = `<span class="g3-pattern-text">${formatWordVsRoot(w.word, w.root)}</span>`;
            chip.dataset.index = i;
            // Kelimenin çerçevesi ait olduğu kökün rengini alıyor.
            paintRootBadge(chip, w.root);
            stage.appendChild(chip);

            App.makeDraggable(chip, {
                getClone: () => {
                    const c = document.createElement('div');
                    c.className = 'g2-ghost';
                    c.dir = 'rtl';
                    c.innerHTML = `<span class="g3-pattern-text">${formatWordVsRoot(w.word, w.root)}</span>`;
                    paintRootBadge(c, w.root);
                    return c;
                },
                onDrop: (target) => this.handleDrop(target, chip, w)
            });
        });
    },

    handleDrop(target, chip, w) {
        if (!target.classList.contains('g2-machine')) return;
        if (chip.classList.contains('used')) return;
        chip.classList.add('used');

        const gear = document.getElementById('g2-gear');
        gear.classList.add('grinding');
        App.playSound('gear');

        setTimeout(() => {
            gear.classList.remove('grinding');
            const slot = document.getElementById('g2-slot-' + chip.dataset.index);
            const res = document.createElement('div');
            res.className = 'g2-root-result';
            res.dir = 'rtl';
            res.innerHTML = `<div>${formatRootDisplay(w.root)}</div>`;
            paintRootBadge(res, w.root);
            if (slot) slot.appendChild(res);
            App.playSound('correct');

            this.state.usedCount++;
            this.state.doneTotal++;
            document.getElementById('g2-progress').textContent = `${this.state.doneTotal} / ${this.totalWords()}`;
            if (this.state.usedCount === this.state.words.length) {
                // Tur bitti: ya sonraki turu kur ya da bitiş ekranini goster.
                setTimeout(() => this.nextRound(), 900);
            }
        }, 500);
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
                <div class="g1-title" dir="rtl">اُسْحَبِ الجَذْرَ إِلى الوَزْنِ لِتَصْنَعَ كَلِمَةً جَديدَة</div>
                <div class="g3-stage">
                    <div class="g3-output-slot" id="g3-output"><span class="empty-msg">الكَلِمَة هُنا سَتَظْهَر</span></div>
                    <div class="g3-pattern-box">
                        <div class="g3-pattern-nav">
                            <div class="g3-pattern-arrow" id="g3-prev">‹</div>
                            <div class="drop-zone g3-pattern-slot" id="g3-slot" dir="rtl"><span class="g3-pattern-text">${formatPatternDisplay(pattern)}</span></div>
                            <div class="g3-pattern-arrow" id="g3-next">›</div>
                        </div>
                        <div class="g3-checklist" id="g3-checklist"></div>
                    </div>
                    <div class="g3-roots" id="g3-roots"></div>
                </div>
            </div>
        `;
        document.getElementById('g3-back').addEventListener('click', () => {
            App.playSound('click');
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
        this.renderChecklist();
    },

    changePattern(delta) {
        this.state.patternIdx = (this.state.patternIdx + delta + GAME3_PATTERNS.length) % GAME3_PATTERNS.length;
        this.render();
    },

    handleDrop(target, root) {
        if (!target.classList.contains('g3-pattern-slot')) return;
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
            out.innerHTML = `<span class="empty-msg">${formatRootDisplay(root)} + <span class="g3-pattern-text">${formatPatternDisplay(pattern)}</span> &larr; لا تُوجَد كَلِمَة بِهٰذا الوَزْن</span>`;
            return;
        }

        App.playSound('correct');
        // Türeyen kelimede de zaid harfler kırmızı gösteriliyor (kalıptaki
        // zaid index'leri türeyen kelimede aynı harflere denk gelir).
        const wordHtml = `<span class="g3-pattern-text">${formatDerivedDisplay(word, pattern)}</span>`;
        this.flowWordToOutput(wordHtml, slot, out, root, () => {
            out.classList.add('filled');
            out.innerHTML = `<div>${wordHtml}</div><div class="detail-line">${formatRootDisplay(root)} + <span class="g3-pattern-text">${formatPatternDisplay(pattern)}</span></div>`;

            const key = pattern.name + '|' + root;
            if (!this.state.doneSet.has(key)) {
                this.state.doneSet.add(key);
                document.getElementById('g3-progress').textContent = `${this.state.doneSet.size} / ${this.totalValid()}`;
                this.renderChecklist();
                if (this.state.doneSet.size === this.totalValid()) {
                    setTimeout(() => {
                        App.showDone('🏆', 'أَحْسَنْتَ! لَقَد اكْتَشَفْتَ كُلَّ الاِشْتِقاقات');
                        document.getElementById('done-replay').onclick = () => {
                            App.hideDone();
                            this.start();
                        };
                    }, 900);
                }
            }
        });
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
    },

    renderChecklist() {
        const pattern = GAME3_PATTERNS[this.state.patternIdx];
        const wrap = document.getElementById('g3-checklist');
        wrap.innerHTML = '';
        Object.keys(pattern.map).forEach((root) => {
            const dot = document.createElement('div');
            dot.className = 'g3-dot' + (this.state.doneSet.has(pattern.name + '|' + root) ? ' done' : '');
            dot.title = formatRootDisplay(root);
            // Nokta, temsil ettigi kokun rengini alir; tamamlaninca dolar.
            dot.style.setProperty('--root-dot', rootColors(root)[0]);
            wrap.appendChild(dot);
        });
    }
};


/* =========================================================
   OYUN 4: DİJİTAL YARIŞMA — "اِتَّصِلْ"
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
   SORU ÜRETİCİ — beş soru ailesi:
   1) kelime → kök          2) kök → türeyen kelime
   3) kelime → vezin        4) kök + vezin → kelime
   5) fiil çekimi (mâzî / muzâri / emir)
--------------------------------------------------------- */
function quizSorulariUret() {
    const S = [];
    const kokSet = new Set();
    const kelimeKok = [];

    ROOTS_GAME1.forEach(g => {
        kokSet.add(g.root);
        g.targets.forEach(t => kelimeKok.push({ word: t.word, root: g.root, oyun1: true }));
    });
    GAME2_ROUNDS.forEach(tur => tur.forEach(x => {
        kokSet.add(x.root);
        kelimeKok.push({ word: x.word, root: x.root, oyun1: false });
    }));
    GAME3_PATTERNS.forEach(p => Object.keys(p.map).forEach(r => kokSet.add(r)));

    const kokler = Array.from(kokSet);
    const kokGorunum = kokler.map(r => formatRootDisplay(r));
    const kelimeHavuz = kelimeKok.map(x => x.word);

    /* 1) Kelime → kök */
    kelimeKok.forEach(x => {
        const k = qzSoruYap(formatRootDisplay(x.root), kokGorunum);
        S.push({
            ar: x.word,
            s: 'ما جَذْرُ هٰذِهِ الكَلِمَة؟',
            tr: 'Bu kelimenin kökü hangisidir?',
            secenekler: k.secenekler, dogru: k.dogru
        });
    });

    /* 2) Kök → o kökten türeyen kelime (yalnızca oyun 1 kelimeleri) */
    kelimeKok.filter(x => x.oyun1).forEach(x => {
        const disHavuz = kelimeKok.filter(y => y.root !== x.root).map(y => y.word);
        const k = qzSoruYap(x.word, disHavuz);
        S.push({
            ar: formatRootDisplay(x.root),
            s: 'أَيُّ كَلِمَةٍ مُشْتَقَّةٌ مِنْ هٰذا الجَذْر؟',
            tr: 'Bu kökten türeyen kelime hangisidir?',
            secenekler: k.secenekler, dogru: k.dogru
        });
    });

    /* 3) Kelime → vezin (çeldiriciler için birkaç tanıdık vezin eklendi) */
    const vezinHavuz = GAME3_PATTERNS.map(p => p.name)
        .concat(['فَعيل', 'تَفْعيل', 'إِفْعال', 'مَفْعَلَة', 'اِفْتِعال', 'مُفْتَعِل']);
    GAME3_PATTERNS.forEach(p => Object.keys(p.map).forEach(r => {
        const k = qzSoruYap(p.name, vezinHavuz);
        S.push({
            ar: p.map[r],
            s: 'ما وَزْنُ هٰذِهِ الكَلِمَة؟',
            tr: 'Bu kelimenin vezni hangisidir?',
            secenekler: k.secenekler, dogru: k.dogru
        });
    }));

    /* 4) Kök + vezin → kelime */
    GAME3_PATTERNS.forEach(p => Object.keys(p.map).forEach(r => {
        const k = qzSoruYap(p.map[r], kelimeHavuz);
        S.push({
            ar: formatRootDisplay(r),
            s: 'أَيُّ كَلِمَةٍ عَلى وَزْنِ «' + p.name + '» مِنْ هٰذا الجَذْر؟',
            tr: '«' + p.name + '» vezninde bu kökten gelen kelime hangisidir?',
            secenekler: k.secenekler, dogru: k.dogru
        });
    }));

    /* 5) Fiil çekimi — mâzî / muzâri / emir */
    const zamanAd = {
        madi:   ['الماضي',    'geçmiş zaman (mâzî)'],
        mudari: ['المُضارِع',  'geniş/şimdiki zaman (muzâri)'],
        amr:    ['الأَمْر',    'emir']
    };
    const tumFiiller = [];
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
            const k = qzSoruYap(pair[1], tumFiiller);
            S.push({
                ar: formatRootDisplay(root),
                s: 'ما ' + zamanAd[z][0] + ' مِنْ هٰذا الجَذْرِ لِـ «' + pair[0] + '»؟',
                tr: 'Bu kökün ' + zamanAd[z][1] + ' çekimi (' + pair[0] + ') hangisidir?',
                secenekler: k.secenekler, dogru: k.dogru
            });
        }));
    });

    return S;
}

/* =========================================================
   QUIZ — ekran yönetimi + Firestore canlı bağlantısı
========================================================= */
const Quiz = {
    _db: null,
    _gorunum: null,
    /* Geri tuşuyla ekrandan ayrılınca oda KAPANMAZ; buraya alınır ve
       "اِتَّصِلْ" rozetine tekrar basılınca kaldığı yerden devam eder. */
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
            if (!firebase.apps.length) firebase.initializeApp(SARF_FIREBASE_CONFIG);
            this._db = firebase.firestore();
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
        return '<div class="qz-baslik" dir="rtl">اِتَّصِلْ · المُسابَقَة الرَّقَمِيَّة</div>';
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
                    'menüye dönersin, katılanlar odada kalır ve “اِتَّصِلْ” rozetine basınca ' +
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
    oyunCiz() {
        const o = this.state.oda;
        const soru = o.sorular[o.index];
        const yonetici = this.state.rol === 'yonetici';
        const harfler = ['أ', 'ب', 'ج', 'د'];
        this.ciz(
            '<div class="qz-ust">' +
              '<span>' + (o.index + 1) + ' / ' + o.sorular.length + '</span>' +
              '<span class="qz-sayac" id="qz-sayac">--</span>' +
              '<span id="qz-cevap-sayi"></span>' +
            '</div>' +
            '<div class="qz-kart">' +
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
                  'dönersin, “اِتَّصِلْ” rozetiyle aynı soruya geri gelirsin.</div>'
                : '') +
            '</div>' +
            (yonetici ? '<div class="qz-kart"><h3>🏅 Puan Durumu</h3><div class="qz-sira" id="qz-sira"></div></div>' : '')
        );

        if (!yonetici) {
            document.getElementById('qz-secenekler').addEventListener('click', e => {
                const el = e.target.closest('.qz-secenek');
                if (el) this.cevapVer(parseInt(el.dataset.i, 10));
            });
        } else {
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
        }
    },

    /* ================= dinamik yamalar ================= */
    yamala() {
        const o = this.state.oda; if (!o) return;
        const takimlar = this.state.takimlar || [];

        /* Ayrı ekranlar: sonuç sahnesi ve final tablosu kendi yamalarını ister. */
        if (document.getElementById('qz-sonuc-ekran')) this.sonucYamala();
        if (document.getElementById('qz-final-ol'))    this.finalYamala();

        /* Lobideki takım/kişi çipleri */
        const cipler = document.getElementById('qz-takimlar');
        if (cipler) {
            cipler.innerHTML = takimlar.length
                ? takimlar.map(t => '<span class="qz-takim-cip">' + this.kacis(t.ad) + '</span>').join('')
                : '<span class="qz-kod-not">Henüz katılan yok…</span>';
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
