/* =====================================================================
   KIDEF · DİL KATMANI                                  sistem/dil.js
   ---------------------------------------------------------------------
   Öğretmen (15.10.2026): "en önemli 20 dil için sitenin farklı dillerde
   kullanılmasını istiyorum; öğrenci ve öğretmenler profil kısmından dil
   seçebilsinler ... tercüme yaparken o dilde kullanımlara dikkat et,
   moda mod çevirmek yerine kullanıma önem ver ... Irak'taki Kürtçeleri
   Arap harfleriyle de seçenek olarak ekleyelim ... diller seçilirken
   bayrakları da olsun."
   Kararlar (sorulup onaylandı): 20 dil + Türkçe taban · arabirim YÖNÜ
   değişmez, yalnız yazılar çevrilir · seçici hem profilde hem başlıkta.

   NASIL ÇALIŞIR
     1. Çevrilecek her yazı HTML'de işaretlenir:
            <span data-i18n="blm.oyunlar">Oyunlar</span>
            <a data-i18n-title="bas.paketler" title="Paketler">
            <input data-i18n-ph="ara.kelime" placeholder="Kelime ara">
        Türkçesi İLK GÖRÜŞTE data-i18n-tr'ye saklanır; Türkçeye dönünce
        oradan geri yazılır. Yani Türkçe sözlük dosyası GEREKMEZ.
     2. Sözlükler dil/<kod>.js dosyalarında:
            window.KIDEF_DIL = window.KIDEF_DIL || {};
            KIDEF_DIL.en = { "blm.oyunlar": "Games", ... };
        Yalnız seçilen dilin dosyası, o dil seçildiğinde indirilir.
     3. Karşılığı olmayan anahtar Türkçe kalır — yarım çeviri sayfayı
        bozmaz, eksikler zamanla tamamlanır.
     4. Sonradan basılan kartlar/paneller de çevrilsin diye gövde
        izleniyor (MutationObserver, 150 ms gecikmeli).

   SEÇİM NEREDE DURUR
     · localStorage 'kidef_dil' — herkeste.
     · Giriş yapan öğretmen/öğrencide ayrıca kullanicilar/{uid}.dil
       alanında; cihaz değişse de aynı dil gelir (sinifveri.js'teki
       kitap seçimiyle aynı yöntem).

   BAYRAKLAR emoji DEĞİL, SVG: Windows'ta (akıllı tahtalarda) emoji
   bayraklar "TR" gibi iki harf olarak çıkıyor.
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefDil) return;

  var ANAHTAR = 'kidef_dil';
  /* HIZLI DEĞİŞTİRME (15.10.2026) — ONCEKI: son kullanılan öteki dil
     (tek dokunuşla geçiş için). ONERI: tarayıcı dili önerisi
     kapatıldıysa bir daha sorulmasın. */
  var ONCEKI = 'kidef_dil_onceki';
  var ONERI = 'kidef_dil_oneri';

  /* KÖK (15.10.2026) — dil.js artık sitenin HER sayfasında çalışıyor.
     Sözlükler kökteki dil/ klasöründe; alt klasördeki sayfalarda doğru
     adrese gitmek için kök, dil.js'in kendi <script src>'inden
     çıkarılıyor: "../sistem/dil.js" → "../dil/". */
  function kokBul() {
    var s = document.currentScript, l, i, y;
    if (!s) {
      l = document.getElementsByTagName('script');
      for (i = l.length - 1; i >= 0; i--) {
        if (/(^|\/)sistem\/dil\.js(\?|$)/.test(l[i].getAttribute('src') || '')) { s = l[i]; break; }
      }
    }
    y = (s && s.getAttribute('src')) || 'sistem/dil.js';
    return y.replace(/sistem\/dil\.js.*$/, '');
  }
  var KOK = kokBul();
  var KLASOR = KOK + 'dil/';

  /* RUSÇA HARFLER (16.10.2026) — Arakom'da Kiril harf yok; Rusça yazılar
     düz yazı tipine düşüp Arakom'dan gelen rakam/noktalamayla
     karışıyordu. 'Arakom' ailesine EB Garamond'un Kiril parçası eklenir
     (kökteki ebgaramond-kiril.woff2 · OFL lisanslı, Arakom'un taban çizgisine
     oturtuldu). unicode-range: dosya yalnız sayfada Kiril harf varsa
     iner. Kendi yazı tipi tanımı olan sayfalarda (oyunlar) da geçerli. */
  (function kirilParca() {
    try {
      if (document.getElementById('kd-kiril')) return;
      var u = KOK + 'ebgaramond-kiril.woff2?v=6113156f', css = '';
      ['Arakom', 'arakom'].forEach(function (a) {
        css += "@font-face{font-family:'" + a + "';src:url('" + u + "') format('woff2');" +
               "font-display:swap;unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}";
      });
      var st = document.createElement('style');
      st.id = 'kd-kiril';
      st.textContent = css;
      (document.head || document.documentElement).appendChild(st);
    } catch (e) { }
  })();
  /* SÖZLÜK SÜRÜMLERİ (15.10.2026) — surumle.py her gönderimde
     dil/*.js dosyalarının içeriğinden hesaplayıp aşağıdaki satırı
     yeniler; ELLE DÜZENLENMEZ. Yeni çeviri yüklenince tarayıcı
     önbellekteki eski sözlüğü açmıyor. */
  var SURUM = {/* @dil-surum */'ar':'152c2615','az':'4a821e3b','bn':'ac3ad9ba','bs':'311bd799','ckb':'734a2da8','de':'1db641df','en':'5d675388','es':'035a4db4','fa':'19e82a00','fr':'cca271eb','hi':'915a15c3','id':'6c9a755c','kmr-arab':'1dfb5dda','ms':'c92bcf41','ps':'e6a82be4','ru':'d64d280a','sq':'b9922323','ur':'9c1ecfa2','uz':'d323827f','zh':'0e191214'};
  var EV = 'kidef:dil';

  /* --------------------------------------------------------- diller
     ad    : dilin KENDİ adı (seçicide böyle görünür — aranan şey budur)
     tr    : Türkçe adı (ipucunda)
     yon   : 'rtl' olanlarda yalnız metnin kendi yönü; sayfa düzeni
             değişmiyor (öğretmenin kararı).
     hazir : sözlük dosyası yayında mı */
  var DILLER = [
    { kod: 'tr',      ad: 'Türkçe',           tr: 'Türkçe',            hazir: true  },
    { kod: 'en',      ad: 'English',          tr: 'İngilizce',         hazir: true  },
    { kod: 'ar',      ad: 'العربية',           tr: 'Arapça',            yon: 'rtl'   , hazir: true },
    { kod: 'fa',      ad: 'فارسی',             tr: 'Farsça',            yon: 'rtl'   , hazir: true },
    { kod: 'ur',      ad: 'اردو',              tr: 'Urduca',            yon: 'rtl'   , hazir: true },
    { kod: 'ps',      ad: 'پښتو',              tr: 'Peştuca',           yon: 'rtl'   , hazir: true },
    { kod: 'ckb',     ad: 'کوردیی سۆرانی',      tr: 'Soranice (Arap harfli)', yon: 'rtl' , hazir: true },
    { kod: 'kmr-arab', ad: 'کوردیی بادینی',     tr: 'Badinice (Arap harfli)', yon: 'rtl' , hazir: true },
    { kod: 'id',      ad: 'Bahasa Indonesia', tr: 'Endonezce'          , hazir: true },
    { kod: 'ms',      ad: 'Bahasa Melayu',    tr: 'Malayca'            , hazir: true },
    { kod: 'bn',      ad: 'বাংলা',              tr: 'Bengalce'           , hazir: true },
    { kod: 'hi',      ad: 'हिन्दी',               tr: 'Hintçe'             , hazir: true },
    { kod: 'zh',      ad: '中文',              tr: 'Çince'              , hazir: true },
    { kod: 'ru',      ad: 'Русский',          tr: 'Rusça'              , hazir: true },
    { kod: 'fr',      ad: 'Français',         tr: 'Fransızca'          , hazir: true },
    { kod: 'de',      ad: 'Deutsch',          tr: 'Almanca'            , hazir: true },
    { kod: 'es',      ad: 'Español',          tr: 'İspanyolca'         , hazir: true },
    { kod: 'az',      ad: 'Azərbaycan dili',  tr: 'Azerice'            , hazir: true },
    { kod: 'uz',      ad: "O'zbekcha",        tr: 'Özbekçe'            , hazir: true },
    { kod: 'sq',      ad: 'Shqip',            tr: 'Arnavutça'          , hazir: true },
    { kod: 'bs',      ad: 'Bosanski',         tr: 'Boşnakça'           , hazir: true }
  ];

  /* ------------------------------------------------------- bayraklar
     24x16 kutuda sade çizimler; ayrıntı değil TANINIRLIK aranıyor. */
  var B = {};
  function bay(kod, ic) { B[kod] = ic; }
  bay('tr', '<rect width="24" height="16" fill="#E30A17"/><circle cx="9" cy="8" r="4" fill="#fff"/>' +
            '<circle cx="10.4" cy="8" r="3.2" fill="#E30A17"/>' +
            '<path d="M14.2 5.9 l.75 2.1 2.15.1 -1.7 1.35 .6 2.1 -1.8 -1.2 -1.8 1.2 .6 -2.1 -1.7 -1.35 2.15 -.1z" fill="#fff"/>');
  bay('en', '<rect width="24" height="16" fill="#012169"/>' +
            '<path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" stroke-width="3.2"/>' +
            '<path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" stroke-width="1.8"/>' +
            '<path d="M12 0 v16 M0 8 h24" stroke="#fff" stroke-width="5"/>' +
            '<path d="M12 0 v16 M0 8 h24" stroke="#C8102E" stroke-width="3"/>');
  bay('ar', '<rect width="24" height="16" fill="#006C35"/>' +
            '<rect x="4" y="5.4" width="16" height="1.5" rx=".7" fill="#fff"/>' +
            '<rect x="4" y="8.2" width="12" height="1.1" rx=".5" fill="#fff"/>' +
            '<path d="M4 11.6 h15 l-2 1.2" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>');
  bay('fa', '<rect width="24" height="16" fill="#fff"/><rect width="24" height="5.33" fill="#239F40"/>' +
            '<rect y="10.67" width="24" height="5.33" fill="#DA0000"/>' +
            '<path d="M12 6.4 c1.6 0 2.4 1 2.4 2.1 c0 1-.8 1.9-2.4 1.9 c-1.6 0-2.4-.9-2.4-1.9 c0-1.1.8-2.1 2.4-2.1z" fill="#DA0000"/>');
  bay('ur', '<rect width="24" height="16" fill="#01411C"/><rect width="6" height="16" fill="#fff"/>' +
            '<circle cx="15" cy="8" r="4" fill="#fff"/><circle cx="16.6" cy="7.4" r="3.4" fill="#01411C"/>' +
            '<path d="M18.6 5.4 l.5 1.4 1.45.07 -1.15.9 .4 1.4 -1.2-.8 -1.2.8 .4-1.4 -1.15-.9 1.45-.07z" fill="#fff"/>');
  bay('ps', '<rect width="8" height="16" fill="#000"/><rect x="8" width="8" height="16" fill="#D32011"/>' +
            '<rect x="16" width="8" height="16" fill="#007A36"/>' +
            '<circle cx="12" cy="8" r="3.4" fill="none" stroke="#fff" stroke-width="1.1"/>' +
            '<rect x="10.4" y="6.6" width="3.2" height="2.8" rx=".6" fill="#fff"/>');
  var KURT = '<rect width="24" height="16" fill="#fff"/><rect width="24" height="5.33" fill="#ED2024"/>' +
             '<rect y="10.67" width="24" height="5.33" fill="#278E43"/>' +
             '<circle cx="12" cy="8" r="2.6" fill="#FEBD11"/>' +
             '<g stroke="#FEBD11" stroke-width="1" stroke-linecap="round">' +
             '<path d="M12 3.4 v1.2 M12 11.4 v1.2 M7.4 8 h1.2 M15.4 8 h1.2"/>' +
             '<path d="M8.6 4.6 l.9.9 M14.5 10.5 l.9.9 M15.4 4.6 l-.9.9 M9.5 10.5 l-.9.9"/></g>';
  bay('ckb', KURT);
  bay('kmr-arab', KURT);
  bay('id', '<rect width="24" height="8" fill="#CE1126"/><rect y="8" width="24" height="8" fill="#fff"/>');
  bay('ms', '<rect width="24" height="16" fill="#fff"/>' +
            '<g fill="#CC0001"><rect y="0" width="24" height="1.15"/><rect y="2.3" width="24" height="1.15"/>' +
            '<rect y="4.6" width="24" height="1.15"/><rect y="6.9" width="24" height="1.15"/>' +
            '<rect y="9.2" width="24" height="1.15"/><rect y="11.5" width="24" height="1.15"/>' +
            '<rect y="13.8" width="24" height="1.15"/></g>' +
            '<rect width="13" height="9.2" fill="#010066"/>' +
            '<circle cx="5.6" cy="4.6" r="2.8" fill="#FFCC00"/><circle cx="6.9" cy="4.6" r="2.3" fill="#010066"/>' +
            '<path d="M9.8 2.9 l.5 1.4 1.45.07 -1.15.9 .4 1.4 -1.2-.8 -1.2.8 .4-1.4 -1.15-.9 1.45-.07z" fill="#FFCC00"/>');
  bay('bn', '<rect width="24" height="16" fill="#006A4E"/><circle cx="10.6" cy="8" r="4.4" fill="#F42A41"/>');
  bay('hi', '<rect width="24" height="5.33" fill="#FF9933"/><rect y="5.33" width="24" height="5.34" fill="#fff"/>' +
            '<rect y="10.67" width="24" height="5.33" fill="#138808"/>' +
            '<circle cx="12" cy="8" r="2" fill="none" stroke="#000080" stroke-width=".9"/>' +
            '<circle cx="12" cy="8" r=".5" fill="#000080"/>');
  bay('zh', '<rect width="24" height="16" fill="#DE2910"/>' +
            '<path d="M4.4 2.4 l.95 2.6 2.75.1 -2.2 1.7 .8 2.65 -2.3-1.55 -2.3 1.55 .8-2.65 -2.2-1.7 2.75-.1z" fill="#FFDE00"/>' +
            '<g fill="#FFDE00"><circle cx="9.6" cy="2.2" r=".85"/><circle cx="11.4" cy="4.1" r=".85"/>' +
            '<circle cx="11.4" cy="6.7" r=".85"/><circle cx="9.6" cy="8.5" r=".85"/></g>');
  bay('ru', '<rect width="24" height="5.33" fill="#fff"/><rect y="5.33" width="24" height="5.34" fill="#0039A6"/>' +
            '<rect y="10.67" width="24" height="5.33" fill="#D52B1E"/>');
  bay('fr', '<rect width="8" height="16" fill="#002395"/><rect x="8" width="8" height="16" fill="#fff"/>' +
            '<rect x="16" width="8" height="16" fill="#ED2939"/>');
  bay('de', '<rect width="24" height="5.33" fill="#000"/><rect y="5.33" width="24" height="5.34" fill="#DD0000"/>' +
            '<rect y="10.67" width="24" height="5.33" fill="#FFCE00"/>');
  bay('es', '<rect width="24" height="16" fill="#AA151B"/><rect y="4" width="24" height="8" fill="#F1BF00"/>' +
            '<rect x="4.5" y="6.4" width="3.4" height="3.6" rx=".6" fill="#AA151B"/>');
  bay('az', '<rect width="24" height="5.33" fill="#00B5E2"/><rect y="5.33" width="24" height="5.34" fill="#E4002B"/>' +
            '<rect y="10.67" width="24" height="5.33" fill="#00AF66"/>' +
            '<circle cx="11.4" cy="8" r="2.5" fill="#fff"/><circle cx="12.4" cy="8" r="2" fill="#E4002B"/>' +
            '<path d="M15.2 6.5 l.42 1.18 1.2.06 -.95.75 .33 1.17 -1-.67 -1 .67 .33-1.17 -.95-.75 1.2-.06z" fill="#fff"/>');
  bay('uz', '<rect width="24" height="5.1" fill="#1EB53A"/><rect y="5.1" width="24" height="5.8" fill="#fff"/>' +
            '<rect y="10.9" width="24" height="5.1" fill="#0099B5"/>' +
            '<rect y="4.7" width="24" height=".7" fill="#CE1126"/><rect y="10.6" width="24" height=".7" fill="#CE1126"/>' +
            '<circle cx="5" cy="2.5" r="1.8" fill="#fff"/><circle cx="5.9" cy="2.3" r="1.5" fill="#0099B5"/>' +
            '<g fill="#fff"><circle cx="9" cy="1.5" r=".42"/><circle cx="9" cy="3.2" r=".42"/>' +
            '<circle cx="10.8" cy="1.5" r=".42"/><circle cx="10.8" cy="3.2" r=".42"/></g>');
  bay('sq', '<rect width="24" height="16" fill="#E41E20"/>' +
            '<path d="M12 4.2 c-1.4-1.6-3.2-1.2-3.2-.2 0 .8 1 1 1.4 1.6 -1.2.2-2.2 1-2.2 2 0 1.2 1.4 1.8 2.6 1.6 ' +
            '-.6.8-1 1.4-1 2 0 .9 1.1 1.4 2.4 1.4 1.3 0 2.4-.5 2.4-1.4 0-.6-.4-1.2-1-2 1.2.2 2.6-.4 2.6-1.6 ' +
            '0-1-1-1.8-2.2-2 .4-.6 1.4-.8 1.4-1.6 0-1-1.8-1.4-3.2.2z" fill="#000"/>');
  bay('bs', '<rect width="24" height="16" fill="#002395"/>' +
            '<path d="M7 1.4 h11 L7 14.6z" fill="#FECB00"/>' +
            '<g fill="#fff"><path d="M4.6 2.4 l.4 1.1 1.15.05 -.9.7 .32 1.1 -.97-.65 -.97.65 .32-1.1 -.9-.7 1.15-.05z"/>' +
            '<path d="M8.2 6.2 l.4 1.1 1.15.05 -.9.7 .32 1.1 -.97-.65 -.97.65 .32-1.1 -.9-.7 1.15-.05z"/>' +
            '<path d="M11.8 10 l.4 1.1 1.15.05 -.9.7 .32 1.1 -.97-.65 -.97.65 .32-1.1 -.9-.7 1.15-.05z"/></g>');

  function bayrakSvg(kod, cls) {
    var ic = B[kod] || '<rect width="24" height="16" fill="#E3EAF3"/>';
    return '<svg class="' + (cls || 'kd-bayrak') + '" viewBox="0 0 24 16" aria-hidden="true" ' +
           'preserveAspectRatio="xMidYMid slice">' + ic + '</svg>';
  }

  /* ------------------------------------------------------ seçim/kayıt */
  var simdiki = 'tr';
  function oku() {
    try { return localStorage.getItem(ANAHTAR) || ''; } catch (e) { return ''; }
  }
  function yaz(k) {
    try { localStorage.setItem(ANAHTAR, k); } catch (e) { }
  }
  function oku2(k) {
    try { return localStorage.getItem(k) || ''; } catch (e) { return ''; }
  }
  function yaz2(k, v) {
    try { localStorage.setItem(k, v); } catch (e) { }
  }

  /* ADRESTEN DİL: .../index.html?dil=ar · ?lang=ar · #dil=ar */
  function adresDili() {
    try {
      var m = (location.search + '&' + String(location.hash).replace('#', '&'))
                .match(/[?&](?:dil|lang)=([A-Za-z-]+)/);
      if (!m) return '';
      var k = m[1].toLowerCase(), i;
      for (i = 0; i < DILLER.length; i++) {
        if (DILLER[i].kod.toLowerCase() === k) return DILLER[i].kod;
      }
      k = k.split('-')[0];                      /* ar-SA → ar */
      for (i = 0; i < DILLER.length; i++) {
        if (DILLER[i].kod.split('-')[0] === k) return DILLER[i].kod;
      }
    } catch (e) { }
    return '';
  }

  /* Tek dokunuşla geçilecek dil: son kullanılan öteki dil. */
  function otekiDil() {
    var o = oku2(ONCEKI);
    if (!o || o === simdiki) return '';
    for (var i = 0; i < DILLER.length; i++) if (DILLER[i].kod === o) return o;
    return '';
  }

  /* Tarayıcı dili → bizdeki kod (YALNIZ öneri için kullanılıyor) */
  var TARAYICI = { ku: 'kmr-arab', ckb: 'ckb', pes: 'fa', prs: 'fa', in: 'id',
                   hr: 'bs', sr: 'bs', sh: 'bs' };
  function tarayiciDili() {
    try {
      var l = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      var ana = String(l).toLowerCase().split('-')[0];
      var k = TARAYICI[ana] || ana;
      if (k === 'tr') return '';
      for (var i = 0; i < DILLER.length; i++) if (DILLER[i].kod === k) return k;
    } catch (e) { }
    return '';
  }
  function dilKaydi(kod) {
    for (var i = 0; i < DILLER.length; i++) if (DILLER[i].kod === kod) return DILLER[i];
    return DILLER[0];
  }

  /* hesapta saklama — sinifveri.js'teki yöntemin aynısı */
  function fb() {
    try {
      var f = window.firebase;
      if (!f || !f.apps || !f.apps.length || !f.firestore || !f.auth) return null;
      var u = f.auth().currentUser;
      return (u && !u.isAnonymous) ? { f: f, uid: u.uid } : null;
    } catch (e) { return null; }
  }
  var yazZaman = 0;
  function hesabaYaz() {
    var h = fb();
    if (!h) return;
    clearTimeout(yazZaman);
    yazZaman = setTimeout(function () {
      try {
        h.f.firestore().collection('kullanicilar').doc(h.uid)
          .set({ dil: simdiki, dilTs: Date.now() }, { merge: true });
      } catch (e) { }
    }, 400);
  }
  function hesaptanOku() {
    var h = fb();
    if (!h) return;
    try {
      h.f.firestore().collection('kullanicilar').doc(h.uid).get().then(function (d) {
        if (!d || !d.exists) return;
        var v = (d.data() || {}).dil;
        if (v && v !== simdiki && dilKaydi(v).kod === v) sec(v, true);
      }).catch(function () { });
    } catch (e) { }
  }
  (function hesapIzle() {
    var say = 0;
    var t = setInterval(function () {
      say++;
      try {
        var f = window.firebase;
        if (f && f.apps && f.apps.length && f.auth) {
          clearInterval(t);
          f.auth().onAuthStateChanged(function (u) { if (u && !u.isAnonymous) hesaptanOku(); });
        } else if (say > 60) clearInterval(t);
      } catch (e) { clearInterval(t); }
    }, 500);
  })();

  /* ------------------------------------------------------- sözlükler */
  function szlk() {
    var S = window.KIDEF_DIL;
    return (S && S[simdiki]) ? S[simdiki] : null;
  }
  var yukleniyor = {};
  function sozlukYukle(kod, bitince) {
    if (kod === 'tr') { bitince(); return; }
    var S = window.KIDEF_DIL;
    if (S && S[kod]) { bitince(); return; }
    if (yukleniyor[kod]) { yukleniyor[kod].push(bitince); return; }
    yukleniyor[kod] = [bitince];
    var t = document.createElement('script');
    t.src = KLASOR + kod + '.js?v=' + (SURUM[kod] || '1');
    t.onload = t.onerror = function () {
      var l = yukleniyor[kod] || [];
      yukleniyor[kod] = null;
      l.forEach(function (f) { try { f(); } catch (e) { } });
    };
    (document.head || document.documentElement).appendChild(t);
  }

  /* Türkiye'ye özel bölümler: Türkçede açık, başka dilde kapalı.
     Kuralın kendisi stilKur()'daki CSS'te; burada yalnız <html>
     niteliği güncelleniyor. */
  function trOzel() {
    try {
      document.documentElement.setAttribute('data-kd-tr', simdiki === 'tr' ? '1' : '0');
    } catch (e) { }
  }

  function metin(anahtar, varsayilan) {
    var s = szlk();
    return (s && s[anahtar]) ? s[anahtar] : (varsayilan || '');
  }

  /* -------------------------------------------------------- uygulama */
  var ALANLAR = [
    { nit: 'data-i18n',       hedef: 'metin' },
    { nit: 'data-i18n-title', hedef: 'title' },
    { nit: 'data-i18n-ph',    hedef: 'placeholder' },
    { nit: 'data-i18n-aria',  hedef: 'aria-label' },
    /* 15.10.2026 — içinde <b> gibi etiket taşıyan yazı (kitap kartının
       açıklaması) ve resim alt yazıları. */
    { nit: 'data-i18n-html',  hedef: 'html' },
    { nit: 'data-i18n-alt',   hedef: 'alt' }
  ];

  /* KODUN YAZDIĞINA DOKUNMA (15.10.2026)
     Sayfanın kendi kodu işaretli bir öğeye sonradan BAŞKA bir şey
     yazdıysa ("Tur 3 / 10", yüklenen ders içeriği, "Emin misin? Sil",
     kayıt kipinde "Kayıt Ol") o yazı artık kodundur: üstüne anahtarın
     çevirisi yazılmaz — eskiden 150 ms sonra yazılıyordu. Kod öğeye
     yine Türkçe aslını yazarsa (oyunun kendi yerelleştirmesi gibi)
     çeviri sürer. Motorun bir sözlükle son yazdığı yazı burada tutulur;
     Türkçede ya da sözlük yüklenmeden yazılan kaydedilmez (sayfa açılırken
     oyunun kendi yazdığı Türkçe sonradan çevrilebilsin).
     KidefDil.yaz()/nitelik() de buraya kaydeder. */
  var SON = (typeof WeakMap === 'function') ? new WeakMap() : null;
  function sonOku(e, nit) {
    var o = SON ? SON.get(e) : null;
    return o ? o[nit] : undefined;
  }
  function sonYaz(e, nit, v) {
    if (!SON) return;
    var o = SON.get(e);
    if (!o) { o = {}; SON.set(e, o); }
    o[nit] = v;
  }
  function suAnki(e, hedef) {
    if (hedef === 'metin') return e.textContent;
    if (hedef === 'html') return e.innerHTML;
    return e.getAttribute(hedef) || '';
  }

  /* YER TUTUCULU YAZI (15.10.2026) — "{n}. Sınıf müfredatı", "{ad} Babı":
     öğe data-i18n-yer='{"n":"7"}' taşırsa çeviri de Türkçesi de bu
     değerlerle doldurulur; sözlük sonradan yüklense de dil değişse de
     doğru yazı çıkar. KidefDil.yaz(öğe, anahtar, türkçe, {n: 7}) kurar. */
  function yerOku(e) {
    var j = e.getAttribute('data-i18n-yer');
    if (!j) return null;
    try { return JSON.parse(j); } catch (h) { return null; }
  }
  function doldur(m, yer) {
    if (!yer || m == null) return m;
    return String(m).replace(/\{([A-Za-z0-9_]+)\}/g, function (t, ad) {
      return Object.prototype.hasOwnProperty.call(yer, ad) ? String(yer[ad]) : t;
    });
  }

  function ogeyiCevir(e, s) {
    ALANLAR.forEach(function (a) {
      var k = e.getAttribute(a.nit);
      if (!k) return;
      var saklama = a.nit + '-tr';
      var tr = e.getAttribute(saklama);
      if (tr === null) {
        if (a.hedef === 'metin') { tr = e.textContent.trim(); }
        else if (a.hedef === 'html') { tr = e.innerHTML.trim(); }
        else { tr = e.getAttribute(a.hedef) || ''; }
        e.setAttribute(saklama, tr);
      }
      var yer = yerOku(e);
      var trDolu = String(doldur(tr, yer)).trim();
      var simdi = suAnki(e, a.hedef);
      var son = sonOku(e, a.nit);
      if (son !== undefined && simdi !== son && simdi.trim() !== trDolu) return;   /* kodun yazdığı */
      var yeni = doldur((s && s[k]) ? s[k] : tr, yer);
      if (a.hedef === 'metin') {
        if (e.textContent !== yeni) e.textContent = yeni;
      } else if (a.hedef === 'html') {
        if (e.innerHTML !== yeni) e.innerHTML = yeni;
      } else {
        if (e.getAttribute(a.hedef) !== yeni) e.setAttribute(a.hedef, yeni);
        /* aria-label yoksa title ile aynı kalsın */
        if (a.hedef === 'title' && e.hasAttribute('aria-label') && !e.getAttribute('data-i18n-aria')) {
          e.setAttribute('aria-label', yeni);
        }
      }
      if (s) sonYaz(e, a.nit, suAnki(e, a.hedef));
    });
  }

  function uygula(kok) {
    var s = szlk();
    var alan = kok || document;
    try {
      if (alan.nodeType === 1 && alan.hasAttribute && (alan.hasAttribute('data-i18n') ||
          alan.hasAttribute('data-i18n-title') || alan.hasAttribute('data-i18n-ph') ||
          alan.hasAttribute('data-i18n-aria') || alan.hasAttribute('data-i18n-html') ||
          alan.hasAttribute('data-i18n-alt'))) ogeyiCevir(alan, s);
      var l = alan.querySelectorAll('[data-i18n],[data-i18n-title],[data-i18n-ph],' +
                                    '[data-i18n-aria],[data-i18n-html],[data-i18n-alt]');
      for (var i = 0; i < l.length; i++) ogeyiCevir(l[i], s);
      /* SEKME BAŞLIĞI (15.10.2026) — <title> <head> içinde olduğu için
         gövde taramasına girmiyor; burada ayrıca çevriliyor. */
      if (!kok || kok === document || kok === document.body) {
        var bas = document.querySelector('title[data-i18n]');
        if (bas) ogeyiCevir(bas, s);
      }
    } catch (e) { }
  }

  /* sonradan basılan kartlar da çevrilsin */
  var bekle = 0;
  function izle() {
    if (!window.MutationObserver) return;
    new MutationObserver(function (kayitlar) {
      if (simdiki === 'tr' && !szlk()) return;      /* Türkçede iş yok */
      var var_ = false;
      for (var i = 0; i < kayitlar.length && !var_; i++) {
        if (kayitlar[i].addedNodes && kayitlar[i].addedNodes.length) var_ = true;
      }
      if (!var_) return;
      clearTimeout(bekle);
      bekle = setTimeout(function () { uygula(document.body); }, 150);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function sec(kod, sessiz) {
    var k = dilKaydi(kod);
    /* Önceki dili sakla: bayrağa tek dokunuşla geri dönülebilsin. */
    if (simdiki && simdiki !== k.kod) yaz2(ONCEKI, simdiki);
    simdiki = k.kod;
    yaz(simdiki);
    if (!sessiz) hesabaYaz();
    document.documentElement.setAttribute('lang', simdiki.split('-')[0]);
    trOzel();
    sozlukYukle(simdiki, function () {
      uygula(document.body);
      serityiTazele();
      try {
        document.dispatchEvent(new CustomEvent(EV, { detail: { kod: simdiki, kayit: k } }));
      } catch (e) { }
    });
  }

  /* ------------------------------------------------- başlıktaki düğme */
  function stilKur() {
    if (document.getElementById('kdDilStil')) return;
    var s = document.createElement('style');
    s.id = 'kdDilStil';
    s.textContent = [
      '.kd-bayrak{ width:22px; height:15px; border-radius:3px; display:block;',
      '  box-shadow:0 0 0 1px rgba(16,42,67,.16) inset; flex:none; }',
      '#kdDilTus{ display:inline-flex; align-items:center; gap:7px; cursor:pointer;',
      '  background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.3);',
      '  border-radius:999px; padding:5px 11px 5px 7px; color:#fff; font:inherit;',
      '  font-size:.85rem; font-weight:700; line-height:1; }',
      '#kdDilTus:hover{ background:rgba(255,255,255,.24); }',
      '#kdDilTus .kd-ok{ font-size:.6rem; opacity:.85; }',
      '#kdDilPerde{ position:fixed; inset:0; z-index:10120; display:flex;',
      '  align-items:center; justify-content:center; padding:18px;',
      '  background:rgba(12,24,40,.5); backdrop-filter:blur(3px); }',
      '#kdDilPerde .kd-kutu{ width:100%; max-width:560px; max-height:86vh; display:flex;',
      '  flex-direction:column; overflow:hidden; background:#fff; border-radius:20px;',
      '  box-shadow:0 26px 60px rgba(8,20,38,.42); border-top:6px solid #16A085; }',
      '#kdDilPerde .kd-bas{ flex:none; display:flex; align-items:center; gap:10px;',
      '  padding:15px 20px 12px; border-bottom:1px solid #EDF1F6; }',
      '#kdDilPerde .kd-bas b{ font-size:1.08rem; color:#16324F; }',
      '#kdDilPerde .kd-bas small{ display:block; font-size:.86rem; color:#6B7A8C; font-weight:400; }',
      '#kdDilPerde .kd-kapat{ margin-inline-start:auto; width:34px; height:34px; border:none;',
      '  border-radius:50%; background:#F2F5F9; color:#44607A; font-size:20px; cursor:pointer; }',
      '#kdDilPerde .kd-liste{ flex:1 1 auto; min-height:0; overflow-y:auto; padding:10px;',
      '  display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:8px; }',
      '.kd-dil{ display:flex; align-items:center; gap:10px; width:100%; cursor:pointer;',
      '  font:inherit; text-align:start; background:#fff; border:1.5px solid #E7EDF3;',
      '  border-radius:14px; padding:10px 12px; transition:border-color .15s, background .15s; }',
      '.kd-dil:hover{ border-color:#16A085; background:#F2FBF8; }',
      '.kd-dil.secili{ border-color:#16A085; background:#E9F7F2; }',
      '.kd-dil b{ display:block; font-size:.98rem; color:#16324F; line-height:1.2; }',
      '.kd-dil small{ display:block; font-size:.78rem; color:#7B8A99; }',
      '.kd-dil .kd-bayrak{ width:28px; height:19px; }',
      '.kd-yakinda{ margin-inline-start:auto; font-size:.64rem; font-weight:800; letter-spacing:.05em;',
      '  text-transform:uppercase; color:#8A5A00; background:#FFF6E3; border:1px solid #F0D79B;',
      '  border-radius:999px; padding:3px 7px; }',
      /* başlığı olmayan sayfalarda sol alt köşe (15.10.2026) */
      '#kdDilKose{ position:fixed; left:12px; bottom:12px; z-index:40; }',
      '#kdDilKose #kdDilTus{ background:rgba(16,42,67,.55); border-color:rgba(255,255,255,.35);',
      '  opacity:.55; transition:opacity .18s, background .18s; backdrop-filter:blur(3px);',
      '  box-shadow:0 2px 10px rgba(16,42,67,.25); }',
      '#kdDilKose #kdDilTus:hover, #kdDilKose #kdDilTus:focus-visible{',
      '  opacity:1; background:rgba(16,42,67,.85); }',
      '@media print{ #kdDilKose{ display:none; } }',
      /* İLK ZİYARET ÖNERİSİ — altta tek satır, kapatılınca bir daha
         çıkmıyor. Üstte değil: sitenin başlığını kapatmasın. */
      '#kdDilOneri{ position:fixed; left:0; right:0; bottom:0; z-index:10130;',
      '  display:flex; align-items:center; gap:10px; padding:9px 14px;',
      '  background:#0F2A43; color:#fff; font:inherit; font-size:.92rem;',
      '  box-shadow:0 -2px 12px rgba(16,42,67,.3); }',
      '#kdDilOneri .kdo-bayrak{ display:flex; flex:none; }',
      '#kdDilOneri .kdo-yazi{ flex:1 1 auto; min-width:0; }',
      '#kdDilOneri button{ font:inherit; font-size:.9rem; font-weight:700;',
      '  cursor:pointer; border-radius:999px; padding:6px 14px; flex:none;',
      '  border:1px solid rgba(255,255,255,.42); background:rgba(255,255,255,.12);',
      '  color:#fff; }',
      '#kdDilOneri .kdo-evet{ background:#fff; color:#0F2A43; border-color:#fff; }',
      '@media (max-width:520px){ #kdDilOneri{ flex-wrap:wrap; } }',
      '@media print{ #kdDilOneri{ display:none; } }',
      /* TÜRKİYE'YE ÖZEL BÖLÜMLER (15.10.2026) — öğretmen: "türkçe
         dışındaki diller seçilince sınıflarım ve imam hatip
         kategorileri kaybolsun". İmam Hatip belgeleri, yıllık plan,
         zümre ve sınıf defteri MEB mevzuatına bağlı; başka dilde
         karşılığı yok. #siniflarim.gor kuralını yenmek için
         !important. */
      'html[data-kd-tr="0"] #imam-hatip,',
      'html[data-kd-tr="0"] #guncellemeler,',
      'html[data-kd-tr="0"] #siniflarim{ display:none !important; }',
      /* TÜRKİYE'YE ÖZEL KARTLAR (17.10.2026) — öğretmenin seçimi: YDT
         Arapça, Soru Hazırla (sınav), Pano, Değerlendirme Ölçeği ve dijital
         kitaplar başka dilde görünmesin. data-kd-yalniz-tr taşıyan her öğe
         (tek kart ya da bütün bölüm) Türkçe dışında gizlenir. */
      'html[data-kd-tr="0"] [data-kd-yalniz-tr]{ display:none !important; }',
      /* MAARİF ETİKETLERİ (17.10.2026) — öğretmen: "türkçe dışındaki diller
         seçilince kartlardaki maarif etiketleri görünmesin". Kartlardaki
         "Maarif · Destekleme / Zenginleştirme" çipi (.mrf) ve sınıf
         rozeti (.ih-maarif) Türkiye'nin öğretim programına ait. */
      'html[data-kd-tr="0"] .mrf, html[data-kd-tr="0"] .ih-maarif{ display:none !important; }',
      /* HARF ARALIĞI (17.10.2026) — Arap harfli ve Hint yazılı dillerde
         letter-spacing harfleri birbirinden koparıyor (bitişik harfler
         ayrılıyor, Hintçede hece kümeleri dağılıyor); bu dillerde kapalı. */
      'html[lang="ar"] body *, html[lang="fa"] body *, html[lang="ur"] body *, html[lang="ps"] body *,',
      'html[lang="ckb"] body *, html[lang="kmr"] body *, html[lang="hi"] body *,',
      'html[lang="bn"] body *{ letter-spacing:normal !important; }',
      /* profil kartı */
      '.kd-dil-kart .kd-dil{ max-width:320px; }',
      '.kd-dil-kart h3{ margin:0 0 6px; font-size:1.1rem; color:#0f2a43; }',
      '.kd-dil-kart p{ margin:0 0 12px; font-size:.92rem; line-height:1.5; color:#5A7186; }'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  function tusHtml() {
    var k = dilKaydi(simdiki);
    return bayrakSvg(k.kod) + '<span class="kd-ad">' + k.kod.split('-')[0].toUpperCase() + '</span>' +
           '<span class="kd-ok" title="' + metin('dil.liste', 'Bütün diller') + '">▾</span>';
  }
  /* Düğmenin ipucu yazısı: dokununca liste açıldığı için "Dil / Language". */
  function tusIpucu() {
    return metin('dil.baslik', 'Dil / Language');
  }
  function serityiTazele() {
    var t = document.getElementById('kdDilTus');
    if (t) {
      t.innerHTML = tusHtml();
      t.title = tusIpucu();
      t.setAttribute('aria-label', tusIpucu());
    }
    var kart = document.querySelector('.kd-dil-kart');
    if (kart) kartDoldur(kart);
  }
  /* Düğmenin yeri: anasayfada başlık çubuğu; sayfa kendi yerini
     vermişse #kdDilYuva; ikisi de yoksa sol alt köşedeki yüzen düğme.
     <body data-kd-dil="yok"> diyen sayfada düğme konmaz. */
  function tusYeri() {
    var y = document.querySelector('header .user-controls') ||
            document.getElementById('kdDilYuva');
    if (y) return y;
    if (!document.body || document.body.getAttribute('data-kd-dil') === 'yok') return null;
    /* Köşe düğmesi YALNIZ çevrilecek yazısı olan sayfada çıkar: henüz
       işaretlenmemiş sayfada düğme görünüp hiçbir şeyi değiştirmesin.
       Yazıyı JS sonradan basıyorsa basla()'nın gecikmeli tusKur()
       çağrısı düğmeyi o zaman koyar. */
    if (!document.querySelector('[data-i18n],[data-i18n-title],[data-i18n-ph],' +
                                '[data-i18n-aria],[data-i18n-html],[data-i18n-alt]')) return null;
    var k = document.getElementById('kdDilKose');
    if (!k) {
      k = document.createElement('div');
      k.id = 'kdDilKose';
      document.body.appendChild(k);
    }
    return k;
  }

  function tusKur() {
    if (document.getElementById('kdDilTus')) return;
    var yer = tusYeri();
    if (!yer) return;
    stilKur();
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'kdDilTus';
    b.title = tusIpucu();
    b.setAttribute('aria-label', tusIpucu());
    b.innerHTML = tusHtml();
    /* DOKUNUŞ = LİSTE (16.10.2026) — öğretmen: "dile tıklayınca her
       zaman liste açılsın türkçeyle son dil arasında dönüp durmasın".
       Önceden bayrağa dokunmak son iki dil arasında geçiyordu; artık
       düğmenin neresine dokunulursa bütün dillerin listesi açılır.
       Uzun basma da listeyi açar (eski alışkanlık bozulmasın). */
    var sayac = null, uzun = false;
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (uzun) { uzun = false; return; }
      pencereAc();
    });
    b.addEventListener('pointerdown', function () {
      uzun = false;
      if (sayac) clearTimeout(sayac);
      sayac = setTimeout(function () { uzun = true; pencereAc(); }, 550);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (o) {
      b.addEventListener(o, function () {
        if (sayac) clearTimeout(sayac);
        sayac = null;
      });
    });
    yer.insertBefore(b, yer.firstChild);
  }

  /* --------------------------------------------------------- pencere */
  function dilSatiri(d) {
    return '<button type="button" class="kd-dil' + (d.kod === simdiki ? ' secili' : '') +
      '" data-kd-dil="' + d.kod + '">' + bayrakSvg(d.kod) +
      '<span><b>' + d.ad + '</b><small>' + d.tr + '</small></span>' +
      (d.hazir ? '' : '<span class="kd-yakinda">' + metin('dil.yakinda', 'yakında') + '</span>') + '</button>';
  }
  function pencereAc() {
    stilKur();
    pencereKapat();
    var p = document.createElement('div');
    p.id = 'kdDilPerde';
    p.innerHTML = '<div class="kd-kutu">' +
      '<div class="kd-bas">' + bayrakSvg(simdiki) +
      '<span><b>' + metin('dil.baslik', 'Dil / Language') + '</b><small>' +
      metin('dil.alt', 'Site yazıları seçtiğin dile geçer.') + '</small></span>' +
      '<button type="button" class="kd-kapat" data-kd-kapat="1" aria-label="Kapat">&times;</button></div>' +
      '<div class="kd-liste">' + DILLER.map(dilSatiri).join('') + '</div></div>';
    p.addEventListener('click', function (e) {
      if (e.target === p || (e.target.closest && e.target.closest('[data-kd-kapat]'))) {
        pencereKapat(); return;
      }
      var t = e.target.closest ? e.target.closest('[data-kd-dil]') : null;
      if (!t) return;
      sec(t.getAttribute('data-kd-dil'));
      pencereKapat();
    }, false);
    document.body.appendChild(p);
  }
  function pencereKapat() {
    var p = document.getElementById('kdDilPerde');
    if (p && p.parentNode) p.parentNode.removeChild(p);
  }

  /* --------------------------------------------- profildeki dil kartı */
  function kartDoldur(kart) {
    kart.innerHTML = '<h3>' + metin('dil.baslik', 'Dil / Language') + '</h3>' +
      '<p>' + metin('dil.kart_alt',
        'Sitenin yazıları seçtiğin dile geçer. Seçimin hesabına kayıtlıdır: ' +
        'telefonda ya da okulda açtığında da aynı dil gelir.') + '</p>' +
      '<div class="kd-liste" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:8px;">' +
      DILLER.map(dilSatiri).join('') + '</div>';
  }
  function kartKur(bolum) {
    if (!bolum || !bolum.firstElementChild) return;
    if (bolum.querySelector('.kd-dil-kart')) return;
    stilKur();
    var k = document.createElement('div');
    k.className = 'glass-card kd-dil-kart';
    kartDoldur(k);
    k.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-kd-dil]') : null;
      if (!t) return;
      sec(t.getAttribute('data-kd-dil'));
    }, false);
    bolum.appendChild(k);
  }
  function profilIzle() {
    ['teacher-section', 'student-profile-section'].forEach(function (id) {
      var b = document.getElementById(id);
      if (!b) return;
      kartKur(b);
      try {
        new MutationObserver(function () { kartKur(b); }).observe(b, { childList: true });
      } catch (e) { }
    });
  }

  /* ÖTEKİ AÇIK SEKMELER (15.10.2026) — öğretmen: "index dışındaki
     dosyaların da dilin değiştiğini anlayan ve ona göre dili değiştiren
     sisteme geçelim". Bir sekmede dil değişince tarayıcı öteki sekmelere
     'storage' haberi yolluyor; burada yakalanıp sayfa da çevriliyor.
     sessiz=true: hesaba yeniden yazmaya gerek yok, zaten yazıldı. */
  function sekmeleriDinle() {
    window.addEventListener('storage', function (e) {
      if (!e || e.key !== ANAHTAR) return;
      var k = e.newValue || 'tr';
      if (k === simdiki) return;
      sec(k, true);
    });
  }

  /* İLK ZİYARETTE ÖNERİ — seçim yapılmamışsa ve tarayıcı dili Türkçe
     değilse teklif edilir. Kendiliğinden değiştirmiyor. Yazı önerilen
     dilin KENDİ dilinde: sözlüğü sessizce yükleniyor. */
  function oneriKur() {
    if (oku() || adresDili() || oku2(ONERI) === 'yok') return;
    var k = tarayiciDili();
    if (!k || !document.body) return;
    /* Çevrilmiş yazısı olmayan sayfada teklif etmenin anlamı yok. */
    if (!document.querySelector('[data-i18n],[data-i18n-title],[data-i18n-ph],' +
                                '[data-i18n-aria],[data-i18n-html],[data-i18n-alt]')) return;
    sozlukYukle(k, function () {
      if (document.getElementById('kdDilOneri')) return;
      var S = window.KIDEF_DIL, s = (S && S[k]) || {};
      var ad = dilKaydi(k).ad;
      var kutu = document.createElement('div');
      kutu.id = 'kdDilOneri';
      kutu.setAttribute('role', 'region');
      kutu.innerHTML =
        '<span class="kdo-bayrak">' + bayrakSvg(k) + '</span>' +
        '<span class="kdo-yazi">' +
          (s['dil.oneri'] || ('Bu siteyi ' + ad + ' görmek ister misin?')) + '</span>' +
        '<button type="button" class="kdo-evet">' +
          (s['dil.oneri_evet'] || ad) + '</button>' +
        '<button type="button" class="kdo-hayir">' +
          (s['dil.oneri_hayir'] || 'Türkçe kalsın') + '</button>';
      document.body.appendChild(kutu);
      function kapat() {
        yaz2(ONERI, 'yok');
        if (kutu.parentNode) kutu.parentNode.removeChild(kutu);
      }
      kutu.querySelector('.kdo-evet').addEventListener('click', function () {
        kapat(); sec(k);
      });
      kutu.querySelector('.kdo-hayir').addEventListener('click', kapat);
    });
  }

  /* ------------------------------------------------------------ açılış */
  function basla() {
    stilKur();
    tusKur();
    sekmeleriDinle();
    profilIzle();
    izle();
    /* Adresteki dil, kayıtlı seçimin önüne geçer ve cihaza yazılır;
       hesaba yazılmaz (sessiz), bu bağlantının isteği. */
    var a = adresDili();
    if (a) yaz(a);
    var k = a || oku();
    if (k && k !== 'tr') sec(k, true);
    else { simdiki = 'tr'; uygula(document.body); }
    trOzel();
    oneriKur();
    /* başlık sonradan çizilirse düğme yine konsun */
    setTimeout(tusKur, 1200);
    setTimeout(profilIzle, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else basla();

  /* JS'in elle yazdığı yazılar için (15.10.2026). Anahtarı öğeye de
     işaretler; Türkçesi data-i18n-tr'ye yazılır ki Türkçeye dönüş
     bozulmasın. */
  var NITALAN = { 'title': 'data-i18n-title', 'placeholder': 'data-i18n-ph',
                  'aria-label': 'data-i18n-aria', 'alt': 'data-i18n-alt' };
  function nitelikYaz(e, nit, anahtar, tr) {
    if (!e || !nit) return;
    try {
      var alan = NITALAN[nit];
      if (alan) {
        e.setAttribute(alan, anahtar);
        e.setAttribute(alan + '-tr', tr == null ? '' : tr);
      }
      e.setAttribute(nit, metin(anahtar, tr == null ? '' : tr));
      if (alan) sonYaz(e, alan, e.getAttribute(nit) || '');
    } catch (h) { }
  }
  function metinYaz(e, anahtar, tr, yer) {
    if (!e) return;
    try {
      e.setAttribute('data-i18n', anahtar);
      e.setAttribute('data-i18n-tr', tr == null ? '' : tr);
      if (yer) e.setAttribute('data-i18n-yer', JSON.stringify(yer));
      else e.removeAttribute('data-i18n-yer');
      e.textContent = doldur(metin(anahtar, tr == null ? '' : tr), yer);
      sonYaz(e, 'data-i18n', e.textContent);
    } catch (h) { }
  }

  window.KidefDil = {
    DILLER: DILLER,
    kod: function () { return simdiki; },
    sec: sec,
    uygula: uygula,
    metin: metin,
    bayrakSvg: bayrakSvg,
    pencereAc: pencereAc,
    yaz: metinYaz,
    nitelik: nitelikYaz,
    doldur: doldur,
    OLAY: EV
  };
})();
