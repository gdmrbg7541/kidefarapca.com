/* =====================================================================
   DİNLE VE YAZ — İKİLİ YARIŞMA      (okumayazma/dinleveyaz_kapisma.js)
   ---------------------------------------------------------------------
   Aynı ses iki öğrenciye birden çalar; ekran ikiye bölünür, her öğrenci
   KENDİ yarısındaki şıklara dokunur. Kim önce doğru bulursa hız puanını
   o alır.

   Soru: «Duyduğun kelimenin yazılışı hangisi?»
     · Ses, seviyenin o kelimesine ait gerçek kayıttır
       (okumayazma/ses/l{seviye}v{sıra}.wav — dosyalar zaten var).
     · Şıklar AYNI SEVİYEDEN dört kelimenin Arapça yazımıdır.
     · İki oyuncunun şıkları AYRI KARIŞTIRILIR; yandaki ekrana bakıp
       konumdan kopya çekilemesin.

   PUAN — öğretmenin istediği iki ölçü ayrı ayrı tutulur:
     doğruluk : her doğru +10
     hız      : doğru bilenlerden ÖNCE basan +5
   İkisi de sonuç ekranında ayrı ayrı yazılır; "hızlı ama yanlış" ile
   "yavaş ama doğru" birbirine karışmasın.

   NEDEN AYRI DOSYA: dinleveyaz.js'in kendi oyun döngüsü (harf harf
   yazdırma, dikte zaman çizelgesi, tuş takımı) karmaşık ve çalışıyor.
   Yarışma bambaşka bir oyun; oraya karıştırmak çalışan şeyi riske atardı.
   Bu dosya yalnız EKLER: ana ekrana bir düğme, bir de kendi ekranını.

   SARMALAYICI YOK: dinleveyaz.js düz bir betik; gameData onun genel
   sözcüksel kapsamında duruyor. Bu dosya ondan SONRA yüklenip gameData'yı
   doğrudan okuyabiliyor. IIFE içine alınırsa da okunur (aynı realm), ama
   dosyayı IIFE'siz bırakmak dinleveyaz.js ile aynı üslup.
   ===================================================================== */
(function () {
    'use strict';
    if (window.DvyKapisma) return;

    var SORU        = 6;      /* bir yarışmadaki soru sayısı          */
    var SIK         = 4;      /* şık sayısı                            */
    var TEKRAR_ARA  = 900;    /* iki dinletme arasındaki sessizlik (ms) */
    var DOGRU_PUAN  = 10;
    var HIZ_PUAN    = 5;
    var BEKLE_MS    = 1900;   /* cevaplar açıkken beklenen süre        */

    /* gameData dinleveyaz.js'in kapsamında; burada güvenli okuma. */
    function veri() {
        try { return (typeof gameData !== 'undefined') ? gameData : null; }
        catch (e) { return null; }
    }
    function blip(ad) {
        try { if (typeof window.playSound === 'function') window.playSound(ad); } catch (e) {}
    }
    function kacis(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function karistir(a) {
        var i, j, t;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /* ---------------- durum ---------------- */
    var D = {
        seviye: null, sorular: [], i: 0,
        puan: { 1: { dogru: 0, hiz: 0 }, 2: { dogru: 0, hiz: 0 } },
        cevap: {},            /* {1:{dogruMu,ms,dugme}, 2:{…}} */
        bas: 0, saat: null, sureSaat: null,
        tekrar: 4,            /* ana ekrandaki «Tekrar sayısı» ayarından */
        sureMs: 16000,        /* tekrara göre hesaplanır (bkz. sureHesapla) */
        kalanTekrar: 0, tekrarSaat: null, tur: 0
    };
    var ses = null;           /* kendi Audio nesnesi — dikte düzeneğine karışmaz */

    /* Ana ekrandaki «Tekrar sayısı» kutusu bu oyunda da geçerli: ses
       TIKLAMADAN, kendiliğinden o kadar kez tekrar eder. Soru süresi de
       ona göre uzar — yoksa dördüncü dinletme gelmeden süre doluyordu. */
    function tekrarOku() {
        var g = document.getElementById('tekrarInput');
        var n = g ? parseInt(g.value, 10) : 4;
        if (!n || n < 1) n = 1;
        return Math.min(n, 10);
    }
    function sureHesapla(tekrar) {
        return Math.min(30000, Math.max(12000, 4000 + tekrar * 3000));
    }

    /* ---------------- soru kurma ----------------
       Şıklar aynı seviyeden; Türkçesi aynı olan kelime iki kez şık
       olmasın diye yazıma göre ayıklanıyor. */
    function sorularKur(seviye) {
        var g = veri(); if (!g || !g[seviye]) return [];
        var kelimeler = (g[seviye].words || []).filter(function (w) { return w && w.ar; });
        if (kelimeler.length < SIK) return [];
        var secilen = karistir(kelimeler.slice()).slice(0, Math.min(SORU, kelimeler.length));
        return secilen.map(function (dogru) {
            var baskalari = kelimeler.filter(function (w) { return w.ar !== dogru.ar; });
            var celdirici = karistir(baskalari.slice()).slice(0, SIK - 1);
            var havuz = [dogru].concat(celdirici);
            /* İKİ OYUNCUYA AYRI SIRA: yandan konuma bakıp kopya olmasın.
               İki bağımsız karıştırma dört şıkta 1/24 ihtimalle AYNI sırayı
               veriyor (altı soruda en az bir çakışma ≈ %22) — o soruda
               kopya engeli çalışmıyor. Çakışırsa yeniden karıştırılıyor;
               takılmasın diye sayaçlı. */
            var s1 = karistir(havuz.slice());
            var s2 = karistir(havuz.slice()), kac = 0;
            var imza = function (a) { return a.map(function (w) { return w.ar; }).join('|'); };
            while (imza(s1) === imza(s2) && kac++ < 20) s2 = karistir(havuz.slice());
            if (imza(s1) === imza(s2)) s2 = s2.slice(1).concat(s2.slice(0, 1));  /* son çare: kaydır */
            return {
                kelime: dogru,
                siklar: { 1: s1, 2: s2 }
            };
        });
    }

    /* ---------------- çizim ---------------- */

    function ekranHtml() {
        return '' +
        '<div class="dk-ust">' +
        '  <button type="button" class="dk-geri key-button" data-rol="cik" title="Menüye dön">‹</button>' +
        '  <div class="dk-sayac"><span data-rol="no">1</span> / <span data-rol="toplam">' + SORU + '</span></div>' +
        '  <button type="button" class="dk-dinle key-button" data-rol="dinle">' +
        '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor"/>' +
        '    <path d="M16 8.7a4 4 0 010 6.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '    <path d="M18.6 6.2a7.5 7.5 0 010 11.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        '    <span>Tekrar dinle</span></button>' +
        '</div>' +
        '<div class="dk-cubuk"><div class="dk-cubuk-ic" data-rol="cubuk"></div></div>' +
        '<div class="dk-alan">' +
        '  ' + yanHtml(1) + yanHtml(2) +
        '</div>' +
        '<div class="dk-ortu" data-rol="ortu" hidden><div class="dk-ortu-ic" data-rol="ortuic"></div></div>';
    }
    function yanHtml(n) {
        return '<section class="dk-yan dk-y' + n + '" data-oyuncu="' + n + '">' +
               '  <header class="dk-yanbas">' +
               '    <span class="dk-ad">' + n + '. Oyuncu</span>' +
               '    <span class="dk-puan"><b data-rol="puan">0</b></span>' +
               '  </header>' +
               '  <div class="dk-siklar" data-rol="siklar"></div>' +
               '  <div class="dk-durum" data-rol="durum"></div>' +
               '</section>';
    }

    function el(kok, rol, kap) {
        return (kap || kok).querySelector('[data-rol="' + rol + '"]');
    }

    /* ---------------- oyun ---------------- */

    var ekran = null;

    /* Tek dinletme. `tur` damgası soru değişince eski zamanlayıcıların
       konuşmasını engelliyor: kullanıcı erken cevaplayıp sonraki soruya
       geçtiğinde önceki kelimenin tekrarı araya girmesin. */
    function birKezCal(kelime, damga) {
        if (!ses) ses = new Audio();
        if (!kelime || !kelime.audioSrc) return;
        if (damga !== undefined && damga !== D.tur) return;
        try {
            if (!ses.paused) { ses.pause(); ses.currentTime = 0; }
            ses.onended = null;
            ses.src = kelime.audioSrc;
            var p = ses.play();
            if (p && p.catch) p.catch(function () {
                /* Ses çalınamadıysa (dosya yok / tarayıcı engeli) zincir
                   burada durmasın: bitmiş say ve sıradaki tekrarı kur. */
                sesBitti(kelime, damga);
            });
            ses.onended = function () { sesBitti(kelime, damga); };
        } catch (e) {}
    }
    function sesBitti(kelime, damga) {
        if (damga !== undefined && damga !== D.tur) return;
        if (D.kalanTekrar <= 0) return;
        D.kalanTekrar--;
        clearTimeout(D.tekrarSaat);
        D.tekrarSaat = setTimeout(function () {
            birKezCal(kelime, damga);
        }, TEKRAR_ARA);
    }
    function sesDurdur() {
        clearTimeout(D.tekrarSaat);
        D.kalanTekrar = 0;
        try { if (ses) { ses.onended = null; if (!ses.paused) { ses.pause(); ses.currentTime = 0; } } } catch (e) {}
    }
    /* Soru başında: N kez dinlet. Elle «Tekrar dinle»ye basılırsa bir kez
       daha çalar, kalan otomatik tekrarları bozmaz. */
    function sesCal(kelime) {
        if (!kelime) return;
        sesDurdur();
        D.kalanTekrar = Math.max(0, D.tekrar - 1);
        birKezCal(kelime, D.tur);
    }
    function elleCal(kelime) {
        if (!kelime) return;
        clearTimeout(D.tekrarSaat);
        birKezCal(kelime, D.tur);
    }

    function soruGoster() {
        var s = D.sorular[D.i];
        if (!s) { bitir(); return; }
        D.cevap = {};
        el(ekran, 'no').textContent = (D.i + 1);
        el(ekran, 'ortu').hidden = true;

        [1, 2].forEach(function (n) {
            var yan = ekran.querySelector('.dk-y' + n);
            var kutu = el(ekran, 'siklar', yan);
            kutu.innerHTML = '';
            el(ekran, 'durum', yan).textContent = '';
            yan.classList.remove('bekliyor');
            s.siklar[n].forEach(function (w) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'dk-sik';
                b.dataset.ar = w.ar;
                b.innerHTML = '<span class="dk-ar">' + kacis(w.ar) + '</span>';
                kutu.appendChild(b);
            });
        });

        D.tur++;                      /* eski ses zamanlayıcıları sussun */
        D.bas = Date.now();
        sesCal(s.kelime);
        cubukBaslat();
        clearTimeout(D.sureSaat);
        D.sureSaat = setTimeout(function () {
            /* Süre doldu: cevaplamayanlar boş sayılır. */
            [1, 2].forEach(function (n) {
                if (!D.cevap[n]) D.cevap[n] = { dogruMu: false, ms: D.sureMs, dugme: null, bos: true };
            });
            coz();
        }, D.sureMs);
    }

    function cubukBaslat() {
        var c = el(ekran, 'cubuk');
        c.style.transition = 'none';
        c.style.width = '100%';
        /* Yeniden akış zorlanmazsa tarayıcı iki kuralı birleştirip
           geçişi hiç oynatmıyor. */
        void c.offsetWidth;
        c.style.transition = 'width ' + (D.sureMs / 1000) + 's linear';
        c.style.width = '0%';
    }
    function cubukDurdur() {
        var c = el(ekran, 'cubuk');
        var g = getComputedStyle(c).width;
        c.style.transition = 'none';
        c.style.width = g;
    }

    function cevapVer(n, dugme) {
        if (D.cevap[n]) return;                 /* bir kez basılır */
        var s = D.sorular[D.i]; if (!s) return;
        var dogruMu = dugme.dataset.ar === s.kelime.ar;
        D.cevap[n] = { dogruMu: dogruMu, ms: Date.now() - D.bas, dugme: dugme };
        var yan = ekran.querySelector('.dk-y' + n);
        dugme.classList.add('secili');
        /* Basan oyuncunun şıkları kilitlenir ama RENK VERİLMEZ: rakip
           hâlâ düşünüyor, yanındaki ekrandan cevabı görmesin. */
        yan.querySelectorAll('.dk-sik').forEach(function (b) { b.disabled = true; });
        yan.classList.add('bekliyor');
        el(ekran, 'durum', yan).textContent = 'Cevabın alındı…';
        blip('touch');
        if (D.cevap[1] && D.cevap[2]) coz();
    }

    /* İki cevap da geldiğinde (ya da süre dolduğunda) puanlama. */
    function coz() {
        clearTimeout(D.sureSaat);
        sesDurdur();              /* iki cevap da geldi; tekrar çalmasın */
        cubukDurdur();
        var s = D.sorular[D.i]; if (!s) return;
        var c1 = D.cevap[1], c2 = D.cevap[2];

        /* hız puanı: doğru bilenlerden önce basan */
        var hizli = 0;
        if (c1.dogruMu && c2.dogruMu) hizli = (c1.ms < c2.ms) ? 1 : (c2.ms < c1.ms ? 2 : 0);
        else if (c1.dogruMu) hizli = 1;
        else if (c2.dogruMu) hizli = 2;

        [1, 2].forEach(function (n) {
            var c = D.cevap[n], yan = ekran.querySelector('.dk-y' + n);
            yan.classList.remove('bekliyor');
            yan.querySelectorAll('.dk-sik').forEach(function (b) {
                b.disabled = true;
                /* 'secili' KALKIYOR: seçim çerçevesi oyuncu rengindedir ve
                   doğru/yanlış renginden daha özgül bir kuralla geliyordu;
                   kalırsa doğru şık yeşile dönmüyor. */
                b.classList.remove('secili');
                if (b.dataset.ar === s.kelime.ar) b.classList.add('dogru');
                else if (c.dugme === b) b.classList.add('yanlis');
            });
            if (c.dogruMu) D.puan[n].dogru += DOGRU_PUAN;
            if (hizli === n) D.puan[n].hiz += HIZ_PUAN;
            el(ekran, 'puan', yan).textContent = D.puan[n].dogru + D.puan[n].hiz;
            el(ekran, 'durum', yan).textContent =
                c.bos ? 'Süre doldu' :
                (c.dogruMu
                    ? ('✔ +' + DOGRU_PUAN + (hizli === n ? '  ⚡ +' + HIZ_PUAN : '') +
                       '   (' + (c.ms / 1000).toFixed(1) + ' sn)')
                    : '✘ (' + (c.ms / 1000).toFixed(1) + ' sn)');
        });
        blip(c1.dogruMu || c2.dogruMu ? 'correct' : 'incorrect');

        clearTimeout(D.saat);
        D.saat = setTimeout(function () { D.i++; soruGoster(); }, BEKLE_MS);
    }

    function bitir() {
        clearTimeout(D.saat); clearTimeout(D.sureSaat);
        D.tur++; sesDurdur();
        var t1 = D.puan[1].dogru + D.puan[1].hiz, t2 = D.puan[2].dogru + D.puan[2].hiz;
        var soz = t1 > t2 ? '1. Oyuncu kazandı!' : (t2 > t1 ? '2. Oyuncu kazandı!' : 'Berabere!');
        var satir = function (n, t) {
            return '<div class="dk-son-yan dk-y' + n + '">' +
                   '  <div class="dk-son-ad">' + n + '. Oyuncu</div>' +
                   '  <div class="dk-son-top">' + t + '</div>' +
                   '  <div class="dk-son-ayr">doğruluk ' + D.puan[n].dogru +
                   '    · hız ' + D.puan[n].hiz + '</div></div>';
        };
        el(ekran, 'ortuic').innerHTML =
            '<div class="dk-son-bas">' + soz + '</div>' +
            '<div class="dk-son-alan">' + satir(1, t1) + satir(2, t2) + '</div>' +
            '<div class="dk-son-dugme">' +
            '  <button type="button" class="dk-t" data-rol="tekrar">Tekrar oyna</button>' +
            '  <button type="button" class="dk-t dk-ikincil" data-rol="cik">Menü</button>' +
            '</div>';
        el(ekran, 'ortu').hidden = false;
    }

    function basla(seviye) {
        D.seviye = seviye;
        D.sorular = sorularKur(seviye);
        D.tekrar = tekrarOku();
        D.sureMs = sureHesapla(D.tekrar);
        D.i = 0;
        D.puan = { 1: { dogru: 0, hiz: 0 }, 2: { dogru: 0, hiz: 0 } };
        if (!D.sorular.length) return false;
        el(ekran, 'toplam').textContent = D.sorular.length;
        [1, 2].forEach(function (n) {
            el(ekran, 'puan', ekran.querySelector('.dk-y' + n)).textContent = '0';
        });
        ekranAc();
        soruGoster();
        return true;
    }

    function ekranAc() {
        ['homeScreen', 'gameScreen', 'scoreScreen'].forEach(function (id) {
            var e = document.getElementById(id);
            if (e) e.classList.remove('active');
        });
        ekran.classList.add('active');
    }
    function cik() {
        clearTimeout(D.saat); clearTimeout(D.sureSaat);
        D.tur++; sesDurdur();
        ekran.classList.remove('active');
        var h = document.getElementById('homeScreen');
        if (h) h.classList.add('active');
    }

    /* ---------------- biçem ---------------- */
    function bicemKur() {
        if (document.getElementById('dk-stil')) return;
        var st = document.createElement('style');
        st.id = 'dk-stil';
        /* SAYFA SABİT 16:9 TUVAL: html{font-size:min(100vw/120,100dvh/67.5)}
           ve #gameWrapper 120rem × 67.5rem. Bu yüzden BÜTÜN ölçüler rem;
           px ya da vw yazarsak tuvalle birlikte ölçeklenmez. */
        st.textContent = [
            ':root{--dk-p1:#2f7ad6;--dk-p2:#e05252}',
            '#kapismaScreen{flex-direction:column;gap:1rem;padding:1.4rem 1.6rem;position:relative}',
            '.dk-ust{display:flex;align-items:center;gap:1.2rem;width:100%;flex:none}',
            '.dk-sayac{flex:1;text-align:center;font-size:1.9rem;color:var(--color-text-secondary)}',
            '.dk-geri{font-size:2.2rem;width:4rem;height:4rem;padding:0;line-height:1;',
            '  color:var(--color-text-secondary);background:var(--color-surface)}',
            '.dk-dinle{display:inline-flex;align-items:center;gap:.6rem;font-size:1.5rem;',
            '  padding:.7rem 1.4rem;border-radius:var(--border-radius-small);',
            '  background:var(--color-surface);color:var(--color-accent-1);cursor:pointer;border:none}',
            '.dk-dinle svg{width:2.2rem;height:2.2rem}',
            /* süre çubuğu */
            '.dk-cubuk{width:100%;height:.8rem;border-radius:.4rem;background:#e3edf8;',
            '  overflow:hidden;flex:none}',
            '.dk-cubuk-ic{height:100%;width:100%;background:var(--color-accent-1);border-radius:.4rem}',
            /* iki yarı */
            '.dk-alan{display:flex;flex-direction:row;gap:1.6rem;width:100%;flex:1 1 auto;min-height:0;',
            '  position:relative}',
            '.dk-alan::after{content:"";position:absolute;top:4%;bottom:4%;left:50%;width:.2rem;',
            '  transform:translateX(-50%);background:rgba(0,0,0,.07);border-radius:.2rem}',
            '.dk-yan{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:.9rem;',
            '  border-radius:var(--border-radius-main);padding:1rem 1.2rem;box-sizing:border-box}',
            '.dk-y1{background:rgba(47,122,214,.07)}',
            '.dk-y2{background:rgba(224,82,82,.07)}',
            '.dk-yanbas{display:flex;align-items:center;justify-content:space-between;flex:none}',
            '.dk-ad{font-size:1.6rem}',
            '.dk-y1 .dk-ad{color:var(--dk-p1)} .dk-y2 .dk-ad{color:var(--dk-p2)}',
            '.dk-puan{font-size:2.2rem}',
            '.dk-y1 .dk-puan{color:var(--dk-p1)} .dk-y2 .dk-puan{color:var(--dk-p2)}',
            /* şıklar: tahtadan okunacak kadar büyük, dokunulacak kadar geniş */
            '.dk-siklar{display:grid;grid-template-columns:1fr;gap:.9rem;flex:1 1 auto;min-height:0;',
            '  align-content:stretch}',
            '.dk-sik{display:flex;align-items:center;justify-content:center;width:100%;',
            '  border:.25rem solid transparent;border-radius:var(--border-radius-small);',
            '  background:var(--color-surface);cursor:pointer;padding:.4rem .8rem;min-height:0;',
            '  transition:transform .12s ease,border-color .12s ease}',
            '.dk-y1 .dk-sik{border-color:#d3e4f7} .dk-y2 .dk-sik{border-color:#f7d8d8}',
            '.dk-sik:hover:not(:disabled){transform:translateY(-.2rem)}',
            '.dk-ar{font-family:var(--font-harmattan);font-size:3.4rem;line-height:1.25;',
            '  direction:rtl;unicode-bidi:isolate}',
            '.dk-sik.secili{transform:scale(1.02)}',
            '.dk-y1 .dk-sik.secili{border-color:var(--dk-p1)}',
            '.dk-y2 .dk-sik.secili{border-color:var(--dk-p2)}',
            '.dk-sik.dogru{background:var(--color-correct-light);border-color:var(--color-correct)}',
            '.dk-sik.yanlis{background:var(--color-error-light);border-color:var(--color-error)}',
            /* dinleveyaz.css'te genel bir  :disabled{opacity:.7 !important;
               color:… !important; box-shadow:… !important}  kuralı var. Cevap
               kilitlenince şıklar oradan soluklaşıp griye dönüyordu — çözüm
               ekranı okunmaz hâle geliyordu. Daha özgül seçici + !important
               ile geri alınıyor. */
            '#kapismaScreen .dk-sik:disabled{opacity:1 !important;cursor:default !important;',
            '  color:var(--color-text-primary) !important;background:var(--color-surface) !important;',
            '  box-shadow:none !important;transform:none !important}',
            '#kapismaScreen .dk-sik.dogru:disabled{background:var(--color-correct-light) !important;',
            '  border-color:var(--color-correct) !important}',
            '#kapismaScreen .dk-sik.yanlis:disabled{background:var(--color-error-light) !important;',
            '  border-color:var(--color-error) !important}',
            /* Rakip düşünürken cevap görünmesin diye yarı örtülür. */
            '.dk-yan.bekliyor .dk-siklar{opacity:.35}',
            /* Parantezler ters dönüyordu: satır Arapça şıkların yanında
               nötr sayılıp sağdan sola çözülüyor. direction TEK BAŞINA
               yetmez, yeni bir bidi katmanı gerekir. */
            '.dk-durum{flex:none;min-height:2.2rem;text-align:center;font-size:1.4rem;',
            '  direction:ltr;unicode-bidi:isolate;color:var(--color-text-secondary)}',
            /* sonuç örtüsü */
            '.dk-ortu{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;',
            '  background:rgba(240,247,255,.93);z-index:60;border-radius:var(--border-radius-main)}',
            '.dk-ortu[hidden]{display:none}',
            '.dk-ortu-ic{text-align:center}',
            '.dk-son-bas{font-size:3.4rem;color:var(--color-accent-1);margin-bottom:1.6rem}',
            '.dk-son-alan{display:flex;gap:2.4rem;justify-content:center}',
            '.dk-son-yan{min-width:20rem;padding:1.4rem 2rem;border-radius:var(--border-radius-main);',
            '  background:var(--color-surface)}',
            '.dk-son-ad{font-size:1.5rem;color:var(--color-text-secondary)}',
            '.dk-son-top{font-size:4.4rem;line-height:1.1}',
            '.dk-son-yan.dk-y1 .dk-son-top{color:var(--dk-p1)}',
            '.dk-son-yan.dk-y2 .dk-son-top{color:var(--dk-p2)}',
            '.dk-son-ayr{font-size:1.3rem;color:var(--color-text-secondary)}',
            '.dk-son-dugme{display:flex;gap:1.2rem;justify-content:center;margin-top:1.8rem}',
            '.dk-t{font-family:inherit;font-size:1.6rem;padding:.9rem 2.2rem;border:none;',
            '  border-radius:var(--border-radius-small);background:var(--color-accent-1);',
            '  color:#fff;cursor:pointer}',
            '.dk-ikincil{background:var(--color-surface);color:var(--color-text-secondary)}',
            /* ana ekrandaki düğme */
            '#kapismaBaslaButton{margin-top:.8rem;display:inline-flex;align-items:center;gap:.7rem}',
            '#kapismaBaslaButton .dk-iki{display:inline-flex;gap:.25rem}',
            '#kapismaBaslaButton .dk-iki i{width:.9rem;height:.9rem;border-radius:50%;display:block}',
            '#kapismaBaslaButton .dk-iki i:first-child{background:var(--dk-p1)}',
            '#kapismaBaslaButton .dk-iki i:last-child{background:var(--dk-p2)}'
        ].join('\n');
        document.head.appendChild(st);
    }

    /* ---------------- kurulum ---------------- */

    function kur() {
        var sarmal = document.getElementById('gameWrapper');
        var anaEkran = document.getElementById('homeScreen');
        if (!sarmal || !anaEkran || document.getElementById('kapismaScreen')) return;
        bicemKur();

        ekran = document.createElement('div');
        ekran.id = 'kapismaScreen';
        ekran.className = 'screen';
        ekran.innerHTML = ekranHtml();
        sarmal.appendChild(ekran);

        ekran.addEventListener('click', function (e) {
            var t = e.target;
            var d = t.closest ? t.closest('[data-rol]') : null;
            if (d && d.dataset.rol === 'cik')    { blip('touch'); cik(); return; }
            if (d && d.dataset.rol === 'dinle')  { blip('touch'); elleCal(D.sorular[D.i] && D.sorular[D.i].kelime); return; }
            if (d && d.dataset.rol === 'tekrar') { blip('touch'); basla(D.seviye); return; }
            var s = t.closest ? t.closest('.dk-sik') : null;
            if (s && !s.disabled) {
                var yan = s.closest('.dk-yan');
                if (yan) cevapVer(+yan.dataset.oyuncu, s);
            }
        });

        /* Ana ekrana düğme: mevcut «Başla»nın hemen altına. Mod kutucukları
           (Alıştırma/Sınav/Otomatik) YAZMA modları; yarışma ayrı bir oyun
           olduğu için o üçlünün arasına sokulmadı. */
        var baslaDugme = document.getElementById('baslaButton');
        var d2 = document.createElement('button');
        d2.id = 'kapismaBaslaButton';
        d2.type = 'button';
        d2.className = 'action-btn key-button';
        d2.disabled = true;
        d2.innerHTML = '<span class="dk-iki"><i></i><i></i></span><span>İkili Yarışma</span>';
        if (baslaDugme && baslaDugme.parentNode) {
            baslaDugme.parentNode.insertBefore(d2, baslaDugme.nextSibling);
        } else { anaEkran.appendChild(d2); }

        /* Seviye seçilince «Başla» açılıyor; yarışma düğmesi de onunla
           birlikte açılsın. Seviye seçici kendi dinleyicisini kullanıyor,
           burada ondan SONRA çalışacak ikinci bir dinleyici var. */
        var seviyeKutu = document.getElementById('levelSelect');
        if (seviyeKutu) {
            seviyeKutu.addEventListener('click', function (e) {
                if (e.target.classList && e.target.classList.contains('level-btn')) {
                    d2.disabled = false;
                    d2.dataset.seviye = e.target.dataset.level;
                }
            });
        }
        d2.addEventListener('click', function () {
            var sv = d2.dataset.seviye;
            if (!sv) return;
            blip('touch');
            if (!basla(sv)) { d2.disabled = true; }
        });

        /* Menüye dönüldüğünde seviye seçimi sıfırlanıyor (showHomeScreen);
           yarışma düğmesi de onunla birlikte kapansın. */
        var anaDon = document.getElementById('scoreToHomeButton');
        if (anaDon) anaDon.addEventListener('click', function () {
            d2.disabled = true; d2.dataset.seviye = '';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', kur);
    } else { kur(); }

    window.DvyKapisma = {
        kur: kur, basla: basla, cik: cik,
        durum: D, sorularKur: sorularKur,
        ayar: { soru: SORU, sik: SIK, tekrarAra: TEKRAR_ARA,
                dogruPuan: DOGRU_PUAN, hizPuan: HIZ_PUAN },
        sureHesapla: sureHesapla, tekrarOku: tekrarOku
    };
})();
