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
