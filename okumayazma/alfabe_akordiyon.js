/* =====================================================================
   KISMİ ÖLÇME — «KENDİNİ DENE»            (okumayazma/alfabe_akordiyon.js)
   ---------------------------------------------------------------------
   Sınav sekmesi 20 soruluk TAM bir turdur. Öğretmenin istediği ise konu
   konu ölçme: harfleri yeni tanıttın, hemen orada iki soru sor;
   birleştirmeyi anlattın, sayfadan çıkmadan orada sına.

   NEREDEN AÇILIR: kumandadaki şeritte, ALFABE bölümünün İÇİNDE — her test
   kendi konusunun hemen altında bir alt madde olarak:

     Harf Tanıtımı
     └ Kendini Dene   → okunuşu/yazılışı benzer harfler (tip 1-4)
                        ve benzerlerin eşleştirilmesi (tip 7-8)
     Harf Birleştirme
     └ Kendini Dene   → çizgideki yazılışlar (tip 5-6) ve
                        kelimedeki boşluğa gelen biçim (tip 9)
     Dinle ve Yaz

   Ayrı bir başlık açılmadı: bunlar alfabenin kendi etkinlikleri, konuyu
   anlattığın yerden erişilmeli.

   NASIL AÇILIR: TAM EKRAN. Sınıfa yansıtılacağı için panelin içine
   sıkıştırılmadı; ekranı baştan başa kaplayan bir katman açılıyor ve
   her şey (soru, şıklar, harfler) tahtanın arkasından okunacak puntoda.

   Sorular UYDURULMAZ: hepsi alfabe_sinav.js'in kendi üreteçlerinden
   (AlfabeSinav.uret) gelir ve yine onun denetle()'sinden geçer. Böylece
   «Kendini Dene» ile Sınav sekmesi aynı soruları, aynı kurallarla sorar;
   ikisi ayrışamaz.
   ===================================================================== */
(function () {
    'use strict';
    if (window.AlfabeAkordiyon) return;

    var SORU_SAYISI = 5;          /* bir mini turda kaç soru */

    /* Hangi başlık hangi tipleri sorar. */
    var BOLUMLER = [
        {
            anahtar: 'p1',
            baslik: 'Harf Tanıtımı',
            not: SORU_SAYISI + ' soru · okunuşu ve yazılışı benzeyen harfler',
            tipler: [1, 2, 3, 4, 7, 8],
            ikon: '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                  '<rect x="2.6" y="3.4" width="18.8" height="17.2" rx="2.6" fill="#F7FAFC" stroke="#0E6655" stroke-width="1.3"/>' +
                  '<rect x="5" y="6" width="5.4" height="4.6" rx="1" fill="#3498db"/>' +
                  '<rect x="11.4" y="6" width="5.4" height="4.6" rx="1" fill="#9b59b6"/>' +
                  '<path d="M5.6 14h7.2M5.6 17.2h4.6" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>' +
                  '<circle cx="17.2" cy="16.4" r="3.9" fill="#2ecc71"/>' +
                  '<path d="M15.4 16.5l1.3 1.3 2.4-2.6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {
            anahtar: 'p5',
            baslik: 'Harf Birleştirme',
            not: SORU_SAYISI + ' soru · çizgideki yazılışlar ve boşluk doldurma',
            tipler: [5, 6, 9],
            ikon: '<svg class="tab-ikon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                  '<path d="M3 15.6h18" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>' +
                  '<path d="M4.8 15.3V10a2.3 2.3 0 0 1 4.6 0v5.3" fill="none" stroke="#2ecc71" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
                  '<path d="M9.4 15.3v-2.5a2.2 2.2 0 0 1 4.4 0v2.5" fill="none" stroke="#3498db" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
                  '<circle cx="18.2" cy="16.6" r="3.9" fill="#2ecc71"/>' +
                  '<path d="M16.4 16.7l1.3 1.3 2.4-2.6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        }
    ];

    /* ---------------- küçük yardımcılar ---------------- */

    function kacis(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function tik() {
        if (typeof window.playClick === 'function') { try { window.playClick(); } catch (e) {} }
    }
    function dogruSes() {
        if (typeof window.playCorrect === 'function') { try { window.playCorrect(); } catch (e) {} }
    }
    function yanlisSes() {
        if (typeof window.playWrong === 'function') { try { window.playWrong(); } catch (e) {} }
    }
    function S() { return window.AlfabeSinav; }

    /* Verilen tiplerden, tipleri sırayla gezerek soru havuzu kurar.
       Her soru AlfabeSinav.denetle()'den geçer; geçmeyen atılır. */
    function havuz(tipler, adet) {
        var A = S(); if (!A) return [];
        var liste = [], kac = 0, i = 0;
        var sirali = tipler.slice();
        for (var x = sirali.length - 1; x > 0; x--) {
            var y = Math.floor(Math.random() * (x + 1)), t = sirali[x];
            sirali[x] = sirali[y]; sirali[y] = t;
        }
        while (liste.length < adet && kac++ < adet * 60) {
            var s = A.uret(sirali[i++ % sirali.length]);
            if (A.denetle(s) !== '') continue;
            liste.push(s);
        }
        return liste;
    }

    /* ---------------- soru çizimi ----------------
       Sınıflar bilerek alfabe_sinav.js'inkilerle AYNI (as-sik, as-mark,
       as-ic, as-es…): alfabe.css bu sayfada zaten yüklü, biçim oradan
       geliyor. Puntolar #ak-tam içinde tahtaya göre BÜYÜTÜLÜYOR. */

    function kelimeKutusu(s) {
        if (s.tip !== 9 || !s.kelime || !s.cozum) return '';
        var p = [], i;
        for (i = 0; i < s.cozum.length; i++) {
            p.push(i === s.kelime.b
                ? '<span class="ak-bos">؟</span>'
                : '<span class="ak-par">' + kacis(s.cozum[i].bicim) + '</span>');
        }
        return '<div class="ak-kelime">' + p.join('') +
               '<span class="ak-anlam">(' + kacis(s.kelime.anlam) + ')</span></div>';
    }

    function soruHtml(s, no, toplam) {
        var g = '<div class="ak-sayac">' + no + ' / ' + toplam + '</div>';
        g += kelimeKutusu(s);
        g += '<div class="as-metin ak-metin">' + s.metin + '</div>';
        g += s.ustlik || '';
        if (s.bicim === 'eslestir') {
            g += '<div class="as-esalan"><div class="as-sutun" data-yan="sol">';
            s.ciftler.forEach(function (c, i) {
                g += '<button type="button" class="as-es" data-yan="sol" data-h="' +
                     kacis(c.sol) + '" data-i="' + i + '">' + kacis(c.sol) + '</button>';
            });
            g += '</div><div class="as-sutun" data-yan="sag">';
            s.saglar.forEach(function (h) {
                g += '<button type="button" class="as-es" data-yan="sag" data-h="' +
                     kacis(h) + '">' + kacis(h) + '</button>';
            });
            g += '</div></div>';
        } else {
            g += '<div class="as-siklar ak-siklar">';
            s.siklar.forEach(function (x, i) {
                g += '<button type="button" class="as-sik" data-i="' + i + '">' +
                     '<span class="as-mark">' + 'ABCD'.charAt(i) + '</span>' +
                     '<span class="as-ic">' + x.html + '</span></button>';
            });
            g += '</div>';
        }
        g += '<div class="as-geri-bildirim ak-bildirim" data-rol="bildirim"></div>';
        g += '<div class="ak-alt">' +
             '<button type="button" class="ak-t" data-rol="sonraki" hidden>Sonraki ›</button>' +
             '</div>';
        return g;
    }

    function sonucHtml(dogru, toplam) {
        var yuzde = Math.round(100 * dogru / toplam);
        var soz = yuzde >= 80 ? 'Bu konuyu biliyorsun.'
                : yuzde >= 50 ? 'Fena değil — bir tur daha dene.'
                : 'Tabloya bir daha bak, sonra tekrar gel.';
        return '<div class="ak-sonuc">' +
               '  <div class="ak-sonsay"><b>' + dogru + ' / ' + toplam + '</b> doğru' +
               '    <span class="ak-yuzde">%' + yuzde + '</span></div>' +
               '  <div class="ak-sonsoz">' + soz + '</div>' +
               '  <div class="ak-alt">' +
               '    <button type="button" class="ak-t" data-rol="yeniden">Yeniden dene</button>' +
               '    <button type="button" class="ak-t ak-ikincil" data-rol="kapat">Kapat</button>' +
               '  </div></div>';
    }

    function bildir(sahne, hal, yazi) {
        var b = sahne.querySelector('[data-rol="bildirim"]');
        if (!b) return;
        var bas = hal === 'iyi' ? '✔ Doğru.' : (hal === 'orta' ? '◐ Tamamlandı.' : '✘ Yanlış.');
        b.className = 'as-geri-bildirim ak-bildirim as-' + hal;
        b.innerHTML = yazi ? (bas + ' ' + yazi) : bas;
    }

    /* ---------------- tam ekran katman ---------------- */

    var katman = null, sahne = null, basEl = null, notEl = null;
    var aktif = null;          /* o an açık bölümün durumu */
    var durumlar = {};         /* {p1: {...}, p5: {...}} */

    function katmanKur() {
        if (katman) return;
        katman = document.createElement('div');
        katman.id = 'ak-tam';
        katman.hidden = true;
        katman.innerHTML =
            '<div class="ak-cerceve">' +
            '  <header class="ak-bas">' +
            '    <span class="ak-bas-yazi"><b data-rol="baslik">Kendini Dene</b>' +
            '      <span class="ak-not" data-rol="not"></span></span>' +
            '    <button type="button" class="ak-kapa" data-rol="kapat" aria-label="Kapat">✕</button>' +
            '  </header>' +
            '  <div class="ak-sahne" data-rol="sahne"></div>' +
            '</div>';
        document.body.appendChild(katman);
        sahne = katman.querySelector('[data-rol="sahne"]');
        basEl = katman.querySelector('[data-rol="baslik"]');
        notEl = katman.querySelector('[data-rol="not"]');

        katman.addEventListener('click', function (e) {
            var t = e.target; if (!t || !t.closest) return;
            var d = t.closest('[data-rol]');
            var rol = d && d.dataset ? d.dataset.rol : '';
            if (rol === 'kapat')   { tik(); kapat(); return; }
            if (rol === 'sonraki') { tik(); aktif.i++; soruGoster(); return; }
            if (rol === 'yeniden') { tik(); turBaslat(); return; }
            var s = aktif && aktif.havuz[aktif.i];
            if (!s) return;
            var dg;
            if ((dg = t.closest('.as-sik')) && s.bicim === 'test')      { tik(); testCevap(s, dg); return; }
            if ((dg = t.closest('.as-es'))  && s.bicim === 'eslestir')  { tik(); esCevap(s, dg); return; }
        });

        /* Esc kapatır. #p5 belge düzeyinde ok/boşluk/enter'ı yutuyor
           (alfabe_birlestir.js); katman açıkken bu tuşlar oraya ULAŞMASIN,
           yoksa arkadaki slayt kayıyor. */
        document.addEventListener('keydown', function (e) {
            if (katman.hidden) return;
            if (e.key === 'Escape') { kapat(); return; }
            e.stopPropagation();
        }, true);
    }

    /* ---------------- tur mantığı ---------------- */

    function soruGoster() {
        var s = aktif.havuz[aktif.i];
        if (!s) { sahne.innerHTML = sonucHtml(aktif.dogru, aktif.havuz.length || SORU_SAYISI); return; }
        aktif.cevapli = false; aktif.esSol = null; aktif.esDogru = 0; aktif.esHata = 0;
        sahne.innerHTML = soruHtml(s, aktif.i + 1, aktif.havuz.length);
    }

    function turBaslat() {
        aktif.havuz = havuz(aktif.tipler, SORU_SAYISI);
        aktif.i = 0; aktif.dogru = 0;
        if (!aktif.havuz.length) {
            sahne.innerHTML = '<div class="ak-sonuc"><div class="ak-sonsoz">' +
                'Soru üretilemedi — sayfayı yenileyip tekrar dener misin?</div></div>';
            return;
        }
        soruGoster();
    }

    function testCevap(s, dugme) {
        if (aktif.cevapli) return;
        aktif.cevapli = true;
        var secilen = s.siklar[+dugme.getAttribute('data-i')];
        var hepsi = sahne.querySelectorAll('.as-sik');
        for (var j = 0; j < hepsi.length; j++) {
            hepsi[j].disabled = true;
            if (s.siklar[j].dogru) hepsi[j].classList.add('as-dogru');
        }
        if (!secilen.dogru) dugme.classList.add('as-yanlis');
        if (secilen.dogru) { aktif.dogru++; dogruSes(); } else { yanlisSes(); }
        bildir(sahne, secilen.dogru ? 'iyi' : 'kotu');
        var ileri = sahne.querySelector('[data-rol="sonraki"]');
        if (ileri) ileri.hidden = false;
    }

    /* Eşleştirme kuralı Sınav sekmesindekiyle aynı: dördünü de bulmak
       gerekir, hatalı denemesi olan soru puan getirmez. */
    function esCevap(s, dugme) {
        if (dugme.classList.contains('as-kilit')) return;
        var A = S(); if (!A) return;
        if (dugme.getAttribute('data-yan') === 'sol') {
            var eski = sahne.querySelector('.as-es.as-secili');
            if (eski) eski.classList.remove('as-secili');
            dugme.classList.add('as-secili');
            aktif.esSol = dugme; return;
        }
        if (!aktif.esSol) return;
        var solH = aktif.esSol.getAttribute('data-h'), sagH = dugme.getAttribute('data-h');
        var hrt = (s.tip === 7) ? A.haritalar.ses : A.haritalar.yazi;
        if (hrt[solH] !== undefined && hrt[solH] === hrt[sagH] && solH !== sagH) {
            aktif.esDogru++;
            aktif.esSol.classList.remove('as-secili');
            aktif.esSol.classList.add('as-kilit', 'as-dogru');
            dugme.classList.add('as-kilit', 'as-dogru');
            aktif.esSol.setAttribute('data-cift', aktif.esDogru);
            dugme.setAttribute('data-cift', aktif.esDogru);
            aktif.esSol = null;
            if (aktif.esDogru >= 4) {
                aktif.cevapli = true;
                if (!aktif.esHata) { aktif.dogru++; dogruSes(); }
                bildir(sahne, aktif.esHata ? 'orta' : 'iyi',
                    aktif.esHata ? ('Dördünü de buldun ama ' + aktif.esHata +
                                    ' hatalı denemen oldu; bu soru puan getirmedi.')
                                 : 'Dört eşleşmenin hepsi doğru.');
                var ileri = sahne.querySelector('[data-rol="sonraki"]');
                if (ileri) ileri.hidden = false;
            }
        } else {
            aktif.esHata++; yanlisSes();
            dugme.classList.add('as-titre');
            setTimeout(function () { dugme.classList.remove('as-titre'); }, 420);
            aktif.esSol.classList.remove('as-secili');
            aktif.esSol = null;
        }
    }

    /* ---------------- aç / kapat ---------------- */

    function ac(anahtar) {
        katmanKur(); bicemKur();
        var b = null, i;
        for (i = 0; i < BOLUMLER.length; i++) if (BOLUMLER[i].anahtar === anahtar) b = BOLUMLER[i];
        if (!b) return false;
        if (!durumlar[anahtar]) {
            durumlar[anahtar] = { anahtar: anahtar, tipler: b.tipler, havuz: [], i: 0,
                                  dogru: 0, cevapli: false, esSol: null, esDogru: 0, esHata: 0 };
        }
        aktif = durumlar[anahtar];
        basEl.textContent = 'Kendini Dene — ' + b.baslik;
        notEl.textContent = b.not;
        katman.hidden = false;
        document.body.classList.add('ak-acik');
        turBaslat();
        return true;
    }
    function kapat() {
        if (!katman) return;
        katman.hidden = true;
        document.body.classList.remove('ak-acik');
        if (sahne) sahne.innerHTML = '';
    }

    /* ---------------- biçem ----------------
       TAHTAYA YANSITILACAK: katmanın içindeki her ölçü ekran yüksekliğine
       bağlı (vh) ve alt sınırı yüksek tutuldu. alfabe.css'teki as-* ölçüleri
       panel içi sınav için ayarlanmış; burada hepsi büyütülüyor. */
    function bicemKur() {
        if (document.getElementById('ak-stil')) return;
        var st = document.createElement('style');
        st.id = 'ak-stil';
        st.textContent = [
            '#ak-tam{position:fixed;inset:0;z-index:9000;background:#f4f9fb;',
            '  display:flex;align-items:stretch;justify-content:center}',
            '#ak-tam[hidden]{display:none}',
            'body.ak-acik{overflow:hidden}',
            '.ak-cerceve{display:flex;flex-direction:column;width:100%;height:100%;',
            '  padding:1.4vh 2vw 2vh;box-sizing:border-box;gap:1vh}',
            '.ak-bas{display:flex;align-items:center;gap:1.4rem;flex:none;',
            '  border-bottom:2px solid #dfeaf0;padding-bottom:1vh}',
            '.ak-bas-yazi{display:flex;flex-direction:column;flex:1;min-width:0}',
            '.ak-bas b{font-size:clamp(20px,3.2vh,40px);color:#0E6655;line-height:1.15}',
            '.ak-not{font-size:clamp(13px,1.9vh,22px);color:#7b8b97;line-height:1.2}',
            '.ak-kapa{flex:none;width:clamp(44px,6.4vh,74px);height:clamp(44px,6.4vh,74px);',
            '  border-radius:50%;border:2px solid #cfe0e8;background:#fff;color:#0E6655;',
            '  font-size:clamp(20px,3vh,34px);line-height:1;cursor:pointer;font-family:inherit}',
            '.ak-kapa:hover{background:#eaf6f2}',
            '.ak-sahne{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;',
            '  align-items:center;justify-content:center;gap:1vh;overflow:auto;padding:1vh 0}',
            '.ak-sayac{font-size:clamp(14px,2.1vh,26px);color:#94a3b8;flex:none}',

            /* ---- soru metni ---- */
            '#ak-tam .as-metin{font-size:clamp(20px,4.4vh,52px);padding:1vh 2vw;margin:0;',
            '  max-width:none;text-align:center;line-height:1.24;flex:none}',
            '#ak-tam .as-ipucu{font-size:clamp(14px,2.3vh,28px);text-align:center;flex:none}',

            /* ---- şıklar: iki sütun, kalan yüksekliği paylaşır ---- */
            '#ak-tam .as-siklar{width:min(1600px,96vw);max-width:none;gap:1.6vh 2vw;',
            '  grid-template-columns:repeat(2,minmax(0,1fr));flex:1 1 auto;min-height:0;',
            '  align-content:stretch}',
            '#ak-tam .as-sik{min-height:0;padding:1vh 1.4vw;gap:1.4vw}',
            '#ak-tam .as-mark{width:clamp(32px,4.6vh,56px);height:clamp(32px,4.6vh,56px);',
            '  font-size:clamp(14px,2.2vh,26px);flex:none}',
            /* SATIR + SARMA: harf çifti soruları (د — ج) yan yana durmalı;
               sütun yapınca ayracın altına iniyorlardı. Çizgi sorusunda
               harfin Türkçe adı .as-etiket'tir ve alfabe.css'te width:100%
               taşır — sarmalı satırda kendiliğinden alt satıra geçer. */
            '#ak-tam .as-ic{flex:1;display:flex;flex-direction:row;flex-wrap:wrap;',
            '  align-items:center;justify-content:center;gap:.25em;min-width:0}',
            /* Arapça ögeler — tahtanın arkasından okunacak punto */
            '#ak-tam .as-h{font-size:clamp(34px,9vh,104px)}',
            '#ak-tam .as-uclu{font-size:clamp(30px,8vh,92px)}',
            '#ak-tam .as-bic{font-size:clamp(30px,8vh,92px)}',
            '#ak-tam .as-bic-b{font-size:clamp(36px,9.5vh,110px)}',
            '#ak-tam .as-ayrac{font-size:clamp(22px,5vh,60px)}',
            '#ak-tam .as-etiket{font-size:clamp(13px,2vh,24px);margin-top:.2vh}',
            '#ak-tam .as-esalan{gap:3vw;flex:1 1 auto;min-height:0;align-items:center}',
            '#ak-tam .as-es{font-size:clamp(30px,8vh,96px);min-width:clamp(80px,12vw,180px);',
            '  padding:.6vh 1.2vw}',

            /* ---- 9. tip: boşluklu kelime ---- */
            '.ak-kelime{display:flex;flex-direction:row;direction:rtl;unicode-bidi:isolate;',
            '  align-items:center;justify-content:center;gap:.22em;',
            '  font-size:clamp(34px,10vh,120px);flex:none;flex-wrap:wrap}',
            '.ak-par{display:inline-block}',
            '.ak-bos{display:inline-block;color:#16A085;opacity:.65}',
            '.ak-anlam{font-size:clamp(13px,2vh,24px);color:#7b8b97;direction:ltr;',
            '  unicode-bidi:isolate;margin-inline-start:.5em}',

            /* ---- geri bildirim + düğmeler ---- */
            '.ak-bildirim{min-height:1.4em;text-align:center;flex:none;',
            '  font-size:clamp(15px,2.6vh,32px)}',
            '.ak-alt{display:flex;gap:1.2rem;justify-content:center;flex:none;flex-wrap:wrap}',
            '.ak-t{font-family:inherit;font-size:clamp(16px,2.6vh,30px);',
            '  padding:1vh 2.4vw;border-radius:999px;border:2px solid #16A085;',
            '  background:#16A085;color:#fff;cursor:pointer}',
            '.ak-t:hover{filter:brightness(1.06)}',
            '.ak-ikincil{background:#fff;color:#0E6655}',
            '.ak-sonuc{text-align:center;display:flex;flex-direction:column;gap:1.6vh}',
            '.ak-sonsay{font-size:clamp(26px,6vh,76px);color:#0E6655}',
            '.ak-yuzde{display:inline-block;margin-inline-start:.4em;background:#E6FAF5;',
            '  color:#0E6655;border-radius:999px;padding:0 .4em;font-size:.7em}',
            '.ak-sonsoz{font-size:clamp(15px,2.6vh,32px);color:#7b8b97}',

            /* ---- kumandadaki başlık ---- */
            /* KUMANDADAKİ TEST DÜĞMELERİ — konunun ALT MADDESİ gibi durur:
               içeri girintili, daha sönük zeminli ve soluna küçük bir
               bağlantı çizgisi konmuş. Panel sekmeleriyle karışmasın
               diye bilerek farklı; .active de almıyorlar. */
            '.nav-tabs .ak-tetik{position:relative;margin-left:20px;width:calc(100% - 20px);',
            /* Zemin ana sekmeden (.62) biraz sönük ama okunur: .42 denendi,
               arkadaki harf tablosunun üstünde yazı zor seçiliyordu. */
            '  background:rgba(6,62,51,.56);font-size:.95rem;padding-top:5px;padding-bottom:5px}',
            '.nav-tabs .ak-tetik:hover{background:rgba(6,62,51,.72)}',
            '.nav-tabs .ak-tetik::before{content:"";position:absolute;left:-13px;top:50%;',
            '  width:11px;height:2px;background:rgba(255,255,255,.45);border-radius:1px}',
            '.nav-tabs .ak-tetik .tab-ikon{width:19px;height:19px}',
            '.nav-tabs .ak-tetik .tab-ad{opacity:.92}',
            /* Dar ekranda tek sütun: iki büyük şık yan yana sığmıyor. */
            '@media (max-width:820px){',
            '  #ak-tam .as-siklar{grid-template-columns:1fr}',
            '  #ak-tam .as-h,#ak-tam .as-uclu,#ak-tam .as-bic{font-size:clamp(28px,6vh,60px)}',
            '}'
        ].join('\n');
        document.head.appendChild(st);
    }

    /* ---------------- kumandaya yerleştir ----------------
       Testler ALFABE bölümünün İÇİNDE durur — ayrı bir başlık altında
       değil. Her test KENDİ konusunun hemen altına giriyor:

         Harf Tanıtımı
         └ Kendini Dene            (tip 1-4, 7-8)
         Harf Birleştirme
         └ Kendini Dene            (tip 5-6, 9)
         Dinle ve Yaz

       Böylece öğretmen konuyu anlattığı yerden, listede aşağı inmeden
       sınayabiliyor. Bu düğmeler ui.tab ÇAĞIRMAZ: panel değiştirmezler,
       tam ekran katmanı açarlar — bu yüzden .active işareti de almazlar
       ve konunun kendi sekmesi seçili kalır. */
    function seritKur() {
        var serit = document.querySelector('.nav-tabs');
        if (!serit) return;
        var gruplar = serit.querySelectorAll('.tab-grup');
        if (!gruplar.length) return;
        var alfabe = gruplar[0];                    /* ilk bölüm: «Alfabe» */
        for (var i = 0; i < gruplar.length; i++) {
            var ad = gruplar[i].querySelector('.tab-grup-ad');
            if (ad && ad.textContent.trim() === 'Alfabe') { alfabe = gruplar[i]; break; }
        }
        var sira = alfabe.querySelector('.tab-grup-sira') || alfabe;
        if (sira.querySelector('.ak-tetik')) return;

        BOLUMLER.forEach(function (b) {
            var d = document.createElement('button');
            d.type = 'button';
            d.className = 'tab-trigger ak-tetik';
            d.dataset.ak = b.anahtar;
            d.title = 'Kendini Dene — ' + b.baslik;
            d.setAttribute('aria-label', 'Kendini Dene — ' + b.baslik);
            d.innerHTML = b.ikon + '<span class="tab-ad">Kendini Dene</span>';
            /* Konunun kendi sekmesini bul: ui.tab(event,'p1') / 'p5'. */
            var konu = null, hepsi = sira.querySelectorAll('.tab-trigger');
            for (var j = 0; j < hepsi.length; j++) {
                var t = hepsi[j].getAttribute('onclick') || '';
                if (t.indexOf("'" + b.anahtar + "'") >= 0) { konu = hepsi[j]; break; }
            }
            if (konu && konu.parentNode) konu.parentNode.insertBefore(d, konu.nextSibling);
            else sira.appendChild(d);
        });

        sira.addEventListener('click', function (e) {
            var d = e.target.closest ? e.target.closest('.ak-tetik') : null;
            if (!d) return;
            e.stopPropagation();
            tik();
            ac(d.dataset.ak);
        });
    }

    function basla() {
        bicemKur(); katmanKur(); seritKur();
        /* Şerit geç kurulursa birkaç kez daha dene. */
        var kac = 0;
        var saat = setInterval(function () {
            seritKur();
            if (++kac > 10 || document.querySelector('.nav-tabs .ak-tetik')) clearInterval(saat);
        }, 400);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', basla);
    } else { basla(); }

    window.AlfabeAkordiyon = {
        kur: basla,
        ac: ac, kapat: kapat,
        havuz: havuz,
        durumlar: durumlar,      /* {p1: {...}, p5: {...}} — açılınca dolar */
        bolumler: BOLUMLER,
        soruSayisi: SORU_SAYISI,
        katman: function () { return katman; }
    };
})();
