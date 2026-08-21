/* =====================================================================
   TEST MODU MOTORU                                (sarf/kelimetest.js)
   ---------------------------------------------------------------------
   Kelime listelerinin dördüncü kipi. Liste Modu / Çalışma Kartları /
   Hafıza Oyunu ile AYNI listeden beslenir; ayrı veri yoktur.
   Nerede varsa oradadır: Kelime Dağarcığı (kelimeler.html), İmam Hatip
   ders listeleri ve kalıplar tablosundaki konu listeleri — hepsinde
   her listenin kendi Test Modu düğmesi olur.

   NASIL ÇALIŞIR
     1) LOBİ    Tek kişilik mi, kapışma mı; kaç soru.
     2) ARENA   Kapışmada ekran ikiye bölünür, İKİ OYUNCU AYNI ANDA
                oynar — sıra beklemek yok. Herkesin kendi sorusu,
                kendi süresi, kendi puanı vardır.
     3) SONUÇ   Tek kişilikte yıldız + isabet oranı, kapışmada kazanan.
                İkisinde de yanlış bilinen kelimeler dökülür.

   SORULAR
   Yön KARIŞIK: bir soru "Arapça verilir, Türkçesi sorulur", bir sonraki
   tersi olabilir. Böylece hem tanıma hem hatırlama çalışır ve aynı
   liste her turda farklı gelir.
   Çeldiriciler ÖNCE aynı listeden seçilir (yakın anlamlılar zorlar);
   liste dörtten azsa öteki listelerden tamamlanır.

   PUAN
   Doğru = 60 + hız payı (en çok 40). Yani çabuk bilen daha çok alır,
   ama bilen herkes kazanır. Süre biterse ya da yanlışsa 0.

   KAPIŞMADA KOPYA YOK
   İkinci oyuncunun soru dizisi kaydırılır; aynı anda ikisi aynı soruyu
   görmez.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefKelimeTest) return;

    var SORU_SURE = 10000;    /* soru başına süre (ms) */
    var TABAN     = 60;       /* doğru cevabın tabanı  */
    var HIZ_PAYI  = 40;       /* hızdan gelen en çok puan */
    var SIK_SAYI  = 4;
    var GOSTER    = 900;      /* doğru/yanlış gösterme süresi (ms) */
    var TUSLAR    = { p1: ['1', '2', '3', '4'], p2: ['7', '8', '9', '0'] };

    var oturum = {};          /* key -> o listenin açık test oturumu */

    /* ---------------- küçük yardımcılar ---------------- */
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function karistir(a) {
        var d = a.slice();
        for (var i = d.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = d[i]; d[i] = d[j]; d[j] = t;
        }
        return d;
    }
    function el(id) { return document.getElementById(id); }
    /* kelimeler.js'in `let` ile tanımladığı iki tablo pencereye
       yazılmıyor; adları doğrudan okunuyor, yoksa boş dönülüyor. */
    function katalog() { try { return thematicCategoriesData || {}; } catch (e) { return {}; } }
    function oyunlar() { try { return activeMemoryGames || {}; } catch (e) { return {}; } }
    function renkli(ar, kok) {
        if (typeof colorizeArabicWord === 'function') {
            try { return colorizeArabicWord(ar, kok); } catch (e) { }
        }
        return esc(ar);
    }

    /* ---------------- ses (tarayıcı içi, dosyasız) ----------------
       İlk dokunuşta açılır; kapalı kalırsa oyun sessiz oynanır. */
    var sesCtx = null;
    function sesAc() {
        if (sesCtx) return;
        try { sesCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { sesCtx = null; }
    }
    function ses(tip) {
        if (!sesCtx) return;
        var n = { dogru: [660, 990], yanlis: [200, 150], tik: [520, 520], bitis: [523, 784, 1047] }[tip];
        if (!n) return;
        try {
            n.forEach(function (f, i) {
                var o = sesCtx.createOscillator(), g = sesCtx.createGain();
                o.type = tip === 'yanlis' ? 'square' : 'sine';
                o.frequency.value = f;
                o.connect(g); g.connect(sesCtx.destination);
                var t0 = sesCtx.currentTime + i * 0.09;
                g.gain.setValueAtTime(0, t0);
                g.gain.linearRampToValueAtTime(0.075, t0 + 0.012);
                g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.17);
                o.start(t0); o.stop(t0 + 0.19);
            });
        } catch (e) { }
    }

    /* ---------------- kelime havuzları ---------------- */
    /* Testte kullanılabilir öğe = hem Arapçası hem Türkçesi olan öğe. */
    function uygun(items) {
        return (items || []).filter(function (w) {
            return w && String(w.arText || '').trim() && String(w.trText || '').trim();
        });
    }
    function listeninKelimeleri(key) {
        var cat = katalog()[key];
        return cat ? uygun(cat.items) : [];
    }
    /* Liste dörtten azsa çeldirici öteki listelerden tamamlanır. */
    function disHavuz(key) {
        var hepsi = [], k = katalog();
        for (var i in k) {
            if (i === key) continue;
            hepsi = hepsi.concat(uygun(k[i] && k[i].items));
        }
        return hepsi;
    }

    /* ---------------- soru üretimi ---------------- */
    function soruYap(hedef, liste, dis) {
        /* Yön karışık: yazıdan anlama ya da anlamdan yazıya. */
        var arTr = Math.random() < 0.5;
        var alan = arTr ? 'trText' : 'arText';
        var dogru = hedef[alan];

        function topla(kaynak, out) {
            karistir(kaynak).forEach(function (w) {
                if (out.length >= SIK_SAYI - 1) return;
                var d = w[alan];
                if (!d || d === dogru || out.indexOf(d) > -1) return;
                out.push(d);
            });
        }
        var celdirici = [];
        topla(liste, celdirici);
        if (celdirici.length < SIK_SAYI - 1) topla(dis, celdirici);

        var siklar = karistir([dogru].concat(celdirici));
        return {
            item:   hedef,
            arTr:   arTr,
            metin:  arTr ? hedef.arText : hedef.trText,
            kok:    hedef.rootKey || '',
            emoji:  arTr ? '' : (hedef.emoji || ''),
            dogru:  dogru,
            siklar: siklar
        };
    }
    function ogeSec(key, adet) {
        return karistir(listeninKelimeleri(key)).slice(0, adet);
    }
    /* KAPIŞMADA KOPYA ÇEKİLMESİN: iki oyuncuya AYNI öğe dizisi verilir ama
       ikincisininki bir kaydırılır, böylece hiçbir an ikisi aynı soruda
       olmaz. (Önce iki bağımsız karıştırma yapılıyordu; kısa listelerde
       ikisi tesadüfen aynı kelimeyle başlayabiliyordu.) Şıklar ve yön yine
       ayrı ayrı üretilir — aynı kelime birine "anlamı?", ötekine
       "Arapçası?" diye gelebilir. */
    function soruDizisi(key, ogeler) {
        var liste = listeninKelimeleri(key);
        var dis = liste.length >= SIK_SAYI ? [] : disHavuz(key);
        return ogeler.map(function (w) { return soruYap(w, liste, dis); });
    }
    function kaydirilmis(ogeler) {
        return ogeler.length > 1 ? ogeler.slice(1).concat(ogeler.slice(0, 1)) : ogeler;
    }

    /* ---------------- sahne kabı ---------------- */
    function sahneKabi(key) {
        var g = el('grid-' + key);
        if (!g) return null;
        /* Üst satırlar (mod · şerit · liste başlığı) her kipte sabit;
           test de aynı iskelete oturuyor, yalnız içerik alanını alıyor. */
        var kabuk = el('content-' + key);
        if (kabuk) kabuk.classList.add('kl-sabit-baslik');
        /* Liste ekrandan kalkıyor; sütun seçicinin de anlamı kalmıyor.
           Geri dönüşte setMemoryMode('list') onu yeniden gösteriyor. */
        var sec = el('sutun-sec-' + key);
        if (sec) sec.style.display = 'none';
        g.className = 'kt-test-alan';
        g.removeAttribute('style');
        g.removeAttribute('data-total');
        return g;
    }
    function baslik(key) {
        var cat = katalog()[key] || {};
        return (cat.icon ? cat.icon + ' ' : '') + esc(cat.title || 'Kelime Listesi');
    }
    /* TEST TAM EKRAN AÇILIR — daha lobiden başlayarak (Geylani).
       Hafıza oyunu tam ekrana yalnız oyun başlayınca geçiyor; test
       ekranın tamamını isteyen bir kip: soru, süre ve şıklar akordiyon
       kutusuna sıkışmasın, sınıfta tahtaya yansıtılabilsin. Kapanışta
       (kapat) aynı düğme tersine çevriliyor. */
    function tamEkranAc(key) {
        var icerik = el('content-' + key);
        if (icerik && !icerik.classList.contains('fullscreen-accordion') &&
            typeof toggleAccordionFullscreen === 'function') {
            toggleAccordionFullscreen(key, null);
        }
    }

    /* =====================================================================
       LOBİ
       ===================================================================== */
    /* HAFIZA KİPİNİN ÖĞELERİ TESTE TAŞINMASIN.
       "Hafıza Oyunu"na basılmışsa ekranda çift sayısı listesi, 1/2 kişi
       anahtarı, Başla/✕ düğmeleri ve iki oyuncunun skor kutusu duruyor.
       Test bunların ALTINA açılıyor, ikisi üst üste görünüyordu
       (Geylani). Liste kipine döndürmek hepsini tek yerden toparlıyor;
       ardından zaten test sahnesi ızgaranın üstüne yazılıyor.
       Önce oturum siliniyor ki setMemoryMode testi kapatmaya kalkıp
       tam ekrandan çıkmasın. */
    function hafizaOgeleriniTemizle(key) {
        klavyeCoz(key);          /* eski oturumun dinleyicisi asılı kalmasın */
        delete oturum[key];
        if (typeof setMemoryMode === 'function') {
            try { setMemoryMode(key, 'list'); } catch (e) { }
        }
    }

    /* TURUNCU VURGU TESTE GEÇSİN. Üstteki temizlik liste kipine
       döndürdüğü için "Liste Modu" düğmesi aktif (turuncu) kalıyordu;
       ekran testken vurgu başka kipte duruyordu (Geylani). */
    function dugmeVurgu(key) {
        ['btn-list-', 'btn-study-', 'btn-mem-'].forEach(function (on) {
            var d = el(on + key); if (d) d.classList.remove('active');
        });
        var t = el('btn-test-' + key);
        if (t) t.classList.add('active');
        /* Tam ekran düğmesi TESTTE DE DURUR: tam ekrandan çıkış her
           kipte aynı tek düğmeyle olsun (Geylani). */
    }

    function ac(key) {
        /* Liste geri gelsin: hafıza kalıntıları temizlenir, ızgara liste
           kipine döner. Test artık ızgarayı KAPLAMIYOR — kurulum üstteki
           kompakt şeritte açılıyor, kelimeler altta görünmeye devam
           ediyor ve aşağı kaydırılabiliyor (Geylani). */
        hafizaOgeleriniTemizle(key);
        if (typeof setMemoryMode === 'function') { try { setMemoryMode(key, 'list'); } catch (e) { } }
        dugmeVurgu(key);
        tamEkranAc(key);

        var liste = listeninKelimeleri(key);
        var o = oyunlar()[key];
        if (o) o.mode = 'test';
        oturum[key] = { key: key, kisi: 1, adet: Math.min(10, liste.length), lobide: true };

        var serit = (typeof seritAc === 'function') ? seritAc(key, 'test') : el('serit-' + key);
        if (!serit) return;
        serit.style.display = 'flex';

        if (liste.length < 2) {
            serit.insertAdjacentHTML('beforeend',
                '<div class="kt-serit">' +
                '<span class="kt-serit-not">Bu listede test için en az 2 kelime gerekiyor; şu an ' +
                liste.length + ' var.</span>' +
                '</div>');
            klavyeBagla(key);
            return;
        }

        var secenek = [5, 10, 20].filter(function (n) { return n < liste.length; });
        secenek.push(liste.length);
        oturum[key].adet = secenek.indexOf(10) > -1 ? 10 : secenek[0];

        serit.insertAdjacentHTML('beforeend',
            /* Şeritte ayrıca "Test" etiketi YOK: mod satırındaki düğme
               zaten turuncu ve "Test Modu" yazıyor, ikinci etiket fazlaydı. */
            '<div class="kt-serit">' +
            '<div class="kt-serit-grup" id="kt-kisi-' + key + '">' +
                '<button type="button" class="kt-mini secili" data-kisi="1" ' +
                'onclick="KidefKelimeTest.kisi(\'' + key + '\',1)">🧑‍🎓 Tek Kişilik</button>' +
                '<button type="button" class="kt-mini" data-kisi="2" ' +
                'onclick="KidefKelimeTest.kisi(\'' + key + '\',2)">⚔️ Kapışma</button>' +
            '</div>' +
            '<div class="kt-serit-grup" id="kt-adet-' + key + '">' +
                secenek.map(function (n) {
                    var ad = (n === liste.length) ? 'Tümü (' + n + ')' : n + ' Soru';
                    return '<button type="button" class="kt-mini' + (n === oturum[key].adet ? ' secili' : '') +
                           '" data-adet="' + n + '" onclick="KidefKelimeTest.adet(\'' + key + '\',' + n + ')">' + ad + '</button>';
                }).join('') +
            '</div>' +
            (liste.length < SIK_SAYI
                ? '<span class="kt-serit-not">Şıklar öteki listelerden tamamlanacak.</span>' : '') +
            '<button type="button" class="kt-serit-basla" ' +
            'onclick="KidefKelimeTest.basla(\'' + key + '\')">BAŞLA</button>' +
            '</div>');
        klavyeBagla(key);
    }

    function kisi(key, n) {
        var o = oturum[key]; if (!o) return;
        o.kisi = n;
        var kutu = el('kt-kisi-' + key); if (!kutu) return;
        [].forEach.call(kutu.querySelectorAll('.kt-mini'), function (b) {
            b.classList.toggle('secili', parseInt(b.getAttribute('data-kisi'), 10) === n);
        });
        sesAc(); ses('tik');
    }
    function adet(key, n) {
        var o = oturum[key]; if (!o) return;
        o.adet = n;
        var kutu = el('kt-adet-' + key); if (!kutu) return;
        [].forEach.call(kutu.querySelectorAll('.kt-mini'), function (b) {
            b.classList.toggle('secili', parseInt(b.getAttribute('data-adet'), 10) === n);
        });
        sesAc(); ses('tik');
    }

    /* =====================================================================
       ARENA
       ===================================================================== */
    function oyuncuHtml(key, p, ad) {
        return '' +
        '<div class="kt-oyuncu ' + p + '" id="kt-' + p + '-' + key + '">' +
            '<div class="kt-ust">' +
                '<span class="kt-kim">' + ad + '</span>' +
                '<span class="kt-seri" id="kt-seri-' + p + '-' + key + '">🔥 <b>0</b></span>' +
                '<span class="kt-puan"><b id="kt-puan-' + p + '-' + key + '">0</b><span>puan</span></span>' +
            '</div>' +
            '<div class="kt-sure" id="kt-sure-' + p + '-' + key + '"><i></i></div>' +
            '<div class="kt-soru" id="kt-soru-' + p + '-' + key + '"></div>' +
            '<div class="kt-siklar" id="kt-siklar-' + p + '-' + key + '"></div>' +
            '<div class="kt-noktalar" id="kt-nokta-' + p + '-' + key + '"></div>' +
        '</div>';
    }

    function basla(key) {
        var o = oturum[key]; if (!o) return;
        sesAc();
        o.bitti = false;
        o.lobide = false;
        var iki = o.kisi === 2;
        o.oyuncular = iki ? ['p1', 'p2'] : ['p1'];
        o.durum = {};
        var ogeler = ogeSec(key, o.adet);
        o.oyuncular.forEach(function (p, i) {
            o.durum[p] = {
                sorular: soruDizisi(key, i === 1 ? kaydirilmis(ogeler) : ogeler),
                i: 0, puan: 0, dogru: 0, seri: 0, enSeri: 0,
                kalan: SORU_SURE, kilitli: true, bitti: false, yanlislar: []
            };
        });

        var oy = oyunlar()[key];
        if (oy) { oy.mode = 'test'; oy.gameStarted = true; }
        if (typeof oyunKilidi === 'function') oyunKilidi(key, true);

        /* Tur başlarken şerit kapanır: soru ekranı tüm alanı alsın.
           ✕ ile geri dönülünce şerit yeniden açılır (ac). */
        if (typeof seritKapat === 'function') seritKapat(key);
        var kap = sahneKabi(key);
        kap.innerHTML =
            '<div class="kt-sahne kt-oyun">' +
            '<div class="kt-arena' + (iki ? ' kt-iki' : '') + '" id="kt-arena-' + key + '">' +
                oyuncuHtml(key, 'p1', iki ? '1. Oyuncu' : 'Sen') +
                (iki ? oyuncuHtml(key, 'p2', '2. Oyuncu') : '') +
            '</div>' +
            '<div class="kt-gerisayim" id="kt-say-' + key + '"><span>3</span></div>' +
            '</div>';

        tamEkranAc(key);          /* lobide açıldıysa zaten açık, dokunmaz */
        o.oyuncular.forEach(function (p) { noktaCiz(key, p); soruCiz(key, p); });
        gerisayim(key, 3);
        klavyeBagla(key);
    }

    function gerisayim(key, n) {
        var o = oturum[key]; if (!o) return;
        var kutu = el('kt-say-' + key); if (!kutu) return;
        if (n === 0) {
            kutu.remove();
            o.oyuncular.forEach(function (p) { o.durum[p].kilitli = false; });
            o.sayac = setInterval(function () { tik(key); }, 100);
            return;
        }
        kutu.innerHTML = '<span>' + (n === 1 ? 'BAŞLA' : n) + '</span>';
        ses('tik');
        o.gerisay = setTimeout(function () { gerisayim(key, n - 1); }, n === 1 ? 700 : 900);
    }

    function tik(key) {
        var o = oturum[key]; if (!o || !o.durum) return;
        o.oyuncular.forEach(function (p) {
            var s = o.durum[p];
            if (!s || s.bitti || s.kilitli) return;
            s.kalan -= 100;
            sureCiz(key, p);
            if (s.kalan <= 0) cevapla(key, p, null);
        });
    }

    function sureCiz(key, p) {
        var s = oturum[key].durum[p];
        var kutu = el('kt-sure-' + p + '-' + key); if (!kutu) return;
        var oran = Math.max(0, s.kalan) / SORU_SURE;
        (kutu.querySelector('i') || {style:{}}).style.width = (oran * 100) + '%';
        kutu.classList.toggle('az', oran <= 0.5 && oran > 0.25);
        kutu.classList.toggle('kritik', oran <= 0.25);
    }

    function noktaCiz(key, p) {
        var s = oturum[key].durum[p];
        var kutu = el('kt-nokta-' + p + '-' + key); if (!kutu) return;
        var h = '';
        for (var i = 0; i < s.sorular.length; i++) {
            var sinif = (i === s.i) ? ' class="simdi"' : (s.sorular[i]._d === true ? ' class="d"' : (s.sorular[i]._d === false ? ' class="y"' : ''));
            h += '<i' + sinif + '></i>';
        }
        kutu.innerHTML = h;
    }

    function soruCiz(key, p) {
        var o = oturum[key], s = o.durum[p];
        var sorKutu = el('kt-soru-' + p + '-' + key), sikKutu = el('kt-siklar-' + p + '-' + key);
        if (!sorKutu || !sikKutu) return;
        var q = s.sorular[s.i];
        if (!q) return;

        sorKutu.innerHTML =
            '<span class="kt-yon">' + (q.arTr ? 'Anlamı?' : 'Arapçası?') + '</span>' +
            (q.emoji ? '<div class="kt-emoji">' + q.emoji + '</div>' : '') +
            '<div class="kt-kelime ' + (q.arTr ? 'ar' : 'tr') + '"' + (q.arTr ? ' dir="rtl"' : '') + '>' +
                (q.arTr ? renkli(q.metin, q.kok) : esc(q.metin)) + '</div>';

        var tus = TUSLAR[p] || [];
        sikKutu.innerHTML = q.siklar.map(function (metin, i) {
            return '<button type="button" class="kt-sik' + (q.arTr ? '' : ' ar') + '" data-i="' + i + '"' +
                   (q.arTr ? '' : ' dir="rtl"') + '>' +
                   (tus[i] ? '<span class="kt-tus">' + tus[i] + '</span>' : '') +
                   '<span class="kt-sik-yazi">' + esc(metin) + '</span></button>';
        }).join('');
        [].forEach.call(sikKutu.querySelectorAll('.kt-sik'), function (b) {
            b.onclick = function () { cevapla(key, p, parseInt(b.getAttribute('data-i'), 10)); };
        });
        s.kalan = SORU_SURE;
        sureCiz(key, p);
        noktaCiz(key, p);
        /* Çizim bittikten sonra ölç: kutular yerine oturmuş olsun. */
        requestAnimationFrame(function () { olcekle(key, p); });
    }

    /* =================================================================
       YAZI BOYU ALANA GÖRE (Geylani: "flex olsun, taşma olmasın")
       -----------------------------------------------------------------
       Sabit clamp ölçüleri kısa kelimede alanı boş bırakıyor, uzun
       ibarede taşırıyordu; harekeler de kırpılabiliyordu. Ölçü ikili
       aramayla bulunuyor: kutusuna SIĞAN EN BÜYÜK punto. Satır aralığı
       1.35 — üstteki ve alttaki harekeler için pay bırakıyor.
       ================================================================= */
    /* Ölçü ikili aramayla bulunur: KUTUSU TAŞMAYAN en büyük punto.
       Taşma, yazının kendisinde değil KAPSAYICIDA ölçülüyor — başlık
       çipi, emoji ve aradaki boşluklar da hesaba katılsın diye; tahminî
       pay bırakmak dar ekranlarda 12 px taşırıyordu.
       2 px hoşgörü: satır kutusu kesirli çıkıyor, scrollHeight yukarı /
       clientHeight aşağı yuvarlanıyor. Harekelerin payını punto değil,
       satır aralığı (Arapçada 1.7) veriyor. */
    function sigdirKapta(yazi, kap, enAz, enCok) {
        if (!yazi || !kap) return enAz;
        var lo = enAz, hi = enCok, iyi = enAz;
        for (var i = 0; i < 9; i++) {
            var m = (lo + hi) / 2;
            yazi.style.fontSize = m.toFixed(1) + 'px';
            var tasti = (kap.scrollHeight > kap.clientHeight + 2) ||
                        (kap.scrollWidth > kap.clientWidth + 2) ||
                        (yazi.scrollWidth > yazi.clientWidth + 2);
            if (tasti) hi = m; else { iyi = m; lo = m; }
        }
        /* Bir punto pay: yuvarlama sınırda kalmasın. */
        iyi = Math.max(enAz, Math.floor(iyi) - 1);
        yazi.style.fontSize = iyi + 'px';
        return iyi;
    }
    function soruOlcekle(key, p) {
        var kap = el('kt-soru-' + p + '-' + key); if (!kap) return;
        var kelime = kap.querySelector('.kt-kelime'); if (!kelime) return;
        var ar = kelime.classList.contains('ar');
        sigdirKapta(kelime, kap, ar ? 16 : 13, ar ? 132 : 68);
    }
    function siklariOlcekle(key, p) {
        var kutu = el('kt-siklar-' + p + '-' + key); if (!kutu) return;
        var dugmeler = [].slice.call(kutu.querySelectorAll('.kt-sik'));
        if (!dugmeler.length) return;
        var ar = dugmeler[0].classList.contains('ar');
        var enAz = ar ? 11 : 9, enCok = ar ? 62 : 34;
        var kucuk = enCok;
        dugmeler.forEach(function (b) {
            var y = b.querySelector('.kt-sik-yazi'); if (!y) return;
            var s = sigdirKapta(y, b, enAz, enCok);
            if (s < kucuk) kucuk = s;
        });
        /* Dördü de aynı puntoda dursun — göz sıçramasın. */
        dugmeler.forEach(function (b) {
            var y = b.querySelector('.kt-sik-yazi'); if (y) y.style.fontSize = kucuk + 'px';
        });
    }
    function olcekle(key, p) { soruOlcekle(key, p); siklariOlcekle(key, p); }

    function cevapla(key, p, sikIndex) {
        var o = oturum[key]; if (!o || !o.durum) return;
        var s = o.durum[p];
        if (!s || s.bitti || s.kilitli) return;
        s.kilitli = true;

        var q = s.sorular[s.i];
        var secilen = (sikIndex == null) ? null : q.siklar[sikIndex];
        var dogruMu = secilen === q.dogru;
        q._d = dogruMu;

        var kazanc = 0;
        if (dogruMu) {
            kazanc = TABAN + Math.round(HIZ_PAYI * Math.max(0, s.kalan) / SORU_SURE);
            s.puan += kazanc; s.dogru++; s.seri++;
            if (s.seri > s.enSeri) s.enSeri = s.seri;
            ses('dogru');
        } else {
            s.seri = 0;
            s.yanlislar.push({ item: q.item, secilen: secilen, dogru: q.dogru });
            ses('yanlis');
        }

        /* şıkları boya */
        var sikKutu = el('kt-siklar-' + p + '-' + key);
        if (sikKutu) {
            [].forEach.call(sikKutu.querySelectorAll('.kt-sik'), function (b, i) {
                b.disabled = true;
                if (q.siklar[i] === q.dogru) b.classList.add('dogru');
                else if (i === sikIndex) b.classList.add('yanlis');
                else b.classList.add('soluk');
            });
        }
        puanCiz(key, p, kazanc, dogruMu);
        noktaCiz(key, p);

        setTimeout(function () {
            if (!oturum[key] || !oturum[key].durum) return;
            s.i++;
            if (s.i >= s.sorular.length) { oyuncuBitti(key, p); return; }
            s.kilitli = false;
            soruCiz(key, p);
        }, GOSTER);
    }

    function puanCiz(key, p, kazanc, dogruMu) {
        var s = oturum[key].durum[p];
        var puanKutu = el('kt-puan-' + p + '-' + key);
        if (puanKutu) puanKutu.textContent = s.puan;
        var seriKutu = el('kt-seri-' + p + '-' + key);
        if (seriKutu) {
            seriKutu.classList.toggle('acik', s.seri >= 3);
            var b = seriKutu.querySelector('b'); if (b) b.textContent = s.seri;
        }
        var panel = el('kt-' + p + '-' + key);
        if (!panel) return;
        var ucus = document.createElement('div');
        ucus.className = 'kt-ucus ' + (dogruMu ? 'arti' : 'sifir');
        ucus.textContent = dogruMu ? '+' + kazanc : '✕';
        panel.appendChild(ucus);
        setTimeout(function () { if (ucus.parentNode) ucus.parentNode.removeChild(ucus); }, 1000);
        if (!dogruMu) {
            panel.classList.add('carp');
            setTimeout(function () { panel.classList.remove('carp'); }, 360);
        }
    }

    function oyuncuBitti(key, p) {
        var o = oturum[key]; if (!o) return;
        var s = o.durum[p];
        s.bitti = true;
        var panel = el('kt-' + p + '-' + key);
        if (panel) {
            panel.classList.add('bitti');
            var sor = el('kt-soru-' + p + '-' + key), sik = el('kt-siklar-' + p + '-' + key);
            if (sik) sik.innerHTML = '';
            if (sor) sor.innerHTML =
                '<div class="kt-bekle"><b>' + s.puan + '</b>' +
                (o.kisi === 2 ? '<span>Bitirdin — rakip oynuyor…</span>' : '<span>Bitti</span>') + '</div>';
        }
        var hepsi = o.oyuncular.every(function (x) { return o.durum[x].bitti; });
        if (hepsi) setTimeout(function () { sonuc(key); }, 700);
    }

    /* =====================================================================
       SONUÇ
       ===================================================================== */
    function yildiz(dolu) {
        var yol = 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z';
        var h = '';
        for (var i = 0; i < 3; i++) {
            h += '<svg viewBox="0 0 24 24" class="' + (i < dolu ? 'dolu' : 'bos') + '"><path d="' + yol + '"/></svg>';
        }
        return '<div class="kt-yildizlar">' + h + '</div>';
    }
    /* Yanlışlar TEKİLLEŞTİRİLİR: kapışmada iki oyuncu da aynı kelimeyi
       kaçırabiliyor, liste aynı satırı iki kere basıyordu. Ekranda en çok
       altı satır durur, gerisi sayı olarak söylenir — kaydırılan yarım
       satır bırakmasın. */
    var YANLIS_EN_COK = 6;
    function yanlisListe(s) {
        var gorulen = {}, tekil = [];
        (s.yanlislar || []).forEach(function (y) {
            var a = y.item.arText;
            if (gorulen[a]) return;
            gorulen[a] = 1; tekil.push(y);
        });
        if (!tekil.length) return '';
        var fazla = tekil.length - YANLIS_EN_COK;
        return '<div class="kt-yanlis-liste"><h4>Tekrar bakılacaklar</h4><ul>' +
            tekil.slice(0, YANLIS_EN_COK).map(function (y) {
                return '<li><span class="ar" dir="rtl">' + esc(y.item.arText) + '</span>' +
                       (y.item.emoji ? '<span class="em">' + y.item.emoji + '</span>' : '') +
                       '<span class="tr">' + esc(y.item.trText) + '</span></li>';
            }).join('') +
            (fazla > 0 ? '<li class="kt-dahasi">… ve ' + fazla + ' kelime daha</li>' : '') +
            '</ul></div>';
    }

    function sonuc(key) {
        var o = oturum[key]; if (!o) return;
        if (o.sayac) { clearInterval(o.sayac); o.sayac = null; }
        /* Klavye dinleyicisi DURUYOR: sonuç ekranında da Esc ile çıkılsın.
           Şık tuşları `o.bitti` ile susturuluyor. */
        o.bitti = true;
        ses('bitis');

        var kap = el('grid-' + key); if (!kap) return;
        var govde;

        if (o.kisi === 2) {
            var a = o.durum.p1, b = o.durum.p2;
            var berabere = a.puan === b.puan;
            var kazanan = berabere ? null : (a.puan > b.puan ? 'p1' : 'p2');
            govde =
                '<div class="kt-sonuc">' +
                    '<div class="kt-kupa">' + (berabere ? '🤝' : '🏆') + '</div>' +
                    '<div class="kt-sonuc-bas">' +
                        (berabere ? 'Berabere!' : (kazanan === 'p1' ? '1. Oyuncu kazandı' : '2. Oyuncu kazandı')) +
                    '</div>' +
                    '<div class="kt-dueello">' +
                        '<div class="kt-taraf p1' + (kazanan === 'p1' ? ' kazandi' : '') + '">' +
                            '<div class="kt-ad">1. Oyuncu</div><div class="kt-skor">' + a.puan + '</div>' +
                            '<div class="kt-ad">' + a.dogru + '/' + a.sorular.length + ' doğru</div></div>' +
                        '<div class="kt-vs">VS</div>' +
                        '<div class="kt-taraf p2' + (kazanan === 'p2' ? ' kazandi' : '') + '">' +
                            '<div class="kt-ad">2. Oyuncu</div><div class="kt-skor">' + b.puan + '</div>' +
                            '<div class="kt-ad">' + b.dogru + '/' + b.sorular.length + ' doğru</div></div>' +
                    '</div>' +
                    yanlisListe({ yanlislar: a.yanlislar.concat(b.yanlislar) }) +
                    '<div class="kt-dugmeler">' +
                        '<button type="button" class="kt-dug ana" onclick="KidefKelimeTest.basla(\'' + key + '\')">Rövanş</button>' +
                        '<button type="button" class="kt-dug" onclick="KidefKelimeTest.ac(\'' + key + '\')">Ayarlar</button>' +
                        '<button type="button" class="kt-dug" onclick="KidefKelimeTest.kapat(\'' + key + '\')">Listeye dön</button>' +
                    '</div>' +
                '</div>';
        } else {
            var s = o.durum.p1;
            var oran = s.sorular.length ? Math.round(100 * s.dogru / s.sorular.length) : 0;
            var yil = oran >= 90 ? 3 : (oran >= 70 ? 2 : (oran >= 50 ? 1 : 0));
            var soz = yil === 3 ? 'Harika! Bu liste sende.' :
                      yil === 2 ? 'İyi gidiyor — bir tur daha?' :
                      yil === 1 ? 'Yarısını bildin, tekrar dene.' :
                                  'Önce Çalışma Kartları’na bir bak.';
            govde =
                '<div class="kt-sonuc">' +
                    yildiz(yil) +
                    '<div class="kt-sonuc-bas">' + soz + '</div>' +
                    '<div class="kt-ozet">' +
                        '<div class="kt-kutu"><b>' + s.puan + '</b><span>Puan</span></div>' +
                        '<div class="kt-kutu"><b>' + s.dogru + '/' + s.sorular.length + '</b><span>Doğru</span></div>' +
                        '<div class="kt-kutu"><b>%' + oran + '</b><span>İsabet</span></div>' +
                        '<div class="kt-kutu"><b>' + s.enSeri + '</b><span>En uzun seri</span></div>' +
                    '</div>' +
                    yanlisListe(s) +
                    '<div class="kt-dugmeler">' +
                        '<button type="button" class="kt-dug ana" onclick="KidefKelimeTest.basla(\'' + key + '\')">Tekrar</button>' +
                        '<button type="button" class="kt-dug" onclick="KidefKelimeTest.ac(\'' + key + '\')">Ayarlar</button>' +
                        '<button type="button" class="kt-dug" onclick="KidefKelimeTest.kapat(\'' + key + '\')">Listeye dön</button>' +
                    '</div>' +
                '</div>';
        }

        kap.innerHTML =
            '<div class="kt-sahne">' +
            govde + '</div>';
    }

    /* =====================================================================
       ÇIKIŞ
       ===================================================================== */
    /* sessiz=true → mod düğmesinden geliniyordur, liste kipini o kendi
       kuracak; buradan setMemoryMode çağrılırsa sonsuz döngü olur. */
    function kapat(key, sessiz) {
        var o = oturum[key];
        if (o) {
            if (o.sayac) clearInterval(o.sayac);
            if (o.gerisay) clearTimeout(o.gerisay);
        }
        klavyeCoz(key);
        delete oturum[key];

        /* TAM EKRANDAN ÇIKILMIYOR. Liste zaten tam ekran açılıyor; testten
           çıkmak "listeye dön" demek, "küçült" demek değil. Tam ekranı
           yalnız mod satırındaki küçült düğmesi kapatır. */
        var oy = oyunlar()[key];
        if (oy) oy.gameStarted = false;
        if (typeof oyunKilidi === 'function') oyunKilidi(key, false);
        if (typeof seritKapat === 'function') seritKapat(key);
        var g = el('grid-' + key);
        if (g) { g.innerHTML = ''; g.className = 'thematic-words-grid'; }
        if (!sessiz && typeof setMemoryMode === 'function') setMemoryMode(key, 'list');
    }

    /* BİR ADIM GERİ — ✕ testi tamamen kapatmaz, mod seçimine (lobiye)
       döner (Geylani). Yanlış kişi sayısı ya da soru sayısı seçilmişse
       baştan listeye düşüp yeniden girmek gerekmesin diye. Lobideki ✕
       ise testten çıkarır; orada geri gidilecek yer yok. */
    function lobiyeDon(key) {
        var o = oturum[key];
        if (o) {
            if (o.sayac) { clearInterval(o.sayac); o.sayac = null; }
            if (o.gerisay) { clearTimeout(o.gerisay); o.gerisay = null; }
        }
        klavyeCoz(key);
        /* Tur sürerken kilit açılmalı; yoksa ac() içindeki setMemoryMode
           "oyun sürüyor" deyip erken dönüyor ve düğmeler kilitli kalıyor. */
        var oy = oyunlar()[key];
        if (oy) oy.gameStarted = false;
        if (typeof oyunKilidi === 'function') oyunKilidi(key, false);
        ac(key);                       /* tam ekran zaten açık, dokunmaz */
    }

    /* ---------------- klavye ---------------- */
    function klavyeBagla(key) {
        klavyeCoz(key);
        var o = oturum[key]; if (!o) return;
        o.klavye = function (e) {
            /* Esc de ✕ ile aynı: arenada bir adım geri, lobide çıkış. */
            if (e.key === 'Escape') {
                if (o.lobide) kapat(key); else lobiyeDon(key);
                return;
            }
            if (o.lobide) return;             /* lobide şık tuşu yok */
            if (o.bitti) return;              /* tur bitti, şık tuşları kapalı */
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            var t = (e.target && e.target.tagName) || '';
            if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
            for (var i = 0; i < o.oyuncular.length; i++) {
                var p = o.oyuncular[i], idx = TUSLAR[p].indexOf(e.key);
                if (idx > -1) {
                    var q = o.durum[p].sorular[o.durum[p].i];
                    if (q && idx < q.siklar.length) { e.preventDefault(); cevapla(key, p, idx); }
                    return;
                }
            }
        };
        document.addEventListener('keydown', o.klavye);
    }
    function klavyeCoz(key) {
        var o = oturum[key];
        if (o && o.klavye) { document.removeEventListener('keydown', o.klavye); o.klavye = null; }
    }

    /* Ekran döndürülünce / pencere boyutlanınca yeniden ölçülür. */
    var olcumZaman = null;
    window.addEventListener('resize', function () {
        clearTimeout(olcumZaman);
        olcumZaman = setTimeout(function () {
            for (var k in oturum) {
                var o = oturum[k];
                if (!o || !o.oyuncular) continue;
                o.oyuncular.forEach(function (p) { olcekle(k, p); });
            }
        }, 160);
    });

    window.KidefKelimeTest = {
        ac: ac, kisi: kisi, adet: adet, basla: basla, kapat: kapat,
        lobiyeDon: lobiyeDon,
        acikMi: function (key) { return !!oturum[key]; },
        /* Sayfanın kendi Esc davranışı (kelimeler.html'de geri dönüş) test
           açıkken devreye girmesin diye: herhangi bir listede test var mı? */
        acikVar: function () { for (var k in oturum) { if (oturum[k]) return true; } return false; }
    };
})();
