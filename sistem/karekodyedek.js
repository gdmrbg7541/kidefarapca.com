/* =====================================================================
   KİDEF · KAREKOD YEDEĞİ              (sistem/karekodyedek.js)
   ---------------------------------------------------------------------
   Öğretmen (05.10.2026): "karekod işini bitir."

   SORUN: sitedeki bütün karekodlar tek bir CDN dosyasına bağlıydı —
   cdnjs.cloudflare.com/.../qrcodejs/1.0.0/qrcode.min.js. Okul ağı
   cdnjs'i engellerse (ya da internet yoksa) karekod ÇİZİLMİYOR. Bu
   yalnız girişi değil şunları da vuruyordu:
       hesap/qrgiris.js         karekodla giriş
       hesap/oturumguvenlik.js  oturum güvenliği karekodu
       bilgiyarismasikacom.js   yarışmaya katılma karekodu
       bilgiyarismasivezinler.js
       sarf.js / sarf/sarf.js   paylaşım karekodu

   ÇÖZÜM: depoda zaten BAŞKA bir karekod kütüphanesi var —
   pano/qrcode.min.js (qrcode-generator, Kazuhiko Arase; pano.html
   kullanıyor). Ama API'si bambaşka: nesne değil işlev
   (qrcode(tip,seviye) + addData + make + createSvgTag).

   Bu dosya o kütüphanenin üstüne CDN'dekinin API'sini kuruyor:
   new QRCode(element, {text,width,height,correctLevel}) · makeCode · clear.
   Böylece ÇAĞIRAN HİÇBİR DOSYA DEĞİŞMİYOR; CDN geldiyse bu dosya hiç
   devreye girmiyor (window.QRCode doluysa dokunmadan çıkıyor).

   YÜKLEME SIRASI ÖNEMLİ — her sayfada şöyle:
       <script src="…cdnjs…/qrcode.min.js"></script>   (varsa gelir)
       <script src="pano/qrcode.min.js"></script>      (yerel üretici)
       <script src="sistem/karekodyedek.js"></script>  (bu dosya)
   CDN etiketi duruyor: geldiğinde özgün kütüphane kullanılıyor, bu
   yedek yalnız o gelmediğinde çalışıyor.
   ===================================================================== */
(function () {
  'use strict';

  /* CDN geldiyse karışma. */
  if (typeof window.QRCode === 'function') return;
  /* Yerel üretici de yoksa yapacak bir şey yok; çağıran taraflar zaten
     "window.QRCode var mı" diye bakıp kendi uyarısını gösteriyor. */
  if (typeof window.qrcode !== 'function') return;

  /* qrcodejs'in CorrectLevel sayıları → üreticinin harfleri.
     (qrcodejs: L=1, M=0, Q=3, H=2 — sıralama alışılmadık ama böyle.) */
  var SEVIYE = { 0: 'M', 1: 'L', 2: 'H', 3: 'Q' };

  function kokEleman(el) {
    return (typeof el === 'string') ? document.getElementById(el) : el;
  }

  function ciz(kutu, metin, en, boy, seviye) {
    var q = window.qrcode(0, seviye);          /* 0: boya göre tip seç */
    q.addData(String(metin == null ? '' : metin));
    q.make();
    /* cellSize/margin değil, ölçek dışarıdan: kutuya tam oturması için
       SVG'ye width/height veriliyor, viewBox oranı koruyor. */
    kutu.innerHTML = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    var sv = kutu.querySelector('svg');
    if (sv) {
      sv.setAttribute('width', String(en));
      sv.setAttribute('height', String(boy));
      sv.style.display = 'block';
      sv.style.maxWidth = '100%';
      sv.style.height = 'auto';
    }
  }

  /* CDN'dekiyle aynı imza. İkinci argüman düz metin de olabilir. */
  function QRCode(el, ayar) {
    var kutu = kokEleman(el);
    if (!kutu) return;
    if (typeof ayar === 'string') ayar = { text: ayar };
    ayar = ayar || {};
    this._kutu = kutu;
    this._en = ayar.width || 256;
    this._boy = ayar.height || ayar.width || 256;
    this._seviye = SEVIYE[ayar.correctLevel] || 'M';
    if (ayar.text) this.makeCode(ayar.text);
  }
  QRCode.prototype.makeCode = function (metin) {
    this._metin = metin;
    try {
      ciz(this._kutu, metin, this._en, this._boy, this._seviye);
    } catch (e) {
      /* Çok uzun metin tip sınırını aşabilir; sessiz kalmak yerine
         çağıran taraf görsün diye kutuyu boş bırakıyoruz. */
      this._kutu.innerHTML = '';
    }
  };
  QRCode.prototype.clear = function () { if (this._kutu) this._kutu.innerHTML = ''; };
  QRCode.CorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };

  window.QRCode = QRCode;
  window.KidefKarekodYedek = true;     /* "yedek devrede" işareti */
})();
