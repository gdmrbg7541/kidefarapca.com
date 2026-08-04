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
│   ├── oyun/                 harekeavcisi, zamanlayaris, ikikidijital
│   └── ses/                 yonergesarf.mp3 (yönerge sesi)
│
├── sozluk/                   Sözlük dedektifi & simülasyon
├── veri/                     Ortak veri dosyaları (veri_*.js)
├── alfabe/                   Alfabe, okuma, dinle-yaz
│   └── ses/                 dinle-yaz kelime sesleri (l<seviye>v<sıra>.wav)
├── dilbilgisi/               Dilbilgisi konuları, harf-i cer
├── oyunlar/                  Hangi harf, klavye, test kapışması, hafıza…
├── ydt/                      YDT Arapça ve alt çalışmaları
├── degerler/                 Kısa sureler, namaz, KSSİ
├── kitap/                    Flipbook (FlipHTML5 köprüsü)
├── sunum/                    Slayt görüntüleyici: sunum.css/js
│                             + slayt PDF'leri (sunum.html kökte)
├── hesap/                    Üyelik, ödeme, paket, öğretmen paneli
├── sistem/                   geri.js, gorev.js, gorevkopru.js, kilit.js,
│                             router.js, state.js, alarm.js
│
├── javascript/ style/ slide_javascript/ flipbooks/ files/
│                             ← FlipHTML5 hazır paketi, DOKUNULMADI
└── dosyalar/ "alfabe github"/ "Gizem Sandığı"/  ← olduğu gibi bırakıldı
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

    alfabe/ses/l1v1.wav … l8v16.wav   ← dinle-yaz oyununun 103 kelime sesi
    sarf/ses/yonergesarf.mp3          ← sarf yönerge sesi

Sayfalar kökte durduğu için JS içindeki adresler köke göre yazılır
(`alfabe/ses/...`), başına `../` **konmaz**. `dinleveyaz.js` yolu tek yerden
üretir:

    const SES_KLASORU = 'alfabe/ses/';
    word.audioSrc = `${SES_KLASORU}l${level}v${voiceNumber}.wav`;

Seviyeye yeni kelime eklerken ses dosyasının adı sırayı izler: seviyenin
kaçıncı kelimesiyse `l<seviye>v<sıra>.wav` adıyla `alfabe/ses/` içine atılır.
