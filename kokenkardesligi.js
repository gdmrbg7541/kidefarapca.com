// Kitapçıktan ve genel YDT müfredatından derlenen veriler
    const wordData = [
    
    { year: "2025", ar: "مواقع", tr: "Vaka / Mevki", desc: "Siteler, yerler; vakıa ve mevki (konum) kelimeleriyle kardeştir." },
    { year: "2025", ar: "التواصل", tr: "Vuslat / Vasıl / Sıla / Vusul", desc: "İletişim; Türkçedeki kavuşma (vuslat) kökünden gelir." },
    { year: "2025", ar: "الاجتماعي", tr: "İçtimai / Cemiyet", desc: "Sosyal; toplum (cemiyet) ve toplanma (içtima) ile aynı köktür." },
    { year: "2025", ar: "تستمر", tr: "Müstemir / İstimrar", desc: "Devam etmek; mütsemir (sürekli) kelimesiyle aynı köktür." },
    { year: "2025", ar: "دولة", tr: "Devlet", desc: "Siyasi organizasyon; Türkçede aynen kullanılır." },
    { year: "2025", ar: "مانحة", tr: "Meniha", desc: "Hibe eden; 'menîha' eski Türkçede bağış/hediye anlamındadır." },
    { year: "2025", ar: "المساعدة", tr: "Müsaade", desc: "Yardım; Türkçede izin anlamında kalsa da kökeni 'yardımlaşma'dır." },
    { year: "2025", ar: "الإنسانية", tr: "İnsaniyet", desc: "İnsanlık hali; Türkçede aynen yaşar." },
    { year: "2025", ar: "الرسمية", tr: "Resmiyet", desc: "Devletle ilgili olan; aynen kullanılır." },
    { year: "2025", ar: "المسابقة", tr: "Müsabaka", desc: "Yarışma; Türkçede spor dallarında hala kullanılır." },
    { year: "2025", ar: "المناقشة", tr: "Münakaşa", desc: "Tartışma; aynen kullanılır." },
    { year: "2025", ar: "المناسبة", tr: "Münasebet", desc: "İlişki, uygunluk; aynen kullanılır." },
    { year: "2025", ar: "المقاومة", tr: "Mukavemet", desc: "Direnç; mühendislikte ve sporda hala aktiftir." },
    { year: "2025", ar: "تربية", tr: "Terbiye", desc: "Eğitim; evcil hayvan besleme veya çocuk yetiştirme kökenidir." },
    { year: "2025", ar: "الحافلة", tr: "Kafile", desc: "Otobüs; toplu gidilen 'kafile' kelimesinden türemiştir." },
    { year: "2025", ar: "المسافرة", tr: "Misafir", desc: "Yolcu; Türkçede 'konuk' anlamında kullanılır." },
    { year: "2025", ar: "يجب", tr: "Vacip", desc: "Gereklilik; dini bir terim olarak da Türkçede yer alır." },
    { year: "2025", ar: "الولادة", tr: "Veled / Valide", desc: "Doğum; anne (valide) ve çocuk (velet) kelimeleriyle kardeştir." },
    { year: "2025", ar: "النزاعات", tr: "Niza", desc: "Çatışma; 'niza çıkarmak' deyimiyle Türkçededir." },
    { year: "2025", ar: "اللقاحات", tr: "Telkih", desc: "Aşı; bitkileri aşılama (telkih) anlamında kullanılır." },
    { year: "2025", ar: "المكتسبات", tr: "Müktesebat", desc: "Kazanımlar; hukukta ve eğitimde hala kullanılır." },
    { year: "2025", ar: "الممرضات", tr: "Maraz / Hemşire", desc: "Hastalıkla (maraz) ilgilenen; hemşire anlamında." },
    { year: "2025", ar: "النفايات", tr: "Nefiy", desc: "Atıklar; 'nefiy' (uzaklaştırma/sürgün) kökeninden gelir." },
    { year: "2025", ar: "مهارة", tr: "Maharet", desc: "Yetenek; becerikli kişiye 'maharetli' denir." },
    { year: "2025", ar: "الصف", tr: "Saf", desc: "Sınıf; Türkçede okul sırası veya dizi (saf tutmak) anlamındadır." },
    { year: "2025", ar: "إدارة", tr: "İdare / Müdür / Devir / Deverean", desc: "Yönetim; sevk ve idare anlamında kullanılır." },
    { year: "2025", ar: "تنفيذ", tr: "Tenfiz / Nüfuz", desc: "Uygulama; hukukta tenfiz kararı, etkilemede nüfuz etmek." },
    { year: "2025", ar: "التدريس", tr: "Ders / Müderris", desc: "Öğretim; ders verme işi." },
    { year: "2025", ar: "صانع", tr: "Sanat / Sani / Sanayi", desc: "Yapan; sanatkâr kelimesiyle aynı köktür." },
    { year: "2025", ar: "خارج", tr: "Hariç/ İhraç / İhracat / Mahreç / Haraç", desc: "Dışarı; Türkçede 'dışında' anlamında kullanılır." },
    { year: "2025", ar: "الخبراء", tr: "Haber / Muhabir / Muhaberat / İhbar / İstihbarat", desc: "Uzmanlar; 'haberi olan/bilen' demektir." },
    { year: "2025", ar: "الجسد", tr: "Ceset", desc: "Vücut; Türkçede ölü beden için kullanılsa da aslı gövdedir." },
    { year: "2025", ar: "ساعات", tr: "Saat", desc: "Zaman dilimi; aynen kullanılır." },
    { year: "2025", ar: "السيارات", tr: "Seyyar / Seyir", desc: "Arabalar; seyyar (hareketli) ve seyir (izlemek) ile kardeştir." },
    { year: "2025", ar: "تسبب", tr: "Sebep / Müsebbib", desc: "Neden olmak; aynen kullanılır." },
    { year: "2025", ar: "الأمراض", tr: "Maraz", desc: "Hastalıklar; 'maraz doğurmak' deyiminde yaşar." },
    { year: "2025", ar: "العلم", tr: "İlim / Alim / Talim / Malum / Allame / Muallim", desc: "Bilim; bilen kişi (alim) ile aynı köktür." },
    { year: "2025", ar: "معلومات", tr: "Malumat", desc: "Bilgiler; 'malumatfuruş' gibi kelimelerde yaşar." },
    { year: "2025", ar: "تعاون", tr: "Muavin / Ayin", desc: "Yardımlaşma; muavin (yardımcı) kelimesiyle kardeştir." },
    { year: "2025", ar: "قدّم", tr: "Takdim/Kadîm/Kadem (Sırra kadem basmak)", desc: "Sunmak; aynen kullanılır." },
    { year: "2025", ar: "منع", tr: "Men / Mani / Memnu (Aşkı)", desc: "Engellemek; 'men etmek' veya 'mani olmak' şeklinde yaşar." },
    { year: "2025", ar: "يختلف", tr: "İhtilaf / Halef / Hilafet/", desc: "Farklılaşmak; görüş ayrılığı (ihtilaf) ile kardeştir." },
    { year: "2025", ar: "الأفراد", tr: "Fert", desc: "Bireyler; 'fert' kelimesinin çoğuludur." },
    { year: "2025", ar: "نواحي", tr: "Nahiye / Yön", desc: "Yönler; eski idari birim 'nahiye' ile aynıdır." },
    { year: "2025", ar: "عملية", tr: "Amel / Ameliyat", desc: "Süreç; iş (amel) kökeninden gelir." },
    { year: "2025", ar: "العصر", tr: "Asır", desc: "Devir, yüzyıl; ikindi vakti anlamı da vardır." },
    { year: "2025", ar: "الإسلامي", tr: "İslam", desc: "Dini aidiyet; aynen kullanılır." },
    { year: "2025", ar: "العوامل", tr: "Amil / Ameliyat / Amel / Muamele", desc: "Faktörler; 'etken' (amil) kelimesiyle aynıdır." },
    { year: "2025", ar: "اختيار", tr: "İhtiyar / Hıyar / Hayır", desc: "Seçim; Türkçede yaşlı anlamında olsa da 'irade' kökenlidir." },
    { year: "2025", ar: "مواقع", tr: "Mevki / Vuku / Vukuat", desc: "Konumlar; aynen kullanılır." },
    { year: "2025", ar: "المدن", tr: "Medeni / Medine", desc: "Şehirler; 'medeniyet' kelimesiyle kardeştir." },
    { year: "2025", ar: "مزمن", tr: "Müzmin", desc: "Kronik; Türkçede 'müzminleşmiş sorun' olarak kullanılır." },
    { year: "2025", ar: "منظمة", tr: "Nizam / Tanzim / Nazım", desc: "Örgüt, organizasyon; nizam (düzen) kökenlidir." },
    { year: "2025", ar: "بيانات", tr: "Beyan / Beyanname", desc: "Veriler; açıklama (beyan) ile aynı köktür." },
    { year: "2025", ar: "بالمثل", tr: "Misal / Mesela / Darbı Mesel", desc: "Örnek olarak; 'misilleme' kelimesiyle kardeştir." },
    { year: "2025", ar: "طريق", tr: "Tarikat / Tarik", desc: "Yol; 'yol yordam' anlamında tarik kullanılır." },
    { year: "2025", ar: "ظاهرة", tr: "Zahir / Zuhur etmek", desc: "Fenomen, olgu; 'görünen' (zahir) demektir." },
    { year: "2025", ar: "معروفة", tr: "Maruf / Arif / Tarif / İrfan / Marifet", desc: "Bilinen; 'herkesçe maruf' tabirinde yaşar." },
    { year: "2025", ar: "العلماء", tr: "Alim / Talim / Ulema / Malum / Muallim", desc: "Bilim insanları; Türkçede din bilginleri için kullanılır." },
    { year: "2025", ar: "المكان", tr: "Mekan", desc: "Yer; aynen kullanılır." },
    { year: "2025", ar: "العمود", tr: "Amut", desc: "Sütun, direk; sporda 'amuda kalkmak' deyimi buradandır." },
    { year: "2025", ar: "العديد", tr: "Adet", desc: "Pek çok; sayı (adet) kökeninden gelir." },
    { year: "2025", ar: "القيام", tr: "Kıyam / Kayyum / Kıyamet", desc: "Yapmak, kalkışmak; 'kıyamet' veya 'namazda kıyam' ile kardeştir." },
    { year: "2025", ar: "حفاظ", tr: "Muhafaza / Hafız / Hafıza / Muhafız", desc: "Korumak; muhafız kelimesiyle aynı köktür." },
    { year: "2025", ar: "سليمة", tr: "Selim / Selamet / Selam / Teslim / İslam / Müslüm / Salim", desc: "Sağlıklı; 'sağ salim' deyiminde yaşar." },
    { year: "2025", ar: "المسؤوليات", tr: "Mesuliyet", desc: "Sorumluluklar; aynen kullanılır." },
    { year: "2025", ar: "التركيز", tr: "Merkez", desc: "Odaklanmak; merkez kelimesinden türetilmiştir." },
    { year: "2025", ar: "أولويات", tr: "Evveliyat / Evvel", desc: "Öncelikler; 'evvel' (önce) kökenlidir." },
    { year: "2025", ar: "تعارض", tr: "Arz / Maruz / Taaruz", desc: "Çelişki; zıt fikirlerin birbirine arz edilmesi." },
    { year: "2025", ar: "الأهداف", tr: "Hedef", desc: "Amaçlar; aynen kullanılır." },
    { year: "2025", ar: "العزيمة", tr: "Azim", desc: "Kararlılık; aynen kullanılır." },
    { year: "2025", ar: "السكريات", tr: "Şeker", desc: "Şekerli maddeler; köken birliği vardır." },
    { year: "2025", ar: "نصيحة", tr: "Nasihat", desc: "Öğüt; metinde 'önerilir' bağlamında geçer." },
    { year: "2025", ar: "باعتدال", tr: "İtidal / Mutedil / Muadil / Adil / Adalet", desc: "Ölçülü şekilde; 'itidalli olmak' deyiminde yaşar." },
    { year: "2025", ar: "إفراط", tr: "İfrat", desc: "Aşırılık; 'ifrat ve tefrit' (uç noktalar) deyiminde kullanılır." },
    { year: "2025", ar: "تتألف", tr: "Müellif / Ülfet", desc: "Oluşmak; kitap yazan (müellif) ile kardeştir." },
    { year: "2025", ar: "مجموعة", tr: "Mecmua / Cami / Cami / Camaat / İçtima / Cemevi", desc: "Topluluk; eski dergi anlamındaki 'mecmua' ile aynıdır." },
    { year: "2025", ar: "مظهر", tr: "Mazhar", desc: "Görünüş; 'mazhar olmak' (erişmek/görünmek) ile kardeştir." },
    { year: "2025", ar: "جذابة", tr: "Cezbe / Cazibe / Meczup", desc: "Çekici; 'cazibeli' kelimesiyle aynı köktür." },
    { year: "2025", ar: "تحديداً", tr: "Hudut / Tahdit", desc: "Belirleyerek; sınır (hudut) kökenlidir." },
    { year: "2025", ar: "الحقيقة", tr: "Hakikat / Hak / Hukuk", desc: "Gerçek; aynen kullanılır." },
    { year: "2025", ar: "الرأي", tr: "Rey", desc: "Görüş, oy; 'rey kullanmak' deyiminde yaşar." },
    { year: "2025", ar: "ثابت", tr: "Sabit", desc: "Değişmez; aynen kullanılır." },
    { year: "2025", ar: "مجهود", tr: "Ceht / Mücahede / İçtihat / Müçtehhit / Mücahit", desc: "Çaba; 'üstün bir efor' (ceht) sarf etmek." },
    { year: "2025", ar: "فوائد", tr: "Fayda", desc: "Yararlar; aynen kullanılır." },
    { year: "2025", ar: "ضرورية", tr: "Zaruri", desc: "Zorunlu; aynen kullanılır." },
    { year: "2025", ar: "شديد", tr: "Şiddet", desc: "Sert, güçlü; aynen kullanılır." },
    { year: "2025", ar: "التعقيد", tr: "Akit", desc: "Karmaşıklık; sözleşme (akit) veya 'kör düğüm' (ukde) ile kardeştir." },
    { year: "2025", ar: "تراث", tr: "Miras / Varis", desc: "Miras; kültürel miras anlamında kullanılır." }
    ];

    function filterWords() {
        const selectedYear = document.getElementById('yearSelect').value;
        const tableBody = document.getElementById('tableBody');
        const emptyMsg = document.getElementById('emptyMsg');
        
        // Tabloyu temizle
        tableBody.innerHTML = '';
        
        const filtered = wordData.filter(item => item.year === selectedYear);
        
        if (filtered.length === 0) {
            emptyMsg.style.display = 'block';
            document.getElementById('wordTable').style.display = 'none';
        } else {
            emptyMsg.style.display = 'none';
            document.getElementById('wordTable').style.display = 'table';
            
            filtered.forEach(item => {
                const row = `<tr>
                    <td class="arabic">${item.ar}</td>
                    <td class="turkish">${item.tr}</td>
                    <td>${item.desc}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        }
    }

    // Sayfa açıldığında 2025'i göster
    window.onload = filterWords;