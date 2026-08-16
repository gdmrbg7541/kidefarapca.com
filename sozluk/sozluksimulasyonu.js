// --- Web Audio API Kurulumu ---
        let audioCtx;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
        }

        // GÜNCELLENDİ: Ses fonksiyonu (Async resume eklendi)
        async function playTone(frequency, duration, type = 'sine') {
            if (!audioCtx) return;
            
            // Eğer ses bağlamı askıdaysa (tarayıcı engeli), önce 'resume' et
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            // Sesi üretecek olan asıl fonksiyon
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01); 
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration); 

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        }
        
        // YENİ: Fisher-Yates Dizi Karıştırma Fonksiyonu
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // --- Ses Efektleri ---
        function playTouchSound() { playTone(1000, 0.05, 'triangle'); }
        function playCorrectSound() {
            playTone(523, 0.1, 'sine');
            setTimeout(() => playTone(659, 0.1, 'sine'), 100);
        }
        function playWrongSound() { playTone(164, 0.2, 'sawtooth'); }


        // --- GÜNCELLENDİ: OYUN VERİLERİ (DETAYLANDIRILDI VE DÜZELTİLDİ) ---
        
       // --- GÜNCELLENDİ: OYUN VERİLERİ (DETAYLANDIRILDI VE DÜZELTİLDİ) ---
const nextSentenceBtn = document.getElementById('next-sentence-btn');
/* let (const değil): sayfa ?sinif=N ile açıldığında oyunun verisi
   aşağıda O SINIFIN ders cümleleriyle değiştirilir (bkz. SINIF KİPİ). */
let gameData = [
            // --- SEVİYE 1 ---
            {
                level: 1,
                hint: `<h3>Seviye 1 İpuçları</h3>
                       <ul>
                           <li>Vurgulanan kelimenin sözlükte aranacak <strong>yalın halini</strong> (harekesiz) yazmanız gerekmektedir.</li>
                           <li>İsimlerin başındaki <code>ال</code> (Elif-Lâm) takısı atılır.</li>
                           <li>Bitişik zamirler (<code>ـهُ</code>, 
<code>ـي</code> vb.) atılır.</li>
                           <li>Örnek: <code>مَرْحَبًا</code> için 
<code>مرحبا</code> yazılır.</li>
                           <li>Örnek: <code>بِكَ</code> için <code>بك</code> 
yazılır.</li>
                       </ul>`,
                sentences: [
                    {
                        arabic: [
                            { text: "مَرْحَبًا", root: "مرحبا", category: "isim (mastar)" }, 
                            { text: "بِكَ", root: "بك", category: "harficer + bitişik zamir" },
                            { text: "يَا", root: "يا", category: "nida harfi" }, 
                            { text: "صَدِيقِي.", root: "صديق", category: "isim + bitişik zamir (mütekellim)" }
                        ],
                        turkish: [ "Merhaba", "sana", "(ey)", "arkadaşım" ],
                        turkishFull: "Merhaba arkadaşım."
                    },
                    {
                        arabic: [
                            { text: "هَذَا", root: "هذا", category: "işaret ismi" }, 
                            { text: "الْبَيْتُ", root: "بيت", category: "isim (ال takılı)" }, 
                            { text: "كَبِيرٌ.", root: "كبير", category: "isim (sıfat)" } 
                        ],
                        turkish: [ "Bu", "ev", "büyüktür" ],
                        turkishFull: "Bu ev büyüktür."
                    },
                    { 
                        arabic: [
                            { text: "مَا", root: "ما", category: "soru ismi" }, 
                            { text: "اسْمُكَ؟", root: "اسم", category: "isim + bitişik zamir (muhatap)" } 
                        ],
                        turkish: [ "Ne?", "senin adın" ],
                        turkishFull: "Senin adın ne?"
                    },
                    { 
                        arabic: [
                            { text: "أَيْنَ", root: "اين", category: "soru ismi" }, 
                            { text: "كِتَابُكَ؟", root: "كتاب", category: "isim + bitişik zamir" }
                        ],
                        turkish: [ "Nerede", "senin kitabın?" ],
                        turkishFull: "Kitabın nerede?"
                    },
                    {
                        arabic: [
                            { text: "هَذِهِ", root: "هذه", category: "işaret ismi" }, 
                            { text: "سَيَّارَتِي.", root: "سيارة", category: "isim + bitişik zamir" }
                        ],
                        turkish: [ "Bu", "benim arabam" ],
                        turkishFull: "Bu benim arabam."
                    },
                    {
                        arabic: [
                            { text: "قَلَمُهُ", root: "قلم", category: "isim + bitişik zamir" }, 
                            { text: "جَدِيدٌ.", root: "جديد", category: "isim (sıfat)" }
                        ],
                        turkish: [ "Onun kalemi", "yenidir" ],
                        turkishFull: "Onun kalemi yenidir."
                    },
                    {
                        arabic: [
                            { text: "الْبَابُ", root: "باب", category: "isim (ال takılı)" },
                            { text: "مَفْتُوحٌ.", root: "مفتوح", category: "isim (sıfat)" }
                        ],
                        turkish: [ "Kapı", "açıktır" ],
                        turkishFull: "Kapı açıktır."
                    },
                    {
                        arabic: [
                            { text: "الْكِتَابُ", root: "كتاب", category: "isim (ال takılı)" },
                            { text: "عَلَى", root: "على", category: "harficer" },
                            { text: "الطَّاوِلَةِ.", root: "طاولة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Kitap", "üstünde", "masanın" ],
                        turkishFull: "Kitap masanın üstünde."
                    },
                    {
                        arabic: [
                            { text: "هَذَا", root: "هذا", category: "işaret ismi" },
                            { text: "قَلَمٌ", root: "قلم", category: "isim" },
                            { text: "جَمِيلٌ.", root: "جميل", category: "isim (sıfat)" }
                        ],
                        turkish: [ "Bu", "kalem", "güzeldir" ],
                        turkishFull: "Bu güzel bir kalemdir."
                    },
                    {
                        arabic: [
                            { text: "الْبَيْتُ", root: "بيت", category: "isim (ال takılı)" },
                            { text: "نَظِيفٌ.", root: "نظيف", category: "isim (sıfat)" }
                        ],
                        turkish: [ "Ev", "temizdir" ],
                        turkishFull: "Ev temizdir."
                    }
                    // ... 10 more sentences ...
                ]
            },
            // --- SEVİYE 2 ---
            {
                level: 2,
                hint: `<h3>Seviye 2 İpuçları</h3>
                       <ul>
                           <li>Seviye 1'deki tüm kurallar (<code>ال</code> 
takısı, zamirler) burada da geçerlidir.</li>
                           <li><strong>İsimler/Sıfatlar için:</strong> 
Kelimenin <strong>yalın/tekil hali</strong> yazılır. (Örn: 
<code>الطَّالِبُ</code> -> <code>طالب</code>)</li>
                           <li><strong>Fiiller için:</strong> Sözlükte aramanın 
temeli olan <strong>Mazi (geçmiş zaman) tekil hali</strong> 
yazılır.</li>
                           <li>Örnek: <code>يَشْرَبُ</code> (içiyor) 
için <code>شرب</code> (içti) yazılır.</li>
                       </ul>`,
                sentences: [
                    {
                        arabic: [
                            { text: "كَتَبَ", root: "كتب", category: "fiil (mazi)" },
                            { text: "الطَّالِبُ", root: "طالب", category: "isim (ال takılı)" },
                            { text: "الدَّرْسَ.", root: "درس", category: "isim (ال takılı)" } 
                        ],
                        turkish: [ "Yazdı", "öğrenci", "dersi" ],
                        turkishFull: "Öğrenci dersi yazdı."
                    },
                    {
                        arabic: [
                            { text: "يَشْرَبُ", root: "شرب", category: "fiil (muzari)" }, 
                            { text: "الْوَلَدُ", root: "ولد", category: "isim (ال takılı)" }, 
                            { text: "الْحَلِيبَ.", root: "حليب", category: "isim (ال takılı)" }, 
                        ],
                        turkish: [ "İçiyor", "çocuk", "sütü" ],
                        turkishFull: "Çocuk süt içiyor."
                    },
                    { 
                        arabic: [
                            { text: "يَدْخُلُ", root: "دخل", category: "fiil (muzari)" }, 
                            { text: "الْمُعَلِّمُ", root: "معلم", category: "isim (ال takılı)" }, 
                            { text: "الْمَكْتَبَ.", root: "مكتب", category: "isim (ال takılı)" }, 
                        ],
                        turkish: [ "Giriyor", "öğretmen", "ofise" ],
                        turkishFull: "Öğretmen ofise giriyor."
                    },
                    { 
                        arabic: [
                            { text: "خَرَجَ", root: "خرج", category: "fiil (mazi)" }, 
                            { text: "الْمُدِيرُ", root: "مدير", category: "isim (ال takılı)" }, 
                            { text: "مِنَ", root: "من", category: "harficer" }, 
                            { text: "الْغُرْفَةِ.", root: "غرفة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Çıktı", "müdür", "-den", "odadan" ],
                        turkishFull: "Müdür odadan çıktı."
                    },
                    {
                        arabic: [
                            { text: "أَنَا", root: "SKIP", category: "zamir" }, 
                            { text: "أَفْهَمُ", root: "فهم", category: "fiil (muzari)" }, 
                            { text: "الدَّرْسَ.", root: "درس", category: "isim (ال takılı)" } 
                        ],
                        turkish: [ "Ben", "anlıyorum", "dersi" ],
                        turkishFull: "Ben dersi anlıyorum."
                    },
                    {
                        arabic: [
                            { text: "ذَهَبَتْ", root: "ذهب", category: "fiil (mazi)" }, 
                            { text: "الْبِنْتُ", root: "بنت", category: "isim (ال takılı)" }, 
                            { text: "إِلَى", root: "الى", category: "harficer" }, 
                            { text: "السُّوقِ.", root: "سوق", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Gitti", "kız", "-e", "çarşıya" ],
                        turkishFull: "Kız çarşıya gitti."
                    },
                    {
                        arabic: [
                            { text: "قَرَأَ", root: "قرأ", category: "fiil (mazi)" },
                            { text: "الطَّالِبُ", root: "طالب", category: "isim (ال takılı)" },
                            { text: "الْكِتَابَ.", root: "كتاب", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Okudu", "öğrenci", "kitabı" ],
                        turkishFull: "Öğrenci kitabı okudu."
                    },
                    {
                        arabic: [
                            { text: "فَتَحَ", root: "فتح", category: "fiil (mazi)" },
                            { text: "الْمُعَلِّمُ", root: "معلم", category: "isim (ال takılı)" },
                            { text: "الْبَابَ.", root: "باب", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Açtı", "öğretmen", "kapıyı" ],
                        turkishFull: "Öğretmen kapıyı açtı."
                    },
                    {
                        arabic: [
                            { text: "خَرَجَ", root: "خرج", category: "fiil (mazi)" },
                            { text: "الرَّجُلُ", root: "رجل", category: "isim (ال takılı)" },
                            { text: "مِنَ", root: "من", category: "harficer" },
                            { text: "الْبَيْتِ.", root: "بيت", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Çıktı", "adam", "-den", "evden" ],
                        turkishFull: "Adam evden çıktı."
                    },
                    {
                        arabic: [
                            { text: "يَكْتُبُ", root: "كتب", category: "fiil (muzari)" },
                            { text: "التِّلْمِيذُ", root: "تلميذ", category: "isim (ال takılı)" },
                            { text: "الدَّرْسَ.", root: "درس", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Yazıyor", "öğrenci", "dersi" ],
                        turkishFull: "Öğrenci dersi yazıyor."
                    }
                    // ... 10 more sentences ...
                ]
            },
            // --- SEVİYE 3 ---
            {
                level: 3,
                hint: `<h3>Seviye 3 İpuçları</h3>
                       <ul>
                           <li>Önceki seviyelerdeki tüm kurallar 
geçerlidir.</li>
                           <li>İsim ve fiillerin <strong>ikil (tesniye)</strong> 
ekleri (<code>ـَانِ</code>, <code>ـَيْنِ</code>) atılır ve kelimenin 
<strong>tekil hali</strong> yazılır.</li>
                           <li>Örnek: <code>الطَّالِبَانِ</code> -> 
<code>ال</code> atılır -> <code>طالب</code> yazılır.</li>
                           <li>Örnek: <code>عَلَى</code> için <code>على</code> 
yazılır.</li>
                       </ul>`,
                sentences: [
                    {
                        arabic: [
                            { text: "جَلَسَ", root: "جلس", category: "fiil (mazi)" },
                            { text: "الطَّالِبَانِ", root: "طالب", category: "isim (ikil)" },
                            { text: "عَلَى", root: "على", category: "harficer" }, 
                            { text: "الْكُرْسِيَّيْنِ.", root: "كرسي", category: "isim (ikil)" } 
                        ],
                        turkish: [ "Oturdu", "iki öğrenci", "üzerine", "iki sandalyeye" ],
                        turkishFull: "İki öğrenci iki sandalyeye oturdu."
                    },
                    {
                        arabic: [
                            { text: "فَتَحَ", root: "فتح", category: "fiil (mazi)" }, 
                            { text: "الْمُعَلِّمَانِ", root: "معلم", category: "isim (ikil)" },
                            { text: "كِتَابَيْنِ.", root: "كتاب", category: "isim (ikil)" } 
                        ],
                        turkish: [ "Açtı", "iki öğretmen", "iki kitap" ],
                        turkishFull: "İki öğretmen iki kitap açtı."
                    },
                    { 
                        arabic: [
                            { text: "الْمُهَنْدِسَانِ", root: "مهندس", category: "isim (ikil)" },
                            { text: "فِي", root: "في", category: "harficer" }, 
                            { text: "الْمَصْنَعِ.", root: "مصنع", category: "isim (ال takılı)" } 
                        ],
                        turkish: [ "İki mühendis", "içinde", "fabrika" ],
                        turkishFull: "İki mühendis fabrikadadır."
                    },
                    { 
                        arabic: [
                            { text: "لَعِبَ", root: "لعب", category: "fiil (mazi)" }, 
                            { text: "الطِّفْلَانِ", root: "طفل", category: "isim (ikil)" }, 
                            { text: "بِالْكُرَتَيْنِ.", root: "كرة", category: "harficer + isim (ikil)" }
                        ],
                        turkish: [ "Oynadı", "iki çocuk", "iki topla" ],
                        turkishFull: "İki çocuk iki topla oynadı."
                    },
                    {
                        arabic: [
                            { text: "هَاتَانِ", root: "هاتان", category: "işaret ismi" }, 
                            { text: "مَدْرَسَتَانِ", root: "مدرسة", category: "isim (ikil)" }, 
                            { text: "كَبِيرَتَانِ.", root: "كبير", category: "isim (ikil)" }
                        ],
                        turkish: [ "Bu ikisi", "okuldur", "büyüktür" ],
                        turkishFull: "Bu ikisi büyük okuldur."
                    },
                    {
                        arabic: [
                            { text: "اِشْتَرَى", root: "اشترى", category: "fiil (mazi form 8)" }, 
                            { text: "أَحْمَدُ", root: "SKIP", category: "isim (özel)" }, 
                            { text: "قَلَمَيْنِ.", root: "قلم", category: "isim (ikil)" }
                        ],
                        turkish: [ "Satın aldı", "Ahmet", "iki kalem" ],
                        turkishFull: "Ahmet iki kalem satın aldı."
                    },
                    {
                        arabic: [
                            { text: "كَتَبَ", root: "كتب", category: "fiil (mazi)" },
                            { text: "الطَّالِبَانِ", root: "طالب", category: "isim (ikil)" },
                            { text: "الدَّرْسَ.", root: "درس", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Yazdı", "iki öğrenci", "dersi" ],
                        turkishFull: "İki öğrenci dersi yazdı."
                    },
                    {
                        arabic: [
                            { text: "فَتَحَ", root: "فتح", category: "fiil (mazi)" },
                            { text: "الْوَلَدَانِ", root: "ولد", category: "isim (ikil)" },
                            { text: "الْبَابَيْنِ.", root: "باب", category: "isim (ikil)" }
                        ],
                        turkish: [ "Açtı", "iki çocuk", "iki kapıyı" ],
                        turkishFull: "İki çocuk iki kapıyı açtı."
                    },
                    {
                        arabic: [
                            { text: "هَذَانِ", root: "هذان", category: "işaret ismi" },
                            { text: "كِتَابَانِ", root: "كتاب", category: "isim (ikil)" },
                            { text: "جَدِيدَانِ.", root: "جديد", category: "isim (ikil)" }
                        ],
                        turkish: [ "Bu ikisi", "iki kitaptır", "yenidir" ],
                        turkishFull: "Bunlar iki yeni kitaptır."
                    }
                    // ... 11 more sentences ...
                ]
            },
            // --- SEVİYE 4 ---
            {
                level: 4,
                hint: `<h3>Seviye 4 İpuçları</h3>
                       <ul>
                           <li>Önceki tüm seviyelerin kuralları 
geçerlidir.</li>
                           <li>İsim ve fiillerin <strong>çoğul (cem'i)</strong> 
ekleri atılır ve kelimenin <strong>tekil hali</strong> yazılır.</li>
                           <li>Örnek: <code>الْمُجْتَهِدُونَ</code> -> 
<code>مجتهد</code></li>
                           <li>Örnek: <code>الطَّالِبَاتُ</code> -> 
<code>طالبة</code></li>
                           <li>Edatlar (<code>فِي</code>, <code>إِلَى</code>) 
olduğu gibi yazılır.</li>
                       </ul>`,
                sentences: [
                    {
                        arabic: [
                            { text: "يَلْعَبُ", root: "لعب", category: "fiil (muzari)" },
                            { text: "الْأَوْلَادُ", root: "ولد", category: "isim (kırık çoğul)", isIrregularPlural: true }, 
                            { text: "الْمُجْتَهِدُونَ", root: "مجتهد", category: "isim (eril çoğul)" }, 
                            { text: "فِي", root: "في", category: "harficer" }, 
                            { text: "سَاحَةِ", root: "ساحة", category: "isim (muzaf)" },
                            { text: "الْمَدْرَسَةِ.", root: "مدرسة", category: "isim (muzafun ileyh)" } 
                        ],
                        turkish: [ "Oynuyor", "çocuklar", "çalışkanlar", "içinde", "bahçesi", "okulun" ],
                        turkishFull: "Çalışkan çocuklar okulun bahçesinde oynuyor."
                    },
                     {
                        arabic: [
                            { text: "تَذْهَبُ", root: "ذهب", category: "fiil (muzari)" },
                            { text: "الطَّالِبَاتُ", root: "طالبة", category: "isim (dişil çoğul)" },
                            { text: "إِلَى", root: "الى", category: "harficer" }, 
                            { text: "مَكَاتِبِهِنَّ.", root: "مكتب", category: "isim + bitişik zamir (cemi müennes)" } 
                        ],
                        turkish: [ "Gidiyor", "kız öğrenciler", "doğru", "onların ofislerine" ],
                        turkishFull: "Kız öğrenciler ofislerine gidiyor."
                    },
                    { 
                        arabic: [
                            { text: "الْمُهَنْدِسُونَ", root: "مهندس", category: "isim (eril çoğul)" }, 
                            { text: "يَعْمَلُونَ", root: "عمل", category: "fiil (muzari cemi)" }, 
                            { text: "بِجِدٍّ.", root: "جد", category: "harficer + isim" }
                        ],
                        turkish: [ "Mühendisler", "çalışıyorlar", "ciddiyetle" ],
                        turkishFull: "Mühendisler ciddiyetle çalışıyor."
                    },
                    {
                        arabic: [
                            { text: "الْمُعَلِّمَاتُ", root: "معلمة", category: "isim (dişil çoğul)" }, 
                            { text: "فِي", root: "في", category: "harficer" }, 
                            { text: "الْفَصْلِ.", root: "فصل", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Öğretmenler (bayan)", "içinde", "sınıfın" ],
                        turkishFull: "Bayan öğretmenler sınıftadır."
                    },
                    {
                        arabic: [
                            { text: "هَؤُلَاءِ", root: "هؤلاء", category: "işaret ismi" }, 
                            { text: "عُمَّالٌ", root: "عامل", category: "isim (kırık çoğul)", isIrregularPlural: true }, 
                            { text: "نَشِيطُونَ.", root: "نشيط", category: "isim (eril çoğul)" }
                        ],
                        turkish: [ "Bunlar", "işçilerdir", "çalışkandırlar" ],
                        turkishFull: "Bunlar çalışkan işçilerdir."
                    },
                    { 
                        arabic: [
                            { text: "يَرْكَبُ", root: "ركب", category: "fiil (muzari)" }, 
                            { text: "الْمُسَافِرُونَ", root: "مسافر", category: "isim (eril çoğul)" }, 
                            { text: "الْقِطَارَ.", root: "قطار", category: "isim (ال takılı)" } 
                        ],
                        turkish: [ "Biniyor", "yolcular", "trene" ],
                        turkishFull: "Yolcular trene biniyor."
                    },
                    {
                        arabic: [
                            { text: "يَكْتُبُ", root: "كتب", category: "fiil (muzari)" },
                            { text: "الطُّلَّابُ", root: "طالب", category: "isim (kırık çoğul)", isIrregularPlural: true },
                            { text: "الدُّرُوسَ.", root: "درس", category: "isim (kırık çoğul)", isIrregularPlural: true }
                        ],
                        turkish: [ "Yazıyor", "öğrenciler", "dersleri" ],
                        turkishFull: "Öğrenciler dersleri yazıyor."
                    },
                    {
                        arabic: [
                            { text: "الْمُعَلِّمُونَ", root: "معلم", category: "isim (eril çoğul)" },
                            { text: "فِي", root: "في", category: "harficer" },
                            { text: "الْمَدْرَسَةِ.", root: "مدرسة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Öğretmenler", "içinde", "okulun" ],
                        turkishFull: "Öğretmenler okuldadır."
                    },
                    {
                        arabic: [
                            { text: "يَعْمَلُ", root: "عمل", category: "fiil (muzari)" },
                            { text: "الْعُمَّالُ", root: "عامل", category: "isim (kırık çoğul)", isIrregularPlural: true },
                            { text: "فِي", root: "في", category: "harficer" },
                            { text: "الْمَصْنَعِ.", root: "مصنع", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Çalışıyor", "işçiler", "içinde", "fabrikada" ],
                        turkishFull: "İşçiler fabrikada çalışıyor."
                    }
                    // ... 11 more sentences ...
                ]
            },
            // --- YENİ: SEVİYE 5 ---
            {
                level: 5,
                hint: `<h3>Seviye 5 İpuçları</h3>
                       <ul>
                           <li>Bu seviyede 'Ecvef' (ortası illetli), 'Misal' (başı illetli), 'Nakıs' (sonu illetli), 'Mudaaf' (şeddeli) ve 'Mehmuz' (hemzeli) fiiller bulunmaktadır.</li>
                           <li>Fiilin <strong>3 harfli Mazi (geçmiş zaman) kökünü</strong> bulmalısınız.</li>
                           <li>Örnek: <code>يَقُومُ</code> (kalkıyor) için <code>قام</code> (kalktı) yazılır.</li>
                           <li>Örnek: <code>يَجِبُ</code> (gerekir) için <code>وجب</code> (gerekti) yazılır.</li>
                           <li>Örnek: <code>يَدْعُو</code> (dua ediyor) için <code>دعا</code> (dua etti) yazılır.</li>
                           <li>Örnek: <code>يَرْمِي</code> (atıyor) için <code>رمى</code> (attı) yazılır.</li>
                           <li>Örnek: <code>آخُذُ</code> (alıyorum) için <code>اخذ</code> (aldı) yazılır.</li>
                           <li>Örnek: <code>مَدَدْتُ</code> (uzattım) için <code>مد</code> (uzattı) yazılır.</li>
                       </ul>`,
                sentences: [
                    {
                        arabic: [
                            { text: "يَقُومُ", root: "قام", category: "fiil (muzari ecvef)" },
                            { text: "الرَّجُلُ", root: "رجل", category: "isim (ال takılı)" },
                            { text: "مِنْ", root: "من", category: "harficer" },
                            { text: "نَوْمِهِ.", root: "نوم", category: "isim + bitişik zamir" }
                        ],
                        turkish: [ "Kalkıyor", "adam", "-den", "uykusundan" ],
                        turkishFull: "Adam uykusundan kalkıyor."
                    },
                    {
                        arabic: [
                            { text: "يَجِبُ", root: "وجب", category: "fiil (muzari misal)" },
                            { text: "عَلَيْكَ", root: "عليك", category: "harficer + bitişik zamir" },
                            { text: "أَنْ", root: "SKIP", category: "nasb harfi" }, 
                            { text: "تَقُولَ", root: "قال", category: "fiil (muzari ecvef)" },
                            { text: "الْحَقَّ.", root: "حق", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Gerekir", "sana", "...", "söylemen", "gerçeği" ],
                        turkishFull: "Gerçeği söylemen gerekir."
                    },
                    {
                        arabic: [
                            { text: "يَدْعُو", root: "دعا", category: "fiil (muzari nakıs)" }, 
                            { text: "الْمُؤْمِنُ", root: "مؤمن", category: "isim (ال takılı)" }, 
                            { text: "رَبَّهُ.", root: "رب", category: "isim + bitişik zamir" }
                        ],
                        turkish: [ "Dua ediyor", "mümin", "Rabbine" ],
                        turkishFull: "Mümin Rabbine dua ediyor."
                    },
                    {
                        arabic: [
                            { text: "يَرْمِي", root: "رمى", category: "fiil (muzari nakıs)" }, 
                            { text: "اللَّاعِبُ", root: "لاعب", category: "isim (ال takılı)" }, 
                            { text: "الْكُرَةَ.", root: "كرة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Atıyor", "oyuncu", "topu" ],
                        turkishFull: "Oyuncu topu atıyor."
                    },
                    {
                        arabic: [
                            { text: "آخُذُ", root: "اخذ", category: "fiil (muzari mehmuz)" }, 
                            { text: "الْكِتَابَ", root: "كتاب", category: "isim (ال takılı)" }, 
                            { text: "مِنَ", root: "من", category: "harficer" }, 
                            { text: "الْمَكْتَبَةِ.", root: "مكتبة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Alıyorum", "kitabı", "-den", "kütüphaneden" ],
                        turkishFull: "Kitabı kütüphaneden alıyorum."
                    },
                    {
                        arabic: [
                            { text: "مَدَدْتُ", root: "مد", category: "fiil (mazi mudaaf + zamir)" }, 
                            { text: "يَدِي", root: "يد", category: "isim + bitişik zamir" }, 
                            { text: "إِلَيْكَ.", root: "اليك", category: "harficer + bitişik zamir" }
                        ],
                        turkish: [ "Uzattım", "elimi", "sana" ],
                        turkishFull: "Sana elimi uzattım."
                    },
                    {
                        arabic: [
                            { text: "قُلْتُ", root: "قال", category: "fiil (mazi ecvef + zamir)" },
                            { text: "الْحَقَّ.", root: "حق", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Dedim", "gerçeği" ],
                        turkishFull: "Gerçeği dedim."
                    },
                    {
                        arabic: [
                            { text: "وَجَدْتُ", root: "وجد", category: "fiil (mazi misal + zamir)" },
                            { text: "مِفْتَاحِي.", root: "مفتاح", category: "isim + bitişik zamir" }
                        ],
                        turkish: [ "Buldum", "anahtarımı" ],
                        turkishFull: "Anahtarımı buldum."
                    },
                    {
                        arabic: [
                            { text: "اللهُ", root: "SKIP", category: "isim (özel)" },
                            { text: "يَهِبُ", root: "وهب", category: "fiil (muzari misal)" },
                            { text: "الرِّزْقَ.", root: "رزق", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Allah", "verir", "rızkı" ],
                        turkishFull: "Allah rızkı verir."
                    },
                    {
                        arabic: [
                            { text: "الْمُسْلِمُ", root: "مسلم", category: "isim (ال takılı)" },
                            { text: "يَفِي", root: "وفى", category: "fiil (muzari lefifi mefruk)" },
                            { text: "بِالْوَعْدِ.", root: "وعد", category: "harficer + isim" }
                        ],
                        turkish: [ "Müslüman", "yerine getirir", "sözünü" ],
                        turkishFull: "Müslüman sözünü yerine getirir."
                    },
                    {
                        arabic: [
                            { text: "قُمْتُ", root: "قام", category: "fiil (mazi ecvef + zamir)" },
                            { text: "مُبَكِّرًا.", root: "بكر", category: "zarf" }
                        ],
                        turkish: [ "Kalktım", "erkenden" ],
                        turkishFull: "Erkenden kalktım."
                    },
                    {
                        arabic: [
                            { text: "يَبِيعُ", root: "باع", category: "fiil (muzari ecvef)" },
                            { text: "التَّاجِرُ", root: "تاجر", category: "isim (ال takılı)" },
                            { text: "الْبِضَاعَةَ.", root: "بضاعة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Satıyor", "tüccar", "malı" ],
                        turkishFull: "Tüccar malı satıyor."
                    },
                    {
                        arabic: [
                            { text: "وَصَلَ", root: "وصل", category: "fiil (mazi misal)" },
                            { text: "الضَّيْفُ", root: "ضيف", category: "isim (ال takılı)" },
                            { text: "مُبَكِّرًا.", root: "بكر", category: "zarf" }
                        ],
                        turkish: [ "Vardı", "misafir", "erkenden" ],
                        turkishFull: "Misafir erkenden vardı."
                    },
                    {
                        arabic: [
                            { text: "يَمْشِي", root: "مشى", category: "fiil (muzari nakıs)" },
                            { text: "الرَّجُلُ", root: "رجل", category: "isim (ال takılı)" },
                            { text: "فِي", root: "في", category: "harficer" },
                            { text: "الْحَدِيقَةِ.", root: "حديقة", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "Yürüyor", "adam", "içinde", "bahçede" ],
                        turkishFull: "Adam bahçede yürüyor."
                    },
                    {
                        arabic: [
                            { text: "رَدَدْتُ", root: "رد", category: "fiil (mazi mudaaf + zamir)" },
                            { text: "السَّلَامَ.", root: "سلام", category: "isim (ال takılı)" }
                        ],
                        turkish: [ "İade ettim", "selamı" ],
                        turkishFull: "Selamı iade ettim."
                    }
                    // ... 5 more sentences ...
                ]
            }
        ];

        /* =====================================================================
           SINIF KİPİ — ?sinif=5|7|9|10
           ---------------------------------------------------------------------
           Kart (sistem/sinifmodul.js) sayfayı sınıf numarasıyla açar; HTML
           o sınıfın veri dosyasını ana betikten önce yüklemiştir. Burada
           yalnızca oyunun verisi devralınır ve şerit o sınıfın seviye
           SAYISINA göre kısaltılır — sınıfta karşılığı olmayan seviye
           düğmesi ekranda durmasın.
           Genel oyun (parametresiz açılış) hiç değişmez.
           ===================================================================== */
        const SINIF_KIP = (function () {
            try {
                const s = (new URLSearchParams(location.search).get('sinif') || '').trim();
                const v = window.SOZLUK_SINIF && window.SOZLUK_SINIF[s];
                if (!v || !Array.isArray(v.seviyeler) || !v.seviyeler.length) return null;
                gameData = v.seviyeler;
                return { sinif: s, cumle: v.cumle, kelime: v.kelime, seviye: v.seviyeler.length };
            } catch (e) { return null; }
        })();

        // --- DOM ELEMENTLERİ ---
        const levelSelector = document.querySelector('.level-selector');
        const levelButtons = document.querySelectorAll('.level-btn');
        const hintBtn = document.getElementById('hint-btn');
        const jokerBtn = document.getElementById('joker-btn'); // YENİ
        const headerButtons = document.querySelector('.header-buttons'); // YENİ
        const backBtn = document.getElementById('back-btn'); // TEK geri tuşu (her durumda görünür)
        const contentWrapperHr = document.querySelector('.content-wrapper > hr');
        const mainContentArea = document.getElementById('main-content-area'); 
        
        const hintModal = document.getElementById('hint-modal');
        const hintModalCloseBtn = document.getElementById('hint-modal-close');
        const modalBody = document.getElementById('modal-body');
        
        const errorModal = document.getElementById('error-modal'); 
        const errorModalBody = document.getElementById('error-modal-body'); 
        const errorModalCloseBtn = document.getElementById('error-modal-close'); 

        const gameContainer = document.querySelector('.game-container'); 
        const sentenceDisplayArea = document.getElementById('sentence-display-area'); 
        const cumleSatir = document.getElementById('cumle-satir');
        const okOnceki = document.getElementById('ok-onceki');
        const okSonraki = document.getElementById('ok-sonraki');
        const inputArea = document.getElementById('input-area'); 
        const inputWrapper = document.getElementById('input-wrapper'); 
        const submitBtn = document.getElementById('submit-btn'); 
        const userInputEl = document.getElementById('user-input');
        const keyboardEl = document.getElementById('keyboard');
        
        const startPrompt = document.getElementById('start-prompt'); 
        const startBtn = document.getElementById('start-btn'); 
        const startRulesContainer = document.getElementById('start-rules-container'); 

        const promptContainer = document.getElementById('prompt-container'); 
        const fullTurkishContainerStatic = document.getElementById('full-turkish-container-static'); 
        const guessPrompt = document.getElementById('guess-prompt'); 
        const guessPromptBtn = document.getElementById('guess-prompt-btn'); 
        
        let nextButton; 
        let specialKeysRow; 
        let letterRows = []; 

        // --- OYUN DEĞİŞKENLERİ ---
        let currentLevelIndex = 0;
        let currentSentenceIndex = 0;
        let currentWordIndex = 0; // DÜZELTİLDİ: eskiden örtük global idi (window'a sızıyordu)
        let currentSentenceData;
        let jokerCount = 3; // YENİ

        // --- GÜNCELLENDİ: HAREKE VE HEMZE TEMİZLEME FONKSİYONU ---
        function normalizeForCompare(str) {
            if (!str) return str;
            return str
                .replace(/[\u064B-\u0652]/g, '') // 1. Harekeleri (şedde dahil) kaldır
                .replace(/[إأآ]/g, 'ا')         // 2. TİTİZLEŞTİRİLDİ: yalnız Elif tabanlı hemze (أ إ آ) -> ا; ء ؤ ئ kendileri kalır (Seviye 5'te 'مؤمن' yerine 'مامن' gibi gevşek kabuller önlenir)
                .replace(/ى/g, 'ي')           // 3. Elif Maksura -> Ye
                .replace(/\./g, '');          // 4. Noktaları kaldır
        }
        
        // --- YENİ: Klavye için Renk ve Gölge Yardımcısı ---
        function getDarkerColor(hex) { 
            if(!hex || hex.length < 4) return '#aaaaaa'; 
            if(hex.length === 4) hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3]; 
            let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16); 
            r=Math.max(0,Math.floor(r*0.85)); g=Math.max(0,Math.floor(g*0.85)); b=Math.max(0,Math.floor(b*0.85)); 
            return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`; 
        }

        // --- GÜNCELLENDİ: KLAVYE OLUŞTURMA ---
        function createKeyboard() {
            // GÜNCELLENDİ: Hatalı prepend mantığı kaldırıldı
            
            // Klavye tuşları zaten varsa oluşturmayı atla
            if(letterRows.length > 0) return;

            const colorMap={'ب':'#a0c4ff','ت':'#a0c4ff','ث':'#a0c4ff','ن':'#a0c4ff','ي':'#a0c4ff','ج':'#caffbf','ح':'#caffbf','خ':'#caffbf','د':'#fdffb6','ذ':'#fdffb6','ر':'#ffd6a5','ز':'#ffd6a5','s':'#ffadad','ش':'#ffadad','ص':'#bdb2ff','ض':'#bdb2ff','ط':'#9bf6ff','ظ':'#9bf6ff','ع':'#ffc6ff','غ':'#ffc6ff','ف':'#b9f6ca','ق':'#b9f6ca','ه':'#b3e5fc','ة':'#b3e5fc','ء':'#ffccbc','ؤ':'#ffccbc','ئ':'#ffccbc','ا':'#e0e0e0','ل':'#e0e0e0','ك':'#d1c4e9','م':'#f8bbd0','و':'#c5cae9'};
            const defaultColor='#FFFFFF';
            const backspaceBg = '#E53935'; 
            const backspaceShadow = getDarkerColor(backspaceBg);

            const keyRows = [
                ["د","ج","ح","خ","ه","ع","غ","ف","ق","ث","ص","ض"],
                ["ط","ك","م","ن","ت","ا","ل","ب","ي","س","ش","ذ"],
                ["Backspace", "ظ","ز","و","ة","ى","ر","ؤ","ء","ئ"] 
            ];
            const specialKeys = []; 
            
            letterRows = []; 
            keyRows.forEach(row => {
                const rowEl = document.createElement('div');
                rowEl.className = 'keyboard-row letter-row'; 
                row.forEach(key => {
                    const keyBtn = document.createElement('button');
                    keyBtn.setAttribute('type', 'button');
                    
                    let bgColor = defaultColor;
                    let shadowColor = getDarkerColor(bgColor);

                    if (key === 'Backspace') {
                        keyBtn.innerHTML = '&#9003;'; 
                        keyBtn.classList.add('key-backspace');
                        keyBtn.dataset.key = 'Backspace';
                        bgColor = backspaceBg;
                        shadowColor = backspaceShadow;
                        keyBtn.style.lineHeight = '1';  /* GUNCELLENDI: daire icinde flex ortalama */ 
                        keyBtn.style.color = 'white'; 
                    } else {
                        keyBtn.textContent = key;
                        keyBtn.dataset.key = key;
                        bgColor = colorMap[key] || defaultColor;
                        shadowColor = getDarkerColor(bgColor);
                    }
                    
                    keyBtn.style.backgroundColor = bgColor;
                    keyBtn.style.boxShadow = `0 0.4vmin ${shadowColor}`;
                    
                    // 3D basma efekti
                    keyBtn.onmousedown = (e) => { e.preventDefault(); keyBtn.style.transform = 'translateY(0.2vmin)'; keyBtn.style.boxShadow = `0 0.2vmin ${shadowColor}`; };
                    keyBtn.onmouseup = () => { keyBtn.style.transform = ''; keyBtn.style.boxShadow = `0 0.4vmin ${shadowColor}`; };
                    keyBtn.onmouseleave = () => { keyBtn.style.transform = ''; keyBtn.style.boxShadow = `0 0.4vmin ${shadowColor}`; };
                    keyBtn.ontouchstart = (e) => { e.preventDefault(); keyBtn.onmousedown(e); handleKeyboardInput(keyBtn.dataset.key); }; // Dokunmatik için anında tetikle
                    keyBtn.ontouchend = (e) => { e.preventDefault(); keyBtn.onmouseup(e); };
                    keyBtn.onclick = () => handleKeyboardInput(keyBtn.dataset.key); 

                    rowEl.appendChild(keyBtn);
                });
                keyboardEl.appendChild(rowEl);
                letterRows.push(rowEl); 
            });

            specialKeysRow = document.createElement('div'); 
            specialKeysRow.className = 'keyboard-row special-keys-row'; 
            specialKeys.forEach(key => {
                const keyBtn = document.createElement('button');
                keyBtn.setAttribute('type', 'button');
                const shadowColor = getDarkerColor('#d6eaff');

                if (key === '»') { 
                    keyBtn.innerHTML = '&raquo;'; 
                    keyBtn.classList.add('key-next'); 
                    keyBtn.dataset.key = '»';
                    keyBtn.style.boxShadow = `0 0.4vmin ${shadowColor}`;
                    keyBtn.style.lineHeight = '1';  /* GUNCELLENDI: daire icinde flex ortalama */ 
                    keyBtn.onmousedown = (e) => { e.preventDefault(); keyBtn.style.transform = 'translateY(0.2vmin)'; keyBtn.style.boxShadow = `0 0.2vmin ${shadowColor}`; };
                    keyBtn.onmouseup = () => { keyBtn.style.transform = ''; keyBtn.style.boxShadow = `0 0.4vmin ${shadowColor}`; };
                    keyBtn.onmouseleave = () => { keyBtn.style.transform = ''; keyBtn.style.boxShadow = `0 0.4vmin ${shadowColor}`; };
                    keyBtn.ontouchstart = (e) => { e.preventDefault(); keyBtn.onmousedown(e); handleKeyboardInput(keyBtn.dataset.key); };
                    keyBtn.ontouchend = (e) => { e.preventDefault(); keyBtn.onmouseup(e); };
                    keyBtn.onclick = () => handleKeyboardInput(keyBtn.dataset.key); 

                    nextButton = keyBtn; 
                }
                specialKeysRow.appendChild(keyBtn);
            });
            keyboardEl.appendChild(specialKeysRow);
        }
        
        /* ================================================================
           CÜMLELER ARASI GEZİNME  (cümle kutusunun iki yanındaki oklar)
           ----------------------------------------------------------------
           Geylani: "cümleler arasında gezilebilsin". Sol ok bir önceki,
           sağ ok bir sonraki cümleyi açar. Seviyenin ilk/son cümlesinde
           ilgili ok söner. Seviye bitirme akışı ("Devam Et" / » tuşu)
           olduğu gibi kalır; oklar yalnız gezinir, seviye bitirmez.
           ================================================================ */

        /* Cümle kutusu ile okları TEK yerden açıp kapatır: eskiden yalnız
           kutunun display'i değişiyordu, oklar boş ekranda kalırdı. */
        function cumleAlaniGoster(ac) {
            sentenceDisplayArea.style.display = ac ? 'flex' : 'none';
            if (cumleSatir) cumleSatir.style.display = ac ? 'flex' : 'none';
        }

        function oklariTazele() {
            if (!okOnceki || !okSonraki) return;
            var kume = gameData[currentLevelIndex];
            var n = (kume && kume.sentences) ? kume.sentences.length : 0;
            okOnceki.disabled = !n || currentSentenceIndex <= 0;
            okSonraki.disabled = !n || currentSentenceIndex >= n - 1;
            okOnceki.title = okOnceki.disabled ? 'Bu seviyenin ilk cümlesi' : 'Önceki cümle';
            okSonraki.title = okSonraki.disabled ? 'Bu seviyenin son cümlesi' : 'Sonraki cümle';
        }

        function cumleyeGit(yon) {
            var kume = gameData[currentLevelIndex];
            if (!kume || !kume.sentences) return;
            var hedef = currentSentenceIndex + yon;
            if (hedef < 0 || hedef >= kume.sentences.length) return;
            playTouchSound();
            currentSentenceIndex = hedef;
            loadSentence(currentSentenceIndex);
        }

        if (okOnceki) okOnceki.addEventListener('click', function () { cumleyeGit(-1); });
        if (okSonraki) okSonraki.addEventListener('click', function () { cumleyeGit(1); });

        /* Tahtada anlatırken kumanda/klavye oku da işe yarasın. Metin
           kutusu readonly olduğu için ok tuşları başka bir işi bozmaz;
           yine de bir pencere (ipucu/hata) açıkken devreye girmez. */
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            if (!cumleSatir || cumleSatir.style.display === 'none') return;
            var acikPencere = [].some.call(document.querySelectorAll('.modal'), function (m) {
                return getComputedStyle(m).display !== 'none';
            });
            if (acikPencere) return;
            e.preventDefault();
            cumleyeGit(e.key === 'ArrowLeft' ? -1 : 1);
        });

        // --- Sonraki Cümleye Geçme Fonksiyonu ---
        function forceNextSentence() {
            // GÜNCELLENDİ: Seviye sonu mantığı eklendi
            if (currentSentenceIndex < gameData[currentLevelIndex].sentences.length - 1) {
                currentSentenceIndex++;
                loadSentence(currentSentenceIndex);
            } else {
                // Seviyenin son cümlesi bitti
                handleLevelComplete();
            }
        }
        
        // YENİ: Seviye tamamlama fonksiyonu
        function handleLevelComplete() {
            setKeyboardState('level_complete');
            
            const currentLevelBtn = levelButtons[currentLevelIndex];
            currentLevelBtn.classList.remove('active');

            let nextLevelIndex;
            if (currentLevelIndex < gameData.length - 1) {
                nextLevelIndex = currentLevelIndex + 1;
            } else {
                nextLevelIndex = 0; // Son seviye bitti, başa dön
            }
            
            const nextLevelBtn = levelButtons[nextLevelIndex];
            nextLevelBtn.classList.add('active'); // Yeni seviyeyi 'aktif' olarak ayarla
            nextLevelBtn.style.animation = 'pulse-blue 1.5s infinite'; // Vurgula
            
            // GÜNCELLENDİ: Seviye bitti mesajı LTR oldu
            sentenceDisplayArea.innerHTML = `<div style='direction: ltr; text-align: center; width: 100%;'><h2 style='font-family: Marhey, sans-serif;'>Seviye ${currentLevelIndex + 1} bitti!</h2><p style='font-family: Marhey, sans-serif;'>Lütfen sonraki seviyeyi seçin.</p></div>`;
        }


        // --- KLAVYE GİRİŞ İŞLEMCİSİ ---
        function handleKeyboardInput(key) {
            playTouchSound(); 

            if (key === 'Backspace') {
                userInputEl.value = userInputEl.value.slice(0, -1);
            } else if (key === '»') { 
                forceNextSentence();
            } 
            else {
                userInputEl.value += key;
            }
            
            checkInputRealtime(); // YENİ: Her tuş vuruşundan sonra onayı kontrol et
        }
        
        // YENİ: Onay butonunu gerçek zamanlı kontrol et
        function checkInputRealtime() {
            const activeWord = sentenceDisplayArea.querySelector('.arabic-word.active');
            if (!activeWord) return;

            const expectedRoot = activeWord.dataset.root;
            const isIrregular = activeWord.dataset.isIrregular === 'true';
            const originalText = activeWord.textContent;
            const userAnswer = userInputEl.value;

            const normalizedExpected = normalizeForCompare(expectedRoot);
            const normalizedUser = normalizeForCompare(userAnswer);
            
            // For irregular plurals, allow matching the original bare word
            const normalizedBareWord = normalizeForCompare(originalText.replace(/^ال/, '')); 

            if (normalizedUser === normalizedExpected || (isIrregular && normalizedUser === normalizedBareWord)) {
                submitBtn.classList.add('ready');
            } else {
                submitBtn.classList.remove('ready');
            }
        }


        // --- SEVİYE YÜKLEME ---
        function loadLevel(levelIndex) {
            currentLevelIndex = levelIndex;
            currentSentenceIndex = 0;
            jokerCount = 3; // YENİ: Jokerleri sıfırla
            jokerBtn.textContent = `Joker (${jokerCount})`; // YENİ: Joker metnini güncelle
            jokerBtn.disabled = false; // YENİ: Joker butonunu etkinleştir
            
            // GÜNCELLENDİ: levelButtons dizisinin uzunluğunu kontrol et
            levelButtons.forEach((btn, index) => {
                btn.classList.toggle('active', index === levelIndex);
                btn.style.animation = ''; // Vurgu animasyonunu kaldır
            });
            
            modalBody.innerHTML = gameData[levelIndex].hint;
            
            // Gizlenmiş olabilecek alanları göster
            inputArea.style.display = 'flex';
            cumleAlaniGoster(true);
            
            // YENİ: Cümleleri yüklemeden önce karıştır
            shuffleArray(gameData[currentLevelIndex].sentences); 

            loadSentence(currentSentenceIndex); // Bu, setKeyboardState('typing')'i çağıracak
        }

        // --- Klavye Durumunu Yönetme ---
        function setKeyboardState(state) {
            const letterRows = keyboardEl.querySelectorAll('.letter-row');
            
            // Önce her şeyi gizle (başlangıç durumu için)
            levelSelector.style.display = 'none';
            contentWrapperHr.style.display = 'none';
            cumleAlaniGoster(false);
            inputArea.style.display = 'none';
            startPrompt.style.display = 'none';
            promptContainer.style.display = 'none'; // YENİ
            inputWrapper.style.display = 'none';
            guessPrompt.style.display = 'none';
            fullTurkishContainerStatic.style.display = 'none'; // YENİ
            keyboardEl.style.display = 'none';
            if (specialKeysRow) specialKeysRow.style.display = 'none';
            mainContentArea.classList.remove('start-mode'); // YENİ
            headerButtons.style.display = 'none'; // YENİ: Başlık butonlarını gizle
            
            if (state === 'start') {
                headerButtons.style.display = 'flex'; // GÜNCELLENDİ: Göster
                jokerBtn.style.display = 'none'; // GÜNCELLENDİ: Gizle
                hintBtn.style.display = 'none'; // GÜNCELLENDİ: Gizle

                inputArea.style.display = 'flex';
                startPrompt.style.display = 'flex';
                // mainContentArea.classList.add('start-mode'); // GÜNCELLENDİ: Kaldırıldı
                // GÜNCELLENDİ: Tüm seviyelerin ipuçlarını yükle
                let allHints = "";
                gameData.forEach(levelData => {
                    allHints += levelData.hint;
                });
                startRulesContainer.innerHTML = allHints; 
            }
            else if (state === 'typing') {
                levelSelector.style.display = 'flex';
                contentWrapperHr.style.display = 'block';
                cumleAlaniGoster(true);
                inputArea.style.display = 'flex';
                inputWrapper.style.display = 'flex';
                keyboardEl.style.display = 'flex';
                headerButtons.style.display = 'flex'; // YENİ: Göster
                jokerBtn.style.display = 'inline-block'; // YENİ: Göster
                hintBtn.style.display = 'inline-block'; // YENİ: Göster

                letterRows.forEach(row => row.style.display = 'flex');
                specialKeysRow.style.display = 'flex';
                jokerBtn.disabled = (jokerCount === 0); // YENİ: Joker sayısına göre ayarla
                if (nextButton) {
                    nextButton.disabled = true; // GÜNCELLENDİ: Yazarken ilerle tuşu pasif
                    nextButton.classList.remove('highlight-pulse');
                    nextButton.style.backgroundColor = ''; 
                    nextButton.style.color = ''; 
                }
            } else if (state === 'guessing') {
                levelSelector.style.display = 'flex';
                contentWrapperHr.style.display = 'block';
                cumleAlaniGoster(true);
                inputArea.style.display = 'flex'; 
                promptContainer.style.display = 'flex'; // YENİ
                guessPrompt.style.display = 'flex';
                headerButtons.style.display = 'flex'; // YENİ: Göster
                jokerBtn.style.display = 'inline-block';
                hintBtn.style.display = 'inline-block';

                if (nextButton) nextButton.disabled = true;
            } else if (state === 'reviewing') {
                levelSelector.style.display = 'flex';
                contentWrapperHr.style.display = 'block';
                cumleAlaniGoster(true);
                inputArea.style.display = 'flex'; 
                promptContainer.style.display = 'flex'; // YENİ
                fullTurkishContainerStatic.style.display = 'flex'; // YENİ
                keyboardEl.style.display = 'flex';
                headerButtons.style.display = 'flex'; // YENİ: Göster
                jokerBtn.style.display = 'inline-block';
                hintBtn.style.display = 'inline-block';

                letterRows.forEach(row => row.style.display = 'none');
                specialKeysRow.style.display = 'flex';
                if (nextButton) {
                    nextButton.disabled = false; // GÜNCELLENDİ: Gözden geçirirken aktif
                    nextButton.classList.add('highlight-pulse');
                }
            } else if (state === 'level_complete') {
                levelSelector.style.display = 'flex';
                contentWrapperHr.style.display = 'block';
                cumleAlaniGoster(true);
                headerButtons.style.display = 'flex'; // YENİ: Göster
                jokerBtn.style.display = 'inline-block';
                hintBtn.style.display = 'inline-block';
                // inputArea gizli kalır
            }
        }


        // --- CÜMLE YÜKLEME ---
        function loadSentence(sentenceIndex) {
            nextSentenceBtn.style.display = 'none';
            sentenceDisplayArea.classList.remove('review-mode');
            setKeyboardState('typing'); // GÜNCELLENDİ: Bu, 'nextButton'u otomatik olarak devre dışı bırakır

            // GÜNCELLENDİ: Seviye sonu mantığı buradan kaldırıldı
            currentSentenceData = gameData[currentLevelIndex].sentences[sentenceIndex];
            currentWordIndex = 0;
            userInputEl.value = '';
            sentenceDisplayArea.innerHTML = ''; 

            const wordPairsContainer = document.createElement('div');
            wordPairsContainer.className = 'turkish-fragment-container'; 
            
            // GÜNCELLENDİ: Tam cümle artık 'input-area' içindeki 'full-turkish-container-static'e yüklenecek
            fullTurkishContainerStatic.textContent = currentSentenceData.turkishFull;
            fullTurkishContainerStatic.classList.remove('visible'); 

            currentSentenceData.arabic.forEach((wordObj, index) => {
                const transText = currentSentenceData.turkish[index];

                const wordPairDiv = document.createElement('div');
                wordPairDiv.className = 'word-pair';
                if (wordObj.root === 'SKIP') {
                    wordPairDiv.classList.add('punctuation');
                }

                const transSpan = document.createElement('span');
                transSpan.className = 'turkish-translation'; 
                transSpan.textContent = transText;
                transSpan.dataset.index = index;
                
                const wordSpan = document.createElement('span');
                wordSpan.className = 'arabic-word'; 
                wordSpan.dataset.root = wordObj.root; 
                wordSpan.dataset.index = index;
                wordSpan.textContent = wordObj.text;
                wordSpan.dataset.category = wordObj.category || 'none';
                if (wordObj.isIrregularPlural) {
                    wordSpan.dataset.isIrregular = 'true';
                }

                wordPairDiv.appendChild(transSpan);
                wordPairDiv.appendChild(wordSpan);
                wordPairsContainer.appendChild(wordPairDiv); 
            });
            
            sentenceDisplayArea.appendChild(wordPairsContainer);
            oklariTazele();
            // GÜNCELLENDİ: Tam cümle artık buraya eklenmiyor
            // sentenceDisplayArea.appendChild(fullTurkishContainer);
            
            highlightNextWord();
        }

        // --- BİR SONRAKİ KELİMYİ VURGULAMA ---
        function highlightNextWord() {
            const allWords = sentenceDisplayArea.querySelectorAll('.arabic-word');
            const activeWord = sentenceDisplayArea.querySelector('.arabic-word.active');
            if (activeWord) {
                activeWord.classList.remove('active');
            }

            if (currentWordIndex >= allWords.length) {
                sentenceComplete();
                return;
            }

            const nextWord = allWords[currentWordIndex];
            
            if (nextWord.dataset.root === 'SKIP') {
                nextWord.classList.add('skip');
                currentWordIndex++;
                highlightNextWord(); 
            } else {
                nextWord.classList.add('active');
                userInputEl.focus();
            }
        }

        // --- Hata Gösterme Fonksiyonu ---
        function showError(message) {
            playWrongSound(); 
            errorModalBody.textContent = message;
            errorModal.style.display = 'block';
        }

        // --- CEVAP KONTROLÜ (Akıllı Hata Mesajları ile) ---
        function checkAnswer() {
            submitBtn.classList.remove('ready'); // YENİ: Vurguyu sıfırla
            const activeWord = sentenceDisplayArea.querySelector('.arabic-word.active');
            if (!activeWord) return;

            const expectedRoot = activeWord.dataset.root;
            const category = activeWord.dataset.category;
            const originalText = activeWord.textContent;
            const isIrregular = activeWord.dataset.isIrregular === 'true';
            const userAnswer = userInputEl.value;

            const normalizedExpected = normalizeForCompare(expectedRoot);
            const normalizedUser = normalizeForCompare(userAnswer);
            const normalizedOriginal = normalizeForCompare(originalText);
            const normalizedBareWord = normalizeForCompare(originalText.replace(/^ال/, '')); 

            if (normalizedUser === normalizedExpected) {
                playCorrectSound(); 
                markWordAsCorrect(activeWord);
                return;
            }

            if (isIrregular && normalizedUser === normalizedBareWord) {
                playCorrectSound(); 
                markWordAsCorrect(activeWord);
                return; 
            }
            
            // GÜNCELLENDİ: Hata mesajları kategoriye göre güncellendi
            if ( (category.includes('fiil (muzari)') || 
                   category.includes('ecvef') || 
                   category.includes('misal') || 
                   category.includes('nakıs') ||
                   category.includes('mehmuz') ||
                   category.includes('mudaaf') )
                   && normalizedUser === normalizedBareWord) {
                showError("Fiilin Mazisini (geçmiş zamanını) yazınız! (Örn: 'يَكْتُبُ' için 'كَتَبَ' veya 'يَقُومُ' için 'قَامَ' aranır.)"); // GÜNCELLENDİ: Typo
                return;
            }
            if (userAnswer.startsWith("ال")) {
                showError("İsimler 'ال' takısı ile aranmaz! Lütfen 'ال' takısını kaldırarak yazın.");
                return;
            }
            if (category.includes('ikil') || category.includes('eril çoğul') || category.includes('dişil çoğul')) {
                 const pluralSuffixes = ['ان', 'ين', 'ون', 'ات'];
                 if (pluralSuffixes.some(suffix => normalizedUser.endsWith(normalizeForCompare(suffix)))) {
                     showError("Kelimenin Müfredini (tekilini) yazınız! (ـَانِ، ـيْنِ، ـونَ، ـات) ekleri ile arama yapılmaz.");
                     return;
                 }
            }
            if (category.includes('bitişik zamir')) {
                 if (normalizedUser === normalizedBareWord) { 
                     showError("Kelimenin sonundaki bitişik zamiri ayırarak yazınız! (Örn: 'صَدِيقِي' -> 'صَدِيق')");
                     return;
                 }
            }
            showError(`Hatalı giriş. Lütfen tekrar deneyin veya ipuçlarını kontrol edin.`); // GÜNCELLENDİ: Cevabı gösterme
        }


        // --- KELİMEYİ DOĞRU OLARAK İŞARETLEME ---
        function markWordAsCorrect(wordElement) {
            submitBtn.classList.remove('ready'); // YENİ: Vurguyu sıfırla
            wordElement.classList.remove('active');
            wordElement.classList.add('correct');

            const transSpan = wordElement.parentElement.querySelector('.turkish-translation');
            if (transSpan) {
                transSpan.classList.add('visible');
            }

            userInputEl.value = '';
            currentWordIndex++; 
            highlightNextWord(); 
        }

        // --- CÜMLE TAMAMLANDI ---
        function sentenceComplete() {
            setKeyboardState('guessing'); 
            
            const allTurkishWords = sentenceDisplayArea.querySelectorAll('.turkish-translation.visible');
            allTurkishWords.forEach(word => {
                word.classList.add('highlight-turkish');
            });
        }

        // --- TAM ÇEVİRİYİ GÖSTERME FONKSİYONU ---
        function showFullTranslation() {
            // GÜNCELLENDİ: sentenceDisplayArea sınıfı yerine container'a sınıf eklendi
            fullTurkishContainerStatic.classList.add('visible');
            setKeyboardState('reviewing');
            nextSentenceBtn.style.display = 'block';
            if (nextButton) nextButton.disabled = false; // GÜNCELLENDİ: İlerle tuşunu etkinleştir
            
            const allTurkishWords = sentenceDisplayArea.querySelectorAll('.turkish-translation');
            allTurkishWords.forEach(word => {
                word.classList.remove('highlight-turkish');
            });
        }

        // --- EVENT LISTENERS ---
        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                loadLevel(parseInt(button.dataset.level));
            });
        });
        
        guessPromptBtn.addEventListener('click', showFullTranslation);
        submitBtn.addEventListener('click', checkAnswer);

        // TEK GERİ TUŞU: sayfa index'ten yeni sekmede açıldıysa sekmeyi kapatır
        // (kişi index'te tam kaldığı yere döner); doğrudan gelindiyse index.html'e gider.
        if (backBtn) backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            playTouchSound();
            window.close();
            setTimeout(() => { location.href = 'index.html'; }, 250);
        });
        
        // YENİ: Joker Butonu Dinleyicisi
        jokerBtn.addEventListener('click', () => {
            if (jokerCount > 0) {
                jokerCount--;
                jokerBtn.textContent = `Joker (${jokerCount})`;
                
                const activeWord = sentenceDisplayArea.querySelector('.arabic-word.active');
                if (activeWord) {
                    userInputEl.value = activeWord.dataset.root;
                    playCorrectSound();
                    checkInputRealtime(); // Onay tuşunu yeşil yap
                    
                    // GÜNCELLENDİ: Otomatik gönderme (setTimeout) kaldırıldı.
                    // setTimeout(() => {
                    //     checkAnswer(); 
                    // }, 300); 
                }
                
                if (jokerCount === 0) {
                    jokerBtn.disabled = true;
                }
            } else {
                playWrongSound();
            }
        });

        // İpucu Modalı
        hintBtn.onclick = () => { hintModal.style.display = 'block'; }
        hintModalCloseBtn.onclick = () => { hintModal.style.display = 'none'; } 

        // Hata Modalı
        errorModalCloseBtn.onclick = () => {
            errorModal.style.display = 'none';
            // userInputEl.value = ''; // GÜNCELLENDİ: Hatalı kelime artık silinmiyor.
            userInputEl.focus(); 
        }

        // Dışarı tıklayınca kapat
        window.onclick = (event) => {
            if (event.target == hintModal) {
                hintModal.style.display = 'none';
            }
            if (event.target == errorModal) {
                errorModal.style.display = 'none';
                // userInputEl.value = ''; // GÜNCELLENDİ: Hatalı kelime artık silinmiyor.
                userInputEl.focus();
            }
        }

        // --- OYUNU BAŞLAT ---
        function initGame() {
            // GÜNCELLENDİ: Ses bağlamını (AudioContext) başlatmak için ilk tıklama/dokunma olayı.
            const unlockAudio = () => {
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
            };
            document.body.addEventListener('click', unlockAudio, { once: true });
            document.body.addEventListener('touchend', unlockAudio, { once: true });

            /* Sınıf kipinde başlık, künye ve seviye şeridi o sınıfa göre
               düzeltilir: ders adı görünsün, olmayan seviye durmasın. */
            if (SINIF_KIP) {
                const h1 = document.querySelector('.header h1');
                if (h1) h1.textContent = SINIF_KIP.sinif + '. Sınıf Sözlük Alıştırması';
                document.title = SINIF_KIP.sinif + '. Sınıf · Sözlük Simülasyonu';
                const kunye = document.getElementById('sinif-kunye');
                if (kunye) {
                    kunye.textContent = SINIF_KIP.sinif + '. sınıf muhâdese cümleleri · ' +
                        SINIF_KIP.cumle + ' cümle · ' + SINIF_KIP.kelime + ' kelime';
                    kunye.hidden = false;
                }
                levelButtons.forEach((b, i) => {
                    const v = i < gameData.length;
                    b.hidden = !v;
                    if (v) b.textContent = 'Seviye ' + (i + 1);
                });
            }

            createKeyboard();
            setKeyboardState('start'); // GÜNCELLENDİ: Oyunu 'start' ekranı ile başlat

            startBtn.addEventListener('click', () => {
                playTouchSound(); // YENİ: Başla tuşu ses çalsın
                loadLevel(0);
            });
            
            userInputEl.addEventListener('input', checkInputRealtime); // YENİ: Onay tuşu vurgusu için
        }

        document.addEventListener('DOMContentLoaded', initGame);
nextSentenceBtn.addEventListener('click', () => {
    playTouchSound();
    forceNextSentence();
});