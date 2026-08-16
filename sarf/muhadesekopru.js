/* =====================================================================
   MUHÂDESE → SARF KÖPRÜSÜ  (kalıplar tablosu tarafı — ALICI)

   Muhâdese sayfasında bir kelimenin altındaki rozete basılınca kök bu
   sekmeye gelir ve KÖK LİSTESİNDEN TIKLANMIŞ GİBİ işlenir.

   Kök iki yoldan gelir:
     • adres satırı — kaliplartablosu.html?kok=فضل
       (muhâdese sekmeyi ilk kez açarken bu yolu kullanır)
     • açık sekmeye — postMessage / BroadcastChannel
       (sekme zaten açıksa sayfa yeniden yüklenmez, kök anında uygulanır)

   Gelen değer iki türlü olabilir, ikisi de sözlükte gerçek bir anahtardır:
     • üç harfli kök (فضل، كتب، علم)  -> selectRootFromMenu, yani tablo kurulur
     • sözlük anahtarı ("Edat: Men")   -> showWordDetails, yani kelime kartı

   Bu dosya hem masaüstü hem mobil tabloya bağlanır; ikisinde de aynı
   işlev adları var. Dışarıdan gelen veriye güvenilmez: yalnız aynı
   kaynaktan gelen mesajlar kabul edilir ve kök, sözlükte gerçekten
   varsa uygulanır.
   ===================================================================== */
(function () {
    'use strict';

    var KANAL_AD = 'kidef-sarf';
    var bekleyen = null;          /* sayfa henüz hazır değilse kök burada bekler */
    var denemeSayaci = 0;

    /* ---- Tablo çalışmaya hazır mı? -------------------------------- */
    function hazirMi() {
        return typeof selectRootFromMenu === 'function' &&
               typeof sozlukVerileri !== 'undefined' && sozlukVerileri &&
               Object.keys(sozlukVerileri).length > 0;
    }

    function ucHarfliKok(k) {
        return /^[ء-ي]{3}$/.test(k);
    }

    /* TABLO MU, KART MI? (Geylani: "su" kelimesine tıklayınca tablo baştan
       sona soru işareti çıkıyordu.)
       Ölçüt kelimenin UZUNLUĞU değil, sözlük girdisinin GERÇEKTEN kalıp
       verisi taşıyıp taşımadığıdır. ماء، بيت، قلم üç harflidir ama
       sözlükte yalnız kelime kaydı vardır (isDictOnly, sayısal kalıp
       anahtarı yok); onlara tablo kurulunca bütün kutular boş kalıyor.
       كتب، أكل gibi gerçek köklerde sayısal kalıp anahtarları bulunur.
       Kalıbı olmayanlar sözlükteki KELİME KARTIYLA açılır — o kart zaten
       sitede var olan tasarımdır, yeni bir şey uydurulmaz. */
    function kalibiVarMi(kok) {
        var d = (typeof sozlukVerileri !== 'undefined') ? sozlukVerileri[kok] : null;
        if (!d || d.isDictOnly) return false;
        for (var k in d) {
            if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
            if (/^[0-9]+$/.test(k)) return true;
        }
        return false;
    }

    function tabloYolu(kok) {
        return ucHarfliKok(kok) && kalibiVarMi(kok);
    }

    /* Sözlük girdisinin GERÇEK kalıp anahtarı. sozlukVerileri[kök] altında
       içerik anahtarlarının yanında 'isDictOnly', 'tip' gibi alan adları da
       var; showWordDetails bunlardan birini alırsa hata veriyor. Sıralamayı
       sayfanın kendi işlevi verir, biz yalnız içerik taşıyanları süzeriz. */
    function ilkKalip(kok) {
        var d = (typeof sozlukVerileri !== 'undefined') ? sozlukVerileri[kok] : null;
        if (!d) return null;
        var sira = (typeof getSortedRefsForRoot === 'function')
            ? getSortedRefsForRoot(kok) : Object.keys(d);
        for (var i = 0; i < sira.length; i++) {
            var v = d[sira[i]];
            if (v && typeof v === 'object' && (v.base || v.arText)) return String(sira[i]);
        }
        return null;
    }

    /* Muhâdeseden gelindiğinde ekranı kapatan pencereler çekilir:
       "Günün Kökü" ve (kök geliyorsa) açık kalmış kelime kartı. Yoksa
       öğretmen sekmeye geçince istediği kökü değil, üstteki pencereyi
       görüyor — "tıkladım ama bir şey olmadı" hissi buradan geliyordu. */
    function perdeleriKapat(kokGeliyor) {
        var g = document.getElementById('rootOfDayOverlay');
        if (g) { if (typeof window.closeRootOfDay === 'function') window.closeRootOfDay();
                 else if (g.parentNode) g.parentNode.removeChild(g); }
        if (kokGeliyor) {
            var m = document.getElementById('word-details-modal');
            var o = document.getElementById('word-details-overlay');
            if (m) m.style.display = 'none';
            if (o) o.style.display = 'none';
        }
    }

    /* ---- Kökü uygula ---------------------------------------------- */
    function uygula(kok) {
        if (!kok) return false;
        kok = String(kok).trim();
        if (!kok || kok.length > 60) return false;
        if (typeof sozlukVerileri === 'undefined' || !sozlukVerileri[kok]) return false;

        var masa = tabloYolu(kok);
        try {
            perdeleriKapat(masa);
            if (masa && typeof selectRootFromMenu === 'function') {
                selectRootFromMenu(kok);                 /* kök listesine tıklamakla aynı yol */
            } else if (typeof showWordDetails === 'function') {
                /* Kalıp verisi olmayan girdiler (ماء، بيت، "Edat: Men"...):
                   sözlükteki kelime kartı açılır. */
                var kalip = ilkKalip(kok);
                if (!kalip) return false;
                showWordDetails(kok, kalip);
            } else {
                return false;
            }
            selam(kok);
            return true;
        } catch (e) {
            return false;
        }
    }

    /* Kısa bir bilgi şeridi: hangi kelimeden gelindiği belli olsun.
       Aynı kök için tekrar tekrar gösterilmez (zorla() birkaç kez deneyebilir). */
    var sonSelam = '', sonSelamAn = 0;
    function selam(kok) {
        var simdi = (window.performance && performance.now) ? performance.now() : 0;
        if (kok === sonSelam && simdi - sonSelamAn < 6000) return;
        sonSelam = kok; sonSelamAn = simdi;
        var eski = document.getElementById('kidef-kopru-selam');
        if (eski) eski.remove();
        var d = document.createElement('div');
        d.id = 'kidef-kopru-selam';
        d.textContent = 'Muhâdeseden geldi: ' + kok;
        d.style.cssText = 'position:fixed;z-index:2147483000;left:50%;top:14px;' +
            'transform:translateX(-50%);background:#0E6655;color:#fff;' +
            'padding:8px 16px;border-radius:999px;font:600 15px/1.2 system-ui,sans-serif;' +
            'box-shadow:0 6px 18px rgba(0,0,0,.25);pointer-events:none;' +
            'opacity:0;transition:opacity .22s';
        document.body.appendChild(d);
        requestAnimationFrame(function () { d.style.opacity = '1'; });
        setTimeout(function () {
            d.style.opacity = '0';
            setTimeout(function () { if (d.parentNode) d.remove(); }, 300);
        }, 2200);
    }

    /* ---- Hazır olunca uygula, değilse bekle ------------------------ */
    function dene(kok) {
        bekleyen = kok;
        if (hazirMi() && uygula(bekleyen)) { bekleyen = null; return; }
        if (denemeSayaci++ > 80) { bekleyen = null; return; }   /* ~12 sn sonra vazgeç */
        setTimeout(function () { if (bekleyen) dene(bekleyen); }, 150);
    }

    /* Kök gerçekten oturdu mu? Sayfa kendi açılış kurulumunu bizden SONRA
       bitirirse varsayılan köke (فعل) dönüyordu; onun için tutturana kadar
       birkaç kez denenir. */
    function oturduMu(kok) {
        /* Masaüstü sürüm activeConfirmedRoot'u, mobil sürüm currentRoot'u
           kullanıyor; ikisinden biri tutuyorsa iş bitmiştir. */
        if (tabloYolu(kok)) {
            if (window.activeConfirmedRoot === kok) return true;
            return (typeof currentRoot !== 'undefined' && currentRoot === kok);
        }
        var m = document.getElementById('word-details-modal');
        return !!(m && getComputedStyle(m).display !== 'none');
    }

    function zorla(kok, tur) {
        if (!hazirMi()) {
            if (tur > 60) return;
            setTimeout(function () { zorla(kok, tur + 1); }, 150);
            return;
        }
        uygula(kok);
        setTimeout(function () {
            if (!oturduMu(kok) && tur < 6) zorla(kok, tur + 1);
        }, 700);
    }

    /* ---- 1) Adres satırındaki ?kok= ------------------------------- */
    function adrestenOku() {
        var k = null;
        try { k = new URLSearchParams(location.search).get('kok'); } catch (e) { k = null; }
        if (!k) return;

        /* MUHÂDESEDEN GELİNDİYSE "GÜNÜN KÖKÜ" AÇILMAZ (Geylani): öğretmen
           belirli bir kelimenin kökünü görmek için geliyor, karşısına
           günün kökü penceresi çıkmamalı. Pencere DOMContentLoaded'dan
           800 ms sonra açılıyor; bu dosya kaliplartablosu.js'ten sonra
           yüklendiği için işlevi burada devre dışı bırakmak yetiyor. */
        try { window.showRootOfDay = function () { /* köprüden gelindi */ }; } catch (e) {}
        /* Adres temizlensin: sayfa yenilenince aynı kök tekrar zorlanmasın. */
        try {
            var u = new URL(location.href);
            u.searchParams.delete('kok');
            history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
        } catch (e) { /* önemsiz */ }

        /* Sayfanın kendi açılış kurulumu bitsin diye load'dan sonra başlanır. */
        var basla = function () { setTimeout(function () { zorla(k, 0); }, 500); };
        if (document.readyState === 'complete') basla();
        else window.addEventListener('load', basla, { once: true });
    }

    /* ---- 2) Açık sekmeye gelen mesaj ------------------------------ */
    function mesajGecerliMi(e) {
        /* Yalnız aynı kaynak. origin 'null' (file://) durumunda da kabul
           edilmez; site her zaman http(s) üzerinden açılıyor. */
        if (!e || !e.data || typeof e.data !== 'object') return false;
        if (e.data.kidef !== 'sarf-kok') return false;
        if (e.origin && e.origin !== location.origin) return false;
        return true;
    }

    /* Gelen kökü uygula ve gönderene SONUCU bildir. Muhâdese bu onayı
       bekler; gelmezse sekmeyi ?kok= adresiyle yeniden yükler. Böylece
       mesaj yolu herhangi bir sebeple çalışmazsa özellik sessizce
       bozulmuyor, adres yoluna düşüyor. */
    function karsila(kok, bildir) {
        denemeSayaci = 0;
        var oldu = hazirMi() && uygula(kok);
        if (!oldu) dene(kok);                 /* henüz hazır değilse bekleyip dener */
        try { bildir({ kidef: 'sarf-hazir', kok: kok, tamam: !!oldu }); } catch (x) {}
    }

    /* Muhâdeseye geri dönüldüğünde tablo sıfırlanır ve bir sonraki kelime
       için hazır bekler: üstünde kalan kart, büyütme ve kök temizlenir.
       (Geylani: "geri dönülünce kalıplar tablosu sıfırlanıp hazırda dursun".)
       Sessiz sıfırlama — arka plandaki sekmeden ses çıkmasın. */
    function sifirla() {
        bekleyen = null;
        try {
            perdeleriKapat(true);
            if (typeof window.resetTableOnly === 'function') window.resetTableOnly(true);
            else if (typeof resetTableOnly === 'function') resetTableOnly(true);
        } catch (e) { /* sıfırlama başarısızsa tablo olduğu gibi kalsın */ }
    }

    window.addEventListener('message', function (e) {
        if (!e || !e.data || typeof e.data !== 'object') return;
        if (e.origin && e.origin !== location.origin) return;
        if (e.data.kidef === 'sarf-sifirla') { sifirla(); return; }
        if (!mesajGecerliMi(e)) return;
        karsila(e.data.kok, function (m) {
            if (e.source) e.source.postMessage(m, location.origin);
        });
    });

    if (typeof BroadcastChannel === 'function') {
        try {
            var kanal = new BroadcastChannel(KANAL_AD);
            kanal.onmessage = function (e) {
                if (!e || !e.data) return;
                if (e.data.kidef === 'sarf-sifirla') { sifirla(); return; }
                if (e.data.kidef !== 'sarf-kok') return;
                karsila(e.data.kok, function (m) { kanal.postMessage(m); });
            };
        } catch (e) { /* eski tarayıcı: postMessage yolu yeter */ }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', adrestenOku);
    } else {
        adrestenOku();
    }
})();
