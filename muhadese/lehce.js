/* ============================================================
   LEHÇE KATMANI — fusha + altı lehçe
   ------------------------------------------------------------
   Amaç: muhâdese yalnız fushayla kalmasın; öğrenci Mısır'da,
   Şam'da, Hicaz'da aynı şeyin nasıl söylendiğini de görsün.

   NEREDE ÇALIŞIR
     · muhadese.html            (liste modu)  -> sekmelerin üstünde şerit
     · muhadese.html?ders=...   (oynatıcı)    -> başlıkta küçük düğme
     Okul dersleri BU KATMANIN DIŞINDA: müfredat fushadır, oraya
     lehçe koymak öğrenciyi yanıltır (Geylani: "okul hariç").

   VERİ BİÇİMİ
     Kelime kartlarına isteğe bağlı bir `lh` alanı eklenir:
       { tr:'Nasılsın?', ar:'كَيْفَ حالُكَ؟',
         lh:{ mis:'إِزَّيَّك؟', sam:'كِيفَك؟', hic:'كَيْف حالَك؟' } }
     Yazılmayan lehçe FUSHAYA DÜŞER ve arayüzde "fusha ile aynı"
     diye işaretlenir — uydurma bir karşılık gösterilmez.

   TEK DOĞRULUK KAYNAĞI
     Seçim localStorage'da `kidef_lehce` anahtarında durur; iki mod
     da aynı anahtarı okur, ders açıp kapatınca seçim korunur.
   ============================================================ */
(function () {
    'use strict';

    var LISTE = [
        { id: 'fus', ad: 'Fusha',  alt: 'Fasih Arapça',            ar: 'الفُصْحى',   bayrak: '📖' },
        { id: 'mis', ad: 'Mısır',  alt: 'Mısır lehçesi',           ar: 'المَصْرِيّ',  bayrak: '🇪🇬' },
        { id: 'sam', ad: 'Şam',    alt: 'Suriye · Lübnan · Ürdün · Filistin', ar: 'الشّامِيّ', bayrak: '🇸🇾' },
        { id: 'hic', ad: 'Hicaz',  alt: 'Suudi Arabistan',         ar: 'الحِجازِيّ',  bayrak: '🇸🇦' },
        { id: 'kor', ad: 'Körfez', alt: 'BAE · Kuveyt · Katar · Bahreyn', ar: 'الخَليجِيّ', bayrak: '🇦🇪' },
        { id: 'irk', ad: 'Irak',   alt: 'Irak lehçesi',            ar: 'العِراقِيّ',  bayrak: '🇮🇶' },
        { id: 'mag', ad: 'Mağrib', alt: 'Fas · Cezayir · Tunus',   ar: 'المَغْرِبِيّ', bayrak: '🇲🇦' }
    ];

    var ANAHTAR = 'kidef_lehce';
    var secili = 'fus';
    try {
        var v = localStorage.getItem(ANAHTAR);
        if (v && LISTE.some(function (l) { return l.id === v; })) secili = v;
    } catch (e) { }

    var dinleyiciler = [];

    function bul(id) {
        for (var i = 0; i < LISTE.length; i++) if (LISTE[i].id === id) return LISTE[i];
        return LISTE[0];
    }

    /* Bir kelime kartının SEÇİLİ LEHÇEDEKİ hâli.
       Dönen nesne:
         ar     : ekranda gösterilecek Arapça
         fusha  : fusha aslı (lehçe seçiliyken küçük satırda gösterilir)
         ayni   : lehçe karşılığı yazılmamış / fusha ile aynı mı
       Böylece arayüz "bu ifade lehçede de aynı" diyebiliyor. */
    function karsilik(w) {
        var fusha = (w && w.ar) || '';
        if (secili === 'fus') return { ar: fusha, fusha: fusha, ayni: true };
        var lh = w && w.lh;
        var d = lh && lh[secili];
        if (!d) return { ar: fusha, fusha: fusha, ayni: true };
        return { ar: d, fusha: fusha, ayni: (d === fusha) };
    }

    function sec(id) {
        if (!LISTE.some(function (l) { return l.id === id; })) return;
        if (id === secili) return;
        secili = id;
        try { localStorage.setItem(ANAHTAR, id); } catch (e) { }
        dinleyiciler.forEach(function (f) { try { f(id); } catch (e) { } });
    }

    /* Bir başlıkta hiç lehçe karşılığı var mı? (Rozet göstermek için) */
    function zenginMi(konu) {
        return !!(konu && (konu.words || []).some(function (w) { return w && w.lh; }));
    }

    window.KIDEF_LEHCE = {
        liste: LISTE,
        anahtar: ANAHTAR,
        secili: function () { return secili; },
        bilgi: function () { return bul(secili); },
        bul: bul,
        sec: sec,
        karsilik: karsilik,
        zenginMi: zenginMi,
        fushaMi: function () { return secili === 'fus'; },
        dinle: function (f) { if (typeof f === 'function') dinleyiciler.push(f); }
    };

    /* ============================================================
       CÜMLE ve DİYALOG KATMANI
       ------------------------------------------------------------
       Geylani: "sadece kelime listelerinde olmasın; kelime listesinde
       ne varsa diyaloglarda da kullanabilelim."

       Bu yüzden lehçe karşılığı İKİ KAYNAKTAN geliyor:
         1) parçanın kendi `lh` alanı (elle yazılmışsa en doğrusu),
         2) DERSİN KELİME LİSTESİ — words[] içinde aynı ifade varsa
            onun lehçe karşılığı cümleye/diyaloga da uygulanıyor.
       Eşleme harekesiz ve noktalamasız yapılıyor: "كَيْفَ حالُكَ؟" ile
       "كَيْفَ حالُكَ" aynı sayılıyor, sondaki soru işareti korunuyor.

       Parçalar YERİNDE değiştiriliyor (yeni nesne üretilmiyor):
       simultane.js `data` değişkenini bir kez okuyup tutuyor, referans
       kopsa lehçe değişimi ekrana hiç yansımazdı. Fusha aslı `arFus`
       alanında saklanıyor — sarf köprüsü ve geri dönüş onu kullanıyor.
       ============================================================ */
    var HAREKE = /[\u064B-\u065F\u0670\u0640]/g;
    var NOKTA  = /[\s.,،؛؟!:"'()\[\]«»\u061F\u060C]/g;
    var sozluk = {};

    function sade(t) {
        return String(t || '').replace(HAREKE, '').replace(NOKTA, '');
    }

    function sozlukKur(words) {
        sozluk = {};
        (words || []).forEach(function (w) {
            if (!w || !w.ar || !w.lh) return;
            var k = sade(w.ar);
            if (k && !sozluk[k]) sozluk[k] = w.lh;
        });
    }

    var UC = /^([\s\u060C\u061B\u061F.,!:"'\u00AB\u00BB()\[\]]*)([\s\S]*?)([\s\u060C\u061B\u061F.,!:"'\u00AB\u00BB()\[\]]*)$/;

    /* Bir cümle/diyalog parçasının seçili lehçedeki hâli.
       NOKTALAMA PARÇANIN KENDİSİNDEN gelir: kelime listesindeki karşılık
       "إِزَّيَّك؟" gibi soru işaretiyle yazılmış olabilir; parçada da ؟
       varsa iki soru işareti çıkıyordu. İki tarafın da gövdesi ayrılıp
       yalnız PARÇANIN noktalaması geri ekleniyor. */
    function parca(arFusha, lh) {
        if (secili === 'fus') return arFusha;
        var ham = String(arFusha || '');
        var m = UC.exec(ham);
        var on = m ? m[1] : '', govde = m ? m[2] : ham, son = m ? m[3] : '';
        var karsi = (lh && lh[secili]) || null;
        if (!karsi) {
            var tbl = sozluk[sade(govde)];
            karsi = tbl && tbl[secili];
        }
        if (!karsi) return ham;
        var k = UC.exec(String(karsi));
        var cekirdek = k ? k[2] : String(karsi);
        return on + cekirdek + son;
    }

    /* window.data içindeki cümle ve diyalog parçalarını seçili lehçeye
       çevirir. words[] DOKUNULMAZ: kelime kartları karsilik() ile kendi
       çiziliyor, orada fusha aslı da ayrıca gösteriliyor. */
    function veriUygula() {
        var d = window.data;
        if (!d) return;
        sozlukKur(d.words);
        var kutular = [];
        (d.sentence || []).forEach(function (c) { if (c && c.words) kutular.push(c.words); });
        (d.dialog || []).forEach(function (c) {
            if (!c) return;
            if (c.p1) kutular.push(c.p1);
            if (c.p2) kutular.push(c.p2);
        });
        kutular.forEach(function (dizi) {
            dizi.forEach(function (w) {
                if (!w) return;
                if (typeof w.arFus !== 'string') w.arFus = w.ar || '';
                w.ar = parca(w.arFus, w.lh);
            });
        });
    }

    window.KIDEF_LEHCE.parca = parca;
    window.KIDEF_LEHCE.veriUygula = veriUygula;
    window.KIDEF_LEHCE.sozlukKur = sozlukKur;

    /* Oynatıcıda veri hazırsa hemen uygula; sonra her lehçe değişiminde
       yeniden. Ekranı tazelemek simultane.js'in işi (kidefTazele). */
    veriUygula();
    dinleyiciler.push(function () {
        veriUygula();
        if (typeof window.kidefTazele === 'function') window.kidefTazele();
    });

    /* ============================================================
       SEÇİM KAPISI (liste modu)
       ------------------------------------------------------------
       Geylani: "kalıp ifadeler ve alan konularında önce fusha veya
       lehçe seçilebilsin, seçildikten sonra sadece o lehçeden açılsın."

       Bu yüzden bu iki sekmeye girince önce bir SEÇİM EKRANI çıkıyor;
       başlıklar ancak seçim yapılınca beliriyor ve o andan itibaren
       dersler seçilen lehçeyle açılıyor. Seçim tarayıcı sekmesi
       boyunca hatırlanıyor (sessionStorage) — her sekme değişiminde
       yeniden sormuyor; hangi lehçe seçildiği ise kalıcı bellekte
       (localStorage) duruyor, ertesi gün de aynı seçenek işaretli
       geliyor. Üstteki özet şeridin "Değiştir" tuşu kapıyı geri açar.
       ============================================================ */
    var SECIM_ANAHTAR = 'kidef_lehce_secildi';

    function secildiMi() {
        try { return sessionStorage.getItem(SECIM_ANAHTAR) === '1'; } catch (e) { return false; }
    }
    function secimiIsaretle(v) {
        try {
            if (v) sessionStorage.setItem(SECIM_ANAHTAR, '1');
            else sessionStorage.removeItem(SECIM_ANAHTAR);
        } catch (e) { }
    }
    window.KIDEF_LEHCE.secildiMi = secildiMi;
    window.KIDEF_LEHCE.secimiIsaretle = secimiIsaretle;

    /* Büyük seçim ekranı. `sonra` seçim yapılınca çağrılır. */
    window.KIDEF_LEHCE.secimEkrani = function (kap, sonra) {
        if (!kap) return;
        kap.className = 'lehce-kapi';
        kap.innerHTML =
            '<div class="lk-bas">' +
              '<h2>Hangi Arapça?</h2>' +
              '<p>Önce fushayı ya da bir lehçeyi seç; başlıklar o seçimle açılır. ' +
                 'Sonradan üstteki şeritten değiştirebilirsin.</p>' +
            '</div>' +
            '<div class="lk-izgara">' +
            LISTE.map(function (l) {
                return '<button type="button" class="lk-kart' + (l.id === secili ? ' onceki' : '') +
                       '" data-lh="' + l.id + '">' +
                       '<span class="lk-bayrak" aria-hidden="true">' + l.bayrak + '</span>' +
                       '<span class="lk-ad">' + l.ad + '</span>' +
                       '<span class="lk-ar" dir="rtl">' + l.ar + '</span>' +
                       '<span class="lk-alt">' + l.alt + '</span>' +
                       (l.id === secili ? '<span class="lk-rozet">son seçtiğin</span>' : '') +
                       '</button>';
            }).join('') +
            '</div>' +
            '<p class="lk-not">Lehçe karşılığı yazılmamış ifadeler fusha hâliyle görünür; ' +
               'lehçe seçiliyken kalıplar tablosu bağlantısı ve kelime türü şeridi kapanır.</p>';

        Array.prototype.forEach.call(kap.querySelectorAll('.lk-kart'), function (b) {
            b.onclick = function () {
                var id = b.getAttribute('data-lh');
                if (id === secili) {
                    /* Aynı seçenek: sec() erken çıkardı, dinleyiciler hiç
                       çalışmazdı. Kapıyı yine de geçmemiz gerekiyor. */
                    secimiIsaretle(true);
                } else {
                    secimiIsaretle(true);
                    sec(id);
                }
                if (typeof sonra === 'function') sonra(secili);
            };
        });
    };

    /* ---------- ŞERİT (liste modu) ----------
       Seçim yapıldıktan sonra üstte duran ince özet: hangi lehçedeyiz
       ve "Değiştir". Okul sekmesinde kap gizlendiği için hiç çağrılmıyor. */
    window.KIDEF_LEHCE.ozetSerit = function (kap, degistir) {
        if (!kap) return;
        var l = bul(secili);
        kap.className = 'lehce-serit';
        kap.innerHTML =
            '<span class="lh-etiket">LEHÇE</span>' +
            '<span class="lh-secili' + (secili === 'fus' ? ' fusha' : '') + '">' +
              '<span class="lh-bayrak" aria-hidden="true">' + l.bayrak + '</span>' +
              '<b>' + l.ad + '</b><i>' + l.alt + '</i>' +
            '</span>' +
            '<button type="button" class="lh-degistir">Değiştir</button>' +
            '<span class="lh-not">Başlıklar bu seçimle açılır. Karşılığı yazılmamış ifadeler fusha kalır.</span>';
        var d = kap.querySelector('.lh-degistir');
        if (d) d.onclick = function () { secimiIsaretle(false); if (typeof degistir === 'function') degistir(); };
    };

    window.KIDEF_LEHCE.seritCiz = function (kap) {
        if (!kap) return;
        kap.innerHTML =
            '<span class="lh-etiket">LEHÇE</span>' +
            '<div class="lh-tuslar" role="group" aria-label="Lehçe seçimi">' +
            LISTE.map(function (l) {
                return '<button type="button" class="lh-tus' + (l.id === secili ? ' aktif' : '') +
                       '" data-lh="' + l.id + '" title="' + l.alt + '" aria-pressed="' +
                       (l.id === secili ? 'true' : 'false') + '">' +
                       '<span class="lh-bayrak" aria-hidden="true">' + l.bayrak + '</span>' +
                       '<span class="lh-ad">' + l.ad + '</span></button>';
            }).join('') +
            '</div>' +
            '<span class="lh-not">Karşılığı yazılmamış ifadeler fusha hâliyle görünür.</span>';

        Array.prototype.forEach.call(kap.querySelectorAll('.lh-tus'), function (b) {
            b.onclick = function () {
                sec(b.getAttribute('data-lh'));
                Array.prototype.forEach.call(kap.querySelectorAll('.lh-tus'), function (x) {
                    var a = x.getAttribute('data-lh') === secili;
                    x.classList.toggle('aktif', a);
                    x.setAttribute('aria-pressed', a ? 'true' : 'false');
                });
            };
        });
    };
})();
