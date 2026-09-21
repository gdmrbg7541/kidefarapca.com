/* ==========================================================================
   TEST KAPIŞMASI · 5-8. SINIF DERSLERİ (oyunlar/tk_ortaokul.js)
   --------------------------------------------------------------------------
   KELİMELER TEK KAYNAKTAN GELİR: muhadese/veri/<ders>.js dosyalarındaki
   `words` dizisi. Kelime Listeleri (sarf/ihkelime.js) ve Muhâdese de aynı
   dosyaları okur; burada kelime KOPYASI YOKTUR. Bir ders dosyasına kelime
   eklenince oyun da onu sorar. Dosya, ders seçildiği an arkadan yüklenir.

   ÖĞRETİM YILI: 6. sınıfın iki kitabı var (2026-2027 yeni kitap y2627/
   altında, 2025-2026 eski kitap kökte). Hangisinin oynanacağını
   sistem/sinifveri.js'teki seçim belirler (KidefSinifVeri.seciliVeriYili);
   seçim yoksa en yeni yıl. Seçim değişince 'tk:ortaokul' olayı yayılır,
   ders listesi yeniden kurulur.

   DERS AĞACI sarf/ihkelime.js'teki MUFREDAT / MUFREDAT_YIL'den üretildi
   (o da muhadese/muhadese.js educationData'dan). Yeni ünite/ders gelince
   AGAC'a satır eklenir: [dosya, Türkçe ad, Arapça ad].

   KİMLİK : ortaokul-<dosya>        ör. ortaokul-5_1_1, ortaokul-8_6_3
            ortaokul-<yıl>-<dosya>  ör. ortaokul-y2627-6_1_1 (öneki olan yıl)
   KİLİT  : bu dersler HEP AÇIK (öğretmen kararı, 21.09.2026).
   SORU   : tek kişilikte her oyun dersten rastgele 20 kelime
            (testkapismasi.js); şıklar dersin bütün kelimelerinden.
   ========================================================================== */
(function () {
    'use strict';
    if (window.TKOrtaokul) return;

    var SURUM = '1';     /* ders dosyası adresine eklenen ?v= (ihkelime.js ile aynı) */

    /* sınıf → [ {yil, onek, u:[ {no, ad, ar, d:[ [dosya, ad, ar], … ]} ]} ]  (en yeni yıl önce) */
    var AGAC = {
        "5": [
            { yil: "2025-2026", onek: "", u: [
                { no: 1, ad: "Merhaba", ar: "مَرْحَبًا", d: [
                    ["5_1_1", "Arap Harfleri ve Sesler", "اَلْحُرُوفُ الْعَرَبِيَّة وَالصَّوَائِت"],
                    ["5_1_2", "Kendini Tanıtma", "عِبَارَات التَّحِيَّة وَالتَّعَارُف وَالْوَدَاع"]
                ] },
                { no: 2, ad: "Sınıfım", ar: "صَفِّي", d: [
                    ["5_2_1", "Sınıf Eşyaları", "مُكَوِّنَاتُ الصَّفِّ"],
                    ["5_2_2", "Kırtasiye Malzemeleri", "أَدَوَات الدِّرَاسَة"]
                ] },
                { no: 3, ad: "Ailem", ar: "عَائِلَتِي", d: [
                    ["5_3_1", "Aile Bireyleri", "أَفْرَادُ العَائِلَة"],
                    ["5_3_2", "Meslekler", "الْمِهَن"],
                    ["5_3_3", "Sıfatlar", "اَلصِّفَات"]
                ] },
                { no: 4, ad: "Güzel Evim", ar: "بَيْتِي الجَمِيل", d: [
                    ["5_4_1", "Evin Bölümleri", "أَقْسَامُ البَيْت"],
                    ["5_4_2", "Evin Eşyaları", "أَدَوَات البَيْت"],
                    ["5_4_3", "Sıfatlar", "اَلصِّفَات"],
                    ["5_4_4", "Sayılar", "اَلْأَعْدَاد"]
                ] }
            ] }
        ],
        "6": [
            { yil: "2026-2027", onek: "y2627/", u: [
                { no: 1, ad: "Akrabalarım", ar: "أَقارِبي", d: [
                    ["6_1_1", "Akrabalar", "اَلْأَقارِب"],
                    ["6_1_2", "Meslekler", "اَلْمِهَن"]
                ] },
                { no: 2, ad: "Haydi Okula", ar: "هَيّا إلى الْمَدْرَسَة", d: [
                    ["6_2_1", "Okulun Bölümleri ve Araçları", "أَقْسامُ الْمَدْرَسَة وَأَدَواتُها"],
                    ["6_2_2", "Sıra Sayıları", "اَلْأَعْدادُ التَّرْتيبِيَّة"]
                ] },
                { no: 3, ad: "Vücudum", ar: "جِسْمي", d: [
                    ["6_3_1", "Organlar", "اَلْأَعْضاء"],
                    ["6_3_2", "Hisler ve Duygular", "اَلْإِحْساس وَالْمَشاعِر"]
                ] },
                { no: 4, ad: "Bu Hafta Hava Nasıl?", ar: "كَيْفَ الْجَوّ هَذا الْأُسْبوع؟", d: [
                    ["6_4_1", "Hava Durumu", "اَلْأَحْوالُ الْجَوِّيَّة"],
                    ["6_4_2", "Renkler", "اَلْأَلْوان"]
                ] }
            ] },
            { yil: "2025-2026", onek: "", u: [
                { no: 1, ad: "Günlük Hayat", ar: "الحَياةُ اليَوْمِيَّة", d: [
                    ["6_1_1", "Okulda", "في المَدْرَسَة"],
                    ["6_1_2", "Oyunlar", "الأَلْعاب"],
                    ["6_1_3", "Evde", "في البَيْت"]
                ] },
                { no: 2, ad: "Yiyecekler ve İçecekler", ar: "المَأْكولات وَالمَشْروبات", d: [
                    ["6_2_1", "Kahvaltıda", "في الفَطور"],
                    ["6_2_2", "Öğle Yemeğinde", "في الغَداء"],
                    ["6_2_3", "Akşam Yemeğinde", "في العَشاء"]
                ] },
                { no: 3, ad: "Sağlık", ar: "الصِّحَّة", d: [
                    ["6_3_1", "Vücut Organları", "أَعْضاءُ الجِسْم"],
                    ["6_3_2", "Hastanede", "في المُسْتَشْفى"],
                    ["6_3_3", "Temizlik", "النَّظافَة"]
                ] },
                { no: 4, ad: "Kıyafetler", ar: "المَلابِس", d: [
                    ["6_4_1", "Mevsimler", "الفُصول"],
                    ["6_4_2", "Kışlık Kıyafetler", "المَلابِسُ الشِّتَوِيَّة"],
                    ["6_4_3", "Yazlık Kıyafetler", "المَلابِسُ الصَّيْفِيَّة"]
                ] },
                { no: 5, ad: "Kutsal Mekânlar", ar: "الأَماكِنُ المُقَدَّسَة", d: [
                    ["6_5_1", "Mekke-i Mükerreme'de", "في مَكَّةَ المُكَرَّمَة"],
                    ["6_5_2", "Medine-i Münevvere'de", "في المَدينَةِ المُنَوَّرَة"],
                    ["6_5_3", "Kudüs-i Şerif'te", "في القُدْسِ الشَّريف"]
                ] },
                { no: 6, ad: "Ulaşım ve Trafik", ar: "المُواصَلات وَالمُرور", d: [
                    ["6_6_1", "Ulaşım Araçları", "وَسائِلُ المُواصَلات"],
                    ["6_6_2", "Trafik", "المُرور"],
                    ["6_6_3", "Tatil Yolumda", "في طَريقي إِلى العُطْلَة"]
                ] }
            ] }
        ],
        "7": [
            { yil: "2026-2027", onek: "", u: [
                { no: 1, ad: "Bugün Ne Yaptım?", ar: "ماذا فَعَلْتُ اليَوْمَ؟", d: [
                    ["7_1", "Günlük Etkinlikler ve Saatler", "الأَنْشِطَةُ اليَوْمِيَّة وَالسّاعات"]
                ] },
                { no: 2, ad: "Alışveriş Zamanı", ar: "وَقْتُ التَّسَوُّق", d: [
                    ["7_2", "Alışveriş, Miktar ve Sayılar", "التَّسَوُّق وَالكَمِّيّات وَالأَعْداد"]
                ] },
                { no: 3, ad: "Nereye Seyahat Edelim?", ar: "إِلى أَيْنَ نُسافِرُ؟", d: [
                    ["7_3", "Ulaşım ve Seyahat", "المُواصَلات وَالسَّفَر"]
                ] },
                { no: 4, ad: "Şehrim ve Ülkem", ar: "مَدينَتي وَبَلَدي", d: [
                    ["7_4", "Şehrim ve Ülkem", "المَدينَة وَالبَلَد"]
                ] }
            ] }
        ],
        "8": [
            { yil: "2026-2027", onek: "", u: [
                { no: 1, ad: "Etkinlikler", ar: "الأَنْشِطَة", d: [
                    ["8_1_1", "Kulüpler", "الأَنْدِيَة"],
                    ["8_1_2", "Tiyatro", "المَسْرَحِيَّة"],
                    ["8_1_3", "Gezi", "التَّجَوُّل"]
                ] },
                { no: 2, ad: "Kültür ve Sanat", ar: "الثَّقافَة وَالفَنّ", d: [
                    ["8_2_1", "Edebiyat", "الأَدَب"],
                    ["8_2_2", "Kitap Fuarında", "في مَعْرِضِ الكِتاب"],
                    ["8_2_3", "El Sanatları", "الفُنونُ اليَدَوِيَّة"]
                ] },
                { no: 3, ad: "Değerlerim", ar: "قِيَمي", d: [
                    ["8_3_1", "Arkadaşlık", "الصَّداقَة"],
                    ["8_3_2", "Yardımlaşma", "التَّعاوُن"],
                    ["8_3_3", "Bayramlar", "الأَعْياد"]
                ] },
                { no: 4, ad: "Doğa", ar: "الطَّبيعَة", d: [
                    ["8_4_1", "Çevrenin Önemi", "أَهَمِّيَّةُ البِيئَة"],
                    ["8_4_2", "Hayvan Sevgisi", "حُبُّ الحَيَوانات"],
                    ["8_4_3", "Doğal Afetler", "الكَوارِثُ الطَّبيعِيَّة"]
                ] },
                { no: 5, ad: "Spor", ar: "الرِّياضَة", d: [
                    ["8_5_1", "Sporun Tarihi", "تاريخُ الرِّياضَة"],
                    ["8_5_2", "Sporun Önemi", "أَهَمِّيَّةُ الرِّياضَة"],
                    ["8_5_3", "Spor Türleri", "أَنْواعُ الرِّياضَة"]
                ] },
                { no: 6, ad: "Okula Veda", ar: "وَداعُ المَدْرَسَة", d: [
                    ["8_6_1", "Mezuniyet", "التَّخَرُّج"],
                    ["8_6_2", "Arkadaşlara Veda", "وَداعُ الأَصْدِقاء"],
                    ["8_6_3", "Yaz Tatili", "العُطْلَةُ الصَّيْفِيَّة"]
                ] }
            ] }
        ]
    };

    var SINIFLAR = ['5', '6', '7', '8'];

    /* Sınıfın o an seçili yılının ağacı + dosya öneki. Önek, sitenin yıl
       kaydından (KidefSinifVeri) okunur; o yoksa ağaçtaki yedek önek. */
    function yilKaydi(sinif) {
        var liste = AGAC[sinif] || [];
        if (!liste.length) return null;
        var kv = window.KidefSinifVeri, s = null;
        try { s = (kv && kv.seciliVeriYili) ? kv.seciliVeriYili(sinif) : null; } catch (e) { s = null; }
        var k = liste[0];
        if (s) for (var i = 0; i < liste.length; i++) if (liste[i].yil === s.yil) k = liste[i];
        var onek = (s && s.yil === k.yil && typeof s.onek === 'string') ? s.onek : k.onek;
        return { yil: k.yil, onek: onek || '', u: k.u, cokYil: liste.length > 1 };
    }

    var _dersler = [], _harita = {}, _sinifYil = {};
    function kur() {
        _dersler = []; _harita = {}; _sinifYil = {};
        SINIFLAR.forEach(function (s) {
            var y = yilKaydi(s);
            if (!y) return;
            _sinifYil[s] = { yil: y.yil, cokYil: y.cokYil };
            var on = y.onek ? y.onek.replace(/\/+$/, '') + '-' : '';
            y.u.forEach(function (u) {
                u.d.forEach(function (d) {
                    var o = {
                        id: 'ortaokul-' + on + d[0], dosya: d[0], yol: 'muhadese/veri/' + y.onek + d[0] + '.js',
                        sinif: +s, yil: y.yil, ad: d[1], ar: d[2] || '',
                        unite: u.no, uniteAd: u.ad, uniteAr: u.ar || ''
                    };
                    _dersler.push(o);
                    _harita[o.id] = o;
                });
            });
        });
    }
    kur();

    /* ---------------------------------------------------------- KELİMELER
       Ders dosyası window.data'ya yazar. Aynı anda iki dosya açılmasın ve
       sayfada başka bir window.data varsa ezilmesin diye yüklemeler sırayla
       yapılır, eski değer geri konur. */
    var _kelime = {}, _bekleyen = {}, _sira = Promise.resolve();

    function temiz(t) { return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); }
    /* Aynı Türkçe karşılık iki kez olursa şıklarda iki aynı yanıt çıkar:
       ilk geçen kalır. Arapçası ya da Türkçesi boş satırlar alınmaz. */
    function donustur(words) {
        var gTr = {}, gAr = {}, out = [];
        (Array.isArray(words) ? words : []).forEach(function (w) {
            var ar = temiz(w && w.ar), tr = temiz(w && w.tr);
            if (!ar || !tr) return;
            var kTr = tr.toLocaleLowerCase('tr');
            if (gTr[kTr] || gAr[ar]) return;
            gTr[kTr] = 1; gAr[ar] = 1;
            out.push({ id: out.length + 1, arabic: ar, turkish: tr });
        });
        return out;
    }

    function yukle(id) {
        var d = _harita[id];
        if (!d) return Promise.resolve([]);
        if (_kelime[id]) return Promise.resolve(_kelime[id]);
        if (_bekleyen[id]) return _bekleyen[id];
        var p = new Promise(function (bitti) {
            _sira = _sira.then(function () {
                return new Promise(function (tamam) {
                    var eski = window.data, s = document.createElement('script'), bitti1 = false;
                    function son(liste) {
                        if (bitti1) return; bitti1 = true;
                        window.data = eski;
                        if (s.parentNode) s.parentNode.removeChild(s);
                        delete _bekleyen[id];
                        if (liste) _kelime[id] = liste;       /* hata olursa saklanmaz: sonra yeniden denenir */
                        bitti(liste || []); tamam();
                    }
                    window.data = undefined;
                    s.src = d.yol + '?v=' + SURUM;
                    s.onload = function () { var v = window.data; son(donustur(v && v.words)); };
                    s.onerror = function () { son(null); };
                    (document.head || document.documentElement).appendChild(s);
                });
            });
        });
        _bekleyen[id] = p;
        return p;
    }

    /* ---------------------------------------------------------- YIL SEÇİMİ
       Sitenin yıl seçicisi değişince (liste başlığındaki ya da başka bir
       sayfadaki) ağaç yeniden kurulur; testkapismasi.js listeyi tazeler. */
    function yenile() {
        kur();
        try { document.dispatchEvent(new CustomEvent('tk:ortaokul')); } catch (e) {}
    }
    document.addEventListener('kidef:veriyili', function (e) {
        var n = e && e.detail ? String(e.detail.sinif) : '';
        if (AGAC[n] && AGAC[n].length > 1) yenile();
    });

    /* Sınıf başlığındaki yıl rozeti/seçicisi: sitenin kendi bileşeni.
       Tek yılı olan sınıfta rozet de gösterilmez (liste kalabalıklaşmasın). */
    function yilRozet(sinif) {
        var kv = window.KidefSinifVeri, y = _sinifYil[String(sinif)];
        if (!kv || !kv.yilRozetHtml || !y || !y.cokYil) return '';
        try { if (kv.yilStilKur) kv.yilStilKur(); return kv.yilRozetHtml(sinif); } catch (e) { return ''; }
    }

    window.TKOrtaokul = {
        dersler: function () { return _dersler.slice(); },
        bul: function (id) { return _harita[id] || null; },
        mi: function (id) { return /^ortaokul-/.test(String(id || '')); },
        kelimeler: function (id) { return _kelime[id] || []; },
        yukle: yukle,
        yilRozet: yilRozet,
        yenile: yenile
    };
})();
