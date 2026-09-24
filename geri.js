// Ortak "Geri" ve "Anasayfa" yonlendirmesi
// GERI   (kidefGeriDon / kidefGeri): bir onceki sayfaya (history.back), yoksa index
// ANASAYFA (kidefAnasayfa)         : dogrudan index.html (yoksa kidefarapca.com)
// Ayrica: site geri tusu olan her sayfada, tusun yanina otomatik "Anasayfa" (ev) tusu eklenir.

function kidefAnasayfa(e) {
    if (e && e.preventDefault) e.preventDefault();
    var indexUrl;
    try { indexUrl = new URL('index.html', window.location.href).href; }
    catch (_) { indexUrl = 'index.html'; }
    if (window.location.protocol === 'file:' || typeof fetch !== 'function') {
        window.location.href = indexUrl;
        return false;
    }
    fetch(indexUrl, { method: 'HEAD' })
        .then(function (r) { window.location.href = (r && r.ok) ? indexUrl : 'https://kidefarapca.com'; })
        .catch(function () { window.location.href = indexUrl; });
    return false;
}

function kidefGeri(e) {
    if (e && e.preventDefault) e.preventDefault();
    var ref = document.referrer || '';
    var host = window.location.host || '';
    var ayniSite = !!ref && ((host && ref.indexOf(host) !== -1) || ref.indexOf('index.html') !== -1);
    if (ayniSite && window.history.length > 1) {
        window.history.back();          // bir onceki sayfaya (genelde index)
        return false;
    }
    return kidefAnasayfa(e);             // gecmis yok / dis kaynak -> index
}

window.kidefAnasayfa = kidefAnasayfa;
window.kidefGeri = kidefGeri;
window.kidefGeriDon = kidefGeri;         // geriye donuk uyum: eski cagrilar artik GERI

// --- Her sayfaya "Anasayfa" (ev) tusunu otomatik ekle ---
(function () {
    var HOME_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.35em;height:1.35em;vertical-align:middle;pointer-events:none;" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>';

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

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ekle);
    else ekle();
})();
