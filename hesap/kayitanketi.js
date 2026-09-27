/* ==================================================================
   KAYIT ANKETİ / ROL KAPISI — kidefarapca.com
   ------------------------------------------------------------------
   NİYE VAR: giriş penceresi açılınca en üstte "Öğrenci | Öğretmen"
   sekmesi duruyordu ve öntanımlı olarak ÖĞRENCİ seçiliydi. Öğretmenler
   sekmeyi fark etmeden kayıt oluyor, sonra kendilerini öğrenci hesabıyla
   buluyordu. Artık sekme kayıt/giriş formunun içinde değil: pencere
   açılınca ÖNCE bir kapı çıkıyor —

     1) "Öğretmen misin, öğrenci misin?"   (giriş ve kayıtta)
     2) Kayıt ise + 4 soru, hazır cevap seçenekleriyle (zorunlu)

   Kapı geçilmeden e-posta/şifre alanları GÖRÜNMEZ. Böylece rol bir
   "fark edilmeyen sekme" değil, cevaplanması gereken bir soru.

   Cevaplar kullanicilar/{uid} belgesine `anket` alanı olarak yazılır
   (hesap/kayitalani.js → K.belge buradan okur) ve yönetici panelinde
   "📋 Kayıt Anketi" bölümünde görünür.

   Bu dosya kendi başına yeter: stilini kendi yazar, sitedeki hiçbir
   fonksiyonun içine dokunmaz — yalnız showLoginModal, moduDegistir,
   authIslemi ve renderAdminPanel'i sarar.
   ================================================================== */
(function () {
    'use strict';
    if (window.KidefAnket) return;

    var TASLAK = 'ka_taslak';          /* yarım kalan cevaplar */

    /* ---------------- çizgi simgeler (emoji yerine) ----------------
       Hepsi 24x24, yalnız kontur; rengi bulunduğu yerden alır. Emoji
       kullanmıyoruz: yazı tipine göre boyu ve biçimi değişiyordu,
       tahtada da bazıları renkli blok gibi duruyordu. */
    var IK = {
        anahtar: '<circle cx="8.4" cy="9.6" r="3.9"/><path d="M11.2 12.4 20 21.2M17.2 18.4l2-2M14.6 15.8l1.6-1.6"/>',
        kivilcim: '<path d="M12 3.2 13.7 9 19.5 10.7 13.7 12.4 12 18.2 10.3 12.4 4.5 10.7 10.3 9Z"/>' +
                  '<path d="M18.4 16.2l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6Z"/>',
        tahta: '<rect x="2.8" y="3.2" width="18.4" height="12.4" rx="2"/>' +
               '<path d="M6.6 7.2h8M6.6 10.6h5.4"/>' +
               '<path d="M12 15.6v2.8M8 21.4 12 18.4l4 3"/>',
        kep: '<path d="M12 4.2 22 8.6l-10 4.4L2 8.6Z"/>' +
             '<path d="M6.4 10.8v4.4c0 1.8 2.6 3.2 5.6 3.2s5.6-1.4 5.6-3.2v-4.4"/>',
        cami: '<path d="M4.6 20.6V12c0-2.6 3.3-4.6 7.4-4.6S19.4 9.4 19.4 12v8.6"/>' +
              '<path d="M12 7.4V4.2M2.4 20.6h19.2"/>' +
              '<path d="M9.6 20.6v-3.4a2.4 2.4 0 0 1 4.8 0v3.4"/>',
        okul: '<path d="M3.4 20.6V10l8.6-5 8.6 5v10.6M2 20.6h20"/>' +
              '<path d="M9.4 20.6v-5.2h5.2v5.2"/><path d="M12 5V2.6l3.4 1L12 4.8"/>',
        bina: '<rect x="4.4" y="3.6" width="15.2" height="17" rx="1.6"/>' +
              '<path d="M8.2 7.6h2.2M13.6 7.6h2.2M8.2 11.4h2.2M13.6 11.4h2.2"/>' +
              '<path d="M10.2 20.6v-4.2h3.6v4.2"/>',
        kitap: '<path d="M4 4.6h5.6A2.4 2.4 0 0 1 12 7v12a2 2 0 0 0-2-2H4Z"/>' +
               '<path d="M20 4.6h-5.6A2.4 2.4 0 0 0 12 7v12a2 2 0 0 1 2-2h6Z"/>',
        yildiz: '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8Z"/>',
        kisi: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20.4a7 7 0 0 1 14 0"/>',
        ikikisi: '<circle cx="9" cy="8.2" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/>' +
                 '<path d="M16.2 5.4a3.2 3.2 0 0 1 0 6.2M17.4 14.6A5.6 5.6 0 0 1 21 20"/>',
        sayi: '<path d="M4 9h16M4 15h16M9.5 4v16M14.5 4v16"/>',
        merdiven: '<path d="M3 20.6h5.2v-4.2h5.2v-4.2h5.2V8h2.4"/>',
        karisik: '<path d="M3.4 6.6h3.2c3.6 0 3.6 10.8 7.2 10.8h3.4"/>' +
                 '<path d="M3.4 17.4h3.2c1.5 0 2.4-1.9 3.2-4M14.4 12.6c.8-2.2 1.7-4.2 3.2-4.2h3.4"/>' +
                 '<path d="m18.6 5.6 2.6 2.8-2.6 2.8M18.6 14.6l2.6 2.8-2.6 2.8"/>',
        kagit: '<path d="M13.6 3.6H6.4A1.8 1.8 0 0 0 4.6 5.4v13.2a1.8 1.8 0 0 0 1.8 1.8h6"/>' +
               '<path d="M8 8h6M8 11.6h6M8 15.2h3"/><path d="m17.6 13.6 2.8 2.8-4 4h-2.8v-2.8Z"/>',
        liste: '<path d="M9 6.4h11M9 12h11M9 17.6h11"/>' +
               '<path d="m3.4 6.2 1.3 1.3 2.1-2.4M3.4 11.8l1.3 1.3 2.1-2.4M3.4 17.4l1.3 1.3 2.1-2.4"/>',
        harfler: '<path d="M3.4 18 7.8 6.4 12.2 18M4.9 14.4h5.8"/>' +
                 '<circle cx="17.6" cy="14.6" r="3.3"/><path d="M20.9 11.3v6.7"/>',
        telefon: '<rect x="7" y="2.6" width="10" height="18.8" rx="2.4"/>' +
                 '<path d="M10.6 5.6h2.8"/><circle cx="12" cy="18" r="1.1"/>',
        arama: '<circle cx="10.8" cy="10.8" r="6.2"/><path d="m15.4 15.4 4.6 4.6"/>',
        mikrofon: '<rect x="9.4" y="2.8" width="5.2" height="10.4" rx="2.6"/>' +
                  '<path d="M6 11.4v1.4a6 6 0 0 0 12 0v-1.4M12 18.8v2.6M9 21.4h6"/>',
        sohbet: '<path d="M20.4 12.8a7.6 7.6 0 0 1-8.2 7.6L5 21.8l1.5-4.6A7.6 7.6 0 1 1 20.4 12.8Z"/>',
        filiz: '<path d="M12 20.6v-7"/><path d="M12 13.6c0-3 2.4-5.4 5.4-5.4 0 3-2.4 5.4-5.4 5.4Z"/>' +
               '<path d="M12 15.2C9.6 15.2 7.6 13.2 7.6 10.8c2.4 0 4.4 2 4.4 4.4Z"/>',
        madalya: '<circle cx="12" cy="15" r="5.2"/><path d="m8.6 10.2-2.8-6M15.4 10.2l2.8-6"/>' +
                 '<path d="m12 12.6.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3Z"/>',
        ampul: '<path d="M9.4 17.4a6 6 0 1 1 5.2 0"/><path d="M9.6 17.4h4.8M10.4 20.4h3.2"/>',
        geri: '<path d="M14.8 5.2 8 12l6.8 6.8"/>'
    };
    function ikon(ad, sinif) {
        var g = IK[ad] || IK.yildiz;
        return '<svg class="' + (sinif || 'ka-ik') + '" viewBox="0 0 24 24" aria-hidden="true" ' +
               'focusable="false">' + g + '</svg>';
    }

    /* ---------------- sorular ---------------- */
    var SORULAR = {
        teacher: [
            { id: 'kurum', s: 'Nerede görev yapıyorsun?', c: [
                ['iho', 'İmam Hatip Ortaokulu', 'cami'],
                ['aihl', 'Anadolu İmam Hatip Lisesi', 'okul'],
                ['diger-okul', 'Diğer ortaokul / lise', 'bina'],
                ['kurankursu', 'Kur\'an Kursu', 'kitap'],
                ['ozel', 'Özel okul / kurs', 'yildiz'],
                ['universite', 'Üniversite', 'kep'],
                ['serbest', 'Serbest / özel ders', 'kisi']
            ] },
            { id: 'sinif', s: 'Hangi sınıflara giriyorsun?', c: [
                ['5-8', '5 – 8. sınıf (ortaokul)', 'sayi'],
                ['9-12', '9 – 12. sınıf (lise)', 'merdiven'],
                ['yetiskin', 'Yetişkin', 'kisi'],
                ['karma', 'Karma / hepsi', 'karisik']
            ] },
            { id: 'amac', s: 'Siteyi en çok ne için kullanacaksın?', c: [
                ['sinav', 'Sınav ve soru hazırlama', 'kagit'],
                ['tahta', 'Tahtada ders materyali', 'tahta'],
                ['takip', 'Öğrenci takibi / sınıf listeleri', 'liste'],
                ['kelime', 'Kelime ve sözlük çalışması', 'harfler'],
                ['hepsi', 'Hepsi', 'kivilcim']
            ] },
            { id: 'kaynak', s: 'Bizi nereden duydun?', c: [
                ['meslektas', 'Meslektaşım söyledi', 'ikikisi'],
                ['sosyal', 'Sosyal medya', 'telefon'],
                ['arama', 'Arama motoru', 'arama'],
                ['seminer', 'Seminer / kurs', 'mikrofon'],
                ['diger', 'Diğer', 'sohbet']
            ] }
        ],
        student: [
            { id: 'sinif', s: 'Kaçıncı sınıftasın?', c: [
                ['5-8', '5 – 8. sınıf', 'sayi'],
                ['9-12', '9 – 12. sınıf', 'merdiven'],
                ['universite', 'Üniversite', 'kep'],
                ['yetiskin', 'Yetişkin / kendi kendime', 'kisi']
            ] },
            { id: 'seviye', s: 'Arapça seviyen ne durumda?', c: [
                ['yeni', 'Yeni başladım', 'filiz'],
                ['harf', 'Harfleri okuyorum', 'harfler'],
                ['orta', 'Orta', 'kitap'],
                ['iyi', 'İyi', 'madalya']
            ] },
            { id: 'amac', s: 'Ne için kullanacaksın?', c: [
                ['okul', 'Okul dersi', 'okul'],
                ['sinav', 'Sınava hazırlık', 'kagit'],
                ['kuran', 'Kur\'an okuma', 'kitap'],
                ['merak', 'Kendi merakım', 'ampul']
            ] },
            { id: 'kaynak', s: 'Bizi nereden duydun?', c: [
                ['ogretmen', 'Öğretmenim söyledi', 'tahta'],
                ['arkadas', 'Arkadaşım', 'ikikisi'],
                ['sosyal', 'Sosyal medya', 'telefon'],
                ['arama', 'Arama motoru', 'arama'],
                ['diger', 'Diğer', 'sohbet']
            ] }
        ]
    };

    /* ---------------- durum ---------------- */
    var rol = '';           /* 'teacher' | 'student' — YALNIZ kayıtta sorulur */
    var cevap = {};         /* {kurum:'iho', ...} */
    var asama = 'giris';    /* 'giris' = e-posta formu + "Kayıt ol" kartı · 'rol' · 'soru' */
    var secimKilit = false; /* pencere açılırken karekod seçim ekranı devreye girmesin */
    var adim = 1;           /* 'soru' aşamasında kaçıncı soru (1..4) */
    var kapi = null;
    var icGecis = false;    /* moduDegistir'i biz çağırdıysak sarmalayıcı karışmasın */

    try {
        var t = JSON.parse(localStorage.getItem(TASLAK) || '{}');
        if (t && t.rol) { rol = t.rol; cevap = t.cevap || {}; }
    } catch (e) { }

    function taslakYaz() {
        try { localStorage.setItem(TASLAK, JSON.stringify({ rol: rol, cevap: cevap })); } catch (e) { }
    }
    function esc(t) {
        return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* Kayıt kipinde miyiz? auth.js'teki isLoginMode değişkenine bağlanmak
       yerine düğmenin yazısına bakıyoruz — o değişken yerel olabilir. */
    function kayitKipi() {
        var b = document.getElementById('auth-action-btn');
        return !!(b && /Kay/i.test(b.innerText || ''));
    }
    function tamam() {
        if (!rol) return false;
        var L = SORULAR[rol] || [];
        for (var i = 0; i < L.length; i++) if (!cevap[L[i].id]) return false;
        return true;
    }

    /* ---------------- stil ---------------- */
    function stilKur() {
        if (document.getElementById('kaStil')) return;
        var st = document.createElement('style');
        st.id = 'kaStil';
        st.textContent = [
            /* Kapı açıkken pencerenin öbür alanları KAPALI. Satır içi
               display yetmiyor: hesap/qrgiris.js pencere açılınca 30 ms
               sonra karekod seçim ekranını kendi gösteriyor. Sınıf +
               !important onun üstünde kalır. */
            '#login-modal.ka-kapali #qr-modal-alan,',
            '#login-modal.ka-kapali #giris-form-alani{display:none !important}',
            /* Giriş ekranında perde YALNIZ karekod alanını kapatır; form açık
               kalır. Perde ilk ~0,2 sn duruyor: hesap/qrgiris.js pencere
               açılınca 30 ms sonra kendi karekod seçim ekranını gösteriyor
               (modül içi çağrı, dışarıdan sarmalanamıyor) — perde onu yutuyor,
               sonra kalkıyor ki "Karekodla Giriş" tuşu normal çalışsın. */
            '#login-modal.ka-kapali.ka-form #giris-form-alani{display:block !important}',
            /* Tanıtım kartları (KidefTanitim) rol adımında kapının İÇİNE
               taşınıyor; orada görünür kalsın diye kural yalnız pencerenin
               doğrudan çocuğunu gizliyor. */
            '#login-modal.ka-kapali > .modal-content > #kdtGirisKartlar{display:none !important}',
            /* Kapı açıkken pencere de sadeleşiyor: ağır gölge yerine yumuşak. */
            '#login-modal.ka-kapali .modal-content{box-shadow:0 22px 60px rgba(16,22,30,.18) !important;',
            'border-radius:22px}',
            /* TANITIM KARTLARI geniş ekranda pencerenin DIŞINDA, sağ kenarda
               durur; dar ekranda kapının altına iner (.ka-tanit). */
            '#ka-yan{position:fixed;top:50%;inset-inline-end:26px;transform:translateY(-50%);',
            'width:298px;display:flex;flex-direction:column;gap:10px;z-index:1}',
            /* Dar sütunda kart üç parçaya bölünmesin: "İçeriye bak" rozeti
               alt satıra, tam genişliğe insin. */
            '#ka-yan .kdt-kart{flex-wrap:wrap;row-gap:9px;align-items:flex-start}',
            '#ka-yan .kdt-kart-ok{flex:1 1 100%;text-align:center;padding-block:7px}',
            '#ka-yan > p{margin:0;font-size:.79rem;font-weight:800;color:#fff;opacity:.92;',
            'letter-spacing:.2px;text-shadow:0 1px 4px rgba(0,0,0,.45)}',
            '#ka-yan .kdt-kartlar{grid-template-columns:1fr !important;margin:0 !important}',
            /* Giriş formunun altındaki "Kayıt ol" kartı */
            '#ka-kayit-kart{margin-top:6px;padding-top:14px;border-top:1px solid #EEF2F7}',
            '#ka-kayit-kart > button{display:flex;align-items:center;gap:13px;width:100%;',
            'box-sizing:border-box;text-align:start;background:none;border:0;border-radius:12px;',
            'padding:12px 12px;cursor:pointer;font:inherit;color:#1F2430;transition:background .15s}',
            '#ka-kayit-kart > button:hover{background:#FEF7EC}',
            '#ka-kayit-kart .ka-ik{width:34px;height:34px;flex:0 0 auto;color:#E08A00;stroke-width:1.6}',
            '#ka-kayit-kart b{display:block;font-size:1rem;font-weight:800}',
            '#ka-kayit-kart small{display:block;font-size:.82rem;color:#8A94A3;line-height:1.45;margin-top:1px}',
            '#ka-kayit-kart .ka-ok{margin-inline-start:auto;font-size:1.3rem;color:#E08A00;line-height:1}',
            '.ka-tanit{margin-top:20px;padding-top:16px;border-top:1px solid #EEF2F7}',
            '.ka-tanit > p{font-size:.82rem;font-weight:700;color:#8A94A3;margin:0 0 10px}',
            '.ka-tanit .kdt-kartlar{margin-bottom:0}',
            '#ka-kapi{animation:kaGel .2s ease both}',
            '@keyframes kaGel{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
            '.ka-ust{font-size:1.12rem;font-weight:800;color:#1F2430;margin:0 0 5px;line-height:1.35}',
            '.ka-alt{font-size:.86rem;color:#7A8698;margin:0 0 18px;line-height:1.5}',
            /* KUTUSUZ TASARIM: şıklar çerçeveli kart değil, ince bir ayraç
               çizgisiyle ayrılan satırlar. Pencerenin içinde ikinci bir
               kutu görüntüsü kalmıyor. */
            '.ka-sec{display:flex;flex-direction:column;gap:0}',
            '.ka-sec button{display:flex;align-items:center;gap:13px;width:100%;box-sizing:border-box;',
            'text-align:start;background:none;border:0;border-bottom:1px solid #EEF2F7;border-radius:10px;',
            'padding:13px 10px;cursor:pointer;font:inherit;font-size:.97rem;font-weight:600;color:#2C3E50;',
            'transition:background .15s,color .15s}',
            '.ka-sec button:last-child{border-bottom:0}',
            '.ka-sec button:hover{background:#F2FAF8;color:#0E7A68}',
            '.ka-sec button.sec{background:#E8F6F3;color:#0E7A68}',
            '.ka-sec .ka-ik{width:25px;height:25px;flex:0 0 auto;color:#16A085}',
            /* kip / rol seçimi — iri, çerçevesiz, arada ince ayraç */
            '.ka-rol{display:flex;gap:0;flex-wrap:wrap}',
            '.ka-rol button{flex:1 1 150px;display:flex;flex-direction:column;align-items:center;gap:10px;',
            'background:none;border:0;border-radius:14px;padding:20px 12px;cursor:pointer;',
            'font:inherit;font-weight:800;font-size:1.06rem;color:#1F2430;',
            'transition:background .16s,color .16s}',
            '.ka-rol button + button{border-inline-start:1px solid #EEF2F7}',
            '.ka-rol button:hover{background:#F2FAF8;color:#0E7A68}',
            '.ka-rol button small{display:block;font-weight:500;font-size:.8rem;color:#8A94A3;line-height:1.5}',
            '.ka-rol .ka-ik{width:46px;height:46px;color:#16A085;stroke-width:1.5}',
            '.ka-rol button.ikinci .ka-ik{color:#E08A00}',
            '.ka-rol button.ikinci:hover{background:#FEF7EC;color:#A85F00}',
            '@media(max-width:540px){.ka-rol{flex-direction:column}',
            '.ka-rol button + button{border-inline-start:0;border-top:1px solid #EEF2F7}}',
            /* ------------------------------------------------------------
               TAM SAYFA: giriş penceresi artık ortada küçük bir kutu değil,
               sayfanın tamamı. Yazılar da ona göre büyüdü (clamp ile ekrana
               göre ölçekleniyor — akıllı tahtada iri, telefonda okunur).
               ------------------------------------------------------------ */
            '#login-modal.ka-tam{padding:0 !important;align-items:stretch !important;',
            'justify-content:stretch !important;background:#fff !important}',
            '#login-modal.ka-tam .modal-content{width:100% !important;max-width:none !important;',
            'height:100% !important;max-height:none !important;border-radius:0 !important;',
            'box-shadow:none !important;margin:0 !important;background:#fff !important;',
            'overflow:auto !important;display:block !important;',
            'padding:clamp(20px,3.4vw,46px) clamp(16px,4vw,48px) clamp(28px,4vw,56px) !important}',
            /* içerik ortada, okunur genişlikte; sağ kenarda tanıtım rafına yer */
            '#login-modal.ka-tam .modal-content > *:not(.modal-close){max-width:760px;margin-inline:auto}',
            /* ✖ / geri: sayfanın kendi sağ üst köşesinde sabit dursun */
            '#login-modal.ka-tam .modal-close{position:fixed !important;',
            'top:clamp(12px,2vw,26px) !important;inset-inline-end:clamp(12px,2vw,26px) !important;',
            'inset-inline-start:auto !important;z-index:3}',
            '@media(min-width:1100px){#login-modal.ka-tam .modal-content{padding-inline-end:340px !important}}',
            '#login-modal.ka-tam #auth-title{font-size:clamp(1.7rem,3.4vw,2.9rem) !important;',
            'margin:0 auto clamp(14px,2vw,26px) !important}',
            '#login-modal.ka-tam .ka-ust{font-size:clamp(1.35rem,2.9vw,2.3rem)}',
            '#login-modal.ka-tam .ka-alt{font-size:clamp(.98rem,1.5vw,1.25rem);',
            'margin-bottom:clamp(18px,2.4vw,30px)}',
            '#login-modal.ka-tam .ka-sec button{font-size:clamp(1.12rem,2vw,1.6rem);',
            'padding:clamp(14px,1.8vw,22px) 12px;gap:18px}',
            '#login-modal.ka-tam .ka-sec .ka-ik{width:clamp(30px,3vw,44px);height:clamp(30px,3vw,44px)}',
            '#login-modal.ka-tam .ka-rol button{font-size:clamp(1.3rem,2.6vw,2rem);',
            'padding:clamp(24px,3vw,44px) 16px;gap:16px}',
            '#login-modal.ka-tam .ka-rol .ka-ik{width:clamp(58px,6vw,96px);height:clamp(58px,6vw,96px)}',
            '#login-modal.ka-tam .ka-rol button small{font-size:clamp(.92rem,1.3vw,1.1rem)}',
            '#login-modal.ka-tam .ka-nokta{height:7px}',
            '#login-modal.ka-tam .ka-say{font-size:clamp(.95rem,1.3vw,1.15rem)}',
            '#login-modal.ka-tam .form-group label{font-size:clamp(.98rem,1.4vw,1.2rem) !important}',
            '#login-modal.ka-tam input,#login-modal.ka-tam select,#login-modal.ka-tam textarea',
            '{font-size:clamp(1.05rem,1.5vw,1.3rem) !important;padding:clamp(13px,1.5vw,18px) !important}',
            '#login-modal.ka-tam #auth-action-btn{font-size:clamp(1.1rem,1.8vw,1.45rem) !important;',
            'padding:clamp(14px,1.8vw,20px) !important}',
            '#login-modal.ka-tam #ka-kayit-kart b{font-size:clamp(1.15rem,2vw,1.6rem)}',
            '#login-modal.ka-tam #ka-kayit-kart small{font-size:clamp(.92rem,1.3vw,1.1rem)}',
            '#login-modal.ka-tam #ka-kayit-kart .ka-ik{width:clamp(38px,3.4vw,52px);',
            'height:clamp(38px,3.4vw,52px)}',
            '#login-modal.ka-tam #ka-serit{font-size:clamp(1rem,1.5vw,1.2rem);padding:14px 18px}',
            '#login-modal.ka-tam .qr-giris-tus{font-size:clamp(1rem,1.5vw,1.25rem)}',
            /* beyaz zeminde tanıtım rafının başlığı koyu olsun */
            '#login-modal.ka-tam #ka-yan > p{color:#8A94A3;text-shadow:none}',
            /* ✖ / ‹ geri tuşu */
            '#login-modal.ka-tam .modal-close{width:clamp(44px,4vw,58px) !important;',
            'height:clamp(44px,4vw,58px) !important;font-size:clamp(1.4rem,2.4vw,2rem) !important}',
            '.modal-close.ka-geri-tus{display:flex !important;align-items:center;justify-content:center}',
            '.modal-close.ka-geri-tus .ka-ik{width:62%;height:62%;stroke-width:2.2}',
            /* ortak simge biçimi — emoji yok, hepsi kontur çizim */
            '.ka-ik{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;',
            'stroke-linejoin:round;display:block}',
            /* ilerleme */
            '.ka-ilerle{display:flex;align-items:center;gap:6px;margin:16px 0 0}',
            '.ka-nokta{flex:1;height:5px;border-radius:99px;background:#E9EEF5;transition:.25s}',
            '.ka-nokta.dolu{background:#16A085}',
            '.ka-tus{display:flex;gap:10px;align-items:center;margin-top:14px}',
            '.ka-geri{background:none;border:0;color:#8A94A3;font:inherit;font-size:.86rem;cursor:pointer;',
            'text-decoration:underline;padding:6px 0}',
            '.ka-geri:hover{color:#425061}',
            '.ka-say{margin-inline-start:auto;font-size:.8rem;color:#A6B0BE;font-weight:700}',
            /* form üstündeki rol şeridi */
            '#ka-serit{display:flex;align-items:center;gap:10px;background:#E8F6F3;border:1px solid #BFE7DE;',
            'border-radius:13px;padding:11px 14px;margin-bottom:16px;font-size:.92rem;color:#14705F;font-weight:700}',
            '#ka-serit .ka-ik{width:24px;height:24px;flex:0 0 auto}',
            '#ka-serit button{margin-inline-start:auto;background:#fff;border:1px solid #BFE7DE;border-radius:9px;',
            'color:#16A085;font:inherit;font-size:.82rem;font-weight:700;padding:6px 11px;cursor:pointer}',
            '#ka-serit button:hover{background:#16A085;color:#fff}',
            /* yönetici listesi */
            '.ka-y-ozet{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}',
            '.ka-y-rozet{background:#F0F4F8;border-radius:9px;padding:7px 11px;font-size:.84rem;color:#425061}',
            '.ka-y-rozet b{color:#16A085}',
            '.ka-y-sat{border:1px solid #E9EEF5;border-radius:11px;padding:11px 13px;margin-bottom:8px;background:#fff}',
            '.ka-y-bas{display:flex;align-items:center;gap:8px;font-weight:700;color:#2C3E50;font-size:.93rem}',
            '.ka-y-bas span.ka-rz{font-size:.74rem;font-weight:800;padding:3px 8px;border-radius:7px;',
            'background:#E8F6F3;color:#14705F;text-transform:uppercase;letter-spacing:.3px}',
            '.ka-y-bas span.ka-rz.ogr{background:#FEF3E2;color:#B06B00}',
            '.ka-y-cev{margin:7px 0 0;font-size:.85rem;color:#5A6676;line-height:1.7}',
            '.ka-y-cev i{color:#8A94A3;font-style:normal}',
            '.ka-y-suz{display:flex;gap:8px;margin:0 0 12px;flex-wrap:wrap}',
            '.ka-y-suz button{background:#fff;border:1px solid #E9EEF5;border-radius:9px;padding:7px 13px;',
            'font:inherit;font-size:.85rem;font-weight:700;color:#5A6676;cursor:pointer}',
            '.ka-y-suz button.sec{background:#16A085;border-color:#16A085;color:#fff}'
        ].join('');
        document.head.appendChild(st);
    }

    /* ---------------- kapı ---------------- */
    function alanlar() {
        return {
            form: document.getElementById('giris-form-alani'),
            qr: document.getElementById('qr-modal-alan'),
            kart: document.getElementById('kdtGirisKartlar'),
            baslik: document.getElementById('auth-title')
        };
    }

    function kapiAc(baslangic) {
        var m = document.getElementById('login-modal');
        if (!m) return;
        stilKur();
        m.classList.add('ka-tam');
        m.classList.add('ka-kapali');
        m.classList.remove('ka-form');
        clearTimeout(perdeZaman);
        var a = alanlar();

        if (!kapi) {
            kapi = document.createElement('div');
            kapi.id = 'ka-kapi';
            var kutu = m.querySelector('.modal-content');
            if (!kutu) return;
            kutu.insertBefore(kapi, a.form || null);
        }
        if (baslangic) asama = baslangic;
        if (asama === 'soru' && !rol) asama = 'rol';
        if (asama === 'giris') { girisEkrani(); return; }
        kapi.style.display = 'block';
        ciz();
    }

    function kapiKapat() {
        var m = document.getElementById('login-modal');
        if (m) { m.classList.remove('ka-kapali'); m.classList.remove('ka-form'); }
        clearTimeout(perdeZaman);
        var a = alanlar();
        kartlariBirak();
        /* İçerik de boşaltılıyor: gizli kalan eski şık düğmeleri DOM'da
           durursa sonraki adımda yanlışlıkla tıklanabiliyor. */
        if (kapi) { kapi.style.display = 'none'; kapi.innerHTML = ''; }
        seritKur();

        /* Hem girişte hem kayıtta DOĞRUDAN form açılıyor: e-posta + şifre
           alanları ve altındaki "Karekodla Giriş" satırı bir arada görünsün.
           Eskiden girişte önce karekod seçim ekranı geliyordu, e-postayla
           girecek kişi bir tuş daha basıyordu. */
        if (typeof window.qrElleGirisAc === 'function') {
            try { window.qrElleGirisAc(); } catch (e) { if (a.form) a.form.style.display = ''; }
        } else if (a.form) {
            a.form.style.display = '';
        }
        if (a.baslik) a.baslik.innerText = kayitKipi() ? 'Sisteme Kayıt Ol' : 'Sisteme Giriş Yap';
        asama = kayitKipi() ? 'soru' : 'giris';
        kapatTusu(null);
        formEkrani();
    }

    /* SAĞ ÜSTTEKİ TUŞ: ilk ekranda ✖ (pencereyi kapatır), ara ekranlarda
       ‹ geri. Aynı düğme; yazısı ve işi değişiyor. */
    function kapatTusu(geri) {
        var x = document.querySelector('#login-modal .modal-close');
        if (!x) return;
        if (x.__kaEski == null) x.__kaEski = x.innerHTML;
        if (geri) {
            x.innerHTML = ikon('geri');
            x.classList.add('ka-geri-tus');
            x.setAttribute('title', 'Geri');
            x.onclick = geri;
        } else {
            x.innerHTML = x.__kaEski;
            x.classList.remove('ka-geri-tus');
            x.setAttribute('title', 'Kapat');
            x.onclick = function () { if (typeof window.closeLoginModal === 'function') window.closeLoginModal(); };
        }
    }

    /* GİRİŞ EKRANI — pencerenin ilk görünümü.
       Başlıktaki giriş okuna basan kişi doğrudan e-posta + şifre alanlarını
       ve altındaki "Karekodla Giriş" satırını görüyor; hemen altında da
       ayrı bir "Kayıt ol" kartı duruyor. Kayıt yolu (rol sorusu + 4 soru)
       yalnız o karta basılınca açılıyor. */
    var perdeZaman = 0;
    function girisEkrani() {
        var m = document.getElementById('login-modal');
        if (m) { m.classList.add('ka-tam'); m.classList.add('ka-kapali'); m.classList.add('ka-form'); }
        clearTimeout(perdeZaman);
        perdeZaman = setTimeout(function () {
            var m2 = document.getElementById('login-modal');
            if (m2 && asama === 'giris') { m2.classList.remove('ka-kapali'); m2.classList.remove('ka-form'); }
        }, 220);
        kartlariBirak();
        if (kapi) { kapi.style.display = 'none'; kapi.innerHTML = ''; }
        var a = alanlar();
        if (typeof window.qrElleGirisAc === 'function') {
            try { window.qrElleGirisAc(); } catch (e) { if (a.form) a.form.style.display = ''; }
        } else if (a.form) { a.form.style.display = ''; }
        if (a.baslik) a.baslik.innerText = kayitKipi() ? 'Sisteme Kayıt Ol' : 'Sisteme Giriş Yap';
        kapatTusu(null);                       /* ilk ekran: ✖ */
        formEkrani();
    }

    /* Formun altındaki "Kayıt ol" kartını kurar / gizler ve tanıtım
       kartlarını yerleştirir. Kayıt kipinde kart gizlenir; oradaki
       "Zaten hesabınız var mı? Giriş Yap" bağlantısı geri döner. */
    function formEkrani() {
        var a = alanlar();
        if (!a.form) return;
        var kayitta = kayitKipi();
        var kart = document.getElementById('ka-kayit-kart');
        if (!kart) {
            kart = document.createElement('div');
            kart.id = 'ka-kayit-kart';
            kart.innerHTML = '<button type="button">' + ikon('kivilcim') +
                '<span><b>Kayıt ol</b><small>İlk kez geliyorum; yeni hesap açayım</small></span>' +
                '<span class="ka-ok" aria-hidden="true">\u203A</span></button>';
            a.form.appendChild(kart);
            kart.querySelector('button').onclick = function () { kayitYolu(); };
        } else if (kart.parentNode !== a.form) {
            a.form.appendChild(kart);
        }
        kart.style.display = kayitta ? 'none' : '';

        /* Kendi kartımız varken pencerenin kendi "Kayıt Ol" bağlantısı
           ikinci kez durmasın. */
        var dg = document.getElementById('auth-switch-container');
        if (dg) dg.style.display = kayitta ? '' : 'none';

        /* Tanıtım kartlarının dar ekrandaki yeri: kayıt kartının ALTINDA
           ayrı bir kutu. (Kayıt kartının kendisini hedef verirsek geniş
           ekranda o da gizleniyordu.) */
        var tk = document.getElementById('ka-tanit-form');
        if (!tk) {
            tk = document.createElement('div');
            tk.id = 'ka-tanit-form';
            tk.className = 'ka-tanit';
            tk.innerHTML = '<p>Girince neler yapabileceğine bak:</p>';
            a.form.appendChild(tk);
        } else if (tk.parentNode !== a.form) { a.form.appendChild(tk); }

        seritKur();
        if (kayitta) { tk.style.display = 'none'; kartlariBirak(); }
        else kartlariGetir(tk);
    }

    /* "Kayıt ol" kartı: kayıt kipine geç ve rol sorusunu aç. */
    function kayitYolu() {
        if (!kayitKipi()) modDegis();
        if (tamam()) { kapiKapat(); return; }
        asama = 'rol'; adim = 1; kapiAc('rol');
    }

    /* Rol sekmesi artık formda durmuyor; yerine "değiştir" tuşlu şerit. */
    function seritKur() {
        var a = alanlar();
        if (!a.form) return;
        var tb = document.getElementById('btn-teacher');
        var sekme = tb ? tb.parentNode : null;
        if (sekme) sekme.style.display = 'none';

        var s = document.getElementById('ka-serit');
        if (!s) {
            s = document.createElement('div');
            s.id = 'ka-serit';
            a.form.insertBefore(s, a.form.firstChild);
        }
        var ogretmen = (rol === 'teacher');
        s.innerHTML = ikon(ogretmen ? 'tahta' : 'kep') +
            '<span>' + (ogretmen ? 'Öğretmen' : 'Öğrenci') + ' olarak kayıt oluyorsun</span>' +
            '<button type="button">Değiştir</button>';
        s.querySelector('button').onclick = function () { kapiAc('rol'); };
        /* Şerit YALNIZ kayıt formunda. Girişte öğretmen/öğrenci ayrımı yok:
           hangi rolde olduğun zaten hesabından biliniyor. */
        s.style.display = (rol && kayitKipi()) ? 'flex' : 'none';
    }

    /* Tanıtım kartları ("Öğrenci misin? / Öğretmen misin? — İçeriye bak")
       normalde pencerenin en üstünde duruyor. Rol adımında onları kapının
       içine, soruların altına alıyoruz: öğretmen seçmeden önce girince ne
       yapabileceğini görsün. Adım değişince ya da kapı kapanınca yerine
       geri konuyor — yoksa kapi.innerHTML onları silerdi. */
    var kartYuva = null;
    var YAN_ESIK = 1100;                 /* bu genişlikten itibaren yan sütun */
    function yanSutun() {
        var m = document.getElementById('login-modal');
        if (!m) return null;
        var y = document.getElementById('ka-yan');
        if (!y) {
            y = document.createElement('div');
            y.id = 'ka-yan';
            y.innerHTML = '<p>Girince neler yapabileceğine bak:</p>';
            m.appendChild(y);
        }
        return y;
    }
    function kartlariGetir(darHedef) {
        var k = document.getElementById('kdtGirisKartlar');
        if (!k) return;
        if (!kartYuva) kartYuva = { eb: k.parentNode, ka: k.nextSibling };
        var kutu = darHedef || (kapi ? kapi.querySelector('.ka-tanit') : null);
        var genis = (window.innerWidth || 1200) >= YAN_ESIK;
        k.style.display = '';
        if (genis) {
            /* Pencerenin DIŞINDA, sağ kenarda dursun. */
            var y = yanSutun();
            if (y) { y.style.display = 'flex'; y.appendChild(k); if (kutu) kutu.style.display = 'none'; return; }
        }
        var y2 = document.getElementById('ka-yan');
        if (y2) y2.style.display = 'none';
        if (kutu) { kutu.style.display = ''; kutu.appendChild(k); }
    }
    function kartlariBirak() {
        var y = document.getElementById('ka-yan');
        if (y) y.style.display = 'none';
        var k = document.getElementById('kdtGirisKartlar');
        if (!k) return;
        /* Kartlar YALNIZ ilk iki ekranda görünür; giriş/kayıt formunun
           üstünde ikinci kez çıkmasınlar. */
        k.style.display = 'none';
        if (!kartYuva) return;
        var disarda = (kapi && kapi.contains(k)) || (y && y.contains(k));
        if (!disarda) return;
        try { kartYuva.eb.insertBefore(k, kartYuva.ka); } catch (e) { kartYuva.eb.appendChild(k); }
    }
    /* Pencere boyu değişince yan sütun ↔ alt blok geçişi yenilensin. */
    var yanZaman = 0;
    window.addEventListener('resize', function () {
        clearTimeout(yanZaman);
        yanZaman = setTimeout(function () {
            if (asama === 'giris') { if (!kayitKipi()) formEkrani(); return; }
            if (kapi && kapi.style.display !== 'none' && asama === 'rol') ciz();
        }, 160);
    });

    function ciz() {
        if (!kapi) return;
        kartlariBirak();
        var a = alanlar();

        /* ---- ROL EKRANI (yalnız kayıt yolunda) ------------------------- */
        if (asama === 'rol') {
            if (a.baslik) a.baslik.innerText = 'Kayıt — önce seni tanıyalım';
            kapi.innerHTML =
                '<p class="ka-ust">Öğretmen olarak mı, öğrenci olarak mı kayıt oluyorsun?</p>' +
                '<p class="ka-alt">Hesabın buna göre açılıyor; sonradan değiştirmek için ' +
                'yöneticiye yazman gerekir. Lütfen doğru olanı seç.</p>' +
                '<div class="ka-rol">' +
                '<button type="button" data-r="teacher">' + ikon('tahta') + 'Öğretmenim' +
                '<small>Sınıfım var; sınav hazırlarım,<br>öğrenci takibi yaparım</small></button>' +
                '<button type="button" data-r="student" class="ikinci">' + ikon('kep') + 'Öğrenciyim' +
                '<small>Arapça öğreniyorum;<br>ders ve alıştırma yaparım</small></button>' +
                '</div>' +
                '<div class="ka-tanit"><p>Emin değil misin? Girince neler yapabileceğine bak:</p></div>';
            [].forEach.call(kapi.querySelectorAll('.ka-rol button'), function (b) {
                b.onclick = function () { rolSec(b.getAttribute('data-r')); };
            });
            kapatTusu(function () {
                if (kayitKipi()) modDegis();          /* giriş kipine dön */
                asama = 'giris'; girisEkrani();
            });
            kartlariGetir();
            return;
        }

        /* ---- 3. ekran: ANKET SORULARI ---------------------------------- */
        var L = SORULAR[rol] || [];
        var q = L[adim - 1];
        if (!q) { kapiKapat(); return; }
        if (a.baslik) a.baslik.innerText = 'Kayıt — birkaç kısa soru';

        var h = '<p class="ka-ust">' + esc(q.s) + '</p>' +
            '<p class="ka-alt">Sana uygun olanı seç. ' +
            (rol === 'teacher' ? 'Öğretmen' : 'Öğrenci') + ' hesabı açılıyor.</p><div class="ka-sec">';
        q.c.forEach(function (o) {
            h += '<button type="button" data-k="' + esc(o[0]) + '"' +
                (cevap[q.id] === o[0] ? ' class="sec"' : '') + '>' +
                ikon(o[2]) + '<span>' + esc(o[1]) + '</span></button>';
        });
        h += '</div><div class="ka-ilerle">';
        for (var i = 1; i <= L.length; i++) h += '<span class="ka-nokta' + (i <= adim ? ' dolu' : '') + '"></span>';
        h += '</div><div class="ka-tus">' +
            '<span class="ka-say">' + adim + ' / ' + L.length + '</span></div>';
        kapi.innerHTML = h;

        [].forEach.call(kapi.querySelectorAll('.ka-sec button'), function (b) {
            b.onclick = function () {
                cevap[q.id] = b.getAttribute('data-k');
                taslakYaz();
                if (adim >= L.length) kapiKapat(); else { adim++; ciz(); }
            };
        });
        kapatTusu(function () {
            if (adim > 1) { adim--; ciz(); } else { asama = 'rol'; ciz(); }
        });
    }

    /* auth.js'in giriş/kayıt kipini çevirir; kendi sarmalayıcımız bu
       çağrıda devreye girmesin diye bayrak kalkıyor. */
    function modDegis() {
        if (typeof window.moduDegistir !== 'function') return;
        icGecis = true;
        try { window.moduDegistir(); } catch (e) { }
        icGecis = false;
    }

    function rolSec(r) {
        if (rol && rol !== r) cevap = {};      /* rol değişti → cevaplar sıfır */
        rol = r;
        taslakYaz();
        try { if (typeof window.setRole === 'function') window.setRole(r); } catch (e) { }
        asama = 'soru'; adim = 1; ciz();
    }

    /* ---------------- belge alanı (kayitalani.js buradan okur) -------- */
    function belgeAlani(r) {
        r = (r === 'teacher') ? 'teacher' : 'student';
        var L = SORULAR[r] || [];
        var liste = [];
        L.forEach(function (q) {
            var k = cevap[q.id];
            if (!k) return;
            var m = '';
            q.c.forEach(function (o) { if (o[0] === k) m = o[1]; });
            liste.push({ id: q.id, s: q.s, k: k, c: m });
        });
        if (!liste.length) return null;
        return { rol: r, tarih: new Date().toISOString(), cevaplar: liste };
    }

    /* ---------------- yönetici bölümü ---------------- */
    var yFiltre = 'hepsi';
    function yoneticiBolum() {
        /* Stil burada da kurulmalı: yönetici oturumu boyunca giriş
           penceresi hiç açılmayabilir, o zaman stilKur() çağrılmamış olur. */
        stilKur();
        var kok = document.getElementById('admin-section');
        if (!kok) return;
        var kart = kok.querySelector('.glass-card');
        if (!kart || document.getElementById('ka-yonetici')) return;

        var d = document.createElement('details');
        d.className = 'admin-details';
        d.id = 'ka-yonetici';
        d.setAttribute('name', 'admin-accordion');
        d.innerHTML =
            '<summary class="admin-summary">📋 Kayıt Anketi <span id="ka-y-rozet"></span></summary>' +
            '<div style="padding:10px 0;">' +
            '<p style="font-size:.86rem;color:#7f8c8d;margin:0 0 12px;">' +
            'Kayıt olurken sorulan sorulara verilen cevaplar. Rol sorusu zorunlu olduğu için ' +
            'öğretmenler artık yanlışlıkla öğrenci olarak kaydolamıyor.</p>' +
            '<div class="ka-y-suz">' +
            '<button data-f="hepsi" class="sec">Hepsi</button>' +
            '<button data-f="teacher">Öğretmenler</button>' +
            '<button data-f="student">Öğrenciler</button>' +
            '<button data-f="yenile" style="margin-inline-start:auto;">🔄 Yenile</button>' +
            '</div><div id="ka-y-liste">Bölümü açınca yüklenir…</div></div>';
        kart.appendChild(d);

        d.addEventListener('toggle', function () { if (d.open) yYukle(); });
        [].forEach.call(d.querySelectorAll('.ka-y-suz button'), function (b) {
            b.onclick = function () {
                var f = b.getAttribute('data-f');
                if (f === 'yenile') { yYukle(true); return; }
                yFiltre = f;
                [].forEach.call(d.querySelectorAll('.ka-y-suz button'), function (x) {
                    if (x.getAttribute('data-f') !== 'yenile') x.classList.toggle('sec', x === b);
                });
                yCiz();
            };
        });
    }

    var yVeri = null;
    function yYukle(zorla) {
        var el = document.getElementById('ka-y-liste');
        if (!el) return;
        if (yVeri && !zorla) { yCiz(); return; }
        /* hesap/auth.js'te `let db` — window'a yazılmıyor; bu yüzden
           window.db'ye bakmak yanlış sonuç veriyor. Önce çıplak db,
           olmazsa firestore(). */
        var _db = null;
        try { if (typeof db !== 'undefined' && db) _db = db; } catch (e) { }
        if (!_db) { try { _db = window.db || firebase.firestore(); } catch (e) { } }
        if (!_db) {
            el.innerHTML = '<p style="color:#8A94A3;">Bağlantı yok; liste alınamadı.</p>';
            return;
        }
        el.innerHTML = 'Yükleniyor…';
        _db.collection('kullanicilar').get().then(function (snap) {
            yVeri = [];
            snap.forEach(function (doc) {
                var v = doc.data() || {};
                if (!v.anket) return;
                yVeri.push({
                    ad: v.name || '', email: v.email || doc.id,
                    rol: (v.anket.rol || v.role || 'student'), anket: v.anket
                });
            });
            yVeri.sort(function (a, b) {
                return String(b.anket.tarih || '').localeCompare(String(a.anket.tarih || ''));
            });
            yCiz();
        }).catch(function (e) {
            el.innerHTML = '<p style="color:#EF5350;">Liste alınamadı: ' + esc(e.message) + '</p>';
        });
    }

    function yCiz() {
        var el = document.getElementById('ka-y-liste');
        if (!el) return;
        var hepsi = yVeri || [];
        var rz = document.getElementById('ka-y-rozet');
        if (rz) rz.textContent = hepsi.length ? '(' + hepsi.length + ')' : '';

        var L = hepsi.filter(function (k) { return yFiltre === 'hepsi' || k.rol === yFiltre; });
        if (!L.length) {
            el.innerHTML = '<p style="color:#8A94A3;">Bu süzgeçte cevap yok. ' +
                '(Anket 27.09.2026\'da eklendi; daha önce kayıt olanlarda cevap bulunmaz.)</p>';
            return;
        }

        /* özet: her sorunun en çok verilen cevapları */
        var say = {};
        L.forEach(function (k) {
            (k.anket.cevaplar || []).forEach(function (c) {
                var a = k.rol + '|' + c.s + '|' + c.c;
                say[a] = (say[a] || 0) + 1;
            });
        });
        var ozet = Object.keys(say).sort(function (a, b) { return say[b] - say[a]; }).slice(0, 6);
        var h = '<div class="ka-y-ozet">';
        h += '<span class="ka-y-rozet">Toplam <b>' + L.length + '</b> cevap</span>';
        ozet.forEach(function (a) {
            var p = a.split('|');
            h += '<span class="ka-y-rozet">' + esc(p[2]) + ' <b>' + say[a] + '</b></span>';
        });
        h += '</div>';

        L.forEach(function (k) {
            var ogretmen = (k.rol === 'teacher');
            var tar = '';
            try { tar = new Date(k.anket.tarih).toLocaleDateString('tr-TR'); } catch (e) { }
            h += '<div class="ka-y-sat"><div class="ka-y-bas">' +
                '<span class="ka-rz' + (ogretmen ? '' : ' ogr') + '">' +
                (ogretmen ? 'Öğretmen' : 'Öğrenci') + '</span>' +
                '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
                esc(k.ad || k.email) + '</span>' +
                '<span style="font-size:.78rem;color:#A6B0BE;font-weight:600;">' + esc(tar) + '</span></div>' +
                '<p class="ka-y-cev">';
            (k.anket.cevaplar || []).forEach(function (c) {
                h += '<i>' + esc(c.s) + '</i> → <b>' + esc(c.c) + '</b><br>';
            });
            h += '</p></div>';
        });
        el.innerHTML = h;
    }

    /* ---------------- var olan işlevleri sar ---------------- */
    function sar() {
        if (typeof window.showLoginModal === 'function' && !window.showLoginModal.__ka) {
            var eskiAc = window.showLoginModal;
            var yeniAc = function () {
                /* ÖNCE PERDE, SONRA PENCERE. Kapıyı zamanlayıcıya bırakırsak
                   arada pencerenin eski görünümü (e-posta formu ya da karekod
                   seçim ekranı) bir an görünüyor; sayfa meşgulse bu "an" bir
                   saniyeyi buluyor ve iki ekran üst üste açılmış gibi oluyor.
                   Sınıf ve kapı artık SENKRON kuruluyor: hiçbir kare boyunca
                   başka bir şey görünmüyor. */
                try {
                    stilKur();
                    secimKilit = true;               /* karekod seçim ekranı atlanır */
                    var m0 = document.getElementById('login-modal');
                    if (m0) { m0.classList.add('ka-tam'); m0.classList.add('ka-kapali'); }
                } catch (e) { }
                var r = eskiAc.apply(this, arguments);
                try { kapiAc('giris'); } catch (e) { }
                /* Emniyet: hesap/qrgiris.js pencere açılınca 30 ms sonra kendi
                   seçim ekranını gösteriyor; sınıf o sırada duruyor mu, bak. */
                try {
                    setTimeout(function () {
                        if (asama === 'giris') { girisEkrani(); return; }
                        if (!kapi || kapi.style.display === 'none') return;
                        var m1 = document.getElementById('login-modal');
                        if (m1) m1.classList.add('ka-kapali');
                    }, 80);
                    setTimeout(function () { secimKilit = false; }, 1200);
                } catch (e) { }
                return r;
            };
            yeniAc.__ka = 1;
            window.showLoginModal = yeniAc;
        }
        if (typeof window.moduDegistir === 'function' && !window.moduDegistir.__ka) {
            var eskiMod = window.moduDegistir;
            var yeniMod = function () {
                var r = eskiMod.apply(this, arguments);
                if (icGecis) return r;          /* çeviren biziz, kapıyı bozma */
                try {
                    if (kayitKipi()) { if (!tamam()) kapiAc('rol'); else formEkrani(); }
                    else { asama = 'giris'; girisEkrani(); }
                } catch (e) { }
                return r;
            };
            yeniMod.__ka = 1;
            window.moduDegistir = yeniMod;
        }
        if (typeof window.authIslemi === 'function' && !window.authIslemi.__ka) {
            var eskiIs = window.authIslemi;
            var yeniIs = function () {
                if (kayitKipi() && !tamam()) { kapiAc(rol ? 'soru' : 'rol'); return; }
                return eskiIs.apply(this, arguments);
            };
            yeniIs.__ka = 1;
            window.authIslemi = yeniIs;
        }
        /* "Karekodla Giriş" tuşu: seçim ekranı yerine karekodu DOĞRUDAN
           üretsin. Perde kalkar, sağ üstteki tuş da forma dönüş için geri
           işaretine döner. */
        if (typeof window.qrGirisTusu === 'function' && !window.qrGirisTusu.__ka) {
            var eskiQr = window.qrGirisTusu;
            var yeniQr = function () {
                try {
                    var m = document.getElementById('login-modal');
                    if (m) { m.classList.remove('ka-kapali'); m.classList.remove('ka-form'); }
                    clearTimeout(perdeZaman);
                } catch (e) { }
                if (typeof window.qrGirisAc === 'function') {
                    try {
                        window.qrGirisAc();
                        kapatTusu(function () { asama = 'giris'; girisEkrani(); });
                        return;
                    } catch (e) { }
                }
                return eskiQr.apply(this, arguments);
            };
            yeniQr.__ka = 1;
            window.qrGirisTusu = yeniQr;
        }
        if (typeof window.closeLoginModal === 'function' && !window.closeLoginModal.__ka) {
            var eskiKap = window.closeLoginModal;
            var yeniKap = function () {
                try {
                    var m = document.getElementById('login-modal');
                    if (m) { m.classList.remove('ka-kapali'); m.classList.remove('ka-form');
                             m.classList.remove('ka-tam'); }
                    clearTimeout(perdeZaman);
                    kapatTusu(null);
                    kartlariBirak();
                    if (kapi) { kapi.style.display = 'none'; kapi.innerHTML = ''; }
                } catch (e) { }
                return eskiKap.apply(this, arguments);
            };
            yeniKap.__ka = 1;
            window.closeLoginModal = yeniKap;
        }
        if (typeof window.renderAdminPanel === 'function' && !window.renderAdminPanel.__ka) {
            var eskiYon = window.renderAdminPanel;
            var yeniYon = function () {
                var r = eskiYon.apply(this, arguments);
                try { yoneticiBolum(); } catch (e) { }
                return r;
            };
            yeniYon.__ka = 1;
            window.renderAdminPanel = yeniYon;
        }
    }
    sar();
    window.addEventListener('load', sar);
    setTimeout(sar, 1200);
    setTimeout(sar, 3500);

    /* ---------------- dışa açılan yüz ---------------- */
    window.KidefAnket = {
        belgeAlani: belgeAlani,   /* hesap/kayitalani.js buradan okur */
        tamam: tamam,
        rol: function () { return rol; },
        cevaplar: function () { return JSON.parse(JSON.stringify(cevap)); },
        sorular: SORULAR,
        ac: function (b) { kapiAc(b); },
        temizle: function () { rol = ''; cevap = {}; try { localStorage.removeItem(TASLAK); } catch (e) { } },
        _yonetici: yoneticiBolum
    };
})();
