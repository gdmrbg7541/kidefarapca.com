# Aşama 1 — Birleşik Giriş (Tek Hesap) — Test ve Kurulum

Bu aşamada index ve kurslar **tek Firebase projesinde (`kidefarapca-98f9c`)** ve
tek hesap sisteminde (`kullanicilar/{uid}`) birleştirildi.

## Yapılan değişiklikler
- `js/modules/auth.js`: kurslar artık `kidefarapca-98f9c` projesini ve `kullanicilar/{uid}`
  şemasını kullanıyor. Rol Firestore'dan geliyor. Öğretmen anında (başvuru/onay yok).
  Sabit-kodlanmış yönetici şifresi kaldırıldı.
- `index.html` + `auth_index.js`: kayıt formuna **isim (zorunlu)** ve **telefon (isteğe bağlı)** eklendi.
- `js/modules/checkout.js`: paket sahipliği artık `kullanicilar/{uid}.packages` içine yazılıyor.
- `kurslar.html`: gizli "Yönetici" giriş butonu kaldırıldı.

## KURULUM (senin yapman gerekenler)

### 1) Firestore güvenlik kurallarını uygula
Firebase Console → `kidefarapca-98f9c` → Firestore Database → Rules →
`firestore.rules` dosyasının içeriğini yapıştır → Publish.

### 2) Yönetici hesabını oluştur (bir kez)
- Siteden (index) kendi e-postanla **normal kayıt ol** (Öğrenci rolüyle).
- Firebase Console → Firestore → `kullanicilar` → kendi dokümanını bul →
  `role` alanını `admin` yap.
- Çıkış yapıp tekrar giriş yap → artık yöneticisin (kurslar.html'de yönetici paneli açılır).

## TEST ADIMLARI
Not: Firebase e-posta/şifre girişi `file://` ile çalışmaz. **localhost** veya **canlı site** üzerinden test et.

1. index'te yeni bir hesap aç (Öğrenci): isim + e-posta + telefon(ops.) + şifre.
   → Firestore `kullanicilar/{uid}` dokümanı `role, name, phone, packages:[]` ile oluşmalı.
2. Aynı sekmede kurslar.html'e git → **giriş yapılmış** görünmeli (aynı hesap).
3. kurslar'da bir paket "satın al" (mock/IBAN) → `kullanicilar/{uid}.packages` güncellenmeli.
4. index'e dön → o paket artık "sahip" görünmeli (kilit açık).
5. Öğretmen testi: çıkış yap, "Öğretmen" seçerek kayıt ol → öğretmen içeriği açılmalı.
6. Yönetici testi: yönetici hesabınla gir → kurslar'da yönetici paneli açılmalı.

## BİLİNEN SINIR (sonraki aşamalar)
- Paket verme şu an **istemci tarafında** yapılıyor (gerçek ödeme yok). İleride
  sunucu/Cloud Function ile doğrulanmalı; şu an bir kullanıcı teorik olarak kendine
  paket tanımlayabilir. Kurallar en azından başkasının verisini ve rol yükseltmeyi engeller.
- Öğretmen programları, randevular, alarmlar, ilerleme hâlâ eski yerlerinde (Aşama 3-4).
