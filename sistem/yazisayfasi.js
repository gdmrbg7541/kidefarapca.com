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
   DEFTER v17 (21.10.2026, öğretmen: "tüm sayfaların olduğu kısım açılınca sayfanın
   köşesinde eksi görünsün öyle silebilsin ... sadece tüm sayfalar kısmından
   silinebilsin", "güzel yazı defteri ile çizgili defter arasındaki geçişi ve kalem
   çeşitlerini değiştirme sistemini switch şeklinde yap, çizgiliye basınca çizgi
   sayısı için rakam çıksın", "yatayda sayfa yatay olmayacak, sadece dikey
   sayfaların dizilimi yatay olacak, dikeyde ise sayfalar alt alta dizilecek"):
   · Sayfa silme yalnız «Tüm sayfalar»da: kartın köşesindeki kırmızı «−».
     Sayfa çubuğunda «Yeni sayfa» var, «kaldır» yok.
   · Üst çubukta anahtarlar: «Kalem | Hat kalemi», «Çizgili N | Güzel yazı».
     «Çizgili»ye basınca çizgi sayısı rakamları (2·3·4·5·7) açılır.
   · Yatay kipte dikey (A4) sayfalar yan yana (aralarında boşluk, her sayfada
     kenar ve numara); tek uzun kâğıt yok. Eski 625 boyundaki defterler de A4.
   DEFTER v18 (21.10.2026, öğretmen: "defterde sayfaları yatay kısmını iptal
   edelim, sadece dikey mod olsun"): ↕ / ↔ düğmeleri kalktı, defter hep dikey
   (sayfalar alt alta, çubuk solda, kalemler sağda); eski yatay tercihi yok sayılır.
   DEFTER v19 (21.10.2026, öğretmen: "araç çubuğunu header kısmına ekleyelim …
   switchleri alt alta olsun … headerde 2 satır … silgi ileri geri vs tüm elementleri
   headere ekleyelim", "güzel yazı defterinde en altta ve en üstte çok fazla boşluk
   var onu azaltalım"): yüzen sayfa çubuğu kalktı, her şey iki satırlı üst çubukta
   (.ys-ust2: başlık · anahtarlar+kalınlık / defter türü · düzenleme / sayfalar ·
   sağda tam ekran+ana sayfa / seviye notu+geçmiş+PDF); kâğıt çubuğun hemen
   altından başlar. Güzel yazı yeni defterlerde «g8»: 8 satır, üstte 28 altta 22
   birim; eski «g3» defterler eski yerleşimle açılır.
   SİLİK YAZI (23.10.2026, öğretmen: "gri renkte kelimeler olsun üstünden
   geçilebilsin ... ayrıca bi harf görünsün onun altında nasıl yazılması
   gerektiğini öğrenci çizerek göstersin"): çubukta «Silik yazı» — kitabın
   kelimeleri ya da elle yazılan metin sıradaki boş satıra GRİ yazılır, öğrenci
   üstünden geçer; harf dört yazılışıyla koyu yazılır, öğrenci altına yazar.
   Ayrıntı aşağıda (SİLİK YAZI). İmam Hatip'teki «Yazı Çalışması» kartı
   defter.html?yazi=N ile girişsiz açar (YAZI).
   DEFTER v20 (23.10.2026, öğretmen: "defterde kalem renkleri şunlar olsun, mavi
   pembe kırmızı siyah yeşil, ayrıca bi tuşla kalemler yatay olarak yukarıda
   ortada da dizilebilsinler", "en önemli elementler hep açık olsun ama diğerleri
   yukardan aşağıya doğru perde gibi bi sidebar şeklinde olsun, biraz toplu
   olsun", "silik yazı da bi harfe tıklandıktan sonra istenirse o harfin yazılış
   animasyonuna bakılabilsin, her harfe tıklanınca büyük bi şekilde yazılış
   animasyonu başlasın"):
   · Kalemler mavi · pembe · kırmızı · siyah · yeşil (1-5 tuşları da bu sırayla);
     kayıttaki renk numaraları değişmedi, eski defterlerin turuncusu turuncu
     açılır (RENKLER, KALEM_SIRA).
   · Kalem sütununun altındaki tuş kalemleri üst çubuğun ortasına yatay dizer;
     oradaki tuş geri sağa alır (perdede de «Kalemler: Sağda | Üstte»).
   · Üst çubuk TEK SATIR (.ys-ust3): ☰ · geri al, yinele, silgi, sayfayı sil ·
     ▲ sayfa ▼ · Silik yazı · (kalemler) · Ana sayfa / Küçült. Ötekiler ☰ ile
     solda yukarıdan aşağı inen perdede (#ysPerde): kalem çeşidi, kalınlık,
     kalemlerin yeri · defter türü · sayfalar, tam ekran · seviye notu,
     geçmiş, PDF.
   · «Silik yazı» → Harf: harfe basınca dört yazılışı alfabe sayfasındaki
     motorla büyük yazılır; tahtaya da yansır (HARFİN YAZILIŞI).
   DEFTER v21 (23.10.2026, öğretmen: "defterde silik yazı seçeneğini de
   sidebarın içine al, kalemlerin dizilimi yatay ve yukarda olsun", "defterde
   side bar tuşu hariç araçları ortaya al, sayfa okları sayfa sayısını
   gösteren kısmı aşağı al"):
   · Üst çubuk: solda yalnız ☰; geri al, yinele, silgi, sayfayı sil ve
     kalemler ORTADA; sağda Ana sayfa / Küçült.
   · ▲ sayfa ▼ kâğıdın altında ortada (altNavHtml, .ys-altnav).
   · «Silik yazı» perdenin en başında.
   · Kalemler öntanımlı olarak üstte, yan yana (tercih «kyer»; perdeden
     «Sağda» seçilebilir).
   DEFTER v22 (23.10.2026, öğretmen: "defterde sidebarda çizgiliye basınca
   rakamlar kapanmasın"): defter çizgiliyken perdedeki çizgi sayısı rakamları
   hep açık; «Çizgili»ye basmak ya da rakam seçmek kapatmaz, güzel yazıda gizli.
   Aynı gün ("anasayfa tuşu soldaki side barın bi parçası olsun ve sadece svg
   olsun, side bar açıkken kaybolsun, side bar kapanınca ortaya çıksın"): Ana
   sayfa / Küçült ☰'nin yanında, yalnız simge (.ys-ev); perde açıkken gizli.
   DEFTER v23 (24.10.2026, öğretmen: "defterde anasayfa svg si kırmızı dolgulu ve
   en solda olsun"): Ana sayfa en solda (☰'den önce), kırmızı dolgulu ev
   (IK.evDolu), zeminsiz; perde açıkken görünmez, yeri kalır (☰ kaymaz).
   DEFTER v24 (24.10.2026, öğretmen: "silik yazı kısmında harf eklenince yazılış
   animasyonu için rehber harflere tıklayınca o harfin yazılışı çıksın, popup
   olmadan ve sadece o harfin yazılış animasyonu açılmalı"): harf konunca büyük
   kart açılmaz; kâğıttaki koyu rehber harfe dokununca YALNIZ o yazılış, harfin
   kendi yerinde ve boyunda yazılır (rehberOynat). Dokunuş çizgi bırakmaz;
   sürüklenir ya da basılı tutulursa yazı olur. Tahtaya da yansır ('ra').
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
    var SAYFA_ARA = 12;                        /* yatay kipte yan yana sayfaların arasındaki gri boşluk (birim) */
    function sayfaYuk() { return (D && D.ph) || H; }
    /* KALEM RENKLERİ (23.10.2026, öğretmen: "defterde kalem renkleri şunlar
       olsun, mavi pembe kırmızı siyah yeşil"): kalemler KALEM_SIRA sırasıyla
       dizilir (1-5 tuşları da). Kayıtta rengin NUMARASI saklanır ve numaralar
       değişmedi: eski defterlerin turuncusu (4) turuncu açılır, pembe yeni (5).
       Eski sürüm 5'i 4'e yuvarlar (turuncu görünür), defter yine açılır. */
    var RENKLER = [
        { ad: 'Siyah',   k: '#1F2430' },
        { ad: 'Mavi',    k: '#1E5BD8' },
        { ad: 'Kırmızı', k: '#D93025' },
        { ad: 'Yeşil',   k: '#188038' },
        { ad: 'Turuncu', k: '#EA7A0C' },
        { ad: 'Pembe',   k: '#E84393' }
    ];
    var KALEM_SIRA = [1, 5, 2, 0, 3];                  /* mavi · pembe · kırmızı · siyah · yeşil */
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
    var GUZEL_SATIR = 3, GUZEL_ALT = 22;       /* güzel yazı (eski düzen g3): blok başına satır, alttaki pay (birim) */
    var GUZEL_SATIR_A4 = 8;                    /* yeni düzen (g8, 21.10.2026): A4 sayfada 8 satır, üstte yalnız ust payı */
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
        return { r: silgi ? 0 : Math.max(0, Math.min(RENKLER.length - 1, +t.charAt(0) || 0)), k: silgi ? 'o' : t.charAt(1), s: silgi ? 1 : 0, p: p };
    }
    function cizgiSayisi(n) {
        n = parseInt(n, 10);
        return (n >= CIZGI_EN_AZ && n <= CIZGI_EN_COK) ? n : CIZGI_VARSAYILAN;
    }
    function defterKodla(sayfalar, pw, R) {
        /* çizgi alanı: sayı (çizgili) ya da 'g3' (güzel yazı, 3 satır) */
        var n = (R && R.g) ? 'g' + ((R.gsat >= 4) ? R.gsat : GUZEL_SATIR) : cizgiSayisi(R && R.n);
        var ust = (R && R.ust != null) ? Math.max(0, Math.round(R.ust)) : UST_BOSLUK;
        var ph = Math.round((R && R.ph) || H);
        return 'Y4|' + Math.round(pw || W) + '|' + ph + '|' + n + '|' + ust + '|' + sayfalar.map(function (s) {
            return sayfaGovde(s);                                  /* çizgiler + silik yazılar */
        }).join('\n');
    }
    function defterCoz(kod) {
        var govde = null, pw = 0, cn = CIZGI_VARSAYILAN, ust = UST_BOSLUK, ph = H, gsat = 3;
        if (kod && kod.indexOf('Y4|') === 0) {
            var b1 = kod.indexOf('|', 3), b2 = kod.indexOf('|', b1 + 1), b3 = kod.indexOf('|', b2 + 1), b4 = kod.indexOf('|', b3 + 1);
            if (b1 > 0 && b2 > b1 && b3 > b2 && b4 > b3) {
                pw = parseInt(kod.slice(3, b1), 10) || W;
                ph = parseInt(kod.slice(b1 + 1, b2), 10) || H;
                var alan4 = kod.slice(b2 + 1, b3), gm4 = /^g(\d+)/i.exec(alan4);
                cn = /^g/i.test(alan4) ? 'g' : cizgiSayisi(alan4);
                if (gm4) gsat = parseInt(gm4[1], 10) || 3;
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
            var z = sayfaParcala(ps);
            var sy = yeniSayfa('c'); sy.cizimler = z.c; sy.silik = z.s; return sy;
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
        /* her defter dikey (A4) sayfa (21.10.2026, öğretmen: "yatayda sayfa yatay
           olmayacak"): eski 625 boyundaki defterler de A4 açılır — yazı üstte aynen */
        L.ph = Math.max(A4_BOY, Math.min(4000, ph));
        L.cizgi = cn;
        L.gsat = gsat;                                           /* güzel yazı düzeni: 3 eski, 8 yeni */
        L.ust = ust;
        return L;
    }
    /* kayıt kodundan yalnız sayfa boyu (listeler için, bütün kodu çözmeden) */
    function kodBoy(kod) {
        if (kod && kod.indexOf('Y4|') === 0) {
            var b1 = kod.indexOf('|', 3), b2 = kod.indexOf('|', b1 + 1);
            var v = parseInt(kod.slice(b1 + 1, b2), 10);
            if (v >= 200 && v <= 4000) return Math.max(A4_BOY, v);
        }
        return A4_BOY;
    }
    /* sondaki boş sayfalar (‹ ile açılıp yazılmayan) kaydedilmez, PDF'e girmez */
    function kayitSayfalari(L) {
        var n = L.length;
        while (n > 1 && !L[n - 1].cizimler.length && !(L[n - 1].silik && L[n - 1].silik.length)) n--;
        return L.slice(0, n);
    }
    function yeniSayfa(mod) { return { mod: mod || 'c', cizimler: [], silik: [], geri: [], ileri: [] }; }

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
        return !sayfalar.some(function (s) { return s.cizimler.length || (s.silik && s.silik.length); });
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
                 ph: (d && d.ph) || H, gsat: (d && d.gsat) || 3 };
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
        var ph = (R && R.ph) || H, ust, B, L = [], adet;
        if (R && R.gsat >= 4) {
            /* YENİ DÜZEN (21.10.2026, öğretmen: "güzel yazı defterinde en altta ve en üstte
               çok fazla boşluk var onu azaltalım"): üstte yalnız ust payı, altta GUZEL_ALT;
               satırlar sayfaya eşit yayılır (A4: 8 satır) */
            ust = (R.ust != null) ? R.ust : UST_BOSLUK;
            adet = Math.max(1, Math.min(30, R.gsat));
            B = (ph - ust - GUZEL_ALT) / adet;
        } else {
            /* eski düzen (g3): ilk satır yüzen sayfa çubuğunun altından, blok başına 3 satır */
            ust = ((R && R.ust != null) ? R.ust : UST_BOSLUK) + GUZEL_UST_EK;
            B = (BLOK - ust - GUZEL_ALT) / GUZEL_SATIR;
            adet = Math.max(1, Math.min(30, Math.floor((ph - ust - GUZEL_ALT) / B + 1e-6)));   /* A4: 7 satır */
        }
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
    /* YATAY KİP (21.10.2026, öğretmen: "yatayda sayfa yatay olmayacak, sadece dikey
       sayfaların dizilimi yatay olacak"): ekrandaki pencere [vx0, vx1]; dikey (A4)
       sayfalar sağdan sola YAN YANA — aralarında gri boşluk, her sayfada kendi
       çizgileri, kırmızı kenarı (sağda) ve numarası. Tek uzun kâğıt görünümü yok. */
    function seritCiz(ctx, o, vx0, vx1) {
        var sag = SAG(), pw = D.pw, n = D.sayfalar.length, ph = sayfaYuk(), R = cizgiDuzeni();
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -vx0 * o, 0);
        ctx.fillStyle = '#E9EDF2';                                        /* sayfalar arası ve kâğıdın sonu */
        ctx.fillRect(vx0, 0, vx1 - vx0, ph);
        var jmin = Math.max(0, Math.floor((sag - vx1) / pw)), jmax = Math.min(n - 1, Math.floor((sag - vx0) / pw));
        for (var j = jmin; j <= jmax; j++) {
            var b = sag - j * pw, a = b - pw + SAYFA_ARA;                  /* boşluk sayfanın solunda */
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(a, 0, b - a, ph);
            cizgiDesen(ctx, a, b - 18, R);
            kenarCiz(ctx, b - 44);
            ctx.save();
            ctx.fillStyle = '#9AA6B4'; ctx.font = '700 15px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(String(j + 1), a + 12, 7);
            ctx.restore();
        }
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
        silikCizO(ctx, sayfa, o, g.x0, 0);
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
            /* ANAHTARLAR (21.10.2026): «Kalem | Hat kalemi», «Çizgili N | Güzel yazı» — yeşil
               tutamak seçili yana kayar; «Çizgili»nin altında çizgi sayısı rakamları açılır */
            '.ys-anahtar{position:relative; display:inline-flex; align-items:stretch; padding:3px; height:34px; box-sizing:border-box;',
            '  background:#E3E8EF; border-radius:999px; flex:none;}',
            '.ys-anahtar .ys-top{position:absolute; top:3px; bottom:3px; left:3px; width:calc(50% - 3px); border-radius:999px;',
            '  background:#16A085; box-shadow:0 2px 6px rgba(14,124,102,.35); transition:transform .18s ease; pointer-events:none;}',
            '.ys-anahtar.ikinci .ys-top{transform:translateX(100%);}',
            '.ys-asec{position:relative; z-index:1; flex:1 1 0; min-width:0; border:0; background:transparent; border-radius:999px;',
            '  padding:0 11px; height:28px; display:inline-flex; align-items:center; justify-content:center; gap:5px; color:#3D4756;',
            '  font-family:inherit; font-size:.8rem; font-weight:800; cursor:pointer; white-space:nowrap; transition:color .15s;}',
            '.ys-asec svg{width:18px; height:18px; flex:none;}',
            '.ys-asec[aria-checked="true"]{color:#fff;}',
            '.ys-asec .ys-csn{display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px; padding:0 4px;',
            '  border-radius:999px; background:rgba(44,62,80,.1); font-size:.74rem; font-weight:900; font-variant-numeric:tabular-nums;}',
            '.ys-asec[aria-checked="true"] .ys-csn{background:rgba(255,255,255,.3);}',
            '.ys-csec{position:relative;}',
            '.ys-cpop{position:absolute; top:calc(100% + 6px); left:0; z-index:9; display:flex; align-items:center; gap:4px; padding:6px;',
            '  background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(15,23,42,.18), 0 0 0 1px #DDE3EA; animation:ysSol .15s ease-out;}',
            '.ys-cpop[hidden]{display:none;}',
            '.ys-cpop .ys-csay{min-width:38px; height:38px; font-size:1.05rem;}',
            '.ys-cpop .ys-cet{padding:0 6px 0 4px;}',
            /* «Tüm sayfalar»: kartın köşesinde kırmızı «−» — sayfa silme yalnız burada */
            '.ys-gkap{position:relative; display:flex; min-width:0;}',
            '.ys-gkap .ys-gkart{flex:1 1 auto; width:100%; min-width:0;}',
            '.ys-gsil{position:absolute; top:-9px; left:-9px; z-index:2; width:30px; height:30px; border:0; border-radius:50%; padding:0;',
            '  background:#E74C3C; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;',
            '  box-shadow:0 3px 10px rgba(192,57,43,.4), 0 0 0 2px #fff; transition:transform .12s, background .12s;}',
            '.ys-gsil svg{width:16px; height:16px;}',
            '.ys-gsil:hover{background:#C0392B; transform:scale(1.1);}',
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
            '@media (max-width:1180px){.ys-asec span{display:none;} .ys-asec{padding:0 9px;}}',
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
            '  .ys-anahtar{height:30px;} .ys-asec{height:24px; padding:0 8px;} .ys-asec svg{width:16px; height:16px;}',
            '  .ys-cpop .ys-csay{min-width:34px; height:34px;} .ys-gsil{width:26px; height:26px; top:-7px; left:-7px;}',
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
            '@media (prefers-reduced-motion: reduce){#ysOrt,#ysKutu,.ys-bildiri,#ysPil{animation:none;} .ys-panel{transition:none;}}',
            /* İKİ SATIRLI ÜST ÇUBUK (21.10.2026): bloklar yan yana, her blok iki satır */
            '.ys-arac.ys-ust2{display:flex; align-items:stretch; flex-wrap:nowrap; gap:10px; padding:8px 12px; position:static; row-gap:8px;}',
            '.ys-arac.ys-ust2::after{content:none;}',
            '.ys-ust2 .ys-baslik{align-self:center; margin-inline-end:2px;}',
            '.ys-ust2 .ys-blok{display:flex; flex-direction:column; justify-content:center; gap:6px; flex:none;}',
            '.ys-ust2 .ys-satir{display:flex; align-items:center; gap:4px; min-height:36px;}',
            '.ys-ust2 .ys-blok-sec,.ys-ust2 .ys-blok-duzen{padding:5px 7px; background:#F2F5F9; border-radius:16px;}',
            '.ys-ust2 .ys-blok-sec .ys-anahtar{flex:1 1 auto; min-width:0;}',
            '.ys-ust2 .ys-blok-sec .ys-kalin{display:inline-flex; align-items:center; gap:2px; margin-inline-start:4px; padding-inline-start:6px; border-inline-start:1px solid #DDE3EA;}',
            '.ys-ust2 .ys-csec{position:relative;}',
            '.ys-ust2 .ys-blok-duzen .ys-t{width:38px; height:36px; min-width:38px; padding:0; border-radius:10px; background:#fff; box-shadow:0 0 0 1px #E2E7EE;}',
            '.ys-ust2 .ys-blok-duzen .ys-t:hover{background:#E5EBF3;}',
            '.ys-ust2 .ys-blok-duzen .ys-t[disabled]{background:#fff; box-shadow:0 0 0 1px #EEF1F5;}',
            '.ys-ust2 .ys-blok-duzen .ys-t svg{width:21px; height:21px;}',
            '.ys-ust2 .ys-gara{width:1px; height:24px; background:#DDE3EA; margin:0 4px; flex:none;}',
            '.ys-ust2 .ys-nav .ys-ok{width:46px; min-width:46px; color:#0E7C66; box-shadow:0 0 0 1px #CFE6DF;}',
            '.ys-ust2 .ys-nav .ys-ok svg{width:26px; height:26px;}',
            '.ys-ust2 .ys-nav .ys-ok:hover{background:#D6F0E9;}',
            '.ys-ust2 .ys-nav .ys-sayfa{font-size:1.05rem; min-width:64px; text-align:center; font-weight:900;}',
            '.ys-ust2 .ys-dgrup .ys-t[data-is="silgi"].sec{background:#16A085; color:#fff; box-shadow:none;}',
            '.ys-ust2 .ys-dgrup .ys-t[data-is="temizle"]:not([disabled]):hover{background:#FDEDEC; color:#C0392B;}',
            '.ys-ust2 .ys-blok-sag{align-items:flex-end; margin-inline-start:auto;}',
            '.ys-ust2 .ys-blok-sag .ys-satir{justify-content:flex-end;}',
            '.ys-ust2 .ys-pencere{position:static; order:0; margin-left:0;}',
            /* orta blok tek satır, simgeler büyük (21.10.2026) */
            '.ys-ust2 .ys-duzen-satir{gap:5px;} .ys-ust2 .ys-dgrup,.ys-ust2 .ys-nav{display:inline-flex; align-items:center; gap:5px;}',
            '.ys-ust2 .ys-blok-duzen .ys-t{width:46px; height:44px; min-width:46px; border-radius:12px;}',
            '.ys-ust2 .ys-blok-duzen .ys-t svg{width:26px; height:26px;}',
            '.ys-ust2 .ys-nav .ys-ok{width:56px; min-width:56px;} .ys-ust2 .ys-nav .ys-ok svg{width:34px; height:34px;}',
            '.ys-ust2 .ys-nav .ys-sayfa{font-size:1.15rem; min-width:70px;}',
            '.ys-ust2 .ys-gara{height:28px;}',
            '@media (max-width:940px){.ys-arac.ys-ust2{flex-wrap:wrap; gap:6px; padding:6px 8px;} .ys-ust2 .ys-blok{gap:4px;}',
            '  .ys-ust2 .ys-blok-sag{margin-inline-start:auto;} .ys-ust2 #ysNotYazi{display:none;} .ys-ust2 .ys-baslik span{display:none;}}',
            '@media (max-width:760px){.ys-ust2 .ys-satir{min-height:32px;} .ys-ust2 .ys-blok-duzen .ys-t{width:36px; height:36px; min-width:36px;}',
            '  .ys-ust2 .ys-blok-duzen{order:5;}',                     /* telefon: 1. satır anahtarlar + sağ blok, 2. satır düzenleme/sayfalar */
            '  .ys-ust2 .ys-blok-duzen .ys-t svg{width:22px; height:22px;} .ys-ust2 .ys-nav .ys-ok{width:44px; min-width:44px;} .ys-ust2 .ys-nav .ys-ok svg{width:27px; height:27px;}',
            '  .ys-ust2 .ys-nav .ys-sayfa{font-size:.95rem; min-width:46px;} .ys-ust2 .ys-blok-sec,.ys-ust2 .ys-blok-duzen{padding:4px 5px; border-radius:13px;}',
            '  .ys-ust2 .ys-duzen-satir,.ys-ust2 .ys-dgrup,.ys-ust2 .ys-nav{gap:3px;}',
            '  .ys-ust2 .ys-blok-duzen{max-width:100%; overflow:hidden;}',
            '  .ys-ust2 .ys-blok-sec .ys-kalin{margin-inline-start:2px; padding-inline-start:3px;} .ys-ust2 .ys-gara{margin:0 2px;}}',
            /* dar telefon: orta blok tek satırda sığsın */
            '@media (max-width:440px){.ys-ust2 .ys-blok-duzen .ys-t{width:32px; height:34px; min-width:32px; border-radius:9px;} .ys-ust2 .ys-blok-duzen .ys-t svg{width:20px; height:20px;}',
            '  .ys-ust2 .ys-nav .ys-ok{width:38px; min-width:38px;} .ys-ust2 .ys-nav .ys-ok svg{width:24px; height:24px;} .ys-ust2 .ys-nav .ys-sayfa{min-width:40px; font-size:.9rem;}',
            '  .ys-ust2 .ys-duzen-satir,.ys-ust2 .ys-dgrup,.ys-ust2 .ys-nav{gap:2px;} .ys-ust2 .ys-blok-duzen .ys-gara{margin:0 1px;} .ys-ust2 .ys-blok-duzen{padding:3px 4px;}}'
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
        eksi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M6 12h12"/></svg>',
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
        if (!ogretmenMi() && !YAZI) return;
        stilKur();
        kapat(true);
        var t = tercihOku();
        T = { arac: 'kalem', renk: KALEM_SIRA.indexOf(t.renk) >= 0 ? t.renk : 1, kal: t.kal || 'o', mod: t.mod || 'c',
              ky: t.kyer === 'sag' ? 'sag' : 'ust',                                /* kalemlerin yeri: öntanımlı üstte (v21; eski «ky» okunmaz) */
              cizgi: tercihCizgi(t.cizgi), yon: 'd', uc: t.uc === 'h' ? 'h' : 'y',
              sayi: CIZGI_SECENEK.indexOf(+t.sayi) >= 0 ? +t.sayi : null };      /* güzel yazıdan dönünce gelen çizgi sayısı */
        if (T.sayi == null) T.sayi = T.cizgi === 'g' ? CIZGI_VARSAYILAN : T.cizgi;
        T.sk = skTercih(t.sk);
        D = kaynak || { id: yeniId(), sinif: sinif, sube: BAGLI ? BAGLI.sube : subeAdi(), tarih: Date.now(), guncelleme: 0,
                        sayfalar: [yeniSayfa('c')], aktif: 0, notId: '', notAd: '', kirli: false, pw: W, ph: A4_BOY,
                        cizgi: YAZI ? 'g' : T.cizgi, ust: UST_BOSLUK, gsat: GUZEL_SATIR_A4 };      /* yazı çalışması güzel yazı satırlarıyla */
        defterHazirla(D);
        kur(kucukBasla);
        cizimAyarla();
        yansitKur();                                   /* tahta kabuğunda: öbür ekrana */
        if (!kaynak) { if (kucukBasla) UI.oneriBekle = true; else sonDefterOnerisi(); }
    }

    function kur(kucuk) {
        var ort = document.createElement('div');
        ort.id = 'ysOrt';
        if (kucuk) ort.classList.add('kucuk');
        /* kalem düğmesinde iki simge: yuvarlak uç / hat kalemi (seçime göre biri görünür) */
        /* sıra KALEM_SIRA (23.10.2026); data-renk kayıttaki numara */
        var kalemler = KALEM_SIRA.map(function (ri, i) {
            var r = RENKLER[ri];
            return '<button type="button" class="ys-renk" data-renk="' + ri + '" style="background:' + r.k + '; --rk:' + r.k + '" title="' +
                   esc(r.ad) + ' kalem (' + (i + 1) + ')" aria-label="' + esc(r.ad) + ' kalem">' +
                   '<span class="ik-k">' + IK.kalem + '</span><span class="ik-h">' + IK.hatUc + '</span></button>';
        }).join('');
        /* yanlarda yalnız kalemler; silgi üstte, geri al / yinele'nin yanında
           (20.10.2026, öğretmen: "silgi geri ileri tuşunun olduğu yerde olsun") */
        var yan = function (taraf) {
            return '<div class="ys-yan ' + taraf + '" aria-label="Kalemler">' + kalemler + kalemYerTusu(taraf) + '</div>';
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
              /* TEK SATIRLIK ÜST ÇUBUK VE PERDE (23.10.2026): ustCubukHtml — eski iki
                 satırlı çubuğun (21.10.2026) yerine; ayrıntı aşağıda */
              ustCubukHtml(yan, kalin, csay) +
              '<div class="ys-sahne" id="ysSahne">' +
                '<div class="ys-kagit" id="ysKagit">' +
                  '<canvas class="ys-alt"></canvas><canvas class="ys-ust"></canvas>' +
                  '<div class="ys-silgi-iz"></div>' +
                  altNavHtml() +                                /* ▲ sayfa ▼ kâğıdın altında (v21) */
                '</div>' +
                /* dikey kipte kalın kaydırma çubuğu solda ("dikeyde solda olsun scroll çubuğu") */
                '<div class="ys-dray" id="ysRayD" role="scrollbar" aria-orientation="vertical" aria-controls="ysKagit"' +
                  ' aria-label="Sayfalar arasında kaydır" aria-valuemin="1" aria-valuemax="1" aria-valuenow="1"' +
                  ' title="Sürükle ya da bir sayfaya bas — 1. sayfa üstte">' +
                  '<div class="ys-ray-sayfalar"></div>' +
                  '<div class="ys-tutamak" id="ysTutamakD"><b>1</b></div>' +
                '</div>' +
                yan('sol') + yan('sag') + silikPanelHtml() +
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
            cpop: ort.querySelector('#ysCpop'),
            dikey: true                                   /* YALNIZ DİKEY (21.10.2026) */
        };
        UI.kutu.classList.toggle('dikey', UI.dikey);
        silikStilKur();
        silikKur();
        perdeStilKur();
        perdeKur();
        ort.addEventListener('click', tikla);
        /* DOKUNUŞTAN SONRA GELEN TIKLAMA (v21): pointerup'ta işlenen düğme bir şey
           açtıysa (perdeden «Silik yazı», «Tüm sayfalar», soru penceresi…),
           tarayıcının dokunuşun ardından gönderdiği tıklama parmağın altına yeni
           açılan öğeye düşüyordu (pencereyi kapatan ×, bir sayfa kartı, soru
           penceresinin boşluğu). O tıklama yakalama evresinde yutulur. Klavye ve
           koddan gelen tıklamalar (detail 0) dokunulmaz. */
        ort.addEventListener('click', function (e) {
            var sh = UI && UI.sonHizli;
            if (!sh || sh.x == null || !e.detail || Date.now() - sh.z > 800) return;
            if (Math.abs(e.clientX - sh.x) > 14 || Math.abs(e.clientY - sh.y) > 14) return;
            UI.sonHizli = null;
            e.stopPropagation(); e.preventDefault();
        }, true);
        ort.addEventListener('pointerdown', hizliSec);
        ort.addEventListener('pointerdown', tapBas);
        ort.addEventListener('pointerup', tapBirak);
        ort.addEventListener('pointercancel', function () { _tap = null; });
        ort.addEventListener('pointerdown', function (e) {
            var t = e.target;
            if (UI && UI.cpop && !UI.cpop.hidden && !UI.cpop.contains(t) && !(t.closest && t.closest('[data-dt]'))) cpopKapat();
        });
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
        rolYenile();
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
        silikKapat();
        perdeKapat(true);
        harfAnimKapat();
        raDurdur(true, true);                          /* v24: rehber harfin yazılışı */
        UI.panel.classList.remove('acik');
        if (D && D.kirli && !bosMu(D.sayfalar)) gecmiseKaydet();
        UI.kucuk = true;
        UI.ort.classList.add('kucuk');
        yansitBirak();                                 /* küçükken yansıtılmaz */
        document.body.style.overflow = _govdeTasma || '';
        pilGoster();
    }
    function buyut() {
        if (!UI || !UI.kucuk) return;
        UI.kucuk = false;
        UI.ort.classList.remove('kucuk');
        yansitKur();
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
        return (D.sube && !YAZI) ? a + ' · ' + D.sube : a;
    }

    /* tekerlek ve dokunmatik yüzey kâğıdı kaydırır: dikeyde aşağı = ileri;
       yatayda aşağı/sola = ileri (sola) */
    function tekerlek(e) {
        if (!UI || !D || UI.kucuk || UI.genel) return;
        if (UI.silik && !UI.silik.hidden && UI.silik.contains(e.target)) return;      /* pencerenin listesi kendi kayar */
        if (HY && HY.kap.contains(e.target)) return;                                    /* harfin yazılışı kartı */
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
        yansitBirak();
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
        if (_rb) clearTimeout(_rb.z);
        if (RA) { clearTimeout(RA.z); hyDurdur(RA.a); }
        _rb = null; RA = null; _raSol = null; _raTok++;          /* v24 */
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
    function enCokY() { var n = D.sayfalar.length, p = UI.ustPay || 0, ph = sayfaYuk(); return Math.max(-p, (n - 1) * ph - p, n * ph - UI.Lh + (UI.altPay || 0)); }
    function sinirliY(y) { return Math.max(enAzY(), Math.min(enCokY(), y)); }
    function defterHazirla(d) {
        if (!d.pw) d.pw = (d.sayfalar && d.sayfalar.pw) || W;
        if (!d.ph) d.ph = (d.sayfalar && d.sayfalar.ph) || A4_BOY;
        d.ph = Math.max(A4_BOY, d.ph);                     /* eski (625) defterler de dikey A4 sayfa */
        if (d.cizgi !== 'g' && !(d.cizgi >= CIZGI_EN_AZ && d.cizgi <= CIZGI_EN_COK)) {
            var sc = d.sayfalar && d.sayfalar.cizgi;
            d.cizgi = sc === 'g' ? 'g' : cizgiSayisi(sc);
        }
        if (d.ust == null) d.ust = (d.sayfalar && d.sayfalar.ust != null) ? d.sayfalar.ust : UST_BOSLUK;
        if (d.gsat == null) d.gsat = (d.sayfalar && d.sayfalar.gsat) || 3;
        d.geri = d.geri || []; d.ileri = d.ileri || [];
        d.sayfalar.forEach(function (sy) { sy.mod = 'c'; if (!sy.silik) sy.silik = []; });
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
        serit = silikSerit(serit, sw);                         /* «Silik yazı» penceresi açıkken */
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
            /* ▲ sayfa ▼ kâğıdın altında (v21): örttüğü şerit kaydırmada hesaba katılır */
            var an = UI.kagit.querySelector('.ys-altnav');
            UI.altPay = an && an.offsetHeight ? Math.min(UI.Lh * 0.3, Math.max(0, (gh - an.offsetTop + 6) / UI.cssOlcek)) : 0;
        } else {
            UI.Lw = sayfaYuk() * gw / gh;
            UI.cssOlcek = gw / UI.Lw;
            UI.Lh = sayfaYuk();
            UI.ustPay = 0; UI.altPay = 0;
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
        if (UI.perdeAcik) perdeBoyutla();
        if (HY) hyBoyutla();
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
        yGorusZamanla();
    }
    /* sürükleme / tekerlek: d > 0 1. sayfaya doğru (yatayda sağa, dikeyde
       yukarı), d < 0 ileri. Kâğıdın sonundan öteye geçilirse son sayfada
       yazı varsa kâğıt bir sayfa uzar. */
    function kaydirBy(d) {
        if (!UI || !D || !d) return;
        if (UI.anim) { cancelAnimationFrame(UI.anim); UI.anim = 0; }
        var n = D.sayfalar.length, sonDolu = D.sayfalar[n - 1].cizimler.length || (D.sayfalar[n - 1].silik || []).length;
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
            silikYaz(ctx, D.sayfalar[j]);                 /* silik yazı: çizgilerle birlikte alt tuvalde (silgi silmez) */
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
            if (YK) for (var uk in YK.uzak) yParcaCiz(YK.uzak[uk], 0);           /* yansıtma: öbür cihazda yazılmakta olan çizgi */
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
        if (RA || _raSol) raKonumla();                   /* v24: yerinde yazılan rehber harf kâğıtla kayar */
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
        if (perdeAcik()) { e.preventDefault(); perdeKapat(); return; }     /* ilk dokunuş yalnız perdeyi kapatır */
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
            if (_rb) { clearTimeout(_rb.z); _rb = null; }        /* v24: bekleyen rehber dokunuşu da */
            var o0 = e.pointerType === 'touch' ? dokunOrt() : [e.clientX, e.clientY];
            /* v24: kalem kullanılırken parmakla rehber harfe TEK dokunuş da yazılışı açar */
            var tekP = (e.pointerType === 'touch' && dokunSay() === 1) || (T.arac === 'el' && e.pointerType !== 'touch' && e.button === 0);
            _kay = { x: o0[0], y: o0[1], d: tekP ? { x: e.clientX, y: e.clientY, t: Date.now() } : null };
            UI.kagit.classList.add('suruk');
            return;
        }
        if (_kay) return;
        if (yIzleyen()) return;                              /* yansıtmada izleyen ekran çizmez */
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
        /* v24: koyu rehber harfe basınca çizgi hemen başlamaz: kalkarsa o harfin
           yazılışı yerinde oynar, sürüklenir ya da basılı kalırsa yazı olur */
        if (!silgiMi && rehberBekle(e, j, p)) return;
        kalemBaslat(e.pointerId, j, p, silgiMi);
        if (T.arac === 'silgi') { izKonum(e); UI.iz.classList.add('gor'); }
    }
    function kalemBaslat(id, j, p, silgiMi) {
        var kay = yerelKay(j), of = sayfaOfset(j);
        /* hat kalemi: kalınlık harfi büyük (I/O/K) */
        var kal = silgiMi ? 'o' : (T.uc === 'h' ? String(T.kal || 'o').toUpperCase() : T.kal);
        _cz = { id: id, j: j, kay: kay, ox: of[0], oy: of[1],
                c: { r: T.renk, k: kal, s: silgiMi ? 1 : 0, p: [p[0] + kay[0], p[1] + kay[1]] } };
        var ctx = UI.ust.getContext('2d');
        cizimCiz(ctx, _cz.c, UI.olcek, _cz.ox, _cz.oy);
        yCizBasla(_cz);
    }
    function kalemOynat(e) {
        if (e.pointerType === 'touch' && (e.pointerId in _dok)) _dok[e.pointerId] = [e.clientX, e.clientY];
        if (_kay) {
            var q = e.pointerType === 'touch' ? dokunOrt() : [e.clientX, e.clientY];
            if (_kay.d && Math.abs(e.clientX - _kay.d.x) + Math.abs(e.clientY - _kay.d.y) > 10) _kay.d = null;     /* v24: dokunuş değil, kaydırma */
            var dx = q[0] - _kay.x, dy = q[1] - _kay.y;
            _kay.x = q[0]; _kay.y = q[1];
            /* kâğıt parmağı izler */
            if (dikeyMi()) { if (dy) kaydirBy(dy / UI.cssOlcek); }
            else if (dx) kaydirBy(-dx / UI.cssOlcek);
            return;
        }
        if (T && T.arac === 'silgi' && UI) { izKonum(e); UI.iz.classList.add('gor'); }
        if (_rb && e.pointerId === _rb.id) {                     /* v24: rehber harfte bekleyen dokunuş */
            if (Math.abs(e.clientX - _rb.x) + Math.abs(e.clientY - _rb.y) < 9) return;
            rehberYaz();                                         /* sürükleniyor: yazı başlar */
        }
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
                ctx.fillStyle = (RENKLER[c.r] || RENKLER[0]).k;
                ctx.beginPath(); hatDortgen(ctx, lx, ly, px, py, u[0], u[1]); ctx.fill();
                ctx.restore();
                return;
            }
            /* yalnız son parça çizilir: önceki orta noktadan yeni orta noktaya */
            var m = c.p.length / 2;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = c.s ? '#000' : (RENKLER[c.r] || RENKLER[0]).k;
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
        yCizZamanla();
    }
    function kalemBirak(e) {
        if (e && e.pointerType === 'touch') delete _dok[e.pointerId];
        if (_kay) {
            if (e && e.pointerType === 'touch' && dokunSay() > 0) { var q = dokunOrt(); _kay.x = q[0]; _kay.y = q[1]; _kay.d = null; return; }
            var kd = _kay.d;
            _kay = null;
            if (UI) UI.kagit.classList.remove('suruk');
            /* v24: kaydırmayan tek dokunuş rehber harfe düştüyse yazılışı */
            if (kd && e && e.type !== 'pointercancel' && Date.now() - kd.t < 450 &&
                Math.abs(e.clientX - kd.x) + Math.abs(e.clientY - kd.y) <= 10) rehberDokun(kd.x, kd.y);
            return;
        }
        if (_rb && (!e || e.pointerId === _rb.id)) {             /* v24: rehber harfe dokunuldu — çizgi yok */
            var rb = _rb;
            _rb = null; clearTimeout(rb.z);
            if (e && e.type !== 'pointercancel') rehberOynat(rb.j, rb.s, true);
            return;
        }
        if (!_cz || (e && e.pointerId !== _cz.id)) return;
        var c = _cz.c, j = _cz.j;
        _cz = null;
        c.p = sadelestir(c.p, 0.32).map(function (v) { return Math.round(v * 2) / 2; });
        yFark();
        D.sayfalar[j].cizimler.push(c);
        D.geri.push({ t: 'ekle', j: j });
        D.ileri = [];
        D.kirli = true;
        sayfaCiz();
        yCizBitti(c, j);
    }

    /* ---------------- işlemler ---------------- */
    function geriAl() {
        yFark();
        var a = D.geri.pop();
        if (!a) return;
        var sy = D.sayfalar[a.j];
        if (!sy) return;
        if (a.t === 'ekle') { D.ileri.push({ t: 'ekle', j: a.j, c: sy.cizimler.pop() }); }
        else if (a.t === 'silik' || a.t === 'silikSil') { silikGeri(a, sy); return; }
        else if (a.t === 'temizle') { D.ileri.push({ t: 'temizle', j: a.j, onceki: a.onceki }); sy.cizimler = a.onceki.slice(); }
        D.kirli = true; sayfaCiz();
        yIslem('g', a.j);
    }
    function yinele() {
        yFark();
        var a = D.ileri.pop();
        if (!a) return;
        var sy = D.sayfalar[a.j];
        if (!sy) return;
        if (a.t === 'ekle') { sy.cizimler.push(a.c); D.geri.push({ t: 'ekle', j: a.j }); }
        else if (a.t === 'silik' || a.t === 'silikSil') { silikIleri(a, sy); return; }
        else if (a.t === 'temizle') { D.geri.push({ t: 'temizle', j: a.j, onceki: sy.cizimler.slice() }); sy.cizimler = []; }
        D.kirli = true; sayfaCiz();
        yIslem('i', a.j);
    }
    function temizle() {
        yFark();
        var j = D.aktif, sy = D.sayfalar[j];
        if (!sy.cizimler.length) return;
        D.geri.push({ t: 'temizle', j: j, onceki: sy.cizimler.slice() });
        D.ileri = [];
        sy.cizimler = [];
        D.kirli = true; sayfaCiz();
        yIslem('t', j);
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
    function ekranAdimi() { return Math.max(sayfaYuk() * 0.25, UI.Lh - (UI.ustPay || 0) - (UI.altPay || 0) - 40); }
    function sola() {
        genelKapat();
        if (dikeyMi()) {
            var alt = (D.aktif + 1) * sayfaYuk() + (UI.altPay || 0);     /* sayfanın sonu alttaki okların üstüne gelsin (v21) */
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
        yFark();
        D.sayfalar.splice(yer, 0, yeniSayfa('c'));
        [D.geri, D.ileri].forEach(function (L) { L.forEach(function (a) { if (a.j >= yer) a.j++; }); });
        D.kirli = true;
        yIslem('e', yer);
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
        if (!sy.cizimler.length && !(sy.silik && sy.silik.length)) { yap(); return; }
        soru('Bu sayfa (' + (D.aktif + 1) + '. sayfa) üzerindeki yazılarla birlikte kaldırılsın mı?', 'Kaldır', true, yap);
    }
    function modSec() { /* tek düzen: çizgili defter (çizgi sayısı / güzel yazı: cizgiSec) */ }
    function tercihKaydet() { tercihYaz({ renk: T.renk, kal: T.kal, mod: T.mod, cizgi: T.cizgi, yon: T.yon, uc: T.uc, sayi: T.sayi, sk: T.sk, kyer: T.ky }); }
    /* yeni defter: son seçilen çizgi sayısı (2·3·4·5·7) ya da güzel yazı;
       eski tercih (6, 8) artık seçenek değil → 5 */
    function tercihCizgi(v) { return v === 'g' ? 'g' : (CIZGI_SECENEK.indexOf(+v) >= 0 ? +v : CIZGI_VARSAYILAN); }
    /* ÇİZGİ SAYISI / GÜZEL YAZI: defterin kendi ayarı (kaydedilir) ve tercih
       (yeni defterler de böyle başlar). Basılınca (aynı seçenek de olsa)
       defter bugünkü düzene (üstte pay) geçer. */
    function cizgiSec(v) {
        var n = v === 'g' ? 'g' : cizgiSayisi(v);
        T.cizgi = n; if (n !== 'g') T.sayi = n; tercihKaydet();
        if (!D || (D.cizgi === n && D.ust === UST_BOSLUK)) { aracGuncelle(); return; }
        var skEski = yaziSatirlari();                       /* silik yazılar yeni satırlara taşınacak */
        D.cizgi = n; D.ust = UST_BOSLUK;
        if (n === 'g') D.gsat = GUZEL_SATIR_A4;
        silikYenidenDiz(skEski, yaziSatirlari());                 /* güzel yazıya geçen defter yeni düzeni alır (21.10.2026) */
        D.kirli = true;
        sayfaCiz();
        aracGuncelle();              /* seçili düğme ve sayfa bilgisi hemen değişsin (21.10.2026) */
    }
    /* DEFTER TÜRÜ anahtarı: 'c' çizgili (güzel yazıdan dönünce son sayı), 'g' güzel
       yazı. v22: rakamlar perdede hep açık (öğretmen: "çizgiliye basınca rakamlar
       kapanmasın") — çizgiliyken görünür, güzel yazıda gizli (aracGuncelle). */
    function defterTuru(t) {
        if (!D) return;
        if (t === 'g') { cizgiSec('g'); return; }
        if (D.cizgi === 'g') cizgiSec(T.sayi || CIZGI_VARSAYILAN);
        aracGuncelle();
    }
    function cpopAc() {
        if (!UI || !UI.cpop) return;
        var c = UI.cpop;
        c.hidden = false; c.style.left = ''; c.style.right = '';
        /* dar ekranda sağdan taşmasın */
        try {
            var r = c.getBoundingClientRect(), k = UI.kutu.getBoundingClientRect();
            if (r.right > k.right - 6) { c.style.left = 'auto'; c.style.right = '0'; }
        } catch (e) { }
        aracGuncelle();
    }
    function cpopKapat() { }            /* v22: rakamlar perdede hep açık; kapatılmaz (aracGuncelle gösterir/gizler) */
    /* HAT KALEMİ aç / kapa — kalınlık düğmeleri ucun enini seçer */
    function hatSec(acik) {
        T.uc = acik ? 'h' : 'y';
        T.arac = 'kalem';
        tercihKaydet();
        aracGuncelle();
    }
    /* KAYDIRMA YÖNÜ — YALNIZ DİKEY (21.10.2026, öğretmen: "defterde sayfaları yatay
       kısmını iptal edelim, sadece dikey mod olsun"): yatay kip açılmaz, eski
       tercih yok sayılır. */
    function yonSec(y) {
        y = 'd';
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
        var anahtar = function (kok, ikinci) {
            var a = UI.ort.querySelector(kok);
            if (!a) return;
            a.classList.toggle('ikinci', !!ikinci);
            var d = a.querySelectorAll('.ys-asec');
            if (d[0]) d[0].setAttribute('aria-checked', ikinci ? 'false' : 'true');
            if (d[1]) d[1].setAttribute('aria-checked', ikinci ? 'true' : 'false');
        };
        anahtar('.ys-ucsec', T.uc === 'h');
        anahtar('.ys-dtsec', D.cizgi === 'g');
        if (UI.cpop) UI.cpop.hidden = D.cizgi === 'g';      /* v22: rakamlar perdede hep açık (çizgiliyken) */
        anahtar('.ys-kysec', T.ky === 'ust');
        var csn = UI.ort.querySelector('.ys-csn');
        if (csn) csn.textContent = String(D.cizgi === 'g' ? (T.sayi || CIZGI_VARSAYILAN) : D.cizgi);
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
        var skb = UI.ort.querySelector('[data-is="silik"]');
        if (skb) { var ska = !!(UI.silik && !UI.silik.hidden); skb.classList.toggle('sec', ska); skb.setAttribute('aria-pressed', ska ? 'true' : 'false'); }
        if (UI.slKaldir) UI.slKaldir.disabled = !(s.silik && s.silik.length);
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
        /* SAYFA SİLME YALNIZ BURADA (21.10.2026, öğretmen: "tüm sayfaların olduğu kısım
           açılınca sayfanın köşesinde eksi görünsün öyle silebilsin ... arayüzde sadece
           tüm sayfalar kısmından silinebilsin"): kartın köşesinde «−» (tek sayfada yok) */
        var coklu = D.sayfalar.length > 1;
        var kartlar = D.sayfalar.map(function (sy, i) {
            return '<div class="ys-gkap">' +
                '<button type="button" class="ys-gkart' + (i === D.aktif ? ' simdi' : '') + '" data-git="' + i + '" title="Sayfa ' + (i + 1) + '">' +
                '<canvas width="480" height="' + Math.round(480 * sayfaYuk() / W) + '" style="aspect-ratio:' + W + '/' + Math.round(sayfaYuk()) + '"></canvas><span>Sayfa ' + (i + 1) + (i === D.aktif ? ' · açık' : '') + '</span></button>' +
                (coklu ? '<button type="button" class="ys-gsil" data-sayfasil="' + i + '" title="' + (i + 1) + '. sayfayı sil" aria-label="' + (i + 1) + '. sayfayı sil">' + IK.eksi + '</button>' : '') +
                '</div>';
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
    /* «Tüm sayfalar»daki «−»: sayfa silinir (yazılıysa sorarak), görünüm tazelenir */
    function sayfaSilGenel(i) {
        if (!D || D.sayfalar.length < 2 || i < 0 || i >= D.sayfalar.length) return;
        var sy = D.sayfalar[i];
        var yap = function () {
            if (D.sayfalar.length < 2) return;
            D.sayfalar.splice(i, 1);
            D.geri = []; D.ileri = [];
            D.kirli = true;
            var hedef = Math.min(D.aktif > i ? D.aktif - 1 : D.aktif, D.sayfalar.length - 1);
            D.aktif = hedef;
            UI.c = null; UI.cy = null;
            cizimAyarla();
            kaydirGit(hedef, true);
            genelAc();
            bildir((i + 1) + '. sayfa silindi');
        };
        if (!sy.cizimler.length && !(sy.silik && sy.silik.length)) { yap(); return; }
        soru((i + 1) + '. sayfa üzerindeki yazılarla birlikte silinsin mi?', 'Sil', true, yap);
    }

    /* ---------------- «Tüm sayfayı sil» sorusu ---------------- */
    function silSorAc(btn) {
        silSorKapat();
        if (!sayfa().cizimler.length) { bildir((sayfa().silik || []).length ? 'Kalemle yazılan yok — silik yazı «Silik yazı» penceresinden kaldırılır' : 'Sayfa zaten boş'); return; }
        var d = document.createElement('div');
        d.className = 'ys-silsor';
        d.setAttribute('role', 'dialog');
        d.innerHTML = '<button type="button" data-is="tumSil">' + IK.temizle + '<span>' +
            ((sayfa().silik || []).length ? 'Yazıları sil (silik yazı kalır)' : 'Tüm sayfayı sil') + '</span></button>';
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
        silikCizO(ctx, s, o, g.x0, 0);
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
        ctx.fillText((YAZI ? 'Yazı Çalışması' : 'Defter') + ' · ' + etiket() + ' · ' + tarihYaz(D.tarih || Date.now()), 28, PH + AY / 2 + 4);
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
        var b = t.closest('button[data-is],button[data-renk],button[data-kal],button[data-cizgi],button[data-yon],button[data-mod],button[data-uc],button[data-dt],button[data-sk]');
        if (!b || b.disabled || !UI.ort.contains(b)) return null;
        var is = b.getAttribute('data-is');
        if (is === 'tamEkran' || is === 'pdf') return null;
        return b.closest('.ys-arac,.ys-yan,.ys-sayfalar,.ys-altnav,.ys-silik,.ys-hy') ? b : null;
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
        UI.sonHizli = { b: t.b, z: Date.now(), x: e.clientX, y: e.clientY };
        islem(e, e.target, t.b);
    }
    function tikla(e) {
        var t = e.target;
        if (t === UI.ort) return;                                    /* dışına basınca kapanmaz (yanlışlıkla silinmesin) */
        var b = t.closest && t.closest('[data-is],[data-renk],[data-kal],[data-cizgi],[data-yon],[data-mod],[data-sek],[data-ac],[data-sil],[data-not],[data-notsil],[data-sayfasil],[data-git],[data-uc],[data-dt],[data-sk]');
        if (b && UI.sonHizli && UI.sonHizli.b === b && Date.now() - UI.sonHizli.z < 800) return;   /* pointerup'ta işlendi */
        islem(e, t, b);
    }
    function islem(e, t, b) {
        /* «Tüm sayfalar» açıkken dışındaki bir düğmeye basılırsa görünüm kapanır (silme sorusu hariç) */
        if (UI.genel && !UI.genel.contains(t) && !(t.closest && t.closest('.ys-soru-ort')) && !(b && b.getAttribute('data-is') === 'tumSayfalar')) genelKapat();
        /* çizgi sayısı rakamları: dışına basınca kapanır */
        if (UI.cpop && !UI.cpop.hidden && !UI.cpop.contains(t) && !(b && b.hasAttribute('data-dt'))) cpopKapat();
        /* açık «Tüm sayfayı sil» sorusu: dışına basınca kapanır; onu açan
           düğmeye yeniden basmak da yalnız kapatır */
        if (UI.silSor && !UI.silSor.contains(t)) {
            var acan = UI.silSorBtn;
            silSorKapat();
            if (b && b === acan) return;
        }
        if (!b) return;
        if (b.hasAttribute('data-sk')) { silikIslem(b); return; }
        if (b.hasAttribute('data-sayfasil')) { e.stopPropagation(); sayfaSilGenel(+b.getAttribute('data-sayfasil')); return; }
        if (b.hasAttribute('data-git')) { var gi = +b.getAttribute('data-git'); genelKapat(); sayfayaGit(gi); return; }
        if (b.hasAttribute('data-uc')) { hatSec(b.getAttribute('data-uc') === 'h'); return; }
        if (b.hasAttribute('data-dt')) { defterTuru(b.getAttribute('data-dt')); return; }
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
        if (is && PERDE_KAPATAN[is] && perdeAcik() && UI.perde.contains(b)) perdeKapat();
        if (is === 'perde') { if (perdeAcik()) perdeKapat(); else perdeAc(); }
        else if (is === 'kalemYer') kalemYerSec(b.getAttribute('data-v'));
        else if (is === 'hyTekrar') harfAnimTekrar();
        else if (is === 'hyKapat') harfAnimKapat();
        else if (is === 'hyKip') hyKipSec(b.getAttribute('data-v'));
        else if (is === 'hyHiz') hyHizSec(b.getAttribute('data-v'));
        else if (is === 'silgi') {
            /* seçili silgiye İKİNCİ kez basınca: «Tüm sayfayı sil» */
            if (T.arac === 'silgi') silSorAc(b);
            else { T.arac = 'silgi'; aracGuncelle(); }
        }
        else if (is === 'kalem') { T.arac = 'kalem'; aracGuncelle(); }
        else if (is === 'tumSil') { silSorKapat(); temizle(); bildir('Sayfa silindi — geri almak için ↶'); }
        else if (is === 'silik') silikAcKapa();
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
            if (perdeAcik()) { perdeKapat(); return; }
            if (RA) { raDurdur(); return; }                  /* v24: rehber harfin yazılışı */
            if (HY) { harfAnimKapat(); return; }
            if (UI.silik && !UI.silik.hidden) { silikKapat(); return; }
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
        else if (/^[1-5]$/.test(k)) { T.renk = KALEM_SIRA[+k - 1]; T.arac = 'kalem'; tercihKaydet(); aracGuncelle(); }
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
            if (!UI || !D || D.sinif !== sinif || !L.length || !bosMu(D.sayfalar) || yIzleyen()) return;
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
                if (YAZI) L = L.filter(function (k) { return (k.sube || '') === (D.sube || ''); });   /* sınıf defterleri burada görünmez */
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
            /* 21.10.2026: «Yedinci sınıflar» da; seviye adı tanınmazsa sınıfın adı (Okulum → 5-A → 5) */
            var _sn = (typeof window.llSinifSeviyeNo === 'function') ? window.llSinifSeviyeNo(lvl, cls) : 0;
            var m = _sn ? null : String(lvl.name || '').match(/\d+/);
            var sinif = _sn ? String(_sn) : (m ? String(parseInt(m[0], 10)) : 'x' + String(a.lId).replace(/[^A-Za-z0-9_]/g, '').slice(0, 24));
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
    var YAZI = false;          /* «Yazı Çalışması» kartı (defter.html?yazi=N): girişsiz açılır, öğrenci de yazar */
    function tekBasina(b) {
        if (!b || !b.sinif || (!ogretmenMi() && !b.yazi)) return false;
        YAZI = !!b.yazi;
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
        /* yazı çalışması: «Silik yazı» penceresi açık gelir (yansıtmayı izleyen ekranda açılmaz) */
        if (YAZI) { if (YK) setTimeout(function () { if (UI && !yIzleyen()) silikAc(); }, 700); else silikAc(); }
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

    /* ------------------------------------------------------------------
       TAHTAYA YANSITMA (22.10.2026) — öğretmen: "defterde yazı yazınca da
       yansıtılan ekranda görünmeli neden görünmüyor". Yansıtma tıklamayı,
       tuşu ve kaydırmayı taşır; parmakla / kalemle yazılan çizgi bunlardan
       değil, tahtaya gitmiyordu. Defter tahta kabuğunda (KidefTahta.kanal)
       kendi durumunu taşır:
       · LİDER (o an kullanılan cihaz): çizgi yazıldıkça 40 ms'de bir parça
         ('c'), bitince son hâli ('b'); geri al 'g', yinele 'i', sayfayı
         temizle 't', araya sayfa 'e'. Öteki değişiklikler 250 ms'de bir
         karşılaştırılır: sona sayfa 'e', sayfa silindi 'r', bir sayfa değişti
         'p', çizgi düzeni / başka defter 'h' (bütün defter). Baktığı yer 'v'.
       · İZLEYEN (öbür ekran): aynısını uygular; her işlemden sonra sayfanın
         özetini liderinkiyle karşılaştırır, tutmazsa bütün defteri ister.
         Liderin baktığı yeri gösterir; ekranı daha kısaysa (yatay tahta,
         dikey telefon) yazılan yeri izler. Kendisi çizmez (kaydırabilir).
       Defterin içindeki tıklama / tuşlar kabukça yansıtılmaz (data-tahta-kanal):
       düğmenin işi bir kez, kanaldan gider.
       ------------------------------------------------------------------ */
    var YK = null;
    var _kodOnbellek = (typeof WeakMap === 'function') ? new WeakMap() : null;
    function yKabuk() {
        try { var p = window.parent; return (p && p !== window && p.KidefTahta && p.KidefTahta.kanal) ? p.KidefTahta : null; }
        catch (e) { return null; }
    }
    function yDurum() { try { return (YK && YK.k) ? YK.k.durum() : null; } catch (e) { return null; } }
    function yLider() { var d = yDurum(); return !!(d && d.oturum && d.lider); }
    function yIzleyen() { var d = yDurum(); return !!(d && d.oturum && !d.lider); }
    function yGonder(m) { try { return !!(m && YK && YK.k && UI && !UI.kucuk && YK.k.gonder(m)); } catch (e) { return false; } }
    function yIste() { try { if (YK && YK.k && YK.k.iste) YK.k.iste(); } catch (e) { } }
    function yOzet(s) {                                             /* FNV-1a 32 bit */
        var h = 0x811c9dc5;
        for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
        return h.toString(36);
    }
    function sayfaImza(sy) {
        var L = sy.cizimler, n = L.length, c = n ? L[n - 1] : null;
        return n + (c ? ':' + c.p.length + ':' + c.p[0] + ':' + c.p[1] + ':' + c.r + c.k + c.s : '') + silikImza(sy);
    }
    /* bir sayfanın kayıt kodu (defterKodla'daki gibi); değişmeyen sayfa yeniden kodlanmaz */
    function sayfaKodu(j) {
        var sy = D && D.sayfalar[j];
        if (!sy) return '';
        var im = sayfaImza(sy), o = _kodOnbellek && _kodOnbellek.get(sy);
        if (o && o.im === im && o.L === sy.cizimler && o.S === sy.silik) return o.kod;
        var kod = sayfaGovde(sy);
        if (_kodOnbellek) _kodOnbellek.set(sy, { im: im, kod: kod, L: sy.cizimler, S: sy.silik });
        return kod;
    }
    function sayfaCoz(kod) { return String(kod || '').slice(1).split(' ').filter(Boolean).map(cizgiCoz).filter(Boolean); }
    function tumKodlar() { var L = []; for (var j = 0; j < D.sayfalar.length; j++) L.push(sayfaKodu(j)); return L; }
    function yAyar() { return D.id + '|' + defterKodla([], D.pw, cizgiDuzeni()); }
    function yImza() { var s = yAyar() + '|' + D.sayfalar.length; for (var j = 0; j < D.sayfalar.length; j++) s += '|' + sayfaImza(D.sayfalar[j]); return s; }
    function noktaKodla(p) {
        var out = [], px = 0, py = 0;
        for (var i = 0; i + 1 < p.length; i += 2) {
            var x = Math.round(p[i] * 2), y = Math.round(p[i + 1] * 2);
            sayiKodla(x - px, out); sayiKodla(y - py, out); px = x; py = y;
        }
        return out.join('');
    }
    function noktaCoz(s) {
        var n = sayilariCoz(String(s || '')), p = [], x = 0, y = 0;
        for (var i = 0; i + 1 < n.length; i += 2) { x += n[i]; y += n[i + 1]; p.push(x / 2, y / 2); }
        return p;
    }

    function yansitKur() {
        yansitBirak();
        var kt = yKabuk();
        if (!kt || !UI || !D || UI.kucuk) return;                 /* küçük (simge) defter yansıtılmaz */
        var k = null;
        try { k = kt.kanal.kur('defter', { belge: document, gelen: yGelen, anlik: yAnlik }); } catch (e) { k = null; }
        if (!k) return;
        YK = { k: k, kodlar: null, imza: '', ayar: '', on: Math.random().toString(36).slice(2, 7), say: 0,
               cz: null, czZ: null, uzak: {}, v: null, vSon: null, vZ: null, odak: null, tz: 0 };
        YK.tz = setInterval(yansitTara, 250);
        yansitAlan();
        /* lider defteri (yeniden) açtıysa öbür ekran da bu defteri görsün */
        setTimeout(function () { if (YK && YK.k === k && yLider()) yGonder(yAnlik()); }, 120);
    }
    function yansitBirak() {
        if (!YK) return;
        clearInterval(YK.tz); clearTimeout(YK.czZ); clearTimeout(YK.vZ);
        try { if (YK.k && YK.k.birak) YK.k.birak(); } catch (e) { }
        if (UI && UI.ort) UI.ort.removeAttribute('data-tahta-kanal');
        YK = null;
    }
    function yansitAlan() {
        if (!UI || !UI.ort) return;
        if (YK && !UI.kucuk) UI.ort.setAttribute('data-tahta-kanal', 'defter');
        else UI.ort.removeAttribute('data-tahta-kanal');
    }
    function yansitTara() {
        if (!YK || !UI || !D) return;
        yansitAlan();
        if (!yLider()) {
            if (yIzleyen() && UI.silik && !UI.silik.hidden) silikKapat();      /* izleyen ekran yalnız gösterir */
            YK.kodlar = null; YK.vSon = null;
            /* izleyen: bitişi gelmeyen uzak çizgi 8 sn sonra silinir */
            var simdi = Date.now(), sil = false;
            for (var k in YK.uzak) if (simdi - YK.uzak[k].z > 8000) { delete YK.uzak[k]; sil = true; }
            if (sil) sayfaCiz();
            return;
        }
        yFark();
    }
    /* lider: son gönderilenden bu yana olan değişiklik (karşılaştırma tabanı: YK.kodlar) */
    function yFark() {
        if (!YK || !YK.kodlar || !D || !UI || UI.kucuk || !yLider()) return;
        var im = yImza();
        if (im === YK.imza) return;
        var ay = yAyar();
        if (ay !== YK.ayar) { yGonder(yAnlik()); return; }
        var yeni = tumKodlar(), eski = YK.kodlar, j;
        if (yeni.length === eski.length) {
            for (j = 0; j < yeni.length; j++) if (yeni[j] !== eski[j]) yGonder({ t: 'p', j: j, kod: yeni[j], uz: yeni.length });
        } else {
            var a = 0, b = 0, en = Math.min(eski.length, yeni.length);
            while (a < en && eski[a] === yeni[a]) a++;
            while (b < en - a && eski[eski.length - 1 - b] === yeni[yeni.length - 1 - b]) b++;
            if (yeni.length > eski.length && a + b >= eski.length && yeni.slice(a, yeni.length - b).every(function (x) { return x === 'c'; }))
                yGonder({ t: 'e', yer: a, adet: yeni.length - eski.length, uz: yeni.length });
            else if (yeni.length < eski.length && a + b >= yeni.length)
                yGonder({ t: 'r', yer: a, adet: eski.length - yeni.length, uz: yeni.length });
            else { yGonder(yAnlik()); return; }
        }
        YK.kodlar = yeni; YK.imza = im; YK.ayar = ay;
    }
    /* bütün defter (izleyen isteyince, çizgi düzeni / defter değişince) */
    function yAnlik() {
        if (!D || !UI) return null;
        if (YK) { YK.kodlar = tumKodlar(); YK.imza = yImza(); YK.ayar = yAyar(); YK.vSon = null; }
        return { t: 'h', id: D.id, kod: defterKodla(D.sayfalar, D.pw, cizgiDuzeni()), cy: Math.round((UI.cy || 0) * 2) / 2, lh: Math.round(UI.Lh || 0) };
    }
    /* lider: gönderilen işlemden sonra taban */
    function yIslem(t, j) {
        if (!YK || !YK.kodlar || !D || !yLider()) return;
        if (t === 'e') { yGonder({ t: 'e', yer: j, adet: 1, uz: D.sayfalar.length }); YK.kodlar.splice(j, 0, 'c'); return; }
        var kod = sayfaKodu(j);
        yGonder({ t: t, j: j, n: D.sayfalar[j] ? D.sayfalar[j].cizimler.length : 0, o: yOzet(kod) });
        YK.kodlar[j] = kod;
    }
    /* lider: yazılan çizgi */
    function yCizBasla(cz) {
        if (!YK || !cz || !yLider()) return;
        YK.say++;
        YK.cz = { k: YK.on + YK.say, j: cz.j, c: cz.c, g: 0 };
        clearTimeout(YK.czZ); YK.czZ = setTimeout(yCizGonder, 0);
    }
    function yCizZamanla() { if (YK && YK.cz && !YK.czZ) YK.czZ = setTimeout(yCizGonder, 40); }
    function yCizGonder() {
        if (!YK) return;
        YK.czZ = null;
        var a = YK.cz;
        if (!a || a.c.p.length <= a.g) return;
        var bas = a.g;
        a.g = a.c.p.length;
        yGonder({ t: 'c', k: a.k, j: a.j, r: a.c.r, kl: a.c.k, s: a.c.s ? 1 : 0, b: bas / 2, p: noktaKodla(a.c.p.slice(bas)) });
    }
    function yCizBitti(c, j) {
        if (!YK) return;
        var a = YK.cz;
        clearTimeout(YK.czZ); YK.czZ = null; YK.cz = null;
        if (!yLider()) return;
        var kod = sayfaKodu(j);
        yGonder({ t: 'b', k: a && a.c === c ? a.k : '', j: j, c: cizgiKodla(c), n: D.sayfalar[j].cizimler.length, o: yOzet(kod), uz: D.sayfalar.length });
        if (YK.kodlar) {
            while (YK.kodlar.length < D.sayfalar.length) YK.kodlar.push('c');         /* çizgi kâğıdın ötesine yazıldı: sayfa eklendi */
            YK.kodlar[j] = kod;
        }
    }
    /* lider: baktığı yer */
    function yGorusZamanla() { if (YK && !YK.vZ && yLider()) YK.vZ = setTimeout(yGorusGonder, 70); }
    function yGorusGonder() {
        if (!YK) return;
        YK.vZ = null;
        if (!UI || !D || UI.cy == null || !yLider()) return;
        var cy = Math.round(UI.cy * 2) / 2, lh = Math.round(UI.Lh), s = YK.vSon;
        if (s && Math.abs(s.cy - cy) < 0.5 && s.lh === lh) return;
        if (yGonder({ t: 'v', cy: cy, lh: lh })) YK.vSon = { cy: cy, lh: lh };
    }

    /* izleyen: gelen */
    function yGelen(m) {
        if (!m || !YK || !D || !UI || yLider()) return;
        try {
            var t = m.t;
            if (t === 'h') yAnlikUygula(m);
            else if (t === 'c') yParca(m);
            else if (t === 'b') yBitis(m);
            else if (t === 'g' || t === 'i' || t === 't') yIslemUygula(m);
            else if (t === 'p') yPUygula(m);
            else if (t === 'e') yEUygula(m);
            else if (t === 'r') yRUygula(m);
            else if (t === 'v') yGorus(m);
            else if (t === 'a') yHarfAnim(m);
            else if (t === 'ra') yRehber(m);                     /* v24: rehber harfin yazılışı */
        } catch (e) { yIste(); }
    }
    function yAnlikUygula(m) {
        var L = defterCoz(m.kod);
        D.id = m.id || D.id;
        D.sayfalar = L; D.pw = L.pw; D.ph = L.ph; D.cizgi = L.cizgi; D.gsat = L.gsat; D.ust = L.ust;
        D.geri = []; D.ileri = []; D.kirli = true;
        defterHazirla(D);
        YK.uzak = {}; YK.odak = null;
        var so = UI.ort.querySelector('.ys-son'); if (so) so.remove();        /* bu cihazın «son defter» önerisi */
        if (m.cy != null) YK.v = { cy: m.cy, lh: m.lh || UI.Lh };
        cizimAyarla();
        yGorusUygula(true);
    }
    function yParca(m) {
        var p = noktaCoz(m.p);
        if (!p.length) return;
        var u = YK.uzak[m.k];
        if (!u) u = YK.uzak[m.k] = { j: m.j, c: { r: m.r, k: m.kl, s: m.s ? 1 : 0, p: [] } };
        u.z = Date.now();
        var once = u.c.p.length / 2;
        u.c.p.push.apply(u.c.p, p);
        yParcaCiz(u, once);
        yOdak(m.j, p[p.length - 1]);
    }
    /* uzak çizginin yeni parçası, liderin yazarken çizdiğinin aynısı (kalemBas / kalemOynat) */
    function yParcaCiz(u, bas) {
        if (!UI || !dikeyMi() || UI.vx0 == null) return;
        var c = u.c, p = c.p, n = p.length / 2, o = UI.olcek, oy = UI.vy0 - u.j * sayfaYuk();
        var ctx = UI.ust.getContext('2d'), hat = !c.s && hatMi(c.k), renk = c.s ? '#000' : (RENKLER[c.r] || RENKLER[0]).k;
        if (bas === 0) { cizimCiz(ctx, { r: c.r, k: c.k, s: c.s, p: [p[0], p[1]] }, o, UI.vx0, oy); bas = 1; }
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -UI.vx0 * o, -oy * o);
        ctx.globalCompositeOperation = c.s ? 'destination-out' : 'source-over';
        for (var m = Math.max(2, bas + 1); m <= n; m++) {
            var bx = p[(m - 2) * 2], by = p[(m - 2) * 2 + 1], cx = p[(m - 1) * 2], cy = p[(m - 1) * 2 + 1];
            if (hat) {
                var uc = hatUc(kalinlikW(c.k));
                ctx.fillStyle = renk; ctx.beginPath(); hatDortgen(ctx, bx, by, cx, cy, uc[0], uc[1]); ctx.fill();
                continue;
            }
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = renk; ctx.lineWidth = c.s ? SILGI_W : kalinlikW(c.k);
            ctx.beginPath();
            if (m === 2) { ctx.moveTo(bx, by); ctx.lineTo((bx + cx) / 2, (by + cy) / 2); }
            else {
                var ax = p[(m - 3) * 2], ay = p[(m - 3) * 2 + 1];
                ctx.moveTo((ax + bx) / 2, (ay + by) / 2);
                ctx.quadraticCurveTo(bx, by, (bx + cx) / 2, (by + cy) / 2);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
    function yBitis(m) {
        if (m.k) delete YK.uzak[m.k];
        var c = cizgiCoz(m.c);
        if (!c) { yIste(); return; }
        var buyudu = false;
        while (D.sayfalar.length < (m.uz || 0)) { D.sayfalar.push(yeniSayfa('c')); buyudu = true; }
        var sy = D.sayfalar[m.j];
        if (!sy) { yIste(); return; }
        sy.cizimler.push(c);
        D.geri.push({ t: 'ekle', j: m.j }); D.ileri = [];
        D.kirli = true;
        if (buyudu) cizimAyarla(); else sayfaCiz();
        if (sy.cizimler.length !== m.n || yOzet(sayfaKodu(m.j)) !== m.o) yIste();
        yOdak(m.j, c.p[c.p.length - 1]);
    }
    function yIslemUygula(m) {
        var j = m.j;
        if (m.t === 'g') geriAl();
        else if (m.t === 'i') yinele();
        else {
            var sy = D.sayfalar[j];
            if (sy && sy.cizimler.length) {
                D.geri.push({ t: 'temizle', j: j, onceki: sy.cizimler.slice() });
                D.ileri = []; sy.cizimler = []; D.kirli = true; sayfaCiz();
            }
        }
        var s2 = D.sayfalar[j];
        if (!s2 || s2.cizimler.length !== m.n || yOzet(sayfaKodu(j)) !== m.o) yIste();
    }
    function yPUygula(m) {
        while (D.sayfalar.length < (m.uz || 0)) D.sayfalar.push(yeniSayfa('c'));
        var sy = D.sayfalar[m.j];
        if (!sy) { yIste(); return; }
        var zp = sayfaParcala(m.kod);
        sy.cizimler = zp.c; sy.silik = zp.s;
        D.geri = []; D.ileri = []; D.kirli = true;
        cizimAyarla();
    }
    function yEUygula(m) {
        var yer = Math.max(0, Math.min(m.yer, D.sayfalar.length)), adet = Math.max(1, m.adet || 1);
        for (var i = 0; i < adet; i++) D.sayfalar.splice(yer, 0, yeniSayfa('c'));
        [D.geri, D.ileri].forEach(function (L) { L.forEach(function (a) { if (a.j >= yer) a.j += adet; }); });
        D.kirli = true;
        cizimAyarla();
        if (m.uz && D.sayfalar.length !== m.uz) yIste();
    }
    function yRUygula(m) {
        D.sayfalar.splice(m.yer, m.adet);
        if (!D.sayfalar.length) D.sayfalar.push(yeniSayfa('c'));
        D.geri = []; D.ileri = []; D.kirli = true;
        cizimAyarla();
        if (m.uz && D.sayfalar.length !== m.uz) yIste();
    }
    function yGorus(m) {
        if (YK.odak && YK.odak.cy !== m.cy) YK.odak = null;               /* lider kaydırdı: yazı izlemesi biter */
        YK.v = { cy: m.cy, lh: m.lh || UI.Lh };
        yGorusUygula();
    }
    function yOdak(j, y) {
        if (y == null) return;
        YK.odak = { y: j * sayfaYuk() + y, cy: YK.v ? YK.v.cy : null };
        yGorusUygula();
    }
    /* izleyen: liderin baktığı yer, üstleri hizalı (defter yukarıdan okunur: sayfaya gidilince
       sayfanın başı); ekranı daha kısaysa (yatay tahta, dikey telefon) yazılan yer görünür kalır */
    function yGorusUygula(aninda) {
        if (!YK || !UI || !D || UI.kucuk || !dikeyMi() || UI.cy == null) return;
        var g = YK.v;
        if (!g) return;
        var Lh = UI.Lh, o = YK.odak, hedef;
        if (o && Lh < g.lh - 1 && o.cy === g.cy) {
            var pay = Lh * 0.12;
            if (o.y >= UI.cy + pay && o.y <= UI.cy + Lh - pay) return;     /* yazılan yer zaten ekranda */
            hedef = o.y - Lh * 0.4;
        } else hedef = g.cy;
        hedef = sinirliY(hedef);
        if (Math.abs(hedef - UI.cy) < 1) return;
        kaydirHedef(hedef, !!aninda);
    }

    /* ------------------------------------------------------------------
       SİLİK YAZI (23.10.2026) — öğretmen: "gri renkte kelimeler olsun
       üstünden geçilebilsin, hatta deftere de ekleyelim bu özelliği, ayrıca
       bi harf görünsün onun altında nasıl yazılması gerektiğini öğrenci
       çizerek göstersin". Seçilenler: kitap kelimeleri + kendim yazayım ·
       harf ve dört yazılışı, altında çizgili alan · İmam Hatip'te bütün
       sınıflara kart · çubukta «Silik yazı» tuşu.
       · Çubuktaki «Silik yazı» solda bir pencere açar. KELİME: sınıf, ünite /
         ders (muhadese/veri/<ders>.js → words; kitap seçimi
         sistem/sinifveri.js'ten), dersin kelimeleri; basınca kelime sıradaki
         boş satıra GRİ yazılır, öğrenci üstünden geçer. «Kendin yaz» kutusu
         (küçük Arapça klavyeyle) her metni koyar. «Satırı doldur»: kelime
         satır boyunca tekrarlanır. HARF: 28 harf; basınca harf dört yazılışıyla
         (ayrı · başta · ortada · sonda, üstlerinde Türkçe adı) koyu yazılır,
         alttaki çizgili satırlara öğrenci yazar («Altına silik tekrar» açıksa
         bir satır da gri).
       · Sıradaki boş satır: açık sayfada yazı (silik ya da kalemle) olan son
         satırın altı; sayfa doluysa sonraki (gerekirse yeni) sayfa.
       · Silik yazı ALT tuvalde, çizgilerle birlikte çizilir: silgi silmez.
         «Tüm sayfayı sil» yalnız kalemle yazılanı siler (sıradaki öğrenci aynı
         silik yazıya yazar); silik yazı geri al (↶) ya da pencerenin altındaki
         «Silik yazıları kaldır» ile gider.
       · Saklama: sayfanın kayıt kodunda her silik yazı 'g' ile başlayan bir
         parça: 'g' + tür ('g' gri, 'm' koyu örnek, 'e' etiket) + "x,y,boy,hiza;metin"
         (UTF-8, 5 bitlik harflerle: ASCII 95-126). Eski sürüm bu parçaları
         çizgi sanmaz, atlar (tek sayı çözer, nokta çıkmaz).
       · Geçmiş, seviye notları, önizlemeler, PDF ve tahtaya yansıtma silik
         yazıyı taşır.
       ------------------------------------------------------------------ */
    var IHK_YOL = 'sarf/ihkelime.js?v=a63b06fd';          /* sürüm damgası: _kaynak/uretici/surumle.py */
    var SVERI_YOL = 'sistem/sinifveri.js?v=6baf2d98';
    var SK_SINIFLAR = ['5', '6', '7', '8', '9', '10'];
    var SILIK_FONT = '"Arakom", "arakom", "Traditional Arabic", "Geeza Pro", serif';
    var SILIK_RENK = { g: '#AEB7C2', m: '#4E5A68', e: '#97A3B1' };
    var ARAKOM_ELIF = 0.60;                                  /* Arakom'da elif boyu / yazı boyu */
    /* alfabe.js'teki harf tablosu: harf, ad, baştaki, ortadaki, sondaki */
    var HARFLER = [
        ['ا', 'Elif', 'ا', 'ـا', 'ـا'], ['ب', 'Be', 'بـ', 'ـبـ', 'ـب'], ['ت', 'Te', 'تـ', 'ـتـ', 'ـت'],
        ['ث', 'S̱e', 'ثـ', 'ـثـ', 'ـث'], ['ج', 'Cim', 'جـ', 'ـجـ', 'ـج'], ['ح', 'Ḥa', 'حـ', 'ـحـ', 'ـح'],
        ['خ', 'Ḫa', 'خـ', 'ـخـ', 'ـخ'], ['د', 'Dal', 'د', 'ـد', 'ـد'], ['ذ', 'Ẕel', 'ذ', 'ـذ', 'ـذ'],
        ['ر', 'Ra', 'ر', 'ـر', 'ـر'], ['ز', 'Ze', 'ز', 'ـز', 'ـز'], ['س', 'Sin', 'سـ', 'ـسـ', 'ـس'],
        ['ش', 'Şın', 'شـ', 'ـشـ', 'ـش'], ['ص', 'Ṣad', 'صـ', 'ـصـ', 'ـص'], ['ض', 'Ḍad', 'ضـ', 'ـضـ', 'ـض'],
        ['ط', 'Ṭa', 'طـ', 'ـطـ', 'ـط'], ['ظ', 'Ẓa', 'ظـ', 'ـظـ', 'ـظ'], ['ع', 'Ayn', 'عـ', 'ـعـ', 'ـع'],
        ['غ', 'Ğayn', 'غـ', 'ـغـ', 'ـغ'], ['ف', 'Fe', 'فـ', 'ـفـ', 'ـف'], ['ق', 'Qaf', 'قـ', 'ـقـ', 'ـق'],
        ['ك', 'Kef', 'كـ', 'ـكـ', 'ـك'], ['ل', 'Lam', 'لـ', 'ـلـ', 'ـل'], ['م', 'Mim', 'مـ', 'ـمـ', 'ـم'],
        ['ن', 'Nun', 'نـ', 'ـنـ', 'ـن'], ['و', 'Waw', 'و', 'ـو', 'ـو'], ['ه', 'He', 'هـ', 'ـهـ', 'ـه'],
        ['ي', 'Ye', 'يـ', 'ـيـ', 'ـي']
    ];
    var HARF_BICIM = ['Ayrı', 'Başta', 'Ortada', 'Sonda'];
    var KLAVYE = ['ا ب ت ث ج ح خ د ذ ر', 'ز س ش ص ض ط ظ ع غ ف', 'ق ك ل م ن ه و ي ة ى', 'ء أ إ آ ؤ ئ'];
    /* harekeler: üstün, esre, ötre, iki üstün, iki esre, iki ötre, cezm, şedde */
    var HAREKE = ['\u064E', '\u0650', '\u064F', '\u064B', '\u064D', '\u064C', '\u0652', '\u0651'];
    IK.silik = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2.5 16.5h13" stroke-width="1.5" opacity=".45"/>' +
        '<path d="M14.6 9.6c0 3.6-2.4 5.4-5.9 5.4S2.9 13.4 2.9 10.4" stroke-width="2.3" stroke-dasharray="2.1 2.5"/>' +
        '<circle cx="8.7" cy="19.6" r="1.35" fill="currentColor" stroke="none"/>' +
        '<path d="M17.2 3.6l3.2 3.2-6.2 6.2-3.9.7.7-3.9z" stroke-width="1.9"/></svg>';
    IK.klavye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="2.5" y="6" width="19" height="12" rx="2.4"/><path d="M6 9.6h.01M9.3 9.6h.01M12.6 9.6h.01M15.9 9.6h.01M18 9.6h.01M6.5 12.6h.01M10 12.6h.01M13.5 12.6h.01M17 12.6h.01M8 15.4h8"/></svg>';

    /* ---------------- kayıt biçimi ---------------- */
    function utf8Kodla(s) { try { return unescape(encodeURIComponent(s)); } catch (e) { return ''; } }
    function utf8Coz(b) { try { return decodeURIComponent(escape(b)); } catch (e) { return null; } }
    function b32Kodla(bin) {
        var out = '', acc = 0, n = 0;
        for (var i = 0; i < bin.length; i++) {
            acc = ((acc << 8) | (bin.charCodeAt(i) & 255)) & 0xFFFF; n += 8;
            while (n >= 5) { n -= 5; out += String.fromCharCode(95 + ((acc >> n) & 31)); }
        }
        if (n > 0) out += String.fromCharCode(95 + ((acc << (5 - n)) & 31));
        return out;
    }
    function b32Coz(s) {
        var out = '', acc = 0, n = 0;
        for (var i = 0; i < s.length; i++) {
            var v = s.charCodeAt(i) - 95;
            if (v < 0 || v > 31) return null;
            acc = ((acc << 5) | v) & 0xFFFF; n += 5;
            if (n >= 8) { n -= 8; out += String.fromCharCode((acc >> n) & 255); }
        }
        return out;
    }
    function silikKodla(s) {
        if (!s || !s.t) return '';
        var k = (s.k === 'm' || s.k === 'e') ? s.k : 'g', a = (s.a === 'c' || s.a === 'l') ? s.a : 'r';
        var govde = Math.round(s.x * 2) + ',' + Math.round(s.y * 2) + ',' + Math.round(s.b * 2) + ',' + a + ';' + String(s.t).slice(0, 80);
        return 'g' + k + b32Kodla(utf8Kodla(govde));
    }
    function silikCoz(t) {
        if (!t || t.length < 3 || t.charAt(0) !== 'g') return null;
        var bin = b32Coz(t.slice(2));
        if (bin == null) return null;
        var g = utf8Coz(bin);
        if (g == null) return null;
        var m = /^(-?\d+),(-?\d+),(\d+),([rcl]);([\s\S]+)$/.exec(g);
        if (!m) return null;
        var k = t.charAt(1);
        return { t: m[5], x: +m[1] / 2, y: +m[2] / 2, b: Math.max(4, +m[3] / 2), k: (k === 'm' || k === 'e') ? k : 'g', a: m[4] };
    }
    /* bir sayfanın kayıt gövdesi ('c' + çizgiler + silik yazılar) ve tersi */
    function sayfaGovde(s) {
        return 'c' + s.cizimler.map(cizgiKodla).map(function (x) { return ' ' + x; }).join('') +
            ((s.silik && s.silik.length) ? s.silik.map(silikKodla).filter(Boolean).map(function (x) { return ' ' + x; }).join('') : '');
    }
    function sayfaParcala(ps) {
        var c = [], s = [];
        String(ps || '').slice(1).split(' ').forEach(function (t) {
            if (!t) return;
            if (t.charAt(0) === 'g') { var o = silikCoz(t); if (o) s.push(o); return; }
            var z = cizgiCoz(t); if (z) c.push(z);
        });
        return { c: c, s: s };
    }
    function silikImza(sy) {
        var S = sy.silik, m = S ? S.length : 0, s = m ? S[m - 1] : null;
        return m ? '|s' + m + ':' + s.x + ':' + s.y + ':' + s.k + String(s.t).length : '';
    }

    /* ---------------- çizim ----------------
       Sayfanın yerel koordinatında (tuvalin o anki dönüşümüyle) */
    function silikYaz(ctx, sy) {
        var L = sy && sy.silik;
        if (!L || !L.length) return;
        ctx.save();
        ctx.setLineDash([]);
        ctx.globalCompositeOperation = 'source-over';
        ctx.textBaseline = 'alphabetic';
        for (var i = 0; i < L.length; i++) {
            var s = L[i];
            if (!s || !s.t) continue;
            if (RA && s === RA.s && UI && ctx.canvas === UI.alt) continue;    /* v24: yerinde yazılıyor */
            ctx.font = (s.k === 'e' ? '700 ' : '') + Math.max(4, s.b) + 'px ' + SILIK_FONT;
            ctx.fillStyle = SILIK_RENK[s.k] || SILIK_RENK.g;
            try { ctx.direction = s.k === 'e' ? 'ltr' : 'rtl'; } catch (e) { }
            ctx.textAlign = s.a === 'c' ? 'center' : (s.a === 'l' ? 'left' : 'right');
            ctx.fillText(s.t, s.x, s.y);
        }
        ctx.restore();
    }
    /* önizleme ve PDF: dönüşüm cizimCiz'deki gibi (ölçek o, sol x0, üst y0) */
    function silikCizO(ctx, sy, o, x0, y0) {
        if (!sy || !sy.silik || !sy.silik.length) return;
        ctx.save();
        ctx.setTransform(o, 0, 0, o, -(x0 || 0) * o, -(y0 || 0) * o);
        silikYaz(ctx, sy);
        ctx.restore();
    }
    var _fontSoz = null;
    function fontHazir() {
        if (_fontSoz) return _fontSoz;
        var p = null;
        try { if (document.fonts && document.fonts.load) p = document.fonts.load('60px Arakom', '\u0628\u0640\u0627'); } catch (e) { p = null; }
        _fontSoz = Promise.race([p || Promise.resolve(), new Promise(function (r) { setTimeout(r, 2500); })]).then(function () { }, function () { });
        return _fontSoz;
    }
    var _olcCtx = null;
    function olcu(metin, F) {
        try {
            if (!_olcCtx) _olcCtx = document.createElement('canvas').getContext('2d');
            _olcCtx.font = F + 'px ' + SILIK_FONT;
            try { _olcCtx.direction = 'rtl'; } catch (e) { }
            return _olcCtx.measureText(metin).width;
        } catch (e) { return String(metin).length * F * 0.5; }
    }
    function yuvarla(v) { return Math.round(v * 2) / 2; }
    function temizMetin(m) { return String(m == null ? '' : m).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60); }

    /* ---------------- satırlar ve yerleştirme ----------------
       Sayfanın yazı satırları (yerel koordinat): taban yazının oturduğu çizgi,
       ust elif boyu, [b0, b1] satırın gövdesi (dolu mu diye bakılan bant), F
       yazı boyu, et etiketin tabanı. */
    function yaziSatirlari() {
        var R = cizgiDuzeni(), L = [];
        if (R.g) {
            guzelYerleri(R).forEach(function (s) {
                var a = s.taban - s.ust;
                L.push({ ust: s.ust, taban: s.taban, alt: s.alt, b0: s.orta, b1: s.taban, F: a * 0.92 / ARAKOM_ELIF, et: s.ust - 9, eb: Math.max(13, Math.min(22, a * 0.2)) });
            });
        } else {
            var Y = cizgiYerleri(R), g = Y.length > 1 ? Y[1] - Y[0] : (BLOK - R.ust) / (R.n + 1);
            var F = Math.min(160, g * 0.9), ust = F * ARAKOM_ELIF;
            Y.forEach(function (y) {
                L.push({ ust: y - ust, taban: y, alt: y + 0.3 * g, b0: y - 0.45 * g, b1: y - 0.04 * g, F: F, et: y - ust - 12, eb: Math.max(13, Math.min(22, g * 0.17)) });
            });
        }
        return L;
    }
    function doluSatirlar(sy, L) {
        var dolu = L.map(function () { return false; });
        (sy.silik || []).forEach(function (s) {
            if (s.k === 'e') return;
            for (var r = 0; r < L.length; r++) if (Math.abs(s.y - L[r].taban) < 6) { dolu[r] = true; break; }
        });
        sy.cizimler.forEach(function (c) {
            if (c.s) return;
            for (var i = 1; i < c.p.length; i += 2) {
                var y = c.p[i];
                for (var r = 0; r < L.length; r++) if (y >= L[r].b0 && y <= L[r].b1) { dolu[r] = true; break; }
            }
        });
        return dolu;
    }
    /* açık sayfadan başlayarak, yazılı son satırın altında 'gereken' kadar boş satır */
    function hedefBul(gereken, bos) {
        var L = yaziSatirlari();
        if (!L.length || gereken > L.length) return null;
        for (var j = D.aktif, tur = 0; tur < 80; j++, tur++) {
            if (j >= D.sayfalar.length) D.sayfalar.push(yeniSayfa('c'));
            var dolu = doluSatirlar(D.sayfalar[j], L), son = -1;
            for (var r = 0; r < dolu.length; r++) if (dolu[r]) son = r;
            var bas = son < 0 ? 0 : son + 1 + (bos ? 1 : 0);
            if (bas + gereken <= L.length) return { j: j, r: bas, L: L };
        }
        return null;
    }
    /* ÇİZGİ DÜZENİ DEĞİŞİNCE (çizgili ↔ güzel yazı, çizgi sayısı) silik yazılar yeni
       satırlara taşınır: her yazı aynı sıradaki satırın tabanına oturur, boyu yeni
       satırın boyuna göre ölçeklenir (sağdan dizilen tekrarlar da aynı oranda);
       yeni düzende o sıra yoksa yerinde kalır. */
    function silikYenidenDiz(eski, yeni) {
        if (!D || !eski || !yeni || !eski.length || !yeni.length) return;
        var xb = SAG() - 64;
        D.sayfalar.forEach(function (sy) {
            if (!sy.silik || !sy.silik.length) return;
            sy.silik = sy.silik.map(function (s) {
                var et = s.k === 'e', r = -1, i;
                for (i = 0; i < eski.length; i++) if (Math.abs(s.y - yuvarla(et ? eski[i].et : eski[i].taban)) < 3) { r = i; break; }
                if (r < 0 || r >= yeni.length) return s;
                var o = eski[r], n = yeni[r], k = et ? n.eb / o.eb : n.F / o.F, t = {};
                for (var a in s) if (Object.prototype.hasOwnProperty.call(s, a)) t[a] = s[a];
                t.y = yuvarla(et ? n.et : n.taban);
                t.b = yuvarla(Math.max(4, s.b * k));
                if (s.a === 'r') t.x = yuvarla(xb - (xb - s.x) * k);
                return t;
            });
        });
    }
    /* GENİŞ EKRANDA PENCERE KÂĞIDI ÖRTMEZ: kâğıt pencerenin sağında kalan yere sığar
       (sayfanın bütün eni görünür, yalnız biraz küçülür); dar ekranda üstüne açılır */
    function silikSerit(serit, sw) {
        if (!UI || !UI.silik || UI.silik.hidden) return serit;
        var sag = UI.silik.offsetLeft + UI.silik.offsetWidth + 10;
        return (sw - sag >= 520) ? Math.max(serit, sag) : serit;
    }
    function silikGoster(j, y0, y1) {
        if (!UI || !dikeyMi()) return;
        var ph = sayfaYuk(), up = UI.ustPay || 0, a = j * ph + y0 - 50, b = j * ph + y1 + 30;
        if (a >= UI.cy + up && b <= UI.cy + UI.Lh - (UI.altPay || 0)) return;
        kaydirHedef(a - up);
    }
    function silikEkle(j, yeni, r, L, satir) {
        var sy = D.sayfalar[j];
        sy.silik = (sy.silik || []).concat(yeni);
        D.geri.push({ t: 'silik', j: j, adet: yeni.length });
        D.ileri = [];
        D.kirli = true;
        sayfaCiz();
        silikGoster(j, L[r].ust - 30, L[Math.min(L.length - 1, r + (satir || 1) - 1)].alt);
        ySayfaGonder(j);
    }
    function izliyorMu() {
        if (!yIzleyen()) return false;
        bildir('Bu ekran yansıtmayı izliyor; silik yazıyı yazan cihazdan koy', true);
        return true;
    }
    function silikKelimeKoy(metin, cip) {
        if (izliyorMu()) return;
        metin = temizMetin(metin);
        if (!metin) { bildir('Önce bir kelime yaz', true); return; }
        fontHazir().then(function () {
            if (!D || !UI) return;
            yFark();
            var h = hedefBul(1, T.sk.bosK);
            if (!h) { bildir('Satır bulunamadı', true); return; }
            var s = h.L[h.r], xa = SOLX() + 36, xb = SAG() - 64, gen = xb - xa;
            var F = s.F, w = olcu(metin, F);
            if (w > gen) { F = Math.max(F * 0.45, F * gen / w); w = olcu(metin, F); }
            var ara = Math.max(36, F * 0.55), adet = 1;
            if (T.sk.tekrar) adet = Math.max(1, Math.min(12, Math.floor((gen + ara) / (w + ara))));
            var yeni = [];
            for (var i = 0; i < adet; i++) yeni.push({ t: metin, x: yuvarla(xb - i * (w + ara)), y: yuvarla(s.taban), b: yuvarla(F), k: 'g', a: 'r' });
            silikEkle(h.j, yeni, h.r, h.L, 1);
            if (cip) { cip.classList.add('kondu'); setTimeout(function () { cip.classList.remove('kondu'); }, 900); }
        });
    }
    function harfBul(h) { for (var i = 0; i < HARFLER.length; i++) if (HARFLER[i][0] === h) return HARFLER[i]; return null; }
    function silikHarfKoy(h, cip) {
        var H = harfBul(h);
        if (!H || izliyorMu()) return;
        fontHazir().then(function () {
            if (!D || !UI) return;
            yFark();
            var ek = T.sk.harfSilik ? 1 : 0;
            var hb = hedefBul(1 + ek, T.sk.bosH);
            if (!hb) { bildir('Satır bulunamadı', true); return; }
            var L = hb.L, s = L[hb.r], xa = SOLX() + 36, xb = SAG() - 64, adim = (xb - xa) / 4;
            var bicim = [H[0], H[2], H[3], H[4]], yeni = [];
            for (var i = 0; i < 4; i++) {
                var cx = yuvarla(xb - (i + 0.5) * adim);
                yeni.push({ t: HARF_BICIM[i], x: cx, y: yuvarla(s.et), b: yuvarla(s.eb), k: 'e', a: 'c' });
                yeni.push({ t: bicim[i], x: cx, y: yuvarla(s.taban), b: yuvarla(s.F), k: 'm', a: 'c' });
                if (ek) yeni.push({ t: bicim[i], x: cx, y: yuvarla(L[hb.r + 1].taban), b: yuvarla(L[hb.r + 1].F), k: 'g', a: 'c' });
            }
            silikEkle(hb.j, yeni, hb.r, L, 1 + ek);
            if (cip) { cip.classList.add('kondu'); setTimeout(function () { cip.classList.remove('kondu'); }, 900); }
        });
    }
    function silikKaldir() {
        if (!D || izliyorMu()) return;
        yFark();
        var j = D.aktif, sy = D.sayfalar[j];
        if (!sy.silik || !sy.silik.length) { bildir('Bu sayfada silik yazı yok'); return; }
        D.geri.push({ t: 'silikSil', j: j, onceki: sy.silik.slice() });
        D.ileri = [];
        sy.silik = [];
        D.kirli = true;
        sayfaCiz();
        ySayfaGonder(j);
        bildir('Silik yazılar kaldırıldı — geri almak için ↶');
    }
    /* geri al / yinele (geriAl, yinele çağırır) */
    function silikGeri(a, sy) {
        if (a.t === 'silik') {
            var cik = sy.silik.splice(Math.max(0, sy.silik.length - a.adet), a.adet);
            D.ileri.push({ t: 'silik', j: a.j, L: cik });
        } else { D.ileri.push({ t: 'silikSil', j: a.j, onceki: a.onceki }); sy.silik = a.onceki.slice(); }
        D.kirli = true; sayfaCiz();
        ySayfaGonder(a.j);
    }
    function silikIleri(a, sy) {
        if (a.t === 'silik') { sy.silik = (sy.silik || []).concat(a.L); D.geri.push({ t: 'silik', j: a.j, adet: a.L.length }); }
        else { D.geri.push({ t: 'silikSil', j: a.j, onceki: (sy.silik || []).slice() }); sy.silik = []; }
        D.kirli = true; sayfaCiz();
        ySayfaGonder(a.j);
    }
    /* yansıtma: değişen sayfa bütün olarak öbür ekrana (izleyenin geri al yığını bunu bilmez) */
    function ySayfaGonder(j) {
        if (!YK || !YK.kodlar || !D || !yLider() || !D.sayfalar[j]) return;
        var kod = sayfaKodu(j);
        while (YK.kodlar.length < D.sayfalar.length) YK.kodlar.push('c');
        yGonder({ t: 'p', j: j, kod: kod, uz: D.sayfalar.length });
        YK.kodlar[j] = kod;
    }

    /* ---------------- kelime verisi ---------------- */
    var _betik = {};
    function betikYukle(src) {
        if (_betik[src]) return _betik[src];
        _betik[src] = new Promise(function (res) {
            var s = document.createElement('script');
            s.src = src; s.async = true;
            s.onload = function () { res(true); };
            s.onerror = function () { delete _betik[src]; res(false); };
            document.head.appendChild(s);
        });
        return _betik[src];
    }
    function skHazir() {
        return Promise.all([window.KidefSinifVeri ? true : betikYukle(SVERI_YOL),
                            window.KidefIHKelime ? true : betikYukle(IHK_YOL)]);
    }
    function skAgac(sinif) {
        var K = window.KidefIHKelime;
        if (!K) return [];
        try { if (K.agac) return K.agac(String(sinif)) || []; } catch (e) { }
        return (K.mufredat && K.mufredat[String(sinif)]) || [];
    }
    function skDersYolu(id) {
        var V = window.KidefSinifVeri;
        try { if (V && V.dersYolu) return V.dersYolu(id); } catch (e) { }
        return 'muhadese/veri/' + id + '.js';
    }
    /* ders dosyası sayfaya BETİK OLARAK yüklenmez: dosya window.data yazıyor,
       ana sayfadaki aynı adlı veriyi ezerdi. Metin okunur, ayrı bir kapta çalışır. */
    var _skKel = {};
    function skDers(id) {
        var yol = skDersYolu(id);
        if (_skKel[yol]) return _skKel[yol];
        _skKel[yol] = fetch(yol, { credentials: 'same-origin' }).then(function (r) {
            if (!r.ok) throw new Error('durum ' + r.status);
            return r.text();
        }).then(function (kod) {
            var kap = {};
            (new Function('window', kod + '\n;'))(kap);
            var d = kap.data || {}, gor = {}, L = [];
            (Array.isArray(d.words) ? d.words : []).forEach(function (x) {
                if (!x || !x.ar) return;
                kelimeAyir({ ar: String(x.ar).trim(), tr: String(x.tr || '').trim() }).forEach(function (w) {
                    if (!w.ar || gor[w.ar]) return;
                    gor[w.ar] = 1; L.push(w);
                });
            });
            return L;
        }).catch(function () { delete _skKel[yol]; return null; });
        return _skKel[yol];
    }
    /* «A / B» (eril / dişil, eş anlamlı) ve «tekil (ج) çoğul» girdileri iki ayrı kelime:
       satıra kesme işaretiyle iki kelime birden yazılmasın */
    function kelimeAyir(w) {
        var ar = w.ar, tr = w.tr || '', m = /^(.+?)\s*\(\s*ج\s*\)\s*(.+)$/.exec(ar);
        if (m) {
            var t2 = tr.split(/\s+[\u2013\u2014-]\s+/);
            return [{ ar: m[1].trim(), tr: t2.length === 2 ? t2[0] : tr },
                    { ar: m[2].trim(), tr: t2.length === 2 ? t2[1] : (tr ? tr + ' (çoğul)' : '') }];
        }
        var p = ar.split(/\s*\/\s*/);
        if (p.length === 2 && p[0] && p[1]) {
            var mt = /^(.*?)\s*\(([^()]+?)\s*\/\s*([^()]+?)\)\s*$/.exec(tr), tp = tr.split(/\s+\/\s+/);
            return [{ ar: p[0].trim(), tr: mt ? mt[1] + ' (' + mt[2] + ')' : (tp.length === 2 ? tp[0] : tr) },
                    { ar: p[1].trim(), tr: mt ? mt[1] + ' (' + mt[3] + ')' : (tp.length === 2 ? tp[1] : tr) }];
        }
        return [w];
    }
    function ayirAd(ad) {
        var i = String(ad || '').indexOf('|');
        return i < 0 ? { tr: String(ad || '').trim(), ar: '' } : { tr: ad.slice(0, i).trim(), ar: ad.slice(i + 1).trim() };
    }

    /* ---------------- tercih ---------------- */
    function skTercih(t) {
        t = (t && typeof t === 'object') ? t : {};
        return { tekrar: t.tekrar !== false, bosK: !!t.bosK, bosH: t.bosH !== false, harfSilik: !!t.harfSilik, anim: t.anim !== false,
                 sinif: SK_SINIFLAR.indexOf(String(t.sinif)) >= 0 ? String(t.sinif) : '',
                 ders: (t.ders && typeof t.ders === 'object') ? t.ders : {}, sek: t.sek === 'h' ? 'h' : 'k' };
    }
    function skSinif() {
        if (UI && UI.skSinif) return UI.skSinif;
        var d = (D && /^\d+$/.test(String(D.sinif))) ? String(+D.sinif) : '';
        return SK_SINIFLAR.indexOf(d) >= 0 ? d : (T.sk.sinif || '5');
    }

    /* ---------------- pencere ---------------- */
    function silikStilKur() {
        if (document.getElementById('ys-silik-stil')) return;
        var s = document.createElement('style');
        s.id = 'ys-silik-stil';
        s.textContent = [
            '#ysOrt [hidden]{display:none !important;}',
            /* çubuk tuşu: defter türü anahtarının yanında */
            '.ys-ust2 .ys-csec .ys-silikt{margin-inline-start:6px; height:34px; min-width:34px; border-radius:999px; background:#fff;',
            '  box-shadow:0 0 0 1px #DDE3EA; padding:0 12px 0 9px; color:#3D4756; white-space:nowrap;}',
            '.ys-ust2 .ys-csec .ys-silikt:hover{background:#E5EBF3;}',
            '.ys-ust2 .ys-csec .ys-silikt.sec{background:#16A085; color:#fff; box-shadow:0 2px 6px rgba(14,124,102,.35);}',
            '@media (max-width:1180px){.ys-ust2 .ys-csec .ys-silikt span{display:none;} .ys-ust2 .ys-csec .ys-silikt{padding:0 8px;}}',
            '@media (max-width:760px){.ys-ust2 .ys-csec .ys-silikt{height:30px; min-width:30px; padding:0 6px;}}',
            /* pencere: kâğıdın solunda (Arapça sağdan başlar, yeni yazı sağda görünür) */
            '.ys-silik{position:absolute; top:10px; left:10px; bottom:10px; width:min(372px, calc(100% - 20px)); z-index:5; display:flex; flex-direction:column;',
            '  background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 18px 44px rgba(15,23,42,.24), 0 0 0 1px rgba(15,23,42,.06);',
            '  animation:ysSol .15s ease-out; color:#2C3E50;}',
            '#ysKutu.dikey .ys-silik{left:50px; width:min(372px, calc(100% - 60px));}',             /* soldaki kaydırma çubuğu açık kalsın */
            '.ys-sl-bas{display:flex; align-items:center; gap:8px; padding:11px 10px 8px 14px; flex:none;}',
            '.ys-sl-bas b{display:flex; align-items:center; gap:8px; font-size:1.05rem; color:#0E7C66;}',
            '.ys-sl-bas b svg{width:24px; height:24px;}',
            '.ys-sl-bas .ys-t.kapat{width:40px; height:40px; min-width:40px; padding:0; border-radius:50%;}',
            '.ys-sl-sekler{display:flex; gap:4px; padding:3px; margin:0 12px 8px; background:#EEF2F6; border-radius:999px; flex:none;}',
            '.ys-sl-sekler button{flex:1 1 0; border:0; background:transparent; border-radius:999px; height:40px; font-family:inherit;',
            '  font-weight:800; font-size:.92rem; color:#55606D; cursor:pointer; touch-action:manipulation;}',
            '.ys-sl-sekler button.sec{background:#16A085; color:#fff; box-shadow:0 2px 6px rgba(14,124,102,.3);}',
            '.ys-sl-ic{flex:1 1 auto; overflow:auto; padding:2px 12px 12px; -webkit-overflow-scrolling:touch; overscroll-behavior:contain;}',
            '.ys-sl-blok{margin:0 0 11px;}',
            '.ys-sl-et{display:flex; align-items:baseline; gap:6px; font-size:.74rem; font-weight:800; color:#8A94A3; letter-spacing:.03em;',
            '  margin:0 0 5px 2px; text-transform:uppercase;}',
            '.ys-sl-et i{font-style:normal; text-transform:none; letter-spacing:0; color:#0E7C66; font-weight:700;}',
            '.ys-sl-cipler{display:flex; flex-wrap:wrap; gap:5px;}',
            '.ys-sl-cip{min-width:46px; height:42px; border:0; border-radius:12px; background:#F2F5F9; color:#2C3E50; font-family:inherit;',
            '  font-weight:900; font-size:1.02rem; cursor:pointer; box-shadow:inset 0 0 0 1px #E3E8EF;}',
            '.ys-sl-cip:hover{background:#E5EBF3;} .ys-sl-cip.sec{background:#16A085; color:#fff; box-shadow:none;}',
            '.ys-sl-sec{width:100%; height:46px; border:1.5px solid #DDE3EA; border-radius:12px; padding:0 10px; font-family:inherit;',
            '  font-size:.92rem; font-weight:700; color:#2C3E50; background:#fff; cursor:pointer;}',
            '.ys-sl-kel{display:grid; grid-template-columns:repeat(auto-fill, minmax(104px, 1fr)); gap:6px; margin:0 0 13px;}',
            '.ys-sl-kelime{border:0; background:#F7F9FB; border-radius:12px; padding:7px 6px 7px; cursor:pointer; display:flex; flex-direction:column;',
            '  align-items:center; justify-content:center; gap:2px; min-height:64px; font-family:inherit; box-shadow:inset 0 0 0 1px #E3E8EF;',
            '  transition:background .12s, box-shadow .12s;}',
            '.ys-sl-kelime b{font-size:1.55rem; font-weight:400; line-height:1.3; color:#3D4756; direction:rtl; unicode-bidi:isolate; word-break:break-word;}',
            '.ys-sl-kelime small{font-size:.7rem; font-weight:700; color:#8A94A3; text-align:center; line-height:1.2;}',
            '.ys-sl-kelime:hover{background:#EEF8F5; box-shadow:inset 0 0 0 1.5px #A9DCCF;}',
            '.ys-sl-kelime.kondu,.ys-sl-harf.kondu{background:#D6F0E9; box-shadow:inset 0 0 0 2px #16A085;}',
            '.ys-sl-bilgi{margin:4px 2px 12px; color:#8A94A3; font-size:.82rem; line-height:1.5;}',
            '.ys-sl-yaz{display:flex; gap:6px; align-items:center;}',
            '.ys-sl-yaz input{flex:1 1 auto; min-width:0; height:48px; box-sizing:border-box; border:1.5px solid #DDE3EA; border-radius:12px;',
            '  padding:0 12px; font-size:1.5rem; color:#2C3E50; background:#fff; direction:rtl;}',
            '.ys-sl-yaz input:focus{outline:none; border-color:#16A085; box-shadow:0 0 0 3px rgba(22,160,133,.15);}',
            '.ys-sl-kb{width:48px; height:48px; flex:none; border:0; border-radius:12px; background:#F2F5F9; color:#3D4756; cursor:pointer;',
            '  display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 0 1px #E3E8EF;}',
            '.ys-sl-kb svg{width:26px; height:26px;} .ys-sl-kb.sec{background:#16A085; color:#fff; box-shadow:none;}',
            '.ys-sl-koy{height:48px; flex:none; border:0; border-radius:12px; background:#16A085; color:#fff; padding:0 14px; font-family:inherit;',
            '  font-weight:800; font-size:.9rem; cursor:pointer; box-shadow:0 3px 10px rgba(14,124,102,.3);}',
            '.ys-sl-koy:hover{background:#0E7C66;}',
            '.ys-sl-klv{margin-top:7px; padding:6px; border-radius:14px; background:#F2F5F9; display:flex; flex-direction:column; gap:4px;}',
            '.ys-sl-ks{display:flex; gap:4px; direction:rtl;}',
            '.ys-sl-tus{flex:1 1 0; min-width:0; height:42px; border:0; border-radius:9px; background:#fff; color:#2C3E50; cursor:pointer; padding:0;',
            '  font-size:1.35rem; line-height:1; box-shadow:0 1px 2px rgba(15,23,42,.12);}',
            '.ys-sl-tus:hover{background:#E5EBF3;} .ys-sl-tus:active{background:#D6F0E9;}',
            '.ys-sl-tus.hr{font-size:1.75rem; color:#0E7C66; line-height:1.6; overflow:hidden;}',
            '.ys-sl-tus.genis{flex:3 1 0; font-size:.85rem; font-weight:800; direction:ltr;} .ys-sl-tus.sil{flex:1.6 1 0; font-size:1.1rem; direction:ltr;}',
            '.ys-sl-ayar{display:flex; flex-direction:column; gap:6px; margin:2px 0 6px;}',
            '.ys-sl-anah{display:flex; align-items:center; gap:10px; border:0; background:transparent; padding:6px 4px; border-radius:10px; cursor:pointer;',
            '  font-family:inherit; font-size:.9rem; font-weight:700; color:#3D4756; text-align:start;}',
            '.ys-sl-anah:hover{background:#F2F5F9;}',
            '.ys-sl-anah i{position:relative; flex:none; width:44px; height:26px; border-radius:999px; background:#D5DCE5; transition:background .15s;}',
            '.ys-sl-anah i::after{content:""; position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#fff;',
            '  box-shadow:0 1px 3px rgba(15,23,42,.25); transition:transform .15s;}',
            '.ys-sl-anah.acik i{background:#16A085;} .ys-sl-anah.acik i::after{transform:translateX(18px);}',
            '.ys-sl-harfler{display:grid; grid-template-columns:repeat(auto-fill, minmax(58px, 1fr)); gap:6px; margin:0 0 13px; direction:rtl;}',
            '.ys-sl-harf{border:0; background:#F7F9FB; border-radius:12px; height:70px; cursor:pointer; display:flex; flex-direction:column; align-items:center;',
            '  justify-content:center; gap:1px; font-family:inherit; box-shadow:inset 0 0 0 1px #E3E8EF; padding:0;}',
            '.ys-sl-harf b{font-size:1.9rem; font-weight:400; line-height:1.15; color:#2C3E50;}',
            '.ys-sl-harf small{font-size:.66rem; font-weight:700; color:#8A94A3; direction:ltr;}',
            '.ys-sl-harf:hover{background:#EEF8F5; box-shadow:inset 0 0 0 1.5px #A9DCCF;}',
            '.ys-sl-alt{flex:none; padding:8px 12px 12px; border-top:1px solid #EEF1F5; display:flex; flex-direction:column; gap:6px;}',
            '.ys-sl-kaldir{height:42px; border:0; border-radius:12px; background:#FDEDEC; color:#C0392B; font-family:inherit; font-weight:800; font-size:.88rem;',
            '  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;}',
            '.ys-sl-kaldir svg{width:19px; height:19px;} .ys-sl-kaldir:hover{background:#FADBD8;}',
            '.ys-sl-kaldir[disabled]{opacity:.45; cursor:default; background:#F6F7F9; color:#8A94A3;}',
            '.ys-sl-ipucu{margin:0; font-size:.74rem; color:#A3ADBA; line-height:1.45; text-align:center;}',
            '.ys-silik button{touch-action:manipulation;}',
            '@media (max-width:760px){.ys-silik,#ysKutu.dikey .ys-silik{top:6px; left:6px; bottom:6px; width:calc(100% - 12px); border-radius:14px;}',
            '  .ys-sl-kel{grid-template-columns:repeat(auto-fill, minmax(92px, 1fr));} .ys-sl-kelime b{font-size:1.35rem;}}',
            /* 941-1100 px (yatay tablet): başlığın yazısı gizlenir, sağdaki «Ana sayfa» / PDF çubuğa sığar */
            '@media (max-width:1100px) and (min-width:941px){.ys-ust2 .ys-baslik span{display:none;}}',
            '@media (prefers-reduced-motion: reduce){.ys-silik{animation:none;}}'
        ].join('\n');
        document.head.appendChild(s);
    }
    function silikPanelHtml() {
        return '<div class="ys-silik" id="ysSilik" role="dialog" aria-label="Silik yazı" hidden>' +
            '<div class="ys-sl-bas"><b>' + IK.silik + 'Silik yazı</b><span class="ys-bos"></span>' +
              '<button type="button" class="ys-t kapat" data-sk="kapat" title="Kapat (Esc)" aria-label="Kapat">&times;</button></div>' +
            '<div class="ys-sl-sekler" role="tablist">' +
              '<button type="button" data-sk="sek" data-v="k" role="tab">Kelime</button>' +
              '<button type="button" data-sk="sek" data-v="h" role="tab">Harf</button></div>' +
            '<div class="ys-sl-ic" id="ysSlIc"></div>' +
            '<div class="ys-sl-alt">' +
              '<button type="button" class="ys-sl-kaldir" data-sk="kaldir" title="Açık sayfadaki silik yazıları kaldırır (geri alınabilir)">' + IK.temizle +
                '<span>Bu sayfadaki silik yazıları kaldır</span></button>' +
              '<p class="ys-sl-ipucu">Silgi silik yazıyı silmez; «Tüm sayfayı sil» yalnız kalemle yazılanı siler.</p>' +
            '</div></div>';
    }
    function silikKur() {
        if (!UI) return;
        UI.silik = UI.ort.querySelector('#ysSilik');
        UI.slIc = UI.ort.querySelector('#ysSlIc');
        UI.slKaldir = UI.ort.querySelector('[data-sk="kaldir"]');
        UI.skSinif = '';
        if (!UI.silik) return;
        UI.silik.addEventListener('change', function (e) {
            var t = e.target;
            if (t && t.id === 'ysSlDers') {
                var s = skSinif();
                T.sk.ders[s] = t.value; tercihKaydet();
                skKelimeleriCiz(s, t.value);
            }
        });
        UI.silik.addEventListener('input', function (e) {
            if (e.target && e.target.id === 'ysSlGirdi') UI.skGirdi = e.target.value;
        });
        UI.silik.addEventListener('keydown', function (e) {
            if (e.target && e.target.id === 'ysSlGirdi' && e.key === 'Enter') { e.preventDefault(); silikKelimeKoy(e.target.value); }
        });
        fontHazir().then(function () { if (UI && D) sayfaCiz(); });
    }
    function silikAc(sek) {
        if (!UI || !UI.silik) return;
        if (sek === 'k' || sek === 'h') { T.sk.sek = sek; tercihKaydet(); }
        genelKapat(); silSorKapat(); cpopKapat();
        UI.silik.hidden = false;
        silikCiz();
        cizimAyarla();                                   /* geniş ekranda kâğıt pencerenin sağına sığar */
        aracGuncelle();
    }
    function silikKapat() {
        if (!UI || !UI.silik || UI.silik.hidden) return;
        UI.silik.hidden = true;
        cizimAyarla();
        aracGuncelle();
    }
    function silikAcKapa() { if (UI && UI.silik && UI.silik.hidden) silikAc(); else silikKapat(); }
    function silikCiz() {
        if (!UI || !UI.slIc) return;
        [].forEach.call(UI.silik.querySelectorAll('[data-sk="sek"]'), function (b) {
            var se = b.getAttribute('data-v') === T.sk.sek;
            b.classList.toggle('sec', se); b.setAttribute('aria-selected', se ? 'true' : 'false');
        });
        if (T.sk.sek === 'h') skHarfCiz(UI.slIc); else skKelimeCiz(UI.slIc);
        UI.slIc.scrollTop = 0;
    }
    function skAyarHtml(sek) {
        var A = sek === 'h'
            ? [['harfSilik', 'Altına silik tekrar (öğrenci üstünden geçer)'], ['bosH', 'Altına boş satır bırak'],
               ['anim', 'Rehber harfe dokununca yazılışı gösterilsin']]
            : [['tekrar', 'Satırı doldur (kelime tekrarlanır)'], ['bosK', 'Altına boş satır bırak']];
        return '<div class="ys-sl-ayar">' + A.map(function (a) {
            var ac = !!T.sk[a[0]];
            return '<button type="button" class="ys-sl-anah' + (ac ? ' acik' : '') + '" data-sk="ayar" data-v="' + a[0] + '" role="switch" aria-checked="' +
                (ac ? 'true' : 'false') + '"><i></i><span>' + esc(a[1]) + '</span></button>';
        }).join('') + '</div>';
    }
    function skKlavyeHtml() {
        var sat = KLAVYE.map(function (s) {
            return '<div class="ys-sl-ks">' + s.split(' ').map(function (h) {
                return '<button type="button" class="ys-sl-tus" data-sk="tus" data-t="' + esc(h) + '">' + esc(h) + '</button>';
            }).join('') + '</div>';
        });
        sat.push('<div class="ys-sl-ks">' + HAREKE.map(function (h) {
            return '<button type="button" class="ys-sl-tus hr" data-sk="tus" data-t="' + h + '" aria-label="hareke">\u0640\u0640' + h + '</button>';
        }).join('') + '</div>');
        sat.push('<div class="ys-sl-ks"><button type="button" class="ys-sl-tus sil" data-sk="geriSil" title="Sil" aria-label="Son harfi sil">⌫</button>' +
            '<button type="button" class="ys-sl-tus genis" data-sk="tus" data-t=" ">boşluk</button>' +
            '<button type="button" class="ys-sl-tus sil" data-sk="girdiSil" title="Hepsini sil" aria-label="Kutuyu boşalt">&times;</button></div>');
        return '<div class="ys-sl-klv" id="ysSlKlv"' + (UI.skKlavye ? '' : ' hidden') + '>' + sat.join('') + '</div>';
    }
    function skKelimeCiz(ic) {
        var s = skSinif(), eski = ic.querySelector('#ysSlGirdi'), deger = eski ? eski.value : (UI.skGirdi || '');
        ic.innerHTML =
            '<div class="ys-sl-blok"><div class="ys-sl-et">Sınıf</div><div class="ys-sl-cipler">' +
              SK_SINIFLAR.map(function (n) {
                  return '<button type="button" class="ys-sl-cip' + (n === s ? ' sec' : '') + '" data-sk="sinif" data-v="' + n + '" aria-pressed="' + (n === s) + '">' + n + '</button>';
              }).join('') + '</div></div>' +
            '<div class="ys-sl-blok"><div class="ys-sl-et">Ünite ve ders <i id="ysSlKitap"></i></div>' +
              '<select class="ys-sl-sec" id="ysSlDers" aria-label="Ünite ve ders"><option>Yükleniyor…</option></select></div>' +
            '<div class="ys-sl-kel" id="ysSlKel"><p class="ys-sl-bilgi">Kelimeler yükleniyor…</p></div>' +
            '<div class="ys-sl-blok"><div class="ys-sl-et">Kendin yaz</div>' +
              '<div class="ys-sl-yaz"><input type="text" id="ysSlGirdi" dir="rtl" lang="ar" maxlength="60" autocomplete="off" autocapitalize="off" spellcheck="false"' +
                (UI.skKlavye ? ' inputmode="none"' : '') + ' placeholder="مَثَلًا: كِتاب" value="' + esc(deger) + '" aria-label="Sayfaya konacak yazı">' +
                '<button type="button" class="ys-sl-kb' + (UI.skKlavye ? ' sec' : '') + '" data-sk="klavye" title="Arapça klavye" aria-label="Arapça klavye" aria-pressed="' + !!UI.skKlavye + '">' + IK.klavye + '</button>' +
                '<button type="button" class="ys-sl-koy" data-sk="koy">Koy</button></div>' +
              skKlavyeHtml() + '</div>' +
            skAyarHtml('k');
        skDersleriDoldur(s);
    }
    function skDersleriDoldur(s) {
        var istek = UI.skIstek = (UI.skIstek || 0) + 1;
        skHazir().then(function () {
            if (!UI || UI.skIstek !== istek || T.sk.sek !== 'k') return;
            var sec = UI.ort.querySelector('#ysSlDers'), kit = UI.ort.querySelector('#ysSlKitap');
            if (!sec) return;
            var V = window.KidefSinifVeri, A = skAgac(s), ilk = '', secili = T.sk.ders[s], var_ = false;
            try {
                var yl = V && V.veriYillari ? V.veriYillari(s) : [], y = V && V.seciliVeriYili ? V.seciliVeriYili(s) : null;
                if (kit) kit.textContent = (yl.length > 1 && y) ? '· ' + (y.ad || y.yil) : '';
            } catch (e) { }
            var html = A.map(function (u) {
                var ua = ayirAd(u.ad);
                return '<optgroup label="' + esc(ua.tr) + '">' + (u.dersler || []).filter(function (d) { return d.veri !== false && d.id; }).map(function (d) {
                    if (!ilk) ilk = d.id;
                    if (d.id === secili) var_ = true;
                    return '<option value="' + esc(d.id) + '">' + esc(ayirAd(d.ad).tr) + '</option>';
                }).join('') + '</optgroup>';
            }).join('');
            if (!ilk) {
                sec.innerHTML = '<option>Bu sınıfın ders kelimeleri yok</option>'; sec.disabled = true;
                var k0 = UI.ort.querySelector('#ysSlKel');
                if (k0) k0.innerHTML = '<p class="ys-sl-bilgi">' + esc(s) + '. sınıfın kelime listesi bulunamadı. «Kendin yaz» ile istediğin kelimeyi koyabilirsin.</p>';
                return;
            }
            sec.disabled = false;
            sec.innerHTML = html;
            var id = var_ ? secili : ilk;
            sec.value = id;
            skKelimeleriCiz(s, id);
        });
    }
    function skKelimeleriCiz(s, id) {
        var kap = UI && UI.ort.querySelector('#ysSlKel');
        if (!kap) return;
        var istek = UI.skKelIstek = (UI.skKelIstek || 0) + 1;
        kap.innerHTML = '<p class="ys-sl-bilgi">Kelimeler yükleniyor…</p>';
        skDers(id).then(function (L) {
            if (!UI || UI.skKelIstek !== istek) return;
            var k = UI.ort.querySelector('#ysSlKel');
            if (!k) return;
            if (!L) { k.innerHTML = '<p class="ys-sl-bilgi">Kelimeler yüklenemedi. Bağlantını denetleyip dersi yeniden seç.</p>'; return; }
            if (!L.length) { k.innerHTML = '<p class="ys-sl-bilgi">Bu derste kelime yok.</p>'; return; }
            UI.skListe = L;
            k.innerHTML = L.map(function (w, i) {
                return '<button type="button" class="ys-sl-kelime" data-sk="kelime" data-i="' + i + '" title="Sayfaya koy: ' + esc(w.tr || w.ar) + '">' +
                    '<b lang="ar">' + esc(w.ar) + '</b>' + (w.tr ? '<small>' + esc(w.tr) + '</small>' : '') + '</button>';
            }).join('');
        });
    }
    function skHarfCiz(ic) {
        ic.innerHTML = '<p class="ys-sl-bilgi">Harfe bas: dört yazılışı (ayrı · başta · ortada · sonda) sıradaki satıra konur, öğrenci altındaki satırlara yazarak gösterir.' +
            (T.sk.anim ? ' Kâğıttaki koyu harfe dokununca o yazılış yerinde canlanır.' : '') + '</p>' +
            '<div class="ys-sl-harfler">' + HARFLER.map(function (H) {
                return '<button type="button" class="ys-sl-harf" data-sk="harf" data-v="' + H[0] + '" title="' + esc(H[1]) + '"><b lang="ar">' + H[0] + '</b><small>' + esc(H[1]) + '</small></button>';
            }).join('') + '</div>' + skAyarHtml('h');
    }
    function skGirdiEkle(t) {
        var g = UI && UI.ort.querySelector('#ysSlGirdi');
        if (!g) return;
        var v = g.value, a = (typeof g.selectionStart === 'number') ? g.selectionStart : v.length, b = (typeof g.selectionEnd === 'number') ? g.selectionEnd : a;
        if (t === '\b') {
            if (a === b && a > 0) a--;
            g.value = v.slice(0, a) + v.slice(b);
        } else g.value = (v.slice(0, a) + t + v.slice(b)).slice(0, 60);
        UI.skGirdi = g.value;
        var k = Math.min(g.value.length, t === '\b' ? a : a + t.length);
        try { g.setSelectionRange(k, k); } catch (e) { }
    }
    function silikIslem(b) {
        var is = b.getAttribute('data-sk'), v = b.getAttribute('data-v');
        if (is === 'kapat') silikKapat();
        else if (is === 'sek') { T.sk.sek = v === 'h' ? 'h' : 'k'; tercihKaydet(); silikCiz(); }
        else if (is === 'sinif') { UI.skSinif = v; T.sk.sinif = v; tercihKaydet(); silikCiz(); }
        else if (is === 'kelime') { var w = UI.skListe && UI.skListe[+b.getAttribute('data-i')]; if (w) silikKelimeKoy(w.ar, b); }
        else if (is === 'harf') silikHarfKoy(v, b);             /* v24: büyük kart yok; rehber harfe dokununca yerinde */
        else if (is === 'koy') { var g = UI.ort.querySelector('#ysSlGirdi'); silikKelimeKoy(g ? g.value : ''); }
        else if (is === 'klavye') {
            UI.skKlavye = !UI.skKlavye;
            var kl = UI.ort.querySelector('#ysSlKlv'), gi = UI.ort.querySelector('#ysSlGirdi');
            if (kl) kl.hidden = !UI.skKlavye;
            b.classList.toggle('sec', UI.skKlavye); b.setAttribute('aria-pressed', UI.skKlavye ? 'true' : 'false');
            if (gi) { if (UI.skKlavye) gi.setAttribute('inputmode', 'none'); else gi.removeAttribute('inputmode'); }
        }
        else if (is === 'tus') skGirdiEkle(b.getAttribute('data-t') || '');
        else if (is === 'geriSil') skGirdiEkle('\b');
        else if (is === 'girdiSil') { var g2 = UI.ort.querySelector('#ysSlGirdi'); if (g2) { g2.value = ''; UI.skGirdi = ''; } }
        else if (is === 'ayar') {
            if (!(v in T.sk)) return;
            T.sk[v] = !T.sk[v]; tercihKaydet();
            b.classList.toggle('acik', T.sk[v]); b.setAttribute('aria-checked', T.sk[v] ? 'true' : 'false');
        }
        else if (is === 'kaldir') silikKaldir();
    }
    /* seviye notları (★) yalnız öğretmen / yönetici hesabında (yazı çalışması girişsiz de açılır) */
    function rolYenile() {
        if (!UI) return;
        var og = ogretmenMi();
        var b = UI.ort.querySelector('[data-is="notKaydet"]'); if (b) b.hidden = !og;
        var s = UI.ort.querySelector('[data-sek="notlar"]'); if (s) s.hidden = !og;
        if (!og && UI.sek === 'notlar') UI.sek = 'gecmis';
    }

    /* ------------------------------------------------------------------
       TEK SATIRLIK ÜST ÇUBUK VE PERDE (23.10.2026) — öğretmen: "en önemli
       elementler hep açık olsun ama diğerleri yukardan aşağıya doğru perde
       gibi bi sidebar şeklinde olsun, biraz toplu olsun".
       · Üst çubukta hep açık: ☰ (defterin adı) · geri al, yinele · silgi,
         sayfayı sil · ▲ sayfa ▼ · Silik yazı · (kalemler üstteyse kalemler) ·
         Ana sayfa / Küçült.
       · ☰ → solda, çubuğun altından yukarıdan aşağı inen PERDE (kenar
         çubuğu): Kalem (kalem / hat kalemi, kalınlık, kalemlerin yeri) ·
         Defter (çizgili N / güzel yazı) · Sayfalar ve ekran (tüm sayfalar,
         yeni sayfa, tam ekran) · Kayıt (seviye notu, geçmiş, PDF).
         Ayarlar perdeyi açık bırakır; bir şey açan ya da bir kez yapılan
         tuşlar (tüm sayfalar, PDF…) kapatır. Dışarıya ilk dokunuş yalnız
         perdeyi kapatır (kâğıda çizgi düşmez); ☰ / × ve Esc de kapatır.
       KALEMLERİN YERİ (aynı gün, öğretmen: "bi tuşla kalemler yatay olarak
       yukarıda ortada da dizilebilsinler"): kalem sütununun altındaki tuş
       kalemleri üst çubuğun ortasına yatay dizer, oradaki tuş geri sağa
       alır (perdede de «Kalemler: Sağda | Üstte»). Seçim tarayıcıda kalır.
       Orta sütun ekranın ortasındadır; sol taraf sığmazsa yana kayar, dar
       ekranda kalemler ikinci satıra iner.
       v21 (aynı gün): solda yalnız ☰; düzenleme ve kalemler ORTADA; ▲ sayfa ▼
       kâğıdın altında (altNavHtml); «Silik yazı» perdenin başında; kalemler
       öntanımlı olarak üstte (üstteyken çubukta yer tuşu yok, perdeden seçilir).
       ------------------------------------------------------------------ */
    IK.menu = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>';
    IK.carpi = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';
    /* kalemleri üste al: üstte yatay sıra, yukarı ok */
    IK.kalemUst = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="3.5" width="18" height="7" rx="3.5"/><circle cx="7.6" cy="7" r="1.1" fill="currentColor" stroke="none"/>' +
        '<circle cx="12" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="16.4" cy="7" r="1.1" fill="currentColor" stroke="none"/>' +
        '<path d="M12 21v-7M8.8 17.2 12 14l3.2 3.2"/></svg>';
    /* kalemleri sağa al: sağda dikey sıra, sağa ok */
    IK.kalemSag = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="13.5" y="3" width="7" height="18" rx="3.5"/><circle cx="17" cy="7.6" r="1.1" fill="currentColor" stroke="none"/>' +
        '<circle cx="17" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="17" cy="16.4" r="1.1" fill="currentColor" stroke="none"/>' +
        '<path d="M3 12h7M6.8 8.8 10 12l-3.2 3.2"/></svg>';
    IK.yeniden = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4.6h4.6"/></svg>';
    /* perdeyi kapatan tuşlar: başka bir şey açarlar ya da bir kez yapılırlar */
    var PERDE_KAPATAN = { silik: 1, tumSayfalar: 1, yeniSayfa: 1, notKaydet: 1, panel: 1, pdf: 1, tamEkran: 1 };

    function kalemYerTusu(taraf) {
        if (taraf === 'ust') return '';                 /* v21: üstteyken çubukta tuş yok — yeri perdeden seçilir */
        var ust = taraf === 'ust';
        var t = ust ? 'Kalemleri sağa al — alt alta' : 'Kalemleri üste al — üst çubuğun ortasında yan yana';
        return '<i class="ys-ara"></i><button type="button" class="ys-t ys-kyer" data-is="kalemYer" data-v="' + (ust ? 'sag' : 'ust') +
            '" title="' + t + '" aria-label="' + t + '">' + (ust ? IK.kalemSag : IK.kalemUst) + '</button>';
    }
    /* Ana sayfa: kırmızı dolgulu ev, beyaz kapı (v23, öğretmen: "anasayfa svg si kırmızı dolgulu") */
    IK.evDolu = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M11.3 2.9a1.1 1.1 0 0 1 1.4 0l9.1 7.6c.8.7.3 2-.7 2H20v7.9A1.6 1.6 0 0 1 18.4 22H5.6A1.6 1.6 0 0 1 4 20.4v-7.9H2.9c-1 0-1.5-1.3-.7-2Z" fill="#E74C3C"/>' +
        '<rect x="9.6" y="14.2" width="4.8" height="7.8" rx="1.1" fill="#fff"/></svg>';
    function ustCubukHtml(yan, kalin, csay) {
        /* v21: [☰] [düzenleme · kalemler — ORTADA]
           v22: Ana sayfa (ayrı sekmede) / Küçült (sayfa içinde) yalnız simge, perde açıkken gizli.
           v23: EN SOLDA (☰'den önce); Ana sayfa kırmızı dolgulu ev; perde açıkken
           görünmez ama yeri kalır (#ysKutu.perde-acik) — ☰ kaymaz. */
        return '<div class="ys-arac ys-ust3">' +
            '<div class="ys-u3-sol">' +
              (TEK
                ? '<a class="ys-t ys-ev ys-ana" href="index.html" data-is="anasayfa" title="Ana sayfa — Kidef Arapça" aria-label="Ana sayfaya git">' + IK.evDolu + '</a>'
                : '<button type="button" class="ys-t ys-ev" data-is="kucult" title="Simge durumuna küçült (Esc) — sınıf açık kaldıkça sağ altta durur" aria-label="Simge durumuna küçült">' + IK.kucult + '</button>') +
              '<button type="button" class="ys-t ys-menu" data-is="perde" aria-expanded="false" aria-controls="ysPerde"' +
                ' title="Öteki araçlar — silik yazı, kalem çeşidi, defter türü, sayfalar, kayıt, PDF">' +
                '<span class="ik-m">' + IK.menu + '</span><span class="ik-x">' + IK.carpi + '</span>' +
                '<span class="ys-menu-ad">' + (YAZI ? 'Yazı Çalışması' : 'Defter') + '<small>' + esc(etiket()) + '</small></span></button>' +
            '</div>' +
            '<div class="ys-u3-orta">' +
              '<span class="ys-dgrup" role="group" aria-label="Düzenleme">' +
                '<button type="button" class="ys-t" data-is="geri" title="Geri al (Ctrl+Z)" aria-label="Geri al">' + IK.geri + '</button>' +
                '<button type="button" class="ys-t" data-is="ileri" title="Yinele (Ctrl+Y)" aria-label="Yinele">' + IK.ileri + '</button>' +
                '<i class="ys-gara"></i>' +
                '<button type="button" class="ys-t" data-is="silgi" title="Silgi (S) — seçiliyken bir daha basınca: Tüm sayfayı sil" aria-label="Silgi">' + IK.silgi + '</button>' +
                '<button type="button" class="ys-t" data-is="temizle" title="Sayfayı sil" aria-label="Sayfayı sil">' + IK.temizle + '</button>' +
              '</span>' +
              yan('ust') +
            '</div>' +
            '<div class="ys-u3-sag"></div>' +                   /* boş: orta küme ortada kalsın diye */
            perdeHtml(kalin, csay) +
            '</div>';
    }
    /* SAYFA OKLARI ALTTA (v21, öğretmen: "sayfa okları sayfa sayısını gösteren
       kısmı aşağı al"): kâğıdın altında ortada yüzen kutu — ▲ geri · sayfa ·
       ▼ ileri. Kâğıdın (.ys-kagit) içinde durur: «Silik yazı» penceresi açıkken
       de kâğıdın ortasında kalır. Örttüğü şerit UI.altPay (cizimAyarla). */
    function altNavHtml() {
        return '<div class="ys-altnav" role="group" aria-label="Sayfalar">' +
            '<button type="button" class="ys-t ys-ok" data-is="saga" title="Geri — önceki sayfa" aria-label="Geri — önceki sayfa">' +
              '<span class="ik-y">' + IK.sonraki + '</span><span class="ik-d">' + IK.yukari + '</span></button>' +
            '<span class="ys-sayfa" id="ysSayfa">1 / 1</span>' +
            '<button type="button" class="ys-t ys-ok" data-is="sola" title="İleri — sonraki sayfa; son sayfadaysa yeni sayfa" aria-label="İleri — sonraki sayfa">' +
              '<span class="ik-y">' + IK.onceki + '</span><span class="ik-d">' + IK.asagi + '</span></button>' +
            '</div>';
    }
    function perdeHtml(kalin, csay) {
        var kare = function (is, ik, ad, ipucu, ek) {
            return '<button type="button" class="ys-t ys-pd-kare' + (ek || '') + '" data-is="' + is + '" title="' + ipucu + '">' + ik + '<span>' + ad + '</span></button>';
        };
        return '<div class="ys-perde" id="ysPerde" role="dialog" aria-label="Öteki araçlar" hidden><div class="ys-pd-ic">' +
            /* «Silik yazı» perdenin başında (v21) — açınca perde kapanır */
            '<div class="ys-pd-grup ys-pd-ilk">' +
              '<button type="button" class="ys-t ys-pd-tus ys-pd-silik" data-is="silik" aria-pressed="false"' +
                ' title="Silik yazı — kitabın kelimeleri, kendi yazdığın ya da harfin dört yazılışı; öğrenci üstünden geçer">' +
                IK.silik + '<span>Silik yazı<small>Kelime · kendin yaz · harf</small></span></button>' +
            '</div>' +
            '<div class="ys-pd-grup"><div class="ys-pd-et">Kalem</div>' +
              '<div class="ys-anahtar ys-ucsec" role="radiogroup" aria-label="Kalem çeşidi"><i class="ys-top"></i>' +
                '<button type="button" class="ys-asec" data-uc="y" role="radio" aria-checked="true" title="Kalem — yuvarlak uçlu">' + IK.kalem + '<span>Kalem</span></button>' +
                '<button type="button" class="ys-asec" data-uc="h" role="radio" aria-checked="false" title="Hat kalemi — eğik uçlu kalem: yatayda kalın, dikeyde ince yazar">' + IK.hatUc + '<span>Hat kalemi</span></button>' +
              '</div>' +
              '<div class="ys-pd-satir"><span class="ys-pd-ad">Kalınlık</span><span class="ys-kalin" role="group" aria-label="Kalınlık">' + kalin + '</span></div>' +
              '<div class="ys-pd-satir"><span class="ys-pd-ad">Kalemler</span>' +
                '<div class="ys-anahtar ys-kysec" role="radiogroup" aria-label="Kalemlerin yeri"><i class="ys-top"></i>' +
                  '<button type="button" class="ys-asec" data-is="kalemYer" data-v="sag" role="radio" aria-checked="true" title="Kalemler sağda, alt alta">' + IK.kalemSag + '<span>Sağda</span></button>' +
                  '<button type="button" class="ys-asec" data-is="kalemYer" data-v="ust" role="radio" aria-checked="false" title="Kalemler üst çubuğun ortasında, yan yana">' + IK.kalemUst + '<span>Üstte</span></button>' +
                '</div></div>' +
            '</div>' +
            '<div class="ys-pd-grup ys-csec"><div class="ys-pd-et">Defter</div>' +
              '<div class="ys-anahtar ys-dtsec" role="radiogroup" aria-label="Çizgili defter ya da güzel yazı defteri"><i class="ys-top"></i>' +
                '<button type="button" class="ys-asec" data-dt="c" role="radio" aria-checked="true" title="Çizgili defter — basınca çizgi sayısı seçilir">' + IK.cizgiler + '<span>Çizgili</span><b class="ys-csn">5</b></button>' +
                '<button type="button" class="ys-asec" data-dt="g" role="radio" aria-checked="false" title="Arapça güzel yazı defteri — yardımcı çizgili satırlar">' + IK.guzel + '<span>Güzel yazı</span></button>' +
              '</div>' +
              '<div class="ys-cpop" id="ysCpop" role="group" aria-label="Çizgi sayısı" hidden>' +
                '<span class="ys-cet">' + IK.cizgiler + '<span>Çizgi</span></span>' + csay + '</div>' +
            '</div>' +
            '<div class="ys-pd-grup"><div class="ys-pd-et">Sayfalar ve ekran</div><div class="ys-pd-izgara">' +
              kare('tumSayfalar', IK.izgara, 'Tüm sayfalar', 'Tüm sayfalar — küçük resimler; sayfa silme burada') +
              kare('yeniSayfa', IK.yeniSayfa, 'Yeni sayfa', 'Yeni sayfa — açık sayfadan hemen sonra') +
              kare('tamEkran', IK.tamEkran, 'Tam ekran', 'Tam ekran', ' ys-pd-ekran') +
            '</div></div>' +
            '<div class="ys-pd-grup"><div class="ys-pd-et">Kayıt</div>' +
              '<button type="button" class="ys-t ys-pd-tus ana" data-is="notKaydet" title="Bu defteri seviye notlarına kaydet">' + IK.yildiz +
                '<span id="ysNotYazi">Seviye notlarına kaydet</span></button>' +
              '<div class="ys-pd-izgara">' +
                kare('panel', IK.saat, 'Geçmiş', 'Geçmiş ve seviye notları') +
                kare('pdf', IK.pdf, 'PDF indir', 'PDF olarak indir — bütün sayfalar') +
              '</div>' +
            '</div>' +
            '</div></div>';
    }
    function perdeStilKur() {
        if (document.getElementById('ys-perde-stil')) return;
        var s = document.createElement('style');
        s.id = 'ys-perde-stil';
        s.textContent = [
            /* TEK SATIR (v21): [☰] [düzenleme · kalemler — ORTADA] [ana sayfa / küçült].
               Yan sütunlar eşit büyür: orta sütun ekranın ortasında kalır. ▲ sayfa ▼
               kâğıdın altında (.ys-altnav), «Silik yazı» perdede. */
            '.ys-arac.ys-ust3{display:grid; grid-template-columns:minmax(max-content,1fr) auto minmax(max-content,1fr); align-items:center;',
            '  column-gap:10px; row-gap:6px; padding:7px 10px; position:relative; flex-wrap:nowrap;}',
            '.ys-arac.ys-ust3::after{content:none;}',
            '.ys-u3-sol,.ys-u3-orta,.ys-u3-sag{display:flex; align-items:center; gap:8px; min-width:0;}',
            '.ys-u3-sol{grid-column:1; grid-row:1; justify-self:start;}',
            '.ys-u3-orta{grid-column:2; grid-row:1; justify-content:center; gap:14px;}',
            '.ys-u3-sag{grid-column:3; grid-row:1; justify-self:end;}',
            '.ys-ust3 .ys-menu{height:46px; padding:0 15px 0 11px; border-radius:14px; background:#F2F5F9; color:#0E7C66; gap:10px; flex:none;}',
            '.ys-ust3 .ys-menu svg{width:24px; height:24px;}',
            '.ys-ust3 .ys-menu .ik-m,.ys-ust3 .ys-menu .ik-x{display:flex;} .ys-ust3 .ys-menu .ik-x{display:none;}',
            '.ys-ust3 .ys-menu.sec .ik-x{display:flex;} .ys-ust3 .ys-menu.sec .ik-m{display:none;}',
            '.ys-ust3 .ys-menu:hover{background:#E5EBF3;}',
            '.ys-ust3 .ys-menu.sec,.ys-ust3 .ys-menu.sec:hover{background:#16A085; color:#fff;}',
            '.ys-ust3 .ys-menu .ys-menu-ad{display:flex; flex-direction:column; align-items:flex-start; line-height:1.15; font-weight:900;',
            '  font-size:.95rem; white-space:nowrap; text-align:start;}',
            '.ys-ust3 .ys-menu .ys-menu-ad small{font-size:.7rem; font-weight:700; color:#8A94A3;}',
            '.ys-ust3 .ys-menu.sec .ys-menu-ad small{color:rgba(255,255,255,.85);}',
            '.ys-ust3 .ys-dgrup{display:inline-flex; align-items:center; gap:5px; padding:4px 6px; background:#F2F5F9; border-radius:15px; flex:none;}',
            '.ys-ust3 .ys-dgrup .ys-t{width:46px; height:44px; min-width:46px; padding:0; border-radius:12px; background:#fff; box-shadow:0 0 0 1px #E2E7EE;}',
            '.ys-ust3 .ys-dgrup .ys-t svg{width:26px; height:26px;}',
            '.ys-ust3 .ys-dgrup .ys-t:hover{background:#E5EBF3;}',
            '.ys-ust3 .ys-dgrup .ys-t[disabled]{background:#fff; box-shadow:0 0 0 1px #EEF1F5;}',
            '.ys-ust3 .ys-dgrup .ys-t[data-is="silgi"].sec{background:#16A085; color:#fff; box-shadow:none;}',
            '.ys-ust3 .ys-dgrup .ys-t[data-is="temizle"]:not([disabled]):hover{background:#FDEDEC; color:#C0392B;}',
            '.ys-ust3 .ys-gara{width:1px; height:28px; background:#DDE3EA; margin:0 3px; flex:none;}',
            /* Ana sayfa / Küçült: ☰'nin yanında yalnız simge (v22); perde açıkken gizli, kapanınca çıkar */
            /* v23: en solda; Ana sayfa kırmızı dolgulu ev, zeminsiz. Perde açıkken görünmez
               ama yeri kalır (☰ kaymasın), kapanınca yine belirir */
            '.ys-ust3 .ys-ev{width:46px; height:46px; min-width:46px; padding:0; border-radius:14px; background:#F2F5F9; color:#0E7C66;',
            '  flex:none; text-decoration:none; transition:opacity .18s ease, transform .18s ease, visibility .18s;}',
            '.ys-ust3 .ys-ev svg{width:25px; height:25px;}',
            '.ys-ust3 .ys-ev:hover{background:#E5EBF3;}',
            '.ys-ust3 .ys-ev.ys-ana{background:transparent;}',
            '.ys-ust3 .ys-ev.ys-ana svg{width:34px; height:34px;}',
            '.ys-ust3 .ys-ev.ys-ana:hover{background:#FDECEA;}',
            '#ysKutu.perde-acik .ys-ust3 .ys-ev{visibility:hidden; opacity:0; transform:scale(.6); pointer-events:none;}',
            '@media (prefers-reduced-motion: reduce){.ys-ust3 .ys-ev{transition:none;}}',
            /* kalemler üst çubukta, yan yana (öntanımlı) */
            '.ys-yan.ust{display:none;}',
            '#ysKutu.kalem-ust .ys-yan.sag,#ysKutu.kalem-ust .ys-yan.sol{display:none;}',
            '#ysKutu.kalem-ust .ys-yan.ust{display:flex; position:static; transform:none; flex-direction:row; align-items:center; gap:8px;',
            '  padding:4px 8px; background:#F2F5F9; border-radius:999px; box-shadow:none; -webkit-backdrop-filter:none; backdrop-filter:none; flex:none;}',
            '#ysKutu .ys-yan.ust .ys-renk{width:42px; height:42px; min-width:42px;}',
            '#ysKutu .ys-yan.ust .ys-renk svg{width:20px; height:20px;}',
            '#ysKutu .ys-yan.ust .ys-renk.sec{box-shadow:0 0 0 2.5px #F2F5F9, 0 0 0 5px var(--rk); transform:scale(1.04);}',
            '#ysKutu .ys-yan.ust .ys-ara{width:1px; height:26px; margin:0 1px;}',
            '.ys-yan .ys-t.ys-kyer{width:40px; height:40px; min-width:40px; align-self:center; color:#55606D;}',
            '.ys-yan .ys-t.ys-kyer svg{width:22px; height:22px;}',
            '.ys-yan .ys-t.ys-kyer:hover{background:#E5EBF3;}',
            /* SAYFA OKLARI ALTTA (v21): kâğıdın altında ortada ▲ sayfa ▼ */
            '.ys-altnav{position:absolute; left:50%; bottom:14px; transform:translateX(-50%); z-index:4; display:flex; align-items:center;',
            '  gap:6px; padding:6px 8px; width:max-content; background:rgba(255,255,255,.9); border-radius:999px;',
            '  -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); box-shadow:0 8px 26px rgba(15,23,42,.16), 0 0 0 1px rgba(15,23,42,.07);}',
            '.ys-altnav .ys-t.ys-ok{width:66px; min-width:66px; height:52px; padding:0; border-radius:999px; background:#fff; color:#0E7C66;',
            '  box-shadow:0 0 0 1px #CFE6DF;}',
            '.ys-altnav .ys-t.ys-ok svg{width:36px; height:36px;}',
            '.ys-altnav .ys-t.ys-ok:hover{background:#D6F0E9;}',
            '.ys-altnav .ys-sayfa{font-size:1.2rem; min-width:76px;}',
            '.ys-altnav button{touch-action:manipulation;}',
            /* «son defter» önerisi ve bildirimler okların üstünde */
            '#ysKutu .ys-son{bottom:90px;} #ysKutu .ys-bildiri{bottom:146px;}',
            /* sığmayınca: önce ☰'nin yazısı, sonra «Ana sayfa» yazısı gizlenir */
            '@media (max-width:940px){.ys-ust3 .ys-menu .ys-menu-ad{display:none;} .ys-ust3 .ys-menu{padding:0 11px;}}',
            /* telefon: iki satır — üstte ☰ · düzenleme · ana sayfa, altta kalemler (ikisi de ortada) */
            '@media (max-width:760px){.ys-arac.ys-ust3{column-gap:6px; row-gap:5px; padding:5px 6px;}',
            '  .ys-u3-orta{display:contents;}',
            '  .ys-ust3 .ys-dgrup{grid-column:2; grid-row:1; justify-self:center; gap:3px; padding:3px 4px; border-radius:12px;}',
            '  #ysKutu.kalem-ust .ys-yan.ust{grid-column:1 / -1; grid-row:2; justify-self:center; gap:6px; padding:3px 6px;}',
            '  .ys-ust3 .ys-dgrup .ys-t{width:38px; height:38px; min-width:38px; border-radius:10px;}',
            '  .ys-ust3 .ys-dgrup .ys-t svg{width:22px; height:22px;} .ys-ust3 .ys-gara{margin:0 1px; height:22px;}',
            '  .ys-ust3 .ys-menu,.ys-ust3 .ys-ev{height:40px; border-radius:11px;} .ys-ust3 .ys-ev{width:40px; min-width:40px;}',
            '  .ys-ust3 .ys-u3-sol{gap:6px;} .ys-ust3 .ys-menu{padding:0 9px;}',
            '  .ys-ust3 .ys-menu svg,.ys-ust3 .ys-ev svg{width:22px; height:22px;} .ys-ust3 .ys-ev.ys-ana svg{width:30px; height:30px;}',
            '  #ysKutu .ys-yan.ust .ys-renk{width:36px; height:36px; min-width:36px;} #ysKutu .ys-yan.ust .ys-renk svg{width:17px; height:17px;}',
            '  .ys-yan .ys-t.ys-kyer{width:30px; height:30px; min-width:30px;} .ys-yan .ys-t.ys-kyer svg{width:16px; height:16px;}',
            '  .ys-altnav{bottom:10px; gap:4px; padding:4px 5px;} .ys-altnav .ys-t.ys-ok{width:52px; min-width:52px; height:44px;}',
            '  .ys-altnav .ys-t.ys-ok svg{width:30px; height:30px;} .ys-altnav .ys-sayfa{font-size:1rem; min-width:56px;}',
            '  #ysKutu .ys-son{bottom:70px;} #ysKutu .ys-bildiri{bottom:122px;}}',
            '@media (max-width:360px){.ys-ust3 .ys-dgrup .ys-t{width:34px; min-width:34px;}}',
            /* PERDE: ☰'nin altından, solda, yukarıdan aşağı iner; boyu pencerenin altına kadar */
            '.ys-perde{position:absolute; top:calc(100% + 1px); left:0; z-index:9; width:312px; max-width:calc(100vw - 16px); box-sizing:border-box;',
            '  overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; background:#fff; color:#2C3E50;',
            '  border-radius:0 0 22px 0; box-shadow:16px 22px 44px rgba(15,23,42,.2), 1px 0 0 rgba(15,23,42,.07);',
            '  animation:ysPerdeIn .28s cubic-bezier(.2,.9,.3,1);}',
            '.ys-perde.kapan{animation:ysPerdeOut .17s ease-in forwards; pointer-events:none;}',
            '@keyframes ysPerdeIn{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}',
            '@keyframes ysPerdeOut{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(0 0 100% 0)}}',
            '.ys-pd-ic{padding:2px 14px 18px; display:flex; flex-direction:column;}',
            '.ys-pd-grup{padding:12px 0; border-bottom:1px solid #EEF1F5; display:flex; flex-direction:column; gap:8px;}',
            '.ys-pd-grup:last-child{border-bottom:0;}',
            '.ys-pd-et{font-size:.72rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#8A94A3; margin:0 2px;}',
            '.ys-pd-satir{display:flex; align-items:center; gap:10px; min-height:44px;}',
            '.ys-pd-ad{flex:none; width:66px; font-size:.84rem; font-weight:800; color:#55606D;}',
            '#ysKutu .ys-perde .ys-anahtar{flex:1 1 auto; width:100%; min-width:0; height:46px;}',
            '#ysKutu .ys-perde .ys-asec{height:40px; padding:0 8px; font-size:.86rem;}',
            '#ysKutu .ys-perde .ys-asec svg{width:19px; height:19px;}',
            '#ysKutu .ys-perde .ys-asec span{display:inline;}',
            '#ysKutu .ys-perde .ys-kalin{display:flex; gap:6px; flex:1 1 auto;}',
            '#ysKutu .ys-perde .ys-kal{flex:1 1 0; width:auto; min-width:0; height:44px; border-radius:12px; background:#F2F5F9;}',
            '#ysKutu .ys-perde .ys-kal:hover{background:#E5EBF3;}',
            '#ysKutu .ys-perde .ys-kal.sec{background:#D6F0E9; box-shadow:inset 0 0 0 2px #16A085;}',
            '#ysKutu .ys-perde .ys-cpop{position:static; display:flex; flex-wrap:wrap; gap:5px; margin:0; padding:6px; border-radius:14px;',
            '  background:#F2F5F9; box-shadow:none; animation:none;}',
            '#ysKutu .ys-perde .ys-cpop .ys-cet{display:none;}',                 /* v22: rakamlar tek sırada */
            '#ysKutu .ys-perde .ys-cpop{flex-wrap:nowrap;}',
            '#ysKutu .ys-perde .ys-cpop .ys-csay{flex:1 1 0; min-width:0; height:42px; background:#fff; box-shadow:0 0 0 1px #E2E7EE;}',
            '#ysKutu .ys-perde .ys-cpop .ys-csay.sec{background:#16A085; box-shadow:none;}',
            '.ys-pd-izgara{display:grid; grid-template-columns:repeat(auto-fit, minmax(76px, 1fr)); gap:7px;}',
            '#ysKutu .ys-perde .ys-pd-kare{display:flex; flex-direction:column; height:72px; min-width:0; gap:6px; padding:6px 4px; border-radius:15px;',
            '  background:#F7F9FB; box-shadow:inset 0 0 0 1px #E6EBF1; color:#2C3E50; font-size:.78rem; line-height:1.15; text-align:center; white-space:normal;}',
            '#ysKutu .ys-perde .ys-pd-kare svg{width:25px; height:25px;}',
            '#ysKutu .ys-perde .ys-pd-kare:hover{background:#EEF8F5; box-shadow:inset 0 0 0 1.5px #A9DCCF;}',
            '#ysKutu .ys-perde .ys-pd-tus{display:flex; width:100%; height:48px; justify-content:flex-start; gap:12px; padding:0 14px; border-radius:14px; font-size:.9rem;}',
            '#ysKutu .ys-perde .ys-pd-tus svg{width:22px; height:22px;}',
            '#ysKutu .ys-perde .ys-pd-kare span,#ysKutu .ys-perde .ys-pd-tus span{display:block !important;}',
            /* «Silik yazı» perdede (v21) */
            '#ysKutu .ys-perde .ys-pd-ilk{padding-top:10px;}',
            '#ysKutu .ys-perde .ys-pd-grup{order:0;}',                 /* dar ekranda «Defter» öbeği sona kaçmasın (eski .ys-csec sırası) */
            '#ysKutu .ys-perde .ys-pd-silik{height:60px; gap:13px; padding:0 16px; background:#EEF8F5; color:#0E6655; box-shadow:inset 0 0 0 1.5px #A9DCCF;}',
            '#ysKutu .ys-perde .ys-pd-silik:hover{background:#DDF2EC;}',
            '#ysKutu .ys-perde .ys-pd-silik svg{width:27px; height:27px;}',
            '#ysKutu .ys-perde .ys-pd-silik span{font-weight:900; font-size:.98rem; line-height:1.15; text-align:start;}',
            '#ysKutu .ys-perde .ys-pd-silik small{display:block; margin-top:3px; font-size:.74rem; font-weight:700; color:#5B8F83;}',
            '#ysKutu .ys-perde .ys-pd-silik.sec{background:#16A085; color:#fff; box-shadow:0 2px 8px rgba(14,124,102,.35);}',
            '#ysKutu .ys-perde .ys-pd-silik.sec small{color:rgba(255,255,255,.85);}',
            '.ys-perde button{touch-action:manipulation;}',
            /* HARFİN YAZILIŞI: kâğıdın üstünde büyük kart (geniş ekranda «Silik yazı» penceresinin yanında) */
            '.ys-hy{position:absolute; top:0; right:0; bottom:0; left:0; z-index:7; display:flex; align-items:center; justify-content:center;',
            '  padding:16px; box-sizing:border-box; background:rgba(238,241,245,.86); -webkit-backdrop-filter:blur(3px); backdrop-filter:blur(3px);',
            '  animation:ysSol .16s ease-out;}',
            '.ys-hy-kart{position:relative; background:#fff; border-radius:24px; box-shadow:0 24px 60px rgba(15,23,42,.22), 0 0 0 1px rgba(15,23,42,.05);',
            '  padding:12px 18px 18px; max-width:100%; max-height:100%; box-sizing:border-box; overflow:auto; display:flex; flex-direction:column; gap:10px;}',
            '.ys-hy-bas{display:flex; align-items:center; gap:10px; flex-wrap:wrap; row-gap:8px;}',
            '.ys-hy-bas b{display:flex; align-items:center; gap:12px; font-size:1.12rem; color:#2C3E50; white-space:nowrap;}',
            '.ys-hy-bas b i{font-style:normal; font-size:2.5rem; line-height:1.1; color:#0E7C66; font-weight:400; font-family:' + SILIK_FONT + ';}',
            '#ysKutu .ys-hy .ys-anahtar{height:42px;} #ysKutu .ys-hy .ys-asec{height:36px; padding:0 14px; font-size:.86rem;}',
            '#ysKutu .ys-hy .ys-asec span{display:inline;}',
            '.ys-hy-hiz{display:inline-flex; align-items:center; gap:3px; padding:3px 4px 3px 11px; background:#F2F5F9; border-radius:999px;}',
            '.ys-hy-hiz > span{font-size:.8rem; font-weight:800; color:#8A94A3; margin-inline-end:3px;}',
            '.ys-hy-hz{width:36px; height:36px; border:0; border-radius:50%; background:transparent; color:#3D4756; font-family:inherit;',
            '  font-weight:900; font-size:.92rem; cursor:pointer; padding:0;}',
            '.ys-hy-hz:hover{background:#E5EBF3;} .ys-hy-hz.sec,.ys-hy-hz.sec:hover{background:#16A085; color:#fff;}',
            '.ys-hy-bas .ys-t{height:44px; padding:0 14px; border-radius:13px; background:#F2F5F9;}',
            '.ys-hy-bas .ys-t:hover{background:#E5EBF3;}',
            '.ys-hy-bas .ys-t.kapat{width:44px; min-width:44px; padding:0;} .ys-hy-bas .ys-t.kapat svg{width:22px; height:22px;}',
            '.ys-hy button{touch-action:manipulation;}',
            '.ys-hy-bicimler{--hyH:280px; display:flex; flex-wrap:nowrap; justify-content:center; align-items:flex-start; column-gap:26px; row-gap:14px; direction:rtl;}',
            '.ys-hy-bicimler.iki{flex-wrap:wrap;}',
            '.ys-hy-kir{display:none;} .ys-hy-bicimler.iki .ys-hy-kir{display:block; flex-basis:100%; height:0;}',
            '.ys-hy-b{margin:0; display:flex; flex-direction:column; align-items:center; gap:4px; border-radius:16px; padding:4px; transition:background .2s;}',
            '.ys-hy-b svg{display:block; height:var(--hyH); overflow:visible;}',
            '.ys-hy-b figcaption{font-weight:900; font-size:1.02rem; direction:ltr;}',
            '.ys-hy-b.yaz{background:#EEF8F5;}',
            '.ys-hy-ghost{fill:#E9EEF4;}',
            '.ys-hy-satir{stroke:rgba(0,0,0,.22); stroke-width:3; vector-effect:non-scaling-stroke;}',
            /* v24: rehber harfin yazılışı kâğıdın üstünde, harfin kendi yerinde (kart yok) */
            '.ys-ra{position:absolute; left:0; top:0; width:0; height:0; overflow:visible; pointer-events:none; transition:opacity .35s ease;}',
            '.ys-ra.sol{opacity:0;}',
            '.ys-ra svg{position:absolute; left:0; top:0; overflow:visible; pointer-events:none;}',
            '.ys-ra .ys-hy-satir{display:none;}',
            '.ys-ra .ys-hy-ghost{fill:#CFD7E1;}',
            '@media (prefers-reduced-motion: reduce){.ys-ra{transition:none;}}',
            '@media (max-width:760px){.ys-hy{padding:8px;} .ys-hy-kart{padding:10px 12px 12px; border-radius:18px;} .ys-hy-bicimler{column-gap:14px; row-gap:10px;}',
            '  .ys-hy-bas b{font-size:.98rem;} .ys-hy-bas b i{font-size:2rem;} .ys-hy-bas .ys-t span{display:none;}}',
            '@media (prefers-reduced-motion: reduce){.ys-perde,.ys-perde.kapan,.ys-hy{animation:none;}}'
        ].join('\n');
        document.head.appendChild(s);
    }
    function perdeKur() {
        if (!UI) return;
        hyBirak(); _hyTok++;                             /* önceki açılıştan kalan harf turu */
        UI.arac = UI.ort.querySelector('.ys-arac');
        UI.perde = UI.ort.querySelector('#ysPerde');
        UI.menu = UI.ort.querySelector('[data-is="perde"]');
        UI.perdeAcik = false;
        UI.kutu.classList.toggle('kalem-ust', T.ky === 'ust');
        if (!UI.perde) return;
        /* tam ekran olmayan tarayıcıda (iPhone) tuş görünmez */
        var fs = false;
        try { fs = !!((document.fullscreenEnabled || document.webkitFullscreenEnabled) && (UI.ort.requestFullscreen || UI.ort.webkitRequestFullscreen)); } catch (e) { }
        var ek = UI.perde.querySelector('.ys-pd-ekran');
        if (ek) ek.hidden = !fs;
        /* dışarıya basınca kapanır (☰ kendisi aç / kapa yapar; kâğıttaki ilk dokunuşu kalemBas yutar) */
        UI.ort.addEventListener('pointerdown', function (e) {
            if (!UI || !UI.perdeAcik) return;
            var t = e.target;
            if (UI.perde.contains(t) || (t.closest && t.closest('[data-is="perde"]'))) return;
            perdeKapat();
        });
    }
    function perdeAc() {
        if (!UI || !UI.perde) return;
        silSorKapat();
        clearTimeout(UI.perdeZ);
        UI.perdeAcik = true;
        UI.perde.classList.remove('kapan');
        UI.perde.hidden = false;
        perdeBoyutla();
        UI.perde.scrollTop = 0;
        if (UI.menu) { UI.menu.classList.add('sec'); UI.menu.setAttribute('aria-expanded', 'true'); }
        UI.kutu.classList.add('perde-acik');                     /* v23: Ana sayfa simgesi görünmez (yeri kalır) */
        aracGuncelle();
    }
    function perdeBoyutla() {
        if (!UI || !UI.perde || !UI.arac) return;
        UI.perde.style.height = Math.max(160, UI.kutu.clientHeight - UI.arac.offsetTop - UI.arac.offsetHeight) + 'px';
    }
    function perdeKapat(hemen) {
        if (!UI || !UI.perde || !UI.perdeAcik) return;
        UI.perdeAcik = false;
        cpopKapat();
        if (UI.menu) { UI.menu.classList.remove('sec'); UI.menu.setAttribute('aria-expanded', 'false'); }
        UI.kutu.classList.remove('perde-acik');
        var p = UI.perde, az = false;
        try { az = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { }
        clearTimeout(UI.perdeZ);
        if (hemen || az) { p.hidden = true; p.classList.remove('kapan'); return; }
        p.classList.add('kapan');                        /* perde yukarı toplanır */
        UI.perdeZ = setTimeout(function () {
            if (UI && UI.perde === p && !UI.perdeAcik) { p.hidden = true; p.classList.remove('kapan'); }
        }, 170);
    }
    function perdeAcik() { return !!(UI && UI.perdeAcik); }
    function kalemYerSec(y) {
        if (!T) return;
        T.ky = y === 'ust' ? 'ust' : 'sag';
        tercihKaydet();
        if (!UI) return;
        UI.kutu.classList.toggle('kalem-ust', T.ky === 'ust');
        cizimAyarla();                                   /* dar ekranda çubuk iki satır olabilir: kâğıt yeniden ölçülür */
        aracGuncelle();
    }

    /* ------------------------------------------------------------------
       HARFİN YAZILIŞI (23.10.2026) — öğretmen: "silik yazı da bi harfe
       tıklandıktan sonra istenirse o harfin yazılış animasyonuna
       bakılabilsin, her harfe tıklanınca büyük bi şekilde yazılış
       animasyonu başlasın".
       «Silik yazı» → Harf: harfe basınca (açıksa «Harfe basınca yazılışı
       büyük gösterilsin») harf her zamanki gibi sıradaki satıra konur VE
       kâğıdın üstünde büyük bir kartta dört yazılışı alfabe sayfasındaki
       motorla yazılır (okumayazma/alfabe_harf_detay.js → buildSvg,
       agirlikProfili, playForm; veri okumayazma/alfabe_harf_yazim.js, ilk
       kullanımda yüklenir): Arakom dolgusu kalemin yolu boyunca maskeyle
       açılır, kalem ucu (beyaz göbek, renkli halka) yolda gider, darbeler
       arasında havada uçar, noktalar sonda vurulur, kendi izinden geçen
       yerler biraz hızlı geçilir; harfe özel motor ayarları da geçerli.
       Biçimler kâğıttaki satırla aynı sırada (sağdan: ayrı · başta · ortada
       · sonda), renkleri alfabedeki gibi. «Hepsi birden | Sırayla» ve hız
       (1-5) alfabe sayfasıyla ortak (aynı tarayıcı ayarı). Geniş ekranda
       kart «Silik yazı» penceresinin yanında durur: başka harfe basınca o
       harf yazılır. Tahtaya yansıtmada öbür ekranda da açılır / kapanır.
       ------------------------------------------------------------------ */
    var HYZ_YOL = 'okumayazma/alfabe_harf_yazim.js?v=ff8490d7';     /* sürüm damgası: _kaynak/uretici/surumle.py */
    var HYZ_BICIM = [{ k: 'n', ad: 'Ayrı', renk: '#1e293b' }, { k: 'b', ad: 'Başta', renk: '#16a34a' },
                     { k: 'o', ad: 'Ortada', renk: '#2563eb' }, { k: 's', ad: 'Sonda', renk: '#9333ea' }];
    var HY_IZ = 0.7, HY_ESIK = 0.22, HY_HIZ = [0.5, 0.72, 1, 1.45, 2.1];
    var HY_HIZ_AD = ['Çok yavaş', 'Yavaş', 'Normal', 'Hızlı', 'Çok hızlı'];
    var HY = null, _hySay = 0, _hyTok = 0;               /* HY: açık kart { kap, h, anims, figs, oran, kip, hiz, tur, z } */
    function hyVeri() { try { return (typeof HARF_YAZIM !== 'undefined' && HARF_YAZIM) ? HARF_YAZIM : null; } catch (e) { return null; } }
    function hyKipOku() { try { var v = localStorage.getItem('kidefHarfYazimKipi'); if (v === 'sira' || v === 'hepsi') return v; } catch (e) { } return 'hepsi'; }
    function hyHizOku() { try { var v = parseInt(localStorage.getItem('kidefYazimHizi'), 10); if (v >= 0 && v <= 4) return v; } catch (e) { } return 2; }
    function hyMotor(s, ad, v) { var m = s && s.motor; return (m && m[ad] !== undefined && m[ad] !== null) ? m[ad] : v; }
    function hyBagli(el) { return el.isConnected !== undefined ? el.isConnected : document.documentElement.contains(el); }
    /* desen [L, 2L+16]: yolun sonunda sıfır boylu ikinci çizgi (yuvarlak uçlu leke) çıkmasın */
    function hyDash(el, L) { el.style.strokeDasharray = L + ' ' + (L * 2 + 16); }
    function hySvg(data, renk) {
        var NS = 'http://www.w3.org/2000/svg', id = 'ysHyMaske' + (++_hySay);
        var yap = function (ad, oz) {
            var e = document.createElementNS(NS, ad);
            for (var k in oz) if (Object.prototype.hasOwnProperty.call(oz, k)) e.setAttribute(k, oz[k]);
            return e;
        };
        var svg = yap('svg', { viewBox: data.vb.join(' '), 'aria-hidden': 'true' });
        svg.style.width = 'calc(var(--hyH) * ' + (data.vb[2] / data.vb[3]).toFixed(4) + ')';
        var defs = yap('defs', {}), mask = yap('mask', { id: id });
        mask.appendChild(yap('rect', { x: data.vb[0], y: data.vb[1], width: data.vb[2], height: data.vb[3], fill: 'black' }));
        var darbeler = [];
        var cizgi = function (d, w) {
            var p = yap('path', { d: d, fill: 'none', stroke: 'white', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
            mask.appendChild(p);
            return p;
        };
        var motorB = data.motor || null;
        (data.strokes || []).forEach(function (s) { darbeler.push({ el: cizgi(s.d, s.w), tap: false, w: s.w, motor: s.motor || motorB }); });
        /* nokta kalkanları: gövde darbeleri noktalara taşsa da noktalar sona kadar boyanmaz */
        (data.taps || []).forEach(function (t) { if (t.sh) mask.appendChild(yap('path', { d: t.sh, fill: 'black' })); });
        (data.taps || []).forEach(function (t) { darbeler.push({ el: cizgi(t.d, t.w), tap: true }); });
        defs.appendChild(mask); svg.appendChild(defs);
        svg.appendChild(yap('line', { x1: data.vb[0], x2: data.vb[0] + data.vb[2], y1: 410, y2: 410, 'class': 'ys-hy-satir' }));   /* taban çizgisi */
        var golge = yap('path', { d: data.fill, 'class': 'ys-hy-ghost' });
        svg.appendChild(golge);
        svg.appendChild(yap('path', { d: data.fill, fill: renk, mask: 'url(#' + id + ')' }));
        var uc = yap('g', {});
        uc.appendChild(yap('circle', { r: 18, fill: renk, opacity: '0.22' }));
        uc.appendChild(yap('circle', { r: 10, fill: '#ffffff', stroke: renk, 'stroke-width': 4.5 }));
        uc.appendChild(yap('circle', { r: 3.2, fill: renk }));
        uc.style.visibility = 'hidden';
        svg.appendChild(uc);
        return { svg: svg, strokes: darbeler, nib: uc, golge: golge, vb: data.vb, raf: null, bitince: null };
    }
    /* GİT-GEL: kalemin kendi izinden geçtiği kısım (kalem eninin 0,22'si kadar yakın) 1/0,7 kat hızlı */
    function hyProfil(s) {
        var iz = hyMotor(s, 'iz', HY_IZ), esikO = hyMotor(s, 'esik', HY_ESIK);
        if (s.prof && s.prof._iz === iz && s.prof._esik === esikO) return s.prof;
        var el = s.el, L = el.getTotalLength(), N = Math.max(8, Math.min(600, Math.round(L / 6)));
        var px = new Float64Array(N + 1), py = new Float64Array(N + 1), i, j;
        for (i = 0; i <= N; i++) { var q = el.getPointAtLength(L * i / N); px[i] = q.x; py[i] = q.y; }
        var yc = (s.w || 60) * esikO, yc2 = yc * yc, atla = Math.max(3, Math.ceil(N * ((s.w || 60) * 1.6) / L));
        var kum = new Float64Array(N + 1), top = 0;
        for (i = 1; i <= N; i++) {
            var gec = false;
            for (j = 0; j <= i - atla; j++) { var dx = px[i] - px[j], dy = py[i] - py[j]; if (dx * dx + dy * dy < yc2) { gec = true; break; } }
            top += gec ? iz : 1; kum[i] = top;
        }
        s.prof = { L: L, N: N, kum: kum, top: top, etkin: L * (top / N), _iz: iz, _esik: esikO };
        return s.prof;
    }
    function hyUzunluk(pr, e) {
        if (e <= 0) return 0;
        if (e >= 1) return pr.L;
        var hedef = pr.top * e, lo = 1, hi = pr.N;
        while (lo < hi) { var m = (lo + hi) >> 1; if (pr.kum[m] < hedef) lo = m + 1; else hi = m; }
        var a = pr.kum[lo - 1], b = pr.kum[lo], f = b > a ? (hedef - a) / (b - a) : 0;
        return pr.L * (lo - 1 + f) / pr.N;
    }
    function hySifirla(a) {
        a.strokes.forEach(function (s) { var L = s.el.getTotalLength(); hyDash(s.el, L); s.el.style.strokeDashoffset = L; });
    }
    function hyDurdur(a) {
        if (a.raf) cancelAnimationFrame(a.raf);
        a.raf = null; a.bitince = null;
        if (a.nib) { a.nib.style.visibility = 'hidden'; a.nib.style.opacity = '1'; }
    }
    /* bir biçimi BİR KEZ yazar (alfabedeki playForm, tekSefer), bitince a.bitince() */
    function hyOynat(a, hz) {
        var items = a.strokes.map(function (s) {
            var len = s.el.getTotalLength(), pr = s.tap ? null : hyProfil(s), etkin = pr ? pr.etkin : len;
            var ozelSure = hyMotor(s, 'sure', null), ozelHiz = hyMotor(s, 'hiz', 1) * hz;
            var taban = s.tap ? Math.max(260, Math.min(900, len * 2.2))
                      : (ozelSure !== null ? ozelSure : Math.max(1100, Math.min(3600, etkin * 3.4)));
            return { el: s.el, len: len, tap: s.tap, pr: pr, dur: taban / ozelHiz };
        });
        items.forEach(function (it) {
            hyDash(it.el, it.len); it.el.style.strokeDashoffset = it.len;
            var b = it.el.getPointAtLength(0), e = it.el.getPointAtLength(it.len);
            it.bas = { x: b.x, y: b.y }; it.son = { x: e.x, y: e.y };
        });
        var nib = a.nib, i = 0, t0 = null, GAP = 90, gapUntil = performance.now() + 120, ucus = null;
        var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
        var adim = function (now) {
            if ((!HY && !(RA && RA.a === a)) || !hyBagli(a.svg)) { a.raf = null; return; }   /* v24: yerinde oynayan (RA) da */
            if (ucus) {                                   /* darbeler arası: kalem havada uçar, bir şey boyanmaz */
                var g = Math.min(1, (now - ucus.t0) / ucus.dur), e2 = ease(g), sn = Math.sin(Math.PI * e2);
                var x = ucus.a.x + (ucus.b.x - ucus.a.x) * e2, y = ucus.a.y + (ucus.b.y - ucus.a.y) * e2 - sn * ucus.kavis;
                nib.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + (1 - 0.22 * sn) + ')');
                nib.style.opacity = String(1 - 0.45 * sn);
                if (g >= 1) { ucus = null; nib.style.opacity = '1'; gapUntil = now + GAP; }
                a.raf = requestAnimationFrame(adim);
                return;
            }
            if (i >= items.length) {
                nib.style.visibility = 'hidden'; nib.style.opacity = '1'; a.raf = null;
                var f = a.bitince; a.bitince = null;
                if (f) f();
                return;
            }
            if (now < gapUntil) { a.raf = requestAnimationFrame(adim); return; }
            var it = items[i];
            if (t0 === null) { t0 = now; nib.style.visibility = 'visible'; nib.style.opacity = '1'; }
            var t = Math.min(1, (now - t0) / it.dur), e = ease(t);
            var gid = it.pr ? hyUzunluk(it.pr, e) : it.len * e;
            it.el.style.strokeDashoffset = it.len - gid;
            var pt = it.el.getPointAtLength(gid);
            nib.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
            if (t >= 1) {
                i++; t0 = null;
                var sonraki = items[i];
                if (sonraki) {
                    var p1 = it.son, p2 = sonraki.bas, dx = p2.x - p1.x, dy = p2.y - p1.y, uz = Math.sqrt(dx * dx + dy * dy);
                    if (uz > 8) ucus = { a: p1, b: p2, t0: now, dur: Math.max(190, Math.min(560, uz * 1.35)) / hz, kavis: Math.min(80, uz * 0.24) };
                    else gapUntil = now + GAP;
                }
            }
            a.raf = requestAnimationFrame(adim);
        };
        a.raf = requestAnimationFrame(adim);
    }
    function hyYazan(i) { if (HY) HY.figs.forEach(function (f, k) { f.classList.toggle('yaz', k === i); }); }
    /* BİR TUR — «Hepsi birden»: dört biçim birlikte başlar, en geç biten bekler;
       «Sırayla»: ayrı → başta → ortada → sonda, biten ekranda kalır.
       Tur bitince 1,7 sn sonra hepsi silinip baştan (alfabedeki gibi). */
    function hyTur() {
        if (!HY) return;
        clearTimeout(HY.z);
        HY.anims.forEach(function (a) { hyDurdur(a); hySifirla(a); });
        hyYazan(-1);
        var hz = HY_HIZ[HY.hiz] || 1, anims = HY.anims, tur = ++HY.tur;
        var sonra = function () { if (HY && HY.tur === tur) HY.z = setTimeout(function () { if (HY && HY.tur === tur) hyTur(); }, 1700); };
        if (HY.kip === 'sira') {
            var sirayla = function (i) {
                if (!HY || HY.tur !== tur) return;
                hyYazan(i);
                if (i >= anims.length) { sonra(); return; }
                anims[i].bitince = function () { sirayla(i + 1); };
                hyOynat(anims[i], hz);
            };
            sirayla(0);
        } else {
            var kalan = anims.length;
            anims.forEach(function (a) {
                a.bitince = function () { if (--kalan <= 0) sonra(); };
                hyOynat(a, hz);
            });
        }
    }
    function harfAnimKur() {
        if (!UI) return null;
        var kap = UI.sahne.querySelector('.ys-hy');
        if (kap) return kap;
        kap = document.createElement('div');
        kap.className = 'ys-hy';
        kap.setAttribute('role', 'dialog');
        kap.setAttribute('aria-label', 'Harfin yazılışı');
        kap.hidden = true;
        var hiz = '';
        for (var i = 0; i < 5; i++) hiz += '<button type="button" class="ys-hy-hz" data-is="hyHiz" data-v="' + i + '" title="' + HY_HIZ_AD[i] + '" aria-pressed="false">' + (i + 1) + '</button>';
        kap.innerHTML = '<div class="ys-hy-kart">' +
            '<div class="ys-hy-bas"><b><i lang="ar"></i><span></span></b><span class="ys-bos"></span>' +
              '<div class="ys-anahtar ys-hy-kip" role="radiogroup" aria-label="Yazım sırası"><i class="ys-top"></i>' +
                '<button type="button" class="ys-asec" data-is="hyKip" data-v="hepsi" role="radio" aria-checked="true" title="Dört biçim aynı anda yazılır"><span>Hepsi birden</span></button>' +
                '<button type="button" class="ys-asec" data-is="hyKip" data-v="sira" role="radio" aria-checked="false" title="Biçimler sırayla yazılır: ayrı → başta → ortada → sonda"><span>Sırayla</span></button>' +
              '</div>' +
              '<div class="ys-hy-hiz" role="group" aria-label="Yazma hızı"><span>Hız</span>' + hiz + '</div>' +
              '<button type="button" class="ys-t" data-is="hyTekrar" title="Baştan yaz">' + IK.yeniden + '<span>Baştan</span></button>' +
              '<button type="button" class="ys-t kapat" data-is="hyKapat" title="Kapat (Esc)" aria-label="Kapat">' + IK.carpi + '</button>' +
            '</div>' +
            '<div class="ys-hy-bicimler"></div></div>';
        kap.addEventListener('pointerdown', function (e) { if (e.target === kap) harfAnimKapat(); });   /* boşluğa basınca kapanır */
        UI.sahne.appendChild(kap);
        return kap;
    }
    /* harf BÜYÜK görünsün: görüş kutusunun (730 birim) üstündeki ve altındaki boşluk
       kırpılır — dört biçimin dolgularının ortak kutusu, taban çizgisi (y=410) hepsinde
       aynı hizada kalır; üstte kalemin havada uçuşuna, altta noktalara pay */
    function hyKirp() {
        if (!HY) return;
        var y0 = Infinity, y1 = -Infinity;
        HY.anims.forEach(function (a) {
            try { var b = a.golge.getBBox(); if (b.height > 0) { y0 = Math.min(y0, b.y); y1 = Math.max(y1, b.y + b.height); } } catch (e) { }
        });
        if (!(y1 > y0)) return;
        y0 = Math.min(y0, 410) - 48; y1 = Math.max(y1, 410) + 36;
        HY.anims.forEach(function (a, i) {
            var vb = a.vb, y = Math.max(vb[1], y0), h = Math.min(vb[1] + vb[3], y1) - y;
            if (!(h > 0)) return;
            a.svg.setAttribute('viewBox', vb[0] + ' ' + y + ' ' + vb[2] + ' ' + h);
            HY.oran[i] = vb[2] / h;
            a.svg.style.width = 'calc(var(--hyH) * ' + HY.oran[i].toFixed(4) + ')';
        });
    }
    /* kartın yeri ve harflerin boyu: geniş ekranda «Silik yazı» penceresinin
       yanından başlar (kâğıdın kaydığı gibi); dört biçim tek satıra sığmayacak
       kadar dar ise iki satır (ayrı · başta / ortada · sonda) */
    function hyBoyutla() {
        if (!HY || !UI || HY.kap.hidden) return;
        var kap = HY.kap, sol = 0;
        if (UI.silik && !UI.silik.hidden) {
            var sag = UI.silik.offsetLeft + UI.silik.offsetWidth + 10;
            if (UI.sahne.clientWidth - sag >= 520) sol = sag;
        }
        kap.style.left = sol + 'px';
        var kart = kap.querySelector('.ys-hy-kart'), yer = kap.querySelector('.ys-hy-bicimler'), bas = kap.querySelector('.ys-hy-bas');
        var px = function (el, ad) { return parseFloat(getComputedStyle(el)[ad]) || 0; };
        var aw = kap.clientWidth - px(kap, 'paddingLeft') - px(kap, 'paddingRight') - px(kart, 'paddingLeft') - px(kart, 'paddingRight') - 16;
        var ah = kap.clientHeight - px(kap, 'paddingTop') - px(kap, 'paddingBottom') - px(kart, 'paddingTop') - px(kart, 'paddingBottom') -
                 bas.offsetHeight - px(kart, 'rowGap') - 6;
        var gx = px(yer, 'columnGap'), gy = px(yer, 'rowGap'), ET = 34;              /* biçim adı + iç boşluk */
        var o = HY.oran, top = 0;
        o.forEach(function (x) { top += x; });
        var H = Math.min(560, (aw - gx * (o.length - 1) - 8 * o.length) / top, ah - ET), iki = false;
        if (o.length === 4) {
            var H2 = Math.min(560, (aw - gx - 16) / Math.max(o[0] + o[1], o[2] + o[3]), (ah - gy - 2 * ET) / 2);
            if (H2 > H * 1.2) { iki = true; H = H2; }
        }
        H = Math.max(60, Math.floor(H));
        yer.classList.toggle('iki', iki);
        yer.style.setProperty('--hyH', H + 'px');
        /* yine de taşarsa (yazı tipi, satır boyu) bir kez küçült */
        var fy = kart.scrollHeight - kart.clientHeight, fx = kart.scrollWidth - kart.clientWidth;
        if (fy > 0 || fx > 0) {
            var k = Math.min(fy > 0 ? (H - fy / (iki ? 2 : 1) - 2) / H : 1, fx > 0 ? (yer.clientWidth - fx - 4) / yer.clientWidth : 1);
            yer.style.setProperty('--hyH', Math.max(60, Math.floor(H * k)) + 'px');
        }
    }
    function hyAyarGuncelle() {
        if (!HY) return;
        var k = HY.kap.querySelector('.ys-hy-kip');
        if (k) {
            k.classList.toggle('ikinci', HY.kip === 'sira');
            [].forEach.call(k.querySelectorAll('.ys-asec'), function (b) { b.setAttribute('aria-checked', b.getAttribute('data-v') === HY.kip ? 'true' : 'false'); });
        }
        [].forEach.call(HY.kap.querySelectorAll('.ys-hy-hz'), function (b) {
            var se = +b.getAttribute('data-v') === HY.hiz;
            b.classList.toggle('sec', se); b.setAttribute('aria-pressed', se ? 'true' : 'false');
        });
    }
    function hyBirak() {                                 /* turu durdurur (kart yerinde kalır) */
        if (!HY) return;
        clearTimeout(HY.z);
        HY.tur++;
        HY.anims.forEach(hyDurdur);
        HY = null;
    }
    function hyGonder() { if (HY && yLider()) yGonder({ t: 'a', h: HY.h, m: HY.kip, z: HY.hiz }); }
    function harfAnimAc(h, uzaktan, ayar) {
        var H = harfBul(h);
        if (!UI || !H) return;
        var tok = ++_hyTok;
        (hyVeri() ? Promise.resolve(true) : betikYukle(HYZ_YOL)).then(function () {
            if (!UI || tok !== _hyTok) return;
            var V = hyVeri(), d = V && V[h], kap = harfAnimKur();
            if (!d || !kap) { harfAnimKapat(true); if (!uzaktan) bildir('Harfin yazılış animasyonu yüklenemedi', true); return; }
            hyBirak();
            kap.querySelector('.ys-hy-bas b i').textContent = h;
            kap.querySelector('.ys-hy-bas b span').textContent = H[1] + ' harfinin yazılışı';
            var yer = kap.querySelector('.ys-hy-bicimler');
            yer.innerHTML = '';
            var anims = [], figs = [], oran = [];
            HYZ_BICIM.forEach(function (bc) {
                var v = d[bc.k];
                if (!v || !v.vb) return;
                if (anims.length === 2) { var kir = document.createElement('i'); kir.className = 'ys-hy-kir'; yer.appendChild(kir); }
                var a = hySvg(v, bc.renk), fig = document.createElement('figure'), et = document.createElement('figcaption');
                fig.className = 'ys-hy-b';
                fig.appendChild(a.svg);
                et.textContent = bc.ad; et.style.color = bc.renk;
                fig.appendChild(et);
                yer.appendChild(fig);
                anims.push(a); figs.push(fig); oran.push(v.vb[2] / v.vb[3]);
            });
            if (!anims.length) { harfAnimKapat(true); return; }
            var z = ayar ? parseInt(ayar.z, 10) : NaN;
            HY = { kap: kap, h: h, anims: anims, figs: figs, oran: oran, z: 0, tur: 0,
                   kip: (ayar && (ayar.m === 'sira' || ayar.m === 'hepsi')) ? ayar.m : hyKipOku(),
                   hiz: (z >= 0 && z <= 4) ? z : hyHizOku() };
            kap.hidden = false;
            hyAyarGuncelle();
            hyKirp();
            hyBoyutla();
            hyTur();
            if (!uzaktan) hyGonder();                    /* yansıtma: öbür ekranda da */
        });
    }
    function harfAnimKapat(uzaktan) {
        _hyTok++;
        var acikti = !!HY;
        hyBirak();
        var kap = UI && UI.sahne && UI.sahne.querySelector('.ys-hy');
        if (kap) { kap.hidden = true; var yer = kap.querySelector('.ys-hy-bicimler'); if (yer) yer.innerHTML = ''; }
        if (acikti && !uzaktan && yLider()) yGonder({ t: 'a', h: '' });
    }
    function harfAnimTekrar() { if (HY) { hyTur(); hyGonder(); } }
    function hyKipSec(v) {
        if (!HY) return;
        HY.kip = v === 'sira' ? 'sira' : 'hepsi';
        try { localStorage.setItem('kidefHarfYazimKipi', HY.kip); } catch (e) { }
        hyAyarGuncelle(); hyTur(); hyGonder();
    }
    function hyHizSec(v) {
        if (!HY) return;
        v = parseInt(v, 10);
        HY.hiz = (v >= 0 && v <= 4) ? v : 2;
        try { localStorage.setItem('kidefYazimHizi', String(HY.hiz)); } catch (e) { }
        hyAyarGuncelle(); hyTur(); hyGonder();
    }
    /* yansıtma: liderin kartı izleyende de (h boşsa kapanır) */
    function yHarfAnim(m) { if (m && m.h) harfAnimAc(m.h, true, m); else harfAnimKapat(true); }

    /* ------------------------------------------------------------------
       REHBER HARFİN YAZILIŞI, YERİNDE (DEFTER v24, 24.10.2026) — öğretmen:
       "silik yazı kısmında harf eklenince yazılış animasyonu için rehber
       harflere tıklayınca o harfin yazılışı çıksın, popup olmadan ve sadece o
       harfin yazılış animasyonu açılmalı".
       Kâğıttaki koyu rehber harfe ('m' parçası: ayrı · başta · ortada · sonda)
       dokununca YALNIZ o biçim, alfabe motoruyla (hySvg / hyOynat) harfin kendi
       yerinde ve boyunda yazılır. Veri Arakom'un 600 birimlik çizimi, taban y=410
       — tuvaldeki harfle aynı ölçek (F / 600); yatayda yalın ve ortadaki harf
       mürekkebin ortasından, baştaki sağ ucundan, sondaki sol ucundan oturur
       (kâğıttaki ـ uzantısı veridekinden uzun). Yazılırken tuvaldeki koyu harf
       çizilmez (silikYaz), bitince 1,2 sn durur, solarak koyu harfe döner.
       Basış çizgi başlatmaz (rehberBekle): kalkarsa yazılış, 9 px kayarsa ya da
       0,45 sn basılı kalırsa yazı. Yansıtma: { t:'ra', j, x, y, tx, z } (j<0: dur).
       ------------------------------------------------------------------ */
    var RA = null, _raTok = 0, _raSol = null, _rb = null, _raOlcBel = {};
    var RA_HIZA = { n: 'c', b: 'r', o: 'c', s: 'l' };
    /* parçanın harfi ve biçimi; sondaki biçimle aynı yazılan ortadaki (ـا ـد ـو) sol uçtan */
    function rehberHarf(s) {
        if (!s || s.k !== 'm' || !s.t) return null;
        for (var i = 0; i < HARFLER.length; i++) {
            var H = HARFLER[i];
            if (s.t === H[0]) return { h: H[0], k: 'n', hiza: 'c' };
            if (s.t === H[2]) return { h: H[0], k: 'b', hiza: 'r' };
            if (s.t === H[3]) return { h: H[0], k: 'o', hiza: H[3].charAt(H[3].length - 1) === 'ـ' ? 'c' : 'l' };
            if (s.t === H[4]) return { h: H[0], k: 's', hiza: 'l' };
        }
        return null;
    }
    /* şerit noktası p, j. sayfadaki hangi koyu rehber harfin üstünde */
    function rehberBul(j, p) {
        var sy = D && D.sayfalar[j];
        if (!sy || !sy.silik || !sy.silik.length) return null;
        var kay = yerelKay(j), x = p[0] + kay[0], y = p[1] + kay[1], en = null, enD = Infinity;
        sy.silik.forEach(function (s) {
            if (!s || s.k !== 'm' || !rehberHarf(s)) return;
            var F = s.b;
            if (y < s.y - F * 0.85 || y > s.y + F * 0.5) return;
            var dx = Math.abs(x - s.x);
            if (dx > olcu(s.t, F) / 2 + F * 0.12) return;
            if (dx < enD) { enD = dx; en = s; }
        });
        return en;
    }
    /* tuvaldeki harfin mürekkep kutusu (600 px'te, ortalanmış, sağdan sola): ortadan sola l, sağa r */
    function rehberOlc(t) {
        if (_raOlcBel[t]) return _raOlcBel[t];
        var r = { l: 0, r: 0 };
        try {
            var c = document.createElement('canvas').getContext('2d');
            c.font = '600px ' + SILIK_FONT;
            try { c.direction = 'rtl'; } catch (e) { }
            c.textAlign = 'center';
            var m = c.measureText(t);
            if (typeof m.actualBoundingBoxLeft === 'number' && m.actualBoundingBoxLeft + m.actualBoundingBoxRight > 0)
                r = { l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight };
            else r = { l: m.width / 2, r: m.width / 2 };
        } catch (e) { }
        return (_raOlcBel[t] = r);
    }
    function rehberBekle(e, j, p) {
        if (!T.sk || !T.sk.anim || yIzleyen()) return false;
        var s = rehberBul(j, p);
        if (!s) return false;
        if (_rb) clearTimeout(_rb.z);
        _rb = { id: e.pointerId, j: j, p: p, s: s, x: e.clientX, y: e.clientY };
        _rb.z = setTimeout(rehberYaz, 450);                      /* basılı kaldı: yazı */
        return true;
    }
    function rehberYaz() {                                       /* bekleyen dokunuş yazıya döner */
        var b = _rb;
        if (!b) return;
        _rb = null; clearTimeout(b.z);
        if (!UI || !D || _cz) return;
        kalemBaslat(b.id, b.j, b.p, false);
    }
    function rehberDokun(cx, cy) {                               /* kaydırma kipinde (kalemli cihazda parmak) */
        if (!UI || !D || !T.sk || !T.sk.anim || yIzleyen()) return;
        var p = nokta({ clientX: cx, clientY: cy }), j = sayfaNo(p), s = rehberBul(j, p);
        if (s) rehberOynat(j, s, true);
    }
    function rehberOynat(j, s, bizden, z) {
        var bil = rehberHarf(s);
        if (!bil || !UI || !D) return;
        var tok = ++_raTok, hiz = (z >= 0 && z <= 4) ? z : hyHizOku();
        if (bizden && yLider()) yGonder({ t: 'ra', j: j, x: s.x, y: s.y, tx: s.t, z: hiz });
        Promise.all([hyVeri() ? true : betikYukle(HYZ_YOL), fontHazir()]).then(function () {
            if (!UI || !D || tok !== _raTok) return;
            var V = hyVeri(), d = V && V[bil.h] && V[bil.h][bil.k], sy = D.sayfalar[j];
            if (!d || !d.vb) { if (bizden) bildir('Harfin yazılış animasyonu yüklenemedi', true); return; }
            if (!sy || (sy.silik || []).indexOf(s) < 0) return;
            raDurdur(true, true);
            var renk = HYZ_BICIM[0].renk;
            HYZ_BICIM.forEach(function (b) { if (b.k === bil.k) renk = b.renk; });
            var a = hySvg(d, renk), kap = document.createElement('div');
            kap.className = 'ys-ra';
            kap.setAttribute('aria-hidden', 'true');
            kap.appendChild(a.svg);
            UI.kagit.insertBefore(kap, UI.kagit.querySelector('.ys-altnav'));
            /* yer: taban y=410 ↔ s.y; ölçek F/600; yatay oturma biçime göre */
            var k = s.b / 600, m = rehberOlc(s.t), bb = null, ux, px;
            try { bb = a.golge.getBBox(); } catch (e) { bb = null; }
            if (!bb || !(bb.width > 0)) { ux = d.vb[2] / 2; px = s.x; }
            else if (bil.hiza === 'r') { ux = bb.x + bb.width; px = s.x + m.r * k; }
            else if (bil.hiza === 'l') { ux = bb.x; px = s.x - m.l * k; }
            else { ux = bb.x + bb.width / 2; px = s.x + (m.r - m.l) / 2 * k; }
            /* kalem ucu küçük harfte de seçilsin (ekranda ~11 px yarıçap) */
            var q = Math.max(1, Math.min(4, 11 / Math.max(0.5, 18 * k * (UI.cssOlcek || 1))));
            [].forEach.call(a.nib.querySelectorAll('circle'), function (c) {
                c.setAttribute('r', (+c.getAttribute('r') * q).toFixed(2));
                var w = c.getAttribute('stroke-width');
                if (w) c.setAttribute('stroke-width', (+w * q).toFixed(2));
            });
            RA = { j: j, s: s, a: a, kap: kap, k: bil.k, ox: px - ux * k, oy: s.y - 410 * k, w: d.vb[2] * k, h: d.vb[3] * k, z: 0 };
            sayfaCiz();                                          /* koyu harf çekilir, yerinde yazılır */
            hySifirla(a);
            a.bitince = function () { if (RA && RA.a === a) RA.z = setTimeout(raBitir, 1200); };
            hyOynat(a, HY_HIZ[hiz] || 1);
        }, function () { if (bizden) bildir('Harfin yazılış animasyonu yüklenemedi', true); });
    }
    function raKonumla() {
        if (_raSol && UI && UI.vy0 !== _raSol.vy0) raSolKaldir();         /* solarken kâğıt kaydı */
        if (!RA || !UI || !D || UI.vx0 == null) return;
        var sy = D.sayfalar[RA.j];
        if (!dikeyMi() || !sy || (sy.silik || []).indexOf(RA.s) < 0) { raDurdur(true, true); return; }   /* harf kalktı / taşındı */
        var o = UI.cssOlcek, x = (RA.ox - UI.vx0) * o, y = (RA.j * sayfaYuk() + RA.oy - UI.vy0) * o, st = RA.a.svg.style;
        st.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)';
        st.width = (RA.w * o).toFixed(2) + 'px';
        st.height = (RA.h * o).toFixed(2) + 'px';
    }
    function raSolKaldir() {
        if (!_raSol) return;
        var k = _raSol.kap;
        _raSol = null;
        if (k.parentNode) k.parentNode.removeChild(k);
    }
    function raBitir() {                                         /* yazıldı, durdu: solarak koyu harfe döner */
        if (!RA) return;
        var r = RA;
        RA = null;
        clearTimeout(r.z); hyDurdur(r.a);
        raSolKaldir();
        sayfaCiz();
        _raSol = { kap: r.kap, vy0: UI ? UI.vy0 : 0 };
        r.kap.classList.add('sol');
        setTimeout(function () { if (_raSol && _raSol.kap === r.kap) raSolKaldir(); }, 380);
    }
    function raDurdur(sessiz, cizme) {
        _raTok++;
        raSolKaldir();
        if (!RA) return;
        var r = RA;
        RA = null;
        clearTimeout(r.z); hyDurdur(r.a);
        if (r.kap.parentNode) r.kap.parentNode.removeChild(r.kap);
        if (!cizme) sayfaCiz();
        if (!sessiz && yLider()) yGonder({ t: 'ra', j: -1 });
    }
    /* yansıtma: liderin dokunduğu rehber harf izleyende de yazılır (j < 0: durur) */
    function yRehber(m) {
        if (!m || m.j == null || m.j < 0) { raDurdur(true); return; }
        var sy = D.sayfalar[m.j], s = null;
        (sy && sy.silik || []).forEach(function (x) {
            if (!s && x.k === 'm' && x.t === m.tx && Math.abs(x.x - m.x) < 0.6 && Math.abs(x.y - m.y) < 0.6) s = x;
        });
        if (!s) return;
        silikGoster(m.j, s.y - s.b, s.y + s.b * 0.6);           /* tahtada görünmüyorsa oraya kayar */
        rehberOynat(m.j, s, false, parseInt(m.z, 10));
    }

    window.KidefYaziSayfasi = {
        ac: ac, kapat: kapat, kucult: kucult, buyut: buyut, tekBasina: tekBasina,
        tek: function () { return TEK; }, adres: defterAdresi,
        yazi: function () { return YAZI; }, rolYenile: rolYenile,
        silik: { ac: silikAc, kapat: silikKapat, kelime: silikKelimeKoy, harf: silikHarfKoy, kaldir: silikKaldir,
                 satirlar: yaziSatirlari, kodla: silikKodla, coz: silikCoz,
                 liste: function () { return D ? D.sayfalar.map(function (x) { return (x.silik || []).slice(); }) : null; } },
        _tamSifirla: function () { if (UI) UI.tamDenendi = false; },      /* deneme */
        _rehber: function () { return RA ? { j: RA.j, t: RA.s.t, x: RA.s.x, y: RA.s.y, k: RA.k } : null; },   /* deneme (v24) */
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
        boy: function () { return D ? { pw: D.pw, ph: D.ph } : null; },
        sayfaSil: sayfaSilGenel, defterTuru: defterTuru,
        _kod: function () { return D ? defterKodla(D.sayfalar, D.pw, cizgiDuzeni()) : null; },
        _yansit: function () { return YK ? { lider: yLider(), izleyen: yIzleyen(), uzak: Object.keys(YK.uzak).length, taban: !!YK.kodlar,
                                             alan: !!(UI && UI.ort && UI.ort.hasAttribute('data-tahta-kanal')) } : null; }
    };
})();
