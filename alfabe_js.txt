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
        {h: 'ن', tr: 'Nun', b:'نـ', o:'نـ', s:'ـن'}, 
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
            c.title = 'Detay için tıkla: mahreç ve yazılış' + (ad ? ' — ' + ad : '');
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
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSineTone(freq1, freq2, duration) {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
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
            /* Açılışta ortak saat sıfırlanır: bütün harfler baştan ve
               birlikte yazılmaya başlasın. Kapanışta ise harflerin tam
               hâline oturması için "oturtuldu" sayacı geçersiz kılınır. */
            harfGrid.t0 = null;
            harfGrid.oturanSay = -1;
        }
        this.ikonSenkron();
    },

    ikonSenkron: function () {
        const b = document.getElementById('yaz-btn');
        if (!b) return;
        b.classList.toggle('on', this.acik);
        b.title = this.acik ? 'Yazılış animasyonunu durdur'
                            : 'Harflerin yazılış animasyonunu başlat';
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
            e.title = this.acik ? 'Alfabetik sıraya (labirente) dön'
                                : 'Harfleri ailelerine göre diz';
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
function ypHarf(i, form) {
    const g = (form === 's') ? i.s : i.b;
    const yaz = (typeof HARF_YAZIM !== 'undefined') ? HARF_YAZIM[i.h] : null;
    const d = yaz && yaz[form];
    if (!d || !d.fill) return `<span class="yp-harf">${g}</span>`;
    const H = 100, W = Math.round(d.vb[2] / d.vb[3] * H);
    return `<span class="yp-harf yp-harf-svg"><svg class="yp-svg" viewBox="${d.vb.join(' ')}"`
        + ` width="${W}" height="${H}" aria-hidden="true"><path d="${d.fill}"></path></svg>`
        + `<span class="yp-gizli">${g}</span></span>`;
}

/* ✓ ve ✗ artık yazı değil SVG. İkisi de ok animasyonu bittikten sonra belirir
   (zamanlama CSS'te: ok döngüsü 3.4s, işaretler %47'ye kadar görünmez).
     TİK   -> tek yol, soldan sağa çizilir; aynı anda aşağıdan yukarı süzülür.
     ÇARPI -> iki kol sırayla çizilir, o kadar. Önceden burada bir sarsıntı ve
              çatlama efekti vardı; gözü yorduğu için kaldırıldı, işaret artık
              sakin biçimde belirip duruyor. */
const IM_TIK = '<svg class="yp-im yp-im-ok" viewBox="0 0 34 34" role="img"'
    + ' aria-label="öncesine bağlanır"><path class="yi-tik" d="M6 18.5L13.5 26L28 8"></path></svg>';
const IM_CARPI = '<svg class="yp-im yp-im-no" viewBox="0 0 34 34" role="img"'
    + ' aria-label="sonrasına bağlanmaz">'
    + '<g class="yi-x">'
    + '<path class="yi-x1" d="M8.5 8.5L25.5 25.5"></path>'
    + '<path class="yi-x2" d="M25.5 8.5L8.5 25.5"></path></g>'
    + '</svg>';

function yanPaneliKur() {
    const yan = document.getElementById('g1yan');
    if (!yan) return;
    /* Başlıkta her kelimenin ilk harfi büyük */
    let s = '<div class="yp-baslik">Kendinden Sonrakiyle Birleşmeyen Harfler</div>';
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
        s += `<div class="yp-hucre yp-c-ok" title="${i.tr}: öncesine bağlanır">${ypHarf(i, 's')}</div>`;
        s += `<div class="yp-hucre yp-c-no" title="${i.tr}: sonrasına bağlanmaz">${ypHarf(i, 'b')}</div>`;
    });
    s += '</div>';
    yan.innerHTML = s;
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
        `<div class="as-kutu${k.genis ? ' as-genis' : ''}${k.kls ? ' ' + k.kls : ''}">`
        + `<div class="as-baslik">${k.ad}</div>`
        + `<div class="as-liste">`
        + k.ogeler.map(o => `<div class="as-oge${k.kesik ? ' as-oge-kesik' : ''}${o.kls ? ' ' + o.kls : ''}" title="${o.ad}">`
            + (k.kesik ? `<span class="as-kesik" aria-hidden="true">${KESIK}</span>` : '')
            + `<span class="as-harf">${o.g}</span></div>`).join('')
        + '</div></div>'
    ).join('');
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

const ui = {
    tab: (e, id) => {
        if (e) e.preventDefault(); 
        playClick(); 
        
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
        
        const target = document.getElementById(id);
        if(target) target.classList.add('active');
        
        if(e && e.currentTarget) e.currentTarget.classList.add('active');
        /* Odak modu yalnız harf tablosu içindir: başka sekmeye geçilirse kapanır */
        if (id !== 'p1' && typeof tamEkran !== 'undefined' && tamEkran.acik) tamEkran.kapat();
        const gs = document.getElementById('p1-switch');
        if (gs) gs.classList.toggle('gizli', id !== 'p1');
        /* Switch gizliyken mobilde sağdaki rezerv boşluk da kalksın */
        const nv = document.querySelector('.nav-tabs');
        if (nv) nv.classList.toggle('sw-yok', id !== 'p1');
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
                html += `<td class="${hucre}" data-n="${n}" data-r="${r}" data-c="${c}">
                    <div class="char-card ${nc} ${fc} ${sc} ${mz}" data-idx="${idx}" data-aile-ad="${AILE_ADI[HARF_AILE[i.h] || 'tek']}" data-ses-ad="${SES_ADI[HARF_SES[i.h] || 'tek']}" onclick="harfDetay.open(${idx})" title="Detay için tıkla: mahreç ve yazılış">
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

        const g2 = document.getElementById('g2');
        g2.innerHTML = "";
        harfler.forEach(i => {
            const nc = i.nobind ? 'nobind' : '';
            g2.innerHTML += `<div class="flip-box ${nc}" onclick="handleFlipBox(this)"><div class="flip-inner"><div class="face">${i.h}</div><div class="face face-back">${i.tr}</div></div></div>`;
        });
        
        if(typeof memoryGame !== 'undefined') memoryGame.init();
        if(typeof syncModeIcons === 'function') syncModeIcons();
    }
};

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
        if (btn) btn.title = 'Odak modundan çık (Esc)';
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
        if (btn) btn.title = 'Sadece harfleri göster (tam ekran)';
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
    mode: 'single', turn: 1, opened: [], matchedCount: 0, targetPairs: 9, scores: { p1: 0, p2: 0 },

    toggleSwitch: function(isMulti) {
        document.getElementById('mem-toggle').checked = isMulti;
        playClick();
        this.mode = isMulti ? 'multi' : 'single';
        syncModeIcons();
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
            title1.innerText = "SKOR";
            p1Box.style.display = 'flex';
            p1Box.classList.remove('active-p'); 
            p2Box.style.display = 'none';
        } else {
            title1.innerText = "OYUNCU 1";
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
                    let msg = "Tebrikler!";
                    if (this.mode === 'multi') msg = this.scores.p1 > this.scores.p2 ? "OYUNCU 1 KAZANDI! 🎉" : (this.scores.p2 > this.scores.p1 ? "OYUNCU 2 KAZANDI! 🎉" : "BERABERE! 🤝");
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
    score: {p1:0, p2:0}, cur: "", p1S: null, p2S: null, t1: 0, t2: 0, questionPool: [],
    
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
        document.getElementById('sc1').innerText = "0";
        document.getElementById('sc2').innerText = "0";
        document.getElementById('pb1').style.width = '0%';
        document.getElementById('pb2').style.width = '0%';
    },

    fillPool: function() { this.questionPool = [...harfler].sort(() => Math.random() - 0.5); },
    
    start: function() {
        playClick(); 
        
        document.getElementById('startInfo').style.display = 'none'; 
        document.getElementById('duel-stage-container').style.display = 'flex';
        
        // Moda göre arayüzü ayarla
        if (this.mode === 'single') {
            document.getElementById('z2').style.display = 'none';
            document.getElementById('pb2-container').style.display = 'none';
            document.getElementById('z1-title').innerHTML = 'SKOR: <b id="sc1">' + this.score.p1 + '</b>';
        } else {
            document.getElementById('z2').style.display = 'flex';
            document.getElementById('pb2-container').style.display = 'block';
            document.getElementById('z1-title').innerHTML = 'OYUNCU 1 SKOR: <b id="sc1">' + this.score.p1 + '</b>';
            document.getElementById('z2-title').innerHTML = 'OYUNCU 2 SKOR: <b id="sc2">' + this.score.p2 + '</b>';
        }

        document.getElementById('z1').classList.remove('zone-correct', 'zone-wrong');
        document.getElementById('z2').classList.remove('zone-correct', 'zone-wrong');
        
        document.getElementById('countdown-overlay').style.display = 'none';
        const nBtn = document.getElementById('nextBtn');
        nBtn.style.display = 'none'; 
        
        this.p1S = this.p2S = null;
        if(this.questionPool.length === 0) this.fillPool();
        const target = this.questionPool.pop(); 
        this.cur = target.tr;
        
        let activePlayers = this.mode === 'single' ? ['1'] : ['1', '2'];

        activePlayers.forEach(p => {
            document.getElementById(`dq${p}`).innerText = target.h;
            const grid = document.getElementById(`ag${p}`); 
            grid.innerHTML = "";
            let opts = [this.cur]; 
            while(opts.length < 4) { 
                let r = harfler[Math.floor(Math.random()*harfler.length)].tr; 
                if(!opts.includes(r)) opts.push(r); 
            }
            opts.sort(() => Math.random() - 0.5).forEach(o => { 
                grid.innerHTML += `<button class="btn-ans" onclick="game.select('${p}',this,'${o}')">${o}</button>`; 
            });
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
            nBtn.innerText = "🏆 YENİDEN BAŞLAT";
            nBtn.onclick = () => this.resetGame();
            nBtn.style.display = 'block'; 
            
            setTimeout(() => {
                if (this.mode === 'single') {
                    alert("HARİKA! 100 PUANLA OYUNU TAMAMLADIN! 🎉");
                } else {
                    if(this.score.p1 === 100 && this.score.p2 === 100) alert("İNANILMAZ! BERABERE BİTTİ! 🤝");
                    else if(this.score.p1 >= 100) alert("OYUNCU 1 KAZANDI! 🎉");
                    else alert("OYUNCU 2 KAZANDI! 🎉");
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