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
       en son "30.000 olsun"); yönetici panelinde elle artırılır (20.10.2026:
       "30.000 tl yi manuel olarak arttırabileceğim şekilde ayarla, yönetici
       hesabında"): Öğretmenler bölümünde Aylık toplam + 1.000 / 5.000 / 10.000
     · kişi başı = aylık toplam ÷ son 30 günde siteye giren onaylı öğretmen;
       ALT SINIR YOK (20.10.2026: "ücreti minimum 500 tl kuralını kaldır,
       gerçekten 30.000 tl yi sürekli güncellenen girişe bağla"). Sayı,
       yönetici siteye girince (listeyi açmasa da) ve sayfa açık kaldıkça
       30 dakikada bir yeniden sayılır (sayimYap); tutar değişince herkese
       açık özet hemen yazılır
     · ödenmeyen tutar KAYIT TARİHİNDEN itibaren GÜN GÜN birikir (her gün
       aylık tutarın o dönemdeki bir günlüğü); kısmi ödeme serbest; 1-12 ay
       ya da yıllık seçilebilir
     · öğretmen "ödedim" diye bildirir, yönetici onaylar (ya da elle girer)
     · tutarlar sonradan yönetici panelinden değiştirilebilir

   DÖNEMLİK SABİT PAY (22.10.2026) — öğretmen: "öğretmenler profiline
   girdiklerinde günlük artan bi fiyat yerine nasıl bi fiyatlandırma bulsalar
   daha iyi olur" → önerim (dönemlik sabit pay + ortak hedef çubuğu, «borç /
   kalan» yok, ilk ay ücretsiz) → "tamam önerdiğin gibi olsun".
     · YUKARIDAKİ "GÜN GÜN BİRİKİR" KURALI KALKTI. Öğretim yılı iki dönem:
       1. dönem 1 Eylül – 31 Ocak, 2. dönem 1 Şubat – 31 Ağustos (yaz dahil).
     · dönem payı = kişi başı aylık × 6 (yılda iki dönem = 12 ay); dönem
       başında (ilk sayımda) bir kez SABİTLENİR, dönem boyunca kendiliğinden
       değişmez. Katılım arttıkça GELECEK dönemin payı düşer. Yönetici
       «Kaydet» ya da «yeniden hesapla» ile bu dönemin payını elle değiştirebilir.
     · yeni öğretmenin ilk 30 günü ücretsiz; dönemin ortasında katılanın payı
       dönemin kalan süresiyle orantılı (10 TL'ye yukarı yuvarlanır).
     · ödeme önce YAPILDIĞI dönemin payını doldurur, artanı sonraki döneme
       geçer (ön ödeme). Geçmiş dönemin eksiği BORÇ SAYILMAZ, geriye taşınmaz.
     · ORTAK HEDEF: bu döneme düşen bütün desteklerin, dönemin giderine
       (aylık toplam × 6) oranı — yalnız YÜZDE yayınlanır, tutar/sayı yok.
     · mufredat/_destek'e: donem {kod:'2026-27/1', pay, yuzde, bas, bit, sabit}
       ve donemler {kod: pay} (geçmiş dönemlerin payı). kullanicilar/{uid}.
       destek.odemeler [{t, tutar}] — yönetici defterden yazar; öğretmenin
       kartı dağıtımı bundan hesaplar.

   VERİ — Firestore kurallarına DOKUNMADAN:
     mufredat/_destek          yalnız yönetici yazar, girişli herkes okur
        { aylik, gecmis:{'YYYY-MM':tutar}, yoneticiler:[uid], guncelleme }
        Öğretmen sayısı ve toplam BURADA YOK (öğretmen okuyabilir).
     siparisler/_destekAyar    yalnız yönetici okur/yazar (uid = yönetici)
        { toplam, ayarElle, aktif, onayli, guncelleme }  (eski "taban" silinir)
        Yönetici oturumu öğretmen listesini okuyunca (teacher-admin.js →
        renderAdminTeacherList) ve ayrıca en geç 30 dakikada bir (sayimYap)
        yeniden hesaplar; sayı/tutar değiştiyse ya da 6 saat geçtiyse yazar. gecmis = her ayın son tutarı (biten
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

    var VARSAYILAN = { toplam: 30000 };
    var GUN = 864e5;
    var DONEM_AY = 6, ILK_AY_GUN = 30;     /* 22.10.2026: dönem payı = aylık × 6; ilk 30 gün ücretsiz */
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
    /* kişi başı aylık = aylık toplam ÷ son 30 günde giren onaylı öğretmen,
       10 TL'ye yukarı yuvarlanır. Alt sınır yok (20.10.2026). */
    function aylikHesapla(toplam, aktif) {
        var n = Math.max(1, Math.floor(+aktif || 0));
        return Math.ceil((+toplam || 0) / n / 10) * 10;
    }

    /* HERKESE AÇIK özet (mufredat/_destek): öğretmen yalnız aylık tutarı ve
       geçmişini okur. Öğretmen sayısı ve aylık toplam burada TUTULMAZ
       ("sayı belli olmasın") — onlar yalnız yöneticinin okuyabildiği
       siparisler/_destekAyar belgesinde. */
    function ozetDuzen(o) {
        o = o || {};
        var aylik = +o.aylik > 0 ? Math.round(+o.aylik) : 0;
        /* 22.10.2026: dönem payı (sabit) ve ortak hedef yüzdesi */
        var d = (o.donem && typeof o.donem === 'object') ? o.donem : null;
        var donem = (d && /^\d{4}-\d{2}\/[12]$/.test(String(d.kod || '')) && +d.pay > 0) ? {
            kod: String(d.kod), pay: Math.round(+d.pay),
            yuzde: (d.yuzde === null || d.yuzde === undefined || isNaN(+d.yuzde)) ? null : Math.max(0, Math.round(+d.yuzde)),
            sabit: +d.sabit || 0
        } : null;
        var donemler = {};
        if (o.donemler && typeof o.donemler === 'object') {
            Object.keys(o.donemler).forEach(function (k) {
                if (/^\d{4}-\d{2}\/[12]$/.test(k) && +o.donemler[k] > 0) donemler[k] = Math.round(+o.donemler[k]);
            });
        }
        return {
            hazir: aylik > 0 || !!donem,
            aylik: aylik,
            donem: donem,
            donemler: donemler,
            gecmis: (o.gecmis && typeof o.gecmis === 'object') ? o.gecmis : {},
            yoneticiler: Array.isArray(o.yoneticiler) ? o.yoneticiler : [],
            destekciler: destekciDuzen(o.destekciler),
            guncelleme: tarihAl(o.guncelleme),
            /* eski sürümün açık belgeye yazdığı alanlar kaldıysa temizlenir */
            eskiAlan: ['tur', 'toplam', 'taban', 'aktif', 'onayli', 'ayarElle'].some(function (k) { return k in o; })
        };
    }

    /* DESTEKÇİLER KÖŞESİ (20.10.2026 — öğretmen: "ücret ödeyenlere teşekkür
       kısmı ekleyelim, hem teşvik olur hem minnetimizi gösteririz … sitemize
       layık bi şekilde"). Chat değil: ödeme onaylanınca yönetici, öğretmenin
       KISA adını (Ayşe Y.) ve varsa meslektaşlarına yazdığı tek cümleyi
       herkese açık özete (mufredat/_destek.destekciler) ekler. Tutar, sayı,
       sıralama yok. Öğretmen bildirimde "adım görünsün" kutusunu kapatırsa
       eklenmez. Ana sayfada öğretmenlere yarı saydam şerit, destek kartında
       "Destekçiler" köşesi, profilde yıl rozeti bu listeden/belgeden çizilir.
       Kayıt: { ad, ay:'YYYY-MM', t: ms, not } — en yeni başta, en çok 80. */
    var DESTEKCI_SINIR = 80, KOSE_NOT_SINIR = 100;
    function kisaAd(ad) {
        var p = String(ad || '').trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
        if (!p.length) return '';
        if (p.length === 1) return p[0];
        var son = p[p.length - 1];
        return p.slice(0, -1).join(' ') + ' ' + son.charAt(0).toLocaleUpperCase('tr-TR') + '.';
    }
    function destekciDuzen(L) {
        if (!Array.isArray(L)) return [];
        var out = [];
        L.forEach(function (x) {
            if (!x || typeof x !== 'object') return;
            var ad = String(x.ad || '').trim().slice(0, 40);
            if (!ad) return;
            out.push({ ad: ad, ay: /^\d{4}-\d{2}$/.test(x.ay) ? x.ay : '', t: +x.t || 0,
                       not: String(x.not || '').trim().slice(0, KOSE_NOT_SINIR) });
        });
        out.sort(function (a, b) { return b.t - a.t; });
        return out.slice(0, DESTEKCI_SINIR);
    }
    function ayAdi(anahtar) {
        var p = String(anahtar || '').split('-');
        if (p.length < 2) return anahtar || '';
        var d = new Date(+p[0], +p[1] - 1, 1);
        return isNaN(d.getTime()) ? anahtar : d.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    }

    /* YÖNETİCİYE ÖZEL ayarlar (siparisler/_destekAyar, uid = yönetici):
       sipariş kuralları gereği yalnız yönetici okur. Aylık toplam
       yalnız panelden ELLE kaydedildiyse (ayarElle) geçerli; yoksa koddaki
       değer. Belgeyi bir yönetici yazmadıysa (uid listede değil) hiç
       güvenilmez. */
    function ayarDuzen(o, oz) {
        o = o || {};
        var me = benUid();
        var guvenli = !!o.uid && (o.uid === me || ((oz && oz.yoneticiler) || []).indexOf(o.uid) >= 0);
        var elle = guvenli && o.ayarElle === true;
        return {
            guvenli: guvenli,
            elle: elle,
            toplam: (elle && +o.toplam > 0) ? +o.toplam : VARSAYILAN.toplam,
            eskiTaban: guvenli && ('taban' in o),
            aktif: guvenli ? Math.max(0, Math.floor(+o.aktif || 0)) : 0,
            onayli: guvenli ? Math.max(0, Math.floor(+o.onayli || 0)) : 0,
            var: !!o.uid
        };
    }

    /* Kayıttan bugüne biriken — GÜN GÜN (19.10.2026: "fiyatlar gün gün
       artsın" → "borç her gün birikir"; "sadece günlük para hesaplansın").
       Günlük tutar = o ayın kişi başı aylık tutarı ÷ 30. Kayıt günü dahil
       bugüne kadarki her gün, içinde bulunduğu takvim ayının günlük
       tutarıyla eklenir (1 ay = 30 gün). Ayın tutarı gecmis'ten; bu
       özellikten önceki aylar ilk bilinen tutarla sayılır. */
    function gunBasi(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function gunFarki(a, b) { return Math.round((gunBasi(b) - gunBasi(a)) / GUN); }
    function aylikFiyat(oz, d) {
        var G = oz.gecmis || {};
        var anah = Object.keys(G).filter(function (k) { return +G[k] > 0; }).sort();
        if (!anah.length) return oz.aylik;
        var a = ayAnahtar(d), v = 0;
        for (var i = 0; i < anah.length; i++) {
            if (anah[i] <= a) v = +G[anah[i]]; else break;
        }
        return v > 0 ? v : +G[anah[0]];
    }
    function hesapla(kayit, odenen, oz, simdi) {
        simdi = simdi || new Date();
        var bugun = gunBasi(simdi);
        var bas = gunBasi((kayit && !isNaN(kayit.getTime())) ? kayit : simdi);
        if (bas > bugun) bas = bugun;
        var beklenen = 0, gun = 0, y = bas.getFullYear(), m = bas.getMonth();
        for (var k = 0; k < 1200; k++) {
            var ayBas = new Date(y, m, 1), aySon = new Date(y, m + 1, 0);
            var a = ayBas < bas ? bas : ayBas, b = aySon > bugun ? bugun : aySon;
            if (a > bugun) break;
            var g = gunFarki(a, b) + 1;
            beklenen += g * aylikFiyat(oz, ayBas) / 30;
            gun += g;
            if (++m > 11) { m = 0; y++; }
        }
        beklenen = Math.round(beklenen);
        odenen = Math.max(0, Math.round(+odenen || 0));
        return {
            kayit: bas, gun: gun, gunluk: aylikFiyat(oz, bugun) / 30,
            beklenen: beklenen, odenen: odenen,
            kalan: Math.max(0, beklenen - odenen),
            fazla: Math.max(0, odenen - beklenen),
            oran: beklenen > 0 ? Math.min(1, odenen / beklenen) : (odenen > 0 ? 1 : 0)
        };
    }
    /* (hesapla: 19-21.10'daki gün gün biriken hesap; 22.10.2026'dan beri
       kartta ve yönetici panelinde KULLANILMIYOR — yerine dönem hesabı.) */

    /* ------------------------------------------------------------------
       DÖNEM (22.10.2026)
       ------------------------------------------------------------------ */
    var AY_KISA = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    /* d tarihinin dönemi. bit = sonraki dönemin ilk günü (00:00, dahil değil). */
    function donemBul(d) {
        d = (d && !isNaN(d.getTime && d.getTime())) ? d : new Date();
        var y = d.getFullYear(), m = d.getMonth(), yil, no, bas, bit;
        if (m >= 8) { yil = y; no = 1; bas = new Date(y, 8, 1); bit = new Date(y + 1, 1, 1); }
        else if (m === 0) { yil = y - 1; no = 1; bas = new Date(y - 1, 8, 1); bit = new Date(y, 1, 1); }
        else { yil = y - 1; no = 2; bas = new Date(y, 1, 1); bit = new Date(y, 8, 1); }
        return {
            kod: yil + '-' + String(yil + 1).slice(2) + '/' + no, yil: yil, no: no, bas: bas, bit: bit,
            son: new Date(bit.getTime() - GUN / 2),           /* son gün (gösterim için) */
            ad: no + '. dönem', yilAd: yil + '-' + (yil + 1),
            aralik: no === 1 ? 'Eylül–Ocak' : 'Şubat–Ağustos'
        };
    }
    function donemSonraki(dn) { return donemBul(new Date(dn.bit.getTime() + GUN / 2)); }
    function ymd(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
    /* dönem payı = kişi başı aylık × 6 (aylık tutarla tutarlı kalsın diye) */
    function donemPayHesapla(toplam, aktif) { return aylikHesapla(toplam, aktif) * DONEM_AY; }
    /* bu dönemin genel payı: yayındaki dönem kaydı; yönetici henüz yazmadıysa
       (dönem yeni başladı) son aylık tutardan aynı kuralla */
    function donemPayi(oz, kod) {
        if (!oz) return 0;
        if (oz.donem && oz.donem.kod === kod) return oz.donem.pay;
        if (+((oz.donemler || {})[kod]) > 0) return +oz.donemler[kod];
        if (kod === donemBul(new Date()).kod && oz.aylik > 0) return oz.aylik * DONEM_AY;
        return 0;
    }
    function ilkAyBitis(kayit) {
        return (kayit && !isNaN(kayit.getTime())) ? new Date(gunBasi(kayit).getTime() + ILK_AY_GUN * GUN) : null;
    }
    /* Öğretmenin bu dönemki payı: ilk 30 günü ücretsiz; dönemin ortasında
       katıldıysa kalan süreyle orantılı (10 TL'ye yukarı). */
    function kisiPay(dn, pay, kayit) {
        if (!(pay > 0)) return 0;
        var bas = dn.bas.getTime(), bit = dn.bit.getTime();
        var ia = ilkAyBitis(kayit);
        var b = Math.max(bas, ia ? ia.getTime() : 0);
        if (b >= bit) return 0;
        if (b <= bas) return pay;
        return Math.ceil(pay * (bit - b) / (bit - bas) / 10) * 10;
    }
    /* Ödemeleri dönemlere dağıtır. Her ödeme önce YAPILDIĞI dönemin payını
       doldurur; artanı sonraki dönemlere geçer. Geçmiş dönemin eksiği borç
       sayılmaz (ödeme geriye gitmez). Payı henüz belli olmayan gelecek dönem
       artanın tamamını alır.
       odemeler: [{t: ms, tutar}] · kayit: Date|null · oz: ozetDuzen sonucu */
    function dagit(odemeler, kayit, oz, simdi) {
        simdi = simdi || new Date();
        var dn = donemBul(simdi), ileriD = donemSonraki(dn);
        var V = {}, toplam = 0, son = null;
        var L = (odemeler || []).filter(function (x) { return x && +x.tutar > 0 && +x.t > 0; })
            .map(function (x) { return { t: +x.t, tutar: Math.round(+x.tutar) }; })
            .sort(function (a, b) { return a.t - b.t; });
        L.forEach(function (o) {
            toplam += o.tutar;
            if (!son || o.t > son) son = o.t;
            var kalan = o.tutar, d = donemBul(new Date(o.t));
            for (var i = 0; i < 24 && kalan > 0; i++) {
                var gelecek = d.kod > dn.kod;
                var P = gelecek ? Infinity : kisiPay(d, donemPayi(oz, d.kod), kayit);
                var yer = Math.max(0, P - (V[d.kod] || 0));
                var koy = Math.min(kalan, yer);
                if (koy > 0) { V[d.kod] = (V[d.kod] || 0) + koy; kalan -= koy; }
                if (kalan > 0) d = donemSonraki(d);
            }
        });
        var pay = donemPayi(oz, dn.kod);
        var kisi = kisiPay(dn, pay, kayit);
        var verilen = V[dn.kod] || 0;
        var ia = ilkAyBitis(kayit);
        var ilkAy = !!(ia && simdi < ia);
        var durum;
        if (!(pay > 0)) durum = 'hazirlaniyor';
        else if (kisi > 0 && verilen >= kisi) durum = 'tamam';
        else if (ilkAy) durum = 'ilkay';
        else if (!(kisi > 0)) durum = 'disi';
        else if (verilen > 0) durum = 'kismi';
        else durum = 'bos';
        return {
            donem: dn, sonraki: ileriD, pay: pay, kisi: kisi, verilen: verilen,
            eksik: Math.max(0, kisi - verilen), ileri: V[ileriD.kod] || 0,
            toplam: toplam, son: son ? new Date(son) : null, adet: L.length,
            ilkAy: ilkAy, ilkAyBitis: ia, durum: durum,
            oran: kisi > 0 ? Math.min(1, verilen / kisi) : (verilen > 0 ? 1 : 0),
            dagilim: V
        };
    }
    /* Öğretmenin kendi ödeme listesi: yöneticinin yazdığı destek.odemeler;
       yoksa (eski özet) onaylanan bildirimler + toplamın kalanı son ödeme
       tarihinde tek ödeme sayılır. */
    function odemeListesi(belge, bildirimler) {
        var d = (belge && belge.destek) || {};
        if (Array.isArray(d.odemeler)) {
            return d.odemeler.map(function (x) {
                var t = tarihAl(x && x.t);
                return { t: t ? t.getTime() : (+(x && x.t) || 0), tutar: Math.round(+(x && x.tutar) || 0) };
            }).filter(function (x) { return x.t > 0 && x.tutar > 0; });
        }
        var L = [], top = 0;
        (bildirimler || []).forEach(function (b) {
            if (b.durum !== 'onaylandi' || !(b.tutar > 0)) return;
            var t = b.onay || b.tarih;
            if (!t) return;
            L.push({ t: t.getTime(), tutar: b.tutar }); top += b.tutar;
        });
        var fark = Math.round(+d.odenen || 0) - top;
        if (fark > 0) {
            var s = tarihAl(d.sonOdeme) || new Date();
            L.push({ t: s.getTime(), tutar: fark });
        }
        return L;
    }
    function secimYazi(b) {
        var s = b && b.secim;
        if (s === 'donem') return 'bu dönem';
        if (s === 'tamamla') return 'dönemi tamamlama';
        if (s === 'yil') return 'bu yıl (iki dönem)';
        if (s === 'gelecek') return 'gelecek dönem';
        if (b && b.ay) return b.ay + ' ay';
        return 'serbest tutar';
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
            /* destekçiler köşesi (20.10.2026): adı görünsün mü, meslektaşlara cümle */
            koseGoster: v.koseGoster !== false, koseNot: String(v.koseNot || '').trim().slice(0, KOSE_NOT_SINIR),
            /* 22.10.2026: dönem seçimi (donem | tamamla | yil | gelecek | serbest) */
            secim: v.secim || '', donem: v.donem || '',
            tarih: tarihAl(v.createdAt), onay: tarihAl(v.onayTarihi), red: tarihAl(v.redTarihi)
        };
    }
    function kayitDuzen(id, v) {
        return {
            id: id, ogretmenUid: v.ogretmenUid || '', tutar: Math.round(+v.tutar || 0),
            ay: Math.floor(+v.ay || 0), kaynak: v.kaynak || 'elle', siparisId: v.siparisId || '',
            secim: v.secim || '', donem: v.donem || '',
            not: v.not || '', tarih: tarihAl(v.odemeTarihi) || tarihAl(v.tarih)
        };
    }
    function kayitOdeme(k) { return { t: k.tarih ? k.tarih.getTime() : 0, tutar: k.tutar }; }
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
    /* 22.10.2026: bütün defter kayıtları öğretmene göre (dönem dağıtımı ve
       ortak hedef için); tumDefter toplamları bundan çıkarır. */
    function tumKayitlar() {
        return Promise.all([ozetOku(), db().collection('siparisler').where('tur', '==', 'destekKayit').get()]).then(function (r) {
            var oz = r[0], K = {};
            r[1].forEach(function (d) {
                var v = d.data() || {};
                if (!v.ogretmenUid || !yoneticiYazdi(v, oz)) return;
                (K[v.ogretmenUid] = K[v.ogretmenUid] || []).push(kayitDuzen(d.id, v));
            });
            return K;
        });
    }
    function tumDefter() {
        return tumKayitlar().then(function (K) {
            var T = {};
            Object.keys(K).forEach(function (u) {
                T[u] = K[u].reduce(function (a, k) { return a + k.tutar; }, 0);
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
    /* 22.10.2026: dönem hesabı (eskiden gün gün biriken) */
    function benHesap(v) {
        var b = (v && v.belge) || {};
        return dagit(odemeListesi(b, v && v.bildirimler), kayitTarihi(b), v.ozet);
    }

    /* Teşekkür şeridi (20.10.2026): son ödemeden sonra 30 gün boyunca
       kartın "Senin durumun" bölümünün üstünde. × ile kapatılırsa bu
       tarayıcıda o ödeme için bir daha çıkmaz (yeni ödemede yeniden çıkar). */
    var TESEKKUR_GUN = 30;
    function tesekkurAnahtar(v) {
        var d = v && v.belge && v.belge.destek;
        var t = d && tarihAl(d.sonOdeme);
        return t ? String(t.getTime()) : '';
    }
    function tesekkurSeridi(v) {
        var d = v && v.belge && v.belge.destek;
        var t = d && tarihAl(d.sonOdeme);
        var anahtar = tesekkurAnahtar(v);
        if (!t || !anahtar || !(+d.odenen > 0)) return { imza: '', html: '' };
        if (Date.now() - t.getTime() > TESEKKUR_GUN * GUN) return { imza: '', html: '' };
        var kapali = '';
        try { kapali = localStorage.getItem('kidefDestekTesekkur') || ''; } catch (e) { }
        if (kapali === anahtar) return { imza: '', html: '' };
        var tutar = +d.sonTutar > 0 ? d.sonTutar : 0;
        return {
            imza: anahtar,
            html: '<div class="dst-tesekkur" role="status">' + kalpSvg('dst-ikon') +
                '<span><b>Son desteğin için teşekkürler.</b> ' +
                (tutar ? esc(tl(tutar)) + ' · ' : '') + esc(gunYaz(t)) + ' · hesabına işlendi. ' +
                'Katkınla yapay zekâ hizmetleri ve yeni içerikler devam ediyor.</span>' +
                '<button type="button" data-dst-tesekkur-kapat="' + esc(anahtar) + '" title="Kapat" aria-label="Teşekkür notunu kapat">&times;</button>' +
                '</div>'
        };
    }
    document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-dst-tesekkur-kapat]') : null;
        if (!t) return;
        try { localStorage.setItem('kidefDestekTesekkur', t.getAttribute('data-dst-tesekkur-kapat') || ''); } catch (x) { }
        var s = t.closest('.dst-tesekkur');
        if (s) s.remove();
    });

    /* YIL ROZETİ (20.10.2026): o yıl ödemesi olan öğretmenin profilinde
       "2026 destekçisi". Kendi belgesinden (destek.sonOdeme) çıkar; sayı ya
       da tutar içermez. */
    function rozetYili(v) {
        var d = v && v.belge && v.belge.destek;
        var t = d && tarihAl(d.sonOdeme);
        if (!t || !(+d.odenen > 0)) return 0;
        var y = t.getFullYear();
        return y === new Date().getFullYear() ? y : 0;
    }
    function rozetHtml(v) {
        /* 22.10.2026: bu dönemin payı tamamsa «Bu dönemin destekçisi» */
        try {
            if (v && v.ozet && !v.hata && benHesap(v).durum === 'tamam') {
                return '<span class="dst-rozet-yil" title="Bu dönem Kidef\'e destek verdin — teşekkürler">💛 Bu dönemin destekçisi</span>';
            }
        } catch (e) { }
        var y = rozetYili(v);
        return y ? '<span class="dst-rozet-yil" title="Bu yıl Kidef\'e destek verdin — teşekkürler">💛 ' + y + ' destekçisi</span>' : '';
    }
    /* Profildeki «Kişisel Bilgilerim» başlığına rozeti koyar (profil yeniden
       çizilince kaybolur; profilKontrol her çizimde yeniden çağırır). */
    function rozetYerlestir() {
        var oz = document.querySelector('#tpKisisel > summary');
        if (!oz) return;
        var eski = oz.querySelector('.dst-rozet-yil');
        var h = rozetHtml(_ben);
        if (!h) { if (eski) eski.remove(); return; }
        if (eski && eski.outerHTML === h) return;
        if (eski) eski.remove();
        var yer = oz.querySelector('.acc-chevron');
        var k = document.createElement('span');
        k.innerHTML = h;
        var r = k.firstChild;
        if (yer) oz.insertBefore(r, yer); else oz.appendChild(r);
    }

    /* DESTEKÇİLER KÖŞESİ — kartın altı: ay ay kısa adlar, varsa cümle. */
    function destekciKose(oz) {
        var L = (oz && oz.destekciler) || [];
        if (!L.length) return { imza: '0', html: '' };
        var aylar = [], H = {};
        L.forEach(function (x) {
            var a = x.ay || 'diger';
            if (!H[a]) { H[a] = []; aylar.push(a); }
            H[a].push(x);
        });
        var buAy = ayAnahtar(new Date());
        var ilk = aylar.slice(0, 2), kalan = aylar.slice(2);
        function grup(a) {
            return '<div class="dst-dk-ay' + (a === buAy ? ' bu-ay' : '') + '"><span class="dst-dk-et">' + esc(a === 'diger' ? 'Diğer' : ayAdi(a)) + '</span>' +
                '<div class="dst-dk-liste">' + H[a].map(function (x) {
                    return '<span class="dst-dk"><b>' + esc(x.ad) + '</b>' + (x.not ? '<q>' + esc(x.not) + '</q>' : '') + '</span>';
                }).join('') + '</div></div>';
        }
        var html = '<div class="dst-destekciler">' +
            '<div class="dst-dk-bas">' + kalpSvg('dst-ikon') + '<b>Destekçiler</b><span>Kidef\'i birlikte ayakta tutan meslektaşların</span></div>' +
            ilk.map(grup).join('') +
            (kalan.length ? '<details class="dst-dk-eski"><summary>Önceki aylar</summary>' + kalan.map(grup).join('') + '</details>' : '') +
            '</div>';
        return { imza: L.length + ':' + (L[0].t || 0), html: html };
    }

    /* ANA SAYFADAKİ YARI SAYDAM ŞERİT — yalnız öğretmen/yönetici, liste
       doluysa. #home-hub-section'ın en üstünde (başlığın hemen altı), adlar
       yavaşça kayar; sığıyorsa kaymaz; hareket azaltma tercihinde durur. */
    var _seritImza = '';
    function seritCiz() {
        var ev = document.getElementById('home-hub-section');
        if (!ev) return Promise.resolve();
        var r = rol();
        var ogretmen = r === 'teacher' || r === 'admin';
        var eski = document.getElementById('dstSerit');
        if (!ogretmen || !db() || !benUid()) { if (eski) eski.remove(); _seritImza = ''; return Promise.resolve(); }
        return ozetOku().then(function (oz) {
            var L = oz.destekciler, buAy = ayAnahtar(new Date());
            var bu = L.filter(function (x) { return x.ay === buAy; });
            var etiket = 'Bu ay Kidef\'e destek verenler';
            if (!bu.length) { bu = L.slice(0, 12); etiket = 'Kidef\'e destek verenler'; }
            if (!bu.length) { if (eski) eski.remove(); _seritImza = ''; return; }
            var imza = etiket + '|' + bu.map(function (x) { return x.ad + '|' + x.t + '|' + x.not; }).join(';');
            if (eski && _seritImza === imza) return;
            _seritImza = imza;
            stilKur();
            var ic = bu.map(function (x) {
                return '<span class="dst-serit-ad">' + esc(x.ad) + (x.not ? '<q>' + esc(x.not) + '</q>' : '') + '</span>';
            }).join('<span class="dst-serit-nok" aria-hidden="true">·</span>');
            var el = eski || document.createElement('div');
            el.id = 'dstSerit';
            el.className = 'dst-serit';
            el.setAttribute('role', 'region');
            el.setAttribute('aria-label', 'Destekçiler');
            el.innerHTML = '<div class="dst-serit-ic">' +
                '<span class="dst-serit-et">' + kalpSvg('dst-ikon') + '<span>' + esc(etiket) + '</span></span>' +
                '<div class="dst-serit-ray"><div class="dst-serit-akis"><span class="dst-serit-tur">' + ic + '</span></div></div>' +
                '<button type="button" class="dst-serit-katil" data-dst-serit="katil" title="Destek kartını aç">Sen de katıl</button>' +
                '</div>';
            if (!eski) ev.insertBefore(el, ev.firstChild);
            seritOlc(el);
        }).catch(function () { });
    }
    function seritOlc(el) {
        var ray = el.querySelector('.dst-serit-ray'), akis = el.querySelector('.dst-serit-akis'), tur = el.querySelector('.dst-serit-tur');
        if (!ray || !akis || !tur) return;
        akis.classList.remove('kayar'); ray.classList.remove('kayar');
        var fazla = akis.querySelector('.dst-serit-tur + .dst-serit-tur');
        if (fazla) fazla.remove();
        var genis = tur.scrollWidth, yer = ray.clientWidth;
        if (genis <= yer || azHareket) return;
        var kopya = tur.cloneNode(true);
        kopya.setAttribute('aria-hidden', 'true');
        akis.appendChild(kopya);
        akis.style.setProperty('--dst-sure', Math.max(18, Math.round(genis / 28)) + 's');
        akis.classList.add('kayar'); ray.classList.add('kayar');
    }
    window.addEventListener('resize', function () { var el = document.getElementById('dstSerit'); if (el) seritOlc(el); });
    document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-dst-serit="katil"]') : null;
        if (!t) return;
        try { if (typeof window.toggleStudentProfile === 'function') window.toggleStudentProfile(); } catch (x) { }
        setTimeout(function () {
            var k = document.getElementById('tpDestek');
            if (k && k.scrollIntoView) k.scrollIntoView({ behavior: azHareket ? 'auto' : 'smooth', block: 'start' });
        }, 400);
    });
    /* rol giriş sonrasında belirir: 2 sn'de bir bakılır (ucuz: bir değişken) */
    var _seritSayac = 0;
    setInterval(function () {
        if (document.visibilityState === 'hidden') return;
        _seritSayac++;
        var var_ = !!document.getElementById('dstSerit');
        var r = rol(), ogretmen = r === 'teacher' || r === 'admin';
        if (ogretmen && !var_) seritCiz();
        else if (!ogretmen && var_) seritCiz();
        else if (var_ && _seritSayac % 450 === 0) { _ozet = null; seritCiz(); }   /* 15 dk'da bir tazele */
    }, 2000);

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
            '.dst-cubuk{transform-box:fill-box; transform-origin:bottom; animation:dstBuyu .5s cubic-bezier(.3,1.3,.5,1) both;}',
            '@keyframes dstBuyu{from{transform:scaleY(0)}to{transform:scaleY(1)}}',
            '.dst-artti{animation:dstArtti 2.6s ease-in-out infinite;}',
            '@keyframes dstArtti{0%{opacity:0; transform:translateY(6px)}20%{opacity:1; transform:translateY(0)}75%{opacity:1}100%{opacity:0; transform:translateY(-8px)}}',
            '#tpDestek .dst-vurgu{display:flex; gap:9px; align-items:flex-start; margin-top:2px; font-size:.86rem; color:#6B5B45; line-height:1.5;}',
            '#tpDestek .dst-vurgu svg{flex:none; width:22px; height:22px; margin-top:1px;}',
            '#tpDestek .dst-ok{animation:dstOk 1.6s ease-in-out infinite;}',
            '@keyframes dstOk{0%,100%{transform:translateY(-2px)}50%{transform:translateY(3px)}}',
            '#tpDestek .dst-grafik{background:#fff; border:1px solid #EEE3CF; border-radius:16px; padding:8px 8px 4px; min-width:0;}',
            '#tpDestek .dst-grafik-svg{width:100%; min-height:150px;}',
            '#tpDestek .dst-grafik svg{display:block; overflow:visible; max-width:100%;}',
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
            /* teşekkür şeridi (20.10.2026): son ödemeden sonra 30 gün görünür */
            '#tpDestek .dst-tesekkur{display:flex; align-items:center; gap:10px; margin:0 0 12px; padding:10px 12px 10px 14px;',
            '  border-radius:12px; background:linear-gradient(90deg,#FFF3D6,#FFF9EC); border:1px solid #F3DDAF; color:#6B4E12;',
            '  font-size:.9rem; line-height:1.45;}',
            '#tpDestek .dst-tesekkur .dst-ikon{width:22px; height:22px; flex:none;}',
            '#tpDestek .dst-tesekkur b{color:#9A6512;}',
            '#tpDestek .dst-tesekkur span{flex:1 1 auto;}',
            '#tpDestek .dst-tesekkur button{flex:none; border:0; background:transparent; color:#B59A6A; font-size:1.2rem;',
            '  line-height:1; cursor:pointer; padding:2px 6px; font-family:inherit;}',
            '#tpDestek .dst-tesekkur button:hover{color:#6B4E12;}',
            /* yıl rozeti (20.10.2026) */
            '.dst-rozet-yil{display:inline-flex; align-items:center; gap:4px; font-size:.74rem; font-weight:800; color:#9A6512;',
            '  background:#FFF1D6; border:1px solid #F3DDAF; border-radius:999px; padding:3px 10px; white-space:nowrap; vertical-align:middle;}',
            '#tpDestek .dst-baslik .dst-rozet-yil{margin-inline-start:10px;}',
            '#tpKisisel > summary .dst-rozet-yil{margin-inline-start:4px;}',
            /* destekçiler köşesi (kart altı) */
            '#tpDestek .dst-destekciler{margin-top:16px; padding-top:14px; border-top:1px dashed #EADFCB;}',
            '#tpDestek .dst-dk-bas{display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap;}',
            '#tpDestek .dst-dk-bas .dst-ikon{width:26px; height:26px;}',
            '#tpDestek .dst-dk-bas b{color:#9A6512; font-size:.98rem;}',
            '#tpDestek .dst-dk-bas span{color:#8A94A3; font-size:.84rem;}',
            '#tpDestek .dst-dk-ay{margin-top:8px;}',
            '#tpDestek .dst-dk-et{display:block; font-size:.74rem; font-weight:900; letter-spacing:.4px; text-transform:uppercase; color:#A0927E; margin-bottom:6px;}',
            '#tpDestek .dst-dk-ay.bu-ay .dst-dk-et{color:#9A6512;}',
            '#tpDestek .dst-dk-liste{display:flex; flex-wrap:wrap; gap:7px;}',
            '#tpDestek .dst-dk{display:inline-flex; flex-direction:column; gap:2px; background:#FFFBF3; border:1px solid #F3DDAF;',
            '  border-radius:12px; padding:6px 12px; font-size:.86rem; max-width:100%;}',
            '#tpDestek .dst-dk b{color:#5B4A2A; font-weight:800;}',
            '#tpDestek .dst-dk q{color:#6B5A3E; font-style:italic; font-size:.8rem; quotes:"«" "»";}',
            '#tpDestek .dst-dk-eski{margin-top:10px;}',
            '#tpDestek .dst-dk-eski summary{cursor:pointer; font-size:.82rem; font-weight:800; color:#8A94A3;}',
            /* ana sayfa şeridi */
            '.dst-serit{position:relative; z-index:5; background:rgba(255,246,228,.72); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);',
            '  border-bottom:1px solid rgba(227,160,42,.35); color:#5B4A2A; font-size:.9rem;}',
            '.dst-serit-ic{display:flex; align-items:center; gap:12px; max-width:1400px; margin:0 auto; padding:7px clamp(12px,2vw,24px); min-height:40px;}',
            '.dst-serit-et{display:inline-flex; align-items:center; gap:7px; font-weight:800; color:#9A6512; white-space:nowrap; flex:none;}',
            '.dst-serit-et .dst-ikon{width:22px; height:22px;}',
            '.dst-serit-ray{flex:1 1 auto; min-width:0; overflow:hidden; position:relative;}',
            '.dst-serit-ray.kayar{-webkit-mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent);',
            '  mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent);}',
            '.dst-serit-akis{display:inline-flex; white-space:nowrap; will-change:transform;}',
            '.dst-serit-akis.kayar{animation:dstKay var(--dst-sure,30s) linear infinite;}',
            '.dst-serit:hover .dst-serit-akis.kayar{animation-play-state:paused;}',
            '.dst-serit-tur{display:inline-flex; align-items:center; padding-inline-end:48px;}',
            '.dst-serit-ray.kayar .dst-serit-tur{padding-inline-start:28px;}',
            '.dst-serit-ad{display:inline-flex; align-items:baseline; gap:6px; font-weight:700;}',
            '.dst-serit-ad q{font-weight:500; font-style:italic; color:#7A6E5E; quotes:"«" "»";}',
            '.dst-serit-nok{margin:0 12px; color:#D9B979;}',
            '.dst-serit-katil{flex:none; border:1px solid #E3A02A; background:#fff; color:#9A6512; font-weight:800; font-size:.8rem;',
            '  border-radius:999px; padding:5px 12px; cursor:pointer; font-family:inherit; white-space:nowrap;}',
            '.dst-serit-katil:hover{background:#FFF1D6;}',
            '@keyframes dstKay{from{transform:translateX(0)} to{transform:translateX(-50%)}}',
            '@media (max-width:640px){ .dst-serit-et span{display:none;} .dst-serit-katil{display:none;} }',
            '@media (prefers-reduced-motion:reduce){ .dst-serit-akis.kayar{animation:none;} }',
            '#tpDestek .dst-ben-bas{display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:11px;}',
            '#tpDestek .dst-ben-bas b{color:#9A6512; font-size:.98rem;}',
            '#tpDestek .dst-ben-bas span{color:#8A94A3; font-size:.84rem;}',
            '#tpDestek .dst-ben-bas .dst-gunluk{display:inline-flex; align-items:center; gap:4px; color:#C0571B; background:#FFF1E6;',
            '  padding:3px 10px; border-radius:999px; font-weight:800; font-size:.78rem; animation:dstGunluk 2.4s ease-in-out infinite;}',
            '@keyframes dstGunluk{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}',
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
            '#tpDestek .dst-yok{color:#8A94A3; font-size:.9rem; margin:4px 0 0;}',
            '.dst-durgun .dst-cizgi{animation:none; stroke-dashoffset:0;}',
            '.dst-durgun .dst-alan, .dst-durgun .dst-isaret{animation:none; opacity:1;}',
            '.dst-durgun .dst-cubuk{animation:none;}',
            '.dst-durgun .dst-halka{animation:none; stroke-dashoffset:var(--hedef);}',
            '@media (prefers-reduced-motion: reduce){',
            '  .dst-cizgi{animation:none; stroke-dashoffset:0;} .dst-alan,.dst-isaret{animation:none; opacity:1;}',
            '  .dst-halka{animation:none; stroke-dashoffset:var(--hedef);} .dst-nabiz,.dst-kalp,.dst-para,.dst-ok,',
            '  .dst-cubuk,.dst-artti,#tpDestek .dst-canli i,#tpDestek .dst-gunluk{animation:none;}}',
            /* 22.10.2026: dönemlik sabit pay — dönem çipi, ortak hedef, durum, seçenek kartları */
            '#tpDestek .dst-donem-cip{color:#9A6512; background:#FFF4DE;}',
            '#tpDestek .dst-donem-cip svg{flex:none;}',
            '.dst-takvim-tik{stroke-dasharray:10; stroke-dashoffset:10; animation:dstTakvimTik 3s ease-in-out infinite;}',
            '@keyframes dstTakvimTik{0%,15%{stroke-dashoffset:10}40%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:10}}',
            '#tpDestek .dst-buyuk.dst-hediye{font-size:1.75rem; color:#1E8449;}',
            '#tpDestek .dst-sayi b{font-size:inherit; color:#1E8449;}',
            '.dst-dolum{transform-box:fill-box; transform-origin:left center; animation:dstDolum 1.4s cubic-bezier(.25,.8,.25,1) .2s both;}',
            '@keyframes dstDolum{from{transform:scaleX(0)}to{transform:scaleX(1)}}',
            '.dst-parilti{animation:dstParilti 3.4s ease-in-out 1.7s infinite;}',
            '@keyframes dstParilti{0%{transform:translateX(0) skewX(-18deg)}55%,100%{transform:translateX(var(--dst-gen,300px)) skewX(-18deg)}}',
            '.dst-durgun .dst-dolum, .dst-durgun .dst-parilti{animation:none;}',
            '.dst-yuksel{opacity:0; transform-box:fill-box; animation:dstYuksel 3.2s ease-in 2s infinite;}',
            '.dst-yuksel.y2{animation-delay:3.6s;}',
            '@keyframes dstYuksel{0%{transform:translateY(4px); opacity:0}20%{opacity:1}100%{transform:translateY(-16px); opacity:0}}',
            '#tpDestek .dst-ben-sag{flex:1 1 300px; min-width:0; display:flex; flex-direction:column; gap:10px;}',
            '#tpDestek .dst-ben-sag .dst-kutular{flex:0 0 auto;}',
            '#tpDestek .dst-durum{margin:0; font-size:.95rem; color:#4A4336; line-height:1.55;}',
            '#tpDestek .dst-durum b{color:#9A6512;}',
            '#tpDestek .dst-durum.tamam b{color:#1E8449;}',
            '#tpDestek .dst-durum.ilkay b{color:#1B4F9C;}',
            '#tpDestek .dst-durum .dst-bek{display:block; margin-top:4px; font-size:.84rem; color:#B5670A;}',
            '#dstKutu .dst-secenekler{display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:9px;}',
            '#dstKutu .dst-sec{display:flex; flex-direction:column; align-items:flex-start; gap:3px; text-align:start; border:1.5px solid #EEDFC2;',
            '  background:#FFFBF3; color:#6B5B45; border-radius:14px; padding:11px 13px; cursor:pointer; font-family:inherit; transition:transform .12s;}',
            '#dstKutu .dst-sec:hover{transform:translateY(-1px);}',
            '#dstKutu .dst-sec-ad{font-size:.76rem; font-weight:900; letter-spacing:.3px; color:#B7791F; text-transform:uppercase;}',
            '#dstKutu .dst-sec b{font-size:1.35rem; color:#1F2430; font-variant-numeric:tabular-nums; line-height:1.2;}',
            '#dstKutu .dst-sec small{font-size:.76rem; color:#8A7A66;}',
            '#dstKutu .dst-sec.sec{background:#E9A23B; border-color:#E9A23B;}',
            '#dstKutu .dst-sec.sec .dst-sec-ad, #dstKutu .dst-sec.sec b, #dstKutu .dst-sec.sec small{color:#fff;}',
            '#admin-destek-ayar .dst-a-sabit{font-style:normal; color:#A0927E; font-size:.8rem;}',
            '@media (prefers-reduced-motion: reduce){ .dst-dolum,.dst-parilti,.dst-takvim-tik,.dst-yuksel{animation:none;} .dst-takvim-tik{stroke-dashoffset:0;} }',
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
            '#dstKutu .dst-onay{display:flex; align-items:flex-start; gap:9px; font-size:.9rem; font-weight:600; color:#4A4336;',
            '  letter-spacing:0; margin:0 0 12px; cursor:pointer; line-height:1.4;}',
            '#dstKutu .dst-onay input{width:18px; height:18px; margin:1px 0 0; flex:none; accent-color:#E3A02A;}',
            '#dstKutu .dst-onay b{color:#9A6512; font-weight:800;}',
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
            '#admin-destek-ayar .dst-yb.art{background:#fff; color:#9A6512; border:1.5px solid #EADBC0; padding:7px 11px;}',
            '#admin-destek-ayar .dst-yb.art:hover{background:#FFF1D6;}',
            '#admin-destek-ayar .dst-a-on{color:#6B5A3E;}',
            '#admin-destek-ayar .dst-a-on b{color:#9A6512;}',
            '#admin-destek-ayar .dst-a-kose{margin-top:10px; border-top:1px dashed #EADBC0; padding-top:8px;}',
            '#admin-destek-ayar .dst-a-kose summary{cursor:pointer; font-weight:800; color:#9A6512;}',
            '#admin-destek-ayar .dst-a-kose summary small{display:block; font-weight:600; color:#A0927E; font-size:.78rem;}',
            '#admin-destek-ayar .dst-a-kose-liste{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;}',
            '#admin-destek-ayar .dst-a-dk{display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid #EADBC0;',
            '  border-radius:999px; padding:4px 6px 4px 12px; font-size:.84rem; max-width:100%;}',
            '#admin-destek-ayar .dst-a-dk b{color:#5B4A2A;}',
            '#admin-destek-ayar .dst-a-dk i{color:#A0927E; font-style:normal; font-size:.76rem;}',
            '#admin-destek-ayar .dst-a-dk q{color:#6B5A3E; font-style:italic; font-size:.8rem; quotes:"«" "»";}',
            '#admin-destek-ayar .dst-a-dk button{border:0; background:#FFF1D6; color:#9A6512; width:22px; height:22px; border-radius:50%;',
            '  cursor:pointer; font-size:1rem; line-height:1; padding:0; font-family:inherit;}',
            '#admin-destek-ayar .dst-a-dk button:hover{background:#F3C7C1; color:#B03A2E;}',
            '.dst-y .dst-kose-on b{color:#9A6512;}',
            '.dst-y .dst-f-kose{flex-direction:row !important; align-items:center !important; gap:6px !important; font-size:.8rem !important;',
            '  color:#5B4A2A !important; padding-bottom:9px;}',
            '.dst-y .dst-f-kose input{width:16px; height:16px; accent-color:#E3A02A; margin:0;}',
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

    /* ORTAK HEDEF (22.10.2026; eski "bu ay biriken" gün grafiğinin yerine):
       bu döneme düşen bütün desteklerin dönemin giderine oranı — yalnız
       YÜZDE (tutar ve öğretmen sayısı yok). Altında dönemin zaman çizgisi
       (Eylül → Ocak ya da Şubat → Ağustos) ve "bugün". W: kutunun gerçek
       genişliği — yazılar her ekranda aynı boyda kalsın diye SVG ölçeklenmez. */
    function hedefSvg(oz, dn, W) {
        W = Math.max(260, Math.min(760, Math.round(W || 340)));
        var H = 186, x0 = 14, x1 = W - 14, gen = x1 - x0;
        var yuz = (oz && oz.donem && oz.donem.kod === dn.kod && oz.donem.yuzde !== null) ? oz.donem.yuzde : null;
        var oran = yuz === null ? 0 : Math.min(1, yuz / 100);
        var simdi = new Date();
        var gecen = Math.min(1, Math.max(0, (simdi - dn.bas) / (dn.bit - dn.bas)));
        var by = 70, bh = 24;
        var dolu = oran > 0 ? Math.max(bh, gen * oran) : 0;
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img"' +
            ' aria-label="' + esc(yuz === null ? 'Ortak hedef hesaplanıyor' : 'Ortak hedef: bu dönemin giderinin yüzde ' + yuz + ' kadarı karşılandı') + '">' +
            '<defs><linearGradient id="dstHedefG" x1="0" y1="0" x2="1" y2="0">' +
              '<stop offset="0" stop-color="#F6C25B"/><stop offset="1" stop-color="#E08E1B"/></linearGradient>' +
              '<clipPath id="dstHedefK"><rect x="' + x0 + '" y="' + by + '" width="' + dolu.toFixed(1) + '" height="' + bh + '" rx="' + (bh / 2) + '"/></clipPath></defs>' +
            '<text x="' + x0 + '" y="20" font-size="11.5" font-weight="900" letter-spacing=".6" fill="#B7791F">ORTAK HEDEF</text>' +
            '<text x="' + x0 + '" y="41" font-size="12.5" fill="#6B5B45">Bu dönemin gideri</text>' +
            '<text x="' + x1 + '" y="44" text-anchor="end" font-size="31" font-weight="900" fill="#1F2430">' + (yuz === null ? '—' : '%' + yuz) + '</text>' +
            '<text x="' + x1 + '" y="62" text-anchor="end" font-size="11.5" font-weight="800" fill="#8A7A66">' + (yuz === null ? 'hesaplanıyor' : 'karşılandı') + '</text>' +
            '<rect x="' + x0 + '" y="' + by + '" width="' + gen + '" height="' + bh + '" rx="' + (bh / 2) + '" fill="#F6EBD6"/>';
        [0.25, 0.5, 0.75].forEach(function (k) {
            var x = (x0 + gen * k).toFixed(1);
            s += '<line x1="' + x + '" x2="' + x + '" y1="' + (by + 5) + '" y2="' + (by + bh - 5) + '" stroke="#EAD9B6" stroke-width="1.5" stroke-linecap="round"/>';
        });
        if (dolu > 0) {
            var xs = x0 + dolu;
            s += '<rect class="dst-dolum" x="' + x0 + '" y="' + by + '" width="' + dolu.toFixed(1) + '" height="' + bh + '" rx="' + (bh / 2) + '" fill="url(#dstHedefG)"/>' +
                 '<g clip-path="url(#dstHedefK)"><rect class="dst-parilti" style="--dst-gen:' + Math.round(dolu + 60) + 'px" x="' + (x0 - 50) + '" y="' + by + '" width="38" height="' + bh + '" fill="rgba(255,255,255,.38)" transform="skewX(-18)"/></g>' +
                 '<g class="dst-isaret">' +
                   '<path class="dst-yuksel" d="M' + (xs - 9).toFixed(1) + ' ' + (by + 15) + 'c-3.6-2.4-4.8-4.6-3.6-6.2 1-1.4 2.9-1.2 3.6.3.8-1.5 2.7-1.7 3.6-.3 1.2 1.6 0 3.8-3.6 6.2z" fill="#fff"/>' +
                   '<path class="dst-yuksel y2" d="M' + (xs + 3).toFixed(1) + ' ' + (by + 9) + 'c-2.7-1.8-3.6-3.4-2.7-4.6.8-1 2.2-.9 2.7.2.6-1.1 2-1.2 2.7-.2.9 1.2 0 2.8-2.7 4.6z" fill="#E08E1B"/>' +
                 '</g>';
        } else if (yuz === null) {
            s += '<text x="' + (x0 + gen / 2).toFixed(1) + '" y="' + (by + 16) + '" text-anchor="middle" font-size="11" fill="#A0927E">yönetici sayımından sonra görünür</text>';
        }
        /* dönemin zaman çizgisi */
        var ty = 136, xb = x0 + gen * gecen;
        s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + ty + '" y2="' + ty + '" stroke="#EFE4D0" stroke-width="4" stroke-linecap="round"/>' +
             '<line x1="' + x0 + '" x2="' + xb.toFixed(1) + '" y1="' + ty + '" y2="' + ty + '" stroke="#D9B26A" stroke-width="4" stroke-linecap="round"/>';
        var t0 = dn.bas.getTime(), t1 = dn.bit.getTime();
        for (var i = 0; i < 12; i++) {
            var a = new Date(dn.bas.getFullYear(), dn.bas.getMonth() + i, 1);
            if (a.getTime() >= t1) break;
            var b = new Date(a.getFullYear(), a.getMonth() + 1, 1);
            var xa = x0 + gen * (a.getTime() - t0) / (t1 - t0), xm = x0 + gen * ((a.getTime() + b.getTime()) / 2 - t0) / (t1 - t0);
            if (i > 0) s += '<line x1="' + xa.toFixed(1) + '" x2="' + xa.toFixed(1) + '" y1="' + (ty - 4) + '" y2="' + (ty + 4) + '" stroke="#E5D3B0" stroke-width="1.2"/>';
            var buAy = simdi.getFullYear() === a.getFullYear() && simdi.getMonth() === a.getMonth();
            s += '<text x="' + xm.toFixed(1) + '" y="' + (ty + 19) + '" text-anchor="middle" font-size="10.5"' +
                 (buAy ? ' font-weight="800" fill="#C0571B"' : ' fill="#A0927E"') + '>' + AY_KISA[a.getMonth()] + '</text>';
        }
        var xe = Math.min(Math.max(xb, x0 + 16), x1 - 16);
        s += '<g class="dst-isaret"><circle class="dst-nabiz" cx="' + xb.toFixed(1) + '" cy="' + ty + '" r="4.5" fill="#C0571B"/>' +
             '<circle cx="' + xb.toFixed(1) + '" cy="' + ty + '" r="4.5" fill="#C0571B" stroke="#fff" stroke-width="1.5"/>' +
             '<text x="' + xe.toFixed(1) + '" y="' + (ty - 10) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="#C0571B">bugün</text></g>' +
             '<text x="' + x0 + '" y="' + (H - 4) + '" font-size="11" fill="#8A7A66">' + esc(W < 440 ? dn.aralik : dn.yilAd + ' · ' + dn.ad + ' · ' + dn.aralik) + '</text>' +
             '<text x="' + x1 + '" y="' + (H - 4) + '" text-anchor="end" font-size="11" fill="#8A7A66">' +
               esc('yeni dönem ' + dn.bit.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })) + '</text>';
        return s + '</svg>';
    }

    function grafikCiz(kok, durgun) {
        var yer = kok && kok.querySelector('[data-dst-grafik]');
        var v = _ben;
        if (!yer || !v || !v.ozet || !v.ozet.hazir) return;
        var W = yer.clientWidth || 340;
        if (durgun) yer.classList.add('dst-durgun');
        yer.innerHTML = hedefSvg(v.ozet, donemBul(new Date()), W);
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

    function halkaSvg(oran, etiket) {
        var yuzde = Math.round(oran * 100);
        var hedef = (100 - yuzde).toFixed(1);
        return '<svg viewBox="0 0 44 44" aria-hidden="true">' +
            '<circle cx="22" cy="22" r="18" fill="none" stroke="#EEF2F7" stroke-width="5"/>' +
            (yuzde > 0 ? '<circle class="dst-halka" cx="22" cy="22" r="18" fill="none" stroke="#27AE60" stroke-width="5" stroke-linecap="round"' +
            ' pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="--hedef:' + hedef + '" transform="rotate(-90 22 22)"/>' : '') +
            '<text x="22" y="21" text-anchor="middle" font-size="9" font-weight="900" fill="#1F2430">%' + yuzde + '</text>' +
            '<text x="22" y="30" text-anchor="middle" font-size="5" font-weight="800" fill="#8A94A3">' + esc(etiket || 'BU DÖNEM') + '</text>' +
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

    function takvimSvg() {
        return '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path class="dst-takvim-tik" d="M9 15l2 2 4-4"/></svg>';
    }
    function uzunTarih(d) { return d ? d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''; }

    /* 22.10.2026: DÖNEMLİK SABİT PAY — «günlük tutar / biriken / kalan» yok.
       Kartta: bu dönemin desteği (sabit), ortak hedef çubuğu (yalnız yüzde),
       öğretmenin bu dönemki durumu (destekçi / kısmi / ilk ay), verdikleri. */
    function kartIcerik() {
        var v = _ben;
        var bas = '<div class="dst-bas">' + kalpSvg('dst-ikon') +
            '<div class="dst-baslik"><b>Beklenen Destek</b>' + rozetHtml(v) + '</div>';
        if (!v) {
            return { imza: 'yukleniyor', html: bas + '</div><p class="dst-yok">Yükleniyor…</p>' };
        }
        if (v.hata || !v.ozet) {
            return { imza: 'hata', html: bas + '</div><p class="dst-yok">Destek bilgisi şu an alınamadı; biraz sonra yeniden denenecek.</p>' };
        }
        var oz = v.ozet;
        if (!oz.hazir) {
            return { imza: 'hazirdegil', html: bas + '</div><p class="dst-yok">Bu dönemin payı belirleniyor; kısa süre içinde burada görünecek.</p>' };
        }
        /* Öğretmen sayısı ve aylık gider kartta HİÇ yazmaz (19.10.2026: "kaç
           öğretmen olduğu görülmesin ... sayı belli olmasın"). */
        var h = benHesap(v), dn = h.donem;
        bas += '<span class="dst-canli dst-donem-cip" title="Tutar dönem başında belirlenir, dönem boyunca değişmez">' +
            takvimSvg() + esc(dn.yilAd + ' · ' + dn.ad) + '</span></div>';
        var bekleyen = (v.bildirimler || []).filter(function (x) { return x.durum === 'bekliyor'; });
        var imza = [h.kisi, h.pay, h.verilen, h.ileri, h.toplam, h.durum, dn.kod,
                    (oz.donem && oz.donem.yuzde), bekleyen.length, (v.bildirimler || []).length].join('|');
        var tsk = tesekkurSeridi(v);
        var kose = destekciKose(oz);
        imza += '|' + tsk.imza + '|' + kose.imza + '|' + rozetYili(v);

        var ayda = h.pay > 0 ? Math.round(h.pay / DONEM_AY) : 0;
        var tutar = '<div class="dst-tutar">' +
            '<span class="dst-et">Bu dönemin desteği</span>' +
            (h.kisi > 0
                ? '<span class="dst-buyuk"><span data-dst-say="' + h.kisi + '">' + sayi(h.kisi) + '</span><small>TL</small></span>'
                : '<span class="dst-buyuk dst-hediye">İlk ayın bizden</span>') +
            '<span class="dst-sayi">' + esc(dn.aralik) + ' · ' +
              (h.kisi > 0 && h.kisi < h.pay ? 'dönemin ortasında katıldığın için kalan süreye göre'
                                             : (h.kisi > 0 ? '<b>dönem boyunca değişmez</b>' : 'desteğin gelecek dönemden başlar')) +
              (ayda && h.kisi > 0 ? ' · ayda yaklaşık ' + esc(tl(ayda)) : '') + '</span>' +
            '<span class="dst-vurgu">' + okSvg() + '<span><b>Siteye katılan öğretmen arttıkça gelecek dönemin payı azalır.</b> ' +
              'Meslektaşlarını davet ettikçe herkesin payı küçülür.</span></span>' +
            '</div>';
        var grafik = '<div class="dst-grafik"><div class="dst-grafik-svg" data-dst-grafik></div>' +
            '<p>Her destek çubuğu biraz daha doldurur; tutarlar ve kimin ne verdiği görünmez.</p></div>';

        var aciklama = '<p class="dst-aciklama">Sitedeki <b>yapay zekâ hizmetlerinin giderleri</b> ve materyallerin, ' +
            'oyunların, sınavların arkasındaki <b>yoğun öğretmen emeği</b>, siteyi kullanan öğretmenler arasında paylaşılır. ' +
            'Katkın Kidef\'in büyümesini ve yeni içeriklerin hazırlanmasını sağlar.</p>';

        /* kişisel durum — «borç / kalan» kelimesi yok */
        var dy;
        if (h.durum === 'tamam') {
            dy = '<b>Bu dönemin destekçisisin, teşekkürler!</b> Desteğin ' + esc(uzunTarih(dn.son)) + ' tarihine kadar geçerli.' +
                 (h.ileri > 0 ? ' Fazlası (' + esc(tl(h.ileri)) + ') gelecek döneme sayılacak.' : '');
        } else if (h.durum === 'kismi') {
            dy = '<b>Bu dönem ' + esc(tl(h.verilen)) + ' destek verdin, teşekkürler.</b> Dönemi tamamlamak istersen ' +
                 esc(tl(h.eksik)) + ' yeterli.';
        } else if (h.durum === 'ilkay') {
            dy = '<b>İlk ayın bizden.</b> ' + esc(uzunTarih(h.ilkAyBitis)) + ' tarihine kadar destek beklenmiyor; siteyi rahatça tanı.' +
                 (h.kisi > 0 ? ' Bu dönem için payın ' + esc(tl(h.kisi)) + '.' : ' Desteğin gelecek dönemden başlar.');
        } else if (h.durum === 'disi') {
            dy = 'Desteğin gelecek dönemden başlar.';
        } else {
            dy = 'Bu dönem için desteğini bekliyoruz. Dilediğin zaman bir kerede ya da parça parça gönderebilirsin.';
        }
        if (bekleyen.length) dy += ' <span class="dst-bek">Onay bekleyen bildirimin var; onaylanınca buraya işlenir.</span>';
        var kutular = h.toplam > 0
            ? '<div class="dst-kutular">' +
                '<div class="dst-k odenen"><b data-dst-say="' + h.verilen + '" data-dst-tl="1">' + esc(tl(h.verilen)) + '</b><span>Bu dönem verdiğin</span></div>' +
                (h.ileri > 0 ? '<div class="dst-k"><b data-dst-say="' + h.ileri + '" data-dst-tl="1">' + esc(tl(h.ileri)) + '</b><span>Gelecek döneme</span></div>' : '') +
                '<div class="dst-k"><b data-dst-say="' + h.toplam + '" data-dst-tl="1">' + esc(tl(h.toplam)) + '</b><span>Toplam desteğin</span></div>' +
              '</div>'
            : '';
        var ben = '<div class="dst-ben">' + tsk.html +
            '<div class="dst-ben-bas"><b>Senin durumun</b><span>' + esc(dn.yilAd + ' · ' + dn.ad + ' (' + dn.aralik + ')') + '</span></div>' +
            '<div class="dst-ben-ic">' +
              (h.kisi > 0 ? '<div class="dst-halka-k">' + halkaSvg(h.oran, 'BU DÖNEM') + '</div>' : '') +
              '<div class="dst-ben-sag"><p class="dst-durum ' + h.durum + '">' + dy + '</p>' + kutular + '</div>' +
            '</div>' +
            '<p class="dst-ipucu">Tutar her dönemin başında (1 Eylül ve 1 Şubat) bir kez belirlenir, dönem boyunca değişmez. ' +
              'Bir kerede ya da parça parça gönderebilirsin; fazlası gelecek döneme sayılır.</p>' +
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
                    '<b>' + esc(tl(b.tutar)) + '</b><span>' + esc(secimYazi(b)) + '</span>' +
                    '<span style="margin-inline-start:auto; color:#A0927E;">' + esc(saatliYaz(b.tarih)) + '</span></div>';
            }).join('') + '</div>';
        }
        ben += '</div>';
        return { imza: imza, html: bas + '<div class="dst-ust">' + tutar + grafik + '</div>' + aciklama + ben + kose.html };
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
        rozetYerlestir();
        var uid = benUid();
        var taze = _ben && _ben.uid === uid && (Date.now() - _ben.zaman < 60000);
        if (taze || _benYukleniyor || !uid) return;
        _benYukleniyor = true;
        benimVerim(true).then(function () {
            _benYukleniyor = false;
            var k = document.getElementById('tpDestek');
            if (k) kartCiz(k);
            rozetYerlestir();
            seritCiz();
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
    /* 22.10.2026: ay seçimi yerine DÖNEM seçimi — bu dönem / dönemi
       tamamla / bu yıl (iki dönem) / gelecek dönem / başka tutar */
    var _secim = { tip: 'donem' };

    function odemeKapat() {
        var o = document.getElementById('dstOrt');
        if (o) o.remove();
        document.removeEventListener('keydown', escKapat, true);
    }
    function escKapat(e) { if (e.key === 'Escape') odemeKapat(); }

    /* gelecek dönemin tahmini: bugünkü genel pay (o dönemin başında yeniden belirlenir) */
    function secenekler(h) {
        var L = [], gelecek = Math.max(0, h.pay - h.ileri), sn = h.sonraki;
        if (h.durum === 'tamam' || !(h.kisi > 0)) {
            if (gelecek > 0) L.push({ tip: 'gelecek', ad: 'Gelecek dönem', tutar: gelecek,
                                      alt: sn.aralik + ' · bugünkü payla' });
        } else {
            if (h.verilen > 0) L.push({ tip: 'tamamla', ad: 'Dönemi tamamla', tutar: h.eksik,
                                        alt: 'bu dönem verdiğin ' + tl(h.verilen) });
            else L.push({ tip: 'donem', ad: 'Bu dönem', tutar: h.kisi, alt: h.donem.aralik });
            if (gelecek > 0) L.push({ tip: 'yil', ad: 'Bu yıl · iki dönem', tutar: h.eksik + gelecek,
                                      alt: 'gelecek dönem bugünkü payla' });
        }
        return L;
    }
    function seciliTutar(h) {
        var L = secenekler(h);
        for (var i = 0; i < L.length; i++) if (L[i].tip === _secim.tip) return L[i].tutar;
        var g = document.getElementById('dstSerbest');
        return _secim.tip === 'serbest' ? Math.round(+(g && g.value) || 0) : 0;
    }

    function toplamYaz() {
        var v = _ben; if (!v || !v.ozet) return;
        var h = benHesap(v);
        var el = document.getElementById('dstToplam');
        if (!el) return;
        var t = seciliTutar(h);
        var acik = {
            donem: 'Bu dönemin desteği:', tamamla: 'Dönemi tamamlamak için:', yil: 'Bu yıl (iki dönem):',
            gelecek: 'Gelecek dönemin desteği:', serbest: 'Gönderdiğin tutar:'
        }[_secim.tip] || 'Tutar:';
        el.innerHTML = '<span>' + esc(acik) + '</span><b>' + esc(t > 0 ? tl(t) : '—') + '</b>';
    }

    function secimUygula(kutu) {
        [].forEach.call(kutu.querySelectorAll('.dst-sec'), function (b) {
            var sec = b.getAttribute('data-tip') === _secim.tip;
            b.classList.toggle('sec', sec);
            b.setAttribute('aria-pressed', sec ? 'true' : 'false');
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
        if (!v || !v.ozet || !v.ozet.hazir) { uyar('Bu dönemin payı henüz belirlenmedi. Biraz sonra yeniden deneyin.'); return; }
        var h = benHesap(v);
        var onizleme = rol() === 'admin';
        var al = alici();
        var aciklama = aciklamaMetni();
        var u0 = benKim() || {};
        var L = secenekler(h);
        _secim = { tip: L.length ? L[0].tip : 'serbest' };
        odemeKapat();

        var kartlar = L.map(function (o) {
            return '<button type="button" class="dst-sec" data-tip="' + o.tip + '" aria-pressed="false">' +
                '<span class="dst-sec-ad">' + esc(o.ad) + '</span>' +
                '<b>' + esc(tl(o.tutar)) + '</b>' +
                '<small>' + esc(o.alt) + '</small></button>';
        }).join('');
        var ort = document.createElement('div');
        ort.id = 'dstOrt';
        ort.innerHTML =
            '<div id="dstKutu" role="dialog" aria-modal="true" aria-label="Destek ver">' +
              '<div class="dst-m-bas">' + kalpSvg() + '<b>Destek ver</b>' +
                '<button type="button" class="dst-kapat" aria-label="Kapat">&times;</button></div>' +
              '<div class="dst-m-bol">' +
                '<p class="dst-m-et">' + esc((h.donem.yilAd + ' · ' + h.donem.ad).toLocaleUpperCase('tr-TR')) +
                  (h.kisi > 0 ? ' · PAYIN ' + esc(tl(h.kisi)) : '') + '</p>' +
                (h.durum === 'tamam' ? '<p class="dst-dip" style="margin:0 0 10px;">Bu dönemin desteği tamam, teşekkürler! Dilersen gelecek dönemi şimdiden gönderebilirsin.</p>' : '') +
                (kartlar ? '<div class="dst-secenekler">' + kartlar + '</div>' : '') +
                '<div class="dst-ekler">' +
                  '<button type="button" class="dst-ek" data-tip="serbest">Başka tutar</button>' +
                '</div>' +
                '<div class="dst-serbest"><input id="dstSerbest" type="number" min="10" step="10" inputmode="numeric" placeholder="Tutar"> <b>TL</b></div>' +
                '<div class="dst-toplam" id="dstToplam"></div>' +
                '<p class="dst-dip">Tutar dönem boyunca değişmez. Parça parça da gönderebilirsin; fazlası gelecek döneme sayılır.</p>' +
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
              '</div>' +
              /* destekçiler köşesi (20.10.2026): ad görünsün mü + meslektaşlara tek cümle */
              '<div class="dst-m-bol dst-kose">' +
                '<p class="dst-m-et">DESTEKÇİLER KÖŞESİ</p>' +
                '<label class="dst-onay"><input id="dstKoseGoster" type="checkbox" checked> ' +
                  '<span>Adım destekçiler köşesinde görünsün' + (kisaAd(durum('currentUserName') || u0.displayName) ? ' <b>(' + esc(kisaAd(durum('currentUserName') || u0.displayName)) + ')</b>' : '') + '</span></label>' +
                '<label for="dstKoseNot">MESLEKTAŞLARINA BİR CÜMLE (İSTEĞE BAĞLI)</label>' +
                '<input id="dstKoseNot" type="text" maxlength="' + KOSE_NOT_SINIR + '" placeholder="ör. Öğrencilerim dijital kitabı çok sevdi">' +
                '<p class="dst-dip">Ödemen onaylanınca adın ve cümlen öğretmenlerin gördüğü köşeye eklenir. Tutar görünmez.</p>' +
              '</div>' +
              '<div class="dst-m-bol">' +
                '<button type="button" class="dst-tus ana" id="dstBildir"' + (onizleme ? ' disabled' : '') + '>Ödemeyi yaptım, bildir</button>' +
                '<p class="dst-dip">' + (onizleme
                    ? 'Yönetici hesabıyla bildirim gönderilmez; öğretmen hesabında bu tuş çalışır.'
                    : 'Bildirimin yöneticiye gider; onaylanınca kartındaki bu dönemin desteğine işlenir.') + '</p>' +
              '</div>' +
            '</div>';
        document.body.appendChild(ort);
        document.addEventListener('keydown', escKapat, true);
        var kutu = ort.querySelector('#dstKutu');

        ort.addEventListener('click', function (e) {
            var t = e.target;
            if (t === ort || (t.closest && t.closest('.dst-kapat'))) { odemeKapat(); return; }
            var sc = t.closest && t.closest('.dst-sec');
            if (sc) { _secim = { tip: sc.getAttribute('data-tip') }; secimUygula(kutu); return; }
            var ek = t.closest && t.closest('.dst-ek');
            if (ek) {
                _secim = { tip: ek.getAttribute('data-tip') };
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
        if (rol() === 'admin') { uyar('Yönetici hesabıyla bildirim gönderilmez.'); return; }
        var v = _ben;
        var u = benKim();
        if (!v || !v.ozet || !u) { uyar('Oturum bulunamadı; sayfayı yenileyip tekrar deneyin.'); return; }
        var oz = v.ozet, h = benHesap(v);
        var tutar = seciliTutar(h);
        if (!(tutar >= 10)) { uyar('Lütfen bir seçenek seçin ya da en az 10 TL yazın.'); return; }
        var tus = document.getElementById('dstBildir');
        if (tus) { tus.disabled = true; tus.textContent = 'Gönderiliyor…'; }
        var not = ((document.getElementById('dstNot') || {}).value || '').trim().slice(0, 200);
        var kg = document.getElementById('dstKoseGoster');
        var koseNot = ((document.getElementById('dstKoseNot') || {}).value || '').trim().slice(0, KOSE_NOT_SINIR);
        var belge = {
            uid: u.uid, tur: 'destek', durum: 'bekliyor',
            tutar: Math.round(tutar), ay: 0, aylik: oz.aylik,
            /* 22.10.2026: dönem seçimi ve o anki payı */
            secim: _secim.tip, donem: h.donem.kod, pay: h.kisi,
            aciklama: aciklamaMetni(u.uid), not: not, kod: ogretmenKodu(u.uid),
            koseGoster: !kg || !!kg.checked, koseNot: koseNot,
            email: u.email || durum('currentUser') || '',
            name: durum('currentUserName') || u.displayName || '',
            phone: durum('currentUserPhone') || '',
            createdAt: sunucuZamani()
        };
        db().collection('siparisler').add(belge).then(function () {
            odemeKapat();
            uyar('Bildirimin alındı ✅\nYönetici ödemeyi görünce onaylayacak; onaylanınca kartındaki bu dönemin desteğine işlenir. Desteğin için teşekkürler!');
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

    /* Öğretmen listesine göre hesaplar; gerekirse açık özeti ve özel ayarı
       yazar. liste null ise sayılar özel ayardaki son değerden alınır.
       22.10.2026: DÖNEM PAYI (dönem başında ilk sayımda bir kez sabitlenir;
       sec.payYenile ile elle yeniden) ve ORTAK HEDEF yüzdesi de yazılır. */
    function ozetYayinla(liste, zorla, sec) {
        sec = sec || {};
        if (!yoneticiMi() || !db()) return Promise.resolve(null);
        var simdi = Date.now();
        return Promise.all([ozetOku(true), ayarOku(), tumKayitlar().catch(function () { return null; })]).then(function (r) {
            var oz = r[0], A = ayarDuzen(r[1], oz), K = r[2];
            var aktif = A.aktif, onayli = A.onayli;
            if (liste) {
                aktif = 0; onayli = 0;
                liste.forEach(function (o) {
                    if (onayliMi(o)) onayli++;
                    if (aktifMi(o, simdi)) aktif++;
                });
            }
            var aylik = aylikHesapla(A.toplam, aktif);
            var ay = ayAnahtar(new Date());
            var me = benUid();
            /* dönem payı: bu dönemin kaydı varsa korunur (sabit) */
            var dn = donemBul(new Date());
            var eskiD = (oz.donem && oz.donem.kod === dn.kod) ? oz.donem : null;
            var yenile = !eskiD || !!sec.payYenile;
            var pay = yenile ? donemPayHesapla(A.toplam, aktif) : eskiD.pay;
            var sabit = (!yenile && eskiD.sabit) ? eskiD.sabit : simdi;
            /* ortak hedef: bu döneme düşen destekler ÷ (aylık toplam × 6) — yalnız yüzde */
            var yuzde = eskiD ? eskiD.yuzde : null;
            if (K && liste) {
                var ozY = { aylik: aylik, donem: { kod: dn.kod, pay: pay }, donemler: {} };
                Object.keys(oz.donemler || {}).forEach(function (k) { ozY.donemler[k] = oz.donemler[k]; });
                ozY.donemler[dn.kod] = pay;
                var top = 0;
                liste.forEach(function (o) {
                    var uid = o._id || o.uid;
                    if (!uid || !K[uid] || !onayliMi(o)) return;
                    top += dagit(K[uid].map(kayitOdeme), kayitTarihi(o), ozY).verilen;
                });
                var gider = A.toplam * DONEM_AY;
                yuzde = gider > 0 ? Math.round(top / gider * 100) : 0;
            }
            var degisti = A.aktif !== aktif || A.onayli !== onayli || oz.aylik !== aylik || +oz.gecmis[ay] !== aylik ||
                          !eskiD || eskiD.pay !== pay || eskiD.yuzde !== yuzde || +(oz.donemler || {})[dn.kod] !== pay ||
                          oz.eskiAlan || A.eskiTaban || !A.guvenli || (me && oz.yoneticiler.indexOf(me) < 0);
            var bayat = !oz.guncelleme || (simdi - oz.guncelleme.getTime() > 6 * 3600e3);
            if (!degisti && !bayat && !zorla) return oz;
            var FV = firebase.firestore.FieldValue, gecmis = {}, donemler = {};
            gecmis[ay] = aylik;
            donemler[dn.kod] = pay;
            var acik = { aylik: aylik, gecmis: gecmis, yoneticiler: FV.arrayUnion(me), guncelleme: sunucuZamani(),
                         donem: { kod: dn.kod, pay: pay, yuzde: yuzde, bas: ymd(dn.bas), bit: ymd(dn.son), sabit: sabit },
                         donemler: donemler };
            if (oz.eskiAlan) ['tur', 'toplam', 'taban', 'aktif', 'onayli', 'ayarElle'].forEach(function (k) { acik[k] = FV.delete(); });
            var ozel = { uid: me, tur: 'destekAyar', toplam: A.toplam, ayarElle: A.elle,
                         aktif: aktif, onayli: onayli, guncelleme: sunucuZamani() };
            /* 20.10.2026: alt sınır kalktı; eski belgedeki "taban" alanı silinir */
            if (A.eskiTaban) ozel.taban = FV.delete();
            return db().collection('mufredat').doc('_destek').set(acik, { merge: true }).then(function () {
                /* güvenilmeyen (bir yöneticinin yazmadığı) ayar belgesi birleştirilmez, baştan yazılır */
                return db().collection('siparisler').doc('_destekAyar').set(ozel, A.guvenli ? { merge: true } : {});
            }).then(function () { _ayar = null; return ozetOku(true); });
        });
    }

    /* 22.10.2026: öğretmenin kartı dönem dağıtımını kendi belgesindeki
       destek.odemeler'den hesaplar. Eski özetlerde bu liste yok: sayımda
       defterle karşılaştırılır, eksik ya da tutmayanlar yazılır (bir
       sayımda en çok 25 öğretmen). */
    function ozetleriEsitle(liste) {
        if (!yoneticiMi() || !db() || !liste) return Promise.resolve(0);
        return tumKayitlar().then(function (K) {
            var is = [];
            liste.forEach(function (o) {
                var uid = o._id || o.uid;
                if (!uid) return;
                var L = K[uid] || [], d = o.destek || {};
                var var_ = Array.isArray(d.odemeler) ? d.odemeler : null;
                if (!L.length && !var_ && !(+d.odenen > 0)) return;
                var top = L.reduce(function (a, k) { return a + k.tutar; }, 0);
                if (!(var_ && var_.length === L.length && (+d.odenen || 0) === top)) is.push(uid);
            });
            is = is.slice(0, 25);
            return Promise.all(is.map(function (uid) {
                return ogretmenOzetYaz(uid, K[uid] || []).catch(function () { });
            })).then(function () { return is.length; });
        });
    }

    var _yayinHata = '';
    function listeGeldi(liste) {
        _liste = liste || [];
        if (!yoneticiMi()) return;
        sayimZamani(true);
        stilKur();
        ozetYayinla(_liste).then(function () { _yayinHata = ''; }, function (e) {
            _yayinHata = hataYaz(e);
            try { console.warn('destek özeti yazılamadı:', _yayinHata); } catch (x) { }
        }).then(function () { ayarCiz(); rozetleriYenile(); });
    }

    /* 20.10.2026 — öğretmen: "gerçekten 30.000 tl yi sürekli güncellenen
       girişe bağla". Yönetici siteye girince (öğretmen listesini açmasa da)
       ve sayfa açık kaldıkça en geç 30 dakikada bir, son 30 günde giren
       onaylı öğretmenler ayrı sorguyla yeniden sayılır; tutar değiştiyse
       herkese açık özet hemen yazılır. Sayfa yenilense de 30 dakikadan sık
       saymaz (zaman bu tarayıcıda saklanır). Eskiden yalnız liste açılınca
       ve 3 saatte bir sayılıyordu. */
    var SAYIM_ARA = 30 * 60e3, _sonSayim = 0, _sayimSoz = null;
    function sayimZamani(yaz) {
        if (yaz) {
            _sonSayim = Date.now();
            try { localStorage.setItem('kidefDestekSayim', String(_sonSayim)); } catch (e) { }
            return _sonSayim;
        }
        var s = _sonSayim;
        try { s = Math.max(s, +localStorage.getItem('kidefDestekSayim') || 0); } catch (e) { }
        return s > Date.now() ? 0 : s;
    }
    function sayimYap(zorla) {
        if (!yoneticiMi() || !db() || !benUid()) return Promise.resolve(null);
        if (_sayimSoz) return _sayimSoz;
        if (!zorla && Date.now() - sayimZamani() < SAYIM_ARA) return Promise.resolve(null);
        sayimZamani(true);
        _sayimSoz = db().collection('kullanicilar').where('role', '==', 'teacher').get().then(function (snap) {
            var L = [];
            snap.forEach(function (d) { var v = d.data() || {}; v._id = d.id; L.push(v); });
            _liste = L;
            return ozetYayinla(L).then(function () { return ozetleriEsitle(L); });
        }).then(function () { _yayinHata = ''; }, function (e) {
            _yayinHata = hataYaz(e);
            try { console.warn('destek sayımı yapılamadı:', _yayinHata); } catch (x) { }
        }).then(function () { _sayimSoz = null; ayarCiz(); });
        return _sayimSoz;
    }
    setTimeout(function () { sayimYap(); }, 6000);
    setInterval(function () {
        if (document.visibilityState === 'hidden') return;
        sayimYap();
    }, 20000);

    var _ayar = null;
    function ayarOku(zorla) {
        if (_ayar && !zorla) return Promise.resolve(_ayar);
        return db().collection('siparisler').doc('_destekAyar').get().then(function (s) {
            _ayar = s.exists ? (s.data() || {}) : {};
            return _ayar;
        }).catch(function () { return {}; });
    }

    function ayarCiz() {
        var el = document.getElementById('admin-destek-ayar');
        if (!el || !yoneticiMi()) return;
        stilKur();
        Promise.all([ozetOku(), ayarOku()]).then(function (r) {
            var oz = r[0], A = ayarDuzen(r[1], oz);
            var bek = _bekleyen ? _bekleyen.length : 0;
            var dn = donemBul(new Date());
            var dP = (oz.donem && oz.donem.kod === dn.kod) ? oz.donem : null;
            /* yazılmakta olan (kaydedilmemiş) toplam yeniden çizimde kaybolmasın */
            var once = document.getElementById('dstAyToplam');
            var yazilan = (once && once.__dstDegisti) ? once.value : '';
            el.__dstAktif = A.aktif;
            el.__dstToplam = A.toplam;
            el.__dstPay = dP ? dP.pay : 0;
            var simdikiPay = donemPayHesapla(A.toplam, A.aktif);
            el.innerHTML =
                '<div class="dst-a-ust"><b>💛 Beklenen Destek</b>' +
                  '<span>Son 30 günde siteye giren: <b>' + A.aktif + '</b> öğretmen' + (A.onayli ? ' (onaylı ' + A.onayli + ')' : '') + '</span>' +
                  '<span>' + esc(dn.yilAd + ' · ' + dn.ad + ' (' + dn.aralik + ')') + ' payı: <b>' + esc(dP ? tl(dP.pay) : '—') + '</b>' +
                    (dP && dP.sabit ? ' <i class="dst-a-sabit">' + esc(gunYaz(new Date(dP.sabit))) + ' sabitlendi</i>' : '') + '</span>' +
                  '<span>Ortak hedef: <b>' + (dP && dP.yuzde !== null ? '%' + dP.yuzde : '—') + '</b></span>' +
                  (oz.guncelleme ? '<span style="color:#A0927E;">yayın ' + esc(saatliYaz(oz.guncelleme)) + '</span>' : '') +
                  (bek ? '<span style="color:#B5670A; font-weight:800;">' + bek + ' bildirim onay bekliyor</span>' : '') +
                '</div>' +
                (_yayinHata ? '<div style="margin-top:8px; color:#B03A2E; font-weight:700;">Özet yazılamadı (' + esc(_yayinHata) + '). ' +
                    'Firestore kurallarında mufredat koleksiyonuna yönetici yazma izni olmalı; öğretmenlerin kartında tutar görünmez.</div>' : '') +
                '<div class="dst-a-form">' +
                  '<span>Aylık toplam</span><input id="dstAyToplam" type="number" min="1" step="1000" inputmode="numeric" value="' + A.toplam + '"> TL' +
                  [1000, 5000, 10000].map(function (n) {
                      return '<button type="button" class="dst-yb art" data-dst="ayar-art" data-art="' + n + '" title="Aylık toplamı ' +
                             esc(tl(n)) + ' artır">+' + esc(sayi(n)) + '</button>';
                  }).join('') +
                  '<button type="button" class="dst-yb kaydet" data-dst="ayar-kaydet">Kaydet</button>' +
                  '<span class="dst-a-on" id="dstAyOn" aria-live="polite"></span>' +
                '</div>' +
                '<div class="dst-a-form">' +
                  '<button type="button" class="dst-yb art" data-dst="pay-yenile" title="Bu dönemin payını şimdiki öğretmen sayısıyla yeniden belirle">' +
                    'Bu dönemin payını yeniden hesapla</button>' +
                  '<span class="dst-a-on">şimdiki sayıyla <b>' + esc(tl(simdikiPay)) + '</b>' +
                    (dP && dP.pay !== simdikiPay ? ' (şu an ' + esc(tl(dP.pay)) + ')' : '') + '</span>' +
                '</div>' +
                '<p style="margin:8px 0 0; font-size:.8rem; color:#8A7A66; line-height:1.55;">Dönem payı = kişi başı aylık ' +
                  '(aylık toplam ÷ son 30 günde giren onaylı öğretmen) × 6. Her dönemin başında (1 Eylül, 1 Şubat) ilk sayımda bir kez ' +
                  'sabitlenir, dönem boyunca kendiliğinden değişmez; «Kaydet» ya da «yeniden hesapla» bu dönemin payını değiştirir. ' +
                  'Yeni öğretmenin ilk 30 günü ücretsiz; dönemin ortasında katılanın payı kalan süreyle orantılı. ' +
                  'Ortak hedef = bu döneme düşen destekler ÷ (aylık toplam × 6). Öğretmenler kendi dönem payını ve ortak hedef ' +
                  'yüzdesini görür; öğretmen sayısı ve aylık toplam onlara gösterilmez.</p>';
            /* destekçiler köşesi: yayında olanlar, × ile kaldırılır.
               (innerHTML'e EKLEME yapılmaz: ekleme bütün çocukları yeniden
               kurar, yazılmakta olan toplam ve işaretler kaybolur.) */
            var L = oz.destekciler;
            var koseHtml = '<details class="dst-a-kose"><summary>💛 Destekçiler köşesi (' + L.length + ')' +
                '<small>ödeme onaylanınca eklenir · ana sayfadaki şeritte ve destek kartında görünür</small></summary>' +
                (L.length
                    ? '<div class="dst-a-kose-liste">' + L.map(function (x) {
                        return '<span class="dst-a-dk"><b>' + esc(x.ad) + '</b><i>' + esc(ayAdi(x.ay)) + '</i>' +
                            (x.not ? '<q>' + esc(x.not) + '</q>' : '') +
                            '<button type="button" data-dst="kose-sil" data-t="' + esc(x.t) + '" data-ad="' + esc(x.ad) + '" title="Köşeden kaldır" aria-label="' + esc(x.ad) + ' köşeden kaldır">&times;</button></span>';
                      }).join('') + '</div>'
                    : '<p class="dst-y-yok" style="margin:8px 0 0;">Henüz kimse yok. İlk ödeme onaylanınca burada ve öğretmenlerin ekranında görünür.</p>') +
                '</details>';
            el.insertAdjacentHTML('beforeend', koseHtml);
            if (yazilan) {
                var g = document.getElementById('dstAyToplam');
                if (g) { g.value = yazilan; g.__dstDegisti = true; }
            }
            onizle();
        }).catch(function (e) {
            el.innerHTML = '<span style="color:#B03A2E;">Destek özeti okunamadı: ' + esc(hataYaz(e)) + '</span>';
        });
    }

    /* yazılan toplamın dönem payı karşılığı (kaydetmeden önce görülsün) */
    function onizle() {
        var el = document.getElementById('admin-destek-ayar');
        var g = document.getElementById('dstAyToplam'), o = document.getElementById('dstAyOn');
        if (!el || !g || !o) return;
        var t = Math.round(+g.value || 0);
        if (!(t > 0) || t === el.__dstToplam) { o.innerHTML = ''; return; }
        var a = aylikHesapla(t, el.__dstAktif || 0);
        o.innerHTML = 'Kaydedince bu dönemin payı <b>' + esc(tl(a * DONEM_AY)) + '</b> (ayda ' + esc(tl(a)) + ')';
    }
    function ayarArt(n) {
        var g = document.getElementById('dstAyToplam');
        if (!g || !(n > 0)) return;
        g.value = Math.max(0, Math.round(+g.value || 0)) + n;
        g.__dstDegisti = true;
        onizle();
    }

    function ayarKaydet() {
        var g = document.getElementById('dstAyToplam');
        var t = Math.round(+((g || {}).value) || 0);
        if (!(t > 0)) { uyar('Aylık toplam 0\'dan büyük olmalı.'); return; }
        var el = document.getElementById('admin-destek-ayar');
        var a = aylikHesapla(t, (el && el.__dstAktif) || 0);
        sor('Aylık toplam ' + tl(t) + ' olarak kaydedilsin mi?\n' +
            'Bu dönemin kişi başı payı ' + tl(a * DONEM_AY) + ' olur (ayda ' + tl(a) + '). ' +
            'Geçmiş dönemlerin payı değişmez.').then(function (evet) {
            if (!evet) return;
            Promise.all([ozetOku(true), ayarOku(true)]).then(function (r) {
                var A = ayarDuzen(r[1], r[0]);
                var yaz = { uid: benUid(), tur: 'destekAyar', toplam: t, ayarElle: true };
                if (A.eskiTaban) yaz.taban = firebase.firestore.FieldValue.delete();
                return db().collection('siparisler').doc('_destekAyar').set(yaz, A.guvenli ? { merge: true } : {});
            }).then(function () {
                _ayar = null;
                var g2 = document.getElementById('dstAyToplam');
                if (g2) g2.__dstDegisti = false;
                return ozetYayinla(_liste.length ? _liste : null, true, { payYenile: true });
            }).then(function () {
                ayarCiz(); rozetleriYenile();
                uyar('Aylık toplam kaydedildi: ' + tl(t) + '. Bu dönemin payı: ' + tl(a * DONEM_AY) + '.');
            }).catch(function (e) { uyar('Kaydedilemedi: ' + hataYaz(e)); });
        });
    }

    /* 22.10.2026: bu dönemin payını şimdiki öğretmen sayısıyla yeniden belirle */
    function payYenile() {
        var el = document.getElementById('admin-destek-ayar');
        var yeni = donemPayHesapla((el && el.__dstToplam) || VARSAYILAN.toplam, (el && el.__dstAktif) || 0);
        sor('Bu dönemin payı şimdiki öğretmen sayısıyla ' + tl(yeni) + ' olarak yeniden belirlensin mi?' +
            (el && el.__dstPay ? '\n(Şu an ' + tl(el.__dstPay) + '.)' : '') +
            '\nBu dönem fazla ödemiş olanların fazlası gelecek döneme sayılır.').then(function (evet) {
            if (!evet) return;
            return ozetYayinla(_liste.length ? _liste : null, true, { payYenile: true }).then(function () {
                ayarCiz(); rozetleriYenile();
                uyar('Bu dönemin payı: ' + tl(yeni) + '.');
            });
        }).catch(function (e) { uyar('Yeniden hesaplanamadı: ' + hataYaz(e)); });
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
    /* 22.10.2026: karttaki küçük rozet bu dönemin durumunu söyler */
    function donemCipi(h) {
        if (h.durum === 'tamam') return '<span class="dst-cip onaylandi">bu dönem destekçi</span>';
        if (h.durum === 'kismi') return '<span class="dst-cip" style="background:#FFF4DE; color:#9A6512;">bu dönem ' + esc(tl(h.verilen)) + '</span>';
        if (h.durum === 'ilkay') return '<span class="dst-cip elle">ilk ay</span>';
        if (h.durum === 'bos') return '<span class="dst-cip" style="background:#F3F4F6; color:#8A94A3;">bu dönem destek yok</span>';
        return '';
    }
    var _kayitlar = null;     /* uid -> defter kayıtları (22.10.2026) */
    function rozetleriYenile2() {
        return Promise.all([ozetOku(), tumKayitlar().catch(function () { return {}; }), tumBekleyen().catch(function () { return []; })])
            .then(function (r) {
                var oz = r[0]; _kayitlar = r[1]; _bekleyen = r[2];
                _defter = {};
                Object.keys(_kayitlar).forEach(function (u) {
                    _defter[u] = _kayitlar[u].reduce(function (a, k) { return a + k.tutar; }, 0);
                });
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
                        html = donemCipi(dagit((_kayitlar[uid] || []).map(kayitOdeme), kayitTarihi(doc), oz));
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
            '<span class="n">' + esc(secimYazi(b)) + ' · ' + esc(saatliYaz(b.tarih)) + '</span>' +
            (b.not ? '<span class="n" style="font-style:italic;">“' + esc(b.not) + '”</span>' : '') +
            /* köşe: onaylanınca ne yayınlanacağı burada görünür (yönetici onaylamadan önce okur) */
            (b.koseGoster
                ? '<span class="n dst-kose-on" title="Onaylanınca destekçiler köşesine eklenir">💛 köşe: <b>' + esc(kisaAd(b.ad) || 'ad yok') + '</b>' +
                  (b.koseNot ? ' — «' + esc(b.koseNot) + '»' : '') + '</span>'
                : '<span class="n dst-kose-on">köşede görünmek istemiyor</span>') +
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
            /* 22.10.2026: dönem hesabı */
            var kayit = kayitTarihi(doc);
            var h = dagit(def.map(kayitOdeme), kayit, oz);
            var aktif = aktifMi(doc, Date.now());
            var bekleyen = bil.filter(function (b) { return b.durum === 'bekliyor'; });
            var gecmis = bil.filter(function (b) { return b.durum !== 'bekliyor'; });

            var s = '<div class="dst-y">';
            if (!onayliMi(doc)) {
                s += '<p class="dst-y-bilgi" style="margin-top:0;">Bu hesap onaylı değil; onaylanana kadar destek hesabına girmez.</p>';
            }
            var dn = h.donem;
            s += '<div class="dst-y-kutular">' +
                '<div class="dst-y-k"><b>' + esc(h.kisi > 0 ? tl(h.kisi) : (h.ilkAy ? 'ilk ay' : '—')) + '</b><span>BU DÖNEMİN PAYI</span></div>' +
                '<div class="dst-y-k odenen"><b>' + esc(tl(h.verilen)) + '</b><span>BU DÖNEM VERİLEN</span></div>' +
                (h.ileri > 0 ? '<div class="dst-y-k odenen"><b>' + esc(tl(h.ileri)) + '</b><span>GELECEK DÖNEME</span></div>' : '') +
                '<div class="dst-y-k"><b>' + esc(tl(odenen)) + '</b><span>TOPLAM ÖDENEN</span></div>' +
                '</div>' +
                '<p class="dst-y-bilgi">' + donemCipi(h) + ' ' + esc(dn.yilAd + ' · ' + dn.ad + ' (' + dn.aralik + ')') +
                ' · dönem payı ' + esc(h.pay > 0 ? tl(h.pay) : '—') +
                (h.kisi > 0 && h.kisi < h.pay ? ' (dönem ortasında katıldı: ' + esc(tl(h.kisi)) + ')' : '') +
                ' · kayıt ' + esc(gunYaz(kayit)) +
                (h.ilkAy ? ' · ilk ay ücretsiz (bitiş ' + esc(gunYaz(h.ilkAyBitis)) + ')' : '') +
                ' · son 30 günde ' + (aktif ? '<b style="color:#1E8449;">aktif</b>' : '<b style="color:#A9B2BD;">aktif değil</b>') +
                ' · açıklama kodu <b>' + esc(aciklamaMetni(uid)) + '</b></p>';

            s += '<h5>Onay bekleyen bildirimler (' + bekleyen.length + ')</h5>' +
                (bekleyen.length ? bekleyen.map(function (b) { return bekleyenSatir(b, false); }).join('')
                                 : '<p class="dst-y-yok">Bekleyen bildirim yok.</p>');

            s += '<h5>Ödeme defteri (' + def.length + ')</h5>' +
                (def.length ? def.map(function (k) {
                    return '<div class="dst-y-sat">' +
                        '<span class="t">' + esc(tl(k.tutar)) + '</span>' +
                        '<span class="n">' + esc(secimYazi(k)) + ' · ' + esc(gunYaz(k.tarih)) + '</span>' +
                        (k.kaynak === 'bildirim' ? '<span class="dst-cip onaylandi">bildirimden</span>' : '<span class="dst-cip elle">elle girildi</span>') +
                        (k.not ? '<span class="n" style="font-style:italic;">“' + esc(k.not) + '”</span>' : '') +
                        '<span class="bos"></span>' +
                        '<button type="button" class="dst-yb sil" data-dst="kayit-sil" data-id="' + esc(k.id) + '">Sil</button>' +
                        '</div>';
                }).join('') : '<p class="dst-y-yok">Henüz kayıtlı ödeme yok.</p>');

            /* 22.10.2026: ay yerine dönem seçimi (tutar seçenekten dolar) */
            var SEC = secenekler(h), secOps = '<option value="serbest">serbest</option>', secTutar = {};
            SEC.forEach(function (o) {
                secOps += '<option value="' + o.tip + '">' + esc(o.ad.toLocaleLowerCase('tr-TR') + ' (' + tl(o.tutar) + ')') + '</option>';
                secTutar[o.tip] = o.tutar;
            });
            s += '<h5>Elle ödeme ekle</h5>' +
                '<div class="dst-y-form" data-uid="' + esc(uid) + '">' +
                  '<label>NE İÇİN<select class="dst-f-sec">' + secOps + '</select></label>' +
                  '<label>TUTAR (TL)<input class="dst-f-tutar" type="number" min="1" step="10" style="width:120px;"></label>' +
                  '<label>ÖDEME TARİHİ<input class="dst-f-tarih" type="date" value="' + inputTarih(new Date()) + '"></label>' +
                  '<label style="flex:1 1 180px;">NOT<input class="dst-f-not" type="text" maxlength="200" placeholder="ör. elden / başka hesaptan"></label>' +
                  '<label class="dst-f-kose" title="Kısa adı (' + esc(kisaAd(bilgi.ad) || '—') + ') destekçiler köşesine eklenir">' +
                    '<input class="dst-f-goster" type="checkbox" checked> köşede göster</label>' +
                  '<button type="button" class="dst-yb kaydet" data-dst="elle-ekle" data-uid="' + esc(uid) + '">Kaydet</button>' +
                '</div>' +
                '<p class="dst-y-bilgi">Seçince tutar dolar; istersen değiştir. Havale bildirimi gelmeden yapılan ödemeleri buradan gir. ' +
                  'Ödeme, yapıldığı dönemin payını doldurur; fazlası gelecek döneme sayılır.</p>';

            if (gecmis.length) {
                s += '<details style="margin-top:12px;"><summary style="cursor:pointer; font-weight:800; color:#8A94A3; font-size:.86rem;">Sonuçlanan bildirimler (' + gecmis.length + ')</summary>' +
                    '<div style="margin-top:8px;">' + gecmis.map(function (b) {
                        return '<div class="dst-y-sat">' + durumCipi(b.durum) +
                            '<span class="t">' + esc(tl(b.tutar)) + '</span>' +
                            '<span class="n">' + esc(secimYazi(b)) + ' · ' + esc(saatliYaz(b.tarih)) + '</span>' +
                            (b.not ? '<span class="n" style="font-style:italic;">“' + esc(b.not) + '”</span>' : '') + '</div>';
                    }).join('') + '</div></details>';
            }
            s += '</div>';
            kutu.innerHTML = s;
            kutu.__dstSecTutar = secTutar;

            /* öğretmenin kartında gördüğü özet defterle aynı değilse (ya da
               22.10.2026'dan önceki özette ödeme listesi yoksa) düzelt */
            var ozt = doc.destek || {};
            if ((+ozt.odenen || 0) !== odenen || (+ozt.adet || 0) !== def.length ||
                (def.length && !(Array.isArray(ozt.odemeler) && ozt.odemeler.length === def.length))) {
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
            var top = 0, son = null, sonTutar = 0;
            L.forEach(function (k) {
                top += k.tutar;
                if (k.tarih && (!son || k.tarih > son)) { son = k.tarih; sonTutar = k.tutar; }
            });
            /* 22.10.2026: dönem dağıtımı için ödeme listesi {t: ms, tutar} */
            var odemeler = L.map(kayitOdeme).filter(function (x) { return x.t > 0 && x.tutar > 0; })
                .sort(function (a, b) { return a.t - b.t; });
            return db().collection('kullanicilar').doc(uid).set({
                /* sonTutar (20.10.2026): öğretmenin kartındaki teşekkür şeridi için */
                destek: { odenen: top, adet: L.length, sonOdeme: son || null, sonTutar: sonTutar, odemeler: odemeler, guncelleme: sunucuZamani() }
            }, { merge: true }).then(function () {
                var O = window._adminOgretmenler || {};
                if (O[uid] && O[uid].doc) O[uid].doc.destek = { odenen: top, adet: L.length, odemeler: odemeler };
                return top;
            });
        });
    }

    /* TEŞEKKÜR (20.10.2026 — öğretmen: "ücret ödeyenlere bi teşekkür mesajı
       vs gidiyor mu" → mesaj kutusu + kartta şerit). Ödeme onaylanınca ya da
       elle kaydedilince öğretmenin ✉️ Mesajlar kutusuna yönetici adına
       teşekkür yazılır (index.html'deki mesajlar düzeni: from:'admin',
       readByUser:false → yeşil nokta yanar). Kart şeridi kullanicilar
       belgesindeki destek.sonOdeme / sonTutar'dan çizilir. Mesaj yazılamazsa
       ödeme kaydı bozulmaz; yöneticiye söylenir. */
    function tesekkurMetni(tutar, ek, tarih) {
        /* ek: "bu dönem", "bu yıl (iki dönem)", eski kayıtta "3 ay" … (22.10.2026) */
        if (typeof ek === 'number') ek = ek ? ek + ' ay' : '';
        return 'Desteğin için teşekkürler 💛 ' + gunYaz(tarih) + ' tarihli ' + tl(tutar) +
            (ek ? ' (' + ek + ')' : '') + ' ödemen hesabına işlendi. ' +
            'Katkınla sitedeki yapay zekâ hizmetleri ve yeni içerikler devam ediyor. ' +
            'Durumunu profilindeki Beklenen Destek kartından görebilirsin.';
    }
    /* Destekçiler köşesine ekle (yönetici). Aynı ad aynı ay zaten varsa
       yenisi eklenmez; tarihi ve (doluysa) cümlesi tazelenir. */
    function destekciEkle(ad, not, tarih) {
        var kisa = kisaAd(ad);
        if (!kisa || !db()) return Promise.resolve(false);
        tarih = (tarih && !isNaN(tarih.getTime())) ? tarih : new Date();
        var kayit = { ad: kisa, ay: ayAnahtar(tarih), t: tarih.getTime(), not: String(not || '').trim().slice(0, KOSE_NOT_SINIR) };
        return ozetOku(true).then(function (oz) {
            var L = oz.destekciler.slice();
            var ayni = -1;
            for (var i = 0; i < L.length; i++) {
                if (L[i].ad === kayit.ad && L[i].ay === kayit.ay) { ayni = i; break; }
            }
            if (ayni >= 0) {
                var e = L[ayni];
                L[ayni] = { ad: e.ad, ay: e.ay, t: Math.max(e.t, kayit.t), not: kayit.not || e.not };
            } else L.unshift(kayit);
            return db().collection('mufredat').doc('_destek').set({ destekciler: destekciDuzen(L) }, { merge: true });
        }).then(function () { _ozet = null; return true; }, function (e) {
            try { console.warn('destekçi eklenemedi:', hataYaz(e)); } catch (x) { }
            return false;
        });
    }
    function destekciSil(t, ad) {
        return ozetOku(true).then(function (oz) {
            var L = oz.destekciler.filter(function (x) { return !(x.t === +t && x.ad === ad); });
            return db().collection('mufredat').doc('_destek').set({ destekciler: L }, { merge: true });
        }).then(function () { _ozet = null; });
    }

    function tesekkurEk(b) {
        var y = secimYazi(b);
        return y === 'serbest tutar' ? '' : y;
    }
    function tesekkurGonder(uid, bilgi, tutar, ay, tarih) {
        bilgi = bilgi || {};
        var d = db();
        if (!d || !uid) return Promise.resolve(false);
        return d.collection('mesajlar').add({
            uid: uid, email: bilgi.email || '', ad: bilgi.ad || 'Öğretmen',
            from: 'admin', kategori: 'Teşekkür', text: tesekkurMetni(tutar, ay, tarih),
            createdAt: sunucuZamani(), readByAdmin: true, readByUser: false
        }).then(function () { return true; }, function (e) {
            try { console.warn('teşekkür mesajı yazılamadı:', hataYaz(e)); } catch (x) { }
            return false;
        });
    }

    function sonrasi() {
        acikTazele();
        rozetleriYenile();
        ayarCiz();      /* destekçiler köşesi listesi tazelensin */
        seritCiz();
        /* 22.10.2026: ortak hedef yüzdesi hemen tazelensin (yeniden sayım) */
        sayimYap(true);
    }

    function onayla(id) {
        var me = benUid();
        var ref = db().collection('siparisler').doc(id);
        return ref.get().then(function (s) {
            if (!s.exists) throw new Error('Bildirim bulunamadı');
            var b = bildirimDuzen(s.id, s.data() || {});
            if (b.durum === 'onaylandi') { uyar('Bu bildirim zaten onaylanmış.'); return null; }
            return sor((b.ad || b.email || 'Öğretmen') + ' · ' + tl(b.tutar) + ' (' + secimYazi(b) + ')' +
                       '\nÖdeme hesaba geldiyse onaylayın. Onaylanan tutar öğretmenin bu dönemki desteğine işlenir.').then(function (evet) {
                if (!evet) return null;
                return db().collection('siparisler').doc('dk_' + id).set({
                    uid: me, tur: 'destekKayit', ogretmenUid: b.uid, tutar: b.tutar, ay: b.ay,
                    secim: b.secim || '', donem: b.donem || donemBul(b.tarih || new Date()).kod,
                    kaynak: 'bildirim', siparisId: id, not: b.not || '',
                    odemeTarihi: b.tarih || new Date(), tarih: sunucuZamani()
                }).then(function () {
                    return ref.update({ durum: 'onaylandi', onayTarihi: sunucuZamani(), onaylayan: me });
                }).then(function () {
                    return ogretmenOzetYaz(b.uid);
                }).then(function () {
                    return tesekkurGonder(b.uid, { ad: b.ad, email: b.email }, b.tutar, tesekkurEk(b), b.tarih || new Date());
                }).then(function (gitti) {
                    var kose = b.koseGoster ? destekciEkle(b.ad, b.koseNot, b.tarih || new Date()) : Promise.resolve(null);
                    return kose.then(function (eklendi) {
                        uyar('Onaylandı ✅ ' + tl(b.tutar) + ' öğretmenin desteğine işlendi.' +
                             (gitti ? '\nTeşekkür mesajı öğretmenin Mesajlar kutusuna yazıldı.' : '\nTeşekkür mesajı yazılamadı (mesaj kutusu izni).') +
                             (eklendi === true ? '\nDestekçiler köşesine eklendi: ' + kisaAd(b.ad) + '.'
                              : eklendi === false ? '\nDestekçiler köşesine eklenemedi.' : ''));
                        sonrasi();
                    });
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
        var ay = 0;
        var secim = ((form.querySelector('.dst-f-sec') || {}).value) || 'serbest';
        var td = form.querySelector('.dst-f-tarih').value;
        var not = (form.querySelector('.dst-f-not').value || '').trim().slice(0, 200);
        if (!(tutar > 0)) { uyar('Tutar yazın.'); return; }
        var tarih = td ? new Date(td + 'T12:00:00') : new Date();
        if (isNaN(tarih.getTime())) tarih = new Date();
        var bilgi = (_acik && _acik.bilgi) || {};
        var gk = form.querySelector('.dst-f-goster');
        var kosede = !gk || !!gk.checked;
        var ek = tesekkurEk({ secim: secim });
        sor((bilgi.ad || 'Öğretmen') + ' için ' + tl(tutar) + (ek ? ' (' + ek + ')' : '') + ' ödeme kaydedilsin mi?').then(function (evet) {
            if (!evet) return;
            return db().collection('siparisler').add({
                uid: benUid(), tur: 'destekKayit', ogretmenUid: uid, tutar: tutar, ay: ay,
                secim: secim, donem: donemBul(tarih).kod,
                kaynak: 'elle', siparisId: '', not: not, odemeTarihi: tarih, tarih: sunucuZamani()
            }).then(function () { return ogretmenOzetYaz(uid); })
              .then(function () { return tesekkurGonder(uid, bilgi, tutar, ek, tarih); })
              .then(function (gitti) {
                  var kose = kosede ? destekciEkle(bilgi.ad, '', tarih) : Promise.resolve(null);
                  return kose.then(function (eklendi) {
                      uyar('Ödeme kaydedildi ✅' + (gitti ? '\nTeşekkür mesajı öğretmenin Mesajlar kutusuna yazıldı.' : '\nTeşekkür mesajı yazılamadı (mesaj kutusu izni).') +
                           (eklendi === true ? '\nDestekçiler köşesine eklendi: ' + kisaAd(bilgi.ad) + '.' : eklendi === false ? '\nDestekçiler köşesine eklenemedi.' : ''));
                      sonrasi();
                  });
              });
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
        else if (is === 'ayar-art') ayarArt(+t.getAttribute('data-art') || 0);
        else if (is === 'pay-yenile') payYenile();
        else if (is === 'kose-sil') {
            sor(t.getAttribute('data-ad') + ' destekçiler köşesinden kaldırılsın mı?').then(function (evet) {
                if (!evet) return;
                return destekciSil(+t.getAttribute('data-t'), t.getAttribute('data-ad')).then(function () { ayarCiz(); seritCiz(); });
            }).catch(function (e) { uyar('Kaldırılamadı: ' + hataYaz(e)); });
        }
        else if (is === 'ac') {
            if (typeof window.adminOgretmenDetay === 'function') window.adminOgretmenDetay(t.getAttribute('data-uid'), 'ucret');
        }
    });
    /* aylık toplam yazılırken kişi başı karşılığı */
    document.addEventListener('input', function (e) {
        var t = e.target;
        if (!t || t.id !== 'dstAyToplam') return;
        t.__dstDegisti = true;
        onizle();
    });
    /* elle ödeme: seçim yapılınca tutarı doldur (22.10.2026: ay yerine dönem) */
    document.addEventListener('change', function (e) {
        var t = e.target;
        if (!t || !t.classList || !t.classList.contains('dst-f-sec')) return;
        var form = t.closest('.dst-y-form');
        var kutu = _acik && _acik.kutu;
        var T = (kutu && kutu.__dstSecTutar) || {};
        if (form && T[t.value] > 0) form.querySelector('.dst-f-tutar').value = T[t.value];
    });

    /* ------------------------------------------------------------------
       DIŞA AÇILANLAR
       ------------------------------------------------------------------ */
    window.KidefDestek = {
        /* hesap (test ve diğer modüller için) */
        aylikHesapla: aylikHesapla, hesapla: hesapla, ozetDuzen: ozetDuzen,
        kayitTarihi: kayitTarihi, aktifMi: aktifMi, onayliMi: onayliMi,
        /* 22.10.2026: dönem */
        donemBul: donemBul, donemPayHesapla: donemPayHesapla, kisiPay: kisiPay, dagit: dagit,
        odemeListesi: odemeListesi, payYenile: payYenile,
        /* öğretmen */
        odemeAc: odemeAc, oner: oner, profilKontrol: profilKontrol, tazele: kartTazele,
        /* yönetici */
        listeGeldi: listeGeldi, ozetYayinla: ozetYayinla, ayarCiz: ayarCiz, sayimYap: sayimYap,
        seritCiz: seritCiz, kisaAd: kisaAd, destekciEkle: destekciEkle, destekciSil: destekciSil,
        rozetleriYenile: rozetleriYenile, bekleyenCiz: bekleyenCiz, yoneticiBolum: yoneticiBolum,
        onayla: onayla, reddet: reddet
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', gozlemciKur);
    else gozlemciKur();
})();
