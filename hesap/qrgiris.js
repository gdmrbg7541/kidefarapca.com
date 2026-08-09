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
        k.style.display = 'flex';
        return k;
    }
    function govdeYaz(html) {
        var g = document.getElementById('qrGovde');
        if (g) g.innerHTML = html;
    }

    function qrGirisKapat() {
        if (qrDurum) {
            clearInterval(qrDurum.sayacId);
            clearInterval(qrDurum.sormaId);
            qrDurum = null;
        }
        var k = document.getElementById('qrGirisPencere');
        if (k) k.style.display = 'none';
    }

    /* ================================================================
       A) TAHTA TARAFI
       ================================================================ */
    function qrGirisAc() {
        pencere(
            svgKarekod() + '<span>Karekodla Giriş</span>',
            '<div class="qr-yukleniyor">Karekod hazırlanıyor…</div>'
        );

        var baslat;
        try { baslat = cagir('qrOturumBaslat'); }
        catch (e) { govdeYaz(uyariHtml(hataMetni(e))); return; }

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
            govdeYaz(uyariHtml(hataMetni(e)));
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
            if (d.durum === 'onayli' && d.jeton) {
                clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
                durumYaz('onayli', 'Onaylandı, giriş yapılıyor…');
                firebase.auth().signInWithCustomToken(d.jeton).then(function () {
                    durumYaz('onayli', (d.ad || d.eposta || 'Hoş geldin') + ' — giriş yapıldı.');
                    setTimeout(function () {
                        qrGirisKapat();
                        try { if (typeof closeLoginModal === 'function') closeLoginModal(); } catch (e) { }
                    }, 900);
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
            /* Ağ dalgalanmasında sormaya devam; kalıcı hatada durdur. */
            var k = (e && e.code) || '';
            if (/permission-denied|failed-precondition/.test(k)) {
                clearInterval(qrDurum.sayacId); clearInterval(qrDurum.sormaId);
                durumYaz('hata', hataMetni(e));
            }
        });
    }

    function uyariHtml(mesaj) {
        return '<div class="qr-uyari">' + kacis(mesaj) + '</div>' +
            '<div class="qr-alt"><button type="button" class="qr-yenile" onclick="qrGirisAc()">Tekrar dene</button></div>';
    }

    /* ================================================================
       B) TELEFON TARAFI — onay ekranı
       ================================================================ */
    function qrOnayKontrol() {
        var id = '';
        try {
            var p = new URLSearchParams(location.search);
            id = p.get('qr') || '';
        } catch (e) { return; }
        if (!id) return;

        /* Adresi hemen temizle: yenilemede tekrar onay ekranı açılmasın
           ve bağlantı geçmişte/paylaşımda kalmasın. */
        try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { }

        if (!girisliMi()) {
            qrBeklemedekiOnay = id;
            pencere(svgKarekod() + '<span>Karekod onayı</span>',
                '<p class="qr-anlat">Bu isteği onaylamak için önce <b>kendi hesabınla</b> giriş yapmalısın. ' +
                'Giriş yaptıktan sonra onay ekranı kendiliğinden açılacak.</p>' +
                '<div class="qr-alt"><button type="button" class="qr-yenile" onclick="qrGirisKapat(); if(typeof showLoginModal===\'function\') showLoginModal();">Giriş Yap</button></div>');
            return;
        }
        qrOnayAc(id);
    }

    function qrOnayAc(id) {
        pencere(svgKarekod() + '<span>Karekod onayı</span>', '<div class="qr-yukleniyor">İstek kontrol ediliyor…</div>');
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
                '<p class="qr-anlat">Bir cihaz senin hesabınla giriş yapmak istiyor.</p>' +
                '<div class="qr-bilgi"><span>İstekte bulunan cihaz</span><b>' + kacis(d.cihaz || 'Bilinmiyor') + '</b></div>' +
                '<div class="qr-bilgi"><span>Giriş yapılacak hesap</span><b>' + kacis(kim || '—') + '</b></div>' +
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
                        ? '<div class="qr-bitti iyi">✓ Onaylandı. Diğer cihazda giriş birkaç saniye içinde tamamlanır.</div>'
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
        var id = qrBeklemedekiOnay;
        qrBeklemedekiOnay = null;
        setTimeout(function () { qrOnayAc(id); }, 400);
    }

    /* ------------------------------------------------------------ kurulum */
    function kur() {
        try {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().onAuthStateChanged(function (u) {
                    if (u && !u.isAnonymous) bekleyeniAc();
                });
            }
        } catch (e) { }
        qrOnayKontrol();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();

    window.qrGirisAc = qrGirisAc;
    window.qrGirisKapat = qrGirisKapat;
    window.qrOnayKontrol = qrOnayKontrol;
    window.qrOnayAc = qrOnayAc;
})();
