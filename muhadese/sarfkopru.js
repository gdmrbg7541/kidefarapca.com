/* =====================================================================
   MUHÂDESE → SARF KÖPRÜSÜ  (muhâdese tarafı — GÖNDERİCİ)

   NE YAPAR
   Cümle ve diyalog pratiğinde bir kelimeye tıklanınca, ekranın sol alt
   köşesindeki KELİME TÜRÜ ŞERİDİNDE o kelimenin türü (Fiil / İsim / Zarf /
   Edat / İfade) yanar ve kökü tutar. Yanan simgeye basılınca kalıplar
   tablosu sekmesi açılır (zaten açıksa ona geçilir) ve kök, kök listesinden
   tıklanmış gibi işlenir.

   NEDEN ŞERİT, NEDEN KELİMENİN ALTINDA NOKTA DEĞİL (Geylani)
   Önce her kelimenin altına küçük bir rozet konuyordu; cümle kalabalık
   görünüyordu. Şerit hem sayfayı temiz bırakıyor hem de İSİM–FİİL–EDAT
   ayrımını görünür kılıyor: çocuk tıkladığı kelimenin hangi türden
   olduğunu doğrudan görüyor. Şeritte yalnız O DERSTE geçen türler
   gösterilir, boş yere simge durmaz.

   NEDEN KÜÇÜK VERİ
   Kök bulmayı burada canlı yapmak için kalıplar tablosunun sarf motorunu
   (664 KB) ve kök veritabanını (1,7 MB) yüklemek gerekirdi. Bunun yerine
   kelime→[kök, tür] eşleşmesi ÖNCEDEN hesaplanıp veri/kok_haritasi.js'e
   yazıldı (49 KB, gzip 10 KB). Burada yalnız o haritaya bakılır.

   SEKME AÇMA — TARAYICI KISITI
   Sayfa açılır açılmaz ikinci sekmeyi açmak engellenir (kullanıcı hareketi
   olmadan window.open çalışmaz). Bu yüzden sekme İLK SİMGE TIKLAMASINDA
   açılır. Sekmeye 'kidefSarf' adı verildiği için sonraki tıklamalar yeni
   sekme açmaz, aynı sekmeyi kullanır.

   Biçimlendirme burada enjekte edilir: modül tek dosya hâlinde kalsın,
   istenirse iki satır silinerek tamamen kaldırılabilsin diye.
   ===================================================================== */
(function () {
    'use strict';

    var SEKME_AD = 'kidefSarf';
    var KANAL_AD = 'kidef-sarf';
    var HEDEF    = 'kaliplartablosu.html';
    /* GEÇİŞ SÜRESİ: tıklama ile sekmeye geçiş arasında kısa bir perde
       gösterilir; bu sırada kök çoktan yollanmış olur ve tablo arka planda
       kurulur. Tarayıcının "geçici kullanıcı etkinliği" penceresi ~5 sn
       olduğu için bu gecikme window.open/focus'u engellemez. */
    var GECIS_MS = 700;

    var TURLER = {
        fiil:  { ad: 'Fiil',  renk: '#C0392B' },
        isim:  { ad: 'İsim',  renk: '#2980B9' },
        zarf:  { ad: 'Zarf',  renk: '#16A085' },
        edat:  { ad: 'Edat',  renk: '#D35400' },
        ifade: { ad: 'İfade', renk: '#8E44AD' }
    };
    var SIRA = ['fiil', 'isim', 'zarf', 'edat', 'ifade'];

    /* Simgeler: tür ne anlatıyorsa onu gösterir —
       fiil: hareket (koşan ok) · isim: etiket · zarf: saat (zaman/durum)
       edat: halka (kelimeleri bağlar) · ifade: konuşma balonu */
    var SVG = {
        fiil:  '<path d="M3 17l5-6 4 3 4-6 5 4" /><path d="M3 21h18" opacity=".35"/>',
        isim:  '<path d="M12.6 3.4H20a1 1 0 0 1 1 1v7.4a1.4 1.4 0 0 1-.4 1l-8.2 8.2a1.4 1.4 0 0 1-2 0l-7.6-7.6a1.4 1.4 0 0 1 0-2l8.2-8.2a1.4 1.4 0 0 1 1-.4z"/><circle cx="16.8" cy="7.2" r="1.5" fill="currentColor" stroke="none"/>',
        zarf:  '<circle cx="12" cy="12.6" r="8"/><path d="M12 8v4.6l3 2"/><path d="M9.2 2.6h5.6"/>',
        edat:  '<path d="M9.5 14.5a4 4 0 0 1 0-5.6l2.1-2.1a4 4 0 0 1 5.6 5.6l-1 1"/><path d="M14.5 9.5a4 4 0 0 1 0 5.6l-2.1 2.1a4 4 0 0 1-5.6-5.6l1-1"/>',
        ifade: '<path d="M20 4H4a1.6 1.6 0 0 0-1.6 1.6v8.8A1.6 1.6 0 0 0 4 16h3v4l4.6-4H20a1.6 1.6 0 0 0 1.6-1.6V5.6A1.6 1.6 0 0 0 20 4z"/>'
    };

    var sarfPencere = null;
    var kullanildi = false;      /* bu derste sarf sekmesi hiç kullanıldı mı */
    var kanal = null;
    if (typeof BroadcastChannel === 'function') {
        try { kanal = new BroadcastChannel(KANAL_AD); } catch (e) { kanal = null; }
    }

    /* ---- Harekesiz anahtar: harita da bu biçimde yazıldı ----------- */
    var RE_HAREKE = /[ً-ْٰ]/g, RE_TATVIL = /ـ/g, RE_ARAPCA = /[ء-ي]/;
    var RE_UC_ARAPCA = /^[ء-ي]{3}$/;

    function anahtar(ar) {
        if (!ar) return '';
        return String(ar).replace(RE_HAREKE, '').replace(RE_TATVIL, '')
                         .replace(/[^ء-ي]/g, '');
    }

    /* Dönen değer: {kok, tur} ya da null */
    function kokBul(arapca) {
        var H = window.KIDEF_KOK_HARITA;
        if (!H || !arapca) return null;
        /* Kelime birden çok parçadan oluşabilir (مِنْ فَضْلِكَ). Önce bütünü,
           sonra parçaları dener. GERÇEK üç harfli kök, sözlük kategorisi
           anahtarına ("Edat: Men") tercih edilir: "min fadlik"te öğretmenin
           istediği فضل'dir, من değil. */
        var adaylar = [];
        var tam = anahtar(arapca);
        if (tam && H[tam]) adaylar.push(H[tam]);
        var parcalar = String(arapca).split(/\s+/);
        for (var i = 0; i < parcalar.length; i++) {
            var a = anahtar(parcalar[i]);
            if (a && H[a]) adaylar.push(H[a]);
        }
        if (!adaylar.length) return null;
        var secilen = adaylar[0];
        for (var j = 0; j < adaylar.length; j++) {
            if (RE_UC_ARAPCA.test(adaylar[j][0])) { secilen = adaylar[j]; break; }
        }
        return { kok: secilen[0], tur: TURLER[secilen[1]] ? secilen[1] : 'isim' };
    }

    /* ---- Sekmeyi aç / öne getir ve kökü gönder --------------------- */
    var onayBekle = null, beklenenKok = null;

    function adresi(kok) { return HEDEF + '?kok=' + encodeURIComponent(kok); }

    function gonder(kok) {
        try {
            sarfPencere.postMessage({ kidef: 'sarf-kok', kok: kok }, location.origin);
        } catch (e) { sarfPencere = null; return false; }
        if (kanal) { try { kanal.postMessage({ kidef: 'sarf-kok', kok: kok }); } catch (e) {} }
        /* EMNİYET KEMERİ: sekme "uyguladım" demezse mesaj yolu bir sebeple
           çalışmamış demektir; sekme adres yoluyla yeniden yüklenir. Böylece
           "sekmeye geçti ama kök değişmedi" durumu oluşmaz. */
        beklenenKok = kok;
        if (onayBekle) clearTimeout(onayBekle);
        onayBekle = setTimeout(function () {
            onayBekle = null;
            if (beklenenKok !== kok) return;
            try {
                if (sarfPencere && !sarfPencere.closed) sarfPencere.location.href = adresi(kok);
                else { var w2 = window.open(adresi(kok), SEKME_AD); if (w2) { sarfPencere = w2; w2.focus(); } }
            } catch (e2) { window.open(adresi(kok), SEKME_AD); }
        }, 1400);
        return true;
    }

    function gecisBitir(kok) {
        perdeKapat();
        if (sarfPencere && !sarfPencere.closed) {
            try { sarfPencere.focus(); return; } catch (e) { sarfPencere = null; }
        }
        var w = null;
        try { w = window.open(adresi(kok), SEKME_AD); } catch (e) { w = null; }
        if (w) { sarfPencere = w; try { w.focus(); } catch (e) {} }
        else { uyar('Tarayıcı yeni sekmeyi engelledi. Adres çubuğundaki engelleme simgesinden izin verin.'); }
    }

    function ac(kok) {
        if (!kok) return;
        kullanildi = true;

        /* Kök HEMEN yollanır: perde inerken tablo arka planda kuruluyor. */
        if (sarfPencere && !sarfPencere.closed) gonder(kok);
        else if (kanal) { try { kanal.postMessage({ kidef: 'sarf-kok', kok: kok }); } catch (e) {} }

        var kisa = false;
        try { kisa = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
        if (kisa) { gecisBitir(kok); return; }

        perdeAc(kok, function () { gecisBitir(kok); });
        setTimeout(function () { gecisBitir(kok); }, GECIS_MS);
    }

    /* ---- Geçiş perdesi -------------------------------------------- */
    var perde = null, perdeZaman = null;

    function perdeAc(kok, atla) {
        perdeKapat();
        perde = document.createElement('div');
        perde.className = 'kidef-gecis';
        perde.setAttribute('role', 'status');
        var buyuk = RE_UC_ARAPCA.test(kok);
        perde.innerHTML =
            '<div class="kidef-gecis-ic">' +
            '<div class="kidef-gecis-kok' + (buyuk ? ' ar' : '') + '"></div>' +
            '<div class="kidef-gecis-yazi">Sarf tablosu hazırlanıyor…</div>' +
            '<div class="kidef-gecis-cubuk"><i></i></div></div>';
        perde.querySelector('.kidef-gecis-kok').textContent = kok;
        perde.addEventListener('click', function () { if (atla) atla(); });
        document.body.appendChild(perde);
        requestAnimationFrame(function () { if (perde) perde.classList.add('acik'); });
        if (perdeZaman) clearTimeout(perdeZaman);
        perdeZaman = setTimeout(perdeKapat, 2600);
    }

    function perdeKapat() {
        if (perdeZaman) { clearTimeout(perdeZaman); perdeZaman = null; }
        if (!perde) return;
        var p = perde; perde = null;
        p.classList.remove('acik');
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 260);
    }

    function uyar(metin) {
        var d = document.getElementById('kidef-sarf-uyari');
        if (d) d.remove();
        d = document.createElement('div');
        d.id = 'kidef-sarf-uyari';
        d.textContent = metin;
        d.className = 'kidef-sarf-uyari';
        document.body.appendChild(d);
        setTimeout(function () { if (d.parentNode) d.remove(); }, 5200);
    }

    /* ---- Kelime türü şeridi ---------------------------------------- */
    var serit = null, dugmeler = {}, etiket = null, seciliKok = null;

    /* Bu derste hangi türler geçiyor? Yalnız onlar gösterilir. */
    function derstekiTurler() {
        var bulunan = {}, d = window.data;
        if (!d) return SIRA.slice(0, 4);
        var bak = function (kelimeler) {
            if (!kelimeler) return;
            for (var i = 0; i < kelimeler.length; i++) {
                var w = kelimeler[i];
                if (!w || !w.ar) continue;
                var s = kokBul(w.ar);
                if (s) bulunan[s.tur] = 1;
            }
        };
        (d.sentence || []).forEach(function (c) { bak(c.words); });
        (d.dialog || []).forEach(function (c) { bak(c.p1); bak(c.p2); });
        var liste = SIRA.filter(function (t) { return bulunan[t]; });
        return liste.length ? liste : SIRA.slice(0, 4);
    }

    function seritKur() {
        if (serit || !document.body) return;
        var turler = derstekiTurler();
        serit = document.createElement('div');
        serit.className = 'kidef-tur-serit';
        serit.setAttribute('role', 'group');
        serit.setAttribute('aria-label', 'Kelime türleri — tıklanan kelimenin türü yanar');
        var h = '';
        turler.forEach(function (t) {
            h += '<button type="button" class="kidef-tur" data-tur="' + t + '" aria-disabled="true" tabindex="-1"' +
                 ' style="--tr:' + TURLER[t].renk + '" title="' + TURLER[t].ad + '">' +
                 '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
                 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVG[t] + '</svg>' +
                 '<span>' + TURLER[t].ad + '</span></button>';
        });
        h += '<span class="kidef-tur-kok" aria-live="polite"></span>';
        serit.innerHTML = h;
        document.body.appendChild(serit);
        turler.forEach(function (t) {
            dugmeler[t] = serit.querySelector('.kidef-tur[data-tur="' + t + '"]');
            dugmeler[t].addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (!seciliKok || dugmeler[t].getAttribute('aria-disabled') === 'true') return;
                ac(seciliKok);
            });
        });
        etiket = serit.querySelector('.kidef-tur-kok');
        altBosluk();
    }

    /* Şerit, Geri/İleri çubuğunun üstünde dursun: çubuğun yüksekliği
       punto ve ekrana göre değişiyor, ölçüp değişkene yazıyoruz. */
    function altBosluk() {
        if (!serit) return;
        /* Sayfada birden çok .controls olabiliyor (liste ve oynatıcı);
           GÖRÜNEN olanı ölçeriz, yoksa 0. */
        var y = 0, hepsi = document.querySelectorAll('.controls');
        for (var i = 0; i < hepsi.length; i++) {
            var c = hepsi[i];
            if (c.classList.contains('controls-hidden') || c.classList.contains('force-hide')) continue;
            if (c.offsetHeight > y) y = c.offsetHeight;
        }
        serit.style.setProperty('--alt', (y + 12) + 'px');
    }
    window.addEventListener('resize', altBosluk);
    /* Yerleşim oturana kadar birkaç kez ölçülür: DOMContentLoaded anında
       çubuğun yüksekliği daha 0 olabiliyor. */
    window.addEventListener('load', altBosluk);
    [120, 500, 1200].forEach(function (ms) { setTimeout(altBosluk, ms); });

    function turSec(bilgi) {
        seritKur();
        if (!serit) return;
        altBosluk();          /* mod değişince çubuk gizlenip açılabiliyor */
        SIRA.forEach(function (t) {
            if (!dugmeler[t]) return;
            dugmeler[t].classList.remove('yanik');
            dugmeler[t].setAttribute('aria-disabled', 'true');
            dugmeler[t].setAttribute('tabindex', '-1');
            dugmeler[t].title = TURLER[t].ad;
        });
        if (!bilgi || !dugmeler[bilgi.tur]) {
            seciliKok = null;
            if (etiket) { etiket.textContent = ''; etiket.classList.remove('acik'); }
            return;
        }
        seciliKok = bilgi.kok;
        var d = dugmeler[bilgi.tur];
        d.classList.add('yanik');
        d.setAttribute('aria-disabled', 'false');
        d.setAttribute('tabindex', '0');
        d.title = 'Sarf tablosunda aç: ' + bilgi.kok;
        if (etiket) {
            etiket.textContent = bilgi.kok;
            etiket.className = 'kidef-tur-kok acik' + (RE_UC_ARAPCA.test(bilgi.kok) ? ' ar' : '');
            etiket.style.color = TURLER[bilgi.tur].renk;
        }
        /* kısa bir vurgu darbesi: gözden kaçmasın */
        d.classList.remove('carp'); void d.offsetWidth; d.classList.add('carp');
    }

    /* renderContent her kelime için çağırır: kök/tür kelimenin üstünde saklanır */
    function kelimeIsaretle(el, arapca) {
        if (!el || !arapca || !RE_ARAPCA.test(String(arapca))) return null;
        var s = kokBul(arapca);
        if (!s) { el.removeAttribute('data-kidef-kok'); return null; }
        el.setAttribute('data-kidef-kok', s.kok);
        el.setAttribute('data-kidef-tur', s.tur);
        return s;
    }

    /* Kelimeye tıklanınca türü yak. Yakalama evresinde dinlenir ki
       alıştırmanın kendi tıklaması engellenmeden önce okunabilsin. */
    document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest('.kidef-tur-serit')) return;
        var w = t.closest('.word');
        if (!w) return;
        var kok = w.getAttribute('data-kidef-kok');
        turSec(kok ? { kok: kok, tur: w.getAttribute('data-kidef-tur') || 'isim' } : null);
    }, true);

    /* ---- Biçimlendirme -------------------------------------------- */
    function stilKur() {
        if (document.getElementById('kidef-sarf-stil')) return;
        var s = document.createElement('style');
        s.id = 'kidef-sarf-stil';
        s.textContent =
            /* tür şeridi */
            '.kidef-tur-serit{position:fixed;left:12px;bottom:var(--alt,90px);z-index:900;' +
                'display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:14px;' +
                'background:rgba(255,255,255,.82);backdrop-filter:blur(4px);' +
                '-webkit-backdrop-filter:blur(4px);box-shadow:0 4px 14px rgba(20,40,60,.10);' +
                'border:1px solid rgba(20,40,60,.07);pointer-events:auto}' +
            '.kidef-tur{width:46px;padding:4px 2px;border:0;border-radius:10px;background:transparent;' +
                'display:flex;flex-direction:column;align-items:center;gap:2px;cursor:default;' +
                'color:#9AA7B2;transition:color .18s,background .18s,transform .18s;' +
                '-webkit-tap-highlight-color:transparent}' +
            '.kidef-tur svg{width:22px;height:22px;opacity:.55;transition:opacity .18s}' +
            '.kidef-tur span{font:600 10px/1.1 Marhey,system-ui,sans-serif;letter-spacing:.2px}' +
            '.kidef-tur.yanik{color:var(--tr);background:color-mix(in srgb,var(--tr) 12%,transparent);' +
                'cursor:pointer}' +
            '.kidef-tur.yanik svg{opacity:1}' +
            '.kidef-tur.yanik:hover{transform:translateY(-2px);' +
                'background:color-mix(in srgb,var(--tr) 20%,transparent)}' +
            '.kidef-tur.carp{animation:kidef-carp .42s ease}' +
            '@keyframes kidef-carp{0%{transform:scale(1)}45%{transform:scale(1.16)}100%{transform:scale(1)}}' +
            '.kidef-tur-kok{max-width:0;overflow:hidden;white-space:nowrap;opacity:0;' +
                'font:600 15px/1 Marhey,system-ui,sans-serif;' +
                'transition:max-width .28s,opacity .2s,padding .28s;padding:0}' +
            '.kidef-tur-kok.acik{max-width:190px;opacity:1;padding:0 8px 0 4px}' +
            '.kidef-tur-kok.ar{font-family:arakom,serif;font-size:24px;direction:rtl}' +
            '@media (max-width:640px){.kidef-tur-serit{left:8px;gap:3px;padding:5px 6px;border-radius:12px}' +
                '.kidef-tur{width:38px;padding:3px 1px}.kidef-tur svg{width:19px;height:19px}' +
                '.kidef-tur span{font-size:9px}.kidef-tur-kok.acik{max-width:120px}' +
                '.kidef-tur-kok.ar{font-size:20px}}' +
            '@media (max-height:430px){.kidef-tur-serit{bottom:8px}}' +
            /* geçiş perdesi */
            '.kidef-gecis{position:fixed;inset:0;z-index:2147482000;display:flex;' +
                'align-items:center;justify-content:center;background:rgba(247,250,252,.94);' +
                'backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);' +
                'opacity:0;transition:opacity .22s;cursor:pointer}' +
            '.kidef-gecis.acik{opacity:1}' +
            '.kidef-gecis-ic{text-align:center;transform:scale(.94);transition:transform .28s cubic-bezier(.2,.9,.3,1.2)}' +
            '.kidef-gecis.acik .kidef-gecis-ic{transform:scale(1)}' +
            '.kidef-gecis-kok{font:600 26px/1.25 Marhey,system-ui,sans-serif;color:#0E6655;margin-bottom:10px}' +
            '.kidef-gecis-kok.ar{font-family:arakom,serif;font-size:64px;letter-spacing:2px;direction:rtl}' +
            '.kidef-gecis-yazi{font:500 15px/1.3 Marhey,system-ui,sans-serif;color:#6b7c8a;margin-bottom:14px}' +
            '.kidef-gecis-cubuk{width:150px;height:4px;margin:0 auto;border-radius:99px;' +
                'background:rgba(14,102,85,.16);overflow:hidden}' +
            '.kidef-gecis-cubuk>i{display:block;height:100%;width:0;border-radius:99px;background:#0E6655}' +
            '.kidef-gecis.acik .kidef-gecis-cubuk>i{width:100%;transition:width .68s linear}' +
            '.kidef-sarf-uyari{position:fixed;z-index:2147483000;left:50%;bottom:22px;' +
                'transform:translateX(-50%);max-width:min(90vw,520px);background:#8E2F2F;color:#fff;' +
                'padding:10px 18px;border-radius:12px;font:600 15px/1.35 system-ui,sans-serif;' +
                'text-align:center;box-shadow:0 8px 22px rgba(0,0,0,.28)}';
        document.head.appendChild(s);
    }

    function baslat() { stilKur(); seritKur(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat);
    else baslat();

    /* Sekmenin onayı: hem referansı doğrular hem emniyet kemerini boşa alır. */
    function onayAl(veri, kaynak) {
        if (!veri || veri.kidef !== 'sarf-hazir') return;
        if (kaynak) sarfPencere = kaynak;
        if (veri.tamam && veri.kok === beklenenKok) {
            beklenenKok = null;
            if (onayBekle) { clearTimeout(onayBekle); onayBekle = null; }
        }
    }
    window.addEventListener('message', function (e) {
        if (e && e.origin && e.origin !== location.origin) return;
        onayAl(e && e.data, e && e.source);
    });
    if (kanal) kanal.onmessage = function (e) { onayAl(e && e.data, null); };

    /* ---- Muhâdeseye dönünce tabloyu sıfırla ------------------------
       Öğretmen kelimelere bakıp geri döndüğünde sarf sekmesi kirli kalmasın:
       tablo sıfırlanıp bir sonraki kelime için hazır beklesin (Geylani).
       Ölçüt bu sekmenin yeniden GÖRÜNÜR olması; sekme bu derste hiç
       kullanılmadıysa bir şey gönderilmez. */
    var sonDonus = 0;
    function geriDonuldu() {
        perdeKapat();
        if (!kullanildi) return;
        /* visibilitychange ve focus çoğu tarayıcıda peş peşe gelir; bir kez yeter. */
        var simdi = (window.performance && performance.now) ? performance.now() : 0;
        if (simdi - sonDonus < 600) return;
        sonDonus = simdi;
        var m = { kidef: 'sarf-sifirla' };
        if (sarfPencere && !sarfPencere.closed) {
            try { sarfPencere.postMessage(m, location.origin); } catch (e) { sarfPencere = null; }
        }
        if (kanal) { try { kanal.postMessage(m); } catch (e) {} }
    }
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') geriDonuldu();
    });
    /* Bazı düzeneklerde (ayrı pencere, bazı tarayıcı ayarları) sekme geri
       gelirken visibilitychange yerine yalnız focus gelir. İkisi de dinlenir. */
    window.addEventListener('focus', geriDonuldu);
    window.addEventListener('pageshow', function () {
        if (document.visibilityState === 'visible') geriDonuldu();
    });

    window.KidefSarf = {
        kokBul: kokBul, kelimeIsaretle: kelimeIsaretle,
        turSec: turSec, ac: ac, altBosluk: altBosluk
    };
})();
