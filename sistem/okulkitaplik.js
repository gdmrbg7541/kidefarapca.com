/* =====================================================================
   KİDEF · OKUL KİTAPLIĞI                        (sistem/okulkitaplik.js)
   ---------------------------------------------------------------------
   Öğretmen (26.10.2026): "imam hatip kategorisini kaldırıyoruz, okul
   svg si ile birleştiriyoruz, öğretmen sınıf eklemişse yukarda duran
   hazır sınıf rakamlarına tıklayınca o sınıfların materyalleri açılsın,
   seviye eklemek istediğinde ise + kısmındaki sınıflara tıklarsa sonra
   eklensin" · "sınıf materyalleri de kapı açıldıktan sonra o sınıfın
   içinde bi kitaplıktan bakılıyormuş gibi olsun ... her sınıfın
   materyali yine aynı şekilde nerede kalınmışsa aynı şekilde takip
   edilecek, tek fark açılışların farklı olması".

   NE YAPAR
   Kurumlar & Sınıflar penceresinde (okul) her binanın en üst satırında
   öğretmenin KURULU 5–10. sınıf seviyelerinin rakamları durur
   (hesap/listelerim.js → binaYap). Rakama dokununca o sınıfın KİTAPLIĞI
   satırın altında açılır: ders kitabı, Kidef Arapça, sınıf defteri,
   belgeler (planlar, sınavlar, çalışma kâğıtları…) ve etkinlik
   kartları. Aynı satırdaki «Öğretmen Dökümanları» tuşu okul geneli
   belgeleri (öğretmen dosyası, zümre, mevzuat) açar. Yeni seviye
   yalnız «+» ile eklenir (seviye ekleme penceresi).

   AYNI KAYNAK, AYNI KİTAPLIK
   İçerik kopyalanmaz: index.html'deki ihdocKur / mhKur (window.ihIcKur)
   çizer — sınıf panelindeki Materyaller sekmesi (sistem/sinifmateryal.js)
   ve öğrencinin Sınıfım bölümü (sistem/sinifim.js) ile aynı. Biçim
   sistem/materyalstil.css'teki #llMateryalKap kuralları: burada çalışma
   anında #llOkulKitaplik için kopyalanır (sinifim.js'in yaptığı gibi) ve
   üstüne sistem/kitaplik.css'teki kitaplık görünümü gelir. «Nerde
   kalmıştık» takibi (sistem/materyalrapor.js) sınıfın içinde yapılır;
   okuldaki kitaplık seviyenin ortak rafıdır, takip tutmaz.

   ÖĞRETMEN DÖKÜMANLARI
   Belge ızgarası (#dokAccordion) index.html'de bir kez kuruluyor; burada
   yeniden kurulamaz (kurucu işlevler sayfanın içinde). Düğüm olduğu gibi
   rafa TAŞINIR, raf kapanınca ya da pencere yeniden çizilmeden önce
   (listelerim.js → sakla) yerine geri konur.

   SINIF EKLEMEDEN MATERYAL YOK (27.10.2026) — öğretmen: "sınıf eklemeden
   materyaller kısmı açılmasın" · "öğretmenlere". Sınıfı olmayan seviyenin
   (soluk rakam) rafında öğretmene yalnız plaka ve «+ N. sınıf ekle» çıkar;
   belgeler ve kartlar sınıf eklenince açılır. MATERYAL YOK — YÖNETİCİ DE (27.10.2026):
   "bende 5 6 var ama 7 ye tıklayınca tüm materyaller çıkıyor" — yönetici hesabı da aynı.

   PENCERE YENİDEN ÇİZİLİNCE (sınıf eklendi, ad değişti…) açık raf
   hatırlanır ve yeniden açılır (listelerim.js → yenile). kelimeler.html
   «?ihsinif=N» ile dönerse o sınıfın rafı açılır.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefOkulKitaplik) return;

    var ID = 'llOkulKitaplik';
    var RENK = { 5: '#16A085', 6: '#F39C12', 7: '#2563EB', 8: '#7C3AED', 9: '#EE5253', 10: '#0E9E86' };
    var acik = null;          /* { kurum, n }  n: 5–10 ya da 'dok' */
    var dokYuva = null;       /* #dokAccordion'un asıl yeri */

    function kac(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function rgba(hex, a) {
        var h = String(hex || '#16A085').replace('#', '');
        return 'rgba(' + parseInt(h.substr(0, 2), 16) + ',' + parseInt(h.substr(2, 2), 16) + ',' +
            parseInt(h.substr(4, 2), 16) + ',' + a + ')';
    }
    function renkler(n) {
        var c = RENK[n] || '#16A085';
        return '--ihc:' + c + ';--ihcy:' + rgba(c, '.10') + ';--ihcb:' + rgba(c, '.34') + ';--ihck:' + rgba(c, '.26');
    }

    /* ------------------------------------------------ BİÇİM KOPYASI */
    function kuralCevir(r) {
        if (!r) return '';
        if (r.type === 1) {
            if (String(r.selectorText || '').indexOf('#llMateryalKap') < 0) return '';
            return r.cssText.split('#llMateryalKap').join('#' + ID);
        }
        if ((r.type === 4 || r.type === 12) && r.cssRules) {
            var ic = [].map.call(r.cssRules, kuralCevir).filter(Boolean).join('\n');
            if (!ic) return '';
            var kosul = r.conditionText || (r.media && r.media.mediaText) || '';
            return (r.type === 4 ? '@media ' : '@supports ') + kosul + '{\n' + ic + '\n}';
        }
        return '';
    }
    function stilKopyala() {
        if (document.getElementById('okKopyaStil')) return true;
        var parca = [], bulundu = false;
        [].forEach.call(document.styleSheets || [], function (sh) {
            if (String(sh.href || '').indexOf('materyalstil.css') < 0) return;
            var k = null;
            try { k = sh.cssRules; } catch (e) { return; }
            if (!k || !k.length) return;
            bulundu = true;
            [].forEach.call(k, function (r) { var t = kuralCevir(r); if (t) parca.push(t); });
        });
        if (!bulundu) return false;
        var s = document.createElement('style');
        s.id = 'okKopyaStil';
        s.textContent = parca.join('\n');
        (document.head || document.documentElement).appendChild(s);
        return true;
    }

    /* ------------------------------------------------------- SATIR */
    /* Binanın üst satırı (.okul-kat-ekle[data-kurum]). kurum verilmişse o
       bina; verilmemişse rakamı n olan ilk bina (dok için ilk bina). */
    function satir(kurum, n) {
        var p = document.getElementById('llOkulPopup');
        if (!p) return null;
        var rows = p.querySelectorAll('.okul-kat-ekle[data-kurum]');
        if (!rows.length) return null;
        var i;
        if (kurum != null) {
            for (i = 0; i < rows.length; i++) if (rows[i].getAttribute('data-kurum') === String(kurum)) return rows[i];
            return null;
        }
        if (n === 'dok') return rows[0];
        for (i = 0; i < rows.length; i++) if (rows[i].querySelector('.okul-raf-tus[data-raf="' + n + '"]')) return rows[i];
        return null;
    }
    function tusu(row, n) {
        return row.querySelector(n === 'dok' ? '.okul-dok-tus' : '.okul-raf-tus[data-raf="' + n + '"]');
    }

    /* ------------------------------------------------------- RAF */
    function plaka(bas, alt, ek) {
        return '<div class="kd-plaka"><span class="kd-plaka-bas">' + bas + '</span>' +
            '<button type="button" class="kd-plaka-kapat" title="Kitaplığı kapat" aria-label="Kitaplığı kapat"' +
            ' onclick="KidefOkulKitaplik.kapat()">&times;</button>' +
            '<span class="kd-plaka-alt">' + alt + '</span>' + (ek || '') + '</div>';
    }
    /* BÜTÜN RAKAMLAR (26.10.2026): sınıfı olmayan seviyenin (soluk rakam) rafında
       «+ N. sınıf ekle», sınıfı olanın rafında «+ Şube ekle». İkisi de
       listelerim.js → llHizliSeviye: seviye yoksa kurulur, varsa ona eklenir; şube
       harfleri (5A, 5B…) o seviyenin satırında açık gelir. */
    function ekleTusu(row, n) {
        var t = tusu(row, n), bos = !!(t && t.classList.contains('bos'));
        var k = String(row.getAttribute('data-kurum') || 'GENEL').replace(/['"\\<>&]/g, '');
        return '<button type="button" class="kd-plaka-ekle' + (bos ? '' : ' ikincil') + '"' +
            ' onclick="KidefOkulKitaplik.sinifEkle(\'' + k + '\',' + n + ')">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor"' +
            ' stroke-width="2.8" stroke-linecap="round"/></svg>' +
            '<span>' + (bos ? n + '. sınıf ekle' : 'Şube ekle') + '</span></button>';
    }
    function bosMu(row, n) { var t = tusu(row, n); return !!(t && t.classList.contains('bos')); }
    function kur(row, n) {
        var kap = document.createElement('div');
        kap.id = ID;
        kap.className = 'okul-raf kd-kitaplik';
        kap.setAttribute('data-raf', String(n));
        if (n === 'dok') {
            kap.innerHTML = plaka('Öğretmen Dökümanları',
                'Öğretmen dosyası, zümre tutanakları ve mevzuat — okul geneli belgeler.') +
                '<div class="ih-genel-dok"><div class="ihsec-item ihsec-bassiz"><div class="ihsec-panel">' +
                '<div class="ihsec-panel-in"></div></div></div></div>';
            row.appendChild(kap);
            var d = document.getElementById('dokAccordion');
            var ic = kap.querySelector('.ihsec-panel-in');
            if (d) {
                if (!dokYuva) dokYuva = { parent: d.parentNode, next: d.nextSibling };
                ic.appendChild(d);
            } else {
                ic.innerHTML = '<div class="kd-yok">Öğretmen dökümanları şu an yüklenemedi.</div>';
            }
            return kap;
        }
        kap.style.cssText = renkler(n);
        /* SINIF EKLEMEDEN MATERYAL YOK (27.10.2026): sınıfı olmayan seviyede herkese
           (yönetici dahil) yalnız plaka ve «+ N. sınıf ekle»; içerik kurulmaz. */
        if (bosMu(row, n)) {
            kap.classList.add('kd-raf-kilit');
            kap.innerHTML = plaka(n + '. Sınıf Kitaplığı',
                'Bu seviyede henüz sınıfın yok. Materyaller sınıf ekleyince açılır; kapıyı açınca ' +
                'kitaplık sınıfın içinde hazır olur, «Nerde kalmıştık?» orada tutulur.', ekleTusu(row, n));
            row.appendChild(kap);
            return kap;
        }
        kap.innerHTML = plaka(n + '. Sınıf Kitaplığı',
            'Ders kitabı, belgeler ve etkinlik kartları — bu seviyedeki her sınıfın ortak rafı. ' +
              'Kapıyı açınca aynı kitaplık sınıfın içinde; «Nerde kalmıştık?» orada tutulur.', ekleTusu(row, n)) +
            '<div class="ihsec-item ihsec-bassiz"><div class="ihsec-panel"><div class="ihsec-panel-in">' +
            '<div class="ihdoc-acc" data-sinif="' + n + '"></div>' +
            '<div class="ihsec-ayirac" aria-hidden="true"></div>' +
            '<div class="ih-kartlar" data-sinif="' + n + '"></div>' +
            '</div></div></div>';
        row.appendChild(kap);
        try { if (window.ihIcKur) window.ihIcKur(kap); }
        catch (e) { try { console.warn('okul kitaplığı kurulamadı:', e && e.message); } catch (x) { } }
        return kap;
    }
    function dokGeriKoy(kap) {
        var d = kap ? kap.querySelector('#dokAccordion') : null;
        if (!d || !dokYuva || !dokYuva.parent) return;
        var next = (dokYuva.next && dokYuva.next.parentNode === dokYuva.parent) ? dokYuva.next : null;
        try { dokYuva.parent.insertBefore(d, next); } catch (e) { }
    }
    /* sakla=true: raf kaldırılır ama hangi rafın açık olduğu unutulmaz
       (pencere yeniden çizilmeden önce). */
    function kapat(sakla) {
        var kap = document.getElementById(ID);
        if (kap) { dokGeriKoy(kap); if (kap.parentNode) kap.parentNode.removeChild(kap); }
        var p = document.getElementById('llOkulPopup');
        if (p) [].forEach.call(p.querySelectorAll('.okul-raf-tus.acik, .okul-dok-tus.acik'), function (b) {
            b.classList.remove('acik'); b.setAttribute('aria-expanded', 'false');
        });
        if (!sakla) acik = null;
    }
    function acIc(row, n, sessiz) {
        kapat(true);
        acik = { kurum: row.getAttribute('data-kurum'), n: n };
        stilKopyala();
        var kap = kur(row, n);
        var t = tusu(row, n);
        if (t) { t.classList.add('acik'); t.setAttribute('aria-expanded', 'true'); }
        if (!sessiz) setTimeout(function () {
            try { kap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { }
        }, 60);
        return kap;
    }
    /* Rakama / tuşa basıldı: açıksa kapanır, değilse açılır. Pencere yoksa
       açılır; raf yeniden çizimde (yenile) kurulur. */
    function ac(kurum, n) {
        n = (n === 'dok') ? 'dok' : (parseInt(n, 10) || 0);
        if (!n) return;
        var p = document.getElementById('llOkulPopup');
        if (!p) {
            acik = { kurum: kurum, n: n };
            try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { }
            return;
        }
        var row = satir(kurum, n);
        if (!row) return;
        if (acik && String(acik.n) === String(n) && acik.kurum === row.getAttribute('data-kurum') && document.getElementById(ID)) {
            kapat(false); return;
        }
        acIc(row, n, false);
    }
    /* Pencere yeniden çizildi (listelerim.js → llOkulPopupAc sonu). */
    function yenile() {
        if (!acik) return;
        if (document.getElementById(ID)) return;
        var row = satir(acik.kurum, acik.n);
        if (!row || !tusu(row, acik.n)) row = satir(null, acik.n);     /* seviye başka kuruma taşındı / silindi */
        if (!row || !tusu(row, acik.n)) {
            /* 27.10.2026: pencere veri gelmeden boş çizildiyse istek beklesin (yoksa
               kelimeler.html'den «?ihsinif=N» dönüşünde raf bazen açılmıyordu) */
            var pp = document.getElementById('llOkulPopup');
            if (!pp || !pp.querySelector('.okul-raf-tus')) return;
            acik = null; return;
        }
        acIc(row, acik.n, true);
    }
    /* Pencere kapanmadan önce (listelerim.js → llOkulPopupKapat). */
    function sakla() { kapat(true); }
    /* Rafın plakasındaki «+ sınıf ekle / + şube ekle»: raf kapanır, seviye kurulur
       (ya da var olana eklenir), pencere yeniden çizilir; şube harfleri açık satır
       ekrana getirilip kısa bir süre vurgulanır. */
    function sinifEkle(kurum, n) {
        n = parseInt(n, 10) || 0;
        if (!n) return;
        kapat(false);
        try { window._llHizliLid = null; } catch (e) { }
        try { if (typeof llHizliSeviye === 'function') llHizliSeviye(kurum, n); else return; } catch (e) { return; }
        var dene = 0;
        (function bak() {
            var lid = window._llHizliLid;
            var r = lid ? document.querySelector('#llOkulPopup .okul-kat[data-lid="' + lid + '"]') : null;
            if (r && r.querySelector('.okul-sube-sira')) {
                try { r.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
                r.classList.add('kd-vurgu');
                setTimeout(function () { r.classList.remove('kd-vurgu'); }, 1800);
                return;
            }
            if (++dene < 25) setTimeout(bak, 100);
        })();
    }

    /* kelimeler.html'den dönüş: index.html?ihsinif=N → o sınıfın rafı */
    (function () {
        var m = /[?&]ihsinif=(\d+)/.exec(location.search || '');
        if (!m) return;
        var n = parseInt(m[1], 10);
        if (n >= 5 && n <= 10) acik = { kurum: null, n: n };
    })();

    window.llOkulKitaplikAc = function (kurum, n) { try { ac(kurum, n); } catch (e) { } };
    window.KidefOkulKitaplik = {
        ac: ac, kapat: function () { kapat(false); }, yenile: yenile, sakla: sakla, sinifEkle: sinifEkle,
        acik: function () { return acik; }
    };
})();
