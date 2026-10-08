/* =====================================================================
   KİDEF · YÖNETİCİ > ÖĞRETMEN DETAYI        (hesap/ogretmen-detay.js)
   ---------------------------------------------------------------------
   Öğretmen (08.10.2026): "kayıtlı olan öğretmenlerin kendilerine kayıtlı
   kaç öğrenci olduğunu, ne kadar sitede zaman geçirdiklerini görebileyim;
   hatta siteye kaydolurkenki anketleri de her öğretmen özelinde
   detaylıca bakılabilsin."

   Yönetici tablosundaki "Detay" tuşu burayı açar. Üç bölüm:
     1) SİTEDE SÜRE  — toplam, oturum sayısı, son görülme ve son 14 günün
        çubuk dökümü (kullanicilar/{uid}.kullanim, kullanimsure.js yazar).
     2) SINIFLAR     — öğretmenin kendi listesindeki seviye/sınıf/öğrenci
        sayıları ve sınıf sınıf döküm (userData).
     3) KAYIT ANKETİ — kullanicilar/{uid}.anket içindeki bütün sorular ve
        cevaplar, kayıt tarihiyle.

   Yeni sorgu YOK: üç bilgi de tablonun zaten okuduğu belgeden geliyor
   (teacher-admin.js, _adminOgretmenler).
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefOgretmenDetay) return;

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
    function tarih(ts) {
        try {
            var d = (ts && ts.toDate) ? ts.toDate() : (ts ? new Date(ts) : null);
            if (!d || isNaN(d)) return '—';
            return d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric',
                                               hour: '2-digit', minute: '2-digit' });
        } catch (e) { return '—'; }
    }
    function gunAdi(g) {
        try {
            var p = g.split('-');
            return new Date(+p[0], +p[1] - 1, +p[2])
                .toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
        } catch (e) { return g; }
    }

    function stil() {
        if (document.getElementById('ogd-stil')) return;
        var s = document.createElement('style');
        s.id = 'ogd-stil';
        s.textContent = [
            '#ogdOrt{position:fixed; inset:0; z-index:10000; display:flex; align-items:center;',
            '  justify-content:center; padding:18px; background:rgba(16,22,34,.55);}',
            '#ogdKutu{background:#fff; border-radius:18px; width:min(880px,96vw); max-height:92vh;',
            '  overflow:auto; box-shadow:0 26px 70px rgba(16,22,34,.3);}',
            '#ogdKutu .ogd-bas{position:sticky; top:0; background:#fff; z-index:2; display:flex;',
            '  align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid #E6EBF2;}',
            '#ogdKutu .ogd-ad{font-weight:900; color:#1F2430; font-size:1.08rem;}',
            '#ogdKutu .ogd-eposta{color:#8A94A3; font-size:.86rem;}',
            '#ogdKutu .ogd-kapat{margin-inline-start:auto; border:0; background:#F1F4F9; cursor:pointer;',
            '  width:34px; height:34px; border-radius:10px; font-size:1.1rem; color:#55606D;}',
            '#ogdKutu .ogd-bol{padding:16px 20px; border-bottom:1px solid #EEF2F7;}',
            '#ogdKutu h4{margin:0 0 12px; font-size:.95rem; color:#1B4F9C; font-weight:900;}',
            '#ogdKutu .ogd-kutular{display:flex; gap:10px; flex-wrap:wrap;}',
            '#ogdKutu .ogd-k{flex:1 1 150px; background:#F7F9FC; border:1px solid #E6EBF2;',
            '  border-radius:12px; padding:11px 14px;}',
            '#ogdKutu .ogd-k b{display:block; font-size:1.25rem; color:#1F2430; line-height:1.2;}',
            '#ogdKutu .ogd-k span{font-size:.78rem; color:#8A94A3; font-weight:700;}',
            '#ogdKutu .ogd-gun{display:flex; align-items:flex-end; gap:6px; height:92px; margin-top:6px;}',
            '#ogdKutu .ogd-c{flex:1 1 0; display:flex; flex-direction:column; align-items:center; gap:4px;}',
            '#ogdKutu .ogd-c i{display:block; width:100%; background:#4C8DF6; border-radius:4px 4px 0 0;',
            '  min-height:2px;}',
            '#ogdKutu .ogd-c small{font-size:.66rem; color:#8A94A3; white-space:nowrap;}',
            '#ogdKutu table{width:100%; border-collapse:collapse; font-size:.88rem;}',
            '#ogdKutu th,#ogdKutu td{text-align:start; padding:7px 9px; border-bottom:1px solid #EEF2F7;}',
            '#ogdKutu th{color:#8A94A3; font-size:.78rem; text-transform:uppercase; letter-spacing:.4px;}',
            '#ogdKutu .ogd-soru{margin:0 0 10px; padding:10px 13px; background:#F7F9FC;',
            '  border-radius:10px; border-inline-start:3px solid #4C8DF6;}',
            '#ogdKutu .ogd-soru p{margin:0 0 4px; font-size:.82rem; color:#8A94A3; font-weight:700;}',
            '#ogdKutu .ogd-soru div{font-size:.95rem; color:#1F2430; font-weight:600;}',
            '#ogdKutu .ogd-yok{color:#A9B2BD; font-size:.9rem;}'
        ].join('\n');
        document.head.appendChild(s);
    }

    function kapat() {
        var o = document.getElementById('ogdOrt');
        if (o) o.remove();
        document.removeEventListener('keydown', esctus, true);
    }
    function esctus(e) { if (e.key === 'Escape') kapat(); }

    /* --- 1. bölüm: süre --- */
    function sureBolumu(kul) {
        var gun = kul.gun || {};
        var liste = [];
        var d = new Date();
        for (var i = 13; i >= 0; i--) {
            var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
            var a = t.getMonth() + 1, g = t.getDate();
            var ad = t.getFullYear() + '-' + (a < 10 ? '0' : '') + a + '-' + (g < 10 ? '0' : '') + g;
            liste.push({ ad: ad, sn: gun[ad] || 0 });
        }
        var en = Math.max.apply(null, liste.map(function (x) { return x.sn; }).concat([1]));
        var cubuk = liste.map(function (x) {
            var y = Math.round((x.sn / en) * 78);
            return '<div class="ogd-c" title="' + esc(gunAdi(x.ad)) + ': ' + esc(sure(x.sn)) + '">' +
                   '<i style="height:' + (x.sn ? Math.max(3, y) : 2) + 'px;' +
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

    /* --- 2. bölüm: sınıflar --- */
    function sinifBolumu(userData, say) {
        var d = null;
        try { d = userData ? JSON.parse(userData) : null; } catch (e) { }
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

    /* --- 3. bölüm: kayıt anketi --- */
    function anketBolumu(anket) {
        if (!anket) {
            return '<div class="ogd-bol"><h4>Kayıt anketi</h4>' +
                   '<p class="ogd-yok">Bu hesap anket doldurmadan açılmış (anket öncesi kayıt).</p></div>';
        }
        var c = anket.cevaplar || [];
        var govde = c.map(function (x) {
            var cev = x.cevap;
            if (Array.isArray(cev)) cev = cev.join(', ');
            return '<div class="ogd-soru"><p>' + esc(x.soru || '') + '</p>' +
                   '<div>' + (cev ? esc(cev) : '<span class="ogd-yok">—</span>') + '</div></div>';
        }).join('');
        var t = '—';
        try { t = anket.tarih ? new Date(anket.tarih).toLocaleString('tr-TR') : '—'; } catch (e) { }
        return '<div class="ogd-bol"><h4>Kayıt anketi</h4>' +
            '<p style="margin:0 0 12px; font-size:.84rem; color:#8A94A3;">' +
              'Dolduruldu: <b>' + esc(t) + '</b>' +
              (anket.rol ? ' · rol: <b>' + esc(anket.rol) + '</b>' : '') + '</p>' +
            (govde || '<p class="ogd-yok">Soru kaydı yok.</p>') + '</div>';
    }

    function ac(uid) {
        var bilgi = (window._adminOgretmenler && window._adminOgretmenler[uid]) || null;
        if (!bilgi) {
            try { if (typeof showCustomAlert === 'function') showCustomAlert('Öğretmen bilgisi bulunamadı; listeyi yenileyin.'); } catch (e) { }
            return;
        }
        stil(); kapat();
        var ort = document.createElement('div');
        ort.id = 'ogdOrt';
        ort.innerHTML = '<div id="ogdKutu" role="dialog" aria-modal="true">' +
            '<div class="ogd-bas">' +
              '<div><div class="ogd-ad">' + esc(bilgi.ad || '(isim yok)') + '</div>' +
              '<div class="ogd-eposta">' + esc(bilgi.email || '') + '</div></div>' +
              '<button type="button" class="ogd-kapat" aria-label="Kapat">&times;</button>' +
            '</div>' +
            sureBolumu(bilgi.kullanim || {}) +
            sinifBolumu(bilgi.userData || '', bilgi.ogrenci || {}) +
            anketBolumu(bilgi.anket) +
            '</div>';
        ort.addEventListener('click', function (e) {
            if (e.target === ort || (e.target.classList && e.target.classList.contains('ogd-kapat'))) kapat();
        });
        document.body.appendChild(ort);
        document.addEventListener('keydown', esctus, true);
    }

    window.KidefOgretmenDetay = { ac: ac, kapat: kapat };
    window.adminOgretmenDetay = ac;
})();
