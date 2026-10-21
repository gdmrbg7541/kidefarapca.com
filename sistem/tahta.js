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
     tarayıcı buna dokunmadan izin vermiyorsa sol ortadaki soluk tuşla geçilir
     (18.10.2026'ya dek ilk dokunuşta geçiyordu) ve kabuk açık kaldıkça tam
     ekranda kalır (sonraki sayfalarda da). Öğretmen tam
     ekrandan kendisi çıkarsa o yansıtmada yeniden zorlanmaz. Tahtada
     "Ana ekrana ekle / Uygulamayı yükle" yapılırsa (tahta.webmanifest)
     oradan her açılışta kendiliğinden tam ekran açılır.
   · 3. SÜRÜM (18.10.2026): tahtada tam ekrandayken ekranın SOL ORTASINDA
     soluk, yüzen "Tam ekrandan çık" düğmesi (dokununca belirginleşir).
     Tahta görünümünden "Çık" ile ayrılınca aynı yansıtma sürdükçe ana
     sayfa tahtayı geri götürmez (yayin/bas; sistem/tahtagir.js). Bekleme
     ekranında "Bu cihaz tahta değil" (tahtada seçim paneli artık açılmıyor).
   · 4. SÜRÜM (18.10.2026) — KUMANDA UYUYUNCA TAHTA SÜRER. Öğretmen: "kumanda
     olan cihaz kapanırsa akıllı tahtadan siyah ekran olmadan devam edilsin
     ... tekrar açtığında telefonda kaldığı yerden devam edebilmeli, akıllı
     tahtadan ise bi kapanma veya farklı bi şey olmasın, bağlantı arkaplanda
     sağlansın ve gecikmeli de olsa ekranda titreme vb bi şey olmasın".
     Telefon kilitlenir, ağ değişir ya da tarayıcı kapanırsa ("Bitir"
     denmeden) tahtada HİÇBİR ŞEY değişmez: uyarı, bekleme ekranı, perde
     yok. Birkaç saniye sonra tahta dersi görünmeden üstlenir (VEKİL):
     sayfanın geçmişini o tutar. Telefon aynı sayfayla uyanırsa sessizce
     geri alır; sekme yenilenmiş ya da site yeniden açılmışsa (ana sayfa
     kendiliğinden kumandaya döner — sistem/tahtagir.js) tahtadaki sayfa
     telefonda geçmişiyle açılır. İkisinde de tahta yenilenmez. Telefon
     kilitlenirken tarayıcının kendiliğinden durdurduğu video tahtada
     durmaz. Ders sürerken tahtanın ekranı kararmaz (ekran uyanık kilidi);
     kumanda uykudayken en çok 90 dakika (iki ders) sonra tahtanın kendi
     ayarları ve 40 dakika kuralı yeniden işler.
   · 18.10.2026 akşam: tahtada "tam ekran için dokun" uyarısı ve dokununca
     tam ekrana geçme kalktı; sol ortadaki soluk tuş tam ekran değilken
     "Tam ekrana geç", tam ekrandayken "Tam ekrandan çık".
   · 5. SÜRÜM (18.10.2026) — AÇILIR SÖZLÜK VE GERİ TUŞU. Öğretmen: "kamusa
     basınca popup şeklinde açıldı ama klavyeden yazınca akıllı tahtada
     görünmedi ... sözlüğü kapatınca akıllı tahtada sadece siyah ekran
     oluyor". (1) Sayfanın içindeki aynı site çerçeveleri (açılır sözlük)
     de köprüleniyor: yazılan, tıklanan, kaydırılan tahtada da olur
     (İÇ ÇERÇEVELER). (2) Bir sayfanın "Geri" tuşu tahtayı kabuktan
     çıkarıp boş/siyah ekranda bırakıyordu; geçmiş artık yalnız çerçevenin
     içinde gezer, tahta lideri adresle izler (GEÇMİŞ).

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
  var VEKIL_BEKLE = 4000;               /* kumanda koptu: tahta bu kadar bekleyip dersi görünmeden üstlenir */
  var UZAK_BEKLE = 90 * 60000;          /* kumanda uykudayken tahta en çok bu kadar uyanık ve "hareketli" tutulur */
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
  /* HEDEF TAHTA (21.10.2026) — öğretmen: "tahtaya yansıtırken açık olan cihazlar
     görünsün ve onlardan biri seçilebilsin, hatta eğer o tahtada bi sınıf
     açılmışsa o sınıf ismi de görünsün". KIMLIK: cihazın KALICI kimliği
     (hesap/cihazlar.js ile aynı anahtar; BEN her açılışta değişir, seçim ona
     bağlanamaz). Tahta izle/ kaydına kimliğini, adını ve açık sınıfı yazar;
     lider yayin.hedef = kimlik ile tek tahta seçer, boşsa bütün tahtalar izler. */
  var KIMLIK = (function () {
    try {
      if (window.__kidefKimlik) return String(window.__kidefKimlik);
      var k = localStorage.getItem('kidef_cihaz_kimlik');
      if (!k || !/^[a-z0-9]{8,24}$/.test(k)) {
        k = '';
        try { var a = new Uint32Array(3); crypto.getRandomValues(a); for (var i = 0; i < 3; i++) k += a[i].toString(36); }
        catch (e) { k = Math.random().toString(36).slice(2) + SIMDI().toString(36); }
        k = k.replace(/[^a-z0-9]/g, '').slice(0, 20);
        while (k.length < 8) k += '0';
        localStorage.setItem('kidef_cihaz_kimlik', k);
      }
      return k;
    } catch (e) { return BEN; }
  })();
  function tahtaAdi() {
    var ad = '';
    if (window.__kidefTahtaAd != null) return String(window.__kidefTahtaAd).slice(0, 40);     /* deneme kancası */
    try { ad = (localStorage.getItem('kidef_tahta_ad') || '').trim(); } catch (e) { }
    return ad.slice(0, 40);
  }
  function tahtaAdiVarsayilan() { return kd('th.tahta_n', 'Tahta {n}', { n: KIMLIK.slice(-3).toUpperCase() }); }
  function tahtaAdiYaz(ad) {
    ad = String(ad == null ? '' : ad).trim().slice(0, 40);
    try { if (ad) localStorage.setItem('kidef_tahta_ad', ad); else localStorage.removeItem('kidef_tahta_ad'); } catch (e) { }
  }
  /* tahtanın çerçevesinde AÇIK sınıf (Listelerim) ya da bu cihazda SON açılan sınıf */
  function acikSinif() {
    try {
      var w = CERCEVE && CERCEVE.contentWindow, d = w && w.document;
      if (d) {
        var b = d.getElementById('active-class-title'), ls = d.getElementById('listelerim-section');
        if (b && ls && ls.style.display !== 'none' && b.textContent.trim()) return { ad: b.textContent.trim().slice(0, 40), acik: true };
      }
    } catch (e) { }
    try {
      var k = JSON.parse(localStorage.getItem('ll_son_sinif') || 'null');
      var sd = JSON.parse(localStorage.getItem('schoolData') || 'null');
      var c = k && sd && sd.levels && sd.levels[k.l] && sd.levels[k.l].classes && sd.levels[k.l].classes[k.c];
      var ad = c ? String(c.name || '').trim() : '';
      if (ad) return { ad: ad.slice(0, 40), acik: false };
    } catch (e) { }
    return null;
  }
  function tahtaKaydi() {
    var sn = acikSinif();
    return { kimlik: KIMLIK, ad: tahtaAdi() || null, sinif: sn ? sn.ad : null, sinifAcik: !!(sn && sn.acik) };
  }
  /* yayın başka tahtaya mı? (yalnız tahta cihazı için anlamlı) */
  function hedefDisi(y) {
    return !!(CIHAZ === 'tahta' && y && y.cevrimici && y.hedef && y.hedef !== KIMLIK);
  }
  function hedefOku() {
    var m = /[?&]hedef=([a-z0-9]{8,24})/.exec(location.search);
    if (m) {
      var ad = /[?&]hedefAd=([^&]*)/.exec(location.search);
      return { k: m[1], ad: ad ? decodeURIComponent(ad[1].replace(/\+/g, ' ')).slice(0, 40) : '' };
    }
    try {
      var h = JSON.parse(localStorage.getItem('kidef_tahta_hedef') || 'null');
      if (h && /^[a-z0-9]{8,24}$/.test(h.k || '')) return { k: h.k, ad: String(h.ad || '').slice(0, 40) };
    } catch (e) { }
    return null;
  }
  function hedefYaz(k, ad) {
    try { if (k) localStorage.setItem('kidef_tahta_hedef', JSON.stringify({ k: k, ad: ad || '' })); else localStorage.removeItem('kidef_tahta_hedef'); } catch (e) { }
  }

  /* ------------------------------------------------------- ortak durum */
  var S = {
    hedefTahta: null, hedefTahtaAd: '',       /* seçili tahta (kimlik) — boş: bütün tahtalar */
    kok: null, lider: false, yayin: null, belge: null, s0: 0, baglanti: true,
    izle: {}, isteGoruldu: {}, tahtadanDendi: false,
    ayar: { kip: 'cift', perde: false, kg: false },
    /* kumanda dönüşü (18.10.2026): devam = tahtadaki dersle eşitleniyor (perde
       açık, dokunuş kontrolü almaz); esitBekle = sayfanın geçmişi henüz gelmedi;
       donus = bağlantının en son geri geldiği an */
    uid: null, bas: null, devam: false, esitBekle: false, donus: 0, karar: false
  };
  function oturumVar() { return !!(S.yayin && S.yayin.cevrimici); }
  function cift() { return S.ayar.kip !== 'tek'; }
  function takipte() { return !S.lider && oturumVar(); }      /* başka cihazı izliyor */

  /* görünürlük: telefon kilitlenince / uyanınca (medya süzgeci, bağlantı yoklama) */
  var GOR = { gizli: 0, acik: 0, girdi: 0 };                 /* son gizlenme, son görünme, son dokunuş */
  function gizliMi() { try { return document.visibilityState === 'hidden'; } catch (e) { return false; } }

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
  function yolAlTek(el, belge) {
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
  function yolBulTek(y, belge) {
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
        var ay = yolAlTek(a, belge).p, puan = 0;
        for (var k = 0; k < Math.min(ay.length, p.length); k++) { if (ay[k] === p[k]) puan++; else break; }
        if (puan > enPuan) { enPuan = puan; en = a; }
      });
      return en;
    }
    return (e && e.tagName && e.tagName.toLowerCase() === etiket) ? e : null;
  }
  /* İÇ ÇERÇEVE (18.10.2026): öğe sayfanın içindeki bir çerçevedeyse (açılır
     sözlük gibi, sitenin kendi sayfası) yolun başına çerçeve zinciri eklenir:
     c = dıştan içe iframe yolları. Öbür cihaz önce o çerçeveyi, sonra öğeyi bulur. */
  function icZincir(dd, belge) {
    var z = [], d = dd, n = 0;
    while (d && d !== belge) {
      if (++n > 3) return null;
      var fe = null;
      try { fe = d.defaultView && d.defaultView.frameElement; } catch (e) { return null; }
      if (!fe || !fe.ownerDocument) return null;
      z.unshift(yolAlTek(fe, fe.ownerDocument));
      d = fe.ownerDocument;
    }
    return d === belge ? z : null;
  }
  function yolAl(el, belge) {
    var dd = el && el.ownerDocument;
    if (dd && belge && dd !== belge) {
      var z = icZincir(dd, belge);
      if (z && z.length) { var y = yolAlTek(el, dd); y.c = z; return y; }
    }
    return yolAlTek(el, belge);
  }
  function icBelge(c, belge) {
    var d = belge;
    for (var i = 0; i < c.length; i++) {
      var f = yolBulTek(c[i], d);
      if (!f || f.tagName !== 'IFRAME') return null;
      try { d = f.contentDocument; } catch (e) { return null; }
      if (!d || !d.body) return null;
    }
    return d;
  }
  function yolBul(y, belge) {
    if (y && y.c && y.c.length) { var d = icBelge(y.c, belge); return d ? yolBulTek(y, d) : null; }
    return yolBulTek(y, belge);
  }
  function yolMetniTek(y) { return y.k + '/' + (y.p || []).join('.') + '/' + y.f; }
  function yolMetni(y) {
    if (!y) return 'b';
    return (y.c && y.c.length ? y.c.map(yolMetniTek).join('>') + '>' : '') + yolMetniTek(y);
  }
  /* öğenin kendi penceresi (iç çerçevedeyse onunki) */
  function penceresi(el, w) {
    try { return (el && el.ownerDocument && el.ownerDocument.defaultView) || w; } catch (e) { return w; }
  }

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
    '.th-cubuk .th-hedef{height:26px;max-width:220px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;border-radius:8px;',
    ' padding:0 8px;font:700 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}',
    '.th-cubuk .th-hedef option{color:#0f2a43}',
    '.th-kutu .th-adsatir{margin:10px 0 0;color:#334155;font:600 14px/1.5 system-ui,sans-serif}',
    '.th-kutu .th-adsatir b{color:#0f2a43}',
    '.th-kutu .th-adver{margin-inline-start:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#0E7C66;border-radius:999px;padding:4px 10px;',
    ' font:700 12px/1 system-ui,sans-serif;cursor:pointer}',
    '.th-kutu .th-adver:hover{background:#e8f6f2}',
    '.th-dug{height:26px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;border-radius:8px;padding:0 10px;',
    ' font:700 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}',
    '.th-dug:hover{background:rgba(255,255,255,.2)}',
    '.th-dug[aria-pressed="true"]{background:#f59e0b;border-color:#f59e0b;color:#1f2937}',
    '.th-dug.th-kip[aria-pressed="true"]{background:#16A085;border-color:#16A085;color:#fff}',
    '.th-dug.kirmizi{background:#dc2626;border-color:#dc2626}',
    '.th-dug svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '@media (max-width:820px){.th-dug span{display:none}.th-cip{max-width:42vw}}',
    'body.th-yansit .th-cerceve{top:36px;height:calc(100% - 36px)}',
    /* TELEFONDA KUMANDA TUŞU (21.10.2026): çubuk yok, çerçeve tam boy, yüzen tuş + panel */
    'body.th-yansit.th-mobil .th-cerceve{top:0;height:100%}',
    'body.th-mobil .th-cubuk{display:none}',
    '.th-ktus{position:fixed;z-index:46;width:58px;height:58px;border-radius:50%;border:2px solid rgba(255,255,255,.75);padding:0;',
    ' background:#0f2a43;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;',
    ' cursor:pointer;touch-action:none;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}',
    '.th-ktus svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.th-ktus .th-nokta{position:absolute;top:-1px;right:-1px;width:14px;height:14px;border:2px solid #fff;box-shadow:none}',
    '.th-ktus.acik{background:#16A085}',
    '.th-ktus.suruk{opacity:.8;transform:scale(1.06)}',
    '.th-kperde{position:fixed;inset:0;z-index:44;background:transparent}',
    '.th-kpanel{position:fixed;z-index:45;width:min(360px,calc(100vw - 20px));box-sizing:border-box;background:#0f2a43;color:#fff;border-radius:18px;padding:12px;',
    ' box-shadow:0 18px 48px rgba(0,0,0,.42);font:600 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.th-kpanel .th-bas{display:flex;align-items:center;gap:8px;margin:2px 2px 10px;min-width:0}',
    '.th-kpanel .th-isim{display:flex;align-items:center;gap:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:none;max-width:55%}',
    '.th-kpanel .th-cip{flex:1}',
    '.th-kpanel .th-hedef{display:block;width:100%;height:38px;margin:0 0 10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);',
    ' color:#fff;border-radius:10px;padding:0 10px;font:700 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.th-kpanel .th-hedef option{color:#0f2a43}',
    '.th-kpanel .th-tuslar{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.th-kpanel .th-dug{height:44px;border-radius:12px;font-size:14px;justify-content:center;padding:0 10px}',
    '.th-kpanel .th-dug span{display:inline}',
    '.th-kpanel .th-dug svg{width:17px;height:17px}',
    '.th-kpanel .th-dug.kirmizi{grid-column:1/-1}',
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
    /* tahta: tam ekrandan çıkış — sol ortada, soluk (18.10.2026) */
    '.th-tamcik{position:fixed;left:10px;top:50%;transform:translateY(-50%);z-index:45;width:52px;height:52px;padding:0;',
    ' display:flex;align-items:center;justify-content:center;border:1.5px solid rgba(255,255,255,.55);border-radius:16px;',
    ' background:rgba(15,42,67,.55);color:#fff;opacity:.28;cursor:pointer;-webkit-tap-highlight-color:transparent;',
    ' box-shadow:0 6px 18px rgba(0,0,0,.18);transition:opacity .2s, transform .15s}',
    '.th-tamcik:hover,.th-tamcik:focus-visible,.th-tamcik:active{opacity:.95}',
    '.th-tamcik:active{transform:translateY(-50%) scale(.94)}',
    '.th-tamcik svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
    '.th-kutu .th-unut{display:inline-block;margin-top:14px;color:#64748b;font:600 13px/1.3 system-ui,sans-serif;text-decoration:underline;cursor:pointer;background:none;border:0;padding:4px}',
    /* kumanda kaldığı yerden açılırken (yalnız kumandada; tahtada hiç görünmez) */
    '.th-devam{position:fixed;left:0;right:0;top:36px;bottom:0;z-index:24;display:flex;align-items:center;justify-content:center;padding:20px;',
    ' background:rgba(255,255,255,.96);color:#0f2a43;font:700 15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center}',
    '.th-devam i{display:inline-block;width:20px;height:20px;margin:0 10px 0 0;vertical-align:-4px;border-radius:50%;',
    ' border:3px solid #cbd5e1;border-top-color:#16A085;animation:thDon .8s linear infinite}',
    '@keyframes thDon{to{transform:rotate(360deg)}}',
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
    kumanda: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2.5"/><circle cx="12" cy="7" r="1.1"/><path d="M10 11.5h4M10 15h4M10 18.5h4"/></svg>',
    tam: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    tamcik: '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
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
  function bekleGoster(tur, ek) {
    var b = $('thBekle');
    if (!tur) { b.hidden = true; return; }
    var ic = '';
    /* bu tahtanın adı ve açık sınıfı (lider seçerken görür) + «Tahtaya ad ver» */
    var adSatir = '';
    if (CIHAZ === 'tahta') {
      var sn = acikSinif();
      adSatir = '<p class="th-adsatir"><b>' + kac(tahtaAdi() || tahtaAdiVarsayilan()) + '</b>' +
        (sn ? ' · ' + kac(sn.acik ? kd('th.acik_sinif', 'açık sınıf: {s}', { s: sn.ad }) : kd('th.son_sinif', 'son sınıf: {s}', { s: sn.ad })) : '') +
        ' <button type="button" class="th-adver" data-th="ad">' + kac(kd('th.ad_ver', 'Tahtaya ad ver')) + '</button></p>';
    }
    if (tur === 'baska') {
      ic = cizim() + '<h1>' + kac(kd('th.baska_bas', 'Yansıtma başka bir tahtaya gidiyor')) + '</h1>' +
        '<p>' + kac(kd('th.baska_alt', 'Öğretmen {ad} tahtasını seçti. Bilgisayarın üst şeridindeki «Tahta» seçicisinden bu tahta seçilince burada da görünür.',
                        { ad: (ek && ek.baskaAd) || kd('th.baska_tahta', 'başka bir') })) + '</p>' + adSatir +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="tam">' + kac(kd('th.tam_ekran', 'Tam ekran')) + '</button>' +
        '<button type="button" class="th-ikinci" data-th="cik">' + kac(kd('th.cik', 'Çık')) + '</button></div>';
    } else if (tur === 'giris') {
      ic = '<h1>' + kac(kd('th.giris_bas', 'Önce giriş yap')) + '</h1>' +
        '<p>' + kac(kd('th.giris_alt', 'Tahtaya yansıtma, bilgisayarla tahtada aynı hesapla giriş yapınca çalışır.')) + '</p>' +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="anasayfa">' + kac(kd('th.anasayfaya', 'Ana sayfaya git')) + '</button></div>';
    } else if (tur === 'vt') {
      ic = '<h1>' + kac(kd('th.vt_bas', 'Tahta bağlantısı kurulamadı')) + '</h1>' +
        '<p>' + kac(kd('th.vt_alt', 'İnternet bağlantını kontrol et. Sorun sürerse site yöneticisine haber ver.')) + '</p>' +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="yenile">' + kac(kd('th.tekrar', 'Tekrar dene')) + '</button>' +
        '<button type="button" class="th-ikinci" data-th="cik">' + kac(kd('th.cik', 'Çık')) + '</button></div>';
    } else {   /* izle: bilgisayar bekleniyor */
      ic = cizim() + '<h1>' + kac(kd('th.bekle_bas', 'Bilgisayarını bekliyorum')) + '</h1>' + adSatir +
        '<p>' + kd('th.bekle_alt', 'Bilgisayarında kidefarapca.com’da başlıktaki ekran simgesine (<span class="th-adim">Tahtaya yansıt</span>) dokun, sonra <span class="th-adim">Bu bilgisayardan yansıt</span>’a bas. Açtığın her şey burada görünecek.') + '</p>' +
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="tam">' + kac(kd('th.tam_ekran', 'Tam ekran')) + '</button>' +
        '<button type="button" class="th-ikinci" data-th="cik">' + kac(kd('th.cik', 'Çık')) + '</button></div>' +
        /* tahta cihazında seçim paneli artık yok (sistem/tahtagir.js): işaret buradan kalkar */
        '<button type="button" class="th-unut" data-th="unut">' + kac(kd('th.p_unut', 'Bu cihaz tahta değil')) + '</button>';
    }
    b.innerHTML = '<div class="th-kutu">' + ic + '</div>';
    b.setAttribute('data-tur', tur);
    b.hidden = false;
  }

  /* TAM EKRAN — tarayıcılar sayfanın kendi kendine tam ekrana geçmesine
     yalnız bir dokunuştan hemen sonra izin veriyor: yansıtma başlayınca
     denenir, olmazsa sol ortadaki soluk tuşla geçilir (eskiden tahtadaki
     ilk dokunuşta). Kabuk hiç değişmediği için sonraki sayfalarda tam
     ekran sürer. */
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
  /* "TAM EKRAN İÇİN EKRANA DOKUN" UYARISI KALKTI (18.10.2026) — öğretmen:
     "yansıtmayı başlayınca akıllı tahtada bi yere basıp tam ekran yapma
     uyarısı olmasın, tam ekrandan çıkma için kullandığımız saydam svg gibi
     tam ekran yapmak için de kullanılsın". Tahtaya dokunmak artık tam
     ekrana geçirmiyor (sayfa dokunuşla birden büyümesin); sol ortadaki soluk
     yüzen tuş tam ekran değilken "Tam ekrana geç", tam ekrandayken "Tam
     ekrandan çık" (tamTusTazele). Yansıtma başlarken bir kez kendiliğinden
     denenir; tarayıcı izin verirse (uygulama kipi, kiosk) doğrudan geçer. */
  function ipucuGoster() { ipucuGizle(); }
  function ipucuGizle() { var p = $('thIpucu'); if (p) p.hidden = true; }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (t) {
    document.addEventListener(t, function () {
      if (tamEkranda()) { TAM.oldu = true; ipucuGizle(); }
      else if (TAM.oldu) { TAM.oldu = false; TAM.istek = false; }     /* öğretmen kendisi çıktı: bu yansıtmada zorlanmaz */
      tamTusTazele();
    });
  });
  /* TAM EKRANDAN ÇIKIŞ TUŞU (18.10.2026) — öğretmen: "akıllı tahta olarak
     ekran yansıtılan cihazda tam ekran olduktan sonra her zaman tam ekrandan
     çıkmak için bi yüzen tuş olsun ekranın bi yerinde hafif soluk bi
     şekilde dursun, bu yer ekranın sol ortasında olsun". Yalnız tahtada,
     tarayıcının tam ekranı açıkken görünür (ana ekrana eklenmiş uygulama
     kipinde çıkılacak tam ekran yok). Kabuğun içinde durur: dokunuşu
     çerçevedeki sayfaya ve bilgisayara gitmez. */
  /* 18.10.2026 (akşam): aynı soluk tuş tam ekran DEĞİLKEN tam ekrana geçirir.
     Ana ekrana eklenmiş uygulama tam ekran kipinde açıldıysa (çıkılacak ya
     da girilecek tam ekran yok) tuş görünmez. */
  function tamTusTazele() {
    if (CIHAZ !== 'tahta' || !document.body) return;
    var d = document, acik = !!(d.fullscreenElement || d.webkitFullscreenElement);
    var el = d.documentElement, destek = !!(el.requestFullscreen || el.webkitRequestFullscreen);
    var uyg = false;
    try { uyg = !!(window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches) && !acik; } catch (e) { }
    var b = $('thTamCik');
    if (!b) {
      if (!(acik || (destek && !uyg))) return;
      stilKur();
      b = d.createElement('button');
      b.type = 'button';
      b.id = 'thTamCik';
      b.className = 'th-tamcik';
      d.body.appendChild(b);
    }
    var is = acik ? 'tamcik' : 'tam';
    if (b.getAttribute('data-th') !== is) {
      b.setAttribute('data-th', is);
      b.title = acik ? kd('th.tam_cik', 'Tam ekrandan çık') : kd('th.tam_gec', 'Tam ekrana geç');
      b.setAttribute('aria-label', b.title);
      b.innerHTML = acik ? SVG.tamcik : SVG.tam;
    }
    b.hidden = !(acik || (destek && !uyg));
  }
  function tamCikTazele() { tamTusTazele(); }
  function tamCik() {
    var d = document;
    try {
      var f = d.exitFullscreen || d.webkitExitFullscreen;
      if (f && (d.fullscreenElement || d.webkitFullscreenElement)) { var p = f.call(d); if (p && p.catch) p.catch(function () { }); }
    } catch (e) { }
  }

  function cik(adres) {
    var k = S.kok, liderdim = S.lider;
    S.lider = false; S.kok = null;
    try {
      if (k) k.child('yayin').onDisconnect().cancel();
      if (k && CIHAZ === 'bilgisayar') {
        /* "Bitir": ders bitti (bitir) — tahta onu üstlenmez, ana sayfa kumandaya geri dönmez */
        k.update({ 'yayin/cevrimici': false, 'yayin/bitir': true, 'yayin/vekil': null, 'yayin/ts': TS(), 'olay': null, 'kay': null, 'alan': null, 'ayar/perde': false, 'ayar/kg': false });
        k.child('izle/' + BEN).remove();
        try { localStorage.removeItem('kidef_kumanda_son'); } catch (e) { }
      } else if (k) {
        /* "Çık": aynı yansıtma sürdükçe ana sayfa tahtayı geri sürüklemesin
           (sistem/tahtagir.js bakar; yeni yansıtmada tahta yine kendiliğinden açılır) */
        try { localStorage.setItem('kidef_tahta_birakti', JSON.stringify({ bas: (S.yayin && S.yayin.bas) || null, t: Date.now() })); } catch (e) { }
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
    else if (is === 'tam') { TAM.istek = true; tamEkran(); setTimeout(tamTusTazele, 400); }
    else if (is === 'tamcik') tamCik();
    else if (is === 'ad') {
      var yeniAd = window.prompt(kd('th.ad_sor', 'Bu tahtanın adı (ör. 7-A sınıfı):'), tahtaAdi() || tahtaAdiVarsayilan());
      if (yeniAd === null) return;
      tahtaAdiYaz(yeniAd);
      if (S.kok) varlikYaz(false);
      var bk = $('thBekle');
      if (bk && !bk.hidden) { var bt = bk.getAttribute('data-tur'); if (bt) bekleGoster(bt, S.yayin); }
      bildir(kd('th.ad_kaydedildi', 'Tahtanın adı: {ad}', { ad: tahtaAdi() || tahtaAdiVarsayilan() }));
    }
    else if (is === 'unut') {
      try { localStorage.removeItem('kidef_tahta_cihaz'); localStorage.removeItem('kidef_tahta_birakti'); } catch (e) { }
      cik('index.html');
    }
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
        if (S.kok) {
          var k = S.kok; S.kok = null; S.lider = false; try { k.child('izle/' + BEN).remove(); } catch (e) { }
          /* çıkışta artık yazma izni yok: bağlantı bir an kesilip açılınca sunucu bu
             cihazın "kopunca" işlerini (varlık silme, liderse yayını kapatma) kendisi
             yapar — tahta "bağlı" görünüp kalmaz (18.10.2026) */
          try { vt.goOffline(); setTimeout(function () { try { vt.goOnline(); } catch (e) { } }, 400); } catch (e) { }
        }
        bekleGoster('giris'); return;
      }
      /* GERİ GELEN ESKİ OTURUM (21.10.2026): tahta kapatılıp ertesi gün açılınca
         kabuk saklanan oturumla "bekliyorum" ekranında girişli kalıyordu
         (hesap/oturumguvenlik.js çerçevede yüklü değilken 40 dk kuralı işlemiyordu).
         Girişin üstünden 2 dakikadan çok geçmişse ve son hareketin (kg_son_hareket)
         ya da girişin üstünden 40 dakika geçmişse tahta açılışta çıkar. */
      if (CIHAZ === 'tahta' && !bayatBakildi) {
        bayatBakildi = true;
        if (bayatOturum(u)) {
          try { auth.signOut(); } catch (e) { }
          bekleGoster('giris'); return;
        }
      }
      S.uid = u.uid;
      hazir(vt.ref('tahta/' + u.uid));
    });
  }
  var bayatBakildi = false;
  function bayatOturum(u) {
    var giris = 0, son = 0;
    try { giris = Date.parse((u && u.metadata && u.metadata.lastSignInTime) || '') || 0; } catch (e) { }
    if (!giris || Date.now() - giris < 2 * 60000) return false;
    try { son = parseInt(localStorage.getItem('kg_son_hareket') || '0', 10) || 0; } catch (e) { }
    return Date.now() - Math.max(son, giris) >= 40 * 60000;
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
      /* d: bu cihazda açık sayfanın sayacı — dönen kumanda tahtanın dersi tuttuğunu buradan anlar */
      var v = { cevrimici: true, cihaz: CIHAZ, ts: TS(), gecikme: zOrtalama(), d: S.lider ? Y.d : Z.d };
      if (CIHAZ === 'tahta') { var tk = tahtaKaydi(); for (var ta in tk) if (has(tk, ta)) v[ta] = tk[ta]; }
      if (iste) {
        Z.esitJeton = rastgeleId(); v.iste = Z.esitJeton; v.isteZ = TS();
        /* bu sayfa için yapılmış bütün istekler: hangisinin cevabı önce gelirse o uygulanır, öbürleri atlanır */
        Z.esitJetonlar.push(Z.esitJeton); if (Z.esitJetonlar.length > 8) Z.esitJetonlar.shift();
        Z.esitIstZ = SIMDI();
      }
      r.update(v);
    } catch (e) { }
  }

  /* ======================================================= LİDER (yayın)
     Bu cihaz kullanılıyorken çalışır: hareketleri veritabanına yazar. */
  var Y = {
    n: 0, d: Math.floor(SIMDI() / 1000) * 100,      /* sayfa sayacı: her oturumda öncekilerden büyük başlar */
    s0: 0, belge: null, win: null, durak: false, durakD: -1, durakG: 0, durakYeni: [],
    gunluk: [], gSay: 0, aktif: null, alanSon: {}, alanIz: [], kayBek: {}, kayZ: null, kaySon: 0,
    sonTik: null, kgPerde: false, gecisZ: 0,
    vekil: null,     /* tahta, uyuyan kumandanın yerine dersi tutuyor: { id: kumanda, z: koptuğu an } */
    bek: {}          /* lider değilken (yanlışlıkla) gelen başka cihaz olayları: devirde uygulanır */
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
    var y = { id: BEN, cihaz: CIHAZ, cevrimici: true, d: Y.d, u: b.u, dil: b.dil, s0: Y.s0, durak: false, ts: TS(),
              bas: S.bas || (S.yayin && S.yayin.bas) || null };          /* oturum kimliği korunur (lider değişse de) */
    if (Y.vekil) y.vekil = Y.vekil.id;                                     /* tahta, uyuyan kumanda adına tutuyor */
    /* hedef tahta: bilgisayar seçimini yazar; tahta liderse (dokunuş, vekil) yayındaki hedef korunur */
    if (CIHAZ === 'bilgisayar') { y.hedef = S.hedefTahta || null; y.hedefAd = S.hedefTahta ? (S.hedefTahtaAd || null) : null; }
    else { var eh = S.yayin || Z.sonCanli; y.hedef = (eh && eh.hedef) || null; y.hedefAd = (eh && eh.hedef && eh.hedefAd) || null; }
    g['yayin'] = y;
    if (temizle) { g['kay'] = null; g['alan'] = null; }
    S.kok.update(g);
    kumandaSonYaz();
  }
  /* bu cihaz bir dersin kumandası (bilgisayar/telefon): site yeniden açılınca
     ana sayfa buraya döner (sistem/tahtagir.js) — "Bitir" bunu siler */
  var kumandaSonZ = 0;
  function kumandaSonYaz(zorla) {
    if (CIHAZ !== 'bilgisayar' || !S.kok || !S.uid) return;
    var z = SIMDI();
    if (!zorla && z - kumandaSonZ < 20000) return;
    var bas = S.bas || (S.yayin && S.yayin.bas) || null;
    if (!bas) return;
    kumandaSonZ = z;
    try { localStorage.setItem('kidef_kumanda_son', JSON.stringify({ uid: S.uid, bas: bas, ben: BEN, t: z })); } catch (e) { }
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
    Y.gunluk = []; Y.alanSon = {}; Y.alanIz = []; Y.kayBek = {}; Y.bek = {};
    Y.vekil = null;            /* vekil tahtada sayfa değişti: dönen kumanda tahtadaki hâli alır */
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
  /* öğenin yolu — öğe bu sayfanın ya da bu sayfadaki bir iç çerçevenin değilse null */
  function liderYolu(el) {
    if (!el || !Y.belge) return null;
    var y = yolAl(el, Y.belge);
    if (el.ownerDocument !== Y.belge && !(y.c && y.c.length)) return null;
    return y;
  }
  function yTik(e) {
    if (!e.isTrusted || !S.lider) return;
    var el = hedefOge(e);
    if (!el || !Y.belge) return;
    var yol = liderYolu(el);
    if (!yol) return;
    var s = yeniTohum();
    var ew = penceresi(el, Y.win), ic = ew !== Y.win;
    tohumla(Y.win, s);
    if (ic) tohumla(ew, s);
    var o = { t: 'k', y: yol, s: s, c: [] };
    Y.aktif = o;
    Y.sonTik = { z: SIMDI(), el: el };
    var w = Y.win;
    setTimeout(function () {
      if (Y.aktif === o) Y.aktif = null;
      if (o.gecis) return;
      var a = el.closest ? el.closest('a[href]') : null;
      if (a && !ic && !e.defaultPrevented && gidenBaglanti(a, w)) return;   /* sayfa değişecek: adresle gider */
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
    var govde = !el || el === Y.belge.body || el === Y.belge.documentElement;
    var yol = govde ? null : liderYolu(el);
    if (!govde && !yol) return;
    var s = null;
    if (e.type === 'keydown') {
      s = yeniTohum(); tohumla(Y.win, s);
      var ew = penceresi(el, Y.win);
      if (ew !== Y.win) tohumla(ew, s);
    }
    var o = {
      t: 'b', e: e.type === 'keyup' ? 'u' : 'd', k: e.key, c: e.code || '', kc: e.keyCode || 0,
      m: (e.ctrlKey ? 1 : 0) | (e.shiftKey ? 2 : 0) | (e.altKey ? 4 : 0) | (e.metaKey ? 8 : 0),
      y: yol, s: s, c2: []
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
    var yol = liderYolu(f);
    if (!yol) return;
    var o = { t: 'g', y: yol };
    setTimeout(function () { olayGonder(o); }, 0);
  }
  function yMedya(e) {
    if (!S.lider) return;
    var m = e.target;
    if (!m || !/^(VIDEO|AUDIO)$/.test(m.tagName) || !Y.belge) return;
    var yol = liderYolu(m);
    if (!yol) return;
    var o = { t: 'm', y: yol, e: e.type, zt: Math.round((m.currentTime || 0) * 100) / 100, hz: m.playbackRate || 1 };
    /* KUMANDA KİLİTLENİRKEN (18.10.2026): telefon kilitlenince tarayıcı videoyu
       kendisi durdurur; bu "durdur" tahtaya gitmemeli, tahtada video sürmeli.
       Bu cihazda dokunuş yokken gelen oynat/durdur bir an bekletilir: o arada
       sayfa gizlendiyse (ya da cihaz az önce uyandıysa) gönderilmez. */
    if (CIHAZ === 'bilgisayar' && (e.type === 'pause' || e.type === 'play') && SIMDI() - GOR.girdi > 1500) {
      if (gizliMi() || SIMDI() - GOR.acik < 1500) return;
      var belge = Y.belge;
      setTimeout(function () {
        if (gizliMi() || SIMDI() - GOR.gizli < 1500 || !S.lider || Y.belge !== belge) return;
        olayGonder(o);
      }, 700);
      return;
    }
    olayGonder(o);
  }
  /* --- yazı alanları: girişte ve kod değiştirdiğinde (ekran klavyesi) */
  function alanAnahtar(el) { return 'a' + ozet(yolMetni(yolAl(el, Y.belge))); }
  function alanIzle(el) {
    if (!izlenecekAlan(el)) return;
    if (Y.alanIz.indexOf(el) < 0) { Y.alanIz.push(el); if (Y.alanIz.length > 60) Y.alanIz.shift(); }
  }
  function alanTara() {
    if (!Y.belge) return;
    [Y.belge].concat(icBelgeler(Y.belge)).forEach(function (d) {
      try {
        var l = d.querySelectorAll('textarea, input, select');
        for (var i = 0; i < l.length && i < 120; i++) alanIzle(l[i]);
      } catch (e) { }
    });
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
      var y = liderYolu(el);
      if (!y) return;                                   /* eski bir iç çerçevenin alanı */
      var v = String(el.value == null ? '' : el.value);
      if (v.length > 20000) v = v.slice(0, 20000);
      var k = 'a' + ozet(yolMetni(y));
      if (Y.alanSon[k] === v) return;
      Y.alanSon[k] = v;
      g[k] = { d: Y.d, y: y, v: v, z: sunucuZaman() };
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
    /* kumanda gizliyken ya da uyanır uyanmaz (dokunuş yokken) tarayıcının kendi
       kaydırması tahtaya gitmez: tahtada sıçrama olmasın */
    if (CIHAZ === 'bilgisayar' && (gizliMi() || (SIMDI() - GOR.acik < 1500 && GOR.girdi < GOR.acik))) return;
    var t = e.target, d = Y.belge;
    /* iç çerçevenin kendi sayfası kaydı: çerçeve öğesiyle anılır (ic) */
    if (t && t.nodeType === 9 && t !== d) {
      var fe = null;
      try { fe = t.defaultView && t.defaultView.frameElement; } catch (x) { }
      var fy = fe ? liderYolu(fe) : null;
      if (fy) { Y.kayBek['i' + ozet(yolMetni(fy))] = fe; kayZamanla(); }
      return;
    }
    var belgeMi = (t === d || t === d.documentElement || t === d.body || t === d.scrollingElement);
    if (belgeMi) Y.kayBek.b = true;
    else if (t && t.nodeType === 1) {
      var ty = liderYolu(t);
      if (ty) Y.kayBek['e' + ozet(yolMetni(ty))] = t;
    }
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
        var y = liderYolu(el);
        if (!y) continue;
        var ic = k.charAt(0) === 'i', se = el;
        if (ic) {                                     /* iç çerçevenin sayfası */
          try { var dd = el.contentDocument; se = dd && (dd.scrollingElement || dd.documentElement); } catch (x) { se = null; }
          if (!se) continue;
        }
        var my = se.scrollHeight - se.clientHeight, mx = se.scrollWidth - se.clientWidth;
        g[k] = { d: Y.d, y: y, f: my > 0 ? Math.round(se.scrollTop / my * 100000) / 100000 : 0,
                 x: mx > 0 ? Math.round(se.scrollLeft / mx * 100000) / 100000 : 0, z: sunucuZaman() };
        if (ic) g[k].ic = 1;
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
    /* iç çerçeveler: sayfaları ve içte kayan kutuları */
    icBelgeler(Y.belge).forEach(function (dd) {
      try {
        var fe = dd.defaultView.frameElement, se = dd.scrollingElement || dd.documentElement;
        var fy = fe && liderYolu(fe);
        if (fy && (se.scrollTop > 0 || se.scrollLeft > 0)) Y.kayBek['i' + ozet(yolMetni(fy))] = fe;
        var l2 = dd.querySelectorAll('*'), m = 0;
        for (var j = 0; j < l2.length && m < 12; j++) {
          var el2 = l2[j];
          if ((el2.scrollTop > 0 || el2.scrollLeft > 0) && el2 !== dd.documentElement && el2 !== dd.body) {
            var y2 = liderYolu(el2);
            if (y2) { Y.kayBek['e' + ozet(yolMetni(y2))] = el2; m++; }
          }
        }
      } catch (e) { }
    });
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
    gezSay: { d: null, n: 0, z: 0 }, gunluk: [], esit: null, esitJeton: null, esitJetonlar: [], esitIstZ: 0, esitAkis: false, bosluk: null,
    katilma: Infinity, boslukZ: null, adresZ: null, ayrildiZ: null, sonBildirilen: null, ofsetGeldi: false,
    /* 18.10.2026: sonCanli = liderin en son canlı yayını; uzak = lider koptu ("Bitir"
       değil) { z, id }; sonBas = tam ekranın denendiği son yansıtma oturumu */
    sonCanli: null, uzak: null, vekilZ: null, sonBas: undefined, sonBildirilenD: null
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
      else { GECMIS.yerine = true; w.location.replace(y.u || 'index.html'); }
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
    if (S.yayin && S.yayin.baska) return;                         /* hedef başka tahta: olaylar uygulanmaz (dönünce geçmiş istenir) */
    if (S.lider) {
      /* lider bizken başka cihazdan gelen olay: uyanan kumandanın, bağlantısı
         gelmeden yaptığı dokunuşlar. Devirde (liderBirak) uygulanır. */
      if (o.i !== BEN && !o.hd && o.d === Y.d) Y.bek[o.n] = o;
      return;
    }
    if (o.i !== Z.yayinId) return;
    if (Z.sonN != null && o.n <= Z.sonN) return;
    if (o.hd && o.hd !== BEN) o = { n: o.n, d: o.d, bos: true };   /* başka cihazın eşitlemesi: yalnız sıra tutulur */
    else zGecikme(o.z);                                         /* gecikme: veritabanından geliş anında */
    Z.bek[o.n] = o;
    zIsle();
  }
  function esitSil() { Z.esit = null; Z.esitJeton = null; Z.esitJetonlar = []; }
  function isaretIsle(o) {                     /* eşitleme işareti (t:'es') */
    if (!o.hd) { esitSil(); Z.esitAkis = false; return; }   /* "Eşitle": herkes baştan */
    if (o.hd !== BEN) return;
    if (o.ist && Z.esitJetonlar.indexOf(o.ist) >= 0) {
      esitSil(); Z.esitAkis = true;
      S.esitBekle = false;                     /* geçmiş geliyor (sırayla, bu işaretin ardından) */
      if (S.devam) devamZamanla();
    }
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
      if (o.hd === BEN && S.devam) devamZamanla();                  /* kumanda: geçmiş bitince perde kalkar */
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
    Z.esit = { z: SIMDI(), tekrar: 0 }; Z.esitJetonlar = [];      /* sayfa yeniden açılıyor: eski isteklerin cevabı geçmez */
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
      if (el) {
        var ew = penceresi(el, w);                          /* iç çerçevedeki öğe: kendi penceresiyle */
        if (ew !== w && o.s != null) tohumla(ew, o.s);
        zTikla(ew, el);
      }
    } else if (o.t === 'b') {
      var h = o.y ? yolBul(o.y, d) : null;
      if (o.y && !h && o.y.c) { Z.cevap = []; return; }  /* iç çerçeve henüz açılmadı */
      var hh = h || d.activeElement || d.body;
      if (hh && hh.tagName === 'IFRAME' && !h) hh = d.body;   /* odak iç çerçevedeyse tuş sayfaya */
      var hw = penceresi(hh, w);
      if (hw !== w && o.s != null) tohumla(hw, o.s);
      zTusla(hw, hh, o);
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
          if (s.ic) {                                 /* iç çerçevenin sayfası */
            var dd = el.contentDocument;
            el = dd && (dd.scrollingElement || dd.documentElement);
            if (!el) continue;
          }
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
        var ew = penceresi(el, w);
        el.value = a.v;
        el.dispatchEvent(new ew.Event('input', { bubbles: true }));
        if (el.tagName === 'SELECT' || el.type === 'range' || el.type === 'color') el.dispatchEvent(new ew.Event('change', { bubbles: true }));
      } catch (e) { }
    }
  }

  /* ============================================== LİDERLİK (kim kullanıyor)
     Bilgisayar her zaman kontrolü alabilir; tahta yalnız "Tahtadan da
     kullan" açıkken, yansıtma sürüp duraklatılmamışken ve aynı sayfa
     tamamen yüklenip eşitlenmişken. */
  function dokunuldu() {
    hareketYaz();
    GOR.girdi = SIMDI();
    if (!S.kok) return;
    if (S.lider) { if (Y.vekil) vekilBitir(); return; }   /* vekil tahtaya dokunuldu: artık tahtadan kullanılıyor */
    if (CIHAZ === 'tahta') {
      if (!cift()) return;
      if (!oturumVar()) {
        /* kumanda uykuda: dokunulan tahta dersi üstlenir (kumanda dönünce tahtadakini alır) */
        if (uzaktaMi() && vekilOl()) vekilBitir();
        return;
      }
      if (S.yayin.durak) return;
      if (!Z.hazir || !Z.belge || Z.d !== S.yayin.d || Z.esit) return;
    } else if (S.devam) return;    /* kumanda tahtadaki dersle eşitlenirken kontrolü almaz: tahta yenilenmesin */
    liderOl();
  }
  function liderOl() {
    if (S.lider || !S.kok) return;
    var w = CERCEVE.contentWindow, belge = null, y = S.yayin;
    /* lider az önce koptuysa (uyku, ağ) son canlı hâli esas alınır: aynı sayfadaysak hiçbir yer yenilenmez */
    var yy = (y && y.cevrimici) ? y : ((Z.sonCanli && !(y && y.bitir)) ? Z.sonCanli : null);
    try { belge = w.document; } catch (e) { }
    var ayni = !!(belge && Z.belge === belge && yy && Z.d === yy.d && !Z.esit && belge.readyState !== 'loading');
    if (ayni) { Z.hazir = true; try { zIsle(); } catch (e) { } }     /* gelmiş olaylar önce uygulanır */
    S.lider = true;
    S.esitBekle = false;
    if (S.devam) devamTamam();
    Y.win = w; Y.belge = belge;
    Y.durak = false; Y.durakYeni = []; Y.aktif = null; Y.alanSon = {}; Y.alanIz = []; Y.kayBek = {}; Y.vekil = null; Y.bek = {};
    Y.n = Math.max(Y.n, Z.enN);
    if (ayni) {
      Y.d = Z.d;
      Y.s0 = (yy.s0 != null) ? yy.s0 : S.s0;
      Y.gunluk = Z.gunluk.slice();
    } else {
      /* sayfa belli değil: yeni sayfa sayılır, öbür cihaz bu sayfayı açar */
      Y.d = Math.max(Y.d, Z.d, (y && y.d) || 0) + 1;
      Y.s0 = S.s0;
      Y.gunluk = [];
    }
    esitSil(); Z.esitAkis = false; Z.bek = {}; Z.bosluk = null;
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
    Y.aktif = null; clearTimeout(Y.kayZ); Y.kayZ = null; Y.kayBek = {}; Y.durak = false; Y.durakYeni = []; Y.vekil = null;
    Z.win = Y.win; Z.belge = Y.belge; Z.d = Y.d;
    Z.hazir = !!(Y.belge && Y.belge === S.belge);
    Z.gunluk = Y.gunluk.slice();
    Z.yayinId = (y && y.cevrimici) ? y.id : null; Z.sonN = null; Z.bek = {}; Z.gezilen = null;
    esitSil(); Z.esitAkis = false; Z.bosluk = null;
    Z.gecikmeler = []; Z.katilma = sunucuZaman();
    Z.uzak = null; clearTimeout(Z.vekilZ); Z.vekilZ = null;
    /* yeni liderin, devirden önce gelmiş olayları (uyanan kumandanın ilk dokunuşları) */
    var bek = Y.bek; Y.bek = {};
    for (var n in bek) if (has(bek, n) && Z.yayinId && bek[n].i === Z.yayinId && bek[n].d === Z.d) Z.bek[n] = bek[n];
    kopmaKur();
    if (CIHAZ === 'bilgisayar' && y && y.cevrimici) {
      if (y.cihaz === 'tahta') {
        if (!S.tahtadanDendi) { S.tahtadanDendi = true; bildir(kd('th.b_tahtadan', 'Tahtadan kullanılıyor; bilgisayardan dokununca kontrol yeniden sende.'), 4500); }
      } else bildir(kd('th.b_devralindi', 'Başka bir cihaz yansıtmaya başladı. Bu cihaz durdu.'), 4500);
    }
    if (Z.hazir) { try { zIsle(); } catch (e) { } }
  }

  /* ================================================ KUMANDA UYKUDA (18.10.2026)
     Öğretmen: "kumanda olan cihaz kapanırsa akıllı tahtadan siyah ekran olmadan
     devam edilsin ... tekrar açtığında telefonda kaldığı yerden devam
     edebilmeli, akıllı tahtadan ise bi kapanma veya farklı bi şey olmasın".
     · Kumandanın bağlantısı koptu ("Bitir" değil: telefon kilitlendi, ağ
       değişti, tarayıcı kapandı) → tahtada hiçbir şey değişmez.
     · VEKIL_BEKLE sonra (ya da dönen kumanda sayfanın geçmişini isterse hemen)
       tahta dersi görünmeden ÜSTLENİR: lider olur, sayfanın geçmişini tutar,
       yayında "vekil: <kumanda>" yazar. Tahtada yenileme yok.
     · Kumanda aynı sayfayla uyanırsa (vekil kendisi, sayfa aynı) sessizce geri
       alır. Tahtaya bu arada dokunulduysa vekillik biter, tahta asıl lider
       olur; dönen kumanda tahtadaki hâli alır (yalnız kumanda yenilenir).
     · Birden çok tahta varsa yalnız biri (kimliği en küçük olan) üstlenir. */
  function uzaktaMi() { return !!(Z.uzak && !(S.yayin && S.yayin.bitir)); }
  function vekilAday() {
    if (CIHAZ !== 'tahta' || !S.kok || S.lider || oturumVar()) return false;
    var y = S.yayin, c = Z.sonCanli;
    if (!c || !y || y.bitir || y.durak || c.durak) return false;      /* duraklatılmış ders: tahta son görüntüde bekler */
    if (!Z.hazir || !Z.belge || Z.esit || Z.d !== c.d) return false;
    try { if (Z.belge.readyState === 'loading') return false; } catch (e) { return false; }
    for (var k in S.izle) {
      if (!has(S.izle, k) || k === BEN) continue;
      var t = S.izle[k];
      if (t && t.cevrimici && t.cihaz !== 'bilgisayar' && t.d === c.d && k < BEN) return false;
    }
    return true;
  }
  function vekilOl() {
    if (!vekilAday()) return false;
    var w = CERCEVE.contentWindow, belge = Z.belge, c = Z.sonCanli;
    try { zIsle(); } catch (e) { }                         /* gelmiş olaylar önce */
    S.lider = true;
    Y.win = w; Y.belge = belge;
    Y.durak = false; Y.durakYeni = []; Y.aktif = null; Y.alanIz = []; Y.kayBek = {}; Y.bek = {};
    Y.alanSon = {};
    for (var k in Z.alan) if (has(Z.alan, k) && Z.alan[k] && Z.alan[k].d === Z.d) Y.alanSon[k] = Z.alan[k].v;
    Y.n = Math.max(Y.n, Z.enN);
    Y.d = Z.d; Y.s0 = (c.s0 != null) ? c.s0 : S.s0; Y.gunluk = Z.gunluk.slice();
    Y.vekil = { id: c.id, z: (Z.uzak && Z.uzak.z) || SIMDI() };
    esitSil(); Z.esitAkis = false; Z.bek = {}; Z.bosluk = null;
    clearTimeout(Z.boslukZ); Z.boslukZ = null; clearTimeout(Z.vekilZ); Z.vekilZ = null;
    sonAdres = adresAl(w);
    kopmaKur();
    yayinYaz(false);
    alanTara();          /* yazı alanları artık buradan izlenir (aynı değerler yeniden yazılmaz) */
    /* dönen kumandanın bekleyen "bu sayfanın geçmişi" isteği (yalnız ona gider) */
    for (var h in S.izle) {
      if (!has(S.izle, h) || h === BEN) continue;
      var t = S.izle[h];
      if (t && t.iste && typeof t.isteZ === 'number' && sunucuZaman() - t.isteZ < 15000) yEsitle(h, t.iste);
    }
    arayuzTazele();
    return true;
  }
  function vekilBitir() {            /* vekil tahtaya dokunuldu: tahta asıl lider */
    if (!S.lider || !Y.vekil) return;
    Y.vekil = null;
    yayinYaz(false);
    arayuzTazele();
  }
  function vekilZamanla() {
    if (Z.vekilZ) return;
    Z.vekilZ = setTimeout(function () { Z.vekilZ = null; if (uzaktaMi() && !oturumVar()) vekilOl(); }, VEKIL_BEKLE);
  }
  /* tahta: ders sürüyor mu — ekran uyanık, oturum "hareketli" (40 dk kuralı işlemez) */
  function tahtaCanli() {
    if (CIHAZ !== 'tahta' || !S.kok) return false;
    if (takipte()) return true;                                          /* kumanda bağlı, yönetiyor */
    if (S.lider && Y.vekil) return SIMDI() - Y.vekil.z < UZAK_BEKLE;     /* kumanda uykuda: ders tahtada */
    if (S.lider) return oturumVar() && SIMDI() - GOR.girdi < UZAK_BEKLE; /* tahtadan kullanılıyor */
    if (uzaktaMi()) return SIMDI() - Z.uzak.z < UZAK_BEKLE;              /* kumanda koptu (duraklatılmış ders) */
    return false;
  }
  /* EKRAN UYANIK (18.10.2026): kumandayla ders anlatılırken tahtaya kimse
     dokunmuyor; tahtanın ekran koruyucusu / uyku zamanlayıcısı ekranı
     karartıyordu. Ders sürdükçe ekran uyanık kilidi (Screen Wake Lock) tutulur;
     ders bitince (Bitir, ya da kumanda UZAK_BEKLE'dir yok) bırakılır. */
  var UYANIK = { k: null, istek: false, hata: 0 };
  function uyanikDenetle() {
    if (CIHAZ !== 'tahta') return;
    var iste = tahtaCanli() && !gizliMi();
    var wl = navigator.wakeLock;
    if (iste) {
      if (UYANIK.k || UYANIK.istek || !wl || typeof wl.request !== 'function') return;
      if (UYANIK.hata && SIMDI() - UYANIK.hata < 20000) return;
      UYANIK.istek = true;
      try {
        wl.request('screen').then(function (k) {
          UYANIK.istek = false; UYANIK.k = k; UYANIK.hata = 0;
          try { k.addEventListener('release', function () { if (UYANIK.k === k) UYANIK.k = null; }); } catch (e) { }
          if (!tahtaCanli()) uyanikDenetle();
        }, function () { UYANIK.istek = false; UYANIK.hata = SIMDI(); });
      } catch (e) { UYANIK.istek = false; UYANIK.hata = SIMDI(); }
    } else if (UYANIK.k) {
      var k = UYANIK.k; UYANIK.k = null;
      try { k.release(); } catch (e) { }
    }
  }

  /* ================================================= ÇERÇEVE KÖPRÜSÜ
     Her yeni sayfada, iki rolde de: kontrolü alma, tam ekran, yeni
     pencereler, uyarı ve onaylar, adres değişimi, gönderilecek olaylar,
     kayıt engeli. */
  /* 0) bu cihazda dokunuldu/tuşa basıldı: kontrol bu cihaza geçer (en önce) */
  function dokunusKur(w) {
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (t) {
      try { w.addEventListener(t, function (e) { if (e.isTrusted) dokunuldu(); }, { capture: true, passive: true }); } catch (e) { }
    });
    if (CIHAZ === 'tahta') {
      /* 0b) tahtada dokunuş: ekran uyanık kilidi alınamadıysa yeniden denenir.
         (Dokunuş artık tam ekrana geçirmiyor — sol ortadaki tuş; 18.10.2026.) */
      ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (t) {
        w.addEventListener(t, function (e) { if (e.isTrusted && !UYANIK.k) { UYANIK.hata = 0; uyanikDenetle(); } }, true);
      });
      /* 0c) kontrol alınamadıysa (sayfa yükleniyor, eşitleniyor) dokunuş
         sayfaya gitmesin: tahta bilgisayardan ayrı düşmesin */
      ['pointerdown', 'mousedown', 'touchstart', 'click', 'dblclick', 'contextmenu', 'keydown', 'keypress'].forEach(function (t) {
        var pasif = (t === 'touchstart' || t === 'pointerdown');
        w.addEventListener(t, function (e) {
          /* kumanda uykudayken de: dokunuş ya tahtayı lider yapar ya da sayfaya gitmez */
          if (!e.isTrusted || !(takipte() || (!S.lider && uzaktaMi()))) return;
          e.stopImmediatePropagation();
          if (!pasif && e.cancelable) e.preventDefault();
        }, { capture: true, passive: pasif });
      });
    }
  }
  /* 1) yeni pencere/sekme açan bağlantılar çerçevede açılsın (site dışı gerçek sekmede)
     2) uyarı ve onay pencereleri: izleyen açmaz, liderin cevabını kullanır
     ic: iç çerçeve — yeni sayfa iç çerçevede değil, sayfanın kendisinde açılır */
  function pencereKur(w, ust, ic) {
    var gez = function (href) {
      try { (ic ? CERCEVE.contentWindow : w).location.assign(href); } catch (e) { }
    };
    try {
      w.open = function (url, ad, ozellik) {
        var a = ayniSite(url || '', w.location.href);
        if (takipte()) { if (a) { Z.kendiGezdi = SIMDI(); gez(a.href); } return w; }
        if (a) { Y.gecisZ = SIMDI(); gez(a.href); return w; }
        return window.open(url, ad || '_blank', ozellik);
      };
    } catch (e) { }
    w.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var hedef = (a.getAttribute('target') || '').toLowerCase();
      if (takipte()) {
        if (hedef && hedef !== '_self') e.preventDefault();          /* izleyende yeni sekme açılmasın */
        else if (!ic && gidenBaglanti(a, w)) Z.kendiGezdi = SIMDI();
        return;
      }
      if (!hedef || hedef === '_self') return;
      var u = ayniSite(a.getAttribute('href'), w.location.href);
      if (!u) return;
      e.preventDefault();
      if (Y.aktif) Y.aktif.gecis = true;
      var ilk = SIMDI();
      setTimeout(function () { if (!(Y.gecisZ && Y.gecisZ >= ilk) && S.belge === ust) gez(u.href); }, 0);
    }, true);
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
    gecmisKoru(w, ic);
  }
  /* 4) olaylar — pencereye, yakalama evresinde: sayfanın kendi dinleyicilerinden önce */
  function olayKur(w) {
    w.addEventListener('click', yTik, true);
    w.addEventListener('keydown', yTus, true);
    w.addEventListener('keyup', yTus, true);
    w.addEventListener('input', yAlanOlay, true);
    w.addEventListener('change', yAlanOlay, true);
    w.addEventListener('submit', yGonder, true);
    w.addEventListener('scroll', yKay, true);
    ['play', 'pause', 'seeked', 'ratechange'].forEach(function (t) { w.addEventListener(t, yMedya, true); });
  }
  /* 5) kayıt yalnız liderde */
  function engelKur(w, ust, sure) {
    var bitis = SIMDI() + sure;
    (function engelle() {
      if (S.belge !== ust) return;
      if (yazmaEngelle(w)) return;
      if (SIMDI() < bitis) setTimeout(engelle, 30);
    })();
  }
  function kopruKur(w, d) {
    if (d.__kidefTahtaKopru) return;            /* aynı belge geri geldi: dinleyiciler zaten kurulu */
    d.__kidefTahtaKopru = 1;
    dokunusKur(w);
    pencereKur(w, d, false);
    /* 3) sayfa içi adres değişimi */
    ['pushState', 'replaceState'].forEach(function (ad) {
      try {
        var asil = w.history[ad];
        w.history[ad] = function () { var r = asil.apply(w.history, arguments); setTimeout(adresKontrol, 0); return r; };
      } catch (e) { }
    });
    w.addEventListener('hashchange', adresKontrol);
    w.addEventListener('popstate', adresKontrol);
    olayKur(w);
    engelKur(w, d, 20000);
    /* 6) tahtada ziyaretçi turu (vitrin), dil önerisi gibi bir kerelik pencereler çıkmasın */
    if (CIHAZ === 'tahta') {
      try {
        if (!localStorage.getItem('kidefVitrinSayac')) localStorage.setItem('kidefVitrinSayac', '9');
        if (localStorage.getItem('kidef_dil_oneri') !== 'yok') localStorage.setItem('kidef_dil_oneri', 'yok');
      } catch (e) { }
    }
  }

  /* ================================================ GEÇMİŞ (18.10.2026)
     Öğretmen: "sözlüğü tam ekran olarak açınca ... sözlüğü kapatınca akıllı
     tahtada sadece siyah ekran oluyor". Sözlüğün (ve sitenin her sayfasının)
     "Geri" tuşu history.back() çağırıyor. Tahta sayfaları çerçevede YERİNE
     KOYARAK açtığı için çerçevesinin geri gidecek kaydı yoktu; tarayıcı geri
     adımı kabuğa uyguluyor, tahta tahta.html'den çıkıp boş sayfada kalıyordu.
     Artık çerçevedeki sayfalar geçmişte yalnız ÇERÇEVENİN İÇİNDE gezer:
       · izleyen (tahta): geri/ileri hiçbir şey yapmaz — lider hangi sayfaya
         döndüyse tahta adresle oraya gider;
       · lider: adım çerçevenin içinde kalıyorsa olur; kalmıyorsa (çerçevenin
         ilk sayfası) çerçevede geldiği sayfa ya da ana sayfa açılır. Kabuk
         hiçbir durumda kapanmaz. İç çerçevede (açılır sözlük) dışarı taşan
         adım yok sayılır. */
  var GECMIS = { adim: -1, yerine: false };   /* Navigation API yoksa: çerçevede geri gidilebilecek sayfa sayısı */
  function gecmisSay(w) {
    var tur = '';
    try { var e = w.performance.getEntriesByType('navigation')[0]; tur = (e && e.type) || ''; } catch (x) { }
    if (GECMIS.adim < 0) GECMIS.adim = 0;
    else if (tur === 'back_forward') GECMIS.adim = Math.max(0, GECMIS.adim - 1);
    else if (tur !== 'reload' && !GECMIS.yerine) GECMIS.adim += 1;
    GECMIS.yerine = false;
  }
  function icindeMi(w, n, ic) {
    try {
      var nv = w.navigation;
      if (nv && nv.currentEntry && typeof nv.currentEntry.index === 'number' && nv.currentEntry.index >= 0 && nv.entries) {
        var i = nv.currentEntry.index + n;
        return i >= 0 && i < nv.entries().length;
      }
    } catch (e) { }
    if (ic) return false;
    return n < 0 && GECMIS.adim + n >= 0;
  }
  function gecmisKoru(w, ic) {
    var h = null;
    try { h = w.history; } catch (e) { return; }
    if (!h || h.__kidefTahta) return;
    var asilGo = h.go, asilBack = h.back, asilFwd = h.forward;
    function git(n, asil) {
      if (takipte()) return;                                    /* izleyen: lider sürüyor */
      if (icindeMi(w, n, ic)) { asil(); return; }
      if (n > 0 || ic) return;
      var hedef = 'index.html';                                 /* çerçevenin ilk sayfasından geri */
      try {
        var a = ayniSite(w.document.referrer || '', w.location.href);
        if (a && a.href !== w.location.href && !/\/tahta\.html$/.test(a.pathname)) hedef = a.href;
      } catch (e) { }
      try { w.location.assign(hedef); } catch (e) { }
    }
    try {
      h.back = function () { git(-1, function () { asilBack.call(h); }); };
      h.forward = function () { git(1, function () { asilFwd.call(h); }); };
      h.go = function (n) {
        n = +n || 0;
        if (!n) return asilGo.call(h, 0);                       /* go(0): yenile */
        git(n, function () { asilGo.call(h, n); });
      };
      h.__kidefTahta = true;
    } catch (e) { }
  }

  /* ================================================ İÇ ÇERÇEVELER (18.10.2026)
     Öğretmen: "kamusa basınca popup şeklinde açıldı ama klavyeden yazınca
     akıllı tahtada görünmedi". Açılır sözlük, sayfanın İÇİNDE ayrı bir
     çerçeve (iframe, sozluk.html). Köprü yalnız sayfanın kendisine kuruluyordu;
     içteki çerçevede yazılan, tıklanan, kaydırılan hiçbir şey öbür cihaza
     gitmiyordu. Artık sitenin kendi sayfasını taşıyan iç çerçevelere de aynı
     köprü kuruluyor (en çok 3 kat); öğenin yolu çerçeve zinciriyle yazılıyor
     (yolAl). Site dışı çerçeveler (YouTube vb.) ve PDF'ler dokunulmaz. */
  function icErisim(f) {
    try {
      var w2 = f.contentWindow, d2 = w2 && w2.document;
      if (!d2 || !d2.body) return null;
      if (w2.location.href === 'about:blank' || w2.location.origin !== location.origin) return null;
      if (d2.contentType && !/html/i.test(d2.contentType)) return null;
      return d2;
    } catch (e) { return null; }
  }
  function icBelgeler(d0) {
    var l = [];
    (function tara(d, kat) {
      var f;
      try { f = d.getElementsByTagName('iframe'); } catch (e) { return; }
      for (var i = 0; i < f.length && i < 8; i++) {
        var dd = icErisim(f[i]);
        if (!dd) continue;
        l.push(dd);
        if (kat < 3) tara(dd, kat + 1);
      }
    })(d0, 1);
    return l;
  }
  function icKopruKur(w2, d2, ust) {
    dokunusKur(w2);
    pencereKur(w2, ust, true);
    olayKur(w2);
    rastgeleKur(w2, S.s0 >>> 0);
    engelKur(w2, ust, 5000);
    var hazir = function () {
      setTimeout(function () {
        if (S.belge !== ust) return;
        if (S.lider) alanTara();
        else { zAlanUygula(); zKayUygula(); }
      }, 200);
    };
    if (d2.readyState === 'complete') hazir(); else w2.addEventListener('load', hazir);
  }
  function icTara() {
    var ust = S.belge;
    if (!ust) return;
    icBelgeler(ust).forEach(function (d2) {
      if (d2.__kidefTahtaIc) return;
      d2.__kidefTahtaIc = 1;
      try { icKopruKur(d2.defaultView, d2, ust); } catch (e) { }
    });
  }

  /* çerçevede yeni sayfa açıldı mı — mümkün olan en erken anda */
  function belgeDenetle() {
    var w, d;
    try { w = CERCEVE.contentWindow; d = w.document; } catch (e) { return; }
    if (!d || d === S.belge) return;
    try { if (!w.location || w.location.href === 'about:blank') return; } catch (e) { return; }
    S.belge = d;
    gecmisSay(w);
    kopruKur(w, d);
    if (S.lider) yYeniBelge(w, d); else zYeniBelge(w, d);
  }
  function belgeIzle() {
    if (belgeIzle.kuruldu) return;
    belgeIzle.kuruldu = true;
    belgeDenetle();
    setInterval(belgeDenetle, 20);
    setInterval(function () { icTara(); if (S.lider) { alanKontrol(); adresKontrol(); } kgKontrol(); }, 250);
    setInterval(nobet, 1000);
    window.addEventListener('storage', function (e) {      /* başka sekmede dil değişirse */
      if (e && e.key === 'kidef_dil' && yayinda()) S.kok.child('yayin').update({ dil: e.newValue || 'tr' });
    });
  }
  /* saniyede bir: istenen eşitleme gelmediyse bir kez daha iste */
  function nobet() {
    if (ROL === 'yansit' && S.kok && !gizliMi()) kumandaSonYaz();
    if (!Z.esit) return;
    if (S.lider) { esitSil(); return; }
    if (!oturumVar()) {
      /* lider yok: dönen kumanda, tahtanın dersi üstlenip geçmişi göndermesini bekler (en çok 12 sn) */
      if (S.esitBekle && SIMDI() - Z.esit.z < 12000) return;
      esitSil(); if (S.devam) devamTamam(); return;
    }
    if (S.yayin.durak) { Z.esit.z = SIMDI(); return; }          /* duraklatılmışken beklenir */
    if (SIMDI() - Z.esit.z < 6000) return;
    if (Z.esit.tekrar < 1) { Z.esit.tekrar += 1; Z.esit.z = SIMDI(); varlikYaz(true); }
    else { esitSil(); if (S.devam) devamTamam(); zIsle(); }
  }

  /* ===================================== KUMANDA: KALDIĞI YERDEN (18.10.2026)
     Kumandanın sekmesi yenilendiyse, telefon uyanınca tarayıcı sayfayı yeniden
     açtıysa ya da site yeniden açılıp ana sayfa kumandaya döndüyse
     (sistem/tahtagir.js): tahtada süren ders bu cihazda geçmişiyle açılır,
     sonra ilk dokunuşta kontrol yine burada. Bu sırada kumandada açık renkli bir
     perde ("Tahtadaki ders açılıyor…") durur; tahtada hiçbir şey görünmez. */
  function devamGoster(m) {
    if (CIHAZ !== 'bilgisayar') return;
    stilKur();
    var d = $('thDevam');
    if (!d) { d = document.createElement('div'); d.id = 'thDevam'; d.className = 'th-devam'; document.body.appendChild(d); }
    d.innerHTML = '<span><i></i>' + kac(m || kd('th.devam_esit', 'Tahtadaki ders açılıyor…')) + '</span>';
    d.hidden = false;
    S.devam = true;
    clearTimeout(S.devamSonZ);
    S.devamSonZ = setTimeout(devamTamam, 15000);              /* ne olursa olsun en çok 15 sn */
  }
  function devamZamanla() { clearTimeout(S.devamZ); S.devamZ = setTimeout(devamTamam, 500); }
  function devamTamam() {
    S.devam = false;
    clearTimeout(S.devamZ); clearTimeout(S.devamSonZ);
    var d = $('thDevam'); if (d) d.hidden = true;
    arayuzTazele();
  }
  /* lider yokken geçmişi (yeniden) iste: istek gelince tahta dersi üstlenip gönderir */
  function devamIste() {
    if (!S.kok || S.lider || !S.esitBekle) return;
    if (Z.esit && SIMDI() - Z.esitIstZ < 3000) return;        /* az önce istendi */
    if (!Z.esit) Z.esit = { z: SIMDI(), tekrar: 0 };
    varlikYaz(true);
  }
  /* kumanda sekmesi açılırken: ders tahtada sürüyor mu? Sürüyorsa izleyerek
     başlanır (tahta yenilenmez); sürmüyorsa her zamanki gibi bu cihaz yansıtır */
  function devamKarar(kok) {
    var yr = null, iz = null, n = 0, son = null;
    try { son = JSON.parse(localStorage.getItem('kidef_kumanda_son') || 'null'); } catch (e) { }
    var bitti = function (zorla) {
      if (S.karar) return;
      if (!zorla && ++n < 2) return;
      S.karar = true;
      var y = yr, tahta = false;
      for (var k in (iz || {})) {
        if (!has(iz, k)) continue;
        var t = iz[k];
        if (t && t.cevrimici && t.cihaz !== 'bilgisayar' && y && t.d === y.d) tahta = true;
      }
      var surer = !!(y && y.bas && !y.bitir && y.u && (y.cevrimici ? y.id !== BEN : tahta));
      if (surer && !(y.durak && !y.cevrimici)) { takipBasla(kok, y); return; }
      /* tahtada sürmeyen ders: bu cihaz yansıtır. Bu cihazın dersi az önce
         sürüyorduysa (sekme yenilendi) aynı oturumla, aynı sayfadan. */
      var benim = !!(y && y.bas && !y.bitir && y.u && son && son.bas === y.bas && SIMDI() - (son.t || 0) < UZAK_BEKLE);
      if (benim) { S.bas = y.bas; if (y.durak && !y.cevrimici) S.durakDevam = y; }
      S.devam = false;
      S.lider = true;
      CERCEVE.src = benim ? y.u : (S.hedef || 'index.html');
      devamTamam();
      yansitBasla(kok);
    };
    kok.child('yayin').once('value', function (s) { yr = s.val(); bitti(); }, function () { bitti(); });
    kok.child('izle').once('value', function (s) { iz = s.val() || {}; bitti(); }, function () { bitti(); });
    setTimeout(function () { bitti(true); }, 8000);          /* internet yok: bu cihazda sürdür */
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
    /* telefonda aynı düğmeler yüzen tuşun paneline kurulur (21.10.2026) */
    var c = MOBIL ? kumandaPanel() : $('thCubuk');
    var isim = '<span class="th-isim"><span class="th-nokta bekle" id="thNokta"></span><span id="thBaslik">' + kac(kd('th.yansitiliyor', 'Tahtaya yansıtılıyor')) + '</span></span>';
    var cip = '<span class="th-cip" id="thCip">' + kac(kd('th.tahta_bekleniyor', 'Tahta bekleniyor…')) + '</span>';
    var hedef = '<select class="th-hedef" id="thHedef" title="' + kac(kd('th.hedef_ip', 'Hangi tahtaya yansıtılsın?')) + '" aria-label="' + kac(kd('th.hedef_ip', 'Hangi tahtaya yansıtılsın?')) + '"></select>';
    var tuslar =
      '<button type="button" class="th-dug th-kip" id="thKipDug" aria-pressed="false" title="' + kac(kd('th.kip_ip', 'Açıkken tahtaya dokunarak da kullanabilirsin; kapalıyken tahta yalnız bilgisayarı gösterir')) + '">' + SVG.dokun + '<span>' + kac(kd('th.kip', 'Tahtadan da kullan')) + '</span></button>' +
      '<button type="button" class="th-dug" id="thPerdeDug" aria-pressed="false" title="' + kac(kd('th.perde_ip', 'Tahtayı karart (öğrenciler ekranı görmesin)')) + '">' + SVG.perde + '<span>' + kac(kd('th.perde', 'Perde')) + '</span></button>' +
      '<button type="button" class="th-dug" id="thDurakDug" aria-pressed="false" title="' + kac(kd('th.durak_ip', 'Tahta son görüntüde dursun; sen burada serbestçe gez')) + '"></button>' +
      '<button type="button" class="th-dug" id="thEsitleDug" title="' + kac(kd('th.esitle_ip', 'Tahtadaki sayfayı bu ekranla yeniden eşitle')) + '">' + SVG.esitle + '<span>' + kac(kd('th.esitle', 'Eşitle')) + '</span></button>' +
      '<button type="button" class="th-dug kirmizi" id="thBitirDug" title="' + kac(kd('th.bitir_ip', 'Yansıtmayı bitir, bu sayfada kal')) + '">' + SVG.bitir + '<span>' + kac(kd('th.bitir', 'Bitir')) + '</span></button>';
    c.innerHTML = MOBIL
      ? '<div class="th-bas">' + isim + cip + '</div>' + hedef + '<div class="th-tuslar">' + tuslar + '</div>'
      : isim + cip + hedef + '<span class="th-bos"></span>' + tuslar;
    if (MOBIL) kumandaTus(); else c.hidden = false;      /* panel yalnız tuşla açılır */
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
    $('thHedef').addEventListener('change', function () {
      var o = this.options[this.selectedIndex];
      hedefSec(this.value || null, o ? (o.getAttribute('data-ad') || '') : '');
    });
    hedefSeciciTazele();
    arayuzTazele();
  }
  /* ------------------------------------------------ HEDEF TAHTA (bilgisayar) */
  function tahtaListesi() {
    var l = [];
    for (var k in S.izle) {
      if (!has(S.izle, k)) continue;
      var t = S.izle[k];
      if (t && t.cevrimici && t.cihaz === 'tahta') l.push({ ben: k, kimlik: t.kimlik || k, ad: t.ad || '', sinif: t.sinif || '', sinifAcik: !!t.sinifAcik, ts: +t.ts || 0 });
    }
    l.sort(function (a, b) { return (a.ad || a.kimlik) < (b.ad || b.kimlik) ? -1 : 1; });
    return l;
  }
  function tahtaEtiket(t) {
    var ad = t.ad || kd('th.tahta_n', 'Tahta {n}', { n: String(t.kimlik).slice(-3).toUpperCase() });
    if (t.sinif) ad += ' · ' + (t.sinifAcik ? kd('th.acik_sinif', 'açık sınıf: {s}', { s: t.sinif }) : kd('th.son_sinif', 'son sınıf: {s}', { s: t.sinif }));
    return ad;
  }
  function hedefSec(k, ad) {
    S.hedefTahta = k || null; S.hedefTahtaAd = k ? (ad || '') : '';
    hedefYaz(S.hedefTahta, S.hedefTahtaAd);
    if (S.kok) { try { S.kok.child('yayin').update({ hedef: S.hedefTahta || null, hedefAd: S.hedefTahta ? (S.hedefTahtaAd || null) : null, ts: TS() }); } catch (e) { } }
    bildir(S.hedefTahta ? kd('th.b_hedef', 'Yansıtma {ad} tahtasına gidiyor.', { ad: S.hedefTahtaAd || S.hedefTahta }) : kd('th.b_hedef_hepsi', 'Yansıtma bütün tahtalara gidiyor.'));
    hedefSeciciTazele();
    arayuzTazele();
  }
  var hedefImza = '';
  function hedefSeciciTazele() {
    var se = $('thHedef');
    if (!se) return;
    var l = tahtaListesi(), var_ = false, h = '';
    h += '<option value="">' + kac(kd('th.hedef_hepsi', 'Bütün tahtalar')) + (l.length ? ' (' + l.length + ')' : '') + '</option>';
    l.forEach(function (t) {
      if (t.kimlik === S.hedefTahta) var_ = true;
      h += '<option value="' + kac(t.kimlik) + '" data-ad="' + kac(t.ad || '') + '">' + kac(tahtaEtiket(t)) + '</option>';
    });
    if (S.hedefTahta && !var_) h += '<option value="' + kac(S.hedefTahta) + '" data-ad="' + kac(S.hedefTahtaAd || '') + '">' + kac((S.hedefTahtaAd || S.hedefTahta) + ' · ' + kd('th.bagli_degil', 'bağlı değil')) + '</option>';
    var imza = h + '|' + (S.hedefTahta || '');
    if (imza === hedefImza) return;
    hedefImza = imza;
    se.innerHTML = h;
    se.value = S.hedefTahta || '';
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
      if (t && t.cevrimici && t.cihaz !== 'bilgisayar' && (!S.hedefTahta || (t.kimlik || k) === S.hedefTahta)) { tahtalar.push(t); if (typeof t.gecikme === 'number') g = (g == null) ? t.gecikme : Math.max(g, t.gecikme); }
    }
    hedefSeciciTazele();
    var sinif = 'bekle', yazi;
    if (!S.baglanti) { sinif = 'hata'; yazi = kd('th.baglanti_yok', 'İnternet bağlantısı yok'); }
    else if (S.devam) { yazi = kd('th.esitleniyor', 'Tahtayla eşitleniyor…'); }
    else if (!S.lider && oturumVar()) {
      sinif = 'canli';
      if (S.yayin.cihaz === 'tahta' && S.yayin.vekil) {
        /* tahta dersi bu cihaz uyurken tuttu: dokununca kontrol yine burada */
        yazi = kd('th.tahta_bagli', 'Tahta bağlı');
      } else if (S.yayin.cihaz === 'tahta') {
        yazi = kd('th.tahtadan', 'Tahtadan kullanılıyor');
        var zg = zOrtalama();
        if (zg != null) yazi += ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, zg) });
      } else {
        sinif = 'hata';
        yazi = kd('th.devralindi', 'Başka bir cihaz yansıtıyor — Eşitle’ye basarak geri al');
      }
    }
    else if (!tahtalar.length) { yazi = S.hedefTahta ? kd('th.hedef_bekleniyor', '{ad} bekleniyor…', { ad: S.hedefTahtaAd || S.hedefTahta }) : kd('th.tahta_bekleniyor', 'Tahta bekleniyor…'); }
    else {
      sinif = Y.durak ? 'bekle' : 'canli';
      yazi = tahtalar.length > 1 ? kd('th.tahta_cok', '{n} tahta bağlı', { n: tahtalar.length }) : kd('th.tahta_bagli', 'Tahta bağlı');
      if (tahtalar.length === 1 && (tahtalar[0].ad || tahtalar[0].sinif)) yazi += ' · ' + (tahtalar[0].ad || '') + (tahtalar[0].sinif ? (tahtalar[0].ad ? ' / ' : '') + tahtalar[0].sinif : '');
      if (g != null) yazi += ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, Math.round(g)) });
      if (Y.durak) yazi += ' · ' + kd('th.duraklatildi', 'duraklatıldı');
    }
    nokta.className = 'th-nokta ' + sinif;
    cip.textContent = yazi;
    $('thBaslik').textContent = Y.durak ? kd('th.duraklatildi_bas', 'Yansıtma duraklatıldı') : kd('th.yansitiliyor', 'Tahtaya yansıtılıyor');
    var kn = $('thKNokta');
    if (kn) { kn.className = 'th-nokta ' + sinif; var kt = $('thKTus'); if (kt) kt.title = yazi; }
  }

  /* ------------------------------------- TELEFONDA KUMANDA TUŞU (21.10.2026)
     Öğretmen: "mobilde cihaz kumandaysa kumanda tuşları yüzebilen açılır kapanır
     bi popup tuş olsun". Telefon/tablette (dokunmatik, kısa kenar ≤ 820 px)
     üstteki çubuk yerine yüzen yuvarlak tuş: üstünde durum noktası; dokununca
     panel (durum, hangi tahta, Tahtadan da kullan / Perde / Duraklat / Eşitle /
     Bitir) açılır; dışına, tuşa ya da bir düğmeye basınca kapanır. Tuş
     sürüklenir, kenara yaslanır, yeri hatırlanır (localStorage kidef_kumanda_tus). */
  var MOBIL = (function () {
    try {
      if (ROL !== 'yansit') return false;
      var ua = navigator.userAgent || '';
      /* telefon (UA) ya da birincil işaretçisi parmak olan küçük cihaz (tablet);
         dokunmatik dizüstü (fare/izleme yüzeyi) çubukta kalır */
      var kaba = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      var kisa = Math.min(window.screen.width || 9999, window.screen.height || 9999);
      return /Mobi|iPhone/.test(ua) || (kaba && kisa <= 820);
    } catch (e) { return false; }
  })();
  var KT = { acik: false, suruk: null };
  function ktKonumOku() { try { var k = JSON.parse(localStorage.getItem('kidef_kumanda_tus') || 'null'); return (k && typeof k.fx === 'number' && typeof k.fy === 'number') ? k : null; } catch (e) { return null; } }
  function ktKonumYaz(x, y, w, h) {
    var W = Math.max(1, window.innerWidth - w), H = Math.max(1, window.innerHeight - h);
    try { localStorage.setItem('kidef_kumanda_tus', JSON.stringify({ fx: Math.min(1, Math.max(0, x / W)), fy: Math.min(1, Math.max(0, y / H)) })); } catch (e) { }
  }
  function ktYerlestir(t, x, y) {
    var w = t.offsetWidth || 58, h = t.offsetHeight || 58, K = 10;
    x = Math.round(Math.min(window.innerWidth - w - K, Math.max(K, x)));
    y = Math.round(Math.min(window.innerHeight - h - K, Math.max(K, y)));
    t.style.left = x + 'px'; t.style.top = y + 'px';
    return [x, y, w, h];
  }
  function ktBaslangic(t) {
    var w = t.offsetWidth || 58, h = t.offsetHeight || 58, k = ktKonumOku();
    if (k) ktYerlestir(t, k.fx * (window.innerWidth - w), k.fy * (window.innerHeight - h));
    else ktYerlestir(t, window.innerWidth - w - 14, window.innerHeight - h - 26);   /* sağ alt */
  }
  function ktKenaraYasla(t) {
    var r = t.getBoundingClientRect(), K = 10;
    var sol = r.left + r.width / 2 < window.innerWidth / 2;
    t.style.transition = 'left .18s ease';
    var k = ktYerlestir(t, sol ? K : window.innerWidth - r.width - K, r.top);
    setTimeout(function () { t.style.transition = ''; }, 220);
    ktKonumYaz(k[0], k[1], k[2], k[3]);                 /* hedef yer kaydedilir (geçiş sürerken ölçülmez) */
  }
  function kumandaTus() {
    var t = $('thKTus');
    if (t) return t;
    t = document.createElement('button');
    t.type = 'button'; t.id = 'thKTus'; t.className = 'th-ktus';
    t.setAttribute('aria-label', kd('th.kumanda_tus', 'Kumanda'));
    t.setAttribute('aria-expanded', 'false');
    t.innerHTML = SVG.kumanda + '<span class="th-nokta bekle" id="thKNokta"></span>';
    document.body.appendChild(t);
    ktBaslangic(t);
    t.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      var r = t.getBoundingClientRect();
      KT.suruk = { id: e.pointerId, x: e.clientX, y: e.clientY, sol: r.left, ust: r.top, tasindi: false };
      try { t.setPointerCapture(e.pointerId); } catch (x) { }
      e.preventDefault();
    });
    t.addEventListener('pointermove', function (e) {
      var d = KT.suruk;
      if (!d || e.pointerId !== d.id) return;
      var dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.tasindi && Math.sqrt(dx * dx + dy * dy) < 8) return;
      if (!d.tasindi) { d.tasindi = true; t.classList.add('suruk'); kumandaKapat(); }
      ktYerlestir(t, d.sol + dx, d.ust + dy);
    });
    var birak = function (e) {
      var d = KT.suruk;
      if (!d || e.pointerId !== d.id) return;
      KT.suruk = null;
      t.classList.remove('suruk');
      if (d.tasindi) ktKenaraYasla(t);
      else if (e.type === 'pointerup') kumandaAcKapat();
    };
    t.addEventListener('pointerup', birak);
    t.addEventListener('pointercancel', birak);
    window.addEventListener('resize', function () { var tt = $('thKTus'); if (tt) { ktBaslangic(tt); if (KT.acik) kumandaYerlestir(); } });
    return t;
  }
  function kumandaPanel() {
    var p = $('thKPanel');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'thKPanel'; p.className = 'th-kpanel'; p.hidden = true;
    p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', kd('th.kumanda_tus', 'Kumanda'));
    document.body.appendChild(p);
    /* bir düğmeye basınca panel kapanır (yakalama evresinde: düğmenin kendi işi
       içini yeniden çizse de hedef henüz yerinde; kapanış düğmenin işinden sonra) */
    p.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('button')) setTimeout(kumandaKapat, 60); }, true);
    return p;
  }
  function kumandaYerlestir() {
    var p = $('thKPanel'), t = $('thKTus');
    if (!p || !t) return;
    var r = t.getBoundingClientRect(), K = 10, W = window.innerWidth, H = window.innerHeight;
    var pw = p.offsetWidth, ph = p.offsetHeight;
    var x = (r.left + r.width / 2 > W / 2) ? r.right - pw : r.left;
    var y = (r.top + r.height / 2 > H / 2) ? r.top - ph - 10 : r.bottom + 10;
    x = Math.min(W - pw - K, Math.max(K, x));
    y = Math.min(H - ph - K, Math.max(K, y));
    p.style.left = Math.round(x) + 'px'; p.style.top = Math.round(y) + 'px';
  }
  function kumandaAc() {
    var p = $('thKPanel'), t = $('thKTus');
    if (!p || !t || KT.acik) return;
    KT.acik = true;
    var perde = document.createElement('div');
    perde.id = 'thKPerde'; perde.className = 'th-kperde';
    perde.addEventListener('pointerdown', function (e) { e.preventDefault(); kumandaKapat(); });
    document.body.appendChild(perde);
    p.hidden = false;
    kumandaYerlestir();
    t.classList.add('acik'); t.setAttribute('aria-expanded', 'true');
  }
  function kumandaKapat() {
    var p = $('thKPanel'), t = $('thKTus'), perde = $('thKPerde');
    if (perde) perde.parentNode.removeChild(perde);
    if (p) p.hidden = true;
    if (t) { t.classList.remove('acik'); t.setAttribute('aria-expanded', 'false'); }
    KT.acik = false;
  }
  function kumandaAcKapat() { if (KT.acik) kumandaKapat(); else kumandaAc(); }
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
    var uzak = (S.lider && Y.vekil) || (!S.lider && uzaktaMi());
    var durum = uzak ? kd('th.kumanda_uyku', 'Kumanda şu an bağlı değil (uykuda). Tahta olduğu gibi sürüyor; kumandayı açınca kaldığı yerden devam eder.')
      : S.lider ? kd('th.tahtadan', 'Tahtadan kullanılıyor') + '.'
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
    var y = S.yayin, sinif = 'bekle', uzak = (S.lider && Y.vekil) || (!S.lider && uzaktaMi());
    if (!S.baglanti) sinif = 'hata';
    else if (y && y.cevrimici && !y.durak && !uzak) sinif = 'canli';
    n.className = 'th-nokta ' + sinif;
    var g = zOrtalama();
    n.title = uzak ? kd('th.kumanda_uyku_kisa', 'Kumanda uykuda — tahta olduğu gibi sürüyor')
      : S.lider ? kd('th.tahtadan', 'Tahtadan kullanılıyor')
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
    /* kumanda uykudayken de ders sürüyor sayılır: perde, koruma olduğu gibi kalır */
    var os = oturumVar() || uzaktaMi();
    /* dokunmayı engelleyen katman: yalnız göster kipinde ya da duraklatılmışken */
    var koruma = !cift() || (os && !!(S.yayin && S.yayin.durak));
    var kr = $('thKoruma');
    if (kr && kr.hidden === koruma) kr.hidden = !koruma;
    var p = !!(os && (S.ayar.perde || S.ayar.kg));
    var pe = $('thPerde');
    if (pe && pe.hidden === p) pe.hidden = !p;
    zNoktaYaz();
    uyanikDenetle();
  }
  function zOturumGoster(y) {
    clearTimeout(Z.ayrildiZ);
    if (y && y.baska) {
      zSerit(null); bekleGoster('baska', y);
      /* hedef dışı tahtada açık kalan sayfanın sesi/videosu durur */
      try { var ws = Z.win || CERCEVE.contentWindow; [].forEach.call(ws.document.querySelectorAll('video,audio'), function (m) { try { m.pause(); } catch (e) { } }); } catch (e) { }
      return;
    }
    if (y && y.cevrimici) {
      bekleGoster(null);
      zSerit(y.durak ? kd('th.serit_durak', 'Öğretmen yansıtmayı duraklattı') : null);
    } else if (Z.belge) {
      if (uzaktaMi()) return;               /* kumanda uykuda / bağlantısı koptu: tahtada hiçbir şey değişmez */
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
    /* HEDEF BAŞKA TAHTA: bu tahta yansıtmayı yok sayar — bekleme ekranında söyler,
       dokununca dersi almaz, vekil olmaz. Hedef buraya dönünce sayfayı açıp
       liderden geçmişi ister (sonradan bağlanan tahta yolu). */
    if (hedefDisi(y)) y = { cevrimici: false, bitir: true, baska: y.hedef, baskaAd: y.hedefAd || '', bas: y.bas || null, id: y.id, ts: y.ts || 0 };
    S.yayin = y; Z.yayin = y;
    var liderId = (y && y.cevrimici) ? y.id : null;
    if (liderId && liderId !== BEN) { Z.sonCanli = y; Z.uzak = null; clearTimeout(Z.vekilZ); Z.vekilZ = null; }
    if (y && y.bitir) { Z.sonCanli = null; Z.uzak = null; clearTimeout(Z.vekilZ); Z.vekilZ = null; }
    if (S.lider && liderId !== BEN) {
      if (CIHAZ === 'bilgisayar' && S.kok && (!liderId || (y.vekil === BEN && y.d === Y.d))) {
        /* bağlantı koptu-geri geldi ya da telefon uykudan uyandı: yansıtma bu
           cihazda, kaldığı yerden sürer. Tahta dersi bizim adımıza tuttuysa
           (vekil, aynı sayfa) sessizce geri alınır: tahta yenilenmez. */
        Y.n = Math.max(Y.n, Z.enN);
        if (Y.durak) S.kok.child('yayin').update({ cevrimici: true, id: BEN, cihaz: CIHAZ, durak: true, vekil: null, bitir: null, ts: TS() });
        else yayinYaz(false);
        arayuzTazele();
        return;
      }
      var donus = CIHAZ === 'bilgisayar' && S.donus && SIMDI() - S.donus < 30000;
      liderBirak(y);
      /* uyanınca dersi başka hâlde bulduk (bu arada tahtadan kullanıldı): tahtadaki
         hâl alınır — yalnız bu cihaz yenilenir, tahta değil */
      if (donus && liderId && S.kok) { S.esitBekle = true; devamGoster(kd('th.devam_esit', 'Tahtadaki ders açılıyor…')); esitIste(); }
    }
    if (!S.lider && CIHAZ === 'bilgisayar' && !liderId && S.kok && !(y && y.bitir)) {
      /* tahta kullanılırken bağlantısı koptu ya da çıktı: kontrol bilgisayara.
         Dönen kumanda tahtanın geçmişini bekliyorsa beklemeyi sürdürür (istek
         gelince tahta dersi üstlenip gönderir) */
      if (S.esitBekle) devamIste();
      else { liderOl(); return; }
    }
    if (!S.lider) {
      if (y && y.cevrimici && y.id !== Z.yayinId) {
        Z.yayinId = y.id; Z.sonN = null; Z.bek = {}; Z.bosluk = null;
        /* eşitleme beklerken lider değişti: yeni liderden iste (dönen kumanda,
           geçmiş hiç gelmediyse beklemeden vazgeçmiş olsa da yine ister) */
        if (Z.esit || S.esitBekle) { if (!Z.esit) Z.esit = { z: SIMDI(), tekrar: 0 }; varlikYaz(true); }
      }
      if (CIHAZ === 'tahta') {
        /* KUMANDA KOPTU ("Bitir" değil): tahtada hiçbir şey değişmez; biraz sonra
           ders görünmeden tahtada tutulur (vekil) */
        if (!liderId && once && once.cevrimici && once.id !== BEN && !(y && y.bitir) && Z.sonCanli) {
          if (!Z.uzak) Z.uzak = { z: SIMDI(), id: once.id };
          vekilZamanla();
        }
        /* kumanda (bu arada başka sayfaya geçmiş olarak) geri geldi: o sayfa açılır,
           geçmişi istenir — olaylar ancak geçmiş gelince uygulanır */
        if (liderId && once && !once.cevrimici && y.d !== Z.d && !Z.esit && Z.belge) Z.esit = { z: SIMDI(), tekrar: 0, gec: true };
        /* hedef bu tahtaya DÖNDÜ: aradaki olaylar uygulanmadı — sayfa yeniden açılır, liderden geçmiş istenir */
        if (liderId && once && once.baska && !(y && y.baska)) { Z.esit = null; esitIste(); }
        zOturumGoster(y);
      }
      zYayinUygula(y);
      if (Z.esit && Z.esit.gec) { Z.esit.gec = false; varlikYaz(true); }
    }
    /* yeni yansıtma oturumu: tahta tam ekrana geçmeyi dener (aynı oturumda kopup gelmede değil) */
    if (CIHAZ === 'tahta' && y && y.cevrimici && y.id !== BEN && (y.bas || null) !== Z.sonBas) {
      Z.sonBas = y.bas || null; TAM.istek = true; tamEkranDene(); ipucuGoster();
    }
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
    /* lider yokken geçmiş istendi (kumanda yeniden açıldı): tahta dersi üstlenip
       gönderir (vekilOl bekleyen istekleri karşılar) */
    else if (istek.length && CIHAZ === 'tahta' && uzaktaMi()) vekilOl();
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
      if (S.yayin && S.yayin.baska) return;                       /* hedef başka tahta */
      zKayUygula();
      var b = Z.kay.b; if (b) zGecikme(b.z);
      hareketYaz();
    });
    kok.child('alan').on('value', function (s) { Z.alan = s.val() || {}; if (!S.lider && !(S.yayin && S.yayin.baska)) zAlanUygula(); });
    kok.child('ayar').on('value', function (s) {
      var v = s.val() || {};
      S.ayar = { kip: v.kip === 'tek' ? 'tek' : 'cift', perde: !!v.perde, kg: !!v.kg };
      arayuzTazele();
    });
    kok.child('izle').on('value', izleGeldi);
  }

  /* ============================================ GÖRÜNÜRLÜK · YOKLAMA (18.10.2026)
     Telefon kilitlenip açılınca bağlantı çoğunlukla kendiliğinden gelir;
     gelmiyorsa (ağ değişti, yarı ölü bağlantı) yoklama yazısı birkaç saniyede
     dönmez ve bağlantı bir kez kesilip yeniden kurulur: öğretmen beklemesin. */
  var yoklaZ = null;
  function baglantiYokla(hemen) {
    if (!vt || !S.kok) return;
    clearTimeout(yoklaZ);
    var geldi = false;
    try {
      var r = S.kok.child('yokla/' + BEN);
      r.onDisconnect().remove();
      r.set(TS(), function () { geldi = true; });
    } catch (e) { return; }
    yoklaZ = setTimeout(function () {
      if (geldi || !S.kok) return;
      try { vt.goOffline(); vt.goOnline(); } catch (e) { }
    }, hemen ? 2500 : 4000);
  }
  function gorunurlukKur() {
    if (gorunurlukKur.kuruldu) return;
    gorunurlukKur.kuruldu = true;
    if (gizliMi()) GOR.gizli = SIMDI();
    document.addEventListener('visibilitychange', function () {
      if (gizliMi()) { GOR.gizli = SIMDI(); uyanikDenetle(); return; }
      var uzun = GOR.gizli && SIMDI() - GOR.gizli > 8000;
      GOR.acik = SIMDI();
      UYANIK.hata = 0; uyanikDenetle();           /* tahta: gizlenince bırakılan kilit yeniden */
      if (uzun) baglantiYokla(false);
      arayuzTazele();
    });
    window.addEventListener('pagehide', function () { GOR.gizli = SIMDI(); });
    window.addEventListener('pageshow', function (e) { if (e && e.persisted) { GOR.acik = SIMDI(); baglantiYokla(true); } });
    window.addEventListener('online', function () { baglantiYokla(true); });
  }

  /* ======================================================= BAŞLATMA */
  function yansitBasla(kok) {
    if (S.kok) return;
    if (S.devam && !S.karar) { devamKarar(kok); return; }       /* önce: ders tahtada sürüyor mu? */
    S.kok = kok; S.lider = true;
    stilKur(); bekleGoster(null);
    document.body.classList.add('th-yansit');
    if (MOBIL) document.body.classList.add('th-mobil');
    var kip = 'cift';
    try { if (localStorage.getItem('kidef_tahta_kip') === 'tek') kip = 'tek'; } catch (e) { }
    S.ayar = { kip: kip, perde: false, kg: false };
    /* yeni yansıtma: önceki oturumdan kalan lider (varsa) bırakır */
    /* yayin/bas: bu yansıtma oturumunun kimliği (tahta "Çık" ile ayrıldıysa
       aynı oturumda ana sayfa onu geri sürüklemesin — sistem/tahtagir.js).
       Sekme yenilenip aynı ders sürüyorsa kimlik aynı kalır (devamKarar). */
    S.bas = S.bas || rastgeleId();
    var dd = S.durakDevam; S.durakDevam = null;
    if (dd) {
      /* duraklatılmış dersin kumandası yeniden açıldı: tahta son görüntüde
         beklemeyi sürdürür; "Sürdür"e basılınca bu ekrana gelir */
      Y.durak = true; Y.durakD = -1; Y.durakG = 0; Y.durakYeni = [];
      Y.d = Math.max(Y.d, dd.d || 0);
      kok.update({ 'yayin/id': BEN, 'yayin/cihaz': CIHAZ, 'yayin/cevrimici': true, 'yayin/durak': true, 'yayin/ts': TS(),
                   'yayin/bas': S.bas, 'yayin/vekil': null, 'yayin/bitir': null });
    } else {
      kok.update({ 'yayin/id': BEN, 'yayin/cihaz': CIHAZ, 'yayin/cevrimici': false, 'yayin/durak': false, 'yayin/ts': TS(),
                   'yayin/bas': S.bas, 'yayin/vekil': null, 'yayin/bitir': null, 'ayar': { kip: kip, perde: false, kg: false } });
    }
    cubukKur();
    kopmaKur();
    belgeIzle();
    if (Y.belge && !Y.durak) {                     /* sayfa giriş beklenirken açıldı: şimdi yayınla */
      yayinYaz(true);
      Y.gunluk.forEach(function (o) { olayYazHam(o); });
      setTimeout(function () { alanKontrol(); kayHepsi(); }, 60);
    }
    ortakDinle(kok);
    baglantiDinle();
    kumandaSonYaz(true);
  }
  /* kumanda, tahtada süren dersi İZLEYEREK başlar: tahtadaki sayfa bu cihazda
     açılır, geçmişi tahtadan gelir; ilk dokunuşta kontrol bu cihaza geçer
     (aynı sayfa, aynı hâl: tahta yenilenmez) */
  function takipBasla(kok, y) {
    if (S.kok) return;
    S.kok = kok; S.lider = false; S.bas = y.bas || null;
    S.esitBekle = true;
    stilKur();
    devamGoster(kd('th.devam_esit', 'Tahtadaki ders açılıyor…'));
    document.body.classList.add('th-yansit');
    if (MOBIL) document.body.classList.add('th-mobil');
    var kip = 'cift';
    try { if (localStorage.getItem('kidef_tahta_kip') === 'tek') kip = 'tek'; } catch (e) { }
    S.ayar = { kip: kip, perde: false, kg: false };          /* gerçeği dinleyiciden gelir */
    S.yayin = y; Z.yayin = y;
    if (y.cevrimici) Z.sonCanli = y;
    cubukKur();
    belgeIzle();
    kok.child('olay').once('value', function (s) {
      if (S.kok !== kok) return;
      var v = s.val() || {}, en = null;
      for (var k in v) {
        if (!has(v, k)) continue;
        var o = v[k];
        if (!o || typeof o.n !== 'number') continue;
        if (o.n > Z.enN) Z.enN = o.n;
        if (y.cevrimici && o.i === y.id && (en == null || o.n > en)) en = o.n;
      }
      Z.sonN = en;
      Z.yayinId = y.cevrimici ? y.id : null;
      Z.katilma = sunucuZaman() + 300;
      Z.esit = { z: SIMDI(), tekrar: 0 };
      Z.gezilen = { d: y.d, u: y.u, s0: y.s0 }; Z.hazir = false;
      try { if (y.dil && localStorage.getItem('kidef_dil') !== y.dil) localStorage.setItem('kidef_dil', y.dil); } catch (e) { }
      CERCEVE.src = y.u || 'index.html';
      ortakDinle(kok);
      baglantiDinle();
      varlikYaz(true);                             /* dinleyiciler kurulduktan sonra: cevap kaçmasın */
      kumandaSonYaz(true);
    }, function () { devamTamam(); });
  }
  /* bilgisayar/telefon: bağlantı gitti-geldi */
  function baglantiDinle() {
    if (baglantiDinle.kuruldu) return;
    baglantiDinle.kuruldu = true;
    try {
      vt.ref('.info/connected').on('value', function (s) {
        var once = S.baglanti;
        S.baglanti = !!s.val();
        if (S.baglanti && !once) S.donus = SIMDI();
        if (S.baglanti && S.kok) {
          kopmaKur();
          if (S.lider) {
            /* kopup geldi: tahta dersi bu arada üstlendiyse ne yapılacağına sunucudan
               gelen yayın karar verir (yayinGeldi); yayın bizde ama kapalı görünüyorsa aç */
            if (S.yayin && !S.yayin.cevrimici && !S.yayin.bitir && (!S.yayin.id || S.yayin.id === BEN)) {
              if (Y.durak) S.kok.child('yayin').update({ cevrimici: true, id: BEN, cihaz: CIHAZ, durak: true, ts: TS() }); else yayinYaz(false);
            }
          }
          else if (!oturumVar()) { if (S.esitBekle) devamIste(); else if (!(S.yayin && S.yayin.bitir)) liderOl(); }
          else if (Z.esit && SIMDI() - Z.esitIstZ > 2500) varlikYaz(true);     /* az önce istendiyse yeniden istenmez */
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
    tamCikTazele();
    /* OTURUM: ders sürdükçe tahta "boşta" sayılmaz ve ekranı kararmaz — kumanda
       uykudayken de en çok UZAK_BEKLE (18.10.2026). Bitir'den ya da o süreden sonra
       tahtanın kendi sayacı yine işler: unutulan tahta kapanır. */
    setInterval(function () { if (tahtaCanli()) hareketYaz(); uyanikDenetle(); }, 30000);
    /* gecikmeyi ve açık sayfayı bildir (seyrek) */
    setInterval(function () {
      if (!S.kok) return;
      var g = zOrtalama(), d = S.lider ? Y.d : Z.d, v = null;
      if (g != null && g !== Z.sonBildirilen && !S.lider) { Z.sonBildirilen = g; v = { gecikme: g }; }
      if (d !== Z.sonBildirilenD) { Z.sonBildirilenD = d; v = v || {}; v.d = d; }
      if (CIHAZ === 'tahta') {
        var tk = tahtaKaydi(), tkImza = JSON.stringify(tk);
        if (tkImza !== Z.sonTahtaKaydi) { Z.sonTahtaKaydi = tkImza; v = v || {}; for (var ta in tk) if (has(tk, ta)) v[ta] = tk[ta]; }
      }
      if (v) { v.ts = TS(); S.kok.child('izle/' + BEN).update(v); }
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
        if (yy && yy.cevrimici && !hedefDisi(yy)) Z.esit = { z: SIMDI(), tekrar: 0 };
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
    if (CIHAZ === 'bilgisayar') { var hd = hedefOku(); if (hd) { S.hedefTahta = hd.k; S.hedefTahtaAd = hd.ad; hedefYaz(hd.k, hd.ad); } }
    /* kabuk başka bir çerçevenin içinde açıldıysa (kabuk içinde kabuk) çalışma */
    var icte = false;
    try { icte = window.top !== window.self; } catch (e) { icte = true; }
    if (icte) { try { location.replace('index.html'); } catch (e) { } return; }
    stilKur();
    gorunurlukKur();
    if (ROL === 'yansit') {
      var m = /[?&]sayfa=([^&#]*)/.exec(location.search);
      var hedef = 'index.html';
      if (m) { try { var a = ayniSite(decodeURIComponent(m[1])); if (a && !/\/tahta\.html$/.test(a.pathname)) hedef = a.pathname + a.search + a.hash; } catch (e) { } }
      /* KALDIĞI YERDEN (18.10.2026): adreste sayfa yoksa (sekme yenilendi, telefon
         uyanınca tarayıcı sayfayı yeniden açtı, site yeniden açılınca ana sayfa
         kumandaya döndü, telefonla karekod kumandası) önce tahtada süren ders
         aranır (devamKarar). Adres "sayfa"sız bırakılır: bu sekme yenilenirse de
         kaldığı yerden açılır. */
      S.devam = !m;
      S.hedef = hedef;
      try { history.replaceState(history.state, '', location.pathname + '?rol=yansit'); } catch (e) { }
      if (S.devam) devamGoster(kd('th.devam_aciliyor', 'Kaldığın yerden açılıyor…'));
      else {
        /* bilgisayar baştan lider: ilk sayfanın tohumu ve köprüsü giriş beklenmeden kurulur */
        S.lider = true;
        CERCEVE.src = hedef;
      }
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
      /* kabuktaki dokunuş: ekran uyanık kilidi alınamadıysa yeniden denenir
         (tam ekran artık yalnız sol ortadaki tuşla — 18.10.2026) */
      ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (t) {
        document.addEventListener(t, function (e) { if (e.isTrusted && !UYANIK.k) { UYANIK.hata = 0; uyanikDenetle(); } }, true);
      });
      baglan(izleBasla);
    }
    document.addEventListener('kidef:dil', function () {
      if (ROL === 'yansit' && S.kok && (MOBIL ? !!$('thKPanel') : ($('thCubuk') && !$('thCubuk').hidden))) cubukKur();
      if (ROL === 'izle' && !$('thBekle').hidden && !oturumVar()) bekleGoster('izle');
      var ip = $('thIpucu');
      if (ip && !ip.hidden) ipucuGoster();
    });
  }
  window.KidefTahta = {
    kimlik: KIMLIK, hedefSec: hedefSec, tahtaListesi: tahtaListesi, tahtaAdiYaz: tahtaAdiYaz,
    rol: ROL, cihaz: CIHAZ, id: BEN, S: S, Y: Y, Z: Z, yolAl: yolAl, yolBul: yolBul, VT_ADRES: VT_ADRES,
    liderOl: liderOl, lider: function () { return S.lider; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
