/* ===========================================================================
   SINIFTA YENİ — ana sayfadaki duyuru köşesi                     04.10.2026
   ---------------------------------------------------------------------------
   Öğretmen: "amacımız yaptığımız yeni güncellemeleri bildirmek ama çok fazla
   teknik bi dille değil, öğretim yöntem ve teknikleri ve öğretmenin
   kolaylıkla uygulaması vs yönünden."

   Yani burada YENİLİK duyurulur — ama "şu dosya güncellendi" diye değil:
   öğretmen o yenilikle SINIFTA ne yapabilir, nasıl uygular, ne kazanır.

   YAZIM KURALI (yeni kayıt eklerken buna uy)
     · Başlık, yeniliğin ADI değil ÖĞRETMENE SÖYLEDİĞİ şey olsun.
       "Flipbook yan çubuğu yenilendi" ✗   "İçindekiler artık elinin altında" ✓
     · Metin, sınıfta ne işe yaradığını ve nasıl uygulandığını anlatsın;
       2-3 cümle. Dosya adı, sürüm, klasör, kod adı GEÇMESİN.
     · Teknik ayrıntı gerekiyorsa YUKLENECEKLER.txt'ye yazılır, buraya değil.

   KAYIT BİÇİMİ
     t  tarih 'YYYY-AA-GG' — en yeni kayıt dizinin BAŞINDA
     e  etiket — alan (Planlar, Dijital kitap, Oyun, Bilgi yarışması…)
     b  başlık
     m  metin
     L  (isteğe bağlı) maddeler: ['kısa cümle', …] — GRUPLU DUYURU (27.10.2026):
        benzer konudaki yenilikler tek sayfada, her biri TEK KISA cümle; m o zaman
        boş kalabilir. sistem/galeri.js maddeleri liste olarak çizer. Aynı sayfayı
        sistem/yenilikler.js'e de (metin = maddeler art arda) yaz.

   EN FAZLA 20 KAYIT (15.11.2026) — öğretmen: "sınıfta yeni kısmında 20 duyurudan sonrakileri silelim".
     Dizi en yeni 20 kaydı tutar. Yeni kayıt başa eklenince 21. sıraya düşen en eski kayıt SİLİNİR; sistem/
     yenilikler.js'teki profil şeridi ayrı bir listedir, kısaltılmaz. 15.11.2026'da 49 kayıttan 30'u silindi
     (eski hâli: _kaynak/yedekler/2026-11-15-siniftayeni-20/siniftayeni.js). Betik: _kaynak/uretici/siniftaYeni20.py

   Site içi teknik duyuru şeridi ayrı yerde: sistem/yenilikler.js
   (öğretmen profilindeki "yenilik" şeridi).
   =========================================================================== */
window.KIDEF_SINIFTA_YENI = [
  /* SINIFTA YENİ 23.11.2026 — yönetici: "canlı ders özelliğini de aktif edelim, sadece destek verenler kullanabilecek, ayrıca
     sitede yeni kısmına bu özelliği ekleyelim". Görseli dosyanın sonunda: g 'canliders'. Liste en fazla 20 kayıt tutar:
     bu kayıt başa eklenince en eski kayıt (26.10.2026 «Akıllı tahta») silindi. */
  { t: '2026-11-23', e: 'Canlı ders', g: 'canliders', b: 'Öğrencini siteden canlı derse çağır',
    m: 'Açtığın kitap ve sayfa, öğrencinin telefonunda ya da bilgisayarında aynı anda açılır; sen anlatırsın, o hem görür hem dinler.',
    L: [
      'Canlı ders, Kidef\'e destek veren öğretmenlere açık; öğrencinin katılması için destek gerekmez.',
      'Üst çubuktaki canlı ders düğmesine ya da Listelerim\'deki «Canlı ders»e dokun; hesabıyla sana bağlı öğrencini çağır.',
      'Öğrenci ana sayfasında «Derse katıl» kartını görür; istersen katılım bağlantısını ona sen de gönderirsin.',
      'Sayfayı sen açarsın, kaydırırsın, lazerle gösterirsin; öğrencin hepsini kendi ekranında keskin görür.',
      'Konuşarak anlatırsın; kamerayı istersen açarsın, istemezsen ses yeter.',
      'Dersi bitirince öğrenci kendiliğinden ana sayfasına döner.'
    ] },

  /* SINIFTA YENİ 15.11.2026 — öğretmen: "sınıfta yeni kısmına başkan ve başkan yardımcısı ile ilgili bilgileri ekle,
     ayrıca sınıfta yeni kısmında 20 duyurudan sonrakileri silelim". Başkan ve yardımcı kendi profilinde ne görür;
     görseli dosyanın sonunda: g 'baskanprofil'. Liste artık en fazla 20 kayıt tutar. */
  { t: '2026-11-15', e: 'Sınıf yönetimi', g: 'baskanprofil', b: 'Başkan ve yardımcı profilinde ne görür',
    m: 'Seçtiğin başkan ve yardımcı, görevlerini kendi profillerindeki «Sınıfım» kartından yönetir.',
    L: [
      'Başkan ya da yardımcı yapabileceğin öğrenci, e-postayla kayıtlı ve sana bağlı olandır.',
      'Sınıfta bir başkan, bir yardımcı bulunur; yeni birini seçersen eskisinin unvanı kalkar.',
      'İlk seçimde başkana hatırlatma, son gün, ödev durumu ve kura; yardımcıya hatırlatma ve kura açılır, sonra değiştirebilirsin.',
      'Kartın başlığında «başkan» ya da «yardımcı» yazar; yalnız yetki verdiğin araçlar açılır.',
      'Ödev durumunu görür ama puanları göremez; «Hatırlatma dürtüsü» yetkisi verirsen bitirmeyen arkadaşını dürter.',
      'Oturma planı yetkisiyle planı A4 çıktı alıp sınıfa asabilir; başkan altın, yardımcı gümüş taçla görünür.'
    ] },

  /* SINIFTA YENİ 15.11.2026 — öğretmen: "sınıfta yeni kısmına ekle, güzel animasyonlu svg ekle"
     (sınav gönder, sınıf başkanı ve yardımcısı, meydan okuma). Görseller dosyanın sonunda: g 'sinav',
     g 'baskan', g 'meydan'. */
  { t: '2026-11-15', e: 'Sınav', g: 'sinav', b: 'Sınavını hazırla, öğrencin telefondan çözsün',
    m: 'Kendi sınavını sitede hazırlayıp sınıfına görev olarak gönderirsin; not 100 üzerinden kendiliğinden hesaplanır.',
    L: [
      'Sınıfında «Görev Gönder»e dokun, «Sınav»ı seç.',
      'Çoktan seçmeli, doğru-yanlış ve açık uçlu soru yazarsın; Arapça klavye hazır.',
      'Puanları sen girersin; boş bıraktıklarını site 100\'e tamamlar.',
      'Öğrenci sınavı «Görevlerim»den açar, telefonda çözer.',
      'Çoktan seçmeli ve doğru-yanlışlar kendiliğinden okunur; açık uçluları sen puanlarsın.',
      'Kim kaç aldı, sonuç ekranında bir arada görürsün.'
    ] },

  { t: '2026-11-15', e: 'Sınıf yönetimi', g: 'baskan', b: 'Sınıf başkanın işini kolaylaştırsın',
    m: 'Hesabıyla sınıfına bağlı öğrencilerden başkan ve yardımcı seçer, onlara istediğin görevleri verirsin.',
    L: [
      'Sınıf listesinde öğrencinin yanındaki taca dokun: başkan ya da yardımcı yap.',
      'Başkana ve yardımcıya ayrı ayrı yetki verirsin; bir görevi ikisine de verebilirsin.',
      'Oturma planını sürükleyip bırakarak hazırlarlar.',
      'Hatırlatma, son gün uyarısı ve ödev durumu takibini üstlenirler.',
      'Kura çeker, takım kurar, yarışmada puan tablosunu tutarlar.',
      'Kâğıt sınav teslim listesi ve hesabı olmayanların takibi de onlara bırakılabilir.'
    ] },

  { t: '2026-11-15', e: 'Oyun', g: 'meydan', b: 'Öğrencilerin oyunda birbirine meydan okusun',
    m: 'Senin sınıflarına bağlı öğrenciler, sitedeki oyunlarda arkadaşlarına meydan okuyabilir.',
    L: [
      'Öğrenci oyunu ve arkadaşını seçer, meydan okur.',
      'Arkadaşı kabul edince ikisi de aynı oyunu oynar.',
      'İlk denemedeki puanlar karşılaştırılır; kazanan belli olur.',
      'Meydan okumayı dilediğin zaman açar ya da kapatırsın.'
    ] },

  /* SINIFTA YENİ 14.11.2026 — öğretmen: "sitede yeni kısmında metin tahlillerinden bahset, madde madde öz olsun teknik detay verme" */
  { t: '2026-11-14', e: 'Metin tahlili', b: 'Kitaptaki metinleri kelime kelime işle: Metinlerle Arapça',
    m: 'Ders kitaplarındaki uzun diyalog ve metinler artık ayrı bir kitapta; tahtada açıp kelime kelime, cümle cümle işlersin.',
    L: [
      '5-10. sınıf ders kitaplarındaki 82 uzun diyalog ve metin, Metinlerle Arapça kitabında bir arada.',
      'Kelimeye dokun: Türkçesi üstünde belirir, kökü ve kelime ailesi de açılır.',
      'Tek dokunuşla bütün cümlenin Türkçesi altında çıkar.',
      'Ders kitabında metnin sayfasına gelince «Kidef\'le!» düğmesi çıkar; metin hemen açılır.',
      'Derste açtığın çeviriler sayfada kalır; ders bitince silgiyle temizlersin.',
      'Sınıfının Materyaller kısmında, ders kitabının yanındaki «Metinlerle Arapça» kitabından da açılır.'
    ] },

  /* SINIFTA YENİ 08.11.2026 — öğretmen: "sitede öğrenciyi kendi hesabıyla eşleştiren öğretmenlerin tüm
     öğrencilerinin sitede aldığı puanları ve geçirdikleri süreyi, öğrencilere dijital ödev olarak görev
     gönderebileceklerini vurgulayalım duyurular kısmında, ayrıca eklememiz gereken yeni yaptıklarımızdan
     neler varsa madde madde ekleyelim, çok teknik detaya girmeyelim" · "görev gönderme ve öğrenci
     etkinliklerini kontrol etme kısmı için svg animasyonlar ekle". İlk iki sayfa animasyonlu (g 'gorev',
     g 'etkinlik' — dosyanın sonunda); ödeme konusu yok. */
  { t: '2026-11-08', e: 'Görev ve ödev', g: 'gorev', b: 'Ödevi dijital gönder, sonucu canlı izle',
    m: 'Öğrencin siteye kendi e-postasıyla kaydolup senin kodunla sınıfına bağlanınca ödevi kâğıtsız verirsin; kim yaptı, kaç aldı, hepsi önüne gelir.',
    L: [
      'Sınıfında «Görev Gönder»e dokun, oyunu ya da etkinliği seç.',
      'Ödevi bütün sınıfa, bütün seviyeye ya da tek öğrenciye gönderirsin.',
      'Son tarihi sen koyarsın; istersen ödevi performans notu yaparsın.',
      'Öğrenci ödevi «Görevlerim»de görür, telefondan da yapar.',
      'Kim yaptı, kaç aldı, ne kadar sürdü: sonuçlar sana canlı gelir.',
      'Performans ödevinin sonuçları «Notlara işle» ile not listene geçer.'
    ] },

  { t: '2026-11-08', e: 'Öğrenci gelişimi', g: 'etkinlik', b: 'Öğrencinin puanını ve süresini gör',
    m: 'Hesabıyla sınıfına bağlı öğrencin sitede ne çalışırsa, ödev vermesen de senin ekranına düşer.',
    L: [
      'Sınıfında «Etkinlikler»e dokun: hesabıyla bağlı bütün öğrencilerin bir arada.',
      'Her oyun ve etkinlikte öğrencinin en yüksek puanı (rekoru) görünür.',
      'Gelişim çizgisi, son çalıştığı gün ve 30 günlük ilerleme de orada.',
      'Hangi etkinlikte ne kadar süre çalıştığını görürsün.',
      'Henüz açmadığı etkinlikler de listede; kimin neyi atladığı belli.',
      'Öğrenci çalıştıkça tablo kendiliğinden güncellenir.'
    ] },

  { t: '2026-11-08', e: 'Öğrenci hesabı', b: 'Öğrencin sınıfını kendisi seçsin, sen tek dokunuşla onayla',
    L: [
      'Öğretmen kodun profilinde yazar; öğrencilerine bu kodu vermen yeter.',
      'Öğrenci kendi e-postasıyla kaydolur, kodu girer, sınıflarından kendi şubesini seçer.',
      'İstek zile düşer; seçtiği sınıf hazır gelir, istersen başka sınıfına alırsın.',
      'Öğrenciyi başka sınıfa alınca ya da sınıfın adını değiştirince öğrencinin ekranı da güncellenir.',
      'Kayıtta e-posta yanlış yazılırsa (gmial.com gibi) site doğrusunu önerir.',
      'Giriş olmazsa e-posta önerisi ve @gmail.com gibi hazır uzantı tuşları çıkar.'
    ] },

  { t: '2026-11-04', e: 'Dijital kitap', b: '7. sınıfın yeni Devlet kitabı sitede, sesleriyle',
    L: [
      '7. sınıfa MEB Devlet Kitapları 2026-2027 kitabı eklendi; sayfa sayfa ve sesleriyle.',
      '7. sınıfta kitap seçiminde bu yılın Devlet kitabı hazır; Mektep kitabı «2025-2026» adıyla duruyor.',
      'Altı ünitenin 18 dersindeki kelime, cümle ve diyaloglar Muhâdese ve kelime çalışmalarında.'
    ] },

  /* SINIFTA YENİ 02.11.2026 — öğretmen: "sınıfta yeni kısmına yeni özellikleri de ekleyelim, madde madde
     sınıflandırarak yapalım, ücret konusundan bahsetmiyoruz". 28.10–02.11.2026 yenilikleri yedi
     sayfada; her madde tek kısa cümle (L), sayfa başına en çok altı madde. */
  { t: '2026-11-02', e: 'Soru Hazırla', b: 'Kendi sorunu Arapça klavyeyle yaz, kâğıda ekle',
    L: [
      'Soru Hazırla\'da okul bilgilerinin altında «Kendi sorunu yaz» bölümü var.',
      '⌨ tuşuna dokun: Arapça Klavye alttan açılır, harf imlecin yerine girer.',
      'Sınavda açık uçlu soru yazarsın; cevap çizgisini ve anahtarı sen belirlersin.',
      'Beceriyi seçince öğrenme çıktısı kendiliğinden önerilir.',
      'Temrinde çoktan seçmeli de yazarsın; kâğıtta şıklar karışır.',
      'Sorular bu tarayıcıda saklanır; Arapça Klavye kartı da yerinde duruyor.'
    ] },

  { t: '2026-11-02', e: 'Sınıflarım', b: 'Sınıf listeni dosyadan yükle, materyallere şube kapısından gir',
    L: [
      'e-Okul, PDF, Word ya da Excel listeni Listelerim\'e sürükle bırak.',
      'Dosyada birkaç sınıf varsa sınıflar kendiliğinden kurulur.',
      'Eklemeden önce adları görür, istemediğini çıkarırsın; «Geri al» da var.',
      'Dosya cihazında okunur; listeye yalnız ad ve okul numarası geçer.',
      'Kurumlar ve Sınıflar\'da rakama dokununca şube kapıları parlar.',
      'Materyallere şube kapısından girersin; «Nerde kalmıştık?» de orada.'
    ] },

  { t: '2026-11-02', e: 'Sınıf listeleri', b: 'İsim yazmadan kura çek, listeye satır satır ekle',
    L: [
      'Listende ad yoksa kura sıra numarasından çekilir; sayıyı sen belirlersin.',
      'Adlar eksikse «Numarayla çek» anahtarını aç.',
      'Çıkan numara, herkes çıkana dek bir daha gelmez.',
      'Listenin altında hep boş bir satır var: adı yaz, Enter\'a bas.',
      '«Liste» menüsüyle Performans ve Sınavlar\'a geç; orada da öğrenci eklersin.',
      'Okul numarası artık sıra numarasının hemen yanında.'
    ] },

  { t: '2026-11-02', e: 'Akıllı tahta', b: 'Tahtayı ve telefonu birbirinden seç, hemen bağlansın',
    L: [
      'Akıllı tahta penceresi, hesabının açık öbür cihazlarını adıyla gösterir.',
      'Telefondan tahtayı seç: tahta kendiliğinden Sınıf Ekranı olur.',
      'Tahtadan telefonunu seç: telefonun kumanda olur.',
      'Tahtayı önceden işaretlemen gerekmez; iki cihaz hemen bağlanır.',
      'Cihaz görünmüyorsa siteyi orada aynı hesapla aç, listeye düşer.'
    ] },

  { t: '2026-11-02', e: 'Dijital kitap', b: 'Cevabı kitabın üstünde işaretle, eşleştirmeyi okla göster',
    L: [
      'Kalem şeridinde yeni «Cevapla» grubu: ✓ doğru, ✗ yanlış işareti.',
      'Daireyi sürükleyerek şıkkın boyunda çizersin.',
      'Rakam aracı her dokunuşta bir artar (١, ٢, ٣…).',
      'Eşleştirmede oku parmağınla çiz; ucunda ok belirir.',
      'Yazı aracıyla cevabı yaz; Arapça sağdan sola oturur, yüzen klavye de var.',
      'İşaretler sayfada kalır, tahtaya yansır; silgi bir işareti bütün siler.'
    ] },

  { t: '2026-11-02', e: 'Dijital kitap', b: 'Konuya tek dokunuşla git, sesi istediğin yerden dinlet',
    L: [
      'MEB kitaplarında da İçindekiler\'deki başlığa dokun, o sayfa açılır.',
      'Dokunulabilen başlıklar sayfa açılınca bir kez parlar.',
      'Soldaki İçindekiler panelinde ünitelerin altında konular da var.',
      'Panelde açık sayfanın konusu işaretli.',
      'Ses ya da video açınca altta kalın bir ilerleme çubuğu çıkar.',
      'Çubukta bir yere dokun: ses oradan çalar, cümleyi yeniden dinletirsin.'
    ] },

  { t: '2026-11-02', e: 'Alfabe', b: 'Harfi istediğin yazılışıyla sor',
    L: [
      'İstenen Harfi Yaz\'da «Yazılış» seç: Normal, Başta, Ortada, Sonda, Karışık.',
      'Her tur 28 harfin hepsini birer kez sorar, bağlanmayanlar da gelir.',
      'Şıklı «Dene» de 28 harften sorar; aynı görünen iki şık çıkmaz.',
      'Dal ve Zel\'in yazılış animasyonu yenilendi.'
    ] },

  /* GRUPLU DUYURU (27.10.2026) — öğretmen: "bu duyuruları kısa cümlelerle ve guruplayarak
     yayınlayalım, yani benzer konudaki örneğin 5 duyuruyu 5 cümle olarak tek sayfaya ekle".
     22.10.2026'dan sonraki yenilikler beş sayfada; her madde tek kısa cümle (L). */
  { t: '2026-10-27', e: 'Sınıflarım', b: 'Sınıfının materyalleri artık okulunun kitaplığında',
    L: [
      'Kurumlar ve Sınıflar penceresinde sınıf rakamına dokun: o sınıfın kitaplığı açılır.',
      'Ders kitabı, belgeler ve etkinlik kartları aynı rafta.',
      'Sınıfı olmayan seviyede önce «+ sınıf ekle»; materyaller sınıfla birlikte açılır.',
      'Sınıf kapıları 20 ayrı giydirmeyle: harfler, âyet ve hadisler, büyük şahsiyetler.',
      'Öğrencin Sınıfım bölümünde aynı kitaplığı görür.',
      '«Nerde Kalmıştık?» raporu kalınan sayfayı ve oyunları gösterir, kitabı oradan açar.'
    ] },

  { t: '2026-10-27', e: 'Dijital kitap', b: 'Kitabın üstüne yaz, kaldığın sayfayı iple işaretle',
    L: [
      'Kalem düğmesiyle sayfaya yaz; yazdığın sayfaya yapışır, büyütünce onunla gider.',
      'Yüzen şeritte 5 renk, silgi, geri al ve imleç var; şeridi istediğin yere taşırsın.',
      'Silgiye ikinci kez dokun: dokunduğu yeri ya da bütün çizgiyi siler.',
      'Sayfanın üstündeki gri ize dokun: kırmızı ip o sayfada kalır, kitapta tek ip olur.',
      'İp başka sayfadaysa cildin üstündeki kırmızı uçla o sayfaya dönersin.',
      'Yazılar her büyütmede keskin, Safari\'de de; iki parmakla akıcı yakınlaşır.'
    ] },

  { t: '2026-10-26', e: 'Defter', b: 'Defterde sınıf sınıf yazı çalışması',
    L: [
      'Sağ üstteki defter adından genel defterle sınıf defterleri arasında geçersin.',
      'Defter hep kaldığın yerden açılır; kalem daha doğal yazar.',
      '«Silik yazı» ile dersin kelimeleri gri yazılır, öğrenci üstünden geçer.',
      'Harfin dört yazılışı ve yazılış animasyonu defterde; tahtada da görünür.',
      'Sınıf materyallerindeki «Yazı Çalışması» kartını öğrenci kendi cihazında da açar.',
      '«Kalemle Üzerinden Geç» PDF\'i Alfabe\'de: 5–10. sınıf konuşma metinleri gri yazıyla.'
    ] }
];
/* NOT (15.11.2026): g 'tahta' kaydı listeden silindi ama aşağıdaki «tahta» görsel bloğu SİLİNMEMELİ — öteki
   görsellerin ortak biçimleri (.ty-kutu, .ty-svg, .ty-cip, .ty-vurgu, tyAkis …) o blokta tanımlıdır. */

/* ---------------------------------------------------------------------------
   KAYIT GÖRSELLERİ (17.10.2026) — kayıtta g: '<ad>' varsa sistem/galeri.js
   bu HTML'i başlıkla metin arasına koyar. İçerik sabit, dışarıdan gelmez.
   --------------------------------------------------------------------------- */
window.KIDEF_SINIFTA_YENI_GORSEL = window.KIDEF_SINIFTA_YENI_GORSEL || {};
(function () {
  /* ayak izi (tabanı sağa, tahtaya doğru; yandan bakışta basık) */
  var IZ = function (x, y, sinif) {
    return '<g class="ty-iz ' + sinif + '" transform="translate(' + x + ' ' + y + ') scale(1 .6) rotate(90)">' +
      '<ellipse cx="0" cy="-3" rx="3.4" ry="5"/><ellipse cx="0" cy="5.4" rx="2.6" ry="2.8"/></g>';
  };
  /* Masasında oturan öğretmen; dizüstündeki harf tahtada aynı anda yazılıyor */
  var SAHNE =
    '<div class="ty-kutu"><svg class="ty-svg" viewBox="0 0 480 214" role="img" aria-label="Öğretmen masasında oturuyor; bilgisayarındaki ya da telefonundaki sayfa akıllı tahtada aynı anda görünüyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#F4F8FB"/>' +
    '<path d="M0 174H480V198a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16Z" fill="#E7F2EF"/>' +
    '<path d="M0 174H480" stroke="#CFE3DD" stroke-width="2"/>' +
    /* akıllı tahta */
    '<rect x="262" y="14" width="206" height="116" rx="8" fill="#0F2A43"/>' +
    '<rect x="270" y="22" width="190" height="98" rx="4" fill="#fff"/>' +
    '<rect x="278" y="29" width="174" height="9" rx="4.5" fill="#E8F6F2"/>' +
    '<rect x="280" y="31" width="34" height="5" rx="2.5" fill="#16A085"/>' +
    '<rect class="ty-dug" x="414" y="31" width="30" height="5" rx="2.5" fill="#94A3B8"/>' +
    '<path d="M296 100H436" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="2 5"/>' +
    '<path class="ty-harf" d="M424 62C430 80 420 96 398 96L326 96C312 96 304 88 306 74" pathLength="100" fill="none" stroke="#16324F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle class="ty-nokta" cx="364" cy="110" r="5" fill="#E74C3C"/>' +
    '<circle class="ty-tik" cx="429" cy="33.5" r="7" fill="none" stroke="#F39C12" stroke-width="2.5"/>' +
    '<rect x="258" y="130" width="214" height="6" rx="3" fill="#94A3B8"/>' +
    /* sinyal akışı ve dalgalar */
    '<path class="ty-akis" d="M160 90C198 38 228 34 256 52" fill="none" stroke="#16A085" stroke-width="3.2" stroke-linecap="round"/>' +
    '<g fill="none" stroke="#16A085" stroke-width="2.4" stroke-linecap="round">' +
      '<path class="ty-dalga" d="M172 78a12 12 0 0 1 10 -8"/>' +
      '<path class="ty-dalga d2" d="M176 84a20 20 0 0 1 16 -14"/>' +
      '<path class="ty-dalga d3" d="M180 90a28 28 0 0 1 22 -20"/>' +
    '</g>' +
    /* sandalye */
    '<rect x="28" y="84" width="9" height="52" rx="4" fill="#0E7C66"/>' +
    '<path d="M36 138V172M74 138V172" stroke="#0B5E4E" stroke-width="4" stroke-linecap="round"/>' +
    '<rect x="28" y="128" width="54" height="9" rx="4" fill="#0E7C66"/>' +
    /* bacaklar: oturuyor, diz rahat */
    '<path d="M52 130H98" stroke="#334155" stroke-width="11" stroke-linecap="round"/>' +
    '<path d="M98 132V164" stroke="#334155" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M98 168H112" stroke="#1F2937" stroke-width="7" stroke-linecap="round"/>' +
    '<g class="ty-kalp"><path d="M76 146c-2.6-3.6-8.4-2.2-8 2.4.3 3.6 8 8.4 8 8.4s7.7-4.8 8-8.4c.4-4.6-5.4-6-8-2.4z" fill="#EF4444"/></g>' +
    /* masa */
    '<rect x="86" y="128" width="130" height="7" rx="3" fill="#B7794B"/>' +
    '<path d="M98 135V172M204 135V172" stroke="#9A6440" stroke-width="5" stroke-linecap="round"/>' +
    /* dizüstü: ekranı tahtanın küçüğü. BİLGİSAYAR ⇄ TELEFON (17.10.2026):
       dizüstü (ty-pc) ile öğretmenin elindeki telefon (ty-tel) 14 sn'de bir
       yer değiştirir; tahta sabit. */
    '<g class="ty-pc">' +
    '<path d="M98 128H176L171 122H103Z" fill="#475569"/>' +
    '<rect x="108" y="88" width="58" height="35" rx="3" fill="#1F2937"/>' +
    '<rect x="111" y="91" width="52" height="29" rx="2" fill="#fff"/>' +
    '<g transform="translate(111 91) scale(.2737 .2959) translate(-270 -22)">' +
      '<rect x="278" y="29" width="174" height="9" rx="4.5" fill="#E8F6F2"/>' +
      '<rect x="280" y="31" width="34" height="5" rx="2.5" fill="#16A085"/>' +
      '<rect class="ty-dug a" x="414" y="31" width="30" height="5" rx="2.5" fill="#94A3B8"/>' +
      '<path class="ty-harf a" d="M424 62C430 80 420 96 398 96L326 96C312 96 304 88 306 74" pathLength="100" fill="none" stroke="#16324F" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle class="ty-nokta a" cx="364" cy="110" r="6" fill="#E74C3C"/>' +
      '<circle class="ty-tik a" cx="429" cy="33.5" r="8" fill="none" stroke="#F39C12" stroke-width="3"/>' +
      '<path class="ty-imlec" d="M0 0V22L6 16L11 26L15 24L10 14H18Z" fill="#0F2A43" stroke="#fff" stroke-width="2"/>' +
    '</g>' +
    '</g>' +
    /* telefon: öğretmenin elinde; ekranı tahtanın küçüğü, akış tahtaya bağlanır */
    '<g class="ty-tel">' +
      '<rect x="114" y="84" width="26" height="44" rx="5" fill="#1F2937"/>' +
      '<rect x="116.5" y="89" width="21" height="34" rx="2.5" fill="#fff"/>' +
      '<rect x="123" y="86" width="8" height="1.5" rx=".75" fill="#64748B"/>' +
      '<g transform="translate(116.5 91) scale(.1105) translate(-270 -22)">' +
        '<rect x="278" y="29" width="174" height="9" rx="4.5" fill="#E8F6F2"/>' +
        '<rect x="280" y="31" width="34" height="5" rx="2.5" fill="#16A085"/>' +
        '<rect class="ty-dug a" x="414" y="31" width="30" height="5" rx="2.5" fill="#94A3B8"/>' +
        '<path class="ty-harf a" d="M424 62C430 80 420 96 398 96L326 96C312 96 304 88 306 74" pathLength="100" fill="none" stroke="#16324F" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle class="ty-nokta a" cx="364" cy="110" r="9" fill="#E74C3C"/>' +
        '<circle class="ty-tik a" cx="429" cy="33.5" r="12" fill="none" stroke="#F39C12" stroke-width="5"/>' +
      '</g>' +
      '<path d="M119.5 108H134.5M119.5 112.5H131M119.5 117H133" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path class="ty-akis" d="M140 89C147 88 153 88 160 90" fill="none" stroke="#16A085" stroke-width="3.2" stroke-linecap="round"/>' +
    '</g>' +
    /* öğretmen */
    '<path d="M44 128C42 104 46 90 58 86C70 88 75 100 72 128Z" fill="#2563EB"/>' +
    '<path class="ty-kol" d="M64 96C80 104 94 114 112 121" fill="none" stroke="#2563EB" stroke-width="9" stroke-linecap="round"/>' +
    '<circle class="ty-kol" cx="114" cy="121.5" r="4.6" fill="#F2C9A0"/>' +
    '<circle cx="58" cy="70" r="12" fill="#F2C9A0"/>' +
    '<path d="M46 69C45 55 71 53 70 67C66 62 53 60 46 69Z" fill="#3B2F2F"/>' +
    '<circle cx="63" cy="70" r="1.3" fill="#3B2F2F"/>' +
    '<path d="M61 76q2.5 1.8 5 0" fill="none" stroke="#B9724F" stroke-width="1.4" stroke-linecap="round"/>' +
    /* tahtaya yürümeye gerek yok: masadan tahtaya giden ayak izleri ve "yürüme" işareti */
    '<g fill="#94A3B8">' +
      IZ(136, 190, 'i1') + IZ(158, 198, 'i2') + IZ(180, 190, 'i3') + IZ(202, 198, 'i4') + IZ(224, 190, 'i5') + IZ(246, 198, 'i6') +
    '</g>' +
    '<g class="ty-yasak">' +
      '<circle cx="284" cy="192" r="17" fill="rgba(255,255,255,.88)" stroke="#E74C3C" stroke-width="3.4"/>' +
      '<circle cx="285.6" cy="182.6" r="2.5" fill="#475569"/>' +
      '<path d="M284.6 186.6L283 194.6M283 194.6L279 201M283 194.6L287.6 200.6M284.3 188.6L280 192.2M284.3 188.6L288.6 191.2" fill="none" stroke="#475569" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M272 180L296 204" stroke="#E74C3C" stroke-width="3.4" stroke-linecap="round"/>' +
    '</g>' +
    '</svg>';

  var CIP = function (sim, yazi) {
    return '<span class="ty-cip"><svg viewBox="0 0 24 24" aria-hidden="true">' + sim + '</svg>' + yazi + '</span>';
  };
  /* VURGU (17.10.2026) — öğretmen: "bilgisayar ve telefon değişsin, akıllı
     tahta sabit olsun; vurgu telefonun ve bilgisayarın kullanılabileceği
     kısım". Değişen kelime çizimdeki cihazla aynı anda (14 sn'de bir) döner. */
  var SIM = function (ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; };
  var VURGU = '<div class="ty-vurgu">' +
    '<span class="ty-gizli">Bilgisayarından ya da telefonundan akıllı tahtaya</span>' +
    '<span class="ty-donen" aria-hidden="true">' +
      '<span class="ty-d ty-d1">' + SIM('<rect x="4" y="5" width="16" height="10.5" rx="1.6"/><path d="M2 18.5h20"/>') + 'Bilgisayarından</span>' +
      '<span class="ty-d ty-d2">' + SIM('<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>') + 'Telefonundan</span>' +
    '</span>' +
    '<span class="ty-ok" aria-hidden="true">' + SIM('<path class="ty-okc" d="M3 12h15"/><path d="M14 7l5 5-5 5"/>') + '</span>' +
    '<span class="ty-sabit" aria-hidden="true">' + SIM('<rect x="2.5" y="4" width="19" height="12" rx="1.6"/><path d="M8 20h8M12 16v4"/>') + 'akıllı tahtaya</span>' +
    '</div>';
  /* 22.10.2026: kumanda çipleri öne (yüzen kumanda tuşu, ekran kararmaz, kaldığı yerden) */
  var CIPLER = '<div class="ty-cipler">' + VURGU +
    CIP('<rect x="7" y="9" width="10" height="13.5" rx="2.6"/><path d="M12 12.6v.01M10 17.6h4"/><path class="ty-kd1" d="M9.9 6.4a3 3 0 0 1 4.2 0"/><path class="ty-kd2" d="M7.6 4.1a6.2 6.2 0 0 1 8.8 0"/>', 'Kumanda tuşu') +
    CIP('<path d="M3.5 20.5l9-9"/><circle class="ty-lazer" cx="16.6" cy="7.4" r="2.5"/><path class="ty-isin" d="M16.6 2v1.4M22 7.4h-1.4M20.4 3.6l-1 1M20.4 11.2l-1-1M12.8 3.6l1 1"/>', 'Lazer · büyüteç') +
    CIP('<circle cx="12" cy="12" r="3.8"/><path class="ty-isin" d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.4 5.4l1.6 1.6M17 17l1.6 1.6M5.4 18.6L7 17M17 7l1.6-1.6"/>', 'Ekran kararmaz') +
    CIP('<path d="M19.6 12.4a7.6 7.6 0 1 1-2.3-5.6"/><path d="M19.8 3.8v3.6h-3.6"/><path class="ty-oynat" d="M10.2 9.2l4.6 2.8-4.6 2.8z"/>', 'Kaldığın yerden') +
    CIP('<path d="M3 12h5M16 12h5"/><path d="M8 9v6h3V9zM13 9v6h3V9z"/><path class="ty-kes" d="M5 4l14 16"/>', 'Kablo yok') +
    CIP('<path d="M7 3v11M7 14h10M8 14l-1 7M16 14l1 7"/><path d="M7 10h7"/>', 'Oturarak anlat') +
    CIP('<rect x="2" y="5" width="9" height="7" rx="1.5"/><path d="M4 15h5"/><rect x="13" y="3" width="9" height="11" rx="1.5"/><path class="ty-yanson" d="M11 8.5h2"/>', 'Aynı hesap') +
    '</div>';

  window.KIDEF_SINIFTA_YENI_GORSEL.tahta = SAHNE + CIPLER + '</div>';

  var STIL = [
    '#guncellemeler .gd-gorsel{ margin:4px 0 14px; }',
    '#guncellemeler .gd-gorsel[hidden]{ display:none; }',
    '.ty-kutu{ display:flex; flex-wrap:wrap; align-items:center; gap:10px 16px; }',
    '.ty-svg{ display:block; flex:1 1 300px; width:100%; max-width:340px; height:auto; border-radius:14px; box-shadow:0 2px 10px rgba(15,42,67,.08); }',
    '.ty-akis{ stroke-dasharray:3 9; animation:tyAkis 1s linear infinite; }',
    '@keyframes tyAkis{ to{ stroke-dashoffset:-12; } }',
    '.ty-dalga{ opacity:0; animation:tyDalga 2.4s ease-out infinite; }',
    '.ty-dalga.d2{ animation-delay:.35s; } .ty-dalga.d3{ animation-delay:.7s; }',
    '@keyframes tyDalga{ 0%{ opacity:0; } 30%{ opacity:1; } 100%{ opacity:0; } }',
    '.ty-harf{ stroke-dasharray:100 120; stroke-dashoffset:101; animation:tyHarf 7s ease-in-out infinite; }',
    '.ty-harf.a{ animation-delay:-.25s; }',
    '@keyframes tyHarf{ 0%,10%{ stroke-dashoffset:101; } 42%,82%{ stroke-dashoffset:0; } 92%,100%{ stroke-dashoffset:101; } }',
    '.ty-nokta{ opacity:0; animation:tyNokta 7s ease-in-out infinite; }',
    '.ty-nokta.a{ animation-delay:-.25s; }',
    '@keyframes tyNokta{ 0%,44%{ opacity:0; } 49%,84%{ opacity:1; } 92%,100%{ opacity:0; } }',
    '.ty-tik{ opacity:0; transform-box:fill-box; transform-origin:center; animation:tyTik 7s ease-out infinite; }',
    '.ty-tik.a{ animation-delay:-.25s; }',
    '@keyframes tyTik{ 0%,58%{ opacity:0; transform:scale(.3); } 61%{ opacity:1; } 72%,100%{ opacity:0; transform:scale(2.2); } }',
    '.ty-dug{ animation:tyDug 7s ease-in-out infinite; }',
    '.ty-dug.a{ animation-delay:-.25s; }',
    '@keyframes tyDug{ 0%,60%{ fill:#94A3B8; } 62%,88%{ fill:#F39C12; } 93%,100%{ fill:#94A3B8; } }',
    '.ty-imlec{ animation:tyImlec 7s ease-in-out infinite; }',
    '@keyframes tyImlec{ 0%,46%{ transform:translate(320px,70px); } 58%,74%{ transform:translate(428px,30px); } 90%,100%{ transform:translate(320px,70px); } }',
    '.ty-kol{ transform-origin:64px 96px; animation:tyKol 3.5s ease-in-out infinite; }',
    '@keyframes tyKol{ 0%,100%{ transform:rotate(0); } 50%{ transform:rotate(-3deg); } }',
    '.ty-kalp{ transform-box:fill-box; transform-origin:center; animation:tyKalp 1.6s ease-in-out infinite; }',
    '@keyframes tyKalp{ 0%,100%{ transform:scale(1); } 45%{ transform:scale(1.22); } }',
    '.ty-iz{ opacity:0; animation:tyIz 7s ease-in-out infinite; }',
    '.ty-iz.i2{ animation-delay:.2s; } .ty-iz.i3{ animation-delay:.4s; } .ty-iz.i4{ animation-delay:.6s; } .ty-iz.i5{ animation-delay:.8s; } .ty-iz.i6{ animation-delay:1s; }',
    '@keyframes tyIz{ 0%,6%{ opacity:0; } 12%,62%{ opacity:.7; } 70%,100%{ opacity:0; } }',
    '.ty-yasak{ opacity:0; transform-box:fill-box; transform-origin:center; animation:tyYasak 7s ease-in-out infinite; }',
    '@keyframes tyYasak{ 0%,34%{ opacity:0; transform:scale(.5); } 40%,64%{ opacity:1; transform:scale(1); } 72%,100%{ opacity:0; transform:scale(1); } }',
    '.ty-cipler{ flex:1 1 170px; display:flex; flex-wrap:wrap; align-content:center; gap:8px; }',
    '.ty-cip{ display:inline-flex; align-items:center; gap:7px; padding:6px 13px 6px 9px; border-radius:999px; background:#E8F6F2; color:#0E7C66;',
    '  border:1px solid #BFE6DE; font-weight:800; font-size:17px; line-height:1.25; }',
    '.ty-cip svg{ width:21px; height:21px; flex:none; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;',
    '  animation:tyCip 2.8s ease-in-out infinite; }',
    '.ty-cip:nth-child(2) svg{ animation-delay:.4s; } .ty-cip:nth-child(3) svg{ animation-delay:.8s; }',
    '.ty-cip:nth-child(4) svg{ animation-delay:1.2s; } .ty-cip:nth-child(5) svg{ animation-delay:1.6s; } .ty-cip:nth-child(6) svg{ animation-delay:2s; } .ty-cip:nth-child(7) svg{ animation-delay:2.4s; }',
    /* 22.10.2026: kumanda dalgaları yanıp söner, güneş ışınları nefes alır, oynat üçgeni dolar */
    '.ty-kd1{ animation:tyKd 1.6s ease-in-out infinite; } .ty-kd2{ animation:tyKd 1.6s ease-in-out .3s infinite; }',
    '@keyframes tyKd{ 0%,100%{ opacity:.25; } 45%{ opacity:1; } }',
    '.ty-isin{ animation:tyIsin 2.4s ease-in-out infinite; }',
    '.ty-lazer{ fill:#ef4444; stroke:#ef4444; }',
    '.ty-cip:nth-child(8) svg{ animation-delay:2.8s; }',
    '@keyframes tyIsin{ 0%,100%{ opacity:.45; } 50%{ opacity:1; } }',
    '.ty-oynat{ fill:currentColor; fill-opacity:0; animation:tyOynat 2.4s ease-in-out infinite; }',
    '@keyframes tyOynat{ 0%,40%{ fill-opacity:0; } 60%,100%{ fill-opacity:1; } }',
    '@keyframes tyCip{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-2px); } }',
    '.ty-kes{ stroke:#E74C3C; }',
    '.ty-yanson{ animation:tyYanson 1.2s ease-in-out infinite; }',
    '@keyframes tyYanson{ 50%{ opacity:.2; } }',
    /* bilgisayar ⇄ telefon (14 sn; harf çizimi 7 sn — değişim harf silinirken) */
    '.ty-pc{ animation:tyPc 14s ease-in-out infinite; }',
    '.ty-tel{ opacity:0; animation:tyTel 14s ease-in-out infinite; }',
    '@keyframes tyPc{ 0%,46%{ opacity:1; } 50%,96%{ opacity:0; } 100%{ opacity:1; } }',
    '@keyframes tyTel{ 0%,46%{ opacity:0; } 50%,96%{ opacity:1; } 100%{ opacity:0; } }',
    '.ty-vurgu{ flex:1 1 100%; display:flex; flex-wrap:wrap; align-items:center; gap:6px 9px; margin:0 0 4px; color:#0F2A43;',
    '  font-weight:900; font-size:21px; line-height:1.25; }',
    '.ty-vurgu svg{ width:23px; height:23px; flex:none; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }',
    '.ty-donen{ display:inline-grid; }',
    '.ty-d{ grid-area:1/1; display:inline-flex; align-items:center; gap:7px; padding:6px 13px 6px 10px; border-radius:12px;',
    '  background:#FFF1D6; color:#B45309; border:1.5px solid #F6C878; box-shadow:0 3px 10px rgba(180,83,9,.14); }',
    '.ty-d1{ animation:tyD1 14s ease-in-out infinite; }',
    '.ty-d2{ opacity:0; animation:tyD2 14s ease-in-out infinite; }',
    '@keyframes tyD1{ 0%,46%{ opacity:1; transform:none; } 50%,96%{ opacity:0; transform:translateY(-7px); } 100%{ opacity:1; transform:none; } }',
    '@keyframes tyD2{ 0%,46%{ opacity:0; transform:translateY(7px); } 50%,96%{ opacity:1; transform:none; } 100%{ opacity:0; transform:translateY(7px); } }',
    '.ty-ok{ display:inline-flex; color:#16A085; }',
    '.ty-okc{ stroke-dasharray:3 4; animation:tyAkis 1s linear infinite; }',
    '.ty-sabit{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px 6px 9px; border-radius:12px; background:#0F2A43; color:#fff; }',
    '.ty-gizli{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }',
    '@media (max-width:860px){ .ty-vurgu{ font-size:17px; } .ty-vurgu svg{ width:19px; height:19px; } }',
    '@media (max-width:860px){ .ty-cip{ font-size:14px; padding:5px 11px 5px 8px; } .ty-cip svg{ width:18px; height:18px; } }',
    '@media (prefers-reduced-motion:reduce){',
    '  .ty-svg *, .ty-cip svg, .ty-cip svg *{ animation:none !important; }',
    '  .ty-kd1, .ty-kd2, .ty-isin{ opacity:1 !important; } .ty-oynat{ fill-opacity:1 !important; }',
    '  .ty-harf{ stroke-dashoffset:0; } .ty-nokta, .ty-iz{ opacity:.8; } .ty-yasak{ opacity:1; } .ty-imlec{ transform:translate(428px,30px); }',
    '  .ty-d, .ty-okc{ animation:none !important; opacity:1 !important; transform:none !important; } .ty-donen{ display:inline-flex; gap:6px; }',
    '}'
  ].join('\n');
  try {
    if (!document.getElementById('syGorselStil')) {
      var s = document.createElement('style');
      s.id = 'syGorselStil';
      s.textContent = STIL;
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (e) { }
})();

/* ---------------------------------------------------------------------------
   GÖREV VE ÖĞRENCİ GELİŞİMİ GÖRSELLERİ (08.11.2026) — öğretmen: "sitede öğrenciyi
   kendi hesabıyla eşleştiren öğretmenlerin tüm öğrencilerinin sitede aldığı puanları
   ve geçirdikleri süreyi, öğrencilere dijital ödev olarak görev gönderebileceklerini
   vurgulayalım" · "görev gönderme ve öğrenci etkinliklerini kontrol etme kısmı için
   svg animasyonlar ekle".
     g: 'gorev'    — öğretmenin ekranından ödev uçar, öğrencilerin telefonuna düşer,
                     yapılır (✓), sonuçlar öğretmenin ekranına döner (10 sn döngü)
     g: 'etkinlik' — Etkinlikler tablosu: rekor halkaları dolar, gelişim çizgisi
                     çizilir, saat işler; öğrencinin telefonundan yeni sonuç gelince
                     satır kendiliğinden güncellenir (9 sn döngü)
   Biçim tahta görseliyle ortak (.ty-kutu, .ty-svg, .ty-cipler, .ty-cip, .ty-vurgu);
   bu görsellere özgü olanlar gy- önekli. «Hareketi azalt»ta son hâl durağan görünür.
   --------------------------------------------------------------------------- */
(function () {
  var G = window.KIDEF_SINIFTA_YENI_GORSEL = window.KIDEF_SINIFTA_YENI_GORSEL || {};
  var SIM = function (ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; };
  var CIP = function (ic, yazi) { return '<span class="ty-cip">' + SIM(ic) + yazi + '</span>'; };

  /* ------------------------------------------------ 1) GÖREV GÖNDER (10 sn) */
  /* öğrenci telefonu: rozet, görev satırı, ilerleme, ✓, altında öğrenci */
  var TEL = function (x, n, renk) {
    return '<g class="gy-tel">' +
      '<rect x="' + x + '" y="30" width="42" height="80" rx="7" fill="#1F2937"/>' +
      '<rect x="' + (x + 3) + '" y="37" width="36" height="66" rx="3" fill="#fff"/>' +
      '<rect x="' + (x + 15) + '" y="33" width="12" height="1.6" rx=".8" fill="#64748B"/>' +
      '<rect x="' + (x + 7) + '" y="42" width="28" height="6" rx="3" fill="#FDEBD0"/>' +
      '<g class="gy-satir n' + n + '"><rect x="' + (x + 7) + '" y="53" width="28" height="14" rx="3" fill="#FFF7ED" stroke="#F6C878" stroke-width="1.2"/>' +
        '<path d="M' + (x + 11) + ' 58.5h13M' + (x + 11) + ' 62.5h8" stroke="#F39C12" stroke-width="1.6" stroke-linecap="round"/></g>' +
      '<rect x="' + (x + 7) + '" y="74" width="28" height="6" rx="3" fill="#EEF2F7"/>' +
      '<rect class="gy-pb n' + n + '" x="' + (x + 7) + '" y="74" width="28" height="6" rx="3" fill="#16A085"/>' +
      '<g class="gy-tik n' + n + '"><circle cx="' + (x + 21) + '" cy="92" r="7.5" fill="#16A085"/>' +
        '<path d="M' + (x + 17.4) + ' 92.2l2.6 2.6 5-5.2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<g class="gy-rozet n' + n + '"><circle cx="' + (x + 39) + '" cy="32" r="7" fill="#E74C3C" stroke="#fff" stroke-width="2"/>' +
        '<path d="M' + (x + 38) + ' 29.4l1.6-1.2v7.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      /* öğrenci */
      '<circle cx="' + (x + 21) + '" cy="136" r="11" fill="#F2C9A0"/>' +
      '<path d="M' + (x + 10) + ' 133C' + (x + 9) + ' 119 ' + (x + 33) + ' 119 ' + (x + 32) + ' 133C' + (x + 27) + ' 127 ' + (x + 16) + ' 126 ' + (x + 10) + ' 133Z" fill="#3B2F2F"/>' +
      '<path d="M' + (x + 1) + ' 176C' + (x + 1) + ' 158 ' + (x + 10) + ' 150 ' + (x + 21) + ' 150C' + (x + 32) + ' 150 ' + (x + 41) + ' 158 ' + (x + 41) + ' 176Z" fill="' + renk + '"/>' +
      '</g>';
  };
  /* öğretmenin ekranındaki sonuç satırı: öğrenci rengi, dolan çubuk, ✓, saat */
  var SONUC = function (y, n, renk, oran) {
    return '<circle cx="54" cy="' + (y + 4) + '" r="7" fill="' + renk + '"/>' +
      '<rect x="67" y="' + y + '" width="80" height="8" rx="4" fill="#EEF2F7"/>' +
      '<rect class="gy-sb n' + n + '" x="67" y="' + y + '" width="' + Math.round(80 * oran) + '" height="8" rx="4" fill="' + renk + '"/>' +
      '<g class="gy-st n' + n + '"><circle cx="164" cy="' + (y + 4) + '" r="6.5" fill="#E8F6F2" stroke="#16A085" stroke-width="1.4"/>' +
        '<path d="M164 ' + (y + 0.6) + 'v3.6l2.2 1.6" fill="none" stroke="#16A085" stroke-width="1.5" stroke-linecap="round"/></g>';
  };
  var GOREV_SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg gy-svg" viewBox="0 0 480 214" role="img" aria-label="Öğretmen ekranından ödevi gönderiyor; ödev öğrencilerin telefonuna düşüyor, öğrenciler yapıyor, sonuçlar öğretmenin ekranına geri geliyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#FBF6F1"/>' +
    '<path d="M0 176H480V198a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16Z" fill="#F6EADF"/>' +
    '<path d="M0 176H480" stroke="#EEDBC9" stroke-width="2"/>' +
    /* öğretmenin dizüstü bilgisayarı */
    '<path d="M10 178H214L204 167H20Z" fill="#475569"/>' +
    '<rect x="30" y="38" width="164" height="128" rx="8" fill="#1F2937"/>' +
    '<rect x="37" y="45" width="150" height="114" rx="4" fill="#fff"/>' +
    /* ekran A: görev kartı */
    '<g class="gy-ekran-a">' +
      '<path d="M37 49a4 4 0 0 1 4-4H183a4 4 0 0 1 4 4V66H37Z" fill="#F39C12"/>' +
      '<g transform="translate(46 49) scale(.55)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M12 2c3.2 2.4 4.8 6 4.8 9.6L15 15H9L7.2 11.6C7.2 8 8.8 4.4 12 2z"/><circle cx="12" cy="9" r="1.8"/><path d="M9.4 18.4L8 22M14.6 18.4L16 22"/></g>' +
      '<rect x="64" y="52" width="62" height="7" rx="3.5" fill="#fff" opacity=".9"/>' +
      '<rect x="46" y="76" width="22" height="22" rx="6" fill="#7C3AED"/>' +
      '<path d="M57 81.5l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="#FDE68A"/>' +
      '<rect x="76" y="79" width="84" height="7" rx="3.5" fill="#CBD5E1"/>' +
      '<rect x="76" y="90" width="54" height="6" rx="3" fill="#E2E8F0"/>' +
      /* hedef: sınıf ve tek öğrenci çipleri, son tarih */
      '<rect x="46" y="106" width="44" height="16" rx="8" fill="#FDEBD0"/>' +
      '<g fill="#B45309"><circle cx="58" cy="112" r="2.6"/><path d="M53.6 119.2a4.4 4.4 0 0 1 8.8 0z"/><circle cx="66" cy="112" r="2.6"/><path d="M61.6 119.2a4.4 4.4 0 0 1 8.8 0z"/></g>' +
      '<rect x="74" y="111" width="11" height="5" rx="2.5" fill="#F6C878"/>' +
      '<rect x="96" y="106" width="44" height="16" rx="8" fill="#EDE9FE"/>' +
      '<g fill="none" stroke="#6D28D9" stroke-width="1.6" stroke-linecap="round"><rect x="103" y="109" width="11" height="10" rx="2"/><path d="M103 112.6h11M106 107.4v3M111 107.4v3"/></g>' +
      '<rect x="118" y="111" width="15" height="5" rx="2.5" fill="#C4B5FD"/>' +
      '<g class="gy-gonder"><rect x="46" y="130" width="132" height="22" rx="11" fill="#D84315"/>' +
        '<path d="M103 136.6l15 4.4-15 4.4 2.8-4.4z" fill="#fff"/><path d="M105.8 141h12" stroke="#FAD7C8" stroke-width="1.2"/>' +
        '<rect x="123" y="139" width="24" height="4.4" rx="2.2" fill="#fff" opacity=".85"/></g>' +
    '</g>' +
    /* ekran B: sonuçlar canlı */
    '<g class="gy-ekran-b">' +
      '<path d="M37 49a4 4 0 0 1 4-4H183a4 4 0 0 1 4 4V66H37Z" fill="#7B1FA2"/>' +
      '<g transform="translate(46 49.5) scale(.55)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></g>' +
      '<rect x="64" y="52" width="54" height="7" rx="3.5" fill="#fff" opacity=".9"/>' +
      '<circle class="gy-canli" cx="174" cy="55.5" r="4" fill="#4ADE80"/>' +
      SONUC(78, 1, '#16A085', .92) + SONUC(104, 2, '#2563EB', .78) + SONUC(130, 3, '#F39C12', .64) +
    '</g>' +
    /* uçuş yolu ve kâğıt uçak (ödev) */
    '<path d="M180 120C222 62 270 40 318 58" fill="none" stroke="#F39C12" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round" opacity=".55"/>' +
    '<g class="gy-ucak"><path d="M-10 -7L12 0L-10 7L-6 0Z" fill="#D84315"/><path d="M-6 0H12" stroke="#FAD7C8" stroke-width="1.4"/></g>' +
    /* sonuçlar geri döner */
    '<circle class="gy-geri n1" r="5" fill="#16A085"/>' +
    '<circle class="gy-geri n2" r="5" fill="#2563EB"/>' +
    '<circle class="gy-geri n3" r="5" fill="#F39C12"/>' +
    /* öğrenciler */
    TEL(310, 1, '#16A085') + TEL(366, 2, '#2563EB') + TEL(422, 3, '#F39C12') +
    '</svg>';

  var ADIM = function (n, ic, yazi) {
    return '<span class="gy-adim a' + n + '">' + SIM(ic) + yazi + '</span>';
  };
  var OK = '<span class="gy-ok" aria-hidden="true">' + SIM('<path class="ty-okc" d="M3 12h15"/><path d="M14 7l5 5-5 5"/>') + '</span>';
  /* svg'nin yanında dikey üç adım (telefonda yan yana); sahneyle aynı 10 sn'de sırayla parlar */
  var GOREV_VURGU = '<div class="ty-vurgu gy-vurgu gy-yan">' +
    '<span class="ty-gizli">Ödevi gönder, öğrencin yapsın, sonuç sana gelsin</span>' +
    ADIM(1, '<path d="M3 11.5L21 3l-6.5 18-3.4-7.3z"/><path d="M11.1 13.7L21 3"/>', 'Gönder') + OK +
    ADIM(2, '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M9.8 12.4l1.6 1.6 3-3.2"/>', 'Öğrenci yapar') + OK +
    ADIM(3, '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>', 'Sonuç sende') +
    '</div>';
  var GOREV_CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<circle cx="8" cy="8" r="3"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/><circle class="gy-c-tek" cx="17.5" cy="9.5" r="2.4"/><path class="gy-c-tek" d="M14 20a3.8 3.8 0 0 1 7.2-1.6"/>', 'Sınıfa ya da tek öğrenciye') +
    CIP('<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8 2.8v4M16 2.8v4"/><path class="gy-c-gun" d="M8.5 14.6l2.2 2.2 4.6-4.6"/>', 'Son tarih') +
    CIP('<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M10.6 18.6h2.8"/><circle class="gy-c-rozet" cx="17.4" cy="5.6" r="2.6"/>', '«Görevlerim»de') +
    CIP('<path d="M3 12h3.6l2.4-6 4 12 2.4-6H21"/><circle class="gy-c-canli" cx="21" cy="12" r="1.6"/>', 'Canlı sonuç') +
    CIP('<rect x="3" y="4" width="18" height="16" rx="2.2"/><path d="M3 9.4h18M9.4 9.4V20"/><path class="gy-c-not" d="M12.6 15l2 2 4-4"/>', 'Notlara işle') +
    '</div>';
  G.gorev = GOREV_SAHNE + GOREV_VURGU + GOREV_CIPLER + '</div>';

  /* ------------------------------------------- 2) ÖĞRENCİ GELİŞİMİ (9 sn) */
  /* Etkinlikler tablosunda bir satır: öğrenci, rekor halkası + yüzde, gelişim çizgisi, saat + süre */
  var SATIR = function (y, n, renk, rekor, cizgi, sure, yeni) {
    return '<g class="gy-sat n' + n + '">' +
      '<circle cx="42" cy="' + y + '" r="9" fill="' + renk + '"/>' +
      '<rect x="57" y="' + (y - 6) + '" width="46" height="6" rx="3" fill="#CBD5E1"/>' +
      '<rect x="57" y="' + (y + 3) + '" width="30" height="5" rx="2.5" fill="#E2E8F0"/>' +
      '<circle cx="128" cy="' + y + '" r="10" fill="none" stroke="#EEF2F7" stroke-width="5"/>' +
      '<circle class="gy-halka n' + n + '" cx="128" cy="' + y + '" r="10" fill="none" stroke="' + renk + '" stroke-width="5" stroke-linecap="round" pathLength="100" transform="rotate(-90 128 ' + y + ')"/>' +
      '<text class="gy-yuzde n' + n + (yeni ? ' gy-eski' : '') + '" x="145" y="' + (y + 5.5) + '">' + rekor + '</text>' +
      (yeni ? '<text class="gy-yuzde gy-yeni n' + n + '" x="145" y="' + (y + 5.5) + '">' + yeni + '</text>' : '') +
      '<path class="gy-cizgi n' + n + '" d="' + cizgi + '" pathLength="100" fill="none" stroke="' + renk + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="251" cy="' + y + '" r="7.5" fill="#fff" stroke="#64748B" stroke-width="1.8"/>' +
      '<path class="gy-akrep n' + n + '" d="M251 ' + y + 'V' + (y - 5) + '" stroke="#64748B" stroke-width="1.8" stroke-linecap="round"/>' +
      '<text class="gy-sure n' + n + '" x="263" y="' + (y + 5.5) + '">' + sure + '</text>' +
      '</g>';
  };
  var ETK_SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg gy-svg" viewBox="0 0 480 214" role="img" aria-label="Etkinlikler tablosu: her öğrencinin rekoru, gelişim çizgisi ve çalıştığı süre; öğrenci telefondan çalıştıkça tablo kendiliğinden güncelleniyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#F4F8FB"/>' +
    /* öğretmenin ekranı */
    '<rect x="14" y="12" width="318" height="166" rx="9" fill="#1F2937"/>' +
    '<rect x="21" y="19" width="304" height="152" rx="4" fill="#fff"/>' +
    '<path d="M150 178h46l6 18h-58z" fill="#94A3B8"/><rect x="130" y="194" width="86" height="6" rx="3" fill="#64748B"/>' +
    '<path d="M21 23a4 4 0 0 1 4-4H321a4 4 0 0 1 4 4V40H21Z" fill="#E67E22"/>' +
    '<g transform="translate(30 22) scale(.62)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="14.6" cy="4.4" r="2.2" fill="#fff"/><path d="M6 21l3.6-6.2 3.4 2.6V22M9.6 14.8l1.8-5.6 4.6 1.6 2.6 3.4M11.4 9.2L7.4 11"/></g>' +
    '<rect x="50" y="26" width="64" height="7" rx="3.5" fill="#fff" opacity=".9"/>' +
    '<circle class="gy-canli" cx="312" cy="29.5" r="4" fill="#4ADE80"/>' +
    /* sütun başları (simge): rekor kupası, çizgi, saat */
    '<g fill="none" stroke="#94A3B8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M121 47h14v4a7 7 0 0 1-14 0zM124 58h8M128 55v3"/>' +
      '<path d="M180 58l9-7 7 4 10-8 8 3"/>' +
      '<circle cx="251" cy="52" r="5.5"/><path d="M251 49v3l2 1.4"/></g>' +
    '<path d="M27 64H319" stroke="#EEF2F7" stroke-width="1.5"/>' +
    '<rect class="gy-parla" x="25" y="130" width="296" height="32" rx="6" fill="#FEF3C7"/>' +
    SATIR(80, 1, '#16A085', '%92', 'M178 88l10-6 9 2 10-9 10 1 10-9', '18 dk') +
    SATIR(113, 2, '#2563EB', '%76', 'M178 119l10-4 9 3 10-7 10 3 10-6', '9 dk') +
    SATIR(146, 3, '#F39C12', '%58', 'M178 153l10-2 9-3 10 2 10-5 10-1', '4 dk', '%70') +
    '<g class="gy-arti"><rect x="293" y="139" width="28" height="15" rx="7.5" fill="#16A085"/><path d="M298.6 146.5h6M301.6 143.5v6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="307" y="144" width="9" height="5" rx="2.5" fill="#fff"/></g>' +
    /* öğrencinin telefonu: etkinlik oynanıyor, sonuç tabloya akar */
    '<path class="ty-akis gy-hat" d="M384 118C362 136 346 146 330 146" fill="none" stroke="#16A085" stroke-width="3" stroke-linecap="round"/>' +
    '<circle class="gy-damla n1" r="3.4" fill="#16A085"/><circle class="gy-damla n2" r="3.4" fill="#16A085"/><circle class="gy-damla n3" r="3.4" fill="#16A085"/>' +
    '<rect x="388" y="34" width="70" height="118" rx="10" fill="#1F2937"/>' +
    '<rect x="393" y="43" width="60" height="100" rx="4" fill="#fff"/>' +
    '<rect x="417" y="38" width="12" height="2" rx="1" fill="#64748B"/>' +
    '<rect x="399" y="49" width="48" height="8" rx="4" fill="#F3E8FF"/>' +
    '<rect class="gy-sure-cubuk" x="399" y="49" width="48" height="8" rx="4" fill="#C084FC"/>' +
    '<g class="gy-kare k1"><rect x="399" y="64" width="22" height="22" rx="5" fill="#E0F2FE"/><path d="M406 75h8" stroke="#0284C7" stroke-width="2.4" stroke-linecap="round"/></g>' +
    '<g class="gy-kare k2"><rect x="425" y="64" width="22" height="22" rx="5" fill="#E0F2FE"/><circle cx="436" cy="75" r="3.6" fill="none" stroke="#0284C7" stroke-width="2.2"/></g>' +
    '<g class="gy-kare k3"><rect x="399" y="90" width="22" height="22" rx="5" fill="#E0F2FE"/><path d="M406 101l3.4-5 3.4 5" fill="none" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '<g class="gy-kare k4"><rect x="425" y="90" width="22" height="22" rx="5" fill="#E0F2FE"/><path d="M431 101h10M436 96v10" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round"/></g>' +
    '<g class="gy-yildiz"><path d="M423 120.5l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z" fill="#FBBF24"/></g>' +
    '<ellipse cx="452" cy="146" rx="9" ry="13" fill="#F2C9A0" transform="rotate(-18 452 146)"/>' +
    '</svg>';

  var DONEN = function (n, ic, yazi) {
    return '<span class="gy-d gy-d' + n + '">' + SIM(ic) + yazi + '</span>';
  };
  var ETK_VURGU = '<div class="ty-vurgu gy-vurgu gy-yan">' +
    '<span class="ty-gizli">Hesabıyla bağlı öğrencinin puanı, süresi ve gelişimi senin ekranında</span>' +
    '<span class="gy-sabit-sol" aria-hidden="true">' + SIM('<circle cx="12" cy="7.6" r="4"/><path d="M4.6 21a7.4 7.4 0 0 1 14.8 0"/><path class="gy-bag" d="M16.6 13.6l1.6 1.6 3.2-3.4"/>') + 'Hesabıyla bağlı öğrencinin</span>' +
    '<span class="gy-donen" aria-hidden="true">' +
      DONEN(1, '<path d="M6 3h12v4.6a6 6 0 0 1-12 0zM9 20h6M12 13.6V20"/><path d="M6 5H3v1.6A3.4 3.4 0 0 0 6 10M18 5h3v1.6a3.4 3.4 0 0 1-3 3.4"/>', 'puanı') +
      DONEN(2, '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.8 2M9.6 2.8h4.8"/>', 'süresi') +
      DONEN(3, '<path d="M3 17l5.4-5.4 4 4L21 7"/><path d="M15.4 7H21v5.6"/>', 'gelişimi') +
    '</span>' +
    '<span class="ty-sabit" aria-hidden="true">' + SIM('<rect x="2.5" y="4" width="19" height="12" rx="1.6"/><path d="M8 20h8M12 16v4"/>') + 'senin ekranında</span>' +
    '</div>';
  var ETK_CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<path d="M6 3h12v4.6a6 6 0 0 1-12 0zM9 20h6M12 13.6V20"/><path class="gy-c-parla" d="M6 5H3v1.6A3.4 3.4 0 0 0 6 10M18 5h3v1.6a3.4 3.4 0 0 1-3 3.4"/>', 'Rekor') +
    CIP('<path class="gy-c-cizgi" d="M3 17l5.4-5.4 4 4L21 7"/><path d="M15.4 7H21v5.6"/>', 'Gelişim çizgisi') +
    CIP('<circle cx="12" cy="13" r="8"/><path class="gy-c-akrep" d="M12 13V8.6"/><path d="M9.6 2.8h4.8"/>', 'Çalışma süresi') +
    CIP('<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8 2.8v4M16 2.8v4"/><path class="gy-c-gun" d="M7.4 15.4h3M13.6 15.4h3"/>', 'Son çalıştığı gün') +
    CIP('<circle cx="12" cy="12" r="8.6" stroke-dasharray="3 3.2"/><path d="M9 12h6"/>', 'Açmadıkları da görünür') +
    CIP('<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20.4 3.6v3.8h-3.8"/>', 'Kendiliğinden güncellenir') +
    '</div>';
  G.etkinlik = ETK_SAHNE + ETK_VURGU + ETK_CIPLER + '</div>';

  var STIL = [
    /* ortak */
    '.gy-svg text{ font-family:inherit; font-weight:900; font-size:15px; fill:#1F2937; }',
    '.gy-canli{ animation:gyCanli 1.4s ease-in-out infinite; }',
    '@keyframes gyCanli{ 0%,100%{ opacity:1; } 50%{ opacity:.25; } }',
    /* 1) GÖREV — 10 sn döngü */
    '.gy-ekran-a{ opacity:0; animation:gyEkranA 10s ease-in-out infinite; }',
    '.gy-ekran-b{ animation:gyEkranB 10s ease-in-out infinite; }',
    '@keyframes gyEkranA{ 0%,47%{ opacity:1; } 51%,95%{ opacity:0; } 99%,100%{ opacity:1; } }',
    '@keyframes gyEkranB{ 0%,47%{ opacity:0; } 51%,95%{ opacity:1; } 99%,100%{ opacity:0; } }',
    '.gy-gonder{ transform-box:fill-box; transform-origin:center; animation:gyGonder 10s ease-in-out infinite; }',
    '@keyframes gyGonder{ 0%,3%{ transform:scale(1); } 6%{ transform:scale(1.07); } 9%{ transform:scale(.94); } 12%,100%{ transform:scale(1); } }',
    '.gy-ucak{ opacity:0; animation:gyUcak 10s linear infinite; }',
    '@keyframes gyUcak{ 0%,9%{ opacity:0; transform:translate(180px,120px) rotate(-52deg) scale(.6); }',
    '  11%{ opacity:1; transform:translate(188px,109px) rotate(-50deg) scale(1); }',
    '  15%{ transform:translate(212px,80px) rotate(-38deg); } 20%{ transform:translate(246px,59px) rotate(-21deg); }',
    '  25%{ transform:translate(282px,51.5px) rotate(-1deg); } 29%{ opacity:1; transform:translate(312px,56px) rotate(16deg) scale(1); }',
    '  31%,100%{ opacity:0; transform:translate(322px,60px) rotate(20deg) scale(.4); } }',
    '.gy-rozet{ transform-box:fill-box; transform-origin:center; animation:gyRozet 10s ease-out infinite both; }',
    '.gy-rozet.n2{ animation-delay:.15s; } .gy-rozet.n3{ animation-delay:.3s; }',
    '@keyframes gyRozet{ 0%,29%{ opacity:0; transform:scale(0); } 32%{ opacity:1; transform:scale(1.3); } 35%,90%{ opacity:1; transform:scale(1); } 95%,100%{ opacity:0; transform:scale(1); } }',
    '.gy-satir{ animation:gySatir 10s ease-out infinite both; }',
    '.gy-satir.n2{ animation-delay:.15s; } .gy-satir.n3{ animation-delay:.3s; }',
    '@keyframes gySatir{ 0%,30%{ opacity:0; } 34%,90%{ opacity:1; } 95%,100%{ opacity:0; } }',
    '.gy-pb{ transform-box:fill-box; transform-origin:0 50%; animation:gyPb 10s ease-in-out infinite both; }',
    '.gy-pb.n2{ animation-delay:.25s; } .gy-pb.n3{ animation-delay:.5s; }',
    '@keyframes gyPb{ 0%,36%{ transform:scaleX(0); } 48%,90%{ transform:scaleX(1); } 95%,100%{ transform:scaleX(0); } }',
    '.gy-tik{ transform-box:fill-box; transform-origin:center; animation:gyTik 10s ease-out infinite both; }',
    '.gy-tik.n2{ animation-delay:.25s; } .gy-tik.n3{ animation-delay:.5s; }',
    '@keyframes gyTik{ 0%,48%{ opacity:0; transform:scale(.2); } 51%{ opacity:1; transform:scale(1.25); } 54%,90%{ opacity:1; transform:scale(1); } 95%,100%{ opacity:0; transform:scale(1); } }',
    '.gy-geri{ opacity:0; animation:gyGeri1 10s ease-in-out infinite both; }',
    '.gy-geri.n2{ animation-name:gyGeri2; } .gy-geri.n3{ animation-name:gyGeri3; }',
    '@keyframes gyGeri1{ 0%,55%{ opacity:0; transform:translate(331px,92px); } 56%{ opacity:1; } 61%{ transform:translate(258px,64px); } 65%{ opacity:1; transform:translate(176px,82px); } 66%,100%{ opacity:0; transform:translate(176px,82px); } }',
    '@keyframes gyGeri2{ 0%,57%{ opacity:0; transform:translate(387px,92px); } 58%{ opacity:1; } 63%{ transform:translate(282px,70px); } 67%{ opacity:1; transform:translate(176px,108px); } 68%,100%{ opacity:0; transform:translate(176px,108px); } }',
    '@keyframes gyGeri3{ 0%,59%{ opacity:0; transform:translate(443px,92px); } 60%{ opacity:1; } 65%{ transform:translate(306px,78px); } 69%{ opacity:1; transform:translate(176px,134px); } 70%,100%{ opacity:0; transform:translate(176px,134px); } }',
    '.gy-sb{ transform-box:fill-box; transform-origin:0 50%; animation:gySb 10s ease-out infinite both; }',
    '.gy-sb.n2{ animation-delay:.2s; } .gy-sb.n3{ animation-delay:.4s; }',
    '@keyframes gySb{ 0%,64%{ transform:scaleX(0); } 72%,96%{ transform:scaleX(1); } 100%{ transform:scaleX(0); } }',
    '.gy-st{ transform-box:fill-box; transform-origin:center; animation:gySt 10s ease-out infinite both; }',
    '.gy-st.n2{ animation-delay:.2s; } .gy-st.n3{ animation-delay:.4s; }',
    '@keyframes gySt{ 0%,70%{ opacity:0; transform:scale(.3); } 74%,96%{ opacity:1; transform:scale(1); } 100%{ opacity:0; } }',
    /* yerleşim: görsel ile yanındaki dikey vurgu üstte, çipler altta tam genişlik (kâğıt sabit boy:
       animasyon ilk bakışta görünsün) */
    '.gy-kutu{ align-items:center; }',
    '.gy-kutu .ty-svg{ max-width:330px; }',
    '.gy-yan{ flex:1 1 160px; flex-direction:column; flex-wrap:nowrap; align-items:flex-start; gap:4px; margin:0; font-size:18px; }',
    '.gy-yan > span{ max-width:100%; }',
    '.gy-kutu .gy-cipler{ flex:1 1 100%; }',
    '@media (max-width:860px){ .gy-yan{ font-size:15px; } }',
    /* üç adım: Gönder → Öğrenci yapar → Sonuç sende (sahneyle aynı 10 sn) */
    '.gy-adim{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px 6px 9px; border-radius:12px; background:#F1F5F9; color:#64748B;',
    '  border:1.5px solid #E2E8F0; animation:gyAdim1 10s ease-in-out infinite; }',
    '.gy-adim.a2{ animation-name:gyAdim2; } .gy-adim.a3{ animation-name:gyAdim3; }',
    '@keyframes gyAdim1{ 0%,30%{ background:#FFF1D6; color:#B45309; border-color:#F6C878; transform:translateY(-2px); } 34%,96%{ background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none; } 100%{ background:#FFF1D6; color:#B45309; border-color:#F6C878; transform:translateY(-2px); } }',
    '@keyframes gyAdim2{ 0%,30%{ background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none; } 34%,54%{ background:#E8F6F2; color:#0E7C66; border-color:#A9DFCB; transform:translateY(-2px); } 58%,100%{ background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none; } }',
    '@keyframes gyAdim3{ 0%,54%{ background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none; } 58%,94%{ background:#F3E8FF; color:#7B1FA2; border-color:#D8B4FE; transform:translateY(-2px); } 98%,100%{ background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none; } }',
    '.gy-ok{ display:inline-flex; color:#94A3B8; margin-inline-start:16px; }',
    '.gy-ok svg{ width:19px; height:19px; transform:rotate(90deg); }',
    /* çip simgelerinin küçük hareketleri */
    '.gy-c-tek{ animation:gyYanSon 2s ease-in-out infinite; }',
    '.gy-c-gun{ stroke-dasharray:12; animation:gyCizC 2.6s ease-in-out infinite; }',
    '.gy-c-rozet{ fill:#E74C3C; stroke:#E74C3C; transform-box:fill-box; transform-origin:center; animation:gyNabiz 1.6s ease-in-out infinite; }',
    '.gy-c-canli{ fill:#16A085; animation:gyYanSon 1.2s ease-in-out infinite; }',
    '.gy-c-not{ stroke-dasharray:10; animation:gyCizC 2.4s ease-in-out infinite; }',
    '.gy-c-parla{ animation:gyYanSon 2.2s ease-in-out infinite; }',
    '.gy-c-cizgi{ stroke-dasharray:26; animation:gyCizC 3s ease-in-out infinite; }',
    '.gy-c-akrep{ transform-box:fill-box; transform-origin:50% 100%; animation:gyDon 4s linear infinite; }',
    '@keyframes gyYanSon{ 50%{ opacity:.25; } }',
    '@keyframes gyNabiz{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.3); } }',
    '@keyframes gyCizC{ 0%{ stroke-dashoffset:26; } 45%,85%{ stroke-dashoffset:0; } 100%{ stroke-dashoffset:-26; } }',
    '@keyframes gyDon{ to{ transform:rotate(360deg); } }',
    /* 2) ETKİNLİK — 9 sn döngü */
    '.gy-sat{ animation:gySat 9s ease-out infinite both; }',
    '.gy-sat.n2{ animation-delay:.2s; } .gy-sat.n3{ animation-delay:.4s; }',
    '@keyframes gySat{ 0%{ opacity:0; transform:translateX(-8px); } 7%,93%{ opacity:1; transform:none; } 100%{ opacity:0; } }',
    '.gy-halka{ stroke-dasharray:100 100; stroke-dashoffset:8; animation:gyHalka1 9s ease-in-out infinite both; }',
    '.gy-halka.n2{ stroke-dashoffset:24; animation-name:gyHalka2; animation-delay:.2s; }',
    '.gy-halka.n3{ stroke-dashoffset:30; animation-name:gyHalka3; animation-delay:.4s; }',
    '@keyframes gyHalka1{ 0%,8%{ stroke-dashoffset:100; } 30%,94%{ stroke-dashoffset:8; } 100%{ stroke-dashoffset:100; } }',
    '@keyframes gyHalka2{ 0%,8%{ stroke-dashoffset:100; } 30%,94%{ stroke-dashoffset:24; } 100%{ stroke-dashoffset:100; } }',
    '@keyframes gyHalka3{ 0%,8%{ stroke-dashoffset:100; } 30%,64%{ stroke-dashoffset:42; } 70%,94%{ stroke-dashoffset:30; } 100%{ stroke-dashoffset:100; } }',
    '.gy-yuzde{ animation:gyYuzde 9s ease-out infinite both; }',
    '.gy-yuzde.n2{ animation-delay:.2s; } .gy-yuzde.n3{ animation-delay:.4s; }',
    '.gy-yuzde.gy-eski{ animation-name:gyYuzdeEski; } .gy-yuzde.gy-yeni{ opacity:0; animation-name:gyYuzdeYeni; }',
    '@keyframes gyYuzdeEski{ 0%,22%{ opacity:0; } 30%,64%{ opacity:1; } 67%,100%{ opacity:0; } }',
    '@keyframes gyYuzdeYeni{ 0%,65%{ opacity:0; } 69%,94%{ opacity:1; } 100%{ opacity:0; } }',
    '@keyframes gyYuzde{ 0%,22%{ opacity:0; } 30%,94%{ opacity:1; } 100%{ opacity:0; } }',
    '.gy-cizgi{ stroke-dasharray:100 120; stroke-dashoffset:0; animation:gyCizgi 9s ease-in-out infinite both; }',
    '.gy-cizgi.n2{ animation-delay:.25s; } .gy-cizgi.n3{ animation-delay:.5s; }',
    '@keyframes gyCizgi{ 0%,12%{ stroke-dashoffset:101; } 38%,94%{ stroke-dashoffset:0; } 100%{ stroke-dashoffset:101; } }',
    '.gy-akrep{ transform-box:fill-box; transform-origin:50% 100%; animation:gyDon 3s linear infinite; }',
    '.gy-akrep.n2{ animation-duration:4.5s; } .gy-akrep.n3{ animation-duration:6s; }',
    '.gy-sure{ animation:gyYuzde 9s ease-out infinite both; }',
    '.gy-sure.n2{ animation-delay:.3s; } .gy-sure.n3{ animation-delay:.6s; }',
    '.gy-parla{ opacity:0; animation:gyParla 9s ease-in-out infinite; }',
    '@keyframes gyParla{ 0%,62%{ opacity:0; } 68%{ opacity:1; } 80%,100%{ opacity:0; } }',
    '.gy-arti{ opacity:0; animation:gyArti 9s ease-out infinite; }',
    '@keyframes gyArti{ 0%,64%{ opacity:0; transform:translateY(6px); } 69%,82%{ opacity:1; transform:none; } 88%,100%{ opacity:0; transform:translateY(-6px); } }',
    '.gy-hat{ opacity:.85; }',
    '.gy-damla{ opacity:0; animation:gyDamla 9s ease-in-out infinite both; }',
    '.gy-damla.n2{ animation-delay:.3s; } .gy-damla.n3{ animation-delay:.6s; }',
    '@keyframes gyDamla{ 0%,46%{ opacity:0; transform:translate(384px,118px); } 48%{ opacity:1; } 53%{ transform:translate(357px,139px); } 58%{ opacity:1; transform:translate(331px,146px); } 60%,100%{ opacity:0; transform:translate(331px,146px); } }',
    '.gy-kare rect{ animation:gyKare 9s ease-in-out infinite; }',
    '.gy-kare.k2 rect{ animation-delay:.5s; } .gy-kare.k3 rect{ animation-delay:1s; } .gy-kare.k4 rect{ animation-delay:1.5s; }',
    '@keyframes gyKare{ 0%,30%{ fill:#E0F2FE; } 34%,40%{ fill:#BBF7D0; } 46%,100%{ fill:#E0F2FE; } }',
    '.gy-sure-cubuk{ transform-box:fill-box; transform-origin:0 50%; animation:gySureC 9s linear infinite; }',
    '@keyframes gySureC{ 0%{ transform:scaleX(.08); } 60%,100%{ transform:scaleX(1); } }',
    '.gy-yildiz{ transform-box:fill-box; transform-origin:center; opacity:0; animation:gyYildiz 9s ease-out infinite; }',
    '@keyframes gyYildiz{ 0%,40%{ opacity:0; transform:scale(.3) rotate(-30deg); } 44%{ opacity:1; transform:scale(1.25) rotate(0); } 48%,62%{ opacity:1; transform:scale(1); } 70%,100%{ opacity:0; } }',
    /* «Hesabıyla bağlı öğrencinin [puanı | süresi | gelişimi] senin ekranında» */
    '.gy-sabit-sol{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px 6px 9px; border-radius:12px; background:#E8F6F2; color:#0E7C66; border:1.5px solid #A9DFCB; }',
    '.gy-bag{ stroke-dasharray:8; animation:gyCizC 2.6s ease-in-out infinite; }',
    '.gy-donen{ display:inline-grid; }',
    '.gy-d{ grid-area:1/1; display:inline-flex; align-items:center; gap:7px; padding:6px 13px 6px 10px; border-radius:12px;',
    '  background:#FFF1D6; color:#B45309; border:1.5px solid #F6C878; box-shadow:0 3px 10px rgba(180,83,9,.14); opacity:0; animation:gyD 9s ease-in-out infinite; }',
    '.gy-d1{ animation-delay:0s; } .gy-d2{ animation-delay:3s; } .gy-d3{ animation-delay:6s; }',
    '@keyframes gyD{ 0%{ opacity:0; transform:translateY(7px); } 4%,30%{ opacity:1; transform:none; } 34%,100%{ opacity:0; transform:translateY(-7px); } }',
    /* hareketi azalt: son hâl durağan */
    '@media (prefers-reduced-motion:reduce){',
    '  .gy-svg *, .gy-adim, .gy-d, .gy-sabit-sol svg *{ animation:none !important; }',
    '  .gy-ekran-a, .gy-ucak, .gy-geri, .gy-parla, .gy-arti, .gy-damla, .gy-yildiz{ opacity:0 !important; }',
    '  .gy-ekran-b, .gy-rozet, .gy-satir, .gy-tik, .gy-st, .gy-sat, .gy-yuzde, .gy-sure{ opacity:1 !important; transform:none !important; }',
    '  .gy-pb, .gy-sb, .gy-sure-cubuk{ transform:none !important; }',
    '  .gy-yuzde.gy-eski{ opacity:0 !important; }',
    '  .gy-donen{ display:inline-flex; flex-wrap:wrap; gap:6px; } .gy-d{ opacity:1 !important; transform:none !important; }',
    '}'
  ].join('\n');
  try {
    if (!document.getElementById('syGorevStil')) {
      var s = document.createElement('style');
      s.id = 'syGorevStil';
      s.textContent = STIL;
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (e) { }
})();

/* ---------------------------------------------------------------------------
   SINAV, SINIF BAŞKANI VE MEYDAN OKUMA GÖRSELLERİ (15.11.2026) — öğretmen:
   "sınıfta yeni kısmına ekle, güzel animasyonlu svg ekle".
     g: 'sinav'  — öğretmen soruları yazar, puanlar 100'e tamamlanır, sınav öğrencinin
                   telefonuna uçar, çözülür; otomatik okunur, açık uçlu kalemle puanlanır,
                   not halkası dolar (10 sn döngü)
     g: 'baskan' — sınıf listesinde taç başkana, gümüş taç yardımcıya iner; yetki
                   anahtarları tek tek açılır; başkan oturma planına öğrencileri
                   sürükleyip bırakır (10 sn döngü)
     g: 'meydan' — öğrenci meydan okur, şimşek arkadaşının telefonuna uçar, kabul edilir,
                   ikisi de oynar, puanlar çıkar, kupa kazanana (9 sn döngü)
   Biçim öteki görsellerle ortak (.ty-kutu, .ty-svg, .ty-cipler, .ty-cip, .ty-vurgu,
   .gy-kutu, .gy-yan); bunlara özgü olanlar sv- önekli. «Hareketi azalt»ta son hâl durağan.
   --------------------------------------------------------------------------- */
(function () {
  var G = window.KIDEF_SINIFTA_YENI_GORSEL = window.KIDEF_SINIFTA_YENI_GORSEL || {};
  var SIM = function (ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; };
  var CIP = function (ic, yazi) { return '<span class="ty-cip">' + SIM(ic) + yazi + '</span>'; };
  var ADIM = function (s, n, ic, yazi) { return '<span class="sv-adim sv-' + s + n + '">' + SIM(ic) + yazi + '</span>'; };
  var OK = '<span class="gy-ok" aria-hidden="true">' + SIM('<path d="M3 12h15"/><path d="M14 7l5 5-5 5"/>') + '</span>';
  var VURGU = function (gizli, a, b, c) {
    return '<div class="ty-vurgu gy-vurgu gy-yan"><span class="ty-gizli">' + gizli + '</span>' + a + OK + b + OK + c + '</div>';
  };
  /* öğrenci (baş, saç, gövde) — ortası cx, başın merkezi cy */
  var OGR = function (cx, cy, renk) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="#F2C9A0"/>' +
      '<path d="M' + (cx - 11) + ' ' + (cy - 3) + 'C' + (cx - 12) + ' ' + (cy - 17) + ' ' + (cx + 12) + ' ' + (cy - 17) + ' ' + (cx + 11) + ' ' + (cy - 3) +
        'C' + (cx + 6) + ' ' + (cy - 9) + ' ' + (cx - 5) + ' ' + (cy - 10) + ' ' + (cx - 11) + ' ' + (cy - 3) + 'Z" fill="#3B2F2F"/>' +
      '<path d="M' + (cx - 20) + ' ' + (cy + 40) + 'C' + (cx - 20) + ' ' + (cy + 22) + ' ' + (cx - 11) + ' ' + (cy + 14) + ' ' + cx + ' ' + (cy + 14) +
        'C' + (cx + 11) + ' ' + (cy + 14) + ' ' + (cx + 20) + ' ' + (cy + 22) + ' ' + (cx + 20) + ' ' + (cy + 40) + 'Z" fill="' + renk + '"/>';
  };
  var TIK = function (cx, cy, r, renk) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + renk + '"/>' +
      '<path d="M' + (cx - r * .45) + ' ' + cy + 'l' + (r * .32) + ' ' + (r * .32) + ' ' + (r * .62) + ' -' + (r * .64) + '" fill="none" stroke="#fff" stroke-width="' + (r * .3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  };

  /* ------------------------------------------------------- 1) SINAV (10 sn) */
  var SORU = function (y, n, tur, puan) {
    var ic = tur === 'cs'
      ? '<circle cx="51" cy="' + (y + 9) + '" r="2.6" fill="none" stroke="#94A3B8" stroke-width="1.3"/><circle cx="58.5" cy="' + (y + 9) + '" r="2.6" fill="#4F46E5"/><circle cx="66" cy="' + (y + 9) + '" r="2.6" fill="none" stroke="#94A3B8" stroke-width="1.3"/>'
      : tur === 'dy'
        ? '<path d="M48.6 ' + (y + 9) + 'l2.2 2.2 3.8-4.2" fill="none" stroke="#16A085" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 ' + (y + 6) + 'l5.4 5.6M65.4 ' + (y + 6) + 'L60 ' + (y + 11.6) + '" stroke="#E74C3C" stroke-width="1.8" stroke-linecap="round"/>'
        : '<path d="M48 ' + (y + 6.4) + 'h18M48 ' + (y + 10.4) + 'h14" stroke="#94A3B8" stroke-width="1.6" stroke-linecap="round"/><path d="M62 ' + (y + 14.6) + 'l6-6 1.6 1.6-6 6h-1.6z" fill="#F39C12"/>';
    return '<rect x="43" y="' + y + '" width="138" height="18" rx="5" fill="#F8FAFC" stroke="#E2E8F0"/>' + ic +
      '<rect x="75" y="' + (y + 6.5) + '" width="' + (tur === 'ac' ? 40 : 50) + '" height="5" rx="2.5" fill="#CBD5E1"/>' +
      '<g class="sv-oto n' + n + '">' + (tur === 'ac'
        ? '<circle cx="137" cy="' + (y + 9) + '" r="6" fill="#FFF1D6"/><path d="M134 ' + (y + 12.4) + 'l4.6-4.6 1.6 1.6-4.6 4.6h-1.6z" fill="#D97706"/>'
        : TIK(137, y + 9, 6, '#16A085')) + '</g>' +
      '<g class="sv-puan n' + n + '"><rect x="148" y="' + (y + 3) + '" width="28" height="12" rx="6" fill="#EEF2FF"/>' +
        '<text x="162" y="' + (y + 12.6) + '" text-anchor="middle" class="sv-k" fill="#4338CA">' + puan + '</text></g>';
  };
  var SINAV_SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg sv-svg" viewBox="0 0 480 214" role="img" aria-label="Öğretmen soruları yazıyor, puanlar 100\'e tamamlanıyor; sınav öğrencinin telefonuna gidiyor, öğrenci çözüyor; sınav kendiliğinden okunuyor ve not 100 üzerinden çıkıyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#F3F4FB"/>' +
    '<path d="M0 178H480V198a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16Z" fill="#E7E9F6"/>' +
    '<path d="M0 178H480" stroke="#D9DCF0" stroke-width="2"/>' +
    /* öğretmenin bilgisayarı: soru listesi */
    '<path d="M10 180H214L204 169H20Z" fill="#475569"/>' +
    '<rect x="30" y="38" width="164" height="131" rx="8" fill="#1F2937"/>' +
    '<rect x="37" y="45" width="150" height="117" rx="4" fill="#fff"/>' +
    '<path d="M37 49a4 4 0 0 1 4-4H183a4 4 0 0 1 4 4V64H37Z" fill="#4F46E5"/>' +
    '<g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="45" y="48.6" width="9" height="11.6" rx="1.4"/><path d="M47.4 52.4h4.2M47.4 55.4h4.2"/></g>' +
    '<rect x="60" y="51.6" width="56" height="6" rx="3" fill="#fff" opacity=".9"/>' +
    SORU(70, 1, 'cs', 25) + SORU(92, 2, 'dy', 25) + SORU(114, 3, 'ac', 50) +
    '<rect x="43" y="141" width="34" height="5" rx="2.5" fill="#CBD5E1"/>' +
    '<g class="sv-top"><rect x="82" y="136.5" width="36" height="15" rx="7.5" fill="#16A085"/><text x="100" y="147.6" text-anchor="middle" class="sv-k" fill="#fff">100</text></g>' +
    '<g class="sv-gonder"><rect x="125" y="136.5" width="56" height="15" rx="7.5" fill="#D84315"/>' +
      '<path d="M146 140l11 4-11 4 2-4z" fill="#fff"/></g>' +
    /* uçuş yolu ve kâğıt (sınav) */
    '<path d="M182 140C214 70 240 46 282 52" fill="none" stroke="#4F46E5" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round" opacity=".45"/>' +
    '<g class="sv-kagit"><rect x="-8" y="-10" width="16" height="20" rx="2" fill="#fff" stroke="#4F46E5" stroke-width="1.6"/><path d="M-4 -5h8M-4 -1h8M-4 3h5" stroke="#A5B4FC" stroke-width="1.4" stroke-linecap="round"/></g>' +
    /* öğrencinin telefonu */
    '<rect x="262" y="30" width="56" height="102" rx="8" fill="#1F2937"/>' +
    '<rect x="266" y="38" width="48" height="86" rx="3" fill="#fff"/>' +
    '<rect x="284" y="33.4" width="12" height="1.6" rx=".8" fill="#64748B"/>' +
    '<g class="sv-tel">' +
      '<rect x="270" y="42" width="40" height="8" rx="4" fill="#E0E7FF"/>' +
      '<rect x="270" y="56" width="40" height="11" rx="3" fill="#F8FAFC" stroke="#E2E8F0"/>' +
      '<rect class="sv-sec" x="270" y="71" width="40" height="11" rx="3" fill="#F8FAFC" stroke="#E2E8F0"/>' +
      '<rect x="270" y="86" width="40" height="11" rx="3" fill="#F8FAFC" stroke="#E2E8F0"/>' +
      '<circle cx="276" cy="61.5" r="2.4" fill="none" stroke="#94A3B8" stroke-width="1.2"/>' +
      '<circle cx="276" cy="76.5" r="2.4" fill="none" stroke="#94A3B8" stroke-width="1.2"/><circle class="sv-isaret" cx="276" cy="76.5" r="2.4" fill="#4F46E5"/>' +
      '<circle cx="276" cy="91.5" r="2.4" fill="none" stroke="#94A3B8" stroke-width="1.2"/>' +
      '<path d="M282 61.5h20M282 76.5h16M282 91.5h22" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/>' +
      '<g class="sv-bitir"><rect x="276" y="104" width="28" height="12" rx="6" fill="#16A085"/><path d="M285.6 110l2.4 2.4 4.4-4.6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '</g>' +
    OGR(290, 148, '#4F46E5') +
    /* cevaplar not kartına */
    '<circle class="sv-uc n1" r="4.5" fill="#16A085"/><circle class="sv-uc n2" r="4.5" fill="#16A085"/><circle class="sv-uc n3" r="4.5" fill="#F39C12"/>' +
    /* not kartı */
    '<rect x="346" y="34" width="120" height="132" rx="12" fill="#fff" stroke="#E2E8F0" stroke-width="1.5"/>' +
    '<rect x="358" y="44" width="58" height="7" rx="3.5" fill="#CBD5E1"/>' +
    '<circle cx="406" cy="98" r="30" fill="none" stroke="#EEF2F7" stroke-width="9"/>' +
    '<circle class="sv-halka" cx="406" cy="98" r="30" fill="none" stroke="#16A085" stroke-width="9" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 406 98)"/>' +
    '<text x="406" y="105" text-anchor="middle" class="sv-not">85</text>' +
    '<text x="406" y="117" text-anchor="middle" class="sv-k sv-not" fill="#94A3B8" style="font-size:8px">/ 100</text>' +
    '<g class="sv-kart-alt">' + TIK(384, 148, 7, '#16A085') + TIK(406, 148, 7, '#16A085') +
      '<circle cx="428" cy="148" r="7" fill="#FFF1D6"/><path d="M424.6 151.8l5.2-5.2 1.8 1.8-5.2 5.2h-1.8z" fill="#D97706"/></g>' +
    '</svg>';
  var SINAV_VURGU = VURGU('Sınavı hazırla, öğrencin çözsün, not hazır',
    ADIM('s', 1, '<path d="M14.5 3.5l6 6L9 21H3v-6z"/><path d="M12.5 5.5l6 6"/>', 'Hazırla'),
    ADIM('s', 2, '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M9.8 12.4l1.6 1.6 3-3.2"/>', 'Öğrenci çözer'),
    ADIM('s', 3, '<circle cx="12" cy="12" r="8.6"/><path d="M8.4 12.2l2.6 2.6 4.8-5"/>', 'Not hazır'));
  var SINAV_CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<circle cx="6" cy="7" r="2"/><circle class="sv-c-sec" cx="6" cy="12" r="2"/><circle cx="6" cy="17" r="2"/><path d="M11 7h9M11 12h9M11 17h9"/>', 'Çoktan seçmeli') +
    CIP('<path d="M3.5 12.5l3 3 5.5-6"/><path class="sv-c-yan" d="M14.5 8.5l6 6M20.5 8.5l-6 6"/>', 'Doğru-yanlış') +
    CIP('<path d="M4 7h11M4 12h7"/><path class="sv-c-kalem" d="M13 19l7-7 2 2-7 7h-2z"/>', 'Açık uçlu') +
    CIP('<rect x="3" y="6" width="18" height="12" rx="2.4"/><path class="sv-c-tus" d="M7 10h1M11 10h1M15 10h1M8 14h8"/>', 'Arapça klavye') +
    CIP('<circle cx="12" cy="12" r="8.6"/><path class="sv-c-dol" d="M12 3.4a8.6 8.6 0 0 1 8.6 8.6H12z"/>', '100 puana tamamlar') +
    CIP('<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M10.6 18.6h2.8"/><circle class="gy-c-rozet" cx="17.4" cy="5.6" r="2.6"/>', '«Görevlerim»de') +
    '</div>';
  G.sinav = SINAV_SAHNE + SINAV_VURGU + SINAV_CIPLER + '</div>';

  /* ------------------------------------------------ 2) SINIF BAŞKANI (10 sn) */
  var TAC = 'M-9 4L-9.6 -5L-4.4 -.4L0 -7L4.4 -.4L9.6 -5L9 4Z';
  var SATIR = function (y, n, renk, hesapsiz, anahtar) {
    var s = '<rect x="24" y="' + y + '" width="180" height="26" rx="7" fill="#F8FAFC"/>' +
      '<circle cx="40" cy="' + (y + 13) + '" r="9" fill="' + (hesapsiz ? '#fff' : renk) + '"' + (hesapsiz ? ' stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3 2.4"' : '') + '/>' +
      '<rect x="56" y="' + (y + 7) + '" width="' + (hesapsiz ? 44 : 56) + '" height="6" rx="3" fill="#CBD5E1"/>' +
      '<rect x="56" y="' + (y + 16) + '" width="34" height="4" rx="2" fill="' + (hesapsiz ? '#FDE2E2' : '#D1FAE5') + '"/>';
    (anahtar || []).forEach(function (a, i) {
      var x = 126 + i * 26;
      s += '<g class="sv-ah ' + a + '"><rect class="sv-zemin" x="' + x + '" y="' + (y + 7) + '" width="21" height="12" rx="6" fill="#CBD5E1"/>' +
        '<circle class="sv-dugme" cx="' + (x + 6) + '" cy="' + (y + 13) + '" r="4.2" fill="#fff"/></g>';
    });
    return s;
  };
  var MASA = function (x, y) {
    return '<rect x="' + x + '" y="' + y + '" width="56" height="22" rx="4" fill="#E9CFA6" stroke="#C9A06E" stroke-width="1.5"/>' +
      '<circle cx="' + (x + 28) + '" cy="' + (y + 11) + '" r="9" fill="none" stroke="#D6B385" stroke-width="1.4" stroke-dasharray="3 2.6"/>';
  };
  var BASKAN_SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg sv-svg" viewBox="0 0 480 214" role="img" aria-label="Sınıf listesinde bir öğrenciye taç, ötekine gümüş taç takılıyor; yetkileri açılıyor; başkan oturma planında arkadaşlarını sıralara sürükleyip bırakıyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#FBF7EE"/>' +
    /* sınıf listesi */
    '<rect x="16" y="22" width="196" height="172" rx="12" fill="#fff" stroke="#EADFC8" stroke-width="1.5"/>' +
    '<path d="M16 34a12 12 0 0 1 12-12H200a12 12 0 0 1 12 12V46H16Z" fill="#B45309"/>' +
    '<text x="30" y="40" class="sv-k" fill="#fff" style="font-size:12px">7-A</text>' +
    '<g fill="none" stroke="#FDE7C4" stroke-width="1.6" stroke-linecap="round"><path d="M150 30.4h46M150 34.4h34M150 38.4h40"/></g>' +
    SATIR(54, 1, '#16A085', false, ['a1', 'a2', 'a3']) +
    SATIR(88, 2, '#2563EB', false, ['b1', 'b2', 'b3']) +
    SATIR(122, 3, '#DB2777', false) +
    SATIR(156, 4, '#94A3B8', true) +
    /* taçlar */
    '<g transform="translate(40 55)"><g class="sv-tac"><path d="' + TAC + '" fill="#F5B301" stroke="#B7791F" stroke-width="1.2" stroke-linejoin="round"/><circle cx="0" cy="-7" r="1.6" fill="#FDE68A"/></g></g>' +
    '<g transform="translate(40 89)"><g class="sv-tac y"><path d="' + TAC + '" fill="#E2E8F0" stroke="#64748B" stroke-width="1.2" stroke-linejoin="round"/><circle cx="0" cy="-7" r="1.6" fill="#fff"/></g></g>' +
    /* oturma planı */
    '<rect x="240" y="22" width="226" height="172" rx="12" fill="#fff" stroke="#EADFC8" stroke-width="1.5"/>' +
    '<rect x="303" y="30" width="100" height="13" rx="3" fill="#1F4E3D"/><path d="M312 36.5h30" stroke="#E8F6F2" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>' +
    MASA(252, 58) + MASA(325, 58) + MASA(398, 58) + MASA(252, 106) + MASA(325, 106) + MASA(398, 106) +
    '<rect x="258" y="156" width="196" height="28" rx="14" fill="#FFF7ED" stroke="#F6C878" stroke-width="1.4" stroke-dasharray="4 3"/>' +
    '<circle class="sv-ot n1" r="9" fill="#16A085" stroke="#fff" stroke-width="2"/>' +
    '<circle class="sv-ot n2" r="9" fill="#2563EB" stroke="#fff" stroke-width="2"/>' +
    '<circle class="sv-ot n3" r="9" fill="#DB2777" stroke="#fff" stroke-width="2"/>' +
    '<circle class="sv-ot n4" r="9" fill="#F39C12" stroke="#fff" stroke-width="2"/>' +
    '<g class="sv-imlec"><path d="M0 0V15l4-3.6 3 6.6 2.8-1.2-3-6.4H12Z" fill="#fff" stroke="#1F2937" stroke-width="1.5" stroke-linejoin="round"/></g>' +
    '</svg>';
  var BASKAN_VURGU = VURGU('Taç tak, yetki ver, başkan sınıfı düzenlesin',
    ADIM('b', 1, '<path d="M3 18l-1-11 5.5 4.6L12 4l4.5 7.6L22 7l-1 11z"/><path d="M3 21h18"/>', 'Taç tak'),
    ADIM('b', 2, '<rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="16.6" cy="12" r="2.8"/>', 'Yetki ver'),
    ADIM('b', 3, '<rect x="3" y="4" width="7" height="6" rx="1.4"/><rect x="14" y="4" width="7" height="6" rx="1.4"/><rect x="3" y="14" width="7" height="6" rx="1.4"/><rect x="14" y="14" width="7" height="6" rx="1.4"/>', 'Başkan düzenler'));
  var BASKAN_CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<rect x="3" y="4" width="7" height="6" rx="1.4"/><rect x="14" y="4" width="7" height="6" rx="1.4"/><rect x="3" y="14" width="7" height="6" rx="1.4"/><rect class="sv-c-otur" x="14" y="14" width="7" height="6" rx="1.4"/>', 'Oturma planı') +
    CIP('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/><path class="sv-c-zil" d="M2.6 7.4A9.6 9.6 0 0 1 5 3.6M21.4 7.4A9.6 9.6 0 0 0 19 3.6"/>', 'Hatırlatma') +
    CIP('<rect x="3" y="3" width="18" height="18" rx="4"/><circle class="sv-c-zar" cx="8.5" cy="8.5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle class="sv-c-zar" cx="15.5" cy="15.5" r="1.4"/>', 'Kura ve takım') +
    CIP('<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/><path class="sv-c-skor" d="M14 6l2-2 2 2"/>', 'Yarışma tablosu') +
    CIP('<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path class="sv-c-teslim" d="M9.6 14.2l2 2 3.8-4"/>', 'Kâğıt teslim listesi') +
    CIP('<circle cx="9" cy="8" r="3.6"/><path d="M2.6 20a6.4 6.4 0 0 1 12.8 0"/><path class="sv-c-soru" d="M17 8.6a2.4 2.4 0 1 1 3.2 2.2c-.8.3-1.2.9-1.2 1.6M19 15.4v.2"/>', 'Hesap ve giriş yardımı') +
    '</div>';
  G.baskan = BASKAN_SAHNE + BASKAN_VURGU + BASKAN_CIPLER + '</div>';

  /* ------------------------------------------------- 3) MEYDAN OKUMA (9 sn) */
  var MTEL = function (x, n, renk, puan) {
    return '<rect x="' + x + '" y="24" width="76" height="100" rx="10" fill="#1F2937"/>' +
      '<rect x="' + (x + 4) + '" y="31" width="68" height="86" rx="4" fill="#fff"/>' +
      '<rect x="' + (x + 9) + '" y="36" width="58" height="18" rx="5" fill="#EDE9FE"/>' +
      '<rect x="' + (x + 13) + '" y="39.5" width="11" height="11" rx="3" fill="#7C3AED"/>' +
      '<path d="M' + (x + 18.5) + ' 41.6l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" fill="#FDE68A"/>' +
      '<rect x="' + (x + 28) + '" y="42" width="32" height="5.4" rx="2.7" fill="#C4B5FD"/>' +
      '<rect x="' + (x + 9) + '" y="62" width="58" height="7" rx="3.5" fill="#EEF2F7"/>' +
      '<rect class="sv-mp n' + n + '" x="' + (x + 9) + '" y="62" width="58" height="7" rx="3.5" fill="' + renk + '"/>' +
      '<circle class="sv-kazan n' + n + '" cx="' + (x + 38) + '" cy="85" r="13" fill="#FEF3C7"/>' +
      '<text x="' + (x + 38) + '" y="92.6" text-anchor="middle" class="sv-ms n' + n + '" fill="' + renk + '">' + puan + '</text>' +
      OGR(x + 38, 148, renk);
  };
  var SIMSEK = 'M2 -11L-7 2H-1L-3 11L7 -2H1Z';
  var MEYDAN_SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg sv-svg" viewBox="0 0 480 214" role="img" aria-label="Bir öğrenci arkadaşına meydan okuyor; arkadaşı kabul ediyor, ikisi de aynı oyunu oynuyor; puanlar çıkıyor ve kupa kazanana gidiyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#F5F3FF"/>' +
    '<path d="M0 188H480V198a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16Z" fill="#EDE9FE"/>' +
    '<path d="M0 188H480" stroke="#DDD6FE" stroke-width="2"/>' +
    MTEL(60, 1, '#16A085', 90) +
    '<g class="sv-mo"><rect x="78" y="100" width="40" height="12" rx="6" fill="#D84315"/><path d="M' + 98 + ' 102.4l-3 4h2.4l-1 3.2 3.4-4.4H97.4z" fill="#fff"/></g>' +
    MTEL(344, 2, '#2563EB', 75) +
    /* davet: arkadaşın telefonunda */
    '<g class="sv-davet"><rect x="348" y="31" width="68" height="86" rx="4" fill="#FFF7ED"/>' +
      '<circle cx="382" cy="52" r="11" fill="#FDEBD0"/><g transform="translate(382 52) scale(.7)"><path d="' + SIMSEK + '" fill="#F39C12"/></g>' +
      '<rect x="360" y="68" width="44" height="5" rx="2.5" fill="#F6C878"/>' +
      '<g class="sv-kabul">' + TIK(368, 92, 8, '#16A085') + '</g>' +
      '<circle cx="396" cy="92" r="8" fill="#E74C3C"/><path d="M393 89l6 6M399 89l-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>' +
    /* şimşek uçuşu */
    '<path d="M140 56C186 0 298 0 342 56" fill="none" stroke="#F39C12" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round" opacity=".5"/>' +
    '<g class="sv-simsek"><path d="' + SIMSEK + '" fill="#F39C12" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></g>' +
    /* VS ve kupa */
    '<g class="sv-vs"><circle cx="240" cy="96" r="24" fill="#7C3AED"/><text x="240" y="102" text-anchor="middle" class="sv-k" fill="#fff" style="font-size:17px">VS</text></g>' +
    '<g class="sv-kupa">' +
      '<path d="M226 76h28v10a14 14 0 0 1-28 0z" fill="#F5B301"/>' +
      '<path d="M226 80h-5a6 6 0 0 0 6 8M254 80h5a6 6 0 0 1-6 8" fill="none" stroke="#F5B301" stroke-width="3"/>' +
      '<path d="M236 99h8l2 9h-12z" fill="#D69E2E"/><rect x="229" y="107" width="22" height="6" rx="2" fill="#B7791F"/>' +
      '<path d="M236 82l2.6 2.6 5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>' +
    '<g class="sv-konfeti"><rect x="206" y="70" width="5" height="5" rx="1" fill="#16A085"/><rect x="270" y="66" width="5" height="5" rx="1" fill="#E74C3C"/>' +
      '<circle cx="216" cy="118" r="3" fill="#7C3AED"/><circle cx="266" cy="120" r="3" fill="#2563EB"/><rect x="240" y="58" width="5" height="5" rx="1" fill="#F39C12"/></g>' +
    '</svg>';
  var MEYDAN_VURGU = VURGU('Meydan oku, arkadaşın kabul etsin, kazanan belli olsun',
    ADIM('m', 1, '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', 'Meydan oku'),
    ADIM('m', 2, '<circle cx="12" cy="12" r="8.6"/><path d="M8.4 12.2l2.6 2.6 4.8-5"/>', 'Kabul'),
    ADIM('m', 3, '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M10 15h4l1 4H9zM8 21h8"/>', 'Kazanan belli'));
  var MEYDAN_CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M10.5 20a5.5 5.5 0 0 1 11 0"/>', 'Aynı öğretmenin öğrencileri') +
    CIP('<rect x="3" y="3" width="18" height="18" rx="4"/><path class="sv-c-yildiz" d="M12 7l1.5 3 3.3.5-2.4 2.3.6 3.3L12 14.6 9 16.1l.6-3.3-2.4-2.3 3.3-.5z"/>', 'Sitedeki oyunlar') +
    CIP('<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><circle class="sv-c-hedef" cx="12" cy="12" r="1.6"/>', 'İlk deneme sayılır') +
    CIP('<rect x="2" y="7" width="20" height="10" rx="5"/><circle class="sv-c-anahtar" cx="16.6" cy="12" r="2.8"/>', 'Açar ya da kapatırsın') +
    '</div>';
  G.meydan = MEYDAN_SAHNE + MEYDAN_VURGU + MEYDAN_CIPLER + '</div>';

  /* ---------------------------------------------------------------- biçim */
  var px = function (x, y) { return 'translate(' + x + 'px,' + y + 'px)'; };
  /* üç adımın sırayla parlaması: s1, s2 = adımların bittiği yüzde */
  var RENK = [['#FFF1D6', '#B45309', '#F6C878'], ['#E8F6F2', '#0E7C66', '#A9DFCB'], ['#F3E8FF', '#7B1FA2', '#D8B4FE']];
  var SONUK = 'background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none;';
  var PARLAK = function (i) { return 'background:' + RENK[i][0] + '; color:' + RENK[i][1] + '; border-color:' + RENK[i][2] + '; transform:translateY(-2px);'; };
  var ADIMLAR = function (on, sure, s1, s2) {
    return [
      '.sv-' + on + '1, .sv-' + on + '2, .sv-' + on + '3{ animation-duration:' + sure + 's; }',
      '.sv-' + on + '1{ animation-name:sv' + on + 'A1; } .sv-' + on + '2{ animation-name:sv' + on + 'A2; } .sv-' + on + '3{ animation-name:sv' + on + 'A3; }',
      '@keyframes sv' + on + 'A1{ 0%,' + (s1 - 3) + '%{ ' + PARLAK(0) + ' } ' + s1 + '%,96%{ ' + SONUK + ' } 100%{ ' + PARLAK(0) + ' } }',
      '@keyframes sv' + on + 'A2{ 0%,' + (s1 - 3) + '%{ ' + SONUK + ' } ' + s1 + '%,' + (s2 - 3) + '%{ ' + PARLAK(1) + ' } ' + s2 + '%,100%{ ' + SONUK + ' } }',
      '@keyframes sv' + on + 'A3{ 0%,' + (s2 - 3) + '%{ ' + SONUK + ' } ' + s2 + '%,93%{ ' + PARLAK(2) + ' } 97%,100%{ ' + SONUK + ' } }'
    ].join('\n');
  };
  /* oturma planı: tepsiden sıraya; [başla, bit] yüzde */
  var OT = [[282, 170, 280, 69, 42, 50], [322, 170, 353, 69, 53, 61], [362, 170, 426, 117, 64, 72], [402, 170, 280, 117, 75, 83]];
  var otKF = OT.map(function (o, i) {
    return '.sv-ot.n' + (i + 1) + '{ animation:svOt' + (i + 1) + ' 10s ease-in-out infinite; }\n' +
      '@keyframes svOt' + (i + 1) + '{ 0%,' + o[4] + '%{ transform:' + px(o[0], o[1]) + '; opacity:1; } ' + o[5] + '%,91%{ transform:' + px(o[2], o[3]) + '; opacity:1; } ' +
      '94%{ transform:' + px(o[2], o[3]) + '; opacity:0; } 95%{ transform:' + px(o[0], o[1]) + '; opacity:0; } 100%{ transform:' + px(o[0], o[1]) + '; opacity:1; } }';
  }).join('\n');
  var im = function (x, y) { return px(x + 2, y + 3); };
  var imlecKF = '@keyframes svImlec{ 0%,36%{ opacity:0; transform:' + im(330, 150) + '; } 40%,42%{ opacity:1; transform:' + im(282, 170) + '; } 50%{ transform:' + im(280, 69) + '; }' +
    ' 53%{ transform:' + im(322, 170) + '; } 61%{ transform:' + im(353, 69) + '; } 64%{ transform:' + im(362, 170) + '; } 72%{ transform:' + im(426, 117) + '; }' +
    ' 75%{ transform:' + im(402, 170) + '; } 83%{ opacity:1; transform:' + im(280, 117) + '; } 87%,100%{ opacity:0; transform:' + im(300, 140) + '; } }';
  var AH = { a1: 26, a2: 30, a3: 34, b1: 37 };   /* hangi anahtar ne zaman açılır (b2, b3 kapalı: yetkiler ayrı ayrı) */
  var ahKF = Object.keys(AH).map(function (k) {
    var t = AH[k];
    return '.sv-ah.' + k + ' .sv-zemin{ animation:svZ' + k + ' 10s ease-in-out infinite; } .sv-ah.' + k + ' .sv-dugme{ animation:svD' + k + ' 10s ease-in-out infinite; }\n' +
      '@keyframes svZ' + k + '{ 0%,' + t + '%{ fill:#CBD5E1; } ' + (t + 2) + '%,92%{ fill:#16A085; } 96%,100%{ fill:#CBD5E1; } }\n' +
      '@keyframes svD' + k + '{ 0%,' + t + '%{ transform:none; } ' + (t + 2) + '%,92%{ transform:translateX(9px); } 96%,100%{ transform:none; } }';
  }).join('\n');

  var STIL = [
    '.sv-svg text{ font-family:inherit; font-weight:900; }',
    '.sv-k{ font-size:9px; }',
    '.sv-adim{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px 6px 9px; border-radius:12px; background:#F1F5F9; color:#64748B;',
    '  border:1.5px solid #E2E8F0; animation-timing-function:ease-in-out; animation-iteration-count:infinite; }',
    ADIMLAR('s', 10, 34, 62), ADIMLAR('b', 10, 24, 41), ADIMLAR('m', 9, 33, 70),
    /* 1) SINAV */
    '.sv-puan{ transform-box:fill-box; transform-origin:center; animation:svPuan 10s ease-out infinite both; }',
    '.sv-puan.n2{ animation-delay:.5s; } .sv-puan.n3{ animation-delay:1s; }',
    '@keyframes svPuan{ 0%,6%{ opacity:0; transform:scale(.3); } 9%{ opacity:1; transform:scale(1.2); } 11%,94%{ opacity:1; transform:scale(1); } 98%,100%{ opacity:0; } }',
    '.sv-top{ transform-box:fill-box; transform-origin:center; animation:svTop 10s ease-out infinite both; }',
    '@keyframes svTop{ 0%,20%{ opacity:0; transform:scale(.3); } 23%{ opacity:1; transform:scale(1.25); } 26%,94%{ opacity:1; transform:scale(1); } 98%,100%{ opacity:0; } }',
    '.sv-gonder{ transform-box:fill-box; transform-origin:center; animation:svBas 10s ease-in-out infinite; }',
    '@keyframes svBas{ 0%,26%{ transform:scale(1); } 28%{ transform:scale(1.1); } 30%{ transform:scale(.92); } 32%,100%{ transform:scale(1); } }',
    '.sv-kagit{ opacity:0; animation:svKagit 10s linear infinite; }',
    '@keyframes svKagit{ 0%,30%{ opacity:0; transform:translate(182px,140px) rotate(-20deg) scale(.5); } 32%{ opacity:1; transform:translate(192px,118px) rotate(-14deg) scale(1); }',
    '  35%{ transform:translate(214px,82px) rotate(-6deg); } 38%{ transform:translate(246px,58px) rotate(4deg); } 41%{ opacity:1; transform:translate(282px,52px) rotate(10deg) scale(1); }',
    '  43%,100%{ opacity:0; transform:translate(290px,60px) rotate(12deg) scale(.4); } }',
    '.sv-tel{ animation:svTel 10s ease-out infinite both; }',
    '@keyframes svTel{ 0%,41%{ opacity:0; } 44%,94%{ opacity:1; } 98%,100%{ opacity:0; } }',
    '.sv-isaret{ transform-box:fill-box; transform-origin:center; animation:svIsaret 10s ease-out infinite both; }',
    '@keyframes svIsaret{ 0%,48%{ opacity:0; transform:scale(0); } 51%,94%{ opacity:1; transform:scale(1); } 98%,100%{ opacity:0; } }',
    '.sv-sec{ animation:svSec 10s ease-out infinite; }',
    '@keyframes svSec{ 0%,48%{ fill:#F8FAFC; stroke:#E2E8F0; } 51%,94%{ fill:#EEF2FF; stroke:#A5B4FC; } 98%,100%{ fill:#F8FAFC; stroke:#E2E8F0; } }',
    '.sv-bitir{ transform-box:fill-box; transform-origin:center; animation:svBitir 10s ease-in-out infinite; }',
    '@keyframes svBitir{ 0%,54%{ transform:scale(1); } 56%{ transform:scale(1.15); } 58%{ transform:scale(.9); } 60%,100%{ transform:scale(1); } }',
    '.sv-uc{ opacity:0; animation:svUc 10s ease-in-out infinite both; }',
    '.sv-uc.n2{ animation-delay:.25s; } .sv-uc.n3{ animation-delay:.5s; }',
    '@keyframes svUc{ 0%,59%{ opacity:0; transform:translate(304px,110px); } 60%{ opacity:1; } 64%{ transform:translate(340px,80px); } 67%{ opacity:1; transform:translate(392px,128px); } 68%,100%{ opacity:0; transform:translate(392px,128px); } }',
    '.sv-oto{ transform-box:fill-box; transform-origin:center; animation:svOto 10s ease-out infinite both; }',
    '.sv-oto.n2{ animation-delay:.3s; } .sv-oto.n3{ animation-delay:1.1s; }',
    '@keyframes svOto{ 0%,66%{ opacity:0; transform:scale(.2); } 69%{ opacity:1; transform:scale(1.3); } 72%,94%{ opacity:1; transform:scale(1); } 98%,100%{ opacity:0; } }',
    '.sv-kart-alt{ animation:svAlt 10s ease-out infinite both; }',
    '@keyframes svAlt{ 0%,66%{ opacity:0; } 70%,94%{ opacity:1; } 98%,100%{ opacity:0; } }',
    '.sv-halka{ stroke-dashoffset:15; animation:svHalka 10s ease-in-out infinite both; }',
    '@keyframes svHalka{ 0%,70%{ stroke-dashoffset:100; } 86%,94%{ stroke-dashoffset:15; } 98%,100%{ stroke-dashoffset:100; } }',
    '.sv-not{ font-size:22px; fill:#0F2A43; animation:svNot 10s ease-out infinite both; }',
    '@keyframes svNot{ 0%,82%{ opacity:0; } 86%,94%{ opacity:1; } 98%,100%{ opacity:0; } }',
    '.sv-c-sec{ fill:currentColor; animation:gyYanSon 1.8s ease-in-out infinite; }',
    '.sv-c-yan{ animation:gyYanSon 2.2s ease-in-out infinite; }',
    '.sv-c-kalem{ transform-box:fill-box; transform-origin:0 100%; animation:svSalla 2s ease-in-out infinite; }',
    '.sv-c-tus{ stroke-dasharray:2 2; animation:tyAkis 1.2s linear infinite; }',
    '.sv-c-dol{ fill:currentColor; transform-box:view-box; transform-origin:12px 12px; animation:gyDon 4s linear infinite; }',
    '@keyframes svSalla{ 0%,100%{ transform:rotate(0); } 50%{ transform:rotate(-14deg); } }',
    /* 2) SINIF BAŞKANI */
    '.sv-tac{ animation:svTac 10s cubic-bezier(.3,1.4,.6,1) infinite both; }',
    '.sv-tac.y{ animation-name:svTacY; }',
    '@keyframes svTac{ 0%,8%{ opacity:0; transform:translateY(-26px) rotate(-12deg); } 14%,92%{ opacity:1; transform:none; } 96%,100%{ opacity:0; transform:none; } }',
    '@keyframes svTacY{ 0%,15%{ opacity:0; transform:translateY(-26px) rotate(12deg); } 21%,92%{ opacity:1; transform:none; } 96%,100%{ opacity:0; transform:none; } }',
    ahKF, otKF,
    '.sv-imlec{ opacity:0; animation:svImlec 10s ease-in-out infinite; }', imlecKF,
    '.sv-c-otur{ animation:gyYanSon 1.6s ease-in-out infinite; }',
    '.sv-c-zil{ animation:gyYanSon 1s ease-in-out infinite; }',
    '.sv-c-zar{ animation:gyYanSon 1.4s ease-in-out infinite; }',
    '.sv-c-skor{ animation:svZipla 1.6s ease-in-out infinite; }',
    '.sv-c-teslim{ stroke-dasharray:10; animation:gyCizC 2.4s ease-in-out infinite; }',
    '.sv-c-soru{ animation:gyYanSon 2s ease-in-out infinite; }',
    '@keyframes svZipla{ 0%,100%{ transform:none; } 50%{ transform:translateY(-2px); } }',
    /* 3) MEYDAN OKUMA */
    '.sv-mo{ transform-box:fill-box; transform-origin:center; animation:svMo 9s ease-in-out infinite; }',
    '@keyframes svMo{ 0%,5%{ transform:scale(1); } 8%{ transform:scale(1.15); } 10%{ transform:scale(.9); } 12%,100%{ transform:scale(1); } }',
    '.sv-simsek{ opacity:0; animation:svSimsek 9s linear infinite; }',
    '@keyframes svSimsek{ 0%,11%{ opacity:0; transform:translate(140px,56px) scale(.5); } 13%{ opacity:1; transform:translate(156px,36px) scale(1) rotate(-10deg); }',
    '  17%{ transform:translate(200px,18px) rotate(0); } 21%{ transform:translate(270px,16px) rotate(10deg); } 25%{ opacity:1; transform:translate(328px,40px) rotate(18deg) scale(1); }',
    '  28%,100%{ opacity:0; transform:translate(344px,58px) scale(.4); } }',
    '.sv-davet{ animation:svDavet 9s ease-out infinite both; }',
    '@keyframes svDavet{ 0%,25%{ opacity:0; } 28%,36%{ opacity:1; } 40%,100%{ opacity:0; } }',
    '.sv-kabul{ transform-box:fill-box; transform-origin:center; animation:svKabul 9s ease-in-out infinite; }',
    '@keyframes svKabul{ 0%,31%{ transform:scale(1); } 33%{ transform:scale(1.3); } 35%{ transform:scale(.9); } 37%,100%{ transform:scale(1); } }',
    '.sv-vs{ transform-box:fill-box; transform-origin:center; animation:svVs 9s cubic-bezier(.3,1.5,.6,1) infinite both; }',
    '@keyframes svVs{ 0%,37%{ opacity:0; transform:scale(.2); } 41%,70%{ opacity:1; transform:scale(1); } 73%,100%{ opacity:0; transform:scale(.6); } }',
    '.sv-mp{ transform-box:fill-box; transform-origin:0 50%; animation:svMp1 9s ease-in-out infinite both; }',
    '.sv-mp.n2{ animation-name:svMp2; }',
    '@keyframes svMp1{ 0%,41%{ transform:scaleX(0); } 62%,94%{ transform:scaleX(1); } 98%,100%{ transform:scaleX(0); } }',
    '@keyframes svMp2{ 0%,41%{ transform:scaleX(0); } 52%{ transform:scaleX(.55); } 66%,94%{ transform:scaleX(.82); } 98%,100%{ transform:scaleX(0); } }',
    '.sv-ms{ font-size:19px; transform-box:fill-box; transform-origin:center; animation:svMs 9s ease-out infinite both; }',
    '.sv-ms.n2{ animation-delay:.3s; }',
    '@keyframes svMs{ 0%,64%{ opacity:0; transform:translateY(6px); } 68%,94%{ opacity:1; transform:none; } 98%,100%{ opacity:0; } }',
    '.sv-kazan{ opacity:0; }',
    '.sv-kazan.n1{ transform-box:fill-box; transform-origin:center; animation:svKazan 9s ease-out infinite both; }',
    '@keyframes svKazan{ 0%,74%{ opacity:0; transform:scale(.4); } 78%,94%{ opacity:1; transform:scale(1); } 98%,100%{ opacity:0; } }',
    '.sv-kupa{ transform-box:fill-box; transform-origin:50% 100%; animation:svKupa 9s cubic-bezier(.3,1.5,.6,1) infinite both; }',
    '@keyframes svKupa{ 0%,71%{ opacity:0; transform:scale(.2) translateY(10px); } 76%,93%{ opacity:1; transform:none; } 97%,100%{ opacity:0; } }',
    '.sv-konfeti{ animation:svKonfeti 9s ease-out infinite both; }',
    '@keyframes svKonfeti{ 0%,73%{ opacity:0; transform:translateY(8px); } 77%{ opacity:1; } 92%{ opacity:1; transform:translateY(-6px); } 96%,100%{ opacity:0; } }',
    '.sv-c-yildiz{ fill:currentColor; animation:gyYanSon 2s ease-in-out infinite; }',
    '.sv-c-hedef{ fill:currentColor; animation:gyNabiz 1.4s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }',
    '.sv-c-anahtar{ fill:currentColor; animation:svAnahtar 2.4s ease-in-out infinite; }',
    '@keyframes svAnahtar{ 0%,100%{ transform:none; } 50%{ transform:translateX(-9px); } }',
    /* hareketi azalt: son hâl durağan */
    '@media (prefers-reduced-motion:reduce){',
    '  .sv-svg *, .sv-adim, .ty-cip svg *{ animation:none !important; }',
    '  .sv-kagit, .sv-uc, .sv-imlec, .sv-simsek, .sv-davet, .sv-vs{ opacity:0 !important; }',
    '  .sv-puan, .sv-top, .sv-tel, .sv-isaret, .sv-oto, .sv-kart-alt, .sv-not, .sv-tac, .sv-ms, .sv-kazan.n1, .sv-kupa, .sv-konfeti{ opacity:1 !important; transform:none !important; }',
    '  .sv-halka{ stroke-dashoffset:15 !important; } .sv-mp{ transform:none !important; } .sv-mp.n2{ transform:scaleX(.82) !important; }',
    '  ' + Object.keys(AH).map(function (k) { return '.sv-ah.' + k + ' .sv-zemin'; }).join(', ') + '{ fill:#16A085 !important; }',
    '  ' + Object.keys(AH).map(function (k) { return '.sv-ah.' + k + ' .sv-dugme'; }).join(', ') + '{ transform:translateX(9px) !important; }',
    OT.map(function (o, i) { return '  .sv-ot.n' + (i + 1) + '{ transform:' + px(o[2], o[3]) + ' !important; }'; }).join('\n'),
    '}'
  ].join('\n');
  try {
    if (!document.getElementById('svSinavStil')) {
      var s = document.createElement('style');
      s.id = 'svSinavStil';
      s.textContent = STIL;
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (e) { }
})();

/* >>> baskanprofil-gorsel (15.11.2026) >>> */
/* ---------------------------------------------------------------------------
   BAŞKAN VE YARDIMCI — KENDİ PROFİLİNDE (15.11.2026) — öğretmen: "sınıfta yeni kısmına başkan ve başkan
   yardımcısı ile ilgili bilgileri ekle".
     g: 'baskanprofil' — öğretmenin ekranında yetki anahtarları açılır; altın taç başkanın, gümüş taç
                         yardımcının telefonuna uçar; ikisi de profilindeki «Sınıfım» kartını açar; yetki verilen
                         araçlar tek tek yanar (başkanda dört, yardımcıda iki; ötekiler kapalı) (10 sn döngü)
   Biçim öteki görsellerle ortak (.ty-kutu, .ty-svg, .ty-cipler, .ty-cip, .ty-vurgu, .gy-kutu, .gy-yan);
   bu görsele özgü olanlar sp- önekli. Görsel küçük gösterildiğinden içinde yazı yok: anlatım maddelerde.
   «Hareketi azalt»ta son hâl durağan. _kaynak/uretici/baskanProfilGorsel.js — siniftaYeni20.py gömer.
   --------------------------------------------------------------------------- */
(function () {
  var G = window.KIDEF_SINIFTA_YENI_GORSEL = window.KIDEF_SINIFTA_YENI_GORSEL || {};
  var SIM = function (ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; };
  var CIP = function (ic, yazi) { return '<span class="ty-cip">' + SIM(ic) + yazi + '</span>'; };
  var OK = '<span class="gy-ok" aria-hidden="true">' + SIM('<path d="M3 12h15"/><path d="M14 7l5 5-5 5"/>') + '</span>';
  var ADIM = function (n, ic, yazi) { return '<span class="sp-adim sp-adm' + n + '">' + SIM(ic) + yazi + '</span>'; };

  /* taç: altın (başkan) ve gümüş (yardımcı); k = ölçek */
  var TAC = 'M-9 4L-9.6 -5L-4.4 -.4L0 -7L4.4 -.4L9.6 -5L9 4Z';
  var TACR = { b: ['#F5B301', '#B7791F', '#FDE68A'], y: ['#E2E8F0', '#64748B', '#FFFFFF'] };
  var tac = function (r, k) {
    return '<g transform="scale(' + k + ')"><path d="' + TAC + '" fill="' + TACR[r][0] + '" stroke="' + TACR[r][1] + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<circle cx="0" cy="-7" r="1.6" fill="' + TACR[r][2] + '"/></g>';
  };
  var TIK = function (cx, cy, r, renk) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + renk + '"/>' +
      '<path d="M' + (cx - r * .45) + ' ' + cy + 'l' + (r * .32) + ' ' + (r * .32) + ' ' + (r * .62) + ' -' + (r * .64) + '" fill="none" stroke="#fff" stroke-width="' + (r * .3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  };

  /* ------------------------------------------------ zaman çizelgesi (10 sn döngü, % olarak) */
  var KF = [], VAR = {};
  var tek = function (ad, kural) { if (!VAR[ad]) { VAR[ad] = 1; KF.push(kural); } };
  /* belirme: aşağıdan hafifçe yükselir */
  var BEL = function (t) {
    tek('b' + t, '.sp-b' + t + '{ opacity:0; animation:spB' + t + ' 10s ease-out infinite both; }\n' +
      '@keyframes spB' + t + '{ 0%,' + t + '%{ opacity:0; transform:translateY(5px); } ' + (t + 3) + '%,94%{ opacity:1; transform:none; } 98%,100%{ opacity:0; transform:none; } }');
    return 'sp-a sp-b' + t;
  };
  /* sıçrayarak belirme (rozet, onay işareti) */
  var POP = function (t) {
    tek('o' + t, '.sp-o' + t + '{ opacity:0; transform-box:fill-box; transform-origin:center; animation:spO' + t + ' 10s ease-out infinite both; }\n' +
      '@keyframes spO' + t + '{ 0%,' + t + '%{ opacity:0; transform:scale(.2); } ' + (t + 2.5) + '%{ opacity:1; transform:scale(1.3); } ' + (t + 4.5) + '%,94%{ opacity:1; transform:scale(1); } 98%,100%{ opacity:0; transform:scale(1); } }');
    return 'sp-a sp-o' + t;
  };
  /* ok işareti: kapalıyken sağa bakar, açılınca aşağı döner */
  var CHEV = function (t) {
    tek('c' + t, '.sp-c' + t + '{ transform-box:fill-box; transform-origin:center; animation:spC' + t + ' 10s ease-in-out infinite both; }\n' +
      '@keyframes spC' + t + '{ 0%,' + t + '%{ transform:rotate(-90deg); } ' + (t + 3) + '%,94%{ transform:none; } 97%,100%{ transform:rotate(-90deg); } }');
    return 'sp-a sp-c' + t;
  };
  /* yetki anahtarı: gri → yeşil, düğme sağa kayar */
  var ANA = function (x, y, t) {
    var z = '<rect x="' + x + '" y="' + y + '" width="14" height="7" rx="3.5" ';
    if (t == null) return z + 'fill="#CBD5E1"/><circle cx="' + (x + 3.8) + '" cy="' + (y + 3.5) + '" r="2.5" fill="#fff"/>';
    tek('z' + t, '.sp-z' + t + '{ animation:spZ' + t + ' 10s ease-in-out infinite both; } .sp-d' + t + '{ animation:spD' + t + ' 10s ease-in-out infinite both; }\n' +
      '@keyframes spZ' + t + '{ 0%,' + t + '%{ fill:#CBD5E1; } ' + (t + 2) + '%,94%{ fill:#16A085; } 97%,100%{ fill:#CBD5E1; } }\n' +
      '@keyframes spD' + t + '{ 0%,' + t + '%{ transform:none; } ' + (t + 2) + '%,94%{ transform:translateX(7px); } 97%,100%{ transform:none; } }');
    return z + 'class="sp-z sp-z' + t + '" fill="#CBD5E1"/><circle class="sp-d sp-d' + t + '" cx="' + (x + 3.8) + '" cy="' + (y + 3.5) + '" r="2.5" fill="#fff"/>';
  };

  /* ------------------------------------------------------------------ telefon */
  var IC = {
    zil: ['#F39C12', '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'],
    takvim: ['#E74C3C', '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'],
    liste: ['#2563EB', '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>'],
    zar: ['#7C3AED', '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="#7C3AED"/><circle cx="15" cy="15" r="1.2" fill="#7C3AED"/><circle cx="15" cy="9" r="1.2" fill="#7C3AED"/><circle cx="9" cy="15" r="1.2" fill="#7C3AED"/>']
  };
  /* araç satırı: simge + yazı çizgisi; kısa süre sonra yeşil onay */
  var SATIR = function (y, ad, t, w) {
    var ik = IC[ad];
    return '<g class="' + BEL(t) + '">' +
      '<rect x="8" y="' + y + '" width="128" height="17" rx="6" fill="#FFF7ED" stroke="#F3D5BF"/>' +
      '<g transform="translate(13 ' + (y + 2.5) + ') scale(.5)" fill="none" stroke="' + ik[0] + '" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">' + ik[1] + '</g>' +
      '<rect x="30" y="' + (y + 6) + '" width="' + w + '" height="5" rx="2.5" fill="#E5CDBB"/></g>' +
      '<g class="' + POP(t + 3) + '">' + TIK(124, y + 8.5, 5.6, '#16A085') + '</g>';
  };
  /* kapalı araçlar: kesik çizgili kutu ve asma kilit */
  var KAPALI = function (t) {
    return '<g class="' + BEL(t) + '">' +
      '<rect x="8" y="140" width="128" height="38" rx="9" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 3.2"/>' +
      '<g transform="translate(72 153)" fill="none" stroke="#94A3B8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="-6" y="-2" width="12" height="9" rx="2"/><path d="M-3.4 -2v-3a3.4 3.4 0 0 1 6.8 0v3"/></g>' +
      '<rect x="46" y="165" width="52" height="4" rx="2" fill="#E2E8F0"/></g>';
  };
  /* ox: ekranın sol kenarı; r: 'b' başkan, 'y' yardımcı; tR rozet, tC ok, tB başlık zamanı */
  var TEL = function (ox, r, renk, tR, tC, tB, satirlar, kapali) {
    var s = '<rect x="' + (ox - 6) + '" y="8" width="156" height="198" rx="18" fill="#1F2937"/>' +
      '<rect x="' + ox + '" y="14" width="144" height="186" rx="13" fill="#fff"/>' +
      '<g transform="translate(' + ox + ' 14)">' +
      '<rect x="52" y="5" width="40" height="4" rx="2" fill="#E2E8F0"/>' +
      /* profil başı: avatar + ad çizgileri (taç avatarın üstüne iner) */
      '<circle cx="26" cy="34" r="12" fill="' + renk + '"/><circle cx="26" cy="29" r="4.4" fill="#fff"/><path d="M17.2 43.4a8.8 8.8 0 0 1 17.6 0z" fill="#fff"/>' +
      '<rect x="46" y="26" width="64" height="7" rx="3.5" fill="#CBD5E1"/><rect x="46" y="38" width="42" height="5" rx="2.5" fill="#E2E8F0"/>' +
      /* «Sınıfım» kartının başlığı: kırmızı şerit, rozet (taçlı), ok */
      '<rect x="8" y="54" width="128" height="24" rx="8" fill="#fff" stroke="#F3D5BF" stroke-width="1.5"/>' +
      '<rect x="12" y="58" width="4" height="16" rx="2" fill="#C0392B"/>' +
      '<rect x="21" y="63" width="42" height="6" rx="3" fill="#F1C9C4"/>' +
      '<g class="' + POP(tR) + '"><rect x="68" y="60" width="46" height="13" rx="6.5" fill="#FDEBD0"/>' +
        '<g transform="translate(78 67)">' + tac(r, .52) + '</g><rect x="85" y="64.6" width="22" height="4.4" rx="2.2" fill="#E0B27A"/></g>' +
      '<path class="' + CHEV(tC) + '" d="M121.5 63l4.5 4.8 4.5-4.8" fill="none" stroke="#C49A7E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      /* kart açılınca: taçlı başlık çizgisi ve yetkili araçlar */
      '<g class="' + BEL(tB) + '"><g transform="translate(15 91)">' + tac(r, .55) + '</g><rect x="23" y="88.5" width="66" height="5.5" rx="2.75" fill="#F0C9A8"/></g>';
    satirlar.forEach(function (a, i) { s += SATIR(98 + i * 21, a[0], a[1], a[2]); });
    if (kapali) s += KAPALI(kapali);
    return s + '</g>';
  };

  /* ------------------------------------------------ öğretmenin ekranı (ortada) */
  var MERKEZ =
    '<rect x="206" y="76" width="68" height="46" rx="7" fill="#1F2937"/>' +
    '<rect x="211" y="81" width="58" height="36" rx="3.5" fill="#fff"/>' +
    '<path d="M211 84.5a3.5 3.5 0 0 1 3.5-3.5h51a3.5 3.5 0 0 1 3.5 3.5V91h-58z" fill="#B45309"/>' +
    '<g transform="translate(230 86)">' + tac('b', .6) + '</g><g transform="translate(252 86)">' + tac('y', .6) + '</g>' +
    ANA(223, 96, 6) + ANA(245, 96, 8) + ANA(223, 106, 10) + ANA(245, 106, null) +
    '<rect x="236" y="122" width="8" height="7" fill="#475569"/><rect x="224" y="129" width="32" height="5" rx="2.5" fill="#475569"/>' +
    /* yetkinin telefonlara aktığı kesik çizgiler */
    '<g class="sp-ak" fill="none" stroke="#B45309" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path class="sp-akis" d="M203 99H187"/><path d="M191 93.6l-5.4 5.4 5.4 5.4"/>' +
      '<path class="sp-akis" d="M277 99H293"/><path d="M289 93.6l5.4 5.4-5.4 5.4"/></g>';
  /* uçan taçlar: yerleşecekleri yere göre kaydırılmış başlar (son hâl: transform yok) */
  var TACLAR =
    '<g transform="translate(56 31)"><g class="sp-a sp-tacb">' + tac('b', 1.3) + '</g></g>' +
    '<g transform="translate(332 31)"><g class="sp-a sp-tacy">' + tac('y', 1.3) + '</g></g>';

  var SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg sp-svg" viewBox="0 0 480 214" role="img" aria-label="Öğretmen yetki anahtarlarını açıyor; başkana altın, yardımcıya gümüş taç uçuyor; ikisi de kendi telefonunda profilindeki Sınıfım kartını açıyor; başkanda dört, yardımcıda iki yetkili araç yanıyor, ötekiler kapalı">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#FFF6EC"/>' +
    TEL(30, 'b', '#16A085', 22, 23, 24, [['zil', 28, 52], ['takvim', 33, 40], ['liste', 38, 58], ['zar', 43, 46]], 0) +
    TEL(306, 'y', '#2563EB', 28, 29, 30, [['zil', 31, 52], ['zar', 37, 46]], 44) +
    MERKEZ + TACLAR + '</svg>';

  var VURGU = '<div class="ty-vurgu gy-vurgu gy-yan"><span class="ty-gizli">Yetkiyi ver; başkan ve yardımcı profilindeki Sınıfım kartını açıp görevini yapsın</span>' +
    ADIM(1, '<rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="16.6" cy="12" r="2.8"/>', 'Yetki ver') + OK +
    ADIM(2, '<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M10.6 18.6h2.8"/>', 'Profilini açar') + OK +
    ADIM(3, '<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'Görevini yapar') + '</div>';

  var CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<g class="sp-c-tac"><path d="M3 18l-1-11 5.5 4.6L12 4l4.5 7.6L22 7l-1 11z"/></g><path d="M3 21h18"/>', 'Başkan ve yardımcı') +
    CIP('<rect x="2" y="7" width="20" height="10" rx="5"/><circle class="sp-c-dugme" cx="8" cy="12" r="2.8"/>', 'Ayrı ayrı yetki') +
    CIP('<path d="M9 6h11M9 12h11M9 18h11"/><path class="sp-c-onay" d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>', 'Ödev durumu') +
    CIP('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/><path class="sp-c-gozle" d="M4 4l16 16"/>', 'Puanları göremez') +
    CIP('<g class="sp-c-el"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5V4a1.5 1.5 0 0 1 3 0v8M14 11.5V5.5a1.5 1.5 0 0 1 3 0V14"/><path d="M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.5 15a1.5 1.5 0 0 1 2.3-2L8 14.3"/></g>', 'Dürtme') +
    CIP('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><g class="sp-c-kagit"><path d="M7 14h10v7H7z"/></g>', 'A4 oturma planı') +
    '</div>';
  G.baskanprofil = SAHNE + VURGU + CIPLER + '</div>';

  /* ------------------------------------------------------------------ biçim */
  var RENK = [['#FFF1D6', '#B45309', '#F6C878'], ['#E8F6F2', '#0E7C66', '#A9DFCB'], ['#F3E8FF', '#7B1FA2', '#D8B4FE']];
  var SONUK = 'background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none;';
  var PARLAK = function (i) { return 'background:' + RENK[i][0] + '; color:' + RENK[i][1] + '; border-color:' + RENK[i][2] + '; transform:translateY(-2px);'; };
  var S1 = 24, S2 = 32;        /* adımların bittiği yüzde: yetki ver → «Sınıfım»ı açar → görevini yapar */
  var STIL = [
    '.sp-adim{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px 6px 9px; border-radius:12px; background:#F1F5F9; color:#64748B;',
    '  border:1.5px solid #E2E8F0; animation-duration:10s; animation-timing-function:ease-in-out; animation-iteration-count:infinite; }',
    '.sp-adm1{ animation-name:spA1; } .sp-adm2{ animation-name:spA2; } .sp-adm3{ animation-name:spA3; }',
    '@keyframes spA1{ 0%,' + (S1 - 3) + '%{ ' + PARLAK(0) + ' } ' + S1 + '%,96%{ ' + SONUK + ' } 100%{ ' + PARLAK(0) + ' } }',
    '@keyframes spA2{ 0%,' + (S1 - 3) + '%{ ' + SONUK + ' } ' + S1 + '%,' + (S2 - 3) + '%{ ' + PARLAK(1) + ' } ' + S2 + '%,100%{ ' + SONUK + ' } }',
    '@keyframes spA3{ 0%,' + (S2 - 3) + '%{ ' + SONUK + ' } ' + S2 + '%,93%{ ' + PARLAK(2) + ' } 97%,100%{ ' + SONUK + ' } }',
    /* taçlar yerlerine uçar: başkana altın (≈%12-22), yardımcıya gümüş (≈%17-28) */
    '.sp-tacb{ opacity:0; animation:spTacB 10s ease-in-out infinite both; }',
    '.sp-tacy{ opacity:0; animation:spTacY 10s ease-in-out infinite both; }',
    '@keyframes spTacB{ 0%,11%{ opacity:0; transform:translate(184px,65px) scale(.3); } 12.5%{ opacity:1; transform:translate(176px,50px) scale(.7); }',
    '  16%{ opacity:1; transform:translate(116px,-30px) scale(1.15) rotate(-14deg); } 19.5%{ opacity:1; transform:translate(30px,-16px) scale(1.2) rotate(-6deg); }',
    '  22%,94%{ opacity:1; transform:none; } 98%,100%{ opacity:0; transform:none; } }',
    '@keyframes spTacY{ 0%,16%{ opacity:0; transform:translate(-92px,65px) scale(.3); } 17.5%{ opacity:1; transform:translate(-84px,50px) scale(.7); }',
    '  21%{ opacity:1; transform:translate(-56px,-30px) scale(1.15) rotate(14deg); } 24.5%{ opacity:1; transform:translate(-18px,-16px) scale(1.2) rotate(6deg); }',
    '  28%,94%{ opacity:1; transform:none; } 98%,100%{ opacity:0; transform:none; } }',
    /* yetkinin aktığı çizgiler: araçlar yanarken görünür */
    '.sp-ak{ opacity:0; animation:spAk 10s linear infinite both; }',
    '@keyframes spAk{ 0%,25%{ opacity:0; } 28%,46%{ opacity:1; } 50%,100%{ opacity:0; } }',
    '.sp-akis{ stroke-dasharray:3 6; animation:tyAkis .9s linear infinite; }',
    KF.join('\n'),
    /* seçim çipleri (küçük, sürekli) */
    '.sp-c-tac{ transform-box:fill-box; transform-origin:50% 100%; animation:spSalla 2.4s ease-in-out infinite; }',
    '@keyframes spSalla{ 0%,100%{ transform:rotate(-8deg); } 50%{ transform:rotate(8deg); } }',
    '.sp-c-dugme{ fill:currentColor; animation:spKay 2.4s ease-in-out infinite; }',
    '@keyframes spKay{ 0%,100%{ transform:none; } 50%{ transform:translateX(8px); } }',
    '.sp-c-onay{ stroke-dasharray:10; animation:gyCizC 2.4s ease-in-out infinite; }',
    '.sp-c-gozle{ stroke-dasharray:28; animation:gyCizC 2.8s ease-in-out infinite; }',
    '.sp-c-el{ transform-box:fill-box; transform-origin:50% 100%; animation:spDurt 1.6s ease-in-out infinite; }',
    '@keyframes spDurt{ 0%,100%{ transform:none; } 50%{ transform:translateY(-2px) rotate(-7deg); } }',
    '.sp-c-kagit{ animation:spKagit 2.4s ease-in-out infinite; }',
    '@keyframes spKagit{ 0%,100%{ transform:translateY(2px); } 50%{ transform:translateY(-1px); } }',
    /* hareketi azalt: son hâl durağan */
    '@media (prefers-reduced-motion:reduce){',
    '  .sp-svg *, .sp-adim, .ty-cip svg *{ animation:none !important; }',
    '  .sp-svg .sp-a{ opacity:1 !important; transform:none !important; }',
    '  .sp-svg .sp-ak{ opacity:0 !important; }',
    '  .sp-svg .sp-z{ fill:#16A085 !important; } .sp-svg .sp-d{ transform:translateX(7px) !important; }',
    '}'
  ].join('\n');
  try {
    if (!document.getElementById('spProfilStil')) {
      var s = document.createElement('style');
      s.id = 'spProfilStil';
      s.textContent = STIL;
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (e) { }
})();
/* <<< baskanprofil-gorsel <<< */

/* >>> canliders-gorsel (23.11.2026) >>> */
/* ---------------------------------------------------------------------------
   CANLI DERS GÖRSELİ (23.11.2026) — yönetici: "canlı ders özelliğini de aktif edelim, sadece destek verenler
   kullanabilecek, ayrıca sitede yeni kısmına bu özelliği ekleyelim".
     g: 'canliders' — soldaki bilgisayarda öğretmenin açtığı sayfa; sağdaki telefonda önce «Derse katıl» çağrısı
                      çalar, öğrenci katılınca aynı sayfa onun ekranında açılır; lazer ve vurgu iki ekranda birlikte
                      gezer; ses iki yönde akar (12 sn döngü)
   Biçim öteki görsellerle ortak (.ty-kutu, .ty-svg, .ty-cipler, .ty-cip, .ty-vurgu, .gy-kutu, .gy-yan);
   bu görsele özgü olanlar cld- önekli. Görsel küçük gösterildiğinden içinde yazı yok: anlatım maddelerde.
   «Hareketi azalt»ta son hâl durağan. _kaynak/uretici/canliDersGorsel.js — canliDestek.py gömer.
   --------------------------------------------------------------------------- */
(function () {
  var G = window.KIDEF_SINIFTA_YENI_GORSEL = window.KIDEF_SINIFTA_YENI_GORSEL || {};
  var SIM = function (ic) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ic + '</svg>'; };
  var CIP = function (ic, yazi) { return '<span class="ty-cip">' + SIM(ic) + yazi + '</span>'; };
  var OK = '<span class="gy-ok" aria-hidden="true">' + SIM('<path d="M3 12h15"/><path d="M14 7l5 5-5 5"/>') + '</span>';
  var ADIM = function (n, ic, yazi) { return '<span class="cld-adim cld-adm' + n + '">' + SIM(ic) + yazi + '</span>'; };

  /* ders sayfası (100 × 56): iki ekranda aynı çizilir; lazer ve vurgu aynı zaman çizelgesinde gezer */
  var SAYFA = function (x, y, k) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">' +
      '<rect width="100" height="56" rx="4" fill="#fff" stroke="#DCE5EC" stroke-width="1"/>' +
      '<path d="M0 4a4 4 0 0 1 4-4h92a4 4 0 0 1 4 4v5H0z" fill="#E8F6F2"/>' +
      '<rect x="4" y="3" width="26" height="3.4" rx="1.7" fill="#16A085"/>' +
      '<rect class="cld-vur" x="3" y="19.2" width="44" height="6.4" rx="2" fill="#FDE68A"/>' +
      '<rect x="4" y="14" width="46" height="3.2" rx="1.6" fill="#CBD5E1"/>' +
      '<rect x="4" y="21" width="40" height="3.2" rx="1.6" fill="#94A3B8"/>' +
      '<rect x="4" y="28" width="44" height="3.2" rx="1.6" fill="#CBD5E1"/>' +
      '<rect x="4" y="35" width="30" height="3.2" rx="1.6" fill="#CBD5E1"/>' +
      '<rect x="4" y="43" width="38" height="3.2" rx="1.6" fill="#E2E8F0"/>' +
      '<rect x="4" y="49" width="26" height="3.2" rx="1.6" fill="#E2E8F0"/>' +
      '<rect x="58" y="14" width="38" height="6" rx="3" fill="#16324F"/>' +
      '<rect x="70" y="22" width="26" height="3" rx="1.5" fill="#94A3B8"/>' +
      '<rect x="56" y="30" width="40" height="20" rx="3" fill="#E8F6F2"/>' +
      '<circle cx="66" cy="37.5" r="3.4" fill="#F6C878"/>' +
      '<path d="M56 50l11-8.5 8 5.5 7-4.5 14 7.5z" fill="#A9DFCB"/>' +
      '<g class="cld-lazer"><circle r="5.2" fill="#E74C3C" opacity=".25"/><circle r="2.4" fill="#E74C3C"/></g>' +
      '</g>';
  };
  /* ses çubukları: kapsayıcı x,y; üç çubuk */
  var SES = function (x, y, renk) {
    var s = '';
    for (var i = 0; i < 4; i++) {
      s += '<rect class="cld-eq cld-eq' + i + '" x="' + (x + i * 6) + '" y="' + (y - 7) + '" width="3.6" height="14" rx="1.8" fill="' + renk + '"/>';
    }
    return s;
  };

  var SAHNE =
    '<div class="ty-kutu gy-kutu"><svg class="ty-svg cld-svg" viewBox="0 0 480 214" role="img" aria-label="Öğretmenin bilgisayarında açtığı sayfa, öğrencinin telefonunda aynı anda açılıyor; ses iki yönde akıyor">' +
    '<rect x="0" y="0" width="480" height="214" rx="16" fill="#F4F8FB"/>' +
    '<path d="M0 176H480V198a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16Z" fill="#E7F2EF"/>' +
    '<path d="M0 176H480" stroke="#CFE3DD" stroke-width="2"/>' +
    /* öğretmenin bilgisayarı */
    '<rect x="10" y="154" width="190" height="9" rx="4.5" fill="#94A3B8"/>' +
    '<rect x="22" y="30" width="166" height="126" rx="9" fill="#1F2937"/>' +
    '<rect x="28" y="36" width="154" height="114" rx="5" fill="#F8FAFC"/>' +
    '<rect x="28" y="36" width="154" height="17" rx="5" fill="#fff"/>' +
    '<circle class="cld-halka" cx="40" cy="44.5" r="3.6" fill="#E74C3C"/><circle cx="40" cy="44.5" r="3.6" fill="#E74C3C"/>' +
    '<rect x="49" y="42.5" width="24" height="4" rx="2" fill="#F5B7B1"/>' +
    '<g class="cld-ses">' + SES(152, 44.5, '#16A085') + '</g>' +
    SAYFA(40, 62, 1.3) +
    /* öğrencinin telefonu */
    '<rect x="338" y="10" width="104" height="194" rx="19" fill="#1F2937"/>' +
    '<rect x="344" y="17" width="92" height="180" rx="14" fill="#fff"/>' +
    '<rect x="368" y="21" width="44" height="4" rx="2" fill="#E2E8F0"/>' +
    '<circle cx="354" cy="40" r="6" fill="#2563EB"/><rect x="364" y="36" width="34" height="4.6" rx="2.3" fill="#CBD5E1"/><rect x="364" y="43" width="22" height="3.6" rx="1.8" fill="#E2E8F0"/>' +
    /* çağrı kartı: zil çalar, «Derse katıl» basılır */
    '<g class="cld-cagri">' +
      '<rect x="350" y="66" width="80" height="88" rx="12" fill="#FFF7ED" stroke="#F3D5BF"/>' +
      '<circle cx="390" cy="92" r="15" fill="#FFE8CC"/>' +
      '<g class="cld-zil"><g transform="translate(378 80) scale(1)" fill="none" stroke="#F39C12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></g></g>' +
      '<rect x="362" y="114" width="56" height="5" rx="2.5" fill="#E5CDBB"/>' +
      '<g class="cld-tus"><rect x="362" y="128" width="56" height="18" rx="9" fill="#16A085"/><rect x="376" y="135" width="28" height="4" rx="2" fill="#fff"/></g>' +
      '<circle class="cld-dokun" cx="390" cy="137" r="7" fill="none" stroke="#16A085" stroke-width="2"/>' +
    '</g>' +
    /* öğrenci katılınca: aynı sayfa, altında ses çubukları */
    '<g class="cld-sayfa2">' +
      SAYFA(350, 56, .8) +
      '<rect x="350" y="108" width="80" height="4.4" rx="2.2" fill="#E2E8F0"/><rect x="350" y="117" width="56" height="4.4" rx="2.2" fill="#E2E8F0"/>' +
      '<rect x="354" y="160" width="72" height="24" rx="12" fill="#E8F6F2"/>' +
      '<g class="cld-ses">' + SES(372, 172, '#16A085') + '</g>' +
    '</g>' +
    /* akışlar: sayfa (yeşil, öğretmenden öğrenciye) ve ses (turuncu, geri) */
    '<g class="cld-akis" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<path class="cld-ileri" d="M198 82C236 40 296 40 332 82" stroke="#16A085" stroke-width="3"/>' +
      '<path d="M325 74l7.5 8-9.4 3" stroke="#16A085" stroke-width="3"/>' +
      '<path class="cld-geri" d="M336 128C298 164 238 164 202 128" stroke="#F39C12" stroke-width="3"/>' +
      '<path d="M209 134l-7.5-6 9.4-3" stroke="#F39C12" stroke-width="3"/>' +
      '<circle cx="267" cy="48" r="11" fill="#fff" stroke="#BFE8D8" stroke-width="1.6"/>' +
      '<g transform="translate(257.5 38.5) scale(.8)" stroke="#16A085" stroke-width="2"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 20h8"/></g>' +
      '<circle cx="269" cy="152" r="11" fill="#fff" stroke="#F6D7A1" stroke-width="1.6"/>' +
      '<g transform="translate(259.5 142.5) scale(.8)" stroke="#F39C12" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></g>' +
    '</g>' +
    '</svg>';

  var VURGU = '<div class="ty-vurgu gy-vurgu gy-yan"><span class="ty-gizli">Öğrencini çağır; katılınca açtığın sayfa onun ekranında açılır, ses iki yönde akar</span>' +
    ADIM(1, '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>', 'Öğrencini çağır') + OK +
    ADIM(2, '<rect x="6.5" y="2.5" width="11" height="19" rx="2.4"/><path d="M10.6 18.6h2.8"/>', 'Katılır') + OK +
    ADIM(3, '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>', 'Birlikte çalışın') + '</div>';

  var CIPLER = '<div class="ty-cipler gy-cipler">' +
    CIP('<rect class="cld-c-mik" x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>', 'Sesli ders') +
    CIP('<rect x="2" y="4" width="13" height="10" rx="1.8"/><path d="M6 18h5"/><rect x="17" y="9" width="5" height="10" rx="1.4"/><path class="cld-c-akis" d="M15.6 9.2h1M15.6 12h1"/>', 'Ekranın öğrencinde') +
    CIP('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/><path class="cld-c-arti" d="M11 8v6M8 11h6"/>', 'Kendi ekranında keskin') +
    CIP('<rect x="2" y="6" width="14" height="12" rx="2.4"/><path class="cld-c-kam" d="M16 10.5l6-3.5v10l-6-3.5z"/>', 'Kamera isteğe bağlı') +
    CIP('<path class="cld-c-kalp" d="M12 20.5C6 16.4 3.5 12.6 5.4 9.6c1.6-2.5 4.9-2.3 6.6.3 1.7-2.6 5-2.8 6.6-.3 1.9 3-.6 6.8-6.6 10.9z"/>', 'Destekçilere açık') +
    '</div>';
  G.canliders = SAHNE + VURGU + CIPLER + '</div>';

  /* ------------------------------------------------------------------ biçim */
  var RENK = [['#FFF1D6', '#B45309', '#F6C878'], ['#E8F6F2', '#0E7C66', '#A9DFCB'], ['#E0ECFF', '#1D4ED8', '#B6CEF8']];
  var SONUK = 'background:#F1F5F9; color:#64748B; border-color:#E2E8F0; transform:none;';
  var PARLAK = function (i) { return 'background:' + RENK[i][0] + '; color:' + RENK[i][1] + '; border-color:' + RENK[i][2] + '; transform:translateY(-2px);'; };
  var S1 = 17, S2 = 25;        /* adımların bittiği yüzde: çağır → katılır → birlikte çalışın */
  var STIL = [
    '.cld-adim{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px 6px 9px; border-radius:12px; background:#F1F5F9; color:#64748B;',
    '  border:1.5px solid #E2E8F0; animation-duration:12s; animation-timing-function:ease-in-out; animation-iteration-count:infinite; }',
    '.cld-adm1{ animation-name:cldA1; } .cld-adm2{ animation-name:cldA2; } .cld-adm3{ animation-name:cldA3; }',
    '@keyframes cldA1{ 0%,' + (S1 - 3) + '%{ ' + PARLAK(0) + ' } ' + S1 + '%,96%{ ' + SONUK + ' } 100%{ ' + PARLAK(0) + ' } }',
    '@keyframes cldA2{ 0%,' + (S1 - 3) + '%{ ' + SONUK + ' } ' + S1 + '%,' + (S2 - 3) + '%{ ' + PARLAK(1) + ' } ' + S2 + '%,100%{ ' + SONUK + ' } }',
    '@keyframes cldA3{ 0%,' + (S2 - 3) + '%{ ' + SONUK + ' } ' + S2 + '%,93%{ ' + PARLAK(2) + ' } 97%,100%{ ' + SONUK + ' } }',
    /* çağrı kartı: belirir, zil çalar, düğme basılır, kart kaybolur */
    '.cld-cagri{ opacity:0; animation:cldCagri 12s ease-in-out infinite both; }',
    '@keyframes cldCagri{ 0%{ opacity:0; transform:translateY(6px); } 3%,17%{ opacity:1; transform:none; } 22%,100%{ opacity:0; transform:translateY(-4px); } }',
    '.cld-zil{ transform-box:fill-box; transform-origin:50% 12%; animation:cldZil 12s ease-in-out infinite both; }',
    '@keyframes cldZil{ 0%,3%{ transform:rotate(0); } 5%{ transform:rotate(-16deg); } 7%{ transform:rotate(14deg); } 9%{ transform:rotate(-11deg); } 11%{ transform:rotate(8deg); } 13%{ transform:rotate(-4deg); } 15%,100%{ transform:rotate(0); } }',
    '.cld-tus{ transform-box:fill-box; transform-origin:50% 50%; animation:cldTus 12s ease-in-out infinite both; }',
    '@keyframes cldTus{ 0%,9%{ transform:none; } 11.5%{ transform:scale(1.1); } 14%{ transform:scale(1.04); } 15.5%{ transform:scale(.93); } 17%,100%{ transform:none; } }',
    '.cld-dokun{ opacity:0; transform-box:fill-box; transform-origin:50% 50%; animation:cldDokun 12s ease-out infinite both; }',
    '@keyframes cldDokun{ 0%,14.5%{ opacity:0; transform:scale(.4); } 15.5%{ opacity:.9; transform:scale(.8); } 19%,100%{ opacity:0; transform:scale(2.4); } }',
    /* öğrenci katılınca aynı sayfa onun telefonunda açılır */
    '.cld-sayfa2{ opacity:0; transform-box:fill-box; transform-origin:50% 30%; animation:cldSayfa2 12s ease-out infinite both; }',
    '@keyframes cldSayfa2{ 0%,19%{ opacity:0; transform:scale(.94); } 25%,94%{ opacity:1; transform:none; } 98%,100%{ opacity:0; transform:none; } }',
    /* akışlar */
    '.cld-akis{ opacity:0; animation:cldAkis 12s ease-in-out infinite both; }',
    '@keyframes cldAkis{ 0%,19%{ opacity:0; } 25%,94%{ opacity:1; } 98%,100%{ opacity:0; } }',
    '.cld-ileri{ stroke-dasharray:3 9; animation:tyAkis 1s linear infinite; }',
    '.cld-geri{ stroke-dasharray:3 9; animation:cldGeri 1s linear infinite; }',
    '@keyframes cldGeri{ to{ stroke-dashoffset:12; } }',
    /* lazer ve vurgu: iki ekranda aynı anda, sayfa koordinatında */
    '.cld-lazer{ opacity:0; animation:cldLazer 12s ease-in-out infinite both; }',
    '@keyframes cldLazer{ 0%,23%{ opacity:0; transform:translate(14px,20px); } 26%{ opacity:1; transform:translate(14px,20px); } 38%{ transform:translate(46px,22px); }',
    '  52%{ transform:translate(76px,17px); } 66%{ transform:translate(76px,39px); } 80%{ transform:translate(28px,38px); } 94%{ opacity:1; transform:translate(28px,38px); } 98%,100%{ opacity:0; transform:translate(28px,38px); } }',
    '.cld-vur{ opacity:0; animation:cldVur 12s ease-in-out infinite both; }',
    '@keyframes cldVur{ 0%,31%{ opacity:0; } 35%,58%{ opacity:.9; } 62%,100%{ opacity:0; } }',
    /* canlı işareti ve ses çubukları */
    '.cld-halka{ transform-box:fill-box; transform-origin:50% 50%; animation:cldHalka 1.6s ease-out infinite; }',
    '@keyframes cldHalka{ 0%{ transform:scale(1); opacity:.6; } 100%{ transform:scale(2.7); opacity:0; } }',
    '.cld-ses{ opacity:0; animation:cldAkis 12s ease-in-out infinite both; }',
    '.cld-eq{ transform-box:fill-box; transform-origin:50% 100%; animation:cldEq .9s ease-in-out infinite; }',
    '.cld-eq1{ animation-delay:-.3s; } .cld-eq2{ animation-delay:-.6s; } .cld-eq3{ animation-delay:-.15s; }',
    '@keyframes cldEq{ 0%,100%{ transform:scaleY(.3); } 50%{ transform:scaleY(1); } }',
    /* seçim çipleri (küçük, sürekli) */
    '.cld-c-mik{ transform-box:fill-box; transform-origin:50% 100%; animation:cldNefes 1.8s ease-in-out infinite; }',
    '@keyframes cldNefes{ 0%,100%{ transform:scaleY(1); } 50%{ transform:scaleY(.8); } }',
    '.cld-c-akis{ stroke-dasharray:1.4 1.6; animation:tyAkis 1s linear infinite; }',
    '.cld-c-arti{ transform-box:fill-box; transform-origin:50% 50%; animation:cldArti 2.2s ease-in-out infinite; }',
    '@keyframes cldArti{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.35); } }',
    '.cld-c-kam{ fill:currentColor; fill-opacity:0; animation:cldKam 2s ease-in-out infinite; }',
    '@keyframes cldKam{ 0%,60%,100%{ fill-opacity:0; } 80%{ fill-opacity:.9; } }',
    '.cld-c-kalp{ transform-box:fill-box; transform-origin:50% 55%; fill:currentColor; fill-opacity:.15; animation:cldKalp 1.5s ease-in-out infinite; }',
    '@keyframes cldKalp{ 0%,100%{ transform:scale(1); } 20%{ transform:scale(1.18); } 40%{ transform:scale(.98); } }',
    /* hareketi azalt: son hâl durağan */
    '@media (prefers-reduced-motion:reduce){',
    '  .cld-svg *, .cld-adim, .ty-cip svg *{ animation:none !important; }',
    '  .cld-svg .cld-cagri, .cld-svg .cld-dokun, .cld-svg .cld-halka{ opacity:0 !important; }',
    '  .cld-svg .cld-sayfa2, .cld-svg .cld-akis, .cld-svg .cld-ses, .cld-svg .cld-lazer{ opacity:1 !important; transform:none !important; }',
    '  .cld-svg .cld-lazer{ transform:translate(76px,39px) !important; } .cld-svg .cld-vur{ opacity:.9 !important; }',
    '}'
  ].join('\n');
  try {
    if (!document.getElementById('cldStil')) {
      var s = document.createElement('style');
      s.id = 'cldStil';
      s.textContent = STIL;
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (e) { }
})();
/* <<< canliders-gorsel <<< */
