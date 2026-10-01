const questionPool = [
    {
        text: "مواقع التواصل",
        voweled: "مَوَاقِعُ التَّوَاصُلِ", 
        correct: "Sosyal medya",
        wrongs: ["İletişim becerileri", "Web siteleri", "Sosyal çevre", "Haberleşme ağları"]
    },
    {
        text: "المساعدة الإنسانية",
        voweled: "المُسَاعَدَةُ الإِنْسَانِيَّةُ",
        correct: "İnsani yardım",
        wrongs: ["İnsan hakları", "Toplumsal dayanışma", "Yardımlaşma derneği", "İnsani ilişkiler"]
    },
    {
        text: "الحيوانات الأليفة",
        voweled: "الحَيَوَانَاتُ الأَلِيفَةُ",
        correct: "Evcil hayvanlar",
        wrongs: ["Vahşi hayvanlar", "Hayvan hakları", "Sokak hayvanları", "Hayvanat bahçesi"]
    },
    {
        text: "إدارة الصف",
        voweled: "إِدَارَةُ الصَّفِّ",
        correct: "Sınıf yönetimi",
        wrongs: ["Sınıf düzeni", "Okul idaresi", "Öğrenci işleri", "Ders programı"]
    },
    {
        text: "الإجهاد النفسي",
        voweled: "الإِجْهَادُ النَّفْسِيُّ",
        correct: "Psikolojik stres",
        wrongs: ["Fiziksel yorgunluk", "Ruhsal hastalık", "Sinir krizi", "Zihinsel gelişim"]
    },
    {
        text: "تلوث الهواء",
        voweled: "تَلَوُّثُ الهَوَاءِ",
        correct: "Hava kirliliği",
        wrongs: ["Çevre temizliği", "Su kirliliği", "Hava durumu", "Atmosfer basıncı"]
    },
    {
        text: "العوامل البيئية",
        voweled: "العَوَامِلُ البِيئِيَّةُ",
        correct: "Çevresel faktörler",
        wrongs: ["Doğal afetler", "Biyolojik etkenler", "Çevre koruma", "İklim şartları"]
    },
    {
        text: "منظمة الصحة العالمية",
        voweled: "مُنَظَّمَةُ الصِّحَّةِ العَالَمِيَّةِ",
        correct: "Dünya Sağlık Örgütü",
        wrongs: ["Sağlık Bakanlığı", "Uluslararası Yardım", "Doktorlar Birliği", "Kızılhaç"]
    },
    {
        text: "هجرة الطيور",
        voweled: "هِجْرَةُ الطُّيُورِ",
        correct: "Kuş göçü",
        wrongs: ["Kuş türleri", "Hayvan göçleri", "Mevsimsel değişiklikler", "Göçmen kuşlar"]
    },
    {
        text: "العمود الفقري",
        voweled: "العَمُودُ الفِقْرِيُّ",
        correct: "Omurga / Bel kemiği",
        wrongs: ["İskelet sistemi", "Kafatası", "Sinir sistemi", "Kemik yapısı"]
    },
    {
        text: "الفرد الناجح",
        voweled: "الفَرْدُ النَّاجِحُ",
        correct: "Başarılı birey",
        wrongs: ["Toplumsal başarı", "Bireysel özgürlük", "Çalışkan öğrenci", "Lider kişilik"]
    },
    {
        text: "تحمل المسؤوليات",
        voweled: "تَحَمُّلُ المَسْؤُولِيَّاتِ",
        correct: "Sorumluluk alma",
        wrongs: ["Sorumluluktan kaçma", "Görev dağılımı", "Yetki verme", "Sorumlu davranma"]
    },
    {
        text: "دولة مانحة",
        voweled: "دَوْلَةٌ مَانِحَةٌ",
        correct: "Bağışçı ülke",
        wrongs: ["Gelişmiş ülke", "Yoksul ülke", "Komşu devlet", "Bağımsız devlet"]
    },
    {
        text: "دخان المصانع",
        voweled: "دُخَانُ المَصَانِعِ",
        correct: "Fabrika dumanları",
        wrongs: ["Sanayi atıkları", "Fabrika işçileri", "Çevre kirliliği", "Egzoz gazları"]
    },
    {
        text: "تدفق المعلومات",
        voweled: "تَدَفُّقُ المَعْلُومَاتِ",
        correct: "Bilgi akışı",
        wrongs: ["Bilgi güvenliği", "Veri tabanı", "Haberleşme", "İnternet hızı"]
    },
    {
        text: "مرض رئوي",
        voweled: "مَرَضٌ رِئَوِيٌّ",
        correct: "Akciğer hastalığı",
        wrongs: ["Kalp hastalığı", "Bulaşıcı hastalık", "Kronik rahatsızlık", "Solunum yetmezliği"]
    },
    {
        text: "القفص الصدري",
        voweled: "القَفَصُ الصَّدْرِيُّ",
        correct: "Göğüs kafesi",
        wrongs: ["Omuz kemiği", "Bel omuru", "Karın boşluğu", "İskelet yapısı"]
    },
    {
        text: "ترتيب الأولويات",
        voweled: "تَرْتِيبُ الأَوْلَوِيَّاتِ",
        correct: "Önceliklerin sıralanması",
        wrongs: ["Zaman yönetimi", "Plan yapma", "Hedef belirleme", "İş bölümü"]
    },
    {
        text: "الوجهة الصحيحة",
        voweled: "الوِجْهَةُ الصَّحِيحَةُ",
        correct: "Doğru istikamet / yön",
        wrongs: ["Yanlış yol", "Gelecek planı", "Kariyer hedefi", "Doğru karar"]
    },
    {
        text: "الحضارة الإنسانية",
        voweled: "الحَضَارَةُ الإِنْسَانِيَّةُ",
        correct: "İnsanlık medeniyeti",
        wrongs: ["Eski çağlar", "Toplumsal kültür", "Tarihi eserler", "İnsani değerler"]
    },
    {
        text: "الدهون المشبعة",
        voweled: "الدُّهُونُ المُشْبَعَةُ",
        correct: "Doymuş yağlar",
        wrongs: ["Sağlıklı yağlar", "Bitkisel yağlar", "Kilo alımı", "Zararlı maddeler"]
    },
    {
        text: "اللحوم الحمراء",
        voweled: "اللُّحُومُ الحَمْرَاءُ",
        correct: "Kırmızı etler",
        wrongs: ["Beyaz etler", "Et ürünleri", "Deniz ürünleri", "Hayvansal gıdalar"]
    },
    {
        text: "العصر الحجري",
        voweled: "العَصْرُ الحَجَرِيُّ",
        correct: "Taş Devri",
        wrongs: ["Maden Devri", "İlk Çağ", "Tarih öncesi", "Antik dönem"]
    },
    {
        text: "ألياف النباتات",
        voweled: "أَلْيَافُ النَّبَاتَاتِ",
        correct: "Bitki lifleri",
        wrongs: ["Bitki kökleri", "Ağaç yaprakları", "Bitkisel ilaçlar", "Pamuk ipliği"]
    },
    {
        text: "فئة عمرية",
        voweled: "فِئَةٌ عُمْرِيَّةٌ",
        correct: "Yaş grubu",
        wrongs: ["Nüfus sayımı", "Genç nesil", "Yaşlılar grubu", "Sosyal sınıf"]
    },
    {
        text: "البحر الأبيض المتوسط",
        voweled: "البَحْرُ الأَبْيَضُ المُتَوَسِّطُ",
        correct: "Akdeniz",
        wrongs: ["Karadeniz", "Kızıldeniz", "Okyanus", "Ege Denizi"]
    },
    {
        text: "الاتحاد الأوروبي",
        voweled: "الاتِّحَادُ الأُورُوبِّيُّ",
        correct: "Avrupa Birliği",
        wrongs: ["Birleşmiş Milletler", "Avrupa Konseyi", "NATO", "Uluslararası Birlik"]
    },
    {
        text: "نظام الحكم",
        voweled: "نِظَامُ الحُكْمِ",
        correct: "Yönetim sistemi",
        wrongs: ["Devlet başkanı", "Anayasa", "Seçim sistemi", "Adalet sarayı"]
    },
    {
        text: "مسرح الدمى",
        voweled: "مَسْرَحُ الدُّمَى",
        correct: "Kukla tiyatrosu",
        wrongs: ["Gölge oyunu", "Çocuk tiyatrosu", "Oyuncak müzesi", "Sahne sanatları"]
    },
    {
        text: "الهواتف الذكية",
        voweled: "الهَوَاتِفُ الذَّكِيَّةُ",
        correct: "Akıllı telefonlar",
        wrongs: ["Cep telefonları", "Tablet bilgisayarlar", "Teknolojik aletler", "İletişim araçları"]
    },
    {
        text: "الألعاب الأولمبية",
        voweled: "الأَلْعَابُ الأُولِمْبِيَّةُ",
        correct: "Olimpiyat Oyunları",
        wrongs: ["Spor müsabakaları", "Dünya kupası", "Atletizm yarışları", "Gençlik oyunları"]
    },
    {
        text: "المنافسة الشريفة",
        voweled: "المُنَافَسَةُ الشَّرِيفَةُ",
        correct: "Adil rekabet / Şerefli yarış",
        wrongs: ["Haksız rekabet", "Ticari yarış", "Zorlu mücadele", "Spor ahlakı"]
    },
    {
        text: "أوقات الفراغ",
        voweled: "أَوْقَاتُ الفَرَاغِ",
        correct: "Boş vakitler",
        wrongs: ["Mesai saatleri", "Tatil günleri", "Eğlence zamanı", "Çalışma saatleri"]
    },
    {
        text: "التعليم الذاتي",
        voweled: "التَّعْلِيمُ الذَّاتِيُّ",
        correct: "Bireysel öğrenme / Öz öğrenim",
        wrongs: ["Uzaktan eğitim", "Örgün öğretim", "Özel ders", "Okul eğitimi"]
    },
    {
        text: "الوضع الراهن",
        voweled: "الوَضْعُ الرَّاهِنُ",
        correct: "Mevcut durum",
        wrongs: ["Gelecek planı", "Geçmiş tecrübe", "Zorlu koşullar", "Siyasi durum"]
    },
    {
        text: "قرية صغيرة",
        voweled: "قَرْيَةٌ صَغِيرَةٌ",
        correct: "Küçük köy",
        wrongs: ["Büyük şehir", "Kasaba", "Küresel dünya", "İletişim ağı"]
    },
    {
        text: "وزارة الخارجية",
        voweled: "وِزَارَةُ الخَارِجِيَّةِ",
        correct: "Dışişleri Bakanlığı",
        wrongs: ["İçişleri Bakanlığı", "Milli Eğitim Bakanlığı", "Sağlık Bakanlığı", "Adalet Bakanlığı"]
    },
    {
        text: "المهددة بالانقراض",
        voweled: "المُهَدَّدَةُ بِالانْقِرَاضِ",
        correct: "Nesli tükenme tehlikesi",
        wrongs: ["Koruma altındaki türler", "Vahşi yaşam", "Doğal seleksiyon", "Nadir bulunanlar"]
    },
    {
        text: "الصيد غير الشرعي",
        voweled: "الصَّيْدُ غَيْرُ الشَّرْعِيِّ",
        correct: "Kaçak / Yasadışı avlanma",
        wrongs: ["Balıkçılık", "Av sezonu", "Yasal avlanma", "Doğa sporları"]
    },
    {
        text: "البطارية القابلة للشحن",
        voweled: "البَطَّارِيَّةُ القَابِلَةُ لِلشَّحْنِ",
        correct: "Şarj edilebilir pil/batarya",
        wrongs: ["Bitik pil", "Elektrik kablosu", "Güç kaynağı", "Jeneratör"]
    },
    {
        text: "الطاقة الشمسية",
        voweled: "الطَّاقَةُ الشَّمْسِيَّةُ",
        correct: "Güneş enerjisi",
        wrongs: ["Rüzgar enerjisi", "Nükleer enerji", "Doğal gaz", "Yenilenebilir kaynaklar"]
    },
    {
        text: "صديقة للبيئة",
        voweled: "صَدِيقَةٌ لِلْبِيئَةِ",
        correct: "Çevre dostu",
        wrongs: ["Çevre kirliliği", "Doğa sever", "Organik ürün", "Geri dönüşüm"]
    },
    {
        text: "التلوث الضوضائي",
        voweled: "التَّلَوُّثُ الضَّوْضَائِيُّ",
        correct: "Gürültü kirliliği",
        wrongs: ["Hava kirliliği", "Su kirliliği", "Ses yalıtımı", "Çevre düzenlemesi"]
    },
    {
        text: "الوقود الأحفوري",
        voweled: "الوَقُودُ الأُحْفُورِيُّ",
        correct: "Fosil yakıtlar",
        wrongs: ["Biyoyakıt", "Petrol ürünleri", "Kömür madeni", "Enerji kaynakları"]
    },
    {
        text: "الذكاء الاصطناعي",
        voweled: "الذَّكَاءُ الاصْطِنَاعِيُّ",
        correct: "Yapay zeka",
        wrongs: ["Sanal gerçeklik", "Akıllı robotlar", "Bilgi işlem", "Teknolojik gelişme"]
    },
    {
        text: "حل المشكلات",
        voweled: "حَلُّ المُشْكِلَاتِ",
        correct: "Problem çözme",
        wrongs: ["Sorun çıkarma", "Matematik sorusu", "Karar verme", "Eleştirel düşünme"]
    },
    {
        text: "ما قبل التاريخ",
        voweled: "مَا قَبْلَ التَّارِيخِ",
        correct: "Tarih öncesi",
        wrongs: ["Yakın çağ", "Orta çağ", "Tarihi dönemler", "Modern zamanlar"]
    },
    {
        text: "الألوان الزيتية",
        voweled: "الأَلْوَانُ الزَّيْتِيَّةُ",
        correct: "Yağlı boyalar",
        wrongs: ["Sulu boya", "Kuru kalem", "Pastel boya", "Resim sanatı"]
    },
    {
        text: "المجموعة الشمسية",
        voweled: "المَجْمُوعَةُ الشَّمْسِيَّةُ",
        correct: "Güneş sistemi",
        wrongs: ["Samanyolu galaksisi", "Gezegenler topluluğu", "Uzay boşluğu", "Yıldız takımı"]
    },
    {
        text: "السلاحف البحرية",
        voweled: "السَّلَاحِفُ البَحْرِيَّةُ",
        correct: "Deniz kaplumbağaları",
        wrongs: ["Kara kaplumbağaları", "Su canlıları", "Deniz yıldızı", "Balık türleri"]
    },
    {
        text: "الحرف اليدوية",
        voweled: "الحِرَفُ اليَدَوِيَّةُ",
        correct: "El sanatları / El işleri",
        wrongs: ["Fabrika üretimi", "Sanayi ürünleri", "Makineleşme", "Mesleki eğitim"]
    },
    {
        text: "الاحتباس الحراري",
        voweled: "الاحْتِبَاسُ الحَرَارِيُّ",
        correct: "Küresel ısınma",
        wrongs: ["İklim değişikliği", "Hava sıcaklığı", "Ozon tabakası", "Kuraklık"]
    },
    {
        text: "مستوى المعيشة",
        voweled: "مُسْتَوَى المَعِيشَةِ",
        correct: "Yaşam standardı",
        wrongs: ["Gelir düzeyi", "Hayat pahalılığı", "Ekonomik durum", "Refah seviyesi"]
    },
    {
        text: "النهضة الإسلامية",
        voweled: "النَّهْضَةُ الإِسْلَامِيَّةُ",
        correct: "İslam rönesansı",
        wrongs: ["İslam tarihi", "Dini reform", "Kültürel değişim", "Arap edebiyatı"]
    },
    {
        text: "المرأة الحامل",
        voweled: "المَرْأَةُ الحَامِلُ",
        correct: "Hamile kadın",
        wrongs: ["Çocuklu anne", "Doğum uzmanı", "Bebek bakımı", "Sağlıklı kadın"]
    },
    {
        text: "مصدر دخل",
        voweled: "مَصْدَرُ دَخْلٍ",
        correct: "Gelir kaynağı",
        wrongs: ["Para harcama", "Maaş bordrosu", "Ekonomik kriz", "Bütçe planı"]
    }
];

    let currentQIndex = 0;
    let score = 0;
    let currentRoundQs = [];
    let timer;
    let isAnswered = false;
    const totalQuestionsPerRound = 10;

    function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

    function startGame() {
        score = 0;
        currentQIndex = 0;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('end-screen').classList.add('hidden');
        currentRoundQs = shuffle([...questionPool]).slice(0, totalQuestionsPerRound);
        updateScore();
        loadQ();
    }

    function loadQ() {
        isAnswered = false;
        
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');

        btnPrev.disabled = (currentQIndex === 0);
        
        // --- İLERİ TUŞU KİLİDİ ---
        // Son soruda veya cevap verilmediyse kilitli
        if (currentQIndex < currentRoundQs.length - 1) {
            btnNext.disabled = true; 
        } else {
            btnNext.disabled = true; // Son soru mantığı
        }
        
        if(currentQIndex >= currentRoundQs.length) {
            endGame();
            return;
        }

        const q = currentRoundQs[currentQIndex];
        const qEl = document.getElementById('q-text');
        
        document.getElementById('q-num').innerText = currentQIndex + 1;

        qEl.innerText = q.text;
        qEl.classList.remove('voweled-active');

        let wrongs = shuffle([...q.wrongs]).slice(0, 4);
        let opts = [{t: q.correct, ok: true}, ...wrongs.map(w=>({t:w, ok:false}))];
        shuffle(opts);

        const topGrid = document.getElementById('top-grid');
        const bottomContainer = document.getElementById('bottom-option-container');
        topGrid.innerHTML = "";
        bottomContainer.innerHTML = "";

        opts.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            
            const span = document.createElement('div');
            span.className = 'option-content';
            span.innerText = opt.t;
            btn.appendChild(span);
            
            btn.onclick = () => check(opt.ok, btn, opts, q);

            if (index < 4) {
                topGrid.appendChild(btn);
            } else {
                bottomContainer.appendChild(btn);
            }
        });

        startTimer(q.text);
    }

    function startTimer(text) {
        clearInterval(timer);
        const bar = document.getElementById('timer-bar');
        bar.style.transition = "none";
        bar.style.width = "100%";
        
        const wordCount = text.trim().split(/\s+/).length;
        let duration = Math.max(15, Math.min(30, wordCount * 5 + 10)); 
        
        setTimeout(() => {
            if(!isAnswered) {
                bar.style.transition = `width ${duration}s linear`;
                bar.style.width = "0%";
            }
        }, 50);

        let left = duration;
        timer = setInterval(() => {
            if(isAnswered) {
                clearInterval(timer);
                return;
            }
            left--;
            if(left < 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }

    function check(isCorrect, btn, allOpts, currentQData) {
        if(isAnswered) return;
        isAnswered = true;
        clearInterval(timer);
        
        document.getElementById('timer-bar').style.transition = "none";

        const qEl = document.getElementById('q-text');
        qEl.innerText = currentQData.voweled || currentQData.text;
        qEl.classList.add('voweled-active');

        // Şıklara tıklamayı kapat
        const allButtons = document.querySelectorAll('.option-btn');
        allButtons.forEach(b => b.style.pointerEvents = 'none');

        if(isCorrect) {
            btn.classList.add('correct');
            score += 10;
        } else {
            btn.classList.add('wrong');
            // --- YANLIŞ CEVAPTA DOĞRUYU GÖSTERME KODU ---
            allButtons.forEach(b => {
                // Metni kırpıp (trim) karşılaştırıyoruz ki boşluklardan etkilenmesin
                if (b.innerText.trim() === currentQData.correct.trim()) {
                     b.classList.add('correct');
                }
            });
        }
        updateScore();

        // Kilitli ileri tuşunu aç (son soru değilse)
        if (currentQIndex < currentRoundQs.length - 1) {
            document.getElementById('btn-next').disabled = false;
        } else {
            setTimeout(endGame, 2000);
        }
    }

    function handleTimeout() {
        isAnswered = true;
        const qData = currentRoundQs[currentQIndex];
        const qEl = document.getElementById('q-text');
        qEl.innerText = qData.voweled || qData.text;
        qEl.classList.add('voweled-active');

        const allButtons = document.querySelectorAll('.option-btn');
        allButtons.forEach(b => {
            b.style.pointerEvents = 'none';
            b.style.opacity = 0.5;
            // Süre dolunca da doğruyu gösterelim
            if (b.innerText.trim() === qData.correct.trim()) {
                 b.classList.add('correct');
                 b.style.opacity = 1;
            }
        });

        if (currentQIndex < currentRoundQs.length - 1) {
            document.getElementById('btn-next').disabled = false;
        } else {
            setTimeout(endGame, 2000);
        }
    }

    function navigate(direction) {
        const newIndex = currentQIndex + direction;
        if(newIndex >= 0 && newIndex < currentRoundQs.length) {
            currentQIndex = newIndex;
            loadQ();
        } else if (newIndex >= currentRoundQs.length) {
            endGame();
        }
    }

    function updateScore() {
        document.getElementById('score').innerText = score;
    }

    function endGame() {
        const screen = document.getElementById('end-screen');
        screen.classList.remove('hidden');
        document.getElementById('final-score').innerText = score;
    }