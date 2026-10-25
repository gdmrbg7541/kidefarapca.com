/* =====================================================================
   AYLIK TÜRKİYE ARAPÇA YARIŞMASI                  oyunlar/aylikyarisma.js
   ---------------------------------------------------------------------
                                                            24.10.2026
   Öğretmen: "aylık türkiye genel bilgiyarismasikacom.html altyapısıyla bi
   yarışma yapmak istiyorum … index te geri sayım olacak, bu geri sayım
   verilen bi yarışma günü ve saatinin geri sayımı olacak ve gizem macera
   tasarım ruhunu taşıyacak, bu yarışmaya öğrenciler saati gelince tıklayıp
   katılabilecek ama şartımız şu, öğrenci girişi olmak zorunda, öğretmenler
   girememeli bu şartlar geri sayımın altında yazsın, amacımız gerçekten
   arapçayı seven öğrencilere siteyi sevdirmek, sorular için öğrencilerin
   çalışması gereken konuları 1. seviyeden başlayıp her ay arttırabiliriz"
   · "ya da aynı anda farklı seviyelerden olabilir".

   · Üç lig aynı anda (Temel · Orta · İleri); yönetici her ay hangi liglerin
     açık olduğunu ve her ligin konularını seçer (önerilen plan: her ay bir
     konu eklenir). Sorular bilgi yarışmasının havuzundan (aylik_havuz.js),
     ligdeki herkese AYNI sorular aynı sırada (görev kodundan tohum).
   · Kapı başlama saatinde açılır, «pencere» dakika açık kalır. Yalnız
     öğrenci hesabı katılır; öğretmen/yönetici katılamaz; misafir giremez.
     Her öğrenci ayda bir kez (sayfa yenilenirse kaldığı sorudan sürer).
   · Puan bilgi yarışmasındaki gibi: toplam 1000, en fazla %15'i hızdan.
     Eşitlikte toplam süre az olan önde.
   · Saat sunucudan (sayfanın Date başlığı) — cihaz saati yanlışsa da kapı
     doğru anda açılır.
   VERİ (Firestore kurallarına dokunulmadı):
     ayarlar/aylikYarisma            herkes okur, yönetici yazar (ayarlar)
     bilgiYarismasi/aylik-<kod>      yönetici kurar (bilgiYarismasi)
       /<lig>/<uid>                  öğrenci kendi katılımını yazar ({alt=**})
   ===================================================================== */
(function () {
  'use strict';
  if (window.AylikYarisma) return;

  var CFG = {
    apiKey: 'AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w', authDomain: 'kidefarapca-98f9c.firebaseapp.com',
    projectId: 'kidefarapca-98f9c', storageBucket: 'kidefarapca-98f9c.firebasestorage.app',
    messagingSenderId: '503317118211', appId: '1:503317118211:web:a9c8cf15b854597e0b3d36', measurementId: 'G-HYY6T2EDKY'
  };
  try { if (!firebase.apps.length) firebase.initializeApp(CFG); } catch (e) { }
  var db = firebase.firestore(), auth = firebase.auth(), FV = firebase.firestore.FieldValue;
  var AYAR = db.collection('ayarlar').doc('aylikYarisma');

  var H = window.AYLIK_HAVUZ || { konular: [] }, KONU = {};
  (H.konular || []).forEach(function (k) { KONU[k.id] = k; });

  var LIG = {
    temel: { ad: 'Temel Lig', alt: 'Alfabe ve kelimeler', renk: '#00f2ff', seviye: 1 },
    orta: { ad: 'Orta Lig', alt: 'Edatlar, kalıplar ve cümleler', renk: '#ff9f43', seviye: 2 },
    ileri: { ad: 'İleri Lig', alt: 'Sarf ve dilbilgisi', renk: '#c084fc', seviye: 3 }
  };
  var LIG_SIRA = ['temel', 'orta', 'ileri'];
  /* ÖNERİLEN PLAN — «1. seviyeden başlayıp her ay arttırabiliriz»: görev N'de her
     ligin ilk N konusu (yönetici değiştirebilir) */
  var PLAN = {
    temel: ['alfabe', 'kelimeler', 'sinif6', 'sinif7', 'sinif8', 'sinif9'],
    orta: ['edatlar', 'tamlamacumle', 'sinif10'],
    ileri: ['vezinler', 'dilbilgisi1', 'dilbilgisi2', 'irab', 'kaliplar']
  };
  /* konuyu çalışmak için sitedeki sayfa */
  var KONU_SAYFA = {
    alfabe: 'alfabe.html', kelimeler: 'kelimeler.html', kaliplar: 'kaliplartablosu.html',
    tamlamacumle: 'tamlamavecumleler.html', sinif6: 'kitap/6-sinif-2026-2027/index.html',
    sinif7: 'kitap/7-sinif-2026-2027/index.html', sinif8: 'kitap/8-sinif-2026-2027/index.html',
    sinif9: 'kitap/9-sinif-2026-2027/index.html', sinif10: 'kitap/10-sinif-2026-2027/index.html'
  };

  function $(id) { return document.getElementById(id); }
  function kac(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function arMi(t) { return /[؀-ۿ]/.test(String(t == null ? '' : t)); }
  function ms(ts) { if (!ts) return 0; if (typeof ts === 'number') return ts; if (ts.toMillis) return ts.toMillis(); if (ts.seconds != null) return ts.seconds * 1000; return 0; }
  var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function saatYaz(t) { var d = new Date(t); return iki(d.getHours()) + ':' + iki(d.getMinutes()); }
  function tarihYaz(t) { var d = new Date(t); return d.getDate() + ' ' + AYLAR[d.getMonth()] + ' ' + GUNLER[d.getDay()] + ' · ' + saatYaz(t); }
  /* gizlilik: «Ahmet Yılmaz» → «Ahmet Y.» */
  function kisaAd(ad) {
    var p = String(ad || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return 'Kâşif';
    var on = p[0].charAt(0).toLocaleUpperCase('tr') + p[0].slice(1);
    return p.length > 1 ? on + ' ' + p[p.length - 1].charAt(0).toLocaleUpperCase('tr') + '.' : on;
  }

  /* --------------------------------------------------- sunucu saati */
  var fark = 0;
  function simdi() { return Date.now() + fark; }
  function saatAl() {
    try {
      return fetch(location.pathname + '?saat=' + Date.now(), { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        var d = r.headers.get('date'), t = d ? Date.parse(d) : NaN;
        if (!isNaN(t) && Math.abs(t - Date.now()) > 1500) fark = t - Date.now() + 500;
      }).catch(function () { });
    } catch (e) { return Promise.resolve(); }
  }

  /* --------------------------------------------------- ses */
  var SES = (function () { try { return localStorage.getItem('aylikSes') !== '0'; } catch (e) { return true; } })(), _ac = null;
  function bip(f, sure, tur, gec) {
    if (!SES) return;
    try {
      _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = _ac.createOscillator(), g = _ac.createGain(), t = _ac.currentTime + (gec || 0);
      o.type = tur || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      o.connect(g); g.connect(_ac.destination); o.start(t); o.stop(t + sure + 0.05);
    } catch (e) { }
  }
  var SESLER = {
    tik: function () { bip(880, 0.08, 'square'); },
    dogru: function () { bip(660, 0.12); bip(990, 0.18, 'sine', 0.1); },
    yanlis: function () { bip(180, 0.28, 'sawtooth'); },
    basla: function () { bip(440, 0.12); bip(660, 0.12, 'sine', 0.12); bip(880, 0.3, 'sine', 0.24); }
  };

  /* --------------------------------------------------- durum */
  var A = null;                 /* ayarlar/aylikYarisma */
  var BEN = { u: null, rol: '', ad: '', hazir: false };
  var KAT = null;               /* bu ayki katılımım {lig, v} */
  var KAT_BAKILDI = '';
  var OYUN = null;
  var gorunen = '';
  var AYAR_OKUNDU = false;

  function asama() {
    if (!A || !A.aktif || !A.bas) return 'yok';
    var t = simdi(), kap = A.bas + (A.pencere || 15) * 60000;
    if (t < A.bas) return 'bekle';
    if (t < kap) return 'acik';
    return 'kapandi';
  }
  function sonucZamani() { return A.bas + (A.pencere || 15) * 60000 + (A.soru || 15) * ((A.sure || 20) + 3) * 1000 + 30000; }
  function acikLigler() { return LIG_SIRA.filter(function (l) { return A && A.ligler && A.ligler[l] && A.ligler[l].length; }); }
  function ogrenciMi() { return !!(BEN.u && BEN.rol === 'student'); }
  function bitirdim() { return !!(KAT && KAT.v && KAT.v.durum === 'bitti' && ogrenciMi()); }
  function ogretmenMi() { return !!(BEN.u && (BEN.rol === 'teacher' || BEN.rol === 'admin')); }
  function katilimRef(lig, uid) { return db.collection('bilgiYarismasi').doc('aylik-' + A.kod).collection(lig).doc(uid); }

  /* --------------------------------------------------- simgeler */
  var S = {
    kilit: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    ogrenci: '<svg viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>',
    yasak: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
    saat: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bir: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/></svg>',
    kitap: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/></svg>'
  };
  function sartlarHtml() {
    var n = A ? (A.soru || 15) : 15, s = A ? (A.sure || 20) : 20, p = A ? (A.pencere || 15) : 15;
    return '<ul class="ay-sartlar">' +
      '<li>' + S.ogrenci + '<span>Yalnız <b>öğrenci hesabıyla giriş yapanlar</b> katılabilir.</span></li>' +
      '<li>' + S.yasak + '<span><b>Öğretmen hesapları katılamaz</b> — öğretmenler bağlantıyı öğrencileriyle paylaşır.</span></li>' +
      '<li>' + S.saat + '<span>Saat gelince <b>«Katıl»</b>a bas; kapı <b>' + p + ' dakika</b> açık kalır.</span></li>' +
      '<li>' + S.bir + '<span>Her öğrenci <b>bir kez</b> yarışır: ' + n + ' soru, her soru ' + s + ' saniye. Hızlı ve doğru olan önde.</span></li>' +
      '</ul>';
  }
  function ligKartlari(sec) {
    var L = acikLigler();
    if (!L.length) return '';
    return '<div class="ay-ligler">' + L.map(function (l) {
      var g = LIG[l], konular = (A.ligler[l] || []).filter(function (id) { return KONU[id]; });
      var ic = '<span class="ay-lig-ad"><i></i>' + kac(g.ad) + '</span><p>' + kac(g.alt) + ' · ' + konular.length + ' konu</p>' +
        '<div class="ay-konular">' + konular.map(function (id) {
          var k = KONU[id], adr = KONU_SAYFA[id];
          return adr && !sec ? '<a class="ay-konu" href="' + kac(adr) + '" target="_blank" rel="opener" title="Bu konuyu çalış">' + S.kitap + kac(k.ad) + '</a>'
            : '<span class="ay-konu">' + kac(k.ad) + '</span>';
        }).join('') + '</div>';
      return sec ? '<button type="button" class="ay-lig" data-sec="' + l + '" style="--lig:' + g.renk + '">' + ic + '</button>'
        : '<div class="ay-lig" style="--lig:' + g.renk + '">' + ic + '</div>';
    }).join('') + '</div>';
  }

  /* --------------------------------------------------- yazıcı (daktilo) */
  var _yz = null;
  function yaz(el, metin) {
    clearInterval(_yz);
    var azHareket = false;
    try { azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
    if (azHareket) { el.textContent = metin; return; }
    var i = 0; el.innerHTML = '<span></span><i class="ay-imlec"></i>';
    var sp = el.firstChild;
    _yz = setInterval(function () { i += 2; sp.textContent = metin.slice(0, i); if (i >= metin.length) clearInterval(_yz); }, 28);
  }

  /* --------------------------------------------------- ana çizim */
  var _sayacZ = null;
  function ciz(zorla) {
    if (OYUN) return;                                   /* oyun ekranı kendini çizer */
    var as = asama();
    var imza = [as, A ? A.kod + A.bas + JSON.stringify(A.ligler) + (A.sonucZaman || '') : '', BEN.hazir, BEN.u ? BEN.u.uid : '', BEN.rol,
      KAT ? KAT.lig + (KAT.v.durum || '') : '', KAT_BAKILDI, as === 'kapandi' && A ? (simdi() >= sonucZamani() ? 1 : 0) : 0].join('|');
    if (imza === gorunen && !zorla) return;
    gorunen = imza;
    var ic = $('ayIcerik'), h = '';
    $('ayGorev').innerHTML = A && A.aktif ? 'Görev ' + kac(A.no || 1) + '<span class="ay-gorev-ad">' + kac(A.baslik || 'Kayıp Harflerin Peşinde') + '</span>' : '';
    if (as === 'yok') {
      h = '<div class="ay-kart ay-ortala"><h2>Yeni görev</h2><p class="ay-not">Bir sonraki ayın görevi henüz açıklanmadı. Kapı açılınca ana sayfada geri sayım başlar.</p></div>';
      if (A && A.sonuc) h += sampiyonlarHtml(A.sonuc);
      ic.innerHTML = h; yonetimCiz(); return;
    }
    if (as === 'acik' && bitirdim()) {
      h += '<div class="ay-kart ay-ortala" id="ayKatil">' + sonucBenHtml(KAT.v, KAT.lig) + '</div>';
      h += '<div class="ay-kart ay-ortala"><h2>Sonuçlara kalan süre</h2><div class="ay-sayac" id="aySayac"></div>' +
        '<div class="ay-tarih">Sıralama <b>' + kac(saatYaz(sonucZamani())) + '</b>\'te açıklanacak</div></div>';
      h += '<div class="ay-kart"><h2>Ligler ve konular</h2>' + ligKartlari(false) + '</div>';
    } else if (as === 'bekle' || as === 'acik') {
      h += '<div class="ay-kart"><h2>Görev dosyası</h2><div class="ay-yazici" id="ayBrifing"></div></div>';
      h += '<div class="ay-kart">' + (as === 'bekle'
        ? '<h2>Kapının açılmasına</h2><div class="ay-sayac" id="aySayac"></div><div class="ay-tarih"><b>' + kac(tarihYaz(A.bas)) + '</b></div>'
        : '<h2>Kapı açık</h2><div class="ay-sayac" id="aySayac"></div><div class="ay-tarih">Kapının kapanmasına kalan süre</div>') +
        sartlarHtml() + '</div>';
      h += '<div class="ay-kart" id="ayKatil">' + katilHtml(as) + '</div>';
      h += '<div class="ay-kart"><h2>Ligler ve çalışılacak konular</h2>' + ligKartlari(false) +
        '<p class="ay-not">Konuya dokun, sitede çalış. Sorular yalnız bu konulardan gelir.</p></div>';
    } else {
      var acildi = simdi() >= sonucZamani();
      if (KAT && KAT.v.durum !== 'bitti' && !acildi && ogrenciMi()) h += '<div class="ay-kart ay-ortala"><h2>Görevin yarım kaldı</h2>' +
        '<p class="ay-not">Kapı kapandı ama başladığın görevi bitirebilirsin.</p><p class="ay-ortala" style="margin:12px 0 0">' +
        '<button type="button" class="ay-tus nabiz" data-katil>Devam et</button></p></div>';
      else if (KAT) h += '<div class="ay-kart ay-ortala">' + sonucBenHtml(KAT.v, KAT.lig) + '</div>';
      if (!acildi) {
        h += '<div class="ay-kart ay-ortala"><h2>Sonuçlar</h2><div class="ay-sayac" id="aySayac"></div>' +
          '<div class="ay-tarih">Sonuçlar <b>' + kac(saatYaz(sonucZamani())) + '</b>\'te açıklanacak</div>' +
          (KAT ? '' : '<p class="ay-not">Bu ayın kapısı kapandı. Bir sonraki görevde görüşmek üzere!</p>') + '</div>';
      } else {
        h += '<div class="ay-kart"><h2>Ayın sıralaması</h2><div class="ay-sekmeler" id="aySekme"></div><div id="ayTablo"><p class="ay-not">Sıralama okunuyor…</p></div></div>';
      }
    }
    ic.innerHTML = h;
    var br = $('ayBrifing');
    if (br) yaz(br, brifing(as));
    var lg = ic.querySelector('[data-katil]');
    if (lg) lg.addEventListener('click', katilTikla);
    [].forEach.call(ic.querySelectorAll('[data-giris]'), function (b) { b.addEventListener('click', girisAc); });
    [].forEach.call(ic.querySelectorAll('[data-kopya]'), function (b) { b.addEventListener('click', kopyala); });
    [].forEach.call(ic.querySelectorAll('[data-belge]'), function (b) { b.addEventListener('click', belgeIndir); });
    [].forEach.call(ic.querySelectorAll('.ay-lig[data-sec]'), function (b) { b.addEventListener('click', function () { katil(b.getAttribute('data-sec')); }); });
    if (as === 'kapandi' && simdi() >= sonucZamani()) siralamaCiz(KAT ? KAT.lig : acikLigler()[0]);
    sayacCiz();
    yonetimCiz();
  }
  function brifing(as) {
    var n = A.soru || 15, s = A.sure || 20, L = acikLigler().map(function (l) { return LIG[l].ad; });
    return as === 'acik'
      ? 'Zaman Kapısı açıldı, kâşif! ' + L.join(', ') + ' seni bekliyor. ' + n + ' soru, her biri için ' + s + ' saniye. Ligini seç, «Katıl»a bas ve görevi tamamla.'
      : 'Kayıp Arapça kelimeler Zaman Kapısı\'nın ardında. Kapı ' + tarihYaz(A.bas) + '\'te açılacak. Aşağıdaki konuları çalış; ' + n +
        ' soruda hem doğru hem hızlı olan kâşifler ayın sıralamasına girecek.';
  }
  function katilHtml(as) {
    if (!BEN.hazir) return '<p class="ay-not ay-ortala">Hesabına bakılıyor…</p>';
    if (!BEN.u) {
      return '<h2>Katılım</h2><div class="ay-bilgi">Yarışmaya katılmak için <b>öğrenci hesabınla</b> giriş yap.</div>' +
        '<p class="ay-ortala" style="margin:14px 0 0"><button type="button" class="ay-tus mavi" data-giris>Öğrenci girişi yap</button></p>';
    }
    if (ogretmenMi()) {
      return '<h2>Katılım</h2><div class="ay-uyari">Öğretmen ve yönetici hesapları yarışmaya katılamaz. Öğrencilerin kendi öğrenci hesaplarıyla katılır.</div>' +
        '<p class="ay-ortala" style="margin:14px 0 0"><button type="button" class="ay-tus ikincil" data-kopya>Bağlantıyı kopyala, öğrencilerime göndereyim</button></p>';
    }
    if (!ogrenciMi()) {
      return '<h2>Katılım</h2><div class="ay-uyari">Bu hesap öğrenci hesabı değil. Yarışmaya yalnız öğrenci hesapları katılabilir.</div>';
    }
    if (KAT_BAKILDI !== A.kod) return '<p class="ay-not ay-ortala">Katılımın denetleniyor…</p>';
    if (KAT && KAT.v.durum === 'bitti') return sonucBenHtml(KAT.v, KAT.lig);
    if (as === 'bekle') {
      return '<h2>Katılım</h2><div class="ay-bilgi">Hazırsın, <b>' + kac(kisaAd(BEN.ad)) + '</b>! Kapı açılınca burada «Katıl» düğmesi yanacak. Sayfa açık kalırsa kendiliğinden açılır.</div>' +
        '<p class="ay-ortala" style="margin:14px 0 0"><button type="button" class="ay-tus" disabled>Katıl</button></p>';
    }
    if (KAT) return '<h2>Katılım</h2><div class="ay-bilgi">Görevin yarım kaldı. Kaldığın sorudan devam et.</div>' +
      '<p class="ay-ortala" style="margin:14px 0 0"><button type="button" class="ay-tus nabiz" data-katil>Devam et</button></p>';
    var L = acikLigler();
    if (L.length > 1) return '<h2>Ligini seç ve katıl</h2>' + ligKartlari(true) + '<p class="ay-not">Seviyene uygun ligi seç. Her öğrenci ayda yalnız bir ligde yarışır.</p>';
    return '<h2>Katılım</h2><p class="ay-ortala" style="margin:4px 0 0"><button type="button" class="ay-tus nabiz" data-katil>Katıl</button></p>';
  }
  function sonucBenHtml(v, lig) {
    var bekle = simdi() < sonucZamani();
    return '<h2>Görev tamamlandı · ' + kac(LIG[lig] ? LIG[lig].ad : '') + '</h2>' +
      '<div class="ay-sonuc-sayi">' + (v.puan || 0) + '</div>' +
      '<div class="ay-sonuc-alt"><span><b>' + (v.dogru || 0) + '</b> / ' + ((v.cevap && v.cevap.length) || A.soru || 15) + ' doğru</span><span><b>' + ((v.sure || 0) / 1000).toFixed(1) + '</b> sn</span></div>' +
      (bekle ? '<p class="ay-not">Sıralama ' + kac(saatYaz(sonucZamani())) + '\'te açıklanacak.</p>' : '') +
      '<p class="ay-ortala" style="margin:12px 0 0"><button type="button" class="ay-tus ikincil" data-belge>Görev belgemi indir</button></p>';
  }
  function sampiyonlarHtml(so) {
    var L = LIG_SIRA.filter(function (l) { return so[l] && so[l].length; });
    if (!L.length) return '';
    return '<div class="ay-kart"><h2>Geçen ayın şampiyonları</h2>' + L.map(function (l) {
      return '<p style="margin:8px 0 4px;color:' + LIG[l].renk + ';font-family:var(--ay-baslik);font-size:.8rem;letter-spacing:.14em">' + kac(LIG[l].ad.toLocaleUpperCase('tr')) + '</p>' +
        '<table class="ay-tablo">' + so[l].map(function (r, i) { return '<tr class="' + (i === 0 ? 'ilk' : '') + '"><td>' + (i + 1) + '</td><td>' + kac(r.ad) + '</td><td>' + (r.puan || 0) + '</td></tr>'; }).join('') + '</table>';
    }).join('') + '</div>';
  }

  /* --------------------------------------------------- sayaç */
  var _sonDurum = '';
  function durumAnahtari() { var as = asama(); return as + (as === 'kapandi' && A ? (simdi() >= sonucZamani() ? '+' : '-') : ''); }
  function sayacCiz() {
    clearInterval(_sayacZ);
    var d0 = _sonDurum = durumAnahtari();
    var el = $('aySayac');
    var tick = function () {
      if (OYUN) { clearInterval(_sayacZ); return; }
      if (durumAnahtari() !== _sonDurum) { ciz(true); return; }
      if (!el || !A) return;
      var as = asama();
      var hedef = as === 'bekle' ? A.bas : (as === 'acik' && !bitirdim()) ? A.bas + (A.pencere || 15) * 60000 : sonucZamani();
      var k = Math.max(0, hedef - simdi());
      var g = Math.floor(k / 86400000), sa = Math.floor(k / 3600000) % 24, dk = Math.floor(k / 60000) % 60, sn = Math.floor(k / 1000) % 60;
      var hane = function (n, ad) { return '<div class="ay-hane"><b>' + iki(n) + '</b><small>' + ad + '</small></div>'; };
      el.innerHTML = (g > 0 ? hane(g, 'Gün') : '') + hane(sa, 'Saat') + hane(dk, 'Dakika') + hane(sn, 'Saniye');
      if (as === 'bekle' && k < 6000 && k > 0) SESLER.tik();
    };
    tick();
    if (d0 !== 'kapandi+' && d0 !== 'yok') _sayacZ = setInterval(tick, 1000);
  }

  /* --------------------------------------------------- giriş, kopya */
  function girisAc() {
    if (window.KidefGirisPenceresi && KidefGirisPenceresi.ac) { KidefGirisPenceresi.ac(); return; }
    if (typeof window.showLoginModal === 'function') { window.showLoginModal(); return; }
    location.href = 'index.html';
  }
  function kopyala(e) {
    var b = e.currentTarget, adr = location.origin + location.pathname;
    var bitti = function () { b.textContent = 'Kopyalandı ✓'; setTimeout(function () { b.textContent = 'Bağlantıyı kopyala, öğrencilerime göndereyim'; }, 2200); };
    try { navigator.clipboard.writeText(adr).then(bitti, function () { prompt('Bağlantı:', adr); }); } catch (x) { prompt('Bağlantı:', adr); }
  }

  /* --------------------------------------------------- katılım */
  function katilimBak() {
    if (!A || !A.kod || !ogrenciMi()) return;
    var kod = A.kod, uid = BEN.u.uid;
    if (KAT_BAKILDI === kod) return;
    var L = acikLigler();
    Promise.all(L.map(function (l) { return katilimRef(l, uid).get().then(function (d) { return d.exists ? { lig: l, v: d.data() } : null; }, function () { return null; }); }))
      .then(function (R) {
        if (!A || A.kod !== kod) return;
        KAT = R.filter(Boolean)[0] || null;
        KAT_BAKILDI = kod;
        ciz(true);
      });
  }
  function katilTikla() {
    if (KAT) { katil(KAT.lig); return; }
    var L = acikLigler();
    if (L.length === 1) katil(L[0]);
  }
  function katil(lig) {
    if (!ogrenciMi() || asama() !== 'acik' && !(KAT && KAT.v.durum !== 'bitti')) return;
    var ref = katilimRef(lig, BEN.u.uid);
    var bas = function (v) {
      KAT = { lig: lig, v: v };
      oyunBaslat(lig, v, ref);
    };
    if (KAT && KAT.lig === lig) { bas(KAT.v); return; }
    var v = { ad: kisaAd(BEN.ad), lig: lig, durum: 'basladi', i: 0, puan: 0, dogru: 0, sure: 0, cevap: [], havuz: H.surum || '', katildi: simdi() };
    ref.set(Object.assign({ bas: FV.serverTimestamp() }, v)).then(function () { bas(v); }, function (e) {
      alert('Katılım kaydedilemedi. İnternet bağlantını denetleyip yeniden dene.\n' + (e && e.message ? e.message : ''));
    });
  }

  /* --------------------------------------------------- soru seti (ligde herkese aynı) */
  function tohum(s) {
    var h = 1779033703 ^ s.length;
    for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }
  function karistir(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function soruSeti(lig) {
    var r = tohum(A.kod + '|' + lig + '|' + (A.no || 1));
    var konular = (A.ligler[lig] || []).filter(function (id) { return KONU[id]; });
    var havuzlar = konular.map(function (id) { return karistir(KONU[id].sorular, r); });
    var N = A.soru || 15, sec = [], k = 0;
    while (sec.length < N && havuzlar.some(function (x) { return x.length; })) {
      var hv = havuzlar[k % havuzlar.length]; k++;
      if (hv.length) sec.push(hv.shift());
    }
    return karistir(sec, r).map(function (q) {
      var sira = q.c.map(function (x, i) { return i; });
      if (q.b !== 'dogruyanlis') sira = karistir(sira, r);
      return { i: q.i, b: q.b, s: q.s, a: q.a, as: q.as, c: sira.map(function (j) { return q.c[j]; }), d: sira.indexOf(q.d) };
    });
  }
  function soruMetni(q) {
    var m = String(q.s || '');
    if (q.a) {
      var t = '«' + q.a + '»';
      if (m.indexOf(t) >= 0) m = m.replace(t, '').replace(/\s{2,}/g, ' ').replace(/\s+([؟?،.])/g, '$1').trim();
    }
    return kac(m).replace(/«([^»]*)»/g, function (tum, ic) {
      return /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(ic) ? '«<bdi>' + ic + '</bdi>»' : '«<bdi lang="ar" style="font-family:var(--ay-ar);font-size:1.25em">' + ic + '</bdi>»';
    });
  }

  /* --------------------------------------------------- oyun */
  function oyunBaslat(lig, v, ref) {
    var sorular = soruSeti(lig);
    if (!sorular.length) { alert('Bu ligde soru bulunamadı.'); return; }
    OYUN = { lig: lig, ref: ref, sorular: sorular, i: Math.min(v.i || 0, sorular.length), puan: v.puan || 0, dogru: v.dogru || 0,
      sure: v.sure || 0, cevap: (v.cevap || []).slice(), kilit: false, z: null, t0: 0 };
    clearInterval(_sayacZ);
    $('ayYonetim').innerHTML = ''; $('ayYonetim').removeAttribute('data-kuruldu');
    if (OYUN.i >= sorular.length) { bitir(); return; }
    var p = document.createElement('div');
    p.className = 'ay-perde';
    document.body.appendChild(p);
    var n = OYUN.i ? 1 : 3;
    var adim = function () {
      if (n > 0) { p.innerHTML = '<div><b>' + n + '</b><small>' + (OYUN.i ? 'DEVAM' : 'GÖREV BAŞLIYOR') + '</small></div>'; SESLER.tik(); n--; setTimeout(adim, 800); return; }
      SESLER.basla(); p.remove(); soruGoster();
    };
    adim();
  }
  function soruGoster() {
    var O = OYUN, q = O.sorular[O.i], N = O.sorular.length, s = A.sure || 20;
    var harf = ['A', 'B', 'C', 'D', 'E', 'F'];
    $('ayGorev').innerHTML = 'Görev ' + kac(A.no || 1) + '<span class="ay-gorev-ad">' + kac(LIG[O.lig].ad) + '</span>';
    $('ayIcerik').innerHTML = '<div class="ay-kart" style="--lig:' + LIG[O.lig].renk + '">' +
      '<div class="ay-soru-ust"><span>SORU ' + (O.i + 1) + ' / ' + N + '</span><div class="ay-ilerleme"><i style="width:' + Math.round(O.i / N * 100) + '%"></i></div>' +
      '<div class="ay-halka" id="ayHalka"><svg viewBox="0 0 58 58"><circle class="z" cx="29" cy="29" r="24"/><circle class="h" cx="29" cy="29" r="24" stroke-dasharray="150.8" stroke-dashoffset="0"/></svg><span>' + s + '</span></div></div>' +
      '<div class="ay-soru-kutu"><div class="ay-soru-metin">' + soruMetni(q) + '</div>' +
      (q.a ? '<div class="ay-ar-buyuk" lang="ar">' + kac(q.a) + '</div>' : '') + '</div>' +
      '<div class="ay-secenekler">' + q.c.map(function (c, i) {
        var ar = q.as || arMi(c);
        return '<button type="button" class="ay-secenek" data-i="' + i + '"><b>' + harf[i] + '</b><span class="' + (ar ? 'ar' : 'tr') + '"' + (ar ? ' lang="ar"' : '') + '>' + kac(c) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="ay-puan-cubuk"><span>Doğru: <b>' + O.dogru + '</b></span><span>Puan: <b id="ayPuan">' + O.puan + '</b></span></div></div>';
    [].forEach.call(document.querySelectorAll('.ay-secenek'), function (b) { b.addEventListener('click', function () { cevapla(+b.getAttribute('data-i')); }); });
    O.kilit = false; O.t0 = Date.now();
    var halka = $('ayHalka'), h = halka.querySelector('.h'), yazi = halka.querySelector('span');
    clearInterval(O.z);
    O.z = setInterval(function () {
      var gecen = (Date.now() - O.t0) / 1000, kalan = Math.max(0, s - gecen);
      h.setAttribute('stroke-dashoffset', String(150.8 * (1 - kalan / s)));
      yazi.textContent = Math.ceil(kalan);
      halka.classList.toggle('az', kalan <= 5);
      if (kalan <= 0) cevapla(-1);
    }, 100);
  }
  function cevapla(sec) {
    var O = OYUN;
    if (!O || O.kilit) return;
    O.kilit = true; clearInterval(O.z);
    var q = O.sorular[O.i], s = A.sure || 20, N = O.sorular.length;
    var gecen = Math.min(s * 1000, Date.now() - O.t0), dogru = sec === q.d;
    var kazanc = dogru ? Math.round(1000 / N * (0.85 + 0.15 * Math.max(0, s * 1000 - gecen) / (s * 1000))) : 0;
    O.puan += kazanc; O.sure += gecen; O.cevap.push(sec); if (dogru) O.dogru++;
    var B = document.querySelectorAll('.ay-secenek');
    [].forEach.call(B, function (b, i) { b.disabled = true; if (i === q.d) b.classList.add('dogru'); else if (i === sec) b.classList.add('yanlis'); });
    if (dogru) {
      SESLER.dogru();
      var art = document.createElement('span'); art.className = 'ay-artı'; art.textContent = '+' + kazanc; B[sec].appendChild(art);
    } else SESLER.yanlis();
    var p = $('ayPuan'); if (p) p.textContent = O.puan;
    O.i++;
    O.ref.update({ i: O.i, puan: O.puan, dogru: O.dogru, sure: O.sure, cevap: O.cevap.slice() }).catch(function () { });
    setTimeout(function () { if (O.i >= N) bitir(); else soruGoster(); }, dogru ? 1100 : 1700);
  }
  function bitir() {
    var O = OYUN;
    var v = { ad: kisaAd(BEN.ad), lig: O.lig, durum: 'bitti', i: O.i, puan: O.puan, dogru: O.dogru, sure: O.sure, cevap: O.cevap.slice() };
    O.ref.update({ durum: 'bitti', i: O.i, puan: O.puan, dogru: O.dogru, sure: O.sure, cevap: O.cevap.slice(), bitis: FV.serverTimestamp() }).catch(function () { });
    KAT = { lig: O.lig, v: v };
    OYUN = null; gorunen = '';
    ciz(true);
    window.scrollTo(0, 0);
  }

  /* --------------------------------------------------- sıralama */
  function siraAl(lig, hepsi) {
    var q = db.collection('bilgiYarismasi').doc('aylik-' + A.kod).collection(lig).orderBy('puan', 'desc');
    if (!hepsi) q = q.limit(50);
    return q.get().then(function (s) {
      var L = [];
      s.forEach(function (d) { var v = d.data() || {}; L.push({ uid: d.id, ad: v.ad || 'Kâşif', puan: +v.puan || 0, sure: +v.sure || 0, dogru: +v.dogru || 0 }); });
      L.sort(function (a, b) { return (b.puan - a.puan) || (a.sure - b.sure); });
      return L;
    });
  }
  function siralamaCiz(lig) {
    var sek = $('aySekme'), tb = $('ayTablo');
    if (!sek || !tb) return;
    var L = acikLigler();
    sek.innerHTML = L.map(function (l) { return '<button type="button" class="ay-sekme" style="--lig:' + LIG[l].renk + '" data-lig="' + l + '" aria-pressed="' + (l === lig) + '">' + kac(LIG[l].ad) + '</button>'; }).join('');
    [].forEach.call(sek.querySelectorAll('[data-lig]'), function (b) { b.addEventListener('click', function () { siralamaCiz(b.getAttribute('data-lig')); }); });
    if (!BEN.u) {                                       /* sıralamayı yalnız giriş yapan okur (bilgiYarismasi kuralı) */
      tb.innerHTML = '<p class="ay-not">Sıralamayı görmek için giriş yap.</p><p class="ay-ortala"><button type="button" class="ay-tus mavi" data-giris>Giriş yap</button></p>';
      tb.querySelector('[data-giris]').addEventListener('click', girisAc);
      return;
    }
    tb.innerHTML = '<p class="ay-not">Sıralama okunuyor…</p>';
    siraAl(lig).then(function (R) {
      if (!R.length) { tb.innerHTML = '<p class="ay-not">Bu ligde katılım yok.</p>'; return; }
      var ben = BEN.u ? BEN.u.uid : '', h = '', yer = -1;
      R.forEach(function (r, i) { if (r.uid === ben) yer = i; });
      R.slice(0, 10).forEach(function (r, i) { h += satir(r, i, r.uid === ben); });
      if (yer >= 10) h += satir(R[yer], yer, true);
      tb.innerHTML = '<table class="ay-tablo">' + h + '</table>' + (yer >= 0 ? '<p class="ay-not">Sıran: <b>' + (yer + 1) + '.</b></p>' : '');
      if (yer >= 0) OYUN_SIRA = yer + 1;
    }, function () { tb.innerHTML = '<p class="ay-not">Sıralama okunamadı. Sayfayı yenile.</p>'; });
    function satir(r, i, b) { return '<tr class="' + (i === 0 ? 'ilk ' : '') + (b ? 'ben' : '') + '"><td>' + (i + 1) + '</td><td>' + kac(r.ad) + '</td><td>' + r.puan + '</td></tr>'; }
  }
  var OYUN_SIRA = 0;

  /* --------------------------------------------------- görev belgesi (PNG) */
  function belgeIndir() {
    if (!KAT) return;
    var v = KAT.v, lig = LIG[KAT.lig] || LIG.temel;
    var cv = document.createElement('canvas'); cv.width = 1600; cv.height = 1000;
    var c = cv.getContext('2d');
    var ciz_ = function () {
      var g = c.createRadialGradient(800, 0, 50, 800, 400, 1100); g.addColorStop(0, '#1c2850'); g.addColorStop(1, '#0b0d17');
      c.fillStyle = g; c.fillRect(0, 0, 1600, 1000);
      for (var i = 0; i < 160; i++) { c.fillStyle = 'rgba(255,255,255,' + (0.2 + Math.random() * 0.6) + ')'; c.fillRect(Math.random() * 1600, Math.random() * 1000, 1.6, 1.6); }
      c.strokeStyle = '#2a3556'; c.lineWidth = 4; c.strokeRect(40, 40, 1520, 920);
      c.strokeStyle = lig.renk; c.lineWidth = 2; c.strokeRect(56, 56, 1488, 888);
      c.textAlign = 'center';
      c.fillStyle = '#5c6b94'; c.font = '600 28px Orbitron, Poppins, sans-serif'; c.fillText('KİDEF ARAPÇA · AYLIK TÜRKİYE YARIŞMASI', 800, 150);
      c.shadowColor = 'rgba(0,242,255,.7)'; c.shadowBlur = 30; c.fillStyle = '#00f2ff'; c.font = '800 76px Orbitron, Poppins, sans-serif'; c.fillText('GÖREV TAMAMLANDI', 800, 260); c.shadowBlur = 0;
      c.fillStyle = '#ff9f43'; c.font = '700 34px Poppins, sans-serif'; c.fillText('Görev ' + (A.no || 1) + ' · ' + (A.baslik || '') + ' · ' + lig.ad, 800, 330);
      c.fillStyle = '#e8ecff'; c.font = '800 96px Poppins, sans-serif'; c.fillText(kisaAd(BEN.ad), 800, 480);
      c.fillStyle = '#ff9f43'; c.shadowColor = 'rgba(255,159,67,.6)'; c.shadowBlur = 24; c.font = '800 120px Orbitron, Poppins, sans-serif'; c.fillText(String(v.puan || 0), 800, 650); c.shadowBlur = 0;
      c.fillStyle = '#93a0c4'; c.font = '600 34px Poppins, sans-serif';
      c.fillText((v.dogru || 0) + ' doğru · ' + ((v.sure || 0) / 1000).toFixed(1) + ' sn' + (OYUN_SIRA ? ' · ' + OYUN_SIRA + '. sıra' : ''), 800, 720);
      c.fillStyle = '#5c6b94'; c.font = '600 28px Poppins, sans-serif'; c.fillText(tarihYaz(A.bas) + ' · kidefarapca.com', 800, 880);
      var a = document.createElement('a');
      a.download = 'gorev-belgesi-' + A.kod + '.png'; a.href = cv.toDataURL('image/png');
      document.body.appendChild(a); a.click(); a.remove();
    };
    try { (document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 60px Orbitron'), document.fonts.load('800 60px Poppins')]) : Promise.resolve()).then(ciz_, ciz_); } catch (e) { ciz_(); }
  }

  /* --------------------------------------------------- yönetici */
  function yonetimCiz() {
    var y = $('ayYonetim');
    if (!y) return;
    if (!(BEN.u && BEN.rol === 'admin')) { y.innerHTML = ''; y.removeAttribute('data-kuruldu'); return; }
    if (!AYAR_OKUNDU || y.getAttribute('data-kuruldu') === '1') return;
    y.setAttribute('data-kuruldu', '1');
    var a = A || {}, no = a.no || 1, bas = a.bas || (function () { var d = new Date(); d.setDate(d.getDate() + 7); d.setHours(20, 0, 0, 0); return +d; })();
    var yerel = function (t) { var d = new Date(t); return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()) + 'T' + iki(d.getHours()) + ':' + iki(d.getMinutes()); };
    var ligSec = function (l) {
      var secili = (a.ligler && a.ligler[l]) || (a.kod ? [] : planDizi(l, no));
      return '<fieldset style="--lig:' + LIG[l].renk + '"><legend>' + kac(LIG[l].ad) + '</legend>' +
        H.konular.map(function (k) {
          return '<label class="ay-sec"><input type="checkbox" data-lig="' + l + '" value="' + kac(k.id) + '"' + (secili.indexOf(k.id) >= 0 ? ' checked' : '') + '> ' +
            kac(k.ad) + ' <small style="opacity:.6">(' + k.sorular.length + ')</small></label>';
        }).join('') + '</fieldset>';
    };
    y.innerHTML = '<div class="ay-kart ay-yonetim"><h2>Yönetici · görev ayarları</h2>' +
      '<div class="ay-izgara">' +
      '<div><label for="ayYNo">Görev no</label><input type="number" id="ayYNo" min="1" value="' + no + '"></div>' +
      '<div><label for="ayYBas">Başlama (tarih, saat)</label><input type="datetime-local" id="ayYBas" value="' + yerel(bas) + '"></div>' +
      '<div><label for="ayYPen">Kapı açık (dakika)</label><input type="number" id="ayYPen" min="3" max="180" value="' + (a.pencere || 15) + '"></div>' +
      '<div><label for="ayYSoru">Soru sayısı</label><input type="number" id="ayYSoru" min="5" max="40" value="' + (a.soru || 15) + '"></div>' +
      '<div><label for="ayYSure">Soru süresi (sn)</label><input type="number" id="ayYSure" min="8" max="90" value="' + (a.sure || 20) + '"></div>' +
      '</div>' +
      '<label for="ayYBaslik">Görev adı</label><input type="text" id="ayYBaslik" maxlength="60" value="' + kac(a.baslik || 'Kayıp Harflerin Peşinde') + '">' +
      '<p class="ay-not">Ligler: konusu seçili olan lig açılır. «Önerilen plan» görev no\'ya göre her ligin ilk konularını seçer (her ay bir konu eklenir).</p>' +
      LIG_SIRA.map(ligSec).join('') +
      '<div class="ay-tuslar"><button type="button" class="ay-tus ikincil" data-y="plan">Önerilen plan</button>' +
      '<button type="button" class="ay-tus" data-y="yayin">Kaydet ve yayınla</button>' +
      '<button type="button" class="ay-tus ikincil" data-y="sonuc">Sonuçları ana sayfada göster</button>' +
      '<button type="button" class="ay-tus ikincil" data-y="say">Katılımı say</button>' +
      '<button type="button" class="ay-tus ikincil" data-y="gizle">Ana sayfadan kaldır</button></div>' +
      '<div class="ay-durum" id="ayYDurum"></div></div>';
    y.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-y]') : null;
      if (!b) return;
      var is = b.getAttribute('data-y');
      if (is === 'plan') planUygula();
      else if (is === 'yayin') yayinla();
      else if (is === 'sonuc') sonuclariYayinla();
      else if (is === 'say') katilimSay();
      else if (is === 'gizle') AYAR.set({ aktif: false }, { merge: true }).then(function () { durumYaz('Ana sayfadan kaldırıldı.'); }, hataYaz);
    });
  }
  function planDizi(l, no) { return (PLAN[l] || []).filter(function (id) { return KONU[id]; }).slice(0, Math.max(1, no)); }
  function planUygula() {
    var no = Math.max(1, +$('ayYNo').value || 1);
    [].forEach.call(document.querySelectorAll('#ayYonetim input[data-lig]'), function (c) { c.checked = planDizi(c.getAttribute('data-lig'), no).indexOf(c.value) >= 0; });
    durumYaz('Önerilen plan seçildi (görev ' + no + '). Kaydetmeyi unutma.');
  }
  function durumYaz(m) { var d = $('ayYDurum'); if (d) d.textContent = m; }
  function hataYaz(e) { durumYaz('Olmadı: ' + (e && (e.message || e.code) || e)); }
  function yayinla() {
    var bas = Date.parse($('ayYBas').value);
    if (isNaN(bas)) { durumYaz('Başlama zamanını yaz.'); return; }
    var ligler = {};
    LIG_SIRA.forEach(function (l) {
      var s = [].map.call(document.querySelectorAll('#ayYonetim input[data-lig="' + l + '"]:checked'), function (c) { return c.value; });
      if (s.length) ligler[l] = s;
    });
    if (!Object.keys(ligler).length) { durumYaz('En az bir ligde konu seç.'); return; }
    var d = new Date(bas), kod = d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
    var yeni = {
      aktif: true, no: Math.max(1, +$('ayYNo').value || 1), kod: kod, baslik: String($('ayYBaslik').value || '').trim().slice(0, 60) || 'Kayıp Harflerin Peşinde',
      bas: bas, pencere: Math.max(3, +$('ayYPen').value || 15), soru: Math.max(5, Math.min(40, +$('ayYSoru').value || 15)),
      sure: Math.max(8, Math.min(90, +$('ayYSure').value || 20)), ligler: ligler, guncel: FV.serverTimestamp()
    };
    if (A && A.kod === kod && A.sonuc) { yeni.sonuc = A.sonuc; yeni.sonucZaman = A.sonucZaman || 0; }
    durumYaz('Kaydediliyor…');
    AYAR.set(yeni).then(function () {
      return db.collection('bilgiYarismasi').doc('aylik-' + kod).set({ tur: 'aylik', no: yeni.no, baslik: yeni.baslik, bas: bas, ligler: ligler, guncel: FV.serverTimestamp() }, { merge: true });
    }).then(function () { durumYaz('Yayınlandı: görev ' + yeni.no + ' · ' + tarihYaz(bas) + '. Ana sayfada geri sayım başladı.'); }, hataYaz);
  }
  function sonuclariYayinla() {
    if (!A || !A.kod) { durumYaz('Önce görevi yayınla.'); return; }
    durumYaz('Sonuçlar hesaplanıyor…');
    var L = acikLigler(), so = {};
    Promise.all(L.map(function (l) { return siraAl(l, true).then(function (R) { so[l] = R.slice(0, 3).map(function (r) { return { ad: r.ad, puan: r.puan, dogru: r.dogru }; }); }); }))
      .then(function () { return AYAR.update({ sonuc: so, sonucZaman: Date.now() }); })
      .then(function () { durumYaz('Ana sayfada ayın şampiyonları gösteriliyor.'); }, hataYaz);
  }
  function katilimSay() {
    if (!A || !A.kod) { durumYaz('Önce görevi yayınla.'); return; }
    Promise.all(acikLigler().map(function (l) { return siraAl(l, true).then(function (R) { return LIG[l].ad + ': ' + R.length; }); }))
      .then(function (s) { durumYaz('Katılım — ' + s.join(' · ')); }, hataYaz);
  }

  /* --------------------------------------------------- başlangıç */
  function ayarOku() {
    return AYAR.get().then(function (d) { A = d.exists ? d.data() : null; if (A) A.bas = ms(A.bas); AYAR_OKUNDU = true; }, function () { A = null; AYAR_OKUNDU = true; });
  }
  function sesTusu() {
    var b = $('aySes');
    if (!b) return;
    var yaz_ = function () { b.setAttribute('aria-pressed', SES ? 'true' : 'false'); b.textContent = SES ? 'Ses açık' : 'Ses kapalı'; };
    yaz_();
    b.addEventListener('click', function () { SES = !SES; try { localStorage.setItem('aylikSes', SES ? '1' : '0'); } catch (e) { } yaz_(); });
  }
  function basla() {
    sesTusu();
    Promise.all([ayarOku(), saatAl()]).then(function () { ciz(true); katilimBak(); });
    auth.onAuthStateChanged(function (u) {
      if (!u || u.isAnonymous) { BEN = { u: null, rol: '', ad: '', hazir: true }; KAT = null; KAT_BAKILDI = ''; ciz(true); return; }
      db.collection('kullanicilar').doc(u.uid).get().then(function (d) {
        var v = d.exists ? (d.data() || {}) : {};
        BEN = { u: u, rol: String(v.role || ''), ad: String(v.name || v.ad || v.adSoyad || ''), hazir: true };
      }, function () { BEN = { u: u, rol: '', ad: '', hazir: true }; }).then(function () {
        try { var lm = document.getElementById('login-modal'); if (lm && BEN.u) { if (window.KidefGirisPenceresi) KidefGirisPenceresi.kapat(); } } catch (e) { }
        KAT = null; KAT_BAKILDI = ''; gorunen = '';
        ciz(true); katilimBak();
      });
    });
    /* yayın sırasında ayar değişirse (ör. yönetici sonucu açıkladı) sekme dönüşünde yeniden okunur */
    document.addEventListener('visibilitychange', function () { if (!document.hidden && !OYUN) ayarOku().then(function () { ciz(true); }); });
  }
  window.AylikYarisma = {
    durum: function () { return { asama: asama(), ben: { rol: BEN.rol, ad: BEN.ad, uid: BEN.u ? BEN.u.uid : null }, kat: KAT, oyun: OYUN ? { i: OYUN.i, puan: OYUN.puan, lig: OYUN.lig, n: OYUN.sorular.length } : null, ayar: A }; },
    soruSeti: function (lig) { return soruSeti(lig); },
    _saat: function (t) { fark = t - Date.now(); gorunen = ''; ciz(true); },     /* deneme: sunucu saatini ayarla */
    _yenile: function () { return ayarOku().then(function () { gorunen = ''; ciz(true); katilimBak(); }); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
