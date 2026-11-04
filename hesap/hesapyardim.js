/* =====================================================================
   KİDEF · YÖNETİCİ > ÖĞRETMEN PENCERESİ > HESAP · ŞİFRE   (hesap/hesapyardim.js)
   ŞİFRE BAĞLANTISI (04.11.2026)
   ---------------------------------------------------------------------
   Yönetici (04.11.2026): bir öğretmen «Şifremi unuttum» dedi ama Hotmail
   adresine yenileme e-postası spam dahil hiç gelmedi. Firebase'in kendi
   gönderdiği ileti bazı sağlayıcılarda (Hotmail/Outlook, okul adresleri)
   sessizce siliniyor. Seçim: «Panelde şifre bağlantısı».

   Öğretmen penceresindeki «Hesap · şifre» sekmesi (hesap/ogretmen-detay.js):
     · Şifre yenileme bağlantısı — sunucu (functions/index.js →
       sifreBaglantisi) Firebase'in kendi bağlantısını üretir; yönetici
       WhatsApp'tan ya da kendi e-postasından gönderir (sistem/hosgeldinmesaj.js
       → KidefHosgeldin.sifreGonder). 1 saat geçerli, bir kez kullanılır.
     · E-postayı düzelt — kayıtta yanlış yazılmış giriş e-postası
       (functions → epostaDuzelt) değişir; şifre ve veriler aynı kalır.
   İki işlev de yalnız yöneticiye açık; denetimi sunucu yapar. İşlevler bir
   kez yüklenmeli: GitHub klasöründeki fonksiyon-yukle.command.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefHesapYardim) return;

    var BOLGE = 'europe-west1';            /* functions/index.js ile AYNI (hesap/qrgiris.js → QR_BOLGE) */
    var _flas = {};                        /* uid → sekme yeniden çizilince bir kez gösterilecek not */
    var _son = {};                         /* uid → son üretilen bağlantı {link, email, bitis, ...} */

    var IK_ANAHTAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="15" r="4.2"/><path d="M11 12 20.5 2.5M16.5 6.5l3 3M14 9l2.2 2.2"/></svg>';
    var IK_GONDER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 2.5 10.6 13.4M21.5 2.5l-7 19-3.9-8.1-8.1-3.9z"/></svg>';
    var IK_KOPYA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/></svg>';

    function esc(x) {
        return String(x == null ? '' : x)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function bilgi(uid) { return (window._adminOgretmenler && window._adminOgretmenler[uid]) || null; }
    function oneriAl(email) {
        try { return (window.KidefKayit && KidefKayit.epostaOneri) ? KidefKayit.epostaOneri(email) : ''; } catch (e) { return ''; }
    }
    function saat(ms) {
        try { return new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
    }
    function tarih(s) {
        if (!s) return '—';
        var d = new Date(s);
        return isNaN(d) ? '—' : d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    /* ---------------------------------------------------- sunucu çağrısı */
    function cagir(ad, veri) {
        try {
            if (typeof firebase === 'undefined' || !firebase.app || typeof firebase.app().functions !== 'function') {
                return Promise.reject({ metin: 'Sunucu bağlantısı yüklenmedi (firebase-functions). Sayfayı yenile.' });
            }
            return firebase.app().functions(BOLGE).httpsCallable(ad)(veri).then(function (r) { return (r && r.data) || {}; });
        } catch (e) { return Promise.reject(e); }
    }
    function hataMetni(e) {
        if (e && e.metin) return e.metin;
        var kod = String((e && e.code) || '').replace(/^functions\//, '');
        var m = String((e && e.message) || '');
        if (/[çğıöşüÇĞİÖŞÜ]/.test(m)) return m;                  /* sunucunun kendi Türkçe mesajı */
        if (kod === 'unauthenticated') return 'Önce yönetici hesabıyla giriş yap.';
        if (kod === 'permission-denied') return 'Bu işlem yalnız yöneticiye açık.';
        if (kod === 'internal' || kod === 'not-found' || kod === 'unavailable' || kod === 'deadline-exceeded' || !kod) {
            return 'Sunucu işlevine ulaşılamadı. İşlevler henüz yüklenmediyse GitHub klasöründeki ' +
                   '«fonksiyon-yukle.command» dosyasını bir kez çalıştır; yüklendiyse bağlantını denetleyip tekrar dene.';
        }
        return 'İşlem yapılamadı (' + kod + ').';
    }

    /* ----------------------------------------------------------- stil */
    function stil() {
        if (document.getElementById('hy-stil')) return;
        var s = document.createElement('style');
        s.id = 'hy-stil';
        s.textContent = [
            '#ogdKutu .hy-ep{font-size:.92rem; color:#55606D; line-height:1.5;}',
            '#ogdKutu .hy-ep b{color:#1F2430; word-break:break-all;}',
            '#ogdKutu .hy-uyari{margin-top:10px; padding:9px 12px; border-radius:10px; background:#FFF8E6; border:1px solid #F3D28A;',
            '  color:#6B4600; font-size:.86rem; font-weight:600; line-height:1.45; overflow-wrap:anywhere;}',
            '#ogdKutu .hy-not{margin:0 0 12px; font-size:.84rem; color:#6B7684; line-height:1.55;}',
            '#ogdKutu .hy-tus{display:inline-flex; align-items:center; gap:8px; border:0; border-radius:10px; padding:9px 14px;',
            '  font-family:inherit; font-size:.88rem; font-weight:800; cursor:pointer; background:#EEF3FB; color:#1B4F9C;}',
            '#ogdKutu .hy-tus.ana{background:#1B4F9C; color:#fff;}',
            '#ogdKutu .hy-tus.yesil{background:#0E7C66; color:#fff;}',
            '#ogdKutu .hy-tus[disabled]{opacity:.6; cursor:default;}',
            '#ogdKutu .hy-tus svg{width:18px; height:18px; flex:none;}',
            '#ogdKutu .hy-sonuc{margin-top:12px;}',
            '#ogdKutu .hy-sonuc:empty{display:none;}',
            '#ogdKutu .hy-link input{width:100%; box-sizing:border-box; padding:9px 11px; border:1.5px solid #DCE3EC; border-radius:10px;',
            '  font-family:ui-monospace,Menlo,Consolas,monospace; font-size:.78rem; color:#55606D; background:#F7F9FC;}',
            '#ogdKutu .hy-tuslar{display:flex; gap:8px; flex-wrap:wrap; margin-top:9px;}',
            '#ogdKutu .hy-bilgi{display:block; margin-top:9px; font-size:.8rem; color:#8A94A3; line-height:1.5;}',
            '#ogdKutu .hy-hata{padding:9px 12px; border-radius:10px; background:#FDEDEC; color:#B03A2E; font-size:.86rem; font-weight:700; line-height:1.45;}',
            '#ogdKutu .hy-iyi{padding:9px 12px; border-radius:10px; background:#E8F6EF; color:#1E6F43; font-size:.86rem; font-weight:700; line-height:1.45;}',
            '#ogdKutu .hy-bekle{font-size:.86rem; color:#55606D; font-weight:700;}',
            '#ogdKutu .hy-duz{display:flex; gap:8px; flex-wrap:wrap;}',
            '#ogdKutu .hy-duz input{flex:1 1 240px; min-width:0; box-sizing:border-box; padding:9px 11px; border:1.5px solid #DCE3EC;',
            '  border-radius:10px; font-family:inherit; font-size:.92rem; color:#1F2430;}',
            '#ogdKutu .hy-duz input:focus{outline:none; border-color:#4C8DF6;}',
            '#ogdKutu .ogd-epu{border:0; background:#FFF1D6; color:#8A5A00; border-radius:999px; padding:2px 9px; margin-inline-start:6px;',
            '  font-family:inherit; font-size:.74rem; font-weight:800; cursor:pointer; vertical-align:1px;}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
    }

    /* öğretmen penceresinin başlığında: e-posta yanlış yazılmış görünüyorsa */
    function basUyari(email) {
        stil();
        return oneriAl(email)
            ? ' <button type="button" class="ogd-epu" data-ogd-sekme="hesap" title="Hesap · şifre sekmesinde düzelt">yanlış yazılmış olabilir</button>'
            : '';
    }

    /* ---------------------------------------------------- sekme içeriği */
    function bolum(kap, uid, b) {
        if (!kap) return;
        stil();
        b = b || bilgi(uid) || {};
        var email = b.email || '';
        var oneri = oneriAl(email);
        var flas = _flas[uid]; delete _flas[uid];
        kap.setAttribute('data-hy-uid', uid);
        kap.innerHTML =
            '<div class="ogd-bol">' +
              '<h4>Giriş hesabı</h4>' +
              (flas ? '<div class="hy-iyi" style="margin-bottom:10px;">' + flas + '</div>' : '') +
              '<div class="hy-ep">Giriş e-postası: <b>' + esc(email || '—') + '</b></div>' +
              (oneri ? '<div class="hy-uyari">Bu adres yanlış yazılmış olabilir: <b>' + esc(oneri) + '</b> mu olacaktı? ' +
                       'Öğretmen doğru adresiyle giremiyorsa aşağıdan düzelt.</div>' : '') +
            '</div>' +
            '<div class="ogd-bol">' +
              '<h4>Şifre yenileme bağlantısı</h4>' +
              '<p class="hy-not">«Şifremi unuttum» e-postası bazı adreslere (Hotmail/Outlook, okul adresleri) ulaşmayabiliyor. ' +
                'Bağlantıyı buradan oluşturup WhatsApp\'tan ya da kendi e-postandan gönder. Bağlantı <b>1 saat</b> geçerli ve bir kez kullanılır; ' +
                'öğretmen yeni şifresini kendisi yazar.</p>' +
              '<button type="button" class="hy-tus ana" data-hy="sifre">' + IK_ANAHTAR + '<span>Bağlantı oluştur</span></button>' +
              '<div class="hy-sonuc" data-hy-sonuc="sifre" aria-live="polite"></div>' +
            '</div>' +
            '<div class="ogd-bol">' +
              '<h4>E-postayı düzelt</h4>' +
              '<p class="hy-not">Kayıtta e-posta yanlış yazıldıysa (ör. gmial.com) öğretmen doğru adresiyle giremez, şifre e-postası da yanlış adrese gider. ' +
                'Giriş e-postası burada değişir; şifresi, sınıfları ve verileri aynı kalır.</p>' +
              '<div class="hy-duz"><input type="email" data-hy-yeni autocomplete="off" spellcheck="false" inputmode="email" ' +
                'aria-label="Yeni giriş e-postası" value="' + esc(oneri || email) + '">' +
                '<button type="button" class="hy-tus" data-hy="duzelt">Değiştir</button></div>' +
              '<div class="hy-sonuc" data-hy-sonuc="duzelt" aria-live="polite"></div>' +
            '</div>';
        if (_son[uid] && _son[uid].bitis > Date.now()) linkCiz(kap, uid, _son[uid]);
        kap.onclick = function (e) {
            var t = e.target && e.target.closest ? e.target.closest('[data-hy]') : null;
            if (!t || !kap.contains(t)) return;
            var is = t.getAttribute('data-hy');
            if (is === 'sifre') sifreBaglantisi(kap, uid, t);
            else if (is === 'gonder') gonder(uid);
            else if (is === 'kopya') kopyala(kap, uid, t);
            else if (is === 'duzelt') epostaDuzelt(kap, uid, t);
        };
        var inp = kap.querySelector('[data-hy-yeni]');
        if (inp) inp.onkeydown = function (e) {
            if (e.key === 'Enter') { e.preventDefault(); epostaDuzelt(kap, uid, kap.querySelector('[data-hy="duzelt"]')); }
        };
    }
    function sonucYeri(kap, ad) { return kap.querySelector('[data-hy-sonuc="' + ad + '"]'); }

    /* ------------------------------------------------- şifre bağlantısı */
    function sifreBaglantisi(kap, uid, tus) {
        var yer = sonucYeri(kap, 'sifre');
        if (!yer || (tus && tus.disabled)) return;
        if (tus) tus.disabled = true;
        yer.innerHTML = '<span class="hy-bekle">Bağlantı oluşturuluyor…</span>';
        cagir('sifreBaglantisi', { uid: uid }).then(function (r) {
            if (!r || !r.link) throw { metin: 'Sunucu bağlantı döndürmedi. Tekrar dene.' };
            var dk = +r.omurDk || 60;
            _son[uid] = { link: String(r.link), email: r.email || '', kapali: !!r.kapali, sonGiris: r.sonGiris || '',
                          bitis: Date.now() + dk * 60000 };
            if (document.body.contains(kap)) linkCiz(kap, uid, _son[uid]);
        }).catch(function (e) {
            if (document.body.contains(yer)) yer.innerHTML = '<div class="hy-hata">' + esc(hataMetni(e)) + '</div>';
        }).then(function () { if (tus) tus.disabled = false; });
    }
    function linkCiz(kap, uid, s) {
        var yer = sonucYeri(kap, 'sifre');
        if (!yer) return;
        yer.innerHTML =
            '<div class="hy-link">' +
              (s.kapali ? '<div class="hy-hata" style="margin-bottom:9px;">Bu hesap Firebase\'de kapatılmış (disabled); bağlantıyla şifre değişse de giriş yapılamaz. ' +
                          'Önce Firebase konsolunda Authentication › Users\'tan hesabı aç.</div>' : '') +
              '<input type="text" readonly data-hy-link value="' + esc(s.link) + '" aria-label="Şifre yenileme bağlantısı">' +
              '<div class="hy-tuslar">' +
                '<button type="button" class="hy-tus yesil" data-hy="gonder">' + IK_GONDER + '<span>WhatsApp\'tan ya da e-postayla gönder</span></button>' +
                '<button type="button" class="hy-tus" data-hy="kopya">' + IK_KOPYA + '<span>Bağlantıyı kopyala</span></button>' +
              '</div>' +
              '<span class="hy-bilgi">' +
                'Bağlantı <b>' + esc(s.email) + '</b> hesabı için; son geçerlilik saati <b>' + esc(saat(s.bitis)) + '</b>. ' +
                'Son giriş: ' + esc(tarih(s.sonGiris)) + '. Öğretmen bağlantıda yeni şifresini yazar, sonra bu e-posta ve yeni şifreyle girer.' +
              '</span>' +
            '</div>';
    }
    function gonder(uid) {
        var s = _son[uid], b = bilgi(uid) || {};
        if (!s) return;
        if (window.KidefHosgeldin && KidefHosgeldin.sifreGonder) {
            KidefHosgeldin.sifreGonder(b.ad || '', b.tel || '', s.email || b.email || '', s.link);
        }
    }
    function kopyala(kap, uid, tus) {
        var s = _son[uid];
        if (!s) return;
        var yaz = function (ok) {
            var sp = tus && tus.querySelector('span');
            if (sp) { sp.textContent = ok ? 'Kopyalandı' : 'Kopyalanamadı — kutudan seç'; setTimeout(function () { sp.textContent = 'Bağlantıyı kopyala'; }, 2200); }
            if (!ok) { var i = kap.querySelector('[data-hy-link]'); if (i) { i.focus(); i.select(); } }
        };
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(s.link).then(function () { yaz(true); }, function () { yaz(false); });
                return;
            }
        } catch (e) { }
        yaz(false);
    }

    /* ------------------------------------------------- e-posta düzeltme */
    function onayIste(metin) {
        if (typeof window.showCustomConfirm === 'function') {
            try { return Promise.resolve(window.showCustomConfirm(metin)); } catch (e) { }
        }
        return Promise.resolve(window.confirm(metin));
    }
    function epostaDuzelt(kap, uid, tus) {
        var yer = sonucYeri(kap, 'duzelt'), inp = kap.querySelector('[data-hy-yeni]');
        if (!yer || !inp || (tus && tus.disabled)) return;
        var b = bilgi(uid) || {}, eski = String(b.email || '').trim();
        var yeni = String(inp.value || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(yeni)) {
            yer.innerHTML = '<div class="hy-hata">Yeni e-posta geçersiz görünüyor; yazımını denetle (örn. ad@posta.com).</div>';
            return;
        }
        if (yeni === eski.toLowerCase()) {
            yer.innerHTML = '<div class="hy-hata">Bu zaten şu anki giriş e-postası.</div>';
            return;
        }
        var yeniOneri = oneriAl(yeni);
        var metin = 'Giriş e-postası değişsin mi?\n\n' + (eski || '—') + '  →  ' + yeni + '\n\n' +
            (yeniOneri ? 'Dikkat: yazdığın adres de yanlış görünüyor (' + yeniOneri + ' mu olacaktı?).\n\n' : '') +
            'Öğretmen bundan sonra yeni adresle giriş yapar; şifresi ve verileri aynı kalır.';
        onayIste(metin).then(function (evet) {
            if (!evet) return;
            if (tus) tus.disabled = true;
            yer.innerHTML = '<span class="hy-bekle">Değiştiriliyor…</span>';
            return cagir('epostaDuzelt', { uid: uid, email: yeni }).then(function (r) {
                var son = (r && r.yeni) || yeni;
                var O = window._adminOgretmenler || {};
                if (O[uid]) { O[uid].email = son; if (O[uid].doc) O[uid].doc.email = son; }
                if (_son[uid]) delete _son[uid];          /* eski adresin bağlantısı artık işe yaramaz */
                _flas[uid] = r && r.degismedi ? 'Adres zaten buydu; bir şey değişmedi.'
                    : 'Giriş e-postası değişti: ' + esc(r && r.eski || eski) + ' → <b>' + esc(son) + '</b>. ' +
                      'Öğretmen artık bu adresle giriş yapar. Şifresini hatırlamıyorsa aşağıdan bağlantı oluştur.';
                if (window.KidefOgretmenDetay && KidefOgretmenDetay.tazele) KidefOgretmenDetay.tazele();
                var k2 = document.querySelector('[data-hy-uid="' + uid + '"]');
                if (k2 && _flas[uid]) bolum(k2, uid, bilgi(uid));
            }, function (e) {
                if (document.body.contains(yer)) yer.innerHTML = '<div class="hy-hata">' + esc(hataMetni(e)) + '</div>';
            });
        }).then(function () { if (tus) tus.disabled = false; });
    }

    window.KidefHesapYardim = { surum: 1, bolum: bolum, basUyari: basUyari, ikon: IK_ANAHTAR, stil: stil, _hataMetni: hataMetni };
})();
