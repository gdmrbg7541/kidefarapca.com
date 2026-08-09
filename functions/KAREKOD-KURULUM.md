# Karekodla Giriş — kurulum

Öğretmen akıllı tahtada şifresini herkesin önünde yazmasın diye: tahtada karekod çıkar, öğretmen kendi telefonundan okutup **Onayla** der, tahta onun hesabıyla açılır.

Bu iş sunucusuz yapılamaz. Başka bir cihazı oturum açtırmanın tek güvenli yolu Firebase Admin SDK'nın ürettiği **custom token**'dır; Admin SDK yalnız sunucuda çalışır. Bu yüzden **Blaze planı** gerekir. Bu kadar küçük bir kullanımda Blaze'in ücretsiz kotası (aylık 2 milyon çağrı) fazlasıyla yeter; pratikte ücret çıkmaz, ama karta bağlı bir plan olduğu için bütçe uyarısı koymak iyi olur (aşağıda).

## 1) Planı Blaze'e geçir

Firebase Console → Proje → sol altta **Upgrade** → *Blaze (Pay as you go)*.
Hemen ardından **Budgets & alerts**'ten aylık örneğin 1 $'lık bir uyarı eşiği koy.

## 2) Gerekli araçlar

Mac'te bir kez:

```bash
npm install -g firebase-tools
firebase login
```

## 3) Yayınla

Proje klasöründe (`kidefarapca.com/`):

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

İlk yayında Google birkaç servisi (Cloud Functions, Cloud Build, Artifact Registry) açmak için onay isteyebilir; **evet** de. Yayın 2–4 dakika sürer.

Sonunda dört işlev görünmeli:

```
qrOturumBaslat   qrOturumBilgi   qrOturumOnayla   qrOturumSor
```

Hepsi `europe-west1` bölgesindedir. **Bölgeyi değiştirirsen** `hesap/qrgiris.js` içindeki `QR_BOLGE` değerini de aynı yap, yoksa istemci işlevleri bulamaz.

## 4) Firestore kuralına tek satır ekle

`qrGirisleri` koleksiyonuna yalnız sunucu (Admin SDK) dokunmalı; tarayıcı hiç dokunmamalı. Admin SDK kuralları zaten atlar, bu yüzden **kapatmak** doğru olan:

Console → Firestore → Rules → mevcut kuralların **içine**, `match /databases/{database}/documents {` bloğunun altına şunu ekle:

```
    // Karekod giriş oturumları: yalnız Cloud Functions (Admin SDK) erişir.
    match /qrGirisleri/{oturum} {
      allow read, write: if false;
    }
```

Mevcut kurallarını **silme**, sadece bu bloğu ekle.

## 5) Süresi geçen kayıtları kendiliğinden sil (isteğe bağlı, ücretsiz)

Console → Firestore → **TTL** → *Create policy*
Koleksiyon `qrGirisleri`, alan `sonKullanma`.

İşlevler zaten okurken süresi geçmişleri siliyor; TTL, hiç okunmayanları da temizler.

## 6) Dene

1. Bilgisayarda (tahta) siteye gir, **Giriş Yap** → **Karekodla Giriş**.
2. Telefondan kamerayı aç, karekodu okut.
3. Açılan sayfada doğrulama kodunun tahtadakiyle aynı olduğunu gör, **Onayla**.
4. Tahta 2 saniye içinde öğretmen hesabıyla açılır.

## Güvenlik notları

- Karekodun içinde **yalnız oturum kimliği** var. Tahtanın gizli anahtarı karekoda hiç girmez, sunucuda da düz değil SHA-256 özeti olarak durur. Karekodu fotoğraflayan biri jetonu alamaz.
- Jeton Firestore'a **hiç yazılmaz**; yalnız doğru gizli anahtarı gönderen tahtaya, tek seferde döner.
- Oturum **2 dakika** yaşar ve **tek kullanımlıktır**.
- İki ekranda da aynı **4 haneli doğrulama kodu** görünür. Kodlar tutmuyorsa onaylanmamalı — bu, başkasının karekodunu onaylatma denemesine karşıdır. Onay ekranı bunu açıkça yazıyor.
- `qrOturumBaslat` kimlik doğrulaması istemez (tahta henüz kimse değil). Kaba kuvvet için IP başına dakikada 12 oturum sınırı var. Daha sıkı koruma istersen Console → **App Check** (reCAPTCHA v3) açıp `functions/index.js` içindeki `onCall`'lara `{ enforceAppCheck: true }` ekleyebilirsin.
- Onaylayan kim ise tahta **onun** hesabıyla açılır. Yani öğrenci de kendi telefonundan onaylayıp kendi hesabıyla girebilir; istenmiyorsa `qrOturumOnayla` içinde rol denetimi eklenebilir.

## Yayınlamazsan ne olur?

Hiçbir şey bozulmaz. "Karekodla Giriş" tuşuna basılınca *"Karekodla giriş sunucuda henüz etkin değil"* uyarısı çıkar; şifreyle giriş eskisi gibi çalışır.

## Maliyet

Dört işlev de çok küçük. Bir giriş ≈ 1 başlat + 1 bilgi + 1 onay + ~5 sorgu ≈ 8 çağrı. Günde 50 giriş bile ayda ~12.000 çağrı eder; ücretsiz kota 2.000.000. Firestore tarafında giriş başına 1 belge yazılır ve 2 dakika sonra silinir.
