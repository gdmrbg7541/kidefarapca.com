/* ==================================================================
   KAYIT ANKETİ / ROL KAPISI — kidefarapca.com
   ------------------------------------------------------------------
   NİYE VAR: giriş penceresi açılınca en üstte "Öğrenci | Öğretmen"
   sekmesi duruyordu ve öntanımlı olarak ÖĞRENCİ seçiliydi. Öğretmenler
   sekmeyi fark etmeden kayıt oluyor, sonra kendilerini öğrenci hesabıyla
   buluyordu. Artık sekme kayıt/giriş formunun içinde değil: pencere
   açılınca ÖNCE bir kapı çıkıyor —

     1) "Öğretmen misin, öğrenci misin?"   (giriş ve kayıtta)
     2) Kayıt ise + 4 soru, hazır cevap seçenekleriyle (zorunlu)

   Kapı geçilmeden e-posta/şifre alanları GÖRÜNMEZ. Böylece rol bir
   "fark edilmeyen sekme" değil, cevaplanması gereken bir soru.

   Cevaplar kullanicilar/{uid} belgesine `anket` alanı olarak yazılır
   (hesap/kayitalani.js → K.belge buradan okur) ve yönetici panelinde
   "📋 Kayıt Anketi" bölümünde görünür.

   Bu dosya kendi başına yeter: stilini kendi yazar, sitedeki hiçbir
   fonksiyonun içine dokunmaz — yalnız showLoginModal, moduDegistir,
   authIslemi ve renderAdminPanel'i sarar.
   ================================================================== */
(function () {
    'use strict';
    if (window.KidefAnket) return;

    var TASLAK = 'ka_taslak';          /* yarım kalan cevaplar */

    /* ---------------- sorular ---------------- */
    var SORULAR = {
        teacher: [
            { id: 'kurum', s: 'Nerede görev yapıyorsun?', c: [
                ['iho', 'İmam Hatip Ortaokulu', '🕌'],
                ['aihl', 'Anadolu İmam Hatip Lisesi', '🏫'],
                ['diger-okul', 'Diğer ortaokul / lise', '🏛️'],
                ['kurankursu', 'Kur\'an Kursu', '📖'],
                ['ozel', 'Özel okul / kurs', '⭐'],
                ['universite', 'Üniversite', '🎓'],
                ['serbest', 'Serbest / özel ders', '🧑‍🏫']
            ] },
            { id: 'sinif', s: 'Hangi sınıflara giriyorsun?', c: [
                ['5-8', '5 – 8. sınıf (ortaokul)', '🔢'],
                ['9-12', '9 – 12. sınıf (lise)', '🔟'],
                ['yetiskin', 'Yetişkin', '🧑'],
                ['karma', 'Karma / hepsi', '🔀']
            ] },
            { id: 'amac', s: 'Siteyi en çok ne için kullanacaksın?', c: [
                ['sinav', 'Sınav ve soru hazırlama', '📝'],
                ['tahta', 'Tahtada ders materyali', '📽️'],
                ['takip', 'Öğrenci takibi / sınıf listeleri', '📋'],
                ['kelime', 'Kelime ve sözlük çalışması', '🔤'],
                ['hepsi', 'Hepsi', '✨']
            ] },
            { id: 'kaynak', s: 'Bizi nereden duydun?', c: [
                ['meslektas', 'Meslektaşım söyledi', '🤝'],
                ['sosyal', 'Sosyal medya', '📱'],
                ['arama', 'Arama motoru', '🔍'],
                ['seminer', 'Seminer / kurs', '🎤'],
                ['diger', 'Diğer', '💬']
            ] }
        ],
        student: [
            { id: 'sinif', s: 'Kaçıncı sınıftasın?', c: [
                ['5-8', '5 – 8. sınıf', '🔢'],
                ['9-12', '9 – 12. sınıf', '🔟'],
                ['universite', 'Üniversite', '🎓'],
                ['yetiskin', 'Yetişkin / kendi kendime', '🧑']
            ] },
            { id: 'seviye', s: 'Arapça seviyen ne durumda?', c: [
                ['yeni', 'Yeni başladım', '🌱'],
                ['harf', 'Harfleri okuyorum', '🔤'],
                ['orta', 'Orta', '📗'],
                ['iyi', 'İyi', '🏅']
            ] },
            { id: 'amac', s: 'Ne için kullanacaksın?', c: [
                ['okul', 'Okul dersi', '🏫'],
                ['sinav', 'Sınava hazırlık', '📝'],
                ['kuran', 'Kur\'an okuma', '📖'],
                ['merak', 'Kendi merakım', '💡']
            ] },
            { id: 'kaynak', s: 'Bizi nereden duydun?', c: [
                ['ogretmen', 'Öğretmenim söyledi', '🧑‍🏫'],
                ['arkadas', 'Arkadaşım', '🤝'],
                ['sosyal', 'Sosyal medya', '📱'],
                ['arama', 'Arama motoru', '🔍'],
                ['diger', 'Diğer', '💬']
            ] }
        ]
    };

    /* ---------------- durum ---------------- */
    var rol = '';           /* 'teacher' | 'student' — YALNIZ kayıtta sorulur */
    var cevap = {};         /* {kurum:'iho', ...} */
    var asama = 'kip';      /* 'kip' = giriş mi kayıt mı · 'rol' · 'soru' */
    var adim = 1;           /* 'soru' aşamasında kaçıncı soru (1..4) */
    var kapi = null;
    var icGecis = false;    /* moduDegistir'i biz çağırdıysak sarmalayıcı karışmasın */

    try {
        var t = JSON.parse(localStorage.getItem(TASLAK) || '{}');
        if (t && t.rol) { rol = t.rol; cevap = t.cevap || {}; }
    } catch (e) { }

    function taslakYaz() {
        try { localStorage.setItem(TASLAK, JSON.stringify({ rol: rol, cevap: cevap })); } catch (e) { }
    }
    function esc(t) {
        return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* Kayıt kipinde miyiz? auth.js'teki isLoginMode değişkenine bağlanmak
       yerine düğmenin yazısına bakıyoruz — o değişken yerel olabilir. */
    function kayitKipi() {
        var b = document.getElementById('auth-action-btn');
        return !!(b && /Kay/i.test(b.innerText || ''));
    }
    function tamam() {
        if (!rol) return false;
        var L = SORULAR[rol] || [];
        for (var i = 0; i < L.length; i++) if (!cevap[L[i].id]) return false;
        return true;
    }

    /* ---------------- stil ---------------- */
    function stilKur() {
        if (document.getElementById('kaStil')) return;
        var st = document.createElement('style');
        st.id = 'kaStil';
        st.textContent = [
            /* Kapı açıkken pencerenin öbür alanları KAPALI. Satır içi
               display yetmiyor: hesap/qrgiris.js pencere açılınca 30 ms
               sonra karekod seçim ekranını kendi gösteriyor. Sınıf +
               !important onun üstünde kalır. */
            '#login-modal.ka-kapali #qr-modal-alan,',
            '#login-modal.ka-kapali #giris-form-alani{display:none !important}',
            /* Tanıtım kartları (KidefTanitim) rol adımında kapının İÇİNE
               taşınıyor; orada görünür kalsın diye kural yalnız pencerenin
               doğrudan çocuğunu gizliyor. */
            '#login-modal.ka-kapali > .modal-content > #kdtGirisKartlar{display:none !important}',
            '.ka-tanit{margin-top:20px;padding-top:16px;border-top:1px solid #EEF2F7}',
            '.ka-tanit > p{font-size:.82rem;font-weight:700;color:#8A94A3;margin:0 0 10px}',
            '.ka-tanit .kdt-kartlar{margin-bottom:0}',
            '#ka-kapi{animation:kaGel .2s ease both}',
            '@keyframes kaGel{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
            '.ka-ust{font-size:1.05rem;font-weight:800;color:#1F2430;margin:0 0 4px;line-height:1.35}',
            '.ka-alt{font-size:.86rem;color:#7A8698;margin:0 0 16px;line-height:1.5}',
            '.ka-sec{display:flex;flex-direction:column;gap:9px}',
            '.ka-sec button{display:flex;align-items:center;gap:11px;width:100%;box-sizing:border-box;',
            'text-align:start;background:#fff;border:2px solid #E9EEF5;border-radius:13px;padding:13px 15px;',
            'cursor:pointer;font:inherit;font-size:.97rem;font-weight:600;color:#2C3E50;transition:.15s}',
            '.ka-sec button:hover{border-color:#16A085;background:#F4FBF9;transform:translateY(-1px)}',
            '.ka-sec button.sec{border-color:#16A085;background:#E8F6F3}',
            '.ka-sec button .ka-em{font-size:1.25rem;line-height:1;flex-shrink:0}',
            /* rol kartları — iri, karıştırılamaz */
            '.ka-rol{display:flex;gap:12px;flex-wrap:wrap}',
            '.ka-rol button{flex:1 1 150px;display:flex;flex-direction:column;align-items:center;gap:8px;',
            'background:#fff;border:2px solid #E9EEF5;border-radius:18px;padding:22px 14px;cursor:pointer;',
            'font:inherit;font-weight:800;font-size:1.05rem;color:#2C3E50;transition:.18s}',
            '.ka-rol button:hover{border-color:#16A085;background:#F4FBF9;transform:translateY(-2px);',
            'box-shadow:0 8px 20px rgba(22,160,133,.16)}',
            '.ka-rol button small{display:block;font-weight:500;font-size:.8rem;color:#7A8698;line-height:1.45}',
            '.ka-rol .ka-ikon{font-size:2.5rem;line-height:1}',
            /* ilerleme */
            '.ka-ilerle{display:flex;align-items:center;gap:6px;margin:16px 0 0}',
            '.ka-nokta{flex:1;height:5px;border-radius:99px;background:#E9EEF5;transition:.25s}',
            '.ka-nokta.dolu{background:#16A085}',
            '.ka-tus{display:flex;gap:10px;align-items:center;margin-top:14px}',
            '.ka-geri{background:none;border:0;color:#8A94A3;font:inherit;font-size:.86rem;cursor:pointer;',
            'text-decoration:underline;padding:6px 0}',
            '.ka-geri:hover{color:#425061}',
            '.ka-say{margin-inline-start:auto;font-size:.8rem;color:#A6B0BE;font-weight:700}',
            /* form üstündeki rol şeridi */
            '#ka-serit{display:flex;align-items:center;gap:10px;background:#E8F6F3;border:1px solid #BFE7DE;',
            'border-radius:13px;padding:11px 14px;margin-bottom:16px;font-size:.92rem;color:#14705F;font-weight:700}',
            '#ka-serit .ka-em{font-size:1.3rem;line-height:1}',
            '#ka-serit button{margin-inline-start:auto;background:#fff;border:1px solid #BFE7DE;border-radius:9px;',
            'color:#16A085;font:inherit;font-size:.82rem;font-weight:700;padding:6px 11px;cursor:pointer}',
            '#ka-serit button:hover{background:#16A085;color:#fff}',
            /* yönetici listesi */
            '.ka-y-ozet{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}',
            '.ka-y-rozet{background:#F0F4F8;border-radius:9px;padding:7px 11px;font-size:.84rem;color:#425061}',
            '.ka-y-rozet b{color:#16A085}',
            '.ka-y-sat{border:1px solid #E9EEF5;border-radius:11px;padding:11px 13px;margin-bottom:8px;background:#fff}',
            '.ka-y-bas{display:flex;align-items:center;gap:8px;font-weight:700;color:#2C3E50;font-size:.93rem}',
            '.ka-y-bas span.ka-rz{font-size:.74rem;font-weight:800;padding:3px 8px;border-radius:7px;',
            'background:#E8F6F3;color:#14705F;text-transform:uppercase;letter-spacing:.3px}',
            '.ka-y-bas span.ka-rz.ogr{background:#FEF3E2;color:#B06B00}',
            '.ka-y-cev{margin:7px 0 0;font-size:.85rem;color:#5A6676;line-height:1.7}',
            '.ka-y-cev i{color:#8A94A3;font-style:normal}',
            '.ka-y-suz{display:flex;gap:8px;margin:0 0 12px;flex-wrap:wrap}',
            '.ka-y-suz button{background:#fff;border:1px solid #E9EEF5;border-radius:9px;padding:7px 13px;',
            'font:inherit;font-size:.85rem;font-weight:700;color:#5A6676;cursor:pointer}',
            '.ka-y-suz button.sec{background:#16A085;border-color:#16A085;color:#fff}'
        ].join('');
        document.head.appendChild(st);
    }

    /* ---------------- kapı ---------------- */
    function alanlar() {
        return {
            form: document.getElementById('giris-form-alani'),
            qr: document.getElementById('qr-modal-alan'),
            kart: document.getElementById('kdtGirisKartlar'),
            baslik: document.getElementById('auth-title')
        };
    }

    function kapiAc(baslangic) {
        var m = document.getElementById('login-modal');
        if (!m) return;
        stilKur();
        m.classList.add('ka-kapali');
        var a = alanlar();

        if (!kapi) {
            kapi = document.createElement('div');
            kapi.id = 'ka-kapi';
            var kutu = m.querySelector('.modal-content');
            if (!kutu) return;
            kutu.insertBefore(kapi, a.form || null);
        }
        kapi.style.display = 'block';
        if (baslangic) asama = baslangic;
        if (asama === 'soru' && !rol) asama = 'rol';
        ciz();
    }

    function kapiKapat() {
        var m = document.getElementById('login-modal');
        if (m) m.classList.remove('ka-kapali');
        var a = alanlar();
        kartlariBirak();
        /* İçerik de boşaltılıyor: gizli kalan eski şık düğmeleri DOM'da
           durursa sonraki adımda yanlışlıkla tıklanabiliyor. */
        if (kapi) { kapi.style.display = 'none'; kapi.innerHTML = ''; }
        seritKur();

        /* Kayıtta doğrudan e-posta formu; girişte pencerenin kendi ilk
           görünümü (karekod seçim ekranı) geri gelsin — karekodla giriş
           yolunu kapatmıyoruz. */
        if (kayitKipi()) {
            if (typeof window.qrElleGirisAc === 'function') { try { window.qrElleGirisAc(); } catch (e) { } }
            else if (a.form) a.form.style.display = '';
        } else if (typeof window.qrSecimEkrani === 'function') {
            try { window.qrSecimEkrani(); } catch (e) { if (a.form) a.form.style.display = ''; }
        } else if (a.form) {
            a.form.style.display = '';
        }
        if (a.baslik) a.baslik.innerText = kayitKipi() ? 'Sisteme Kayıt Ol' : 'Sisteme Giriş Yap';
    }

    /* Rol sekmesi artık formda durmuyor; yerine "değiştir" tuşlu şerit. */
    function seritKur() {
        var a = alanlar();
        if (!a.form) return;
        var tb = document.getElementById('btn-teacher');
        var sekme = tb ? tb.parentNode : null;
        if (sekme) sekme.style.display = 'none';

        var s = document.getElementById('ka-serit');
        if (!s) {
            s = document.createElement('div');
            s.id = 'ka-serit';
            a.form.insertBefore(s, a.form.firstChild);
        }
        var ogretmen = (rol === 'teacher');
        s.innerHTML = '<span class="ka-em">' + (ogretmen ? '🧑‍🏫' : '🎓') + '</span>' +
            '<span>' + (ogretmen ? 'Öğretmen' : 'Öğrenci') + ' olarak kayıt oluyorsun</span>' +
            '<button type="button">Değiştir</button>';
        s.querySelector('button').onclick = function () { kapiAc('rol'); };
        /* Şerit YALNIZ kayıt formunda. Girişte öğretmen/öğrenci ayrımı yok:
           hangi rolde olduğun zaten hesabından biliniyor. */
        s.style.display = (rol && kayitKipi()) ? 'flex' : 'none';
    }

    /* Tanıtım kartları ("Öğrenci misin? / Öğretmen misin? — İçeriye bak")
       normalde pencerenin en üstünde duruyor. Rol adımında onları kapının
       içine, soruların altına alıyoruz: öğretmen seçmeden önce girince ne
       yapabileceğini görsün. Adım değişince ya da kapı kapanınca yerine
       geri konuyor — yoksa kapi.innerHTML onları silerdi. */
    var kartYuva = null;
    function kartlariGetir() {
        var k = document.getElementById('kdtGirisKartlar');
        if (!k || !kapi) return;
        if (!kartYuva) kartYuva = { eb: k.parentNode, ka: k.nextSibling };
        var kutu = kapi.querySelector('.ka-tanit');
        if (!kutu) return;
        k.style.display = '';
        kutu.appendChild(k);
    }
    function kartlariBirak() {
        var k = document.getElementById('kdtGirisKartlar');
        if (!k) return;
        /* Kartlar YALNIZ rol ekranında görünür. Giriş/kayıt formunun
           üstünde ikinci kez çıkmasınlar — aynı iki kart iki yerde
           duruyordu. */
        k.style.display = 'none';
        if (!kartYuva || !kapi || !kapi.contains(k)) return;
        try { kartYuva.eb.insertBefore(k, kartYuva.ka); } catch (e) { kartYuva.eb.appendChild(k); }
    }

    function ciz() {
        if (!kapi) return;
        kartlariBirak();
        var a = alanlar();

        /* ---- 1. ekran: GİRİŞ Mİ, KAYIT MI? ------------------------------
           Girişte öğretmen/öğrenci sorusu YOK — rol zaten hesapta yazılı.
           Rol sorusu yalnız yeni kayıtta anlamlı; asıl dert de buydu. */
        if (asama === 'kip') {
            if (a.baslik) a.baslik.innerText = 'Hoş geldin';
            kapi.innerHTML =
                '<p class="ka-ust">Hesabın var mı?</p>' +
                '<p class="ka-alt">Girişte öğretmen/öğrenci seçmene gerek yok; ' +
                'hesabın hangisiyse onunla açılır.</p>' +
                '<div class="ka-rol">' +
                '<button type="button" data-k="giris"><span class="ka-ikon">🔑</span>Giriş yap' +
                '<small>Hesabım var;<br>e-posta ya da karekodla gireyim</small></button>' +
                '<button type="button" data-k="kayit"><span class="ka-ikon">✨</span>Kayıt ol' +
                '<small>İlk kez geliyorum;<br>yeni hesap açayım</small></button>' +
                '</div>' +
                '<div class="ka-tanit"><p>Girince neler yapabileceğine bak:</p></div>';
            [].forEach.call(kapi.querySelectorAll('.ka-rol button'), function (b) {
                b.onclick = function () { kipSec(b.getAttribute('data-k')); };
            });
            kartlariGetir();
            return;
        }

        /* ---- 2. ekran: ROL (yalnız kayıt) ------------------------------ */
        if (asama === 'rol') {
            if (a.baslik) a.baslik.innerText = 'Kayıt — önce seni tanıyalım';
            kapi.innerHTML =
                '<p class="ka-ust">Öğretmen olarak mı, öğrenci olarak mı kayıt oluyorsun?</p>' +
                '<p class="ka-alt">Hesabın buna göre açılıyor; sonradan değiştirmek için ' +
                'yöneticiye yazman gerekir. Lütfen doğru olanı seç.</p>' +
                '<div class="ka-rol">' +
                '<button type="button" data-r="teacher"><span class="ka-ikon">🧑‍🏫</span>Öğretmenim' +
                '<small>Sınıfım var; sınav hazırlarım,<br>öğrenci takibi yaparım</small></button>' +
                '<button type="button" data-r="student"><span class="ka-ikon">🎓</span>Öğrenciyim' +
                '<small>Arapça öğreniyorum;<br>ders ve alıştırma yaparım</small></button>' +
                '</div>' +
                '<div class="ka-tus"><button type="button" class="ka-geri">‹ Geri</button></div>' +
                '<div class="ka-tanit"><p>Emin değil misin? Girince neler yapabileceğine bak:</p></div>';
            [].forEach.call(kapi.querySelectorAll('.ka-rol button'), function (b) {
                b.onclick = function () { rolSec(b.getAttribute('data-r')); };
            });
            kapi.querySelector('.ka-geri').onclick = function () { asama = 'kip'; ciz(); };
            kartlariGetir();
            return;
        }

        /* ---- 3. ekran: ANKET SORULARI ---------------------------------- */
        var L = SORULAR[rol] || [];
        var q = L[adim - 1];
        if (!q) { kapiKapat(); return; }
        if (a.baslik) a.baslik.innerText = 'Kayıt — birkaç kısa soru';

        var h = '<p class="ka-ust">' + esc(q.s) + '</p>' +
            '<p class="ka-alt">Sana uygun olanı seç. ' +
            (rol === 'teacher' ? 'Öğretmen' : 'Öğrenci') + ' hesabı açılıyor.</p><div class="ka-sec">';
        q.c.forEach(function (o) {
            h += '<button type="button" data-k="' + esc(o[0]) + '"' +
                (cevap[q.id] === o[0] ? ' class="sec"' : '') + '>' +
                '<span class="ka-em">' + o[2] + '</span><span>' + esc(o[1]) + '</span></button>';
        });
        h += '</div><div class="ka-ilerle">';
        for (var i = 1; i <= L.length; i++) h += '<span class="ka-nokta' + (i <= adim ? ' dolu' : '') + '"></span>';
        h += '</div><div class="ka-tus"><button type="button" class="ka-geri">‹ Geri</button>' +
            '<span class="ka-say">' + adim + ' / ' + L.length + '</span></div>';
        kapi.innerHTML = h;

        [].forEach.call(kapi.querySelectorAll('.ka-sec button'), function (b) {
            b.onclick = function () {
                cevap[q.id] = b.getAttribute('data-k');
                taslakYaz();
                if (adim >= L.length) kapiKapat(); else { adim++; ciz(); }
            };
        });
        kapi.querySelector('.ka-geri').onclick = function () {
            if (adim > 1) { adim--; ciz(); } else { asama = 'rol'; ciz(); }
        };
    }

    /* 1. ekranın seçimi. Giriş: kapı kapanır, pencerenin kendi giriş
       görünümü (karekod seçim ekranı) gelir. Kayıt: kayıt kipine geçilir
       ve rol sorulur. */
    function kipSec(k) {
        if (k === 'giris') {
            if (kayitKipi()) modDegis();
            kapiKapat();
            return;
        }
        if (!kayitKipi()) modDegis();
        if (tamam()) { kapiKapat(); return; }   /* cevaplar zaten tam */
        asama = 'rol'; adim = 1; ciz();
    }

    /* auth.js'in giriş/kayıt kipini çevirir; kendi sarmalayıcımız bu
       çağrıda devreye girmesin diye bayrak kalkıyor. */
    function modDegis() {
        if (typeof window.moduDegistir !== 'function') return;
        icGecis = true;
        try { window.moduDegistir(); } catch (e) { }
        icGecis = false;
    }

    function rolSec(r) {
        if (rol && rol !== r) cevap = {};      /* rol değişti → cevaplar sıfır */
        rol = r;
        taslakYaz();
        try { if (typeof window.setRole === 'function') window.setRole(r); } catch (e) { }
        asama = 'soru'; adim = 1; ciz();
    }

    /* ---------------- belge alanı (kayitalani.js buradan okur) -------- */
    function belgeAlani(r) {
        r = (r === 'teacher') ? 'teacher' : 'student';
        var L = SORULAR[r] || [];
        var liste = [];
        L.forEach(function (q) {
            var k = cevap[q.id];
            if (!k) return;
            var m = '';
            q.c.forEach(function (o) { if (o[0] === k) m = o[1]; });
            liste.push({ id: q.id, s: q.s, k: k, c: m });
        });
        if (!liste.length) return null;
        return { rol: r, tarih: new Date().toISOString(), cevaplar: liste };
    }

    /* ---------------- yönetici bölümü ---------------- */
    var yFiltre = 'hepsi';
    function yoneticiBolum() {
        /* Stil burada da kurulmalı: yönetici oturumu boyunca giriş
           penceresi hiç açılmayabilir, o zaman stilKur() çağrılmamış olur. */
        stilKur();
        var kok = document.getElementById('admin-section');
        if (!kok) return;
        var kart = kok.querySelector('.glass-card');
        if (!kart || document.getElementById('ka-yonetici')) return;

        var d = document.createElement('details');
        d.className = 'admin-details';
        d.id = 'ka-yonetici';
        d.setAttribute('name', 'admin-accordion');
        d.innerHTML =
            '<summary class="admin-summary">📋 Kayıt Anketi <span id="ka-y-rozet"></span></summary>' +
            '<div style="padding:10px 0;">' +
            '<p style="font-size:.86rem;color:#7f8c8d;margin:0 0 12px;">' +
            'Kayıt olurken sorulan sorulara verilen cevaplar. Rol sorusu zorunlu olduğu için ' +
            'öğretmenler artık yanlışlıkla öğrenci olarak kaydolamıyor.</p>' +
            '<div class="ka-y-suz">' +
            '<button data-f="hepsi" class="sec">Hepsi</button>' +
            '<button data-f="teacher">Öğretmenler</button>' +
            '<button data-f="student">Öğrenciler</button>' +
            '<button data-f="yenile" style="margin-inline-start:auto;">🔄 Yenile</button>' +
            '</div><div id="ka-y-liste">Bölümü açınca yüklenir…</div></div>';
        kart.appendChild(d);

        d.addEventListener('toggle', function () { if (d.open) yYukle(); });
        [].forEach.call(d.querySelectorAll('.ka-y-suz button'), function (b) {
            b.onclick = function () {
                var f = b.getAttribute('data-f');
                if (f === 'yenile') { yYukle(true); return; }
                yFiltre = f;
                [].forEach.call(d.querySelectorAll('.ka-y-suz button'), function (x) {
                    if (x.getAttribute('data-f') !== 'yenile') x.classList.toggle('sec', x === b);
                });
                yCiz();
            };
        });
    }

    var yVeri = null;
    function yYukle(zorla) {
        var el = document.getElementById('ka-y-liste');
        if (!el) return;
        if (yVeri && !zorla) { yCiz(); return; }
        /* hesap/auth.js'te `let db` — window'a yazılmıyor; bu yüzden
           window.db'ye bakmak yanlış sonuç veriyor. Önce çıplak db,
           olmazsa firestore(). */
        var _db = null;
        try { if (typeof db !== 'undefined' && db) _db = db; } catch (e) { }
        if (!_db) { try { _db = window.db || firebase.firestore(); } catch (e) { } }
        if (!_db) {
            el.innerHTML = '<p style="color:#8A94A3;">Bağlantı yok; liste alınamadı.</p>';
            return;
        }
        el.innerHTML = 'Yükleniyor…';
        _db.collection('kullanicilar').get().then(function (snap) {
            yVeri = [];
            snap.forEach(function (doc) {
                var v = doc.data() || {};
                if (!v.anket) return;
                yVeri.push({
                    ad: v.name || '', email: v.email || doc.id,
                    rol: (v.anket.rol || v.role || 'student'), anket: v.anket
                });
            });
            yVeri.sort(function (a, b) {
                return String(b.anket.tarih || '').localeCompare(String(a.anket.tarih || ''));
            });
            yCiz();
        }).catch(function (e) {
            el.innerHTML = '<p style="color:#EF5350;">Liste alınamadı: ' + esc(e.message) + '</p>';
        });
    }

    function yCiz() {
        var el = document.getElementById('ka-y-liste');
        if (!el) return;
        var hepsi = yVeri || [];
        var rz = document.getElementById('ka-y-rozet');
        if (rz) rz.textContent = hepsi.length ? '(' + hepsi.length + ')' : '';

        var L = hepsi.filter(function (k) { return yFiltre === 'hepsi' || k.rol === yFiltre; });
        if (!L.length) {
            el.innerHTML = '<p style="color:#8A94A3;">Bu süzgeçte cevap yok. ' +
                '(Anket 27.09.2026\'da eklendi; daha önce kayıt olanlarda cevap bulunmaz.)</p>';
            return;
        }

        /* özet: her sorunun en çok verilen cevapları */
        var say = {};
        L.forEach(function (k) {
            (k.anket.cevaplar || []).forEach(function (c) {
                var a = k.rol + '|' + c.s + '|' + c.c;
                say[a] = (say[a] || 0) + 1;
            });
        });
        var ozet = Object.keys(say).sort(function (a, b) { return say[b] - say[a]; }).slice(0, 6);
        var h = '<div class="ka-y-ozet">';
        h += '<span class="ka-y-rozet">Toplam <b>' + L.length + '</b> cevap</span>';
        ozet.forEach(function (a) {
            var p = a.split('|');
            h += '<span class="ka-y-rozet">' + esc(p[2]) + ' <b>' + say[a] + '</b></span>';
        });
        h += '</div>';

        L.forEach(function (k) {
            var ogretmen = (k.rol === 'teacher');
            var tar = '';
            try { tar = new Date(k.anket.tarih).toLocaleDateString('tr-TR'); } catch (e) { }
            h += '<div class="ka-y-sat"><div class="ka-y-bas">' +
                '<span class="ka-rz' + (ogretmen ? '' : ' ogr') + '">' +
                (ogretmen ? 'Öğretmen' : 'Öğrenci') + '</span>' +
                '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
                esc(k.ad || k.email) + '</span>' +
                '<span style="font-size:.78rem;color:#A6B0BE;font-weight:600;">' + esc(tar) + '</span></div>' +
                '<p class="ka-y-cev">';
            (k.anket.cevaplar || []).forEach(function (c) {
                h += '<i>' + esc(c.s) + '</i> → <b>' + esc(c.c) + '</b><br>';
            });
            h += '</p></div>';
        });
        el.innerHTML = h;
    }

    /* ---------------- var olan işlevleri sar ---------------- */
    function sar() {
        if (typeof window.showLoginModal === 'function' && !window.showLoginModal.__ka) {
            var eskiAc = window.showLoginModal;
            var yeniAc = function () {
                var r = eskiAc.apply(this, arguments);
                /* Pencere her açıldığında ilk ekran: giriş mi, kayıt mı? */
                try { setTimeout(function () { kapiAc('kip'); }, 60); } catch (e) { }
                return r;
            };
            yeniAc.__ka = 1;
            window.showLoginModal = yeniAc;
        }
        if (typeof window.moduDegistir === 'function' && !window.moduDegistir.__ka) {
            var eskiMod = window.moduDegistir;
            var yeniMod = function () {
                var r = eskiMod.apply(this, arguments);
                if (icGecis) return r;          /* çeviren biziz, kapıyı bozma */
                try {
                    if (kayitKipi()) { if (!tamam()) kapiAc('rol'); }
                    else kapiKapat();
                } catch (e) { }
                return r;
            };
            yeniMod.__ka = 1;
            window.moduDegistir = yeniMod;
        }
        if (typeof window.authIslemi === 'function' && !window.authIslemi.__ka) {
            var eskiIs = window.authIslemi;
            var yeniIs = function () {
                if (kayitKipi() && !tamam()) { kapiAc(rol ? 'soru' : 'rol'); return; }
                return eskiIs.apply(this, arguments);
            };
            yeniIs.__ka = 1;
            window.authIslemi = yeniIs;
        }
        if (typeof window.closeLoginModal === 'function' && !window.closeLoginModal.__ka) {
            var eskiKap = window.closeLoginModal;
            var yeniKap = function () {
                try {
                    var m = document.getElementById('login-modal');
                    if (m) m.classList.remove('ka-kapali');
                    kartlariBirak();
                    if (kapi) { kapi.style.display = 'none'; kapi.innerHTML = ''; }
                } catch (e) { }
                return eskiKap.apply(this, arguments);
            };
            yeniKap.__ka = 1;
            window.closeLoginModal = yeniKap;
        }
        if (typeof window.renderAdminPanel === 'function' && !window.renderAdminPanel.__ka) {
            var eskiYon = window.renderAdminPanel;
            var yeniYon = function () {
                var r = eskiYon.apply(this, arguments);
                try { yoneticiBolum(); } catch (e) { }
                return r;
            };
            yeniYon.__ka = 1;
            window.renderAdminPanel = yeniYon;
        }
    }
    sar();
    window.addEventListener('load', sar);
    setTimeout(sar, 1200);
    setTimeout(sar, 3500);

    /* ---------------- dışa açılan yüz ---------------- */
    window.KidefAnket = {
        belgeAlani: belgeAlani,   /* hesap/kayitalani.js buradan okur */
        tamam: tamam,
        rol: function () { return rol; },
        cevaplar: function () { return JSON.parse(JSON.stringify(cevap)); },
        sorular: SORULAR,
        ac: function (b) { kapiAc(b); },
        temizle: function () { rol = ''; cevap = {}; try { localStorage.removeItem(TASLAK); } catch (e) { } },
        _yonetici: yoneticiBolum
    };
})();
