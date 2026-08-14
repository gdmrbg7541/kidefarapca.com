/* ======================================================================
   KIDEF · KAREKODLA GİRİŞ — istemci  (hesap/qrgiris.js)
   ----------------------------------------------------------------------
   İKİ TARAFI DA BU DOSYA YÜRÜTÜR:

   A) TAHTA (giriş yapılmamış cihaz)
      Giriş penceresindeki "Karekodla Giriş" tuşu -> qrGirisAc()
      Sunucudan oturum alır, karekodu çizer, 2 sn'de bir sorar,
      onaylanınca custom token ile oturumu açar.

   B) TELEFON (giriş yapılmış cihaz)
      Karekod index.html?qr=<oturumId> adresini açar. Sayfa yüklenince
      qrOnayKontrol() bu parametreyi görür ve onay sayfasını gösterir.
      Giriş yapılmamışsa önce giriş penceresi açılır, giriş olunca
      onay sayfası kendiliğinden gelir.

   SUNUCU: functions/index.js (Blaze planı gerekir).
   Sunucu işlevleri henüz yayınlanmadıysa kullanıcıya açık bir uyarı
   çıkar; sitenin geri kalanı etkilenmez.
   ====================================================================== */
(function () {
    'use strict';

    var QR_BOLGE = 'europe-west1';     // functions/index.js ile AYNI olmalı
    var SORMA_ARALIK = 2000;           // tahta kaç ms'de bir sorsun
    var qrDurum = null;                // { oturumId, gizli, dogrulama, bitis, sayacId, sormaId }
    var qrBeklemedekiOnay = null;      // giriş yapılmadan gelen ?qr= değeri
    var qrBeklemedekiAmac = '';        // ?amac= ('onay' → güvenlik doğrulaması)
    var QR_KANAL = 'kidef_qr_giris';   // sekmeler arası haber anahtarı
    var qrHedef = 'pencere';           // 'modal' (giriş penceresi içinde) | 'pencere' (ayrı katman)

    /* Dışa açılan adlar EN BAŞTA verilir: aşağıdaki kurulum satırlarından
       biri hata verirse bile tuş çalışsın (eskiden en sondaydı; kurulum
       patlayınca qrGirisAc tanımsız kalıyor, tuşa basınca hiçbir şey
       olmuyordu). Fonksiyon bildirimleri yukarı çekildiği için sorun yok. */
    window.qrGirisAc = qrGirisAc;
    window.qrGirisKapat = qrGirisKapat;
    window.qrOnayKontrol = qrOnayKontrol;
    window.qrOnayAc = qrOnayAc;
    window.qrElleGirisAc = qrElleGirisAc;
    window.qrKayitAc = qrKayitAc;
    window.qrModAc = qrModAc;
    window.qrSecimEkrani = qrSecimEkrani;
    window.QR_KURULDU = true;

    /* ---------------------------------------------------------------------
       ZORUNLU BİÇİM — hesap/qrgiris.css yüklenmemiş olsa bile pencere
       ekranın ortasında görünsün. Dosya yüklenmediğinde pencere biçimsiz
       kalıp sayfanın EN ALTINA düşüyor, kullanıcı "karekod çıkmıyor"
       sanıyordu. Bu kurallar <head>'in BAŞINA konur; asıl stil dosyası
       daha sonra geldiği için onu ezmez, yalnız yedek olur.
       --------------------------------------------------------------------- */
    function kritikStil() {
        if (document.getElementById('qrKritikStil')) return;
        var s = document.createElement('style');
        s.id = 'qrKritikStil';
        s.textContent =
            '#qrGirisPencere{position:fixed;inset:0;z-index:100000050;background:rgba(15,42,67,.62);' +
            'align-items:center;justify-content:center;padding:18px;font-family:' +
            "'Nunito','Segoe UI',sans-serif;}" +
            '#qrGirisPencere .qr-panel{position:relative;background:#fff;width:100%;max-width:420px;' +
            'max-height:92vh;overflow-y:auto;border-radius:20px;padding:22px;text-align:center;color:#2c3e50;' +
            'box-shadow:0 24px 70px rgba(0,0,0,.35);}' +
            '#qrGirisPencere .qr-kapat{position:absolute;top:10px;right:12px;border:none;background:#f1f3f5;' +
            'width:34px;height:34px;border-radius:50%;font-size:1.4rem;line-height:1;cursor:pointer;}' +
            '#qrGirisPencere .qr-kutu{min-height:120px;display:flex;align-items:center;justify-content:center;' +
            'padding:12px;border:2px solid #E9EEF5;border-radius:16px;margin:0 auto 12px;width:max-content;max-width:100%;}';
        var h = document.head || document.documentElement;
        if (h.firstChild) h.insertBefore(s, h.firstChild); else h.appendChild(s);
    }

    /* ------------------------------------------------------------ ortak */
    function kacis(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function cagir(ad) {
        if (typeof firebase === 'undefined' || !firebase.app) throw new Error('firebase-yok');
        if (typeof firebase.app().functions !== 'function') throw new Error('functions-yok');
        return firebase.app().functions(QR_BOLGE).httpsCallable(ad);
    }
    function girisliMi() {
        try { var u = firebase.auth().currentUser; return !!(u && !u.isAnonymous); } catch (e) { return false; }
    }
    function hataMetni(e) {
        var k = (e && (e.code || e.message)) || '';
        if (/functions-yok|firebase-yok/.test(k)) return 'Karekodla giriş için gereken bileşen yüklenmemiş. Sayfayı yenileyip tekrar deneyin.';
        /* Sunucu kendi Türkçe açıklamasını gönderdiyse onu göster — genel
           "etkin değil" metni gerçek nedeni gizliyordu. */
        var m = (e && e.message) ? String(e.message) : '';
        if (m.length > 25 && !/^(INTERNAL|NOT_FOUND|internal|unavailable)$/.test(m)) return m;
        if (/not-found|internal|NOT_FOUND/i.test(k)) return 'Karekodla giriş sunucuda henüz etkin değil. (Cloud Functions yayınlanmamış olabilir.)';
        if (/unavailable|deadline/i.test(k)) return 'Sunucuya ulaşılamadı. Bağlantını kontrol edip tekrar dene.';
        if (/resource-exhausted/i.test(k)) return 'Çok fazla deneme yapıldı. Bir dakika sonra tekrar dene.';
        if (/permission-denied/i.test(k)) return 'Bu karekod bu cihaza ait değil.';
        if (/deadline-exceeded/i.test(k)) return 'Karekodun süresi doldu. Yeni karekod al.';
        if (/failed-precondition/i.test(k)) return 'Bu karekod zaten kullanılmış.';
        if (/unauthenticated/i.test(k)) return 'Önce kendi hesabınla giriş yapmalısın.';
        return (e && e.message) ? e.message : 'Beklenmeyen bir hata oldu.';
    }
    function svgKarekod() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="22" height="22">' +
            '<rect x="2.6" y="2.6" width="7.4" height="7.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
            '<rect x="14" y="2.6" width="7.4" height="7.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
            '<rect x="2.6" y="14" width="7.4" height="7.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.9"/>' +
            '<rect x="5.2" y="5.2" width="2.2" height="2.2" fill="currentColor"/>' +
            '<rect x="16.6" y="5.2" width="2.2" height="2.2" fill="currentColor"/>' +
            '<rect x="5.2" y="16.6" width="2.2" height="2.2" fill="currentColor"/>' +
            '<path d="M14 14h3v3h-3zM18.4 14h3v3h-3zM14 18.4h3v3h-3zM18.4 18.4h3v3h-3z" fill="currentColor" opacity=".75"/>' +
            '</svg>';
    }

    /* Pencere iskeleti — iki taraf da aynı kabı kullanır. */
    function pencere(baslikHtml, govdeHtml) {
        kritikStil();
        var k = document.getElementById('qrGirisPencere');
        if (!k) {
            k = document.createElement('div');
            k.id = 'qrGirisPencere';
            k.addEventListener('click', function (e) { if (e.target === k) qrGirisKapat(); });
            document.body.appendChild(k);
            if (!window._qrKacis) {
                window._qrKacis = true;
                document.addEventListener('keydown', function (e) {
                    var p = document.getElementById('qrGirisPencere');
                    if (e.key === 'Escape' && p && p.style.display !== 'none') qrGirisKapat();
                });
            }
        }
        k.innerHTML =
            '<div class="qr-panel" role="dialog" aria-modal="true" aria-label="Karekodla giriş">' +
            '<button type="button" class="qr-kapat" title="Kapat" onclick="qrGirisKapat()">&times;</button>' +
            '<div class="qr-bas">' + baslikHtml + '</div>' +
            '<div class="qr-govde" id="qrGovde">' + govdeHtml + '</div>' +
            '</div>';
        /* Biçim dosyası gelmese bile pencere ortada dursun. */
        k.style.display = 'flex';
        k.style.position = 'fixed';
        k.style.left = '0'; k.style.top = '0'; k.style.right = '0'; k.style.bottom = '0';
        k.style.zIndex = '100000050';   /* #login-modal 100000001 — üstünde kalmalı */
        k.style.alignItems = 'center';
        k.style.justifyContent = 'center';
        return k;
    }

    /* ---------------------------------------------------------------------
       TEŞHİS — "karekod çıkmıyor" dendiğinde nedenin ekranda görünmesi için.
       Eksik olan neyse onu işaretler; her madde tek bir dosyaya/adıma bakar.
       --------------------------------------------------------------------- */
    function tanilama(sunucuHatasi) {
        var maddeler = [
            ['hesap/qrgiris.js yüklendi', true, 'Bu satırı görüyorsan bu dosya zaten yüklü.'],
            ['hesap/qrgiris.css yüklendi', bicimVarMi(), 'Bu dosyayı da GitHub’a yüklemen gerekiyor.'],
            ['Karekod çizici (qrcode.min.js)', !!window.QRCode, 'index.html’deki cdnjs betiği yüklenememiş; ağ engeli olabilir.'],
            ['Firebase “functions” bileşeni', fonksiyonVarMi(), 'index.html’e firebase-functions.js satırı eklenmemiş olabilir.'],
            ['Sunucu işlevleri yayında', !sunucuHatasi, 'functions/KAREKOD-KURULUM.md → “firebase deploy --only functions”.']
        ];
        var h = '<div class="qr-tani"><b>Ne eksik?</b><ul>';
        maddeler.forEach(function (m) {
            h += '<li class="' + (m[1] ? 'var' : 'yok') + '"><span>' + (m[1] ? '✓' : '✗') + '</span>' +
                '<div><b>' + kacis(m[0]) + '</b>' + (m[1] ? '' : '<small>' + kacis(m[2]) + '</small>') + '</div></li>';
        });
        return h + '</ul></div>';
    }
    function bicimVarMi() {
        try {
            var d = document.createElement('div');
            d.className = 'qr-giris-tus';
            d.style.position = 'absolute'; d.style.visibility = 'hidden';
            document.body.appendChild(d);
            var yuvarlak = getComputedStyle(d).borderRadius;
            document.body.removeChild(d);
            return /12px/.test(yuvarlak || '');
        } catch (e) { return false; }
    }
    function fonksiyonVarMi() {
        try { return typeof firebase !== 'undefined' && !!firebase.app && typeof firebase.app().functions === 'function'; }
        catch (e) { return false; }
    }
    function govdeYaz(html) {
        var g = document.getElementById('qrGovde');
        if (g) g.innerHTML = html;
    }

    /* ---------------------------------------------------------------------
       GİRİŞ PENCERESİ İÇİNDE KAREKOD KİPİ
       Karekod artık ayrı bir katmanda değil, giriş penceresinin İÇİNDE
       açılır ve e-posta/şifre formunun YERİNİ alır. Pencere ilk açıldığında
       varsayılan kip budur; isteyen "E-posta ve şifreyle gir" ile klasik
       forma geçer.
       --------------------------------------------------------------------- */
    function modalAlan() { return document.getElementById('qr-modal-alan'); }
    function formAlan() { return document.getElementById('giris-form-alani'); }

    function qrIcerikYaz(baslikHtml, govdeHtml) {
        var alan = modalAlan();
        if (!alan) return false;
        alan.innerHTML =
            '<div class="qr-ic">' +
            '<div class="qr-bas">' + baslikHtml + '</div>' +
            '<div class="qr-govde" id="qrGovde">' + govdeHtml + '</div>' +
            '<button type="button" class="qr-elle-tus" onclick="qrElleGirisAc()">E-posta ve şifreyle gir</button>' +
            '</div>';
        return true;
    }
    /* Karekod kipine geç (form gizlenir). */
    function qrModAc() {
        var alan = modalAlan();
        if (!alan) return false;
        var f = formAlan();
        if (f) f.style.display = 'none';
        alan.style.display = 'block';
        qrHedef = 'modal';
        return true;
    }

    /* SEÇİM EKRANI — giriş penceresi açılınca gelen ilk görünüm.
       Karekod HEMEN üretilmez: büyük karekod kartı durur, tıklanınca
       üretilir. Böylece pencereyi her açan kişi için sunucuda boşuna
       oturum açılmaz; e-postayla girecek olan da beklemez. */
    function qrSecimEkrani() {
        var alan = modalAlan();
        if (!alan) return false;
        qrDurdur();
        qrModAc();
        alan.innerHTML =
            '<div class="qr-sec">' +
            '<button type="button" class="qr-kart" onclick="qrGirisAc()" title="Karekod üret">' +
            '<span class="qr-kart-ikon">' + buyukKarekodSvg() + '</span>' +
            '<span class="qr-kart-yazi"><b>Karekodla Giriş</b>' +
            '<small>Telefonundan onayla — şifre yazmana gerek yok</small></span>' +
            '<span class="qr-kart-ok" aria-hidden="true">›</span>' +
            '</button>' +
            '<button type="button" class="qr-elle-tus" onclick="qrElleGirisAc()">' +
            '<span class="qr-elle-ikon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="20" height="20"><rect x="2.6" y="5.2" width="18.8" height="13.6" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.4 7l8.6 6 8.6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>E-posta ve şifreyle gir</button>' +
            '<div class="qr-kayit">Hesabın yok mu? ' +
            '<button type="button" class="qr-kayit-tus" onclick="qrKayitAc()">Kayıt ol</button></div>' +
            '</div>';
        return true;
    }

    /* Kartta duran büyük karekod çizimi (dekoratif). */
    function buyukKarekodSvg() {
        return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
            '<rect x="3" y="3" width="24" height="24" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>' +
            '<rect x="37" y="3" width="24" height="24" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>' +
            '<rect x="3" y="37" width="24" height="24" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>' +
            '<rect x="11" y="11" width="8" height="8" rx="1.6" fill="currentColor"/>' +
            '<rect x="45" y="11" width="8" height="8" rx="1.6" fill="currentColor"/>' +
            '<rect x="11" y="45" width="8" height="8" rx="1.6" fill="currentColor"/>' +
            '<g opacity=".8"><rect x="37" y="37" width="9" height="9" rx="1.6" fill="currentColor"/>' +
            '<rect x="52" y="37" width="9" height="9" rx="1.6" fill="currentColor"/>' +
            '<rect x="37" y="52" width="9" height="9" rx="1.6" fill="currentColor"/>' +
            '<rect x="52" y="52" width="9" height="9" rx="1.6" fill="currentColor"/></g>' +
            '<rect class="qr-tarama" x="0" y="30" width="64" height="3.4" rx="1.7" fill="currentColor" opacity=".55"/>' +
            '</svg>';
    }
    /* Klasik forma dön (karekod durur). */
    /* Seçim ekranındaki "Kayıt ol": klasik formu açar ve KAYIT kipine geçer. */
    function qrKayitAc() {
        qrElleGirisAc();
        try {
            if (typeof isLoginMode !== 'undefined' && isLoginMode && typeof moduDegistir === 'function') moduDegistir();
        } catch (e) { }
    }

    function qrElleGirisAc() {
        qrDurdur();
        var alan = modalAlan();
        if (alan) { alan.style.display = 'none'; alan.innerHTML = ''; }
        var f = formAlan();
        if (f) f.style.display = '';
        qrHedef = 'pencere';
    }
    function girisPenceresiAcikMi() {
        var m = document.getElementById('login-modal');
        return !!m && getComputedStyle(m).display !== 'none';
    }
    /* Sayaç/sorgu döngülerini durdurur (kip değişince ya da kapanışta). */
    function qrDurdur() {
        if (!qrDurum) return;
        clearInterval(qrDurum.sayacId);
        clearInterval(qrDurum.sormaId);
        qrDurum = null;
    }

    function qrGirisKapat() {
        qrDurdur();
        var k = document.getElementById('qrGirisPencere');
        if (k) k.style.display = 'none';
    }

    /* ================================================================
       A) TAHTA TARAFI
       ================================================================ */
    function qrGirisAc() {
        qrDurdur();
        var basSvg = svgKarekod() + '<span>Karekodla Giriş</span>';
        var yukleniyor = '<div class="qr-yukleniyor">Karekod hazırlanıyor…</div>';
        /* Giriş penceresi açıksa karekod ONUN İÇİNDE, formun yerine çizilir;
           değilse (ör. doğrudan çağrıldıysa) eski ayrı katman kullanılır. */
        if (modalAlan() && girisPenceresiAcikMi()) {
            qrModAc();
            qrIcerikYaz(basSvg, yukleniyor);
        } else {
            qrHedef = 'pencere';
            pencere(basSvg, yukleniyor);
        }

        var baslat;
        try { baslat = cagir('qrOturumBaslat'); }
        catch (e) { govdeYaz(uyariHtml(hataMetni(e), true)); return; }

        baslat({}).then(function (c) {
            var d = c.data || {};
            if (!d.oturumId) throw new Error('internal');
            qrDurum = {
                oturumId: d.oturumId,
                gizli: d.gizli,
                dogrulama: d.dogrulama,
                bitis: Date.now() + (d.omurSn || 120) * 1000,
                sayacId: 0, sormaId: 0
            };
            karekoduCiz();
        }).catch(function (e) {
            govdeYaz(uyariHtml(hataMetni(e), true));
        });
    }

    function onayBaglantisi(oturumId) {
        /* Telefon kamerası bu adresi açacak; ?qr= parametresi vitrin
           kapısını da atlatır (bkz. index.html ilk script). */
        var kok = location.origin + location.pathname.replace(/[^\/]*$/, '');
        return kok + 'index.html?qr=' + encodeURIComponent(oturumId);
    }

    function karekoduCiz() {
        var baglanti = onayBaglantisi(qrDurum.oturumId);
        govdeYaz(
            '<p class="qr-anlat">Telefonundan <b>kamerayı aç</b> ve aşağıdaki karekodu okut. ' +
            'Açılan sayfada <b>Onayla</b> dediğinde bu ekran senin hesabınla açılır — şifre yazmana gerek yok.</p>' +
            '<div class="qr-kutu" id="qrKutu"></div>' +
            '<div class="qr-kod-satir">Doğrulama kodu <b id="qrDogrulama">' + kacis(qrDurum.dogrulama) + '</b>' +
            '<small>Telefonunda da bu kod yazmalı.</small></div>' +
            '<div class="qr-sayac" id="qrSayac"></div>' +
            '<div class="qr-durum bekliyor" id="qrDurumSatir">Telefondan onay bekleniyor…</div>' +
            '<div class="qr-alt"><a href="' + kacis(baglanti) + '" target="_blank" rel="noopener">Bağlantıyı elle aç</a>' +
            '<button type="button" class="qr-yenile" onclick="qrGirisAc()">Yeni karekod</button></div>'
        );

        /* Karekod çizici (qrcode.min.js) CDN'den gelir; ağ yavaşsa henüz
           yüklenmemiş olabilir. 3 saniye boyunca beklenir, gelmezse
           "bağlantıyı elle aç" seçeneğiyle devam edilir. */
        cizmeyiDene(baglanti, 0);

        qrDurum.sayacId = setInterval(sayaciYaz, 500);
        sayaciYaz();
        qrDurum.sormaId = setInterval(sor, SORMA_ARALIK);
    }

    function cizmeyiDene(baglanti, deneme) {
        var kutu = document.getElementById('qrKutu');
        if (!kutu) return;
        if (window.QRCode) {
            kutu.innerHTML = '';
            try {
                new window.QRCode(kutu, {
                    text: baglanti, width: 216, height: 216,
                    correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : undefined
                });
            } catch (e) {
                kutu.innerHTML = '<div class="qr-yok">Karekod çizilemedi. Aşağıdaki bağlantıyı telefonda açabilirsin.</div>';
            }
            return;
        }
        if (deneme < 15) {
            kutu.innerHTML = '<div class="qr-yok">Karekod hazırlanıyor…</div>';
            setTimeout(function () { cizmeyiDene(baglanti, deneme + 1); }, 200);
            return;
        }
        kutu.innerHTML = '<div class="qr-yok">Karekod bileşeni yüklenemedi (ağ engeli olabilir).<br>' +
            'Aşağıdaki <b>“Bağlantıyı elle aç”</b> ile telefonda açıp onaylayabilirsin.</div>';
    }

    function sayaciYaz() {
        if (!qrDurum) return;
        var el = document.getElementById('qrSayac');
        var kalan = Math.max(0, Math.round((qrDurum.bitis - Date.now()) / 1000));
        if (el) el.textContent = kalan > 0 ? ('Geçerlilik: ' + kalan + ' sn') : 'Süre doldu';
        if (kalan <= 0) {
            clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
            durumYaz('suredoldu', 'Karekodun süresi doldu. "Yeni karekod" ile tekrar dene.');
        }
    }
    function durumYaz(sinif, yazi) {
        var el = document.getElementById('qrDurumSatir');
        if (!el) return;
        el.className = 'qr-durum ' + sinif;
        el.textContent = yazi;
    }

    function sor() {
        if (!qrDurum) return;
        var f;
        try { f = cagir('qrOturumSor'); } catch (e) { return; }
        f({ oturumId: qrDurum.oturumId, gizli: qrDurum.gizli }).then(function (c) {
            var d = c.data || {};
            if (!qrDurum) return;
            qrDurum.hataSayisi = 0;
            if (d.durum === 'onayli' && d.jeton) {
                clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
                durumYaz('onayli', 'Onaylandı, giriş yapılıyor…');
                firebase.auth().signInWithCustomToken(d.jeton).then(function () {
                    durumYaz('onayli', (d.ad || d.eposta || 'Hoş geldin') + ' — giriş yapıldı, sayfa yenileniyor…');
                    /* Aynı tarayıcının ÖTEKİ sekmelerine haber ver: Firebase
                       oturumu köken (origin) genelinde ortaktır, yani eski
                       hesap zaten düştü — ama o sekmeler eski ekranı
                       göstermeye devam ediyordu. Haberi alan sekme kendini
                       yeniler, böylece hepsi yeni hesaba geçer. */
                    try { localStorage.setItem(QR_KANAL, String(new Date().getTime())); } catch (e) { }
                    /* BU sekme de yenilenir. Sebebi: sayfa "misafir" durumdayken
                       açılmıştı; rol, oturum kurulduktan SONRA Firestore'daki
                       hesap belgesinden çözülüyor ve bu yarışta varsayılan
                       "öğrenci" ekranda kalabiliyordu (öğretmen hesabı öğrenci
                       gibi görünüyordu). Yenileme, tahtayı normal bir girişten
                       farksız hale getirir: rol, paketler, menü — hepsi
                       sıfırdan ve doğru kurulur. */
                    setTimeout(function () {
                        try { location.reload(); }
                        catch (e) {
                            qrGirisKapat();
                            try { if (typeof closeLoginModal === 'function') closeLoginModal(); } catch (e2) { }
                        }
                    }, 1000);
                }).catch(function (e) {
                    durumYaz('hata', 'Giriş tamamlanamadı: ' + hataMetni(e));
                });
                return;
            }
            if (d.durum === 'reddedildi') {
                clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
                durumYaz('hata', 'İstek telefondan reddedildi.');
                return;
            }
            if (d.durum === 'suredoldu' || d.durum === 'yok') {
                clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
                durumYaz('suredoldu', 'Karekod geçersiz. "Yeni karekod" ile tekrar dene.');
            }
        }).catch(function (e) {
            if (!qrDurum) return;
            var k = (e && e.code) || '';
            /* Kalıcı hatalarda hemen dur. Ötekilerde bir kez daha dene ama
               ikinci kez de olursa NEDENİ YAZ — eskiden sessizce sormaya
               devam ediyordu, tahta sonsuza kadar "onay bekleniyor"da
               kalıyor, kullanıcı hiçbir şey olmadı sanıyordu. */
            qrDurum.hataSayisi = (qrDurum.hataSayisi || 0) + 1;
            if (/permission-denied|failed-precondition/.test(k) || qrDurum.hataSayisi >= 2) {
                clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
                durumYaz('hata', hataMetni(e));
            }
        });
    }

    function uyariHtml(mesaj, sunucuHatasi) {
        return '<div class="qr-uyari">' + kacis(mesaj) + '</div>' +
            tanilama(!!sunucuHatasi) +
            '<div class="qr-alt"><button type="button" class="qr-yenile" onclick="qrGirisAc()">Tekrar dene</button></div>';
    }

    /* ================================================================
       B) TELEFON TARAFI — onay ekranı
       ================================================================ */
    function qrOnayKontrol() {
        var id = '', amac = '';
        try {
            var p = new URLSearchParams(location.search);
            id = p.get('qr') || '';
            amac = p.get('amac') || '';
        } catch (e) { return; }
        if (!id) return;

        /* Adresi hemen temizle: yenilemede tekrar onay ekranı açılmasın
           ve bağlantı geçmişte/paylaşımda kalmasın. */
        try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { }

        if (!girisliMi()) {
            qrBeklemedekiOnay = id;
            qrBeklemedekiAmac = amac;
            pencere(svgKarekod() + '<span>Karekod onayı</span>',
                '<p class="qr-anlat">Bu isteği onaylamak için önce <b>kendi hesabınla</b> giriş yapmalısın. ' +
                'Giriş yaptıktan sonra onay ekranı kendiliğinden açılacak.</p>' +
                '<div class="qr-alt"><button type="button" class="qr-yenile" onclick="qrGirisKapat(); if(typeof showLoginModal===\'function\') showLoginModal();">Giriş Yap</button></div>');
            return;
        }
        qrOnayAc(id, amac);
    }

    /* amac='onay' → TAHTADAKİ OTURUMUN GÜVENLİK DOĞRULAMASI (yeni giriş DEĞİL).
       Sınıfta PIN yazmamak için: tahta karekodu gösterir, öğretmen kendi
       telefonunda onaylar, tahtadaki duyarlı işlem açılır. */
    function qrOnayAc(id, amac) {
        var onayKipi = (amac === 'onay');
        pencere(svgKarekod() + '<span>' + (onayKipi ? 'Güvenlik onayı' : 'Karekod onayı') + '</span>',
            '<div class="qr-yukleniyor">İstek kontrol ediliyor…</div>');
        var f;
        try { f = cagir('qrOturumBilgi'); } catch (e) { govdeYaz(uyariHtml(hataMetni(e))); return; }

        f({ oturumId: id }).then(function (c) {
            var d = c.data || {};
            if (d.durum !== 'bekliyor') {
                govdeYaz('<div class="qr-uyari">Bu istek artık geçerli değil (' + kacis(d.durum) + ').</div>');
                return;
            }
            var kim = '';
            try { var u = firebase.auth().currentUser; kim = (u && (u.displayName || u.email)) || ''; } catch (e) { }
            govdeYaz(
                (onayKipi
                    ? '<p class="qr-anlat">Tahtadaki cihaz <b>not girişi / öğrenci verisi</b> için senden onay istiyor. ' +
                      'Onaylarsan o cihazda 15 dakika boyunca yeniden sorulmaz. <b>Yeni bir giriş açılmaz.</b></p>'
                    : '<p class="qr-anlat">Bir cihaz senin hesabınla giriş yapmak istiyor.</p>') +
                '<div class="qr-bilgi"><span>İstekte bulunan cihaz</span><b>' + kacis(d.cihaz || 'Bilinmiyor') + '</b></div>' +
                '<div class="qr-bilgi"><span>' + (onayKipi ? 'Onayı veren hesap' : 'Giriş yapılacak hesap') + '</span><b>' + kacis(kim || '—') + '</b></div>' +
                '<div class="qr-kod-satir buyuk">Doğrulama kodu <b>' + kacis(d.dogrulama) + '</b>' +
                '<small>Bu kod karekodun altındakiyle <b>aynı değilse onaylama.</b></small></div>' +
                '<div class="qr-sayac" id="qrSayac">Geçerlilik: ' + (d.kalanSn || 0) + ' sn</div>' +
                '<div class="qr-onay-tuslar">' +
                '<button type="button" class="qr-ret" id="qrRetTus">Reddet</button>' +
                '<button type="button" class="qr-onay" id="qrOnayTus">Onayla</button>' +
                '</div>' +
                '<div class="qr-durum" id="qrDurumSatir"></div>'
            );
            var bitis = Date.now() + (d.kalanSn || 0) * 1000;
            var sy = setInterval(function () {
                var el = document.getElementById('qrSayac');
                if (!el) { clearInterval(sy); return; }
                var kalan = Math.max(0, Math.round((bitis - Date.now()) / 1000));
                el.textContent = kalan > 0 ? ('Geçerlilik: ' + kalan + ' sn') : 'Süre doldu';
                if (kalan <= 0) clearInterval(sy);
            }, 500);

            var karar = function (secim) {
                var t1 = document.getElementById('qrOnayTus'), t2 = document.getElementById('qrRetTus');
                if (t1) t1.disabled = true;
                if (t2) t2.disabled = true;
                durumYaz('bekliyor', secim === 'onay' ? 'Onaylanıyor…' : 'Reddediliyor…');
                var g;
                try { g = cagir('qrOturumOnayla'); } catch (e) { durumYaz('hata', hataMetni(e)); return; }
                g({ oturumId: id, karar: secim }).then(function () {
                    clearInterval(sy);
                    govdeYaz(secim === 'onay'
                        ? '<div class="qr-bitti iyi">✓ Onaylandı. ' +
                          (onayKipi ? 'Tahtadaki işlem birkaç saniye içinde açılır.' : 'Diğer cihazda giriş birkaç saniye içinde tamamlanır.') + '</div>'
                        : '<div class="qr-bitti">İstek reddedildi.</div>');
                }).catch(function (e) {
                    durumYaz('hata', hataMetni(e));
                    if (t1) t1.disabled = false;
                    if (t2) t2.disabled = false;
                });
            };
            var o = document.getElementById('qrOnayTus'), r = document.getElementById('qrRetTus');
            if (o) o.addEventListener('click', function () { karar('onay'); });
            if (r) r.addEventListener('click', function () { karar('ret'); });
        }).catch(function (e) {
            govdeYaz('<div class="qr-uyari">' + kacis(hataMetni(e)) + '</div>');
        });
    }

    /* Giriş yapılmadan gelindiyse: oturum açılınca onay ekranını getir. */
    function bekleyeniAc() {
        if (!qrBeklemedekiOnay) return;
        var id = qrBeklemedekiOnay, amac = qrBeklemedekiAmac;
        qrBeklemedekiOnay = null; qrBeklemedekiAmac = '';
        setTimeout(function () { qrOnayAc(id, amac); }, 400);
    }

    /* Öteki sekmelerden gelen "karekodla giriş yapıldı" haberi.
       storage olayı yalnız DİĞER sekmelerde tetiklenir; giriş yapan
       sekme kendini yenilemez. */
    function sekmeDinle() {
        window.addEventListener('storage', function (e) {
            if (e.key !== QR_KANAL || !e.newValue) return;
            try { location.reload(); } catch (x) { }
        });
    }

    /* Giriş penceresi her açıldığında KAREKOD kipiyle başlasın.
       showLoginModal auth.js'te tanımlı; dosyaya dokunmadan sarmalıyoruz. */
    function girisPenceresiniSarmala() {
        if (typeof window.showLoginModal !== 'function' || window._qrSarmalandi) return;
        window._qrSarmalandi = true;
        var eski = window.showLoginModal;
        window.showLoginModal = function () {
            var sonuc = eski.apply(this, arguments);
            try {
                if (modalAlan()) {
                    /* Onay ekranı beklerken (telefon tarafı) araya girme.
                       Karekod ÜRETİLMEZ; yalnız seçim ekranı gösterilir. */
                    if (!qrBeklemedekiOnay) setTimeout(function () { qrSecimEkrani(); }, 30);
                }
            } catch (e) { }
            return sonuc;
        };
        /* Pencere kapanınca sayaç/sorgu boşuna dönmesin. */
        if (typeof window.closeLoginModal === 'function' && !window._qrKapatSarmali) {
            window._qrKapatSarmali = true;
            var eskiKapat = window.closeLoginModal;
            window.closeLoginModal = function () {
                try { if (qrHedef === 'modal') qrDurdur(); } catch (e) { }
                return eskiKapat.apply(this, arguments);
            };
        }
    }

    /* ------------------------------------------------------------ kurulum */
    function kur() {
        sekmeDinle();
        girisPenceresiniSarmala();
        try {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().onAuthStateChanged(function (u) {
                    if (u && !u.isAnonymous) bekleyeniAc();
                });
            }
        } catch (e) { }
        qrOnayKontrol();
    }
    try {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
        else kur();
    } catch (e) { console.warn('qrgiris kurulum', e); }

})();
