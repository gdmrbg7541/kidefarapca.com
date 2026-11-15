/* ==========================================================================
   HAYIRLI CUMALAR  —  sistem/cuma.js  (13.11.2026)
   --------------------------------------------------------------------------
   Öğretmen: "Cuma günleri sitede hayırlı cumalar adında bi vugun veya
   bildirim yanıp sönebilir, cuma ile ilgili ayet verilebilir"

   NE YAPAR
     · Cuma günü (Türkiye saatine göre, 00.00–24.00) ana sayfanın SOL ALTINDA
       «Hayırlı Cumalar» adlı küçük bir düğme belirir; düğmenin halesi ve
       üstündeki nokta yanıp söner.
     · Düğmeye basınca kart açılır: Arapça «Cuma mübarek olsun» dileği ve
       Cuma Suresi'nden âyet (9. âyet; 10. âyet sekmeyle seçilir), altında
       sade Türkçe anlamı.
     · Kart bir kez açılınca düğme o Cuma için yanıp sönmeyi bırakır, sakin
       durur. Kartta «Bugün bir daha gösterme» vardır (yalnız o gün için).
     · Cuma değilse sayfaya HİÇBİR ŞEY eklenmez (ne öğe, ne stil).
     · Site kilitliyse (SiteKilit) ve ziyaretçi içeri alınmıyorsa çizilmez;
       kilit kararı çıkana kadar (html.kilit-bekle) beklenir.
     · Alt çubuklarla (sepet, ders alt şeridi, ödeme özeti, dil önerisi,
       sol alt hatırlatma kartları) çakışırsa düğme onların üstüne çıkar.
     · «Hareketi azalt» ayarı ve düşük güç kipinde yanıp sönme durur; nokta
       sabit yanar (bildirim işareti kalır).

   DENEME KOLAYLIĞI
     · Adrese ?cuma=1 eklenirse her gün görünür ve hep yanıp söner
       («görüldü» ve «gizle» kayıtlarına bakılmaz); ?cuma=0 hiç göstermez.
     · Konsol: KidefCuma.ac() / .kapat() / .yenile() / .cumaMi()

   ÂYET METNİ: Cuma Suresi 9–10. âyetler; Tanzil (Uthmani) ve Medine Mushafı
   metniyle harf harf karşılaştırıldı, sitenin sade yazı biçimine getirildi
   (şedde önce, tenvin yok). Anlam satırları sade Türkçe ile yazıldı;
   AYETLER dizisinde tek yerde değişir.
   ========================================================================== */
(function () {
    'use strict';
    if (window.KidefCuma) return;
    /* Gömülü sayfada (iframe) çizilmez: üstteki sayfa kendi kararını verir. */
    try { if (window.self !== window.top) return; } catch (e) { return; }

    var SURUM = 1;
    var GORULDU = 'kidef_cuma_goruldu';   /* kartı açtığı son Cuma (YYYY-AA-GG, Türkiye günü) */
    var GIZLI = 'kidef_cuma_gizli';       /* «bugün bir daha gösterme» dediği Cuma */
    var UTC_FARK = 3 * 3600 * 1000;       /* Türkiye: sabit UTC+3 (yaz saati uygulaması yok) */
    var GECIKME = 2600;                   /* açılış animasyonu bitsin, sonra belirsin */
    var KONTROL_MS = 60000;               /* gece yarısı geçişi ve kilit değişimi için */
    var KILIT_MS = 700;                   /* kilit kararı beklenirken sık bak */
    var IZIN_MS = 3000;                   /* Cuma ama kilit içeri almıyorsa: giriş yapılınca çıksın */

    /* Düğmenin üstüne çıkması gereken alt çubuklar ve sol alt kartlar */
    var ENGELLER = [
        '#unified-cart', '#lesson-bottom-nav', '#offline-checkout-summary',
        '#online-checkout-summary', '#kdDilOneri', '#sdvKart', '.dst-hatirlat'
    ];

    var AYETLER = [
        { n: 9, ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ",
          tr: "Ey iman edenler! Cuma günü namaza çağrı yapıldığında Allah'ı anmaya yönelin, alışverişi bırakın. Bilirseniz, bu sizin için daha hayırlıdır." },
        { n: 10, ar: "فَإِذَا قُضِيَتِ الصَّلَاةُ فَانتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِن فَضْلِ اللَّهِ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ",
          tr: "Namaz tamamlandığında yeryüzüne dağılın; Allah'ın lütfundan nasibinizi arayın ve Allah'ı çokça anın. Umulur ki kurtuluşa erersiniz." }
    ];
    var SELAM = 'جُمُعَة مُبَارَكَة';

    /* Sitenin dil sözlüğünde bu anahtarlar yoksa Türkçe kalır (sitenin genel
       kuralı). İngilizce ve Arapça için küçük bir yedek sözlük burada. */
    var CEV = {
        en: {
            'cuma.baslik': 'Blessed Friday',
            'cuma.ipucu': 'Blessed Friday — read the Friday verse',
            'cuma.sure': 'Surah Al-Jumu’ah',
            'cuma.a9': 'Verse 9',
            'cuma.a10': 'Verse 10',
            'cuma.gizle': 'Don’t show again today',
            'cuma.kapat': 'Close',
            'cuma.meal9': 'O you who believe! When the call to prayer is made on Friday, hasten to the remembrance of Allah and leave off trading. That is better for you, if you only knew.',
            'cuma.meal10': 'And when the prayer is over, spread through the land, seek Allah’s bounty, and remember Allah often, so that you may succeed.'
        },
        ar: {
            'cuma.baslik': 'جمعة مباركة',
            'cuma.ipucu': 'جمعة مباركة — اقرأ آية الجمعة',
            'cuma.sure': 'سورة الجمعة',
            'cuma.a9': 'الآية 9',
            'cuma.a10': 'الآية 10',
            'cuma.gizle': 'لا تُظهر هذا اليوم مرة أخرى',
            'cuma.kapat': 'إغلاق',
            'cuma.meal9': '',
            'cuma.meal10': ''
        }
    };

    var HILAL = 'M16.05 4.05A12 12 0 1 0 25.62 21.59A10 10 0 1 1 16.05 4.05z';
    var YILDIZ = 'M24.80 5.00L25.86 7.94L28.98 8.04L26.51 9.96L27.39 12.96L24.80 11.20L22.21 12.96L23.09 9.96L20.62 8.04L23.74 7.94z';
    var SIM = '<svg class="kcm-sim" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
              '<path class="kcm-hilal" fill="#fff" d="' + HILAL + '"/>' +
              '<path class="kcm-yildiz" fill="#FFD86B" d="' + YILDIZ + '"/></svg>';
    var X_SIM = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
                '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

    var S = { dugme: null, perde: null, kart: null, aktif: 9, onceki: null, zaman: 0, aralik: 0, oturumGizli: false };

    /* ------------------------------------------------------------- yardımcılar */
    function el(etiket, sinif) {
        var e = document.createElement(etiket);
        if (sinif) e.className = sinif;
        return e;
    }
    function oku(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function yaz(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

    function T(k, tr) {
        var m = tr, x, kod, s;
        try {
            if (window.KidefDil && window.KidefDil.metin) {
                x = window.KidefDil.metin(k, tr);
                if (x != null && x !== '') m = x;
            }
        } catch (e) { }
        if (m === tr) {
            try {
                kod = (window.KidefDil && window.KidefDil.kod && window.KidefDil.kod()) || 'tr';
                s = CEV[kod];
                if (s && s[k] != null) m = s[k];
            } catch (e) { }
        }
        return m;
    }

    /* Türkiye günü: cihaz saati ne olursa olsun UTC+3 */
    function trZaman() { return new Date(Date.now() + UTC_FARK); }
    function cumaMi() { return trZaman().getUTCDay() === 5; }
    function gunAnahtar() {
        var d = trZaman();
        return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
    }
    function zorla() {
        try {
            var m = /[?&]cuma=([01])(?:&|#|$)/.exec(window.location.search || '');
            return m ? m[1] : '';
        } catch (e) { return ''; }
    }
    function goruldu() { return zorla() !== '1' && oku(GORULDU) === gunAnahtar(); }
    function gosterilsin() {
        var z = zorla();
        if (z === '0' || S.oturumGizli) return false;
        if (z === '1') return true;
        if (!cumaMi()) return false;
        return oku(GIZLI) !== gunAnahtar();
    }
    function kilitBekliyor() {
        try { return document.documentElement.classList.contains('kilit-bekle'); } catch (e) { return false; }
    }
    function izinli() {
        try {
            if (window.SiteKilit && typeof window.SiteKilit.izinliMi === 'function') return !!window.SiteKilit.izinliMi();
        } catch (e) { }
        return true;
    }
    function ayetBul(n) { return AYETLER[0].n === n ? AYETLER[0] : AYETLER[1]; }

    /* ------------------------------------------------------------------- stil */
    function stilKur() {
        if (document.getElementById('kcm-stil')) return;
        var css = [
            '#kcmDugme{position:fixed;left:18px;left:calc(18px + env(safe-area-inset-left,0px));bottom:var(--kcm-yuk,18px);bottom:calc(var(--kcm-yuk,18px) + env(safe-area-inset-bottom,0px));z-index:950;',
            '  display:inline-flex;align-items:center;gap:9px;margin:0;padding:10px 16px 10px 13px;min-height:44px;box-sizing:border-box;max-width:calc(100vw - 24px);',
            '  border:0;border-radius:999px;cursor:pointer;color:#fff;font:inherit;font-size:15px;font-weight:700;line-height:1.1;letter-spacing:.2px;white-space:nowrap;',
            '  text-shadow:0 1px 1px rgba(0,0,0,.18);background:linear-gradient(135deg,#1BB394 0%,#0E7C66 100%);',
            '  box-shadow:0 8px 22px rgba(14,124,102,.40),0 0 0 2px rgba(255,216,107,.65);-webkit-tap-highlight-color:transparent;',
            '  transition:bottom .28s ease,transform .18s ease,box-shadow .18s ease;animation:kcmGir .7s cubic-bezier(.22,1,.36,1);}',
            '#kcmDugme:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(14,124,102,.48),0 0 0 2px rgba(255,216,107,.9);}',
            '#kcmDugme:active{transform:scale(.97);}',
            '#kcmDugme:focus-visible{outline:3px solid #FFC107;outline-offset:3px;}',
            '#kcmDugme .kcm-sim{width:24px;height:24px;flex:none;display:block;overflow:visible;}',
            '#kcmDugme .kcm-yazi{min-width:0;overflow:hidden;text-overflow:ellipsis;}',
            '#kcmDugme .kcm-nokta{flex:none;width:10px;height:10px;border-radius:50%;background:#FFD86B;box-shadow:0 0 0 2px rgba(255,255,255,.85);}',
            '#kcmDugme.kcm-yan .kcm-nokta{animation:kcmParla 1.1s ease-in-out infinite;}',
            '#kcmDugme.kcm-yan::after{content:"";position:absolute;left:-4px;right:-4px;top:-4px;bottom:-4px;border-radius:999px;',
            '  border:2px solid rgba(255,216,107,.95);pointer-events:none;animation:kcmHalka 1.7s ease-out infinite;}',
            '#kcmDugme.kcm-yan .kcm-yildiz{transform-box:fill-box;transform-origin:center;animation:kcmYildiz 1.1s ease-in-out infinite;}',
            '#kcmDugme.kcm-sakin .kcm-nokta{display:none;}',
            '@keyframes kcmGir{from{opacity:0;transform:translateY(14px) scale(.9);}to{opacity:1;transform:none;}}',
            '@keyframes kcmParla{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.2;transform:scale(.6);}}',
            '@keyframes kcmHalka{0%{transform:scale(.97);opacity:.95;}70%{transform:scale(1.14,1.55);opacity:0;}100%{transform:scale(1.14,1.55);opacity:0;}}',
            '@keyframes kcmYildiz{0%,100%{opacity:1;transform:scale(1) rotate(0deg);}50%{opacity:.35;transform:scale(.7) rotate(36deg);}}',
            '@keyframes kcmPerde{from{opacity:0;}to{opacity:1;}}',
            '@keyframes kcmKart{from{opacity:0;transform:translateY(22px) scale(.96);}to{opacity:1;transform:none;}}',
            '@keyframes kcmAyet{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}',

            '.kcm-perde{position:fixed;left:0;top:0;right:0;bottom:0;z-index:9100;display:flex;align-items:flex-end;justify-content:flex-start;',
            '  box-sizing:border-box;padding:0 18px 70px;background:rgba(15,42,67,.30);animation:kcmPerde .22s ease both;-webkit-tap-highlight-color:transparent;cursor:pointer;}',
            '.kcm-perde.kcm-gidiyor{opacity:0;transition:opacity .18s ease;}',
            '.kcm-kart{width:100%;max-width:460px;max-height:calc(100vh - 100px);overflow-y:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;',
            '  background:#fff;color:#0f2a43;border-radius:24px;box-shadow:0 26px 70px rgba(15,42,67,.40);outline:0;transform-origin:0 100%;cursor:auto;',
            '  animation:kcmKart .38s cubic-bezier(.22,1,.36,1) both;}',
            '.kcm-ust{display:flex;align-items:center;gap:12px;padding:16px 14px 14px 18px;color:#fff;border-radius:24px 24px 0 0;',
            '  background:linear-gradient(135deg,#1BB394 0%,#0E7C66 100%);}',
            '.kcm-ust .kcm-sim{width:36px;height:36px;flex:none;display:block;}',
            '.kcm-ust-yazi{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:1px;}',
            '.kcm-baslik{font-size:1.22rem;line-height:1.2;font-weight:800;letter-spacing:.2px;}',
            '.kcm-selam{font-size:1.2rem;line-height:1.6;color:#FFE9A8;direction:rtl;}',
            '.kcm-x{flex:none;width:40px;height:40px;padding:0;border:0;border-radius:50%;cursor:pointer;color:#fff;background:rgba(255,255,255,.2);',
            '  display:flex;align-items:center;justify-content:center;font:inherit;}',
            '.kcm-x:hover{background:rgba(255,255,255,.34);}',
            '.kcm-govde{padding:16px 18px 6px;}',
            '.kcm-sekmeler{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;}',
            '.kcm-sekme{font:inherit;font-size:.92rem;font-weight:700;padding:7px 15px;min-height:38px;border-radius:999px;cursor:pointer;',
            '  border:1.5px solid #CDE8E1;background:#F2FBF8;color:#0E7C66;}',
            '.kcm-sekme.secili{background:#16A085;border-color:#16A085;color:#fff;}',
            '.kcm-kaynak{margin:0 0 8px;font-size:.88rem;font-weight:700;letter-spacing:.04em;color:#8A5A00;}',
            '.kcm-ar{margin:0 0 12px;padding:16px 16px 18px;border-radius:18px;background:#FFFAEC;border:1px solid #F2DFA6;',
            '  text-align:center;direction:rtl;font-size:1.75rem;font-size:clamp(1.55rem,5.6vw,2rem);line-height:2.2;color:#0f2a43;}',
            '.kcm-tr{margin:0 0 6px;font-size:1.02rem;line-height:1.6;color:#3A566E;}',
            '.kcm-ar.kcm-gir,.kcm-tr.kcm-gir{animation:kcmAyet .3s ease both;}',
            '.kcm-ayak{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:10px 18px 16px;}',
            '.kcm-gizle{background:none;border:0;padding:8px 4px;font:inherit;font-size:.88rem;color:#5F7486;text-decoration:underline;cursor:pointer;}',
            '.kcm-tamam{font:inherit;font-size:.98rem;font-weight:700;padding:10px 24px;min-height:44px;border:0;border-radius:999px;cursor:pointer;',
            '  color:#fff;background:#16A085;box-shadow:0 6px 16px rgba(22,160,133,.35);}',
            '.kcm-tamam:hover{background:#12907a;}',
            '.kcm-x:focus-visible,.kcm-sekme:focus-visible,.kcm-gizle:focus-visible,.kcm-tamam:focus-visible{outline:3px solid #FFC107;outline-offset:2px;}',

            '@media (max-width:576px){',
            '  #kcmDugme{left:12px;left:calc(12px + env(safe-area-inset-left,0px));bottom:var(--kcm-yuk,14px);bottom:calc(var(--kcm-yuk,14px) + env(safe-area-inset-bottom,0px));padding:9px 14px 9px 11px;font-size:14px;}',
            '  .kcm-perde{padding:0;justify-content:center;background:rgba(15,42,67,.45);}',
            '  .kcm-kart{max-width:none;max-height:88vh;border-radius:24px 24px 0 0;padding-bottom:env(safe-area-inset-bottom,0px);}',
            '}',
            '@media (orientation:landscape) and (max-height:500px){',
            '  .kcm-perde{padding:0 12px 12px;align-items:center;justify-content:center;}',
            '  .kcm-kart{max-width:560px;max-height:calc(100vh - 24px);border-radius:20px;}',
            '  .kcm-ust{border-radius:20px 20px 0 0;padding:10px 12px 10px 16px;}',
            '  .kcm-ust .kcm-sim{width:30px;height:30px;}',
            '  .kcm-x{width:36px;height:36px;}',
            '  .kcm-govde{padding:10px 16px 2px;}',
            '  .kcm-sekmeler{margin-bottom:8px;}',
            '  .kcm-ar{padding:8px 12px 10px;margin-bottom:8px;font-size:1.45rem;font-size:clamp(1.3rem,3.4vw,1.6rem);line-height:2;}',
            '  .kcm-ayak{padding:6px 16px 12px;}',
            '}',
            '@media (prefers-reduced-motion:reduce){',
            '  #kcmDugme,.kcm-perde,.kcm-kart,.kcm-ar.kcm-gir,.kcm-tr.kcm-gir{animation:none !important;}',
            '  #kcmDugme.kcm-yan::after{display:none;}',
            '  #kcmDugme.kcm-yan .kcm-nokta,#kcmDugme.kcm-yan .kcm-yildiz{animation:none !important;}',
            '}',
            'html.dusuk-guc #kcmDugme,html.dusuk-guc .kcm-perde,html.dusuk-guc .kcm-kart,html.dusuk-guc .kcm-ar.kcm-gir,html.dusuk-guc .kcm-tr.kcm-gir{animation:none !important;}',
            'html.dusuk-guc #kcmDugme.kcm-yan::after{display:none;}',
            'html.dusuk-guc #kcmDugme.kcm-yan .kcm-nokta,html.dusuk-guc #kcmDugme.kcm-yan .kcm-yildiz{animation:none !important;}',
            '@media print{#kcmDugme,.kcm-perde{display:none !important;}}'
        ].join('\n');
        var st = document.createElement('style');
        st.id = 'kcm-stil';
        st.textContent = css;
        (document.head || document.documentElement).appendChild(st);
    }

    /* ------------------------------------------------------------ düğme */
    function durumSinifi() {
        var d = S.dugme;
        if (!d) return;
        var gorulmus = goruldu();
        d.classList.toggle('kcm-yan', !gorulmus);
        d.classList.toggle('kcm-sakin', gorulmus);
    }
    function yazilariTazele() {
        var d = S.dugme, ip;
        if (d) {
            d.querySelector('.kcm-yazi').textContent = T('cuma.baslik', 'Hayırlı Cumalar');
            ip = T('cuma.ipucu', 'Hayırlı Cumalar — Cuma âyetini oku');
            d.setAttribute('aria-label', ip);
            d.setAttribute('title', ip);
        }
        if (S.kart) { kartYazilari(); ayetYaz(false); }
    }
    function ciz() {
        if (S.dugme && S.dugme.parentNode) { durumSinifi(); return; }
        if (!document.body) return;
        stilKur();
        var b = el('button', 'kcm-dugme');
        b.type = 'button';
        b.id = 'kcmDugme';
        b.setAttribute('aria-haspopup', 'dialog');
        b.innerHTML = SIM + '<span class="kcm-yazi"></span><span class="kcm-nokta" aria-hidden="true"></span>';
        b.addEventListener('click', function () { ac(); });
        S.dugme = b;
        document.body.appendChild(b);
        yazilariTazele();
        durumSinifi();
        altHizala();
        if (!S.aralik) S.aralik = setInterval(function () { if (!document.hidden) altHizala(); }, 1000);
    }
    function kaldir() {
        if (S.kart) kapat();
        if (S.dugme) {
            try { if (S.dugme.parentNode) S.dugme.parentNode.removeChild(S.dugme); } catch (e) { }
            S.dugme = null;
        }
        if (S.aralik) { clearInterval(S.aralik); S.aralik = 0; }
    }

    /* Alt çubuklar ve sol alt kartlar varsa düğme onların üstüne çıkar */
    function altHizala() {
        var d = S.dugme;
        if (!d || !d.parentNode) return;
        var h = window.innerHeight || document.documentElement.clientHeight || 0;
        var r0 = d.getBoundingClientRect(), yuk = 0, i, j, l, n, r, cs, yeni, simdi;
        for (i = 0; i < ENGELLER.length; i++) {
            try { l = document.querySelectorAll(ENGELLER[i]); } catch (e) { continue; }
            for (j = 0; j < l.length; j++) {
                n = l[j];
                r = n.getBoundingClientRect();
                if (r.width < 4 || r.height < 4 || r.top >= h || r.bottom < h - 160) continue;
                if (r.left >= r0.right || r.right <= r0.left) continue;
                cs = window.getComputedStyle(n);
                if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
                if (h - r.top > yuk) yuk = h - r.top;
            }
        }
        yeni = yuk ? (Math.round(yuk) + 12) + 'px' : '';
        simdi = d.style.getPropertyValue('--kcm-yuk');
        if (yeni !== simdi) {
            if (yeni) d.style.setProperty('--kcm-yuk', yeni); else d.style.removeProperty('--kcm-yuk');
        }
    }

    /* -------------------------------------------------------------- kart */
    function kartYazilari() {
        var k = S.kart;
        if (!k) return;
        k.querySelector('.kcm-baslik').textContent = T('cuma.baslik', 'Hayırlı Cumalar');
        k.querySelector('.kcm-selam').textContent = SELAM;
        var sk = k.querySelectorAll('.kcm-sekme'), i;
        for (i = 0; i < sk.length; i++) {
            var n = parseInt(sk[i].getAttribute('data-n'), 10);
            sk[i].textContent = T('cuma.a' + n, n + '. âyet');
        }
        var x = k.querySelector('.kcm-x');
        x.setAttribute('aria-label', T('cuma.kapat', 'Kapat'));
        k.querySelector('.kcm-gizle').textContent = T('cuma.gizle', 'Bugün bir daha gösterme');
        k.querySelector('.kcm-tamam').textContent = T('cuma.kapat', 'Kapat');
    }
    function ayetYaz(anim) {
        var k = S.kart;
        if (!k) return;
        var ay = ayetBul(S.aktif), i, ar, tr, meal;
        var sk = k.querySelectorAll('.kcm-sekme');
        for (i = 0; i < sk.length; i++) {
            var sec = parseInt(sk[i].getAttribute('data-n'), 10) === ay.n;
            sk[i].classList.toggle('secili', sec);
            sk[i].setAttribute('aria-pressed', sec ? 'true' : 'false');
        }
        k.querySelector('.kcm-kaynak').textContent = T('cuma.sure', 'Cuma Suresi') + ' · ' + T('cuma.a' + ay.n, ay.n + '. âyet');
        ar = k.querySelector('.kcm-ar');
        tr = k.querySelector('.kcm-tr');
        ar.textContent = ay.ar;
        meal = T('cuma.meal' + ay.n, ay.tr);
        tr.textContent = meal;
        tr.style.display = meal ? '' : 'none';
        if (anim) {
            ar.classList.remove('kcm-gir'); tr.classList.remove('kcm-gir');
            void ar.offsetWidth;
            ar.classList.add('kcm-gir'); tr.classList.add('kcm-gir');
        }
    }
    function kartKur() {
        var perde = el('div', 'kcm-perde'), kart = el('div', 'kcm-kart'), i, sk, b;
        kart.setAttribute('role', 'dialog');
        kart.setAttribute('aria-modal', 'true');
        kart.setAttribute('aria-labelledby', 'kcmBaslik');
        kart.tabIndex = -1;
        kart.innerHTML =
            '<div class="kcm-ust">' + SIM +
              '<div class="kcm-ust-yazi"><b class="kcm-baslik" id="kcmBaslik"></b><span class="kcm-selam" dir="rtl" lang="ar"></span></div>' +
              '<button type="button" class="kcm-x" data-kcm="kapat">' + X_SIM + '</button>' +
            '</div>' +
            '<div class="kcm-govde">' +
              '<div class="kcm-sekmeler" role="group"></div>' +
              '<p class="kcm-kaynak"></p>' +
              '<p class="kcm-ar" dir="rtl" lang="ar"></p>' +
              '<p class="kcm-tr"></p>' +
            '</div>' +
            '<div class="kcm-ayak">' +
              '<button type="button" class="kcm-gizle" data-kcm="gizle"></button>' +
              '<button type="button" class="kcm-tamam" data-kcm="kapat"></button>' +
            '</div>';
        sk = kart.querySelector('.kcm-sekmeler');
        for (i = 0; i < AYETLER.length; i++) {
            b = el('button', 'kcm-sekme');
            b.type = 'button';
            b.setAttribute('data-n', String(AYETLER[i].n));
            sk.appendChild(b);
        }
        perde.appendChild(kart);
        perde.addEventListener('click', function (e) {
            var t = e.target, bt;
            if (t === perde) { kapat(); return; }
            bt = t && t.closest ? t.closest('[data-kcm],[data-n]') : null;
            if (!bt || !kart.contains(bt)) return;
            if (bt.getAttribute('data-n')) { S.aktif = parseInt(bt.getAttribute('data-n'), 10) === 10 ? 10 : 9; ayetYaz(true); return; }
            if (bt.getAttribute('data-kcm') === 'gizle') { gizleBugun(); return; }
            kapat();
        });
        S.perde = perde;
        S.kart = kart;
        return perde;
    }
    function odaklanabilirler() {
        var l = S.kart ? S.kart.querySelectorAll('button:not([disabled])') : [], a = [], i;
        for (i = 0; i < l.length; i++) a.push(l[i]);
        return a;
    }
    function tus(e) {
        if (!S.kart) return;
        var k = e.key || e.keyCode, f, ilk, son, a;
        if (k === 'Escape' || k === 'Esc' || k === 27) { e.preventDefault(); e.stopPropagation(); kapat(); return; }
        if (k === 'Tab' || k === 9) {
            f = odaklanabilirler();
            if (!f.length) return;
            ilk = f[0]; son = f[f.length - 1]; a = document.activeElement;
            if (e.shiftKey && (a === ilk || !S.kart.contains(a) || a === S.kart)) { e.preventDefault(); son.focus(); }
            else if (!e.shiftKey && (a === son || !S.kart.contains(a))) { e.preventDefault(); ilk.focus(); }
        }
    }
    function gorulduYaz() {
        if (zorla() !== '1') yaz(GORULDU, gunAnahtar());
        durumSinifi();
    }
    function ac(n) {
        if (S.kart) return;
        S.aktif = (n === 10) ? 10 : 9;
        S.onceki = document.activeElement;
        stilKur();
        document.body.appendChild(kartKur());
        kartYazilari();
        ayetYaz(false);
        gorulduYaz();
        document.addEventListener('keydown', tus, true);
        setTimeout(function () {
            try { if (S.kart) S.kart.querySelector('.kcm-x').focus(); } catch (e) { }
        }, 40);
    }
    function kapat() {
        if (!S.perde) return;
        document.removeEventListener('keydown', tus, true);
        var p = S.perde, o = S.onceki;
        S.perde = null; S.kart = null; S.onceki = null;
        p.classList.add('kcm-gidiyor');
        setTimeout(function () { try { if (p.parentNode) p.parentNode.removeChild(p); } catch (e) { } }, 190);
        try {
            var hedef = (o && o !== document.body && document.documentElement.contains(o)) ? o : S.dugme;
            if (hedef && hedef.focus) hedef.focus();
        } catch (e) { }
    }
    function gizleBugun() {
        if (zorla() !== '1') yaz(GIZLI, gunAnahtar());
        S.oturumGizli = true;      /* kayıt tutulamasa bile bu oturumda bir daha çıkmaz */
        kapat();
        kaldir();
    }

    /* ------------------------------------------------------- denetim döngüsü */
    function planla(ms) {
        clearTimeout(S.zaman);
        S.zaman = setTimeout(kontrol, ms);
    }
    function kontrol() {
        var ms = KONTROL_MS;
        try {
            if (kilitBekliyor()) ms = KILIT_MS;
            else if (gosterilsin()) {
                if (izinli()) ciz();
                else { kaldir(); ms = IZIN_MS; }     /* kilit içeri almıyor: giriş yapılınca hemen çıksın */
            }
            else kaldir();
        } catch (e) { }
        planla(ms);
    }
    function basla() {
        document.addEventListener('kidef:dil', yazilariTazele);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) planla(300); });
        window.addEventListener('resize', altHizala);
        planla(GECIKME);
    }

    window.KidefCuma = {
        surum: SURUM,
        cumaMi: cumaMi,
        ac: function (n) { ac(n); },
        kapat: kapat,
        yenile: function () { clearTimeout(S.zaman); kontrol(); }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
    else basla();
})();
