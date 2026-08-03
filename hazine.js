/* ============================================================================
   KIDEF ARAPÇA — KÖKLERİN HAZİNESİ  (hazine.js)
   ----------------------------------------------------------------------------
   كَنْزُ الْجُذُورِ — Beytü'l-Hikme'den kalma, beş kadranlı kilidi olan sandık.

   OYUNUN KURALI
   -------------
   Beş kapı vardır. Her kapıda üç bulmaca; üçü de çözülünce kapı bir HARF verir.
   Beş harf yan yana gelince sandık açılır ve içinden şu kelime çıkar:

                            الْعِلْم   (İLİM)

   Bütün cevaplar SAYIDIR — mobilde Arapça klavye gerekmez.

   VERİ KAYNAKLARI (hepsi sitedeki gerçek veriden doğrulandı)
   ----------------------------------------------------------
   KOK_NO / KokNo  -> veri_kok_numaralari.js   (250 kök, sıra no + ebced)
   KALIP_DATA      -> veri_vezin_numaralari.js (105 kalıp)
   KOK_ANLAM       -> bu dosyanın altındaki tablo (veri_kokler.js'ten üretildi)

   BASILI MATERYAL İLE İLİŞKİ
   --------------------------
   Berat PDF'i tek başına çözülemez: ipuçları kâğıtta, cevap anahtarı (kök
   defteri / kalıp cetveli / sîga cetveli) bu sayfadadır. Site de tek başına
   çözülemez: hikâye parçaları kâğıtta tamamlanır.
   ============================================================================ */

(function () {
'use strict';

/* ===========================================================================
   1) SÎGA CETVELİ  (1–14)
   =========================================================================== */
const SIGA_CETVELI = [
    [1,  'هُوَ',      'Müfred Müzekker Gâib'],
    [2,  'هُمَا',      'Tesniye Müzekker Gâib'],
    [3,  'هُمْ',       'Cemi Müzekker Gâib'],
    [4,  'هِيَ',       'Müfred Müennes Gâibe'],
    [5,  'هُمَا',      'Tesniye Müennes Gâibe'],
    [6,  'هُنَّ',       'Cemi Müennes Gâibe'],
    [7,  'أَنْتَ',      'Müfred Müzekker Muhâtab'],
    [8,  'أَنْتُمَا',    'Tesniye Müzekker Muhâtab'],
    [9,  'أَنْتُمْ',     'Cemi Müzekker Muhâtab'],
    [10, 'أَنْتِ',      'Müfred Müennes Muhâtaba'],
    [11, 'أَنْتُمَا',    'Tesniye Müennes Muhâtaba'],
    [12, 'أَنْتُنَّ',     'Cemi Müennes Muhâtaba'],
    [13, 'أَنَا',      'Mütekellim Vahde (ben)'],
    [14, 'نَحْنُ',      'Mütekellim Maalgayr (biz)']
];

/* ===========================================================================
   2) BEŞ KAPI — her biri 3 bulmaca + 1 berat parçası
      Kapıların baş harfleri sırayla:  ا · ل · ع · ل · م   =>  الْعِلْم
      Bütün cevaplar veri üzerinden doğrulanmıştır.
   =========================================================================== */
const KAPILAR = [
    {
        harf: 'ا',
        ar: 'بَابُ الْأَمَانِ',
        tr: 'Emniyet Kapısı',
        kok: 'أمن',
        kokNo: 70,
        ebced: 91,
        berat: 'Bağdat’ta, Beytü’l-Hikme’nin alt katındaki taş odada bir sandık dururdu. ' +
               'Sandığın beş kadranı vardı ve her kadran ayrı bir kapıya bakardı. ' +
               'Kapıları açan anahtar değil, sayıydı.',
        sorular: [
            {
                tip: 'Ebced kilidi',
                metin: 'Bütün defterde ebced değeri <span class="no">422</span> olan yalnız bir kök vardır. ' +
                       'Onu bul ve <b>sıra numarasını</b> yaz.',
                ipucu: 'Kök Defteri sekmesinde arama kutusuna 422 yazman yeter.',
                cevap: 14,
                aciklama: '⁧ك ت ب⁩ — 20 + 400 + 2 = 422. Defterde 14 numaralı köktür.'
            },
            {
                tip: 'Ters yön',
                metin: '<span class="ar">أَمِين</span> kelimesi hangi kalıptandır? <b>Kalıp numarasını</b> yaz.',
                ipucu: 'Kalıp Cetveli’nde فَعِيل veznini ara.',
                cevap: 35,
                aciklama: '⁧فَعِيل⁩ — 35 numaralı kalıp (Sıfat-ı Müşebbehe / Masdar).'
            },
            {
                tip: 'KAPI',
                metin: 'Bu kapının kökü <span class="ar">أمن</span>. ' +
                       '<b>Sıra numarasını</b> kendi <b>ebced değeriyle topla</b>.',
                ipucu: 'Defterde أمن köküne bak: bir sütunda numarası, öbüründe ebcedi yazar.',
                cevap: 161,
                aciklama: '⁧أمن⁩ → sıra no 70, ebced 91. 70 + 91 = 161.'
            }
        ]
    },
    {
        harf: 'ل',
        ar: 'بَابُ اللَّعِبِ',
        tr: 'Oyun Kapısı',
        kok: 'لعب',
        kokNo: 160,
        ebced: 102,
        berat: 'Sandığı yapan usta kapağın içine şunu kazımıştı: ' +
               '“Bu kilit anahtarla açılmaz, sayıyla açılır. Sayıyı bilen, kelimeyi bilendir.”',
        sorular: [
            {
                tip: 'Koordinat avı',
                metin: 'Kök Defteri’nde <span class="no">46</span> numaralı kökün <b>ebced değeri</b> kaçtır?',
                ipucu: 'Arama kutusuna 46 yaz; numara sütununa bak.',
                cevap: 264,
                aciklama: '46 numaralı kök ⁧درس⁩ — ⁧د⁩ 4 + ⁧ر⁩ 200 + ⁧س⁩ 60 = 264.'
            },
            {
                tip: 'Ters yön',
                metin: '<span class="ar">مَلْعَب</span> kelimesi hangi kalıptandır? <b>Kalıp numarasını</b> yaz.',
                ipucu: 'İsm-i zaman / mekân kalıbı: مَفْعَل.',
                cevap: 38,
                aciklama: '⁧مَفْعَل⁩ — 38 numaralı kalıp (İsm-i Zaman / Mekân). ⁧مَلْعَب⁩ = oyun yeri.'
            },
            {
                tip: 'KAPI',
                metin: 'Bu kapının kökü <span class="ar">لعب</span>. ' +
                       '<b>Sıra numarasından ebced değerini çıkar.</b>',
                ipucu: 'Büyük olandan küçüğü çıkaracaksın.',
                cevap: 58,
                aciklama: '⁧لعب⁩ → sıra no 160, ebced 102. 160 − 102 = 58.'
            }
        ]
    },
    {
        harf: 'ع',
        ar: 'بَابُ الْعِلْمِ',
        tr: 'İlim Kapısı',
        kok: 'علم',
        kokNo: 15,
        ebced: 140,
        berat: 'Kâtipler her köke bir numara verdiler; numaralar kaymasın diye ' +
               'yeni kökleri hep listenin sonuna eklediler. ' +
               'Böylece kâğıda basılan her sayı, yüzyıllar sonra bile aynı kapıyı gösterdi.',
        sorular: [
            {
                tip: 'Ebced kilidi',
                metin: 'Ebced değeri <span class="no">140</span> olan <b>iki</b> kök vardır: ' +
                       '<span class="ar">علم</span> ve <span class="ar">عمل</span>. ' +
                       '<b>Sıra numaralarını topla.</b>',
                ipucu: 'Ebced harflerin sırasına bakmaz; aynı harfler aynı değeri verir.',
                cevap: 59,
                aciklama: '⁧علم⁩ = 15, ⁧عمل⁩ = 44. 15 + 44 = 59.'
            },
            {
                tip: 'Ters yön',
                metin: '<span class="ar">مُعَلِّم</span> kelimesi hangi kalıptandır? <b>Kalıp numarasını</b> yaz.',
                ipucu: 'Tef‘îl babının ism-i fâili: مُفَعِّل.',
                cevap: 62,
                aciklama: '⁧مُفَعِّل⁩ — 62 numaralı kalıp (Tef‘îl Babı İsm-i Fâil).'
            },
            {
                tip: 'KAPI',
                metin: '<span class="ar">تَعْلِيم</span> kelimesinin kalıp numarası ile ' +
                       '<span class="ar">عَلَّمَ</span> kelimesinin kalıp numarasını <b>topla</b>.',
                ipucu: 'Biri masdar (تَفْعِيل), öbürü mazi (فَعَّلَ). İkisi de Tef‘îl babındandır.',
                cevap: 119,
                aciklama: '⁧تَفْعِيل⁩ = 61, ⁧فَعَّلَ⁩ = 58. 61 + 58 = 119.'
            }
        ]
    },
    {
        harf: 'ل',
        ar: 'بَابُ اللَّحَاقِ',
        tr: 'Yetişme Kapısı',
        kok: 'لحق',
        kokNo: 138,
        ebced: 138,
        berat: 'Yıllar sonra sandık kayboldu; geriye yalnız bu berat kaldı. ' +
               'Beratın kenarında ince bir yazıyla şu satır duruyordu: ' +
               '“Beş kapının ilk harflerini yan yana koy.”',
        sorular: [
            {
                tip: 'Koordinat avı',
                metin: 'Defterdeki <b>en küçük ebced değeri 7</b>’dir. ' +
                       'O kökün <b>sıra numarasını</b> yaz.',
                ipucu: 'Ebced sütununu küçükten büyüğe düşün: ب 2 + د 4 + hemze 1.',
                cevap: 210,
                aciklama: '⁧بدأ⁩ — 2 + 4 + 1 = 7. Defterde 210 numaralı köktür.'
            },
            {
                tip: 'Koordinat avı',
                metin: 'Defterdeki <b>en büyük ebced değeri 1330</b>’dur. ' +
                       'O kökün <b>sıra numarasını</b> yaz.',
                ipucu: 'İçinde غ (1000) geçen bir kök arıyorsun.',
                cevap: 179,
                aciklama: '⁧شغل⁩ — ⁧ش⁩ 300 + ⁧غ⁩ 1000 + ⁧ل⁩ 30 = 1330. Defterde 179 numaralı köktür.'
            },
            {
                tip: 'KAPI',
                metin: '250 kök içinde <b>sıra numarası ile ebced değeri birbirine eşit</b> olan ' +
                       '<b>tek</b> bir kök vardır. O sayıyı yaz.',
                ipucu: 'Bu kapının adı sana kökü söylüyor: لحق.',
                cevap: 138,
                aciklama: '⁧لحق⁩ → sıra no 138, ebced 30 + 8 + 100 = 138. Defterdeki tek kesişme.'
            }
        ]
    },
    {
        harf: 'م',
        ar: 'بَابُ التَّمْكِينِ',
        tr: 'Yerleştirme Kapısı',
        kok: 'مكن',
        kokNo: 49,
        ebced: 110,
        berat: 'Sandığın içinde altın yoktu. İçinde tek bir kelime vardı — ' +
               've o kelime, onu arayanı zengin ederdi.',
        sorular: [
            {
                tip: 'Ters yön',
                metin: '<span class="ar">مَكَان</span> kelimesi hangi kalıptandır? <b>Kalıp numarasını</b> yaz.',
                ipucu: 'Kalıp Cetveli’nde فَعَال veznini ara.',
                cevap: 22,
                aciklama: '⁧فَعَال⁩ — 22 numaralı kalıp (Masdar).'
            },
            {
                tip: 'Koordinat avı',
                metin: '<span class="ar">كَتَبْتِ</span> kelimesinin adresi ' +
                       '<span class="no">014 · 001 · ?</span> biçimindedir. ' +
                       'Sondaki <b>sîga numarasını</b> yaz.',
                ipucu: 'Sîga Cetveli’nde أَنْتِ zamirini bul.',
                cevap: 10,
                aciklama: '⁧أَنْتِ⁩ = 10 numaralı sîga (Müfred Müennes Muhâtaba).'
            },
            {
                tip: 'KAPI',
                metin: 'Bu kapının kökü <span class="ar">مكن</span>. ' +
                       '<b>Ebced değeri ile sıra numarasının farkını</b> yaz.',
                ipucu: 'م 40 + ك 20 + ن 50 … sonra defterdeki numarasını çıkar.',
                cevap: 61,
                aciklama: '⁧مكن⁩ → ebced 110, sıra no 49. 110 − 49 = 61.'
            }
        ]
    }
];

const SON_KELIME  = 'الْعِلْم';
const SON_ANLAM   = 'İLİM — Hazine buydu.';
const SON_BERAT   = 'Sandık açıldı. İçinde ne altın vardı ne mücevher; ' +
                    'yalnızca beş harften kurulmuş bir kelime: الْعِلْم. ' +
                    'Onu bulan, sandığı taşımaya gerek duymaz — çünkü hazine artık onunla birlikte yürür.';

/* ===========================================================================
   3) DURUM (localStorage)
   =========================================================================== */
const ANAHTAR = 'kidef_hazine_v1';
let durum = { cozulen: {} };   /* cozulen["k0s2"] = true */

function durumYukle() {
    try {
        const ham = localStorage.getItem(ANAHTAR);
        if (ham) {
            const o = JSON.parse(ham);
            if (o && typeof o === 'object' && o.cozulen) durum = o;
        }
    } catch (e) { /* sessiz geç */ }
}
function durumKaydet() {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(durum)); } catch (e) {}
}
function soruKey(ki, si) { return 'k' + ki + 's' + si; }
function soruCozuldu(ki, si) { return !!durum.cozulen[soruKey(ki, si)]; }
function kapiTamam(ki) {
    return KAPILAR[ki].sorular.every(function (_, si) { return soruCozuldu(ki, si); });
}
function kapiAcik(ki) {
    /* ilk kapı hep açık; sonrakiler bir öncekini bekler */
    return ki === 0 ? true : kapiTamam(ki - 1);
}
function hepsiTamam() { return KAPILAR.every(function (_, i) { return kapiTamam(i); }); }

/* ===========================================================================
   4) YARDIMCILAR
   =========================================================================== */
function el(id) { return document.getElementById(id); }
function kacir(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function sadeAra(s) {
    return String(s || '')
        .toLocaleLowerCase('tr')
        .replace(/[ً-ْٰـ]/g, '')   /* hareke + tatvil */
        .replace(/\s+/g, ' ')
        .trim();
}
function ebcedHesap(kok) {
    if (typeof KokNo !== 'undefined' && KokNo && typeof KokNo.ebced === 'function') {
        return KokNo.ebced(kok);
    }
    return 0;
}

/* Kök listesi: KOK_NO'daki yazım sırası = KOK_ANLAM sırası */
let KOK_LISTE = [];
function kokListeKur() {
    const tablo = (typeof KOK_NO !== 'undefined') ? KOK_NO : null;
    if (!tablo) return;
    Object.keys(tablo).forEach(function (kok) {
        const n = tablo[kok];
        const a = KOK_ANLAM[n - 1] || ['', ''];
        KOK_LISTE.push({ n: n, kok: kok, eb: ebcedHesap(kok), ar: a[0], tr: a[1] });
    });
    KOK_LISTE.sort(function (a, b) { return a.n - b.n; });
}

/* ===========================================================================
   5) MACERA GÖRÜNÜMÜ
   =========================================================================== */
function kadranlariCiz() {
    const kap = el('hz-kadranlar');
    if (!kap) return;
    kap.innerHTML = KAPILAR.map(function (k, i) {
        const acik = kapiTamam(i);
        return '<div class="hz-kadran' + (acik ? ' acik' : '') + '" dir="rtl">' +
               (acik ? kacir(k.harf) : '؟') + '</div>';
    }).join('');

    const sandik = el('hz-sandik');
    const not = el('hz-sandik-not');
    if (hepsiTamam()) {
        sandik.classList.add('acildi');
        not.textContent = 'Sandık açıldı. Berat tamamlandı.';
        not.classList.add('zafer');
    } else {
        sandik.classList.remove('acildi');
        const kalan = KAPILAR.filter(function (_, i) { return !kapiTamam(i); }).length;
        not.textContent = kalan + ' kapı daha açılacak. Harfler yan yana gelince sandık açılır.';
        not.classList.remove('zafer');
    }
}

function kapilariCiz() {
    const kap = el('hz-kapilar');
    if (!kap) return;
    kap.innerHTML = KAPILAR.map(function (k, i) {
        const tamam = kapiTamam(i);
        const acik = kapiAcik(i);
        const cozulen = k.sorular.filter(function (_, si) { return soruCozuldu(i, si); }).length;
        let durumMetin;
        if (tamam) durumMetin = 'Açıldı ✓';
        else if (!acik) durumMetin = 'Kilitli';
        else durumMetin = cozulen + ' / ' + k.sorular.length;

        return '<button type="button" class="hz-kapi' +
               (tamam ? ' tamam' : '') + (acik ? '' : ' kilitli') + '" data-kapi="' + i + '"' +
               (acik ? '' : ' disabled') + '>' +
               '<span class="hz-kapi-no" dir="ltr">' + (i + 1) + '</span>' +
               '<span class="hz-kapi-harf" dir="rtl">' + (tamam ? kacir(k.harf) : '؟') + '</span>' +
               '<span class="hz-kapi-ad" dir="rtl">' + kacir(k.ar) + '</span>' +
               '<span class="hz-kapi-alt">' + kacir(k.tr) + '</span>' +
               '<span class="hz-kapi-durum">' + durumMetin + '</span>' +
               '</button>';
    }).join('');

    Array.prototype.forEach.call(kap.querySelectorAll('.hz-kapi'), function (b) {
        b.addEventListener('click', function () {
            const i = parseInt(b.dataset.kapi, 10);
            if (kapiAcik(i)) pencereAc(i);
        });
    });
}

function beratCiz() {
    const kap = el('hz-berat-metin');
    if (!kap) return;
    let html = KAPILAR.map(function (k, i) {
        const tamam = kapiTamam(i);
        const govde = tamam
            ? kacir(k.berat)
            : '… bu satır ' + kacir(k.ar) + ' açılınca okunacak …';
        return '<div class="hz-berat-satir' + (tamam ? '' : ' gizli') + '">' +
               '<span class="hz-berat-no" dir="ltr">' + (i + 1) + '</span>' +
               '<span class="hz-berat-govde">' + govde + '</span>' +
               '</div>';
    }).join('');

    if (hepsiTamam()) {
        html += '<div class="hz-berat-satir">' +
                '<span class="hz-berat-no" dir="ltr">★</span>' +
                '<span class="hz-berat-govde">' + kacir(SON_BERAT) + '</span>' +
                '</div>' +
                '<div class="hz-berat-son">' +
                '<span class="kelime" dir="rtl">' + kacir(SON_KELIME) + '</span>' +
                '<span class="cev">' + kacir(SON_ANLAM) + '</span>' +
                '</div>';
    }
    kap.innerHTML = html;
}

function maceraCiz() {
    kadranlariCiz();
    kapilariCiz();
    beratCiz();
}

/* ===========================================================================
   6) BULMACA PENCERESİ
   =========================================================================== */
let acikKapi = -1;

function pencereAc(ki) {
    acikKapi = ki;
    const k = KAPILAR[ki];
    el('hz-kapi-ar').textContent = k.ar;
    el('hz-kapi-tr').textContent = k.tr + ' — kök: ' + k.kok;

    el('hz-sorular').innerHTML = k.sorular.map(function (s, si) {
        const cozuldu = soruCozuldu(ki, si);
        const kapiSoru = (s.tip === 'KAPI');
        return '<div class="hz-soru' + (cozuldu ? ' cozuldu' : '') + '" id="soru-' + si + '">' +
               '<div class="hz-soru-ust">' +
                 '<span class="hz-soru-rozet' + (kapiSoru ? ' kapi' : '') + '">' +
                    (kapiSoru ? 'KAPI SORUSU' : kacir(s.tip)) + '</span>' +
                 '<span class="hz-soru-tik">✓</span>' +
               '</div>' +
               '<div class="hz-soru-metin">' + s.metin + '</div>' +
               (cozuldu
                 ? '<div class="hz-geri-bildirim dogru">Doğru — ' + kacir(s.aciklama) + '</div>'
                 : '<div class="hz-cevap-satir">' +
                     '<input type="text" inputmode="numeric" pattern="[0-9]*" class="hz-cevap" ' +
                            'id="cevap-' + si + '" placeholder="sayı" maxlength="6" autocomplete="off">' +
                     '<button type="button" class="hz-dene" data-soru="' + si + '">Dene</button>' +
                     '<button type="button" class="hz-ipucu-btn" data-ipucu="' + si + '">İpucu</button>' +
                   '</div>' +
                   '<div class="hz-ipucu" id="ipucu-' + si + '" hidden>' + kacir(s.ipucu) + '</div>' +
                   '<div class="hz-geri-bildirim" id="bildirim-' + si + '"></div>'
               ) +
               '</div>';
    }).join('');

    const sorularKap = el('hz-sorular');
    Array.prototype.forEach.call(sorularKap.querySelectorAll('.hz-dene'), function (b) {
        b.addEventListener('click', function () { cevapDene(ki, parseInt(b.dataset.soru, 10)); });
    });
    Array.prototype.forEach.call(sorularKap.querySelectorAll('.hz-ipucu-btn'), function (b) {
        b.addEventListener('click', function () {
            const ip = el('ipucu-' + b.dataset.ipucu);
            if (ip) ip.hidden = !ip.hidden;
        });
    });
    Array.prototype.forEach.call(sorularKap.querySelectorAll('.hz-cevap'), function (inp) {
        inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                cevapDene(ki, parseInt(inp.id.split('-')[1], 10));
            }
        });
    });

    parcaGuncelle(ki);
    el('hz-perde').hidden = false;
    document.body.style.overflow = 'hidden';
}

function pencereKapat() {
    el('hz-perde').hidden = true;
    document.body.style.overflow = '';
    acikKapi = -1;
    maceraCiz();
}

function parcaGuncelle(ki) {
    const p = el('hz-parca');
    if (!p) return;
    if (kapiTamam(ki)) {
        const k = KAPILAR[ki];
        p.innerHTML = kacir(k.berat) +
                      '<span class="harf" dir="rtl">' + kacir(k.harf) + '</span>';
        p.hidden = false;
    } else {
        p.hidden = true;
    }
}

function cevapDene(ki, si) {
    const s = KAPILAR[ki].sorular[si];
    const inp = el('cevap-' + si);
    const bil = el('bildirim-' + si);
    const kutu = el('soru-' + si);
    if (!inp || !bil || !kutu) return;

    const ham = (inp.value || '').replace(/[^0-9]/g, '');
    if (!ham) {
        bil.textContent = 'Önce bir sayı yaz.';
        bil.className = 'hz-geri-bildirim yanlis';
        return;
    }

    if (parseInt(ham, 10) === s.cevap) {
        durum.cozulen[soruKey(ki, si)] = true;
        durumKaydet();
        kutu.classList.add('cozuldu');
        const satir = kutu.querySelector('.hz-cevap-satir');
        const ipk = el('ipucu-' + si);
        if (satir) satir.remove();
        if (ipk) ipk.remove();
        bil.textContent = 'Doğru — ' + s.aciklama;
        bil.className = 'hz-geri-bildirim dogru';
        parcaGuncelle(ki);
        kadranlariCiz();
    } else {
        bil.textContent = 'Olmadı. Cetvellere bir daha bak.';
        bil.className = 'hz-geri-bildirim yanlis';
        kutu.classList.remove('sallan');
        void kutu.offsetWidth;
        kutu.classList.add('sallan');
        inp.select();
    }
}

/* ===========================================================================
   7) KÖK DEFTERİ
   =========================================================================== */
function defterCiz(filtre) {
    const govde = el('hz-defter-govde');
    const sayac = el('hz-sayac');
    if (!govde) return;

    const f = sadeAra(filtre);
    const liste = !f ? KOK_LISTE : KOK_LISTE.filter(function (r) {
        return String(r.n) === f ||
               String(r.n).indexOf(f) === 0 ||
               String(r.eb) === f ||
               sadeAra(r.kok).indexOf(f) !== -1 ||
               sadeAra(r.ar).indexOf(f) !== -1 ||
               sadeAra(r.tr).indexOf(f) !== -1;
    });

    if (!liste.length) {
        govde.innerHTML = '<tr><td colspan="5" class="hz-bos">Bu aramaya uyan kök yok.</td></tr>';
    } else {
        govde.innerHTML = liste.map(function (r) {
            return '<tr>' +
                '<td class="hz-hucre-no">' + String(r.n).padStart(3, '0') + '</td>' +
                '<td class="hz-hucre-ar">' + kacir(r.kok) + '</td>' +
                '<td class="hz-hucre-eb">' + r.eb + '</td>' +
                '<td class="hz-hucre-ar hz-hucre-kelime">' + kacir(r.ar) + '</td>' +
                '<td>' + kacir(r.tr) + '</td>' +
            '</tr>';
        }).join('');
    }
    if (sayac) sayac.textContent = liste.length + ' / ' + KOK_LISTE.length + ' kök';
}

/* ===========================================================================
   8) KALIP CETVELİ
   =========================================================================== */
let KALIP_LISTE = [];
function kalipListeKur() {
    if (typeof KALIP_DATA === 'undefined' || !KALIP_DATA) return;
    Object.keys(KALIP_DATA).forEach(function (n) {
        const d = KALIP_DATA[n];
        KALIP_LISTE.push({ n: parseInt(n, 10), ar: d.ar || '', tr: d.tr || '' });
    });
    KALIP_LISTE.sort(function (a, b) { return a.n - b.n; });
}

function kalipCiz(filtre) {
    const govde = el('hz-kalip-govde');
    const sayac = el('hz-sayac-kalip');
    if (!govde) return;

    const f = sadeAra(filtre);
    const liste = !f ? KALIP_LISTE : KALIP_LISTE.filter(function (r) {
        return String(r.n) === f ||
               String(r.n).indexOf(f) === 0 ||
               sadeAra(r.ar).indexOf(f) !== -1 ||
               sadeAra(r.tr).indexOf(f) !== -1;
    });

    if (!liste.length) {
        govde.innerHTML = '<tr><td colspan="3" class="hz-bos">Bu aramaya uyan kalıp yok.</td></tr>';
    } else {
        govde.innerHTML = liste.map(function (r) {
            return '<tr>' +
                '<td class="hz-hucre-no">' + String(r.n).padStart(3, '0') + '</td>' +
                '<td class="hz-hucre-ar">' + kacir(r.ar) + '</td>' +
                '<td>' + kacir(r.tr) + '</td>' +
            '</tr>';
        }).join('');
    }
    if (sayac) sayac.textContent = liste.length + ' / ' + KALIP_LISTE.length + ' kalıp';
}

/* ===========================================================================
   9) SÎGA CETVELİ
   =========================================================================== */
function sigaCiz() {
    const govde = el('hz-siga-govde');
    if (!govde) return;
    govde.innerHTML = SIGA_CETVELI.map(function (r) {
        return '<tr>' +
            '<td class="hz-hucre-no">' + String(r[0]).padStart(2, '0') + '</td>' +
            '<td class="hz-hucre-ar">' + kacir(r[1]) + '</td>' +
            '<td>' + kacir(r[2]) + '</td>' +
        '</tr>';
    }).join('');
}

/* ===========================================================================
   10) SEKMELER + BAŞLATMA
   =========================================================================== */
function sekmeleriKur() {
    const btns = document.querySelectorAll('.hz-sek');
    Array.prototype.forEach.call(btns, function (b) {
        b.addEventListener('click', function () {
            Array.prototype.forEach.call(btns, function (x) { x.classList.remove('aktif'); });
            b.classList.add('aktif');
            Array.prototype.forEach.call(document.querySelectorAll('.hz-gorunum'), function (g) {
                g.classList.remove('aktif');
            });
            const hedef = el('gorunum-' + b.dataset.gorunum);
            if (hedef) hedef.classList.add('aktif');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function baslat() {
    durumYukle();
    kokListeKur();
    kalipListeKur();

    sekmeleriKur();
    maceraCiz();
    defterCiz('');
    kalipCiz('');
    sigaCiz();

    const ara = el('hz-ara');
    if (ara) ara.addEventListener('input', function () { defterCiz(ara.value); });
    const araK = el('hz-ara-kalip');
    if (araK) araK.addEventListener('input', function () { kalipCiz(araK.value); });

    const kapat = el('hz-kapat');
    if (kapat) kapat.addEventListener('click', pencereKapat);
    const perde = el('hz-perde');
    if (perde) perde.addEventListener('click', function (e) {
        if (e.target === perde) pencereKapat();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && acikKapi >= 0) pencereKapat();
    });

    const sif = el('hz-sifirla');
    if (sif) sif.addEventListener('click', function () {
        if (sif.dataset.onay === '1') {
            durum = { cozulen: {} };
            durumKaydet();
            sif.textContent = 'Baştan başla';
            delete sif.dataset.onay;
            maceraCiz();
        } else {
            sif.dataset.onay = '1';
            sif.textContent = 'Emin misin? (tekrar bas)';
            setTimeout(function () {
                if (sif.dataset.onay === '1') {
                    delete sif.dataset.onay;
                    sif.textContent = 'Baştan başla';
                }
            }, 4000);
        }
    });
}

/* ===========================================================================
   11) KÖK ANLAM TABLOSU — veri_kokler.js yazım sırası (1–250)
        Her satır: [temsilci kelime, Türkçe anlam]
        Sıra KOK_NO ile birebir aynıdır; SONA EKLE, ARAYA GİRME.
   =========================================================================== */
const KOK_ANLAM = [
    ["نَاوَلَ","Verdi / Uzattı / Sundu"], ["أَنْصَفَ","İnsaflı davrandı / Adil oldu"],
    ["كَفَرَ","İnkar etti / Örttü / Nankörlük etti."], ["بَرِئَ","Masum oldu / Kurtuldu / İyileşti."],
    ["عَهِدَ","Söz verdi / Ant içti."], ["عَشَّرَ","Ona tamamladı / Öşür (onda bir) aldı."],
    ["تَسَّعَ","Dokuza tamamladı / Dokuz yaptı."], ["ثَمَّنَ","Fiyat biçti / Değerlendirdi."],
    ["ثَنَى","İkiye katladı / Büktü."], ["ثَلَّثَ","Üçledi / Üçe böldü."],
    ["أَثَّرَ","Etkiledi / Tesir etti."], ["أَلِفَ","Alıştı / Kaynaştı / Uyum sağladı."],
    ["أَذِنَ","İzin verdi."], ["كَتَبَ","Yazdı."],
    ["عَلِمَ","Bildi / Öğrendi."], ["قَدَرَ","Ölçtü / Güç yetirdi."],
    ["كَمَّلَ","Eksiksiz yaptı / Mükemmelleştirdi."], ["مَلَك","Melek."],
    ["حَكَمَ","Hükmetti / Karar verdi."], ["عَرَفَ","Bildi / Tanıdı"],
    ["رَحِمَ","Merhamet etti / Acıdı."], ["سَلِمَ","Kurtuldu / Güvende oldu."],
    ["أَخْبَرَ","Haber verdi / Bildirdi."], ["فَتَحَ","Açtı / Fethetti."],
    ["نَظَّمَ","Düzenledi / Organize etti."], ["شَهِدَ","Şahit oldu / Gördü."],
    ["خَلَقَ","Yarattı."], ["سَجَدَ","Secde etti."],
    ["صَدَقَ","Doğru söyledi."], ["حَسَدَ","Kıskandı / Haset etti."],
    ["دَخَلَ","Girdi."], ["رَكِبَ","Bindi."],
    ["نَقَلَ","Taşıdı / Nakletti."], ["شَرِبَ","İçti."],
    ["رَاعَ","Hayran bıraktı / Korkuttu."], ["سَافَرَ","Yolculuk yaptı / Sefere çıktı."],
    ["سَاحَ","Gezdi / Seyahat etti."], ["عَقَلَ","Akıl etti / Anladı. (Kök anlamı: Deveyi bağlamak. Akıl da sahibini tehlikeden koruyup bağlar.)"],
    ["عِصْمَة","İsmet / Günahsızlık."], ["قَرُبَ","Yakın oldu."],
    ["طَبَّقَ","Tatbik etti / Uyguladı."], ["خَلَفَ","Arkada kaldı / Halef oldu."],
    ["خَرَجَ","Çıktı."], ["عَمِلَ","Çalıştı / Yaptı."],
    ["اِسْتَيْقَظَ","Uyandı."], ["دَرَسَ","Ders çalıştı / Okudu."],
    ["حَفِظَ","Korudu / Ezberledi."], ["نَظَرَ","Baktı."],
    ["مَكُنَ","Güçlü / Sağlam oldu."], ["حَسُنَ","Güzel oldu."],
    ["سَدَّسَ","Altıladı / Altıya böldü."], ["سَعِدَ","Mutlu oldu."],
    ["جَهِلَ","Bilmedi / Cahil kaldı."], ["سَكَنَ","Sakinleşti / İkamet etti."],
    ["جَهَدَ","Çaba gösterdi."], ["رَجَعَ","Döndü."],
    ["شَكَلَ","Şekillendirdi."], ["نَاسَبَ","Uygun oldu."],
    ["حَصَلَ","Meydana geldi / Elde etti."], ["بَرَّكَ","Tebrik etti / Hayır duası etti."],
    ["بَقِيَ","Kaldı / Devam etti / Sona ermedi."], ["بَصِرَ","Gördü / İdrak etti / Farkına vardı."],
    ["أَرْسَلَ","Gönderdi."], ["نَصْر","Yardım / Zafer."],
    ["حَمَلَ","Taşıdı / Yüklendi."], ["حَقَّقَ","Gerçekleştirdi."],
    ["أَخْلَصَ","İhlâs etti / Samimi oldu."], ["خَمَّسَ","Beşledi / Beşe böldü."],
    ["رَشَّدَ","İrşad etti / Doğru yola iletti."], ["أَمِنَ","Güvende oldu / Emin oldu."],
    ["جَمَعَ","Topladı / Bir araya getirdi."], ["حَمَّدَ","Çokça övdü / Hamdetti."],
    ["شَهَّرَ","Teşhir etti / Meşhur yaptı."], ["شَكَرَ","Şükretti / Teşekkür etti."],
    ["فَكَّرَ","Düşündü / Fikir yürüttü."], ["وَكَّلَ","Vekil tayin etti / Havale etti."],
    ["قَدَّمَ","Takdim etti / Sundu."], ["كَبَّرَ","Tekbir getirdi / Büyükledi."],
    ["عَدَّلَ","Tadil etti / Değiştirdi."], ["فَعَلَ","Yaptı / Eyledi."],
    ["شَدَّ","Sıktı / Bağladı."], ["أَكَلَ","Yedi."],
    ["سَأَلَ","Sordu / İstedi."], ["قَالَ","Dedi / Söyledi."],
    ["بَاعَ","Sattı."], ["دَعَا","Davet etti / Dua etti."],
    ["مَشَى","Yürüdü."], ["رَضِيَ","Razı oldu."],
    ["وَقَى","Korudu."], ["عَدَّ","Saydı."],
    ["صَلَّى","Namaz kıldı / Dua etti."], ["سَوِيَ","Düzgün oldu / Değerinde oldu."],
    ["وَصَلَ","Ulaştı / Vardı."], ["خَيْر","İyilik / Hayır / Daha iyi."],
    ["تَوَضَّأَ","Abdest aldı."], ["تَعَاوَنَ","Yardımlaştı."],
    ["اِسْتَوْفَى","Tamamını aldı / Yerine getirdi."], ["وَجَدَ","Buldu."],
    ["قَرَأَ","Okudu."], ["حَرُمَ","Haram oldu / Yasaklandı."],
    ["عَرَضَ","Sunduk / Gösterdi (Arz etti)."], ["قَبِلَ","Kabul etti."],
    ["كَرُمَ","Cömert oldu / Değerli oldu."], ["عَبَرَ","Geçti / Karşıya geçti."],
    ["عَمَرَ","İmar etti / Şenlendirdi."], ["لَزِمَ","Gerekti / (Bir yerden) Ayrılmadı."],
    ["لَبِسَ","Giydi."], ["لَفَظَ","Ağzından çıkardı / Söyledi."],
    ["هَدَى","Doğru yolu gösterdi / Kılavuzluk etti."], ["هَجَرَ","Terk etti / Bıraktı."],
    ["هَمَّ","Niyetlendi / Dert edindi."], ["أَيْقَنَ","Kesin olarak inandı."],
    ["يَسَّرَ","Kolaylaştırdı."], ["يُتْم","Yütm / Yetimlik / Kimsesizlik."],
    ["بَحَثَ","Aradı / Araştırdı / Bahsetti."], ["تَرَكَ","Terk etti / Bıraktı."],
    ["تَبِعَ","Tabi oldu / İzledi / Uydu."], ["تَجَرَ","Ticaret yaptı."],
    ["ثَبَتَ","Sabit oldu / Yerinde durdu / Kanıtlandı."], ["ثَمَرَ","Meyve verdi / Ürün verdi."],
    ["ثَقُلَ","Ağır oldu / Ağır geldi."], ["ذَكَرَ","Hatırladı / Andı."],
    ["ذَهَبَ","Gitti."], ["ذَاقَ","Tattı."],
    ["زَرَعَ","Ekti / Biçti."], ["صَوَّرَ","Şekil verdi / Tasvir etti / Biçimlendirdi."],
    ["رَتَّبَ","Düzenledi"], ["زَارَ","Ziyaret etti / Uğradı."],
    ["نَفَعَ","Fayda verdi / Yarar sağladı."], ["نَطَقَ","Konuştu / Telaffuz etti / Dile getirdi."],
    ["سَرُعَ","Hızlı oldu / Çabuklaştı."], ["نَارَ","Işık saçtı / Aydınlattı."],
    ["ظُلْم","Zulüm / Haksızlık. (Kökü karanlık anlamındaki 'Zulmet'tir. Hakkı karanlıkta bırakmaktır.)"], ["نَفْس","Nefs / Can, kendi, ruh."],
    ["جَرَى","Aktı / Koştu / Meydana geldi."], ["حَضَرَ","Geldi / Hazır bulundu / İştirak etti."],
    ["صَحِبَ","Arkadaş oldu / Eşlik etti."], ["لَحِقَ","Yetişti / Peşine takıldı / Eklendi."],
    ["طَلَبَ","İstedi / Talep etti."], ["أَصْلَحَ","Islah etti / Düzeltti / Onardı."],
    ["بَيَّنَ","Açıkladı / Beyan etti."], ["وَقَفَ","Durdu / Vakfetti."],
    ["خَدَمَ","Hizmet etti / İlgilendi / Çalıştı."], ["غَفَلَ","Habersiz oldu / İhmal etti / Gafil avlandı."],
    ["حَزِنَ","Üzüldü / Kederlendi."], ["مَاتَ","Öldü."],
    ["طَرَدَ","Kovdu / Uzaklaştırdı."], ["خَصَّ","Özel oldu / Has kıldı / Ayırdı."],
    ["شَعَرَ","Hissetti / Farkına vardı."], ["حَبَّبَ","Sevdirdi."],
    ["حَاسَبَ","Muhasebe etti / Hesap sordu."], ["عَادَ","Döndü / Geri geldi."],
    ["قَامَ","Kalktı / Ayağa kalktı / Durdu."], ["رَسَمَ","Çizdi / Resmetti / Kural koydu."],
    ["نَصَحَ","Öğüt verdi / Nasihat etti."], ["سَبَّعَ","Yediledi / Yediye böldü."],
    ["سَبَقَ","Öne geçti / Geride bıraktı / Önce oldu."], ["صَابَ","Hedefi buldu / İsabet etti / Doğru oldu."],
    ["رَزَقَ","Rızık verdi / Nimetlendirdi."], ["لَعِبَ","Oynadı."],
    ["صَبَرَ","Sabretti / Dayandı."], ["غَابَ","Kayıp oldu / Gözden kayboldu / Uzaklaştı."],
    ["ضَرَّ","Zarar verdi."], ["ظَنَّ","Zannetti / Sandı."],
    ["أَنْتَجَ","Üretti."], ["ثَقَّفَ","Eğitti / Kültürlendirdi."],
    ["تَوَجَّهَ","Yöneldi / Yüzünü döndü."], ["ضَرَبَ","Vurdu / Örnek verdi / Çarptı."],
    ["جَمُلَ","Güzel oldu / Bütünleşti / Toplandı."], ["حَيِيَ","Yaşadı / Diri oldu."],
    ["طَلَعَ","Doğdu / Ortaya çıktı."], ["عَمَّ","Kapsadı / Yaygınlaştı / Genel oldu."],
    ["ضَلَّ","Saptı / Yolunu kaybetti."], ["حَرَّكَ","Hareket ettirdi / Kımıldattı."],
    ["رَاحَ","Gitti (Özellikle akşam vakti esinti çıkınca dönüşe geçmek/gitmek)."], ["عَبَدَ","Kulluk etti / İbadet etti."],
    ["صَنَعَ","Yaptı / Üretti."], ["ضَمِنَ","Garanti etti / Kefil oldu."],
    ["أَشْغَلَ","İşgal etti / Meşgul etti."], ["وَزَنَ","Tarttı / Ölçtü."],
    ["قَسَمَ","Böldü / Paylaştırdı."], ["عَقَدَ","Bağladı / Düğümledi / Sözleşme yaptı."],
    ["دَفَعَ","İtti / Savuşturdu / Ödedi."], ["غَلَبَ","Yendi / Üstün geldi."],
    ["غَفَرَ","Bağışladı / Örttü (günahları)."], ["جَلَسَ","Oturdu."],
    ["قَطَعَ","Kesti / Kopardı / Aştı."], ["وَثَّقَ","Belgeledi / Tevsik etti."],
    ["شَارَكَ","Katıldı / Paylaştı."], ["عَفَا","Affetti / Bağışladı / Silip yok etti."],
    ["ظَفِرَ","Başardı / Galip geldi / Elde etti."], ["قَدَّسَ","Kutsal kıldı / Noksanlıklardan tenzih etti (Takdis etti)."],
    ["زَحْمَة","Zahmet / Sıkışıklık."], ["سَمِعَ","İşitti / Duydu."],
    ["نَسِيَ","Unuttu."], ["صَفَا","Berraklaştı / Arındı."],
    ["غَرَبَ","Battı (Güneş vb.) / Uzaklaştı."], ["قَلَبَ","Çevirdi / Alt üst etti."],
    ["وَصَّى","Tavsiye etti / (Şiddetle) Öğütledi."], ["نَزَلَ","İndi / Konakladı."],
    ["رَجَا","Umdu / Rica etti / Yalvardı."], ["كَلَّمَ","Konuştu / Hitap etti."],
    ["ظَهَرَ","Göründü / Ortaya çıktı."], ["رَفَعَ","Kaldırdı / Yükseltti / Yüceltti."],
    ["فَضَّلَ","Tercih Etti"], ["تَفَرَّدَ","Eşsiz oldu / Benzersiz oldu / Tek kaldı."],
    ["فَهِمَ","Anladı / Kavradı."], ["سَمَحَ","İzin verdi / Hoşgördü."],
    ["أَمَرَ","Emretti / Buyurdu."], ["بَدَأَ","Başladı."],
    ["أَخَذَ","Aldı / Tuttu."], ["خَطِئَ","Hata yaptı / Yanıldı / Günah işledi."],
    ["شَرَقَ","Doğdu."], ["صَغُرَ","Küçük oldu."],
    ["خَفَّ","Hafifledi."], ["غَلَا","Pahalı oldu."],
    ["رَخُصَ","Ucuz oldu."], ["طَارَ","Uçtu."],
    ["سَارَ","Yürüdü / Gitti."], ["قَطَرَ","Damladı."],
    ["طِبّ","Tıp."], ["حَدَثَ","Meydana geldi / Oldu."],
    ["بَطُؤَ","Yavaş oldu."], ["طَرَقَ","Vurdu / Çaldı."],
    ["قَلَّ","Azaldı."], ["كَثُرَ","Çoğaldı."],
    ["ضَاءَ","Işıldadı / Parladı."], ["مَرَّ","Geçti / Uğradı."],
    ["سَاقَ","Sürdü / Sevk etti."], ["نَوَّعَ","Çeşitlendirdi."],
    ["نَامَ","Uyudu."], ["طَعِمَ","Tattı / Yedi."],
    ["رَحُبَ","Geniş ve ferah oldu."], ["رَبَّعَ","Dörtledi / Kare yaptı."],
    ["وَحَّدَ","Birleştirdi / Birledi."], ["عَانَ","Göz değdi / Nazar etti."],
    ["أَنِفَ","Burun kıvırdı / Gurur yaptı / Tenezzül etmedi."], ["شَمَلَ","Kapsadı / İçine aldı / Kuşattı."],
    ["جَنَّبَ","Uzak tuttu / Korudu."], ["تَوَسَّطَ","Aracılık etti / Araya girdi / Ortada yer aldı."],
    ["وَقَعَ","Düştü / Vuku buldu / Meydana geldi."], ["قَلَعَ","Söktü / Kopardı / Çıkardı."],
    ["أَرَّخَ","Tarihledi / Zamanını belirledi."], ["سَارَ","Sıçradı, saldırdı"],
    ["رَكَزَ","Dikti / Sapladı"], ["بَعُدَ","Uzak oldu / Uzaklaştı"],
    ["دَارَ","Döndü."], ["قَشَطَ","Sıyırdı / Kazıdı / Soydu."],
    ["عَرَجَ","yükseldi, (göğe) çıktı"], ["جَدَّ","Yeni oldu; ciddileşti, gayret etti"]
];

/* ===========================================================================
   12) ÇALIŞTIR  (KOK_ANLAM tanımlandıktan SONRA olmalı)
   =========================================================================== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', baslat);
} else {
    baslat();
}

})();
