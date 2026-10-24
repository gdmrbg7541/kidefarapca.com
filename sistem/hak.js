/* =====================================================================
   KIDEF · DENEME HAKLARI                              (sistem/hak.js)
   ---------------------------------------------------------------------
   Öğretmen (24.10.2026): destekçi ayrıcalığı + deneme hakkı — "kalıplar
   tablosu ve muhadese kartları, kitap flipbook indirme ve kalem kullanma,
   kelime çarkı, bunlarda hak verilsin öğretmenlere denemeleri için giriş
   yapılan öğretmenlerin tarayıcı hafızasında tutulabilir, ve bu örneğin
   kartta soluk bi 5 yazar basınca 5 dörde 4 dönüşür güzelce sonra açılır
   dosya" (ayrıca tahtaya yansıt / kumanda, defter PDF'i ve geçmiş).

   KİM SINIRLI
     Giriş yapmış ÖĞRETMEN, bu dönem destek vermemişse. Sınırsız: yönetici,
     bu dönem ödeme yapan (kısmi dahil), referansla ödemiş sayılan, ilk 30
     günündeki yeni öğretmen, dönem payı henüz belli değilken herkes.
     Öğrenci ve giriş yapmamış ziyaretçi bu düzenin dışında (hiçbir şey
     değişmez).
   DURUM NEREDEN
     hesap/destek.js ana sayfada öğretmenin durumunu hesaplayıp tarayıcıya
     yazar: localStorage kidefDestekDurum = { uid, rol, sinirsiz, sebep,
     bit (sınırsızlığın bittiği an, ms), z, ref }. Bu dosya onu okur; kayıt
     yoksa ya da başka hesaba aitse SINIRLAMAZ (destekçiyi yanlışlıkla
     kısmasın). Oturum kapalıysa (uid '') da sınırlamaz.
   HAKLAR
     localStorage kidefHak = { <uid>: { h: '2026-W43', k: { <özellik>: kalan } } }
     Her özellikte haftada 5 hak; pazartesi yeniden 5.
   ÖZELLİKLER (VARSAYILAN bağlar, hak.js'i yükleyen her sayfada kendiliğinden)
     kalip       ana sayfadaki Kalıplar tablosu kartı (masaüstü + mobil sayfa)
     muhadese    Muhâdese kartı
     cark        Kelime Çarkı kartı
     tahta       «Bu cihazı kumanda olarak kullan» (sistem/tahtagir.js) ve
                 telefonda karekodla «Evet, kumanda olsun» (hesap/kumanda.js)
     defter      defterde «PDF indir» ve «Geçmiş» (paneli açarken)
     kitapIndir  flipbookta İndir panelindeki paketler (flaşa / bilgisayara)
     kitapKalem  flipbookta Kalem (açarken; P tuşu da)
   ORTAK HEDEF İLE AÇILAN İÇERİK
     Yöneticinin seçtiği bağlantılar (mufredat/_destek.hedefIcerik, destek.js
     önbelleğe yazar: kidefDestekHedef = { y: yüzde, L: [{id, y, ad, a, n}] })
     ortak hedef o yüzdeye varana kadar kilitli: kartın köşesinde 🎯 %50,
     basınca açıklama. Yönetici için kilit yok.
   KULLANIM
     KidefHak.kullan('kalip', el)      → Promise<bool>: sınırsızsa hemen true; hak
                                        varsa 5 → 4 canlanır, sonra true; yoksa
                                        «Destekle, sınırsız olsun» penceresi, false
     KidefHak.bagla({ secici: özellik | {oz, kosul}, … })  tıklamaları yakalar
     KidefHak.rozetBagla({ secici: özellik })  yalnız rozet (tıklama yakalanmaz)
     KidefHak.durumYaz(o) · KidefHak.uid(u) ('' = oturum kapalı) · hedefYaz(o)
   Tahtadaki yinelenen tıklar (isTrusted: false) hak harcamaz, pencere açmaz.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefHak) return;

  var HAFTALIK = 5;
  var K_DURUM = 'kidefDestekDurum', K_HAK = 'kidefHak', K_HEDEF = 'kidefDestekHedef';
  var AD = {
    tahta: 'Tahtaya yansıt', defter: 'Defter PDF\'i ve geçmiş', kalip: 'Kalıplar tablosu', muhadese: 'Muhâdese',
    kitapIndir: 'Flipbook indirme', kitapKalem: 'Flipbook kalemi', cark: 'Kelime çarkı'
  };

  function al(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ISO hafta: '2026-W43' (pazartesi başlar) */
  function hafta(t) {
    var d = t ? new Date(t) : new Date();
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var g = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - g);
    var y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var w = Math.ceil(((d - y0) / 86400000 + 1) / 7);
    return d.getUTCFullYear() + '-W' + (w < 10 ? '0' : '') + w;
  }

  /* şu anki hesap: sayfanın bildirdiği (uid; '' = oturum kapalı) ya da
     Firebase oturumu; ikisi de yoksa null (henüz bilinmiyor) */
  var _uid;
  function oturumUid() {
    if (_uid !== undefined) return _uid;
    try {
      if (window.firebase && firebase.auth && firebase.apps && firebase.apps.length) {
        var u = firebase.auth().currentUser;
        if (u && !u.isAnonymous) return u.uid;
      }
    } catch (e) { }
    return null;
  }
  function durum() {
    var d = al(K_DURUM, null), uid = oturumUid();
    if (uid === '') return { sinirli: false, sebep: 'oturum-yok' };
    if (!d || !d.uid) return { sinirli: false, sebep: 'bilinmiyor' };
    if (uid && d.uid !== uid) return { sinirli: false, sebep: 'baska-hesap' };
    if (d.rol !== 'teacher') return { sinirli: false, sebep: d.rol || 'rol-yok', uid: d.uid, rol: d.rol };
    if (d.sinirsiz && (!d.bit || d.bit > Date.now())) return { sinirli: false, sebep: d.sebep || 'destekci', uid: d.uid, rol: d.rol };
    return { sinirli: true, sebep: d.sebep || 'destek-yok', uid: d.uid, rol: d.rol };
  }
  function yoneticiMi() { return durum().rol === 'admin'; }
  function hakKaydi(uid) {
    var H = al(K_HAK, {}) || {}, h = hafta(), r = H[uid];
    if (!r || r.h !== h) { r = H[uid] = { h: h, k: {} }; yaz(K_HAK, H); }
    return { H: H, r: r };
  }
  function kalan(oz) {
    var d = durum();
    if (!d.sinirli) return Infinity;
    var r = hakKaydi(d.uid).r;
    return (oz in r.k) ? Math.max(0, r.k[oz] | 0) : HAFTALIK;
  }
  function harca(oz) {
    var d = durum();
    if (!d.sinirli) return Infinity;
    var x = hakKaydi(d.uid), k = (oz in x.r.k) ? x.r.k[oz] : HAFTALIK;
    x.r.k[oz] = Math.max(0, k - 1);
    yaz(K_HAK, x.H);
    return x.r.k[oz];
  }
  /* bu hafta harcanan haklar (hatırlatma için) */
  function haftaKullanim() {
    var d = durum();
    if (!d.sinirli) return 0;
    var r = hakKaydi(d.uid).r, n = 0;
    Object.keys(r.k).forEach(function (oz) { n += Math.max(0, HAFTALIK - (r.k[oz] | 0)); });
    return n;
  }

  /* ---------------- görünüş ---------------- */
  var KILIT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.4" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var HEDEF = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>';
  var KALP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5C6 16.4 3.5 12.6 5.4 9.6c1.6-2.5 4.9-2.3 6.6.3 1.7-2.6 5-2.8 6.6-.3 1.9 3-.6 6.8-6.6 10.9Z" fill="currentColor"/></svg>';
  function stil() {
    if (document.getElementById('khStil')) return;
    var s = document.createElement('style');
    s.id = 'khStil';
    s.textContent =
      '.kh-rozet{position:absolute;top:8px;right:10px;z-index:3;min-width:28px;height:28px;padding:0 6px;border-radius:14px;' +
        'display:inline-flex!important;align-items:center;justify-content:center;gap:3px;overflow:hidden;pointer-events:none;box-sizing:border-box;' +
        'background:rgba(255,255,255,.82);border:1px solid rgba(15,42,67,.14);color:rgba(15,42,67,.42);' +
        'font:900 15px/1 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 2px 6px rgba(15,42,67,.08);' +
        'transition:background .3s,color .3s,box-shadow .3s}' +
      '.kh-rozet b{display:block!important;font-weight:900}' +
      '.kh-rozet.kh-kucuk{top:1px;right:1px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;font-size:10.5px;box-shadow:none}' +
      '.kh-rozet.kh-kucuk svg{width:10px;height:10px}' +
      '.kh-rozet.kh-cal{background:#FFF7E6;border-color:#F5C26B;color:#B45309;box-shadow:0 0 0 6px rgba(245,158,11,.18)}' +
      '.kh-rozet.kh-cal b.eski{position:absolute;animation:khEski .5s cubic-bezier(.5,0,.75,0) forwards}' +
      '.kh-rozet.kh-cal b.yeni{animation:khYeni .55s .18s cubic-bezier(.2,1.4,.4,1) both}' +
      '.kh-rozet.kh-bitti{background:#FDECEA;border-color:#F5B7B1;color:#C0392B}' +
      '.kh-rozet.kh-hedef{background:#FFF3DC;border-color:#F2C46D;color:#B7791F;font-size:12.5px}' +
      '.kh-rozet svg{width:15px;height:15px;flex:none}' +
      '@keyframes khEski{to{transform:translateY(-120%) scale(.6);opacity:0}}' +
      '@keyframes khYeni{from{transform:translateY(120%) scale(.6);opacity:0}to{transform:none;opacity:1}}' +
      '.kh-perde{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:16px;' +
        'animation:khGel .2s ease-out}' +
      '.kh-kutu{width:min(440px,100%);background:#fff;border-radius:24px;padding:24px 22px 20px;text-align:center;box-shadow:0 30px 70px rgba(15,23,42,.3);box-sizing:border-box;' +
        'font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#2C3E50;animation:khKutu .3s cubic-bezier(.2,1.3,.4,1)}' +
      '.kh-kutu .kh-ik{width:64px;height:64px;margin:0 auto 10px;border-radius:20px;background:#FFF7E6;color:#E67E22;display:flex;align-items:center;justify-content:center}' +
      '.kh-kutu .kh-ik svg{width:34px;height:34px}' +
      '.kh-kutu h3{margin:0 0 8px;font-size:1.2rem;color:#0F2A43}' +
      '.kh-kutu p{margin:0 0 16px;line-height:1.5;font-size:.95rem;color:#5B6B7C}' +
      '.kh-kutu .kh-cubuk{height:12px;border-radius:6px;background:#F6EBD6;margin:-4px 0 16px;overflow:hidden;position:relative}' +
      '.kh-kutu .kh-cubuk i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,#F6C25B,#E08E1B)}' +
      '.kh-kutu .kh-cubuk u{position:absolute;top:-2px;bottom:-2px;width:3px;border-radius:2px;background:#B7791F}' +
      '.kh-kutu .kh-tus{display:flex;flex-direction:column;gap:8px}' +
      '.kh-kutu a,.kh-kutu button{display:flex;align-items:center;justify-content:center;gap:8px;height:48px;border-radius:14px;border:0;cursor:pointer;' +
        'font:800 1rem system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-decoration:none}' +
      '.kh-kutu .kh-destek{background:#F39C12;color:#fff;box-shadow:0 8px 18px rgba(243,156,18,.32)}' +
      '.kh-kutu .kh-destek svg{width:18px;height:18px}' +
      '.kh-kutu .kh-kapat{background:#F1F5F9;color:#2C3E50}' +
      '.kh-kutu small{display:block;margin-top:10px;color:#94A3B8;font-size:.8rem;line-height:1.45}' +
      '.kh-bildir{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:2147483001;max-width:calc(100% - 32px);box-sizing:border-box;' +
        'background:#0F2A43;color:#fff;border-radius:14px;padding:10px 16px;font:700 .9rem/1.35 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;' +
        'box-shadow:0 12px 30px rgba(15,23,42,.3);animation:khGel .2s ease-out;pointer-events:none}' +
      '@keyframes khGel{from{opacity:0}}@keyframes khKutu{from{transform:scale(.9);opacity:0}}' +
      '@media (prefers-reduced-motion:reduce){.kh-rozet.kh-cal b.eski,.kh-rozet.kh-cal b.yeni,.kh-perde,.kh-kutu,.kh-bildir{animation:none}}';
    (document.head || document.documentElement).appendChild(s);
  }
  function rozetCiz(r, k) {
    if (!r || r.classList.contains('kh-cal')) return;              /* canlanırken dokunma */
    var ic = k > 0 ? '<b>' + k + '</b>' : KILIT, t = k > 0 ? 'Bu hafta ' + k + ' deneme hakkın var (destekçilere sınırsız)' : 'Bu haftaki deneme hakların bitti — destekçilere sınırsız';
    if (r.getAttribute('data-k') === String(k)) return;             /* değişmediyse DOM'a dokunma (gözlemci döngüsü olmasın) */
    r.setAttribute('data-k', String(k));
    r.classList.remove('kh-hedef');
    r.classList.toggle('kh-bitti', k <= 0);
    r.innerHTML = ic; r.title = t;
  }
  function rozetYeri(el, oz) {
    var r = el.querySelector(':scope > .kh-rozet');
    if (!r) {
      stil();
      r = document.createElement('span');
      r.className = 'kh-rozet';
      if (oz) r.setAttribute('data-kh', oz);
      try { if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; } catch (e) { }
      var b = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (b && b.height && b.height < 64) r.classList.add('kh-kucuk');        /* araç çubuğu düğmesi */
      el.appendChild(r);
    }
    return r;
  }
  function rozet(el, oz) {
    if (!el || !oz) return null;
    var r = el.querySelector(':scope > .kh-rozet');
    if (r && r.getAttribute('data-kh') === 'hedef') return r;      /* ortak hedefle kilitli: önce o */
    var k = kalan(oz);
    if (k === Infinity) { if (r && !r.classList.contains('kh-cal') && r.getAttribute('data-kh') === oz) r.remove(); return null; }
    r = rozetYeri(el, oz);
    rozetCiz(r, k);
    return r;
  }
  function canlan(r, eski, yeni) {
    return new Promise(function (bitir) {
      if (!r) { bitir(); return; }
      r.classList.add('kh-cal');
      r.innerHTML = '<b class="eski">' + eski + '</b><b class="yeni">' + (yeni > 0 ? yeni : '') + '</b>';
      if (yeni <= 0) r.querySelector('.yeni').innerHTML = KILIT;
      var azalt = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () { r.classList.remove('kh-cal'); r.removeAttribute('data-k'); rozetCiz(r, yeni); bitir(); }, azalt ? 60 : 720);
    });
  }
  function bildir(m) {
    stil();
    var b = document.querySelector('.kh-bildir');
    if (b) b.remove();
    b = document.createElement('div');
    b.className = 'kh-bildir'; b.setAttribute('role', 'status'); b.textContent = m;
    document.body.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.remove(); }, 2600);
  }

  var _destekAdres = (function () {
    var p = location.pathname, i = p.indexOf('/kitap/');
    return (i >= 0 ? p.slice(0, i + 1) : '') + 'index.html#destek';
  })();
  /* referans kodu olan öğretmene: kaç meslektaşı destek verdi (destek.js yazar: ref {kod, sayi}) */
  function refNot() {
    var d = al(K_DURUM, null), r = d && d.ref;
    if (!r || !r.kod) return '';
    var n = r.sayi | 0;
    return '<small>Referans kodun <b>' + esc(r.kod) + '</b>: ' + n + ' meslektaşın kodunla destek verdi. ' +
      (n >= 3 ? '5 olunca bu öğretim yılı ödenmiş sayılırsın.' : '3 olunca payın yarıya iner, 5 olunca ödenmiş sayılırsın.') + '</small>';
  }
  function pencere(ic, etiket) {
    stil();
    var eski = document.querySelector('.kh-perde');
    if (eski) eski.remove();
    var p = document.createElement('div');
    p.className = 'kh-perde';
    p.innerHTML = '<div class="kh-kutu" role="dialog" aria-modal="true" aria-label="' + esc(etiket) + '">' + ic + '</div>';
    function kapat() { if (p.parentNode) p.remove(); document.removeEventListener('keydown', escK, true); }
    function escK(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); kapat(); } }
    p.addEventListener('click', function (e) { if (e.target === p || (e.target.closest && e.target.closest('.kh-kapat'))) kapat(); });
    var dk = p.querySelector('.kh-destek');
    if (dk) dk.addEventListener('click', function (e) {
      if (typeof window.KidefHak.destekAc === 'function') { e.preventDefault(); kapat(); window.KidefHak.destekAc(); }
    });
    document.addEventListener('keydown', escK, true);
    document.body.appendChild(p);
    var ilk = p.querySelector('.kh-destek');
    try { if (ilk) ilk.focus({ preventScroll: true }); } catch (e) { }
    return p;
  }
  function bittiPencere(oz) {
    return pencere('<div class="kh-ik">' + KILIT + '</div>' +
      '<h3>Bu haftaki deneme hakların bitti</h3>' +
      '<p><b>' + esc(AD[oz] || 'Bu araç') + '</b> Kidef\'e destek veren öğretmenlere sınırsız. Desteğin, sitenin yayın ve geliştirme ' +
        'giderlerini ve bu materyallerin arkasındaki öğretmen emeğini karşılıyor. Pazartesi yeniden ' + HAFTALIK + ' hakkın olur.</p>' +
      '<div class="kh-tus"><a class="kh-destek" href="' + esc(_destekAdres) + '">' + KALP + 'Destekle, sınırsız olsun</a>' +
      '<button type="button" class="kh-kapat">Kapat</button></div>' +
      refNot(), 'Deneme hakları bitti');
  }

  /* hak harcar: sınırsızsa true; hak varsa rozet 5→4 canlanır, sonra true; yoksa pencere, false */
  function kullan(oz, el) {
    var k = kalan(oz);
    if (k === Infinity) return Promise.resolve(true);
    if (k <= 0) { var r0 = el && rozet(el, oz); if (r0) rozetCiz(r0, 0); bittiPencere(oz); return Promise.resolve(false); }
    var r = el ? rozet(el, oz) : null;
    var yeni = harca(oz);
    if (!r || !document.body.contains(r)) {
      bildir((AD[oz] || 'Deneme hakkı') + ': bu hafta ' + (yeni > 0 ? yeni + ' hakkın kaldı' : 'son hakkını kullandın') + ' · destekçilere sınırsız');
      r = null;
    }
    return canlan(r, k, yeni).then(function () {
      [].forEach.call(document.querySelectorAll('.kh-rozet[data-kh="' + oz + '"]'), function (x) { if (x !== r) rozetCiz(x, yeni); });
      return true;
    });
  }

  /* ---------------- ortak hedefle açılan içerik ---------------- */
  function adresYal(h) {
    h = String(h || '').trim();
    try { var u = new URL(h, location.href); if (u.origin === location.origin) h = u.pathname + u.search; } catch (e) { }
    return h.replace(/^(\.\/|\/)+/, '').replace(/^.*?\/kitap\//, 'kitap/');
  }
  function hedefKaydi() {
    var H = al(K_HEDEF, null);
    return (H && Array.isArray(H.L) && H.L.length) ? H : null;
  }
  function hedefBul(el) {
    if (!el || el.tagName !== 'A' || !el.getAttribute('href')) return null;
    var H = hedefKaydi();
    if (!H || yoneticiMi()) return null;
    var a = adresYal(el.getAttribute('href'));
    if (!a) return null;
    for (var i = 0; i < H.L.length; i++) {
      var e = H.L[i], b = adresYal(e.a);
      if (!b || !(+e.y > 0) || e.acildi) continue;               /* hedefe bir kez varıldıysa açık kalır */
      var ayni = a === b || a.indexOf(b) === 0 && /^[?#&]/.test(a.charAt(b.length) || '?');
      if (ayni && !(H.y !== null && H.y !== undefined && +H.y >= +e.y)) return { e: e, y: H.y };
    }
    return null;
  }
  /* «%50'ye» — sayının okunuşuna göre yönelme eki */
  function yeEki(n) {
    n = Math.round(Math.abs(+n || 0));
    var B = { 1: 'e', 2: 'ye', 3: 'e', 4: 'e', 5: 'e', 6: 'ya', 7: 'ye', 8: 'e', 9: 'a' };
    var O = { 1: 'a', 2: 'ye', 3: 'a', 4: 'a', 5: 'ye', 6: 'a', 7: 'e', 8: 'e', 9: 'a' };
    if (n === 0) return 'a';
    if (n % 10) return B[n % 10];
    if (n % 100) return O[(n % 100) / 10];
    return 'e';
  }
  function hedefRozet(el, m) {
    var r = rozetYeri(el, 'hedef');
    var imza = 'h' + m.e.y;
    if (r.getAttribute('data-k') === imza) return r;
    r.setAttribute('data-k', imza);
    r.setAttribute('data-kh', 'hedef');
    r.classList.remove('kh-bitti');
    r.classList.add('kh-hedef');
    r.innerHTML = HEDEF + '<b>%' + (+m.e.y) + '</b>';
    r.title = 'Ortak hedef %' + (+m.e.y) + '\'' + yeEki(m.e.y) + ' ulaşınca herkese açılır';
    return r;
  }
  function hedefPencere(m) {
    var y = (m.y === null || m.y === undefined) ? null : Math.max(0, Math.round(+m.y));
    var hedef = Math.min(100, +m.e.y);
    return pencere('<div class="kh-ik">' + HEDEF + '</div>' +
      '<h3>' + esc(m.e.ad || 'Bu içerik') + ' ortak hedefle açılıyor</h3>' +
      (m.e.n ? '<p style="margin-bottom:10px">' + esc(m.e.n) + '</p>' : '') +
      '<p>Ortak hedef <b>%' + hedef + '</b>\'' + yeEki(hedef) + ' ulaşınca herkese açılır.' + (y !== null ? ' Şu an <b>%' + y + '</b>.' : '') +
        ' Her destek çubuğu biraz daha doldurur.</p>' +
      (y !== null ? '<div class="kh-cubuk"><i style="width:' + Math.min(100, y) + '%"></i><u style="left:calc(' + hedef + '% - 2px)"></u></div>' : '') +
      '<div class="kh-tus"><a class="kh-destek" href="' + esc(_destekAdres) + '">' + KALP + 'Destek ver</a>' +
      '<button type="button" class="kh-kapat">Kapat</button></div>', 'Ortak hedefle açılan içerik');
  }
  function hedefRozetler() {
    var H = hedefKaydi(), yon = yoneticiMi();
    [].forEach.call(document.querySelectorAll('.kh-rozet[data-kh="hedef"]'), function (r) {
      var el = r.parentNode;
      if (!H || yon || !hedefBul(el)) r.remove();
    });
    if (!H || yon) return;
    [].forEach.call(document.querySelectorAll('a[href]'), function (el) {
      var m = hedefBul(el);
      if (m) hedefRozet(el, m);
    });
  }

  /* ---------------- bağlar ---------------- */
  var BAGLAR = [], ROZETLER = [];
  function kosulTamam(b, el) {
    try { return !b.kosul || b.kosul(el) !== false; } catch (e) { return true; }
  }
  function eslesen(t) {
    for (var i = 0; i < BAGLAR.length; i++) {
      var el = t.closest ? t.closest(BAGLAR[i].s) : null;
      if (el && kosulTamam(BAGLAR[i], el)) return { el: el, oz: BAGLAR[i].oz };
    }
    return null;
  }
  function rozetler() {
    BAGLAR.concat(ROZETLER).forEach(function (b) {
      [].forEach.call(document.querySelectorAll(b.s), function (el) { rozet(el, b.oz); });
    });
    hedefRozetler();
  }
  function hedefeGit(el, e) {
    var yeniSekme = el.target === '_blank' || e.ctrlKey || e.metaKey;
    if (yeniSekme) { var w = null; try { w = window.open(el.href, '_blank'); } catch (x) { } if (!w) location.href = el.href; }
    else location.href = el.href;
  }
  var _gec = null;
  function tik(e) {
    if (e.defaultPrevented || !e.isTrusted) return;              /* tahtadaki yineleme ve kendi tıklamamız geçer */
    if (e.button && e.button !== 0) return;
    var t = e.target;
    if (!t || !t.closest) return;
    var a = t.closest('a[href]'), hm = a ? hedefBul(a) : null;
    if (hm) {
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      hedefPencere(hm);
      return;
    }
    if (!BAGLAR.length) return;
    var m = eslesen(t);
    if (!m) return;
    if (kalan(m.oz) === Infinity) return;
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    var el = m.el, r0 = el.querySelector(':scope > .kh-rozet');
    if (r0 && r0.classList.contains('kh-cal')) return;               /* canlanırken ikinci dokunuş: bir hak yeter */
    kullan(m.oz, el).then(function (ok) {
      if (!ok) return;
      if (el.tagName === 'A' && el.href) hedefeGit(el, e);
      else { _gec = el; el.click(); _gec = null; }
    });
  }
  function pencereAcik() {
    var L = document.querySelectorAll('[aria-modal="true"], .panel[aria-hidden="false"], .kh-perde');
    for (var i = 0; i < L.length; i++) {
      try { if (L[i].getClientRects().length && getComputedStyle(L[i]).visibility !== 'hidden') return true; } catch (e) { }
    }
    return false;
  }
  /* parmak kalkınca iş yapan düğmeler (defter çubukları dokunuşu pointerup'ta
     işler): sınırlıyken basış onlara ulaşmasın, iş tıklamada hakla yapılsın */
  function basis(e) {
    if (!e.isTrusted || !BAGLAR.length) return;
    var t = e.target;
    if (!t || !t.closest) return;
    var m = eslesen(t);
    if (!m || kalan(m.oz) === Infinity) return;
    e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }
  /* klavye kısayolu (flipbook kalemi P): açılırken hak */
  var TUSLAR = [];
  function tusDinle(e) {
    if (!e.isTrusted || e.ctrlKey || e.metaKey || e.altKey) return;
    var h = e.target || {};
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(h.tagName || '') || h.isContentEditable) return;
    for (var i = 0; i < TUSLAR.length; i++) {
      var x = TUSLAR[i];
      if (x.tus.indexOf(e.key) < 0) continue;
      var el = document.querySelector(x.s);
      if (!el || !kosulTamam(x, el) || kalan(x.oz) === Infinity) return;
      if (pencereAcik()) return;               /* tanıtım, panel ya da pencere açıkken kısayol zaten çalışmaz */
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      var r0 = el.querySelector(':scope > .kh-rozet');
      if (r0 && r0.classList.contains('kh-cal')) return;
      kullan(x.oz, el).then(function (ok) { if (ok) el.click(); });
      return;
    }
  }
  var _goz = null;
  function kur() {
    if (kur._oldu) return;
    kur._oldu = 1;
    document.addEventListener('click', tik, true);
    document.addEventListener('pointerdown', basis, true);
    window.addEventListener('keydown', tusDinle, true);
    if (window.MutationObserver) {
      var bekle = 0;
      /* yalnız sayfaya yeni öğe gelince; rozetlerin kendi değişimleri sayılmaz */
      var rozetMi = function (n) { return n && n.nodeType === 1 && (n.classList.contains('kh-rozet') || (n.closest && n.closest('.kh-rozet'))); };
      _goz = new MutationObserver(function (L) {
        var gercek = L.some(function (m) {
          if (rozetMi(m.target) || (m.target.parentNode && rozetMi(m.target.parentNode))) return false;
          return [].some.call(m.addedNodes, function (n) { return n.nodeType === 1 && !rozetMi(n) && !(n.classList && (n.classList.contains('kh-perde') || n.classList.contains('kh-bildir'))); });
        });
        if (!gercek || bekle) return;
        bekle = setTimeout(function () { bekle = 0; rozetler(); }, 120);
      });
      var bas = function () { _goz.observe(document.body, { childList: true, subtree: true }); rozetler(); };
      if (document.body) bas(); else document.addEventListener('DOMContentLoaded', bas);
    }
    window.addEventListener('storage', function (e) { if (e.key === K_DURUM || e.key === K_HAK || e.key === K_HEDEF) rozetler(); });
    /* hafta dönünce, sınırsızlık süresi bitince */
    setInterval(function () { if (document.visibilityState !== 'hidden') rozetler(); }, 60000);
  }
  function ekle(liste, harita) {
    Object.keys(harita || {}).forEach(function (s) {
      var v = harita[s];
      liste.push(typeof v === 'string' ? { s: s, oz: v } : { s: s, oz: v.oz, kosul: v.kosul });
    });
  }
  function bagla(harita) { ekle(BAGLAR, harita); kur(); if (document.body) rozetler(); }
  function rozetBagla(harita) { ekle(ROZETLER, harita); kur(); if (document.body) rozetler(); }

  /* sitedeki kapılar (seçicisi olmayan sayfada hiçbir şey olmaz) */
  var VARSAYILAN = {
    'a[href^="kaliplartablosu"]': 'kalip',
    'a[href^="muhadese.html"]': 'muhadese',
    'a[href^="kelimecarki.html"]': 'cark',
    '#thgKutu [data-thg="yansit"]': 'tahta',
    '.kmd-soru .kmd-evet': 'tahta',
    '#ysOrt [data-is="pdf"]': 'defter',
    '#ysOrt [data-is="panel"]': { oz: 'defter', kosul: function () { var p = document.getElementById('ysPanel'); return !(p && p.classList.contains('acik')); } },
    '#pIndir [data-p]': 'kitapIndir',
    '#tKalem': { oz: 'kitapKalem', kosul: function (el) { return el.getAttribute('aria-pressed') !== 'true'; } }
  };
  bagla(VARSAYILAN);
  rozetBagla({ '#tIndir': 'kitapIndir' });
  TUSLAR.push({ tus: ['p', 'P'], s: '#tKalem', oz: 'kitapKalem', kosul: VARSAYILAN['#tKalem'].kosul });

  window.KidefHak = {
    HAFTALIK: HAFTALIK, AD: AD,
    durum: durum, kalan: kalan, kullan: kullan, rozet: rozet, bagla: bagla, rozetBagla: rozetBagla, rozetler: rozetler,
    hafta: hafta, haftaKullanim: haftaKullanim,
    uid: function (u) { _uid = u ? String(u) : ''; rozetler(); },
    durumYaz: function (o) { if (o) yaz(K_DURUM, o); else { try { localStorage.removeItem(K_DURUM); } catch (e) { } } rozetler(); },
    hedefYaz: function (o) {
      if (o && Array.isArray(o.L) && o.L.length) yaz(K_HEDEF, { y: (o.y === null || o.y === undefined) ? null : +o.y, L: o.L, z: Date.now() });
      else { try { localStorage.removeItem(K_HEDEF); } catch (e) { } }
      rozetler();
    },
    hedefBul: hedefBul, yeEki: yeEki,
    destekAdresi: function (a) { if (a) _destekAdres = a; return _destekAdres; },
    destekAc: null
  };
})();
