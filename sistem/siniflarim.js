/* =====================================================================
   KİDEF · ANASAYFADA "SINIFLARIM" KATEGORİSİ    (sistem/siniflarim.js)
   ---------------------------------------------------------------------
   Öğretmen (06.10.2026): "öğretmen giriş yaptığı zaman imam hatip
   kategorisi gibi bi kategori görünsün anasayfada, + butonu olsun,
   öğretmen basınca 5-10 arası sınıf ekleyebilme, birden fazla kurum
   ekleyebilme, 5-10 arası sınıf girdiğinde her sınıfın listelerine
   ulaşabilme gibi özelliklere sahip olsun — yani sınıflara header
   yerine galeri ve site güncellemelerinin üstünde bi kategori olarak
   hızlıca ulaşabilsin."

   NE YAPAR
     · Anasayfanın EN ÜSTÜNE, "Güncellemeler ve Galeri" bölümünden önce
       bir kategori koyar: başlık + kurum kutuları + sınıf kartları.
     · Sınıf kartına basınca o sınıfın listelerine gider
       (llOkulSinifSec → Listelerim, öğrenciler sekmesi).
     · "+" tuşu 5'ten 10'a seviyeleri gösterir; seviye seçilip şube
       yazılınca o kurumda seviye yoksa açılır, sınıf altına eklenir.
     · "+ Kurum" yeni kurum açar (addKurum); birden çok kurum yan yana.
     · YALNIZ öğretmen ve yöneticiye görünür. Rol Firestore'dan asenkron
       geldiği için kısa aralıklarla yoklanır (sistem/okultusu.js ile
       aynı yöntem) — rol geç gelse de kategori çıkar.

   VERİ: kendi yapısını KURMAZ. Okul penceresi, sınıf seçici ve bu
   kategori aynı `data` üzerinde çalışır (data.kurumlar / data.levels /
   levels[x].classes) ve aynı save() ile yazar. Biri değişince öbürü de
   doğru olur; save() bitiminde bu kategori kendini yeniden çizer.

   BAŞLIKTAKİ OKUL SİMGESİ DURUYOR: bu kategori anasayfadaki hızlı yol,
   okul simgesi ise ders ekranı/sınav paneli gibi başka sayfalardayken
   erişim yolu.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSiniflarim) return;

    var BOLUM_ID = 'siniflarim';
    var SEVIYELER = [5, 6, 7, 8, 9, 10];

    function kac(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* ----------------------------------------------------- ROL KAPISI */
    function misafirMi() {
        try {
            if (typeof appState === 'undefined') return true;
            if (appState.currentUser === 'Misafir Öğrenci') return true;
            var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
            if (u && u.isAnonymous) return true;
            return !u && !appState.userRole;
        } catch (e) { return false; }
    }
    function ogretmenMi() {
        try {
            var r = (typeof appState !== 'undefined' && appState.userRole) || '';
            if (r === 'teacher' || r === 'admin') return true;
            if (window.KidefRol && typeof window.KidefRol.ogretmenMi === 'function') {
                if (window.KidefRol.ogretmenMi(r)) return true;
                if (typeof window.KidefRol.onbellekOku === 'function') {
                    var o = window.KidefRol.onbellekOku();
                    if (o && window.KidefRol.ogretmenMi(o)) return true;
                }
            }
        } catch (e) { }
        return false;
    }
    function gorunurMu() { return !misafirMi() && ogretmenMi(); }

    /* Davet kutusundaki büyük okul: anasayfadaki küçük okul simgesinin
       aynısı değil — kapısı ve bayrağı belirgin, "burası senin okulun"
       desin diye. */
    var BUYUK_OKUL_SVG =
        '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        '<path d="M24 4l19 9.6V17H5v-3.4z" fill="#D84315"/>' +
        '<rect x="8" y="17" width="32" height="25" rx="2.4" fill="#fff" stroke="#C7D0DA" stroke-width="1.6"/>' +
        '<rect x="12" y="21" width="7" height="6" rx="1.2" fill="#FDEBD0" stroke="#E0B37A" stroke-width="1.2"/>' +
        '<rect x="29" y="21" width="7" height="6" rx="1.2" fill="#FDEBD0" stroke="#E0B37A" stroke-width="1.2"/>' +
        '<rect x="19" y="30" width="10" height="12" rx="1.4" fill="#EAF6F3" stroke="#16A085" stroke-width="1.4"/>' +
        '<circle cx="26.4" cy="36" r="1" fill="#16A085"/>' +
        '<path d="M24 4V1.4M24 1.4h5.2l-1.3 1.8 1.3 1.8H24" fill="#16A085"' +
        ' stroke="#16A085" stroke-width="1.1" stroke-linejoin="round"/>' +
        '</svg>';

    /* -------------------------------------------------------- BİÇİMLER */
    function stilKur() {
        if (document.getElementById('sn-stil')) return;
        var s = document.createElement('style');
        s.id = 'sn-stil';
        s.textContent = [
            '#' + BOLUM_ID + '{ display:none; }',
            '#' + BOLUM_ID + '.gor{ display:block; }',
            '#' + BOLUM_ID + ' .sn-kutu{ display:flex; flex-direction:column; gap:14px; }',
            /* kurum kutusu */
            '#' + BOLUM_ID + ' .sn-kurum{ background:#fff; border:1px solid #E3E8EF; border-radius:16px;',
            '  padding:14px 16px 16px; box-shadow:0 6px 18px rgba(31,36,48,.07); }',
            '#' + BOLUM_ID + ' .sn-kurum-bas{ display:flex; align-items:center; gap:9px; margin:0 0 12px; }',
            '#' + BOLUM_ID + ' .sn-kurum-bas svg{ width:22px; height:22px; flex:0 0 auto; }',
            '#' + BOLUM_ID + ' .sn-kurum-ad{ font-weight:800; color:#1F2430; font-size:1.02rem; }',
            '#' + BOLUM_ID + ' .sn-kurum-say{ margin-inline-start:auto; font-size:.78rem; font-weight:800;',
            '  color:#8A93A0; background:#F2F5F9; border-radius:999px; padding:3px 10px; }',
            /* sınıf kartları */
            '#' + BOLUM_ID + ' .sn-siniflar{ display:flex; flex-wrap:wrap; gap:10px; }',
            '#' + BOLUM_ID + ' .sn-sinif{ display:flex; align-items:center; gap:10px; cursor:pointer;',
            '  text-decoration:none;',   /* kart bir <a>: alt çizgi olmasın */
            '  border:1px solid #E3E8EF; background:#F7F9FC; border-radius:13px; padding:10px 15px 10px 11px;',
            '  font-family:inherit; font-weight:700; color:#1F2430; font-size:.95rem;',
            '  transition:background .15s, border-color .15s, transform .12s, box-shadow .15s; }',
            '#' + BOLUM_ID + ' .sn-sinif:hover{ background:#EAF6F3; border-color:#16A085; color:#0E7C66;',
            '  transform:translateY(-2px); box-shadow:0 6px 14px rgba(22,160,133,.18); }',
            '#' + BOLUM_ID + ' .sn-sv{ width:30px; height:30px; flex:0 0 auto; display:flex; align-items:center;',
            '  justify-content:center; border-radius:9px; background:#16A085; color:#fff;',
            '  font-weight:800; font-size:.9rem; }',
            '#' + BOLUM_ID + ' .sn-ogr{ font-size:.76rem; font-weight:800; color:#8A93A0;',
            '  background:#EDF1F6; border-radius:999px; padding:2px 8px; }',
            '#' + BOLUM_ID + ' .sn-sinif:hover .sn-ogr{ background:#D9EDE7; color:#0E7C66; }',
            /* ekleme tuşları */
            '#' + BOLUM_ID + ' .sn-ekle{ display:flex; align-items:center; gap:7px; cursor:pointer;',
            '  border:2px dashed #CBD5E1; background:transparent; border-radius:13px; padding:10px 16px;',
            '  font-family:inherit; font-weight:800; color:#7A8595; font-size:.93rem;',
            '  transition:background .15s, border-color .15s, color .15s; }',
            '#' + BOLUM_ID + ' .sn-ekle:hover{ background:#EAF6F3; border-color:#16A085; color:#0E7C66; }',
            '#' + BOLUM_ID + ' .sn-ekle svg{ width:16px; height:16px; }',
            '#' + BOLUM_ID + ' .sn-kurum-ekle{ align-self:flex-start; cursor:pointer; font-family:inherit;',
            '  font-weight:800; font-size:.93rem; color:#B9651A; background:rgba(255,255,255,.65);',
            '  border:2px dashed #E0B37A; border-radius:13px; padding:11px 20px;',
            '  transition:background .15s, border-color .15s, color .15s; }',
            '#' + BOLUM_ID + ' .sn-kurum-ekle:hover{ background:#FFF6EC; border-color:#E67E22; color:#8E4B10; }',
            /* boş durum */
            '#' + BOLUM_ID + ' .sn-bos{ color:#8A93A0; font-size:.92rem; margin:0 0 12px; }',
            /* OKUL PANELİ İÇERİDE (06.10.2026) — pencere gibi değil,
               bölümün içeriği gibi dursun. display:contents ile kutusu
               kalmıyor: tam ekran karartması, sabit konum ve "boşluğa
               basınca kapan" davranışı da böylece ortadan kalkıyor. */
            '#' + BOLUM_ID + ' .sn-okul{ display:block; }',
            '#' + BOLUM_ID + ' #llOkulPopup.sn-okul-ici{ display:contents !important; }',
            '#' + BOLUM_ID + ' .sn-okul-ici .okul-panel{ max-width:none !important;',
            '  max-height:none !important; width:100%; border-radius:16px;',
            '  box-shadow:0 6px 18px rgba(31,36,48,.07) !important; }',
            '#' + BOLUM_ID + ' .sn-okul-ici .okul-baslik{ display:none !important; }',
            '#' + BOLUM_ID + ' .sn-okul-ici .okul-icerik{ overflow:visible !important;',
            '  padding:22px 18px 24px; }',
            /* başlık tuşu: kategori başlığı okulu açıyor */
            '#' + BOLUM_ID + ' .sn-bas-tus{ display:inline-flex; align-items:center;',
            '  gap:9px; border:0; background:none; cursor:pointer; padding:2px 6px 2px 0;',
            '  font:inherit; color:inherit; border-radius:10px;',
            '  transition:background .15s; }',
            '#' + BOLUM_ID + ' .sn-bas-tus:hover{ background:rgba(22,160,133,.09); }',
            '#' + BOLUM_ID + ' .sn-bas-ok{ width:17px; height:17px; opacity:.45;',
            '  transition:transform .15s, opacity .15s; }',
            '#' + BOLUM_ID + ' .sn-bas-tus:hover .sn-bas-ok{ opacity:.9;',
            '  transform:translateX(2px); }',
            /* HİÇ KURUM YOKKEN ÇIKAN DAVET */
            '#' + BOLUM_ID + ' .sn-davet{ background:#fff; border:1px dashed #C7D0DA;',
            '  border-radius:16px; padding:26px 20px 22px; text-align:center;',
            '  display:flex; flex-direction:column; align-items:center; gap:4px; }',
            '#' + BOLUM_ID + ' .sn-davet svg{ width:62px; height:62px; margin-bottom:6px; }',
            '#' + BOLUM_ID + ' .sn-davet-bas{ margin:0; font-weight:800; font-size:1.08rem;',
            '  color:#1F2430; }',
            '#' + BOLUM_ID + ' .sn-davet-alt{ margin:0 0 12px; color:#5B6471; font-size:.94rem;',
            '  max-width:46ch; line-height:1.45; }',
            '#' + BOLUM_ID + ' .sn-davet-tus{ border:0; cursor:pointer; font-family:inherit;',
            '  font-weight:800; font-size:1rem; color:#fff; background:#16A085;',
            '  border-radius:12px; padding:11px 22px;',
            '  box-shadow:0 4px 12px rgba(22,160,133,.28);',
            '  transition:transform .12s, box-shadow .15s; }',
            '#' + BOLUM_ID + ' .sn-davet-tus:hover{ transform:translateY(-1px);',
            '  box-shadow:0 7px 16px rgba(22,160,133,.34); }',
            '#' + BOLUM_ID + ' .sn-davet-ikinci{ margin-top:8px; border:0; background:none;',
            '  cursor:pointer; font-family:inherit; font-size:.9rem; color:#5B6471;',
            '  text-decoration:underline; text-underline-offset:3px; padding:4px 6px; }',
            '#' + BOLUM_ID + ' .sn-davet-ikinci:hover{ color:#1F2430; }',
            /* seviye seçici */
            '#snSeviye{ position:fixed; inset:0; z-index:10060; background:rgba(31,36,48,.28); }',
            '#snSeviye .sns-panel{ position:fixed; background:#fff; border:1px solid #E3E8EF;',
            '  border-radius:16px; box-shadow:0 18px 44px rgba(31,36,48,.2); padding:14px; min-width:250px; }',
            '#snSeviye .sns-bas{ font-size:.76rem; font-weight:800; letter-spacing:.04em; text-transform:uppercase;',
            '  color:#8A93A0; margin:0 2px 10px; }',
            '#snSeviye .sns-izgara{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }',
            '#snSeviye .sns-tus{ cursor:pointer; border:1px solid #E3E8EF; background:#F7F9FC; border-radius:11px;',
            '  padding:12px 0; font-family:inherit; font-weight:800; font-size:1rem; color:#1F2430;',
            '  transition:background .14s, border-color .14s, color .14s, transform .1s; }',
            '#snSeviye .sns-tus:hover{ background:#16A085; border-color:#0E7C66; color:#fff; transform:translateY(-1px); }',
            '#snSeviye .sns-baska{ grid-column:1 / -1; background:#fff; border-style:dashed; color:#7A8595; font-size:.9rem; }',
            '#snSeviye .sns-baska:hover{ background:#EAF6F3; border-color:#16A085; color:#0E7C66; }',
            '@media (max-width:620px){',
            '  #' + BOLUM_ID + ' .sn-sinif{ font-size:.9rem; padding:9px 13px 9px 10px; }',
            '}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------- SİMGELER */
    var OKUL_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#c0392b"/>' +
        '<path d="M4.4 8.8h15.2v12.6H4.4z" fill="#ecf0f1" stroke="#90A4AE" stroke-width=".9"/>' +
        '<rect x="10.2" y="14.4" width="3.6" height="7" fill="#8d6e63"/>' +
        '<g fill="#3498db"><rect x="6" y="11.4" width="3" height="3" rx=".5"/>' +
        '<rect x="15" y="11.4" width="3" height="3" rx=".5"/>' +
        '<rect x="6" y="16.4" width="3" height="3" rx=".5"/>' +
        '<rect x="15" y="16.4" width="3" height="3" rx=".5"/></g></svg>';
    var ARTI_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 5.4v13.2M5.4 12h13.2" fill="none" stroke="currentColor"' +
        ' stroke-width="2.6" stroke-linecap="round"/></svg>';

    /* ------------------------------------------------------- VERİ OKUMA
       Seviye adının başındaki sayı kart rozetine yazılır ("5. Sınıflar"
       → 5). Sayı yoksa rozet seviyenin ilk harfini gösterir. */
    function seviyeRakami(ad) {
        var m = String(ad || '').match(/\d+/);
        return m ? m[0] : String(ad || '?').trim().charAt(0).toLocaleUpperCase('tr-TR');
    }

    function veriOku() {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return null;
        var kurumlar = d.kurumlar || {};
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
        var gruplar = {};                 /* kurumId ('' = Genel) -> [sınıf] */
        sira.forEach(function (lId) {
            var lvl = d.levels[lId];
            if (!lvl) return;
            var g = (lvl.kurumId && kurumlar[lvl.kurumId]) ? lvl.kurumId : '';
            var cIds = lvl.classes ? Object.keys(lvl.classes) : [];
            cIds.forEach(function (cId) {
                (gruplar[g] = gruplar[g] || []).push({
                    lId: lId, cId: cId,
                    ad: (lvl.classes[cId] || {}).name || '',
                    rakam: seviyeRakami(lvl.name),
                    ogrenci: ((lvl.classes[cId] || {}).students || []).length
                });
            });
            if (!gruplar[g]) gruplar[g] = [];      /* sınıfsız seviye de kurumu görünür kılsın */
        });
        return { kurumlar: kurumlar, gruplar: gruplar };
    }

    /* ---------------------------------------------------------- ÇİZİM */
    function kurumKutusu(kId, ad, siniflar) {
        var h = '<div class="sn-kurum">' +
            '<div class="sn-kurum-bas">' + OKUL_SVG +
            '<span class="sn-kurum-ad">' + kac(ad) + '</span>' +
            (siniflar.length ? '<span class="sn-kurum-say">' + siniflar.length + ' sınıf</span>' : '') +
            '</div>';
        if (!siniflar.length) {
            h += '<p class="sn-bos">Bu kurumda henüz sınıf yok.</p>';
        }
        h += '<div class="sn-siniflar">';
        siniflar.forEach(function (s) {
            /* YENİ SEKMEDE AÇILSIN (06.10.2026) — öğretmen: "sınıf
               listesine tıklayınca ayrı sekmede açılsın". Kart <button>
               değil GERÇEK BAĞLANTI: böylece orta tuş, Ctrl+tık ve
               "bağlantıyı kopyala" da çalışıyor. Adresi sinifbag.js
               üretiyor; o dosya yüklenmediyse eski davranışa düşülür. */
            var bag = (window.KidefSinifBag && KidefSinifBag.adres)
                ? KidefSinifBag.adres(s.lId, s.cId) : '';
            if (bag) {
                h += '<a class="sn-sinif" href="' + kac(bag) + '"' +
                    ' target="_blank" rel="noopener"' +
                    ' title="' + kac(s.ad) + ' listelerini yeni sekmede aç">' +
                    '<span class="sn-sv">' + kac(s.rakam) + '</span>' +
                    '<span class="sn-ad">' + kac(s.ad) + '</span>' +
                    (s.ogrenci ? '<span class="sn-ogr">' + s.ogrenci + '</span>' : '') +
                    '</a>';
            } else {
                h += '<button type="button" class="sn-sinif"' +
                    ' onclick="KidefSiniflarim.ac(\'' + kac(s.lId) + '\',\'' + kac(s.cId) + '\')"' +
                    ' title="' + kac(s.ad) + ' listelerini aç">' +
                    '<span class="sn-sv">' + kac(s.rakam) + '</span>' +
                    '<span class="sn-ad">' + kac(s.ad) + '</span>' +
                    (s.ogrenci ? '<span class="sn-ogr">' + s.ogrenci + '</span>' : '') +
                    '</button>';
            }
        });
        h += '<button type="button" class="sn-ekle"' +
            ' onclick="KidefSiniflarim.seviyeSec(this,\'' + kac(kId || 'GENEL') + '\')"' +
            ' title="Bu kuruma sınıf ekle">' + ARTI_SVG + '<span>Sınıf ekle</span></button>';
        h += '</div></div>';
        return h;
    }

    function ciz() {
        var bolum = document.getElementById(BOLUM_ID);
        if (!gorunurMu()) { if (bolum) bolum.classList.remove('gor'); return; }

        /* VERİ HENÜZ YOKKEN DE ÇİZ (06.10.2026) — öğretmen: "hiç sınıf
           kurmayan ama öğretmen olarak giriş yapanlar için kurum seviye
           oluşturmasını teşvik amaçlı sınıflarım kategorisi açık olsun".
           Yeni kayıt olmuş öğretmende "data" henüz hiç oluşmamış
           olabiliyor; eskiden burada çıkılıp hiçbir şey çizilmiyordu ve
           öğretmen başlamak için nereye basacağını göremiyordu. */
        var v = veriOku() || { kurumlar: {}, gruplar: {} };

        if (!bolum) {
            stilKur();
            bolum = document.createElement('section');
            bolum.id = BOLUM_ID;
            bolum.className = 'content-section';
            var once = document.getElementById('guncellemeler');
            if (once && once.parentNode) once.parentNode.insertBefore(bolum, once);
            else {
                var hub = document.getElementById('home-hub-section');
                if (!hub) return;
                hub.insertBefore(bolum, hub.firstChild);
            }
        }

        /* BAŞLIK = OKULA GİRİŞ (06.10.2026) — öğretmen başlıktaki okul
           tuşunu kaldırttı; anasayfada okul penceresine gidecek yol
           kalmasın istemiyoruz. Kategori başlığının kendisi o yolu
           üstleniyor: okul çizimine ve "Sınıflarım" yazısına basınca okul
           sekmesi açılıyor (kurumlar, seviyeler, sınıflar, ayarlar). */
        var ic = '<h2><svg class="kbas" viewBox="0 0 24 24" aria-hidden="true">' +
            OKUL_SVG.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') +
            '</svg> Sınıflarım</h2>' +
            '<div class="sn-okul"></div>';

        /* AYNI İÇERİĞİ YENİDEN BASMA (06.10.2026) — öğretmen: "index
           açılınca sınıflarım yazısı 4 kere çiziliyor sanırım".
           Rol asenkron geldiği için aşağıdaki yoklama ilk saniyelerde
           ciz()'i birkaç kez çağırıyordu; her çağrı innerHTML'i baştan
           yazdığı için bölüm göz önünde 4 kez yeniden çiziliyordu.
           Artık üretilen HTML öncekiyle aynıysa DOM'a dokunulmuyor:
           yoklama sürüyor ama ekranda tek çizim görünüyor. */
        if (bolum.__sonIc !== ic) {
            bolum.innerHTML = ic;
            bolum.__sonIc = ic;
        }
        bolum.classList.add('gor');
        okulIcineKoy(bolum);
    }

    /* ----------------------------------------------- OKUL PANELİ İÇERİDE */
    function baskaSekmeMi() {
        try {
            var q = location.search || '';
            return q.indexOf('okul=1') > -1 || q.indexOf('sinif=') > -1;
        } catch (e) { return false; }
    }

    function okulIcineKoy(bolum) {
        if (baskaSekmeMi()) return;          /* okul/sınıf sekmesine karışma */
        var yuva = bolum.querySelector('.sn-okul');
        if (!yuva) return;
        var p = document.getElementById('llOkulPopup');
        if (p && yuva.contains(p)) return;   /* zaten içeride */
        try { if (window.KidefSinifBag) window.KidefSinifBag.icerde = true; } catch (e) { }
        if (!p) {
            try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { return; }
            p = document.getElementById('llOkulPopup');
        }
        if (!p) return;
        p.classList.add('sn-okul-ici');
        yuva.appendChild(p);
        okulIzle(bolum);
    }

    /* Kurum eklenince pencere kapanıp yeniden açılıyor (gövdeye). Yeniden
       açıldığında geri içeri alınsın diye gövde izleniyor. */
    function okulIzle(bolum) {
        if (window.__snOkulIzleniyor || !window.MutationObserver) return;
        window.__snOkulIzleniyor = 1;
        new MutationObserver(function (kayitlar) {
            for (var i = 0; i < kayitlar.length; i++) {
                var ek = kayitlar[i].addedNodes || [];
                for (var j = 0; j < ek.length; j++) {
                    if (ek[j] && ek[j].id === 'llOkulPopup') {
                        try { okulIcineKoy(bolum); } catch (e) { }
                        return;
                    }
                }
            }
        }).observe(document.body, { childList: true });
    }

    /* --------------------------------------------------------- İŞLEMLER */
    /* Okulu aç: kendi sekmesinde. Başlıktaki kapı kalktığı için
       anasayfadan okula giden yol burası. */
    function okulAc() {
        try {
            if (window.KidefSinifBag && KidefSinifBag.okulSekmesiAc) {
                KidefSinifBag.okulSekmesiAc(); return;
            }
        } catch (e) { }
        try { if (typeof llOkulPopupAc === 'function') llOkulPopupAc(); } catch (e) { }
    }

    function ac(lId, cId) {
        try {
            if (typeof llOkulSinifSec === 'function') { llOkulSinifSec(lId, cId); return; }
        } catch (e) { }
        try {
            if (typeof changeView === 'function') changeView('listelerim-section');
            if (typeof initListelerim === 'function') initListelerim();
            if (typeof selectClass === 'function') setTimeout(function () { selectClass(lId, cId); }, 0);
        } catch (e) { }
    }

    function seciciKapat() {
        var e = document.getElementById('snSeviye');
        if (e) e.remove();
        document.removeEventListener('keydown', seciciEsc, true);
    }
    function seciciEsc(e) { if (e.key === 'Escape') seciciKapat(); }

    /* "+" → 5'ten 10'a seviyeler. Seçilen seviye o kurumda yoksa açılır. */
    function seviyeSec(tus, kId) {
        if (document.getElementById('snSeviye')) { seciciKapat(); return; }
        var k = document.createElement('div');
        k.id = 'snSeviye';
        var izgara = SEVIYELER.map(function (n) {
            return '<button type="button" class="sns-tus"' +
                ' onclick="KidefSiniflarim.sinifKur(\'' + kac(kId) + '\',' + n + ')">' + n + '</button>';
        }).join('');
        izgara += '<button type="button" class="sns-tus sns-baska"' +
            ' onclick="KidefSiniflarim.sinifKur(\'' + kac(kId) + '\',0)">Başka bir seviye…</button>';
        k.innerHTML = '<div class="sns-panel"><div class="sns-bas">Hangi sınıf?</div>' +
            '<div class="sns-izgara">' + izgara + '</div></div>';
        document.body.appendChild(k);

        try {
            var r = tus.getBoundingClientRect();
            var p = k.firstChild;
            p.style.top = Math.round(r.bottom + 8) + 'px';
            p.style.left = Math.round(r.left) + 'px';
            var g = p.getBoundingClientRect();
            if (g.right > window.innerWidth - 10) {
                p.style.left = Math.max(10, window.innerWidth - g.width - 10) + 'px';
            }
            if (g.bottom > window.innerHeight - 10) {
                p.style.top = Math.max(10, r.top - g.height - 8) + 'px';
            }
        } catch (e) { }

        k.addEventListener('click', function (e) { if (e.target === k) seciciKapat(); });
        document.addEventListener('keydown', seciciEsc, true);
    }

    /* Seviye seçildi: şube sorulur, gerekiyorsa seviye açılır, sınıf eklenir. */
    function sinifKur(kId, no) {
        seciciKapat();
        if (typeof data === 'undefined' || !data) return;

        var seviyeAdi, sinifOn;
        if (no) {
            seviyeAdi = no + '. Sınıflar';
            sinifOn = String(no);
        } else {
            var ozel = prompt('Seviye adı (örn: Hazırlık, 11. Sınıflar):');
            if (!ozel || !ozel.trim()) return;
            seviyeAdi = ozel.trim();
            sinifOn = seviyeRakami(seviyeAdi);
        }

        var sube = prompt('Şube (örn: A, B, C) — boş bırakırsan tek sınıf açılır:', 'A');
        if (sube === null) return;                     /* vazgeçti */
        sube = String(sube).trim().toLocaleUpperCase('tr-TR');
        var sinifAdi = sube ? (sinifOn + '-' + sube) : seviyeAdi.replace(/lar$/i, '');

        var kurumId = (kId === 'GENEL') ? null : kId;
        if (!data.levels) data.levels = {};

        /* Aynı kurumda aynı adlı seviye varsa ona ekle, yoksa yeni seviye. */
        var lId = null;
        Object.keys(data.levels).forEach(function (id) {
            var l = data.levels[id];
            if (!l) return;
            var lk = l.kurumId || null;
            if (lk === kurumId && String(l.name).trim() === seviyeAdi) lId = id;
        });
        if (!lId) {
            if (typeof window.llSeviyeTaslak === 'function') {
                lId = 'L' + Date.now();
                data.levels[lId] = window.llSeviyeTaslak(seviyeAdi, kurumId);
                if (!Array.isArray(data.levelOrder)) data.levelOrder = Object.keys(data.levels);
                if (data.levelOrder.indexOf(lId) < 0) data.levelOrder.push(lId);
            } else {
                alert('Seviye oluşturulamadı (listelerim.js yüklenmemiş).');
                return;
            }
        }

        var lvl = data.levels[lId];
        if (!lvl.classes) lvl.classes = {};
        var zaten = Object.keys(lvl.classes).some(function (c) {
            return String((lvl.classes[c] || {}).name || '').trim() === sinifAdi;
        });
        if (zaten) { alert(sinifAdi + ' zaten var.'); return; }

        lvl.classes['C' + Date.now()] = { name: sinifAdi, students: [] };
        try { if (typeof save === 'function') save(); } catch (e) { }
        ciz();
    }

    function kurumEkle() {
        try { if (typeof addKurum === 'function') addKurum(); } catch (e) { }
        setTimeout(ciz, 0);
    }

    /* ------------------------------------------------------ YOKLAMA
       Rol asenkron geldiği için kısa süre yoklanır; görünür olunca
       birkaç tur teyit edip durur (sistem/okultusu.js ile aynı mantık). */
    var tur = 0, teyit = 0;
    var zaman = setInterval(function () {
        tur++;
        ciz();
        if (gorunurMu() && document.getElementById(BOLUM_ID)) teyit++;
        if (teyit >= 4 || tur > 50) clearInterval(zaman);
    }, 500);

    document.addEventListener('visibilitychange', function () { if (!document.hidden) ciz(); });
    window.addEventListener('focus', ciz);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ciz);
    else ciz();

    window.KidefSiniflarim = {
        okulAc: okulAc,
        ciz: ciz, ac: ac, seviyeSec: seviyeSec, sinifKur: sinifKur,
        kurumEkle: kurumEkle, gorunurMu: gorunurMu
    };
})();
