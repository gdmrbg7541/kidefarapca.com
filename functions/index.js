/* ======================================================================
   KIDEF · KAREKODLA GİRİŞ  —  Cloud Functions (Blaze)
   ----------------------------------------------------------------------
   NEDEN GEREKLİ
   Öğretmen akıllı tahtada şifresini herkesin önünde yazmak zorunda
   kalmasın: tahtada bir karekod çıkar, öğretmen kendi telefonundan
   okutup "Onayla" der, tahta o hesapla açılır.

   Bu iş SUNUCUSUZ yapılamaz: başka bir cihazı oturum açtırmanın tek
   güvenli yolu Firebase Admin SDK'nın ürettiği "custom token"dır ve
   Admin SDK yalnız sunucuda çalışır. Bu yüzden Blaze planı gerekir.

   AKIŞ
   1) Tahta  : qrOturumBaslat()  -> {oturumId, gizli, dogrulama}
               Karekoda YALNIZ oturumId yazılır. "gizli" tahtadan hiç
               çıkmaz; karekodu fotoğraflayan biri jetonu alamaz.
   2) Telefon: karekoddaki bağlantı index.html?qr=<oturumId> açar.
               qrOturumBilgi() ile isteğin hangi cihazdan geldiğini ve
               4 haneli doğrulama kodunu görür (tahtadakiyle aynı olmalı).
   3) Telefon: qrOturumOnayla({oturumId, karar:'onay'})
   4) Tahta  : qrOturumSor({oturumId, gizli}) -> onaylandıysa TEK KULLANIMLIK
               custom token döner; tahta signInWithCustomToken ile girer.

   GÜVENLİK
   - Oturum 2 dakika yaşar, tek kullanımlıktır.
   - Jeton Firestore'a HİÇ yazılmaz; yalnız doğru "gizli"yi gönderen
     tahtaya, tek seferde, doğrudan döner.
   - "gizli" veritabanında düz değil SHA-256 özeti olarak durur.
   - 4 haneli doğrulama kodu iki ekranda da görünür: öğretmen başkasının
     karekodunu onaylamasın diye.
   - qrGirisleri koleksiyonuna istemciler ERİŞEMEZ (bkz. README).
   ====================================================================== */

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

/* Bölge: istemci de AYNI bölgeyi çağırmalı (hesap/qrgiris.js -> QR_BOLGE). */
setGlobalOptions({ region: 'europe-west1', maxInstances: 10 });

const KOLEKSIYON = 'qrGirisleri';
const OMUR_MS = 120000;                                   // 2 dakika
const HARFLER = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';       // karışan harfler yok

/* ---------------------------------------------------------------- yardımcı */
function rastgele(n) {
  const b = crypto.randomBytes(n);
  let s = '';
  for (let i = 0; i < n; i++) s += HARFLER[b[i] % HARFLER.length];
  return s;
}
function ozet(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex');
}
/* Zamanlama saldırısına kapalı karşılaştırma */
function esitMi(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}
function cihazOzeti(ua) {
  const s = String(ua || '');
  let tarayici = 'Tarayıcı';
  if (/Edg\//.test(s)) tarayici = 'Edge';
  else if (/OPR\//.test(s)) tarayici = 'Opera';
  else if (/Chrome\//.test(s)) tarayici = 'Chrome';
  else if (/Firefox\//.test(s)) tarayici = 'Firefox';
  else if (/Safari\//.test(s)) tarayici = 'Safari';
  let sistem = '';
  if (/Windows/.test(s)) sistem = 'Windows';
  else if (/Android/.test(s)) sistem = 'Android';
  else if (/iPhone|iPad|iOS/.test(s)) sistem = 'iOS';
  else if (/Mac OS X/.test(s)) sistem = 'macOS';
  else if (/Linux/.test(s)) sistem = 'Linux';
  return (tarayici + (sistem ? ' · ' + sistem : '')).slice(0, 40);
}
function kimlik(id) {
  const s = String(id || '');
  if (!/^[A-Z0-9]{6,32}$/.test(s)) throw new HttpsError('invalid-argument', 'Oturum kimliği geçersiz.');
  return s;
}
/* Süresi geçmiş kaydı okurken temizle (ayrıca Firestore TTL önerilir). */
async function suresiGectiyseSil(ref, veri) {
  const bit = veri && veri.sonKullanma ? veri.sonKullanma.toMillis() : 0;
  if (bit && bit < Date.now()) { try { await ref.delete(); } catch (e) { } return true; }
  return false;
}

/* Kaba kötüye kullanım freni: aynı örnek (instance) üzerinden gelen
   IP'ye dakikada 12 oturumdan fazlası verilmez. Kalıcı koruma için
   README'deki App Check adımı önerilir. */
const SAYAC = new Map();
function frenGec(ip) {
  const simdi = Date.now();
  const kayit = SAYAC.get(ip) || { n: 0, sifirla: simdi + 60000 };
  if (simdi > kayit.sifirla) { kayit.n = 0; kayit.sifirla = simdi + 60000; }
  kayit.n++;
  SAYAC.set(ip, kayit);
  if (SAYAC.size > 5000) SAYAC.clear();
  return kayit.n <= 12;
}

/* ============================================================ 1) BAŞLAT
   Kimlik doğrulaması İSTEMEZ: tahta henüz kimse değil. */
exports.qrOturumBaslat = onCall(async (istek) => {
  const ham = istek.rawRequest || {};
  const ip = String((ham.headers && (ham.headers['x-forwarded-for'] || '')) || ham.ip || '').split(',')[0].trim() || 'bilinmiyor';
  if (!frenGec(ip)) throw new HttpsError('resource-exhausted', 'Çok fazla deneme. Biraz bekleyin.');

  const oturumId = rastgele(10);
  const gizli = rastgele(24);
  const dogrulama = rastgele(4);
  const simdi = Date.now();

  await db.collection(KOLEKSIYON).doc(oturumId).set({
    durum: 'bekliyor',
    gizliOzet: ozet(gizli),
    dogrulama: dogrulama,
    cihaz: cihazOzeti(ham.headers && ham.headers['user-agent']),
    olusma: admin.firestore.Timestamp.fromMillis(simdi),
    sonKullanma: admin.firestore.Timestamp.fromMillis(simdi + OMUR_MS)
  });

  return { oturumId, gizli, dogrulama, omurSn: Math.round(OMUR_MS / 1000) };
});

/* ====================================================== 2) TELEFONA BİLGİ
   Onay ekranında "hangi cihaz, hangi kod, ne kadar süre kaldı". */
exports.qrOturumBilgi = onCall(async (istek) => {
  if (!istek.auth) throw new HttpsError('unauthenticated', 'Önce giriş yapmalısın.');
  const id = kimlik(istek.data && istek.data.oturumId);
  const ref = db.collection(KOLEKSIYON).doc(id);
  const anlik = await ref.get();
  if (!anlik.exists) throw new HttpsError('not-found', 'Karekod geçersiz ya da süresi dolmuş.');
  const v = anlik.data();
  if (await suresiGectiyseSil(ref, v)) throw new HttpsError('deadline-exceeded', 'Karekodun süresi doldu.');
  return {
    durum: v.durum,
    cihaz: v.cihaz || '',
    dogrulama: v.dogrulama || '',
    kalanSn: Math.max(0, Math.round((v.sonKullanma.toMillis() - Date.now()) / 1000))
  };
});

/* =========================================================== 3) ONAY/RET */
exports.qrOturumOnayla = onCall(async (istek) => {
  if (!istek.auth) throw new HttpsError('unauthenticated', 'Önce giriş yapmalısın.');
  const id = kimlik(istek.data && istek.data.oturumId);
  const karar = (istek.data && istek.data.karar) === 'ret' ? 'ret' : 'onay';
  const ref = db.collection(KOLEKSIYON).doc(id);

  const sonuc = await db.runTransaction(async (t) => {
    const anlik = await t.get(ref);
    if (!anlik.exists) throw new HttpsError('not-found', 'Karekod geçersiz ya da süresi dolmuş.');
    const v = anlik.data();
    if (v.sonKullanma.toMillis() < Date.now()) throw new HttpsError('deadline-exceeded', 'Karekodun süresi doldu.');
    if (v.durum !== 'bekliyor') throw new HttpsError('failed-precondition', 'Bu karekod zaten kullanıldı.');

    if (karar === 'ret') {
      t.update(ref, { durum: 'reddedildi', kararZamani: admin.firestore.FieldValue.serverTimestamp() });
      return { durum: 'reddedildi' };
    }
    t.update(ref, {
      durum: 'onayli',
      uid: istek.auth.uid,
      onayEposta: (istek.auth.token && istek.auth.token.email) || '',
      onayAd: (istek.auth.token && istek.auth.token.name) || '',
      kararZamani: admin.firestore.FieldValue.serverTimestamp()
    });
    return { durum: 'onayli' };
  });

  return sonuc;
});

/* ================================================= 4) TAHTA SORAR / JETON
   Kimlik doğrulaması istemez ama "gizli"yi bilmek zorundadır.
   Onaylıysa custom token TEK KEZ döner ve oturum kapanır. */
exports.qrOturumSor = onCall(async (istek) => {
  const id = kimlik(istek.data && istek.data.oturumId);
  const gizli = String((istek.data && istek.data.gizli) || '');
  const ref = db.collection(KOLEKSIYON).doc(id);
  const anlik = await ref.get();
  if (!anlik.exists) return { durum: 'yok' };

  const v = anlik.data();
  if (!esitMi(ozet(gizli), v.gizliOzet)) throw new HttpsError('permission-denied', 'Bu oturum bu cihaza ait değil.');
  if (await suresiGectiyseSil(ref, v)) return { durum: 'suredoldu' };

  const kalanSn = Math.max(0, Math.round((v.sonKullanma.toMillis() - Date.now()) / 1000));
  if (v.durum !== 'onayli') return { durum: v.durum, kalanSn };

  /* Onaylı: jetonu üret, kaydı hemen kapat (tek kullanım). */
  const jeton = await admin.auth().createCustomToken(v.uid);
  await ref.update({ durum: 'kullanildi', kullanimZamani: admin.firestore.FieldValue.serverTimestamp() });
  return { durum: 'onayli', jeton, ad: v.onayAd || '', eposta: v.onayEposta || '' };
});
