document.addEventListener('DOMContentLoaded', () => {

    // --- DATA MODULE (TAMAMEN DÜZELTİLDİ) ---
    const Data = {
         grade9: { title: "Seviye 1", words: { unit1: { title: { tr: "1. Ünite" }, description: { tr: "Selamlaşma ve Tanışma" }, lessons: { lesson1: { description: { tr: "Selamlaşma" }, words: [ { id: 1, arabic: 'السَّلام عَلَيْكُمْ', turkish: 'Selam üzerinize olsun!' }, { id: 2, arabic: 'وَعَلَيْكُم السَّلام', turkish: 'Selam sizin de üzerinize olsun!' }, { id: 3, arabic: 'صَباح الخَيْر', turkish: 'Hayırlı Sabahlar' }, { id: 4, arabic: 'صَباح النّور', turkish: 'Günaydın' }, { id: 5, arabic: 'مَساء الخَيْر', turkish: 'İyi akşamlar' }, { id: 6, arabic: 'مَساء النّور', turkish: 'İyi akşamlar (cevap)' }, { id: 7, arabic: 'مَرْحَبًا', turkish: 'Merhaba!' }, { id: 8, arabic: 'أَهْلًا وَسَهْلًا', turkish: 'Hoş geldiniz!' }, { id: 9, arabic: 'أَهْلًا بِك', turkish: 'Hoş bulduk!' }, { id: 10, arabic: 'كَيْفَ حالُك؟', turkish: 'Nasılsın?' }, { id: 11, arabic: 'أَنا بِخَيْر', turkish: 'İyiyim!' }, { id: 12, arabic: 'إِلى اللِّقاء', turkish: 'Görüşmek üzere!' }, { id: 13, arabic: 'مَع السَّلامَة', turkish: 'Hoşça kal' }, { id: 14, arabic: 'في أَمان الّٰلهِ', turkish: 'Allah’a emanet ol' }, { id: 15, arabic: 'اِقْرَأْ', turkish: 'Oku!' }, { id: 16, arabic: 'اُكْتُبْ', turkish: 'Yaz!' }, { id: 17, arabic: 'أَعِدْ', turkish: 'Tekrar et!' }, { id: 18, arabic: 'اِسْتَمِعْ', turkish: 'Dinle!' } ] }, lesson2: { description: { tr: "Tanışma" }, words: [ { id: 19, arabic: 'طالِب', turkish: 'Erkek öğrenci' }, { id: 20, arabic: 'مُدَرِّس', turkish: 'Erkek öğretmen' }, { id: 21, arabic: 'صَديق', turkish: 'Erkek arkadaş' }, { id: 22, arabic: 'هُوَ', turkish: 'O (erkek)' }, { id: 23, arabic: 'هِيَ', turkish: 'O (kadın)' }, { id: 24, arabic: 'أَنْتَ', turkish: 'Sen (erkek)' }, { id: 25, arabic: 'أَنا', turkish: 'Ben' }, { id: 26, arabic: 'ما اسْمُك؟', turkish: 'Adın ne?' }, { id: 27, arabic: 'اِسْمي', turkish: 'Benim adım' }, { id: 28, arabic: 'مِن أَيْن؟', turkish: 'Nereli?' }, { id: 29, arabic: 'نَعَم', turkish: 'Evet' }, { id: 30, arabic: 'لا', turkish: 'Hayır' }, { id: 31, arabic: 'تَكَلَّمْ', turkish: 'Konuş' }, { id: 32, arabic: 'اُسْكُتْ', turkish: 'Sus' }, { id: 33, arabic: 'تَعالَ', turkish: 'Gel' }, { id: 34, arabic: 'اِذْهَبْ', turkish: 'Git' }, { id: 35, arabic: 'تَشَرَّفْتُ', turkish: 'Tanıştığıma memnun oldum' }, { id: 36, arabic: 'فُرْصَة سَعيدَة', turkish: 'Memnun oldum' }, { id: 37, arabic: 'شُكْرًا', turkish: 'Teşekkür ederim' }, { id: 38, arabic: 'عَفْوًا', turkish: 'Rica ederim' } ] } } }, unit2: { title: { tr: "2. Ünite" }, description: { tr: "Okulda" }, lessons: { lesson1: { description: { tr: "Sınıf Eşyaları" }, words: [ { id: 101, arabic: 'مَدْرَسَة', turkish: 'Okul' }, { id: 102, arabic: 'صَفّ', turkish: 'Sınıf' }, { id: 103, arabic: 'كِتاب', turkish: 'Kitap' }, { id: 104, arabic: 'دَفْتَر', turkish: 'Defter' }, { id: 105, arabic: 'قَلَم', turkish: 'Kalem' }, { id: 106, arabic: 'سَبّورة', turkish: 'Tahta' }, { id: 107, arabic: 'كُرْسِيّ', turkish: 'Sandalye' }, { id: 108, arabic: 'مَكْتَب', turkish: 'Masa' }, { id: 109, arabic: 'مِمْحاة', turkish: 'Silgi' }, { id: 110, arabic: 'مِسْطَرَة', turkish: 'Cetvel' }, { id: 111, arabic: 'حَقيبَة', turkish: 'Çanta' }, { id: 112, arabic: 'باب', turkish: 'Kapı' }, { id: 113, arabic: 'نافِذَة', turkish: 'Pencere' } ] }, lesson2: { description: { tr: "Yönler ve Eylemler" }, words: [ { id: 114, arabic: 'أَيْن؟', turkish: 'Nerede?' }, { id: 115, arabic: 'هُنا', turkish: 'Burada' }, { id: 116, arabic: 'هُناك', turkish: 'Orada' }, { id: 117, arabic: 'عَلى', turkish: 'Üstünde' }, { id: 118, arabic: 'تَحْت', turkish: 'Altında' }, { id: 119, arabic: 'أَمام', turkish: 'Önünde' }, { id: 120, arabic: 'خَلْف', turkish: 'Arkasında' }, { id: 121, arabic: 'فَوْق', turkish: 'Üzerinde' }, { id: 122, arabic: 'جَانِب', turkish: 'Yanında' }, { id: 123, arabic: 'فِي', turkish: 'İçinde' }, { id: 124, arabic: 'خَارِج', turkish: 'Dışında' }, { id: 125, arabic: 'اِفْتَح', turkish: 'Kitabı aç' }, { id: 126, arabic: 'اِجْلِسْ', turkish: 'Otur' }, { id: 127, arabic: 'اُدْخُلِ الصَّفَّ', turkish: 'Sınıfa gir' } ] } } }, unit3: { title: { tr: "3. Ünite" }, description: { tr: "Evde" }, lessons: { lesson1: { description: { tr: "Evdeyim" }, words: [ { id: 201, arabic: 'بَيْت', turkish: 'Ev' }, { id: 202, arabic: 'غُرْفَة', turkish: 'Oda' }, { id: 203, arabic: 'غُرْفَة النَّوْم', turkish: 'Yatak odası' }, { id: 204, arabic: 'غُرْفَة جُلوس', turkish: 'Oturma odası' }, { id: 205, arabic: 'مَطْبَخ', turkish: 'Mutfak' }, { id: 206, arabic: 'حَمّام', turkish: 'Banyo' }, { id: 207, arabic: 'سَرير', turkish: 'Yatak' }, { id: 208, arabic: 'طاوِلَة', turkish: 'Masa' }, { id: 209, arabic: 'كُرْسِيّ', turkish: 'Sandalye' }, { id: 210, arabic: 'تِلْفاز', turkish: 'Televizyon' }, { id: 211, arabic: 'ثَلّاجة', turkish: 'Buzdolabı' }, { id: 212, arabic: 'فُرْن', turkish: 'Fırın' }, { id: 213, arabic: 'سَجّادَة', turkish: 'Halı' }, { id: 214, arabic: 'هَاتِف', turkish: 'Telefon' }, { id: 215, arabic: 'مِصْباح', turkish: 'Lamba' } ] }, lesson2: { description: { tr: "Odamda" }, words: [ { id: 216, arabic: 'غُرْفَتي', turkish: 'Odam' }, { id: 217, arabic: 'سَرير', turkish: 'Yatak' }, { id: 218, arabic: 'مَكْتَب', turkish: 'Çalışma masası' }, { id: 219, arabic: 'كُرْسِيّ', turkish: 'Sandalye' }, { id: 220, arabic: 'سِتارَة', turkish: 'Perde' }, { id: 221, arabic: 'مِصْباح', turkish: 'Lamba' }, { id: 222, arabic: 'مِرْآة', turkish: 'Ayna' }, { id: 223, arabic: 'سَجّادَة', turkish: 'Halı' }, { id: 224, arabic: 'دُولاب', turkish: 'Dolap' }, { id: 225, arabic: 'نَظيف', turkish: 'Temiz' }, { id: 226, arabic: 'مُرَتَّب', turkish: 'Düzenli' }, { id: 227, arabic: 'وَسِخ', turkish: 'Kirli' }, { id: 228, arabic: 'يُنَظِّفُ', turkish: 'Temizliyor' }, { id: 229, arabic: 'يُرَتِّبُ', turkish: 'Düzenliyor' } ] } } }, unit4: { title: { tr: "4. Ünite" }, description: { tr: "Bir Günüm" }, lessons: { lesson1: { description: { tr: "Bir Günüm" }, words: [ { id: 301, arabic: 'صَباح', turkish: 'Sabah' }, { id: 302, arabic: 'ظُهْر', turkish: 'Öğle' }, { id: 303, arabic: 'مَساء', turkish: 'Akşam' }, { id: 304, arabic: 'لَيْل', turkish: 'Gece' }, { id: 305, arabic: 'يَسْتَيْقِظُ', turkish: 'Uyanıyor' }, { id: 306, arabic: 'يَغْسِلُ وَجْهَهُ', turkish: 'Yüzünü yıkıyor' }, { id: 307, arabic: 'يُصَلّي', turkish: 'Namaz kılıyor' }, { id: 308, arabic: 'يَلْبَسُ مَلابِسَهُ', turkish: 'Giyiniyor' }, { id: 309, arabic: 'يَتَناوَلُ الفَطور', turkish: 'Kahvaltı yapıyor' }, { id: 310, arabic: 'يَذْهَبُ إِلى المَدْرَسَة', turkish: 'Okula gidiyor' }, { id: 311, arabic: 'يَدْرُسُ', turkish: 'Ders çalışıyor' }, { id: 312, arabic: 'يَرْجِعُ إِلى البَيْت', turkish: 'Eve dönüyor' }, { id: 313, arabic: 'يَتَغَدّى', turkish: 'Öğle yemeği yiyor' }, { id: 314, arabic: 'يَسْتَريحُ', turkish: 'Dinleniyor' }, { id: 315, arabic: 'يَلْعَبُ', turkish: 'Oynuyor' } ] }, lesson2: { description: { tr: "Günlük Rutin" }, words: [ { id: 316, arabic: 'أَسْتَيْقِظُ مُبَكِّرًا', turkish: 'Erken uyanıyorum' }, { id: 317, arabic: 'أَذْهَبُ إِلى المَدْرَسَة', turkish: 'Okula gidiyorum' }, { id: 318, arabic: 'أُصَلّي صَلاة الظُّهْر', turkish: 'Öğle namazı kılıyorum' }, { id: 319, arabic: 'أَتَغَدّى مَع أُسْرَتي', turkish: 'Ailemle öğle yemeği yiyorum' }, { id: 320, arabic: 'أَقْرَأُ دُروسي', turkish: 'Derslerimi okuyorum' }, { id: 321, arabic: 'أَكْتُبُ واجِباتي', turkish: 'Ödev yazıyorum' }, { id: 322, arabic: 'أَلْعَبُ في السّاحَة', turkish: 'Bahçede oynuyorum' }, { id: 323, arabic: 'أُساعِدُ أُمّي', turkish: 'Anneme yardım ediyorum' }, { id: 324, arabic: 'أَزورُ جَدِي', turkish: 'Dedemi ziyaret ediyorum' }, { id: 325, arabic: 'أَذْهَبُ إِلى المَسْجِد', turkish: 'Camiye gidiyorum' }, { id: 326, arabic: 'أُرَتِّبُ سَريري', turkish: 'Yatağımı düzeltiyorum' }, { id: 327, arabic: 'أُنَظِّفُ غُرْفَتِي', turkish: 'Odamı temizliyorum' }, { id: 328, arabic: 'أُراجِعُ دُروسي', turkish: 'Derslerimi tekrar ediyorum' }, { id: 329, arabic: 'أَنامُ مُتَأَخِّرًا', turkish: 'Geç yatıyorum' } ] } } } } }, grade10: { title: "Seviye 2", words: { unit1: { title: { tr: "1. Ünite" }, description: { tr: "Değerlerim ve Ailem" }, lessons: { lesson1: { description: { tr: "Güzel Davranışlar" }, words: [ { id: 401, arabic: 'صِدْق', turkish: 'Doğruluk' }, { id: 402, arabic: 'أَمانَة', turkish: 'Güvenilirlik' }, { id: 403, arabic: 'إِخْلاص', turkish: 'Samimiyet' }, { id: 404, arabic: 'تَعاوُن', turkish: 'Yardımlaşma' }, { id: 405, arabic: 'اِحْتِرام', turkish: 'Saygı' }, { id: 406, arabic: 'مَحَبَّة', turkish: 'Sevgi' }, { id: 407, arabic: 'شُكْر', turkish: 'Teşekkür' }, { id: 408, arabic: 'الِاعْتِذار', turkish: 'Özür dileme' }, { id: 409, arabic: 'رَحْمَة', turkish: 'Merhamet' }, { id: 410, arabic: 'صَبْر', turkish: 'Sabır' }, { id: 411, arabic: 'عَدْل', turkish: 'Adalet' }, { id: 412, arabic: 'تَواضُع', turkish: 'Alçakgönüllülük' }, { id: 413, arabic: 'يُساعِدُ', turkish: 'Yardım ediyor' }, { id: 414, arabic: 'يُحِبُّ', turkish: 'Seviyor' }, { id: 415, arabic: 'يَبْتَسِمُ', turkish: 'Gülümsüyor' } ] }, lesson2: { description: { tr: "Mutlu Aile" }, words: [ { id: 416, arabic: 'أُسْرَة', turkish: 'Aile' }, { id: 417, arabic: 'أَب', turkish: 'Baba' }, { id: 418, arabic: 'أُمّ', turkish: 'Anne' }, { id: 419, arabic: 'أَخ', turkish: 'Erkek kardeş' }, { id: 420, arabic: 'أُخْت', turkish: 'Kız kardeş' }, { id: 421, arabic: 'جَدّ', turkish: 'Dede' }, { id: 422, arabic: 'جَدَّة', turkish: 'Nine' }, { id: 423, arabic: 'عَمّ', turkish: 'Amca' }, { id: 424, arabic: 'عَمَّة', turkish: 'Hala' }, { id: 425, arabic: 'خَال', turkish: 'Dayı' }, { id: 426, arabic: 'خالَة', turkish: 'Teyze' }, { id: 427, arabic: 'أَقارِب', turkish: 'Akrabalar' }, { id: 428, arabic: 'يَزورُ الأَقارِب', turkish: 'Akrabaları ziyaret ediyor' }, { id: 429, arabic: 'يَحْتَرِمُ الكِبار', turkish: 'Büyüklere saygı gösteriyor' }, { id: 430, arabic: 'يَرْحَمُ الصِّغار', turkish: 'Küçüklere merhamet ediyor' } ] } } }, unit2: { title: { tr: "2. Ünite" }, description: { tr: "Kendimi Keşfediyorum" }, lessons: { lesson1: { description: { tr: "Ben Kimim?" }, words: [ { id: 501, arabic: 'مَن أَنا؟', turkish: 'Ben kimim?' }, { id: 502, arabic: 'اِسْم', turkish: 'İsim' }, { id: 503, arabic: 'عُمْر', turkish: 'Yaş' }, { id: 504, arabic: 'مِهْنَة', turkish: 'Meslek' }, { id: 505, arabic: 'هِوايَة', turkish: 'Hobi' }, { id: 506, arabic: 'مَوْهِبَة', turkish: 'Yetenek' }, { id: 507, arabic: 'طَيِّب', turkish: 'İyi kalpli' }, { id: 508, arabic: 'مُجْتَهِد', turkish: 'Çalışkan' }, { id: 509, arabic: 'كَسول', turkish: 'Tembel' }, { id: 510, arabic: 'هادِئ', turkish: 'Sakin' }, { id: 511, arabic: 'نَشيط', turkish: 'Enerjik' }, { id: 512, arabic: 'مُبْتَسِم', turkish: 'Güleryüzlü' }, { id: 513, arabic: 'صَبور', turkish: 'Sabırlı' }, { id: 514, arabic: 'أَحْلامي', turkish: 'Hayallerim' }, { id: 515, arabic: 'مُسْتَقْبَل', turkish: 'Gelecek' } ] }, lesson2: { description: { tr: "Hobilerim" }, words: [ { id: 516, arabic: 'قِراءَة', turkish: 'Okuma' }, { id: 517, arabic: 'كِتابَة', turkish: 'Yazma' }, { id: 518, arabic: 'رَسْم', turkish: 'Resim yapma' }, { id: 519, arabic: 'طَبْخ', turkish: 'Yemek pişirme' }, { id: 520, arabic: 'تَصْوير', turkish: 'Fotoğrafçılık' }, { id: 521, arabic: 'رِياضَة', turkish: 'Spor' }, { id: 522, arabic: 'كُرَة القَدَم', turkish: 'Futbol' }, { id: 523, arabic: 'كُرَة السَّلَّة', turkish: 'Basketbol' }, { id: 524, arabic: 'سَفَر', turkish: 'Seyahat' }, { id: 525, arabic: 'طَبيعَة', turkish: 'Doğa' }, { id: 526, arabic: 'أَفْلام', turkish: 'Filmler' }, { id: 527, arabic: 'موسيقى', turkish: 'Müzik' }, { id: 528, arabic: 'مَكْتَبَة', turkish: 'Kütüphane' }, { id: 529, arabic: 'في الوَقْت الفارِغ', turkish: 'Boş zamanlarda' }, { id: 530, arabic: 'مُفيد', turkish: 'Faydalı' }, { id: 531, arabic: 'مُمْتِع', turkish: 'Eğlenceli' } ] } } }, unit3: { title: { tr: "3. Ünite" }, description: { tr: "Zaman ve Hayat" }, lessons: { lesson1: { description: { tr: "Zamanım ve Hayatım" }, words: [ { id: 601, arabic: 'وَقْتي', turkish: 'Zamanım' }, { id: 602, arabic: 'حَياتي', turkish: 'Hayatım' }, { id: 603, arabic: 'نَوْم', turkish: 'Uyku' }, { id: 604, arabic: 'عَمَل', turkish: 'Çalışma' }, { id: 605, arabic: 'اِسْتِراحَة', turkish: 'Dinlenme' }, { id: 606, arabic: 'نَهار', turkish: 'Gündüz' }, { id: 607, arabic: 'يُنَظِّمُ', turkish: 'Düzenliyor' }, { id: 608, arabic: 'يُخَطِّطُ', turkish: 'Planlıyor' }, { id: 609, arabic: 'يَدْرُسُ', turkish: 'Ders çalışıyor' }, { id: 610, arabic: 'يَسْتَريحُ', turkish: 'Dinleniyor' }, { id: 611, arabic: 'كُلّ يَوْم', turkish: 'Her gün' }, { id: 612, arabic: 'أَحْيانًا', turkish: 'Bazen' }, { id: 613, arabic: 'نادِرًا', turkish: 'Nadiren' }, { id: 614, arabic: 'دائِمًا', turkish: 'Her zaman' }, { id: 615, arabic: 'نَجاح', turkish: 'Başarı' } ] }, lesson2: { description: { tr: "Zamanımı Değerlendiriyorum" }, words: [ { id: 616, arabic: 'تَّخْطيط', turkish: 'Planlama' }, { id: 617, arabic: 'فَشَل', turkish: 'Başarısızlık' }, { id: 618, arabic: 'جِدّ', turkish: 'Ciddiyet' }, { id: 619, arabic: 'كَسَل', turkish: 'Tembellik' }, { id: 620, arabic: 'حِكْمَة', turkish: 'Bilgelik' }, { id: 621, arabic: 'إِبْداع', turkish: 'Yaratıcılık' }, { id: 622, arabic: 'لا يُؤَجِّلُ', turkish: 'Ertelemiyor' }, { id: 623, arabic: 'يَسْتَغِلُّ الوَقْت', turkish: 'Zamanı değerlendiriyor' }, { id: 624, arabic: 'يُضَيِّعُ الوَقْت', turkish: 'Zamanı boşa harcıyor' }, { id: 625, arabic: 'يَوْم', turkish: 'Gün' }, { id: 626, arabic: 'أُسْبوع', turkish: 'Hafta' }, { id: 627, arabic: 'مُسْتَقْبَل', turkish: 'Gelecek' }, { id: 628, arabic: 'حاضِر', turkish: 'Şimdi' }, { id: 629, arabic: 'مَاضي', turkish: 'Geçmiş' }, { id: 630, arabic: 'تَطْوير النَّفْس', turkish: 'Kendini geliştirme' } ] } } }, unit4: { title: { tr: "4. Ünite" }, description: { tr: "Sağlık ve Beslenme" }, lessons: { lesson1: { description: { tr: "Sağlıklı Yaşam" }, words: [ { id: 701, arabic: 'جِسْم', turkish: 'Vücut' }, { id: 702, arabic: 'عَقْل', turkish: 'Akıl' }, { id: 703, arabic: 'نَظّافَة', turkish: 'Temizlik' }, { id: 704, arabic: 'غِذاء', turkish: 'Beslenme' }, { id: 705, arabic: 'صِحَّة', turkish: 'Sağlık' }, { id: 706, arabic: 'مَرَض', turkish: 'Hastalık' }, { id: 707, arabic: 'طَبيب', turkish: 'Doktor' }, { id: 708, arabic: 'دَواء', turkish: 'İlaç' }, { id: 709, arabic: 'أَسْنان', turkish: 'Dişler' }, { id: 710, arabic: 'النَّظّافَة مِن الإِيمان', turkish: 'Temizlik imandandır' }, { id: 711, arabic: 'يُفَرِّشُ الأَسْنان', turkish: 'Diş fırçalıyor' }, { id: 712, arabic: 'يَسْتَحِمُّ', turkish: 'Banyo yapıyor' }, { id: 713, arabic: 'يَنامُ مُبَكِّرًا', turkish: 'Erken uyuyor' }, { id: 714, arabic: 'صِحِّيّ', turkish: 'Sağlıklı' }, { id: 715, arabic: 'يُمارِسُ الرِّياضَة', turkish: 'Spor yapıyor' } ] }, lesson2: { description: { tr: "Sağlıklı Beslenme" }, words: [ { id: 716, arabic: 'فَواكِه', turkish: 'Meyveler' }, { id: 717, arabic: 'خُضْراوات', turkish: 'Sebzeler' }, { id: 718, arabic: 'لَحْم', turkish: 'Et' }, { id: 719, arabic: 'سَمَك', turkish: 'Balık' }, { id: 720, arabic: 'لَبَن', turkish: 'Süt' }, { id: 721, arabic: 'جُبْن', turkish: 'Peynir' }, { id: 722, arabic: 'بَيْض', turkish: 'Yumurta' }, { id: 723, arabic: 'خُبْز', turkish: 'Ekmek' }, { id: 724, arabic: 'ماء', turkish: 'Su' }, { id: 725, arabic: 'عَصير', turkish: 'Meyve suyu' }, { id: 726, arabic: 'الطَّعام السَّريع', turkish: 'Fast food' }, { id: 727, arabic: 'المَشْروبات الغازِيَة', turkish: 'Gazlı içecekler' }, { id: 728, arabic: 'فَطور', turkish: 'Kahvaltı' }, { id: 729, arabic: 'غَداء', turkish: 'Öğle yemeği' }, { id: 730, arabic: 'عَشاء', turkish: 'Akşam yemeği' } ] } } } } }
    

   };
    





      // --- UTILS MODULE (normalizeForTyping güncellendi) ---
    const Utils = {
        shuffleArray: (arr) => [...arr].sort(() => 0.5 - Math.random()),
        stripHarakat: (text) => text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '').replace(/[؟?]/g, ''),
        normalizeForTyping: (text) => text
            .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
            .replace(/[أإآ]/g, 'ا') // Hemzeleri 'ا' yap
            .replace(/ى/g, 'ي')
            .replace(/[؟?]/g, '')
    };

    // --- APP MODULE ---
    const App = {
        state: { selectedDifficulty: null, gameSettings: { time: 120, wordCount: 10 }, allWords: [], isAudioInitialized: false, audioCtx: null, },
        dom: {
            screens: document.querySelectorAll('.screen'), startScreen: document.getElementById('start-screen'), typingScreen: document.getElementById('typing-screen'), resultsScreen: document.getElementById('results-screen'),
            difficultyOptions: null, startGameBtn: null,
        },
        init() {
            this.dom.difficultyOptions = document.querySelector('.difficulty-options'); this.dom.startGameBtn = document.getElementById('start-game-btn');
            if (!this.dom.difficultyOptions || !this.dom.startGameBtn) { console.error("Başlangıç ekranı elementleri bulunamadı!"); return; }
            this.initAudio(); this.loadAllWords(); this.initStartScreenListeners(); TypingGame.init(); this.showScreen('start-screen');
        },
        showScreen(screenId) { this.dom.screens.forEach(screen => screen.classList.remove('active')); const targetScreen = document.getElementById(screenId); if (targetScreen) { targetScreen.classList.add('active'); targetScreen.scrollTop = 0; } if (screenId === 'start-screen') { this.resetStartScreen(); } },
        initAudio() { if (this.state.audioCtx && this.state.audioCtx.state === 'running') return; try { if (!this.state.audioCtx) { this.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } if (this.state.audioCtx.state === 'suspended') { this.state.audioCtx.resume().then(() => { this.state.isAudioInitialized = true; }); } else { this.state.isAudioInitialized = true; } } catch (e) { console.error("Web Audio API desteklenmiyor."); this.state.isAudioInitialized = false; } },
        playSound(soundKey) { if (!this.state.isAudioInitialized || !this.state.audioCtx || this.state.audioCtx.state !== 'running') return; const sounds = { flip: { f: 200, t: 'triangle', d: 0.1 }, match: { f: 440, t: 'sine', d: 0.2 }, menuClick: { f: 600, t: 'square', d: 0.08 }, touch: { f: 300, t: 'sine', d: 0.05 }, correct: { f: 523.25, t: 'sine', d: 0.2 }, incorrect: { f: 164.81, t: 'square', d: 0.2 }, countdown: { f: 880, t: 'sine', d: 0.15 } }; const sound = sounds[soundKey]; if (!sound) return; const g = this.state.audioCtx.createGain(); g.connect(this.state.audioCtx.destination); g.gain.setValueAtTime(0, this.state.audioCtx.currentTime); g.gain.linearRampToValueAtTime(0.1, this.state.audioCtx.currentTime + 0.01); g.gain.linearRampToValueAtTime(0, this.state.audioCtx.currentTime + sound.d); const o = this.state.audioCtx.createOscillator(); o.type = sound.t; o.frequency.value = sound.f; o.connect(g); o.start(0); o.stop(this.state.audioCtx.currentTime + sound.d); },
        loadAllWords() { this.state.allWords = Object.values(Data).flatMap(grade => Object.values(grade.words).flatMap(unit => Object.values(unit.lessons).flatMap(lesson => lesson.words || []))).filter(word => word && word.arabic && !word.arabic.includes(' ')); console.log(`Toplam ${this.state.allWords.length} adet boşluksuz kelime yüklendi.`); },
        
        initStartScreenListeners() {
            if (this.dom.difficultyOptions) {
                this.dom.difficultyOptions.addEventListener('click', (e) => {
                    const button = e.target.closest('.difficulty-button');
                    if (!button) return;
                    this.initAudio(); 
                    console.log("Difficulty button clicked:", button.dataset.difficulty); this.playSound('menuClick');
                    this.state.selectedDifficulty = button.dataset.difficulty; this.updateSelection(this.dom.difficultyOptions, button);
                    switch (this.state.selectedDifficulty) {
                        case 'easy': this.state.gameSettings = { time: 120, wordCount: 10 }; break;
                        case 'medium': this.state.gameSettings = { time: 90, wordCount: 10 }; break;
                        case 'hard': this.state.gameSettings = { time: 60, wordCount: 10 }; break;
                        default: this.state.gameSettings = { time: 120, wordCount: 10 };
                    }
                    console.log("Selected difficulty:", this.state.selectedDifficulty, "Settings:", this.state.gameSettings); this.checkStartButtonState();
                });
            } else { console.error("Zorluk seçenekleri konteyneri bulunamadı!"); }
            
            if (this.dom.startGameBtn) {
                this.dom.startGameBtn.onclick = () => {
                    this.initAudio();
                    console.log("Start game button clicked"); App.playSound('menuClick');
                    if (!App.state.selectedDifficulty) return;
                    const wordsForGame = Utils.shuffleArray(App.state.allWords).slice(0, App.state.gameSettings.wordCount);
                    if (wordsForGame.length < App.state.gameSettings.wordCount) { alert(`Yeterli kelime bulunamadı (${wordsForGame.length}/${App.state.gameSettings.wordCount}). Lütfen daha fazla kelime ekleyin.`); return; }
                    TypingGame.start(wordsForGame, App.state.gameSettings); App.showScreen('typing-screen');
                };
            } else { console.error("Başla butonu bulunamadı!"); }
        },

        updateSelection(container, selectedButton) { if (!container) return; container.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected')); if (selectedButton) { selectedButton.classList.add('selected'); console.log("Applied 'selected' class to:", selectedButton.dataset.difficulty || 'button'); } },
        checkStartButtonState() { if (!this.dom.startGameBtn) return; this.dom.startGameBtn.disabled = !this.state.selectedDifficulty; console.log("Start button disabled:", this.dom.startGameBtn.disabled); },
        resetStartScreen() { this.state.selectedDifficulty = null; this.updateSelection(this.dom.difficultyOptions, null); this.checkStartButtonState(); TypingGame.stop(); },
        showResults(score, mistakes, accuracy, wpm, timeTaken) {
             const resultsScreen = document.getElementById('results-screen');
             resultsScreen.innerHTML = `
                 <div class="header-navigation"><button class="back-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path></svg></button></div>
                 <h2 id="results-title">Oyun Bitti!</h2>
                 <div class="results-stats">
                     <div class="results-stat-item">Skor: <strong id="results-score">${Math.round(score)}</strong></div>
                     <div class="results-stat-item">Doğruluk: <strong id="results-accuracy">${accuracy}%</strong></div>
                     <div class="results-stat-item">Dakikadaki Kelime Sayısı: <strong id="results-wpm">${wpm}</strong></div>
                     <div class="results-stat-item">Süre: <strong id="results-time">${Math.floor(timeTaken / 60)}dk ${timeTaken % 60}sn</strong></div>
                 </div>
                 <div id="results-details">
                     ${mistakes.length > 0 ? '<h3>Yanlış Yazılanlar:</h3>' : '<h3>Tebrikler! Hiç hatanız yok!</h3>'}
                     ${mistakes.length > 0 ? `<ul>${mistakes.map(m => `<li>
                        <div><span class="prompt">${m.prompt}:</span> <span class="user-answer">${m.incorrect}</span> ➜ <span class="correct-answer">${m.correct}</span></div>
                        <div class="turkish-translation">(Anlamı: ${m.turkish})</div>
                     </li>`).join('')}</ul>` : ''}
                 </div>
                 <div class="win-buttons">
                     <button class="icon-btn" id="play-again-btn" title="Tekrar Oyna (Aynı Zorluk)"><svg viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg></button>
                     <button class="icon-btn" id="change-difficulty-btn" title="Yeni Zorluk Seç"><svg viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg></button>
                 </div>
             `;
              resultsScreen.querySelector('.back-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); };
              document.getElementById('play-again-btn').onclick = () => { App.playSound('menuClick'); const wordsForGame = Utils.shuffleArray(this.state.allWords).slice(0, this.state.gameSettings.wordCount); if (wordsForGame.length < this.state.gameSettings.wordCount) { alert("Yeterli kelime bulunamadı."); return; } TypingGame.start(wordsForGame, this.state.gameSettings); App.showScreen('typing-screen'); };
              document.getElementById('change-difficulty-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); };
             this.showScreen('results-screen');
         }
    };

    // --- TYPING GAME MODULE ---
    const TypingGame = {
        screenId: 'typing-screen',
        state: { words: [], currentIndex: 0, score: 0, timeLeft: 120, timer: null, mistakes: [], nextWordTimeout: null, totalCharsInRound: 0, correctChars: 0, totalTypedChars: 0, startTime: null, endTime: null },
        dom: {},
        init() { /* Listenerlar start içinde eklenecek */ },
        start(words, settings) {
             this.state = { words: words, currentIndex: 0, score: 0, timeLeft: settings.time, timer: null, mistakes: [], nextWordTimeout: null, totalCharsInRound: words.reduce((acc, word) => acc + Utils.normalizeForTyping(word.arabic).length, 0) || 1, correctChars: 0, totalTypedChars: 0, startTime: null, endTime: null };
            const typingScreen = document.getElementById('typing-screen');
            typingScreen.innerHTML = `
                <div class="header-navigation"><button class="back-btn" title="Ana Menü"><svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path></svg></button></div>
                <div id="typing-main-container"> <div id="typing-game-area"> <div id="typing-interactive-elements">
                    <div class="typing-stats">
                         <div class="stat-item" id="score-stat-item"> <div class="score-effects-container-typing"></div> <svg viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg> <span id="score-value">0</span> </div>
                         <div class="stat-item" id="timer-stat-item"> <svg viewBox="0 0 24 24"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"></path></svg> <span id="timer-value">00:00</span> </div>
                    </div>
                    <div class="progress-container">
                        <div class="word-progress-bar" id="typing-progress-bar"></div>
                    </div>
                    <div id="typing-prompt">Kelime Yükleniyor...</div>
                    <div class="typing-input-area"> <input inputmode="none" autocomplete="off" id="typing-input" readonly spellcheck="false" type="text"/ tabindex="-1">
                    <div id="typing-input-proxy" class="typing-input-proxy" aria-hidden="false"></div> <button id="typing-submit-btn"><svg viewBox="0 0 24 24"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"></path></svg></button> </div>
                </div> <div id="virtual-keyboard"></div> </div> </div> <div class="countdown-overlay" id="countdown-overlay"></div>`;
            
            // --- DÜZELTME (Samsung Klavye Sorunu) ---
            // 'pointerdown' listener'ı, artık 'proxy' (görünür) elemanı da doğrudan güncelliyor.
            (function(){
              const inputEl = document.getElementById('typing-input');
              const proxyEl = document.getElementById('typing-input-proxy'); // GÖRÜNÜR ELEMAN EKLENDİ
              const vk = document.getElementById('virtual-keyboard');
              if (!inputEl || !vk || !proxyEl) return;

              let lastStamp = -1;
              const fireInput = () => {
                const ev = new Event('input', { bubbles: true });
                inputEl.dispatchEvent(ev);
              };

              /* OTOMATİK GEÇİŞ: kelime doğru tamamlandığı anda onay tuşunu
                 beklemeden kontrol tetiklenir ve sonraki kelimeye geçilir. */
              const otoKontrol = () => {
                const st = TypingGame.state;
                if (!st || !st.words || inputEl.disabled) return;
                const hedef = st.words[st.currentIndex];
                if (!hedef) return;
                const yazilan = Utils.normalizeForTyping((inputEl.value || '').trim());
                if (yazilan && yazilan === Utils.normalizeForTyping(hedef.arabic)) {
                  setTimeout(() => TypingGame.checkAnswer(), 130);
                }
              };
              inputEl.addEventListener('input', otoKontrol);
              
              const appendChar = (ch) => {
                const newVal = (inputEl.value || '') + ch;
                inputEl.value = newVal; // Mantıksal (gizli) input'u güncelle
                proxyEl.textContent = newVal; // Görsel (proxy) div'i güncelle
                App.playSound('touch');
                fireInput();
              };
              
              const backspace = () => {
                const newVal = (inputEl.value || '').slice(0, -1);
                inputEl.value = newVal; // Mantıksal (gizli) input'u güncelle
                proxyEl.textContent = newVal; // Görsel (proxy) div'i güncelle
                App.playSound('touch');
                fireInput();
              };
              const insertSpace = () => appendChar(' ');

              vk.addEventListener('pointerdown', (e) => {
                const key = e.target.closest('.keyboard-key');
                if (!key) return;
                if (e.timeStamp === lastStamp) return; // guard
                lastStamp = e.timeStamp;
                e.preventDefault();

                if (key.classList.contains('backspace')) { backspace(); return; }
                if (key.classList.contains('space-bar')) { insertSpace(); return; }

                let ch = key.getAttribute('data-key');
                if (!ch) {
                  ch = (key.textContent || '').replace(/\s+/g, ' ').trim();
                }
                if (!ch) return;
                appendChar(ch);
              }, { passive: false });
            })();

            // --- DÜZELTME (Samsung Klavye Sorunu) ---
            // 'Mobile Input Bridge' (Object.defineProperty kullanan) bloğunun tamamı
            // platforma özel hataya neden olduğu için SİLİNDİ.
            

            // --- Start prompt visual direction control ---
            (function(){
                const promptEl = document.getElementById('typing-prompt');
                if (!promptEl) return;
                const applyStartModeDir = () => {
                    if (promptEl.classList.contains('start-mode')) {
                        promptEl.textContent = 'Hazır';
                        promptEl.setAttribute('dir','ltr');
                    }
                };
                applyStartModeDir();
                const observer = new MutationObserver(() => {
                    if (!promptEl.classList.contains('start-mode')) {
                        promptEl.setAttribute('dir','rtl');
                    } else {
                        applyStartModeDir();
                    }
                });
                observer.observe(promptEl, { attributes: true, attributeFilter: ['class'] });
            })();

            this.dom = { timer: document.getElementById('timer-value'), score: document.getElementById('score-value'), prompt: document.getElementById('typing-prompt'), input: document.getElementById('typing-input'), submit: document.getElementById('typing-submit-btn'), progressBar: document.getElementById('typing-progress-bar'), keyboard: document.getElementById('virtual-keyboard'), countdownOverlay: document.getElementById('countdown-overlay'), effectsContainer: typingScreen.querySelector('.score-effects-container-typing') };
            typingScreen.querySelector('.back-btn').onclick = () => { App.playSound('menuClick'); App.showScreen('start-screen'); this.stop(); };
            this.dom.input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); this.checkAnswer(); } }; this.dom.submit.onclick = () => this.checkAnswer();
            this.dom.score.textContent = '0'; this.updateTimerDisplay();
            this.dom.prompt.textContent = 'Hazır'; this.dom.prompt.className = 'start-mode'; this.dom.prompt.onclick = () => this.handleStartClick();
            
            this.dom.input.disabled = true; this.dom.input.readOnly = true; this.dom.input.value = '';
            
            // DÜZELTME (UI Senkronizasyonu): Proxy'yi de temizle
            const proxyEl = document.getElementById('typing-input-proxy');
            if (proxyEl) proxyEl.textContent = '';
            
            this.createKeyboard(); this.createWordProgressBar();
        },
        handleStartClick() { if (this.dom.prompt?.classList.contains('start-mode')) { App.playSound('menuClick'); this.dom.prompt.classList.remove('start-mode'); this.dom.prompt.onclick = null; this.startCountdown(); } },
        stop() { if (this.state.timer) clearInterval(this.state.timer); this.state.timer = null; if (this.state.nextWordTimeout) clearTimeout(this.state.nextWordTimeout); this.state.nextWordTimeout = null; },
        startCountdown() { if(!this.dom.countdownOverlay) return; this.dom.countdownOverlay.style.display = 'flex'; let count = 3; this.dom.countdownOverlay.textContent = count; App.playSound('countdown'); if(this.dom.prompt) this.dom.prompt.textContent = ''; const countdownInterval = setInterval(() => { count--; if (count > 0) { if(this.dom.countdownOverlay) this.dom.countdownOverlay.textContent = count; App.playSound('countdown'); } else { clearInterval(countdownInterval); if(this.dom.countdownOverlay) this.dom.countdownOverlay.style.display = 'none'; this.startGameLoop(); } }, 1000); },
        startGameLoop() { if(!this.dom.input) return; this.state.startTime = Date.now(); this.dom.input.disabled = false; this.dom.input.readOnly = false; try { this.dom.input.focus(); } catch(e) { console.warn("Input focus failed:", e); } this.showNextWord(); if(this.state.timer === null) { this.state.timer = setInterval(() => { this.state.timeLeft--; this.updateTimerDisplay(); if (this.state.timeLeft <= 0) { this.endGame(); } }, 1000); } },
        createWordProgressBar() {
            if(!this.dom.progressBar || !this.state.words) return;
            this.dom.progressBar.innerHTML = '';
            this.state.words.forEach((word, index) => {
                const wordEl = document.createElement('span');
                wordEl.className = 'word-progress-item';
                wordEl.textContent = Utils.stripHarakat(word.arabic);
                wordEl.dataset.index = index;
                this.dom.progressBar.appendChild(wordEl);
            });
        },
        showNextWord() {
             if(!this.dom.prompt || !this.dom.input || !this.dom.progressBar || !this.state.words) return;
             if (this.state.currentIndex >= this.state.words.length) { this.endGame(); return; }
             const word = this.state.words[this.state.currentIndex];
             this.dom.prompt.textContent = Utils.stripHarakat(word.arabic);
             this.dom.input.value = ''; this.dom.input.className = '';
             
             // DÜZELTME (UI Senkronizasyonu): Proxy'yi de temizle
             const proxyEl = document.getElementById('typing-input-proxy');
             if(proxyEl) proxyEl.textContent = '';
             
             if (!this.dom.input.disabled) { try { this.dom.input.focus(); } catch(e) {} }
             const wordItems = this.dom.progressBar.children;
             Array.from(wordItems).forEach(item => item.classList.remove('active'));
             if (wordItems[this.state.currentIndex]) {
                 wordItems[this.state.currentIndex].classList.add('active');
                  wordItems[this.state.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
             }
         },
        updateTimerDisplay() { if(!this.dom.timer) return; const minutes = Math.floor(Math.max(0, this.state.timeLeft) / 60); const seconds = Math.max(0, this.state.timeLeft) % 60; this.dom.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; },
        checkAnswer() {
            if (!this.dom.input || !this.dom.progressBar || !this.state.words) return;
            const userAnswer = this.dom.input.value.trim(); // Mantık hala gizli input'tan çalışır
            if (userAnswer === '' || this.dom.input.disabled || this.state.currentIndex >= this.state.words.length) return;
            this.dom.input.disabled = true;
            const word = this.state.words[this.state.currentIndex];
            const normalizedCorrect = Utils.normalizeForTyping(word.arabic);
            const normalizedUser = Utils.normalizeForTyping(userAnswer);
            const isCorrect = normalizedUser === normalizedCorrect;
            this.state.totalTypedChars += normalizedUser.length;
             const wordItems = this.dom.progressBar.children;
             if (wordItems[this.state.currentIndex]) {
                 wordItems[this.state.currentIndex].classList.remove('active');
                 wordItems[this.state.currentIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
             }
            if (isCorrect) {
                App.playSound('correct'); const wordChars = normalizedCorrect.length; this.state.correctChars += wordChars; let points = (wordChars / this.state.totalCharsInRound) * 100; this.state.score += points; this.showScoreEffect(Math.round(points)); if(this.dom.score) this.dom.score.textContent = Math.round(this.state.score);
                this.dom.input.classList.add('correct-input');
            } else {
                App.playSound('incorrect');
                this.state.mistakes.push({ prompt: word.arabic, incorrect: userAnswer, correct: word.arabic, turkish: word.turkish });
                this.dom.input.classList.add('incorrect-input');
            }
            this.state.currentIndex++;
            if (this.state.currentIndex >= this.state.words.length || this.state.timeLeft <= 0) { this.endGame(); } else { if (this.state.nextWordTimeout) clearTimeout(this.state.nextWordTimeout); this.state.nextWordTimeout = setTimeout(() => { if (this.state.timeLeft > 0 && this.dom.input) { this.dom.input.disabled = false; this.showNextWord(); } else if (this.state.timeLeft <= 0) { this.endGame(); } this.state.nextWordTimeout = null; }, 800); }
        },
        endGame() { this.stop(); this.state.endTime = Date.now(); if (this.dom.input) this.dom.input.disabled = true; const timeTakenSeconds = Math.max(1, Math.round(((this.state.endTime || Date.now()) - (this.state.startTime || Date.now() - (App.state.gameSettings.time * 1000))) / 1000)); const timeTakenMinutes = timeTakenSeconds / 60; const wpm = Math.round((this.state.correctChars / 5) / timeTakenMinutes) || 0; const attemptedWords = this.state.currentIndex; const correctWords = Math.max(0, attemptedWords - this.state.mistakes.length); /* ADIL OLCUM: payda denenen degil HEDEF kelime sayisi — bos/yarim oturum %100 gorunemez */ const hedefKelime = (this.state.words && this.state.words.length) || 10; const accuracy = Math.round((correctWords / hedefKelime) * 100); try{ if(window.KidefGorev && KidefGorev.aktif) KidefGorev.bildir({dogru: correctWords, toplam: hedefKelime, zorluk: App.state.selectedDifficulty || null, mod: '1p', sureSn: timeTakenSeconds}); }catch(e){} App.showResults(this.state.score, this.state.mistakes, accuracy, wpm, App.state.gameSettings.time - Math.max(0, this.state.timeLeft)); },
        showScoreEffect(points) { if (!this.dom.effectsContainer || points <= 0) return; const effectEl = document.createElement('div'); effectEl.className = 'typing-score-effect'; effectEl.textContent = `+${points}`; this.dom.effectsContainer.appendChild(effectEl); setTimeout(() => { effectEl.remove(); }, 1450); },
        createKeyboard() {
            if(!this.dom.keyboard) return;
            this.dom.keyboard.innerHTML = '';
            const colorMap={'ب':'#a0c4ff','ت':'#a0c4ff','ث':'#a0c4ff','ن':'#a0c4ff','ي':'#a0c4ff','ج':'#caffbf','ح':'#caffbf','خ':'#caffbf','د':'#fdffb6','ذ':'#fdffb6','ر':'#ffd6a5','ز':'#ffd6a5','س':'#ffadad','ش':'#ffadad','ص':'#bdb2ff','ض':'#bdb2ff','ط':'#9bf6ff','ظ':'#9bf6ff','ع':'#ffc6ff','غ':'#ffc6ff','ف':'#b9f6ca','ق':'#b9f6ca','ه':'#b3e5fc','ة':'#b3e5fc','ء':'#ffccbc','ؤ':'#ffccbc','ئ':'#ffccbc','ا':'#e0e0e0','ل':'#e0e0e0','ك':'#d1c4e9','م':'#f8bbd0','و':'#c5cae9'}; const defaultColor='#FFFFFF';
            const keys = [
                ["د","ج","ح","خ","ه","ع","غ","ف","ق","ث","ص","ض"],
                ["ط","ك","م","ن","ت","ا","ل","ب","ي","س","ش","ذ"],
                ["ظ","ز","و","ة","ى","ر","ؤ","ء","ئ"]
            ];
            keys.forEach(row => { const rowDiv = document.createElement('div'); rowDiv.className = 'keyboard-row'; row.forEach(key => { const keyBtn = document.createElement('button'); keyBtn.className = 'keyboard-key'; keyBtn.textContent = key; const bgColor = colorMap[key] || defaultColor; const shadowColor = this.getDarkerColor(bgColor); keyBtn.style.backgroundColor = bgColor; keyBtn.style.boxShadow = `0 4px ${shadowColor}`; keyBtn.onmousedown = () => { keyBtn.style.transform = 'translateY(2px)'; keyBtn.style.boxShadow = `0 2px ${shadowColor}`; }; keyBtn.onmouseup = () => { keyBtn.style.transform = ''; keyBtn.style.boxShadow = `0 4px ${shadowColor}`; }; keyBtn.onmouseleave = () => { keyBtn.style.transform = ''; keyBtn.style.boxShadow = `0 4px ${shadowColor}`; }; rowDiv.appendChild(keyBtn); }); this.dom.keyboard.appendChild(rowDiv); });
            const specialRow=document.createElement('div'); specialRow.className='keyboard-row'; const spaceBtn=document.createElement('button'); spaceBtn.className='keyboard-key space-bar'; spaceBtn.textContent='مسافة'; spaceBtn.style.flexGrow='8'; const spaceBg='#CFD8DC'; const spaceShadow=this.getDarkerColor(spaceBg); spaceBtn.style.backgroundColor=spaceBg; spaceBtn.style.boxShadow=`0 4px ${spaceShadow}`; spaceBtn.onmousedown=()=>{spaceBtn.style.transform='translateY(2px)';spaceBtn.style.boxShadow=`0 2px ${spaceShadow}`;}; spaceBtn.onmouseup=()=>{spaceBtn.style.transform='';spaceBtn.style.boxShadow=`0 4px ${spaceShadow}`;}; const backspaceBtn=document.createElement('button'); backspaceBtn.className='keyboard-key backspace'; backspaceBtn.style.flexGrow='1.5'; backspaceBtn.innerHTML=`<svg viewBox="0 0 24 24"><path d="M22,3H7C6.31,3 5.77,3.35 5.41,3.88L0,12L5.41,20.11C5.77,20.64 6.31,21 7,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12L19,15.59Z" /></svg>`; const backspaceBg='#e5e9f0'; const backspaceShadow=this.getDarkerColor(backspaceBg); backspaceBtn.style.backgroundColor=backspaceBg; backspaceBtn.style.boxShadow=`0 4px ${backspaceShadow}`; backspaceBtn.onmousedown=()=>{backspaceBtn.style.transform='translateY(2px)';backspaceBtn.style.boxShadow=`0 2px ${backspaceShadow}`;}; backspaceBtn.onmouseup=()=>{backspaceBtn.style.transform='';backspaceBtn.style.boxShadow=`0 4px ${backspaceShadow}`;}; specialRow.appendChild(backspaceBtn); specialRow.appendChild(spaceBtn); this.dom.keyboard.appendChild(specialRow);
        },
        getDarkerColor(hex) { if(!hex || hex.length < 4) return '#aaaaaa'; if(hex.length === 4) hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3]; let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16); r=Math.max(0,Math.floor(r*0.85)); g=Math.max(0,Math.floor(g*0.85)); b=Math.max(0,Math.floor(b*0.85)); return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`; }
    };

    App.init();

    });

            // --- Optional: set CSS var to item count ---
            (function(){
              const bar = document.querySelector('.word-progress-bar');
              if (!bar) return;
              const items = bar.querySelectorAll('.word-progress-item');
              if (items.length){
                bar.style.setProperty('--progress-count', items.length);
              }
            })();

/* ================================ */

/* --- DEĞİŞİKLİK YAPILDI: TÜM CİHAZLARDA OSK/Fiziksel Klavyeyi Kapat --- */
(function () {
  // const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  // if (!isTouch) return;

  function patchInput(el) {
    if (!el) return;
    el.setAttribute('inputmode', 'none');
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('autocapitalize', 'off');
    el.spellcheck = false;
    el.readOnly = true;               // yazma alanını dokunmatik için salt-okunur yap
    el.addEventListener('focus', () => el.blur(), true); // odağı anında kaldır
  }

  // Var olan input'u yamala
  patchInput(document.getElementById('typing-input'));

  // Oyun sırasında yeniden oluşturulursa tekrar yamala
  new MutationObserver(() => {
    patchInput(document.getElementById('typing-input'));
  }).observe(document.documentElement, { childList: true, subtree: true });
})();