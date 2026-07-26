document.addEventListener('DOMContentLoaded', () => {

    const Data = {
    grade9: { 
        title: "Seviye 1", 
        words: { 
            unit1: { title: { tr: "1. Ünite" }, description: { tr: "Selamlaşma ve Tanışma" }, lessons: { lesson1: { description: { tr: "Selamlaşma" }, words: [ { id: 1, arabic: 'السَّلام عَلَيْكُمْ', turkish: 'Selam üzerinize olsun!' }, { id: 2, arabic: 'وَعَلَيْكُم السَّلام', turkish: 'Selam sizin de üzerinize olsun!' }, { id: 3, arabic: 'صَباح الخَيْر', turkish: 'Hayırlı Sabahlar' }, { id: 4, arabic: 'صَباح النّور', turkish: 'Günaydın' }, { id: 5, arabic: 'مَساء الخَيْر', turkish: 'Hayırlı akşamlar' }, { id: 6, arabic: 'مَساء النّور', turkish: 'Nurlu akşamlar' }, { id: 7, arabic: 'مَرْحَبًا', turkish: 'Merhaba!' }, { id: 8, arabic: 'أَهْلًا وَسَهْلًا', turkish: 'Hoş geldiniz!' }, { id: 9, arabic: 'أَهْلًا بِك', turkish: 'Hoş bulduk!' }, { id: 10, arabic: 'كَيْفَ حالُك؟', turkish: 'Nasılsın?' }, { id: 11, arabic: 'أَنا بِخَيْر', turkish: 'İyiyim!' }, { id: 12, arabic: 'إِلى اللِّقاء', turkish: 'Görüşmek üzere!' }, { id: 13, arabic: 'مَع السَّلامَة', turkish: 'Hoşça kal' }, { id: 14, arabic: 'في أَمان الّٰلهِ', turkish: 'Allah’a emanet ol' }, { id: 15, arabic: 'اِقْرَأْ', turkish: 'Oku!' }, { id: 16, arabic: 'اُكْتُبْ', turkish: 'Yaz!' }, { id: 17, arabic: 'أَعِدْ', turkish: 'Tekrar et!' }, { id: 18, arabic: 'اِسْتَمِعْ', turkish: 'Dinle!' } ] }, lesson2: { description: { tr: "Tanışma" }, words: [ { id: 19, arabic: 'طالِب', turkish: 'Erkek öğrenci' }, { id: 20, arabic: 'مُدَرِّس', turkish: 'Erkek öğretmen' }, { id: 21, arabic: 'صَديق', turkish: 'Erkek arkadaş' }, { id: 22, arabic: 'هُوَ', turkish: 'O (erkek)' }, { id: 23, arabic: 'هِيَ', turkish: 'O (kadın)' }, { id: 24, arabic: 'أَنْتَ', turkish: 'Sen (erkek)' }, { id: 25, arabic: 'أَنا', turkish: 'Ben' }, { id: 26, arabic: 'ما اسْمُك؟', turkish: 'Adın ne?' }, { id: 27, arabic: 'اِسْmi', turkish: 'Benim adım' }, { id: 28, arabic: 'مِن أَيْن؟', turkish: 'Nereli?' }, { id: 29, arabic: 'نَعَم', turkish: 'Evet' }, { id: 30, arabic: 'لا', turkish: 'Hayır' }, { id: 31, arabic: 'تَكَلَّمْ', turkish: 'Konuş' }, { id: 32, arabic: 'اُسْكُتْ', turkish: 'Sus' }, { id: 33, arabic: 'تَعالَ', turkish: 'Gel' }, { id: 34, arabic: 'اِذْهَبْ', turkish: 'Git' }, { id: 35, arabic: 'تَشَرَّفْتُ', turkish: 'Tanıştığıma memnun oldum' }, { id: 36, arabic: 'فُرْصَة سَعيدَة', turkish: 'Memnun oldum' }, { id: 37, arabic: 'شُكْرًا', turkish: 'Teşekkür ederim' }, { id: 38, arabic: 'عَفْوًا', turkish: 'Rica ederim' } ] } } }, 
            unit2: { title: { tr: "2. Ünite" }, description: { tr: "Okulda" }, lessons: { lesson1: { description: { tr: "Sınıf Eşyaları" }, words: [ { id: 101, arabic: 'مَدْرَسَة', turkish: 'Okul' }, { id: 102, arabic: 'صَفّ', turkish: 'Sınıf' }, { id: 103, arabic: 'كِتاب', turkish: 'Kitap' }, { id: 104, arabic: 'دَفْتَر', turkish: 'Defter' }, { id: 105, arabic: 'قَلَم', turkish: 'Kalem' }, { id: 106, arabic: 'سَبّورة', turkish: 'Tahta' }, { id: 107, arabic: 'كُرْسِيّ', turkish: 'Sandalye' }, { id: 108, arabic: 'مَكْتَب', turkish: 'Masa' }, { id: 109, arabic: 'مِمْحاة', turkish: 'Silgi' }, { id: 110, arabic: 'مِسْطَرَة', turkish: 'Cetvel' }, { id: 111, arabic: 'حَقيبَة', turkish: 'Çanta' }, { id: 112, arabic: 'باب', turkish: 'Kapı' }, { id: 113, arabic: 'نافِذَة', turkish: 'Pencere' } ] }, lesson2: { description: { tr: "Yönler ve Eylemler" }, words: [ { id: 114, arabic: 'أَيْن؟', turkish: 'Nerede?' }, { id: 115, arabic: 'هُنا', turkish: 'Burada' }, { id: 116, arabic: 'هُناك', turkish: 'Orada' }, { id: 117, arabic: 'عَلى', turkish: 'Üstünde' }, { id: 118, arabic: 'تَحْت', turkish: 'Altında' }, { id: 119, arabic: 'أَمام', turkish: 'Önünde' }, { id: 120, arabic: 'خَلْفَ', turkish: 'Arkasında' }, { id: 121, arabic: 'فَوْقَ', turkish: 'Üzerinde' }, { id: 122, arabic: 'جانِبَ', turkish: 'Yanında' }, { id: 123, arabic: 'في', turkish: 'İçinde' }, { id: 124, arabic: 'خارِجَ', turkish: 'Dışında' }, { id: 125, arabic: 'اِفْتَح', turkish: 'Kitabı aç' }, { id: 126, arabic: 'اِجْلِسْ', turkish: 'Otur' }, { id: 127, arabic: 'اُدْخُلِ الصَّفَّ', turkish: 'Sınıfa gir' } ] } } }, 
            unit3: { title: { tr: "3. Ünite" }, description: { tr: "Evde" }, lessons: { lesson1: { description: { tr: "Evdeyim" }, words: [ { id: 201, arabic: 'بَيْت', turkish: 'Ev' }, { id: 202, arabic: 'غُرْفَة', turkish: 'Oda' }, { id: 203, arabic: 'غُرْفَة النَّوْم', turkish: 'Yatak odası' }, { id: 204, arabic: 'غُرْفَة جُلوس', turkish: 'Oturma odası' }, { id: 205, arabic: 'مَطْبَخ', turkish: 'Mutfak' }, { id: 206, arabic: 'حَمّام', turkish: 'Banyo' }, { id: 207, arabic: 'سَرير', turkish: 'Yatak' }, { id: 208, arabic: 'طاوِلَة', turkish: 'Masa' }, { id: 209, arabic: 'كُرْسِيّ', turkish: 'Sandalye' }, { id: 210, arabic: 'تِلْفاز', turkish: 'Televizyon' }, { id: 211, arabic: 'ثَلّاجة', turkish: 'Buzdolabı' }, { id: 212, arabic: 'فُرْن', turkish: 'Fırın' }, { id: 213, arabic: 'سَجّادَة', turkish: 'Halı' }, { id: 214, arabic: 'هَاتِف', turkish: 'Telefon' }, { id: 215, arabic: 'مِصْباح', turkish: 'Lamba' } ] }, lesson2: { description: { tr: "Odamda" }, words: [ { id: 216, arabic: 'غُرْفَتي', turkish: 'Odam' }, { id: 217, arabic: 'سَرير', turkish: 'Yatak' }, { id: 218, arabic: 'مَكْتَب', turkish: 'Çalışma masası' }, { id: 219, arabic: 'كُرْسِيّ', turkish: 'Sandalye' }, { id: 220, arabic: 'سِتارَة', turkish: 'Perde' }, { id: 221, arabic: 'مِصْباح', turkish: 'Lamba' }, { id: 222, arabic: 'مِرْآة', turkish: 'Ayna' }, { id: 223, arabic: 'سَجّادَة', turkish: 'Halı' }, { id: 224, arabic: 'دُولاب', turkish: 'Dolap' }, { id: 225, arabic: 'نَظيف', turkish: 'Temiz' }, { id: 226, arabic: 'مُرَتَّب', turkish: 'Düzenli' }, { id: 227, arabic: 'وَسِخ', turkish: 'Kirli' }, { id: 228, arabic: 'يُنَظِّفُ', turkish: 'Temizliyor' }, { id: 229, arabic: 'يُرَتِّبُ', turkish: 'Düzenliyor' } ] } } }, 
            unit4: { title: { tr: "4. Ünite" }, description: { tr: "Bir Günüm" }, lessons: { lesson1: { description: { tr: "Bir Günüm" }, words: [ { id: 301, arabic: 'صَباح', turkish: 'Sabah' }, { id: 302, arabic: 'ظُهْر', turkish: 'Öğle' }, { id: 303, arabic: 'مَساء', turkish: 'Akşam' }, { id: 304, arabic: 'لَيْل', turkish: 'Gece' }, { id: 305, arabic: 'يَسْتَيْقِظُ', turkish: 'Uyanıyor' }, { id: 306, arabic: 'يَغْسِلُ وَجْهَهُ', turkish: 'Yüzünü yıkıyor' }, { id: 307, arabic: 'يُصَلّي', turkish: 'Namaz kılıyor' }, { id: 308, arabic: 'يَلْبَسُ mَلابِسَهُ', turkish: 'Giyiniyor' }, { id: 309, arabic: 'يَتَناوَلُ الفَطور', turkish: 'Kahvaltı yapıyor' }, { id: 310, arabic: 'يَذْهَبُ إِلى المَدْرَسَة', turkish: 'Okula gidiyor' }, { id: 311, arabic: 'يَدْرُسُ', turkish: 'Ders çalışıyor' }, { id: 312, arabic: 'يَرْجِعُ إِلى البَيْت', turkish: 'Eve dönüyor' }, { id: 313, arabic: 'يَتَغَدّى', turkish: 'Öğle yemeği yiyor' }, { id: 314, arabic: 'يَسْتَريحُ', turkish: 'Dinleniyor' }, { id: 315, arabic: 'يَلْعَبُ', turkish: 'Oynuyor' } ] }, lesson2: { description: { tr: "Günlük Rutin" }, words: [ { id: 316, arabic: 'أَسْتَيْقِظُ مُبَكِّرًا', turkish: 'Erken uyanıyorum' }, { id: 317, arabic: 'أَذْهَبُ إِلى المَدْرَسَة', turkish: 'Okula gidiyorum' }, { id: 318, arabic: 'أُصَلّي صَلاة الظُّهْر', turkish: 'Öğle namazı kılıyorum' }, { id: 319, arabic: 'أَتَغَدّى مَع أُسْرَتي', turkish: 'Ailemle öğle yemeği yiyorum' }, { id: 320, arabic: 'أَقْرَأُ دُروسي', turkish: 'Derslerimi okuyorum' }, { id: 321, arabic: 'أَكْتُبُ واجِباتي', turkish: 'Ödev yazıyorum' }, { id: 322, arabic: 'أَلْعَبُ في السّاحَة', turkish: 'Bahçede oynuyorum' }, { id: 323, arabic: 'أُساعِدُ أُمّي', turkish: 'Anneme yardım ediyorum' }, { id: 324, arabic: 'أَزورُ جَدِي', turkish: 'Dedemi ziyaret ediyorum' }, { id: 325, arabic: 'أَذْهَبُ إِلى المَسْجِد', turkish: 'Camiye gidiyorum' }, { id: 326, arabic: 'أُرَتِّبُ سَريري', turkish: 'Yatağımı düzeltiyorum' }, { id: 327, arabic: 'أُنَظِّفُ غُرْفَتي', turkish: 'Odamı temizliyorum' }, { id: 328, arabic: 'أُراجِعُ دُروسي', turkish: 'Derslerimi tekrar ediyorum' }, { id: 329, arabic: 'أَنامُ مُتَأَخِّرًا', turkish: 'Geç yatıyorum' } ] } } } 
        } 
    }, 
    grade10: { 
        title: "Seviye 2", 
        words: { 
            
unit1: { title: { tr: "1. Ünite" }, description: { tr: "Değerlerim ve Ailem" },

 lessons: { lesson1: { description: { tr: "Güzel Davranışlar" }, words: [ { id: 401, arabic: 'صِدْق', turkish: 'Doğruluk' }, { id: 402, arabic: 'أَمانَة', turkish: 'Güvenilirlik' }, { id: 403, arabic: 'إِخْلاص', turkish: 'Samimiyet' }, { id: 404, arabic: 'تَعاوُن', turkish: 'Yardımlaşma' }, { id: 405, arabic: 'اِحْتِرام', turkish: 'Saygı' }, { id: 406, arabic: 'مَحَبَّة', turkish: 'Sevgi' }, { id: 407, arabic: 'شُكْر', turkish: 'Teşekkür' }, { id: 408, arabic: 'الِاعْتِذار', turkish: 'Özür dileme' }, { id: 409, arabic: 'رَحْمَة', turkish: 'Merhamet' }, { id: 410, arabic: 'صَبْر', turkish: 'Sabır' }, { id: 411, arabic: 'عَدْل', turkish: 'Adalet' }, { id: 412, arabic: 'تَواضُع', turkish: 'Alçakgönüllülük' }, { id: 413, arabic: 'يُساعِدُ', turkish: 'Yardım ediyor' }, { id: 414, arabic: 'يُحِبُّ', turkish: 'Seviyor' }, { id: 415, arabic: 'يَبْتَسِمُ', turkish: 'Gülümsüyor' } ] }, lesson2: { description: { tr: "Mutlu Aile" }, words: [ { id: 416, arabic: 'أُسْرَة', turkish: 'Aile' }, { id: 417, arabic: 'أَب', turkish: 'Baba' }, { id: 418, arabic: 'أُمّ', turkish: 'Anne' }, { id: 419, arabic: 'أَخ', turkish: 'Erkek kardeş' }, { id: 420, arabic: 'أُخْت', turkish: 'Kız kardeş' }, { id: 421, arabic: 'جَدّ', turkish: 'Dede' }, { id: 422, arabic: 'جَدَّة', turkish: 'Nine' }, { id: 423, arabic: 'عَمّ', turkish: 'Amca' }, { id: 424, arabic: 'عَمَّة', turkish: 'Hala' }, { id: 425, arabic: 'خال', turkish: 'Dayı' }, { id: 426, arabic: 'خالَة', turkish: 'Teyze' }, { id: 427, arabic: 'أَقارِب', turkish: 'Akrabalar' }, { id: 428, arabic: 'يَزورُ الأَقارِب', turkish: 'Akrabaları ziyaret ediyor' }, { id: 429, arabic: 'يَحْتَرِمُ الكِبار', turkish: 'Büyüklere saygı gösteriyor' }, { id: 430, arabic: 'يَرْحَمُ الصِّغار', turkish: 'Küçüklere merhamet ediyor' } ] } } }, 
            
unit2: { title: { tr: "2. Ünite" }, description: { tr: "Kendimi Keşfediyorum" }, lessons: { lesson1: { description: { tr: "Ben Kimim?" }, words: [ { id: 501, arabic: 'مَن أَنا؟', turkish: 'Ben kimim?' }, { id: 502, arabic: 'اِسْم', turkish: 'İsim' }, { id: 503, arabic: 'عُمْر', turkish: 'Yaş' }, { id: 504, arabic: 'مِهْنَة', turkish: 'Meslek' }, { id: 505, arabic: 'هِوايَة', turkish: 'Hobi' }, { id: 506, arabic: 'مَوْهِBَة', turkish: 'Yetenek' }, { id: 507, arabic: 'طَيِّب', turkish: 'İyi kalpli' }, { id: 508, arabic: 'مُجْتَهِد', turkish: 'Çalışkan' }, { id: 509, arabic: 'كَسول', turkish: 'Tembel' }, { id: 510, arabic: 'هادِئ', turkish: 'Sakin' }, { id: 511, arabic: 'نَشيط', turkish: 'Enerjik' }, { id: 512, arabic: 'مُبْتَسِم', turkish: 'Güleryüzlü' }, { id: 513, arabic: 'صَبور', turkish: 'Sabırlı' }, { id: 514, arabic: 'أَحْلامي', turkish: 'Hayallerim' }, { id: 515, arabic: 'مُسْتَقْبَل', turkish: 'Gelecek' } ] }, lesson2: { description: { tr: "Hobilerim" }, words: [ { id: 516, arabic: 'قِراءَة', turkish: 'Okuma' }, { id: 517, arabic: 'كِتابَة', turkish: 'Yazma' }, { id: 518, arabic: 'رَسْم', turkish: 'Resim yapma' }, { id: 519, arabic: 'طَبْخ', turkish: 'Yemek pişirme' }, { id: 520, arabic: 'تَصْوير', turkish: 'Fotoğrafçılık' }, { id: 521, arabic: 'رِياضَة', turkish: 'Spor' }, { id: 522, arabic: 'كُرَة القَدَم', turkish: 'Futbol' }, { id: 523, arabic: 'كُرَة السَّلَّة', turkish: 'Basketbol' }, { id: 524, arabic: 'سَفَر', turkish: 'Seyahat' }, { id: 525, arabic: 'طَبيعَة', turkish: 'Doğa' }, { id: 526, arabic: 'أَفْلام', turkish: 'Filmler' }, { id: 527, arabic: 'موسيقى', turkish: 'Müzik' }, { id: 528, arabic: 'مَكْتَبَة', turkish: 'Kütüphane' }, { id: 529, arabic: 'في الوَقْت الفارِغ', turkish: 'Boş zamanlarda' }, { id: 530, arabic: 'مُفيد', turkish: 'Faydalı' }, { id: 531, arabic: 'مُمْتِع', turkish: 'Eğlenceli' } ] } } }, 
            
unit3: { title: { tr: "3. Ünite" }, description: { tr: "Zaman ve Hayat" }, lessons: { lesson1: { description: { tr: "Zamanım ve Hayatım" }, words: [ { id: 601, arabic: 'وَقْتي', turkish: 'Zamanım' }, { id: 602, arabic: 'حَياتI', turkish: 'Hayatım' }, { id: 603, arabic: 'نَوْم', turkish: 'Uyku' }, { id: 604, arabic: 'عَمَل', turkish: 'Çalışma' }, { id: 605, arabic: 'اِسْتِراحَة', turkish: 'Dinlenme' }, { id: 606, arabic: 'نَهار', turkish: 'Gündüz' }, { id: 607, arabic: 'يُنَظِّمُ', turkish: 'Düzenliyor' }, { id: 608, arabic: 'يُخَطِّطُ', turkish: 'Planlıyor' }, { id: 609, arabic: 'يَدْرُسُ', turkish: 'Ders çalışıyor' }, { id: 610, arabic: 'يَسْتَريحُ', turkish: 'Dinleniyor' }, { id: 611, arabic: 'كُلّ يَوْم', turkish: 'Her gün' }, { id: 612, arabic: 'أَحْيانًا', turkish: 'Bazen' }, { id: 613, arabic: 'نادِرًا', turkish: 'Nadiren' }, { id: 614, arabic: 'دائِمًا', turkish: 'Her zaman' }, { id: 615, arabic: 'نَجاح', turkish: 'Başarı' } ] }, lesson2: { description: { tr: "Zamanımı Değerlendiriyorum" }, words: [ { id: 616, arabic: 'تَخْطيط', turkish: 'Planlama' }, { id: 617, arabic: 'فَشَل', turkish: 'Başarısızlık' }, { id: 618, arabic: 'جِدّ', turkish: 'Ciddiyet' }, { id: 619, arabic: 'كَسَل', turkish: 'Tembellik' }, { id: 620, arabic: 'حِكْمَة', turkish: 'Bilgelik' }, { id: 621, arabic: 'إِبْداع', turkish: 'Yaratıcılık' }, { id: 622, arabic: 'لا يُؤَجِّلُ', turkish: 'Ertelemiyor' }, { id: 623, arabic: 'يَسْتَغِلُّ الوَقْت', turkish: 'Zamanı değerlendiriyor' }, { id: 624, arabic: 'يُضَيِّعُ الوَقْت', turkish: 'Zamanı boşa harcıyor' }, { id: 625, arabic: 'يَوْم', turkish: 'Gün' }, { id: 626, arabic: 'أُسْبوع', turkish: 'Hafta' }, { id: 627, arabic: 'مُسْتَقْبَل', turkish: 'Gelecek' }, { id: 628, arabic: 'حاضِر', turkish: 'Şimdi' }, { id: 629, arabic: 'ماضي', turkish: 'Geçmiş' }, { id: 630, arabic: 'تَطْوير النَّفْس', turkish: 'Kendini geliştirme' } ] } } }, 
            
unit4: { title: { tr: "4. Ünite" }, description: { tr: "Sağlık ve Beslenme" }, lessons: { lesson1: { description: { tr: "Sağlıklı Yaşam" }, words: [ { id: 701, arabic: 'جِسْم', turkish: 'Vücut' }, { id: 702, arabic: 'عَقْل', turkish: 'Akıl' }, { id: 703, arabic: 'نَظّافَة', turkish: 'Temizlik' }, { id: 704, arabic: 'غِذاء', turkish: 'Beslenme' }, { id: 705, arabic: 'صِحَّة', turkish: 'Sağlık' }, { id: 706, arabic: 'مَرَض', turkish: 'Hastalık' }, { id: 707, arabic: 'طَبيب', turkish: 'Doktor' }, { id: 708, arabic: 'دَواء', turkish: 'İlaç' }, { id: 709, arabic: 'أَسْنان', turkish: 'Dişler' }, { id: 710, arabic: 'النَّظّافَة مِن الإِيمان', turkish: 'Temizlik imandandır' }, { id: 711, arabic: 'يُfERِّشُ الأَسْنان', turkish: 'Diş fırçalıyor' }, { id: 712, arabic: 'يَسْتَحِمُّ', turkish: 'Banyo yapıyor' }, { id: 713, arabic: 'يَnamُ مُبَكِّرًا', turkish: 'Erken uyuyor' }, { id: 714, arabic: 'صِحِّيّ', turkish: 'Sağlıklı' }, { id: 715, arabic: 'يُمارِسُ الرِّياضَة', turkish: 'Spor yapıyor' } ] }, 

lesson2: { description: { tr: "Sağlıklı Beslenme" }, words: [ { id: 716, arabic: 'فَواكِه', turkish: 'Meyveler' }, { id: 717, arabic: 'خُضْراوات', turkish: 'Sebzeler' }, { id: 718, arabic: 'لَحْم', turkish: 'Et' }, { id: 719, arabic: 'سَمَك', turkish: 'Balık' }, { id: 720, arabic: 'لَبَن', turkish: 'Süt' }, { id: 721, arabic: 'جُبْن', turkish: 'Peynir' }, { id: 222, arabic: 'بَيْض', turkish: 'Yumurta' }, { id: 723, arabic: 'خُبْz', turkish: 'Ekmek' }, { id: 724, arabic: 'ماء', turkish: 'Su' }, { id: 725, arabic: 'عَصير', turkish: 'Meyve suyu' }, { id: 726, arabic: 'الطَّعام السَّريع', turkish: 'Fast food' }, { id: 727, arabic: 'المَشْروبات الغازِيَة', turkish: 'Gazlı içecekler' }, { id: 728, arabic: 'فَطور', turkish: 'Kahvaltı' }, { id: 729, arabic: 'غَداء', turkish: 'Öğle yemeği' }, { id: 730, arabic: 'عَشاء', turkish: 'Akşam yemeği' } ] } } },
            unit5: { 
                title: { tr: "5. Ünite" }, 
                description: { tr: "Meslekler" }, 
                lessons: { 
                    lesson1: { 
                        description: { tr: "Meslekler" }, 
                        words: [ 
                            { id: 801, arabic: 'طَبيب', turkish: 'Doktor' }, 
                            { id: 802, arabic: 'مُهَنْدِس', turkish: 'Mühendis' }, 
                            { id: 803, arabic: 'مُعَلِّم', turkish: 'Öğretmen' }, 
                            { id: 804, arabic: 'شُرْطِيّ', turkish: 'Polis' }, 
                            { id: 805, arabic: 'طَبّاخ', turkish: 'Aşçı' }, 
                            { id: 806, arabic: 'فَلّاح', turkish: 'Çiftçi' }, 
                            { id: 807, arabic: 'طَيّار', turkish: 'Pilot' }, 
                            { id: 808, arabic: 'نَجّار', turkish: 'Marangoz' }, 
                            { id: 809, arabic: 'خَيّاط', turkish: 'Terzi' }, 
                            { id: 810, arabic: 'جَزّار', turkish: 'Kasap' } 
                        ] 
                    } 
                } 
            },
            unit6: { 
                title: { tr: "6. Ünite" }, 
                description: { tr: "Hava Durumu" }, 
                lessons: { 
                    lesson1: { 
                        description: { tr: "Hava Durumu" }, 
                        words: [ 
                            { id: 901, arabic: 'كَيْفَ الجَوّ؟', turkish: 'Hava nasıl?' }, 
                            { id: 902, arabic: 'حارّ', turkish: 'Sıcak' }, 
                            { id: 903, arabic: 'بارِد', turkish: 'Soğuk' }, 
                            { id: 904, arabic: 'مُشْمِس', turkish: 'Güneşli' }, 
                            { id: 905, arabic: 'مُمْطِر', turkish: 'Yağmurlu' }, 
                            { id: 906, arabic: 'مُثْلِج', turkish: 'Karlı' }, 
                            { id: 907, arabic: 'غائِم', turkish: 'Bulutlu' }, 
                            { id: 908, arabic: 'عاصِف', turkish: 'Rüzgarlı' }, 
                            { id: 909, arabic: 'مُعْتَدِل', turkish: 'Ilıman' }, 
                            { id: 910, arabic: 'السَّماء', turkish: 'Gökyüzü' } 
                        ] 
                    } 
                } 
            },
            unit7: { 
                title: { tr: "7. Ünite" }, 
                description: { tr: "Vücudumuz" }, 
                lessons: { 
                    lesson1: { 
                        description: { tr: "Vücut Organları" }, 
                        words: [ 
                            { id: 1001, arabic: 'رَأْس', turkish: 'Baş / Kafa' }, 
                            { id: 1002, arabic: 'عَيْن', turkish: 'Göz' }, 
                            { id: 1003, arabic: 'أَنْف', turkish: 'Burun' }, 
                            { id: 1004, arabic: 'فَم', turkish: 'Ağız' }, 
                            { id: 1005, arabic: 'أُذُن', turkish: 'Kulak' }, 
                            { id: 1006, arabic: 'يَد', turkish: 'El' }, 
                            { id: 1007, arabic: 'رِجْل', turkish: 'Ayak' }, 
                            { id: 1008, arabic: 'قَلْب', turkish: 'Kalp' }, 
                            { id: 1009, arabic: 'وَجْه', turkish: 'Yüz' }, 
                            { id: 1010, arabic: 'لِسان', turkish: 'Dil' } 
                        ] 
                    } 
                } 
            }
        } 
    }
};
    const Utils = { shuffleArray: (arr) => [...arr].sort(() => 0.5 - Math.random()) };

    const App = {
        state: {
            selectedPlayers: null, selectedLessonId: null, unlockedLessons: [],
            isAudioInitialized: false, audioCtx: null,
        },
        dom: {
            screens: document.querySelectorAll('.screen'), startScreen: document.getElementById('start-screen'),
            gameScreen: document.getElementById('quiz-screen'), resultsScreen: document.getElementById('results-screen'),
            playerSelect: document.getElementById('player-select'), lessonSelect: document.getElementById('lesson-select'),
            startGameBtn: document.getElementById('start-game-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            quizBackBtn: document.getElementById('quiz-back-btn')
        },
        init() {
            this.loadProgress(); this.initStartScreenListeners();
            this.initNavigation(); QuizGame.init(); this.showScreen('start-screen');
        },
        showScreen(screenId) {
            this.dom.screens.forEach(screen => screen.classList.remove('active'));
            const targetScreen = document.getElementById(screenId);
            if (targetScreen) { targetScreen.classList.add('active'); targetScreen.scrollTop = 0; }
            if (screenId === 'start-screen') {
                 this.state.selectedPlayers = null; this.state.selectedLessonId = null;
                 this.updateSelection(this.dom.playerSelect, null);
                 this.dom.lessonSelect.innerHTML = '<option value="" disabled selected>Önce Oyuncu Modu Seçin</option>';
                 this.dom.lessonSelect.disabled = true; this.checkStartButtonState();
            }
        },

        initAudio() {
            if (this.state.audioCtx && this.state.audioCtx.state === 'running') {
                this.state.isAudioInitialized = true;
                return Promise.resolve();
            }

            if (this.state.isAudioInitialized && this.state.audioCtx && this.state.audioCtx.state === 'suspended') {
                 return this.state.audioCtx.resume();
            }

            this.state.isAudioInitialized = true;

            try {
                if (!this.state.audioCtx) {
                    this.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }

                if (this.state.audioCtx.state === 'suspended') {
                    return this.state.audioCtx.resume();
                } else {
                    return Promise.resolve();
                }
            } catch (e) {
                console.error("Web Audio API desteklenmiyor.");
                this.state.isAudioInitialized = false;
                return Promise.reject(e);
            }
        },
        playSound(soundKey) {
            if (!this.state.isAudioInitialized || !this.state.audioCtx || this.state.audioCtx.state !== 'running') {
                console.warn(`Ses çalınamadı (durum: ${this.state.audioCtx?.state})`);
                return;
            }

            const sounds = { flip: { f: 200, t: 'triangle', d: 0.1 }, match: { f: 440, t: 'sine', d: 0.2 }, menuClick: { f: 600, t: 'square', d: 0.08 }, touch: { f: 300, t: 'sine', d: 0.05 }, correct: { f: 523.25, t: 'sine', d: 0.2 }, incorrect: { f: 164.81, t: 'square', d: 0.2 }, countdown: { f: 880, t: 'sine', d: 0.15 } }; const sound = sounds[soundKey]; if (!sound) return; const g = this.state.audioCtx.createGain(); g.connect(this.state.audioCtx.destination); g.gain.setValueAtTime(0, this.state.audioCtx.currentTime); g.gain.linearRampToValueAtTime(0.1, this.state.audioCtx.currentTime + 0.01); g.gain.linearRampToValueAtTime(0, this.state.audioCtx.currentTime + sound.d); const o = this.state.audioCtx.createOscillator(); o.type = sound.t; o.frequency.value = sound.f; o.connect(g); o.start(0); o.stop(this.state.audioCtx.currentTime + sound.d);
        },
        initStartScreenListeners() {
            this.dom.playerSelect.addEventListener('click', async e => {
                const button = e.target.closest('.player-button'); if (!button) return;
                try { await this.initAudio(); } catch (err) { console.warn("Ses başlatılamadı."); }
                this.playSound('touch');
                this.state.selectedPlayers = parseInt(button.dataset.players, 10);
                this.updateSelection(this.dom.playerSelect, button); this.populateLessonSelector();
                this.dom.lessonSelect.disabled = false; this.state.selectedLessonId = null;
                this.dom.lessonSelect.value = ""; this.checkStartButtonState();
            });
            
            this.dom.lessonSelect.addEventListener('change', async e => {
                 try { await this.initAudio(); } catch (err) { console.warn("Ses başlatılamadı."); }
                this.playSound('touch');
                this.state.selectedLessonId = e.target.value; this.checkStartButtonState();
            });

            this.dom.startGameBtn.onclick = async () => {
                try { await this.initAudio(); } catch (e) { console.error("Ses başlatılamadı:", e); }

                this.playSound('menuClick');

                const { selectedPlayers, selectedLessonId } = this.state;
                if (!selectedPlayers || !selectedLessonId) return;

                const words = this.getWords(selectedLessonId);
                let wordsForGame;

                if (selectedPlayers === 1) {
                    if (!words || words.length < 4) {
                         alert(`Bu ders için test oyunu oynamaya yetecek kadar (en az 4) kelime bulunmamaktadır.`);
                         return;
                    }
                    wordsForGame = Utils.shuffleArray(words);
                } else {
                    const questionCount = 5;
                    if (!words || words.length < 10) {
                         alert(`İki kişilik mod için bu derste yeterli kelime (en az 10) bulunmamaktadır. (Mevcut: ${words.length})`);
                         return;
                    }
                    wordsForGame = Utils.shuffleArray(words).slice(0, questionCount);
                }

                if (wordsForGame.length === 0) { alert("Bu ders için hiç kelime bulunamadı."); return; }

                QuizGame.start(wordsForGame, selectedPlayers);
                this.showScreen('quiz-screen');
            };
        },
        updateSelection(container, selectedButton) { container?.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected')); selectedButton?.classList.add('selected'); },
        checkStartButtonState() { this.dom.startGameBtn.disabled = !(this.state.selectedPlayers && this.state.selectedLessonId); },
        loadProgress() { const savedProgress = localStorage.getItem('unlockedQuizLessons'); if (savedProgress) { try { this.state.unlockedLessons = JSON.parse(savedProgress); if (!Array.isArray(this.state.unlockedLessons) || this.state.unlockedLessons.length === 0) { this.state.unlockedLessons = ['grade9-unit1-lesson1']; } } catch (e) { console.error("İlerleme yüklenirken hata:", e); this.state.unlockedLessons = ['grade9-unit1-lesson1']; } } else { this.state.unlockedLessons = ['grade9-unit1-lesson1']; } },
        saveProgress() { try { localStorage.setItem('unlockedQuizLessons', JSON.stringify(this.state.unlockedLessons)); } catch (e) { console.error("İlerleme kaydedilirken hata:", e); } },
        getAllLessonIdsOrdered() { const orderedIds = []; ['grade9', 'grade10'].forEach(gradeKey => { if (Data[gradeKey]?.words) { Object.keys(Data[gradeKey].words).sort().forEach(unitKey => { if (Data[gradeKey].words[unitKey]?.lessons) { Object.keys(Data[gradeKey].words[unitKey].lessons).sort().forEach(lessonKey => { orderedIds.push(`${gradeKey}-${unitKey}-${lessonKey}`); }); } }); } }); return orderedIds; },
        unlockNextLesson(completedLessonId) {
            const allLessonIds = this.getAllLessonIdsOrdered(); const completedIndex = allLessonIds.indexOf(completedLessonId);
            if (completedIndex > -1 && completedIndex < allLessonIds.length - 1) {
                const nextLessonId = allLessonIds[completedIndex + 1];
                if (!this.state.unlockedLessons.includes(nextLessonId)) {
                    this.state.unlockedLessons.push(nextLessonId); this.saveProgress();
                    console.log("Bir sonraki dersin kilidi açıldı:", nextLessonId); return true;
                }
            } else if (completedIndex === allLessonIds.length - 1) { console.log("Tüm dersler tamamlandı!"); return false; }
            return false;
        },
        populateLessonSelector() {
            if (!this.dom.lessonSelect) return;
            this.dom.lessonSelect.innerHTML = '<option value="" disabled selected>Ders Seçin</option>';
            const allLessonIds = this.getAllLessonIdsOrdered();
             allLessonIds.forEach(lessonId => {
                 const isUnlocked = this.state.unlockedLessons.includes(lessonId);
                 const parts = lessonId.split('-'); const gradeKey = parts[0]; const unitKey = parts[1]; const lessonKey = parts[2];
                 const lessonDesc = Data[gradeKey]?.words[unitKey]?.lessons[lessonKey]?.description?.tr || lessonKey;
const optionText = lessonDesc; // Sadece "Selamlaşma", "Tanışma" vb. görünür
                 const option = document.createElement('option');
                 option.value = lessonId;

                 if (this.state.selectedPlayers === 1 && !isUnlocked) {
                      option.textContent = `🔒 ${optionText}`;
                      option.disabled = true;
                 } else {
                     option.textContent = optionText;
                 }
                 this.dom.lessonSelect.appendChild(option);
             });
        },
        getWords(lessonId) { if (!lessonId) return []; try { const parts = lessonId.split('-'); const gradeKey = parts[0]; const unitKey = parts[1]; const lessonKey = parts[2]; return Data[gradeKey]?.words[unitKey]?.lessons[lessonKey]?.words || []; } catch (e) { console.error("Kelime alınırken hata:", e); return []; } },
        getAllWords() { return Object.values(Data).flatMap(grade => Object.values(grade.words).flatMap(unit => Object.values(unit.lessons).flatMap(lesson => lesson.words || []))); },
        initNavigation() {
            // Tam Ekran Butonu
            if(this.dom.fullscreenBtn){
                this.dom.fullscreenBtn.onclick = () => {
                     if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => {
                            console.log(`Hata: ${err.message}`);
                        });
                        document.body.classList.add('fullscreen');
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                            document.body.classList.remove('fullscreen');
                        }
                    }
                }
                // ESC vb. ile çıkılırsa ikonu düzelt
                document.addEventListener('fullscreenchange', () => {
                     if(!document.fullscreenElement) document.body.classList.remove('fullscreen');
                     else document.body.classList.add('fullscreen');
                });
            }

            // Quiz Ekranı Geri Butonu
            if(this.dom.quizBackBtn) {
                this.dom.quizBackBtn.onclick = () => {
                    this.playSound('menuClick');
                    this.showScreen('start-screen');
                    QuizGame.stop();
                };
            }
        },
        showResults(data) {
             const resultsScreen = document.getElementById('results-screen');
             // Sonuç ekranındaki geri butonu için HTML
             let htmlContent = `
             <div class="back-button-container">
                <button class="back-button" id="results-back-btn" title="Ana Menüye Dön">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
            </div>`;

             const iconSVG = `<svg viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>`;

             if (data.playerMode === 1) {
                 const finalScore = Math.round(data.score);

                 let starCount = 0;
                 if (finalScore >= 85) { starCount = 3; } else if (finalScore > 50 && finalScore <= 84) { starCount = 2; } else if (finalScore === 50) { starCount = 1; }

                 const getStarHtml = (count, size = "clamp(40px, 8vw, 60px)") => {
                     const starSVG = `<svg viewBox="0 0 24 24" style="width: ${size}; height: ${size};" fill="%s"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>`;
                     const filledStar = starSVG.replace('%s', 'var(--accent-color)');
                     const emptyStar = starSVG.replace('%s', '#eceff4');
                     let html = ''; for (let i = 0; i < 3; i++) { html += (i < count) ? filledStar : emptyStar; }
                     return `<div id="quiz-winner-icon-container" class="star-rating">${html}</div>`;
                 };

                 let title = ''; let messageHtml = '';
                 const starSize = (starCount === 3) ? "clamp(60px, 12vw, 90px)" : "clamp(40px, 8vw, 60px)";
                 const starHtml = getStarHtml(starCount, starSize);

                 if (starCount === 3) {
                     title = "Mükemmel!";
                     if (data.nextLessonUnlocked) { messageHtml = `<p class="unlocked-message">Bir sonraki seviyeye geçtiniz!</p>`; } else { messageHtml = `<p>Tebrikler! Tüm dersleri tamamladınız!</p>`; }
                 } else if (starCount === 2) { title = "İyi İş!"; messageHtml = `<p>Biraz daha gayretle 3 yıldıza ulaşabilirsin!</p>`; } else if (starCount === 1) { title = "Fena Değil!"; messageHtml = `<p>Tekrar deneyerek puanını yükseltebilirsin.</p>`; } else { title = "Tekrar Deneyin!"; messageHtml = `<p>Daha iyi bir sonuç için tekrar oyna.</p>`; }

                 htmlContent += `
                     <h2 id="quiz-win-text">${title}</h2>
                     ${starHtml}
                     <h3>Skor: ${finalScore} Puan</h3>
                     ${messageHtml}
                     <div class="win-buttons">
                         <button class="icon-btn" id="play-again-btn" title="Tekrar Oyna (Aynı Ders)"><svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg></button>
                         <button class="icon-btn" id="back-to-start-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button>
                     </div>`;

                 resultsScreen.innerHTML = htmlContent;
                 resultsScreen.querySelector('#results-back-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); }; // Üst sol geri tuşu
                 resultsScreen.querySelector('#play-again-btn').onclick = async () => {
                     await App.initAudio(); App.playSound('menuClick'); const words = App.getWords(App.state.selectedLessonId);
                     const questionCount = words.length; if(words.length < 4) { App.showScreen('start-screen'); return; }
                     QuizGame.start(Utils.shuffleArray(words), 1); App.showScreen('quiz-screen');
                 };
                 resultsScreen.querySelector('#back-to-start-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); };

             }
             else { // 2 Kişilik Mod
                 let text, winnerClass, iconHtml = '';
                 if (data.winner === 1) { text = '1. Oyuncu Kazandı!'; winnerClass = 'p1-win'; iconHtml = iconSVG; }
                 else if (data.winner === 2) { text = '2. Oyuncu Kazandı!'; winnerClass = 'p2-win'; iconHtml = iconSVG; }
                 else { text = 'Berabere!'; winnerClass = 'draw'; iconHtml = iconSVG + iconSVG; }
                 htmlContent += `
                     <div id="quiz-winner-icon-container" class="${winnerClass}">${iconHtml}</div>
                     <h2 id="quiz-win-text" class="${winnerClass}">${text}</h2>
                     <h3>Skor: ${data.score1} - ${data.score2}</h3>
                     <div class="win-buttons">
                         <button class="icon-btn" id="play-again-btn" title="Tekrar Oyna (Aynı Ders)"><svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg></button>
                         <button class="icon-btn" id="back-to-start-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button>
                     </div>`;
                 resultsScreen.innerHTML = htmlContent;
                 resultsScreen.querySelector('#results-back-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); };
                 resultsScreen.querySelector('#play-again-btn').onclick = async () => {
                     await App.initAudio(); App.playSound('menuClick'); const words = App.getWords(App.state.selectedLessonId);
                     const questionCount = 5; if(words.length < 10) { App.showScreen('start-screen'); return; }
                     QuizGame.start(Utils.shuffleArray(words).slice(0, questionCount), 2); App.showScreen('quiz-screen');
                 };
                 resultsScreen.querySelector('#back-to-start-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); };
             }
             this.showScreen('results-screen');
        }
    };

    const QuizGame = {
        screenId: 'quiz-screen',
        state: { allWordsPool: [], pointsPerQuestion: 0 },
        dom: { p1: {}, p2: {}, countdownOverlay: null, startOverlay: null, startBtn: null, },
        init() { this.state.allWordsPool = App.getAllWords().map(w => w.turkish); },
        start(questions, playerMode) {
            this.stop(); this.state.playerMode = playerMode;
            this.state.questionsPerRound = questions.length;
            this.state.p1Questions = Utils.shuffleArray([...questions]);
            this.state.p1Index = 0; this.state.p1Score = 0; this.state.p1Finished = false;
            this.state.answerLog = {};

            if (playerMode === 1) { this.state.pointsPerQuestion = 100 / this.state.questionsPerRound; } else { this.state.pointsPerQuestion = 0; }

            let p2_html = '';
            if (playerMode === 2) {
                const allWordsForUnit = App.getWords(App.state.selectedLessonId);
                const remainingWords = allWordsForUnit.filter(w => !this.state.p1Questions.some(p1w => p1w.id === w.id));
                if (remainingWords.length >= this.state.questionsPerRound) {
                    this.state.p2Questions = Utils.shuffleArray(remainingWords).slice(0, this.state.questionsPerRound);
                } else {
                    let p2Questions = Utils.shuffleArray([...this.state.p1Questions]);
                    let conflict = true;
                    while(conflict) {
                        conflict = false;
                        for (let i = 0; i < p2Questions.length; i++) {
                            if (p2Questions[i].id === this.state.p1Questions[i].id) {
                                conflict = true;
                                const next_i = (i + 1) % p2Questions.length;
                                [p2Questions[i], p2Questions[next_i]] = [p2Questions[next_i], p2Questions[i]];
                            }
                        }
                         if (p2Questions.length > 1 && p2Questions.every((q, i) => q.id === this.state.p1Questions[i].id)) {
                             p2Questions = Utils.shuffleArray([...p2Questions]);
                         }
                    }
                    this.state.p2Questions = p2Questions;
                }
                this.state.p2Index = 0; this.state.p2Score = 0; this.state.p2Finished = false;
                p2_html = `
                <div class="quiz-player-area p2">
                    <div class="score-effects-container"></div>
                    <div class="quiz-game-content hidden">
                        <div class="quiz-top-bar">
                            <div class="quiz-progress" id="quiz-progress-p2"></div>
                            <div class="progress-bar" id="quiz-progress-bar-p2"></div>
                        </div>
                        <div class="quiz-question" id="quiz-question-p2">...</div>
                        <div class="quiz-options" id="quiz-options-p2"></div>
                    </div>
                </div>`;
            }

            const quizScreen = document.getElementById('quiz-screen');
            quizScreen.className = "screen active";
            quizScreen.classList.add(playerMode === 1 ? 'single-player-mode' : 'two-player-mode');
            
            // Back Button korunarak içeriği güncelle
            const existingBackBtn = quizScreen.querySelector('.back-button-container');
            const backBtnHTML = existingBackBtn ? existingBackBtn.outerHTML : '';
            
            quizScreen.innerHTML = `
                ${backBtnHTML}
                <div class="countdown-overlay" id="quiz-countdown-overlay"></div>
                <div class="game-start-overlay" id="quiz-start-overlay">
                    <button id="quiz-start-btn">BAŞLA</button>
                </div>
                <div id="quiz-container">
                    <div class="quiz-player-area p1">
                        <div class="score-effects-container"></div>
                        <div class="quiz-game-content hidden">
                            <div class="quiz-top-bar">
                                <div class="quiz-progress" id="quiz-progress-p1"></div>
                                <div class="progress-bar" id="quiz-progress-bar-p1"></div>
                            </div>
                            <div class="quiz-question" id="quiz-question-p1">...</div>
                            <div class="quiz-options" id="quiz-options-p1"></div>
                        </div>
                    </div>
                    ${p2_html}
                </div>`;

            // Quiz içi geri butonu event'ini tekrar bağla
            const newQuizBackBtn = document.getElementById('quiz-back-btn');
            if(newQuizBackBtn){
                newQuizBackBtn.onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); this.stop(); };
            }

            this.dom.p1 = { area: quizScreen.querySelector('.quiz-player-area.p1'), progress: document.getElementById('quiz-progress-p1'), progressBar: document.getElementById('quiz-progress-bar-p1'), question: document.getElementById('quiz-question-p1'), options: document.getElementById('quiz-options-p1'), content: quizScreen.querySelector('.quiz-player-area.p1 .quiz-game-content'), effectsContainer: quizScreen.querySelector('.quiz-player-area.p1 .score-effects-container'), };
            if (playerMode === 2) {
                this.dom.p2 = { area: quizScreen.querySelector('.quiz-player-area.p2'), progress: document.getElementById('quiz-progress-p2'), progressBar: document.getElementById('quiz-progress-bar-p2'), question: document.getElementById('quiz-question-p2'), options: document.getElementById('quiz-options-p2'), content: quizScreen.querySelector('.quiz-player-area.p2 .quiz-game-content'), effectsContainer: quizScreen.querySelector('.quiz-player-area.p2 .score-effects-container'), };
                 this.createProgressBar(2);
            } else { this.dom.p2 = {}; }
            this.dom.countdownOverlay = document.getElementById('quiz-countdown-overlay');
            this.dom.startOverlay = document.getElementById('quiz-start-overlay');
            this.dom.startBtn = document.getElementById('quiz-start-btn');

            if (this.state.playerMode === 1) {
                if(this.dom.startOverlay) this.dom.startOverlay.style.display = 'none';
                this.startGameLoop();
            } else {
                 if(this.dom.startBtn) {
                     this.dom.startBtn.onclick = async () => {
                        try { await App.initAudio(); } catch(e) { console.error("Ses başlatılamadı:", e); }
                        App.playSound('menuClick');
                        if(this.dom.startOverlay) this.dom.startOverlay.style.display = 'none';
                        this.startCountdown();
                    };
                }
            }

            this.createProgressBar(1);
        },
        stop() { if (this.state.p1Timeout) clearTimeout(this.state.p1Timeout); this.state.p1Timeout = null; if (this.state.p2Timeout) clearTimeout(this.state.p2Timeout); this.state.p2Timeout = null; },
        startCountdown() { if(!this.dom.countdownOverlay) return; this.dom.countdownOverlay.style.display = 'flex'; let count = 3; this.dom.countdownOverlay.textContent = count; App.playSound('countdown'); const countdownInterval = setInterval(() => { count--; if (count > 0) { if(this.dom.countdownOverlay) this.dom.countdownOverlay.textContent = count; App.playSound('countdown'); } else { clearInterval(countdownInterval); if(this.dom.countdownOverlay) this.dom.countdownOverlay.style.display = 'none'; this.startGameLoop(); } }, 1000); },
        startGameLoop() {
             if(this.dom.p1.content) this.dom.p1.content.classList.remove('hidden');
             this.showQuestion(1);
             if (this.state.playerMode === 2 && this.dom.p2.content) {
                 this.dom.p2.content.classList.remove('hidden');
                 this.showQuestion(2);
             }
         },
        createProgressBar(playerNum) { const playerDom = (playerNum === 1) ? this.dom.p1 : this.dom.p2; if(!playerDom || !playerDom.progressBar) return; playerDom.progressBar.innerHTML = ''; for (let i = 0; i < this.state.questionsPerRound; i++) { const segment = document.createElement('div'); segment.className = 'progress-segment'; playerDom.progressBar.appendChild(segment); } },
        showQuestion(playerNum) {
            const playerState = (playerNum === 1) ? { q: this.state.p1Questions, i: this.state.p1Index, s: this.state.p1Score } : { q: this.state.p2Questions, i: this.state.p2Index, s: this.state.p2Score };
            const playerDom = (playerNum === 1) ? this.dom.p1 : this.dom.p2;
            if(!playerDom || !playerDom.question) return;

            if (playerState.i >= playerState.q.length) {
                if (playerNum === 1) this.state.p1Finished = true; else this.state.p2Finished = true;
                playerDom.question.textContent = 'Bitti!'; playerDom.options.innerHTML = '';
                const scoreIcon = `<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;

                let displayScore;
                if(this.state.playerMode === 1 && playerNum === 1) { displayScore = Math.round(playerState.s); } else { displayScore = playerState.s; }
                if(playerDom.progress) playerDom.progress.innerHTML = `<div class="quiz-score-display">${scoreIcon}<span>${displayScore}</span></div>`;

                if (this.state.playerMode === 1 || (this.state.p1Finished && this.state.p2Finished)) { this.endGame(); }
                return;
            }

            const word = playerState.q[playerState.i];
            if(playerDom.options) playerDom.options.classList.remove('answered');

            const scoreIcon = `<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;

            let displayScore;
            if (this.state.playerMode === 1 && playerNum === 1) { displayScore = Math.round(playerState.s); } else { displayScore = playerState.s; }
            if(playerDom.progress) playerDom.progress.innerHTML = `<div class="quiz-score-display">${scoreIcon}<span>${displayScore}</span></div>`;

            const segments = playerDom.progressBar?.children;
            if(segments) { Array.from(segments).forEach(seg => seg.classList.remove('active')); if(segments[playerState.i]) segments[playerState.i].classList.add('active'); }

playerDom.question.textContent = word.arabic;

// Şık sayısını tüm seviyeler için 5 olarak sabitledik
let optionCount = 5; 
const wrongAnswerCount = optionCount - 1;

// --- AKILLI ŞIK SEÇİMİ (5 ŞIKLI) ---
const currentLessonWords = App.getWords(App.state.selectedLessonId).map(w => w.turkish);
const otherWordsInLesson = currentLessonWords.filter(t => t !== word.turkish);

let wrongAnswers = [];

if (otherWordsInLesson.length >= wrongAnswerCount) {
    // Derste yeterli kelime varsa 4 yanlış şıkkı buradan seçer
    wrongAnswers = Utils.shuffleArray(otherWordsInLesson).slice(0, wrongAnswerCount);
} else {
    // Ders yetersizse derstekileri al, kalan boşlukları genel havuzdan tamamla
    const globalPool = this.state.allWordsPool.filter(t => t !== word.turkish && !otherWordsInLesson.includes(t));
    wrongAnswers = [
        ...otherWordsInLesson,
        ...Utils.shuffleArray(globalPool).slice(0, wrongAnswerCount - otherWordsInLesson.length)
    ];
}

const options = Utils.shuffleArray([word.turkish, ...wrongAnswers]);
// --- AKILLI ŞIK SEÇİMİ BİTİŞİ ---
            if (options.length < optionCount) {
                while(options.length < optionCount) {
                    const fallback = this.state.allWordsPool[Math.floor(Math.random() * this.state.allWordsPool.length)];
                    if (!options.includes(fallback)) { options.push(fallback); }
                    else if (options.length === optionCount -1) { options.push("...؟"); }
                }
            }

            if(playerDom.options) {
                playerDom.options.innerHTML = '';
                if (optionCount === 5) { playerDom.options.classList.add('five-options'); } else { playerDom.options.classList.remove('five-options'); }
            }
            options.forEach((text) => { const btn = document.createElement('button'); btn.className = 'quiz-option-btn'; btn.textContent = text; btn.onclick = (e) => this.checkAnswer(e.currentTarget, word.turkish, playerNum); if(playerDom.options) playerDom.options.appendChild(btn); });

            if(playerNum === 1) this.state.p1StartTime = Date.now(); else this.state.p2StartTime = Date.now();
        },
        checkAnswer(button, correctAnswer, playerNum) {
            App.playSound('touch');

            const timeTaken = (playerNum === 1) ? (Date.now() - this.state.p1StartTime) : (Date.now() - this.state.p2StartTime);
            const playerDom = (playerNum === 1) ? this.dom.p1 : this.dom.p2;
            const playerIndex = (playerNum === 1) ? this.state.p1Index : this.state.p2Index;
            if(!playerDom || !playerDom.options) return;

            Array.from(playerDom.options.children).forEach(btn => { btn.disabled = true; });
            button.classList.add('selected');
            const isCorrect = button.textContent.trim() === correctAnswer;

            if (this.state.playerMode === 1) {
                if (isCorrect) {
                    App.playSound('correct');
                    this.state.p1Score += this.state.pointsPerQuestion;
                    button.classList.add('correct');
                    this.showScoreEffect(1, Math.round(this.state.pointsPerQuestion));
                }
                else {
                    App.playSound('incorrect');
                    button.classList.add('incorrect', 'shake');
                    Array.from(playerDom.options.children).forEach(btn => { if (btn.textContent.trim() === correctAnswer) btn.classList.add('correct'); });
                }

                const segments = playerDom.progressBar?.children;
                if(segments?.[playerIndex]) segments[playerIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
                this.updateScoreDisplay(1);
                if(segments?.[playerIndex]) segments[playerIndex].classList.remove('active');
                this.state.p1Timeout = setTimeout(() => { this.state.p1Index++; this.showQuestion(1); }, 1500);
            } else {
                if (!this.state.answerLog[playerIndex]) { this.state.answerLog[playerIndex] = {}; }
                this.state.answerLog[playerIndex][playerNum] = { isCorrect, timeTaken, button };
                if (this.state.answerLog[playerIndex]?.[1] && this.state.answerLog[playerIndex]?.[2]) { this.processRoundResults(playerIndex); }
            }
        },
        processRoundResults(roundIndex) {
            const p1Answer = this.state.answerLog[roundIndex]?.[1]; const p2Answer = this.state.answerLog[roundIndex]?.[2]; const p1Dom = this.dom.p1; const p2Dom = this.dom.p2;
            if(!p1Answer || !p2Answer || !p1Dom || !p2Dom) return;
            p1Answer.button.classList.remove('selected'); p2Answer.button.classList.remove('selected');
            const p1CorrectAnswerText = this.state.p1Questions[roundIndex]?.turkish; const p2CorrectAnswerText = this.state.p2Questions[roundIndex]?.turkish;
            if(p1Dom.options && p1CorrectAnswerText) Array.from(p1Dom.options.children).forEach(btn => { if (btn.textContent.trim() === p1CorrectAnswerText) btn.classList.add('correct'); });
            if(p2Dom.options && p2CorrectAnswerText) Array.from(p2Dom.options.children).forEach(btn => { if (btn.textContent.trim() === p2CorrectAnswerText) btn.classList.add('correct'); });
            if(p1Dom.options) p1Dom.options.classList.add('answered'); if(p2Dom.options) p2Dom.options.classList.add('answered');
            if(!p1Answer.isCorrect) p1Answer.button.classList.add('incorrect', 'shake'); if(!p2Answer.isCorrect) p2Answer.button.classList.add('incorrect', 'shake');
            if (p1Answer.isCorrect) { this.state.p1Score += 10; this.showScoreEffect(1, 10); } if (p2Answer.isCorrect) { this.state.p2Score += 10; this.showScoreEffect(2, 10); }
            let bonusWinner = 0; if (p1Answer.isCorrect && p2Answer.isCorrect) { if (p1Answer.timeTaken < p2Answer.timeTaken) bonusWinner = 1; else if (p2Answer.timeTaken < p1Answer.timeTaken) bonusWinner = 2; } else if (p1Answer.isCorrect) bonusWinner = 1; else if (p2Answer.isCorrect) bonusWinner = 2;
            if (bonusWinner === 1) { this.state.p1Score += 10; setTimeout(() => this.showScoreEffect(1, 10, true), 400); } else if (bonusWinner === 2) { this.state.p2Score += 10; setTimeout(() => this.showScoreEffect(2, 10, true), 400); }
            if(p1Answer.isCorrect || p2Answer.isCorrect) App.playSound('correct'); if(!p1Answer.isCorrect || !p2Answer.isCorrect) App.playSound('incorrect');
            const p1Segments = p1Dom.progressBar?.children; const p2Segments = p2Dom.progressBar?.children;
            if(p1Segments?.[roundIndex]) p1Segments[roundIndex].classList.add(p1Answer.isCorrect ? 'correct' : 'incorrect'); if(p2Segments?.[roundIndex]) p2Segments[roundIndex].classList.add(p2Answer.isCorrect ? 'correct' : 'incorrect');
            this.updateScoreDisplay(1); this.updateScoreDisplay(2);
            if(p1Segments?.[roundIndex]) p1Segments[roundIndex].classList.remove('active'); if(p2Segments?.[roundIndex]) p2Segments[roundIndex].classList.remove('active');
            this.state.p1Timeout = setTimeout(() => { this.state.p1Index++; this.state.p2Index++; this.showQuestion(1); this.showQuestion(2); }, 2000);
        },
        showScoreEffect(playerNum, points, isBonus = false) { const container = (playerNum === 1) ? this.dom.p1?.effectsContainer : this.dom.p2?.effectsContainer; if(!container) return; const effectEl = document.createElement('div'); effectEl.className = 'score-effect'; if (isBonus) { effectEl.classList.add('bonus'); const lightningSVG = `<svg viewBox="0 0 24 24"><path d="M7,2V13H10V22L17,10H13L17,2H7Z" /></svg>`; effectEl.innerHTML = `${lightningSVG} +${points}`; effectEl.style.backgroundColor = 'var(--accent-color)'; const burstContainer = document.createElement('div'); burstContainer.className = 'burst-container'; for (let i = 0; i < 12; i++) { const particle = document.createElement('div'); particle.className = 'particle'; const angle = (i / 12) * 360; particle.style.setProperty('--angle', angle + 'deg'); burstContainer.appendChild(particle); } effectEl.appendChild(burstContainer); } else { effectEl.innerHTML = `+${points}`; effectEl.style.backgroundColor = 'var(--correct-color)'; } container.appendChild(effectEl); setTimeout(() => { effectEl.remove(); }, 1950); },
        updateScoreDisplay(playerNum) {
            const playerDom = (playerNum === 1) ? this.dom.p1 : this.dom.p2;
            if(!playerDom || !playerDom.progress) return;
            const score = (playerNum === 1) ? this.state.p1Score : this.state.p2Score;
            let displayScore;
            if (this.state.playerMode === 1 && playerNum === 1) { displayScore = Math.round(score); } else { displayScore = score; }
            const scoreIcon = `<svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`;
            playerDom.progress.innerHTML = `<div class="quiz-score-display">${scoreIcon}<span>${displayScore}</span></div>`;
        },
        endGame() {
            if (this.state.playerMode === 1) {
                const finalScore = this.state.p1Score;
                const isWin = finalScore >= 85;
                let nextLessonUnlocked = false;
                if (isWin) { nextLessonUnlocked = App.unlockNextLesson(App.state.selectedLessonId); }
                App.showResults({ playerMode: 1, score: finalScore, totalQuestions: this.state.questionsPerRound, isWin: isWin, nextLessonUnlocked: nextLessonUnlocked });
            } else {
                let winner = 0; if (this.state.p1Score > this.state.p2Score) winner = 1; else if (this.state.p2Score > this.state.p1Score) winner = 2;
                App.showResults({ playerMode: 2, score1: this.state.p1Score, score2: this.state.p2Score, totalQuestions: this.state.questionsPerRound, winner: winner });
            }
        }
    };

    App.init();

    });