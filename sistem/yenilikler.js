/* ===========================================================================
   YENİLİKLER — öğretmen profilindeki "güncelleme" şeridi
   ---------------------------------------------------------------------------
   Siteye yeni bir özellik eklendiğinde buraya BİR SATIR eklenir; öğretmen
   profiline girdiğinde mor bir şerit hâlinde görür, "Okudum" deyince kapanır.

   YENİ KAYIT EKLERKEN:
     · Listenin BAŞINA ekle (en yenisi üstte).
     · id ARTAN ve BENZERSİZ olmalı — okundu bilgisi id ile tutuluyor.
       Var olan bir id'yi değiştirme, yoksa herkeste yeniden "okunmadı"
       hâline döner.
     · tarih 'YYYY-MM-DD'. Yalnız gösterim için; sıralama id ile yapılır.
     · metin tek cümle olsun; şerit uzarsa okunmuyor. GRUPLU DUYURU (27.10.2026):
       benzer konudaki yenilikler tek kayıtta, kısa cümleler art arda (ana sayfada
       aynı sayfa maddeli: sistem/siniftayeni.js L).

   Okundu bilgisi tarayıcıda: localStorage['kidef_yenilik_gorulen'] = en son
   okunan id. Hesaba değil cihaza bağlıdır; öğretmen başka cihazdan girerse
   şeridi bir kez daha görür — bilinçli tercih, sunucuya yazmıyoruz.
   =========================================================================== */
(function () {
    'use strict';

    var ANAHTAR = 'kidef_yenilik_gorulen';

    /* EN YENİSİ EN ÜSTTE */
    var LISTE = [
        /* SINIFTA YENİ 08.11.2026: ana sayfadaki dört sayfayla aynı (metin = giriş + maddeler art arda) */
        {
            id: 34,
            tarih: '2026-11-08',
            baslik: 'Ödevi dijital gönder, sonucu canlı izle',
            metin: 'Öğrencin siteye kendi e-postasıyla kaydolup senin kodunla sınıfına bağlanınca ödevi kâğıtsız verirsin; kim yaptı, kaç aldı, hepsi önüne gelir. Sınıfında «Görev Gönder»e dokun, oyunu ya da etkinliği seç. Ödevi bütün sınıfa, bütün seviyeye ya da tek öğrenciye gönderirsin. Son tarihi sen koyarsın; istersen ödevi performans notu yaparsın. Öğrenci ödevi «Görevlerim»de görür, telefondan da yapar. Kim yaptı, kaç aldı, ne kadar sürdü: sonuçlar sana canlı gelir. Performans ödevinin sonuçları «Notlara işle» ile not listene geçer.'
        },
        {
            id: 33,
            tarih: '2026-11-08',
            baslik: 'Öğrencinin puanını ve süresini gör',
            metin: 'Hesabıyla sınıfına bağlı öğrencin sitede ne çalışırsa, ödev vermesen de senin ekranına düşer. Sınıfında «Etkinlikler»e dokun: hesabıyla bağlı bütün öğrencilerin bir arada. Her oyun ve etkinlikte öğrencinin en yüksek puanı (rekoru) görünür. Gelişim çizgisi, son çalıştığı gün ve 30 günlük ilerleme de orada. Hangi etkinlikte ne kadar süre çalıştığını görürsün. Henüz açmadığı etkinlikler de listede; kimin neyi atladığı belli. Öğrenci çalıştıkça tablo kendiliğinden güncellenir.'
        },
        {
            id: 32,
            tarih: '2026-11-08',
            baslik: 'Öğrencin sınıfını kendisi seçsin, sen tek dokunuşla onayla',
            metin: 'Öğretmen kodun profilinde yazar; öğrencilerine bu kodu vermen yeter. Öğrenci kendi e-postasıyla kaydolur, kodu girer, sınıflarından kendi şubesini seçer. İstek zile düşer; seçtiği sınıf hazır gelir, istersen başka sınıfına alırsın. Öğrenciyi başka sınıfa alınca ya da sınıfın adını değiştirince öğrencinin ekranı da güncellenir. Kayıtta e-posta yanlış yazılırsa (gmial.com gibi) site doğrusunu önerir. Giriş olmazsa e-posta önerisi ve @gmail.com gibi hazır uzantı tuşları çıkar.'
        },
        {
            id: 31,
            tarih: '2026-11-04',
            baslik: '7. sınıfın yeni Devlet kitabı sitede, sesleriyle',
            metin: '7. sınıfa MEB Devlet Kitapları 2026-2027 kitabı eklendi; sayfa sayfa ve sesleriyle. 7. sınıfta kitap seçiminde bu yılın Devlet kitabı hazır; Mektep kitabı «2025-2026» adıyla duruyor. Altı ünitenin 18 dersindeki kelime, cümle ve diyaloglar Muhâdese ve kelime çalışmalarında.'
        },
        /* SINIFTA YENİ 02.11.2026: ana sayfadaki yedi sayfayla aynı (metin = maddeler art arda) */
        {
            id: 30,
            tarih: '2026-11-02',
            baslik: 'Kendi sorunu Arapça klavyeyle yaz, kâğıda ekle',
            metin: 'Soru Hazırla\'da okul bilgilerinin altında «Kendi sorunu yaz» bölümü var. ⌨ tuşuna dokun: Arapça Klavye alttan açılır, harf imlecin yerine girer. Sınavda açık uçlu soru yazarsın; cevap çizgisini ve anahtarı sen belirlersin. Beceriyi seçince öğrenme çıktısı kendiliğinden önerilir. Temrinde çoktan seçmeli de yazarsın; kâğıtta şıklar karışır. Sorular bu tarayıcıda saklanır; Arapça Klavye kartı da yerinde duruyor.'
        },
        {
            id: 29,
            tarih: '2026-11-02',
            baslik: 'Sınıf listeni dosyadan yükle, materyallere şube kapısından gir',
            metin: 'e-Okul, PDF, Word ya da Excel listeni Listelerim\'e sürükle bırak. Dosyada birkaç sınıf varsa sınıflar kendiliğinden kurulur. Eklemeden önce adları görür, istemediğini çıkarırsın; «Geri al» da var. Dosya cihazında okunur; listeye yalnız ad ve okul numarası geçer. Kurumlar ve Sınıflar\'da rakama dokununca şube kapıları parlar. Materyallere şube kapısından girersin; «Nerde kalmıştık?» de orada.'
        },
        {
            id: 28,
            tarih: '2026-11-02',
            baslik: 'İsim yazmadan kura çek, listeye satır satır ekle',
            metin: 'Listende ad yoksa kura sıra numarasından çekilir; sayıyı sen belirlersin. Adlar eksikse «Numarayla çek» anahtarını aç. Çıkan numara, herkes çıkana dek bir daha gelmez. Listenin altında hep boş bir satır var: adı yaz, Enter\'a bas. «Liste» menüsüyle Performans ve Sınavlar\'a geç; orada da öğrenci eklersin. Okul numarası artık sıra numarasının hemen yanında.'
        },
        {
            id: 27,
            tarih: '2026-11-02',
            baslik: 'Tahtayı ve telefonu birbirinden seç, hemen bağlansın',
            metin: 'Akıllı tahta penceresi, hesabının açık öbür cihazlarını adıyla gösterir. Telefondan tahtayı seç: tahta kendiliğinden Sınıf Ekranı olur. Tahtadan telefonunu seç: telefonun kumanda olur. Tahtayı önceden işaretlemen gerekmez; iki cihaz hemen bağlanır. Cihaz görünmüyorsa siteyi orada aynı hesapla aç, listeye düşer.'
        },
        {
            id: 26,
            tarih: '2026-11-02',
            baslik: 'Cevabı kitabın üstünde işaretle, eşleştirmeyi okla göster',
            metin: 'Kalem şeridinde yeni «Cevapla» grubu: ✓ doğru, ✗ yanlış işareti. Daireyi sürükleyerek şıkkın boyunda çizersin. Rakam aracı her dokunuşta bir artar (١, ٢, ٣…). Eşleştirmede oku parmağınla çiz; ucunda ok belirir. Yazı aracıyla cevabı yaz; Arapça sağdan sola oturur, yüzen klavye de var. İşaretler sayfada kalır, tahtaya yansır; silgi bir işareti bütün siler.'
        },
        {
            id: 25,
            tarih: '2026-11-02',
            baslik: 'Konuya tek dokunuşla git, sesi istediğin yerden dinlet',
            metin: 'MEB kitaplarında da İçindekiler\'deki başlığa dokun, o sayfa açılır. Dokunulabilen başlıklar sayfa açılınca bir kez parlar. Soldaki İçindekiler panelinde ünitelerin altında konular da var. Panelde açık sayfanın konusu işaretli. Ses ya da video açınca altta kalın bir ilerleme çubuğu çıkar. Çubukta bir yere dokun: ses oradan çalar, cümleyi yeniden dinletirsin.'
        },
        {
            id: 24,
            tarih: '2026-11-02',
            baslik: 'Harfi istediğin yazılışıyla sor',
            metin: 'İstenen Harfi Yaz\'da «Yazılış» seç: Normal, Başta, Ortada, Sonda, Karışık. Her tur 28 harfin hepsini birer kez sorar, bağlanmayanlar da gelir. Şıklı «Dene» de 28 harften sorar; aynı görünen iki şık çıkmaz. Dal ve Zel\'in yazılış animasyonu yenilendi.'
        },
        /* GRUPLU DUYURU (27.10.2026): ana sayfadaki sayfalarla aynı; metin = maddeler art arda */
        {
            id: 23,
            tarih: '2026-10-27',
            baslik: 'Sınıfının materyalleri artık okulunun kitaplığında',
            metin: 'Kurumlar ve Sınıflar penceresinde sınıf rakamına dokun: o sınıfın kitaplığı açılır. Ders kitabı, belgeler ve etkinlik kartları aynı rafta. Sınıfı olmayan seviyede önce «+ sınıf ekle»; materyaller sınıfla birlikte açılır. Sınıf kapıları 20 ayrı giydirmeyle: harfler, âyet ve hadisler, büyük şahsiyetler. Öğrencin Sınıfım bölümünde aynı kitaplığı görür. «Nerde Kalmıştık?» raporu kalınan sayfayı ve oyunları gösterir, kitabı oradan açar.'
        },
        {
            id: 22,
            tarih: '2026-10-27',
            baslik: 'Kitabın üstüne yaz, kaldığın sayfayı iple işaretle',
            metin: 'Kalem düğmesiyle sayfaya yaz; yazdığın sayfaya yapışır, büyütünce onunla gider. Yüzen şeritte 5 renk, silgi, geri al ve imleç var; şeridi istediğin yere taşırsın. Silgiye ikinci kez dokun: dokunduğu yeri ya da bütün çizgiyi siler. Sayfanın üstündeki gri ize dokun: kırmızı ip o sayfada kalır, kitapta tek ip olur. İp başka sayfadaysa cildin üstündeki kırmızı uçla o sayfaya dönersin. Yazılar her büyütmede keskin, Safari\'de de; iki parmakla akıcı yakınlaşır.'
        },
        {
            id: 21,
            tarih: '2026-10-26',
            baslik: 'Defterde sınıf sınıf yazı çalışması',
            metin: 'Sağ üstteki defter adından genel defterle sınıf defterleri arasında geçersin. Defter hep kaldığın yerden açılır; kalem daha doğal yazar. «Silik yazı» ile dersin kelimeleri gri yazılır, öğrenci üstünden geçer. Harfin dört yazılışı ve yazılış animasyonu defterde; tahtada da görünür. Sınıf materyallerindeki «Yazı Çalışması» kartını öğrenci kendi cihazında da açar. «Kalemle Üzerinden Geç» PDF\'i Alfabe\'de: 5–10. sınıf konuşma metinleri gri yazıyla.'
        },
        {
            id: 20,
            tarih: '2026-10-26',
            baslik: 'Tahtada, telefonda ve girişte kolaylıklar',
            metin: 'Lazer ve büyüteç kumandada tahtanın oranında çalışır, kaydırma akıcı. Defterde yazdığın tahtaya canlı yansır. Kumandadan çıkınca Sınıf Ekranı da kendiliğinden kapanır. Telefonda Kelime Listeleri ekrana sığar; Word, Excel ve PDF indirilir. Videolarda ve etkinliklerde «Tam ekran» ve «Yeni sekmede» düğmeleri var. Giriş hataları artık Türkçe; «Şifremi unuttum» ile yeni şifre alırsın.'
        },
        {
            id: 19,
            tarih: '2026-10-25',
            baslik: 'Okuma hızını ölç, yarışmaya hazırlan',
            metin: 'Okuma Hızlandırma: her sınıfa 18 okuma; Alfabe\'de ve sınıf materyallerinde. Süre tut, sesle birlikte hızlan ya da mikrofonla ölç; hız yıldızla değerlendirilir. Muhâdesede her cümlenin anlamını çağrıştıran animasyonlu bir resim var. Aylık Türkiye Arapça Yarışması: tarih açıklanınca ana sayfada geri sayım çıkar. Öğrenciler kendi hesabıyla katılır; sen katılmazsın, bağlantıyı paylaşırsın.'
        },
        {
            id: 18,
            tarih: '2026-10-22',
            baslik: 'Destek artık dönemlik ve sabit',
            metin: 'Beklenen Destek kartında günlük tutar yerine bu dönemin desteği yazar: tutar ' +
                   'dönem başında (Eylül ve Şubat) bir kez belirlenir, dönem boyunca değişmez. ' +
                   'Yeni katılanın ilk ayı ücretsiz; kartta herkesin birlikte doldurduğu ortak ' +
                   'hedef çubuğu var.'
        },
        {
            id: 17,
            tarih: '2026-10-20',
            baslik: 'Beklenen Destek ve destekçiler köşesi',
            metin: 'Profilindeki Beklenen Destek kartından destek verebilirsin; ' +
                   'ödemen onaylanınca teşekkür mesajı gelir. Ana sayfadaki destekçiler ' +
                   'şeridinde ad yazılmaz; bıraktığın cümle görünür.'
        },
        {
            id: 16,
            tarih: '2026-10-03',
            baslik: 'Ana sayfaya güncellemeler ve galeri bölümü',
            metin: 'Katalog şeridinin hemen altında yeni bir bölüm var: solda ' +
                   'sitede neyin yenilendiği, sağda fotoğraf galerisi. Bir ' +
                   'fotoğrafa basınca tam ekran açılır, oklarla gezilir.'
        },
        {
            id: 15,
            tarih: '2026-10-03',
            baslik: 'Günlük planlar bir sayfada iki ders günü',
            metin: '5-10. sınıf ve 10. sınıf Seçmeli için bütün yılın günlük ' +
                   'planları yeniden düzenlendi: her sayfada iki ders günü var, ' +
                   'sayfa sayısı neredeyse yarıya indi.'
        },
        {
            id: 14,
            tarih: '2026-10-03',
            baslik: 'Dijital kitapların araç çubuğu yenilendi',
            metin: 'İçindekiler kitap seçicinin hemen altına alındı, düğmeler ' +
                   'sitenin renklerini aldı; içindekiler ve kaynaklar panelleri ' +
                   'artık ekranın solundan açılıyor.'
        },
        {
            id: 13,
            tarih: '2026-10-02',
            baslik: 'Açık öğretim İHL için dönem planları',
            metin: 'Arapça-1, Arapça-2, Arapça-3 ve Arapça-4 kurlarının her biri ' +
                   'için 18 haftalık yüz yüze eğitim dönem planı eklendi; Word ve ' +
                   'PDF olarak 9 ve 10. sınıf belgelerinin içinde.'
        },
        {
            id: 12,
            tarih: '2026-10-02',
            baslik: 'Planlarda hangi hafta hangi kitap sayfası belli',
            metin: '5 ve 6. sınıfın yıllık ve günlük planlarında her haftanın ' +
                   'karşısında o hafta işlenecek ders kitabı sayfaları yazıyor.'
        },
        {
            id: 11,
            tarih: '2026-10-02',
            baslik: 'Hafıza kartları yeniden tasarlandı',
            metin: 'Kart oyunu hem çok daha hızlı açılıyor hem de yeni, zarif bir ' +
                   'görünüme kavuştu.'
        },
        {
            id: 10,
            tarih: '2026-08-24',
            baslik: 'Ders verisinin hangi öğretim yılına ait olduğu görünüyor',
            metin: 'Sınıf kartlarında, muhâdese ünite listesinde ve bilgi yarışması ' +
                   'konu listesinde artık öğretim yılı rozeti var; üstüne gelince ' +
                   'hangi programdan geldiği yazıyor. Bir sınıfın iki yıla ait verisi ' +
                   'olduğunda rozet seçiciye dönüşür, hangisiyle çalışacağını seçersin.'
        },
        {
            id: 9,
            tarih: '2026-08-24',
            baslik: '6. sınıf haftalık tavsiyesi yeni programa geçti',
            metin: 'Yöneticinin tavsiyesi penceresindeki 6. sınıf planı artık 2025 ' +
                   'TYMM programının dört ünitesine göre: Akrabalarım, Haydi Okula!, ' +
                   'Vücudum, Bu Hafta Hava Nasıl? — 36 hafta, depodaki yıllık planla ' +
                   'aynı sırada.'
        },
        {
            id: 8,
            tarih: '2026-08-24',
            baslik: '6. sınıf verisi kitapla karşılaştırıldı',
            metin: '18 dersin tamamı ders kitabıyla satır satır karşılaştırıldı: ' +
                   'kelimelerin %90\'ı kitapta birebir çıktı, eksik kalan رَصيف ' +
                   '(kaldırım), رِسالَة (mektup) ve مُوَظَّفَة (memur) 6. ünite ' +
                   'derslerine eklendi, bilgi yarışması yenilendi.'
        },
        {
            id: 7,
            tarih: '2026-08-24',
            baslik: 'Bilgi yarışmasında zorluk seçimi ve renkli soru listesi',
            metin: 'Zorluk seçimi artık ana ekranda, süre ve soru tipinin yanında — ' +
                   'kapattığın zorluktaki sorular tura hiç girmez. Soru seçme ' +
                   'ekranındaki süzgeç kaldırıldı; onun yerine her soru tipi kendi ' +
                   'pastel renginde görünüyor.'
        },
        {
            id: 6,
            tarih: '2026-08-24',
            baslik: 'Haftalık plana "Yöneticinin tavsiyesi"',
            metin: 'Haftalık Kazanım Takibi sekmesine bir tavsiye penceresi eklendi. ' +
                   'Seviyenin sınıfına göre 36 haftalık kazanım önerisi ve yıl sonu ' +
                   'hedefi çıkar; beğendiğin haftaları işaretleyip kendi planına ' +
                   'aktarırsın, yazdıklarının üstüne izinsiz yazılmaz.'
        },
        {
            id: 5,
            tarih: '2026-08-22',
            baslik: 'Kalıplar Tablosu artık tahtada canlı yarışıyor',
            metin: 'Bilgi yarışmasına "Kalıplar Tablosu" konusu eklendi (459 soru). ' +
                   'Yarışma sırasında tablonun kendisi tahtada açılıyor: soru gelince ' +
                   'kök yükleniyor ve hedef hücre yanıyor, cevap açılınca kelime türüyor.'
        },
        {
            id: 4,
            tarih: '2026-08-22',
            baslik: 'Öğrenciler karekodla hesapsız katılabiliyor',
            metin: 'Bilgi yarışmasına katılmak için artık öğrencinin hesabı olması ' +
                   'gerekmiyor: karekodu okutup adını yazması yeterli.'
        },
        {
            id: 3,
            tarih: '2026-08-22',
            baslik: 'Soru süresi zorluğa göre ayarlanabiliyor',
            metin: 'Bilgi yarışmasında kolay 30, orta 45, zor 60 saniye olarak ' +
                   'geliyor; ana ekrandaki kronometre düğmesinden her seviye için ' +
                   'elle de süre yazabilirsin.'
        },
        {
            id: 2,
            tarih: '2026-08-15',
            baslik: '6. sınıfa bilgi yarışması',
            metin: '6. sınıf için 173 soruluk bilgi yarışması hazır — sorular ' +
                   'muhâdese ders verisinden üretildi, kelimeler derslerle birebir aynı.'
        },
        {
            id: 1,
            tarih: '2026-08-15',
            baslik: 'Sınıf etkinlikleri yeniden düzenlendi',
            metin: 'İmam Hatip sınıf kartları kolaydan zora sıralandı; 5 ve 9. ' +
                   'sınıflara Alfabe etkinliği eklendi.'
        }
    ];

    function okunanId() {
        try { return parseInt(localStorage.getItem(ANAHTAR), 10) || 0; }
        catch (e) { return 0; }
    }

    window.KidefYenilikler = {
        /* Tüm kayıtlar (en yeni önce) */
        hepsi: function () { return LISTE.slice(); },
        /* Bu cihazda henüz okunmamış olanlar */
        yeniler: function () {
            var o = okunanId();
            return LISTE.filter(function (y) { return y.id > o; });
        },
        sonId: function () { return LISTE.length ? LISTE[0].id : 0; },
        /* Hepsini okundu say */
        okundu: function () {
            try { localStorage.setItem(ANAHTAR, String(LISTE.length ? LISTE[0].id : 0)); }
            catch (e) {}
        },
        /* Geliştirme sırasında sınamak için: id'ler benzersiz ve azalan mı? */
        denetle: function () {
            var h = [], gor = {};
            LISTE.forEach(function (y, i) {
                if (gor[y.id]) h.push('yinelenen id: ' + y.id);
                gor[y.id] = 1;
                if (!y.baslik || !y.metin) h.push(y.id + ': başlık/metin eksik');
                if (!/^\d{4}-\d{2}-\d{2}$/.test(y.tarih || '')) h.push(y.id + ': tarih biçimi');
                if (i && LISTE[i - 1].id <= y.id) h.push('sıra bozuk: ' + y.id);
            });
            return h;
        }
    };
})();
