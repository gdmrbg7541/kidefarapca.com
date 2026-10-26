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
   · 6. SÜRÜM (22.10.2026) — KUMANDA HER CİHAZDA PANEL · LAZER · BÜYÜTEÇ.
     Öğretmen: "masaüstünde bi cihazı kumanda yapmak istediğimizde de kumanda
     popup olarak açılsın, tüm yansıtma işleri kumanda popup ında olacak mobil
     masaüstü farketmez, ayrıca telefonu dijital lazer olarak kullanma özelliği
     ekleyelim ... fare lazer veya büyüteç gibi". Üst çubuk kalktı: bilgisayarda
     da yüzen kumanda tuşu + panel. Panelde «Lazer» ve «Büyüteç»: parmağın ya da
     farenin altındaki öğe (yazıdaysa harf) tahtada kendi düzeninde bulunur.
     Lazer: kırmızı nokta + kısa iz. Büyüteç: tahtada o yer 2× (3×, 1,5×) büyür.
   · 7. SÜRÜM (26.10.2026) — BİRLİKTE ÇIKIŞ. Öğretmen: "kumanda kullanılırken bi
     cihazın kumanda özelliğinden çıkınca diğerinden de otomatik çıkılsın".
     Kumanda «Bitir» deyince Sınıf Ekranı da kabuktan çıkar (ana sayfa; yeni
     yansıtmada kendiliğinden döner). Tahtada «Çık» ya da «Bu cihaz Sınıf Ekranı
     değil» denince kumanda da çıkar (açık sayfasında kalır): tahta
     tahta/<uid>/cikis = { id, bas } yazar. Uyku, bağlantı kopması çıkış sayılmaz.

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
   Veri yolu: tahta/<uid>/ yayin · olay/0..63 · kay · alan · ayar · izle/<cihaz> · isaret (lazer/büyüteç)
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
  /* CİHAZ ADI TEK (21.10.2026) — öğretmen: "çıkış yaparken ki cihaz isimleri ile kumanda
     olarak yansıtılan cihaz isimleri aynı olsun". Ad: elle verilen ad (kidef_cihaz_ad; eski
     tahta adı kidef_tahta_ad) ya da «Tür + kalıcı kimliğin son 3 harfi» (Telefon 7QX,
     Tahta 3KD). hesap/cihazlar.js (Çıkış yap penceresi) aynı kuralla yazar. */
  function tahtaAdi() {                    /* elle verilen ad (yoksa boş) */
    var ad = '';
    if (window.__kidefTahtaAd != null) return String(window.__kidefTahtaAd).slice(0, 40);     /* deneme kancası */
    try { ad = (localStorage.getItem('kidef_cihaz_ad') || localStorage.getItem('kidef_tahta_ad') || '').trim(); } catch (e) { }
    return ad.slice(0, 40);
  }
  function cihazTuru() {                   /* hesap/cihazlar.js cihazBilgi() ile aynı */
    if (CIHAZ === 'tahta') return 'tahta';
    try { if (localStorage.getItem('kidef_tahta_cihaz') === 'tahta') return 'tahta'; } catch (e) { }
    var ua = navigator.userAgent || '', kisa = 9999;
    try { kisa = Math.min(screen.width, screen.height); } catch (e) { }
    var ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (/iPhone|iPod|Windows Phone/.test(ua) || (/Android/.test(ua) && /Mobile/.test(ua) && kisa <= 600)) return 'telefon';
    if (ipad || (/Android/.test(ua) && kisa <= 820)) return 'tablet';
    if (/Android/.test(ua)) return 'tahta';
    return 'bilgisayar';
  }
  var TUR_KISA = { bilgisayar: 'Bilgisayar', telefon: 'Telefon', tablet: 'Tablet' };
  function cihazAdiVarsayilan() {
    var t = cihazTuru(), n = KIMLIK.slice(-3).toUpperCase();
    if (t === 'tahta') return kd('th.tahta_n', 'Tahta {n}', { n: n });
    return kd('cih.ad_' + t, TUR_KISA[t] + ' {n}', { n: n });
  }
  function cihazAdi() { return tahtaAdi() || cihazAdiVarsayilan(); }
  function tahtaAdiVarsayilan() { return cihazAdiVarsayilan(); }
  function tahtaAdiYaz(ad) {
    ad = String(ad == null ? '' : ad).trim().slice(0, 40);
    if (ad === cihazAdiVarsayilan()) ad = '';
    try {
      if (ad) localStorage.setItem('kidef_cihaz_ad', ad); else localStorage.removeItem('kidef_cihaz_ad');
      localStorage.removeItem('kidef_tahta_ad');
    } catch (e) { }
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
    return { kimlik: KIMLIK, ad: cihazAdi(), sinif: sn ? sn.ad : null, sinifAcik: !!(sn && sn.acik) };
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
    '.th-hedef[hidden]{display:none!important}',             /* tek Sınıf Ekranı: seçici yok (21.10.2026) */
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
    '.th-ktus[hidden]{display:none}',
    '.th-kpanel .th-dug[disabled]{opacity:.42;cursor:default}',
    '.th-kpanel .th-dug[hidden]{display:none}',
    /* TAHTADA KUMANDA TUŞU (21.10.2026): öğrenciler görür — soluk durur, dokununca belirginleşir */
    'body.th-izle .th-ktus{opacity:.42;transition:opacity .2s}',
    'body.th-izle .th-ktus:hover,body.th-izle .th-ktus:active,body.th-izle .th-ktus.acik,body.th-izle .th-ktus.suruk{opacity:1}',
    'body.th-izle .th-kpanel{width:min(400px,calc(100vw - 20px));font-size:15px}',
    'body.th-izle .th-kpanel .th-dug{height:52px;font-size:15px}',
    'body.th-izle .th-kpanel .th-dug svg{width:19px;height:19px}',
    /* panelde tahtanın adı, ipucu ve «Sınıf Ekranı değil» (bekleme ekranı kalktı, 21.10.2026) */
    '.th-kpanel .th-zad{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-2px 2px 10px;font-size:13px;line-height:1.3}',
    '.th-kpanel .th-zad b{font-weight:800}',
    '.th-kpanel .th-zad .th-zsinif{opacity:.78;font-weight:600}',
    '.th-kpanel .th-zadver{margin-inline-start:auto;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;',
    ' border-radius:999px;padding:5px 11px;font:700 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}',
    '.th-kpanel .th-zipucu{margin:0 2px 10px;font-size:13px;font-weight:600;line-height:1.4;opacity:.82}',
    '.th-kpanel .th-zipucu[hidden]{display:none}',
    '.th-kpanel .th-zunut{display:block;margin:10px auto 0;background:none;border:0;padding:4px 6px;color:rgba(255,255,255,.72);',
    ' font:600 12.5px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:underline;cursor:pointer}',
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
    /* KUMANDA HER CİHAZDA PANEL (22.10.2026): «kaldığın yerden» perdesi çubuksuz tam boy */
    'body.th-mobil .th-devam{top:0}',
    /* LAZER · BÜYÜTEÇ (22.10.2026) */
    '.th-kpanel .th-dug.th-arac[aria-pressed="true"]{background:#dc2626;border-color:#dc2626;color:#fff}',
    '.th-kpanel .th-dug.th-arac.buyutec[aria-pressed="true"]{background:#16A085;border-color:#16A085;color:#fff}',
    '.th-isaret-alan{position:fixed;inset:0;z-index:40;touch-action:none;background:transparent;cursor:crosshair;',
    ' -webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}',
    '.th-isaret-alan.lazer.fare{cursor:none}',
    '.th-isaret-alan.buyutec.fare{cursor:zoom-in}',
    '.th-isaret-halka{position:fixed;left:0;top:0;z-index:41;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;pointer-events:none;',
    ' box-sizing:border-box;border:3px solid rgba(239,68,68,.95);box-shadow:0 0 0 5px rgba(239,68,68,.16),0 0 20px rgba(239,68,68,.55)}',
    '.th-isaret-halka.fare{width:14px;height:14px;margin:-7px 0 0 -7px;background:#ef4444;border:2px solid #fff;box-shadow:0 0 12px 3px rgba(239,68,68,.65)}',
    '.th-isaret-halka.buyutec{border-color:#16A085;box-shadow:0 0 0 5px rgba(22,160,133,.18),0 0 18px rgba(22,160,133,.5)}',
    '.th-isaret-halka.buyutec.fare{width:30px;height:30px;margin:-15px 0 0 -15px;background:transparent;border:3px solid #16A085}',
    /* 2. sürüm: bırakılan yer kumandada da işaretli */
    '.th-isaret-halka.dinlen{width:16px;height:16px;margin:-8px 0 0 -8px;background:#ef4444;border:2px solid #fff;',
    ' box-shadow:0 0 0 3px rgba(239,68,68,.25),0 0 12px 3px rgba(239,68,68,.55)}',
    '.th-isaret-halka.buyutec.dinlen{width:36px;height:36px;margin:-18px 0 0 -18px;background:rgba(22,160,133,.08);border:3px solid #16A085;',
    ' box-shadow:0 0 0 4px rgba(22,160,133,.18)}',
    /* TAHTA ALANI (22.10.2026): kumandada tahtanın oranında alan, içinde tahtanın görüntüsü */
    '.th-talan{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:42;box-sizing:border-box;display:flex;flex-direction:column;gap:6px;',
    ' padding:8px;border-radius:16px;background:rgba(15,42,67,.97);box-shadow:0 18px 50px rgba(0,0,0,.45);touch-action:none;margin-top:14px}',
    '.th-talan-bas{display:flex;align-items:baseline;gap:8px;color:#cfe3f5;font:600 12px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;padding:0 4px}',
    '.th-talan-bas b{color:#fff;letter-spacing:.08em;text-transform:uppercase;font-size:11px;font-weight:800}',
    '.th-talan-govde{position:relative;overflow:hidden;border-radius:10px;background:#fff;touch-action:none}',
    '.th-talan-ic{position:absolute;left:0;top:0;border:0;margin:0;transform-origin:0 0;pointer-events:none;background:#fff}',
    '.th-talan-yuzey{position:absolute;left:0;top:0;right:0;bottom:0;z-index:3;cursor:crosshair;touch-action:none;-webkit-tap-highlight-color:transparent}',
    '.th-talan.bekle .th-talan-ic{visibility:hidden}',
    '.th-talan.bekle .th-talan-govde{background:repeating-linear-gradient(45deg,#f1f5f9 0 10px,#e2e8f0 10px 20px)}',
    '.th-talan-nokta{position:absolute;left:0;top:0;z-index:2;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;pointer-events:none;',
    ' box-sizing:border-box;background:#ef4444;border:2px solid #fff;box-shadow:0 0 0 3px rgba(239,68,68,.3),0 0 12px 3px rgba(239,68,68,.6)}',
    '.th-talan.buyutec .th-talan-nokta{width:30px;height:30px;margin:-15px 0 0 -15px;background:rgba(22,160,133,.12);border:3px solid #16A085;',
    ' box-shadow:0 0 0 4px rgba(22,160,133,.22)}',
    'body.th-alanli .th-isaret-alan{background:rgba(15,23,42,.45)}',
    '.th-araccip button[data-ac="alan"][aria-pressed="true"]{background:#fff;color:#0f2a43}',
    '.th-araccip{width:max-content}',          /* left:50% genişliği yarım ekranla sınırlamasın: yazı kesilmesin */
    '.th-araccip{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:47;display:flex;align-items:center;gap:8px;',
    ' max-width:calc(100vw - 20px);box-sizing:border-box;background:rgba(15,42,67,.95);color:#fff;border-radius:999px;padding:6px 6px 6px 14px;',
    ' box-shadow:0 8px 24px rgba(0,0,0,.3);font:700 13.5px/1.25 system-ui,-apple-system,"Segoe UI",sans-serif}',
    '.th-araccip .th-acnokta{flex:none;width:10px;height:10px;border-radius:50%;background:#ef4444;box-shadow:0 0 10px 2px rgba(239,68,68,.7);',
    ' animation:thAcNabiz 1.3s ease-in-out infinite}',
    '.th-araccip.buyutec .th-acnokta{background:#16A085;box-shadow:0 0 10px 2px rgba(22,160,133,.7)}',
    '@keyframes thAcNabiz{50%{transform:scale(.7);opacity:.6}}',
    '.th-araccip{pointer-events:none} .th-araccip button{pointer-events:auto}',          /* çipin altına da işaret edilebilsin */
    '.th-araccip span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.th-araccip button{flex:none;border:0;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;',
    ' font:800 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;padding:8px 12px;min-width:36px}',
    '.th-araccip button:hover{background:rgba(255,255,255,.26)}',
    /* tahta: lazer tuvali (sayfanın üstünde, perdenin altında), büyüteç */
    '.th-lazer{position:fixed;left:0;top:0;width:100%;height:100%;z-index:28;pointer-events:none}',
    '.th-cerceve.th-buyuk{will-change:transform}',
    /* 2. sürüm: lazer noktası (öğe; iz tuvalde) ve mercek */
    '.th-lazer-nokta{position:fixed;left:0;top:0;width:0;height:0;z-index:29;pointer-events:none;will-change:transform}',
    '.th-lazer-nokta::before{content:"";position:absolute;left:-29px;top:-29px;width:58px;height:58px;border-radius:50%;',
    ' background:radial-gradient(circle,rgba(255,70,70,.9) 0,rgba(255,0,0,.45) 35%,rgba(255,0,0,0) 70%);animation:thLzNabiz 1.05s ease-in-out infinite}',
    '.th-lazer-nokta i{position:absolute;left:-9px;top:-9px;width:18px;height:18px;border-radius:50%;box-sizing:border-box;',
    ' border:2.6px solid #e10000;background:radial-gradient(circle,#fff8f8 0,#fff8f8 4.6px,rgba(255,248,248,0) 5.4px)}',
    '.th-lazer-nokta.gel{animation:thLzGel .22s ease-out}',
    '.th-lazer-nokta.disari{opacity:.55}',
    '.th-lazer-nokta.dinlen::before{animation-duration:1.7s}',
    '.th-lazer-nokta.git{opacity:0;transition:opacity .2s ease}',
    '@keyframes thLzNabiz{0%,100%{transform:scale(.9)}50%{transform:scale(1.12)}}',
    '@keyframes thLzGel{from{opacity:0}}',
    '.th-mercek{position:fixed;left:0;top:0;z-index:28;border-radius:50%;overflow:hidden;pointer-events:none;background:#fff;will-change:transform;',
    ' box-shadow:0 0 0 4px #fff,0 0 0 7px rgba(22,160,133,.95),0 16px 44px rgba(0,0,0,.38);transition:opacity .2s ease}',
    '.th-mercek.gizli{opacity:0}',
    '.th-mercek::after{content:"";position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;box-shadow:inset 0 0 22px rgba(0,0,0,.16);pointer-events:none}',
    '.th-mercek-ic{position:absolute;left:0;top:0;border:0;margin:0;padding:0;transform-origin:0 0;background:#fff;pointer-events:none}',
    '@media (prefers-reduced-motion:reduce){.th-lazer-nokta::before{animation:none}}',
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
    lazer: '<svg viewBox="0 0 24 24"><path d="M3.5 20.5l9-9"/><circle cx="16.6" cy="7.4" r="2.5" fill="currentColor" stroke="none"/>' +
      '<path d="M16.6 2v1.4M22 7.4h-1.4M20.4 3.6l-1 1M20.4 11.2l-1-1M12.8 3.6l1 1"/></svg>',
    buyutec: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4L21 21"/><path d="M10.5 7.8v5.4M7.8 10.5h5.4"/></svg>',
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
    if (!tur) { b.hidden = true; zKumandaGoster(); return; }
    /* BEKLEME EKRANI YOK (21.10.2026): Sınıf Ekranı beklerken ya da yansıtma başka
       tahtadayken sitenin kendisini gösterir; durum ve tuşlar kumanda panelinde */
    if (CIHAZ === 'tahta' && (tur === 'izle' || tur === 'baska')) { b.hidden = true; zBosGoster(tur, ek); return; }
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
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="tam" data-th-tam="1">' + kac(kd('th.tam_ekran', 'Tam ekran')) + '</button>' +
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
        '<div class="th-tuslar"><button type="button" class="th-ana" data-th="tam" data-th-tam="1">' + kac(kd('th.tam_ekran', 'Tam ekran')) + '</button>' +
        '<button type="button" class="th-ikinci" data-th="cik">' + kac(kd('th.cik', 'Çık')) + '</button></div>' +
        /* tahta cihazında seçim paneli artık yok (sistem/tahtagir.js): işaret buradan kalkar */
        '<button type="button" class="th-unut" data-th="unut">' + kac(kd('th.p_unut', 'Bu cihaz tahta değil')) + '</button>';
    }
    b.innerHTML = '<div class="th-kutu">' + ic + '</div>';
    b.setAttribute('data-tur', tur);
    b.hidden = false;
    zKumandaGoster();
    tamTusTazele();
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
  /* 21.10.2026 — öğretmen: "akıllı tahtadaki müstakil tam ekran svg sini bunun
     içine taşıyalım": sol ortadaki soluk tuş KALKTI; tam ekran artık tahtadaki
     kumanda panelinde ve bekleme ekranında (data-th-tam). Tam ekrandayken
     «Tam ekrandan çık» olur; ana ekrana eklenmiş uygulama tam ekran kipinde
     açıldıysa (girilecek/çıkılacak tam ekran yok) görünmez. */
  function tamTusTazele() {
    if (CIHAZ !== 'tahta' || !document.body) return;
    var d = document, acik = !!(d.fullscreenElement || d.webkitFullscreenElement);
    var el = d.documentElement, destek = !!(el.requestFullscreen || el.webkitRequestFullscreen);
    var uyg = false;
    try { uyg = !!(window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches) && !acik; } catch (e) { }
    var gor = acik || (destek && !uyg);
    var yazi = acik ? kd('th.tam_cik', 'Tam ekrandan çık') : kd('th.tam_ekran', 'Tam ekran');
    [].forEach.call(d.querySelectorAll('[data-th-tam]'), function (b) {
      b.setAttribute('data-th', acik ? 'tamcik' : 'tam');
      b.hidden = !gor;
      b.title = yazi;
      if (b.classList.contains('th-dug')) {
        var h = (acik ? SVG.tamcik : SVG.tam) + '<span>' + kac(yazi) + '</span>';
        if (b.innerHTML !== h) b.innerHTML = h;
        b.setAttribute('aria-pressed', acik ? 'true' : 'false');
      } else if (b.textContent !== yazi) b.textContent = yazi;
    });
    var eski = $('thTamCik');
    if (eski) eski.parentNode.removeChild(eski);
  }
  function tamCikTazele() { tamTusTazele(); }
  function tamCik() {
    var d = document;
    try {
      var f = d.exitFullscreen || d.webkitExitFullscreen;
      if (f && (d.fullscreenElement || d.webkitFullscreenElement)) { var p = f.call(d); if (p && p.catch) p.catch(function () { }); }
    } catch (e) { }
  }

  function cik(adres, isaret) {
    try { if (IA.arac) aracSec(null); } catch (e) { }
    var k = S.kok, liderdim = S.lider;
    S.lider = false; S.kok = null;
    try {
      if (k) k.child('yayin').onDisconnect().cancel();
      if (k && CIHAZ === 'bilgisayar') {
        /* "Bitir": ders bitti (bitir) — tahta onu üstlenmez, ana sayfa kumandaya geri dönmez */
        k.update({ 'yayin/cevrimici': false, 'yayin/bitir': true, 'yayin/vekil': null, 'yayin/ts': TS(), 'olay': null, 'kay': null, 'alan': null, 'ayar/perde': false, 'ayar/kg': false, 'isaret': null, 'gorus': null, 'kanal': null, 'kanalIste': null });
        k.child('izle/' + BEN).remove();
        try { localStorage.removeItem('kidef_kumanda_son'); } catch (e) { }
      } else if (k) {
        /* "Çık": aynı yansıtma sürdükçe ana sayfa tahtayı geri sürüklemesin
           (sistem/tahtagir.js bakar; yeni yansıtmada tahta yine kendiliğinden açılır) */
        try { localStorage.setItem('kidef_tahta_birakti', JSON.stringify({ bas: (S.yayin && S.yayin.bas) || null, t: Date.now() })); } catch (e) { }
        /* tahta kullanılırken çıkılırsa kontrol bilgisayara döner */
        if (liderdim && S.yayin && S.yayin.cevrimici && S.yayin.id === BEN) k.child('yayin').update({ cevrimici: false, ts: TS() });
        /* BİRLİKTE ÇIKIŞ (26.10.2026): tahtadan BİLEREK çıkıldı («Çık», «Bu cihaz Sınıf Ekranı
           değil») — kumanda da çıksın. Yalnız bu yansıtma oturumu (bas) için; bağlantı
           kopması, başka cihazın Sınıf Ekranı olması çıkış yazmaz. */
        if (isaret) k.child('cikis').set({ id: BEN, kimlik: KIMLIK, cihaz: CIHAZ, bas: (S.yayin && S.yayin.bas) || null, ts: TS() });
        k.child('izle/' + BEN).onDisconnect().cancel();
        k.child('izle/' + BEN).remove();
      }
    } catch (e) { }
    var u = adres || 'index.html';
    setTimeout(function () { location.href = u; }, isaret ? 300 : 120);
  }
  /* BİRLİKTE ÇIKIŞ (26.10.2026): öbür cihaz bilerek çıktı — bu cihaz da çıkar.
     Tahta: kumanda «Bitir» dedi → ana sayfa. Kumanda: Sınıf Ekranı kapandı → açık
     sayfasında kalır (Bitir gibi; yansıtma biter). */
  function birlikteCik(neden) {
    if (S.cikiyor) return;
    S.cikiyor = true;
    try { kumandaKapat(); } catch (e) { }
    try { var dv = $('thDevam'); if (dv) dv.hidden = true; } catch (e) { }
    bildir(neden === 'kumanda' ? kd('th.b_birlikte_kumanda', 'Kumanda yansıtmayı bitirdi. Sınıf Ekranı da kapanıyor…')
                               : kd('th.b_birlikte_tahta', 'Sınıf Ekranı kapandı. Kumanda da kapanıyor…'), 3000);
    setTimeout(function () {
      if (CIHAZ === 'tahta') { cik('index.html'); return; }
      var w = CERCEVE.contentWindow, u = '';
      try { u = gercekSayfa(w) ? adresAl(w) : ''; } catch (e) { u = ''; }
      if (!u || /\/tahta\.html/.test(u)) u = 'index.html';
      cik(u);
    }, 1500);
  }
  /* kumanda: tahtadan bilerek çıkıldı (tahta/<uid>/cikis) — bu oturumun Sınıf Ekranıysa kumanda da çıkar */
  function cikisGeldi(v) {
    if (CIHAZ !== 'bilgisayar' || !S.kok || S.cikiyor || S.devredildi || !v || !v.id || v.id === BEN) return;
    var bas = S.bas || (S.yayin && S.yayin.bas) || null;
    if (!bas || v.bas !== bas) return;                               /* başka (eski) yansıtmanın çıkışı */
    var e = S.ekran;
    if (e && e.id && e.id !== v.id) return;                          /* Sınıf Ekranı başka bir cihaz: o sürüyor */
    birlikteCik('tahta');
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-th]') : null;
    if (!t) return;
    var is = t.getAttribute('data-th');
    if (is === 'anasayfa') cik('index.html');
    else if (is === 'yenile') location.reload();
    else if (is === 'cik') cik(ROL === 'izle' ? 'index.html' : (adresAl(CERCEVE.contentWindow) || 'index.html'), true);   /* bilerek: öbür cihaz da çıkar (26.10.2026) */
    else if (is === 'tam') { TAM.istek = true; tamEkran(); setTimeout(tamTusTazele, 400); }
    else if (is === 'tamcik') tamCik();
    else if (is === 'zkip') zKipDegistir();
    else if (is === 'zperde') zPerdeDegistir();
    else if (is === 'zesitle') zEsitle();
    else if (is === 'ad') {
      var yeniAd = window.prompt(kd('th.ad_sor', 'Bu tahtanın adı (ör. 7-A sınıfı):'), tahtaAdi() || tahtaAdiVarsayilan());
      if (yeniAd === null) return;
      tahtaAdiYaz(yeniAd);
      if (CIHAZ === 'tahta' && S.ekran && S.ekran.id === BEN) ekranSahiplen();
      if (S.kok) varlikYaz(false);
      var bk = $('thBekle');
      if (bk && !bk.hidden) { var bt = bk.getAttribute('data-tur'); if (bt) bekleGoster(bt, S.yayin); }
      if (CIHAZ === 'tahta') zNoktaYaz();
      bildir(kd('th.ad_kaydedildi', 'Tahtanın adı: {ad}', { ad: tahtaAdi() || tahtaAdiVarsayilan() }));
    }
    else if (is === 'unut') {
      try { localStorage.removeItem('kidef_tahta_cihaz'); localStorage.removeItem('kidef_tahta_birakti'); } catch (e) { }
      /* hesabın Sınıf Ekranı bu sayfaysa kayıt silinir (kumanda «… bekleniyor» demesin) */
      S.ekranBirakti = true;
      try { if (S.kok && S.ekran && S.ekran.id === BEN) S.kok.child('ekran').remove(); } catch (e) { }
      cik('index.html', true);
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
      else { v.kimlik = KIMLIK; v.ad = cihazAdi(); }
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
    var y = { id: BEN, cihaz: CIHAZ, kimlik: KIMLIK, cihazAd: cihazAdi(), cevrimici: true, d: Y.d, u: b.u, dil: b.dil, s0: Y.s0, durak: false, ts: TS(),
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
    if (kanalAlaninda(el, Y.belge)) return;          /* o bölümü sayfa taşır (kanal) */
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
    if (kanalAlaninda(el, Y.belge)) return;
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
    if (!izlenecekAlan(el) || kanalAlaninda(el)) return;
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
    if (!izlenecekAlan(el) || kanalAlaninda(el)) return;
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
  /* --- kaydırma: belge (çapa öğeyle) ve içte kayan kutular (oranla)
     AKICI KAYDIRMA (22.10.2026) — öğretmen: "kumanda mobil olunca dikey kaydırmada
     masaüstünde sürekli ekran takılıyormuş gibi oluyor, öyle bi oranla yapalım ki bu
     kasma olmasın". Telefonda alt alta duran kartlar / harfler tahtada yan yana durur:
     tahta her kartta satırın başına geri sıçrıyordu; çizgi iki bölümün arasındaki
     boşluğa düşünce sayfanın oranına geçip yine sıçrıyordu; konumlar da tek tek
     atlanıyordu. Şimdi çapa satır içi öğe (b, span…) olmaz, boşlukta yakındaki öğe
     aranır ve çapanın atalarındaki yeri de gider (oz): tahta, kendinde yan yana duran
     öğelerde onları kapsayan kutunun içindeki ORANLA iner (zBelgeKaydir) ve gelen
     yere sıçramaz, yumuşakça kayar (AK). */
  function capaUygun(el, w, d, denendi, ust) {
    var e = el;
    while (e && e !== d.body && e !== d.documentElement) {
      if (denendi.indexOf(e) >= 0) return null;            /* buradan yukarısı denendi */
      denendi.push(e);
      var cs = w.getComputedStyle(e);
      if (cs.position === 'fixed' || cs.position === 'sticky') return null;
      if (cs.display !== 'inline' && cs.display !== 'contents') {
        var r = e.getBoundingClientRect();
        if (r.height > 4 && r.height < ust) return e;
      }
      e = e.parentElement;
    }
    return null;
  }
  function belgeKonumu() {
    var w = Y.win, d = Y.belge, se = d.scrollingElement || d.documentElement;
    var max = se.scrollHeight - w.innerHeight;
    var f = max > 0 ? se.scrollTop / max : 0;
    var cizgi = w.innerHeight / 3, a = null;
    try {
      /* çizgi boşluğa (iki bölümün arası, sütun aralığı) düşerse biraz aşağısı/yukarısı, sağı/solu */
      var xs = [w.innerWidth / 2, w.innerWidth * 0.3, w.innerWidth * 0.7], ds = [0, 10, -10, 24, -24, 50, -50, 100, -100], denendi = [];
      for (var i = 0; i < ds.length && !a; i++) {
        for (var j = 0; j < xs.length && !a; j++) {
          var el = d.elementFromPoint(xs[j], cizgi + ds[i]);
          if (el) a = capaUygun(el, w, d, denendi, w.innerHeight * 0.9);
        }
      }
      /* çizgide yalnız ekrandan uzun bir öğe varsa (büyük resim, tuval) o: içinde oranla */
      if (!a) { var el2 = d.elementFromPoint(xs[0], cizgi); if (el2) a = capaUygun(el2, w, d, [], Infinity); }
    } catch (e) { a = null; }
    var k = { d: Y.d, f: Math.round(f * 100000) / 100000, z: sunucuZaman() };
    if (a) {
      var r = a.getBoundingClientRect(), oz = [], ata = a.parentElement;
      k.a = yolAl(a, d); k.o = Math.round((cizgi - r.top) / r.height * 10000) / 10000;
      while (ata && ata !== d.body && ata !== d.documentElement && oz.length < 20) {
        var q = ata.getBoundingClientRect();
        oz.push(q.height > 0 ? Math.round((cizgi - q.top) / q.height * 10000) / 10000 : 0);
        ata = ata.parentElement;
      }
      if (oz.length) k.oz = oz;
    }
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
    var bekle = Math.max(0, 50 - (SIMDI() - Y.kaySon));            /* akıcı kaydırma: 70 → 50 ms */
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
      setTimeout(function () { alanKontrol(); kayHepsi(); kanalAnlikYolla(); }, 30);
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
  /* tahta: AKICI KAYDIRMA (22.10.2026). Gelen konuma sıçramaz; kritik sönümlü yayla
     (yaklaşık 0,1 sn'de yetişir, hedefi geçmez) ekranın her karesinde biraz kayar. Bir
     belgede/kutuda ilk konum ve 3 ekrandan uzak hedef doğrudan. Tahta lider olunca durur. */
  var AK = { l: [], raf: 0, tz: 0 };
  function akKaydir(el, w, y, x, belgeMi) {
    AK.l = AK.l.filter(function (k) { return k.b === Z.belge && k.el.isConnected && k.el.ownerDocument && k.el.ownerDocument.defaultView; });
    var k = null;
    for (var i = 0; i < AK.l.length; i++) if (AK.l[i].el === el) { k = AK.l[i]; break; }
    var yeni = !k;
    if (yeni) { k = { el: el, w: w, b: Z.belge, belge: belgeMi, y: el.scrollTop, x: el.scrollLeft, vy: 0, vx: 0, sy: el.scrollTop, sx: el.scrollLeft }; AK.l.push(k); }
    else {
      if (Math.abs(el.scrollTop - k.sy) > 3) { k.y = el.scrollTop; k.vy = 0; }       /* başka bir şey kaydırmış */
      if (Math.abs(el.scrollLeft - k.sx) > 3) { k.x = el.scrollLeft; k.vx = 0; }
    }
    k.ty = y; k.tx = x;
    var boy = belgeMi ? w.innerHeight : (el.clientHeight || w.innerHeight), en = belgeMi ? w.innerWidth : (el.clientWidth || w.innerWidth);
    var atla = false;
    if (yeni || Math.abs(y - k.y) > boy * 3) { k.y = y; k.vy = 0; atla = true; }
    if (yeni || Math.abs(x - k.x) > en * 3) { k.x = x; k.vx = 0; atla = true; }
    if (atla) akYaz(k);
    if (k.y !== k.ty || k.x !== k.tx) { if (!AK.raf) AK.raf = requestAnimationFrame(akAdim); }
  }
  function akYay(c, h, v, dt) {
    var om = 2 / 0.1, x = om * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var d = c - h, g = (v + om * d) * dt;
    v = (v - om * g) * e;
    var n = h + (d + g) * e;
    if ((h - c) * (n - h) > 0) { n = h; v = 0; }                /* hedefi geçmez */
    return [n, v];
  }
  function akAdim() {
    AK.raf = 0;
    if (S.lider) { AK.l.forEach(function (k) { k.ty = k.y; k.tx = k.x; k.vy = k.vx = 0; }); AK.tz = 0; return; }
    var now = SIMDI(), dt = AK.tz ? Math.min(0.05, Math.max(0.004, (now - AK.tz) / 1000)) : 1 / 60;
    AK.tz = now;
    var surer = false;
    AK.l.forEach(function (k) {
      if (k.b !== Z.belge || !k.el.isConnected) return;
      if (k.y !== k.ty) {
        var a = akYay(k.y, k.ty, k.vy, dt); k.y = a[0]; k.vy = a[1];
        if (Math.abs(k.ty - k.y) < 0.5 && Math.abs(k.vy) < 6) { k.y = k.ty; k.vy = 0; }
      }
      if (k.x !== k.tx) {
        var b = akYay(k.x, k.tx, k.vx, dt); k.x = b[0]; k.vx = b[1];
        if (Math.abs(k.tx - k.x) < 0.5 && Math.abs(k.vx) < 6) { k.x = k.tx; k.vx = 0; }
      }
      akYaz(k);
      if (k.y !== k.ty || k.x !== k.tx) surer = true;
    });
    if (surer) AK.raf = requestAnimationFrame(akAdim); else AK.tz = 0;
  }
  function akYaz(k) {
    try {
      if (k.belge) k.w.scrollTo({ top: k.y, left: k.x, behavior: 'instant' });
      else if (k.el.scrollTo) k.el.scrollTo({ top: k.y, left: k.x, behavior: 'instant' });
      else { k.el.scrollTop = k.y; k.el.scrollLeft = k.x; }
    } catch (e) { try { k.el.scrollTop = k.y; k.el.scrollLeft = k.x; } catch (x) { } }
    k.sy = k.el.scrollTop; k.sx = k.el.scrollLeft;
  }
  /* tahta: telefonda alt alta, burada yan yana duran öğe (kart, harf, iki sütun).
     Ekranın 1,5 katından uzun sütunlar (ör. yazı + kenar çubuğu) sayılmaz: onların
     içinde tahta yine aynı paragrafı aynı yerde tutar. */
  function yanYana(el, w) {
    var r = el.getBoundingClientRect();
    if (!(r.height > 0) || r.height > w.innerHeight * 1.5) return false;
    var yon = ['previousElementSibling', 'nextElementSibling'];
    for (var i = 0; i < 2; i++) {
      var s = el[yon[i]], n = 0;
      while (s && n++ < 4) {
        var q = s.getBoundingClientRect();
        if (q.height > 0 && q.width > 0) {
          var p = penceresi(s, w).getComputedStyle(s).position;
          if (p !== 'absolute' && p !== 'fixed') {
            var ort = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
            if (ort > 2 && ort > Math.min(r.height, q.height) * 0.3) return true;
            break;                                            /* en yakın görünen kardeş alt/üstte */
          }
        }
        s = s[yon[i]];
      }
    }
    return false;
  }
  /* tahta: çapa ya da atalarından biri burada yan yana duruyorsa en üsttekinin
     kabı esas alınır — telefon o kapta ne kadar ilerlediyse tahta da o oranda
     (geri sıçramaz); yoksa çapanın kendisi (aynı öğe aynı yerde) */
  function zBelgeKaydir(s) {
    var w = Z.win, d = Z.belge, se = d.scrollingElement || d.documentElement;
    var hedef = null;
    if (s.a) {
      var el = yolBul(s.a, d);
      if (el) {
        var zin = [el], oz = [+s.o || 0], e = el, i, j;
        for (i = 0; s.oz && i < s.oz.length; i++) {
          e = e.parentElement;
          if (!e || e === d.body || e === d.documentElement) break;
          zin.push(e); oz.push(+s.oz[i] || 0);
        }
        var sec = 0;
        for (j = zin.length - 1; j >= 0; j--) if (yanYana(zin[j], w)) { sec = j + 1; break; }
        while (sec < zin.length && !(zin[sec].getBoundingClientRect().height > 0)) sec++;
        if (sec < zin.length) {
          var r = zin[sec].getBoundingClientRect();
          hedef = se.scrollTop + r.top + oz[sec] * r.height - w.innerHeight / 3;
        }
      }
    }
    if (hedef == null) hedef = (s.f || 0) * (se.scrollHeight - w.innerHeight);
    hedef = Math.max(0, Math.min(se.scrollHeight - w.innerHeight, hedef));
    akKaydir(se, w, hedef, 0, true);
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
          akKaydir(el, s.ic ? el.ownerDocument.defaultView : penceresi(el, Z.win),
                   Math.round((s.f || 0) * (el.scrollHeight - el.clientHeight)), Math.round((s.x || 0) * (el.scrollWidth - el.clientWidth)), !!s.ic);
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

  /* ======================================== KANAL: SAYFANIN KENDİ DURUMU (22.10.2026)
     Öğretmen: "defterde yazı yazınca da yansıtılan ekranda görünmeli neden görünmüyor".
     Yansıtma tıklamayı, tuşu, yazı alanını ve kaydırmayı taşır; defterde parmakla /
     kalemle yazılan çizgi bunların hiçbiri değil, tahtaya gitmiyordu. Bu kanal,
     çerçevedeki sayfanın KENDİ durumunu öbür cihaza taşır: sayfa (ör. defter)
     KidefTahta.kanal.kur(ad, {belge, gelen, anlik}) ile bağlanır; lider gonder(m) ile
     yollar, izleyen gelen(m) ile alır. İletiler tahta/<uid>/kanal halkasında sırayla
     (n) ve sayfa sayacıyla (d) gider. İzleyen yeni bağlanınca, lider değişince ya da
     bir ileti kaçınca liderden ANLIK durumu ister (kanalIste): lider sayfanın
     anlik()'ini yollar, izleyen ondan sürer. Kanalın kurulduğu bölümde
     ([data-tahta-kanal]) tıklama / tuş / yazı yansıtılmaz — o bölümün durumunu sayfa
     taşır, işlem iki kez uygulanmaz. */
  var KN = { h: null, n: 0, enN: 0, son: null, i: null, bek: {}, istek: null, isteZ: null, isteSay: 0, jeton: '', cevapZ: null, boslukZ: null };
  var KANAL_HALKA = 64;
  function cerceveBelge() { try { return CERCEVE.contentDocument; } catch (e) { return null; } }
  function kanalAlaninda(el, d) {
    try {
      if (el && el.closest && el.closest('[data-tahta-kanal]')) return true;
      if (d && (!el || el === d.body || el === d.documentElement) && d.querySelector('[data-tahta-kanal]')) return true;
    } catch (e) { }
    return false;
  }
  function kanalDurum() { return { oturum: !!(S.kok && oturumVar()), lider: !!S.lider }; }
  function kanalKur(ad, isl) {
    if (!ad || !isl || typeof isl.gelen !== 'function') return null;
    var h = { ad: String(ad), isl: isl, belge: isl.belge || null };
    KN.h = h;
    KN.son = null; KN.i = null; KN.bek = {}; KN.isteSay = 0;
    clearTimeout(KN.boslukZ); KN.boslukZ = null;
    if (S.kok && !S.lider && oturumVar()) kanalIsteZamanla();      /* izleyen: liderdeki hâli iste */
    else if (S.lider) kanalIstekBak();                               /* lider: bekleyen istek varsa */
    return {
      gonder: function (m) { return KN.h === h ? kanalGonder(h.ad, m) : false; },
      durum: kanalDurum,
      iste: function () { if (KN.h === h && !S.lider) { KN.son = null; kanalIsteZamanla(); } },
      birak: function () { if (KN.h === h) { KN.h = null; KN.bek = {}; KN.son = null; } }
    };
  }
  function kanalGecerli() { return !!(KN.h && KN.h.belge && KN.h.belge === cerceveBelge()); }
  function kanalGonder(ad, m) {
    if (!kanalGecerli() || KN.h.ad !== ad || !S.kok || !yayinda() || !Y.belge || KN.h.belge !== Y.belge) return false;
    KN.n = Math.max(KN.n, KN.enN) + 1;
    try { S.kok.child('kanal/' + (KN.n % KANAL_HALKA)).set({ n: KN.n, d: Y.d, i: BEN, a: ad, m: m }); } catch (e) { return false; }
    return true;
  }
  function kanalAnlikYolla(jeton) {
    if (!kanalGecerli() || !S.lider || KN.h.belge !== Y.belge) return;
    var m = null;
    try { m = KN.h.isl.anlik ? KN.h.isl.anlik() : null; } catch (e) { m = null; }
    if (!m) return;
    m.t = 'h';
    if (jeton) m.j = jeton;
    kanalGonder(KN.h.ad, m);
  }
  /* lider: izleyenin anlık durum isteği */
  function kanalIstekBak() {
    var r = KN.istek;
    if (!r || !S.lider || r.i === BEN || !kanalGecerli() || r.a !== KN.h.ad || r.d !== Y.d || KN.h.belge !== Y.belge) return;
    if (KN.cevapZ) return;
    KN.cevapZ = setTimeout(function () {
      KN.cevapZ = null;
      var r2 = KN.istek;
      if (!r2 || !S.lider) return;
      kanalAnlikYolla(r2.j || '');
      try { S.kok.child('kanalIste').set(null); } catch (e) { }
    }, 60);
  }
  /* izleyen: liderden anlık durum iste (yeni bağlandı, lider değişti, ileti kaçtı) */
  function kanalIsteZamanla() {
    if (KN.isteZ) return;
    KN.isteZ = setTimeout(function () { KN.isteZ = null; kanalIste(); }, 120);
  }
  function kanalIste() {
    if (!S.kok || S.lider || !kanalGecerli() || !oturumVar()) return;
    KN.son = null;
    KN.jeton = Math.random().toString(36).slice(2, 10);
    try { S.kok.child('kanalIste').set({ i: BEN, a: KN.h.ad, d: Z.d, j: KN.jeton, z: sunucuZaman() }); } catch (e) { }
    clearTimeout(KN.yineZ);
    KN.yineZ = setTimeout(function () {
      if (KN.son == null && kanalGecerli() && !S.lider && KN.isteSay++ < 8) kanalIste();
    }, 2500);
  }
  function kanalGeldi(s) {
    var v = s.val();
    if (!v || typeof v.n !== 'number') return;
    if (v.n > KN.enN) KN.enN = v.n;
    if (S.lider || v.i === BEN || !kanalGecerli()) return;
    var lid = S.yayin && S.yayin.id;
    if (!lid || v.i !== lid || v.d !== Z.d || v.a !== KN.h.ad) return;
    if (KN.i !== lid) { KN.i = lid; KN.son = null; KN.bek = {}; kanalIsteZamanla(); }   /* yeni lider: baştan */
    if (KN.son != null && v.n <= KN.son) return;
    KN.bek[v.n] = v;
    kanalIsle();
  }
  function kanalVer(m) { try { if (kanalGecerli()) KN.h.isl.gelen(m); } catch (e) { } }
  function kanalIsle() {
    var k, n = 0;
    for (k in KN.bek) n++;
    if (n > 3 * KANAL_HALKA) {                                       /* çok birikti: en yenileri kalsın */
      var l = Object.keys(KN.bek).map(Number).sort(function (a, b) { return a - b; });
      l.slice(0, l.length - KANAL_HALKA).forEach(function (x) { delete KN.bek[x]; });
    }
    for (var tur = 0; tur < 1000; tur++) {
      if (KN.son == null) {
        /* anlık durum bekleniyor: gelenler arasındaki en yeni «h»den başla */
        var h = null;
        for (k in KN.bek) if (KN.bek[k].m && KN.bek[k].m.t === 'h' && (!h || KN.bek[k].n > h.n)) h = KN.bek[k];
        if (!h) return;
        for (k in KN.bek) if (+k <= h.n) delete KN.bek[k];
        KN.son = h.n;
        clearTimeout(KN.yineZ); KN.isteSay = 0;
        kanalVer(h.m);
        continue;
      }
      var v = KN.bek[KN.son + 1];
      if (!v) {
        var ileride = false;
        for (k in KN.bek) if (+k > KN.son) { ileride = true; break; }
        if (ileride && !KN.boslukZ) {
          /* arada kaçan var: biraz bekle, gelmezse anlık durumu iste */
          KN.boslukZ = setTimeout(function () {
            KN.boslukZ = null;
            if (KN.son != null && !KN.bek[KN.son + 1]) { var ok = false; for (var x in KN.bek) if (+x > KN.son) { ok = true; break; } if (ok) { KN.son = null; kanalIsteZamanla(); } }
            else kanalIsle();
          }, 450);
        }
        return;
      }
      delete KN.bek[KN.son + 1];
      KN.son = v.n;
      kanalVer(v.m);
    }
  }
  /* rol değişince: lider olan sırayı sürdürür; izleyen olan liderin hâlini ister */
  function kanalLider(l) {
    clearTimeout(KN.boslukZ); KN.boslukZ = null; KN.bek = {};
    if (l) { KN.n = Math.max(KN.n, KN.enN); KN.son = null; KN.i = null; }
    else if (KN.h) { KN.son = null; KN.i = null; setTimeout(function () { if (!S.lider) kanalIste(); }, 150); }
  }

  /* ============================================== LİDERLİK (kim kullanıyor)
     Bilgisayar her zaman kontrolü alabilir; tahta yalnız "Tahtadan da
     kullan" açıkken, yansıtma sürüp duraklatılmamışken ve aynı sayfa
     tamamen yüklenip eşitlenmişken. */
  function dokunuldu() {
    if (KT.acik && KT.otomatik) kumandaKapat();            /* yansıtma başında açılan panel: sayfaya dokununca kapanır */
    hareketYaz();
    GOR.girdi = SIMDI();
    if (CIHAZ === 'bilgisayar' && !UYANIK.k) { UYANIK.hata = 0; uyanikDenetle(); }
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
    kanalLider(true);
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
    kanalLider(false);
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
    kanalLider(true);
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
  var UYANIK = { k: null, istek: false, hata: 0, dokunus: 0, bas: 0 };
  /* KUMANDANIN EKRANI KARARMASIN (21.10.2026) — öğretmen: "kumanda olan cihazın ekranın
     kararmasını engelleyen bi özellik ekleyebiliyor muyuz". Bu cihaz kumandayken
     (yansıtıyor, duraklatmış ya da tahtadaki dersi izliyor) ekran uyanık kilidi tutulur;
     son dokunuştan KUMANDA_UYANIK sonra bırakılır (unutulan telefonun pili bitmesin).
     Kilit yalnız sayfa görünürken alınır; tarayıcı desteklemiyorsa bir şey olmaz. */
  var KUMANDA_UYANIK = 45 * 60000;
  function kumandaCanli() {
    if (CIHAZ !== 'bilgisayar' || !S.kok || S.devredildi) return false;
    if (!(S.lider || oturumVar() || S.devam)) return false;
    return SIMDI() - Math.max(GOR.girdi || 0, UYANIK.dokunus || 0, UYANIK.bas || 0) < KUMANDA_UYANIK;
  }
  function uyanikGerek() { return CIHAZ === 'tahta' ? tahtaCanli() : kumandaCanli(); }
  function uyanikDenetle() {
    var iste = uyanikGerek() && !gizliMi();
    var wl = navigator.wakeLock;
    if (iste) {
      if (UYANIK.k || UYANIK.istek || !wl || typeof wl.request !== 'function') return;
      if (UYANIK.hata && SIMDI() - UYANIK.hata < 20000) return;
      UYANIK.istek = true;
      try {
        wl.request('screen').then(function (k) {
          UYANIK.istek = false; UYANIK.k = k; UYANIK.hata = 0;
          try { k.addEventListener('release', function () { if (UYANIK.k === k) UYANIK.k = null; }); } catch (e) { }
          if (!uyanikGerek()) uyanikDenetle();
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
    if (CIHAZ === 'tahta') { isaretSifirla(); setTimeout(function () { isaretDegerlendir(); gorusYaz(true); }, 350); }   /* lazer · mercek: yeni sayfada baştan; bu sayfanın işareti geldiyse görünür */
    else if (IA.arac) {                                        /* kumanda başka sayfaya geçti */
      IA.sonBilgi = null; kCapa(false); halkaYerlestir(0, 0, false);
      if (ALAN.A) { aynaKapat(ALAN.A); ALAN.A = null; }
      alanAyna();
    }
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
      /* TEK KUMANDA (21.10.2026): ders şu an BAŞKA bir cihazın kumandasında → bu sayfa
         kumanda olmaz, ana sayfaya döner. Açık istekte (karekodla «Evet» — &al=1) kumanda
         buraya geçer: bu cihaz baştan yansıtır, öbür kumanda çıkar. */
      var baskaCihaz = !!(y && y.cevrimici && !y.bitir && y.cihaz === 'bilgisayar' && y.id !== BEN && y.kimlik && y.kimlik !== KIMLIK);
      if (baskaCihaz && !S.al) { kumandaDevret(y, kok); return; }
      var surer = !!(y && y.bas && !y.bitir && y.u && (y.cevrimici ? y.id !== BEN : tahta));
      if (surer && !baskaCihaz && !(y.durak && !y.cevrimici)) { takipBasla(kok, y); return; }
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

  /* ================================== TEK KUMANDA · TEK SINIF EKRANI (21.10.2026)
     Öğretmen: "bi hesap en fazla bi cihazı kumanda olarak kullanabilir ve sadece bi
     cihaz kumandayı kullanabileceği yansıtma ekranı olabilir".
     · Kumanda: yayını en son alan kumanda sayfası geçerlidir. Öbürü (yayin.id başka
       bir kumanda sayfası) hiçbir şey yazmadan çıkar: dinleyiciler kapanır, "kopunca"
       işleri iptal edilir (yeni kumandanın yayınını kapatmasın), açık sayfaya gidilir.
     · Sınıf Ekranı: açılan tahta tahta/<uid>/ekran = { id, kimlik, ad } yazar; başka
       bir sayfa yazınca bu tahta kapanır (ana sayfa; aynı yansıtmada geri gelmez —
       sistem/tahtagir.js hesabın Sınıf Ekranı'na bakar). */
  function baskaKumanda(y) {
    if (!y || y.cihaz !== 'bilgisayar' || !y.id || y.id === BEN) return false;
    if (y.id === S.izlenenKumanda && !y.bitir) return false;       /* izlediğimiz (kopmuş) eski kumanda */
    return true;
  }
  function kumandaDevret(y, kok) {
    if (S.devredildi) return;
    S.devredildi = true;
    var k = kok || S.kok;
    S.lider = false; S.kok = null;
    try {
      if (k) {
        ['olay', 'yayin', 'kay', 'alan', 'ayar', 'izle', 'ekran', 'isaret', 'gorus', 'kanal', 'kanalIste', 'cikis'].forEach(function (p) { try { k.child(p).off(); } catch (e) { } });
        k.child('yayin').onDisconnect().cancel();
        k.child('izle/' + BEN).onDisconnect().cancel();
        k.child('izle/' + BEN).remove();
      }
    } catch (e) { }
    try {
      var son = JSON.parse(localStorage.getItem('kidef_kumanda_son') || 'null');
      if (son && (!son.ben || son.ben === BEN)) localStorage.removeItem('kidef_kumanda_son');
    } catch (e) { }
    var ad = (y && y.kimlik === KIMLIK) ? '' : String((y && y.cihazAd) || '').slice(0, 40);
    try { sessionStorage.setItem('kidef_kumanda_devir', JSON.stringify({ ad: ad, bitti: !!(y && y.bitir), t: SIMDI() })); } catch (e) { }
    uyanikDenetle();
    try { kumandaKapat(); } catch (e) { }
    try { aracSec(null); } catch (e) { }            /* S.kok yok: tahtaya yazmaz (yeni kumandanınkini silmesin) */
    var dv = $('thDevam'); if (dv) dv.hidden = true;
    clearTimeout(S.devamSonZ);
    bildir(y && y.bitir ? kd('th.b_devir_bitti', 'Yansıtma başka bir kumandadan bitirildi.')
      : (ad ? kd('th.b_devir', 'Kumanda artık {ad} cihazında. Bu cihaz kumanda değil.', { ad: ad })
            : kd('th.b_devir_yok', 'Kumanda başka bir sekmeye geçti. Bu sekme kumanda değil.')), 4000);
    var w = CERCEVE.contentWindow, u = gercekSayfa(w) ? adresAl(w) : '';
    if (!u || /\/tahta\.html/.test(u)) u = 'index.html';
    setTimeout(function () { location.href = u; }, 1500);
  }
  function ekranSahiplen() {
    if (CIHAZ !== 'tahta' || !S.kok || S.ekranBirakti) return;
    S.ekran = { id: BEN, kimlik: KIMLIK, ad: cihazAdi() };
    try { S.kok.child('ekran').set({ id: BEN, kimlik: KIMLIK, ad: cihazAdi(), ts: TS() }); } catch (e) { }
  }
  function ekranBirak(v) {
    if (S.ekranBirakti) return;
    S.ekranBirakti = true;
    var ad = String((v && v.ad) || '').slice(0, 40);
    try { sessionStorage.setItem('kidef_ekran_devir', JSON.stringify({ ad: ad, t: SIMDI() })); } catch (e) { }
    try { kumandaKapat(); } catch (e) { }
    bildir(ad ? kd('th.b_ekran_devir', 'Sınıf Ekranı artık {ad}. Bu cihaz Sınıf Ekranı olmaktan çıkıyor…', { ad: ad })
              : kd('th.b_ekran_devir_yok', 'Başka bir cihaz Sınıf Ekranı oldu. Bu cihaz Sınıf Ekranı olmaktan çıkıyor…'), 4000);
    setTimeout(function () { cik('index.html'); }, 1500);
  }
  function ekranGeldi(v) {
    var once = S.ekran;
    S.ekran = v || null;
    if (CIHAZ === 'tahta') {
      if (S.kok && !S.ekranBirakti && v && v.id && v.id !== BEN) ekranBirak(v);
    } else if (S.kok) {
      /* bu cihaz artık kumanda: kendi eski Sınıf Ekranı kaydı silinir */
      if (v && v.kimlik === KIMLIK) { try { S.kok.child('ekran').remove(); } catch (e) { } S.ekran = null; }
      else if (S.lider && once && v && once.kimlik !== v.kimlik && v.ad) bildir(kd('th.b_ekran', 'Sınıf Ekranı artık {ad}.', { ad: v.ad }));
    }
    arayuzTazele();
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
    var hedef = '<select class="th-hedef" id="thHedef" hidden title="' + kac(kd('th.hedef_ip', 'Hangi tahtaya yansıtılsın?')) + '" aria-label="' + kac(kd('th.hedef_ip', 'Hangi tahtaya yansıtılsın?')) + '"></select>';
    /* LAZER · BÜYÜTEÇ (22.10.2026) */
    var araclar =
      '<button type="button" class="th-dug th-arac" id="thLazerDug" data-arac="lazer" aria-pressed="false" title="' + kac(kd('th.lazer_ip', 'Parmağını ya da fareyi gezdir: tahtada kırmızı nokta aynı yeri gösterir, bıraktığın yerde kalır')) + '">' + SVG.lazer + '<span>' + kac(kd('th.lazer', 'Lazer')) + '</span></button>' +
      '<button type="button" class="th-dug th-arac buyutec" id="thBuyutecDug" data-arac="buyutec" aria-pressed="false" title="' + kac(kd('th.buyutec_ip', 'Gezdirdiğin yer tahtada yuvarlak bir mercekle büyür')) + '">' + SVG.buyutec + '<span>' + kac(kd('th.buyutec', 'Büyüteç')) + '</span></button>';
    var tuslar = araclar +
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
    ['thLazerDug', 'thBuyutecDug'].forEach(function (id) {
      $(id).addEventListener('click', function () { var a = this.getAttribute('data-arac'); aracSec(IA.arac === a ? null : a); });
    });
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
    var la = $('thLazerDug'), bu = $('thBuyutecDug');
    if (la) la.setAttribute('aria-pressed', IA.arac === 'lazer' ? 'true' : 'false');
    if (bu) bu.setAttribute('aria-pressed', IA.arac === 'buyutec' ? 'true' : 'false');
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
    var tahtalar = [], g = null, hepsi = [], ek = (S.ekran && S.ekran.kimlik) || null;
    for (var k in S.izle) {
      if (!has(S.izle, k)) continue;
      var t = S.izle[k];
      if (t && t.cevrimici && t.cihaz !== 'bilgisayar') { hepsi.push(t); if (!ek || (t.kimlik || k) === ek) tahtalar.push(t); }
    }
    /* tek Sınıf Ekranı: hesabın Sınıf Ekranı açık değilse (eski sürüm tahta) açık olanlar */
    if (!tahtalar.length) tahtalar = hepsi;
    tahtalar.forEach(function (t) { if (typeof t.gecikme === 'number') g = (g == null) ? t.gecikme : Math.max(g, t.gecikme); });
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
    else if (!tahtalar.length) { yazi = (S.ekran && S.ekran.ad) ? kd('th.hedef_bekleniyor', '{ad} bekleniyor…', { ad: S.ekran.ad }) : kd('th.tahta_bekleniyor', 'Tahta bekleniyor…'); }
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
  /* 22.10.2026 — öğretmen: "masaüstünde bi cihazı kumanda yapmak istediğimizde de
     kumanda popup olarak açılsın, tüm yansıtma işleri kumanda popup ında olacak
     mobil masaüstü farketmez": üst çubuk kalktı, HER kumanda cihazında yüzen tuş +
     panel (eskiden yalnız telefon/tablette). */
  var MOBIL = ROL === 'yansit';
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
    else if (CIHAZ === 'tahta') ktYerlestir(t, 12, (window.innerHeight - h) / 2);  /* tahtada sol orta (eski tam ekran tuşunun yeri) */
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
    p.addEventListener('pointerdown', function () { KT.otomatik = false; ktZamanla(); }, true);
    return p;
  }
  /* tahtada açık kalan panel kendiliğinden kapanır (öğrenciler görmesin) */
  function ktZamanla() {
    clearTimeout(KT.z); KT.z = null;
    if (CIHAZ === 'tahta' && KT.acik) KT.z = setTimeout(kumandaKapat, KT.otomatik ? 12000 : 15000);
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
  /* otomatik: tahtada yansıtma başlayınca kendiliğinden açılış — saydam perde
     yok (sayfaya dokunuş geçer ve paneli kapatır) */
  function kumandaAc(otomatik) {
    var p = $('thKPanel'), t = $('thKTus');
    if (!p || !t || t.hidden || KT.acik) return;
    KT.acik = true; KT.otomatik = !!otomatik;
    if (!otomatik) {
      var perde = document.createElement('div');
      perde.id = 'thKPerde'; perde.className = 'th-kperde';
      perde.addEventListener('pointerdown', function (e) { e.preventDefault(); kumandaKapat(); });
      document.body.appendChild(perde);
    }
    if (CIHAZ === 'tahta') { tamTusTazele(); zNoktaYaz(); }
    p.hidden = false;
    kumandaYerlestir();
    t.classList.add('acik'); t.setAttribute('aria-expanded', 'true');
    ktZamanla();
  }
  function kumandaKapat() {
    clearTimeout(KT.z); KT.z = null; KT.otomatik = false;
    var p = $('thKPanel'), t = $('thKTus'), perde = $('thKPerde');
    if (perde) perde.parentNode.removeChild(perde);
    if (p) p.hidden = true;
    if (t) { t.classList.remove('acik'); t.setAttribute('aria-expanded', 'false'); }
    KT.acik = false;
  }
  function kumandaAcKapat() { if (KT.acik) kumandaKapat(); else kumandaAc(); }
  /* tahta: durum noktası, dokunulunca açılan pencere, koruma ve perde */
  function zDurumKur() {
    /* 21.10.2026: sağ alttaki durum noktası + pencere ve sol ortadaki ayrı tam
       ekran tuşu yerine telefondaki kumandanın aynısı (zKumandaKur) */
    var d = $('thDurum');
    if (d) { d.innerHTML = ''; d.hidden = true; }
    zKumandaKur();
    $('thKoruma').addEventListener('pointerdown', function (e) { e.preventDefault(); kumandaAc(); });
    $('thKoruma').addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
  }
  /* ---------------------------- TAHTADA KUMANDA TUŞU (21.10.2026)
     Öğretmen: "yansıtmayı başlatınca kumandanın aynısı akıllı tahtada da açılsın
     ve tam ekran özelliği de olsun bu ekranın içinde; akıllı tahtadaki müstakil
     tam ekran svg sini bunun içine taşıyalım". Telefondaki yüzen tuş + panel
     (kumandaTus / kumandaPanel); panelde Tam ekran, Tahtadan da kullan, Perde,
     Eşitle, Çık. Bekleme ekranlarında tuş görünmez (orada kendi tuşları var). */
  function zKumandaKur() {
    var p = kumandaPanel();
    p.innerHTML =
      '<div class="th-bas"><span class="th-isim"><span class="th-nokta bekle" id="thZNokta"></span><span>' + kac(kd('th.sinif_ekrani', 'Sınıf Ekranı')) + '</span></span>' +
      '<span class="th-cip" id="thZCip"></span></div>' +
      '<div class="th-zad"><b id="thZAd"></b><span class="th-zsinif" id="thZSinif"></span>' +
      '<button type="button" class="th-zadver" data-th="ad">' + kac(kd('th.ad_ver_kisa', 'Ad ver')) + '</button></div>' +
      '<p class="th-zipucu" id="thZIpucu" hidden>' + kac(kd('th.z_ipucu', 'Telefondan ya da bilgisayardan «Bu cihazı kumanda olarak kullan»a dokun; ders burada kendiliğinden açılır.')) + '</p>' +
      '<div class="th-tuslar">' +
      '<button type="button" class="th-dug" data-th="tam" data-th-tam="1"></button>' +
      '<button type="button" class="th-dug th-kip" data-th="zkip" aria-pressed="false" title="' + kac(kd('th.kip_ip', 'Açıkken tahtaya dokunarak da kullanabilirsin; kapalıyken tahta yalnız bilgisayarı gösterir')) + '">' +
        SVG.dokun + '<span>' + kac(kd('th.kip', 'Tahtadan da kullan')) + '</span></button>' +
      '<button type="button" class="th-dug" data-th="zperde" aria-pressed="false" title="' + kac(kd('th.perde_ip', 'Tahtayı karart (öğrenciler ekranı görmesin)')) + '">' +
        SVG.perde + '<span>' + kac(kd('th.perde', 'Perde')) + '</span></button>' +
      '<button type="button" class="th-dug" data-th="zesitle" title="' + kac(kd('th.z_esitle_ip', 'Sayfayı kumandadan yeniden iste')) + '">' +
        SVG.esitle + '<span>' + kac(kd('th.esitle', 'Eşitle')) + '</span></button>' +
      '<button type="button" class="th-dug kirmizi" data-th="cik" title="' + kac(kd('th.z_cik_ip', 'Sınıf Ekranı görünümünden çık, ana sayfaya dön')) + '">' +
        SVG.bitir + '<span>' + kac(kd('th.cik', 'Çık')) + '</span></button>' +
      '</div>' +
      '<button type="button" class="th-zunut" data-th="unut">' + kac(kd('th.z_unut', 'Bu cihaz Sınıf Ekranı değil')) + '</button>';
    kumandaTus();
    zKumandaGoster();
    tamTusTazele();
    zNoktaYaz();
  }
  /* BEKLERKEN (21.10.2026) — öğretmen: "bu yazının olduğu ekran görünmesin, eğer o
     cihaz akıllı tahtaysa zaten bi yansıtma için kullandığımız popup üzerinden
     yapılsın her şey". Çerçeve boşsa (ders yok) ana sayfa açılır; tahtadan normal
     kullanılır, yansıtma başlayınca kumandanın sayfası gelir. Panel ilk açılışta
     bir kez kendiliğinden açılır. */
  function zBosGoster(tur, ek) {
    Z.bosTur = tur; Z.baskaAd = tur === 'baska' ? ((ek && ek.baskaAd) || '') : '';
    clearTimeout(Z.bosZ);
    Z.bosZ = setTimeout(function () {
      if (oturumVar() || Z.gezilen || gercekSayfa(CERCEVE.contentWindow)) return;
      try { CERCEVE.src = 'index.html'; } catch (e) { }
    }, 1200);
    zKumandaGoster();
    tamTusTazele();
    zNoktaYaz();
    if (!KT.ilkAcildi && tur === 'izle') {
      KT.ilkAcildi = true;
      setTimeout(function () { if (!oturumVar() && !KT.acik) kumandaAc(true); }, 900);
    }
  }
  /* tuş yalnız sayfa görünürken (bekleme ekranı yokken) */
  function zKumandaGoster() {
    if (CIHAZ !== 'tahta') return;
    var t = $('thKTus'), b = $('thBekle');
    if (!t) return;
    var gor = !!(b && b.hidden);
    if (t.hidden !== !gor) { t.hidden = !gor; if (!gor) kumandaKapat(); }
  }
  /* yeni ders başlayınca panel kendiliğinden açılır (tam ekran tuşu hazır) */
  function zKumandaOtomatik(y) {
    if (CIHAZ !== 'tahta' || !y || !y.cevrimici || !y.bas || KT.sonBas === y.bas) return;
    KT.sonBas = y.bas;
    if (y.cihaz === 'tahta' || y.id === BEN) return;            /* tahtanın kendisi tutuyor */
    setTimeout(function () { if (oturumVar() && !KT.acik) kumandaAc(true); }, 500);
  }
  function zKipDegistir() {
    if (!S.kok) return;
    var yeni = cift() ? 'tek' : 'cift';
    S.ayar.kip = yeni;
    S.kok.child('ayar').update({ kip: yeni });
    /* yalnız göster: tahtadan kullanılıyorsa kontrol kumandaya döner */
    if (yeni === 'tek' && S.lider && S.yayin && S.yayin.cevrimici && S.yayin.id === BEN) S.kok.child('yayin').update({ cevrimici: false, ts: TS() });
    arayuzTazele();
    bildir(yeni === 'cift' ? kd('th.b_kip_cift', 'Artık tahtaya dokunarak da kullanabilirsin.')
                           : kd('th.yalniz_gosterir', 'Tahta şu an bilgisayarı gösteriyor; dokununca bir şey değişmez.'));
  }
  function zPerdeDegistir() {
    if (!S.kok || !(oturumVar() || uzaktaMi())) return;
    var p = !S.ayar.perde;
    S.ayar.perde = p;
    S.kok.child('ayar').update({ perde: p });
    arayuzTazele();
  }
  function zEsitle() {
    if (!S.kok) return;
    if (S.lider) { yEsitle(); bildir(kd('th.b_z_esitle_lider', 'Kumanda bu ekrana eşitleniyor…')); }
    else if (oturumVar()) { esitIste(); bildir(kd('th.b_z_esitle', 'Sayfa kumandadan yeniden isteniyor…')); }
    else bildir(kd('th.z_yok', 'Kumanda bağlı değil'));
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
    var y = S.yayin, sinif = 'bekle', uzak = (S.lider && Y.vekil) || (!S.lider && uzaktaMi());
    if (!S.baglanti) sinif = 'hata';
    else if (y && y.cevrimici && !y.durak && !uzak) sinif = 'canli';
    var g = zOrtalama();
    var yazi = !S.baglanti ? kd('th.baglanti_yok', 'İnternet bağlantısı yok')
      : uzak ? kd('th.kumanda_uyku_kisa', 'Kumanda uykuda — tahta olduğu gibi sürüyor')
      : S.lider ? kd('th.tahtadan', 'Tahtadan kullanılıyor')
      : (y && y.cevrimici
          ? (y.durak ? kd('th.z_durak', 'Kumanda duraklattı')
                     : kd('th.z_bagli', 'Kumanda bağlı') + (y.cihaz === 'bilgisayar' && y.cihazAd ? ' · ' + y.cihazAd : '') + (g != null ? ' · ' + kd('th.gecikme', '{ms} ms', { ms: Math.max(1, g) }) : ''))
          : (y && y.baska ? kd('th.z_baska', 'Yansıtma başka tahtada: {ad}', { ad: y.baskaAd || y.baska })
                          : kd('th.z_bekle', 'Kumanda bekleniyor')));
    ['thNokta', 'thKNokta', 'thZNokta'].forEach(function (id) { var n = $(id); if (n) n.className = 'th-nokta ' + sinif; });
    var za = $('thZAd'), zs = $('thZSinif'), zi = $('thZIpucu');
    if (za) { var adY = tahtaAdi() || tahtaAdiVarsayilan(); if (za.textContent !== adY) za.textContent = adY; }
    if (zs) {
      var sn = acikSinif(), snY = sn ? '· ' + (sn.acik ? kd('th.acik_sinif', 'açık sınıf: {s}', { s: sn.ad }) : kd('th.son_sinif', 'son sınıf: {s}', { s: sn.ad })) : '';
      if (zs.textContent !== snY) zs.textContent = snY;
    }
    if (zi) zi.hidden = !!(S.lider || oturumVar() || uzaktaMi() || (y && y.baska));
    var n0 = $('thNokta'); if (n0) n0.title = yazi;
    var kt = $('thKTus'); if (kt) kt.title = yazi;
    var c = $('thZCip'); if (c && c.textContent !== yazi) c.textContent = yazi;
    var os = oturumVar() || uzaktaMi(), q = function (s2) { return document.querySelector('#thKPanel [data-th="' + s2 + '"]'); };
    var bk = q('zkip'); if (bk) bk.setAttribute('aria-pressed', cift() ? 'true' : 'false');
    var bp = q('zperde'); if (bp) { bp.setAttribute('aria-pressed', S.ayar.perde ? 'true' : 'false'); bp.disabled = !os; }
    var be = q('zesitle'); if (be) be.disabled = !os;
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
    if ((IZ.a || IZ.zoom) && !os) isaretSifirla();       /* ders bitti: lazer, mercek kalkar (kumanda uyurken kalır) */
    else if (!IZ.a && IZ.kayit && os) isaretDegerlendir();   /* sonradan açılan ya da yenilenen tahta: bırakılmış nokta */
    gorusYaz(false);
    var p = !!(os && (S.ayar.perde || S.ayar.kg));
    var pe = $('thPerde');
    if (pe && pe.hidden === p) pe.hidden = !p;
    zNoktaYaz();
    zKumandaGoster();
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
      Z.izledi = true; Z.bosTur = null;
      bekleGoster(null);
      zSerit(y.durak ? kd('th.serit_durak', 'Öğretmen yansıtmayı duraklattı') : null);
      zKumandaOtomatik(y);
    } else if (Z.belge) {
      if (uzaktaMi()) return;               /* kumanda uykuda / bağlantısı koptu: tahtada hiçbir şey değişmez */
      if (cift()) zSerit(null);
      if (!Z.izledi) return;                /* boşta (ders izlenmedi): uyarı yok (21.10.2026) */
      /* kısa bağlantı kopmalarında bir şey gösterilmez: 8 sn bekle */
      Z.ayrildiZ = setTimeout(function () {
        if (oturumVar()) return;
        Z.izledi = false;
        if (cift()) bildir(kd('th.bilgisayar_yok', 'Bilgisayar bağlı değil.'), 4000);   /* tahta kendi başına kullanılabilir */
        else zSerit(kd('th.serit_ayrildi', 'Bilgisayar ayrıldı — son görüntü'));
      }, 8000);
    } else {
      bekleGoster('izle');
    }
  }
  function arayuzTazele() {
    if (CIHAZ === 'bilgisayar') { durumYaz(); cubukTazele(); uyanikDenetle(); }
    else zArayuz();
  }

  /* ============================================= LAZER · BÜYÜTEÇ (22.10.2026)
     Öğretmen: "telefonu dijital lazer olarak kullanma özelliği ekleyelim ... fare
     lazer veya büyüteç gibi". KUMANDA: panelden araç seçilince sayfanın üstüne
     saydam bir yüzey gelir (tıklama ve kaydırma sayfaya gitmez; fare tekerleği
     yine kaydırır). Parmağın ya da farenin altındaki öğe bulunur — yazının
     üstündeyse o HARF — ve yolu tahta/<uid>/isaret'e yazılır (en çok 20 kez/sn).
     TAHTA: aynı öğeyi (harfi) kendi
     düzeninde bulur; telefonla tahtanın düzeni farklı olsa da nokta aynı
     kelimenin üstüne düşer. Lazer: kırmızı nokta + kısa iz.
     2. SÜRÜM (22.10.2026) — öğretmen: "lazeri açınca kaybolmasın en son bırakıldığı
     yerde, ayrıca mobilde dikey masaüstünde yatay olduğu için daha dengeli olmalı
     lazer çok hızlı şuan biraz azalt, büyütmeyi yapabiliyoruz ama lazer gibi sadece
     gezdirdiğimiz yeri büyütebilir miyiz acaba":
       · Nokta parmak kalkınca sönmez, bırakıldığı yerde durur. Araç yeniden
         açılınca aynı sayfada en son bırakılan yerde (yoksa ekranın ortasında)
         hemen belirir; kumandada da o yer işaretli kalır. Sayfa kayarsa nokta
         kelimesiyle birlikte kayar. Araç kapanınca, sayfa değişince, ders bitince
         kalkar (kumanda uyurken kalır).
       · Tahtadaki nokta yaylı bir izleyiciyle gider: yumuşak hızlanır, yavaşlayarak
         durur, hız sınırı var. Dikey telefonda parmağın küçük bir kayışı yatay
         tahtada uzun bir yol olduğundan, kumanda ekranı tahtadan ne kadar darsa
         nokta o kadar yumuşak ve yavaş gider (tahta / kumanda genişliği).
       · Büyüteç artık MERCEK: sayfanın tamamı büyümez; tahtada yuvarlak bir mercek
         parmağın/farenin altındaki yeri k kat büyütür, gerisi olduğu gibi görünür.
         (Mercek kurulamazsa eskisi gibi bütün çerçeve büyür.) */
  var ISARET_ARA = 50;
  var IA = { arac: null, alan: null, halka: null, cip: null, n: 0, son: 0, z: null, bekleyen: null, sonBilgi: null,
             basili: false, k: 2, fare: false, tur: null, sonYer: null, capa: null, mx: null, my: null, tekerZ: null };
  function sayfaNo() { return S.lider ? Y.d : Z.d; }
  function sinirla(v) { v = +v; return isNaN(v) ? 0.5 : Math.min(1, Math.max(0, v)); }
  function caretAl(doc, x, y) {
    try {
      if (doc.caretPositionFromPoint) { var p = doc.caretPositionFromPoint(x, y); if (p && p.offsetNode) return { node: p.offsetNode, offset: p.offset }; }
      if (doc.caretRangeFromPoint) { var r = doc.caretRangeFromPoint(x, y); if (r) return { node: r.startContainer, offset: r.startOffset }; }
    } catch (e) { }
    return null;
  }
  function harfKutusu(doc, n, i) {
    try {
      var r = doc.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
      var l = r.getClientRects();
      return (l && l.length) ? l[0] : r.getBoundingClientRect();
    } catch (e) { return null; }
  }
  /* kumanda: ekrandaki (cx, cy) noktasının tahtada bulunacak tarifi */
  function noktaBilgisi(cx, cy) {
    var w = CERCEVE.contentWindow, ana = null;
    try { ana = w.document; } catch (e) { return null; }
    if (!ana || !ana.body) return null;
    var fr = CERCEVE.getBoundingClientRect();
    return noktaBelgede(ana, cx - fr.left, cy - fr.top, fr.width, fr.height);
  }
  /* ana belgenin kendi görünümündeki (x, y) noktasının tarifi (tahta alanında: aynadaki kopya) */
  function noktaBelgede(ana, x, y, fw, fh) {
    if (!ana || !ana.body) return null;
    var o = { vx: sinirla(x / Math.max(1, fw)), vy: sinirla(y / Math.max(1, fh)) };   /* öğe bulunamazsa ekran oranı */
    var doc = ana, el = null;
    for (var i = 0; i < 4; i++) {                       /* iç çerçeve (açılır sözlük): içine inilir */
      try { el = doc.elementFromPoint(x, y); } catch (e) { el = null; }
      if (!el || el.tagName !== 'IFRAME') break;
      var icd = null;
      try { icd = el.contentDocument; } catch (e) { icd = null; }
      if (!icd || !icd.body) break;
      var r = el.getBoundingClientRect();
      x -= r.left + el.clientLeft; y -= r.top + el.clientTop; doc = icd;
    }
    if (!el || el === doc.documentElement) return o;
    /* yazının üstündeyse: o harf (sağdan sola yazıda da imleç iki yanındaki harfe bakılır) */
    var c = caretAl(doc, x, y);
    if (c && c.node && c.node.nodeType === 3 && c.node.parentElement && c.node.length > 0) {
      var n = c.node, en = null;
      [c.offset, c.offset - 1].forEach(function (k) {
        if (en && en.ic) return;
        if (k < 0 || k >= n.length) return;
        var rr = harfKutusu(doc, n, k);
        if (!rr || !(rr.width > 0 || rr.height > 0)) return;
        var ic = x >= rr.left - 2 && x <= rr.right + 2 && y >= rr.top - 2 && y <= rr.bottom + 2;
        var dx = Math.max(rr.left - x, 0, x - rr.right), dy = Math.max(rr.top - y, 0, y - rr.bottom);
        var uz = Math.sqrt(dx * dx + dy * dy);
        if (!en || ic || uz < en.uz) en = { k: k, r: rr, ic: ic, uz: uz };
      });
      if (en && en.uz <= 6) {
        var ata = n.parentElement, yol = yolAl(ata, ana);
        if (ata.ownerDocument === ana || (yol.c && yol.c.length)) {
          var ab = ata.getBoundingClientRect();
          o.y = yol; o.m = 't';
          o.ti = Array.prototype.indexOf.call(ata.childNodes, n); o.to = en.k;
          o.cx = en.r.width > 0 ? sinirla((x - en.r.left) / en.r.width) : 0.5;
          o.cy = en.r.height > 0 ? sinirla((y - en.r.top) / en.r.height) : 0.5;
          o.fx = ab.width > 0 ? sinirla((x - ab.left) / ab.width) : 0.5;
          o.fy = ab.height > 0 ? sinirla((y - ab.top) / ab.height) : 0.5;
          return o;
        }
      }
    }
    var yy = yolAl(el, ana);
    if (el.ownerDocument !== ana && !(yy.c && yy.c.length)) return o;
    var b = el.getBoundingClientRect();
    o.y = yy; o.m = 'e';
    o.fx = b.width > 0 ? sinirla((x - b.left) / b.width) : 0.5;
    o.fy = b.height > 0 ? sinirla((y - b.top) / b.height) : 0.5;
    return o;
  }
  function isaretYaz(o) {
    if (!S.kok || !IA.arac) return;
    IA.son = SIMDI();
    var k = { i: BEN, a: IA.arac, d: sayfaNo(), n: ++IA.n, z: sunucuZaman(), k: IA.k,
              w: Math.round(window.innerWidth), h: Math.round(window.innerHeight) };     /* w, h: tahtada denge */
    if (S.bas) k.b = S.bas;                                         /* oturum: eski dersten kalan gösterilmez */
    for (var a in o) if (has(o, a) && o[a] !== undefined) k[a] = o[a];
    try { S.kok.child('isaret').set(k); } catch (e) { }
  }
  function isaretGonder(o, hemen) {
    if (!o.up) IA.sonBilgi = o;
    IA.bekleyen = o;
    var gec = SIMDI() - IA.son;
    if (hemen || gec >= ISARET_ARA) {
      clearTimeout(IA.z); IA.z = null;
      var b = IA.bekleyen; IA.bekleyen = null; isaretYaz(b);
      return;
    }
    if (!IA.z) IA.z = setTimeout(function () {
      IA.z = null;
      if (IA.bekleyen) { var b2 = IA.bekleyen; IA.bekleyen = null; isaretYaz(b2); }
    }, ISARET_ARA - gec);
  }
  /* parmak kalktı / fare yüzeyden çıktı: son yer «bırakıldı» (up) diye yazılır —
     tahtada sönmez, orada durur (2. sürüm) */
  function dinlenBilgi() {
    var o = {}, s = IA.sonBilgi;
    if (s) for (var a in s) if (has(s, a) && a !== 'up') o[a] = s[a];
    o.up = 1;
    return o;
  }
  /* çipteki yazı gerçekten kullanılan işaretçiye göre: parmak / fare */
  function turGor(pt) {
    var t = pt === 'mouse' ? 'fare' : 'dokun';
    if (IA.tur !== t) { IA.tur = t; if (IA.cip) aracCipKur(); }
  }
  function halkaYerlestir(x, y, gor, dinlen) {
    var h = IA.halka;
    if (!h) return;
    h.className = 'th-isaret-halka ' + (IA.arac || '') + (IA.fare ? ' fare' : '') + (dinlen ? ' dinlen' : '');
    h.hidden = !gor;
    if (gor) h.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
  }
  /* bırakılan yer kumandada da işaretli kalır; sayfa kayınca kelimesiyle gider */
  function halkaDinlen() {
    if (!IA.arac || IA.basili) return;
    if (alanAcikMi()) { halkaYerlestir(0, 0, false); alanNoktaTazele(); return; }   /* tahta alanında işaret alanın içinde */
    var p = IA.sonBilgi ? isaretNokta(IA.sonBilgi) : null;
    if (!p) { halkaYerlestir(0, 0, false); return; }
    halkaYerlestir(p.x, p.y, true, true);
  }
  function kCapa(ac) {
    if (!ac) { clearInterval(IA.capa); IA.capa = null; return; }
    if (!IA.capa) IA.capa = setInterval(halkaDinlen, 400);
  }
  function isaretAlanKur() {
    var al = document.createElement('div');
    al.id = 'thIsaretAlan';
    document.body.appendChild(al);
    var h = document.createElement('div');
    h.id = 'thIsaretHalka'; h.className = 'th-isaret-halka'; h.hidden = true;
    document.body.appendChild(h);
    IA.alan = al; IA.halka = h;
    var aktif = null;
    function bas(e) {
      if (alanAcikMi()) return;                         /* tahta alanı açıkken sayfadan gösterilmez */
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      aktif = e.pointerId; IA.fare = e.pointerType === 'mouse'; turGor(e.pointerType);
      if (!IA.fare) { try { al.setPointerCapture(e.pointerId); } catch (x) { } }
      IA.basili = true; kCapa(false);
      GOR.girdi = SIMDI(); UYANIK.dokunus = SIMDI();
      IA.mx = e.clientX; IA.my = e.clientY;
      halkaYerlestir(e.clientX, e.clientY, true);
      var o = noktaBilgisi(e.clientX, e.clientY);
      if (o) isaretGonder(o, true);
    }
    function gez(e) {
      if (alanAcikMi()) return;
      if (e.pointerType === 'mouse') {
        /* fare: basmadan da — üstünde gezdikçe (fare lazeri) */
        if (!IA.fare) { IA.fare = true; al.className = 'th-isaret-alan ' + IA.arac + ' fare'; }
        turGor('mouse');
        IA.basili = true; kCapa(false);
        IA.mx = e.clientX; IA.my = e.clientY;
        halkaYerlestir(e.clientX, e.clientY, true);
        var o = noktaBilgisi(e.clientX, e.clientY);
        if (o) isaretGonder(o);
        return;
      }
      if (aktif !== e.pointerId) return;
      IA.mx = e.clientX; IA.my = e.clientY;
      halkaYerlestir(e.clientX, e.clientY, true);
      var o2 = noktaBilgisi(e.clientX, e.clientY);
      if (o2) isaretGonder(o2);
    }
    function birak(e) {
      if (alanAcikMi()) return;
      if (e.pointerType === 'mouse') {
        if (e.type === 'pointerup') return;             /* fare: tıklayınca bırakılmaz, yüzeyden çıkınca */
      } else if (aktif !== e.pointerId) return;
      aktif = null; IA.basili = false;
      if (IA.sonBilgi) isaretGonder(dinlenBilgi(), true);   /* 2. sürüm: nokta bırakılan yerde durur */
      halkaDinlen(); kCapa(true);
    }
    al.addEventListener('pointerdown', bas);
    al.addEventListener('pointermove', gez);
    al.addEventListener('pointerup', birak);
    al.addEventListener('pointercancel', birak);
    al.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') birak(e); });
    al.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    /* TAHTA ALANI DIŞINA DOKUNUNCA ARAÇ KAPANIR (22.10.2026) — öğretmen: "büyüteç
       kullanırken eğer küçük ekran dışına tıklanırsa büyüteç otomatik kapansın, lazer
       de aynı şekilde". Alan açıkken kararmış sayfaya dokununca (fareyle tıklayınca)
       lazer / büyüteç kapanır, tahtadaki nokta / mercek kalkar; yeniden açılınca
       bırakılan yerden sürer. Çipin üstü sayılmaz. Kapanış tıklamanın sonunda: parmağın
       altındaki sayfaya tıklama geçmez. */
    al.addEventListener('click', function (e) {
      if (!alanAcikMi()) return;
      var c = IA.cip && IA.cip.getBoundingClientRect();
      if (c && e.clientX >= c.left && e.clientX <= c.right && e.clientY >= c.top && e.clientY <= c.bottom) return;
      e.preventDefault();
      aracSec(null);
    });
    /* fare tekerleği sayfayı yine kaydırır (bilgisayarda lazer açıkken de gezilsin);
       kayma bitince işaret farenin yeni altındaki yere (bırakılmışsa yeri güncellenir) */
    al.addEventListener('wheel', function (e) {
      e.preventDefault();
      try { dokunuldu(); CERCEVE.contentWindow.scrollBy(e.deltaX, e.deltaY); } catch (x) { }
      clearTimeout(IA.tekerZ);
      IA.tekerZ = setTimeout(tekerSonra, 140);
    }, { passive: false });
  }
  function tekerSonra() {
    if (!IA.arac) return;
    if (IA.basili && IA.fare && IA.mx !== null) {
      var o = noktaBilgisi(IA.mx, IA.my);
      if (o) isaretGonder(o);
    } else halkaDinlen();
  }
  function aracCipKur() {
    var c = IA.cip;
    if (!c) {
      c = document.createElement('div');
      c.id = 'thAracCip'; c.setAttribute('role', 'status');
      document.body.appendChild(c);
      IA.cip = c;
      c.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('button') : null;
        if (!b) return;
        if (b.getAttribute('data-ac') === 'kapat') aracSec(null);
        else if (b.getAttribute('data-ac') === 'alan') alanDegistir();
        else if (b.getAttribute('data-ac') === 'kat') {
          IA.k = IA.k === 2 ? 3 : (IA.k === 3 ? 1.5 : 2);
          aracCipKur();
          if (IA.sonBilgi) isaretGonder(IA.basili ? IA.sonBilgi : dinlenBilgi(), true);
        }
      });
    }
    var fare = IA.tur ? IA.tur === 'fare' : !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
    var lazer = IA.arac === 'lazer';
    c.className = 'th-araccip ' + IA.arac;
    var alan = alanAcikMi();
    c.innerHTML = '<i class="th-acnokta"></i><span>' + kac(alan
        ? (lazer ? kd('th.lazer_cip_alan', 'Lazer açık') : kd('th.buyutec_cip_alan', 'Büyüteç açık'))
        : lazer
        ? (fare ? kd('th.lazer_cip_fare', 'Lazer açık · fareyi gezdir') : kd('th.lazer_cip', 'Lazer açık · parmağını ekranda gezdir'))
        : (fare ? kd('th.buyutec_cip_fare', 'Büyüteç açık · fareyi gezdir') : kd('th.buyutec_cip', 'Büyüteç açık · parmağını gezdir'))) + '</span>' +
      '<button type="button" data-ac="alan" aria-pressed="' + (alan ? 'true' : 'false') + '" title="' +
        kac(kd('th.alan_ip', 'Tahtanın oranında alan: içinde tahtanın görüntüsü')) + '">' + IK_ALAN + kac(kd('th.alan', 'Alan')) + '</button>' +
      (lazer ? '' : '<button type="button" data-ac="kat" title="' + kac(kd('th.buyutec_kat', 'Büyütme oranı')) + '">' + String(IA.k).replace('.', ',') + '×</button>') +
      '<button type="button" data-ac="kapat" title="' + kac(kd('th.arac_kapat', 'Kapat')) + '" aria-label="' + kac(kd('th.arac_kapat', 'Kapat')) + '">✕</button>';
  }
  /* a: 'lazer' | 'buyutec' | null (kapat) */
  function aracSec(a) {
    a = (a === 'lazer' || a === 'buyutec') ? a : null;
    if (a && (!S.kok || CIHAZ !== 'bilgisayar')) return;
    var once = IA.arac;
    if (once && IA.sonBilgi) IA.sonYer = { d: sayfaNo(), o: IA.sonBilgi };          /* yeniden açılınca buradan */
    IA.arac = a; IA.basili = false; IA.sonBilgi = null; IA.bekleyen = null; IA.tur = null;
    clearTimeout(IA.z); IA.z = null; clearTimeout(IA.tekerZ); kCapa(false);
    if (once && once !== a && S.kok) { try { S.kok.child('isaret').set(null); } catch (e) { } }   /* tahtadaki eski araç kapanır */
    if (!a) {
      [IA.alan, IA.halka, IA.cip].forEach(function (e) { if (e && e.parentNode) e.parentNode.removeChild(e); });
      IA.alan = IA.halka = IA.cip = null;
      alanKaldir();
      cubukTazele();
      return;
    }
    if (!IA.alan) isaretAlanKur();
    IA.fare = false;
    IA.alan.className = 'th-isaret-alan ' + a;
    halkaYerlestir(0, 0, false);
    ALAN.acik = alanTercih();                                  /* tahta alanı (dikey telefonda kendiliğinden) */
    if (ALAN.acik) alanKur(); else alanKaldir();
    aracCipKur();
    cubukTazele();
    /* 2. sürüm: açılır açılmaz tahtada görünür — bu sayfada en son bırakılan yerde,
       yoksa ekranın ortasındaki yerde */
    var son = (IA.sonYer && IA.sonYer.d === sayfaNo()) ? IA.sonYer.o : null;
    if (!son) son = noktaBilgisi(window.innerWidth / 2, window.innerHeight / 2);
    if (son) { IA.sonBilgi = son; isaretGonder(dinlenBilgi(), true); halkaDinlen(); kCapa(true); }
  }
  document.addEventListener('keydown', function (e) { if (IA.arac && (e.key === 'Escape' || e.key === 'Esc')) aracSec(null); });

  /* ---------------------------------------------------- kumanda: TAHTA ALANI
     Öğretmen: "lazer ve büyüteçte akıllı tahta seçilen ekranın oranına göre kumanda
     cihazda bi oran çıksın, örneğin yatay bi alan bilgisayarla uyumlu olsun" →
     "İçinde tahtanın görüntüsü" (22.10.2026). Kumandada tahtanın ekran oranında
     yatay bir alan; içinde tahtadaki sayfanın küçük kopyası (AYNA: tahtanın ekran
     boyutunda dizilir, tahtanın kaydırmasıyla). Parmak alanın neresindeyse nokta
     tahtada orada — dokunulan yerdeki öğe (yazıysa harf) kopyada bulunur, tahta aynı
     öğeyi gösterir; hareket her yönde aynı ölçüde büyür. Alanda iki parmakla
     sürükleyince (fareyle tekerlekle) tahta kayar. Telefon dikeyken kendiliğinden
     açılır; çipteki «Alan» tuşu açar/kapatır (seçim hatırlanır). Tahta, araç açıkken
     ekran boyutunu ve kaydırmasını tahta/<uid>/gorus'e yazar. */
  var ALAN = { acik: false, kap: null, govde: null, ifr: null, nokta: null, yazi: null, A: null, G: null, s: 1, aktif: null };
  var IK_ALAN = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;' +
    'stroke-linecap:round;stroke-linejoin:round;vertical-align:-3px;margin-right:4px"><rect x="2.5" y="6" width="19" height="12" rx="2"/>' +
    '<path d="M9 21h6"/></svg>';
  function alanTercih() {
    var t = null;
    try { t = localStorage.getItem('kidef_isaret_alan'); } catch (e) { }
    if (t === '1') return true;
    if (t === '0') return false;
    return window.innerHeight > window.innerWidth * 1.1;            /* dikey ekran: kendiliğinden */
  }
  function alanAcikMi() { return !!(IA.arac && ALAN.acik && ALAN.kap); }
  function alanKur() {
    if (!ALAN.kap) {
      var k = document.createElement('div');
      k.id = 'thTahtaAlan';
      k.innerHTML = '<div class="th-talan-bas"><b>' + kac(kd('th.alan_bas', 'Tahta')) + '</b><span id="thTalanYazi"></span></div>' +
        '<div class="th-talan-govde"><iframe class="th-talan-ic" tabindex="-1" aria-hidden="true"></iframe>' +
        '<i class="th-talan-nokta" hidden></i><div class="th-talan-yuzey"></div></div>';
      document.body.appendChild(k);
      ALAN.kap = k; ALAN.govde = k.querySelector('.th-talan-govde'); ALAN.ifr = k.querySelector('iframe');
      ALAN.nokta = k.querySelector('.th-talan-nokta'); ALAN.yazi = k.querySelector('#thTalanYazi');
      alanOlayKur(k.querySelector('.th-talan-yuzey'));
    }
    document.body.classList.add('th-alanli');
    ALAN.kap.className = 'th-talan ' + (IA.arac || '');
    alanBoyut();
    alanAyna();
  }
  function alanKaldir() {
    if (ALAN.A) { aynaKapat(ALAN.A); ALAN.A = null; }
    if (ALAN.kap && ALAN.kap.parentNode) ALAN.kap.parentNode.removeChild(ALAN.kap);
    ALAN.kap = ALAN.govde = ALAN.ifr = ALAN.nokta = ALAN.yazi = null; ALAN.aktif = null;
    document.body.classList.remove('th-alanli');
  }
  function alanDegistir() {
    ALAN.acik = !ALAN.acik; IA.basili = false;
    try { localStorage.setItem('kidef_isaret_alan', ALAN.acik ? '1' : '0'); } catch (e) { }
    if (ALAN.acik) alanKur(); else alanKaldir();
    aracCipKur();
    halkaDinlen();
  }
  /* alan tahtanın oranında; ekrana sığan en büyük boy (çip ve kumanda tuşuna yer kalır) */
  function alanBoyut() {
    if (!ALAN.kap) return;
    var G = ALAN.G, gw = (G && G.w > 0) ? G.w : 1600, gh = (G && G.h > 0) ? G.h : 900;
    var W = window.innerWidth, H = window.innerHeight;
    var w = Math.max(120, Math.min(W - 40, (H - 190) * gw / gh));
    var h = w * gh / gw;
    ALAN.kap.style.width = Math.round(w + 16) + 'px';
    ALAN.govde.style.height = Math.round(h) + 'px';
    ALAN.s = w / gw;
    ALAN.ifr.style.width = gw + 'px'; ALAN.ifr.style.height = gh + 'px';
    ALAN.ifr.style.transform = 'scale(' + ALAN.s + ')';
    alanNoktaTazele();
  }
  /* aynayı kur / tazele: tahtanın boyutu ve bu sayfa bilindiğinde */
  function alanAyna() {
    if (!ALAN.kap) return;
    var G = ALAN.G, hazir = !!(G && G.w > 0 && G.h > 0 && G.d === sayfaNo());
    var fare = IA.tur ? IA.tur === 'fare' : !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
    ALAN.yazi.textContent = !hazir ? kd('th.alan_bekle', 'tahta bekleniyor…')
      : (fare ? kd('th.alan_ipucu_fare', 'fareyle göster · tekerlekle kaydır') : kd('th.alan_ipucu', 'gezdir · iki parmakla kaydır'));
    ALAN.kap.classList.toggle('bekle', !hazir);
    if (!hazir) { if (ALAN.A) { aynaKapat(ALAN.A); ALAN.A = null; } alanNoktaTazele(); return; }
    var od = null;
    try { od = CERCEVE.contentDocument; } catch (e) { od = null; }
    if (!od || !od.body) return;
    if (ALAN.A && (ALAN.A.od !== od || ALAN.A.kapali)) { aynaKapat(ALAN.A); ALAN.A = null; }
    if (!ALAN.A) {
      try {
        ALAN.A = aynaAc(od, ALAN.ifr, function () { return ALAN.G ? { x: ALAN.G.sx || 0, y: ALAN.G.sy || 0 } : null; });
      } catch (e) { ALAN.A = null; return; }
    } else aynaKaydir(ALAN.A, null);
    alanNoktaTazele();
  }
  /* tahtadan: ekran boyutu ve kaydırma */
  function gorusGeldi(g) {
    if (CIHAZ !== 'bilgisayar') return;
    var once = ALAN.G;
    ALAN.G = (g && typeof g.w === 'number' && typeof g.h === 'number') ? g : null;
    if (!ALAN.kap) return;
    if (!once || !ALAN.G || once.w !== ALAN.G.w || once.h !== ALAN.G.h) alanBoyut();
    alanAyna();
  }
  function alanNoktaGoster(px, py, dinlen) {
    var n = ALAN.nokta;
    if (!n) return;
    n.hidden = false;
    n.className = 'th-talan-nokta' + (dinlen ? ' dinlen' : '');
    n.style.transform = 'translate(' + Math.round(px) + 'px,' + Math.round(py) + 'px)';
  }
  /* bırakılan yer alanda da işaretli; tahta kayınca kelimesiyle gider */
  function alanNoktaTazele() {
    if (!ALAN.nokta) return;
    if (ALAN.aktif !== null) return;
    var G = ALAN.G, v = IA.sonBilgi, p = null;
    if (!G || !v) { ALAN.nokta.hidden = true; return; }
    if (ALAN.A && !ALAN.A.kapali) {
      try { p = isaretBelgede(ALAN.ifr.contentDocument, ALAN.ifr.contentWindow, v, G.w, G.h); } catch (e) { p = null; }
    }
    if (!p && typeof v.vx === 'number') p = { x: v.vx * G.w, y: v.vy * G.h };
    if (!p || p.x < -2 || p.y < -2 || p.x > G.w + 2 || p.y > G.h + 2) { ALAN.nokta.hidden = true; return; }
    alanNoktaGoster(p.x * ALAN.s, p.y * ALAN.s, true);
  }
  /* alanda iki parmakla sürükleme / fare tekerleği: tahta kayar (kumandanın sayfası
     kaydırılır, tahta onu izler — alandaki görüntü de) */
  function alanKaydir(dyAlan) {
    var w = null, od = null;
    try { w = CERCEVE.contentWindow; od = w.document; } catch (e) { return; }
    var ad = (ALAN.A && !ALAN.A.kapali) ? ALAN.A.ifr.contentDocument : null;
    var hk = (od && od.documentElement) ? od.documentElement.scrollHeight : 0;
    var ht = (ad && ad.documentElement) ? ad.documentElement.scrollHeight : 0;
    var r = (hk > 0 && ht > 0) ? hk / ht : 1;                  /* kumandanın sayfası tahtanınkinden ne kadar uzun */
    try { dokunuldu(); w.scrollBy(0, dyAlan / Math.max(0.01, ALAN.s) * r); } catch (e) { }
  }
  function alanOlayKur(y) {
    var P = {}, sayi = 0, kayY = null;
    function ort() { var t = 0, n = 0; for (var k in P) if (has(P, k)) { t += P[k]; n++; } return n ? t / n : 0; }
    function nokta(e) {
      var r = ALAN.govde.getBoundingClientRect();
      return { px: Math.min(r.width, Math.max(0, e.clientX - r.left)), py: Math.min(r.height, Math.max(0, e.clientY - r.top)), r: r };
    }
    function bilgi(p) {
      var G = ALAN.G, o = null;
      if (G && ALAN.A && !ALAN.A.kapali) {
        try { o = noktaBelgede(ALAN.ifr.contentDocument, p.px / ALAN.s, p.py / ALAN.s, G.w, G.h); } catch (e) { o = null; }
      }
      if (!o) o = { vx: sinirla(p.px / Math.max(1, p.r.width)), vy: sinirla(p.py / Math.max(1, p.r.height)) };
      o.w = Math.round(p.r.width); o.h = Math.round(p.r.height);      /* denge: alan küçükse tahtada daha yumuşak */
      return o;
    }
    function gosterBitir() {
      if (ALAN.aktif === null) return;
      ALAN.aktif = null; IA.basili = false;
      if (IA.sonBilgi) isaretGonder(dinlenBilgi(), true);
      alanNoktaTazele(); kCapa(true);
    }
    y.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault(); e.stopPropagation();
      try { y.setPointerCapture(e.pointerId); } catch (x) { }
      if (!has(P, e.pointerId)) sayi++;
      P[e.pointerId] = e.clientY;
      if (sayi >= 2) { gosterBitir(); kayY = ort(); return; }   /* iki parmak: kaydırma */
      ALAN.aktif = e.pointerId; IA.fare = e.pointerType === 'mouse'; turGor(e.pointerType);
      IA.basili = true; kCapa(false);
      GOR.girdi = SIMDI(); UYANIK.dokunus = SIMDI();
      var p = nokta(e);
      alanNoktaGoster(p.px, p.py, false);
      isaretGonder(bilgi(p), true);
    });
    y.addEventListener('pointermove', function (e) {
      if (has(P, e.pointerId)) P[e.pointerId] = e.clientY;
      if (sayi >= 2 && kayY !== null) {
        var o = ort();
        if (Math.abs(o - kayY) >= 1) { alanKaydir(-(o - kayY)); kayY = o; }
        return;
      }
      if (ALAN.aktif !== e.pointerId) return;
      var p = nokta(e);
      alanNoktaGoster(p.px, p.py, false);
      isaretGonder(bilgi(p));
    });
    function birak(e) {
      if (has(P, e.pointerId)) { delete P[e.pointerId]; sayi = Math.max(0, sayi - 1); }
      if (sayi < 2) kayY = null;
      if (ALAN.aktif === e.pointerId) gosterBitir();
    }
    y.addEventListener('pointerup', birak);
    y.addEventListener('pointercancel', birak);
    y.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    y.addEventListener('wheel', function (e) { e.preventDefault(); alanKaydir(e.deltaY * ALAN.s); }, { passive: false });
  }
  window.addEventListener('resize', function () { if (ALAN.kap) alanBoyut(); });

  /* ---------------------------------------------------------- tahtada çizim */
  var IZ = { tuval: null, nokta: null, raf: 0, tz: 0, x: null, y: null, hx: null, hy: null, vx: 0, vy: 0, iz: [], up: true,
             disari: false, zoom: null, dpr: 1, kayit: null, v: null, a: null, n: null, amp: 1, tik: null, kw: null, kf: null,
             mercek: null, dene: 0, deneZ: null };
  /* isaret tarifinden kabuktaki nokta (çerçevenin dönüşümsüz yerleşimiyle) */
  function isaretNokta(v) {
    var w = CERCEVE.contentWindow, d = null;
    try { d = w.document; } catch (e) { return null; }
    var p = isaretBelgede(d, w, v, CERCEVE.clientWidth || window.innerWidth, CERCEVE.clientHeight || window.innerHeight);
    if (!p) return null;
    return { x: p.x + CERCEVE.offsetLeft + CERCEVE.clientLeft, y: p.y + CERCEVE.offsetTop + CERCEVE.clientTop };
  }
  /* tarif → belgenin kendi görünümündeki nokta (tahta alanında: aynadaki kopya) */
  function isaretBelgede(d, w, v, fw, fh) {
    if (!d || !d.body || !v) return null;
    var x = null, y = null, el = null;
    try { el = v.y ? yolBul(v.y, d) : null; } catch (e) { el = null; }
    if (el) {
      if (v.m === 't' && typeof v.ti === 'number') {
        var n = el.childNodes[v.ti];
        if (n && n.nodeType === 3 && n.length > 0) {
          var r = harfKutusu(el.ownerDocument, n, Math.min(Math.max(0, v.to | 0), n.length - 1));
          if (r && (r.width > 0 || r.height > 0)) {
            x = r.left + (typeof v.cx === 'number' ? v.cx : 0.5) * r.width;
            y = r.top + (typeof v.cy === 'number' ? v.cy : 0.5) * r.height;
          }
        }
      }
      if (x === null) {
        var b = el.getBoundingClientRect();
        x = b.left + sinirla(v.fx) * b.width; y = b.top + sinirla(v.fy) * b.height;
      }
      /* iç çerçeveden çerçevenin sayfasına */
      var ww = penceresi(el, w);
      for (var k = 0; k < 4 && ww && ww !== w; k++) {
        var fe = null;
        try { fe = ww.frameElement; } catch (e) { fe = null; }
        if (!fe) break;
        var fr = fe.getBoundingClientRect();
        x += fr.left + fe.clientLeft; y += fr.top + fe.clientTop;
        ww = fe.ownerDocument.defaultView;
      }
    } else if (typeof v.vx === 'number') {
      x = v.vx * fw; y = v.vy * fh;
    }
    if (x === null || isNaN(x) || isNaN(y)) return null;
    return { x: x, y: y };
  }
  /* tahta: gelen kayıt bu ders, bu sayfa için mi (başka/eski oturumdan değil; ders
     sürüyor ya da kumanda yalnız uyuyor) */
  function isaretGecerli(v) {
    if (!v || v.i === BEN || !v.a) return false;
    if (v.b && S.yayin && S.yayin.bas && v.b !== S.yayin.bas) return false;
    if (!(oturumVar() || uzaktaMi())) return false;
    if (typeof v.d === 'number' && v.d !== sayfaNo()) return false;
    return true;
  }
  function isaretSifirla() {
    IZ.a = null; IZ.v = null; IZ.n = null; IZ.x = null; IZ.vx = IZ.vy = 0; IZ.up = true; IZ.dene = 0;
    clearTimeout(IZ.deneZ); tCapa(false);
    lazerGizle(); mercekKapat(); buyutecKapat();
  }
  function isaretGeldi(s) {
    if (CIHAZ !== 'tahta') return;
    IZ.kayit = s.val() || null; IZ.dene = 0;
    isaretDegerlendir();
    gorusYaz(true);                                            /* kumandanın tahta alanı için */
  }
  function isaretDegerlendir() {
    var v = IZ.kayit;
    if (!isaretGecerli(v)) { if (IZ.a || IZ.zoom) isaretSifirla(); return; }
    if (IZ.a === v.a && IZ.n === v.n) return;                   /* bu kayıt zaten uygulandı */
    if (v.a !== 'lazer' && v.a !== 'buyutec') { isaretSifirla(); return; }
    /* «bırakıldı» ya da 15 sn'den eski (kalkış haberi gelmemiş) kayıt: yerinde durur */
    var hareket = !v.up && !(typeof v.z === 'number' && sunucuZaman() - v.z > 15000);
    isaretUygula(v, hareket);
  }
  function isaretUygula(v, hareket) {
    if (IZ.a && IZ.a !== v.a) isaretSifirla();
    var p = isaretNokta(v);
    if (!p) {                                                  /* sayfa daha dizilmedi: biraz sonra yine */
      clearTimeout(IZ.deneZ);
      if (!IZ.a && (IZ.dene = (IZ.dene || 0) + 1) <= 8) IZ.deneZ = setTimeout(isaretDegerlendir, 400);
      return;
    }
    IZ.v = v; IZ.n = v.n;
    var W = window.innerWidth, H = window.innerHeight;
    IZ.disari = p.x < 0 || p.y < 0 || p.x > W || p.y > H;
    p.x = Math.min(W - 8, Math.max(8, p.x)); p.y = Math.min(H - 8, Math.max(8, p.y));
    /* denge: kumanda ekranı tahtadan kaç kat dar (dikey telefon ~4, bilgisayar ~1) */
    var gw = CERCEVE.clientWidth || W;
    IZ.amp = Math.min(5, Math.max(1, gw / Math.max(240, +v.w || gw)));
    var yeni = !IZ.a;
    IZ.a = v.a;
    if (yeni || IZ.x === null) { IZ.x = p.x; IZ.y = p.y; IZ.vx = IZ.vy = 0; IZ.iz = []; }
    IZ.hx = p.x; IZ.hy = p.y; IZ.up = !hareket;
    if (v.a === 'lazer') noktaGoster();
    else if (mercekAc(v)) { if (IZ.zoom) buyutecKapat(); mercekYerlestir(); }
    else tamBuyut(v, p);                                        /* mercek kurulamadı: eskisi gibi */
    tCapa(true);
    lazerCalis();
  }

  /* çapa: içerik kayınca (tahta kaydırıldı, düzen değişti) nokta da mercek de
     kelimesiyle birlikte gider — süzülmeden, olduğu gibi */
  var KAY_RAF = 0;
  function tCapa(ac) {
    if (!ac) {
      clearInterval(IZ.tik); IZ.tik = null;
      if (IZ.kw && IZ.kf) { try { IZ.kw.removeEventListener('scroll', IZ.kf, true); } catch (e) { } }
      IZ.kw = null;
      return;
    }
    if (!IZ.tik) IZ.tik = setInterval(isaretCapala, 300);
    var w = null;
    try { w = CERCEVE.contentWindow; } catch (e) { w = null; }
    if (w && IZ.kw !== w) {
      if (IZ.kw && IZ.kf) { try { IZ.kw.removeEventListener('scroll', IZ.kf, true); } catch (e) { } }
      if (!IZ.kf) IZ.kf = function (e) {
        if (IZ.mercek) aynaKaydir(IZ.mercek.A, e && e.target);
        if (!KAY_RAF) KAY_RAF = requestAnimationFrame(function () { KAY_RAF = 0; isaretCapala(); });
      };
      try { w.addEventListener('scroll', IZ.kf, true); IZ.kw = w; } catch (e) { IZ.kw = null; }
    }
  }
  function isaretCapala() {
    if (!IZ.v || IZ.x === null || !IZ.a) return;
    var p = isaretNokta(IZ.v);
    if (!p) return;
    var W = window.innerWidth, H = window.innerHeight;
    var dis = p.x < 0 || p.y < 0 || p.x > W || p.y > H;
    p.x = Math.min(W - 8, Math.max(8, p.x)); p.y = Math.min(H - 8, Math.max(8, p.y));
    var dx = p.x - IZ.hx, dy = p.y - IZ.hy;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && dis === IZ.disari) return;
    IZ.hx = p.x; IZ.hy = p.y; IZ.x += dx; IZ.y += dy; IZ.disari = dis;
    for (var i = 0; i < IZ.iz.length; i++) { IZ.iz[i].x += dx; IZ.iz[i].y += dy; }
    noktaYerlestir();
    if (IZ.mercek) mercekYerlestir();
    lazerCalis();
  }

  /* tahta: kumandanın TAHTA ALANI için ekran boyutu ve kaydırma — yalnız kumandada
     araç açıkken (bu dersin isaret kaydı varken), en çok ~7 kez/sn */
  var GR = { z: null, son: 0, imza: '', kw: null, kf: null };
  function gorusGerekli() {
    var v = IZ.kayit;
    if (CIHAZ !== 'tahta' || !S.kok || !v || !v.a || v.i === BEN) return false;
    if (v.b && S.yayin && S.yayin.bas && v.b !== S.yayin.bas) return false;
    return oturumVar() || uzaktaMi();
  }
  function gorusYaz(hemen) {
    if (!gorusGerekli()) { gorusDinle(false); return; }
    gorusDinle(true);
    var w = null, sx = 0, sy = 0;
    try { w = CERCEVE.contentWindow; sx = Math.round(w.scrollX || 0); sy = Math.round(w.scrollY || 0); } catch (e) { }
    var g = { w: Math.round(CERCEVE.clientWidth || window.innerWidth), h: Math.round(CERCEVE.clientHeight || window.innerHeight),
              sx: sx, sy: sy, d: sayfaNo() };
    var im = g.w + ',' + g.h + ',' + g.sx + ',' + g.sy + ',' + g.d;
    if (im === GR.imza) return;
    var gec = SIMDI() - GR.son;
    if (!hemen && gec < 150) { if (!GR.z) GR.z = setTimeout(function () { GR.z = null; gorusYaz(true); }, 150 - gec); return; }
    clearTimeout(GR.z); GR.z = null;
    GR.imza = im; GR.son = SIMDI();
    g.z = sunucuZaman();
    try { S.kok.child('gorus').set(g); } catch (e) { }
  }
  function gorusDinle(ac) {
    var w = null;
    if (ac) { try { w = CERCEVE.contentWindow; } catch (e) { w = null; } }
    if (GR.kw && GR.kw !== w) { try { GR.kw.removeEventListener('scroll', GR.kf, true); } catch (e) { } GR.kw = null; }
    if (w && !GR.kw) {
      if (!GR.kf) GR.kf = function () { gorusYaz(false); };
      try { w.addEventListener('scroll', GR.kf, true); GR.kw = w; } catch (e) { GR.kw = null; }
    }
  }

  /* ------------------------------------------------ tahta: lazer noktası + iz */
  function lazerTuval() {
    var t = IZ.tuval;
    if (!t) {
      t = document.createElement('canvas');
      t.id = 'thLazer'; t.className = 'th-lazer'; t.setAttribute('aria-hidden', 'true');
      document.body.appendChild(t);
      IZ.tuval = t;
    }
    var dpr = Math.min(2, window.devicePixelRatio || 1), W = window.innerWidth, H = window.innerHeight;
    if (t.width !== Math.round(W * dpr) || t.height !== Math.round(H * dpr)) { t.width = Math.round(W * dpr); t.height = Math.round(H * dpr); }
    IZ.dpr = dpr;
    return t;
  }
  /* nokta bir öğe (CSS ile parlar, ekran kartında kayar); iz tuvalde */
  function noktaGoster() {
    var n = IZ.nokta;
    if (!n) {
      n = document.createElement('div');
      n.id = 'thLazerNokta'; n.setAttribute('aria-hidden', 'true');
      n.innerHTML = '<i></i>';
      document.body.appendChild(n);
      IZ.nokta = n;
    }
    noktaYerlestir();
  }
  function noktaYerlestir() {
    var n = IZ.nokta;
    if (!n || IZ.x === null) return;
    n.style.transform = 'translate3d(' + IZ.x.toFixed(1) + 'px,' + IZ.y.toFixed(1) + 'px,0)';
    var c = 'th-lazer-nokta gel' + (IZ.up ? ' dinlen' : '') + (IZ.disari ? ' disari' : '');
    if (n.className !== c) n.className = c;
  }
  function lazerGizle() {
    var n = IZ.nokta;
    IZ.nokta = null; IZ.iz = [];
    if (n) {
      n.classList.add('git');
      setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 240);
    }
    if (IZ.tuval) { var c = IZ.tuval.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, IZ.tuval.width, IZ.tuval.height); }
  }
  function lazerCalis() { if (!IZ.raf) IZ.raf = requestAnimationFrame(lazerCiz); }
  /* yaylı izleyici (kritik sönümlü yay + hız sınırı): nokta yumuşak hızlanır, hedefi
     geçmeden yavaşlayarak durur. Kumanda dar ekransa (amp büyük) daha yumuşak, yavaş. */
  function izleyici(dt) {
    var a = IZ.amp - 1;
    var st = Math.min(0.2, 0.085 + 0.02 * a);                                          /* ~yetişme süresi, sn */
    var vmax = Math.max(window.innerWidth, window.innerHeight) * 2.7 / (1 + 0.35 * a);  /* px / sn */
    var om = 2 / st, x = om * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var cx = IZ.x - IZ.hx, cy = IZ.y - IZ.hy, L = Math.sqrt(cx * cx + cy * cy), mc = vmax * st;
    if (L > mc) { cx *= mc / L; cy *= mc / L; }
    var tx = IZ.x - cx, ty = IZ.y - cy;
    var gx = (IZ.vx + om * cx) * dt, gy = (IZ.vy + om * cy) * dt;
    IZ.vx = (IZ.vx - om * gx) * e; IZ.vy = (IZ.vy - om * gy) * e;
    var nx = tx + (cx + gx) * e, ny = ty + (cy + gy) * e;
    if ((IZ.hx - IZ.x) * (nx - IZ.hx) + (IZ.hy - IZ.y) * (ny - IZ.hy) > 0) { nx = IZ.hx; ny = IZ.hy; IZ.vx = IZ.vy = 0; }
    IZ.x = nx; IZ.y = ny;
  }
  function lazerCiz() {
    IZ.raf = 0;
    if (IZ.x === null || !IZ.a) { IZ.tz = 0; return; }
    var now = SIMDI(), dt = IZ.tz ? Math.min(0.05, Math.max(0.004, (now - IZ.tz) / 1000)) : 1 / 60;
    IZ.tz = now;
    izleyici(dt);
    var hiz = Math.sqrt(IZ.vx * IZ.vx + IZ.vy * IZ.vy), kalan = Math.abs(IZ.hx - IZ.x) + Math.abs(IZ.hy - IZ.y);
    var kos = hiz > 4 || kalan > 0.5;
    if (IZ.a === 'lazer') { noktaYerlestir(); izCiz(now, kos); }
    else if (IZ.mercek) mercekYerlestir();
    if (kos || IZ.iz.length > 1) lazerCalis();
    else { IZ.tz = 0; IZ.vx = IZ.vy = 0; }
  }
  function izCiz(now, kos) {
    var t = lazerTuval(), c = t.getContext('2d'), dpr = IZ.dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, t.width / dpr, t.height / dpr);
    if (kos) IZ.iz.push({ x: IZ.x, y: IZ.y, t: now });
    while (IZ.iz.length && now - IZ.iz[0].t > 300) IZ.iz.shift();
    if (IZ.iz.length < 2) return;
    var za = IZ.disari ? 0.55 : 1;
    c.lineCap = 'round';
    for (var i = 1; i < IZ.iz.length; i++) {
      var p0 = IZ.iz[i - 1], p1 = IZ.iz[i], f = i / IZ.iz.length;
      c.strokeStyle = 'rgba(255,40,40,' + (0.42 * f * za).toFixed(3) + ')';
      c.lineWidth = 2.5 + 6.5 * f;
      c.beginPath(); c.moveTo(p0.x, p0.y); c.lineTo(p1.x, p1.y); c.stroke();
    }
  }
  window.addEventListener('resize', function () {
    if (CIHAZ === 'tahta') gorusYaz(true);
    if (IZ.tuval) lazerTuval();
    if (IZ.mercek) { mercekBoyut(); mercekYerlestir(); }
    if (IZ.a) setTimeout(isaretCapala, 60);
  });

  /* ------------------------------------------------ AYNA: sayfanın canlı kopyası
     Sayfanın o anki hâlinin bir kopyası (aynı köken, ayrı ve görünmez bir iç
     çerçeve). Kopyada hiçbir betik çalışmaz (betiklerin türü değişir, on…
     nitelikleri silinir), iç çerçeveler boş açılıp kopyalanır, tuvaller (canvas)
     resim olarak aktarılır, ses/görüntü kendiliğinden başlamaz. Kopya bir kez
     kurulur; sonra sayfadaki her değişiklik (MutationObserver) yalnız değişen
     düğüme işlenir — büyük sayfada da takılmasın. Girdi değerleri, stiller, iç
     çerçeveler saniyede bir denetlenir.
     İki yerde kullanılır: tahtada MERCEK (22.10.2026) ve kumandada TAHTA ALANI
     (22.10.2026 — kopya tahtanın ekran boyutunda dizilir, tahtanın kaydırmasıyla). */
  var MERCEK_STIL = 'html{scroll-behavior:auto!important}' +
    '*,*::before,*::after{transition:none!important;animation-delay:-60s!important;animation-play-state:paused!important;caret-color:transparent!important}';
  /* od: özgün belge · ifr: kopyanın çerçevesi (belgeye eklenmiş) ·
     kaydir: pencere kaydırması nereden (yoksa özgünün kendi kaydırması) */
  function aynaAc(od, ifr, kaydir) {
    var A = { od: od, ifr: ifr, kaydir: kaydir || null, H: null, mo: null, z: null, son: 0, tuvalZ: null, hafifZ: null,
              icG: new WeakMap(), icL: [], kapali: false, af: null };
    kopyaAc(od, ifr.contentDocument);
    aynaGovde(A);
    A.mo = new MutationObserver(function (k) { aynaDegisim(A, k); });
    A.mo.observe(od, { subtree: true, childList: true, attributes: true, characterData: true });
    A.af = function () { if (!A.kapali && A.H) alanEsle(A); };
    od.addEventListener('input', A.af, true);
    od.addEventListener('change', A.af, true);
    A.tuvalZ = setInterval(function () { kopyaTuval(A.od, A.ifr.contentDocument); }, 500);      /* tuval (canvas) çizimleri */
    A.hafifZ = setInterval(function () { aynaHafif(A); }, 1000);     /* girdi değerleri, stiller, iç çerçeveler */
    return A;
  }
  function aynaKapat(A) {
    if (!A || A.kapali) return;
    A.kapali = true;
    clearTimeout(A.z); clearInterval(A.tuvalZ); clearInterval(A.hafifZ);
    try { if (A.mo) A.mo.disconnect(); } catch (e) { }
    try { A.od.removeEventListener('input', A.af, true); A.od.removeEventListener('change', A.af, true); } catch (e) { }
    A.icL.forEach(function (G) { try { G.mo.disconnect(); G.d.removeEventListener('input', G.f, true); } catch (e) { } });
    A.H = null; A.icL = [];
  }
  /* stiller yüklendi mi (yoksa bir an biçimsiz kopya görünürdü) */
  function aynaHazirBekle(A, bitti) {
    var t0 = SIMDI();
    (function bak() {
      if (A.kapali) return;
      var hazir = true;
      try {
        var l = A.ifr.contentDocument.querySelectorAll('link[rel~="stylesheet"]');
        for (var i = 0; i < l.length; i++) if (!l[i].sheet) { hazir = false; break; }
      } catch (e) { }
      if (hazir || SIMDI() - t0 > 1500) { bitti(); return; }
      setTimeout(bak, 40);
    })();
  }
  /* baştan kurma (açılışta; bir şey ters giderse yedek olarak) */
  function aynaTazeleIste(A) {
    if (!A || A.kapali || A.z) return;
    A.z = setTimeout(function () {
      A.z = null;
      if (A.kapali) return;
      try { aynaGovde(A); } catch (e) { }
    }, Math.max(250, 900 - (SIMDI() - A.son)));
  }
  function aynaGovde(A) {
    var ad = A.ifr.contentDocument;
    kopyaTazele(A.od, ad, 0, A);
    A.H = new WeakMap();
    haritaKur(A.od.body, ad.body, A.H);
    aynaKaydir(A, null, true);
    A.son = SIMDI();
  }
  /* sayfadaki değişiklik yalnız değişen düğüme işlenir */
  function aynaDegisim(A, kayitlar) {
    if (!A || A.kapali || !A.H || A.z) return;                  /* baştan kurma bekliyorsa o yapar */
    var od = A.od, ad = A.ifr.contentDocument, H = A.H;
    if (!ad || !ad.body || !od.body || H.get(od.body) !== ad.body) { aynaTazeleIste(A); return; }
    try {
      var kirli = new Set(), bas = false, ic = false, i, r, t, k;
      for (i = 0; i < kayitlar.length; i++) {
        r = kayitlar[i]; t = r.target;
        if (!od.body.contains(t)) {                     /* gövde dışı: html nitelikleri, başlık */
          if (t === od.documentElement && r.type === 'attributes') nitelikEsle(od.documentElement, ad.documentElement);
          else if (t === od.documentElement) { aynaTazeleIste(A); return; }
          else bas = true;
          continue;
        }
        if (r.type === 'childList') { kirli.add(t); continue; }
        k = H.get(t);
        if (!k) { if (t.parentNode) kirli.add(t.parentNode); continue; }
        if (r.type === 'characterData') { if (k.data !== t.data) k.data = t.data; }
        else if (k.nodeType === 1 && nitelikAktar(t, k, r.attributeName, r.attributeNamespace)) ic = true;
      }
      if (bas) kopyaBas(od, ad);
      if (kirli.size) {
        var l = [];
        kirli.forEach(function (x) { if (od.body === x || od.body.contains(x)) l.push(x); });
        l.sort(function (a, b) { return a === b ? 0 : ((a.compareDocumentPosition(b) & 4) ? -1 : 1); });
        for (i = 0; i < l.length; i++) {
          var K = H.get(l[i]);
          if (!K) { aynaTazeleIste(A); return; }
          if (cocukEsle(l[i], K, ad, H)) ic = true;
        }
      }
      if (ic) aynaIcTara(A);
    } catch (e) { aynaTazeleIste(A); }
  }
  function aynaHafif(A) {
    if (!A || A.kapali || !A.H || A.z) return;
    var ad = A.ifr.contentDocument;
    if (!ad) return;
    try { kopyaBas(A.od, ad); alanEsle(A); aynaIcTara(A); } catch (e) { }
  }
  /* başlıktaki stiller ve imzaları (değişti mi diye) */
  function basListesi(od) {
    var ch = od.head ? od.head.children : [], l = [], imza = [];
    for (var i = 0; i < ch.length; i++) {
      var n = ch[i], t = n.tagName;
      if (t === 'STYLE') {
        var nk = 0;
        try { nk = n.sheet ? n.sheet.cssRules.length : 0; } catch (e) { }
        l.push(n); imza.push('S' + n.textContent.length + '|' + nk + '|' + (n.media || '') + (n.disabled ? '|x' : ''));
      } else if (t === 'LINK' && /(^|\s)stylesheet(\s|$)/i.test(n.getAttribute('rel') || '')) {
        l.push(n); imza.push('L' + n.href + '|' + (n.media || '') + (n.disabled ? '|x' : ''));
      }
    }
    return { l: l, imza: imza.join('\n') };
  }
  function stilMetni(st) {
    var t = st.textContent;
    if (t && /\S/.test(t)) return t;                    /* yazılı stil; boşsa betikle eklenmiş kurallar (CSSOM) */
    try {
      var r = st.sheet && st.sheet.cssRules;
      if (r) { var a = []; for (var i = 0; i < r.length; i++) a.push(r[i].cssText); return a.join('\n'); }
    } catch (e) { }
    return st.textContent;
  }
  function kapaliEsle(B, ad) {
    var ks = ad.head.querySelectorAll('[data-th-kopya]');
    B.l.forEach(function (n, i) { if (n.disabled && ks[i]) { try { ks[i].disabled = true; } catch (e) { } } });
  }
  /* boş belgeye iskelet: aynı belge türü (standart/eski kip), aynı taban adresi,
     sayfanın stilleri (ayrıştırıcıdan geçtiği için biçimsiz bir an görünmez) */
  function kopyaAc(od, ad) {
    var dt = od.doctype, tip = '';
    if (dt) tip = '<!DOCTYPE ' + (dt.name || 'html') + (dt.publicId ? ' PUBLIC "' + dt.publicId + '"' : '') +
                  (dt.systemId ? (dt.publicId ? '' : ' SYSTEM') + ' "' + dt.systemId + '"' : '') + '>';
    var B = basListesi(od), h = '';
    B.l.forEach(function (n) {
      var md = n.media ? ' media="' + kac(n.media) + '"' : '';
      if (n.tagName === 'STYLE') h += '<style data-th-kopya' + md + '>' + stilMetni(n).replace(/<\/(style)/gi, '<\\/$1') + '</style>';
      else h += '<link rel="stylesheet" data-th-kopya href="' + kac(n.href) + '"' + md + (n.crossOrigin ? ' crossorigin="' + kac(n.crossOrigin) + '"' : '') + '>';
    });
    ad.open();
    ad.write(tip + '<html><head><base href="' + kac(od.baseURI) + '">' + h + '<style id="thMercekStil">' + MERCEK_STIL + '</style></head><body></body></html>');
    ad.close();
    kapaliEsle(B, ad);
    ad.__thKopya = { bas: B.imza, kaynak: od };
  }
  /* sonradan değişen başlık stilleri (bağlantılar boşuna yeniden yüklenmesin) */
  function kopyaBas(od, ad) {
    var K = ad.__thKopya || (ad.__thKopya = { bas: null, kaynak: od });
    var B = basListesi(od);
    if (K.bas === B.imza) return;
    K.bas = B.imza;
    var eski = ad.head.querySelectorAll('[data-th-kopya]');
    for (var j = 0; j < eski.length; j++) eski[j].parentNode.removeChild(eski[j]);
    var bizim = ad.getElementById('thMercekStil');
    B.l.forEach(function (n) {
      var c;
      if (n.tagName === 'STYLE') { c = ad.createElement('style'); c.textContent = stilMetni(n); if (n.media) c.media = n.media; }
      else { c = ad.createElement('link'); c.rel = 'stylesheet'; c.href = n.href; if (n.media) c.media = n.media; if (n.crossOrigin) c.crossOrigin = n.crossOrigin; }
      c.setAttribute('data-th-kopya', '');
      ad.head.insertBefore(c, bizim);                             /* kopyanın kendi kuralı en sonda kalır */
    });
    kapaliEsle(B, ad);
  }
  function nitelikEsle(a, b) {
    var i, n;
    for (i = b.attributes.length - 1; i >= 0; i--) { n = b.attributes[i].name; if (!a.hasAttribute(n)) b.removeAttribute(n); }
    for (i = 0; i < a.attributes.length; i++) {
      n = a.attributes[i];
      if (!/^on/i.test(n.name) && b.getAttribute(n.name) !== n.value) b.setAttribute(n.name, n.value);
    }
  }
  /* tek nitelik değişikliği kopyaya (temizlik kuralları korunur); iç çerçeve yeni
     sayfaya geçtiyse true */
  function nitelikAktar(a, k, ad, ns) {
    if (!ad || /^on/i.test(ad)) return false;
    var t = k.localName;
    if (t === 'iframe' || t === 'frame') { if (ad === 'src' || ad === 'srcdoc') return true; }
    else if (t === 'script') { if (ad === 'type' || ad === 'src') return false; }
    else if (t === 'video' || t === 'audio') { if (ad === 'autoplay' || ad === 'preload' || ad === 'muted') return false; }
    else if (t === 'object' || t === 'embed') { if (ad === 'data' || ad === 'src') return false; }
    if (ns) {
      var n = a.getAttributeNodeNS(ns, ad);
      if (!n) k.removeAttributeNS(ns, ad); else if (k.getAttributeNS(ns, ad) !== n.value) k.setAttributeNS(ns, n.name, n.value);
    } else {
      var v = a.getAttribute(ad);
      if (v === null) k.removeAttribute(ad); else if (k.getAttribute(ad) !== v) k.setAttribute(ad, v);
    }
    return false;
  }
  /* kopyada hiçbir şey çalışmasın: betik türü değişir, on… nitelikleri silinir,
     iç çerçeveler boş açılır, ses/görüntü kendiliğinden başlamaz. Sayfada yüklenmiş
     resimler kopyada beklemeden (önbellekten, bir anda) çizilir. */
  function kopyaTemizle(kok, asil) {
    var tw = kok.ownerDocument.createTreeWalker(kok, 1), el = kok;
    var tw2 = asil ? asil.ownerDocument.createTreeWalker(asil, 1) : null, ae = asil;
    do {
      for (var i = el.attributes.length - 1; i >= 0; i--) {
        var a = el.attributes[i].name;
        if (a.length > 2 && (a.charCodeAt(0) | 32) === 111 && (a.charCodeAt(1) | 32) === 110) el.removeAttribute(a);
      }
      var t = el.localName;
      if (t === 'script') el.setAttribute('type', 'text/x-kopya');
      else if (t === 'iframe' || t === 'frame') { el.removeAttribute('src'); el.removeAttribute('srcdoc'); }
      else if (t === 'video' || t === 'audio') { el.removeAttribute('autoplay'); el.setAttribute('preload', 'none'); el.setAttribute('muted', ''); }
      else if (t === 'object' || t === 'embed') { el.removeAttribute('data'); el.removeAttribute('src'); }
      else if (t === 'img' && ae && ae.localName === 'img' && ae.complete && ae.naturalWidth) {
        el.setAttribute('decoding', 'sync');
        if ((el.getAttribute('loading') || '').toLowerCase() === 'lazy') el.setAttribute('loading', 'eager');
      }
      ae = tw2 ? tw2.nextNode() : null;
    } while ((el = tw.nextNode()));
  }
  function kopyaTuval(od, ad) {
    if (!ad) return;
    var a = od.getElementsByTagName('canvas'), b = ad.getElementsByTagName('canvas');
    for (var i = 0; i < a.length && i < b.length; i++) {
      try {
        if (b[i].width !== a[i].width) b[i].width = a[i].width;
        if (b[i].height !== a[i].height) b[i].height = a[i].height;
        var g = b[i].getContext('2d');
        g.clearRect(0, 0, b[i].width, b[i].height);
        g.drawImage(a[i], 0, 0);
      } catch (e) { }
    }
  }
  /* özgün düğüm → kopyadaki düğüm (aynı ağaç, aynı sıra) */
  function haritaKur(asil, kopya, H) {
    var ta = asil.ownerDocument.createTreeWalker(asil, 0xFFFFFFFF), tk = kopya.ownerDocument.createTreeWalker(kopya, 0xFFFFFFFF);
    var a = asil, k = kopya;
    while (a && k) { H.set(a, k); a = ta.nextNode(); k = tk.nextNode(); }
  }
  /* P'nin çocukları kopyada K'nin çocuklarına: eşlenmiş olan yerinde kalır (ya da
     taşınır), yeni gelen içe aktarılır, giden kalkar. İç çerçeve eklendiyse true. */
  function cocukEsle(P, K, ad, H) {
    var liste = [], ic = false, c, k;
    for (c = P.firstChild; c; c = c.nextSibling) {
      k = H.get(c);
      if (!k || k.ownerDocument !== ad) {
        k = ad.importNode(c, true);
        if (k.nodeType === 1) {
          kopyaTemizle(k, c);
          if (icVar(k)) ic = true;
        }
        haritaKur(c, k, H);
      } else if ((k.nodeType === 3 || k.nodeType === 8) && k.data !== c.data) k.data = c.data;
      liste.push(k);
    }
    var ref = K.firstChild;
    for (var i = 0; i < liste.length; i++) {
      k = liste[i];
      if (k === ref) { ref = ref.nextSibling; continue; }
      if (k.nodeType === 1 && icVar(k)) ic = true;                  /* taşınan iç çerçeve yeniden yüklenir */
      K.insertBefore(k, ref);
    }
    while (ref) { var s = ref.nextSibling; K.removeChild(ref); ref = s; }
    return ic;
  }
  /* eski kopyadaki yüklü resimler yeni gövdeye taşınır (yeniden yüklenip yanıp sönmesin) */
  function resimTasi(eskiKok, yeniKok) {
    if (!eskiKok) return;
    var es = eskiKok.getElementsByTagName('img'), harita = {}, i;
    for (i = 0; i < es.length; i++) {
      var e = es[i], s = e.getAttribute('src') || '';
      if (s && e.complete && e.naturalWidth) (harita[s] || (harita[s] = [])).push(e);
    }
    var ys = [].slice.call(yeniKok.getElementsByTagName('img'));
    for (i = 0; i < ys.length; i++) {
      var y = ys[i], l = harita[y.getAttribute('src') || ''];
      if (!l || !l.length) continue;
      var eski = l.shift();
      nitelikEsle(y, eski);
      y.parentNode.replaceChild(eski, y);
    }
  }
  /* baştan kurmada iç çerçeveler (ve içlerindeki kopya belgeler) yerinde kalır,
     yalnız içerikleri tazelenir — yeniden yüklenip yanıp sönmesin */
  function icVar(el) { return el.localName === 'iframe' || el.localName === 'frame' || !!el.querySelector('iframe,frame'); }
  function birlestir(eski, yeni) {
    nitelikEsle(yeni, eski);
    if (eski.localName === 'iframe' || eski.localName === 'frame') return;
    var ec = eski.childNodes, yc = yeni.childNodes, ayni = ec.length === yc.length, i;
    for (i = 0; ayni && i < ec.length; i++) if (ec[i].nodeType !== yc[i].nodeType || ec[i].nodeName !== yc[i].nodeName) ayni = false;
    if (!ayni) {
      resimTasi(eski, yeni);
      while (eski.firstChild) eski.removeChild(eski.firstChild);
      while (yeni.firstChild) eski.appendChild(yeni.firstChild);
      return;
    }
    for (i = ec.length - 1; i >= 0; i--) {              /* sondan: taşınan düğüm öndekilerin sırasını bozmaz */
      var e = ec[i], y = yc[i];
      if (e.nodeType === 1 && icVar(e)) birlestir(e, y);
      else if (e.nodeType === 3 || e.nodeType === 8) { if (e.data !== y.data) e.data = y.data; }
      else if (e.nodeType === 1 && e.localName === 'img' && e.complete && e.naturalWidth && (e.getAttribute('src') || '') === (y.getAttribute('src') || '')) nitelikEsle(y, e);
      else { if (e.nodeType === 1) resimTasi(e, y); eski.replaceChild(y, e); }
    }
  }
  /* od'nin o anki hâli kopya belge ad'ye (baştan) */
  function kopyaTazele(od, ad, kat, A) {
    if (!ad || !ad.documentElement || !od.body) return;
    nitelikEsle(od.documentElement, ad.documentElement);
    kopyaBas(od, ad);
    var nb = ad.importNode(od.body, true);
    kopyaTemizle(nb, od.body);
    if (!ad.body) ad.documentElement.appendChild(nb);
    else if (ad.body.localName === nb.localName && icVar(ad.body) && icVar(nb)) birlestir(ad.body, nb);
    else { resimTasi(ad.body, nb); ad.documentElement.replaceChild(nb, ad.body); }
    kopyaTuval(od, ad);
    if (kat >= 2) return;
    var a = od.getElementsByTagName('iframe'), b = ad.getElementsByTagName('iframe');
    for (var i = 0; i < a.length && i < b.length; i++) icKopya(a[i], b[i], kat, true, A);
  }
  /* iç çerçeve sayfasını (ör. açılır sözlük) izleyen gözcü: değişince «kirli» */
  function icGozcu(A, id) {
    var G = A.icG.get(id);
    if (G) return G;
    G = { kirli: false, mo: null, d: id, f: null };
    G.f = function () { G.kirli = true; };
    try {
      G.mo = new MutationObserver(G.f);
      G.mo.observe(id, { subtree: true, childList: true, attributes: true, characterData: true });
      id.addEventListener('input', G.f, true);
    } catch (e) { }
    A.icG.set(id, G); A.icL.push(G);
    return G;
  }
  /* iç çerçeve: özgün a, kopyadaki b. Sayfası değiştiyse kopyası tazelenir. */
  function icKopya(a, b, kat, zorla, A) {
    var id = null;
    try { id = a.contentDocument; } catch (e) { id = null; }
    if (!id || !id.body) return;
    try {
      var hd = b.contentDocument;
      if (!hd) return;
      var K = hd.__thKopya, G = A ? icGozcu(A, id) : null;
      if (!K || K.kaynak !== id || !hd.getElementById('thMercekStil')) { kopyaAc(id, hd); K = hd.__thKopya; K.kaynak = id; zorla = true; }
      if (zorla || !G || G.kirli) { if (G) G.kirli = false; kopyaTazele(id, hd, kat + 1, A); }
      else kopyaBas(id, hd);
      b.contentWindow.scrollTo(a.contentWindow.scrollX, a.contentWindow.scrollY);
    } catch (e) { }
  }
  function aynaIcTara(A) {
    var a = A.od.getElementsByTagName('iframe');
    for (var i = 0; i < a.length; i++) {
      var b = A.H.get(a[i]);
      if (b && b.isConnected) icKopya(a[i], b, 0, false, A);
    }
  }
  /* girdi değerleri (yazılan, betikle verilen, işaretlenen) kopyaya */
  function alanEsle(A) {
    var f = A.od.querySelectorAll('input,textarea,select');
    for (var i = 0; i < f.length; i++) {
      var a = f[i], k = A.H.get(a);
      if (!k) continue;
      try {
        if (a.localName === 'select') { if (k.selectedIndex !== a.selectedIndex) k.selectedIndex = a.selectedIndex; }
        else if (a.type === 'checkbox' || a.type === 'radio') { if (k.checked !== a.checked) k.checked = a.checked; }
        else if (a.type !== 'file' && k.value !== a.value) k.value = a.value;
      } catch (e) { }
    }
  }
  /* kaydırma eşleme: pencere (kaydir varsa oradan, yoksa özgünün kendisi) ve
     (hepsi: baştan kurmada) kaymış iç kutular */
  function aynaKaydir(A, hedef, hepsi) {
    if (!A || A.kapali || !A.ifr) return;
    var od = A.od, ad = A.ifr.contentDocument, aw = A.ifr.contentWindow, ow = od.defaultView;
    if (!ad || !aw || !ow || !od.body || !ad.body) return;
    if (hepsi || !hedef || hedef === od || hedef === od.documentElement || hedef === od.body) {
      var k = A.kaydir ? A.kaydir() : { x: ow.scrollX || 0, y: ow.scrollY || 0 };
      if (k) { try { aw.scrollTo(k.x || 0, k.y || 0); } catch (e) { } }
      if (!hepsi) return;
    }
    if (hepsi) {
      var a = od.body.getElementsByTagName('*'), b = ad.body.getElementsByTagName('*');
      for (var i = 0; i < a.length && i < b.length; i++) {
        var el = a[i];
        if (el.scrollTop || el.scrollLeft) { b[i].scrollTop = el.scrollTop; b[i].scrollLeft = el.scrollLeft; }
      }
      return;
    }
    if (hedef.nodeType !== 1 || !A.H) return;
    var kk = A.H.get(hedef);
    if (kk && kk.nodeType === 1) { kk.scrollTop = hedef.scrollTop; kk.scrollLeft = hedef.scrollLeft; }
  }

  /* ------------------------------------------------------- tahta: MERCEK
     Tahtada yuvarlak mercek: sayfanın aynası (AYNA) içinde k kat büyük durur;
     merceğin ortası parmağın yeri; gerisi olduğu gibi görünür. */
  function mercekAc(v) {
    var k = Math.min(4, Math.max(1.25, +v.k || 2));
    var M = IZ.mercek;
    if (M) { M.k = k; return true; }
    var od = null;
    try { od = CERCEVE.contentDocument; } catch (e) { od = null; }
    if (!od || !od.body || !od.defaultView) return false;
    try {
      M = { kap: null, ifr: null, R: 0, k: k, A: null };
      var kap = document.createElement('div');
      kap.id = 'thMercek'; kap.className = 'th-mercek gizli'; kap.setAttribute('aria-hidden', 'true');
      var ifr = document.createElement('iframe');
      ifr.className = 'th-mercek-ic'; ifr.setAttribute('tabindex', '-1'); ifr.setAttribute('aria-hidden', 'true');
      kap.appendChild(ifr);
      document.body.appendChild(kap);
      M.kap = kap; M.ifr = ifr;
      IZ.mercek = M;
      mercekBoyut();
      M.A = aynaAc(od, ifr, null);
      aynaHazirBekle(M.A, function () { if (IZ.mercek === M) { M.kap.classList.remove('gizli'); mercekYerlestir(); } });
      return true;
    } catch (e) {
      mercekKapat();
      return false;
    }
  }
  function mercekKapat() {
    var M = IZ.mercek;
    if (!M) return;
    IZ.mercek = null;
    aynaKapat(M.A);
    var kap = M.kap;
    if (kap) {
      kap.classList.add('gizli');
      setTimeout(function () { if (kap.parentNode) kap.parentNode.removeChild(kap); }, 240);
    }
  }
  function mercekBoyut() {
    var M = IZ.mercek;
    if (!M) return;
    var W = CERCEVE.clientWidth || window.innerWidth, H = CERCEVE.clientHeight || window.innerHeight;
    M.R = Math.round(Math.min(300, Math.max(110, Math.min(W, H) * 0.21)));
    M.kap.style.width = M.kap.style.height = (2 * M.R) + 'px';
    M.ifr.style.width = W + 'px'; M.ifr.style.height = H + 'px';
  }
  function mercekYerlestir() {
    var M = IZ.mercek;
    if (!M || IZ.x === null) return;
    var R = M.R, k = M.k;
    var fx = IZ.x - CERCEVE.offsetLeft - CERCEVE.clientLeft, fy = IZ.y - CERCEVE.offsetTop - CERCEVE.clientTop;
    M.kap.style.transform = 'translate3d(' + Math.round(IZ.x - R) + 'px,' + Math.round(IZ.y - R) + 'px,0)';
    M.ifr.style.transform = 'translate(' + Math.round(R - fx * k) + 'px,' + Math.round(R - fy * k) + 'px) scale(' + k + ')';
  }

  /* mercek kurulamazsa (yedek): eskisi gibi bütün çerçeve o noktanın çevresinde büyür */
  function tamBuyut(v, p) {
    var k = Math.min(4, Math.max(1.25, +v.k || 2));
    var W = CERCEVE.clientWidth || window.innerWidth, H = CERCEVE.clientHeight || window.innerHeight;
    var ox = Math.min(W, Math.max(0, p.x - CERCEVE.offsetLeft)), oy = Math.min(H, Math.max(0, p.y - CERCEVE.offsetTop));
    var ilk = !IZ.zoom;
    CERCEVE.classList.add('th-buyuk');
    CERCEVE.style.transition = ilk ? 'transform .28s ease' : 'transform .2s ease, transform-origin .14s linear';
    CERCEVE.style.transformOrigin = Math.round(ox) + 'px ' + Math.round(oy) + 'px';
    CERCEVE.style.transform = 'scale(' + k + ')';
    IZ.zoom = { x: ox, y: oy, k: k };
  }
  function buyutecKapat() {
    if (!IZ.zoom) return;
    IZ.zoom = null;
    CERCEVE.style.transition = 'transform .25s ease';
    CERCEVE.style.transform = '';
    setTimeout(function () {
      if (IZ.zoom) return;
      CERCEVE.style.transition = ''; CERCEVE.style.transformOrigin = ''; CERCEVE.classList.remove('th-buyuk');
    }, 320);
  }

  /* ======================================================== DİNLEYİCİLER */
  function yayinGeldi(s) {
    var y = s.val(), once = S.yayin;
    /* TEK KUMANDA (21.10.2026) — öğretmen: "bi hesap en fazla bi cihazı kumanda olarak
       kullanabilir". Başka bir kumanda sayfası (başka cihaz ya da aynı cihazın başka
       sekmesi) yansıtmayı aldı ya da bitirdi: bu sayfa kumandalıktan çıkar, açık
       sayfasında kalır; geri almak için yeniden «Bu cihazı kumanda olarak kullan». */
    if (CIHAZ === 'bilgisayar' && S.kok && baskaKumanda(y)) { kumandaDevret(y); return; }
    /* HEDEF BAŞKA TAHTA: bu tahta yansıtmayı yok sayar — bekleme ekranında söyler,
       dokununca dersi almaz, vekil olmaz. Hedef buraya dönünce sayfayı açıp
       liderden geçmişi ister (sonradan bağlanan tahta yolu). */
    if (hedefDisi(y)) y = { cevrimici: false, bitir: true, baska: y.hedef, baskaAd: y.hedefAd || '', bas: y.bas || null, id: y.id, ts: y.ts || 0 };
    /* BİRLİKTE ÇIKIŞ (26.10.2026): kumanda bu oturumu «Bitir»le bitirdi — Sınıf Ekranı da
       kabuktan çıkar (yeni yansıtmada sistem/tahtagir.js geri getirir). Uyku / kopma değil. */
    if (S.cikiyor) { S.yayin = y; Z.yayin = y; return; }
    if (CIHAZ === 'tahta' && S.kok && y && y.bitir && !y.baska && once && !once.bitir && !once.baska &&
        (once.cevrimici || Z.sonCanli || Z.izledi || (S.lider && Y.vekil)) && (!once.bas || !y.bas || once.bas === y.bas)) {
      S.yayin = y; Z.yayin = y;
      birlikteCik('kumanda');
      return;
    }
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
        if (Y.durak) S.kok.child('yayin').update({ cevrimici: true, id: BEN, cihaz: CIHAZ, kimlik: KIMLIK, cihazAd: cihazAdi(), durak: true, vekil: null, bitir: null, ts: TS() });
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
        if (!liderId && once && once.cevrimici && once.id !== BEN && !(y && y.bitir) && Z.sonCanli && (!y || !y.id || y.id === once.id)) {
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
    kok.child('kanal').on('child_added', kanalGeldi);                         /* sayfanın kendi durumu (defter) */
    kok.child('kanal').on('child_changed', kanalGeldi);
    kok.child('kanalIste').on('value', function (s) { KN.istek = s.val(); kanalIstekBak(); });
    kok.child('ayar').on('value', function (s) {
      var v = s.val() || {};
      S.ayar = { kip: v.kip === 'tek' ? 'tek' : 'cift', perde: !!v.perde, kg: !!v.kg };
      arayuzTazele();
    });
    kok.child('izle').on('value', izleGeldi);
    kok.child('ekran').on('value', function (s) { ekranGeldi(s.val()); });     /* tek Sınıf Ekranı (21.10.2026) */
    if (CIHAZ === 'tahta') kok.child('isaret').on('value', isaretGeldi);       /* lazer · büyüteç (22.10.2026) */
    if (CIHAZ === 'bilgisayar') kok.child('gorus').on('value', function (s) { gorusGeldi(s.val()); });   /* tahta alanı */
    if (CIHAZ === 'bilgisayar') kok.child('cikis').on('value', function (s) { cikisGeldi(s.val()); });   /* tahtadan çıkıldı (26.10.2026) */
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
      kok.update({ 'yayin/id': BEN, 'yayin/cihaz': CIHAZ, 'yayin/kimlik': KIMLIK, 'yayin/cihazAd': cihazAdi(), 'yayin/hedef': null, 'yayin/hedefAd': null, 'yayin/cevrimici': true, 'yayin/durak': true, 'yayin/ts': TS(),
                   'yayin/bas': S.bas, 'yayin/vekil': null, 'yayin/bitir': null, 'isaret': null, 'cikis': null });
    } else {
      kok.update({ 'yayin/id': BEN, 'yayin/cihaz': CIHAZ, 'yayin/kimlik': KIMLIK, 'yayin/cihazAd': cihazAdi(), 'yayin/hedef': null, 'yayin/hedefAd': null, 'yayin/cevrimici': false, 'yayin/durak': false, 'yayin/ts': TS(),
                   'yayin/bas': S.bas, 'yayin/vekil': null, 'yayin/bitir': null, 'ayar': { kip: kip, perde: false, kg: false }, 'isaret': null, 'cikis': null });
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
    UYANIK.bas = SIMDI(); uyanikDenetle();
  }
  /* kumanda, tahtada süren dersi İZLEYEREK başlar: tahtadaki sayfa bu cihazda
     açılır, geçmişi tahtadan gelir; ilk dokunuşta kontrol bu cihaza geçer
     (aynı sayfa, aynı hâl: tahta yenilenmez) */
  function takipBasla(kok, y) {
    if (S.kok) return;
    S.kok = kok; S.lider = false; S.bas = y.bas || null;
    try { kok.child('isaret').set(null); } catch (e) { }      /* önceki kumandanın bıraktığı lazer kalkar */
    S.izlenenKumanda = (y && y.cihaz === 'bilgisayar') ? y.id : null;     /* izlenen (kopmuş) eski kumanda: devir sayılmaz */
    UYANIK.bas = SIMDI();
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
              if (Y.durak) S.kok.child('yayin').update({ cevrimici: true, id: BEN, cihaz: CIHAZ, kimlik: KIMLIK, cihazAd: cihazAdi(), durak: true, ts: TS() }); else yayinYaz(false);
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
    ekranSahiplen();               /* hesabın Sınıf Ekranı bu sayfa (dinleyiciden ÖNCE yazılır) */
    try { kok.child('cikis').remove(); } catch (e) { }      /* önceki tahtanın çıkışı geçersiz: Sınıf Ekranı yine açık (26.10.2026) */
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
    /* tek Sınıf Ekranı (21.10.2026): tahta seçimi yok — eski seçim silinir */
    if (CIHAZ === 'bilgisayar') hedefYaz(null);
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
      S.al = /[?&]al=1(?:&|$)/.test(location.search);     /* karekodla «Evet»: kumandayı al (21.10.2026) */
      try { history.replaceState(history.state, '', location.pathname + '?rol=yansit'); } catch (e) { }
      if (S.devam) devamGoster(kd('th.devam_aciliyor', 'Kaldığın yerden açılıyor…'));
      else {
        /* bilgisayar baştan lider: ilk sayfanın tohumu ve köprüsü giriş beklenmeden kurulur */
        S.lider = true;
        CERCEVE.src = hedef;
      }
      belgeIzle();
      baglan(yansitBasla);
      /* kumandanın ekranı kararmasın: dokunuşta kilit yeniden denenir, süre dolunca bırakılır */
      ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (t) {
        document.addEventListener(t, function (e) {
          if (!e.isTrusted) return;
          UYANIK.dokunus = SIMDI();
          if (!UYANIK.k) { UYANIK.hata = 0; uyanikDenetle(); }
        }, true);
      });
      setInterval(uyanikDenetle, 30000);
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
      if (ROL === 'izle' && $('thKPanel')) zKumandaKur();
      var ip = $('thIpucu');
      if (ip && !ip.hidden) ipucuGoster();
    });
  }
  window.KidefTahta = {
    kimlik: KIMLIK, hedefSec: hedefSec, tahtaListesi: tahtaListesi, tahtaAdiYaz: tahtaAdiYaz, cihazAdi: cihazAdi,
    rol: ROL, cihaz: CIHAZ, id: BEN, S: S, Y: Y, Z: Z, yolAl: yolAl, yolBul: yolBul, VT_ADRES: VT_ADRES,
    liderOl: liderOl, lider: function () { return S.lider; },
    arac: function (a) { aracSec(a); return IA.arac; }, IA: IA, IZ: IZ, noktaBilgisi: noktaBilgisi, isaretNokta: isaretNokta,
    kanal: { kur: kanalKur, durum: kanalDurum }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
