/* ======================================================================
   KIDEF · TELEFON KUMANDA — karekodla girişten sonra      hesap/kumanda.js
   ----------------------------------------------------------------------
                                                            17.10.2026
   Öğretmen: "siteye mobilden karekod taranarak giriş yapınca telefonu
   site kumandası olarak kullanıp kullanmayacağını da soralım".

   AKIŞ (tahtaya yansıtma motoru sistem/tahta.js kullanılır)
   · TELEFON: tahtadaki giriş karekodunu okutup "Onayla"ya basınca onay
     penceresinde soru çıkar: "Bu telefon tahtanın kumandası olsun mu?"
     (hesap/qrgiris.js onaydan sonra KidefKumanda.sor(oturumId) çağırır;
     öğrenci hesabına sorulmaz). "Evet" → hesabın canlı veritabanına
     tahta/<uid>/kumanda = { qr: oturumId, t } yazılır, telefon
     tahta.html?rol=yansit'e geçer: telefonda açılan sayfa, dokunulan
     düğme tahtada da olur.
   · TAHTA: karekodla giriş tamamlanınca hesap/qrgiris.js sayfayı
     yenilemeden önce oturum kimliğini sessionStorage'a (kidef_qr_son)
     yazar. Yenilenen sayfada bu dosya 3 dakika boyunca tahta/<uid>/kumanda'yı
     dinler; AYNI oturumun "Evet"i gelirse cihazı tahta olarak işaretler
     (sistem/tahtagir.js'teki "Bu cihaz tahta" ile aynı) ve
     tahta.html?rol=izle'ye geçer. "Hayır" denirse ya da süre geçerse
     hiçbir şey olmaz.
   Veritabanı kuralı tahta.js'teki kuralın aynısı (tahta/$uid yalnız
   o hesaba açık); yeni kural gerekmez.
   ====================================================================== */
(function () {
  'use strict';
  if (window.KidefKumanda) return;
  try { if (window.name === 'kidefTahta') { window.KidefKumanda = { sor: function () { } }; return; } } catch (e) { }

  /* sistem/tahta.js ve sistem/tahtagir.js'teki adresle aynı olmalı */
  var VT_ADRES = 'https://kidefarapca-98f9c-default-rtdb.europe-west1.firebasedatabase.app';
  var SDK = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
  var ANAHTAR = 'kidef_qr_son';
  var BEKLEME = 3 * 60 * 1000;
  var KOK = (function () {
    try {
      var s = document.currentScript && document.currentScript.src;
      if (s) return s.replace(/hesap\/kumanda\.js.*$/, '');
    } catch (e) { }
    return location.href.replace(/[^\/]*([?#].*)?$/, '');
  })();

  function $(id) { return document.getElementById(id); }
  function kullanici() {
    try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; return (u && !u.isAnonymous) ? u : null; } catch (e) { return null; }
  }
  /* Yalnız ÖĞRENCİ olduğu kesin hesaba sorulmaz. appState.userRole rol
     çözülene kadar 'student' durabiliyor; o yüzden önce bu hesabın rol
     önbelleğine (sistem/rol.js → kidefRolBilgi) bakılır. Emin değilsek sorulur. */
  function ogrenciMi() {
    var u = kullanici();
    try {
      var r = JSON.parse(localStorage.getItem('kidefRolBilgi') || 'null');
      if (r && u && r.uid === u.uid) return !(r.ogretmen || /^(teacher|admin)$/.test(r.rol || ''));
    } catch (e) { }
    return false;
  }
  function sdk() {
    return new Promise(function (ok, hata) {
      if (window.firebase && typeof firebase.database === 'function') return ok();
      var s = document.createElement('script');
      s.src = SDK;
      s.onload = function () { (window.firebase && typeof firebase.database === 'function') ? ok() : hata(new Error('sdk')); };
      s.onerror = function () { hata(new Error('sdk')); };
      document.head.appendChild(s);
    });
  }
  function vt() { return firebase.app().database(VT_ADRES); }

  /* ------------------------------------------------------------ stil */
  var STIL = [
    '.kmd-soru{margin-top:14px;padding:16px 14px 14px;border-radius:16px;background:#F1FAF7;border:1px solid #CDEBE2;text-align:center}',
    '.kmd-soru svg{display:block;width:150px;height:auto;margin:0 auto 8px}',
    '.kmd-soru b{display:block;font-size:1.06rem;font-weight:800;color:#0F2A43;line-height:1.3}',
    '.kmd-soru p{margin:6px 0 12px;font-size:.9rem;color:#475569;line-height:1.45}',
    '.kmd-tuslar{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
    '.kmd-tuslar button{flex:1 1 130px;padding:12px 14px;border-radius:12px;font:inherit;font-weight:800;font-size:.95rem;cursor:pointer;border:1px solid transparent}',
    '.kmd-evet{background:#16A085;color:#fff;box-shadow:0 6px 16px rgba(22,160,133,.3)}',
    '.kmd-hayir{background:#fff;color:#475569;border-color:#D8E2EC !important}',
    '.kmd-tuslar button:disabled{opacity:.6;cursor:default}',
    '.kmd-durum{margin-top:10px;font-size:.88rem;font-weight:700;color:#0E7C66;min-height:1.2em}',
    '.kmd-durum.hata{color:#C0392B}',
    '.kmd-akis{stroke-dasharray:3 7;animation:kmdAkis 1s linear infinite}',
    '@keyframes kmdAkis{to{stroke-dashoffset:-10}}',
    '@media (prefers-reduced-motion:reduce){.kmd-akis{animation:none}}'
  ].join('\n');
  function stilKur() {
    if ($('kmdStil')) return;
    var s = document.createElement('style');
    s.id = 'kmdStil';
    s.textContent = STIL;
    (document.head || document.documentElement).appendChild(s);
  }
  /* telefon → tahta çizimi */
  var CIZIM = '<svg viewBox="0 0 160 70" aria-hidden="true">' +
    '<rect x="62" y="6" width="92" height="56" rx="6" fill="#0F2A43"/><rect x="67" y="11" width="82" height="44" rx="3" fill="#fff"/>' +
    '<rect x="72" y="16" width="40" height="5" rx="2.5" fill="#16A085"/><rect x="72" y="26" width="64" height="4" rx="2" fill="#CBD5E1"/>' +
    '<rect x="72" y="34" width="52" height="4" rx="2" fill="#CBD5E1"/><rect x="104" y="43" width="26" height="8" rx="4" fill="#F39C12"/>' +
    '<rect x="6" y="18" width="26" height="46" rx="5" fill="#334155"/><rect x="9" y="23" width="20" height="34" rx="2" fill="#fff"/>' +
    '<rect x="11" y="27" width="12" height="3" rx="1.5" fill="#16A085"/><rect x="12" y="46" width="14" height="6" rx="3" fill="#F39C12"/>' +
    '<path class="kmd-akis" d="M34 38C46 24 52 22 60 26" fill="none" stroke="#16A085" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>';

  /* ------------------------------------------------------- TELEFON TARAFI */
  function sor(oturumId) {
    if (!oturumId || !kullanici() || ogrenciMi()) return;
    var g = $('qrGovde');
    if (!g || g.querySelector('.kmd-soru')) return;
    stilKur();
    var d = document.createElement('div');
    d.className = 'kmd-soru';
    d.innerHTML = CIZIM +
      '<b>Bu telefon tahtanın kumandası olsun mu?</b>' +
      '<p>Telefonda açtığın sayfa, dokunduğun düğme tahtada da olur; tahtanın önüne gitmeden dersi yönetirsin.</p>' +
      '<div class="kmd-tuslar"><button type="button" class="kmd-hayir">Hayır</button>' +
      '<button type="button" class="kmd-evet">Evet, kumanda olsun</button></div>' +
      '<div class="kmd-durum" aria-live="polite"></div>';
    g.appendChild(d);
    var evet = d.querySelector('.kmd-evet'), hayir = d.querySelector('.kmd-hayir'), durum = d.querySelector('.kmd-durum');
    hayir.addEventListener('click', function () {
      d.innerHTML = '<div class="kmd-durum">Tamam, telefon kumanda olmadı. Tahtayı istediğin zaman başlıktaki ekran simgesinden yansıtabilirsin.</div>';
    });
    evet.addEventListener('click', function () {
      evet.disabled = hayir.disabled = true;
      durum.className = 'kmd-durum';
      durum.textContent = 'Tahtaya bağlanıyor…';
      var u = kullanici();
      if (!u) { durum.className = 'kmd-durum hata'; durum.textContent = 'Önce giriş yapmalısın.'; return; }
      sdk().then(function () {
        return vt().ref('tahta/' + u.uid + '/kumanda').set({ qr: String(oturumId), t: firebase.database.ServerValue.TIMESTAMP });
      }).then(function () {
        durum.textContent = 'Bağlandı — kumanda açılıyor…';
        setTimeout(function () { location.href = KOK + 'tahta.html?rol=yansit'; }, 400);
      }).catch(function (e) {
        evet.disabled = hayir.disabled = false;
        durum.className = 'kmd-durum hata';
        durum.textContent = 'Bağlanılamadı (' + ((e && (e.code || e.message)) || 'bağlantı') + '). Yeniden dene.';
      });
    });
  }

  /* --------------------------------------------------------- TAHTA TARAFI */
  function tahtaTarafi() {
    var s = null;
    try { s = JSON.parse(sessionStorage.getItem(ANAHTAR) || 'null'); } catch (e) { s = null; }
    if (!s || !s.id) return;
    var kalan = BEKLEME - (Date.now() - (s.t || 0));
    if (kalan <= 0) { try { sessionStorage.removeItem(ANAHTAR); } catch (e) { } return; }
    var basladi = false;
    var bagla = function () {
      try {
        if (!window.firebase || !firebase.apps || !firebase.apps.length) return false;
        firebase.auth().onAuthStateChanged(function (u) {
          if (basladi || !u || u.isAnonymous) return;
          basladi = true;
          dinle(u.uid, s, kalan);
        });
        return true;
      } catch (e) { return false; }
    };
    if (bagla()) return;
    var n = 0, z = setInterval(function () { if (bagla() || ++n > 40) clearInterval(z); }, 250);
  }
  function dinle(uid, s, kalan) {
    sdk().then(function () {
      var ref = vt().ref('tahta/' + uid + '/kumanda');
      var bitti = false;
      var son = setTimeout(function () {
        bitti = true;
        ref.off('value', bak);
        try { sessionStorage.removeItem(ANAHTAR); } catch (e) { }
      }, kalan);
      function bak(snap) {
        var v = snap && snap.val();
        if (bitti || !v || String(v.qr) !== String(s.id)) return;
        bitti = true;
        clearTimeout(son);
        ref.off('value', bak);
        try { sessionStorage.removeItem(ANAHTAR); } catch (e) { }
        try { localStorage.setItem('kidef_tahta_cihaz', 'tahta'); } catch (e) { }
        ref.remove().catch(function () { }).then(function () {
          location.href = KOK + 'tahta.html?rol=izle';
        });
      }
      ref.on('value', bak, function () { });
    }).catch(function () { });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tahtaTarafi);
  else tahtaTarafi();

  window.KidefKumanda = { sor: sor };
})();
