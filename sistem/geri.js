// Ortak "Geri" ve "Anasayfa" yonlendirmesi
// GERI   (kidefGeriDon / kidefGeri): bir onceki sayfaya (history.back), yoksa index
// ANASAYFA (kidefAnasayfa)         : dogrudan index.html (yoksa kidefarapca.com)
// Ayrica: site geri tusu olan her sayfada, tusun yanina otomatik "Anasayfa" (ev) tusu eklenir.

// Sayfa index'ten YENI SEKMEDE mi acildi? (index linkleri target="_blank" rel="opener")
function _kidefYeniSekme() {
    try { return !!(window.opener && !window.opener.closed); } catch (_) { return false; }
}

// Dogrudan index'e (erisilemezse siteye) git
function _kidefGotoIndex() {
    var indexUrl;
    try { indexUrl = new URL('index.html', window.location.href).href; }
    catch (_) { indexUrl = 'index.html'; }
    if (window.location.protocol === 'file:' || typeof fetch !== 'function') {
        window.location.href = indexUrl;
        return;
    }
    fetch(indexUrl, { method: 'HEAD' })
        .then(function (r) { window.location.href = (r && r.ok) ? indexUrl : 'https://kidefarapca.com'; })
        .catch(function () { window.location.href = indexUrl; });
}

// Yeni sekmede acildiysa SEKMEYI KAPAT; tarayici izin vermezse index'e don.
function _kidefKapatVeyaIndex() {
    if (_kidefYeniSekme()) {
        try { window.close(); } catch (_) {}
        setTimeout(function () { if (!window.closed) _kidefGotoIndex(); }, 250);
        return true;
    }
    return false;
}

function kidefAnasayfa(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (_kidefKapatVeyaIndex()) return false;   // yeni sekme -> kapat
    _kidefGotoIndex();
    return false;
}

function kidefGeri(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (_kidefKapatVeyaIndex()) return false;   // yeni sekme -> kapat
    var ref = document.referrer || '';
    var host = window.location.host || '';
    var ayniSite = !!ref && ((host && ref.indexOf(host) !== -1) || ref.indexOf('index.html') !== -1);
    if (ayniSite && window.history.length > 1) {
        window.history.back();          // bir onceki sayfaya (genelde index)
        return false;
    }
    return kidefAnasayfa(e);             // gecmis yok / dis kaynak -> index
}

// Duz index.html linkleri (onclick'siz geri tuslari) da yeni sekmede sekmeyi kapatsin
(function () {
    document.addEventListener('click', function (ev) {
        if (!_kidefYeniSekme()) return;
        var a = (ev.target && ev.target.closest) ? ev.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (/(^|\/)index\.html([?#].*)?$/i.test(href)) {
            ev.preventDefault();
            _kidefKapatVeyaIndex();
        }
    }, true);
})();

window.kidefAnasayfa = kidefAnasayfa;
window.kidefGeri = kidefGeri;
window.kidefGeriDon = kidefGeri;         // geriye donuk uyum: eski cagrilar artik GERI

// --- Her sayfaya "Anasayfa" (ev) tusunu otomatik ekle ---
(function () {
    /* İkonlar dolu (filled) glif değil, ÇİZGİ (stroke) — sitenin geri
       kalanındaki simgelerle aynı dil. Renk currentColor'dan gelir,
       böylece hangi düğmeye konursa onun rengini alır.
         EV  : yuvarlatılmış çatı + kapı; klasik dolu ev glifi kaba duruyordu.
         GERİ: gövdeli sol ok; tek başına "❮" çentiği zayıf kalıyordu. */
    var HOME_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="width:1.3em;height:1.3em;vertical-align:middle;pointer-events:none;overflow:visible;" aria-hidden="true"><path d="M3.4 10.5 12 3.5l8.6 7"></path><path d="M5.4 9.4V19a1.5 1.5 0 0 0 1.5 1.5h10.2a1.5 1.5 0 0 0 1.5-1.5V9.4"></path><path d="M9.6 20.5v-5a1.3 1.3 0 0 1 1.3-1.3h2.2a1.3 1.3 0 0 1 1.3 1.3v5"></path></svg>';
    var GERI_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:1.15em;height:1.15em;vertical-align:middle;pointer-events:none;overflow:visible;" aria-hidden="true"><path d="M20 12H5.4"></path><path d="M11.8 5.6 5 12l6.8 6.4"></path></svg>';

    /* Sayfalardaki geri düğmelerinde çıplak "❮ ‹ < ⟨" karakteri varsa
       onu çizgi okla değiştir. YALNIZ metni tek bir çentik olan
       düğmelere dokunulur; yazılı düğmeler ("❮ Geri") olduğu gibi kalır. */
    var CENTIK = /^[\s]*[\u276E\u2039\u003C\u27E8\u25C0\u2190\u00AB]{1,2}[\s]*$/;
    function geriIkonuYenile() {
        var sec = '.back-btn,.back-button,.back-link,#back-btn,#back-button,#start-back-button,' +
                  '.entry-back-btn,#btn-back,.tc-geri,' +
                  '[aria-label="Geri"],[title="Geri"],' +
                  '[onclick*="kidefGeriDon"],[onclick*="kidefGeri"],' +
                  '[onclick*="goHome"],[onclick*="kelimeGeri"],[onclick*="muhGeri"]';
        var list;
        try { list = document.querySelectorAll(sec); } catch (_) { return; }
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            if (el.getAttribute('data-kidef-home')) continue;      /* ev tuşuna dokunma */
            if (el.getAttribute('data-kidef-ok')) continue;
            /* Zaten yeni ok konmuşsa geç. Eski simge SVG de olsa değişir:
               kullanıcı "geri svg'si çirkin" dedi, mesele tam olarak o.
               Yazılı düğmelere ("❮ Geri") dokunulmaz. */
            if (el.querySelector && el.querySelector('path[d="M20 12H5.4"]')) continue;
            var yazi = (el.textContent || '').trim();
            var yalnizSimge = (yazi === '') && el.querySelector && !!el.querySelector('svg');
            if (!yalnizSimge && !CENTIK.test(yazi)) continue;
            el.setAttribute('data-kidef-ok', '1');
            el.innerHTML = GERI_SVG;
            var cs = window.getComputedStyle(el);
            if ((parseFloat(cs.fontSize) || 0) < 12) el.style.fontSize = '1.25rem';
            /* GİZLİ düğmenin görünürlüğü SATIR İÇİNE DONDURULMAZ.
               isimx4'ün oyun içi geri tuşu açılışta .hidden ile gizliydi;
               buradaki satır display:none'ı style'a yazınca sınıf kalksa
               da tuş bir daha görünmüyordu — "oyun başlayınca geri tuşu
               kayboluyor"un sebebi buydu. Gizliyken display'e dokunma;
               gösterme/gizleme sınıfların işi olarak kalsın. */
            if (cs.display !== 'none')
                el.style.display = cs.display === 'inline' ? 'inline-flex' : cs.display;
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
        }
    }

    function ensureStyle() {
        if (document.getElementById('kidef-home-style')) return;
        var st = document.createElement('style');
        st.id = 'kidef-home-style';
        st.textContent = '[data-kidef-home]::before,[data-kidef-home]::after{content:none !important;background:none !important;border:0 !important;}[data-kidef-home]{text-indent:0 !important;}';
        (document.head || document.documentElement).appendChild(st);
    }

    function evYap(orig) {
        var home = orig.cloneNode(true);
        home.removeAttribute('id');
        home.removeAttribute('target');
        home.setAttribute('data-kidef-home', '1');
        home.setAttribute('title', 'Ana Sayfa');
        home.setAttribute('aria-label', 'Ana Sayfa');
        home.innerHTML = HOME_SVG;                                  // ok -> ev ikonu
        var fs = parseFloat(window.getComputedStyle(orig).fontSize) || 0;
        if (fs < 8) home.style.fontSize = '1.4rem';                 // ikon-buton (font-size:0) icin gorunur yap
        if (home.tagName === 'A') home.setAttribute('href', 'index.html');
        home.setAttribute('onclick', 'return kidefAnasayfa(event)');
        return home;
    }

    function yerlestir(orig, home) {
        orig.parentNode.insertBefore(home, orig.nextSibling);
        var cs = window.getComputedStyle(orig);
        var pos = cs.position;
        if (pos === 'absolute' || pos === 'fixed') {
            home.style.position = pos;
            if (cs.top !== 'auto') home.style.top = cs.top;
            if (cs.bottom !== 'auto') home.style.bottom = cs.bottom;
            var w = orig.offsetWidth || 44;
            if (cs.left !== 'auto') { home.style.left = 'calc(' + cs.left + ' + ' + (w + 12) + 'px)'; home.style.right = 'auto'; }
            else if (cs.right !== 'auto') { home.style.right = 'calc(' + cs.right + ' + ' + (w + 12) + 'px)'; home.style.left = 'auto'; }
            else { home.style.left = (w + 12) + 'px'; }
        } else {
            home.style.marginLeft = '8px';
        }
    }

    // Bir eleman GORSEL olarak zaten anasayfa tusu mu? (home sinifi / id / ev ikonu)
    function isHomeEl(el) {
        if (!el) return false;
        var cls = '';
        try { cls = (typeof el.className === 'string') ? el.className : (el.getAttribute('class') || ''); } catch (_) {}
        if (/home/i.test(cls)) return true;
        if (el.id === 'home-button') return true;
        if (el.querySelector && el.querySelector('path[d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"]')) return true;
        return false;
    }

    function ekle() {
        ensureStyle();
        var sel = '[onclick*="kidefGeriDon"],#home-button,#start-back-button,#back-btn';
        var list = document.querySelectorAll(sel);
        // Sayfada zaten (enjekte edilmemis) bir anasayfa tusu var mi?
        var existingHome = null;
        try { existingHome = document.querySelector('.home-btn,.home-link,.home-button,#home-button,[data-kidef-home]'); } catch (_) {}
        var hedef = [];
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            if (el.getAttribute('data-kidef-home')) continue;
            if (el.getAttribute('data-kidef-done')) continue;
            el.setAttribute('data-kidef-done', '1');
            // cift onleme: zaten anasayfa tusu olan sayfaya ikinci ev ikonu ekleme
            if (isHomeEl(el) || existingHome) continue;
            hedef.push(el);
        }
        for (var j = 0; j < hedef.length; j++) { yerlestir(hedef[j], evYap(hedef[j])); }
    }

    function hepsi() { ekle(); geriIkonuYenile(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hepsi);
    else hepsi();
    /* Bazı sayfalar geri düğmesini sonradan basıyor; bir tur daha bak. */
    setTimeout(hepsi, 700);
    window.kidefIkonYenile = hepsi;
})();
