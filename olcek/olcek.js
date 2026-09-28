/* ==================================================================
   DEĞERLENDİRME ÖLÇEĞİ — puanlama ve evrak (olcek.html)
   ------------------------------------------------------------------
   NE YAPAR: MEB'in kitap karekodundan inen dereceli puanlama
   ölçeklerini ekranda bir EVRAK gibi gösterir; öğretmen her ölçüt için
   bir dereceye tıklar, toplam ve 100'lük karşılık kendiliğinden
   hesaplanır, sayfa A4 PDF olarak iner.

   ADLANDIRMA (mevzuat): ortaokul ve imam-hatip ortaokulunda öğrenci
   başarısı "sınavlar, DERS ETKİNLİKLERİNE KATILIM ve varsa PROJE"
   ile değerlendirilir; ortaöğretimde (lise/AİHL) ölçme araçları
   "yazılı ve uygulamalı sınavlar, PERFORMANS ÇALIŞMASI ve PROJE"dir.
   Bu yüzden 5-8. sınıfta "Ders Etkinliklerine Katılım", 9-12'de
   "Performans Çalışması" adı kullanılıyor; "Proje" ikisinde de aynı.

   VERİ: olcek/olcekveri.js  — kitaptaki ölçekler (ÜRETİLMİŞ; Arapça
                               metinler MEB dosyalarından okundu)
         olcek/olcekgenel.js — o sınıf için kitap ölçeği yoksa
                               kullanılan Türkçe genel ölçekler
   PDF : sistem/kagitpdf.js  (pano da aynı dosyayı kullanıyor)
   ================================================================== */
(function () {
    'use strict';

    var el = function (id) { return document.getElementById(id); };
    function esc(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ---------------- sabitler ---------------- */
    var SINIFLAR = [5, 6, 7, 8, 9, 10, 11, 12];
    function ortaokulMu(s) { return s <= 8; }

    /* Tür adları seviyeye göre değişiyor (yukarıdaki mevzuat notu). */
    function turler(sinif) {
        return [
            { id: 'proje', ad: 'Proje', belge: 'PROJE DEĞERLENDİRME ÖLÇEĞİ' },
            ortaokulMu(sinif)
                ? { id: 'performans', ad: 'Ders Etkinliklerine Katılım',
                    belge: 'DERS ETKİNLİKLERİNE KATILIM DEĞERLENDİRME ÖLÇEĞİ' }
                : { id: 'performans', ad: 'Performans Çalışması',
                    belge: 'PERFORMANS ÇALIŞMASI DEĞERLENDİRME ÖLÇEĞİ' }
        ];
    }
    function turNotu(sinif) {
        return ortaokulMu(sinif)
            ? 'Ortaokul ve imam-hatip ortaokulunda puan "ders etkinliklerine katılım" adıyla verilir.'
            : 'Ortaöğretimde (Anadolu imam-hatip lisesi dâhil) puan "performans çalışması" adıyla verilir.';
    }

    var DERECE_AD = ['Geliştirilmeli', 'Orta', 'İyi', 'Çok iyi'];

    /* ---------------- durum ---------------- */
    var D = {
        sinif: 9, tur: 'performans', olcekId: '',
        okul: '', ders: 'Arapça', yil: '', donem: '1. Dönem',
        gorev: '', tarih: '', ogretmen: '',
        liste: '', secili: 0,
        puan: {}          /* puan[ogrenciAnahtar][olcutNo] = derece (1-4) */
    };

    function kaydet() {
        try { localStorage.setItem('kidefOlcek', JSON.stringify(D)); } catch (e) { }
    }
    function yukle() {
        try {
            var t = localStorage.getItem('kidefOlcek');
            if (t) { var v = JSON.parse(t); Object.keys(v).forEach(function (k) { D[k] = v[k]; }); }
        } catch (e) { }
    }

    /* ---------------- ölçek seçimi ---------------- */
    function tumOlcekler() {
        var a = (window.OLCEK_VERI || []).map(function (o) {
            return {
                id: o.id, sinif: o.sinif, kaynak: 'kitap',
                ad: (o.sinif ? o.sinif + '. sınıf · ' : '') +
                    (o.unite ? o.unite + '. ünite · ' : '') +
                    (o.sayfa ? 's.' + o.sayfa : 'ölçek'),
                baslikAr: o.baslikAr, olcutler: o.olcutler
            };
        });
        (window.OLCEK_GENEL || []).forEach(function (o) {
            a.push({
                id: o.id, sinif: 0, kaynak: 'genel', tur: o.tur,
                ad: 'Genel · ' + (o.tur === 'proje' ? 'proje' : 'performans'),
                baslikAr: '', baslikTr: o.baslikTr, olcutler: o.olcutler
            });
        });
        return a;
    }
    function olcekBul(id) {
        var h = tumOlcekler().filter(function (o) { return o.id === id; });
        return h[0] || null;
    }
    function uygunOlcekler() {
        return tumOlcekler().filter(function (o) {
            if (o.kaynak === 'genel') return !o.tur || o.tur === D.tur;
            return !o.sinif || o.sinif === D.sinif;
        });
    }

    /* ---------------- öğrenciler ---------------- */
    function ogrenciler() {
        var l = String(D.liste || '').split('\n').map(function (s) { return s.trim(); })
            .filter(Boolean).map(function (s) {
                var m = s.match(/^(\d+)[\s.\-)]+(.+)$/);
                return m ? { no: m[1], ad: m[2].trim() } : { no: '', ad: s };
            });
        return l.length ? l : [{ no: '', ad: '' }];
    }
    function anahtar(o) { return (o.no || '') + '|' + (o.ad || ''); }

    /* ---------------- kâğıt ---------------- */
    function belgeAdi() {
        var t = turler(D.sinif).filter(function (x) { return x.id === D.tur; })[0];
        return t ? t.belge : '';
    }

    function kagitHtml(ogr, olcek, puanlar) {
        var satir = '', toplam = 0, enCok = (olcek.olcutler || []).length * 4;
        (olcek.olcutler || []).forEach(function (c, i) {
            var secim = puanlar[i] || 0;
            if (secim) toplam += secim;
            var hucre = '';
            (c.dereceler || []).forEach(function (d) {
                var metin = d.ar || d.tr || '';
                var yon = d.ar ? ' dir="rtl" lang="ar"' : '';
                hucre += '<td class="olc-d' + (secim === d.puan ? ' secili' : '') +
                    '" data-c="' + i + '" data-p="' + d.puan + '"' + yon + '>' +
                    '<span class="olc-dpuan olc-lat">' + d.puan + '</span>' +
                    '<span class="olc-dmetin">' + esc(metin) + '</span></td>';
            });
            satir += '<tr>' +
                '<th class="olc-olcut">' +
                    (c.ar ? '<span class="olc-ar" dir="rtl" lang="ar">' + esc(c.ar) + '</span>' : '') +
                    (c.tr ? '<span class="olc-tr olc-lat">' + esc(c.tr) + '</span>' : '') +
                '</th>' + hucre +
                '<td class="olc-puan olc-lat">' + (secim || '') + '</td></tr>';
        });

        var yuz = enCok ? Math.round(toplam / enCok * 100) : 0;
        var basAr = olcek.baslikAr
            ? '<p class="olc-basar" dir="rtl" lang="ar">' + esc(olcek.baslikAr) + '</p>' : '';
        var basTr = olcek.baslikTr
            ? '<p class="olc-bastr olc-lat">' + esc(olcek.baslikTr) + '</p>' : '';

        function alan(etiket, deger) {
            return '<div class="olc-alan"><span>' + etiket + '</span><b>' +
                esc(deger || '—') + '</b></div>';
        }

        return '<div class="olc-ic">' +
            '<header class="olc-bas olc-lat">' +
                '<div class="olc-okul">' + esc(D.okul || '') + '</div>' +
                '<div class="olc-yil">' + esc(D.yil || '') + ' Eğitim Öğretim Yılı · ' +
                    esc(D.donem) + '</div>' +
                '<h2>' + esc(D.ders || 'Arapça') + ' Dersi<br>' + esc(belgeAdi()) + '</h2>' +
            '</header>' +
            basAr + basTr +
            '<div class="olc-kunye olc-lat">' +
                alan('Öğrenci', ogr.ad) + alan('No', ogr.no) +
                alan('Sınıf', D.sinif + '. sınıf') + alan('Tarih', D.tarih) +
                alan('Görev', D.gorev) +
            '</div>' +
            '<table class="olc-tablo"><thead><tr class="olc-lat">' +
                '<th class="olc-olcut">Ölçüt</th>' +
                DERECE_AD.map(function (a, i) {
                    return '<th>' + (i + 1) + ' puan<span>' + a + '</span></th>';
                }).join('') +
                '<th class="olc-puan">Puan</th>' +
            '</tr></thead><tbody>' + satir + '</tbody></table>' +
            '<div class="olc-sonuc olc-lat">' +
                '<div class="olc-kutu"><span>Toplam</span><b>' + toplam + ' / ' + enCok + '</b></div>' +
                '<div class="olc-kutu vurgu"><span>100 üzerinden</span><b>' + yuz + '</b></div>' +
                '<div class="olc-imza"><span>Ders Öğretmeni</span>' +
                    '<b>' + esc(D.ogretmen || '') + '</b><i>imza</i></div>' +
            '</div>' +
            '<p class="olc-dip olc-lat">' +
                (olcek.kaynak === 'kitap'
                    ? 'Ölçek ders kitabının değerlendirme ekinden alınmıştır.'
                    : 'Genel değerlendirme ölçeği.') +
                ' Puan, işaretlenen derecelerin toplamının yüzlük karşılığıdır.' +
            '</p>' +
        '</div>';
    }

    /* ---------------- özet sayfası (sınıfı indir) ---------------- */
    function ozetHtml(olcek, liste) {
        var enCok = (olcek.olcutler || []).length * 4;
        var satir = liste.map(function (o, i) {
            var p = D.puan[anahtar(o)] || {};
            var t = 0, dolu = 0;
            (olcek.olcutler || []).forEach(function (c, n) {
                if (p[n]) { t += p[n]; dolu++; }
            });
            var yuz = enCok ? Math.round(t / enCok * 100) : 0;
            return '<tr><td>' + (i + 1) + '</td><td>' + esc(o.no) + '</td>' +
                '<td class="sol">' + esc(o.ad) + '</td>' +
                '<td>' + t + ' / ' + enCok + '</td>' +
                '<td class="kalin">' + (dolu ? yuz : '—') + '</td></tr>';
        }).join('');
        return '<div class="olc-ic olc-ozetsayfa olc-lat">' +
            '<header class="olc-bas">' +
                '<div class="olc-okul">' + esc(D.okul || '') + '</div>' +
                '<div class="olc-yil">' + esc(D.yil || '') + ' Eğitim Öğretim Yılı · ' + esc(D.donem) + '</div>' +
                '<h2>' + esc(D.ders || 'Arapça') + ' Dersi<br>' + esc(belgeAdi()) + ' · Sınıf Çizelgesi</h2>' +
            '</header>' +
            '<div class="olc-kunye">' +
                '<div class="olc-alan"><span>Sınıf</span><b>' + D.sinif + '. sınıf</b></div>' +
                '<div class="olc-alan"><span>Görev</span><b>' + esc(D.gorev || '—') + '</b></div>' +
                '<div class="olc-alan"><span>Tarih</span><b>' + esc(D.tarih || '—') + '</b></div>' +
            '</div>' +
            '<table class="olc-tablo olc-ozettablo"><thead><tr>' +
                '<th>Sıra</th><th>No</th><th class="sol">Adı Soyadı</th>' +
                '<th>Toplam</th><th>Puan</th></tr></thead><tbody>' + satir + '</tbody></table>' +
            '<div class="olc-sonuc"><div class="olc-imza"><span>Ders Öğretmeni</span>' +
                '<b>' + esc(D.ogretmen || '') + '</b><i>imza</i></div></div>' +
        '</div>';
    }

    /* ---------------- çizim ---------------- */
    var kagit = el('olcKagit'), sahne = el('olcSahne');

    function ciz() {
        var olcek = olcekBul(D.olcekId) || uygunOlcekler()[0];
        if (!olcek) { kagit.innerHTML = '<p class="olc-bos">Bu sınıf için ölçek yok.</p>'; return; }
        D.olcekId = olcek.id;
        var liste = ogrenciler();
        if (D.secili >= liste.length) D.secili = 0;
        var ogr = liste[D.secili];
        var p = D.puan[anahtar(ogr)] || (D.puan[anahtar(ogr)] = {});
        kagit.innerHTML = kagitHtml(ogr, olcek, p);
        olcekle();
        tiklamalar(olcek, p);
        ozetCiz(olcek, p);
    }

    function tiklamalar(olcek, p) {
        [].forEach.call(kagit.querySelectorAll('.olc-d'), function (t) {
            t.onclick = function () {
                var c = +t.getAttribute('data-c'), d = +t.getAttribute('data-p');
                p[c] = (p[c] === d) ? 0 : d;
                kaydet(); ciz();
            };
        });
    }

    function ozetCiz(olcek, p) {
        var enCok = olcek.olcutler.length * 4, t = 0, eksik = 0;
        olcek.olcutler.forEach(function (c, i) { if (p[i]) t += p[i]; else eksik++; });
        el('olcOzet').innerHTML =
            '<div class="olc-ozk"><span>Toplam</span><b>' + t + ' / ' + enCok + '</b></div>' +
            '<div class="olc-ozk vurgu"><span>Puan</span><b>' +
                (enCok ? Math.round(t / enCok * 100) : 0) + '</b></div>' +
            (eksik ? '<p class="olc-not">' + eksik + ' ölçüt işaretlenmedi.</p>'
                   : '<p class="olc-not tamam">Bütün ölçütler işaretlendi.</p>');
    }

    /* Kâğıt, boş alana sığacak kadar büyük olsun (A4 dikey oranı). */
    function olcekle() {
        var c = getComputedStyle(sahne);
        var yatay = parseFloat(c.paddingLeft) + parseFloat(c.paddingRight);
        var dikey = parseFloat(c.paddingTop) + parseFloat(c.paddingBottom);
        var en = Math.max(320, sahne.clientWidth - yatay);
        var boy = Math.max(400, sahne.clientHeight - dikey);
        kagit.style.setProperty('--ae', Math.floor(Math.min(en, boy / 1.41421)) + 'px');
    }
    var z = 0;
    window.addEventListener('resize', function () {
        clearTimeout(z); z = setTimeout(olcekle, 120);
    });

    /* ---------------- sol panel ---------------- */
    function panelKur() {
        el('olcSinif').innerHTML = SINIFLAR.map(function (s) {
            return '<option value="' + s + '"' + (s === D.sinif ? ' selected' : '') + '>' +
                s + '. sınıf</option>';
        }).join('');
        turSec();
        olcekSec();
        el('olcTurNot').textContent = turNotu(D.sinif);

        [['olcOkul', 'okul'], ['olcDers', 'ders'], ['olcYil', 'yil'], ['olcDonem', 'donem'],
         ['olcGorev', 'gorev'], ['olcTarih', 'tarih'], ['olcOgretmen', 'ogretmen'],
         ['olcListe', 'liste']].forEach(function (x) {
            var e = el(x[0]);
            e.value = D[x[1]] || '';
            e.oninput = e.onchange = function () {
                D[x[1]] = e.value; kaydet();
                if (x[1] === 'liste') ogrenciCiz();
                ciz();
            };
        });
        ogrenciCiz();
    }

    function turSec() {
        var t = turler(D.sinif);
        if (!t.some(function (x) { return x.id === D.tur; })) D.tur = t[0].id;
        el('olcTur').innerHTML = t.map(function (x) {
            return '<option value="' + x.id + '"' + (x.id === D.tur ? ' selected' : '') + '>' +
                esc(x.ad) + '</option>';
        }).join('');
    }

    function olcekSec() {
        var u = uygunOlcekler();
        if (!u.some(function (o) { return o.id === D.olcekId; })) D.olcekId = u.length ? u[0].id : '';
        el('olcOlcek').innerHTML = u.map(function (o) {
            return '<option value="' + o.id + '"' + (o.id === D.olcekId ? ' selected' : '') + '>' +
                esc(o.ad) + '</option>';
        }).join('') || '<option value="">—</option>';
    }

    function ogrenciCiz() {
        var l = ogrenciler();
        el('olcOgrenciler').innerHTML = l.map(function (o, i) {
            var p = D.puan[anahtar(o)] || {};
            var dolu = Object.keys(p).filter(function (k) { return p[k]; }).length;
            return '<button type="button" data-i="' + i + '" aria-current="' + (i === D.secili) + '">' +
                '<span>' + esc(o.no ? o.no + ' · ' : '') + esc(o.ad || 'Öğrenci') + '</span>' +
                (dolu ? '<i>' + dolu + '</i>' : '') + '</button>';
        }).join('');
        [].forEach.call(el('olcOgrenciler').querySelectorAll('button'), function (b) {
            b.onclick = function () { D.secili = +b.getAttribute('data-i'); kaydet(); ogrenciCiz(); ciz(); };
        });
    }

    el('olcSinif').onchange = function () {
        D.sinif = +this.value; turSec(); olcekSec();
        el('olcTurNot').textContent = turNotu(D.sinif);
        kaydet(); ciz();
    };
    el('olcTur').onchange = function () { D.tur = this.value; olcekSec(); kaydet(); ciz(); };
    el('olcOlcek').onchange = function () { D.olcekId = this.value; kaydet(); ciz(); };
    el('olcTemizle').onclick = function () {
        var o = ogrenciler()[D.secili];
        D.puan[anahtar(o)] = {}; kaydet(); ogrenciCiz(); ciz();
    };

    /* ---------------- indirme ---------------- */
    function durum(t) { el('olcDurum').textContent = t || ''; }

    function dosyaAdi(ogr) {
        var t = turler(D.sinif).filter(function (x) { return x.id === D.tur; })[0];
        return (D.sinif + '. sinif ') + (t ? t.ad : '') +
               (ogr ? ' - ' + (ogr.no ? ogr.no + ' ' : '') + ogr.ad : ' - sinif cizelgesi');
    }

    el('olcIndir').onclick = function () {
        var ogr = ogrenciler()[D.secili];
        durum('Hazırlanıyor…');
        window.KidefKagit.indir({
            kagitlar: [kagit], boy: 'A4', ad: dosyaAdi(ogr),
            bitti: function (h) { durum(h ? 'Olmadı' : ''); }
        });
    };

    /* Sınıfı indir: her öğrenciye bir sayfa + sonda özet çizelge.
       Sayfalar sırayla çizilip tek PDF'te birleştiriliyor; ekrandaki
       kâğıt en sonda seçili öğrenciye geri döndürülüyor. */
    el('olcTopluTus').onclick = function () {
        var olcek = olcekBul(D.olcekId);
        var liste = ogrenciler();
        if (!olcek || !liste.length) return;
        durum('Sayfalar hazırlanıyor…');

        var gizli = document.createElement('div');
        gizli.className = 'olc-gizli';
        document.body.appendChild(gizli);

        var kagitlar = [];
        liste.forEach(function (o, i) {
            var k = document.createElement('div');
            k.className = 'olc-kagit';
            k.id = 'olcToplu' + i;
            k.style.setProperty('--ae', window.KidefKagit.KAYNAK_EN + 'px');
            k.innerHTML = kagitHtml(o, olcek, D.puan[anahtar(o)] || {});
            gizli.appendChild(k);
            kagitlar.push(k);
        });
        var oz = document.createElement('div');
        oz.className = 'olc-kagit';
        oz.id = 'olcTopluOzet';
        oz.style.setProperty('--ae', window.KidefKagit.KAYNAK_EN + 'px');
        oz.innerHTML = ozetHtml(olcek, liste);
        gizli.appendChild(oz);
        kagitlar.push(oz);

        window.KidefKagit.indir({
            kagitlar: kagitlar, boy: 'A4', ad: dosyaAdi(null),
            bitti: function (h) {
                gizli.remove();
                durum(h ? 'Olmadı' : '');
            }
        });
    };

    /* ---------------- kurulum ---------------- */
    yukle();
    if (!D.yil) {
        var b = new Date(), y = b.getFullYear(), a = b.getMonth();
        D.yil = (a >= 7 ? y : y - 1) + '-' + (a >= 7 ? y + 1 : y);
    }
    if (!D.tarih) D.tarih = new Date().toISOString().slice(0, 10);

    /* Adresten sınıf ve tür: index'teki belge kartı buradan açıyor
       (olcek.html?sinif=7&tur=proje). */
    var s = new URLSearchParams(location.search);
    if (s.get('sinif')) D.sinif = Math.max(5, Math.min(12, +s.get('sinif') || D.sinif));
    if (s.get('tur') === 'proje' || s.get('tur') === 'performans') D.tur = s.get('tur');

    panelKur();
    ciz();

    /* sınama kancası */
    window.__olcek = {
        durum: function () {
            var t = kagit.querySelectorAll('.olc-tablo tbody tr').length;
            var ic = kagit.querySelector('.olc-ic');
            return {
                sinif: D.sinif, tur: D.tur, olcek: D.olcekId,
                olcut: t, ogrenci: ogrenciler().length, secili: D.secili,
                tasma: ic ? ic.scrollHeight - kagit.clientHeight : null,
                puan: (kagit.querySelector('.olc-kutu.vurgu b') || {}).textContent
            };
        },
        tikla: function (c, p) {
            var t = kagit.querySelector('.olc-d[data-c="' + c + '"][data-p="' + p + '"]');
            if (t) t.click();
        },
        ayar: function (k, v) { D[k] = v; kaydet(); panelKur(); ciz(); }
    };
})();
