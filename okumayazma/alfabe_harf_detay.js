/* =====================================================================
   HARF DETAY MODÜLÜ v3 — Profesyonel yazım animasyonu:
   Gerçek arakom harf dolgusu, kalem yolu boyunca MASKE ile ortaya çıkar
   (stroke-in-mask tekniği). Kalem ucu yol boyunca hareket eder; yazım
   sağ üstten başlar, doğal yönde biter; noktalar sonda vurulur.

   HARF_YAZIM içindeki darbeler DİZİ SIRASINDA ve YOL YÖNÜNDE çizilir:
   strokes[0] önce biter, sonra strokes[1]... Her darbe de "d" dizesinin
   M noktasından son noktasına doğru açılır. Yani bir harfin yazılış
   sırasını düzeltmek demek, darbeleri yeniden sıralamak ya da bir
   darbenin yönünü ters çevirmek demektir.

   SAD/DAD (ص ض) düzeltmesi: bu iki harfin baş ilmeği, veriden çıktığı
   hâliyle sağ uçtan başlayıp önce alt kenarı soldan sağa değil sağdan
   sola tarıyor, ilmeği sonra kapatıyordu — yani el yazısının tersi.
   Doğrusu: kalem çizginin üstündeki SOL uçtan kalkar, sağ yukarı
   çapraza tırmanır, sağ uçta aşağı iner, sonra çizgi boyunca sağdan
   sola geri döner; ardından diş ve çukur gelir. Bunun için:
     • Yalın (n) biçimde ilmek darbesi 403,375 noktasından başlayacak
       şekilde döndürüldü (çizim aynı, başlangıç noktası değişti).
     • Başta (b) biçimde üst yay ters çevrilip alt yay ve devam çizgisiyle
       tek bir kesintisiz darbede birleştirildi (kalem havalanmıyor).
   Ortada (o) ve sonda (s) biçimleri zaten doğru yönde geliyordu.
   Harfin görünen şekli değişmedi: sınırlayıcı kutular birebir aynı.

   YAZILIŞ SIRASI TARAMASI (112 biçimin tamamı kural tabanlı tarandı):
   K1 gelen kaşide — ortada/sonda biçimlerde kalem SAĞ bağlantı
   noktasından girer; K2/K3 çıkış — başta/ortada biçimlerde SOL çıkış
   en son çizilir, ondan sonra darbe gelmez; K4 süreklilik — bir darbe
   bir öncekinin bittiği yere yakın başlar; K5 geri zıplama — kalem
   sebepsizce sağa geri sıçramaz. Tarama 22 biçimi işaretledi, görsel
   doğrulamada 5'i yanlış alarm çıktı (ج ح خ yalın ve ج ح başta: gaganın
   soldan sağa gitmesi doğru), 13'ü gerçek kusurdu ve düzeltildi:
     • ج ح خ sonda — gelen kaşide 2. sırada ve DIŞARI doğru çiziliyordu;
       ters çevrilip ilk darbe yapıldı (kalem sağdan içeri giriyor).
     • ع غ sonda — aynı kusur; bağlantı darbesi ters çevrilip başa alındı.
     • ي sonda — giriş darbesi çizginin altından YUKARI akıyordu; ters
       çevrildi, artık çizgiden çanağa iniyor.
     • ط ظ yalın — iki yay da aynı sağ noktadan başlayıp sola gidiyordu
       (ص/ض ile birebir aynı kusur); alt yay ters çevrilip üst yayla tek
       kesintisiz darbede birleştirildi (5 → 4 darbe).
     • ط ظ ortada — sol çıkış çizgisinden sonra bir darbe daha geliyordu;
       çıkış en sona alındı.
     • م başta — sol kuyruk ilmekten önce çiziliyordu; ilmek ters
       çevrilip kuyrukla tek darbede birleştirildi (2 → 1 darbe).
     • م ortada — sol çıkış parçası gövdeden ayrılıp en sona alındı.
     • ه ortada — taban çizgisi baştan uca kadar tek seferde çiziliyordu;
       giriş ve çıkış diye ikiye bölündü, çıkış en sona alındı.
   Hiçbir darbenin şekli değiştirilmedi; yalnızca sıra ve yön düzeltildi.

   v4 DÜZELTMELERİ (Geylani'nin gözlemleri):
     • ت ث ortada/sonda — gövde İKİ darbeydi: kalem sağdaki dişin
       TEPESİNDE duruyor, oradan yeni darbe başlıyordu. Diş noktaların
       hemen altında olduğu için bu duraklama "mürekkep yukarıdaki
       noktalara sıçramış" gibi görünüyordu. İki darbe TEK kesintisiz
       harekete birleştirildi: kalem sağdan girer, dişe çıkar, aynı
       hamlede iner ve sola akar. Noktalar zaten en sonda (taps).
     • ج ح خ ortada/sonda — yazım artık ÜÇ kerede:
         1) sağdan gelinip yukarı çıkılır, kalem kalkar,
         2) yukarıda SOLDAN SAĞA kaş çizilir, sonra soldan aşağı
            inilerek harf tamamlanır (ortada: sol çıkış, sonda: kase),
         3) varsa nokta konur.
       Ortada 4 darbe → 2 gövde darbesi, sonda 3 darbe → 2 gövde
       darbesi (üçüncü "kere" noktadır). Kaş yönü artık yalın ve başta
       biçimlerindekiyle aynı: soldan sağa.

   v5 DÜZELTMELERİ — ص ض (Geylani'nin tarifi; yukarıdaki v3 SAD/DAD
   notunun yerine geçer). Bu iki harfin dört biçimi de artık NOKTA
   HARİÇ TEK darbe: kalem hiç havalanmıyor.
     • Başta (b): en aşağıdaki sivri uçtan (satır altına sarkan diş)
       başlanır → sağ yukarı çapraz → sağa ve aşağı → sola geri dönüş
       → çukur ve sol çıkış. (3 darbe → 1)
     • Ortada (o): sağdaki harfle birleşen çizgiden başlanır, satır
       boyunca sola gidilip sivri uca İNİLİR, aynı yoldan çıkılır ve
       baştaki gibi tamamlanır. (5 darbe → 1)
     • Sonda (s): ortadaki gibi; kuyruk en sona bırakıldı — aşağı,
       sonra sola ve yukarı. (4 darbe → 1)
     • Yalın (n): önceki harfle birleşme çizgisi olmadığı için doğrudan
       sivri uçtan başlanır, gövde baştaki gibi yazılır, ardından
       kuyruk gelir. (4 darbe → 1)
   İki harfin "sonda" biçimlerinin veri yapısı birbirinden farklıydı
   (ص'da sivri uç ilmek darbesinin içinde, ض'da ayrı darbe); ikisi de
   ayrı ayrı ele alındı.

   TEK KALEM KURALI (Geylani) — v6, BÜTÜN ALFABEYE UYGULANDI.
   Kural KUTULAR ARASINDA değil, BİR biçimin KENDİ İÇİNDE geçerlidir:
   dört biçim aynı anda ve sürekli döngüyle oynar (öğrenci istediği
   yazılışa bakar), ama tek bir biçim yazılırken kalem birden çok
   yerden başlamamalı. Eskiden 112 biçimin 72'sinde kalem harfin
   uzak bir köşesine ışınlanıyordu ("sadı 3-4 kişi birlikte yazıyor"
   görüntüsü). Tarama + düzeltme:
     • Yakın uçlar birleştirildi — kalem zaten oradaysa havalanmıyor.
     • Kırıntı darbeler (3-45 birim; ك'de 3, م'de 5, و'da 11 birimlik
       parçalar) komşusuna yapıştırıldı; her biri koca bir yazım
       aralığı alıp kalemi uzağa ışınlıyordu.
     • Çıkmaz sokaklar GİT-GEL oldu: د ذ'nin tepe tırnağı, ل'ın üst
       çentiği, ي'nin küçük çıkıntısı, م'nin sonda başı — kalem uzanıp
       aynı yoldan geri dönüyor.
     • Uzağa bağlananlarda GERİ DÖNÜP DEVAM: ج ح خ (yalın/başta),
       ع غ, د ذ (ortada/sonda), ل (ortada/sonda), ك (ortada/sonda) —
       kalem uca kadar gider, aynı yoldan bağlantı noktasına döner,
       oradan devam eder. Gerçek elin yaptığı da budur.
     • ط ظ elden geçirildi: dört biçimde de gövde tek kesintisiz
       darbe, DİK ÇİZGİ en sona alındı (başta/ortada/sonda'da dik
       ortada çiziliyor, gövdenin bir kısmı ondan sonra geliyordu).
   Kalan kalem kaldırmalar GERÇEK: ج ح خ'nın kaşı (Geylani'nin tarifi;
   dört biçimde de ayrı darbe) ve ط ظ'nın dik çizgisi. Noktalar zaten
   ayrı ve en sonda (taps).

   GİT-GEL HIZI (aynı geri bildirimin ikinci turu): yukarıdaki
   birleştirmelerden sonra bazı harflerde kalem uca gidip AYNI YOLDAN
   geri dönüyordu. Sabit hızlı animasyonda bu dönüş boyunca ekranda
   hiçbir şey çıkmıyor, yazı saniyelerce duruyor, sonra uzakta yeniden
   başlıyormuş gibi görünüyordu — "harfi iki kişi yazıyor" şikâyeti
   buradan geliyordu. playForm artık yolu "yeni mürekkep" ve "kendi
   izini geçme" diye ayırıp ikincisini ~4 kat hızlı geçiyor
   (agirlikProfili/profilUzunluk). Kalem yine kesintisiz hareket eder,
   ölü bekleme kalmaz; süre de ham değil ETKİN uzunluğa göre hesaplanır
   ki git-gel animasyonu şişirmesin. Aynı eşleme ızgara kartlarında da
   kullanılır (profil orada tembel, kare başına 3 tane hesaplanır ki
   sayfa açılışı yavaşlamasın).
   Ölçüm: ل ortada'da ölü bekleme %26 → %13, ك ortada %23 → %9,
   د ortada/sonda %17 → %8, ع başta %18 → %11, ع sonda %11 → %4.

   KALEM UCUNUN GÖRÜNÜRLÜĞÜ — "iki yerden yazılıyor"un ASIL sebebi.
   Yukarıdaki hızlandırma yetmedi, çünkü sorun süre değil GÖRÜNÜRLÜKTÜ:
   kalem ucu harfin KENDİ RENGİYLE çiziliyordu (aynı renk üstüne aynı
   renk = tamamen görünmez). Kalem, yazılmış mürekkebin üstünden geri
   dönerken ekranda kıpırdayan hiçbir şey kalmıyor, sonra mürekkep
   uzakta yeniden başlıyordu; göz bunu "ikinci bir el devreye girdi"
   diye okuyor. Uç artık BEYAZ göbekli + renkli halkalı: beyaz kâğıtta
   da, yazılmış mürekkebin üstünde de seçiliyor. Böylece kalemin nereye
   gidip geldiği izlenebiliyor ve git-gel hızı da (IZ_AGIRLIK) izlenebilir
   olsun diye biraz gevşetildi. Sorunun kutuların aynı anda oynamasıyla
   ilgisi yoktu; her kutunun kendi kalemi var.
   Harflerin görünen şekli değişmedi: dolgu, sınırlayıcı kutu ve
   noktalar hiç ellenmedi; 112 biçimin maske kaplaması 900x1410'da
   piksel piksel karşılaştırıldı, kayıp yalnız kenar yumuşatmasından
   gelen 1-2 pikselle sınırlı.
   Darbeler, var olan yolların yeniden örneklenmesiyle (3 birimlik
   çokgen) kesilip ters çevrilerek kuruldu; harflerin görünen şekli
   BİREBİR AYNI: eski/yeni maske kaplaması 28 biçimde piksel piksel
   karşılaştırıldı, fark 0.
   112 biçimin sınırlayıcı kutusu düzeltme öncesi/sonrası birebir aynı
   (sapma 0.00). Kalan 19 işaretin tamamı elde doğrulanıp yanlış alarm
   ya da bilinçli tercih olarak bırakıldı.
   ===================================================================== */
const HARF_DETAY_INFO = {"ا": {"mahrec": "Med (uzatma) harfidir; ağız boşluğundan (cevf) çıkar. Kendinden önceki üstünlü harfi bir elif miktarı uzatır.", "yazilis": "Üstten başlanır, tek hamlede dimdik aşağı inilir. Kendinden önceki harfe bitişir, sonrakine bitişmez; soluna bitişmeyen altı harften biridir (ا د ذ ر ز و)."}, "ب": {"mahrec": "Dudak harfidir (şefevî): iki dudağın birbirine hafifçe vurmasıyla çıkar.", "yazilis": "Sağ üstten başlanır, aşağı inip sola doğru uzun bir çanak (tekne) çizilir; tek nokta çanağın ALTINA konur."}, "ت": {"mahrec": "Dil ucunun üst ön dişlerin diplerine değmesiyle çıkar (ince ve yumuşak).", "yazilis": "Be ile aynı çanak gövdesi çizilir; İKİ nokta gövdenin ÜSTÜNE konur."}, "ث": {"mahrec": "Dil ucunun üst ön dişlerin UÇLARINA değmesiyle çıkar; peltek (İngilizce 'think' gibi).", "yazilis": "Be ile aynı çanak gövdesi; ÜÇ nokta üçgen biçiminde ÜSTE konur."}, "ج": {"mahrec": "Dilin ortasının üst damağa yükselmesiyle çıkar ('c' sesi).", "yazilis": "Önce üstte sağdan sola yatay bir kaş çizilir, sonra satır altına sarkan geniş bir kase; tek nokta kasenin İÇİNE (altına) konur."}, "ح": {"mahrec": "Boğazın ORTASINDAN çıkar; nefesle sürtünerek gelen sert 'h' sesidir.", "yazilis": "Cim ile aynı gövde: üstte kaş, altta satır altına sarkan kase; NOKTASIZDIR."}, "خ": {"mahrec": "Boğazın ağza en yakın kısmından çıkar; hırıltılı 'h' sesidir.", "yazilis": "Cim ile aynı gövde çizilir; tek nokta kaşın ÜSTÜNE konur."}, "د": {"mahrec": "Dil ucunun üst ön dişlerin diplerine değmesiyle çıkar ('d' sesi).", "yazilis": "Üstten başlanır, öne (sola) eğik inilir ve altta keskin bir dönüşle sola çekilir. Soluna bitişmeyen harflerdendir."}, "ذ": {"mahrec": "Dil ucunun üst ön dişlerin UÇLARINA değmesiyle çıkar; peltek 'z' (İngilizce 'this' gibi).", "yazilis": "Dal ile aynı gövde; tek nokta ÜSTÜNE konur. Soluna bitişmez."}, "ر": {"mahrec": "Dil ucunun hemen gerisinin üst damağa değmesiyle çıkar; tek vuruşlu 'r'.", "yazilis": "Üstten başlanır, sola doğru kavis yaparak SATIR ALTINA sarkılır. Soluna bitişmez."}, "ز": {"mahrec": "Dil ucu ile alt ön dişlerin üstünden ıslıksı çıkar; ince 'z' sesidir.", "yazilis": "Ra ile aynı kavis çizilir; tek nokta ÜSTÜNE konur. Soluna bitişmez."}, "س": {"mahrec": "Dil ucu ile alt ön dişlerin arasından ıslık gibi çıkar; ince 's'.", "yazilis": "Sağdan sola iki küçük diş çizilir, ardından satır altına inen geniş bir kase ile bitirilir."}, "ش": {"mahrec": "Dilin ortasından, sesin yayılmasıyla çıkar; 'ş' sesidir.", "yazilis": "Sin ile aynı gövde: iki diş + kase; ÜÇ nokta dişlerin ÜSTÜNE üçgen biçiminde konur."}, "ص": {"mahrec": "Sin ile aynı bölgeden çıkar fakat KALIN ve dolgundur; ağız yuvarlanır.", "yazilis": "Sağdan yumurta biçiminde yatık bir gövde çizilir, ardından satır altına inen kase ile bitirilir."}, "ض": {"mahrec": "Dilin yan kenarının üst azı dişlere değmesiyle çıkar; Arapçaya özgü KALIN 'd'.", "yazilis": "Sad ile aynı gövde; tek nokta ÜSTÜNE konur."}, "ط": {"mahrec": "Te'nin bölgesinden çıkar fakat KALINDIR; dil damağa yapışıp ayrılır.", "yazilis": "Önce sağdan yumurta biçimli gövde çizilir, sonra üzerine dik bir elif indirilir."}, "ظ": {"mahrec": "Zel'in bölgesinden (dil ucu + diş uçları) çıkar; KALIN peltek 'z'.", "yazilis": "Tı ile aynı gövde (yumurta + dik çizgi); tek nokta ÜSTÜNE konur."}, "ع": {"mahrec": "Boğazın ORTASINDAN çıkar; Arapçaya özgü, boğazın hafifçe sıkılmasıyla çıkan sestir.", "yazilis": "Üstte sağdan sola küçük bir kaş çizilir, ardından satır altına sarkan geniş bir kase ile bitirilir."}, "غ": {"mahrec": "Boğazın ağza en yakın kısmından çıkar; yumuşak 'ğ' (gargara sesine benzer).", "yazilis": "Ayn ile aynı gövde çizilir; tek nokta kaşın ÜSTÜNE konur."}, "ف": {"mahrec": "Alt dudağın içinin üst ön dişlerin uçlarına değmesiyle çıkar ('f' sesi).", "yazilis": "Üstte küçük yuvarlak bir baş çizilir, ardından sola uzanan çanak; tek nokta başın ÜSTÜNE konur."}, "ق": {"mahrec": "Dil kökünün küçük dile (üst damağın en arkasına) vurmasıyla çıkar; KALIN 'k'.", "yazilis": "Fe gibi yuvarlak baş çizilir, gövde satır altına inen derin bir kase ile biter; İKİ nokta ÜSTE konur."}, "ك": {"mahrec": "Dil kökünün biraz önünün üst damağa değmesiyle çıkar; ince 'k'.", "yazilis": "Üstten eğik bir çizgiyle inilir, altta sola çanak yapılır; içine küçük bir işaret (hemze benzeri) konur."}, "ل": {"mahrec": "Dil ucunun kenarlarıyla üst diş etlerinden çıkar ('l' sesi).", "yazilis": "Elif gibi dik inilir, altta sola kıvrılan bir çanakla satır altına taşmadan bitirilir."}, "م": {"mahrec": "Dudak harfidir: iki dudağın birbirine kapanmasıyla çıkar; ses genizden de gelir.", "yazilis": "Önce yuvarlak bir baş çizilir, sonra aşağıya doğru dik bir kuyrukla bitirilir."}, "ن": {"mahrec": "Dil ucunun üst diş etlerine değmesiyle çıkar; genizden ses alır ('n').", "yazilis": "Derin bir çanak çizilir (Be'den daha yuvarlak); tek nokta ÜSTÜNE konur."}, "و": {"mahrec": "Dudakların yuvarlaklaşıp öne uzamasıyla çıkar; ötreli harfleri uzatan med harfidir.", "yazilis": "Yuvarlak bir baş çizilir, ardından satır altına sola kıvrılan kuyrukla bitirilir. Soluna bitişmez."}, "ه": {"mahrec": "Boğazın en dibinden (göğse en yakın yerden) çıkar; yumuşak 'h' sesidir.", "yazilis": "Yalın halde kapalı bir halka biçiminde, tek hamlede yuvarlak gövde çizilir."}, "ي": {"mahrec": "Dilin ortasının üst damağa yükselmesiyle çıkar; esreli harfleri uzatan med harfidir.", "yazilis": "Kıvrımlı gövde satır altına 'S' gibi sarkar; İKİ nokta gövdenin ALTINA konur."}};
/* HARF YAZIM VERİSİ ARTIK AYRI DOSYADA (09.10.2026)
   ------------------------------------------------------------------
   HARF_YAZIM (470 KB, bu dosyanın %90'ı) buradan çıkarıldı:
       okumayazma/alfabe_harf_yazim.js      (üretilen, site bunu yükler)
       _kaynak/harf-yazim/<nn>-<ad>.json    (kaynak, harf başına bir dosya)
       _kaynak/uretici/harfYazim.py         (--bol · --kur · --denetle)
   Sebebi: tek bir harfin tek bir biçimini düzeltmek için 519 KB'lik
   dosyaya dokunmak gerekiyordu, neyin değiştiği görünmüyordu. Artık
   bir düzeltme tek harfin dosyasına dokunuyor ve üretilen dosyada tek
   satır değişiyor.
   DİKKAT: alfabe.html'de alfabe_harf_yazim.js BU DOSYADAN ÖNCE
   yüklenmeli — HARF_YAZIM burada adıyla kullanılıyor. */
const harfDetay = {
    rafs: [], timers: [], maskSeq: 0,
    FORM_META: [
        { key: 'b', label: 'Başta',  color: '#16a34a' },
        { key: 'o', label: 'Ortada', color: '#2563eb' },
        { key: 's', label: 'Sonda',  color: '#9333ea' },
        { key: 'n', label: 'Yalın',  color: '#1e293b' }
    ],

    ensureDom: function() {
        if (document.getElementById('hd-overlay')) return;
        const ov = document.createElement('div');
        ov.id = 'hd-overlay';
        ov.innerHTML = `
            <button id="hd-ileri" class="hd-gez" type="button">
                <span class="hd-gez-ok">&#8249;</span>
                <span class="hd-gez-ar"></span><span class="hd-gez-ad"></span></button>
            <button id="hd-geri" class="hd-gez" type="button">
                <span class="hd-gez-ar"></span><span class="hd-gez-ad"></span>
                <span class="hd-gez-ok">&#8250;</span></button>
            <div id="hd-card" role="dialog" aria-modal="true">
                <button id="hd-close" title="Kapat" aria-label="Kapat">&times;</button>
                <div id="hd-no" title="Alfabedeki sırası"></div>
                <div id="hd-name"></div>
                <div class="hd-sec hd-sec-mahrec">
                    <div class="hd-sec-title">📍 Mahreç <span class="hd-sec-sub">(sesin çıkış yeri)</span></div>
                    <div class="hd-sec-text" id="hd-mahrec"></div>
                </div>
                <div id="hd-ayar">
                    <div id="hd-kip" role="group" aria-label="Yazım sırası">
                        <button type="button" data-mod="hepsi" title="Dört biçim aynı anda yazılır">Hepsi birden</button>
                        <button type="button" data-mod="sira" title="Biçimler sırayla yazılır: Başta → Ortada → Sonda → Yalın">Sırayla</button>
                    </div>
                    <div id="hd-hiz" role="group" aria-label="Yazma hızı">
                        <span class="hd-ayar-ad">Hız</span>
                        <button type="button" data-hiz="0" title="Çok yavaş">1</button>
                        <button type="button" data-hiz="1" title="Yavaş">2</button>
                        <button type="button" data-hiz="2" title="Normal">3</button>
                        <button type="button" data-hiz="3" title="Hızlı">4</button>
                        <button type="button" data-hiz="4" title="Çok hızlı">5</button>
                    </div>
                </div>
                <div id="hd-cols" dir="rtl"></div>
                <div id="hd-tek-ornek" hidden></div>
                <div class="hd-sec hd-sec-yazilis">
                    <div class="hd-sec-title">✍️ Nasıl Yazılır? <button id="hd-replay" title="Tekrar izle">↻ Tekrar Yaz</button></div>
                    <div class="hd-sec-text" id="hd-yazilis"></div>
                </div>
            </div>`;
        document.body.appendChild(ov);
        ov.addEventListener('click', (e) => { if (e.target === ov) harfDetay.close(); });
        document.getElementById('hd-close').onclick = () => harfDetay.close();
        document.getElementById('hd-replay').onclick = () => harfDetay.animate();
        /* SIRAYLA / HEPSİ BİRDEN (11.10.2026, Geylani isteği): büyüteçte
           dört biçimin sırayla mı yoksa aynı anda mı yazılacağını seçen
           anahtar. Seçim tarayıcıda saklanır, sonraki harfte de geçerli. */
        document.getElementById('hd-kip').onclick = function (e) {
            const d = e.target.closest('button[data-mod]');
            if (!d) return;
            if (typeof playClick === 'function') playClick();
            harfDetay.modSec(d.dataset.mod);
            harfDetay.animate();
        };
        this.modSec(this.modOku());
        /* YAZMA HIZI — 5 kademe, herkes kendi ayarlar (11.10.2026). Çarpan
           playForm'da uygulandığı için büyüteç, Harf Birleştirme tablosu ve
           İstenen Harfi Yaz aynı hızda yazar. */
        document.getElementById('hd-hiz').onclick = function (e) {
            const d = e.target.closest('button[data-hiz]');
            if (!d) return;
            if (typeof playClick === 'function') playClick();
            harfDetay.hizSec(+d.dataset.hiz);
            harfDetay.animate();
        };
        this.hizSec(this.hizOku());
        /* HARFLER ARASI GEZİNME (Geylani, 11.10.2026): alfabe tablosu sağdan
           sola aktığı için SOLDAKİ düğme SONRAKİ harfe, SAĞDAKİ düğme ÖNCEKİ
           harfe gider; üstlerinde hangi harfe gidileceği yazar. */
        document.getElementById('hd-ileri').onclick = () => harfDetay.kaydir(1);
        document.getElementById('hd-geri').onclick = () => harfDetay.kaydir(-1);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { harfDetay.close(); return; }
            const ov2 = document.getElementById('hd-overlay');
            if (!ov2 || !ov2.classList.contains('hd-open')) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); harfDetay.kaydir(1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); harfDetay.kaydir(-1); }
        });
    },

    /* Yönüne göre bir sonraki GÖSTERİLEBİLİR harfin sırası (-1: yok). */
    komsu: function (yon) {
        if (typeof harfler === 'undefined' || this.idx == null) return -1;
        let j = this.idx;
        for (let n = 0; n < harfler.length; n++) {
            j += yon;
            if (j < 0 || j >= harfler.length) return -1;
            const x = harfler[j];
            if (x && HARF_DETAY_INFO[x.h] && HARF_YAZIM[x.h]) return j;
        }
        return -1;
    },

    gezGuncelle: function () {
        [['hd-ileri', 1], ['hd-geri', -1]].forEach((c) => {
            const el = document.getElementById(c[0]);
            if (!el) return;
            const j = this.komsu(c[1]);
            el.style.visibility = (j < 0) ? 'hidden' : '';
            if (j < 0) return;
            el.querySelector('.hd-gez-ar').innerText = harfler[j].h;
            el.querySelector('.hd-gez-ad').innerText = harfler[j].tr;
            el.title = harfler[j].tr + ' harfine geç';
            el.setAttribute('aria-label', harfler[j].tr + ' harfine geç');
        });
    },

    kaydir: function (yon) {
        const j = this.komsu(yon);
        if (j < 0) return;
        this.open(j);
    },

    open: function(idx) {
        this.ensureDom();
        const h = harfler[idx];
        const info = HARF_DETAY_INFO[h.h];
        const yaz = HARF_YAZIM[h.h];
        if (!h || !info || !yaz) return;
        if (typeof playClick === 'function') playClick();
        this.idx = idx;
        this.gezGuncelle();

        /* Sol üstte harfin sıra numarası: karttaki .card-num ile aynı sayı (idx + 1) */
        document.getElementById('hd-no').innerText = (idx + 1);
        document.getElementById('hd-name').innerText = h.tr;
        document.getElementById('hd-mahrec').innerText = info.mahrec;
        document.getElementById('hd-yazilis').innerText = info.yazilis;

        /* Önceki harfin animasyonları DURDURULUR. Eskiden durdurulmuyordu:
           kutular DOM'dan silinse de kareler (raf) dönmeye devam ediyordu.
           Sıralı yazımda bu, eski turun yeni harfte ikinci bir kalem
           başlatmasına yol açıyordu. */
        this.tekKapat();
        this.stopAll();

        const cols = document.getElementById('hd-cols');
        cols.innerHTML = '';
        this.anims = [];
        this.FORM_META.forEach((fm, fi) => {
            const data = yaz[fm.key];
            const col = document.createElement('div');
            col.className = 'hd-col';
            const lbl = document.createElement('div');
            lbl.className = 'hd-col-label';
            lbl.style.color = fm.color;
            lbl.innerText = fm.label;
            const box = document.createElement('div');
            box.className = 'hd-col-box';
            const anim = this.buildSvg(data, fm.color);
            box.appendChild(anim.svg);
            box.title = 'Bu formu tekrar izlemek için tıkla';
            /* stopAll: sıra da dursun, yoksa tıklanan kutu yazarken sıradaki
               biçim de başlayıp ekranda ikinci bir kalem açar. */
            box.onclick = () => {
                if (this.odakIdx === fi) this.tekKapat(); else this.tekAc(h, fm, fi);
            };
            col.appendChild(lbl); col.appendChild(box);
            cols.appendChild(col);
            this.anims.push(anim);
        });

        const ov = document.getElementById('hd-overlay');
        ov.style.display = 'flex';
        requestAnimationFrame(() => ov.classList.add('hd-open'));
        this.timers.push(setTimeout(() => this.animate(), 420));
    },

    close: function() {
        const ov = document.getElementById('hd-overlay');
        if (!ov) return;
        this.stopAll();
        ov.classList.remove('hd-open');
        setTimeout(() => { ov.style.display = 'none'; }, 220);
    },

    stopAll: function() {
        this.timers.forEach(t => clearTimeout(t)); this.timers = [];
        (this.anims || []).forEach(a => this.cancelForm(a));
    },
    cancelForm: function(a) {
        if (a.raf) cancelAnimationFrame(a.raf);
        if (a.loopT) clearTimeout(a.loopT);
        a.raf = null; a.loopT = null;
        a.bitince = null;      /* yarıda kesilen biçim sırayı ilerletmesin */
        /* Kalem ucu yalnız yazım tamamlanınca gizleniyordu; yarıda kesilen
           biçimde kutuda öylece asılı kalıyordu. Sıralı yazımda ekranda
           duran her kalem ucu "burada da yazılıyor" izlenimi verir. */
        if (a.nib) { a.nib.style.visibility = 'hidden'; a.nib.style.opacity = '1'; }
    },

    buildSvg: function(data, color) {
        const NS = 'http://www.w3.org/2000/svg';
        const id = 'hdmask' + (++this.maskSeq);
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', data.vb.join(' '));
        svg.setAttribute('class', 'hd-yaz-svg');

        // Maske: siyah zemin + kalem yolu boyunca beyaz darbeler
        const defs = document.createElementNS(NS, 'defs');
        const mask = document.createElementNS(NS, 'mask');
        mask.setAttribute('id', id);
        const bg = document.createElementNS(NS, 'rect');
        bg.setAttribute('x', data.vb[0]); bg.setAttribute('y', data.vb[1]);
        bg.setAttribute('width', data.vb[2]); bg.setAttribute('height', data.vb[3]);
        bg.setAttribute('fill', 'black');
        mask.appendChild(bg);

        const maskStrokes = [];
        const mkStroke = (d, w) => {
            const p = document.createElementNS(NS, 'path');
            p.setAttribute('d', d);
            p.setAttribute('fill', 'none');
            p.setAttribute('stroke', 'white');
            p.setAttribute('stroke-width', w);
            p.setAttribute('stroke-linecap', 'round');
            p.setAttribute('stroke-linejoin', 'round');
            mask.appendChild(p);
            return p;
        };
        /* HARFE ÖZEL MOTOR AYARI (09.10.2026) — bkz. MOTOR başlığı.
           Biçimin kendi `motor`u varsa bütün darbelerine geçer; bir darbe
           kendi `motor`unu taşıyorsa o öncelikli. */
        const motorB = data.motor || null;
        data.strokes.forEach(s => maskStrokes.push({
            el: mkStroke(s.d, s.w), tap: false, w: s.w, motor: s.motor || motorB }));
        // Nokta kalkanları: gövde darbeleri noktalara taşsa bile noktalar sona kadar boyanmaz
        data.taps.forEach(t => {
            if (!t.sh) return;
            const shp = document.createElementNS(NS, 'path');
            shp.setAttribute('d', t.sh);
            shp.setAttribute('fill', 'black');
            mask.appendChild(shp);
        });
        data.taps.forEach(t => maskStrokes.push({ el: mkStroke(t.d, t.w), tap: true }));
        defs.appendChild(mask);
        svg.appendChild(defs);

        // Satır (referans) çizgisi — kartlardaki ile aynı hizada: harflerin
        // taban çizgisi viewBox'ta y=410'dur. İki yana bolca taşırılır,
        // SVG kendi görüntü alanında kırptığı için kutuyu baştan sona keser.
        const satir = document.createElementNS(NS, 'line');
        satir.setAttribute('x1', -4000); satir.setAttribute('x2', 4000);
        satir.setAttribute('y1', 410);   satir.setAttribute('y2', 410);
        satir.setAttribute('class', 'hd-satir');
        svg.appendChild(satir);

        // Soluk kılavuz: harfin tamamı
        const guide = document.createElementNS(NS, 'path');
        guide.setAttribute('d', data.fill);
        guide.setAttribute('class', 'hd-ghost');
        svg.appendChild(guide);

        // Gerçek harf dolgusu — maske ile açılır
        const ink = document.createElementNS(NS, 'path');
        ink.setAttribute('d', data.fill);
        ink.setAttribute('fill', color);
        ink.setAttribute('mask', `url(#${id})`);
        svg.appendChild(ink);

        // Kalem ucu
        const nib = document.createElementNS(NS, 'g');
        nib.setAttribute('class', 'hd-nib');
        /* KALEM UCU HER ZEMİNDE GÖRÜNMELİ (Geylani'nin "harf iki yerden
           yazılıyor" şikâyetinin asıl sebebi buydu): uç eskiden harfin
           KENDİ RENGİYLE çiziliyordu. Kalem, yazılmış mürekkebin üstünden
           geri dönerken (git-gel: ل ك'nin diki, د'nin tepesi, ع'nin kaşı,
           ص'nin sivri ucu) uç aynı renk üstüne aynı renk düştüğü için
           tamamen kayboluyordu. Ekranda hiçbir şey kıpırdamıyor, sonra
           mürekkep uzakta yeniden başlıyordu — göz bunu "ikinci bir el
           devreye girdi" diye okuyor. Artık uç BEYAZ göbekli, renkli
           halkalı: hem beyaz kâğıtta hem yazılmış mürekkebin üstünde
           seçiliyor, kalemin geri döndüğü izlenebiliyor. */
        nib.innerHTML =
            `<circle r="18" fill="${color}" opacity="0.22"></circle>` +
            `<circle r="10" fill="#ffffff" stroke="${color}" stroke-width="4.5"></circle>` +
            `<circle r="3.2" fill="${color}"></circle>`;
        nib.style.visibility = 'hidden';
        svg.appendChild(nib);

        return { svg, strokes: maskStrokes, nib, color, raf: null };
    },

    /* ---- GİT-GEL HIZI ------------------------------------------------
       Harfler tek kalemle yazılsın diye bazı biçimlerde kalem, uca gidip
       AYNI YOLDAN geri dönüyor (د'nin tepesi, ل'ın diki, ج ع ك'nin kaşı,
       ص'nin sivri ucu...). Gerçek elde bu dönüş bir anda olur; sabit
       hızlı animasyonda ise ekranda saniyelerce hiçbir şey çıkmıyordu:
       yazı duruyor, sonra uzakta yeniden başlıyormuş gibi — "harfi iki
       kişi yazıyor" görüntüsü buradan geliyordu (Geylani).
       Çözüm: yol, "yeni mürekkep" ve "kendi izini geçme" diye ayrılır;
       ikincisi ~5 kat hızlı geçilir. Kalem yine kesintisiz hareket eder,
       ama ekranda ölü bekleme kalmaz. Şeklin kendisi değişmez.
       Ölçüt tamamen geometrik: yolun bir noktası, daha önce geçilmiş bir
       noktaya kalem yarıçapı kadar yakınsa orası "geçilmiş" sayılır. */
    /* 09.10.2026 — 0.26 İKEN "İKİNCİ BİR EL" GÖRÜNÜYORDU (Geylani, ṣād
       sondaki): git-gel sayılan kesimde kalem 1/0.26 = 3,8 KAT hızlanıyordu.
       Ölçüm: ص sondaki biçiminde kalem tek karede 154 birim yol alıyor
       (normalde 8-36). O karede 154 birimlik şerit birden boyanıyor, göz
       kalemi orada görmediği için "başka biri boyadı" diyor.
       0.7'de hızlanma 1,4 kata iniyor; en büyük kare sıçraması 154 -> 69.
       Bedeli: 112 biçimin 57'si ortalama 0,2 sn uzuyor (en çok 0,7 sn). */
    IZ_AGIRLIK: 0.7,
    /* --- MOTOR: HARFE ÖZEL AYAR (09.10.2026) ------------------------
       Öğretmen: "bu motoru her harf için teker teker değiştirmeye uygun
       hale getirelim." Aşağıdaki iki sayı BÜTÜN harflerin varsayılanı;
       bir biçim kendi ayarını verebilir ve yalnız o biçim değişir:

         _kaynak/harf-yazim/14-sad-kalin-s.json
         "yazim": { "s": { ..., "motor": { "iz": 1, "esik": 0.14,
                                           "sure": 4600, "hiz": 0.8 } } }

         iz    git-gel hızlanması. 1 = hiç hızlanma yok (kalem geri
               dönüşü de normal hızda yazar). Küçüldükçe hızlanır.
         esik  bir noktanın "zaten geçilmiş" sayılması için gereken
               yakınlık, kalem eninin oranı. 0.22 = 64 enli kalemde
               14 birim. Büyüdükçe daha çok kesim git-gel sayılır.
         sure  bu biçimin yazım süresi (ms). Yoksa yolun uzunluğundan
               hesaplanır (1100-3600 ms arası).
         hiz   süre bölücüsü: 2 = iki kat hızlı, 0.5 = iki kat yavaş.

       KALEM ENİ ayrı: o darbenin kendi `w` değeri, veride duruyor ve
       hem bu kartta hem tablodaki küçük animasyonlarda geçerli. Kalem
       geniş olunca komşu parçalara taşıyor ("ikinci el" görüntüsünün
       öteki sebebi); dar olunca harfin kalın yerleri boyanmadan kalır.
       Bir darbe de kendi `motor`unu taşıyabilir. */
    IZ_ESIK: 0.22,
    motorAl: function (s, ad, varsayilan) {
        var m = s && s.motor;
        return (m && m[ad] !== undefined && m[ad] !== null) ? m[ad] : varsayilan;
    },

    /* ---- DASH DESENİ — "yalnız işaretçi boyasın" (Geylani) -----------
       stroke-dasharray'e TEK değer verilince tarayıcı deseni ikiye
       katlıyor: [L çiz, L boşluk]. Yolun uzunluğu da L olduğu için,
       yol tam bittiği noktada (desen konumu 2L) SIFIR UZUNLUKLU yeni bir
       çizgi başlıyor; stroke-linecap:round olduğundan orası kalem eni
       kadar yuvarlak bir LEKE gibi çiziliyor.
       Sonuç: sırası daha gelmemiş her darbe, BİTİŞ noktasına baştan bir
       mürekkep lekesi bırakıyordu. Kalem harfin bir yerinde yazarken
       uzakta alakasız lekeler duruyordu — ط'nın dik ucundaki elmas,
       harflerin noktaları, ك'nin başlığı hep böyle erken çıkıyordu.
       Çözüm: boşluğu yoldan uzun yapmak. Desen [L, 2L+16] olunca ikinci
       çizginin başlayacağı yer (3L+16) yolun dışına düşüyor, leke yok.
       Görünen kısım aynı: dashoffset = L - gidilen. */
    dashKur: function (el, L) {
        el.style.strokeDasharray = L + ' ' + (L * 2 + 16);
    },

    agirlikProfili: function(s) {
        const iz = this.motorAl(s, 'iz', this.IZ_AGIRLIK);
        const esikOran = this.motorAl(s, 'esik', this.IZ_ESIK);
        /* Önbellek ayarla birlikte anahtarlanır: ayar denerken eski profil
           kalmasın. */
        if (s.prof && s.prof._iz === iz && s.prof._esik === esikOran) return s.prof;
        const el = s.el || s.p, L = el.getTotalLength();
        const N = Math.max(8, Math.min(600, Math.round(L / 6)));
        const px = new Float64Array(N + 1), py = new Float64Array(N + 1);
        for (let i = 0; i <= N; i++) {
            const q = el.getPointAtLength(L * i / N); px[i] = q.x; py[i] = q.y;
        }
        /* 09.10.2026 — 0.45 ÇOK GENİŞTİ. Eşik kalem eninin 0.45'i, yani
           64 enli kalemde 29 birim: kalem geri dönerken yolun 29 birim
           yanından geçse bile "aynı yerden geçiyor" sayılıyordu. Oysa
           kalemin yarıçapı 32; 29 birim yana kaymış dönüş YENİ bir şerit
           açıyor — hem de hızlandırılmış olarak. Eşik 0.22'ye (14 birim)
           indi: yalnız gerçekten üst üste binen dönüşler hızlı geçiliyor,
           yeni mürekkep açan dönüş normal hızda ve kalem eşliğinde. */
        const yc = (s.w || 60) * esikOran, yc2 = yc * yc;
        /* komşu örnekler zaten yakın olur; kalem eninin iki katı kadar geriye bakma */
        const atla = Math.max(3, Math.ceil(N * ((s.w || 60) * 1.6) / L));
        const kum = new Float64Array(N + 1);
        let top = 0;
        for (let i = 1; i <= N; i++) {
            let gecilmis = false;
            for (let j = 0; j <= i - atla; j++) {
                const dx = px[i] - px[j], dy = py[i] - py[j];
                if (dx * dx + dy * dy < yc2) { gecilmis = true; break; }
            }
            top += gecilmis ? iz : 1;
            kum[i] = top;
        }
        s.prof = { L, N, kum, top, etkin: L * (top / N), _iz: iz, _esik: esikOran };
        return s.prof;
    },

    /* ilerleme oranı (0-1) → yol üzerindeki uzunluk */
    profilUzunluk: function(pr, e) {
        if (e <= 0) return 0;
        if (e >= 1) return pr.L;
        const hedef = pr.top * e;
        let lo = 1, hi = pr.N;
        while (lo < hi) { const m = (lo + hi) >> 1; if (pr.kum[m] < hedef) lo = m + 1; else hi = m; }
        const a = pr.kum[lo - 1], b = pr.kum[lo];
        const f = b > a ? (hedef - a) / (b - a) : 0;
        return pr.L * (lo - 1 + f) / pr.N;
    },

    // Kalem darbelerini sırayla, kalem ucu eşliğinde oynat
    /* tekSefer: döngüye girmeden bir kez yazar ve anim.bitince'yi çağırır.
       Harf Birleştirme'deki tablo bunu kullanır — orada sürekli oynayan
       12 animasyon dersi dağıtırdı. anim.hiz: darbe süresi bölücüsü. */
    playForm: function(anim, solo, tekSefer) {
        if (!anim) return;
        if (solo && typeof playClick === 'function') playClick();
        const hz = (anim.hiz || 1) * harfDetay.hizCarpani();
        const items = anim.strokes.map(s => {
            const len = s.el.getTotalLength();
            /* Süre, yolun HAM uzunluğuna değil "etkin" uzunluğuna göre:
               git-gel bölümleri hızlı geçildiği için süreyi şişirmesin. */
            const pr = s.tap ? null : harfDetay.agirlikProfili(s);
            const etkin = pr ? pr.etkin : len;
            /* Biçim kendi süresini verebilir (motor.sure, ms) ve kendi
               hız bölücüsünü (motor.hiz). Yoksa yolun uzunluğundan. */
            const ozelSure = harfDetay.motorAl(s, 'sure', null);
            const ozelHiz = harfDetay.motorAl(s, 'hiz', 1) * hz;
            const taban = s.tap ? 260
                        : (ozelSure !== null ? ozelSure
                           : Math.max(1100, Math.min(3600, etkin * 3.4)));
            return { el: s.el, len, tap: s.tap, pr, dur: taban / ozelHiz };
        });
        // başlangıç: hepsi gizli
        items.forEach(it => {
            harfDetay.dashKur(it.el, it.len);
            it.el.style.strokeDashoffset = it.len;
        });
        /* Her darbenin ilk ve son noktası: aradaki taşımayı çizmek için. */
        items.forEach(it => {
            const b = it.el.getPointAtLength(0), s = it.el.getPointAtLength(it.len);
            it.bas = { x: b.x, y: b.y }; it.son = { x: s.x, y: s.y };
        });
        const nib = anim.nib;
        const ease = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; // easeInOutQuad
        let i = 0, t0 = null;
        const GAP = 90;
        let gapUntil = performance.now() + 120;
        /* KALEM IŞINLANMASIN — TEK EL (Geylani: "birden fazla kalemle farklı
           yerlerden yazılıyor gibi"). Bazı biçimlerde ikinci darbe uzakta
           başlıyor (ج ح خ'de 300 birime kadar, ط ظ'de ~140, ayrıca bütün
           noktalar). Eskiden kalem orada bir anda kayboluyor, uzakta
           beliriyordu — göz bunu ikinci bir el sanıyordu. Artık kalem
           ARADAKİ YOLU da uçarak gidiyor: hafif bir yay çizer, soluklaşır
           ve küçülür (kâğıttan kalkmış kalem), varınca yeniden koyulaşır.
           Bu sırada hiçbir şey boyanmaz — maske değişmiyor, yalnız uç
           hareket ediyor. Harflerin darbe sırası ve şekli aynen duruyor. */
        let ucus = null;

        const step = (now) => {
            if (ucus) {
                const g = Math.min(1, (now - ucus.t0) / ucus.dur);
                const e2 = ease(g);
                const x = ucus.a.x + (ucus.b.x - ucus.a.x) * e2;
                const y = ucus.a.y + (ucus.b.y - ucus.a.y) * e2 - Math.sin(Math.PI * e2) * ucus.kavis;
                nib.setAttribute('transform', `translate(${x},${y}) scale(${1 - 0.22 * Math.sin(Math.PI * e2)})`);
                nib.style.opacity = String(1 - 0.45 * Math.sin(Math.PI * e2));
                if (g >= 1) { ucus = null; nib.style.opacity = '1'; gapUntil = now + GAP; }
                anim.raf = requestAnimationFrame(step);
                return;
            }
            if (i >= items.length) {
                nib.style.visibility = 'hidden'; nib.style.opacity = '1'; anim.raf = null;
                if (tekSefer) { if (anim.bitince) anim.bitince(); return; }
                // Yazım bitti: kısa bir beklemeden sonra baştan başlat (döngü)
                anim.loopT = setTimeout(() => {
                    anim.loopT = null;
                    items.forEach(it => {
                        harfDetay.dashKur(it.el, it.len);
                        it.el.style.strokeDashoffset = it.len;
                    });
                    harfDetay.playForm(anim, false);
                }, 1800);
                return;
            }
            if (now < gapUntil) { anim.raf = requestAnimationFrame(step); return; }
            const it = items[i];
            if (t0 === null) { t0 = now; nib.style.visibility = 'visible'; nib.style.opacity = '1'; }
            const t = Math.min(1, (now - t0) / it.dur);
            const e = ease(t);
            const gidilen = it.pr ? harfDetay.profilUzunluk(it.pr, e) : it.len * e;
            it.el.style.strokeDashoffset = it.len - gidilen;
            const pt = it.el.getPointAtLength(gidilen);
            nib.setAttribute('transform', `translate(${pt.x},${pt.y})`);
            if (t >= 1) {
                i++; t0 = null;
                const sonraki = items[i];
                if (sonraki) {
                    const a = it.son, b2 = sonraki.bas;
                    const uz = Math.hypot(b2.x - a.x, b2.y - a.y);
                    if (uz > 8) {
                        /* Uzaklığa göre süre: yakın atlama çabuk, uzak atlama
                           biraz daha uzun ama hiçbir zaman yazımdan yavaş değil. */
                        ucus = { a: a, b: b2, t0: now,
                                 dur: Math.max(190, Math.min(560, uz * 1.35)) / hz,
                                 kavis: Math.min(80, uz * 0.24) };
                    } else {
                        gapUntil = now + GAP;
                    }
                }
            }
            anim.raf = requestAnimationFrame(step);
        };
        anim.raf = requestAnimationFrame(step);
    },

    /* Bir biçimi yazılmamış hâle döndürür (maske tamamen kapalı). */
    sifirla: function(a) {
        a.strokes.forEach(s => {
            const len = s.el.getTotalLength();
            harfDetay.dashKur(s.el, len);
            s.el.style.strokeDashoffset = len;
        });
    },

    /* DÖRT BİÇİM SIRAYLA YAZILIR — EKRANDA HER AN TEK KALEM (Geylani:
       "bir harfte aynı anda birden fazla noktada birden fazla doğrultuda
       yazı yazılmamalı").
       ESKİDEN dördü aynı anda başlıyordu: bir harfin dört biçimi dört
       ayrı kutuda, dört ayrı yönde, dört kalemle ilerliyordu. "Tek kalem"
       kuralının yalnız bir biçimin KENDİ içinde geçerli olduğu kabulüydü;
       ekranda görünen ise dört el birden yazıyordu.
       ŞİMDİ sıra: Başta → Ortada → Sonda → Yalın (sağdan sola, okuma
       yönü). Biten biçim ekranda kalır, sıradakine geçilir; tur bitince
       hepsi silinip baştan başlanır. Bir kutuya tıklamak yalnız o biçimi
       oynatır — o zaman da ekranda tek kalem olur. */
    animate: function() {
        if (!this.anims) return;
        this.stopAll();
        if (typeof playClick === 'function') playClick();
        this.turBaslat();
    },

    /* BİR TUR: dört biçim de AYNI ANDA yazmaya başlar. Boyları farklı
       olduğu için bitiş anları farklıdır; tur, EN GEÇ biteni bekler,
       sonra hepsi birlikte silinip birlikte yeniden başlar.
       Eskiden her biçim KENDİ döngüsünde dönüyordu: tur boyları farklı
       olduğundan birkaç turda birbirlerine göre kayıyor, kartta üç biçim
       aynı anda ama farklı yerlerinden yazar hâle geliyordu. Kayma budur;
       aynı anda başlamak sorun değil. */
    /* TEK KALEM — BİÇİMLER SIRAYLA (09.10.2026)
       Öğretmen: "her harf için sadece bir kalem kullanılıyor gibi olsun,
       ama iki hatta üç kalemle birden yazılıyormuş gibi oluyor; biri başı
       boyuyor biri harfin ortasını veya sonunu."
       Sebebi buydu: tur başlarken DÖRT BİÇİM DE AYNI ANDA başlıyordu
       (eski kod anims.forEach içinde hepsini birden playForm'a veriyordu).
       Ekranda dört kutuda dört kalem birden yazıyor; göz bunu "birkaç el"
       diye okuyor — kutular ayrı olsa bile.
       Artık sıra: Başta -> Ortada -> Sonda -> Yalın (sağdan sola, okuma
       yönü; FORM_META sırası). Biten biçim ekranda kalır, sıradaki başlar;
       ekranda HER AN TEK KALEM olur. Tur bitince kısa bekleme, sonra
       hepsi silinip baştan. Bir kutuya tıklamak yalnız onu oynatır. */
    /* Hangi kipte yazılacağı. VARSAYILAN: 'hepsi' — dört biçim aynı anda
       (Geylani, 11.10.2026: "hepsi birden açılsın ve bu varsayılan olsun").
       Anahtar adı da yenilendi: eski tarayıcılarda saklı 'sira' seçimi yeni
       varsayılanı bastırmasın. */
    mod: 'hepsi',
    modOku: function () {
        try {
            const v = localStorage.getItem('kidefHarfYazimKipi');
            if (v === 'sira' || v === 'hepsi') return v;
        } catch (e) {}
        return 'hepsi';
    },
    modSec: function (m) {
        this.mod = (m === 'sira') ? 'sira' : 'hepsi';
        try { localStorage.setItem('kidefHarfYazimKipi', this.mod); } catch (e) {}
        const kutu = document.getElementById('hd-kip');
        if (!kutu) return;
        const self = this;
        kutu.querySelectorAll('button[data-mod]').forEach(function (b) {
            const acik = (b.dataset.mod === self.mod);
            b.classList.toggle('hd-kip-acik', acik);
            b.setAttribute('aria-pressed', acik ? 'true' : 'false');
        });
    },

    /* 5 kademe hız: 3 = eskiden beri kullanılan normal hız. */
    HIZ_KADEME: [0.5, 0.72, 1, 1.45, 2.1],
    hiz: 2,
    hizOku: function () {
        try {
            const v = parseInt(localStorage.getItem('kidefYazimHizi'), 10);
            if (v >= 0 && v <= 4) return v;
        } catch (e) {}
        return 2;
    },
    hizSec: function (i) {
        this.hiz = (i >= 0 && i <= 4) ? i : 2;
        try { localStorage.setItem('kidefYazimHizi', String(this.hiz)); } catch (e) {}
        const kutu = document.getElementById('hd-hiz');
        if (!kutu) return;
        const self = this;
        kutu.querySelectorAll('button[data-hiz]').forEach(function (b) {
            const acik = (+b.dataset.hiz === self.hiz);
            b.classList.toggle('hd-kip-acik', acik);
            b.setAttribute('aria-pressed', acik ? 'true' : 'false');
        });
    },
    hizCarpani: function () {
        return this.HIZ_KADEME[this.hiz] || 1;
    },

    /* BİÇİM ÖRNEĞİ (11.10.2026) — bir kutuya dokununca o biçimin kelime
       içinde nasıl göründüğü alttaki şeritte açılır. Kelimeler sitenin
       kendi listelerinden (Kidef Arapça kitabının kelimeleri) seçildi;
       harf kırmızıyla vurgulanır. Soluna bitişmeyen altı harfin baştaki /
       ortadaki biçimi yoktur — orada bunun açıklaması çıkar. */
    /* ===== ODAK GÖRÜNÜMÜ (11.10.2026) ==========================
       Geylani: "4 harften birine tıklayınca diğer üçü küçülsün, seçilen
       çok büyük olsun; seçilene tekrar tıklanınca 4 yazılışa dönülsün;
       altında o biçimin üç örneği."
       Dört kutu yerinde kalır, seçilen kutu şeridin çoğunu kaplar,
       öbür üçü küçülür ve tamamlanmış hâlleriyle beklerler. Seçilen
       biçim döngüyle yazılır; altında o biçimin ÜÇ kelime örneği. */
    odakIdx: -1,

    /* Bir biçimi tamamlanmış göster (küçülen kutular boş kalmasın). */
    doldur: function (a) {
        if (!a) return;
        this.cancelForm(a);
        a.strokes.forEach(st => { st.el.style.strokeDashoffset = 0; });
        if (a.nib) a.nib.style.visibility = 'hidden';
    },

    /* ---- Odak geçişi: FLIP ----------------------------------------
       Sütunların yeni düzeni ANINDA kurulur, sonra her sütun eski yerinden
       yenisine yumuşakça kayar/ölçeklenir. CSS geçişiyle yapınca yükseklik
       auto -> uzunluk olduğu için zıplıyordu (Geylani, 11.10.2026:
       "büyüme animasyonu çok daha yavaş ve akışkan olsun"). */
    ODAK_SURE: 820,
    ODAK_EGRI: 'cubic-bezier(.22,.75,.24,1)',

    flipOlc: function () {
        return [...document.querySelectorAll('#hd-cols .hd-col')]
            .map(function (e) { return e.getBoundingClientRect(); });
    },

    flipOynat: function (ilk) {
        const kol = [...document.querySelectorAll('#hd-cols .hd-col')];
        const sure = this.ODAK_SURE, egri = this.ODAK_EGRI;
        kol.forEach(function (e, j) {
            const a = ilk[j]; if (!a || !a.width) return;
            const b = e.getBoundingClientRect(); if (!b.width || !b.height) return;
            const sx = a.width / b.width, sy = a.height / b.height;
            const dx = (a.left + a.width / 2) - (b.left + b.width / 2);
            const dy = (a.top + a.height / 2) - (b.top + b.height / 2);
            if (Math.abs(dx) < .5 && Math.abs(dy) < .5 &&
                Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) return;
            if (!e.animate) return;
            e.animate([
                { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')' },
                { transform: 'none' }
            ], { duration: sure, easing: egri, fill: 'none' });
        });
    },

    tekAc: function (h, fm, i) {
        this.stopAll();
        if (typeof playClick === 'function') playClick();
        this.odakIdx = i;
        const ilkYer = this.flipOlc();           /* FLIP: eski yerler */
        const cols = document.getElementById('hd-cols');
        if (cols) {
            cols.classList.add('hd-odakli');
            /* RTL ızgara: sütun sırası dizideki sıra. Seçilen geniş, ötekiler dar. */
            cols.style.gridTemplateColumns = this.anims.map((x, j) => (j === i ? '4.6fr' : '1fr')).join(' ');
        }
        const kutular = document.querySelectorAll('#hd-cols .hd-col');
        for (let j = 0; j < kutular.length; j++) {
            kutular[j].classList.toggle('hd-buyuk', j === i);
            kutular[j].classList.toggle('hd-kucuk', j !== i);
        }
        /* Seçilen yazılırken ötekiler tamamlanmış dursun. */
        this.anims.forEach((a, j) => { if (j !== i) this.doldur(a); });
        const sec = this.anims[i];
        if (sec) {
            /* Harf büyük kutuyu doldursun: viewBox kendi sınırlarına kırpılır. */
            try {
                if (!sec.vbAsil) sec.vbAsil = sec.svg.getAttribute('viewBox');
                const hayalet = sec.svg.querySelector('.hd-ghost');
                const bb = hayalet ? hayalet.getBBox() : null;
                if (bb && bb.width > 0) {
                    const pay = Math.max(bb.width, bb.height) * 0.08 + 18;
                    const y1 = Math.min(bb.y, 400) - pay, y2 = Math.max(bb.y + bb.height, 420) + pay;
                    sec.svg.setAttribute('viewBox',
                        (bb.x - pay) + ' ' + y1 + ' ' + (bb.width + pay * 2) + ' ' + (y2 - y1));
                }
            } catch (e) { }
            this.sifirla(sec);
            /* Yazma, büyüme bitmeye yakın başlasın: ikisi üst üste binince
               hareket karışık görünüyordu. */
            this.timers.push(setTimeout(() => this.playForm(sec, false), 460));
        }
        this.flipOynat(ilkYer);                  /* FLIP: yumuşak geçiş */
        /* Üç örnek */
        const liste = (typeof HARF_ORNEK_BICIM !== 'undefined' && HARF_ORNEK_BICIM[h.h])
            ? (HARF_ORNEK_BICIM[h.h][fm.key] || []) : [];
        const bitismez = (typeof HARF_BITISMEZ !== 'undefined') && HARF_BITISMEZ.indexOf(h.h) >= 0;
        const oku = document.getElementById('hd-tek-ornek');
        oku.hidden = false;
        if (!liste.length) {
            oku.innerHTML = '<div class="hd-tek-bos">' +
                (bitismez && (fm.key === 'b' || fm.key === 'o')
                    ? h.tr + ' soluna bitişmez: kelimede bu biçimde yazılmaz, ' +
                      '<b>yalın</b> ya da <b>sondaki</b> biçimiyle görünür.'
                    : 'Bu biçim için örnek kelime eklenmedi.') + '</div>';
        } else {
            oku.innerHTML = liste.map(function (o) {
                return '<div class="hd-tek-kart">'
                    + '<span class="hd-tek-ar" dir="rtl">' + o.on
                    + '<b>' + o.vu + '</b>' + o.son + '</span>'
                    + '<span class="hd-tek-tr">' + o.tr + '</span></div>';
            }).join('');
        }
    },

    tekKapat: function () {
        const oku = document.getElementById('hd-tek-ornek');
        if (oku) { oku.hidden = true; oku.innerHTML = ''; }
        const cols = document.getElementById('hd-cols');
        const geri = this.odakIdx >= 0;
        const ilkYer = geri ? this.flipOlc() : null;
        if (cols) { cols.classList.remove('hd-odakli'); cols.style.gridTemplateColumns = ''; }
        const kutular = document.querySelectorAll('#hd-cols .hd-col');
        for (let j = 0; j < kutular.length; j++) {
            kutular[j].classList.remove('hd-buyuk', 'hd-kucuk');
        }
        (this.anims || []).forEach(a => {
            if (a.vbAsil) { a.svg.setAttribute('viewBox', a.vbAsil); a.vbAsil = null; }
        });
        if (ilkYer) this.flipOynat(ilkYer);
        this.odakIdx = -1;
        if (geri) this.timers.push(setTimeout(() => this.animate(), this.ODAK_SURE * 0.55));
    },

    turBaslat: function() {
        if (!this.anims || !this.anims.length) return;
        return (this.mod === 'hepsi') ? this.turHepsi() : this.turSirayla();
    },

    turSirayla: function() {
        this.anims.forEach(a => this.sifirla(a));
        const self = this;
        const sirayla = function (i) {
            self.yazanIsaretle(i);
            if (i >= self.anims.length) {
                self.timers.push(setTimeout(function () { self.turBaslat(); }, 1700));
                return;
            }
            const a = self.anims[i];
            a.bitince = function () { a.bitince = null; sirayla(i + 1); };
            self.playForm(a, false, true);
        };
        sirayla(0);
    },

    /* HEPSİ BİRDEN: dört biçim aynı anda başlar. Boyları farklı olduğu
       için bitiş anları da farklıdır; tur EN GEÇ biteni bekler, sonra
       hepsi birlikte silinip birlikte yeniden başlar (her biçim kendi
       döngüsünde dönerse turlar birbirine göre kayıyordu). Bu kipte
       ekranda dört kalem birden olur — öğretmenin seçimi. */
    turHepsi: function() {
        this.anims.forEach(a => this.sifirla(a));
        this.yazanIsaretle(-1);
        const self = this;
        let kalan = this.anims.length;
        this.anims.forEach(function (a) {
            a.bitince = function () {
                a.bitince = null;
                if (--kalan <= 0) {
                    self.timers.push(setTimeout(function () { self.turBaslat(); }, 1700));
                }
            };
            self.playForm(a, false, true);
        });
    },

    /* Hangi biçim yazılıyorsa onun kutusu belirgin dursun: göz sıranın
       nerede olduğunu arama sın. -1 / sınır dışı = hiçbiri. */
    yazanIsaretle: function (i) {
        const kutular = document.querySelectorAll('#hd-cols .hd-col');
        for (let j = 0; j < kutular.length; j++) {
            kutular[j].classList.toggle('hd-yazan', j === i);
        }
    }
};


/* =====================================================================
   IZGARA CANLI YAZIM — Harf Tanıtımı ekranındaki tüm kartlarda
   4 form sürekli döngüyle yazılır (tek global saat, hafif).
   ===================================================================== */
const harfGrid = {
    items: [],      // {el, len, t0, dur, tap, cycle, form}
    started: false,
    /* Izgara animasyonu varsayılan olarak KAPALI: 28 kart aynı anda
       yazılınca ekran fazla hareketli oluyor. Başlıktaki yazılış düğmesi
       (yazimAnim) bu bayrağı açıp kapatır. Kapalıyken harfler tamamlanmış
       hâlde durur; büyüteç (harfDetay) bundan etkilenmez. */
    calis: false,
    t0: null,         // animasyon açıldığı andaki saat (hepsi baştan başlasın)
    oturanSay: -1,    // kapalıyken tam hâline oturtulan darbe sayısı
    /* HEPSİ BİRDEN YAZILIR (29.09.2026, öğretmen isteği: "dat harfine
       basınca tüm harflerin yazılış animasyonu başlasın"). Arada bir
       dönem sıra tek kartta dolaşıyordu; düğmeye basınca ekranda yalnız
       bir küçük kart yazdığı için "çalışmıyor" gibi görünüyordu.
       Aşağıdaki kartlar/aktifKart alanları o düzenden kaldı: kartlar
       hâlâ dolduruluyor (ileride yine gerekirse dursun), ama tick()
       artık hepsini birden sürüyor. */
    kartlar: [],      // kart no → o kartın darbeleri
    aktifKart: 0,
    kartT0: null,
    tazele: true,

    init: function() {
        if (this.started) return;
        const cards = document.querySelectorAll('#g1 .char-card');
        if (!cards.length || typeof HARF_YAZIM === 'undefined') return;
        this.started = true;
        const NS = 'http://www.w3.org/2000/svg';
        const H = 58; // mini kutu yüksekliği (px)

        cards.forEach((card, sira) => {
            /* Kartlar tabloda yılan dizilimle durduğu için DOM sırası alfabe sırası
               değildir: hangi harf olduğunu data-idx söyler. */
            const idx = card.dataset.idx != null ? +card.dataset.idx : sira;
            const h = harfler[idx];
            const yaz = HARF_YAZIM[h.h];
            if (!yaz) return;
            const seq = card.querySelector('.arabic-seq');
            if (!seq) return;
            seq.classList.add('hg-live');
            const spans = seq.querySelectorAll('span');
            const order = ['b','o','s','n']; // span sırası: b,o,s,n
            /* Kartın dört biçiminin darbeleri, TEK zaman çizelgesine
               dizilmek üzere burada toplanır (bkz. aşağıdaki not). */
            const kartYapim = [];
            spans.forEach((span, si) => {
                const data = yaz[order[si]];
                if (!data) return;
                span.textContent = '';
                const svg = document.createElementNS(NS, 'svg');
                svg.setAttribute('viewBox', data.vb.join(' '));
                const w = Math.round(data.vb[2] / data.vb[3] * H);
                svg.setAttribute('width', w); svg.setAttribute('height', H);
                svg.setAttribute('class', 'hg-svg');
                const id = 'hg' + idx + '_' + si;
                const defs = document.createElementNS(NS, 'defs');
                const mask = document.createElementNS(NS, 'mask');
                mask.setAttribute('id', id);
                const bg = document.createElementNS(NS, 'rect');
                bg.setAttribute('x', data.vb[0]); bg.setAttribute('y', data.vb[1]);
                bg.setAttribute('width', data.vb[2]); bg.setAttribute('height', data.vb[3]);
                bg.setAttribute('fill', 'black');
                mask.appendChild(bg);

                // zaman planı: darbeler sıralı + noktalar + bekleme
                const plan = [];
                let t = 300; // döngü başı küçük bekleme
                data.strokes.forEach(s => {
                    plan.push({ d: s.d, w: s.w, t0: t, dur: Math.max(900, Math.min(2800, 0)) , len: 0, tap: false, dRaw: s });
                    t = t; // len bilinmeden süre: aşağıda ölçüp güncellenir
                });
                // stroke elemanlarını oluştur, uzunlukla süre hesapla
                const made = [];
                const mkP = (s, tap) => {
                    const p = document.createElementNS(NS, 'path');
                    p.setAttribute('d', s.d);
                    p.setAttribute('fill', 'none');
                    p.setAttribute('stroke', 'white');
                    p.setAttribute('stroke-width', s.w);
                    p.setAttribute('stroke-linecap', 'round');
                    p.setAttribute('stroke-linejoin', 'round');
                    mask.appendChild(p);
                    made.push({ p, tap, w: s.w });
                };
                data.strokes.forEach(s => mkP(s, false));
                data.taps.forEach(t => {
                    if (!t.sh) return;
                    const shp = document.createElementNS(NS, 'path');
                    shp.setAttribute('d', t.sh);
                    shp.setAttribute('fill', 'black');
                    mask.appendChild(shp);
                });
                data.taps.forEach(t => mkP(t, true));
                defs.appendChild(mask);
                svg.appendChild(defs);

                const ghost = document.createElementNS(NS, 'path');
                ghost.setAttribute('d', data.fill);
                ghost.setAttribute('class', 'hg-ghost');
                svg.appendChild(ghost);

                const ink = document.createElementNS(NS, 'path');
                ink.setAttribute('d', data.fill);
                ink.setAttribute('fill', 'currentColor');
                ink.setAttribute('mask', `url(#${id})`);
                svg.appendChild(ink);
                span.appendChild(svg);
                kartYapim.push(made);
            });

            /* BİR KART = BİR EL (Geylani: "aynı anda birden fazla noktada
               birden fazla doğrultuda yazı yazılmamalı").
               ESKİDEN: kartın dört biçimi AYRI AYRI döngülerle dönüyordu.
               Döngü boyları harfe ve biçime göre farklı (ölçüldü: 2870 ile
               3490 ms arası), hepsi tek bir global saatten `zaman % cycle`
               ile besleniyordu — yani biçimler birbirine göre kayıyordu ve
               kısa sürede bir kartta ÜÇ biçim aynı anda yazar hâle geliyordu
               (ölçüldü). Ekranda kalem olmadığı için bu, "aynı harfi birkaç
               el birden yazıyor" gibi görünüyordu; büyüteçteki (harfDetay)
               tek kalemli yazımla da çelişiyordu — aranan "iki farklı şey"
               buydu.
               ŞİMDİ: kartın bütün darbeleri TEK çizelgeye art arda diziliyor
               ve dördü aynı `cycle` değerini paylaşıyor. Her an yalnız BİR
               biçim, BİR noktada ilerliyor; biten biçim ekranda kalır, tur
               bitince hepsi birden silinip baştan başlanır.
               Sıra dörde çıktığı için mini kutuların yazım süresi biraz
               kısaltıldı, tur uzamasın. */
            const kartNo = harfGrid.kartlar.length;
            harfGrid.kartlar.push([]);
            card.__hgKart = kartNo;
            /* 29.09.2026: "fareyle gelince sıra bu karta geçsin" kalktı —
               artık bütün kartlar birlikte yazıyor, sırasını bekleyen
               kart yok. */
            requestAnimationFrame(() => {
                const group = [];
                let enGec = 300;
                kartYapim.forEach(made => {
                    /* HER BİÇİM 300 ms'de, YANİ AYNI ANDA başlar (Geylani).
                       Birikimli değil: t0 her biçimde sıfırlanıyor. */
                    let tt = 300;
                    made.forEach(m => {
                        const len = m.p.getTotalLength();
                        const dur = m.tap ? 220 : Math.max(900, Math.min(2600, len * 2.4));
                        harfDetay.dashKur(m.p, len);
                        m.p.style.strokeDashoffset = len;
                        /* pr (git-gel hız profili) TEMBEL hesaplanır: 112 biçimin
                           profilini sayfa açılışında çıkarmak yarım saniye tutuyor.
                           tick() kare başına birkaç tane hesaplar. */
                        group.push({ el: m.p, len, t0: tt, dur, w: m.w, pr: undefined, kart: kartNo });
                        tt += dur + (m.tap ? 90 : 170);
                    });
                    if (tt > enGec) enGec = tt;   // tur, en geç biteni bekler
                });
                const cycle = enGec + 1400; // tur sonu bekleme
                group.forEach(g => { g.cycle = cycle; harfGrid.items.push(g);
                                     harfGrid.kartlar[kartNo].push(g); });
            });
        });
        this.tick = this.tick.bind(this);
        requestAnimationFrame(this.tick);
        // kutuları karta göre ölçekle (kart sınırlarını sonuna kadar kullan)
        requestAnimationFrame(() => requestAnimationFrame(() => harfGrid.layout()));
        let rt;
        window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => harfGrid.layout(), 150); });
    },

    // Her kartın iç genişlik/yüksekliğini ölçüp mini kutuları büyütür.
    // Ölçek tüm kartlarda ortaktır; sadece çok geniş harfler (ص ض) kendi kartına sığacak kadar küçülür.
    layout: function() {
        const grid = document.getElementById('g1');
        if (!grid) return;
        const cards = grid.querySelectorAll('.char-card');
        if (!cards.length) return;
        const GAP = 9;
        const info = [];
        // Ölçmeden önce kutuları sıfırla: aksi halde mevcut SVG genişlikleri
        // sütunları kendisi genişletiyor ve ölçüm döngüye giriyor.
        const allSvg = grid.querySelectorAll('svg.hg-svg');
        const setH = function(s, h) {
            const vb = s.getAttribute('viewBox').split(/\s+/);
            s.style.height = h.toFixed(1) + 'px';
            s.style.width = ((+vb[2]) / (+vb[3]) * h).toFixed(1) + 'px';
        };
        allSvg.forEach(s => { s.style.width = '0px'; s.style.height = '0px'; });
        void grid.offsetWidth; // reflow
        // Mobilde ızgara satırları "auto": kart yüksekliği içeriğe göre büyür,
        // yani yükseklik bir sınır değildir; ölçüyü genişlik belirler.
        const rowsAuto = window.matchMedia('(max-width: 768px)').matches;
        cards.forEach(card => {
            const seq = card.querySelector('.arabic-seq.hg-live');
            if (!seq) return;
            const svgs = Array.prototype.slice.call(seq.querySelectorAll('svg.hg-svg'));
            if (!svgs.length) return;
            let sum = 0;
            svgs.forEach(s => {
                const vb = s.getAttribute('viewBox').split(/\s+/);
                sum += (+vb[2]) / (+vb[3]);
            });
            if (!sum) return;
            const label = card.querySelector('.tr-label');
            // Formlar arası boşluk kart genişliğine göre: küçük kartlarda boşluk
            // harflerden çalmasın.
            const raw = seq.clientWidth;
            const g = Math.max(3, Math.min(GAP, raw / 24));
            seq.style.gap = g.toFixed(1) + 'px';
            const availW = raw - g * (svgs.length - 1) - 2;
            let availH = rowsAuto ? Infinity
                                  : card.clientHeight - (label ? label.offsetHeight : 0) - 12;
            if (availH < 18) availH = 18;
            if (availW <= 0) return;
            info.push({ svgs: svgs, fitW: availW / sum, fitH: availH });
        });
        if (!info.length) {
            // Ölçüm yapılamadıysa kutuları sıfırda bırakma: güvenli bir boya dön.
            allSvg.forEach(s => setH(s, 46));
            return;
        }
        const fits = info.map(o => Math.min(o.fitW, o.fitH)).sort((a, b) => a - b);
        const base = fits[Math.min(2, fits.length - 1)];
        /* Odak (tam ekran) modunda kartlar çok daha yüksek: üst sınır da açılır,
           yoksa harfler 130px'te takılıp kart içinde küçük görünüyor. */
        const enBuyuk = document.body.classList.contains('harf-tam') ? 210 : 130;
        const H = Math.max(18, Math.min(enBuyuk, base));
        info.forEach(o => {
            const h = Math.max(18, Math.min(H, o.fitW, o.fitH));
            o.svgs.forEach(s => setH(s, h));
        });
    },

    tick: function(now) {
        // sadece Harf Tanıtımı sekmesi görünürken çalış
        const p1 = document.getElementById('p1');
        /* ÜSTTE KATMAN VARSA DUR (09.10.2026) — "iki farklı çizim"in asıl
           sebebi buydu. Büyüteç (hd-overlay) ya da Kendini Dene / İstenen
           Harfi Yaz (body.ak-acik) açıkken tablodaki 203 darbe ARKADA
           yazmaya devam ediyordu. Görünmüyorlar (katman bulanık ve koyu)
           ama her kareyi yiyorlardı: ölçüm, katman açıkken büyüteçteki
           animasyon 12-20 kare/sn'ye düşüyor, kalem bir karede 150 birim
           birden atlıyor ve mürekkep kalemsiz beliriyordu. Katman kapanınca
           tablo kaldığı yerden devam eder. */
        const hdOv = document.getElementById('hd-overlay');
        const ustteKatman = document.body.classList.contains('ak-acik') ||
                            !!(hdOv && hdOv.style.display === 'flex');
        if (!ustteKatman && document.visibilityState === 'visible' &&
            p1 && p1.classList.contains('active')) {
            if (this.calis) {
                /* HEPSİ BİRDEN (29.09.2026, öğretmen isteği). Her kartın
                   kendi turu var (cycle: o kartın dört biçiminin en geç
                   biteni + 1400 ms bekleme); hepsi ortak saatten
                   `zaman % cycle` ile besleniyor. Turlar eşit olmadığı
                   için kartlar birbirine göre kayıyor: ekran tek ağızdan
                   değil, doğal görünüyor. Tur bitince harf tamamlanmış
                   durur, bekleme sonunda silinip baştan yazılır. */
                if (this.t0 == null) this.t0 = now;
                const zaman = now - this.t0;
                let butce = 3;      /* kare başına en çok 3 profil hesabı */
                for (const it of this.items) {
                    const t = it.cycle ? (zaman % it.cycle) : zaman;
                    let f;
                    if (t < it.t0) f = 0;
                    else if (t >= it.t0 + it.dur) f = 1;
                    else { const x = (t - it.t0) / it.dur; f = x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x + 2, 2) / 2; }
                    if (it.pr === undefined && butce > 0) {
                        it.pr = it.w ? harfDetay.agirlikProfili(it) : null;
                        butce--;
                    }
                    /* Değişmeyen darbeye dokunma: 203 darbenin çoğu her
                       karede aynı yerde duruyor (tur sonu beklemesi,
                       sırası gelmemiş darbeler). Yazmayınca tarayıcı
                       boşuna stil hesabı yapmıyor. */
                    const v = it.pr
                        ? it.len - harfDetay.profilUzunluk(it.pr, f)
                        : it.len * (1 - f);
                    if (it.son === undefined || Math.abs(it.son - v) > 0.25) {
                        it.el.style.strokeDashoffset = v; it.son = v;
                    }
                }
                this.oturanSay = -1;
            } else if (this.oturanSay !== this.items.length) {
                /* Kapalıyken harfler yarım kalmasın: her darbe tam açılır,
                   kart normal (statik) harf gibi görünür. Darbeler init()
                   sırasında parça parça eklendiği için sayı değişince
                   yeniden oturtulur. */
                for (const it of this.items) { it.el.style.strokeDashoffset = 0; it.son = 0; }
                this.oturanSay = this.items.length;
            }
        }
        requestAnimationFrame(this.tick);
    }
};
// ui.init() kartları kurduktan sonra devreye gir
document.addEventListener('DOMContentLoaded', () => setTimeout(() => harfGrid.init(), 60));
setTimeout(() => harfGrid.init(), 800); // emniyet
