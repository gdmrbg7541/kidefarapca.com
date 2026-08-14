/* ==================================================================
   OTURUM GÜVENLİĞİ — kidefarapca.com
   Öğretmen akıllı tahtada not girip çıkış yapmayı unutabiliyor. İki
   katmanlı koruma:

   1) BOŞTA KALMA → ÇIKIŞ
      40 dakika hareketsizlikten sonra oturum tamamen kapanır. 39.
      dakikada geri sayımlı bir uyarı çıkar; "Devam et" sayacı sıfırlar.
      Hareket sayacı SEKMELER ARASI ORTAKTIR (localStorage + storage
      olayı): index'ten yeni sekmede kart açan öğretmen atılmaz.
      Oynayan video/ses de hareket sayılır.

   2) DUYARLI İŞLEMDE DOĞRULAMA — ÖNCE TELEFON, YEDEK PIN
      Not girişi ve öğrenci verisi, son doğrulamanın üstünden 15 dakika
      geçtiyse ya da masadan 3 dakika uzaklaşıldıysa yeniden doğrulama
      ister.

      ASIL YOL — TELEFONDAN ONAY (karekod):
      Tahtada HİÇBİR SIR GÖSTERİLMEZ. Tahta bir karekod çizer, öğretmen
      kendi telefonuyla okutur, telefonda (zaten kendi hesabıyla girişli)
      "Onayla" der; tahta 15 dakikalığına doğrulanmış sayılır. Sınıfta
      şifre/PIN seyreden öğrenci diye bir sorun kalmaz. Karekodu
      fotoğraflayan öğrencinin de işine yaramaz: onay ancak AYNI hesapla
      girişli bir cihazdan verilebilir, üstelik tahta dönen onayın
      e-postasını kendi hesabıyla karşılaştırır. Sunucudan gelen giriş
      jetonu KULLANILMAZ — oturum yeniden açılmaz, yalnız "onaylayan
      gerçekten bu öğretmen mi" bilgisi alınır.

      YEDEK — PIN: telefon yanında değilse ya da karekod sunucusu
      kapalıysa. PIN cihazda ÖZETLENMİŞ (SHA-256) saklanır, düz metin
      hiçbir yere yazılmaz. 3 yanlış denemede oturum kapanır. Ekranda
      "tahta yansıtılıyorsa PIN yazma" uyarısı çıkar.

      TAM GİRİŞ (e-posta + şifre) İSTENMEZ: tahtada şifre yazmak
      PIN'den de tehlikelidir — şifre hem daha uzun süre seyredilir
      hem de her şeyi açar.

   Bu dosya kendi başına yeter: stilini de kendi yazar, sitedeki hiçbir
   fonksiyonun içine dokunmaz — yalnız switchTab ve behKaydet'i sarar.
   ================================================================== */
(function () {
    'use strict';
    if (window.KidefGuvenlik) return;

    /* ---------------- ayarlar ---------------- */
    var BOSTA_DK = 40;      /* bu kadar hareketsizlikten sonra çıkış */
    var UYARI_SN = 60;      /* çıkıştan kaç saniye önce uyarı        */
    var PIN_TAZE_DK = 15;   /* doğrulama bu kadar süre geçerli       */
    var PIN_BOSTA_DK = 3;   /* masadan bu kadar uzaklaşınca düşer    */
    var PIN_UZ = 4;         /* PIN hane sayısı                       */
    var YANLIS_HAK = 3;

    var HAREKET_ANAHTAR = 'kg_son_hareket';
    function pinAnahtar(uid) { return 'kg_pin_' + (uid || 'yerel'); }

    /* ---------------- durum ---------------- */
    var sonHareketZ = Date.now();
    var sonDogrulama = 0;
    var uyariAcik = false, uyariKalan = 0, uyariSayac = null;
    var yanlis = 0;
    var perde = null;

    function suan() { return Date.now(); }
    function dk(n) { return n * 60000; }

    function kullanici() {
        try {
            if (!window.firebase || !firebase.auth) return null;
            return firebase.auth().currentUser || null;
        } catch (e) { return null; }
    }
    function girisliMi() {
        if (!kullanici()) return false;
        try { if (appState && appState.currentUser === 'Misafir Öğrenci') return false; } catch (e) { }
        return true;
    }

    /* ---------------- hareket takibi (sekmeler arası ortak) ---------------- */
    function hareketYaz() {
        sonHareketZ = suan();
        try { localStorage.setItem(HAREKET_ANAHTAR, String(sonHareketZ)); } catch (e) { }
    }
    function sonHareket() {
        var y = 0;
        try { y = parseInt(localStorage.getItem(HAREKET_ANAHTAR) || '0', 10) || 0; } catch (e) { }
        return Math.max(sonHareketZ, y);
    }
    function medyaOynuyor() {
        try {
            var m = document.querySelectorAll('video, audio');
            for (var i = 0; i < m.length; i++) if (!m[i].paused && !m[i].ended) return true;
        } catch (e) { }
        return false;
    }
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'input'].forEach(function (t) {
        document.addEventListener(t, function () { if (!uyariAcik) hareketYaz(); }, { passive: true, capture: true });
    });
    window.addEventListener('storage', function (e) {
        if (e && e.key === HAREKET_ANAHTAR) {
            var y = parseInt(e.newValue || '0', 10) || 0;
            if (y > sonHareketZ) { sonHareketZ = y; if (uyariAcik) uyariKapat(); }
        }
    });

    /* ---------------- çıkış ---------------- */
    function cik() {
        uyariKapat();
        sonDogrulama = 0;
        try { localStorage.removeItem(HAREKET_ANAHTAR); } catch (e) { }
        try {
            if (typeof window.cikisYap === 'function') window.cikisYap();
            else if (window.firebase && firebase.auth) firebase.auth().signOut();
        } catch (e) { }
    }

    /* ---------------- perde (ortak pencere) ---------------- */
    function stilKur() {
        if (document.getElementById('kgStil')) return;
        var st = document.createElement('style');
        st.id = 'kgStil';
        st.textContent = [
            '.kg-perde{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;',
            'background:rgba(16,22,30,.62);backdrop-filter:blur(4px);padding:18px;font-family:inherit}',
            '.kg-kutu{background:#fff;border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,.35);padding:26px 28px;',
            'max-width:420px;width:100%;text-align:center;animation:kgGel .22s ease both}',
            '@keyframes kgGel{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}',
            '.kg-ikon{width:56px;height:56px;margin:0 auto 12px;display:grid;place-items:center;border-radius:50%;',
            'background:#FFF1D6}',
            '.kg-ikon svg{width:30px;height:30px;fill:none;stroke:#E08A00;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}',
            '.kg-bas{font-size:1.18rem;font-weight:800;color:#1F2430;margin:0 0 6px}',
            '.kg-alt{font-size:.94rem;color:#6B7280;line-height:1.55;margin:0 0 16px}',
            '.kg-sayac{font-size:2.4rem;font-weight:900;color:#D81E05;line-height:1;margin:4px 0 14px;',
            'font-variant-numeric:tabular-nums}',
            '.kg-tus{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
            '.kg-tus button{font:inherit;font-weight:800;border:0;border-radius:12px;padding:12px 20px;cursor:pointer;transition:.16s}',
            '.kg-ana{background:#16A085;color:#fff}.kg-ana:hover{filter:brightness(1.08);transform:translateY(-1px)}',
            '.kg-ikincil{background:#EEF2F7;color:#425061}',
            '.kg-ikincil:hover{background:#E3E9F1}',
            '.kg-pin{display:flex;gap:10px;justify-content:center;margin:6px 0 14px}',
            '.kg-pin input{width:52px;height:60px;text-align:center;font-size:1.7rem;font-weight:900;',
            'border:2px solid #E3E9F1;border-radius:14px;background:#F8FAFC;color:#1F2430;-moz-appearance:textfield}',
            '.kg-pin input:focus{outline:0;border-color:#16A085;background:#fff}',
            '.kg-pin input::-webkit-outer-spin-button,.kg-pin input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}',
            '.kg-hata{color:#D81E05;font-size:.88rem;font-weight:700;min-height:20px;margin:0 0 8px}',
            '.kg-bag{background:none;border:0;color:#8A94A3;font:inherit;font-size:.85rem;text-decoration:underline;',
            'cursor:pointer;margin-top:12px}',
            '.kg-bag:hover{color:#425061}',
            /* telefon onayı (karekod) */
            '.kg-qr{width:188px;min-height:188px;margin:2px auto 10px;padding:9px;border:2px solid #E9EEF5;',
            'border-radius:16px;background:#fff;display:grid;place-items:center;overflow:hidden}',
            '.kg-qr img,.kg-qr canvas{display:block;width:168px;height:168px}',
            '.kg-qrbekle{font-size:.86rem;color:#8A94A3}',
            '.kg-adres{font-size:.78rem;color:#16A085;word-break:break-all;text-decoration:underline;padding:6px}',
            '.kg-kod{font-size:.9rem;color:#425061;margin:0 0 8px}',
            '.kg-kod b{font-size:1.3rem;letter-spacing:.18em;color:#1F2430;margin-inline-start:6px}',
            '.kg-kod small{display:block;font-size:.77rem;color:#8A94A3;margin-top:3px}',
            '.kg-not{font-size:.8rem;color:#9A6A00;background:#FFF6E5;border:1px solid #FBE3B4;border-radius:10px;',
            'padding:8px 10px;margin:0 0 12px;line-height:1.45;text-align:start}'
        ].join('');
        document.head.appendChild(st);
    }
    function perdeAc(icHtml) {
        stilKur();
        perdeKapat();
        perde = document.createElement('div');
        perde.className = 'kg-perde';
        perde.innerHTML = '<div class="kg-kutu">' + icHtml + '</div>';
        document.body.appendChild(perde);
        return perde;
    }
    function perdeKapat() {
        if (perde && perde.parentNode) perde.parentNode.removeChild(perde);
        perde = null;
    }
    var SAAT_IKON = '<span class="kg-ikon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/></svg></span>';
    var KILIT_IKON = '<span class="kg-ikon"><svg viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.6"/><path d="M8.2 10.5V7.6a3.8 3.8 0 0 1 7.6 0v2.9"/><circle cx="12" cy="15.6" r="1.4"/></svg></span>';
    var TELEFON_IKON = '<span class="kg-ikon"><svg viewBox="0 0 24 24"><rect x="6.6" y="2.5" width="10.8" height="19" rx="2.6"/><path d="M10.4 5.4h3.2"/><circle cx="12" cy="18" r="1.15"/></svg></span>';

    /* ---------------- 1) boşta kalma uyarısı ---------------- */
    function uyariAc() {
        if (uyariAcik) return;
        uyariAcik = true;
        uyariKalan = UYARI_SN;
        perdeAc(
            SAAT_IKON +
            '<p class="kg-bas">Oturumun kapanıyor</p>' +
            '<p class="kg-alt">Bir süredir işlem yapılmadı. Güvenlik için oturum kendiliğinden kapanacak.</p>' +
            '<div class="kg-sayac" id="kgSayac">' + uyariKalan + '</div>' +
            '<div class="kg-tus">' +
            '<button class="kg-ana" id="kgDevam">Devam et</button>' +
            '<button class="kg-ikincil" id="kgSimdiCik">Şimdi çık</button>' +
            '</div>'
        );
        document.getElementById('kgDevam').onclick = function () { hareketYaz(); uyariKapat(); };
        document.getElementById('kgSimdiCik').onclick = function () { cik(); };
        uyariSayac = setInterval(function () {
            uyariKalan--;
            var el = document.getElementById('kgSayac');
            if (el) el.textContent = uyariKalan;
            if (uyariKalan <= 0) cik();
        }, 1000);
    }
    function uyariKapat() {
        if (uyariSayac) { clearInterval(uyariSayac); uyariSayac = null; }
        if (uyariAcik) { uyariAcik = false; perdeKapat(); }
    }

    /* ---------------- 2) PIN ---------------- */
    function ozet(metin) {
        try {
            if (window.crypto && crypto.subtle && crypto.subtle.digest) {
                var veri = new TextEncoder().encode(metin);
                return crypto.subtle.digest('SHA-256', veri).then(function (b) {
                    return Array.prototype.map.call(new Uint8Array(b), function (x) {
                        return ('00' + x.toString(16)).slice(-2);
                    }).join('');
                });
            }
        } catch (e) { }
        /* Yedek: crypto yoksa basit karma (yine düz metin saklanmaz). */
        var h = 5381; for (var i = 0; i < metin.length; i++) h = ((h * 33) ^ metin.charCodeAt(i)) >>> 0;
        return Promise.resolve('y' + h.toString(16));
    }
    function pinTuz() { var u = kullanici(); return (u ? u.uid : 'yerel') + '|kidef|'; }
    function pinVarMi() {
        var u = kullanici();
        try { return !!localStorage.getItem(pinAnahtar(u ? u.uid : '')); } catch (e) { return false; }
    }
    function pinYaz(pin) {
        var u = kullanici();
        return ozet(pinTuz() + pin).then(function (h) {
            try { localStorage.setItem(pinAnahtar(u ? u.uid : ''), h); } catch (e) { }
        });
    }
    function pinDogru(pin) {
        var u = kullanici(), kayit = '';
        try { kayit = localStorage.getItem(pinAnahtar(u ? u.uid : '')) || ''; } catch (e) { }
        if (!kayit) return Promise.resolve(false);
        return ozet(pinTuz() + pin).then(function (h) { return h === kayit; });
    }

    function haneler(id) {
        var s = '';
        for (var i = 0; i < PIN_UZ; i++) {
            s += '<input type="tel" inputmode="numeric" maxlength="1" autocomplete="off" data-i="' + i + '">';
        }
        return '<div class="kg-pin" id="' + id + '">' + s + '</div>';
    }
    function haneleriBagla(kap, bitince) {
        var gir = [].slice.call(kap.querySelectorAll('input'));
        function deger() { return gir.map(function (g) { return g.value; }).join(''); }
        gir.forEach(function (g, i) {
            g.addEventListener('input', function () {
                g.value = (g.value || '').replace(/[^0-9]/g, '').slice(0, 1);
                if (g.value && gir[i + 1]) gir[i + 1].focus();
                if (deger().length === PIN_UZ) bitince(deger());
            });
            g.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && !g.value && gir[i - 1]) gir[i - 1].focus();
            });
        });
        setTimeout(function () { gir[0] && gir[0].focus(); }, 60);
        return { temizle: function () { gir.forEach(function (g) { g.value = ''; }); gir[0].focus(); } };
    }

    /* PIN belirleme (ilk kullanım) */
    function pinKur(tamam) {
        var adim = 1, ilk = '';
        function ciz() {
            perdeAc(
                KILIT_IKON +
                '<p class="kg-bas">' + (adim === 1 ? 'Güvenlik PIN’i belirle' : 'PIN’i tekrar gir') + '</p>' +
                '<p class="kg-alt">' + (adim === 1
                    ? 'Not girişi ve öğrenci verisi için ' + PIN_UZ + ' haneli bir PIN belirle. Tahtada şifreni yazmak zorunda kalmazsın.'
                    : 'Doğrulamak için aynı PIN’i bir kez daha gir.') + '</p>' +
                haneler('kgPinKap') +
                '<p class="kg-hata" id="kgHata"></p>' +
                '<div class="kg-tus"><button class="kg-ikincil" id="kgVazgec">Vazgeç</button></div>'
            );
            var k = haneleriBagla(document.getElementById('kgPinKap'), function (v) {
                if (adim === 1) { ilk = v; adim = 2; ciz(); return; }
                if (v !== ilk) {
                    document.getElementById('kgHata').textContent = 'PIN’ler aynı değil, baştan dene.';
                    adim = 1; ilk = '';
                    setTimeout(ciz, 700);
                    return;
                }
                pinYaz(v).then(function () { perdeKapat(); sonDogrulama = suan(); yanlis = 0; if (tamam) tamam(); });
            });
            document.getElementById('kgVazgec').onclick = function () { perdeKapat(); };
            void k;
        }
        ciz();
    }

    /* PIN sorma — YEDEK yol (asıl yol telefon onayı) */
    function pinIste(tamam) {
        qrDur();
        if (!pinVarMi()) { pinKur(tamam); return; }
        perdeAc(
            KILIT_IKON +
            '<p class="kg-bas">PIN gerekli</p>' +
            '<p class="kg-alt">Not girişi ve öğrenci verisi için güvenlik PIN’ini gir.</p>' +
            '<p class="kg-not">⚠️ Ekran tahtaya yansıyorsa PIN’i sınıf görebilir. ' +
            'Mümkünse <b>telefonla onayla</b> — tahtada hiçbir şey yazmazsın.</p>' +
            haneler('kgPinKap') +
            '<p class="kg-hata" id="kgHata"></p>' +
            '<div class="kg-tus">' +
            '<button class="kg-ana" id="kgTelefonGec">Telefonla onayla</button>' +
            '<button class="kg-ikincil" id="kgVazgec">Vazgeç</button></div>' +
            '<button class="kg-bag" id="kgUnuttum">PIN’i unuttum — çıkış yap</button>'
        );
        document.getElementById('kgTelefonGec').onclick = function () { telefonKapali = false; telefonOnay(tamam); };
        var k = haneleriBagla(document.getElementById('kgPinKap'), function (v) {
            pinDogru(v).then(function (ok) {
                if (ok) { perdeKapat(); sonDogrulama = suan(); yanlis = 0; hareketYaz(); if (tamam) tamam(); return; }
                yanlis++;
                if (yanlis >= YANLIS_HAK) {
                    document.getElementById('kgHata').textContent = 'Çok fazla yanlış deneme — oturum kapatılıyor.';
                    setTimeout(cik, 900);
                    return;
                }
                document.getElementById('kgHata').textContent =
                    'PIN hatalı. Kalan hak: ' + (YANLIS_HAK - yanlis);
                k.temizle();
            });
        });
        document.getElementById('kgVazgec').onclick = function () { perdeKapat(); };
        document.getElementById('kgUnuttum').onclick = function () { cik(); };
    }

    /* ---------------- 2b) TELEFONDAN ONAY (karekod) ----------------
       Tahtada sır yazılmaz. Akış:
         tahta  → qrOturumBaslat  → karekod + doğrulama kodu
         telefon→ index.html?qr=…&amac=onay → "Onayla"
         tahta  → qrOturumSor (2 sn'de bir) → onaylı + e-posta
       Dönen e-posta tahtadaki hesapla aynı değilse işlem AÇILMAZ.
       Sunucudan gelen giriş jetonu bilerek kullanılmaz: oturum yeniden
       açılmaz, sınıf listesi/sekme durumu bozulmaz.               */
    var QR_BOLGE = 'europe-west1';          /* functions/index.js ile aynı */
    var qrSorma = null;
    var telefonKapali = false;              /* sunucu kapalıysa doğrudan PIN'e geç */
    try { telefonKapali = sessionStorage.getItem('kg_tel_kapali') === '1'; } catch (e) { }

    function qrDur() { if (qrSorma) { clearInterval(qrSorma); qrSorma = null; } }
    function islev(ad) {
        if (!window.firebase || !firebase.app) throw new Error('firebase yok');
        var u = firebase.app();
        if (!u.functions) throw new Error('functions yok');
        return u.functions(QR_BOLGE).httpsCallable(ad);
    }
    function epostam() { var u = kullanici(); return String((u && u.email) || '').toLowerCase(); }

    function telefonOnay(tamam) {
        qrDur();
        perdeAc(
            TELEFON_IKON +
            '<p class="kg-bas">Telefonunla onayla</p>' +
            '<p class="kg-alt">Karekodu <b>kendi telefonunla</b> okut, açılan sayfada “Onayla”ya bas. ' +
            'Tahtada şifre ya da PIN yazmana gerek yok; sınıfın görmesinin bir zararı olmaz.</p>' +
            '<div class="kg-qr" id="kgQr"><div class="kg-qrbekle">Karekod hazırlanıyor…</div></div>' +
            '<p class="kg-kod" id="kgKod"></p>' +
            '<p class="kg-hata" id="kgHata"></p>' +
            '<div class="kg-tus" id="kgTuslar"><button class="kg-ikincil" id="kgVazgec">Vazgeç</button></div>' +
            '<button class="kg-bag" id="kgPinGec">Telefonum yanımda değil — PIN ile onayla</button>'
        );
        document.getElementById('kgVazgec').onclick = function () { qrDur(); perdeKapat(); };
        document.getElementById('kgPinGec').onclick = function () { qrDur(); pinIste(tamam); };

        var baslat;
        try { baslat = islev('qrOturumBaslat'); }
        catch (e) { qrKapandi('Telefon onayı bu cihazda açılamadı.', tamam); return; }

        baslat({}).then(function (c) {
            var d = (c && c.data) || {};
            if (!d.oturumId || !d.gizli) { qrKapandi('Sunucudan karekod alınamadı.', tamam); return; }
            qrCiz(d);
            qrIzle(d, tamam);
        }).catch(function () {
            qrKapandi('Telefon onayı şu an çalışmıyor (karekod sunucusu kapalı olabilir).', tamam);
        });
    }

    function qrCiz(d) {
        var kutu = document.getElementById('kgQr'); if (!kutu) return;
        var kok = location.origin + location.pathname.replace(/[^/]*$/, '');
        var adres = kok + 'index.html?qr=' + encodeURIComponent(d.oturumId) + '&amac=onay';
        kutu.innerHTML = '';
        var yedek = function () {
            kutu.innerHTML = '<a class="kg-adres" href="' + adres + '" target="_blank" rel="noopener">Bağlantıyı telefonda aç</a>';
        };
        if (window.QRCode) {
            try {
                new window.QRCode(kutu, {
                    text: adres, width: 168, height: 168,
                    correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : undefined
                });
            } catch (e) { yedek(); }
        } else yedek();
        var k = document.getElementById('kgKod');
        if (k) k.innerHTML = 'Doğrulama kodu <b>' + String(d.dogrulama || '').replace(/[<>&]/g, '') + '</b>' +
            '<small>Telefonunda da bu kod yazmalı; yazmıyorsa onaylama.</small>';
    }

    function qrIzle(d, tamam) {
        var bitis = Date.now() + ((d.omurSn || 120) * 1000);
        var sor;
        try { sor = islev('qrOturumSor'); } catch (e) { qrKapandi('Sunucuya ulaşılamadı.', tamam); return; }
        var mesgul = false;
        qrSorma = setInterval(function () {
            if (mesgul) return;
            if (Date.now() > bitis) { qrKapandi('Karekodun süresi doldu.', tamam, true); return; }
            mesgul = true;
            sor({ oturumId: d.oturumId, gizli: d.gizli }).then(function (c) {
                mesgul = false;
                var v = (c && c.data) || {};
                if (v.durum === 'onayli') {
                    /* Jeton KULLANILMAZ — yalnız kimlik karşılaştırılır. */
                    var gelen = String(v.eposta || '').toLowerCase(), benim = epostam();
                    if (benim && gelen && gelen !== benim) {
                        qrKapandi('Bu onay başka bir hesaptan geldi — işlem açılmadı.', tamam, true);
                        return;
                    }
                    qrDur(); perdeKapat();
                    sonDogrulama = suan(); yanlis = 0; hareketYaz();
                    if (tamam) tamam();
                    return;
                }
                if (v.durum === 'reddedildi') { qrKapandi('İstek telefondan reddedildi.', tamam, true); }
                else if (v.durum === 'suredoldu' || v.durum === 'yok' || v.durum === 'kullanildi') {
                    qrKapandi('Karekod geçersiz.', tamam, true);
                }
            }).catch(function () { mesgul = false; });
        }, 2000);
    }

    /* Telefon yolu tıkandı: nedeni yaz, PIN'i öne çıkar. */
    function qrKapandi(mesaj, tamam, tekrarVer) {
        qrDur();
        var h = document.getElementById('kgHata');
        if (!h) return;                                   /* pencere kapanmış */
        h.textContent = mesaj;
        if (!tekrarVer) {                                 /* sunucu sorunu: bu oturumda bir daha deneme */
            telefonKapali = true;
            try { sessionStorage.setItem('kg_tel_kapali', '1'); } catch (e) { }
        }
        var kutu = document.getElementById('kgQr');
        if (kutu) kutu.innerHTML = '<div class="kg-qrbekle">—</div>';
        var kod = document.getElementById('kgKod'); if (kod) kod.textContent = '';
        var t = document.getElementById('kgTuslar');
        if (t && !document.getElementById('kgPinAna')) {
            var b = document.createElement('button');
            b.className = 'kg-ana'; b.id = 'kgPinAna'; b.textContent = 'PIN ile onayla';
            b.onclick = function () { pinIste(tamam); };
            t.insertBefore(b, t.firstChild);
        }
        if (t && tekrarVer && !document.getElementById('kgQrYeni')) {
            var y = document.createElement('button');
            y.className = 'kg-ikincil'; y.id = 'kgQrYeni'; y.textContent = 'Yeni karekod';
            y.onclick = function () { telefonOnay(tamam); };
            t.appendChild(y);
        }
    }

    /* Duyarlı işlemin kapısı: önce telefon, olmazsa PIN. */
    function dogrulaIste(tamam) {
        if (telefonKapali) { pinIste(tamam); return; }
        telefonOnay(tamam);
    }

    /* Doğrulama hâlâ geçerli mi?
       – Son doğrulamanın üstünden PIN_TAZE_DK geçmemiş olmalı,
       – ve masadan PIN_BOSTA_DK'dan uzun ayrılınmamış olmalı. */
    function taze() {
        if (!girisliMi()) return true;                    /* girişsizde koruma yok */
        if (!sonDogrulama) return false;
        if (suan() - sonDogrulama > dk(PIN_TAZE_DK)) return false;
        if (suan() - sonHareket() > dk(PIN_BOSTA_DK)) return false;
        return true;
    }
    function koru(calistir) {
        if (taze()) { calistir(); return true; }
        dogrulaIste(calistir);
        return false;
    }

    /* ---------------- saat: boşta kalma denetimi ---------------- */
    setInterval(function () {
        if (!girisliMi()) { uyariKapat(); return; }
        if (medyaOynuyor()) hareketYaz();
        var gecen = suan() - sonHareket();
        if (gecen >= dk(BOSTA_DK)) { cik(); return; }
        if (gecen >= dk(BOSTA_DK) - UYARI_SN * 1000) uyariAc();
        else if (uyariAcik) uyariKapat();
    }, 2000);

    /* ---------------- duyarlı işlemleri sar ---------------- */
    var DUYARLI_SEKME = [0, 1, 2, 3, 11];   /* Öğrenciler · Performans · Sınavlar · Genel Sonuç · Etkinlikler */
    function sar() {
        if (typeof window.switchTab === 'function' && !window.switchTab.__kg) {
            var eskiSekme = window.switchTab;
            var yeniSekme = function (idx) {
                var self = this, arg = arguments;
                if (DUYARLI_SEKME.indexOf(parseInt(idx, 10)) >= 0 && !taze()) {
                    dogrulaIste(function () { eskiSekme.apply(self, arg); });
                    return;
                }
                return eskiSekme.apply(self, arg);
            };
            yeniSekme.__kg = 1;
            window.switchTab = yeniSekme;
        }
        if (typeof window.behKaydet === 'function' && !window.behKaydet.__kg) {
            var eskiNot = window.behKaydet;
            var yeniNot = function () {
                var self = this, arg = arguments;
                if (!taze()) { dogrulaIste(function () { eskiNot.apply(self, arg); }); return; }
                return eskiNot.apply(self, arg);
            };
            yeniNot.__kg = 1;
            window.behKaydet = yeniNot;
        }
    }
    sar();
    window.addEventListener('load', sar);
    setTimeout(sar, 1500);
    setTimeout(sar, 4000);

    /* ---------------- giriş anını doğrulama say ---------------- */
    function girisiIzle() {
        try {
            if (!window.firebase || !firebase.auth) { setTimeout(girisiIzle, 600); return; }
            firebase.auth().onAuthStateChanged(function (u) {
                if (u) { sonDogrulama = suan(); yanlis = 0; hareketYaz(); }
                else { sonDogrulama = 0; uyariKapat(); }
            });
        } catch (e) { setTimeout(girisiIzle, 800); }
    }
    girisiIzle();

    /* ---------------- dışa açılan yüz ---------------- */
    window.KidefGuvenlik = {
        koru: koru,            /* KidefGuvenlik.koru(function(){ ...duyarlı iş... }) */
        taze: taze,
        dogrula: dogrulaIste,  /* asıl kapı: telefon onayı, yedeği PIN */
        telefonOnay: telefonOnay,
        pinIste: pinIste,
        pinKur: pinKur,
        pinVarMi: pinVarMi,
        cik: cik,
        ayar: function (o) {
            if (!o) return { BOSTA_DK: BOSTA_DK, UYARI_SN: UYARI_SN, PIN_TAZE_DK: PIN_TAZE_DK, PIN_BOSTA_DK: PIN_BOSTA_DK };
            if (o.BOSTA_DK) BOSTA_DK = o.BOSTA_DK;
            if (o.UYARI_SN) UYARI_SN = o.UYARI_SN;
            if (o.PIN_TAZE_DK) PIN_TAZE_DK = o.PIN_TAZE_DK;
            if (o.PIN_BOSTA_DK) PIN_BOSTA_DK = o.PIN_BOSTA_DK;
            return true;
        },
        _hareketYaz: hareketYaz,
        _sonHareket: sonHareket
    };
})();
