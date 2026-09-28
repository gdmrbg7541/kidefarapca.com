/* ==================================================================
   SÖZLÜK SEKMELERİ — sozluk.html
   ------------------------------------------------------------------
   NİYE VAR: "Öğretmen Özel" kategorisinde üç ayrı kart duruyordu —
   Sözlük, Sözlük Simülasyonu, Sözlük Dedektifi. Üçü de aynı işin
   parçası (kelimeyi bul / yalın hâlini bul / sözlük hâlini bul), o
   yüzden tek karta indirildi: index'te yalnız "Sözlük" kartı var,
   öbür ikisi bu sayfanın içinde SEKME olarak açılıyor.

   İMAM HATİP kartlarına dokunulmadı: oradaki Sözlük Simülasyonu
   kartı (sistem/sinifmodul.js) yerinde duruyor — sınıf modülünde
   görev olarak veriliyor, sekmeye gömülmesi işi bozardı.

   NASIL: oyunlar kendi sayfalarında kalıyor, burada <iframe> içinde
   açılıyor. Böylece iki sayfanın kodu/verisi kopyalanmıyor, tek
   doğruluk kaynağı yine kendi dosyaları. Sekme ilk tıklandığında
   yükleniyor (sayfa açılışı ağırlaşmasın), sonra bellekte kalıyor —
   ileri geri geçince oyun baştan başlamıyor.

   Bu dosya kendi başına yeter: stilini kendi yazar, sozluk.html'in
   hiçbir öğesine dokunmaz (yalnız kendi sekmesi etkinken sözlüğün
   gövdesini gizler).

   Doğrudan açmak için: sozluk.html#simulasyon · sozluk.html#dedektif
   ================================================================== */
(function () {
    'use strict';
    if (window.KidefSozlukSekme) return;

    /* "Sözlük" diye bir sekme YOK: sayfanın kendisi zaten sözlük. Geri
       dönmek için soldaki başlığa (Sözlük yazısı + simgesi) basılıyor —
       ya da seçili sekmeye bir daha. */
    var SEKME = [
        {
            id: 'simulasyon', ad: 'Simülasyon', url: 'sozluksimulasyonu.html',
            /* Oyunun kendi başlık satırı (başlık + geri + Joker + İpuçları)
               gizleniyor: sekme şeridi zaten üstte duruyor, o satır bir
               şeritlik yeri boşuna yiyordu. */
            gizle: '.header',
            /* Başlık satırındaki İŞE YARAR tuşlar yukarı, sekmelerin yanına
               taşınıyor. Taşımak yerine VEKİL tuş konuyor: aslı çerçevede
               gizli duruyor, vekile basınca o tıklanıyor. Böylece oyunun
               kendi mantığı (getElementById ile bulup metnini güncellemesi)
               hiç bozulmuyor. */
            vekil: [
                { sec: '#joker-btn', ad: 'Joker' },
                { sec: '#hint-btn', ad: 'İpuçları', kisa: '💡' }
            ]
        },
        {
            id: 'dedektif', ad: 'Dedektif', url: 'yenisozlukdedektifi.html'
            /* Dedektif'in ayrı bir başlık satırı yok; yalnız iki "ana sayfa"
               simgesi var, onlar da aşağıdaki ortak kuralla gizleniyor. */
        }
    ];
    /* Sözlüğün kendi gövdesi — oyun sekmesindeyken gizlenir. */
    var GOVDE = ['.szk-arama', '#szkSonuc', '#szkFav', '#szkKlavye'];

    var secili = 'sozluk';   /* 'sozluk' = sekme seçili değil */
    var serit = null, kaydirak = null, kap = null;
    var cerceve = {};                 /* id -> iframe */

    /* ---------------- stil ---------------- */
    function stilKur() {
        if (document.getElementById('szsStil')) return;
        var st = document.createElement('style');
        st.id = 'szsStil';
        st.textContent = [
            /* Şerit ÜST ŞERİDİN İÇİNDE, en sağda. Yeşil zeminde beyaz kaydırak;
               seçili sekmenin yazısı yeşile döner. */
            '#szsSerit{flex:0 0 auto;display:inline-flex}',
            /* oyunun başlığından yukarı taşınan tuşlar */
            '#szsArac{flex:0 0 auto;margin-inline-start:auto;display:inline-flex;gap:8px;',
            'align-items:center}',
            '#szsArac:empty{margin-inline-start:auto}',
            '#szsArac + #szsSerit{margin-inline-start:10px}',
            '.szs-vekil{border:1.6px solid rgba(255,255,255,.55);background:rgba(255,255,255,.12);',
            'color:#fff;font:inherit;font-weight:800;border-radius:999px;cursor:pointer;',
            'font-size:clamp(.78rem,.95vw,1.2rem);padding:clamp(4px,.45vw,9px) clamp(10px,1.1vw,20px);',
            'white-space:nowrap;transition:background .18s}',
            '.szs-vekil:hover{background:rgba(255,255,255,.26)}',
            '.szs-vekil:disabled{opacity:.45;cursor:default}',
            /* SEVİYE ŞERİDİ — oyunun kendi seviye satırı yukarı, yeşil
               şeridin içine alındı; aşağıda bir satır boşa gitmiyor.
               Görünüşü sekme kaydırağının küçüğü: beyaz saydam hap,
               etkin seviye dolu beyaz + yeşil yazı. */
            '.szs-sev{display:inline-flex;align-items:center;gap:7px}',
            '.szs-sev-et{font-weight:800;font-size:.76rem;letter-spacing:.3px;',
            'color:rgba(255,255,255,.85);text-transform:uppercase}',
            '.szs-sev-yuva{display:inline-flex;gap:2px;background:rgba(255,255,255,.18);',
            'border-radius:999px;padding:3px}',
            '.szs-sev-yuva button{border:0;background:none;cursor:pointer;font:inherit;',
            'font-weight:800;color:rgba(255,255,255,.92);border-radius:999px;',
            'font-size:clamp(.76rem,.9vw,1.05rem);padding:3px clamp(9px,.9vw,14px);',
            'min-width:26px;transition:background .18s,color .18s}',
            '.szs-sev-yuva button:hover{color:#fff;background:rgba(255,255,255,.22)}',
            '.szs-sev-yuva button[aria-pressed="true"]{background:#fff;color:#0E7C66;',
            'box-shadow:0 2px 7px rgba(0,0,0,.18)}',
            '.szs-sev-yuva button:disabled{opacity:.4;cursor:default}',
            '@media(max-width:700px){.szs-sev-et{display:none}',
            '.szs-sev-yuva button{font-size:.74rem;padding:3px 8px;min-width:22px}}',
            /* Dar ekranda üst şerit: başlığın yazısı gizlenir (simge kalır),
               etiketler küçülür, taşarsa şerit kendi içinde kayar — sayfa
               yatay kaymaz. */
            '@media(max-width:700px){.szs-vekil{font-size:.76rem;padding:4px 9px}',
            '.szs-bas-yazi{display:none}',
            '.szk-ust{overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;gap:8px;',
            'padding-inline:10px}',
            '.szk-ust::-webkit-scrollbar{display:none}',
            '.szk-ust h1{padding-inline:8px}',
            '#szsArac{gap:6px}#szsArac + #szsSerit{margin-inline-start:6px}}',
            '@media(max-width:480px){#szsYuva button{font-size:.74rem;padding:4px 9px}',
            '.szs-vekil{font-size:.72rem;padding:4px 8px}}',
            '#szsYuva{position:relative;display:inline-flex;gap:2px;',
            'background:rgba(255,255,255,.18);border-radius:999px;padding:4px}',
            '#szsKaydirak{position:absolute;top:4px;bottom:4px;border-radius:999px;',
            'background:#fff;box-shadow:0 2px 9px rgba(0,0,0,.22);opacity:0;',
            'transition:transform .3s cubic-bezier(.25,1,.5,1),width .3s cubic-bezier(.25,1,.5,1),',
            'opacity .2s;left:0;width:0;pointer-events:none}',
            '#szsKaydirak.acik{opacity:1}',
            '#szsYuva button{position:relative;z-index:1;border:0;background:none;cursor:pointer;',
            'font:inherit;font-weight:800;color:rgba(255,255,255,.92);border-radius:999px;',
            'font-size:clamp(.82rem,1vw,1.3rem);padding:clamp(5px,.55vw,11px) clamp(12px,1.3vw,26px);',
            'white-space:nowrap;transition:color .2s}',
            '#szsYuva button:hover{color:#fff}',
            '#szsYuva button[aria-selected="true"]{color:#0E7C66}',
            /* Soldaki başlık hem "sözlüğe dön" tuşu hem de "buradayım"
               göstergesi: sözlük açıkken beyaz hapın içinde yeşil yazı —
               sekmelerin seçili hâliyle birebir aynı dil. */
            '.szk-ust h1{cursor:pointer;user-select:none;border-radius:999px;',
            'padding:clamp(4px,.45vw,9px) clamp(10px,1.1vw,20px);',
            'transition:background .22s,color .22s}',
            '.szk-ust h1:hover{background:rgba(255,255,255,.14)}',
            '.szk-ust h1.szs-etkin{background:#fff;color:#0E7C66;',
            'box-shadow:0 2px 9px rgba(0,0,0,.18)}',
            '.szk-ust h1.szs-etkin:hover{background:#fff}',
            /* başlıktaki kitap simgesi beyaz zeminde görünmez kalmasın */
            '.szk-ust h1.szs-etkin svg path{fill:#0E7C66}',
            '@media(max-width:560px){#szsYuva button{font-size:.8rem;padding:5px 10px}',
            '.szk-ust .szk-sayac{display:none}}',
            /* oyun çerçevesi kalan yüksekliği doldurur */
            '#szsKap{flex:1 1 auto;min-height:0;display:none;background:#EEF1F5}',
            '#szsKap.acik{display:block}',
            '#szsKap iframe{display:none;width:100%;height:100%;border:0;background:#fff}',
            '#szsKap iframe.acik{display:block}',
            '@media (prefers-reduced-motion:reduce){#szsKaydirak{transition:none}}'
        ].join('');
        document.head.appendChild(st);
    }

    /* ---------------- kaydırağı seçili düğmeye oturt ----------------
       Sekme adları farklı uzunlukta; yüzdeyle hesap tutmuyor, seçili
       düğmenin gerçek yeri ve eni ölçülüyor. */
    function kaydiragiOynat() {
        if (!serit || !kaydirak) return;
        var d = serit.querySelector('button[aria-selected="true"]');
        if (!d) { kaydirak.classList.remove('acik'); return; }
        var y = d.parentNode.getBoundingClientRect(), r = d.getBoundingClientRect();
        kaydirak.style.width = r.width + 'px';
        kaydirak.style.transform = 'translateX(' + (r.left - y.left - 4) + 'px)';
        kaydirak.classList.add('acik');
    }

    /* ---------------- sekme değiştir ---------------- */
    function sec(id) {
        var s = null, i;
        for (i = 0; i < SEKME.length; i++) if (SEKME[i].id === id) s = SEKME[i];
        if (!s && id !== 'sozluk') return;
        secili = id;

        [].forEach.call(serit.querySelectorAll('button'), function (b) {
            b.setAttribute('aria-selected', b.getAttribute('data-s') === id ? 'true' : 'false');
        });
        kaydiragiOynat();

        var oyun = !!(s && s.url);
        GOVDE.forEach(function (sec2) {
            var e = document.querySelector(sec2);
            if (!e) return;
            if (oyun) { if (e.__szsEski == null) e.__szsEski = e.style.display; e.style.display = 'none'; }
            else { e.style.display = (e.__szsEski == null ? '' : e.__szsEski); }
        });
        /* Favoriler bölümü hidden özniteliğiyle yönetiliyor; sözlüğe
           dönerken onu biz açmayalım, kendi tuşu karar versin. */

        var bas = document.querySelector('.szk-ust h1');
        if (bas) {
            bas.classList.toggle('szs-etkin', !oyun);
            if (oyun) bas.removeAttribute('aria-current');
            else bas.setAttribute('aria-current', 'page');
        }

        kap.classList.toggle('acik', oyun);
        Object.keys(cerceve).forEach(function (k) { cerceve[k].classList.toggle('acik', oyun && k === id); });

        if (!oyun) vekilTemizle();
        else if (cerceve[id]) vekilKur(cerceve[id], s);

        if (oyun && !cerceve[id]) {
            var f = document.createElement('iframe');
            f.id = 'szsC-' + id;
            f.title = s.ad;
            f.setAttribute('loading', 'lazy');
            /* ?gomulu=1 : oyun sayfasındaki sozluk/gomulu.js devreye girsin.
               Gizlemeyi ve tuş bildirimini SAYFANIN KENDİSİ yapıyor; "file://"
               ile açıldığında tarayıcı çerçevenin içine erişime izin vermiyor,
               dışarıdan yapılan her şey sessizce boşa gidiyordu. */
            f.src = s.url + (s.url.indexOf('?') >= 0 ? '&' : '?') + 'gomulu=1';
            f.addEventListener('load', function () {
                iceriyiDuzelt(f, s);
                setTimeout(function () { iceriyiDuzelt(f, s); }, 600);
            });
            kap.appendChild(f);
            cerceve[id] = f;
            f.classList.add('acik');
        }

        try {
            if (oyun) history.replaceState(null, '', '#' + id);
            else history.replaceState(null, '', location.pathname + location.search);
        } catch (e) { }
    }

    /* Oyun sayfasının kendi "geri" tuşu sekme içinde anlamsız: basınca
       çerçeveyi geri alıyor, kullanıcı sözlüğe dönmüş olmuyor. Sekme
       şeridi zaten üstte duruyor, o yüzden gizleniyor. */
    function iceriyiDuzelt(f, s) {
        try {
            var d = f.contentDocument;
            if (!d || !d.head) return;
            if (d.getElementById('szsIcStil')) { vekilKur(f, s); return; }
            /* KURAL olarak yazılıyor, tek tek gizlemek yetmiyor: oyunlar
               kendi arayüzünü yeniden çizince (ör. sozluksimulasyonu.js
               "her durumda görünür" diye back-btn'i yeniden açıyor) geri
               tuşu geri geliyordu. Stil kuralı yeniden çizimden sonra da
               geçerli. */
            var st = d.createElement('style');
            st.id = 'szsIcStil';
            st.textContent =
                '#back-btn,' +
                '[onclick*="kidefGeri"],' +
                '.szk-geri,.geri-tus,' +
                '[aria-label="Geri"],[aria-label="Ana sayfaya dön"],' +
                'a[href="index.html"][title*="Ana"],' +
                'a[href="index.html"][title*="ana"],' +
                '.mobile-home-btn' +
                '{display:none !important}' +
                (s && s.gizle ? s.gizle + '{display:none !important}' : '');
            d.head.appendChild(st);
            vekilKur(f, s);
        } catch (e) { /* aynı köken değilse dokunma */ }
    }

    /* ---------------- vekil tuşlar (üst şeritte) ----------------
       Oyunun gizlenen başlık satırındaki tuşlar burada yeniden
       üretiliyor; metni ve etkin/pasif durumu asıl tuştan kopyalanıyor
       (oyun "Joker (2)" diye güncelleyince vekil de değişsin). */
    function aracKutu() {
        var ust = document.querySelector('.szk-ust');
        if (!ust) return null;
        var a = document.getElementById('szsArac');
        if (!a) {
            a = document.createElement('div');
            a.id = 'szsArac';
            var sr = document.getElementById('szsSerit');
            if (sr) ust.insertBefore(a, sr); else ust.appendChild(a);
        }
        return a;
    }
    function vekilTemizle() {
        var a = document.getElementById('szsArac');
        if (a) a.innerHTML = '';
    }
    /* Oyun sayfasından gelen tuş listesi (postMessage). Aynı köken
       şartı yok: "file://" ile açıldığında da çalışıyor. */
    var sonTuslar = {};                 /* sekme id -> [{id,yazi,pasif}] */
    var sonSeviye = {};                 /* sekme id -> [{n,yazi,etkin,gizli}] */

    function kisaAd(id, yazi) {
        var dar = (window.innerWidth || 1200) <= 700;
        if (dar && id === 'hint-btn') return '💡';
        return yazi;
    }

    function vekilCiz() {
        vekilTemizle();
        var s = null, i;
        for (i = 0; i < SEKME.length; i++) if (SEKME[i].id === secili) s = SEKME[i];
        if (!s || !s.url) return;                 /* sözlükteyken vekil yok */
        var liste = sonTuslar[secili] || [];
        var sev = (sonSeviye[secili] || []).filter(function (v) { return !v.gizli; });
        if (!liste.length && !sev.length) return;
        var kutu = aracKutu();
        if (!kutu) return;
        /* seviye şeridi, oyun tuşlarının SOLUNDA */
        if (sev.length > 1) {
            var sv = document.createElement('div');
            sv.className = 'szs-sev';
            sv.innerHTML = '<span class="szs-sev-et">Seviye</span>';
            var yuva = document.createElement('div');
            yuva.className = 'szs-sev-yuva';
            sev.forEach(function (v, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.textContent = String(i + 1);
                b.title = v.yazi || ('Seviye ' + (i + 1));
                b.setAttribute('aria-label', b.title);
                b.setAttribute('aria-pressed', v.etkin ? 'true' : 'false');
                b.disabled = !!v.pasif;
                b.onclick = function () {
                    var f = cerceve[secili];
                    if (!f || !f.contentWindow) return;
                    try { f.contentWindow.postMessage({ kidef: 'gomulu-seviye', n: v.n }, '*'); } catch (e) { }
                };
                yuva.appendChild(b);
            });
            sv.appendChild(yuva);
            kutu.appendChild(sv);
        }
        liste.forEach(function (v) {
            /* Oyun o anda kendi tuşunu gizliyorsa (giriş/ipuçları ekranı)
               vekili de çıkmasın; "Başla"dan sonra ikisi birden gelir. */
            if (v.gizli) return;
            var t = document.createElement('button');
            t.type = 'button';
            t.className = 'szs-vekil';
            t.textContent = kisaAd(v.id, v.yazi);
            t.disabled = !!v.pasif;
            t.onclick = function () {
                var f = cerceve[secili];
                if (!f || !f.contentWindow) return;
                try { f.contentWindow.postMessage({ kidef: 'gomulu-tik', id: v.id }, '*'); } catch (e) { }
            };
            kutu.appendChild(t);
        });
    }

    window.addEventListener('message', function (ev) {
        var d = ev && ev.data;
        if (!d || d.kidef !== 'gomulu') return;
        /* hangi çerçeveden geldi? */
        var k;
        for (k in cerceve) {
            if (cerceve[k].contentWindow === ev.source) {
                sonTuslar[k] = d.tuslar || [];
                sonSeviye[k] = d.seviyeler || [];
                if (k === secili) vekilCiz();
                return;
            }
        }
    });

    /* Eski yol (aynı köken) artık gerekmiyor; yalnız stil enjeksiyonu
       yedek olarak duruyor (bkz. iceriyiDuzelt). */
    function vekilKur(f, s) { vekilCiz(); }

    /* ---------------- kur ---------------- */
    function kur() {
        var ust = document.querySelector('.szk-ust');
        if (!ust || document.getElementById('szsSerit')) return;
        stilKur();

        serit = document.createElement('div');
        serit.id = 'szsSerit';
        serit.setAttribute('role', 'tablist');
        var ic = '<div id="szsYuva"><span id="szsKaydirak"></span>';
        SEKME.forEach(function (s) {
            ic += '<button type="button" role="tab" data-s="' + s.id + '" ' +
                  'aria-selected="false">' + s.ad + '</button>';
        });
        ic += '</div>';
        serit.innerHTML = ic;
        ust.appendChild(serit);              /* üst şeridin İÇİNDE, en sağda */
        kaydirak = document.getElementById('szsKaydirak');

        /* Soldaki "Sözlük" başlığı (yazı + simge) sözlüğe dönüş tuşu. */
        var bas = ust.querySelector('h1');
        if (bas) {
            bas.setAttribute('title', 'Sözlüğe dön');
            bas.setAttribute('role', 'button');
            bas.setAttribute('tabindex', '0');
            bas.onclick = function () { sec('sozluk'); };
            bas.onkeydown = function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sec('sozluk'); }
            };
            /* Başlıktaki YAZIYI ayrı bir kutuya al: dar ekranda yalnız
               simge kalsın diye gizlenebilmeli. */
            [].slice.call(bas.childNodes).forEach(function (n) {
                if (n.nodeType === 3 && n.nodeValue && n.nodeValue.trim()) {
                    var sp = document.createElement('span');
                    sp.className = 'szs-bas-yazi';
                    sp.textContent = n.nodeValue.trim();
                    bas.replaceChild(sp, n);
                }
            });
            bas.classList.add('szs-etkin');          /* açılışta sözlük etkin */
            bas.setAttribute('aria-current', 'page');
        }

        kap = document.createElement('div');
        kap.id = 'szsKap';
        var klavye = document.getElementById('szkKlavye');
        if (klavye && klavye.parentNode) klavye.parentNode.insertBefore(kap, klavye.nextSibling);
        else document.body.appendChild(kap);

        [].forEach.call(serit.querySelectorAll('button'), function (b) {
            b.onclick = function () {
                var id = b.getAttribute('data-s');
                sec(secili === id ? 'sozluk' : id);   /* seçiliye basınca sözlüğe dön */
            };
        });

        /* yazı tipi yüklenince ve pencere boyu değişince kaydırak kayabilir */
        setTimeout(kaydiragiOynat, 0);
        setTimeout(kaydiragiOynat, 400);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { kaydiragiOynat(); });
        }
        var z = 0;
        window.addEventListener('resize', function () {
            clearTimeout(z);
            z = setTimeout(function () { kaydiragiOynat(); vekilCiz(); }, 120);
        });

        /* sozluk.html#simulasyon gibi doğrudan bağlantılar */
        var h = (location.hash || '').replace('#', '');
        if (h && h !== 'sozluk') sec(h);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();

    window.KidefSozlukSekme = { sec: sec, sekmeler: SEKME, secili: function () { return secili; } };
})();
