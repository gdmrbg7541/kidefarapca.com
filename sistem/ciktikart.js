/* ===========================================================================
   KIDEF · YILLIK ÇIKTILAR KARTI            (sistem/ciktikart.js)
   ---------------------------------------------------------------------------
   Öğretmen: "her kitap için bi yıllık her hafta için öğrenim çıktısı otomatik
   olarak seçilen kitaplara göre hazır olsun, fakat öğretmenin pratik bi
   şekilde ulaşabilmesi lazım, öğretmen olarak giriş yapanların kolay
   erişebileceği bi yere ekleyelim."

   Sınıf kartlarının arasına «Yıllık Çıktılar» kartı koyar. Kart cikti.html'i
   o sınıfla açar; sayfa, site genelinde SEÇİLİ olan kitabın 36 haftasını
   gösterir (kitap değişince çıktılar da değişir).

   İKİ KAPI
     1. Öğretmen girişi şart — öğrenciye görünmez. Rol geç çözülürse
        (oturum açılışı asenkron) kart o anda belirir: rol gelince
        KidefSinifModul.kur() bir kez daha çağrılır.
     2. O sınıfın SEÇİLİ kitabında hazır çıktı olmalı. Dizin
        sistem/ciktivar.js'ten okunur (0,6 KB). Asıl veri ciktiveri.js
        150 KB'ın üstünde; ana sayfaya hiç yüklenmez, yalnız cikti.html
        ve istendiğinde sınıf defteri yükler.

   Planı olmayan kitapta (6. sınıf eski kitap, 7. sınıf 2027-2028) kart
   ÇIKMAZ — yanlış kitabın çıktısını göstermektense hiç göstermemek.
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefCiktiKart) return;

  var ANAHTAR_NOT = 'Bu kartı yalnız öğretmen hesabı görür.';

  function ogretmenMi() {
    try {
      if (typeof appState !== 'undefined' && appState && appState.userRole) {
        var r = appState.userRole;
        if (r === 'teacher' || r === 'admin') return true;
        if (r === 'student') return false;
      }
    } catch (e) {}
    try {
      var h = window.KidefRol && window.KidefRol.onbellekOku && window.KidefRol.onbellekOku();
      if (h) return !!h.ogretmen;
    } catch (e) {}
    return false;
  }

  /* Seçili kitabın çıktı anahtarı — yoksa null */
  function anahtar(sinif) {
    var D = window.KIDEF_CIKTI_VAR;
    if (!D) return null;
    var V = window.KidefSinifVeri;
    var k = null;
    try { k = (V && V.seciliVeriYili) ? V.seciliVeriYili(sinif) : null; } catch (e) {}
    if (k && D[sinif + '@' + k.yil]) return sinif + '@' + k.yil;
    if (D[String(sinif)]) return String(sinif);
    return null;
  }

  function svg() {
    return '<svg viewBox="0 0 64 64" class="kg" aria-hidden="true">' +
      /* takvim gövdesi */
      '<rect x="8" y="12" width="48" height="44" rx="5" fill="#fff" stroke="#0E7C66" stroke-width="2.6"/>' +
      '<path d="M8 24h48" stroke="#0E7C66" stroke-width="2.6"/>' +
      '<path d="M8 17a5 5 0 0 1 5-5h38a5 5 0 0 1 5 5v7H8z" fill="#16A085"/>' +
      '<rect x="18" y="6" width="5" height="11" rx="2.5" fill="#0E7C66"/>' +
      '<rect x="41" y="6" width="5" height="11" rx="2.5" fill="#0E7C66"/>' +
      /* haftalar — sırayla yanıp sönen dolu kutucuklar */
      '<g fill="#CFE3DD">' +
        '<rect x="14" y="30" width="9" height="6" rx="1.6"/>' +
        '<rect x="27" y="30" width="9" height="6" rx="1.6"/>' +
        '<rect x="40" y="30" width="9" height="6" rx="1.6"/>' +
        '<rect x="14" y="40" width="9" height="6" rx="1.6"/>' +
        '<rect x="40" y="40" width="9" height="6" rx="1.6"/>' +
      '</g>' +
      '<rect class="ykg-gun" x="27" y="40" width="9" height="6" rx="1.6" fill="#16A085"/>' +
      /* onay işareti: hafta işlendi */
      '<path class="ykg-onay" d="M16 48.5l4.6 4.6L31 42.7" fill="none" stroke="#E67E22" ' +
        'stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function stil() {
    if (document.getElementById('ykgStil')) return;
    var s = document.createElement('style');
    s.id = 'ykgStil';
    s.textContent =
      '@keyframes ykgGun{0%,100%{opacity:.35}45%,60%{opacity:1}}' +
      '@keyframes ykgOnay{0%,55%{stroke-dashoffset:26}72%,100%{stroke-dashoffset:0}}' +
      '.sm-kart .ykg-gun{animation:ykgGun 3s ease-in-out infinite}' +
      '.sm-kart .ykg-onay{stroke-dasharray:26;animation:ykgOnay 3s ease-in-out infinite}' +
      '@media (prefers-reduced-motion:reduce){' +
      '  .sm-kart .ykg-gun,.sm-kart .ykg-onay{animation:none}' +
      '  .sm-kart .ykg-onay{stroke-dashoffset:0}}';
    document.head.appendChild(s);
  }

  function kaydet() {
    var M = window.KidefSinifModul;
    if (!M) return false;
    stil();
    M.ekle({
      id: 'yillikcikti',
      ad: 'Yıllık Çıktılar',
      sira: 12,                       /* ders kitabı kartlarının yanında */
      renk: '#0E7C66',
      aciklama: function (s) {
        var a = anahtar(s), D = window.KIDEF_CIKTI_VAR || {};
        return (a && D[a]) ? (D[a].ad + ' · haftalık öğrenme çıktıları')
                           : 'Haftalık öğrenme çıktıları';
      },
      svg: svg,
      veriVar: function (s) {
        if (!ogretmenMi()) return null;          /* öğrenciye görünmez */
        var a = anahtar(s), D = window.KIDEF_CIKTI_VAR || {};
        if (!a || !D[a]) return null;            /* bu kitabın planı yok */
        return { rozet: D[a].hafta + ' hafta' };
      },
      url: function (s) { return 'cikti.html?sinif=' + s; }
    });
    return true;
  }

  /* Rol oturum açılışında asenkron çözülüyor: kart ilk kurulumda
     görünmeyebilir. Öğretmen olduğu anlaşılınca kartları bir kez tazele. */
  function rolBekle() {
    var kez = 0, oncekiRol = ogretmenMi();
    var z = setInterval(function () {
      kez++;
      var simdi = ogretmenMi();
      if (simdi !== oncekiRol) {
        oncekiRol = simdi;
        try { if (window.KidefSinifModul) window.KidefSinifModul.kur(); } catch (e) {}
      }
      if (kez > 40 || (simdi && kez > 4)) clearInterval(z);   /* en çok ~20 sn */
    }, 500);
  }

  function basla() {
    if (!kaydet()) { setTimeout(basla, 300); return; }
    rolBekle();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();

  window.KidefCiktiKart = { anahtar: anahtar, ogretmenMi: ogretmenMi, not: ANAHTAR_NOT };
})();
