/* =====================================================================
   KIDEF · TAHTAYA YANSIT — sistem/tahta.js (tahta.html'in motoru)
   ---------------------------------------------------------------------
                                                            17.10.2026
   Öğretmen: "aynı ağa bağlı akıllı tahta ve bilgisayarım var, ikisinden
   de siteye girdim ve giriş yaptım; bilgisayarımda site içinden gezerken
   akıllı tahtadan da aynı şekilde, kablo bağlamadan, ekranı yansıtmadan,
   bilgisayarı kullandığım şekilde tahtada görüntüsünü istiyorum" ·
   "sadece site için çalışsa yeter, sadece çok pratik olsun, mümkün
   olduğu kadar gecikme az olsun".
   2. SÜRÜM (17.10.2026) — öğretmen: "yansıtma başlayınca akıllı tahtada
   otomatik tam ekrana geçsin, akıllı tahtada herhangi bir yere dokununca
   da kullanılabilsin; amacımız sadece bilgisayarı yansıtmak değil,
   oturarak da akıllı tahta başında da siteyi kullanabilmek; ama istersek
   sadece bilgisayardan, istersek her iki cihazdan kullanabilmek için
   özellik ekleyelim" · "duraklatıp devam edince ekran kararmasın".

   NASIL ÇALIŞIR
   tahta.html bir KABUK: site sayfası tam ekran bir çerçevede (iframe, aynı
   site) açılır; kabuk sayfa değişse de kapanmaz, bağlantı hep açık.
   · BİLGİSAYAR (tahta.html?rol=yansit) ve TAHTA (tahta.html?rol=izle)
     aynı motoru çalıştırır. O an kullanılan cihaz LİDER'dir: açık sayfayı,
     kaydırmayı, tıklamaları, tuşları, yazı alanlarını ve video oynat/durdur'u
     hesabın canlı veritabanına yazar (Firebase Realtime Database:
     tahta/<uid>); öbür cihaz aynı sayfayı KENDİSİ açar, aynı hareketleri
     sırayla uygular. Görüntü her cihazda kendi çözünürlüğünde, keskin.
     Kablo, ekran paylaşımı, aynı ağ gerekmez; internet yeter.
   · İKİ CİHAZDAN DA (varsayılan): tahtaya dokunulunca lider tahta olur,
     bilgisayar onu izler; bilgisayarda tıklanınca, kaydırılınca ya da tuşa
     basılınca lider yeniden bilgisayar. Bilgisayarın üst şeridindeki
     "Tahtadan da kullan" kapatılırsa tahta yalnız gösterir (dokunmak bir
     şey değiştirmez; dokununca küçük durum penceresi açılır).
   · TAM EKRAN: tahta yansıtma başlayınca tam ekrana geçmeyi dener;
     tarayıcı buna dokunmadan izin vermiyorsa ilk dokunuşta geçer ve kabuk
     açık kaldıkça tam ekranda kalır (sonraki sayfalarda da). Öğretmen tam
     ekrandan kendisi çıkarsa o yansıtmada yeniden zorlanmaz. Tahtada
     "Ana ekrana ekle / Uygulamayı yükle" yapılırsa (tahta.webmanifest)
     oradan her açılışta kendiliğinden tam ekran açılır.

   TUTARLILIK
   · Rastgele karıştıran oyunlar iki cihazda aynı karışsın diye çerçevenin
     Math.random'u tohumlu bir üreteçle değişir: sayfa açılırken ve her
     tıklama/tuşta lider yeni tohum seçer, izleyen aynı tohumla uygular.
   · Bir işlem İKİ KEZ KAYDEDİLMEZ: yansıtma sürerken çerçevedeki Firestore
     yazmaları yalnız liderde çalışır, izleyende boşa çıkar. Onay
     pencerelerinde (confirm) izleyen liderdeki cevabı kullanır.
   · Şifre, e-posta ve PIN alanları öbür cihaza gitmez; bilgisayarda
     doğrulama penceresi (oturum güvenliği) açıkken tahta perde gösterir.
   · Sonradan bağlanan tahta (ya da bağlantısı kopup olay kaçıran cihaz)
     liderden "bu sayfanın geçmişini" ister; lider yalnız ONA baştan
     gönderir, öbür cihazlar yenilenmez. "Eşitle": bütün tahtalar sayfayı
     yeniler, baştan uygular.
   · Duraklat → Sürdür: bilgisayar aynı sayfadaysa tahta YENİLENMEZ (ekran
     kararmaz); duraklatmada yapılanlar sırayla gider. Başka sayfaya
     geçildiyse tahta o sayfayı açar. Kabuğun zemini beyaz: sayfa
     geçişlerinde koyu ekran görünmez.
   · Yansıtma sürdükçe tahtanın oturumu "hareketli" sayılır (40 dakikalık
     boşta kalma çıkışı öğretmen kullanırken işlemez).

   VERİTABANI KURALI (Firebase konsolu › Realtime Database › Kurallar):
     { "rules": { "tahta": { "$uid": {
         ".read":  "auth != null && auth.uid === $uid",
         ".write": "auth != null && auth.uid === $uid" } } } }
   Veri yolu: tahta/<uid>/ yayin · olay/0..63 · kay · alan · ayar · izle/<cihaz>
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefTahta) return;

  /* ------------------------------------------------------------ ayarlar */
  /* Realtime Database adresi — Firebase konsolunda veritabanı Belçika
     (europe-west1) seçilerek kurulursa adres budur. Başka bölge seçildiyse
     konsoldaki adres buraya (ve sistem/tahtagir.js'e) yazılır. */
  var VT_ADRES = 'https://kidefarapca-98f9c-default-rtdb.europe-west1.firebasedatabase.app';
  var AYAR = {
    apiKey: 'AIzaSyBGIQPJ_Bjm5I3-QmrrGpLR5MqmG3S5F8w',
    authDomain: 'kidefarapca-98f9c.firebaseapp.com',
    databaseURL: VT_ADRES,
    projectId: 'kidefarapca-98f9c',
    storageBucket: 'kidefarapca-98f9c.firebasestorage.app',
    messagingSenderId: '503317118211',
    appId: '1:503317118211:web:a9c8cf15b854597e0b3d36'
  };
  var HALKA = 64;                       /* olay yuvası sayısı */
  var GUNLUK_EN = 500;                  /* bir sayfada saklanan en çok olay (eşitleme için) */
  var ROL = /[?&]rol=izle\b/.test(location.search) ? 'izle' : 'yansit';
  var CIHAZ = ROL === 'izle' ? 'tahta' : 'bilgisayar';
  var CERCEVE = document.getElementById('tahtaCerceve');
  var SIMDI = function () { return Date.now(); };
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

  /* -------------------------------------------------------- yardımcılar */
  function $(id) { return document.getElementById(id); }
  function kd(k, tr, yer) {
    var m = (window.KidefDil && window.KidefDil.metin) ? window.KidefDil.metin(k, tr) : tr;
    if (!yer || m == null) return m;
    return String(m).replace(/\{([A-Za-z0-9_]+)\}/g, function (t, ad) {
      return has(yer, ad) ? String(yer[ad]) : t;
    });
  }
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function yeniTohum() {
    try { var a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0] >>> 0; } catch (e) { }
    return (Math.random() * 4294967296) >>> 0;
  }
  function rastgeleId() { return yeniTohum().toString(36) + SIMDI().toString(36).slice(-4); }
  /* iki cihazda aynı olan tohumlu üreteç (mulberry32) */
  function rastgeleKur(w, tohum) {
    var st = { s: tohum >>> 0 };
    var f = function () {
      st.s = (st.s + 0x6D2B79F5) >>> 0;
      var t = st.s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try {
      w.Math.random = f;
      w.__kidefTahtaTohum = function (s) { st.s = s >>> 0; };
    } catch (e) { }
  }
  function tohumla(w, s) { try { if (s != null && w.__kidefTahtaTohum) w.__kidefTahtaTohum(s); } catch (e) { } }
  function adresAl(w) {
    try { return w.location.pathname + w.location.search + w.location.hash; } catch (e) { return ''; }
  }
  function gercekSayfa(w) {               /* çerçevede sitenin bir sayfası açık mı (about:blank değil) */
    try { return !!(w && w.location.href !== 'about:blank' && w.location.origin === location.origin); } catch (e) { return false; }
  }
  function ayniSite(u, taban) {
    try { var a = new URL(u, taban || location.href); return a.origin === location.origin ? a : null; } catch (e) { return null; }
  }
  function ozet(s) {                       /* veritabanı anahtarı için kısa özet */
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function hareketYaz() {                  /* oturum güvenliği: cihaz kullanılıyor */
    var z = SIMDI();
    if (hareketYaz.son && z - hareketYaz.son < 5000) return;
    hareketYaz.son = z;
    try { localStorage.setItem('kg_son_hareket', String(z)); } catch (e) { }
  }

  var BEN = rastgeleId();                  /* bu cihazın kimliği: liderlik ve tahta kaydı */

  /* ------------------------------------------------------- ortak durum */
  var S = {
    kok: null, lider: false, yayin: null, belge: null, s0: 0, baglanti: true,
    izle: {}, isteGoruldu: {}, tahtadanDendi: false,
    ayar: { kip: 'cift', perde: false, kg: false }
  };
  function oturumVar() { return !!(S.yayin && S.yayin.cevrimici); }
  function cift() { return S.ayar.kip !== 'tek'; }
  function takipte() { return !S.lider && oturumVar(); }      /* başka cihazı izliyor */

  /* ----------------------------------------------------------- öğe yolu
     Öğe, en yakın kimlikli (id) atasından çocuk sıralarıyla bulunur; parmak
     izi (etiket + data-* + ad/tür/rol/bağlantı) doğrulama içindir. Öbür
     cihazda yol tutmazsa aynı parmak izli öğeler arasından en yakını seçilir. */
  var PARMAK_NIT = /^(data-(?!i18n|kd-|tahta)[a-z0-9-]+|name|type|role|for|aria-controls|value)$/;
  function parmak(el) {
    var p = el.tagName.toLowerCase(), n = [];
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (PARMAK_NIT.test(a.name) && a.value.length < 80) n.push(a.name + '=' + a.value);
    }
    if (el.tagName === 'A') { var h = el.getAttribute('href') || ''; n.push('href=' + h.split('?')[0].slice(-60)); }
    n.sort();
    return p + (n.length ? '|' + n.join('|') : '');
  }
  function yolAl(el, belge) {
    var p = [], e = el;
    while (e && e.nodeType === 1 && e !== belge.body && e !== belge.documentElement) {
      if (e.id && /^[A-Za-z][\w:.-]*$/.test(e.id) && belge.getElementById(e.id) === e) {
        return { k: '#' + e.id, p: p.reverse(), f: parmak(el) };
      }
      var ata = e.parentElement;
      if (!ata) break;
      p.push(Array.prototype.indexOf.call(ata.children, e));
      e = ata;
    }
    return { k: '^', p: p.reverse(), f: parmak(el) };
  }
  function yolBul(y, belge) {
    if (!y || !belge || !belge.body) return null;
    var kok = y.k === '^' ? belge.body : belge.getElementById(String(y.k).slice(1));
    if (!kok) return null;
    var e = kok, p = y.p || [];
    for (var i = 0; i < p.length && e; i++) e = e.children[p[i]];
    if (e && parmak(e) === y.f) return e;
    /* yol tutmadı: aynı parmak izli adaylar */
    var etiket = String(y.f).split('|')[0], aday = [];
    var liste = kok.getElementsByTagName(etiket);
    for (var j = 0; j < liste.length; j++) if (parmak(liste[j]) === y.f) aday.push(liste[j]);
    if (aday.length === 1) return aday[0];
    if (aday.length > 1) {
      var en = null, enPuan = -1;
      aday.forEach(function (a) {
        var ay = yolAl(a, belge).p, puan = 0;
        for (var k = 0; k < Math.min(ay.length, p.length); k++) { if (ay[k] === p[k]) puan++; else break; }
        if (puan > enPuan) { enPuan = puan; en = a; }
      });
      return en;
    }
    return (e && e.tagName && e.tagName.toLowerCase() === etiket) ? e : null;
  }
  function yolMetni(y) { return y ? (y.k + '/' + (y.p || []).join('.') + '/' + y.f) : 'b'; }

  /* yazı alanı mı, öbür cihaza gidebilir mi */
  function yaziAlani(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.isContentEditable) return true;
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName !== 'INPUT') return false;
    return /^(text|search|url|number|tel|email|password|date|time|datetime-local|month|week)$/i.test(el.type || 'text');
  }
  function gizliAlan(el) {
    if (!el || el.nodeType !== 1) return true;
    var t = (el.getAttribute('type') || '').toLowerCase();
    if (/^(password|email|hidden|file)$/.test(t)) return true;
    var ac = (el.getAttribute('autocomplete') || '').toLowerCase();
    if (/password|one-time-code|cc-/.test(ac)) return true;
    if (t === 'tel' && el.maxLength > 0 && el.maxLength <= 2) return true;      /* PIN hanesi */
    if (el.closest && el.closest('.kg-perde, .kg-pin, [data-tahta-gizli]')) return true;
    return false;
  }
  function izlenecekAlan(el) {
    if (!el || el.nodeType !== 1 || gizliAlan(el)) return false;
    if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
    if (el.tagName !== 'INPUT') return false;
    var t = (el.getAttribute('type') || 'text').toLowerCase();
    return /^(text|search|url|number|range|color|date|time|datetime-local|month|week)$/.test(t);
  }

  /* ------------------------------------------------------------ arayüz */
  var STIL = [
    'html,body{background:#fff}',
    '.th-cubuk{position:fixed;left:0;right:0;top:0;height:36px;z-index:20;display:flex;align-items:center;gap:10px;padding:0 10px;',
    ' background:#0f2a43;color:#fff;font:600 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.25)}',
    '.th-cubuk .th-isim{display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
    '.th-nokta{width:10px;height:10px;border-radius:50%;background:#94a3b8;flex:none;box-shadow:0 0 0 3px rgba(148,163,184,.25)}',
    '.th-nokta.canli{background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.28);animation:thNabiz 1.6s ease-in-out infinite}',
    '.th-nokta.bekle{background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.28)}',
    '.th-nokta.hata{background:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.28)}',
    '@keyframes thNabiz{50%{box-shadow:0 0 0 6px rgba(34,197,94,0)}}',
    '.th-cip{background:rgba(255,255,255,.12);border-radius:999px;padding:5px 10px;font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
    '.th-bos{flex:1}',
    '.th-dug{height:26px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;border-radius:8px;padding:0 10px;',
    ' font:700 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}',
    '.th-dug:hover{background:rgba(255,255,255,.2)}',
    '.th-dug[aria-pressed="true"]{background:#f59e0b;border-color:#f59e0b;color:#1f2937}',
    '.th-dug.th-kip[aria-pressed="true"]{background:#16A085;border-color:#16A085;color:#fff}',
    '.th-dug.kirmizi{background:#dc2626;border-color:#dc2626}',
    '.th-dug svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '@media (max-width:820px){.th-dug span{display:none}.th-cip{max-width:42vw}}',
    'body.th-yansit .th-cerceve{top:36px;height:calc(100% - 36px)}',
    '.th-cerceve{position:fixed;left:0;top:0;width:100%;height:100%;border:0;background:#fff;display:block}',
    '.th-koruma{position:fixed;inset:0;z-index:15;background:transparent;cursor:default}',
    '.th-perde{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;',
    ' background:radial-gradient(circle at 50% 40%,#16405f,#0b1d2e);color:#e2e8f0;font:600 clamp(16px,2.2vw,28px)/1.4 system-ui,sans-serif;text-align:center}',
    '.th-perde b{font-size:clamp(28px,4vw,56px);color:#fff;letter-spacing:.5px}',
    '.th-perde small{opacity:.7;font-size:.7em}',
    '.th-bekle{position:fixed;inset:0;z-index:25;display:flex;align-items:center;justify-content:center;padding:24px;',
    ' background:linear-gradient(160deg,#eef6f3,#e7eef7);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#0f2a43}',
    '.th-kutu{max-width:640px;width:100%;background:#fff;border-radius:22px;box-shadow:0 20px 60px rgba(15,42,67,.18);padding:30px 30px 24px;text-align:center}',
    '.th-kutu h1{margin:12px 0 8px;font-size:clamp(22px,2.6vw,32px)}',
    '.th-kutu p{margin:0 0 12px;color:#475569;font-size:clamp(15px,1.5vw,19px);line-height:1.5}',
    '.th-kutu .th-adim{display:inline-block;background:#0f2a43;color:#fff;border-radius:8px;padding:2px 8px;margin:0 2px;font-weight:700}',
    '.th-kutu .th-tuslar{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px}',
    '.th-ana{border:0;border-radius:12px;padding:12px 20px;font:800 16px/1 system-ui,sans-serif;color:#fff;cursor:pointer;',
    ' background:linear-gradient(135deg,#16A085,#0E7C66);box-shadow:0 6px 18px rgba(14,124,102,.3)}',
    '.th-ikinci{border:1.5px solid #cbd5e1;border-radius:12px;padding:11px 18px;font:700 15px/1 system-ui,sans-serif;color:#334155;background:#fff;cursor:pointer}',
    '.th-cizim{width:min(320px,70%);height:auto;display:block;margin:0 auto}',
    '.th-cizim .th-akis{stroke-dasharray:4 9;animation:thAkis 1s linear infinite}',
    '@keyframes thAkis{to{stroke-dashoffset:-13}}',
    '.th-durum{position:fixed;right:12px;bottom:12px;z-index:40;display:flex;align-items:flex-end;flex-direction:column;gap:8px;font-family:system-ui,sans-serif}',
    '.th-durum .th-nokta{width:12px;height:12px;cursor:pointer;opacity:.75}',
    '.th-pencere{background:#0f2a43;color:#fff;border-radius:14px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.3);font:600 13px/1.45 system-ui,sans-serif;max-width:300px}',
    '.th-pencere p{margin:0 0 8px}',
    '.th-pencere .th-tuslar{display:flex;gap:6px;flex-wrap:wrap}',
    '.th-serit{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:26;background:rgba(15,42,67,.92);color:#fff;',
    ' border-radius:999px;padding:8px 16px;font:700 14px/1.2 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center}',
    '.th-ipucu{position:fixed;left:50%;top:54px;transform:translateX(-50%);z-index:27;display:flex;align-items:center;gap:10px;pointer-events:none;',
    ' background:rgba(15,42,67,.92);color:#fff;border-radius:999px;padding:10px 18px;font:700 clamp(14px,1.5vw,20px)/1.2 system-ui,sans-serif;',
    ' box-shadow:0 8px 24px rgba(0,0,0,.25);max-width:90vw;animation:thIpucu 1.8s ease-in-out infinite}',
    '.th-ipucu svg{width:1.3em;height:1.3em;flex:none;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '@keyframes thIpucu{50%{box-shadow:0 8px 24px rgba(0,0,0,.25),0 0 0 8px rgba(22,160,133,.25)}}',
    '.th-bildirim{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:50;background:#0f2a43;color:#fff;border-radius:12px;',
    ' padding:10px 16px;font:700 14px/1.3 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:calc(100vw - 32px);text-align:center}',
    '[hidden]{display:none !important}'
  ].join('\n');
  function stilKur() {
    if ($('thStil')) return;
    var s = document.createElement('style'); s.id = 'thStil'; s.textContent = STIL;
    document.head.appendChild(s);
  }
  var bildirimZ = null;
  function bildir(m, ms) {
    var b = $('thBildirim');
    if (!b) { b = document.createElement('div'); b.id = 'thBildirim'; b.className = 'th-bildirim'; document.body.appendChild(b); }
    b.textContent = m; b.hidden = false;
    clearTimeout(bildirimZ);
    bildirimZ = setTimeout(function () { b.hidden = true; }, ms || 3200);
  }
  var SVG = {
    perde: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M3 4l18 13"/></svg>',
    durak: '<svg viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></svg>',
    devam: '<svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>',
    esitle: '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg>',
    bitir: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    tam: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    dokun: '<svg viewBox="0 0 24 24"><path d="M9 11.5V5.2a1.6 1.6 0 0 1 3.2 0v5.6"/><path d="M12.2 10.2V8.8a1.6 1.6 0 0 1 3.2 0v2.4"/>' +
      '<path d="M15.4 10.6a1.6 1.6 0 0 1 3.2 0V15a6 6 0 0 1-6 6h-.9a6 6 0 0 1-4.7-2.3L4.3 15.8a1.6 1.6 0 0 1 2.5-2l2.2 2.4"/></svg>'
  };
  function cizim() {
    return '<svg class="th-cizim" viewBox="0 0 320 150" aria-hidden="true">' +
      '<rect x="8" y="34" width="104" height="66" rx="8" fill="#e2e8f0" stroke="#0f2a43" stroke-width="3"/>' +
      '<rect x="18" y="44" width="84" height="46" rx="3" fill="#fff"/>' +
      '<path d="M0 108h120l-10 10H10z" fill="#0f2a43"/>' +
      '<rect x="182" y="14" width="132" height="94" rx="8" fill="#0f2a43"/>' +
      '<rect x="190" y="22" width="116" height="78" rx="4" fill="#fff"/>' +
      '<path d="M246 108v26M226 136h40" stroke="#0f2a43" stroke-width="4" stroke-linecap="round"/>' +
      '<path class="th-akis" d="M122 66 C150 40, 160 40, 180 58" fill="none" stroke="#16A085" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="26" y="52" width="40" height="6" rx="3" fill="#16A085"/><rect x="26" y="64" width="64" height="5" rx="2.5" fill="#cbd5e1"/>' +
      '<rect x="26" y="74" width="54" height="5" rx="2.5" fill="#cbd5e1"/>' +
      '<rect x="202" y="34" width="56" height="9" rx="4" fill="#16A085"/><rect x="202" y="52" width="92" height="7" rx="3.5" fill="#cbd5e1"/>' +
      '<rect x="202" y="66" width="76" height="7" rx="3.5" fill="#cbd5e1"/></svg>';
  }
  function bekleGoster(tur) {
    var b = $('thBekle');
    if (!tur) { b.hidden = true; return; }
    var ic = '';
    if (tur === 'giris') {
      ic = '<h1>' + kac(kd('th.giris_bas', 'Önce giriş yap')) + '</h1>' +
        '<p>' + kac(kd('th.giris_alt', 'Tahtaya yansıtma, bilgisayarla tahtada aynı hesapla giriş yapınca çalışır.')) + '</p>' +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="anasayfa">' + kac(kd('th.anasayfaya', 'Ana sayfaya git')) + '</button></div>';
    } else if (tur === 'vt') {
      ic = '<h1>' + kac(kd('th.vt_bas', 'Tahta bağlantısı kurulamadı')) + '</h1>' +
        '<p>' + kac(kd('th.vt_alt', 'İnternet bağlantını kontrol et. Sorun sürerse site yöneticisine haber ver.')) + '</p>' +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="yenile">' + kac(kd('th.tekrar', 'Tekrar dene')) + '</button>' +
        '<button type="button" class="th-ikinci" data-th="cik">' + kac(kd('th.cik', 'Çık')) + '</button></div>';
    } else {   /* izle: bilgisayar bekleniyor */
      ic = cizim() + '<h1>' + kac(kd('th.bekle_bas', 'Bilgisayarını bekliyorum')) + '</h1>' +
        '<p>' + kd('th.bekle_alt', 'Bilgisayarında kidefarapca.com’da başlıktaki ekran simgesine (<span class="th-adim">Tahtaya yansıt</span>) dokun, sonra <span class="th-adim">Bu bilgisayardan yansıt</span>’a bas. Açtığın her şey burada görünecek.') + '</p>' +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="tam">' + kac(kd('th.tam_ekran', 'Tam ekran')) + '</button>' +
        '<button type="button" class="th-ikinci" data-th="cik">' + kac(kd('th.cik', 'Çık')) + '</button></div>';
    }
    b.innerHTML = '<div class="th-kutu">' + ic + '</div>';
    b.hidden = false;
  }

  /* TAM EKRAN — tarayıcılar sayfanın kendi kendine tam ekrana geçmesine
     yalnız bir dokunuştan hemen sonra izin veriyor: yansıtma başlayınca
     denenir, olmazsa tahtadaki ilk dokunuşta (çerçevenin içinde de) geçilir.
     Kabuk hiç değişmediği için sonraki sayfalarda tam ekran sürer. */
  var TAM = { istek: true, oldu: false };
  function tamEkranda() {
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    try { if (window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches) return true; } catch (e) { }
    return false;
  }
  function tamEkran() {
    var d = document, el = d.documentElement;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) return;
      var f = el.requestFullscreen || el.webkitRequestFullscreen;
      if (f) { var p = f.call(el); if (p && p.catch) p.catch(function () { }); }
    } catch (e) { }
  }
  function tamEkranDene() { if (CIHAZ === 'tahta' && TAM.istek && !tamEkranda()) tamEkran(); }
  var ipucuZ = null;
  function ipucuGoster() {
    if (CIHAZ !== 'tahta' || tamEkranda() || !TAM.istek) return;
    var p = $('thIpucu');
    if (!p) { p = document.createElement('div'); p.id = 'thIpucu'; p.className = 'th-ipucu'; document.body.appendChild(p); }
    p.innerHTML = SVG.tam + '<span>' + kac(kd('th.tam_dokun', 'Tam ekran için ekrana bir kez dokun')) + '</span>';
    p.hidden = false;
    clearTimeout(ipucuZ);
    ipucuZ = setTimeout(function () { p.hidden = true; }, 15000);
  }
  function ipucuGizle() { var p = $('thIpucu'); if (p) p.hidden = true; }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (t) {
    document.addEventListener(t, function () {
      if (tamEkranda()) { TAM.oldu = true; ipucuGizle(); }
      else if (TAM.oldu) { TAM.oldu = false; TAM.istek = false; }     /* öğretmen kendisi çıktı: bu yansıtmada zorlanmaz */
    });
  });

  function cik(adres) {
    var k = S.kok, liderdim = S.lider;
    S.lider = false; S.kok = null;
    try {
      if (k) k.child('yayin').onDisconnect().cancel();
      if (k && CIHAZ === 'bilgisayar') {
        k.update({ 'yayin/cevrimici': false, 'yayin/ts': TS(), 'olay': null, 'kay': null, 'alan': null, 'ayar/perde': false, 'ayar/kg': false });
        k.child('izle/' + BEN).remove();
      } else if (k) {
        /* tahta kullanılırken çıkılırsa kontrol bilgisayara döner */
        if (liderdim && S.yayin && S.yayin.cevrimici && S.yayin.id === BEN) k.child('yayin').update({ cevrimici: false, ts: TS() });
        k.child('izle/' + BEN).onDisconnect().cancel();
        k.child('izle/' + BEN).remove();
      }
    } catch (e) { }
    var u = adres || 'index.html';
    setTimeout(function () { location.href = u; }, 120);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-th]') : null;
    if (!t) return;
    var is = t.getAttribute('data-th');
    if (is === 'anasayfa') cik('index.html');
    else if (is === 'yenile') location.reload();
    else if (is === 'cik') cik(ROL === 'izle' ? 'index.html' : (adresAl(CERCEVE.contentWindow) || 'index.html'));
    else if (is === 'tam') { TAM.istek = true; tamEkran(); }
  });

  /* ---------------------------------------------------------- Firebase */
  var vt = null, auth = null, ofset = 0;
  function sunucuZaman() { return SIMDI() + ofset; }
  var TS = function () { return (window.firebase && firebase.database && firebase.database.ServerValue) ? firebase.database.ServerValue.TIMESTAMP : SIMDI(); };
  function baglan(hazir) {
    if (!window.firebase || !firebase.initializeApp || !firebase.database) { bekleGoster('vt'); return; }
    try {
      if (!firebase.apps.length) firebase.initializeApp(AYAR);
      auth = firebase.auth();
      vt = firebase.database();
    } catch (e) { bekleGoster('vt'); return; }
    try {
      vt.ref('.info/serverTimeOffset').on('value', function (s) {
        ofset = s.val() || 0;
        if (CIHAZ === 'tahta' && S.kok && !Z.ofsetGeldi) { Z.ofsetGeldi = true; Z.katilma = sunucuZaman(); }   /* saat farkı belli olunca */
      });
    } catch (e) { }
    var cevap = false;
    var zaman = setTimeout(function () { if (!cevap) bekleGoster('giris'); }, 6000);
    auth.onAuthStateChanged(function (u) {
      cevap = true; clearTimeout(zaman);
      if (!u || u.isAnonymous) {
        if (S.kok) { var k = S.kok; S.kok = null; S.lider = false; try { k.child('izle/' + BEN).remove(); } catch (e) { } }
        bekleGoster('giris'); return;
      }
      hazir(vt.ref('tahta/' + u.uid));
    });
  }
  /* bağlantı koparsa yansıtmayı yalnız LİDER kapatır (izleyenin kopması oturumu bitirmez) */
  function kopmaKur() {
    if (!S.kok) return;
    try {
      var r = S.kok.child('yayin').onDisconnect();
      if (S.lider) r.update({ cevrimici: false, ts: TS() }); else r.cancel();
    } catch (e) { }
  }
  /* bu cihaz izle/ altında: tahta varlığı ve "bu sayfanın geçmişini gönder" isteği */
  function varlikYaz(iste) {
    if (!S.kok) return;
    try {
      var r = S.kok.child('izle/' + BEN);
      r.onDisconnect().remove();
      var v = { cevrimici: true, cihaz: CIHAZ, ts: TS(), gecikme: zOrtalama() };
      if (iste) { Z.esitJeton = rastgeleId(); v.iste = Z.esitJeton; v.isteZ = TS(); }
      r.update(v);
    } catch (e) { }
  }

  /* ======================================================= LİDER (yayın)
     Bu cihaz kullanılıyorken çalışır: hareketleri veritabanına yazar. */
  var Y = {
    n: 0, d: Math.floor(SIMDI() / 1000) * 100,      /* sayfa sayacı: her oturumda öncekilerden büyük başlar */
    s0: 0, belge: null, win: null, durak: false, durakD: -1, durakG: 0, durakYeni: [],
    gunluk: [], gSay: 0, aktif: null, alanSon: {}, alanIz: [], kayBek: {}, kayZ: null, kaySon: 0,
    sonTik: null, kgPerde: false, gecisZ: 0
  };
  function yayinda() { return !!(S.kok && S.lider && !Y.durak); }
  function olayGonder(o) {
    if (!Y.belge) return;
    o.d = Y.d; o.g = ++Y.gSay;
    Y.gunluk.push(o);
    if (Y.gunluk.length > GUNLUK_EN) Y.gunluk.shift();
    if (!yayinda()) return;               /* duraklatılmışken günlükte bekler, sürdürünce gider */
    olayYazHam(o);
  }
  var OLAY_DIS = { g: 1, hd: 1, n: 1, i: 1, z: 1, d: 1, bos: 1 };
  function olayYazHam(o, hedef) {
    if (!S.kok) return;
    Y.n += 1;
    var k = {};
    for (var a in o) if (has(o, a) && o[a] !== undefined && !OLAY_DIS[a]) k[a] = o[a];
    k.n = Y.n; k.i = BEN; k.d = Y.d; k.z = sunucuZaman();
    if (hedef) k.hd = hedef;
    S.kok.child('olay/' + (Y.n % HALKA)).set(k);
  }
  function sayfaBilgisi() {
    var dil = 'tr';
    try { dil = localStorage.getItem('kidef_dil') || 'tr'; } catch (e) { }
    return { u: adresAl(Y.win), dil: dil };
  }
  function yayinYaz(temizle) {
    if (!yayinda() || !gercekSayfa(Y.win)) return;
    var b = sayfaBilgisi(), g = {};
    g['yayin'] = { id: BEN, cihaz: CIHAZ, cevrimici: true, d: Y.d, u: b.u, dil: b.dil, s0: Y.s0, durak: false, ts: TS() };
    if (temizle) { g['kay'] = null; g['alan'] = null; }
    S.kok.update(g);
  }
  function baslikYaz(d) {
    if (CIHAZ !== 'bilgisayar') return;
    try { document.title = '📺 ' + ((d && d.title) || 'Kidef Arapça'); } catch (e) { }
  }
  var sonAdres = '';
  function adresKontrol() {
    if (!S.lider || !Y.win) return;
    var u = adresAl(Y.win);
    if (u === sonAdres) return;
    sonAdres = u;
    baslikYaz(Y.belge);
    if (yayinda() && gercekSayfa(Y.win)) S.kok.child('yayin').update({ u: u, ts: TS() });
  }

  /* çerçevede yeni sayfa açıldı (lider) */
  function yYeniBelge(w, d) {
    Y.win = w; Y.belge = d; Y.d += 1; Y.s0 = yeniTohum(); S.s0 = Y.s0;
    Y.gunluk = []; Y.alanSon = {}; Y.alanIz = []; Y.kayBek = {};
    rastgeleKur(w, Y.s0);
    sonAdres = adresAl(w);
    yayinYaz(true);
    var hazirsa = function () {
      if (!S.lider || Y.belge !== d) return;
      alanTara(); baslikYaz(d); adresKontrol();
    };
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', hazirsa); else hazirsa();
  }
  function hedefOge(e) {
    var t = e.target;
    if (t && t.nodeType !== 1) t = t.parentElement;
    return t && t.nodeType === 1 ? t : null;
  }
  function gidenBaglanti(a, w) {
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^javascript:/i.test(h)) return false;
    var u = ayniSite(h, w.location.href);
    if (!u) return false;
    var hedef = (a.getAttribute('target') || '').toLowerCase();
    if (hedef && hedef !== '_self') return true;        /* çerçevede açılacak */
    return !(u.pathname === w.location.pathname && u.search === w.location.search && u.hash);
  }
  function yTik(e) {
    if (!e.isTrusted || !S.lider) return;
    var el = hedefOge(e);
    if (!el || !Y.belge) return;
    var s = yeniTohum();
    tohumla(Y.win, s);
    var o = { t: 'k', y: yolAl(el, Y.belge), s: s, c: [] };
    Y.aktif = o;
    Y.sonTik = { z: SIMDI(), el: el };
    var w = Y.win;
    setTimeout(function () {
      if (Y.aktif === o) Y.aktif = null;
      if (o.gecis) return;
      var a = el.closest ? el.closest('a[href]') : null;
      if (a && !e.defaultPrevented && gidenBaglanti(a, w)) return;   /* sayfa değişecek: adresle gider */
      if (!o.c.length) delete o.c;
      olayGonder(o);
      alanTaraYakin();
    }, 0);
  }
  var OZEL_TUS = /^(Enter|Escape|Esc|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|PageUp|PageDown|Home|End|F\d+| |Spacebar)$/;
  function yTus(e) {
    if (!e.isTrusted || !S.lider || !Y.belge) return;
    if (/^(Shift|Control|Alt|Meta|CapsLock|Tab|OS|AltGraph)$/.test(e.key)) return;
    var el = hedefOge(e);
    var alan = yaziAlani(el);
    if (alan && (gizliAlan(el) || !OZEL_TUS.test(e.key) || e.key === ' ')) return;
    var s = null;
    if (e.type === 'keydown') { s = yeniTohum(); tohumla(Y.win, s); }
    var govde = !el || el === Y.belge.body || el === Y.belge.documentElement;
    var o = {
      t: 'b', e: e.type === 'keyup' ? 'u' : 'd', k: e.key, c: e.code || '', kc: e.keyCode || 0,
      m: (e.ctrlKey ? 1 : 0) | (e.shiftKey ? 2 : 0) | (e.altKey ? 4 : 0) | (e.metaKey ? 8 : 0),
      y: govde ? null : yolAl(el, Y.belge), s: s, c2: []
    };
    if (s == null) delete o.s;
    if (!o.y) delete o.y;
    Y.aktif = { c: o.c2 };
    setTimeout(function () { Y.aktif = null; if (!o.c2.length) delete o.c2; olayGonder(o); alanTaraYakin(); }, 0);
  }
  function yGonder(e) {
    if (!e.isTrusted || !S.lider || !Y.belge) return;
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    /* gönder tuşuna tıklamayla gelen gönderim tıklamayla zaten gidiyor */
    if (Y.sonTik && SIMDI() - Y.sonTik.z < 80 && f.contains(Y.sonTik.el)) return;
    var o = { t: 'g', y: yolAl(f, Y.belge) };
    setTimeout(function () { olayGonder(o); }, 0);
  }
  function yMedya(e) {
    if (!S.lider) return;
    var m = e.target;
    if (!m || !/^(VIDEO|AUDIO)$/.test(m.tagName) || !Y.belge) return;
    olayGonder({ t: 'm', y: yolAl(m, Y.belge), e: e.type, zt: Math.round((m.currentTime || 0) * 100) / 100, hz: m.playbackRate || 1 });
  }
  /* --- yazı alanları: girişte ve kod değiştirdiğinde (ekran klavyesi) */
  function alanAnahtar(el) { return 'a' + ozet(yolMetni(yolAl(el, Y.belge))); }
  function alanIzle(el) {
    if (!izlenecekAlan(el)) return;
    if (Y.alanIz.indexOf(el) < 0) { Y.alanIz.push(el); if (Y.alanIz.length > 60) Y.alanIz.shift(); }
  }
  function alanTara() {
    if (!Y.belge) return;
    try {
      var l = Y.belge.querySelectorAll('textarea, input, select');
      for (var i = 0; i < l.length && i < 120; i++) alanIzle(l[i]);
    } catch (e) { }
    alanKontrol();
  }
  function yAlanOlay(e) {
    if (!e.isTrusted || !S.lider) return;
    var el = hedefOge(e);
    if (!izlenecekAlan(el)) return;
    alanIzle(el);
    alanKontrol();
  }
  var alanZ = null;
  function alanTaraYakin() { clearTimeout(alanZ); alanZ = setTimeout(alanKontrol, 30); }
  function alanKontrol() {
    if (!Y.belge || !yayinda()) return;
    var g = {}, var_ = false;
    Y.alanIz = Y.alanIz.filter(function (el) { return el.isConnected; });
    Y.alanIz.forEach(function (el) {
      var v = String(el.value == null ? '' : el.value);
      if (v.length > 20000) v = v.slice(0, 20000);
      var k = alanAnahtar(el);
      if (Y.alanSon[k] === v) return;
      Y.alanSon[k] = v;
      g[k] = { d: Y.d, y: yolAl(el, Y.belge), v: v, z: sunucuZaman() };
      var_ = true;
    });
    if (var_) S.kok.child('alan').update(g);
  }
  /* --- kaydırma: belge (çapa öğeyle) ve içte kayan kutular (oranla) */
  function belgeKonumu() {
    var w = Y.win, d = Y.belge, se = d.scrollingElement || d.documentElement;
    var max = se.scrollHeight - w.innerHeight;
    var f = max > 0 ? se.scrollTop / max : 0;
    var cizgi = w.innerHeight / 3, a = null, o = 0;
    try {
      var el = d.elementFromPoint(w.innerWidth / 2, cizgi);
      while (el && el !== d.body && el !== d.documentElement) {
        var cs = w.getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'sticky') { el = null; break; }
        var r = el.getBoundingClientRect();
        if (r.height > 4 && r.height < w.innerHeight * 0.9) { a = yolAl(el, d); o = (cizgi - r.top) / r.height; break; }
        el = el.parentElement;
      }
    } catch (e) { }
    var k = { d: Y.d, f: Math.round(f * 100000) / 100000, z: sunucuZaman() };
    if (a) { k.a = a; k.o = Math.round(o * 10000) / 10000; }
    return k;
  }
  function yKay(e) {
    if (!S.lider || !Y.belge) return;
    var t = e.target, d = Y.belge;
    var belgeMi = (t === d || t === d.documentElement || t === d.body || t === d.scrollingElement);
    if (belgeMi) Y.kayBek.b = true;
    else if (t && t.nodeType === 1) Y.kayBek['e' + ozet(yolMetni(yolAl(t, d)))] = t;
    kayZamanla();
  }
  function kayZamanla() {
    if (Y.kayZ) return;
    var bekle = Math.max(0, 70 - (SIMDI() - Y.kaySon));
    Y.kayZ = setTimeout(function () { Y.kayZ = null; Y.kaySon = SIMDI(); kayGonder(); }, bekle);
  }
  function kayGonder() {
    if (!Y.belge || !yayinda()) { Y.kayBek = {}; return; }
    var g = {}, var_ = false;
    for (var k in Y.kayBek) {
      if (!has(Y.kayBek, k)) continue;
      if (k === 'b') g.b = belgeKonumu();
      else {
        var el = Y.kayBek[k];
        if (!el || !el.isConnected) continue;
        var my = el.scrollHeight - el.clientHeight, mx = el.scrollWidth - el.clientWidth;
        g[k] = { d: Y.d, y: yolAl(el, Y.belge), f: my > 0 ? Math.round(el.scrollTop / my * 100000) / 100000 : 0,
                 x: mx > 0 ? Math.round(el.scrollLeft / mx * 100000) / 100000 : 0, z: sunucuZaman() };
      }
      var_ = true;
    }
    Y.kayBek = {};
    if (var_) S.kok.child('kay').update(g);
  }
  function kayHepsi() {
    if (!Y.belge) return;
    Y.kayBek.b = true;
    try {
      var l = Y.belge.querySelectorAll('*'), n = 0;
      for (var i = 0; i < l.length && n < 40; i++) {
        var el = l[i];
        if ((el.scrollTop > 0 || el.scrollLeft > 0) && el !== Y.belge.documentElement && el !== Y.belge.body) {
          Y.kayBek['e' + ozet(yolMetni(yolAl(el, Y.belge)))] = el; n++;
        }
      }
    } catch (e) { }
    kayGonder();
  }
  /* --- eşitleme
     hedef verilirse: bu sayfada yapılanlar YALNIZ o cihaza baştan gider
     (sonradan bağlanan ya da olay kaçıran) — öbür tahtalar yenilenmez.
     Başta bir işaret olayı (t:'es') gider: isteyen cihaz işareti görene
     dek gelen olayları uygulamaz (hepsi bu eşitlemenin içinde).
     hedef yoksa ("Eşitle" düğmesi): bütün tahtalar sayfayı yeniler. */
  function yEsitle(hedef, jeton) {
    if (!S.kok || !S.lider || !Y.belge) return;
    if (hedef) {
      if (Y.durak) { Y.durakYeni.push([hedef, jeton]); return; }
      yayinYaz(false);
      olayYazHam({ t: 'es', ist: jeton || '' }, hedef);
      Y.gunluk.forEach(function (o) { olayYazHam(o, hedef); });
      setTimeout(function () { Y.alanSon = {}; alanKontrol(); kayHepsi(); }, 60);
      return;
    }
    Y.durak = false; Y.durakYeni = [];
    Y.d += 1;
    yayinYaz(true);
    olayYazHam({ t: 'es' });
    Y.gunluk.forEach(function (o) { olayYazHam(o); });
    Y.alanSon = {};
    setTimeout(function () { alanKontrol(); kayHepsi(); }, 60);
  }
  /* --- duraklat / sürdür: aynı sayfada sürdürünce tahta YENİLENMEZ */
  function durakla() {
    if (!S.lider || Y.durak || !S.kok) return;
    Y.durak = true; Y.durakD = Y.d; Y.durakG = Y.gSay; Y.durakYeni = [];
    S.kok.child('yayin').update({ durak: true, ts: TS() });
  }
  function surdur() {
    if (!Y.durak) return;
    Y.durak = false;
    var yeni = Y.durakYeni; Y.durakYeni = [];
    if (!S.kok || !S.lider) return;
    if (Y.d === Y.durakD) {
      /* aynı sayfa: duraklatmada yapılanlar sırayla gider, tahta yerinde yetişir */
      yayinYaz(false);
      Y.gunluk.forEach(function (o) { if (o.g > Y.durakG) olayYazHam(o); });
      /* duraklatmadayken bağlanan tahta: sayfanın tamamı yalnız ona */
      yeni.forEach(function (h) { yEsitle(h[0], h[1]); });
      setTimeout(function () { alanKontrol(); kayHepsi(); }, 30);
    } else {
      /* başka sayfaya geçilmiş: tahta o sayfayı açar, sayfada yapılanları uygular */
      yayinYaz(true);
      olayYazHam({ t: 'es' });
      Y.gunluk.forEach(function (o) { olayYazHam(o); });
      Y.alanSon = {};
      setTimeout(function () { alanKontrol(); kayHepsi(); }, 60);
    }
  }
  /* --- doğrulama penceresi (oturum güvenliği) bilgisayarda açıkken tahta perde
     (yalnız bilgisayar kullanılıyorken: tahta kullanılıyorsa tahta kapanmaz) */
  function kgKontrol() {
    if (CIHAZ !== 'bilgisayar' || !S.kok || !S.belge) return;
    var var_ = false;
    if (S.lider) { try { var_ = !!S.belge.querySelector('.kg-perde'); } catch (e) { } }
    if (var_ !== !!Y.kgPerde) { Y.kgPerde = var_; S.kok.child('ayar').update({ kg: var_ }); }
  }

  /* ================================================ İZLEYEN (öbür cihaz) */
  var Z = {
    win: null, belge: null, d: -1, hazir: false, yayin: null, yayinId: null,
    bek: {}, sonN: null, enN: 0, kay: {}, alan: {}, cevap: [], gecikmeler: [], kendiGezdi: 0, gezilen: null,
    gezSay: { d: null, n: 0, z: 0 }, gunluk: [], esit: null, esitJeton: null, esitAkis: false, bosluk: null,
    katilma: Infinity, boslukZ: null, adresZ: null, ayrildiZ: null, sonBildirilen: null, ofsetGeldi: false
  };
  function zGecikme(z) {
    if (typeof z !== 'number' || z < Z.katilma) return;      /* bağlanmadan önceki kayıtlar ölçülmez */
    var g = sunucuZaman() - z;
    if (g < 0) g = 0;
    if (g > 60000) return;
    Z.gecikmeler.push(g);
    if (Z.gecikmeler.length > 20) Z.gecikmeler.shift();
  }
  function zOrtalama() {                                    /* ortanca: tek tük gecikme şaşırtmasın */
    if (!Z.gecikmeler.length) return null;
    var l = Z.gecikmeler.slice().sort(function (a, b) { return a - b; });
    return Math.round(l[Math.floor(l.length / 2)]);
  }
  /* Firestore yazmaları yalnız liderde: izleyende boşa çıkar (aynı işlem iki
     kez kaydedilmesin). Kontrol her yazmada yapılır: kim kullanıyorsa o kaydeder. */
  function yazmaEngelle(w) {
    try {
      var fs = w.firebase && w.firebase.firestore;
      if (!fs) return false;
      if (fs.__kidefTahta) return true;
      var sar = function (proto, ad, sahte) {
        if (!proto || typeof proto[ad] !== 'function') return;
        var asil = proto[ad];
        proto[ad] = function () { return takipte() ? sahte() : asil.apply(this, arguments); };
      };
      var bos = function () { return Promise.resolve(); };
      var ref = function () { return Promise.resolve({ id: 'tahta', path: 'tahta' }); };
      if (fs.DocumentReference) {
        sar(fs.DocumentReference.prototype, 'set', bos);
        sar(fs.DocumentReference.prototype, 'update', bos);
        sar(fs.DocumentReference.prototype, 'delete', bos);
      }
      if (fs.CollectionReference) sar(fs.CollectionReference.prototype, 'add', ref);
      if (fs.WriteBatch) sar(fs.WriteBatch.prototype, 'commit', bos);
      if (fs.Firestore) sar(fs.Firestore.prototype, 'runTransaction', bos);
      fs.__kidefTahta = true;
      return true;
    } catch (e) { return false; }
  }
  function zYeniBelge(w, d) {
    Z.win = w; Z.belge = d; Z.hazir = false; Z.gunluk = [];
    var u = adresAl(w), y = Z.yayin, s;
    if (Z.gezilen) {                                   /* bizim açtığımız sayfa */
      s = Z.gezilen.s0; Z.d = Z.gezilen.d; Z.gezilen = null;
    } else if (y && y.cevrimici && y.u === u && SIMDI() - Z.kendiGezdi < 4000) {
      s = y.s0; Z.d = y.d;                             /* tıklamayla kendisi aynı sayfaya geçti */
    } else {
      s = yeniTohum(); Z.d = -1;                       /* beklenen sayfa değil: yayın gelince düzelir */
    }
    rastgeleKur(w, s); S.s0 = s;
    baslikYaz(d);
    var bitti = false;
    var hazir = function () {
      if (bitti || Z.belge !== d) return;
      bitti = true;
      setTimeout(function () {
        if (Z.belge !== d || S.lider) return;
        Z.hazir = true;
        zIsle(); zKayUygula(); zAlanUygula();
        if (Z.yayin) zYayinUygula(Z.yayin);
      }, 260);
    };
    if (d.readyState === 'complete') hazir();
    else {
      w.addEventListener('load', hazir);
      setTimeout(hazir, 4000);                      /* resmi beklemeden */
    }
  }
  function zGezin(y) {
    var w = CERCEVE.contentWindow;
    /* sayfa kendini başka yere yönlendiriyorsa döngüye girilmez */
    if (Z.gezSay.d === y.d && SIMDI() - Z.gezSay.z < 15000) { if (++Z.gezSay.n > 3) return; }
    else Z.gezSay = { d: y.d, n: 1, z: SIMDI() };
    Z.gezilen = { d: y.d, u: y.u, s0: y.s0 };
    Z.hazir = false;
    try { if (y.dil && localStorage.getItem('kidef_dil') !== y.dil) localStorage.setItem('kidef_dil', y.dil); } catch (e) { }
    try {
      if (adresAl(w) === y.u && w.document && w.document.readyState !== 'loading') w.location.reload();
      else w.location.replace(y.u || 'index.html');
    } catch (e) { CERCEVE.src = y.u || 'index.html'; }
  }
  function zYayinUygula(y) {
    if (!y || S.lider) return;
    /* dil */
    try { if (y.dil && localStorage.getItem('kidef_dil') !== y.dil) localStorage.setItem('kidef_dil', y.dil); } catch (e) { }
    if (!y.cevrimici) return;
    if (y.d !== Z.d) {
      if (Z.gezilen && Z.gezilen.d === y.d) return;                          /* yolda */
      var simdi = adresAl(Z.win || CERCEVE.contentWindow);
      if (Z.belge && Z.d === -1 && simdi === y.u && SIMDI() - Z.kendiGezdi < 4000) { Z.d = y.d; zIsle(); return; }
      zGezin(y);
      return;
    }
    /* aynı sayfa: adres (#…) sonradan farklı kaldıysa düzelt */
    if (Z.hazir && Z.win) {
      clearTimeout(Z.adresZ);
      Z.adresZ = setTimeout(function () {
        var w = Z.win, u = adresAl(w);
        if (S.lider || !Z.yayin || Z.yayin.d !== Z.d || u === Z.yayin.u) return;
        var a = ayniSite(Z.yayin.u, w.location.href);
        if (a && a.pathname === w.location.pathname && a.search === w.location.search) {
          try { w.location.hash = a.hash; } catch (e) { }
        }
      }, 700);
    }
  }
  function zOlay(s) {
    var o = s.val();
    if (!o || typeof o.n !== 'number') return;
    if (o.n > Z.enN) Z.enN = o.n;                                 /* yeni lider sırayı buradan sürdürür */
    if (S.lider || o.i !== Z.yayinId) return;
    if (Z.sonN != null && o.n <= Z.sonN) return;
    if (o.hd && o.hd !== BEN) o = { n: o.n, d: o.d, bos: true };   /* başka cihazın eşitlemesi: yalnız sıra tutulur */
    else zGecikme(o.z);                                         /* gecikme: veritabanından geliş anında */
    Z.bek[o.n] = o;
    zIsle();
  }
  function isaretIsle(o) {                     /* eşitleme işareti (t:'es') */
    if (!o.hd) { Z.esit = null; Z.esitJeton = null; Z.esitAkis = false; return; }   /* "Eşitle": herkes baştan */
    if (o.hd !== BEN) return;
    if (Z.esitJeton && o.ist === Z.esitJeton) { Z.esit = null; Z.esitJeton = null; Z.esitAkis = true; }
    else Z.esitAkis = false;                   /* eski bir isteğin cevabı: uygulanmaz */
  }
  function zIsle() {
    if (!Z.hazir || !Z.belge || S.lider) return;
    var nler = Object.keys(Z.bek).map(Number).sort(function (a, b) { return a - b; });
    for (var i = 0; i < nler.length; i++) {
      var n = nler[i], o = Z.bek[n];
      if (o.d < Z.d) {                                              /* önceki sayfanın olayı */
        delete Z.bek[n]; if (Z.sonN == null || n > Z.sonN) Z.sonN = n;
        if (o.t === 'es') isaretIsle(o);
        continue;
      }
      if (o.d > Z.d) break;                                         /* sonraki sayfanın olayı */
      if (Z.sonN != null && n > Z.sonN + 1) {                       /* arada eksik var: kısa bekle */
        if (!Z.bosluk || Z.bosluk.n !== Z.sonN) Z.bosluk = { n: Z.sonN, z: SIMDI() };
        else if (SIMDI() - Z.bosluk.z > 900) { Z.bosluk = null; esitIste(); return; }   /* gelmedi: baştan iste */
        if (!Z.boslukZ) Z.boslukZ = setTimeout(function () { Z.boslukZ = null; zIsle(); }, 950);
        break;
      }
      delete Z.bek[n];
      Z.sonN = n; Z.bosluk = null;
      if (o.bos) continue;
      if (o.t === 'es') { isaretIsle(o); continue; }
      if (o.hd === BEN) { if (!Z.esitAkis) continue; }              /* eski bir eşitlemenin parçası */
      else if (Z.esit) continue;                                    /* bana gelecek eşitlemenin içinde */
      try { zUygula(o); } catch (e) { }
      Z.gunluk.push(o);
      if (Z.gunluk.length > GUNLUK_EN) Z.gunluk.shift();
      if (Z.belge && Z.belge.readyState === 'loading') break;       /* olay sayfayı değiştirdi */
    }
  }
  /* olay kaçırıldı (bağlantı koptu): sayfayı yeniden aç, liderden bu sayfanın geçmişini iste */
  function esitIste() {
    if (!S.kok || S.lider || !oturumVar()) return;
    var en = Z.sonN || 0;
    for (var k in Z.bek) if (has(Z.bek, k) && +k > en) en = +k;
    Z.sonN = en; Z.bek = {}; Z.bosluk = null; Z.esitAkis = false;
    Z.esit = { z: SIMDI(), tekrar: 0 };
    zGezin(S.yayin);
    varlikYaz(true);
  }
  function zTikla(w, el) {
    var r = el.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var o = { bubbles: true, cancelable: true, composed: true, view: w, clientX: x, clientY: y, button: 0, detail: 0 };
    try { el.dispatchEvent(new w.MouseEvent('click', o)); } catch (e) { try { el.click(); } catch (x2) { } }
  }
  function zTusla(w, el, o) {
    var tip = o.e === 'u' ? 'keyup' : 'keydown';
    var ev;
    try {
      ev = new w.KeyboardEvent(tip, { key: o.k, code: o.c || '', bubbles: true, cancelable: true, composed: true,
        ctrlKey: !!(o.m & 1), shiftKey: !!(o.m & 2), altKey: !!(o.m & 4), metaKey: !!(o.m & 8) });
      if (o.kc) {
        Object.defineProperty(ev, 'keyCode', { get: function () { return o.kc; } });
        Object.defineProperty(ev, 'which', { get: function () { return o.kc; } });
      }
    } catch (e) { return; }
    el.dispatchEvent(ev);
  }
  function zUygula(o) {
    var w = Z.win, d = Z.belge;
    if (!w || !d) return;
    hareketYaz();
    if (o.s != null) tohumla(w, o.s);
    if (o.t === 'k' || o.t === 'b' || o.t === 'g') Z.kendiGezdi = SIMDI();   /* sayfayı kendisi değiştirebilir */
    Z.cevap = (o.c || o.c2 || []).slice();
    if (o.t === 'k') {
      var el = yolBul(o.y, d);
      if (el) zTikla(w, el);
    } else if (o.t === 'b') {
      var h = o.y ? yolBul(o.y, d) : null;
      zTusla(w, h || d.activeElement || d.body, o);
    } else if (o.t === 'g') {
      var f = yolBul(o.y, d);
      if (f) { try { if (f.requestSubmit) f.requestSubmit(); else f.submit(); } catch (e) { } }
    } else if (o.t === 'm') {
      var m = yolBul(o.y, d);
      if (m) {
        try {
          if (Math.abs((m.currentTime || 0) - (o.zt || 0)) > 0.4) m.currentTime = o.zt || 0;
          if (o.hz) m.playbackRate = o.hz;
          if (o.e === 'play') { var p = m.play(); if (p && p.catch) p.catch(function () { }); }
          else if (o.e === 'pause') m.pause();
        } catch (e) { }
      }
    }
    Z.cevap = [];
  }
  function zBelgeKaydir(s) {
    var w = Z.win, d = Z.belge, se = d.scrollingElement || d.documentElement;
    var hedef = null;
    if (s.a) {
      var el = yolBul(s.a, d);
      if (el) {
        var r = el.getBoundingClientRect();
        if (r.height > 0) hedef = se.scrollTop + r.top + (s.o || 0) * r.height - w.innerHeight / 3;
      }
    }
    if (hedef == null) hedef = (s.f || 0) * (se.scrollHeight - w.innerHeight);
    hedef = Math.max(0, Math.round(hedef));
    if (Math.abs(se.scrollTop - hedef) < 2) return;
    try { w.scrollTo({ top: hedef, left: 0, behavior: 'instant' }); } catch (e) { se.scrollTop = hedef; }
  }
  function zKayUygula() {
    if (!Z.hazir || !Z.belge || S.lider) return;
    for (var k in Z.kay) {
      if (!has(Z.kay, k)) continue;
      var s = Z.kay[k];
      if (!s || s.d !== Z.d) continue;
      try {
        if (k === 'b') zBelgeKaydir(s);
        else {
          var el = yolBul(s.y, Z.belge);
          if (!el) continue;
          el.scrollTop = Math.round((s.f || 0) * (el.scrollHeight - el.clientHeight));
          el.scrollLeft = Math.round((s.x || 0) * (el.scrollWidth - el.clientWidth));
        }
      } catch (e) { }
    }
  }
  function zAlanUygula() {
    if (!Z.hazir || !Z.belge || S.lider) return;
    var w = Z.win;
    for (var k in Z.alan) {
      if (!has(Z.alan, k)) continue;
      var a = Z.alan[k];
      if (!a || a.d !== Z.d) continue;
      var el = yolBul(a.y, Z.belge);
      if (!el || el.value === a.v) continue;
      try {
        el.value = a.v;
        el.dispatchEvent(new w.Event('input', { bubbles: true }));
        if (el.tagName === 'SELECT' || el.type === 'range' || el.type === 'color') el.dispatchEvent(new w.Event('change', { bubbles: true }));
      } catch (e) { }
    }
  }

  /* ============================================== LİDERLİK (kim kullanıyor)
     Bilgisayar her zaman kontrolü alabilir; tahta yalnız "Tahtadan da
     kullan" açıkken, yansıtma sürüp duraklatılmamışken ve aynı sayfa
     tamamen yüklenip eşitlenmişken. */
  function dokunuldu() {
    hareketYaz();
    if (S.lider || !S.kok) return;
    if (CIHAZ === 'tahta') {
      if (!cift() || !oturumVar() || S.yayin.durak) return;
      if (!Z.hazir || !Z.belge || Z.d !== S.yayin.d || Z.esit) return;
    }
    liderOl();
  }
  function liderOl() {
    if (S.lider || !S.kok) return;
    var w = CERCEVE.contentWindow, belge = null, y = S.yayin;
    try { belge = w.document; } catch (e) { }
    var ayni = !!(belge && Z.belge === belge && y && y.cevrimici && Z.d === y.d && !Z.esit && belge.readyState !== 'loading');
    if (ayni) { Z.hazir = true; try { zIsle(); } catch (e) { } }     /* gelmiş olaylar önce uygulanır */
    S.lider = true;
    Y.win = w; Y.belge = belge;
    Y.durak = false; Y.durakYeni = []; Y.aktif = null; Y.alanSon = {}; Y.alanIz = []; Y.kayBek = {};
    Y.n = Math.max(Y.n, Z.enN);
    if (ayni) {
      Y.d = Z.d;
      Y.s0 = (y.s0 != null) ? y.s0 : S.s0;
      Y.gunluk = Z.gunluk.slice();
    } else {
      /* sayfa belli değil: yeni sayfa sayılır, öbür cihaz bu sayfayı açar */
      Y.d = Math.max(Y.d, Z.d, (y && y.d) || 0) + 1;
      Y.s0 = S.s0;
      Y.gunluk = [];
    }
    Z.esit = null; Z.esitJeton = null; Z.esitAkis = false; Z.bek = {}; Z.bosluk = null;
    clearTimeout(Z.boslukZ); Z.boslukZ = null;
    sonAdres = adresAl(w);
    kopmaKur();
    yayinYaz(!ayni);
    if (Y.belge && Y.belge.readyState !== 'loading') alanTara();
    arayuzTazele();
  }
  function liderBirak(y) {
    if (!S.lider) return;
    S.lider = false;
    Y.aktif = null; clearTimeout(Y.kayZ); Y.kayZ = null; Y.kayBek = {}; Y.durak = false; Y.durakYeni = [];
    Z.win = Y.win; Z.belge = Y.belge; Z.d = Y.d;
    Z.hazir = !!(Y.belge && Y.belge === S.belge);
    Z.gunluk = Y.gunluk.slice();
    Z.yayinId = (y && y.cevrimici) ? y.id : null; Z.sonN = null; Z.bek = {}; Z.gezilen = null;
    Z.esit = null; Z.esitJeton = null; Z.esitAkis = false; Z.bosluk = null;
    Z.gecikmeler = []; Z.katilma = sunucuZaman();
    kopmaKur();
    if (CIHAZ === 'bilgisayar' && y && y.cevrimici) {
      if (y.cihaz === 'tahta') {
        if (!S.tahtadanDendi) { S.tahtadanDendi = true; bildir(kd('th.b_tahtadan', 'Tahtadan kullanılıyor; bilgisayardan dokununca kontrol yeniden sende.'), 4500); }
      } else bildir(kd('th.b_devralindi', 'Başka bir cihaz yansıtmaya başladı. Bu cihaz durdu.'), 4500);
    }
  }

  /* ================================================= ÇERÇEVE KÖPRÜSÜ
     Her yeni sayfada, iki rolde de: kontrolü alma, tam ekran, yeni
     pencereler, uyarı ve onaylar, adres değişimi, gönderilecek olaylar,
     kayıt engeli. */
  function kopruKur(w, d) {
    /* 0) bu cihazda dokunuldu/tuşa basıldı: kontrol bu cihaza geçer (en önce) */
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (t) {
      try { w.addEventListener(t, function (e) { if (e.isTrusted) dokunuldu(); }, { capture: true, passive: true }); } catch (e) { }
    });
    if (CIHAZ === 'tahta') {
      /* 0b) tahtada ilk dokunuş tam ekrana geçirir */
      ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (t) {
        w.addEventListener(t, function (e) { if (e.isTrusted) tamEkranDene(); }, true);
      });
      /* 0c) kontrol alınamadıysa (sayfa yükleniyor, eşitleniyor) dokunuş
         sayfaya gitmesin: tahta bilgisayardan ayrı düşmesin */
      ['pointerdown', 'mousedown', 'touchstart', 'click', 'dblclick', 'contextmenu', 'keydown', 'keypress'].forEach(function (t) {
        var pasif = (t === 'touchstart' || t === 'pointerdown');
        w.addEventListener(t, function (e) {
          if (!e.isTrusted || !takipte()) return;
          e.stopImmediatePropagation();
          if (!pasif && e.cancelable) e.preventDefault();
        }, { capture: true, passive: pasif });
      });
    }
    /* 1) yeni pencere/sekme açan bağlantılar çerçevede açılsın (site dışı gerçek sekmede) */
    try {
      w.open = function (url, ad, ozellik) {
        var a = ayniSite(url || '', w.location.href);
        if (takipte()) { if (a) { Z.kendiGezdi = SIMDI(); w.location.assign(a.href); } return w; }
        if (a) { Y.gecisZ = SIMDI(); w.location.assign(a.href); return w; }
        return window.open(url, ad || '_blank', ozellik);
      };
    } catch (e) { }
    w.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var hedef = (a.getAttribute('target') || '').toLowerCase();
      if (takipte()) {
        if (hedef && hedef !== '_self') e.preventDefault();          /* izleyende yeni sekme açılmasın */
        else if (gidenBaglanti(a, w)) Z.kendiGezdi = SIMDI();
        return;
      }
      if (!hedef || hedef === '_self') return;
      var u = ayniSite(a.getAttribute('href'), w.location.href);
      if (!u) return;
      e.preventDefault();
      if (Y.aktif) Y.aktif.gecis = true;
      var ilk = SIMDI();
      setTimeout(function () { if (!(Y.gecisZ && Y.gecisZ >= ilk) && S.belge === d) w.location.assign(u.href); }, 0);
    }, true);
    /* 2) uyarı ve onay pencereleri: izleyen açmaz, liderin cevabını kullanır */
    try {
      var asilA = w.alert, asilC = w.confirm, asilP = w.prompt;
      w.alert = function () { if (takipte()) return; return asilA.apply(w, arguments); };
      w.confirm = function () {
        if (takipte()) return Z.cevap.length ? !!Z.cevap.shift() : false;
        var c = asilC.apply(w, arguments);
        if (S.lider && Y.aktif) Y.aktif.c.push(!!c);
        return c;
      };
      w.prompt = function () {
        if (takipte()) return Z.cevap.length ? Z.cevap.shift() : null;
        var c = asilP.apply(w, arguments);
        if (S.lider && Y.aktif) Y.aktif.c.push(c);
        return c;
      };
    } catch (e) { }
    /* 3) sayfa içi adres değişimi */
    ['pushState', 'replaceState'].forEach(function (ad) {
      try {
        var asil = w.history[ad];
        w.history[ad] = function () { var r = asil.apply(w.history, arguments); setTimeout(adresKontrol, 0); return r; };
      } catch (e) { }
    });
    w.addEventListener('hashchange', adresKontrol);
    w.addEventListener('popstate', adresKontrol);
    /* 4) olaylar — pencereye, yakalama evresinde: sayfanın kendi dinleyicilerinden önce */
    w.addEventListener('click', yTik, true);
    w.addEventListener('keydown', yTus, true);
    w.addEventListener('keyup', yTus, true);
    w.addEventListener('input', yAlanOlay, true);
    w.addEventListener('change', yAlanOlay, true);
    w.addEventListener('submit', yGonder, true);
    w.addEventListener('scroll', yKay, true);
    ['play', 'pause', 'seeked', 'ratechange'].forEach(function (t) { w.addEventListener(t, yMedya, true); });
    /* 5) kayıt yalnız liderde */
    var bitis = SIMDI() + 20000;
    (function engelle() {
      if (S.belge !== d) return;
      if (yazmaEngelle(w)) return;
      if (SIMDI() < bitis) setTimeout(engelle, 30);
    })();
    /* 6) tahtada ziyaretçi turu (vitrin), dil önerisi gibi bir kerelik pencereler çıkmasın */
    if (CIHAZ === 'tahta') {
      try {
        if (!localStorage.getItem('kidefVitrinSayac')) localStorage.setItem('kidefVitrinSayac', '9');
        if (localStorage.getItem('kidef_dil_oneri') !== 'yok') localStorage.setItem('kidef_dil_oneri', 'yok');
      } catch (e) { }
    }
  }
  /* çerçevede yeni sayfa açıldı mı — mümkün olan en erken anda */
  function belgeDenetle() {
    var w, d;
    try { w = CERCEVE.contentWindow; d = w.document; } catch (e) { return; }
    if (!d || d === S.belge) return;
    try { if (!w.location || w.location.href === 'about:blank') return; } catch (e) { return; }
    S.belge = d;
    kopruKur(w, d);
    if (S.lider) yYeniBelge(w, d); else zYeniBelge(w, d);
  }
  function belgeIzle() {
    if (belgeIzle.kuruldu) return;
    belgeIzle.kuruldu = true;
    belgeDenetle();
    setInterval(belgeDenetle, 20);
    setInterval(function () { if (S.lider) { alanKontrol(); adresKontrol(); } kgKontrol(); }, 250);
    setInterval(nobet, 1000);
    window.addEventListener('storage', function (e) {      /* başka sekmede dil değişirse */
      if (e && e.key === 'kidef_dil' && yayinda()) S.kok.child('yayin').update({ dil: e.newValue || 'tr' });
    });
  }
  /* saniyede bir: istenen eşitleme gelmediyse bir kez daha iste */
  function nobet() {
    if (!Z.esit) return;
    if (S.lider || !oturumVar()) { Z.esit = null; Z.esitJeton = null; return; }
    if (S.yayin.durak) { Z.esit.z = SIMDI(); return; }          /* duraklatılmışken beklenir */
    if (SIMDI() - Z.esit.z < 6000) return;
    if (Z.esit.tekrar < 1) { Z.esit.tekrar += 1; Z.esit.z = SIMDI(); varlikYaz(true); }
    else { Z.esit = null; Z.esitJeton = null; zIsle(); }
  }

  /* ======================================================== ARAYÜZLER */
  /* bilgisayar: üst şerit */
  function kipYaz(k) {
    S.ayar.kip = k;
    try { localStorage.setItem('kidef_tahta_kip', k); } catch (e) { }
    if (S.kok) S.kok.child('ayar').update({ kip: k });
    arayuzTazele();
  }
  function cubukKur() {
    var c = $('thCubuk');
    c.innerHTML =
      '<span class="th-isim"><span class="th-nokta bekle" id="thNokta"></span><span id="thBaslik">' + kac(kd('th.yansitiliyor', 'Tahtaya yansıtılıyor')) + '</span></span>' +
      '<span class="th-cip" id="thCip">' + kac(kd('th.tahta_bekleniyor', 'Tahta bekleniyor…')) + '</span>' +
      '<span class="th-bos"></span>' +
      '<button type="button" class="th-dug th-kip" id="thKipDug" aria-pressed="false" title="' + kac(kd('th.kip_ip', 'Açıkken tahtaya dokunarak da kullanabilirsin; kapalıyken tahta yalnız bilgisayarı gösterir')) + '">' + SVG.dokun + '<span>' + kac(kd('th.kip', 'Tahtadan da kullan')) + '</span></button>' +
      '<button type="button" class="th-dug" id="thPerdeDug" aria-pressed="false" title="' + kac(kd('th.perde_ip', 'Tahtayı karart (öğrenciler ekranı görmesin)')) + '">' + SVG.perde + '<span>' + kac(kd('th.perde', 'Perde')) + '</span></button>' +
      '<button type="button" class="th-dug" id="thDurakDug" aria-pressed="false" title="' + kac(kd('th.durak_ip', 'Tahta son görüntüde dursun; sen burada serbestçe gez')) + '"></button>' +
      '<button type="button" class="th-dug" id="thEsitleDug" title="' + kac(kd('th.esitle_ip', 'Tahtadaki sayfayı bu ekranla yeniden eşitle')) + '">' + SVG.esitle + '<span>' + kac(kd('th.esitle', 'Eşitle')) + '</span></button>' +
      '<button type="button" class="th-dug kirmizi" id="thBitirDug" title="' + kac(kd('th.bitir_ip', 'Yansıtmayı bitir, bu sayfada kal')) + '">' + SVG.bitir + '<span>' + kac(kd('th.bitir', 'Bitir')) + '</span></button>';
    c.hidden = false;
    $('thDurakDug').dataset.durum = '';
    $('thKipDug').addEventListener('click', function () {
      var yeni = cift() ? 'tek' : 'cift';
      kipYaz(yeni);
      if (yeni === 'tek') liderOl();                 /* tahta yalnız göstersin: kontrol bilgisayarda */
      bildir(yeni === 'cift' ? kd('th.b_kip_cift', 'Artık tahtaya dokunarak da kullanabilirsin.')
                             : kd('th.yalniz_gosterir', 'Tahta şu an bilgisayarı gösteriyor; dokununca bir şey değişmez.'));
    });
    $('thPerdeDug').addEventListener('click', function () {
      var p = !S.ayar.perde;
      S.ayar.perde = p;
      if (S.kok) S.kok.child('ayar').update({ perde: p });
      arayuzTazele();
      bildir(p ? kd('th.b_perde_acik', 'Tahta karartıldı.') : kd('th.b_perde_kapali', 'Tahta yeniden görünüyor.'));
    });
    $('thDurakDug').addEventListener('click', function () {
      if (!S.lider) liderOl();
      if (!Y.durak) { durakla(); bildir(kd('th.b_durak', 'Duraklatıldı: tahta son görüntüde bekliyor.')); }
      else { surdur(); bildir(kd('th.b_devam', 'Sürdürüldü: tahta bu ekrana eşitlendi.')); }
      arayuzTazele();
    });
    $('thEsitleDug').addEventListener('click', function () {
      if (!S.lider) liderOl();
      yEsitle(); bildir(kd('th.b_esitle', 'Tahta bu ekrana eşitleniyor…'));
      arayuzTazele();
    });
    $('thBitirDug').addEventListener('click', function () { cik(adresAl(CERCEVE.contentWindow) || 'index.html'); });
    arayuzTazele();
  }
  function cubukTazele() {
    var k = $('thKipDug'), p = $('thPerdeDug'), d = $('thDurakDug');
    if (k) k.setAttribute('aria-pressed', cift() ? 'true' : 'false');
    if (p) p.setAttribute('aria-pressed', S.ayar.perde ? 'true' : 'false');
    if (d) {
      var durum = Y.durak ? 'durak' : 'devam';
      if (d.dataset.durum !== durum) {
        d.dataset.durum = durum;
        d.setAttribute('aria-pressed', Y.durak ? 'true' : 'false');
        d.innerHTML = (Y.durak ? SVG.devam : SVG.durak) + '<span>' + kac(Y.durak ? kd('th.devam', 'Sürdür') : kd('th.durak', 'Duraklat')) + '</span>';
      }
    }
  }
  function durumYaz() {
    var nokta = $('thNokta'), cip = $('thCip');
    if (!nokta || !cip) return;
    var tahtalar = [], g = null;
    for (var k in S.izle) {
      if (!has(S.izle, k)) continue;
      var t = S.izle[k];
      if (t && t.cevrimici && t.cihaz !== 'bilgisayar') { tahtalar.push(t); if (typeof t.gecikme === 'number') g = (g == null) ? t.gecikme : Math.max(g, t.gecikme); }
    }
    var sinif = 'bekle', yazi;
    if (!S.baglanti) { sinif = 'hata'; yazi = kd('th.baglanti_yok', 'İnternet bağlantısı yok'); }
    else if (!S.lider && oturumVar()) {
      sinif = 'canli';
      if (S.yayin.cihaz === 'tahta') {
        yazi = kd('th.tahtadan', 'Tahtadan kullanılıyor');
        var zg = zOrtalama();
        if (zg != null) yazi += ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, zg) });
      } else {
        sinif = 'hata';
        yazi = kd('th.devralindi', 'Başka bir cihaz yansıtıyor — Eşitle’ye basarak geri al');
      }
    }
    else if (!tahtalar.length) { yazi = kd('th.tahta_bekleniyor', 'Tahta bekleniyor…'); }
    else {
      sinif = Y.durak ? 'bekle' : 'canli';
      yazi = tahtalar.length > 1 ? kd('th.tahta_cok', '{n} tahta bağlı', { n: tahtalar.length }) : kd('th.tahta_bagli', 'Tahta bağlı');
      if (g != null) yazi += ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, Math.round(g)) });
      if (Y.durak) yazi += ' · ' + kd('th.duraklatildi', 'duraklatıldı');
    }
    nokta.className = 'th-nokta ' + sinif;
    cip.textContent = yazi;
    $('thBaslik').textContent = Y.durak ? kd('th.duraklatildi_bas', 'Yansıtma duraklatıldı') : kd('th.yansitiliyor', 'Tahtaya yansıtılıyor');
  }
  /* tahta: durum noktası, dokunulunca açılan pencere, koruma ve perde */
  function zDurumKur() {
    var d = $('thDurum');
    d.innerHTML = '<div class="th-pencere" id="thPencere" hidden></div><span class="th-nokta bekle" id="thNokta" role="button" tabindex="0"></span>';
    d.hidden = false;
    $('thNokta').addEventListener('click', zPencere);
    $('thKoruma').addEventListener('pointerdown', function (e) { e.preventDefault(); zPencere(); });
    $('thKoruma').addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
  }
  var pencereZ = null;
  function zPencere() {
    var p = $('thPencere'), g = zOrtalama(), y = S.yayin;
    var durum = S.lider ? kd('th.tahtadan', 'Tahtadan kullanılıyor') + '.'
      : (!y || !y.cevrimici ? kd('th.bilgisayar_yok', 'Bilgisayar bağlı değil.')
        : (y.durak ? kd('th.bilgisayar_durak', 'Bilgisayar yansıtmayı duraklattı.')
          : kd('th.bilgisayar_bagli', 'Bilgisayar bağlı') + (g != null ? ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, g) }) : '') + '.'));
    var kip = cift() ? kd('th.cift_metin', 'Tahtaya dokunarak da kullanabilirsin; bilgisayar da aynısını gösterir.')
                     : kd('th.yalniz_gosterir', 'Tahta şu an bilgisayarı gösteriyor; dokununca bir şey değişmez.');
    p.innerHTML = '<p>' + kac(durum) + '</p><p style="opacity:.8;font-weight:500">' + kac(kip) + '</p>' +
      '<div class="th-tuslar"><button type="button" class="th-dug" data-th="tam">' + SVG.tam + '<span>' + kac(kd('th.tam_ekran', 'Tam ekran')) + '</span></button>' +
      '<button type="button" class="th-dug kirmizi" data-th="cik">' + SVG.bitir + '<span>' + kac(kd('th.cik', 'Çık')) + '</span></button></div>';
    p.hidden = false;
    clearTimeout(pencereZ);
    pencereZ = setTimeout(function () { p.hidden = true; }, 6000);
  }
  function zNoktaYaz() {
    var n = $('thNokta');
    if (!n) return;
    var y = S.yayin, sinif = 'bekle';
    if (!S.baglanti) sinif = 'hata';
    else if (y && y.cevrimici && !y.durak) sinif = 'canli';
    n.className = 'th-nokta ' + sinif;
    var g = zOrtalama();
    n.title = S.lider ? kd('th.tahtadan', 'Tahtadan kullanılıyor')
      : (y && y.cevrimici ? kd('th.bilgisayar_bagli', 'Bilgisayar bağlı') : kd('th.bilgisayar_yok', 'Bilgisayar bağlı değil.')) +
        (g != null ? ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, g) }) : '');
  }
  function zSerit(m) {
    var s = $('thSerit');
    if (!s) { s = document.createElement('div'); s.id = 'thSerit'; s.className = 'th-serit'; document.body.appendChild(s); }
    if (!m) { s.hidden = true; return; }
    s.textContent = m; s.hidden = false;
  }
  function zArayuz() {
    var os = oturumVar();
    /* dokunmayı engelleyen katman: yalnız göster kipinde ya da duraklatılmışken */
    var koruma = !cift() || (os && !!S.yayin.durak);
    var kr = $('thKoruma');
    if (kr && kr.hidden === koruma) kr.hidden = !koruma;
    var p = !!(os && (S.ayar.perde || S.ayar.kg));
    var pe = $('thPerde');
    if (pe && pe.hidden === p) pe.hidden = !p;
    zNoktaYaz();
  }
  function zOturumGoster(y) {
    clearTimeout(Z.ayrildiZ);
    if (y && y.cevrimici) {
      bekleGoster(null);
      zSerit(y.durak ? kd('th.serit_durak', 'Öğretmen yansıtmayı duraklattı') : null);
    } else if (Z.belge) {
      if (cift()) zSerit(null);
      /* kısa bağlantı kopmalarında bir şey gösterilmez: 8 sn bekle */
      Z.ayrildiZ = setTimeout(function () {
        if (oturumVar()) return;
        if (cift()) bildir(kd('th.bilgisayar_yok', 'Bilgisayar bağlı değil.'), 4000);   /* tahta kendi başına kullanılabilir */
        else zSerit(kd('th.serit_ayrildi', 'Bilgisayar ayrıldı — son görüntü'));
      }, 8000);
    } else {
      bekleGoster('izle');
    }
  }
  function arayuzTazele() {
    if (CIHAZ === 'bilgisayar') { durumYaz(); cubukTazele(); }
    else zArayuz();
  }

  /* ======================================================== DİNLEYİCİLER */
  function yayinGeldi(s) {
    var y = s.val(), once = S.yayin;
    S.yayin = y; Z.yayin = y;
    var liderId = (y && y.cevrimici) ? y.id : null;
    if (S.lider && liderId !== BEN) {
      if (CIHAZ === 'bilgisayar' && !liderId && S.kok) {
        /* bağlantı koptu-geri geldi: yansıtma bu bilgisayarda, kaldığı yerden sürer */
        if (Y.durak) S.kok.child('yayin').update({ cevrimici: true, id: BEN, ts: TS() }); else yayinYaz(false);
        arayuzTazele();
        return;
      }
      liderBirak(y);
    }
    if (!S.lider && CIHAZ === 'bilgisayar' && !liderId && S.kok) {
      liderOl();                                 /* tahta kullanılırken bağlantısı koptu ya da çıktı: kontrol bilgisayara */
      return;
    }
    if (!S.lider) {
      if (y && y.cevrimici && y.id !== Z.yayinId) {
        Z.yayinId = y.id; Z.sonN = null; Z.bek = {}; Z.bosluk = null;
        if (Z.esit) varlikYaz(true);             /* eşitleme beklerken lider değişti: yeni liderden iste */
      }
      if (CIHAZ === 'tahta') zOturumGoster(y);
      zYayinUygula(y);
    }
    if (CIHAZ === 'tahta' && y && y.cevrimici && !(once && once.cevrimici)) { TAM.istek = true; tamEkranDene(); ipucuGoster(); }
    arayuzTazele();
  }
  function izleGeldi(s) {
    var v = s.val() || {}, istek = [], yeniTahta = false;
    for (var k in v) {
      if (!has(v, k) || k === BEN) continue;
      var t = v[k];
      if (!t) continue;
      if (t.iste && t.iste !== S.isteGoruldu[k]) {
        S.isteGoruldu[k] = t.iste;
        /* eski istekler (önceki yansıtmadan kalan) karşılanmaz */
        if (typeof t.isteZ === 'number' && sunucuZaman() - t.isteZ < 15000) istek.push([k, t.iste]);
      }
      if (t.cevrimici && t.cihaz !== 'bilgisayar' && !(S.izle[k] && S.izle[k].cevrimici)) yeniTahta = true;
    }
    S.izle = v;
    if (S.lider) istek.forEach(function (h) { yEsitle(h[0], h[1]); });     /* yalnız isteyene */
    if (yeniTahta && S.lider && CIHAZ === 'bilgisayar') bildir(kd('th.b_tahta_geldi', 'Tahta bağlandı.'));
    arayuzTazele();
  }
  function ortakDinle(kok) {
    kok.child('olay').on('child_added', zOlay);
    kok.child('olay').on('child_changed', zOlay);
    kok.child('yayin').on('value', yayinGeldi);
    kok.child('kay').on('value', function (s) {
      Z.kay = s.val() || {};
      if (S.lider) return;
      zKayUygula();
      var b = Z.kay.b; if (b) zGecikme(b.z);
      hareketYaz();
    });
    kok.child('alan').on('value', function (s) { Z.alan = s.val() || {}; if (!S.lider) zAlanUygula(); });
    kok.child('ayar').on('value', function (s) {
      var v = s.val() || {};
      S.ayar = { kip: v.kip === 'tek' ? 'tek' : 'cift', perde: !!v.perde, kg: !!v.kg };
      arayuzTazele();
    });
    kok.child('izle').on('value', izleGeldi);
  }

  /* ======================================================= BAŞLATMA */
  function yansitBasla(kok) {
    if (S.kok) return;
    S.kok = kok; S.lider = true;
    stilKur(); bekleGoster(null);
    document.body.classList.add('th-yansit');
    var kip = 'cift';
    try { if (localStorage.getItem('kidef_tahta_kip') === 'tek') kip = 'tek'; } catch (e) { }
    S.ayar = { kip: kip, perde: false, kg: false };
    /* yeni yansıtma: önceki oturumdan kalan lider (varsa) bırakır */
    kok.update({ 'yayin/id': BEN, 'yayin/cihaz': CIHAZ, 'yayin/cevrimici': false, 'yayin/durak': false, 'yayin/ts': TS(),
                 'ayar': { kip: kip, perde: false, kg: false } });
    cubukKur();
    kopmaKur();
    belgeIzle();
    if (Y.belge) {                                 /* sayfa giriş beklenirken açıldı: şimdi yayınla */
      yayinYaz(true);
      Y.gunluk.forEach(function (o) { olayYazHam(o); });
      setTimeout(function () { alanKontrol(); kayHepsi(); }, 60);
    }
    ortakDinle(kok);
    try {
      vt.ref('.info/connected').on('value', function (s) {
        S.baglanti = !!s.val();
        if (S.baglanti && S.kok) {
          kopmaKur();
          if (S.lider) { if (Y.durak) S.kok.child('yayin').update({ cevrimici: true, ts: TS() }); else yayinYaz(false); }
          else if (!oturumVar()) liderOl();
          else if (Z.esit) varlikYaz(true);
        }
        arayuzTazele();
      });
    } catch (e) { }
  }
  function izleBasla(kok) {
    if (S.kok) return;
    S.kok = kok;
    Z.katilma = sunucuZaman() + 300;
    stilKur();
    document.body.classList.add('th-izle');
    $('thPerde').innerHTML = '<b>Kidef Arapça</b><span>' + kac(kd('th.perde_metin', 'Ekran kısa bir süre kapalı')) + '</span>';
    zDurumKur();
    bekleGoster('izle');
    zArayuz();
    belgeIzle();
    tamEkranDene();
    /* OTURUM: yansıtma sürdükçe tahta "boşta" sayılmaz (bilgisayar ayrılınca
       tahtanın kendi sayacı yine işler — unutulan tahta kapanır). */
    setInterval(function () { if (S.kok && oturumVar()) hareketYaz(); }, 30000);
    /* gecikmeyi bilgisayara bildir (seyrek) */
    setInterval(function () {
      if (!S.kok) return;
      var g = zOrtalama();
      if (g != null && g !== Z.sonBildirilen && !S.lider) { Z.sonBildirilen = g; S.kok.child('izle/' + BEN).update({ gecikme: g, ts: TS() }); }
      zNoktaYaz();
    }, 2500);
    /* önce yuvalardaki eski olaylar: uygulanmaz. Yansıtma sürüyorsa tahta
       liderden bu sayfanın geçmişini ister; istek ANCAK dinleyiciler
       kurulduktan sonra yazılır, cevap kaçmasın. */
    kok.child('olay').once('value', function (s) {
      var v = s.val() || {};
      kok.child('yayin').once('value', function (ys) {
        var yy = ys.val(), en = null;
        for (var k in v) {
          if (!has(v, k)) continue;
          var o = v[k];
          if (!o || typeof o.n !== 'number') continue;
          if (o.n > Z.enN) Z.enN = o.n;
          if (yy && o.i === yy.id && (en == null || o.n > en)) en = o.n;
        }
        Z.sonN = en;
        Z.yayinId = yy ? yy.id : null;
        if (yy && yy.cevrimici) Z.esit = { z: SIMDI(), tekrar: 0 };
        ortakDinle(kok);
        S.baglanti = true;
        try {
          vt.ref('.info/connected').on('value', function (s2) {
            S.baglanti = !!s2.val();
            if (S.baglanti && S.kok) { varlikYaz(!!Z.esit); kopmaKur(); }
            arayuzTazele();
          });
        } catch (e) { varlikYaz(!!Z.esit); }
      });
    });
  }

  /* --------------------------------------------------------- başlangıç */
  function basla() {
    /* kabuk başka bir çerçevenin içinde açıldıysa (kabuk içinde kabuk) çalışma */
    var icte = false;
    try { icte = window.top !== window.self; } catch (e) { icte = true; }
    if (icte) { try { location.replace('index.html'); } catch (e) { } return; }
    stilKur();
    if (ROL === 'yansit') {
      var m = /[?&]sayfa=([^&#]*)/.exec(location.search);
      var hedef = 'index.html';
      if (m) { try { var a = ayniSite(decodeURIComponent(m[1])); if (a && !/\/tahta\.html$/.test(a.pathname)) hedef = a.pathname + a.search + a.hash; } catch (e) { } }
      /* bilgisayar baştan lider: ilk sayfanın tohumu ve köprüsü giriş beklenmeden kurulur */
      S.lider = true;
      CERCEVE.src = hedef;
      belgeIzle();
      baglan(yansitBasla);
    } else {
      try { localStorage.setItem('kidef_tahta_cihaz', 'tahta'); } catch (e) { }
      /* tahtada "Ana ekrana ekle / Uygulamayı yükle": her açılışta tam ekran
         açılan uygulama (bilgisayarda yükleme önerisi çıkmasın diye yalnız burada) */
      try {
        if (!document.querySelector('link[rel="manifest"]')) {
          var mf = document.createElement('link');
          mf.rel = 'manifest'; mf.href = 'tahta.webmanifest';
          document.head.appendChild(mf);
        }
      } catch (e) { }
      /* kabuktaki her dokunuş (koruma katmanı, nokta, bekleme ekranı) tam ekrana geçirir */
      ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (t) {
        document.addEventListener(t, function (e) { if (e.isTrusted) tamEkranDene(); }, true);
      });
      baglan(izleBasla);
    }
    document.addEventListener('kidef:dil', function () {
      if (ROL === 'yansit' && $('thCubuk') && !$('thCubuk').hidden && S.kok) cubukKur();
      if (ROL === 'izle' && !$('thBekle').hidden && !oturumVar()) bekleGoster('izle');
      var ip = $('thIpucu');
      if (ip && !ip.hidden) ipucuGoster();
    });
  }
  window.KidefTahta = {
    rol: ROL, cihaz: CIHAZ, id: BEN, S: S, Y: Y, Z: Z, yolAl: yolAl, yolBul: yolBul, VT_ADRES: VT_ADRES,
    liderOl: liderOl, lider: function () { return S.lider; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
