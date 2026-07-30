/* ==========================================================================
   OKUMA — hece, uzatma, cezim, şedde ve kelime okuyuşları
   --------------------------------------------------------------------------
   Sayfanın tamamı bu dosyadaki verilerden üretilir; HTML yalnızca kabuğu
   (sekmeler, araç şeridi, büyüt katmanı) taşır. Her sekme aynı iskeleti
   kullanır: üst şerit (başlık + açıklama + jetonlar) ve altında ızgara.
   ========================================================================== */

/* ------------------------------- Ses (tık) ------------------------------- */
let okAudio = null;
function okSes(frekans) {
    try {
        if (!okAudio) okAudio = new (window.AudioContext || window.webkitAudioContext)();
        const o = okAudio.createOscillator(), g = okAudio.createGain();
        o.type = 'sine'; o.frequency.value = frekans;
        g.gain.setValueAtTime(0.06, okAudio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, okAudio.currentTime + 0.12);
        o.connect(g); g.connect(okAudio.destination);
        o.start(); o.stop(okAudio.currentTime + 0.12);
    } catch (e) { /* ses yoksa sessiz devam */ }
}

/* ------------------------------- Harekeler ------------------------------- */
const FETHA = 'َ';   // üstün
const KESRA = 'ِ';   // esre
const DAMME = 'ُ';   // ötre
const SUKUN = 'ْ';   // cezim
const SEDDE = 'ّ';   // şedde

/* Harf listesi. lat = Latin karşılığı, kalin = kalın okunan harf (fetha "a",
   kesra "ı" olur), med = uzatma harfi olduğu için cezim/şedde almaz. */
const OK_HARFLER = [
    { h: 'ا', tr: 'Elif',  lat: '',  hemze: true },
    { h: 'ب', tr: 'Be',    lat: 'b' },
    { h: 'ت', tr: 'Te',    lat: 't' },
    { h: 'ث', tr: 'S̱e',    lat: 's̱' },
    { h: 'ج', tr: 'Cim',   lat: 'c' },
    { h: 'ح', tr: 'Ḥa',    lat: 'ḥ' },
    { h: 'خ', tr: 'Ḫa',    lat: 'ḫ', kalin: true },
    { h: 'د', tr: 'Dal',   lat: 'd' },
    { h: 'ذ', tr: 'Ẕel',   lat: 'ẕ' },
    { h: 'ر', tr: 'Ra',    lat: 'r', kalin: true },
    { h: 'ز', tr: 'Ze',    lat: 'z' },
    { h: 'س', tr: 'Sin',   lat: 's' },
    { h: 'ش', tr: 'Şın',   lat: 'ş' },
    { h: 'ص', tr: 'Ṣad',   lat: 'ṣ', kalin: true },
    { h: 'ض', tr: 'Ḍad',   lat: 'ḍ', kalin: true },
    { h: 'ط', tr: 'Ṭa',    lat: 'ṭ', kalin: true },
    { h: 'ظ', tr: 'Ẓa',    lat: 'ẓ', kalin: true },
    { h: 'ع', tr: 'Ayn',   lat: 'ʿ' },
    { h: 'غ', tr: 'Ğayn',  lat: 'ğ', kalin: true },
    { h: 'ف', tr: 'Fe',    lat: 'f' },
    { h: 'ق', tr: 'Ḳaf',   lat: 'ḳ', kalin: true },
    { h: 'ك', tr: 'Kef',   lat: 'k' },
    { h: 'ل', tr: 'Lam',   lat: 'l' },
    { h: 'م', tr: 'Mim',   lat: 'm' },
    { h: 'ن', tr: 'Nun',   lat: 'n' },
    { h: 'و', tr: 'Waw',   lat: 'v' },
    { h: 'ه', tr: 'He',    lat: 'h' },
    { h: 'ي', tr: 'Ye',    lat: 'y' }
];

/* Latin sesli harfler: kalın harflerde a / ı / u, ince harflerde e / i / u */
function sesli(harf, tur, uzun) {
    const k = !!harf.kalin;
    if (tur === 'ustun') return uzun ? (k ? 'â' : 'â') : (k ? 'a' : 'e');
    if (tur === 'esre')  return uzun ? 'î' : (k ? 'ı' : 'i');
    return uzun ? 'û' : 'u';
}

const HAREKE_ADI = { ustun: 'Üstün', esre: 'Esre', otre: 'Ötre' };
const HAREKE_ISARET = { ustun: FETHA, esre: KESRA, otre: DAMME };

/* --------------------------- Okuyuş üreticileri --------------------------
   Her biri {ar, tr, sinif} döndürür: ar = Arapça okuyuş, tr = Latin okunuş,
   sinif = hareke rengi için CSS sınıfı. */
const URETEC = {
    /* Harf + hareke:  بَ / بِ / بُ */
    hece(harf, tur) {
        const iz = HAREKE_ISARET[tur];
        if (harf.hemze) {
            const ar = (tur === 'esre' ? 'إ' : 'أ') + iz;   // إِ / أَ / أُ
            return { ar, tr: sesli(harf, tur, false), sinif: 'h-' + tur };
        }
        return { ar: harf.h + iz, tr: harf.lat + sesli(harf, tur, false), sinif: 'h-' + tur };
    },
    /* Harf + hareke + med harfi:  بَا / بِي / بُو */
    uzatma(harf, tur) {
        const iz = HAREKE_ISARET[tur];
        const med = { ustun: 'ا', esre: 'ي', otre: 'و' }[tur];
        if (harf.hemze) {
            const ar = tur === 'ustun' ? 'آ'                     // آ
                     : tur === 'esre'  ? 'إ' + KESRA + 'ي'       // إِي
                     :                    'أ' + DAMME + 'و';     // أُو
            return { ar, tr: sesli(harf, tur, true), sinif: 'h-med' };
        }
        return { ar: harf.h + iz + med, tr: harf.lat + sesli(harf, tur, true), sinif: 'h-med' };
    },
    /* Hemze + hareke, sonra sâkin harf:  أَبْ / إِبْ / أُبْ */
    cezim(harf, tur) {
        const bas = (tur === 'esre' ? 'إ' : 'أ') + HAREKE_ISARET[tur];
        return {
            ar: bas + harf.h + SUKUN,
            tr: sesli(harf, tur, false) + harf.lat,
            sinif: 'h-cezim'
        };
    },
    /* Şeddeli harf: harf iki kez okunur —  أَبَّ / إِبِّ / أُبُّ */
    sedde(harf, tur) {
        const iz = HAREKE_ISARET[tur];
        const bas = (tur === 'esre' ? 'إ' : 'أ') + iz;
        const s = sesli(harf, tur, false);
        return {
            ar: bas + harf.h + SEDDE + iz,
            tr: s + harf.lat + harf.lat + s,
            sinif: 'h-sedde'
        };
    }
};

/* --------------------------------- Kelimeler -----------------------------
   Sekmelerde öğrenilen kuralların gerçek kelimelerdeki hâli. kural alanı
   hangi konunun örneği olduğunu söyler (rozet rengi ondan gelir). */
const OK_KELIMELER = [
    { ar: 'أَبٌ',        tr: 'eb',        anlam: 'baba',      kural: 'hece' },
    { ar: 'يَدٌ',        tr: 'yed',       anlam: 'el',        kural: 'hece' },
    { ar: 'وَلَدٌ',      tr: 'veled',     anlam: 'çocuk',     kural: 'hece' },
    { ar: 'قَلَمٌ',      tr: 'kalem',     anlam: 'kalem',     kural: 'hece' },
    { ar: 'رَجُلٌ',      tr: 'racul',     anlam: 'adam',      kural: 'hece' },
    { ar: 'قَمَرٌ',      tr: 'kamer',     anlam: 'ay',        kural: 'hece' },
    { ar: 'بَابٌ',       tr: 'bâb',       anlam: 'kapı',      kural: 'uzatma' },
    { ar: 'كِتَابٌ',     tr: 'kitâb',     anlam: 'kitap',     kural: 'uzatma' },
    { ar: 'نُورٌ',       tr: 'nûr',       anlam: 'ışık',      kural: 'uzatma' },
    { ar: 'طَالِبٌ',     tr: 'ṭâlib',     anlam: 'öğrenci',   kural: 'uzatma' },
    { ar: 'كَبِيرٌ',     tr: 'kebîr',     anlam: 'büyük',     kural: 'uzatma' },
    { ar: 'صَغِيرٌ',     tr: 'ṣağîr',     anlam: 'küçük',     kural: 'uzatma' },
    { ar: 'سَمَاءٌ',     tr: 'semâ',      anlam: 'gökyüzü',   kural: 'uzatma' },
    { ar: 'مَاءٌ',       tr: 'mâ',        anlam: 'su',        kural: 'uzatma' },
    { ar: 'بَيْتٌ',      tr: 'beyt',      anlam: 'ev',        kural: 'cezim' },
    { ar: 'شَمْسٌ',      tr: 'şems',      anlam: 'güneş',     kural: 'cezim' },
    { ar: 'عِلْمٌ',      tr: 'ʿilm',      anlam: 'ilim',      kural: 'cezim' },
    { ar: 'مُسْلِمٌ',    tr: 'muslim',    anlam: 'müslüman',  kural: 'cezim' },
    { ar: 'مَدْرَسَةٌ',  tr: 'medrese',   anlam: 'okul',      kural: 'cezim' },
    { ar: 'مَسْجِدٌ',    tr: 'mescid',    anlam: 'mescit',    kural: 'cezim' },
    { ar: 'رَبٌّ',       tr: 'rabb',      anlam: 'rab',       kural: 'sedde' },
    { ar: 'أُمٌّ',       tr: 'umm',       anlam: 'anne',      kural: 'sedde' },
    { ar: 'حَقٌّ',       tr: 'ḥaḳḳ',      anlam: 'hak',       kural: 'sedde' },
    { ar: 'جَنَّةٌ',     tr: 'cennet',    anlam: 'cennet',    kural: 'sedde' },
    { ar: 'مُعَلِّمٌ',   tr: 'muʿallim',  anlam: 'öğretmen',  kural: 'sedde' },
    { ar: 'سَيَّارَةٌ',  tr: 'seyyâre',   anlam: 'araba',     kural: 'sedde' }
];

const KURAL_ADI = { hece: 'Hece', uzatma: 'Uzatma', cezim: 'Cezim', sedde: 'Şedde' };

/* --------------------------------- Sekmeler ------------------------------ */
const OK_SEKME = {
    o1: {
        ad: 'Hece', uretec: 'hece',
        aciklama: 'Harf + hareke: harfi üstün, esre ve ötre ile tek tek oku.',
        elifVar: true, not: 'Elif harekeyi hemze ile taşır: أَ إِ أُ'
    },
    o2: {
        ad: 'Uzatma', uretec: 'uzatma',
        aciklama: 'Üstün + elif, esre + ye, ötre + vav: ses bir elif miktarı uzar.',
        elifVar: true, not: 'Med harfleri: ا و ي'
    },
    o3: {
        ad: 'Cezim', uretec: 'cezim',
        aciklama: 'Cezimli harf harekesizdir: kendinden önceki harfe yaslanarak okunur.',
        elifVar: false, not: 'Elif cezim almaz; sâkin elif uzatma olur.'
    },
    o4: {
        ad: 'Şedde', uretec: 'sedde',
        aciklama: 'Şeddeli harf iki kere okunur: biri cezimli, biri harekeli.',
        elifVar: false, not: 'Elif şedde almaz.'
    },
    o5: { ad: 'Kelime', kelime: true, aciklama: 'Öğrendiğin kuralların gerçek kelimelerdeki hâli.' }
};

/* ================================ UYGULAMA =============================== */
const okuma = {
    aktif: 'o1',
    hareke: 'hepsi',      // hepsi | ustun | esre | otre
    kural: 'hepsi',       // kelime sekmesi süzgeci
    olcek: 1,
    buyutListe: [],       // büyüt katmanında gezinmek için
    buyutIdx: 0,

    /* ------------------------------ Kurulum ------------------------------ */
    kur() {
        Object.keys(OK_SEKME).forEach(id => this.seritCiz(id));
        this.ciz();
        document.addEventListener('keydown', e => {
            if (document.body.classList.contains('ok-buyut-acik')) {
                if (e.key === 'Escape') this.buyutKapat();
                if (e.key === 'ArrowLeft') this.buyutGez(1);
                if (e.key === 'ArrowRight') this.buyutGez(-1);
            } else if (e.key === 'Escape' && document.body.classList.contains('ok-tam')) {
                this.tamEkran();
            }
        });
    },

    /* Üst şerit: başlık, açıklama ve jetonlar */
    seritCiz(id) {
        const s = OK_SEKME[id], kutu = document.getElementById(id + '-serit');
        if (!kutu) return;
        let jeton;
        if (s.kelime) {
            jeton = ['hepsi', 'hece', 'uzatma', 'cezim', 'sedde'].map(k =>
                `<span class="ok-cip ${this.kural === k ? 'on' : ''}" data-h="${k === 'hepsi' ? 'hepsi' : ''}"
                       onclick="okuma.kuralSec('${k}')">${k === 'hepsi' ? 'Hepsi' : KURAL_ADI[k]}</span>`).join('');
        } else {
            jeton = ['hepsi', 'ustun', 'esre', 'otre'].map(h =>
                `<span class="ok-cip ${this.hareke === h ? 'on' : ''}" data-h="${h}"
                       onclick="okuma.harekeSec('${h}')">${h === 'hepsi' ? 'Hepsi' : HAREKE_ADI[h]}</span>`).join('');
        }
        kutu.innerHTML = `
            <div class="ok-serit-sol">
                <span class="ok-serit-baslik">${s.ad}</span>
                <span class="ok-serit-aciklama">${s.aciklama}${s.not ? ' — ' + s.not : ''}</span>
            </div>
            <div class="ok-serit-sag">${jeton}</div>`;
    },

    /* Aktif sekmenin ızgarasını çizer */
    ciz() {
        const id = this.aktif, s = OK_SEKME[id];
        const tablo = document.getElementById(id + '-tablo');
        if (!tablo) return;
        this.buyutListe = [];

        if (s.kelime) {
            const liste = OK_KELIMELER.filter(k => this.kural === 'hepsi' || k.kural === this.kural);
            tablo.innerHTML = liste.map((k, i) => {
                this.buyutListe.push({ ar: [k.ar], tr: [k.tr], not: KURAL_ADI[k.kural] + ' — ' + k.anlam });
                return `<div class="ok-hucre" onclick="okuma.buyut(${i})">
                    <span class="ok-rozet" data-k="${k.kural}">${KURAL_ADI[k.kural]}</span>
                    <div class="ok-ar"><span class="h-${k.kural === 'uzatma' ? 'med' : k.kural === 'cezim' ? 'cezim' : k.kural === 'sedde' ? 'sedde' : 'ustun'}">${k.ar}</span></div>
                    <div class="ok-tr"><span>${k.tr}</span></div>
                    <div class="ok-kelime-anlam">${k.anlam}</div>
                </div>`;
            }).join('');
            return;
        }

        const harfler = OK_HARFLER.filter(h => s.elifVar || !h.hemze);
        const turler = this.hareke === 'hepsi' ? ['ustun', 'esre', 'otre'] : [this.hareke];
        tablo.innerHTML = harfler.map((h, i) => {
            const okuyuslar = turler.map(t => URETEC[s.uretec](h, t));
            this.buyutListe.push({
                ar: okuyuslar.map(o => `<span class="${o.sinif}">${o.ar}</span>`),
                tr: okuyuslar.map(o => o.tr),
                not: h.tr + ' — ' + s.ad
            });
            return `<div class="ok-hucre" onclick="okuma.buyut(${i})" title="${h.tr}">
                <span class="ok-no">${i + 1}</span>
                <div class="ok-ar">${okuyuslar.map(o => `<span class="${o.sinif}">${o.ar}</span>`).join('')}</div>
                <div class="ok-tr">${okuyuslar.map((o, j) => `<span class="t-${turler[j]}">${o.tr}</span>`).join('')}</div>
                <div class="ok-ad">${h.tr}</div>
            </div>`;
        }).join('');
    },

    /* ------------------------------ Etkileşim ---------------------------- */
    sekme(e, id) {
        if (e) e.preventDefault();
        okSes(600);
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
        const hedef = document.getElementById(id);
        if (hedef) hedef.classList.add('active');
        if (e && e.currentTarget) e.currentTarget.classList.add('active');
        this.aktif = id;
        this.ciz();
    },

    harekeSec(h) {
        okSes(520);
        this.hareke = h;
        Object.keys(OK_SEKME).forEach(id => this.seritCiz(id));
        this.ciz();
    },

    kuralSec(k) {
        okSes(520);
        this.kural = k;
        this.seritCiz('o5');
        this.ciz();
    },

    boyut(yon) {
        okSes(yon > 0 ? 720 : 480);
        this.olcek = Math.min(1.6, Math.max(0.7, +(this.olcek + yon * 0.1).toFixed(2)));
        document.documentElement.style.setProperty('--ok-olcek', this.olcek);
        const g = document.getElementById('ok-boyut');
        if (g) g.textContent = '%' + Math.round(this.olcek * 100);
    },

    tamEkran() {
        okSes(660);
        const acik = document.body.classList.toggle('ok-tam');
        const ico = document.getElementById('ok-tam-ico');
        if (ico) ico.classList.toggle('on', acik);
    },

    /* --------------------------- Büyüt katmanı --------------------------- */
    buyut(i) {
        okSes(760);
        this.buyutIdx = i;
        this.buyutGoster();
        document.body.classList.add('ok-buyut-acik');
    },
    buyutGoster() {
        const v = this.buyutListe[this.buyutIdx];
        if (!v) return;
        document.getElementById('ok-buyut-ar').innerHTML = v.ar.join('');
        document.getElementById('ok-buyut-tr').innerHTML = v.tr.map(t => `<span>${t}</span>`).join('');
        document.getElementById('ok-buyut-not').textContent = v.not || '';
    },
    buyutGez(yon) {
        okSes(560);
        const n = this.buyutListe.length;
        if (!n) return;
        this.buyutIdx = (this.buyutIdx + yon + n) % n;
        this.buyutGoster();
    },
    buyutKapat() {
        okSes(440);
        document.body.classList.remove('ok-buyut-acik');
    }
};

document.addEventListener('DOMContentLoaded', () => okuma.kur());
