/* ===========================================================================
   HAFTALIK KAZANIM ÖNERİSİ — "Yöneticinin Tavsiyesi"
   ---------------------------------------------------------------------------
   Haftalık Plan sekmesindeki tavsiye penceresini besleyen TEK dosya.
   Öğretmen tavsiyeyi görür, beğendiği haftaları işaretler, kendi planına
   aktarır. Aktarma işi hesap/listelerim.js içindedir; burada yalnız VERİ var.

   DÜZENLEME: Bir haftanın metnini değiştirmek için ilgili sınıfın
   `haftalar` dizisinde o sıradaki satırı düzenlemen yeterli. Sıra = hafta
   numarası (1. eleman 1. hafta). Her sınıfta TAM 36 hafta olmalı —
   Haftalık Plan 36 hafta çiziyor. Ara tatiller plan ekranında ayrı bir
   şerit olarak çizildiği için burada tatil satırı YOKTUR; 36'sı da ders
   haftasıdır.

   Kaynak: sarf/ihkelime.js → MUFREDAT ünite/ders ağacı (İmam Hatip
   Arapça müfredatı) temel alınarak yazıldı. Ders verisi büyüdüğünde bu
   dosya kendiliğinden değişmez; elle güncellenir.
   =========================================================================== */
(function () {
    'use strict';

    var HAFTA_SAYISI = 36;

    var VERI = {

        /* ================================================== 5. SINIF ==== */
        "5": {
            hedef: 'Yıl sonunda öğrenci Arap alfabesini doğru okuyup yazabilir; ' +
                   'kendini, ailesini ve evini tanıtan basit cümleler kurabilir; ' +
                   'sınıf ve ev çevresindeki temel kelimeleri tanır.',
            haftalar: [
                'Arap alfabesi: harflerin tanınması ve sesleri (ا–ي)',
                'Harflerin başta, ortada ve sonda yazılışı',
                'Harekeler: fetha, kesra, damme; med harfleri',
                'Sükûn, şedde ve tenvin; kısa kelime okuma',
                'Selamlaşma ve vedalaşma kalıpları (السَّلامُ عَلَيْكُم / مَعَ السَّلامَة)',
                'Kendini tanıtma: مَا اسْمُكَ؟ — اسْمِي…',
                'Şahıs zamirleri: أَنَا، أَنْتَ، أَنْتِ، هُوَ، هِيَ',
                '1. Ünite değerlendirmesi: alfabe ve tanışma',
                'Sınıf eşyaları: مَكْتَب، كُرْسِيّ، سَبُّورَة',
                'Kırtasiye malzemeleri: قَلَم، دَفْتَر، كِتَاب، مِمْحَاة',
                'İşaret isimleri هَذَا / هَذِهِ ile eşya tanıtma',
                'Soru kalıbı مَا هَذَا؟ ve cevaplama',
                'Belirlilik takısı ال ve kelimeye etkisi',
                'Sınıf içi yönergeler: اِفْتَحْ، أَغْلِقْ، اُكْتُبْ، اِقْرَأْ',
                '2. Ünite değerlendirmesi: sınıfım',
                'Aile bireyleri: أَب، أُمّ، أَخ، أُخْت، جَدّ، جَدَّة',
                'İyelik zamirleri: كِتَابِي، كِتَابُكَ، كِتَابُهُ',
                '1. dönem genel tekrarı ve değerlendirme',
                'Meslekler: مُعَلِّم، طَبِيب، مُهَنْدِس، شُرْطِيّ',
                'Meslek sorma: مَاذَا يَعْمَلُ أَبُوكَ؟',
                'Sıfatlar: كَبِير / صَغِير، طَوِيل / قَصِير',
                'Sıfat tamlaması ve uyum (البَيْتُ الكَبِيرُ)',
                '3. Ünite değerlendirmesi: ailem',
                'Evin bölümleri: غُرْفَة، مَطْبَخ، حَمَّام، صَالَة',
                'Ev eşyaları: سَرِير، طَاوِلَة، خِزَانَة، تِلْفَاز',
                'Yer-yön edatları: فِي، عَلَى، تَحْتَ، فَوْقَ، بِجَانِبِ',
                'Nerede sorusu: أَيْنَ الكِتَابُ؟ ve cevaplama',
                'Renkler: أَحْمَر، أَزْرَق، أَخْضَر، أَصْفَر، أَبْيَض، أَسْوَد',
                'Renk ile eşyayı birleştirme (الكِتَابُ الأَحْمَرُ)',
                'Sayılar 1–10: وَاحِد … عَشَرَة',
                'Sayılar 11–20 ve yaş sorma: كَمْ عُمْرُكَ؟',
                'Sayı ile ismi birlikte kullanma; sınıf sayımı etkinliği',
                '4. Ünite değerlendirmesi: güzel evim',
                'Dört ünitenin kelime tekrarı (oyun ve yarışmayla)',
                'Konuşma uygulaması: kendimi, ailemi ve evimi tanıtıyorum',
                'Yıl sonu genel değerlendirmesi'
            ]
        },

        /* ================================================== 6. SINIF ==== */
        "6": {
            hedef: 'Yıl sonunda öğrenci mazi ve muzari fiilleri tanıyıp basit ' +
                   'çekimlerini yapabilir; günlük hayat, yemek, sağlık, kıyafet ' +
                   've ulaşım konularında kısa diyaloglar kurabilir.',
            haftalar: [
                'Yıla giriş: 5. sınıf tekrarı (alfabe, zamirler, ال takısı)',
                'Okulda: okul mekânları ve günlük okul kelimeleri',
                'Mazi fiile giriş: 3. tekil şahıs (ذَهَبَ، كَتَبَ)',
                'Oyunlar: oyun adları ve fiilleri (لَعِبَ، رَكَضَ)',
                'Evde: ev içi günlük etkinlikler',
                'Mazi fiil çekimi: أَنَا، أَنْتَ، هُوَ، هِيَ',
                '1. Ünite değerlendirmesi: günlük hayat',
                'Kahvaltıda: kahvaltılık yiyecek ve içecekler',
                'Öğle yemeğinde: yemek adları ve sipariş kalıpları',
                'Akşam yemeğinde: sofra kelimeleri',
                'Beğeni ifadeleri: أُحِبُّ / لَا أُحِبُّ + isim',
                '2. Ünite değerlendirmesi: yiyecekler ve içecekler',
                'Vücut organları: رَأْس، يَد، رِجْل، عَيْن، أُذُن',
                'Hastanede: doktor–hasta diyaloğu, عِنْدِي أَلَم',
                'Temizlik: temizlik alışkanlıkları ve fiilleri',
                'Muzari fiile giriş ve çekimi',
                '3. Ünite değerlendirmesi: sağlık',
                '1. dönem genel tekrarı ve değerlendirme',
                'Mevsimler (فُصُول السَّنَة) ve hava durumu',
                'Kışlık kıyafetler: مِعْطَف، وِشَاح، قُفَّاز',
                'Yazlık kıyafetler: قَمِيص، بِنْطَال، صَنْدَل',
                'Renk, kıyafet ve sıfatı birleştirme',
                '4. Ünite değerlendirmesi: kıyafetler',
                'Mekke-i Mükerreme: Kâbe ve hac kelimeleri',
                'Medine-i Münevvere: Mescid-i Nebevî',
                'Kudüs-i Şerif: Mescid-i Aksâ',
                'İsm-i mekân kalıbı: مَسْجِد، مَكْتَب، مَدْرَسَة',
                '5. Ünite değerlendirmesi: kutsal mekânlar',
                'Ulaşım araçları: سَيَّارَة، حَافِلَة، طَائِرَة، قِطَار',
                'Trafik: trafik işaretleri ve kuralları',
                'Tatil yolumda: yolculuk diyaloğu',
                'Gelecek zaman: سَـ / سَوْفَ + muzari',
                '6. Ünite değerlendirmesi: ulaşım ve trafik',
                'Altı ünitenin kelime tekrarı (oyun ve yarışmayla)',
                'Konuşma uygulaması: bir günümü anlatıyorum',
                'Yıl sonu genel değerlendirmesi'
            ]
        },

        /* ================================================== 7. SINIF ==== */
        "7": {
            hedef: 'Yıl sonunda öğrenci geçmiş ve gelecek zamanlı cümleler ' +
                   'kurabilir; alışveriş, seyahat ve yön tarifi konularında ' +
                   'iletişim kurabilir; şehrini Arapça tanıtabilir.',
            haftalar: [
                'Yıla giriş: 6. sınıf tekrarı (mazi–muzari)',
                'Günlük etkinlikler: sabah rutini fiilleri',
                'Saatler: tam ve buçuk saati sorma–söyleme',
                'Mazi fiilin tam çekimi (müfred–müsennâ–cemi)',
                'Zaman zarfları: صَبَاحًا، مَسَاءً، يَوْمِيًّا',
                'Bir günümü anlatma: ثُمَّ، بَعْدَ ذَلِكَ ile metin kurma',
                '1. Ünite değerlendirmesi: bugün ne yaptım?',
                'Alışveriş mekânları: سُوق، مَتْجَر، صَيْدَلِيَّة',
                'Sayılar 20–100 ve fiyat sorma (بِكَمْ؟)',
                'Para birimleri ve pazarlık kalıpları',
                'Miktar ifadeleri: كِيلُو، نِصْف، رُبْع',
                'Alışveriş diyaloğu canlandırması',
                'İsim tamlamasına (izafet) giriş',
                '2. Ünite değerlendirmesi: alışveriş zamanı',
                'Seyahat araçları ve bilet kelimeleri',
                'Yön sorma: إِلَى أَيْنَ؟ / مِنْ أَيْنَ؟',
                'Harf-i cerler: مِنْ، إِلَى، فِي، عَلَى ve isme etkisi',
                '1. dönem genel tekrarı ve değerlendirme',
                'Seyahat planı kurma: gelecek zaman kipi',
                'Otel ve rezervasyon diyaloğu',
                'Ülke ve milliyet isimleri',
                '3. Ünite değerlendirmesi: nereye seyahat edelim?',
                'Şehrin mekânları: مُسْتَشْفَى، مَكْتَبَة، حَدِيقَة',
                'Adres tarifi: يَمِين، يَسَار، أَمَام، خَلْف',
                'Şehrimi tanıtan kısa metin yazma',
                'Ülkem: Türkiye\'yi Arapça tanıtma',
                'İsm-i fâile giriş (فَاعِل kalıbı)',
                '4. Ünite değerlendirmesi: şehrim ve ülkem',
                'Mazi–muzari–emir üçlüsünün karşılaştırmalı tekrarı',
                'Olumsuzluk edatları: لَا، لَمْ، لَنْ، مَا',
                'Soru edatlarının toplu tekrarı (هَلْ، مَا، مَنْ، أَيْنَ، مَتَى، كَيْفَ، كَمْ)',
                'Okuma–anlama: kısa metin çalışması',
                'Dinleme ve konuşma uygulaması',
                'Dört ünitenin kelime tekrarı',
                'Sunum: seçtiğim şehri Arapça anlatıyorum',
                'Yıl sonu genel değerlendirmesi'
            ]
        },

        /* ================================================== 8. SINIF ==== */
        "8": {
            hedef: 'Yıl sonunda öğrenci günlük programını ve hedeflerini ' +
                   'anlatabilir; sağlık ve iletişim konularında diyalog kurabilir; ' +
                   'emir–nehiy ve أَنْ sonrası fiil kullanımını bilir.',
            haftalar: [
                'Yıla giriş: 7. sınıf tekrarı',
                'Günlük etkinliklerim: fiil dağarcığını genişletme',
                'Zaman ve saat: dakika, çeyrek, kala–geçe',
                'Muzari fiilin tam çekimi',
                'Günlük programımı yazma',
                'Sıklık zarfları: دَائِمًا، أَحْيَانًا، نَادِرًا',
                '1. Ünite değerlendirmesi: güzel bir günüm',
                'Sağlık: hastalık adları ve şikâyet ifadeleri',
                'Doktorda: tavsiye kalıpları (يَجِبُ أَنْ…)',
                'Spor: spor dalları ve fiilleri',
                'Sağlıklı beslenme kelimeleri',
                'Emir ve nehiy kipinin kuruluşu',
                '2. Ünite değerlendirmesi: sağlıklı hayatım',
                'İletişim araçları: هَاتِف، رِسَالَة، بَرِيد إِلِكْتْرُونِيّ',
                'Telefon konuşması kalıpları',
                'Mektup ve e-posta yazma kalıpları',
                'Nezaket ifadeleri: لُطْفًا، مِنْ فَضْلِكَ، عَفْوًا',
                '1. dönem genel tekrarı ve değerlendirme',
                'İnternet ve sosyal medya kelimeleri',
                'Görüş bildirme: أَظُنُّ، فِي رَأْيِي',
                '3. Ünite değerlendirmesi: iletişim günlüğüm',
                'Meslekler: geniş meslek dağarcığı',
                'Meslek seçimi ve sebep bildirme (لِأَنَّ)',
                'Hedeflerim: أُرِيدُ أَنْ + muzari mansub',
                'أَنْ، لَنْ، كَيْ sonrası fiilin durumu',
                'Gelecek planımı yazma',
                'Mezuniyet ve okul hatıraları',
                '4. Ünite değerlendirmesi: mezun oluyorum',
                'Mazi–muzari–emir toplu tekrarı',
                'İsim cümlesi ile fiil cümlesinin ayrımı',
                'İsim tamlaması ve sıfat tamlaması tekrarı',
                'Okuma–anlama: kısa hikâye çalışması',
                'Dinleme ve konuşma uygulaması',
                'Ortaokul kelime hazinesinin toplu tekrarı',
                'Sunum: kendimi ve hedeflerimi anlatıyorum',
                'Yıl sonu genel değerlendirmesi'
            ]
        },

        /* ================================================== 9. SINIF ==== */
        "9": {
            hedef: 'Yıl sonunda öğrenci Arap alfabesini akıcı okuyup yazabilir; ' +
                   'isim cümlesi kurabilir; kendini, ailesini, evini ve gününü ' +
                   'anlatan temel konuşmaları yapabilir.',
            haftalar: [
                'Okula uyum ve Arap harflerinin telaffuzu',
                'Harflerin başta–ortada–sonda yazılışı',
                'Harekeler, med harfleri, sükûn ve şedde',
                'Selamlaşma ifadeleri: السَّلامُ عَلَيْكُم، أَهْلًا وَسَهْلًا',
                'Vedalaşma ve nezaket kalıpları',
                'Tanışma diyalogları: isim, ülke, meslek sorma',
                'Şahıs zamirleri: أَنَا، أَنْتَ، أَنْتِ، هُوَ، هِيَ',
                'İşaret isimleri: هَذَا، هَذِهِ، ذَلِكَ، تِلْكَ',
                '1. Ünite değerlendirmesi: selamlaşma ve tanışma',
                'Okul mekânları ve okul eşyaları',
                'Sınıf içi yönergeler ve soru kalıpları',
                'Sayılar 1–10 ve sınıf sayımı',
                'Meslekler: مُعَلِّم، طَبِيب، مُهَنْدِس، مُحَامٍ',
                'Aile bireyleri ve meslekleri',
                'İyelik zamirleri ve isim tamlamasına giriş',
                'ال takısı; şemsî ve kamerî harfler',
                'İsim cümlesi: mübtedâ–haber uyumu',
                '1. dönem genel tekrarı ve değerlendirme',
                'Evin bölümleri',
                'Ev eşyaları ve odamın tanıtımı',
                'Yer-yön edatları: فِي، عَلَى، تَحْتَ، فَوْقَ، بَيْنَ',
                'Nerede sorusu ve konum anlatma',
                'Sıfatlar ve sıfat tamlaması',
                'Renkler ve renk–isim uyumu',
                '3. Ünite değerlendirmesi: evdeyim',
                'Fiziksel özellikler ve kişi betimleme',
                'Günlük rutinler: sabah–akşam fiilleri',
                'Muzari fiile giriş ve çekimi',
                'Saatler: tam, buçuk, çeyrek',
                'Hobiler ve boş zaman etkinlikleri',
                'Mevsimler ve hava durumu',
                'Yiyecek–içecekler ve beğeni ifadeleri',
                'Kıyafetler ve alışveriş kalıpları',
                '4. Ünite değerlendirmesi: günlük hayat',
                'Konuşma uygulaması: kendimi ve günümü anlatıyorum',
                'Yıl sonu genel değerlendirmesi'
            ]
        },

        /* ================================================= 10. SINIF ==== */
        "10": {
            hedef: 'Yıl sonunda öğrenci sarfın kök–vezin mantığını kavrar; ' +
                   'değerler, sağlık, seyahat ve alışveriş konularında ' +
                   'paragraf düzeyinde anlatım yapabilir.',
            haftalar: [
                'Yıla giriş: 9. sınıf tekrarı (isim cümlesi, zamirler)',
                'Akrabalarım: geniş aile dağarcığı',
                'Akrabalık ilişkilerini anlatma; izafet zinciri',
                'Güzel davranışlar: ahlâk kelimeleri',
                'Emir ve nehiy ile öğüt cümleleri',
                'Mazi fiilin tam çekiminin tekrarı',
                '1. Ünite değerlendirmesi: değerlerim',
                'Sağlığım: hastalık ve tedavi kelimeleri',
                'Doktorda diyalog ve tavsiye kalıpları',
                'Hobilerim: ilgi alanları dağarcığı',
                'Beğeni ve tercih: أُفَضِّلُ، أَهْتَمُّ بِـ',
                'Muzari fiil ve mansub hâli (أَنْ + fiil)',
                '2. Ünite değerlendirmesi: kendimi keşfediyorum',
                'Tarihî ve turistik mekânlar',
                'Mekân tanıtan metin kurma',
                'Ulaşım araçları ve seyahat kelimeleri',
                'Seyahat planı: gelecek zaman kipi',
                '1. dönem genel tekrarı ve değerlendirme',
                'Yol tarifi ve adres sorma',
                'Ülkeler, şehirler ve milliyetler',
                'Karşılaştırma: ism-i tafdîl (أَكْبَر، أَجْمَل)',
                '3. Ünite değerlendirmesi: seyahat etmeyi seviyorum',
                'Mevsimler ve mevsimlere göre giyinme',
                'Kıyafet ve kumaş kelimeleri',
                'Alışveriş: fiyat, pazarlık, ödeme',
                'Sayılar 100 ve üzeri; miktar ifadeleri',
                'Sebep–sonuç bağlaçları: لِأَنَّ، لِذَلِكَ',
                '4. Ünite değerlendirmesi: tatile hazırlanıyorum',
                'Sarfa giriş: kök ve vezin kavramı',
                'Sülâsî mücerred bâblar; mazi–muzari kalıpları',
                'İsm-i fâil ve ism-i mef\'ûl kalıpları',
                'Mastar kalıpları ve kelime türetme',
                'Okuma–anlama: orta seviye metin çalışması',
                'Dinleme ve konuşma uygulaması',
                'Sunum: gitmek istediğim yeri anlatıyorum',
                'Yıl sonu genel değerlendirmesi'
            ]
        }
    };

    /* ------------------------------------------------------------------
       Seviye adından sınıf çözme.
       Öğretmen seviyelerine istediği adı veriyor ("9. Sınıflar", "9-A",
       "Hazırlık 10" …). Addaki İLK sayıyı arıyoruz; 5–12 aralığındaysa
       ve elimizde o sınıfın önerisi varsa onu kullanıyoruz. Bulunamazsa
       null döner ve pencere öğretmene sınıf seçtirir.                  */
    function sinifCoz(ad) {
        var m = String(ad || '').match(/\d{1,2}/);
        if (!m) return null;
        var n = m[0];
        return VERI[n] ? n : null;
    }

    window.KidefKazanimOneri = {
        HAFTA_SAYISI: HAFTA_SAYISI,
        /* Öneri bulunan sınıflar, küçükten büyüğe */
        siniflar: function () {
            return Object.keys(VERI).sort(function (a, b) { return (+a) - (+b); });
        },
        /* {hedef, haftalar[36]} — yoksa null */
        al: function (sinif) {
            var v = VERI[String(sinif)];
            if (!v) return null;
            return { hedef: v.hedef, haftalar: v.haftalar.slice() };
        },
        sinifCoz: sinifCoz,
        /* Dosya tutarlı mı? (geliştirme sırasında sınamak için) */
        denetle: function () {
            var h = [];
            Object.keys(VERI).forEach(function (s) {
                var n = (VERI[s].haftalar || []).length;
                if (n !== HAFTA_SAYISI) h.push(s + '. sınıf: ' + n + ' hafta (36 olmalı)');
                if (!VERI[s].hedef) h.push(s + '. sınıf: yıl sonu hedefi yok');
                (VERI[s].haftalar || []).forEach(function (x, i) {
                    if (!String(x || '').trim()) h.push(s + '. sınıf ' + (i + 1) + '. hafta boş');
                });
            });
            return h;
        }
    };
})();
