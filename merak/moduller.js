/* ==========================================================================
   MERAK KÖŞESİ — MODÜL ŞERİDİ                   merak/moduller.js
   --------------------------------------------------------------------------
   Öğretmen (14.10.2026): "merak çarkının ismini değiştirelim, uygun bi isim
   bul, içeriği de sadece bi çark olmasın, modül modül olsun."
   Sayfanın adı MERAK KÖŞESİ oldu; çark artık köşedeki modüllerden yalnız
   biri.

   NASIL ÇALIŞIR
     Sayfadaki her modül bir <section class="mk-modul" data-modul="..."> .
     Bu dosya üstteki şeride birer kart basar; karta basınca o bölüm açılır,
     ötekiler kapanır. Son seçilen modül tarayıcıda saklanıyor — öğretmen
     sayfayı yenileyince kaldığı modülde açılıyor.

   YENİ MODÜL EKLEMEK
     1) merakcarki.html'e  <section class="mk-modul" data-modul="xxx" hidden>
        … </section>  ekle.
     2) Aşağıdaki MODULLER dizisine bir satır yaz (anahtar, ad, not, ikon).
     Başka hiçbir yere dokunmak gerekmiyor.
   ========================================================================== */
(function () {
    'use strict';

    var ANAHTAR = 'kidefMerakModul';

    /* İkonlar sitenin kendi dilinde: 24'lük kutu, currentColor, çizgi. */
    var IKON = {
        cark: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"' +
              ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="2.1"/>' +
              '<path d="M12 3.4v6M12 14.6v6M3.4 12h6M14.6 12h6"/>' +
              '<path d="M5.9 5.9l4.2 4.2M13.9 13.9l4.2 4.2M18.1 5.9l-4.2 4.2M10.1 13.9l-4.2 4.2"/></svg>',
        soz:  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"' +
              ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M20.5 12.3c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 20.5l1.5-3.6' +
              'C4.2 15.6 3.5 14 3.5 12.3c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2z"/>' +
              '<path d="M8.6 11.4h6.8M8.6 14.2h4.2"/></svg>',
        kitap:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"' +
              ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M2.8 4.2h5.4a3.8 3.8 0 0 1 3.8 3.8v12.1a2.8 2.8 0 0 0-2.8-2.8H2.8z"/>' +
              '<path d="M21.2 4.2h-5.4a3.8 3.8 0 0 0-3.8 3.8v12.1a2.8 2.8 0 0 1 2.8-2.8h6.4z"/></svg>'
    };

    var MODULLER = [
        { k: 'cark',  ad: 'Merak Çarkı',    not: 'Fıkra · köken · kültür · bulmaca' },
        { k: 'soz',   ad: 'Günün Sözü',     not: 'Âyet, hadis ya da özlü söz' },
        { k: 'kitap', ad: 'Kitap Önerisi',  not: 'Alanına ve seviyene göre' }
    ];

    var serit = null;

    function bicemKur() {
        if (document.getElementById('mk-stil')) return;
        var s = document.createElement('style');
        s.id = 'mk-stil';
        s.textContent = [
            '.mk-serit{ display:flex; gap:clamp(8px,1.2vw,16px); flex-wrap:wrap;',
            '  padding:clamp(12px,2vw,22px) clamp(14px,2.4vw,32px) 0; }',
            '.mk-kart{ flex:1 1 200px; min-width:0; display:flex; align-items:center;',
            '  gap:clamp(9px,1.1vw,14px); cursor:pointer; font-family:inherit; text-align:start;',
            '  background:var(--mc-kart,#fff); color:var(--mc-murekkep,#16324F);',
            '  border:1.5px solid var(--mc-cizgi,#E3E9F0); border-radius:16px;',
            '  padding:clamp(10px,1.4vw,16px) clamp(12px,1.6vw,20px);',
            '  transition:border-color .16s, box-shadow .16s, background .16s, transform .12s; }',
            '.mk-kart:hover{ border-color:var(--mc-yesil,#16A085);',
            '  box-shadow:0 6px 18px rgba(22,160,133,.14); transform:translateY(-1px); }',
            '.mk-kart .mk-i{ flex:none; width:clamp(26px,2.6vw,36px); height:clamp(26px,2.6vw,36px);',
            '  color:var(--mc-yesil,#16A085); }',
            '.mk-kart .mk-i svg{ width:100%; height:100%; display:block; }',
            '.mk-kart .mk-y{ min-width:0; }',
            '.mk-kart b{ display:block; font-size:clamp(1rem,1.5vw,1.3rem); line-height:1.2; }',
            '.mk-kart small{ display:block; margin-top:2px; color:var(--mc-gri,#6B7A8C);',
            '  font-size:clamp(.8rem,1.05vw,.98rem); line-height:1.25; }',
            /* seçili kart */
            '.mk-kart.secili{ background:var(--mc-yesil,#16A085); border-color:transparent;',
            '  color:#fff; box-shadow:0 8px 22px rgba(22,160,133,.3); }',
            '.mk-kart.secili .mk-i, .mk-kart.secili small{ color:#fff; }',
            '.mk-kart.secili small{ opacity:.85; }',
            /* modül gövdesi */
            '.mk-modul{ animation:mkGel .26s ease-out; }',
            '@keyframes mkGel{ from{ opacity:0; transform:translateY(8px); } }',
            '.mk-bos{ padding:clamp(26px,5vw,70px) clamp(14px,2.4vw,32px);',
            '  max-width:720px; }',
            '.mk-bos h2{ margin:0 0 8px; font-size:clamp(1.3rem,2.4vw,2.2rem);',
            '  color:var(--mc-yesil-k,#0E7C66); }',
            '.mk-bos p{ margin:0 0 clamp(14px,2vw,22px); color:var(--mc-gri,#6B7A8C);',
            '  font-size:clamp(.98rem,1.4vw,1.25rem); line-height:1.45; }',
            '.mk-buyuk{ font-family:inherit; cursor:pointer; border:0; border-radius:999px;',
            '  background:var(--mc-yesil,#16A085); color:#fff; font-weight:800;',
            '  padding:12px 28px; font-size:clamp(1rem,1.4vw,1.25rem);',
            '  box-shadow:0 4px 12px rgba(22,160,133,.28); }',
            '.mk-buyuk:hover{ filter:brightness(1.06); }',
            '@media (max-width:620px){ .mk-kart{ flex:1 1 100%; } }'
        ].join('\n');
        document.head.appendChild(s);
    }

    function varOlanlar() {
        return MODULLER.filter(function (m) {
            return !!document.querySelector('.mk-modul[data-modul="' + m.k + '"]');
        });
    }

    function sec(k, sesVer) {
        var hepsi = document.querySelectorAll('.mk-modul');
        var bulundu = false;
        for (var i = 0; i < hepsi.length; i++) {
            var acik = hepsi[i].getAttribute('data-modul') === k;
            hepsi[i].hidden = !acik;
            if (acik) bulundu = true;
        }
        if (!bulundu) return false;
        if (serit) {
            var tuslar = serit.querySelectorAll('[data-mk]');
            for (var j = 0; j < tuslar.length; j++) {
                var s = tuslar[j].getAttribute('data-mk') === k;
                tuslar[j].classList.toggle('secili', s);
                tuslar[j].setAttribute('aria-pressed', s ? 'true' : 'false');
            }
        }
        try { localStorage.setItem(ANAHTAR, k); } catch (e) { }
        if (sesVer) { try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { } }
        return true;
    }

    function kur() {
        serit = document.getElementById('mkSerit');
        if (!serit) return;
        bicemKur();
        var liste = varOlanlar();
        serit.innerHTML = liste.map(function (m) {
            return '<button type="button" class="mk-kart" data-mk="' + m.k + '"' +
                ' aria-pressed="false"><span class="mk-i">' + (IKON[m.k] || '') + '</span>' +
                '<span class="mk-y"><b>' + m.ad + '</b><small>' + m.not + '</small></span></button>';
        }).join('');
        serit.addEventListener('click', function (e) {
            var t = e.target.closest ? e.target.closest('[data-mk]') : null;
            if (!t) return;
            sec(t.getAttribute('data-mk'), true);
        });

        /* Son seçilen modülle açılır; yoksa ilk modül (çark). */
        var ilk = '';
        try { ilk = localStorage.getItem(ANAHTAR) || ''; } catch (e) { }
        if (!sec(ilk)) sec(liste.length ? liste[0].k : 'cark');

        /* Günün Sözü modülündeki tuş, var olan pencereyi açar. */
        var sozTus = document.getElementById('mkSozAc');
        if (sozTus) {
            sozTus.addEventListener('click', function () {
                try { if (window.KidefGunSozu && KidefGunSozu.ac) KidefGunSozu.ac(); } catch (e) { }
            });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();

    window.KidefMerakModul = { sec: sec, liste: function () { return MODULLER.slice(); } };
})();
