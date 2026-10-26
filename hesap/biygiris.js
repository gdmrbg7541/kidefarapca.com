/* =========================================================================
   KİDEF — BİLGİ YARIŞMASI: YERİNDE GİRİŞ / KAYIT PANELİ
   -------------------------------------------------------------------------
   SORUN: seminer sırasında sunumdan «Yarışmayı aç» denince yarışma yeni
   sekmede açılıyor; giriş yapılmamışsa kapı ekranı çıkıp «Girişe git»
   index.html'e gönderiyordu. Öğretmen sunumun ortasında ana sayfaya
   düşüyor, giriş yapıp yarışmaya geri dönmek için yolu baştan yürüyordu
   (Geylani: "index'e gidiyor, gerek yok").

   ÇÖZÜM: giriş ve kayıt bu sayfanın İÇİNDE açılıyor. Sekme değişmiyor,
   giriş biter bitmez kapı kalkıyor ve yarışma kurulumu açılıyor —
   onAuthStateChanged zaten dinlemede (oyunlar/bilgiyarismasikacom.js).

   Kayıt alanları ve kullanicilar/{uid} belgesinin biçimi BURADA DEĞİL,
   hesap/kayitalani.js'te duruyor; index'teki kayıt formu da aynı dosyayı
   okuyor, iki ekran birbirinden ayrılmasın diye.

   NOT: kayıt burada öğretmen hesabı açar ve belgeye ogretmenOnay:'bekliyor'
   yazılır (kural gereği). Rol denetimi (sistem/rol.js) yalnız role alanına
   baktığı için yeni kayıt yarışmayı yönetebiliyor; onay kapısı sitenin
   geri kalanında geçerli.
   ========================================================================= */
(function () {
    'use strict';

    var panel = null, kip = 'giris';       /* 'giris' | 'kayit' */

    function $(id) { return document.getElementById(id); }

    function stilKur() {
        if ($('biyg-stil')) return;
        var s = document.createElement('style');
        s.id = 'biyg-stil';
        s.textContent =
            '#biyg-perde{position:fixed;inset:0;z-index:100000;display:none;' +
            'align-items:flex-start;justify-content:center;overflow-y:auto;padding:22px 14px 40px;' +
            'background:rgba(20,26,36,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}' +
            '#biyg-perde.acik{display:flex}' +
            '#biyg-kart{width:min(430px,100%);background:#fff;border-radius:20px;' +
            'box-shadow:0 26px 70px rgba(0,0,0,.32);padding:24px 22px 20px;' +
            'font-family:inherit;box-sizing:border-box;animation:biygGel .26s cubic-bezier(.22,1,.36,1)}' +
            '@keyframes biygGel{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}' +
            '#biyg-kart h2{margin:0 0 4px;font-size:1.32rem;color:#1F2430;font-weight:800}' +
            '#biyg-kart .biyg-alt{margin:0 0 16px;font-size:.92rem;color:#6B7684;line-height:1.5}' +
            '.biyg-alan{margin-bottom:11px}' +
            '.biyg-alan label{display:block;font-size:.82rem;font-weight:700;color:#4B5563;margin-bottom:4px}' +
            '.biyg-alan input,.biyg-alan select{width:100%;box-sizing:border-box;font-family:inherit;' +
            'font-size:1rem;padding:10px 12px;border:1.6px solid #DCE3EC;border-radius:11px;background:#FBFCFE;color:#1F2430}' +
            '.biyg-alan input:focus,.biyg-alan select:focus{outline:none;border-color:#16A085;background:#fff}' +
            '.biyg-ikili{display:flex;gap:9px}.biyg-ikili>*{flex:1 1 0;min-width:0}' +
            '#biyg-hata{min-height:18px;margin:2px 0 10px;font-size:.86rem;color:#C0392B;font-weight:700;line-height:1.4}' +
            '#biyg-bilgi{margin:2px 0 10px;font-size:.86rem;color:#1E8449;font-weight:700;line-height:1.45}' +
            '.biyg-tus{width:100%;font-family:inherit;font-size:1rem;font-weight:800;cursor:pointer;' +
            'border:0;border-radius:12px;padding:12px;background:#16A085;color:#fff;' +
            'box-shadow:0 8px 20px rgba(22,160,133,.28);transition:filter .15s,transform .15s}' +
            '.biyg-tus:hover{filter:brightness(1.06);transform:translateY(-1px)}' +
            '.biyg-tus[disabled]{opacity:.6;cursor:default;transform:none}' +
            '.biyg-ikincil{background:none;border:0;color:#16A085;font-family:inherit;font-weight:800;' +
            'font-size:.9rem;cursor:pointer;padding:12px 4px 2px;width:100%;text-align:center}' +
            '.biyg-ikincil:hover{text-decoration:underline}' +
            '#biyg-kapat{position:absolute;top:10px;right:12px;background:none;border:0;cursor:pointer;' +
            'font-size:1.5rem;line-height:1;color:#9AA4B2;padding:4px 8px}' +
            '#biyg-kapat:hover{color:#4B5563}' +
            '#biyg-kart{position:relative}' +
            '@media (max-width:420px){#biyg-kart{padding:20px 16px 16px}}';
        document.head.appendChild(s);
    }

    function iskeletKur() {
        if (panel) return;
        stilKur();
        panel = document.createElement('div');
        panel.id = 'biyg-perde';
        panel.innerHTML = '<div id="biyg-kart" role="dialog" aria-modal="true" aria-label="Giriş"></div>';
        panel.addEventListener('click', function (e) { if (e.target === panel) kapat(); });
        document.body.appendChild(panel);
    }

    function ciz() {
        var k = panel.querySelector('#biyg-kart');
        var ortak =
            '<button type="button" id="biyg-kapat" aria-label="Kapat">&times;</button>' +
            '<div class="biyg-alan"><label for="biyg-email">E-posta</label>' +
            '<input id="biyg-email" type="email" autocomplete="email" inputmode="email" placeholder="ornek@eposta.com"></div>' +
            '<div class="biyg-alan"><label for="biyg-pass">Şifre</label>' +
            '<input id="biyg-pass" type="password" autocomplete="' +
            (kip === 'giris' ? 'current-password' : 'new-password') + '" placeholder="••••••••"></div>';

        if (kip === 'giris') {
            k.innerHTML =
                '<h2>Giriş yap</h2>' +
                '<p class="biyg-alt">Yarışmayı yönetmek için öğretmen ya da yönetici hesabı gerekir. ' +
                'Giriş yapınca bu sayfada kalırsın.</p>' +
                ortak +
                '<div id="biyg-hata"></div>' +
                '<button type="button" class="biyg-tus" id="biyg-gonder">Giriş yap</button>' +
                '<button type="button" class="biyg-ikincil" id="biyg-gec">Hesabım yok, kayıt olayım</button>';
        } else {
            k.innerHTML =
                '<h2>Öğretmen hesabı aç</h2>' +
                '<p class="biyg-alt">Hesabın yönetici onayına düşer. Onaylanınca sitenin tamamı açılır.</p>' +
                ortak +
                '<div class="biyg-alan"><label for="biyg-pass2">Şifre (tekrar)</label>' +
                '<input id="biyg-pass2" type="password" autocomplete="new-password" placeholder="••••••••"></div>' +
                '<div class="biyg-alan"><label for="biyg-ad">Ad soyad</label>' +
                '<input id="biyg-ad" type="text" autocomplete="name" placeholder="Ad Soyad"></div>' +
                '<div class="biyg-alan"><label for="biyg-meslek">Meslek</label>' +
                '<input id="biyg-meslek" type="text" placeholder="Arapça öğretmeni"></div>' +
                '<div class="biyg-ikili">' +
                  '<div class="biyg-alan"><label for="biyg-tel">Telefon</label>' +
                  '<input id="biyg-tel" type="tel" inputmode="numeric" maxlength="10" placeholder="5XXXXXXXXX"></div>' +
                  '<div class="biyg-alan"><label for="biyg-cinsiyet">Cinsiyet</label>' +
                  '<select id="biyg-cinsiyet"><option value="">Seç</option>' +
                  '<option value="erkek">Erkek</option><option value="kadin">Kadın</option></select></div>' +
                '</div>' +
                '<div id="biyg-hata"></div>' +
                '<button type="button" class="biyg-tus" id="biyg-gonder">Kayıt ol</button>' +
                '<button type="button" class="biyg-ikincil" id="biyg-gec">Hesabım var, giriş yapayım</button>';
        }

        $('biyg-kapat').onclick = kapat;
        $('biyg-gec').onclick = function () {
            kip = (kip === 'giris') ? 'kayit' : 'giris';
            ciz();
        };
        $('biyg-gonder').onclick = gonder;

        /* Enter ile gönderilsin — seminer sırasında fare aramasın */
        k.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); gonder(); }
        });

        /* Daha önce girilen e-posta hatırlansın (index ile aynı anahtar) */
        try {
            var kayitli = localStorage.getItem('savedEmail');
            if (kayitli) $('biyg-email').value = kayitli;
        } catch (e) { }

        setTimeout(function () {
            var hedef = $('biyg-email');
            if (hedef && !hedef.value) hedef.focus();
            else if ($('biyg-pass')) $('biyg-pass').focus();
        }, 60);
    }

    function hata(m) { var e = $('biyg-hata'); if (e) e.textContent = m || ''; }

    function mesgul(d) {
        var t = $('biyg-gonder');
        if (!t) return;
        t.disabled = !!d;
        t.textContent = d ? 'Bekle…' : (kip === 'giris' ? 'Giriş yap' : 'Kayıt ol');
    }

    function agVar() {
        return !(typeof firebase === 'undefined' || !firebase.auth);
    }
    /* Firebase hatası → Türkçe (hesap/kayitalani.js). 26.10.2026: ham INVALID_LOGIN_CREDENTIALS çıkıyordu. */
    function hataMetni(e, kip) {
        if (window.KidefKayit && KidefKayit.hataMetni) return KidefKayit.hataMetni(e, kip);
        return (kip === 'kayit' ? 'Kayıt başarısız: ' : 'Giriş başarısız: ') + ((e && e.message) || e);
    }

    function gonder() {
        hata('');
        var email = ($('biyg-email').value || '').trim();
        var pass = $('biyg-pass').value || '';

        /* ÖNCE ALAN DENETİMİ, SONRA BAĞLANTI. Tersi olduğunda internet
           kesikken kullanıcı "şifreler uyuşmuyor" yerine bağlantı hatası
           görüyordu; yazdığı yanlışı düzeltmesi gerektiğini anlamıyordu. */
        if (kip === 'giris') {
            if (!email || !pass) { hata('Lütfen tüm alanları doldurun.'); return; }
            if (!agVar()) { hata('Bağlantı yok: giriş için internet gerekiyor.'); return; }
            try { localStorage.setItem('savedEmail', email); } catch (e) { }
            mesgul(true);
            firebase.auth().signInWithEmailAndPassword(email, pass)
                .then(function () {
                    /* Kapıyı kapatmak gerekmiyor: onAuthStateChanged rolü
                       okuyup kurulum ekranını kendisi açıyor. */
                    mesgul(false); kapat();
                })
                .catch(function (err) {
                    mesgul(false);
                    hata(hataMetni(err, 'giris'));
                });
            return;
        }

        /* --- KAYIT --- alanlar ve belge biçimi hesap/kayitalani.js'te */
        if (!window.KidefKayit) { hata('Kayıt bileşeni yüklenemedi.'); return; }
        var s = window.KidefKayit.dogrula({
            email: email, pass: pass, pass2: $('biyg-pass2').value,
            ad: $('biyg-ad').value, meslek: $('biyg-meslek').value,
            tel: $('biyg-tel').value, cinsiyet: $('biyg-cinsiyet').value
        });
        if (!s.tamam) { hata(s.hata); return; }
        if (!agVar()) { hata('Bağlantı yok: kayıt için internet gerekiyor.'); return; }

        try { localStorage.setItem('savedEmail', s.veri.email); } catch (e) { }
        mesgul(true);
        firebase.auth().createUserWithEmailAndPassword(s.veri.email, s.veri.pass)
            .then(function (cred) {
                return firebase.firestore().collection('kullanicilar')
                    .doc(cred.user.uid)
                    .set(window.KidefKayit.belge(s.veri, 'teacher'));
            })
            .then(function () {
                mesgul(false);
                var k = panel.querySelector('#biyg-kart');
                k.innerHTML = '<button type="button" id="biyg-kapat" aria-label="Kapat">&times;</button>' +
                    '<h2>Kaydın alındı</h2>' +
                    '<div id="biyg-bilgi">' + window.KidefKayit.bitisMesaji('teacher') + '</div>' +
                    '<button type="button" class="biyg-tus" id="biyg-gonder">Tamam</button>';
                $('biyg-kapat').onclick = kapat;
                $('biyg-gonder').onclick = kapat;
            })
            .catch(function (err) {
                /* VAR OLAN HESAP (26.10.2026): e-posta kullanımda → aynı şifreyle girilir, belge
                   yoksa kayıt belgesi yazılır (hesap/kayitalani.js → KidefKayit.varOlanHesap);
                   yönetici panelden silmiş olsa da kişi onay kuyruğuna düşer. */
                if (KidefKayit.hesapZatenVarMi && KidefKayit.hesapZatenVarMi(err)) {
                    KidefKayit.varOlanHesap(s.veri, 'teacher').then(function (r) {
                        mesgul(false);
                        if (r.durum !== 'yazildi') { kapat(); return; }      /* zaten kayıtlı: giriş yapıldı */
                        var k = panel.querySelector('#biyg-kart');
                        k.innerHTML = '<button type="button" id="biyg-kapat" aria-label="Kapat">&times;</button>' +
                            '<h2>Kaydın alındı</h2>' +
                            '<div id="biyg-bilgi">' + window.KidefKayit.bitisMesaji('teacher') + '</div>' +
                            '<button type="button" class="biyg-tus" id="biyg-gonder">Tamam</button>';
                        $('biyg-kapat').onclick = kapat;
                        $('biyg-gonder').onclick = kapat;
                    }).catch(function (e2) { mesgul(false); hata(hataMetni(e2, 'kayit')); });
                    return;
                }
                mesgul(false);
                hata(hataMetni(err, 'kayit'));
            });
    }

    /* ===================================================================
       GÖMÜLÜ GİRİŞ (18.10.2026) — öğretmen: "index te giriş ve kayıt ekranı
       varya onun aynısı bilgi yarışmasında da olsun".
       index'in KENDİ giriş ekranı bu sayfanın üstünde, tam ekran bir
       çerçevede açılır: index.html?giris=1|kayit&rol=ogretmen&gomulu=1.
       Ekran birebir aynı (aynı dosyalar: pencere, karekodla giriş, kayıt
       anketi, rol kartları, dil); index'teki değişince bu da değişir.
       index tarafındaki hesap/girisgomulu.js haber verir:
         hazir → çerçeve görünür (o ana kadar turuncu zemin + dönen halka)
         tamam → çerçeve kalkar; oturum Firebase deposundan bu sayfaya geçer,
                 onAuthStateChanged kapıyı kendisi kaldırır (2,5 sn'de
                 geçmezse sayfa yenilenir)
         kapat → çerçeve kalkar, kapı ekranı yerinde
       Sekme değişmez. Çerçeve 20 sn'de açılmazsa (bağlantı yavaş/kesik)
       04.10'daki ortak pencere, o da yoksa eski panel yedek olarak açılır.
       =================================================================== */
    var gom = null;

    function gomStil() {
        if ($('bgg-stil')) return;
        var s = document.createElement('style');
        s.id = 'bgg-stil';
        s.textContent =
            /* zemin index'in giriş penceresiyle aynı turuncu: geçişte sıçrama olmasın */
            '#biyGomuluGiris{position:fixed;inset:0;z-index:2147483000;' +
            'background:linear-gradient(135deg,#FFC107 0%,#F39C12 45%,#EF5350 100%)}' +
            '#biyGomuluGiris iframe{position:absolute;inset:0;width:100%;height:100%;border:0;' +
            'background:transparent;opacity:0;transition:opacity .2s ease}' +
            '#biyGomuluGiris.hazir iframe{opacity:1}' +
            '#biyGomuluGiris .bgg-don{position:absolute;left:50%;top:50%;width:46px;height:46px;' +
            'margin:-23px 0 0 -23px;border-radius:50%;border:4px solid rgba(255,255,255,.35);' +
            'border-top-color:#fff;animation:bggDon .8s linear infinite}' +
            '#biyGomuluGiris.hazir .bgg-don{display:none}' +
            '@keyframes bggDon{to{transform:rotate(360deg)}}' +
            '@media (prefers-reduced-motion:reduce){#biyGomuluGiris .bgg-don{animation-duration:2.4s}}';
        document.head.appendChild(s);
    }

    function gomAc(baslangic) {
        if (gom) return true;
        if (!document.body || typeof window.postMessage !== 'function') return false;
        gomStil();
        var kap = document.createElement('div');
        kap.id = 'biyGomuluGiris';
        kap.setAttribute('role', 'dialog');
        kap.setAttribute('aria-modal', 'true');
        kap.setAttribute('aria-label', 'Giriş');
        var ifr = document.createElement('iframe');
        ifr.title = 'Giriş';
        ifr.src = 'index.html?giris=' + (baslangic === 'kayit' ? 'kayit' : '1') + '&rol=ogretmen&gomulu=1';
        kap.innerHTML = '<span class="bgg-don" aria-hidden="true"></span>';
        /* Çerçeve index'ten başka bir sayfaya geçerse (bildirim gelmeden) kapat. */
        ifr.addEventListener('load', function () {
            if (!gom) return;
            var p = '';
            try { p = ifr.contentWindow.location.pathname; } catch (x) { p = ''; }
            if (/(^|\/)(index\.html)?$/.test(p)) return;
            var u = null;
            try { u = firebase.auth().currentUser; } catch (x) { }
            gomKapat();
            if (!(u && !u.isAnonymous)) oturumuBekle();
        });
        kap.appendChild(ifr);
        document.body.appendChild(kap);
        var tasma = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        gom = {
            kap: kap, ifr: ifr, tasma: tasma, baslangic: baslangic,
            sure: setTimeout(function () {
                if (gom && !gom.kap.classList.contains('hazir')) {
                    var b = gom.baslangic;
                    gomKapat();
                    yedekAc(b);
                }
            }, 20000)
        };
        return true;
    }

    function gomKapat() {
        if (!gom) return;
        clearTimeout(gom.sure);
        try { gom.kap.parentNode.removeChild(gom.kap); } catch (e) { }
        document.documentElement.style.overflow = gom.tasma || '';
        gom = null;
    }

    /* Giriş çerçevede yapıldı: oturum bu sayfaya Firebase deposundan geçer. */
    function oturumuBekle() {
        var bas = Date.now();
        (function bak() {
            var u = null;
            try { u = firebase.auth().currentUser; } catch (e) { }
            if (u && !u.isAnonymous) return;
            if (Date.now() - bas > 2500) { location.reload(); return; }
            setTimeout(bak, 200);
        })();
    }

    window.addEventListener('message', function (e) {
        if (!gom || e.origin !== location.origin || !e.data || !e.data.kidefGiris) return;
        if (e.source && gom.ifr && e.source !== gom.ifr.contentWindow) return;
        var d = e.data.kidefGiris;
        if (d === 'hazir') {
            gom.kap.classList.add('hazir');
            try { gom.ifr.focus(); } catch (x) { }
        } else if (d === 'tamam') {
            gomKapat();
            oturumuBekle();
        } else if (d === 'kapat') {
            gomKapat();
        }
    });

    function yedekAc(baslangic) {
        /* TEK GİRİŞ PENCERESİ (04.10.2026) — öğretmen: "bilgi yarışmasındaki
           giriş ve kayıt ekranı indextekinin aynısı olsun".
           Bu dosyanın kendi küçük paneli yerine artık index'le AYNI pencere
           açılıyor (hesap/girispenceresi.js + girisdavranis.js). Eski panel
           kodu aşağıda duruyor: ortak pencere bir sebeple yüklenmediyse
           yedek olarak devreye giriyor, öğretmen giriş yapamadan kalmasın.
           18.10.2026'dan beri bu yol yalnız YEDEK (yukarıdaki çerçeve açılmazsa). */
        var P = window.KidefGirisPenceresi, D = window.KidefGirisDavranis;
        if (P && D) {
            D.durum.girisKipi = (baslangic !== 'kayit');
            D.rolSec('teacher');          /* yarışmayı öğretmen yönetir */
            D.ac();
            return;
        }
        iskeletKur();
        kip = (baslangic === 'kayit') ? 'kayit' : 'giris';
        ciz();
        panel.classList.add('acik');
    }

    function ac(baslangic) {
        if (gomAc(baslangic)) return;
        yedekAc(baslangic);
    }

    function kapat() {
        gomKapat();
        if (window.KidefGirisDavranis) window.KidefGirisDavranis.kapat();
        if (panel) panel.classList.remove('acik');
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (gom) { gomKapat(); return; }
        if (panel && panel.classList.contains('acik')) kapat();
    });

    window.BiyGiris = { ac: ac, kapat: kapat };
})();
