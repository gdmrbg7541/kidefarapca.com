/* ============================================================
   TEST HAVUZU — Yapı Kalıpları dörtlüsü
   ------------------------------------------------------------
   Kaynak: muhadese/veri/kalip.js içindeki izafet / sifattam /
   isimcum / fiilcum başlıkları. Onların örnekleri de 5-10. sınıf
   ders verilerinden birebir geldiği için buradaki hiçbir Arapça
   elle yazılmadı. kalip.js değişirse bu dosya yeniden üretilir.

   madde:  t  -> yapı türü (izafet | sifattam | isimcum | fiilcum)
           ar -> Arapça öbek/cümle
           tr -> Türkçe karşılığı
           oge-> [kelime, öge adı] çiftleri (Muzâf, Sıfat, Fâil …)
   ============================================================ */
window.KIDEF_SINAV = {
 tur: {"izafet":"İsim Tamlaması","sifattam":"Sıfat Tamlaması","isimcum":"İsim Cümlesi","fiilcum":"Fiil Cümlesi"},
 ogeler: ["Muzâf","Muzâfun ileyh","Mevsûf","Sıfat","Mübteda","Haber","Fiil","Fâil","Mef’ûl"],
 maddeler: [
  { t:"izafet", ar:"يَوْم الجُمُعَة", tr:"Cuma günü", oge:[["يَوْم","Muzâf"],["الجُمُعَة","Muzâfun ileyh"]] },
  { t:"izafet", ar:"يَوْم الثُّلاثاء", tr:"Salı günü", oge:[["يَوْم","Muzâf"],["الثُّلاثاء","Muzâfun ileyh"]] },
  { t:"izafet", ar:"كُرَة القَدَم", tr:"Futbol (ayak topu)", oge:[["كُرَة","Muzâf"],["القَدَم","Muzâfun ileyh"]] },
  { t:"izafet", ar:"مَمَرّ المُشاة", tr:"Yaya geçidi", oge:[["مَمَرّ","Muzâf"],["المُشاة","Muzâfun ileyh"]] },
  { t:"izafet", ar:"غُرْفَةُ الجُلوسِ", tr:"Oturma odası", oge:[["غُرْفَةُ","Muzâf"],["الجُلوسِ","Muzâfun ileyh"]] },
  { t:"izafet", ar:"رَبَّة البَيْت", tr:"Ev hanımı", oge:[["رَبَّة","Muzâf"],["البَيْت","Muzâfun ileyh"]] },
  { t:"izafet", ar:"قَلْعَة الْفَتَاة", tr:"Kız Kalesi", oge:[["قَلْعَة","Muzâf"],["الْفَتَاة","Muzâfun ileyh"]] },
  { t:"izafet", ar:"مُتْحَف مَوْلَانَا", tr:"Mevlana Müzesi", oge:[["مُتْحَف","Muzâf"],["مَوْلَانَا","Muzâfun ileyh"]] },
  { t:"izafet", ar:"عاصِمَة تُرْكِيا", tr:"Türkiye başkenti", oge:[["عاصِمَة","Muzâf"],["تُرْكِيا","Muzâfun ileyh"]] },
  { t:"izafet", ar:"قِراءَة الكُتُب", tr:"Kitap okuma", oge:[["قِراءَة","Muzâf"],["الكُتُب","Muzâfun ileyh"]] },
  { t:"izafet", ar:"مَدِينَة قُونْيَا", tr:"Konya şehri", oge:[["مَدِينَة","Muzâf"],["قُونْيَا","Muzâfun ileyh"]] },
  { t:"izafet", ar:"مُشاهَدَة السّينَما", tr:"Sinema izleme", oge:[["مُشاهَدَة","Muzâf"],["السّينَما","Muzâfun ileyh"]] },
  { t:"sifattam", ar:"الضَّوْء الأَحْمَر", tr:"Kırmızı ışık", oge:[["الضَّوْء","Mevsûf"],["الأَحْمَر","Sıfat"]] },
  { t:"sifattam", ar:"الضَّوْء الأَخْضَر", tr:"Yeşil ışık", oge:[["الضَّوْء","Mevsûf"],["الأَخْضَر","Sıfat"]] },
  { t:"sifattam", ar:"القِطار السَّريع", tr:"Hızlı tren", oge:[["القِطار","Mevsûf"],["السَّريع","Sıfat"]] },
  { t:"sifattam", ar:"الشّارِع الواسِع", tr:"Geniş cadde", oge:[["الشّارِع","Mevsûf"],["الواسِع","Sıfat"]] },
  { t:"sifattam", ar:"الصَّيْدَلِيَّة الجَديدَة", tr:"Yeni eczane", oge:[["الصَّيْدَلِيَّة","Mevsûf"],["الجَديدَة","Sıfat"]] },
  { t:"sifattam", ar:"السّوق القَديم", tr:"Eski çarşı", oge:[["السّوق","Mevsûf"],["القَديم","Sıfat"]] },
  { t:"sifattam", ar:"الغِذاء الصِّحِّيّ", tr:"Sağlıklı gıda", oge:[["الغِذاء","Mevsûf"],["الصِّحِّيّ","Sıfat"]] },
  { t:"sifattam", ar:"الأُسْبوع القادِم", tr:"Gelecek hafta", oge:[["الأُسْبوع","Mevsûf"],["القادِم","Sıfat"]] },
  { t:"sifattam", ar:"السّاعَة السّابِعَة", tr:"Yedinci saat", oge:[["السّاعَة","Mevsûf"],["السّابِعَة","Sıfat"]] },
  { t:"sifattam", ar:"أَخي الكَبيرُ", tr:"Büyük kardeşim", oge:[["أَخي","Mevsûf"],["الكَبيرُ","Sıfat"]] },
  { t:"isimcum", ar:"أَنْتَ مُتَقاعِد.", tr:"Sen emeklisin.", oge:[["أَنْتَ","Mübteda"],["مُتَقاعِد","Haber"]] },
  { t:"isimcum", ar:"هُو مُتَعَجِّب.", tr:"O şaşkındır.", oge:[["هُو","Mübteda"],["مُتَعَجِّب","Haber"]] },
  { t:"isimcum", ar:"هِي قَلِقَة.", tr:"O endişelidir.", oge:[["هِي","Mübteda"],["قَلِقَة","Haber"]] },
  { t:"isimcum", ar:"الرِّياضَة مُفيدَة لِلصِّحَّة.", tr:"Spor sağlık için faydalıdır.", oge:[["الرِّياضَة","Mübteda"],["مُفيدَة","Haber"]] },
  { t:"isimcum", ar:"الفُنْدُق قَريب مِنْ هُنا.", tr:"Otel buraya yakındır.", oge:[["الفُنْدُق","Mübteda"],["قَريب","Haber"]] },
  { t:"isimcum", ar:"مَدْرَسَتي بَعيدَة عَن بَيْتي.", tr:"Okulum evimden uzaktır.", oge:[["مَدْرَسَتي","Mübteda"],["بَعيدَة","Haber"]] },
  { t:"isimcum", ar:"الطَّقْسُ حارٌّ فِي الصَّيْفِ.", tr:"Yazın hava sıcaktır.", oge:[["الطَّقْسُ","Mübteda"],["حارٌّ","Haber"]] },
  { t:"isimcum", ar:"الجَوُّ جَميلٌ فِي الرَّبيعِ.", tr:"İlkbaharda hava güzeldir.", oge:[["الجَوُّ","Mübteda"],["جَميلٌ","Haber"]] },
  { t:"isimcum", ar:"الشّارِع مُزْدَحِم بِالمُواصَلات.", tr:"Cadde ulaşım araçlarıyla kalabalıktır.", oge:[["الشّارِع","Mübteda"],["مُزْدَحِم","Haber"]] },
  { t:"isimcum", ar:"مَدْرَسَتي خَلْف المَسْجِد.", tr:"Okulum caminin arkasındadır.", oge:[["مَدْرَسَتي","Mübteda"],["خَلْف","Haber"]] },
  { t:"fiilcum", ar:"يَلْعَبُ أَحْمَد كُرَة القَدَم.", tr:"Ahmet futbol oynuyor.", oge:[["يَلْعَبُ","Fiil"],["أَحْمَد","Fâil"],["كُرَة القَدَم","Mef’ûl"]] },
  { t:"fiilcum", ar:"تَجَوَّلَتْ مَرْوَة في إِسْطَنْبُول.", tr:"Merve İstanbulda gezindi.", oge:[["تَجَوَّلَتْ","Fiil"],["مَرْوَة","Fâil"]] },
  { t:"fiilcum", ar:"يَعِيشُ يُونُس فِي قُونْيَا.", tr:"Yunus Konya'da yaşıyor.", oge:[["يَعِيشُ","Fiil"],["يُونُس","Fâil"]] },
  { t:"fiilcum", ar:"أَشْعُرُ بِأَلَم في حَلْقي.", tr:"Boğazımda ağrı hissediyorum.", oge:[["أَشْعُرُ","Fiil"]] },
  { t:"fiilcum", ar:"آكُلُ الخَضْرَوات وَالفَواكِه.", tr:"Sebze ve meyve yiyorum.", oge:[["آكُلُ","Fiil"],["الخَضْرَوات","Mef’ûl"]] },
  { t:"fiilcum", ar:"أَلْعَبُ كُرَة القَدَم.", tr:"Futbol oynuyorum.", oge:[["أَلْعَبُ","Fiil"],["كُرَة القَدَم","Mef’ûl"]] },
  { t:"fiilcum", ar:"أُنَظِّفُ غُرْفَتي.", tr:"Odamı temizlerim.", oge:[["أُنَظِّفُ","Fiil"],["غُرْفَتي","Mef’ûl"]] },
  { t:"fiilcum", ar:"أَذْهَبُ إِلى الطَّبيب.", tr:"Doktora giderim.", oge:[["أَذْهَبُ","Fiil"]] },
  { t:"fiilcum", ar:"أَسْتَمِعُ إِلى الموسيقى.", tr:"Müzik dinliyorum.", oge:[["أَسْتَمِعُ","Fiil"]] },
  { t:"fiilcum", ar:"أَعِيشُ فِي مَدِينَة قُونْيَا.", tr:"Konya şehrinde yaşıyorum.", oge:[["أَعِيشُ","Fiil"]] }
 ]
};
