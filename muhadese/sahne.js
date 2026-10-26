/* =====================================================================
   MUHÂDESE · CÜMLE SAHNELERİ                         (muhadese/sahne.js)
   ---------------------------------------------------------------------
   26.10.2026 — Öğretmen: "muhadese html de her cümle için animasyonlu svg
   ler yapalım, çocuklar anlamı tahmin edebilsinler hem dikkat toplayıcı
   ve güzelleştirici de olur, illa cümlenin %100 de 100 anlamaya gerek yok,
   çağrıştıran merak ettiren bi şekilde de olur".

   NE YAPAR
   Cümle ve diyalog pratiğinde her cümlenin yanına küçük, canlı bir sahne
   kartı koyar: sitenin SVG kütüphanesinden (veri/veri_svg.js) 1-3 resim,
   aralarında gerekirse ok (gitmek), kalp (sevmek) ya da artı (ve);
   soru cümlesinde «?», olumsuzda kırmızı çarpı (olumsuz sözün ait olduğu
   resmin üstünde), sayı geçiyorsa sayı rozeti, renk geçiyorsa renk
   lekesi. Zemin cümlenin havasına göre (gece, sabah, yağmur, kar, deniz,
   okul, cami…) değişir. Resme dokununca canlanması baştan oynar.
     cümle kipi   : Türkçe parçaların üstünde
     diyalog kipi : geniş ekranda satırın yanında (1. kişi solda, 2. kişi
                    sağda; satır yüksekliği değişmez), dar ekranda üstünde

   NASIL SEÇER (veri dosyalarına dokunmadan, her cümle için kendiliğinden)
     Cümlenin her parçası (Türkçe öbek ↔ Arapça karşılığı) ayrı ele alınır:
     1. KAVRAMLAR listesindeki Türkçe tetikleyiciler (t):
           okul     kelime başı (okula, okulda, okulumuz…)
           =su      yalnız tam kelime (su, su'yu)
           ~ev(e|de)?  kelimenin tamamı bu düzenli ifadeye uymalı
           'yaz '   sondaki boşluk: tam kelime; boşluklu tetikleyici öbektir
        Uzun tetikleyici önce gelir ve kelimeyi «harcar» (kızgın ≠ kız).
        Sayı ve renk sözleri önce harcanır (yedi = 7, kahverengi = renk).
     2. Türkçesi hiçbir şey getirmeyen parçada Arapça biçimler (a; harekesiz,
        و ف ب ل ك ال önekleri ve zamir ekleri soyularak), o da yoksa kök
        (k; muhadese/veri/kok_haritasi.js). Böylece aynı kelime iki dilden
        iki ayrı resim getirmez.
     3. Çok kelimeli Türkçe tetikleyiciler parçalar arasında da aranır.
     4. Seçim: kişi → eylem/nesne → yer → zaman, en çok 3 (diyalogda 2).
        «Genel» kavramlar (z: takvim, saat, hava, konuşmak, yol) yalnız
        sahne tek resimle kalacaksa eklenir.
     5. Hiçbir kavram yoksa dersin konusundan (KONU) bir resim gelir.
     6. ELLE: window.KIDEF_SAHNE_ELLE[harekesiz Arapça cümle] = 'id id ?'
        gibi bir tarif verilirse otomatik seçim yerine o kullanılır (tarif
        dili aşağıda, tarifCoz işlevinde).
   Kütüphanede bulunmayan resimler sessizce atlanır: kütüphaneye yeni bir
   SVG girdiği gün (ve KAVRAMLAR'da bir kavrama bağlanınca) sahnede görünür.
   Kütüphane büyük olduğu için muhadese.html onu async yükler; gelmeden
   istenen sahne, kütüphane gelince çizilir.

   AÇ/KAPA: şeritteki resim tuşu (localStorage kidefSahne = '0' kapalı).
   Hareketi azalt / düşük güç kipinde canlandırma durur.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefSahne) return;
    var S = window.KidefSahne = {};

    /* ------------------------------------------------------------- KAVRAMLAR
       r: rol — kisi · eylem · nesne · yer · zaman · his · ifade
       m: sahnenin zemini (tema) — isteğe bağlı                              */
    var KAVRAMLAR = [
        /* --- selamlaşma ve kalıp ifadeler --- */
        { id: 'merhaba', r: 'ifade', t: ['merhaba', 'selam', 'güle güle', 'hoşça kal', 'elveda', 'veda', 'görüşmek üzere', 'görüşürüz', 'görüşeceğiz', 'nasılsın', 'nasılsınız', 'halin nasıl', 'hâlin nasıl'], a: ['مرحبا', 'السلام', 'سلام', 'مع السلامه', 'وداعا', 'اهلا', 'الي اللقاء', 'نلتقي', 'كيف حالك'], k: ['ودع'] },
        { id: 'tesekkur', r: 'ifade', t: ['teşekkür', 'sağ ol', 'sağol', 'eyvallah', 'rica eder'], a: ['شكرا', 'عفوا'], k: ['شكر'] },
        { id: 'tanisma', r: 'ifade', t: ['tanıştı', 'memnun oldum', 'memnun old', 'adın ne', 'adınız', '=adım', 'ismin', 'ismim'], a: ['تشرفنا', 'اسمي', 'اسمك', 'ما اسم', 'تعارف'] },
        { id: 'hosgeldin', r: 'ifade', t: ['hoş geldi', 'hoşgeldi', 'hoş bulduk', 'buyur'], a: ['اهلا وسهلا', 'اهلا بك', 'مرحبا بك'] },
        { id: 'gunaydin', svg: 'sabah', r: 'zaman', t: ['günaydın', 'sabah'], a: ['صباح'], m: 'sabah' },
        { id: 'iyi-geceler', svg: 'gece', r: 'zaman', t: ['iyi gece', 'gece', 'geceleri'], a: ['ليله', 'مساء الخير'], m: 'gece' },

        /* --- aile ve kişiler --- */
        { id: 'anne', r: 'kisi', t: ['anne', 'annem', 'annen', 'annes', 'anneci', 'valide', 'teyze', '=hala', 'halam', 'halan'], a: ['امي', 'امك', 'امه', 'امها', 'امنا', 'امكم', 'والده', 'والدتي', 'خاله', 'عمه'], k: ['Aile: Anne', 'Aile: Teyze', 'Aile: Hala'] },
        { id: 'baba', r: 'kisi', t: ['baba', 'babam', 'baban', 'babas', 'babacı', 'amca', 'dayı', 'dayım'], a: ['اب', 'ابو', 'والد', 'خال', 'عم'], k: ['Aile: Baba', 'Aile: Amca', 'Aile: Dayı'] },
        { id: 'erkek-kardes', r: 'kisi', t: ['erkek kardeş', 'ağabey', 'abi', 'abim', 'kardeşim', 'kardeşin', 'kardeşler', 'kardeş'], a: ['اخ', 'اخو', 'اخوه'], k: ['Aile: Erkek Kardeş'] },
        { id: 'kiz-kardes', r: 'kisi', t: ['kız kardeş', 'abla', 'ablam'], a: ['اخت'], k: ['Aile: Kız Kardeş'] },
        { id: 'dede', r: 'kisi', t: ['dede', 'dedem', 'deden', 'büyükbaba'], a: ['جد'], k: ['Aile: Dede'] },
        { id: 'nine', r: 'kisi', t: ['nine', 'ninem', 'babaanne', 'anneanne', 'büyükanne'], a: ['جده'], k: ['Aile: Nine', 'Aile: Büyükanne'] },
        { id: 'aile', r: 'kisi', t: ['aile', 'ailem', 'ailen', 'akraba', 'akrabalar'], a: ['عائله', 'اسره', 'اقارب', 'اقرباء'], k: ['عيل'] },
        { id: 'bebek', r: 'kisi', t: ['bebek'], a: ['طفل رضيع', 'رضيع'] },
        { id: 'kiz', r: 'kisi', t: ['=kız', 'kızım', 'kızı', 'kızlar', 'kız çocuk', '=ayşe', '=fatma', '=zeynep', '=meryem', '=hatice', '=elif', '=esra', '=merve', '=büşra', '=sümeyye', '=hanım', '=nur', '=sena', '=leyla', '=selma', '=amine', '=halime', '=rukiye', '=hira', '=kübra', '=nisa', '=naime', '=yasemin', '=hacer', '=asiye', '=safiye', '=esma', '=sara', '=sare', '=rabia', '=hafsa', '=asma', '=nesibe', '=hümeyra', '=betül', '=şeyma', '=havva', '=ümmügülsüm', '=gülsüm', '=nazlı', '=dilara', '=hilal', '=sevda', '=aişe', '=cemile', '=fadime', '=emine', '=zehra', '=şerife', '=nefise', '=melek', '=gül', '=ceren', '=damla'], a: ['بنت', 'فتاه', 'جميله', 'عائشه', 'فاطمه', 'زينب', 'مريم', 'خديجه', 'ليلي', 'سلمي', 'امينه', 'حليمه', 'رقيه', 'نعيمه', 'ياسمين', 'هاجر', 'صفيه', 'ساره', 'رابعه', 'حفصه', 'بشري', 'هند', 'سعاد'] },
        { id: 'erkek', r: 'kisi', t: ['erkek', 'oğlan', 'oğlum', 'oğlu', '=ahmet', '=ahmed', '=mehmet', '=ali', '=hasan', '=hüseyin', '=yusuf', '=ömer', '=halit', '=halid', '=furkan', '=tarık', '=fatih', '=emre', '=mustafa', '=ibrahim', '=muhammed', '=abdullah', '=zeyd', '=kerim', '=salih', '=bilal', '=osman', '=enes', '=hamza', '=selim', '=murat', '=kemal', '=ferid', '=ferit', '=fuat', '=selman', '=yasin', '=ismail', '=ishak', '=yakup', '=yakub', '=davud', '=davut', '=süleyman', '=musa', '=isa', '=nuh', '=adem', '=talha', '=zübeyr', '=hakan', '=burak', '=kaan', '=can', '=yunus', '=cemal', '=bekir', '=ebubekir', '=umut', '=faruk', '=sami', '=kerem', '=harun', '=said', '=sait', '=saad', '=sad', '=hüsam', '=amr', '=amir', '=ammar', '=hişam', '=mahmut', '=mahmud', '=idris', '=ilyas', '=zekeriya', '=yahya', '=eyüp', '=eyyüp', '=necip', '=necib', '=nebil', '=rami', '=raşid', '=reşit', '=tahir', '=taha', '=tuğrul', '=yiğit', '=berat', '=mert', '=cemil', '=celal', '=kadir', '=rıza', '=nuri', '=şükrü', '=ayhan', '=orhan', '=erkan', '=volkan'], a: ['ولد', 'ابن', 'احمد', 'محمد', 'حسين', 'يوسف', 'خالد', 'فرقان', 'طارق', 'فاتح', 'مصطفي', 'ابراهيم', 'عبدالله', 'زيد', 'بلال', 'عثمان', 'فريد', 'فؤاد', 'سلمان', 'ياسين', 'اسماعيل', 'اسحاق', 'يعقوب', 'داود', 'سليمان', 'موسي', 'عيسي', 'نوح', 'ادم', 'طلحه', 'الزبير', 'حمزه', 'هشام', 'محمود', 'ادريس', 'الياس', 'زكريا', 'ايوب', 'رامي', 'طه', 'سامي', 'هارون', 'عمرو', 'عمار'] },
        { id: 'kadin', svg: 'anne', r: 'kisi', t: ['kadın', 'bayan', 'hanımefendi'], a: ['امراه', 'سيده', 'نساء'] },
        { id: 'adam', svg: 'baba', r: 'kisi', t: ['adam', '=bey', 'beyefendi', 'komşu', 'misafir'], a: ['رجل', 'سيد', 'جار', 'ضيف', 'ضيوف', 'جيران'] },
        { id: 'arkadas', svg: 'iki-kisi', r: 'kisi', t: ['arkadaş', 'dost', 'sınıf arkadaş'], a: ['صديق', 'صديقه', 'اصدقاء', 'زميل', 'زملاء', 'صداقه'] },
        { id: 'ogrenci', r: 'kisi', t: ['öğrenci', 'talebe', 'genç'], a: ['طالب', 'طالبه', 'طلاب', 'تلميذ', 'تلاميذ', 'طالبات', 'شاب', 'شابه'] },
        { id: 'cocuk', r: 'kisi', t: ['çocuk', 'çocuklar'], a: ['اطفال', 'طفل', 'اولاد'] },
        { id: 'takim', r: 'kisi', t: ['takım', 'kulüp', 'kulüb', 'grup', 'ekip'], a: ['فريق', 'نادي', 'اندي'] },
        { id: 'insanlar', svg: 'iki-kisi', r: 'kisi', t: ['insan', 'insanlar', 'halk', 'herkes', 'müslüman', 'kalabalık'], a: ['ناس', 'انسان', 'مسلم', 'مسلمون', 'مسلمين', 'مزدحم', 'زحام'] },

        /* --- meslekler (kütüphanede hazır) --- */
        { id: 'ogretmen', r: 'kisi', t: ['öğretmen', 'hoca', 'muallim', 'müdür'], a: ['معلم', 'معلمه', 'مدرس', 'مدرسه المعلم', 'استاذ', 'مدير', 'مديره'], k: ['علم'] },
        { id: 'doktor', r: 'kisi', t: ['doktor', 'hekim'], a: ['طبيب', 'طبيبه'], k: ['طبب'] },
        { id: 'hemsire', r: 'kisi', t: ['hemşire'], a: ['ممرض', 'ممرضه'] },
        { id: 'muhendis', r: 'kisi', t: ['mühendis', 'mimar'], a: ['مهندس', 'مهندسه', 'معماري'] },
        { id: 'memur', r: 'kisi', t: ['memur'], a: ['موظف', 'موظفه'] },
        { id: 'isci', r: 'kisi', t: ['işçi'], a: ['عامل', 'عامله', 'عمال'] },
        { id: 'tuccar', r: 'kisi', t: ['tüccar', 'satıcı', 'bakkal', 'esnaf'], a: ['تاجر', 'بائع', 'بقال'] },
        { id: 'emekli', r: 'kisi', t: ['emekli'], a: ['متقاعد', 'متقاعده'] },
        { id: 'polis', r: 'kisi', t: ['polis'], a: ['شرطي', 'شرطه'] },
        { id: 'asci', r: 'kisi', t: ['aşçı'], a: ['طباخ', 'طباخه'] },
        { id: 'ciftci', r: 'kisi', t: ['çiftçi'], a: ['فلاح', 'فلاحه', 'مزارع'] },
        { id: 'sofor', r: 'kisi', t: ['şoför', 'sürücü'], a: ['سائق', 'سائقه'] },
        { id: 'subay', r: 'kisi', t: ['subay', 'asker', 'ordu'], a: ['ضابط', 'جندي', 'جيش'] },
        { id: 'veteriner', r: 'kisi', t: ['veteriner'], a: ['بيطري'] },
        { id: 'avukat', r: 'kisi', t: ['avukat', 'adalet', 'hâkim', '=hakim', 'mahkeme'], a: ['محام', 'محامي', 'محاميه', 'عداله', 'قاضي', 'محكمه'] },
        { id: 'ev-hanimi', r: 'kisi', t: ['ev hanım'], a: ['ربه البيت', 'ربه بيت'] },

        /* --- beden ve sağlık --- */
        { id: 'bas', r: 'nesne', t: ['~baş(ım|ımı|ın|ını|ı|a|ta|tan|lar|ları)?', 'kafa'], a: ['راس', 'راسي'] },
        { id: 'goz', r: 'nesne', t: ['göz'], a: ['عين', 'عيون', 'عينان', 'عيني'] },
        { id: 'kulak', r: 'nesne', t: ['kulak', 'kulağ'], a: ['اذنان', 'اذني', 'اذنك', 'الاذن'] },
        { id: 'burun', r: 'nesne', t: ['burun', 'burn'], a: ['انف'] },
        { id: 'dis', r: 'nesne', t: ['diş', 'ağız', 'ağz'], a: ['اسنان', 'اسناني', 'فم'] },
        { id: 'el', r: 'nesne', t: ['=el', 'elim', 'elin', 'elle', 'eller', 'parmak', '~kol(u|um|un|lar|ları|larını)?'], a: ['يد', 'يدي', 'يدان', 'ايدي', 'اصبع', 'اصابع', 'ذراع'] },
        { id: 'ayak', r: 'nesne', t: ['ayak', 'ayağ', 'bacak'], a: ['رجل', 'قدم', 'اقدام', 'ساق'] },
        { id: 'vucut', r: 'nesne', t: ['vücut', 'organ', 'beden'], a: ['جسم', 'جسد', 'اعضاء'] },
        { id: 'hasta', r: 'his', t: ['hasta', 'grip', 'nezle', 'ateşim', 'ateşi var', 'öksür', 'ağrı', '=acı', 'acıyor', 'yaralan', 'sancı', 'tansiyon', 'şikayet', 'şikâyet', 'karnım', 'karnın', 'neyin var', 'neyi var', 'hissed'], a: ['مريض', 'مريضه', 'زكام', 'حمي', 'سعال', 'الم', 'وجع', 'مغص', 'ضغط الدم', 'بطن', 'شكوي'], k: ['مرض', 'ألم'] },
        { id: 'ilac', r: 'nesne', t: ['ilaç', 'şurup', 'eczane', 'eczacı', 'reçete'], a: ['دواء', 'صيدليه', 'صيدلاني', 'صيدلانيه', 'وصفه'] },
        { id: 'hastane', r: 'yer', t: ['hastane', 'klinik', 'muayene', 'acil servis', 'poliklinik'], a: ['مستشفي', 'عياده'], m: 'hastane' },
        { id: 'saglik', svg: 'kalp', r: 'nesne', t: ['sağlık', 'sağlıklı', 'kalp'], a: ['صحه', 'قلب', 'صحي'] },

        /* --- duygular --- */
        { id: 'gulen-yuz', r: 'his', t: ['mutlu', 'sevin', 'neşeli', 'iyiyim', 'iyiyiz', 'harika', 'çok iyi', 'güzel', 'güler yüz', 'gülümse', 'keyifli'], a: ['سعيد', 'سعيده', 'فرح', 'مسرور', 'بخير', 'جميل'], k: ['سعد', 'فرح'] },
        { id: 'uzgun', r: 'his', t: ['üzgün', 'üzül', 'ağla', 'özle'], a: ['حزين', 'حزينه', 'مشتاق'], k: ['حزن', 'شوق'] },
        { id: 'kizgin', r: 'his', t: ['kızgın', 'öfke', 'sinirli'], a: ['غاضب', 'غضبان'], k: ['غضب'] },
        { id: 'korku', r: 'his', t: ['kork', 'endişe'], a: ['خائف', 'خوف'], k: ['خوف'] },
        { id: 'saskin', r: 'his', t: ['şaşır', 'şaşkın', 'hayret'], a: ['متعجب', 'مندهش'], k: ['عجب'] },
        { id: 'yorgun', r: 'his', t: ['yorgun', 'yoruldu', 'yorul'], a: ['متعب', 'تعبان'], k: ['تعب'] },

        /* --- yiyecek ve içecek --- */
        { id: 'kahvalti', r: 'nesne', t: ['kahvaltı'], a: ['فطور', 'الفطور'], k: ['فطر'], m: 'sabah' },
        { id: 'yemek', r: 'nesne', t: ['yemek', 'yemeğ', 'yiyor', 'yerim', 'yeriz', 'yer misin', 'öğle yemeğ', 'akşam yemeğ', 'yiyecek', 'aç mısın', 'acıktı', 'lokanta', 'restoran', 'sofra', 'bardak', 'çatal', 'tabak', 'kaşık', 'bıçak', '=tuz', 'tuzu'], a: ['طعام', 'غداء', 'عشاء', 'اكل', 'مطعم', 'وجبه', 'كوب', 'اكواب', 'شوكه', 'صحن', 'ملعقه', 'سكين', 'ملح'], k: ['أكل', 'طعم', 'غدو', 'عشو', 'نول'] },
        { id: 'ekmek', r: 'nesne', t: ['ekmek', 'ekmeğ', 'simit', 'fırın'], a: ['خبز', 'مخبز'], k: ['خبز'] },
        { id: 'peynir', r: 'nesne', t: ['peynir'], a: ['جبن', 'جبنه'] },
        { id: 'yumurta', r: 'nesne', t: ['yumurta'], a: ['بيض', 'بيضه'] },
        { id: 'zeytin', r: 'nesne', t: ['zeytin'], a: ['زيتون'] },
        { id: 'bal', r: 'nesne', t: ['=bal', '=balı', 'reçel', 'tereyağ'], a: ['عسل', 'مربي', 'زبده'] },
        { id: 'cay', r: 'nesne', t: ['=çay', 'çayı', 'çayın', 'çaydan'], a: ['شاي'] },
        { id: 'kahve', r: 'nesne', t: ['kahve'], a: ['قهوه'] },
        { id: 'sut', r: 'nesne', t: ['süt', 'ayran', 'yoğurt'], a: ['حليب', 'لبن'] },
        { id: 'su', r: 'nesne', t: ['=su', 'suyu', 'sular', 'susa', '~iç(er|erim|eriz|ersin|ersiniz|erler|iyor|iyorum|iyoruz|iyorsun|mek|meyi|meliyiz|ecek|ecekler|tim|tik|ti)', 'meyve suyu', 'limonata'], a: ['ماء', 'مياه', 'عصير', 'مشروب', 'مشروبات'], k: ['شرب', 'عصر'] },
        { id: 'meyve', r: 'nesne', t: ['meyve', 'kiraz', 'çilek', 'armut', 'şeftali', 'kayısı', 'erik', 'incir', '=nar'], a: ['فاكهه', 'فواكه', 'فاكهة', 'كرز', 'فراوله', 'مشمش', 'برقوق', 'تين', 'رمان'] },
        { id: 'elma', r: 'nesne', t: ['elma'], a: ['تفاح', 'تفاحه'] },
        { id: 'muz', r: 'nesne', t: ['=muz', 'muzu', 'muzlar'], a: ['موز'] },
        { id: 'portakal', r: 'nesne', t: ['portakal', 'mandalina', 'limon'], a: ['برتقال', 'برتقاله', 'ليمون'] },
        { id: 'uzum', r: 'nesne', t: ['üzüm'], a: ['عنب'] },
        { id: 'karpuz', r: 'nesne', t: ['karpuz', 'kavun'], a: ['بطيخ'] },
        { id: 'domates', r: 'nesne', t: ['domates'], a: ['طماطم', 'بندوره'] },
        { id: 'sebze', r: 'nesne', t: ['sebze', 'patlıcan', 'patates', 'havuç', 'biber', 'salatalık', 'soğan', 'fasulye', 'ıspanak', 'kabak', 'nane', 'maydanoz', 'dereotu'], a: ['خضار', 'خضروات', 'باذنجان', 'بطاطس', 'جزر', 'فلفل', 'خيار', 'بصل', 'فاصوليا', 'كوسه', 'نعناع', 'بقدونس'] },
        { id: 'salata', r: 'nesne', t: ['salata'], a: ['سلطه'] },
        { id: 'pilav', r: 'nesne', t: ['pilav', 'pirinç', 'makarna', 'bulgur'], a: ['ارز', 'رز', 'معكرونه'] },
        { id: 'tavuk', r: 'nesne', t: ['tavuk', '=eti', 'etler', 'etli', 'et yemeğ', 'kırmızı et', 'köfte', 'kebap', 'kebab'], a: ['دجاج', 'لحم', 'كباب', 'كفته'] },
        { id: 'balik', r: 'nesne', t: ['balık', 'balığ'], a: ['سمك', 'سمكه', 'اسماك'] },
        { id: 'corba', r: 'nesne', t: ['çorba', 'mercimek'], a: ['شوربه', 'حساء', 'عدس'] },
        { id: 'tatli', r: 'nesne', t: ['tatlı', 'pasta', 'kek', 'baklava', 'kurabiye', 'börek', 'lokum'], a: ['حلوي', 'حلويات', 'كعكه', 'بقلاوه', 'كعك'] },
        { id: 'cikolata', r: 'nesne', t: ['çikolata'], a: ['شوكولاته', 'شوكولاتة'] },
        { id: 'seker', r: 'nesne', t: ['şeker', 'şekerleme'], a: ['سكر', 'حلوي العيد'] },
        { id: 'dondurma', r: 'nesne', t: ['dondurma'], a: ['بوظه', 'مثلجات', 'ايس كريم'] },

        /* --- ev --- */
        { id: 'ev', r: 'yer', t: ['~ev(e|de|den|i|im|imiz|imize|imizde|imizden|in|inde|ine|iniz|inize|inizde|ler|lere|lerde|lerden|leri)?', 'daire', 'apartman'], a: ['بيت', 'منزل', 'دار', 'شقه'], k: ['بيت', 'نزل'], m: 'ev' },
        { id: 'mutfak', r: 'yer', t: ['mutfak', 'tencere', 'pişir'], a: ['مطبخ', 'فرن', 'قدر'], k: ['طبخ'], m: 'ev' },
        { id: 'banyo', r: 'yer', t: ['banyo', 'duş', 'lavabo', 'tuvalet', 'sabun', 'havlu'], a: ['حمام', 'صابون', 'منشفه', 'دش'], m: 'ev' },
        { id: 'yatak', r: 'yer', t: ['yatak', 'yatar', 'yatıyor', 'uyu', 'uyku', 'yat ', 'yastık', 'yorgan'], a: ['سرير', 'نوم', 'غرفه النوم', 'وساده'], k: ['نوم', 'رقد'], m: 'gece' },
        { id: 'oda', svg: 'pencere', r: 'yer', t: ['=oda', 'odam', 'odası', 'odada', 'odan', 'pencere', 'perde', 'salon', 'oturma odası'], a: ['غرفه', 'غرفتي', 'نافذه', 'شباك', 'صاله'], m: 'ev' },
        { id: 'koltuk', r: 'nesne', t: ['koltuk', 'kanepe', 'divan'], a: ['اريكه', 'كنبه', 'كرسي'] },
        { id: 'masa', r: 'nesne', t: ['masa', '~sıra(dır|mdır|nın|ya|da|dan|lar|ları|larda|larımızı|larınızı|m|mız|nız)?'], a: ['طاوله', 'مكتب', 'منضده'] },
        { id: 'sandalye', r: 'nesne', t: ['sandalye'], a: ['كرسي', 'كراسي'] },
        { id: 'lamba', r: 'nesne', t: ['lamba', 'ışık', 'ampul'], a: ['مصباح', 'نور', 'ضوء'] },
        { id: 'televizyon', r: 'nesne', t: ['televizyon', 'tv', 'film', 'dizi', 'seyret', 'izliyor', 'izlerim', 'izle'], a: ['تلفاز', 'تلفزيون', 'فيلم'] },
        { id: 'buzdolabi', r: 'nesne', t: ['buzdolab', 'dolap'], a: ['ثلاجه', 'خزانه'] },
        { id: 'bahce', r: 'yer', t: ['bahçe', 'park'], a: ['حديقه', 'حدائق', 'بستان'], k: ['حدق'], m: 'bahce' },
        { id: 'kapi', svg: 'ev-kapisi', r: 'nesne', t: ['kapı', 'kapıyı', 'zil'], a: ['باب', 'جرس'] },
        { id: 'anahtar', r: 'nesne', t: ['anahtar'], a: ['مفتاح'] },

        /* --- okul ve kırtasiye (kütüphanede hazır) --- */
        { id: 'okul', r: 'yer', t: ['okul', 'mektep', 'lise', 'ortaokul'], a: ['مدرسه', 'مدارس', 'ثانويه'], m: 'okul' },
        { id: 'sinif', svg: 'tahta', r: 'yer', t: ['sınıf', 'tahta', 'teneffüs'], a: ['صف', 'فصل', 'سبوره', 'فسحه'], m: 'okul' },
        { id: 'kalem', r: 'nesne', t: ['kalem', 'kurşun kalem', 'kalemtıraş', 'boya kalem'], a: ['قلم', 'اقلام', 'براي'] },
        { id: 'silgi', r: 'nesne', t: ['silgi'], a: ['ممحاه', 'ممحاة'] },
        { id: 'defter', r: 'nesne', t: ['defter', 'kâğıt', 'kağıt'], a: ['دفتر', 'دفاتر', 'كراسه'] },
        { id: 'kitap', r: 'nesne', t: ['kitap', 'kitab', 'roman', 'hikâye', 'hikaye', 'masal', 'şiir', 'edebiyat'], a: ['كتاب', 'كتب', 'قصه', 'روايه', 'شعر', 'ادب'], k: ['قصص'] },
        { id: 'canta', r: 'nesne', t: ['çanta'], a: ['حقيبه', 'محفظه'] },
        { id: 'cetvel', svg: 'cetvel', r: 'nesne', t: ['cetvel', 'makas', 'yapıştırıcı', 'kırtasiye', 'bant'], a: ['مسطره', 'مقص', 'قرطاسيه', 'شريط لاصق'] },
        { id: 'ders', r: 'nesne', t: ['~ders(i|ler|leri|lerimiz|lerimizi|imiz|imizi|imizden|e|te|ten|ane|hane|ini|ler|lerde|ten)?', 'sınav', 'ödev', 'ders çalış'], a: ['درس', 'دروس', 'امتحان', 'واجب', 'واجبات'], k: ['درس', 'متحن'] },
        { id: 'kutuphane', r: 'yer', t: ['kütüphane', 'kitaplık', 'kitap fuar'], a: ['مكتبه', 'معرض الكتاب', 'معرض'], m: 'okul' },
        { id: 'harfler', r: 'nesne', t: ['harf', 'alfabe', 'arapça', 'dil '], a: ['حرف', 'حروف', 'عربيه', 'لغه'] },
        { id: 'sozluk', r: 'nesne', t: ['sözlük', 'kelime'], a: ['قاموس', 'معجم', 'كلمه', 'كلمات'] },
        { id: 'harita', r: 'nesne', t: ['harita', 'coğrafya', 'kıta', 'ülke'], a: ['خريطه', 'قاره', 'دوله', 'بلد'] },
        { id: 'resim', r: 'eylem', t: ['resim', 'çiz', 'boya', 'ressam', 'sanat'], a: ['رسم', 'لوحه', 'فن', 'فنون', 'رسام'], k: ['رسم'] },
        { id: 'mezuniyet-kepi', r: 'nesne', t: ['mezun', 'diploma', 'karne'], a: ['تخرج', 'شهاده', 'حفل التخرج'] },

        /* --- günlük işler (eylemler) --- */
        { id: 'uyanmak', r: 'eylem', t: ['uyan', 'kalk', 'kalkar', 'kalkıyor', 'alarm'], a: ['استيقظ', 'اصحو', 'قم', 'قومي', 'منبه'], k: ['يقظ', 'صحو', 'قوم'], m: 'sabah' },
        { id: 'yikanmak', r: 'eylem', t: ['yıka', 'yıkan', 'duş al', 'banyo yap', 'diş fırça', 'fırçala', 'sabun'], a: ['غسل', 'اغسل', 'اغتسل', 'فرشاه'], k: ['غسل', 'فرش'] },
        { id: 'temizlik', r: 'eylem', t: ['temiz', 'süpür', 'toz', 'düzenle', '~topla(r|rım|rız|yın|yalım|yor|yorum|yoruz|dı|dım|dık|mak|malıyız)?', 'kirli', 'çöp'], a: ['نظيف', 'نظافه', 'وسخ', 'قمامه'], k: ['نظف', 'رتب'] },
        { id: 'yazmak', r: 'eylem', t: ['yazar', 'yazıyor', 'yazdı', 'yazmak', 'yazarım', 'yazarız', 'yazı', 'yazalım'], a: ['اكتب', 'اكتبي', 'يكتب', 'تكتب', 'كتابه'], k: ['كتب'] },
        { id: 'okuma', r: 'eylem', t: ['oku', 'okur', 'okuyor', 'okudu', 'okumak', 'okuyun'], a: ['اقرا', 'اقرئي', 'يقرا', 'تقرا', 'قراءه'], k: ['قرأ'] },
        { id: 'dinlemek', svg: 'kulak', r: 'eylem', t: ['~dinle(?!n)\\S*', 'dinliyor', 'dinlerim', 'ses'], a: ['اسمع', 'استمع', 'يستمع', 'استماع'], k: ['سمع'] },
        { id: 'konusmak', svg: 'sohbet', z: 1, r: 'eylem', t: ['konuş', 'sohbet', 'söyle', 'anlat', '=sor', 'soruyor', 'sordu', 'sorar'], a: ['تكلم', 'اتكلم', 'تحدث', 'يتحدث', 'نتحدث', 'قال', 'سال'], k: ['كلم', 'قول'] },
        { id: 'oyun', svg: 'top', r: 'eylem', t: ['oyna', 'oyun', 'oyuncak', '=top', 'topu', 'topun', 'boş vakt', 'boş zaman', 'hobi', 'serbest zaman'], a: ['لعب', 'العب', 'يلعب', 'العاب', 'كره', 'لعبه'], k: ['لعب'] },
        { id: 'futbol', r: 'eylem', t: ['futbol', 'maç', 'gol', 'stadyum'], a: ['كره القدم', 'مباراه', 'ملعب', 'هدف'], m: 'spor' },
        { id: 'basketbol', r: 'eylem', t: ['basketbol', 'voleybol', 'hentbol'], a: ['كره السله', 'كره الطائره', 'كره اليد'], m: 'spor' },
        { id: 'yuzme', r: 'eylem', t: ['yüzme', 'yüzer', 'yüzüyor', 'yüzücü', 'yüzmey', 'havuz'], a: ['سباحه', 'اسبح', 'يسبح', 'مسبح', 'نسبح'], m: 'deniz' },
        { id: 'kosmak', r: 'eylem', t: ['koş', 'koşu', 'yarış', 'atletizm', 'yürü', 'yürüyüş'], a: ['اجري', 'يجري', 'جري', 'سباق', 'امشي', 'يمشي', 'مشي'], k: ['جري', 'مشي'] },
        { id: 'spor', r: 'eylem', t: ['spor', 'antrenman', 'egzersiz', 'jimnastik', 'güreş', 'tenis', 'tekvando', 'karate', 'judo'], a: ['رياضه', 'تمرين', 'مصارعه', 'تنس', 'التايكواندو', 'يمارس', 'نمارس', 'تمارس', 'امارس'], k: ['روض'], m: 'spor' },
        { id: 'satranc', r: 'eylem', t: ['satranç'], a: ['شطرنج'] },
        { id: 'tiyatro', r: 'eylem', t: ['tiyatro', 'sahne', 'oyuncu', 'rol'], a: ['مسرح', 'مسرحيه', 'ممثل', 'ممثله', 'ممثلون'], k: ['سرح'] },
        { id: 'muzik', svg: 'nota', r: 'eylem', t: ['müzik', 'şarkı', 'enstrüman', 'gitar', '=ney', 'ilahi'], a: ['موسيقي', 'اغنيه', 'نشيد'], k: ['نشد'] },
        { id: 'el-sanatlari', r: 'eylem', t: ['el sanat', 'terzi', 'örgü', '=ör', 'dikiş', 'dikiyor', 'ebru', 'hat ', 'çini', 'seramik', 'kilim', 'halı', 'ahşap', 'oyma'], a: ['فنون يدويه', 'حرف يدويه', 'خط', 'سجاد', 'خياطه'], k: ['خيط', 'صنع'] },
        { id: 'alisveris', r: 'eylem', t: ['alışveriş', 'al ', 'alırım', 'alır', 'alıyor', 'satın', 'sat', 'sepet', 'fiyat', 'kaça', 'ucuz', 'pahalı', 'indirim', 'kilo', 'gram'], a: ['اشتري', 'يشتري', 'اشتريت', 'ابيع', 'سعر', 'غالي', 'رخيص', 'تسوق', 'اتسوق', 'كيلو'], k: ['شري', 'بيع', 'سوق', 'سعر'] },
        { id: 'para', r: 'nesne', t: ['para', 'lira', 'kuruş', 'cüzdan', 'dolar', 'ödeme', 'öde', 'tutar', 'hesap'], a: ['نقود', 'مال', 'ليره', 'ريال', 'درهم', 'دينار', 'محفظه', 'ادفع', 'فلوس', 'الحساب', 'المطلوب'], k: ['نقد'] },
        { id: 'hediye', r: 'nesne', t: ['hediye', 'armağan', 'sürpriz'], a: ['هديه', 'هدايا'], k: ['هدي'] },
        { id: 'mektup', r: 'nesne', t: ['mektup', 'posta', 'zarf', 'kart', 'e-posta', 'davetiye'], a: ['رساله', 'رسائل', 'بريد', 'ظرف', 'بطاقه', 'دعوه'], k: ['رسل'] },
        { id: 'telefon', r: 'nesne', t: ['telefon', 'cep', 'ara ', 'arar', 'arıyor', 'mesaj', 'selfie', 'şarj', 'powerbank', 'numara', 'iletişim'], a: ['هاتف', 'جوال', 'محمول', 'اتصل', 'يتصل', 'اتصال'], k: ['هتف'] },
        { id: 'bilgisayar', r: 'nesne', t: ['bilgisayar', 'internet', 'tablet', 'ekran', 'flash bellek', 'bellek', 'usb', 'fare ile', '~fare(m|mi|ni|n|yi)', 'tıkla', 'oyun konsol'], a: ['حاسوب', 'كمبيوتر', 'انترنت', 'شاشه', 'برنامج', 'حاسوبي', 'فاره', 'فارتك', 'فارتي'] },
        { id: 'ziyaret', r: 'eylem', t: ['ziyaret', 'misafir', 'komşu'], a: ['زياره', 'ازور', 'يزور', 'نزور', 'زوار'], k: ['زور'] },
        { id: 'yardim', svg: 'is-birligi', r: 'eylem', t: ['yardım', 'iş birliği', 'paylaş', 'destek', 'el ele', 'sadaka', 'iyilik'], a: ['مساعده', 'تعاون', 'اساعد', 'يساعد', 'ساعد', 'نساعد', 'يساعدون', 'صدقه', 'فعل الخير'], k: ['عون'] },
        { id: 'fotograf', r: 'nesne', t: ['fotoğraf', 'resim çek', 'kamera'], a: ['صوره', 'صور', 'كاميرا'] },
        { id: 'bavul', r: 'nesne', t: ['tatil', 'bavul', 'valiz', 'seyahat', 'yolculuk', 'gezi', 'gez', 'otel', 'pansiyon', 'bilet'], a: ['عطله', 'اجازه', 'حقيبه السفر', 'سفر', 'رحله', 'سياحه', 'فندق', 'تذكره'], k: ['عطل', 'سفر', 'رحل', 'جول'] },
        { id: 'cevre', r: 'nesne', t: ['çevre', 'doğa', 'geri dönüşüm', 'kirlilik', 'ağaç dik'], a: ['بيئه', 'طبيعه', 'تدوير', 'تلوث'], k: ['بوأ'], m: 'bahce' },

        /* --- din --- */
        { id: 'namaz', r: 'eylem', t: ['namaz', 'rekât', 'rekat', 'secde', 'kıble', 'ezan', 'cemaat', 'teşehhüd', 'tahiyyat', 'rükû', 'rüku', 'kıyam', 'kunut', '~kıl(ar|arız|arım|ıyor|ıyorum|ıyoruz|dı|dım|dık|mak|malıyız|ın|alım)', 'kılar', 'kılıyor', 'sabah namaz', 'öğle namaz', 'ikindi', 'yatsı'], a: ['صلاه', 'صلوات', 'يصلي', 'اصلي', 'ركعه', 'ركعات', 'سجود', 'قبله', 'اذان', 'جماعه'], k: ['صلو', 'صلي', 'سجد', 'ركع'], m: 'cami' },
        { id: 'cami', r: 'yer', t: ['cami', 'mescit', 'mescid', 'ayasofya', 'sultanahmet', 'süleymaniye', 'minare'], a: ['مسجد', 'جامع', 'مساجد', 'مئذنه'], m: 'cami' },
        { id: 'abdest', r: 'eylem', t: ['abdest', 'gusül'], a: ['وضوء', 'اتوضا', 'يتوضا'], k: ['وضأ'], m: 'cami' },
        { id: 'oruc', r: 'eylem', t: ['oruç', 'iftar', 'sahur', 'ramazan', 'teravih'], a: ['صوم', 'صيام', 'صائم', 'افطار', 'سحور', 'رمضان', 'تراويح'], k: ['صوم'], m: 'gece' },
        { id: 'bayram', r: 'eylem', t: ['bayram', 'kurban', 'bayramlaş', 'el öp', 'kandil'], a: ['عيد', 'اعياد', 'اضحي', 'عيد الفطر', 'عيد الاضحي'] },
        { id: 'kurban', svg: 'koyun', r: 'nesne', t: ['kurban', 'koyun', 'kuzu'], a: ['اضحيه', 'خروف', 'كبش', 'غنم'] },
        { id: 'dua', r: 'eylem', t: ['dua', 'allah', 'inşallah', 'maşallah', 'elhamdülillah', 'bismillah', '=amin', 'islam', '=din', 'dini', 'dinî', 'dinimiz', 'peygamber', 'iman', 'ibadet', 'sübhanallah'], a: ['دعاء', 'الله', 'ان شاء', 'ما شاء', 'الحمد', 'بسم', 'اسلام', 'دين', 'نبي', 'رسول', 'ايمان', 'عباده', 'سبحان', 'اسلاميه'], k: ['أله'] },
        { id: 'mushaf', r: 'nesne', t: ['kur\'an', 'kuran', 'mushaf', 'sure', 'ayet', '=hafız'], a: ['قران', 'مصحف', 'سوره', 'ايه', 'حافظ'], k: ['قرأ'] },
        { id: 'kabe', r: 'yer', t: ['kâbe', 'kabe', 'mekke', 'hac', 'umre', 'harem', 'mescid-i haram', 'suudi', 'arabistan'], a: ['كعبه', 'مكه', 'حج', 'عمره', 'المسجد الحرام', 'حرم', 'السعوديه'], k: ['حجج'], m: 'cami' },
        { id: 'medine', r: 'yer', t: ['medine', 'mescid-i nebevi', 'nebevi', 'ravza'], a: ['مدينه المنوره', 'المدينه', 'المسجد النبوي', 'نبوي'], m: 'cami' },
        { id: 'kudus', r: 'yer', t: ['kudüs', 'mescid-i aksa', 'aksa', 'kubbetü', 'filistin'], a: ['قدس', 'الاقصي', 'اقصي', 'قبه الصخره', 'فلسطين'], m: 'cami' },

        /* --- doğa, hava, mevsim, zaman --- */
        { id: 'gunes', r: 'zaman', t: ['güneş', 'güneşli', 'yaz ', 'yazın', 'yazlık', 'öğle'], a: ['شمس', 'مشمس', 'صيف', 'ظهر'], k: ['شمس', 'صيف'], m: 'gunes' },
        { id: 'bulut', z: 1, r: 'zaman', t: ['bulut', 'hava', 'gökyüzü'], a: ['غيم', 'غيوم', 'سحاب', 'غائم', 'طقس', 'جو', 'سماء'], k: ['غيم', 'طقس'], m: 'bulut' },
        { id: 'yagmur', r: 'zaman', t: ['yağmur', 'şemsiye', 'ıslak', '=sel', 'seller'], a: ['مطر', 'ممطر', 'امطار', 'مظله', 'فيضان'], k: ['مطر'], m: 'yagmur' },
        { id: 'kar', r: 'zaman', t: ['=kar', 'karlı', 'kar yağ', 'kış', 'kışın', 'kışlık', 'buz', 'soğuk'], a: ['ثلج', 'مثلج', 'شتاء', 'شتويه', 'بارد', 'برد', 'جليد'], k: ['ثلج', 'شتو'], m: 'kar' },
        { id: 'ruzgar', r: 'zaman', t: ['rüzgâr', 'rüzgar', 'fırtına', 'esiyor'], a: ['ريح', 'رياح', 'عاصفه'], k: ['عصف'], m: 'bulut' },
        { id: 'simsek', r: 'zaman', t: ['şimşek', 'yıldırım', 'gök gürül'], a: ['برق', 'رعد'], m: 'yagmur' },
        { id: 'gokkusagi', r: 'zaman', t: ['gökkuşağı', 'gök kuşağı', 'renkli'], a: ['قوس قزح'] },
        { id: 'sicak', r: 'zaman', t: ['sıcak', 'derece', 'ılık', 'terle', 'kuraklık', 'küresel ısınma'], a: ['حار', 'حراره', 'درجه', 'دافئ', 'جفاف', 'الاحتباس الحراري'], k: ['دفأ'], m: 'gunes' },
        { id: 'mevsimler', r: 'zaman', t: ['mevsim', 'dört mevsim'], a: ['فصل', 'فصول', 'موسم'] },
        { id: 'cicek', r: 'zaman', t: ['ilkbahar', 'bahar', 'çiçek', 'gül ', 'lale', 'papatya'], a: ['ربيع', 'زهره', 'زهور', 'ورد', 'ورده'], k: ['زهر'], m: 'bahce' },
        { id: 'yaprak', r: 'zaman', t: ['sonbahar', 'yaprak', 'güz'], a: ['خريف', 'ورقه', 'اوراق'], k: ['خرف'] },
        { id: 'kardan-adam', r: 'nesne', t: ['kardan adam', 'kar topu', 'kayak', 'kızak'], a: ['رجل الثلج', 'تزلج'], m: 'kar' },
        { id: 'deniz', r: 'yer', t: ['deniz', 'plaj', 'sahil', 'kumsal', 'göl', 'nehir', 'dalga'], a: ['بحر', 'شاطئ', 'بحيره', 'نهر', 'موج'], k: ['بحر', 'شطأ'], m: 'deniz' },
        { id: 'dag', r: 'yer', t: ['~dağ(a|da|dan|ı|lar|lara|larda|ın|ına|cı)?', 'tepe', 'yayla', 'orman', 'kamp', 'tırman'], a: ['جبل', 'جبال', 'تل', 'غابه', 'مخيم', 'تسلق'], k: ['جبل'], m: 'bahce' },
        { id: 'agac', r: 'nesne', t: ['ağaç', 'fidan', 'orman'], a: ['شجره', 'اشجار', 'شجر'], k: ['شجر'] },
        { id: 'aksam', r: 'zaman', t: ['akşam', 'ikindi', 'gün batımı'], a: ['مساء', 'عصر', 'مغرب', 'غروب'], k: ['مسو'], m: 'aksam' },
        { id: 'gece', r: 'zaman', t: ['gece', 'gece yarısı', 'yıldız', 'ay '], a: ['ليل', 'ليلا', 'نجم', 'نجوم', 'قمر'], k: ['ليل', 'نجم', 'قمر'], m: 'gece' },
        { id: 'saat', z: 1, r: 'zaman', t: ['saat', 'dakika', 'buçuk', 'çeyrek', 'erken', 'geç '], a: ['ساعه', 'دقيقه', 'نصف', 'ربع', 'مبكرا', 'متاخر'], k: ['سوع', 'دقق'] },
        { id: 'takvim', z: 1, r: 'zaman', t: ['bugün', 'yarın', 'dün', 'hafta', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi', 'pazar günü', 'gün', 'ay ', 'yıl', 'tarih'], a: ['اليوم', 'غدا', 'امس', 'اسبوع', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعه', 'السبت', 'الاحد', 'يوم', 'شهر', 'اشهر', 'شهور', 'سنه', 'تاريخ'], k: ['يوم', 'سنو'] },

        /* --- giyim --- */
        { id: 'gomlek', r: 'nesne', t: ['gömlek', 'kazak', 'kazağ', 'bluz', 'giy', 'kıyafet', 'üniforma'], a: ['قميص', 'ملابس', 'لباس', 'زي', 'البس', 'يلبس', 'سترة', 'بلوزه'], k: ['لبس'] },
        { id: 'elbise', r: 'nesne', t: ['elbise', 'etek', 'tesettür', 'başörtü', 'eşarp'], a: ['فستان', 'تنوره', 'حجاب', 'ثوب'] },
        { id: 'pantolon', r: 'nesne', t: ['pantolon', 'şort', 'kot', 'kemer'], a: ['بنطال', 'سروال', 'شورت', 'حزام'] },
        { id: 'mont', r: 'nesne', t: ['mont', 'palto', 'kaban', 'ceket', 'yağmurluk'], a: ['معطف', 'جاكيت', 'سترة'] },
        { id: 'sapka', r: 'nesne', t: ['şapka', '=bere', 'takke', 'atkı', 'eldiven', 'kaşkol'], a: ['قبعه', 'طاقيه', 'وشاح', 'قفاز', 'قفازات'] },
        { id: 'ayakkabi', r: 'nesne', t: ['ayakkabı', '=çizme', 'çizmeler', 'terlik', 'sandalet', '=bot', 'çorap'], a: ['حذاء', 'احذيه', 'جزمه', 'شبشب', 'صندل', 'جورب', 'جوارب'] },
        { id: 'tisort', r: 'nesne', t: ['tişört', 'yazlık', 'güneş gözlüğ', 'gözlük'], a: ['قميص قصير', 'نظاره', 'نظارات'] },

        /* --- ulaşım ve şehir --- */
        { id: 'araba', r: 'nesne', t: ['araba', 'otomobil', 'taksi', 'arabayla', 'kamyon'], a: ['سياره', 'سيارات', 'تاكسي', 'اجره', 'شاحنه'], k: ['سير'] },
        { id: 'otobus', r: 'nesne', t: ['otobüs', 'minibüs', 'servis', 'otogar', 'durak'], a: ['حافله', 'حافلات', 'باص', 'محطه'] },
        { id: 'bisiklet', r: 'nesne', t: ['bisiklet', 'motosiklet', 'pedal'], a: ['دراجه', 'دراجات'] },
        { id: 'ucak', r: 'nesne', t: ['uçak', 'uçağ', 'havaalanı', 'havalimanı', 'uçuş', 'pilot'], a: ['طائره', 'مطار', 'طيار', 'رحله جويه'], k: ['طير'] },
        { id: 'gemi', r: 'nesne', t: ['gemi', 'vapur', 'feribot', 'tekne', 'liman'], a: ['سفينه', 'باخره', 'قارب', 'ميناء'], k: ['سفن'] },
        { id: 'tren', r: 'nesne', t: ['tren', 'metro', 'tramvay', 'istasyon', 'demiryol'], a: ['قطار', 'مترو', 'ترام'] },
        { id: 'trafik', svg: 'trafik-isigi', r: 'nesne', t: ['trafik', 'ışıkta', 'kırmızı ışık', 'yeşil ışık', 'yaya', 'kavşak', 'kural', 'kask', 'emniyet kemer'], a: ['مرور', 'اشاره', 'اشارات', 'اشاره المرور', 'قانون'], k: ['مرر'] },
        { id: 'yol', z: 1, r: 'yer', t: ['yol', 'cadde', 'sokak', 'köprü', 'sağa', 'sola', 'düz git', 'nerede', 'adres', 'uzak', 'yakın'], a: ['طريق', 'شارع', 'جسر', 'يمين', 'يسار', 'اين', 'عنوان', 'بعيد', 'قريب'], k: ['طرق', 'شرع'] },
        { id: 'sehir', r: 'yer', t: ['şehir', 'şehri', 'kent', 'ilçe', 'bina', '=köy', 'köyü', 'köyde', 'istanbul', 'ankara', 'izmir', 'konya', 'antalya', 'rize', '=kars', 'bursa', 'trabzon', '=van', 'erzurum', 'kahire', 'mısır', 'bağdat', '=şam', 'cidde', 'riyad'], a: ['مدينه', 'مدن', 'قريه', 'مبني', 'اسطنبول', 'انقره', 'ازمير', 'قونيه', 'انطاليا', 'القاهره', 'مصر', 'بغداد', 'دمشق', 'جده', 'الرياض'], k: ['مدن', 'قري'] },
        { id: 'turk-bayragi', r: 'nesne', t: ['türkiye', 'türk', 'vatan', 'bayrak', 'millet', 'şehit', 'cumhuriyet', 'istiklal', 'çanakkale', 'savaş', 'zafer', 'malazgirt'], a: ['تركيا', 'تركي', 'وطن', 'علم', 'شهيد', 'جمهوريه'], k: ['وطن'] },
        { id: 'muze', r: 'yer', t: ['müze', 'saray', 'tarihi', 'tarihî', 'eser', 'kale', 'antik', 'harabe', 'topkapı', 'efes'], a: ['متحف', 'قصر', 'تاريخي', 'تاريخيه', 'اثار', 'قلعه'], k: ['تحف', 'أثر'] },
        { id: 'market', r: 'yer', t: ['market', 'bakkal', 'dükkân', 'dükkan', 'mağaza', 'kırtasiye', 'çarşı', 'alışveriş merkez'], a: ['بقاله', 'دكان', 'متجر', 'محل', 'قرطاسيه', 'سوق', 'مركز التسوق'], k: ['بقل', 'تجر'], m: 'pazar' },
        { id: 'pazar', r: 'yer', t: ['pazar yeri', 'semt pazar', 'pazarda', 'pazara', 'manav', 'kasap'], a: ['السوق الشعبي', 'سوق شعبي', 'خضري'], m: 'pazar' },

        /* --- hayvanlar --- */
        { id: 'kedi', r: 'nesne', t: ['kedi'], a: ['قطه', 'قط', 'قطط'] },
        { id: 'kopek', r: 'nesne', t: ['köpek'], a: ['كلب', 'كلاب'] },
        { id: 'kus', r: 'nesne', t: ['kuş', 'güvercin', 'serçe', 'kanat'], a: ['طائر', 'طيور', 'عصفور', 'حمامه'] },
        { id: 'at', r: 'nesne', t: ['=at', '=atı', '=atlar', 'ata bin', 'binicilik', 'eşek'], a: ['حصان', 'خيل', 'فرس', 'حمار'] },
        { id: 'deve', r: 'nesne', t: ['deve', 'çöl'], a: ['جمل', 'ناقه', 'صحراء'] },
        { id: 'kelebek', r: 'nesne', t: ['kelebek', '=arı', 'arılar', 'böcek', 'karınca'], a: ['فراشه', 'نحله', 'حشره', 'نمله'] },
        { id: 'hayvanlar', svg: 'kopek', r: 'nesne', t: ['hayvan', 'evcil'], a: ['حيوان', 'حيوانات', 'اليف'] },

        /* --- değerler, dünya, akıl, hayvanat bahçesi --- */
        { id: 'degerler', r: 'his', t: ['saygı', 'dürüst', 'yalan', 'sabır', 'acele', 'ahlak', 'ahlâk', 'nazik', 'kibar', 'cömert', 'merhamet', 'emanet', 'sorumluluk', 'cesaret', 'haya', 'kahraman'], a: ['احترام', 'صادق', 'الصدق', 'كاذب', 'صبور', 'صبر', 'متسرع', 'اخلاق', 'كرم', 'كريم', 'رحمه', 'امانه', 'مسؤوليه', 'شجاعه', 'حياء'] },
        { id: 'dunya', svg: 'dunya-kuresi', r: 'yer', t: ['dünya', 'uyruk', 'milliyet', 'afrika', 'asya', 'avrupa', 'kuzey', 'güney', '~doğu(da|dan|ya|su|sunda|sundan|sunu)?', '~batı(da|dan|ya|sı|sında|sından|sına)?', 'ingiltere', 'fransa', 'almanya', 'amerika', 'japonya', '=çin', 'rusya', 'italya', 'ispanya', 'suriye', 'ürdün', '=fas', 'tunus', 'cezayir', 'libya', 'sudan', 'katar', 'kuveyt', 'irak', '=iran', 'lübnan', 'yemen', 'umman', 'malezya', 'endonezya', 'pakistan', 'azerbaycan'], a: ['عالم', 'العالم', 'جنسيه', 'افريقيا', 'اسيا', 'اوروبا', 'شمال', 'جنوب', 'شرق', 'غرب', 'انجلترا', 'فرنسا', 'المانيا', 'امريكا', 'اليابان', 'الصين', 'روسيا', 'سوريا', 'الاردن', 'المغرب', 'تونس', 'الجزائر', 'ليبيا', 'السودان', 'قطر', 'الكويت', 'العراق', 'لبنان', 'اليمن'] },
        { id: 'akil', svg: 'beyin', r: 'nesne', t: ['hafıza', 'beyin', 'zeka', 'zekâ'], a: ['ذاكره', 'دماغ', 'ذكاء', 'ذكي'] },
        { id: 'dogru', svg: 'onay', r: 'ifade', t: ['=doğru', 'doğrudur', 'doğru mu', '=yanlış', 'yanlıştır', 'haklısın', 'aynen'], a: ['صحيح', 'صح', 'خطا', 'بالضبط'] },
        { id: 'dosya', svg: 'klasor', r: 'nesne', t: ['dosya', 'klasör'], a: ['ملف', 'ملفات'] },
        { id: 'terazi', svg: 'terazi', r: 'nesne', t: ['terazi', 'mizan', 'tartı'], a: ['ميزان'] },
        { id: 'gurultu', svg: 'hoparlor', r: 'nesne', t: ['gürültü', 'ses kirliliği', 'hoparlör'], a: ['ضوضاء', 'ضجيج', 'مكبر الصوت'] },
        { id: 'duman', svg: 'fabrika', r: 'nesne', t: ['duman', 'egzoz', 'hava kirliliği'], a: ['دخان', 'عادم'] },
        { id: 'cuha', r: 'kisi', t: ['cuha', 'nasreddin', 'nasrettin'], a: ['جحا'] },
        { id: 'aslan', r: 'nesne', t: ['aslan'], a: ['اسد', 'الاسد', 'اسود'] },
        { id: 'fil', r: 'nesne', t: ['=fil', 'filler'], a: ['فيل', 'افيال'] },
        { id: 'zurafa', r: 'nesne', t: ['zürafa'], a: ['زرافه'] },
        { id: 'tavsan', r: 'nesne', t: ['tavşan'], a: ['ارنب', 'ارانب'] },
        { id: 'kaplumbaga', r: 'nesne', t: ['kaplumbağa'], a: ['سلحفاه', 'سلحفاة'] },

        /* --- afet --- */
        { id: 'deprem', r: 'zaman', t: ['deprem', 'sarsıntı', 'afet', 'enkaz', 'çadır'], a: ['زلزال', 'زلازل', 'كارثه', 'كوارث'], k: ['زلزل'] },
        { id: 'ates', r: 'zaman', t: ['yangın', 'itfaiye', 'alev', 'ateş'], a: ['حريق', 'نار', 'اطفاء'], k: ['حرق'] },

        /* --- iş ve zaman soyutları (kütüphanede hazır) --- */
        { id: 'fabrika', r: 'yer', t: ['fabrika', 'şirket', 'ofis', 'iş yer', 'büro'], a: ['مصنع', 'مصانع', 'صناعه', 'شركه', 'مكتب'] },
        { id: 'kupa', r: 'nesne', t: ['kupa', 'şampiyon', 'madalya', 'ödül', 'birinci', 'kazan'], a: ['كاس', 'بطل', 'بطوله', 'ميداليه', 'جائزه', 'فاز'], k: ['فوز', 'بطل'] },
        { id: 'kutlama', r: 'eylem', t: ['kutla', 'tebrik', 'doğum günü', 'tören', 'parti', 'şenlik', 'tebrikler', 'aferin'], a: ['احتفال', 'مبروك', 'عيد ميلاد', 'حفله', 'احسنت'], k: ['حفل', 'برك'] },
        { id: 'ampul', r: 'nesne', t: ['fikir', 'hayal', 'düşün', 'akıl', 'icat', '=buluş'], a: ['فكره', 'خيال', 'افكر', 'عقل', 'اختراع'], k: ['فكر', 'خيل', 'خرع'] },
        { id: 'kalp', r: 'his', t: ['~sev(?!iye)\\S*', 'beğen', 'hoşlan', 'aşk'], a: ['حب', 'احب', 'يحب', 'تحب', 'نحب', 'محبه'], k: ['حبب'] },
        { id: 'secim', svg: 'tercih', r: 'eylem', t: ['tercih', 'seç', 'hangisi', 'yoksa', 'veya'], a: ['افضل', 'اختار', 'تختار'] }
    ];

    /* Dersin konusu: o derste hiçbir kavram bulunamayan cümleye yedek öğe.
       Anahtar: veri dosyasının adı (5_3_1) ya da y2627:6_1_1, sec10:10_1_1 */
    var KONU = {
        '5_1_1': 'harfler', '5_1_2': 'tanisma', '5_2_1': 'tahta', '5_2_2': 'kalem', '5_3_1': 'aile', '5_3_2': 'ogretmen',
        '5_3_3': 'gulen-yuz', '5_4_1': 'ev', '5_4_2': 'koltuk', '5_4_3': 'ev', '5_4_4': 'sayilar',
        '6_1_1': 'okul', '6_1_2': 'top', '6_1_3': 'ev', '6_2_1': 'kahvalti', '6_2_2': 'yemek', '6_2_3': 'yemek',
        '6_3_1': 'vucut', '6_3_2': 'hastane', '6_3_3': 'temizlik', '6_4_1': 'mevsimler', '6_4_2': 'mont', '6_4_3': 'tisort',
        '6_5_1': 'kabe', '6_5_2': 'medine', '6_5_3': 'kudus', '6_6_1': 'otobus', '6_6_2': 'trafik-isigi', '6_6_3': 'bavul',
        '7_1': 'iki-kisi', '7_2': 'okul', '7_3': 'ev', '7_4': 'sehir',
        '8_1_1': 'takim', '8_1_2': 'tiyatro', '8_1_3': 'bavul', '8_2_1': 'kitap', '8_2_2': 'kutuphane', '8_2_3': 'el-sanatlari',
        '8_3_1': 'dostluk', '8_3_2': 'is-birligi', '8_3_3': 'bayram', '8_4_1': 'cevre', '8_4_2': 'aslan', '8_4_3': 'deprem',
        '8_5_1': 'kupa', '8_5_2': 'kosmak', '8_5_3': 'futbol', '8_6_1': 'mezuniyet-kepi', '8_6_2': 'merhaba', '8_6_3': 'bavul',
        '9_1_1': 'merhaba', '9_1_2': 'tanisma', '9_2_1': 'okul', '9_2_2': 'aile', '9_3_1': 'ev', '9_3_2': 'yatak', '9_4_1': 'saat', '9_4_2': 'uyanmak',
        '10_1_1': 'isci', '10_1_2': 'is-birligi', '10_2_1': 'hasta', '10_2_2': 'nota', '10_3_1': 'sehir', '10_3_2': 'araba', '10_4_1': 'cami', '10_4_2': 'bayram',
        'y2627:6_1_1': 'aile', 'y2627:6_1_2': 'ogretmen', 'y2627:6_2_1': 'okul', 'y2627:6_2_2': 'kursu', 'y2627:6_3_1': 'vucut',
        'y2627:6_3_2': 'gulen-yuz', 'y2627:6_4_1': 'bulut', 'y2627:6_4_2': 'renkler',
        'y2627:7_1_1': 'doktor', 'y2627:7_1_2': 'ogretmen', 'y2627:7_1_3': 'ampul', 'y2627:7_2_1': 'market', 'y2627:7_2_2': 'kalem',
        'y2627:7_2_3': 'pazar', 'y2627:7_3_1': 'yagmur', 'y2627:7_3_2': 'kar', 'y2627:7_3_3': 'gunes', 'y2627:7_4_1': 'muze',
        'y2627:7_4_2': 'turk-bayragi', 'y2627:7_4_3': 'kitap', 'y2627:7_5_1': 'namaz', 'y2627:7_5_2': 'oruc', 'y2627:7_5_3': 'bayram',
        'y2627:7_6_1': 'telefon', 'y2627:7_6_2': 'bilgisayar', 'y2627:7_6_3': 'mektup',
        'sec10:10_1_1': 'okul', 'sec10:10_1_2': 'ev', 'sec10:10_1_3': 'takvim', 'sec10:10_2_1': 'dua', 'sec10:10_2_2': 'degerler',
        'sec10:10_2_3': 'turk-bayragi', 'sec10:10_3_1': 'vucut', 'sec10:10_3_2': 'yemek', 'sec10:10_3_3': 'spor',
        'sec10:10_4_1': 'muze', 'sec10:10_4_2': 'kabe', 'sec10:10_4_3': 'sehir'
    };

    /* Elle verilmiş sahneler: harekesiz Arapça cümle → tarif.
       Örnek: 'اين المدرسه': 'okul ?' — boş başlar, deneyle doldurulur. */
    var SAHNE_ELLE = window.KIDEF_SAHNE_ELLE || {};

    /* ----------------------------------------------------------- yardımcılar */
    var HAREKE = /[ً-ْٰـ]/g;
    function arSade(s) {
        return String(s == null ? '' : s).replace(HAREKE, '').replace(/[أإآٱ]/g, 'ا')
            .replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^ء-ي\s]/g, ' ')
            .replace(/\s+/g, ' ').trim();
    }
    function trSade(s) {
        return String(s == null ? '' : s).toLocaleLowerCase('tr-TR')
            .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
            .replace(/[’']/g, '\'').replace(/[^a-zçğıöşüâîû0-9'\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    }
    var ONEK = ['وال', 'فال', 'بال', 'كال', 'لل', 'ال', 'و', 'ف', 'ب', 'ل', 'ك'];
    var SONEK = ['كما', 'هما', 'كم', 'هم', 'هن', 'نا', 'ها', 'ون', 'ين', 'ان', 'ات', 'ه', 'ي', 'ك'];
    function arBicimler(t) {
        var b = {}, l = [t];
        b[t] = 1;
        function ekle(x) { if (x && x.length >= 2 && !b[x]) { b[x] = 1; l.push(x); } }
        for (var i = 0; i < ONEK.length; i++) {
            var o = ONEK[i];
            if (t.indexOf(o) === 0 && t.length - o.length >= 2) {
                var g = t.slice(o.length); ekle(g);
                if (o.length === 1 && g.indexOf('ال') === 0) ekle(g.slice(2));
            }
        }
        var su = l.slice();
        su.forEach(function (x) {
            if (/^(وال|فال|بال|كال|لل|ال)/.test(x)) return;     /* belirli isim zamir eki almaz */
            for (var j = 0; j < SONEK.length; j++) {
                var s = SONEK[j];
                if (x.length - s.length >= 2 && x.slice(-s.length) === s) {
                    var g = x.slice(0, -s.length); ekle(g);
                    if (g.slice(-1) === 'ت') ekle(g.slice(0, -1) + 'ه');
                }
            }
        });
        return l;
    }

    /* --------------------------------------------------------------- dizinler */
    var TR = [], AR = {}, KOK = {}, ARC = [], hazir = false, KOKH = null;
    function kur() {
        if (hazir) return;
        hazir = true;
        KAVRAMLAR.forEach(function (c) {
            (c.t || []).forEach(function (t) {
                if (t.charAt(0) === '~') {      /* ~kalıp: kelimenin tamamı bu düzenli ifadeye uymalı */
                    TR.push({ s: t, re: new RegExp('^(?:' + t.slice(1) + ')$'), c: c, uz: 99 });
                    return;
                }
                var tam = t.charAt(0) === '=';
                var x = trSade(tam ? t.slice(1) : t);
                if (x) TR.push({ s: x, tam: tam, c: c, cok: x.indexOf(' ') > 0, son: / $/.test(t), uz: x.length });
            });
            (c.a || []).forEach(function (a) {
                var x = arSade(a);
                if (!x) return;
                if (x.indexOf(' ') > 0) ARC.push({ s: x, c: c });
                else if (!AR[x]) AR[x] = c;
            });
            (c.k || []).forEach(function (k) { if (!KOK[k]) KOK[k] = c; });
        });
        /* uzun tetikleyici önce: «erkek kardeş» «erkek»ten önce */
        TR.sort(function (a, b) { return b.uz - a.uz; });
        if (window.KIDEF_KOK_HARITA) {
            KOKH = {};
            for (var w in window.KIDEF_KOK_HARITA) {
                if (Object.prototype.hasOwnProperty.call(window.KIDEF_KOK_HARITA, w)) KOKH[arSade(w)] = window.KIDEF_KOK_HARITA[w];
            }
        }
    }

    function svgVar(id) { return !!(window.KidefSvg && window.KidefSvg.bul(id)); }
    function svgId(c) { return c.svg || c.id; }

    /* --------------------------------------------------------- işaretler */
    var RENK = {
        'kırmızı': '#E74C3C', 'mavi': '#3498DB', 'yeşil': '#27AE60', 'sarı': '#F4C20D', 'siyah': '#2C3E50',
        'beyaz': '#FFFFFF', 'turuncu': '#E67E22', 'mor': '#8E44AD', 'pembe': '#FF7EB6', 'kahverengi': '#8D5524',
        'gri': '#95A5A6', 'lacivert': '#1F3A93', 'altın': '#D4AF37', 'gümüş': '#BDC3C7'
    };
    var RENK_DEGIL = /^(altında|altından|altına|altını|grip|sarım|sarıl|moral|beyaz peynir)/;   /* «altında» altın rengi değil */
    var AR_RENK = {
        'احمر': 'kırmızı', 'حمراء': 'kırmızı', 'ازرق': 'mavi', 'زرقاء': 'mavi', 'اخضر': 'yeşil', 'خضراء': 'yeşil',
        'اصفر': 'sarı', 'صفراء': 'sarı', 'اسود': 'siyah', 'سوداء': 'siyah', 'ابيض': 'beyaz', 'بيضاء': 'beyaz',
        'برتقالي': 'turuncu', 'بنفسجي': 'mor', 'وردي': 'pembe', 'رمادي': 'gri', 'ذهبي': 'altın'
    };
    var TR_SAYI = { 'sıfır': 0, 'iki': 2, 'üç': 3, 'dört': 4, 'beş': 5, 'altı': 6, 'yedi': 7, 'sekiz': 8, 'dokuz': 9, 'on': 10,
        'yirmi': 20, 'otuz': 30, 'kırk': 40, 'elli': 50, 'altmış': 60, 'yetmiş': 70, 'seksen': 80, 'doksan': 90, 'yüz': 100 };
    var AR_SAYI = { 'صفر': 0, 'واحد': 1, 'اثنان': 2, 'اثنين': 2, 'ثلاث': 3, 'ثلاثه': 3, 'اربع': 4, 'اربعه': 4, 'خمس': 5, 'خمسه': 5,
        'ست': 6, 'سته': 6, 'سبع': 7, 'سبعه': 7, 'ثمان': 8, 'ثماني': 8, 'ثمانيه': 8, 'تسع': 9, 'تسعه': 9, 'عشر': 10, 'عشره': 10,
        'عشرون': 20, 'عشرين': 20, 'ثلاثون': 30, 'ثلاثين': 30, 'اربعون': 40, 'خمسون': 50, 'مئه': 100, 'مائه': 100 };
    var AR_OLUMSUZ = { 'لا': 1, 'ليس': 1, 'ليست': 1, 'لست': 1, 'لسنا': 1, 'لم': 1, 'لن': 1 };

    /* ----------------------------------------------------------- çözümleme
       words: [{tr, ar, arFus, order}] → sahne tarifi
       { ogeler: [{id, olumsuz}], bag: 'ok'|'kalp'|'arti'|null, soru, olumsuz,
         sayi, renkler:[], tema, kaynak: 'elle'|'kavram'|'konu' }               */
    function coz(words, dersId) {
        kur();
        words = words || [];
        var arHam = words.map(function (w) { return w.arFus || w.ar || ''; }).join(' ');
        var arMetin = arSade(arHam);
        var soru = /[?؟]/.test(arHam + ' ' + words.map(function (w) { return w.tr || ''; }).join(' '));

        var elle = SAHNE_ELLE[arMetin];
        if (elle) { var e = tarifCoz(elle); e.soru = e.soru || soru; e.kaynak = 'elle'; return e; }

        var bulunan = [], gor = {}, kanit = [];
        var sayi = null, renkler = [], olumsuz = false, olumsuzYer = -1, trTum = ' ';
        function bul(c, yer, iz) {
            var id = svgId(c);
            if (gor[c.id] || !svgVar(id)) return;
            gor[c.id] = 1;
            bulunan.push({ c: c, yer: yer });
            kanit.push(c.id + '←' + iz);
        }
        /* Her parça (Türkçe kelime öbeği ↔ Arapça karşılığı) ayrı ele alınır:
           önce Türkçesi; Türkçede hiçbir tetikleyici tutmazsa Arapçası; o da
           tutmazsa kökü. Böylece aynı kelime iki dilden iki ayrı resim getirmez
           («ışık» trafik ışığına giderken Arapçası lambaya gitmez). */
        words.forEach(function (w, wi) {
            var trS = trSade(w.tr), arS = arSade(w.arFus || w.ar || '');
            var sozler = trS ? trS.split(' ') : [];
            var harcandi = [], tuttu = false;
            trTum += trS + ' ';
            /* 0) sayılar ve renkler kendi kelimelerini harcar
                  («yedi» yemek değil 7; «kahverengi» kahve değil renk) */
            sozler.forEach(function (soz, k) {
                if (Object.prototype.hasOwnProperty.call(TR_SAYI, soz)) { if (sayi == null) sayi = TR_SAYI[soz]; harcandi[k] = 1; tuttu = true; }
                else if (/^\d{1,4}$/.test(soz.replace(/'.*$/, ''))) { if (sayi == null) sayi = +soz.replace(/'.*$/, ''); harcandi[k] = 1; tuttu = true; }
                if (!RENK_DEGIL.test(soz)) {
                    for (var r in RENK) {
                        if (soz.indexOf(r) === 0) { if (renkler.indexOf(r) < 0) renkler.push(r); harcandi[k] = 1; tuttu = true; }
                    }
                }
            });
            /* 1) Türkçe: uzun tetikleyici önce gelir ve kullandığı kelimeleri
                  «harcar» («kızgın» kızgınlığa gidince «kız»a da gitmez) */
            var metin = ' ' + trS + ' ';
            TR.forEach(function (t) {
                if (t.cok || t.son) {
                    var aranan = ' ' + t.s + (t.son ? ' ' : '');
                    var i = metin.indexOf(aranan);
                    while (i >= 0) {
                        var bas = metin.slice(0, i + 1).split(' ').length - 2, adet = t.s.split(' ').length;
                        var bos = true;
                        for (var z = bas; z < bas + adet; z++) if (harcandi[z]) bos = false;
                        if (bos) {
                            for (var z2 = bas; z2 < bas + adet; z2++) harcandi[z2] = 1;
                            tuttu = true; bul(t.c, wi * 100 + bas, 'tr:' + t.s); break;
                        }
                        i = metin.indexOf(aranan, i + 1);
                    }
                    return;
                }
                for (var k = 0; k < sozler.length; k++) {
                    if (harcandi[k]) continue;
                    var soz = sozler[k];
                    var uyar = t.re ? t.re.test(soz.replace(/'.*$/, ''))
                             : t.tam ? (soz === t.s || soz.indexOf(t.s + '\'') === 0)
                                     : (soz.indexOf(t.s) === 0 && (t.s.length >= 3 || soz === t.s));
                    if (uyar) { harcandi[k] = 1; tuttu = true; bul(t.c, wi * 100 + k, 'tr:' + t.s); break; }
                }
            });
            /* 2) Arapça yalnız Türkçesi bir şey getirmeyen parçada */
            var arSoz = arS ? arS.split(' ') : [];
            arSoz.forEach(function (t) {
                (t === 'الاثنين' ? [] : [t, t.replace(/^(وال|بال|فال|ال|و|ب)(?=..)/, '')]).forEach(function (b) {
                    if (sayi == null && Object.prototype.hasOwnProperty.call(AR_SAYI, b)) sayi = AR_SAYI[b];
                    if (AR_RENK[b] && renkler.indexOf(AR_RENK[b]) < 0) renkler.push(AR_RENK[b]);
                });
            });
            var arHamP = String(w.arFus || w.ar || '').replace(HAREKE, '');
            if (/(^|[\s«(])(ليس|ليست|لست|لسنا|لستم|لم|لن)(?=[\s.!؟?،,»)]|$)/.test(arHamP) ||
                /(^|[\s«(])لا\s+[ء-ي]/.test(arHamP) || /^\s*لا\s*$/.test(arHamP)) {
                olumsuz = true;
                if (olumsuzYer < 0) olumsuzYer = wi * 100 + 99;
            }
            /* Türkçe «değil / yok»: çarpı, kendinden önceki resmin üstüne */
            sozler.forEach(function (soz, k) {
                if ((soz === 'değil' || soz.indexOf('değil') === 0 || soz === 'yok' || soz === 'yoktur') && olumsuzYer < 0) {
                    olumsuz = true; olumsuzYer = wi * 100 + k;
                }
            });
            if (tuttu) return;
            var arBuldu = false;
            ARC.forEach(function (a) { if ((' ' + arS + ' ').indexOf(' ' + a.s + ' ') >= 0) { arBuldu = true; bul(a.c, wi * 100 + 50, 'ar:' + a.s); } });
            if (arBuldu) return;
            arSoz.forEach(function (t, n) {
                if (!t || AR_OLUMSUZ[t]) return;
                var bic = arBicimler(t), oldu = false;
                for (var i = 0; i < bic.length; i++) {
                    if (AR[bic[i]]) { bul(AR[bic[i]], wi * 100 + 50 + n, 'ar:' + bic[i]); oldu = true; break; }
                }
                if (!oldu && KOKH) {
                    for (var j = 0; j < bic.length; j++) {
                        var h = KOKH[bic[j]];
                        if (h && KOK[h[0]]) { bul(KOK[h[0]], wi * 100 + 50 + n, 'kök:' + h[0]); break; }
                    }
                }
            });
        });

        /* 2b) çok kelimeli Türkçe tetikleyiciler parçalar arasında da aranır
               («Halin | nasıl?» → selamlaşma) */
        var butun = ' ' + words.map(function (w) { return trSade(w.tr); }).join(' ').replace(/\s+/g, ' ') + ' ';
        TR.forEach(function (t) {
            if (t.cok && !gor[t.c.id] && butun.indexOf(' ' + t.s + (t.son ? ' ' : '')) >= 0) bul(t.c, 90, 'tr+:' + t.s);
        });


        /* 4) seçim: kişi → eylem/his/nesne → yer; en çok 3. «Genel» kavramlar
              (takvim, saat, hava, konuşmak, yol: z) yalnız sahne tek öğeyle
              kalacaksa eklenir; «sevmek» (kalp) öğe değil bağlaç olur. */
        var SIRA = { kisi: 0, eylem: 1, his: 1, ifade: 1, nesne: 2, yer: 3, zaman: 4 };
        bulunan.sort(function (a, b) { return a.yer - b.yer; });
        var guclu = bulunan.filter(function (x) { return !x.c.z && x.c.id !== 'kalp'; });
        var zayif = bulunan.filter(function (x) { return x.c.z; });
        function rol(l, r) { return l.filter(function (x) { return r.indexOf(x.c.r) >= 0; }); }
        var kisi = rol(guclu, ['kisi']), orta = rol(guclu, ['eylem', 'his', 'ifade', 'nesne']);
        var yer = rol(guclu, ['yer']), zmn = rol(guclu, ['zaman']);
        var secim = [];
        if (kisi.length) secim.push(kisi[0]);
        orta.forEach(function (x) { if (secim.length < 2 + (yer.length ? 0 : 1)) secim.push(x); });
        if (yer.length && secim.length < 3) secim.push(yer[0]);
        if (yer.length > 1 && secim.length < 2) secim.push(yer[1]);
        zmn.forEach(function (x) { if (secim.length < 3) secim.push(x); });
        if (kisi.length > 1 && secim.length < 3) secim.splice(1, 0, kisi[1]);
        orta.forEach(function (x) { if (secim.length < 3 && secim.indexOf(x) < 0) secim.push(x); });
        if (!gor.kalp) zayif.forEach(function (x) { if (secim.length < 2) secim.push(x); });
        secim = secim.slice(0, 3);
        secim.sort(function (a, b) { return (SIRA[a.c.r] - SIRA[b.c.r]) || (a.yer - b.yer); });
        if (gor.kalp && !secim.length) zayif.slice(0, 1).forEach(function (x) { secim.push(x); });
        var yerVar = secim.some(function (x) { return x.c.r === 'yer'; });

        var tema = null;
        secim.concat(guclu, zayif).forEach(function (x) { if (!tema && x.c.m) tema = x.c.m; });

        var kaynak = 'kavram';
        if (!secim.length) {
            var k = KONU[dersId];
            if (k && svgVar(k)) secim.push({ c: { id: k, r: 'nesne' } });
            else secim.push({ c: { id: soru ? 'soru' : 'sohbet', r: 'ifade' } });
            kaynak = 'konu';
        }

        /* bağlaç: sevmek → kalp, gitmek → ok (yer varsa), «ve» → artı */
        var bag = null;
        if (gor.kalp) {
            if (secim.length > 1) bag = 'kalp';
            else secim.push({ c: { id: 'kalp', r: 'his' } });
        } else if (yerVar && secim.length > 1 && /( git| gid| gel| dön| ulaş| yürü| varı| çık| koş)/.test(trTum)) {
            bag = 'ok';
        } else if (secim.length > 1 && / ve /.test(trTum) && secim[0].c.r === secim[1].c.r && secim[0].c.r !== 'kisi') {
            bag = 'arti';
        }
        return {
            ogeler: secim.map(function (x) { return { id: svgId(x.c), r: x.c.r, yer: x.yer || 0 }; }),
            bag: bag, soru: soru, olumsuz: olumsuz, olumsuzYer: olumsuzYer, sayi: sayi, renkler: renkler.slice(0, 3),
            tema: tema, kaynak: kaynak, kavramlar: bulunan.map(function (x) { return x.c.id; }), kanit: kanit
        };
    }
    S.coz = coz;

    /* Tarif dili (SAHNE_ELLE için): boşlukla ayrılmış parçalar
         kalem okul        öğeler (kütüphane id'si)
         >  +  <3          bağlaç: ok · artı · kalp (iki öğenin arasına)
         ?  x  #3  @gece   soru · olumsuz · sayı rozeti · zemin
         renk:mavi         renk lekesi                                       */
    function tarifCoz(t) {
        var o = { ogeler: [], bag: null, soru: false, olumsuz: false, sayi: null, renkler: [], tema: null };
        String(t).split(/\s+/).forEach(function (p) {
            if (!p) return;
            if (p === '?') o.soru = true;
            else if (p === 'x') o.olumsuz = true;
            else if (p === '>') o.bag = 'ok';
            else if (p === '+') o.bag = 'arti';
            else if (p === '<3') o.bag = 'kalp';
            else if (p.charAt(0) === '#') o.sayi = +p.slice(1);
            else if (p.charAt(0) === '@') o.tema = p.slice(1);
            else if (p.indexOf('renk:') === 0) o.renkler.push(p.slice(5));
            else if (svgVar(p)) o.ogeler.push({ id: p });
        });
        return o;
    }
    S.tarifCoz = tarifCoz;

    /* ----------------------------------------------------------------- çizim */
    var BAG_SVG = {
        ok: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 24h26" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M27 14l11 10-11 10" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        arti: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 11v26M11 24h26" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
        kalp: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40C11 31 6 24 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 7-5 14-18 23z" fill="#EF4F6E"/></svg>'
    };
    function kacir(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function karma(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
    function hareketYok() {
        try {
            return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
                document.documentElement.classList.contains('dusuk-guc');
        } catch (e) { return false; }
    }

    function html(t, anahtar) {
        var h = karma(anahtar || '');
        var parca = [];
        /* bağlaç tek yerde durur: ok yerin önünde (kim → nereye), kalp ve
           artı ilk iki öğenin arasında */
        var bagYer = -1;
        if (t.bag === 'ok') {
            for (var y = 1; y < t.ogeler.length; y++) if (t.ogeler[y].r === 'yer') { bagYer = y; break; }
        } else if (t.bag) bagYer = 1;
        /* olumsuzluk çarpısı: olumsuz sözden önceki en yakın resim (yoksa sonuncusu) */
        var cizik = t.ogeler.length - 1;
        if (t.olumsuzYer != null && t.olumsuzYer >= 0) {
            var enYakin = -1;
            t.ogeler.forEach(function (o, i) { if ((o.yer || 0) <= t.olumsuzYer && (enYakin < 0 || (o.yer || 0) >= (t.ogeler[enYakin].yer || 0))) enYakin = i; });
            if (enYakin >= 0) cizik = enYakin;
        }
        t.ogeler.forEach(function (o, i) {
            if (i === bagYer) parca.push('<span class="msh-bag msh-bag-' + t.bag + '" style="--i:' + (i * 2 - 1) + '">' + BAG_SVG[t.bag] + '</span>');
            var svg = window.KidefSvg ? window.KidefSvg.html(o.id, { etiket: false, sinif: 'msh-svg' }) : '';
            var cevir = ((h >> (i * 3)) % 7) - 3;
            parca.push('<span class="msh-oge" style="--i:' + (i * 2) + ';--egik:' + cevir + 'deg">' + svg +
                (t.olumsuz && i === cizik ? '<span class="msh-cizik" aria-hidden="true"></span>' : '') + '</span>');
        });
        var rozet = '';
        if (t.sayi != null && t.sayi >= 0 && t.sayi <= 9999) rozet += '<span class="msh-sayi">' + t.sayi + '</span>';
        if (t.renkler && t.renkler.length) {
            rozet += '<span class="msh-renkler">' + t.renkler.map(function (r) {
                return '<i style="--r:' + (RENK[r] || r) + '"></i>';
            }).join('') + '</span>';
        }
        if (t.soru) rozet += '<span class="msh-soru">?</span>';
        return '<div class="msh" data-tema="' + kacir(t.tema || 'acik') + '" data-kaynak="' + (t.kaynak || '') + '" aria-hidden="true">' +
            '<div class="msh-sahne">' + parca.join('') + '</div>' + rozet + '</div>';
    }
    S.html = html;

    /* kip: 'sentence' | 'dialog' · veri: words | {p1, p2} */
    function ciz(kip, veri) {
        if (!document.body) return;
        if (!window.KidefSvg) { kutuphaneyiBekle(kip, veri); return; }
        stil();
        tusKur();
        var kapali = acikMi() === false;
        document.documentElement.classList.toggle('msh-kapali', kapali);
        var ders = dersAnahtari();
        if (kip === 'sentence') {
            yaz(kap('sentence-mode', 's-sahne'), veri, ders, 'tek');
        } else if (veri) {
            yaz(kap('p1-area', 'p1-sahne'), veri.p1, ders, 'sol');
            yaz(kap('p2-area', 'p2-sahne'), veri.p2, ders, 'sag');
        }
    }
    S.ciz = ciz;
    /* SVG kütüphanesi (veri/veri_svg.js) sayfayı bekletmesin diye async
       geliyor; gelmeden çizim istenirse en son istek saklanır, kütüphane
       yüklenince o çizilir. */
    var bekleyen = null, dinleniyor = false;
    function kutuphaneyiBekle(kip, veri) {
        bekleyen = [kip, veri];
        if (dinleniyor) return;
        dinleniyor = true;
        function dene() {
            if (!window.KidefSvg || !bekleyen) return !!window.KidefSvg;
            var b = bekleyen; bekleyen = null; ciz(b[0], b[1]);
            return true;
        }
        var sc = document.querySelector('script[src*="veri/veri_svg.js"]');
        if (sc) sc.addEventListener('load', dene);
        var n = 0;
        (function yokla() { if (dene() || ++n > 80) return; setTimeout(yokla, 250); })();
    }
    /* KONU anahtarı: 5_3_1 · y2627:6_1_1 · sec10:10_1_1 — yüklenen veri dosyasının yolundan */
    var dersAn = null;
    function dersAnahtari() {
        if (dersAn !== null) return dersAn;
        var d = window.KIDEF_DERS || '';
        var src = '';
        [].forEach.call(document.querySelectorAll('script[src*="muhadese/veri/"]'), function (sc) {
            var a = sc.getAttribute('src') || '';
            if (a.indexOf('/' + d + '.js') >= 0) src = a;
        });
        dersAn = /\/y2627\//.test(src) ? 'y2627:' + d : (/\/sec10\//.test(src) ? 'sec10:' + d : d);
        return dersAn;
    }
    S.dersAnahtari = dersAnahtari;

    function kap(ebeveynId, id) {
        var el = document.getElementById(id);
        if (el) return el;
        var e = document.getElementById(ebeveynId);
        if (!e) return null;
        el = document.createElement('div');
        el.id = id;
        el.className = 'msh-kap';
        e.insertBefore(el, e.firstChild);
        return el;
    }
    function yaz(el, words, ders, yon) {
        if (!el) return;
        if (!words || !words.length || !window.KidefSvg) { el.innerHTML = ''; return; }
        var t = coz(words, ders);
        if (yon !== 'tek' && t.ogeler.length > 2) t.ogeler = t.ogeler.slice(0, 2);   /* diyalogda yan resim dar kalsın */
        var anahtar = words.map(function (w) { return w.arFus || w.ar || ''; }).join(' ');
        el.setAttribute('data-yon', yon);
        function bas() {
            el.innerHTML = html(t, anahtar);
            if (hareketYok()) {
                [].forEach.call(el.querySelectorAll('svg'), function (s) { try { s.pauseAnimations(); } catch (e) { } });
            }
        }
        bas();
        /* resme dokununca canlanması baştan oynar */
        el.onclick = bas;
    }

    /* ------------------------------------------------------ aç/kapa tuşu */
    var ANAHTAR = 'kidefSahne';
    function acikMi() { try { return localStorage.getItem(ANAHTAR) !== '0'; } catch (e) { return true; } }
    function tusKur() {
        if (document.getElementById('mshTus')) return;
        var ses = document.getElementById('sesSwitch');
        if (!ses || !ses.parentNode) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'mshTus';
        b.className = 'msh-tus';
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<circle cx="9" cy="10" r="1.8" fill="currentColor"/><path d="M5 17l5-5 3 3 2-2 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
            '<path class="msh-tus-cizgi" d="M4 4l16 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
        function guncelle() {
            var a = acikMi();
            b.classList.toggle('kapali', !a);
            b.title = a ? 'Cümle resimlerini gizle' : 'Cümle resimlerini göster';
            b.setAttribute('aria-label', b.title);
            b.setAttribute('aria-pressed', a ? 'true' : 'false');
            document.documentElement.classList.toggle('msh-kapali', !a);
        }
        b.onclick = function () {
            try { localStorage.setItem(ANAHTAR, acikMi() ? '0' : '1'); } catch (e) { }
            guncelle();
        };
        ses.parentNode.insertBefore(b, ses);
        guncelle();
    }

    /* ------------------------------------------------------------ biçim */
    var stilVar = false;
    function stil() {
        if (stilVar) return;
        stilVar = true;
        var s = document.createElement('style');
        s.id = 'msh-stil';
        s.textContent = [
            '.msh-kap{width:100%;display:flex;justify-content:center;flex:0 0 auto}',
            '.msh{cursor:pointer;-webkit-tap-highlight-color:transparent}',
            '#s-sahne{--msh-h:clamp(110px,25vh,250px);margin-bottom:clamp(8px,2.4vh,26px)}',
            '#p1-sahne,#p2-sahne{--msh-h:clamp(56px,11vh,120px);margin-bottom:6px}',
            'html.msh-kapali .msh-kap{display:none}',
            /* diyalog (geniş ekran): resim satırın yanında durur, yükseklik yemez —
               1. kişi solda, 2. kişi sağda (sohbet balonu gibi) */
            '@media (min-width:900px){',
            '  .dialog-row{position:relative}',
            '  #p1-sahne,#p2-sahne{--msh-h:clamp(64px,13vh,130px);position:absolute;top:50%;transform:translateY(-50%);width:auto;margin:0;z-index:1}',
            '  #p1-sahne{left:18px}#p2-sahne{right:18px}',
            '  html:not(.msh-kapali) #p1-area>.tr-container,html:not(.msh-kapali) #p1-area>.ar-output{padding-inline-start:calc(var(--msh-yan,2.4) * clamp(64px,13vh,130px) + 30px)}',
            '  html:not(.msh-kapali) #p2-area>.tr-container,html:not(.msh-kapali) #p2-area>.ar-output{padding-inline-end:calc(var(--msh-yan,2.4) * clamp(64px,13vh,130px) + 30px)}',
            '}',
            '.msh{position:relative;display:inline-flex;align-items:center;justify-content:center;height:var(--msh-h);',
            '  padding:calc(var(--msh-h)*.06) calc(var(--msh-h)*.16);border-radius:calc(var(--msh-h)*.16);',
            '  background:var(--msh-zemin,linear-gradient(160deg,#F3F8FF,#FFFFFF));',
            '  box-shadow:0 10px 26px -14px rgba(30,60,110,.35),inset 0 0 0 1px rgba(30,60,110,.06);',
            '  animation:msh-kart .5s cubic-bezier(.2,1.2,.4,1) both}',
            '.msh-sahne{display:flex;align-items:center;gap:calc(var(--msh-h)*.06);height:100%}',
            '.msh-oge{position:relative;display:block;height:calc(var(--msh-h)*.86);aspect-ratio:1;',
            '  transform:rotate(var(--egik,0deg));animation:msh-gir .62s cubic-bezier(.2,1.5,.4,1) both;animation-delay:calc(var(--i)*.11s)}',
            '.msh-oge>svg{display:block;width:100%;height:100%;animation:msh-suz 3.4s ease-in-out infinite;animation-delay:calc(var(--i)*-.7s)}',
            '.msh-bag{display:block;width:calc(var(--msh-h)*.28);color:#3B6FB6;opacity:.85;animation:msh-gir .5s ease both;animation-delay:calc(var(--i)*.11s)}',
            '.msh-bag svg{display:block;width:100%}',
            '.msh-bag-ok svg{animation:msh-ok 1.6s ease-in-out infinite}',
            '.msh-bag-kalp svg{animation:msh-kalp 1.2s ease-in-out infinite}',
            '.msh-cizik{position:absolute;inset:8%;border-radius:50%;border:calc(var(--msh-h)*.04) solid #E74C3C;opacity:.9;',
            '  background:linear-gradient(135deg,transparent 46%,#E74C3C 46%,#E74C3C 54%,transparent 54%);',
            '  animation:msh-gir .5s ease both;animation-delay:.5s}',
            '.msh-soru{position:absolute;top:calc(var(--msh-h)*-.10);right:calc(var(--msh-h)*-.10);width:calc(var(--msh-h)*.30);height:calc(var(--msh-h)*.30);',
            '  border-radius:50%;background:#F39C12;color:#fff;font:800 calc(var(--msh-h)*.2)/1 Marhey,system-ui,sans-serif;',
            '  display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px -3px rgba(0,0,0,.3);',
            '  animation:msh-gir .5s ease both .35s,msh-sallan 2.6s ease-in-out infinite 1s}',
            '.msh-sayi{position:absolute;bottom:calc(var(--msh-h)*-.08);left:calc(var(--msh-h)*-.06);min-width:calc(var(--msh-h)*.28);height:calc(var(--msh-h)*.28);',
            '  padding:0 calc(var(--msh-h)*.05);border-radius:calc(var(--msh-h)*.14);background:#1F6FD1;color:#fff;',
            '  font:800 calc(var(--msh-h)*.18)/1 Marhey,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;',
            '  box-shadow:0 4px 10px -3px rgba(0,0,0,.3);animation:msh-gir .5s ease both .45s}',
            '.msh-renkler{position:absolute;bottom:calc(var(--msh-h)*-.07);right:calc(var(--msh-h)*.04);display:flex;gap:4px}',
            '.msh-renkler i{display:block;width:calc(var(--msh-h)*.16);height:calc(var(--msh-h)*.16);border-radius:50%;background:var(--r);',
            '  box-shadow:0 0 0 2px #fff,0 3px 8px -2px rgba(0,0,0,.35);animation:msh-gir .5s ease both .5s}',
            /* zeminler */
            '.msh[data-tema="gece"]{--msh-zemin:radial-gradient(circle at 80% 18%,#3B4F8F 0 8%,transparent 9%),linear-gradient(170deg,#1C2B5A,#34477E)}',
            '.msh[data-tema="aksam"]{--msh-zemin:linear-gradient(175deg,#FFB27A,#FF8E8E 55%,#8E7CC3)}',
            '.msh[data-tema="sabah"]{--msh-zemin:linear-gradient(175deg,#FFF1C9,#FFE0B2 60%,#FFF8EC)}',
            '.msh[data-tema="gunes"]{--msh-zemin:radial-gradient(circle at 85% 15%,#FFE58A 0 12%,transparent 13%),linear-gradient(175deg,#BFE6FF,#EAF7FF)}',
            '.msh[data-tema="bulut"]{--msh-zemin:linear-gradient(175deg,#DCE6F2,#F4F7FB)}',
            '.msh[data-tema="yagmur"]{--msh-zemin:repeating-linear-gradient(110deg,rgba(255,255,255,.0) 0 14px,rgba(255,255,255,.35) 14px 16px),linear-gradient(175deg,#9FB4CC,#D7E2EE)}',
            '.msh[data-tema="kar"]{--msh-zemin:radial-gradient(#fff 1.2px,transparent 1.6px) 0 0/18px 18px,linear-gradient(175deg,#CFE3F7,#F1F8FF)}',
            '.msh[data-tema="deniz"]{--msh-zemin:linear-gradient(180deg,#CDEBFF 0 55%,#7CC4F0 55% 70%,#4FA7DC 70%)}',
            '.msh[data-tema="okul"]{--msh-zemin:linear-gradient(175deg,#E8F6EF,#FFFFFF)}',
            '.msh[data-tema="ev"]{--msh-zemin:linear-gradient(175deg,#FFF3E4,#FFFCF7)}',
            '.msh[data-tema="cami"]{--msh-zemin:linear-gradient(175deg,#E3F4F1,#FFF9EC)}',
            '.msh[data-tema="hastane"]{--msh-zemin:linear-gradient(175deg,#E6F7F6,#FFFFFF)}',
            '.msh[data-tema="spor"]{--msh-zemin:linear-gradient(180deg,#E9F8E6 0 62%,#BFE5B4 62%)}',
            '.msh[data-tema="bahce"]{--msh-zemin:linear-gradient(180deg,#EAF6FF 0 60%,#CDEBC1 60%)}',
            '.msh[data-tema="pazar"]{--msh-zemin:linear-gradient(175deg,#FFF0DE,#FFFBF5)}',
            '.msh[data-tema="gece"] .msh-bag,.msh[data-tema="aksam"] .msh-bag{color:#fff}',
            /* hareketler */
            '@keyframes msh-kart{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}',
            '@keyframes msh-gir{0%{opacity:0;transform:scale(.4) rotate(calc(var(--egik,0deg) - 14deg))}100%{opacity:1;transform:rotate(var(--egik,0deg))}}',
            '@keyframes msh-suz{0%,100%{transform:translateY(0)}50%{transform:translateY(-4%)}}',
            '@keyframes msh-ok{0%,100%{transform:translateX(-6%)}50%{transform:translateX(8%)}}',
            '@keyframes msh-kalp{0%,100%{transform:scale(1)}40%{transform:scale(1.18)}}',
            '@keyframes msh-sallan{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}',
            /* aç/kapa tuşu */
            '.msh-tus{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;margin-inline-end:6px;',
            '  border:0;border-radius:10px;background:rgba(255,255,255,.22);color:#fff;cursor:pointer}',
            '.msh-tus svg{width:20px;height:20px}',
            '.msh-tus .msh-tus-cizgi{display:none}',
            '.msh-tus.kapali .msh-tus-cizgi{display:inline}',
            '.msh-tus.kapali{opacity:.75}',
            '@media (max-width:640px){#s-sahne{--msh-h:clamp(84px,17vh,140px)}#p1-sahne,#p2-sahne{--msh-h:clamp(52px,9vh,84px)}}',
            '@media (prefers-reduced-motion:reduce){.msh,.msh *{animation:none!important}}',
            'html.dusuk-guc .msh,html.dusuk-guc .msh *{animation:none!important}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(s);
    }

    S.stil = stil;
    S.KAVRAMLAR = KAVRAMLAR;
    S.KONU = KONU;
})();
