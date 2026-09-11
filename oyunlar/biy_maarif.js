/* ===========================================================================
   MAARİF SEMİNERİ — BİLGİ YARIŞMASI SORU BANKASI        (oyunlar/biy_maarif.js)
   ---------------------------------------------------------------------------
   Türkiye Yüzyılı Maarif Modeli öğretmen semineri (sunum html/maarif.html)
   için soru setleri. Öğrenci konularından AYRI tutulur: bu dosya yalnız
   bilgiyarismasikacom.html "?set=ara1|ara2|ara3|final" ile açıldığında
   yüklenir; normal açılışta konu listesinde görünmez.

   · m_ara1-3: bölüm sonu ara yarışmaları — 10'ar soru
   · m_final : kapanış testi — 10 soru, sabit sıra
   Dördü de 10 soru: karekodla açılan her test aynı uzunlukta olsun
   ve aynı sorular sunumun içindeki test slaytlarında da dursun.
   Motordan ÖNCE yüklenir; kendini window.BIY_EK_KONULAR'a iter.
   =========================================================================== */
const S_M_FINAL = [
  {"id": 5008, "tip": "m_final", "icerik": "m_kavram", "zorluk": 1, "soru": "Türkiye Yüzyılı Maarif Modeli hangi temel eğitim yaklaşımına dayanır?", "secenekler": ["Öğrenci merkezli", "Öğretmen merkezli", "Bilgi aktarımı", "Ezberci", "Klasik gramer"], "dogru": 0},
  {"id": 5002, "tip": "m_final", "icerik": "m_kavram", "zorluk": 1, "soru": "Yeni modelde “kazanım” yerine hangi kavram kullanılmaktadır?", "secenekler": ["Çıktı", "İçerik", "Etkinlik", "Strateji", "Yöntem"], "dogru": 0},
  {"id": 5011, "tip": "m_final", "icerik": "m_kavram", "zorluk": 2, "soru": "Aşağıdakilerden hangisi Türkiye Yüzyılı Maarif Modeli’nin değerlerinden biridir?", "secenekler": ["Bireyselcilik", "Paylaşım ve iş birliği", "Sadece ezber", "Rekabet", "Kuralcılık"], "dogru": 1},
  {"id": 5032, "tip": "m_final", "icerik": "m_kavram", "zorluk": 2, "soru": "21. yüzyıl becerilerinden biri değildir:", "secenekler": ["Eleştirel düşünme", "İş birliği", "Ezbercilik", "Yaratıcılık", "Problem çözme"], "dogru": 2},
  {"id": 5028, "tip": "m_final", "icerik": "m_kavram", "zorluk": 1, "soru": "Türkiye Yüzyılı Maarif Modeli’nde “öğrenme yaşantısı” neyi ifade eder?", "secenekler": ["Ezberlenen bilgi", "Öğrencinin derste yaşadığı süreç ve deneyim", "Öğretmenin anlattıkları", "Kitap içeriği", "Sınav sonuçları"], "dogru": 1},
  {"id": 5010, "tip": "m_final", "icerik": "m_kavram", "zorluk": 1, "soru": "“Farklılaştırma” öğretimde neyi amaçlar?", "secenekler": ["Zamanı kısaltmak", "Öğrencilerin ihtiyaçlarına uygun içerik sunmak", "Öğretmene kolaylık sağlamak", "Ölçmeyi kolaylaştırmak", "Öğrencileri aynı seviyede görmek"], "dogru": 1},
  {"id": 5015, "tip": "m_final", "icerik": "m_kavram", "zorluk": 1, "soru": "Türkiye Yüzyılı Maarif Modeli’nde “öğrenme kanıtı” nedir?", "secenekler": ["Sadece sınav kâğıdı", "Öğrencinin ortaya koyduğu her türlü ürün", "Ezberlenen kelime listesi", "Öğretmenin verdiği ödev", "Kitap bilgisi"], "dogru": 1},
  {"id": 5035, "tip": "m_final", "icerik": "m_kavram", "zorluk": 1, "soru": "Türkiye Yüzyılı Maarif Modeli’nde öğretmenin rolü nedir?", "secenekler": ["Bilgi aktarıcı", "Rehber ve kolaylaştırıcı", "Tek otorite", "Ezber denetçisi", "Çeviri yaptırıcı"], "dogru": 1},
  {"id": 5042, "tip": "m_final", "icerik": "m_arapca", "zorluk": 1, "soru": "Arapça dersinde “dil bilgisi kuralını açıklamak yerine örnek diyaloglarla öğretmek” hangi yaklaşımı yansıtır?", "secenekler": ["Ezberci", "Çeviri", "İletişimsel", "Sessiz yöntem", "Klasik"], "dogru": 2},
  {"id": 5048, "tip": "m_final", "icerik": "m_senaryo", "zorluk": 3, "soru": "Bir öğretmen öğrencilerden günlük yaşamla ilgili diyalog yazmalarını istemektedir. Bu etkinlik hangi becerileri ölçer?", "secenekler": ["Yazma ve konuşma", "Dinleme ve yazma", "Okuma ve ezber", "Çeviri ve dilbilgisi", "Ezber ve sınav"], "dogru": 0}

];
const S_M_ARA1 = [
  {"id": 5101, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 1, "soru": "TYMM'nin nihai hedefi hangi iki kavramla özetlenir?", "secenekler": ["Bilgi ve başarı", "Yetkinlik ve erdem", "Disiplin ve itaat", "Hız ve verim"], "dogru": 1},
  {"id": 5102, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 2, "soru": "«İnsan ruh ve bedenden oluşan bir bütündür» anlayışı hangi bütünlüğü anlatır?", "secenekler": ["Epistemolojik bütünlük", "Zamansal bütünlük", "Ontolojik bütünlük", "Aksiyolojik olgunluk"], "dogru": 2},
  {"id": 5103, "tip": "m_ara1", "icerik": "m_senaryo", "zorluk": 3, "soru": "Bir öğrenci bilgiyi ezberlemekle kalmayıp günlük sorunlara çözüm bulmak için kullanıyor. Bu, modelin hangi vurgusudur?", "secenekler": ["Bilgi ve bilgelik (epistemolojik bütünlük)", "Zamansal bütünlük", "Ölçme-değerlendirme", "Farklılaştırma"], "dogru": 0},
  {"id": 5104, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 1, "soru": "«Geçmişten geleceğe eğitim» ifadesi hangi kavramın açıklamasıdır?", "secenekler": ["Ontolojik bütünlük", "Zamansal bütünlük", "Aksiyolojik olgunluk", "Öğrenme kanıtı"], "dogru": 1},
  {"id": 5105, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 2, "soru": "Ahlaki bilinç ve estetik bakış açısının olgunlaşması hangi kavramla adlandırılır?", "secenekler": ["Aksiyolojik olgunluk", "Epistemolojik bütünlük", "Sistem düşüncesi", "Okuryazarlık"], "dogru": 0},
  {"id": 5106, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 2, "soru": "Aşağıdakilerden hangisi öğrenci profilinin on özelliğinden biri DEĞİLDİR?", "secenekler": ["Bilge", "Cesaretli", "Rekabetçi", "Merhametli"], "dogru": 2},
  {"id": 5107, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 2, "soru": "«Belagat sahibi» ve «bilgilerini paylaşan» bileşenleri hangi profil özelliğine aittir?", "secenekler": ["Ahlaklı", "Bilge", "Üretken", "Vatansever"], "dogru": 1},
  {"id": 5108, "tip": "m_ara1", "icerik": "m_senaryo", "zorluk": 3, "soru": "Arapça dersinde öğrencilerin selamlaşma diyaloğunu kendileri yazıp canlandırması en çok hangi profil özelliğini besler?", "secenekler": ["Sağlıklı", "Üretken", "İradeli", "Estetik"], "dogru": 1},
  {"id": 5109, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 2, "soru": "TYMM'de değerlerin işlenişi için doğru olan hangisidir?", "secenekler": ["Ayrı bir ders olarak verilir", "Erdem-Değer-Eylem çerçevesiyle her derse gömülüdür", "Yalnız din kültürü dersine aittir", "Yalnız sınavla ölçülür"], "dogru": 1},
  {"id": 5110, "tip": "m_ara1", "icerik": "m_kavram", "zorluk": 2, "soru": "Erdem-Değer-Eylem çerçevesinin üç «çatı değeri» hangi seçenekte doğru verilmiştir?", "secenekler": ["Adalet, saygı, sorumluluk", "Sevgi, hoşgörü, barış", "Çalışkanlık, disiplin, başarı", "Özgürlük, eşitlik, kardeşlik"], "dogru": 0}

];
const S_M_ARA2 = [
  {"id": 5201, "tip": "m_ara2", "icerik": "m_kavram", "zorluk": 1, "soru": "Öğrenme çıktısı hangi iki ögeden oluşur?", "secenekler": ["Beceri + içerik", "Konu + sınav", "Ders + süre", "Amaç + yöntem"], "dogru": 0},
  {"id": 5202, "tip": "m_ara2", "icerik": "m_kavram", "zorluk": 2, "soru": "«Saymak, okumak, çizmek, ölçmek» gibi gözlenebilir eylemler hangi kavramsal beceri düzeyindedir?", "secenekler": ["Temel beceriler (KB1)", "Bütünleşik beceriler (KB2)", "Üst düzey düşünme becerileri (KB3)", "Alan becerileri"], "dogru": 0},
  {"id": 5203, "tip": "m_ara2", "icerik": "m_kavram", "zorluk": 2, "soru": "Karar verme, problem çözme ve eleştirel düşünme hangi düzeydedir?", "secenekler": ["Temel beceriler (KB1)", "Bütünleşik beceriler (KB2)", "Üst düzey düşünme becerileri (KB3)", "Eğilimler"], "dogru": 2},
  {"id": 5204, "tip": "m_ara2", "icerik": "m_arapca", "zorluk": 1, "soru": "Yabancı dil alan becerilerinde «dinleme/izleme-anlamlandırma» ve «okuma-anlamlandırma» hangi gruptadır?", "secenekler": ["Üretici beceriler", "Alımlayıcı beceriler", "Destek becerileri", "Sosyal beceriler"], "dogru": 1},
  {"id": 5206, "tip": "m_ara2", "icerik": "m_arapca", "zorluk": 2, "soru": "Arapça Dersi (5-8) Öğretim Programı hangi yaklaşımı temel alır?", "secenekler": ["Tümevarımsal yaklaşım", "Bütüncül yaklaşım", "Yarı bütüncül yaklaşım", "Çeviri yaklaşımı"], "dogru": 1},
  {"id": 5207, "tip": "m_ara2", "icerik": "m_arapca", "zorluk": 1, "soru": "Programın 8. sınıf sonunda hedeflediği dil yetkinlik düzeyi hangisidir?", "secenekler": ["A1.1", "A2.2", "B1", "C1"], "dogru": 1},
  {"id": 5208, "tip": "m_ara2", "icerik": "m_senaryo", "zorluk": 3, "soru": "Bir ders planında «SDB2 · iletişim, iş birliği» kodunu görüyorsunuz. Bu kod hangi bileşene aittir?", "secenekler": ["Sosyal-duygusal öğrenme becerileri", "Kavramsal beceriler", "Değerler", "Okuryazarlık becerileri"], "dogru": 0},
  {"id": 5209, "tip": "m_ara2", "icerik": "m_kavram", "zorluk": 2, "soru": "«Bilgi, dijital, finansal, görsel, kültür, vatandaşlık, veri, sürdürülebilirlik, sanat» listesi neyi sıralar?", "secenekler": ["Öğrenci profili özelliklerini", "Okuryazarlık becerilerini", "Eğilimleri", "Ünite adlarını"], "dogru": 1},
  {"id": 5210, "tip": "m_ara2", "icerik": "m_kavram", "zorluk": 2, "soru": "Eğilimler modelde üç grupta toplanır. Hangisi bu gruplardan biri DEĞİLDİR?", "secenekler": ["Benlik eğilimleri", "Sosyal eğilimler", "Entelektüel eğilimler", "Fiziksel eğilimler"], "dogru": 3},
  {"id": 5211, "tip": "m_ara2", "icerik": "m_arapca", "zorluk": 3, "soru": "«ARP.5.1.1» kodundaki 5, 1 ve 1 sırasıyla neyi gösterir?", "secenekler": ["Sınıf · ünite · alan becerisi", "Ünite · ders saati · sayfa", "Beceri · sınıf · ünite", "Hafta · gün · saat"], "dogru": 0}

];
const S_M_ARA3 = [
  {"id": 5301, "tip": "m_ara3", "icerik": "m_kavram", "zorluk": 2, "soru": "Ünitedeki öğrenme-öğretme yaşantılarının doğru sırası hangisidir?", "secenekler": ["Temel kabuller → ön değerlendirme → köprü kurma → uygulamalar", "Sınav → konu anlatımı → ödev", "Köprü kurma → sınav → tekrar", "Uygulamalar → temel kabuller → ölçme"], "dogru": 0},
  {"id": 5303, "tip": "m_ara3", "icerik": "m_senaryo", "zorluk": 3, "soru": "Ana dildeki selamlaşma ifadelerinden yola çıkıp Arapça ifadelerle benzerlik kurmak hangi aşamadır?", "secenekler": ["Ön değerlendirme", "Köprü kurma", "Destekleme", "Raporlama"], "dogru": 1},
  {"id": 5304, "tip": "m_ara3", "icerik": "m_kavram", "zorluk": 2, "soru": "Akranlarından ileri düzeydeki öğrencilere genişletilmiş öğrenme fırsatı sunmak neyin karşılığıdır?", "secenekler": ["Zenginleştirme", "Destekleme", "Ön değerlendirme", "Temel kabul"], "dogru": 0},
  {"id": 5305, "tip": "m_ara3", "icerik": "m_kavram", "zorluk": 2, "soru": "Daha fazla zaman ve tekrara ihtiyaç duyan öğrenciler için içerik, süreç ve ürünün uyarlanması:", "secenekler": ["Zenginleştirme", "Destekleme", "Sınıf tekrarı", "Muafiyet"], "dogru": 1},
  {"id": 5306, "tip": "m_ara3", "icerik": "m_arapca", "zorluk": 1, "soru": "Arapça dersinde yıllık 72 saatin 4 saati neye ayrılır?", "secenekler": ["Okul temelli planlama", "Deneme sınavı", "Serbest etkinlik", "Telafi"], "dogru": 0},
  {"id": 5307, "tip": "m_ara3", "icerik": "m_senaryo", "zorluk": 3, "soru": "Bir öğretmen ünite sonunda öğrencilere tanışma kartı hazırlatıp sunum yaptırıyor ve dereceli puanlama anahtarıyla değerlendiriyor. Bu neye örnektir?", "secenekler": ["Performans görevi (öğrenme kanıtı)", "Klasik yazılı sınav", "Kazanım testi", "Ders dışı etkinlik"], "dogru": 0},
  {"id": 5308, "tip": "m_ara3", "icerik": "m_arapca", "zorluk": 2, "soru": "Dinleme/izleme becerisi için programda önerilen ölçme aracı hangisi DEĞİLDİR?", "secenekler": ["Doğru-yanlış", "Eşleştirme", "Boşluk doldurma", "Uzun kompozisyon"], "dogru": 3},
  {"id": 5309, "tip": "m_ara3", "icerik": "m_senaryo", "zorluk": 3, "soru": "Öğretmenin ders sonunda «neyi iyi yaptım, neyi geliştirmeliyim» diye not alması hangi program ögesidir?", "secenekler": ["Öğretmen yansıtmaları", "Ön değerlendirme", "Temel kabuller", "Okul temelli planlama"], "dogru": 0},
  {"id": 5310, "tip": "m_ara3", "icerik": "m_kavram", "zorluk": 2, "soru": "Sosyal sorumluluk ve hayat boyu öğrenme çalışmaları programda hangi başlıkta yer alır?", "secenekler": ["Program dışı etkinlikler", "Öğrenme kanıtları", "Süre tablosu", "Beceriler çerçevesi"], "dogru": 0},
  {"id": 5311, "tip": "m_ara3", "icerik": "m_kavram", "zorluk": 2, "soru": "Öğrenme kanıtlarının raporlanması için hangisi doğrudur?", "secenekler": ["Yalnız bir not verilir", "Öğrencinin gelişimi ve süreci öğrenci ve veliyle paylaşılır", "Yalnız dönem sonunda yapılır", "Kanıtlar saklanmaz"], "dogru": 1}

];
/* Kapanış testi sunumdaki test slaytlarıyla AYNI sırada sorulur:
   öğretmen tahtada soruyu açtığında telefondaki soru da aynı olsun. */
S_M_FINAL.forEach(q => { q.sabitSira = true; });
const S_MAARIF = [].concat(S_M_ARA1, S_M_ARA2, S_M_ARA3, S_M_FINAL);

window.BIY_EK_KONULAR = window.BIY_EK_KONULAR || [];
[
  { id: "m_ara1",  ad: "Maarif · Ara yarışma 1 · Felsefe ve öğrenci profili",     sorular: S_M_ARA1 },
  { id: "m_ara2",  ad: "Maarif · Ara yarışma 2 · Beceriler ve çıktılar",      sorular: S_M_ARA2 },
  { id: "m_ara3",  ad: "Maarif · Ara yarışma 3 · Yaşantı, farklılaştırma, ölçme",  sorular: S_M_ARA3 },
  { id: "m_final", ad: "Maarif · Kapanış testi · 10 soru",                  sorular: S_M_FINAL }
].forEach(k => window.BIY_EK_KONULAR.push({ id: k.id, ad: k.ad, pdf: "", sinif: 0, seviye: 1, sorular: k.sorular }));

/* Seminer soru tipleri — süzgeç ve etiketler için Türkçe adlar (motor
   yüklendikten sonra TIP_BILGI'ye eklenir; bkz. bilgiyarismasikacom.html). */
window.MAARIF_TIPLER = {
  "m_ara1":  { ad: "Felsefe ve profil",     emoji: "🧭" },
  "m_ara2":  { ad: "Beceriler ve çıktılar", emoji: "🧩" },
  "m_ara3":  { ad: "Yaşantı ve ölçme",      emoji: "🌱" },
  "m_final": { ad: "Kapanış testi",         emoji: "🏁" }
};
