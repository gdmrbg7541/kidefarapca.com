const instructions = [
    { start: 1, end: 8, text: "1. - 8. sorularda, cümlede boş bırakılan yerlere uygun düşen sözcük veya ifadeyi bulunuz." },
    { start: 9, end: 15, text: "9. - 15. sorularda, cümlede boş bırakılan yerlere uygun düşen sözcük veya ifadeyi bulunuz." },
    { start: 16, end: 20, text: "16. - 20. sorularda, parçada numaralanmış yerlere uygun düşen sözcük veya ifadeyi bulunuz." },
    { start: 21, end: 28, text: "21. - 28. sorularda, verilen cümleyi uygun şekilde tamamlayan ifadeyi bulunuz." },
    { start: 29, end: 31, text: "29. - 31. soruları parçaya göre cevaplayınız." },
    { start: 32, end: 34, text: "32. - 34. soruları parçaya göre cevaplayınız." },
    { start: 35, end: 37, text: "35. - 37. soruları parçaya göre cevaplayınız." },
    { start: 38, end: 40, text: "38. - 40. soruları parçaya göre cevaplayınız." },
    { start: 41, end: 43, text: "41. - 43. soruları parçaya göre cevaplayınız." },
    { start: 44, end: 48, text: "44. - 48. sorularda, karşılıklı konuşmanın boş bırakılan kısmını tamamlayabilecek ifadeyi bulunuz." },
    { start: 49, end: 53, text: "49. - 53. sorularda, verilen cümleye anlamca en yakın cümleyi bulunuz." },
    { start: 54, end: 58, text: "54. - 58. sorularda, verilen durumda söylenmiş olabilecek sözü bulunuz." },
    { start: 59, end: 63, text: "59. - 63. sorularda, boş bırakılan yere, parçada anlam bütünlüğünü sağlamak için getirilebilecek cümleyi bulunuz." },
    { start: 64, end: 69, text: "64. - 69. sorularda, verilen Arapça cümleye anlamca en yakın Türkçe cümleyi bulunuz." },
    { start: 70, end: 75, text: "70. - 75. sorularda, verilen Türkçe cümleye anlamca en yakın Arapça cümleyi bulunuz." },
    { start: 76, end: 80, text: "76. - 80. sorularda, cümleler sırasıyla okunduğunda parçanın anlam bütünlüğünü bozan cümleyi bulunuz." }
];

function updateInstruction() {
    const panel = document.getElementById('sticky-instruction');
    const textSpan = document.getElementById('sticky-instruction-text');
    
    const questionCards = document.querySelectorAll('.question-card');
    let currentQuestionId = null;

    // Ekranın üst kısmına (header'ın altına) en yakın olan soruyu bulalım
    for (const card of questionCards) {
        const rect = card.getBoundingClientRect();
        
        // Eğer kartın üstü ekranın üstünden 200px aşağıdaysa bu sorudayız demektir
        if (rect.top <= 200 && rect.bottom >= 100) {
            currentQuestionId = parseInt(card.id.replace('q-', ''));
            break; // İlk bulduğun (en üstteki) soruyu al ve döngüden çık
        }
    }

    if (currentQuestionId) {
        const instruction = instructions.find(ins => currentQuestionId >= ins.start && currentQuestionId <= ins.end);
        if (instruction) {
            textSpan.innerText = instruction.text;
            panel.style.display = 'block';
        }
    } else if (window.scrollY < 100) {
        // Sayfanın en başındaysak ilk yönergeyi göster
        textSpan.innerText = instructions[0].text;
        panel.style.display = 'block';
    }
}
    const questionsDB = {
        "2025": [
        {
    "id": 1,
    "type": "kelime",
    "text": "يجب أن يُعطى الطفل بعد الولادة ----- الضرورية المناسبة في المواعيد المحددة.",
    "options": {
        "A": "النزاعات",
        "B": "اللقاحات",
        "C": "المكتسبات",
        "D": "الممرضات",
        "E": "النفايات"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede 'Çocuğa doğumdan sonra belirli zamanlarda gerekli ve uygun ----- verilmelidir' denilmektedir. Boşluğa anlam bakımından en uygun kelime 'aşılar' anlamına gelen 'اللقاحات' kelimesidir."
},
        {
    "id": 2,
    "type": "kelime",
    "text": "تستمر تركيا في كونها أكبر دولة مانحة في العالم من حيث ---- الإنسانية الرسمية.",
    "options": {
        "A": "المسابقة",
        "B": "المساعدة",
        "C": "المناقشة",
        "D": "المناسبة",
        "E": "المقاومة"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede Türkiye'nin 'resmi insani yardımlar' bakımından dünyada en çok bağış yapan ülke olduğu belirtilmektedir. 'Yardım' anlamına gelen 'المساعدة' (el-musa'ade) kelimesi bağlama tam uyum sağlar."
},
        {
    "id": 3,
    "type": "kelime",
    "text": "يحبّ الكثير من الناس تربية الحيوانات ----- في المنازل والاعتناء بها.",
    "options": {
        "A": "الأليفة",
        "B": "الجاهلة",
        "C": "الحافلة",
        "D": "المسافرة",
        "E": "المفترسة"
    },
    "correct": "A",
    "explanation": "Doğru cevap A şıkkıdır. Cümlede 'Birçok insan evlerde ----- hayvanları beslemeyi ve onlara bakmayı sever' ifadesi yer almaktadır. Boşluğa evcil hayvanlar anlamına gelen 'الحيوانات الأليفة' tamlamasını tamamlayan 'الأليفة' (evcil) kelimesi gelmelidir."
},
       {
    "id": 4,
    "type": "kelime",
    "text": "يستخدم معظم الناس في العالم الإنترنت ومواقع التواصل -----.",
    "options": {
        "A": "الجامعية",
        "B": "الاجتماعي",
        "C": "تكنولوجية",
        "D": "البشرية",
        "E": "مجتمعي"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Arapça'da 'Sosyal Medya' kavramı 'مواقع التواصل الاجتماعي' (mavaqi'u-t-tavasuli-l-ictimai) kalıbıyla ifade edilir. 'التواصل' kelimesi marife (belirli) olduğu için, onu niteleyen sıfatın da marife olması gerekir."
},
        {
    "id": 5,
    "type": "kelime",
    "text": "إن مهارة إدارة الصف واحدة من أهم مهارات تنفيذ التدريس وإدارته، وبدون اكتساب هذه المهارة لا يكون التدريس ---- في أغلب الأحيان.",
    "options": {
        "A": "صانعا",
        "B": "ناجحا",
        "C": "خارجا",
        "D": "فاشلا",
        "E": "راقبا"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede sınıf yönetimi becerisinin öğretimin uygulanmasındaki önemi vurgulanmaktadır. 'Bu beceri kazanılmadan, öğretim çoğu zaman ---- olmaz' ifadesini en uygun şekilde tamamlayan kelime 'başarılı' anlamına gelen 'ناجحا' kelimesidir."
},
        {
    "id": 6,
    "type": "kelime",
    "text": "يعتقد الخبراء أن إراحة الجسد من تناول الطعام لساعات متواصلة في اليوم، ---- في الاستشفاء من مضاعفات الإجهاد النفسي.",
    "options": {
        "A": "تقاوم",
        "B": "تساهم",
        "C": "تقلّل",
        "D": "تناسب",
        "E": "تعاني"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede uzmanların, vücudu gün içinde uzun süre yemekten uzak tutmanın (aç bırakmanın) psikolojik stresin yan etkilerinden kurtulmaya ---- olduğuna inandıkları ifade edilmektedir. 'Katkı sağlamak / yardımcı olmak' anlamına gelen 'تساهم' fiili, 'في' harf-i ceri ile birlikte bu bağlama en uygun kelimedir."
},
       {
    "id": 7,
    "type": "kelime",
    "text": "دخان المصانع والسيارات والتدخين ---- تلوث الهواء والأمراض.",
    "options": {
        "A": "تعمل",
        "B": "تسبب",
        "C": "توجد",
        "D": "تفتح",
        "E": "تجعل"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede 'Fabrika dumanları, arabalar ve sigara içmek, hava kirliliğine ve hastalıklara ----' denilmektedir. Boşluğa 'sebep olur / yol açar' anlamına gelen 'تسبب' (tüsebbibu) fiili anlamca en uygun seçenektir."
},
       {
    "id": 8,
    "type": "kelime",
    "text": "إن العلم والتكنولوجيا ---- الإنسان عونا كبيرا في مجال متابعة تدفق المعلومات واسترجاعها بسرعة هائلة عن طريق العقول الحاسوبية الإلكترونية.",
    "options": {
        "A": "أطلقا على",
        "B": "قدّما لـ",
        "C": "تعاونا مع",
        "D": "توصّلا إلى",
        "E": "منعا عن"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede bilim ve teknolojinin, elektronik bilgisayar zihinleri aracılığıyla bilginin akışını takip etme ve hızla geri çağırma alanında insana büyük bir yardım ---- ifade edilmektedir. 'Sunmak / sağlamak' anlamına gelen 'قدّم لـ' (qaddema li) kalıbı, 'yardım sunmak' (قدما عونا) anlamını tamamladığı için bağlama en uygun seçenektir."
},
// questionsDB içerisine eklenecek 9-15. sorular:

        {
    "id": 9,
    "type": "gramer",
    "text": "يختلف الأفراد عن بعضهم البعض من بعض النواحي و---- هذه الاختلافات في عملية تعلمهم.",
    "options": {
        "A": "يؤثر",
        "B": "تؤثر",
        "C": "تؤثرون",
        "D": "يؤثرون",
        "E": "يؤثرن"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Boşluktan sonra gelen 'هذه الاختلافات' (bu farklılıklar) ifadesi akılsız çoğul (cem'i gayri akil) olduğu için, fiilin müennes tekil (müfret müennes) formda gelmesi gerekir. 'تؤثر' (etki eder) fiili bu gramer kuralına ve cümle anlamı olan 'bu farklılıklar onların öğrenme süreçlerini etkiler' ifadesine tam uyum sağlar."
},
        // questionsDB "2025" dizisi (10. soru - Orijinal Metin ve PDF Uyumu):

        {
    "id": 10,
    "type": "gramer",
    "text": "منذ أوائل العصر الإسلامي ---- للعوامل البيئية والمناخية أثر كبير في اختيار مواقع المدن الإسلامية.",
    "options": {
        "A": "كان",
        "B": "كانت",
        "C": "كانوا",
        "D": "كانا",
        "E": "كُنَّ"
    },
    "correct": "B",
    "explanation": "Doğru cevap B şıkkıdır. Cümlede 'etki' (أثر) kelimesi cümlenin öznesi gibi görünse de, fiil cümlenin başında yer alan ve müennes (dişil) olan 'العوامل البيئية والمناخية' (çevresel ve iklimsel faktörler) grubuna atıfta bulunmaktadır. Arapça gramer kurallarına göre akılsız çoğullar (عوامل) müfret müennes (tekil dişil) kabul edildiği için 'كانت' fiili kullanılmalıdır."
},
        {
            id: 11,
            type: "tamamlama",
            text: "مرض الرئة المزمن مرض رئوي يتفاقم إلى مرض خطير ---- بيانات منظمة الصحة العالمية.",
            options: { A: "وفقا لـ", B: "ومن ثم", C: "وجها بوجه", D: "بالمثل", E: "عن طريق" },
            correct: "A",
            explanation: "2025 YDT 11. Soru: 'Dünya Sağlık Örgütü verilerine göre' anlamını veren 'وفقا لـ' edatı uygundur[cite: 505, 506, 507, 779]."
        },
        {
            id: 12,
            type: "dilbilgisi",
            text: "إن ظاهرة هجرة الطيور معروفة منذ آلاف السنين ---- تبقى غير مفهومة بشكل كامل بالنسبة للعلماء.",
            options: { A: "إلا أنها", B: "لاسيما", C: "حيثما", D: "كأنها", E: "ولها" },
            correct: "A",
            explanation: "2025 YDT 12. Soru: '... bilinmektedir ancak ...' anlamında zıtlık bildiren 'إلا أنها' bağlacı kullanılmıştır[cite: 517, 518, 779]."
        },
        {
            id: 13,
            type: "dilbilgisi",
            text: "الوطن هو المكان ---- ينتمي إليه الناس ويقيمون فيه.",
            options: { A: "الذي", B: "ما", C: "التي", D: "من", E: "الذين" },
            correct: "A",
            explanation: "2025 YDT 13. Soru: 'المكان' (mekan) kelimesi müzekker ve tekil olduğu için ismi mevsul olarak 'الذي' seçilmelidir[cite: 521, 523, 527, 779]."
        },
        {
            id: 14,
            type: "harficer",
            text: "لا تستطيع السلحفاة الخروج من قوقعها، لأن أجسامها ملتصقة ---- من خلال العمود الفقري والقفص الصدري.",
            options: { A: "معها", B: "بها", C: "عنها", D: "منها", E: "عليها" },
            correct: "B",
            explanation: "2025 YDT 14. Soru: 'Yapışık' anlamına gelen 'ملتصقة' kelimesi 'بـ' harf-i ceri ile kullanılır[cite: 528, 531, 536, 779]."
        },
        {
            id: 15,
            type: "dilbilgisi",
            text: "هناك العديد من الأشياء التي يمكن القيام بها للحفاظ على عيون الطفل ---- منذ الولادة وحتى سنوات المراهقة.",
            options: { A: "سليمات", B: "سليما", C: "سليمة", D: "سليمان", E: "سليمون" },
            correct: "C",
            explanation: "2025 YDT 15. Soru: 'عيون' (gözler) kelimesi akılsız çoğul olduğu için onu niteleyen sıfat müennes tekil (سليمة) olarak gelir[cite: 540, 545, 548, 779]."
        },
// questionsDB "2025" dizisi (16-20 arası Cloze Test - Kitapçık Formatı):

        {
            id: 16,
            type: "tamamlama",
            text: "<b>Aşağıdaki parçada numaralanmış yerlere uygun düşen sözcük veya ifadeyi bulunuz.</b><br><br> يتمتع الفرد الناجح بالعديد من الصفات وهي؛ مقدرته على تحمل المسؤوليات (16) ---- تقع على عاتقه، حيث إن الطريق (17) ---- والأول لتحمل الفرد للمسؤولية هو اختيار الوجهة الصحيحة، والتركيز (18) ---- ما يمكنه التحكم عليه في حياته، وهو (19) ---- بترتيب أولوياته، خصوصاً إذا حدث تعارض بين هذه الأهداف. (20) ---- يتمتع الأشخاص الناجحون بالذكاء والعزيمة كما أنهم يتمتعون بالمرونة.<br><br><b> Soru için uygun ifadeyi bulunuz</b>",
            options: { A: "اللواتي", B: "الذين", C: "التي", D: "الذي", E: "اللتان" },
            correct: "C",
            explanation: "16. Soru: 'المسؤوليات' akılsız çoğul olduğu için ismi mevsul 'التي' olmalıdır."
        },
        {
            id: 17,
            type: "kelime",
            text: "17. numaralı boşluğa uygun düşen sözcüğü bulunuz:",
            options: { A: "النوعي", B: "العضوي", C: "الأساسي", D: "الفرعي", E: "الجوهري" },
            correct: "C",
            explanation: "17. Soru: Metindeki 'ilk yol' ifadesini tamamlayan 'temel' (الأساسي) kelimesidir."
        },
        {
            id: 18,
            type: "harficer",
            text: "18. numaralı boşluğa uygun düşen ifadeyi bulunuz:",
            options: { A: "من", B: "في", C: "إلى", D: "على", E: "عن" },
            correct: "D",
            explanation: "18. Soru: 'Odaklanmak' anlamındaki 'التركيز' kelimesi 'على' edatı ile kullanılır."
        },
        {
            id: 19,
            type: "kelime",
            text: "19. numaralı boşluğa uygun düşen sözcüğü bulunuz:",
            options: { A: "يقرأ", B: "يمر", C: "يكتب", D: "يقول", E: "يهتم" },
            correct: "E",
            explanation: "19. Soru: 'Önceliklerle ilgilenmek' anlamında 'يهتم بـ' kalıbı uygundur."
        },
        {
            id: 20,
            type: "dilbilgisi",
            text: "20. numaralı boşluğa uygun düşen ifadeyi bulunuz:",
            options: { A: "غالباً ما", B: "عندما", C: "حسبما", D: "لولا أن", E: "غير أن" },
            correct: "A",
            explanation: "20. Soru: 'Genellikle' anlamı katan 'غالباً ما' kalıbı parçayı tamamlar."
        },

// questionsDB "2025" dizisi (21. Soru):

        {
            id: 21,
            type: "tamamlama",
            text: "يحتوي التمر على نسبة عالية من السكريات ----.",
            options: { 
                A: "حلوة التمر من الحلويات المحبوبة من قبل العرب", 
                B: "يتم حفظ التمر في الثلاجة لكي لا يفسد بشكل سريع", 
                C: "تكثر زراعة التمر في البلدan العربية غالباً", 
                D: "يوجد الكثير من أنواع التمر ولكل تمر طعمه الخاص", 
                E: "لذلك ينصح بتناوله باعتدال لا إفراط ولا تفريط" 
            },
            correct: "E",
            explanation: "2025 YDT 21. Soru: Cümle 'Hurma yüksek oranda şeker içerir' diye başlar. Bağlam gereği sonuç bildiren 'Bu yüzden ölçülü tüketilmesi önerilir' (E şıkkı) ifadesi cümleyi tamamlar[cite: 210, 389]."
        },
// questionsDB "2025" dizisi (22. Soru):

        {
            id: 22,
            type: "tamamlama",
            text: "---- لأنها تتألف من مجموعة من الخضروات المختلفة الألوان.",
            options: { 
                A: "يتم تزيين التبولة إما بالبندورة أو بالخس", 
                B: "التبولة سلطة لبنانية تتميز بمظهرها الجذابة", 
                C: "التبولة من السلطات الموجودة في مطاعم لبنان", 
                D: "التكثير من إضافة الزيوت إلى التبولة غير صحية", 
                E: "التبولة سلطة عربية مشهورة في جميع أنحاء العالم" 
            },
            correct: "B",
            explanation: "2025 YDT 22. Soru: Cümle '...çünkü o, farklı renklerdeki bir grup sebzeden oluşur'  şeklinde bittiği için, boşluğa bu sebep-sonuç ilişkisini tamamlayan 'Tebule, çekici görünümüyle öne çıkan Lübnan salatasıdır'  ifadesi gelmelidir."
        },
    
     // questionsDB "2025" dizisi (23. Soru):

        {
            id: 23,
            type: "tamamlama",
            text: "---- ، ولكن من المعتقد أنه نشأ مع بداية الحضارة الإنسانية.",
            options: { 
                A: "كانت احتياجات الإنسان الأساسية هي نفسها منذ القدم", 
                B: "نحن لا نعلم تحديداً متى بدأ مفهوم العمل بالضبط", 
                C: "الزراعة ضرورية لاستمرار حياة الإنسان اليومية", 
                D: "اختلفت الأعمال البدائية مع زيادة حاجات الإنسان", 
                E: "في يومنا هذا اختلفت الأعمال من الأعمال البدائية" 
            },
            correct: "B",
            explanation: "2025 YDT 23. Soru: Cümle '...fakat insanlık medeniyetinin başlangıcıyla ortaya çıktığına inanılıyor' şeklinde bitmektedir. Bu zıtlığı tamamlayan en mantıklı giriş 'İş kavramının tam olarak ne zaman başladığını kesin olarak bilmiyoruz' (B şıkkı) ifadesidir[cite: 204, 389]."
        },
// questionsDB "2025" dizisi (24. Soru - Orijinal Şık Sıralamasıyla):

        {
            id: 24,
            type: "tamamlama",
            text: "---- أما الرأي فهو شيء غير ثابت يختلف من شخص لآخر.",
            options: { 
                A: "الحقيقة شيء ثابت لا يحتمل الصواب والخطأ", 
                B: "الرأي فكر يطرحه الشخص حول موضوع ما", 
                C: "هناك العديد من الاعتقادات الخاطئة في المجتمع", 
                D: "الكثير لا يعرف الفرق بين الحقيقة والرأي", 
                E: "علينا التعرف على كل معاني المصطلحات" 
            },
            correct: "A",
            explanation: "2025 YDT 24. Soru: Cümle '...görüşe gelince o, kişiden kişiye değişen sabit olmayan bir şeydir' şeklinde bitmektedir[cite: 222]. Bu karşılaştırmalı yapıyı en iyi tamamlayan giriş 'Birçok kişi gerçek ile görüş arasındaki farkı bilmemektedir' ifadesidir[cite: 389]."
        },
// questionsDB "2025" dizisi (25. Soru - Kitapçıktaki Kelimesi Kelimesine):

        {
            id: 25,
            type: "tamamlama",
            text: "الرياضة ليست فقط مجهوداً بدنياً عنيفاً، ----.",
            options: { 
                A: "بل لها عديد من الفوائد الجذابة التي لا استغناء عنها", 
                B: "لكنها تتطلب جهداً كبيراً للقضاء على السمنة الزائدة", 
                C: "لأن شباب يومنا لا يقومون بالرياضة مع الأسف", 
                D: "بل يجب على كل طفل أن يختار رياضة مناسبة لنفسه", 
                E: "إذ يتخلص الشخص من الدهون المتراكمة في جسمه بفضل الرياضة" 
            },
            correct: "A",
            explanation: "2025 YDT 25. Soru: Cümle 'Spor sadece şiddetli bir fiziksel çaba değildir' diye başlar. 'Aksine, onun vazgeçilmez pek çok cazip faydası vardır' diyen A şıkkı anlamı tamamlar."
        },
// questionsDB "2025" dizisi (26. Soru - Görseldeki Orijinal Hali):

        {
            id: 26,
            type: "tamamlama",
            text: "تعد الطاقة الكهربائية من الطاقات المهمة في حياتنا اليومية ----.",
            options: { 
                A: "لأنها تُسبب تلوثاً في البيئة التي نعيش فيها", 
                B: "وليست قابلة للنقل من مكان لآخر بالأسلاك بالسهولة", 
                C: "لأنها لا تتصف بصفات ممتازة تختص بها", 
                D: "لكونها غير مناسبة لإنجاز الشغل المطلوب", 
                E: "بسبب تشغيلها معظم الأجهزة الضرورية في البيوت" 
            },
            correct: "E",
            explanation: "2025 YDT 26. Soru: Elektrik enerjisinin günlük hayattaki öneminin nedeni, evlerdeki çoğu temel cihazı çalıştırmasıdır. Bu yüzden 'بسبب تشغيلها...' ile başlayan E şıkkı anlamı tamamlayan en mantıklı seçenektir."
        },
// questionsDB "2025" dizisi (27. Soru - Görseldeki Orijinal Hali):

        {
            id: 27,
            type: "tamamlama",
            text: "تعد اللحوم الحمراء خطيرة نوعا ما، ----.",
            options: { 
                A: "وذلك بسبب احتوائها على الدهون المشبعة وغير المشبعة", 
                B: "لأن كثيرا من الناس يحبون اللحوم الحمراء ويأكلونها باستمرار", 
                C: "لكن بعض الناس يفضلون تناول السمك على تناول اللحم الأحمر", 
                D: "على الرغم من ارتفاع سعرها يوما بعد يوم", 
                E: "بل تسبب السمنة لدى الأطفال والمراهقين" 
            },
            correct: "A",
            explanation: "2025 YDT 27. Soru: Kırmızı etin 'bir bakıma tehlikeli' kabul edilmesinin nedeni, A şıkkında belirtilen 'doymuş ve doymamış yağlar içermesidir'."
        },
// questionsDB "2025" dizisi (28. Soru - Görseldeki Orijinal Hali):

        {
            id: 28,
            type: "tamamlama",
            text: "يعد تدوين اللهجات العربية بشكل علمي أمرا شديد التعقيد، ----.",
            options: { 
                A: "لأن اللهجة الشامية منتشرة ومعروفة لدى العرب", 
                B: "كما أن اللهجات المحلية تراث مهم ينتقل من جيل إلى جيل", 
                C: "إضافة إلى ذلك يتكلم كل بلدان العرب لهجتهم الخاصة بهم في حياتهم اليومية", 
                D: "ولذلك يكتب العلماء دراساتهم العلمية بلهجاتهم المحلية", 
                E: "ذلك لأن الأساس في اللهجات أنها منطوقة وغير مكتوبة" 
            },
            correct: "E",
            explanation: "2025 YDT 28. Soru: Arap lehçelerini bilimsel bir şekilde yazıya dökmenin 'çok karmaşık' olmasının temel sebebi, lehçelerin özünde sözlü olması ve yazılı bir formunun bulunmamasıdır (E şıkkı)."
},

    {
        id: 29,
        type: "paragraf",
        text: "29. - 31. soruları aşağıdaki parçaya göre cevaplayınız.<br><br>" +
              "ظهرت الملابس في العصر الحجري القديم أي منذ أكثر من مائة وخمسين ألف سنة، وكانت الملابس في البداية مصنوعة من أوراق الأشجار الكبيرة والريش وفراء وجلود الحيوانات. وفي أواخر العصر الحجري القديم تمكن الإنسان من <u>استخلاص</u> الخيوط من ألياف النباتات واستخدمها في صناعة الملابس. ارتبطت الملابس بالألوان حتى أنها كانت ترمز لطبقة أو حالة اجتماعية أو فئة عمرية أو غيرها من التصنيفات، وكثير من البلدان كانت لها طبقة أو مهنة تتميز بأزيائها. ونلاحظ هذا في الأزياء الرومانية والإغريقية والمصرية القديمة." + 
              "<br><br>" + 
              "<b>29. يبدو أن البشر قد بدأ بصناعة الملابس المخيطة ----.</b>",
        
        options: { 
            A: "في بداية العصر الحجري القديم أي منذ آلاف السنين", 
            B: "بعد تعرفه على أوراق النباتات وجلود الحيوانات", 
            C: "بعد تمكنه من استخدام الأدوات الحجرية للصيد", 
            D: "بعد تمكنه من استخلاص الخيوط من ألياف النباتات", 
            E: "أثناء استخدامهم لفراء وجلود الحيوانات" 
        },
        correct: "D",
        explanation: "2025 YDT 29. Soru Çözümü: Parçada insanoğlunun Eski Taş Devri'nin sonlarında bitki liflerinden iplik elde etmeyi başardığı belirtilir. 'الملابس المخيطة' (dikili kıyafet) ifadesi, iplik kullanımına geçilen bu döneme işaret eder."
    },
// 2025 YDT - 30. Soru (Düzeltilmiş ve Görselle Eşleştirilmiş):

    {
        id: 30,
        type: "paragraf",
        // Tırnak hatası düzeltildi ve dikey boşluk eklendi:
        text: "<b>ما الكلمة التي يمكن أن تحل محل كلمة 'استخلاص' التي تحتها خط في النص؟</b>",
        
        options: { 
            A: "استحفاظ", 
            B: "استغفار", 
            C: "استخراج", 
            D: "استثمار", 
            E: "استرجاع" 
        },
        correct: "C",
        explanation: "2025 YDT 30. Soru Çözümü: Metinde geçen 'استخلاص' (istihlâs) kelimesi bir şeyin özünü çıkarmak veya elde etmek anlamındadır. Görseldeki şıklar arasında bu anlamı karşılayan en uygun kelime 'استخراج' (istihrac - çıkarmak/elde etmek) seçeneğidir."
    },
{
    id: 31,
    type: "paragraf",
    text: "<br><b> ماذا يمكن أن نقول بعد قراءة النص؟</b>",
    options: { 
        A: "بدأ البشر بارتداء الملابس المنسوجة منذ بداية العصر الحجري القديم.", 
        B: "كان الإنسان البدائي يفضل ارتداء الملابس الملونة قبل استخلاص الخيوط من الألياف النباتية.", 
        C: "الأزياء التي استخدمت من قبل الرومانيين والإغريق والمصريين القدماء كانت غير ملونة.", 
        D: "الألوان المستخدمة في الملابس كانت ترمز في بعض المجتمعات إلى ميزة أو صفة اجتماعية معينة.", 
        E: "لم يتمكن الإنسان من ارتداء أية ملابس مصنوعة من الأوراق منذ العصر الحجري." 
    },
    correct: "D",
    explanation: "2025 YDT 31. Soru: Metinde renklerin sınıfsal, sosyal durum veya yaş grubunu simgelediği (tarmazu li-ṭabaqa aw ḥāla ic-timāʿiyya) açıkça belirtilmiştir."
},
// 32-34. Sorular için Ara Yönlendirme ve Pasaj
{
    id: 32, // ID tırnak içinde de olabilir ama sayısal olması tercih edilir
    type: "paragraf",
    text: 
          "\"مالطة\" جزيرة أوروبية تقع في البحر الأبيض المتوسط، عاصمتها هي مدينة \"فاليتا\". نظام الحكم في مالطة جمهوري برلماني، وعملتها الرسمية هي اليورو. تنتمي مالطة لبعض المؤسسات الدولية كالأمم المتحدة ومؤسسة التمويل الدولية ومنظمة الأمن والتعاون في أوروبا ومجلس أوروبا ولذلك يمكن القول إن علاقاتها وطيدة معهم. اللغة المالطية هي اللغة الرسمية في الجزيرة وهي لغة وطنية مشتقة من اللغة العربية الصقلية، وتعتبر لغة ساميّة وحيدة بين اللغات الرسمية في الاتحاد الأوروبي. ومفردات هذه اللغة مأخوذة من عدة لغات كاللغة الصقلية واللغة الإيطالية واللغة اللاتينية ويتحدث بها أكثر من ثلاثمائة وسبعين ألف شخص." +
          "<br><br>" + // Pasaj ve soru kökü arasında dikey boşluk
          "<b>32. ما الخصائص الجغرافية لمالطة؟</b>", // Soru kökü eklendi
    
    options: { 
        A: "إنها جزيرة واقعة في البحر الأبيض المتوسط.", 
        B: "تتألف مالطة من عدة جزر في وسط البحر الأبيض.", 
        C: "هي شبه جزيرة تطل على البحر الأحمر.", 
        D: "تغطيها جبال شامخة تميزها عن سائر الدول جغرافيا.", 
        E: "فيها سهول واسعة بين جبالها العالية." 
    },
    correct: "A",
    explanation: "2025 YDT 32. Soru Çözümü: Metnin en başında Malta, 'Akdeniz'de yer alan bir Avrupa adası' (جزيرة أوروبية تقع في البحر الأبيض المتوسط) olarak tanımlanmıştır. Bu doğrudan A şıkkında verilmiştir."
},
{
    id: 33,
    type: "paragraf",
    // Pasaj, dikey boşluk ve 33. soru kökü bir arada:
    text: 
          "\"مالطة\" جزيرة أوروبية تقع في البحر الأبيض المتوسط، عاصمتها هي مدينة \"فاليتا\". نظام الحكم في مالطة جمهوري برلماني، وعملتها الرسمية هي اليورو. تنتمي مالطة لبعض المؤسسات الدولية كالأمم المتحدة ومؤسسة التمويل الدولية ومنظمة الأمن والتعاون في أوروبا ومجلس أوروبا ولذلك يمكن القول إن علاقاتها وطيدة معهم. اللغة المالطية هي اللغة الرسمية في الجزيرة وهي لغة وطنية مشتقة من اللغة العربية الصقلية، وتعتبر لغة ساميّة وحيدة بين اللغات الرسمية في الاتحاد الأوروبي. ومفردات هذه اللغة مأخوذة من عدة لغات كاللغة الصقلية واللغة الإيطالية واللغة اللاتينية ويتحدث بها أكثر من ثلاثمائة وسبعين ألف شخص." +
          "<br><br>" + 
          "<b> ما هي خصائص اللغة المالطية؟</b>",
    
    options: { 
        A: "هي مزيج من عدة لغات، اشتقت من فصيلة اللغات الهند - أوروبية.", 
        B: "هي لغة أوروبية بحتة، تملك ما تملكه اللغات الأوروبية من خصائص.", 
        C: "تنحدر من أصل سامي ولا تزال تُكتب بأبجدية شرقية قديمة.", 
        D: "تعتمد على لهجة عربية، أخذت ألفاظا إيطالية ولاتينية أخرى.", 
        E: "تأثرت بلغات ولهجات عربية رغم كونها لغة أوروبية أصيلة." 
    },
    correct: "D",
    explanation: "2025 YDT 33. Soru Çözümü: Pasajda Maltaca için 'Sicilya Arapçasından türetilmiş' (مشتقة من اللغة العربية الصقلية) ve 'kelimeleri Sicilyaca, İtalyanca ve Latince gibi dillerden alınmıştır' (ومفردات هذه اللغة مأخوذة من عدة لغات كاللغة الصقلية واللغة الإيطالية واللغة اللاتينية) denilmektedir. Bu bilgiler doğrudan D şıkkı ile örtüşmektedir."
},
{
    id: 34,
    type: "paragraf",
    // Pasaj, dikey boşluk ve 34. soru kökü bir arada:
    text: 
          "\"مالطة\" جزيرة أوروبية تقع في البحر الأبيض المتوسط، عاصمتها هي مدينة \"فاليتا\". نظام الحكم في مالطة جمهوري برلماني، وعملتها الرسمية هي اليورو. تنتمي مالطة لبعض المؤسسات الدولية كالأمم المتحدة ومؤسسة التمويل الدولية ومنظمة الأمن والتعاون في أوروبا ومجلس أوروبا ولذلك يمكن القول إن علاقاتها وطيدة معهم. اللغة المالطية هي اللغة الرسمية في الجزيرة وهي لغة وطنية مشتقة من اللغة العربية الصقلية، وتعتبر لغة ساميّة وحيدة بين اللغات الرسمية في الاتحاد الأوروبي. ومفردات هذه اللغة مأخوذة من عدة لغات كاللغة الصقلية واللغة الإيطالية واللغة اللاتينية ويتحدث بها أكثر من ثلاثمائة وسبعين ألف شخص." +
          "<br><br>" + 
          "<b> ماذا يمكن القول حول علاقات مالطة مع العالم ودوله؟</b>",
    
    options: { 
        A: "تقدمت في السنوات الأخيرة للانضمام إلى الاتحاد الأوروبي.", 
        B: "علاقاتها وثيقة مع الاتحاد الأوروبي وهي عضو في عدة منظمات دولية.", 
        C: "تعيش مالطة في معزل عن العالم وسياسته اليومية.", 
        D: "قطعت علاقاتها مع عدة دول لأسباب سياسية واقتصادية.", 
        E: "علاقاتها وطيدة ولاسيما مع البلدان الإفريقية المجاورة." 
    },
    correct: "B",
    explanation: "2025 YDT 34. Soru Çözümü: Pasajda Malta'nın Birleşmiş Milletler, Avrupa Konseyi, AGİT (OSCE) ve IFC gibi birçok uluslararası kuruluşa üye olduğu belirtilmektedir. Metindeki 'vaktiyle bu kurumlarla ilişkilerinin güçlü olduğu' (علاقاتها وطيدة معهم) ifadesinden yola çıkarak, Malta'nın uluslararası alanda aktif bir üye olduğu ve Avrupa Birliği/kuruluşları ile yakın ilişkileri bulunduğu sonucuna varılır. Bu nedenle doğru cevap B şıkkıdır."
},
// 2025 YDT - 35. Soru (Pasaj ile Birleşik Tek ID):

    {
        id: 35,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text: 
              "يعتبر فن مسرح الدمى فنا شعبيا قديما، يعود أصله إلى الثقافات الآسيوية القديمة، لكنه ازدهر في البلاد العربية بعد سقوط الأندلس، حيث كانت وسيلة <u>لتسلية</u> الناس والأطفال خصوصا، وكذلك طريقة جيدة لحكاية القصص المفيدة. في السابق لم تكن التكنولوجيا متوفرة مثل التلفاز والهواتف الذكية، فكانت الحياة بسيطة، لذلك كان مسرح الدمى يجذب الناس إليه من خلال شكل الدمى وألوانها الزاهية، وكذلك كيفية قيامها بالحركات. وهذا بالطبع كان يقوم به الفنان الذي يحرك الدمى ويتحدث ويغني أيضا." +
              "<br><br>" + 
              "<b>يبدو أن المقصود من مسرح الدمى هو: ----.</b>",
        
        options: { 
            A: "مشاهدة المسرحيات التلفزيونية للدمى", 
            B: "التحدث عن قصص الدمى للأطفال", 
            C: "صناعة الدمى بألوان زاهية وجميلة", 
            D: "مسرحيات تسلية الأطفال في التلفاز", 
            E: "استخدام الدمى في عروض لتسلية الناس" 
        },
        correct: "E",
        explanation: "2025 YDT 35. Soru Çözümü: Parçanın genelinde kukla tiyatrosunun (مسرح الدمى) insanların ve özellikle çocukların eğlendirilmesi için bir araç olduğu anlatılmaktadır. E şıkkındaki 'insanları eğlendirmek için yapılan gösterilerde kuklaların kullanılması' (استخدام الدمى في عروض لتسلية الناس) ifadesi metnin amacını tam olarak karşılar."
    },
{
    id: 36,
    type: "paragraf",
    // Pasaj, dikey boşluk ve 36. soru kökü bir arada:
    text: 
          "يعتبر فن مسرح الدمى فنا شعبيا قديما، يعود أصله إلى الثقافات الآسيوية القديمة، لكنه ازدهر في البلاد العربية بعد سقوط الأندلس، حيث كانت وسيلة <u>لتسلية</u> الناس والأطفال خصوصا، وكذلك طريقة جيدة لحكاية القصص المفيدة. في السابق لم تكن التكنولوجيا متوفرة مثل التلفاز والهواتف الذكية، فكانت الحياة بسيطة، لذلك كان مسرح الدمى يجذب الناس إليه من خلال شكل الدمى وألوانها الزاهية، وكذلك كيفية قيامها بالحركات. وهذا بالطبع كان يقوم به الفنان الذي يحرك الدمى ويتحدث ويغني أيضا." +
          "<br><br>" + 
          "<b> ما هي الكلمة التي يمكن أن تحل محل كلمة 'لتسلية' التي تحتها خط في النص؟</b>",
    
    options: { 
        A: "لإبعاد", 
        B: "لتوصية", 
        C: "لإمتاع", 
        D: "لإنتاج", 
        E: "لتوعية" 
    },
    correct: "C",
    explanation: "2025 YDT 36. Soru Çözümü: Metinde geçen 'لتسلية' (eğlendirmek/vakit geçirtmek için) kelimesi, birini keyiflendirmek ve hoşça vakit geçirtmek anlamındadır. Seçenekler arasında bu anlamı tam olarak karşılayan kelime 'لإمتاع' (keyiflendirmek/eğlendirmek için) kelimesidir."
},

{
    id: 37,
    type: "paragraf",
    // Pasaj, dikey boşluk ve 37. soru kökü bir arada:
    text: 
          "يعتبر فن مسرح الدمى فنا شعبيا قديما، يعود أصله إلى الثقافات الآسيوية القديمة، لكنه ازدهر في البلاد العربية بعد سقوط الأندلس، حيث كانت وسيلة <u>لتسلية</u> الناس والأطفال خصوصا، وكذلك طريقة جيدة لحكاية القصص المفيدة. في السابق لم تكن التكنولوجيا متوفرة مثل التلفاز والهواتف الذكية، فكانت الحياة بسيطة، لذلك كان مسرح الدمى يجذب الناس إليه من خلال شكل الدمى وألوانها الزاهية، وكذلك كيفية قيامها بالحركات. وهذا بالطبع كان يقوم به الفنان الذي يحرك الدمى ويتحدث ويغني أيضا." +
          "<br><br>" + 
          "<b> ماذا يمكن أن نقول بعد قراءة النص؟</b>",
    
    options: { 
        A: "حلت مسرحيات الدمى محل التلفاز بعد التطور التكنولوجي.", 
        B: "كان الناس سابقا يستمتعون بمسرح الدمى بسبب عدم توفر التكنولوجيا.", 
        C: "ازدهرت مسرحيات الدمى في البلاد العربية قبل فتح الأندلس.", 
        D: "تعود جذور مسرح الدمى إلى الثقافات الأوروبية القديمة.", 
        E: "تقوم الدمى بالحركات وتغني من تلقاء نفسها دون تدخل أحد." 
    },
    correct: "B",
    explanation: "2025 YDT 37. Soru Çözümü: Metinde, geçmişte televizyon ve akıllı telefon gibi teknolojiler olmadığı için insanların kukla tiyatrosuna ilgi gösterdiği ve ondan keyif aldığı (في السابق لم تكن التكنولوجيا متوفرة... لذلك كان مسرح الدمى يجذب الناس) açıkça belirtilmiştir. Bu nedenle doğru cevap B şıkkıdır."
},
// 2025 YDT - 38. Soru (Pasaj ile Birleşik Tek ID):

    {
        id: 38,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text: 
              "كان الناس القدماء في بلاد اليونان يحبون الألعاب الرياضية، فكانوا يمارسون الرياضة كل يوم. واعتادوا على الاحتفال بتلك الألعاب، مرّة كل أربع سنوات في مدينة أولمبيا، لذلك سمّوها بالألعاب الأولمبية. وتهدف ممارسة هذه الألعاب، إلى تربية الشباب بدنيا وعقليا وتشجيعهم على المنافسة الشريفة واستثمار أوقات الفراغ بما يفيدهم ويُسعدهم. ويشترط أن يكون المتسابق، حسن السيرة والأخلاق ولا يستعمل الغش في الألعاب." +
              "<br><br>" + 
              "<b> يبدو أن الألعاب قد سُمِّيت بالألعاب الأولمبية ----.</b>",
        
        options: { 
            A: "بسبب اشتراطها لبعض الضوابط الفنية", 
            B: "لأن الناس اعتادوا على الاحتفال بها", 
            C: "لأنها تهدف إلى تربية الأطفال بدنيا", 
            D: "لأنها كانت تُقام بمدينة أولمبيا اليونانية", 
            E: "لأن الألعاب الرياضية تُنشط الجسم" 
        },
        correct: "D",
        explanation: "2025 YDT 38. Soru Çözümü: Metinde bu oyunların neden 'Olimpiyat' olarak adlandırıldığı açıkça belirtilmiştir: 'Her dört yılda bir Olympia şehrinde kutlarlardı, bu yüzden onlara Olimpiyat Oyunları dediler' (في مدينة أولمبيا، لذلك سمّوها بالألعاب الأولمبية). Bu bilgi doğrudan D şıkkında yer almaktadır."
    },
// 2025 YDT - 39. Soru (Pasaj ile Birleşik Tek ID):

    {
        id: 39,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text: 
              "كان الناس القدماء في بلاد اليونان يحبون الألعاب الرياضية، فكانوا يمارسون الرياضة كل يوم. واعتادوا على الاحتفال بتلك الألعاب، مرّة كل أربع سنوات في مدينة أولمبيا، لذلك سمّوها بالألعاب الأولمبية. وتهدف ممارسة هذه الألعاب، إلى تربية الشباب بدنيا وعقليا وتشجيعهم على المنافسة الشريفة واستثمار أوقات الفراغ بما يفيدهم ويُسعدهم. ويشترط أن يكون المتسابق، حسن السيرة والأخلاق ولا يستعمل الغش في الألعاب." +
              "<br><br>" + 
              "<b> نستنتج من النص أن الألعاب الأولمبية تهدف إلى تشجيع الشباب على ----.</b>",
        
        options: { 
            A: "الغش في الألعاب", 
            B: "إسعاد الآخرين", 
            C: "تحقيق الفوز", 
            D: "ممارسة هواية المطالعة", 
            E: "المنافسة الشريفة" 
        },
        correct: "E",
        explanation: "2025 YDT 39. Soru Çözümü: Metinde Olimpiyat Oyunları'nın amaçları arasında gençleri 'dürüst rekabete teşvik etmek' (تشجيعهم على المنافسة الشريفة) ifadesi açıkça geçmektedir. Bu nedenle doğru cevap E şıkkıdır."
    },
// 2025 YDT - 40. Soru (Pasaj ile Birleşik Tek ID):

    {
        id: 40,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text:               "كان الناس القدماء في بلاد اليونان يحبون الألعاب الرياضية، فكانوا يمارسون الرياضة كل يوم. واعتادوا على الاحتفال بتلك الألعاب، مرّة كل أربع سنوات في مدينة أولمبيا، لذلك سمّوها بالألعاب الأولمبية. وتهدف ممارسة هذه الألعاب، إلى تربية الشباب بدنيا وعقليا وتشجيعهم على المنافسة الشريفة واستثمار أوقات الفراغ بما يفيدهم ويُسعدهم. ويشترط أن يكون المتسابق، حسن السيرة والأخلاق ولا يستعمل الغش في الألعاب." +
              "<br><br>" + 
              "<b> أي العبارات التالية صحيحة حسب النص؟</b>",
        
        options: { 
            A: "يجب تحقيق الفوز دائما أثناء المشاركة في الألعاب الأولمبية.", 
            B: "هناك ضوابط معينة لقبول المتسابقين في الألعاب الأولمبية.", 
            C: "ليست هناك أهداف معينة تُحققها ممارسة الألعاب الرياضية.", 
            D: "تُقام الألعاب الأولمبية في بلاد اليونان فقط في الوقت الحاضر.", 
            E: "كان الناس في بلاد اليونان يُنظمون الألعاب الأولمبية كل سنة." 
        },
        correct: "B",
        explanation: "2025 YDT 40. Soru Çözümü: Metnin son cümlesinde yarışmacıların uyması gereken şartlar (iyi ahlaklı olma, hile yapmama vb.) açıkça belirtilmiştir: 'ويشترط أن يكون المتسابق، حسن السيرة والأخلاق ولا يستعمل الغش'. Bu durum B şıkkındaki 'yarışmacıların kabulü için belirli kurallar/kontroller vardır' (هناك ضوابط معينة لقبول المتسابقين) ifadesini doğrular."
    },
// 2025 YDT - 41. Soru (Bilgisayar Pasajı ile Birleşik Tek ID):

    {
        id: 41,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text: 
              "صار الحاسوب ضرورة في الحياة، وأصبح استعماله مهماً في كل ميادين العلم والعمل، لأنه يختصر الطريق للوصول إلى التطور الذاتي والإبداع، لقد كان الإنسان مثقلاً بالتعب والأذى في حصوله على حاجته، أما اليوم فقد تحول العالم إلى قرية صغيرة بواسطة الحاسوب وبات التلميذ الذي لا يحسن استعماله يخجل من نفسه، ولكن الخجل ليس طريق الوصول إلى النجاح، وإنما العلم بالشيء خير من الجهل به." +
              "<br><br>" + 
              "<b> لماذا أصبح الحاسوب ضرورة في حياة الإنسان حسب النص؟</b>",
        
        options: { 
            A: "لأن الإنسان يحصل على جميع المعلومات بواسطته.", 
            B: "لأن الناس يستعملون الحاسوب للتسلية فقط.", 
            C: "لأن الإنسان يتم كل أموره اليومية عبر الحاسوب.", 
            D: "لأن الناس ليسوا قادرين على قضاء أوقاتهم بدونه.", 
            E: "لأن الحاسوب يوفر الوصول إلى التطور الذاتي بسهولة." 
        },
        correct: "E",
        explanation: "2025 YDT 41. Soru Çözümü: Metinde bilgisayarın neden bir gereklilik haline geldiği şu cümleyle açıklanmıştır: 'Çünkü o (bilgisayar), kişisel gelişime ve yaratıcılığa ulaşma yolunu kısaltır' (لأنه يختصر الطريق للوصول إلى التطور الذاتي والإبداع). E şıkkındaki 'Çünkü bilgisayar kişisel gelişime ulaşmayı kolayca sağlar' ifadesi bu anlamı tam olarak karşılamaktadır."
    },
// 2025 YDT - 42. Soru (Bilgisayar Pasajı ile Birleşik Tek ID):

    {
        id: 42,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text: 
              "صار الحاسوب ضرورة في الحياة، وأصبح استعماله مهماً في كل ميادين العلم والعمل، لأنه يختصر الطريق للوصول إلى التطور الذاتي والإبداع، لقد كان الإنسان مثقلاً بالتعب والأذى في حصوله على حاجته، أما اليوم فقد تحول العالم إلى قرية صغيرة بواسطة الحاسوب وبات التلميذ الذي لا يحسن استعماله يخجل من نفسه، ولكن الخجل ليس طريق الوصول إلى النجاح، وإنما العلم بالشيء خير من الجهل به." +
              "<br><br>" + 
              "<b> نفهم من النص أن الحاسوب ----.</b>",
        
        options: { 
            A: "لا يسهل حل حاجات الإنسان", 
            B: "آلة من الآلات التقليدية", 
            C: "ليس آلة ضرورية في حياة الإنسان", 
            D: "يساهم في حل المشاكل النظامية", 
            E: "يحول العالم إلى قرية صغيرة" 
        },
        correct: "E",
        explanation: "2025 YDT 42. Soru Çözümü: Metinde bilgisayarın etkisiyle ilgili olarak 'Bugün dünya bilgisayar vasıtasıyla küçük bir köye dönüşmüştür' (أما اليوم فقد تحول العالم إلى قرية صغيرة بواسطة الحاسوب) ifadesi açıkça geçmektedir. Bu yüzden E şıkkı doğru cevaptır."
    },
// 2025 YDT - 43. Soru (Bilgisayar Pasajı ile Birleşik Tek ID):

    {
        id: 43,
        type: "paragraf",
        // Türkçe yönlendirme, Pasaj ve Soru kökü dikey boşluklarla tek bir text alanında:
        text: 
              "صار الحاسوب ضرورة في الحياة، وأصبح استعماله مهماً في كل ميادين العلم والعمل، لأنه يختصر الطريق للوصول إلى التطور الذاتي والإبداع، لقد كان الإنسان مثقلاً بالتعب والأذى في حصوله على حاجته، أما اليوم فقد تحول العالم إلى قرية صغيرة بواسطة الحاسوب وبات التلميذ الذي لا يحسن استعماله يخجل من نفسه، ولكن الخجل ليس طريق الوصول إلى النجاح، وإنما العلم بالشيء خير من الجهل به." +
              "<br><br>" + 
              "<b>أي العبارات التالية صحيحة حسب النص؟</b>",
        
        options: { 
            A: "العلم أجمل شيء في العالم.", 
            B: "أصبح العالم معقدا بواسطة العلم.", 
            C: "الحاسوب شيء معقد من حيث بنيانه.", 
            D: "الحاسوب أهم شيء لحياة الأطفال.", 
            E: "إن العلم بالشيء خير من الجهل به." 
        },
        correct: "E",
        explanation: "2025 YDT 43. Soru Çözümü: Metnin en son cümlesi doğrudan 'Bir şeyi bilmek, onu bilmemekten daha hayırlıdır' (وإنما العلم بالشيء خير من الجهل به) atasözü ile bitmektedir. E şıkkı bu ifadeyi kelimesi kelimesine yansıtmaktadır."
    },
{
    id: 44,
    type: "diyalog",
    text: "<b>ليلى:</b> أعتقد أن التعليم الذاتي سينتشر في المستقبل القريب.<br>" +
          "<b>فاطمة:</b> أنا أوافقك الرأي لأن الوضع الراهن يشير إلى هذا. وسمعت بأن هناك رجل أعمال تكلم عن هذا ولكنني لا أتذكر مقولته. هل أنت تتذكرين؟<br>" +
          "<b>ليلى:</b> ----<br>" +
          "<b>فاطمة:</b> هذه مقولة صحيحة مائة بالمائة يا ليلى.<br>",
    
    options: { 
        A: "القول الوجيز هو \"لا تؤجل عمل اليوم إلى الغد\" ولكن أنا لا أوافق هذا القول.", 
        B: "نعم، يعتمد التعليم الذاتي على توفير شتى صور المعرفة بطريقة مبسطة.", 
        C: "نعم، هي \"التعليم الرسمي يمنحك وظيفة، أما التعليم الذاتي فيمنحك ثروة\".", 
        D: "أنا أيضا أتذكر أن هناك رجلا تكلم عن التعليم الرسمي والتعليم الذاتي.", 
        E: "فهو فرصة للأشخاص الطموحين والراغبين في إيجاد مساحة خاصة لهم في العمل." 
    },
    correct: "C",
    explanation: "2025 YDT 44. Soru Çözümü: Diyalogda Fatma, bireysel eğitimle ilgili bir iş adamının sözünü hatırlayamadığını söyler. Leyla'nın cevabından sonra Fatma 'Bu %100 doğru bir söz' diyerek onaylar. C şıkkındaki 'Resmi eğitim sana bir iş sağlar, bireysel eğitim ise servet kazandırır' (Jim Rohn'un ünlü sözü) ifadesi, bir iş adamına ait mantıklı bir özdeyiş olduğu için diyaloğu tam olarak tamamlar."
},
{
    id: 45,
    type: "diyalog",
    text: "<b>الأب:</b> الأنهار مصدر الحياة، نشرب من مياهها ونروي الزرع.<br>" +
          "<b>الأم:</b> علينا أن نحافظ على كل قطرة ماء.<br>" +
          "<b>الأب:</b> ----<br>" +
          "<b>الأم:</b> مثلا، لا نستعمل الماء كثيرا عند غسل اليدين والوجه.<br>",
    
    options: { 
        A: "كيف نستفيد من الماء في الأنهار؟", 
        B: "لماذا نستخدم الماء دائما؟", 
        C: "كيف يمكننا أن نحافظ عليه؟", 
        D: "لماذا نقوم بإهدار الماء دائما؟", 
        E: "لماذا لا نغسل الفواكه بالماء الكثير؟" 
    },
    correct: "C",
    explanation: "2025 YDT 45. Soru Çözümü: Diyalogda baba nehirlerin öneminden, anne ise suyu korumak gerektiğinden bahseder. Boşluktan sonra anne 'Örneğin; ellerimizi ve yüzümüzü yıkarken çok su kullanmayız' diyerek bir yöntem açıklar. Bu açıklama, babanın 'Onu (suyu) nasıl koruyabiliriz?' (كيف يمكننا أن نحافظ عليه؟) sorusuna verilmiş mantıklı bir cevaptır."
},
{
    id: 46,
    type: "diyalog",
    text: "<b>زينب:</b> هل تعرفين شيئا عن \"نزار قباني\"؟<br>" +
          "<b>رشا:</b> نعم، إنه أديب وكاتب ودبلوماسي سوري شهير.<br>" +
          "<b>زينب:</b> ----<br>" +
          "<b>رشا:</b> لا، إنه من خريجي كلية الحقوق بدمشق.<br>" +
          "<b>زينب:</b> صحيح، وعمل مدة في وزارة الخارجية.<br>",
    
    options: { 
        A: "ما اسم الجريدة التي أنشأها؟", 
        B: "هل له مكتبة في القاهرة؟", 
        C: "فهل قرأت من أشعاره شيئا؟", 
        D: "هل هذا يعني أنه درس الأدب؟", 
        E: "ماذا يتناول في أشعاره غالبا؟" 
    },
    correct: "D",
    explanation: "2025 YDT 46. Soru Çözümü: Diyalogda Rasha, Nizar Kabbani'nin ünlü bir 'edebiyatçı ve yazar' (أديب وكاتب) olduğunu söyler. Zeynep'in boş bırakılan yerdeki sorusuna Rasha 'Hayır, o Şam Hukuk Fakültesi mezunudur' (لا، إنه من خريجي كلية الحقوق) diyerek cevap verir. Bir kişinin yazar olduğu söylendikten sonra 'Hayır, hukuk mezunudur' cevabı alınıyorsa, soru 'Peki bu onun edebiyat okuduğu anlamına mı geliyor?' (هل هذا يعني أنه درس الأدب؟) şeklinde olmalıdır."
},
{
    id: 47,
    type: "diyalog",
    text: "<b>الطبيب:</b> ما بها طفلتك الجميلة، مم تشكي؟<br>" +
          "<b>الوالد:</b> حرارتها مرتفعة منذ أمس، أرجو أن تفحصها وتشخص مرضها أيها الطبيب!<br>" +
          "<b>الطبيب:</b> ----<br>" +
          "<b>الوالد:</b> شكرا لك أيها الطبيب، سأعطيها الدواء بانتظام حسب الوصفة.<br>",
    
    options: { 
        A: "حسنا، الطفلة لديها التهاب حاد في الحلق، وهي تحتاج إلى الدواء الذي كتبته في الوصفة.", 
        B: "نحتاج إلى فحوصات طبية لتحديد مشكلة تأخرها في الدراسة ولمعالجتها من هذا المرض.", 
        C: "لا أستطيع أن أفحصها الآن، اذهب بها إلى طبيب آخر ليفحصها وليعرف سبب مرضها.", 
        D: "هل ظهرت عليها أعراض أخرى تستدعي استشارة المدرسين في مدرستها؟", 
        E: "هذا أمر اعتيادي بالنسبة لهذا العمر، إن الطفلة بحالة جيدة ولا تحتاج لأي علاج." 
    },
    correct: "A",
    explanation: "2025 YDT 47. Soru Çözümü: Diyalogda baba, çocuğunun ateşinin yüksek olduğunu söyleyerek muayene edilmesini ister. Boşluktan sonra baba 'Teşekkürler doktor, ilacı reçeteye göre düzenli vereceğim' der. Bu cevap, doktorun bir teşhis koyduğunu ve reçete yazdığını gösterir. A şıkkındaki 'Tamam, çocuğun boğazında şiddetli iltihap var, reçeteye yazdığım ilaca ihtiyacı var' ifadesi bu akışa tam uymaktadır."
},
{
    id: 48,
    type: "diyalog",
    text: "<b>المهندس:</b> تبلغ احتياطيات النحاس في تركيا حوالي ٤ مليون طن من النحاس المعدني.<br>" +
          "<b>المدير:</b> صحيح، ومع ذلك يبلغ مجموع الاحتياطات ١٦ مليون طن.<br>" +
          "<b>المهندس:</b> أما صادرات تركيا من خام النحاس فبلغت ٢٤٠ مليون دولار أمريكي.<br>" +
          "<b>المدير:</b> ----<br>" +
          "<b>المهندس:</b> إنها الصين والسويد والهند.<br>",
    
    options: { 
        A: "هل تعرف مدى استخدام النحاس في الصناعة؟", 
        B: "هل هناك بلدان أخرى تصدر معدن الحديد؟", 
        C: "ما هي الدول التي تنافس تركيا في هذا المجال؟", 
        D: "هل تعمل وزارة التجارة لتوسيع استخدام النحاس؟", 
        E: "أين يوجد معدن النحاس في تركيا؟" 
    },
    correct: "C",
    explanation: "2025 YDT 48. Soru Çözümü: Diyalogda mühendis Türkiye'nin bakır rezervleri ve ihracat rakamlarından bahseder. Boşluktan hemen sonra mühendis 'Onlar; Çin, İsveç ve Hindistan'dır' (إنها الصين والسويد والهند) diyerek ülke isimleri sayar. Bu cevap, öncesinde 'Bu alanda Türkiye ile rekabet eden ülkeler hangileridir?' (ما هي الدول التي تنافس تركيا في هذا المجال؟) gibi bir sorunun sorulduğunu kanıtlar. Bu nedenle doğru cevap C şıkkıdır."
},
{
    id: 49,
    type: "yakin",
    // Yönerge ve ana cümle dikey boşluklarla birlikte:
    text: 
          "<b> توجد الآن في مناطق مختلفة من العالم بعض الحيوانات المهددة بالانقراض.</b>",
    
    options: { 
        A: "هناك كثير من الحيوانات الكبيرة على مستوى العالم آكلة اللحوم دائما.", 
        B: "علينا أن نحافظ على الحيوانات لأن بعضها يكاد أن ينقرض.", 
        C: "كثير من الحيوانات مهددة بالانقراض بسبب الصيد غير الشرعي.", 
        D: "على الإنسان أن لا يعتني بالحيوانات لأن بعضها على وشك أن ينقرض.", 
        E: "حاليا هناك بعض الحيوانات المهددة بالانقراض في أنحاء متفرقة من العالم." 
    },
    correct: "E",
    explanation: "2025 YDT 49. Soru Çözümü: Ana cümlede 'Şu anda dünyanın farklı bölgelerinde nesli tükenme tehlikesiyle karşı karşıya olan bazı hayvanlar bulunmaktadır' denilmektedir. E şıkkındaki 'Şu anda (حاليا), dünyanın çeşitli yerlerinde (أنحاء متفرقة من العالم) nesli tükenme tehlikesi altında olan bazı hayvanlar vardır' cümlesi, ana cümledeki tüm unsurları (zaman, mekan ve durum) eş anlamlı kelimelerle karşılamaktadır. 'مناطق مختلفة' (farklı bölgeler) ifadesi ile 'أنحاء متفرقة' (çeşitli yerler/yönler) ifadesi anlamca örtüşür."
},
// 2025 YDT - 50. Soru (Anlamca En Yakın Cümle):

    {
        id: 50,
        type: "yakin",
        // Ana cümle ve soru kökü dikey boşluklarla:
        text: 
              "<b>تعد الطاقة الشمسية طاقة صديقة للبيئة، إذ إن عملية تحويل الأشعة الشمسية إلى طاقة لا تعد ملوثة للهواء، كما أنها لا تشكل تلوثا ضوضائيا.</b>",
        
        options: { 
            A: "تعتبر الطاقة الشمسية صديقة للبيئة حيث أن عملية تحويل ضوء الشمس إلى طاقة لا تلوث الهواء ولا تحدث تلوثا ضوضائيا.", 
            B: "تعتبر الطاقة الشمسية صديقة للبيئة، فهي لا تلوث الهواء ولكنها تسبب تلوثا ضوضائيا أثناء تحويل أشعة الشمس إلى طاقة.", 
            C: "لكون الطاقة الشمسية صديقة للبيئة، فلا يمكن تلويث الهواء أو إحداث تلوث ضوضائي أثناء تحويل أشعة الشمس إلى طاقة.", 
            D: "باعتبار أن الطاقة الشمسية صديقة للبيئة، فمن غير المتوقع أن تلوث الهواء أو تسبب تلوثا ضوضائيا أثناء عملية تحويل أشعة الشمس إلى طاقة.", 
            E: "الطاقة الأكثر صداقة للبيئة هي الطاقة الشمسية لأن تحويل أشعة الشمس إلى طاقة لا يلوث الهواء ولا يسبب تلوثا ضوضائيا." 
        },
        correct: "A",
        explanation: "2025 YDT 50. Soru Çözümü: Ana cümlede güneş enerjisinin çevre dostu olduğu, çünkü enerjinin dönüşüm sürecinin havayı kirletmediği ve gürültü kirliliği oluşturmadığı belirtilmiştir. A şıkkı, 'تعتبر' (sayılır/kabul edilir) ve 'لا تحدث' (oluşturmaz) gibi eş anlamlı ifadeler kullanarak ana cümleyi birebir karşılamaktadır. B şıkkı gürültü kirliliğine sebep olduğunu söyleyerek, E şıkkı ise 'en dostu' (الأكثر صداقة) diyerek anlamı bozmaktadır."
    },
// 2025 YDT - 51. Soru (Anlamca En Yakın Cümle):

    {
        id: 51,
        type: "yakin",
        text: 
              "<b>يتم إنتاج أكثر من ٤٠٠ مليون طن من البلاستيك في جميع أنحاء العالم كل عام.</b>",
        
        options: { 
            A: "يقارب ما تنتجه دول العالم عالميا ٤٠٠ مليون طن.", 
            B: "ما يُنتج من البلاستيك على مستوى العالم يزيد عن ٤٠٠ مليون طن سنويا.", 
            C: "يقدّر حجم ما يُنتج من المواد البلاستيكية في العالم سنويا بـ ٤٠٠ مليون طن.", 
            D: "من المتوقع أن يتعدى حجم إنتاج البلاستيك في العالم حدود ٤٠٠ مليون طن.", 
            E: "كلما يتم إنتاج البلاستيك على مستوى العالم هذا العام هو ٤٠٠ مليون طن." 
        },


        correct: "B",
        explanation: "2025 YDT 51. Soru Çözümü: Ana cümlede 'Her yıl (كل عام) dünya genelinde 400 milyon tondan fazla (أكثر من) plastik üretilmektedir' denilmektedir. B şıkkında kullanılan 'yıllık' (سنويا) kelimesi 'her yıl' ifadesini, 'fazladır/aşar' (يزيد عن) ifadesi ise 'daha fazla' (أكثر من) kısmını tam olarak karşılar. A şıkkı 'yaklaşır', C şıkkı 'yaklaşık olarak/tahminen o kadar', D şıkkı ise 'beklenmektedir' (gelecek zaman) diyerek anlamı değiştirmektedir."
    },
// 2025 YDT - 52. Soru (Anlamca En Yakın Cümle):

    {
        id: 52,
        type: "yakin",
        // Ana cümle ve soru kökü dikey boşluklarla:
        text:
              "<b> تُعتبر العزلة من المجتمع في الوقت الحاضر من أخطر الأزمات انتشارا بين الشباب.</b>",
        
        options: { 
            A: "العزلة من المجتمع تعد من أخطر الأزمات المنتشرة بين الشباب في وقتنا الجاري.", 
            B: "تعد العزلة من المجتمع أخطر أزمة ظاهرة بين الناس في وقتنا هذا في العالم.", 
            C: "العزلة من المجتمع كانت من أكثر الأزمات انتشارا بين الشباب في الماضي.", 
            D: "إن العزلة من المجتمع تعد أكبر أزمة يواجه الشباب في الأيام الأخيرة.", 
            E: "العزلة من المجتمع منتشرة بين الشباب في جميع أنحاء العالم خاصة في الآونة الأخيرة." 
        },
        correct: "A",
        explanation: "2025 YDT 52. Soru Çözümü: Ana cümlede 'Toplumdan soyutlanma (izolasyon), günümüzde (في الوقت الحاضر) gençler arasında yaygın olan en tehlikeli krizlerden (من أخطر الأزمات) biri sayılır' denilmektedir. A şıkkı; 'günümüz' ifadesi yerine 'şu anki vaktimiz' (وقتنا الجاري) ve 'sayılır' yerine 'tutar/sayılır' (تعد) gibi tam eş anlamlılar kullanarak orijinal anlamı korumuştur. B şıkkı 'gençler' yerine 'insanlar' diyerek, C şıkkı 'geçmişte' diyerek, D ve E şıkları ise 'en tehlikeli kriz' vurgusunu tam karşılamadığı için yanlıştır."
    },
// 2025 YDT - 53. Soru (Anlamca En Yakın Cümle):

    {
        id: 53,
        type: "yakin",
        // Ana cümle ve soru kökü dikey boşluklarla:
        text: 
              "<b>استخدام البطارية القابلة لإعادة الشحن في السيارات أرخص من استخدام الوقود فيها.</b>",
        
        options: { 
            A: "استعمال البطارية القابلة لإعادة الشحن في السيارات يكلف أموالا قليلة مقارنة باستعمال الوقود فيها.", 
            B: "استخدام البطارية القابلة لإعادة الشحن في السيارات أثمن من استعمال الوقود فيها.", 
            C: "استعمال البطارية القابلة لإعادة الشحن في السيارات يزيد أسعار الوقود.", 
            D: "استخدام البطارية الكهربائية في السيارات يجعل التنقل بها أسرع وأرخص.", 
            E: "استعمال الوقود في السيارات أفضل مقارنة باستعمال البطارية القابلة لإعادة الشحن فيها." 
        },
        correct: "A",
        explanation: "2025 YDT 53. Soru Çözümü: Ana cümlede 'Arabalarda şarj edilebilir batarya kullanmak, yakıt kullanmaktan daha ucuzdur (أرخص)' denilmektedir. A şıkkında 'daha ucuz' ifadesi yerine 'yakıt kullanımına kıyasla daha az maliyetlidir (يكلف أموالا قليلة مقارنة بـ)' ifadesi kullanılmıştır. B şıkkı 'daha pahalı', C şıkkı 'yakıt fiyatlarını artırır', D şıkkı 'daha hızlı yapar' ve E şıkkı 'yakıt daha iyidir' diyerek anlamı bozmaktadır."
    },
// 2025 YDT - 54. Soru (Duruma Uygun Sözü Bulma):

    {
        id: 54,
        type: "tamamlama",
        // Yönerge ve durum metni dikey boşluklarla birlikte:
        text: 
              "أنت تلاحظ أن ولدك لا يتعامل مع أقرانه وزملائه في المدرسة، يخالفهم في أمور كثيرة وتجري بينهم نزاعات كل يوم. لا يعجبك هذا الأمر فتريد أن تنصح ولدك ليغيّر مواقفه وأخلاقه، فتقول له: ----",
        
        options: { 
            A: "ليتك كنت أقوى جسما فتتغلب عليهم جميعا.", 
            B: "أفتخر بك يا ولدي، فلا تُطعهم ولا تذل نفسك.", 
            C: "عليك باللين ومجاملة رفقائك بدلا من العنف.", 
            D: "لا تتنازل عن مبادئك ولا تخضع لهم يا بني.", 
            E: "إنما يفوز في هذه الدنيا من هو أقوى وأعز." 
        },
        correct: "C",
        explanation: "2025 YDT 54. Soru Çözümü: Verilen durumda, çocuğun okuldaki arkadaşlarıyla sürekli çatışma içinde olduğu ve babanın bu durumdan hoşlanmayarak ona tavsiyede bulunmak (تنصح ولدك) istediği belirtilmiştir. C şıkkındaki 'Şiddet yerine arkadaşlarına karşı yumuşak huylu ve nazik olmalısın' (عليك باللين ومجاملة رفقائك بدلا من العنف) ifadesi, bu duruma en uygun yapıcı tavsiyedir. Diğer şıklar daha çok kavgayı veya uzlaşmazlığı teşvik eden ifadeler içerir."
    },
// 2025 YDT - 55. Soru (Duruma Uygun Sözü Bulma):

    {
        id: 55,
        type: "tamamlama",
        // Durum metni ve soru kökü dikey boşluklarla:
        text: 
              "حفلة زفاف صديقك الحميم بعد يومين ولكن عليك السفر إلى الكويت لتشارك في اجتماع مهم للشركة، وأنت تريد الاعتذار منه لعدم حضورك حفلة زفافه فتقول له: ----",
        
        options: { 
            A: "ألف مبروك يا صديقي، آمل أن لا تندم لأنك تزوجت من هذه الفتاة.", 
            B: "أنا سأكون أول من يحضر حفلة زفافك فأنت أعز وأفضل صديق عندي.", 
            C: "آسف يا صديقي، لن أستطيع الحضور بسبب اضطراري إلى السفر للمشاركة في اجتماع مهم.", 
            D: "لا عليك يا صديقي، فأنت لن تتزوج دون أخذ رأيي وموافقتي بالطبع فأنا أعز صديق عندك.", 
            E: "آسف ولكني لن أحضر حفلة زفافك لأن زوجتي لا تريد الحضور ولا تحبك أنت أيضا." 
        },
        correct: "C",
        explanation: "2025 YDT 55. Soru Çözümü: Verilen senaryoda en yakın arkadaşınızın iki gün sonra düğünü vardır ancak şirket toplantısı için Kuveyt'e gitmeniz gerekmektedir. Arkadaşınızdan düğüne katılamayacağınız için özür dilemeniz (تريد الاعتذار منه) istenmektedir. C şıkkındaki 'Üzgünüm dostum, önemli bir toplantıya katılmak için seyahat etmek zorunda olduğumdan dolayı katılamayacağım' ifadesi, durumun tüm gerekçelerini içeren en kibar ve uygun özür cümlesidir."
    },
// 2025 YDT - 56. Soru (Duruma Uygun Sözü Bulma):

    {
        id: 56,
        type: "tamamlama",
        // Durum metni ve soru kökü dikey boşluklarla:
        text: 
              "كنت في ضيافة رسمية وعندما أحضر النادل الحساء لك انسكب على ملابسك فاعتذر منك، وأنت لا تريد أن تحرجه. فتقول له: ----",
        
        options: { 
            A: "أنظر أمامك عند إحضار الوجبات يا رجل!", 
            B: "ماذا فعلت، ما بك لماذا قمت بهذا التصرف؟", 
            C: "ليست مشكلة، لا تحزن وأنا أقبل اعتذارك.", 
            D: "كان يجب عليك أن تنتبه لعملك أكثر.", 
            E: "ما بك، لم لا تحرص على القيام بعملك؟" 
        },
        correct: "C",
        explanation: "2025 YDT 56. Soru Çözümü: Verilen senaryoda resmi bir davettesiniz ve garson çorbayı üzerinize döktüğünde sizden özür diliyor. Sizin amacınız ise onu utandırmamak/zor durumda bırakmamaktır (لا تريد أن تحرجه). C şıkkındaki 'Sorun değil, üzülme; özrünü kabul ediyorum' (ليست مشكلة، لا تحزن وأنا أقبل اعتذارك) ifadesi, garsonu rahatlatacak ve mahcubiyetini giderecek en uygun kibar cevaptır. Diğer şıklar (A, B, D, E) garsonu azarlayan veya suçlayan ifadeler içerdiği için durumla çelişmektedir."
    },
// 2025 YDT - 57. Soru (Duruma Uygun Sözü Bulma):

    {
        id: 57,
        type: "tamamlama",
        // Durum metni ve soru kökü dikey boşluklarla:
        text:
              "أخوك الصغير يشاهد التلفاز كثيرا حتى وقت متأخر من الليل. أنت تقلق على صحة أخيك فتقول له: ----",
        
        options: { 
            A: "صحة الإنسان تعتمد على ما يتناوله من الأطعمة المفيدة.", 
            B: "يبث التلفاز برامج متعددة ومسلية، خاصة برامج الأطفال.", 
            C: "التلفاز جهاز كهربائي حديث الصنع ولا يخلو بيت منه.", 
            D: "مشاهدة التلفاز لساعات طويلة تضر بالعينين كثيرا.", 
            E: "يا أخي، أمي تدعونا إلى الطعام هيا نذهب إلى المطبخ." 
        },
        correct: "D",
        explanation: "2025 YDT 57. Soru Çözümü: Verilen durumda küçük kardeşinizin gece geç saatlere kadar çok fazla televizyon izlediği ve sizin onun sağlığı için endişelendiğiniz (تقلق على صحة أخيك) belirtilmiştir. D şıkkındaki 'Televizyonu uzun saatler izlemek gözlere çok zarar verir' (مشاهدة التلفاز لساعات طويلة تضر بالعينين كثيرا) ifadesi, kardeşinizin sağlığıyla ilgili doğrudan bir uyarı niteliği taşıdığı için bu duruma en uygun sözdür. A şıkkı beslenmeden, B şıkkı programların eğlencesinden, C şıkkı cihazın yaygınlığından bahsettiği için sağlık endişesini karşılamaz."
    },
// 2025 YDT - 58. Soru (Duruma Uygun Sözü Bulma):

    {
        id: 58,
        type: "tamamlama",
        // Durum metni ve soru kökü dikey boşluklarla:
        text: 
              "طلب منك أحد أصدقائك أن يستعير حاسوبك اللوحي لعدة أيام وأنت لا تريد إعارته الحاسوب اللوحي، دون أن تحرجه فتقول له: ----",
        
        options: { 
            A: "لماذا تريد حاسوبي اللوحي يا أحمد فهل حاسوبك معطل؟", 
            B: "أنا آسف، ولكنني بحاجة إليه كثيرا في عملي في هذه الأيام.", 
            C: "لا أريد إعارتك فاذهب واطلب هذا من غيري.", 
            D: "لقد أعرتك حاسبي في الأسبوع الماضي ولم ترجعه في الوقت.", 
            E: "لو أنت بحاجة لحاسوب لوحي لماذا لا تشتري واحدا؟" 
        },
        correct: "B",
        explanation: "2025 YDT 58. Soru Çözümü: Verilen senaryoda bir arkadaşınız tabletinizi (حاسوبك اللوحي) birkaç günlüğüne ödünç istemektedir. Siz ise onu utandırmadan (دون أن تحرجه) bu isteği reddetmek istiyorsunuz. B şıkkındaki 'Üzgünüm ama bugünlerde işimde ona çok ihtiyacım var' (أنا آسف، ولكنني بحاجة إليه كثيرا في عملي) ifadesi, geçerli bir mazeret sunarak karşı tarafı kırmadan isteği geri çeviren en nazik seçenektir. Diğer şıklar ya hesap sorucu (A), ya kaba (C, E) ya da suçlayıcı (D) ifadeler içermektedir."
    },
// 2025 YDT - 59. Soru (Paragrafta Anlam Bütünlüğünü Sağlama):

    {
        id: 59,
        type: "tamamlama",
        // Yönerge ve metin dikey düzenleme kurallarına göre:
        text: 
              "التركمان شعب تركي الأصل يقطن معظمه مناطق آسيا الوسطى كما يعيش فرع منهم في بعض أنحاء الشرق الأوسط والأناضول. ويبدو أن اسم التركمان أطلق في بادئ الأمر على الأتراك الذين اعتنقوا الإسلام، ---- ويذكر ابن كثير في كتابه، المؤرخ الشهير، مثلا أنه أسلم في سنة ٣٤٩ الهجرية مئتا ألف خيمة من الترك.",
        
        options: { 
            A: "لقد ورد في معظم المصادر التاريخية.", 
            B: "ولم يظهر هذا الاسم في الوثائق القديمة.", 
            C: "إلا أن المؤرخين يختلفون في عدد أمرائهم.", 
            D: "وكان لكل قبيلة منهم مقدم يديرها.", 
            E: "واستمر اسم التركمان حيا حتى وقتنا الحاضر." 
        },
        correct: "E",
        explanation: "2025 YDT 59. Soru Çözümü: Paragrafta Türkmenlerin kökeninden ve bu ismin başlangıçta İslam'ı kabul eden Türklere verildiğinden bahsedilmektedir. Boşluktan sonra ünlü tarihçi İbn Kesir'in hicri 349 yılında 200 bin Türk çadırının İslam'a girdiği örneği verilerek tarihsel süreç desteklenmektedir. Boşluğa gelecek ifade, ismin kullanımının sürekliliğini veya yaygınlığını pekiştirmelidir. E şıkkındaki 'Türkmen ismi günümüze kadar canlı bir şekilde devam etmiştir' (واستمر اسم التركمان حيا حتى وقتنا الحاضر) ifadesi, ismin kökeninden başlayıp tarihsel örneklerle devam eden anlatımı günümüze bağlayarak anlam bütünlüğünü sağlar."
    },
// 2025 YDT - 60. Soru (Paragrafta Anlam Bütünlüğünü Sağlama):

    {
        id: 60,
        type: "tamamlama",
        // Metin ve boşluk dikey boşluklarla:
        text: 
              "ترجع بداية ظهور مجال الذكاء الاصطناعي إلى خمسينيات القرن الماضي؛ حيث عمل مجموعة من العلماء على تطوير آلات ذكية مستقبلية تحاكي الذكاء الطبيعي لدى البشر والحيوانات. ---- ويتم عن طريق محاكاة الوظائف المعرفية للعقل البشري في وقتنا الراهن مثل حل المسائل اليومية ونحن في البعيد.",
        
        options: { 
            A: "وهم ما كانوا يظنون أن الذكاء الاصطناعي ستقلل فرص الأعمال لبعض الرجال،", 
            B: "فكان هدفهم الوصول إلى حل المشكلات التي تواجه الأطباء،", 
            C: "وأصبح الذكاء الاصطناعي أمرا حقيقيا نراه في منازلنا وأماكن عملنا،", 
            D: "حلت الأجهزة الكهربائية الحديثة مشكلة الإحساس الدائم بعدم وجود وقت كاف للعمل،", 
            E: "قد يخاف البعض أن يؤدي تمكين الذكاء الاصطناعي إلى ثورة الروبوتات لدى البشر،" 
        },
        correct: "C",
        explanation: "2025 YDT 60. Soru Çözümü: Paragraf, yapay zekanın (الذكاء الاصطناعي) 1950'lerdeki başlangıcından ve bilim insanlarının insan/hayvan zekasını taklit eden makineler geliştirme çabalarından bahsetmektedir. Boşluktan sonra ise bu teknolojinin günümüzde (في وقتنا الراهن) insan zihninin bilişsel işlevlerini taklit ederek günlük sorunları çözdüğü anlatılmaktadır. Boşluğa gelecek cümle, geçmişteki hedeflerle günümüzdeki uygulama arasındaki köprüyü kurmalıdır. C şıkkındaki 'Yapay zeka evlerimizde ve iş yerlerimizde gördüğümüz gerçek bir olgu haline geldi' (وأصبح الذكاء الاصطناعي أمرا حقيقيا نراه في منازلنا وأماكن عملنا) ifadesi, teknolojinin hayalden gerçeğe dönüşümünü vurgulayarak akışı tamamlar."
    },
// 2025 YDT - 61. Soru (Paragrafta Anlam Bütünlüğünü Sağlama):

    {
        id: 61,
        type: "tamamlama",
        // Metin ve boşluk dikey boşluklarla:
        text: 
              "لم يكن الإنسان في الأزمنة الماضية يستطيع الوصول إلى القمر أو معرفة أخبار العالم، ---- فالعلم فوائده عظيمة لكل البشر على مدى الأزمان وهو يتطور باستمرار مع تطور الحضارات على الكرة الأرضية.",
        
        options: { 
            A: "ولكن بعض الناس لا يستفيدون من دروس الماضي.", 
            B: "لأن الوصول إلى المريخ كان يستغرق مدة طويلة.", 
            C: "أما التعلم فإنه يؤدي إلى التعديل في السلوك والأداء.", 
            D: "أما الآن فإن وسائل العلم الحديثة قد قربت كل بعيد.", 
            E: "ويمكن تحقيق ذلك من خلال التجارب الصعبة." 
        },
        correct: "D",
        explanation: "2025 YDT 61. Soru Çözümü: Paragrafın girişinde geçmişteki insanın (في الأزمنة الماضية) aya ulaşamadığı veya dünya haberlerini bilemediği belirtilerek bir kısıtlılıktan bahsedilmiştir. Boşluktan sonra ise bilimin tüm insanlık için harika faydaları olduğu ve sürekli geliştiği vurgulanmaktadır. Boşluğa, geçmişteki bu kısıtlılığın günümüzde bilim sayesinde aşıldığını belirten bir 'zaman zıtlığı' (geçmiş vs. günümüz) cümlesi gelmelidir. D şıkkındaki 'Şimdi ise modern bilim araçları her uzağı yakınlaştırdı' (أما الآن فإن وسائل العلم الحديثة قد قربت كل بعيد) ifadesi, 'uzaktaki aya ulaşamama' ve 'haber alamama' sorununa modern bir çözüm sunarak paragrafın anlam akışını tamamlar."
    },
// 2025 YDT - 62. Soru (Paragrafta Anlam Bütünlüğünü Sağlama):

    {
        id: 62,
        type: "tamamlama",
        // Metin ve boşluk dikey boşluklarla:
        text: 
              "\"ما قبل التاريخ\" مصطلح يطلق على العصور التي سبقت معرفة الإنسان للكتابة، ويسميها البعض العصور الحجرية. ---- فيعتمد على علم الأنثروبولوجيا في دراسة ظهور الإنسان الأول وصفاته الفزيولوجية وتطوره وعلاقة مختلف الأنواع البشرية بعضها ببعض، كما يساعد علم الباليونتولوجيا على معرفة البيئة القديمة.",
        
        options: { 
            A: "أي، بعد ظهور الإنسان الأول وتناسله وتكاثره،", 
            B: "لأن فترة \"ما بعد التاريخ\" فإنها تبدأ بعد انتشار الكتابة،", 
            C: "أما الآلات والأواني كانت تُصنع من الأحجار،", 
            D: "وللبريطانيين فضل في ابتكار هذا العلم وتطويره،", 
            E: "ويستعين علم ما قبل التاريخ بكثير من العلوم الأخرى،" 
        },
        correct: "E",
        explanation: "2025 YDT 62. Soru Çözümü: Paragrafta 'Tarih Öncesi' (ما قبل التاريخ) teriminin tanımı yapılmakta ve bu dönemin yazının icadından önceki zamanları kapsadığı belirtilmektedir. Boşluktan hemen sonra gelen cümlelerde ise bu dönemin incelenmesinde antropoloji (علم الأنثروبولوجيا) ve paleontoloji (علم الباليونتولوجيا) gibi bilim dallarından nasıl faydalanıldığı detaylandırılmaktadır. Boşluğa gelecek en uygun ifade, bu bilimsel iş birliğini genel bir yargıyla başlatan E şıkkındaki 'Tarih öncesi bilimi diğer pek çok bilim dalından yardım alır' (ويستعين علم ما قبل التاريخ بكثير من العلوم الأخرى) cümlesidir. Bu seçenek, sonrasında gelen antropoloji ve paleontoloji örnekleri için mükemmel bir giriş niteliğindedir."
    },
// 2025 YDT - 63. Soru (Paragrafta Anlam Bütünlüğünü Sağlama):

    {
        id: 63,
        type: "tamamlama",
        // Metin ve boşluk dikey boşluklarla:
        text: 
              "الألوان الزيتية تعد من الألوان الأكثر انتشارا في مجال التصوير، ---- أولهما الأسلوب المباشر وهو قديم اعتمد عليه بعض الفنانين، والثاني الأسلوب التخطيطي الذي يتطرق له المعلمون بشيء من التفصيل ويُنفذ في مهارات الدرس.",
        
        options: { 
            A: "وأنها تأخذ وقتا كبيرا في عملية الجفاف بعد التصوير،", 
            B: "أغلب فرش الرسم الزيتي مصنوعة من شعر البقر والحصان،", 
            C: "ظهر فن الرسم بألوان الزيت مع ظهور المدرسة الفلامندية،", 
            D: "وهناك أسلوبان في التلوين بألوان الزيت في التصوير،", 
            E: "ولها أيضا عدة أنواع وهي من الخشب أو البلاستيك،" 
        },
        correct: "D",
        explanation: "2025 YDT 63. Soru Çözümü: Paragrafta yağlı boyaların (الألوان الزيتية) resim alanında en yaygın kullanılan boyalar olduğu belirtilmektedir. Boşluktan hemen sonra 'birincisi doğrudan üslup' (أولهما الأسلوب المباشر) ve 'ikincisi taslak/planlı üslup' (والثاني الأسلوب التخطيطي) ifadeleriyle bir sınıflandırma yapılmaktadır. Bu tür ikili bir sayımın (birincisi... ikincisi...) öncüsü olarak boşluğa 'iki yöntem/üslup vardır' diyen bir ifadenin gelmesi gerekir. D şıkkındaki 'Resimde yağlı boya ile renklendirmede iki üslup vardır' (وهناك أسلوبان في التلوين بألوان الزيت في التصوير) cümlesi, sonrasında gelen detaylı açıklamaya tam bir giriş oluşturur."
    },
// 2025 YDT - 64. Soru (Çeviri):
    {
        id: 64,
        type: "ceviri",
        text: 
              "منظمة الأمم المتحدة، التي تأسست سنة ١٩٤٥ بعد توقيع إحدى وخمسين دولة ولها عدة أجهزة فرعية، لقد حلت محل عصبة الأمم.",
        options: { 
            A: "Milletler Cemiyetinin bugünkü devamı niteliğinde olan elli bir üyeli Birleşmiş Milletler, 1945 yılında kurulmuştur.", 
            B: "Elli bir ülkenin imzasıyla 1945 yılında kurulan ve çok sayıda alt kuruluşu olan Birleşmiş Milletler, Milletler Cemiyetinin yerini almıştır.", 
            C: "1945 yılında kurulan Birleşmiş Milletler, çok sayıda ülkenin üyesi olduğu elli bir alt kuruluşa sahiptir ve Milletler Cemiyetinin yerini almıştır.", 
            D: "Elli bir üye ülkenin imzasıyla kurulan ve 1945 yılında Milletler Cemiyetinin yerini alan Birleşmiş Milletler, çok sayıda alt kuruluşa sahiptir.", 
            E: "Çok sayıda alt kuruluşu olan Milletler Cemiyetinin yerini alan Birleşmiş Milletler, elli bir ülkenin imzasıyla 1945 yılında kurulmuştur." 
        },
        correct: "B",
        explanation: "Cümledeki ana unsurlar: 1945'te kuruluş, 51 ülkenin imzası (توقيع إحدى وخمسين دولة), alt kuruluşlar (أجهزة فرعية) ve Milletler Cemiyeti'nin yerini alma (حلت محل عصبة الأمم). B seçeneği tüm bu öğeleri doğru şekilde karşılamaktadır."
    },
// 2025 YDT - 65. Soru (Arapça'dan Türkçe'ye Çeviri):

    {
        id: 65,
        type: "ceviri",
        // Arapça cümle ve Türkçe seçenekler dikey boşluklarla:
        text: 
              "الحليب الحيواني أغنى من الحليب النباتي، خاصة من ناحية البروتين والكالسيوم.",
        
        options: { 
            A: "Hayvansal sütler, özellikle protein ve kalsiyum bakımından bitkisel sütlerden daha zengindir.", 
            B: "Özellikle protein ve kalsiyum bakımından zengin olan hayvansal sütler, bitkisel sütlerden daha yararlıdır.", 
            C: "Hayvansal sütler, bitkisel sütlerle kıyaslandığında protein ve özellikle de kalsiyum bakımından daha zengindir.", 
            D: "Protein ve kalsiyum bakımından zengin olan hayvansal sütler, bitkisel sütlere kıyasla daha faydalıdır.", 
            E: "Hayvansal sütler, kalsiyum ve özellikle de protein bakımından bitkisel sütlerden daha faydalıdır." 
        },
        correct: "A",
        explanation: "2025 YDT 65. Soru Çözümü: Cümledeki temel öğeler; hayvansal süt (الحليب الحيواني), bitkisel süt (الحليب النباتي), daha zengindir (أغنى من) ve özellikle protein ve kalsiyum bakımından (خاصة من ناحية البروتين والكالسيوم) şeklindedir. A seçeneği, hiçbir ek yorum katmadan bu kelimelerin tam karşılığını vererek anlam bütünlüğünü en doğru şekilde sağlamaktadır."
    },
// 2025 YDT - 66. Soru (Arapça'dan Türkçe'ye Çeviri):

    {
        id: 66,
        type: "ceviri",
        // Arapça cümle ve Türkçe seçenekler dikey boşluklarla:
        text: 
              "يعرّف الاتحاد الفلكي العالمي النيزك بأنه جسم صلب، صغير الحجم، يسبح بين الكواكب في المجموعة الشمسية.",
        
        options: { 
            A: "Uluslararası Astronomi Birliği, gezegenler arasında yüzen meteorları, Güneş sisteminin en küçük sert cisimleri olarak tanımlamaktadır.", 
            B: "Uluslararası Astronomi Birliği; Güneş sistemindeki gezegenler arasında yüzen küçük hacimli sert cisimleri, meteor olarak tanımlamaktadır.", 
            C: "Güneş sistemi içinde gezegenler arasında yüzen meteor, Uluslararası Astronomi Birliğinin tanımına göre sert cisimlerin en küçüğüdür.", 
            D: "Uluslararası Astronomi Birliği; meteoru, Güneş sistemi içinde gezegenler arasında yüzen küçük hacimli sert bir cisim olarak tanımlamaktadır.", 
            E: "Sert bir yapıda olan meteorlar, Uluslararası Astronomi Birliğine göre Güneş sistemi içinde yüzen küçük hacimli cisimlerdir." 
        },
        correct: "D",
        explanation: "2025 YDT 66. Soru Çözümü: Arapça cümlede ana yapı '... tanımlar' (يعرّف ... بـ) şeklindedir. Cümlenin öğeleri; Uluslararası Astronomi Birliği (الاتحاد الفلكي العالمي), meteor (النيزك), sert bir cisim (جسم صلب), küçük hacimli (صغير الحجم) ve Güneş sistemi içinde gezegenler arasında yüzen (يسبح بين الكواكب في المجموعة الشمسية) olarak verilmiştir. D seçeneği, tüm bu öğeleri dil bilgisi yapısına ve orijinal anlam bütünlüğüne sadık kalarak tam karşılayan tek şıktır."
    },
// 2025 YDT - 67. Soru (Arapça'dan Türkçe'ye Çeviri):

    {
        id: 67,
        type: "ceviri",
        // Arapça cümle ve Türkçe seçenekler dikey boşluklarla:
        text: 
              "الحرف اليدوية التي تعتبر عنصرا هاما للثقافة الشعبية، تلعب دورا كبيرا في الحفاظ على القيم الثقافية وإحيائها.",
        
        options: { 
            A: "Kültürel değerlerin korunması ve yaşatılmasında büyük rol oynayan el sanatları, halk kültürünün önemli bir ögesi kabul edilmektedir.", 
            B: "Halk kültürünün önemli bir ögesi sayılan el sanatları, kültürel değerlerin korunması ve yaşatılmasında büyük bir rol oynamaktadır.", 
            C: "Kültürel değerlerin korunması ve yaşatılmasına katkı sağlayan el sanatları aynı zamanda halk kültürünün önemli bir ögesidir.", 
            D: "El sanatları, kültürel değerlerin korunması ve yaşatılmasında büyük bir rol oynamakla beraber halk kültürünün önemli bir ögesi de sayılmaktadır.", 
            E: "Halk kültürünün ögelerinden biri sayılan el sanatları, kültürel değerlerin korunması ve yaşatılmasında önemli bir rol oynamaktadır." 
        },
        correct: "B",
        explanation: "2025 YDT 67. Soru Çözümü: Arapça cümlede ana yapı 'El sanatları ... büyük bir rol oynamaktadır' (الحرف اليدوية ... تلعب دورا كبيرا) şeklindedir. 'Halk kültürünün önemli bir ögesi sayılan/kabul edilen' (تعتبر عنصرا هاما للثقافة الشعبية) kısmı el sanatlarını niteleyen bir ara cümledir. 'Kültürel değerlerin korunması ve yaşatılması' (الحفاظ على القيم الثقافية وإحيائها) ifadesi ise bu rolün amacını belirtir. B seçeneği, yüklem ve niteleme gruplarının yerleşimi bakımından orijinal cümlenin yapısına en yakın ve tam karşılığıdır."
    },
// 2025 YDT - 68. Soru (Arapça'dan Türkçe'ye Çeviri):

    {
        id: 68,
        type: "ceviri",
        // Arapça cümle ve Türkçe seçenekler dikey boşluklarla:
        text: 
              "إن جهود الحماية في تركيا للسلاحف البحرية المعروفة باسم كاريتا كاريتا، بدأت تؤتي ثمارها وإن أعدادها في العالم قد أخذت في الازدياد.",
        
        options: { 
            A: "Caretta Caretta olarak bilinen deniz kaplumbağalarını dünyadaki koruma çabaları sonuç vermeye ve bu kaplumbağaların Türkiye'deki sayıları artmaya başlamıştır.", 
            B: "Caretta Caretta olarak bilinen deniz kaplumbağalarını Türkiye'deki koruma çabaları sonuç vermeye başlamış ve bu kaplumbağaların dünyadaki sayıları giderek artmıştır.", 
            C: "Dünyadaki deniz kaplumbağalarını koruma çabaları sonuç vermeye başlamış ve Türkiye'de Caretta Caretta olarak bilinen bu kaplumbağaların sayıları giderek artmıştır.", 
            D: "Türkiye'de deniz kaplumbağaları olarak bilinen Caretta Carettaları koruma çabalarının sonuç vermesiyle birlikte bu kaplumbağaların dünyadaki sayıları giderek artmaktadır.", 
            E: "Türkiye'deki koruma çabaları sonuç vermeye başlayan ve sayıları giderek artan deniz kaplumbağaları, dünyada Caretta Caretta olarak bilinmektedir." 
        },
        correct: "B",
        explanation: "2025 YDT 68. Soru Çözümü: Arapça cümlede iki ana yargı 've' (و) bağlacı ile birbirine bağlanmıştır. İlk yargı: 'Caretta Caretta olarak bilinen deniz kaplumbağalarını Türkiye'deki koruma çabaları sonuç vermeye başlamış' (جهود الحماية في تركيا للسلاحف البحرية المعروفة باسم كاريتا كاريتا، بدأت تؤتي ثمارها). İkinci yargı: 'Dünyadaki sayıları giderek artmıştır' (وإن أعدادها في العالم قد أخذت في الازدياد). B seçeneği, hem öznelerin yerini (Türkiye'deki çabalar / dünyadaki sayılar) hem de eylemlerin zamanını tam olarak karşılamaktadır."
    },
// 2025 YDT - 69. Soru (Arapça'dan Türkçe'ye Çeviri):

    {
        id: 69,
        type: "ceviri",
        // Arapça cümle ve Türkçe seçenekler dikey boşluklarla:
        text: 
              "القصيدة المسماة \"المقصورة\" لابن دريد، الذي توفي في القرن العاشر وله معجم ومؤلفات كثيرة، لاقت شهرة واسعة في يومنا هذا.",
        
        options: { 
            A: "Günümüzde el-Maksûra adlı ünlü kasidesinin yanı sıra bir sözlüğü ve çok sayıda eseri ile şöhret kazanmış olan İbn Dureyd, X. yüzyılda vefat etmiştir.", 
            B: "X. yüzyılda vefat eden ve bir sözlüğü ile çok sayıda eseri olan İbn Dureyd'in el-Maksûra adlı kasidesi günümüzde büyük bir şöhret kazanmıştır.", 
            C: "X. yüzyılda vefat eden ve günümüzde çok sayıda sözlüğü ile eseri bulunan İbn Dureyd, el-Maksûra adlı kasidesiyle şöhret kazanmıştır.", 
            D: "el-Maksûra adlı kasidesiyle günümüzde büyük bir şöhret kazanan İbn Dureyd, çok sayıda sözlük ve eser sahibi olup X. yüzyılda vefat etmiştir.", 
            E: "Çok sayıda eseri ile sözlüğü bulunan ve X. yüzyılda vefat eden İbn Dureyd, el-Maksûra adlı kasidesi sayesinde günümüzde büyük bir şöhret kazanmıştır." 
        },
        correct: "B",
        explanation: "2025 YDT 69. Soru Çözümü: Arapça cümlede ana özne İbn Dureyd'in 'el-Maksûra' adlı kasidesidir (القصيدة المسماة المقصورة لابن دريد). Cümlenin yüklemi ise bu kasidenin günümüzde büyük bir şöhret kazandığıdır (لاقت شهرة واسعة في يومنا هذا). İbn Dureyd'in X. yüzyılda vefat etmesi ve eser sahibi olması onu niteleyen yan bilgilerdir. B seçeneği, kasideyi özne yaparak ve 'günümüzde büyük bir şöhret kazanmıştır' yüklemiyle bitirerek orijinal cümlenin vurgusunu ve yapısını tam olarak yansıtmaktadır."
    },
// 2025 YDT - 70. Soru (Türkçe'den Arapça'ya Çeviri):

    {
        id: 70,
        type: "ceviri",
        // Türkçe cümle ve Arapça seçenekler dikey boşluklarla:
        text: 
              "Sahra çalısı, bulunduğu zor koşullara rağmen yaşamını sürdürebilen ender bir bitkidir.",
        
        options: { 
            A: "إن شجيرة الصحراء على الرغم من أنها نبتة نادرة فهي تديم حياتها في الظروف الصعبة.", 
            B: "إن شجيرة الصحراء النادرة نبتة قادرة على إدامة حياتها على الرغم من الظروف الصعبة الموجودة.", 
            C: "تقدر شجيرة الصحراء النادرة على مواجهة الظروف الصعبة ولذلك تديم حياتها.", 
            D: "إن شجيرة الصحراء نبتة نادرة تقدر على إدامة حياتها على الرغم من الظروف الصعبة الموجودة فيها.", 
            E: "إن شجيرة الصحراء نبتة تديم حياتها على الرغم من الظروف الصعبة النادرة." 
        },
        correct: "D",
        explanation: "2025 YDT 70. Soru Çözümü: Cümlenin ana unsurları; Sahra çalısı (شجيرة الصحراء), ender bir bitkidir (نبتة نادرة), yaşamını sürdürebilen/gücü yeten (تقدر على إدامة حياتها) ve zor koşullara rağmen (على الرغم من الظروف الصعبة) şeklindedir. D seçeneği, 'ender bir bitki' vurgusunu doğru yerde kullanarak ve cümlenin diğer tüm bileşenlerini anlam kaymasına uğratmadan Arapça'ya çeviren en isabetli şıktır."
    },
// 2025 YDT - 71. Soru (Türkçe'den Arapça'ya Çeviri):

    {
        id: 71,
        type: "ceviri",
        // Türkçe cümle ve Arapça seçenekler dikey boşluklarla:
        text: 
              "Balinalar; derisi kaygan, iri gövdeli, uzunluğu 20 metreye, ağırlığı da 200 tona ulaşan ve kutup denizlerinde yaşayan memeli hayvanlardır.",
        
        options: { 
            A: "الحيتان حيوانات ثديية، جلدها أملس وجثتها ضخمة، تكثر في البحار القطبية، طولها عشرون مترا ووزنها ٢٠٠ طن.", 
            B: "الحيتان من فصيلة الحيوانات ذوات الثدي، ملساء الجلد، عظيمة الجسم، طولها عشرون مترا ووزنها ٢٠٠ طن.", 
            C: "قد يبلغ طول الحوت، وهو حيوان ثديي أملس الجلد، كبير الجثة، يعيش في البحار القطبية، ووزنها ٢٠٠ طن، عشرين مترا في المتوسط.", 
            D: "تعيش الحيتان في البحار القطبية، يكون جلدها أملس وجثتها ضخمة، ويبلغ طولها عشرين مترا ووزنها ٢٠٠ طن.", 
            E: "الحيتان حيوانات ثديية، ملساء الجلد، ضخمة الجثة، يبلغ طولها عشرين مترا ووزنها ٢٠٠ طن، وتعيش في البحار القطبية." 
        },
        correct: "E",
        explanation: "2025 YDT 71. Soru Çözümü: Cümledeki tüm öğelerin (memeli olmaları, deri ve gövde özellikleri, uzunluk/ağırlık verileri ve yaşam alanı) eksiksiz ve doğru dil bilgisi yapısıyla verildiği şık E seçeneğidir. <br><br> " +
                     "**Öğelerin Karşılıkları:** <br>" +
                     "* Balinalar memeli hayvanlardır: الحيتان حيوانات ثديية <br>" +
                     "* Derisi kaygan: ملساء الجلد <br>" +
                     "* İri gövdeli: ضخمة الجثة <br>" +
                     "* Uzunluğu 20 metreye, ağırlığı 200 tona ulaşan: يبلغ طولها عشرين مترا ووزنها ٢٠٠ طن <br>" +
                     "* Kutup denizlerinde yaşayan: وتعيش في البحار القطبية"
    },
// 2025 YDT - 72. Soru (Türkçe'den Arapça'ya Çeviri):

    {
        id: 72,
        type: "ceviri",
        // Türkçe cümle ve Arapça seçenekler dikey boşluklarla:
        text: 
              "Hızlı nüfus artışı, yaşam standardının yükseltilmesi ve özellikle fosil yakıtların aşırı kullanımı gibi insan faaliyetleri; küresel ısınmanın etkilerini artıran olaylardır.",
        
        options: { 
            A: "الأنشطة البشرية، مثل النمو السكاني السريع ورفع مستوى المعيشة وخاصة الاستخدام المفرط للوقود الأحفوري، أحداث تزيد من تأثير الاحتباس الحراري.", 
            B: "آثار الاحتباس الحراري ناجمة عن زيادة الأنشطة البشرية مثل النمو السكاني السريع ورفع مستوى المعيشة وخاصة الاستخدام المفرط للوقود الأحفوري.", 
            C: "تزيد الأنشطة البشرية مثل النمو السكاني السريع ورفع مستوى المعيشة ولاسيما الاستخدام المفرط للوقود الأحفوري من تأثير الاحتباس الحراري.", 
            D: "الأنشطة البشرية المكثفة أحداث تزيد آثار الاحتباس الحراري من النمو السكاني السريع والاستخدام المفرط للوقود الأحفوري ورفع مستوى المعيشة بشكل خاص.", 
            E: "تأثير الاحتباس الحراري قد يزيد بسبب الأنشطة البشرية مثل النمو السكاني السريع ورفع مستوى المعيشة وخاصة الاستخدام المفرط للوقود الأحفوري." 
        },
        correct: "A",
        explanation: "2025 YDT 72. Soru Çözümü: Cümledeki ana yargı 'İnsan faaliyetleri ... olaylardır' (الأنشطة البشرية ... أحداث) şeklindedir. <br><br> " +
                     "**Öğelerin Karşılıkları:** <br>" +
                     "* Hızlı nüfus artışı: النمو السكاني السريع <br>" +
                     "* Yaşam standardının yükseltilmesi: رفع مستوى المعيشة <br>" +
                     "* Fosil yakıtların aşırı kullanımı: الاستخدام المفرط للوقود الأحفوري <br>" +
                     "* Küresel ısınmanın etkilerini artıran: تزيد من تأثير الاحتباس الحراري <br><br> " +
                     "A seçeneği, 'insan faaliyetleri' öznesini 'olaylar' (أحداث) yüklemiyle doğru bağlayan ve tüm örneklemeleri orijinal sırasıyla veren tek şıktır."
    },
// 2025 YDT - 73. Soru (Türkçe'den Arapça'ya Çeviri):

    {
        id: 73,
        type: "ceviri",
        // Türkçe cümle ve Arapça seçenekler dikey boşluklarla:
        text: 
              "Emevi Dönemi'ndeki İslam reformu sadece kültürel etkinliklerle sınırlı kalmamış, bu etkinliklere imar faaliyetleri de eşlik etmiştir.",
        
        options: { 
            A: "لم تقتصر النهضة الإسلامية في العصر الأموي على النشاطات الثقافية، بل رافقتها فعاليات عمرانية أيضا.", 
            B: "لم تحدد النهضة الإسلامية النشاطات الثقافية في العصر الأموي بل ساهمت في الفعاليات العمرانية أيضا.", 
            C: "لم تقتصر النهضة الإسلامية على الفعاليات العمرانية في العصر الأموي، بل رافقتها النشاطات الثقافية بشكل متواز.", 
            D: "لم تقتصر النهضة الإسلامية على النشاطات الثقافية في العصر الأموي، بل طورت الفعاليات العمرانية.", 
            E: "على الرغم من أن النهضة الإسلامية اقتصرت في العصر الأموي على النشاطات الثقافية إلا أنها حققت فعاليات عمرانية." 
        },
        correct: "A",
        explanation: "2025 YDT 73. Soru Çözümü: Cümledeki 'sadece ... sınırlı kalmamış' kalıbı Arapça'da en yaygın 'لم يقتصر على ... بل' yapısı ile karşılanır. <br><br> " +
                     "**Öğelerin Karşılıkları:** <br>" +
                     "* Emevi Dönemi'ndeki İslam reformu: النهضة الإسلامية في العصر الأموي <br>" +
                     "* Sınırlı kalmamış: لم تقتصر على <br>" +
                     "* Kültürel etkinlikler: النشاطat الثقافية <br>" +
                     "* İmar faaliyetleri de eşlik etmiştir: رافقتها فعاليات عمرانية أيضا <br><br> " +
                     "A seçeneği, hem 'sınırlı kalmama' kalıbını hem de 'eşlik etme' (رافقت) eylemini tam karşılığıyla vermektedir."
    },
// 2025 YDT - 74. Soru (Türkçe'den Arapça'ya Çeviri):

    {
        id: 74,
        type: "ceviri",
        // Türkçe cümle ve Arapça seçenekler dikey boşluklarla:
        text: 
              "Amurriler, Kenanlılar’dan ayrılmış Sami kökenli bir halk olup Suriye’nin kuzeyinde, Fırat Nehri’nin batısında yaşamıştır.",
        
        options: { 
            A: "بدأ الآموريون بعد انفصالهم عن الكنعانيين، وهم أيضا شعب سامي مثلهم، يعيشون في شمالي سوريا، وغربي نهر الفرات.", 
            B: "كانت المناطق الشمالية وغربي نهر الفرات موطن الآموريين الذين تفرعوا عن الكنعانيين الساميين.", 
            C: "لقد عاش الآموريون، وهم فرع سامي تشعب عن الكنعانيين في غربي سوريا، شمالي نهر الفرات.", 
            D: "الآموريون شعب سامي الأصل، متفرع عن الكنعانيين، عاشوا في شمالي سوريا، غربي نهر الفرات.", 
            E: "انفصل الآموريون، وهم من أصل سامي، عن الكنعانيين وبدأوا يعيشون في شمالي سوريا، غربي نهر الفرات." 
        },
        correct: "D",
        explanation: "2025 YDT 74. Soru Çözümü: Cümledeki ana unsurların (Amurriler, Sami kökenli halk, Kenanlılardan ayrılma/türeme ve yaşam yerleri) en net ve doğru dizilimle verildiği şık D seçeneğidir. <br><br> " +
                     "**Öğelerin Karşılıkları:** <br>" +
                     "* Sami kökenli bir halk: شعب سامي الأصل <br>" +
                     "* Kenanlılardan ayrılmış/türetilmiş: متفرع عن الكنعانيين <br>" +
                     "* Suriye'nin kuzeyinde: في شمالي سوريا <br>" +
                     "* Fırat Nehri'nin batısında: غربي نهر الفرات <br><br> " +
                     "D seçeneği, 'yaşamıştır' (عاشوا) yüklemi ve yer bildiren ifadeleriyle orijinal cümlenin yapısını tam olarak karşılamaktadır."
    },
// 2025 YDT - 75. Soru (Türkçe'den Arapça'ya Çeviri):

    {
        id: 75,
        type: "ceviri",
        // Türkçe cümle ve Arapça seçenekler dikey boşluklarla:
        text: 
              "Türkiye’de, 80’lerin sonundan itibaren yayımlanan kitaplar içerisinde iş yaşamına ve kişisel gelişime ilişkin kitapların yoğunluğu artmıştır.",
        
        options: { 
            A: "اعتبارا من أواخر الثمانينيات نُشرت في تركيا الكتب الخاصة بالتنمية الشخصية وحياة العمل بشكل كثيف.", 
            B: "زادت نسبة الكتب الخاصة بحياة المهنيين في التنمية الشخصية من بين الكتب التي نُشرت في تركيا اعتبارا من الثمانينيات.", 
            C: "ازدادت كثافة الكتب المتعلقة بحياة العمل والتنمية الشخصية ضمن الكتب المنشورة في تركيا منذ نهاية الثمانينيات.", 
            D: "في أواخر الثمانينيات نُشرت في تركيا كتب كثيرة متعلقة بالتنمية الشخصية وحياة العمل بشكل كثيف وملحوظ.", 
            E: "إن كتب الدليل الشخصي وحياة العمل تعتبر من أكثر الكتب التي نُشرت في تركيا بشكل خاص في أواخر الثمانينيات." 
        },
        correct: "C",
        explanation: "2025 YDT 75. Soru Çözümü: Cümledeki ana yargı 'yoğunluğu artmıştır' (ازدادت كثافة) ifadesidir. <br><br> " +
                     "**Öğelerin Karşılıkları:** <br>" +
                     "* 80’lerin sonundan itibaren: منذ نهاية الثمانينيات <br>" +
                     "* Türkiye’de yayımlanan kitaplar içerisinde: ضمن الكتب المنشورة في تركيا <br>" +
                     "* İş yaşamına ve kişisel gelişime ilişkin: المتعلقة بحياة العمل والتنمية الشخصية <br>" +
                     "* Yoğunluğu artmıştır: ازدادت كثافة <br><br> " +
                     "C seçeneği, 'yoğunluk' (كثافة) kelimesini ve 'itibaren/beri' anlamını veren 'منذ' yapısını kullanarak orijinal cümleyi tam olarak karşılamaktadır."
    },
// 2025 YDT - 76. Soru (Anlam Akışını Bozan Cümle):

    {
        id: 76,
        type: "alakasiz",
        text: 
              "(I) اهتم الإنسان بالموسيقى منذ القدم، <br>" +
              "(II) لأنها تحرك أحاسيسه ومشاعره، فقد اعتبرها الموسيقيون غذاء للروح، <br>" +
              "(III) كان الغناء أول نشاط موسيقي عرفه الإنسان بواسطة حنجرته، <br>" +
              "(IV) لكل مجتمع آلاته الموسيقية الخاصة به يعبر بها عن حياته، <br>" +
              "(V) ومع الزمن تعددت نشاطاته الموسيقية عندما بدأ بصنع الآلات الموسيقية.",
        
        options: { 
            A: "I", 
            B: "II", 
            C: "III", 
            D: "IV", 
            E: "V" 
        },
        correct: "D",
        explanation: "2025 YDT 76. Soru Çözümü: Parçanın genelinde insanın müzikle olan tarihsel bağı ve müziğin gelişim süreci (şarkı söylemekten alet yapımına geçiş) anlatılmaktadır. <br><br> " +
                     "* (I, II, III ve V) numaralı cümleler kronolojik ve tematik bir bütünlük içindedir: İlgi -> Neden -> İlk aşama (ses) -> Gelişim (enstrüman yapımı). <br>" +
                     "* (IV) numaralı cümle ise 'her toplumun kendine has çalgıları olduğu' genel bilgisini vererek, insanın müzikal gelişim sürecini anlatan tarihsel akışı kesmektedir."
    },
// 2025 YDT - 77. Soru (Anlam Akışını Bozan Cümle):

    {
        id: 77,
        type: "alakasiz",
        // Parça ve seçenekler dikey düzenleme:
        text: 
              "(I) يعد الماء عنصرا أساسيا للمحافظة على صحة المرأة الحامل ونمو الجنين.<br>" +
              "(II) ولذلك فإن الإصابة بأحد الأمراض المرتبطة بالتعرض لدرجات الحرارة المرتفعة كالجفاف قد يتسبب في مضاعفات صحية خطيرة للمرأة الحامل وللجنين أيضا.<br>" +
              "(III) ويحذر الخبراء من أن مصادر المياه في العالم تنقص يوما فيوما.<br>" +
              "(IV) من بينها الولادة المبكرة وضعف إدرار حليب الأم عند إرضاع طفلها.<br>" +
              "(V) ومن المعروف أن الماء هو مكون أساسي لحليب الأم.",
        
        options: { 
            A: "I", 
            B: "II", 
            C: "III", 
            D: "IV", 
            E: "V" 
        },
        correct: "C",
        explanation: "2025 YDT 77. Soru Çözümü: Parçanın ana teması hamilelikte su tüketiminin önemi ve susuzluğun (dehidrasyon) yol açabileceği komplikasyonlardır. <br><br>" +
                     "* (I) Hamilelikte suyun önemini belirtir. <br>" +
                     "* (II) Susuzluğun ciddi sağlık sorunlarına yol açabileceğini söyler. <br>" +
                     "* (IV) Bu sorunları örneklendirir (erken doğum vb.). <br>" +
                     "* (V) Anne sütünün suyla ilişkisini açıklar. <br><br>" +
                     "Ancak (III) numaralı cümle, konuyu hamilelikten koparıp dünyadaki su kaynaklarının azalması gibi genel bir çevre sorununa taşıdığı için akışı bozmaktadır."
    },
// 2025 YDT - 78. Soru (Anlam Akışını Bozan Cümle):

    {
        id: 78,
        type: "alakasiz",
        // Parça ve seçenekler dikey düzenleme:
        text: 
              "(I) تكمن أهمية العمل اليدوي في الوظيفة التي يؤديها للفرد والمجتمع، وفن \"الباتيك\" بوجه خاص يؤدي العديد من الوظائف.<br>" +
              "(II) فقد اعتبر \"الباتيك\" في بداية الأمر وسيلة للتسلية حين اقتصر على النساء من الطبقة الأرستقراطية في جاوة.<br>" +
              "(III) ثم أضحى حرفة يمارسها أفراد المجتمع لتوفير الاحتياجات الشخصية كالملابس.<br>" +
              "(IV) فكان \"الباتيك\" مصدر دخل لدعم الجانب الاقتصادي للأسرة.<br>" +
              "(V) تتميز الأعمال اليدوية من شعب إلى آخر.",
        
        options: { 
            A: "I", 
            B: "II", 
            C: "III", 
            D: "IV", 
            E: "V" 
        },
        correct: "E",
        explanation: "2025 YDT 78. Soru Çözümü: Parçanın genelinde el sanatlarının önemi ve özelde 'Batik' sanatının tarihsel gelişimi ile işlevleri (eğlence, ihtiyaç, ekonomi) anlatılmaktadır. <br><br>" +
                     "* (I) El işçiliğinin önemine ve Batik sanatına giriş yapar.<br>" +
                     "* (II) Batik sanatının başlangıçta soylu kadınlar için bir eğlence olduğunu belirtir.<br>" +
                     "* (III) Daha sonra kişisel ihtiyaçlar için bir zanaata dönüştüğünü açıklar.<br>" +
                     "* (IV) Son aşamada aile ekonomisine katkı sağlayan bir gelir kapısı olduğunu vurgular.<br><br>" +
                     "Ancak (V) numaralı cümle, konuyu 'Batik' özelinden çıkarıp el işlerinin halktan halka farklılık gösterdiği gibi çok genel ve parça akışıyla ilgisiz bir yargıya taşıdığı için bütünlüğü bozmaktadır."
    },
// 2025 YDT - 79. Soru (Anlam Akışını Bozan Cümle):

    {
        id: 79,
        type: "alakasiz",
        // Parça ve seçenekler dikey düzenleme:
        text: 
              "(I) اشتهر الإنسان القديم بقدرة فائقة على الاختراع والابتكار.<br>" +
              "(II) وهي خاصية تميز بها ومكنته من استغلال البيئات التي سكنها واستخدم ما وجده فيها من إمكانيات.<br>" +
              "(III) فقد هدته قدرته الإبداعية إلى استغلال الطين في البناء والحجارة لنفس الحاجة واختراع العجلة.<br>" +
              "(IV) كما كان لاختراع العجلة في تطوير صناعة الفخار دور كبير.<br>" +
              "(V) الحضارة أيضا هي ظاهرة من ظاهرات تطور بلد أو مدينة ما.",
        
        options: { 
            A: "I", 
            B: "II", 
            C: "III", 
            D: "IV", 
            E: "V" 
        },
        correct: "E",
        explanation: "2025 YDT 79. Soru Çözümü: Parçanın ana odak noktası, antik dönem insanının icat ve inovasyon yeteneği ile bu yeteneğin pratik sonuçlarıdır (çevreyi kullanma, inşaat ve tekerleğin icadı).<br><br>" +
                     "* (I) Antik insanın icat yeteneğini tanıtır.<br>" +
                     "* (II) Bu yeteneğin çevresel imkanları kullanmasını sağladığını açıklar.<br>" +
                     "* (III) Yaratıcılığın çamur, taş ve tekerlek gibi somut icatlara dönüştüğünü belirtir.<br>" +
                     "* (IV) Tekerleğin icadının çömlekçilik üzerindeki etkisini anlatarak teknik gelişime devam eder.<br><br>" +
                     "Ancak (V) numaralı cümle, konuyu 'bireysel icat yeteneği ve teknik gelişim' çizgisinden çıkarıp, 'uygarlığın' bir ülkenin veya şehrin gelişim fenomeni olduğu şeklindeki genel ve soyut bir tanıma kaydırdığı için akışı bozmaktadır."
    },
// 2025 YDT - 80. Soru (Anlam Akışını Bozan Cümle):

    {
        id: 80,
        type: "alakasiz",
        // Parça ve seçenekler dikey düzenleme:
        text: 
              "(I) منذ سن مبكرة، يفضل أغلب الأطفال استهلاك المنتجات المصنعة.<br>" +
              "(II) تعد وجبة الإفطار أهم وجبة في اليوم.<br>" +
              "(III) فهي التي تحضر الجسم ليوم مليء بالطاقة والنشاط.<br>" +
              "(IV) لذلك من الضروري أن يتناول الأطفال وجبة إفطار مغذية قبل الذهاب إلى المدرسة.<br>" +
              "(V) ويساعد تناول وجبة إفطار متكاملة على تلبية احتياجات الأطفال من الطاقة.",
        
        options: { 
            A: "I", 
            B: "II", 
            C: "III", 
            D: "IV", 
            E: "V" 
        },
        correct: "A",
        explanation: "2025 YDT 80. Soru Çözümü: Parçanın ana fikri, çocuklarda kahvaltı öğününün önemi ve enerjiyi sağlamadaki rolüdür.<br><br>" +
                     "* (II) Kahvaltının günün en önemli öğünü olduğunu belirtir.<br>" +
                     "* (III) Kahvaltının vücudu enerji dolu bir güne hazırladığını açıklar.<br>" +
                     "* (IV) Bu nedenle (لذلك) çocukların okula gitmeden önce besleyici bir kahvaltı yapması gerektiğini söyler.<br>" +
                     "* (V) Dengeli bir kahvaltının çocukların enerji ihtiyacını karşıladığını vurgular.<br><br>" +
                     "Ancak (I) numaralı cümle, çocukların 'işlenmiş ürünleri (منتجات مصنعة) tüketmeyi tercih ettiklerinden' bahsederek kahvaltının önemi temasından tamamen bağımsız, çocukların tüketim alışkanlıklarıyla ilgili genel bir gözlem sunar. Bu cümle parçanın girişini ve akışını bozmaktadır."
    }

]
      
    };


    let currentQuestions = [];
    let examMode = false;
    let examTimer;
    let userAnswers = {}; 

    function loadQuestions() {
        const year = document.getElementById('yearSelect').value;
        currentQuestions = questionsDB[year] || [];
        userAnswers = {};
        filterCategory('all');
        if(examMode) stopExam(false);
const questionCard = document.createElement('div');
questionCard.className = 'question-card';
questionCard.id = `q-${question.id}`;
window.addEventListener('scroll', updateInstruction);
    }

   function filterCategory(category) {
    if(examMode) return; 

    // Tab butonlarını güncelle
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        // 'category' parametresine göre butonu aktif yap
        if(btn.getAttribute('onclick').includes(`'${category}'`)) btn.classList.add('active');
    });

    const container = document.getElementById('question-container');
    container.innerHTML = "";

    const filtered = category === 'all' 
        ? currentQuestions 
        : currentQuestions.filter(q => q.type === category);

    // Açıklama Güncelleme Mantığı
    if (filtered.length > 0) {
        // 'all' seçilse bile ilk sorunun ID'sine göre açıklamayı göster
        updateInstruction(filtered[0].id);
    } else {
        document.getElementById('sticky-instruction').style.display = 'none';
    }

    // --- BURASI KRİTİK: Açıklamayı güncelle ---
    // Eğer kategori seçildiyse listedeki ilk sorunun ID'sine göre yönergeyi getir
    updateInstruction(filtered[0].id);
    
    // Soruları ekrana bas
    filtered.forEach(q => renderQuestionCard(q, container));
}

   function renderQuestionCard(q, container) {
    const card = document.createElement('div');
    card.className = `question-card q-card-${q.type}`;
    card.id = `q-${q.id}`; // Yönerge takibi için gerekli ID

    // KISA ŞIK KONTROLÜ
    let totalLength = 0;
    Object.values(q.options).forEach(val => totalLength += val.length);
    const avgLength = totalLength / 5;
    const isShort = avgLength < 50; 

    let optionsClass = "options";
    if (isShort) optionsClass += " grid-layout";

    let optionsHtml = "";
    for (const [key, value] of Object.entries(q.options)) {
        let selectedClass = "";
        let icon = "";
        
        // Kullanıcı bu soruyu cevapladıysa renkleri ve ikonları belirle
        if (userAnswers[q.id]) {
            if (key === q.correct) { 
                selectedClass = "selected correct"; 
                icon = "✅"; 
            } else if (userAnswers[q.id] === key) { 
                selectedClass = "selected wrong"; 
                icon = "❌"; 
            }
        }

        // inline style ekleyerek fontu burada küçülttük (CSS'e gitmeye gerek kalmadan)
        optionsHtml += `
            <div class="option ${selectedClass}" onclick="selectOption(${q.id}, '${key}', this)">
                <div style="display:flex; align-items:center; gap:5px;">
                    <span class="opt-label">${key})</span>
                    <div style="font-size:1rem;">${icon}</div>
                </div>
                <span class="opt-text" style="font-size: 1.6rem; line-height: 1.4;">${value}</span>
            </div>
        `;
    }

    const trText = q.textTr ? `<div class="q-text-tr" style="font-size: 0.9rem;">🇹🇷 ${q.textTr}</div>` : '';

    card.innerHTML = `
        <div class="q-header">
            <span>SORU ${q.id}</span>
            <span style="background:#f1f5f9; padding:4px 12px; border-radius:20px; font-size:0.75rem; color:#64748b;">${getCategoryName(q.type)}</span>
        </div>
        ${trText}
        <div class="q-text" style="font-size: 2rem; margin-bottom: 15px; line-height: 1.6;">${q.text}</div>
        <div class="${optionsClass}">
            ${optionsHtml}
        </div>
        <button class="explanation-btn" onclick="showExplanation(${q.id})">
            <span>💡</span> Cevabı ve Açıklamayı Gör
        </button>
    `;
    container.appendChild(card);
}

    function selectOption(qId, key, element) {
    // 1. Yanıtı kaydet
    userAnswers[qId] = key;

    // 2. Kartın içeriğini anında güncellemek için render fonksiyonunu çağır
    const card = element.closest('.question-card');
    const question = currentQuestions.find(q => q.id === qId);
    
    // Geçici bir kap oluşturup yeni kartı üretelim
    const tempContainer = document.createElement('div');
    renderQuestionCard(question, tempContainer);
    
    // Mevcut kartı yenisiyle değiştir
    card.replaceWith(tempContainer.firstChild);

    // 3. İlerleme çubuğunu güncelle
    updateProgress();
}

    function startExam() {
        examMode = true;
        document.body.classList.add('exam-mode');
        document.getElementById('examBtn').innerText = "Sınavı Bitir";
        document.getElementById('examBtn').style.background = "var(--danger)";
        document.getElementById('timer').style.display = "block";
        document.getElementById('result-screen').style.display = "none";
        document.getElementById('progress-wrapper').style.display = 'block';
        
        userAnswers = {};
        const container = document.getElementById('question-container');
        container.innerHTML = "";
        currentQuestions.forEach(q => renderQuestionCard(q, container));

        let timeLeft = 120 * 60; 
        updateTimerDisplay(timeLeft);
        
        examTimer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            if (timeLeft <= 0) finishExam();
        }, 1000);
        window.scrollTo(0, 0);
    }

    function finishExam() {
    // 1. Durum Değişikliği ve Zamanlayıcıyı Durdurma
    examMode = false; 
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // 2. Skor Hesaplama
    let correct = 0, wrong = 0, empty = 0;
    currentQuestions.forEach(q => {
        if (!userAnswers[q.id]) empty++;
        else if (userAnswers[q.id] === q.correct) correct++;
        else wrong++;
    });

    // 3. Ekranları Ayarlama
    document.getElementById('result-screen').style.display = "block"; // Sonuç panelini aç
    document.getElementById('question-container').style.display = "none"; // Soruları şimdilik gizle
    document.getElementById('progress-wrapper').style.display = "none"; // İlerlemeyi gizle

    // 4. Skorları Yazdırma
    document.getElementById('correctCount').innerText = correct;
    document.getElementById('wrongCount').innerText = wrong;
    document.getElementById('netCount').innerText = (correct - (wrong * 0.25)).toFixed(2);
    document.getElementById('emptyCount').innerText = empty;

    // 5. Butonu Sıfırla
    const examBtn = document.getElementById('examBtn');
    examBtn.innerText = "Sınavı Başlat";
    examBtn.style.background = "var(--primary)";

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

    function calculateScore() {
        let correct = 0, wrong = 0, empty = 0;
        currentQuestions.forEach(q => {
            const answer = userAnswers[q.id];
            if (!answer) empty++;
            else if (answer === q.correct) correct++;
            else wrong++;
        });
        const net = correct - (wrong / 4);
        document.getElementById('correctCount').innerText = correct;
        document.getElementById('wrongCount').innerText = wrong;
        document.getElementById('emptyCount').innerText = empty;
        document.getElementById('netCount').innerText = net.toFixed(2);
    }

    function reviewExam() {
    // Sonuç ekranını kapat, soruları göster
    document.getElementById('result-screen').style.display = "none";
    document.getElementById('question-container').style.display = "block";
    
    // Sınav modu false olduğu için renderQuestionCard otomatik ✅/❌ gösterecek
    filterCategory('all');
}

    function updateTimerDisplay(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        document.getElementById('timer').innerText = `${m}:${s < 10 ? '0'+s : s}`;
    }

    function getCategoryName(type) {
        const types = {'kelime': 'Kelime', 'dilbilgisi': 'Dilbilgisi', 'ceviri': 'Çeviri', 'paragraf': 'Okuma', 'diyalog': 'Diyalog', 'yakin': 'Yakın Anlam', 'alakasiz': 'Akışı Bozan', 'tamamlama': 'Tamamlama', 'harficer': 'Harfi Cer'};
        return types[type] || 'Genel';
    }

    function showExplanation(qId) {
        const q = currentQuestions.find(i => i.id === qId);
        const modal = document.getElementById('explanationModal');
        document.getElementById('modalAnswer').innerText = `Doğru Cevap: ${q.correct}`;
        document.getElementById('modalText').innerText = q.explanation || "Açıklama girilmemiş.";
        modal.style.display = "block";
    }

    function closeModal() { document.getElementById('explanationModal').style.display = "none"; }
    window.onclick = function(event) { if (event.target == document.getElementById('explanationModal')) closeModal(); }
    window.onload = loadQuestions;
function updateProgress() {
    // Toplam soru sayısı
    const total = currentQuestions.length;
    // Cevaplanmış (doğru veya yanlış sınıfı almış) soru sayısı
    const answered = document.querySelectorAll('.question-card.correct, .question-card.wrong').length;
    
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    
    // Görseli güncelle
    document.getElementById('progress-bar').style.width = percentage + "%";
    // Metni güncelle (Örn: 5/20)
    document.getElementById('progress-text').innerText = `${answered} / ${total}`;
}

function updateProgress() {
    const wrapper = document.getElementById('progress-wrapper');
    if (!wrapper || wrapper.style.display === 'none') return;

    const total = currentQuestions.length;
    
    // Sınav modunda kaç soruya tıklandığını 'selected' veya 'answered' class'ı üzerinden sayıyoruz
    const answered = document.querySelectorAll('.question-card .option.selected').length;
    
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    
    document.getElementById('progress-bar').style.width = percentage + "%";
    document.getElementById('progress-text').innerText = `${answered} / ${total}`;
}
window.addEventListener('scroll', updateInstruction);
function handleOptionClick(questionId, selectedKey, element) {
    // Sınav modunda değilsek (Çalışma Modu)
    if (!document.body.classList.contains('exam-mode')) {
        const question = questionsDB["2025"].find(q => q.id === questionId);
        
        // Önce o sorudaki tüm şıklardan 'selected', 'correct' ve 'wrong' sınıflarını kaldır
        const parent = element.parentElement;
        parent.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'wrong');
        });

        // Seçilen şıkkı işaretle
        element.classList.add('selected');

        // Doğru/Yanlış kontrolü yap ve renklendir
        if (selectedKey === question.correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
            // Yanlış seçilirse doğru olanı da yeşil göster (isteğe bağlı)
            const correctOption = Array.from(parent.children).find(
                opt => opt.querySelector('.opt-label').innerText.startsWith(question.correct)
            );
            if (correctOption) correctOption.classList.add('correct');
        }
        
        // İlerleme çubuğunu ve açıklamayı güncelle
        updateProgress();
    } else {
        // SINAV MODUNDAYSAK: Sadece seçileni işaretle, doğruyu gösterme
        const parent = element.parentElement;
        parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
        updateProgress();
    }
}