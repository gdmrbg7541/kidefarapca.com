/* ÇOK DİLLİ SİTE (15.10.2026) — kodun yazdığı yazılar seçilen dilde.
   Yazı sistem/dil.js sözlüğünden gelir; dil Türkçeyse, sözlük henüz
   yüklenmemişse ya da çeviri yoksa Türkçesi kalır.
     kdMetin(anahtar, türkçe, {ad: değer})  yazıyı verir, {…} yerlerini doldurur
     kdYaz(öğe, anahtar, türkçe, {…})        öğeye anahtarıyla yazar; sözlük sonradan
                                             yüklense de dil değişse de yazı döner
     kdIsaretli(anahtar, türkçe)             innerHTML içine konacak işaretli <span>
     kdSerbest(öğe)                          öğenin işaretini kaldırır (kod oraya her
                                             an başka yazı yazıyorsa)
     kdDil()                                 sayfanın o anki dili */
function kdDoldur(m, yer) {
    if (!yer || m == null) return m;
    return String(m).replace(/\{([A-Za-z0-9_]+)\}/g, function (t, ad) {
        return Object.prototype.hasOwnProperty.call(yer, ad) ? String(yer[ad]) : t;
    });
}
function kdMetin(k, tr, yer) {
    var m = (window.KidefDil && window.KidefDil.metin) ? window.KidefDil.metin(k, tr) : tr;
    return kdDoldur(m, yer);
}
function kdYaz(el, k, tr, yer) {
    if (!el) return;
    if (window.KidefDil && window.KidefDil.yaz) { window.KidefDil.yaz(el, k, tr, yer); return; }
    el.setAttribute('data-i18n', k);
    el.setAttribute('data-i18n-tr', tr);
    if (yer) el.setAttribute('data-i18n-yer', JSON.stringify(yer)); else el.removeAttribute('data-i18n-yer');
    el.textContent = kdDoldur(tr, yer);
}
function kdIsaretli(k, tr) {
    var e = function (x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
    return '<span data-i18n="' + k + '" data-i18n-tr="' + e(tr) + '">' + e(kdMetin(k, tr)) + '</span>';
}
function kdSerbest(el) {
    if (el && el.removeAttribute) el.removeAttribute('data-i18n');
    return el;
}
function kdDil() {
    return document.documentElement.getAttribute('lang') || 'tr';
}

/* ==========================================================================
   KİTAP ÖNERİSİ                                merak/kitaponeri.js
   --------------------------------------------------------------------------
   Öğretmen (14.10.2026): "merak çarkına yeni bi özellik ekle, amacımız
   ortaokul ve lise öğrencilerine sevdiği alanla ilgili kitap önermek,
   yaşlar için filtre olsun, alan ve yaş veya seviye filtreleri olsun."

   ÇARKA DOKUNULMUYOR (öğretmenin seçimi): bu, Merak Çarkı sayfasının
   ALTINDA duran ayrı bir bölüm. Çarkın kart havuzuyla (merakveri.js) ve
   tekrar kaydıyla hiçbir ilgisi yok.

   NASIL ÇALIŞIR
     1) Öğrenci bir ALAN seçer (Tarih, Bilim Kurgu, Din, Uzay…).
     2) SEVİYE seçer — hem sınıf hem yaş yazılı, ikisi aynı şey.
     3) «Bana kitap öner» bir kitap kartı açar; aynı filtrede arka arkaya
        basınca aynı kitap tekrar çıkmaz (havuz bitince sıfırlanır).
     4) «Hepsini listele» o filtredeki bütün kitapları gösterir.
     Arama kutusu ad ve yazarda arar; alan/seviye seçimiyle birlikte çalışır.

   OKUDUM İŞARETİ: tarayıcı belleğinde (kidef_kitap_okudum). Giriş
   gerektirmiyor; sınıfta ortak bilgisayarda da sorun çıkarmasın diye
   yalnız o tarayıcıda duruyor.
   ========================================================================== */
(function () {
    'use strict';

    var V = window.KITAP_VERI;
    if (!V || !V.kitaplar || !V.kitaplar.length) return;

    var OKUNDU_ANAHTAR = 'kidef_kitap_okudum';
    var kap = null, durum = { alan: '', sev: 0, ara: '', liste: false };
    var cikanlar = {};          /* filtre imzası -> çıkmış id'ler */
    var sonKitap = null;

    /* ---------------- küçük yardımcılar ---------------- */
    function kacis(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function alanAd(k) {
        for (var i = 0; i < V.alanlar.length; i++) if (V.alanlar[i].k === k) return kdMetin(KN_AL[k] || '', V.alanlar[i].ad);
        return k;
    }
    function alanRenk(k) {
        for (var i = 0; i < V.alanlar.length; i++) if (V.alanlar[i].k === k) return V.alanlar[i].renk;
        return '#6B7A8C';
    }
    function sevAd(n) {
        for (var i = 0; i < V.seviyeler.length; i++) if (V.seviyeler[i].n === n) return kdMetin(KN_SEV[V.seviyeler[i].k] || '', V.seviyeler[i].ad);
        return '';
    }
    /* Kitabın seviye aralığını "Ortaokul 7-8 — Lise 9-10" gibi yazar. */
    function sevYazi(k) {
        if (k.s1 === k.s2) return sevAd(k.s1);
        return sevAd(k.s1) + ' – ' + sevAd(k.s2);
    }
    /* ÇOK DİLLİ SİTE (16.10.2026): alan ve seviye adlarının sözlük anahtarları
       (veri dosyasındaki k → anahtar). innerHTML'e konan adlar işaretli <span> —
       dil değişince motor kendisi çevirir. */
    var KN_AL = { roman: 'kn.al_roman', klasik: 'kn.al_klasik', macera: 'kn.al_macera',
        bilimkurgu: 'kn.al_bilimkurgu', polisiye: 'kn.al_polisiye', tarih: 'kn.al_tarih',
        bilim: 'kn.al_bilim', uzay: 'kn.al_uzay', matematik: 'kn.al_matematik',
        teknoloji: 'kn.al_teknoloji', doga: 'kn.al_doga', psikoloji: 'kn.al_psikoloji',
        felsefe: 'kn.al_felsefe', din: 'kn.al_din', sanat: 'kn.al_sanat',
        biyografi: 'kn.al_biyografi', gezi: 'kn.al_gezi', siir: 'kn.al_siir', cizgi: 'kn.al_cizgi' };
    var KN_SEV = { o56: 'kn.sev_o56', o78: 'kn.sev_o78', l910: 'kn.sev_l910', l1112: 'kn.sev_l1112' };
    var KN_YAS = { o56: 'kn.yas_o56', o78: 'kn.yas_o78', l910: 'kn.yas_l910', l1112: 'kn.yas_l1112' };
    function sevIsaretli(n) {
        for (var i = 0; i < V.seviyeler.length; i++) if (V.seviyeler[i].n === n) return kdIsaretli(KN_SEV[V.seviyeler[i].k] || '', V.seviyeler[i].ad);
        return '';
    }
    function sevYaziIsaretli(k) {
        if (k.s1 === k.s2) return sevIsaretli(k.s1);
        return sevIsaretli(k.s1) + ' – ' + sevIsaretli(k.s2);
    }
    function alanIsaretli(k) {
        for (var i = 0; i < V.alanlar.length; i++) if (V.alanlar[i].k === k) return kdIsaretli(KN_AL[k] || '', V.alanlar[i].ad);
        return kacis(k);
    }
    function okunanlar() {
        try { return JSON.parse(localStorage.getItem(OKUNDU_ANAHTAR) || '{}') || {}; }
        catch (e) { return {}; }
    }
    function okunduYaz(o) {
        try { localStorage.setItem(OKUNDU_ANAHTAR, JSON.stringify(o)); } catch (e) { }
    }
    function tik() {
        try { if (typeof window.playClick === 'function') window.playClick(); } catch (e) { }
    }

    /* Türkçe arama: büyük/küçük ve aksan farkı aramayı bozmasın. */
    function sade(s) {
        return String(s || '').toLocaleLowerCase('tr')
            .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
            .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
            .replace(/[â]/g, 'a').replace(/[î]/g, 'i').replace(/[û]/g, 'u')
            .replace(/[‘’']/g, '');
    }

    function suzulmus() {
        var ara = sade(durum.ara);
        return V.kitaplar.filter(function (k) {
            if (durum.alan && k.al.indexOf(durum.alan) < 0) return false;
            if (durum.sev && (durum.sev < k.s1 || durum.sev > k.s2)) return false;
            if (ara && sade(k.ad).indexOf(ara) < 0 && sade(k.yz).indexOf(ara) < 0) return false;
            return true;
        });
    }

    /* ---------------- biçem ---------------- */
    function bicemKur() {
        if (document.getElementById('ko-stil')) return;
        var s = document.createElement('style');
        s.id = 'ko-stil';
        s.textContent = [
            '#koBolum{ padding:clamp(18px,3vw,40px) clamp(14px,2.4vw,32px) clamp(40px,6vw,80px);',
            '  border-top:1px solid var(--mc-cizgi,#E3E9F0); margin-top:clamp(20px,3vw,44px); }',
            /* Kendi modülünün içindeyken üstteki ayraç ve boşluk gereksiz. */
            '#koYuva #koBolum{ border-top:none; margin-top:0; padding-top:clamp(10px,1.6vw,22px); }',
            '#koBolum .ko-bas{ display:flex; align-items:baseline; gap:12px; flex-wrap:wrap;',
            '  margin:0 0 4px; }',
            '#koBolum h2{ margin:0; font-size:clamp(1.3rem,2.4vw,2.3rem); font-weight:800;',
            '  color:var(--mc-yesil-k,#0E7C66); }',
            '#koBolum .ko-say{ font-size:clamp(.86rem,1.2vw,1.05rem); color:var(--mc-gri,#6B7A8C); }',
            '#koBolum .ko-not{ margin:0 0 clamp(14px,2vw,22px); color:var(--mc-gri,#6B7A8C);',
            '  font-size:clamp(.95rem,1.35vw,1.2rem); }',

            /* --- filtreler --- */
            '.ko-filtre{ display:flex; flex-direction:column; gap:clamp(10px,1.4vw,16px);',
            '  margin-bottom:clamp(14px,2vw,22px); }',
            '.ko-satir{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }',
            /* ALAN / SEVİYE / ARA rozeti (15.10.2026, öğretmen: "alan ve
               seviye başlıkları kırmızı dolgu ve beyaz yazı olsun") —
               kırmızı sitenin kendi paletinden (#EE5253). */
            '.ko-etiket{ flex:none; font-weight:800; font-size:clamp(.78rem,1vw,.94rem);',
            '  letter-spacing:.7px; color:#fff; background:#EE5253;',
            '  border-radius:999px; padding:6px 14px; min-width:84px; text-align:center;',
            '  line-height:1.1; box-shadow:0 4px 10px -6px rgba(238,82,83,.95); }',
            '.ko-tus{ font-family:inherit; cursor:pointer; border:1.5px solid var(--mc-cizgi,#E3E9F0);',
            '  background:#fff; color:var(--mc-murekkep,#16324F); border-radius:999px;',
            '  padding:7px 15px; font-size:clamp(.86rem,1.15vw,1.05rem); font-weight:600;',
            '  transition:background .14s, border-color .14s, color .14s; }',
            '.ko-tus:hover{ background:#F4F7FA; }',
            '.ko-tus.secili{ color:#fff; border-color:transparent; font-weight:700;',
            '  background:var(--mc-yesil,#16A085); }',
            '.ko-tus.secili .ko-adet{ opacity:.85; }',
            '.ko-tus.secili.ko-genel{ background:var(--mc-yesil,#16A085); }',
            '.ko-adet{ margin-inline-start:6px; font-size:.82em; opacity:.55; font-weight:700; }',
            '.ko-tus.ko-yok{ opacity:.38; }',
            '.ko-ara{ flex:1 1 240px; min-width:0; font-family:inherit;',
            '  border:1.5px solid var(--mc-cizgi,#E3E9F0); border-radius:12px;',
            '  padding:9px 14px; font-size:clamp(.9rem,1.2vw,1.08rem);',
            '  color:var(--mc-murekkep,#16324F); background:#fff; }',
            '.ko-ara:focus{ outline:2px solid var(--mc-yesil,#16A085); outline-offset:1px; }',

            /* --- eylem düğmeleri --- */
            '.ko-eylem{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; }',
            '.ko-buyuk{ font-family:inherit; cursor:pointer; border:0; border-radius:999px;',
            '  background:var(--mc-yesil,#16A085); color:#fff; font-weight:800;',
            '  padding:12px 26px; font-size:clamp(1rem,1.4vw,1.25rem);',
            '  box-shadow:0 4px 12px rgba(22,160,133,.28); transition:filter .14s, transform .1s; }',
            '.ko-buyuk:hover{ filter:brightness(1.06); }',
            '.ko-buyuk:active{ transform:translateY(1px); }',
            '.ko-ikincil{ background:#fff; color:var(--mc-yesil-k,#0E7C66);',
            '  border:1.5px solid var(--mc-yesil,#16A085); box-shadow:none; }',

            /* --- öneri kartı --- */
            '.ko-kart{ margin-top:clamp(14px,2vw,22px); background:#fff;',
            '  border:1px solid var(--mc-cizgi,#E3E9F0); border-radius:20px;',
            '  padding:clamp(16px,2.4vw,30px); box-shadow:0 6px 22px rgba(22,50,79,.07);',
            '  border-inline-start:7px solid var(--ko-renk,#16A085);',
            '  animation:koGel .32s ease-out; }',
            '@keyframes koGel{ from{ opacity:0; transform:translateY(10px); } }',
            '.ko-kart .ko-k-ad{ margin:0; font-size:clamp(1.25rem,2.3vw,2.1rem); font-weight:800;',
            '  line-height:1.2; color:var(--mc-murekkep,#16324F); }',
            '.ko-kart .ko-k-yz{ margin:4px 0 0; font-size:clamp(1rem,1.5vw,1.35rem);',
            '  color:var(--ko-renk,#16A085); font-weight:700; }',
            '.ko-kart .ko-k-nt{ margin:clamp(10px,1.4vw,16px) 0 0;',
            '  font-size:clamp(.98rem,1.4vw,1.28rem); line-height:1.45; }',
            '.ko-rozetler{ display:flex; gap:7px; flex-wrap:wrap; margin-top:clamp(12px,1.6vw,18px); }',
            '.ko-rozet{ font-size:clamp(.74rem,1vw,.92rem); font-weight:700; border-radius:999px;',
            '  padding:4px 11px; background:#F4F7FA; color:var(--mc-gri,#6B7A8C); }',
            '.ko-rozet.ko-alan{ color:#fff; }',
            '.ko-kart .ko-k-alt{ display:flex; gap:10px; flex-wrap:wrap;',
            '  margin-top:clamp(12px,1.8vw,20px); }',

            /* --- liste --- */
            '.ko-liste{ margin-top:clamp(14px,2vw,22px); display:grid; gap:10px;',
            '  grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr)); }',
            '.ko-sat{ background:#fff; border:1px solid var(--mc-cizgi,#E3E9F0);',
            '  border-radius:14px; padding:12px 15px; display:flex; gap:11px; align-items:flex-start;',
            '  border-inline-start:5px solid var(--ko-renk,#16A085); }',
            '.ko-sat .ko-s-ic{ flex:1; min-width:0; }',
            '.ko-sat b{ display:block; font-size:clamp(.98rem,1.25vw,1.12rem); line-height:1.25; }',
            '.ko-sat small{ display:block; color:var(--mc-gri,#6B7A8C);',
            '  font-size:clamp(.82rem,1.05vw,.95rem); margin-top:2px; }',
            '.ko-sat .ko-s-nt{ margin-top:5px; font-size:clamp(.84rem,1.05vw,.97rem);',
            '  color:#4A5A6B; line-height:1.35; }',
            '.ko-isaret{ flex:none; width:30px; height:30px; border-radius:50%; cursor:pointer;',
            '  border:1.5px solid var(--mc-cizgi,#E3E9F0); background:#fff; color:#B6C2CE;',
            '  font-size:16px; line-height:1; font-family:inherit; }',
            '.ko-isaret.okundu{ background:var(--mc-yesil,#16A085); border-color:transparent; color:#fff; }',
            '.ko-bos{ margin-top:16px; color:var(--mc-gri,#6B7A8C);',
            '  font-size:clamp(.95rem,1.3vw,1.15rem); }',
            '@media (max-width:640px){ .ko-etiket{ min-width:0; width:100%; } }'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ---------------- iskelet ---------------- */
    function kur() {
        bicemKur();
        kap = document.createElement('section');
        kap.id = 'koBolum';
        var alanTus = V.alanlar.map(function (a) {
            var n = V.kitaplar.filter(function (k) { return k.al.indexOf(a.k) >= 0; }).length;
            return '<button type="button" class="ko-tus" data-ko-alan="' + a.k + '"' +
                ' data-renk="' + a.renk + '" title="' + kacis(kdMetin('kn.n_kitap', '{n} kitap', { n: n })) + '">' + kdIsaretli(KN_AL[a.k] || '', a.ad) +
                '<span class="ko-adet"></span></button>';
        }).join('');
        var sevTus = V.seviyeler.map(function (s) {
            return '<button type="button" class="ko-tus" data-ko-sev="' + s.n + '">' +
                kdIsaretli(KN_SEV[s.k] || '', s.ad) + ' <span style="opacity:.6">· ' + kdIsaretli(KN_YAS[s.k] || '', s.yas) + '</span></button>';
        }).join('');
        kap.innerHTML =
            '<div class="ko-bas"><h2>' + kdIsaretli('mk.kitap', 'Kitap Önerisi') + '</h2>' +
            '<span class="ko-say" id="koSay"></span></div>' +
            '<p class="ko-not">' + kdIsaretli('kn.not', 'Sevdiğin alanı ve sınıfını seç — sana uygun bir kitap önerelim.') + '</p>' +
            '<div class="ko-filtre">' +
            '  <div class="ko-satir"><span class="ko-etiket">' + kdIsaretli('kn.alan', 'ALAN') + '</span>' +
            '    <button type="button" class="ko-tus ko-genel secili" data-ko-alan="">' + kdIsaretli('kn.hepsi', 'Hepsi') + '</button>' +
            alanTus + '</div>' +
            '  <div class="ko-satir"><span class="ko-etiket">' + kdIsaretli('kn.seviye', 'SEVİYE') + '</span>' +
            '    <button type="button" class="ko-tus ko-genel secili" data-ko-sev="0">' + kdIsaretli('kn.fark_etmez', 'Fark etmez') + '</button>' +
            sevTus + '</div>' +
            '  <div class="ko-satir"><span class="ko-etiket">' + kdIsaretli('kn.ara', 'ARA') + '</span>' +
            '    <input type="search" class="ko-ara" id="koAra" data-i18n-ph="kn.ara_ph" data-i18n-ph-tr="Kitap adı ya da yazar…" placeholder="' + kacis(kdMetin('kn.ara_ph', 'Kitap adı ya da yazar…')) + '"' +
            ' data-i18n-aria="kn.ara_aria" data-i18n-aria-tr="Kitap adı ya da yazar ara" aria-label="' + kacis(kdMetin('kn.ara_aria', 'Kitap adı ya da yazar ara')) + '"></div>' +
            '</div>' +
            '<div class="ko-eylem">' +
            '  <button type="button" class="ko-buyuk" data-ko-rol="oner">' + kdIsaretli('kn.oner', 'Bana kitap öner') + '</button>' +
            '  <button type="button" class="ko-buyuk ko-ikincil" data-ko-rol="liste" data-i18n="kn.listele" data-i18n-tr="Hepsini listele">' + kacis(kdMetin('kn.listele', 'Hepsini listele')) + '</button>' +
            '</div>' +
            '<div id="koKart"></div><div id="koListe"></div>';
        /* MODÜL YUVASI (14.10.2026): sayfa modüllere ayrılınca bölüm
           artık body'nin sonuna değil, kendi modülünün içine kuruluyor.
           Yuva yoksa (başka bir sayfaya konulursa) eski davranış sürer. */
        var yuva = document.getElementById('koYuva');
        (yuva || document.body).appendChild(kap);

        kap.addEventListener('click', function (ev) {
            var t = ev.target.closest ? ev.target.closest('[data-ko-alan],[data-ko-sev],[data-ko-rol],[data-ko-id]') : null;
            if (!t) return;
            if (t.hasAttribute('data-ko-alan')) {
                tik(); durum.alan = t.getAttribute('data-ko-alan');
                secimTazele('data-ko-alan', durum.alan); yenile(); return;
            }
            if (t.hasAttribute('data-ko-sev')) {
                tik(); durum.sev = parseInt(t.getAttribute('data-ko-sev'), 10) || 0;
                secimTazele('data-ko-sev', String(durum.sev)); yenile(); return;
            }
            if (t.hasAttribute('data-ko-id')) { tik(); okuduTersine(t); return; }
            var rol = t.getAttribute('data-ko-rol');
            if (rol === 'oner')  { tik(); oner(); return; }
            if (rol === 'liste') { tik(); durum.liste = !durum.liste; listeCiz(); return; }
            if (rol === 'baska') { tik(); oner(); return; }
        });
        var ara = kap.querySelector('#koAra');
        var zaman = null;
        ara.addEventListener('input', function () {
            clearTimeout(zaman);
            zaman = setTimeout(function () { durum.ara = ara.value; yenile(); }, 180);
        });
        yenile();
    }

    function secimTazele(nitelik, deger) {
        kap.querySelectorAll('[' + nitelik + ']').forEach(function (b) {
            var secili = b.getAttribute(nitelik) === deger;
            b.classList.toggle('secili', secili);
            var r = b.getAttribute('data-renk');
            b.style.background = (secili && r) ? r : '';
        });
    }

    function yenile() {
        var n = suzulmus().length;
        var s = kap.querySelector('#koSay');
        if (s) s.textContent = kdMetin('kn.n_kitap', '{n} kitap', { n: n }) + (durum.alan || durum.sev || durum.ara ? ' ' + kdMetin('kn.suzulmus', '(süzülmüş)') : '');
        alanSayilari();
        if (durum.liste) listeCiz();
    }

    /* SEÇİLİ SEVİYEDE HANGİ ALANDA KAÇ KİTAP VAR (14.10.2026)
       Ortaokul 5-6 seçilince felsefe ya da psikolojide kitap çıkmıyor —
       bu doğal, o kitaplar lise seviyesinde. Öğrenci boşuna denemesin
       diye o alanlar soluklaşıyor ve her alanın yanında sayı yazıyor. */
    function alanSayilari() {
        var ara = sade(durum.ara);
        kap.querySelectorAll('[data-ko-alan]').forEach(function (b) {
            var a = b.getAttribute('data-ko-alan');
            if (!a) return;                       /* "Hepsi" tuşu */
            var n = V.kitaplar.filter(function (k) {
                if (k.al.indexOf(a) < 0) return false;
                if (durum.sev && (durum.sev < k.s1 || durum.sev > k.s2)) return false;
                if (ara && sade(k.ad).indexOf(ara) < 0 && sade(k.yz).indexOf(ara) < 0) return false;
                return true;
            }).length;
            var say = b.querySelector('.ko-adet');
            if (!say) {
                say = document.createElement('span');
                say.className = 'ko-adet';
                b.appendChild(say);
            }
            say.textContent = ' ' + n;
            b.classList.toggle('ko-yok', n === 0);
            b.title = kdMetin('kn.n_kitap', '{n} kitap', { n: n });
        });
    }

    /* ---------------- öneri ---------------- */
    function imza() { return durum.alan + '|' + durum.sev + '|' + sade(durum.ara); }

    function oner() {
        var havuz = suzulmus();
        var yer = kap.querySelector('#koKart');
        if (!havuz.length) {
            /* Boş sonuçta öğrenciyi yalnız bırakma: en yakın seviyede kaç
               kitap olduğunu söyle ve oraya geçmeyi öner. */
            var oneri = '';
            if (durum.sev) {
                for (var d = 1; d <= 3 && !oneri; d++) {
                    [durum.sev + d, durum.sev - d].forEach(function (y) {
                        if (oneri || y < 1 || y > 4) return;
                        var m = V.kitaplar.filter(function (k) {
                            return (!durum.alan || k.al.indexOf(durum.alan) >= 0) && y >= k.s1 && y <= k.s2;
                        }).length;
                        if (m) oneri = '<button type="button" class="ko-buyuk ko-ikincil"' +
                            ' data-ko-sev="' + y + '">' + kacis(kdMetin('kn.icin_var', '{sev} için {n} kitap var', { sev: sevAd(y), n: m })) + '</button>';
                    });
                }
            }
            yer.innerHTML = '<p class="ko-bos">' + kacis(kdMetin('kn.bos', 'Bu alanda bu seviye için kitap yok.')) + ' ' +
                kacis(oneri ? kdMetin('kn.ne_dersin', 'Buna ne dersin?') : kdMetin('kn.gevset', 'Filtreyi biraz gevşet.')) + '</p>' +
                (oneri ? '<div class="ko-k-alt">' + oneri + '</div>' : '');
            return;
        }
        var im = imza();
        var gorulen = cikanlar[im] = cikanlar[im] || {};
        var kalan = havuz.filter(function (k) { return !gorulen[k.id]; });
        if (!kalan.length) { cikanlar[im] = gorulen = {}; kalan = havuz; }   /* havuz bitti: baştan */
        if (kalan.length > 1 && sonKitap) {
            var b = kalan.filter(function (k) { return k.id !== sonKitap; });
            if (b.length) kalan = b;
        }
        var k = kalan[Math.floor(Math.random() * kalan.length)];
        gorulen[k.id] = 1; sonKitap = k.id;
        kartCiz(k, yer);
    }

    function kartCiz(k, yer) {
        var renk = alanRenk(k.al[0]);
        var ok = okunanlar();
        var rozet = k.al.map(function (a) {
            return '<span class="ko-rozet ko-alan" style="background:' + alanRenk(a) + '">' +
                alanIsaretli(a) + '</span>';
        }).join('') + '<span class="ko-rozet">' + sevYaziIsaretli(k) + '</span>';
        yer.innerHTML =
            '<article class="ko-kart" style="--ko-renk:' + renk + '">' +
            '<p class="ko-k-ad">' + kacis(k.ad) + '</p>' +
            '<p class="ko-k-yz">' + kacis(k.yz) + '</p>' +
            '<p class="ko-k-nt">' + kacis(k.nt) + '</p>' +
            '<div class="ko-rozetler">' + rozet + '</div>' +
            '<div class="ko-k-alt">' +
            '<button type="button" class="ko-buyuk" data-ko-rol="baska">' + kdIsaretli('kn.baska', 'Başka bir kitap') + '</button>' +
            '<button type="button" class="ko-buyuk ko-ikincil ko-isaret-buyuk' +
            (ok[k.id] ? ' okundu' : '') + '" data-ko-id="' + k.id + '"' +
            (ok[k.id] ? ' data-i18n="kn.okudum" data-i18n-tr="✓ Okudum">' + kacis(kdMetin('kn.okudum', '✓ Okudum'))
                      : ' data-i18n="kn.isaretle" data-i18n-tr="Okudum olarak işaretle">' + kacis(kdMetin('kn.isaretle', 'Okudum olarak işaretle'))) + '</button>' +
            '</div></article>';
    }

    /* ---------------- liste ---------------- */
    function listeCiz() {
        var yer = kap.querySelector('#koListe');
        var tus = kap.querySelector('[data-ko-rol="liste"]');
        if (!durum.liste) { yer.innerHTML = ''; if (tus) kdYaz(tus, 'kn.listele', 'Hepsini listele'); return; }
        if (tus) kdYaz(tus, 'kn.liste_kapat', 'Listeyi kapat');
        var h = suzulmus();
        if (!h.length) { yer.innerHTML = '<p class="ko-bos">' + kacis(kdMetin('kn.bulunamadi', 'Bu seçimle kitap bulunamadı.')) + '</p>'; return; }
        var ok = okunanlar();
        yer.innerHTML = '<div class="ko-liste">' + h.map(function (k) {
            return '<div class="ko-sat" style="--ko-renk:' + alanRenk(k.al[0]) + '">' +
                '<div class="ko-s-ic"><b>' + kacis(k.ad) + '</b>' +
                '<small>' + kacis(k.yz) + ' · ' + sevYaziIsaretli(k) + '</small>' +
                '<div class="ko-s-nt">' + kacis(k.nt) + '</div></div>' +
                '<button type="button" class="ko-isaret' + (ok[k.id] ? ' okundu' : '') + '"' +
                ' data-ko-id="' + k.id + '" title="' + kacis(kdMetin('kn.isaretle', 'Okudum olarak işaretle')) + '"' +
                ' aria-label="' + kacis(kdMetin('kn.isaretle', 'Okudum olarak işaretle')) + '">✓</button></div>';
        }).join('') + '</div>';
    }

    function okuduTersine(tus) {
        var id = tus.getAttribute('data-ko-id');
        var o = okunanlar();
        if (o[id]) delete o[id]; else o[id] = 1;
        okunduYaz(o);
        var acik = !!o[id];
        tus.classList.toggle('okundu', acik);
        if (tus.classList.contains('ko-isaret-buyuk')) {
            if (acik) kdYaz(tus, 'kn.okudum', '✓ Okudum'); else kdYaz(tus, 'kn.isaretle', 'Okudum olarak işaretle');
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();

    /* dil değişince sayaç, alan ipuçları ve açık liste yeniden yazılsın */
    document.addEventListener('kidef:dil', function () { try { if (kap) yenile(); } catch (e) { } });
    window.KidefKitapOneri = { ac: kur, veri: function () { return V; } };
})();
