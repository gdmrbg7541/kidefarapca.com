/* =====================================================================
   KELİME LİSTELERİ MOTORU                (sarf/kelimeler.js)
   ---------------------------------------------------------------------
   Konu listeleri ekranının tamamı: liste kartları, Liste Modu, Çalışma
   Kartları ve Hafıza Oyunu. Eskiden kaliplartablosu.js'in içindeydi;
   ayrı sayfada (kelimeler.html) da gerektiği için buraya alındı.
   İKİ SAYFA DA AYNI DOSYAYI YÜKLER — davranış tek yerde tanımlı.

   BESLENDİĞİ YERLER DEĞİŞMEDİ
     veri/veri_sozluk.js  → kategoriTanimlari · kategoriGruplari · sozlukVerileri
     veri/veri_kokler.js  → wordEasterEggs (sözlükle birleşiyor)
     sarf/ihkelime.js     → İmam Hatip ders listeleri (yalnız ?liste=ih-…)

   SAYFA FARKI
   Kalıplar tablosunda bir kelimeye dokunmak kökü TABLOYA taşır; ayrı
   sayfada tablo yok, o yüzden kaliplartablosu.html'e kökle gidiliyor.
   Farkı `_kokAc` tek yerde tutuyor.
   ===================================================================== */

/* --- Tablo sayfasında olmayan yardımcıların yedeği --- */
if (typeof window.SoundEngine === 'undefined') {
    window.SoundEngine = { playClick: function () {}, playClose: function () {},
                           playSuccess: function () {}, playYumusak: function () {} };
}
/* Kelime kartından köke gidiş: tablo sayfasındaysa yerinde açılır,
   ayrı sayfadaysa kalıplar tablosu kökle açılıyor. */
function _kokAc(kok, kalipId) {
    if (typeof selectRootFromMenu === 'function') { selectRootFromMenu(kok, kalipId); return; }
    var u = 'kaliplartablosu.html?kok=' + encodeURIComponent(kok);
    if (kalipId) u += '&kalip=' + encodeURIComponent(kalipId);
    location.href = u;
}
/* Kök harflerini renklendiren saf işlev. Tablo sayfası kendi sürümünü
   ÖNCE tanımlıyor; orada bu blok atlanıyor, iki kopya çakışmıyor. */
if (typeof window.colorizeArabicWord !== 'function') {
window.colorizeArabicWord = function(word, root) {
    if (typeof word !== 'string' || typeof root !== 'string') return word || '';
    
    // Extract root letters as array
    let rootChars = root.replace(/[^\u0621-\u064A]/g, '').split('');
    
    // Eğer kök 3 harfli değilse standart renklendirme motorunu kullanılamaz, kelimeyi düz döndür.
    // (ColorEngine genelde 3 harfliler için optimize edilmiştir)
    if (rootChars.length !== 3) {
        // Fallback: eski basit renklendiriciyi sadece 4+ harfli kökler için koru veya düz dön
        return word; 
    }

    // Kelimenin içindeki boşlukları korumak için boşluklara göre bölelim, 
    // her kelimeyi ColorEngine ile renklendirip tekrar boşlukla birleştirelim.
    if (typeof ColorEngine !== 'undefined' && typeof ColorEngine.colorize === 'function') {
        let words = word.split(/\s+/);
        let coloredWords = words.map(w => {
            if (!w) return "";
            // Eğer kelimede hiç Arapça harf yoksa (örn: noktalama işareti), dokunma
            if (!/[\u0600-\u06FF]/.test(w)) return w;
            
            // YENİ: ColorEngine.colorize'ın gerektirdiği font-size sorunlarını aşmak için,
            // srf-word sınıfından gelebilecek sorunları önlemek adına düz HTML döndürecek bir mini sargı yapabiliriz.
            // Fakat ColorEngine.colorize zaten `<span class="srf-word" dir="rtl">...</span>` dönüyor,
            // Bu span inline-flex olduğu için kelime bazında yan yana duracaktır.
            // CSS'de srf-word içindeki font-size miras (inherit) alınır, bu sayede tablo dışındaki
            // clamp(..) vb. font-size tanımları çalışmaya devam eder!
            return ColorEngine.colorize(w, rootChars);
        });
        
        return coloredWords.join(' ');
    }
    
    return word;
};
}

/* Bu ekranın kendi küçük stilleri. Ortak sarf/kaliplartablosu.css'e
   dokunmamak için buradan enjekte ediliyor (sinifmodul.js ile aynı usul);
   böylece dosya sürümü ve önbellek tek yerden yönetiliyor. */
function klStilKur() {
    if (document.getElementById('klStil')) return;
    const s = document.createElement('style');
    s.id = 'klStil';
    s.textContent =
        /* Tam ekran düğmesi: kare, ikon ortada */
        /* min ölçü: Font Awesome bir sebeple yüklenmezse düğme yine de
           basılabilir bir kare kalsın, görünmez bir noktaya dönmesin. */
        '.kl-tamekran{padding:8px 12px;line-height:1;font-size:1rem;' +
        'min-width:40px;min-height:36px;display:inline-flex;' +
        'align-items:center;justify-content:center;}' +
        '.kl-tamekran i{pointer-events:none;}' +
        /* ---- TAM EKRANDA BAŞLIKLAR SABİT, İÇERİK KAYAR ----
           Panel bir sütun: üstte mod satırı (kaymaz), altta kayan alan.
           Eskiden panelin TAMAMI kayıyordu, uzun listede aşağı inince
           mod düğmeleri ve liste adı ekrandan çıkıyordu (Geylani).
           Sınıf yalnız Liste Modu ve Çalışma Kartları'nda takılıyor
           (initMemoryGrid); hafıza oyununun ızgara ölçüsü bozulmasın. */
        '.fullscreen-accordion.kl-sabit-baslik{overflow:hidden !important;}' +
        '.fullscreen-accordion.kl-sabit-baslik .thematic-accordion-content{' +
        'display:flex !important;flex-direction:column;flex:1 1 auto;min-height:0;}' +
        '.fullscreen-accordion.kl-sabit-baslik .memory-game-controls{' +
        'flex:0 0 auto;margin-bottom:12px !important;}' +
        '.fullscreen-accordion.kl-sabit-baslik .thematic-words-grid{' +
        'flex:1 1 auto;min-height:0;overflow-y:auto;}' +
        /* SON AÇILAN LİSTE — kapanınca hangisinden çıkıldığı belli olsun */
        '.thematic-accordion-item.kl-son{' +
        'outline:3px solid #F39C12;outline-offset:3px;' +
        'box-shadow:0 10px 24px rgba(243,156,18,.28) !important;}' +

        /* ---- SÜTUN SEÇİCİ (mod satırında) ---- */
        '.kdf-sutun{display:none;gap:4px;background:#EEF2F7;padding:4px;' +
        'border-radius:12px;direction:ltr;}' +
        '.kdf-sutun-t{display:inline-flex;align-items:center;justify-content:center;' +
        'width:38px;height:34px;padding:0;border:0;background:transparent;' +
        'cursor:pointer;color:#94A3B8;border-radius:9px;' +
        'transition:background .18s,color .18s,box-shadow .18s;}' +
        '.kdf-sutun-t svg{width:21px;height:21px;pointer-events:none;}' +
        '.kdf-sutun-t:hover{color:#C0392B;}' +
        '.kdf-sutun-t.aktif{background:#fff;color:#C0392B;box-shadow:0 2px 8px rgba(15,23,42,.14);}' +
        /* dar ekranda liste zaten tek sütun; seçici anlamsız olur */
        '@media (max-width:768px){.kdf-sutun{display:none !important;}}' +

        /* ---- ÇİZGİLİ DEFTER YAPRAĞI (muhadese ile aynı dil) ----
           Çizgiler satırların kenarlığı DEĞİL, yaprağın zemininde duran
           tekrarlı bir desen; bu yüzden --kdf-adim (satır yüksekliği) ile
           desenin adımı birebir aynı olmak zorunda, yoksa yazılar
           çizgiden kayar. İkisi tek değişkenden besleniyor. */
        '.kdf-defter{--kdf-adim:66px;--kdf-ust:24px;' +
        '--kdf-cizgi:rgba(64,124,196,.22);--kdf-kenar:rgba(199,62,58,.40);' +
        'position:relative;width:100%;max-width:1420px;margin:0 auto;' +
        'background-color:#FFFDF5;background-image:repeating-linear-gradient(to bottom,' +
        'transparent 0,transparent calc(var(--kdf-adim) - 1px),' +
        'var(--kdf-cizgi) calc(var(--kdf-adim) - 1px),var(--kdf-cizgi) var(--kdf-adim));' +
        'background-position:0 var(--kdf-ust);border:1px solid #E6DFCC;' +
        'border-radius:7px 7px 5px 5px;padding:var(--kdf-ust) 0 8px;direction:ltr;' +
        'box-shadow:0 1px 0 #F2ECDC,0 3px 0 #FFFDF5,0 4px 0 #E9E2D0,' +
        '0 6px 0 #FFFDF5,0 7px 0 #DFD8C5,0 16px 30px rgba(15,23,42,.15);}' +
        '.kdf-izgara{list-style:none;margin:0;padding:0 16px;columns:420px;' +
        'column-gap:30px;column-rule:1px solid rgba(176,166,140,.34);}' +
        /* Sütun kuralları yalnız geniş ekranda: dar ekranda liste her
           hâlükârda tek sütun kalsın, masaüstünde seçilen 3 sütun
           telefonda yapışmasın. */
        '@media (min-width:769px){' +
        '.kdf-defter.sutun-1 .kdf-izgara{columns:1;}' +
        '.kdf-defter.sutun-2 .kdf-izgara{columns:2;}' +
        '.kdf-defter.sutun-3 .kdf-izgara{columns:3;}' +
        /* TEK SÜTUNDA YAZILAR BÜYÜK, TÜRKÇE ARAPÇAYA YAKIN (Geylani).
           Tek sütunda satır boyu bir kelimeye ayrıldığı için punto
           serbest: Türkçe/Arapça oranı 2,08'den 1,7'ye indi, ikisi de
           büyüdü. Satır adımı (--kdf-adim) buna göre yükseltildi —
           Türkçe iki satıra sardığında (2×3,5rem×1,25 ≈ 140 px) hâlâ
           adımın içinde kalıyor, defter çizgisi kaymıyor. */
        '.kdf-defter.sutun-1{--kdf-adim:150px;--kdf-ust:40px;max-width:1240px;}' +
        '.kdf-defter.sutun-1 .kdf-izgara{padding:0 30px;}' +
        '.kdf-defter.sutun-1 .kdf-no{width:72px;padding-right:22px;margin-right:28px;font-size:1.75rem;}' +
        /* Punto hem yüksekliğe hem GENİŞLİĞE bakıyor: yalnız vh olsaydı
           uzun tablette (820×1180) satır ekrandan taşardı — yükseklik
           bol, genişlik dar. min() ikisinden küçüğünü alıyor. */
        '.kdf-defter.sutun-1 .kdf-tr,.kdf-defter.sutun-1 .kdf-emoji{font-size:clamp(2.15rem,min(5.8vh,5.2vw),3.5rem);}' +
        '.kdf-defter.sutun-1 .kdf-ar{font-size:clamp(3.6rem,min(10vh,9vw),6rem);}' +
        '.kdf-defter.sutun-1 .kdf-nokta{margin:0 26px;}' +
        '.kdf-defter.sutun-2{--kdf-adim:96px;--kdf-ust:28px;}' +
        '.kdf-defter.sutun-2 .kdf-no{width:52px;padding-right:15px;margin-right:19px;font-size:1.28rem;}' +
        '.kdf-defter.sutun-2 .kdf-tr,.kdf-defter.sutun-2 .kdf-emoji{font-size:clamp(1.3rem,3.3vh,2.05rem);}' +
        '.kdf-defter.sutun-2 .kdf-ar{font-size:clamp(2.5rem,6.6vh,4rem);}' +
        '.kdf-defter.sutun-2 .kdf-nokta{margin:0 16px;}}' +
        '.kdf-satir{height:var(--kdf-adim);break-inside:avoid;display:flex;' +
        'align-items:center;padding-right:6px;border-radius:3px;transition:background .15s;}' +
        /* fosforlu kalemle üstünden geçmiş gibi */
        '.kdf-satir:hover{background:rgba(250,204,21,.22);}' +
        '.kdf-no{flex:0 0 auto;width:44px;align-self:stretch;display:flex;' +
        'align-items:center;justify-content:flex-end;padding-right:12px;margin-right:15px;' +
        'border-right:2px solid var(--kdf-kenar);font-weight:600;color:#B0A78F;' +
        'font-size:clamp(.84rem,1.9vh,1.02rem);font-variant-numeric:tabular-nums;}' +
        /* Karşılık İKİ SATIRA kadar sarabiliyor: uzun Türkçe açıklamalar
           tek satıra sığmayıp "…" ile kesiliyordu. Satır yüksekliği
           (--kdf-adim) iki satırı rahat alıyor, defter çizgisi kaymıyor. */
        '.kdf-tr{flex:0 1 auto;min-width:0;text-align:left;font-weight:600;color:#4E5A66;' +
        'font-size:clamp(1rem,2.45vh,1.4rem);line-height:1.25;' +
        'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;' +
        /* "1.000.000.000" gibi bölünmeyen tek parça yazılar kutuya
           sığmayıp yandan kesiliyordu; sığmıyorsa bölünsün. */
        'overflow-wrap:break-word;overflow:hidden;}' +
        /* Emoji karşılığın BAŞINDA ve onunla AYNI puntoda (Geylani) */
        '.kdf-emoji{flex:0 0 auto;margin-right:9px;line-height:1;' +
        'font-size:clamp(1rem,2.45vh,1.4rem);}' +
        '.kdf-tr::first-letter{text-transform:uppercase;}' +
        /* min-width:0 → satır darsa önce noktalı bağ yerinden verir,
           karşılığın kırpılması en son çare olsun */
        '.kdf-nokta{flex:1 1 auto;min-width:0;height:0;align-self:center;' +
        'margin:0 12px;position:relative;top:3px;' +
        'border-bottom:2px dotted rgba(120,112,92,.34);}' +
        '.kdf-ar{flex:0 0 auto;direction:rtl;text-align:right;' +
        'font-family:"Arakom","Harmattan",serif;' +
        'font-size:clamp(1.75rem,4.5vh,2.7rem);line-height:1.3;color:#1E2A38;' +
        'font-synthesis:none;-webkit-font-synthesis:none;}' +
        '@media (max-width:768px){' +
        /* Telefonda satır adımı biraz yüksek: Türkçe karşılık uzun
           olduğunda tek satıra sıkışıp "Hayır / Değil (Olumsu…" diye
           kesiliyordu. İki satıra kadar sarıyor, defter çizgisi de o
           adıma göre. */
        '.kdf-defter{--kdf-adim:92px;--kdf-ust:18px;}' +
        '.kdf-tr{-webkit-line-clamp:3;}' +
        '.kdf-izgara{columns:1;padding:0 11px;}' +
        '.kdf-no{width:30px;padding-right:7px;margin-right:10px;font-size:.82rem;}' +
        '.kdf-nokta{margin:0 8px;}' +
        '.kdf-emoji{margin-right:7px;font-size:clamp(.92rem,2.1vh,1.1rem);}' +
        '.kdf-tr{font-size:clamp(.92rem,2.1vh,1.1rem);}' +
        '.kdf-ar{font-size:clamp(1.45rem,3.6vh,2rem);}}' +

        /* LİSTE MODU TAM EKRANDA TEK SÜTUN VE ORTALI. Ortak stildeki
           ".fullscreen-accordion .thematic-words-grid:not(.memory-mode)"
           kuralı üç sütun dayatıyor; liste modunda ızgarada tek bir
           "kâğıt" var, o da soldaki dar sütuna sıkışıyordu.
           Dikey ortalama `margin-block:auto` ile: kâğıt sığıyorsa
           ortalanır, taşıyorsa üstten başlar — `justify-content:center`
           taşan içerikte tepeyi kırpıyor. */
        '.fullscreen-accordion .thematic-words-grid.list-mode-grid{' +
        'display:flex !important;flex-direction:column;align-items:center;' +
        /* Ortak kural sağa 10 px boşluk koyuyor (kaydırma çubuğu payı);
           tek yana konunca yaprak 10 px sola kayıyordu. İki yana eşit. */
        'padding-left:10px;}' +
        /* Dikey ortalama `margin-block:auto` ile: yaprak sığıyorsa
           ortalanır, taşıyorsa üstten başlar. */
        '.fullscreen-accordion .kdf-defter{margin-block:auto;}' +
        /* ---- KOMPAKT AYAR ŞERİDİ + SABİT LİSTE BAŞLIĞI ----
           Panelin üstü üç sabit satır: mod düğmeleri, kipe ait ayar
           şeridi, liste başlığı. Altındaki içerik kayar. Böylece her
           kipin girişi de çıkışı da aynı yerden oluyor. */
        '.kl-serit{display:none;align-items:center;justify-content:center;' +
        'gap:10px;flex-wrap:wrap;direction:ltr;padding:10px 12px;' +
        'margin-bottom:12px;background:#fff;border:1px solid #E9EEF5;' +
        'border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.05);}' +
        '.kl-baslik{display:flex;align-items:center;justify-content:center;' +
        'gap:10px;direction:ltr;text-align:center;font-family:"Caveat",' +
        '"Comic Sans MS",cursive;font-size:2.1rem;color:#2c3e50;' +
        'padding-bottom:8px;margin-bottom:12px;' +
        'border-bottom:2px dashed #e0e0e0;}' +
        '.fullscreen-accordion.kl-sabit-baslik .kl-serit,' +
        '.fullscreen-accordion.kl-sabit-baslik .kl-baslik{flex:0 0 auto;}' +
        '@media (max-width:700px){.kl-baslik{font-size:1.5rem;' +
        'padding-bottom:6px;margin-bottom:8px;}' +
        '.kl-serit{padding:8px;gap:7px;margin-bottom:8px;}}' +
        /* TELEFONDA LİSTE YATAY TAŞIYORDU (eskiden beri).
           Akordiyon paneli ızgara gözünün içinde bir "grid item";
           gözün genişliği 1fr = minmax(auto,1fr) olduğu için panelin
           MIN-CONTENT genişliği (mod düğmeleri satırı) gözü şişirip
           paneli 401 px'lik kapta 798 px yapıyordu. Liste kâğıdı da
           onunla birlikte ekranın dışına taşıyor, iki sütun üst üste
           biniyordu. min-width:0 gözün içinde kalmasını sağlıyor;
           düğme satırı da alt satıra inebilsin diye sarmalanıyor. */
        '.thematic-accordion-panel{min-width:0;}' +
        '.memory-game-controls{flex-wrap:wrap;}' +
        /* Dar ekranda kâğıt tek sütun ve daha az iç boşluk */
        '@media (max-width:700px){' +
        '.fullscreen-accordion .kdf-defter{max-width:none;}' +
        /* Dar ekranda üç öbek alt alta: ortadaki (mod düğmeleri) tam
           genişlik alsın ki düğmeler ikişerli dizilsin, teker teker alt
           alta inmesin; sağdaki öbek (küçült düğmesi + liste adı) kendi
           satırında sağa yaslansın. Öbekler bu dosyada üretiliyor,
           sırası sabit: 1 = 1. oyuncu, 2 = mod düğmeleri, 3 = sağ. */
        '.memory-game-controls{row-gap:8px;}' +
        '.memory-game-controls>div:nth-child(2){flex:1 1 100%;}' +
        '.memory-game-controls>div:nth-child(3){flex:1 1 100%;justify-content:flex-end;}}';
    document.head.appendChild(s);
}

/* ---------------- KOMPAKT AYAR ŞERİDİ ----------------
   Mod satırı ile liste başlığı arasında duran ince kutu. Hafıza
   ayarları ve test kurulumu buraya açılır; altta liste görünmeye
   devam eder. Kip değişince şerit kapanır — tek yerden yönetiliyor
   ki her kipin çıkışı AYNI olsun (Geylani). */
function seritAc(key, ic) {
    const serit = document.getElementById(`serit-${key}`);
    if (!serit) return null;
    serit.style.display = 'flex';
    const mem = document.getElementById(`mem-settings-${key}`);
    if (mem) mem.style.display = (ic === 'mem') ? 'flex' : 'none';
    /* test kendi kutusunu basar; hafızada kalıntı kalmasın */
    const kt = serit.querySelector('.kt-serit');
    if (kt && ic !== 'test') kt.remove();
    return serit;
}
function seritKapat(key) {
    const serit = document.getElementById(`serit-${key}`);
    if (!serit) return;
    const mem = document.getElementById(`mem-settings-${key}`);
    if (mem) mem.style.display = 'none';
    const kt = serit.querySelector('.kt-serit');
    if (kt) kt.remove();
    serit.style.display = 'none';
}
window.seritAc = seritAc;
window.seritKapat = seritKapat;

/* =====================================================================
   LİSTE SÜTUNLARI
   ---------------------------------------------------------------------
   Sütun sayısı yalnız bir sınıf değiştirir (.sutun-1/2/3); asıl ölçüler
   stilde, çünkü satır yüksekliği ile defter çizgisinin adımı AYNI
   değişkenden beslenmek zorunda — yoksa yazılar çizgiden kayar.
   VARSAYILAN TEK SÜTUN (Geylani): liste açılır açılmaz kelimeler en
   büyük hâliyle gelsin. İki ve üç sütun, sağdaki seçiciden isteyen
   içindir; seçim o liste için oturum boyunca hatırlanıyor.
   ===================================================================== */
const klSutunDurum = {};
function klSutun(key) {
    const d = klSutunDurum[key];
    return (d && d.n) ? d.n : 1;
}
function klSutunKur(key, n) {
    klSutunDurum[key] = { n: (n === 2 || n === 3) ? n : 1, elle: true };
    const d = document.querySelector(`#grid-${key} .kdf-defter`);
    if (d) d.className = 'kdf-defter sutun-' + klSutun(key);
    klSutunIsaretle(key);
    klSatirSigdir(key);
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
}
window.klSutunKur = klSutunKur;
/* Liste çizildikten / panel açıldıktan sonra çağrılıyor: seçili sütun
   sayısını uygular, düğmeyi işaretler ve uzun karşılıkları sığdırır.
   Eskiden burada üçten başlayıp kırpılma bitene kadar inen bir otomatik
   seçim vardı; artık varsayılan TEK SÜTUN, o yüzden tahmine gerek yok —
   seçim ya kullanıcının ya da varsayılan. */
function klOtoSutun(key) {
    const d = document.querySelector(`#grid-${key} .kdf-defter`);
    if (!d) return;
    d.className = 'kdf-defter sutun-' + klSutun(key);
    klSutunIsaretle(key);
    /* Panel kapalıyken (display:none) ölçü alınamaz; açılışta yeniden
       çağrılıyor. Telefon da dâhil her durumda sığdırma çalışsın. */
    if (d.clientWidth < 220) return;
    klSatirSigdir(key);
}
/* Birkaç karşılık iki satıra bile sığmıyor (uzun parantezli açıklamalar).
   O SATIRIN puntosu kademeli küçültülüyor — bütün liste küçülmesin diye
   yalnız o satır. Üç incelik:
     • Emoji, karşılıkla AYNI puntoda kalmalı (Geylani), bu yüzden onunla
       birlikte küçülüyor.
     • Satırdaki genişliği asıl yiyen Arapça; `flex:0 0 auto` olduğu için
       hiç kısılmıyor ve bütün açığı karşılık kapatıyordu. Karşılık dibe
       vurmaya başlayınca Arapça da — daha yavaş, en fazla %28 —
       küçülüp yer açıyor. Tek sütunda punto büyüdüğü için bu şart oldu.
     • Ölçü: `-webkit-box` kutusu iki satır sığsa bile scrollHeight'i
       birkaç piksel fazla bildiriyor; eşik "yarım satırdan çok".        */
function klSatirSigdir(key) {
    const d = document.querySelector(`#grid-${key} .kdf-defter`);
    if (!d) return;
    [].slice.call(d.querySelectorAll('.kdf-satir')).forEach(function (satir) {
        const t = satir.querySelector('.kdf-tr');
        if (!t) return;
        const e = satir.querySelector('.kdf-emoji');
        const a = satir.querySelector('.kdf-ar');
        t.style.fontSize = ''; if (e) e.style.fontSize = ''; if (a) a.style.fontSize = '';
        t.style.removeProperty('-webkit-line-clamp');
        const tBas = parseFloat(getComputedStyle(t).fontSize) || 16;
        const aBas = a ? (parseFloat(getComputedStyle(a).fontSize) || 24) : 0;
        const satirY = satir.clientHeight || 0;
        /* KAÇ SATIRA SARABİLİR? Defter çizgisinin adımı sabit; karşılık
           küçüldükçe o adıma daha çok satır sığıyor. Sabit iki satır
           bırakılırsa punto dibe vursa bile metin "…" ile kesiliyordu.
           Sınır yükseklikten hesaplanıyor, böylece satır hiçbir zaman
           komşusunun üstüne taşmıyor. */
        function satirSayisi() {
            const sy = parseFloat(getComputedStyle(t).lineHeight) || 20;
            return Math.max(2, Math.floor((satirY - 6) / sy) || 2);
        }
        function tasti() {
            const sy = parseFloat(getComputedStyle(t).lineHeight) || 20;
            return t.scrollWidth > t.clientWidth + 1 ||
                   (t.scrollHeight - t.clientHeight) > sy * 0.6;
        }
        t.style.webkitLineClamp = String(satirSayisi());
        let k = 1;
        for (let i = 0; i < 10; i++) {
            if (!tasti()) break;
            k = Math.max(0.45, k * 0.9);
            t.style.fontSize = (tBas * k).toFixed(1) + 'px';
            if (e) e.style.fontSize = (tBas * k).toFixed(1) + 'px';
            if (a) a.style.fontSize = (aBas * Math.max(0.72, 1 - (1 - k) * 0.52)).toFixed(1) + 'px';
            t.style.webkitLineClamp = String(satirSayisi());
            if (k === 0.45) break;
        }
    });
}

/* =====================================================================
   ÇALIŞMA KARTLARI: KELİME UZADIKÇA PUNTO KÜÇÜLSÜN            (Geylani)
   ---------------------------------------------------------------------
   Kart yüzü sabit ölçüde, punto ise stilde sabit (4rem / 2.8rem); uzun
   Türkçe karşılıklar kartın dışına taşıyordu. Burada her yüzün BÜTÜN
   yazıları (emoji dâhil) TEK bir katsayıyla, sığana kadar ikili aramayla
   küçültülüyor — tek tek küçültülse emoji ile karşılığın oranı bozulurdu.
   Kısa kelimeler hiç küçülmez: katsayı 1'in üstüne çıkmıyor.
   İki incelik:
     • Ortak stil puntoyu `!important` ile verdiği için yazma da
       setProperty(..., 'important') olmak zorunda.
     • Taşma ölçüsü kabın scrollHeight'i ile DEĞİL, çocukların
       offsetHeight toplamıyla yapılıyor: yüz `justify-content:center`
       olduğu için taşmanın yarısı yukarı taşıyor ve scrollHeight onu
       göstermiyor. offsetHeight dönüşümden (rotateY) etkilenmez,
       getBoundingClientRect etkilenirdi.                            */
function kartYuzuSigdir(yuz) {
    const ogeler = [].slice.call(yuz.children).filter(function (o) {
        return o.nodeType === 1 && (o.textContent || '').trim() !== '';
    });
    if (!ogeler.length) return;
    /* Temel punto bir kez okunup elemanda saklanıyor: ölçmek için
       stile dönmek gerekirse inline `font-size:4rem` de silinirdi. */
    ogeler.forEach(function (o) {
        if (!o.dataset.kdfTemel) {
            o.dataset.kdfTemel = (parseFloat(getComputedStyle(o).fontSize) || 16).toFixed(2);
        }
    });
    const st = getComputedStyle(yuz);
    const icY = yuz.clientHeight - (parseFloat(st.paddingTop) || 0) - (parseFloat(st.paddingBottom) || 0);
    const icX = yuz.clientWidth - (parseFloat(st.paddingLeft) || 0) - (parseFloat(st.paddingRight) || 0);
    if (icY < 40 || icX < 40) return;      /* panel kapalıyken ölçü yok */
    function uygula(k) {
        ogeler.forEach(function (o) {
            o.style.setProperty('font-size',
                (parseFloat(o.dataset.kdfTemel) * k).toFixed(1) + 'px', 'important');
        });
    }
    function tasti() {
        let h = 0;
        for (let i = 0; i < ogeler.length; i++) {
            const o = ogeler[i], cs = getComputedStyle(o);
            h += o.offsetHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
            if (o.scrollWidth > icX + 2) return true;
        }
        return h > icY + 2;
    }
    uygula(1);
    if (!tasti()) return;                  /* kısa kelime: olduğu gibi */
    let lo = 0.28, hi = 1, iyi = 0.28;
    for (let i = 0; i < 8; i++) {
        const m = (lo + hi) / 2;
        uygula(m);
        if (tasti()) hi = m; else { iyi = m; lo = m; }
    }
    uygula(iyi);
}
function kartlariSigdir(key) {
    const grid = document.getElementById(`grid-${key}`);
    if (!grid || grid.classList.contains('memory-mode') ||
        grid.classList.contains('list-mode-grid')) return;
    [].forEach.call(grid.querySelectorAll('.memory-card-face'), kartYuzuSigdir);
}
window.kartlariSigdir = kartlariSigdir;
/* Açık paneli pencere ölçüsü değişince yeniden sığdır. */
let kdfOlcuZ = null;
window.addEventListener('resize', function () {
    clearTimeout(kdfOlcuZ);
    kdfOlcuZ = setTimeout(function () {
        [].forEach.call(document.querySelectorAll('.thematic-accordion-panel'), function (p) {
            if (p.style.display === 'none' || !p.id) return;
            const key = p.id.replace(/^content-/, '');
            kartlariSigdir(key);
            klSatirSigdir(key);
        });
    }, 160);
});

function klSutunIsaretle(key) {
    const n = klSutun(key);
    [].forEach.call(document.querySelectorAll(`#controls-${key} .kdf-sutun-t`), function (b) {
        const secili = Number(b.getAttribute('data-sutun')) === n;
        b.classList.toggle('aktif', secili);
        b.setAttribute('aria-pressed', secili ? 'true' : 'false');
    });
}
/* Seçici yalnız Liste Modu'nda görünür; öteki kiplerde anlamsız. */
function klSutunGoster(key, goster) {
    const s = document.getElementById(`sutun-sec-${key}`);
    if (s) s.style.display = goster ? 'inline-flex' : 'none';
}

/* TAM EKRANDAN ÇIKMAK = LİSTEYİ KAPATMAK (Geylani).
   Liste zaten yalnız tam ekranda açılıyor; küçültünce yarım bir görünüm
   bırakmak yerine akordiyon tamamen kapanıyor ve öteki liste başlıkları
   geri geliyor. Açık test varsa o da kapatılıyor. */
function klListeKapat(key) {
    const bas = document.getElementById(`header-${key}`);
    if (bas && bas.classList.contains('active')) { toggleThematicAccordion(bas, key); return; }
    if (window.KidefKelimeTest && KidefKelimeTest.acikMi(key)) KidefKelimeTest.kapat(key);
    const c = document.getElementById(`content-${key}`);
    if (c && c.classList.contains('fullscreen-accordion')) toggleAccordionFullscreen(key, null);
}
window.klListeKapat = klListeKapat;

function showThematicView() {
    const rootsContent = document.getElementById('roots-main-content');
    const thematicContent = document.getElementById('thematic-words-content');
    
    if (rootsContent) rootsContent.classList.add('hidden');
    if (thematicContent) {
        thematicContent.classList.remove('hidden');
        thematicContent.style.display = 'block';
        
        const rootHeader = document.querySelector('.root-header');
        if (rootHeader) rootHeader.style.display = 'flex';
        renderThematicLists();
    }
}

/* AÇIK OLAN HER ŞEYİ TOPARLA — başka bir listeye geçilirken ya da
   liste kapanırken. Tam ekran kalıntısı bırakmak, ekranı kaplayan ama
   içeriği gizli bir katman demek; açık bir test de kapatılıp o liste
   normal görünümüne döndürülüyor. */
let temaSonKaydirma = 0;      /* liste açılmadan önceki sayfa konumu */

function temaSonIsaretle(element) {
    document.querySelectorAll('.thematic-accordion-item.kl-son')
        .forEach(function (e) { e.classList.remove('kl-son'); });
    if (element) element.classList.add('kl-son');
}

function temaAcikOlanlariTopla(haricKey) {
    document.querySelectorAll('.thematic-accordion-panel').forEach(p => {
        const k = (p.id || '').replace(/^content-/, '');
        if (!k || k === haricKey) return;
        if (window.KidefKelimeTest && KidefKelimeTest.acikMi(k)) KidefKelimeTest.kapat(k);
        if (p.classList.contains('fullscreen-accordion')) {
            p.classList.remove('fullscreen-accordion');
        }
    });
    document.body.classList.remove('has-fullscreen-accordion');
}

function toggleThematicAccordion(element, key) {
    // If it's already active, close it
    if (element.classList.contains('active')) {
        element.classList.remove('active');
        const content = document.getElementById(`content-${key}`);
        if (window.KidefKelimeTest && KidefKelimeTest.acikMi(key)) KidefKelimeTest.kapat(key);
        if (content && content.classList.contains('fullscreen-accordion')) {
            toggleAccordionFullscreen(key, null);
        }
        if(content) content.style.display = 'none';
        const icon = element.querySelector('.thematic-accordion-icon');
        if(icon) icon.className = 'fas fa-chevron-down thematic-accordion-icon';
        /* Bıraktığı yere dön ve hangi listeden çıktığını göster. */
        temaSonIsaretle(element);
        requestAnimationFrame(function () { window.scrollTo(0, temaSonKaydirma); });

        // Hide the viewer container completely if nothing is active
        const viewerContainer = document.getElementById('thematic-viewer-container');
        if (viewerContainer) viewerContainer.style.display = 'none';
    } else {
        /* Sayfa konumunu SAKLA: liste tam ekran açılıyor, kapanınca
           kullanıcı bıraktığı yere dönsün — eskiden aşağı kayıyordu. */
        temaSonKaydirma = window.pageYOffset || document.documentElement.scrollTop || 0;
        // Close all headers and contents
        const allItems = document.querySelectorAll('.thematic-accordion-item');
        allItems.forEach(item => {
            item.classList.remove('active');
            const icon = item.querySelector('.thematic-accordion-icon');
            if(icon) icon.className = 'fas fa-chevron-down thematic-accordion-icon';
        });
        temaAcikOlanlariTopla(key);
        const allContents = document.querySelectorAll('.thematic-accordion-panel');
        allContents.forEach(c => c.style.display = 'none');

        // Open the clicked one
        element.classList.add('active');
        const content = document.getElementById(`content-${key}`);
        if(content) content.style.display = 'block';
        const targetIcon = element.querySelector('.thematic-accordion-icon');
        if(targetIcon) targetIcon.className = 'fas fa-chevron-up thematic-accordion-icon';

        /* LİSTEYE BASINCA TAM EKRAN AÇILIR (Geylani). Liste akordiyon
           kutusuna sıkışmasın, açılır açılmaz ekranın tamamını kullansın.
           Tam ekranda akordiyon başlığı görünmediği için hangi listede
           olunduğunu mod satırının en sağındaki küçük başlık söylüyor;
           çıkış da oradaki küçült düğmesiyle. */
        if (content && !content.classList.contains('fullscreen-accordion') &&
            typeof toggleAccordionFullscreen === 'function') {
            toggleAccordionFullscreen(key, null);
        }
        /* Sütun sayısı ve kart puntoları ancak panel görünürken
           ölçülebilir (kapalıyken clientWidth 0). */
        setTimeout(function () { klOtoSutun(key); kartlariSigdir(key); }, 60);
        temaSonIsaretle(element);

        // Optional: Show external viewer if exists
        const viewer = document.getElementById('thematic-viewer-container');
        if (viewer) {
            viewer.style.display = 'block';
            setTimeout(() => {
                viewer.scrollIntoView({behavior: 'smooth', block: 'nearest'});
            }, 50);
        } else if (!(content && content.classList.contains('fullscreen-accordion'))) {
            /* Tam ekran açıldıysa kaydırmanın anlamı yok; üstelik alttaki
               sayfayı kaydırıp kapanışta "aşağı kaymış" gibi bırakıyordu. */
            setTimeout(() => {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }, 50);
        }
    }
}
let thematicCategoriesData = (typeof kategoriTanimlari !== 'undefined') ? JSON.parse(JSON.stringify(kategoriTanimlari)) : {};
let activeMemoryGames = {};

function renderThematicLists() {
    const container = document.getElementById('thematic-accordion-container');
    if (!container) return;
    
    if (typeof sozlukVerileri === 'undefined') return;
    
    for (const key in thematicCategoriesData) {
        thematicCategoriesData[key].items = [];
    }
    const categories = thematicCategoriesData;

    
    for (const rootKey in sozlukVerileri) {
        const rootData = sozlukVerileri[rootKey];
        
        if (rootData.isDictOnly && rootData.tip) {
            let tipList = Array.isArray(rootData.tip) ? rootData.tip : [rootData.tip];
            tipList.forEach(tip => {
                let actualTip = tip;
                if (tip === "sayi" && rootKey.includes("Sıra:")) actualTip = "sirasayi";
                /* Tasgir/Tafdil birer VEZİN: kendi konu listeleri kaldırıldı.
                   kategoriTanimlari'nda yoklar; buradaki otomatik algılama
                   onları geri diriltmesin diye açıkça eleniyorlar. */
                if (actualTip === "tasgir" || actualTip === "tafdil" || actualTip === "isim") return;
                
                if (!categories[actualTip]) {
                // OTOMATİK ALGILAMA: Kullanıcı sozlukverileri.js'ye tip eklemiş ama kategoriTanimlari'na eklemeyi unutmuşsa,
                // sistem çökmesin diye otomatik olarak geçici bir liste başlığı oluşturuyoruz.
                let autoTitle = actualTip.replace(/_/g, " ");
                autoTitle = autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1);
                categories[actualTip] = { title: autoTitle, icon: "📌", items: [] };
            }
            
            if (categories[actualTip]) {
                const tekilData = rootData.tekil || rootData["1"] || rootData; 
                if (tekilData && tekilData.base) {
                    categories[actualTip].items.push({
                        rootKey: rootKey,
                        arText: tekilData.base.arText || rootKey,
                        trText: tekilData.base.trText || "",
                        emoji: tekilData.base.emoji || ""
                    });
                }
            }
            });
        } else if (rootKey.length === 3) {
            // Tıpkı 'isDictOnly' gibi, kalıpların içindeki 'tip' özelliklerini tarayarak listelere ekle
            for (const kalipNo in rootData) {
                const kData = rootData[kalipNo];
                if (kData && kData.tip) {
                    let tipList = Array.isArray(kData.tip) ? kData.tip : [kData.tip];
                    tipList.forEach(tip => {
                        /* Tasgir/Tafdil vezin, konu değil — kendi listeleri yok. */
                        if (tip === "tasgir" || tip === "tafdil" || tip === "isim") return;
                        if (!categories[tip]) {
                        let autoTitle = tip.replace(/_/g, " ");
                        autoTitle = autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1);
                        categories[tip] = { title: autoTitle, icon: "📌", items: [] };
                    }
                    if (kData.base && kData.base.arText) {
                        categories[tip].items.push({
                            rootKey: rootKey,
                            kalipId: kalipNo,
                            arText: kData.base.arText,
                            trText: kData.base.trText || "",
                            emoji: kData.base.emoji || ""
                        });
                    }
                    });
                }
            }

            /* 49 (İsm-i Tasgir) ile 50-51 (İsm-i Tafdil) kalıplarını konu
               listesine toplayan blok KALDIRILDI: ikisi de vezin, konu değil.
               Bu kelimeler tabloda ilgili kutuya dokununca zaten örnekleriyle
               listeleniyor. */
        }
    }
    
    
    // Kullanıcı talebi: Sayılar ve sıra sayıları ardışık olsun
    const numberSort = (a, b) => {
        let numA = parseInt(a.trText.replace(/\./g, '').match(/\d+/)?.[0] || 0);
        let numB = parseInt(b.trText.replace(/\./g, '').match(/\d+/)?.[0] || 0);
        return numA - numB;
    };
    if (categories["sayi"] && categories["sayi"].items) {
        categories["sayi"].items.sort(numberSort);
    }
    if (categories["sirasayi"] && categories["sirasayi"].items) {
        categories["sirasayi"].items.sort(numberSort);
    }

    thematicCategoriesData = categories;

    /* ÜST ŞERİT: sözlükte kaç kelime var? veri_sozluk.js'teki câmid girdiler
       (isDictOnly) ile köklerden listelere bağlanan kelimeler ayrı ayrı
       sayılır; toplam ikisinin toplamıdır. Öğrenci dağarcığın büyüdüğünü
       görsün diye listelerin en üstünde durur. */
    var _sozlukSayisi = 0, _kokSayisi = 0, _cogulSayisi = 0;
    try {
        for (var _k in sozlukVerileri) {
            var _v = sozlukVerileri[_k];
            if (!_v || !_v.isDictOnly) continue;
            _sozlukSayisi++;
            /* Çoğulu ayrı bir kelimedir: kitap/kitaplar iki kelime sayılır. */
            if (_v.cogul || (_v.tekil && _v.tekil.base && _v.tekil.base.cogul)) _cogulSayisi++;
        }
        var _gorulen = {};
        for (var _c in categories) {
            (categories[_c].items || []).forEach(function (it) {
                if (it.kalipId) _gorulen[it.rootKey + '/' + it.kalipId] = 1;
            });
        }
        _kokSayisi = Object.keys(_gorulen).length;
    } catch (e) {}
    var _toplamKelime = _sozlukSayisi + _cogulSayisi + _kokSayisi;
    /* İMAM HATİP DERS LİSTELERİ (sarf/ihkelime.js). Yalnız index'teki
       "Kelime Listeleri" kartından ?liste=ih-... ile gelindiğinde doluyor;
       kitap ikonuna doğrudan basıldığında hiç görünmüyor. Listeler
       buradan eklendiği için Liste Modu / Çalışma Kartları / Hafıza Oyunu
       ekranı öteki konu listeleriyle birebir aynı. Sözlük taraması
       bittikten SONRA, sayaç şeridinden ÖNCE çağrılıyor: o kip açıkken öteki listeler
       boşaltılıyor, ekranda yalnız seçilen sınıfın müfredatı kalıyor. */
    if (window.KidefIHKelime && window.KidefIHKelime.kategoriEkle) {
        try { window.KidefIHKelime.kategoriEkle(categories); } catch (e) { }
    }

    /* İMAM HATİP KİPİNDE SAYAÇ O SINIFI SAYAR. Serit sözlüğün tamamını
       özetliyor; ekranda yalnız bir sınıfın dersleri varken "948 kelime /
       37 liste" yazması yanlış oluyordu. */
    var _ihKip = (window.KidefIHKelime && window.KidefIHKelime.kip) ? window.KidefIHKelime.kip() : null;
    if (_ihKip) {
        var _ihKelime = 0, _ihListe = 0;
        for (var _ik in categories) {
            var _n = (categories[_ik].items || []).length;
            if (_n) { _ihKelime += _n; _ihListe++; }
        }
        _sozlukSayisi = _ihKelime; _cogulSayisi = 0; _kokSayisi = 0; _toplamKelime = _ihKelime;
        var _sayacSerit = '<div class="kl-sayac-serit" dir="ltr">' +
            '<span class="kls-sayi">' + _ihKelime.toLocaleString('tr-TR') + '</span>' +
            '<span class="kls-etiket">kelime</span>' +
            '<span class="kls-ayrac"></span>' +
            '<span class="kls-alt">' + _ihKip.sinif + '. Sınıf · ' + _ihListe + ' ders listesi</span></div>';
    } else
    var _sayacSerit = '<div class="kl-sayac-serit" dir="ltr">' +
        '<span class="kls-sayi">' + _toplamKelime.toLocaleString('tr-TR') + '</span>' +
        '<span class="kls-etiket">kelime</span>' +
        '<span class="kls-ayrac"></span>' +
        '<span class="kls-alt">' + _sozlukSayisi.toLocaleString('tr-TR') + ' tekil · ' +
        _cogulSayisi.toLocaleString('tr-TR') + ' çoğul · ' +
        _kokSayisi.toLocaleString('tr-TR') + ' kökten · ' +
        Object.keys(categories).filter(function (k) { return (categories[k].items || []).length; }).length +
        ' liste</span></div>';
    let html = _sayacSerit;

    
    // Kategorileri önem sırasına göre (kategoriTanimlari'ndaki tanımlanma sırasıyla) diz
    const originalKeys = typeof kategoriTanimlari !== 'undefined' ? Object.keys(kategoriTanimlari) : [];
    const sortedKeys = Object.keys(categories).filter(key => categories[key].items.length > 0).sort((a, b) => {
        let idxA = originalKeys.indexOf(a);
        let idxB = originalKeys.indexOf(b);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        return idxA - idxB;
    });

    /* ÖBEKLEME: kırktan fazla liste düz bir ızgarada alt alta dizilince
       aranan başlık gözle taranıyordu. Artık kategoriler konu öbeklerine
       ayrılıyor (veri_sozluk.js'teki `grup` alanı + kategoriGruplari);
       her öbek kendi başlığının altında, kendi üç sütunlu bloğunda durur.
       Grubu tanımsız bir liste çıkarsa en sona "Diğer" öbeğine düşer. */
    const cols = 3;
    const _gruplar = (typeof kategoriGruplari !== 'undefined') ? kategoriGruplari : null;
    const _grupAdi = (k) => ((typeof kategoriTanimlari !== 'undefined' && kategoriTanimlari[k]) ? kategoriTanimlari[k].grup : null);
    const _obekler = [];
    if (_gruplar) {
        for (const _gk in _gruplar) {
            const _uye = sortedKeys.filter(k => _grupAdi(k) === _gk);
            if (_uye.length) _obekler.push({ bilgi: _gruplar[_gk], anahtar: _uye });
        }
        const _kalan = sortedKeys.filter(k => !_gruplar[_grupAdi(k)]);
        if (_kalan.length) _obekler.push({ bilgi: { title: "Diğer", icon: "📌" }, anahtar: _kalan });
    } else {
        _obekler.push({ bilgi: null, anahtar: sortedKeys });
    }

    html = _sayacSerit;   /* sıfırlama sayacı silmesin */
    
    var colorIndex = 0;
    for (const _obek of _obekler) {
    const obekKeys = _obek.anahtar;
    const L = obekKeys.length;
    const rows = Math.ceil(L / cols);
    if (_obek.bilgi) {
        html += '<div class="ktl-obek" dir="ltr"><span class="ktl-obek-ik">' + (_obek.bilgi.icon || '') +
                '</span><span class="ktl-obek-ad">' + _obek.bilgi.title +
                '</span><span class="ktl-obek-say">' + L + ' liste</span></div>';
    }
    // Satır Satır DOM oluşturuyoruz
    for(let r = 0; r < rows; r++) {
        
    /* SİTE PALETİ — kelime listesi başlıkları.
       On renk var; satır başına ÜÇ kart düşüyor ve indeks birer birer
       artıyor. 10 ile 3 birbirini bölmediği için ne yatay komşular
       (fark 1) ne de dikey komşular (fark 3) aynı renge düşer — eski
       altı renkli dizide her sütun iki renk arasında gidip geliyor,
       liste çizgili görünüyordu. Renkler koyu uçtan seçildi ki üstteki
       BEYAZ yazı her kartta okunsun. */
    const siteColors = [
        'linear-gradient(135deg,#2ECC71 0%,#27AE60 100%)',   /* yeşil      */
        'linear-gradient(135deg,#20C997 0%,#16A085 100%)',   /* turkuaz    */
        'linear-gradient(135deg,#F39C12 0%,#E67E22 100%)',   /* turuncu    */
        'linear-gradient(135deg,#5DADE2 0%,#2980B9 100%)',   /* mavi       */
        'linear-gradient(135deg,#EF5350 0%,#E53935 100%)',   /* kırmızı    */
        'linear-gradient(135deg,#A78BFA 0%,#7C3AED 100%)',   /* mor        */
        'linear-gradient(135deg,#22B8CF 0%,#0B7285 100%)',   /* camgöbeği  */
        'linear-gradient(135deg,#EFA00B 0%,#D97706 100%)',   /* amber      */
        'linear-gradient(135deg,#5C7CFA 0%,#3B5BDB 100%)',   /* çivit      */
        'linear-gradient(135deg,#F06595 0%,#D6336C 100%)'    /* gül        */
    ];
    let rowKeys = [];

        /* SATIR SIRALI dağıtım. Eskiden sütun sıralıydı (keys[r],
           keys[r+rows], keys[r+2*rows]); liste sayısı 3'ün katı
           olmayınca bazı JS "satırları" 2 kart taşıyordu, CSS ızgarası
           ise boşluk bırakmayıp bir sonraki satırın kartını yanına
           çekiyordu. O kartın açılan panelden sonra geldiği için, komşu
           bir başlığa basılınca alt satıra düşüyordu. Satır sıralı
           dağıtımda JS satırı ile ızgara satırı birebir örtüşüyor. */
        for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            if (i < L) rowKeys.push(obekKeys[i]);
        }
        
        // 1. Bu satırın başlıkları (Sırayla 3 sütuna yerleşir)
        
        for (const key of rowKeys) {
            const cat = categories[key];
            if (!cat) continue;
            
            let shuffledList = cat.items ? [...cat.items] : [];
            shuffledList.sort(() => Math.random() - 0.5);
            activeMemoryGames[key] = {
                mode: 'list',
                scores: [0, 0],
                currentPlayer: 1,
                activeFlipped: [],
                isProcessing: false,
                matches: 0,
                shuffledItems: shuffledList,
                roundIndex: 0
            };
            
            html += `
                <div class="thematic-accordion-item site-renk" style="background: ${siteColors[colorIndex++ % siteColors.length]}; color: #fff;" onclick="toggleThematicAccordion(this, '${key}')" id="header-${key}">
                    <div class="thematic-accordion-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <i class="fas fa-chevron-down thematic-accordion-icon" id="icon-${key}"></i>
                            <h3 class="thematic-accordion-title" style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.7rem;">
                                ${cat.icon} 
                                <div style="display:flex; flex-direction:column; align-items:flex-start;">
                                    <span>${cat.title}</span>
                                    ${cat.arTitle ? `<span style="font-family:'Arakom', sans-serif; font-weight:normal; font-size:2.3rem; color:rgba(255,255,255,.92); line-height:1; margin-top:6px;">${cat.arTitle}</span>` : ''}
                                </div>
                            </h3>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // 2. Bu satırın İçerikleri (Tıklandığında tüm satırı kaplayacak şekilde başlıkların altına yerleşir)
        
        for (const key of rowKeys) {
            const cat = categories[key];
            if (!cat) continue;
            
            let pairOptions = "";
            let maxPairs = cat.items ? cat.items.length : 0;
            if (maxPairs < 6) {
                pairOptions += `<option value="${maxPairs}" selected>${maxPairs} Çift</option>`;
                pairOptions += `<option value="6" disabled>6 Çift</option>`;
            } else {
                pairOptions += `<option value="6" selected>6 Çift</option>`;
            }
            pairOptions += `<option value="8" ${maxPairs < 8 ? 'disabled' : ''}>8 Çift</option>`;
            pairOptions += `<option value="10" ${maxPairs < 10 ? 'disabled' : ''}>10 Çift</option>`;
            pairOptions += `<option value="12" ${maxPairs < 12 ? 'disabled' : ''}>12 Çift</option>`;

            html += `
                <div id="content-${key}" class="thematic-accordion-panel" style="display:none; grid-column: 1 / -1; background: #f8f9fa; border: 2px solid #5c7cfa; border-radius: 15px; padding: 20px; margin-bottom: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div class="thematic-accordion-content" style="display:block;">
                        <div class="memory-game-controls" id="controls-${key}" style="display: flex; justify-content: space-between; align-items: center; width: 100%; direction: ltr !important; margin-bottom: 30px;">
                            
                            <div style="display: flex; gap: 10px; align-items: center;">
                                
                                
                                <!-- 1. Oyuncu Kutusu -->
                                <div id="p1-box-${key}" class="player-box p-score-box active-p" style="display: none; color: #4dabf7; align-items: center;">
                                    <svg fill="#4dabf7" viewBox="0 0 24 24" width="24" height="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    <span id="s1-${key}" class="p-score" style="font-size: 1.5rem !important; font-weight: normal; margin-left: 8px;">0</span>
                                </div>
                            </div>

                            <!-- ORTA (Ayarlar veya Varsayılan Butonlar) -->
                            <div style="display: flex; gap: 10px; align-items: center; justify-content: center; flex: 1; flex-wrap: wrap;">
                                <button class="memory-btn active" id="btn-list-${key}" onclick="setMemoryMode('${key}', 'list')">Liste Modu</button>
                                <button class="memory-btn" id="btn-study-${key}" onclick="setMemoryMode('${key}', 'study')">Çalışma Kartları</button>
                                <!-- DÖRDÜNCÜ KİP: TEST. Kendi dosyasında durur
                                     (sarf/kelimetest.js + kelimetest.css); burada
                                     yalnız kapısı var. Motor yüklenmemişse düğme
                                     hiç görünmez, eski üç kip aynen çalışır. -->
                                <button class="memory-btn memory-btn-test" id="btn-test-${key}" style="display:none" onclick="KidefKelimeTest.ac('${key}')">Test Modu</button>
                                <button class="memory-btn" id="btn-mem-${key}" onclick="openMemorySetup('${key}')">Hafıza Oyunu</button>
                                
                                
                            </div>

                            <div style="display: flex; gap: 10px; align-items: center;">
                                <!-- TAM EKRAN — Liste Modu ve Çalışma Kartları için.
                                     Hafıza oyunu tam ekrana kendiliğinden geçiyordu,
                                     test de öyle; liste ve kartlar akordiyon kutusuna
                                     sıkışıp kalıyordu (Geylani). Düğme her kipte
                                     duruyor, yalnız test açıkken gizleniyor — test
                                     zaten tam ekran ve kendi ✕'i var. -->
                                <!-- 2. Oyuncu Kutusu -->
                                <div id="p2-box-${key}" class="player-box p-score-box" style="display: none; color: #ff8787; align-items: center;">
                                    <svg fill="#ff8787" viewBox="0 0 24 24" width="24" height="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    <span id="s2-${key}" class="p-score" style="font-size: 1.5rem !important; font-weight: normal; margin-left: 8px;">0</span>
                                </div>
                                <!-- SÜTUN SEÇİCİ — yalnız Liste Modu'nda görünür.
                                     Tek sütunda yazılar büyür (tahtaya yansıtmak
                                     için), üç sütunda bütün liste tek ekrana sığar.
                                     Seçim yapılmazsa sütun sayısı içeriğe göre
                                     kendiliğinden ayarlanır. -->
                                <div class="kdf-sutun" id="sutun-sec-${key}" role="group" aria-label="Sütun sayısı">
                                    <button type="button" class="kdf-sutun-t aktif" data-sutun="1" onclick="klSutunKur('${key}',1)" title="Tek sütun — büyük yazı" aria-label="Tek sütun" aria-pressed="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/></svg></button>
                                    <button type="button" class="kdf-sutun-t" data-sutun="2" onclick="klSutunKur('${key}',2)" title="İki sütun" aria-label="İki sütun" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="7.4" height="15" rx="1.8"/><rect x="13.1" y="4.5" width="7.4" height="15" rx="1.8"/></svg></button>
                                    <button type="button" class="kdf-sutun-t" data-sutun="3" onclick="klSutunKur('${key}',3)" title="Üç sütun" aria-label="Üç sütun" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="4.3" height="15" rx="1.5"/><rect x="9.85" y="4.5" width="4.3" height="15" rx="1.5"/><rect x="16.2" y="4.5" width="4.3" height="15" rx="1.5"/></svg></button>
                                </div>
                                <button class="memory-btn kl-tamekran" id="btn-fs-${key}" type="button"
                                        title="Kapat — listeden çık" aria-label="Kapat"
                                        onclick="klListeKapat('${key}')"><i class="fas fa-compress"></i></button>
                            </div>

                        </div>
                        
                        <!-- KOMPAKT AYAR ŞERİDİ — mod satırı ile liste başlığı
                             arasında. Hafıza ayarları ve test kurulumu buraya
                             açılır; liste ALTTA görünmeye devam eder, aşağı
                             kaydırılabilir (Geylani). -->
                        <div class="kl-serit" id="serit-${key}" style="display:none">
                                <div id="mem-settings-${key}" class="mem-settings" style="display: none; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
                                    <select id="pairCount-${key}" class="memory-btn" style="border: 2px solid #5c7cfa; padding: 10px; font-size: 1.2rem; height: 44px; box-sizing: border-box; font-weight: normal; background: white; color: #333;" >
                                        ${pairOptions}
                                    </select>
                                    
                                    <div class="switch-wrapper" style="display: flex; align-items: center; background: rgba(255,255,255,0.8); padding: 6px 12px; height: 44px; box-sizing: border-box; border-radius: 50px; gap: 5px; direction: ltr !important;">
                                        <span style="font-size: 1.1rem; cursor: pointer;">👤</span>
                                        <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 22px; margin: 0;">
                                            <input type="checkbox" id="mode-toggle-${key}" style="opacity:0; width:0; height:0;"  checked>
                                            <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; transition: .4s; border-radius: 34px;"></span>
                                        </label>
                                        <span style="font-size: 1.1rem; cursor: pointer;">👥</span>
                                    </div>
                                    
                                    <button id="btn-start-${key}" class="memory-btn wave-btn" style="background: #4dabf7; color: white; font-weight: normal; font-size: 1.2rem; height: 44px; box-sizing: border-box; padding: 8px 20px;" onclick="startGameAndFullscreen('${key}')">Başla</button>
                                </div>
                        </div>
                        <!-- SABİT LİSTE BAŞLIĞI — her kipte aynı yerde. Eskiden
                             başlık kâğıdın içindeydi, hafıza oyununa girip
                             çıkınca kayboluyordu. -->
                        <div class="kl-baslik" id="lbaslik-${key}">${cat.icon || ''} ${cat.title || ''}</div>
                        <div class="thematic-words-grid" id="grid-${key}"></div>
                    </div>
                </div>
            `;
        }
    }
    }   /* öbek döngüsü */
    
    container.innerHTML = html;
    klStilKur();

    /* Test motoru (sarf/kelimetest.js) yüklüyse her listenin Test Modu
       düğmesi açılır. Yüklü değilse düğme gizli kalır — sayfa eski üç
       kiple sorunsuz çalışmaya devam eder. */
    if (window.KidefKelimeTest) {
        [].forEach.call(container.querySelectorAll('.memory-btn-test'), function (b) {
            b.style.display = 'block';
        });
    }

    let viewer = document.getElementById('thematic-viewer-container');
    if(viewer) viewer.remove();
    
    for (const key in categories) {
        if (categories[key].items.length > 0) {
            initMemoryGrid(key);
        }
    }
}

/* HAFIZA AYARLARI ŞERİTTE AÇILIR. Liste kaybolmaz: ayarlar üstte
   kompakt bir kutuda durur, kelimeler altta görünmeye devam eder.
   "Başla"ya basılana kadar ızgaraya dokunulmuyor. */
function openMemorySetup(key) {
    if (window.KidefKelimeTest && KidefKelimeTest.acikMi(key)) {
        KidefKelimeTest.kapat(key, true);
        setMemoryMode(key, 'list');
    }
    /* Oyun sürerken tekrar basıldıysa önce listeye dönülür: ayarlar
       açılırken altta kelimeler görünsün. */
    if (activeMemoryGames[key] && activeMemoryGames[key].mode !== 'list') {
        setMemoryMode(key, 'list');
    }
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();

    ['btn-list-', 'btn-study-', 'btn-test-'].forEach(function (on) {
        const d = document.getElementById(on + key);
        if (d) d.classList.remove('active');
    });
    const memBtn = document.getElementById(`btn-mem-${key}`);
    if (memBtn) { memBtn.classList.add('active'); memBtn.style.display = 'block'; memBtn.style.opacity = '1'; }

    const btnStart = document.getElementById(`btn-start-${key}`);
    if (btnStart) btnStart.style.display = 'inline-block';
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = false;

    const toggle = document.getElementById(`mode-toggle-${key}`);
    if (toggle) toggle.disabled = false;
    const pairCount = document.getElementById(`pairCount-${key}`);
    if (pairCount) pairCount.disabled = false;

    seritAc(key, 'mem');
}

/* ÇIKIŞ HER KİPTE AYNI: şerit kapanır, LİSTE geri gelir (başlık
   yukarıda, kelimeler altında). Eskiden iptal edince hafıza kartları
   yeniden diziliyordu, liste görünmüyordu (Geylani). Tam ekrana
   dokunulmaz — onu yalnız mod satırındaki küçült düğmesi kapatır. */
function cancelMemorySetup(key) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClose();
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = false;
    oyunKilidi(key, false);

    const btnStart = document.getElementById(`btn-start-${key}`);
    if (btnStart) btnStart.style.display = 'inline-block';
    const toggle = document.getElementById(`mode-toggle-${key}`);
    if (toggle) toggle.disabled = false;
    const pairCount = document.getElementById(`pairCount-${key}`);
    if (pairCount) pairCount.disabled = false;

    seritKapat(key);
    setMemoryMode(key, 'list');
}

function toggleMultiplayer(key) {
    const toggle = document.getElementById(`mode-toggle-${key}`);
    if (toggle) {
        setMemoryMode(key, toggle.checked ? 'mem2' : 'mem1');
    }
}

function startMemoryGameFlow(key) {
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    const toggle = document.getElementById(`mode-toggle-${key}`);
    const isMultiplayer = toggle ? toggle.checked : true;
    const mode = isMultiplayer ? 'mem2' : 'mem1';
    
    // Set Memory Mode
    setMemoryMode(key, mode);
    initMemoryGrid(key);
}



/* MOD DÜĞMELERİ ARTIK KİLİTLENMİYOR (Geylani: "çarpıya gerek yok").
   Eskiden oyun başlayınca kilitlenip çıkış yalnız ✕ ile oluyordu; ✕
   kalktı, mod satırı her kipin tek ve aynı çıkış kapısı oldu. Başka
   bir kipe basmak = o oyundan çıkmak. İşlev duruyor ki eski çağrılar
   (startGameAndFullscreen, test) zararsızca düğmeleri açık bıraksın. */
function oyunKilidi(key, kilit) {
    ['btn-list-', 'btn-study-', 'btn-mem-', 'btn-test-'].forEach(function (on) {
        var d = document.getElementById(on + key);
        if (!d) return;
        d.disabled = false;
        d.classList.remove('memory-btn-kilitli');
        d.style.opacity = '1';
        d.title = '';
    });
}
window.oyunKilidi = oyunKilidi;

function setMemoryMode(key, mode) {
    /* Test lobisi açıkken başka bir kipe basmak testten ÇIKIŞ demektir;
       önce test kapanır (sessizce — liste kipini aşağısı zaten kuracak). */
    if (window.KidefKelimeTest && KidefKelimeTest.acikMi(key)) KidefKelimeTest.kapat(key, true);
    /* Oyun sürerken başka kipe basmak = oyundan çıkmak (bkz. oyunKilidi). */
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = false;
    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    
    let state = activeMemoryGames[key];
    
    // Hafıza oyununda kartların sığması için boşluğu azalt, çalışma kartlarında ferah bırak
    const controls = document.getElementById(`controls-${key}`);
    if (controls) {
        if (mode === 'study') {
            controls.style.marginBottom = '30px';
        } else {
            controls.style.marginBottom = '20px';
        }
    }

    state.mode = mode;
    state.scores = [0, 0];
    state.currentPlayer = 1;
    state.activeFlipped = [];
    
    const listBtn = document.getElementById(`btn-list-${key}`);
    const studyBtn = document.getElementById(`btn-study-${key}`);
    const memBtn = document.getElementById(`btn-mem-${key}`);
    const memSettings = document.getElementById(`mem-settings-${key}`);
    const toggle = document.getElementById(`mode-toggle-${key}`);
    const p1Box = document.getElementById(`p1-box-${key}`);
    const p2Box = document.getElementById(`p2-box-${key}`);
    
    if (listBtn) listBtn.classList.remove('active');
    if (studyBtn) studyBtn.classList.remove('active');
    if (memBtn) memBtn.classList.remove('active');
    
    if (listBtn) { listBtn.style.display = 'block'; listBtn.style.opacity = '1'; }
    if (studyBtn) { studyBtn.style.display = 'block'; studyBtn.style.opacity = '1'; }
    if (memBtn) { memBtn.style.display = 'block'; memBtn.style.opacity = '1'; }
    /* Test kipinden çıkılıyorsa turuncu vurgu Test Modu düğmesinde
       kalmasın. Düğmeye YALNIZ test motoru yüklüyse dokunuluyor;
       yüklü değilse düğme gizli kalmalı. */
    if (window.KidefKelimeTest) {
        const testBtn = document.getElementById(`btn-test-${key}`);
        if (testBtn) { testBtn.classList.remove('active'); testBtn.style.display = 'block'; testBtn.style.opacity = '1'; }
    }

    if (mode === 'list') {
        if (listBtn) listBtn.classList.add('active');
        seritKapat(key);
        if (p1Box) p1Box.style.display = 'none';
        if (p2Box) p2Box.style.display = 'none';
    } else if (mode === 'study') {
        if (studyBtn) studyBtn.classList.add('active');
        seritKapat(key);
        if (p1Box) p1Box.style.display = 'none';
        if (p2Box) p2Box.style.display = 'none';
    } else {
        if (memBtn) memBtn.classList.add('active');
        seritAc(key, 'mem');
        
        if (toggle) toggle.checked = (mode === 'mem2');
        if (mode === 'mem2') {
            if (p1Box) p1Box.style.display = 'flex';
            if (p2Box) p2Box.style.display = 'flex';
        } else {
            if (p1Box) p1Box.style.display = 'none';
            if (p2Box) p2Box.style.display = 'none';
        }
    }
    
    initMemoryGrid(key);
}

function initMemoryGrid(key, forceShuffle = false) {
    let state = activeMemoryGames[key];
    let cat = thematicCategoriesData[key];
    if (!cat || !cat.items) return;
    
    const grid = document.getElementById(`grid-${key}`);
    if (!grid) return;
    
    const pairCountInput = document.getElementById(`pairCount-${key}`);
    const pairCount = pairCountInput ? parseInt(pairCountInput.value) : 6;
    const isMobile = window.innerWidth <= 768;
    
    grid.innerHTML = '';
    const isStudy = state.mode === 'study';
    const isList = state.mode === 'list';
    
    klSutunGoster(key, isList);

    const lbas = document.getElementById(`lbaslik-${key}`);
    if (lbas) lbas.innerHTML = `${cat.icon || ''} ${cat.title || ''}`;

    grid.className = `thematic-words-grid ${isList ? 'list-mode-grid' : (isStudy ? '' : ('memory-mode pairs-' + pairCount))}`;

    /* "Üstte sabit başlıklar, altta kayan içerik" düzeni HER kipte
       aynı — mod satırı, ayar şeridi ve liste başlığı yerinde kalır,
       yalnız içerik kayar. */
    const kabuk = document.getElementById(`content-${key}`);
    if (kabuk) kabuk.classList.add('kl-sabit-baslik');
    
    // Fallback if state.shuffledItems is missing
    if (!state.shuffledItems) {
        state.shuffledItems = [...cat.items].sort(() => Math.random() - 0.5);
        state.roundIndex = 0;
    }
    
    let wordsCopy = [...cat.items];
    let selectedWords = (isStudy || isList) ? wordsCopy : state.shuffledItems.slice(state.roundIndex, state.roundIndex + pairCount);
    
    // If somehow we selected less than pairCount (end of array), we wrap around or reshuffle
    if (!isStudy && !isList && selectedWords.length < pairCount) {
        state.shuffledItems = [...cat.items].sort(() => Math.random() - 0.5);
        state.roundIndex = 0;
        selectedWords = state.shuffledItems.slice(state.roundIndex, state.roundIndex + pairCount);
    }
    
    let displayList = [];

    if (isStudy || isList) {
        displayList = selectedWords;
        // isStudy ise her zaman karışık başlasın, isList ise sadece Karıştır (forceShuffle) butonuna basılınca karışsın
        if (isStudy && !forceShuffle) {
            displayList.sort(() => Math.random() - 0.5);
        } else if (forceShuffle) {
            displayList.sort(() => Math.random() - 0.5);
        }
        grid.style.height = "auto";
        grid.style.gridTemplateColumns = ""; 
        grid.style.gridTemplateRows = "";
        grid.style.gridAutoRows = "";
        grid.removeAttribute('data-total');
    } else {
        selectedWords.forEach(w => {
            displayList.push({ text: w.arText, pairId: w.rootKey, lang: 'ar' });
            displayList.push({ text: w.trText, pairId: w.rootKey, lang: 'tr' });
        });
        displayList.sort(() => Math.random() - 0.5);
        
        let colCount = 4;
        let rowCount = 3;
        
        if (pairCount === 6) { colCount = 4; rowCount = 3; }
        else if (pairCount === 8) { colCount = 4; rowCount = 4; }
        else if (pairCount === 10) { colCount = 5; rowCount = 4; }
        else if (pairCount === 12) { colCount = 6; rowCount = 4; }
        
        grid.style.height = "100%"; 
        grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`; 
        grid.style.gridAutoRows = "none";
        grid.setAttribute('data-total', displayList.length);
    }

    /* ---- LİSTE MODU: ÇİZGİLİ DEFTER YAPRAĞI ----
       Tasarım muhadese.html'deki kelime listesiyle aynı dilde (Geylani):
       zeminde tekrarlı defter çizgileri, satırlar saydam; sıra
       numara · TÜRKÇE · noktalı bağ · (emoji) · ARAPÇA. Arapça en sağda
       durduğu için göz sağ sütunda tek hizada aşağı iniyor.
       Sütunlar CSS çok-sütun (columns) ile bölünüyor: kelimeler soldan
       sağa değil, gerçek bir listede olduğu gibi sütunu boydan boya
       doldurup ötekine geçiyor. */
    if (isList) {
        grid.innerHTML =
            '<div class="kdf-defter sutun-' + klSutun(key) + '"><ol class="kdf-izgara">' +
            displayList.map(function (item, i) {
                const ar = (typeof colorizeArabicWord === 'function')
                    ? colorizeArabicWord(item.arText, item.rootKey) : (item.arText || '');
                return '<li class="kdf-satir">' +
                       '<span class="kdf-no">' + (i + 1) + '</span>' +
                       (item.emoji ? '<span class="kdf-emoji">' + item.emoji + '</span>' : '') +
                       '<span class="kdf-tr" dir="ltr" title="' +
                       String(item.trText || '').replace(/"/g, '&quot;') + '">' +
                       (item.trText || '') + '</span>' +
                       '<i class="kdf-nokta" aria-hidden="true"></i>' +
                       '<span class="kdf-ar" dir="rtl">' + ar + '</span>' +
                       '</li>';
            }).join('') + '</ol></div>';
        klOtoSutun(key);
        state.scores = [0, 0];
        state.currentPlayer = 1;
        state.activeFlipped = [];
        state.isProcessing = false;
        state.matches = 0;
        updateScoreUI(key);
        return;
    }

    displayList.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = isStudy ? item.rootKey : item.pairId;
        
        if (isStudy) {
            let kalipAction = item.kalipId ? `, '${item.kalipId}'` : "";
            card.innerHTML = `
                <div class="memory-card-inner">
                    <!-- ÖN YÜZ: Sadece Arapça (Büyük ve Ortalanmış) -->
                    <div class="memory-card-face memory-card-front" style="display: flex; align-items: center; justify-content: center;">
                        <div class="lang-ar" style="text-align: center; margin: 0; padding: 0; ${(thematicCategoriesData[key] && thematicCategoriesData[key].arFontSize) ? `font-size: ${thematicCategoriesData[key].arFontSize} !important;` : ''}">${typeof colorizeArabicWord === 'function' ? colorizeArabicWord(item.arText, item.rootKey) : item.arText}</div>
                    </div>
                    <!-- ARKA YÜZ: Türkçe ve Emoji -->
                    <div class="memory-card-face memory-card-back" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div style="font-size: 4rem; margin-bottom: 5px;">${item.emoji || '✨'}</div>
                        <div class="lang-tr" style="font-weight: normal; color: #333; text-align: center; ${(thematicCategoriesData[key] && thematicCategoriesData[key].trFontSize) ? `font-size: ${thematicCategoriesData[key].trFontSize} !important;` : ''}" dir="ltr">${item.trText}</div>
                    </div>
                </div>
            `;
            card.onclick = () => card.classList.toggle('flipped');
        } else {
            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-face memory-card-front"></div>
                    <div class="memory-card-face memory-card-back lang-${item.lang}">
                        <span>${(item.lang === 'ar' && typeof colorizeArabicWord === 'function') ? colorizeArabicWord(item.text, item.pairId) : item.text}</span>
                    </div>
                </div>
            `;
            card.onclick = () => handleMemoryFlip(key, card);
        }
        grid.appendChild(card);
    });
    
    // Skorları sıfırla
    state.scores = [0, 0];
    state.currentPlayer = 1;
    state.activeFlipped = [];
    state.isProcessing = false;
    state.matches = 0;

    updateScoreUI(key);

    /* Çalışma kartlarında uzun kelimeler kartı taşırıyordu: yerleşim
       oturduktan sonra sığdır. Panel o an kapalıysa (ölçü 0) sığdırma
       kendini iptal eder; akordiyon açılınca yeniden çağrılıyor. */
    if (isStudy) {
        requestAnimationFrame(function () { kartlariSigdir(key); });
        setTimeout(function () { kartlariSigdir(key); }, 80);
    }
}

function handleMemoryFlip(key, card) {
    let state = activeMemoryGames[key];
    if (!state.gameStarted) return;
    if (state.isProcessing) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    if (typeof SoundEngine !== "undefined") SoundEngine.playClick();
    card.classList.add('flipped');
    state.activeFlipped.push(card);

    if (state.activeFlipped.length === 2) {
        state.isProcessing = true;
        setTimeout(() => checkMemoryMatch(key), 800);
    }
}

function checkMemoryMatch(key) {
    let state = activeMemoryGames[key];
    const [card1, card2] = state.activeFlipped;
    const match = card1.dataset.id === card2.dataset.id;

    if (match) {
        if (typeof SoundEngine !== "undefined" && typeof SoundEngine.playClick === "function") SoundEngine.playClick();
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        state.matches++;
        
        if (state.mode === 'mem2') {
            state.scores[state.currentPlayer - 1]++;
            updateScoreUI(key);
        }
        
        // Oyun bitiş kontrolü
        const pairCountInput = document.getElementById(`pairCount-${key}`);
        const totalPairs = pairCountInput ? parseInt(pairCountInput.value) : 9;
        
        if (state.matches === totalPairs) {
            setTimeout(() => {
                let msg = "";
                if (state.mode === 'mem2') {
                    let winner = state.scores[0] > state.scores[1] ? "1. Oyuncu Kazandı!" : 
                                 (state.scores[1] > state.scores[0] ? "2. Oyuncu Kazandı!" : "Berabere!");
                    msg = winner + "\n";
                } else {
                    msg = "Tebrikler! Bu turu başarıyla tamamladınız.\n";
                }
                
                // Advance round
                state.roundIndex += totalPairs;
                if (state.roundIndex >= state.shuffledItems.length) {
                    msg += "Tüm kelimeleri tamamladınız! Liste yeniden karıştırılıyor...";
                    state.shuffledItems.sort(() => Math.random() - 0.5);
                    state.roundIndex = 0;
                } else {
                    msg += "Diğer kelimelere (Sonraki Tura) geçiliyor!";
                }
                
                // Show custom popup or alert
                const popup = document.createElement('div');
                popup.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:15px; box-shadow:0 10px 40px rgba(0,0,0,0.2); z-index:9999999; text-align:center; font-size:1.5rem; font-weight: normal; color:#333;";
                popup.innerText = msg;
                document.body.appendChild(popup);
                
                if (typeof SoundEngine !== "undefined" && SoundEngine.playSuccess) SoundEngine.playSuccess();
                
                setTimeout(() => {
                    document.body.removeChild(popup);
                    state.matches = 0; // Reset matches for next round, but keep scores
                    state.activeFlipped = [];
                    initMemoryGrid(key);
                }, 2500);
            }, 600);
        }
        
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        
        if (state.mode === 'mem2') {
            state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
            updateScoreUI(key);
        }
    }

    state.activeFlipped = [];
    state.isProcessing = false;
}

function updateScoreUI(key) {
    let state = activeMemoryGames[key];
    
    const s1 = document.getElementById(`s1-${key}`);
    const s2 = document.getElementById(`s2-${key}`);
    const p1Box = document.getElementById(`p1-box-${key}`);
    const p2Box = document.getElementById(`p2-box-${key}`);
    const grid = document.getElementById(`grid-${key}`);
    
    if (s1) s1.innerText = state.scores[0];
    if (s2) s2.innerText = state.scores[1];
    
    if (p1Box && p2Box) {
        if (state.currentPlayer === 1) {
            p1Box.classList.add('active-p', 'pulse-anim');
            p2Box.classList.remove('active-p', 'pulse-anim');
            setTimeout(() => { if (p1Box) p1Box.classList.remove('pulse-anim'); }, 500);
            
            if (grid) {
                if (state.mode === 'mem2') {
                    grid.classList.add('active-p1-grid');
                    grid.classList.remove('active-p2-grid');
                } else {
                    grid.classList.remove('active-p1-grid', 'active-p2-grid');
                }
            }
        } else {
            p2Box.classList.add('active-p', 'pulse-anim');
            p1Box.classList.remove('active-p', 'pulse-anim');
            setTimeout(() => { if (p2Box) p2Box.classList.remove('pulse-anim'); }, 500);
            
            if (grid && state.mode === 'mem2') {
                grid.classList.add('active-p2-grid');
                grid.classList.remove('active-p1-grid');
            }
        }
    }
}

function toggleAccordionFullscreen(key, btnElement) {
    const item = document.getElementById(`content-${key}`);
    if (!item) return;
    /* Not: mod satırındaki düğme artık "kapat" demek, tam ekran anahtarı
       değil — ikonu sabit kalsın diye burada aranmıyor. */

    if (item.classList.contains('fullscreen-accordion')) {
        item.classList.remove('fullscreen-accordion');
        document.body.classList.remove('has-fullscreen-accordion');
        if (btnElement) btnElement.innerHTML = '<i class=\"fas fa-expand\"></i>'; // Maximize icon
        
        
    } else {
        item.classList.add('fullscreen-accordion');
        document.body.classList.add('has-fullscreen-accordion');
        if (btnElement) btnElement.innerHTML = '<i class=\"fas fa-compress\"></i>'; // Minimize icon
    }
}

window.openCategoryFromModal = function(categoryKey) {
    const modal = document.getElementById('word-details-modal');
    const overlay = document.getElementById('word-details-overlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    
    // Arama kutusunu (search-input) SIFIRLAMIYORUZ.
    // Böylece kullanıcı kapatınca kaldığı yere dönebilir.
    
    // Listelerin bulunduğu ana katmanı (verb-overlay) görünür yap
    const verbOverlay = document.getElementById('verb-overlay');
    if (verbOverlay) verbOverlay.style.display = 'flex';
    
    // Listeler sekmesini aktif et
    showThematicView();
    
    setTimeout(() => {
        const items = document.querySelectorAll('.thematic-accordion-item');
        for (let item of items) {
            if (item.getAttribute('onclick') && item.getAttribute('onclick').includes("'" + categoryKey + "'")) {
                if (!item.classList.contains('active')) {
                    toggleThematicAccordion(item, categoryKey);
                }
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                break;
            }
        }
    }, 100);
};
document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { renderThematicLists(); }, 500); });

window.openFromStudyCard = function(rootKey, kalipId) {
    /* AYRI SAYFADA TABLO YOK: kök kalıplar tablosunda açılıyor. */
    if (typeof selectRootFromMenu !== 'function') { _kokAc(rootKey, kalipId); return; }
    if (typeof selectRootFromMenu === 'function') {
        selectRootFromMenu(rootKey);
        
        // Modalın kapatılması (açıksa)
        const theModal = document.getElementById('thematic-accordion-modal');
        if(theModal) theModal.style.display = 'none';
        
        // Eğer kalipId varsa, o kutuyu bulup tıklat (kırmızı aktif yapmak için)
        if (kalipId) {
            setTimeout(() => {
                const boxes = document.querySelectorAll('.glass-box');
                boxes.forEach(box => {
                    const dataId = box.getAttribute('data-id');
                    if (dataId === kalipId) {
                        box.classList.add('current-active-red');
                        // İsterseniz otomatik tıklatıp türetebilirsiniz de:
                        // handleBoxClick(box);
                    }
                });
            }, 300);
        }
    }
};

/* OYUN BAŞLAYINCA AYAR SATIRI DA KAPANIR (Geylani: "sayfa daha temiz
   olsun"). Ekranda yalnız oyun kalır. Ayarlara dönmek ya da yeniden
   başlatmak için "Hafıza Oyunu" düğmesine tekrar basılır; başka bir
   kipe basmak oyundan çıkarır. */
function startGameAndFullscreen(key) {
    startMemoryGameFlow(key);
    seritKapat(key);
    if (activeMemoryGames[key]) activeMemoryGames[key].gameStarted = true;
    const btnFs = document.getElementById(`btn-fs-${key}`);
    const item = document.getElementById(`content-${key}`);
    if (item && !item.classList.contains('fullscreen-accordion')) {
        toggleAccordionFullscreen(key, btnFs);
    }
}


