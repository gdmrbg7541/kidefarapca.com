/* =====================================================================
   KİDEF · DEFTER (eski adı: Yazı Sayfası)      (sistem/yazisayfasi.js)
   ---------------------------------------------------------------------
   Öğretmen (19.10.2026): "popup şeklinde bi tane yazı sayfası yapalım,
   diyelimki dijital olarak bi şeyler çizmek istedim, 5 renk olsun, 1 kalem
   bi silgi, gri çizgiler, arapça küçük ve büyük harfler için çizgiler
   olsun, sınıf materyalleri açıkken bu popup açılsın, tarayıcı hafızasında
   ne yazılmışsa önceki derslerde görülebilsin, yazı sayfası kapanınca
   yazıldığı tarih kaydedilsin, eğer sayfa beğenilirse seviye notlarına
   kaydedilebilsin". Seçilen ek: defter gibi çok sayfa. Seviye notları
   hesapta (her cihazda).

   NEREDE — KART YOK (19.10.2026, öğretmen: "kart olmasın, popup olsun ve
   %de 98 ekranı kaplasın, bu popup sınıf açılınca her zaman görünecek,
   sınıf sekmesine bağlı olacak, sadece bi sınıf açılınca açılacak
   kapanırsa kapanacak"):
   · Sınıflarım'da bir sınıf açılınca pencere sağ altta «Defter»
     düğmesi olarak hazır bekler; basınca ekranın %98'ini kaplar. O sınıfa
     bağlıdır (seviye + şube). (20.10.2026, öğretmen: "bi liste açılınca
     hemen yazı tahtası açılmasın")
   · Sınıf açık kaldıkça durur: «Küçült» pencereyi KÜÇÜLTÜR, sağ altta
     «Defter» düğmesi kalır, basınca geri açılır.
   · Sınıf kapanınca (başka sınıfa geçilince, Sınıflarım'dan çıkılınca)
     defter tarihiyle kaydedilir, pencere kapanır.
   · Aynı sınıf 45 dakika içinde yeniden açılırsa kaldığı defterden
     sürer (aynı ders); daha sonra açılırsa boş sayfa + «Son yazdığın».
   · Yalnız öğretmen/yönetici; öğrencinin kendi panelinde açılmaz.

   DÜZEN (19.10.2026, öğretmen: "tam ekran simge haline küçültmek (çarpı
   olmasın) ilerigeri tuşu, çöp yanyana ve solda olsun, kalemler hem sağda
   hem solda yukardan aşağıya doğru dizilsin, iki tarafta da silgi olsun,
   dosyayı pdf ye çevirme ve indirme seçeneği olsun, silmeye ikinci kez
   basınca tüm sayfayı sil seçeneği olsun, sayfalar ve ileri geri tuşu
   altta ortada olsun ve biraz daha şeffaf ve büyük olsun"):
   · üst çubuk: solda başlık + geri al · yinele · çöp; ortada çizgi düzeni
     ve kalınlık; sağda seviye notu · geçmiş · PDF · tam ekran · küçült.
   · iki yanda (tahtanın iki ucunda duran öğretmen için) yukarıdan aşağı
     5 renkli kalem + silgi; iki taraf birlikte seçilir.
   · çöpe bir kez, ya da seçili silgiye İKİNCİ kez basınca yanında
     «Tüm sayfayı sil» çıkar; ona basınca sayfa temizlenir (geri alınır).
   · altta ortada yarı saydam, büyük sayfa çubuğu: ‹ 1 / 3 › + yeni sayfa
     + sayfayı kaldır.
   · PDF: defterin bütün sayfaları (çizgileriyle) A4 yatay PDF olarak iner.
   · «Tüm sayfalar» (sayfa çubuğundaki ızgara düğmesi): defterin bütün
     sayfaları küçük resim olarak; basınca o sayfaya gidilir.
   · TEK KÂĞIT (öğretmen: "sayfalar sola doğru uzasın tek kağıtmış gibi",
     "artıya basınca yeni sayfa sola eklensin", "sürükleyerek te sayfalar
     arasında gezebilelim, sadece 6 yatay çizgili defter olsun"):
     sayfalar sağdan sola yan yana dizilmiş tek bir uzun kâğıttır; çizgiler
     kesintisiz sürer, kırmızı kenar çizgisi yalnız kâğıdın başında (sağda).
     Pencere bu kâğıdın üstünde kayar: ‹ sola (sonraki sayfa; son sayfada
     yazı varsa kâğıt uzar), › sağa; farenin orta tuşuyla, iki parmakla
     ya da kalem kullanılırken tek parmakla sürüklenir; tekerlek/dokunmatik
     yüzey ve alttaki kaydırma çubuğu da kaydırır. Yanlardaki «Kaydır» (↔)
     düğmesi 20.10.2026'da kalktı (öğretmen: "zaten deftere scroll çubuğu
     ekledik o yüzden kalemlerin altındaki sağ sol oku olmasın"); H kısayolu
     da kalktı. Artı, yeni sayfayı
     açık sayfanın hemen SOLUNA ekler. Sayfa genişliği 1000 birim (Y2
     biçiminde saklanır); eski (Y1) defterlerde çizgilerden hesaplanır.
   · Yalnız yatay çizgili defter (öteki düzenler kaldırıldı); çizgi
     sayısı 20.10.2026'dan beri seçiliyor (aşağıda DEFTER).
   · Küçült düğmesi yazılı ve mavi, hep sağ üst köşede ("simge haline
     küçültme tuşunu göremedim").
   DEFTER (20.10.2026, öğretmen: "yazı sayfasını defter olarak değiştir ve
   yatay çizgiler sayı olarak değiştirilebilsin, 2 ile 8 çizgi
   seçilebilsin, ileri sayfaya sol okla geçsin ve sayfalar arası geçiş
   için aşağıda kalın bi scroll çubuğu olsun ... scroll çubuğu aşağıda
   olsun", "defterde en üstte biraz boşluk olsun", "sınıflarımdan birini
   açınca aşağıdaki defter popup kısmında sayfa çevirme ve yazma
   animasyonu olsun"):
   · Adı «Defter»: başlık, sağ alttaki düğme, PDF (defter_<şube>_<gün>.pdf).
     Dosya adı, kayıtlar ve dışarı açılan ad (KidefYaziSayfasi) aynı.
   · Üst çubukta «Çizgi 2 3 4 5 6 7 8»: yatay çizgi sayısı. Defterle
     birlikte saklanır (Y3 biçimi); son seçilen, yeni defterlerde de gelir.
   · ÜSTTE BOŞLUK: ilk çizginin üstünde öteki aralıklardan UST_BOSLUK
     birim büyük bir pay (20.10.2026, öğretmen: "defterin üstünde çok
     fazla boşluk olmasın biraz azalt": 56 → 28 birim; 6 çizgide ilk çizgi
     137 → 113, paysız 89). Pay deftere yazılır (Y3): her defter
     yazıldığı çizgilerle açılır — 56 ile yazılanlar 56, eski (Y1/Y2)
     defterler paysız 6 çizgi. Çizgi sayısına basılınca (aynı sayı da
     olsa) defter bugünkü düzene geçer.
   · ‹ HEP İLERİ: son sayfadaysa yeni sayfa açar (boş olsa da). Sondaki
     boş sayfalar kaydedilmez, PDF'e girmez.
   · EN ALTTA KALIN KAYDIRMA ÇUBUĞU: kâğıdın küçük haritası (1. sayfa
     sağda, sayfa numaraları üstünde); tutamaç ekrandaki pencere ve
     açık sayfanın numarasını taşır. Sürüklenir; çubuğun başka bir yerine
     basınca o sayfaya gidilir; tekerlek de kaydırır.
   · Sağ alttaki düğmede defter canlanır: kalem sağdan sola yazar, sayfa
     çevrilir (hareket azaltma tercihinde durur).
   DEFTER v12 (20.10.2026, öğretmen: "defterde çizgi sayısı şöyle olsun,
   2,3,4,5,7, ayrıca bi tane de arapça yazmayı öğretmek için Arapça güzel
   yazı defteri olsun o da sadece 3 satır olsun, defterde dikey kaydırma
   olsun, ve bu varsayılan olsun isteyenler yatay kaydırmalı şekilde
   kullanabilsin, ileri geri okları daha büyük ve yukarda ortada olsun,
   yukarda hat kalemi seçeneği de olsun, defter popup ı tam ekran açılsın
   ve küçültünce de simge haline dönsün, simge dolgusu kırmızı svg beyaz
   olsun" · "dikeyde solda olsun scroll çubuğu kalemler sadece sağda" ·
   "site renklerini kullan"):
   · DİKEY KAYDIRMA öntanımlı: sayfalar alt alta, pencere sayfanın bütün
     enini gösterir ve aşağı kayar; sayfa sınırları kesik çizgi ve numara.
     Kalın kaydırma çubuğu SOLDA (1. sayfa üstte), kalemler yalnız SAĞDA.
     YATAY kip (eski tek kâğıt, çubuk altta, kalemler iki yanda) sayfa
     çubuğundaki ↕ / ↔ düğmeleriyle seçilir; seçim tarayıcıda kalır.
     Çizgiler sayfanın yerel koordinatında: kip değişince defter aynen kalır.
   · İleri / geri okları büyüdü, sayfa çubuğu YUKARIDA ORTADA. Dikeyde ▲ geri,
     ▼ ileri; yatayda ‹ ileri, › geri. Klavye: ← ↓ PageDown ileri, → ↑ PageUp geri.
   · Çizgi seçenekleri 2 · 3 · 4 · 5 · 7, yeni defter 5 çizgiyle. 6 ve 8
     çizgiyle yazılmış defterler kendi çizgileriyle açılır.
   · ARAPÇA GÜZEL YAZI DEFTERİ («Güzel yazı»): sayfada 3 satır; her satırda
     üst çizgi (elif boyu), kesikli orta çizgi, kalın taban, alt çizgi; orta
     ile taban arası hafifçe boyalı. Y3 kaydında çizgi alanı 'g3'.
   · HAT KALEMİ (üst çubukta, kalınlığın yanında): eğik kesilmiş uç (65°),
     yatayda kalın, dikeyde ince yazar; kalınlık düğmeleri ucun enini seçer.
     Kalemler hat simgesine döner. Kayıtta kalınlık harfi büyük (I/O/K).
   · Düğmeye basınca defter TAM EKRAN açılır (tarayıcı izin vermezse pencere
     yine bütün ekranı kaplar); küçültünce tam ekrandan çıkar, sağ alttaki
     simgeye döner: kırmızı zemin, beyaz canlanan defter ve yazı.
   · Renkler sitenin renkleri: yeşil #16A085 (seçili düğmeler, tutamaç,
     Küçült), lacivert #2C3E50, turuncu (seviye notu), kırmızı #E74C3C (simge).
   ARAÇLAR: 5 renk kalem · hat kalemi · silgi · 3 kalınlık · çizgi sayısı
   (2·3·4·5·7) / güzel yazı · geri al, yinele, temizle · sayfalar (ekle,
   kaldır, ileri / geri, kaydırma çubuğu, dikey / yatay) · PDF · tam ekran.

   Kısayollar: Ctrl+Z / Ctrl+Y, K kalem, S silgi, 1-5 renk, ← → sayfa, Esc.

   KAYIT
   · GEÇMİŞ (bu tarayıcı, IndexedDB «kidef-yazi»): yazılan defter açıkken
     arada bir ve KAPANINCA tarihiyle kaydedilir; «Geçmiş» panelinde
     sınıf sınıf, tarih sırasıyla görünür, açılıp devam edilir. Sınıf
     başına son 60 defter tutulur.
   · SEVİYE NOTLARI (hesap, her cihaz): kullanicilar/{uid}.seviyeNotlari
     = { s5: [ {id, ad, tarih, sayfa, kod} ] } — seviye başına en çok 20.
     Firestore kurallarına dokunulmadı (öğretmen kendi belgesini yazar).
   Çizimler resim değil, ÇİZGİ olarak saklanır (noktalar, sıkıştırılmış):
   her ekranda keskin görünür, az yer tutar. Sayfa 625 birim yüksekliğinde;
   GENİŞLİĞİ EKRANA UYAR (19.10.2026, öğretmen: "yatay olarak alanın hepsini
   kaplasın ... sağda ve solda boşluk olmasın"): görünen genişlik ekran
   oranından gelir (1000 birimlik çekirdeğin ortası esas). Kâğıt alanı
   hep doldurur; başka ekranda açılan defterin bütün çizgileri yine
   görünür (gerekirse küçülür).
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefYaziSayfasi) return;

    /* ------------------------------------------------------------------
       SABİTLER
       ------------------------------------------------------------------ */
    var W = 1000, H = 625;                     /* mantıksal sayfa: en; eski defterlerde boy (16:10) */
    /* A4 BOYU (21.10.2026, öğretmen: "defter dikeyde a4 gibi uzun olmalı"): yeni
       defterlerde sayfa 1000 × 1414 birim (A4 dikey oranı). Boy defterin kendi
       özelliği (D.ph); eski defterler 625 boyuyla olduğu gibi açılır. Çizgi
       sayısı BLOK (bir ekran boyu, 625) başına sayılır, aynı aralıkla sayfanın
       sonuna kadar sürer. */
    var A4_BOY = 1414, BLOK = 625;
    function sayfaYuk() { return (D && D.ph) || H; }
    var RENKLER = [
        { ad: 'Siyah',   k: '#1F2430' },
        { ad: 'Mavi',    k: '#1E5BD8' },
        { ad: 'Kırmızı', k: '#D93025' },
        { ad: 'Yeşil',   k: '#188038' },
        { ad: 'Turuncu', k: '#EA7A0C' }
    ];
    var KALINLIK = [
        { id: 'i', ad: 'İnce', w: 2.4 },
        { id: 'o', ad: 'Orta', w: 4.4 },
        { id: 'k', ad: 'Kalın', w: 8 }
    ];
    var SILGI_W = 28;
    /* YATAY ÇİZGİLER — seçenekler 2·3·4·5·7, yeni defter 5 çizgiyle açılır
       (20.10.2026, öğretmen: "defterde çizgi sayısı şöyle olsun, 2,3,4,5,7";
       varsayılan 5). 2-8 arasındaki her sayı OKUNUR: 6 ve 8 çizgiyle yazılmış
       defterler kendi çizgileriyle açılır. 'g' = ARAPÇA GÜZEL YAZI DEFTERİ
       ("arapça yazmayı öğretmek için Arapça güzel yazı defteri olsun o da
       sadece 3 satır olsun"). */
    var CIZGI_EN_AZ = 2, CIZGI_EN_COK = 8, CIZGI_VARSAYILAN = 5, ESKI_CIZGI = 6;
    var CIZGI_SECENEK = [2, 3, 4, 5, 7];
    var GUZEL_SATIR = 3, GUZEL_ALT = 22;       /* güzel yazı: satır sayısı, alttaki pay (birim) */
    var GUZEL_UST_EK = 56;                     /* güzel yazı: üst paya ek (sayfa çubuğu üstte) */
    /* HAT KALEMİ ("yukarda hat kalemi seçeneği de olsun"): eğik kesilmiş uç;
       yatay giderken kalın, dikey giderken ince yazar. Uç açısı yataydan 65°;
       en (birim) kalınlık düğmesinden. */
    var HAT_ACI = 65 * Math.PI / 180;
    var HAT_KALINLIK = { I: 10, O: 16, K: 24 };
    var UST_BOSLUK = 28;                       /* ilk çizginin üstündeki ek pay (birim; v10'da 56) */
    var MODLAR = [
        { id: 'c', ad: 'Gri çizgiler' },
        { id: 'b', ad: 'Arapça · büyük harf' },
        { id: 'k', ad: 'Arapça · küçük harf' },
        { id: 'o', ad: 'Boş sayfa' }
    ];
    var GECMIS_EN_COK = 60;                    /* sınıf başına */
    var NOT_EN_COK = 20;                       /* seviye başına */
    var NOT_TEK_SINIR = 45000;                 /* bir notun en büyük boyu (karakter) */
    var NOT_TOPLAM_SINIR = 350000;             /* bütün seviye notları birlikte */
    var TERCIH = 'kidefYaziTercih';

    /* ------------------------------------------------------------------
       KÜÇÜK YARDIMCILAR
       ------------------------------------------------------------------ */
    function esc(x) {
        return String(x == null ? '' : x)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function rol() {
        try { return (typeof appState !== 'undefined' && appState) ? (appState.userRole || '') : ''; } catch (e) { return ''; }
    }
    function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }
    function benKim() { try { return firebase.auth().currentUser || null; } catch (e) { return null; } }
    function tarihYaz(ms, saatli) {
        var d = new Date(ms);
        if (isNaN(d.getTime())) return '—';
        var o = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
        if (saatli) { o.hour = '2-digit'; o.minute = '2-digit'; }
        return d.toLocaleString('tr-TR', o);
    }
    function kisaTarih(ms) {
        var d = new Date(ms);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    function tercihOku() {
        try { return JSON.parse(localStorage.getItem(TERCIH) || '{}') || {}; } catch (e) { return {}; }
    }
    function tercihYaz(t) {
        try { localStorage.setItem(TERCIH, JSON.stringify(t)); } catch (e) { }
    }
    function yeniId() { return 'y' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
    function subeAdi() {
        /* Öğretmen bir şube seçmişse (listelerim) geçmiş kaydında adı görünsün */
        try {
            if (typeof window.llAktifSinif !== 'function') return '';
            var a = window.llAktifSinif();
            if (!a || !a.lId || !a.cId || typeof data === 'undefined' || !data || !data.levels) return '';
            var c = data.levels[a.lId] && data.levels[a.lId].classes && data.levels[a.lId].classes[a.cId];
            return (c && c.name) ? String(c.name) : '';
        } catch (e) { return ''; }
    }

    /* ------------------------------------------------------------------
       ÇİZGİLERİ SAKLAMA BİÇİMİ
       Noktalar yarım birim hassasiyetle tam sayıya çevrilir, ardışık
       farklar "polyline" kodlamasıyla (ASCII 63-126) yazılır.
       Defter: "Y3|<sayfa genişliği>|<çizgi sayısı>|<üst pay>|" + sayfalar
       (\n ile); sayfa: düzen harfi + çizgiler (boşlukla); çizgi: renk
       harfi ('0'-'4', silgi 'x') + kalınlık harfi ('i','o','k','s') +
       noktalar. Eski biçimler okunur: "Y2|<genişlik>|", "Y1|" (6 çizgi,
       üst pay yok). Başlık alanları rakam olduğu için ilk üç '|' ayraçtır
       (noktaların kodunda da '|' geçebilir: bölme sırayla yapılır).
       ------------------------------------------------------------------ */
    function sayiKodla(n, out) {
        var v = n < 0 ? ~(n << 1) : (n << 1);
        while (v >= 0x20) { out.push(String.fromCharCode((0x20 | (v & 0x1f)) + 63)); v >>= 5; }
        out.push(String.fromCharCode(v + 63));
    }
    function sayilariCoz(s) {
        var res = [], i = 0, n = s.length;
        while (i < n) {
            var b, kay = 0, r = 0;
            do { b = s.charCodeAt(i++) - 63; r |= (b & 0x1f) << kay; kay += 5; } while (b >= 0x20 && i <= n);
            res.push((r & 1) ? ~(r >> 1) : (r >> 1));
        }
        return res;
    }
    function cizgiKodla(c) {
        var out = [c.s ? 'x' : String(c.r), c.s ? 's' : c.k];
        var px = 0, py = 0;
        for (var i = 0; i < c.p.length; i += 2) {
            var x = Math.round(c.p[i] * 2), y = Math.round(c.p[i + 1] * 2);
            sayiKodla(x - px, out); sayiKodla(y - py, out);
            px = x; py = y;
        }
        return out.join('');
    }
    function cizgiCoz(t) {
        if (!t || t.length < 2) return null;
        var sayi = sayilariCoz(t.slice(2)), p = [], x = 0, y = 0;
        for (var i = 0; i + 1 < sayi.length; i += 2) { x += sayi[i]; y += sayi[i + 1]; p.push(x / 2, y / 2); }
        if (!p.length) return null;
        var silgi = t.charAt(0) === 'x';
        return { r: silgi ? 0 : Math.max(0, Math.min(4, +t.charAt(0) || 0)), k: silgi ? 'o' : t.charAt(1), s: silgi ? 1 : 0, p: p };
    }
    function cizgiSayisi(n) {
        n = parseInt(n, 10);
        return (n >= CIZGI_EN_AZ && n <= CIZGI_EN_COK) ? n : CIZGI_VARSAYILAN;
    }
    function defterKodla(sayfalar, pw, R) {
        /* çizgi alanı: sayı (çizgili) ya da 'g3' (güzel yazı, 3 satır) */
        var n = (R && R.g) ? 'g' + GUZEL_SATIR : cizgiSayisi(R && R.n);
        var ust = (R && R.ust != null) ? Math.max(0, Math.round(R.ust)) : UST_BOSLUK;
        var ph = Math.round((R && R.ph) || H);
        return 'Y4|' + Math.round(pw || W) + '|' + ph + '|' + n + '|' + ust + '|' + sayfalar.map(function (s) {
            return 'c' + s.cizimler.map(cizgiKodla).map(function (x) { return ' ' + x; }).join('');
        }).join('\n');
    }
    function defterCoz(kod) {
        var govde = null, pw = 0, cn = CIZGI_VARSAYILAN, ust = UST_BOSLUK, ph = H;
        if (kod && kod.indexOf('Y4|') === 0) {
            var b1 = kod.indexOf('|', 3), b2 = kod.indexOf('|', b1 + 1), b3 = kod.indexOf('|', b2 + 1), b4 = kod.indexOf('|', b3 + 1);
            if (b1 > 0 && b2 > b1 && b3 > b2 && b4 > b3) {
                pw = parseInt(kod.slice(3, b1), 10) || W;
                ph = parseInt(kod.slice(b1 + 1, b2), 10) || H;
                var alan4 = kod.slice(b2 + 1, b3);
                cn = /^g/i.test(alan4) ? 'g' : cizgiSayisi(alan4);
                ust = Math.max(0, parseInt(kod.slice(b3 + 1, b4), 10) || 0);
                govde = kod.slice(b4 + 1);
            }
        } else if (kod && kod.indexOf('Y3|') === 0) {
            var a1 = kod.indexOf('|', 3), a2 = kod.indexOf('|', a1 + 1), a3 = kod.indexOf('|', a2 + 1);
            if (a1 > 0 && a2 > a1 && a3 > a2) {
                pw = parseInt(kod.slice(3, a1), 10) || W;
                var alan = kod.slice(a1 + 1, a2);
                cn = /^g/i.test(alan) ? 'g' : cizgiSayisi(alan);
                ust = Math.max(0, parseInt(kod.slice(a2 + 1, a3), 10) || 0);
                govde = kod.slice(a3 + 1);
            }
        } else if (kod && kod.indexOf('Y2|') === 0) {
            var k = kod.indexOf('|', 3);
            pw = parseInt(kod.slice(3, k), 10) || W;
            govde = kod.slice(k + 1);
            ust = 0; cn = ESKI_CIZGI;                /* eski: 6 çizgi, üst pay yok */
        } else if (kod && kod.indexOf('Y1|') === 0) {
            govde = kod.slice(3);
            ust = 0; cn = ESKI_CIZGI;
        }
        var L = govde == null ? [] : govde.split('\n').map(function (ps) {
            var c = ps.slice(1).split(' ').filter(Boolean).map(cizgiCoz).filter(Boolean);
            var sy = yeniSayfa('c'); sy.cizimler = c; return sy;
        });
        if (!L.length) L = [yeniSayfa('c')];
        if (!pw) {
            /* eski (Y1) defter: her sayfa ekranın ortasına (500) göre yazılmıştı;
               sayfa genişliği çizgilerin hiçbiri komşu sayfaya taşmayacak kadar */
            pw = W;
            L.forEach(function (sy) {
                var b = sinirlar(sy);
                if (b) pw = Math.max(pw, Math.ceil(2 * Math.max(W / 2 - b[0], b[1] - W / 2) + 40));
            });
        }
        L.pw = pw;
        L.ph = Math.max(200, Math.min(4000, ph));
        L.cizgi = cn;
        L.ust = ust;
        return L;
    }
    /* kayıt kodundan yalnız sayfa boyu (listeler için, bütün kodu çözmeden) */
    function kodBoy(kod) {
        if (kod && kod.indexOf('Y4|') === 0) {
            var b1 = kod.indexOf('|', 3), b2 = kod.indexOf('|', b1 + 1);
            var v = parseInt(kod.slice(b1 + 1, b2), 10);
            if (v >= 200 && v <= 4000) return v;
        }
        return H;
    }
    /* sondaki boş sayfalar (‹ ile açılıp yazılmayan) kaydedilmez, PDF'e girmez */
    function kayitSayfalari(L) {
        var n = L.length;
        while (n > 1 && !L[n - 1].cizimler.length) n--;
        return L.slice(0, n);
    }
    function yeniSayfa(mod) { return { mod: mod || 'c', cizimler: [], geri: [], ileri: [] }; }

    /* Ramer–Douglas–Peucker: çizgi biterken gereksiz noktalar atılır */
    function sadelestir(p, tol) {
        var n = p.length / 2;
        if (n <= 2) return p.slice();
        var tut = new Uint8Array(n); tut[0] = tut[n - 1] = 1;
        var yigin = [[0, n - 1]];
        while (yigin.length) {
            var ab = yigin.pop(), a = ab[0], b = ab[1];
            var ax = p[a * 2], ay = p[a * 2 + 1], bx = p[b * 2], by = p[b * 2 + 1];
            var dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy, en = -1, eni = -1;
            for (var i = a + 1; i < b; i++) {
                var px = p[i * 2], py = p[i * 2 + 1], d;
                if (L2 === 0) d = (px - ax) * (px - ax) + (py - ay) * (py - ay);
                else {
                    var t = ((px - ax) * dx + (py - ay) * dy) / L2;
                    t = Math.max(0, Math.min(1, t));
                    var qx = ax + t * dx - px, qy = ay + t * dy - py;
                    d = qx * qx + qy * qy;
                }
                if (d > en) { en = d; eni = i; }
            }
            if (en > tol * tol && eni > 0) { tut[eni] = 1; yigin.push([a, eni], [eni, b]); }
        }
        var out = [];
        for (var j = 0; j < n; j++) if (tut[j]) out.push(p[j * 2], p[j * 2 + 1]);
        return out;
    }
    function bosMu(sayfalar) {
        return !sayfalar.some(function (s) { return s.cizimler.length; });
    }

    /* ------------------------------------------------------------------
       ÇİZİM
       ------------------------------------------------------------------ */
    function kalinlikW(k) {
        if (HAT_KALINLIK[k]) return HAT_KALINLIK[k];
        for (var i = 0; i < KALINLIK.length; i++) if (KALINLIK[i].id === k) return KALINLIK[i].w;
        return KALINLIK[1].w;
    }
    /* HAT KALEMİ İZİ — iki nokta arasında ucun sürüklediği paralelkenar. Hepsi
       aynı yönde çizilir ki tek dolguda birleşsin (dönüşlerde boşluk kalmaz). */
    function hatMi(k) { return !!HAT_KALINLIK[k]; }
    function hatUc(w) { return [Math.cos(HAT_ACI) * w / 2, -Math.sin(HAT_ACI) * w / 2]; }
    function hatDortgen(ctx, ax, ay, bx, by, nx, ny) {
        if ((bx - ax) * ny - (by - ay) * nx >= 0) {
            ctx.moveTo(ax + nx, ay + ny); ctx.lineTo(bx + nx, by + ny); ctx.lineTo(bx - nx, by - ny); ctx.lineTo(ax - nx, ay - ny);
        } else {
            ctx.moveTo(ax - nx, ay - ny); ctx.lineTo(bx - nx, by - ny); ctx.lineTo(bx + nx, by + ny); ctx.lineTo(ax + nx, ay + ny);
        }
        ctx.closePath();
    }
    function hatYol(ctx, p, w) {
        var u = hatUc(w), nx = u[0], ny = u[1], n = p.length / 2;
        ctx.beginPath();
        if (n === 1) {                                   /* tek dokunuş: ucun ince izi */
            var mx = -ny * 0.16, my = nx * 0.16;
            hatDortgen(ctx, p[0] - mx, p[1] - my, p[0] + mx, p[1] + my, nx, ny);
        }
        for (var i = 0; i + 1 < n; i++) {
            var ax = p[i * 2], ay = p[i * 2 + 1], bx = p[i * 2 + 2], by = p[i * 2 + 3];
            if (ax === bx && ay === by) continue;
            hatDortgen(ctx, ax, ay, bx, by, nx, ny);
        }
        ctx.fill();
    }

    /* YATAY ÇİZGİLER — R = { n: çizgi sayısı (2-8), ust: en üstteki ek pay }.
       Aralık g = (H - ust) / (n + 1); k. çizgi ust + k·g'de. Eski defterlerde
       (ust 0, n 6) eskisinin aynısı: H·k/7. */
    function cizgiDuzeni(d) {
        if (d === undefined) d = D;
        return { n: cizgiSayisi(d && d.cizgi), ust: (d && d.ust != null) ? d.ust : UST_BOSLUK, g: !!(d && d.cizgi === 'g'),
                 ph: (d && d.ph) || H };
    }
    function cizgiYerleri(R) {
        var n = cizgiSayisi(R && R.n), ust = (R && R.ust != null) ? R.ust : UST_BOSLUK, ph = (R && R.ph) || H;
        var g = (BLOK - ust) / (n + 1), L = [];
        for (var y = ust + g; y <= ph - g * 0.45 && L.length < 60; y += g) L.push(Math.round(y));
        return L;
    }
    /* çizgi en az bir tuval pikseli kalınlıkta (telefonda dikey kipte ölçek küçük) */
    function enAz(ctx, w) {
        var t = ctx.getTransform ? ctx.getTransform() : null, o = t ? Math.abs(t.a) : 1;
        return o > 0 ? Math.max(w, 1 / o) : w;
    }
    function cizgiDesen(ctx, a, b, R) {
        if (b <= a) return;
        ctx.setLineDash([]);
        if (R && R.g) { guzelDesen(ctx, a, b, R); return; }
        ctx.strokeStyle = '#CDD3DB'; ctx.lineWidth = enAz(ctx, 1.5);
        ctx.beginPath();
        cizgiYerleri(R).forEach(function (y) { ctx.moveTo(a, y); ctx.lineTo(b, y); });
        ctx.stroke();
    }
    /* ARAPÇA GÜZEL YAZI DEFTERİ — sayfada 3 satır. Her satırda yukarıdan
       aşağı: üst çizgi (elif boyu), kesikli orta çizgi, KALIN taban (harfin
       oturduğu çizgi), alt çizgi (inen kuyruklar). Orta ile taban arası
       (harflerin gövdesi) hafifçe boyalı. */
    function guzelYerleri(R) {
        /* ilk satır, kâğıdın üstündeki sayfa çubuğunun altından başlasın */
        var ust = ((R && R.ust != null) ? R.ust : UST_BOSLUK) + GUZEL_UST_EK, ph = (R && R.ph) || H;
        var B = (BLOK - ust - GUZEL_ALT) / GUZEL_SATIR, L = [];
        var adet = Math.max(1, Math.min(30, Math.floor((ph - ust - GUZEL_ALT) / B + 1e-6)));   /* A4: 7 satır */
        for (var r = 0; r < adet; r++) {
            var t = ust + r * B;
            L.push({ ust: Math.round(t + 0.14 * B), orta: Math.round(t + 0.44 * B),
                     taban: Math.round(t + 0.64 * B), alt: Math.round(t + 0.86 * B) });
        }
        return L;
    }
    function guzelDesen(ctx, a, b, R) {
        var faz = ((a % 18) + 18) % 18;                 /* kesikli çizgi kâğıda göre dursun, kaymasın */
        guzelYerleri(R).forEach(function (s) {
            ctx.fillStyle = 'rgba(22,160,133,.07)';
            ctx.fillRect(a, s.orta, b - a, s.taban - s.orta);
            ctx.setLineDash([]);
            ctx.strokeStyle = '#D2D8E0'; ctx.lineWidth = enAz(ctx, 1.3);
            ctx.beginPath(); ctx.moveTo(a, s.ust); ctx.lineTo(b, s.ust); ctx.moveTo(a, s.alt); ctx.lineTo(b, s.alt); ctx.stroke();
            ctx.setLineDash([10, 8]); ctx.lineDashOffset = faz;
            ctx.strokeStyle = '#B4BDC9'; ctx.lineWidth = enAz(ctx, 1.3);
            ctx.beginPath(); ctx.moveTo(a, s.orta); ctx.lineTo(b, s.orta); ctx.stroke();
            ctx.setLineDash([]); ctx.lineDashOffset = 0;
            ctx.strokeStyle = '#8D99A8'; ctx.lineWidth = enAz(ctx, 2.6);
            ctx.beginPath(); ctx.moveTo(a, s.taban); ctx.lineTo(b, s.taban); ctx.stroke();
        });
    }
    /* Arapça sağdan başlar: kırmızı kenar çizgisi kâğıdın başında (sağda) */
    function kenarCiz(ctx, x) {
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(232,124,124,.55)'; ctx.lineWidth = 1.4;
        ctx.moveTo(x, 10); ctx.lineTo(x, sayfaYuk() - 10); ctx.stroke();
    }
    /* Tek sayfa (önizleme, PDF). sagKenar: 1. sayfada kâğıdın sağ ucu */
    function cizgileriCiz(ctx, mod, o, x0, x1, sagKenar, R) {
        if (x0 == null) x0 = 0;
        if (x1 == null) x1 = W;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -x0 * o, 0);
        ctx.fillStyle = '#FFFFFF';
        var phc = (R && R.ph) || sayfaYuk();
        ctx.fillRect(x0, 0, x1 - x0, phc);
        cizgiDesen(ctx, x0, sagKenar != null ? Math.min(x1, sagKenar - 18) : x1, R || cizgiDuzeni());
        if (sagKenar != null) { ctx.setLineDash([]); ctx.beginPath(); ctx.strokeStyle = 'rgba(232,124,124,.55)'; ctx.lineWidth = 1.4;
            ctx.moveTo(sagKenar - 44, 10); ctx.lineTo(sagKenar - 44, phc - 10); ctx.stroke(); }
        ctx.restore();
    }
    /* Ekrandaki pencere: tek kâğıdın [vx0, vx1] aralığı */
    function seritCiz(ctx, o, vx0, vx1) {
        var sag = SAG();
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -vx0 * o, 0);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(vx0, 0, vx1 - vx0, sayfaYuk());
        cizgiDesen(ctx, vx0, Math.min(vx1, sag - 18), cizgiDuzeni());
        if (sag - 44 >= vx0 - 2 && sag - 44 <= vx1 + 2) kenarCiz(ctx, sag - 44);
        ctx.restore();
    }
    function cizimCiz(ctx, c, o, x0, y0) {
        var p = c.p, n = p.length / 2;
        if (!n) return;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -(x0 || 0) * o, -(y0 || 0) * o);
        ctx.globalCompositeOperation = c.s ? 'destination-out' : 'source-over';
        var w = c.s ? SILGI_W : kalinlikW(c.k);
        var renk = c.s ? '#000' : (RENKLER[c.r] || RENKLER[0]).k;
        if (!c.s && hatMi(c.k)) { ctx.fillStyle = renk; hatYol(ctx, p, w); ctx.restore(); return; }
        if (n === 1) {
            ctx.beginPath(); ctx.fillStyle = renk;
            ctx.arc(p[0], p[1], w / 2, 0, Math.PI * 2); ctx.fill();
            ctx.restore(); return;
        }
        ctx.beginPath();
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = renk; ctx.lineWidth = w;
        ctx.moveTo(p[0], p[1]);
        for (var i = 1; i < n - 1; i++) {
            var mx = (p[i * 2] + p[i * 2 + 2]) / 2, my = (p[i * 2 + 1] + p[i * 2 + 3]) / 2;
            ctx.quadraticCurveTo(p[i * 2], p[i * 2 + 1], mx, my);
        }
        ctx.lineTo(p[(n - 1) * 2], p[(n - 1) * 2 + 1]);
        ctx.stroke();
        ctx.restore();
    }
    /* Küçük önizleme (geçmiş ve notlar listesi için) */
    /* GÖRÜNÜM — sayfanın ekranda görünen yatay aralığı [x0, x1].
       Yükseklik hep 0-625. Genişlik: 1000'lik çekirdek, ekran oranı
       (geniş ekranda iki yana açılır) ve çizgilerin vardığı yer —
       hangisi büyükse. Böylece aynı ekranda kâğıt alanın hepsini kaplar,
       başka ekranda hiçbir çizgi dışarıda kalmaz. */
    function sinirlar(s) {
        var a = Infinity, z = -Infinity;
        s.cizimler.forEach(function (c) {
            if (c.s) return;
            for (var i = 0; i < c.p.length; i += 2) { if (c.p[i] < a) a = c.p[i]; if (c.p[i] > z) z = c.p[i]; }
        });
        return a <= z ? [a, z] : null;
    }
    function gorunum(s, oran, pw) {
        /* önizleme ve PDF için tek sayfanın aralığı: sayfa genişliği (ya da
           oran) ve çizgilerin vardığı yer — hangisi genişse */
        var phg = sayfaYuk();
        var yari = Math.max(phg * (oran || W / phg) / 2, (pw || 0) / 2);
        var b = sinirlar(s);
        if (b) yari = Math.max(yari, W / 2 - b[0] + 5, b[1] - W / 2 + 5);
        return { x0: W / 2 - yari, x1: W / 2 + yari };
    }
    function onizlemeCiz(canvas, sayfa, kenar, pw, R) {
        pw = pw || (D && D.pw) || W;
        var pho = (R && R.ph) || sayfaYuk();
        /* dikey (A4) sayfa yatay bir kutuya küçültülünce okunmaz: en'e göre sığdır, üstten göster */
        var g = pho > W ? gorunum(sayfa, canvas.width / canvas.height, pw) : gorunum(sayfa, canvas.width / canvas.height, pw);
        var o = pho > W && canvas.height < canvas.width ? canvas.width / (g.x1 - g.x0) : Math.min(canvas.width / (g.x1 - g.x0), canvas.height / pho);
        var ctx = canvas.getContext('2d');
        cizgileriCiz(ctx, 'c', o, g.x0, g.x1, kenar ? W / 2 + pw / 2 : null, R || cizgiDuzeni());
        var tmp = document.createElement('canvas');
        tmp.width = canvas.width; tmp.height = canvas.height;
        var t = tmp.getContext('2d');
        sayfa.cizimler.forEach(function (c) { cizimCiz(t, c, o, g.x0); });
        ctx.drawImage(tmp, 0, 0);
    }
    function onizlemeUrl(sayfa) {
        try {
            var c = document.createElement('canvas');
            c.width = 240; c.height = 150;
            onizlemeCiz(c, sayfa, true);
            return c.toDataURL('image/png');
        } catch (e) { return ''; }
    }

    /* ------------------------------------------------------------------
       GEÇMİŞ — bu tarayıcıda (IndexedDB; olmazsa localStorage)
       ------------------------------------------------------------------ */
    var _idb = null;
    function idbAc() {
        if (_idb) return _idb;
        _idb = new Promise(function (res, rej) {
            try {
                if (!window.indexedDB) { rej(new Error('IndexedDB yok')); return; }
                var r = indexedDB.open('kidef-yazi', 1);
                r.onupgradeneeded = function () {
                    var db = r.result;
                    if (!db.objectStoreNames.contains('defterler')) {
                        var st = db.createObjectStore('defterler', { keyPath: 'id' });
                        st.createIndex('sinif', 'sinif');
                    }
                };
                r.onsuccess = function () { res(r.result); };
                r.onerror = function () { rej(r.error || new Error('IndexedDB açılamadı')); };
            } catch (e) { rej(e); }
        });
        _idb.catch(function () { _idb = null; });
        return _idb;
    }
    function lsAnahtar(sinif) { return 'kidefYaziGecmis_' + sinif; }
    function lsOku(sinif) { try { return JSON.parse(localStorage.getItem(lsAnahtar(sinif)) || '[]') || []; } catch (e) { return []; } }
    function lsYaz(sinif, L) { try { localStorage.setItem(lsAnahtar(sinif), JSON.stringify(L.slice(0, 15))); } catch (e) { } }

    function gecmisListe(sinif) {
        return idbAc().then(function (db) {
            return new Promise(function (res, rej) {
                var L = [];
                var tx = db.transaction('defterler', 'readonly');
                var ix = tx.objectStore('defterler').index('sinif');
                var q = ix.openCursor(IDBKeyRange.only(String(sinif)));
                q.onsuccess = function () {
                    var c = q.result;
                    if (c) { L.push(c.value); c.continue(); }
                    else res(L.sort(function (a, b) { return (b.guncelleme || 0) - (a.guncelleme || 0); }));
                };
                q.onerror = function () { rej(q.error); };
            });
        }).catch(function () {
            return lsOku(sinif).sort(function (a, b) { return (b.guncelleme || 0) - (a.guncelleme || 0); });
        });
    }
    function gecmisKoy(kayit) {
        return idbAc().then(function (db) {
            return new Promise(function (res, rej) {
                var tx = db.transaction('defterler', 'readwrite');
                tx.objectStore('defterler').put(kayit);
                tx.oncomplete = function () { res(); };
                tx.onerror = function () { rej(tx.error); };
            });
        }).then(function () {
            return gecmisListe(kayit.sinif).then(function (L) {
                var fazla = L.slice(GECMIS_EN_COK);
                return Promise.all(fazla.map(function (k) { return gecmisSil(k.id, k.sinif); }));
            });
        }).catch(function () {
            var L = lsOku(kayit.sinif).filter(function (k) { return k.id !== kayit.id; });
            L.unshift(kayit);
            lsYaz(kayit.sinif, L);
        });
    }
    function gecmisSil(id, sinif) {
        return idbAc().then(function (db) {
            return new Promise(function (res, rej) {
                var tx = db.transaction('defterler', 'readwrite');
                tx.objectStore('defterler').delete(id);
                tx.oncomplete = function () { res(); };
                tx.onerror = function () { rej(tx.error); };
            });
        }).catch(function () {
            lsYaz(sinif, lsOku(sinif).filter(function (k) { return k.id !== id; }));
        });
    }

    /* ------------------------------------------------------------------
       SEVİYE NOTLARI — hesapta (kullanicilar/{uid}.seviyeNotlari)
       ------------------------------------------------------------------ */
    function benBelge() {
        var u = benKim();
        try { return u ? firebase.firestore().collection('kullanicilar').doc(u.uid) : null; } catch (e) { return null; }
    }
    function notlarHepsi() {
        var ref = benBelge();
        if (!ref) return Promise.reject(new Error('giris'));
        return ref.get().then(function (s) {
            var d = s.exists ? (s.data() || {}) : {};
            return (d.seviyeNotlari && typeof d.seviyeNotlari === 'object') ? d.seviyeNotlari : {};
        });
    }
    function notlarYaz(sinif, L) {
        var ref = benBelge();
        if (!ref) return Promise.reject(new Error('giris'));
        var g = {}; g['seviyeNotlari.s' + sinif] = L;
        return ref.update(g);
    }

    /* ------------------------------------------------------------------
       STİL
       ------------------------------------------------------------------ */
    /* RENKLER sitenin renkleri (20.10.2026, öğretmen: "site renklerini
       kullan"): yeşil #16A085 / koyu yeşil #0E7C66, lacivert #2C3E50,
       turuncu #F39C12, kırmızı #E74C3C / #C0392B. Kalem mürekkepleri aynı. */
    function stilKur() {
        if (document.getElementById('ys-stil')) return;
        var s = document.createElement('style');
        s.id = 'ys-stil';
        s.textContent = [
            '#ysOrt{position:fixed; inset:0; z-index:99990; background:rgba(15,23,42,.62); display:flex; align-items:center;',
            '  justify-content:center; padding:0; animation:ysSol .18s ease-out; font-family:inherit;}',
            '#ysOrt.kucuk{display:none;}',
            '@keyframes ysSol{from{opacity:0}to{opacity:1}}',
            /* tam ekran ("defter popup ı tam ekran açılsın"): tarayıcı tam ekrana
               izin vermese de pencere bütün ekranı kaplar */
            '#ysKutu{position:relative; width:100vw; height:100vh; height:100dvh; background:#EEF1F5; border-radius:0;',
            '  display:flex; flex-direction:column; overflow:hidden;',
            '  animation:ysCik .22s cubic-bezier(.2,1.1,.4,1); color:#2C3E50;}',
            '@keyframes ysCik{from{transform:scale(.985); opacity:0}to{transform:none; opacity:1}}',
            '#ysOrt:fullscreen{padding:0;} #ysOrt:fullscreen #ysKutu{width:100%; height:100%; border-radius:0;}',
            '.ys-arac{display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:9px 12px; background:#fff;',
            '  border-bottom:1px solid #E2E7EE; flex:none;}',
            '.ys-baslik{display:flex; align-items:center; gap:8px; font-weight:900; color:#0E7C66; margin-inline-end:6px; white-space:nowrap;}',
            '.ys-baslik svg{width:26px; height:26px;}',
            '.ys-baslik small{display:block; font-size:.7rem; font-weight:700; color:#8A94A3;}',
            '.ys-grup{display:flex; align-items:center; gap:3px; padding:3px; background:#F2F5F9; border-radius:12px;}',
            '.ys-ayrac{width:1px; height:28px; background:#E2E7EE; margin:0 3px;}',
            '.ys-gara{width:1px; height:22px; background:#DDE3EA; margin:0 3px; flex:none;}',
            '.ys-t{border:0; background:transparent; cursor:pointer; min-width:36px; height:36px; border-radius:9px; display:inline-flex;',
            '  align-items:center; justify-content:center; gap:6px; color:#3D4756; font-family:inherit; font-size:.82rem; font-weight:800;',
            '  padding:0 8px; transition:background .12s, color .12s, transform .12s;}',
            '.ys-t svg{width:20px; height:20px; flex:none;}',
            '.ys-t:hover{background:#E5EBF3;}',
            '.ys-t.sec{background:#16A085; color:#fff;}',
            '.ys-t[disabled]{opacity:.35; cursor:default; background:transparent;}',
            '.ys-renk{width:30px; height:30px; min-width:30px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 0 1.5px #D5DCE5;',
            '  cursor:pointer; transition:transform .12s, box-shadow .12s; padding:0;}',
            '.ys-renk:hover{transform:scale(1.1);}',
            '.ys-renk.sec{box-shadow:0 0 0 2.5px #16A085; transform:scale(1.12);}',
            /* kalem simgesi: hat kalemi seçiliyken eğik uçlu kalem görünür */
            '.ys-renk .ik-k,.ys-renk .ik-h{display:flex; align-items:center; justify-content:center;}',
            '.ys-renk .ik-h{display:none;} #ysKutu.hat .ys-renk .ik-h{display:flex;} #ysKutu.hat .ys-renk .ik-k{display:none;}',
            '.ys-kal{width:34px; height:34px; min-width:34px; border:0; background:transparent; border-radius:9px; cursor:pointer;',
            '  display:inline-flex; align-items:center; justify-content:center;}',
            '.ys-kal i{display:block; border-radius:50%; background:#3D4756;}',
            '#ysKutu.hat .ys-kal i{border-radius:2px; transform:rotate(-25deg); height:4px !important;}',
            '.ys-kal.sec{background:#D6F0E9;}',
            '.ys-kal:hover{background:#E5EBF3;}',
            '.ys-t.ys-hat.sec{background:#16A085; color:#fff;}',
            '.ys-mod{width:40px; height:34px; border:0; background:transparent; border-radius:9px; cursor:pointer; padding:0;',
            '  display:inline-flex; align-items:center; justify-content:center;}',
            '.ys-mod svg{width:30px; height:22px;}',
            '.ys-mod.sec{background:#D6F0E9;}',
            '.ys-mod:hover{background:#E5EBF3;}',
            '.ys-sayfa{font-weight:900; font-size:.85rem; min-width:46px; text-align:center; color:#2C3E50; font-variant-numeric:tabular-nums;}',
            /* çizgi sayısı / güzel yazı seçici */
            '.ys-csay{min-width:30px; height:32px; padding:0 4px; border:0; background:transparent; border-radius:8px; cursor:pointer;',
            '  font-family:inherit; font-weight:900; font-size:.92rem; color:#3D4756; font-variant-numeric:tabular-nums;}',
            '.ys-csay:hover{background:#E5EBF3;}',
            '.ys-csay.sec{background:#16A085; color:#fff;}',
            '.ys-csay.ys-guzel{display:inline-flex; align-items:center; gap:5px; padding:0 8px; font-size:.8rem; font-weight:800; white-space:nowrap;}',
            '.ys-csay.ys-guzel svg{width:21px; height:21px; flex:none;}',
            '.ys-cet{display:inline-flex; align-items:center; gap:5px; padding:0 5px 0 4px; color:#55606D; font-weight:800; font-size:.8rem; white-space:nowrap;}',
            '.ys-cet svg{width:20px; height:20px; flex:none;}',
            /* yatayda en altta kalın kaydırma çubuğu, dikeyde solda */
            '.ys-kaydirma{flex:none; padding:7px 14px 9px; background:#fff; border-top:1px solid #E2E7EE;}',
            '.ys-ray{position:relative; height:34px; border-radius:999px; background:#E7ECF3; box-shadow:inset 0 1px 3px rgba(15,23,42,.14);',
            '  cursor:pointer; touch-action:none; -webkit-user-select:none; user-select:none;}',
            '.ys-dray{display:none; position:absolute; left:8px; top:10px; bottom:10px; width:34px; z-index:3; border-radius:999px;',
            '  background:#E7ECF3; box-shadow:inset 0 1px 3px rgba(15,23,42,.14); cursor:pointer; touch-action:none;',
            '  -webkit-user-select:none; user-select:none;}',
            '#ysKutu.dikey .ys-dray{display:block;}',
            '.ys-ray-sayfalar{position:absolute; inset:0; border-radius:999px; overflow:hidden;}',
            '.ys-ray-sayfalar span{position:absolute; top:0; bottom:0; display:flex; align-items:center; justify-content:center;',
            '  font-size:.8rem; font-weight:800; color:#94A0B0; font-variant-numeric:tabular-nums; pointer-events:none;}',
            '.ys-ray-sayfalar span.ara{border-left:1.5px solid rgba(15,23,42,.13);}',
            '.ys-dray .ys-ray-sayfalar span{top:auto; bottom:auto; left:0; right:0;}',
            '.ys-dray .ys-ray-sayfalar span.ara{border-left:0; border-bottom:1.5px solid rgba(15,23,42,.13);}',
            '.ys-tutamak{position:absolute; top:3px; bottom:3px; left:0; min-width:44px; border-radius:999px; background:#16A085; color:#fff;',
            '  display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(22,160,133,.4); cursor:grab;',
            '  font-weight:900; font-size:.9rem; font-variant-numeric:tabular-nums; transition:background .12s;}',
            '.ys-tutamak::before,.ys-tutamak::after{content:""; flex:none; width:2px; height:12px; border-radius:2px; background:rgba(255,255,255,.55); margin:0 8px;}',
            '.ys-dray .ys-tutamak{top:0; bottom:auto; left:3px; right:3px; min-width:0; min-height:44px; flex-direction:column;}',
            '.ys-dray .ys-tutamak::before,.ys-dray .ys-tutamak::after{width:12px; height:2px; margin:7px 0;}',
            '.ys-ray:hover .ys-tutamak,.ys-dray:hover .ys-tutamak{background:#13937A;}',
            '.ys-tutamak.suruk,.ys-ray:hover .ys-tutamak.suruk,.ys-dray:hover .ys-tutamak.suruk{cursor:grabbing; background:#0E7C66;}',
            '.ys-ray.tek,.ys-ray.tek .ys-tutamak,.ys-dray.tek,.ys-dray.tek .ys-tutamak{cursor:default;}',
            /* kaydırılacak yer yoksa tutamaç sönük */
            '.ys-ray.tek .ys-tutamak,.ys-ray.tek:hover .ys-tutamak,.ys-dray.tek .ys-tutamak,.ys-dray.tek:hover .ys-tutamak{background:#C5E8DF; color:#0E7C66; box-shadow:none;}',
            '.ys-ray.tek .ys-tutamak::before,.ys-ray.tek .ys-tutamak::after,.ys-dray.tek .ys-tutamak::before,.ys-dray.tek .ys-tutamak::after{background:rgba(14,124,102,.35);}',
            /* dikey kip: alttaki çubuk yok, soldaki kalemler yok, kâğıt çubuğun sağında */
            '#ysKutu.dikey .ys-kaydirma{display:none;}',
            '#ysKutu.dikey .ys-yan.sol{display:none;}',
            '#ysKutu.dikey .ys-sahne{justify-content:flex-end;}',
            '.ys-bos{flex:1 1 auto;}',
            '.ys-t.ana{background:#FEF5E7; color:#B9650A;}',
            '.ys-t.ana:hover{background:#FCE8C8;}',
            '.ys-t.kapat{background:#F1F4F9; font-size:1.25rem; font-weight:700;}',
            '.ys-t.kucult{background:#16A085; color:#fff; padding:0 13px 0 10px;}',
            '.ys-t.kucult:hover{background:#0E7C66;}',
            '.ys-t.kucult svg{width:22px; height:22px;}',
            '.ys-t.ys-ana{text-decoration:none;}',
            '#ysKutu.tam .ys-ana{display:none;}',
            '.ys-arac{position:relative; padding-right:232px;}',
            '.ys-pencere{position:absolute; top:9px; right:12px; display:flex; align-items:center; gap:6px;}',
            /* üst çubuk TEK SATIR kalsın: ≤1500 düğme yazıları gizlenir (simge +
               ipucu), ≤1180 sıkışır, 941-1100 «Seviye notlarına kaydet» yalnız
               yıldız; ≤940 iki düzenli satır (aşağıda) */
            '@media (max-width:1500px){.ys-cet span,.ys-guzel span,.ys-hat span,.ys-t[data-is="panel"] span,.ys-t[data-is="pdf"] span,',
            '  .ys-t[data-is="tamEkran"] span{display:none;} .ys-arac{padding-right:150px;}}',
            '@media (max-width:1180px) and (min-width:761px){.ys-arac{gap:4px;} .ys-cet{display:none;} .ys-csay{min-width:27px;}',
            '  .ys-csay.ys-guzel{padding:0 5px;} .ys-gara{margin:0 2px;}}',
            '@media (max-width:1100px) and (min-width:941px){#ysNotYazi{display:none;}}',
            /* ≤940: üstte başlık · geri/ileri/silgi/çöp · ☆ ⏲ PDF · tam ekran,
               küçült; altta kalınlık + hat kalemi · çizgi sayısı + güzel yazı */
            '@media (max-width:940px){.ys-arac{padding-right:12px; row-gap:6px;} .ys-ayrac,.ys-bos{display:none;}',
            '  .ys-pencere{position:static; order:2; margin-left:auto;}',
            '  .ys-t[data-is="notKaydet"],.ys-t[data-is="panel"],.ys-t[data-is="pdf"]{order:1;}',
            '  .ys-arac::after{content:""; order:3; flex-basis:100%; height:0;}',
            '  .ys-kgrup{order:4;} .ys-csec{order:5;}}',
            /* yandaki kalem sütunları (kâğıdın üstünde, ortada); dikeyde yalnız sağda */
            '.ys-yan{position:absolute; top:50%; transform:translateY(-50%); z-index:3; display:flex; flex-direction:column; gap:9px;',
            '  padding:9px; background:rgba(255,255,255,.78); border-radius:32px; box-shadow:0 8px 26px rgba(15,23,42,.16), 0 0 0 1px rgba(15,23,42,.06);',
            '  -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);}',
            '.ys-yan.sol{left:10px;} .ys-yan.sag{right:10px;}',
            '.ys-yan .ys-renk{width:46px; height:46px; min-width:46px; border:0; border-radius:50%; color:#fff; display:flex;',
            '  align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(15,23,42,.18); padding:0; cursor:pointer;',
            '  transition:transform .12s, box-shadow .12s;}',
            '.ys-yan .ys-renk svg{width:21px; height:21px; opacity:.92;}',
            '.ys-yan .ys-renk:hover{transform:scale(1.07);}',
            '.ys-yan .ys-renk.sec{box-shadow:0 0 0 3px #fff, 0 0 0 6px var(--rk); transform:scale(1.06);}',
            '.ys-yan .ys-t{width:46px; height:46px; min-width:46px; padding:0; border-radius:50%; background:#fff;',
            '  box-shadow:0 2px 6px rgba(15,23,42,.14);}',
            '.ys-yan .ys-t svg{width:23px; height:23px;}',
            '.ys-yan .ys-t.sec{background:#16A085; color:#fff;}',
            '.ys-yan .ys-ara{height:1px; background:rgba(15,23,42,.12); margin:1px 6px;}',
            /* sayfa çubuğu YUKARIDA ORTADA ("ileri geri okları daha büyük ve
               yukarda ortada olsun"): yarı saydam, oklar büyük */
            '.ys-sayfalar{position:absolute; left:50%; top:10px; transform:translateX(-50%); z-index:3; display:flex; align-items:center;',
            '  gap:6px; padding:6px 10px; background:rgba(255,255,255,.6); border-radius:999px; opacity:.78;',
            '  box-shadow:0 8px 24px rgba(15,23,42,.14), 0 0 0 1px rgba(15,23,42,.06); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);',
            '  transition:opacity .15s, background .15s;}',
            '#ysKutu.dikey .ys-sayfalar{left:calc(50% + 24px);}',
            '.ys-sayfalar:hover,.ys-sayfalar:focus-within{opacity:1; background:rgba(255,255,255,.92);}',
            '.ys-sayfalar .ys-t{width:50px; height:50px; min-width:50px; padding:0; border-radius:50%;}',
            '.ys-sayfalar .ys-t svg{width:26px; height:26px;}',
            '.ys-sayfalar .ys-ok{width:66px; height:66px; min-width:66px; color:#0E7C66;}',
            '.ys-sayfalar .ys-ok svg{width:40px; height:40px;}',
            '.ys-sayfalar .ys-ok:hover{background:#D6F0E9;}',
            '.ys-ok .ik-y,.ys-ok .ik-d{display:flex;} .ys-ok .ik-d{display:none;}',
            '#ysKutu.dikey .ys-ok .ik-d{display:flex;} #ysKutu.dikey .ys-ok .ik-y{display:none;}',
            /* dikeyde sıra: ▲ geri · sayfa · ▼ ileri */
            '#ysKutu.dikey .ys-sayfalar [data-is="saga"]{order:-2;} #ysKutu.dikey .ys-sayfalar .ys-sayfa{order:-1;}',
            '.ys-sayfalar .ys-sayfa{font-size:1.3rem; min-width:78px;}',
            /* düzenleme kutusu çubuğun başında (21.10.2026) */
            '.ys-sayfalar .ys-dgrup{display:inline-flex; align-items:center; gap:4px; order:-3;}',
            '.ys-sayfalar .ys-dgrup + .ys-ara{order:-3;}',           /* dikey kipte ▲ ve sayfa öne alınıyor; kutu hep en başta */
            '.ys-sayfalar .ys-dgrup .ys-t[data-is="silgi"].sec{background:#16A085; color:#fff;}',
            '.ys-sayfalar .ys-dgrup .ys-t[data-is="temizle"]:not([disabled]):hover{background:#FDEDEC; color:#C0392B;}',
            /* mutlak konumlu kutu, kalan alana sığmazsa tek satırı bölüyordu: genişlik içeriği kadar; yalnız dar ekranda sarar */
            '.ys-sayfalar{width:max-content; flex-wrap:wrap; justify-content:center; max-width:calc(100% - 16px); row-gap:4px;}',
            '.ys-sayfalar .ys-ara{width:1px; height:30px; background:rgba(15,23,42,.14); margin:0 3px;}',
            /* kaydırma yönü: dikey / yatay */
            '.ys-yon{display:inline-flex; gap:2px; padding:3px; background:rgba(15,23,42,.06); border-radius:999px;}',
            '.ys-yb{width:40px; height:40px; border:0; border-radius:50%; background:transparent; color:#3D4756; cursor:pointer; padding:0;',
            '  display:inline-flex; align-items:center; justify-content:center;}',
            '.ys-yb svg{width:22px; height:22px;}',
            '.ys-yb:hover{background:#E5EBF3;} .ys-yb.sec{background:#16A085; color:#fff;}',
            /* «Tüm sayfalar» görünümü */
            '.ys-genel{position:absolute; inset:0; z-index:6; background:rgba(238,241,245,.97); display:flex; flex-direction:column;',
            '  animation:ysSol .15s ease-out;}',
            '.ys-genel-bas{display:flex; align-items:center; gap:10px; padding:14px 18px 6px; flex:none;}',
            '.ys-genel-bas b{font-size:1.15rem; color:#2C3E50;} .ys-genel-bas small{color:#8A94A3; font-weight:700; font-size:.9rem;}',
            '.ys-genel-bas .ys-t{background:#fff; box-shadow:0 0 0 1px #DDE3EA; padding:0 14px;}',
            '.ys-genel-izgara{flex:1 1 auto; overflow:auto; padding:10px 18px 24px; display:grid;',
            '  grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:16px; align-content:start;}',
            '.ys-gkart{border:0; background:#fff; border-radius:12px; padding:8px; cursor:pointer; display:flex; flex-direction:column; gap:7px;',
            '  font-family:inherit; text-align:start; box-shadow:0 2px 10px rgba(15,23,42,.10), 0 0 0 1px #DDE3EA; transition:transform .12s, box-shadow .12s;}',
            '.ys-gkart:hover{transform:translateY(-2px); box-shadow:0 8px 22px rgba(15,23,42,.14), 0 0 0 1px #A9DCCF;}',
            '.ys-gkart canvas{width:100%; height:auto; aspect-ratio:16/10; border-radius:6px; display:block; background:#fff;}',
            '.ys-gkart span{font-weight:800; color:#3D4756; font-size:.92rem; padding:0 2px;}',
            '.ys-gkart.simdi{box-shadow:0 0 0 3px #16A085, 0 8px 22px rgba(22,160,133,.2);}',
            '.ys-gkart.simdi span{color:#0E7C66;}',
            '.ys-gkart.yeni{align-items:center; justify-content:center; color:#0E7C66; min-height:150px; background:rgba(255,255,255,.55);',
            '  box-shadow:inset 0 0 0 2px #B9E3D8;}',
            '.ys-gkart.yeni svg{width:36px; height:36px;}',
            '@media (max-width:760px){.ys-genel-izgara{grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:10px; padding:8px 10px 18px;}}',
            /* «Tüm sayfayı sil» sorusu */
            '.ys-silsor{position:absolute; z-index:7; background:#fff; border-radius:14px; padding:7px;',
            '  box-shadow:0 14px 34px rgba(15,23,42,.24), 0 0 0 1px rgba(15,23,42,.06); animation:ysSol .12s ease-out;}',
            '.ys-silsor button{border:0; background:#C0392B; color:#fff; border-radius:10px; padding:11px 16px; font-family:inherit;',
            '  font-weight:800; font-size:.95rem; display:flex; align-items:center; gap:8px; cursor:pointer; white-space:nowrap;}',
            '.ys-silsor button:hover{background:#A93226;}',
            '.ys-silsor svg{width:20px; height:20px;}',
            '.ys-sahne{position:relative; flex:1 1 auto; display:flex; align-items:center; justify-content:center; padding:0; min-height:0;}',
            '.ys-kagit{position:relative; background:#fff;}',
            '.ys-kagit canvas{position:absolute; inset:0; width:100%; height:100%;}',
            '.ys-kagit .ys-ust{touch-action:none; cursor:crosshair;}',
            /* çubuk düğmeleri: çift dokunuş gecikmesi yok (21.10.2026) */
            '.ys-arac button,.ys-yan button,.ys-sayfalar button{touch-action:manipulation;}',
            '.ys-kagit.silgi .ys-ust{cursor:none;}',
            '.ys-kagit.el .ys-ust{cursor:grab;} .ys-kagit.suruk .ys-ust{cursor:grabbing;}',
            '.ys-silgi-iz{position:absolute; pointer-events:none; border:2px solid rgba(22,160,133,.6); background:rgba(255,255,255,.35);',
            '  border-radius:50%; transform:translate(-50%,-50%); display:none;}',
            '.ys-kagit.silgi .ys-silgi-iz.gor{display:block;}',
            /* sayfa çubuğu yukarıda olduğu için öneri ve bildirimler aşağıda */
            '.ys-son{position:absolute; left:50%; bottom:16px; z-index:4; transform:translateX(-50%); background:#2C3E50; color:#fff; border-radius:999px;',
            '  padding:8px 8px 8px 16px; display:flex; align-items:center; gap:10px; font-size:.85rem; box-shadow:0 8px 22px rgba(0,0,0,.25);}',
            '.ys-son button{border:0; background:#fff; color:#2C3E50; border-radius:999px; padding:6px 13px; font-weight:800; cursor:pointer; font-family:inherit;}',
            '.ys-son .x{background:transparent; color:#fff; padding:6px 8px;}',
            '.ys-bildiri{position:absolute; left:50%; bottom:82px; transform:translateX(-50%); background:#16A085; color:#fff; padding:9px 18px;',
            '  border-radius:999px; font-weight:800; font-size:.88rem; box-shadow:0 8px 22px rgba(0,0,0,.2); z-index:5;',
            '  animation:ysBildiri 2.6s ease forwards; pointer-events:none;}',
            '.ys-bildiri.hata{background:#C0392B;}',
            '@keyframes ysBildiri{0%{opacity:0; transform:translate(-50%,8px)}10%{opacity:1; transform:translate(-50%,0)}85%{opacity:1}100%{opacity:0}}',
            /* yan panel */
            '.ys-panel{position:absolute; top:0; bottom:0; right:0; width:min(400px,92%); background:#fff; box-shadow:-12px 0 30px rgba(15,23,42,.18);',
            '  display:flex; flex-direction:column; transform:translateX(105%); transition:transform .25s cubic-bezier(.2,.9,.3,1); z-index:6;}',
            '.ys-panel.acik{transform:none;}',
            '.ys-panel-bas{display:flex; align-items:center; gap:6px; padding:12px; border-bottom:1px solid #E8EDF3;}',
            '.ys-sek{border:0; background:#F2F5F9; border-radius:999px; padding:8px 14px; font-weight:800; font-size:.85rem; cursor:pointer;',
            '  color:#55606D; font-family:inherit;}',
            '.ys-sek.sec{background:#16A085; color:#fff;}',
            '.ys-panel-ic{flex:1 1 auto; overflow:auto; padding:12px;}',
            '.ys-oge{display:flex; gap:11px; align-items:center; padding:9px; border:1px solid #E8EDF3; border-radius:12px; margin-bottom:9px;',
            '  cursor:pointer; transition:border-color .12s, box-shadow .12s; background:#fff;}',
            '.ys-oge:hover{border-color:#A9DCCF; box-shadow:0 6px 16px rgba(22,160,133,.1);}',
            '.ys-oge img,.ys-oge canvas{width:96px; height:60px; border-radius:6px; border:1px solid #E2E7EE; flex:none; background:#fff;}',
            '.ys-oge b{display:block; font-size:.88rem; color:#2C3E50;}',
            '.ys-oge span{display:block; font-size:.78rem; color:#8A94A3; margin-top:2px;}',
            '.ys-oge .ys-ogesil{margin-inline-start:auto; border:0; background:#FDEDEC; color:#C0392B; border-radius:8px; width:30px; height:30px;',
            '  cursor:pointer; flex:none; font-size:1rem;}',
            '.ys-oge.simdi{border-color:#16A085; background:#EEF8F5;}',
            '.ys-yok{color:#A3ADBA; font-size:.9rem; text-align:center; padding:26px 8px; line-height:1.6;}',
            '.ys-bilgi{font-size:.8rem; color:#8A94A3; margin:0 0 10px; line-height:1.5;}',
            /* soru penceresi */
            '.ys-soru-ort{position:absolute; inset:0; background:rgba(15,23,42,.35); display:flex; align-items:center; justify-content:center; z-index:8;}',
            '.ys-soru{background:#fff; border-radius:16px; padding:18px; width:min(400px,92%); box-shadow:0 20px 50px rgba(0,0,0,.25);}',
            '.ys-soru p{margin:0 0 12px; font-weight:700; line-height:1.5;}',
            '.ys-soru input{width:100%; box-sizing:border-box; border:1.5px solid #D5DCE5; border-radius:10px; padding:10px 12px; font-family:inherit;',
            '  font-size:.95rem; margin-bottom:12px;}',
            '.ys-soru .ys-tuslar{display:flex; gap:8px; justify-content:flex-end;}',
            '.ys-soru button{border:0; border-radius:10px; padding:9px 16px; font-weight:800; cursor:pointer; font-family:inherit;}',
            '.ys-soru .evet{background:#16A085; color:#fff;} .ys-soru .evet.kirmizi{background:#C0392B;}',
            '.ys-soru .hayir{background:#F1F4F9; color:#3D4756;}',
            /* telefonda araç çubuğu satırlara sarılır (küçült tuşu görünür kalsın) */
            '@media (max-width:760px){#ysOrt{padding:0;}',
            '  .ys-arac{gap:4px; padding:7px 8px;} .ys-baslik span,.ys-arac .ys-t span,.ys-cet{display:none;}',
            /* «— Küçült» telefonda da YAZILI (öğretmen: "simge halne küçültme tuşunu göremedim") */
            '  .ys-pencere{gap:4px;} .ys-arac .ys-t.kucult{padding:0 10px 0 7px;} .ys-arac .ys-t.kucult span{display:inline;}',
            '  .ys-t{min-width:32px; height:32px; padding:0 5px;} .ys-renk{width:26px; height:26px; min-width:26px;}',
            '  .ys-kal,.ys-mod{width:32px; height:30px; min-width:32px;} .ys-mod svg{width:26px; height:19px;}',
            '  .ys-yan{padding:4px; gap:5px;} .ys-yan.sol{left:3px;} .ys-yan.sag{right:3px;}',
            '  .ys-yan .ys-renk,.ys-yan .ys-t{width:30px; height:30px; min-width:30px;} .ys-yan .ys-renk svg,.ys-yan .ys-t svg{width:15px; height:15px;}',
            '  .ys-yan .ys-renk.sec{box-shadow:0 0 0 2px #fff, 0 0 0 4px var(--rk);}',
            '  .ys-sayfalar{top:6px; padding:4px 5px; gap:2px;} .ys-sayfalar .ys-t{width:34px; height:34px; min-width:34px;}',
            '  .ys-sayfalar .ys-t svg{width:19px; height:19px;}',
            '  .ys-sayfalar .ys-ok{width:44px; height:44px; min-width:44px;} .ys-sayfalar .ys-ok svg{width:28px; height:28px;}',
            '  .ys-sayfalar .ys-sayfa{font-size:.98rem; min-width:40px;} .ys-sayfalar .ys-ara{display:none;}',
            '  .ys-sayfalar .ys-dgrup{gap:2px;} .ys-sayfalar .ys-dgrup .ys-t{width:34px; height:34px; min-width:34px;}',
            '  .ys-sayfalar{max-width:calc(100% - 56px);}',          /* dikeyde +18 px kaydırılmış: sağ kenar taşmasın */
            '  .ys-yon{padding:2px;} .ys-yb{width:30px; height:30px;} .ys-yb svg{width:17px; height:17px;}',
            '  #ysKutu.dikey .ys-sayfalar{left:calc(50% + 18px);}',
            '  .ys-csay{min-width:26px; height:28px; font-size:.84rem; padding:0 3px;} .ys-csay.ys-guzel{padding:0 3px;}',
            '  .ys-kaydirma{padding:5px 8px 7px;} .ys-ray{height:28px;} .ys-tutamak{min-width:38px; font-size:.82rem;}',
            '  .ys-dray{left:4px; width:28px; top:6px; bottom:6px;}',
            '  .ys-tutamak::before,.ys-tutamak::after{margin:0 5px; height:10px;}',
            '  .ys-son{font-size:.78rem; max-width:92%;}}',
            /* dar telefon (≤440): iki satıra sığsın diye başlık simgesi ve «Tam ekran» yok
               (defter zaten tam ekran açılır) */
            '@media (max-width:440px){.ys-baslik,.ys-arac .ys-t[data-is="tamEkran"]{display:none;}}',
            '@media (max-width:370px){.ys-dgrup .ys-t{min-width:30px; padding:0 4px;} .ys-csay{min-width:24px; padding:0 2px;} .ys-kal{width:30px; min-width:30px;}}',
            /* küçültülünce sağ altta kalan simge: KIRMIZI zemin, BEYAZ defter
               ("simge dolgusu kırmızı svg beyaz olsun") ve yazı */
            '#ysPil{--pil:#E74C3C; position:fixed; right:16px; bottom:16px; z-index:99980; display:flex; align-items:center; gap:9px;',
            '  padding:9px 16px 9px 10px; border:0; border-radius:999px; background:var(--pil); color:#fff; cursor:pointer;',
            '  font-family:inherit; font-weight:800; font-size:.92rem; line-height:1.15; text-align:start;',
            '  box-shadow:0 10px 28px rgba(192,57,43,.38); animation:ysSol .18s ease-out;}',
            '#ysPil:hover{--pil:#C0392B;} #ysPil:focus-visible{outline:3px solid #F39C12; outline-offset:2px;}',
            '#ysPil.yigin{z-index:1001; right:25px; bottom:25px; box-shadow:0 8px 22px rgba(192,57,43,.42);}',
            '#ysPil[hidden]{display:none;}',
            '#ysPil i{display:flex; width:34px; height:34px; align-items:center; justify-content:center; flex:none;}',
            '#ysPil i svg{width:24px; height:24px;}',
            '#ysPil small{display:block; font-size:.72rem; font-weight:700; opacity:.9;}',
            /* canlanan defter: açık defter, sağ sayfaya kalem sağdan sola yazar,
               sol yaprak sağa çevrilir (4,8 sn, sürekli) */
            '#ysPil i.ys-pil-ikon{position:relative; width:48px; height:36px; border-radius:11px; overflow:visible;}',
            '#ysPil .pd{position:relative; width:38px; height:24px; perspective:64px;}',
            '#ysPil .pd-s{position:absolute; top:0; bottom:0; width:50%; box-sizing:border-box; border:1.6px solid #fff; background-color:transparent;',
            '  background-image:repeating-linear-gradient(to bottom, transparent 0 5.2px, rgba(255,255,255,.55) 5.2px 6.4px);}',
            '#ysPil .pd-sol{left:0; border-radius:4px 0 0 4px; border-right-width:.8px;}',
            '#ysPil .pd-sag{right:0; border-radius:0 4px 4px 0; border-left-width:.8px;}',
            '#ysPil .pd-yaprak{left:0; border-radius:4px 0 0 4px; border-right-width:.8px; transform-origin:100% 50%;',
            '  background-color:var(--pil); animation:pdCevir 4.8s ease-in-out infinite;}',
            '#ysPil .pd-yazi{position:absolute; left:1px; top:3.5px; width:15px; height:9px; overflow:visible;}',
            '#ysPil .pd-yazi path{fill:none; stroke:#fff; stroke-width:1.9; stroke-linecap:round; stroke-linejoin:round;',
            '  stroke-dasharray:40; stroke-dashoffset:0; animation:pdYaz 4.8s linear infinite;}',
            '#ysPil .pd-kalem{position:absolute; width:15px; height:15px; left:37px; top:4px; animation:pdKalem 4.8s ease-in-out infinite;',
            '  filter:drop-shadow(0 1px 1px rgba(0,0,0,.25));}',
            '@keyframes pdYaz{0%,10%{stroke-dashoffset:40}50%,100%{stroke-dashoffset:0}}',
            '@keyframes pdKalem{0%,10%{transform:translate(0,0); opacity:1}30%{transform:translate(-6px,1px)}50%{transform:translate(-12px,0); opacity:1}',
            '  58%{transform:translate(-12px,-6px); opacity:0}92%{transform:translate(0,-6px); opacity:0}100%{transform:translate(0,0); opacity:1}}',
            '@keyframes pdCevir{0%,58%{transform:rotateY(0deg)}80%,100%{transform:rotateY(180deg)}}',
            '@media (prefers-reduced-motion: reduce){#ysPil .pd-yaprak,#ysPil .pd-yazi path,#ysPil .pd-kalem{animation:none;}}',
            '@media print{#ysPil{display:none;}}',
            '@media (prefers-reduced-motion: reduce){#ysOrt,#ysKutu,.ys-bildiri,#ysPil{animation:none;} .ys-panel{transition:none;}}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------------------
       SİMGELER
       ------------------------------------------------------------------ */
    var IK = {
        kalem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 4.8l4 4L8.4 19.6 3.6 20.4l.8-4.8z"/><path d="M13.6 6.4l4 4"/></svg>',
        silgi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.6 20.4h11.6"/><path d="M5.2 15.4 14.8 5.8a2 2 0 0 1 2.8 0l2.6 2.6a2 2 0 0 1 0 2.8L12 19.4H8.8l-3.6-3.6a.3.3 0 0 1 0-.4z"/><path d="M9.6 11l5.2 5.2"/></svg>',
        geri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
        ileri: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>',
        temizle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
        onceki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
        sonraki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
        yeniSayfa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9 14h6"/></svg>',
        sayfaSil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14h6"/></svg>',
        yildiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z"/></svg>',
        saat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3 2"/></svg>',
        el: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="m7.5 8.5-3.5 3.5 3.5 3.5"/><path d="m16.5 8.5 3.5 3.5-3.5 3.5"/></svg>',
        izgara: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>',
        kucult: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5.5 17.5h13"/></svg>',
        ev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
        pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6"/><path d="m9.5 14.5 2.5 2.5 2.5-2.5"/></svg>',
        cizgiler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9.5h16M4 14h16M4 18.5h16"/><path d="M4 4.5h7" stroke-dasharray="1 2.6"/></svg>',
        tamEkran: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
        defter: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="8" width="40" height="48" rx="4" fill="#fff" stroke="#16A085" stroke-width="3"/>' +
            '<path d="M16 20h28M16 29h28M16 38h28M16 47h20" stroke="#C9D2DE" stroke-width="2.4" stroke-linecap="round"/>' +
            '<path d="M44 8v48" stroke="#F2A0A0" stroke-width="2"/>' +
            '<path d="M47 44 57 34l4 4-10 10-5.6 1.6z" fill="#F39C12" stroke="#B9650A" stroke-width="2" stroke-linejoin="round"/></svg>',
        /* hat kalemi: kamış gövde, eğik kesilmiş geniş uç */
        hatUc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M15 3.2l5.8 5.8-8.6 8.6-5.8-5.8z"/><path d="M6.4 11.8 3.2 20.8l9-3.2"/><path d="M5.3 18.7l2.1-2.1"/></svg>',
        /* güzel yazı defteri: üst, kesikli orta, kalın taban; tabanda bir be */
        guzel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M2.5 5h19" stroke-width="1.2" opacity=".55"/><path d="M2.5 10.5h19" stroke-width="1.2" stroke-dasharray="2 2.2"/>' +
            '<path d="M2.5 15.5h19" stroke-width="2.4"/><path d="M17.5 11.6c0 2.6-1.8 3.9-5.5 3.9s-5.5-1.2-5.5-3.4" stroke-width="2"/>' +
            '<circle cx="12" cy="19.4" r="1.2" fill="currentColor" stroke="none"/></svg>',
        yukari: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',
        asagi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
        /* kaydırma yönü: sayfalar alt alta / yan yana */
        dikey: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="6" y="2.8" width="12" height="8" rx="1.6"/><rect x="6" y="13.2" width="12" height="8" rx="1.6"/></svg>',
        yatay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="2.8" y="6" width="8" height="12" rx="1.6"/><rect x="13.2" y="6" width="8" height="12" rx="1.6"/></svg>'

    };
    function modSvg(id) {
        var c = '#9AA4B2', s = '<svg viewBox="0 0 30 22" aria-hidden="true"><rect x="1" y="1" width="28" height="20" rx="3" fill="#fff" stroke="#C5CDD8"/>';
        if (id === 'c') s += '<path d="M4 7h22M4 11h22M4 15h22" stroke="' + c + '" stroke-width="1.2"/>';
        else if (id === 'b') s += '<path d="M4 4.5h22" stroke="#C9D0DA"/><path d="M4 10h22" stroke="#B9C1CC" stroke-dasharray="2 2"/><path d="M4 13.5h22" stroke="#6E7A89" stroke-width="1.5"/><path d="M4 18h22" stroke="#C9D0DA"/>';
        else if (id === 'k') s += '<path d="M4 3.5h22M4 9.5h22M4 12.5h22M4 17.5h22" stroke="#C9D0DA" stroke-width=".9"/><path d="M4 6.2h22M4 15.3h22" stroke="#6E7A89" stroke-width="1.2"/>';
        return s + '</svg>';
    }

    /* ------------------------------------------------------------------
       AÇIK DEFTER VE ARAYÜZ
       ------------------------------------------------------------------ */
    var D = null;        /* { id, sinif, sube, tarih, guncelleme, sayfalar, aktif, notId, notAd, kirli } */
    var T = null;        /* araç durumu { arac, renk, kal } */
    var UI = null;       /* öğeler */
    var _otoKayit = null, _gozBoyut = null, _govdeTasma = '';

    function ac(sinif, kaynak, kucukBasla) {
        sinif = String(sinif || '');
        if (!sinif) return;
        if (!ogretmenMi()) return;
        stilKur();
        kapat(true);
        var t = tercihOku();
        T = { arac: 'kalem', renk: (t.renk >= 0 && t.renk < 5) ? t.renk : 0, kal: t.kal || 'o', mod: t.mod || 'c',
              cizgi: tercihCizgi(t.cizgi), yon: t.yon === 'y' ? 'y' : 'd', uc: t.uc === 'h' ? 'h' : 'y' };
        D = kaynak || { id: yeniId(), sinif: sinif, sube: BAGLI ? BAGLI.sube : subeAdi(), tarih: Date.now(), guncelleme: 0,
                        sayfalar: [yeniSayfa('c')], aktif: 0, notId: '', notAd: '', kirli: false, pw: W, ph: A4_BOY,
                        cizgi: T.cizgi, ust: UST_BOSLUK };
        defterHazirla(D);
        kur(kucukBasla);
        cizimAyarla();
        if (!kaynak) { if (kucukBasla) UI.oneriBekle = true; else sonDefterOnerisi(); }
    }

    function kur(kucuk) {
        var ort = document.createElement('div');
        ort.id = 'ysOrt';
        if (kucuk) ort.classList.add('kucuk');
        /* kalem düğmesinde iki simge: yuvarlak uç / hat kalemi (seçime göre biri görünür) */
        var kalemler = RENKLER.map(function (r, i) {
            return '<button type="button" class="ys-renk" data-renk="' + i + '" style="background:' + r.k + '; --rk:' + r.k + '" title="' +
                   esc(r.ad) + ' kalem (' + (i + 1) + ')" aria-label="' + esc(r.ad) + ' kalem">' +
                   '<span class="ik-k">' + IK.kalem + '</span><span class="ik-h">' + IK.hatUc + '</span></button>';
        }).join('');
        /* yanlarda yalnız kalemler; silgi üstte, geri al / yinele'nin yanında
           (20.10.2026, öğretmen: "silgi geri ileri tuşunun olduğu yerde olsun") */
        var yan = function (taraf) {
            return '<div class="ys-yan ' + taraf + '" aria-label="Kalemler">' + kalemler + '</div>';
        };
        var kalin = KALINLIK.map(function (k, i) {
            var r = [6, 10, 15][i];
            return '<button type="button" class="ys-kal" data-kal="' + k.id + '" title="' + esc(k.ad) + ' kalem"><i style="width:' + r + 'px;height:' + r + 'px"></i></button>';
        }).join('');
        var csay = CIZGI_SECENEK.map(function (cn) {
            return '<button type="button" class="ys-csay" data-cizgi="' + cn + '" aria-pressed="false" title="' + cn +
                   ' yatay çizgi" aria-label="' + cn + ' yatay çizgi">' + cn + '</button>';
        }).join('');
        ort.innerHTML =
            '<div id="ysKutu" role="dialog" aria-modal="true" aria-label="Defter">' +
              '<div class="ys-arac">' +
                '<div class="ys-baslik">' + IK.defter + '<span>Defter<small>' + esc(etiket()) + '</small></span></div>' +
                '<div class="ys-grup ys-kgrup" role="group" aria-label="Kalınlık ve hat kalemi">' + kalin +
                  '<span class="ys-gara"></span>' +
                  '<button type="button" class="ys-t ys-hat" data-is="hat" aria-pressed="false" title="Hat kalemi — eğik uçlu kalem: yatayda kalın, dikeyde ince yazar">' +
                    IK.hatUc + '<span>Hat kalemi</span></button>' +
                '</div>' +
                '<div class="ys-ayrac"></div>' +
                '<div class="ys-grup ys-csec" role="group" aria-label="Çizgi sayısı ya da güzel yazı defteri" title="Yatay çizgi sayısı ya da Arapça güzel yazı defteri">' +
                  '<span class="ys-cet">' + IK.cizgiler + '<span>Çizgi</span></span>' + csay +
                  '<span class="ys-gara"></span>' +
                  '<button type="button" class="ys-csay ys-guzel" data-cizgi="g" aria-pressed="false" title="Arapça güzel yazı defteri — 3 satır, yardımcı çizgili">' +
                    IK.guzel + '<span>Güzel yazı</span></button>' +
                '</div>' +
                '<span class="ys-bos"></span>' +
                '<button type="button" class="ys-t ana" data-is="notKaydet" title="Bu defteri seviye notlarına kaydet">' + IK.yildiz +
                  '<span id="ysNotYazi">Seviye notlarına kaydet</span></button>' +
                '<button type="button" class="ys-t" data-is="panel" title="Geçmiş ve seviye notları">' + IK.saat + '<span>Geçmiş</span></button>' +
                '<button type="button" class="ys-t" data-is="pdf" title="PDF olarak indir — bütün sayfalar">' + IK.pdf + '<span>PDF</span></button>' +
                '<div class="ys-pencere">' +
                '<button type="button" class="ys-t" data-is="tamEkran" title="Tam ekran">' + IK.tamEkran + '<span>Tam ekran</span></button>' +
                (TEK
                  ? '<a class="ys-t kucult ys-ana" href="index.html" data-is="anasayfa" title="Kidef Arapça ana sayfasına git" aria-label="Ana sayfaya git">' +
                      IK.ev + '<span>Ana sayfa</span></a>'
                  : '<button type="button" class="ys-t kucult" data-is="kucult" title="Simge durumuna küçült (Esc) — sınıf açık kaldıkça sağ altta durur" aria-label="Simge durumuna küçült">' +
                      IK.kucult + '<span>Küçült</span></button>') +
                '</div>' +
              '</div>' +
              '<div class="ys-sahne" id="ysSahne">' +
                '<div class="ys-kagit" id="ysKagit">' +
                  '<canvas class="ys-alt"></canvas><canvas class="ys-ust"></canvas>' +
                  '<div class="ys-silgi-iz"></div>' +
                '</div>' +
                /* dikey kipte kalın kaydırma çubuğu solda ("dikeyde solda olsun scroll çubuğu") */
                '<div class="ys-dray" id="ysRayD" role="scrollbar" aria-orientation="vertical" aria-controls="ysKagit"' +
                  ' aria-label="Sayfalar arasında kaydır" aria-valuemin="1" aria-valuemax="1" aria-valuenow="1"' +
                  ' title="Sürükle ya da bir sayfaya bas — 1. sayfa üstte">' +
                  '<div class="ys-ray-sayfalar"></div>' +
                  '<div class="ys-tutamak" id="ysTutamakD"><b>1</b></div>' +
                '</div>' +
                yan('sol') + yan('sag') +
                /* [geri al · yinele · silgi · çöp] YUKARIDA ORTADA (21.10.2026, öğretmen:
                   "defterde ileri geri tuşu ve silgi konteynırı yukarda ortada olsun"):
                   sayfa çubuğunun başında, aynı kutuda */
                '<div class="ys-sayfalar" aria-label="Sayfalar ve düzenleme">' +
                  '<span class="ys-dgrup" role="group" aria-label="Düzenleme">' +
                    '<button type="button" class="ys-t" data-is="geri" title="Geri al (Ctrl+Z)" aria-label="Geri al">' + IK.geri + '</button>' +
                    '<button type="button" class="ys-t" data-is="ileri" title="Yinele (Ctrl+Y)" aria-label="Yinele">' + IK.ileri + '</button>' +
                    '<button type="button" class="ys-t" data-is="silgi" title="Silgi (S) — seçiliyken bir daha basınca: Tüm sayfayı sil" aria-label="Silgi">' +
                      IK.silgi + '</button>' +
                    '<button type="button" class="ys-t" data-is="temizle" title="Sayfayı sil" aria-label="Sayfayı sil">' + IK.temizle + '</button>' +
                  '</span>' +
                  '<span class="ys-ara"></span>' +
                  '<button type="button" class="ys-t ys-ok" data-is="sola" title="İleri — sonraki sayfa; son sayfadaysa yeni sayfa" aria-label="İleri — sonraki sayfa">' +
                    '<span class="ik-y">' + IK.onceki + '</span><span class="ik-d">' + IK.asagi + '</span></button>' +
                  '<span class="ys-sayfa" id="ysSayfa">1 / 1</span>' +
                  '<button type="button" class="ys-t ys-ok" data-is="saga" title="Geri — önceki sayfa" aria-label="Geri — önceki sayfa">' +
                    '<span class="ik-y">' + IK.sonraki + '</span><span class="ik-d">' + IK.yukari + '</span></button>' +
                  '<span class="ys-ara"></span>' +
                  '<button type="button" class="ys-t" data-is="tumSayfalar" title="Tüm sayfalar">' + IK.izgara + '</button>' +
                  '<button type="button" class="ys-t" data-is="yeniSayfa" title="Yeni sayfa — açık sayfadan hemen sonra">' + IK.yeniSayfa + '</button>' +
                  '<button type="button" class="ys-t" data-is="sayfaSil" title="Bu sayfayı kaldır">' + IK.sayfaSil + '</button>' +
                  '<span class="ys-ara"></span>' +
                  '<span class="ys-yon" role="group" aria-label="Kaydırma yönü">' +
                    '<button type="button" class="ys-yb" data-yon="d" aria-pressed="false" title="Dikey kaydırma — sayfalar alt alta">' + IK.dikey + '</button>' +
                    '<button type="button" class="ys-yb" data-yon="y" aria-pressed="false" title="Yatay kaydırma — sayfalar sağdan sola">' + IK.yatay + '</button>' +
                  '</span>' +
                '</div>' +
              '</div>' +
              '<div class="ys-kaydirma" id="ysKaydirma">' +
                '<div class="ys-ray" id="ysRay" role="scrollbar" aria-orientation="horizontal" aria-controls="ysKagit"' +
                  ' aria-label="Sayfalar arasında kaydır" aria-valuemin="1" aria-valuemax="1" aria-valuenow="1"' +
                  ' title="Sürükle ya da bir sayfaya bas — 1. sayfa sağda">' +
                  '<div class="ys-ray-sayfalar"></div>' +
                  '<div class="ys-tutamak" id="ysTutamak"><b>1</b></div>' +
                '</div>' +
              '</div>' +
              '<aside class="ys-panel" id="ysPanel" aria-label="Geçmiş ve seviye notları">' +
                '<div class="ys-panel-bas">' +
                  '<button type="button" class="ys-sek sec" data-sek="gecmis">Geçmiş (bu tarayıcı)</button>' +
                  '<button type="button" class="ys-sek" data-sek="notlar">Seviye notları</button>' +
                  '<span class="ys-bos"></span>' +
                  '<button type="button" class="ys-t kapat" data-is="panelKapat" title="Paneli kapat">&times;</button>' +
                '</div>' +
                '<div class="ys-panel-ic" id="ysPanelIc"></div>' +
              '</aside>' +
            '</div>';
        document.body.appendChild(ort);
        if (!kucuk) {
            _govdeTasma = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }
        var kagit = ort.querySelector('#ysKagit');
        UI = {
            ort: ort, kutu: ort.querySelector('#ysKutu'), sahne: ort.querySelector('#ysSahne'), kagit: kagit,
            alt: kagit.querySelector('.ys-alt'), ust: kagit.querySelector('.ys-ust'),
            iz: kagit.querySelector('.ys-silgi-iz'),
            sayfa: ort.querySelector('#ysSayfa'), panel: ort.querySelector('#ysPanel'), panelIc: ort.querySelector('#ysPanelIc'),
            sek: 'gecmis', olcek: 1, dpr: 1, kucuk: !!kucuk,
            ray: ort.querySelector('#ysRay'), tutamak: ort.querySelector('#ysTutamak'),
            raySayfa: ort.querySelector('#ysRay .ys-ray-sayfalar'),
            rayD: ort.querySelector('#ysRayD'), tutamakD: ort.querySelector('#ysTutamakD'),
            raySayfaD: ort.querySelector('#ysRayD .ys-ray-sayfalar'), rayAnahtar: '',
            dikey: T.yon !== 'y'
        };
        UI.kutu.classList.toggle('dikey', UI.dikey);
        ort.addEventListener('click', tikla);
        ort.addEventListener('pointerdown', hizliSec);
        ort.addEventListener('pointerdown', tapBas);
        ort.addEventListener('pointerup', tapBirak);
        ort.addEventListener('pointercancel', function () { _tap = null; });
        ort.addEventListener('contextmenu', function (e) { if (hizliHedef(e.target) || (UI && e.target === UI.ust)) e.preventDefault(); });
        UI.sahne.addEventListener('wheel', tekerlek, { passive: false });
        ort.querySelector('#ysKaydirma').addEventListener('wheel', tekerlek, { passive: false });
        [UI.ray, UI.rayD].forEach(function (r) {
            r.addEventListener('pointerdown', rayBas);
            r.addEventListener('pointermove', rayOynat);
            r.addEventListener('pointerup', rayBirak);
            r.addEventListener('pointercancel', rayBirak);
            r.addEventListener('lostpointercapture', rayBirak);
        });
        UI.ust.addEventListener('pointerdown', kalemBas);
        UI.ust.addEventListener('pointermove', kalemOynat);
        UI.ust.addEventListener('pointerup', kalemBirak);
        UI.ust.addEventListener('pointercancel', kalemBirak);
        UI.ust.addEventListener('pointerleave', function () { UI.iz.classList.remove('gor'); });
        document.addEventListener('keydown', tus, true);
        window.addEventListener('resize', boyutErtele);
        if (window.ResizeObserver) { _gozBoyut = new ResizeObserver(boyutErtele); _gozBoyut.observe(UI.sahne); }
        window.addEventListener('pagehide', sessizKaydet);
        document.addEventListener('visibilitychange', gorunurlukDegisti);
        _otoKayit = setInterval(function () { if (D && D.kirli) sessizKaydet(); }, 20000);
        aracGuncelle();
        if (kucuk) pilGoster();
    }

    /* KÜÇÜLT — sınıf açık kaldıkça pencere kapanmaz, sağ alta iner.
       Yazılan o ana kadar tarihiyle kaydedilir (sekme kapanırsa kaybolmasın). */
    function kucult() {
        if (!UI || UI.kucuk || TEK) return;
        fsCik();
        var so = UI.ort.querySelector('.ys-soru-ort'); if (so) so.remove();
        silSorKapat();
        genelKapat();
        UI.panel.classList.remove('acik');
        if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet();
        UI.kucuk = true;
        UI.ort.classList.add('kucuk');
        document.body.style.overflow = _govdeTasma || '';
        pilGoster();
    }
    function buyut() {
        if (!UI || !UI.kucuk) return;
        UI.kucuk = false;
        UI.ort.classList.remove('kucuk');
        pilKaldir();
        _govdeTasma = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        tamEkranAc();               /* öğretmen: "defter popup ı tam ekran açılsın" */
        cizimAyarla();
        if (UI.oneriBekle) { UI.oneriBekle = false; sonDefterOnerisi(); }
    }
    /* ANA SAYFADA DEFTER PİLİ — SARF MOTORU'NUN ALTINDA (21.10.2026, öğretmen:
       "defter popup ı index te sarf motorunun altında da olsun"): pil artık
       yalnız sınıf açıkken değil, öğretmen/yönetici girişliyken HEP durur.
       Sarf Motoru'nun bulunduğu yüzen yığının en altına oturur; Sarf Motoru,
       Kamus ve İletişim onun üstüne kayar (index'teki positionFeedbackFab).
       Sınıf açıksa o sınıfın defterini, değilse «Genel defter»i ayrı sekmede
       açar. Sayfa ayrı defter sekmesiyse (TEK) pil yok. */
    function sarfDugmesi() { return document.querySelector('.floating-tool-button.kaliplar-tablosu-btn'); }
    function yiginPili() { return !TEK && !!sarfDugmesi(); }
    function pilEtiketi() {
        if (BAGLI) return sinifAdi(BAGLI.sinif) + (BAGLI.sube ? ' · ' + BAGLI.sube : '');
        if (D && !TEK) return etiket();
        return 'Genel defter';
    }
    function pilYerlestir() {
        var sarf = sarfDugmesi(), b = document.getElementById('ysPil');
        if (!sarf) return;
        var acik = !!(b && !b.hidden && b.classList.contains('yigin'));
        sarf.style.bottom = '';                                   /* biçem dosyasındaki taban (ekran boyuna göre) */
        if (acik) {
            var st = getComputedStyle(sarf), taban = parseFloat(st.bottom) || 25;
            b.style.bottom = taban + 'px'; b.style.right = st.right;
            sarf.style.bottom = (taban + b.offsetHeight + 10) + 'px';
        }
        try { if (typeof window.positionFeedbackFab === 'function') window.positionFeedbackFab(); } catch (e) { }
    }
    function anaSayfadaMi() {
        var h = document.getElementById('home-hub-section');
        return !!(h && getComputedStyle(h).display !== 'none');
    }
    var _pilSonDurum = '';
    function pilDenetle() {
        if (!yiginPili()) return;
        var gor = ogretmenMi() && (anaSayfadaMi() || !!BAGLI) && !(UI && !UI.kucuk);
        var b = document.getElementById('ysPil');
        if (gor && !b) { pilGoster(); b = document.getElementById('ysPil'); }
        if (!b) return;
        var durum = (gor ? '1' : '0') + '|' + pilEtiketi() + '|' + window.innerWidth + 'x' + window.innerHeight;
        if (durum === _pilSonDurum) return;
        _pilSonDurum = durum;
        b.hidden = !gor;
        var et = b.querySelector('small'); if (et) et.textContent = pilEtiketi();
        b.setAttribute('aria-label', 'Defter — aç · ' + pilEtiketi());
        pilYerlestir();
    }
    window.addEventListener('resize', function () { _pilSonDurum = ''; });
    setInterval(pilDenetle, 500);
    function pilGoster() {
        if (yiginPili() && document.getElementById('ysPil')) { _pilSonDurum = ''; pilDenetle(); return; }
        pilKaldir();
        stilKur();                                   /* pil defter açılmadan da kurulabiliyor (yığın) */
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'ysPil';
        if (yiginPili()) b.classList.add('yigin');
        b.title = 'Defter — aç';
        b.setAttribute('aria-label', 'Defter — aç · ' + pilEtiketi());
        /* canlanan defter (20.10.2026, öğretmen: "aşağıdaki defter popup
           kısmında sayfa çevirme ve yazma animasyonu olsun"): kalem sağdan
           sola bir satır yazar, soldaki yaprak sağa çevrilir, baştan. Kırmızı
           zeminde BEYAZ ("simge dolgusu kırmızı svg beyaz olsun") */
        b.innerHTML = '<i class="ys-pil-ikon" aria-hidden="true"><span class="pd">' +
            '<span class="pd-s pd-sol"></span>' +
            '<span class="pd-s pd-sag"><svg class="pd-yazi" viewBox="0 0 20 12"><path d="M18.4 7.2c-1.6-3.4-3.4 1.6-5.2-.6s-2.6-2.6-4.4.2-3.4 0-5.6-1"/></svg></span>' +
            '<span class="pd-s pd-yaprak"></span></span>' +
            '<svg class="pd-kalem" viewBox="0 0 24 24"><path d="M15.2 4.8l4 4L8.4 19.6 3.6 20.4l.8-4.8z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.8" stroke-linejoin="round"/>' +
            '<path d="M13.6 6.4l4 4" stroke="#C0392B" stroke-width="1.8"/></svg></i>' +
            '<span>Defter<small>' + esc(pilEtiketi()) + '</small></span>';
        b.addEventListener('click', ayriSekmedeAc);
        document.body.appendChild(b);
        if (yiginPili()) { _pilSonDurum = ''; pilDenetle(); }
    }
    /* yığın pili kaldırılmaz, yalnız gizlenir (defter sayfanın üstünde büyükken); ötekiler eskisi gibi silinir */
    function pilKaldir() {
        var b = document.getElementById('ysPil');
        if (!b) return;
        if (b.classList.contains('yigin') && yiginPili()) { b.hidden = true; _pilSonDurum = ''; pilYerlestir(); return; }
        b.remove();
    }
    /* AYRI SEKME (21.10.2026, öğretmen: "defter ayrı sekmede ve tam ekran
       olarak aç"): simgeye basınca defter.html adlı bir sekmede açılır (bir
       daha basınca aynı sekme öne gelir). Tahta kabuğunun çerçevesindeyken
       aynı çerçevede açılır ki kabuk tam ekranda kalsın. Açılır pencere
       engellenirse eski yol: sayfanın üstünde büyür. */
    function defterAdresi(b) {
        var q = [];
        q.push('sinif=' + encodeURIComponent(b.sinif || ''));
        if (b.sube) q.push('sube=' + encodeURIComponent(b.sube));
        if (b.seviyeAd) q.push('seviye=' + encodeURIComponent(b.seviyeAd));
        return 'defter.html?' + q.join('&');
    }
    function kabuktaMi() {
        try { return window.name === 'kidefTahta' || (window.parent !== window && !!window.parent.KidefTahta); }
        catch (e) { return window.name === 'kidefTahta'; }
    }
    function ayriSekmedeAc() {
        var b = BAGLI || (D && !TEK ? { sinif: D.sinif, sube: D.sube, seviyeAd: '' } : null) ||
                { sinif: 'genel', sube: '', seviyeAd: 'Genel defter' };      /* sınıf açık değil: genel defter */
        if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet();     /* yeni sekme kaldığı yerden sürsün */
        var url = defterAdresi(b);
        if (kabuktaMi()) { location.href = url; return; }
        var w = null;
        try { w = window.open(url, 'kidefDefter'); } catch (e) { w = null; }
        if (!w) { buyut(); return; }
        try { w.focus(); } catch (e) { }
    }
    function sinifAdi(s) {
        s = String(s == null ? '' : s);
        if (/^\d+$/.test(s)) return s + '. sınıf';
        return (BAGLI && BAGLI.sinif === s && BAGLI.seviyeAd) ? BAGLI.seviyeAd : s;
    }
    function etiket() {
        if (!D) return '';
        var a = sinifAdi(D.sinif);
        return D.sube ? a + ' · ' + D.sube : a;
    }

    /* tekerlek ve dokunmatik yüzey kâğıdı kaydırır: dikeyde aşağı = ileri;
       yatayda aşağı/sola = ileri (sola) */
    function tekerlek(e) {
        if (!UI || !D || UI.kucuk || UI.genel) return;
        var dx = e.deltaX || 0, dy = e.deltaY || 0, dik = dikeyMi();
        var d = dik ? -(Math.abs(dy) >= Math.abs(dx) ? dy : dx) : (Math.abs(dx) > Math.abs(dy) ? dx : -dy);
        if (!d) return;
        e.preventDefault();
        var k = e.deltaMode === 1 ? 18 : (e.deltaMode === 2 ? (dik ? UI.sahne.clientHeight : UI.sahne.clientWidth) : 1);
        kaydirBy(d * k / UI.cssOlcek);
    }

    function kapat(sessiz) {
        var ort = document.getElementById('ysOrt');
        if (!ort) return;
        if (D && !bosMu(D.sayfalar) && D.kirli) gecmiseKaydet();
        fsCik();
        clearInterval(_otoKayit); _otoKayit = null;
        if (_gozBoyut) { try { _gozBoyut.disconnect(); } catch (e) { } _gozBoyut = null; }
        document.removeEventListener('keydown', tus, true);
        window.removeEventListener('resize', boyutErtele);
        window.removeEventListener('pagehide', sessizKaydet);
        document.removeEventListener('visibilitychange', gorunurlukDegisti);
        var kucuktu = UI && UI.kucuk;
        if (UI && UI.anim) cancelAnimationFrame(UI.anim);
        _cz = null; _kay = null; _dok = {}; _ray = null;
        ort.remove();
        pilKaldir();
        if (!kucuktu) document.body.style.overflow = _govdeTasma || '';
        UI = null; D = null;
    }
    function gorunurlukDegisti() { if (document.visibilityState === 'hidden') sessizKaydet(); }
    function sessizKaydet() { if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet(); }

    /* Kapanınca (ya da arada bir) tarayıcı geçmişine — yazıldığı tarihle */
    function gecmiseKaydet() {
        if (!D) return Promise.resolve();
        var simdi = Date.now();
        D.guncelleme = simdi;
        D.kirli = false;
        var sy = kayitSayfalari(D.sayfalar);
        var kayit = {
            id: D.id, sinif: D.sinif, sube: D.sube || '', tarih: D.tarih || simdi, guncelleme: simdi,
            sayfa: sy.length, kod: defterKodla(sy, D.pw, cizgiDuzeni()),
            onizleme: onizlemeUrl(sy[0]), notId: D.notId || ''
        };
        return gecmisKoy(kayit);
    }

    /* ---------------- tuval boyu ---------------- */
    var _boyutZ = null;
    function boyutErtele() { clearTimeout(_boyutZ); _boyutZ = setTimeout(cizimAyarla, 60); }
    /* İKİ KİP (20.10.2026, öğretmen: "defterde dikey kaydırma olsun, ve bu
       varsayılan olsun isteyenler yatay kaydırmalı şekilde kullanabilsin"):
       · DİKEY (öntanımlı): sayfalar yukarıdan aşağı; pencere sayfanın bütün
         enini gösterir ve aşağı kayar. j. sayfa y = j·H'den başlar. Pencere:
         üstü UI.cy, boyu UI.Lh (birim).
       · YATAY: sayfalar sağdan sola tek kâğıt (eskisi). 1. sayfa
         [500 - pw/2, 500 + pw/2]; j. sayfa pw kadar solunda; sağ uç SAG().
         Pencere: ortası UI.c, eni UI.Lw; boyu hep 625.
       Bir çizginin noktaları İKİ KİPTE DE kendi sayfasının yerel
       koordinatındadır (x: 500 - pw/2 … 500 + pw/2, y: 0 … 625): kip değişince
       defter aynen kalır. Ortak dil: «ileri» sonraki sayfalara doğru (yatayda
       sola, dikeyde aşağı); kaydirBy(d): d > 0 1. sayfaya doğru, d < 0 ileri.
       DİKEYDE ÜST PAY (UI.ustPay): sayfa çubuğu kâğıdın üstünde durur; bir
       sayfaya gidilince sayfanın başı çubuğun ALTINDA görünür (1. sayfanın
       üstünde o kadar gri pay kalır), yazı çubuğun altında kalmaz. */
    function dikeyMi() { return !!(UI && UI.dikey); }
    function SAG() { return W / 2 + D.pw / 2; }
    function SOLX() { return W / 2 - D.pw / 2; }
    function enCokC() { return SAG() - UI.Lw / 2; }
    function enAzC() { return Math.min(SAG() - D.sayfalar.length * D.pw + UI.Lw / 2, enCokC()); }
    function sinirli(c) { return Math.max(enAzC(), Math.min(enCokC(), c)); }
    /* dikeyde en yukarı: 1. sayfanın başı çubuğun altında; en aşağı: son
       sayfanın sonu pencerenin altında — pencere bir sayfadan uzunsa
       (telefon, dikey tablet) son sayfanın başı çubuğun altında */
    function enAzY() { return -(UI.ustPay || 0); }
    function enCokY() { var n = D.sayfalar.length, p = UI.ustPay || 0, ph = sayfaYuk(); return Math.max(-p, (n - 1) * ph - p, n * ph - UI.Lh); }
    function sinirliY(y) { return Math.max(enAzY(), Math.min(enCokY(), y)); }
    function defterHazirla(d) {
        if (!d.pw) d.pw = (d.sayfalar && d.sayfalar.pw) || W;
        if (!d.ph) d.ph = (d.sayfalar && d.sayfalar.ph) || H;
        if (d.cizgi !== 'g' && !(d.cizgi >= CIZGI_EN_AZ && d.cizgi <= CIZGI_EN_COK)) {
            var sc = d.sayfalar && d.sayfalar.cizgi;
            d.cizgi = sc === 'g' ? 'g' : cizgiSayisi(sc);
        }
        if (d.ust == null) d.ust = (d.sayfalar && d.sayfalar.ust != null) ? d.sayfalar.ust : UST_BOSLUK;
        d.geri = d.geri || []; d.ileri = d.ileri || [];
        d.sayfalar.forEach(function (sy) { sy.mod = 'c'; });
        d.aktif = Math.max(0, Math.min(d.aktif || 0, d.sayfalar.length - 1));
        return d;
    }
    function cizimAyarla() {
        if (!UI || !D) return;
        var sw = UI.sahne.clientWidth, sh = UI.sahne.clientHeight;
        if (!sw || !sh) return;                                          /* küçükken (gizli) */
        var dik = dikeyMi();
        /* dikeyde soldaki kaydırma çubuğunun yeri ayrılır, kâğıt sağa yaslanır */
        var serit = dik && UI.rayD ? UI.rayD.offsetLeft + UI.rayD.offsetWidth + 6 : 0;
        /* clientWidth: açılış canlandırması (scale) ölçüyü küçültmesin */
        var gw = Math.max(200, sw - serit), gh = Math.max(140, sh);
        UI.kagit.style.width = gw + 'px';
        UI.kagit.style.height = gh + 'px';
        var dpr = Math.min(3, window.devicePixelRatio || 1);
        [UI.alt, UI.ust].forEach(function (c) {
            c.width = Math.round(gw * dpr); c.height = Math.round(gh * dpr);
        });
        UI.dpr = dpr;
        if (dik) {
            UI.Lw = D.pw;                           /* sayfanın bütün eni */
            UI.cssOlcek = gw / UI.Lw;
            UI.Lh = gh / UI.cssOlcek;
            var sc = UI.ort.querySelector('.ys-sayfalar');
            UI.ustPay = sc ? Math.min(UI.Lh * 0.4, Math.max(0, (sc.offsetTop + sc.offsetHeight + 8) / UI.cssOlcek)) : 0;
        } else {
            UI.Lw = sayfaYuk() * gw / gh;
            UI.cssOlcek = gw / UI.Lw;
            UI.Lh = sayfaYuk();
            UI.ustPay = 0;
        }
        UI.olcek = UI.cssOlcek * dpr;
        UI.iz.style.width = UI.iz.style.height = (SILGI_W * UI.cssOlcek) + 'px';
        if (dik) {
            if (UI.cy == null) UI.cy = D.aktif * sayfaYuk() - UI.ustPay;   /* sayfanın başı çubuğun altında */
            UI.cy = sinirliY(UI.cy);
        } else {
            /* Arapça sağdan yazılır: pencerenin sağ ucu sayfanın sağ ucuna oturur */
            if (UI.c == null) UI.c = SAG() - D.aktif * D.pw - UI.Lw / 2;
            UI.c = sinirli(UI.c);
        }
        kaydirUygula();
    }
    function kaydirUygula() {
        var n = D.sayfalar.length;
        if (dikeyMi()) {
            UI.vx0 = SOLX(); UI.vx1 = SOLX() + D.pw;
            UI.vy0 = UI.cy; UI.vy1 = UI.cy + UI.Lh;
            var up = UI.ustPay || 0;
            var phk = sayfaYuk();
            D.aktif = Math.max(0, Math.min(n - 1, Math.floor((UI.cy + up + Math.min(UI.Lh - up, phk) / 2) / phk)));
        } else {
            UI.vx0 = UI.c - UI.Lw / 2; UI.vx1 = UI.c + UI.Lw / 2;
            UI.vy0 = 0; UI.vy1 = sayfaYuk();
            D.aktif = Math.max(0, Math.min(n - 1, Math.floor((SAG() - UI.c) / D.pw)));
        }
        sayfaCiz();
    }
    /* sürükleme / tekerlek: d > 0 1. sayfaya doğru (yatayda sağa, dikeyde
       yukarı), d < 0 ileri. Kâğıdın sonundan öteye geçilirse son sayfada
       yazı varsa kâğıt bir sayfa uzar. */
    function kaydirBy(d) {
        if (!UI || !D || !d) return;
        if (UI.anim) { cancelAnimationFrame(UI.anim); UI.anim = 0; }
        var n = D.sayfalar.length, sonDolu = D.sayfalar[n - 1].cizimler.length;
        if (dikeyMi()) {
            var y = UI.cy - d;
            if (d < 0 && y > enCokY() + 1 && sonDolu) { D.sayfalar.push(yeniSayfa('c')); D.kirli = true; }
            UI.cy = sinirliY(y);
        } else {
            var c = UI.c + d;
            if (d < 0 && c < enAzC() - 1 && sonDolu) { D.sayfalar.push(yeniSayfa('c')); D.kirli = true; }
            UI.c = sinirli(c);
        }
        kaydirUygula();
    }
    function kaydirGit(j, aninda) {
        if (!UI || !D) return;
        j = Math.max(0, Math.min(j, D.sayfalar.length - 1));
        var dik = dikeyMi();
        /* yatayda sayfanın sağ ucu pencerenin sağında, dikeyde sayfanın başı çubuğun altında */
        var hedef = dik ? sinirliY(j * sayfaYuk() - (UI.ustPay || 0)) : sinirli(SAG() - j * D.pw - UI.Lw / 2);
        kaydirHedef(hedef, aninda);
    }
    /* dikeyde y'ye, yatayda x'e yumuşak kaydırma (sayfa içi adımlar için de) */
    function kaydirHedef(hedef, aninda) {
        if (!UI || !D) return;
        var dik = dikeyMi();
        hedef = dik ? sinirliY(hedef) : sinirli(hedef);
        var simdi = dik ? UI.cy : UI.c;
        var koy = function (v) { if (dik) UI.cy = v; else UI.c = v; };
        if (UI.anim) { cancelAnimationFrame(UI.anim); UI.anim = 0; }
        if (aninda || Math.abs(hedef - simdi) < 1) { koy(hedef); kaydirUygula(); return; }
        var bas = simdi, t0 = 0, sure = 320;
        var adim = function (t) {
            if (!UI || dikeyMi() !== dik) return;
            if (!t0) t0 = t;
            var k = Math.min(1, (t - t0) / sure), e = 1 - Math.pow(1 - k, 3);
            koy(bas + (hedef - bas) * e);
            kaydirUygula();
            UI.anim = k < 1 ? requestAnimationFrame(adim) : 0;
        };
        UI.anim = requestAnimationFrame(adim);
    }
    /* ---------------- kalın kaydırma çubuğu ----------------
       Öğretmen (20.10.2026): "sayfalar arası geçiş için aşağıda kalın bi
       scroll çubuğu olsun sayfalar arasında rahatlıkla geçiş yapılabilsin" ·
       "dikeyde solda olsun scroll çubuğu kalemler sadece sağda".
       Çubuk kâğıdın küçük haritası, üstünde sayfa numaraları: yatayda altta
       (1. sayfa sağda), dikeyde solda (1. sayfa üstte). Tutamaç ekrandaki
       pencere (üstünde açık sayfanın numarası): sürüklenince kâğıt onunla
       kayar. Çubuğun başka bir yerine basınca o sayfaya gidilir; basılı tutup
       sürüklemek tutamacı parmağın altına alır.
       «t» = kâğıt boyunca baştan uzaklık (birim; dikeyde baş: 1. sayfanın
       üstündeki pay). */
    var _ray = null;
    function aktifRay() { return dikeyMi() ? UI.rayD : UI.ray; }
    function aktifTutamak() { return dikeyMi() ? UI.tutamakD : UI.tutamak; }
    function sayfaBoy() { return dikeyMi() ? sayfaYuk() : D.pw; }
    function pencereBoy() { return dikeyMi() ? UI.Lh : UI.Lw; }
    function rayPay() { return dikeyMi() ? (UI.ustPay || 0) : 0; }
    function rayToplam() { return dikeyMi() ? enCokY() + UI.Lh + rayPay() : Math.max(D.sayfalar.length * D.pw, UI.Lw); }
    function pencereT() { var p = rayPay(); return dikeyMi() ? [UI.cy + p, UI.cy + p + UI.Lh] : [SAG() - UI.vx1, SAG() - UI.vx0]; }
    function pencereTKoy(t0) {
        if (dikeyMi()) UI.cy = sinirliY(t0 - rayPay());
        else UI.c = sinirli(SAG() - UI.Lw / 2 - t0);
        kaydirUygula();
    }
    function rayKonum(e) {
        var r = aktifRay().getBoundingClientRect(), T2 = rayToplam();
        if (dikeyMi()) return Math.max(0, Math.min(1, r.height ? (e.clientY - r.top) / r.height : 0)) * T2;
        return (1 - Math.max(0, Math.min(1, r.width ? (e.clientX - r.left) / r.width : 0))) * T2;     /* 1. sayfa sağda */
    }
    function rayGuncelle() {
        if (!UI || !D || UI.Lw == null || UI.vx0 == null) return;
        var dik = dikeyMi(), ray = aktifRay(), tut = aktifTutamak(), kap = dik ? UI.raySayfaD : UI.raySayfa;
        if (!ray || !tut || !kap) return;
        var uz = dik ? ray.clientHeight : ray.clientWidth;
        if (!uz) return;
        var n = D.sayfalar.length, P = sayfaBoy(), T2 = rayToplam(), rp = rayPay();
        var anahtar = (dik ? 'd' : 'y') + n + '|' + P + '|' + Math.round(T2) + '|' + Math.round(rp) + '|' + Math.round(uz);
        if (anahtar !== UI.rayAnahtar) {
            UI.rayAnahtar = anahtar;
            var seg = P / T2 * uz, html = '';
            for (var j = 0; j < n; j++) {
                var bas = (dik ? j * P + rp : T2 - (j + 1) * P) / T2 * 100, boy = P / T2 * 100;
                html += '<span' + (j < n - 1 && seg >= 4 ? ' class="ara"' : '') + ' style="' + (dik ? 'top' : 'left') + ':' + bas.toFixed(3) +
                        '%;' + (dik ? 'height' : 'width') + ':' + boy.toFixed(3) + '%">' + (seg >= 18 ? (j + 1) : '') + '</span>';
            }
            kap.innerHTML = html;
        }
        var t = pencereT(), a, b, en = Math.min(uz, 46);
        if (dik) { a = t[0] / T2 * uz; b = t[1] / T2 * uz; }
        else { a = (T2 - t[1]) / T2 * uz; b = (T2 - t[0]) / T2 * uz; }
        if (b - a < en) { var m = (a + b) / 2; a = m - en / 2; b = m + en / 2; }
        if (a < 0) { b -= a; a = 0; }
        if (b > uz) { a -= b - uz; b = uz; }
        if (a < 0) a = 0;
        if (dik) { tut.style.top = a.toFixed(1) + 'px'; tut.style.height = (b - a).toFixed(1) + 'px'; }
        else { tut.style.left = a.toFixed(1) + 'px'; tut.style.width = (b - a).toFixed(1) + 'px'; }
        var no = String(D.aktif + 1), bb = tut.firstChild;
        if (bb && bb.textContent !== no) bb.textContent = no;
        ray.setAttribute('aria-valuemax', String(n));
        ray.setAttribute('aria-valuenow', no);
        ray.setAttribute('aria-valuetext', 'Sayfa ' + no + ' / ' + n);
        ray.classList.toggle('tek', dik ? enCokY() - enAzY() < 0.5 : enAzC() >= enCokC() - 0.5);
    }
    function rayBas(e) {
        if (!UI || !D || UI.kucuk) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        genelKapat(); silSorKapat();
        if (UI.anim) { cancelAnimationFrame(UI.anim); UI.anim = 0; }
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) { }
        var dik = dikeyMi(), tut = aktifTutamak(), th = tut.getBoundingClientRect(), v = dik ? e.clientY : e.clientX;
        var ustunde = dik ? (v >= th.top - 2 && v <= th.bottom + 2) : (v >= th.left - 2 && v <= th.right + 2);
        _ray = { id: e.pointerId, v0: v, v: v, suruk: ustunde, ilk: { clientX: e.clientX, clientY: e.clientY } };
        if (ustunde) tut.classList.add('suruk');
    }
    function rayOynat(e) {
        if (!_ray || e.pointerId !== _ray.id || !UI || !D) return;
        e.preventDefault();
        var dik = dikeyMi(), v = dik ? e.clientY : e.clientX;
        if (!_ray.suruk) {
            if (Math.abs(v - _ray.v0) < 6) return;
            _ray.suruk = true;
            aktifTutamak().classList.add('suruk');
            pencereTKoy(rayKonum(e) - pencereBoy() / 2);         /* tutamaç parmağın altına */
            _ray.v = v;
            return;
        }
        var dv = v - _ray.v, ray = aktifRay(), uz = dik ? ray.clientHeight : ray.clientWidth;
        _ray.v = v;
        if (dv && uz) {
            var dt = dv / uz * rayToplam();
            pencereTKoy(pencereT()[0] + (dik ? dt : -dt));
        }
    }
    function rayBirak(e) {
        if (!_ray || (e && e.pointerId !== _ray.id)) return;
        var r = _ray;
        _ray = null;
        if (!UI || !D) return;
        UI.tutamak.classList.remove('suruk');
        if (UI.tutamakD) UI.tutamakD.classList.remove('suruk');
        if (!r.suruk) {
            /* çubuğa basıldı: o noktadaki sayfaya git */
            var j = Math.floor((rayKonum(r.ilk) - rayPay()) / sayfaBoy());
            kaydirGit(Math.max(0, Math.min(D.sayfalar.length - 1, j)));
        }
    }
    function sayfa() { return D.sayfalar[D.aktif]; }
    /* dikeyde pencere: sayfalar alt alta; her sayfada kendi çizgileri,
       aralarda kesik sınır ve sayfa numarası; kırmızı kenar sağda boydan boya */
    function seritCizDikey(ctx, o) {
        var x0 = UI.vx0, x1 = UI.vx1, y0 = UI.vy0, y1 = UI.vy1, n = D.sayfalar.length, R = cizgiDuzeni(), H = sayfaYuk(), son = n * H;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -x0 * o, -y0 * o);
        var b0 = Math.max(y0, 0), b1 = Math.min(y1, son);
        ctx.fillStyle = '#FFFFFF';
        if (b1 > b0) ctx.fillRect(x0, b0, x1 - x0, b1 - b0);
        ctx.fillStyle = '#E9EDF2';                                        /* kâğıdın başı ve sonu */
        if (y0 < 0) ctx.fillRect(x0, y0, x1 - x0, Math.min(0, y1) - y0);
        if (y1 > son) ctx.fillRect(x0, Math.max(son, y0), x1 - x0, y1 - Math.max(son, y0));
        var jmin = Math.max(0, Math.floor(y0 / H)), jmax = Math.min(n - 1, Math.floor(y1 / H));
        for (var j = jmin; j <= jmax; j++) {
            ctx.save();
            ctx.translate(0, j * H);
            cizgiDesen(ctx, x0, x1 - 18, R);
            ctx.restore();
            if (j > 0) {
                ctx.save();
                ctx.strokeStyle = 'rgba(44,62,80,.2)'; ctx.lineWidth = Math.max(1.2, 1 / o); ctx.setLineDash([7, 6]);
                ctx.beginPath(); ctx.moveTo(x0, j * H); ctx.lineTo(x1, j * H); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = '#9AA6B4'; ctx.font = '700 15px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                ctx.fillText(String(j + 1), x0 + 12, j * H + 7);
                ctx.restore();
            }
        }
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(232,124,124,.55)'; ctx.lineWidth = Math.max(1.4, 1 / o);
        ctx.moveTo(x1 - 44, Math.max(y0, 10)); ctx.lineTo(x1 - 44, Math.min(y1, son - 10)); ctx.stroke();
        ctx.restore();
    }
    function sayfaCiz() {
        if (!UI || !D || UI.vx0 == null) return;
        var o = UI.olcek, n = D.sayfalar.length, j, jmin, jmax;
        var ctx = UI.ust.getContext('2d');
        if (dikeyMi()) {
            seritCizDikey(UI.alt.getContext('2d'), o);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, UI.ust.width, UI.ust.height);
            /* penceredeki sayfalar ve bir üstü / altı (sınırı aşan çizgiler için) */
            var H = sayfaYuk();
            jmin = Math.max(0, Math.floor(UI.vy0 / H) - 1); jmax = Math.min(n - 1, Math.floor(UI.vy1 / H) + 1);
            for (j = jmin; j <= jmax; j++) {
                var oy = UI.vy0 - j * H;
                D.sayfalar[j].cizimler.forEach(function (c) { cizimCiz(ctx, c, o, UI.vx0, oy); });
            }
        } else {
            var vx0 = UI.vx0, vx1 = UI.vx1, pw = D.pw, sag = SAG();
            seritCiz(UI.alt.getContext('2d'), o, vx0, vx1);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, UI.ust.width, UI.ust.height);
            /* penceredeki sayfalar ve iki yanındakiler (sınırı aşan çizgiler için) */
            jmin = Math.max(0, Math.floor((sag - vx1) / pw) - 1); jmax = Math.min(n - 1, Math.floor((sag - vx0) / pw) + 1);
            for (j = jmin; j <= jmax; j++) {
                var ox = vx0 + j * pw;
                D.sayfalar[j].cizimler.forEach(function (c) { cizimCiz(ctx, c, o, ox); });
            }
        }
        aracGuncelle();
    }

    /* ---------------- kalem ve sürükleme ---------------- */
    var _cz = null, _kalemVar = false, _dok = {}, _kay = null;
    function dokunSay() { return Object.keys(_dok).length; }
    function dokunOrt() {
        var tx = 0, ty = 0, n = 0;
        for (var k in _dok) { tx += _dok[k][0]; ty += _dok[k][1]; n++; }
        return n ? [tx / n, ty / n] : [0, 0];
    }
    /* ekran noktası → kâğıt (şerit) koordinatı */
    function nokta(e) {
        var r = UI.ust.getBoundingClientRect();
        return [ UI.vx0 + (e.clientX - r.left) / r.width * UI.Lw, UI.vy0 + (e.clientY - r.top) / r.height * UI.Lh ];
    }
    /* şerit noktası hangi sayfada; o sayfanın yerel koordinatına kayma; çizim başlangıcı */
    function sayfaNo(p) { return Math.max(0, dikeyMi() ? Math.floor(p[1] / sayfaYuk()) : Math.floor((SAG() - p[0]) / D.pw)); }
    function yerelKay(j) { return dikeyMi() ? [0, -j * sayfaYuk()] : [j * D.pw, 0]; }
    function sayfaOfset(j) { return dikeyMi() ? [UI.vx0, UI.vy0 - j * sayfaYuk()] : [UI.vx0 + j * D.pw, 0]; }
    function izKonum(e) {
        var r = UI.kagit.getBoundingClientRect();
        UI.iz.style.left = (e.clientX - r.left) + 'px';
        UI.iz.style.top = (e.clientY - r.top) + 'px';
    }
    function kalemBas(e) {
        silSorKapat();
        if (e.pointerType === 'pen') _kalemVar = true;
        if (e.pointerType === 'mouse' && e.button !== undefined && e.button > 1) return;
        e.preventDefault();
        try { UI.ust.setPointerCapture(e.pointerId); } catch (x) { }
        if (e.pointerType === 'touch') _dok[e.pointerId] = [e.clientX, e.clientY];
        /* SÜRÜKLEYEREK GEZME: farenin orta tuşu, iki parmak ya da kalem
           kullanılırken parmak (avuç içi çizmez, kâğıdı kaydırır). «Kaydır»
           düğmesi kalktı; T.arac 'el' yalnız eski yoldan gelirse çalışır. */
        var kaydir = T.arac === 'el' || (e.pointerType === 'mouse' && e.button === 1) ||
                     (e.pointerType === 'touch' && (_kalemVar || dokunSay() >= 2));
        if (kaydir) {
            if (_cz) { _cz = null; sayfaCiz(); }                 /* ikinci parmak: yarım çizgi bırakılır */
            var o0 = e.pointerType === 'touch' ? dokunOrt() : [e.clientX, e.clientY];
            _kay = { x: o0[0], y: o0[1] };
            UI.kagit.classList.add('suruk');
            return;
        }
        if (_kay) return;
        var p = nokta(e);
        if (dikeyMi() && p[1] < 0) return;                  /* 1. sayfanın üstündeki gri pay */
        /* hangi sayfa? kâğıdın ötesine yazılırsa (yatayda solda, dikeyde altta) kâğıt o kadar uzar */
        var j = sayfaNo(p);
        if (j >= D.sayfalar.length) {
            while (j >= D.sayfalar.length) D.sayfalar.push(yeniSayfa('c'));
            D.kirli = true;
        }
        /* kalemin silgi ucu (button 5 / buttons 32) da siler */
        var silgiMi = T.arac === 'silgi' || (e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32)));
        var kay = yerelKay(j), of = sayfaOfset(j);
        /* hat kalemi: kalınlık harfi büyük (I/O/K) */
        var kal = silgiMi ? 'o' : (T.uc === 'h' ? String(T.kal || 'o').toUpperCase() : T.kal);
        _cz = { id: e.pointerId, j: j, kay: kay, ox: of[0], oy: of[1],
                c: { r: T.renk, k: kal, s: silgiMi ? 1 : 0, p: [p[0] + kay[0], p[1] + kay[1]] } };
        var ctx = UI.ust.getContext('2d');
        cizimCiz(ctx, _cz.c, UI.olcek, _cz.ox, _cz.oy);
        if (T.arac === 'silgi') { izKonum(e); UI.iz.classList.add('gor'); }
    }
    function kalemOynat(e) {
        if (e.pointerType === 'touch' && (e.pointerId in _dok)) _dok[e.pointerId] = [e.clientX, e.clientY];
        if (_kay) {
            var q = e.pointerType === 'touch' ? dokunOrt() : [e.clientX, e.clientY];
            var dx = q[0] - _kay.x, dy = q[1] - _kay.y;
            _kay.x = q[0]; _kay.y = q[1];
            /* kâğıt parmağı izler */
            if (dikeyMi()) { if (dy) kaydirBy(dy / UI.cssOlcek); }
            else if (dx) kaydirBy(-dx / UI.cssOlcek);
            return;
        }
        if (T && T.arac === 'silgi' && UI) { izKonum(e); UI.iz.classList.add('gor'); }
        if (!_cz || e.pointerId !== _cz.id) return;
        e.preventDefault();
        var olaylar = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
        if (!olaylar.length) olaylar = [e];
        var c = _cz.c, ctx = UI.ust.getContext('2d'), kay = _cz.kay, hat = !c.s && hatMi(c.k);
        olaylar.forEach(function (ev) {
            var p = nokta(ev), n = c.p.length;
            var px = p[0] + kay[0], py = p[1] + kay[1];
            var lx = c.p[n - 2], ly = c.p[n - 1];
            if (Math.abs(px - lx) + Math.abs(py - ly) < 0.6) return;
            c.p.push(px, py);
            ctx.save();
            ctx.setTransform(UI.olcek, 0, 0, UI.olcek, -_cz.ox * UI.olcek, -_cz.oy * UI.olcek);
            ctx.globalCompositeOperation = c.s ? 'destination-out' : 'source-over';
            if (hat) {
                /* hat kalemi: son iki nokta arasındaki uç izi */
                var u = hatUc(kalinlikW(c.k));
                ctx.fillStyle = RENKLER[c.r].k;
                ctx.beginPath(); hatDortgen(ctx, lx, ly, px, py, u[0], u[1]); ctx.fill();
                ctx.restore();
                return;
            }
            /* yalnız son parça çizilir: önceki orta noktadan yeni orta noktaya */
            var m = c.p.length / 2;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = c.s ? '#000' : RENKLER[c.r].k;
            ctx.lineWidth = c.s ? SILGI_W : kalinlikW(c.k);
            ctx.beginPath();
            if (m === 2) {
                ctx.moveTo(c.p[0], c.p[1]);
                ctx.lineTo((c.p[0] + c.p[2]) / 2, (c.p[1] + c.p[3]) / 2);
            } else {
                var ax = c.p[(m - 3) * 2], ay = c.p[(m - 3) * 2 + 1];
                var bx = c.p[(m - 2) * 2], by = c.p[(m - 2) * 2 + 1];
                var cx = c.p[(m - 1) * 2], cy = c.p[(m - 1) * 2 + 1];
                ctx.moveTo((ax + bx) / 2, (ay + by) / 2);
                ctx.quadraticCurveTo(bx, by, (bx + cx) / 2, (by + cy) / 2);
            }
            ctx.stroke();
            ctx.restore();
        });
    }
    function kalemBirak(e) {
        if (e && e.pointerType === 'touch') delete _dok[e.pointerId];
        if (_kay) {
            if (e && e.pointerType === 'touch' && dokunSay() > 0) { var q = dokunOrt(); _kay.x = q[0]; _kay.y = q[1]; return; }
            _kay = null;
            if (UI) UI.kagit.classList.remove('suruk');
            return;
        }
        if (!_cz || (e && e.pointerId !== _cz.id)) return;
        var c = _cz.c, j = _cz.j;
        _cz = null;
        c.p = sadelestir(c.p, 0.32).map(function (v) { return Math.round(v * 2) / 2; });
        D.sayfalar[j].cizimler.push(c);
        D.geri.push({ t: 'ekle', j: j });
        D.ileri = [];
        D.kirli = true;
        sayfaCiz();
    }

    /* ---------------- işlemler ---------------- */
    function geriAl() {
        var a = D.geri.pop();
        if (!a) return;
        var sy = D.sayfalar[a.j];
        if (!sy) return;
        if (a.t === 'ekle') { D.ileri.push({ t: 'ekle', j: a.j, c: sy.cizimler.pop() }); }
        else if (a.t === 'temizle') { D.ileri.push({ t: 'temizle', j: a.j, onceki: a.onceki }); sy.cizimler = a.onceki.slice(); }
        D.kirli = true; sayfaCiz();
    }
    function yinele() {
        var a = D.ileri.pop();
        if (!a) return;
        var sy = D.sayfalar[a.j];
        if (!sy) return;
        if (a.t === 'ekle') { sy.cizimler.push(a.c); D.geri.push({ t: 'ekle', j: a.j }); }
        else if (a.t === 'temizle') { D.geri.push({ t: 'temizle', j: a.j, onceki: sy.cizimler.slice() }); sy.cizimler = []; }
        D.kirli = true; sayfaCiz();
    }
    function temizle() {
        var j = D.aktif, sy = D.sayfalar[j];
        if (!sy.cizimler.length) return;
        D.geri.push({ t: 'temizle', j: j, onceki: sy.cizimler.slice() });
        D.ileri = [];
        sy.cizimler = [];
        D.kirli = true; sayfaCiz();
        bildir('Sayfa temizlendi — geri almak için ↶');
    }
    function sayfayaGit(i) {
        genelKapat();
        if (i < 0 || i >= D.sayfalar.length) return;
        kaydirGit(i);
    }
    /* ‹ sola: İLERİ — sonraki sayfa; son sayfadaysa yeni sayfa açılır, boş
       olsa da (20.10.2026, öğretmen: "ileri sayfaya sol okla geçsin").
       Sondaki boş sayfalar kaydedilmez (kayitSayfalari). */
    /* A4 boyunda sayfa (21.10.2026): dikeyde ▼ önce sayfanın İÇİNDE bir ekran
       kaydırır, sayfanın sonuna gelince sonraki sayfaya geçer; ▲ tersi.
       Kısa (eski) sayfalarda eskisi gibi doğrudan sayfa değiştirir. */
    function ekranAdimi() { return Math.max(sayfaYuk() * 0.25, UI.Lh - (UI.ustPay || 0) - 40); }
    function sola() {
        genelKapat();
        if (dikeyMi()) {
            var alt = (D.aktif + 1) * sayfaYuk();
            if (UI.cy + UI.Lh < alt - 8) { kaydirHedef(Math.min(UI.cy + ekranAdimi(), alt - UI.Lh)); return; }
        }
        var n = D.sayfalar.length, j = D.aktif + 1;
        if (j >= n) {
            D.sayfalar.push(yeniSayfa('c'));
            D.kirli = true;
        }
        kaydirGit(j);
    }
    /* › sağa: önceki sayfa (dikeyde önce sayfanın içinde yukarı) */
    function saga() {
        genelKapat();
        if (dikeyMi()) {
            var ust = D.aktif * sayfaYuk() - (UI.ustPay || 0);
            if (UI.cy > ust + 8) { kaydirHedef(Math.max(UI.cy - ekranAdimi(), ust)); return; }
        }
        kaydirGit(Math.max(0, D.aktif - 1));
    }
    /* + : yeni sayfa açık sayfadan hemen SONRA — yatayda soluna ("artıya basınca
       yeni sayfa sola eklensin"), dikeyde altına */
    function yeniSayfaEkle() {
        genelKapat();
        var yer = D.aktif + 1;
        D.sayfalar.splice(yer, 0, yeniSayfa('c'));
        [D.geri, D.ileri].forEach(function (L) { L.forEach(function (a) { if (a.j >= yer) a.j++; }); });
        D.kirli = true;
        kaydirGit(yer);
    }
    function sayfaKaldir() {
        genelKapat();
        if (D.sayfalar.length < 2) return;
        var sy = sayfa();
        var yap = function () {
            D.sayfalar.splice(D.aktif, 1);
            D.geri = []; D.ileri = [];
            D.kirli = true;
            kaydirGit(Math.min(D.aktif, D.sayfalar.length - 1), true);
        };
        if (!sy.cizimler.length) { yap(); return; }
        soru('Bu sayfa (' + (D.aktif + 1) + '. sayfa) üzerindeki yazılarla birlikte kaldırılsın mı?', 'Kaldır', true, yap);
    }
    function modSec() { /* tek düzen: çizgili defter (çizgi sayısı / güzel yazı: cizgiSec) */ }
    function tercihKaydet() { tercihYaz({ renk: T.renk, kal: T.kal, mod: T.mod, cizgi: T.cizgi, yon: T.yon, uc: T.uc }); }
    /* yeni defter: son seçilen çizgi sayısı (2·3·4·5·7) ya da güzel yazı;
       eski tercih (6, 8) artık seçenek değil → 5 */
    function tercihCizgi(v) { return v === 'g' ? 'g' : (CIZGI_SECENEK.indexOf(+v) >= 0 ? +v : CIZGI_VARSAYILAN); }
    /* ÇİZGİ SAYISI / GÜZEL YAZI: defterin kendi ayarı (kaydedilir) ve tercih
       (yeni defterler de böyle başlar). Basılınca (aynı seçenek de olsa)
       defter bugünkü düzene (üstte pay) geçer. */
    function cizgiSec(v) {
        var n = v === 'g' ? 'g' : cizgiSayisi(v);
        T.cizgi = n; tercihKaydet();
        if (!D || (D.cizgi === n && D.ust === UST_BOSLUK)) { aracGuncelle(); return; }
        D.cizgi = n; D.ust = UST_BOSLUK;
        D.kirli = true;
        sayfaCiz();
        aracGuncelle();              /* seçili düğme ve sayfa bilgisi hemen değişsin (21.10.2026) */
    }
    /* HAT KALEMİ aç / kapa — kalınlık düğmeleri ucun enini seçer */
    function hatSec(acik) {
        T.uc = acik ? 'h' : 'y';
        T.arac = 'kalem';
        tercihKaydet();
        aracGuncelle();
    }
    /* KAYDIRMA YÖNÜ: 'd' dikey (öntanımlı) / 'y' yatay — açık sayfa yerinde kalır */
    function yonSec(y) {
        y = y === 'y' ? 'y' : 'd';
        if (T) { T.yon = y; tercihKaydet(); }
        if (!UI || !D) return;
        var dik = y === 'd';
        if (!!UI.dikey === dik) { aracGuncelle(); return; }
        var j = D.aktif;
        if (UI.anim) { cancelAnimationFrame(UI.anim); UI.anim = 0; }
        _cz = null; _kay = null; _dok = {}; _ray = null;
        UI.dikey = dik;
        UI.kutu.classList.toggle('dikey', dik);
        UI.rayAnahtar = '';
        UI.c = null; UI.cy = null;
        D.aktif = j;
        cizimAyarla();
        kaydirGit(j, true);
        bildir(dik ? 'Dikey kaydırma — sayfalar alt alta' : 'Yatay kaydırma — sayfalar sağdan sola');
    }
    /* tam ekran yardımcıları (eski Safari / iPad: webkit önekli) */
    function fsEleman() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
    function fsGir(el) {
        try {
            var f = el && (el.requestFullscreen || el.webkitRequestFullscreen);
            if (!f) return;
            var s = f.call(el);
            if (s && s.catch) s.catch(function () { });
        } catch (e) { }
    }
    function fsCik() {
        try {
            var f = document.exitFullscreen || document.webkitExitFullscreen;
            if (f && fsEleman()) { var s = f.call(document); if (s && s.catch) s.catch(function () { }); }
        } catch (e) { }
    }
    function tamEkran() {
        if (fsEleman()) fsCik(); else fsGir(UI.ort);
        setTimeout(cizimAyarla, 250);
    }
    function fsDegisti() {
        if (!UI) return;
        var tam = !!fsEleman();
        if (tam) UI.tamDenendi = true;               /* bir kez girildi: çıkarsa bir daha zorlanmaz */
        UI.kutu.classList.toggle('tam', tam);
        var b = UI.ort.querySelector('[data-is="tamEkran"]');
        if (b) { b.title = tam ? 'Tam ekrandan çık' : 'Tam ekran'; var sp = b.querySelector('span'); if (sp) sp.textContent = tam ? 'Tam ekrandan çık' : 'Tam ekran'; }
    }
    document.addEventListener('fullscreenchange', fsDegisti);
    document.addEventListener('webkitfullscreenchange', fsDegisti);
    /* tek başına kip: açılışta tam ekran denenir; tarayıcı dokunuş isterse ilk
       dokunuşta geçer (bir kez; öğretmen tam ekrandan kendisi çıkarsa zorlanmaz) */
    function ilkDokunustaTamEkran() {
        if (!TEK || !UI || fsEleman() || UI.tamDenendi) return;
        UI.tamDenendi = true;
        tamEkranAc();
    }
    /* açılışta tam ekran (öğretmen: "defter popup ı tam ekran açılsın"). Yalnız
       bir dokunuşla çağrılır (tarayıcı kuralı); izin verilmezse ya da tarayıcı
       desteklemezse (iPhone) pencere yine bütün ekranı kaplar. */
    function tamEkranAc() {
        if (UI && !fsEleman()) fsGir(UI.ort);
        setTimeout(cizimAyarla, 250);
    }

    function aracGuncelle() {
        if (!UI || !D) return;
        var s = sayfa(), dik = dikeyMi();
        UI.kagit.classList.toggle('silgi', T.arac === 'silgi');
        UI.kagit.classList.toggle('el', T.arac === 'el');
        UI.kutu.classList.toggle('hat', T.uc === 'h');
        [].forEach.call(UI.ort.querySelectorAll('[data-is="kalem"],[data-is="silgi"],[data-is="el"]'), function (b) {
            b.classList.toggle('sec', b.getAttribute('data-is') === T.arac);
        });
        [].forEach.call(UI.ort.querySelectorAll('[data-renk]'), function (b) { b.classList.toggle('sec', +b.getAttribute('data-renk') === T.renk && T.arac === 'kalem'); });
        [].forEach.call(UI.ort.querySelectorAll('[data-kal]'), function (b) { b.classList.toggle('sec', b.getAttribute('data-kal') === T.kal); });
        var hb = UI.ort.querySelector('[data-is="hat"]');
        if (hb) { hb.classList.toggle('sec', T.uc === 'h'); hb.setAttribute('aria-pressed', T.uc === 'h' ? 'true' : 'false'); }
        var dz = function (is, kapali) { var b = UI.ort.querySelector('[data-is="' + is + '"]'); if (b) b.disabled = !!kapali; };
        var n = D.sayfalar.length;
        dz('geri', !D.geri.length); dz('ileri', !D.ileri.length); dz('temizle', !s.cizimler.length);
        dz('sola', false);                                      /* ileri hep açık */
        dz('saga', dik ? UI.cy <= enAzY() + 0.5 : UI.c >= enCokC() - 1); dz('sayfaSil', n < 2);
        UI.sayfa.textContent = (D.aktif + 1) + ' / ' + D.sayfalar.length;
        var guzel = D.cizgi === 'g';
        [].forEach.call(UI.ort.querySelectorAll('[data-cizgi]'), function (b) {
            var v = b.getAttribute('data-cizgi');
            var se = guzel ? v === 'g' : (v !== 'g' && +v === D.cizgi);
            b.classList.toggle('sec', se); b.setAttribute('aria-pressed', se ? 'true' : 'false');
        });
        [].forEach.call(UI.ort.querySelectorAll('[data-yon]'), function (b) {
            var se = b.getAttribute('data-yon') === (dik ? 'd' : 'y');
            b.classList.toggle('sec', se); b.setAttribute('aria-pressed', se ? 'true' : 'false');
        });
        rayGuncelle();
        var ny = UI.ort.querySelector('#ysNotYazi');
        if (ny) ny.textContent = D.notId ? 'Seviye notunu güncelle' : 'Seviye notlarına kaydet';
    }

    /* ---------------- «Tüm sayfalar» görünümü ----------------
       Öğretmen: "tüm sayfalara bakabileceğimiz bi özellik olsun". Defterin
       bütün sayfaları küçük resim olarak dizilir; birine basınca o sayfaya
       gidilir. Sonda «Yeni sayfa» kartı. Esc, «Kapat» ya da dışarıdaki bir
       düğme görünümü kapatır. */
    function genelAc() {
        genelKapat();
        silSorKapat();
        var g = document.createElement('div');
        g.className = 'ys-genel';
        g.setAttribute('role', 'dialog');
        g.setAttribute('aria-label', 'Tüm sayfalar');
        var kartlar = D.sayfalar.map(function (sy, i) {
            return '<button type="button" class="ys-gkart' + (i === D.aktif ? ' simdi' : '') + '" data-git="' + i + '" title="Sayfa ' + (i + 1) + '">' +
                '<canvas width="480" height="' + Math.round(480 * sayfaYuk() / W) + '" style="aspect-ratio:' + W + '/' + Math.round(sayfaYuk()) + '"></canvas><span>Sayfa ' + (i + 1) + (i === D.aktif ? ' · açık' : '') + '</span></button>';
        }).join('');
        g.innerHTML =
            '<div class="ys-genel-bas"><b>Tüm sayfalar</b><small>' + D.sayfalar.length + ' sayfa</small><span class="ys-bos"></span>' +
              '<button type="button" class="ys-t" data-is="genelKapat" title="Kapat (Esc)">Kapat</button></div>' +
            '<div class="ys-genel-izgara">' + kartlar +
              '<button type="button" class="ys-gkart yeni" data-is="genelYeni">' + IK.yeniSayfa + '<span>Yeni sayfa</span></button>' +
            '</div>';
        UI.sahne.appendChild(g);
        [].forEach.call(g.querySelectorAll('canvas'), function (c, i) {
            try { onizlemeCiz(c, D.sayfalar[i], i === 0, D.pw); } catch (e) { }
        });
        UI.genel = g;
        var su = g.querySelector('.simdi');
        if (su && su.scrollIntoView) { try { su.scrollIntoView({ block: 'nearest' }); } catch (e) { } }
    }
    function genelKapat() {
        if (UI && UI.genel) { UI.genel.remove(); UI.genel = null; }
    }

    /* ---------------- «Tüm sayfayı sil» sorusu ---------------- */
    function silSorAc(btn) {
        silSorKapat();
        if (!sayfa().cizimler.length) { bildir('Sayfa zaten boş'); return; }
        var d = document.createElement('div');
        d.className = 'ys-silsor';
        d.setAttribute('role', 'dialog');
        d.innerHTML = '<button type="button" data-is="tumSil">' + IK.temizle + '<span>Tüm sayfayı sil</span></button>';
        UI.kutu.appendChild(d);
        var k = UI.kutu.getBoundingClientRect(), r = btn.getBoundingClientRect();
        var w = d.offsetWidth, h = d.offsetHeight, x, y;
        if (btn.closest('.ys-yan.sol')) { x = r.right - k.left + 12; y = r.top - k.top + r.height / 2 - h / 2; }
        else if (btn.closest('.ys-yan.sag')) { x = r.left - k.left - 12 - w; y = r.top - k.top + r.height / 2 - h / 2; }
        else { x = r.left - k.left + r.width / 2 - w / 2; y = r.bottom - k.top + 8; }
        d.style.left = Math.max(8, Math.min(k.width - w - 8, x)) + 'px';
        d.style.top = Math.max(8, Math.min(k.height - h - 8, y)) + 'px';
        UI.silSor = d; UI.silSorBtn = btn;
    }
    function silSorKapat() {
        if (UI && UI.silSor) { UI.silSor.remove(); UI.silSor = null; UI.silSorBtn = null; }
    }

    /* ---------------- PDF ----------------
       Her sayfa çizgileriyle birlikte yüksek çözünürlüklü bir resme
       çizilir (silgi izleri de doğru çıksın diye resim), altına sınıf ve
       tarih yazılır; sayfalar A4 yatay bir PDF'e konup indirilir. Dış
       kütüphane gerekmez: PDF burada, elle yazılıyor. */
    function trAscii(x) {
        var h = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U' };
        return String(x || '').replace(/[çÇğĞıİöÖşŞüÜ]/g, function (c) { return h[c]; })
            .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'defter';
    }
    function sayfaGorseli(s, no, top) {
        var ph = sayfaYuk();
        var g = gorunum(s, W / ph, D.pw), Lw = g.x1 - g.x0;
        var PW = ph > Lw ? 1700 : 2400, PH = Math.round(PW * ph / Lw), AY = 70;   /* dikey sayfa: daha küçük tuval */
        var c = document.createElement('canvas');
        c.width = PW; c.height = PH + AY;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, c.width, c.height);
        var o = PW / Lw;
        cizgileriCiz(ctx, 'c', o, g.x0, g.x1, no === 1 ? W / 2 + D.pw / 2 : null, cizgiDuzeni());
        var tmp = document.createElement('canvas');
        tmp.width = PW; tmp.height = PH;
        var tc = tmp.getContext('2d');
        s.cizimler.forEach(function (ci) { cizimCiz(tc, ci, o, g.x0); });
        ctx.drawImage(tmp, 0, 0);
        ctx.fillStyle = '#E2E7EE'; ctx.fillRect(28, PH + 6, PW - 56, 2);
        ctx.fillStyle = '#7A8594';
        ctx.font = '600 28px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText('Defter · ' + etiket() + ' · ' + tarihYaz(D.tarih || Date.now()), 28, PH + AY / 2 + 4);
        ctx.textAlign = 'right';
        ctx.fillText(no + ' / ' + top, PW - 28, PH + AY / 2 + 4);
        var url = c.toDataURL('image/jpeg', 0.9);
        var ikili = atob(url.slice(url.indexOf(',') + 1)), u = new Uint8Array(ikili.length);
        for (var i = 0; i < ikili.length; i++) u[i] = ikili.charCodeAt(i);
        return { jpeg: u, w: c.width, h: c.height };
    }
    function pdfYap(resimler) {
        var parca = [], boy = 0, yer = [];
        function yaz(x) {
            var b = x;
            if (typeof x === 'string') { b = new Uint8Array(x.length); for (var i = 0; i < x.length; i++) b[i] = x.charCodeAt(i) & 255; }
            parca.push(b); boy += b.length;
        }
        function nesne(no, govde) { yer[no] = boy; yaz(no + ' 0 obj\n'); govde(); yaz('\nendobj\n'); }
        /* dikey (A4 boyunda) sayfalar A4 dikey, eski 16:10 sayfalar A4 yatay */
        var dikeyS = !!(resimler.length && resimler[0].h > resimler[0].w);
        var n = resimler.length, PW = dikeyS ? 595.28 : 841.89, PH = dikeyS ? 841.89 : 595.28, PAY = 20, kids = [];
        for (var i = 0; i < n; i++) kids.push((3 + i * 3) + ' 0 R');
        yaz('%PDF-1.4\n%âãÏÓ\n');
        nesne(1, function () { yaz('<< /Type /Catalog /Pages 2 0 R >>'); });
        nesne(2, function () { yaz('<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>'); });
        resimler.forEach(function (r, i) {
            var po = 3 + i * 3, co = po + 1, io = po + 2;
            var k = Math.min((PW - 2 * PAY) / r.w, (PH - 2 * PAY) / r.h);
            var iw = r.w * k, ih = r.h * k, ix = (PW - iw) / 2, iy = (PH - ih) / 2;
            nesne(po, function () {
                yaz('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /XObject << /Im' + i + ' ' +
                    io + ' 0 R >> >> /Contents ' + co + ' 0 R >>');
            });
            var akis = 'q ' + iw.toFixed(2) + ' 0 0 ' + ih.toFixed(2) + ' ' + ix.toFixed(2) + ' ' + iy.toFixed(2) + ' cm /Im' + i + ' Do Q';
            nesne(co, function () { yaz('<< /Length ' + akis.length + ' >>\nstream\n' + akis + '\nendstream'); });
            nesne(io, function () {
                yaz('<< /Type /XObject /Subtype /Image /Width ' + r.w + ' /Height ' + r.h +
                    ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + r.jpeg.length + ' >>\nstream\n');
                yaz(r.jpeg);
                yaz('\nendstream');
            });
        });
        var xref = boy, top = 3 + n * 3;
        yaz('xref\n0 ' + top + '\n0000000000 65535 f \n');
        for (var j = 1; j < top; j++) yaz(('0000000000' + yer[j]).slice(-10) + ' 00000 n \n');
        yaz('trailer\n<< /Size ' + top + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
        return new Blob(parca, { type: 'application/pdf' });
    }
    function pdfIndir() {
        if (!D) return;
        if (bosMu(D.sayfalar)) { bildir('Defter boş — önce bir şey yaz', true); return; }
        try {
            var sy = kayitSayfalari(D.sayfalar), top = sy.length;
            var resimler = sy.map(function (s, i) { return sayfaGorseli(s, i + 1, top); });
            var blob = pdfYap(resimler);
            var d = new Date(D.tarih || Date.now());
            var gun = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
            var ad = 'defter_' + trAscii(D.sube || sinifAdi(D.sinif)) + '_' + gun + '.pdf';
            var url = URL.createObjectURL(blob), a = document.createElement('a');
            a.href = url; a.download = ad; a.rel = 'noopener';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
            bildir('PDF indirildi · ' + top + ' sayfa');
        } catch (e) {
            bildir('PDF hazırlanamadı', true);
        }
    }

    /* Kalem ve kalınlık seçimi DOKUNUR DOKUNMAZ işlenir (21.10.2026, öğretmen:
       "kalemler arası geçiş olmamış, değiştiremiyorum"): bazı dokunmatik
       tahtalarda ve kalemle dokununca «click» olayı gelmeyebiliyor; pointerdown
       her cihazda gelir. Seçim yinelenebilir olduğundan ardından gelen click
       aynı kalemi bir daha seçer, zararı yok. */
    function hizliSec(e) {
        if (!UI || !T || !D) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        var b = e.target && e.target.closest && e.target.closest('[data-renk],[data-kal]');
        if (!b || b.disabled || !UI.ort.contains(b)) return;
        if (b.hasAttribute('data-renk')) T.renk = +b.getAttribute('data-renk');
        else T.kal = b.getAttribute('data-kal');
        T.arac = 'kalem';
        tercihKaydet(); aracGuncelle();
    }
    /* ÇUBUKLAR DOKUNUŞLA ÇALIŞIR (21.10.2026, öğretmen: "güzel yazı defteri ile
       normal defter arasında geçiş yapamıyorum", "kalemler arası geçiş olmamış"):
       bazı dokunmatik tahtalarda yavaş/uzun basışta ya da kalemle «click» olayı
       gelmiyor (Windows'ta uzun basış sağ tık sayılır). Çubuklardaki düğmeler
       pointerup'ta işlenir: aynı düğmede basılıp bırakıldıysa ve parmak 10 px'den
       az kaydıysa. Ardından click gelirse yinelenmez (UI.sonHizli). Tam ekran ve
       PDF click'te kalır (tarayıcı kullanıcı hareketi ister); listeler click'te
       kalır (kaydırılabilir). */
    var _tap = null;
    function hizliHedef(t) {
        if (!UI || !t || !t.closest) return null;
        var b = t.closest('button[data-is],button[data-renk],button[data-kal],button[data-cizgi],button[data-yon],button[data-mod]');
        if (!b || b.disabled || !UI.ort.contains(b)) return null;
        var is = b.getAttribute('data-is');
        if (is === 'tamEkran' || is === 'pdf') return null;
        return b.closest('.ys-arac,.ys-yan,.ys-sayfalar') ? b : null;
    }
    function tapBas(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) { _tap = null; return; }
        var b = hizliHedef(e.target);
        _tap = b ? { b: b, id: e.pointerId, x: e.clientX, y: e.clientY } : null;
    }
    function tapBirak(e) {
        var t = _tap; _tap = null;
        if (!t || e.pointerId !== t.id || !UI) return;
        if (Math.abs(e.clientX - t.x) > 10 || Math.abs(e.clientY - t.y) > 10) return;
        if (hizliHedef(e.target) !== t.b) return;
        UI.sonHizli = { b: t.b, z: Date.now() };
        islem(e, e.target, t.b);
    }
    function tikla(e) {
        var t = e.target;
        if (t === UI.ort) return;                                    /* dışına basınca kapanmaz (yanlışlıkla silinmesin) */
        var b = t.closest && t.closest('[data-is],[data-renk],[data-kal],[data-cizgi],[data-yon],[data-mod],[data-sek],[data-ac],[data-sil],[data-not],[data-notsil],[data-git]');
        if (b && UI.sonHizli && UI.sonHizli.b === b && Date.now() - UI.sonHizli.z < 800) return;   /* pointerup'ta işlendi */
        islem(e, t, b);
    }
    function islem(e, t, b) {
        /* «Tüm sayfalar» açıkken dışındaki bir düğmeye basılırsa görünüm kapanır */
        if (UI.genel && !UI.genel.contains(t) && !(b && b.getAttribute('data-is') === 'tumSayfalar')) genelKapat();
        /* açık «Tüm sayfayı sil» sorusu: dışına basınca kapanır; onu açan
           düğmeye yeniden basmak da yalnız kapatır */
        if (UI.silSor && !UI.silSor.contains(t)) {
            var acan = UI.silSorBtn;
            silSorKapat();
            if (b && b === acan) return;
        }
        if (!b) return;
        if (b.hasAttribute('data-git')) { var gi = +b.getAttribute('data-git'); genelKapat(); sayfayaGit(gi); return; }
        if (b.hasAttribute('data-renk')) { T.renk = +b.getAttribute('data-renk'); T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); return; }
        if (b.hasAttribute('data-kal')) { T.kal = b.getAttribute('data-kal'); T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); return; }
        if (b.hasAttribute('data-cizgi')) { var cv = b.getAttribute('data-cizgi'); cizgiSec(cv === 'g' ? 'g' : +cv); return; }
        if (b.hasAttribute('data-yon')) { yonSec(b.getAttribute('data-yon')); return; }
        if (b.hasAttribute('data-mod')) { modSec(b.getAttribute('data-mod')); return; }
        if (b.hasAttribute('data-sek')) { UI.sek = b.getAttribute('data-sek'); panelCiz(); return; }
        if (b.hasAttribute('data-sil')) { e.stopPropagation(); gecmisSilSor(b.getAttribute('data-sil')); return; }
        if (b.hasAttribute('data-notsil')) { e.stopPropagation(); notSilSor(b.getAttribute('data-notsil')); return; }
        if (b.hasAttribute('data-ac')) { gecmistenAc(b.getAttribute('data-ac')); return; }
        if (b.hasAttribute('data-not')) { nottanAc(b.getAttribute('data-not')); return; }
        var is = b.getAttribute('data-is');
        if (is === 'silgi') {
            /* seçili silgiye İKİNCİ kez basınca: «Tüm sayfayı sil» */
            if (T.arac === 'silgi') silSorAc(b);
            else { T.arac = 'silgi'; aracGuncelle(); }
        }
        else if (is === 'kalem') { T.arac = 'kalem'; aracGuncelle(); }
        else if (is === 'tumSil') { silSorKapat(); temizle(); bildir('Sayfa silindi — geri almak için ↶'); }
        else if (is === 'pdf') pdfIndir();
        else if (is === 'tumSayfalar') { if (UI.genel) genelKapat(); else genelAc(); }
        else if (is === 'genelKapat') genelKapat();
        else if (is === 'genelYeni') {
            /* görünümde kart en sonda durur: yeni sayfa da kâğıdın sonuna (en sola) */
            genelKapat();
            D.sayfalar.push(yeniSayfa('c'));
            D.kirli = true;
            kaydirGit(D.sayfalar.length - 1);
        }
        else if (is === 'geri') geriAl();
        else if (is === 'ileri') yinele();
        else if (is === 'temizle') silSorAc(b);
        else if (is === 'sola') sola();
        else if (is === 'saga') saga();
        else if (is === 'el') { T.arac = 'el'; aracGuncelle(); }
        else if (is === 'hat') hatSec(T.uc !== 'h');
        else if (is === 'yeniSayfa') yeniSayfaEkle();
        else if (is === 'sayfaSil') sayfaKaldir();
        else if (is === 'notKaydet') notKaydetSor();
        else if (is === 'panel') panelAcKapa();
        else if (is === 'panelKapat') UI.panel.classList.remove('acik');
        else if (is === 'tamEkran') tamEkran();
        else if (is === 'kucult') kucult();
        else if (is === 'anasayfa') { e.preventDefault(); anaSayfayaGit(); }
        else if (is === 'kapat') kapat();
        else if (is === 'sonAc') { var id = b.getAttribute('data-id'); var s = UI.ort.querySelector('.ys-son'); if (s) s.remove(); gecmistenAc(id); }
        else if (is === 'sonKapat') { var s2 = UI.ort.querySelector('.ys-son'); if (s2) s2.remove(); }
    }

    function tus(e) {
        if (!UI || UI.kucuk) return;
        var yazi = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
        if (e.key === 'Escape') {
            e.preventDefault(); e.stopPropagation();
            if (UI.silSor) { silSorKapat(); return; }
            if (UI.genel) { genelKapat(); return; }
            var so = UI.ort.querySelector('.ys-soru-ort');
            if (so) { so.remove(); return; }
            if (UI.panel.classList.contains('acik')) { UI.panel.classList.remove('acik'); return; }
            if (fsEleman()) { fsCik(); return; }             /* önce tam ekrandan çık; bir daha Esc küçültür */
            if (TEK) return;                                  /* ayrı sekmede küçültme yok: «Ana sayfa» görünür */
            kucult(); return;
        }
        if (yazi) return;
        var k = e.key.toLowerCase();
        if ((e.ctrlKey || e.metaKey) && k === 'z' && !e.shiftKey) { e.preventDefault(); geriAl(); return; }
        if ((e.ctrlKey || e.metaKey) && (k === 'y' || (k === 'z' && e.shiftKey))) { e.preventDefault(); yinele(); return; }
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (k === 'k' || k === 'p') { T.arac = 'kalem'; aracGuncelle(); }
        else if (k === 's' || k === 'e') { T.arac = 'silgi'; aracGuncelle(); }
        else if (/^[1-5]$/.test(k)) { T.renk = +k - 1; T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageDown') sola();
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageUp') saga();
        else return;
        e.preventDefault();
    }

    /* ---------------- bildirim ve soru ---------------- */
    function bildir(m, hata) {
        if (!UI) return;
        [].forEach.call(UI.ort.querySelectorAll('.ys-bildiri'), function (x) { x.remove(); });
        var b = document.createElement('div');
        b.className = 'ys-bildiri' + (hata ? ' hata' : '');
        b.textContent = m;
        UI.sahne.appendChild(b);
        setTimeout(function () { b.remove(); }, 2700);
    }
    function soru(metin, evetYazi, kirmizi, evet, girdi) {
        var o = document.createElement('div');
        o.className = 'ys-soru-ort';
        o.innerHTML = '<div class="ys-soru" role="alertdialog"><p>' + esc(metin) + '</p>' +
            (girdi != null ? '<input type="text" maxlength="60" value="' + esc(girdi) + '">' : '') +
            '<div class="ys-tuslar"><button type="button" class="hayir">Vazgeç</button>' +
            '<button type="button" class="evet' + (kirmizi ? ' kirmizi' : '') + '">' + esc(evetYazi) + '</button></div></div>';
        UI.kutu.appendChild(o);
        var inp = o.querySelector('input');
        if (inp) { inp.focus(); inp.select(); }
        o.addEventListener('click', function (e) {
            if (e.target === o || e.target.classList.contains('hayir')) { o.remove(); return; }
            if (e.target.classList.contains('evet')) { var v = inp ? inp.value.trim() : ''; o.remove(); evet(v); }
        });
        if (inp) inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); var v = inp.value.trim(); o.remove(); evet(v); }
        });
    }

    /* ---------------- son defter önerisi ---------------- */
    function sonDefterOnerisi() {
        var sinif = D.sinif;
        gecmisListe(sinif).then(function (L) {
            if (!UI || !D || D.sinif !== sinif || !L.length || !bosMu(D.sayfalar)) return;
            var k = L.filter(function (x) { return (x.sube || '') === (D.sube || ''); })[0];
            if (!k) return;                              /* yalnız bu sınıfın (şubenin) son defteri */
            var d = document.createElement('div');
            d.className = 'ys-son';
            d.innerHTML = '<span>Son yazdığın: <b>' + esc(tarihYaz(k.guncelleme, true)) + '</b>' + (k.sayfa > 1 ? ' · ' + k.sayfa + ' sayfa' : '') + '</span>' +
                '<button type="button" data-is="sonAc" data-id="' + esc(k.id) + '">Aç</button>' +
                '<button type="button" class="x" data-is="sonKapat" aria-label="Kapat">&times;</button>';
            UI.sahne.appendChild(d);
            setTimeout(function () { if (d.parentNode) d.remove(); }, 12000);
        });
    }

    /* ---------------- panel: geçmiş + seviye notları ---------------- */
    function panelAcKapa() {
        var a = !UI.panel.classList.contains('acik');
        UI.panel.classList.toggle('acik', a);
        if (a) panelCiz();
    }
    function panelCiz() {
        [].forEach.call(UI.ort.querySelectorAll('[data-sek]'), function (b) { b.classList.toggle('sec', b.getAttribute('data-sek') === UI.sek); });
        var ic = UI.panelIc;
        ic.innerHTML = '<p class="ys-yok">Yükleniyor…</p>';
        if (UI.sek === 'gecmis') {
            gecmisListe(D.sinif).then(function (L) {
                if (!UI || UI.sek !== 'gecmis') return;
                ic.innerHTML = '<p class="ys-bilgi">' + esc(sinifAdi(D.sinif)) + ' — bu tarayıcıda yazılanlar. Kapattığında yazıldığı tarihle buraya düşer; ' +
                    'son ' + GECMIS_EN_COK + ' defter tutulur.</p>' +
                    (L.length ? L.map(function (k) {
                        var simdi = (k.id === D.id || k.id === D.kaynakId);
                        return '<div class="ys-oge' + (simdi ? ' simdi' : '') + '" data-ac="' + esc(k.id) + '">' +
                            (k.onizleme ? '<img alt="" src="' + esc(k.onizleme) + '">' : '<canvas width="240" height="150"></canvas>') +
                            '<div><b>' + esc(tarihYaz(k.guncelleme, true)) + '</b>' +
                            '<span>' + (k.sayfa || 1) + ' sayfa' + (k.sube ? ' · ' + esc(k.sube) : '') +
                            (simdi ? ' · şu an açık' : '') + '</span></div>' +
                            '<button type="button" class="ys-ogesil" data-sil="' + esc(k.id) + '" title="Geçmişten sil">&times;</button></div>';
                    }).join('') : '<p class="ys-yok">Henüz kayıtlı sayfa yok.<br>Yazdıklarını kapatınca burada görürsün.</p>');
            });
        } else {
            if (!benKim()) { ic.innerHTML = '<p class="ys-yok">Seviye notları hesabına kaydedilir; görmek için giriş yap.</p>'; return; }
            notlarHepsi().then(function (H2) {
                if (!UI || UI.sek !== 'notlar') return;
                var L = (H2['s' + D.sinif] || []).slice().sort(function (a, b) { return (b.tarih || 0) - (a.tarih || 0); });
                ic.innerHTML = '<p class="ys-bilgi">Beğendiğin defterler hesabında saklanır, her cihazda görünür. ' +
                    esc(sinifAdi(D.sinif)) + ': <b>' + L.length + ' / ' + NOT_EN_COK + '</b></p>' +
                    (L.length ? L.map(function (n) {
                        return '<div class="ys-oge' + (n.id === D.notId ? ' simdi' : '') + '" data-not="' + esc(n.id) + '">' +
                            '<canvas width="240" height="150" data-onizle="' + esc(n.id) + '"></canvas>' +
                            '<div><b>' + esc(n.ad || 'Not') + '</b><span>' + esc(kisaTarih(n.tarih)) + ' · ' + (n.sayfa || 1) + ' sayfa' +
                            (n.id === D.notId ? ' · şu an açık' : '') + '</span></div>' +
                            '<button type="button" class="ys-ogesil" data-notsil="' + esc(n.id) + '" title="Notu sil">&times;</button></div>';
                    }).join('') : '<p class="ys-yok">Bu seviyede kayıtlı not yok.<br>Beğendiğin defteri ★ ile kaydet.</p>');
                L.forEach(function (n) {
                    var c = ic.querySelector('canvas[data-onizle="' + n.id + '"]');
                    if (c) { try { var Ln = defterCoz(n.kod); onizlemeCiz(c, Ln[0], true, Ln.pw, { n: Ln.cizgi, ust: Ln.ust, ph: Ln.ph, g: Ln.cizgi === 'g' }); } catch (e) { } }
                });
            }).catch(function (e) {
                ic.innerHTML = '<p class="ys-yok">Seviye notları okunamadı (' + esc((e && (e.code || e.message)) || e) + ').</p>';
            });
        }
    }
    function gecmistenAc(id) {
        gecmisListe(D.sinif).then(function (L) {
            var k = L.filter(function (x) { return x.id === id; })[0];
            if (!k) return;
            var gec = function () {
                if (D && D.kirli && !bosMu(D.sayfalar) && D.id !== k.id) gecmiseKaydet();
                /* Eski dersin kaydı DEĞİŞMEZ: açılan defter yeni bir kayıt olarak
                   sürer; üzerine yazılırsa kapanınca bugünün tarihiyle ayrıca
                   kaydedilir, yalnız bakılırsa hiçbir şey yazılmaz. */
                var sayfalar = defterCoz(k.kod);
                D = defterHazirla({ id: yeniId(), kaynakId: k.id, sinif: D.sinif, sube: D.sube || '', tarih: Date.now(), guncelleme: 0,
                      sayfalar: sayfalar, aktif: 0, notId: k.notId || '', notAd: '', kirli: false });
                if (UI) { UI.panel.classList.remove('acik'); UI.c = null; cizimAyarla(); }
                bildir(tarihYaz(k.guncelleme, true) + ' açıldı');
            };
            gec();
        });
    }
    function gecmisSilSor(id) {
        soru('Bu sayfa geçmişten silinsin mi? (Seviye notlarındaki kopyası durur.)', 'Sil', true, function () {
            gecmisSil(id, D.sinif).then(function () {
                if (D && D.id === id) { D.id = yeniId(); D.kirli = true; }
                panelCiz();
            });
        });
    }

    /* ---------------- seviye notları ---------------- */
    function notKaydetSor() {
        if (!benKim()) { bildir('Seviye notları için giriş yapmalısın.', true); return; }
        if (bosMu(D.sayfalar)) { bildir('Sayfa boş — önce bir şeyler yaz.', true); return; }
        var varsayilan = D.notAd || (kisaTarih(Date.now()) + (D.sube ? ' · ' + D.sube : '') + ' · ' + kayitSayfalari(D.sayfalar).length + ' sayfa');
        soru(D.notId ? 'Seviye notu güncellensin mi? Adını değiştirebilirsin:' :
             sinifAdi(D.sinif) + ' seviye notlarına kaydedilsin. Bir ad ver:', D.notId ? 'Güncelle' : 'Kaydet', false, function (ad) {
            notKaydet(ad || varsayilan);
        }, varsayilan);
    }
    function notKaydet(ad) {
        var sy = kayitSayfalari(D.sayfalar);
        var kod = defterKodla(sy, D.pw, cizgiDuzeni());
        if (kod.length > NOT_TEK_SINIR) {
            bildir('Bu defter seviye notu için çok yoğun; birkaç sayfasını kaldırıp yeniden dene.', true);
            return;
        }
        notlarHepsi().then(function (Hp) {
            var L = (Hp['s' + D.sinif] || []).slice();
            var i = -1;
            for (var j = 0; j < L.length; j++) if (L[j].id === D.notId) { i = j; break; }
            if (i < 0 && L.length >= NOT_EN_COK) throw new Error('dolu');
            var toplam = 0;
            Object.keys(Hp).forEach(function (s) {
                (Hp[s] || []).forEach(function (n) { if (!(s === 's' + D.sinif && n.id === D.notId)) toplam += (n.kod || '').length; });
            });
            if (toplam + kod.length > NOT_TOPLAM_SINIR) throw new Error('alan');
            var not = { id: i >= 0 ? L[i].id : yeniId(), ad: String(ad).slice(0, 60), tarih: Date.now(), sayfa: sy.length, kod: kod };
            if (i >= 0) L[i] = not; else L.push(not);
            return notlarYaz(D.sinif, L).then(function () { return not; });
        }).then(function (not) {
            D.notId = not.id; D.notAd = not.ad;
            D.kirli = true;
            aracGuncelle();
            bildir('★ Seviye notlarına kaydedildi');
            if (UI && UI.panel.classList.contains('acik') && UI.sek === 'notlar') panelCiz();
        }).catch(function (e) {
            var m = e && e.message;
            if (m === 'dolu') bildir('Bu seviyede ' + NOT_EN_COK + ' not var; yenisi için birini sil.', true);
            else if (m === 'alan') bildir('Seviye notlarına ayrılan yer doldu; eski notlardan birkaçını sil.', true);
            else if (m === 'giris') bildir('Seviye notları için giriş yapmalısın.', true);
            else bildir('Kaydedilemedi: ' + ((e && (e.code || e.message)) || e), true);
        });
    }
    function nottanAc(id) {
        notlarHepsi().then(function (Hp) {
            var n = (Hp['s' + D.sinif] || []).filter(function (x) { return x.id === id; })[0];
            if (!n) return;
            if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet();
            D = defterHazirla({ id: yeniId(), sinif: D.sinif, sube: D.sube, tarih: Date.now(), guncelleme: 0,
                  sayfalar: defterCoz(n.kod), aktif: 0, notId: n.id, notAd: n.ad || '', kirli: false });
            UI.panel.classList.remove('acik');
            UI.c = null; cizimAyarla();
            bildir('“' + (n.ad || 'Not') + '” açıldı');
        });
    }
    function notSilSor(id) {
        soru('Bu seviye notu hesabından silinsin mi? Geri alınamaz.', 'Sil', true, function () {
            notlarHepsi().then(function (Hp) {
                var L = (Hp['s' + D.sinif] || []).filter(function (x) { return x.id !== id; });
                return notlarYaz(D.sinif, L);
            }).then(function () {
                if (D && D.notId === id) { D.notId = ''; D.notAd = ''; aracGuncelle(); }
                panelCiz();
                bildir('Not silindi');
            }).catch(function (e) { bildir('Silinemedi: ' + ((e && (e.code || e.message)) || e), true); });
        });
    }

    /* ------------------------------------------------------------------
       SINIFA BAĞLI AÇILIŞ — Sınıflarım'da (hesap/listelerim.js) açık sınıf
       izlenir. Oraya dokunulmadı: yalnız dışarı açtığı llAktifSinif() ve
       llSinifGorunurMu() okunuyor. Değişiklik iki ardışık bakışta (~1 sn)
       aynı kalırsa uygulanır; veri tazelenirken panelin bir an boşalması
       pencereyi kapatıp açmasın.
       ------------------------------------------------------------------ */
    var BAGLI = null;                         /* { anahtar, sinif, sube, seviyeAd } */
    var DEVAM_SN = 45 * 60;                   /* aynı ders sayılan süre */
    var _aday = '', _adaySay = 0;

    function acikSinif() {
        try {
            if (!ogretmenMi()) return null;
            if (typeof window.llSinifGorunurMu === 'function' && !window.llSinifGorunurMu()) return null;
            var c = document.getElementById('content');
            if (!c || !c.getClientRects().length) return null;          /* Sınıflarım ekranda değil */
            var a = (typeof window.llAktifSinif === 'function') ? window.llAktifSinif() : null;
            if (!a || !a.lId || !a.cId) return null;
            var d = (typeof data !== 'undefined' && data) ? data : null;
            var lvl = d && d.levels ? d.levels[a.lId] : null;
            var cls = lvl && lvl.classes ? lvl.classes[a.cId] : null;
            if (!cls) return null;
            var m = String(lvl.name || '').match(/\d+/);
            var sinif = m ? String(parseInt(m[0], 10)) : 'x' + String(a.lId).replace(/[^A-Za-z0-9_]/g, '').slice(0, 24);
            return { anahtar: a.lId + '|' + a.cId, sinif: sinif, sube: String(cls.name || ''), seviyeAd: String(lvl.name || '') };
        } catch (e) { return null; }
    }

    function sinifIcinAc(b, kucuk) {
        if (kucuk === undefined) kucuk = true;
        BAGLI = b;
        gecmisListe(b.sinif).then(function (L) {
            if (BAGLI !== b) return;                                    /* bu arada sınıf değişti */
            var son = L.filter(function (x) { return (x.sube || '') === b.sube; })[0];
            if (son && son.kod && (Date.now() - (son.guncelleme || 0)) < DEVAM_SN * 1000) {
                ac(b.sinif, { id: son.id, sinif: b.sinif, sube: b.sube, tarih: son.tarih || son.guncelleme, guncelleme: son.guncelleme,
                              sayfalar: defterCoz(son.kod), aktif: 999, notId: son.notId || '', notAd: '', kirli: false }, kucuk);
            } else {
                ac(b.sinif, null, kucuk);
            }
            if (!kucuk) tekBasinaHazir();
        }, function () { if (BAGLI === b) { ac(b.sinif, null, kucuk); if (!kucuk) tekBasinaHazir(); } });
    }
    /* TEK BAŞINA (defter.html, 21.10.2026): sayfa yalnız defter. Sınıf
       adresten gelir; Sınıflarım izlenmez, pencere kapanmaz, küçülmez. */
    var TEK = null;
    function tekBasina(b) {
        if (!b || !b.sinif || !ogretmenMi()) return false;
        TEK = { sinif: String(b.sinif), sube: String(b.sube || ''), seviyeAd: String(b.seviyeAd || '') };
        var bb = { anahtar: 'tek|' + TEK.sinif + '|' + TEK.sube, sinif: TEK.sinif, sube: TEK.sube, seviyeAd: TEK.seviyeAd };
        sinifIcinAc(bb, false);
        return true;
    }
    function tekBasinaHazir() {
        if (!TEK || !UI) return;
        pilKaldir();
        fsDegisti();
        /* kendiliğinden tam ekran yok (21.10.2026): «Tam ekran» tuşu isteğe bağlı; ilk dokunuş da zorlamaz */
        /* sekme kapanırken / yenilenirken kayıp olmasın: 3 sn'de bir kaydedilir */
        setInterval(function () { if (TEK && D && D.kirli) sessizKaydet(); }, 3000);
        cizimAyarla();
    }
    /* «Ana sayfa»: önce defter kaydedilir, sonra gidilir (en çok 1,5 sn beklenir) */
    /* «Ana sayfa» (21.10.2026, öğretmen: "basılınca sekme kapansın, kidefarapca.com'a
       gitmesin"): önce kaydedilir, sonra SEKME KAPANIR; tarayıcı kapatmazsa
       (adres çubuğundan açılmış sekme) ya da tahta çerçevesindeyse ana sayfaya gidilir. */
    function anaSayfayaGit() {
        var p = (D && D.kirli && !bosMu(D.sayfalar)) ? gecmiseKaydet() : Promise.resolve();
        var git = function () {
            if (!kabuktaMi()) {
                try { window.close(); } catch (e) { }
                setTimeout(function () { if (!window.closed) location.href = 'index.html'; }, 400);
            } else location.href = 'index.html';
        };
        Promise.race([p, new Promise(function (r) { setTimeout(r, 1500); })]).then(git, git);
    }

    function sinifIzle() {
        if (TEK) return;
        var b = acikSinif();
        var k = b ? b.anahtar : '';
        var simdiki = BAGLI ? BAGLI.anahtar : '';
        if (k === simdiki) { _aday = ''; _adaySay = 0; return; }
        if (k !== _aday) { _aday = k; _adaySay = 1; return; }
        if (++_adaySay < 2) return;
        _aday = ''; _adaySay = 0;
        kapat(true);                     /* önceki sınıfın defteri tarihiyle kaydedilir */
        BAGLI = null;
        if (b) sinifIcinAc(b);
    }
    setInterval(sinifIzle, 500);

    window.KidefYaziSayfasi = {
        ac: ac, kapat: kapat, kucult: kucult, buyut: buyut, tekBasina: tekBasina,
        tek: function () { return TEK; }, adres: defterAdresi,
        _tamSifirla: function () { if (UI) UI.tamDenendi = false; },      /* deneme */
        bagli: function () { return BAGLI; },
        gorunum: function () { return UI ? { x0: UI.vx0, x1: UI.vx1, c: UI.c, cy: UI.cy, y0: UI.vy0, y1: UI.vy1, Lh: UI.Lh,
                                             pw: D.pw, aktif: D.aktif, n: D.sayfalar.length, dikey: !!UI.dikey, anim: !!UI.anim, pay: UI.ustPay || 0 } : null; },
        yon: function (y) { if (y) yonSec(y); return UI ? (UI.dikey ? 'd' : 'y') : null; },
        arac: function () { return T ? { renk: T.renk, kal: T.kal, uc: T.uc, yon: T.yon, cizgi: T.cizgi, arac: T.arac } : null; },
        durum: function () { return D ? { n: D.sayfalar.length, aktif: D.aktif, cizgi: D.sayfalar.map(function (x) { return x.cizimler.length; }), geri: D.geri.length } : null; },
        pdf: function () { if (!D) return null; var sy = kayitSayfalari(D.sayfalar); return pdfYap(sy.map(function (s, i) { return sayfaGorseli(s, i + 1, sy.length); })); },
        cizgi: function () {
            if (!D) return null;
            var R = cizgiDuzeni();
            return { n: R.g ? 'g' : cizgiSayisi(D.cizgi), g: R.g, ust: D.ust, y: R.g ? guzelYerleri(R) : cizgiYerleri(R) };
        },
        guzelYerleri: guzelYerleri,
        cizgiYerleri: cizgiYerleri,
        /* test ve öteki modüller için */
        kodla: defterKodla, coz: defterCoz, gecmisListe: gecmisListe, kodBoy: kodBoy,
        boy: function () { return D ? { pw: D.pw, ph: D.ph } : null; }
    };
})();
