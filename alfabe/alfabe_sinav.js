/* ============================================================
   ALFABE SINAVI  —  alfabe.html  "p6" sekmesi
   ------------------------------------------------------------
   Öğretmenin istediği dokuz soru tipi:
     1) Okunuşları benzer harflerden YANLIŞ verilen şıkkı bul
     2) Yazılışları benzer harflerden YANLIŞ verilen şıkkı bul
     3) Okunuşları benzer harflerden DOĞRU verilen şıkkı bul
     4) Yazılışları benzer harflerden DOĞRU verilen şıkkı bul
     5) Çizgideki yazılışlardan YANLIŞ yazılmış harfi bul
     6) Çizgideki yazılışlardan DOĞRU yazılmış harfi bul
     7) Okunuşları benzer harfleri eşleştir
     8) Yazılışları benzer harfleri eşleştir
     9) Kelimede boş bırakılan yere hangi harf biçimi gelmeli
        (İleri'ye basınca doğru harf UÇARAK gelir, kelime birleşir)

   Testlerin hepsi 4 şıklıdır. Sorular her sınavda yeniden
   üretilir; üretilen her soru denetle() süzgecinden geçer:
   tek doğru şık olacak ve iki şık aynı olmayacak.
   ============================================================ */
(function () {
    'use strict';

    /* ------------------------------------------------------------
       1. VERİ
       ------------------------------------------------------------ */

    /* Okunuşu birbirine benzeyen harf aileleri. */
    var SES_GRUP = [
        { ad: 'S sesi',     h: ['ث', 'س', 'ص'] },
        { ad: 'Z sesi',     h: ['ذ', 'ز', 'ظ'] },
        { ad: 'T sesi',     h: ['ت', 'ط'] },
        { ad: 'D sesi',     h: ['د', 'ض'] },
        { ad: 'H sesi',     h: ['ه', 'ح', 'خ'] },
        { ad: 'K sesi',     h: ['ك', 'ق'] },
        { ad: 'Boğaz sesi', h: ['ا', 'ع'] }
    ];

    /* Yazılışı (gövdesi) birbirine benzeyen harf aileleri. */
    var YAZI_GRUP = [
        { ad: 'Diş grubu', h: ['ب', 'ت', 'ث'] },
        { ad: 'Cim grubu', h: ['ج', 'ح', 'خ'] },
        { ad: 'Dal grubu', h: ['د', 'ذ'] },
        { ad: 'Ra grubu',  h: ['ر', 'ز'] },
        { ad: 'Sin grubu', h: ['س', 'ش'] },
        { ad: 'Sad grubu', h: ['ص', 'ض'] },
        { ad: 'Tı grubu',  h: ['ط', 'ظ'] },
        { ad: 'Ayn grubu', h: ['ع', 'غ'] },
        { ad: 'Fa grubu',  h: ['ف', 'ق'] }
    ];

    /* Harflerin Türkçe adları — geri bildirim cümlelerinde kullanılır. */
    var AD = {
        'ا': 'Elif', 'ب': 'Ba', 'ت': 'Ta', 'ث': 'Sa', 'ج': 'Cim', 'ح': 'Ha',
        'خ': 'Hı', 'د': 'Dal', 'ذ': 'Zel', 'ر': 'Ra', 'ز': 'Ze', 'س': 'Sin',
        'ش': 'Şın', 'ص': 'Sad', 'ض': 'Dad', 'ط': 'Tı', 'ظ': 'Zı', 'ع': 'Ayn',
        'غ': 'Ğayn', 'ف': 'Fa', 'ق': 'Kaf', 'ك': 'Kef', 'ل': 'Lam', 'م': 'Mim',
        'ن': 'Nun', 'ه': 'He', 'و': 'Vav', 'ي': 'Ya', 'ى': 'Elif-i maksûra',
        'أ': 'Hemzeli elif', 'ة': 'Ta-i merbûta'
    };

    /* --- TUR SİSTEMİ ------------------------------------------------
       Sınav artık "kaç soru / hangi tip" seçtirmez: her TUR sabittir.
         TUR_SORU  : bir turdaki soru sayısı
         SORU_PUAN : her doğrunun puanı  (20 x 5 = 100 puan)
       Dokuz tipin HEPSİ her turda çıkar, sıraları karışıktır.
       ---------------------------------------------------------------- */
    var TUR_SORU  = 20;
    var SORU_PUAN = 5;

    /* Sonuç YALNIZ kendi sayfasından (alfabesinav.html) rapor edilir.
       alfabe.html içindeki sekme sınıf içi alıştırma olarak kalır; yoksa
       iki ayrı etkinlik (Yarışma ve Sınav) aynı dosya adına yazardı. */
    var RAPOR = false;
    try { RAPOR = /alfabesinav\.html$/i.test(location.pathname); } catch (e) { }

    /* Kendinden sonraki harfe BAĞLANMAYAN harfler. */
    var BIRLESMEZ = 'اأإآٱدذرزوؤةىء';
    var TATVIL    = 'ـ';

    /* 9. tip için hazır kelimeler: b = boş bırakılacak harfin sırası.
       Boş bırakılan harf her zaman BAĞLANAN bir harftir; böylece
       dört biçim (yalın / baş / orta / son) birbirinden farklı çıkar. */
    var BOSLUK_KELIME = [
        { h: ['ك', 'ت', 'ب'], b: 1, anlam: 'yazdı'          },
        { h: ['ل', 'ح', 'ق'], b: 1, anlam: 'yetişti'        },
        { h: ['ج', 'م', 'ل'], b: 1, anlam: 'deve'           },
        { h: ['س', 'ر', 'ج'], b: 0, anlam: 'eyer'           },
        { h: ['ح', 'م', 'ل'], b: 2, anlam: 'taşıdı'         },
        { h: ['و', 'ح', 'ش'], b: 1, anlam: 'yabani hayvan'  },
        { h: ['خ', 'م', 'س'], b: 2, anlam: 'beş'            },
        { h: ['ن', 'س', 'خ'], b: 0, anlam: 'kopya'          },
        { h: ['ص', 'ح', 'ف'], b: 1, anlam: 'sayfalar'       },
        { h: ['ح', 'ص', 'ل'], b: 1, anlam: 'elde etti'      },
        { h: ['م', 'ق', 'ص'], b: 1, anlam: 'makas'          },
        { h: ['ض', 'ل', 'ع'], b: 1, anlam: 'kaburga'        },
        { h: ['م', 'ض', 'ى'], b: 1, anlam: 'geçti'          },
        { h: ['ب', 'ع', 'ض'], b: 2, anlam: 'bazı'           },
        { h: ['ك', 'ث', 'ر'], b: 1, anlam: 'çoğaldı'        },
        { h: ['ر', 'ك', 'ل'], b: 1, anlam: 'tekmeledi'      },
        { h: ['س', 'م', 'ك'], b: 2, anlam: 'balık'          },
        { h: ['ل', 'ح', 'م'], b: 2, anlam: 'et'             },
        { h: ['ح', 'ل', 'ب'], b: 1, anlam: 'süt sağdı'      },
        { h: ['أ', 'ك', 'ل'], b: 1, anlam: 'yedi'           },
        { h: ['ن', 'و', 'م'], b: 2, anlam: 'uyku'           },
        { h: ['س', 'م', 'ع'], b: 0, anlam: 'işitti'         },
        { h: ['ف', 'ت', 'ح'], b: 1, anlam: 'açtı'           },
        { h: ['ع', 'ل', 'م'], b: 1, anlam: 'bildi'          },
        { h: ['ق', 'ل', 'م'], b: 2, anlam: 'kalem'          },
        { h: ['د', 'ر', 'س'], b: 2, anlam: 'ders'           },
        { h: ['ب', 'ي', 'ت'], b: 1, anlam: 'ev'             },
        { h: ['ش', 'م', 'س'], b: 1, anlam: 'güneş'          }
    ];

    var TIP_AD = {
        1: 'Okunuşu benzer — yanlış şık',
        2: 'Yazılışı benzer — yanlış şık',
        3: 'Okunuşu benzer — doğru şık',
        4: 'Yazılışı benzer — doğru şık',
        5: 'Çizgide yanlış yazılan harf',
        6: 'Çizgide doğru yazılan harf',
        7: 'Okunuşu benzerleri eşleştir',
        8: 'Yazılışı benzerleri eşleştir',
        9: 'Boşluğa gelecek harf'
    };

    var TIP_SORU = {
        1: 'Aşağıda okunuşları benzer olan harflerden <b>yanlış</b> verilen şıkkı bulunuz.',
        2: 'Aşağıda yazılışları benzer olan harflerden <b>yanlış</b> verilen şıkkı bulunuz.',
        3: 'Aşağıda okunuşları benzer olan harflerden <b>doğru</b> verilen şıkkı bulunuz.',
        4: 'Aşağıda yazılışları benzer olan harflerden <b>doğru</b> verilen şıkkı bulunuz.',
        5: 'Aşağıda çizgideki yazılışları verilen harflerden <b>yanlış</b> yazılmış olan harfi bulunuz.',
        6: 'Aşağıda çizgideki yazılışları verilen harflerden <b>doğru</b> yazılmış olan harfi bulunuz.',
        7: 'Okunuşları benzer olan harfleri eşleştiriniz.',
        8: 'Yazılışları benzer olan harfleri eşleştiriniz.',
        9: 'Yukarıdaki Arapça kelimede boş bırakılan yere aşağıdaki harflerden hangisi gelmelidir?'
    };

    /* ------------------------------------------------------------
       2. KÜÇÜK YARDIMCILAR
       ------------------------------------------------------------ */

    function harita(gruplar) {
        var m = {}, i, j;
        for (i = 0; i < gruplar.length; i++) {
            for (j = 0; j < gruplar[i].h.length; j++) m[gruplar[i].h[j]] = i;
        }
        return m;
    }
    var SES_HARITA  = harita(SES_GRUP);
    var YAZI_HARITA = harita(YAZI_GRUP);

    function karistir(a) {
        var i, j, t;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    function sec(a) { return a[Math.floor(Math.random() * a.length)]; }
    function kacis(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function ad(h) { return AD[h] || h; }
    function bagliMi(h) { return BIRLESMEZ.indexOf(h) < 0; }

    /* Bir kelimenin harf biçimlerini/renklerini çözer.
       Harf Birleştirme modülü yüklüyse onun çözücüsü kullanılır ki
       iki sekme birebir aynı kuralı uygulasın. */
    function yerelCoz(harfler) {
        var n = harfler.length, i, cik = [], ileri, geri, r;
        for (i = 0; i < n; i++) {
            ileri = (i < n - 1) && bagliMi(harfler[i]);
            geri  = (i > 0) && bagliMi(harfler[i - 1]);
            if (!ileri && i < n - 1) r = 'kirmizi';
            else if (i === 0)        r = 'yesil';
            else if (!geri)          r = 'siyah';
            else if (i === n - 1)    r = 'mor';
            else                     r = 'mavi';
            cik.push({
                harf: harfler[i],
                bicim: (geri ? TATVIL : '') + harfler[i] + (ileri ? TATVIL : ''),
                renk: r, ileriBag: ileri, geriBag: geri
            });
        }
        return cik;
    }
    function coz(harfler) {
        if (window.AlfabeBirlestir && typeof window.AlfabeBirlestir.coz === 'function') {
            try { return window.AlfabeBirlestir.coz(harfler); } catch (e) {}
        }
        return yerelCoz(harfler);
    }

    /* Bir harfin dört yazılış biçimi: yalın / baş / orta / son.
       Öğretmenin örneğindeki  ـت  ـتـ  ت  تـ  dizisi budur. */
    function dortBicim(h) {
        return [h, h + TATVIL, TATVIL + h + TATVIL, TATVIL + h];
    }

    /* ------------------------------------------------------------
       3. SORU ÜRETİCİLERİ
       ------------------------------------------------------------ */

    /* --- Tip 1-4: harf çifti şıkları --- */
    function ciftSoru(tip) {
        var ses      = (tip === 1 || tip === 3);
        var gruplar  = ses ? SES_GRUP : YAZI_GRUP;
        var hrt      = ses ? SES_HARITA : YAZI_HARITA;
        var dogruAra = (tip === 3 || tip === 4);   /* doğru eşi arıyoruz */
        var olcut    = ses ? 'okunuş' : 'yazılış';

        var ayniCift = function () {
            var g = sec(gruplar.filter(function (x) { return x.h.length > 1; }));
            var iki = karistir(g.h.slice()).slice(0, 2);
            return { a: iki[0], b: iki[1], ayni: true, grup: g.ad };
        };
        var farkliCift = function () {
            var g1 = sec(gruplar), g2 = sec(gruplar), kac = 0;
            while (g1 === g2 && kac++ < 40) g2 = sec(gruplar);
            var a = sec(g1.h), b = sec(g2.h);
            /* Ölçüt dışı bir eşleşme kalmasın diye ayrıca haritadan bakılır. */
            if (a === b || hrt[a] === hrt[b]) return null;
            return { a: a, b: b, ayni: false };
        };

        var ciftler = [], anahtar = {}, c, i, kac = 0;
        var dogruSayi = dogruAra ? 1 : 3;   /* kaç tane "aynı grup" çifti olacak */
        while (ciftler.length < 4 && kac++ < 500) {
            c = (ciftler.filter(function (x) { return x.ayni; }).length < dogruSayi)
                ? ayniCift() : farkliCift();
            if (!c) continue;
            var k = c.a + '|' + c.b, k2 = c.b + '|' + c.a;
            if (anahtar[k] || anahtar[k2]) continue;
            anahtar[k] = anahtar[k2] = 1;
            ciftler.push(c);
        }
        if (ciftler.length < 4) return null;

        var siklar = karistir(ciftler).map(function (x) {
            var cevap = dogruAra ? x.ayni : !x.ayni;   /* aranan şık mı? */
            return {
                html: '<span class="as-h">' + kacis(x.a) + '</span>' +
                      '<span class="as-ayrac">—</span>' +
                      '<span class="as-h">' + kacis(x.b) + '</span>',
                dogru: cevap,
                not: x.ayni
                    ? ad(x.a) + ' ile ' + ad(x.b) + ' harflerinin ' + olcut + 'ları birbirine benzer.'
                    : ad(x.a) + ' ile ' + ad(x.b) + ' harflerinin ' + olcut + 'ları birbirine benzemez.'
            };
        });

        return {
            tip: tip, bicim: 'test',
            metin: TIP_SORU[tip],
            ustlik: '', siklar: siklar
        };
    }

    /* --- Tip 5-6: çizgideki yazılışlar --- */

    /* Harfin doğru üçlüsü: baş — orta — son. */
    function dogruUclu(h) {
        if (bagliMi(h)) return [h + TATVIL, TATVIL + h + TATVIL, TATVIL + h];
        return [h, TATVIL + h, TATVIL + h];
    }

    /* Harfin YANLIŞ üçlüsü + neden yanlış olduğunun Türkçe açıklaması. */
    function yanlisUclu(h) {
        var d = dogruUclu(h), y = d.slice(), aciklama;
        if (!bagliMi(h)) {
            /* Klasik hata: bağlanmayan harfe ileri çizgi eklemek. */
            y = [h + TATVIL, TATVIL + h + TATVIL, TATVIL + h];
            aciklama = ad(h) + ' kendinden sonraki harfe bağlanmaz; ileri çizgi almaz.';
        } else {
            var n = Math.floor(Math.random() * 3);
            if (n === 0) { y[0] = h; aciklama = ad(h) + ' harfi kelimenin başında sonraki harfe bağlanır, ileri çizgisi olmalıydı.'; }
            else if (n === 1) { y[1] = h + TATVIL; aciklama = ad(h) + ' harfi ortada iki yandan bağlanır, önündeki bağlantı çizgisi eksik.'; }
            else { y[2] = h; aciklama = ad(h) + ' harfi sonda kendinden öncekine bağlanır, geri çizgisi eksik.'; }
        }
        return { u: y, not: aciklama };
    }

    function ucluHtml(u) {
        var i, c = [];
        for (i = 0; i < u.length; i++) c.push('<span class="as-bic">' + kacis(u[i]) + '</span>');
        return '<span class="as-uclu">' + c.join('') + '</span>';
    }

    function cizgiSoru(tip) {
        var dogruAra = (tip === 6);          /* 6 → doğru yazılanı bul */
        var havuz = karistir(Object.keys(AD).filter(function (h) {
            return 'اأإآٱءةى'.indexOf(h) < 0;      /* kararsız biçimli harfler dışarıda */
        }));
        var harfler = havuz.slice(0, 4);
        var dogruSayi = dogruAra ? 1 : 3;
        var siklar = [], i, y;
        for (i = 0; i < 4; i++) {
            if (i < dogruSayi) {
                siklar.push({
                    html: ucluHtml(dogruUclu(harfler[i])) +
                          '<span class="as-etiket">' + ad(harfler[i]) + '</span>',
                    dogru: dogruAra,
                    not: ad(harfler[i]) + ' harfinin çizgideki yazılışı doğru verilmiş.'
                });
            } else {
                y = yanlisUclu(harfler[i]);
                siklar.push({
                    html: ucluHtml(y.u) +
                          '<span class="as-etiket">' + ad(harfler[i]) + '</span>',
                    dogru: !dogruAra,
                    not: y.not
                });
            }
        }
        return {
            tip: tip, bicim: 'test',
            metin: TIP_SORU[tip],
            ustlik: '<div class="as-ipucu">Sırasıyla: <b>baş</b> — <b>orta</b> — <b>son</b> yazılışı.</div>',
            siklar: karistir(siklar)
        };
    }

    /* --- Tip 7-8: eşleştirme --- */
    function eslestirSoru(tip) {
        var ses     = (tip === 7);
        var gruplar = (ses ? SES_GRUP : YAZI_GRUP).filter(function (g) { return g.h.length > 1; });
        var secili  = karistir(gruplar.slice()).slice(0, 4);
        if (secili.length < 4) return null;
        var ciftler = secili.map(function (g) {
            var iki = karistir(g.h.slice()).slice(0, 2);
            return { sol: iki[0], sag: iki[1], grup: g.ad };
        });
        return {
            tip: tip, bicim: 'eslestir',
            metin: TIP_SORU[tip],
            ustlik: '<div class="as-ipucu">Soldan bir harfe, sonra sağdan eşine dokun.</div>',
            ciftler: ciftler,
            saglar: karistir(ciftler.map(function (c) { return c.sag; }))
        };
    }

    /* --- Tip 9: kelimede boşluk + uçan harf --- */
    function boslukSoru(kaynak) {
        var k = kaynak || sec(BOSLUK_KELIME);
        var c = coz(k.h);
        var h = k.h[k.b];
        var dogruBicim = c[k.b].bicim;
        var adaylar = dortBicim(h);
        /* Aynı biçim iki kere görünmesin (bağlanmayan harflerde olabilir). */
        var temiz = [], gor = {}, i;
        for (i = 0; i < adaylar.length; i++) {
            if (!gor[adaylar[i]]) { gor[adaylar[i]] = 1; temiz.push(adaylar[i]); }
        }
        if (temiz.length < 4 || temiz.indexOf(dogruBicim) < 0) return null;
        var siklar = karistir(temiz).map(function (b) {
            return {
                html: '<span class="as-bic as-bic-b">' + kacis(b) + '</span>',
                deger: b,
                dogru: b === dogruBicim,
                not: (b === dogruBicim)
                    ? ad(h) + ' burada ' + (c[k.b].geriBag ? (c[k.b].ileriBag ? 'iki yandan bağlanır' : 'önceki harfe bağlanır')
                                                          : (c[k.b].ileriBag ? 'sonraki harfe bağlanır' : 'yalnız yazılır')) + '.'
                    : 'Bu biçim buraya uymaz.'
            };
        });
        return {
            tip: 9, bicim: 'test', kelime: k, cozum: c, dogruBicim: dogruBicim,
            metin: TIP_SORU[9],
            ustlik: '', siklar: siklar
        };
    }

    /* ------------------------------------------------------------
       4. ÜRETİM + DENETİM
       ------------------------------------------------------------ */

    function uret(tip) {
        if (tip >= 1 && tip <= 4) return ciftSoru(tip);
        if (tip === 5 || tip === 6) return cizgiSoru(tip);
        if (tip === 7 || tip === 8) return eslestirSoru(tip);
        if (tip === 9) return boslukSoru();
        return null;
    }

    /* Boş dizge = soru sağlam. Aksi hâlde sorunun nesi bozuk. */
    function denetle(s) {
        if (!s) return 'soru üretilemedi';
        var i, k, gor = {};
        if (s.bicim === 'test') {
            if (!s.siklar || s.siklar.length !== 4) return 'şık sayısı 4 değil';
            var d = 0;
            for (i = 0; i < 4; i++) {
                if (s.siklar[i].dogru) d++;
                k = s.siklar[i].html;
                if (gor[k]) return 'tekrar eden şık';
                gor[k] = 1;
            }
            if (d !== 1) return 'doğru şık sayısı ' + d;
            return '';
        }
        if (s.bicim === 'eslestir') {
            if (!s.ciftler || s.ciftler.length !== 4) return 'çift sayısı 4 değil';
            for (i = 0; i < 4; i++) {
                if (s.ciftler[i].sol === s.ciftler[i].sag) return 'aynı harf eşleşmiş';
                if (gor[s.ciftler[i].sol] || gor[s.ciftler[i].sag]) return 'harf iki kez geçiyor';
                gor[s.ciftler[i].sol] = gor[s.ciftler[i].sag] = 1;
            }
            return '';
        }
        return 'bilinmeyen biçim';
    }

    function havuzKur(tip, adet) {
        var liste = [], kac = 0, s, tipler = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var kelimeler = karistir(BOSLUK_KELIME.slice()), ki = 0;
        while (liste.length < adet && kac++ < adet * 60) {
            var t = tip ? tip : tipler[liste.length % tipler.length];
            s = (t === 9) ? boslukSoru(kelimeler[ki++ % kelimeler.length]) : uret(t);
            if (denetle(s) !== '') continue;
            liste.push(s);
        }
        return liste;
    }

    /* BİR TURUN SORULARI — 20 soru, HER TİPTEN en az ikişer tane,
       sırası karışık. 9 tipin ikişerlisi 18 eder; kalan 2 soru rastgele
       tiplerden tamamlanır. Böylece "her tür soru çıksın" ve "sorular
       karışık olsun" kuralları aynı anda tutar. */
    function turHavuzu() {
        var tipler = [1, 2, 3, 4, 5, 6, 7, 8, 9], sira = [], i, t, s, dene;
        sira = sira.concat(tipler).concat(tipler);              /* her tipten ikişer */
        while (sira.length < TUR_SORU) sira.push(tipler[Math.floor(Math.random() * tipler.length)]);
        sira = karistir(sira).slice(0, TUR_SORU);

        var kelimeler = karistir(BOSLUK_KELIME.slice()), ki = 0, liste = [];
        for (i = 0; i < sira.length; i++) {
            t = sira[i]; s = null; dene = 0;
            while (dene++ < 60) {
                s = (t === 9) ? boslukSoru(kelimeler[ki % kelimeler.length]) : uret(t);
                if (denetle(s) === '') break;
                s = null;
            }
            if (t === 9) ki++;
            if (s) liste.push(s);
        }
        /* Üretilemeyen olduysa (pratikte olmaz) karışık tiplerle tamamla. */
        dene = 0;
        while (liste.length < TUR_SORU && dene++ < TUR_SORU * 60) {
            t = tipler[Math.floor(Math.random() * tipler.length)];
            s = (t === 9) ? boslukSoru(kelimeler[ki++ % kelimeler.length]) : uret(t);
            if (denetle(s) === '') liste.push(s);
        }
        return liste.slice(0, TUR_SORU);
    }

    /* ------------------------------------------------------------
       5. ARAYÜZ
       ------------------------------------------------------------ */

    var durum = { tur: 0, havuz: [], i: 0, dogru: 0, cevapli: false, secim: null,
                  bas: 0, bildirildi: false };

    function kelimeHtml(s, dolu, bitisik) {
        var c = s.cozum, i, p = [], t;
        for (i = 0; i < c.length; i++) {
            if (i === s.kelime.b && !dolu) {
                p.push('<span class="as-bosluk" data-rol="bosluk">' + TATVIL + '</span>');
            } else {
                t = bitisik ? c[i].harf : c[i].bicim;
                p.push('<span class="as-kp ab-c-' + c[i].renk +
                       (i === s.kelime.b ? ' as-kp-yeni' : '') + '">' + kacis(t) + '</span>');
            }
        }
        return '<span class="as-kelime' + (bitisik ? ' as-bitisik' : '') + '">' + p.join('') + '</span>';
    }

    function soruHtml(s, no, top) {
        var g = '';
        g += '<div class="as-bar"><i style="width:' + Math.round(no / top * 100) + '%"></i></div>';
        g += '<div class="as-ust">';
        g += '  <span class="as-no">Soru ' + no + ' / ' + top + '</span>';
        g += '  <span class="as-tipad">' + TIP_AD[s.tip] + '</span>';
        g += '</div>';
        if (s.tip === 9) {
            g += '<div class="as-kelimekutu">' + kelimeHtml(s, false, false) +
                 '<span class="as-anlam">(' + kacis(s.kelime.anlam) + ')</span></div>';
        }
        g += '<div class="as-metin">' + s.metin + '</div>';
        g += s.ustlik || '';
        if (s.bicim === 'eslestir') {
            g += '<div class="as-esalan">';
            g += '  <div class="as-sutun" data-yan="sol">';
            s.ciftler.forEach(function (c, i) {
                g += '<button type="button" class="as-es" data-yan="sol" data-h="' + kacis(c.sol) + '" data-i="' + i + '">' + kacis(c.sol) + '</button>';
            });
            g += '  </div><div class="as-sutun" data-yan="sag">';
            s.saglar.forEach(function (h) {
                g += '<button type="button" class="as-es" data-yan="sag" data-h="' + kacis(h) + '">' + kacis(h) + '</button>';
            });
            g += '  </div></div>';
        } else {
            g += '<div class="as-siklar">';
            s.siklar.forEach(function (x, i) {
                g += '<button type="button" class="as-sik" data-i="' + i + '">' +
                     '<span class="as-mark">' + 'ABCD'.charAt(i) + '</span>' +
                     '<span class="as-ic">' + x.html + '</span></button>';
            });
            g += '</div>';
        }
        g += '<div class="as-geri-bildirim" data-rol="bildirim"></div>';
        g += '<div class="as-alt">';
        g += '  <button type="button" class="as-t as-ileri" data-rol="ileri" hidden>İleri <i class="ab-ok ab-ok-sag"></i></button>';
        g += '  <button type="button" class="as-t as-sonraki" data-rol="sonraki" hidden>Sonraki soru</button>';
        g += '  <button type="button" class="as-t as-bitir" data-rol="bitir">Sınavı bitir</button>';
        g += '</div>';
        return g;
    }

    function tik() { if (typeof window.playClick === 'function') { try { window.playClick(); } catch (e) {} } }

    /* hal: 'iyi' | 'kotu' | 'orta' */
    function bildir(kap, hal, yazi) {
        if (hal === true)  hal = 'iyi';
        if (hal === false) hal = 'kotu';
        var b = kap.querySelector('[data-rol="bildirim"]');
        if (!b) return;
        var bas = hal === 'iyi' ? '✔ Doğru. ' : (hal === 'orta' ? '◐ Tamamlandı. ' : '✘ Yanlış. ');
        b.className = 'as-geri-bildirim as-' + hal;
        b.innerHTML = bas + yazi;
    }

    /* Doğru harfi şıktan alıp boşluğa uçurur, sonra kelimeyi birleştirir. */
    function ucusBaslat(kap, s, bit) {
        var kaynak = kap.querySelector('.as-sik.as-dogru .as-bic');
        var hedef  = kap.querySelector('[data-rol="bosluk"]');
        var kutu   = kap.querySelector('.as-kelimekutu');
        if (!kaynak || !hedef || !kutu) { if (bit) bit(); return; }
        var a = kaynak.getBoundingClientRect(), b = hedef.getBoundingClientRect();
        var k = kutu.getBoundingClientRect();
        var ucan = document.createElement('span');
        ucan.className = 'as-ucan ab-c-' + s.cozum[s.kelime.b].renk;
        ucan.textContent = s.dogruBicim;
        ucan.style.left = (a.left - k.left) + 'px';
        ucan.style.top  = (a.top  - k.top)  + 'px';
        ucan.style.width  = a.width + 'px';
        ucan.style.height = a.height + 'px';
        kutu.appendChild(ucan);
        var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
        var dy = (b.top + b.height / 2) - (a.top + a.height / 2);
        requestAnimationFrame(function () {
            ucan.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.3)';
            ucan.style.opacity = '1';
        });
        setTimeout(function () {
            ucan.style.opacity = '0';
            kutu.innerHTML = kelimeHtml(s, true, false) +
                             '<span class="as-anlam">(' + kacis(s.kelime.anlam) + ')</span>';
            setTimeout(function () {
                kutu.innerHTML = kelimeHtml(s, true, true) +
                                 '<span class="as-anlam">(' + kacis(s.kelime.anlam) + ')</span>';
                if (bit) bit();
            }, 620);
        }, 900);
    }

    /* SONUÇ — her tur 100 puan üzerinden. Cevaplanmayan soru 0 sayılır,
       yani turu yarıda bırakmak puanı düşürür. */
    function sonucHtml() {
        var d = durum.dogru, puan = d * SORU_PUAN;
        var soz = puan >= 90 ? 'Harikasın! Alfabeyi çok iyi tanıyorsun.'
                : puan >= 70 ? 'Güzel iş! Birkaç harfi tekrar edelim.'
                : puan >= 50 ? 'Fena değil; renkleri hatırlayarak yeni bir tur dene.'
                : 'Harf Birleştirme sekmesinden biraz çalışıp tekrar gel.';
        return '<div class="as-sonkart">' +
               '  <div class="as-sonbas">' + durum.tur + '. Tur bitti</div>' +
               '  <div class="as-halka" style="--p:' + puan + '"><span>' + puan + '</span></div>' +
               '  <div class="as-sonsay"><b>' + puan + ' / 100 puan</b> · ' + d + ' doğru / ' + TUR_SORU + ' soru</div>' +
               '  <div class="as-sonsoz">' + soz + '</div>' +
               '  <div class="as-alt">' +
               '    <button type="button" class="as-t as-basla" data-rol="yeniden">' + (durum.tur + 1) + '. Tura geç</button>' +
               '    <button type="button" class="as-t as-bitir" data-rol="ayarlar">Kapağa dön</button>' +
               '  </div>' +
               '</div>';
    }

    /* Turu kapat: sonucu çiz ve (kendi sayfasındaysak) BİR KEZ rapor et. */
    function turuBitir(kap) {
        if (!durum.bildirildi) {
            durum.bildirildi = true;
            if (RAPOR) {
                try {
                    if (window.KidefGorev && KidefGorev.aktif) {
                        KidefGorev.bildir({
                            dogru: durum.dogru, toplam: TUR_SORU,
                            mod: 'tur', detay: durum.tur + '. tur',
                            sureSn: durum.bas ? Math.round((Date.now() - durum.bas) / 1000) : null
                        });
                    }
                } catch (e) { }
            }
        }
        kap.innerHTML = sonucHtml();
    }

    function turBaslat(kap) {
        durum.tur++;
        durum.havuz = turHavuzu();
        durum.i = 0; durum.dogru = 0; durum.esHata = 0;
        durum.bas = Date.now(); durum.bildirildi = false;
        soruGoster(kap);
    }

    function soruGoster(kap) {
        var s = durum.havuz[durum.i];
        if (!s) { turuBitir(kap); return; }
        durum.cevapli = false; durum.secim = null;
        durum.esSol = null; durum.esDogru = 0; durum.esHata = 0;
        kap.innerHTML = soruHtml(s, durum.i + 1, durum.havuz.length);
    }

    function testCevap(kap, s, dugme) {
        if (durum.cevapli) return;
        durum.cevapli = true;
        var i = +dugme.getAttribute('data-i');
        var secilen = s.siklar[i];
        var hepsi = kap.querySelectorAll('.as-sik');
        for (var j = 0; j < hepsi.length; j++) {
            hepsi[j].disabled = true;
            if (s.siklar[j].dogru) hepsi[j].classList.add('as-dogru');
        }
        if (!secilen.dogru) dugme.classList.add('as-yanlis');
        if (secilen.dogru) durum.dogru++;
        var dogruSik = s.siklar.filter(function (x) { return x.dogru; })[0];
        bildir(kap, secilen.dogru, dogruSik ? dogruSik.not : '');
        if (s.tip === 9) {
            kap.querySelector('[data-rol="ileri"]').hidden = false;
        } else {
            kap.querySelector('[data-rol="sonraki"]').hidden = false;
        }
    }

    function esCevap(kap, s, dugme) {
        var yan = dugme.getAttribute('data-yan');
        if (dugme.classList.contains('as-kilit')) return;
        if (yan === 'sol') {
            var eski = kap.querySelector('.as-es.as-secili');
            if (eski) eski.classList.remove('as-secili');
            dugme.classList.add('as-secili');
            durum.esSol = dugme;
            return;
        }
        if (!durum.esSol) return;
        var solH = durum.esSol.getAttribute('data-h');
        var sagH = dugme.getAttribute('data-h');
        var hrt  = (s.tip === 7) ? SES_HARITA : YAZI_HARITA;
        var uyar = (hrt[solH] !== undefined && hrt[solH] === hrt[sagH] && solH !== sagH);
        if (uyar) {
            durum.esDogru++;
            durum.esSol.classList.remove('as-secili');
            durum.esSol.classList.add('as-kilit', 'as-dogru');
            dugme.classList.add('as-kilit', 'as-dogru');
            /* Aynı numara + aynı renk tonu: hangisi hangisiyle eşleşti belli olsun. */
            durum.esSol.setAttribute('data-cift', durum.esDogru);
            dugme.setAttribute('data-cift', durum.esDogru);
            durum.esSol = null;
            if (durum.esDogru >= 4) {
                durum.cevapli = true;
                if (!durum.esHata) durum.dogru++;
                bildir(kap, durum.esHata ? 'orta' : 'iyi',
                       durum.esHata ? ('Dördünü de buldun ama ' + durum.esHata + ' hatalı denemen oldu; bu soru puan getirmedi.')
                                    : 'Dört eşleşmenin hepsi doğru.');
                kap.querySelector('[data-rol="sonraki"]').hidden = false;
            }
        } else {
            durum.esHata = (durum.esHata || 0) + 1;
            dugme.classList.add('as-titre');
            setTimeout(function () { dugme.classList.remove('as-titre'); }, 420);
            durum.esSol.classList.remove('as-secili');
            durum.esSol = null;
        }
    }

    /* KAPAK — soru tipi/sayısı seçtirmez: tur düzeni sabittir. */
    function baslatEkrani() {
        var g = '';
        g += '<div class="as-kapak">';
        g += '  <h2 class="as-bas">Alfabe Sınavı</h2>';
        g += '  <p class="as-alt-bas">Her tur <b>' + TUR_SORU + ' soru</b>, her doğru <b>' + SORU_PUAN +
             ' puan</b> — tur sonunda <b>100 puan</b> üzerinden değerlendirilir.</p>';
        g += '  <div class="as-turnot">Dokuz soru tipinin <b>hepsi</b> her turda çıkar ve sıraları karışıktır. ' +
             'Sorular her turda yeniden üretilir, aynı tur bir daha aynı gelmez.</div>';
        g += '  <ol class="as-turliste">';
        for (var t = 1; t <= 9; t++) g += '<li>' + TIP_AD[t] + '</li>';
        g += '  </ol>';
        g += '  <button type="button" class="as-t as-basla" data-rol="basla">' +
             (durum.tur ? (durum.tur + 1) + '. Tura başla' : 'Tura başla') + '</button>';
        g += '</div>';
        return g;
    }

    function kur() {
        var kap = document.getElementById('asSar');
        if (!kap || kap.getAttribute('data-kuruldu') === '1') return;
        kap.setAttribute('data-kuruldu', '1');
        kap.innerHTML = baslatEkrani();

        kap.addEventListener('click', function (e) {
            var d;
            /* --- kapak --- */
            d = e.target.closest ? e.target.closest('[data-rol="ayarlar"]') : null;
            if (d && kap.contains(d)) { kap.innerHTML = baslatEkrani(); tik(); return; }
            d = e.target.closest ? e.target.closest('[data-rol="basla"],[data-rol="yeniden"]') : null;
            if (d && kap.contains(d)) { turBaslat(kap); tik(); return; }
            var s = durum.havuz[durum.i];
            if (!s) return;
            /* --- test şıkları --- */
            d = e.target.closest ? e.target.closest('.as-sik') : null;
            if (d && kap.contains(d)) { testCevap(kap, s, d); tik(); return; }
            /* --- eşleştirme --- */
            d = e.target.closest ? e.target.closest('.as-es') : null;
            if (d && kap.contains(d)) { esCevap(kap, s, d); tik(); return; }
            /* --- ileri (uçuş) --- */
            d = e.target.closest ? e.target.closest('[data-rol="ileri"]') : null;
            if (d && kap.contains(d)) {
                d.hidden = true;
                ucusBaslat(kap, s, function () {
                    var b = kap.querySelector('[data-rol="sonraki"]');
                    if (b) b.hidden = false;
                });
                tik(); return;
            }
            /* --- sonraki soru --- */
            d = e.target.closest ? e.target.closest('[data-rol="sonraki"]') : null;
            if (d && kap.contains(d)) {
                durum.i++; durum.esHata = 0; soruGoster(kap); tik(); return;
            }
            /* --- bitir --- */
            d = e.target.closest ? e.target.closest('[data-rol="bitir"]') : null;
            if (d && kap.contains(d)) { turuBitir(kap); tik(); return; }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', kur);
    } else { kur(); }

    window.AlfabeSinav = {
        kur: kur, uret: uret, denetle: denetle, havuzKur: havuzKur, turHavuzu: turHavuzu,
        ayar: { turSoru: TUR_SORU, soruPuan: SORU_PUAN, rapor: RAPOR },
        coz: coz, dortBicim: dortBicim,
        gruplar: { ses: SES_GRUP, yazi: YAZI_GRUP },
        haritalar: { ses: SES_HARITA, yazi: YAZI_HARITA },
        kelimeler: BOSLUK_KELIME
    };
})();
