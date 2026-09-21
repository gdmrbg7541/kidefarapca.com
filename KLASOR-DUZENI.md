# Klasör Düzeni — kidefarapca.com

Bütün **HTML sayfaları kökte kalır**; böylece sitedeki adresler, yer imleri ve
arama sonuçları bozulmaz. Sayfaların **CSS / JS / veri** dosyaları ise
kategori klasörlerine toplanmıştır.

```
kidefarapca.com/
├── *.html                    ← bütün sayfalar (adresler değişmedi)
├── index.css / index.js      ← ana sayfa
├── indeks.css / indeks.js    ← vitrin sayfası
├── arakom.css / arakom.ttf   ← ortak Arapça yazı tipi
│
├── muhadese/                 Muhâdese (simültane çeviri)
│   ├── muhadese.css/js  simultane.css/js
│   ├── veri/                 ders verileri + kalip.js + alan.js
│   └── kelime/               kelime_*.css/js, yeni kelimeler.*
│
├── sarf/                     Kelime bilgisi (sarf)
│   ├── sarf.*  hazine.*  kokutani.*  koktengovdeye.*
│   ├── kaliplartablosu*.*  fiiller.*  isimx4.*  babodak.js
│   ├── mucerred/             konuanlatimi, kurandanornekler,
│   │                         telaffuzaksamiseba, sozlukdedektifi
│   ├── mezid/                mezidfiiller ve mezid sayfaları
│   ├── oyun/                 zamanlayaris, ikikidijital
│   │                         (harekeavcisi okumayazma/ klasörüne taşındı)
│   └── ses/                 yonergesarf.mp3 (yönerge sesi)
│
├── sozluk/                   Sözlük dedektifi & simülasyon
├── veri/                     Ortak veri dosyaları (veri_*.js)
├── okumayazma/               OKUMA-YAZMA: harf, hareke, hece, okuma
│   ├── alfabe.*  alfabe_birlestir.js  alfabe_sinav.js  alfabe_harf_detay.js
│   ├── okuma.*  dinleveyaz.*
│   ├── hangiharf.*  klavyeoyunu.*  harekeavcisi.*   (harf/hareke oyunları)
│   ├── ses/                 dinle-yaz kelime sesleri (l<seviye>v<sıra>.wav)
│   └── _eski/               30.07 tarihli eski alfabe kopyaları (kullanılmıyor)
├── dilbilgisi/               Dilbilgisi konuları, harf-i cer
├── oyunlar/                  Test kapışması, hafıza kartları, renkler, kavram…
│                             (test kapışması: tk_alfabe.js harf soruları,
│                              tk_ortaokul.js 5-8. sınıf dersleri — kelimeler
│                              muhadese/veri'den, tk_liste.js/css simgeli ders listesi)
│                             (hangiharf ve klavyeoyunu okumayazma/'ya taşındı)
├── ydt/                      YDT Arapça ve alt çalışmaları
├── degerler/                 Kısa sureler, namaz, KSSİ, tecvid
│                             (tecvid.css/js + tecvid.pdf; tecvid.html kökte)
├── kitap/                    Flipbook (FlipHTML5 köprüsü)
├── sunum/                    Slayt görüntüleyici: sunum.css/js
│                             + slayt PDF'leri (sunum.html kökte)
├── hesap/                    Üyelik, ödeme, paket, öğretmen paneli
├── sistem/                   geri.js, gorev.js, gorevkopru.js, kilit.js,
│                             router.js, state.js, alarm.js
│
├── javascript/ style/ slide_javascript/ flipbooks/ files/
│                             ← FlipHTML5 hazır paketi, DOKUNULMADI
└── dosyalar/ "Gizem Sandığı"/   ← olduğu gibi bırakıldı
```

## Kural
* Yeni bir sayfa eklerken **HTML'i köke** koy, CSS/JS'ini ilgili kategori
  klasörüne at ve `<link>` / `<script>` yolunu `kategori/dosya.css` biçiminde yaz.
* Bir CSS klasör içine taşındığında, içindeki `url('...')` yolları
  klasör derinliği kadar `../` ile başlamalıdır (`url('../arakom.ttf')`).
* JS içinden üretilen adresler (document.write vb.) **her zaman köke göre**
  yazılır; çünkü bütün sayfalar kökte durur.

## Sunum klasörü
`sunum.html` kökte durur; kendi CSS/JS'i ve gösterdiği slayt PDF'leri
`sunum/` klasöründedir. Bağlantı biçimi değişmedi:

    sunum.html?dosya=🧐 Mazi Fiil.pdf

`sunum.js` dosya adında `/` yoksa başına `sunum/` ekler; bulamazsa eski
bağlantılar için kökte bir kez daha dener. Ayrıca Türkçe harflerin Unicode
yazımı (NFC/NFD) macOS ile sunucu arasında değişebildiği için her iki yazımı
da sırayla dener — bu yüzden `î ğ ç ş İ Ö` gibi harf içeren slayt adları
sunucuda hangi yazımla durursa dursun açılır.

Yeni slayt eklerken PDF'i `sunum/` içine at ve adını `index.js` içindeki
`pdfListesi` dizisine ekle (klasör adı yazılmaz, onu `sunum.js` ekler).

## Ses dosyaları
Ses dosyaları da CSS/JS gibi kategori klasörünün altında, `ses/` adlı bir
alt klasörde durur:

    okumayazma/ses/l1v1.wav … l8v16.wav ← dinle-yaz oyununun 103 kelime sesi
    sarf/ses/yonergesarf.mp3          ← sarf yönerge sesi

Sayfalar kökte durduğu için JS içindeki adresler köke göre yazılır
(`okumayazma/ses/...`), başına `../` **konmaz**. `dinleveyaz.js` yolu tek yerden
üretir:

    const SES_KLASORU = 'okumayazma/ses/';
    word.audioSrc = `${SES_KLASORU}l${level}v${voiceNumber}.wav`;

Seviyeye yeni kelime eklerken ses dosyasının adı sırayı izler: seviyenin
kaçıncı kelimesiyse `l<seviye>v<sıra>.wav` adıyla `okumayazma/ses/` içine atılır.

## Okuma-yazma klasörü (19.09.2026)

Harf–hareke–hece düzeyindeki, yani **okuma yazma öğretimiyle** ilgili bütün
CSS/JS/ses dosyaları tek klasörde toplandı: `okumayazma/`.

| Sayfa (kökte durur) | Dosyaları |
|---|---|
| alfabe.html · alfabesinav.html | okumayazma/alfabe.css, alfabe.js, alfabe_birlestir.js, alfabe_sinav.js, alfabe_harf_detay.js |
| okuma.html | okumayazma/okuma.css, okuma.js |
| dinleveyaz.html | okumayazma/dinleveyaz.css, dinleveyaz.js + okumayazma/ses/ |
| hangiharf.html | okumayazma/hangiharf.css, hangiharf.js |
| klavyeoyunu.html | okumayazma/klavyeoyunu.css, klavyeoyunu.js |
| harekeavcisi.html | okumayazma/harekeavcisi.css, harekeavcisi.js |

Sayfaların kendisi kökte kaldı, adresler değişmedi. `hizlioku.html` (hızlı
okuma) `ydt/` klasöründe bırakıldı: sınav hazırlığı içeriğidir, harf öğretimi
değil.

## Kitap etkinlikleri klasörü (21.09.2026)

İmam Hatip 7, 9 ve 10. sınıf **ders kitabına giren dijital etkinlikler**
(📖Komisyon çalışmaları) `kitapetkinlikleri/` klasöründe durur. Bunlar
FlipHTML5 paketi gibi **hazır paketlerdir**: her biri kendi `index.html`'i,
sesleri ve görselleriyle birlikte klasör yapısı korunarak kopyalandı. Bu
yüzden "HTML kökte durur" kuralının **bilinçli istisnasıdır**; paketlerin
içindeki göreli adresler (`index.html`, `1.png`, `yonerge.mp3`) olduğu gibi
çalışır.

    kitapetkinlikleri/
    ├── 7/   unite_1_oyunlar … unite_4_oyunlar      (ünite oyun menüleri)
    │        unitesonudeger_1 … unitesonudeger_4     (ünite sonu değerlendirme)
    ├── 9/   arp09.0N_sXXX_unitesonudeger_N          (ünite sonu, kitap sayfasıyla)
    │        arp09.0N.M_sXXX_hafizakarti_K           (hafıza kartları)
    │        ek_kelime_oyunlari, ek_harf_yarisi      (1. ünite ek etkinlikleri)
    └── 10/  unitesonudeger_1 … _4, 10.N.M_hafizakarti,
             arp10NN_sXX_eYY_…  (kitap sayfası + etkinlik numarası), 10.1_harf_avi, 10.1_bas_harf

Ana sayfadaki liste `sistem/kitapetkinlik.js` içindeki `KITAP` verisinden
basılır (sınıf → ünite → etkinlik, sayfa numarasıyla). **Yeni etkinlik:**
paketi ilgili sınıf klasörüne kopyala, `KITAP[sınıf].uniteler[i].etk`
dizisine bir satır ekle.

Kopyalarken yapılanlar (asıllar değişmedi):
* 1000 px'ten büyük görseller aynı ad ve biçimle küçültüldü (108 → 74 MB).
* Yazı tipi adları harfe duyarlı sunucu için düzeltildi (`ARAKOM.TTF` →
  `arakom.ttf`; Mac'te fark edilmiyor, sitede 404 veriyordu).
* Üç betik yazım hatası düzeltildi (9. sınıf 3. ünite Sürükle-Bırak,
  4. ünite Boşluk Doldurma) — asıllarında da düzeltilmesi gerekir.
* 9/1 `yeni test.html` → `test.html`, 10/1 `suruklebirak.txt` → `.html`
  (menüler bu adları arıyordu).
