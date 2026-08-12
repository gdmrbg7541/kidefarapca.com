/* =====================================================================
   KALIP LİSTESİ — "kök seçilmeden kalıba bakma" kipi
   ---------------------------------------------------------------------
   NE YAPAR
   Tabloda bir kalıp kutusuna KÖK SEÇİLİ DEĞİLKEN dokunulduğunda, o
   kalıptan sözlükte kayıtlı bütün kelimeleri bir perdede listeler.
   Kök seçiliyken hiçbir şeye karışmaz: eski davranış (kutu döngüsü,
   çekim penceresi) olduğu gibi çalışır.

   ÜÇ GÖRÜNÜM — hangisinin açılacağını kalıp numarası söyler
   1) TEKİL  (isim kalıpları: 17-51 ve tablo dışı numaralar)
      Tek kalıp, 4 sütunlu kart ızgarası.  Ör. 33 → حاكِم · كاتِب · عالِم…
   2) BÂB    (sülâsî mücerret fiiller: 1-16)
      O fiilin BÂBI açılır; mazi · muzari · emir olmak üzere 3 sütun.
      DİKKAT: 1., 2. ve 3. bâbın mazisi ORTAKTIR (hepsi #1, tabloda
      rowspan="3"). Bu yüzden üçlüler 3'er 3'er bölünemez:
          1.bâb [1,2,3] · 2.bâb [1,4,5] · 3.bâb [1,6,7]
          4.bâb [8,9,10] · 5.bâb [11,12,13] · 6.bâb [14,15,16]
      Ayrıca bir kök yalnız #1'e sahip diye 2. bâba yazılmamalı; bâb
      üyeliği MUZARİ ya da EMİR ile belirlenir (bkz. babUyesi).
   3) MEZİD  (52-105)
      Tablodaki SATIRIN tamamı: mazi · muzari · emir · mastar ·
      ism-i fâil · ism-i mef'ûl — en çok 6 sütun.
      İki istisna: Mufâ'ale'nin iki mastarı (67+68) tek sütunda
      birleşir; İf'ilâl'in ism-i mef'ûlü yoktur (5 sütun).

   VERİ
   sozlukVerileri (veri_sozluk.js, veri_kokler.js ile birleştirilmiş —
   bkz. veri_sozluk.js sonundaki Object.assign). Ters indeks (numara →
   kelimeler) sitede yoktu, burada bir kez kurulup önbelleğe alınıyor.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KalipListe) return;

    /* ---------- 1) SÜTUN DÜZENLERİ ---------- */

    /* Sülâsî mücerret bâbları: [mazi, muzari, emir].
       Kaynak: veri_kok_numaralari.js → BAB_KALIP ve tablodaki rowspan. */
    var BAB = [
        { ad: '1. Bâb', no: [1, 2, 3] },
        { ad: '2. Bâb', no: [1, 4, 5] },
        { ad: '3. Bâb', no: [1, 6, 7] },
        { ad: '4. Bâb', no: [8, 9, 10] },
        { ad: '5. Bâb', no: [11, 12, 13] },
        { ad: '6. Bâb', no: [14, 15, 16] }
    ];
    var BAB_BASLIK = ['Mazi', 'Muzari', 'Emir'];

    /* Mezid tablosunun satırları — HTML'deki sırayla (klasik I-X sırası
       değil, sayfadaki pedagojik sıra). İç dizi = tek sütunda duran
       iki kalıp (Mufâ'ale'nin iki mastarı). */
    var MEZID = [
        { ad: 'İf\'âl',    no: [52, 53, 54, 55, 56, 57] },
        { ad: 'Tef\'îl',   no: [58, 59, 60, 61, 62, 63] },
        { ad: 'Mufâ\'ale', no: [64, 65, 66, [67, 68], 69, 70] },
        { ad: 'İnfi\'âl',  no: [71, 72, 73, 74, 75, 76] },
        { ad: 'İfti\'âl',  no: [77, 78, 79, 80, 81, 82] },
        { ad: 'İf\'ilâl',  no: [83, 84, 85, 86, 87] },
        { ad: 'Tefe\'ul',  no: [88, 89, 90, 91, 92, 93] },
        { ad: 'Tefâ\'ul',  no: [94, 95, 96, 97, 98, 99] },
        { ad: 'İstif\'âl', no: [100, 101, 102, 103, 104, 105] }
    ];
    var MEZID_BASLIK = ['Mazi', 'Muzari', 'Emir', 'Mastar', 'İsm-i Fâil', 'İsm-i Mef\'ûl'];

    /* Tablo dışı/eksik numaralar için yedek vezin adları (KALIP_DATA
       yüklüyse oradan gelir; değilse başlık numarayla yetinir). */
    function kalipBilgi(no) {
        var d = (typeof KALIP_DATA !== 'undefined') ? KALIP_DATA[String(no)] : null;
        return { ar: (d && d.ar) || '', tr: (d && d.tr) || '' };
    }

    /* ---------- 2) TERS İNDEKS: numara → kelimeler ---------- */
    var _indeks = null;

    function havuz() {
        /* Çalışma anında sozlukVerileri, wordEasterEggs ile birleşiktir
           (veri_sozluk.js sonu). İkisi de yoksa boş dön. */
        if (typeof sozlukVerileri !== 'undefined') return sozlukVerileri;
        if (typeof wordEasterEggs !== 'undefined') return wordEasterEggs;
        return {};
    }
    function kokMu(kayit) {
        /* isDictOnly kayıtları kök değil, edat/tematik sözlük girdisi:
           sayısal kalıp anahtarları yok, listeye girmemeli. */
        return !!kayit && !kayit.isDictOnly;
    }
    function ornekDizi(o) {
        /* ornek alanı verinin bir yerinde NESNE, bir yerinde DİZİ.
           (2417 nesne · 310 dizi · 87 yok) — tek biçime indiriyoruz. */
        if (!o) return [];
        return Array.isArray(o) ? o : [o];
    }
    function govde(kok, no) {
        var k = havuz()[kok];
        var h = k && k[no];
        var b = h && h.base;
        if (!b || !b.arText) return null;
        return { kok: kok, no: no, ar: b.arText, tr: b.trText || '',
                 emoji: b.emoji || '', ornek: ornekDizi(b.ornek) };
    }
    function indeks() {
        if (_indeks) return _indeks;
        _indeks = {};
        var H = havuz();
        for (var kok in H) {
            if (!Object.prototype.hasOwnProperty.call(H, kok) || !kokMu(H[kok])) continue;
            for (var k in H[kok]) {
                if (!/^\d+$/.test(k)) continue;          /* "Gun", "21_cogul" gibi anahtarlar */
                var g = govde(kok, k);
                if (!g) continue;
                (_indeks[+k] = _indeks[+k] || []).push(g);
            }
        }
        return _indeks;
    }
    /* Ders verisi sonradan birleşirse indeks bayatlamasın */
    function indeksiTazele() { _indeks = null; }

    /* ---------- 3) KALIP → GÖRÜNÜM ---------- */

    function babBul(no) {
        for (var i = 0; i < BAB.length; i++)
            if (BAB[i].no.indexOf(no) >= 0 && no !== 1) return BAB[i];
        /* #1 üç bâbın ORTAK mazisi: hangisine ait olduğu belirsiz,
           bu yüzden ona basmak 1. bâbı açar (tablodaki ilk satır). */
        if (no === 1) return BAB[0];
        return null;
    }
    function mezidBul(no) {
        for (var i = 0; i < MEZID.length; i++) {
            var s = MEZID[i].no;
            for (var j = 0; j < s.length; j++) {
                var c = s[j];
                if (Array.isArray(c) ? c.indexOf(no) >= 0 : c === no) return MEZID[i];
            }
        }
        return null;
    }
    /* Bir kök bu bâbın üyesi mi? Ortak mazi (#1) tek başına yetmez —
       yoksa yalnız 1. bâbı olan kök 2. ve 3. bâbda da görünürdü. */
    function babUyesi(kok, grup) {
        return !!(govde(kok, grup[1]) || govde(kok, grup[2]));
    }

    function gorunum(no) {
        var bab = (no >= 1 && no <= 16) ? babBul(no) : null;
        if (bab) return { kip: 'bab', ad: bab.ad, sutun: bab.no, baslik: BAB_BASLIK };
        var mez = (no >= 52 && no <= 105) ? mezidBul(no) : null;
        if (mez) {
            /* İKİLİ SÜTUN (Mufâ'ale'nin iki mastarı 67/68): hangisine
               basıldıysa YALNIZ o gösterilir ve satırlar ona sahip
               olanlarla sınırlanır. 68'e basıp mastarı 67 olan
               kelimeleri listelemek yanıltıcı olurdu. */
            var sutun = mez.no.map(function (c) {
                return (Array.isArray(c) && c.indexOf(no) >= 0) ? no : c;
            });
            var ikili = mez.no.some(function (c) { return Array.isArray(c) && c.indexOf(no) >= 0; });
            return { kip: 'mezid', ad: mez.ad + ' Bâbı', sutun: sutun,
                     baslik: MEZID_BASLIK.slice(0, mez.no.length),
                     zorunlu: ikili ? no : null };
        }
        return { kip: 'tekil', ad: '', sutun: [no], baslik: null };
    }

    /* Izgara/matris satırları: her satır BİR kök, her sütun bir kalıp */
    function satirlar(g) {
        var H = havuz(), c = [];
        var duz = [];
        g.sutun.forEach(function (s) { (Array.isArray(s) ? s : [s]).forEach(function (x) { duz.push(x); }); });
        for (var kok in H) {
            if (!Object.prototype.hasOwnProperty.call(H, kok) || !kokMu(H[kok])) continue;
            if (g.kip === 'bab' && !babUyesi(kok, g.sutun)) continue;
            /* Zorunlu kalıp (67/68 gibi): o kalıbı olmayan kök listeye girmez */
            if (g.zorunlu && !govde(kok, g.zorunlu)) continue;
            var hucre = g.sutun.map(function (s) {
                if (!Array.isArray(s)) return govde(kok, s) ? [govde(kok, s)] : [];
                return s.map(function (x) { return govde(kok, x); }).filter(Boolean);
            });
            var dolu = hucre.reduce(function (n, h) { return n + (h.length ? 1 : 0); }, 0);
            if (!dolu) continue;
            c.push({ kok: kok, hucre: hucre, dolu: dolu });
        }
        /* Sıralamayı ac() yapıyor: alfabe süzgeci hep açık olduğu için
           bütün görünümlerde tek ölçü var — kökün baş harfi. */
        return c;
    }

    /* ---------- 3b) TABLONUN KENDİ RENGİNİ ÖDÜNÇ AL ----------
       Tasarım bütünlüğü elle kopyalanan renklerle değil, TABLONUN
       KENDİSİNDEN okunarak sağlanıyor: kalıbın kutusunu sayfada bul,
       içinde durduğu hücrenin rengini al. Böylece Geylani tabloyu
       yeniden boyarsa perde de kendiliğinden uyar.
       Mücerret satırları renksizdir (şeffaf) — orada tablo da öyle. */
    function kutuBul(no) {
        var ler = document.querySelectorAll('.glass-box');
        for (var i = 0; i < ler.length; i++) {
            var r = ler[i].querySelector('.ref');
            var m = r ? String(r.innerText || r.textContent || '').trim()
                      : String(ler[i].getAttribute('data-ref') || '').trim();
            if (parseInt(m, 10) === no) return ler[i];
        }
        return null;
    }
    function rgbCoz(x) {
        var m = String(x || '').match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        var p2 = m[1].split(',').map(function (v) { return parseFloat(v); });
        if (p2.length > 3 && p2[3] === 0) return null;          /* saydam */
        return { r: p2[0], g: p2[1], b: p2[2] };
    }
    function koyult(c, k) {
        return 'rgb(' + [c.r, c.g, c.b].map(function (v) {
            return Math.max(0, Math.round(v * k)); }).join(',') + ')';
    }
    function satirTonu(no) {
        var k = kutuBul(no);
        var td = k && k.closest ? k.closest('td') : null;
        var c = td ? rgbCoz(getComputedStyle(td).backgroundColor) : null;
        if (!c) return null;
        /* Neredeyse beyazsa ton sayılmaz (mücerret hücreleri böyle) */
        if (c.r > 250 && c.g > 250 && c.b > 250) return null;
        return { ton: 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')', vurgu: koyult(c, 0.55) };
    }

    /* ---------- 3c) KÖK PLAKASI: iki kısayol ----------
       Matris görünümlerinde ilk sütun kökün kendisi. Kök yazısının
       ALTINA iki düğme koyuyoruz — liste artık bir çıkmaz sokak değil,
       köke giden kapı:

         ⏱ MARATON — o kökün fiil çekim tablosunu açar (mazi · muzari ·
           emir). Kökte birden çok fiil varsa (عَلِمَ · عَلَّمَ · تَعَلَّمَ)
           maratonun kendi fiil seçme lobisi çıkar, öğrenci hangisini
           çalışacağını seçer.
         ▦ TABLO — kökü listeden seçmiş gibi davranır: perde kapanır,
           sayfadaki mücerret/mezid tablosu o kökle dolar.

       İkisi de kökü selectReadyVerb ile seçer (sayfanın kök listesinin
       kullandığı yol); tek fark maratonun ardından openMarathon
       çağırması. Böylece kökün seçilme biçimi tek elden yürüyor,
       burada ayrı bir "kök seçme" kopyası tutmuyoruz. */

    var SVG_KRONO =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="13" r="8"></circle><polyline points="12 9 12 13 14 15"></polyline>' +
        '<line x1="10" y1="2" x2="14" y2="2"></line><line x1="12" y1="2" x2="12" y2="5"></line>' +
        '<line x1="18" y1="6" x2="16.5" y2="7.5"></line></svg>';
    var SVG_TABLO =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
        '<line x1="3" y1="9" x2="21" y2="9"></line>' +
        '<line x1="9" y1="21" x2="9" y2="9"></line></svg>';

    /* Kök seçme: sayfanın kendi yolu. selectReadyVerb tabloyu sıfırlar,
       kökü onaylar, kutuları boyar ve kahverengi kök taşını doğurur. */
    function kokSec(kok) {
        kapat();
        if (typeof selectReadyVerb === 'function') { selectReadyVerb(kok); return true; }
        if (typeof selectRootFromMainKeyboard === 'function') { selectRootFromMainKeyboard(kok); return true; }
        return false;
    }
    /* Fiili olmayan kökte maraton düğmesi sönük durur: openMarathon o
       durumda telaffuz ekranına düşüyor, öğrenci basmadığı yere gitmesin.
       (Sözlükteki 252 kökün 6'sı yalnız isim kalıplarından ibaret.) */
    function maratonVar(kok) {
        return (typeof hasVerbsToRead === 'function') ? !!hasVerbsToRead(kok) : true;
    }

    /* ---------- MARATON: GİT VE GERİ DÖN ----------
       ⏱ düğmesi kökü TABLOYA TAŞIMAZ. Önce selectReadyVerb çağrılıyordu;
       o tabloyu sıfırlayıp kökü yerleştirdiği için maratondan çıkınca
       öğrenci listeye değil, ▦ düğmesine basmış gibi kökün tablosuna
       düşüyordu. Artık:
         · perde yalnızca GİZLENİR (durumu — kalıp, süzgeç, seçim — durur),
         · maratonun ihtiyaç duyduğu iki değişken (currentRoot ve
           activeConfirmedRoot) geçici olarak bu köke ayarlanır,
         · maraton kapanınca ikisi de eski hâline döner ve perde en son
           bakılan kalıpla, aynı süzgeçle yeniden açılır.
       Kapanışı yakalamak için sayfanın closeMarathon'u bir kez sarılıyor;
       yalnız BİZ açtıysak (maratonDonus dolu) geri dönüş çalışır. */
    var maratonDonus = null;
    var kapatSarildi = false;

    function maratonKapanisiniYakala() {
        if (kapatSarildi || typeof window.closeMarathon !== 'function') return;
        kapatSarildi = true;
        var eski = window.closeMarathon;
        window.closeMarathon = function () {
            var d = maratonDonus; maratonDonus = null;
            var s = eski.apply(this, arguments);
            if (d) setTimeout(function () { maratondanDon(d); }, 60);
            return s;
        };
    }
    function maratondanDon(d) {
        /* Kök maratondan önceki hâline döner: perde "kök seçili değilken"
           çalışıyor, kök üstünde kalırsa kalıba dokunmak listeyi açmaz. */
        try { currentRoot = d.kokOnce; } catch (e) {}
        window.activeConfirmedRoot = d.onayOnce;
        if (!isFinite(d.no)) return;
        ac(d.no);
        suzgec = d.suzgec;                       /* aynı sekme, aynı seçim */
        suzgecCiz(); govdeCiz();
    }
    function maratonAc(kok) {
        maratonKapanisiniYakala();
        maratonDonus = {
            no: acikNo,
            suzgec: { tur: suzgec.tur, deger: suzgec.deger, acik: suzgec.acik },
            kokOnce: (typeof currentRoot !== 'undefined') ? currentRoot : '',
            onayOnce: window.activeConfirmedRoot || ''
        };
        kapat();                                  /* durumu bozmadan gizle */
        try { currentRoot = kok; } catch (e) {}
        window.activeConfirmedRoot = kok;
        /* Perdenin kapanış geçişi bitsin, maraton yarım kareye denk gelmesin */
        setTimeout(function () {
            if (typeof window.openMarathon === 'function') window.openMarathon();
        }, 60);
    }
    function kokDugmesi(sinif, svg, baslik) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-kd ' + sinif;
        b.title = baslik;
        b.setAttribute('aria-label', baslik);
        b.innerHTML = svg;
        return b;
    }
    function kokPlaka(kok) {
        var p = document.createElement('div');
        p.className = 'kl-kok-plaka';

        var ad = document.createElement('span');
        ad.className = 'kl-kok-ad';
        ad.setAttribute('dir', 'rtl');
        ad.textContent = kok;
        p.appendChild(ad);

        var sira = document.createElement('span');
        sira.className = 'kl-kok-dugmeler';
        sira.setAttribute('dir', 'ltr');

        var m = kokDugmesi('kl-kd-maraton', SVG_KRONO, kok + ' — fiil çekim maratonu');
        if (!maratonVar(kok)) {
            m.classList.add('kl-kd-pasif');
            m.disabled = true;
            m.title = 'Bu kökte çekilecek fiil yok';
        } else {
            m.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation();
                maratonAc(kok);
            });
        }
        sira.appendChild(m);

        var t = kokDugmesi('kl-kd-tablo', SVG_TABLO, kok + ' — kökü tabloda aç');
        t.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            kokSec(kok);
        });
        sira.appendChild(t);

        p.appendChild(sira);
        return p;
    }

    /* ---------- 3d) SÜZGEÇ: KÖK ARA ve AKSÂM-I SEB'A ----------
       Liste uzun (33'te 130+ kelime, İf'âl'de 64 kök); öğrenci aradığını
       bulabilsin diye iki süzgeç var ve İKİSİ AYNI ANDA DEĞİL, sıra
       birindedir:
         KÖK ARA (içeride 'alfabe') — açılışta seçili olan budur; küçük
                   arama klavyesini açar. Kelimeler her hâlükârda kökün
                   BAŞ HARFİNE göre dizilir; bir tuşa basılırsa yalnız
                   o harfle başlayan kökler kalır.
         AKSÂM-I SEB'A — kökün yapısına göre yedi kısım. Bir kısma
                   basılınca yalnız o kısmın örnekleri kalır, sıralama
                   yine alfabetiktir.
       Sınıflandırmayı BURADA YENİDEN YAZMIYORUZ: sayfanın kendi
       getAksamIseba'sı (kaliplartablosu.js) çağrılıyor — Geylani kuralı
       orada düzeltirse süzgeç de kendiliğinden uyar. */

    /* Hicâî sıra. Unicode zaten bu sırada ama hemzeli biçimler (أ إ آ ؤ ئ ء)
       elif'ten ÖNCE geliyor; sözlük geleneğinde olduğu gibi hepsini elif'e
       indiriyoruz — yoksa أخذ listenin başında tek başına kalırdı. */
    var ALFABE = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ',
                  'ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];
    var HARF_SIRA = (function () { var o = {}; ALFABE.forEach(function (h, i) { o[h] = i; }); return o; })();
    var HEMZE = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ء': 'ا', 'ؤ': 'ا', 'ئ': 'ا', 'ى': 'ي', 'ة': 'ه' };
    function sadeHarf(h) { return HEMZE[h] || h; }
    function basHarf(kok) { return sadeHarf(String(kok).charAt(0)); }
    function kokKarsilastir(a, b) {
        var x = String(a), y = String(b);
        var n = Math.max(x.length, y.length);
        for (var i = 0; i < n; i++) {
            var hx = HARF_SIRA[sadeHarf(x.charAt(i))], hy = HARF_SIRA[sadeHarf(y.charAt(i))];
            if (hx === undefined) hx = 99; if (hy === undefined) hy = 99;
            if (hx !== hy) return hx - hy;
        }
        return 0;
    }

    /* Anahtarlar getAksamIseba'nın döndürdükleriyle birebir; gösterilen
       ad ise sınıfta kullanılan yazımıyla (sahih-SÂLİM). */
    /* Kısa tanım ve örnek fiil, sayfanın KAVRAM ŞEMASI'ndan birebir
       alındı (kaliplartablosu.html → #aksam-sema-panel). Öğrenci orada
       ezberlediği cümleyi burada da aynı sözcüklerle görsün; iki ekran
       farklı şey öğretmesin. Gruplar da oradaki gibi: sahih üç, mu'tel dört. */
    var AKSAM = [
        { k: 'Sahih',  ad: 'Sâlim',  grup: 'sahih', kisa: 'İllet, hemze yok.',  ornek: 'كَتَبَ',
          ip: 'Kök harflerinin üçü de sahih: ne illet harfi ne hemze (كَتَبَ)' },
        { k: 'Mehmuz', ad: 'Mehmûz', grup: 'sahih', kisa: 'Hemze (ء) var.',     ornek: 'أَكَلَ',
          ip: 'Kök harflerinden biri hemze (أَكَلَ · سَأَلَ · قَرَأَ)' },
        { k: 'Muzaaf', ad: 'Muzâaf', grup: 'sahih', kisa: 'Şeddeli fiil.',      ornek: 'مَدَّ',
          ip: 'İkinci ve üçüncü harf aynı, şeddeli okunur (مَدَّ)' },
        { k: 'Misal',  ad: 'Misâl',  grup: 'mutel', kisa: 'İLK harf illetli.',  ornek: 'وَجَدَ',
          ip: 'İlk harfi illetli (وَعَدَ)' },
        { k: 'Ecvef',  ad: 'Ecvef',  grup: 'mutel', kisa: 'ORTA harf illetli.', ornek: 'قَالَ',
          ip: 'Ortadaki harfi illetli (قَالَ)' },
        { k: 'Nakıs',  ad: 'Nâkıs',  grup: 'mutel', kisa: 'SON harf illetli.',  ornek: 'رَمَى',
          ip: 'Son harfi illetli (رَمَى)' },
        { k: 'Lefif',  ad: 'Lefîf',  grup: 'mutel', kisa: 'İKİ illetli.',       ornek: 'طَوَى',
          ip: 'İki harfi birden illetli (طَوَى · وَقَى)' }
    ];
    /* Şemadaki yerleşim: SOLDA mu'tel (4), SAĞDA sahih (3). */
    var SEMA_SIRA = [{ g: 'mutel', ad: 'MU\'TEL' }, { g: 'sahih', ad: 'SAHİH' }];
    var _aksamBellek = {};
    function aksamlar(kok) {
        if (_aksamBellek[kok]) return _aksamBellek[kok];
        var d = (typeof getAksamIseba === 'function') ? getAksamIseba(kok) : ['Sahih'];
        if (!d || !d.length) d = ['Sahih'];
        return (_aksamBellek[kok] = d);
    }
    function aksamAdi(k) {
        for (var i = 0; i < AKSAM.length; i++) if (AKSAM[i].k === k) return AKSAM[i].ad;
        return k;
    }

    /* Açık perdenin hâli: hangi kalıp, hangi görünüm, süzülmemiş liste */
    var acikNo = null, acikGor = null, tumler = [];
    var suzgec = { tur: 'alfabe', deger: null, acik: false };

    function suz(ler) {
        if (!suzgec.deger) return ler.slice();
        if (suzgec.tur === 'alfabe')
            return ler.filter(function (x) { return basHarf(x.kok) === suzgec.deger; });
        return ler.filter(function (x) { return aksamlar(x.kok).indexOf(suzgec.deger) >= 0; });
    }
    function sayim(tur) {
        var m = {};
        tumler.forEach(function (x) {
            if (tur === 'alfabe') { var h = basHarf(x.kok); m[h] = (m[h] || 0) + 1; }
            else aksamlar(x.kok).forEach(function (a) { m[a] = (m[a] || 0) + 1; });
        });
        return m;
    }
    /* KLAVYE DİZİLİŞİ — sayfanın kendi arama klavyesiyle AYNI KAYNAK:
       universalKeyboardLayout (kaliplartablosu.js). Öğrenci kök ararken
       hangi tuşa basıyorsa harf süzgecinde de aynı yerde bulur; Geylani
       yerleşimi değiştirirse ikisi birden değişir. Sayfa yüklenmemişse
       diye birebir kopyası yedekte durur. */
    var KLAVYE = (typeof universalKeyboardLayout !== 'undefined' && universalKeyboardLayout.length)
        ? universalKeyboardLayout
        : [['ذ','ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د'],
           ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],
           ['ئ','ء','ؤ','ر','ى','ة','و','ز','ظ','BACKSPACE']];

    function tus(sinif, ic, sayi, baslik) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-tus ' + sinif;
        b.title = baslik;
        b.setAttribute('aria-label', baslik);
        b.innerHTML = '<span class="kl-tus-harf">' + ic + '</span>' +
                      (sayi === null ? '' : '<span class="kl-tus-sayi">' + sayi + '</span>');
        return b;
    }
    function klavyeCiz(say) {
        var kb = document.createElement('div');
        kb.className = 'kl-klavye';
        KLAVYE.forEach(function (satir) {
            var s = document.createElement('div');
            s.className = 'kl-kb-satir';
            satir.forEach(function (h) {
                /* Sil tuşunun yerine "Hepsi": süzgeci kaldıran tuşun
                   klavyede en beklenen yeri orası. */
                if (h === 'BACKSPACE') {
                    var t = tus('kl-tus-hepsi' + (suzgec.deger ? '' : ' kl-tus-secili'),
                                'Hepsi', tumler.length, 'Süzgeci kaldır');
                    t.addEventListener('click', function () { sec(null); });
                    s.appendChild(t);
                    return;
                }
                var n = say[h] || 0;
                var yazi = (h === 'ه') ? 'هـ' : h;          /* klavyedeki gösterimin aynısı */
                if (!n) {
                    /* Klavyenin şekli bozulmasın diye tuş yerinde durur ama
                       sönüktür. Hemzeli biçimler (ء ئ ؤ) ve ى · ة kök başında
                       hiç geçmez — onlar elif/ye tuşunda toplanıyor, ipucu
                       bunu söyler ki öğrenci "bozuk" sanmasın. */
                    var nere = HEMZE[h];
                    var t2 = tus('kl-tus-olu', yazi, null,
                        nere ? ('Bu harf ' + nere + ' tuşunda toplanıyor')
                             : ('Bu kalıpta ' + h + ' ile başlayan kök yok'));
                    t2.disabled = true;
                    s.appendChild(t2);
                    return;
                }
                var t3 = tus(suzgec.deger === h ? 'kl-tus-secili' : '', yazi, n,
                             h + ' ile başlayan ' + n + ' kök');
                t3.addEventListener('click', function () { sec(h); });
                s.appendChild(t3);
            });
            kb.appendChild(s);
        });
        return kb;
    }

    /* AKSÂM SEKMESİ = KAVRAM ŞEMASININ KÜÇÜĞÜ
       Sayfanın kendi şeması (kalıplar tablosundaki "Kavram Şeması"
       düğmesi) iki dala ayrılır: solda MU'TEL dördü, sağda SAHİH üçü;
       her kart ad · tanım · örnek fiil taşır. Süzgeci de aynı şekle
       soktuk — öğrenci hangi ekranda olursa olsun aynı haritayı görür.
       Şemadaki kök başlığının yerinde "Hepsi" duruyor: süzgeci kaldırır. */
    function aksamKarti(a, n, ortala) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-sema-kart kl-sk-' + a.grup +
                      (ortala ? ' kl-sk-orta' : '') +
                      (suzgec.deger === a.k ? ' kl-sema-secili' : '') +
                      (n ? '' : ' kl-sema-bos');
        b.title = n ? a.ip : ('Bu kalıpta ' + a.ad.toLocaleLowerCase('tr') + ' kök yok');
        b.innerHTML =
            '<span class="kl-sk-sayi">' + n + '</span>' +
            '<span class="kl-sk-ad">' + a.ad + '</span>' +
            '<span class="kl-sk-tanim">' + a.kisa + '</span>' +
            '<span class="kl-sk-ornek" dir="rtl">' + a.ornek + '</span>';
        if (!n) b.disabled = true;
        else b.addEventListener('click', function () { sec(a.k); });
        return b;
    }
    function aksamCiz(say) {
        var kap = document.createElement('div');
        kap.className = 'kl-sema';

        var kok = document.createElement('button');
        kok.type = 'button';
        kok.className = 'kl-sema-kok' + (suzgec.deger ? '' : ' kl-sema-secili');
        kok.title = 'Süzgeci kaldır';
        kok.innerHTML = '<span>Hepsi</span><b>' + tumler.length + '</b>';
        kok.addEventListener('click', function () { sec(null); });
        kap.appendChild(kok);

        var dallar = document.createElement('div');
        dallar.className = 'kl-sema-dallar';
        SEMA_SIRA.forEach(function (g) {
            var sut = document.createElement('div');
            sut.className = 'kl-sema-sutun kl-sema-' + g.g;
            var bas = document.createElement('div');
            bas.className = 'kl-sema-baslik';
            bas.textContent = g.ad;
            sut.appendChild(bas);
            var iz = document.createElement('div');
            iz.className = 'kl-sema-izgara';
            var uyeler = AKSAM.filter(function (a) { return a.grup === g.g; });
            uyeler.forEach(function (a, i) {
                /* Tek sayıda kart varsa sonuncusu ortalanır (şemadaki
                   MUDAAF kartı gibi) — sütun tek başına asimetrik durmasın. */
                iz.appendChild(aksamKarti(a, say[a.k] || 0,
                    uyeler.length % 2 === 1 && i === uyeler.length - 1));
            });
            sut.appendChild(iz);
            dallar.appendChild(sut);
        });
        kap.appendChild(dallar);
        return kap;
    }

    function pul(sinif, etiket, sayi, secili, baslik) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'kl-pul ' + sinif + (secili ? ' kl-pul-secili' : '');
        if (baslik) b.title = baslik;
        b.innerHTML = '<span class="kl-pul-ad">' + etiket + '</span>' +
                      (sayi === null ? '' : '<span class="kl-pul-sayi">' + sayi + '</span>');
        return b;
    }
    function suzgecCiz() {
        var kap = document.getElementById('klSuzgec');
        if (!kap) return;
        /* Tek kelimelik listede süzgeç gürültüdür. Süzgeç yokken kalıp
           levhası üst sırada tek başına kalır, ortalanır. */
        var yalin = (tumler.length < 4);
        kap.style.display = yalin ? 'none' : '';
        var ust = document.getElementById('klUst');
        if (ust) ust.classList.toggle('kl-ust-yalin', yalin);
        kap.setAttribute('data-acik', suzgec.acik ? '1' : '0');
        var ok = document.getElementById('klKucult');
        if (ok) {
            var ipucu = suzgec.acik ? 'Süzgeci küçült' : 'Süzgeci aç';
            ok.title = ipucu;
            ok.setAttribute('aria-label', ipucu);
            ok.setAttribute('aria-expanded', suzgec.acik ? 'true' : 'false');
        }
        kap.querySelectorAll('.kl-sekme').forEach(function (s) {
            var bu = s.getAttribute('data-tur');
            /* Vurgu yalnız AÇIKKEN: kapalıyken iki başlık da eşit durur */
            s.classList.toggle('kl-sekme-acik', suzgec.acik && bu === suzgec.tur);
            s.setAttribute('aria-selected', suzgec.acik && bu === suzgec.tur);
            s.setAttribute('aria-expanded', suzgec.acik && bu === suzgec.tur);
            /* Süzgeç kapalıyken de "hangi süzgeç açık" görünsün: seçili
               harf/kısım başlığın yanında küçük bir rozette durur. */
            var r = s.querySelector('.kl-sekme-rozet');
            var etkin = !!suzgec.deger && bu === suzgec.tur;
            r.textContent = etkin ? (suzgec.tur === 'alfabe' ? suzgec.deger : aksamAdi(suzgec.deger)) : '';
            s.classList.toggle('kl-sekme-suzgecli', etkin);
        });
        var yuva = document.getElementById('klPullar');
        yuva.innerHTML = '';
        /* Kapalıyken içerik hiç çizilmez: bir önceki kalıbın klavyesi/şeması
           gizli de olsa DOM'da bayat sayılarla asılı kalmasın. */
        if (!suzgec.acik) return;
        yuva.setAttribute('dir', suzgec.tur === 'alfabe' ? 'rtl' : 'ltr');
        yuva.setAttribute('data-kip', suzgec.tur);
        var say = sayim(suzgec.tur);

        if (suzgec.tur === 'alfabe') {
            /* Harf süzgeci = küçültülmüş arama klavyesi. "Hepsi" tuşu
               klavyenin içinde (sil tuşunun yerinde) durduğu için ayrıca
               kutucuk koymuyoruz. */
            yuva.appendChild(klavyeCiz(say));
        } else {
            /* Yedi kısmın hepsi durur: "bu kalıpta lefîf yok" da bilgidir.
               Boş olanlar sönük ve tıklanmaz. */
            yuva.appendChild(aksamCiz(say));
        }
    }
    function sec(deger) {
        suzgec.deger = (suzgec.deger === deger) ? null : deger;   /* aynısına basmak kaldırır */
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        suzgecCiz(); govdeCiz();
    }
    function sekmeSec(tur) {
        /* Kapalıysa dokunulan başlıkla AÇILIR; açıkken başka başlığa
           dokunmak o süzgece geçirir (seçim sıfırlanır); AÇIK OLAN
           başlığa ikinci kez dokunmak katlar — başlığın kendisi de
           aç/kapa düğmesi, ok için elini uzatmaya gerek yok. */
        if (suzgec.acik && suzgec.tur === tur) { kucult(); return; }
        var degisti = false;
        if (!suzgec.acik) { suzgec.acik = true; degisti = true; }
        if (suzgec.tur !== tur) { suzgec.tur = tur; suzgec.deger = null; degisti = true; }
        if (!degisti) return;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        suzgecCiz(); govdeCiz();
    }
    /* Küçültme: seçili süzgeç KORUNUR (öğretmen listeye yer açmak için
       katlıyor, seçimini iptal etmek için değil) — hangi süzgecin açık
       olduğu başlığın yanındaki rozetten okunur. */
    function kucult() {
        if (!suzgec.acik) return;
        suzgec.acik = false;
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
        suzgecCiz();
    }
    /* Ok İKİ YÖNLÜ: açıkken yukarı bakar (katla), kapalıyken aşağı
       (aç). Kapalıyken en son kullanılan süzgeçle açılır — öğretmen
       hangi başlığa basacağını yeniden düşünmesin. */
    function katlaCevir() {
        if (suzgec.acik) kucult();
        else sekmeSec(suzgec.tur);
    }

    /* ---------- 4) PERDE ---------- */
    var perde = null;

    function kur() {
        if (perde) return perde;
        perde = document.createElement('div');
        perde.id = 'kalip-liste-perde';
        perde.className = 'kl-perde';
        perde.setAttribute('role', 'dialog');
        perde.setAttribute('aria-modal', 'true');
        perde.innerHTML =
            '<div class="kl-pencere" role="document">' +
              '<button type="button" class="kl-kapat" aria-label="Kapat">&times;</button>' +
              /* ÜST SIRA: solda süzgeç, sağda kalıbın kendi levhası.
                 Perde ltr olduğu için DOM sırası ekrandaki sırayla aynı. */
              '<div class="kl-ust" id="klUst">' +
                /* Süzgeç KAPALI açılır: perdenin ilk görüntüsü kelimelerin
                   kendisi olsun, iki başlık kenarda dursun. Başlığa
                   dokunmak açar, yanındaki ok küçültür. */
                '<div class="kl-suzgec" id="klSuzgec" data-acik="0">' +
                  '<div class="kl-sekmeler" role="tablist">' +
                    '<button type="button" class="kl-sekme" data-tur="alfabe" role="tab">' +
                      /* Başlık "Alfabe" değil "Kök Ara": açılan şey bir klavye,
                         öğrenci de harfe göre süzmüyor, kökü arıyor. */
                      '<span>Kök Ara</span><b class="kl-sekme-rozet"></b></button>' +
                    '<button type="button" class="kl-sekme" data-tur="aksam" role="tab">' +
                      '<span>Aksâm-ı Seb\'a</span><b class="kl-sekme-rozet"></b></button>' +
                    '<button type="button" class="kl-kucult" id="klKucult" title="Süzgeci küçült" ' +
                      'aria-label="Süzgeci küçült">' +
                      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
                      'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                      '<path d="M6 15l6-6 6 6"></path></svg></button>' +
                  '</div>' +
                  '<div class="kl-pullar" id="klPullar"></div>' +
                '</div>' +
                '<div class="kl-bas">' +
                  '<span class="kl-no" id="klNo"></span>' +
                  '<span class="kl-vezin" id="klVezin" dir="rtl"></span>' +
                  '<span class="kl-ad" id="klAd"></span>' +
                '</div>' +
              '</div>' +
              '<div class="kl-govde" id="klGovde"></div>' +
            '</div>';
        document.body.appendChild(perde);
        perde.querySelectorAll('.kl-sekme').forEach(function (s) {
            s.addEventListener('click', function () { sekmeSec(s.getAttribute('data-tur')); });
        });
        perde.querySelector('.kl-kucult').addEventListener('click', katlaCevir);
        perde.querySelector('.kl-kapat').addEventListener('click', kapat);
        /* Dışarı dokunmak kapatır; pencere içi dokunuş kapatmaz. */
        perde.addEventListener('click', function (e) { if (e.target === perde) kapat(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && perde.classList.contains('acik')) kapat();
        });
        return perde;
    }

    function kelimeKarti(g, ekSinif) {
        var d = document.createElement('div');
        d.className = 'kl-kart' + (ekSinif ? ' ' + ekSinif : '');
        d.setAttribute('data-kok', g.kok);
        var ornek = g.ornek.length
            ? '<div class="kl-ornek"><span dir="rtl">' + g.ornek[0].ar + '</span>' +
              '<i>' + (g.ornek[0].tr || '') + '</i></div>' : '';
        /* Sözlükte Türkçesi girilmemiş birkaç kayıt var (2805'te 20).
           Kelimeyi gizlemiyoruz — yerine sessiz bir çizgi koyuyoruz ki
           kart yarım görünmesin ve eksik göze çarpsın. */
        var trHtml = (g.tr && g.tr.trim())
            ? '<span class="kl-tr">' + g.tr + '</span>'
            : '<span class="kl-tr kl-tr-yok" title="Türkçesi girilmemiş">—</span>';
        d.innerHTML =
            '<span class="kl-emoji" aria-hidden="true">' + (g.emoji || '') + '</span>' +
            '<span class="kl-ar" dir="rtl">' + g.ar + '</span>' + trHtml +
            '<span class="kl-kok" dir="rtl" title="kök">' + g.kok + '</span>' + ornek;
        /* İSİM KALIPLARININ LİSTESİ ÇIKMAZ SOKAK OLMASIN.
           Matris görünümlerinde kökün altında iki kısayol var; tekil
           ızgarada (mastar, ism-i fâil, ism-i mef'ûl, ism-i mekân,
           ism-i âlet, zaman-mekân, cem-i teksir, ism-i tasğîr, ism-i
           tafdil…) kök sütunu yok, dolayısıyla kısayol da yoktu.
           Her kartın SAĞ ÜST köşesine — kök rozetinin karşısına, onunla
           aynı sessiz gride — bir tablo simgesi koyuyoruz: dokununca
           perde kapanır ve o kök tabloda açılır. Maraton simgesi burada
           yok; bunlar isim kalıpları, çekilecek fiil ekranı değil. */
        var tb = document.createElement('button');
        tb.type = 'button';
        tb.className = 'kl-kart-tablo';
        tb.title = g.kok + ' — kökü tabloda aç';
        tb.setAttribute('aria-label', tb.title);
        tb.innerHTML = SVG_TABLO;
        tb.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            kokSec(g.kok);
        });
        d.appendChild(tb);
        if (ornek) {
            /* Örnek gizli durur; karta dokunmak açar — liste kalabalıklaşmasın. */
            d.classList.add('kl-ornekli');
            d.addEventListener('click', function () {
                d.classList.toggle('kl-acik');
                if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            });
        }
        return d;
    }

    function tekilCiz(yuva, ler) {
        var g = document.createElement('div');
        g.className = 'kl-izgara';                      /* 4 sütun (CSS) */
        ler.forEach(function (x) { g.appendChild(kelimeKarti(x)); });
        yuva.appendChild(g);
        return ler.length;
    }

    /* Tıklanan numara hangi sütuna düşüyor? (67/68 gibi ikili sütunlar
       da kapsanır) — o sütun perdede vurgulanır ki bütün satır
       listelendiğinde hangi kalıba bastığın kaybolmasın. */
    function sutunSirasi(gor, no) {
        for (var i = 0; i < gor.sutun.length; i++) {
            var c = gor.sutun[i];
            if (Array.isArray(c) ? c.indexOf(no) >= 0 : c === no) return i;
        }
        return -1;
    }

    function matrisCiz(yuva, gor, secNo, sat) {
        var sec = sutunSirasi(gor, secNo);
        var t = document.createElement('table');
        t.className = 'kl-tablo kl-s' + gor.sutun.length;
        var bas = '<thead><tr><th class="kl-kok-bas">Kök</th>';
        gor.sutun.forEach(function (s, i) {
            var noLar = Array.isArray(s) ? s : [s];
            /* Tablodaki renk dili: mazi/muzari/emir YEŞİL (fiil), mastar
               ve türevleri MAVİ (isim) — .baslik-fiil / .baslik-isim
               sınıfları sayfanın kendi CSS'inden geliyor. */
            var tur = (i < 3) ? 'baslik-fiil' : 'baslik-isim';
            bas += '<th class="kl-th ' + tur + (i === sec ? ' kl-sec' : '') +
                   '"><span class="kl-th-ad">' + (gor.baslik[i] || '') + '</span>' +
                   '<span class="kl-th-vezin" dir="rtl">' +
                   noLar.map(function (n) { return kalipBilgi(n).ar || ('#' + n); }).join(' / ') +
                   '</span><span class="kl-th-no">' + noLar.join(' · ') + '</span></th>';
        });
        t.innerHTML = bas + '</tr></thead>';
        var g = document.createElement('tbody');
        sat.forEach(function (r) {
            var tr = document.createElement('tr');
            var td0 = document.createElement('td');
            td0.className = 'kl-kok-hucre';
            td0.setAttribute('dir', 'rtl');
            td0.appendChild(kokPlaka(r.kok));
            tr.appendChild(td0);
            r.hucre.forEach(function (h, i) {
                var td = document.createElement('td');
                if (i === sec) td.classList.add('kl-sec');
                if (!h.length) { td.classList.add('kl-yok'); td.textContent = '—'; }
                else h.forEach(function (x) { td.appendChild(kelimeKarti(x, 'kl-mini')); });
                tr.appendChild(td);
            });
            g.appendChild(tr);
        });
        t.appendChild(g);
        yuva.appendChild(t);
        return sat.length;
    }

    /* BAŞLIKTAKİ VEZİNDE ZÂİD HARFLER KIRMIZI.
       Kuralı burada yeniden yazmıyoruz: sayfanın kendi ColorEngine'i
       zaten kök harflerini siyah, ziyade (zâid) harfleri kırmızı
       boyuyor (#E53935) ve vezinde kök harfleri ف ع ل olduğu için
       kendiliğinden doğru sonucu veriyor — مَفْعُول'de م ve و kırmızı,
       ف ع ل siyah. Harfler ZWJ ile bağlandığından kelime kopmuyor.
       Sütun başlıklarına uygulanmadı: onlar yeşil/mavi pilin üstünde
       BEYAZ yazılıyor, siyah kök harfleri orada okunmaz. */
    function vezinBoya(el, ar) {
        if (!el) return;
        if (ar && typeof ColorEngine !== 'undefined' && ColorEngine.colorize) {
            el.innerHTML = ColorEngine.colorize(ar);
        } else {
            el.textContent = ar || '';
        }
    }

    /* Satırın/kartların rengi tablodan okunur (bkz. 3b). Gövde her
       süzgeç değişiminde yeniden çizildiği için ton yazımı da burada. */
    function tonYaz() {
        var no = (acikGor.kip === 'tekil')
            ? acikNo
            : (Array.isArray(acikGor.sutun[0]) ? acikGor.sutun[0][0] : acikGor.sutun[0]);
        var t = satirTonu(no);
        perde.style.setProperty('--kl-ton', t ? t.ton : 'transparent');
        perde.style.setProperty('--kl-vurgu', t ? t.vurgu : '#9ca3af');
        perde.setAttribute('data-tonlu', t ? '1' : '0');
    }
    function bosMetin() {
        if (!tumler.length)
            return acikGor.kip === 'tekil'
                ? 'Bu kalıptan sözlükte kayıtlı kelime yok.'
                : 'Bu bâbdan sözlükte kayıtlı kelime yok.';
        if (suzgec.tur === 'alfabe')
            return 'Bu kalıpta ' + suzgec.deger + ' harfiyle başlayan kök yok.';
        return 'Bu kalıpta ' + aksamAdi(suzgec.deger).toLocaleLowerCase('tr') + ' kök yok.';
    }
    function adYaz(n) {
        var bilgi = kalipBilgi(acikNo);
        var birim = (acikGor.kip === 'tekil') ? 'kelime' : 'kök';
        var ad = (acikGor.kip === 'tekil') ? (bilgi.tr || 'Kalıp') : acikGor.ad;
        /* Süzgeç açıkken "12 / 64" — bütünün neresindeyiz belli olsun */
        var sayi = suzgec.deger ? (n + ' / ' + tumler.length) : String(tumler.length);
        document.getElementById('klAd').textContent =
            ad + (tumler.length ? ' · ' + sayi + ' ' + birim : '');
    }
    function govdeCiz() {
        var yuva = document.getElementById('klGovde');
        yuva.innerHTML = '';
        tonYaz();
        var ler = suz(tumler);
        var n = 0;
        if (!ler.length) yuva.innerHTML = '<p class="kl-bos">' + bosMetin() + '</p>';
        else n = (acikGor.kip === 'tekil')
            ? tekilCiz(yuva, ler)
            : matrisCiz(yuva, acikGor, acikNo, ler);
        yuva.scrollTop = 0;
        adYaz(n);
        return n;
    }

    function ac(no) {
        no = parseInt(no, 10);
        if (!isFinite(no)) return false;
        var p = kur();
        acikNo = no;
        acikGor = gorunum(no);
        var bilgi = kalipBilgi(no);
        /* Her açılış alfabeyle başlar (Geylani'nin isteği) */
        suzgec = { tur: 'alfabe', deger: null, acik: false };
        tumler = (acikGor.kip === 'tekil') ? (indeks()[no] || []).slice() : satirlar(acikGor);
        tumler.sort(function (a, b) { return kokKarsilastir(a.kok, b.kok); });
        document.getElementById('klNo').textContent = no;
        vezinBoya(document.getElementById('klVezin'), bilgi.ar);
        p.setAttribute('data-kip', acikGor.kip);
        suzgecCiz();
        govdeCiz();
        p.setAttribute('aria-label', 'Kalıp ' + no + (bilgi.tr ? ' — ' + bilgi.tr : ''));
        p.classList.add('acik');
        document.body.classList.add('kl-kilit');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
        return true;
    }

    function kapat() {
        if (!perde) return;
        perde.classList.remove('acik');
        document.body.classList.remove('kl-kilit');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
    }

    /* ---------- 5) TABLOYA BAĞLANMA ----------
       Yakalama (capture) evresinde dinliyoruz ve KÖK SEÇİLİ DEĞİLKEN
       olayı devralıyoruz: böylece kutunun kendi 5 aşamalı döngüsü
       (handleBoxClick) ve .ref'in çekim penceresi hiç tetiklenmiyor.
       Kök seçiliyse hiç karışmıyoruz — eski davranış aynen sürüyor. */
    /* "فعل" GERÇEK BİR KÖK DEĞİL: veznin kendi harfleri. Sayfa ilk üç
       ziyarette onu tanıtım amacıyla kendiliğinden yüklüyor
       (kaliplartablosu.js, fialLoadCount). Öğrenci bir kök seçmiş
       sayılmaz — bu yüzden o da "kök seçilmedi" kabul ediliyor. */
    var NOTR_KOK = 'فعل';
    function kokSecili() {
        if (typeof currentRoot === 'undefined' || !currentRoot) return false;
        if (currentRoot.length !== 3) return false;
        return currentRoot !== NOTR_KOK;
    }
    function numaraOku(kutu) {
        var r = kutu.querySelector('.ref');
        var m = r ? String(r.innerText || r.textContent || '').trim()
                  : String(kutu.getAttribute('data-ref') || '').trim();
        var n = parseInt(m, 10);
        return isFinite(n) ? n : null;                  /* "x" kutusu → null */
    }
    document.addEventListener('click', function (e) {
        if (!e.target || !e.target.closest) return;
        if (e.target.closest('.kl-perde')) return;      /* perdenin kendi tıklamaları */
        var kutu = e.target.closest('.glass-box');
        if (!kutu || kokSecili()) return;
        /* KAPALI KUTUYA İLK DOKUNUŞ AÇAR, LİSTE İKİNCİDE GELİR.
           Mufâ'ale'nin iki mastarından biri (67/68) hep katlı durur;
           sayfanın kendi "merak tıklaması" (sarf/babodak.js) kapalı
           olana basınca ikisini takas ediyor. Bizim dinleyicimiz belge
           düzeyinde ve yakalama evresinde olduğu için ondan ÖNCE
           çalışıyor ve devralıyordu: kalıp hiç görünmeden liste
           açılıyordu. Kutu katlıysa karışmıyoruz — önce vezin açılsın,
           listeyi ikinci dokunuşta veririz. */
        if (kutu.classList.contains('bo-kapali')) return;
        var no = numaraOku(kutu);
        if (no === null) return;
        e.preventDefault();
        e.stopPropagation();
        ac(no);
    }, true);

    window.KalipListe = { ac: ac, kapat: kapat, gorunum: gorunum, indeks: indeks,
                          tazele: indeksiTazele, BAB: BAB, MEZID: MEZID };
})();
