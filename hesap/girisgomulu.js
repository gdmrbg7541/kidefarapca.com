/* =========================================================================
   KİDEF · GÖMÜLÜ GİRİŞ — index tarafı             (hesap/girisgomulu.js)
   -------------------------------------------------------------------------
                                                                18.10.2026
   Öğretmen: "index te giriş ve kayıt ekranı varya onun aynısı bilgi
   yarışmasında da olsun".

   Bilgi Yarışması'ndaki «Giriş yap» / «Hesabım yok, kayıt olayım» artık
   index'in KENDİ giriş ekranını yarışma sayfasının üstünde açıyor:
   hesap/biygiris.js, index.html?giris=1&rol=ogretmen&gomulu=1 adresini
   tam ekran bir çerçevede (iframe) yükler. Ekran birebir aynı — aynı
   dosyalar çalışıyor (giriş penceresi, karekodla giriş, kayıt anketi, rol
   kartları, dil). index'teki giriş ekranı değişirse yarışmadaki de
   kendiliğinden değişir; iki ekran bir daha ayrışamaz.

   Bu dosya YALNIZ ÇERÇEVE İÇİNDEYKEN çalışır (adreste gomulu=1 ve üstte
   aynı siteden bir sayfa var). index'i doğrudan açınca hiçbir şey yapmaz.
   Üst sayfaya haber verir (postMessage, yalnız aynı kökene):
     { kidefGiris: 'hazir' }  giriş penceresi açıldı → üst sayfa çerçeveyi gösterir
     { kidefGiris: 'tamam' }  giriş ya da kayıt bitti (kayıt mesajı kapatıldıktan sonra)
     { kidefGiris: 'kapat' }  pencere giriş yapılmadan kapatıldı (✕)
   Oturum Firebase'in tarayıcı deposunda; üst sayfa onu kendisi görür.
   ========================================================================= */
(function () {
    'use strict';
    var gomulu = false;
    try {
        gomulu = /[?&]gomulu=1(&|$)/.test(location.search) &&
                 window.parent && window.parent !== window &&
                 window.parent.location.origin === location.origin;
    } catch (e) { gomulu = false; }
    if (!gomulu) return;

    document.documentElement.classList.add('kd-gomulu');
    /* Çerçevede yalnız giriş ekranı görünsün:
       · dil önerisi gibi karşılama kutuları burada çıkmaz (index'in
         kendisinde eskisi gibi çıkar);
       · index'in dikey kaydırma çubuğu görünmez (index html{overflow-y:scroll}
         ile çubuğu hep gösteriyor; öğretmen: "sitenin dikey scroll'ü
         görünüyor"). Giriş penceresinin içi kendi kaydırmasıyla kayar,
         kısa ekranda da form sonuna kadar iner. */
    var st = document.createElement('style');
    st.textContent = 'html.kd-gomulu #kdDilOneri{display:none!important}' +
        'html.kd-gomulu,html.kd-gomulu body{overflow:hidden!important}';
    (document.head || document.documentElement).appendChild(st);

    function bildir(durum) {
        try { window.parent.postMessage({ kidefGiris: durum }, location.origin); } catch (e) { }
    }
    function gorunur(id) {
        var e = document.getElementById(id);
        if (!e) return false;
        var cs = getComputedStyle(e);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
    }
    /* Kayıt bitince index bir uyarı gösterir («Kaydın alındı…»). Uyarı sitenin
       showCustomAlert'iyle açılıyor (sistem/alarm.js: kimliksiz tam ekran kutu);
       çerçeve, öğretmen uyarıyı okuyup kapatana kadar açık kalsın diye uyarının
       kutusu izlenir. */
    var uyarilar = [];
    function sar() {
        var f = window.showCustomAlert;
        if (typeof f !== 'function' || f.__kdGomulu) return;
        var g = function () {
            var once = document.body ? document.body.lastElementChild : null;
            var r = f.apply(this, arguments);
            var son = document.body ? document.body.lastElementChild : null;
            if (son && son !== once) uyarilar.push(son);
            var k = document.getElementById('custom-alert-box');
            if (k) uyarilar.push(k);
            return r;
        };
        g.__kdGomulu = true;
        window.showCustomAlert = g;
    }
    function elGorunur(e) {
        if (!e || !e.isConnected) return false;
        var cs = getComputedStyle(e);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
    }
    function uyariAcik() {
        uyarilar = uyarilar.filter(elGorunur);
        return uyarilar.length > 0 || gorunur('customAlertModal');
    }
    function hesap() {
        try {
            if (!window.firebase || !firebase.apps || !firebase.apps.length) return null;
            var u = firebase.auth().currentUser;
            return (u && !u.isAnonymous) ? u : null;
        } catch (e) { return null; }
    }

    sar();
    window.addEventListener('load', sar);
    var hazir = false, bitti = false, bas = Date.now();
    var t = setInterval(function () {
        if (bitti) { clearInterval(t); return; }
        sar();
        var acik = gorunur('login-modal');
        if (!hazir) {
            if (acik) { hazir = true; bildir('hazir'); return; }
            /* Bu tarayıcıda zaten hesapla girilmişse index pencereyi açmaz
               («zaten giriş yapılmış» der): üst sayfa durumu tazelesin. */
            if (hesap() && Date.now() - bas > 2500) { bitti = true; clearInterval(t); bildir('tamam'); }
            return;
        }
        if (acik) return;
        if (uyariAcik()) return;                       /* «Kaydın alındı…» okunuyor */
        bitti = true;
        clearInterval(t);
        bildir(hesap() ? 'tamam' : 'kapat');
    }, 250);

    /* Çerçeve başka bir sayfaya geçerse (ör. tahta cihazında girişten hemen
       sonra tahta görünümüne) son durum yine bildirilsin. */
    window.addEventListener('pagehide', function () {
        if (bitti) return;
        bitti = true;
        clearInterval(t);
        bildir(hesap() ? 'tamam' : 'kapat');
    });
})();
