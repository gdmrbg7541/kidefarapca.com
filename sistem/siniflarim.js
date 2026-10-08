/* =====================================================================
   KİDEF · ANASAYFADA "SINIFLARIM" KATEGORİSİ    (sistem/siniflarim.js)
   ---------------------------------------------------------------------
   Öğretmen (06.10.2026): "öğretmen giriş yaptığı zaman imam hatip
   kategorisi gibi bi kategori görünsün anasayfada, + butonu olsun,
   öğretmen basınca 5-10 arası sınıf ekleyebilme, birden fazla kurum
   ekleyebilme, 5-10 arası sınıf girdiğinde her sınıfın listelerine
   ulaşabilme gibi özelliklere sahip olsun — yani sınıflara header
   yerine galeri ve site güncellemelerinin üstünde bi kategori olarak
   hızlıca ulaşabilsin."

   NE YAPAR
     · Anasayfanın EN ÜSTÜNE, "Güncellemeler ve Galeri" bölümünden önce
       bir kategori koyar: başlık + kurum kutuları + sınıf kartları.
     · Sınıf kartına basınca o sınıfın listelerine gider
       (llOkulSinifSec → Listelerim, öğrenciler sekmesi).
     · "+" tuşu 5'ten 10'a seviyeleri gösterir; seviye seçilip şube
       yazılınca o kurumda seviye yoksa açılır, sınıf altına eklenir.
     · "+ Kurum" yeni kurum açar (addKurum); birden çok kurum yan yana.
     · YALNIZ öğretmen ve yöneticiye görünür. Rol Firestore'dan asenkron
       geldiği için kısa aralıklarla yoklanır (sistem/okultusu.js ile
       aynı yöntem) — rol geç gelse de kategori çıkar.

   VERİ: kendi yapısını KURMAZ. Okul penceresi, sınıf seçici ve bu
   kategori aynı `data` üzerinde çalışır (data.kurumlar / data.levels /
   levels[x].classes) ve aynı save() ile yazar. Biri değişince öbürü de
   doğru olur; save() bitiminde bu kategori kendini yeniden çizer.

   BAŞLIKTAKİ OKUL SİMGESİ DURUYOR: bu kategori anasayfadaki hızlı yol,
   okul simgesi ise ders ekranı/sınav paneli gibi başka sayfalardayken
   erişim yolu.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSiniflarim) return;

    var BOLUM_ID = 'siniflarim';
    var SEVIYELER = [5, 6, 7, 8, 9, 10];

    function kac(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* ----------------------------------------------------- ROL KAPISI */
    function misafirMi() {
        try {
            if (typeof appState === 'undefined') return true;
            if (appState.currentUser === 'Misafir Öğrenci') return true;
            var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
            if (u && u.isAnonymous) return true;
            return !u && !appState.userRole;
        } catch (e) { return false; }
    }
    function ogretmenMi() {
        try {
            var r = (typeof appState !== 'undefined' && appState.userRole) || '';
            if (r === 'teacher' || r === 'admin') return true;
            if (window.KidefRol && typeof window.KidefRol.ogretmenMi === 'function') {
                if (window.KidefRol.ogretmenMi(r)) return true;
                if (typeof window.KidefRol.onbellekOku === 'function') {
                    var o = window.KidefRol.onbellekOku();
                    if (o && window.KidefRol.ogretmenMi(o)) return true;
                }
            }
        } catch (e) { }
        return false;
    }
    function gorunurMu() { return !misafirMi() && ogretmenMi(); }

    /* ------------------------------------------- ÇIKIŞTAN SONRA GÖRÜNÜM
       (07.10.2026) Öğretmen: "öğretmen giriş yapınca sınıflarım kısmında
       tüm sınıfları görünüyor ya, eğer çıkarsa da tarayıcı hafızası
       hatırlasın sınıfları, amacımız sınıf defterini ve materyalleri vs
       kullanmak, ama giriş yapınca not verme vb işlemler yapılabilsin."

       Sınıf listesi zaten tarayıcıda duruyor (listelerim.js -> schoolData),
       ama çıkış yapılınca bölüm boş kurum önizlemesine dönüyordu. Artık:
       giriş varsa  -> tam yetki (eskisi gibi)
       çıkış + önbellek -> SALT GÖRÜNÜM: sınıflar, defter ve materyaller
                           açık; ekleme/düzenleme tuşları kapalı, kaydetme
                           listelerim.js tarafında engelli.
       hiç önbellek yok -> eski boş önizleme.
       Önbelleğin bir ÖĞRETMENE ait olduğunu kidefSiniflarimSahip işareti
       söyler; onu listelerim.js, bulut verisi indiğinde yazar. Böylece
       öğrenci/misafir tarayıcısındaki örnek veri "sınıflarım" sanılmaz. */
    var SAHIP_ANAHTAR = 'kidefSiniflarimSahip';

    function oturumVarMi() {
        try { return !!(window.firebase && firebase.auth && firebase.auth().currentUser); }
        catch (e) { return false; }
    }
    function onbellekVarMi() {
        try {
            if (!localStorage.getItem(SAHIP_ANAHTAR)) return false;
            var d = (typeof data !== 'undefined' && data) ? data : null;
            if (!d || !d.levels) return false;
            var l = Object.keys(d.levels);
            for (var i = 0; i < l.length; i++) {
                var c = d.levels[l[i]] && d.levels[l[i]].classes;
                if (c && Object.keys(c).length) return true;
            }
        } catch (e) { }
        return false;
    }
    /* Çıkış yapılmış ama bu tarayıcıda öğretmen sınıfları duruyor. */
    function saltMi() { return !oturumVarMi() && onbellekVarMi(); }

    /* Davet kutusundaki büyük okul: anasayfadaki küçük okul simgesinin
       aynısı değil — kapısı ve bayrağı belirgin, "burası senin okulun"
       desin diye. */
    var BUYUK_OKUL_SVG =
        '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        '<path d="M24 4l19 9.6V17H5v-3.4z" fill="#D84315"/>' +
        '<rect x="8" y="17" width="32" height="25" rx="2.4" fill="#fff" stroke="#C7D0DA" stroke-width="1.6"/>' +
        '<rect x="12" y="21" width="7" height="6" rx="1.2" fill="#FDEBD0" stroke="#E0B37A" stroke-width="1.2"/>' +
        '<rect x="29" y="21" width="7" height="6" rx="1.2" fill="#FDEBD0" stroke="#E0B37A" stroke-width="1.2"/>' +
        '<rect x="19" y="30" width="10" height="12" rx="1.4" fill="#EAF6F3" stroke="#16A085" stroke-width="1.4"/>' +
        '<circle cx="26.4" cy="36" r="1" fill="#16A085"/>' +
        '<path d="M24 4V1.4M24 1.4h5.2l-1.3 1.8 1.3 1.8H24" fill="#16A085"' +
        ' stroke="#16A085" stroke-width="1.1" stroke-linejoin="round"/>' +
        '</svg>';

    /* -------------------------------------------------------- BİÇİMLER */
    function stilKur() {
        if (document.getElementById('sn-stil')) return;
        var s = document.createElement('style');
        s.id = 'sn-stil';
        s.textContent = [
            '#' + BOLUM_ID + '{ display:none; }',
            '#' + BOLUM_ID + '.gor{ display:block; }',
            '#' + BOLUM_ID + ' .sn-kutu{ display:flex; flex-direction:column; gap:14px; }',
            /* kurum kutusu */
            '#' + BOLUM_ID + ' .sn-kurum{ background:#fff; border:1px solid #E3E8EF; border-radius:16px;',
            '  padding:14px 16px 16px; box-shadow:0 6px 18px rgba(31,36,48,.07); }',
            '#' + BOLUM_ID + ' .sn-kurum-bas{ display:flex; align-items:center; gap:9px; margin:0 0 12px; }',
            '#' + BOLUM_ID + ' .sn-kurum-bas svg{ width:22px; height:22px; flex:0 0 auto; }',
            '#' + BOLUM_ID + ' .sn-kurum-ad{ font-weight:800; color:#1F2430; font-size:1.02rem; }',
            '#' + BOLUM_ID + ' .sn-kurum-say{ margin-inline-start:auto; font-size:.78rem; font-weight:800;',
            '  color:#8A93A0; background:#F2F5F9; border-radius:999px; padding:3px 10px; }',
            /* sınıf kartları */
            '#' + BOLUM_ID + ' .sn-siniflar{ display:flex; flex-wrap:wrap; gap:10px; }',
            '#' + BOLUM_ID + ' .sn-sinif{ display:flex; align-items:center; gap:10px; cursor:pointer;',
            '  text-decoration:none;',   /* kart bir <a>: alt çizgi olmasın */
            '  border:1px solid #E3E8EF; background:#F7F9FC; border-radius:13px; padding:10px 15px 10px 11px;',
            '  font-family:inherit; font-weight:700; color:#1F2430; font-size:.95rem;',
            '  transition:background .15s, border-color .15s, transform .12s, box-shadow .15s; }',
            '#' + BOLUM_ID + ' .sn-sinif:hover{ background:#EAF6F3; border-color:#16A085; color:#0E7C66;',
            '  transform:translateY(-2px); box-shadow:0 6px 14px rgba(22,160,133,.18); }',
            '#' + BOLUM_ID + ' .sn-sv{ width:30px; height:30px; flex:0 0 auto; display:flex; align-items:center;',
            '  justify-content:center; border-radius:9px; background:#16A085; color:#fff;',
            '  font-weight:800; font-size:.9rem; }',
            '#' + BOLUM_ID + ' .sn-ogr{ font-size:.76rem; font-weight:800; color:#8A93A0;',
            '  background:#EDF1F6; border-radius:999px; padding:2px 8px; }',
            '#' + BOLUM_ID + ' .sn-sinif:hover .sn-ogr{ background:#D9EDE7; color:#0E7C66; }',
            /* SALT GÖRÜNÜM (07.10.2026): çıkış sonrası sınıflar açık ama
               ekleme/düzenleme tuşları kapalı. */
            /* BEYAZ LİSTE: okul penceresinde yalnız SINIF KAPILARI ve
               pencere kapatma kalır; ekleme/silme/ayar tuşlarının hepsi
               gider. Kara liste yazsaydık yarın eklenen bir tuş açıkta
               kalırdı — burada varsayılan "kapalı". */
            '#' + BOLUM_ID + '.sn-salt .sn-ekle-tus,',
            '#' + BOLUM_ID + '.sn-salt .sn-ekle,',
            /* "Sınıf ekle" tuşu da .okul-kapi taşıyor (kapı görünümlü);
               beyaz listeden ayrıca çıkarılması gerekiyor. */
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup .okul-ekle,',
            /* "Seviye ekle" katı bir DIV; tuş beyaz listesine takılmıyor. */
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup .okul-kat-ekle,',
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup .okul-arsa-tus,',
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup button:not(.okul-kapi):not(.okul-kapat),',
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup a:not(.okul-kapi):not(.okul-kapat),',
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup input,',
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup select,',
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup textarea{ display:none !important; }',
            /* Kat başlıkları artık tıklanmıyor: imleç de öyle desin. */
            '#' + BOLUM_ID + '.sn-salt #llOkulPopup [contenteditable]{ pointer-events:none; }',
            '#' + BOLUM_ID + ' .sn-salt-serit{ display:flex; align-items:center; gap:10px;',
            '  flex-wrap:wrap; margin:0 0 12px; padding:9px 13px; border-radius:12px;',
            '  background:#FEF6E7; border:1px solid #F6D08A; }',
            '#' + BOLUM_ID + ' .sn-salt-serit .sns-kilit{ width:22px; height:22px; flex:0 0 auto; }',
            '#' + BOLUM_ID + ' .sn-salt-serit .sns-yazi{ flex:1 1 220px; font-size:.9rem;',
            '  font-weight:600; color:#7A5B12; line-height:1.4; }',
            '#' + BOLUM_ID + ' .sn-salt-serit .sns-yazi b{ color:#5C430A; }',
            '#' + BOLUM_ID + ' .sn-salt-serit .sns-giris{ display:inline-flex; align-items:center;',
            '  gap:6px; cursor:pointer; border:0; border-radius:10px; padding:8px 14px;',
            '  background:#16A085; color:#fff; font-family:inherit; font-weight:800;',
            '  font-size:.88rem; transition:background .15s, transform .12s; }',
            '#' + BOLUM_ID + ' .sn-salt-serit .sns-giris:hover{ background:#0E7C66; transform:translateY(-1px); }',
            '#' + BOLUM_ID + ' .sn-salt-serit .sns-giris svg{ width:18px; height:18px; }',
            /* ekleme tuşları */
            '#' + BOLUM_ID + ' .sn-ekle{ display:flex; align-items:center; gap:7px; cursor:pointer;',
            '  border:2px dashed #CBD5E1; background:transparent; border-radius:13px; padding:10px 16px;',
            '  font-family:inherit; font-weight:800; color:#7A8595; font-size:.93rem;',
            '  transition:background .15s, border-color .15s, color .15s; }',
            '#' + BOLUM_ID + ' .sn-ekle:hover{ background:#EAF6F3; border-color:#16A085; color:#0E7C66; }',
            '#' + BOLUM_ID + ' .sn-ekle svg{ width:16px; height:16px; }',
            '#' + BOLUM_ID + ' .sn-kurum-ekle{ align-self:flex-start; cursor:pointer; font-family:inherit;',
            '  font-weight:800; font-size:.93rem; color:#B9651A; background:rgba(255,255,255,.65);',
            '  border:2px dashed #E0B37A; border-radius:13px; padding:11px 20px;',
            '  transition:background .15s, border-color .15s, color .15s; }',
            '#' + BOLUM_ID + ' .sn-kurum-ekle:hover{ background:#FFF6EC; border-color:#E67E22; color:#8E4B10; }',
            /* boş durum */
            '#' + BOLUM_ID + ' .sn-bos{ color:#8A93A0; font-size:.92rem; margin:0 0 12px; }',
            /* OKUL PANELİ İÇERİDE (06.10.2026) — pencere gibi değil,
               bölümün içeriği gibi dursun. display:contents ile kutusu
               kalmıyor: tam ekran karartması, sabit konum ve "boşluğa
               basınca kapan" davranışı da böylece ortadan kalkıyor. */
            '#' + BOLUM_ID + ' .sn-okul{ display:block; }',
            '#' + BOLUM_ID + ' #llOkulPopup.sn-okul-ici{ display:contents !important; }',
            '#' + BOLUM_ID + ' .sn-okul-ici .okul-panel{ max-width:none !important;',
            '  max-height:none !important; width:100%; border-radius:16px;',
            '  box-shadow:0 6px 18px rgba(31,36,48,.07) !important; }',
            '#' + BOLUM_ID + ' .sn-okul-ici .okul-baslik{ display:none !important; }',
            '#' + BOLUM_ID + ' .sn-okul-ici .okul-icerik{ overflow:visible !important;',
            '  padding:22px 18px 24px; }',
            /* ÖNİZLEME (misafir): tıklanabilir ama işlevsiz — hepsi
               tavsiye penceresini açıyor. Soluk ve "yarım" dursun ki
               gerçek panelle karışmasın. */
            '#' + BOLUM_ID + ' .sn-onizle{ cursor:pointer; opacity:.9; }',
            '#' + BOLUM_ID + ' .sn-onizle button{ pointer-events:none; }',
            '#' + BOLUM_ID + ' .sn-onizle .okul-panel{ position:relative; }',
            /* giriş tavsiyesi penceresi */
            '#snGirisTavsiye{ position:fixed; inset:0; z-index:10090;',
            '  background:rgba(31,36,48,.42); display:flex; align-items:center;',
            '  justify-content:center; padding:18px; }',
            '#snGirisTavsiye .sngt-kart{ position:relative; background:#fff;',
            '  border-radius:18px; padding:30px 26px 24px; max-width:460px; width:100%;',
            '  text-align:center; box-shadow:0 22px 60px rgba(0,0,0,.3);',
            '  display:flex; flex-direction:column; align-items:center; gap:4px;',
            '  animation:sngtGir .22s ease; }',
            '@keyframes sngtGir{ from{ opacity:0; transform:translateY(10px) scale(.98) } }',
            '#snGirisTavsiye .sngt-kart svg{ width:64px; height:64px; margin-bottom:6px; }',
            '#snGirisTavsiye .sngt-bas{ margin:0; font-weight:800; font-size:1.14rem;',
            '  color:#1F2430; }',
            '#snGirisTavsiye .sngt-alt{ margin:6px 0 16px; color:#5B6471; font-size:.97rem;',
            '  line-height:1.55; }',
            '#snGirisTavsiye .sngt-alt b{ color:#1F2430; }',
            '#snGirisTavsiye .sngt-tus{ border:0; cursor:pointer; font-family:inherit;',
            '  font-weight:800; font-size:1rem; color:#fff; background:#16A085;',
            '  border-radius:12px; padding:11px 26px; }',
            '#snGirisTavsiye .sngt-tus:hover{ background:#0E7C66; }',
            /* TAVSİYEDEKİ GİRİŞ TUŞU (07.10.2026): asıl iş bu, bu yüzden
               dolgun yeşil ve simgesi başlıktaki tuşun aynısı. Sitenin
               genel tuş biçimleri araya girmesin diye değerler açıkça
               yazıldı. "Anladım" ikinci planda kalsın diye sade. */
            '#snGirisTavsiye .sngt-giris{ display:inline-flex; align-items:center;',
            '  justify-content:center; gap:10px; border:0; background:#16A085;',
            '  color:#fff; cursor:pointer; font-family:inherit; font-weight:800;',
            '  font-size:1.02rem; padding:13px 28px; border-radius:12px;',
            '  margin:2px 0 0; box-shadow:0 6px 16px rgba(22,160,133,.28);',
            '  transition:background .15s, transform .15s; }',
            '#snGirisTavsiye .sngt-giris svg{ width:21px; height:21px; flex:none; }',
            '#snGirisTavsiye .sngt-giris:hover{ background:#0E7C66;',
            '  transform:translateY(-1px); }',
            '#snGirisTavsiye .sngt-giris:active{ transform:scale(.98); }',
            '#snGirisTavsiye .sngt-nerede{ margin:10px 0 2px; color:#8A93A0;',
            '  font-size:.84rem; }',
            '#snGirisTavsiye .sngt-nerede + .sngt-tus{ background:none; color:#7A838F;',
            '  font-weight:700; font-size:.92rem; padding:8px 18px; margin-top:6px; }',
            '#snGirisTavsiye .sngt-nerede + .sngt-tus:hover{ background:rgba(0,0,0,.05);',
            '  color:#4A525E; }',
            '@media (prefers-reduced-motion: reduce){',
            '  #snGirisTavsiye .sngt-giris{ transition:none } }',
            '#snGirisTavsiye .sngt-kapat{ position:absolute; top:10px; inset-inline-end:12px;',
            '  border:0; background:none; cursor:pointer; font-size:26px; line-height:1;',
            '  color:#8A93A0; padding:2px 6px; }',
            '#snGirisTavsiye .sngt-kapat:hover{ color:#1F2430; }',
            /* AKORDİYON: kapalıyken panel gizli, ok sola dönük */
            '#' + BOLUM_ID + '.sn-kapali .sn-okul{ display:none; }',
            '#' + BOLUM_ID + ' .sn-okul{ animation:snAc .22s ease; }',
            '@keyframes snAc{ from{ opacity:0; transform:translateY(-5px) } }',
            '#' + BOLUM_ID + ' .sn-bas-ok{ transform:rotate(0deg);',
            '  transition:transform .18s ease, opacity .15s ease; }',
            '#' + BOLUM_ID + ' .sn-bas-tus:hover .sn-bas-ok{ opacity:.9; transform:rotate(0deg); }',
            '#' + BOLUM_ID + '.sn-kapali .sn-bas-ok,',
            '#' + BOLUM_ID + '.sn-kapali .sn-bas-tus:hover .sn-bas-ok{ transform:rotate(-90deg); }',
            '@media (prefers-reduced-motion: reduce){',
            '  #' + BOLUM_ID + ' .sn-okul{ animation:none }',
            '  #' + BOLUM_ID + ' .sn-bas-ok{ transition:none } }',
            /* başlık tuşu: kategori başlığı okulu açıyor */
            '#' + BOLUM_ID + ' .sn-bas-tus{ display:inline-flex; align-items:center;',
            '  gap:9px; border:0; background:none; cursor:pointer; padding:2px 6px 2px 0;',
            '  font:inherit; color:inherit; border-radius:10px;',
            '  transition:background .15s; }',
            '#' + BOLUM_ID + ' .sn-bas-tus:hover{ background:rgba(22,160,133,.09); }',
            '#' + BOLUM_ID + ' .sn-bas-ok{ width:17px; height:17px; opacity:.45;',
            '  transition:transform .15s, opacity .15s; }',
            '#' + BOLUM_ID + ' .sn-bas-tus:hover .sn-bas-ok{ opacity:.9;',
            '  transform:translateX(2px); }',
            /* BAŞLIK SATIRI + "SINIF EKLE" (07.10.2026) — kategori kapalıyken
               de görünsün diye başlığın yanında, akordiyonun dışında. */
            '#' + BOLUM_ID + ' h2.sn-bas{ display:flex; align-items:center;',
            '  gap:10px; flex-wrap:wrap; }',
            /* ÖĞRETMEN ADI (08.10.2026) — öğretmen: "giriş yapınca
               Sınıflarım kategorisinde öğretmenin kendi ismi soyismi
               olsun Sınıflarım yazısının yanında, şık bi kutu veya
               ayırıcı olsun". İnce dikey ayırıcı + yuvarlak rozet. */
            '#' + BOLUM_ID + ' .sn-ogretmen{ display:none; align-items:center; gap:11px; }',
            '#' + BOLUM_ID + ' .sn-ogretmen.gor{ display:inline-flex; }',
            '#' + BOLUM_ID + ' .sn-ogretmen-ayrac{ width:2px; height:24px; border-radius:2px;',
            '  background:linear-gradient(180deg, rgba(22,160,133,0), rgba(22,160,133,.42), rgba(22,160,133,0)); }',
            '#' + BOLUM_ID + ' .sn-ogretmen-kutu{ display:inline-flex; align-items:center; gap:8px;',
            '  padding:6px 15px 6px 11px; border-radius:999px; border:1px solid rgba(22,160,133,.30);',
            '  background:linear-gradient(135deg,#EAF7F3 0%,#F6FCFA 100%);',
            '  box-shadow:0 2px 9px rgba(22,160,133,.13); }',
            '#' + BOLUM_ID + ' .sn-ogretmen-kutu svg{ width:17px; height:17px; flex:0 0 auto; color:#16A085; }',
            '#' + BOLUM_ID + ' .sn-ogretmen-ad{ font-size:.87rem; font-weight:800; color:#11806A;',
            '  letter-spacing:.2px; white-space:nowrap; }',
            '@media (max-width:620px){',
            '  #' + BOLUM_ID + ' .sn-ogretmen-ayrac{ display:none; }',
            '  #' + BOLUM_ID + ' .sn-ogretmen-kutu{ padding:5px 12px 5px 9px; }',
            '  #' + BOLUM_ID + ' .sn-ogretmen-ad{ font-size:.8rem; } }',
            '#' + BOLUM_ID + ' .sn-ekle-tus{ display:inline-flex; align-items:center;',
            '  gap:6px; cursor:pointer; font-family:inherit; font-weight:700;',
            '  font-size:.82rem; line-height:1; color:#16A085; padding:7px 13px 7px 10px;',
            '  border:1px dashed rgba(22,160,133,.55); border-radius:999px;',
            '  background:rgba(22,160,133,.07); transition:background .15s,',
            '  border-color .15s, transform .15s; }',
            '#' + BOLUM_ID + ' .sn-ekle-tus svg{ width:15px; height:15px; }',
            '#' + BOLUM_ID + ' .sn-ekle-tus:hover{ background:rgba(22,160,133,.15);',
            '  border-color:#16A085; transform:translateY(-1px); }',
            '#' + BOLUM_ID + ' .sn-ekle-tus:active{ transform:scale(.97); }',
            '@media (max-width:600px){',
            '  #' + BOLUM_ID + ' .sn-ekle-tus{ font-size:.76rem; padding:6px 11px 6px 9px } }',
            '@media (prefers-reduced-motion: reduce){',
            '  #' + BOLUM_ID + ' .sn-ekle-tus{ transition:none } }',
            /* HİÇ KURUM YOKKEN ÇIKAN DAVET */
            '#' + BOLUM_ID + ' .sn-davet{ background:#fff; border:1px dashed #C7D0DA;',
            '  border-radius:16px; padding:26px 20px 22px; text-align:center;',
            '  display:flex; flex-direction:column; align-items:center; gap:4px; }',
            '#' + BOLUM_ID + ' .sn-davet svg{ width:62px; height:62px; margin-bottom:6px; }',
            '#' + BOLUM_ID + ' .sn-davet-bas{ margin:0; font-weight:800; font-size:1.08rem;',
            '  color:#1F2430; }',
            '#' + BOLUM_ID + ' .sn-davet-alt{ margin:0 0 12px; color:#5B6471; font-size:.94rem;',
            '  max-width:46ch; line-height:1.45; }',
            '#' + BOLUM_ID + ' .sn-davet-tus{ border:0; cursor:pointer; font-family:inherit;',
            '  font-weight:800; font-size:1rem; color:#fff; background:#16A085;',
            '  border-radius:12px; padding:11px 22px;',
            '  box-shadow:0 4px 12px rgba(22,160,133,.28);',
            '  transition:transform .12s, box-shadow .15s; }',
            '#' + BOLUM_ID + ' .sn-davet-tus:hover{ transform:translateY(-1px);',
            '  box-shadow:0 7px 16px rgba(22,160,133,.34); }',
            '#' + BOLUM_ID + ' .sn-davet-ikinci{ margin-top:8px; border:0; background:none;',
            '  cursor:pointer; font-family:inherit; font-size:.9rem; color:#5B6471;',
            '  text-decoration:underline; text-underline-offset:3px; padding:4px 6px; }',
            '#' + BOLUM_ID + ' .sn-davet-ikinci:hover{ color:#1F2430; }',
            /* seviye seçici */
            '#snSeviye{ position:fixed; inset:0; z-index:10060; background:rgba(31,36,48,.28); }',
            '#snSeviye .sns-panel{ position:fixed; background:#fff; border:1px solid #E3E8EF;',
            '  border-radius:16px; box-shadow:0 18px 44px rgba(31,36,48,.2); padding:14px; min-width:250px; }',
            '#snSeviye .sns-bas{ font-size:.76rem; font-weight:800; letter-spacing:.04em; text-transform:uppercase;',
            '  color:#8A93A0; margin:0 2px 10px; }',
            '#snSeviye .sns-izgara{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }',
            '#snSeviye .sns-tus{ cursor:pointer; border:1px solid #E3E8EF; background:#F7F9FC; border-radius:11px;',
            '  padding:12px 0; font-family:inherit; font-weight:800; font-size:1rem; color:#1F2430;',
            '  transition:background .14s, border-color .14s, color .14s, transform .1s; }',
            '#snSeviye .sns-tus:hover{ background:#16A085; border-color:#0E7C66; color:#fff; transform:translateY(-1px); }',
            '#snSeviye .sns-baska{ grid-column:1 / -1; background:#fff; border-style:dashed; color:#7A8595; font-size:.9rem; }',
            '#snSeviye .sns-baska:hover{ background:#EAF6F3; border-color:#16A085; color:#0E7C66; }',
            '@media (max-width:620px){',
            '  #' + BOLUM_ID + ' .sn-sinif{ font-size:.9rem; padding:9px 13px 9px 10px; }',
            '}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------- SİMGELER */
    var OKUL_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#c0392b"/>' +
        '<path d="M4.4 8.8h15.2v12.6H4.4z" fill="#ecf0f1" stroke="#90A4AE" stroke-width=".9"/>' +
        '<rect x="10.2" y="14.4" width="3.6" height="7" fill="#8d6e63"/>' +
        '<g fill="#3498db"><rect x="6" y="11.4" width="3" height="3" rx=".5"/>' +
        '<rect x="15" y="11.4" width="3" height="3" rx=".5"/>' +
        '<rect x="6" y="16.4" width="3" height="3" rx=".5"/>' +
        '<rect x="15" y="16.4" width="3" height="3" rx=".5"/></g></svg>';
    var ARTI_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 5.4v13.2M5.4 12h13.2" fill="none" stroke="currentColor"' +
        ' stroke-width="2.6" stroke-linecap="round"/></svg>';

    /* ------------------------------------------------------- VERİ OKUMA
       Seviye adının başındaki sayı kart rozetine yazılır ("5. Sınıflar"
       → 5). Sayı yoksa rozet seviyenin ilk harfini gösterir. */
    function seviyeRakami(ad) {
        var m = String(ad || '').match(/\d+/);
        return m ? m[0] : String(ad || '?').trim().charAt(0).toLocaleUpperCase('tr-TR');
    }

    function veriOku() {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return null;
        var kurumlar = d.kurumlar || {};
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
        var gruplar = {};                 /* kurumId ('' = Genel) -> [sınıf] */
        sira.forEach(function (lId) {
            var lvl = d.levels[lId];
            if (!lvl) return;
            var g = (lvl.kurumId && kurumlar[lvl.kurumId]) ? lvl.kurumId : '';
            var cIds = lvl.classes ? Object.keys(lvl.classes) : [];
            cIds.forEach(function (cId) {
                (gruplar[g] = gruplar[g] || []).push({
                    lId: lId, cId: cId,
                    ad: (lvl.classes[cId] || {}).name || '',
                    rakam: seviyeRakami(lvl.name),
                    ogrenci: ((lvl.classes[cId] || {}).students || []).length
                });
            });
            if (!gruplar[g]) gruplar[g] = [];      /* sınıfsız seviye de kurumu görünür kılsın */
        });
        return { kurumlar: kurumlar, gruplar: gruplar };
    }

    /* ---------------------------------------------------------- ÇİZİM */
    function kurumKutusu(kId, ad, siniflar) {
        var h = '<div class="sn-kurum">' +
            '<div class="sn-kurum-bas">' + OKUL_SVG +
            '<span class="sn-kurum-ad">' + kac(ad) + '</span>' +
            (siniflar.length ? '<span class="sn-kurum-say">' + siniflar.length + ' sınıf</span>' : '') +
            '</div>';
        if (!siniflar.length) {
            h += '<p class="sn-bos">Bu kurumda henüz sınıf yok.</p>';
        }
        h += '<div class="sn-siniflar">';
        siniflar.forEach(function (s) {
            /* YENİ SEKMEDE AÇILSIN (06.10.2026) — öğretmen: "sınıf
               listesine tıklayınca ayrı sekmede açılsın". Kart <button>
               değil GERÇEK BAĞLANTI: böylece orta tuş, Ctrl+tık ve
               "bağlantıyı kopyala" da çalışıyor. Adresi sinifbag.js
               üretiyor; o dosya yüklenmediyse eski davranışa düşülür. */
            var bag = (window.KidefSinifBag && KidefSinifBag.adres)
                ? KidefSinifBag.adres(s.lId, s.cId) : '';
            if (bag) {
                h += '<a class="sn-sinif" href="' + kac(bag) + '"' +
                    ' target="_blank" rel="noopener"' +
                    ' title="' + kac(s.ad) + ' listelerini yeni sekmede aç">' +
                    '<span class="sn-sv">' + kac(s.rakam) + '</span>' +
                    '<span class="sn-ad">' + kac(s.ad) + '</span>' +
                    (s.ogrenci ? '<span class="sn-ogr">' + s.ogrenci + '</span>' : '') +
                    '</a>';
            } else {
                h += '<button type="button" class="sn-sinif"' +
                    ' onclick="KidefSiniflarim.ac(\'' + kac(s.lId) + '\',\'' + kac(s.cId) + '\')"' +
                    ' title="' + kac(s.ad) + ' listelerini aç">' +
                    '<span class="sn-sv">' + kac(s.rakam) + '</span>' +
                    '<span class="sn-ad">' + kac(s.ad) + '</span>' +
                    (s.ogrenci ? '<span class="sn-ogr">' + s.ogrenci + '</span>' : '') +
                    '</button>';
            }
        });
        h += '<button type="button" class="sn-ekle"' +
            ' onclick="KidefSiniflarim.seviyeSec(this,\'' + kac(kId || 'GENEL') + '\')"' +
            ' title="Bu kuruma sınıf ekle">' + ARTI_SVG + '<span>Sınıf ekle</span></button>';
        h += '</div></div>';
        return h;
    }

    /* ==================================================== TEK ÇİZİM
       (07.10.2026) Öğretmen: "index ilk açıldığında önce sınıflarım
       çizilmiyor, sonra çiziliyor, sonra kaybolup bir daha çiziliyor."

       Sebebi: bölüm iki ayrı yerden, iki ayrı HTML ile kuruluyordu —
       misafir için onizlemeCiz(), öğretmen için ciz(). Rol birkaç yüz
       milisaniye sonra geldiği için sayfa önce önizlemeyi basıyor,
       rol gelince TAMAMINI silip baştan yazıyordu; arada rol bir an
       boş okunursa nabız gizle() ile bölümü tümden kaldırıyordu.
       Gözle görülen üç aşama buydu.

       Artık BAŞLIK bir kez kuruluyor ve bir daha silinmiyor; yalnız
       içindeki gövde (.sn-okul) değişiyor. Gövde de kapalı açılan
       akordiyonun içinde olduğu için değişimi görünmüyor: ekranda tek
       bir çizim var.

       Öğretmen: "giriş yapılıp yapılmaması önemli değil, her zaman
       görünecek." Bölüm artık role bakmadan herkese açılıyor; rol
       yalnız gövdenin ne göstereceğini belirliyor — öğretmene gerçek
       okul paneli, diğerlerine boş kurum önizlemesi. */
    /* BAŞLIK DURUMA BAĞLI DEĞİL (07.10.2026) — öğretmen: "sınıf
       kategorisini açınca sınıfların yazdığı kaybolup tekrar görünüyor,
       kapattığımda da aynı şekilde."
       Sebebi: aria-expanded ve title başlık HTML'inin İÇİNDE üretiliyordu.
       Akordiyon açılıp kapandığında üretilen metin değişiyor, kabuk da
       "başlık değişmiş" sanıp innerHTML'i baştan yazıyordu; içerideki
       gerçek okul paneli siliniyor, hemen ardından geri konuyordu —
       sınıf adlarının kaybolup gelmesi buydu.
       Artık başlığın HTML'i hiç değişmiyor; açık/kapalı bilgisi DOM'a
       öznitelik olarak işleniyor (baslikDurum). Böylece akordiyon
       çalışırken gövdeye hiç dokunulmuyor. */
    function baslikIc() {
        return '<h2 class="sn-bas">' +
            '<button type="button" class="sn-bas-tus"' +
            ' onclick="KidefSiniflarim.katla()">' +
            '<svg class="kbas" viewBox="0 0 24 24" aria-hidden="true">' +
            OKUL_SVG.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
            '</svg><span>Sınıflarım</span>' +
            '<svg class="sn-bas-ok" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor"' +
            ' stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg></button>' +
            /* Öğretmenin adı: içi isimYaz() ile doldurulur, isim yoksa
               kutu hiç görünmez (çıkışta, misafirde boş kalır). */
            '<span class="sn-ogretmen"></span>' +
            /* SINIF EKLE BAŞLIKTA (07.10.2026) — öğretmen: "sınıflar
               kategorisi kapalıyken bile sınıf ekle başlığın yanında
               görünsün". Kategori kapalıyken de duruyor: basınca kategori
               açılıyor ve seviye/sınıf ekleme satırına iniyor. */
            '<button type="button" class="sn-ekle-tus"' +
            ' onclick="KidefSiniflarim.sinifEkle()"' +
            ' title="Seviye ve sınıf ekle">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor"' +
            ' stroke-width="2.6" stroke-linecap="round"/></svg>' +
            '<span>Sınıf ekle</span></button>' +
            '</h2>';
    }

    /* ------------------------------------------------- ÖĞRETMENİN ADI
       Ad birkaç yerden gelebiliyor ve hepsi ASENKRON dolduğu için her
       çizimde ve nabızda yeniden okunur. E-posta ad değildir: '@'
       geçen değer kutuya yazılmaz, kutu gizli kalır. */
    var KISI_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
        '<path d="M4.8 20c.6-3.8 3.6-6 7.2-6s6.6 2.2 7.2 6" fill="none"' +
        ' stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';

    function temizAd(x) {
        var a = String(x == null ? '' : x).trim();
        if (!a) return '';
        if (a.indexOf('@') >= 0) return '';                  /* e-posta */
        if (a === 'Belirtilmedi' || a === 'Öğrenci') return '';
        if (a === 'Misafir Öğrenci' || a === 'Anonim') return '';
        return a;
    }
    function ogretmenAdi() {
        var a = '';
        try { a = temizAd(window.KidefOgretmenAdi); } catch (e) { }
        if (!a) { try { a = temizAd(window.appState && appState.currentUserName); } catch (e) { } }
        if (!a) {
            try {
                var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
                a = temizAd(u && u.displayName);
            } catch (e) { }
        }
        if (!a) {
            try {
                if (window.KidefRol && typeof KidefRol.onbellekOku === 'function') {
                    var o = KidefRol.onbellekOku();
                    a = temizAd(o && o.isim);
                }
            } catch (e) { }
        }
        return a;
    }
    function isimYaz(bolum) {
        var b = bolum || document.getElementById(BOLUM_ID);
        if (!b) return;
        var kutu = b.querySelector('.sn-ogretmen');
        if (!kutu) return;
        var ad = oturumVarMi() ? ogretmenAdi() : '';
        if (!ad) {
            if (kutu.className.indexOf('gor') >= 0) { kutu.className = 'sn-ogretmen'; kutu.innerHTML = ''; }
            return;
        }
        if (kutu.getAttribute('data-ad') === ad) return;      /* değişmediyse dokunma */
        kutu.setAttribute('data-ad', ad);
        kutu.className = 'sn-ogretmen gor';
        kutu.innerHTML =
            '<span class="sn-ogretmen-ayrac" aria-hidden="true"></span>' +
            '<span class="sn-ogretmen-kutu" title="Giriş yapan öğretmen">' +
            KISI_SVG + '<span class="sn-ogretmen-ad">' + kac(ad) + '</span></span>';
    }

    /* Açık/kapalı bilgisini DOM'a işler — HTML'i yeniden üretmeden. */
    function baslikDurum(bolum) {
        var kapali = kapaliMi();
        bolum.classList.toggle('sn-kapali', kapali);
        try { isimYaz(bolum); } catch (e) { }
        var t = bolum.querySelector('.sn-bas-tus');
        if (!t) return;
        t.setAttribute('aria-expanded', kapali ? 'false' : 'true');
        t.title = kapali ? 'Sınıflarımı aç' : 'Sınıflarımı kapat';
    }

    /* Bölümü ve başlığı kurar; zaten duruyorsa DOKUNMAZ. */
    function kabukKur() {
        var bolum = document.getElementById(BOLUM_ID);
        if (!bolum) {
            stilKur();
            bolum = document.createElement('section');
            bolum.id = BOLUM_ID;
            bolum.className = 'content-section';
            /* ÇAPA #imam-hatip (06.10.2026): «Sınıfta Yeni» + Galeri bölümü
               İmam Hatip'in altına taşındı; eski çapa (#guncellemeler)
               korunsaydı Sınıflarım da onunla birlikte aşağı inerdi.
               Sınıflarım en üstte, kataloğun altında kalmalı. */
            var once = document.getElementById('imam-hatip') ||
                       document.getElementById('guncellemeler');
            if (once && once.parentNode) once.parentNode.insertBefore(bolum, once);
            else {
                var hub = document.getElementById('home-hub-section');
                if (!hub) return null;
                hub.insertBefore(bolum, hub.firstChild);
            }
        }
        var b = baslikIc();
        if (bolum.__sonBaslik !== b) {
            bolum.innerHTML = b + '<div class="sn-okul"></div>';
            bolum.__sonBaslik = b;
            bolum.__govde = null;
        }
        bolum.classList.add('gor');
        baslikDurum(bolum);
        return bolum;
    }

    /* Gövde: boş kurum önizlemesi (giriş yapmamış ya da öğretmen değil).
       Gerçek panel içerideyse çıkarılıyor — eski öğretmenin sınıf adları
       çıkıştan sonra ekranda durmasın. */
    function onizlemeGovde(bolum) {
        if (bolum.__govde === 'onizle') return;
        var yuva = bolum.querySelector('.sn-okul');
        if (!yuva) return;
        try { if (window.KidefSinifBag) window.KidefSinifBag.icerde = false; } catch (e) { }
        yuva.innerHTML = '<div id="llOkulPopup" class="sn-okul-ici sn-onizle"' +
            ' onclick="KidefSiniflarim.girisTavsiye()">' + onizlemeIc() + '</div>';
        bolum.__govde = 'onizle';
        gosterildi = false;            /* bu önizleme; çıkış nabzı silmesin */
    }

    function ciz() {
        var bolum = kabukKur();
        if (!bolum) return;
        if (!gorunurMu()) {
            /* SALT GÖRÜNÜM (07.10.2026): çıkış yapılmış ama sınıflar
               tarayıcıda duruyor — gerçek paneli göster, yazma kapalı. */
            if (saltMi()) {
                bolum.classList.add('sn-salt');
                bolum.__govde = 'gercek';
                okulIcineKoy(bolum);
                saltSerit(bolum);
                return;
            }
            bolum.classList.remove('sn-salt');
            onizlemeGovde(bolum);
            return;
        }
        bolum.classList.remove('sn-salt');
        saltSeritSil(bolum);
        gosterildi = true;
        bolum.__govde = 'gercek';
        okulIcineKoy(bolum);
    }

    /* Panelin üstünde duran kısa şerit: neyin açık neyin kapalı olduğunu
       söyler, yanında da giriş tuşu durur. */
    function saltSerit(bolum) {
        var yuva = bolum.querySelector('.sn-okul');
        if (!yuva || yuva.querySelector('.sn-salt-serit')) return;
        var s = document.createElement('div');
        s.className = 'sn-salt-serit';
        s.innerHTML =
            '<svg class="sns-kilit" viewBox="0 0 24 24" aria-hidden="true">' +
            '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2" fill="#F39C12"/>' +
            '<path d="M8.4 10.5V8a3.6 3.6 0 0 1 7.2 0v2.5" fill="none"' +
            ' stroke="#D68910" stroke-width="2" stroke-linecap="round"/>' +
            '<circle cx="12" cy="15" r="1.5" fill="#fff"/></svg>' +
            '<span class="sns-yazi">Çıkış yapıldı. Sınıf defteri ve materyaller' +
            ' açık; <b>not verme ve kaydetme kapalı</b>.</span>' +
            '<button type="button" class="sns-giris">' + GIRIS_SVG +
            '<span>Giriş yap</span></button>';
        s.addEventListener('click', function (e) {
            if (!e.target.closest || !e.target.closest('.sns-giris')) return;
            try { if (typeof showLoginModal === 'function') showLoginModal(); } catch (e2) { }
        });
        yuva.insertBefore(s, yuva.firstChild);
    }
    function saltSeritSil(bolum) {
        var s = bolum && bolum.querySelector('.sn-salt-serit');
        if (s && s.parentNode) s.parentNode.removeChild(s);
    }

    /* ------------------------------------------------- ÖNİZLEME (misafir)
       Giriş yapmamış ziyaretçi boş bir kurum görüyor; neye basarsa bassın
       girişin neden gerektiğini anlatan kısa bir tavsiye çıkıyor. Gerçek
       veriye hiç dokunulmuyor — bu çizim tamamen durağan. */
    function onizlemeIc() {
        var rak = '';
        [5, 6, 7, 8, 9, 10].forEach(function (n) {
            rak += '<button type="button" class="okul-hizli">' + IH_RAKAM(n) + '</button>';
        });
        var pencere = '<svg class="okul-pencere" viewBox="0 0 20 16" aria-hidden="true">' +
            '<rect x="0.6" y="0.6" width="18.8" height="14.8" rx="2" fill="#CFE7F5"' +
            ' stroke="#8FB8D4" stroke-width="1.2"/>' +
            '<path d="M10 1.2v13.6M1.2 8h17.6" stroke="#8FB8D4" stroke-width="1.1"/></svg>';
        return '<div class="okul-panel"><div class="okul-icerik">' +
            '<div class="okul-bina">' +
            '<svg class="okul-cati" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true">' +
            '<path d="M50 0 L98 18 H2 Z" fill="#C0392B"/>' +
            '<path d="M50 0 L98 18 H88 L50 3.6 L12 18 H2 Z" fill="rgba(255,255,255,.14)"/></svg>' +
            '<div class="okul-sacak"></div>' +
            '<div class="okul-tabela">' +
            '<svg class="okul-kep" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M2 9.4L12 4.6l10 4.8-10 4.8z" fill="#F1C40F"/>' +
            '<path d="M6.4 12.4v3.4c0 1.5 2.6 2.8 5.6 2.8s5.6-1.3 5.6-2.8v-3.4L12 15.2z" fill="#F7DC6F"/>' +
            '</svg><span>Okulun</span></div>' +
            '<div class="okul-govde">' +
            /* ÖNİZLEME DE AYNI SIRADA (07.10.2026): gerçek panelde ekleme
               satırı en üstte duruyor; misafir gördüğü şeyin aynısını
               bulsun diye burada da öyle. Sağdaki kesik çizgili daire
               gerçeğindeki "başka seviye" tuşunun karşılığı. */
            '<div class="okul-kat okul-kat-ekle">' +
            '<span class="okul-hizli-bas">Seviye ekle</span>' +
            '<span class="okul-hizli-sira">' + rak + '</span>' +
            '<span class="okul-seviye-arti" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24"><path d="M12 6.5v11M6.5 12h11" fill="none"' +
            ' stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>' +
            '</span></div>' +
            '<div class="okul-kat"><span class="okul-kat-ad">' +
            '<span class="okul-kat-yazi">Henüz seviye yok</span></span>' +
            '<span class="okul-kapilar"><span class="okul-bos">sınıf yok</span></span></div>' +
            '</div>' +
            '<div class="okul-giris">' + pencere +
            '<svg class="okul-kapi-svg" viewBox="0 0 40 32" aria-hidden="true">' +
            '<path d="M3 32V13a17 13 0 0 1 34 0v19z" fill="#6B4A38"/>' +
            '<rect x="7.6" y="13.4" width="11" height="18.6" rx="1.6" fill="#8B5E3C"' +
            ' stroke="#5D4037" stroke-width="1"/>' +
            '<rect x="21.4" y="13.4" width="11" height="18.6" rx="1.6" fill="#8B5E3C"' +
            ' stroke="#5D4037" stroke-width="1"/></svg>' + pencere + '</div>' +
            '<div class="okul-taban"></div></div>' +
            '<div class="okul-arsa"><button type="button" class="okul-arsa-tus">+ Kurum Ekle</button></div>' +
            '</div></div>';
    }

    /* İmam Hatip rakamı — listelerim.js'teki llIhRakam varsa o kullanılır,
       yoksa burada aynısı çizilir (betik sırası değişirse bozulmasın). */
    function IH_RAKAM(n) {
        try { if (typeof window.llIhRakam === 'function') return window.llIhRakam(n); } catch (e) { }
        return '<span class="ih-num okul-ihn"><svg viewBox="0 0 48 48" aria-hidden="true">' +
            '<circle cx="24" cy="24" r="21" fill="none" stroke="#16A085" stroke-width="3"' +
            ' stroke-dasharray="7 7" stroke-linecap="round"/>' +
            '<circle cx="24" cy="24" r="15" fill="#16A085"/>' +
            '<text x="24" y="30.5" text-anchor="middle" font-size="19" font-weight="800"' +
            ' fill="#fff">' + n + '</text></svg></span>';
    }

    /* Eski ad; dışarıdan çağrı kalmışsa diye duruyor. */
    function onizlemeCiz() {
        var b = kabukKur();
        if (b) onizlemeGovde(b);
    }
    /* Başlıktaki giriş tuşunun simgesi — index.html'deki
       #header-login-btn ile birebir aynı çizim. */
    var GIRIS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
        ' aria-hidden="true">' +
        '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>' +
        '<polyline points="10 17 15 12 10 7"/>' +
        '<line x1="15" y1="12" x2="3" y2="12"/></svg>';

    /* Tavsiye — uyarı değil. Kapatması kolay, tek paragraf. */
    function girisTavsiye() {
        if (document.getElementById('snGirisTavsiye')) return;
        var k = document.createElement('div');
        k.id = 'snGirisTavsiye';
        k.innerHTML =
            '<div class="sngt-kart" role="dialog" aria-modal="true">' +
            '<button type="button" class="sngt-kapat" aria-label="Kapat">&times;</button>' +
            BUYUK_OKUL_SVG +
            /* OTURUM VARSA BAŞKA METİN (07.10.2026) — bölüm artık herkese
               görünüyor; giriş yapmış ama öğretmen olmayan birine "önce
               giriş yap" demek yanlış olurdu. */
            (misafirMi()
                ? ('<p class="sngt-bas">Önce giriş yapmanı öneririz</p>' +
                   '<p class="sngt-alt">Burada kuracağın kurum, seviye ve sınıflar ' +
                   '<b>sana ait</b> olsun diye giriş gerekiyor. Giriş yaptığında ' +
                   'listelerin, sınıf defterin ve notların hesabına kaydedilir; ' +
                   'telefondan da bilgisayardan da aynı sınıfları açarsın. Girişsiz ' +
                   'kurulanlar yalnız bu tarayıcıda kalır ve kaybolabilir.</p>')
                : ('<p class="sngt-bas">Burası öğretmen sınıfları için</p>' +
                   '<p class="sngt-alt">Kurum, seviye ve sınıf kurmak, yoklama almak ve ' +
                   'sınıf defteri tutmak <b>öğretmen hesabına</b> açık. Hesabın ' +
                   'öğretmen olarak tanımlıysa buradaki okul kendi kurumların ve ' +
                   'sınıflarınla dolar; değilse sitedeki dersleri, kitapları ve ' +
                   'etkinlikleri serbestçe kullanabilirsin.</p>')) +
            /* GİRİŞ SİMGESİ (07.10.2026) — öğretmen: "giriş yapmanı
               öneririz uyarısında giriş svg si de olsun ki yeşil oklu
               giriş kısmının ne işe yaradığı anlaşılsın". Başlıktaki
               giriş tuşunun AYNISI gösteriliyor (aynı ok simgesi, aynı
               yeşil) ve altında nerede durduğu yazıyor; böylece kişi
               sağ üstteki o oku görünce ne olduğunu biliyor. Tuş
               gerçekten çalışıyor: basınca giriş penceresi açılıyor.
               Giriş yapmış ama öğretmen olmayana gösterilmiyor. */
            (misafirMi()
                ? ('<button type="button" class="sngt-giris">' + GIRIS_SVG +
                   '<span>Giriş Yap</span></button>' +
                   '<p class="sngt-nerede">Bu tuş sayfanın sağ üst köşesinde de ' +
                   'duruyor</p>')
                : '') +
            '<button type="button" class="sngt-tus">Anladım</button>' +
            '</div>';
        k.addEventListener('click', function (e) {
            var g = e.target.closest ? e.target.closest('.sngt-giris') : null;
            if (g) {
                k.remove();
                try { if (typeof showLoginModal === 'function') showLoginModal(); } catch (e2) { }
                return;
            }
            if (e.target === k || e.target.classList.contains('sngt-kapat') ||
                e.target.classList.contains('sngt-tus')) k.remove();
        });
        document.body.appendChild(k);
    }

    /* ---------------------------------------------------------- ÇIKIŞ
       Öğretmen: "öğretmen çıkış yapınca anında sınıflarım kategorisi
       kaybolmalı." Eskiden bölüm yalnız ciz() çalışınca gizleniyordu;
       çıkıştan sonra ciz()'i tetikleyen bir şey olmadığı için kategori
       ekranda kalıyor, içinde sınıf adları duruyordu. */
    var gosterildi = false;

    /* Çıkış: bölüm EKRANDA KALIR (07.10.2026 — "her zaman görünecek"),
       yalnız içi boş kurum önizlemesine döner; önceki öğretmenin sınıf
       adları kalmaz. */
    function gizle() {
        var b = document.getElementById(BOLUM_ID);
        gosterildi = false;
        if (!b) return;
        /* ÖNBELLEK VARSA ÖNİZLEMEYE DÜŞME (07.10.2026): çıkışta sınıflar
           silinmesin, salt görünüme geçsin. */
        if (saltMi()) { ciz(); return; }
        try { if (window.KidefSinifBag) window.KidefSinifBag.icerde = false; } catch (e) { }
        b.__govde = null;              /* gövde yeniden kurulsun */
        onizlemeGovde(b);
    }
    function cikisIzle() {
        if (window.__snCikisIzleniyor) return;
        try {
            if (!(window.firebase && firebase.auth)) return;
            window.__snCikisIzleniyor = 1;
            firebase.auth().onAuthStateChanged(function (u) {
                if (!u) gizle();                 /* çıkış: anında */
                else setTimeout(function () { try { ciz(); } catch (e) { } }, 0);
            });
        } catch (e) { }
    }

    /* Emniyet nabzı: rol temizlenerek yapılan çıkışları da yakalar.
       "Daha önce görünmüştü" şartı, açılışta rol çözülmeden boşuna
       silme yapmasını engelliyor. */
    setInterval(function () {
        try {
            cikisIzle();                          /* firebase geç gelirse */
            isimYaz();                            /* ad asenkron geliyor */
            if (gosterildi && !gorunurMu()) gizle();
        } catch (e) { }
    }, 1200);

    /* ------------------------------------------------------- AKORDİYON
       Öğretmen: "istenirse sınıflarım kategorisi akordiyon sistem olarak
       kapanabilmeli tıklayınca." Tercih tarayıcıda saklanıyor: kapattıysa
       bir dahaki girişte de kapalı geliyor. Panel DOM'da duruyor, yalnız
       gizleniyor — açılınca yeniden kurulmuyor.

       BAŞLANGIÇTA KAPALI (06.10.2026) — öğretmen: "sınıflarım kategorisi
       ilk başta kapalı olarak açılsın". Anasayfa ilk açılışta sakin
       duruyor; sınıflara girmek isteyen başlığa basıp açıyor. Tercih
       tersine saklanıyor artık: yalnız '0' (öğretmen eliyle AÇILMIŞ)
       açık demek, boş ya da '1' kapalı demek. Böylece daha önce açıp
       kapatmamış olanlar da kapalı başlıyor; bir kez açan için açık
       kalıyor. */
    /* YENİLENİNCE HEP KAPALI (07.10.2026) — öğretmen: "sınıfların
       kategorisi eğer açılmışsa sayfa yenilendiğinde otomatik kapanmalı".
       Tercih artık tarayıcıda saklanmıyor; açık/kapalı yalnız o sayfa
       durduğu sürece yaşıyor. Her yeni açılışta kapalı başlıyor, sayfa
       sakin duruyor. (Eski anahtar kidefSiniflarimKapali kullanılmıyor;
       kalmış olanı da temizliyoruz ki eski tercih geri gelmesin.) */
    var kapali = true;
    try { localStorage.removeItem('kidefSiniflarimKapali'); } catch (e) { }

    function kapaliMi() { return kapali; }

    function katla() {
        var b = document.getElementById(BOLUM_ID);
        if (!b) return;
        kapali = !kapali;
        baslikDurum(b);                /* gövdeye dokunulmuyor */
    }

    /* Başlıktaki "Sınıf ekle": kapalıysa açar, sonra ekleme satırına iner. */
    function sinifEkle() {
        var b = document.getElementById(BOLUM_ID);
        if (!b) return;
        if (kapali) { kapali = false; baslikDurum(b); }
        setTimeout(function () {
            try {
                var hedef = b.querySelector('.okul-kat-ekle') ||
                            b.querySelector('.sn-okul');
                if (hedef && hedef.scrollIntoView) {
                    hedef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } catch (e) { }
        }, 60);
    }

    /* ----------------------------------------------- OKUL PANELİ İÇERİDE */
    function baskaSekmeMi() {
        try {
            var q = location.search || '';
            return q.indexOf('okul=1') > -1 || q.indexOf('sinif=') > -1;
        } catch (e) { return false; }
    }

    function okulIcineKoy(bolum) {
        if (baskaSekmeMi()) return;          /* okul/sınıf sekmesine karışma */
        var yuva = bolum.querySelector('.sn-okul');
        if (!yuva) return;
        var p = document.getElementById('llOkulPopup');
        /* ÖNİZLEMEYİ GERÇEK PANEL SANMA (07.10.2026) — misafir kabuğu da
           aynı id'yi taşıyor; temizlenmezse gerçek panel hiç içeri
           alınmıyordu. */
        if (p && p.classList.contains('sn-onizle')) {
            try { if (p.parentNode) p.parentNode.removeChild(p); } catch (e) { }
            p = document.getElementById('llOkulPopup');
        }
        if (p && yuva.contains(p)) return;   /* zaten içeride */
        try { if (window.KidefSinifBag) window.KidefSinifBag.icerde = true; } catch (e) { }
        if (!p) {
            try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { return; }
            p = document.getElementById('llOkulPopup');
        }
        if (!p) return;
        p.classList.add('sn-okul-ici');
        yuva.appendChild(p);
        okulIzle(bolum);
    }

    /* Kurum eklenince pencere kapanıp yeniden açılıyor (gövdeye). Yeniden
       açıldığında geri içeri alınsın diye gövde izleniyor. */
    function okulIzle(bolum) {
        if (window.__snOkulIzleniyor || !window.MutationObserver) return;
        window.__snOkulIzleniyor = 1;
        new MutationObserver(function (kayitlar) {
            for (var i = 0; i < kayitlar.length; i++) {
                var ek = kayitlar[i].addedNodes || [];
                for (var j = 0; j < ek.length; j++) {
                    if (ek[j] && ek[j].id === 'llOkulPopup') {
                        try { okulIcineKoy(bolum); } catch (e) { }
                        return;
                    }
                }
            }
        }).observe(document.body, { childList: true });
    }

    /* --------------------------------------------------------- İŞLEMLER */
    /* Okulu aç: kendi sekmesinde. Başlıktaki kapı kalktığı için
       anasayfadan okula giden yol burası. */
    function okulAc() {
        try {
            if (window.KidefSinifBag && KidefSinifBag.okulSekmesiAc) {
                KidefSinifBag.okulSekmesiAc(); return;
            }
        } catch (e) { }
        try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { }
    }

    function ac(lId, cId) {
        try {
            if (typeof llOkulSinifSec === 'function') { llOkulSinifSec(lId, cId); return; }
        } catch (e) { }
        try {
            if (typeof changeView === 'function') changeView('listelerim-section');
            if (typeof initListelerim === 'function') initListelerim();
            if (typeof selectClass === 'function') setTimeout(function () { selectClass(lId, cId); }, 0);
        } catch (e) { }
    }

    function seciciKapat() {
        var e = document.getElementById('snSeviye');
        if (e) e.remove();
        document.removeEventListener('keydown', seciciEsc, true);
    }
    function seciciEsc(e) { if (e.key === 'Escape') seciciKapat(); }

    /* "+" → 5'ten 10'a seviyeler. Seçilen seviye o kurumda yoksa açılır. */
    function seviyeSec(tus, kId) {
        if (document.getElementById('snSeviye')) { seciciKapat(); return; }
        var k = document.createElement('div');
        k.id = 'snSeviye';
        var izgara = SEVIYELER.map(function (n) {
            return '<button type="button" class="sns-tus"' +
                ' onclick="KidefSiniflarim.sinifKur(\'' + kac(kId) + '\',' + n + ')">' + n + '</button>';
        }).join('');
        izgara += '<button type="button" class="sns-tus sns-baska"' +
            ' onclick="KidefSiniflarim.sinifKur(\'' + kac(kId) + '\',0)">Başka bir seviye…</button>';
        k.innerHTML = '<div class="sns-panel"><div class="sns-bas">Hangi sınıf?</div>' +
            '<div class="sns-izgara">' + izgara + '</div></div>';
        document.body.appendChild(k);

        try {
            var r = tus.getBoundingClientRect();
            var p = k.firstChild;
            p.style.top = Math.round(r.bottom + 8) + 'px';
            p.style.left = Math.round(r.left) + 'px';
            var g = p.getBoundingClientRect();
            if (g.right > window.innerWidth - 10) {
                p.style.left = Math.max(10, window.innerWidth - g.width - 10) + 'px';
            }
            if (g.bottom > window.innerHeight - 10) {
                p.style.top = Math.max(10, r.top - g.height - 8) + 'px';
            }
        } catch (e) { }

        k.addEventListener('click', function (e) { if (e.target === k) seciciKapat(); });
        document.addEventListener('keydown', seciciEsc, true);
    }

    /* Seviye seçildi: şube sorulur, gerekiyorsa seviye açılır, sınıf eklenir. */
    function sinifKur(kId, no) {
        seciciKapat();
        if (typeof data === 'undefined' || !data) return;

        var seviyeAdi, sinifOn;
        if (no) {
            seviyeAdi = no + '. Sınıflar';
            sinifOn = String(no);
        } else {
            var ozel = prompt('Seviye adı (örn: Hazırlık, 11. Sınıflar):');
            if (!ozel || !ozel.trim()) return;
            seviyeAdi = ozel.trim();
            sinifOn = seviyeRakami(seviyeAdi);
        }

        var sube = prompt('Şube (örn: A, B, C) — boş bırakırsan tek sınıf açılır:', 'A');
        if (sube === null) return;                     /* vazgeçti */
        sube = String(sube).trim().toLocaleUpperCase('tr-TR');
        var sinifAdi = sube ? (sinifOn + '-' + sube) : seviyeAdi.replace(/lar$/i, '');

        var kurumId = (kId === 'GENEL') ? null : kId;
        if (!data.levels) data.levels = {};

        /* Aynı kurumda aynı adlı seviye varsa ona ekle, yoksa yeni seviye. */
        var lId = null;
        Object.keys(data.levels).forEach(function (id) {
            var l = data.levels[id];
            if (!l) return;
            var lk = l.kurumId || null;
            if (lk === kurumId && String(l.name).trim() === seviyeAdi) lId = id;
        });
        if (!lId) {
            if (typeof window.llSeviyeTaslak === 'function') {
                lId = 'L' + Date.now();
                data.levels[lId] = window.llSeviyeTaslak(seviyeAdi, kurumId);
                if (!Array.isArray(data.levelOrder)) data.levelOrder = Object.keys(data.levels);
                if (data.levelOrder.indexOf(lId) < 0) data.levelOrder.push(lId);
            } else {
                alert('Seviye oluşturulamadı (listelerim.js yüklenmemiş).');
                return;
            }
        }

        var lvl = data.levels[lId];
        if (!lvl.classes) lvl.classes = {};
        var zaten = Object.keys(lvl.classes).some(function (c) {
            return String((lvl.classes[c] || {}).name || '').trim() === sinifAdi;
        });
        if (zaten) { alert(sinifAdi + ' zaten var.'); return; }

        lvl.classes['C' + Date.now()] = { name: sinifAdi, students: [] };
        try { if (typeof save === 'function') save(); } catch (e) { }
        ciz();
    }

    function kurumEkle() {
        try { if (typeof addKurum === 'function') addKurum(); } catch (e) { }
        setTimeout(ciz, 0);
    }

    /* ------------------------------------------------------ YOKLAMA
       Rol asenkron geldiği için kısa süre yoklanır; görünür olunca
       birkaç tur teyit edip durur (sistem/okultusu.js ile aynı mantık). */
    var tur = 0, teyit = 0;
    var zaman = setInterval(function () {
        tur++;
        ciz();
        if (gorunurMu() && document.getElementById(BOLUM_ID)) teyit++;
        if (teyit >= 4 || tur > 50) clearInterval(zaman);
    }, 500);

    document.addEventListener('visibilitychange', function () { if (!document.hidden) ciz(); });
    window.addEventListener('focus', ciz);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ciz);
    else ciz();

    window.KidefSiniflarim = {
        okulAc: okulAc, katla: katla, sinifEkle: sinifEkle, girisTavsiye: girisTavsiye,
        ciz: ciz, ac: ac, seviyeSec: seviyeSec, sinifKur: sinifKur,
        kurumEkle: kurumEkle, gorunurMu: gorunurMu, saltMi: saltMi
    };
})();
