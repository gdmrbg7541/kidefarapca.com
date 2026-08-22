/* ===========================================================================
   BİLGİ YARIŞMASI — CANLI TAHTA                    (kalıplar tablosu paneli)
   ---------------------------------------------------------------------------
   Sorunun geçtiği kalıplar tablosunu, TABLONUN KENDİ DOSYASINI kullanarak
   tahtada gösterir. Tablo bir iframe içinde açılır; iki sayfa ayrı JS
   bağlamında kalır ve aralarında yalnız postMessage konuşur:

       { kidef:'biy-tahta', is:'soru'|'cevap'|'sifirla', kok, ref }

   Alıcı taraf: sarf/yarismakopru.js (kaliplartablosu.html'de yüklü).

   MOTORA DOKUNUŞ: tek satır. bilgiyarismasikacom.js → _renderAdminOyun()
   içinden BIYTahta.durum(oda, soru) çağrılır; gerisini bu dosya yapar.
   Soru verisinde "tahta": {kok, ref} alanı yoksa panel hiç görünmez, yani
   diğer konular (6. sınıf, i'rab, alfabe …) bundan etkilenmez.

   Üretici: oyunlar/uret_kaliplar.py  →  oyunlar/biy_kaliplar.js
   =========================================================================== */
(function () {
    'use strict';

    var TABLO = 'kaliplartablosu.html?nomobil';
    /* ?nomobil ŞART: kaliplartablosu.html <head>'inde innerWidth <= 768 ise
       kaliplartablosumobil.html'e location.replace() yapıyor. iframe dar
       olduğu için mobil sürüme kaçardı; mobil sürümde activateBoxByRef
       başka bir seçiciyle çalışıyor ve sekme değiştirmiyor. */

    var el = null;      // panel kökü
    var cerceve = null; // iframe
    var tus = null;     // yüzen aç/kapa düğmesi
    var acik = false;
    var hazir = false;
    var sonAnahtar = '';    // "index:faz" — aynı durumu iki kez göndermeyelim
    var ayriPencere = null;

    /* ---------------------------------------------------------------- */
    /* Stil — sayfanın CSS'ine karışmasın diye hepsi buradan            */
    /* ---------------------------------------------------------------- */
    function stil() {
        if (document.getElementById('biyTahtaStil')) return;
        var s = document.createElement('style');
        s.id = 'biyTahtaStil';
        s.textContent =
            '#biyTahtaTus{position:fixed;left:14px;bottom:14px;z-index:99990;' +
            'display:none;align-items:center;gap:8px;padding:11px 16px;border:0;' +
            'border-radius:999px;background:#0E6655;color:#fff;cursor:pointer;' +
            "font:800 15px/1 'Nunito','Segoe UI',sans-serif;" +
            'box-shadow:0 6px 18px rgba(0,0,0,.28)}' +
            '#biyTahtaTus:hover{background:#12836b}' +
            '#biyTahtaTus.acik{background:#B03A2E}' +
            '#biyTahta{position:fixed;inset:0;z-index:99991;display:none;' +
            'flex-direction:column;background:#0F2A43}' +
            '#biyTahta.acik{display:flex}' +
            '#biyTahtaBas{display:flex;align-items:center;gap:10px;padding:8px 12px;' +
            'background:#0F2A43;color:#fff;' +
            "font:700 14px/1.2 'Nunito','Segoe UI',sans-serif;flex:0 0 auto}" +
            '#biyTahtaBas .ad{flex:1 1 auto;opacity:.92}' +
            '#biyTahtaBas .durum{opacity:.65;font-weight:600;font-size:12.5px}' +
            '#biyTahtaBas button{border:0;border-radius:9px;padding:8px 13px;' +
            'cursor:pointer;background:rgba(255,255,255,.14);color:#fff;' +
            "font:700 13px/1 'Nunito','Segoe UI',sans-serif}" +
            '#biyTahtaBas button:hover{background:rgba(255,255,255,.26)}' +
            '#biyTahta iframe{flex:1 1 auto;width:100%;border:0;background:#fff}';
        document.head.appendChild(s);
    }

    /* ---------------------------------------------------------------- */
    /* DOM                                                               */
    /* ---------------------------------------------------------------- */
    function kur() {
        if (el) return;
        stil();

        tus = document.createElement('button');
        tus.id = 'biyTahtaTus';
        tus.type = 'button';
        tus.innerHTML = '<span>🪟</span><span class="yazi">Tahtada göster</span>';
        tus.onclick = function () { acik ? API.kapat() : API.ac(); };
        document.body.appendChild(tus);

        el = document.createElement('div');
        el.id = 'biyTahta';
        el.innerHTML =
            '<div id="biyTahtaBas">' +
              '<span class="ad">📐 Kalıplar Tablosu — canlı tahta</span>' +
              '<span class="durum" id="biyTahtaDurum">yükleniyor…</span>' +
              '<button type="button" id="biyTahtaPencere">Ayrı pencere</button>' +
              '<button type="button" id="biyTahtaKapat">Kapat ✕</button>' +
            '</div>';
        cerceve = document.createElement('iframe');
        cerceve.id = 'biyTahtaCerceve';
        cerceve.setAttribute('title', 'Kalıplar Tablosu');
        cerceve.setAttribute('loading', 'lazy');
        el.appendChild(cerceve);
        document.body.appendChild(el);

        el.querySelector('#biyTahtaKapat').onclick = function () { API.kapat(); };
        el.querySelector('#biyTahtaPencere').onclick = function () { API.pencere(); };

        window.addEventListener('message', function (e) {
            if (!e || !e.data || typeof e.data !== 'object') return;
            if (e.origin && e.origin !== location.origin) return;
            if (e.data.kidef === 'biy-tahta-hazir') {
                hazir = !!e.data.tamam;
                durumYaz(hazir ? 'hazır' : 'tablo yüklenemedi');
                if (hazir) { sonAnahtar = ''; sur(); }   // açılışta o anki soruyu bas
            }
        });
    }

    function durumYaz(m) {
        var d = document.getElementById('biyTahtaDurum');
        if (d) d.textContent = m;
    }

    /* ---------------------------------------------------------------- */
    /* Mesaj gönderimi                                                   */
    /* ---------------------------------------------------------------- */
    function hedefler() {
        var h = [];
        if (acik && cerceve && cerceve.contentWindow) h.push(cerceve.contentWindow);
        if (ayriPencere && !ayriPencere.closed) h.push(ayriPencere);
        return h;
    }

    function yolla(m) {
        hedefler().forEach(function (w) {
            try { w.postMessage(m, location.origin); } catch (e) {}
        });
    }

    /* ---------------------------------------------------------------- */
    /* Durum takibi — motorun tek çağrı noktası buraya bağlanır          */
    /* ---------------------------------------------------------------- */
    var sonOda = null, sonSoru = null;

    function tahtaVeri(soru) {
        var t = soru && soru.tahta;
        if (!t || typeof t !== 'object') return null;
        if (!t.kok && (t.ref === undefined || t.ref === null)) return null;
        return t;
    }

    function sur() {
        var t = tahtaVeri(sonSoru);
        if (!hedefler().length) return;
        if (!sonOda || sonOda.durum === 'bitti' || !t) {
            if (sonAnahtar !== 'bos') { yolla({ kidef: 'biy-tahta', is: 'sifirla' }); sonAnahtar = 'bos'; }
            return;
        }
        var faz = (sonOda.faz === 'sonuc') ? 'cevap' : 'soru';
        var anahtar = (sonOda.aktifIndex || 0) + ':' + faz;
        if (anahtar === sonAnahtar) return;
        sonAnahtar = anahtar;
        yolla({ kidef: 'biy-tahta', is: faz, kok: t.kok || null,
                ref: (t.ref === undefined ? null : t.ref) });
    }

    var API = {
        /* Motorun çağırdığı TEK fonksiyon. */
        durum: function (oda, soru) {
            kur();
            sonOda = oda || null; sonSoru = soru || null;
            var t = tahtaVeri(sonSoru);
            /* Düğme yalnız tahtası olan sorularda görünür; böylece diğer
               konularda ekranda hiçbir şey değişmez. */
            tus.style.display = t ? 'inline-flex' : 'none';
            sur();
        },
        ac: function () {
            kur();
            acik = true;
            el.classList.add('acik');
            tus.classList.add('acik');
            tus.querySelector('.yazi').textContent = 'Tahtayı kapat';
            if (!cerceve.getAttribute('src')) {
                durumYaz('yükleniyor…');
                cerceve.setAttribute('src', TABLO);
            } else { sonAnahtar = ''; sur(); }
        },
        kapat: function () {
            acik = false;
            if (el) el.classList.remove('acik');
            if (tus) { tus.classList.remove('acik');
                       tus.querySelector('.yazi').textContent = 'Tahtada göster'; }
        },
        /* Genişletilmiş ekran kullanan öğretmen için: tabloyu ayrı pencereye
           al, kumandayı dizüstünde tut. Panel kapansa da pencere sürülmeye
           devam eder. */
        pencere: function () {
            try {
                ayriPencere = window.open(TABLO, 'biyTahtaPencere',
                    'width=1400,height=900,menubar=no,toolbar=no');
                if (ayriPencere) { API.kapat(); sonAnahtar = ''; setTimeout(sur, 2500); }
            } catch (e) {}
        },
        acikMi: function () { return acik || !!(ayriPencere && !ayriPencere.closed); }
    };

    window.BIYTahta = API;
})();
