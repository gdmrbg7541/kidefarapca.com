/* ===========================================================================
   GÜNÜN SÖZÜ — SÖZ HAVUZLARI                                     04.10.2026
   ---------------------------------------------------------------------------
   Öğretmen: "günün sözünü öğretmen isterse sadece dinî konular, örneğin
   sadece âyetlerden, sadece hadislerden, sadece atasözlerinden, sadece
   deyimlerden gibi bir çok seçenek ekleyelim."

   Sözler türlerine göre ayrı havuzlarda duruyor. Öğretmen pop-up'ın
   altındaki şeritten hangi türden söz geleceğini seçer; seçim o tarayıcıda
   hatırlanır. Boş havuz şeritte hiç görünmez.

     window.KIDEF_SOZ_ATASOZU   Türk atasözleri   (bu dosya)
     window.KIDEF_SOZ_DEYIM     Türkçe deyimler   (bu dosya)
     window.KIDEF_SOZ_HADIS     hadisler          (bu dosya — ŞİMDİLİK BOŞ)
     window.KIDEF_SOZ_AYET      âyetler           (merak/gunsozu-ayet.js,
                                                   betikle üretilir)

   KAYIT BİÇİMİ
     s   sözün kendisi (büyük puntoyla çıkar)
     n   sınıfa bağlayan kısa not
     s2  simge anahtarı — merak/gunsozu.js içindeki SIMGE havuzundan
     ar  (yalnız âyet/hadis) Arapça metin — sözün üstünde sağdan sola
     k   (seçmeli) kaynak satırı; yoksa tür adı yazılır

   HADİSLERİN KAYNAĞI (04.10.2026)
     12 hadis sunnah.com'dan alındı. Arapça metinler sayfada basıldığı
     gibi, harekeleriyle birlikte AYNEN kopyalandı — elle yazılmadı:
       Sahîh-i Buhârî, Kitâbü'l-İlm   sunnah.com/bukhari/3
       Sahîh-i Buhârî 5027            sunnah.com arama
       Sahîh-i Müslim 2699a           sunnah.com/muslim:2699a
       Nevevî, Kırk Hadis             sunnah.com/nawawi40
     Hepsi sahih/hasen; zayıf rivayetler alınmadı. Birkaç uzun hadisin
     yalnız baş kısmı kullanıldı, bu kaynak satırında açıkça yazıyor.
     Türkçe çeviriler Arapça metne dayanılarak yazıldı; kendi kullandığın
     meâl varsa s alanını değiştirebilirsin. Künyeler kaynağın verdiği
     numaralarla; Türkçe usulde bâb numarası uydurulmadı.
     Yeni hadis eklerken: ar = Arapçası (kopyala, yazma), s = Türkçesi,
     n = sınıfa bağlayan not, k = kaynak, s2 = simge.
   =========================================================================== */

/* ------------------------------------------------------------- atasözleri */
window.KIDEF_SOZ_ATASOZU = [
  { s: 'Bilmemek ayıp değil, öğrenmemek ayıp.', n: 'Soru sormak öğrenmenin ilk adımıdır.', s2: 'soru' },
  { s: 'Sora sora Bağdat bulunur.', n: 'Takıldığın yeri sormaktan çekinme.', s2: 'pusula' },
  { s: 'Damlaya damlaya göl olur.', n: 'Her gün beş kelime, bir yılda yüzlerce kelime eder.', s2: 'damla' },
  { s: 'Ağaç yaşken eğilir.', n: 'Doğru alışkanlık en kolay bugün kazanılır.', s2: 'filiz' },
  { s: 'Sabreden derviş muradına ermiş.', n: 'Zor görünen konu, üstüne gidince kolaylaşır.', s2: 'kumsaati' },
  { s: 'Akıl akıldan üstündür.', n: 'Arkadaşının çözümünü dinlemek seninkini güçlendirir.', s2: 'terazi' },
  { s: 'Emek olmadan yemek olmaz.', n: 'Çalışmadan gelen başarı kalıcı olmuyor.', s2: 'cekic' },
  { s: 'İşleyen demir ışıldar.', n: 'Tekrar edilmeyen bilgi paslanır.', s2: 'disli' },
  { s: 'Azimle sıçan duvarı deler.', n: 'Küçük ama düzenli çaba, büyük engeli aşar.', s2: 'merdiven' },
  { s: 'Acele işe şeytan karışır.', n: 'Soruyu sonuna kadar oku, sonra cevapla.', s2: 'saat' },
  { s: 'Demir tavında dövülür.', n: 'Bugün öğrendiğini bugün tekrar et.', s2: 'alev' },
  { s: 'Ne ekersen onu biçersin.', n: 'Bugünün çalışması yarının sonucudur.', s2: 'ekim' },
  { s: 'Sabrın sonu selamettir.', n: 'Anlamadığın yerde vazgeçme, bir kez daha dene.', s2: 'kumsaati' },
  { s: 'Kervan yolda düzülür.', n: 'Her şey hazır olsun diye beklemeden başla.', s2: 'yol' },
  { s: 'Hatasız kul olmaz.', n: 'Yanlış yapmak öğrenmenin bir parçasıdır.', s2: 'kalkan' },
  { s: 'Bir elin nesi var, iki elin sesi var.', n: 'Eşli çalışma işi kolaylaştırır.', s2: 'eller' },
  { s: 'Dost acı söyler.', n: 'Hatanı söyleyen arkadaşının kıymetini bil.', s2: 'kalp' },
  { s: 'Tatlı dil yılanı deliğinden çıkarır.', n: 'Sınıfta da, dışarıda da geçerli.', s2: 'konusma' },
  { s: 'El elden üstündür.', n: 'Kendini başkasıyla değil, dünkü hâlinle karşılaştır.', s2: 'merdiven' },
  { s: 'Gülü seven dikenine katlanır.', n: 'Sevdiğin işin zor kısmına da katlanırsın.', s2: 'gul' },
  { s: 'Taşıma su ile değirmen dönmez.', n: 'Başkasının defteriyle sınav kazanılmaz.', s2: 'testi' },
  { s: 'Üzüm üzüme baka baka kararır.', n: 'Çalışkan arkadaş çalışkanlık bulaştırır.', s2: 'uzum' },
  { s: 'Mum dibine ışık vermez.', n: 'En iyi bildiğini sandığın konuyu da bir kez tekrar et.', s2: 'mum' },
  { s: 'Zorla güzellik olmaz.', n: 'İlgini çeken yerden başla, gerisi gelir.', s2: 'gul' },
  { s: 'Alet işler, el övünür.', n: 'Araç ne kadar iyi olsa da işi yapan sensin.', s2: 'cekic' },
  { s: 'Sanat altın bileziktir.', n: 'Öğrendiğin her beceri ömür boyu yanında.', s2: 'yildiz' },
  { s: 'Çok okuyan mı bilir, çok gezen mi?', n: 'Bilgi hem kitaptan hem hayattan gelir.', s2: 'kitap' },
  { s: 'Keskin sirke küpüne zarar.', n: 'Öfkeyle ders çalışılmaz; önce sakinleş.', s2: 'alev' },
  { s: 'Son pişmanlık fayda etmez.', n: 'Sınav haftasını bekleme, bugün başla.', s2: 'saat' },
  { s: 'Bir musibet bin nasihatten yeğdir.', n: 'Yaptığın hatadan çıkardığın ders kalıcıdır.', s2: 'kalkan' },
  { s: 'İyi dost kara günde belli olur.', n: 'Zorlandığın derste sana yardım edeni unutma.', s2: 'kalp' },
  { s: 'Vakit nakittir.', n: 'Teneffüs arası beş dakika bile tekrara yeter.', s2: 'kumsaati' },
  { s: 'Yuvarlanan taş yosun tutmaz.', n: 'Hareket eden zihin tazeliğini korur.', s2: 'tas' },
  { s: 'Harman yel ile, düğün el ile.', n: 'Büyük iş yardımlaşmayla biter.', s2: 'eller' },
  { s: 'Zaman sana uymazsa sen zamana uy.', n: 'Plan bozulunca küsme, yeni plana geç.', s2: 'pusula' },
  { s: 'Su akarken testiyi doldurmalı.', n: 'Fırsat varken çalış; her hafta aynı değil.', s2: 'testi' }
];

/* ---------------------------------------------------------------- deyimler */
/* Deyim kısa olduğu için büyük puntoda çok iyi duruyor; notta hem anlamı
   hem sınıfta nasıl kullanılacağı var. Dil dersinde "deyimin anlamını
   tahmin et" diye kısa bir ısınma olarak da işe yarıyor. */
window.KIDEF_SOZ_DEYIM = [
  { s: 'Kulak kesilmek', n: 'Anlamı: bütün dikkatiyle dinlemek. Derse başlarken: "Şimdi hepimiz kulak kesilelim."', s2: 'konusma' },
  { s: 'Elini taşın altına koymak', n: 'Anlamı: sorumluluğu üstlenmek. Grup çalışmasında herkesin bir işi olmalı.', s2: 'eller' },
  { s: 'Göz açıp kapayıncaya kadar', n: 'Anlamı: çok kısa sürede. Kırk dakikanın ne çabuk geçtiğini anlatır.', s2: 'saat' },
  { s: 'İğneyle kuyu kazmak', n: 'Anlamı: çok zahmetli işi azimle sürdürmek. Kelime ezberi tam böyledir.', s2: 'cekic' },
  { s: 'Taşı gediğine koymak', n: 'Anlamı: tam yerinde söz söylemek. İyi bir cevabı böyle övebilirsin.', s2: 'terazi' },
  { s: 'Dört gözle beklemek', n: 'Anlamı: büyük bir merakla beklemek. Yarışma turundan önce söylenir.', s2: 'saat' },
  { s: 'Bir taşla iki kuş vurmak', n: 'Anlamı: tek işle iki sonuç almak. Hem kelime hem dilbilgisi çalışan etkinlik gibi.', s2: 'tas' },
  { s: 'Göz gezdirmek', n: 'Anlamı: hızlıca bakmak. "Beş dakika metne göz gezdirin" iyi bir ön okuma yönergesidir.', s2: 'kitap' },
  { s: 'Kulaktan dolma', n: 'Anlamı: derinleşmemiş, güvenilmez bilgi. Kaynağa bakmanın niçin gerektiğini anlatır.', s2: 'soru' },
  { s: 'Dilinin ucunda olmak', n: 'Anlamı: hatırlamak üzere olmak. Öğrenci takılınca bir saniye beklemek yeter.', s2: 'soru' },
  { s: 'Göz nuru dökmek', n: 'Anlamı: bir işe uzun uzun emek vermek. Defterini güzel tutan öğrenciye söylenir.', s2: 'mum' },
  { s: 'Alnının akıyla', n: 'Anlamı: dürüstçe ve başarıyla. Sınav sonrası en güzel iltifat.', s2: 'yildiz' },
  { s: 'Su gibi bilmek', n: 'Anlamı: eksiksiz, akıcı bilmek. Tekrarın hedefi budur.', s2: 'damla' },
  { s: 'İpin ucunu kaçırmak', n: 'Anlamı: denetimi yitirmek. Konuyu haftaya bırakmanın sonucu.', s2: 'disli' },
  { s: 'Ateşten gömlek', n: 'Anlamı: ağır sorumluluk. Sınıf başkanlığı için şakayla söylenebilir.', s2: 'alev' },
  { s: 'Çam devirmek', n: 'Anlamı: farkında olmadan yakışıksız söz söylemek. Hata yapmanın sıradan olduğunu gösterir.', s2: 'filiz' },
  { s: 'Köprüleri atmak', n: 'Anlamı: dönüşü olmayan bir karar vermek. Sınav öncesi acele kararlara iyi bir uyarı.', s2: 'yol' },
  { s: 'İçini dökmek', n: 'Anlamı: derdini açıkça anlatmak. Zorlanan öğrenciye alan açar.', s2: 'konusma' },
  { s: 'Eli kulağında', n: 'Anlamı: çok yakın, neredeyse geldi. Yazılı haftasını hatırlatmak için.', s2: 'kumsaati' },
  { s: 'Buz dağının görünen yüzü', n: 'Anlamı: meselenin küçük, görünen kısmı. Bir konunun derinliğini anlatır.', s2: 'tas' },
  { s: 'Ağzından bal damlamak', n: 'Anlamı: çok güzel, tatlı konuşmak. Güzel okuyan öğrenciye söylenir.', s2: 'damla' },
  { s: 'Pireyi deve yapmak', n: 'Anlamı: küçük bir şeyi büyütmek. Bir yanlışın dünyanın sonu olmadığını söyler.', s2: 'terazi' },
  { s: 'Yüreği ağzına gelmek', n: 'Anlamı: çok korkmak, telaşlanmak. Tahtaya kalkma heyecanını adlandırır.', s2: 'kalp' },
  { s: 'Adı üstünde', n: 'Anlamı: zaten adından anlaşılan. Kelime kökünü bulurken sık sık söylenir.', s2: 'kitap' },
  { s: 'Sabrı taşmak', n: 'Anlamı: dayanma gücünü yitirmek. Önce sakinleşmenin niçin gerektiğini anlatır.', s2: 'testi' },
  { s: 'Gözden kaçmak', n: 'Anlamı: fark edilmeden geçmek. Hareke denetimi için güzel bir uyarı.', s2: 'soru' }
];

/* ----------------------------------------------------------------- hadisler */
/* Arapçası sunnah.com'dan aynen kopyalandı; dosyanın başındaki nota bak.
   Havuz dolduğu için pop-up'ta «Hadis» ve «Dinî» (âyet+hadis) seçenekleri
   kendiliğinden göründü. */
window.KIDEF_SOZ_HADIS = [
  { ar: 'يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا',
    s: 'Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.',
    n: 'Dersin ilk ilkesi: önce kolaylaştır, sonra iste.',
    k: 'Buhârî, Sahîh, 69', s2: 'eller' },
  { ar: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
    s: 'Allah kimin hakkında hayır dilerse, onu dinde anlayış sahibi kılar.',
    n: 'Anlamak ezberlemekten önce gelir.',
    k: 'Buhârî, Sahîh, 71 (hadisin baş kısmı)', s2: 'ampul' },
  { ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    s: 'Sizin en hayırlınız, Kur\'an\'ı öğrenen ve öğretendir.',
    n: 'Öğrenmek yarısı; öğretmek tamamlar.',
    k: 'Buhârî, Sahîh, 5027', s2: 'kitap' },
  { ar: 'وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    s: 'Kim ilim elde etmek için bir yola girerse, Allah ona cennete giden yolu kolaylaştırır.',
    n: 'Derse giden her adım, yolun kendisidir.',
    k: 'Müslim, Sahîh, 2699a (hadisin bir bölümü)', s2: 'yol' },
  { ar: 'إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    s: 'Ameller niyetlere göredir; herkese ancak niyet ettiği vardır.',
    n: 'Aynı ödev, niyetine göre başka bir şey olur.',
    k: 'Buhârî ve Müslim · Nevevî, Kırk Hadis, 1 (baş kısmı)', s2: 'pusula' },
  { ar: 'مِنْ حُسْنِ إسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ',
    s: 'Kişinin kendisini ilgilendirmeyeni terk etmesi, Müslümanlığının güzelliğindendir.',
    n: 'Dikkati dağıtanı bırakmak da bir beceridir.',
    k: 'Tirmizî, 2318; İbn Mâce, 3976 · Nevevî, Kırk Hadis, 12', s2: 'kumsaati' },
  { ar: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    s: 'Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz.',
    n: 'Sıra arkadaşına, kendine istediğini iste.',
    k: 'Buhârî, Sahîh, 13; Müslim, Sahîh, 45', s2: 'kalp' },
  { ar: 'مَنْ كَانَ يُؤْمِنُ بِاَللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    s: 'Allah\'a ve âhiret gününe iman eden ya hayır söylesin ya da sussun.',
    n: 'Söz almadan önce sorulacak tek soru.',
    k: 'Buhârî ve Müslim · Nevevî, Kırk Hadis, 15 (ilk cümlesi)', s2: 'konusma' },
  { ar: 'لَا تَغْضَبْ',
    s: 'Öfkelenme.',
    n: 'Kızgınken karar verilmez; önce sakinleş.',
    k: 'Buhârî · Nevevî, Kırk Hadis, 16', s2: 'alev' },
  { ar: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْت، وَأَتْبِعْ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقْ النَّاسَ بِخُلُقٍ حَسَنٍ',
    s: 'Nerede olursan ol Allah\'a karşı gelmekten sakın; kötülüğün ardından onu silecek bir iyilik yap; insanlara güzel ahlakla davran.',
    n: 'Hata yaptıysan üstüne bir iyilik koy.',
    k: 'Tirmizî, 1987 · Nevevî, Kırk Hadis, 18', s2: 'terazi' },
  { ar: 'احْفَظْ اللَّهَ يَحْفَظْك، احْفَظْ اللَّهَ تَجِدْهُ تُجَاهَك',
    s: 'Allah\'ın hakkını gözet ki Allah da seni gözetsin; Allah\'ın hakkını gözet ki O\'nu karşında bulasın.',
    n: 'Kimsenin görmediği derste de aynı sen ol.',
    k: 'Tirmizî, 2516 · Nevevî, Kırk Hadis, 19 (baş kısmı)', s2: 'kalkan' },
  { ar: 'الْبِرُّ حُسْنُ الْخُلُقِ، وَالْإِثْمُ مَا حَاكَ فِي صَدْرِك، وَكَرِهْت أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ',
    s: 'İyilik güzel ahlaktır; günah ise içini tırmalayan ve insanların bilmesinden hoşlanmadığın şeydir.',
    n: 'Ölçü iyi not değil, iyi ahlaktır.',
    k: 'Müslim · Nevevî, Kırk Hadis, 27', s2: 'gul' }
];
