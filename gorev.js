/* ==========================================================================
   GOREV SISTEMI  —  gorev.js  (index.html)
   --------------------------------------------------------------------------
   OGRETMEN / YONETICI:
     - Kenar cubugunda "Görev Gönder" tusu -> pencere:
         * Yeni Görev sekmesi: oyun + hedef (seviye/sinif/ogrenci) + son tarih
           + istege bagli PERFORMANS NOTU (agirlikla seviye ayarina islenir)
         * Sonuçlar sekmesi : kendi gorevleri + ogrenci sonuclari (canli)
           + performans gorevinde "Notlara işle" tusu
     - SADECE kendi gonderdigi gorevlerin sonuclarini gorur (ogretmenUid).

   OGRENCI (hesabi ogretmenine BAGLI olan):
     - Sag altta rozetli "Görevlerim" tusu -> bekleyen/biten gorev listesi;
       tiklayinca oyun  oyun.html?gorev=<id>  ile yeni sekmede acilir,
       sonuc gorevkopru.js uzerinden buluta yazilir.

   FIRESTORE:  gorevler/{id}  +  gorevSonuc/{id_ogrenciUid}
   ========================================================================== */
(function () {
    'use strict';

    var GV = window.GV = window.GV || {};

    var C_GRV = 'gorevler';
    var C_SNC = 'gorevSonuc';

    /* Gorev verilebilen oyunlar (kopru baglananlar). */
    GV.OYUNLAR = [
        { d: 'hangiharf.html',     ad: 'Hangi Harf?' },
        { d: 'klavyeoyunu.html',   ad: 'Klavye Oyunu' },
        { d: 'testkapismasi.html', ad: 'Test Kapışması' },
        { d: 'renkler.html',       ad: 'Renkler' },
        { d: 'kokutani.html',      ad: 'Kökü Tanı' },
        { d: 'zamanlayaris.html',  ad: 'Zamanla Yarış' },
        /* Alfabe sayfasindaki Yarisma sekmesi — puan YALNIZ tek kisilik
           moddan gelir (iki kisilik mod sonuc gondermez). */
        { d: 'alfabe.html',        ad: 'Alfabe Yarışması (Tek Kişilik)' }
    ];

    /* ---------------------------------------------------------------- yardimcilar */
    function fb() { return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase : null; }
    function oturum() { var f = fb(); try { return (f && f.auth) ? f.auth().currentUser : null; } catch (e) { return null; } }
    function veri() {
        var f = fb(); if (!f) return null;
        try { if (typeof db !== 'undefined' && db) return db; return f.firestore(); } catch (e) { return null; }
    }
    function rol() { try { return (typeof appState !== 'undefined' && appState.userRole) ? appState.userRole : ''; } catch (e) { return ''; } }
    function ogretmenMi() { var r = rol(); return r === 'teacher' || r === 'admin'; }
    function esc(s) {
        if (typeof behKacis === 'function') return behKacis(s);
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
        });
    }
    function ikon(n, c) { return (typeof llIcon === 'function') ? llIcon(n, c) : ''; }
    function oyunAdi(d) {
        for (var i = 0; i < GV.OYUNLAR.length; i++) if (GV.OYUNLAR[i].d === d) return GV.OYUNLAR[i].ad;
        return d;
    }
    function trTarih(ts) {
        if (!ts) return '';
        var d = new Date(ts), i = function (n) { return String(n).padStart(2, '0'); };
        return i(d.getDate()) + '.' + i(d.getMonth() + 1) + '.' + d.getFullYear();
    }
    function yeniId() {
        var h = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '';
        for (var i = 0; i < 6; i++) r += h.charAt(Math.floor(Math.random() * h.length));
        return 'G' + Date.now().toString(36).toUpperCase() + r;
    }

    /* ================================================================ OGRETMEN */

    GV.gorevlerim = [];      /* kendi gonderdigi gorevler   */
    GV._grvAbone = null;
    GV._sncAbone = null;

    /* Kenar cubugu tusu KALDIRILDI: Gorev Gonder artik sinif sekmelerinde
       yasar (tab9 -> GV.sekmeGorevCiz). Eski surumden kalan tus temizlenir. */
    GV.eskiTusuKaldir = function () {
        var t = document.getElementById('gvTus');
        if (t) t.remove();
    };

    /* ---------------- SEKME: GOREV GONDER (sinif gorunumu, tab9) ---------------- */
    GV.sekmeGorevCiz = function () {
        var p = document.getElementById('tab9');
        if (!p || !ogretmenMi()) return;
        p.innerHTML =
            '<h3 style="margin:0 0 6px;">📋 Görev Gönder</h3>' +
            '<p style="margin:0 0 14px; font-size:.85rem; color:#8B6A57;">Seçili sınıfa, bütün seviyeye ya da tek öğrenciye ' +
            'ölçülebilir oyunlardan görev gönder. Sonuçlar aşağıda canlı birikir; performans notu seçersen seviye ayarına ' +
            'otomatik sütun eklenir.</p>' +
            '<div id="gvYeniKutu" style="background:#FFF8F2; border:1px solid #F3E2D3; border-radius:14px; padding:16px; margin-bottom:24px;"></div>' +
            '<h3 style="margin:0 0 10px;">📊 Gönderilen Görevler &amp; Sonuçlar</h3>' +
            '<div id="gvGovde" style="background:#FFF8F2; border:1px solid #F3E2D3; border-radius:14px; padding:16px;"></div>';
        GV.yeniCiz('gvYeniKutu');
        /* Sinif baglami hazir gelsin: acik seviye/sinif onceden secili */
        try {
            if (typeof curLId !== 'undefined' && curLId && document.getElementById('gvSeviye')) {
                document.getElementById('gvSeviye').value = curLId;
                if (typeof curCId !== 'undefined' && curCId) {
                    document.getElementById('gvHedefTur').value = 'sinif';
                    GV.hedefCiz();
                    if (document.getElementById('gvSinif')) document.getElementById('gvSinif').value = curCId;
                    GV.ogrenciDoldur();
                } else GV.hedefCiz();
            }
        } catch (e) { }
        GV.gorevleriDinle();
        GV.sonucCiz();
    };

    /* ---------------- SEKME: ETKINLIKLER (tab11) ----------------
       Ogretmene bagli TUM ogrencilerin oynadigi olculebilir etkinliklerin
       verisi: rekorlar, gelisim cizgileri, son durum, 30 gunluk ilerleme. */
    GV.sekmeEtkinlikCiz = function () {
        var p = document.getElementById('tab11');
        if (!p || !ogretmenMi()) return;
        p.innerHTML =
            '<h3 style="margin:0 0 6px;">🏃 Etkinlikler — Öğrenci Gelişimi</h3>' +
            '<p style="margin:0 0 14px; font-size:.85rem; color:#8B6A57;">BU SINIFA kayıtlı, hesabı bağlı öğrencilerin ' +
            'ölçülebilir oyunlardaki bütün etkinliği görevden bağımsız olarak buraya düşer: rekorlar, gelişim çizgisi, ' +
            'son oynanış ve 30 günlük ilerleme. Öğrenci oynadıkça tablo kendiliğinden güncellenir.</p>' +
            '<div id="gvEtkOzet" style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px;"></div>' +
            '<div id="gvEtkGovde"><p style="color:#A6836E; font-size:.85rem;">Yükleniyor…</p></div>';
        GV.ilerlemeDinle();
        GV.etkinlikCiz();
    };

    /* ACIK SINIFIN hesap bagli ogrencileri: { hesapUid: adi } */
    function acikSinifOgrencileri() {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        var set = {};
        try {
            var ogr = d.levels[curLId].classes[curCId].students || [];
            ogr.forEach(function (s) { if (s.hesapUid) set[s.hesapUid] = s.name || ''; });
        } catch (e) { }
        return set;
    }

    GV.etkinlikCiz = function () {
        var govde = document.getElementById('gvEtkGovde');
        if (!govde) return;
        var ozet = document.getElementById('gvEtkOzet');

        /* SADECE acik siniftaki ogrencilerin kayitlari — baska siniflarin
           verisi bu sekmede gorunmez. */
        var sinif = acikSinifOgrencileri();
        var kayitlar = GV.ilerlemeler.filter(function (r) { return sinif[r.ogrenciUid] != null; });

        if (!kayitlar.length) {
            if (ozet) ozet.innerHTML = '';
            govde.innerHTML = '<div style="text-align:center; padding:30px 12px; color:#8B6A57; background:#FFF8F2;' +
                'border:1px dashed #F0C9A6; border-radius:14px;">' +
                '<p style="margin:0; font-size:.95rem;">Bu sınıfta henüz etkinlik kaydı yok.</p>' +
                '<p style="margin:8px 0 0; font-size:.83rem; color:#A6836E;">Bu sınıfa kayıtlı, hesabı bağlı bir öğrenci ' +
                'ölçülebilir oyunlardan birini oynadığında verisi kendiliğinden burada görünür.</p></div>';
            return;
        }

        /* ozet istatistikler */
        var simdi = Date.now(), hafta = 7 * 24 * 60 * 60 * 1000;
        var uidler = {}, toplamOyun = 0, rekorTop = 0, sonHafta = {};
        kayitlar.forEach(function (r) {
            uidler[r.ogrenciUid] = 1;
            toplamOyun += (r.oynama || 0);
            rekorTop += (r.rekor || 0);
            if ((r.sonTarih || 0) > simdi - hafta) sonHafta[r.ogrenciUid] = 1;
        });
        var kutu = function (deger, etiket, renk) {
            return '<div style="flex:1; min-width:130px; background:#fff; border:1px solid #F3E2D3; border-radius:13px;' +
                'padding:13px; text-align:center; box-shadow:0 2px 7px rgba(216,67,21,.05);">' +
                '<div style="font-size:1.7rem; font-weight:800; color:' + renk + ';">' + deger + '</div>' +
                '<div style="font-size:.76rem; color:#8B6A57; margin-top:3px;">' + etiket + '</div></div>';
        };
        if (ozet) ozet.innerHTML =
            kutu(Object.keys(uidler).length, 'etkin öğrenci', '#D84315') +
            kutu(toplamOyun, 'toplam oynama', '#B7950B') +
            kutu('%' + Math.round(rekorTop / kayitlar.length), 'ortalama rekor', '#16A085') +
            kutu(Object.keys(sonHafta).length, 'son 7 günde oynayan', '#7B1FA2');

        /* ogrenci kartlari (ad, sinif listesindeki satirdan gelir) */
        var grup = {};
        kayitlar.forEach(function (r) {
            if (!grup[r.ogrenciUid]) grup[r.ogrenciUid] = { ad: sinif[r.ogrenciUid] || uidAdBul(r.ogrenciUid) || r.ad || r.email || 'Öğrenci', oyunlar: [] };
            grup[r.ogrenciUid].oyunlar.push(r);
        });
        GV._etkAcik = GV._etkAcik || {};   /* hangi ogrenci akordiyonu acik? */
        govde.innerHTML = Object.keys(grup).map(function (uid) {
            var o = grup[uid];
            o.oyunlar.sort(function (a, b) { return (b.sonTarih || 0) - (a.sonTarih || 0); });
            var tOyun = 0, rTop = 0, ayTop = 0, sonT = 0;
            var satirlar = o.oyunlar.map(function (r) {
                tOyun += (r.oynama || 0); rTop += (r.rekor || 0);
                if ((r.sonTarih || 0) > sonT) sonT = r.sonTarih;
                var fark = sonAyFarki(r.gecmis, r.rekor);
                ayTop += fark;
                var renk = r.rekor >= 85 ? '#1E8449' : (r.rekor >= 50 ? '#B7950B' : '#C0392B');
                return '<div style="display:flex; align-items:center; gap:10px; padding:7px 0; border-top:1px dashed #F3E2D3; flex-wrap:wrap;">' +
                    '<span style="flex:1; min-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;' +
                    'font-size:.86rem; color:#6B4A38;">' + esc(oyunAdi(r.oyun)) + '</span>' +
                    minigrafik(r.gecmis) +
                    '<span style="width:52px; text-align:right; font-weight:800; color:' + renk + ';">%' + (r.rekor || 0) + '</span>' +
                    '<span style="width:150px; text-align:right; font-size:.73rem; color:#A6836E;">son: %' + (r.sonYuzde != null ? r.sonYuzde : (r.rekor || 0)) +
                    ' · ' + trTarih(r.sonTarih) + '</span>' +
                    '<span style="width:96px; text-align:right; font-size:.73rem; color:#A6836E;">' + (r.oynama || 0) + ' oyun' +
                    (fark > 0 ? ' · <b style="color:#16A085;">+' + fark + '</b>' : '') + '</span></div>';
            }).join('');
            var ortRekor = o.oyunlar.length ? Math.round(rTop / o.oyunlar.length) : 0;
            var oRenk = ortRekor >= 85 ? '#1E8449' : (ortRekor >= 50 ? '#B7950B' : '#C0392B');
            return '<details class="profile-accordion gv-etk-akor" data-uid="' + uid + '"' + (GV._etkAcik[uid] ? ' open' : '') +
                ' style="background:#fff; border:1px solid #F3E2D3; border-radius:13px;' +
                ' margin-bottom:12px; box-shadow:0 2px 7px rgba(216,67,21,.06);">' +
                '<summary style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:11px 15px; flex-wrap:wrap;">' +
                pastaHalka(ortRekor, oRenk) +
                '<span style="flex:1; min-width:150px;">' +
                '<span style="display:block; font-size:1.02rem; font-weight:700; color:#9C3B0C;">' + esc(o.ad) + '</span>' +
                '<span style="display:block; font-size:.76rem; color:#A6836E; margin-top:2px;">' + o.oyunlar.length +
                ' oyun · ' + tOyun + ' oynama · son etkinlik ' + trTarih(sonT) + '</span></span>' +
                (ayTop > 0 ? '<span title="Son 30 günde rekor gelişimi" style="background:#E8F8F2; color:#16A085; font-weight:800;' +
                    ' font-size:.74rem; padding:4px 9px; border-radius:20px; white-space:nowrap;">30 günde +' + ayTop + '</span>' : '') +
                '<span class="acc-chevron" style="color:#D84315; font-size:1.1rem; transition:transform .2s;">▸</span></summary>' +
                '<div style="padding:0 15px 13px;">' + satirlar + '</div></details>';
        }).join('');
        /* acik/kapali durumu hatirla — canli guncelleme (onSnapshot) yeniden
           cizdiginde acik akordiyonlar kapanmasin. */
        try {
            Array.prototype.slice.call(govde.querySelectorAll('details.gv-etk-akor')).forEach(function (dt) {
                dt.addEventListener('toggle', function () { GV._etkAcik[dt.getAttribute('data-uid')] = dt.open; });
            });
        } catch (e) { }
    };

    function katman() {
        var k = document.getElementById('gvModal');
        if (k) return k;
        k = document.createElement('div');
        k.id = 'gvModal';
        k.setAttribute('style',
            'display:none; position:fixed; inset:0; z-index:10060; background:rgba(0,0,0,.55);' +
            'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
        k.innerHTML =
            '<div style="background:#fff; width:100%; max-width:760px; max-height:88vh; border-radius:18px;' +
            'overflow:hidden; display:flex; flex-direction:column; box-shadow:0 18px 46px rgba(0,0,0,.35);">' +
            '<div style="background:linear-gradient(135deg,#F39C12 0%,#E67E22 48%,#D84315 100%); color:#fff;' +
            'padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">' +
            '<strong style="font-size:1.02rem;">📋 Görevler</strong>' +
            '<span id="gvKapat" style="cursor:pointer; font-size:26px; line-height:1;">&times;</span></div>' +
            '<div style="display:flex; gap:0; border-bottom:1px solid #F3E2D3; background:#FFF3E9;">' +
            '<button type="button" id="gvSekmeYeni" class="gv-sekme" style="flex:1; padding:11px; border:none;' +
            'cursor:pointer; font-family:inherit; font-weight:700; font-size:.9rem; background:#fff; color:#D84315;">Yeni Görev</button>' +
            '<button type="button" id="gvSekmeSonuc" class="gv-sekme" style="flex:1; padding:11px; border:none;' +
            'cursor:pointer; font-family:inherit; font-weight:700; font-size:.9rem; background:transparent; color:#8B6A57;">Sonuçlar</button>' +
            '<button type="button" id="gvSekmeIlerleme" class="gv-sekme" style="flex:1; padding:11px; border:none;' +
            'cursor:pointer; font-family:inherit; font-weight:700; font-size:.9rem; background:transparent; color:#8B6A57;">İlerleme</button></div>' +
            '<div id="gvGovde" style="flex:1; overflow-y:auto; padding:16px; background:#FFF8F2;"></div></div>';
        document.body.appendChild(k);
        k.querySelector('#gvKapat').onclick = function () { k.style.display = 'none'; };
        k.querySelector('#gvSekmeYeni').onclick = function () { GV.sekme('yeni'); };
        k.querySelector('#gvSekmeSonuc').onclick = function () { GV.sekme('sonuc'); };
        k.querySelector('#gvSekmeIlerleme').onclick = function () { GV.sekme('ilerleme'); };
        return k;
    }

    GV.panelAc = function () {
        var k = katman();
        GV.sekme('yeni');
        k.style.display = 'flex';
        GV.gorevleriDinle();
    };
    GV.sekme = function (ad) {
        var tuslar = { yeni: 'gvSekmeYeni', sonuc: 'gvSekmeSonuc', ilerleme: 'gvSekmeIlerleme' };
        Object.keys(tuslar).forEach(function (k) {
            var el = document.getElementById(tuslar[k]);
            if (!el) return;
            el.style.background = (ad === k) ? '#fff' : 'transparent';
            el.style.color = (ad === k) ? '#D84315' : '#8B6A57';
        });
        if (ad === 'yeni') GV.yeniCiz();
        else if (ad === 'ilerleme') GV.ilerlemeCiz();
        else GV.sonucCiz();
    };

    /* -------------------------------------------------- YENI GOREV SEKMESI */
    function seviyeSecenek() {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return '';
        var sira = (d.levelOrder && d.levelOrder.length) ? d.levelOrder : Object.keys(d.levels);
        return sira.map(function (lId) {
            var lvl = d.levels[lId];
            return lvl ? '<option value="' + esc(lId) + '">' + esc(lvl.name || lId) + '</option>' : '';
        }).join('');
    }

    GV.yeniCiz = function (hedefId) {
        var g = document.getElementById(hedefId || 'gvGovde');
        if (!g) return;
        var oyunlar = GV.OYUNLAR.map(function (o) {
            return '<option value="' + esc(o.d) + '">' + esc(o.ad) + '</option>';
        }).join('');
        var kutu = 'width:100%; box-sizing:border-box; padding:11px; border:1px solid #E8A87C; border-radius:10px;' +
            'font-family:inherit; font-size:.92rem; color:#6B4A38; background:#fff;';
        var etiket = 'display:block; margin:0 0 5px; font-size:.82rem; font-weight:700; color:#9C3B0C;';
        g.innerHTML =
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">' +
            '<div style="grid-column:1/-1;"><label style="' + etiket + '">Oyun</label>' +
            '<select id="gvOyun" style="' + kutu + '" onchange="GV.basligiDoldur()">' + oyunlar + '</select></div>' +
            '<div style="grid-column:1/-1;"><label style="' + etiket + '">Görev başlığı</label>' +
            '<input type="text" id="gvBaslik" maxlength="60" style="' + kutu + '"></div>' +
            '<div><label style="' + etiket + '">Kime</label>' +
            '<select id="gvHedefTur" style="' + kutu + '" onchange="GV.hedefCiz()">' +
            '<option value="seviye">Bütün seviyeye</option>' +
            '<option value="sinif">Bir sınıfa</option>' +
            '<option value="ogrenci">Tek öğrenciye</option></select></div>' +
            '<div><label style="' + etiket + '">Seviye</label>' +
            '<select id="gvSeviye" style="' + kutu + '" onchange="GV.hedefCiz()">' + seviyeSecenek() + '</select></div>' +
            '<div id="gvSinifKutu" style="display:none;"><label style="' + etiket + '">Sınıf</label>' +
            '<select id="gvSinif" style="' + kutu + '" onchange="GV.ogrenciDoldur()"></select></div>' +
            '<div id="gvOgrenciKutu" style="display:none;"><label style="' + etiket + '">Öğrenci</label>' +
            '<select id="gvOgrenci" style="' + kutu + '"></select></div>' +
            '<div><label style="' + etiket + '">Son tarih (isteğe bağlı)</label>' +
            '<input type="date" id="gvTarih" style="' + kutu + '"></div>' +
            '<div style="grid-column:1/-1; background:#FFF6EC; border:1px dashed #F0C9A6; border-radius:12px; padding:12px;">' +
            '<label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:700; color:#9C3B0C; font-size:.88rem;">' +
            '<input type="checkbox" id="gvNot" onchange="document.getElementById(\'gvNotAyar\').style.display=this.checked?\'flex\':\'none\';">' +
            'Performans notu olsun</label>' +
            '<div id="gvNotAyar" style="display:none; align-items:center; gap:10px; margin-top:10px;">' +
            '<label style="font-size:.84rem; color:#6B4A38;">Ağırlık (%):</label>' +
            '<input type="number" id="gvAgirlik" min="1" max="50" value="10" style="width:90px; padding:8px;' +
            'border:1px solid #E8A87C; border-radius:9px; font-family:inherit; text-align:center;">' +
            '<span style="font-size:.78rem; color:#A6836E;">Seviye ayarına yeni sütun eklenir; diğer ağırlıklar orantılı küçültülüp toplam %100\'de tutulur.</span></div></div>' +
            '</div>' +
            '<p id="gvYeniNot" style="min-height:18px; margin:12px 0 8px; font-size:.85rem; color:#16A085;"></p>' +
            '<button type="button" onclick="GV.gonder()" style="width:100%; padding:13px; border:none; border-radius:12px;' +
            'cursor:pointer; font-family:inherit; font-weight:700; font-size:1rem; color:#fff;' +
            'background:linear-gradient(135deg,#F39C12,#D84315);">Görevi Gönder</button>';
        GV.basligiDoldur();
        GV.hedefCiz();
    };

    GV.basligiDoldur = function () {
        var o = document.getElementById('gvOyun'), b = document.getElementById('gvBaslik');
        if (o && b) b.value = oyunAdi(o.value) + ' Görevi';
    };

    GV.hedefCiz = function () {
        var tur = (document.getElementById('gvHedefTur') || {}).value || 'seviye';
        var sk = document.getElementById('gvSinifKutu'), ok = document.getElementById('gvOgrenciKutu');
        if (sk) sk.style.display = (tur === 'sinif' || tur === 'ogrenci') ? 'block' : 'none';
        if (ok) ok.style.display = (tur === 'ogrenci') ? 'block' : 'none';
        /* sinif listesi */
        var d = (typeof data !== 'undefined' && data) ? data : null;
        var lId = (document.getElementById('gvSeviye') || {}).value;
        var ss = document.getElementById('gvSinif');
        if (ss && d && d.levels[lId] && d.levels[lId].classes) {
            ss.innerHTML = Object.keys(d.levels[lId].classes).map(function (cId) {
                return '<option value="' + esc(cId) + '">' + esc(d.levels[lId].classes[cId].name || cId) + '</option>';
            }).join('');
        }
        GV.ogrenciDoldur();
    };

    GV.ogrenciDoldur = function () {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        var lId = (document.getElementById('gvSeviye') || {}).value;
        var cId = (document.getElementById('gvSinif') || {}).value;
        var os = document.getElementById('gvOgrenci');
        if (!os || !d) return;
        var ogr = [];
        try { ogr = d.levels[lId].classes[cId].students || []; } catch (e) { ogr = []; }
        os.innerHTML = ogr.map(function (s, i) {
            var not = s.hesapUid ? '' : ' (hesap bağlı değil)';
            return '<option value="' + i + '"' + (s.hesapUid ? '' : ' disabled') + '>' + esc(s.name || ('Öğrenci ' + (i + 1))) + not + '</option>';
        }).join('') || '<option value="">— öğrenci yok —</option>';
    };

    GV.gonder = function () {
        var u = oturum(), D = veri();
        var not = document.getElementById('gvYeniNot');
        var yaz = function (m, hata) { if (not) { not.style.color = hata ? '#E74C3C' : '#16A085'; not.textContent = m; } };
        if (!u || !D || !ogretmenMi()) { yaz('Bağlantı yok ya da yetki yok.', true); return; }

        var oyun = (document.getElementById('gvOyun') || {}).value || '';
        var baslik = ((document.getElementById('gvBaslik') || {}).value || '').trim() || (oyunAdi(oyun) + ' Görevi');
        var tur = (document.getElementById('gvHedefTur') || {}).value || 'seviye';
        var lId = (document.getElementById('gvSeviye') || {}).value || '';
        var cId = (document.getElementById('gvSinif') || {}).value || '';
        var tarihStr = (document.getElementById('gvTarih') || {}).value || '';
        var notMu = !!((document.getElementById('gvNot') || {}).checked);
        var agirlik = Math.min(50, Math.max(1, parseInt((document.getElementById('gvAgirlik') || {}).value) || 10));

        if (!oyun || !lId) { yaz('Oyun ve seviye seçmelisin.', true); return; }

        var d = (typeof data !== 'undefined' && data) ? data : null;
        var hedef = { tur: tur, lId: lId };
        var hedefAd = (d && d.levels[lId] && d.levels[lId].name) || lId;
        if (tur === 'sinif' || tur === 'ogrenci') {
            if (!cId) { yaz('Sınıf seçmelisin.', true); return; }
            hedef.cId = cId;
            try { hedefAd += ' / ' + (d.levels[lId].classes[cId].name || cId); } catch (e) { }
        }
        if (tur === 'ogrenci') {
            var si = parseInt((document.getElementById('gvOgrenci') || {}).value);
            var ogr = null;
            try { ogr = d.levels[lId].classes[cId].students[si]; } catch (e) { ogr = null; }
            if (!ogr || !ogr.hesapUid) { yaz('Hesabı bağlı bir öğrenci seçmelisin.', true); return; }
            hedef.ogrenciUid = ogr.hesapUid;
            hedefAd += ' / ' + (ogr.name || '');
        }

        var sonTarih = null;
        if (tarihStr) {
            var t = new Date(tarihStr + 'T23:59:59');
            if (!isNaN(t.getTime())) sonTarih = t.getTime();
        }

        var id = yeniId();
        /* HEDEF OGRENCILERIN UID LISTESI de kaydedilir: ogrencinin bag
           kaydindaki sinif koordinati (lId/cId) eskimis olsa bile gorev
           UID uzerinden eslesir — "ogrenci gorevi goremiyor" olmaz. */
        var uids = [];
        try {
            if (hedef.tur === 'ogrenci') uids = [hedef.ogrenciUid];
            else if (hedef.tur === 'sinif') {
                (d.levels[lId].classes[cId].students || []).forEach(function (s) {
                    if (s && s.hesapUid) uids.push(s.hesapUid);
                });
            } else {   /* seviye: tum siniflarin bagli ogrencileri */
                var cls = (d.levels[lId] && d.levels[lId].classes) || {};
                Object.keys(cls).forEach(function (ck) {
                    (cls[ck].students || []).forEach(function (s) {
                        if (s && s.hesapUid) uids.push(s.hesapUid);
                    });
                });
            }
        } catch (e) { }
        var kayit = {
            id: id,
            ogretmenUid: u.uid,
            oyun: oyun,
            baslik: baslik,
            hedefTur: hedef.tur,
            lId: hedef.lId,
            cId: hedef.cId || null,
            ogrenciUid: hedef.ogrenciUid || null,
            uids: uids,
            hedefAd: hedefAd,
            sonTarih: sonTarih,
            performans: notMu ? { agirlik: agirlik,
                donem: (typeof window.llAktifDonem === 'function' ? window.llAktifDonem(lId) : 0) } : null,
            aktif: true,
            olusturma: Date.now()
        };

        yaz('Gönderiliyor…');
        D.collection(C_GRV).doc(id).set(kayit).then(function () {
            if (notMu) GV.notSutunuEkle(lId, baslik, agirlik, id);
            yaz('✓ Görev gönderildi: ' + baslik + ' → ' + hedefAd +
                (notMu ? ' (performans notu, %' + agirlik + ')' : ''));
        }).catch(function (e) {
            var m = (e && (e.message || e.code)) || 'bilinmeyen hata';
            var ipucu = /permission|insufficient/i.test(m)
                ? ' — Firestore kuralları güncel değil: firestore.rules dosyasının tamamını Firebase konsolunda Firestore Database → Rules sekmesine yapıştırıp Publish etmelisin.'
                : '';
            yaz('Gönderilemedi: ' + m + ipucu, true);
        });
    };

    /* Performans gorevi: seviyenin odev (hw) yapisina yeni sutun ekler,
       oteki agirliklari orantili kucultup toplami 100'de tutar. */
    GV.notSutunuEkle = function (lId, baslik, agirlik, gorevId) {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels[lId]) return;
        var lvl = d.levels[lId];
        if (!lvl.config) lvl.config = {};
        if (!Array.isArray(lvl.config.hw)) lvl.config.hw = [];
        var hw = lvl.config.hw;
        if (hw.some(function (c) { return c.gorevId === gorevId; })) return;

        var eskiToplam = hw.reduce(function (t, c) { return t + (parseFloat(c.w) || 0); }, 0);
        if (eskiToplam > 0) {
            var oran = (100 - agirlik) / eskiToplam;
            hw.forEach(function (c) { c.w = Math.max(1, Math.round((parseFloat(c.w) || 0) * oran)); });
            /* yuvarlama farkini en buyuk sutunda kapat */
            var yeniToplam = hw.reduce(function (t, c) { return t + c.w; }, 0);
            var fark = (100 - agirlik) - yeniToplam;
            if (fark !== 0 && hw.length) {
                var enB = hw[0];
                hw.forEach(function (c) { if (c.w > enB.w) enB = c; });
                enB.w = Math.max(1, enB.w + fark);
            }
        }
        hw.push({ n: baslik, w: agirlik, gorevId: gorevId });
        if (typeof save === 'function') save();
        try { if (typeof renderGrades === 'function') renderGrades('hw'); } catch (e) { }
    };

    /* -------------------------------------------------- SONUCLAR SEKMESI */
    GV.gorevleriDinle = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return;
        if (GV._grvAbone) { try { GV._grvAbone(); } catch (e) { } GV._grvAbone = null; }
        GV._grvAbone = D.collection(C_GRV).where('ogretmenUid', '==', u.uid)
            .onSnapshot(function (snap) {
                GV.gorevlerim = [];
                snap.forEach(function (doc) { var v = doc.data() || {}; v._id = doc.id; GV.gorevlerim.push(v); });
                GV.gorevlerim.sort(function (a, b) { return (b.olusturma || 0) - (a.olusturma || 0); });
                var g = document.getElementById('gvGovde');
                if (g && g.getAttribute('data-sekme') === 'sonuc') GV.sonucCiz();
            }, function (e) { console.warn('GV gorev dinleyici:', e && (e.code || e.message)); });
    };

    GV.sonucCiz = function (secili) {
        var g = document.getElementById('gvGovde');
        if (!g) return;
        g.setAttribute('data-sekme', 'sonuc');
        if (!GV.gorevlerim.length) {
            g.innerHTML = '<div style="text-align:center; padding:34px 12px; color:#8B6A57;">' +
                '<p style="margin:0; font-size:1rem;">Henüz görev göndermedin.</p>' +
                '<p style="margin:8px 0 0; font-size:.85rem; color:#A6836E;">"Yeni Görev" sekmesinden ilk görevini gönderebilirsin.</p></div>';
            return;
        }
        var id = secili || GV._seciliGorev || GV.gorevlerim[0]._id;
        GV._seciliGorev = id;
        var sec = '<select id="gvSonucSec" onchange="GV.sonucCiz(this.value)" style="width:100%; box-sizing:border-box;' +
            'padding:11px; border:1px solid #E8A87C; border-radius:10px; font-family:inherit; font-size:.92rem;' +
            'color:#6B4A38; background:#fff; margin-bottom:12px;">' +
            GV.gorevlerim.map(function (v) {
                return '<option value="' + esc(v._id) + '"' + (v._id === id ? ' selected' : '') + '>' +
                    (v.aktif === false ? '⛔ ' : '') +
                    esc(v.baslik || v.oyun) + ' → ' + esc(v.hedefAd || '') +
                    (v.sonTarih ? ' (son: ' + trTarih(v.sonTarih) + ')' : '') + '</option>';
            }).join('') + '</select>';
        /* --- secili gorevin IPTAL / YENIDEN YAYINLA / SIL tuslari --- */
        var vSec = null;
        for (var si2 = 0; si2 < GV.gorevlerim.length; si2++) if (GV.gorevlerim[si2]._id === id) vSec = GV.gorevlerim[si2];
        var eylemTus = 'padding:9px 15px; border:none; border-radius:9px; cursor:pointer;' +
            ' font-family:inherit; font-weight:700; font-size:.84rem;';
        var eylem = '<div style="display:flex; gap:9px; flex-wrap:wrap; align-items:center; margin:0 0 12px;">' +
            ((vSec && vSec.aktif === false)
                ? '<span style="padding:8px 13px; border-radius:9px; background:#FDEDEC; color:#C0392B;' +
                  ' font-weight:700; font-size:.82rem;">⛔ İptal edildi — öğrencilere görünmüyor</span>' +
                  '<button type="button" onclick="GV.gorevAktifEt(\'' + esc(id) + '\')" style="' + eylemTus +
                  ' background:#27ae60; color:#fff;">↩ Yeniden Yayınla</button>' +
                  '<button type="button" onclick="GV.gorevSil(\'' + esc(id) + '\')" style="' + eylemTus +
                  ' background:#7B241C; color:#fff;">🗑 Kalıcı Sil</button>'
                : '<button type="button" onclick="GV.gorevIptal(\'' + esc(id) + '\')" style="' + eylemTus +
                  ' background:#fff; color:#C0392B; border:1px solid #F5B7B1;">🚫 Görevi İptal Et</button>') +
            '</div>';
        g.innerHTML = sec + eylem + '<div id="gvSonucListe" style="min-height:60px;"><p style="color:#A6836E; font-size:.85rem;">Yükleniyor…</p></div>';
        GV.sonuclariGetir(id);
    };

    /* ---------------- GOREV IPTAL / YENIDEN YAYINLA / KALICI SIL ----------------
       Iptal = aktif:false (ogrenciler goremez, vade dolunca not islenmez,
       sonuclar durur, geri alinabilir). Kalici sil = gorev tanimi silinir
       (ogrenci sonuc/rekor kayitlari YERINDE kalir). */
    GV.gorevIptal = function (id) {
        var D = veri(); if (!D) return;
        var yap = function () {
            D.collection(C_GRV).doc(id).set({ aktif: false, iptalTs: Date.now() }, { merge: true })
                .catch(function (e) { alert('İptal edilemedi: ' + ((e && (e.message || e.code)) || '')); });
        };
        if (typeof window.llOnay === 'function')
            llOnay('Bu görevi iptal etmek istiyor musun?\n\nÖğrencilerin listesinden kalkar, süresi dolsa da not işlenmez. Mevcut sonuçlar silinmez; istediğinde yeniden yayınlayabilirsin.\n\nGörev performans notuysa: Seviye Ayarları\'ndaki ödev sütununu ayrıca silmen gerekir.',
                yap, { evet: 'İptal Et', ton: 'kirmizi', baslik: '🚫 Görevi İptal Et' });
        else if (confirm('Görev iptal edilsin mi?')) yap();
    };
    GV.gorevAktifEt = function (id) {
        var D = veri(); if (!D) return;
        D.collection(C_GRV).doc(id).set({ aktif: true, iptalTs: null }, { merge: true })
            .catch(function (e) { alert('Yayınlanamadı: ' + ((e && (e.message || e.code)) || '')); });
    };
    GV.gorevSil = function (id) {
        var D = veri(); if (!D) return;
        var yap = function () {
            D.collection(C_GRV).doc(id).delete()
                .then(function () { GV._seciliGorev = null; })
                .catch(function (e) { alert('Silinemedi: ' + ((e && (e.message || e.code)) || '')); });
        };
        if (typeof window.llOnay === 'function')
            llOnay('Görev KALICI olarak silinsin mi?\n\nGörev tanımı geri getirilemez. (Öğrencilerin sonuç ve rekor kayıtları silinmez.)',
                yap, { evet: 'Kalıcı Sil', ton: 'kirmizi', baslik: '🗑 Görevi Sil' });
        else if (confirm('Kalıcı silinsin mi?')) yap();
    };

    GV.sonuclariGetir = function (gorevId) {
        var u = oturum(), D = veri();
        if (!u || !D) return;
        if (GV._sncAbone) { try { GV._sncAbone(); } catch (e) { } GV._sncAbone = null; }
        GV._sncAbone = D.collection(C_SNC)
            .where('ogretmenUid', '==', u.uid)
            .where('gorevId', '==', gorevId)
            .onSnapshot(function (snap) {
                var liste = [];
                snap.forEach(function (doc) { liste.push(doc.data() || {}); });
                GV.sonucListeCiz(gorevId, liste);
            }, function (e) {
                var el = document.getElementById('gvSonucListe');
                if (el) el.innerHTML = '<p style="color:#E74C3C; font-size:.85rem;">Sonuçlar okunamadı: ' + esc(e && (e.code || e.message)) + '</p>';
            });
    };

    /* Hedefe giren ogrenci satirlarini (ad + hesapUid) getirir. */
    function hedefOgrencileri(v) {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        var sonuc = [];
        if (!d || !d.levels[v.lId]) return sonuc;
        var siniflar = d.levels[v.lId].classes || {};
        Object.keys(siniflar).forEach(function (cId) {
            if ((v.hedefTur === 'sinif' || v.hedefTur === 'ogrenci') && cId !== v.cId) return;
            (siniflar[cId].students || []).forEach(function (s) {
                if (v.hedefTur === 'ogrenci' && s.hesapUid !== v.ogrenciUid) return;
                sonuc.push(s);
            });
        });
        return sonuc;
    }

    GV.sonucListeCiz = function (gorevId, liste) {
        var el = document.getElementById('gvSonucListe');
        if (!el) return;
        var v = null;
        for (var i = 0; i < GV.gorevlerim.length; i++) if (GV.gorevlerim[i]._id === gorevId) v = GV.gorevlerim[i];
        if (!v) { el.innerHTML = ''; return; }

        var harita = {};
        liste.forEach(function (r) { harita[r.ogrenciUid] = r; });
        var ogrenciler = hedefOgrencileri(v);
        var yapan = 0;

        var satirlar = ogrenciler.map(function (s) {
            var r = s.hesapUid ? harita[s.hesapUid] : null;
            if (r) yapan++;
            var durum = !s.hesapUid
                ? '<span style="color:#A6836E; font-size:.8rem;">hesap bağlı değil</span>'
                : (r ? '<span style="font-weight:800; color:' + (r.yuzde >= 85 ? '#1E8449' : (r.yuzde >= 50 ? '#B7950B' : '#C0392B')) + ';">%' + (r.yuzde || 0) + '</span>' +
                    '<span style="color:#A6836E; font-size:.76rem;"> · ' + (r.deneme || 1) + ' deneme' +
                    (r.gec ? ' · <b style="color:#E74C3C;">geç</b>' : '') + '</span>'
                    : '<span style="color:#B34700; font-size:.8rem;">bekleniyor</span>');
            return '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px;' +
                'background:#fff; border:1px solid #F3E2D3; border-radius:11px; padding:10px 13px; margin-bottom:8px;">' +
                '<span style="color:#6B4A38; font-size:.9rem;">' + esc(s.name || 'Öğrenci') + '</span>' +
                '<span>' + durum + '</span></div>';
        }).join('');

        var notTus = (v.performans && v.performans.agirlik)
            ? (v.notlandi ? '<p style="margin:10px 0 0; font-size:.8rem; color:#16A085;">✓ Süresi dolduğunda sonuçlar ' +
                'notlara otomatik işlendi. Geç gelen sonuçları eklemek istersen tuşa tekrar basabilirsin.</p>' : '') +
            '<button type="button" onclick="GV.notlaraIsle(\'' + esc(gorevId) + '\')" style="width:100%; margin-top:10px;' +
            'padding:12px; border:none; border-radius:11px; cursor:pointer; font-family:inherit; font-weight:700;' +
            'color:#fff; background:linear-gradient(135deg,#20C997,#16A085);">Sonuçları performans notlarına işle (%' + v.performans.agirlik + ')</button>' +
            '<p id="gvNotIsleNot" style="min-height:16px; margin:8px 0 0; font-size:.82rem; color:#16A085;"></p>'
            : '';

        el.innerHTML =
            '<div style="display:flex; justify-content:space-between; margin:0 0 10px; font-size:.83rem; color:#8B6A57;">' +
            '<span>' + oyunAdi(v.oyun) + (v.sonTarih ? ' · son tarih ' + trTarih(v.sonTarih) : '') + '</span>' +
            '<span><b>' + yapan + '</b> / ' + ogrenciler.length + ' tamamladı</span></div>' +
            (satirlar || '<p style="color:#A6836E; font-size:.85rem;">Bu hedefte öğrenci yok.</p>') + notTus;
        GV._sonSonuclar = liste;
    };

    /* CEKIRDEK: gorevin sonuclarini, gorevin actigi hw sutununa yazar.
       Donen deger: islenen ogrenci sayisi; sutun yoksa -1. Hem eldeki
       "notlara isle" tusu hem SURESI DOLAN gorevlerin otomatik islenmesi
       bunu kullanir. */
    function notaIsleCekirdek(v, sonuclar) {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!v || !d || !d.levels[v.lId]) return -1;
        var hw = (d.levels[v.lId].config && d.levels[v.lId].config.hw) || [];
        var ci = -1;
        for (var j = 0; j < hw.length; j++) if (hw[j].gorevId === v._id) ci = j;
        if (ci < 0) return -1;

        var harita = {};
        (sonuclar || []).forEach(function (r) { harita[r.ogrenciUid] = r; });

        /* Not, gorev HANGI DONEMDE verildiyse o donemin dizisine yazilir. */
        var dnm = (v.performans && parseInt(v.performans.donem)) || 0;
        var diziAl = function (s) {
            if (typeof window.llDonemNotlari === 'function') return window.llDonemNotlari(s, 'hw', dnm);
            if (!Array.isArray(s.hw)) s.hw = [];
            return s.hw;
        };
        var say = 0;
        Object.keys(d.levels[v.lId].classes || {}).forEach(function (cId) {
            (d.levels[v.lId].classes[cId].students || []).forEach(function (s) {
                if (!s.hesapUid || !harita[s.hesapUid]) return;
                diziAl(s)[ci] = harita[s.hesapUid].yuzde || 0;
                say++;
            });
        });
        if (typeof save === 'function') save();
        try { if (typeof renderGrades === 'function') renderGrades('hw'); } catch (e) { }
        return say;
    }

    /* Sonuclari, gorevin actigi hw sutununa yazar (eldeki tus). */
    GV.notlaraIsle = function (gorevId) {
        var v = null;
        for (var i = 0; i < GV.gorevlerim.length; i++) if (GV.gorevlerim[i]._id === gorevId) v = GV.gorevlerim[i];
        var notEl = document.getElementById('gvNotIsleNot');
        var yaz = function (m, hata) { if (notEl) { notEl.style.color = hata ? '#E74C3C' : '#16A085'; notEl.textContent = m; } };
        if (!v) { yaz('Görev bulunamadı.', true); return; }
        var say = notaIsleCekirdek(v, GV._sonSonuclar || []);
        if (say < 0) { yaz('Bu görevin not sütunu bulunamadı (görev performans notu olarak gönderilmemiş olabilir).', true); return; }
        yaz('✓ ' + say + ' öğrencinin notu işlendi.');
        /* Elle islendiyse otomatik tarama ayni gorevi bir daha islemesin. */
        var D = veri();
        if (D) D.collection(C_GRV).doc(v._id).set({ notlandi: true, notlanma: Date.now(), notlanan: say }, { merge: true })
            .catch(function () { });
    };

    /* SURESI DOLAN performans gorevleri: sonuclar OTOMATIK nota islenir.
       Her gorev bir kez islenir (notlandi damgasi); son tarihten sonra
       gelen gec sonuclari ogretmen isterse eldeki tusla tazeler. */
    GV._vadeCalisiyor = false;
    GV.vadesiGelenleriIsle = function (deneme) {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi() || GV._vadeCalisiyor) return;
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) {                   /* seviye verisi gec yuklenebilir */
            if ((deneme || 0) < 5) setTimeout(function () { GV.vadesiGelenleriIsle((deneme || 0) + 1); }, 2500);
            return;
        }
        GV._vadeCalisiyor = true;
        var simdi = Date.now();
        D.collection(C_GRV).where('ogretmenUid', '==', u.uid).get().then(function (snap) {
            var vadesi = [];
            snap.forEach(function (doc) {
                var v = doc.data() || {}; v._id = doc.id;
                if (v.performans && v.performans.agirlik && v.sonTarih && simdi > v.sonTarih
                    && !v.notlandi && v.aktif !== false) vadesi.push(v);
            });
            var sirayla = Promise.resolve();
            vadesi.forEach(function (v) {
                sirayla = sirayla.then(function () {
                    return D.collection(C_SNC).where('ogretmenUid', '==', u.uid).where('gorevId', '==', v._id).get()
                        .then(function (s2) {
                            var liste = [];
                            s2.forEach(function (doc) { liste.push(doc.data() || {}); });
                            var say = notaIsleCekirdek(v, liste);
                            if (say < 0) return null;   /* sutun yoksa damga vurma */
                            return D.collection(C_GRV).doc(v._id)
                                .set({ notlandi: true, notlanma: simdi, notlanan: say }, { merge: true })
                                .then(function () {
                                    console.log('GV: "' + (v.baslik || v.oyun) + '" süresi dolduğu için ' +
                                        say + ' öğrencinin notu otomatik işlendi.');
                                });
                        })
                        .catch(function (e) { console.warn('GV otomatik notlama:', e && (e.code || e.message)); });
                });
            });
            return sirayla;
        }).catch(function (e) {
            console.warn('GV vade taraması:', e && (e.code || e.message));
        }).then(function () { GV._vadeCalisiyor = false; });
    };

    /* -------------------------------------------------- ILERLEME SEKMESI

       Kaynak: ogrenciIlerleme/{uid_oyun} — gorevkopru.js her oynayista yazar
       (gorevden BAGIMSIZ). Ogretmen burada ogrencilerinin geldigi yeri,
       rekor gecmisini (mini cizgi) ve son 30 gunluk gelisimi gorur.         */

    GV.ilerlemeler = [];
    GV._ilerAbone = null;

    GV.ilerlemeDinle = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return;
        if (GV._ilerAbone) { try { GV._ilerAbone(); } catch (e) { } GV._ilerAbone = null; }
        GV._ilerAbone = D.collection('ogrenciIlerleme').where('ogretmenUid', '==', u.uid)
            .onSnapshot(function (snap) {
                GV.ilerlemeler = [];
                snap.forEach(function (doc) { GV.ilerlemeler.push(doc.data() || {}); });
                var g = document.getElementById('gvGovde');
                if (g && g.getAttribute('data-sekme') === 'ilerleme') GV.ilerlemeCiz(true);
                if (document.getElementById('gvEtkGovde')) GV.etkinlikCiz();
            }, function (e) { console.warn('GV ilerleme dinleyici:', e && (e.code || e.message)); });
    };

    /* Ogrencinin uid'inden listedeki adini bulur (ayna: hesapUid). */
    function uidAdBul(uid) {
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!d || !d.levels) return '';
        var ad = '';
        try {
            Object.keys(d.levels).forEach(function (lId) {
                var cl = d.levels[lId].classes || {};
                Object.keys(cl).forEach(function (cId) {
                    (cl[cId].students || []).forEach(function (s) {
                        if (s.hesapUid === uid && !ad) ad = s.name || '';
                    });
                });
            });
        } catch (e) { }
        return ad;
    }

    /* Kucuk pasta (halka) grafigi — kapali ogrenci akordiyonundaki ozet.
       r=15.915 -> cevre ~100 birim: dasharray degeri dogrudan yuzde olur. */
    function pastaHalka(yuzde, renk, etiket) {
        var y = Math.max(0, Math.min(100, Math.round(yuzde || 0)));
        return '<svg width="46" height="46" viewBox="0 0 36 36" style="flex:none;">' +
            '<title>' + (etiket || 'Ortalama rekor') + ': %' + y + '</title>' +
            '<circle cx="18" cy="18" r="15.915" fill="none" stroke="#F6E8DC" stroke-width="3.8"/>' +
            (y > 0 ? '<circle cx="18" cy="18" r="15.915" fill="none" stroke="' + renk + '" stroke-width="3.8"' +
                ' stroke-linecap="round" stroke-dasharray="' + y + ' ' + (100 - y) + '" transform="rotate(-90 18 18)"/>' : '') +
            '<text x="18" y="21.7" text-anchor="middle" font-size="9.6" font-weight="800" fill="' + renk + '">%' + y + '</text></svg>';
    }

    /* Mini gelisim cizgisi (rekor noktalari) — satir ici SVG. */
    function minigrafik(gecmis) {
        var g = Array.isArray(gecmis) ? gecmis : [];
        if (g.length < 2) return '<span style="color:#D5BFAE; font-size:.72rem;">— tek nokta —</span>';
        var W = 110, H = 26, P = 2;
        var t0 = g[0].t, t1 = g[g.length - 1].t || (t0 + 1);
        var ts = Math.max(1, t1 - t0);
        var pts = g.map(function (n) {
            var x = P + (W - 2 * P) * ((n.t - t0) / ts);
            var y = H - P - (H - 2 * P) * (Math.max(0, Math.min(100, n.y)) / 100);
            return x.toFixed(1) + ',' + y.toFixed(1);
        }).join(' ');
        return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" ' +
            'style="vertical-align:middle;"><polyline points="' + pts + '" fill="none" ' +
            'stroke="#D84315" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<circle cx="' + pts.split(' ').pop().split(',')[0] + '" cy="' + pts.split(' ').pop().split(',')[1] +
            '" r="2.6" fill="#16A085"/></svg>';
    }

    /* Son 30 gunluk rekor artisi: +X puan. */
    function sonAyFarki(gecmis, rekor) {
        var g = Array.isArray(gecmis) ? gecmis : [];
        if (!g.length) return 0;
        var sinir = Date.now() - 30 * 24 * 60 * 60 * 1000;
        var eskiRekor = null;
        for (var i = 0; i < g.length; i++) if (g[i].t <= sinir) eskiRekor = g[i].y;
        if (eskiRekor == null) eskiRekor = g[0].y;          /* hepsi son 30 gunde: ilk noktadan olcul */
        return Math.max(0, (rekor || 0) - eskiRekor);
    }

    GV.ilerlemeCiz = function (icten) {
        var g = document.getElementById('gvGovde');
        if (!g) return;
        g.setAttribute('data-sekme', 'ilerleme');
        if (!icten) GV.ilerlemeDinle();

        if (!GV.ilerlemeler.length) {
            g.innerHTML = '<div style="text-align:center; padding:34px 12px; color:#8B6A57;">' +
                '<p style="margin:0; font-size:1rem;">Henüz ilerleme kaydı yok.</p>' +
                '<p style="margin:8px 0 0; font-size:.85rem; color:#A6836E;">Hesabı bağlı bir öğrenci ölçülebilir ' +
                'oyunlardan birini oynadığında sonucu kendiliğinden buraya düşer — görev göndermen şart değil.</p></div>';
            return;
        }

        /* ogrenciye gore grupla */
        var grup = {};
        GV.ilerlemeler.forEach(function (r) {
            if (!grup[r.ogrenciUid]) grup[r.ogrenciUid] = { ad: uidAdBul(r.ogrenciUid) || r.ad || r.email || 'Öğrenci', oyunlar: [] };
            grup[r.ogrenciUid].oyunlar.push(r);
        });

        var kartlar = Object.keys(grup).map(function (uid) {
            var o = grup[uid];
            o.oyunlar.sort(function (a, b) { return (b.sonTarih || 0) - (a.sonTarih || 0); });
            var toplamOyun = 0, rekorToplam = 0, ayToplam = 0;
            var satirlar = o.oyunlar.map(function (r) {
                toplamOyun += (r.oynama || 0);
                rekorToplam += (r.rekor || 0);
                var fark = sonAyFarki(r.gecmis, r.rekor);
                ayToplam += fark;
                var renk = r.rekor >= 85 ? '#1E8449' : (r.rekor >= 50 ? '#B7950B' : '#C0392B');
                return '<div style="display:flex; align-items:center; gap:10px; padding:7px 0; border-top:1px dashed #F3E2D3;">' +
                    '<span style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;' +
                    'font-size:.85rem; color:#6B4A38;">' + esc(oyunAdi(r.oyun)) + '</span>' +
                    minigrafik(r.gecmis) +
                    '<span style="width:52px; text-align:right; font-weight:800; color:' + renk + ';">%' + (r.rekor || 0) + '</span>' +
                    '<span style="width:88px; text-align:right; font-size:.74rem; color:#A6836E;">' +
                    (r.oynama || 0) + ' oyun' + (fark > 0 ? ' · <b style="color:#16A085;">+' + fark + '</b>' : '') + '</span></div>';
            }).join('');
            var ortRekor = o.oyunlar.length ? Math.round(rekorToplam / o.oyunlar.length) : 0;
            return '<div style="background:#fff; border:1px solid #F3E2D3; border-radius:13px; padding:13px 15px;' +
                'margin-bottom:12px; box-shadow:0 2px 7px rgba(216,67,21,.06);">' +
                '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:8px; margin-bottom:6px;">' +
                '<span style="font-size:1rem; font-weight:700; color:#9C3B0C;">' + esc(o.ad) + '</span>' +
                '<span style="font-size:.76rem; color:#A6836E;">ort. rekor <b style="color:#B34700;">%' + ortRekor +
                '</b> · ' + toplamOyun + ' oynama' +
                (ayToplam > 0 ? ' · 30 günde <b style="color:#16A085;">+' + ayToplam + '</b> puan' : '') + '</span></div>' +
                satirlar + '</div>';
        }).join('');

        g.innerHTML =
            '<p style="margin:0 0 12px; font-size:.8rem; color:#A6836E;">Bu tablo görevden bağımsızdır: bağlı öğrencilerin ' +
            'ölçülebilir oyunlardaki <b>rekorları</b> ve gelişim çizgileri her oynayışta kendiliğinden güncellenir. ' +
            'Yeşil nokta son rekoru, <b style="color:#16A085;">+X</b> son 30 günlük ilerlemeyi gösterir.</p>' + kartlar;
    };

    /* ================================================================ OGRENCI */

    GV.ogrGorevler = [];
    GV.ogrSonuclar = {};

    /* ---- Profil sayfasindaki ogrenci kategorileri (akordiyon) ----
       Kisisel Bilgilerim'deki desenin aynisi: <details class="profile-accordion">.
       Uc kategori: Görevlerim / Genel Sonuçlarım / Öğrenci Kodum.
       (Eski yuzen alt tus kaldirildi; gorevler artik profilde yasar.)      */

    function akordiyon(id, renk, baslikHtml, icerik, acik) {
        return '<details id="' + id + '" class="glass-card profile-accordion"' + (acik ? ' open' : '') +
            ' style="margin-bottom:25px; border-bottom:4px solid ' + renk + ';">' +
            '<summary style="cursor:pointer; display:flex; align-items:center; gap:8px; color:#16A085;' +
            'font-weight:700; font-size:1.15rem; list-style:none;">' + baslikHtml +
            '<span class="acc-chevron" style="margin-left:auto; color:#16A085; transition:transform 0.2s;">▸</span></summary>' +
            '<div style="margin-top:16px; text-align:left;">' + icerik + '</div></details>';
    }

    /* ---- AVATAR YESIL NOKTA: sag ustteki profil resminde yanan bildirim
       isigi. Ogrencide: bekleyen gorev varsa. Ogretmende: yeni tamamlanan
       gorev / etkinlik varsa. "Gordum" ya da is kalmayinca soner. ---- */
    GV.noktaGuncelle = function (goster) {
        var ui = document.getElementById('user-info');
        if (!ui) return;
        var n = document.getElementById('llAvatarNokta');
        if (!goster) { if (n) n.remove(); return; }
        if (!document.getElementById('gvNoktaStil')) {
            var st = document.createElement('style');
            st.id = 'gvNoktaStil';
            st.textContent = '@keyframes llNoktaNabiz{0%{box-shadow:0 0 0 0 rgba(46,204,113,.65)}' +
                '70%{box-shadow:0 0 0 9px rgba(46,204,113,0)}100%{box-shadow:0 0 0 0 rgba(46,204,113,0)}}';
            document.head.appendChild(st);
        }
        if (!n || !ui.contains(n)) {          /* giris cizimi innerHTML'i tazeleyebilir */
            if (n) n.remove();
            n = document.createElement('span');
            n.id = 'llAvatarNokta';
            n.setAttribute('style', 'position:absolute; top:-3px; right:-3px; width:14px; height:14px;' +
                ' border-radius:50%; background:#2ECC71; border:2.5px solid #fff; z-index:6; pointer-events:none;' +
                ' animation:llNoktaNabiz 1.7s infinite;');
            ui.appendChild(n);
        }
    };

    /* ---- NOT OZETI: sinav + performans notlari ve ANLIK genel ortalama.
       Veri, ogretmenin yazdigi ayna kayittan (ogrenciOzet: odev/sinav +
       konfig + behLog) gelir; hesap ogretmen tarafindaki agirlikli
       ortalamanin birebir aynisidir (davranis etkisi dahil, 0-100 kisit). */
    function notOzetiHTML() {
        var oz = (window.OH && OH.sonOzet) || null;
        if (!oz) return '';
        var k = oz.konfig;
        if (!k || (!(k.hw || []).length && !(k.ex || []).length))
            return '<p style="margin:0 0 16px; font-size:.8rem; color:#A6836E; background:#FFF6EC;' +
                ' border:1px dashed #F0C9A6; border-radius:10px; padding:10px 14px;">📊 Sınav ve performans notların, ' +
                'öğretmenin bir sonraki kaydından sonra burada görünmeye başlayacak.</p>';
        var di = parseInt(k.aktifDonem) || 0;
        var dAd = (k.donemler && k.donemler[di]) || '1. Dönem';
        var hwN = di ? ((oz.odevD || {})[di] || []) : (oz.odev || []);
        var exN = di ? ((oz.sinavD || {})[di] || []) : (oz.sinav || []);
        var hw = 0, ex = 0;
        (k.hw || []).forEach(function (c, i) { hw += (parseFloat(hwN[i]) || 0) * ((parseFloat(c.w) || 0) / 100); });
        (k.ex || []).forEach(function (c, i) { ex += (parseFloat(exN[i]) || 0) * ((parseFloat(c.w) || 0) / 100); });
        var etki = 0;
        if (k.beh && k.beh.aktif && k.beh.ortEtki) {
            var net = 0;
            (oz.behLog || []).forEach(function (l) { net += parseInt(l && l.d) || 0; });
            var e2 = net * (parseFloat(k.beh.ortKat) || 0);
            if (e2) { var sonr = Math.max(0, Math.min(100, hw + e2)); etki = sonr - hw; hw = sonr; }
        }
        var genel = (hw + ex) / 2;
        var gRenk = genel >= 85 ? '#1E8449' : (genel >= 50 ? '#B7950B' : '#C0392B');
        var kolon = function (cfg, notlar, bosMetin) {
            if (!(cfg || []).length) return '<p style="margin:0; font-size:.78rem; color:#A6836E;">' + bosMetin + '</p>';
            return (cfg || []).map(function (c, i) {
                var v = parseFloat(notlar[i]);
                return '<div style="display:flex; justify-content:space-between; gap:10px; padding:4px 0;' +
                    ' border-bottom:1px dashed #F0E4D8; font-size:.84rem;">' +
                    '<span style="color:#6B4A38; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' +
                    esc(c.n || ('#' + (i + 1))) + ' <small style="color:#B9987F;">%' + (parseFloat(c.w) || 0) + '</small></span>' +
                    '<b style="color:#9C3B0C;">' + (isFinite(v) ? v : '—') + '</b></div>';
            }).join('');
        };
        var kutu = function (icerik) {
            return '<div style="flex:1; min-width:150px; background:#fff; border:1px solid #EFE3F5;' +
                ' border-radius:13px; padding:12px; text-align:center;">' + icerik + '</div>';
        };
        return '<div style="margin-bottom:20px;">' +
            '<div style="font-weight:800; color:#7B1FA2; margin:0 0 10px; font-size:.95rem;">📊 Notlarım ' +
            '<small style="color:#A6836E; font-weight:600;">(' + esc(dAd) + ')</small></div>' +
            '<div style="display:flex; gap:12px; flex-wrap:wrap; align-items:stretch; margin-bottom:12px;">' +
            kutu('<div style="font-size:1.55rem; font-weight:800; color:#8E44AD;">' + ex.toFixed(2) + '</div>' +
                '<div style="font-size:.75rem; color:#8B6A57; margin-top:3px;">📝 Sınav Ortalaması</div>') +
            kutu('<div style="font-size:1.55rem; font-weight:800; color:#2471A3;">' + hw.toFixed(2) +
                (etki ? ' <small style="font-size:.68rem; color:' + (etki > 0 ? '#16A085' : '#C0392B') + ';">' +
                    (etki > 0 ? '+' : '') + etki.toFixed(2) + ' davranış</small>' : '') + '</div>' +
                '<div style="font-size:.75rem; color:#8B6A57; margin-top:3px;">🎯 Performans Ortalaması</div>') +
            '<div title="Genel ortalama = (Performans + Sınav) / 2 · Şu an: ' + genel.toFixed(2) + '"' +
            ' style="flex:1; min-width:150px; background:#fff; border:2px solid ' + gRenk + '55; border-radius:13px;' +
            ' padding:8px 12px; text-align:center; display:flex; flex-direction:column; align-items:center;' +
            ' justify-content:center; gap:2px;">' +
            pastaHalka(genel, gRenk, 'Genel ortalama') +
            '<div style="font-size:.75rem; color:#8B6A57;">⭐ Genel Ortalama</div></div></div>' +
            '<div style="display:flex; gap:14px; flex-wrap:wrap;">' +
            '<div style="flex:1; min-width:210px;">' +
            '<div style="font-size:.8rem; font-weight:800; color:#8E44AD; margin-bottom:4px;">📝 Sınav Notları</div>' +
            kolon(k.ex, exN, 'Tanımlı sınav yok.') + '</div>' +
            '<div style="flex:1; min-width:210px;">' +
            '<div style="font-size:.8rem; font-weight:800; color:#2471A3; margin-bottom:4px;">🎯 Performans Notları</div>' +
            kolon(k.hw, hwN, 'Tanımlı performans görevi yok.') + '</div></div></div>';
    }

    GV.profilKartiGuncelle = function () {
        var eskiTus = document.getElementById('gvOgrTus');   /* eski surumden kalma yuzen tus */
        if (eskiTus) eskiTus.remove();
        var sec = document.getElementById('student-profile-section');
        if (!sec) return;
        var kart = document.getElementById('gvProfilKart');
        var bagli = window.OH && OH.bagliMi && OH.bagliMi();
        if (ogretmenMi()) { if (kart) kart.remove(); return; }

        /* BAGLI DEGILSE: profilde "Ogretmene Baglan / istek durumu" kategorisi
           gorunur — kod girme penceresine buradan ulasilir. */
        if (!bagli) {
            if (!kart || !sec.contains(kart)) {
                if (kart) kart.remove();
                kart = document.createElement('div');
                kart.id = 'gvProfilKart';
                var hedefB = document.getElementById('prfSatinAlma');
                if (hedefB && hedefB.parentElement === sec) sec.insertBefore(kart, hedefB);
                else sec.appendChild(kart);
            }
            var bg = (window.OH && OH.bag) || null;
            var durum = bg && bg.durum;
            var metin, tus;
            if (durum === 'bekliyor') {
                metin = 'Katılım isteğin <b>' + esc((bg && bg.ogretmenAd) || 'öğretmenine') +
                    '</b> iletildi — onay bekleniyor. Onaylanınca sınıfın burada açılır.';
                tus = 'Durumu Gör';
            } else if (durum === 'arsiv') {
                metin = 'Sınıfın öğretmenin tarafından <b>arşive kaldırıldı</b>. Sınıf geri yüklendiğinde ' +
                    'hesabın kendiliğinden yeniden bağlanır; bir şey yapman gerekmez.';
                tus = 'Durumu Gör';
            } else if (durum === 'kopuk') {
                metin = 'Önceki sınıfın öğretmenin tarafından kaldırıldı. Öğrenciliğin ve geçmiş sonuçların ' +
                    'duruyor — öğretmeninin vereceği kodla (ya da aynı kodla) <b>yeniden bağlanabilirsin</b>.';
                tus = '🎫 Kod Gir';
            } else {
                metin = 'Henüz bir öğretmene bağlı değilsin. Öğretmeninin sana verdiği kodu girerek ' +
                    'sınıfına katıl; görevler, sonuçlar ve mesajlaşma bağlandıktan sonra açılır.';
                tus = '🎫 Kod Gir';
            }
            kart.innerHTML = akordiyon('prfBaglan', '#D84315', '<span>🎓 Öğretmene Bağlan</span>' +
                (durum === 'bekliyor' ? '<span style="font-size:.72rem; font-weight:700; padding:2px 9px; border-radius:999px; background:#FEF5E7; color:#B9770E;">onay bekleniyor</span>' : ''),
                '<p style="margin:0 0 14px; font-size:.9rem; color:#6B4A38; line-height:1.6;">' + metin + '</p>' +
                '<button type="button" onclick="if(window.OH&&OH.kodModalAc)OH.kodModalAc()" style="width:100%; padding:13px;' +
                'border:none; border-radius:12px; cursor:pointer; font-family:inherit; font-weight:700; font-size:1rem;' +
                'color:#fff; background:linear-gradient(135deg,#F39C12,#D84315);">' + tus + '</button>', true);
            GV.noktaGuncelle(false);
            return;
        }
        if (!kart || !sec.contains(kart)) {
            if (kart) kart.remove();
            kart = document.createElement('div');
            kart.id = 'gvProfilKart';
            /* Satin alma akordiyonundan hemen ONCE yerlestir */
            var hedef = document.getElementById('prfSatinAlma');
            if (hedef && hedef.parentElement === sec) sec.insertBefore(kart, hedef);
            else sec.appendChild(kart);
        }
        var bag = (window.OH && OH.bag) || {};
        var bekleyen = GV.ogrGorevler.filter(function (v) { return !GV.ogrSonuclar[v._id]; }).length;

        var gorevBaslik = '<span>📋 Görevlerim</span>' +
            (bekleyen ? '<span style="display:inline-flex; align-items:center; justify-content:center; min-width:22px;' +
                'height:22px; padding:0 7px; border-radius:11px; background:#27AE60; color:#fff; font-size:.76rem;">' +
                bekleyen + '</span>' : '');

        var kodIcerik =
            '<div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">' +
            '<span style="font-size:1.25rem; font-weight:800; letter-spacing:2px; color:#D84315;' +
            'background:#FFF6EC; border:1px dashed #F0C9A6; border-radius:10px; padding:10px 18px;">' +
            esc(bag.kod || '—') + '</span>' +
            '<button type="button" onclick="GV.koduKopyala(this)" style="padding:9px 16px; border:1px solid #F0DACA;' +
            'border-radius:9px; background:#fff; color:#B34700; cursor:pointer; font-family:inherit; font-size:.82rem;' +
            'font-weight:700;">Kopyala</button></div>' +
            '<p style="margin:10px 0 0; font-size:.8rem; color:#A6836E;">Bu kod hesabını öğretmenine bağlayan koddur; ' +
            'bir daha girmen gerekmez. Öğretmenin: <b style="color:#9C3B0C;">' + esc(bag.ogretmenAd || '—') + '</b>' +
            (bag.seviyeAd ? ' · ' + esc(bag.seviyeAd) + (bag.sinifAd ? ' / ' + esc(bag.sinifAd) : '') : '') + '</p>';

        /* YESIL BILDIRIM SERIDI: ogretmen gorev paylastiginda profilde yanar */
        var bildirimSeridi = bekleyen
            ? '<div class="glass-card" style="margin-bottom:25px; border-left:5px solid #27AE60; display:flex;' +
              ' align-items:center; gap:14px; flex-wrap:wrap; cursor:pointer;"' +
              ' onclick="var d=document.getElementById(\'prfGorevler\'); if(d){ d.setAttribute(\'open\',\'\');' +
              ' d.scrollIntoView({behavior:\'smooth\', block:\'start\'}); }">' +
              '<span style="display:inline-flex; width:40px; height:40px; border-radius:50%; background:#E8F8F0;' +
              ' align-items:center; justify-content:center; font-size:1.35rem; flex:none;">🔔</span>' +
              '<span style="flex:1; min-width:180px; color:#5A4034;"><b style="color:#1E8449;">Öğretmenin görev paylaştı</b>' +
              ' — <b>' + bekleyen + ' bekleyen görevin var!</b> ' +
              '<small style="color:#8B6A57;">Görmek için tıkla.</small></span>' +
              '<span style="width:11px; height:11px; border-radius:50%; background:#2ECC71; flex:none;' +
              ' animation:llNoktaNabiz 1.7s infinite;"></span></div>'
            : '';
        kart.innerHTML = bildirimSeridi +
            akordiyon('prfGorevler', '#D84315', gorevBaslik, ogrListeHTML(6), bekleyen > 0) +
            akordiyon('prfSonuclar', '#7B1FA2', '<span>🏆 Genel Sonuçlarım</span>',
                notOzetiHTML() +
                '<div style="font-weight:800; color:#7B1FA2; margin:0 0 8px; font-size:.95rem;">🎮 Etkinlik Sonuçlarım</div>' +
                '<div id="gvPrfProfilSonuc"><p style="margin:0; font-size:.85rem; color:#A6836E;">Yükleniyor…</p></div>', false) +
            akordiyon('prfKodum', '#F39C12', '<span>🎫 Öğrenci Kodum</span>', kodIcerik, false);

        GV.sonuclariDoldur('gvPrfProfilSonuc');
        GV.noktaGuncelle(bekleyen > 0);      /* avatarda yesil isik */
    };

    /* ---------------- OGRETMEN BILDIRIMI: yeni tamamlanan gorevler ----------------
       Ogrenci bir gorevi bitirince (gorevSonuc kaydi), ogretmen profilinde
       "N gorev tamamlandi" seridi cikar. "Gordum" son gorulme zamanini
       kaydeder; ondan yeni kayitlar tekrar sayilir. */
    GV.sonucGoruldu = function () {
        var u = oturum(); if (!u) return;
        try { localStorage.setItem('gvSonucGoruldu_' + u.uid, String(Date.now())); } catch (e) { }
        window._gvYeniSonuc = { n: 0, son: null, etk: 0 };
        GV.noktaGuncelle(false);
    };
    GV.yeniSonucSay = function (sonuclar, sonGorulme) {   /* saf islev: test edilebilir */
        var n = 0, son = null;
        (sonuclar || []).forEach(function (r) {
            var t = parseInt(r && r.bitis) || 0;
            if (t > sonGorulme) {
                n++;
                if (!son || t > (parseInt(son.bitis) || 0)) son = r;
            }
        });
        return { n: n, son: son };
    };
    GV.ogretmenBildirimYukle = function () {
        var u = oturum(), D = veri();
        if (!u || !D || !ogretmenMi()) return;
        var sonGorulme = 0;
        try { sonGorulme = parseInt(localStorage.getItem('gvSonucGoruldu_' + u.uid)) || 0; } catch (e) { }
        /* Iki kaynak birden sayilir: gorev sonuclari (gorevSonuc) VE gorevden
           bagimsiz etkinlik oynanislari (ogrenciIlerleme.sonTarih). Ikisi de
           gelince serit + avatar yesil nokta guncellenir. */
        var sonuclar = null, etkinlik = null;
        var bitir = function () {
            if (sonuclar === null || etkinlik === null) return;
            var yb = GV.yeniSonucSay(sonuclar, sonGorulme);
            yb.etk = GV.yeniSonucSay(etkinlik.map(function (r) {
                return { bitis: r.sonTarih, baslik: oyunAdi(r.oyun), email: r.ad || r.email,
                         yuzde: r.sonYuzde != null ? r.sonYuzde : r.rekor };
            }), sonGorulme).n;
            window._gvYeniSonuc = yb;
            GV.noktaGuncelle((yb.n + yb.etk) > 0);
            try {
                if (window.appState && appState.currentView === 'student-profile-section' &&
                    appState.userRole === 'teacher' && typeof window.renderTeacherProfile === 'function') {
                    window.renderTeacherProfile();
                }
            } catch (e) { }
        };
        D.collection(C_SNC).where('ogretmenUid', '==', u.uid).get().then(function (snap) {
            sonuclar = [];
            snap.forEach(function (doc) { sonuclar.push(doc.data() || {}); });
            bitir();
        }).catch(function (e) { sonuclar = []; bitir(); console.warn('GV bildirim:', e && (e.code || e.message)); });
        D.collection('ogrenciIlerleme').where('ogretmenUid', '==', u.uid).get().then(function (snap) {
            etkinlik = [];
            snap.forEach(function (doc) { etkinlik.push(doc.data() || {}); });
            bitir();
        }).catch(function () { etkinlik = []; bitir(); });
    };

    /* Gorev ogrenciyle eslesiyor mu? (saf islev: test edilebilir)
       1) UID listesinde varsa KESIN gorunur — bag'daki sinif koordinati
          eskimis olsa bile ("ogrenci gorevi goremiyor" cozumu).
       2) Yoksa eski yontem: koordinat/uid eslesmesi. */
    GV.gorevEslesir = function (v, uid, bag) {
        if (!v || v.aktif === false) return false;
        if (Array.isArray(v.uids) && v.uids.indexOf(uid) >= 0) return true;
        if (v.hedefTur === 'ogrenci') return v.ogrenciUid === uid;
        if (v.hedefTur === 'sinif') return v.lId === (bag && bag.lId) && v.cId === (bag && bag.cId);
        return v.lId === (bag && bag.lId);      /* seviye */
    };

    GV.ogrYukle = function () {
        var u = oturum(), D = veri();
        var bag = (window.OH && OH.bag) || null;
        if (!u || !D || !bag || bag.durum !== 'onayli' || !bag.ogretmenUid) return;

        D.collection(C_GRV).where('ogretmenUid', '==', bag.ogretmenUid).get().then(function (snap) {
            var hepsi = [];
            snap.forEach(function (doc) { var v = doc.data() || {}; v._id = doc.id; hepsi.push(v); });
            GV.ogrGorevler = hepsi.filter(function (v) { return GV.gorevEslesir(v, u.uid, bag); });
            GV.ogrGorevler.sort(function (a, b) { return (b.olusturma || 0) - (a.olusturma || 0); });
            return D.collection(C_SNC).where('ogrenciUid', '==', u.uid).get();
        }).then(function (snap) {
            if (!snap) return;
            GV.ogrSonuclar = {};
            snap.forEach(function (doc) { var r = doc.data() || {}; GV.ogrSonuclar[r.gorevId] = r; });
            GV.profilKartiGuncelle();
            var p = document.getElementById('gvOgrGovde');
            if (p && document.getElementById('gvOgrModal') &&
                document.getElementById('gvOgrModal').style.display !== 'none') GV.ogrListeCiz();
        }).catch(function (e) { console.warn('GV ogrenci gorevleri:', e && (e.code || e.message)); });
    };

    function ogrKatman() {
        var k = document.getElementById('gvOgrModal');
        if (k) return k;
        k = document.createElement('div');
        k.id = 'gvOgrModal';
        k.setAttribute('style',
            'display:none; position:fixed; inset:0; z-index:10060; background:rgba(0,0,0,.55);' +
            'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
        k.innerHTML =
            '<div style="background:#fff; width:100%; max-width:560px; max-height:86vh; border-radius:18px;' +
            'overflow:hidden; display:flex; flex-direction:column; box-shadow:0 18px 46px rgba(0,0,0,.35);">' +
            '<div style="background:linear-gradient(135deg,#F39C12 0%,#E67E22 48%,#D84315 100%); color:#fff;' +
            'padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">' +
            '<strong style="font-size:1.02rem;">📋 Görevlerim</strong>' +
            '<span id="gvOgrKapat" style="cursor:pointer; font-size:26px; line-height:1;">&times;</span></div>' +
            '<div id="gvOgrGovde" style="flex:1; overflow-y:auto; padding:16px; background:#FFF8F2;"></div></div>';
        document.body.appendChild(k);
        k.querySelector('#gvOgrKapat').onclick = function () { k.style.display = 'none'; };
        return k;
    }

    GV.ogrPanelAc = function () {
        var k = ogrKatman();
        GV.ogrListeCiz();
        k.style.display = 'flex';
        GV.ogrYukle();
    };

    /* Gorev listesi HTML'i — hem pencerede hem profil kartinda kullanilir.
       limit verilirse o kadari gosterilir, kalani "Tümünü gör" tusuna kalir. */
    function ogrListeHTML(limit) {
        if (!GV.ogrGorevler.length) {
            return '<div style="text-align:center; padding:20px 12px; color:#8B6A57;">' +
                '<p style="margin:0; font-size:.95rem;">Şimdilik görev yok.</p>' +
                '<p style="margin:8px 0 0; font-size:.83rem; color:#A6836E;">Öğretmenin görev gönderince burada görünür.</p></div>';
        }
        var simdi = Date.now();
        var liste = limit ? GV.ogrGorevler.slice(0, limit) : GV.ogrGorevler;
        var kuyruk = (limit && GV.ogrGorevler.length > limit)
            ? '<button type="button" onclick="GV.ogrPanelAc()" style="margin-top:10px; width:100%; padding:10px;' +
            'border:1px solid #F0DACA; border-radius:10px; background:#FFF6EC; color:#B34700; cursor:pointer;' +
            'font-family:inherit; font-weight:700; font-size:.82rem;">Tümünü gör (' + GV.ogrGorevler.length + ')</button>'
            : '';
        return liste.map(function (v) {
            var r = GV.ogrSonuclar[v._id];
            var doldu = !!(v.sonTarih && simdi > v.sonTarih);
            var durum = r
                ? '<span style="font-weight:800; color:#1E8449;">✓ %' + (r.yuzde || 0) + '</span>'
                : (doldu ? '<span style="color:#E74C3C; font-weight:700;">süresi doldu</span>'
                    : '<span style="color:#B34700; font-weight:700;">seni bekliyor</span>');
            var tus = '<a href="' + esc(v.oyun) + '?gorev=' + esc(v._id) + '" target="_blank" rel="opener" ' +
                'style="display:inline-block; padding:9px 16px; border-radius:9px; text-decoration:none;' +
                'font-weight:700; font-size:.85rem; color:#fff; background:linear-gradient(135deg,' +
                (r ? '#20C997,#16A085' : '#F39C12,#D84315') + ');">' + (r ? 'Tekrar oyna' : 'Göreve başla') + '</a>';
            return '<div style="background:#fff; border:1px solid #F3E2D3; border-radius:13px; padding:13px 15px;' +
                'margin-bottom:11px; box-shadow:0 2px 7px rgba(216,67,21,.06);">' +
                '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">' +
                '<span style="font-size:.98rem; color:#9C3B0C; font-weight:700;">' + esc(v.baslik || oyunAdi(v.oyun)) + '</span>' + durum + '</div>' +
                '<div style="font-size:.8rem; color:#A6836E; margin-bottom:10px;">' + esc(oyunAdi(v.oyun)) +
                (v.sonTarih ? ' · son tarih: ' + trTarih(v.sonTarih) : '') +
                (r && r.deneme > 1 ? ' · ' + r.deneme + ' deneme' : '') + '</div>' + tus + '</div>';
        }).join('') + kuyruk;
    }

    GV.ogrListeCiz = function () {
        var g = document.getElementById('gvOgrGovde');
        if (g) g.innerHTML = ogrListeHTML(0);
    };

    /* ================================================================ OGRENCI PROFILI ("Ogrenci Dunyam")

       Basliktaki roket simgesi (tab-ogrenciprofil) buraya baglanir.
       Mevcut #student-overlay ("Ogrenci Dunyasi") gercek verilerle doldurulur:
         - kimlik: ad, ogretmen, seviye/sinif, GIRIS KODU (kopyalanabilir)
         - satin alinan dersler (paketler)
         - ogretmenin verdigi gorevler (bekleyen/biten)
         - genel sonuclar: oyun rekorlari + mini gelisim cizgisi              */

    GV._profilEskiTus = null;

    GV.profilAc = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var overlay = document.getElementById('student-overlay');
        if (!overlay) return false;
        /* Katman listelerim bolumunun ICINDE durur; o bolum gizliyken
           (ogrenci ana sayfada) position:fixed bile olsa GORUNMEZ kalir.
           Ilk aciliste govdeye tasinir — ogretmen onizlemesi etkilenmez,
           cunku switchView elemani id ile bulur.                          */
        if (overlay.parentElement !== document.body) document.body.appendChild(overlay);
        if (!(window.OH && OH.bagliMi && OH.bagliMi())) {
            /* bagli degilse once kod ekrani */
            if (window.OH && typeof OH.kodModalAc === 'function') OH.kodModalAc();
            return false;
        }
        /* "Cikis Yap" tusunu profil kipinde "Kapat"a cevir (eski hali saklanir) */
        var tus = overlay.querySelector('button[onclick*="switchView"]');
        if (tus) {
            GV._profilEskiTus = { el: tus, onclick: tus.getAttribute('onclick'), metin: tus.textContent };
            tus.removeAttribute('onclick');
            tus.onclick = function () { GV.profilKapat(); };
            tus.textContent = 'Kapat';
        }
        overlay.style.display = 'block';
        GV.profilCiz();
        GV.profilVerileriYukle();
        return false;
    };

    GV.profilKapat = function () {
        var overlay = document.getElementById('student-overlay');
        if (overlay) overlay.style.display = 'none';
        var h = GV._profilEskiTus;
        if (h && h.el) {
            h.el.onclick = null;
            if (h.onclick) h.el.setAttribute('onclick', h.onclick);
            h.el.textContent = h.metin || 'Çıkış Yap';
        }
        GV._profilEskiTus = null;
    };

    function profilKart(baslik, ic, arka) {
        return '<div class="student-card" style="background:' + (arka || '#fff') + '; padding:22px; border-radius:22px;' +
            'box-shadow:0 4px 15px rgba(0,0,0,.05); text-align:left;">' +
            '<h3 style="margin:0 0 12px; color:#9C3B0C; font-size:1.05rem;">' + baslik + '</h3>' + ic + '</div>';
    }

    GV.profilCiz = function () {
        var g = document.getElementById('student-dynamic-content');
        if (!g) return;
        var bag = (window.OH && OH.bag) || {};
        var ad = bag.ad || ((typeof appState !== 'undefined' && appState.currentUserName) || 'Öğrenci');

        /* kimlik + giris kodu */
        var satir = function (et, deg) {
            return '<div style="display:flex; justify-content:space-between; gap:10px; padding:6px 0;' +
                'border-bottom:1px dashed #F3E2D3; font-size:.92rem;">' +
                '<span style="color:#A6836E;">' + et + '</span><span style="color:#6B4A38; font-weight:700;' +
                'text-align:right;">' + deg + '</span></div>';
        };
        var kimlik =
            satir('Ad', esc(ad)) +
            satir('Öğretmen', esc(bag.ogretmenAd || '—')) +
            satir('Seviye / Sınıf', esc((bag.seviyeAd || '—') + (bag.sinifAd ? ' / ' + bag.sinifAd : ''))) +
            '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0 2px;">' +
            '<span style="color:#A6836E; font-size:.92rem;">Giriş kodun</span>' +
            '<span style="display:flex; align-items:center; gap:8px;">' +
            '<b style="letter-spacing:1px; color:#D84315;">' + esc(bag.kod || '—') + '</b>' +
            '<button type="button" onclick="GV.koduKopyala(this)" style="padding:5px 10px; border:1px solid #F0DACA;' +
            'border-radius:8px; background:#FFF6EC; color:#B34700; cursor:pointer; font-family:inherit; font-size:.74rem;' +
            'font-weight:700;">Kopyala</button></span></div>' +
            '<p style="margin:8px 0 0; font-size:.74rem; color:#B9A08D;">Bu kod hesabını öğretmenine bağlayan koddur; bir daha girmen gerekmez.</p>';

        /* satin alinan dersler */
        var paketler = [];
        try {
            var sahip = (appState.purchasedPackages || []);
            [].concat(appState.packages || [], appState.onlinePackages || []).forEach(function (p) {
                if (p && sahip.indexOf(p.id) >= 0) paketler.push(p.title || p.name || ('Paket ' + p.id));
            });
        } catch (e2) { }
        var dersler = paketler.length
            ? paketler.map(function (t) {
                return '<div style="display:flex; align-items:center; gap:8px; padding:7px 0;' +
                    'border-bottom:1px dashed #E8F6F1; font-size:.9rem; color:#0E6655;">✓ ' + esc(t) + '</div>';
            }).join('')
            : '<p style="margin:0; font-size:.88rem; color:#A6836E;">Henüz satın alınmış ders paketi yok.</p>';

        g.innerHTML =
            profilKart('👤 Kimliğim', kimlik, '#FFF8F2') +
            profilKart('📚 Satın Aldığım Dersler', dersler, '#F0FBF7') +
            profilKart('📋 Görevlerim', '<div id="gvPrfGorev"><p style="margin:0; font-size:.85rem; color:#A6836E;">Yükleniyor…</p></div>', '#FFF6EC') +
            profilKart('🏆 Genel Sonuçlarım', '<div id="gvPrfSonuc"><p style="margin:0; font-size:.85rem; color:#A6836E;">Yükleniyor…</p></div>', '#F4F0FF') +
            (typeof window.ogrMesajAc === 'function'
                ? '<div class="student-card" onclick="ogrMesajAc()" style="background:#FFE0B2; padding:22px; border-radius:22px;' +
                'cursor:pointer; text-align:center; box-shadow:0 4px 15px rgba(0,0,0,.05);">' +
                '<h3 style="margin:0; color:#9C3B0C;">✉️ Öğretmenimden Mesajlar</h3>' +
                '<p style="margin:8px 0 0; font-size:.82rem; color:#8B6A57;">Sadece sen ve öğretmenin görebilir.</p></div>'
                : '');
    };

    GV.koduKopyala = function (btn) {
        var kod = (window.OH && OH.bag && OH.bag.kod) || '';
        if (!kod) return;
        var bitti = function () {
            if (!btn) return;
            var eski = btn.textContent;
            btn.textContent = '✓';
            setTimeout(function () { btn.textContent = eski; }, 1400);
        };
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(kod).then(bitti, bitti); return;
            }
        } catch (e) { }
        try {
            var t = document.createElement('textarea');
            t.value = kod; document.body.appendChild(t); t.select();
            document.execCommand('copy'); document.body.removeChild(t); bitti();
        } catch (e) { }
    };

    GV.profilVerileriYukle = function () {
        var u = oturum(), D = veri();
        if (!u || !D) return;

        /* 1) gorevler (mevcut ogrenci yukleyicisini kullan, sonra ozetle) */
        var gorevBitti = function () {
            var el = document.getElementById('gvPrfGorev');
            if (!el) return;
            if (!GV.ogrGorevler.length) {
                el.innerHTML = '<p style="margin:0; font-size:.88rem; color:#A6836E;">Öğretmenin henüz görev göndermedi.</p>';
                return;
            }
            var simdi = Date.now();
            var bekleyen = GV.ogrGorevler.filter(function (v) { return !GV.ogrSonuclar[v._id]; });
            var satirlar = GV.ogrGorevler.slice(0, 5).map(function (v) {
                var r = GV.ogrSonuclar[v._id];
                var doldu = !!(v.sonTarih && simdi > v.sonTarih);
                var durum = r ? '<b style="color:#1E8449;">✓ %' + (r.yuzde || 0) + '</b>'
                    : (doldu ? '<b style="color:#E74C3C;">süresi doldu</b>' : '<b style="color:#B34700;">bekliyor</b>');
                return '<a href="' + esc(v.oyun) + '?gorev=' + esc(v._id) + '" target="_blank" rel="opener" ' +
                    'style="display:flex; justify-content:space-between; gap:8px; padding:7px 0; text-decoration:none;' +
                    'border-bottom:1px dashed #F0DACA; font-size:.88rem; color:#6B4A38;">' +
                    '<span>' + esc(v.baslik || oyunAdi(v.oyun)) + '</span>' + durum + '</a>';
            }).join('');
            el.innerHTML =
                '<p style="margin:0 0 8px; font-size:.82rem; color:#8B6A57;"><b style="color:#D84315;">' + bekleyen.length +
                '</b> bekleyen görevin var.</p>' + satirlar +
                (GV.ogrGorevler.length > 5
                    ? '<button type="button" onclick="GV.ogrPanelAc()" style="margin-top:10px; width:100%; padding:9px;' +
                    'border:1px solid #F0DACA; border-radius:9px; background:#fff; color:#B34700; cursor:pointer;' +
                    'font-family:inherit; font-weight:700; font-size:.8rem;">Tümünü gör (' + GV.ogrGorevler.length + ')</button>'
                    : '');
        };
        var bag = (window.OH && OH.bag) || null;
        if (bag && bag.ogretmenUid) {
            /* ogrYukle zaten filtre + sonuc getiriyor; bitince ozet cizilir */
            var _eski = GV.ogrGorevler.length;
            GV.ogrYukle();
            var deneme = 0;
            var bekle = setInterval(function () {
                deneme++;
                if (GV.ogrGorevler.length !== _eski || deneme > 20) { clearInterval(bekle); gorevBitti(); }
                if (deneme > 20) clearInterval(bekle);
            }, 250);
            setTimeout(gorevBitti, 5200);   /* emniyet: her durumda ciz */
        } else gorevBitti();

        /* 2) genel sonuclar: kendi rekorlari */
        GV.sonuclariDoldur('gvPrfSonuc');
    };

    /* Kendi rekorlarini verilen elemana cizer (hem profil sayfasi hem
       Ogrenci Dunyam ekrani ayni cizimi kullanir). */
    GV.sonuclariDoldur = function (elId) {
        var u = oturum(), D = veri();
        if (!u || !D || !document.getElementById(elId)) return;
        D.collection('ogrenciIlerleme').where('ogrenciUid', '==', u.uid).get().then(function (snap) {
            var el = document.getElementById(elId);
            if (!el) return;
            var liste = [];
            snap.forEach(function (doc) { liste.push(doc.data() || {}); });
            if (!liste.length) {
                el.innerHTML = '<p style="margin:0; font-size:.88rem; color:#A6836E;">Henüz kayıtlı sonucun yok. ' +
                    'Ölçülebilir oyunlardan birini oynadığında rekorların burada birikir.</p>';
                return;
            }
            liste.sort(function (a, b) { return (b.rekor || 0) - (a.rekor || 0); });
            el.innerHTML = liste.map(function (r) {
                var renk = r.rekor >= 85 ? '#1E8449' : (r.rekor >= 50 ? '#B7950B' : '#C0392B');
                return '<div style="display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px dashed #E8E0F5;">' +
                    '<span style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;' +
                    'font-size:.88rem; color:#6B4A38;">' + esc(oyunAdi(r.oyun)) + '</span>' +
                    minigrafik(r.gecmis) +
                    '<span style="width:50px; text-align:right; font-weight:800; color:' + renk + ';">%' + (r.rekor || 0) + '</span>' +
                    '<span style="width:56px; text-align:right; font-size:.72rem; color:#A6836E;">' + (r.oynama || 0) + ' oyun</span></div>';
            }).join('');
        }).catch(function (e) {
            var el = document.getElementById(elId);
            if (el) el.innerHTML = '<p style="margin:0; font-size:.85rem; color:#E74C3C;">Sonuçlar okunamadı: ' + esc(e && (e.code || e.message)) + '</p>';
        });
    };

    /* ================================================================ BASLATMA */

    var denemeSayisi = 0;
    GV.baslat = function () {
        if (ogretmenMi()) {
            GV.eskiTusuKaldir();
            var eskiTus = document.getElementById('gvOgrTus');
            if (eskiTus) eskiTus.remove();
            GV.vadesiGelenleriIsle();
            setTimeout(function () { try { GV.ogretmenBildirimYukle(); } catch (e) { } }, 1800);
        } else if (window.OH && OH.bagliMi && OH.bagliMi()) {
            GV.ogrYukle();
        } else if (denemeSayisi < 20) {
            /* Ogrenci baglantisi (OH.bag) gec yuklenir -> kisa araliklarla dene. */
            denemeSayisi++;
            setTimeout(GV.baslat, 1500);
        }
    };

    function sarmala() {
        if (typeof window.basariliGiris === 'function' && !window.basariliGiris._gv) {
            var _bg = window.basariliGiris;
            var yeni = function () {
                var r = _bg.apply(this, arguments);
                try { denemeSayisi = 0; setTimeout(GV.baslat, 900); } catch (e) { }
                return r;
            };
            yeni._gv = true;
            window.basariliGiris = yeni;
        }
        /* Profil sayfasi her cizildiginde "Görevlerim" karti yeniden yerlesir
           (renderStudentProfile innerHTML'i bastan kurar, kart silinir).     */
        if (typeof window.renderStudentProfile === 'function' && !window.renderStudentProfile._gv) {
            var _rp = window.renderStudentProfile;
            var yeniRp = function () {
                var r = _rp.apply(this, arguments);
                try { setTimeout(function () { GV.profilKartiGuncelle(); }, 80); } catch (e) { }
                return r;
            };
            yeniRp._gv = true;
            window.renderStudentProfile = yeniRp;
        }
        /* Kenar cubugu (levelNav) her yeniden cizildiginde icerik sifirdan
           kurulur ve tuslar SILINIR. Cizimden sonra "Görev Gönder" (ve OH'nin
           "Bekleyen İstekler") tuslari geri yerlestirilir.                   */
        if (typeof window.renderSidebar === 'function' && !window.renderSidebar._gv) {
            var _rs = window.renderSidebar;
            var yeniRs = function () {
                var r = _rs.apply(this, arguments);
                try {
                    setTimeout(function () {
                        if (ogretmenMi()) {
                            if (window.OH && typeof OH.tusYerlestir === 'function') OH.tusYerlestir();
                            GV.eskiTusuKaldir();
                        }
                    }, 60);
                } catch (e) { }
                return r;
            };
            yeniRs._gv = true;
            window.renderSidebar = yeniRs;
        }
    }

    function kur() {
        sarmala();
        setTimeout(function () { try { GV.baslat(); } catch (e) { } }, 2200);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
