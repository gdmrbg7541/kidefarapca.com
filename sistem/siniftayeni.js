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

   Site içi teknik duyuru şeridi ayrı yerde: sistem/yenilikler.js
   (öğretmen profilindeki "yenilik" şeridi).
   =========================================================================== */
window.KIDEF_SINIFTA_YENI = [

  { t: '2026-10-20', e: 'Destek', b: 'Kidef\'i birlikte ayakta tutuyoruz',
    m: 'Sitedeki yapay zekâ hizmetlerinin giderleri ve materyallerin, oyunların, sınavların arkasındaki '
     + 'öğretmen emeği, siteyi kullanan öğretmenler arasında paylaşılıyor. Profilindeki «Beklenen Destek» '
     + 'kartında günlük tutarını, birikenini ve «Destek ver» tuşunu bulursun. Tutar her gün yeniden '
     + 'hesaplanır; siteye giren öğretmen arttıkça herkesin payı küçülür, yani meslektaşını davet etmek '
     + 'en iyi destek. Ödemen onaylanınca sana teşekkür mesajı gelir; kısa adın (tutar olmadan) ana '
     + 'sayfadaki destekçiler şeridinde ve kartın altındaki köşede görünür, profilinde yıl rozeti belirir. '
     + 'İstersen meslektaşlarına tek cümle de bırakabilirsin.' },

  { t: '2026-10-18', e: 'Dijital kitap', b: '5-10. sınıfın ders kitapları sitede, sayfa sayfa',
    m: '5, 6, 7, 8, 9 ve 10. sınıfın ders kitabı artık sitede sayfa çevirmeli olarak açılıyor: '
     + 'İmam Hatip bölümünde sınıfının ilk kartı «Ders Kitabı». Kitaptaki karekodların sesleri, '
     + 'videoları ve etkinlikleri sayfanın üstünde düğme olarak duruyor; telefonla karekod '
     + 'okutmadan tahtada dinletir, izletirsin. Yazı küçük kalırsa sayfanın bir bölgesine dokun, '
     + 'o bölge tahtayı doldurur. 8. sınıf kitabının etkinlikleri de EBA\'ya gitmeden kitabın '
     + 'içinde açılıyor: sınıf tahtada çözüyor, «Kontrol et» hemen gösteriyor, cevap anahtarı '
     + 'tek dokunuşta.' },

  { t: '2026-10-17', e: 'Akıllı tahta', g: 'tahta', b: 'Masandan kalkmadan tahtayı yönet',
    m: 'Bilgisayarında başlıktaki ekran simgesinden "Bu bilgisayardan yansıt"ı, tahtada aynı '
     + 'hesapla "Bu cihaz tahta"yı seç. Telefonla daha da kısa: tahtadaki giriş karekodunu '
     + 'telefonunla okut, onaylayınca gelen "kumanda olsun mu?" sorusuna "Evet" de. Açtığın '
     + 'sayfa, kaydırdığın yer, bastığın düğme ve '
     + 'yazdığın kelime kablosuz, ekran paylaşımı olmadan tahtada aynı anda görünür. '
     + 'Dizlerinden ya da ayaklarından rahatsızsan ders boyunca tahtanın önüne gidip gelmen, '
     + 'ayakta durman gerekmez; masanda oturarak anlatırsın. Öğrencilerin görmemesi gereken '
     + 'bir şeye bakacaksan üstteki şeritten "Perde" ile tahtayı karartır, "Duraklat" ile son '
     + 'görüntüde bekletirsin.' },

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
  var CIPLER = '<div class="ty-cipler">' + VURGU +
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
