/* =====================================================================
   KISMİ ÖLÇME — «KENDİNİ DENE»            (okumayazma/alfabe_akordiyon.js)
   ---------------------------------------------------------------------
   Sınav sekmesi 20 soruluk TAM bir turdur. Öğretmenin istediği ise konu
   konu ölçme: harfleri yeni tanıttın, hemen orada iki soru sor;
   birleştirmeyi anlattın, sayfadan çıkmadan orada sına.

   NEREDEN AÇILIR: kumandadaki şeritte, ALFABE bölümünün İÇİNDE — her test
   kendi konusunun hemen altında bir alt madde olarak:

     Harf Tanıtımı
     └ Kendini Dene   → okunuşu/yazılışı benzer harfler (tip 1-4)
                        ve benzerlerin eşleştirilmesi (tip 7-8)
     Harf Birleştirme
     └ Kendini Dene   → çizgideki yazılışlar (tip 5-6) ve
                        kelimedeki boşluğa gelen biçim (tip 9)
     Okuma
     └ Kendini Dene   → hece/kelime okunuşu, işaretin ne yaptığı ve
                        okunuştan kelimeyi bulma (okuma-cevir.js üretir)
     Dinle ve Yaz

   Ayrı bir başlık açılmadı: bunlar alfabenin kendi etkinlikleri, konuyu
   anlattığın yerden erişilmeli.

   NASIL AÇILIR: TAM EKRAN. Sınıfa yansıtılacağı için panelin içine
   sıkıştırılmadı; ekranı baştan başa kaplayan bir katman açılıyor ve
   her şey (soru, şıklar, harfler) tahtanın arkasından okunacak puntoda.

   Sorular UYDURULMAZ: harf konularının soruları alfabe_sinav.js'in kendi
   üreteçlerinden (AlfabeSinav.uret) gelir ve yine onun denetle()'sinden
   geçer. Böylece «Kendini Dene» ile Sınav sekmesi aynı soruları, aynı
   kurallarla sorar; ikisi ayrışamaz.

   OKUMA'nın soruları ise okuma-cevir.js'ten gelir (KidefOkumaCevir.
   sinavHavuzu): o sekmenin kendi kelimeleri ve kendi okunuş kuralları.
   Bir bölüm kendi üreticisini getiriyorsa (uretici alanı) havuz ondan
   kurulur; getirmiyorsa tiplerden. Katman ikisini de aynı biçimde çizer:
     { tip, bicim:'test', metin, ustlik, siklar:[{html,dogru}] }
   ===================================================================== */
(function () {
    'use strict';
    if (window.AlfabeAkordiyon) return;

    /* Bir turda kaç soru — öğretmen seçer, seçim saklanır.
       Hazır üç seçenek: kısa yoklama (3), normal (5), uzun tur (10). */
    var SORU_SECENEK = [3, 5, 10];
    var SORU_ANAHTAR = 'kidef_ak_soru';
    var soruSayisi = 5;
    try {
        var _sv = parseInt(localStorage.getItem(SORU_ANAHTAR), 10);
        if (SORU_SECENEK.indexOf(_sv) >= 0) soruSayisi = _sv;
    } catch (e) {}
    function soruSayisiYaz(n) {
        if (SORU_SECENEK.indexOf(n) < 0) return;
        soruSayisi = n;
        try { localStorage.setItem(SORU_ANAHTAR, String(n)); } catch (e) {}
    }

    var GERI_SAY_MS  = 900;    /* 3-2-1 arası                        */
    var CEVAP_BEKLE  = 1600;   /* cevaplar açıkken bakılacak süre     */
    var HAZIR_MS     = 1500;   /* «Hazır ol» perdesi                  */
    var DOGRU_PUAN  = 10;         /* iki kişilik: her doğru           */
    var HIZ_PUAN    = 5;          /* iki kişilik: doğru bilenden önce */
    var MOD_ANAHTAR = 'kidef_ak_mod';

    /* Tek kişilik mi iki kişilik mi? Öğretmen bir kez seçsin, her
       açılışta baştan seçmesin diye saklanıyor. */
    var mod = 1;
    try { mod = (localStorage.getItem(MOD_ANAHTAR) === '2') ? 2 : 1; } catch (e) {}
    function modYaz(n) {
        mod = (n === 2) ? 2 : 1;
        try { localStorage.setItem(MOD_ANAHTAR, String(mod)); } catch (e) {}
    }

    /* Hangi başlık hangi tipleri sorar. */
    var BOLUMLER = [
        {
            anahtar: 'p1',
            baslik: 'Harf Tanıtımı',
            not: function () { return soruSayisi + ' soru · okunuşu ve yazılışı benzeyen harfler'; },
            tipler: [1, 2, 3, 4, 7, 8],
            ikon: '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                  '<rect x="2.6" y="3.4" width="18.8" height="17.2" rx="2.6" fill="#F7FAFC" stroke="#0E6655" stroke-width="1.3"/>' +
                  '<rect x="5" y="6" width="5.4" height="4.6" rx="1" fill="#3498db"/>' +
                  '<rect x="11.4" y="6" width="5.4" height="4.6" rx="1" fill="#9b59b6"/>' +
                  '<path d="M5.6 14h7.2M5.6 17.2h4.6" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>' +
                  '<circle cx="17.2" cy="16.4" r="3.9" fill="#2ecc71"/>' +
                  '<path d="M15.4 16.5l1.3 1.3 2.4-2.6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {
            anahtar: 'p5',
            baslik: 'Harf Birleştirme',
            not: function () { return soruSayisi + ' soru · çizgideki yazılışlar ve boşluk doldurma'; },
            tipler: [5, 6, 9],
            ikon: '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                  '<path d="M3 15.6h18" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>' +
                  '<path d="M4.8 15.3V10a2.3 2.3 0 0 1 4.6 0v5.3" fill="none" stroke="#2ecc71" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
                  '<path d="M9.4 15.3v-2.5a2.2 2.2 0 0 1 4.4 0v2.5" fill="none" stroke="#3498db" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
                  '<circle cx="18.2" cy="16.6" r="3.9" fill="#2ecc71"/>' +
                  '<path d="M16.4 16.7l1.3 1.3 2.4-2.6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {
            /* OKUMA — soruları alfabe_sinav.js'ten DEĞİL, okuma-cevir.js'ten
               gelir: o sekmenin kendi kelimeleri, kendi okunuşları. Bu yüzden
               tip listesi boş, yerine bir üretici veriliyor. */
            anahtar: 'p8',
            baslik: 'Okuma',
            not: function () { return soruSayisi + ' soru · hece, uzatma, cezim ve şedde okunuşları'; },
            tipler: [],
            uretici: function (adet) {
                var O = window.KidefOkumaCevir;
                return (O && O.sinavHavuzu) ? O.sinavHavuzu(adet) : [];
            }
        }
    ];

    /* ---------------- küçük yardımcılar ---------------- */

    function kacis(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function tik() {
        if (typeof window.playClick === 'function') { try { window.playClick(); } catch (e) {} }
    }
    function dogruSes() {
        if (typeof window.playCorrect === 'function') { try { window.playCorrect(); } catch (e) {} }
    }
    function yanlisSes() {
        if (typeof window.playWrong === 'function') { try { window.playWrong(); } catch (e) {} }
    }
    function S() { return window.AlfabeSinav; }
    function karistir(a) {
        var i, j, t;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /* Verilen tiplerden, tipleri sırayla gezerek soru havuzu kurar.
       Her soru AlfabeSinav.denetle()'den geçer; geçmeyen atılır. */
    function havuz(tipler, adet) {
        var A = S(); if (!A) return [];
        var liste = [], kac = 0, i = 0;
        var sirali = tipler.slice();
        for (var x = sirali.length - 1; x > 0; x--) {
            var y = Math.floor(Math.random() * (x + 1)), t = sirali[x];
            sirali[x] = sirali[y]; sirali[y] = t;
        }
        while (liste.length < adet && kac++ < adet * 60) {
            var s = A.uret(sirali[i++ % sirali.length]);
            if (A.denetle(s) !== '') continue;
            liste.push(s);
        }
        return liste;
    }

    /* ---------------- soru çizimi ----------------
       Sınıflar bilerek alfabe_sinav.js'inkilerle AYNI (as-sik, as-mark,
       as-ic, as-es…): alfabe.css bu sayfada zaten yüklü, biçim oradan
       geliyor. Puntolar #ak-tam içinde tahtaya göre BÜYÜTÜLÜYOR. */

    /* --- 9. TİP: KELİME KUTUSU ---------------------------------------
       Kelime AYRIK GÖSTERİLMEZ. Harfler bitişik dursun ki çocuk "şu
       harfin ortadaki yazılışı" derken kelimeyi gerçek hâliyle görsün.

       Üç çizim durumu var:
         dolu=false            eksik harfin yeri boş kutu; kalan harfler
                               bağlam biçimleriyle (tatvilli) YAN YANA,
                               aralarında boşluk YOK → bitişik görünür.
         dolu=true,  bitisik=false  harf yerine oturdu, hâlâ tatvilli.
         dolu=true,  bitisik=true   spanlar display:inline ve harfler YALIN;
                               tarayıcının kendi şekillendiricisi kelimeyi
                               gerçekten birleştirir. Son hâl budur.

       inline-block ŞEKİLLENDİRMEYİ BÖLER — "ayrık" hâl bundan yararlanır;
       "bitişik" hâlde inline'a dönülmesinin sebebi de budur. */
    var TATVIL = 'ـ';

    function kelimeIc(s, dolu, bitisik) {
        var c = s.cozum, p = [], i, t;
        for (i = 0; i < c.length; i++) {
            if (i === s.kelime.b && !dolu) {
                p.push('<span class="ak-bos" data-rol="bosluk">' + TATVIL + '</span>');
            } else {
                t = bitisik ? c[i].harf : c[i].bicim;
                p.push('<span class="ak-par' + (i === s.kelime.b ? ' ak-yeni' : '') +
                       '">' + kacis(t) + '</span>');
            }
        }
        return '<span class="ak-kelime' + (bitisik ? ' ak-bitisik' : '') + '">' +
               p.join('') + '</span>' +
               '<span class="ak-anlam">(' + kacis(s.kelime.anlam) + ')</span>';
    }

    function kelimeKutusu(s) {
        if (s.tip !== 9 || !s.kelime || !s.cozum) return '';
        return '<div class="ak-kelimekutu" data-rol="kelimekutu">' +
               kelimeIc(s, false, false) + '</div>';
    }

    /* Doğru harf şıktan KOPARAK boşluğa uçar, oraya oturur, sonra kelime
       yavaşça birleşir. Süreler bilerek uzun: sınıfta gözle takip edilecek. */
    var UCUS_MS = 1400, OTURMA_MS = 1500, BIRLESME_MS = 900;

    function ucus(s, bit) {
        var kutu = sahne.querySelector('[data-rol="kelimekutu"]');
        var hedef = sahne.querySelector('[data-rol="bosluk"]');
        var kaynak = sahne.querySelector('.as-sik.as-dogru .as-bic') ||
                     sahne.querySelector('.as-sik.as-dogru .as-ic');
        if (!kutu || !hedef || !kaynak) { if (bit) bit(); return; }
        var a = kaynak.getBoundingClientRect(), b = hedef.getBoundingClientRect();
        var k = kutu.getBoundingClientRect();
        var ucan = document.createElement('span');
        ucan.className = 'ak-ucan';
        ucan.textContent = s.dogruBicim;
        ucan.style.left = (a.left - k.left) + 'px';
        ucan.style.top = (a.top - k.top) + 'px';
        ucan.style.width = a.width + 'px';
        ucan.style.height = a.height + 'px';
        kutu.appendChild(ucan);
        var dx = (b.left + b.width / 2) - (a.left + a.width / 2);
        var dy = (b.top + b.height / 2) - (a.top + a.height / 2);
        /* YENİDEN AKIŞ ZORLANIYOR: öge daha yeni eklendi; başlangıç konumu
           henüz hesaplanmadan dönüşüm yazılırsa tarayıcı ikisini tek
           değişiklik sayıp geçişi HİÇ oynatmıyor — harf doğrudan hedefte
           beliriyordu (ölçüldü: 14 karede x hiç değişmedi). offsetWidth
           okuması başlangıç konumunu kesinleştiriyor.
           Not: rAF tek başına yetmedi, bu yüzden ikisi birlikte. */
        void ucan.offsetWidth;
        requestAnimationFrame(function () {
            ucan.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        });
        setTimeout(function () {
            ucan.style.opacity = '0';
            kutu.innerHTML = kelimeIc(s, true, false);     /* harf yerine oturdu */
            setTimeout(function () {
                kutu.innerHTML = kelimeIc(s, true, true);  /* kelime birleşti */
                if (bit) bit();
            }, BIRLESME_MS);
        }, OTURMA_MS);
    }

    /* Cevap sonrası: 9. tipte önce uçuş oynar, İleri ondan sonra açılır. */
    function ileriAc(s) {
        var ileri = sahne.querySelector('[data-rol="sonraki"]');
        if (s && s.tip === 9) {
            if (ileri) ileri.hidden = true;
            ucus(s, function () { if (ileri) ileri.hidden = false; });
        } else if (ileri) { ileri.hidden = false; }
    }

    /* Şıkları BİR OYUNCU İÇİN çizer. İki kişilikte her oyuncuya ayrı
       karıştırılmış kopya verilir: yandaki ekrana bakıp konumdan kopya
       çekilemesin. Doğruluk metinden değil data-d bayrağından okunur —
       şıkların içi HTML, iki şıkkın düz metni aynı çıkabilir. */
    function siklarHtml(siklar) {
        var g = '<div class="as-siklar ak-siklar">';
        siklar.forEach(function (x, i) {
            g += '<button type="button" class="as-sik" data-i="' + i +
                 '" data-d="' + (x.dogru ? 1 : 0) + '">' +
                 '<span class="as-mark">' + 'ABCD'.charAt(i) + '</span>' +
                 '<span class="as-ic">' + x.html + '</span></button>';
        });
        return g + '</div>';
    }

    function ikiliHtml(s) {
        /* İKİ OYUNCUYA AYRI SIRA. İki bağımsız karıştırma dört şıkta 1/24
           ihtimalle AYNI diziyi veriyor; o soruda yandaki ekrandan konuma
           bakıp kopya çekilebiliyor. Çakışırsa yeniden karıştırılıyor,
           takılmasın diye sayaçlı; son çare bir kaydırma. */
        var imza = function (a) { return a.map(function (x) { return x.html; }).join('|'); };
        var s1 = karistir(s.siklar.slice());
        var s2 = karistir(s.siklar.slice()), kac = 0;
        while (imza(s1) === imza(s2) && kac++ < 20) s2 = karistir(s.siklar.slice());
        if (imza(s1) === imza(s2)) s2 = s2.slice(1).concat(s2.slice(0, 1));
        var sira = { 1: s1, 2: s2 };
        var g = '<div class="ak-ikili">';
        [1, 2].forEach(function (n) {
            g += '<section class="ak-oy ak-o' + n + '" data-oyuncu="' + n + '">' +
                 '  <header class="ak-oybas"><span class="ak-oyad">' + n + '. Oyuncu</span>' +
                 '    <span class="ak-oypuan" data-rol="puan' + n + '">0</span></header>' +
                 siklarHtml(sira[n]) +
                 '  <div class="ak-oydurum" data-rol="durum' + n + '"></div>' +
                 '</section>';
        });
        return g + '</div>';
    }

    function soruHtml(s, no, toplam) {
        var g = '<div class="ak-sayac">' + no + ' / ' + toplam + '</div>';
        g += kelimeKutusu(s);
        g += '<div class="as-metin ak-metin">' + s.metin + '</div>';
        g += s.ustlik || '';
        if (mod === 2) {
            /* İki kişilikte soru ORTAK, şıklar ayrı. Eşleştirme soruları
               bu kipe hiç girmiyor (bkz. turBaslat): dört çift eşleştirmek
               bir yarış değil, ekranı da ikiye bölünce sığmıyor. */
            g += ikiliHtml(s);
            g += '<div class="as-geri-bildirim ak-bildirim" data-rol="bildirim"></div>';
            /* Sonraki düğmesi yok: geçiş otomatik (bkz. otomatikGec). */
            g += '<div class="ak-alt">' +
                 '<button type="button" class="ak-t ak-ikincil" data-rol="coz">Cevapları aç</button>' +
                 '</div>';
            return g;
        }
        if (s.bicim === 'eslestir') {
            g += '<div class="as-esalan"><div class="as-sutun" data-yan="sol">';
            s.ciftler.forEach(function (c, i) {
                g += '<button type="button" class="as-es" data-yan="sol" data-h="' +
                     kacis(c.sol) + '" data-i="' + i + '">' + kacis(c.sol) + '</button>';
            });
            g += '</div><div class="as-sutun" data-yan="sag">';
            s.saglar.forEach(function (h) {
                g += '<button type="button" class="as-es" data-yan="sag" data-h="' +
                     kacis(h) + '">' + kacis(h) + '</button>';
            });
            g += '</div></div>';
        } else {
            g += siklarHtml(s.siklar);
        }
        g += '<div class="as-geri-bildirim ak-bildirim" data-rol="bildirim"></div>';
        g += '<div class="ak-alt">' +
             '<button type="button" class="ak-t" data-rol="sonraki" hidden>Sonraki ›</button>' +
             '</div>';
        return g;
    }

    function ikiliSonucHtml(puan, toplam) {
        var t1 = puan[1].dogru + puan[1].hiz, t2 = puan[2].dogru + puan[2].hiz;
        var soz = t1 > t2 ? '1. Oyuncu kazandı!' : (t2 > t1 ? '2. Oyuncu kazandı!' : 'Berabere!');
        var yan = function (n, t) {
            return '<div class="ak-sonoy ak-o' + n + '">' +
                   '  <div class="ak-sonoyad">' + n + '. Oyuncu</div>' +
                   '  <div class="ak-sonoytop">' + t + '</div>' +
                   '  <div class="ak-sonoyayr">doğruluk ' + puan[n].dogru +
                   '    · hız ' + puan[n].hiz + '</div></div>';
        };
        return '<div class="ak-sonuc">' +
               '  <div class="ak-sonsay">' + soz + '</div>' +
               '  <div class="ak-sonikili">' + yan(1, t1) + yan(2, t2) + '</div>' +
               '  <div class="ak-sonsoz">' + toplam + ' soru · her doğru ' + DOGRU_PUAN +
               ' puan, önce bilene ' + HIZ_PUAN + ' puan hız</div>' +
               '  <div class="ak-alt">' +
               '    <button type="button" class="ak-t" data-rol="yeniden">Yeniden dene</button>' +
               '    <button type="button" class="ak-t ak-ikincil" data-rol="kisi">Kişi sayısı</button>' +
               '    <button type="button" class="ak-t ak-ikincil" data-rol="kapat">Kapat</button>' +
               '  </div></div>';
    }

    function sonucHtml(dogru, toplam) {
        var yuzde = Math.round(100 * dogru / toplam);
        var soz = yuzde >= 80 ? 'Bu konuyu biliyorsun.'
                : yuzde >= 50 ? 'Fena değil — bir tur daha dene.'
                : 'Tabloya bir daha bak, sonra tekrar gel.';
        return '<div class="ak-sonuc">' +
               '  <div class="ak-sonsay"><b>' + dogru + ' / ' + toplam + '</b> doğru' +
               '    <span class="ak-yuzde">%' + yuzde + '</span></div>' +
               '  <div class="ak-sonsoz">' + soz + '</div>' +
               '  <div class="ak-alt">' +
               '    <button type="button" class="ak-t" data-rol="yeniden">Yeniden dene</button>' +
               '    <button type="button" class="ak-t ak-ikincil" data-rol="kisi">Kişi sayısı</button>' +
               '    <button type="button" class="ak-t ak-ikincil" data-rol="kapat">Kapat</button>' +
               '  </div></div>';
    }

    function bildir(sahne, hal, yazi) {
        var b = sahne.querySelector('[data-rol="bildirim"]');
        if (!b) return;
        var bas = hal === 'iyi' ? '✔ Doğru.' : (hal === 'orta' ? '◐ Tamamlandı.' : '✘ Yanlış.');
        b.className = 'as-geri-bildirim ak-bildirim as-' + hal;
        b.innerHTML = yazi ? (bas + ' ' + yazi) : bas;
    }

    /* ---------------- GİRİŞ EKRANI ----------------------------------
       «Dene»ye basınca sorular hemen gelmiyor: önce KAÇ KİŞİ oynayacağı
       soruluyor ve iki kişiliğin kuralları yazıyor. Sınıfta tahtaya iki
       öğrenci kalkacaksa neye göre yarışacaklarını baştan bilmeliler.

       Görseller CANLI: tek kişilikte öğrenci defterine tik atar, iki
       kişilikte iki öğrenci sırayla öne çıkar ve aralarında şimşek çakar.
       SVG'ler burada duruyor, kıpırtıları bicemKur()'daki @keyframes'te. */

    var SVG_TEK =
        '<svg class="ak-svg" viewBox="0 0 132 88" aria-hidden="true" focusable="false">' +
        '<rect x="14" y="66" width="104" height="6" rx="3" fill="#D7E3EF"/>' +
        '<g class="ak-og ak-og1">' +
        '  <circle cx="48" cy="26" r="13" fill="#3498db"/>' +
        '  <path d="M26 66c0-13 10-22 22-22s22 9 22 22z" fill="#2E86C1"/></g>' +
        '<rect x="76" y="44" width="38" height="24" rx="4" fill="#fff" stroke="#0E6655" stroke-width="2"/>' +
        '<path class="ak-tik" d="M83 57l6 6 13-15" fill="none" stroke="#2ecc71" stroke-width="4.2" ' +
        '  stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var SVG_IKI =
        '<svg class="ak-svg" viewBox="0 0 132 88" aria-hidden="true" focusable="false">' +
        '<rect x="8" y="66" width="116" height="6" rx="3" fill="#D7E3EF"/>' +
        '<g class="ak-og ak-og1">' +
        '  <circle cx="30" cy="30" r="12" fill="#3498db"/>' +
        '  <path d="M10 66c0-12 9-20 20-20s20 8 20 20z" fill="#2E86C1"/></g>' +
        '<g class="ak-og ak-og2">' +
        '  <circle cx="102" cy="30" r="12" fill="#9b59b6"/>' +
        '  <path d="M82 66c0-12 9-20 20-20s20 8 20 20z" fill="#8E44AD"/></g>' +
        '<path class="ak-simsek" d="M70 12L54 40h10l-6 22 20-28H68z" fill="#F1C40F" ' +
        '  stroke="#E67E22" stroke-width="1.8" stroke-linejoin="round"/></svg>';

    var SVG_SIMSEK =
        '<svg class="ak-mini ak-simsek" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M13.6 2L5.4 14h5.2L9.2 22l8.6-12.4h-5.4z" fill="#F1C40F" stroke="#E67E22" ' +
        '  stroke-width="1.3" stroke-linejoin="round"/></svg>';

    var SVG_KUPA =
        '<svg class="ak-mini ak-kupa" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M7 3.6h10v5.2a5 5 0 0 1-10 0z" fill="#F1C40F" stroke="#D4A017" stroke-width="1.2"/>' +
        '<path d="M7 5H4.4a3.6 3.6 0 0 0 3.6 3.6M17 5h2.6A3.6 3.6 0 0 1 16 8.6" fill="none" ' +
        '  stroke="#D4A017" stroke-width="1.4"/>' +
        '<path d="M10.6 13.8h2.8v3.2h-2.8z" fill="#D4A017"/>' +
        '<rect x="7.8" y="17" width="8.4" height="2.8" rx="1.4" fill="#B8860B"/></svg>';

    var SVG_GOZ =
        '<svg class="ak-mini" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M2.6 12S6.4 5.6 12 5.6 21.4 12 21.4 12 17.6 18.4 12 18.4 2.6 12 2.6 12z" ' +
        '  fill="#fff" stroke="#0E6655" stroke-width="1.5"/>' +
        '<circle cx="12" cy="12" r="3.1" fill="#0E6655"/>' +
        '<path class="ak-cizik" d="M4 20L20 4" stroke="#e74c3c" stroke-width="2.2" stroke-linecap="round"/></svg>';

    var SVG_SAYIM =
        '<svg class="ak-mini" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="13" r="8.4" fill="#fff" stroke="#0E6655" stroke-width="1.6"/>' +
        '<path d="M9.4 2.6h5.2" stroke="#0E6655" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path class="ak-akrep" d="M12 13V8.2" stroke="#e74c3c" stroke-width="1.9" stroke-linecap="round"/></svg>';

    /* İki kişiliğin kuralları — kodda gerçekten böyle işliyor (bkz.
       ikiliHtml, ikiliCevap, ikiliCoz, otomatikGec). */
    function kurallar(n) {
        if (n === 2) {
            return [
                [SVG_GOZ,    'Soru <b>ortak</b>, şıklar iki ekranda <b>ayrı</b> dizilir — yandakine bakıp kopya çekilemez.'],
                [SVG_SAYIM,  'Cevabını veren bekler; ikisi de cevaplayınca renkler <b>birlikte</b> açılır. Biri cevaplamazsa «Cevapları aç».'],
                [SVG_SIMSEK, 'Her doğru <b>+' + DOGRU_PUAN + '</b> puan; doğru bilenlerden <b>önce</b> basana <b>+' + HIZ_PUAN + '</b> hız puanı.'],
                [SVG_KUPA,   '<b>3 · 2 · 1</b> sayımıyla başlar, sorular kendiliğinden ilerler. Sonunda puanı yüksek olan kazanır.']
            ];
        }
        return [
            [SVG_SAYIM, 'Her soruda bir şık seç; doğru mu yanlış mı <b>hemen</b> görünür.'],
            [SVG_KUPA,  'Sonunda <b>kaç doğru</b> yaptığın yazar; «Yeniden dene» ile yeni sorular gelir.']
        ];
    }

    function girisHtml(b) {
        var kart = function (n, svg, ad, alt) {
            return '<button type="button" class="ak-kart' + (mod === n ? ' secili' : '') +
                   '" data-secmod="' + n + '" aria-pressed="' + (mod === n) + '">' +
                   '<span class="ak-kart-gorsel">' + svg + '</span>' +
                   '<span class="ak-kart-ad">' + ad + '</span>' +
                   '<span class="ak-kart-not">' + alt + '</span></button>';
        };
        return '<div class="ak-giris">' +
               '  <div class="ak-giris-bas">Kaç kişi oynayacak?</div>' +
               '  <div class="ak-kartlar">' +
               kart(1, SVG_TEK, 'Tek kişilik', 'Kendi başına çöz') +
               kart(2, SVG_IKI, 'İki kişilik', 'İki öğrenci tahtada yarışır') +
               '  </div>' +
               '  <ul class="ak-kural" data-rol="kural">' + kuralHtml(mod) + '</ul>' +
               '  <div class="ak-giris-alt">' +
               '    <span class="ak-giris-not">' + soruSayisi + ' soru &middot; sayıyı yukarıdan değiştirebilirsin</span>' +
               '    <button type="button" class="ak-t" data-rol="akbasla">Başla ▸</button>' +
               '  </div></div>';
    }
    function kuralHtml(n) {
        return kurallar(n).map(function (k) {
            return '<li>' + k[0] + '<span>' + k[1] + '</span></li>';
        }).join('');
    }
    function girisGoster() {
        zamanTemizle(); perdeKapat();
        if (aktif) aktif.giris = true;
        var b = bolumBul(aktif && aktif.anahtar);
        if (!b) return;
        sahne.innerHTML = girisHtml(b);
    }
    /* Kart değişince yalnız kurallar ve işaretler tazelenir — ekran zıplamasın. */
    function girisTazele() {
        var u = sahne.querySelector('[data-rol="kural"]');
        if (u) u.innerHTML = kuralHtml(mod);
        [].forEach.call(sahne.querySelectorAll('.ak-kart'), function (k) {
            var se = +k.dataset.secmod === mod;
            k.classList.toggle('secili', se);
            k.setAttribute('aria-pressed', se ? 'true' : 'false');
        });
        var n = sahne.querySelector('.ak-giris-not');
        if (n) n.innerHTML = soruSayisi + ' soru &middot; sayıyı yukarıdan değiştirebilirsin';
    }
    function bolumBul(anahtar) {
        for (var i = 0; i < BOLUMLER.length; i++) if (BOLUMLER[i].anahtar === anahtar) return BOLUMLER[i];
        return null;
    }

    /* ---------------- tam ekran katman ---------------- */

    var katman = null, sahne = null, basEl = null, notEl = null;
    var seritAcikti = false;   /* test açılırken kumanda şeridi açık mıydı? */
    var aktif = null;          /* o an açık bölümün durumu */
    var durumlar = {};         /* {p1: {...}, p5: {...}} */

    function katmanKur() {
        if (katman) return;
        katman = document.createElement('div');
        katman.id = 'ak-tam';
        katman.hidden = true;
        katman.innerHTML =
            '<div class="ak-cerceve">' +
            '  <header class="ak-bas">' +
            '    <span class="ak-bas-yazi"><b data-rol="baslik">Kendini Dene</b>' +
            '      <span class="ak-not" data-rol="not"></span></span>' +
            '    <div class="ak-mod" role="group" aria-label="Soru sayısı">' +
            SORU_SECENEK.map(function (n) {
                return '<button type="button" class="ak-adetb" data-adet="' + n + '">' + n + '</button>';
            }).join('') +
            '    </div>' +
            '    <div class="ak-mod" role="group" aria-label="Oyuncu sayısı">' +
            '      <button type="button" class="ak-modb" data-mod="1">Tek kişilik</button>' +
            '      <button type="button" class="ak-modb" data-mod="2">İki kişilik</button>' +
            '    </div>' +
            '    <button type="button" class="ak-kapa" data-rol="kapat" aria-label="Kapat">✕</button>' +
            '  </header>' +
            '  <div class="ak-sahne" data-rol="sahne"></div>' +
            '  <div class="ak-ortu" data-rol="ortu" hidden>' +
            '    <div class="ak-ortuic" data-rol="ortuic"></div></div>' +
            '</div>';
        document.body.appendChild(katman);
        sahne = katman.querySelector('[data-rol="sahne"]');
        basEl = katman.querySelector('[data-rol="baslik"]');
        notEl = katman.querySelector('[data-rol="not"]');

        katman.addEventListener('click', function (e) {
            var t = e.target; if (!t || !t.closest) return;
            var d = t.closest('[data-rol]');
            var rol = d && d.dataset ? d.dataset.rol : '';
            if (rol === 'kapat')   { tik(); kapat(); return; }
            if (rol === 'sonraki') { tik(); aktif.i++; soruGoster(); return; }
            if (rol === 'yeniden') { tik(); turBaslat(); return; }
            if (rol === 'kisi')    { tik(); girisGoster(); return; }
            /* Rol adı bilerek 'akbasla': Sınav sekmesinde de data-rol="basla"
               taşıyan bir düğme var, belge genelinde karışmasın. */
            if (rol === 'akbasla')   { tik(); turBaslat(); return; }
            /* Giriş ekranındaki kişi sayısı kartları */
            var kk = t.closest('.ak-kart');
            if (kk) { tik(); modYaz(+kk.dataset.secmod); modIsaretle(); girisTazele(); return; }
            var giriste = !!(aktif && aktif.giris);
            var mb = t.closest('.ak-modb');
            if (mb) {
                tik(); modYaz(+mb.dataset.mod); modIsaretle();
                if (giriste) girisTazele(); else turBaslat();
                return;
            }
            var ab = t.closest('.ak-adetb');
            if (ab) {
                tik(); soruSayisiYaz(+ab.dataset.adet); modIsaretle();
                var bb = bolumBul(aktif && aktif.anahtar);
                if (notEl && bb) notEl.textContent = bb.not();
                if (giriste) girisTazele(); else turBaslat();
                return;
            }
            var s = aktif && aktif.havuz[aktif.i];
            if (!s) return;
            /* «Cevapları aç»: iki kişilikte biri cevap vermezse tur burada
               takılmasın — cevaplamayan boş sayılır. */
            if (rol === 'coz') { tik(); ikiliCoz(s); return; }
            var dg;
            if ((dg = t.closest('.as-sik')) && s.bicim === 'test')      { tik(); testCevap(s, dg); return; }
            if ((dg = t.closest('.as-es'))  && s.bicim === 'eslestir')  { tik(); esCevap(s, dg); return; }
        });

        /* Esc kapatır. #p5 belge düzeyinde ok/boşluk/enter'ı yutuyor
           (alfabe_birlestir.js); katman açıkken bu tuşlar oraya ULAŞMASIN,
           yoksa arkadaki slayt kayıyor. */
        document.addEventListener('keydown', function (e) {
            if (katman.hidden) return;
            if (e.key === 'Escape') { kapat(); return; }
            e.stopPropagation();
        }, true);
    }

    /* --- PERDE: 3-2-1 geri sayımı ve «Hazır ol» -----------------------
       Zamanlayıcılar tek yerde toplanıyor: tur yenilenince, kip değişince
       ya da katman kapanınca hepsi iptal ediliyor. Yoksa eski bir sayım
       yeni turun üstüne düşüyor. */
    var zaman = [];
    function zamanKur(f, ms) { var t = setTimeout(f, ms); zaman.push(t); return t; }
    function zamanTemizle() {
        for (var i = 0; i < zaman.length; i++) clearTimeout(zaman[i]);
        zaman = [];
    }
    function perdeAc(ic, sinif) {
        if (!katman) return;
        var o = katman.querySelector('[data-rol="ortu"]');
        var k = katman.querySelector('[data-rol="ortuic"]');
        if (!o || !k) return;
        o.className = 'ak-ortu' + (sinif ? ' ' + sinif : '');
        k.innerHTML = ic;
        o.hidden = false;
    }
    function perdeKapat() {
        if (!katman) return;
        var o = katman.querySelector('[data-rol="ortu"]');
        if (o) o.hidden = true;
    }

    /* 3'ten geriye: başlarken sorular hemen gelmesin, sınıf hazırlansın. */
    function geriSay(bit) {
        var n = 3;
        var adim = function () {
            if (n <= 0) { perdeKapat(); if (bit) bit(); return; }
            perdeAc('<span class="ak-sayi">' + n + '</span>', 'sayim');
            /* Her sayıda animasyon baştan oynasın diye yeniden akış. */
            var e = katman.querySelector('.ak-sayi');
            if (e) { e.classList.remove('oyna'); void e.offsetWidth; e.classList.add('oyna'); }
            tik();
            n--;
            zamanKur(adim, GERI_SAY_MS);
        };
        adim();
    }

    /* İki soru arası: «hazır ol, sıradaki geliyor». */
    function hazirOl(bit) {
        perdeAc('<span class="ak-hazir">Hazır ol!</span>' +
                '<span class="ak-hazirnot">Sıradaki soru geliyor…</span>', 'hazir');
        zamanKur(function () { perdeKapat(); if (bit) bit(); }, HAZIR_MS);
    }

    function modIsaretle() {
        if (!katman) return;
        var d = katman.querySelectorAll('.ak-modb'), i;
        for (i = 0; i < d.length; i++) {
            d[i].classList.toggle('secili', +d[i].dataset.mod === mod);
            d[i].setAttribute('aria-pressed', (+d[i].dataset.mod === mod) ? 'true' : 'false');
        }
        var a = katman.querySelectorAll('.ak-adetb');
        for (i = 0; i < a.length; i++) {
            a[i].classList.toggle('secili', +a[i].dataset.adet === soruSayisi);
            a[i].setAttribute('aria-pressed', (+a[i].dataset.adet === soruSayisi) ? 'true' : 'false');
        }
    }

    /* ---------------- tur mantığı ---------------- */

    function soruGoster() {
        var s = aktif.havuz[aktif.i];
        if (!s) {
            sahne.innerHTML = (mod === 2)
                ? ikiliSonucHtml(aktif.puan, aktif.havuz.length || soruSayisi)
                : sonucHtml(aktif.dogru, aktif.havuz.length || soruSayisi);
            return;
        }
        aktif.cevapli = false; aktif.esSol = null; aktif.esDogru = 0; aktif.esHata = 0;
        aktif.cevap = {}; aktif.bas = Date.now();
        sahne.innerHTML = soruHtml(s, aktif.i + 1, aktif.havuz.length);
        if (mod === 2) {
            [1, 2].forEach(function (n) {
                var e = sahne.querySelector('[data-rol="puan' + n + '"]');
                if (e) e.textContent = aktif.puan[n].dogru + aktif.puan[n].hiz;
            });
        }
    }

    function turBaslat() {
        /* İKİ KİŞİLİKTE EŞLEŞTİRME YOK (tip 7-8): dört çifti eşleştirmek
           bir hız yarışı değil, ekranı ikiye bölünce de sığmıyor. */
        var tipler = (mod === 2)
            ? aktif.tipler.filter(function (t) { return t !== 7 && t !== 8; })
            : aktif.tipler;
        zamanTemizle(); perdeKapat();
        aktif.giris = false;
        /* Kendi üreticisi olan bölüm (Okuma) havuzunu kendi kurar. */
        aktif.havuz = aktif.uretici ? aktif.uretici(soruSayisi) : havuz(tipler, soruSayisi);
        aktif.i = 0; aktif.dogru = 0;
        aktif.puan = { 1: { dogru: 0, hiz: 0 }, 2: { dogru: 0, hiz: 0 } };
        if (!aktif.havuz.length) {
            sahne.innerHTML = '<div class="ak-sonuc"><div class="ak-sonsoz">' +
                'Soru üretilemedi — sayfayı yenileyip tekrar dener misin?</div></div>';
            return;
        }
        /* İki kişilikte başlarken 3-2-1: iki öğrenci de tahtaya hazırlansın. */
        if (mod === 2) { sahne.innerHTML = ''; geriSay(soruGoster); }
        else soruGoster();
    }

    function testCevap(s, dugme) {
        if (mod === 2) { ikiliCevap(s, dugme); return; }
        if (aktif.cevapli) return;
        aktif.cevapli = true;
        var secilen = s.siklar[+dugme.getAttribute('data-i')];
        var hepsi = sahne.querySelectorAll('.as-sik');
        for (var j = 0; j < hepsi.length; j++) {
            hepsi[j].disabled = true;
            if (s.siklar[j].dogru) hepsi[j].classList.add('as-dogru');
        }
        if (!secilen.dogru) dugme.classList.add('as-yanlis');
        if (secilen.dogru) { aktif.dogru++; dogruSes(); } else { yanlisSes(); }
        bildir(sahne, secilen.dogru ? 'iyi' : 'kotu');
        ileriAc(s);
    }

    /* --- İKİ KİŞİLİK --------------------------------------------------
       Cevap alınır ama RENK VERİLMEZ: rakip hâlâ düşünüyor, yandaki yarıya
       bakıp cevabı görmesin. İki cevap da gelince (ya da «Cevapları aç»)
       birlikte çözülür. Puan: her doğru +10, doğru bilenlerden önce basana
       +5 hız — Dinle ve Yaz yarışmasıyla aynı kural. */
    function ikiliCevap(s, dugme) {
        var yan = dugme.closest('.ak-oy'); if (!yan) return;
        var n = +yan.dataset.oyuncu;
        if (aktif.cevap[n]) return;
        aktif.cevap[n] = { dogruMu: dugme.dataset.d === '1',
                           ms: Date.now() - aktif.bas, dugme: dugme };
        dugme.classList.add('ak-secili');
        yan.querySelectorAll('.as-sik').forEach(function (b) { b.disabled = true; });
        yan.classList.add('bekliyor');
        var dr = sahne.querySelector('[data-rol="durum' + n + '"]');
        if (dr) dr.textContent = 'Cevabın alındı…';
        if (aktif.cevap[1] && aktif.cevap[2]) ikiliCoz(s);
    }

    function ikiliCoz(s) {
        if (aktif.cevapli) return;
        aktif.cevapli = true;
        [1, 2].forEach(function (n) {
            if (!aktif.cevap[n]) aktif.cevap[n] = { dogruMu: false, ms: 0, dugme: null, bos: true };
        });
        var c1 = aktif.cevap[1], c2 = aktif.cevap[2];
        var hizli = 0;
        if (c1.dogruMu && c2.dogruMu) hizli = (c1.ms < c2.ms) ? 1 : (c2.ms < c1.ms ? 2 : 0);
        else if (c1.dogruMu) hizli = 1;
        else if (c2.dogruMu) hizli = 2;

        [1, 2].forEach(function (n) {
            var c = aktif.cevap[n];
            var yan = sahne.querySelector('.ak-o' + n);
            if (!yan) return;
            yan.classList.remove('bekliyor');
            yan.querySelectorAll('.as-sik').forEach(function (b) {
                b.disabled = true;
                b.classList.remove('ak-secili');
                if (b.dataset.d === '1') b.classList.add('as-dogru');
                else if (c.dugme === b) b.classList.add('as-yanlis');
            });
            if (c.dogruMu) aktif.puan[n].dogru += DOGRU_PUAN;
            if (hizli === n) aktif.puan[n].hiz += HIZ_PUAN;
            var pe = sahne.querySelector('[data-rol="puan' + n + '"]');
            if (pe) pe.textContent = aktif.puan[n].dogru + aktif.puan[n].hiz;
            var dr = sahne.querySelector('[data-rol="durum' + n + '"]');
            if (dr) dr.textContent = c.bos ? 'Cevap yok'
                : (c.dogruMu ? ('✔ +' + DOGRU_PUAN + (hizli === n ? '   ⚡ +' + HIZ_PUAN : '') +
                                '   (' + (c.ms / 1000).toFixed(1) + ' sn)')
                             : '✘   (' + (c.ms / 1000).toFixed(1) + ' sn)');
        });
        if (c1.dogruMu || c2.dogruMu) dogruSes(); else yanlisSes();
        bildir(sahne, (c1.dogruMu || c2.dogruMu) ? 'iyi' : 'kotu',
               hizli ? (hizli + '. Oyuncu önce bildi.') : '');
        var cz = sahne.querySelector('[data-rol="coz"]');
        if (cz) cz.hidden = true;
        otomatikGec(s);
    }

    /* İki kişilikte SONRAKİ DÜĞMESİ YOK: cevaplar bir süre açık kalır,
       sonra «Hazır ol» perdesi iner ve sıradaki soru kendiliğinden gelir.
       9. tipte önce uçuş bitsin. */
    function otomatikGec(s) {
        var sonra = function () {
            zamanKur(function () {
                hazirOl(function () { aktif.i++; soruGoster(); });
            }, CEVAP_BEKLE);
        };
        if (s && s.tip === 9) ucus(s, sonra); else sonra();
    }

    /* Eşleştirme kuralı Sınav sekmesindekiyle aynı: dördünü de bulmak
       gerekir, hatalı denemesi olan soru puan getirmez. */
    function esCevap(s, dugme) {
        if (dugme.classList.contains('as-kilit')) return;
        var A = S(); if (!A) return;
        if (dugme.getAttribute('data-yan') === 'sol') {
            var eski = sahne.querySelector('.as-es.as-secili');
            if (eski) eski.classList.remove('as-secili');
            dugme.classList.add('as-secili');
            aktif.esSol = dugme; return;
        }
        if (!aktif.esSol) return;
        var solH = aktif.esSol.getAttribute('data-h'), sagH = dugme.getAttribute('data-h');
        var hrt = (s.tip === 7) ? A.haritalar.ses : A.haritalar.yazi;
        if (hrt[solH] !== undefined && hrt[solH] === hrt[sagH] && solH !== sagH) {
            aktif.esDogru++;
            aktif.esSol.classList.remove('as-secili');
            aktif.esSol.classList.add('as-kilit', 'as-dogru');
            dugme.classList.add('as-kilit', 'as-dogru');
            aktif.esSol.setAttribute('data-cift', aktif.esDogru);
            dugme.setAttribute('data-cift', aktif.esDogru);
            aktif.esSol = null;
            if (aktif.esDogru >= 4) {
                aktif.cevapli = true;
                if (!aktif.esHata) { aktif.dogru++; dogruSes(); }
                bildir(sahne, aktif.esHata ? 'orta' : 'iyi',
                    aktif.esHata ? ('Dördünü de buldun ama ' + aktif.esHata +
                                    ' hatalı denemen oldu; bu soru puan getirmedi.')
                                 : 'Dört eşleşmenin hepsi doğru.');
                ileriAc(s);
            }
        } else {
            aktif.esHata++; yanlisSes();
            dugme.classList.add('as-titre');
            setTimeout(function () { dugme.classList.remove('as-titre'); }, 420);
            aktif.esSol.classList.remove('as-secili');
            aktif.esSol = null;
        }
    }

    /* ---------------- aç / kapat ---------------- */

    function ac(anahtar) {
        katmanKur(); bicemKur();
        var b = bolumBul(anahtar);
        if (!b) return false;
        if (!durumlar[anahtar]) {
            durumlar[anahtar] = { anahtar: anahtar, tipler: b.tipler, havuz: [], i: 0,
                                  dogru: 0, cevapli: false, esSol: null, esDogru: 0, esHata: 0 };
        }
        aktif = durumlar[anahtar];
        aktif.uretici = b.uretici || null;
        basEl.textContent = 'Kendini Dene — ' + b.baslik;
        notEl.textContent = b.not();
        /* KUMANDA ŞERİDİ: alfabe.html'de sayfanın herhangi bir yerine
           dokununca şerit katlanıyor (navKapat). Test açılınca ilk dokunuş
           katmanın içine olduğu için şerit kapanıyordu ve ✕'e basınca
           kapalı kalıyordu. Açılıştaki hâli not edilip kapanışta geri
           konuyor — öğretmen testten çıkınca kumandayı yeniden açmasın. */
        var ana = document.querySelector('.main-app');
        seritAcikti = !!(ana && !ana.classList.contains('nav-gizli'));
        katman.hidden = false;
        document.body.classList.add('ak-acik');
        modIsaretle();
        girisGoster();          /* önce «kaç kişi oynayacak?» ekranı */
        return true;
    }
    function seridiGeriAc() {
        if (!seritAcikti) return;
        var ana = document.querySelector('.main-app');
        if (ana) ana.classList.remove('nav-gizli');
        var m = document.getElementById('navMini');
        if (m) m.classList.remove('nm-donuk');
        if (typeof window.navAdYaz === 'function') { try { window.navAdYaz(); } catch (e) {} }
    }
    function kapat() {
        if (!katman) return;
        katman.hidden = true;
        zamanTemizle(); perdeKapat();
        document.body.classList.remove('ak-acik');
        seridiGeriAc();
        if (sahne) sahne.innerHTML = '';
    }

    /* ---------------- biçem ----------------
       TAHTAYA YANSITILACAK: katmanın içindeki her ölçü ekran yüksekliğine
       bağlı (vh) ve alt sınırı yüksek tutuldu. alfabe.css'teki as-* ölçüleri
       panel içi sınav için ayarlanmış; burada hepsi büyütülüyor. */
    function bicemKur() {
        if (document.getElementById('ak-stil')) return;
        var st = document.createElement('style');
        st.id = 'ak-stil';
        st.textContent = [
            '#ak-tam{position:fixed;inset:0;z-index:9000;background:#f4f9fb;',
            '  display:flex;align-items:stretch;justify-content:center}',
            '#ak-tam[hidden]{display:none}',
            'body.ak-acik{overflow:hidden}',
            '.ak-cerceve{display:flex;flex-direction:column;width:100%;height:100%;',
            '  padding:1.4vh 2vw 2vh;box-sizing:border-box;gap:1vh}',
            '.ak-bas{display:flex;align-items:center;gap:1.4rem;flex:none;',
            '  border-bottom:2px solid #dfeaf0;padding-bottom:1vh}',
            '.ak-bas-yazi{display:flex;flex-direction:column;flex:1;min-width:0}',
            '.ak-bas b{font-size:clamp(20px,3.2vh,40px);color:#0E6655;line-height:1.15}',
            '.ak-not{font-size:clamp(13px,1.9vh,22px);color:#7b8b97;line-height:1.2}',
            '.ak-kapa{flex:none;width:clamp(44px,6.4vh,74px);height:clamp(44px,6.4vh,74px);',
            '  border-radius:50%;border:2px solid #cfe0e8;background:#fff;color:#0E6655;',
            '  font-size:clamp(20px,3vh,34px);line-height:1;cursor:pointer;font-family:inherit}',
            '.ak-kapa:hover{background:#eaf6f2}',
            '.ak-sahne{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;',
            '  align-items:center;justify-content:center;gap:1vh;overflow:auto;padding:1vh 0}',
            '.ak-sayac{font-size:clamp(14px,2.1vh,26px);color:#94a3b8;flex:none}',

            /* ---- soru metni ---- */
            '#ak-tam .as-metin{font-size:clamp(20px,4.4vh,52px);padding:1vh 2vw;margin:0;',
            '  max-width:none;text-align:center;line-height:1.24;flex:none}',
            '#ak-tam .as-ipucu{font-size:clamp(14px,2.3vh,28px);text-align:center;flex:none}',

            /* ---- şıklar: iki sütun, kalan yüksekliği paylaşır ---- */
            '#ak-tam .as-siklar{width:min(1600px,96vw);max-width:none;gap:1.6vh 2vw;',
            '  grid-template-columns:repeat(2,minmax(0,1fr));flex:1 1 auto;min-height:0;',
            '  align-content:stretch}',
            '#ak-tam .as-sik{min-height:0;padding:1vh 1.4vw;gap:1.4vw}',
            '#ak-tam .as-mark{width:clamp(32px,4.6vh,56px);height:clamp(32px,4.6vh,56px);',
            '  font-size:clamp(14px,2.2vh,26px);flex:none}',
            /* SATIR + SARMA: harf çifti soruları (د — ج) yan yana durmalı;
               sütun yapınca ayracın altına iniyorlardı. Çizgi sorusunda
               harfin Türkçe adı .as-etiket'tir ve alfabe.css'te width:100%
               taşır — sarmalı satırda kendiliğinden alt satıra geçer. */
            '#ak-tam .as-ic{flex:1;display:flex;flex-direction:row;flex-wrap:wrap;',
            '  align-items:center;justify-content:center;gap:.25em;min-width:0}',
            /* Arapça ögeler — tahtanın arkasından okunacak punto */
            '#ak-tam .as-h{font-size:clamp(34px,9vh,104px)}',
            '#ak-tam .as-uclu{font-size:clamp(30px,8vh,92px)}',
            '#ak-tam .as-bic{font-size:clamp(30px,8vh,92px)}',
            '#ak-tam .as-bic-b{font-size:clamp(36px,9.5vh,110px)}',
            '#ak-tam .as-ayrac{font-size:clamp(22px,5vh,60px)}',
            '#ak-tam .as-etiket{font-size:clamp(13px,2vh,24px);margin-top:.2vh}',
            '#ak-tam .as-esalan{gap:3vw;flex:1 1 auto;min-height:0;align-items:center}',
            '#ak-tam .as-es{font-size:clamp(30px,8vh,96px);min-width:clamp(80px,12vw,180px);',
            '  padding:.6vh 1.2vw}',

            /* ---- 9. tip: kelime kutusu ----
               ARALIK YOK: tatvilli biçimler uç uca gelince kelime bitişik
               görünür. Ayrık dizmek (gap) sorunun kendisini bozuyordu —
               çocuk "ortadaki yazılış" derken kelimeyi gerçek hâliyle
               görmeli. Son adımda spanlar inline'a dönüyor ve harfler
               yalın yazılıyor; şekillendirmeyi tarayıcı yapıyor. */
            '.ak-kelimekutu{position:relative;flex:none;text-align:center;',
            '  padding:.5vh 1.2vw .9vh;border-radius:16px;background:#E6FAF5;',
            '  border:2px dashed #16A085}',
            '.ak-kelime{display:inline-block;direction:rtl;unicode-bidi:isolate;',
            '  font-size:clamp(34px,10vh,120px);line-height:1.35}',
            '.ak-par{display:inline-block;margin:0}',
            '.ak-bitisik .ak-par{display:inline;margin:0}',
            '.ak-yeni{animation:akGel .55s ease}',
            '@keyframes akGel{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}',
            /* Boşluk: harfin oturacağı yer. İçindeki tatvil yalnız GENİŞLİK
               versin diye saydam — komşu harfler ona göre şekillenir. */
            '.ak-bos{display:inline-block;width:1.05em;height:.58em;margin:0 .03em;',
            '  vertical-align:-.02em;overflow:hidden;color:transparent;line-height:0;',
            '  background:rgba(230,126,34,.14);border:3px dashed #E67E22;border-radius:10px;',
            '  animation:akYanip 1.6s ease-in-out infinite}',
            '@keyframes akYanip{0%,100%{background:rgba(230,126,34,.14)}',
            '  50%{background:rgba(230,126,34,.30)}}',
            '.ak-ucan{position:absolute;z-index:5;pointer-events:none;display:flex;',
            '  align-items:center;justify-content:center;color:#E67E22;',
            '  font-size:clamp(30px,8vh,96px);line-height:1;opacity:.98;',
            '  transition:transform 1.4s cubic-bezier(.32,.86,.3,1),opacity .35s ease}',
            '.ak-anlam{display:block;font-size:clamp(13px,2vh,24px);color:#7b8b97;',
            '  direction:ltr;unicode-bidi:isolate;margin-top:.2em}',

            /* ---- başlıktaki oyuncu sayısı seçici ---- */
            '.ak-mod{display:flex;gap:.25rem;flex:none;background:#e8f2f6;',
            '  border-radius:999px;padding:.25rem}',
            '.ak-modb{font-family:inherit;font-size:clamp(12px,1.9vh,20px);',
            '  padding:.6vh 1.4vw;border:none;border-radius:999px;background:transparent;',
            '  color:#5b7183;cursor:pointer;white-space:nowrap}',
            '.ak-modb.secili{background:#16A085;color:#fff}',
            '.ak-adetb{font-family:inherit;font-size:clamp(12px,1.9vh,20px);',
            '  min-width:clamp(30px,3.4vw,52px);padding:.6vh .6vw;border:none;border-radius:999px;',
            '  background:transparent;color:#5b7183;cursor:pointer}',
            '.ak-adetb.secili{background:#0E6655;color:#fff}',

            /* ---- PERDE: 3-2-1 ve «Hazır ol» ----
               Katmanın tamamını kaplar; arkadaki soru görünmesin diye
               bulanık değil DOLU zemin — tahtadan bakınca kesin okunsun. */
            '.ak-cerceve{position:relative}',
            '.ak-ortu{position:absolute;inset:0;z-index:40;display:flex;',
            '  align-items:center;justify-content:center;background:#f4f9fb}',
            '.ak-ortu[hidden]{display:none}',
            '.ak-ortuic{display:flex;flex-direction:column;align-items:center;gap:1.4vh;',
            '  text-align:center}',
            '.ak-sayi{display:block;font-size:clamp(90px,34vh,400px);line-height:1;',
            '  color:#16A085}',
            '.ak-sayi.oyna{animation:akSayim .9s cubic-bezier(.2,.8,.3,1) both}',
            '@keyframes akSayim{0%{transform:scale(.45);opacity:0}',
            /* Sayı uzun süre TAM OPAK kalsın: tahtadan bakınca soluk
               görünüyordu — solma yalnız son çeyrekte. */
            '  18%{transform:scale(1.06);opacity:1}72%{transform:scale(1);opacity:1}',
            '  100%{transform:scale(.88);opacity:.3}}',
            '.ak-hazir{display:block;font-size:clamp(34px,11vh,130px);line-height:1.1;',
            '  color:#0E6655;animation:akHazir 1.5s ease-in-out both}',
            '.ak-hazirnot{display:block;font-size:clamp(14px,2.6vh,32px);color:#7b8b97;',
            '  animation:akHazirNot 1.5s ease-in-out both}',
            '@keyframes akHazir{0%{transform:scale(.7) translateY(14px);opacity:0}',
            '  25%{transform:scale(1.04) translateY(0);opacity:1}',
            '  70%{transform:scale(1);opacity:1}100%{transform:scale(1.12);opacity:0}}',
            '@keyframes akHazirNot{0%,12%{opacity:0}35%,72%{opacity:1}100%{opacity:0}}',

            /* ---- iki kişilik: ekran ikiye bölünür, soru ORTAK ---- */
            '.ak-ikili{display:flex;flex-direction:row;gap:2vw;width:100%;flex:1 1 auto;',
            '  min-height:0;position:relative}',
            '.ak-ikili::after{content:"";position:absolute;top:2%;bottom:2%;left:50%;',
            '  width:2px;transform:translateX(-50%);background:rgba(0,0,0,.08);border-radius:2px}',
            '.ak-oy{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:.8vh;',
            '  border-radius:16px;padding:1vh 1vw;box-sizing:border-box}',
            '.ak-o1{background:rgba(47,122,214,.07)}',
            '.ak-o2{background:rgba(224,82,82,.07)}',
            '.ak-oybas{display:flex;align-items:center;justify-content:space-between;flex:none}',
            '.ak-oyad{font-size:clamp(13px,2.1vh,26px)}',
            '.ak-o1 .ak-oyad{color:#2f7ad6}',
            '.ak-o2 .ak-oyad{color:#e05252}',
            '.ak-oypuan{font-size:clamp(18px,3.2vh,40px)}',
            '.ak-o1 .ak-oypuan{color:#2f7ad6}',
            '.ak-o2 .ak-oypuan{color:#e05252}',
            '.ak-oydurum{flex:none;min-height:2.4vh;text-align:center;direction:ltr;',
            '  unicode-bidi:isolate;font-size:clamp(12px,2vh,24px);color:#7b8b97}',
            /* Rakip düşünürken cevabı görmesin. */
            '.ak-oy.bekliyor .as-siklar{opacity:.3}',
            '.ak-o1 .as-sik.ak-secili{border-color:#2f7ad6}',
            '.ak-o2 .as-sik.ak-secili{border-color:#e05252}',
            '#ak-tam .ak-oy .as-siklar{width:100%;gap:1vh 1vw;grid-template-columns:1fr}',
            '#ak-tam .ak-oy .as-h{font-size:clamp(26px,6vh,72px)}',
            '#ak-tam .ak-oy .as-uclu,#ak-tam .ak-oy .as-bic{font-size:clamp(24px,5.4vh,64px)}',
            '#ak-tam .ak-oy .as-bic-b{font-size:clamp(28px,6.4vh,76px)}',
            '#ak-tam .ak-oy .as-sik{padding:.8vh 1vw;gap:1vw}',

            /* ---- iki kişilik sonuç kartı ---- */
            '.ak-sonikili{display:flex;gap:2.4vw;justify-content:center;margin:1vh 0}',
            '.ak-sonoy{min-width:clamp(140px,18vw,280px);padding:1.4vh 2vw;border-radius:16px;',
            '  box-shadow:0 2px 10px rgba(0,0,0,.06)}',
            '.ak-sonoy.ak-o1{background:#fff}',
            '.ak-sonoy.ak-o2{background:#fff}',
            '.ak-sonoyad{font-size:clamp(12px,2vh,24px);color:#7b8b97}',
            '.ak-sonoytop{font-size:clamp(30px,7vh,84px);line-height:1.1}',
            '.ak-sonoy.ak-o1 .ak-sonoytop{color:#2f7ad6}',
            '.ak-sonoy.ak-o2 .ak-sonoytop{color:#e05252}',
            '.ak-sonoyayr{font-size:clamp(11px,1.8vh,20px);color:#7b8b97}',

            /* ---- geri bildirim + düğmeler ---- */
            '.ak-bildirim{min-height:1.4em;text-align:center;flex:none;',
            '  font-size:clamp(15px,2.6vh,32px)}',
            '.ak-alt{display:flex;gap:1.2rem;justify-content:center;flex:none;flex-wrap:wrap}',
            '.ak-t{font-family:inherit;font-size:clamp(16px,2.6vh,30px);',
            '  padding:1vh 2.4vw;border-radius:999px;border:2px solid #16A085;',
            '  background:#16A085;color:#fff;cursor:pointer}',
            '.ak-t:hover{filter:brightness(1.06)}',
            '.ak-ikincil{background:#fff;color:#0E6655}',
            '.ak-sonuc{text-align:center;display:flex;flex-direction:column;gap:1.6vh}',
            '.ak-sonsay{font-size:clamp(26px,6vh,76px);color:#0E6655}',
            '.ak-yuzde{display:inline-block;margin-inline-start:.4em;background:#E6FAF5;',
            '  color:#0E6655;border-radius:999px;padding:0 .4em;font-size:.7em}',
            '.ak-sonsoz{font-size:clamp(15px,2.6vh,32px);color:#7b8b97}',

            /* ---- kumandadaki başlık ---- */
            /* KUMANDADAKİ YAN TUŞLAR — ayrı sekme değil, konu sekmesinin
               SAĞINDA küçük birer tuş. Satır kabına direction:ltr şart:
               şerit rtl olduğu için aksi hâlde yan tuş sola düşüyor. */
            '.nav-tabs .tab-satir{display:flex;direction:ltr;align-items:stretch;gap:4px}',
            '.nav-tabs .tab-satir > .tab-trigger:not(.ak-yan){flex:1 1 auto;width:auto;min-width:0}',
            '.nav-tabs .ak-yan{flex:0 0 auto;width:auto;min-width:0;gap:6px;',
            '  padding:6px 10px;justify-content:center;text-decoration:none;',
            '  background:rgba(6,62,51,.56)}',
            '.nav-tabs .ak-yan:hover{background:rgba(6,62,51,.82)}',
            '.nav-tabs .ak-yan .tab-ikon{width:19px;height:19px;flex:none}',
            '.nav-tabs .ak-yanad{font-size:.82rem;line-height:1.1;white-space:nowrap;opacity:.95}',
            /* Hat Atölyesi: sekme değil indirme satırı — altın tonu onu
               sekmelerden ayırıyor, sağ ucunda ne olduğu yazılı. */
            '.nav-tabs .ak-defter{margin-top:6px;text-decoration:none;',
            '  background:rgba(120,85,10,.62);border:1px solid rgba(255,225,170,.35)}',
            '.nav-tabs .ak-defter:hover{background:rgba(120,85,10,.82)}',
            '.nav-tabs .ak-defter .tab-ikon{flex:none}',
            '.nav-tabs .ak-defternot{margin-left:auto;font-size:.74rem;line-height:1.1;',
            '  white-space:nowrap;opacity:.8}',
            /* ---- GİRİŞ EKRANI: kaç kişi oynayacak + kurallar ---- */
            '#ak-tam .ak-giris{display:flex;flex-direction:column;align-items:center;',
            '  gap:2.2vh;width:100%;max-width:1100px;margin:0 auto;text-align:center}',
            '#ak-tam .ak-giris-bas{font-size:clamp(20px,4.2vh,44px);color:#0E6655;font-weight:400}',
            '#ak-tam .ak-kartlar{display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,2vw,26px);',
            '  width:100%}',
            '#ak-tam .ak-kart{display:flex;flex-direction:column;align-items:center;gap:.6vh;',
            '  padding:2vh 1.6vw;border:2px solid #DCE6EE;border-radius:20px;background:#fff;',
            '  cursor:pointer;font-family:inherit;color:#1f2937;',
            '  transition:border-color .18s,box-shadow .18s,background .18s,transform .18s}',
            '#ak-tam .ak-kart:hover{border-color:#9FD5C8;transform:translateY(-2px)}',
            '#ak-tam .ak-kart.secili{border-color:#16A085;background:#F3FBF8;',
            '  box-shadow:0 0 0 4px rgba(22,160,133,.16)}',
            '#ak-tam .ak-kart-gorsel{display:block;width:100%}',
            '#ak-tam .ak-svg{width:clamp(132px,19vh,260px);height:auto;display:block;margin:0 auto}',
            '#ak-tam .ak-kart-ad{font-size:clamp(17px,3vh,32px);font-weight:400}',
            '#ak-tam .ak-kart-not{font-size:clamp(12px,1.7vh,18px);color:#64748b}',
            /* kurallar: her satırın başında küçük bir işaret */
            '#ak-tam .ak-kural{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;',
            '  gap:1.1vh;width:100%;max-width:820px;text-align:start}',
            '#ak-tam .ak-kural li{display:flex;align-items:flex-start;gap:10px;',
            '  font-size:clamp(13px,1.95vh,21px);color:#334155;line-height:1.45}',
            '#ak-tam .ak-kural b{color:#0E6655;font-weight:400}',
            '#ak-tam .ak-mini{width:clamp(20px,2.7vh,30px);height:clamp(20px,2.7vh,30px);flex:none;',
            '  margin-top:.1em}',
            '#ak-tam .ak-giris-alt{display:flex;align-items:center;justify-content:center;',
            '  gap:clamp(10px,2vw,24px);flex-wrap:wrap;margin-top:.6vh}',
            '#ak-tam .ak-giris-not{font-size:clamp(12px,1.7vh,18px);color:#94a3b8}',
            /* ---- kıpırtılar ---- */
            '@keyframes akBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
            '@keyframes akCiz{0%,15%{stroke-dashoffset:40}52%,86%{stroke-dashoffset:0}100%{stroke-dashoffset:40}}',
            '@keyframes akCak{0%,100%{transform:scale(.8);opacity:.35}42%{transform:scale(1.14);opacity:1}',
            '  64%{transform:scale(.96);opacity:.9}}',
            '@keyframes akDon{0%,100%{transform:rotate(0)}50%{transform:rotate(360deg)}}',
            '#ak-tam .ak-og{transform-box:fill-box;transform-origin:50% 100%;',
            '  animation:akBob 1.9s ease-in-out infinite}',
            '#ak-tam .ak-og2{animation-delay:.95s}',
            '#ak-tam .ak-tik{stroke-dasharray:40;stroke-dashoffset:40;',
            '  animation:akCiz 2.6s ease-in-out infinite}',
            '#ak-tam .ak-simsek{transform-box:fill-box;transform-origin:50% 50%;',
            '  animation:akCak 1.9s ease-in-out infinite}',
            '#ak-tam .ak-kupa{transform-box:fill-box;transform-origin:50% 100%;',
            '  animation:akBob 2.4s ease-in-out infinite}',
            '#ak-tam .ak-akrep{transform-box:fill-box;transform-origin:50% 100%;',
            '  animation:akDon 3.2s linear infinite}',
            '@media (prefers-reduced-motion:reduce){',
            '  #ak-tam .ak-og,#ak-tam .ak-tik,#ak-tam .ak-simsek,#ak-tam .ak-kupa,#ak-tam .ak-akrep',
            '  {animation:none}}',
            /* Dar ekranda tek sütun: iki büyük şık yan yana sığmıyor. */
            '@media (max-width:820px){',
            '  #ak-tam .as-siklar{grid-template-columns:1fr}',
            '  #ak-tam .as-h,#ak-tam .as-uclu,#ak-tam .as-bic{font-size:clamp(28px,6vh,60px)}',
            '  #ak-tam .ak-kartlar{gap:10px}',
            '  #ak-tam .ak-svg{width:clamp(80px,11vh,130px)}',
            '}'
        ].join('\n');
        document.head.appendChild(st);
    }

    /* ---------------- kumandaya yerleştir ----------------
       Testler AYRI BİR SEKME DEĞİL: her konu sekmesinin SAĞINA iliştirilmiş
       küçük birer tuş. Sekme satırı ikiye bölünüyor —

         [ Harf Tanıtımı              ][ Dene ]
         [ Harf Birleştirme           ][ Dene ]
         [ Okuma                      ][ Dene ]
         [ Dinle ve Yaz               ][ PDF  ]
         [ Hat Atölyesi · Öğrenci Defteri      ]   ← indirme satırı

       Satır kabına direction:ltr veriliyor: şerit rtl olduğu için aksi
       hâlde yan tuş SOLA düşüyor.

       Yan tuşlar ui.tab ÇAĞIRMAZ; panel değiştirmez, katmanı açarlar —
       bu yüzden .active işareti de almazlar, konunun kendi sekmesi seçili
       kalır. PDF tuşu ise düz bir indirme bağlantısıdır. */

    var DENE_IKON =
        '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="3" y="2.6" width="14" height="18.8" rx="2.4" fill="#F7FAFC" stroke="#0E6655" stroke-width="1.4"/>' +
        '<path d="M6.2 7.4h7.4M6.2 11h7.4M6.2 14.6h4.4" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>' +
        '<circle cx="17.4" cy="16.6" r="4.6" fill="#2ecc71"/>' +
        '<path d="M15.3 16.7l1.5 1.5 2.8-3" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    /* Hat Atölyesi defteri: kalem ucu bir sayfaya yazıyor. */
    var DEFTER_IKON =
        '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M4.2 2.8h9.4l4.2 4.2v14a1 1 0 0 1-1 1H4.2a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1z" fill="#FFF8EC" stroke="#B8860B" stroke-width="1.35"/>' +
        '<path d="M13.6 2.8v4.2h4.2" fill="none" stroke="#B8860B" stroke-width="1.35" stroke-linejoin="round"/>' +
        '<path d="M6.4 17.4h9" stroke="#E8C88A" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M6.6 14.6c2.6-4.4 6.2-6.6 9.4-8" fill="none" stroke="#D9A441" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M16.6 5.4l2.6-1.2-1 2.7-1.6-1.5z" fill="#0E6655"/></svg>';

    var PDF_IKON =
        '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M5.4 2.6h8.2l5 5v13.8a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V3.6a1 1 0 0 1 1-1z" fill="#F7FAFC" stroke="#0E6655" stroke-width="1.4"/>' +
        '<path d="M13.6 2.6v5h5" fill="none" stroke="#0E6655" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M12 11.4v5.4" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M9.4 14.6L12 17.2l2.6-2.6" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M8 19.6h8" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/></svg>';

    function seritKur() {
        var serit = document.querySelector('.nav-tabs');
        if (!serit) return;
        var gruplar = serit.querySelectorAll('.tab-grup');
        if (!gruplar.length) return;
        var alfabe = gruplar[0], i;
        for (i = 0; i < gruplar.length; i++) {
            var ad = gruplar[i].querySelector('.tab-grup-ad');
            if (ad && ad.textContent.trim() === 'Alfabe') { alfabe = gruplar[i]; break; }
        }
        var sira = alfabe.querySelector('.tab-grup-sira') || alfabe;
        if (sira.querySelector('.ak-yan')) return;

        /* Konunun kendi sekmesi: ui.tab(event,'p1') / 'p5' / 'p7'. */
        function konuBul(panel) {
            var hepsi = sira.querySelectorAll('.tab-trigger'), j;
            for (j = 0; j < hepsi.length; j++) {
                var t = hepsi[j].getAttribute('onclick') || '';
                if (t.indexOf("'" + panel + "'") >= 0) return hepsi[j];
            }
            return null;
        }
        function sar(konu, tus) {
            if (!konu || !konu.parentNode || !tus) return false;
            var satir = document.createElement('div');
            satir.className = 'tab-satir';
            konu.parentNode.insertBefore(satir, konu);
            satir.appendChild(konu);
            satir.appendChild(tus);
            return true;
        }

        BOLUMLER.forEach(function (b) {
            var d = document.createElement('button');
            d.type = 'button';
            d.className = 'tab-trigger ak-yan ak-tetik';
            d.dataset.ak = b.anahtar;
            d.title = 'Kendini Dene — ' + b.baslik;
            d.setAttribute('aria-label', d.title);
            d.innerHTML = DENE_IKON + '<span class="ak-yanad">Dene</span>';
            sar(konuBul(b.anahtar), d);
        });

        /* Dinle ve Yaz'ın yanına kelime listesi PDF'i: tek dosyada önce boş
           çalışma kâğıdı, sonra cevap anahtarı. */
        var a = document.createElement('a');
        a.className = 'tab-trigger ak-yan ak-pdf';
        a.href = 'okumayazma/dinleveyaz_kelimeler.pdf';
        a.setAttribute('download', 'dinleveyaz-kelimeler.pdf');
        a.target = '_blank';
        a.rel = 'noopener';
        a.title = 'Kelime listesi PDF — boş çalışma kâğıdı + cevap anahtarı';
        a.setAttribute('aria-label', a.title);
        a.innerHTML = PDF_IKON + '<span class="ak-yanad">PDF</span>';
        sar(konuBul('p7'), a);

        /* NOT: Okuma'nın yanında PDF tuşu YOK — orada «Dene» var (yukarıdaki
           BOLUMLER döngüsü koyuyor). Çalışma kâğıtları dosyası siteden
           çıkarıldı, _kaynak/okuma-calisma-kagitlari.pdf altında duruyor
           (site dışı, git'e gitmiyor). Geri istenirse dosya okumayazma/
           içine alınıp buraya Dinle ve Yaz'ınki gibi bir bağlantı konur. */

        /* HAT ATÖLYESİ ÖĞRENCİ DEFTERİ — sekme değil, indirme satırı.
           Alfabe bölümünün sonuna, tam genişlikte. Dosya öğretmenin kendi
           hazırladığı defter; burada yalnız duyuruluyor ve indiriliyor.
           DOSYA ADI ASCII: macOS dosya adlarını ayrıştırılmış (NFD) tutuyor,
           git ise birleştirilmiş (NFC) kaydedebiliyor — Türkçe harfli bir ad
           GitHub Pages'te 404 verebilirdi. Bu yüzden ad sadeleştirildi. */
        var defter = document.createElement('a');
        defter.className = 'tab-trigger ak-defter';
        defter.href = 'okumayazma/hat-atolyesi-ogrenci-defteri.pdf';
        defter.setAttribute('download', 'hat-atolyesi-ogrenci-defteri.pdf');
        defter.target = '_blank';
        defter.rel = 'noopener';
        defter.title = 'Hat Atölyesi — Öğrenci Defteri · Rik\'a ile güzel yazı · 24 sayfa PDF';
        defter.setAttribute('aria-label', defter.title);
        defter.innerHTML = DEFTER_IKON +
            '<span class="tab-ad">Hat Atölyesi</span>' +
            '<span class="ak-defternot">Defter · 24 s. PDF</span>';
        sira.appendChild(defter);

        sira.addEventListener('click', function (e) {
            var d = e.target.closest ? e.target.closest('.ak-tetik') : null;
            if (!d) return;
            e.stopPropagation();
            tik();
            ac(d.dataset.ak);
        });
    }

    function basla() {
        bicemKur(); katmanKur(); seritKur();
        /* Şerit geç kurulursa birkaç kez daha dene. */
        var kac = 0;
        var saat = setInterval(function () {
            seritKur();
            if (++kac > 10 || document.querySelector('.nav-tabs .ak-yan')) clearInterval(saat);
        }, 400);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', basla);
    } else { basla(); }

    window.AlfabeAkordiyon = {
        kur: basla,
        ac: ac, kapat: kapat,
        havuz: havuz,
        durumlar: durumlar,      /* {p1: {...}, p5: {...}} — açılınca dolar */
        bolumler: BOLUMLER,
        soruSayisi: soruSayisi,
        katman: function () { return katman; }
    };
})();
