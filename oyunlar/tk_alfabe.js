/* =====================================================================
   TEST KAPIŞMASI — ALFABE SORULARI            (oyunlar/tk_alfabe.js)
   ---------------------------------------------------------------------
   Test Kapışması'na iki yeni ders ekler:

     · Harf Birleştirme   — harfler birbirine nasıl bağlanır
     · Çizgideki Yazılış  — baş/orta/son biçimler satır çizgisine göre

   NEDEN AYRI DOSYA: alfabe.html'in kendi sınav motoru (alfabe_sinav.js)
   62 KB'lık alfabe.js + 136 KB'lık alfabe.css ile birlikte çalışıyor ve
   açılışta #asSar / #abSar arıyor. Onu buraya taşımak, kapışma sayfasını
   200 KB şişirip DOM'da olmayan kaplara bağımlı kılardı. Bu yüzden
   soru üreticileri burada KENDİ KENDİNE YETER biçimde duruyor.

   KURALLAR BİREBİR AYNIDIR: BIRLESMEZ dizgesi, TATVIL, coz() renk/biçim
   mantığı ve çizgi hatası (as-havada / as-batik) alfabe_sinav.js ile
   harfi harfine aynıdır. İki dosyanın ayrışmaması t_tkalfabe.py ile
   ölçülüyor: aynı sayfada iki modül birden yüklenip 28 harfin dört
   biçimi ve örnek kelimelerin çözümleri karşılaştırılıyor.

   SORU BİÇİMİ — testkapismasi.js'in genişletilmiş şekli:
     { id, tip:'alfabe', soruHtml, ustlik, siklar:[{html, dogru}] }
   Eski kelime soruları ({id, arabic, turkish}) hiç değişmedi.
   ===================================================================== */
(function () {
    'use strict';
    if (window.TKAlfabe) return;

    /* ---------------- 1. VERİ (alfabe_sinav.js ile aynı) ------------- */

    /* Kendinden sonraki harfe BAĞLANMAYAN harfler. */
    var BIRLESMEZ = 'اأإآٱدذرزوؤةىء';
    var TATVIL    = 'ـ';

    var AD = {
        'ا': 'Elif', 'ب': 'Ba', 'ت': 'Ta', 'ث': 'Sa', 'ج': 'Cim', 'ح': 'Ha',
        'خ': 'Hı', 'د': 'Dal', 'ذ': 'Zel', 'ر': 'Ra', 'ز': 'Ze', 'س': 'Sin',
        'ش': 'Şın', 'ص': 'Sad', 'ض': 'Dad', 'ط': 'Tı', 'ظ': 'Zı', 'ع': 'Ayn',
        'غ': 'Ğayn', 'ف': 'Fa', 'ق': 'Kaf', 'ك': 'Kef', 'ل': 'Lam', 'م': 'Mim',
        'ن': 'Nun', 'ه': 'He', 'و': 'Vav', 'ي': 'Ya'
    };

    /* Üç harfli kelimeler — hepsi gerçek, anlamı yazılı.
       alfabe_sinav.js'in BOSLUK_KELIME listesiyle aynı kaynak. */
    var KELIMELER = [
        { h: ['ك', 'ت', 'ب'], b: 1, anlam: 'yazdı'         },
        { h: ['ل', 'ح', 'ق'], b: 1, anlam: 'yetişti'       },
        { h: ['ج', 'م', 'ل'], b: 1, anlam: 'deve'          },
        { h: ['س', 'ر', 'ج'], b: 0, anlam: 'eyer'          },
        { h: ['ح', 'م', 'ل'], b: 2, anlam: 'taşıdı'        },
        { h: ['و', 'ح', 'ش'], b: 1, anlam: 'yabani hayvan' },
        { h: ['خ', 'م', 'س'], b: 2, anlam: 'beş'           },
        { h: ['ن', 'س', 'خ'], b: 0, anlam: 'kopya'         },
        { h: ['ص', 'ح', 'ف'], b: 1, anlam: 'sayfalar'      },
        { h: ['ح', 'ص', 'ل'], b: 1, anlam: 'elde etti'     },
        { h: ['م', 'ق', 'ص'], b: 1, anlam: 'makas'         },
        { h: ['ض', 'ل', 'ع'], b: 1, anlam: 'kaburga'       },
        { h: ['ب', 'ع', 'ض'], b: 2, anlam: 'bazı'          },
        { h: ['ك', 'ث', 'ر'], b: 1, anlam: 'çoğaldı'       },
        { h: ['ر', 'ك', 'ل'], b: 1, anlam: 'tekmeledi'     },
        { h: ['س', 'م', 'ك'], b: 2, anlam: 'balık'         },
        { h: ['ل', 'ح', 'م'], b: 2, anlam: 'et'            },
        { h: ['ح', 'ل', 'ب'], b: 1, anlam: 'süt sağdı'     },
        { h: ['ن', 'و', 'م'], b: 2, anlam: 'uyku'          },
        { h: ['س', 'م', 'ع'], b: 0, anlam: 'işitti'        },
        { h: ['ف', 'ت', 'ح'], b: 1, anlam: 'açtı'          },
        { h: ['ع', 'ل', 'م'], b: 1, anlam: 'bildi'         },
        { h: ['ق', 'ل', 'م'], b: 2, anlam: 'kalem'         },
        { h: ['د', 'ر', 'س'], b: 2, anlam: 'ders'          },
        { h: ['ب', 'ي', 'ت'], b: 1, anlam: 'ev'            },
        { h: ['ش', 'م', 'س'], b: 1, anlam: 'güneş'         }
    ];

    var BICIM_AD = { n: 'yalın', b: 'baştaki', o: 'ortadaki', s: 'sondaki' };

    /* ---------------- 2. KÜÇÜK YARDIMCILAR --------------------------- */

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

    /* Bir kelimenin harf biçimlerini çözer — alfabe_birlestir.js /
       alfabe_sinav.js ile BİREBİR aynı kural. */
    function coz(harfler) {
        var n = harfler.length, i, cik = [], ileri, geri;
        for (i = 0; i < n; i++) {
            ileri = (i < n - 1) && bagliMi(harfler[i]);
            geri  = (i > 0) && bagliMi(harfler[i - 1]);
            cik.push({
                harf: harfler[i],
                bicim: (geri ? TATVIL : '') + harfler[i] + (ileri ? TATVIL : ''),
                ileriBag: ileri, geriBag: geri
            });
        }
        return cik;
    }

    /* Bir harfin dört yazılış biçimi: yalın / baş / orta / son. */
    function dortBicim(h) {
        return [h, h + TATVIL, TATVIL + h + TATVIL, TATVIL + h];
    }

    /* Harfin doğru üçlüsü: baş — orta — son. */
    function dogruUclu(h) {
        if (bagliMi(h)) return [h + TATVIL, TATVIL + h + TATVIL, TATVIL + h];
        return [h, TATVIL + h, TATVIL + h];
    }

    /* YANLIŞ üçlü: harf yanlış yazılmaz, ÇİZGİYE GÖRE yanlış durur.
       (Gerekçesi alfabe_sinav.js'te uzun uzun yazılı: tatvili eksiltmek
       gözle çözülemeyecek kadar küçük bir fark bırakıyordu.) */
    var KONUM_HATA = ['tka-havada', 'tka-batik'];
    function yanlisUclu(h) {
        var k = KONUM_HATA[Math.floor(Math.random() * KONUM_HATA.length)];
        return { u: dogruUclu(h), kaydir: [k, k, k] };
    }

    function ucluHtml(u, kaydir) {
        var i, c = [], ek;
        for (i = 0; i < u.length; i++) {
            ek = (kaydir && kaydir[i]) ? ' ' + kaydir[i] : '';
            c.push('<span class="tka-bic' + ek + '">' + kacis(u[i]) + '</span>');
        }
        return '<span class="tka-uclu">' + c.join('') + '</span>';
    }

    /* ---------------- 3. SORU ÜRETİCİLERİ ---------------------------- */

    /* --- A) Hangi harf bağlanmaz / bağlanır? ------------------------
       Harf birleştirmenin tek kuralı budur: altı harf kendinden
       sonrakine bağlanmaz. Şıklar harfin YALIN biçimidir. */
    function bagSoru() {
        var baglanmaz = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];
        var baglanir  = ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'س', 'ش', 'ص', 'ض',
                         'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ي'];
        var baglanmazAra = Math.random() < 0.5;        /* soru yönü */
        var tek = sec(baglanmazAra ? baglanmaz : baglanir);
        var ucu = karistir((baglanmazAra ? baglanir : baglanmaz).slice()).slice(0, 3);
        if (ucu.length < 3) return null;
        var siklar = karistir([tek].concat(ucu)).map(function (h) {
            return {
                html: '<span class="tka-h">' + kacis(h) + '</span>' +
                      '<span class="tka-etiket">' + ad(h) + '</span>',
                dogru: h === tek
            };
        });
        return {
            tip: 'alfabe', alt: 'bag', soruTuru: 'cumle',
            soruHtml: baglanmazAra
                ? 'Hangi harf kendinden sonrakine <b>bağlanmaz</b>?'
                : 'Hangi harf kendinden sonrakine <b>bağlanır</b>?',
            ustlik: '', siklar: siklar
        };
    }

    /* --- B) Kelimenin harf harf (ayrık) yazılışı --------------------
       Doğru şık coz()'un verdiği biçimlerdir. Çeldiriciler, bir ya da
       iki BAĞLANTI NOKTASI ters çevrilerek üretilir: bağlanması gereken
       yer ayrılır ya da ayrı duran yer bağlanmış gibi yazılır. Öğrenci
       tam da bu iki hatayı yapıyor; çeldirici uydurma değil. */
    function ayrikHtml(bicimler, vurgu) {
        var i, c = [];
        for (i = 0; i < bicimler.length; i++) {
            c.push('<span class="tka-bic' + (vurgu && vurgu[i] ? ' tka-vurgu' : '') +
                   '">' + kacis(bicimler[i]) + '</span>');
        }
        return '<span class="tka-ayrik">' + c.join('') + '</span>';
    }
    function bicimlerinden(harfler, ileri) {
        var i, n = harfler.length, cik = [];
        for (i = 0; i < n; i++) {
            cik.push((i > 0 && ileri[i - 1] ? TATVIL : '') + harfler[i] +
                     (ileri[i] ? TATVIL : ''));
        }
        return cik;
    }
    function ayrikSoru(kaynak) {
        var k = kaynak || sec(KELIMELER);
        var n = k.h.length, i;
        var dogruIleri = [];
        for (i = 0; i < n; i++) dogruIleri.push((i < n - 1) && bagliMi(k.h[i]));

        /* Çevrilecek bağlantı noktası kümeleri: {0}, {1}, {0,1} */
        var kumeler = [[0], [1], [0, 1]];
        var siklar = [{ html: ayrikHtml(bicimlerinden(k.h, dogruIleri)), dogru: true }];
        var gorulen = {}; gorulen[siklar[0].html] = 1;
        for (i = 0; i < kumeler.length; i++) {
            var yanlis = dogruIleri.slice(), j;
            for (j = 0; j < kumeler[i].length; j++) {
                var p = kumeler[i][j];
                if (p < n - 1) yanlis[p] = !yanlis[p];
            }
            var h = ayrikHtml(bicimlerinden(k.h, yanlis));
            if (gorulen[h]) continue;
            gorulen[h] = 1;
            siklar.push({ html: h, dogru: false });
        }
        if (siklar.length !== 4) return null;
        return {
            tip: 'alfabe', alt: 'ayrik', soruTuru: 'arapca',
            soruHtml: '<span class="tka-kelime">' + kacis(k.h.join('')) + '</span>' +
                      '<span class="tka-anlam">' + kacis(k.anlam) + '</span>',
            ustlik: 'Bu kelimenin <b>harf harf</b> yazılışı hangisidir?',
            siklar: karistir(siklar)
        };
    }

    /* --- C) Boşluğa hangi biçim gelir? ------------------------------ */
    function boslukSoru(kaynak) {
        var k = kaynak || sec(KELIMELER);
        var c = coz(k.h), h = k.h[k.b];
        var dogruBicim = c[k.b].bicim;
        var adaylar = dortBicim(h), temiz = [], gor = {}, i;
        for (i = 0; i < adaylar.length; i++) {
            if (!gor[adaylar[i]]) { gor[adaylar[i]] = 1; temiz.push(adaylar[i]); }
        }
        if (temiz.length < 4 || temiz.indexOf(dogruBicim) < 0) return null;
        var parcalar = [];
        for (i = 0; i < c.length; i++) {
            parcalar.push(i === k.b
                ? '<span class="tka-bic tka-bosluk">؟</span>'
                : '<span class="tka-bic">' + kacis(c[i].bicim) + '</span>');
        }
        var siklar = karistir(temiz).map(function (b) {
            return { html: '<span class="tka-bic tka-bic-b">' + kacis(b) + '</span>',
                     dogru: b === dogruBicim };
        });
        return {
            tip: 'alfabe', alt: 'bosluk', soruTuru: 'arapca',
            soruHtml: '<span class="tka-ayrik">' + parcalar.join('') + '</span>' +
                      '<span class="tka-anlam">' + kacis(k.anlam) + '</span>',
            ustlik: 'Boşluğa hangi <b>yazılış</b> gelir?',
            siklar: siklar
        };
    }

    /* --- D) Çizgideki yazılış: doğru / yanlış duran ------------------ */
    function cizgiSoru(dogruAra) {
        var havuz = karistir(Object.keys(AD).filter(function (h) {
            return 'اأإآٱءةى'.indexOf(h) < 0;    /* kararsız biçimliler dışarıda */
        }));
        var harfler = havuz.slice(0, 4);
        var dogruSayi = dogruAra ? 1 : 3, siklar = [], i, y;
        for (i = 0; i < 4; i++) {
            if (i < dogruSayi) {
                siklar.push({
                    html: ucluHtml(dogruUclu(harfler[i])) +
                          '<span class="tka-etiket">' + ad(harfler[i]) + '</span>',
                    dogru: dogruAra
                });
            } else {
                y = yanlisUclu(harfler[i]);
                siklar.push({
                    html: ucluHtml(y.u, y.kaydir) +
                          '<span class="tka-etiket">' + ad(harfler[i]) + '</span>',
                    dogru: !dogruAra
                });
            }
        }
        return {
            tip: 'alfabe', alt: dogruAra ? 'cizgi-dogru' : 'cizgi-yanlis', soruTuru: 'cumle',
            soruHtml: dogruAra
                ? 'Çizgideki yazılışlardan <b>doğru</b> olan hangisidir?'
                : 'Çizgideki yazılışlardan <b>yanlış</b> olan hangisidir?',
            ustlik: 'Sırasıyla: <b>baş</b> — <b>orta</b> — <b>son</b> yazılışı.',
            siklar: karistir(siklar)
        };
    }

    /* --- E) Harfin istenen yazılışı hangisi? ------------------------
       Yalnız dört biçimi de FARKLI olan harflerde sorulur; bağlanmayan
       harflerde (د ر و…) baş ile yalın aynı çıkıyor, soru çözümsüz
       olurdu. */
    function konumSoru() {
        var uygun = Object.keys(AD).filter(function (h) {
            var d = dortBicim(h), s = {}, i, n = 0;
            for (i = 0; i < d.length; i++) if (!s[d[i]]) { s[d[i]] = 1; n++; }
            return n === 4;
        });
        if (!uygun.length) return null;
        var h = sec(uygun), d = dortBicim(h);
        var anahtar = ['n', 'b', 'o', 's'];
        var k = Math.floor(Math.random() * 4);
        var siklar = karistir(d.map(function (b, i) {
            return { html: '<span class="tka-bic tka-bic-b">' + kacis(b) + '</span>',
                     dogru: i === k };
        }));
        return {
            tip: 'alfabe', alt: 'konum', soruTuru: 'arapca',
            soruHtml: '<span class="tka-h">' + kacis(h) + '</span>' +
                      '<span class="tka-anlam">' + ad(h) + '</span>',
            ustlik: '<b>' + BICIM_AD[anahtar[k]] + '</b> yazılışı hangisidir?',
            siklar: siklar
        };
    }

    /* ---------------- 4. DENETİM + HAVUZ ----------------------------- */

    /* Boş dizge = soru sağlam. alfabe_sinav.js'in denetle()'siyle aynı
       ölçütler: tam 4 şık, tam 1 doğru, iki şık aynı olmayacak. */
    function denetle(s) {
        if (!s) return 'soru üretilemedi';
        if (!s.siklar || s.siklar.length !== 4) return 'şık sayısı 4 değil';
        var i, d = 0, gor = {};
        for (i = 0; i < 4; i++) {
            if (s.siklar[i].dogru) d++;
            if (gor[s.siklar[i].html]) return 'tekrar eden şık';
            gor[s.siklar[i].html] = 1;
        }
        if (d !== 1) return 'doğru şık sayısı ' + d;
        if (!s.soruHtml) return 'soru metni yok';
        return '';
    }

    /* Ders → soru tipi sırası. Sıra döndürülerek geziliyor ki bir turda
       aynı tip üst üste üç kez çıkmasın. */
    var DERSLER = [
        { id: 'alfabe-birlestirme', ad: 'Harf Birleştirme',
          uretecler: [bagSoru, ayrikSoru, boslukSoru] },
        { id: 'alfabe-cizgi',       ad: 'Çizgideki Yazılış',
          uretecler: [function () { return cizgiSoru(false); },
                      function () { return cizgiSoru(true); },
                      konumSoru] }
    ];

    function ders(id) {
        for (var i = 0; i < DERSLER.length; i++) if (DERSLER[i].id === id) return DERSLER[i];
        return null;
    }

    /* adet kadar soru üretir. Aynı soru iki kez çıkmasın diye üretilen
       her sorunun imzası (şıkların html'i + soru metni) tutuluyor. */
    function uret(dersId, adet) {
        var d = ders(dersId);
        if (!d) return [];
        var liste = [], gorulen = {}, kac = 0, sira = 0, no = 90000;
        while (liste.length < adet && kac++ < adet * 80) {
            var s = d.uretecler[sira++ % d.uretecler.length]();
            if (denetle(s) !== '') continue;
            var imza = s.soruHtml + '|' + s.siklar.map(function (x) { return x.html; }).join('|');
            if (gorulen[imza]) continue;
            gorulen[imza] = 1;
            s.id = no++;
            liste.push(s);
        }
        return liste;
    }

    /* ---------------- 5. GÖRÜNÜM ------------------------------------
       Kendi biçemini kendi taşır: alfabe.css 136 KB ve bu sayfaya
       yüklenmiyor. Yalnız bu soruların ihtiyacı olan kurallar var. */
    function bicemKur() {
        if (document.getElementById('tka-stil')) return;
        var st = document.createElement('style');
        st.id = 'tka-stil';
        st.textContent = [
            /* YÖN: soru kutusu ve şık düğmeleri RTL. Türkçe cümleler bu
               yüzden ters diziliyordu ("?doğru olan hangisidir" gibi).
               Çözüm direction:ltr TEK BAŞINA yetmiyor — satır içi bir öge
               yeni bir bidi katmanı açmadan yeniden sıralanmıyor; her
               birinde unicode-bidi:isolate ŞART. */
            '.tka-govde{display:block;direction:rtl;unicode-bidi:isolate}',
            '.quiz-question.tka-cumle .tka-govde{direction:ltr;font-size:.4em;line-height:1.24}',
            '.tka-ustlik{display:block;font-family:"Rubik",sans-serif;font-size:.3em;',
            '  direction:ltr;unicode-bidi:isolate;opacity:.78;margin-top:.35em;line-height:1.3}',
            '.quiz-question.tka-cumle .tka-ustlik{font-size:.26em}',
            '.quiz-player-area .quiz-question.tka{flex-direction:column;gap:.1em;padding:14px 18px}',

            /* ŞIKLAR: harf üstte, Türkçe adı altta. Düğmenin tek bir çocuğu
               var (sarmalayıcı span); sütun düzeni ONA verilmeli, düğmeye
               verilince sıralanacak ikinci bir çocuk olmadığı için hiçbir
               şey değişmiyordu. */
            '.quiz-options.tka .quiz-option-btn{direction:rtl;padding:8px 10px}',
            '.tka-sik{display:flex;flex-direction:column;align-items:center;',
            '  justify-content:center;gap:.1em;width:100%}',
            '.tka-h{font-size:1.75em;line-height:1.15;direction:rtl;unicode-bidi:isolate}',
            '.tka-etiket{display:block;width:100%;text-align:center;direction:ltr;',
            '  unicode-bidi:isolate;font-family:"Rubik",sans-serif;font-size:.36em;',
            '  color:#94a3b8;margin-top:2px}',
            '.tka-anlam{display:block;font-family:"Rubik",sans-serif;font-size:.26em;',
            '  opacity:.7;direction:ltr;unicode-bidi:isolate;margin-top:.15em}',
            '.tka-kelime{direction:rtl;unicode-bidi:isolate}',

            /* ÇİZGİ — ölçüler alfabe.css'teki .as-uclu'dan AYNEN alındı.
               Orada tek tek ölçülerek bulunmuşlar: taban, kutunun altından
               .266em yukarıda; .30em iç boşlukla .566em eder. Çizgi .50em'e,
               tabanın biraz altına konur → harfin gövdesi çizgiye oturur,
               kuyruğu çizginin ALTINDA kalır. Kaydırma da oradaki gibi
               bakışık değil (-.17em / +.14em): aşağı kayma gözle daha çabuk
               yakalandığı için daha az tutulmuş.
               Genişlik verilmiyor: çizgi üç biçim kadar olmalı, düğme kadar
               değil — yoksa satır çizgisi kutunun bir ucundan öbürüne
               uzayıp ölçüyü alınmaz hâle getiriyor. */
            '.tka-uclu{position:relative;display:flex;gap:.18em;direction:rtl;',
            '  unicode-bidi:isolate;align-items:flex-end;line-height:1;padding:0 .12em .30em}',
            '.tka-uclu::before{content:"";position:absolute;left:.04em;right:.04em;',
            '  bottom:.50em;height:3px;background:#cbd5e1;border-radius:2px}',
            '.tka-bic{display:inline-block;line-height:1}',
            '.tka-uclu .tka-bic{font-size:1em;line-height:1;padding:0 .05em}',
            '.tka-havada{transform:translateY(-.17em)}',   /* kuyruk çizgiye inmemiş */
            '.tka-batik{transform:translateY(.14em)}',     /* gövde çizginin altında */
            '.tka-ayrik{display:flex;flex-direction:row;direction:rtl;unicode-bidi:isolate;',
            '  justify-content:center;gap:.28em;flex-wrap:nowrap}',
            '.tka-bic-b{font-size:1.45em}',
            '.tka-bosluk{opacity:.45}',
            /* Arapça yazı tipinin kalın kesimi yok; tarayıcı sentetik
               kalınlaştırma yapınca harfler hamurlaşıyor (alfabe.css'te de
               aynı önlem var). */
            '.tka-h,.tka-bic,.tka-kelime{font-weight:400;font-synthesis:none;',
            '  font-synthesis-weight:none;-webkit-text-stroke:0}',
            '.tka-vurgu{color:var(--accent-color)}'
        ].join('\n');
        document.head.appendChild(st);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bicemKur);
    } else { bicemKur(); }

    window.TKAlfabe = {
        dersler: DERSLER.map(function (d) { return { id: d.id, ad: d.ad }; }),
        uret: uret,
        denetle: denetle,
        /* ölçüm için dışarı açılanlar — t_tkalfabe.py bunları
           alfabe_sinav.js'in karşılıklarıyla kıyaslıyor */
        kural: { birlesmez: BIRLESMEZ, tatvil: TATVIL },
        coz: coz, dortBicim: dortBicim, dogruUclu: dogruUclu,
        kelimeler: KELIMELER
    };
})();
