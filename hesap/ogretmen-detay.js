/* =====================================================================
   KİDEF · YÖNETİCİ > ÖĞRETMEN PENCERESİ     (hesap/ogretmen-detay.js)
   ---------------------------------------------------------------------
   Öğretmen (08.10.2026): "kayıtlı olan öğretmenlerin kendilerine kayıtlı
   kaç öğrenci olduğunu, ne kadar sitede zaman geçirdiklerini görebileyim;
   hatta siteye kaydolurkenki anketleri de her öğretmen özelinde
   detaylıca bakılabilsin."
   Öğretmen (19.10.2026): "yönetici kısmındaki öğretmenler kısmında her
   öğretmenle ilgili bilgileri bi satırda göstermek yerine her şeyi bi
   popup içine ekleyelim, sınıf öğrenci siteyi kullanma süresi, ücret
   durumu, anketleri, takvim düzenleme kısmı, takvim düzenleyici de ayrı
   bi akordiyon olmasın, kayıt anketi de."

   Öğretmenler listesinde her öğretmen tek bir kart; karta basınca bu
   pencere açılır. Üstte kimlik, durum ve işlem tuşları (Onayla / Onayı
   kaldır / Sil); altında dört sekme:
     GENEL        sitede süre (14 günlük çubuklar) + sınıflar ve öğrenciler
     ÜCRET        Beklenen Destek: beklenen / ödenen / kalan, bildirimleri
                  onaylama, ödeme defteri, elle ödeme (hesap/destek.js)
     TAKVİM       müsaitlik takvimi (eski "Öğretmen Takvim Düzenleyici"
                  akordiyonu; teacher-admin.js → getTeacherCalendarEditorHtml)
     KAYIT ANKETİ kayıt olurken verilen cevaplar
   Ayrıca "Tüm kayıt anketleri" penceresi: eski "📋 Kayıt Anketi"
   akordiyonunun (hesap/kayitanketi.js) kendisi, yerinden alınıp burada
   gösterilir — öğrencilerin cevapları da orada.

   Veri, listenin zaten okuduğu belgeden gelir (teacher-admin.js,
   _adminOgretmenler); yalnız ÜCRET sekmesi kendi sorgusunu yapar.
   z-index 9990: sitenin uyarı/onay kutuları (9999) pencerenin ÜSTÜNDE
   çıksın.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefOgretmenDetay && window.KidefOgretmenDetay.surum >= 2) return;

    function esc(x) {
        return String(x == null ? '' : x)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function sure(sn) {
        if (window.KidefKullanim && KidefKullanim.bicim) return KidefKullanim.bicim(sn);
        sn = Math.max(0, Math.round(sn || 0));
        if (sn < 60) return sn + ' sn';
        var d = Math.floor(sn / 60), s = Math.floor(d / 60);
        return s < 1 ? d + ' dk' : s + ' sa ' + (d % 60) + ' dk';
    }
    function tarihAl(ts) {
        try {
            var d = (ts && ts.toDate) ? ts.toDate() : (ts ? new Date(ts) : null);
            return (!d || isNaN(d)) ? null : d;
        } catch (e) { return null; }
    }
    function tarih(ts) {
        var d = tarihAl(ts);
        return d ? d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric',
                                              hour: '2-digit', minute: '2-digit' }) : '—';
    }
    function gun(ts) {
        var d = tarihAl(ts);
        return d ? d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
    }
    function gunAdi(g) {
        try {
            var p = g.split('-');
            return new Date(+p[0], +p[1] - 1, +p[2])
                .toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
        } catch (e) { return g; }
    }
    function bas2(ad, email) {
        var k = String(ad || '').trim().split(/\s+/).filter(Boolean);
        var h = k.length ? (k[0][0] + (k.length > 1 ? k[k.length - 1][0] : '')) : String(email || '?')[0];
        return h.toLocaleUpperCase('tr-TR');
    }
    function renkTonu(s) {
        var h = 0; s = String(s || '');
        for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
        return h;
    }
    function durumRozet(onay) {
        if (typeof window._ogrDurumRozet === 'function') return window._ogrDurumRozet(onay);
        return '<span>' + esc(onay || 'Eski kayıt') + '</span>';
    }

    /* ------------------------------------------------------------------ */
    function stil() {
        if (document.getElementById('ogd-stil2')) return;
        var s = document.createElement('style');
        s.id = 'ogd-stil2';
        s.textContent = [
            '#ogdOrt{position:fixed; inset:0; z-index:9990; display:flex; align-items:center;',
            '  justify-content:center; padding:18px; background:rgba(16,22,34,.55); animation:ogdSol .16s ease-out;}',
            '@keyframes ogdSol{from{opacity:0}to{opacity:1}}',
            '#ogdKutu{background:#fff; border-radius:18px; width:min(940px,96vw); height:min(88vh,860px);',
            '  display:flex; flex-direction:column; box-shadow:0 26px 70px rgba(16,22,34,.3); overflow:hidden;',
            '  animation:ogdCik .22s cubic-bezier(.2,1.1,.4,1); color:#1F2430;}',
            '@keyframes ogdCik{from{transform:translateY(12px) scale(.985); opacity:0}to{transform:none; opacity:1}}',
            '#ogdKutu .ogd-bas{display:flex; align-items:flex-start; gap:14px; padding:16px 20px 12px; border-bottom:1px solid #E6EBF2; flex-wrap:wrap;}',
            '#ogdKutu .ogd-avatar{flex:none; width:48px; height:48px; border-radius:14px; display:flex; align-items:center;',
            '  justify-content:center; font-weight:900; font-size:1.05rem;}',
            '#ogdKutu .ogd-kim{flex:1 1 260px; min-width:0;}',
            '#ogdKutu .ogd-ad{font-weight:900; color:#1F2430; font-size:1.1rem; display:flex; align-items:center; gap:9px; flex-wrap:wrap;}',
            '#ogdKutu .ogd-eposta{color:#8A94A3; font-size:.86rem; margin-top:2px; word-break:break-all;}',
            '#ogdKutu .ogd-cipler{display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;}',
            '#ogdKutu .ogd-cip{display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:999px;',
            '  background:#F3F6FA; color:#55606D; font-size:.78rem; font-weight:700;}',
            '#ogdKutu .ogd-cip b{color:#1F2430;}',
            '#ogdKutu .ogd-islem{display:flex; gap:8px; align-items:center; flex-wrap:wrap;}',
            '#ogdKutu .ogd-tus{border:none; border-radius:9px; padding:8px 14px; font-size:.85rem; font-weight:800; cursor:pointer; font-family:inherit;}',
            '#ogdKutu .ogd-tus.onay{background:#E8F6EF; color:#1E8449;}',
            '#ogdKutu .ogd-tus.kaldir{background:#FDEDEC; color:#B03A2E;}',
            '#ogdKutu .ogd-tus.sil{background:#fff; color:#B03A2E; border:1.5px solid #F3C7C1;}',
            '#ogdKutu .ogd-kapat{border:0; background:#F1F4F9; cursor:pointer; width:36px; height:36px; border-radius:10px;',
            '  font-size:1.15rem; color:#55606D; flex:none;}',
            '#ogdKutu .ogd-sekmeler{display:flex; gap:4px; padding:0 14px; border-bottom:1px solid #E6EBF2; overflow-x:auto; flex:none;}',
            '#ogdKutu .ogd-sekme{border:0; background:none; padding:11px 14px 10px; font-family:inherit; font-size:.9rem; font-weight:800;',
            '  color:#8A94A3; cursor:pointer; border-bottom:3px solid transparent; white-space:nowrap; display:inline-flex; align-items:center; gap:7px;}',
            '#ogdKutu .ogd-sekme svg{width:17px; height:17px;}',
            '#ogdKutu .ogd-sekme.sec{color:#1B4F9C; border-bottom-color:#4C8DF6;}',
            '#ogdKutu .ogd-sekme .ogd-sek-rozet{background:#E08E1B; color:#fff; border-radius:999px; padding:0 7px; font-size:.72rem;}',
            '#ogdKutu .ogd-govde{flex:1 1 auto; overflow:auto; -webkit-overflow-scrolling:touch;}',
            '#ogdKutu .ogd-bol{padding:16px 20px; border-bottom:1px solid #EEF2F7;}',
            '#ogdKutu .ogd-bol:last-child{border-bottom:0;}',
            '#ogdKutu h4{margin:0 0 12px; font-size:.95rem; color:#1B4F9C; font-weight:900;}',
            '#ogdKutu .ogd-kutular{display:flex; gap:10px; flex-wrap:wrap;}',
            '#ogdKutu .ogd-k{flex:1 1 150px; background:#F7F9FC; border:1px solid #E6EBF2; border-radius:12px; padding:11px 14px;}',
            '#ogdKutu .ogd-k b{display:block; font-size:1.25rem; color:#1F2430; line-height:1.2;}',
            '#ogdKutu .ogd-k span{font-size:.78rem; color:#8A94A3; font-weight:700;}',
            '#ogdKutu .ogd-gun{display:flex; align-items:flex-end; gap:6px; height:92px; margin-top:16px;}',
            '#ogdKutu .ogd-c{flex:1 1 0; display:flex; flex-direction:column; align-items:center; gap:4px;}',
            '#ogdKutu .ogd-c i{display:block; width:100%; background:#4C8DF6; border-radius:4px 4px 0 0; min-height:2px;',
            '  transform-origin:bottom; animation:ogdCubuk .6s cubic-bezier(.3,1.3,.5,1) both;}',
            '@keyframes ogdCubuk{from{transform:scaleY(0)}to{transform:scaleY(1)}}',
            '#ogdKutu .ogd-c small{font-size:.66rem; color:#8A94A3; white-space:nowrap;}',
            '#ogdKutu table{width:100%; border-collapse:collapse; font-size:.88rem;}',
            '#ogdKutu th,#ogdKutu td{text-align:start; padding:7px 9px; border-bottom:1px solid #EEF2F7;}',
            '#ogdKutu th{color:#8A94A3; font-size:.78rem; text-transform:uppercase; letter-spacing:.4px;}',
            '#ogdKutu .ogd-soru{margin:0 0 10px; padding:10px 13px; background:#F7F9FC; border-radius:10px; border-inline-start:3px solid #4C8DF6;}',
            '#ogdKutu .ogd-soru p{margin:0 0 4px; font-size:.82rem; color:#8A94A3; font-weight:700;}',
            '#ogdKutu .ogd-soru div{font-size:.95rem; color:#1F2430; font-weight:600;}',
            '#ogdKutu .ogd-yok{color:#A9B2BD; font-size:.9rem;}',
            '#ogdKutu #ogd-takvim .slot{font-size:.85rem;}',
            '@media (max-width:620px){#ogdOrt{padding:0;} #ogdKutu{width:100vw; height:100vh; border-radius:0;}',
            '  #ogdKutu .ogd-bas{padding:12px 14px;} #ogdKutu .ogd-bol{padding:14px;}}',
            '@media (prefers-reduced-motion: reduce){#ogdOrt,#ogdKutu,#ogdKutu .ogd-c i{animation:none;}}',
            /* eski "📋 Kayıt Anketi" akordiyonu yönetici panelinde görünmez;
               "Tüm kayıt anketleri" tuşu onu bu pencerede açar */
            '#admin-section #ka-yonetici{display:none !important;}',
            /* öğretmenler listesi (teacher-admin.js çizer) */
            '.aog-ara{display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:0 0 10px;}',
            '.aog-ara input{flex:1 1 220px; border:1.5px solid #E1E7EF; border-radius:10px; padding:9px 12px; font-family:inherit; font-size:.92rem;}',
            '.aog-suz{border:1.5px solid #E1E7EF; background:#fff; color:#55606D; border-radius:999px; padding:6px 13px;',
            '  font-size:.82rem; font-weight:800; cursor:pointer; font-family:inherit;}',
            '.aog-suz.sec{background:#1B4F9C; border-color:#1B4F9C; color:#fff;}',
            '.aog-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:10px;}',
            '.aog-kart{display:flex; align-items:center; gap:12px; text-align:start; width:100%; min-width:0; box-sizing:border-box; margin:0; background:#fff;',
            '  border:1px solid #E6EBF2; border-radius:14px; padding:11px 13px; cursor:pointer; font-family:inherit;',
            '  transition:box-shadow .15s, transform .15s, border-color .15s; color:#1F2430;}',
            '.aog-kart:hover{border-color:#BFD3F2; box-shadow:0 8px 22px rgba(27,79,156,.10); transform:translateY(-1px);}',
            '.aog-avatar{flex:none; width:42px; height:42px; border-radius:12px; display:flex; align-items:center;',
            '  justify-content:center; font-weight:900; font-size:.95rem;}',
            '.aog-govde{flex:1 1 auto; min-width:0; display:flex; flex-direction:column; gap:3px;}',
            '.aog-ust{display:flex; align-items:center; gap:7px; flex-wrap:wrap;}',
            '.aog-ad{font-weight:900; font-size:.96rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%;}',
            '.aog-eposta{font-size:.8rem; color:#8A94A3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}',
            '.aog-alt{font-size:.8rem; color:#55606D;}',
            '.aog-alt b{color:#1F2430;}',
            '.aog-ok{flex:none; color:#B6C2D2; font-size:1.4rem; line-height:1;}',
            '.aog-bos{grid-column:1/-1; color:#A9B2BD; font-size:.9rem; padding:8px 2px;}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* --- GENEL: süre --- */
    function sureBolumu(kul) {
        var g = kul.gun || {};
        var liste = [];
        var d = new Date();
        for (var i = 13; i >= 0; i--) {
            var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
            var a = t.getMonth() + 1, gg = t.getDate();
            var ad = t.getFullYear() + '-' + (a < 10 ? '0' : '') + a + '-' + (gg < 10 ? '0' : '') + gg;
            liste.push({ ad: ad, sn: g[ad] || 0 });
        }
        var en = Math.max.apply(null, liste.map(function (x) { return x.sn; }).concat([1]));
        var cubuk = liste.map(function (x, i) {
            var y = Math.round((x.sn / en) * 78);
            return '<div class="ogd-c" title="' + esc(gunAdi(x.ad)) + ': ' + esc(sure(x.sn)) + '">' +
                   '<i style="height:' + (x.sn ? Math.max(3, y) : 2) + 'px; animation-delay:' + (i * 30) + 'ms;' +
                   (x.sn ? '' : 'background:#E3E9F1;') + '"></i>' +
                   '<small>' + esc(gunAdi(x.ad).split(' ')[0]) + '</small></div>';
        }).join('');
        var son14 = liste.reduce(function (a, x) { return a + x.sn; }, 0);
        return '<div class="ogd-bol"><h4>Sitede geçirilen süre</h4>' +
            '<div class="ogd-kutular">' +
              '<div class="ogd-k"><b>' + esc(sure(kul.toplamSn)) + '</b><span>TOPLAM</span></div>' +
              '<div class="ogd-k"><b>' + esc(sure(son14)) + '</b><span>SON 14 GÜN</span></div>' +
              '<div class="ogd-k"><b>' + (kul.oturum || 0) + '</b><span>OTURUM</span></div>' +
              '<div class="ogd-k"><b style="font-size:.95rem;">' + esc(tarih(kul.sonGoruldu)) + '</b>' +
                '<span>SON GÖRÜLME</span></div>' +
            '</div>' +
            (son14 ? '<div class="ogd-gun">' + cubuk + '</div>'
                   : '<p class="ogd-yok" style="margin:10px 0 0;">Son 14 günde kayıt yok.</p>') +
            '<p style="margin:10px 0 0; font-size:.78rem; color:#A9B2BD; line-height:1.5;">' +
              'Yalnız <b>etkin</b> süre sayılır: sekme açık ve görünür olacak, ' +
              '5 dakikadan uzun hareketsizlik duraklatır. Ayrı sekmede açılan ' +
              'flipbook ve sunumlar bu süreye girmez.</p>' +
            '</div>';
    }

    /* --- GENEL: sınıflar --- */
    function sinifBolumu(userData, say) {
        var d = null;
        try { d = userData ? (typeof userData === 'string' ? JSON.parse(userData) : userData) : null; } catch (e) { }
        var govde = '';
        if (d && d.levels) {
            var sira = d.levelOrder || Object.keys(d.levels);
            sira.forEach(function (lid) {
                var lv = d.levels[lid]; if (!lv) return;
                var C = lv.classes || {};
                Object.keys(C).forEach(function (cid) {
                    var o = C[cid].students || [];
                    var bagli = o.filter(function (x) { return x && x.hesapUid; }).length;
                    govde += '<tr><td>' + esc(lv.name || lid) + '</td>' +
                             '<td><b>' + esc(C[cid].name || cid) + '</b></td>' +
                             '<td>' + o.length + '</td>' +
                             '<td>' + (bagli ? bagli : '<span class="ogd-yok">0</span>') + '</td></tr>';
                });
            });
        }
        return '<div class="ogd-bol"><h4>Sınıfları ve öğrencileri</h4>' +
            '<div class="ogd-kutular" style="margin-bottom:12px;">' +
              '<div class="ogd-k"><b>' + (say.ogrenci || 0) + '</b><span>ÖĞRENCİ</span></div>' +
              '<div class="ogd-k"><b>' + (say.sinif || 0) + '</b><span>SINIF</span></div>' +
              '<div class="ogd-k"><b>' + (say.seviye || 0) + '</b><span>SEVİYE</span></div>' +
              '<div class="ogd-k"><b>' + (say.bagli || 0) + '</b><span>HESABI BAĞLI</span></div>' +
            '</div>' +
            (govde ? '<table><thead><tr><th>Seviye</th><th>Sınıf</th><th>Öğrenci</th>' +
                     '<th>Hesabı bağlı</th></tr></thead><tbody>' + govde + '</tbody></table>'
                   : '<p class="ogd-yok">Bu öğretmenin kayıtlı sınıfı yok.</p>') +
            '</div>';
    }

    /* --- KAYIT ANKETİ ---
       Kayıt anketi cevapları {id, s:soru, k:anahtar, c:cevap} biçiminde
       yazılıyor (hesap/kayitanketi.js). Eski pencere x.soru / x.cevap
       arıyordu, o yüzden sorular boş görünüyordu; ikisi de okunur. */
    function anketBolumu(anket) {
        if (!anket) {
            return '<div class="ogd-bol"><h4>Kayıt anketi</h4>' +
                   '<p class="ogd-yok">Bu hesap anket doldurmadan açılmış (anket 27.09.2026\'da eklendi; öncesindeki kayıtlarda cevap yok).</p></div>';
        }
        var c = anket.cevaplar || [];
        var govde = c.map(function (x) {
            var soru = x.soru || x.s || '';
            var cev = (x.cevap != null && x.cevap !== '') ? x.cevap : (x.c || x.k || '');
            if (Array.isArray(cev)) cev = cev.join(', ');
            return '<div class="ogd-soru"><p>' + esc(soru) + '</p>' +
                   '<div>' + (cev ? esc(cev) : '<span class="ogd-yok">—</span>') + '</div></div>';
        }).join('');
        var t = '—';
        try { t = anket.tarih ? new Date(anket.tarih).toLocaleString('tr-TR') : '—'; } catch (e) { }
        return '<div class="ogd-bol"><h4>Kayıt anketi</h4>' +
            '<p style="margin:0 0 12px; font-size:.84rem; color:#8A94A3;">' +
              'Dolduruldu: <b>' + esc(t) + '</b>' +
              (anket.rol ? ' · rol: <b>' + esc(anket.rol === 'teacher' ? 'öğretmen' : anket.rol) + '</b>' : '') + '</p>' +
            (govde || '<p class="ogd-yok">Soru kaydı yok.</p>') + '</div>';
    }

    /* ------------------------------------------------------------------ */
    var IK = {
        genel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
        ucret: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5C6 16.4 3.5 12.6 5.4 9.6c1.6-2.5 4.9-2.3 6.6.3 1.7-2.6 5-2.8 6.6-.3 1.9 3-.6 6.8-6.6 10.9Z"/></svg>',
        takvim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
        anket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 3.5h6v3H9zM8.5 11h7M8.5 15h5"/></svg>'
    };
    var SEKMELER = [
        { id: 'genel', ad: 'Genel' },
        { id: 'ucret', ad: 'Ücret durumu' },
        { id: 'takvim', ad: 'Takvim' },
        { id: 'anket', ad: 'Kayıt anketi' }
    ];

    var _uid = null, _sekme = 'genel', _takvimYuklendi = false;

    function bilgiAl(uid) {
        return (window._adminOgretmenler && window._adminOgretmenler[uid]) || null;
    }

    function kapat() {
        var o = document.getElementById('ogdOrt');
        if (o) o.remove();
        _uid = null;
        document.removeEventListener('keydown', esctus, true);
    }
    function esctus(e) {
        if (e.key !== 'Escape') return;
        /* üstte sitenin uyarı kutusu açıksa önce o kapansın */
        if (document.getElementById('dstOrt')) return;
        kapat();
    }

    function basHtml(uid, b) {
        var doc = b.doc || {};
        var onay = doc.ogretmenOnay;
        var acik = (onay === 'onayli') || (onay === undefined || onay === null || onay === '');
        var ton = renkTonu(uid);
        var tel = b.tel && b.tel !== 'Belirtilmedi' ? b.tel : '';
        var say = b.ogrenci || {};
        var kul = b.kullanim || {};
        var islem = acik
            ? '<button type="button" class="ogd-tus kaldir" data-ogd="durum" data-onay="0">Onayı kaldır</button>'
            : '<button type="button" class="ogd-tus onay" data-ogd="durum" data-onay="1">Onayla</button>' +
              '<button type="button" class="ogd-tus sil" data-ogd="sil" title="Kaydı Firestore\'dan tamamen sil">Sil</button>';
        return '<div class="ogd-bas">' +
            '<span class="ogd-avatar" style="background:hsl(' + ton + ',70%,93%); color:hsl(' + ton + ',45%,32%);">' +
              esc(bas2(b.ad, b.email)) + '</span>' +
            '<div class="ogd-kim">' +
              '<div class="ogd-ad">' + esc(b.ad || '(isim yok)') + ' ' + durumRozet(onay) + '</div>' +
              '<div class="ogd-eposta">' + esc(b.email || '') + '</div>' +
              '<div class="ogd-cipler">' +
                (tel ? ((window.KidefTelKopya && KidefTelKopya.rozet) ? KidefTelKopya.rozet(tel) : '<span class="ogd-cip">' + esc(tel) + '</span>') : '') +
                (b.kod ? '<span class="ogd-cip">Kod <b style="font-family:monospace;">' + esc(b.kod) + '</b></span>' : '') +
                '<span class="ogd-cip">Kayıt <b>' + esc(gun(doc.createdAt)) + '</b></span>' +
                '<span class="ogd-cip"><b>' + (say.ogrenci || 0) + '</b> öğrenci · <b>' + (say.sinif || 0) + '</b> sınıf</span>' +
                '<span class="ogd-cip">Sitede <b>' + esc(sure(kul.toplamSn)) + '</b></span>' +
              '</div>' +
            '</div>' +
            '<div class="ogd-islem">' + islem +
              '<button type="button" class="ogd-kapat" aria-label="Kapat">&times;</button></div>' +
            '</div>';
    }

    function sekmeHtml() {
        return '<div class="ogd-sekmeler" role="tablist">' + SEKMELER.map(function (s) {
            return '<button type="button" role="tab" class="ogd-sekme' + (s.id === _sekme ? ' sec' : '') +
                   '" data-ogd-sekme="' + s.id + '">' + IK[s.id] + esc(s.ad) +
                   (s.id === 'ucret' ? '<span class="ogd-sek-rozet" id="ogd-ucret-rozet" style="display:none;"></span>' : '') +
                   '</button>';
        }).join('') + '</div>';
    }

    function govdeCiz() {
        var g = document.getElementById('ogd-govde');
        var b = bilgiAl(_uid);
        if (!g || !b) return;
        [].forEach.call(document.querySelectorAll('#ogdKutu .ogd-sekme'), function (t) {
            t.classList.toggle('sec', t.getAttribute('data-ogd-sekme') === _sekme);
        });
        g.scrollTop = 0;
        if (_sekme === 'genel') {
            g.innerHTML = sureBolumu(b.kullanim || {}) + sinifBolumu(b.userData || '', b.ogrenci || {});
        } else if (_sekme === 'ucret') {
            g.innerHTML = '<div class="ogd-bol"><h4>Beklenen Destek · ücret durumu</h4><div id="ogd-ucret"></div></div>';
            var k = document.getElementById('ogd-ucret');
            if (window.KidefDestek && KidefDestek.yoneticiBolum) KidefDestek.yoneticiBolum(k, _uid, b);
            else k.innerHTML = '<p class="ogd-yok">Destek modülü yüklenmedi (hesap/destek.js).</p>';
        } else if (_sekme === 'takvim') {
            g.innerHTML = '<div class="ogd-bol"><h4>Müsaitlik takvimi</h4>' +
                '<div id="ogd-takvim" data-uid="' + esc(_uid) + '"></div></div>';
            takvimCiz();
            /* takvimler koleksiyonu bu oturumda okunmadıysa bir kez oku;
               gelince teacher-admin.js → loadTeacherSchedules pencereyi tazeler */
            if (!_takvimYuklendi && typeof window.loadTeacherSchedules === 'function') {
                _takvimYuklendi = true;
                try { window.loadTeacherSchedules(); } catch (e) { }
            }
        } else if (_sekme === 'anket') {
            g.innerHTML = anketBolumu(b.anket);
        }
    }

    function takvimCiz() {
        var k = document.getElementById('ogd-takvim');
        if (!k) return;
        try {
            if (typeof window.getTeacherCalendarEditorHtml === 'function') {
                k.innerHTML = window.getTeacherCalendarEditorHtml(k.getAttribute('data-uid'), true);
            } else {
                k.innerHTML = '<p class="ogd-yok">Takvim düzenleyici yüklenmedi.</p>';
            }
        } catch (e) {
            k.innerHTML = '<p class="ogd-yok">Takvim çizilemedi: ' + esc(e && e.message) + '</p>';
        }
    }

    function ucretRozeti() {
        var r = document.getElementById('ogd-ucret-rozet');
        if (!r || !window.KidefDestek) return;
        /* bekleyen bildirim sayısını kartın rozetinden al (destek.js doldurur) */
        var kart = document.querySelector('[data-dst-rozet="' + _uid + '"] .dst-cip.bekliyor');
        var m = kart ? String(kart.textContent).match(/\d+/) : null;
        if (m) { r.textContent = m[0]; r.style.display = ''; } else { r.style.display = 'none'; }
    }

    function ac(uid, sekme) {
        var b = bilgiAl(uid);
        if (!b) {
            try { if (typeof showCustomAlert === 'function') showCustomAlert('Öğretmen bilgisi bulunamadı; listeyi yenileyin.'); } catch (e) { }
            return;
        }
        stil();
        var o = document.getElementById('ogdOrt');
        if (o) o.remove();
        _uid = uid;
        _sekme = SEKMELER.some(function (s) { return s.id === sekme; }) ? sekme : 'genel';
        var ort = document.createElement('div');
        ort.id = 'ogdOrt';
        ort.innerHTML = '<div id="ogdKutu" role="dialog" aria-modal="true">' +
            '<div id="ogd-bas">' + basHtml(uid, b) + '</div>' + sekmeHtml() +
            '<div class="ogd-govde" id="ogd-govde"></div></div>';
        ort.addEventListener('click', function (e) {
            var t = e.target;
            if (t === ort || (t.closest && t.closest('.ogd-kapat'))) { kapat(); return; }
            var sk = t.closest && t.closest('[data-ogd-sekme]');
            if (sk) { _sekme = sk.getAttribute('data-ogd-sekme'); govdeCiz(); return; }
            var is = t.closest && t.closest('[data-ogd]');
            if (!is) return;
            var tur = is.getAttribute('data-ogd');
            if (tur === 'durum' && typeof window.adminOgretmenDurum === 'function') {
                window.adminOgretmenDurum(_uid, is.getAttribute('data-onay') === '1');
            } else if (tur === 'sil' && typeof window.adminOgretmenSil === 'function') {
                window.adminOgretmenSil(_uid);
            }
        });
        document.body.appendChild(ort);
        document.removeEventListener('keydown', esctus, true);
        document.addEventListener('keydown', esctus, true);
        govdeCiz();
        ucretRozeti();
    }

    /* Liste yeniden yüklenince (onay / onay kaldırma / silme sonrası)
       açık pencere güncel bilgiyle yenilenir; kayıt silindiyse kapanır. */
    function tazele() {
        if (!_uid || !document.getElementById('ogdOrt')) return;
        var b = bilgiAl(_uid);
        if (!b) { kapat(); return; }
        var bas = document.getElementById('ogd-bas');
        if (bas) bas.innerHTML = basHtml(_uid, b);
        if (_sekme !== 'takvim') govdeCiz();
        ucretRozeti();
    }

    /* ------------------------------------------------------------------
       TÜM KAYIT ANKETLERİ — eski akordiyonun kendisi bu pencerede açılır
       ------------------------------------------------------------------ */
    function anketlerAc() {
        stil();
        var d = document.getElementById('ka-yonetici');
        if (!d) {
            try { if (typeof showCustomAlert === 'function') showCustomAlert('Kayıt anketi bölümü yüklenmedi.'); } catch (e) { }
            return;
        }
        var eskiYer = d.parentNode, eskiSonraki = d.nextSibling;
        var o = document.getElementById('ogdOrt');
        if (o) o.remove();
        _uid = null;
        var ort = document.createElement('div');
        ort.id = 'ogdOrt';
        ort.innerHTML = '<div id="ogdKutu" role="dialog" aria-modal="true" style="height:auto; max-height:88vh;">' +
            '<div class="ogd-bas" style="align-items:center;"><div class="ogd-kim"><div class="ogd-ad">📋 Tüm kayıt anketleri</div>' +
            '<div class="ogd-eposta">Öğretmenlerin ve öğrencilerin kayıt olurken verdiği cevaplar</div></div>' +
            '<button type="button" class="ogd-kapat" aria-label="Kapat">&times;</button></div>' +
            '<div class="ogd-govde" id="ogd-anketler" style="padding:6px 20px 16px;"></div></div>';
        document.body.appendChild(ort);
        var yer = ort.querySelector('#ogd-anketler');
        d.style.display = '';
        d.classList.add('ogd-tasindi');
        yer.appendChild(d);
        if (!d.open) d.open = true;            /* toggle olayı listeyi yükler */
        function geri() {
            try {
                d.open = false;
                d.classList.remove('ogd-tasindi');
                if (eskiYer && document.body.contains(eskiYer)) eskiYer.insertBefore(d, eskiSonraki && eskiSonraki.parentNode === eskiYer ? eskiSonraki : null);
                else d.remove();
            } catch (e) { }
            ort.remove();
            document.removeEventListener('keydown', esc2, true);
        }
        function esc2(e) { if (e.key === 'Escape') geri(); }
        ort.addEventListener('click', function (e) {
            if (e.target === ort || (e.target.closest && e.target.closest('.ogd-kapat'))) geri();
        });
        document.addEventListener('keydown', esc2, true);
    }

    window.KidefOgretmenDetay = { surum: 2, ac: ac, kapat: kapat, tazele: tazele, takvimCiz: takvimCiz,
                                  anketlerAc: anketlerAc, stil: stil, basHarf: bas2, renkTonu: renkTonu };
    window.adminOgretmenDetay = ac;
})();
