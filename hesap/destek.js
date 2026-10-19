/* =====================================================================
   KİDEF · BEKLENEN DESTEK                           (hesap/destek.js)
   ---------------------------------------------------------------------
   Öğretmen (19.10.2026): "öğretmenlerden para talep edeceğiz ... bu
   bilgiyi sitede profil kısmında gösterelim, beklenen yardım adında ...
   sitedeki öğretmen sayısına bölelim ... daha çok öğretmen kayıt olması,
   böylelikle ücretin azalacağı vurgusu ... öğretmen sayısı sürekli
   güncellensin, fiyat da ... detaylar olmasın, sadece yapay zekâ ve çok
   fazla öğretmen emeği olduğu belirtilsin, güzel svg animasyonları olsun."

   KARARLAR
     · aylık toplam 30.000 TL (19.10.2026: önce 75.000, sonra "50000 olsun",
       en son "30.000 olsun");
       kişi başı en az 500 TL — bu alt sınır ÖĞRETMENE GÖSTERİLMEZ
       ("bunu bilmemeliler"): kartta yazı yok, grafik sınıra varmadan biter
     · bölünen sayı = son 30 günde siteye giren onaylı öğretmen
     · ödenmeyen tutar KAYIT TARİHİNDEN itibaren her ay birikir; kısmi
       ödeme serbest; 1-12 ay ya da yıllık seçilebilir
     · öğretmen "ödedim" diye bildirir, yönetici onaylar (ya da elle girer)
     · tutarlar sonradan yönetici panelinden değiştirilebilir

   VERİ — Firestore kurallarına DOKUNMADAN:
     mufredat/_destek          yalnız yönetici yazar, girişli herkes okur
        { toplam, taban, aktif, onayli, aylik, gecmis:{'YYYY-MM':tutar}, yoneticiler:[uid], guncelleme }
        Yönetici oturumu öğretmen listesini okuyunca (teacher-admin.js →
        renderAdminTeacherList) yeniden hesaplar; sayı/tutar değiştiyse ya
        da 6 saat geçtiyse yazar. gecmis = her ayın son tutarı (biten
        ayların tutarı sonradan değişmez). sistem/alarm.js loadMufredat
        '_' ile başlayan belgeleri paket saymaz.
     siparisler, tur:'destek'      öğretmenin ödeme bildirimi
        { uid, tur, durum:'bekliyor'|'onaylandi'|'reddedildi', tutar, ay,
          aylik, aciklama, not, kod, name, email, phone, createdAt }
        "status" alanı bilerek YOK: mağazanın Ödeme Onayları listesi
        (status=='pending') bunu paket siparişi sanıp öğrenciye
        tanımlamaya kalkmasın.
     siparisler, tur:'destekKayit' yöneticinin ödeme defteri
        { uid:<yönetici>, tur, ogretmenUid, tutar, ay, kaynak:'bildirim'|'elle',
          siparisId, not, odemeTarihi, tarih }
        uid yönetici olduğu için öğretmen bu belgeleri ne görür ne
        değiştirir: "ödenen"in asıl kaynağı burası. Yalnız uid'si
        yoneticiler listesinde olan kayıt sayılır (sahte kayıt elenir).
     kullanicilar/{öğretmen}.destek  öğretmenin kendi kartında gördüğü özet
        { odenen, adet, sonOdeme, guncelleme }  — yönetici defterden yazar.

   IBAN ve alıcı adı bu dosyada YAZILI DEĞİL: hesap/checkout.js'teki
   copyIban / openCheckoutFlow'dan okunur; IBAN değişirse tek yerden değişir.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefDestek) return;

    var VARSAYILAN = { toplam: 30000, taban: 500 };
    var GUN = 864e5;
    var SITE = 'https://kidefarapca.com';

    /* ------------------------------------------------------------------
       KÜÇÜK YARDIMCILAR
       ------------------------------------------------------------------ */
    function esc(x) {
        return String(x == null ? '' : x)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function db() { try { return firebase.firestore(); } catch (e) { return null; } }
    function sunucuZamani() { return firebase.firestore.FieldValue.serverTimestamp(); }
    function benKim() { try { return firebase.auth().currentUser || null; } catch (e) { return null; } }
    function benUid() { var u = benKim(); return u ? u.uid : ''; }
    /* appState 'let' ile tanımlı: window.appState YOK, çıplak adla okunur. */
    function durum(ad) {
        try { return (typeof appState !== 'undefined' && appState) ? appState[ad] : undefined; }
        catch (e) { return undefined; }
    }
    function rol() { return durum('userRole') || ''; }
    function sayi(n) { return Math.round(+n || 0).toLocaleString('tr-TR'); }
    function tl(n) { return sayi(n) + ' TL'; }
    function iki(n) { return (n < 10 ? '0' : '') + n; }
    function tarihAl(t) {
        if (!t) return null;
        try {
            if (typeof t.toDate === 'function') return t.toDate();
            if (typeof t.seconds === 'number') return new Date(t.seconds * 1000);
            var d = (t instanceof Date) ? t : new Date(t);
            return isNaN(d.getTime()) ? null : d;
        } catch (e) { return null; }
    }
    function gunYaz(d) {
        return d ? d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
    }
    function saatliYaz(d) {
        return d ? d.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric',
                                               hour: '2-digit', minute: '2-digit' }) : '—';
    }
    function ayAnahtar(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1); }
    function ayEkle(d, k) {
        var y = d.getFullYear(), m = d.getMonth() + k, g = d.getDate();
        var son = new Date(y, m + 1, 0).getDate();
        return new Date(y, m, Math.min(g, son), d.getHours(), d.getMinutes(), d.getSeconds());
    }
    function inputTarih(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
    function uyar(m) {
        if (typeof window.showCustomAlert === 'function') window.showCustomAlert(m);
        else window.alert(m);
    }
    function sor(m) {
        if (typeof window.showCustomConfirm === 'function') return Promise.resolve(window.showCustomConfirm(m));
        return Promise.resolve(window.confirm(m));
    }
    function hataYaz(e) { return String((e && (e.code || e.message)) || e || 'bilinmeyen hata'); }
    function eskiKopya(metin) {
        var t = document.createElement('textarea');
        t.value = metin; t.setAttribute('readonly', '');
        t.style.position = 'fixed'; t.style.opacity = '0'; t.style.top = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) { }
        t.remove();
    }
    function kopyala(metin) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(metin).catch(function () { eskiKopya(metin); });
            }
        } catch (e) { }
        eskiKopya(metin);
        return Promise.resolve();
    }
    var azHareket = false;
    try { azHareket = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { }

    /* IBAN ve alıcı adı ödeme sayfasından (checkout.js) okunur. */
    function alici() {
        var iban = '', ad = '';
        try {
            var m = String(window.copyIban || '').match(/TR[\d ]{20,40}\d/);
            if (m) iban = m[0].replace(/\s+/g, ' ').trim();
        } catch (e) { }
        try {
            var m2 = String(window.openCheckoutFlow || '').match(/Ad Soyad:\s*([^<"`]+)</);
            if (m2) ad = m2[1].trim();
        } catch (e) { }
        return { iban: iban, ad: ad };
    }
    function ogretmenKodu(uid) {
        try { if (window.OH && typeof OH.koduTuret === 'function') return OH.koduTuret(uid); } catch (e) { }
        return '';
    }
    function aciklamaMetni(uid) {
        var kod = ogretmenKodu(uid || benUid());
        return 'KİDEF DESTEK' + (kod ? ' ' + kod : '');
    }

    /* ------------------------------------------------------------------
       HESAP
       ------------------------------------------------------------------ */
    function aylikHesapla(toplam, taban, aktif) {
        var n = Math.max(1, Math.floor(+aktif || 0));
        return Math.max(taban, Math.ceil(toplam / n / 10) * 10);
    }

    function ozetDuzen(o) {
        o = o || {};
        /* Belgedeki toplam/taban yalnız yönetici panelden ELLE kaydettiyse
           (ayarElle) geçerli; yoksa koddaki değer — kodda değiştirilen
           tutar böylece bir sonraki yayında kendiliğinden yerine oturur. */
        var elle = o.ayarElle === true;
        var toplam = (elle && +o.toplam > 0) ? +o.toplam : VARSAYILAN.toplam;
        var taban = (elle && o.taban != null && +o.taban >= 0) ? +o.taban : VARSAYILAN.taban;
        var aylik = +o.aylik > 0 ? Math.round(+o.aylik) : 0;
        return {
            hazir: aylik > 0,
            toplam: toplam,
            taban: taban,
            aktif: Math.max(0, Math.floor(+o.aktif || 0)),
            onayli: Math.max(0, Math.floor(+o.onayli || 0)),
            aylik: aylik,
            gecmis: (o.gecmis && typeof o.gecmis === 'object') ? o.gecmis : {},
            yoneticiler: Array.isArray(o.yoneticiler) ? o.yoneticiler : [],
            guncelleme: tarihAl(o.guncelleme)
        };
    }

    /* Kayıttan bugüne biriken. Her dönem kayıt gününde başlar (12 Mart
       kaydı → 12 Mart, 12 Nisan, 12 Mayıs ...). Dönemin tutarı, başladığı
       ayın tutarıdır (gecmis); bu özellikten önceki aylar ilk bilinen
       tutarla sayılır. */
    function hesapla(kayit, odenen, oz, simdi) {
        simdi = simdi || new Date();
        var bas = (kayit && !isNaN(kayit.getTime())) ? kayit : simdi;
        if (bas > simdi) bas = simdi;
        var G = oz.gecmis || {};
        var anah = Object.keys(G).filter(function (k) { return +G[k] > 0; }).sort();
        function fiyat(b) {
            if (!anah.length) return oz.aylik;
            var a = ayAnahtar(b), v = 0;
            for (var i = 0; i < anah.length; i++) {
                if (anah[i] <= a) v = +G[anah[i]]; else break;
            }
            return v > 0 ? v : +G[anah[0]];
        }
        var donem = 0, beklenen = 0;
        for (var k = 0; k < 600; k++) {
            var b = ayEkle(bas, k);
            if (b > simdi) break;
            donem++;
            beklenen += fiyat(b);
        }
        odenen = Math.max(0, Math.round(+odenen || 0));
        return {
            kayit: bas, donem: donem, beklenen: beklenen, odenen: odenen,
            kalan: Math.max(0, beklenen - odenen),
            fazla: Math.max(0, odenen - beklenen),
            sonraki: ayEkle(bas, donem),
            oran: beklenen > 0 ? Math.min(1, odenen / beklenen) : (odenen > 0 ? 1 : 0)
        };
    }

    function kayitTarihi(o) {
        var d = tarihAl(o && o.createdAt);
        if (d) return d;
        var g = o && o.kullanim && o.kullanim.gun;
        if (g) {
            var ilk = Object.keys(g).sort()[0];
            if (ilk) {
                var p = ilk.split('-');
                var t = new Date(+p[0], +p[1] - 1, +p[2]);
                if (!isNaN(t.getTime())) return t;
            }
        }
        return tarihAl(o && o.anket && o.anket.tarih);
    }
    function sonGorulme(o) {
        var k = (o && o.kullanim) || {};
        var s = tarihAl(k.sonGoruldu);
        var g = k.gun ? Object.keys(k.gun).sort().pop() : '';
        if (g) {
            var p = g.split('-');
            var t = new Date(+p[0], +p[1] - 1, +p[2], 12, 0);
            if (!isNaN(t.getTime()) && (!s || t > s)) s = t;
        }
        return s;
    }
    function onayliMi(o) {
        return !!o && o.role === 'teacher' &&
            o.ogretmenOnay !== 'bekliyor' && o.ogretmenOnay !== 'reddedildi';
    }
    function aktifMi(o, simdi) {
        if (!onayliMi(o)) return false;
        var sinir = (simdi || Date.now()) - 30 * GUN;
        var s = sonGorulme(o);
        if (s && s.getTime() >= sinir) return true;
        var c = tarihAl(o.createdAt);
        return !!(c && c.getTime() >= sinir);
    }

    /* ------------------------------------------------------------------
       OKUMA
       ------------------------------------------------------------------ */
    var _ozet = null, _ozetZaman = 0;
    function ozetOku(zorla) {
        if (_ozet && !zorla && Date.now() - _ozetZaman < 60000) return Promise.resolve(_ozet);
        var d = db();
        if (!d) return Promise.reject(new Error('Bağlantı yok'));
        return d.collection('mufredat').doc('_destek').get().then(function (s) {
            _ozet = ozetDuzen(s.exists ? s.data() : null);
            _ozetZaman = Date.now();
            return _ozet;
        });
    }

    function bildirimDuzen(id, v) {
        return {
            id: id, uid: v.uid || '', durum: v.durum || 'bekliyor',
            tutar: Math.round(+v.tutar || 0), ay: Math.floor(+v.ay || 0),
            aylik: +v.aylik || 0, not: v.not || '', aciklama: v.aciklama || '',
            ad: v.name || '', email: v.email || '', tel: v.phone || '', kod: v.kod || '',
            tarih: tarihAl(v.createdAt), onay: tarihAl(v.onayTarihi), red: tarihAl(v.redTarihi)
        };
    }
    function kayitDuzen(id, v) {
        return {
            id: id, ogretmenUid: v.ogretmenUid || '', tutar: Math.round(+v.tutar || 0),
            ay: Math.floor(+v.ay || 0), kaynak: v.kaynak || 'elle', siparisId: v.siparisId || '',
            not: v.not || '', tarih: tarihAl(v.odemeTarihi) || tarihAl(v.tarih)
        };
    }
    function yeniOnce(a, b) {
        return ((b.tarih && b.tarih.getTime()) || 0) - ((a.tarih && a.tarih.getTime()) || 0);
    }
    /* Bir öğretmenin kendi bildirimleri. Öğretmen yalnız uid'si kendisi
       olan sipariş belgelerini okuyabildiği için sorgu uid'ye bağlı. */
    function bildirimleriOku(uid) {
        return db().collection('siparisler').where('uid', '==', uid).get().then(function (snap) {
            var L = [];
            snap.forEach(function (d) {
                var v = d.data() || {};
                if (v.tur === 'destek') L.push(bildirimDuzen(d.id, v));
            });
            return L.sort(yeniOnce);
        });
    }
    /* Defter kaydı yalnız bir YÖNETİCİNİN yazdığıysa sayılır. Kurallar
       herkesin uid'si kendisi olan sipariş belgesi açmasına izin verdiği
       için bir öğretmen tur:'destekKayit' diye sahte kayıt açabilir; onun
       uid'si öğretmenin kendisidir ve burada elenir. Yönetici listesi
       mufredat/_destek.yoneticiler (yalnız yönetici yazabilir). */
    function yoneticiYazdi(v, oz) {
        var me = benUid();
        return !!v.uid && (v.uid === me || ((oz && oz.yoneticiler) || []).indexOf(v.uid) >= 0);
    }
    function defterOku(uid) {
        return Promise.all([ozetOku(), db().collection('siparisler').where('ogretmenUid', '==', uid).get()]).then(function (r) {
            var oz = r[0], L = [];
            r[1].forEach(function (d) {
                var v = d.data() || {};
                if (v.tur === 'destekKayit' && yoneticiYazdi(v, oz)) L.push(kayitDuzen(d.id, v));
            });
            return L.sort(yeniOnce);
        });
    }
    function tumDefter() {
        return Promise.all([ozetOku(), db().collection('siparisler').where('tur', '==', 'destekKayit').get()]).then(function (r) {
            var oz = r[0], T = {};
            r[1].forEach(function (d) {
                var v = d.data() || {};
                if (!v.ogretmenUid || !yoneticiYazdi(v, oz)) return;
                T[v.ogretmenUid] = (T[v.ogretmenUid] || 0) + Math.round(+v.tutar || 0);
            });
            return T;
        });
    }
    function tumBekleyen() {
        /* tek eşitlik süzgeci (dizin gerektirmez); durum burada süzülür */
        return db().collection('siparisler').where('tur', '==', 'destek').get().then(function (snap) {
            var L = [];
            snap.forEach(function (d) {
                var v = d.data() || {};
                if ((v.durum || 'bekliyor') === 'bekliyor') L.push(bildirimDuzen(d.id, v));
            });
            return L.sort(yeniOnce);
        });
    }

    /* Öğretmenin (ya da önizlemede yöneticinin) kendi verisi */
    var _ben = null, _benYukleniyor = false;
    function benimVerim(zorla) {
        var uid = benUid();
        if (!uid || !db()) return Promise.reject(new Error('Giriş yok'));
        if (_ben && _ben.uid === uid && !_ben.hata && !zorla && Date.now() - _ben.zaman < 60000) {
            return Promise.resolve(_ben);
        }
        return Promise.all([
            ozetOku(zorla),
            db().collection('kullanicilar').doc(uid).get().then(function (s) { return s.exists ? (s.data() || {}) : {}; }),
            bildirimleriOku(uid).catch(function () { return []; })
        ]).then(function (r) {
            _ben = { uid: uid, zaman: Date.now(), ozet: r[0], belge: r[1], bildirimler: r[2] };
            return _ben;
        });
    }
    function benHesap(v) {
        var b = (v && v.belge) || {};
        var odenen = (b.destek && +b.destek.odenen) || 0;
        return hesapla(kayitTarihi(b), odenen, v.ozet);
    }

    /* ------------------------------------------------------------------
       STİL
       ------------------------------------------------------------------ */
    function stilKur() {
        if (document.getElementById('dst-stil')) return;
        var s = document.createElement('style');
        s.id = 'dst-stil';
        s.textContent = [
            /* kart */
            '#tpDestek{margin-bottom:25px; border-left:5px solid #E3A02A; position:relative; overflow:hidden;}',
            '#tpDestek .dst-bas{display:flex; align-items:center; gap:13px; flex-wrap:wrap; margin-bottom:14px;}',
            '#tpDestek .dst-ikon{flex:none; width:48px; height:48px; overflow:visible;}',
            '#tpDestek .dst-baslik{flex:1 1 180px; min-width:0;}',
            '#tpDestek .dst-baslik b{display:block; color:#9A6512; font-size:1.08rem;}',
            '#tpDestek .dst-baslik span{color:#8A7A66; font-size:.86rem;}',
            '#tpDestek .dst-canli{margin-inline-start:auto; display:inline-flex; align-items:center; gap:7px;',
            '  font-size:.78rem; font-weight:800; color:#1E8449; background:#E9F7EF; padding:5px 12px; border-radius:999px;}',
            '#tpDestek .dst-canli i{width:8px; height:8px; border-radius:50%; background:#27AE60; animation:dstCanli 1.8s infinite;}',
            '@keyframes dstCanli{0%{box-shadow:0 0 0 0 rgba(39,174,96,.55)}70%{box-shadow:0 0 0 9px rgba(39,174,96,0)}100%{box-shadow:0 0 0 0 rgba(39,174,96,0)}}',
            '#tpDestek .dst-ust{display:grid; grid-template-columns:minmax(230px,1fr) minmax(270px,1.4fr); gap:14px; align-items:stretch;}',
            '@media (max-width:760px){#tpDestek .dst-ust{grid-template-columns:1fr;}}',
            '#tpDestek .dst-tutar{background:linear-gradient(160deg,#FFF9EC,#FFF0D2); border:1px solid #F3DDAF;',
            '  border-radius:16px; padding:16px 18px; display:flex; flex-direction:column; justify-content:center; gap:8px;}',
            '#tpDestek .dst-et{font-size:.74rem; font-weight:900; letter-spacing:.6px; color:#B7791F; text-transform:uppercase;}',
            '#tpDestek .dst-buyuk{font-size:2.35rem; font-weight:900; color:#1F2430; line-height:1.05; font-variant-numeric:tabular-nums;}',
            '#tpDestek .dst-buyuk small{font-size:1rem; font-weight:800; color:#8A7A66; margin-inline-start:6px;}',
            '#tpDestek .dst-sayi{font-size:.9rem; color:#5B5246;}',
            '#tpDestek .dst-sayi b{color:#1E8449; font-size:1.05rem;}',
            '#tpDestek .dst-kisiler{display:flex; flex-wrap:wrap; gap:3px; align-items:center;}',
            '#tpDestek .dst-kisiler svg{width:15px; height:15px; animation:dstKisi .45s cubic-bezier(.3,1.6,.5,1) both;}',
            '#tpDestek .dst-kisiler em{font-style:normal; font-size:.78rem; font-weight:800; color:#8A7A66; margin-inline-start:4px;}',
            '@keyframes dstKisi{from{transform:scale(0) translateY(6px); opacity:0}to{transform:none; opacity:1}}',
            '#tpDestek .dst-vurgu{display:flex; gap:9px; align-items:flex-start; margin-top:2px; font-size:.86rem; color:#6B5B45; line-height:1.5;}',
            '#tpDestek .dst-vurgu svg{flex:none; width:22px; height:22px; margin-top:1px;}',
            '#tpDestek .dst-ok{animation:dstOk 1.6s ease-in-out infinite;}',
            '@keyframes dstOk{0%,100%{transform:translateY(-2px)}50%{transform:translateY(3px)}}',
            '#tpDestek .dst-grafik{background:#fff; border:1px solid #EEE3CF; border-radius:16px; padding:8px 8px 4px; min-width:0;}',
            '#tpDestek .dst-grafik-svg{width:100%; min-height:150px;}',
            '#tpDestek .dst-grafik svg{display:block; overflow:visible; max-width:100%;}',
            '#tpDestek .dst-lejant{display:flex; gap:6px 14px; flex-wrap:wrap; margin:4px 8px 0; font-size:.84rem; color:#5B5246;}',
            '#tpDestek .dst-lejant span{display:inline-flex; align-items:center; gap:6px;}',
            '#tpDestek .dst-lejant i{display:inline-block; width:9px; height:9px; border-radius:50%;}',
            '#tpDestek .dst-lejant b{color:#1E8449;}',
            '#tpDestek .dst-grafik p{margin:2px 8px 4px; font-size:.78rem; color:#8A7A66;}',
            '.dst-cizgi{stroke-dasharray:1; stroke-dashoffset:1; animation:dstCiz 1.7s cubic-bezier(.3,.6,.2,1) .15s forwards;}',
            '@keyframes dstCiz{to{stroke-dashoffset:0}}',
            '.dst-alan{opacity:0; animation:dstBelir .9s ease-out 1.1s forwards;}',
            '.dst-isaret{opacity:0; animation:dstBelir .5s ease-out 1.5s forwards;}',
            '@keyframes dstBelir{to{opacity:1}}',
            '.dst-nabiz{transform-box:fill-box; transform-origin:center; animation:dstNabiz 1.9s ease-out infinite;}',
            '@keyframes dstNabiz{0%{transform:scale(1); opacity:.55}100%{transform:scale(3.2); opacity:0}}',
            '.dst-kalp{transform-box:fill-box; transform-origin:center; animation:dstKalp 1.7s ease-in-out infinite;}',
            '@keyframes dstKalp{0%,100%{transform:scale(1)}14%{transform:scale(1.13)}28%{transform:scale(.97)}42%{transform:scale(1.08)}60%{transform:scale(1)}}',
            '.dst-para{transform-box:fill-box; animation:dstPara 3.2s ease-in infinite;}',
            '.dst-para.p2{animation-delay:1.6s}',
            '@keyframes dstPara{0%{transform:translateY(4px); opacity:0}18%{opacity:1}100%{transform:translateY(-30px); opacity:0}}',
            '#tpDestek .dst-aciklama{margin:14px 0 0; padding:12px 15px; background:#FBFAF7; border-radius:12px;',
            '  color:#5B5246; font-size:.9rem; line-height:1.65;}',
            '#tpDestek .dst-ben{margin-top:16px; padding-top:14px; border-top:1px dashed #EADFCB;}',
            '#tpDestek .dst-ben-bas{display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:11px;}',
            '#tpDestek .dst-ben-bas b{color:#9A6512; font-size:.98rem;}',
            '#tpDestek .dst-ben-bas span{color:#8A94A3; font-size:.84rem;}',
            '#tpDestek .dst-ben-ic{display:flex; gap:16px; align-items:center; flex-wrap:wrap;}',
            '#tpDestek .dst-halka-k{flex:none; width:88px; height:88px;}',
            '#tpDestek .dst-halka-k svg{width:100%; height:100%; display:block;}',
            '.dst-halka{animation:dstHalka 1.3s cubic-bezier(.3,.7,.2,1) .35s forwards;}',
            '@keyframes dstHalka{to{stroke-dashoffset:var(--hedef)}}',
            '#tpDestek .dst-kutular{display:flex; gap:10px; flex:1 1 320px; flex-wrap:wrap;}',
            '#tpDestek .dst-k{flex:1 1 115px; background:#fff; border:1px solid #E6EBF2; border-radius:14px; padding:10px 13px;}',
            '#tpDestek .dst-k b{display:block; font-size:1.28rem; color:#1F2430; font-variant-numeric:tabular-nums; line-height:1.25;}',
            '#tpDestek .dst-k span{font-size:.72rem; font-weight:900; letter-spacing:.4px; color:#8A94A3; text-transform:uppercase;}',
            '#tpDestek .dst-k.odenen b{color:#1E8449;}',
            '#tpDestek .dst-k.kalan b{color:#C0571B;}',
            '#tpDestek .dst-ipucu{margin:11px 0 0; font-size:.84rem; color:#7A6E5E; line-height:1.55;}',
            '#tpDestek .dst-fazla{color:#1E8449; font-weight:800;}',
            '#tpDestek .dst-tuslar{display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;}',
            '.dst-tus{border:0; cursor:pointer; font-family:inherit; font-weight:800; border-radius:12px; padding:11px 20px;',
            '  font-size:.95rem; display:inline-flex; align-items:center; gap:8px; transition:transform .15s, filter .15s;}',
            '.dst-tus svg{width:18px; height:18px;}',
            '.dst-tus.ana{background:linear-gradient(135deg,#F2B544,#E08E1B); color:#fff; box-shadow:0 6px 16px rgba(224,142,27,.33);}',
            '.dst-tus.ana:hover{filter:brightness(1.05); transform:translateY(-1px);}',
            '.dst-tus.ikinci{background:#FFF4DE; color:#9A6512;}',
            '.dst-tus.ikinci:hover{background:#FDEBC8;}',
            '.dst-tus[disabled]{opacity:.55; cursor:default; transform:none;}',
            '#tpDestek .dst-bildirimler{margin-top:12px; display:flex; flex-direction:column; gap:6px;}',
            '.dst-b{display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:.86rem; color:#5B5246;',
            '  background:#FBFAF7; border-radius:10px; padding:8px 12px;}',
            '.dst-b b{color:#1F2430;}',
            '.dst-cip{display:inline-block; padding:3px 10px; border-radius:999px; font-size:.74rem; font-weight:800; white-space:nowrap;}',
            '.dst-cip.bekliyor{background:#FEF3E2; color:#B5670A;}',
            '.dst-cip.onaylandi{background:#E8F6EF; color:#1E8449;}',
            '.dst-cip.reddedildi{background:#FDEDEC; color:#B03A2E;}',
            '.dst-cip.elle{background:#EEF4FF; color:#1B4F9C;}',
            '.dst-onizleme{display:inline-block; padding:3px 10px; border-radius:999px; background:#EEF4FF; color:#1B4F9C;',
            '  font-size:.74rem; font-weight:800;}',
            '#tpDestek .dst-yok{color:#8A94A3; font-size:.9rem; margin:4px 0 0;}',
            '.dst-durgun .dst-cizgi{animation:none; stroke-dashoffset:0;}',
            '.dst-durgun .dst-alan, .dst-durgun .dst-isaret{animation:none; opacity:1;}',
            '.dst-durgun .dst-kisiler svg{animation:none;}',
            '.dst-durgun .dst-halka{animation:none; stroke-dashoffset:var(--hedef);}',
            '@media (prefers-reduced-motion: reduce){',
            '  .dst-cizgi{animation:none; stroke-dashoffset:0;} .dst-alan,.dst-isaret{animation:none; opacity:1;}',
            '  .dst-halka{animation:none; stroke-dashoffset:var(--hedef);} .dst-nabiz,.dst-kalp,.dst-para,.dst-ok,',
            '  .dst-kisiler svg,#tpDestek .dst-canli i{animation:none;}}',
            /* ödeme penceresi */
            '#dstOrt{position:fixed; inset:0; z-index:9990; display:flex; align-items:center; justify-content:center;',
            '  padding:16px; background:rgba(34,26,12,.52); animation:dstSol .18s ease-out;}',
            '@keyframes dstSol{from{opacity:0}to{opacity:1}}',
            '#dstKutu{background:#fff; border-radius:20px; width:min(580px,96vw); max-height:92vh; overflow:auto;',
            '  box-shadow:0 30px 80px rgba(34,26,12,.35); animation:dstCik .26s cubic-bezier(.2,1.2,.4,1); color:#1F2430;}',
            '@keyframes dstCik{from{transform:translateY(14px) scale(.98); opacity:0}to{transform:none; opacity:1}}',
            '#dstKutu .dst-m-bas{position:sticky; top:0; z-index:1; background:#fff; display:flex; align-items:center; gap:10px;',
            '  padding:15px 20px; border-bottom:1px solid #F1E9DA;}',
            '#dstKutu .dst-m-bas svg{width:30px; height:30px; flex:none;}',
            '#dstKutu .dst-m-bas b{font-size:1.1rem; color:#9A6512;}',
            '#dstKutu .dst-kapat{margin-inline-start:auto; border:0; background:#F6F1E7; width:34px; height:34px;',
            '  border-radius:10px; cursor:pointer; font-size:1.15rem; color:#6B5B45;}',
            '#dstKutu .dst-m-bol{padding:14px 20px; border-bottom:1px solid #F5EFE4;}',
            '#dstKutu .dst-m-bol:last-child{border-bottom:0;}',
            '#dstKutu .dst-m-et{margin:0 0 10px; font-size:.74rem; font-weight:900; letter-spacing:.6px; color:#B7791F;}',
            '#dstKutu .dst-aylar{display:grid; grid-template-columns:repeat(6,1fr); gap:7px;}',
            '@media (max-width:420px){#dstKutu .dst-aylar{grid-template-columns:repeat(4,1fr);}}',
            '#dstKutu .dst-ay{border:1.5px solid #EEDFC2; background:#FFFBF3; color:#6B5B45; border-radius:12px; padding:8px 0 7px;',
            '  font-weight:900; cursor:pointer; font-family:inherit; font-size:1.02rem; line-height:1.15; transition:transform .12s;}',
            '#dstKutu .dst-ay small{display:block; font-size:.6rem; font-weight:800; color:#B7791F; letter-spacing:.3px;}',
            '#dstKutu .dst-ay:hover{transform:translateY(-1px);}',
            '#dstKutu .dst-ay.sec{background:#E9A23B; border-color:#E9A23B; color:#fff;}',
            '#dstKutu .dst-ay.sec small{color:#FFF3DC;}',
            '#dstKutu .dst-ekler{display:flex; gap:8px; flex-wrap:wrap; margin-top:9px;}',
            '#dstKutu .dst-ek{border:1.5px dashed #E3C88F; background:#fff; color:#9A6512; border-radius:12px; padding:8px 14px;',
            '  font-weight:800; cursor:pointer; font-family:inherit; font-size:.88rem;}',
            '#dstKutu .dst-ek.sec{border-style:solid; background:#FFF1D6;}',
            '#dstKutu .dst-serbest{margin-top:10px; display:none; align-items:center; gap:8px;}',
            '#dstKutu .dst-serbest.acik{display:flex;}',
            '#dstKutu input[type=number],#dstKutu input[type=text]{border:1.5px solid #E7DCC8; border-radius:10px; padding:10px 12px;',
            '  font-family:inherit; font-size:1rem; background:#fff; color:#1F2430; box-sizing:border-box;}',
            '#dstKutu input[type=number]{width:150px;}',
            '#dstKutu input[type=text]{width:100%;}',
            '#dstKutu .dst-toplam{margin-top:12px; padding:12px 14px; background:#FFF8EA; border-radius:12px;',
            '  display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; color:#6B5B45; font-size:.92rem;}',
            '#dstKutu .dst-toplam b{font-size:1.55rem; color:#1F2430; font-variant-numeric:tabular-nums;}',
            '#dstKutu .dst-satir{display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:7px 0;}',
            '#dstKutu .dst-satir > span{width:78px; font-size:.76rem; font-weight:900; color:#8A94A3; letter-spacing:.3px;}',
            '#dstKutu .dst-satir code{font-size:.98rem; font-weight:800; color:#1F2430; letter-spacing:.4px;',
            '  font-family:ui-monospace,Menlo,Consolas,monospace; word-break:break-all;}',
            '#dstKutu .dst-kucuk{border:0; background:#F3EEE4; color:#6B5B45; border-radius:9px; padding:6px 12px;',
            '  font-weight:800; cursor:pointer; font-size:.8rem; font-family:inherit;}',
            '#dstKutu .dst-kucuk.tamam{background:#E8F6EF; color:#1E8449;}',
            '#dstKutu label{display:block; font-size:.76rem; font-weight:900; color:#8A94A3; letter-spacing:.3px; margin:0 0 6px;}',
            '#dstKutu .dst-dip{margin:10px 0 0; font-size:.82rem; color:#8A7A66; line-height:1.5;}',
            '#dstKutu .dst-tus.ana{width:100%; justify-content:center; margin-top:12px; font-size:1.02rem; padding:13px 20px;}',
            /* yönetici */
            '.dst-y{font-size:.92rem; color:#1F2430;}',
            '.dst-y h5{margin:16px 0 8px; font-size:.86rem; font-weight:900; color:#9A6512;}',
            '.dst-y .dst-y-kutular{display:flex; gap:10px; flex-wrap:wrap;}',
            '.dst-y .dst-y-k{flex:1 1 130px; background:#FFFBF3; border:1px solid #F1E3C6; border-radius:12px; padding:10px 13px;}',
            '.dst-y .dst-y-k b{display:block; font-size:1.2rem; font-variant-numeric:tabular-nums;}',
            '.dst-y .dst-y-k span{font-size:.72rem; font-weight:900; color:#8A94A3; letter-spacing:.4px;}',
            '.dst-y .dst-y-k.odenen b{color:#1E8449;} .dst-y .dst-y-k.kalan b{color:#C0571B;}',
            '.dst-y .dst-y-bilgi{margin:9px 0 0; font-size:.82rem; color:#8A94A3; line-height:1.5;}',
            '.dst-y .dst-y-sat{display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:9px 12px; border:1px solid #EEF2F7;',
            '  border-radius:11px; margin-bottom:7px; background:#fff;}',
            '.dst-y .dst-y-sat .t{font-weight:900; font-variant-numeric:tabular-nums;}',
            '.dst-y .dst-y-sat .n{color:#8A94A3; font-size:.84rem;}',
            '.dst-y .dst-y-sat .bos{flex:1 1 auto;}',
            '.dst-yb{border:0; border-radius:9px; padding:6px 12px; font-weight:800; cursor:pointer; font-size:.82rem; font-family:inherit;}',
            '.dst-yb.onay{background:#E8F6EF; color:#1E8449;}',
            '.dst-yb.red{background:#FDEDEC; color:#B03A2E;}',
            '.dst-yb.sil{background:#fff; color:#B03A2E; border:1.5px solid #F3C7C1;}',
            '.dst-yb.ac{background:#EEF4FF; color:#1B4F9C;}',
            '.dst-yb.kaydet{background:#E3A02A; color:#fff; padding:9px 18px;}',
            '.dst-yb[disabled]{opacity:.5; cursor:default;}',
            '.dst-y .dst-y-form{display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end; padding:12px; background:#FBFAF7; border-radius:12px;}',
            '.dst-y .dst-y-form label{display:flex; flex-direction:column; gap:4px; font-size:.74rem; font-weight:900; color:#8A94A3;}',
            '.dst-y .dst-y-form input,.dst-y .dst-y-form select{border:1.5px solid #E6EBF2; border-radius:9px; padding:8px 10px;',
            '  font-family:inherit; font-size:.92rem; background:#fff; color:#1F2430;}',
            '.dst-y .dst-y-yok{color:#A9B2BD; font-size:.88rem; margin:0;}',
            '#admin-destek-ayar{margin:12px 0 4px; padding:12px 14px; border-radius:12px; background:#FFF8EA; border:1px solid #F3DDAF;',
            '  font-size:.88rem; color:#5B5246;}',
            '#admin-destek-ayar .dst-a-ust{display:flex; gap:8px 14px; flex-wrap:wrap; align-items:baseline;}',
            '#admin-destek-ayar .dst-a-ust b{color:#9A6512;}',
            '#admin-destek-ayar .dst-a-form{display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-top:9px;}',
            '#admin-destek-ayar input{width:110px; border:1.5px solid #EADBC0; border-radius:9px; padding:7px 9px; font-family:inherit; font-size:.9rem;}',
            '.dst-rozet{display:inline-block; min-width:20px; text-align:center; background:#E08E1B; color:#fff;',
            '  border-radius:12px; padding:1px 8px; font-size:.75rem; margin-inline-start:8px; font-weight:800;}',
            '.dst-y-bekleyen{margin:0 0 14px; padding:12px; border:1px solid #F3DDAF; border-radius:12px; background:#FFFBF3;}',
            '.dst-y-bekleyen > b{display:block; color:#9A6512; margin-bottom:9px;}'
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ------------------------------------------------------------------
       SVG PARÇALARI
       ------------------------------------------------------------------ */
    function kisiSvg(renk, gecikme) {
        return '<svg viewBox="0 0 16 16" aria-hidden="true" style="animation-delay:' + gecikme + 'ms">' +
            '<circle cx="8" cy="4.7" r="3.1" fill="' + renk + '"/>' +
            '<path d="M2.2 15.4a5.8 5.8 0 0 1 11.6 0z" fill="' + renk + '"/></svg>';
    }
    function kalpSvg(sinif) {
        return '<svg class="' + (sinif || '') + '" viewBox="0 0 64 64" aria-hidden="true">' +
            '<circle cx="32" cy="32" r="31" fill="#FFF1D6"/>' +
            '<g class="dst-para"><circle cx="19" cy="45" r="5.2" fill="#F2B544"/>' +
              '<circle cx="19" cy="45" r="3.2" fill="none" stroke="#C98A1E" stroke-width="1"/></g>' +
            '<g class="dst-para p2"><circle cx="45.5" cy="47" r="4.4" fill="#F2B544"/>' +
              '<circle cx="45.5" cy="47" r="2.6" fill="none" stroke="#C98A1E" stroke-width="1"/></g>' +
            '<path class="dst-kalp" d="M32 47C18.6 38.4 14.2 30.4 18.4 24.6c3.8-5.1 10.6-4.4 13.6.9 3-5.3 9.8-6 13.6-.9 4.2 5.8-.2 13.8-13.6 22.4Z" fill="#E08E1B"/>' +
            '<path d="M25 27.5c1.2-1.6 3-2.1 4.6-1.4" stroke="#FFD9A0" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '</svg>';
    }
    function okSvg() {
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><g class="dst-ok">' +
            '<circle cx="12" cy="12" r="11" fill="#E8F6EF"/>' +
            '<path d="M12 6v11M7.5 12.8 12 17.3l4.5-4.5" stroke="#1E8449" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</g></svg>';
    }

    /* Öğretmen sayısı ↔ kişi başı tutar eğrisi. W: kutunun gerçek genişliği
       (px) — yazılar her ekranda aynı boyda kalsın diye SVG ölçeklenmez,
       genişliğe göre yeniden kurulur. */
    function grafikSvg(oz, W) {
        W = Math.max(260, Math.min(760, Math.round(W || 340)));
        var H = Math.round(Math.max(188, Math.min(250, W * 0.5)));
        var x0 = 12, x1 = W - 12, y0 = 34, y1 = H - 38;
        var n = Math.max(1, oz.aktif || 1);
        var taban = oz.taban, toplam = oz.toplam;
        var kirilma = taban > 0 ? Math.ceil(toplam / taban) : n * 3;
        var nMin = Math.max(2, Math.round(n * 0.45));
        /* Alt sınır öğretmene gösterilmez: eğri, tutarın sınıra dayandığı
           noktaya (kirilma) varmadan biter; düzleşen kısım hiç çizilmez. */
        var nMax = n < kirilma ? Math.min(kirilma, Math.max(Math.round(n * 2.2), n + 15)) : n;
        if (nMax < nMin + 6) nMax = nMin + 6;
        var f = function (k) { return Math.max(taban, toplam / k); };
        var yUst = f(nMin) * 1.06;
        var X = function (k) { return x0 + (k - nMin) / (nMax - nMin) * (x1 - x0); };
        var Y = function (v) { return y1 - (v / yUst) * (y1 - y0); };
        var P = [], adim = (nMax - nMin) / 140;
        for (var k = nMin; k <= nMax + 1e-9; k += adim) P.push(X(k).toFixed(1) + ' ' + Y(f(k)).toFixed(1));
        var yol = 'M' + P.join(' L');
        var alan = yol + ' L' + x1 + ' ' + y1 + ' L' + x0 + ' ' + y1 + ' Z';

        /* x ekseni çentikleri: ekrana sığan kadar */
        var adimlar = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000], tik = 1000;
        var enCok = Math.max(3, Math.floor((x1 - x0) / 70));
        for (var i = 0; i < adimlar.length; i++) { if ((nMax - nMin) / adimlar[i] <= enCok) { tik = adimlar[i]; break; } }
        var cent = '';
        for (var t = Math.ceil(nMin / tik) * tik; t <= nMax; t += tik) {
            var tx = X(t).toFixed(1);
            cent += '<line x1="' + tx + '" x2="' + tx + '" y1="' + y0 + '" y2="' + y1 + '" stroke="#F3EDE2" stroke-width="1"/>' +
                    '<text x="' + tx + '" y="' + (y1 + 16) + '" text-anchor="middle" font-size="11" fill="#A0927E">' + t + '</text>';
        }
        var cx = X(n), cy = Y(f(n));
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img"' +
            ' aria-label="Öğretmen sayısı arttıkça kişi başı tutar azalır">' +
            '<defs><linearGradient id="dstGrad" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="#F2B544" stop-opacity=".38"/><stop offset="1" stop-color="#F2B544" stop-opacity="0"/>' +
            '</linearGradient></defs>' +
            '<text x="' + x0 + '" y="15" font-size="11.5" font-weight="700" fill="#B7791F">kişi başı aylık</text>' +
            '<text x="' + x1 + '" y="' + (H - 4) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="#B7791F">öğretmen sayısı →</text>' +
            cent +
            '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y1 + '" y2="' + y1 + '" stroke="#E5DACA" stroke-width="1.2"/>' +
            '<path class="dst-alan" d="' + alan + '" fill="url(#dstGrad)"/>';
        s += '<path class="dst-cizgi" pathLength="1" d="' + yol + '" fill="none" stroke="#E08E1B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';

        /* +10 öğretmen olursa: yeşil nokta eğri boyunca aşağı kayar */
        var n2 = n + 10, ileri = '';
        if (n2 <= nMax && f(n2) < f(n) - 0.5) {
            var nx = X(n2), ny = Y(f(n2)), Q = [];
            for (var q = n; q <= n2 + 1e-9; q += 0.5) Q.push(X(q).toFixed(1) + ' ' + Y(f(q)).toFixed(1));
            ileri = '<g class="dst-isaret">' +
                '<circle cx="' + nx.toFixed(1) + '" cy="' + ny.toFixed(1) + '" r="5" fill="#fff" stroke="#27AE60" stroke-width="2.4" stroke-dasharray="2.4 2"/>' +
                (azHareket ? '' : '<circle r="3.6" fill="#27AE60"><animateMotion dur="2.6s" repeatCount="indefinite" path="M' + Q.join(' L') + '"/>' +
                    '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="2.6s" repeatCount="indefinite"/></circle>') +
                '</g>';
        }
        /* şu an: balon işaretin sağ üstünde; sağa sığmazsa solunda */
        var bw = 138, bh = 40;
        var bx = cx + 12;
        if (bx + bw > x1) bx = cx - 12 - bw;
        var by = Math.max(2, cy - bh - 14);
        s += '<g class="dst-isaret">' +
            '<line x1="' + cx.toFixed(1) + '" x2="' + cx.toFixed(1) + '" y1="' + cy.toFixed(1) + '" y2="' + y1 + '" stroke="#E08E1B" stroke-width="1.2" stroke-dasharray="3 3" opacity=".7"/>' +
            '<circle class="dst-nabiz" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="6" fill="#E08E1B"/>' +
            '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="6" fill="#fff" stroke="#E08E1B" stroke-width="3"/>' +
            '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + bw + '" height="' + bh + '" rx="10" fill="#1F2430" opacity=".93"/>' +
            '<text x="' + (bx + 11).toFixed(1) + '" y="' + (by + 15).toFixed(1) + '" font-size="11" fill="#F6D9A6" font-weight="700">Şu an · ' + n + ' öğretmen</text>' +
            '<text x="' + (bx + 11).toFixed(1) + '" y="' + (by + 32).toFixed(1) + '" font-size="14" fill="#fff" font-weight="900">' + esc(tl(oz.aylik)) + ' / ay</text>' +
            '</g>' + ileri + '</svg>';
        return s;
    }

    /* Grafiğin altındaki "şu kadar öğretmen olursa" satırı */
    function lejantHtml(oz) {
        var n = Math.max(1, oz.aktif || 1);
        /* yalnız alt sınırın ÜSTÜNDE kalan örnekler yazılır: "+30 öğretmen
           olursa 500 TL" gibi sınıra dayanan bir sayı sınırı ele verir */
        var a = aylikHesapla(oz.toplam, oz.taban, n + 10), b = aylikHesapla(oz.toplam, oz.taban, n + 30);
        var aOk = a < oz.aylik && a > oz.taban, bOk = aOk && b < a && b > oz.taban;
        if (!aOk) return '';
        return '<div class="dst-lejant">' +
            '<span><i style="background:#27AE60"></i>+10 öğretmen olursa <b>' + esc(tl(a)) + '</b></span>' +
            (bOk ? '<span><i style="background:#82C99B"></i>+30 öğretmen olursa <b>' + esc(tl(b)) + '</b></span>' : '') +
            '</div>';
    }

    function grafikCiz(kok, durgun) {
        var yer = kok && kok.querySelector('[data-dst-grafik]');
        var v = _ben;
        if (!yer || !v || !v.ozet || !v.ozet.hazir) return;
        var W = yer.clientWidth || 340;
        if (durgun) yer.classList.add('dst-durgun');
        yer.innerHTML = grafikSvg(v.ozet, W);
        yer.__dstW = W;
    }
    var _boyutZaman = null;
    window.addEventListener('resize', function () {
        clearTimeout(_boyutZaman);
        _boyutZaman = setTimeout(function () {
            var k = document.getElementById('tpDestek');
            var yer = k && k.querySelector('[data-dst-grafik]');
            if (yer && Math.abs((yer.clientWidth || 0) - (yer.__dstW || 0)) > 8) grafikCiz(k, true);
        }, 180);
    });

    function halkaSvg(oran) {
        var yuzde = Math.round(oran * 100);
        var hedef = (100 - yuzde).toFixed(1);
        return '<svg viewBox="0 0 44 44" aria-hidden="true">' +
            '<circle cx="22" cy="22" r="18" fill="none" stroke="#EEF2F7" stroke-width="5"/>' +
            '<circle class="dst-halka" cx="22" cy="22" r="18" fill="none" stroke="#27AE60" stroke-width="5" stroke-linecap="round"' +
            ' pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="--hedef:' + hedef + '" transform="rotate(-90 22 22)"/>' +
            '<text x="22" y="21" text-anchor="middle" font-size="9" font-weight="900" fill="#1F2430">%' + yuzde + '</text>' +
            '<text x="22" y="30" text-anchor="middle" font-size="5" font-weight="800" fill="#8A94A3">ÖDENEN</text>' +
            '</svg>';
    }

    /* ------------------------------------------------------------------
       ÖĞRETMEN PROFİLİ KARTI
       ------------------------------------------------------------------ */
    var _oynatilan = '';     /* aynı içerik yeniden çizilince animasyon tekrar oynamasın */

    function durumCipi(d) {
        if (d === 'onaylandi') return '<span class="dst-cip onaylandi">Onaylandı</span>';
        if (d === 'reddedildi') return '<span class="dst-cip reddedildi">Reddedildi</span>';
        return '<span class="dst-cip bekliyor">Onay bekliyor</span>';
    }

    function kartIcerik() {
        var onizleme = rol() === 'admin';
        var v = _ben;
        var bas = '<div class="dst-bas">' + kalpSvg('dst-ikon') +
            '<div class="dst-baslik"><b>Beklenen Destek' +
              (onizleme ? ' <span class="dst-onizleme">Önizleme · öğretmenler böyle görür</span>' : '') + '</b>' +
              '<span>Kidef\'in sürmesi için öğretmen başına aylık katkı</span></div>';
        if (!v) {
            return { imza: 'yukleniyor', html: bas + '</div><p class="dst-yok">Yükleniyor…</p>' };
        }
        if (v.hata || !v.ozet) {
            return { imza: 'hata', html: bas + '</div><p class="dst-yok">Destek bilgisi şu an alınamadı; biraz sonra yeniden denenecek.</p>' };
        }
        var oz = v.ozet;
        if (!oz.hazir) {
            return { imza: 'hazirdegil', html: bas + '</div><p class="dst-yok">Öğretmen sayısı hesaplanıyor; tutar kısa süre içinde burada görünecek.</p>' };
        }
        bas += '<span class="dst-canli" title="Son 30 günde siteye giren öğretmenler"><i></i>' + oz.aktif + ' öğretmen</span></div>';

        /* kişiler sırası */
        var en = 24, goster = Math.min(oz.aktif, en), kisiler = '';
        for (var i = 0; i < goster; i++) {
            kisiler += kisiSvg(i === 0 && !onizleme ? '#E08E1B' : (i % 3 === 0 ? '#C9B79A' : '#D9CBB4'), 300 + i * 35);
        }
        if (oz.aktif > en) kisiler += '<em>+' + (oz.aktif - en) + '</em>';

        var h = benHesap(v);
        var bekleyen = (v.bildirimler || []).filter(function (x) { return x.durum === 'bekliyor'; });
        var imza = [oz.aylik, oz.aktif, h.beklenen, h.odenen, bekleyen.length, (v.bildirimler || []).length].join('|');

        var tutar = '<div class="dst-tutar">' +
            '<span class="dst-et">Kişi başı aylık</span>' +
            '<span class="dst-buyuk"><span data-dst-say="' + oz.aylik + '">' + sayi(oz.aylik) + '</span><small>TL / ay</small></span>' +
            '<span class="dst-sayi"><b data-dst-say="' + oz.aktif + '">' + oz.aktif + '</b> öğretmen paylaşıyor · son 30 günde sitede</span>' +
            '<span class="dst-kisiler" aria-hidden="true">' + kisiler + '</span>' +
            '<span class="dst-vurgu">' + okSvg() + '<span><b>Öğretmen arttıkça tutar azalır.</b> Her yeni meslektaş herkesin payını küçültür.</span></span>' +
            '</div>';
        var grafik = '<div class="dst-grafik"><div class="dst-grafik-svg" data-dst-grafik></div>' + lejantHtml(oz) +
            '<p>Tutar, sitedeki öğretmen sayısına göre her gün yeniden hesaplanır.</p></div>';

        var aciklama = '<p class="dst-aciklama">Sitedeki <b>yapay zekâ hizmetlerinin giderleri</b> ve materyallerin, ' +
            'oyunların, sınavların arkasındaki <b>yoğun öğretmen emeği</b>, siteyi kullanan öğretmenler arasında paylaşılır. ' +
            'Katkın Kidef\'in büyümesini ve yeni içeriklerin hazırlanmasını sağlar.</p>';

        /* kişisel durum */
        var kayitYazi = h.kayit ? gunYaz(h.kayit) : '—';
        var ben = '<div class="dst-ben">' +
            '<div class="dst-ben-bas"><b>' + (onizleme ? 'Örnek: senin kaydınla' : 'Senin durumun') + '</b>' +
              '<span>Kayıt ' + esc(kayitYazi) + ' · ' + h.donem + '. ay · sonraki ay ' + esc(gunYaz(h.sonraki)) + '</span></div>' +
            '<div class="dst-ben-ic">' +
              '<div class="dst-halka-k">' + halkaSvg(h.oran) + '</div>' +
              '<div class="dst-kutular">' +
                '<div class="dst-k"><b data-dst-say="' + h.beklenen + '" data-dst-tl="1">' + esc(tl(h.beklenen)) + '</b><span>Beklenen (' + h.donem + ' ay)</span></div>' +
                '<div class="dst-k odenen"><b data-dst-say="' + h.odenen + '" data-dst-tl="1">' + esc(tl(h.odenen)) + '</b><span>Ödenen</span></div>' +
                '<div class="dst-k kalan"><b data-dst-say="' + h.kalan + '" data-dst-tl="1">' + esc(tl(h.kalan)) + '</b><span>Kalan</span></div>' +
              '</div>' +
            '</div>' +
            (h.fazla > 0
                ? '<p class="dst-ipucu"><span class="dst-fazla">' + esc(tl(h.fazla)) + ' fazla ödeme</span> sonraki aylara sayılır' +
                  (oz.aylik && h.fazla >= oz.aylik ? ' (yaklaşık ' + Math.floor(h.fazla / oz.aylik) + ' ay).' : '.') + '</p>'
                : '<p class="dst-ipucu">Ödeyemediğin aylar birikir; dilediğin zaman tamamını ya da bir kısmını gönderebilirsin. ' +
                  'Birkaç ayı ya da yılı bir kerede ödeyebilirsin.</p>') +
            '<div class="dst-tuslar">' +
              '<button type="button" class="dst-tus ana" onclick="KidefDestek.odemeAc()">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5C6 16.4 3.5 12.6 5.4 9.6c1.6-2.5 4.9-2.3 6.6.3 1.7-2.6 5-2.8 6.6-.3 1.9 3-.6 6.8-6.6 10.9Z"/></svg>' +
                'Destek ver</button>' +
              '<button type="button" class="dst-tus ikinci" onclick="KidefDestek.oner()">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.4"/><path d="M3 20a6 6 0 0 1 12 0M19 8v6M16 11h6"/></svg>' +
                'Meslektaşına öner</button>' +
            '</div>';
        var son = (v.bildirimler || []).slice(0, 4);
        if (son.length) {
            ben += '<div class="dst-bildirimler">' + son.map(function (b) {
                return '<div class="dst-b">' + durumCipi(b.durum) +
                    '<b>' + esc(tl(b.tutar)) + '</b>' + (b.ay ? '<span>' + b.ay + ' ay</span>' : '<span>serbest tutar</span>') +
                    '<span style="margin-inline-start:auto; color:#A0927E;">' + esc(saatliYaz(b.tarih)) + '</span></div>';
            }).join('') + '</div>';
        }
        ben += '</div>';
        return { imza: imza, html: bas + '<div class="dst-ust">' + tutar + grafik + '</div>' + aciklama + ben };
    }

    function sayacOynat(kok) {
        if (azHareket) return;
        [].forEach.call(kok.querySelectorAll('[data-dst-say]'), function (el) {
            var hedef = +el.getAttribute('data-dst-say') || 0;
            var paraMi = el.hasAttribute('data-dst-tl');
            if (hedef <= 0) return;
            var bas = performance.now(), sure = 1100;
            function adim(t) {
                var p = Math.min(1, (t - bas) / sure);
                var e = 1 - Math.pow(1 - p, 3);
                var v = Math.round(hedef * e);
                el.textContent = paraMi ? tl(v) : sayi(v);
                if (p < 1) requestAnimationFrame(adim);
            }
            el.textContent = paraMi ? tl(0) : '0';
            requestAnimationFrame(adim);
        });
    }

    function kartCiz(kart) {
        var r = kartIcerik();
        var yeni = r.imza !== _oynatilan;
        kart.classList.toggle('dst-durgun', !yeni);
        kart.innerHTML = r.html;
        grafikCiz(kart, false);
        if (yeni && r.imza.indexOf('|') > 0) { sayacOynat(kart); _oynatilan = r.imza; }
    }

    function profilKontrol() {
        var sec = document.getElementById('student-profile-section');
        if (!sec) return;
        var r = rol();
        if (r !== 'teacher' && r !== 'admin') {
            var eski = document.getElementById('tpDestek');
            if (eski) eski.remove();
            return;
        }
        if (!sec.querySelector('#tpKisisel')) return;   /* öğretmen profili henüz çizilmedi */
        stilKur();
        var kart = document.getElementById('tpDestek');
        if (!kart) {
            kart = document.createElement('div');
            kart.id = 'tpDestek';
            kart.className = 'glass-card';
            var donem = document.getElementById('tpDonem');
            if (donem && donem.parentNode === sec) sec.insertBefore(kart, donem.nextSibling);
            else sec.insertBefore(kart, sec.firstChild);
            kartCiz(kart);
        }
        var uid = benUid();
        var taze = _ben && _ben.uid === uid && (Date.now() - _ben.zaman < 60000);
        if (taze || _benYukleniyor || !uid) return;
        _benYukleniyor = true;
        benimVerim(true).then(function () {
            _benYukleniyor = false;
            var k = document.getElementById('tpDestek');
            if (k) kartCiz(k);
        }).catch(function (e) {
            _benYukleniyor = false;
            _ben = { uid: uid, zaman: Date.now(), hata: hataYaz(e) };
            var k = document.getElementById('tpDestek');
            if (k) kartCiz(k);
        });
    }

    function gozlemciKur() {
        var sec = document.getElementById('student-profile-section');
        if (!sec) { setTimeout(gozlemciKur, 1500); return; }
        if (sec.__dstGozlem) return;
        sec.__dstGozlem = true;
        var z = null;
        if (typeof MutationObserver === 'function') {
            new MutationObserver(function () {
                clearTimeout(z);
                z = setTimeout(profilKontrol, 50);
            }).observe(sec, { childList: true });
        }
        profilKontrol();
    }

    function kartTazele() {
        _ben = null;
        var k = document.getElementById('tpDestek');
        if (k) { profilKontrol(); }
    }

    /* ------------------------------------------------------------------
       ÖDEME PENCERESİ (öğretmen)
       ------------------------------------------------------------------ */
    var _secim = { tip: 'ay', ay: 1 };

    function odemeKapat() {
        var o = document.getElementById('dstOrt');
        if (o) o.remove();
        document.removeEventListener('keydown', escKapat, true);
    }
    function escKapat(e) { if (e.key === 'Escape') odemeKapat(); }

    function seciliTutar(oz, h) {
        if (_secim.tip === 'ay') return _secim.ay * oz.aylik;
        if (_secim.tip === 'kalan') return h.kalan;
        var g = document.getElementById('dstSerbest');
        return Math.round(+(g && g.value) || 0);
    }

    function toplamYaz() {
        var v = _ben; if (!v || !v.ozet) return;
        var oz = v.ozet, h = benHesap(v);
        var el = document.getElementById('dstToplam');
        if (!el) return;
        var t = seciliTutar(oz, h);
        var acik;
        if (_secim.tip === 'ay') {
            acik = (_secim.ay === 12 ? 'Yıllık · 12 ay' : _secim.ay + ' ay') + ' × ' + tl(oz.aylik) + ' =';
        } else if (_secim.tip === 'kalan') {
            acik = 'Biriken tutarın tamamı:';
        } else {
            acik = 'Gönderdiğin tutar:';
        }
        el.innerHTML = '<span>' + esc(acik) + '</span><b>' + esc(t > 0 ? tl(t) : '—') + '</b>';
    }

    function secimUygula(kutu) {
        [].forEach.call(kutu.querySelectorAll('.dst-ay'), function (b) {
            b.classList.toggle('sec', _secim.tip === 'ay' && +b.getAttribute('data-ay') === _secim.ay);
        });
        [].forEach.call(kutu.querySelectorAll('.dst-ek'), function (b) {
            b.classList.toggle('sec', b.getAttribute('data-tip') === _secim.tip);
        });
        var sb = kutu.querySelector('.dst-serbest');
        if (sb) sb.classList.toggle('acik', _secim.tip === 'serbest');
        toplamYaz();
    }

    function odemeAc() {
        stilKur();
        var v = _ben;
        if (!v || !v.ozet || !v.ozet.hazir) { uyar('Tutar henüz hesaplanmadı. Biraz sonra yeniden deneyin.'); return; }
        var oz = v.ozet, h = benHesap(v);
        var onizleme = rol() === 'admin';
        var al = alici();
        var aciklama = aciklamaMetni();
        _secim = { tip: 'ay', ay: 1 };
        odemeKapat();

        var aylar = '';
        for (var i = 1; i <= 12; i++) {
            aylar += '<button type="button" class="dst-ay" data-ay="' + i + '">' + i +
                '<small>' + (i === 12 ? 'YILLIK' : 'AY') + '</small></button>';
        }
        var ort = document.createElement('div');
        ort.id = 'dstOrt';
        ort.innerHTML =
            '<div id="dstKutu" role="dialog" aria-modal="true" aria-label="Destek ver">' +
              '<div class="dst-m-bas">' + kalpSvg() + '<b>Destek ver</b>' +
                (onizleme ? '<span class="dst-onizleme">Önizleme</span>' : '') +
                '<button type="button" class="dst-kapat" aria-label="Kapat">&times;</button></div>' +
              '<div class="dst-m-bol">' +
                '<p class="dst-m-et">KAÇ AYLIK? · AYLIK ' + esc(tl(oz.aylik)) + '</p>' +
                '<div class="dst-aylar">' + aylar + '</div>' +
                '<div class="dst-ekler">' +
                  (h.kalan > 0 ? '<button type="button" class="dst-ek" data-tip="kalan">Birikenin tamamı · ' + esc(tl(h.kalan)) + '</button>' : '') +
                  '<button type="button" class="dst-ek" data-tip="serbest">Başka tutar</button>' +
                '</div>' +
                '<div class="dst-serbest"><input id="dstSerbest" type="number" min="10" step="10" inputmode="numeric" placeholder="Tutar"> <b>TL</b></div>' +
                '<div class="dst-toplam" id="dstToplam"></div>' +
              '</div>' +
              '<div class="dst-m-bol">' +
                '<p class="dst-m-et">HAVALE / EFT</p>' +
                (al.iban
                    ? '<div class="dst-satir"><span>IBAN</span><code>' + esc(al.iban) + '</code>' +
                      '<button type="button" class="dst-kucuk" data-kopya="' + esc(al.iban.replace(/\s+/g, '')) + '">Kopyala</button></div>'
                    : '<p class="dst-dip">IBAN bilgisi şu an gösterilemiyor; ödeme bilgisi için mesaj kutusundan yazabilirsin.</p>') +
                (al.ad ? '<div class="dst-satir"><span>ALICI</span><b>' + esc(al.ad) + '</b></div>' : '') +
                '<div class="dst-satir"><span>AÇIKLAMA</span><code>' + esc(aciklama) + '</code>' +
                  '<button type="button" class="dst-kucuk" data-kopya="' + esc(aciklama) + '">Kopyala</button></div>' +
                '<p class="dst-dip">Açıklamaya bu kodu yazarsan ödemen sana hızlıca eşleştirilir.</p>' +
              '</div>' +
              '<div class="dst-m-bol">' +
                '<label for="dstNot">NOT (İSTEĞE BAĞLI)</label>' +
                '<input id="dstNot" type="text" maxlength="200" placeholder="ör. ödemeyi başka bir hesaptan gönderdim">' +
                '<button type="button" class="dst-tus ana" id="dstBildir"' + (onizleme ? ' disabled' : '') + '>Ödemeyi yaptım, bildir</button>' +
                '<p class="dst-dip">' + (onizleme
                    ? 'Önizlemede bildirim gönderilmez; öğretmen hesabında bu tuş çalışır.'
                    : 'Bildirimin yöneticiye gider; onaylanınca “Ödenen” kısmına işlenir.') + '</p>' +
              '</div>' +
            '</div>';
        document.body.appendChild(ort);
        document.addEventListener('keydown', escKapat, true);
        var kutu = ort.querySelector('#dstKutu');

        ort.addEventListener('click', function (e) {
            var t = e.target;
            if (t === ort || (t.closest && t.closest('.dst-kapat'))) { odemeKapat(); return; }
            var ay = t.closest && t.closest('.dst-ay');
            if (ay) { _secim = { tip: 'ay', ay: +ay.getAttribute('data-ay') }; secimUygula(kutu); return; }
            var ek = t.closest && t.closest('.dst-ek');
            if (ek) {
                _secim = { tip: ek.getAttribute('data-tip'), ay: 0 };
                secimUygula(kutu);
                if (_secim.tip === 'serbest') { var g = document.getElementById('dstSerbest'); if (g) g.focus(); }
                return;
            }
            var kp = t.closest && t.closest('[data-kopya]');
            if (kp) {
                kopyala(kp.getAttribute('data-kopya')).then(function () {
                    kp.textContent = 'Kopyalandı ✓'; kp.classList.add('tamam');
                    setTimeout(function () { kp.textContent = 'Kopyala'; kp.classList.remove('tamam'); }, 1800);
                });
                return;
            }
            if (t.closest && t.closest('#dstBildir')) bildir();
        });
        var sg = document.getElementById('dstSerbest');
        if (sg) sg.addEventListener('input', toplamYaz);
        secimUygula(kutu);
    }

    function bildir() {
        if (rol() === 'admin') { uyar('Önizleme: yönetici hesabıyla bildirim gönderilmez.'); return; }
        var v = _ben;
        var u = benKim();
        if (!v || !v.ozet || !u) { uyar('Oturum bulunamadı; sayfayı yenileyip tekrar deneyin.'); return; }
        var oz = v.ozet, h = benHesap(v);
        var tutar = seciliTutar(oz, h);
        if (!(tutar >= 10)) { uyar('Lütfen bir süre seçin ya da en az 10 TL yazın.'); return; }
        var tus = document.getElementById('dstBildir');
        if (tus) { tus.disabled = true; tus.textContent = 'Gönderiliyor…'; }
        var not = ((document.getElementById('dstNot') || {}).value || '').trim().slice(0, 200);
        var belge = {
            uid: u.uid, tur: 'destek', durum: 'bekliyor',
            tutar: Math.round(tutar), ay: _secim.tip === 'ay' ? _secim.ay : 0, aylik: oz.aylik,
            secim: _secim.tip, aciklama: aciklamaMetni(u.uid), not: not, kod: ogretmenKodu(u.uid),
            email: u.email || durum('currentUser') || '',
            name: durum('currentUserName') || u.displayName || '',
            phone: durum('currentUserPhone') || '',
            createdAt: sunucuZamani()
        };
        db().collection('siparisler').add(belge).then(function () {
            odemeKapat();
            uyar('Bildirimin alındı ✅\nYönetici ödemeyi görünce onaylayacak; onaylanınca “Ödenen” kısmına işlenir. Desteğin için teşekkürler!');
            kartTazele();
        }).catch(function (e) {
            if (tus) { tus.disabled = false; tus.textContent = 'Ödemeyi yaptım, bildir'; }
            uyar('Bildirim gönderilemedi: ' + hataYaz(e));
        });
    }

    function oner() {
        var metin = 'Arapça dersleri için hazırlanmış materyaller, oyunlar, sınavlar ve sınıf araçları Kidef Arapça\'da. Sen de katıl: ' + SITE;
        try {
            if (navigator.share) {
                navigator.share({ title: 'Kidef Arapça', text: metin }).catch(function () { });
                return;
            }
        } catch (e) { }
        kopyala(metin).then(function () { uyar('Davet metni kopyalandı. Meslektaşına gönderebilirsin.'); });
    }

    /* ------------------------------------------------------------------
       YÖNETİCİ
       ------------------------------------------------------------------ */
    var _liste = [];          /* son öğretmen listesi (teacher-admin.js verir) */
    var _defter = null;       /* uid -> defterdeki toplam */
    var _bekleyen = null;     /* onay bekleyen bildirimler */
    var _acik = null;         /* açık öğretmen penceresindeki ücret bölümü {kutu, uid, bilgi} */

    function yoneticiMi() { return rol() === 'admin'; }

    /* Öğretmen listesine göre özeti hesaplar; gerekirse mufredat/_destek'e yazar. */
    function ozetYayinla(liste, zorla) {
        if (!yoneticiMi() || !db()) return Promise.resolve(null);
        var simdi = Date.now(), aktif = 0, onayli = 0;
        (liste || []).forEach(function (o) {
            if (onayliMi(o)) onayli++;
            if (aktifMi(o, simdi)) aktif++;
        });
        return ozetOku(true).then(function (oz) {
            var aylik = aylikHesapla(oz.toplam, oz.taban, aktif);
            var ay = ayAnahtar(new Date());
            var me = benUid();
            var degisti = oz.aktif !== aktif || oz.aylik !== aylik || oz.onayli !== onayli || +oz.gecmis[ay] !== aylik ||
                          (me && oz.yoneticiler.indexOf(me) < 0);
            var bayat = !oz.guncelleme || (simdi - oz.guncelleme.getTime() > 6 * 3600e3);
            if (!degisti && !bayat && !zorla) return oz;
            var gecmis = {}; gecmis[ay] = aylik;
            return db().collection('mufredat').doc('_destek').set({
                tur: 'destekOzet', toplam: oz.toplam, taban: oz.taban,
                aktif: aktif, onayli: onayli, aylik: aylik, gecmis: gecmis,
                yoneticiler: firebase.firestore.FieldValue.arrayUnion(me),
                guncelleme: sunucuZamani()
            }, { merge: true }).then(function () { return ozetOku(true); });
        });
    }

    var _yayinHata = '';
    function listeGeldi(liste) {
        _liste = liste || [];
        if (!yoneticiMi()) return;
        stilKur();
        ozetYayinla(_liste).then(function () { _yayinHata = ''; }, function (e) {
            _yayinHata = hataYaz(e);
            try { console.warn('destek özeti yazılamadı:', _yayinHata); } catch (x) { }
        }).then(function () { ayarCiz(); rozetleriYenile(); });
    }

    /* Yönetici oturumu uzun açık kalırsa sayı 3 saatte bir tazelenir
       (listeyi yeniden çizmeden, ayrı sorguyla). */
    setInterval(function () {
        if (!yoneticiMi() || !db() || document.visibilityState === 'hidden') return;
        db().collection('kullanicilar').where('role', '==', 'teacher').get().then(function (snap) {
            var L = [];
            snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; L.push(v); });
            _liste = L;
            return ozetYayinla(L);
        }).then(function () { _yayinHata = ''; ayarCiz(); }, function (e) { _yayinHata = hataYaz(e); ayarCiz(); });
    }, 3 * 3600e3);

    function ayarCiz() {
        var el = document.getElementById('admin-destek-ayar');
        if (!el || !yoneticiMi()) return;
        stilKur();
        ozetOku().then(function (oz) {
            var bek = _bekleyen ? _bekleyen.length : 0;
            el.innerHTML =
                '<div class="dst-a-ust"><b>💛 Beklenen Destek</b>' +
                  '<span>Son 30 günde aktif: <b>' + oz.aktif + '</b> öğretmen' + (oz.onayli ? ' (onaylı ' + oz.onayli + ')' : '') + '</span>' +
                  '<span>Kişi başı: <b>' + esc(oz.hazir ? tl(oz.aylik) : '—') + '</b> / ay</span>' +
                  (oz.guncelleme ? '<span style="color:#A0927E;">yayın ' + esc(saatliYaz(oz.guncelleme)) + '</span>' : '') +
                  (bek ? '<span style="color:#B5670A; font-weight:800;">' + bek + ' bildirim onay bekliyor</span>' : '') +
                '</div>' +
                (_yayinHata ? '<div style="margin-top:8px; color:#B03A2E; font-weight:700;">Özet yazılamadı (' + esc(_yayinHata) + '). ' +
                    'Firestore kurallarında mufredat koleksiyonuna yönetici yazma izni olmalı; öğretmenlerin kartında tutar görünmez.</div>' : '') +
                '<div class="dst-a-form">' +
                  '<span>Aylık toplam</span><input id="dstAyToplam" type="number" min="0" step="500" value="' + oz.toplam + '"> TL' +
                  '<span style="margin-inline-start:6px;">Kişi başı en az</span><input id="dstAyTaban" type="number" min="0" step="50" value="' + oz.taban + '"> TL' +
                  '<button type="button" class="dst-yb kaydet" data-dst="ayar-kaydet">Kaydet</button>' +
                '</div>';
        }).catch(function (e) {
            el.innerHTML = '<span style="color:#B03A2E;">Destek özeti okunamadı: ' + esc(hataYaz(e)) + '</span>';
        });
    }

    function ayarKaydet() {
        var t = Math.round(+((document.getElementById('dstAyToplam') || {}).value) || 0);
        var ta = Math.round(+((document.getElementById('dstAyTaban') || {}).value));
        if (!(t > 0) || isNaN(ta) || ta < 0) { uyar('Aylık toplam 0\'dan büyük, alt sınır 0 ya da daha büyük olmalı.'); return; }
        sor('Aylık toplam ' + tl(t) + ', kişi başı en az ' + tl(ta) + ' olarak kaydedilsin mi?\n' +
            'Bu ayın tutarı hemen yeniden hesaplanır; biten ayların tutarı değişmez.').then(function (evet) {
            if (!evet) return;
            db().collection('mufredat').doc('_destek').set({ toplam: t, taban: ta, ayarElle: true }, { merge: true }).then(function () {
                _ozet = null;
                if (_liste.length) return ozetYayinla(_liste, true);
                return ozetOku(true).then(function (oz) {
                    var g = {}; g[ayAnahtar(new Date())] = aylikHesapla(t, ta, oz.aktif);
                    return db().collection('mufredat').doc('_destek').set({
                        aylik: aylikHesapla(t, ta, oz.aktif), gecmis: g, guncelleme: sunucuZamani()
                    }, { merge: true });
                });
            }).then(function () {
                _ozet = null; ayarCiz(); rozetleriYenile();
                uyar('Destek ayarları kaydedildi.');
            }).catch(function (e) { uyar('Kaydedilemedi: ' + hataYaz(e)); });
        });
    }

    function rozetYaz() {
        var n = _bekleyen ? _bekleyen.length : 0;
        ['admin-destek-badge', 'admin-destek-badge-odeme'].forEach(function (id) {
            var b = document.getElementById(id);
            if (b) b.innerHTML = n ? '<span class="dst-rozet" title="Onay bekleyen destek bildirimi">💛 ' + n + '</span>' : '';
        });
    }

    /* Öğretmen kartlarındaki küçük destek rozetleri. Panel açılırken
       birkaç yerden art arda çağrılabilir; uçuştaki istek paylaşılır. */
    var _rozetSoz = null;
    function rozetleriYenile() {
        if (!yoneticiMi() || !db()) return Promise.resolve();
        if (_rozetSoz) return _rozetSoz;
        _rozetSoz = rozetleriYenile2().then(function () { _rozetSoz = null; }, function (e) {
            _rozetSoz = null;
            try { console.warn('destek rozetleri:', hataYaz(e)); } catch (x) { }
        });
        return _rozetSoz;
    }
    function rozetleriYenile2() {
        return Promise.all([ozetOku(), tumDefter().catch(function () { return {}; }), tumBekleyen().catch(function () { return []; })])
            .then(function (r) {
                var oz = r[0]; _defter = r[1]; _bekleyen = r[2];
                rozetYaz();
                var bekSay = {};
                _bekleyen.forEach(function (b) { bekSay[b.uid] = (bekSay[b.uid] || 0) + 1; });
                var O = window._adminOgretmenler || {};
                [].forEach.call(document.querySelectorAll('[data-dst-rozet]'), function (el) {
                    var uid = el.getAttribute('data-dst-rozet');
                    var bilgi = O[uid] || {};
                    var doc = bilgi.doc || {};
                    var html = '';
                    if (bekSay[uid]) {
                        html = '<span class="dst-cip bekliyor">💛 ' + bekSay[uid] + ' bildirim</span>';
                    } else if (onayliMi(doc) && oz.hazir) {
                        var h = hesapla(kayitTarihi(doc), _defter[uid] || 0, oz);
                        html = h.kalan > 0
                            ? '<span class="dst-cip" style="background:#FFF4DE; color:#9A6512;">kalan ' + esc(tl(h.kalan)) + '</span>'
                            : '<span class="dst-cip onaylandi">destek güncel</span>';
                    }
                    el.innerHTML = html;
                });
                bekleyenCiz();
                ayarCiz();
            });
    }

    function bekleyenSatir(b, adGoster) {
        return '<div class="dst-y-sat">' +
            (adGoster ? '<b>' + esc(b.ad || b.email || 'Öğretmen') + '</b>' + (b.kod ? '<span class="n">' + esc(b.kod) + '</span>' : '') : '') +
            '<span class="t">' + esc(tl(b.tutar)) + '</span>' +
            '<span class="n">' + (b.ay ? b.ay + ' ay' : 'serbest tutar') + ' · ' + esc(saatliYaz(b.tarih)) + '</span>' +
            (b.not ? '<span class="n" style="font-style:italic;">“' + esc(b.not) + '”</span>' : '') +
            '<span class="bos"></span>' +
            '<button type="button" class="dst-yb onay" data-dst="onayla" data-id="' + esc(b.id) + '">✅ Onayla</button>' +
            '<button type="button" class="dst-yb red" data-dst="reddet" data-id="' + esc(b.id) + '">Reddet</button>' +
            (adGoster ? '<button type="button" class="dst-yb ac" data-dst="ac" data-uid="' + esc(b.uid) + '">Öğretmeni aç</button>' : '') +
            '</div>';
    }

    /* Ödeme Onayları bölümündeki destek bildirimleri */
    function bekleyenCiz() {
        var el = document.getElementById('admin-destek-bekleyen');
        if (!el) return;
        var L = _bekleyen || [];
        if (!L.length) { el.innerHTML = ''; return; }
        el.innerHTML = '<div class="dst-y dst-y-bekleyen"><b>💛 Destek bildirimleri (' + L.length + ')</b>' +
            L.map(function (b) { return bekleyenSatir(b, true); }).join('') + '</div>';
    }

    /* Öğretmen penceresinin "Ücret" sekmesi */
    function yoneticiBolum(kutu, uid, bilgi) {
        if (!kutu) return;
        stilKur();
        _acik = { kutu: kutu, uid: uid, bilgi: bilgi || {} };
        kutu.innerHTML = '<p class="dst-y-yok">Yükleniyor…</p>';
        Promise.all([ozetOku(), bildirimleriOku(uid), defterOku(uid)]).then(function (r) {
            if (!_acik || _acik.kutu !== kutu) return;
            var oz = r[0], bil = r[1], def = r[2];
            var doc = (bilgi && bilgi.doc) || {};
            var odenen = def.reduce(function (a, k) { return a + k.tutar; }, 0);
            var h = hesapla(kayitTarihi(doc), odenen, oz);
            var aktif = aktifMi(doc, Date.now());
            var bekleyen = bil.filter(function (b) { return b.durum === 'bekliyor'; });
            var gecmis = bil.filter(function (b) { return b.durum !== 'bekliyor'; });

            var s = '<div class="dst-y">';
            if (!onayliMi(doc)) {
                s += '<p class="dst-y-bilgi" style="margin-top:0;">Bu hesap onaylı değil; onaylanana kadar destek hesabına girmez.</p>';
            }
            s += '<div class="dst-y-kutular">' +
                '<div class="dst-y-k"><b>' + esc(oz.hazir ? tl(h.beklenen) : '—') + '</b><span>BEKLENEN · ' + h.donem + ' AY</span></div>' +
                '<div class="dst-y-k odenen"><b>' + esc(tl(odenen)) + '</b><span>ÖDENEN</span></div>' +
                '<div class="dst-y-k kalan"><b>' + esc(oz.hazir ? tl(h.kalan) : '—') + '</b><span>KALAN</span></div>' +
                (h.fazla > 0 ? '<div class="dst-y-k odenen"><b>' + esc(tl(h.fazla)) + '</b><span>FAZLA (İLERİ AYLAR)</span></div>' : '') +
                '</div>' +
                '<p class="dst-y-bilgi">Kayıt ' + esc(gunYaz(h.kayit)) + ' · aylık ' + esc(oz.hazir ? tl(oz.aylik) : '—') +
                ' · son 30 günde ' + (aktif ? '<b style="color:#1E8449;">aktif</b>' : '<b style="color:#A9B2BD;">aktif değil</b>') +
                ' · açıklama kodu <b>' + esc(aciklamaMetni(uid)) + '</b></p>';

            s += '<h5>Onay bekleyen bildirimler (' + bekleyen.length + ')</h5>' +
                (bekleyen.length ? bekleyen.map(function (b) { return bekleyenSatir(b, false); }).join('')
                                 : '<p class="dst-y-yok">Bekleyen bildirim yok.</p>');

            s += '<h5>Ödeme defteri (' + def.length + ')</h5>' +
                (def.length ? def.map(function (k) {
                    return '<div class="dst-y-sat">' +
                        '<span class="t">' + esc(tl(k.tutar)) + '</span>' +
                        '<span class="n">' + (k.ay ? k.ay + ' ay' : 'serbest tutar') + ' · ' + esc(gunYaz(k.tarih)) + '</span>' +
                        (k.kaynak === 'bildirim' ? '<span class="dst-cip onaylandi">bildirimden</span>' : '<span class="dst-cip elle">elle girildi</span>') +
                        (k.not ? '<span class="n" style="font-style:italic;">“' + esc(k.not) + '”</span>' : '') +
                        '<span class="bos"></span>' +
                        '<button type="button" class="dst-yb sil" data-dst="kayit-sil" data-id="' + esc(k.id) + '">Sil</button>' +
                        '</div>';
                }).join('') : '<p class="dst-y-yok">Henüz kayıtlı ödeme yok.</p>');

            var ayOps = '<option value="0">serbest</option>';
            for (var i = 1; i <= 12; i++) ayOps += '<option value="' + i + '">' + (i === 12 ? '12 ay (yıllık)' : i + ' ay') + '</option>';
            s += '<h5>Elle ödeme ekle</h5>' +
                '<div class="dst-y-form" data-uid="' + esc(uid) + '">' +
                  '<label>AY<select class="dst-f-ay">' + ayOps + '</select></label>' +
                  '<label>TUTAR (TL)<input class="dst-f-tutar" type="number" min="1" step="10" style="width:120px;"></label>' +
                  '<label>ÖDEME TARİHİ<input class="dst-f-tarih" type="date" value="' + inputTarih(new Date()) + '"></label>' +
                  '<label style="flex:1 1 180px;">NOT<input class="dst-f-not" type="text" maxlength="200" placeholder="ör. elden / başka hesaptan"></label>' +
                  '<button type="button" class="dst-yb kaydet" data-dst="elle-ekle" data-uid="' + esc(uid) + '">Kaydet</button>' +
                '</div>' +
                '<p class="dst-y-bilgi">Ay seçince tutar o ayın tutarıyla dolar; istersen değiştir. Havale bildirimi gelmeden yapılan ödemeleri buradan gir.</p>';

            if (gecmis.length) {
                s += '<details style="margin-top:12px;"><summary style="cursor:pointer; font-weight:800; color:#8A94A3; font-size:.86rem;">Sonuçlanan bildirimler (' + gecmis.length + ')</summary>' +
                    '<div style="margin-top:8px;">' + gecmis.map(function (b) {
                        return '<div class="dst-y-sat">' + durumCipi(b.durum) +
                            '<span class="t">' + esc(tl(b.tutar)) + '</span>' +
                            '<span class="n">' + (b.ay ? b.ay + ' ay' : 'serbest tutar') + ' · ' + esc(saatliYaz(b.tarih)) + '</span>' +
                            (b.not ? '<span class="n" style="font-style:italic;">“' + esc(b.not) + '”</span>' : '') + '</div>';
                    }).join('') + '</div></details>';
            }
            s += '</div>';
            kutu.innerHTML = s;
            kutu.__dstAylik = oz.aylik;

            /* öğretmenin kartında gördüğü özet defterle aynı değilse düzelt */
            var ozt = doc.destek || {};
            if ((+ozt.odenen || 0) !== odenen || (+ozt.adet || 0) !== def.length) {
                ogretmenOzetYaz(uid, def).catch(function () { });
            }
        }).catch(function (e) {
            kutu.innerHTML = '<p style="color:#B03A2E;">Destek bilgisi alınamadı: ' + esc(hataYaz(e)) + '</p>';
        });
    }

    function acikTazele() {
        if (_acik && _acik.kutu && document.body.contains(_acik.kutu)) yoneticiBolum(_acik.kutu, _acik.uid, _acik.bilgi);
    }

    function ogretmenOzetYaz(uid, defterVar) {
        var p = defterVar ? Promise.resolve(defterVar) : defterOku(uid);
        return p.then(function (L) {
            var top = 0, son = null;
            L.forEach(function (k) { top += k.tutar; if (k.tarih && (!son || k.tarih > son)) son = k.tarih; });
            return db().collection('kullanicilar').doc(uid).set({
                destek: { odenen: top, adet: L.length, sonOdeme: son || null, guncelleme: sunucuZamani() }
            }, { merge: true }).then(function () {
                var O = window._adminOgretmenler || {};
                if (O[uid] && O[uid].doc) O[uid].doc.destek = { odenen: top, adet: L.length };
                return top;
            });
        });
    }

    function sonrasi() {
        acikTazele();
        rozetleriYenile();
    }

    function onayla(id) {
        var me = benUid();
        var ref = db().collection('siparisler').doc(id);
        return ref.get().then(function (s) {
            if (!s.exists) throw new Error('Bildirim bulunamadı');
            var b = bildirimDuzen(s.id, s.data() || {});
            if (b.durum === 'onaylandi') { uyar('Bu bildirim zaten onaylanmış.'); return null; }
            return sor((b.ad || b.email || 'Öğretmen') + ' · ' + tl(b.tutar) + (b.ay ? ' (' + b.ay + ' ay)' : '') +
                       '\nÖdeme hesaba geldiyse onaylayın. Onaylanan tutar öğretmenin “Ödenen” kısmına işlenir.').then(function (evet) {
                if (!evet) return null;
                return db().collection('siparisler').doc('dk_' + id).set({
                    uid: me, tur: 'destekKayit', ogretmenUid: b.uid, tutar: b.tutar, ay: b.ay,
                    kaynak: 'bildirim', siparisId: id, not: b.not || '',
                    odemeTarihi: b.tarih || new Date(), tarih: sunucuZamani()
                }).then(function () {
                    return ref.update({ durum: 'onaylandi', onayTarihi: sunucuZamani(), onaylayan: me });
                }).then(function () {
                    return ogretmenOzetYaz(b.uid);
                }).then(function () {
                    uyar('Onaylandı ✅ ' + tl(b.tutar) + ' öğretmenin ödenen kısmına işlendi.');
                    sonrasi();
                });
            });
        }).catch(function (e) { uyar('Onaylanamadı: ' + hataYaz(e)); });
    }

    function reddet(id) {
        return sor('Bu destek bildirimi reddedilsin mi?\n(Ödeme hesaba gelmediyse ya da yanlış bildirildiyse.)').then(function (evet) {
            if (!evet) return null;
            return db().collection('siparisler').doc(id).update({ durum: 'reddedildi', redTarihi: sunucuZamani(), reddeden: benUid() })
                .then(function () { uyar('Bildirim reddedildi.'); sonrasi(); });
        }).catch(function (e) { uyar('İşlem başarısız: ' + hataYaz(e)); });
    }

    function elleEkle(form, uid) {
        var tutar = Math.round(+form.querySelector('.dst-f-tutar').value || 0);
        var ay = Math.floor(+form.querySelector('.dst-f-ay').value || 0);
        var td = form.querySelector('.dst-f-tarih').value;
        var not = (form.querySelector('.dst-f-not').value || '').trim().slice(0, 200);
        if (!(tutar > 0)) { uyar('Tutar yazın.'); return; }
        var tarih = td ? new Date(td + 'T12:00:00') : new Date();
        if (isNaN(tarih.getTime())) tarih = new Date();
        var bilgi = (_acik && _acik.bilgi) || {};
        sor((bilgi.ad || 'Öğretmen') + ' için ' + tl(tutar) + (ay ? ' (' + ay + ' ay)' : '') + ' ödeme kaydedilsin mi?').then(function (evet) {
            if (!evet) return;
            return db().collection('siparisler').add({
                uid: benUid(), tur: 'destekKayit', ogretmenUid: uid, tutar: tutar, ay: ay,
                kaynak: 'elle', siparisId: '', not: not, odemeTarihi: tarih, tarih: sunucuZamani()
            }).then(function () { return ogretmenOzetYaz(uid); })
              .then(function () { uyar('Ödeme kaydedildi ✅'); sonrasi(); });
        }).catch(function (e) { uyar('Kaydedilemedi: ' + hataYaz(e)); });
    }

    function kayitSil(id) {
        var ref = db().collection('siparisler').doc(id);
        ref.get().then(function (s) {
            if (!s.exists) throw new Error('Kayıt bulunamadı');
            var k = kayitDuzen(s.id, s.data() || {});
            return sor(tl(k.tutar) + ' tutarlı ödeme kaydı silinsin mi?' +
                       (k.siparisId ? '\nBağlı bildirim yeniden “onay bekliyor” olur.' : '')).then(function (evet) {
                if (!evet) return;
                return ref.delete().then(function () {
                    if (k.siparisId) {
                        return db().collection('siparisler').doc(k.siparisId)
                            .update({ durum: 'bekliyor', onayTarihi: null }).catch(function () { });
                    }
                }).then(function () { return ogretmenOzetYaz(k.ogretmenUid); })
                  .then(function () { uyar('Kayıt silindi.'); sonrasi(); });
            });
        }).catch(function (e) { uyar('Silinemedi: ' + hataYaz(e)); });
    }

    /* Yönetici tuşları: tek dinleyici (onclick içine kimlik gömmeden) */
    document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-dst]') : null;
        if (!t || !yoneticiMi()) return;
        var is = t.getAttribute('data-dst');
        if (is === 'onayla') onayla(t.getAttribute('data-id'));
        else if (is === 'reddet') reddet(t.getAttribute('data-id'));
        else if (is === 'kayit-sil') kayitSil(t.getAttribute('data-id'));
        else if (is === 'elle-ekle') elleEkle(t.closest('.dst-y-form'), t.getAttribute('data-uid'));
        else if (is === 'ayar-kaydet') ayarKaydet();
        else if (is === 'ac') {
            if (typeof window.adminOgretmenDetay === 'function') window.adminOgretmenDetay(t.getAttribute('data-uid'), 'ucret');
        }
    });
    /* elle ödeme: ay seçilince tutarı doldur */
    document.addEventListener('change', function (e) {
        var t = e.target;
        if (!t || !t.classList || !t.classList.contains('dst-f-ay')) return;
        var form = t.closest('.dst-y-form');
        var kutu = _acik && _acik.kutu;
        var aylik = (kutu && kutu.__dstAylik) || 0;
        var ay = +t.value || 0;
        if (form && ay && aylik) form.querySelector('.dst-f-tutar').value = ay * aylik;
    });

    /* ------------------------------------------------------------------
       DIŞA AÇILANLAR
       ------------------------------------------------------------------ */
    window.KidefDestek = {
        /* hesap (test ve diğer modüller için) */
        aylikHesapla: aylikHesapla, hesapla: hesapla, ozetDuzen: ozetDuzen,
        kayitTarihi: kayitTarihi, aktifMi: aktifMi, onayliMi: onayliMi,
        /* öğretmen */
        odemeAc: odemeAc, oner: oner, profilKontrol: profilKontrol, tazele: kartTazele,
        /* yönetici */
        listeGeldi: listeGeldi, ozetYayinla: ozetYayinla, ayarCiz: ayarCiz,
        rozetleriYenile: rozetleriYenile, bekleyenCiz: bekleyenCiz, yoneticiBolum: yoneticiBolum,
        onayla: onayla, reddet: reddet
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', gozlemciKur);
    else gozlemciKur();
})();
