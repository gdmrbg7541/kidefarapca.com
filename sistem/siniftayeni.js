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

   Site içi teknik duyuru şeridi ayrı yerde: sistem/yenilikler.js
   (öğretmen profilindeki "yenilik" şeridi).
   =========================================================================== */
window.KIDEF_SINIFTA_YENI = [
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
    ] },

  { t: '2026-10-26', e: 'Akıllı tahta', b: 'Tahtada, telefonda ve girişte kolaylıklar',
    L: [
      'Lazer ve büyüteç kumandada tahtanın oranında çalışır, kaydırma akıcı.',
      'Defterde yazdığın tahtaya canlı yansır.',
      'Kumandadan çıkınca Sınıf Ekranı da kendiliğinden kapanır.',
      'Telefonda Kelime Listeleri ekrana sığar; Word, Excel ve PDF indirilir.',
      'Videolarda ve etkinliklerde «Tam ekran» ve «Yeni sekmede» düğmeleri var.',
      'Giriş hataları artık Türkçe; «Şifremi unuttum» ile yeni şifre alırsın.'
    ] },

  { t: '2026-10-25', e: 'Okuma', b: 'Okuma hızını ölç, yarışmaya hazırlan',
    L: [
      'Okuma Hızlandırma: her sınıfa 18 okuma; Alfabe\'de ve sınıf materyallerinde.',
      'Süre tut, sesle birlikte hızlan ya da mikrofonla ölç; hız yıldızla değerlendirilir.',
      'Muhâdesede her cümlenin anlamını çağrıştıran animasyonlu bir resim var.',
      'Aylık Türkiye Arapça Yarışması: tarih açıklanınca ana sayfada geri sayım çıkar.',
      'Öğrenciler kendi hesabıyla katılır; sen katılmazsın, bağlantıyı paylaşırsın.'
    ] },


  /* 22.10.2026 — öğretmen: "sınıfta yeni kısmındaki ekranı yansıt kısmını güncelle, ilk
     duyuru olsun, kumanda özellikleri vs ekledik". 17.10'daki tahta kaydı bugünkü akışla
     yeniden yazıldı ve başa alındı (görsel aynı: g 'tahta'). */
  { t: '2026-10-22', e: 'Akıllı tahta', g: 'tahta', b: 'Tahtanın kumandası artık cebinde',
    m: 'Telefonla en kısası: «Karekodu tara» ile tahtadaki giriş karekodunu okut ve onayla, '
     + '«Bu telefon tahtanın kumandası olsun mu?» sorusuna «Evet» de; tahtada oturumun açılır, '
     + 'telefonun kumanda olur. Bilgisayardan yansıtacaksan tahtayı bir kez başlıktaki kumanda '
     + 'simgesinden «Sınıf Ekranı» olarak işaretle, bilgisayarda yeşil «Bu cihazı kumanda olarak '
     + 'kullan»a dokun. Açtığın sayfa, kaydırdığın yer, yazdığın kelime kablosuz olarak tahtada '
     + 'aynı anda görünür; şifre alanları tahtaya gitmez. Kumanda tuşundan «Perde» ile tahtayı '
     + 'karartır, «Duraklat» ile bekletirsin. «Lazer» açıkken parmağını gezdirdiğin kelimenin üstünde '
     + 'tahtada kırmızı nokta belirir ve bıraktığın yerde kalır, «Büyüteç» gezdirdiğin yeri tahtada '
     + 'yuvarlak bir mercekle büyütür; «Tahtadan da '
     + 'kullan»ı açarsan öğrenci tahtaya dokunarak çalışır. Ders sürerken telefonunun ekranı '
     + 'kararmaz; kilitlense de tahta sürer, '
     + 'açınca kaldığın yerden devam edersin. Kumanda tektir: başka bir cihazı kumanda yaparsan '
     + 'eskisi kendiliğinden bırakır. Dizinden, ayağından rahatsızsan ders boyunca masanda oturarak '
     + 'anlatırsın.' },

  { t: '2026-10-20', e: 'Destek', b: 'Kidef\'i birlikte ayakta tutuyoruz',
    /* 22.10.2026: dönemlik sabit pay (günlük tutar kalktı) · 23.10.2026: yapay zekâ yerine yayın, geliştirme ve emek */
    m: 'Sitenin yayın ve geliştirme giderleri ile materyallerin, oyunların, sınavların hazırlanmasından '
     + 'yayımlanmasına kadar süren öğretmen emeği, siteyi kullanan öğretmenler arasında paylaşılıyor. '
     + 'Profilindeki «Beklenen Destek» '
     + 'kartında bu dönemin desteğini görürsün: tutar dönem başında (Eylül ve Şubat) bir kez belirlenir, '
     + 'dönem boyunca değişmez; siteye katılan öğretmen arttıkça gelecek dönemin payı küçülür, yani '
     + 'meslektaşını davet etmek en iyi destek. Yeni katılanın ilk ayı bizden. Kartta herkesin birlikte '
     + 'doldurduğu «ortak hedef» çubuğu da var. Ödemen onaylanınca sana teşekkür mesajı gelir; profilinde destekçi rozeti belirir. '
     + 'Ana sayfadaki destekçiler şeridinde ve kartın altındaki köşede ad ve tutar yazılmaz; '
     + 'istersen meslektaşlarına bırakacağın tek cümle orada görünür.' },

  { t: '2026-10-18', e: 'Dijital kitap', b: '5-10. sınıfın ders kitapları sitede, sayfa sayfa',
    m: '5, 6, 7, 8, 9 ve 10. sınıfın ders kitabı artık sitede sayfa çevirmeli olarak açılıyor: '
     + 'İmam Hatip bölümünde sınıfının ilk kartı «Ders Kitabı». Kitaptaki karekodların sesleri, '
     + 'videoları ve etkinlikleri sayfanın üstünde düğme olarak duruyor; telefonla karekod '
     + 'okutmadan tahtada dinletir, izletirsin. Yazı küçük kalırsa sayfanın bir bölgesine dokun, '
     + 'o bölge tahtayı doldurur. 8. sınıf kitabının etkinlikleri de EBA\'ya gitmeden kitabın '
     + 'içinde açılıyor: sınıf tahtada çözüyor, «Kontrol et» hemen gösteriyor, cevap anahtarı '
     + 'tek dokunuşta.' },

  { t: '2026-10-14', e: 'Metin Tahlili', b: '5-10. sınıfın metinleri Kidef Arapça kitabının içinde',
    m: 'Kitabın içindekiler sayfasının hemen ardına her sınıf için bir sayfa geldi: '
     + 'sınıfın üniteleri ve dersleri sırayla duruyor, kaç metin olduğu yanında '
     + 'yazıyor. Bir derse dokununca o dersin cümleleri ve diyalogları tam ekran '
     + 'açılıyor — ayrı bir dosya açmana, bağlantı aramana gerek yok. Hangi sınıfa '
     + 'girersen gir, o sınıfın metni iki dokunuş uzakta.' },

  { t: '2026-10-14', e: 'Metin Tahlili', b: 'Cümleyi çocuk kendi kuruyor, tercümeyi sen açtırıyorsun',
    m: 'Arapça kelimeye dokununca yalnız o kelimenin Türkçesi tam üstünde beliriyor; '
     + 'cümlenin düzgün Türkçesi, bütün kelimeler açılana kadar aşağıda gizli '
     + 'duruyor. Böylece sınıf kelimeleri toplayıp cümleyi önce zihninden kuruyor, '
     + 'sonra kendi kurduğuyla karşılaştırıyor. Üstteki anahtarlardan "Hepsi '
     + 'açılınca tercüme"yi kapatırsan cümle hiç açılmıyor; sen Tercüme düğmesine '
     + 'basana kadar sınıf uğraşıyor. "Harekesiz oku" anahtarı harekeleri gizliyor, '
     + 'aynı metni ileri seviyede bir daha okutabilirsin. Kökü bilinen kelimeden '
     + 'kalıplar tablosuna geçmek de muhâdesedeki gibi duruyor.' },

  { t: '2026-10-11', e: 'Harf Tanıtımı', b: 'Harfler tahtada tek kalemle yazılıyor',
    m: 'Bir harfe dokununca dört yazılışı birlikte yazılıyor ve kalem harfin '
     + 'gerçek yazım sırasını izliyor; ekranın başka bir yerinde ikinci bir '
     + 'kalem başlamıyor, çocuk gözüyle takip edebiliyor. Yazma hızı beş '
     + 'kademe: sınıf yeni başlıyorsa yavaşlatıp deftere birlikte yazdırırsın, '
     + 'tekrar turunda hızlandırırsın. İstersen dört yazılışı sırayla da '
     + 'yazdırabilirsin — seçimin bir sonraki harfte de geçerli kalıyor.' },

  { t: '2026-10-11', e: 'Harf Tanıtımı', b: 'Bir yazılışa dokun, kelimedeki hâlini göster',
    m: 'Dört yazılıştan birine dokununca o biçim tek başına büyüyor, diğer üçü '
     + 'yanda küçülüyor; altında o biçimin geçtiği üç kelime çıkıyor ve harf '
     + 'kelimenin içinde kırmızı duruyor. "Bu harf kelimenin başında nasıl '
     + 'yazılıyor?" sorusunun cevabı tek harfin üstünde değil, gerçek kelimede '
     + 'görünüyor. Seçili yazılışa yeniden dokunmak dört yazılışa döndürüyor.' },

  { t: '2026-10-11', e: 'Harf Tanıtımı', b: 'Sonrakiyle birleşmeyen altı harf tek ekranda',
    m: 'Sağdaki köşeye dokununca altı harf ekranın ortasında büyüyor: her harfin '
     + 'iki yazılışı ve dört örneği aynı satırda — kelimenin başında, ortasında, '
     + 'sonunda ve yalın hâliyle, harf kırmızı. "Bunlar niçin kendinden sonrakine '
     + 'bitişmiyor?" sorusunu altı harfin örnekleri üzerinden tek seferde '
     + 'anlatıyorsun; arka sıra da rahat okuyor.' },

  { t: '2026-10-09', e: 'Harf Tanıtımı', b: 'İstenen harfi yaz: önce düşünsünler, sonra göster',
    m: 'Tahtaya "cim harfinin baştaki yazılışını yazın" gibi bir istek düşüyor; '
     + 'çocuklar deftere yazarken ekranda yalnız istek duruyor. Sen hazır olunca '
     + '"Yazılışı göster" ile harf satırın üstüne kalemle yazılıyor, istersen '
     + 'dört yazılışın tamamını da açıyorsun. Ölçmek istersen aynı satırdaki '
     + 'Dene düğmesi şıklı hâlini veriyor; doğru şık kırmızı çerçeveyle '
     + 'belirlenip yazılışı açılıyor.' },

  { t: '2026-10-04', e: 'Sınıf defteri', b: 'Her haftanın öğrenme çıktısı kitabına göre hazır',
    m: 'Şubenin defterini açtığında o haftanın ünitesi ve öğrenme çıktıları kazanım '
     + 'kodlarıyla karşında duruyor; hangi kitabı kullanıyorsan ona ait olanlar '
     + 'geliyor, kitabı değiştirince çıktılar da değişiyor. Tek dokunuşla deftere '
     + 'düşürüyorsun, dersin günü kendiliğinden yazılıyor. Zümre ya da denetim '
     + 'istediğinde dolu haftaları imza satırıyla birlikte yazdırabilirsin.' },

  { t: '2026-10-04', e: 'Sınıf defteri', b: 'Plan ve defter artık tek yerde',
    m: 'Haftalık plan ile defter ayrı ayrı doldurulmuyor: aynı hafta kartında '
     + 'üstte kitaptan gelen çıktı, ortada senin planın, altta sınıfta gerçekten '
     + 'işlenen yazıyor. "İşlendi" kutusu ve kaldığın yer de orada. Plan '
     + 'şubelerin ortak kalıyor, defter her şubenin kendine özel.' },

  { t: '2026-10-04', e: 'Ders başı', b: 'Günün sözünü kendi dersine göre seçiyorsun',
    m: 'Merak Çarkı açılınca gelen söz artık tek çeşit değil: âyet, hadis, yalnız '
     + 'dinî sözler, atasözü ya da deyim — hangisini seçersen o tür geliyor ve '
     + 'seçimin hatırlanıyor. Âyet ve hadiste Arapçası, Türkçesi ve kaynağı bir '
     + 'arada çıkıyor; Arapça metni tahtaya yansıtıp okutabilirsin. Söz her gün '
     + 'değişir ve aynı gün bütün sınıflarda aynıdır, "bugünün sözü" diyebilirsin.' },

  { t: '2026-10-03', e: 'Sarf', b: 'Kelime Fabrikası sıradaki adımı kendi gösteriyor',
    m: 'Kök, ustanın rafına inince yanıp sönüyor. Öğrenci nereye basacağını sormadan '
     + 'buluyor, vezinler o anda çıkıyor. Tahtada çalışırken sen yönerge vermekle '
     + 'uğraşmıyorsun, ders akışı kesilmiyor.' },

  { t: '2026-10-03', e: 'Planlar', b: 'Günlük planlar bir sayfada iki ders günü',
    m: 'Yıl boyunca her ders gününün planı hazır; bir sayfada iki gün olduğu için '
     + 'çıktı neredeyse yarıya indi. Zümreye ya da denetime tek dosyayla gidersin. '
     + 'Okulunun çizelgesi farklıysa sayfaları birleştirip ayırabilirsin.' },

  { t: '2026-10-03', e: 'Dijital kitap', b: 'İçindekiler artık elinin altında',
    m: 'Kitabı tahtaya yansıtınca içindekiler en üstte duruyor: üniteye tek dokunuşla '
     + 'geçersin, ders başında sayfa aramazsın. İçindekiler ve kaynaklar ekranın '
     + 'solundan açılıyor, kitap ortada görünmeye devam ediyor.' },

  { t: '2026-10-03', e: 'Katalog', b: 'Hangi derde hangi araç, tek listede',
    m: 'Araç kataloğuna dijital ders kitapları, kitap etkinlikleri, okul temelli '
     + 'planlama ve seçmeli Arapça belgeleri eklendi. Sınıfta bir sıkıntıya '
     + 'düştüğünde hangi aracın işini göreceğini tek sayfada bulursun.' },

  { t: '2026-10-02', e: 'Açık öğretim', b: 'AÖİHL kurları için hazır dönem planı',
    m: 'Arapça-1\'den Arapça-4\'e dört kurun 18 haftalık planı hazır; haftalık ders '
     + 'saatine göre bölünmüş. İndirip okul adını yazman yeterli, baştan plan '
     + 'yazmana gerek kalmıyor.' },

  { t: '2026-10-02', e: 'Planlar', b: 'Hangi hafta hangi sayfa işlenecek belli',
    m: '5 ve 6. sınıfın yıllık ve günlük planlarında her haftanın karşısında o hafta '
     + 'işlenecek kitap sayfaları yazıyor. Haftalık hazırlığı plan ile kitap arasında '
     + 'gidip gelmeden yaparsın; hangi üniteye ne kadar kaldığını da görürsün.' },

  { t: '2026-10-02', e: 'Kelime çalışması', b: 'Kelime listesini çıktı olarak verebilirsin',
    m: 'Kelime dağarcığında liste görünümündeyken indirme düğmesi çıkıyor: üniteyi seç, '
     + 'listeyi indir, çoğalt. Hafıza kartı ya da test çalışırken düğme ortada '
     + 'durmuyor, öğrencinin dikkatini dağıtmıyor.' },

  { t: '2026-10-02', e: 'Oyun', b: 'Hafıza kartları beklemeden açılıyor',
    m: 'Zilden sonra oyun neredeyse anında geliyor; ısınma için yükleme beklemiyorsun. '
     + 'Kartların görünümü de sadeleşti, arka sıradan okunuyor — tahtada bütün sınıfla '
     + 'birlikte oynatabilirsin.' },

  { t: '2026-10-01', e: 'Planlar', b: 'Okul temelli planlama belgesi hazır',
    m: 'Programın okula bırakılan %10\'luk payını belgelemek için doldurulmuş form. '
     + 'Sınıfının eksiğine göre düzenleyip zümre dosyana koyarsın; o payın hangi '
     + 'haftaya denk geldiği yıllık planda da işaretli.' },

  { t: '2026-08-24', e: 'Sınıf verisi', b: 'Hangi programa göre çalıştığın görünüyor',
    m: 'Sınıf kartlarında, muhâdese ünite listesinde ve yarışma konularında öğretim '
     + 'yılı rozeti var. İki yıla ait verisi olan sınıfta rozetten hangi kitapla '
     + 'çalışacağını seçersin; yanlış ünite açma derdi bitiyor.' },

  { t: '2026-08-24', e: 'Haftalık takip', b: 'Haftalık kazanım önerisi',
    m: 'Haftalık Kazanım Takibi\'nde 36 haftalık kazanım önerisi ve yıl sonu hedefi '
     + 'çıkıyor. Beğendiğin haftaları işaretleyip kendi planına aktarırsın; senin '
     + 'yazdıklarının üstüne yazmıyor, yalnız boş bıraktığın yerleri dolduruyor.' },

  { t: '2026-08-24', e: 'Planlar', b: '6. sınıf tavsiyesi yeni programa geçti',
    m: '6. sınıf haftalık planı 2025 programının dört ünitesine göre yeniden dizildi: '
     + '36 hafta, depodaki yıllık planla aynı sırada. Tavsiyeyle planın birbirini '
     + 'tutuyor, iki ayrı sıra takip etmiyorsun.' },

  { t: '2026-08-24', e: 'Bilgi yarışması', b: 'Zorluğu gruba göre ayarlıyorsun',
    m: 'Zorluk seçimi ana ekranda; kapattığın seviyedeki sorular tura hiç girmiyor. '
     + 'Zayıf gruba kolay, hazır gruba zor turu bir dokunuşla kurarsın — aynı sınıfta '
     + 'iki farklı tur açmak da mümkün.' },

  { t: '2026-08-22', e: 'Bilgi yarışması', b: 'Kalıplar Tablosu tahtada canlı',
    m: 'Yarışmaya Kalıplar Tablosu konusu geldi. Soru gelince tablonun kendisi tahtada '
     + 'açılıyor: kök yükleniyor, hedef hücre yanıyor, cevap açılınca kelime türüyor. '
     + 'Öğrenci kalıbı kuralı dinleyerek değil, oluşurken görerek öğreniyor.' },

  { t: '2026-08-22', e: 'Bilgi yarışması', b: 'Öğrenciler karekodla katılıyor',
    m: 'Hesap açmaya gerek yok: karekodu okutup adını yazması yeterli. Bir sınıfı iki '
     + 'dakikada yarışmaya sokarsın, ders başında kayıt işiyle vakit kaybetmezsin.' },

  { t: '2026-08-15', e: 'Bilgi yarışması', b: '6. sınıfa 173 soruluk yarışma',
    m: 'Sorular muhâdese ders verisinden üretildi; kelimeler işlediğin derslerle '
     + 'birebir aynı. Ünite sonunda ayrıca hazırlık yapmadan tur açıp ölçme '
     + 'yapabilirsin.' },

  { t: '2026-08-15', e: 'Sınıf etkinlikleri', b: 'Etkinlikler kolaydan zora sıralandı',
    m: 'Sınıf kartlarındaki etkinlikler kolaydan zora dizildi; 5 ve 9. sınıfa Alfabe '
     + 'etkinliği eklendi. Sınıfın seviyesine göre yukarıdan aşağı ilerler, hangi '
     + 'etkinliğin erken geldiğini denemeden görürsün.' }
];

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
