/* ==========================================================================
   ALT ŞERİT KONU PENCERESİ                      okumayazma/alfabe_konu.js
   --------------------------------------------------------------------------
   Öğretmen (14.10.2026): "aşağıda tayı marbuta, uzatma harfleri, cezim şedde
   tenvin ve harekelere tıklayınca da konu popup olsun, hem konu özet anlatımı
   tarzında hem bilgi şeklinde olsun" · "3 satırda tekillerde ikillerde ve cemi
   müennese dönüşümünü dönüşüm animasyonuyla örnekle".

   NASIL ÇALIŞIR
     Metinler üretilen dosyada: okumayazma/alfabe_konu_veri.js (KONU_ANLATIM),
     üreticisi _kaynak/uretici/konuAnlatim.py — Arapça kelimeler orada kod
     noktalarından kuruluyor, elle yazılmıyor.
     Alt şeritteki kutulara alfabe.js data-konu veriyor; buradaki dinleyici
     o adı KONU_ANLATIM'da buluyor ve pencereyi kuruyor.

   YENİ KONU EKLEMEK
     konuAnlatim.py'ye bir giriş yaz (ad, ozet, bilgi, ornekler; istersen
     donusum). Alt şeritteki kutunun adı anahtarla aynı olsun, yeter.
   ========================================================================== */
(function () {
    'use strict';

    var OVERLAY = 'kn-overlay';

    /* Kutu adıyla veri anahtarını eşlemek için: boşluk/tire farkları yutulur. */
    function sade(s) {
        return String(s || '').toLocaleLowerCase('tr')
            .replace(/[\s‐-―_-]+/g, '');
    }

    function veriBul(ad) {
        if (typeof KONU_ANLATIM === 'undefined') return null;
        if (KONU_ANLATIM[ad]) return KONU_ANLATIM[ad];
        var a = sade(ad), k;
        for (k in KONU_ANLATIM) {
            if (sade(k) === a) return KONU_ANLATIM[k];
        }
        return null;
    }

    function bicemKur() {
        if (document.getElementById('kn-stil')) return;
        var s = document.createElement('style');
        s.id = 'kn-stil';
        s.textContent = [
            '#kn-overlay{ position:fixed; inset:0; z-index:5200; display:none;',
            '  align-items:center; justify-content:center; background:rgba(23,33,48,.66); }',
            '#kn-overlay.kn-acik{ display:flex; }',
            '#kn-kart{ background:#F7FAFC; border:1px solid rgba(255,255,255,.4);',
            '  border-radius:24px; box-shadow:0 25px 50px -12px rgba(0,0,0,.5);',
            '  width:min(1100px, 92vw); max-height:92vh; overflow-y:auto;',
            '  padding:24px clamp(18px,3vw,34px) 28px; position:relative;',
            '  display:flex; flex-direction:column; gap:16px;',
            '  transform:scale(.7); opacity:0; transition:transform .28s cubic-bezier(.34,1.4,.64,1), opacity .22s ease; }',
            '#kn-overlay.kn-acik #kn-kart{ transform:scale(1); opacity:1; }',
            '#kn-kapat{ position:absolute; top:14px; left:14px; width:44px; height:44px;',
            '  border:0; border-radius:999px; background:#E74C3C; color:#fff; font-size:1.6rem;',
            '  line-height:1; cursor:pointer; box-shadow:0 6px 14px rgba(231,76,60,.35); }',
            '#kn-kapat:hover{ filter:brightness(1.07); }',
            '.kn-bas{ display:flex; align-items:center; justify-content:center; gap:14px;',
            '  flex-wrap:wrap; padding:0 56px; }',
            '.kn-bas-ar{ font-family:"arakom"; font-size:clamp(1.8rem,4.4vh,3rem); color:#117A65;',
            '  line-height:1.1; direction:rtl; }',
            '.kn-bas-ad{ font-size:clamp(1.3rem,3vh,2rem); font-weight:bold; color:#16324F; }',
            '.kn-kutu{ background:#fff; border-radius:18px; padding:16px 20px;',
            '  box-shadow:0 2px 10px rgba(23,33,48,.07); border-left:6px solid #16A085; }',
            '.kn-kutu-bilgi{ border-left-color:#2980B9; }',
            '.kn-kutu-don{ border-left-color:#E67E22; }',
            '.kn-kutu-orn{ border-left-color:#8E44AD; }',
            '.kn-kutu-bas{ font-size:1.25rem; font-weight:bold; color:#16324F; margin-bottom:8px; }',
            '.kn-metin{ font-size:1.12rem; line-height:1.55; color:#334155; }',
            '.kn-liste{ margin:0; padding-inline-start:22px; display:grid; gap:7px; }',
            '.kn-liste li{ font-size:1.05rem; line-height:1.45; color:#334155; }',
            /* dönüşüm satırları */
            '.kn-don{ display:grid; gap:10px; }',
            '.kn-sat{ display:grid; grid-template-columns:132px 1fr 1fr; align-items:center;',
            '  gap:14px; background:#FBFDFF; border:1.5px solid #E6EEF6; border-radius:14px;',
            '  padding:10px 14px; opacity:0; transform:translateY(10px);',
            '  transition:opacity .35s ease, transform .35s ease; }',
            '.kn-sat.kn-gor{ opacity:1; transform:none; }',
            '.kn-et{ font-size:1rem; font-weight:bold; color:#7b8a99; }',
            '.kn-kel{ font-family:"arakom"; font-size:clamp(1.8rem,5vh,3rem); color:#16324F;',
            '  direction:rtl; text-align:center; white-space:nowrap; }',
            /* DİKKAT: buraya display:inline-block ya da transform KOYMA — ek,
               gövdeye bitişmeyi bırakıyor (ـمـ yerine ـم + تـ görünüyordu).
               Satır içi kalsın; hareket gerekiyorsa kelimenin TAMAMI oynatılır. */
            '.kn-son{ transition:opacity .38s ease, color .38s ease; }',
            '.kn-son.kn-cikis{ opacity:0; color:#E74C3C; }',
            '.kn-son.kn-giris{ opacity:0; color:#16A085; }',
            '.kn-son.kn-yerinde{ opacity:1; color:#16A085; }',
            '.kn-kel.kn-pop{ animation:knPop .55s cubic-bezier(.3,.8,.3,1); }',
            '@keyframes knPop{ 0%{ transform:scale(.88); } 55%{ transform:scale(1.06); } 100%{ transform:none; } }',
            '.kn-oku{ text-align:start; }',
            '.kn-oku b{ display:block; font-size:1.05rem; color:#117A65; }',
            '.kn-oku span{ font-size:.98rem; color:#7b8a99; }',
            '.kn-don-not{ font-size:1rem; color:#475569; line-height:1.45; margin-top:4px; }',
            '.kn-tekrar{ align-self:flex-start; margin-top:6px; border:0; border-radius:999px;',
            '  background:#E67E22; color:#fff; font-family:inherit; font-weight:bold;',
            '  padding:8px 18px; font-size:1rem; cursor:pointer; box-shadow:0 4px 10px rgba(230,126,34,.3); }',
            '.kn-tekrar:hover{ filter:brightness(1.06); }',
            /* örnekler */
            '.kn-ornekler{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }',
            '.kn-orn{ background:#fff; border:1.5px solid #EEF2F7; border-radius:14px;',
            '  padding:12px; text-align:center; }',
            '.kn-orn-ar{ display:block; font-family:"arakom"; font-size:clamp(1.6rem,4.4vh,2.6rem);',
            '  color:#117A65; direction:rtl; line-height:1.3; }',
            '.kn-orn-tr{ display:block; font-size:.98rem; color:#7b8a99; margin-top:4px; }',
            '@media (max-width:768px){',
            '  .kn-sat{ grid-template-columns:1fr; gap:6px; text-align:center; }',
            '  .kn-oku{ text-align:center; }',
            '  .kn-ornekler{ grid-template-columns:1fr; }',
            '  .kn-bas{ padding:0 48px; }',
            '  .kn-metin{ font-size:1rem; } }'
        ].join('\n');
        document.head.appendChild(s);
    }

    function kabukKur() {
        if (document.getElementById(OVERLAY)) return;
        bicemKur();
        var ov = document.createElement('div');
        ov.id = OVERLAY;
        ov.innerHTML = '<div id="kn-kart" role="dialog" aria-modal="true">' +
            '<button id="kn-kapat" title="Kapat" aria-label="Kapat">&times;</button>' +
            '<div class="kn-bas"><span class="kn-bas-ar" id="kn-ar"></span>' +
            '<span class="kn-bas-ad" id="kn-ad"></span></div>' +
            '<div id="kn-govde"></div></div>';
        document.body.appendChild(ov);
        ov.addEventListener('click', function (e) { if (e.target === ov) kapat(); });
        document.getElementById('kn-kapat').onclick = kapat;
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') kapat();
        });
    }

    var saatler = [];
    function saatleriDurdur() {
        saatler.forEach(function (t) { clearTimeout(t); });
        saatler = [];
    }
    function sonra(f, ms) { saatler.push(setTimeout(f, ms)); }

    function kutu(sinif, baslik) {
        var d = document.createElement('div');
        d.className = 'kn-kutu ' + sinif;
        if (baslik) {
            var b = document.createElement('div');
            b.className = 'kn-kutu-bas';
            b.innerText = baslik;
            d.appendChild(b);
        }
        return d;
    }

    /* ---- DÖNÜŞÜM ANİMASYONU ------------------------------------------
       Gövde sabit kalır, yalnız SON değişir: önce eski son kırmızıya dönüp
       küçülerek kaybolur, sonra yeni son yeşil büyüyerek yerine oturur.
       Böylece "kapalı te açılıyor" gözle görülür. */
    function donusumOynat(yuva, satirlar) {
        var kutular = yuva.querySelectorAll('.kn-sat');
        var gec = 240;
        satirlar.forEach(function (s, i) {
            var el = kutular[i];
            if (!el) return;
            var son = el.querySelector('.kn-son');
            el.classList.remove('kn-gor');
            son.className = 'kn-son';
            son.innerText = (i === 0) ? s.son : satirlar[i - 1].son;
            sonra(function () { el.classList.add('kn-gor'); }, gec);
            if (i > 0) {
                sonra(function () { son.className = 'kn-son kn-cikis'; }, gec + 520);
                sonra(function () {
                    son.innerText = s.son;
                    son.className = 'kn-son kn-giris';
                    var kel = el.querySelector('.kn-kel');
                    kel.classList.remove('kn-pop');
                    void kel.offsetWidth;            /* animasyonu yeniden başlat */
                    kel.classList.add('kn-pop');
                }, gec + 960);
                sonra(function () { son.className = 'kn-son kn-yerinde'; }, gec + 1010);
                gec += 1500;
            } else {
                sonra(function () { son.className = 'kn-son kn-yerinde'; }, gec + 420);
                gec += 1000;
            }
        });
    }

    function donusumKur(d) {
        var k = kutu('kn-kutu-don', d.baslik || 'Dönüşüm');
        var yuva = document.createElement('div');
        yuva.className = 'kn-don';
        d.satirlar.forEach(function (s) {
            var sat = document.createElement('div');
            sat.className = 'kn-sat';
            var et = document.createElement('span');
            et.className = 'kn-et'; et.innerText = s.etiket;
            var kel = document.createElement('span');
            kel.className = 'kn-kel'; kel.dir = 'rtl';
            var gov = document.createElement('span');
            gov.className = 'kn-govde'; gov.innerText = s.govde;
            var son = document.createElement('span');
            son.className = 'kn-son'; son.innerText = s.son;
            kel.appendChild(gov); kel.appendChild(son);
            var oku = document.createElement('span');
            oku.className = 'kn-oku';
            var b = document.createElement('b'); b.innerText = s.okunus || '';
            var t = document.createElement('span'); t.innerText = s.tr || '';
            oku.appendChild(b); oku.appendChild(t);
            sat.appendChild(et); sat.appendChild(kel); sat.appendChild(oku);
            yuva.appendChild(sat);
        });
        k.appendChild(yuva);
        if (d.not) {
            var n = document.createElement('div');
            n.className = 'kn-don-not'; n.innerText = d.not;
            k.appendChild(n);
        }
        var tus = document.createElement('button');
        tus.type = 'button'; tus.className = 'kn-tekrar';
        tus.innerText = '↻ Dönüşümü tekrar izle';
        tus.onclick = function () {
            saatleriDurdur();
            try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { }
            donusumOynat(yuva, d.satirlar);
        };
        k.appendChild(tus);
        return { kutu: k, yuva: yuva };
    }

    function ac(ad) {
        var v = veriBul(ad);
        if (!v) return false;
        kabukKur();
        saatleriDurdur();
        try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { }
        document.getElementById('kn-ar').innerText = v.ar || '';
        document.getElementById('kn-ad').innerText = ad;
        var g = document.getElementById('kn-govde');
        g.innerHTML = '';
        g.style.display = 'flex';
        g.style.flexDirection = 'column';
        g.style.gap = '14px';

        if (v.ozet) {
            var ozet = kutu('kn-kutu-ozet', 'Konu anlatımı');
            var p = document.createElement('div');
            p.className = 'kn-metin'; p.innerText = v.ozet;
            ozet.appendChild(p);
            g.appendChild(ozet);
        }
        var don = null;
        if (v.donusum && v.donusum.satirlar && v.donusum.satirlar.length) {
            don = donusumKur(v.donusum);
            g.appendChild(don.kutu);
        }
        if (v.bilgi && v.bilgi.length) {
            var bil = kutu('kn-kutu-bilgi', 'Bilgi kartı');
            var ul = document.createElement('ul');
            ul.className = 'kn-liste';
            v.bilgi.forEach(function (x) {
                var li = document.createElement('li'); li.innerText = x; ul.appendChild(li);
            });
            bil.appendChild(ul);
            g.appendChild(bil);
        }
        if (v.ornekler && v.ornekler.length) {
            var orn = kutu('kn-kutu-orn', 'Örnekler');
            var kat = document.createElement('div');
            kat.className = 'kn-ornekler';
            v.ornekler.forEach(function (o) {
                var d = document.createElement('div');
                d.className = 'kn-orn';
                var a = document.createElement('span');
                a.className = 'kn-orn-ar'; a.dir = 'rtl'; a.innerText = o.ar;
                var t = document.createElement('span');
                t.className = 'kn-orn-tr'; t.innerText = o.tr;
                d.appendChild(a); d.appendChild(t);
                kat.appendChild(d);
            });
            orn.appendChild(kat);
            g.appendChild(orn);
        }

        var ov = document.getElementById(OVERLAY);
        ov.style.display = 'flex';
        requestAnimationFrame(function () { ov.classList.add('kn-acik'); });
        document.getElementById('kn-kart').scrollTop = 0;
        if (don) sonra(function () { donusumOynat(don.yuva, v.donusum.satirlar); }, 320);
        return true;
    }

    function kapat() {
        var ov = document.getElementById(OVERLAY);
        if (!ov || !ov.classList.contains('kn-acik')) return;
        saatleriDurdur();
        ov.classList.remove('kn-acik');
        setTimeout(function () { ov.style.display = 'none'; }, 220);
    }

    /* Alt şerit kutuları: alfabe.js data-konu yazıyor. */
    function bagla() {
        var alt = document.getElementById('g1alt');
        if (!alt || alt.dataset.knBagli) return;
        alt.dataset.knBagli = '1';
        alt.addEventListener('click', function (e) {
            var k = e.target.closest ? e.target.closest('[data-konu]') : null;
            if (!k) return;
            ac(k.getAttribute('data-konu'));
        });
        alt.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var k = e.target.closest ? e.target.closest('[data-konu]') : null;
            if (!k) return;
            e.preventDefault();
            ac(k.getAttribute('data-konu'));
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bagla);
    else bagla();

    window.KidefKonu = { ac: ac, kapat: kapat, bagla: bagla, varMi: function (ad) { return !!veriBul(ad); } };
})();
