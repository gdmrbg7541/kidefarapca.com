/* ===========================================================================
   MEYDAN OKUMA — sistem/meydan.js                                   (15.11.2026)
   ---------------------------------------------------------------------------
   Öğretmen: "sistemde bi öğretmene tanımlı öğrenciler birbirine meydan okuma
   yapabilsinler".
   Akış: öğrenci aynı öğretmenin bir öğrencisini ve puanlı bir oyunu seçer →
   rakip kabul eder → ikisi de oyunu «Oyna» ile açar (oyun.html?meydan=<id>) →
   oyunun köprüsü (sistem/gorevkopru.js) İLK oyunun puanını meydan belgesine yazar
   → ikisi de oynayınca kazanan görünür. 3 günde oynanmayan meydan okuma düşer.
   VERİ
     meydanListe/{ogretmenUid}  öğretmenin tarayıcısı yazar: uyeler [uid], ogrenciler {uid: {ad, s}}, acik
     meydan/{id}                kimden, kime, ogretmenUid, oyun, oyunAd, adlar {uid: ad}, durum
                                ('bekliyor' | 'kabul' | 'red'), t, kabul, puanlar {uid: {y, t}}
   Okuma: öğrenci profil kartı yüklenince iki küçük sorgu (gelen / giden, en çok 12'şer);
   rakip listesi yalnız «Yeni meydan okuma» açılınca bir kez.
   =========================================================================== */
(function () {
  'use strict';
  if (window.KidefMeydan) return;
  var MY = window.KidefMeydan = {};
  var C_M = 'meydan', C_L = 'meydanListe', SURE = 3 * 864e5, EN_COK_ACIK = 3;

  function fb() { return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase : null; }
  function oturum() { var f = fb(); try { return (f && f.auth) ? f.auth().currentUser : null; } catch (e) { return null; } }
  function veri() { var f = fb(); if (!f) return null; try { if (typeof db !== 'undefined' && db) return db; return f.firestore(); } catch (e) { return null; } }
  function rol() { try { return (typeof appState !== 'undefined' && appState.userRole) ? appState.userRole : ''; } catch (e) { return ''; } }
  function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }
  function veriAl() { return (typeof data !== 'undefined' && data) ? data : null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var IK = {
    kilic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/><path d="M9.5 6.5 14 2h3v3l-4.5 4.5"/></svg>',
    oyna: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    onay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    sil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    kupa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M9.5 17h5"/></svg>'
  };
  function stil() {
    if (document.getElementById('myStil')) return;
    var s = document.createElement('style'); s.id = 'myStil';
    s.textContent =
      '.my-k{font-size:.9rem;color:#5A4034;}' +
      '.my-k svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none;}' +
      '.my-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 14px;border:0;border-radius:11px;cursor:pointer;font:800 .86rem/1 inherit;color:#fff;background:linear-gradient(135deg,#8E44AD,#6C3483);text-decoration:none;}' +
      '.my-btn.y{background:linear-gradient(135deg,#20C997,#16A085);}.my-btn.g{background:#F1EAF5;color:#6C3483;}' +
      '.my-form{display:grid;gap:8px;background:#F8F2FB;border:1.5px solid #E2CFEC;border-radius:12px;padding:10px;margin-top:8px;}' +
      '.my-form select{width:100%;box-sizing:border-box;padding:10px;border:1px solid #CDAFDD;border-radius:10px;font:inherit;background:#fff;}' +
      '.my-m{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fff;border:1px solid #E8DAF0;border-radius:12px;padding:10px 12px;margin-top:8px;}' +
      '.my-m .vs{flex:1;min-width:180px;line-height:1.45;}' +
      '.my-m .vs b{color:#6C3483;}.my-m .vs small{display:block;color:#8E7A99;font-size:.76rem;}' +
      '.my-m .puan{font-weight:800;}' +
      '.my-m.kaz{border-color:#A9DFBF;background:#F0FBF5;}.my-m.kay{border-color:#F5B7B1;background:#FEF5F4;}' +
      '.my-bilgi{font-size:.8rem;min-height:16px;margin-top:4px;}';
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------------------------------------------------------- ÖĞRETMEN: rakip listesi */
  MY.liste = function () {
    var d = veriAl(), u = [], o = {};
    if (!d || !d.levels) return null;
    Object.keys(d.levels).forEach(function (lId) {
      var l = d.levels[lId], cl = (l && l.classes) || {};
      Object.keys(cl).forEach(function (cId) {
        (cl[cId].students || []).forEach(function (s) {
          if (!s || !s.hesapUid || o[s.hesapUid]) return;
          u.push(s.hesapUid); o[s.hesapUid] = { ad: String(s.name || 'Öğrenci').slice(0, 60), s: String(cl[cId].name || cId).slice(0, 30) };
        });
      });
    });
    return { uyeler: u, ogrenciler: o };
  };
  MY.ogtEsitle = function () {
    var u = oturum(), Db = veri(); if (!u || !Db || !ogretmenMi() || window._llBulutGeldi !== u.uid) return;
    var L = MY.liste(); if (!L) return;
    var imza = JSON.stringify(L), an = 'kidefMeydanImza|' + u.uid;
    try { if (localStorage.getItem(an) === imza) return; } catch (e) { }
    Db.collection(C_L).doc(u.uid).set({ ogretmenUid: u.uid, uyeler: L.uyeler, ogrenciler: L.ogrenciler, guncelleme: Date.now() }, { merge: true })
      .then(function () { try { localStorage.setItem(an, imza); } catch (e) { } })
      .catch(function (e) { console.warn('meydan listesi:', e && (e.code || e.message)); });
  };
  /* öğretmen: aç / kapat (Sınıf Başkanı sekmesindeki kutu) */
  MY.acikOku = function () {
    var u = oturum(), Db = veri(); if (!u || !Db) return Promise.resolve(true);
    return Db.collection(C_L).doc(u.uid).get().then(function (s) { return !(s.exists && s.data().acik === false); }).catch(function () { return true; });
  };
  MY.acikYaz = function (ac) {
    var u = oturum(), Db = veri(); if (!u || !Db) return Promise.resolve();
    var L = MY.liste() || { uyeler: [], ogrenciler: {} };
    return Db.collection(C_L).doc(u.uid).set({ ogretmenUid: u.uid, acik: !!ac, uyeler: L.uyeler, ogrenciler: L.ogrenciler, guncelleme: Date.now() }, { merge: true });
  };

  /* ---------------------------------------------------------- ÖĞRENCİ */
  MY.gelen = []; MY.giden = []; MY._liste = null; MY._form = false;
  function bag() { var b = window.OH && OH.bag; return (b && b.durum === 'onayli' && b.ogretmenUid) ? b : null; }
  MY.yukle = function (zorla) {
    var u = oturum(), Db = veri(), b = bag(); if (!u || !Db || !b || ogretmenMi()) return;
    if (!zorla && MY._okuma && Date.now() - MY._okuma < 30000) return;
    MY._okuma = Date.now();
    var q = function (alan) { return Db.collection(C_M).where(alan, '==', u.uid).where('ogretmenUid', '==', b.ogretmenUid).get().then(function (s) { var l = []; s.forEach(function (d) { var v = d.data() || {}; v._id = d.id; l.push(v); }); return l; }).catch(function () { return []; }); };
    Promise.all([q('kime'), q('kimden')]).then(function (r) {
      var sirala = function (l) { return l.sort(function (a, c) { return (c.t || 0) - (a.t || 0); }).slice(0, 12); };
      MY.gelen = sirala(r[0]); MY.giden = sirala(r[1]);
      if (window.GV && GV.profilKartiGuncelle) { try { GV.profilKartiGuncelle(); } catch (e) { } }
    });
  };
  function oyunlar() { return ((window.GV && GV.OYUNLAR) || []).filter(function (o) { return (o.tur || 'puan') !== 'sure'; }); }
  function sonuc(m, ben) {
    var P = m.puanlar || {}, rakip = ben === m.kimden ? m.kime : m.kimden, a = P[ben], b = P[rakip];
    var bitti = !!(a && b), eskidi = m.durum === 'kabul' && m.kabul && Date.now() - m.kabul > SURE;
    return { a: a, b: b, rakip: rakip, bitti: bitti || (eskidi && (a || b)), sonucu: !bitti ? (eskidi ? (a && !b ? 'kaz' : (b && !a ? 'kay' : '')) : '') : (a.y > b.y ? 'kaz' : (a.y < b.y ? 'kay' : 'ber')) };
  }
  function kartHtml(m, ben) {
    var ad = m.adlar || {}, S = sonuc(m, ben), rakipAd = ad[S.rakip] || 'Rakip', eski = Date.now() - (m.kabul || m.t || 0) > SURE;
    var ust = '<b>' + esc(ad[ben] || 'Sen') + '</b> ile <b>' + esc(rakipAd) + '</b><small>' + esc(m.oyunAd || m.oyun) + '</small>';
    var sag = '', cls = '';
    if (m.durum === 'red') sag = '<small style="color:#A6836E">reddedildi</small>';
    else if (m.durum === 'bekliyor') {
      if (eski) sag = '<small style="color:#A6836E">süresi doldu</small>';
      else if (m.kime === ben) sag = '<button type="button" class="my-btn y" data-my="kabul" data-id="' + esc(m._id) + '">' + IK.onay + 'Kabul et</button><button type="button" class="my-btn g" data-my="red" data-id="' + esc(m._id) + '">Reddet</button>';
      else sag = '<small style="color:#8E7A99">cevap bekleniyor</small> <button type="button" class="my-btn g" data-my="iptal" data-id="' + esc(m._id) + '" title="Geri al">' + IK.sil + '</button>';
    } else if (m.durum === 'kabul') {
      if (S.bitti) {
        cls = S.sonucu === 'kaz' ? ' kaz' : (S.sonucu === 'kay' ? ' kay' : '');
        sag = '<span class="puan">' + (S.a ? '%' + S.a.y : '—') + ' : ' + (S.b ? '%' + S.b.y : '—') + '</span> <b style="color:' + (S.sonucu === 'kaz' ? '#1E8449' : S.sonucu === 'kay' ? '#C0392B' : '#6C3483') + '">' +
          (S.sonucu === 'kaz' ? 'Kazandın' : S.sonucu === 'kay' ? 'Kaybettin' : 'Berabere') + '</b>';
      } else if (eski) sag = '<small style="color:#A6836E">süresi doldu</small>';
      else if (!S.a) sag = '<a class="my-btn" href="' + esc(m.oyun) + '?meydan=' + encodeURIComponent(m._id) + '" target="_blank" rel="opener">' + IK.oyna + 'Oyna</a>' + (S.b ? '<small style="color:#8E7A99"> rakibin oynadı</small>' : '');
      else sag = '<span class="puan">%' + S.a.y + '</span> <small style="color:#8E7A99">rakibin bekleniyor</small>';
    }
    return '<div class="my-m' + cls + '"><span class="vs">' + ust + '</span>' + sag + '</div>';
  }
  MY.ogrHtml = function (akordiyon) {
    var u = oturum(), b = bag(); if (!u || !b || typeof akordiyon !== 'function' || ogretmenMi()) return '';
    stil();
    var hepsi = MY.gelen.concat(MY.giden), bekleyen = MY.gelen.filter(function (m) { return m.durum === 'bekliyor' && Date.now() - (m.t || 0) < SURE; }).length;
    var oynanacak = hepsi.filter(function (m) { return m.durum === 'kabul' && !(m.puanlar || {})[u.uid] && Date.now() - (m.kabul || 0) < SURE; }).length;
    var ic = '<div class="my-k" id="myKutu"><p style="margin:0 0 6px;font-size:.84rem;color:#8E7A99">Öğretmeninin bir öğrencisine bir oyunda meydan oku. İkiniz de oynayınca ilk oyunun puanı karşılaştırılır.</p>' +
      '<button type="button" class="my-btn" data-my="form">' + IK.kilic + 'Yeni meydan okuma</button><div id="myForm"></div>' +
      (hepsi.length ? hepsi.sort(function (a, c) { return (c.t || 0) - (a.t || 0); }).map(function (m) { return kartHtml(m, u.uid); }).join('') : '<p style="margin:8px 0 0;font-size:.82rem;color:#A6836E">Henüz meydan okuma yok.</p>') + '</div>';
    var rozet = (bekleyen + oynanacak) ? '<span style="font-size:.72rem;font-weight:700;padding:2px 9px;border-radius:999px;background:#F1E4F7;color:#6C3483;">' + (bekleyen ? bekleyen + ' yeni' : oynanacak + ' oyun') + '</span>' : '';
    setTimeout(bagla, 0);
    return akordiyon('prfMeydan', '#8E44AD', '<span>Meydan Okuma</span>' + rozet, ic, !!(bekleyen || oynanacak));
  };
  function bilgi(m, h) { var el = document.getElementById('myBilgi'); if (el) { el.style.color = h ? '#C0392B' : '#16A085'; el.textContent = m; } }
  function bagla() {
    var k = document.getElementById('myKutu'); if (!k || k._bagli) return; k._bagli = true;
    if (MY._form) formCiz();
    k.addEventListener('click', function (e) {
      var b = e.target.closest('[data-my]'); if (!b) return;
      var is = b.getAttribute('data-my'), id = b.getAttribute('data-id'), Db = veri();
      if (is === 'form') { MY._form = !MY._form; formCiz(); return; }
      if (is === 'gonder') { gonder(); return; }
      var m = MY.gelen.concat(MY.giden).filter(function (x) { return x._id === id; })[0]; if (!m || !Db) return;
      var p = is === 'kabul' ? Db.collection(C_M).doc(id).update({ durum: 'kabul', kabul: Date.now() })
        : is === 'red' ? Db.collection(C_M).doc(id).update({ durum: 'red' })
        : is === 'iptal' ? Db.collection(C_M).doc(id).delete() : null;
      if (p) p.then(function () { MY.yukle(true); }).catch(function (er) { alert('Olmadı: ' + ((er && (er.code || er.message)) || '')); });
    });
  }
  function formCiz() {
    var f = document.getElementById('myForm'); if (!f) return;
    if (!MY._form) { f.innerHTML = ''; return; }
    var u = oturum(), b = bag(), Db = veri();
    if (!MY._liste) {
      f.innerHTML = '<div class="my-form"><small style="color:#8E7A99">Arkadaş listesi yükleniyor…</small></div>';
      Db.collection(C_L).doc(b.ogretmenUid).get().then(function (s) {
        MY._liste = s.exists ? (s.data() || {}) : { yok: true }; formCiz();
      }).catch(function () { MY._liste = { yok: true }; formCiz(); });
      return;
    }
    if (MY._liste.yok || MY._liste.acik === false) { f.innerHTML = '<div class="my-form"><small style="color:#A6836E">' + (MY._liste.acik === false ? 'Öğretmenin meydan okumayı şimdilik kapattı.' : 'Öğretmenin listesi henüz hazır değil; öğretmenin siteye girince açılır.') + '</small></div>'; return; }
    var O = MY._liste.ogrenciler || {}, uid = u.uid;
    var kisiler = Object.keys(O).filter(function (x) { return x !== uid; }).sort(function (a, c) { return (O[a].s + O[a].ad).localeCompare(O[c].s + O[c].ad, 'tr'); });
    f.innerHTML = '<div class="my-form"><label style="font-size:.8rem;font-weight:700;color:#6C3483">Rakip<select id="myRakip">' + kisiler.map(function (x) { return '<option value="' + esc(x) + '">' + esc(O[x].ad) + ' · ' + esc(O[x].s) + '</option>'; }).join('') + '</select></label>' +
      '<label style="font-size:.8rem;font-weight:700;color:#6C3483">Oyun<select id="myOyun">' + oyunlar().map(function (o) { return '<option value="' + esc(o.d) + '">' + esc(o.ad) + '</option>'; }).join('') + '</select></label>' +
      '<div><button type="button" class="my-btn" data-my="gonder">' + IK.kilic + 'Meydan oku</button></div><div class="my-bilgi" id="myBilgi"></div></div>';
  }
  function gonder() {
    var u = oturum(), b = bag(), Db = veri(), L = MY._liste || {}, O = L.ogrenciler || {};
    var rakip = (document.getElementById('myRakip') || {}).value, oyun = (document.getElementById('myOyun') || {}).value;
    if (!u || !b || !Db || !rakip || !oyun) return;
    var acik = MY.giden.filter(function (m) { return (m.durum === 'bekliyor' || (m.durum === 'kabul' && !(m.puanlar && m.puanlar[m.kime] && m.puanlar[m.kimden]))) && Date.now() - (m.kabul || m.t || 0) < SURE; }).length;
    if (acik >= EN_COK_ACIK) { bilgi('Aynı anda en çok ' + EN_COK_ACIK + ' açık meydan okuman olabilir.', true); return; }
    var oy = oyunlar().filter(function (o) { return o.d === oyun; })[0] || { ad: oyun }, adlar = {};
    adlar[u.uid] = (O[u.uid] && O[u.uid].ad) || 'Öğrenci'; adlar[rakip] = (O[rakip] && O[rakip].ad) || 'Öğrenci';
    var id = 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    Db.collection(C_M).doc(id).set({ kimden: u.uid, kime: rakip, ogretmenUid: b.ogretmenUid, oyun: oyun, oyunAd: oy.ad, adlar: adlar, durum: 'bekliyor', t: Date.now(), puanlar: {} })
      .then(function () { MY._form = false; bilgi(''); MY.yukle(true); })
      .catch(function (e) { bilgi('Gönderilemedi: ' + ((e && (e.code || e.message)) || ''), true); });
  }
})();
