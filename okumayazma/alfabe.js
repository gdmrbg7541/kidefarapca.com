/* ÇOK DİLLİ SİTE (15.10.2026) — kodun yazdığı yazılar seçilen dilde.
   Yazı sistem/dil.js sözlüğünden gelir; dil Türkçeyse, sözlük henüz
   yüklenmemişse ya da çeviri yoksa Türkçesi kalır.
     kdMetin(anahtar, türkçe, {ad: değer})  yazıyı verir, {…} yerlerini doldurur
     kdYaz(öğe, anahtar, türkçe, {…})        öğeye anahtarıyla yazar; sözlük sonradan
                                             yüklense de dil değişse de yazı döner
     kdIsaretli(anahtar, türkçe)             innerHTML içine konacak işaretli <span>
     kdSerbest(öğe)                          öğenin işaretini kaldırır (kod oraya her
                                             an başka yazı yazıyorsa)
     kdDil()                                 sayfanın o anki dili */
function kdDoldur(m, yer) {
    if (!yer || m == null) return m;
    return String(m).replace(/\{([A-Za-z0-9_]+)\}/g, function (t, ad) {
        return Object.prototype.hasOwnProperty.call(yer, ad) ? String(yer[ad]) : t;
    });
}
function kdMetin(k, tr, yer) {
    var m = (window.KidefDil && window.KidefDil.metin) ? window.KidefDil.metin(k, tr) : tr;
    return kdDoldur(m, yer);
}
function kdYaz(el, k, tr, yer) {
    if (!el) return;
    if (window.KidefDil && window.KidefDil.yaz) { window.KidefDil.yaz(el, k, tr, yer); return; }
    el.setAttribute('data-i18n', k);
    el.setAttribute('data-i18n-tr', tr);
    if (yer) el.setAttribute('data-i18n-yer', JSON.stringify(yer)); else el.removeAttribute('data-i18n-yer');
    el.textContent = kdDoldur(tr, yer);
}
function kdIsaretli(k, tr) {
    var e = function (x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
    return '<span data-i18n="' + k + '" data-i18n-tr="' + e(tr) + '">' + e(kdMetin(k, tr)) + '</span>';
}
function kdSerbest(el) {
    if (el && el.removeAttribute) el.removeAttribute('data-i18n');
    return el;
}
function kdDil() {
    return document.documentElement.getAttribute('lang') || 'tr';
}
const harfler = [
        {h: 'ا', tr: 'Elif', b:'ا', o:'ـا', s:'ـا', nobind: true}, 
        {h: 'ب', tr: 'Be', b:'بـ', o:'ـبـ', s:'ـب'},
        {h: 'ت', tr: 'Te', b:'تـ', o:'ـتـ', s:'ـت'}, 
        {h: 'ث', tr: 'Peltek S̱e', b:'ثـ', o:'ـثـ', s:'ـث'},
        {h: 'ج', tr: 'Cim', b:'جـ', o:'ـجـ', s:'ـج'}, 
        {h: 'ح', tr: 'Ḥa', b:'حـ', o:'ـحـ', s:'ـح'},
        {h: 'خ', tr: 'Ḫa (Hırıltılı)', b:'خـ', o:'ـخـ', s:'ـخ'}, 
        {h: 'د', tr: 'Dal', b:'د', o:'ـد', s:'ـد', nobind: true},
        {h: 'ذ', tr: 'Ẕel (Peltek)', b:'ذ', o:'ـذ', s:'ـذ', nobind: true}, 
        {h: 'ر', tr: 'Ra', b:'ر', o:'ـر', s:'ـر', nobind: true},
        {h: 'ز', tr: 'Ze', b:'ز', o:'ـز', s:'ـز', nobind: true}, 
        {h: 'س', tr: 'Sin', b:'سـ', o:'ـسـ', s:'ـس'},
        {h: 'ش', tr: 'Şın', b:'شـ', o:'ـشـ', s:'ـش'}, 
        {h: 'ص', tr: 'Ṣad (Kalın S)', b:'صـ', o:'ـصـ', s:'ـص'},
        {h: 'ض', tr: 'Ḍad', b:'ضـ', o:'ـضـ', s:'ـض'}, 
        {h: 'ط', tr: 'Ṭa', b:'طـ', o:'ـطـ', s:'ـط'},
        {h: 'ظ', tr: 'Ẓa', b:'ظـ', o:'ـظـ', s:'ـظ'}, 
        {h: 'ع', tr: 'Ayn (ʿ)', b:'عـ', o:'ـعـ', s:'ـع'},
        {h: 'غ', tr: 'Ğayn', b:'غـ', o:'ـغـ', s:'ـغ'}, 
        {h: 'ف', tr: 'Fe', b:'فـ', o:'ـفـ', s:'ـف'},
        {h: 'ق', tr: 'Qaf', b:'قـ', o:'ـقـ', s:'ـق'}, 
        {h: 'ك', tr: 'Kef', b:'كـ', o:'ـكـ', s:'ـك'},
        {h: 'ل', tr: 'Lam', b:'لـ', o:'ـلـ', s:'ـل'}, 
        {h: 'م', tr: 'Mim', b:'مـ', o:'ـمـ', s:'ـم'},
        {h: 'ن', tr: 'Nun', b:'نـ', o:'ـنـ', s:'ـن'},
        {h: 'و', tr: 'Waw', b:'و', o:'ـو', s:'ـو', nobind: true},
        {h: 'ه', tr: 'He', b:'هـ', o:'ـهـ', s:'ـه'}, 
        {h: 'ي', tr: 'Ye', b:'يـ', o:'ـيـ', s:'ـي'}
    ];

/* Yazılışı birbirine benzeyen harf aileleri (kart arka plan renkleri için).
   Aynı gövdeyi paylaşan harfler aynı grupta; kendine özgü yazılan harfler "tek". */
const HARF_AILE = {
    'ب':'be',  'ت':'be',  'ث':'be',
    'ج':'cim', 'ح':'cim', 'خ':'cim',
    'د':'dal', 'ذ':'dal',
    'ر':'ra',  'ز':'ra',
    'س':'sin', 'ش':'sin',
    'ص':'sad', 'ض':'sad',
    'ط':'ta',  'ظ':'ta',
    'ع':'ayn', 'غ':'ayn',
    'ف':'fe',  'ق':'fe'
};
/* Okunuşu birbirine benzeyen harfler (Türkçe kulakla karışanlar).
   Harf Tanıtımı sekmesindeki switch "okunuş" tarafına alındığında
   kartlar bu gruplara göre renklenir. Grup eklemek/çıkarmak için
   sadece bu tabloyu düzenlemek yeter. */
const HARF_SES = {
    'ث':'s', 'س':'s', 'ص':'s',        /* peltek se – sin – sad  : S */
    'ذ':'z', 'ز':'z', 'ظ':'z',        /* zel – ze – za          : Z */
    'ت':'t', 'ط':'t',                 /* te – tı                : T */
    'د':'d', 'ض':'d',                 /* dal – dad              : D */
    'ه':'h', 'ح':'h', 'خ':'h',        /* he – ha – hı           : H */
    'ك':'k', 'ق':'k',                 /* kef – kaf              : K */
    'ا':'ayn', 'ع':'ayn'              /* elif(hemze) – ayn      : boğaz sesi */
};
const SES_ADI = {
    s: 'S sesi (ث س ص)', z: 'Z sesi (ذ ز ظ)', t: 'T sesi (ت ط)', d: 'D sesi (د ض)',
    h: 'H sesi (ه ح خ)', k: 'K sesi (ك ق)', ayn: 'Boğaz sesi (ا ع)', tek: 'Benzeri yok'
};
const AILE_ADI = {
    be: 'Be ailesi (ب ت ث)', cim: 'Cim ailesi (ج ح خ)', dal: 'Dal ailesi (د ذ)',
    ra: 'Ra ailesi (ر ز)', sin: 'Sin ailesi (س ش)', sad: 'Sad ailesi (ص ض)',
    ta: 'Tı ailesi (ط ظ)', ayn: 'Ayn ailesi (ع غ)', fe: 'Fe ailesi (ف ق)', tek: 'Benzeri yok'
};

/* Harf Tanıtımı başlığındaki switch: kartlar "yazılışı benzeyenlere" göre mi,
   "okunuşu benzeyenlere" göre mi renklensin? Renkleri tablo üzerindeki
   .mod-yazi / .mod-ses sınıfı seçer, kartlarda iki sınıf birlikte durur. */
const harfGrup = {
    mod: 'yazi',
    set: function (mod) {
        this.mod = (mod === 'ses') ? 'ses' : 'yazi';
        const t = document.querySelector('.harf-tablo');
        if (t) {
            t.classList.toggle('mod-ses', this.mod === 'ses');
            t.classList.toggle('mod-yazi', this.mod === 'yazi');
        }
        const inp = document.getElementById('grup-toggle');
        if (inp) inp.checked = (this.mod === 'ses');
        document.querySelectorAll('.grp-ico--yazi').forEach(e => e.classList.toggle('on', this.mod === 'yazi'));
        document.querySelectorAll('.grp-ico--ses').forEach(e => e.classList.toggle('on', this.mod === 'ses'));
        /* kartın ipucu metni de aktif gruba göre değişsin */
        document.querySelectorAll('#g1 .char-card').forEach(c => {
            const ad = (this.mod === 'ses') ? (c.dataset.sesAd || '') : (c.dataset.aileAd || '');
            c.title = kdMetin('alf.detay_ip', 'Detay için tıkla: mahreç ve yazılış') + (ad ? ' — ' + ad : '');
        });
        /* Dizili moddayken switch sadece rengi değil dizilişi de değiştirir:
           kalem tarafında yazılış aileleri, hoparlör tarafında ses grupları
           yan yana gelsin diye kartlar yeniden paketlenip animasyonla dizilir. */
        if (typeof dizilis !== 'undefined' && dizilis.acik) dizilis.uygula(true);
    },
    sec: function (mod) { playClick(); this.set(mod); }
};

// --- WEB AUDIO API İLE SİNÜS DALGASI (SINE WAVE) SES ÜRETECİ ---
let audioCtx;
function initAudio() {
    if (!audioCtx) {
        try {
            const C = window.AudioContext || window.webkitAudioContext;
            if (!C) return null;                 /* ses desteklemeyen tarayıcı */
            audioCtx = new C();
        } catch (e) { return null; }
    }
    return audioCtx;
}

/* SES KİLİDİNİ İLK DOKUNUŞTA AÇ (08.10.2026) — tarayıcılar sesi ancak
   kullanıcı etkileşiminden sonra çalıyor. Sayfa açılır açılmaz bir kez
   dinleyici kurulur; ilk dokunuş/tuş AudioContext'i uyandırır, böylece
   ilk "tık" sesi de yutulmaz. */
(function sesKilidi() {
    const ac = function () {
        const c = initAudio();
        if (c && c.state === 'suspended') { try { c.resume(); } catch (e) { } }
    };
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (t) {
        document.addEventListener(t, ac, { once: true, passive: true, capture: true });
    });
})();

function playSineTone(freq1, freq2, duration) {
    if (!initAudio()) return;
    if (audioCtx.state === 'suspended') { try { audioCtx.resume(); } catch (e) { } }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine'; // Sinüs Dalgası
    
    osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
    if(freq2) {
        osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + duration);
    }

    // Sesi yumuşak başlat ve bitir (Çıt sesini önler)
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Özel Ses Fonksiyonları
const playClick = () => { playSineTone(600, null, 0.1); };

const playCorrect = () => {
    playSineTone(440, null, 0.1); // La
    setTimeout(() => playSineTone(554.37, null, 0.1), 100); // Do#
    setTimeout(() => playSineTone(659.25, null, 0.3), 200); // Mi
};

const playWrong = () => {
    playSineTone(250, null, 0.15); // Kalın bip
    setTimeout(() => playSineTone(200, null, 0.25), 150); // Daha kalın bip
};

/* GERİ SAYIM: 3-2-1 giderek tizleşir, "başla"da kısa bir çıkış sesi. */
const playCountdown = (n) => {
    const hz = (n >= 3) ? 520 : (n === 2 ? 620 : 740);
    playSineTone(hz, null, 0.12);
};
const playStart = () => {
    playSineTone(660, null, 0.10);
    setTimeout(() => playSineTone(880, null, 0.22), 90);
};

/* ===== SESLER PENCEREYE AÇILIYOR (08.10.2026) =====================
   Öğretmen: "alfabe.html deki tüm etkinliklerde dokunma sesi, doğru
   yanlış sesi, geri sayım sesi vb olsun, şu an çalışmıyor."
   Sebebi: bu fonksiyonlar `const` ile tanımlı. const/let üst düzeyde
   GLOBAL SÖZCÜKSEL kapsama girer, window'un ÖZELLİĞİ olmaz. Sekme
   dosyaları (alfabe_sinav.js, alfabe_akordiyon.js, alfabe_birlestir.js)
   ise sesi `typeof window.playClick === 'function'` diye arıyordu; bu
   kontrol her zaman false dönüyor, hiçbir ses çıkmıyordu. Adları
   pencereye açınca üç dosya da sesi buluyor. */
window.playSineTone = playSineTone;
window.playClick    = playClick;
window.playCorrect  = playCorrect;
window.playWrong    = playWrong;
window.playCountdown = playCountdown;
window.playStart    = playStart;
// -----------------------------------------------------------------

window.handleFlipBox = function(el) {
    playClick();
    if (el.classList.contains('is-flipped')) {
        clearTimeout(el.studyTimer);
        el.classList.remove('is-flipped');
    } else {
        el.classList.add('is-flipped');
        el.studyTimer = setTimeout(() => {
            el.classList.remove('is-flipped');
        }, 3000);
    }
};

/* ============================================================
   TABLO ÇİZGİLERİ — tek tek ayarlanabilir kenarlar
   ------------------------------------------------------------
   Varsayılan olarak HİÇBİR tablo çizgisi görünmez; sadece burada yazılanlar çizilir.
   Her satır bir çizgi tarifidir:
     { n: harf numarası / '1-6' / '7,8,21,22', kenar: 'ust'|'alt'|'sag'|'sol',
       durum: 'cizgi' | 'yok' | 'kalin' | 'vurgu'  (boşlukla birleştirilebilir) }
   Örnekler:
     { n: '1-6', kenar: 'alt', durum: 'cizgi' }        -> 1..6'nın altına çizgi çeker
     { n: 7,     kenar: 'alt', durum: 'yok'   }        -> 7 ile 8 arasını açık bırakır
     { n: 1,     kenar: 'sag', durum: 'cizgi kalin' }  -> elifin sağındaki dış çizgiyi kalın çizer
   İki hücrenin paylaştığı çizgi tek bir yerde tanımlıdır: aşağıdaki çözücü
   çizginin sahibi hücreyi bulup sınıfı ona ekler, o yüzden hangi kartın
   üstünden/altından söylersen fark etmez, çizgi doğru yerde değişir.
   ============================================================ */
const TABLO_KENAR = [
    /* --- LABİRENT DUVARLARI: satırlar arası, dönüş noktaları açık --- */
    { n: '1-6',   kenar: 'alt', durum: 'cizgi' },   /* 7'nin altı açık  -> 7'den 8'e iner */
    { n: '8-13',  kenar: 'alt', durum: 'cizgi' },   /* 14'ün altı açık  -> 14'ten 15'e iner */
    { n: '15-20', kenar: 'alt', durum: 'cizgi' },   /* 21'in altı açık  -> 21'den 22'ye iner */

    /* --- DIŞ ÇERÇEVE: 1'in sağı (giriş) ve 28'in sağı (çıkış) hariç --- */
    { n: '1-7',       kenar: 'ust', durum: 'cizgi' },   /* üst kenar */
    { n: '7,8,21,22', kenar: 'sol', durum: 'cizgi' },   /* sol kenar (en soldaki sütun) */
    { n: '22-28',     kenar: 'alt', durum: 'cizgi' },   /* alt kenar */
    { n: '14,15',     kenar: 'sag', durum: 'cizgi' }    /* sağ kenar — 1 ve 28 açık kalır */
];

/* '1-6' , '7,8,21,22' , 12 , [1,2] -> [1,2,...] */
function kenarNumaralari(n) {
    if (typeof n === 'number') return [n];
    if (Array.isArray(n)) return n.map(Number);
    const cikti = [];
    String(n).split(',').forEach(par => {
        const t = par.trim();
        if (!t) return;
        const m = t.match(/^(\d+)\s*-\s*(\d+)$/);
        if (!m) { cikti.push(+t); return; }
        const a = Math.min(+m[1], +m[2]), b = Math.max(+m[1], +m[2]);
        for (let i = a; i <= b; i++) cikti.push(i);
    });
    return cikti;
}

function tabloKenarlariUygula() {
    const SUTUN = 7, SATIR = 4;
    const hucre = (r, c) => document.querySelector(`.ht-cell[data-r="${r}"][data-c="${c}"]`);
    const yer = n => {
        const i = n - 1, r = Math.floor(i / SUTUN), s = i % SUTUN;
        return { r: r, c: (r % 2 === 0) ? s : SUTUN - 1 - s };   // yılan dizilim
    };
    TABLO_KENAR.forEach(k => {
        kenarNumaralari(k.n).forEach(n => {
            const p = yer(n);
            let el = null, yon = null;
            if (k.kenar === 'ust')       { el = hucre(p.r, p.c); yon = 'ust'; }
            else if (k.kenar === 'alt')  {
                if (p.r < SATIR - 1) { el = hucre(p.r + 1, p.c); yon = 'ust'; }
                else                 { el = hucre(p.r, p.c);     yon = 'alt'; }
            }
            else if (k.kenar === 'sag')  { el = hucre(p.r, p.c); yon = 'sag'; }
            else if (k.kenar === 'sol')  {
                if (p.c < SUTUN - 1) { el = hucre(p.r, p.c + 1); yon = 'sag'; }
                else                 { el = hucre(p.r, p.c);     yon = 'sol'; }
            }
            if (!el) return;
            String(k.durum).trim().split(/\s+/).forEach(d => {
                if (d) el.classList.add('k-' + yon + '-' + d);
            });
        });
    });
}

/* ============================================================
   DİZİLİŞ MODU — harfleri ailelerine göre topla
   ------------------------------------------------------------
   Tablonun iki ayrı görünümü var:

     ALFABETİK (varsayılan) : labirent. 1'den 28'e yılan gibi
        ilerler, satır aralarında duvar vardır, 1'de giriş
        28'de çıkış oku durur. Sıranın kendisini ezberlemek için.

     DİZİLİ : labirent söner (duvarlar şeffaflaşır, oklar ve
        giriş/çıkış vurgusu kaybolur), kartlar aynı gövdeyi
        (ya da başlıktaki switch "okunuş" tarafındaysa aynı sesi)
        paylaşan harfler yan yana gelecek şekilde yerlerine kayar,
        her ailenin etrafına yuvarlak köşeli bir kuşak çizilir.
        Şekil/ses ayrımını görmek için.

   Kart numarası iki görünümde de kartla birlikte taşınır: dizili
   moddayken "bu harf alfabede kaçıncı" bilgisi kaybolmasın diye.

   PAKETLEME KURALI: hiçbir aile satır sınırında bölünmemeli.
   7 sütunluk bir satır 3+3+1, 3+2+2, 2+2+2+1 gibi kombinasyonlarla
   tam dolduğu için aşağıdaki açgözlü paketleyici 28 harfi 4 satıra
   BOŞ HÜCRE BIRAKMADAN ve hiçbir aileyi kırmadan yerleştirebiliyor.
   Önce büyük aileler yerleşir (stabil azalan sıra), artan yerler
   "benzeri yok" harfleriyle doldurulur; böylece tekil harfler
   doğal olarak alt satırlarda toplanır.
   ============================================================ */

/* Aile kuşaklarının rengi — kart arka planlarının bir ton koyusu. */
const DZ_RENK = {
    yazi: { be:'#7FB3E8', cim:'#84C795', dal:'#DCC46A', ra:'#7CCBC2', sin:'#B995CE',
            sad:'#E39BB6', ta:'#E3B778', ayn:'#C2CE79', fe:'#9BA0DA' },
    ses:  { s:'#EFB16A', z:'#7BC0EE', t:'#A2D882', d:'#C295E8', h:'#EE9195',
            k:'#72CDB8', ayn:'#DFC94A' }
};

/* mod: 'yazi' | 'ses'  ->  [[{idx, grup, boy}, ...] x satir]
   Dönen dizide her satır tam "sutun" uzunluğunda ve her ailenin
   üyeleri ardışıktır. Paketleme tutmazsa null döner (çağıran
   taraf o zaman alfabetik dizilime düşer). */
function aileleriPaketle(mod, sutun, satir) {
    const tablo = (mod === 'ses') ? HARF_SES : HARF_AILE;
    const gruplar = [], yeri = new Map(), tekler = [];
    harfler.forEach((h, idx) => {
        const g = tablo[h.h];
        if (!g) { tekler.push(idx); return; }
        if (!yeri.has(g)) { yeri.set(g, gruplar.length); gruplar.push({ ad: g, uyeler: [] }); }
        gruplar[yeri.get(g)].uyeler.push(idx);
    });
    /* stabil azalan: büyük aileler önce, eşitlerde alfabetik sıra korunur */
    gruplar.forEach((g, i) => g._s = i);
    gruplar.sort((a, b) => (b.uyeler.length - a.uyeler.length) || (a._s - b._s));

    const satirlar = [];
    let g = 0, t = 0;
    for (let r = 0; r < satir; r++) {
        const dizi = [];
        let guvenlik = 0;
        while (dizi.length < sutun && guvenlik++ < 64) {
            const kalan = sutun - dizi.length;
            if (g < gruplar.length && gruplar[g].uyeler.length <= kalan) {
                const gr = gruplar[g++];
                gr.uyeler.forEach(ix => dizi.push({ idx: ix, grup: gr.ad, boy: gr.uyeler.length }));
            } else if (t < tekler.length) {
                dizi.push({ idx: tekler[t++], grup: null, boy: 1 });
            } else break;
        }
        satirlar.push(dizi);
    }
    /* güvenlik: tam dolmadıysa bu paketleme kullanılmaz */
    const toplam = satirlar.reduce((a, s) => a + s.length, 0);
    if (toplam !== harfler.length || satirlar.some(s => s.length !== sutun)) return null;
    return satirlar;
}

/* =====================================================================
   YAZILIŞ ANİMASYONU DÜĞMESİ
   Tablodaki 28 kartın hepsi aynı anda sürekli yazılınca ekran hareketli
   oluyor; bu yüzden ızgara animasyonu artık varsayılan olarak KAPALI.
   Kapalıyken harfler tamamlanmış hâlde durur. Düğmeye basınca tüm kartlar
   baştan, birlikte yazılmaya başlar. Bir harfe tıklayınca açılan büyüteç
   ekranındaki yazılış animasyonu bu düğmeden etkilenmez; orada her zaman
   çalışır.
   ===================================================================== */
const yazimAnim = {
    acik: false,

    cevir: function () {
        if (typeof playClick === 'function') playClick();
        this.acik = !this.acik;
        this.uygula();
    },

    uygula: function () {
        if (typeof harfGrid !== 'undefined') {
            harfGrid.calis = this.acik;
            /* Açılışta sıra baştaki karta alınır ve saat sıfırlanır:
               yazım ilk harften başlasın. Kapanışta ise harflerin tam
               hâline oturması için "oturtuldu" sayacı geçersiz kılınır. */
            harfGrid.t0 = null;
            harfGrid.aktifKart = 0;
            harfGrid.kartT0 = null;
            harfGrid.tazele = true;
            harfGrid.oturanSay = -1;
        }
        this.ikonSenkron();
    },

    ikonSenkron: function () {
        const b = document.getElementById('yaz-btn');
        if (!b) return;
        b.classList.toggle('on', this.acik);
        /* 15.10.2026 — ipucu duruma göre değişiyor, anahtarı da onunla. */
        var animA = this.acik ? 'alf.anim_dur' : 'alf.anim_basla';
        var animT = this.acik ? 'Yazılış animasyonunu durdur'
                              : 'Harflerin yazılış animasyonunu başlat';
        if (window.KidefDil && window.KidefDil.nitelik) {
            window.KidefDil.nitelik(b, 'title', animA, animT);
        } else {
            b.title = animT;
        }
    }
};

const dizilis = {
    acik: false,
    mesgul: false,
    SUTUN: 7,
    SATIR: 4,

    /* Süren bir kaydırma animasyonunu anında bitirir. Böylece kullanıcı
       düğmeye üst üste bassa ya da switch'i çevirir çevirmez dizilişi
       değiştirse tıklama yutulmaz; kartlar bulundukları yere oturur ve
       yeni animasyon temiz bir ölçümle başlar. */
    dur: function () {
        if (this._zmn) { clearTimeout(this._zmn); this._zmn = null; }
        document.querySelectorAll('.harf-tablo .char-card').forEach(k => {
            k.style.removeProperty('transition');
            k.style.removeProperty('transform');
            k.style.removeProperty('z-index');
        });
        this.mesgul = false;
    },

    cevir: function () {
        if (typeof playClick === 'function') playClick();
        this.acik = !this.acik;
        this.uygula(true);
        this.ikonSenkron();
    },

    ikonSenkron: function () {
        const t = document.querySelector('.harf-tablo');
        if (t) t.classList.toggle('dizili', this.acik);
        document.querySelectorAll('.grp-ico--diz').forEach(e => {
            e.classList.toggle('on', this.acik);
            var dizA = this.acik ? 'alf.alfabetik' : 'alf.aile_diz';
            var dizT = this.acik ? 'Alfabetik sıraya (labirente) dön'
                                 : 'Harfleri ailelerine göre diz';
            if (window.KidefDil && window.KidefDil.nitelik) {
                window.KidefDil.nitelik(e, 'title', dizA, dizT);
            } else {
                e.title = dizT;
            }
        });
    },

    /* Kartları hedef hücrelere taşır. anim=true ise FLIP ile kaydırır. */
    uygula: function (anim) {
        this.dur();                                   /* önceki animasyon varsa yerine otursun */
        const tablo = document.querySelector('.harf-tablo');
        if (!tablo) return;
        const kartlar = Array.from(tablo.querySelectorAll('.char-card'));
        if (kartlar.length !== harfler.length) return;

        const hucre = (r, c) => tablo.querySelector(`.ht-cell[data-r="${r}"][data-c="${c}"]`);
        const kartOf = idx => tablo.querySelector(`.char-card[data-idx="${idx}"]`);

        /* hedef: [{kart, td, grup, ilk, son, boy}] */
        const plan = [];
        let paket = null;
        if (this.acik) paket = aileleriPaketle(harfGrup.mod, this.SUTUN, this.SATIR);
        if (this.acik && paket) {
            paket.forEach((dizi, r) => dizi.forEach((oge, c) => {
                const td = hucre(r, c), kart = kartOf(oge.idx);
                if (!td || !kart) return;
                /* aynı gruptaki komşuları bul: dizi içinde ardışıklar */
                const oncekiAyni = c > 0 && oge.grup && dizi[c - 1].grup === oge.grup;
                const sonrakiAyni = c < dizi.length - 1 && oge.grup && dizi[c + 1].grup === oge.grup;
                plan.push({
                    kart, td, grup: oge.grup, boy: oge.boy,
                    ilk: !!oge.grup && !oncekiAyni,      /* kuşağın sağ ucu (rtl: başlangıç) */
                    son: !!oge.grup && !sonrakiAyni      /* kuşağın sol ucu */
                });
            }));
        } else {
            /* alfabetik / labirent: yılan dizilim */
            for (let r = 0; r < this.SATIR; r++) {
                for (let c = 0; c < this.SUTUN; c++) {
                    const n = (r % 2 === 0) ? r * this.SUTUN + c + 1 : r * this.SUTUN + (this.SUTUN - c);
                    const td = hucre(r, c), kart = kartOf(n - 1);
                    if (td && kart) plan.push({ kart, td, grup: null, boy: 1, ilk: false, son: false });
                }
            }
        }
        if (plan.length !== harfler.length) return;

        /* 1) eski konumları ölç */
        const eski = anim ? new Map(kartlar.map(k => [k, k.getBoundingClientRect()])) : null;

        /* 2) kuşak sınıflarını yenile + kartları hedeflerine taşı */
        tablo.querySelectorAll('.ht-cell').forEach(td => {
            td.classList.remove('dz-g', 'dz-bas', 'dz-son');
            td.style.removeProperty('--dz-renk');
        });
        kartlar.forEach(k => k.remove());
        const renkler = DZ_RENK[harfGrup.mod === 'ses' ? 'ses' : 'yazi'] || {};
        plan.forEach(p => {
            p.td.appendChild(p.kart);
            if (this.acik && p.grup && p.boy > 1) {
                p.td.classList.add('dz-g');
                if (p.ilk) p.td.classList.add('dz-bas');
                if (p.son) p.td.classList.add('dz-son');
                if (renkler[p.grup]) p.td.style.setProperty('--dz-renk', renkler[p.grup]);
            }
        });

        if (!anim || !eski) return;

        /* 3) yeni konumları ölç, farkı ters uygula, sonra sıfıra animasyonla git */
        this.mesgul = true;
        const isler = [];
        plan.forEach((p, i) => {
            const e = eski.get(p.kart); if (!e) return;
            const y = p.kart.getBoundingClientRect();
            const dx = e.left - y.left, dy = e.top - y.top;
            if (!dx && !dy) return;
            isler.push({ kart: p.kart, dx, dy, gecikme: Math.min(140, i * 5) });
        });
        isler.forEach(o => {
            o.kart.style.transition = 'none';
            o.kart.style.zIndex = '4';
            o.kart.style.transform = `translate(${o.dx}px, ${o.dy}px)`;
        });
        void tablo.offsetWidth;                       /* reflow: başlangıç durumu sabitlensin */
        requestAnimationFrame(() => {
            isler.forEach(o => {
                o.kart.style.transition = `transform .62s cubic-bezier(.22,.85,.26,1) ${o.gecikme}ms`;
                o.kart.style.transform = '';
            });
            this._zmn = setTimeout(() => { this._zmn = null; this.dur(); }, 900);
        });
    }
};

/* ============================================================
   SAĞ PANEL — kendinden sonrakiyle birleşmeyen harfler
   ------------------------------------------------------------
   6 harf (ا د ذ ر ز و), 6 satır 2 sütun:
     sağ sütun  ✓  ـا  -> kendinden ÖNCEKİ harfe bağlanır (harfler[].s = sonda)
     sol sütun  ✗  ا   -> kendinden SONRAKİ harfe bağlanmaz (harfler[].b = başta)
   Liste elle yazılmadı; harfler dizisindeki nobind işaretinden geliyor,
   yani harf verisi değişirse panel kendiliğinden güncellenir.
   ============================================================ */
/* Panel harfi: kartlardaki ile BİREBİR aynı görünmesi için harf, yazı tipi
   yerine arakom hattının kendi dış hattından (HARF_YAZIM[...].fill) statik SVG
   olarak çizilir — kartlarda harfGrid.init() de aynı veriyi kullanıyor.
   Veri yoksa düz metne düşer. Harfin kendisi görünmez bir span'da da durur:
   ekran okuyucu ve testler metni yine bulabilsin. */
let ypTatNo = 0;          /* tatvil kırpma yollarına benzersiz kimlik */

/** Bağlama (tatvil) çizgisini sağa uzatır: glifin sağ kenarından ince bir
 *  dilim alınıp yatayda esnetilir, böylece çizginin kalınlığı birebir aynı
 *  kalır. Ölçüm gerektiği için öge ekrana geldikten SONRA çağrılır. */
function ypTatvilUzat(kok) {
    (kok || document).querySelectorAll('.yp-svg g.yp-uzat').forEach(function (g) {
        if (g.dataset.ok) return;
        const svg = g.closest('.yp-svg');
        const taban = svg && svg.querySelector('path:not(.yp-tatvil)');
        const dilim = svg && svg.querySelector('rect.yp-dilim');
        if (!taban || !dilim) return;
        let bb;
        try { bb = taban.getBBox(); } catch (e) { return; }
        if (!bb || !bb.width) return;                 /* henüz görünmüyor */
        const sag = bb.x + bb.width;                  /* mürekkebin sağ ucu */
        const dil = Math.max(3, bb.width * 0.045);
        const uz = (svg.viewBox.baseVal.height || 730) * 0.13;
        const k = (dil + uz) / dil;
        dilim.setAttribute('x', (sag - dil).toFixed(2));
        dilim.setAttribute('width', dil.toFixed(2));
        g.setAttribute('transform', 'translate(' + (sag - dil).toFixed(2) + ',0) scale('
            + k.toFixed(3) + ',1) translate(' + (-(sag - dil)).toFixed(2) + ',0)');
        g.dataset.ok = '1';
    });
}
function ypHarf(i, form) {
    const g = (form === 's') ? i.s : i.b;
    const yaz = (typeof HARF_YAZIM !== 'undefined') ? HARF_YAZIM[i.h] : null;
    const d = yaz && yaz[form];
    if (!d || !d.fill) return `<span class="yp-harf">${g}</span>`;
    const H = 100, W = Math.round(d.vb[2] / d.vb[3] * H);
    /* TATVİL AYRI RENKTE (Geylani, 11.10.2026: "kendinden öncekiyle birleşir
       kısmında tatvil çizgilerini renkli yap ki anlaşılsın").
       Bitişik (sonda) yazılış, yalın yazılıştan ne kadar GENİŞSE sağdaki o
       kadarlık dilim bağlama çizgisidir (ör. ـد 317-222 = 95 birim). Aynı
       yol ikinci kez, bu dilime kırpılarak, vurgu renginde çiziliyor. */
    let tat = '';
    const yal = yaz && yaz.n;
    if (form === 's' && yal && yal.vb) {
        const t = d.vb[2] - yal.vb[2];
        if (t > 2) {
            const sag = d.vb[0] + d.vb[2];          /* viewBox'ın sağ kenarı */
            const no = ++ypTatNo;
            /* <g class="yp-uzat">: bağlama çizgisini sağa uzatır. Dilimin yeri
               ve esnetme oranı, glifin GERÇEK mürekkep sınırı ölçülerek
               ypTatvilUzat() içinde veriliyor — viewBox'ın sağında boşluk var,
               oraya göre hesaplayınca uzatma görünmüyordu. */
            tat = `<defs><clipPath id="ypt${no}">`
                + `<rect x="${sag - t}" y="${d.vb[1]}" width="${t}" height="${d.vb[3]}"></rect>`
                + `</clipPath><clipPath id="ypd${no}">`
                + `<rect class="yp-dilim" x="${sag}" y="${d.vb[1]}" width="1" height="${d.vb[3]}"></rect>`
                + `</clipPath></defs>`
                + `<g class="yp-uzat">`
                + `<path class="yp-tatvil" d="${d.fill}" clip-path="url(#ypd${no})"></path></g>`
                + `<path class="yp-tatvil" d="${d.fill}" clip-path="url(#ypt${no})"></path>`;
        }
    }
    return `<span class="yp-harf yp-harf-svg"><svg class="yp-svg" viewBox="${d.vb.join(' ')}"`
        + ` width="${W}" height="${H}" aria-hidden="true"><path d="${d.fill}"></path>${tat}</svg>`
        + `<span class="yp-gizli">${g}</span></span>`;
}

/* ✓ ve ✗ artık yazı değil SVG. İkisi de ok animasyonu bittikten sonra belirir
   (zamanlama CSS'te: ok döngüsü 3.4s, işaretler %47'ye kadar görünmez).
     TİK   -> tek yol, soldan sağa çizilir; aynı anda aşağıdan yukarı süzülür.
     ÇARPI -> iki kol sırayla çizilir, o kadar. Önceden burada bir sarsıntı ve
              çatlama efekti vardı; gözü yorduğu için kaldırıldı, işaret artık
              sakin biçimde belirip duruyor. */
const IM_TIK = '<svg class="yp-im yp-im-ok" viewBox="0 0 34 34" role="img"'
    + ' aria-label="öncesine bağlanır" data-i18n-aria="alf.oncesine_baglanir"><path class="yi-tik" d="M6 18.5L13.5 26L28 8"></path></svg>';
const IM_CARPI = '<svg class="yp-im yp-im-no" viewBox="0 0 34 34" role="img"'
    + ' aria-label="sonrasına bağlanmaz" data-i18n-aria="alf.sonrasina_baglanmaz">'
    + '<g class="yi-x">'
    + '<path class="yi-x1" d="M8.5 8.5L25.5 25.5"></path>'
    + '<path class="yi-x2" d="M25.5 8.5L8.5 25.5"></path></g>'
    + '</svg>';

function yanPaneliKur() {
    const yan = document.getElementById('g1yan');
    if (!yan) return;
    /* Başlıkta her kelimenin ilk harfi büyük */
    let s = '<div class="yp-baslik" data-i18n="alf.birlesmeyen">Kendinden Sonrakiyle Birleşmeyen Harfler</div>';
    s += '<div class="yp-tablo">';
    /* Başlık satırı: sağ sütun = önceki harfe bağlanır (✓), sol sütun = sonraki
       harfe bağlanmaz (✗). İşaretin altındaki özel SVG ok, alttaki harften
       (elif) yukarı doğru kalkıp işarete dönüyor: sağ sütunda sağa, sol sütunda
       sola kıvrılır. Ok, işaret ile harf arasındaki boşluğu doldurur. */
    const okSag = '<svg class="yp-yon" viewBox="0 0 46 42" aria-hidden="true">'
        + '<path class="yp-ok-govde" d="M15 39C15 23 17 10 32 10"></path>'
        + '<path class="yp-ok-uc" d="M26 4.5L33 10L26 15.5"></path></svg>';
    const okSol = '<svg class="yp-yon" viewBox="0 0 46 42" aria-hidden="true">'
        + '<path class="yp-ok-govde" d="M31 39C31 23 29 10 14 10"></path>'
        + '<path class="yp-ok-uc" d="M20 4.5L13 10L20 15.5"></path></svg>';
    s += '<div class="yp-th yp-ok">' + IM_TIK + okSag + '</div>';
    s += '<div class="yp-th yp-no">' + IM_CARPI + okSol + '</div>';
    harfler.filter(i => i.nobind).forEach(i => {
        s += `<div class="yp-hucre yp-c-ok" title="${i.tr}: öncesine bağlanır" data-i18n-title="alf.harf_oncesine" data-i18n-title-tr="{harf}: öncesine bağlanır" data-i18n-yer='{"harf":"${i.tr}"}'>${ypHarf(i, 's')}</div>`;
        s += `<div class="yp-hucre yp-c-no" title="${i.tr}: sonrasına bağlanmaz" data-i18n-title="alf.harf_sonrasina" data-i18n-title-tr="{harf}: sonrasına bağlanmaz" data-i18n-yer='{"harf":"${i.tr}"}'>${ypHarf(i, 'b')}</div>`;
    });
    s += '</div>';
    yan.innerHTML = s;
    requestAnimationFrame(function () { ypTatvilUzat(yan); });
    /* Panele dokunmak BÜYÜK KATMANI açar (11.10.2026, Geylani: "sağdaki
       yere basınca merkeze gelsin ve daha büyük olsun"). */
    yan.classList.add('yp-tikla');
    if (window.KidefDil && window.KidefDil.nitelik) {
        window.KidefDil.nitelik(yan, 'title', 'alf.buyut', 'Büyütmek için dokun');
    } else {
        yan.setAttribute('title', 'Büyütmek için dokun');
    }
    yan.onclick = function () {
        if (typeof playClick === 'function') playClick();
        ypKatmanAc();
    };
}

/* ====================================================================
   BİRLEŞMEYEN HARFLER — BÜYÜK KATMAN (11.10.2026)
   Yan paneldeki tablo, tahtadan görünsün diye ekranın ortasında büyük
   bir katmanda açılır: arkası gri ve bulanık, başlık tek satır, harfler
   iri. Soldaki sütunda seçili harfin ÜÇ örneği durur (harf kelimenin
   başında, ortasında, sonunda nasıl görünüyor) — çocuk harfin bütün
   hâllerini bir arada görsün. Örnek verisi: alfabe_harf_ornek.js
   ==================================================================== */
/* Harfin taban çizgisi, arakom tasarım ızgarasında y = 410 (viewBox 730).
   Oran yerine BİRİM kullanılıyor: her harfin viewBox'ı ayrı olabilir, oranla
   hesaplayınca kayıyordu. Örnek kelimeler de ölçülen gerçek yazı tabanıyla
   (görünmez bir ölçü imi ile) tam bu çizgiye oturtulur — eskiden kaba bir
   katsayı kullanılıyordu ve kelimeler harflerden ~11px yukarıda kalıyordu
   (Geylani, 11.10.2026: "örnekler ve harfler aynı satırda olsun"). */
const YP_TABAN_BIRIM = 410;
let ypUcusKaynak = null;   /* yan paneldeki harflerin açılış öncesi yerleri */

/** Katman açılmadan ÖNCE yan paneldeki harflerin ekran konumları. */
function ypKaynakOlc() {
    const yan = document.getElementById('g1yan');
    if (!yan) return null;
    const l = [...yan.querySelectorAll('.yp-hucre')].map(function (h) {
        const e = h.querySelector('.yp-svg') || h.querySelector('.yp-harf');
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return r.height ? r : null;
    });
    return l.some(Boolean) ? l : null;
}

/** FLIP: harfler yan paneldeki yerlerinden katmandaki yerlerine uçar. */
function ypUcusOynat(ov) {
    const kay = ypUcusKaynak;
    const hed = [...document.querySelectorAll('#yp-govde .yp-hucre')];
    if (!kay || kay.length !== hed.length) { ov.classList.remove('yp-ucus'); return; }
    const ilk = hed.map(function (h, i) {
        const k = kay[i]; if (!k) return null;
        const e = h.querySelector('.yp-svg') || h.querySelector('.yp-harf');
        const y = e.getBoundingClientRect();
        if (!y.height) return null;
        return { dx: (k.left + k.width / 2) - (y.left + y.width / 2),
                 dy: (k.top + k.height / 2) - (y.top + y.height / 2),
                 sc: Math.max(0.15, k.height / y.height) };
    });
    hed.forEach(function (h, i) {
        const f = ilk[i]; if (!f) return;
        h.style.transition = 'none';
        h.style.transform = 'translate(' + f.dx + 'px,' + f.dy + 'px) scale(' + f.sc + ')';
        h.style.opacity = '.45';
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
        hed.forEach(function (h, i) {
            if (!ilk[i]) return;
            h.style.transition = 'transform .58s cubic-bezier(.2,.86,.26,1) '
                + (Math.floor(i / 2) * 0.04).toFixed(2) + 's, opacity .36s ease';
            h.style.transform = '';
            h.style.opacity = '';
        });
    }); });
    clearTimeout(ypUcusOynat.z);
    ypUcusOynat.z = setTimeout(function () {
        hed.forEach(function (h) { h.style.transition = ''; h.style.transform = ''; h.style.opacity = ''; });
        ov.classList.remove('yp-ucus');
    }, 1150);
}

const YP_BICIM_AD = { b: 'Başta', o: 'Ortada', s: 'Sonda', n: 'Yalın' };
const YP_YER_AD = { ilk: 'kelimenin başında', orta: 'kelimenin ortasında', son: 'kelimenin sonunda' };

function ypKatmanKur() {
    if (document.getElementById('yp-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'yp-overlay';
    /* Kapat düğmesi KARTIN DIŞINDA: kart %80 genişlikte olduğu için sağda
       boşluk var; içeride kalsa ✓ sütununun şeridiyle çakışıyordu. */
    ov.innerHTML = '<button id="yp-close" title="Kapat" aria-label="Kapat">&times;</button>'
        + '<div id="yp-card" role="dialog" aria-modal="true">'
        + '<div id="yp-ust"></div>'
        + '<div id="yp-kel" data-i18n="alf.kelimelerde">Kelimelerde</div>'
        + '<div id="yp-govde"></div>'
        + '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) { if (e.target === ov) ypKatmanKapat(); });
    document.getElementById('yp-close').onclick = ypKatmanKapat;
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') ypKatmanKapat();
    });
    window.addEventListener('resize', function () {
        if (document.getElementById('yp-overlay').style.display === 'flex') {
            ypBaslikSigdir(); ypCizgiHizala(); ypBantYerlestir(); ypTatvilUzat(document);
        }
    });
}

function ypKatmanAc() {
    ypUcusKaynak = ypKaynakOlc();   /* katman açılmadan ölç */
    ypKatmanKur();
    const ov = document.getElementById('yp-overlay');
    document.getElementById('yp-ust').textContent = 'Kendinden Sonrakiyle Birleşmeyen Harfler';
    const okSag = '<svg class="yp-yon" viewBox="0 0 46 42" aria-hidden="true">'
        + '<path class="yp-ok-govde" d="M15 39C15 23 17 10 32 10"></path>'
        + '<path class="yp-ok-uc" d="M26 4.5L33 10L26 15.5"></path></svg>';
    const okSol = '<svg class="yp-yon" viewBox="0 0 46 42" aria-hidden="true">'
        + '<path class="yp-ok-govde" d="M31 39C31 23 29 10 14 10"></path>'
        + '<path class="yp-ok-uc" d="M20 4.5L13 10L20 15.5"></path></svg>';
    /* HER HARF KENDİ SATIRINDA: sağda iki yazılışı, solda ÜÇ örneği
       (Geylani: "6 harfin örneği de aynı satırda olsun"). */
    let s = '<div class="yp-sira">';
    s += '<div class="yp-bant yp-bant-ok"></div><div class="yp-bant yp-bant-no"></div>'
       + '<div class="yp-bant yp-bant-or-b"></div><div class="yp-bant yp-bant-or-o"></div>'
       + '<div class="yp-bant yp-bant-or-s"></div><div class="yp-bant yp-bant-or-n"></div>';
    s += '<div class="yp-th yp-ok">' + IM_TIK + okSag
       + '<span class="yp-th-ad" data-i18n="alf.onceki_birlesir">kendinden ÖNCEKİYLE birleşir</span></div>';
    s += '<div class="yp-th yp-no">' + IM_CARPI + okSol
       + '<span class="yp-th-ad" data-i18n="alf.sonraki_birlesmez">kendinden SONRAKİYLE birleşmez</span></div>';
    /* "Kelimelerde" artık ızgaranın üstünde değil, solda dikey duruyor
       (#yp-kel). Bu hücrede örnek sütunlarının başlıkları var: sağdan sola
       Başta · Ortada · Sonda · Yalın (Geylani, 11.10.2026). */
    /* Rozet rengi biçimi anlatır: bu harfler BAŞTA ve YALIN iken yalın
       yazılır (kırmızı = sonrakiyle birleşmez), ORTADA ve SONDA iken
       öncekine bitişir (yeşil). Geylani, 11.10.2026. */
    const etIm = {
        ok: '<svg class="yp-et-im" viewBox="0 0 24 24" aria-hidden="true">'
          + '<path d="M4.5 12.9 L9.4 17.8 L19.5 6.6"></path></svg>',
        no: '<svg class="yp-et-im" viewBox="0 0 24 24" aria-hidden="true">'
          + '<path d="M6.4 6.4 L17.6 17.6 M17.6 6.4 L6.4 17.6"></path></svg>'
    };
    s += '<div class="yp-or-satir yp-or-bas">'
       + [['Başta', 'no'], ['Ortada', 'ok'], ['Sonda', 'ok'], ['Yalın', 'no']].map(function (t) {
             return '<div class="yp-or-kart"><span class="yp-or-et yp-et-' + t[1] + '">'
                  + etIm[t[1]] + '<span>' + t[0] + '</span></span></div>';
         }).join('')
       + '</div>';
    harfler.filter(i => i.nobind).forEach((i, gi) => {
        s += '<div class="yp-hucre yp-c-ok" style="--g:' + gi + '" title="' + i.tr + ': öncesine bağlanır" data-i18n-title="alf.harf_oncesine" data-i18n-title-tr="{harf}: öncesine bağlanır" data-i18n-yer=\'{"harf":"' + i.tr + '"}\'>' + ypHarf(i, 's') + '</div>';
        s += '<div class="yp-hucre yp-c-no" style="--g:' + gi + '" title="' + i.tr + ': sonrasına bağlanmaz" data-i18n-title="alf.harf_sonrasina" data-i18n-title-tr="{harf}: sonrasına bağlanmaz" data-i18n-yer=\'{"harf":"' + i.tr + '"}\'>' + ypHarf(i, 'b') + '</div>';
        const liste = (typeof HARF_ORNEKLER !== 'undefined' && HARF_ORNEKLER[i.h]) ? HARF_ORNEKLER[i.h] : [];
        s += '<div class="yp-or-satir" style="--g:' + gi + '">' + (liste.length
            ? liste.map(function (o) {
                /* Türkçesi yazılmıyor (Geylani): tahtada harfin kelimedeki
                   hâli konuşulacak, anlam değil. Karşılık ipucunda duruyor. */
                return '<div class="yp-or-kart" title="' + (o.tr || '') + '">'
                    + '<span class="yp-or-ar" dir="rtl">' + o.on + '<b>' + o.vu + '</b>' + o.son + '</span></div>';
              }).join('')
            : '<div class="yp-or-kart"><span class="yp-or-yok">—</span></div>')
          + '</div>';
    });
    s += '</div>';
    const govde = document.getElementById('yp-govde');
    govde.innerHTML = s;
    govde.classList.remove('yp-giris');
    ov.style.display = 'flex';
    ov.classList.toggle('yp-ucus', !!ypUcusKaynak);
    requestAnimationFrame(function () {
        ov.classList.add('yp-open');
        ypBaslikSigdir();
        ypCizgiHizala();                 /* ÖLÇÜM: animasyon başlamadan */
        ypBantYerlestir();
        ypTatvilUzat(document);
        govde.classList.add('yp-giris'); /* örnekler sırayla süzülerek gelir */
        ypUcusOynat(ov);
    });
}

/* Her satırda TEK çizgi: çizgi harfin taban çizgisinden geçer, örnek
   kelimeler de o çizgiye oturacak kadar kaydırılır. Ölçerek yapılır,
   çünkü harf SVG'si ile yazı kutusunun taban çizgisi farklı yerlerde. */
/** ✓/✗ sütunlarının arkasındaki yumuşak şeridi sütun genişliğine oturtur. */
function ypBantYerlestir() {
    const sira = document.querySelector('#yp-govde .yp-sira');
    if (!sira) return;
    const sr = sira.getBoundingClientRect();
    const pd = Math.max(8, Math.round(sr.height * 0.018));
    const satirlar = [...sira.querySelectorAll('.yp-or-satir:not(.yp-or-bas)')];
    const basSatir = sira.querySelector('.yp-or-bas');
    const okHucre = [...sira.querySelectorAll('.yp-c-ok')];
    const thOk = sira.querySelector('.yp-th.yp-ok');
    if (!satirlar.length || !okHucre.length) return;
    /* Bütün şeritler AYNI üst ve alt hizada olsun. */
    const ust = Math.min(thOk ? thOk.getBoundingClientRect().top : Infinity,
                         basSatir ? basSatir.getBoundingClientRect().top : Infinity,
                         okHucre[0].getBoundingClientRect().top);
    const alt = Math.max(okHucre[okHucre.length - 1].getBoundingClientRect().bottom,
                         satirlar[satirlar.length - 1].getBoundingClientRect().bottom);
    function yerlestir(bant, l, r, yanPay) {
        if (!bant) return;
        /* Şerit gövdenin dışına taşmasın: kenarda kırpılmış görünüyordu. */
        const sl = Math.max(l - yanPay, sr.left);
        const sg = Math.min(r + yanPay, sr.right);
        bant.style.left = (sl - sr.left) + 'px';
        bant.style.width = (sg - sl) + 'px';
        bant.style.top = Math.max(0, ust - sr.top - pd) + 'px';
        bant.style.height = (alt - ust + pd * 2) + 'px';
    }
    /* ✓ / ✗ harf sütunları */
    [['ok', '.yp-c-ok'], ['no', '.yp-c-no']].forEach(function (c) {
        const hep = [...sira.querySelectorAll(c[1])];
        const bas = sira.querySelector('.yp-th.yp-' + c[0]);
        if (!hep.length) return;
        let l = Infinity, r = -Infinity;
        hep.concat(bas ? [bas] : []).forEach(function (h) {
            const q = h.getBoundingClientRect();
            l = Math.min(l, q.left); r = Math.max(r, q.right);
        });
        yerlestir(sira.querySelector('.yp-bant-' + c[0]), l, r, pd);
    });
    /* Örnek sütunları: Başta · Ortada · Sonda · Yalın (sağdan sola) */
    const kutular = satirlar[0].querySelectorAll('.yp-or-kart');
    if (kutular.length >= 4) {
        const a = kutular[0].getBoundingClientRect();
        const b = kutular[1].getBoundingClientRect();
        const bosluk = Math.max(0, a.left - b.right);        /* rtl: 0 sağda */
        const yan = Math.max(2, bosluk / 2 - 1);
        ['b', 'o', 's', 'n'].forEach(function (k, j) {
            const q = kutular[j].getBoundingClientRect();
            yerlestir(sira.querySelector('.yp-bant-or-' + k), q.left, q.right, yan);
        });
    }
}

function ypCizgiHizala() {
    const satirlar = document.querySelectorAll('#yp-govde .yp-or-satir:not(.yp-or-bas)');
    const harfler = document.querySelectorAll('#yp-govde .yp-c-ok');
    for (let i = 0; i < satirlar.length; i++) {
        /* Taban çizgisi SVG'nin KENDİ yüksekliğinden hesaplanır (sarmalayıcı
           .yp-harf-svg esnek kutu olduğu için birkaç piksel daha yüksekti ve
           çizgi harfin tabanının altına düşüyordu). */
        const svg = harfler[i] ? harfler[i].querySelector('.yp-svg') : null;
        if (!svg) continue;
        const sr = svg.getBoundingClientRect();
        const vb = svg.viewBox && svg.viewBox.baseVal;
        const olc = (vb && vb.height) ? sr.height / vb.height : 0;
        const hedef = olc ? sr.top + (YP_TABAN_BIRIM - vb.y) * olc
                          : sr.bottom - sr.height * 0.4384;   /* harfin taban çizgisi */
        const satir = satirlar[i];
        const yr = satir.getBoundingClientRect();
        satir.style.setProperty('--yp-cizgi', (yr.bottom - hedef) + 'px');
        satir.querySelectorAll('.yp-or-ar').forEach(function (k) {
            k.style.transform = '';
            /* Kelimenin GERÇEK yazı tabanı: sıfır boyutlu, taban çizgisine
               hizalanan bir ölçü imi ekleyip altını okuyoruz. */
            const im = document.createElement('span');
            im.className = 'yp-olc';
            k.appendChild(im);
            const taban = im.getBoundingClientRect().bottom;
            im.remove();
            k.style.transform = 'translateY(' + (hedef - taban) + 'px)';
        });
    }
}

function ypKatmanKapat() {
    const ov = document.getElementById('yp-overlay');
    if (!ov) return;
    ov.classList.remove('yp-open', 'yp-ucus');
    const g = document.getElementById('yp-govde');
    if (g) g.classList.remove('yp-giris');
    setTimeout(function () { ov.style.display = 'none'; }, 180);
}

/* Başlık TEK SATIR: 5 rem'den başlar, sığana kadar küçülür. */
function ypBaslikSigdir() {
    const el = document.getElementById('yp-ust');
    if (!el) return;
    /* Başlık DİKEY: en solda, aşağıdan yukarıya (Geylani, 11.10.2026).
       Tek satırda kalsın diye artık GENİŞLİĞE değil YÜKSEKLİĞE sığdırılır. */
    let px = 48;                      /* 3 rem */
    el.style.fontSize = px + 'px';
    let n = 0;
    while (el.scrollHeight > el.clientHeight + 1 && px > 16 && n++ < 60) {
        px -= 2;
        el.style.fontSize = px + 'px';
    }
}

/* ============================================================
   ALT ŞERİT — sağdan sola sıralanır (şerit direction: rtl)
     1) harekeler   2) cezim - şedde   3) uzatma harfleri   4) tâ-i merbûta
   Kutuları/ögeleri buradan ekleyip çıkarabilirsin, sıra dizideki sıradır.
   ============================================================ */
/* Alt şerit: HARF/ÖRNEK YOK — işaretler harfsiz gösterilir.
   Hareke/tenvin/cezim/şedde, harf yerine uzatma çizgisi (tatvil, ـ) üzerinde
   duruyor: 'ــــ' + işaret. Çizgi hepsinde aynı uzunlukta,
   böylece işaretin çizginin üstünde mi altında mı olduğu net görünür.
   Her kutuda ögeler TEK SATIRDA, sağdan sola dizilir; Türkçe adları ekranda
   yazılmaz, fare ile üzerine gelince ipucu (title) olarak görünür.
   genis: true -> kutu daha geniş olsun (üç ögeli hareke / tenvin kutuları)
   kls  -> kutunun tamamına verilen renk sınıfı (ör. tâ-i merbûta pembe)
   Öge kls -> tek ögeye verilen renk sınıfı (ör. elif ve vav kırmızı) */
const CIZ = 'ــــ';      /* dört tatvil: tek parça uzatma çizgisi */
/* Tenvin yalnız KELİME SONUNA gelir: işaretli çizginin sağında (yani kelimenin
   devamı yönünde) aralıklı çizgi durur — "öncesi kelimenin geri kalanı" demek. */
const KESIK = 'ـ ـ';
const ALT_KUTULAR = [
    { ad: 'Harekeler', genis: true, ogeler: [
        { g: CIZ + 'َ', ad: 'üstün' }, { g: CIZ + 'ِ', ad: 'esre' }, { g: CIZ + 'ُ', ad: 'ötre' } ] },
    { ad: 'Tenvin', genis: true, kesik: true, kls: 'as-tenvin', ogeler: [
        { g: CIZ + 'ً', ad: 'iki üstün — yalnız kelime sonunda' },
        { g: CIZ + 'ٍ', ad: 'iki esre — yalnız kelime sonunda' },
        { g: CIZ + 'ٌ', ad: 'iki ötre — yalnız kelime sonunda' } ] },
    { ad: 'Cezim – Şedde',   ogeler: [ { g: CIZ + 'ْ', ad: 'cezim' }, { g: CIZ + 'ّ', ad: 'şedde' } ] },
    { ad: 'Uzatma harfleri', ogeler: [
        { g: 'ا', ad: 'elif', kls: 'as-kirmizi' }, { g: 'و', ad: 'vav', kls: 'as-kirmizi' },
        { g: 'ي', ad: 'ye' } ] },
    { ad: 'Tâ-i Merbûta', kls: 'as-pembe', ogeler: [ { g: 'ـة', ad: 'sonda' }, { g: 'ة', ad: 'yalın' } ] }
];

function altSeridiKur() {
    const alt = document.getElementById('g1alt');
    if (!alt) return;
    alt.innerHTML = ALT_KUTULAR.map(k =>
        /* KONU PENCERESİ (14.10.2026, Geylani): anlatımı olan kutu tıklanabilir;
           metinler okumayazma/alfabe_konu_veri.js, pencere alfabe_konu.js. */
        `<div class="as-kutu${k.genis ? ' as-genis' : ''}${k.kls ? ' ' + k.kls : ''}`
        + `${(typeof KONU_ANLATIM !== 'undefined' && KONU_ANLATIM[k.ad]) ? ' as-tiklanir' : ''}"`
        + `${(typeof KONU_ANLATIM !== 'undefined' && KONU_ANLATIM[k.ad])
             ? ` data-konu="${k.ad}" role="button" tabindex="0" title="${k.ad} — ${kdMetin('alf.konu_ac', 'konu anlatımını aç')}"` : ''}>`
        + `<div class="as-baslik">${k.ad}</div>`
        + `<div class="as-liste">`
        + k.ogeler.map(o => `<div class="as-oge${k.kesik ? ' as-oge-kesik' : ''}${o.kls ? ' ' + o.kls : ''}" title="${o.ad}">`
            + (k.kesik ? `<span class="as-kesik" aria-hidden="true">${KESIK}</span>` : '')
            + `<span class="as-harf">${o.g}</span></div>`).join('')
        + '</div></div>'
    ).join('');
    try { if (window.KidefKonu) KidefKonu.bagla(); } catch (e) { }
}

/* ============================================================
   GİRİŞ / ÇIKIŞ İŞARETİ — yazı yerine animasyonlu ok SVG'si.
   Giriş: ok kapıdan içeri girer (yeşil).  Çıkış: ok kapıdan dışarı çıkar (kırmızı).
   Kart üstünde eski yazı etiketinin durduğu yerde (sağ üst) durur.
   ============================================================ */
/* Giriş oku SOLA bakar: alfabe sırası sağ üst köşeden (elif) başlayıp sola
   doğru ilerliyor, yani giriş yönü sol. Kapı da bu yüzden solda. */
const MZ_OK_GIRIS = '<svg class="mz-ok mz-ok-giris" viewBox="0 0 34 34" aria-hidden="true">'
    + '<path class="mz-kapi" d="M12 5H5V29H12"></path>'
    + '<path class="mz-govde" d="M30 17H14"></path>'
    + '<path class="mz-uc" d="M19 11.5L13.5 17L19 22.5"></path></svg>';
const MZ_OK_CIKIS = '<svg class="mz-ok mz-ok-cikis" viewBox="0 0 34 34" aria-hidden="true">'
    + '<path class="mz-kapi" d="M12 5H5V29H12"></path>'
    + '<path class="mz-govde" d="M14 17H30"></path>'
    + '<path class="mz-uc" d="M25 11.5L30.5 17L25 22.5"></path></svg>';

/* =====================================================================
   GOOGLE ANALYTICS — SEKME ZİYARETİ  (29.09.2026, öğretmen isteği)
   "Harf Tanıtımı, Harf Birleştirme, Okuma ve Dinle-Yaz'a kaç kişi
    girmiş görmek istiyorum."
   Her sekmenin AYRI BİR ETKİNLİK ADI var; GA4 → Etkinlikler raporunda
   kendiliğinden satır oluyorlar, özel boyut tanımlamak gerekmiyor.
   Sayfa görüntüleme sayısına dokunulmuyor (page_view gönderilmiyor),
   yani alfabe.html'in kendi sayımı şişmiyor.
   gtag yoksa (yerelde, çevrimdışı, reklam engelleyicide) sessizce geçer.
   ===================================================================== */
const GA_SEKME = {
    p1: { ad: 'alfabe_harf_tanitimi',    yazi: 'Harf Tanıtımı' },
    p5: { ad: 'alfabe_harf_birlestirme', yazi: 'Harf Birleştirme' },
    p8: { ad: 'alfabe_okuma',            yazi: 'Okuma' },
    p7: { ad: 'alfabe_dinle_yaz',        yazi: 'Dinle ve Yaz' }
};
let gaSonSekme = '';
function gaSekme(id) {
    const s = GA_SEKME[id];
    if (!s || gaSonSekme === id) return;   /* aynı sekmeye tekrar basmak sayılmaz */
    gaSonSekme = id;
    try {
        if (typeof gtag === 'function') {
            gtag('event', s.ad, { sekme: s.yazi, sayfa: 'alfabe' });
        }
    } catch (e) { }
}

const ui = {
    tab: (e, id) => {
        if (e) e.preventDefault(); 
        playClick(); 
        /* AÇIK SEKMEYE TEKRAR BASMAK ŞERİDİ KATLAR: öğretmen zaten
           bulunduğu sekmenin başlığına basınca "tamam, ekranı bana bırak"
           demiş oluyor. Karar tıklamadan ÖNCE alınır, çünkü aşağıda
           active sınıfları yeniden dağıtılıyor. */
        const ayniSekme = !!(e && e.currentTarget &&
                             e.currentTarget.classList &&
                             e.currentTarget.classList.contains('active'));

        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
        
        const target = document.getElementById(id);
        if(target) target.classList.add('active');
        
        if(e && e.currentTarget) e.currentTarget.classList.add('active');
        /* ODAKTAN KENDİLİĞİNDEN ÇIKIŞ: şerit artık odak modunda da açık
           durduğu için sekmeye dokunmak tek başına yetmeli — önce tam
           ekrandan çık, sonra o etkinliği göster. Harf Tanıtımı'nın
           kendisine dokunmak da odağı kapatır: öğretmen "bu sekmeye
           dön" derken zaten normal görünümü kastediyor. */
        if (typeof tamEkran !== 'undefined' && tamEkran.acik) tamEkran.kapat();
        /* Hafıza sekmesi her açıldığında İKİ KİŞİLİK gelir. */
        if (id === 'p3' && typeof memoryGame !== 'undefined') memoryGame.ikiKisilik();
        const gs = document.getElementById('p1-switch');
        if (gs) gs.classList.toggle('gizli', id !== 'p1');
        /* Switch gizliyken mobilde sağdaki rezerv boşluk da kalksın */
        const nv = document.querySelector('.nav-tabs');
        if (nv) nv.classList.toggle('sw-yok', id !== 'p1');
        /* Başka bir sekmeye geçmek şeridi KAPATMAZ (art arda gezilebilsin);
           yalnız kumandadaki aktif sekme adı tazelenir. Ama AYNI sekmeye
           tekrar basıldıysa şerit katlanır. */
        if (ayniSekme && typeof navKapat === 'function') { try { navKapat(); } catch (h) { } }
        else if (typeof navAdYaz === 'function') { try { navAdYaz(); } catch (h) { } }
        gaSekme(id);                       /* ziyaret GA4'e bildirilsin */
    },
    init: () => {
        const g1 = document.getElementById('g1');
        g1.innerHTML = "";
        /* --- HARF TABLOSU: 7 sütun x 4 satır, Word tablosu gibi ---
           Her harf kendi kutusunda, her kutu bir tablo hücresinin içinde.
           Dizilim sağdan başlar ve yılan gibi devam eder:
             1. satır  sağdan sola : 1 ... 7
             2. satır  soldan sağa : 8 ... 14   (8 → 7'nin altında)
             3. satır  sağdan sola : 15 ... 21  (15 → 14'ün altında)
             4. satır  soldan sağa : 22 ... 28  (22 → 21'in altında, ye sağ altta)
           Giriş elif (1), çıkış ye (28). */
        const HT_SATIR = 4, HT_SUTUN = 7;
        let html = '<table class="harf-tablo mod-yazi"><tbody>';
        for (let r = 0; r < HT_SATIR; r++) {
            html += '<tr>';
            for (let c = 0; c < HT_SUTUN; c++) {   // c = 0 -> en sağdaki hücre (tablo rtl)
                const n = (r % 2 === 0) ? r * HT_SUTUN + c + 1 : r * HT_SUTUN + (HT_SUTUN - c);
                const idx = n - 1;
                const i = harfler[idx];
                const nc = i.nobind ? 'nobind' : '';
                const fc = 'fam-' + (HARF_AILE[i.h] || 'tek');
                const sc = 'ses-'  + (HARF_SES[i.h]  || 'tek');
                let mz = '', mzOk = '';
                if (n === 1) { mz = 'maze-start'; mzOk = MZ_OK_GIRIS; }
                if (n === harfler.length) { mz = 'maze-end'; mzOk = MZ_OK_CIKIS; }
                const hucre = 'ht-cell'
                    + (r === HT_SATIR - 1 ? ' ht-son-satir' : '')
                    + (c === HT_SUTUN - 1 ? ' ht-son-sutun' : '');
                /* KARTIN KİMLİĞİ (18.10.2026) — öğretmen: "telefonu kumanda olarak
                   kullandığımda alfabe html de harf tanıtımında ben bazen elif hemze
                   dışında bi harfe bastığımda ilk harf açılıyor". Telefonda tablo
                   4 sütun x 7 satır (alfabe_mobil.js), tahtada 7 x 4; tahta yansıtma
                   (sistem/tahta.js) dokunulan öğeyi en yakın KİMLİKLİ atasından satır/
                   hücre sırasıyla buluyordu — #g1'den gidince telefondaki satır/hücre
                   tahtada başka harfe (ya da hiç olmayan satıra → ilk harfe) düşüyordu.
                   Her kartın kendi kimliği olunca yol kartın içinden başlar: hangi
                   düzende, hangi dizilişte olursa olsun aynı harf açılır. */
                html += `<td class="${hucre}" data-n="${n}" data-r="${r}" data-c="${c}">
                    <div class="char-card ${nc} ${fc} ${sc} ${mz}" id="harfKart${idx}" data-idx="${idx}" data-aile-ad="${AILE_ADI[HARF_AILE[i.h] || 'tek']}" data-ses-ad="${SES_ADI[HARF_SES[i.h] || 'tek']}" onclick="harfDetay.open(${idx})" data-i18n-title="alf.detay" title="Detay için tıkla: mahreç ve yazılış">
                        <span class="card-num">${n}</span>${mzOk}
                        <div class="arabic-seq" style="display: flex; justify-content: center; width: 100%;">
                            <span class="b-green">${i.b}</span>
                            <span class="o-blue">${i.o}</span>
                            <span class="s-purple">${i.s}</span>
                            <span class="n-black">${i.h}</span>
                        </div>
                        <div class="tr-label">${i.tr}</div>
                    </div></td>`;
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        g1.innerHTML = html;
        tabloKenarlariUygula();
        yanPaneliKur();
        altSeridiKur();
        harfGrup.set(harfGrup.mod);
        /* Tablo yeniden çizildiyse dizili görünüm de yeniden kurulsun (animasyonsuz) */
        if (typeof dizilis !== 'undefined') { dizilis.ikonSenkron(); if (dizilis.acik) dizilis.uygula(false); }
        /* Yazılış animasyonu düğmesinin durumu tablo yeniden çizilse de korunur */
        if (typeof yazimAnim !== 'undefined') yazimAnim.uygula();

        kartMod.ciz();
        
        if(typeof memoryGame !== 'undefined') memoryGame.init();
        if(typeof syncModeIcons === 'function') syncModeIcons();
    }
};

/* ================= KARTLAR: İKİ MOD =================
   ad  : kartın önünde harf, arkasında adı  (ا / Elif)
   yer : kartın önünde BAĞLI biçim, arkasında yeri  (ـك / Sonda)
   Bağlanmayan harflerin (ا د ر و ...) başta ve ortada ayrı bir
   yazılışı yoktur; onlar için yalnız "Sonda" kartı üretilir.
   ==================================================== */
const kartMod = {
    mod: 'ad',
    tur: 0,
    SAYFA: 28,          /* bir turda 7x4 = 28 kart; ızgara tam bu ölçüde */
    YER: [
        { alan: 'b', ad: 'Başta',  sinif: 'ab-c-yesil' },
        { alan: 'o', ad: 'Ortada', sinif: 'ab-c-mavi'  },
        { alan: 's', ad: 'Sonda',  sinif: 'ab-c-mor'   }
    ],
    sec(m) {
        this.mod = (m === 'yer') ? 'yer' : 'ad';
        this.tur = 0;
        document.querySelectorAll('#kartMod .km-hap').forEach(b => {
            b.classList.toggle('aktif', b.getAttribute('data-km') === this.mod);
        });
        this.ciz();
        if (typeof playClick === 'function') { try { playClick(); } catch (e) { } }
    },
    /* Geçerli moddaki BÜTÜN kartların listesi (tura bölünmeden önce). */
    liste() {
        const l = [];
        if (this.mod === 'ad') {
            harfler.forEach(i => l.push({
                on: i.h, arka: i.tr, sinif: i.nobind ? 'nobind' : '', yer: false
            }));
        } else {
            harfler.forEach(i => {
                /* bağlanmayan harfin başta/ortada ayrı yazılışı yoktur */
                const alt = i.nobind ? this.YER.filter(y => y.alan === 's') : this.YER;
                alt.forEach(y => l.push({
                    on: i[y.alan] || i.h, arka: y.ad, alt: i.tr,
                    sinif: i.nobind ? 'nobind' : '', renk: y.sinif, yer: true
                }));
            });
        }
        return l;
    },
    /* Turlar EŞİT bölünür: 72 kart 28+28+16 değil 24+24+24 olur, böylece
       hiçbir tur yarım kalmaz. Tur boyu 4'ün katına yuvarlanır ki ızgara
       (4 satır) tam dolsun. */
    turBoyu() {
        const t = this.liste().length;
        const n = Math.max(1, Math.ceil(t / this.SAYFA));
        return Math.max(4, Math.ceil(Math.ceil(t / n) / 4) * 4);
    },
    turSayisi() { return Math.max(1, Math.ceil(this.liste().length / this.turBoyu())); },
    turGit(yon) {
        const n = this.turSayisi();
        this.tur = (this.tur + yon + n) % n;      /* başa/sona sarar */
        this.ciz();
        if (typeof playClick === 'function') { try { playClick(); } catch (e) { } }
    },
    ciz() {
        const g2 = document.getElementById('g2');
        if (!g2) return;
        const tum = this.liste(), n = this.turSayisi();
        if (this.tur >= n) this.tur = 0;
        const boy = this.turBoyu();
        const dilim = tum.slice(this.tur * boy, (this.tur + 1) * boy);
        /* IZGARA TAM DOLSUN: geniş ekranda 4 satır sabit, sütun sayısı kart
           adedinden çıkar (24 kart → 6x4); dar ekranda 4 sütun sabit, satır
           sayısı çıkar (24 kart → 4x6). Böylece alt sırada boş kutu kalmaz
           ve kartlar dikeyde ezilmez. */
        const dar = window.matchMedia('(max-width: 768px)').matches;
        const kenar = Math.max(1, Math.ceil(dilim.length / 4));
        g2.style.gridTemplateColumns = 'repeat(' + (dar ? 4 : kenar) + ', 1fr)';
        g2.style.gridTemplateRows = 'repeat(' + (dar ? kenar : 4) + ', 1fr)';
        g2.innerHTML = dilim.map(k => k.yer
            ? `<div class="flip-box ${k.sinif}" onclick="handleFlipBox(this)"><div class="flip-inner">` +
              `<div class="face face-yer ${k.renk}">${k.on}</div>` +
              `<div class="face face-back face-yer-arka"><b>${k.arka}</b><span>${k.alt}</span></div>` +
              `</div></div>`
            : `<div class="flip-box ${k.sinif}" onclick="handleFlipBox(this)"><div class="flip-inner">` +
              `<div class="face">${k.on}</div><div class="face face-back">${k.arka}</div>` +
              `</div></div>`
        ).join('');
        /* tur şeridi: tek tur varsa oklara gerek yok */
        const kutu = document.getElementById('kmTur');
        const yazi = document.getElementById('kmTurYazi');
        if (yazi) kdYaz(yazi, 'oyn.tur_sayac', 'Tur {n} / {toplam}', { n: this.tur + 1, toplam: n });
        if (kutu) kutu.style.display = (n > 1) ? 'inline-flex' : 'none';
    }
};
/* Ekran dar/geniş sınırını geçince ızgara yeniden kurulur. */
try {
    window.matchMedia('(max-width: 768px)').addEventListener('change', function () {
        if (document.getElementById('g2')) kartMod.ciz();
    });
} catch (e) { }

/* Mod ikonları: her switch-wrapper içindeki checkbox durumuna göre
   hangi SVG'nin canlı (animasyonlu) olacağını belirler. */
function syncModeIcons() {
    document.querySelectorAll('.switch-wrapper').forEach(w => {
        const inp = w.querySelector('input[type="checkbox"]');
        if (!inp) return;
        const s = w.querySelector('.mode-ico--single');
        const m = w.querySelector('.mode-ico--multi');
        if (s) s.classList.toggle('on', !inp.checked);
        if (m) m.classList.toggle('on', inp.checked);
    });
}

/* ================= ODAK / TAM EKRAN =================
   "Sadece harfleri göster": yan panel, alt şerit, sekme düğmeleri ve ana sayfa
   düğmesi gizlenir; harf tablosu tüm alanı kaplar ve harfler büyür. Tarayıcının
   Fullscreen API'si varsa o da istenir, böylece tarayıcı çubukları da kalkar;
   izin verilmezse sayfa içi odak modu tek başına yeter.
   Çıkış: aynı düğme, Esc tuşu ya da tarayıcının tam ekrandan çıkması.
   ==================================================== */
const tamEkran = {
    acik: false,
    cevir() { this.acik ? this.kapat() : this.ac(); },
    /* Kart harfleri SVG ve boyları harfGrid.layout() ile ölçülüyor; kart ölçüsü
       değiştiği anda yeniden ölçülmeleri gerekir. İki rAF: sınıf değişiminin
       yerleşime yansımasını bekleriz. Tarayıcı tam ekrana geçerken viewport bir
       kez daha değişir, o yüzden bir de gecikmeli ölçüm yapılır. */
    olcumYenile() {
        if (typeof harfGrid === 'undefined' || !harfGrid.layout) return;
        requestAnimationFrame(() => requestAnimationFrame(() => harfGrid.layout()));
        setTimeout(() => harfGrid.layout(), 260);
        setTimeout(() => harfGrid.layout(), 700);
    },
    ac() {
        if (this.acik) return;
        playClick();
        /* Odak modu yalnız Harf Tanıtımı sekmesi için: başka sekmedeysek oraya dön */
        const p1 = document.getElementById('p1');
        if (p1 && !p1.classList.contains('active')) {
            const dg = document.querySelector('.nav-tabs .tab-trigger');
            if (dg) dg.click();
        }
        this.acik = true;
        document.body.classList.add('harf-tam');
        const btn = document.getElementById('tam-btn');
        if (btn) { if (window.KidefDil && KidefDil.nitelik) KidefDil.nitelik(btn, 'title', 'alf.odak_cik', 'Odak modundan çık (Esc)'); else btn.title = 'Odak modundan çık (Esc)'; }
        this.olcumYenile();
        const kok = document.documentElement;
        if (kok.requestFullscreen) { const q = kok.requestFullscreen(); if (q && q.catch) q.catch(() => {}); }
        else if (kok.webkitRequestFullscreen) { try { kok.webkitRequestFullscreen(); } catch (e) {} }
    },
    kapat() {
        if (!this.acik) return;
        playClick();
        this.acik = false;
        document.body.classList.remove('harf-tam');
        const btn = document.getElementById('tam-btn');
        if (btn) { if (window.KidefDil && KidefDil.nitelik) KidefDil.nitelik(btn, 'title', 'alf.odak_ac', 'Sadece harfleri göster (tam ekran)'); else btn.title = 'Sadece harfleri göster (tam ekran)'; }
        this.olcumYenile();
        const fs = document.fullscreenElement || document.webkitFullscreenElement;
        if (fs) {
            if (document.exitFullscreen) { const q = document.exitFullscreen(); if (q && q.catch) q.catch(() => {}); }
            else if (document.webkitExitFullscreen) { try { document.webkitExitFullscreen(); } catch (e) {} }
        }
    }
};
/* Tarayıcı tam ekrandan kendi çıkarsa (Esc / F11) odak modu da kapanır */
['fullscreenchange', 'webkitfullscreenchange'].forEach(ad => document.addEventListener(ad, () => {
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fs && tamEkran.acik) tamEkran.kapat();
}));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && tamEkran.acik) tamEkran.kapat();
});

/* Hafıza kartlarının arka yüzündeki geometrik tezhip motifi */
const MEM_ORNAMENT = '<svg class="mem-orn" viewBox="0 0 100 100" aria-hidden="true">'
    + '<rect x="26" y="26" width="48" height="48" rx="4"/>'
    + '<rect x="26" y="26" width="48" height="48" rx="4" transform="rotate(45 50 50)"/>'
    + '<circle cx="50" cy="50" r="14"/>'
    + '<circle class="mo-dot" cx="50" cy="50" r="41"/>'
    + '</svg>';

const memoryGame = {
    /* VARSAYILAN İKİ KİŞİLİK: hafıza sınıfta ikili oynanıyor, sekme
       açılır açılmaz iki oyunculu kurulum hazır gelsin (bkz. ikiKisilik). */
    mode: 'multi', turn: 1, opened: [], matchedCount: 0, targetPairs: 9, scores: { p1: 0, p2: 0 },

    toggleSwitch: function(isMulti) {
        document.getElementById('mem-toggle').checked = isMulti;
        playClick();
        this.mode = isMulti ? 'multi' : 'single';
        syncModeIcons();
        this.init();
    },

    /* Hafıza sekmesine her girişte çağrılır. ZATEN iki kişilikse hiçbir şey
       yapmaz — böylece sekmeler arasında gezerken yarım kalan oyun bozulmaz.
       Kullanıcı tek kişiliğe geçtiyse, sekmeden çıkıp döndüğünde yine iki
       kişilik açılır. */
    ikiKisilik: function () {
        const t = document.getElementById('mem-toggle');
        if (t) t.checked = true;
        if (typeof syncModeIcons === 'function') syncModeIcons();
        if (this.mode === 'multi') { this.updateTurnUI(); return; }
        this.mode = 'multi';
        this.init();
    },

    init: function() {
        const g3 = document.getElementById('g3');
        if (!g3) return;
        
        this.targetPairs = parseInt(document.getElementById('pairCount').value);
        g3.innerHTML = "";
        document.getElementById('resetArea').style.display = 'none';
        this.opened = []; this.matchedCount = 0; this.turn = 1; this.scores = { p1: 0, p2: 0 };
        
        document.getElementById('msc1').innerText = "0";
        document.getElementById('msc2').innerText = "0";
        
        this.updateTurnUI();

        let items = [];
        [...harfler].sort(() => Math.random() - 0.5).slice(0, this.targetPairs).forEach(h => {
            items.push({ text: h.h, match: h.tr, ar: true });
            items.push({ text: h.tr, match: h.tr, ar: false });
        });

        items.sort(() => Math.random() - 0.5).forEach(item => {
            const card = document.createElement('div');
            card.className = 'mem-item ' + (item.ar ? 'mem-ar' : 'mem-tr');
            card.dataset.match = item.match;
            card.innerHTML = '<div class="mem-inner">'
                + '<div class="mem-face mem-front"><span class="mem-txt"></span></div>'
                + '<div class="mem-face mem-back">' + MEM_ORNAMENT + '</div>'
                + '</div>';
            card.querySelector('.mem-txt').textContent = item.text;
            card.onclick = () => this.handleFlip(card);
            g3.appendChild(card);
        });

        let totalCards = this.targetPairs * 2;
        let cols = 4; 
        if (totalCards > 12) cols = 6; 
        if (totalCards > 24) cols = 7; 
        if (window.innerWidth <= 768) cols = (totalCards <= 12) ? 3 : 4;

        g3.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    },
    
    updateTurnUI: function() {
        const p1Box = document.getElementById('p1-box');
        const p2Box = document.getElementById('p2-box');
        const title1 = document.getElementById('p1-title');

        if (this.mode === 'single') {
            kdYaz(title1, 'oyn.skor', "SKOR");
            p1Box.style.display = 'flex';
            p1Box.classList.remove('active-p'); 
            p2Box.style.display = 'none';
        } else {
            kdYaz(title1, 'hh.oyuncu1', "OYUNCU 1");
            p1Box.style.display = 'flex';
            p2Box.style.display = 'flex';
            p1Box.classList.toggle('active-p', this.turn === 1);
            p2Box.classList.toggle('active-p', this.turn === 2);
        }
    },
    
    handleFlip: function(card) {
        if (this.opened.length < 2 && !card.classList.contains('show') && !card.classList.contains('matched')) {
            playClick();
            const turnClass = this.turn === 1 ? 'p1-turn' : 'p2-turn';
            card.classList.add('show', turnClass);
            this.opened.push(card);
            if (this.opened.length === 2) setTimeout(() => this.checkMatch(), 600);
        }
    },
    
    checkMatch: function() {
        const [c1, c2] = this.opened;
        if (c1.dataset.match === c2.dataset.match) {
            playCorrect(); // Sinüs Dalgası ile Doğru Sesi
            
            c1.classList.add('matched'); c2.classList.add('matched');

            let activePlayer = this.mode === 'multi' ? this.turn : 1;
            this.scores['p' + activePlayer]++;
            document.getElementById('msc' + activePlayer).innerText = this.scores['p' + activePlayer];
            
            this.matchedCount++; this.opened = [];
            
            if (this.matchedCount === this.targetPairs) {
                document.getElementById('resetArea').style.display = 'block';
                setTimeout(() => {
                    let msg = kdMetin('oyn.tebrikler', "Tebrikler!");
                    if (this.mode === 'multi') msg = this.scores.p1 > this.scores.p2 ? kdMetin('oyn.oyuncu1_kaz', "OYUNCU 1 KAZANDI!") + " 🎉" : (this.scores.p2 > this.scores.p1 ? kdMetin('oyn.oyuncu2_kaz', "OYUNCU 2 KAZANDI!") + " 🎉" : kdMetin('oyn.berabere', "BERABERE!") + " 🤝");
                    alert(msg);
                }, 400);
            }
        } else {
            playWrong(); // Sinüs Dalgası ile Yanlış Sesi
            
            setTimeout(() => {
                c1.classList.remove('show', 'p1-turn', 'p2-turn');
                c2.classList.remove('show', 'p1-turn', 'p2-turn');
                this.opened = [];
                if (this.mode === 'multi') { 
                    this.turn = this.turn === 1 ? 2 : 1; 
                    this.updateTurnUI(); 
                }
            }, 800);
        }
    }
};

const game = {
    mode: 'multi',
    /* İKİ SORU TİPİ
         ad  : harf gösterilir, adı sorulur      (ش  →  Şın)
         yer : ad ve yer sorulur, dört yazılıştan doğrusu seçilir
               "Şın harfinin baştaki yazılışı hangisidir?"  ش ـش شـ ـشـ  */
    soruTipi: 'ad',
    bicimler: ['h', 'b', 'o', 's'],
    bicimAd: { h: 'yalın', b: 'baştaki', o: 'ortadaki', s: 'sondaki' },
    tipSec: function (t) {
        this.soruTipi = (t === 'yer') ? 'yer' : 'ad';
        document.querySelectorAll('.ys-bicim .ys-cip[data-t]').forEach(d => {
            d.classList.toggle('acik', d.getAttribute('data-t') === this.soruTipi);
        });
        const k = document.getElementById('ysYerKutu');
        if (k) k.hidden = (this.soruTipi !== 'yer');
        this.questionPool = [];
        playClick();
    },
    bicimSec: function (b) {
        const i = this.bicimler.indexOf(b);
        if (i >= 0) { if (this.bicimler.length > 1) this.bicimler.splice(i, 1); }
        else this.bicimler.push(b);
        document.querySelectorAll('#ysCipler .ys-cip').forEach(d => {
            d.classList.toggle('acik', this.bicimler.indexOf(d.getAttribute('data-b')) >= 0);
        });
        playClick();
    },
    /* "Yazılış yeri" sorusu ancak DÖRT yazılışı da birbirinden farklı olan
       harflerle kurulabilir; ا د ر و gibi bağlanmayanlarda şıklar tekrar
       ederdi, onlar bu tipte havuza girmez. */
    yerHavuzu: function () {
        return harfler.filter(h => !h.nobind &&
            new Set([h.h, h.b, h.o, h.s]).size === 4);
    },
    
    score: {p1:0, p2:0}, cur: "", p1S: null, p2S: null, t1: 0, t2: 0, questionPool: [],
    tekDogru: 0, tekToplam: 0, tekBas: 0,   /* GOREV: tek kisilik dogru/deneme sayaci + baslama ani */
    
    toggleMode: function(m) {
        playClick();
        this.mode = m;
        document.getElementById('yarisma-toggle').checked = (m === 'multi');
        syncModeIcons();
    },

    // Yeni eklendi: Menüye / Mod seçimine geri dönme
    showMenu: function() {
        playClick();
        document.getElementById('duel-stage-container').style.display = 'none';
        document.getElementById('startInfo').style.display = 'flex';
        
        // Arka planda çalışan sayacı durdur (Hata önleyici)
        if (this.timerTimeout) clearTimeout(this.timerTimeout);
        if (this.animTimeout) clearTimeout(this.animTimeout);
        
        // Puanları ve arayüzü sıfırla
        this.score = {p1:0, p2:0};
        this.tekDogru = 0; this.tekToplam = 0; this.tekBas = 0;
        document.getElementById('sc1').innerText = "0";
        document.getElementById('sc2').innerText = "0";
        document.getElementById('pb1').style.width = '0%';
        document.getElementById('pb2').style.width = '0%';
    },

    fillPool: function() {
        const kaynak = (this.soruTipi === 'yer') ? this.yerHavuzu() : harfler;
        this.questionPool = [...kaynak].sort(() => Math.random() - 0.5);
    },
    
    start: function() {
        playClick(); 
        
        document.getElementById('startInfo').style.display = 'none'; 
        document.getElementById('duel-stage-container').style.display = 'flex';
        
        // Moda göre arayüzü ayarla
        if (this.mode === 'single') {
            document.getElementById('z2').style.display = 'none';
            document.getElementById('pb2-container').style.display = 'none';
            document.getElementById('z1-title').innerHTML = kdIsaretli('oyn.skor', 'SKOR') + ': <b id="sc1">' + this.score.p1 + '</b>';
        } else {
            document.getElementById('z2').style.display = 'flex';
            document.getElementById('pb2-container').style.display = 'block';
            document.getElementById('z1-title').innerHTML = kdIsaretli('alf.oyuncu1_skor', 'OYUNCU 1 SKOR') + ': <b id="sc1">' + this.score.p1 + '</b>';
            document.getElementById('z2-title').innerHTML = kdIsaretli('alf.oyuncu2_skor', 'OYUNCU 2 SKOR') + ': <b id="sc2">' + this.score.p2 + '</b>';
        }

        document.getElementById('z1').classList.remove('zone-correct', 'zone-wrong');
        document.getElementById('z2').classList.remove('zone-correct', 'zone-wrong');
        
        document.getElementById('countdown-overlay').style.display = 'none';
        const nBtn = document.getElementById('nextBtn');
        nBtn.style.display = 'none'; 
        
        this.p1S = this.p2S = null;
        if(this.questionPool.length === 0) this.fillPool();
        const target = this.questionPool.pop(); 
        let activePlayers = this.mode === 'single' ? ['1'] : ['1', '2'];
        let soru, opts, harfSik;

        if (this.soruTipi === 'yer') {
            /* "Şın harfinin baştaki yazılışı hangisidir?"  şıklar: dört yazılış */
            const alan = this.bicimler[Math.floor(Math.random() * this.bicimler.length)];
            this.cur = target[alan];
            soru = kdMetin('alf.soru_yer', '{harf} harfinin {yer} yazılışı hangisidir?', { harf: target.tr, yer: kdMetin({ h: 'alf.yer_yalin', b: 'alf.yer_bas', o: 'alf.yer_orta', s: 'alf.yer_son' }[alan], this.bicimAd[alan]) });
            opts = [target.h, target.b, target.o, target.s];
            harfSik = true;
        } else {
            this.cur = target.tr;
            soru = target.h;
            opts = [this.cur];
            while (opts.length < 4) {
                const r = harfler[Math.floor(Math.random() * harfler.length)].tr;
                if (opts.indexOf(r) < 0) opts.push(r);
            }
            harfSik = false;
        }
        opts = opts.sort(() => Math.random() - 0.5);

        activePlayers.forEach(p => {
            const q = document.getElementById(`dq${p}`);
            q.innerText = soru;
            q.classList.toggle('q-cumle', harfSik);      /* cümle ise punto küçülür */
            const grid = document.getElementById(`ag${p}`); 
            grid.innerHTML = opts.map(o =>
                `<button class="btn-ans${harfSik ? ' btn-harf' : ''}" onclick="game.select('${p}',this,'${o}')">${o}</button>`
            ).join('');
        });
    },
    
    select: function(p, btn, val) { 
        if(this[`p${p}S`] !== null) return; 
        playClick(); 
        this[`p${p}S`] = val; this[`t${p}`] = Date.now(); 
        btn.classList.add('selected'); 
        
        if (this.mode === 'single') {
            if(this.p1S) this.reveal();
        } else {
            if(this.p1S && this.p2S) this.reveal(); 
        }
    },
    
    reveal: function() {
        let p1Correct = (this.p1S === this.cur);

        // --- TEK KİŞİLİK MANTIK ---
        if (this.mode === 'single') {
            if (this.tekToplam === 0) this.tekBas = Date.now();   /* ilk soruyla sure baslar */
            this.tekToplam++;
            if (p1Correct) this.tekDogru++;
            const z1 = document.getElementById('z1');
            if(p1Correct) {
                z1.classList.add('zone-correct'); 
                const popup = document.createElement('div'); 
                popup.className = 'puan-popup'; popup.innerText = "+10"; 
                z1.appendChild(popup); setTimeout(() => popup.remove(), 1000);
                this.score.p1 += 10; 
                playCorrect();
            } else {
                z1.classList.add('zone-wrong');
                playWrong();
            }
        } 
        // --- İKİ KİŞİLİK MANTIK ---
        else {
            let p2Correct = (this.p2S === this.cur);
            
            ['1','2'].forEach(p => {
                const z = document.getElementById(`z${p}`);
                const isCorrect = this[`p${p}S`] === this.cur;
                
                if(isCorrect) {
                    z.classList.add('zone-correct'); 
                    const popup = document.createElement('div'); 
                    popup.className = 'puan-popup'; popup.innerText = "+5"; 
                    z.appendChild(popup); setTimeout(() => popup.remove(), 1000);
                    this.score[`p${p}`] += 5;
                } else { 
                    z.classList.add('zone-wrong'); 
                }
            });

            if(p1Correct || p2Correct) playCorrect(); else playWrong();

            if(p1Correct && !p2Correct) {
                this.score.p1 += 5;
                const p1Bonus = document.createElement('div'); 
                p1Bonus.className = 'puan-popup'; p1Bonus.innerText = "HATA BONUSU! +5"; p1Bonus.style.color = "#38bdf8"; p1Bonus.style.top = "15%";
                document.getElementById('z1').appendChild(p1Bonus); setTimeout(() => p1Bonus.remove(), 1000);
            } else if(p2Correct && !p1Correct) {
                this.score.p2 += 5;
                const p2Bonus = document.createElement('div'); 
                p2Bonus.className = 'puan-popup'; p2Bonus.innerText = "HATA BONUSU! +5"; p2Bonus.style.color = "#4ade80"; p2Bonus.style.top = "15%";
                document.getElementById('z2').appendChild(p2Bonus); setTimeout(() => p2Bonus.remove(), 1000);
            } else if(p1Correct && p2Correct) {
                if(this.t1 < this.t2) {
                    this.score.p1 += 5;
                    const p1Bonus = document.createElement('div'); 
                    p1Bonus.className = 'puan-popup'; p1Bonus.innerText = "HIZLI! +5"; p1Bonus.style.color = "#38bdf8"; p1Bonus.style.top = "15%";
                    document.getElementById('z1').appendChild(p1Bonus); setTimeout(() => p1Bonus.remove(), 1000);
                } else if(this.t2 < this.t1) {
                    this.score.p2 += 5;
                    const p2Bonus = document.createElement('div'); 
                    p2Bonus.className = 'puan-popup'; p2Bonus.innerText = "HIZLI! +5"; p2Bonus.style.color = "#4ade80"; p2Bonus.style.top = "15%";
                    document.getElementById('z2').appendChild(p2Bonus); setTimeout(() => p2Bonus.remove(), 1000);
                }
            }
        }

        // Skor Sınırı ve Bar Güncellemesi
        if(this.score.p1 > 100) this.score.p1 = 100;
        if(this.score.p2 > 100) this.score.p2 = 100;

        document.getElementById('sc1').innerText = this.score.p1; 
        if(this.mode !== 'single') document.getElementById('sc2').innerText = this.score.p2; 
        
        document.getElementById('pb1').style.width = this.score.p1 + '%';
        document.getElementById('pb2').style.width = this.score.p2 + '%';

        // Bitiş Kontrolü
        if(this.score.p1 >= 100 || this.score.p2 >= 100) {
            const nBtn = document.getElementById('nextBtn');
            kdYaz(nBtn, 'alf.yeniden_baslat', "🏆 YENİDEN BAŞLAT");
            nBtn.onclick = () => this.resetGame();
            nBtn.style.display = 'block'; 
            
            setTimeout(() => {
                if (this.mode === 'single') {
                    /* GOREV KOPRUSU: yalniz TEK KISILIK mod sonucu sayilir */
                    try { if (window.KidefGorev) KidefGorev.bildir({ dogru: this.tekDogru, toplam: this.tekToplam, mod: 'tek', sureSn: this.tekBas ? Math.round((Date.now() - this.tekBas) / 1000) : null }); } catch (e) { }
                    alert(kdMetin('alf.tamamladin', "HARİKA! 100 PUANLA OYUNU TAMAMLADIN!") + " 🎉");
                } else {
                    if(this.score.p1 === 100 && this.score.p2 === 100) alert(kdMetin('alf.berabere', "İNANILMAZ! BERABERE BİTTİ!") + " 🤝");
                    else if(this.score.p1 >= 100) alert(kdMetin('oyn.oyuncu1_kaz', "OYUNCU 1 KAZANDI!") + " 🎉");
                    else alert(kdMetin('oyn.oyuncu2_kaz', "OYUNCU 2 KAZANDI!") + " 🎉");
                }
            }, 500);
        } else {
            this.startCountdown();
        }
    },
    
    startCountdown: function() {
        const overlay = document.getElementById('countdown-overlay');
        const circle = document.getElementById('countdown-circle');
        
        overlay.classList.remove('pop-out');
        overlay.style.display = 'block';
        
        circle.style.transition = 'none';
        circle.style.strokeDashoffset = '0';
        
        void circle.offsetWidth;
        
        circle.style.transition = 'stroke-dashoffset 2s linear';
        circle.style.strokeDashoffset = '264'; 
        
        this.timerTimeout = setTimeout(() => {
            overlay.classList.add('pop-out');
            this.animTimeout = setTimeout(() => {
                overlay.style.display = 'none';
                this.start();
            }, 400); 
        }, 2000);
    },
    
    resetGame: function() {
        // Yeniden Başlatılınca Mod Seçimine Dönsün
        this.showMenu(); 
    }
};

ui.init();
/* Açılışta etkin sekme Harf Tanıtımı: onun ziyareti de sayılsın. */
gaSekme('p1');