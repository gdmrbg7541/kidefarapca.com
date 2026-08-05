/* =====================================================================
   KIDEF · ORTAK ROL ÇÖZÜCÜ            (sistem/rol.js)
   ---------------------------------------------------------------------
   SORUN
   Site "öğretmen mi?" sorusunu her sayfada BAŞKA türlü soruyordu:
     · index (auth.js)              : rol = veri.role || 'student'
     · bilgi yarışması              : rol = veri.role, teacher/admin şart
     · listelerim / öğrenci hesabı  : appState.userRole
   kullanicilar/{uid} belgesinde "role" alanı HİÇ yoksa (eski hesaplar,
   yönetici eliyle açılan hesaplar, kayıt akışının yarıda kalması) öğretmen
   birden "öğrenci" sayılıyor ve bilgi yarışması girişe yönlendiriyordu.

   ÇÖZÜM
   Tek bir çözücü: KidefRol. Rolü sırasıyla şuradan çıkarır:
     1) role alanı  ('admin' / 'teacher' / 'student')
     2) role YOKSA öğretmen izleri:
          · teacherStaticCode  → yalnızca öğretmen hesabında oluşur
                                 (ogrencihesap.js ogretmenKoduSagla,
                                  ogretmenMi() kapısından geçer)
          · userData           → listelerim.js'in sınıf listesi (öğretmen)
     3) bulut okunamazsa (kural/çevrimdışı) bu tarayıcıdaki son çözüm
        (localStorage önbelleği) ve yerel öğretmen izleri
   Ayrıca ONARIR: role alanı eksik ama öğretmen izi varsa, kullanıcının
   KENDİ belgesine {role:'teacher'} merge yazılır; böylece sorun bir daha
   hiçbir sayfada çıkmaz.

   KULLANIM
     KidefRol.rolCoz(veri)              -> 'admin'|'teacher'|'student'
     KidefRol.ogretmenMi(rol|veri)      -> bool
     KidefRol.coz(user, db).then(o)     -> {rol, ogretmen, isim, kaynak, ...}
     KidefRol.onbellekOku(uid)          -> {rol, ogretmen, isim} | null
   ===================================================================== */
(function () {
  'use strict';
  if (window.KidefRol) return;

  var ANAHTAR = 'kidefRolBilgi';
  var OMUR = 90 * 24 * 60 * 60 * 1000;   /* önbellek 90 gün geçerli */

  function yerelAl(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function yerelYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  /* ---------------------------------------------------------------
     1) Belgedeki öğretmen izleri
     --------------------------------------------------------------- */
  function ogretmenIzi(v) {
    if (!v) return '';
    if (v.teacherStaticCode) return 'ogretmenKodu';
    if (v.userData) return 'sinifListesi';
    return '';
  }

  /* Bu tarayıcıda öğretmen olarak çalışıldığına dair iz (bulut okunamazsa) */
  function yerelOgretmenIzi() {
    if (yerelAl('teacher_static_code')) return 'yerelOgretmenKodu';
    try {
      var d = JSON.parse(yerelAl('schoolData') || 'null');
      if (d && d.levels && Object.keys(d.levels).length) return 'yerelSinifListesi';
    } catch (e) { }
    return '';
  }

  /* ---------------------------------------------------------------
     2) Rolü çöz  (yalnız belge verisinden — senkron)
     --------------------------------------------------------------- */
  function rolCoz(v) {
    v = v || {};
    var r = v.role;
    if (r === 'admin') return 'admin';
    if (r === 'teacher') return 'teacher';
    if (r === 'student') return 'student';
    /* role alanı yok / boş / tanınmayan: izlere bak */
    if (!r) return ogretmenIzi(v) ? 'teacher' : 'student';
    return String(r);
  }

  function ogretmenMi(x) {
    var r = (x && typeof x === 'object') ? rolCoz(x) : String(x || '');
    return r === 'teacher' || r === 'admin';
  }

  function isimCoz(v, user) {
    v = v || {};
    if (v.name && v.name !== 'Belirtilmedi') return v.name;
    if (user && user.displayName) return user.displayName;
    if (v.email) return v.email;
    if (user && user.email) return user.email;
    return '';
  }

  /* ---------------------------------------------------------------
     3) Önbellek — sayfalar arası ortak hafıza
     --------------------------------------------------------------- */
  function onbellekYaz(uid, o) {
    if (!uid || !o) return;
    yerelYaz(ANAHTAR, JSON.stringify({
      uid: uid, rol: o.rol, ogretmen: !!o.ogretmen,
      isim: o.isim || '', iz: o.iz || '', t: +new Date()
    }));
  }
  function onbellekOku(uid) {
    var h = null;
    try { h = JSON.parse(yerelAl(ANAHTAR) || 'null'); } catch (e) { return null; }
    if (!h || !h.rol) return null;
    if (uid && h.uid && h.uid !== uid) return null;         /* başka hesap */
    if (h.t && (+new Date() - h.t) > OMUR) return null;     /* bayat */
    return h;
  }
  function onbellekSil() { try { localStorage.removeItem(ANAHTAR); } catch (e) { } }

  /* ---------------------------------------------------------------
     4) Onarım — role alanı eksik ama öğretmen izi varsa yaz
        (kullanıcı KENDİ belgesine yazar; kurallar buna izin verir)
     --------------------------------------------------------------- */
  function onar(user, db, v) {
    if (!user || !db || !v) return Promise.resolve(false);
    if (v.role) return Promise.resolve(false);          /* alan zaten var */
    if (!ogretmenIzi(v)) return Promise.resolve(false); /* öğretmen izi yok */
    try {
      return db.collection('kullanicilar').doc(user.uid)
        .set({ role: 'teacher' }, { merge: true })
        .then(function () {
          try { console.info('[KidefRol] role alanı eksikti, "teacher" olarak onarıldı.'); } catch (e) { }
          return true;
        })
        .catch(function (e) {
          try { console.warn('[KidefRol] role onarılamadı:', e && (e.code || e.message)); } catch (e2) { }
          return false;
        });
    } catch (e) { return Promise.resolve(false); }
  }

  /* ---------------------------------------------------------------
     5) Tam çözüm — buluttan oku, olmazsa önbellek/yerel iz
        Dönen nesne:
          { rol, ogretmen, isim, uid, kaynak, iz, veri, misafir, anonim, hata }
        kaynak: 'bulut' | 'onbellek' | 'yerel' | 'anonim' | 'yok'
     --------------------------------------------------------------- */
  function coz(user, db, sec) {
    sec = sec || {};
    return new Promise(function (bitir) {
      if (!user) {
        bitir({ rol: null, ogretmen: false, isim: '', uid: '', kaynak: 'yok', misafir: true });
        return;
      }
      if (user.isAnonymous) {
        bitir({ rol: null, ogretmen: false, isim: '', uid: user.uid, kaynak: 'anonim', misafir: true, anonim: true });
        return;
      }
      var uid = user.uid;

      function yedek(neden) {
        var h = onbellekOku(uid);
        if (h) {
          bitir({ rol: h.rol, ogretmen: !!h.ogretmen, isim: h.isim || '', uid: uid,
                  kaynak: 'onbellek', iz: h.iz || '', hata: neden });
          return;
        }
        var yi = yerelOgretmenIzi();
        if (yi) {
          bitir({ rol: 'teacher', ogretmen: true, isim: isimCoz(null, user), uid: uid,
                  kaynak: 'yerel', iz: yi, hata: neden });
          return;
        }
        bitir({ rol: null, ogretmen: false, isim: isimCoz(null, user), uid: uid,
                kaynak: 'yok', hata: neden });
      }

      if (!db) { yedek('db-yok'); return; }
      var tamam = false;
      try {
        db.collection('kullanicilar').doc(uid).get().then(function (doc) {
          if (tamam) return; tamam = true;
          if (!doc || !doc.exists) { yedek('belge-yok'); return; }
          var v = doc.data() || {};
          var rol = rolCoz(v);
          var o = {
            rol: rol, ogretmen: (rol === 'teacher' || rol === 'admin'),
            isim: isimCoz(v, user), uid: uid, kaynak: 'bulut',
            iz: v.role ? '' : ogretmenIzi(v), veri: v, rolAlani: v.role || null
          };
          onbellekYaz(uid, o);
          if (o.ogretmen && sec.onar !== false) { try { onar(user, db, v); } catch (e) { } }
          bitir(o);
        }).catch(function (e) {
          if (tamam) return; tamam = true;
          yedek((e && (e.code || e.message)) || 'okuma-hatasi');
        });
      } catch (e) { if (!tamam) { tamam = true; yedek('istisna'); } }
    });
  }

  /* Kısa, kullanıcıya gösterilebilir açıklama (giriş kapısı notları için) */
  function aciklama(o) {
    if (!o) return '';
    if (o.kaynak === 'yok' && o.misafir) return 'Bu tarayıcıda giriş yapılmamış.';
    if (o.anonim) return 'Misafir olarak giriş yapılmış; yönetim için öğretmen/yönetici hesabı gerekli.';
    if (o.ogretmen) return '';
    if (o.kaynak === 'bulut' && o.rolAlani === 'student')
      return 'Bu hesabın rolü “öğrenci”. Yarışmayı yalnızca öğretmen/yönetici yönetebilir.';
    if (o.kaynak === 'bulut' && !o.rolAlani)
      return 'Hesapta rol bilgisi bulunamadı. Ana sayfada bir kez giriş yapman rolü onarır.';
    if (o.hata) return 'Hesap bilgisi okunamadı (' + o.hata + '). İnternet bağlantını kontrol edip tekrar dene.';
    return 'Yarışmayı yalnızca öğretmen/yönetici yönetebilir.';
  }

  window.KidefRol = {
    SURUM: 1,
    ANAHTAR: ANAHTAR,
    rolCoz: rolCoz,
    ogretmenMi: ogretmenMi,
    ogretmenIzi: ogretmenIzi,
    yerelOgretmenIzi: yerelOgretmenIzi,
    isimCoz: isimCoz,
    onbellekYaz: onbellekYaz,
    onbellekOku: onbellekOku,
    onbellekSil: onbellekSil,
    onar: onar,
    coz: coz,
    aciklama: aciklama
  };
})();
