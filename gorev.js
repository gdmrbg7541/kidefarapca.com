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
        { d: 'zamanlayaris.html',  ad: 'Zamanla Yarış' }
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

    GV.tusYerlestir = function () {
        if (!ogretmenMi()) return;
        var nav = document.getElementById('levelNav');
        if (!nav || document.getElementById('gvTus')) return;
        var b = document.createElement('button');
        b.id = 'gvTus';
        b.type = 'button';
        b.title = 'Sınıfa, seviyeye veya tek öğrenciye oyun görevi gönder';
        b.setAttribute('style',
            'display:flex; align-items:center; justify-content:center; gap:8px; width:calc(100% - 10px);' +
            'margin:0 5px 12px 5px; padding:9px 10px; border-radius:9px; cursor:pointer;' +
            'background:linear-gradient(135deg,#F39C12,#D84315); color:#fff; border:none;' +
            'box-shadow:0 2px 6px rgba(216,67,21,.25); font-family:inherit; font-size:.82rem; font-weight:700;');
        b.innerHTML = '📋 <span>Görev Gönder</span>';
        b.onclick = function () { GV.panelAc(); };
        var ist = document.getElementById('ohIstekTus');
        if (ist && ist.nextSibling) nav.insertBefore(b, ist.nextSibling);
        else if (ist) nav.appendChild(b);
        else nav.insertBefore(b, nav.firstChild);
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
            'cursor:pointer; font-family:inherit; font-weight:700; font-size:.9rem; background:transparent; color:#8B6A57;">Sonuçlar</button></div>' +
            '<div id="gvGovde" style="flex:1; overflow-y:auto; padding:16px; background:#FFF8F2;"></div></div>';
        document.body.appendChild(k);
        k.querySelector('#gvKapat').onclick = function () { k.style.display = 'none'; };
        k.querySelector('#gvSekmeYeni').onclick = function () { GV.sekme('yeni'); };
        k.querySelector('#gvSekmeSonuc').onclick = function () { GV.sekme('sonuc'); };
        return k;
    }

    GV.panelAc = function () {
        var k = katman();
        GV.sekme('yeni');
        k.style.display = 'flex';
        GV.gorevleriDinle();
    };
    GV.sekme = function (ad) {
        var y = document.getElementById('gvSekmeYeni'), s = document.getElementById('gvSekmeSonuc');
        if (y && s) {
            y.style.background = (ad === 'yeni') ? '#fff' : 'transparent';
            y.style.color = (ad === 'yeni') ? '#D84315' : '#8B6A57';
            s.style.background = (ad === 'sonuc') ? '#fff' : 'transparent';
            s.style.color = (ad === 'sonuc') ? '#D84315' : '#8B6A57';
        }
        if (ad === 'yeni') GV.yeniCiz(); else GV.sonucCiz();
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

    GV.yeniCiz = function () {
        var g = document.getElementById('gvGovde');
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
        var kayit = {
            id: id,
            ogretmenUid: u.uid,
            oyun: oyun,
            baslik: baslik,
            hedefTur: hedef.tur,
            lId: hedef.lId,
            cId: hedef.cId || null,
            ogrenciUid: hedef.ogrenciUid || null,
            hedefAd: hedefAd,
            sonTarih: sonTarih,
            performans: notMu ? { agirlik: agirlik } : null,
            aktif: true,
            olusturma: Date.now()
        };

        yaz('Gönderiliyor…');
        D.collection(C_GRV).doc(id).set(kayit).then(function () {
            if (notMu) GV.notSutunuEkle(lId, baslik, agirlik, id);
            yaz('✓ Görev gönderildi: ' + baslik + ' → ' + hedefAd +
                (notMu ? ' (performans notu, %' + agirlik + ')' : ''));
        }).catch(function (e) {
            yaz('Gönderilemedi: ' + (e && (e.message || e.code)), true);
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
                    esc(v.baslik || v.oyun) + ' → ' + esc(v.hedefAd || '') +
                    (v.sonTarih ? ' (son: ' + trTarih(v.sonTarih) + ')' : '') + '</option>';
            }).join('') + '</select>';
        g.innerHTML = sec + '<div id="gvSonucListe" style="min-height:60px;"><p style="color:#A6836E; font-size:.85rem;">Yükleniyor…</p></div>';
        GV.sonuclariGetir(id);
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
            ? '<button type="button" onclick="GV.notlaraIsle(\'' + esc(gorevId) + '\')" style="width:100%; margin-top:10px;' +
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

    /* Sonuclari, gorevin actigi hw sutununa yazar (yuzde -> not). */
    GV.notlaraIsle = function (gorevId) {
        var v = null;
        for (var i = 0; i < GV.gorevlerim.length; i++) if (GV.gorevlerim[i]._id === gorevId) v = GV.gorevlerim[i];
        var notEl = document.getElementById('gvNotIsleNot');
        var yaz = function (m, hata) { if (notEl) { notEl.style.color = hata ? '#E74C3C' : '#16A085'; notEl.textContent = m; } };
        var d = (typeof data !== 'undefined' && data) ? data : null;
        if (!v || !d || !d.levels[v.lId]) { yaz('Görev ya da seviye bulunamadı.', true); return; }

        var hw = (d.levels[v.lId].config && d.levels[v.lId].config.hw) || [];
        var ci = -1;
        for (var j = 0; j < hw.length; j++) if (hw[j].gorevId === gorevId) ci = j;
        if (ci < 0) { yaz('Bu görevin not sütunu bulunamadı (görev performans notu olarak gönderilmemiş olabilir).', true); return; }

        var harita = {};
        (GV._sonSonuclar || []).forEach(function (r) { harita[r.ogrenciUid] = r; });

        var say = 0;
        Object.keys(d.levels[v.lId].classes || {}).forEach(function (cId) {
            (d.levels[v.lId].classes[cId].students || []).forEach(function (s) {
                if (!s.hesapUid || !harita[s.hesapUid]) return;
                if (!Array.isArray(s.hw)) s.hw = [];
                s.hw[ci] = harita[s.hesapUid].yuzde || 0;
                say++;
            });
        });
        if (typeof save === 'function') save();
        try { if (typeof renderGrades === 'function') renderGrades('hw'); } catch (e) { }
        yaz('✓ ' + say + ' öğrencinin notu "' + (hw[ci].n || '') + '" sütununa işlendi.');
    };

    /* ================================================================ OGRENCI */

    GV.ogrGorevler = [];
    GV.ogrSonuclar = {};

    GV.ogrTusYerlestir = function () {
        if (document.getElementById('gvOgrTus')) return;
        var b = document.createElement('button');
        b.id = 'gvOgrTus';
        b.type = 'button';
        b.title = 'Öğretmenin gönderdiği görevler';
        b.setAttribute('style',
            'position:fixed; right:18px; bottom:84px; z-index:9900; display:flex; align-items:center; gap:8px;' +
            'padding:12px 18px; border:none; border-radius:999px; cursor:pointer; font-family:inherit;' +
            'font-weight:700; font-size:.92rem; color:#fff; background:linear-gradient(135deg,#F39C12,#D84315);' +
            'box-shadow:0 6px 18px rgba(216,67,21,.35);');
        b.innerHTML = '📋 <span>Görevlerim</span><span id="gvOgrRozet" style="display:none; align-items:center;' +
            'justify-content:center; min-width:22px; height:22px; padding:0 6px; border-radius:11px;' +
            'background:#fff; color:#D84315; font-size:.78rem; line-height:22px;"></span>';
        b.onclick = function () { GV.ogrPanelAc(); };
        document.body.appendChild(b);
    };

    GV.ogrYukle = function () {
        var u = oturum(), D = veri();
        var bag = (window.OH && OH.bag) || null;
        if (!u || !D || !bag || bag.durum !== 'onayli' || !bag.ogretmenUid) return;

        D.collection(C_GRV).where('ogretmenUid', '==', bag.ogretmenUid).get().then(function (snap) {
            var hepsi = [];
            snap.forEach(function (doc) { var v = doc.data() || {}; v._id = doc.id; hepsi.push(v); });
            GV.ogrGorevler = hepsi.filter(function (v) {
                if (v.aktif === false) return false;
                if (v.hedefTur === 'ogrenci') return v.ogrenciUid === u.uid;
                if (v.hedefTur === 'sinif') return v.lId === bag.lId && v.cId === bag.cId;
                return v.lId === bag.lId;      /* seviye */
            });
            GV.ogrGorevler.sort(function (a, b) { return (b.olusturma || 0) - (a.olusturma || 0); });
            return D.collection(C_SNC).where('ogrenciUid', '==', u.uid).get();
        }).then(function (snap) {
            if (!snap) return;
            GV.ogrSonuclar = {};
            snap.forEach(function (doc) { var r = doc.data() || {}; GV.ogrSonuclar[r.gorevId] = r; });
            var bekleyen = GV.ogrGorevler.filter(function (v) { return !GV.ogrSonuclar[v._id]; }).length;
            GV.ogrTusYerlestir();
            var r = document.getElementById('gvOgrRozet');
            if (r) { r.textContent = bekleyen ? String(bekleyen) : ''; r.style.display = bekleyen ? 'inline-flex' : 'none'; }
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

    GV.ogrListeCiz = function () {
        var g = document.getElementById('gvOgrGovde');
        if (!g) return;
        if (!GV.ogrGorevler.length) {
            g.innerHTML = '<div style="text-align:center; padding:34px 12px; color:#8B6A57;">' +
                '<p style="margin:0; font-size:1rem;">Şimdilik görev yok.</p>' +
                '<p style="margin:8px 0 0; font-size:.85rem; color:#A6836E;">Öğretmenin görev gönderince burada görünür.</p></div>';
            return;
        }
        var simdi = Date.now();
        g.innerHTML = GV.ogrGorevler.map(function (v) {
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
        }).join('');
    };

    /* ================================================================ BASLATMA */

    var denemeSayisi = 0;
    GV.baslat = function () {
        if (ogretmenMi()) {
            GV.tusYerlestir();
            var eskiTus = document.getElementById('gvOgrTus');
            if (eskiTus) eskiTus.remove();
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
    }

    function kur() {
        sarmala();
        setTimeout(function () { try { GV.baslat(); } catch (e) { } }, 2200);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
