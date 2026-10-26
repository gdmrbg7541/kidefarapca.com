/* ===========================================================================
   KİDEF · KAYDI TAMAMLA                                (hesap/kayittamamla.js)
   ---------------------------------------------------------------------------
   Yönetici (26.10.2026): "bi öğrenciyi yönetici öğretmenler kısmından silince
   tekrar kayıt olduğunda firebase'ta göründüğü gibi yönetici/öğretmenleri
   onayla veya öğretmenler kısmında görelim, onaylayabilelim".

   Yönetici paneli bir hesabı silince yalnız kullanicilar/{uid} belgesi
   silinir; Firebase KİMLİK hesabı kalır (tarayıcıdan silinemez). Kişi sonra
   giriş yaparsa hesabı vardır ama site kaydı yoktur: yönetici listelerinde
   görünmez, bilgileri kaydedilmez. Aynı e-postayla yeniden kayıt olmayı
   denerse de "e-posta kullanımda" alırdı (o yol artık hesap/kayitalani.js →
   KidefKayit.varOlanHesap ile kaydı tamamlıyor).

   Bu pencere giriş yapmış ama belgesi olmayan kişiye rolünü ve bilgilerini
   sorar; kayıt belgesini YENİ KAYIT GİBİ yazar (hesap/kayitalani.js biçimi:
   öğretmen yönetici onay kuyruğuna düşer, öğrenci hemen açılır).

   Açan yerler:
     · hesap/auth.js — girişte kullanicilar/{uid} yoksa (600 ms sonra)
     · sistem/kilit.js — kilitli sitede «kaydı eksik» şeridindeki tuş
   Arayüz:
     KidefKayitTamamla.ac(user, zorla)  user: firebase kullanıcısı (yoksa
                                        currentUser). Çarpıyla kapatılmışsa bu
                                        sekmede bir daha kendiliğinden açılmaz;
                                        zorla=true yine açar.
     KidefKayitTamamla.kapat()
     KidefKayitTamamla.acik()
   Belge yazılınca window.kidefKayitBelgesiYazildi(user, belge) varsa çağrılır
   (auth.js: oturumu o belgeyle tamamlar); yoksa sayfa yenilenir.
   =========================================================================== */
(function () {
    'use strict';
    if (window.KidefKayitTamamla) return;

    var ID = 'ktPencere', KAPANDI = 'ktKapandi:';
    var S = { user: null, rol: 'student', mesgul: false };

    function $(id) { return document.getElementById(id); }
    function kacis(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function stilKur() {
        if ($('ktStil')) return;
        var s = document.createElement('style');
        s.id = 'ktStil';
        s.textContent = [
            '#' + ID + '{position:fixed;inset:0;z-index:100000002;display:flex;align-items:center;justify-content:center;',
            'padding:16px;box-sizing:border-box;background:rgba(20,30,40,.62);backdrop-filter:blur(3px);',
            'font-family:"Nunito","Segoe UI",system-ui,sans-serif;overflow:auto}',
            '#' + ID + ' .kt-kart{position:relative;width:100%;max-width:520px;max-height:100%;overflow:auto;background:#fff;',
            'border-radius:22px;box-shadow:0 18px 60px rgba(0,0,0,.35);padding:22px 22px 18px;box-sizing:border-box;color:#2C3E50}',
            '#' + ID + ' .kt-kapat{position:absolute;top:10px;right:12px;border:0;background:#F2F5F8;color:#5D6D7E;width:34px;height:34px;',
            'border-radius:50%;font-size:18px;cursor:pointer;font-family:inherit}',
            '#' + ID + ' h2{margin:0 36px 6px 0;color:#16A085;font-size:1.35rem}',
            '#' + ID + ' .kt-aciklama{margin:0 0 14px;font-size:.92rem;line-height:1.55;color:#5D6D7E;background:#FFF8F2;',
            'border:1.5px solid #F3E2D3;border-radius:14px;padding:10px 12px}',
            '#' + ID + ' .kt-aciklama b{color:#B34700}',
            '#' + ID + ' .kt-rol{display:flex;gap:10px;margin:0 0 14px}',
            '#' + ID + ' .kt-rol button{flex:1;padding:11px 10px;border-radius:14px;border:2px solid #E9EEF5;background:#fff;color:#2C3E50;',
            'font-weight:800;font-size:1rem;cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s}',
            '#' + ID + ' .kt-rol button.secili{border-color:#16A085;background:#E7F6F2;color:#0E7C66}',
            '#' + ID + ' .kt-alan{margin:0 0 10px}',
            '#' + ID + ' .kt-alan label{display:block;font-size:.84rem;font-weight:700;color:#5D6D7E;margin:0 0 4px}',
            '#' + ID + ' .kt-alan input,#' + ID + ' .kt-alan select{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #E9EEF5;',
            'border-radius:12px;font:inherit;font-size:.98rem;background:#fff;color:#2C3E50}',
            '#' + ID + ' .kt-alan input[readonly]{background:#F0F4F8;color:#16A085;font-weight:700}',
            '#' + ID + ' .kt-tel{display:flex}',
            '#' + ID + ' .kt-tel span{padding:11px 12px;background:#E9EEF5;border:1px solid #E9EEF5;border-radius:12px 0 0 12px;color:#555;font-weight:700}',
            '#' + ID + ' .kt-tel input{border-radius:0 12px 12px 0;border-left:0}',
            '#' + ID + ' .kt-hata{min-height:18px;margin:4px 0 8px;font-size:.88rem;color:#C0392B;line-height:1.45;overflow-wrap:anywhere}',
            '#' + ID + ' .kt-tuslar{display:flex;gap:10px;flex-wrap:wrap;align-items:center}',
            '#' + ID + ' .kt-gonder{flex:1 1 200px;padding:13px 16px;border:0;border-radius:14px;background:#16A085;color:#fff;font-weight:800;',
            'font-size:1.02rem;cursor:pointer;font-family:inherit}',
            '#' + ID + ' .kt-gonder[disabled]{opacity:.6;cursor:default}',
            '#' + ID + ' .kt-cik{padding:11px 14px;border:0;border-radius:14px;background:#F2F5F8;color:#7B3B30;font-weight:700;cursor:pointer;font-family:inherit}',
            '@media(max-width:420px){#' + ID + '{padding:10px}#' + ID + ' .kt-kart{padding:18px 14px 14px;border-radius:18px}',
            '#' + ID + ' .kt-rol{flex-direction:column}}'
        ].join('');
        (document.head || document.documentElement).appendChild(s);
    }

    function kullanici() {
        if (S.user) return S.user;
        try { return firebase.auth().currentUser; } catch (e) { return null; }
    }

    function kur(u) {
        var eski = $(ID); if (eski) eski.remove();
        stilKur();
        var p = document.createElement('div');
        p.id = ID;
        p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-labelledby', 'ktBaslik');
        p.innerHTML =
            '<div class="kt-kart">' +
            '<button type="button" class="kt-kapat" id="ktKapat" aria-label="Kapat">✕</button>' +
            '<h2 id="ktBaslik">Kaydını tamamla</h2>' +
            '<div class="kt-aciklama"><b>Hesabın var ama site kaydın eksik.</b> Kaydın silinmiş ya da yarım kalmış olabilir; ' +
            'bu yüzden bilgilerin kaydedilmiyor ve yönetici seni görmüyor. Rolünü seç, bilgilerini yaz ve «Kaydı Tamamla»ya bas. ' +
            'Öğretmen kaydı yönetici onayından sonra açılır.</div>' +
            '<div class="kt-alan"><label>E-posta</label><input type="email" id="ktEposta" readonly value="' + kacis(u && u.email) + '"></div>' +
            '<div class="kt-rol" role="group" aria-label="Rol">' +
            '<button type="button" data-rol="student" class="secili">Öğrenci</button>' +
            '<button type="button" data-rol="teacher">Öğretmen</button></div>' +
            '<div class="kt-alan"><label>Ad Soyad</label><input type="text" id="ktAd" placeholder="Örn: Ali Yılmaz" autocomplete="name"></div>' +
            '<div class="kt-alan"><label>Meslek <span style="color:#EF5350;">*</span></label><input type="text" id="ktMeslek" placeholder="Örn: Öğretmen, Mühendis…"></div>' +
            '<div class="kt-alan"><label>Telefon Numarası <span style="color:#EF5350;">*</span></label>' +
            '<div class="kt-tel"><span>+90</span><input type="tel" id="ktTel" placeholder="5XX XXX XX XX" maxlength="10" inputmode="numeric" autocomplete="tel-national"></div></div>' +
            '<div class="kt-alan"><label>Cinsiyet <span style="color:#EF5350;">*</span></label>' +
            '<select id="ktCinsiyet"><option value="">Seçiniz…</option><option value="erkek">Erkek</option><option value="kadin">Kadın</option></select></div>' +
            '<p class="kt-hata" id="ktHata" role="alert"></p>' +
            '<div class="kt-tuslar"><button type="button" class="kt-gonder" id="ktGonder">Kaydı Tamamla</button>' +
            '<button type="button" class="kt-cik" id="ktCik" title="Başka hesapla girmek için">Çıkış yap</button></div>' +
            '</div>';
        document.body.appendChild(p);

        var ad = (u && u.displayName) || '';
        if (ad) $('ktAd').value = ad;
        try { var tel = String((u && u.phoneNumber) || '').replace(/^\+90/, ''); if (/^5\d{9}$/.test(tel)) $('ktTel').value = tel; } catch (e) { }

        $('ktKapat').onclick = function () {
            try { if (u && u.uid) sessionStorage.setItem(KAPANDI + u.uid, '1'); } catch (e) { }
            kapat();
        };
        $('ktCik').onclick = function () {
            try { firebase.auth().signOut().then(function () { location.reload(); }, function () { location.reload(); }); }
            catch (e) { location.reload(); }
        };
        var rb = p.querySelectorAll('.kt-rol button');
        for (var i = 0; i < rb.length; i++) rb[i].onclick = function () { rolSec(this.getAttribute('data-rol')); };
        $('ktGonder').onclick = gonder;
        $('ktTel').addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 10); });
        rolSec(S.rol);
        setTimeout(function () { try { $('ktAd').focus(); } catch (e) { } }, 80);
        return p;
    }

    function rolSec(rol) {
        S.rol = (rol === 'teacher') ? 'teacher' : 'student';
        var p = $(ID); if (!p) return;
        var rb = p.querySelectorAll('.kt-rol button');
        for (var i = 0; i < rb.length; i++) rb[i].classList.toggle('secili', rb[i].getAttribute('data-rol') === S.rol);
        var m = $('ktMeslek');
        if (m) {
            if (S.rol === 'teacher') { m.value = 'Eğitmen'; m.readOnly = true; }
            else { if (m.value === 'Eğitmen') m.value = ''; m.readOnly = false; }
        }
        var g = $('ktGonder');
        if (g) g.textContent = S.rol === 'teacher' ? 'Kaydı Tamamla (onaya gönder)' : 'Kaydı Tamamla';
        hata('');
    }

    function hata(m) { var e = $('ktHata'); if (e) e.textContent = m || ''; }
    function mesgul(d) {
        S.mesgul = !!d;
        var g = $('ktGonder'); if (g) { g.disabled = !!d; if (d) g.textContent = 'Kaydediliyor…'; else rolSec(S.rol); }
    }

    function gonder() {
        if (S.mesgul) return;
        var u = kullanici();
        if (!u || !u.email || (S.user && u.uid !== S.user.uid)) { hata('Oturum bulunamadı. Sayfayı yenileyip yeniden giriş yap.'); return; }
        if (!window.KidefKayit || !KidefKayit.dogrula || !KidefKayit.belge) { hata('Kayıt bileşeni yüklenemedi. Sayfayı yenile.'); return; }
        var s = KidefKayit.dogrula({
            email: u.email, ad: $('ktAd').value, meslek: $('ktMeslek').value,
            tel: $('ktTel').value, cinsiyet: $('ktCinsiyet').value
        }, { sifresiz: true });
        if (!s.tamam) { hata(s.hata); return; }
        var rol = S.rol, ref;
        try { ref = firebase.firestore().collection('kullanicilar').doc(u.uid); }
        catch (e) { hata('Bağlantı kurulamadı. İnternetini denetleyip tekrar dene.'); return; }
        hata(''); mesgul(true);
        ref.get().then(function (doc) {
            var v = doc.exists ? (doc.data() || {}) : null;
            if (v && v.role) {                      /* arada yazılmış: zaten kayıtlı */
                kapat(); bitti(u, v, false); return;
            }
            var b = KidefKayit.belge(s.veri, rol);
            /* belge varsa ama rolü yoksa (eski/yarım kayıt) üstüne yazılır, öbür alanlar kalır */
            var yaz = v ? ref.set(b, { merge: true }) : ref.set(b);
            return yaz.then(function () { kapat(); bitti(u, b, true); });
        }).catch(function (e) {
            mesgul(false);
            hata((window.KidefKayit && KidefKayit.hataMetni) ? KidefKayit.hataMetni(e, 'kayit')
                : ('Kayıt yazılamadı: ' + ((e && (e.code || e.message)) || e)));
        });
    }

    function bitti(u, belge, yeni) {
        try { if (u && u.uid) sessionStorage.removeItem(KAPANDI + u.uid); } catch (e) { }
        /* index: hesap/auth.js oturumu bu belgeyle tamamlar (mesajı da o verir) */
        if (yeni && typeof window.kidefKayitBelgesiYazildi === 'function') {
            try { window.kidefKayitBelgesiYazildi(u, belge); return; } catch (e) { }
        }
        if (!yeni && typeof window.kidefOturumBelgesiniIsle === 'function') {
            try { window.kidefOturumBelgesiniIsle(u); return; } catch (e) { }
        }
        if (yeni) {
            var m = (window.KidefKayit && KidefKayit.bitisMesaji) ? KidefKayit.bitisMesaji(belge.role) : 'Kaydın alındı.';
            try { if (typeof window.showCustomAlert === 'function') window.showCustomAlert(m); else alert(m); } catch (e) { }
        }
        setTimeout(function () { location.reload(); }, 400);
    }

    function ac(user, zorla) {
        var u = user || kullanici();
        if (!u || !u.email || u.isAnonymous) return false;
        if (!zorla) {
            try { if (sessionStorage.getItem(KAPANDI + u.uid)) return false; } catch (e) { }
        }
        S.user = u;
        if (!document.body) { document.addEventListener('DOMContentLoaded', function () { kur(u); }); return true; }
        kur(u);
        return true;
    }
    function kapat() { var p = $(ID); if (p) p.remove(); }
    function acik() { return !!$(ID); }

    window.KidefKayitTamamla = { ac: ac, kapat: kapat, acik: acik, _S: S };
})();
