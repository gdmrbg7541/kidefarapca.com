/* ==========================================================================
   KELİME ÇIKARMA — "listeden çıkar, havuzda beklet, geri ekle"
   sarf/kelimecikar.js                                           15.10.2026
   --------------------------------------------------------------------------
   Öğretmen: "liste indirme özelliği olduğu için öğretmen bir kelimeyi
   çıkarmak isterse kelimenin yanına bir çarpı ekle; çarpıya basılan
   kelimeler listeden çıksın ama aşağıda başka bir havuza eklensin,
   istenirse geri listeye eklenebilsin. Tamamen silinmediğini ve tekrar
   eklenebileceğini animasyonla hissetsin."

   NASIL ÇALIŞIR
     · Kelime Dağarcığı listesi (kelimeler.html → .kdf-defter) çizilince
       her satırın sonuna küçük bir çarpı düğmesi eklenir.
     · Çarpıya basılınca satır AŞAĞI DOĞRU süzülerek küçülür ve hemen
       altındaki "Çıkarılanlar" havuzunda bir rozet olarak belirir.
       Silinmez: rozete dokunulunca satır eski yerine geri döner ve
       bir an sarıya çalarak kendini belli eder.
     · Liste numaraları her değişiklikte yeniden verilir (1, 2, 3…).
     · İNDİRME: PDF / Word / Excel / Yazdır çıktıları çıkarılan kelimeleri
       İÇERMEZ — sarf/kelimeindir.js liste()'de bu modüle soruyor.

   KAPSAM
     · Çıkarma listeye özeldir (anahtar = liste key'i) ve OTURUMLUKTUR:
       sayfa yenilenince liste yine tam gelir. Kalıcı olsun istenirse
       burada localStorage'a yazmak yeter.
     · Yalnız liste kipinde çalışır; hafıza oyunu/çalışma kartlarına
       dokunmaz. Kelime testi (kelimetest.js) listenin tamamını kullanır.
   ========================================================================== */
(function () {
    'use strict';

    /* key -> { arAnahtar: {ar, tr} }  — çıkarılan kelimeler */
    var CIKAN = {};

    var SIM_CARPI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        + 'stroke-width="2.2" stroke-linecap="round" aria-hidden="true">'
        + '<path d="M7 7l10 10M17 7L7 17"/></svg>';
    var SIM_GERI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + '<path d="M4 12a8 8 0 1 1 2.3 5.6"/><path d="M4 5.5V11h5.5"/></svg>';

    function anahtar(s) {
        return String(s || '').replace(/[ً-ْٰ]/g, '').replace(/\s+/g, ' ').trim();
    }
    function kutu(key) { return CIKAN[key] || (CIKAN[key] = {}); }
    function sayi(key) { return Object.keys(kutu(key)).length; }
    function cikarikMi(key, ar) { return !!kutu(key)[anahtar(ar)]; }

    /* ---------------------------------------------------------------- biçim */
    function stil() {
        if (document.getElementById('kdf-cikar-stil')) return;
        var s = document.createElement('style');
        s.id = 'kdf-cikar-stil';
        s.textContent = [
            /* satırdaki çarpı */
            '.kdf-satir{position:relative;}',
            '.kdf-cikar{flex:0 0 auto;margin-inline-start:10px;width:26px;height:26px;',
            '  padding:4px;border:0;border-radius:999px;background:transparent;color:#B7C4D1;',
            '  cursor:pointer;opacity:.5;transition:opacity .15s,background .15s,color .15s,transform .15s;}',
            '.kdf-cikar svg{width:100%;height:100%;display:block;}',
            '.kdf-satir:hover .kdf-cikar{opacity:1;}',
            '.kdf-cikar:hover{background:#FDECEA;color:#E0533B;transform:scale(1.12);}',
            '.kdf-cikar:focus-visible{outline:3px solid #F3BDB4;outline-offset:2px;opacity:1;}',
            /* satır gidiyor: küçülüp aşağı süzülür */
            '.kdf-satir.kdf-giden{animation:kdfGit .34s cubic-bezier(.4,0,.6,1) forwards;',
            '  pointer-events:none;overflow:hidden;}',
            '@keyframes kdfGit{',
            ' 0%{opacity:1;transform:none;}',
            ' 60%{opacity:.35;transform:translateY(16px) scale(.92);}',
            ' 100%{opacity:0;transform:translateY(26px) scale(.86);height:0;min-height:0;}}',
            /* satır geri geldi: bir an sarıya çalar */
            '.kdf-satir.kdf-gelen{animation:kdfGel .7s ease-out;}',
            '@keyframes kdfGel{',
            ' 0%{opacity:0;transform:translateY(-14px) scale(.94);background:#FFF3D6;}',
            ' 35%{opacity:1;transform:none;background:#FFF3D6;}',
            ' 100%{background:transparent;}}',
            /* havuz */
            '.kdf-havuz{margin:14px 16px 4px;padding:12px 14px 14px;border-radius:16px;',
            '  background:#F7FAFD;border:1.5px dashed #CFDCE8;}',
            '.kdf-havuz[hidden]{display:none!important;}',
            '.kdf-havuz-bas{display:flex;align-items:center;gap:10px;flex-wrap:wrap;',
            '  font-size:.95rem;color:#5b6b7b;margin-bottom:10px;}',
            '.kdf-havuz-bas b{color:#16324F;}',
            '.kdf-havuz-not{color:#8a99a8;}',
            '.kdf-havuz-geri{margin-inline-start:auto;border:1.5px solid #CFDCE8;background:#fff;',
            '  color:#0E7C66;border-radius:999px;padding:5px 13px;font-family:inherit;',
            '  font-size:.9rem;cursor:pointer;}',
            '.kdf-havuz-geri:hover{background:#E6FAF5;border-color:#16A085;}',
            '.kdf-cipler{display:flex;flex-wrap:wrap;gap:8px;}',
            '.kdf-cip{display:inline-flex;align-items:center;gap:9px;border:1.5px solid #E3EAF2;',
            '  background:#fff;border-radius:999px;padding:6px 14px 6px 10px;cursor:pointer;',
            '  font-family:inherit;color:#16324F;box-shadow:0 1px 2px rgba(23,33,48,.05);',
            '  animation:kdfCipGel .3s cubic-bezier(.3,1.4,.5,1);',
            '  transition:border-color .15s,box-shadow .15s,transform .15s;}',
            '.kdf-cip:hover{border-color:#16A085;box-shadow:0 5px 14px rgba(22,160,133,.16);',
            '  transform:translateY(-2px);}',
            '.kdf-cip .kdf-cip-sim{width:17px;height:17px;flex:0 0 17px;color:#16A085;}',
            '.kdf-cip .kdf-cip-sim svg{width:100%;height:100%;display:block;}',
            '.kdf-cip .kdf-cip-ar{font-size:1.5rem;line-height:1.2;}',
            '.kdf-cip .kdf-cip-tr{font-size:.92rem;color:#6b7b8b;}',
            '.kdf-cip.kdf-cip-gidiyor{animation:kdfCipGit .26s ease-in forwards;pointer-events:none;}',
            '@keyframes kdfCipGel{from{opacity:0;transform:scale(.8) translateY(-8px);}',
            ' to{opacity:1;transform:none;}}',
            '@keyframes kdfCipGit{to{opacity:0;transform:scale(.8) translateY(-10px);}}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------------ yardımcı */
    function defterBul(key) {
        var g = document.getElementById('grid-' + key);
        return g ? g.querySelector('.kdf-defter') : null;
    }
    function satirlar(defter) {
        return [].slice.call(defter.querySelectorAll('.kdf-satir'));
    }
    function numarala(defter) {
        var n = 0;
        satirlar(defter).forEach(function (li) {
            if (li.hidden) return;
            n++;
            var no = li.querySelector('.kdf-no');
            if (no) no.textContent = n;
        });
    }

    /* -------------------------------------------------------------- havuz */
    function havuzKur(key, defter) {
        var g = defter.parentNode;
        var h = g.querySelector('.kdf-havuz');
        if (!h) {
            h = document.createElement('div');
            h.className = 'kdf-havuz';
            h.innerHTML =
                '<div class="kdf-havuz-bas">'
                + '<b data-i18n="kl.cikarilanlar">Çıkarılanlar</b><span class="kdf-havuz-sayi"></span>'
                + '<span class="kdf-havuz-not" data-i18n="kl.cikar_not">— silinmedi; geri eklemek için dokun</span>'
                + '<button type="button" class="kdf-havuz-geri">Hepsini geri al</button>'
                + '</div><div class="kdf-cipler"></div>';
            defter.parentNode.insertBefore(h, defter.nextSibling);
            h.querySelector('.kdf-havuz-geri').addEventListener('click', function () {
                hepsiniGeri(key);
            });
        }
        return h;
    }

    function havuzTazele(key) {
        var defter = defterBul(key);
        if (!defter) return;
        var h = havuzKur(key, defter);
        var liste = kutu(key);
        var adlar = Object.keys(liste);
        h.hidden = !adlar.length;
        h.querySelector('.kdf-havuz-sayi').textContent = adlar.length ? '(' + adlar.length + ')' : '';
        var yer = h.querySelector('.kdf-cipler');
        /* var olan rozetleri koru (animasyonları yeniden başlamasın) */
        var duran = {};
        [].slice.call(yer.children).forEach(function (c) {
            if (liste[c.dataset.ar]) duran[c.dataset.ar] = c; else c.remove();
        });
        adlar.forEach(function (a) {
            if (duran[a]) return;
            var k = liste[a];
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'kdf-cip';
            b.dataset.ar = a;
            b.title = 'Listeye geri ekle';
            b.innerHTML = '<span class="kdf-cip-sim">' + SIM_GERI + '</span>'
                + '<span class="kdf-cip-ar" dir="rtl">' + k.ar + '</span>'
                + (k.tr ? '<span class="kdf-cip-tr">' + k.tr + '</span>' : '');
            b.addEventListener('click', function () { geriEkle(key, a, b); });
            yer.appendChild(b);
        });
    }

    /* ------------------------------------------------------------ işlemler */
    function cikar(key, li) {
        var arEl = li.querySelector('.kdf-ar'), trEl = li.querySelector('.kdf-tr');
        var a = anahtar(arEl ? arEl.textContent : '');
        if (!a) return;
        kutu(key)[a] = { ar: (arEl ? arEl.innerHTML : ''), tr: (trEl ? trEl.textContent : '') };
        li.classList.add('kdf-giden');
        setTimeout(function () {
            li.classList.remove('kdf-giden');
            li.hidden = true;
            var d = defterBul(key);
            if (d) numarala(d);
            havuzTazele(key);
        }, 330);
        try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { }
    }

    function geriEkle(key, a, cip) {
        var defter = defterBul(key);
        if (!defter) return;
        delete kutu(key)[a];
        if (cip) {
            cip.classList.add('kdf-cip-gidiyor');
            setTimeout(function () { cip.remove(); havuzTazele(key); }, 240);
        }
        var hedef = null;
        satirlar(defter).forEach(function (li) {
            var e = li.querySelector('.kdf-ar');
            if (!hedef && e && anahtar(e.textContent) === a) hedef = li;
        });
        if (hedef) {
            hedef.hidden = false;
            hedef.classList.add('kdf-gelen');
            setTimeout(function () { hedef.classList.remove('kdf-gelen'); }, 760);
            numarala(defter);
            try { hedef.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { }
        }
        try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { }
    }

    function hepsiniGeri(key) {
        Object.keys(kutu(key)).forEach(function (a) { geriEkle(key, a, null); });
        CIKAN[key] = {};
        var yer = document.querySelector('#grid-' + key + ' .kdf-cipler');
        if (yer) yer.innerHTML = '';
        havuzTazele(key);
    }

    /* Liste her çizildiğinde çağrılır (sarf/kelimeler.js). */
    function kur(key) {
        var defter = defterBul(key);
        if (!defter) return;
        stil();
        var liste = kutu(key);
        satirlar(defter).forEach(function (li) {
            if (!li.querySelector('.kdf-cikar')) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'kdf-cikar';
                b.title = 'Bu kelimeyi listeden çıkar (silinmez, aşağıdaki havuza düşer)';
                b.setAttribute('aria-label', 'Listeden çıkar');
                b.innerHTML = SIM_CARPI;
                b.addEventListener('click', function (e) {
                    e.preventDefault(); e.stopPropagation();
                    cikar(key, li);
                });
                li.appendChild(b);
            }
            var e2 = li.querySelector('.kdf-ar');
            li.hidden = !!(e2 && liste[anahtar(e2.textContent)]);
        });
        numarala(defter);
        havuzTazele(key);
    }

    window.KidefKelimeCikar = {
        kur: kur, cikarikMi: cikarikMi, sayi: sayi,
        hepsiniGeri: hepsiniGeri
    };
})();
