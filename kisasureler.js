// --- 1. VERİ YAPISI (YENİ: 23 Sure) ---
        const surelerData = [
          {
            sureAdi: "Fatiha Suresi",
            ayetler: [
              { ayetArapca: "بِسْمِ اللّٰه الرَّحْمَٰنِ الرَّحِيمِ", tamMeal: "Rahmân ve Rahîm olan Allah'ın adıyla.", kelimeler: [{ arapca: "بِسْمِ", turkce: "Adıyla" }, { arapca: "الله", turkce: "Allah'ın" }, { arapca: "الرَّحْمَٰنِ", turkce: "Rahmân" }, { arapca: "الرَّحِيمِ", turkce: "Rahîm" }] },
              { ayetArapca: "الْحَمْدُ للٰه رَبِّ الْعَالَمِينَ", tamMeal: "Hamd, Âlemlerin Rabbi Allah'a mahsustur.", kelimeler: [{ arapca: "الْحَمْدُ", turkce: "Hamd" }, { arapca: "للٰه", turkce: "Allah'a" }, { arapca: "رَبِّ", turkce: "Rabbi" }, { arapca: "الْعَالَمِينَ", turkce: "âlemlerin" }] },
              { ayetArapca: "الرَّحْمَٰنِ الرَّحِيمِ", tamMeal: "O, Rahmân'dır, Rahîm'dir.", kelimeler: [{ arapca: "الرَّحْمَٰنِ", turkce: "Rahmân" }, { arapca: "الرَّحِيمِ", turkce: "Rahîm" }] },
              { ayetArapca: "مَالِكِ يَوْمِ الدِّينِ", tamMeal: "Din gününün (hesap gününün) sahibidir.", kelimeler: [{ arapca: "مَالِكِ", turkce: "Sahibidir" }, { arapca: "يَوْمِ", turkce: "Gününün" }, { arapca: "الدِّينِ", turkce: "Din" }] },
              { ayetArapca: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tamMeal: "Ancak sana kulluk eder ve ancak senden yardım dileriz.", kelimeler: [{ arapca: "إِيَّاكَ", turkce: "Ancak sana" }, { arapca: "نَعْبُدُ", turkce: "kulluk ederiz" }, { arapca: "وَإِيَّاكَ", turkce: "ve ancak Senden" }, { arapca: "نَسْتَعِينُ", turkce: "yardım dileriz" }] },
              { ayetArapca: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tamMeal: "Bizi doğru yola ilet.", kelimeler: [{ arapca: "اهْدِنَا", turkce: "Bizi ilet" }, { arapca: "الصِّرَاطَ", turkce: "Yola" }, { arapca: "الْمُسْتَقِيمَ", turkce: "Doğru" }] },
              { ayetArapca: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tamMeal: "Nimet verdiklerinin yoluna; gazaba uğrayanların ve sapanlarınkine değil.", kelimeler: [{ arapca: "صِرَاطَ", turkce: "Yoluna" }, { arapca: "الَّذِينَ", turkce: "O kimselerin" }, { arapca: "أَنْعَمْتَ", turkce: "Nimet verdin" }, { arapca: "عَلَيْهِمْ", turkce: "Onlara" }, { arapca: "غَيْرِ", turkce: "Değil" }, { arapca: "الْمَغْضُوبِ", turkce: "Gazaba uğrayanların" }, { arapca: "عَلَيْهِمْ", turkce: "Onlara" }, { arapca: "وَلَا", turkce: "Ve ne de" }, { arapca: "الضَّالِّينَ", turkce: "Sapanların" }] }
            ]
          },
          {
            sureAdi: "Duha Suresi",
            ayetler: [
              { ayetArapca: "وَالضُّحَىٰ", tamMeal: "Kuşluk vaktine yemin olsun.", kelimeler: [{ arapca: "وَالضُّحَىٰ", turkce: "Kuşluğa" }] },
              { ayetArapca: "وَاللَّيْلِ إِذَا سَجَىٰ", tamMeal: "Sakinleştiği zaman geceye yemin olsun.", kelimeler: [{ arapca: "وَاللَّيْلِ", turkce: "Ve geceye" }, { arapca: "إِذَا", turkce: "zaman" }, { arapca: "سَجَىٰ", turkce: "sakinleştiği" }] },
              { ayetArapca: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", tamMeal: "Rabbin seni terk etmedi ve sana darılmadı.", kelimeler: [{ arapca: "مَا وَدَّعَكَ", turkce: "Seni terk etmedi" }, { arapca: "رَبُّكَ", turkce: "Rabbin" }, { arapca: "وَمَا", turkce: "ve" }, { arapca: "قَلَىٰ", turkce: "darılmadı" }] },
              { ayetArapca: "وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ", tamMeal: "Elbette ahiret senin için dünyadan daha hayırlıdır.", kelimeler: [{ arapca: "وَلَلْآخِرَةُ", turkce: "Ve elbette ahiret" }, { arapca: "خَيْرٌ", turkce: "daha hayırlıdır" }, { arapca: "لَكَ", turkce: "senin için" }, { arapca: "مِنَ", turkce: "-den" }, { arapca: "الْأُولَىٰ", turkce: "dünyadan" }] },
              { ayetArapca: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", tamMeal: "Elbette Rabbin sana verecek ve sen de hoşnut olacaksın.", kelimeler: [{ arapca: "وَلَسَوْفَ", turkce: "Ve elbette" }, { arapca: "يُعْطِيكَ", turkce: "sana verecek" }, { arapca: "رَبُّكَ", turkce: "Rabbin" }, { arapca: "فَتَرْضَىٰ", turkce: "ve hoşnut olacaksın" }] },
              { ayetArapca: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ", tamMeal: "Seni yetim bulup da barındırmadı mı?", kelimeler: [{ arapca: "أَلَمْ يَجِدْكَ", turkce: "Seni bulmadı mı" }, { arapca: "يَتِيمًا", turkce: "yetim" }, { arapca: "فَآوَىٰ", turkce: "barındırdı" }] },
              { ayetArapca: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", tamMeal: "Seni yolunu kaybetmiş bulup da doğru yola iletmedi mi?", kelimeler: [{ arapca: "وَوَجَدَكَ", turkce: "Ve seni buldu" }, { arapca: "ضَالًّا", turkce: "yolunu kaybetmiş" }, { arapca: "فَهَدَىٰ", turkce: "doğru yola iletti" }] },
              { ayetArapca: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ", tamMeal: "Seni muhtaç bulup da zengin etmedi mi?", kelimeler: [{ arapca: "وَوَجَدَكَ", turkce: "Ve seni buldu" }, { arapca: "عَائِلًا", turkce: "muhtaç" }, { arapca: "فَأَغْنَىٰ", turkce: "zengin etti" }] },
              { ayetArapca: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", tamMeal: "Öyleyse yetimi sakın ezme.", kelimeler: [{ arapca: "فَأَمَّا", turkce: "Öyleyse" }, { arapca: "الْيَتِيمَ", turkce: "yetimi" }, { arapca: "فَلَا", turkce: "sakın" }, { arapca: "تَقْهَرْ", turkce: "ezme" }] },
              { ayetArapca: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ", tamMeal: "İsteyeni sakın azarlama.", kelimeler: [{ arapca: "وَأَمَّا", turkce: "Ve" }, { arapca: "السَّائِلَ", turkce: "isteyeni" }, { arapca: "فَلَا", turkce: "sakın" }, { arapca: "تَنْهَرْ", turkce: "azarlama" }] },
              { ayetArapca: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", tamMeal: "Ve Rabbinin nimetini anlat.", kelimeler: [{ arapca: "وَأَمَّا", turkce: "Ve" }, { arapca: "بِنِعْمَةِ", turkce: "nimetini" }, { arapca: "رَبِّكَ", turkce: "Rabbinin" }, { arapca: "فَحَدِّثْ", turkce: "anlat" }] }
            ]
          },
          {
            sureAdi: "İnşirah Suresi",
            ayetler: [
              { ayetArapca: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", tamMeal: "Senin göğsünü açıp genişletmedik mi?", kelimeler: [{ arapca: "أَلَمْ نَشْرَحْ", turkce: "Genişletmedik mi" }, { arapca: "لَكَ", turkce: "senin için" }, { arapca: "صَدْرَكَ", turkce: "göğsünü" }] },
              { ayetArapca: "وَوَضَعْنَا عَنْكَ وِزْرَكَ", tamMeal: "Yükünü üzerinden indirmedik mi?", kelimeler: [{ arapca: "وَوَضَعْنَا", turkce: "Ve indirdik" }, { arapca: "عَنْكَ", turkce: "senden" }, { arapca: "وِزْرَكَ", turkce: "yükünü" }] },
              { ayetArapca: "الَّذِي أَنْقَضَ ظَهْرَكَ", tamMeal: "O yük ki, senin belini bükmüştü.", kelimeler: [{ arapca: "الَّذِي", turkce: "O ki" }, { arapca: "أَنْقَضَ", turkce: "bükmüştü" }, { arapca: "ظَهْرَكَ", turkce: "belini" }] },
              { ayetArapca: "وَرَفَعْنَا لَكَ ذِكْرَكَ", tamMeal: "Senin şanını yükseltmedik mi?", kelimeler: [{ arapca: "وَرَفَعْنَا", turkce: "Ve yükselttik" }, { arapca: "لَكَ", turkce: "senin için" }, { arapca: "ذِكْرَكَ", turkce: "şanını" }] },
              { ayetArapca: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", tamMeal: "Şüphesiz, zorlukla beraber bir kolaylık vardır.", kelimeler: [{ arapca: "فَإِنَّ", turkce: "Şüphesiz" }, { arapca: "مَعَ", turkce: "ile beraber" }, { arapca: "الْعُسْرِ", turkce: "zorlukla" }, { arapca: "يُسْرًا", turkce: "bir kolaylık vardır" }] },
              { ayetArapca: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", tamMeal: "Evet, zorlukla beraber bir kolaylık vardır.", kelimeler: [{ arapca: "إِنَّ", turkce: "Şüphesiz" }, { arapca: "مَعَ", turkce: "ile beraber" }, { arapca: "الْعُسْرِ", turkce: "zorlukla" }, { arapca: "يُسْرًا", turkce: "bir kolaylık vardır" }] },
              { ayetArapca: "فَإِذَا فَرَغْتَ فَانْصَبْ", tamMeal: "Öyleyse, bir işi bitirince (hemen) başka bir işe koyul.", kelimeler: [{ arapca: "فَإِذَا", turkce: "Öyleyse" }, { arapca: "فَرَغْتَ", turkce: "bitirince" }, { arapca: "فَانْصَبْ", turkce: "koyul" }] },
              { ayetArapca: "وَإِلَىٰ رَبِّكَ فَارْغَبْ", tamMeal: "Ve yalnızca Rabbine yönel.", kelimeler: [{ arapca: "وَإِلَىٰ", turkce: "Ve" }, { arapca: "رَبِّكَ", turkce: "Rabbine" }, { arapca: "فَارْغَبْ", turkce: "yönel" }] }
            ]
          },
          {
            sureAdi: "Tin Suresi",
            ayetler: [
              { ayetArapca: "وَالتِّينِ وَالزَّيْتُونِ", tamMeal: "İncire ve zeytine yemin olsun.", kelimeler: [{ arapca: "وَالتِّينِ", turkce: "İncire" }, { arapca: "وَالزَّيْتُونِ", turkce: "ve zeytine" }] },
              { ayetArapca: "وَطُورِ سِينِينَ", tamMeal: "Sina dağına yemin olsun.", kelimeler: [{ arapca: "وَطُورِ", turkce: "Dağına" }, { arapca: "سِينِينَ", turkce: "Sina" }] },
              { ayetArapca: "وَهَٰذَا الْبَلَدِ الْأَمِينِ", tamMeal: "Ve bu güvenli şehre (Mekke'ye) yemin olsun.", kelimeler: [{ arapca: "وَهَٰذَا", turkce: "Ve bu" }, { arapca: "الْبَلَدِ", turkce: "şehre" }, { arapca: "الْأَمِينِ", turkce: "güvenli" }] },
              { ayetArapca: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ", tamMeal: "Biz insanı en güzel biçimde yarattık.", kelimeler: [{ arapca: "لَقَدْ", turkce: "Andolsun" }, { arapca: "خَلَقْنَا", turkce: "yarattık" }, { arapca: "الْإِنْسَانَ", turkce: "insanı" }, { arapca: "فِي", turkce: "içinde" }, { arapca: "أَحْسَنِ", turkce: "en güzel" }, { arapca: "تَقْوِيمٍ", turkce: "biçimde" }] },
              { ayetArapca: "ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ", tamMeal: "Sonra onu aşağıların aşağısına indirdik.", kelimeler: [{ arapca: "ثُمَّ", turkce: "Sonra" }, { arapca: "رَدَدْنَاهُ", turkce: "onu indirdik" }, { arapca: "أَسْفَلَ", turkce: "aşağısına" }, { arapca: "سَافِلِينَ", turkce: "aşağıların" }] },
              { ayetArapca: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ", tamMeal: "Ancak iman edip salih ameller işleyenler başka. Onlar için kesintisiz bir ecir vardır.", kelimeler: [{ arapca: "إِلَّا", turkce: "Ancak" }, { arapca: "الَّذِينَ", turkce: "kimseler" }, { arapca: "آمَنُوا", turkce: "iman edip" }, { arapca: "وَعَمِلُوا", turkce: "ve işleyenler" }, { arapca: "الصَّالِحَاتِ", turkce: "salih ameller" }, { arapca: "فَلَهُمْ", turkce: "onlar için" }, { arapca: "أَجْرٌ", turkce: "bir ecir vardır" }, { arapca: "غَيْرُ", turkce: "olmayan" }, { arapca: "مَمْنُونٍ", turkce: "kesintisiz" }] },
              { ayetArapca: "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ", tamMeal: "Bundan sonra, ceza günü hakkında sana neyi yalanlatabilir?", kelimeler: [{ arapca: "فَمَا", turkce: "Artık ne" }, { arapca: "يُكَذِّبُكَ", turkce: "sana yalanlatabilir" }, { arapca: "بَعْدُ", turkce: "bundan sonra" }, { arapca: "بِالدِّينِ", turkce: "dini" }] },
              { ayetArapca: "أَلَيْسَ اللٰه بِأَحْكَمِ الْحَاكِمِينَ", tamMeal: "Allah, hükmedenlerin en hikmetlisi değil midir?", kelimeler: [{ arapca: "أَلَيْسَ", turkce: "Değil midir" }, { arapca: "اللٰه", turkce: "Allah" }, { arapca: "بِأَحْكَمِ", turkce: "en hikmetlisi" }, { arapca: "الْحَاكِمِينَ", turkce: "hükmedenlerin" }] }
            ]
          },
          {
            sureAdi: "Alak Suresi",
            ayetler: [
              { ayetArapca: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", tamMeal: "Yaratan Rabbinin adıyla oku!", kelimeler: [{ arapca: "اقْرَأْ", turkce: "Oku" }, { arapca: "بِاسْمِ", turkce: "adıyla" }, { arapca: "رَبِّكَ", turkce: "Rabbinin" }, { arapca: "الَّذِي", turkce: "O" }, { arapca: "خَلَقَ", turkce: "yaratan" }] },
              { ayetArapca: "خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ", tamMeal: "O, insanı 'alak'tan (embriyo) yarattı.", kelimeler: [{ arapca: "خَلَقَ", turkce: "Yarattı" }, { arapca: "الْإِنْسَانَ", turkce: "insanı" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "عَلَقٍ", turkce: "alak'tan" }] },
              { ayetArapca: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ", tamMeal: "Oku! Rabbin en cömert olandır.", kelimeler: [{ arapca: "اقْرَأْ", turkce: "Oku" }, { arapca: "وَرَبُّكَ", turkce: "ve Rabbin" }, { arapca: "الْأَكْرَمُ", turkce: "en cömerttir" }] },
              { ayetArapca: "الَّذِي عَلَّمَ بِالْقَلَمِ", tamMeal: "O, kalemle (yazmayı) öğretendir.", kelimeler: [{ arapca: "الَّذِي", turkce: "O" }, { arapca: "عَلَّمَ", turkce: "öğretti" }, { arapca: "بِالْقَلَمِ", turkce: "kalemle" }] },
              { ayetArapca: "عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ", tamMeal: "İnsana bilmediğini öğretti.", kelimeler: [{ arapca: "عَلَّمَ", turkce: "Öğretti" }, { arapca: "الْإِنْسَانَ", turkce: "insana" }, { arapca: "مَا", turkce: "şeyi" }, { arapca: "لَمْ يَعْلَمْ", turkce: "bilmediği" }] },
              { ayetArapca: "كَلَّا إِنَّ الْإِنْسَانَ لَيَطْغَىٰ", tamMeal: "Hayır! İnsan gerçekten azgınlaşır.", kelimeler: [{ arapca: "كَلَّا", turkce: "Hayır" }, { arapca: "إِنَّ", turkce: "şüphesiz" }, { arapca: "الْإِنْسَانَ", turkce: "insan" }, { arapca: "لَيَطْغَىٰ", turkce: "azgınlaşır" }] },
              { ayetArapca: "أَنْ رَآهُ اسْتَغْنَىٰ", tamMeal: "Kendini yeterli gördüğü için.", kelimeler: [{ arapca: "أَنْ", turkce: "Çünkü" }, { arapca: "رَآهُ", turkce: "gördü" }, { arapca: "اسْتَغْنَىٰ", turkce: "kendini yeterli" }] },
              { ayetArapca: "إِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ", tamMeal: "Şüphesiz dönüş ancak Rabbinedir.", kelimeler: [{ arapca: "إِنَّ", turkce: "Şüphesiz" }, { arapca: "إِلَىٰ", turkce: "-e" }, { arapca: "رَبِّكَ", turkce: "Rabbine" }, { arapca: "الرُّجْعَىٰ", turkce: "dönüş" }] }
            ]
          },
          {
            sureAdi: "Kadir Suresi",
            ayetler: [
              { ayetArapca: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", tamMeal: "Biz onu (Kur'an'ı) Kadir gecesinde indirdik.", kelimeler: [{ arapca: "إِنَّا", turkce: "Şüphesiz biz" }, { arapca: "أَنْزَلْنَاهُ", turkce: "onu indirdik" }, { arapca: "فِي", turkce: "içinde" }, { arapca: "لَيْلَةِ", turkce: "gecesi" }, { arapca: "الْقَدْرِ", turkce: "Kadir" }] },
              { ayetArapca: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", tamMeal: "Kadir gecesinin ne olduğunu sen ne bileceksin!", kelimeler: [{ arapca: "وَمَا", turkce: "Ve ne" }, { arapca: "أَدْرَاكَ", turkce: "sana bildirdi" }, { arapca: "مَا", turkce: "ne" }, { arapca: "لَيْلَةُ", turkce: "gecesi" }, { arapca: "الْقَدْرِ", turkce: "Kadir" }] },
              { ayetArapca: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ", tamMeal: "Kadir gecesi, bin aydan daha hayırlıdır.", kelimeler: [{ arapca: "لَيْلَةُ", turkce: "Gecesi" }, { arapca: "الْقَدْرِ", turkce: "Kadir" }, { arapca: "خَيْرٌ", turkce: "hayırlıdır" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "أَلْفِ", turkce: "bin" }, { arapca: "شَهْرٍ", turkce: "aydan" }] },
              { ayetArapca: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ", tamMeal: "Melekler ve Ruh (Cebrail), o gecede, Rablerinin izniyle her türlü iş için iner.", kelimeler: [{ arapca: "تَنَزَّلُ", turkce: "İner" }, { arapca: "الْمَلَائِكَةُ", turkce: "melekler" }, { arapca: "وَالرُّوحُ", turkce: "ve Ruh" }, { arapca: "فِيهَا", turkce: "o gecede" }, { arapca: "بِإِذْنِ", turkce: "izniyle" }, { arapca: "رَبِّهِمْ", turkce: "Rablerinin" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "كُلِّ", turkce: "her" }, { arapca: "أَمْرٍ", turkce: "iş" }] },
              { ayetArapca: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", tamMeal: "O gece, tan yeri ağarıncaya kadar esenliktir.", kelimeler: [{ arapca: "سَلَامٌ", turkce: "Esenliktir" }, { arapca: "هِيَ", turkce: "o" }, { arapca: "حَتَّىٰ", turkce: "kadar" }, { arapca: "مَطْلَعِ", turkce: "ağarıncaya" }, { arapca: "الْفَجْرِ", turkce: "tan yeri" }] }
            ]
          },
          {
            sureAdi: "Beyyine Suresi",
            ayetler: [
              { ayetArapca: "لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنْفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ", tamMeal: "Kitap ehlinden ve müşriklerden inkâr edenler, kendilerine apaçık bir delil gelinceye kadar (inkârlarından) ayrılacak değillerdi.", kelimeler: [{ arapca: "لَمْ يَكُنِ", turkce: "Değillerdi" }, { arapca: "الَّذِينَ", turkce: "o kimseler" }, { arapca: "كَفَرُوا", turkce: "inkar eden" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "أَهْلِ", turkce: "ehli" }, { arapca: "الْكِتَابِ", turkce: "kitap" }, { arapca: "وَالْمُشْرِكِينَ", turkce: "ve müşrikler" }, { arapca: "مُنْفَكِّينَ", turkce: "ayrılacak" }, { arapca: "حَتَّىٰ", turkce: "kadar" }, { arapca: "تَأْتِيَهُمُ", turkce: "onlara gelinceye" }, { arapca: "الْبَيِّنَةُ", turkce: "apaçık delil" }] },
              { ayetArapca: "رَسُولٌ مِنَ اللٰه يَتْلُو صُحُفًا مُطَهَّرَةً", tamMeal: "(O delil,) Allah'tan bir elçidir ki, tertemiz sayfaları okur.", kelimeler: [{ arapca: "رَسُولٌ", turkce: "Bir elçi" }, { arapca: "مِنَ", turkce: "-den" }, { arapca: "اللٰه", turkce: "Allah" }, { arapca: "يَتْلُو", turkce: "okur" }, { arapca: "صُحُfًا", turkce: "sayfaları" }, { arapca: "مُطَهَّرَةً", turkce: "tertemiz" }] }
            ]
          },
          {
            sureAdi: "Zilzal Suresi",
            ayetler: [
              { ayetArapca: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا", tamMeal: "Yer, o şiddetli sarsıntısıyla sarsıldığı zaman.", kelimeler: [{ arapca: "إِذَا", turkce: "Zaman" }, { arapca: "زُلْزِلَتِ", turkce: "sarsıldığı" }, { arapca: "الْأَرْضُ", turkce: "yer" }, { arapca: "زِلْزَالَهَا", turkce: "sarsıntısıyla" }] },
              { ayetArapca: "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا", tamMeal: "Yer, ağırlıklarını dışarı çıkardığı zaman.", kelimeler: [{ arapca: "وَأَخْرَجَتِ", turkce: "Ve çıkardığı" }, { arapca: "الْأَرْضُ", turkce: "yer" }, { arapca: "أَثْقَالَهَا", turkce: "ağırlıklarını" }] },
              { ayetArapca: "وَقَالَ الْإِنْسَانُ مَا لَهَا", tamMeal: "İnsan, 'Ona ne oluyor?' dediği zaman.", kelimeler: [{ arapca: "وَقَالَ", turkce: "Ve dediği" }, { arapca: "الْإِنْسَانُ", turkce: "insan" }, { arapca: "مَا", turkce: "ne" }, { arapca: "لَهَا", turkce: "ona" }] },
              { ayetArapca: "يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا", tamMeal: "İşte o gün (yer) haberlerini anlatır.", kelimeler: [{ arapca: "يَوْمَئِذٍ", turkce: "O gün" }, { arapca: "تُحَدِّثُ", turkce: "anlatır" }, { arapca: "أَخْبَارَهَا", turkce: "haberlerini" }] },
              { ayetArapca: "بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا", tamMeal: "Çünkü Rabbin ona (o şekilde) vahyetmiştir.", kelimeler: [{ arapca: "بِأَنَّ", turkce: "Çünkü" }, { arapca: "رَبَّكَ", turkce: "Rabbin" }, { arapca: "أَوْحَىٰ", turkce: "vahyetmiştir" }, { arapca: "لَهَا", turkce: "ona" }] },
              { ayetArapca: "يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ", tamMeal: "O gün insanlar, amellerinin kendilerine gösterilmesi için bölük pörçük (kabirlerinden) çıkarlar.", kelimeler: [{ arapca: "يَوْمَئِذٍ", turkce: "O gün" }, { arapca: "يَصْدُرُ", turkce: "çıkarlar" }, { arapca: "النَّاسُ", turkce: "insanlar" }, { arapca: "أَشْتَاتًا", turkce: "bölük pörçük" }, { arapca: "لِيُرَوْا", turkce: "gösterilmesi için" }, { arapca: "أَعْمَالَهُمْ", turkce: "amellerinin" }] },
              { ayetArapca: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", tamMeal: "Kim zerre miktarı hayır işlemişse onu görür.", kelimeler: [{ arapca: "فَمَنْ", turkce: "Kim" }, { arapca: "يَعْمَلْ", turkce: "işlerse" }, { arapca: "مِثْقَالَ", turkce: "miktarı" }, { arapca: "ذَرَّةٍ", turkce: "zerre" }, { arapca: "خَيْرًا", turkce: "hayır" }, { arapca: "يَرَهُ", turkce: "onu görür" }] },
              { ayetArapca: "وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ", tamMeal: "Kim de zerre miktarı şer işlemişse onu görür.", kelimeler: [{ arapca: "وَمَنْ", turkce: "Ve kim" }, { arapca: "يَعْمَلْ", turkce: "işlerse" }, { arapca: "مِثْقَالَ", turkce: "miktarı" }, { arapca: "ذَرَّةٍ", turkce: "zerre" }, { arapca: "شَرًّا", turkce: "şer" }, { arapca: "يَرَهُ", turkce: "onu görür" }] }
            ]
          },
          {
            sureAdi: "Adiyat Suresi",
            ayetler: [
              { ayetArapca: "وَالْعَادِيَاتِ ضَبْحًا", tamMeal: "Soluk soluğa koşan (at)lara yemin olsun.", kelimeler: [{ arapca: "وَالْعَادِيَاتِ", turkce: "Koşanlara" }, { arapca: "ضَبْحًا", turkce: "soluk soluğa" }] },
              { ayetArapca: "فَالْمُورِيَاتِ قَدْحًا", tamMeal: "(Tırnaklarıyla) ateş çıkaranlara yemin olsun.", kelimeler: [{ arapca: "فَالْمُورِيَاتِ", turkce: "Ateş çıkaranlara" }, { arapca: "قَدْحًا", turkce: "çakarak" }] },
              { ayetArapca: "فَالْمُغِيرَاتِ صُبْحًا", tamMeal: "Sabah vakti baskın yapanlara yemin olsun.", kelimeler: [{ arapca: "فَالْمُغِيرَاتِ", turkce: "Baskın yapanlara" }, { arapca: "صُبْحًا", turkce: "sabah vakti" }] },
              { ayetArapca: "فَأَثَرْنَ بِهِ نَقْعًا", tamMeal: "Tozu dumana katanlara yemin olsun.", kelimeler: [{ arapca: "فَأَثَرْنَ", turkce: "Tozu dumana katanlara" }, { arapca: "بِهِ", turkce: "onunla" }, { arapca: "نَقْعًا", turkce: "toz" }] },
              { ayetArapca: "فَوَسَطْنَ بِهِ جَمْعًا", tamMeal: "Topluluğun ortasına dalanlara yemin olsun.", kelimeler: [{ arapca: "فَوَسَطْنَ", turkce: "Dalanlara" }, { arapca: "بِهِ", turkce: "onunla" }, { arapca: "جَمْعًا", turkce: "topluluğun ortasına" }] },
              { ayetArapca: "إِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ", tamMeal: "Şüphesiz insan, Rabbine karşı çok nankördür.", kelimeler: [{ arapca: "إِنَّ", turkce: "Şüphesiz" }, { arapca: "الْإِنْسَانَ", turkce: "insan" }, { arapca: "لِرَبِّهِ", turkce: "Rabbine karşı" }, { arapca: "لَكَنُودٌ", turkce: "çok nankördür" }] },
              { ayetArapca: "وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ", tamMeal: "Ve şüphesiz kendisi de buna şahittir.", kelimeler: [{ arapca: "وَإِنَّهُ", turkce: "Ve şüphesiz o" }, { arapca: "عَلَىٰ", turkce: "üzerine" }, { arapca: "ذَٰلِكَ", turkce: "buna" }, { arapca: "لَشَهِيدٌ", turkce: "elbette şahittir" }] },
              { ayetArapca: "وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ", tamMeal: "Ve şüphesiz o, mal sevgisi sebebiyle çok katıdır.", kelimeler: [{ arapca: "وَإِنَّهُ", turkce: "Ve şüphesiz o" }, { arapca: "لِحُبِّ", turkce: "sevgisi için" }, { arapca: "الْخَيْرِ", turkce: "mal" }, { arapca: "لَشَدِيدٌ", turkce: "çok katıdır" }] }
            ]
          },
          {
            sureAdi: "Karia Suresi",
            ayetler: [
              { ayetArapca: "الْقَارِعَةُ", tamMeal: "Kâria (korkunç ses)!", kelimeler: [{ arapca: "الْقَارِعَةُ", turkce: "Kâria" }] },
              { ayetArapca: "مَا الْقَارِعَةُ", tamMeal: "Nedir Kâria?", kelimeler: [{ arapca: "مَا", turkce: "Nedir" }, { arapca: "الْقَارِعَةُ", turkce: "Kâria" }] },
              { ayetArapca: "وَمَا أَدْرَاكَ مَا الْقَارِعَةُ", tamMeal: "Kâria'nın ne olduğunu sen ne bileceksin!", kelimeler: [{ arapca: "وَمَا", turkce: "Ve ne" }, { arapca: "أَدْرَاكَ", turkce: "sana bildirdi" }, { arapca: "مَا", turkce: "ne" }, { arapca: "الْقَارِعَةُ", turkce: "Kâria" }] },
              { ayetArapca: "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ", tamMeal: "O gün insanlar, dağılmış pervaneler gibi olurlar.", kelimeler: [{ arapca: "يَوْمَ", turkce: "O gün" }, { arapca: "يَكُونُ", turkce: "olur" }, { arapca: "النَّاسُ", turkce: "insanlar" }, { arapca: "كَالْفَرَاشِ", turkce: "gibi" }, { arapca: "الْمَبْثُوثِ", turkce: "dağılmış pervaneler" }] },
              { ayetArapca: "وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ", tamMeal: "Dağlar, atılmış renkli yün gibi olurlar.", kelimeler: [{ arapca: "وَتَكُونُ", turkce: "Ve olur" }, { arapca: "الْجِبَالُ", turkce: "dağlar" }, { arapca: "كَالْعِهْنِ", turkce: "gibi" }, { arapca: "الْمَنْفُوشِ", turkce: "atılmış yün" }] },
              { ayetArapca: "فَأَمَّا مَنْ ثَقُلَتْ مَوَازِينُهُ", tamMeal: "Kimin tartıları ağır gelirse.", kelimeler: [{ arapca: "فَأَمَّا", turkce: "Kim" }, { arapca: "مَنْ", turkce: "kimse" }, { arapca: "ثَقُلَتْ", turkce: "ağır gelirse" }, { arapca: "مَوَازِينُهُ", turkce: "tartıları" }] },
              { ayetArapca: "فَهُوَ فِي عِيشَةٍ رَاضِيَةٍ", tamMeal: "O, hoşnut kalacağı bir yaşam içindedir.", kelimeler: [{ arapca: "فَهُوَ", turkce: "O" }, { arapca: "فِي", turkce: "içinde" }, { arapca: "عِيشَةٍ", turkce: "bir yaşam" }, { arapca: "رَاضِيَةٍ", turkce: "hoşnut" }] },
              { ayetArapca: "وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ", tamMeal: "Kimin de tartıları hafif gelirse.", kelimeler: [{ arapca: "وَأَمَّا", turkce: "Ve kim" }, { arapca: "مَنْ", turkce: "kimse" }, { arapca: "خَفَّتْ", turkce: "hafif gelirse" }, { arapca: "مَوَازِينُهُ", turkce: "tartıları" }] },
              { ayetArapca: "فَأُمُّهُ هَاوِيَةٌ", tamMeal: "Onun anası (yeri) Hâviye'dir.", kelimeler: [{ arapca: "فَأُمُّهُ", turkce: "Onun anası" }, { arapca: "هَاوِيَةٌ", turkce: "Hâviye'dir" }] },
              { ayetArapca: "وَمَا أَدْرَاكَ مَا هِيَهْ", tamMeal: "Onun ne olduğunu sen ne bileceksin!", kelimeler: [{ arapca: "وَمَا", turkce: "Ve ne" }, { arapca: "أَدْرَاكَ", turkce: "sana bildirdi" }, { arapca: "مَا", turkce: "ne" }, { arapca: "هِيَهْ", turkce: "onun" }] },
              { ayetArapca: "نَارٌ حَامِيَةٌ", tamMeal: "(O,) kızgın bir ateştir.", kelimeler: [{ arapca: "نَارٌ", turkce: "Ateştir" }, { arapca: "حَامِيَةٌ", turkce: "kızgın" }] }
            ]
          },
          {
            sureAdi: "Tekasür Suresi",
            ayetler: [
              { ayetArapca: "أَلْهَاكُمُ التَّكَاثُرُ", tamMeal: "Çoklukla övünmek sizi oyaladı.", kelimeler: [{ arapca: "أَلْهَاكُمُ", turkce: "Sizi oyaladı" }, { arapca: "التَّكَاثُرُ", turkce: "çoklukla övünmek" }] },
              { ayetArapca: "حَتَّىٰ زُرْتُمُ الْمَقَابِرَ", tamMeal: "Ta ki kabirleri ziyaret edinceye (ölünceye) kadar.", kelimeler: [{ arapca: "حَتَّىٰ", turkce: "kadar" }, { arapca: "زُرْتُمُ", turkce: "ziyaret edinceye" }, { arapca: "الْمَقَابِرَ", turkce: "kabirleri" }] },
              { ayetArapca: "كَلَّا سَوْفَ تَعْلَمُونَ", tamMeal: "Hayır! Yakında bileceksiniz.", kelimeler: [{ arapca: "كَلَّا", turkce: "Hayır" }, { arapca: "سَوْفَ", turkce: "yakında" }, { arapca: "تَعْلَمُونَ", turkce: "bileceksiniz" }] },
              { ayetArapca: "ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ", tamMeal: "Sonra yine hayır! Yakında bileceksiniz.", kelimeler: [{ arapca: "ثُمَّ", turkce: "Sonra" }, { arapca: "كَلَّا", turkce: "hayır" }, { arapca: "سَوْفَ", turkce: "yakında" }, { arapca: "تَعْلَمُونَ", turkce: "bileceksiniz" }] },
              { ayetArapca: "كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ", tamMeal: "Hayır! Eğer kesin bir bilgiyle bilseydiniz.", kelimeler: [{ arapca: "كَلَّا", turkce: "Hayır" }, { arapca: "لَوْ", turkce: "eğer" }, { arapca: "تَعْلَمُونَ", turkce: "bilseydiniz" }, { arapca: "عِلْمَ", turkce: "bilgiyle" }, { arapca: "الْيَقِينِ", turkce: "kesin" }] },
              { ayetArapca: "لَتَرَوُنَّ الْجَحِيمَ", tamMeal: "Elbette cehennemi göreceksiniz.", kelimeler: [{ arapca: "لَتَرَوُنَّ", turkce: "Elbette göreceksiniz" }, { arapca: "الْجَحِيمَ", turkce: "cehennemi" }] },
              { ayetArapca: "ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ", tamMeal: "Sonra onu gözünüzle kesin olarak göreceksiniz.", kelimeler: [{ arapca: "ثُمَّ", turkce: "Sonra" }, { arapca: "لَتَرَوُنَّهَا", turkce: "onu göreceksiniz" }, { arapca: "عَيْنَ", turkce: "gözüyle" }, { arapca: "الْيَقِينِ", turkce: "kesin" }] },
              { ayetArapca: "ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ", tamMeal: "Sonra o gün, nimetlerden mutlaka sorguya çekileceksiniz.", kelimeler: [{ arapca: "ثُمَّ", turkce: "Sonra" }, { arapca: "لَتُسْأَلُنَّ", turkce: "mutlaka sorguya çekileceksiniz" }, { arapca: "يَوْمَئِذٍ", turkce: "o gün" }, { arapca: "عَنِ", turkce: "-den" }, { arapca: "النَّعِيمِ", turkce: "nimetler" }] }
            ]
          },
          {
            sureAdi: "Asr Suresi",
            ayetler: [
              { ayetArapca: "وَالْعَصْرِ", tamMeal: "Asra yemin olsun.", kelimeler: [{ arapca: "وَالْعَصْرِ", turkce: "Asra" }] },
              { ayetArapca: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ", tamMeal: "Şüphesiz insan hüsrandadır.", kelimeler: [{ arapca: "إِنَّ", turkce: "Şüphesiz" }, { arapca: "الْإِنْسَانَ", turkce: "insan" }, { arapca: "لَفِي", turkce: "içindedir" }, { arapca: "خُسْرٍ", turkce: "hüsran" }] },
              { ayetArapca: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", tamMeal: "Ancak iman edenler, salih ameller işleyenler, birbirlerine hakkı tavsiye edenler ve birbirlerine sabrı tavsiye edenler başka.", kelimeler: [{ arapca: "إِلَّا", turkce: "Ancak" }, { arapca: "الَّذِينَ", turkce: "kimseler" }, { arapca: "آمَنُوا", turkce: "iman eden" }, { arapca: "وَعَمِلُوا", turkce: "ve işleyen" }, { arapca: "الصَّالِحَاتِ", turkce: "salih ameller" }, { arapca: "وَتَوَاصَوْا", turkce: "ve tavsiye edenler" }, { arapca: "بِالْحَقِّ", turkce: "hakkı" }, { arapca: "وَتَوَاصَوْا", turkce: "ve tavsiye edenler" }, { arapca: "بِالصَّبْرِ", turkce: "sabrı" }] }
            ]
          },
          {
            sureAdi: "Hümeze Suresi",
            ayetler: [
              { ayetArapca: "وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ", tamMeal: "Vay haline her 'humeze' ve 'lumeze'nin (arkadan çekiştiren, kaş göz işaretiyle alay eden).", kelimeler: [{ arapca: "وَيْلٌ", turkce: "Vay haline" }, { arapca: "لِكُلِّ", turkce: "her" }, { arapca: "هُمَزَةٍ", turkce: "humeze" }, { arapca: "لُمَزَةٍ", turkce: "lumeze" }] },
              { ayetArapca: "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ", tamMeal: "O ki, mal toplamış ve onu sayıp durmuştur.", kelimeler: [{ arapca: "الَّذِي", turkce: "O ki" }, { arapca: "جَمَعَ", turkce: "toplamış" }, { arapca: "مَالًا", turkce: "mal" }, { arapca: "وَعَدَّدَهُ", turkce: "ve onu sayıp durmuştur" }] },
              { ayetArapca: "يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ", tamMeal: "Malının kendisini ebedi kılacağını sanır.", kelimeler: [{ arapca: "يَحْسَبُ", turkce: "Sanır" }, { arapca: "أَنَّ", turkce: "ki" }, { arapca: "مَالَهُ", turkce: "malı" }, { arapca: "أَخْلَدَهُ", turkce: "onu ebedi kıldı" }] },
              { ayetArapca: "كَلَّا ۖ لَيُنْبَذَنَّ فِي الْحُطَمَةِ", tamMeal: "Hayır! Andolsun ki o, Hutame'ye atılacaktır.", kelimeler: [{ arapca: "كَلَّا", turkce: "Hayır" }, { arapca: "لَيُنْبَذَنَّ", turkce: "Andolsun atılacaktır" }, { arapca: "فِي", turkce: "içine" }, { arapca: "الْحُطَمَةِ", turkce: "Hutame" }] },
              { ayetArapca: "وَمَا أَدْرَاكَ مَا الْحُطَمَةُ", tamMeal: "Hutame'nin ne olduğunu sen ne bileceksin!", kelimeler: [{ arapca: "وَمَا", turkce: "Ve ne" }, { arapca: "أَدْرَاكَ", turkce: "sana bildirdi" }, { arapca: "مَا", turkce: "ne" }, { arapca: "الْحُطَمَةُ", turkce: "Hutame" }] },
              { ayetArapca: "نَارُ اللٰهِ الْمُوقَدَةُ", tamMeal: "Allah'ın tutuşturulmuş ateşidir.", kelimeler: [{ arapca: "نَارُ", turkce: "Ateşi" }, { arapca: "اللٰه", turkce: "Allah'ın" }, { arapca: "الْمُوقَدَةُ", turkce: "tutuşturulmuş" }] },
              { ayetArapca: "الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ", tamMeal: "O (ateş) ki, kalplerin ta üstüne çıkar.", kelimeler: [{ arapca: "الَّتِي", turkce: "O ki" }, { arapca: "تَطَّلِعُ", turkce: "çıkar" }, { arapca: "عَلَى", turkce: "üstüne" }, { arapca: "الْأَفْئِدَةِ", turkce: "kalplerin" }] },
              { ayetArapca: "إِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ", tamMeal: "Şüphesiz o (ateş), onların üzerine kapatılacaktır.", kelimeler: [{ arapca: "إِنَّهَا", turkce: "Şüphesiz o" }, { arapca: "عَلَيْهِمْ", turkce: "onların üzerine" }, { arapca: "مُؤْصَدَةٌ", turkce: "kapatılacaktır" }] },
              { ayetArapca: "فِي عَمَدٍ مُمَدَّدَةٍ", tamMeal: "Uzatılmış sütunlar içinde.", kelimeler: [{ arapca: "فِي", turkce: "içinde" }, { arapca: "عَمَدٍ", turkce: "sütunlar" }, { arapca: "مُمَدَّدَةٍ", turkce: "uzatılmış" }] }
            ]
          },
          {
            sureAdi: "Fil Suresi",
            ayetler: [
              { ayetArapca: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", tamMeal: "Rabbinin, fil sahiplerine ne yaptığını görmedin mi?", kelimeler: [{ arapca: "أَلَمْ تَرَ", turkce: "Görmedin mi" }, { arapca: "كَيْفَ", turkce: "nasıl" }, { arapca: "فَعَلَ", turkce: "yaptı" }, { arapca: "رَبُّكَ", turkce: "Rabbin" }, { arapca: "بِأَصْحَابِ", turkce: "sahiplerine" }, { arapca: "الْفِيلِ", turkce: "fil" }] },
              { ayetArapca: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", tamMeal: "Onların tuzaklarını boşa çıkarmadı mı?", kelimeler: [{ arapca: "أَلَمْ يَجْعَلْ", turkce: "Kılmadı mı" }, { arapca: "كَيْدَهُمْ", turkce: "onların tuzaklarını" }, { arapca: "فِي", turkce: "içinde" }, { arapca: "تَضْلِيلٍ", turkce: "boşa" }] },
              { ayetArapca: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", tamMeal: "Onların üzerine sürüler halinde kuşlar gönderdi.", kelimeler: [{ arapca: "وَأَرْسَلَ", turkce: "Ve gönderdi" }, { arapca: "عَلَيْهِمْ", turkce: "onların üzerine" }, { arapca: "طَيْرًا", turkce: "kuşlar" }, { arapca: "أَبَابِيلَ", turkce: "sürüler halinde" }] },
              { ayetArapca: "تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ", tamMeal: "O kuşlar, 'siccil'den (pişmiş çamurdan) taşlar atıyorlardı.", kelimeler: [{ arapca: "تَرْمِيهِمْ", turkce: "Atıyorlardı onlara" }, { arapca: "بِحِجَارَةٍ", turkce: "taşlar" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "سِجِّيلٍ", turkce: "siccil" }] },
              { ayetArapca: "فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ", tamMeal: "Sonunda onları, yenilmiş ekin yaprağı gibi yaptı.", kelimeler: [{ arapca: "فَجَعَلَهُمْ", turkce: "Onları yaptı" }, { arapca: "كَعَصْفٍ", turkce: "gibi" }, { arapca: "مَأْكُولٍ", turkce: "yenilmiş ekin yaprağı" }] }
            ]
          },
          {
            sureAdi: "Kureyş Suresi",
            ayetler: [
              { ayetArapca: "لِإِيلَافِ قُرَيْشٍ", tamMeal: "Kureyş'in 'ülfet'i (anlaşmaları) için.", kelimeler: [{ arapca: "لِإِيلَافِ", turkce: "Ülfeti için" }, { arapca: "قُرَيْشٍ", turkce: "Kureyş'in" }] },
              { ayetArapca: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", tamMeal: "Onların kış ve yaz yolculuklarına olan ülfetleri için.", kelimeler: [{ arapca: "إِيلَافِهِمْ", turkce: "Onların ülfeti" }, { arapca: "رِحْلَةَ", turkce: "yolculuk" }, { arapca: "الشِّتَاءِ", turkce: "kış" }, { arapca: "وَالصَّيْفِ", turkce: "ve yaz" }] },
              { ayetArapca: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ", tamMeal: "Öyleyse bu Ev'in (Kâbe'nin) Rabbine kulluk etsinler.", kelimeler: [{ arapca: "فَلْيَعْبُدُوا", turkce: "Kulluk etsinler" }, { arapca: "رَبَّ", turkce: "Rabbine" }, { arapca: "هَٰذَا", turkce: "bu" }, { arapca: "الْبَيْتِ", turkce: "Ev'in" }] },
              { ayetArapca: "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ", tamMeal: "O (Rab) ki, onları açlıktan doyurdu ve onları korkudan emin kıldı.", kelimeler: [{ arapca: "الَّذِي", turkce: "O ki" }, { arapca: "أَطْعَمَهُمْ", turkce: "onları doyurdu" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "جُوعٍ", turkce: "açlık" }, { arapca: "وَآمَنَهُمْ", turkce: "ve onları emin kıldı" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "خَوْفٍ", turkce: "korku" }] }
            ]
          },
          {
            sureAdi: "Maun Suresi",
            ayetler: [
              { ayetArapca: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", tamMeal: "Gördün mü o, dini yalanlayanı?", kelimeler: [{ arapca: "أَرَأَيْتَ", turkce: "Gördün mü" }, { arapca: "الَّذِي", turkce: "o kimseyi" }, { arapca: "يُكَذِّبُ", turkce: "yalanlayan" }, { arapca: "بِالدِّينِ", turkce: "dini" }] },
              { ayetArapca: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", tamMeal: "İşte o, yetimi itip kakan kimsedir.", kelimeler: [{ arapca: "فَذَٰلِكَ", turkce: "İşte o" }, { arapca: "الَّذِي", turkce: "kimse" }, { arapca: "يَدُعُّ", turkce: "itip kakan" }, { arapca: "الْيَتِيمَ", turkce: "yetimi" }] },
              { ayetArapca: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ", tamMeal: "Yoksulu doyurmaya teşvik etmez.", kelimeler: [{ arapca: "وَلَا", turkce: "Ve" }, { arapca: "يَحُضُّ", turkce: "teşvik etmez" }, { arapca: "عَلَىٰ", turkce: "üzerine" }, { arapca: "طَعَامِ", turkce: "doyurmaya" }, { arapca: "الْمِسْكِينِ", turkce: "yoksulu" }] },
              { ayetArapca: "فَوَيْلٌ لِلْمُصَلِّينَ", tamMeal: "Vay o namaz kılanların haline!", kelimeler: [{ arapca: "فَوَيْلٌ", turkce: "Vay haline" }, { arapca: "لِلْمُصَلِّينَ", turkce: "o namaz kılanların" }] },
              { ayetArapca: "الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ", tamMeal: "Onlar ki, namazlarında gaflet içindedirler.", kelimeler: [{ arapca: "الَّذِينَ", turkce: "Onlar ki" }, { arapca: "هُمْ", turkce: "onlar" }, { arapca: "عَنْ", turkce: "-den" }, { arapca: "صَلَاتِهِمْ", turkce: "namazlarında" }, { arapca: "سَاهُونَ", turkce: "gaflet içindedirler" }] },
              { ayetArapca: "الَّذِينَ هُمْ يُرَاءُونَ", tamMeal: "Onlar gösteriş yaparlar.", kelimeler: [{ arapca: "الَّذِينَ", turkce: "Onlar ki" }, { arapca: "هُمْ", turkce: "onlar" }, { arapca: "يُرَاءُونَ", turkce: "gösteriş yaparlar" }] },
              { ayetArapca: "وَيَمْنَعُونَ الْمَاعُونَ", tamMeal: "Ve en ufak bir yardımı (zekatı, sadakayı) engellerler.", kelimeler: [{ arapca: "وَيَمْنَعُونَ", turkce: "Ve engellerler" }, { arapca: "الْمَاعُونَ", turkce: "yardımı" }] }
            ]
          },
          {
            sureAdi: "Kevser Suresi",
            ayetler: [
              { ayetArapca: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", tamMeal: "Şüphesiz biz sana Kevser'i verdik.", kelimeler: [{ arapca: "إِنَّا", turkce: "Şüphesiz biz" }, { arapca: "أَعْطَيْنَاكَ", turkce: "sana verdik" }, { arapca: "الْكَوْثَرَ", turkce: "Kevser'i" }] },
              { ayetArapca: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", tamMeal: "Öyleyse Rabbin için namaz kıl ve kurban kes.", kelimeler: [{ arapca: "فَصَلِّ", turkce: "Öyleyse namaz kıl" }, { arapca: "لِرَبِّكَ", turkce: "Rabbin için" }, { arapca: "وَانْحَرْ", turkce: "ve kurban kes" }] },
              { ayetArapca: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", tamMeal: "Şüphesiz, soyu kesik olan asıl sana kin besleyendir.", kelimeler: [{ arapca: "إِنَّ", turkce: "Şüphesiz" }, { arapca: "شَانِئَكَ", turkce: "sana kin besleyen" }, { arapca: "هُوَ", turkce: "odur" }, { arapca: "الْأَبْتَرُ", turkce: "soyu kesik" }] }
            ]
          },
          {
            sureAdi: "Kafirun Suresi",
            ayetler: [
              { ayetArapca: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", tamMeal: "De ki: Ey kâfirler!", kelimeler: [{ arapca: "قُلْ", turkce: "De ki" }, { arapca: "يَا أَيُّهَا", turkce: "Ey" }, { arapca: "الْكَافِرُونَ", turkce: "kâfirler" }] },
              { ayetArapca: "لَا أَعْبُدُ مَا تَعْبُدُونَ", tamMeal: "Ben sizin taptıklarınıza tapmam.", kelimeler: [{ arapca: "لَا", turkce: "Hayır" }, { arapca: "أَعْبُدُ", turkce: "tapmam" }, { arapca: "مَا", turkce: "şeylere" }, { arapca: "تَعْبُدُونَ", turkce: "taptığınız" }] },
              { ayetArapca: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", tamMeal: "Siz de benim taptığıma tapmazsınız.", kelimeler: [{ arapca: "وَلَا", turkce: "Ve" }, { arapca: "أَنْتُمْ", turkce: "siz" }, { arapca: "عَابِدُونَ", turkce: "tapanlar değilsiniz" }, { arapca: "مَا", turkce: "şeye" }, { arapca: "أَعْبُدُ", turkce: "taptığım" }] },
              { ayetArapca: "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ", tamMeal: "Ben sizin taptıklarınıza (asla) tapacak değilim.", kelimeler: [{ arapca: "وَلَا", turkce: "Ve" }, { arapca: "أَنَا", turkce: "ben" }, { arapca: "عَابِدٌ", turkce: "tapacak değilim" }, { arapca: "مَا", turkce: "şeye" }, { arapca: "عَبَدْتُمْ", turkce: "taptığınız" }] },
              { ayetArapca: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", tamMeal: "Siz de benim taptığıma tapacak değilsiniz.", kelimeler: [{ arapca: "وَلَا", turkce: "Ve" }, { arapca: "أَنْتُمْ", turkce: "siz" }, { arapca: "عَابِدُونَ", turkce: "tapanlar değilsiniz" }, { arapca: "مَا", turkce: "şeye" }, { arapca: "أَعْبُدُ", turkce: "taptığım" }] },
              { ayetArapca: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", tamMeal: "Sizin dininiz size, benim dinim banadır.", kelimeler: [{ arapca: "لَكُمْ", turkce: "Sizin" }, { arapca: "دِينُكُمْ", turkce: "dininiz" }, { arapca: "وَلِيَ", turkce: "ve benim" }, { arapca: "دِينِ", turkce: "dinim" }] }
            ]
          },
          {
            sureAdi: "Nasr Suresi",
            ayetler: [
              { ayetArapca: "إِذَا جَاءَ نَصْرُ اللٰهِ وَالْفَتْحُ", tamMeal: "Allah'ın yardımı ve fetih geldiği zaman.", kelimeler: [{ arapca: "إِذَا", turkce: "Zaman" }, { arapca: "جَاءَ", turkce: "Geldiği" }, { arapca: "نَصْرُ", turkce: "Yardımı" }, { arapca: "اللٰهِ", turkce: "Allah'ın" }, { arapca: "وَالْفَتْحُ", turkce: "Ve fetih" }] },
              { ayetArapca: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", tamMeal: "Ve insanların, Allah'ın dinine dalga dalga girdiklerini gördüğün zaman.", kelimeler: [{ arapca: "وَرَأَيْتَ", turkce: "Ve gördüğün" }, { arapca: "النَّاسَ", turkce: "İnsanları" }, { arapca: "يَدْخُلُونَ", turkce: "Giriyorlar" }, { arapca: "فِي", turkce: "İçine" }, { arapca: "دِينِ", turkce: "Dinine" }, { arapca: "اللٰه", turkce: "Allah'ın" }, { arapca: "أَفْوَاجًا", turkce: "Dalga dalga" }] },
              { ayetArapca: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", tamMeal: "Rabbine hamd ederek tesbih et ve O'ndan bağışlama dile. Şüphesiz O, tevbeleri çok kabul edendir.", kelimeler: [{ arapca: "فَسَبِّحْ", turkce: "Tesbih et" }, { arapca: "بِحَمْدِ", turkce: "Hamd ile" }, { arapca: "رَبِّكَ", turkce: "Rabbinin" }, { arapca: "وَاسْتَغْرْهُ", turkce: "Ve O'ndan bağışlama dile" }, { arapca: "إِنَّهُ", turkce: "Şüphesiz O" }, { arapca: "كَانَ", turkce: "Oldu" }, { arapca: "تَوَّابًا", turkce: "Tevbeleri kabul eden" }] }
            ]
          },
          {
            sureAdi: "Mesed Suresi",
            ayetler: [
              { ayetArapca: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", tamMeal: "Ebu Leheb'in elleri kurusun! Kurudu da.", kelimeler: [{ arapca: "تَبَّتْ", turkce: "Kurusun" }, { arapca: "يَدَا", turkce: "elleri" }, { arapca: "أَبِي لَهَبٍ", turkce: "Ebu Leheb'in" }, { arapca: "وَتَبَّ", turkce: "ve kurudu da" }] },
              { ayetArapca: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", tamMeal: "Ona malı ve kazandığı şeyler fayda vermedi.", kelimeler: [{ arapca: "مَا", turkce: "Ne" }, { arapca: "أَغْنَىٰ", turkce: "fayda verdi" }, { arapca: "عَنْهُ", turkce: "ona" }, { arapca: "مَالُهُ", turkce: "malı" }, { arapca: "وَمَا", turkce: "ve ne" }, { arapca: "كَسَبَ", turkce: "kazandığı" }] },
              { ayetArapca: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", tamMeal: "O, alevli bir ateşe girecektir.", kelimeler: [{ arapca: "سَيَصْلَىٰ", turkce: "Girecektir" }, { arapca: "نَارًا", turkce: "bir ateşe" }, { arapca: "ذَاتَ", turkce: "sahibi" }, { arapca: "لَهَبٍ", turkce: "alevli" }] },
              { ayetArapca: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", tamMeal: "Karısı da, odun taşıyıcısı olarak.", kelimeler: [{ arapca: "وَامْرَأَتُهُ", turkce: "Ve karısı" }, { arapca: "حَمَّالَةَ", turkce: "taşıyıcısı" }, { arapca: "الْحَطَبِ", turkce: "odun" }] },
              { ayetArapca: "فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ", tamMeal: "Boynunda bükülmüş hurma lifinden bir ip olduğu halde.", kelimeler: [{ arapca: "فِي", turkce: "içinde" }, { arapca: "جِيدِهَا", turkce: "boynunda" }, { arapca: "حَبْلٌ", turkce: "bir ip" }, { arapca: "مِنْ", turkce: "-den" }, { arapca: "مَسَدٍ", turkce: "bükülmüş lif" }] }
            ]
          },
          {
            sureAdi: "İhlas Suresi",
            ayetler: [
              { ayetArapca: "قُلْ هُوَ اللٰه أَحَدٌ", tamMeal: "De ki: O, Allah'tır, tektir.", kelimeler: [{ arapca: "قُلْ", turkce: "De ki" }, { arapca: "هُوَ", turkce: "O" }, { arapca: "اللٰه", turkce: "Allah" }, { arapca: "أَحَدٌ", turkce: "Tektir" }] },
              { ayetArapca: "اللٰه الصَّمَدُ ", tamMeal: "Allah, Samed'dir (her şey O'na muhtaçtır).", kelimeler: [{ arapca: "اللٰه", turkce: "Allah" }, { arapca: "الصَّمَدُ", turkce: "Samed'dir" }] },
              { ayetArapca: "لَمْ يَلِدْ وَلَمْ يُولَدْ", tamMeal: "O, doğurmamış ve doğmamıştır.", kelimeler: [{ arapca: "لَمْ يَلِدْ", turkce: "Doğurmamıştır" }, { arapca: "وَلَمْ يُولَدْ", turkce: "Ve doğmamıştır" }] },
              { ayetArapca: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", tamMeal: "Hiçbir şey O'na denk değildir.", kelimeler: [{ arapca: "وَلَمْ يَكُنْ", turkce: "Olmadı" }, { arapca: "لَهُ", turkce: "Onun" }, { arapca: "كُفُوًا", turkce: "Denk" }, { arapca: "أَحَدٌ", turkce: "Hiçbir şey" }] }
            ]
          },
          {
            sureAdi: "Felak Suresi",
            ayetler: [
              { ayetArapca: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", tamMeal: "De ki: Sabahın Rabbine sığınırım.", kelimeler: [{ arapca: "قُلْ", turkce: "De ki" }, { arapca: "أَعُوذُ", turkce: "Sığınırım" }, { arapca: "بِرَبِّ", turkce: "Rabbine" }, { arapca: "الْفَلَقِ", turkce: "Sabahın" }] },
              { ayetArapca: "مِنْ شَرِّ مَا خَلَقَ", tamMeal: "Yarattığı şeylerin şerrinden.", kelimeler: [{ arapca: "مِنْ", turkce: "den" }, { arapca: "شَرِّ", turkce: "Şerrinden" }, { arapca: "مَا", turkce: "Şeylerin" }, { arapca: "خَلَقَ", turkce: "Yarattığı" }] },
              { ayetArapca: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", tamMeal: "Karanlığı çöktüğü zaman gecenin şerrinden.", kelimeler: [{ arapca: "وَمِنْ", turkce: "Ve den" }, { arapca: "شَرِّ", turkce: "Şerrinden" }, { arapca: "غَاسِقٍ", turkce: "Gecenin" }, { arapca: "إِذَا", turkce: "Zaman" }, { arapca: "وَقَبَ", turkce: "Karanlığı çöktüğü" }] },
              { ayetArapca: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", tamMeal: "Düğümlere üfleyenlerin şerrinden.", kelimeler: [{ arapca: "وَمِنْ", turkce: "Ve den" }, { arapca: "شَرِّ", turkce: "Şerrinden" }, { arapca: "النَّفَّاثَاتِ", turkce: "Üfleyenlerin" }, { arapca: "فِي", turkce: "İçine" }, { arapca: "الْعُقَدِ", turkce: "Düğümlerin" }] },
              { ayetArapca: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", tamMeal: "Haset ettiği zaman hasetçinin şerrinden.", kelimeler: [{ arapca: "وَمِنْ", turkce: "Ve den" }, { arapca: "شَرِّ", turkce: "Şerrinden" }, { arapca: "حَاسِدٍ", turkce: "Hasetçinin" }, { arapca: "إِذَا", turkce: "Zaman" }, { arapca: "حَسَدَ", turkce: "Haset ettiği" }] }
            ]
          },
          {
            sureAdi: "Nas Suresi",
            ayetler: [
              { ayetArapca: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", tamMeal: "De ki: İnsanların Rabbine sığınırım.", kelimeler: [{ arapca: "قُلْ", turkce: "De ki" }, { arapca: "أَعُوذُ", turkce: "Sığınırım" }, { arapca: "بِرَبِّ", turkce: "Rabbine" }, { arapca: "النَّاسِ", turkce: "İnsanların" }] },
              { ayetArapca: "مَلِكِ النَّاسِ", tamMeal: "İnsanların Melikine (kralına).", kelimeler: [{ arapca: "مَلِكِ", turkce: "Melikine" }, { arapca: "النَّاسِ", turkce: "İnsanların" }] },
              { ayetArapca: "إِلَٰهِ النَّاسِ", tamMeal: "İnsanların İlahına.", kelimeler: [{ arapca: "إِلَٰهِ", turkce: "İlahına" }, { arapca: "النَّاسِ", turkce: "İnsanların" }] },
              { ayetArapca: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", tamMeal: "Sinsi vesvesecinin şerrinden.", kelimeler: [{ arapca: "مِنْ", turkce: "den" }, { arapca: "شَرِّ", turkce: "Şerrinden" }, { arapca: "الْوَسْوَاسِ", turkce: "Vesvesecinin" }, { arapca: "الْخَنَّاسِ", turkce: "Sinsi" }] },
              { ayetArapca: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", tamMeal: "O ki, insanların göğüslerine vesvese verir.", kelimeler: [{ arapca: "الَّذِي", turkce: "O ki" }, { arapca: "يُوَسْوِسُ", turkce: "Vesvese verir" }, { arapca: "فِي", turkce: "İçine" }, { arapca: "صُدُورِ", turkce: "Göğüslerine" }, { arapca: "النَّاسِ", turkce: "İnsanların" }] },
              { ayetArapca: "مِنَ الْجِنَّةِ وَالنَّاسِ", tamMeal: "Gerek cinlerden, gerek insanlardan.", kelimeler: [{ arapca: "مِنَ", turkce: "den" }, { arapca: "الْجِنَّةِ", turkce: "Cin" }, { arapca: "وَالنَّاسِ", turkce: "Ve insanlardan" }] }
            ]
          }
        ];
        
        // --- 2. YARDIMCI FONKSİYONLAR ---
        function shuffleArray(array) {
            let currentIndex = array.length, randomIndex;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
            return array;
        }

        function getCeldiriciMealler(dogruMeal, count = 4) {
            const tumMealler = surelerData.flatMap(sure => sure.ayetler.map(ayet => ayet.tamMeal));
            const benzersizMealler = [...new Set(tumMealler)];
            const celdirciler = benzersizMealler.filter(meal => meal !== dogruMeal);
            return shuffleArray(celdirciler).slice(0, count);
        }

        // --- 3. GLOBAL DEĞİŞKENLER ---
// YENİ: Web Audio API için
        let audioContext;
        
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }
        
        // YENİ: Ses üretme fonksiyonu
        function playSound(tur, frekans, sure) {
            if (!audioContext) {
                // Eğer context başlatılmadıysa (örn. kullanıcı henüz tıklamadıysa)
                // sesi çalmaya çalışma, hatayı önle.
                return; 
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = tur; // 'sine'
            oscillator.frequency.value = frekans;
            
            // Sesi yumuşatmak için gain ayarı (tıklama sesi olmasın diye)
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.02); // 0.02sn'de yükselsin
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + sure); // Belirtilen sürede azalsın

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sure);
        }

        function playDogruSesi() {
            // Doğru: Yüksek ("ding") ve kısa bir sinüs dalgası
            playSound('sine', 880, 0.2); 
        }

        function playYanlisSesi() {
            // Yanlış: Düşük ("buzz") ve biraz daha uzun bir sinüs dalgası
            playSound('sine', 330, 0.3); 
        }
        let guncelSureIndex = 0;
        let guncelMod = 'mod1';
        const secimAlani = document.querySelector('.secim-alani');
        const sureSecici = document.getElementById('sure-secici');
        const navButtons = document.querySelectorAll('.nav-btn');
        const modIcerikleri = document.querySelectorAll('.mod-icerik');
        
        // Mod 1
        const mod1AyetSoru = document.getElementById('mod1-ayet-soru');
        const anlamKutusu = document.getElementById('anlam-kutusu');
        const mod1SonrakiBtn = document.getElementById('mod1-sonraki-btn');
        const mod1Sayac = document.getElementById('mod1-sayac');
        let mod1SoruHavuzu = [];
        let mod1GuncelAyetIndex = 0;
        
        // Mod 2 (Test)
        const mod2AyetSoru = document.getElementById('mod2-ayet-soru');
        const mod2Secenekler = document.getElementById('mod2-secenekler');
        const mod2SonrakiBtn = document.getElementById('mod2-sonraki-btn');
        const mod2Sonuc = document.getElementById('mod2-sonuc');
        let mod2SoruHavuzu = [];
        let mod2GuncelSoruIndex = 0;

        // Mod 3 (Bilgi Kartları)
        const mod3KartGrid = document.getElementById('mod3-kart-grid');
        const mod3RestartBtn = document.getElementById('mod3-restart-btn');
        
        // YENİ Mod 4 (Ezber)
        const mod4AyetSoru = document.getElementById('mod4-ayet-soru');
        const mod4SonrakiBtn = document.getElementById('mod4-sonraki-btn');
        let mod4SoruHavuzu = [];
        let mod4GuncelAyetIndex = 0;
        
        // Tam Ekran
        const fullscreenBtn = document.getElementById('fullscreen-btn');

        // --- 4. RENDER FONKSİYONLARI ---

        // MOD 1: Kelime Anlamı
        function renderMod1(sureData) {
            mod1GuncelAyetIndex = 0;
            mod1SoruHavuzu = shuffleArray([...sureData.ayetler]); 
            anlamKutusu.textContent = '...';
            mod1AyetGoster();
        }
        
        function mod1AyetGoster() {
            if (mod1SoruHavuzu.length === 0) return;
            
            const ayet = mod1SoruHavuzu[mod1GuncelAyetIndex];
            mod1AyetSoru.innerHTML = '';
            
            ayet.kelimeler.forEach(kelime => {
                const span = document.createElement('span');
                span.textContent = kelime.arapca + ' ';
                span.className = 'kelime';
                span.dataset.anlam = kelime.turkce;
                
                span.addEventListener('click', () => {
                    mod1AyetSoru.querySelectorAll('span.kelime').forEach(sp => sp.classList.remove('vurgulu'));
                    span.classList.add('vurgulu');
                    anlamKutusu.textContent = kelime.turkce;
                });
                mod1AyetSoru.appendChild(span);
            });
            
            mod1Sayac.textContent = `Ayet ${mod1GuncelAyetIndex + 1} / ${mod1SoruHavuzu.length}`;
            mod1SonrakiBtn.disabled = (mod1GuncelAyetIndex === mod1SoruHavuzu.length - 1);
        }
        
        mod1SonrakiBtn.addEventListener('click', () => {
            if (mod1GuncelAyetIndex < mod1SoruHavuzu.length - 1) {
                mod1GuncelAyetIndex++;
                mod1AyetGoster();
                anlamKutusu.textContent = '...';
            }
        });


        // MOD 2: Meal Testi
        function renderMod2(sureData) {
            mod2GuncelSoruIndex = 0;
            mod2SoruHavuzu = shuffleArray([...sureData.ayetler]); 
            mod2Sonuc.style.display = 'none';
            mod2SonrakiBtn.style.display = 'none';
            mod2SoruGoster();
        }
        
        function mod2SoruGoster() {
            if (mod2GuncelSoruIndex >= mod2SoruHavuzu.length) {
                mod2AyetSoru.textContent = 'Test Bitti!';
                mod2Secenekler.innerHTML = '';
                mod2Sonuc.textContent = `Tebrikler! ${mod2SoruHavuzu.length} ayeti tamamladınız.`;
                mod2Sonuc.className = 'sonuc-mesaji dogru';
                mod2Sonuc.style.display = 'block';
                mod2SonrakiBtn.style.display = 'none';
                return;
            }

            const ayet = mod2SoruHavuzu[mod2GuncelSoruIndex];
            const dogruMeal = ayet.tamMeal;
            
            mod2AyetSoru.textContent = ayet.ayetArapca;
            mod2Secenekler.innerHTML = '';
            mod2Sonuc.style.display = 'none';
            mod2SonrakiBtn.style.display = 'none';

            const celdirciler = getCeldiriciMealler(dogruMeal, 4);
            const secenekler = shuffleArray([dogruMeal, ...celdirciler]);
            
            secenekler.forEach(meal => {
                const div = document.createElement('div');
                div.className = 'test-secenek';
                div.textContent = meal;
                div.dataset.meal = meal;
                
                div.addEventListener('click', () => {
                    mod2Secenekler.querySelectorAll('.test-secenek').forEach(d => d.classList.add('disabled'));
                    
                    if (meal === dogruMeal) {
                        div.classList.add('dogru'); // <-- YEŞİL RENK DEVRE DIŞI
                        mod2Sonuc.textContent = '';
                        playDogruSesi();
                    } else {
                        div.classList.add('yanlis'); // <-- KIRMIZI RENK DEVRE DIŞI
                        mod2Secenekler.querySelector(`[data-meal="${dogruMeal}"]`).classList.add('dogru'); // <-- DİĞER YEŞİL RENK DEVRE DIŞI
                        mod2Sonuc.textContent = '';
                        playYanlisSesi();
                    }
                    mod2Sonuc.style.display = 'block';
                    mod2SonrakiBtn.style.display = 'block';
                });
                mod2Secenekler.appendChild(div);
            });
        }
        
        mod2SonrakiBtn.addEventListener('click', () => {
            mod2GuncelSoruIndex++;
            mod2SoruGoster();
        });


        // MOD 3: Bilgi Kartları
        function renderMod3(sureData) {
            mod3KartGrid.innerHTML = '';
            
            const tumKelimeler = sureData.ayetler.flatMap(ayet => ayet.kelimeler);
            const benzersizKelimeler = Array.from(new Map(tumKelimeler.map(k => [k.arapca, k])).values());
            const karisikKelimeler = shuffleArray(benzersizKelimeler);
            const oyunKelimeleri = karisikKelimeler.slice(0, 12);
            
            if (oyunKelimeleri.length === 0) {
                mod3KartGrid.innerHTML = '<p>Bu surede kelime bulunamadı.</p>';
                return;
            }
            
            oyunKelimeleri.forEach(kelime => {
                const kartElement = document.createElement('div');
                kartElement.className = 'grid-kart';
                
                kartElement.innerHTML = `
                    <div class="kart-yuzu kart-on">
                        ${kelime.arapca}
                    </div>
                    <div class="kart-yuzu kart-arka">
                        ${kelime.turkce}
                    </div>
                `;
                
                kartElement.addEventListener('click', () => {
                    kartElement.classList.toggle('cevrildi');
                });
                
                mod3KartGrid.appendChild(kartElement);
            });
        }
        
        mod3RestartBtn.addEventListener('click', () => {
            renderMod3(surelerData[guncelSureIndex]);
        });
        
        
        // YENİ MOD 4: Ezber Modu
        function renderMod4(tumSureler) {
            // Bu mod, seçili sureden bağımsız, tüm datayı kullanır
            mod4SoruHavuzu = tumSureler.flatMap(sure => sure.ayetler)
                                      .filter(ayet => ayet.kelimeler.length >= 4);
            mod4SoruHavuzu = shuffleArray(mod4SoruHavuzu);
            mod4GuncelAyetIndex = 0;
            mod4AyetGoster();
        }
        
        function mod4AyetGoster() {
            if (mod4SoruHavuzu.length === 0) {
                mod4AyetSoru.textContent = '4 kelimeden uzun ayet bulunamadı.';
                return;
            }
            // Başa dön
            if (mod4GuncelAyetIndex >= mod4SoruHavuzu.length) {
                mod4GuncelAyetIndex = 0;
            }
            
            const ayet = mod4SoruHavuzu[mod4GuncelAyetIndex];
            const kelimeSayisi = ayet.kelimeler.length;
            
            // Ayet 4 kelimeyse ilk 2'sini, daha uzunsa ilk 3'ünü göster
            let gosterilecekKelimeSayisi = (kelimeSayisi <= 4) ? 2 : 3;
            
            const ayetBasi = ayet.kelimeler
                                .slice(0, gosterilecekKelimeSayisi)
                                .map(k => k.arapca)
                                .join(' ');
            
            mod4AyetSoru.textContent = ayetBasi + " ...";
        }
        
        mod4SonrakiBtn.addEventListener('click', () => {
            mod4GuncelAyetIndex++;
            mod4AyetGoster();
        });
        
        
        // --- 5. BAŞLANGIÇ (INIT) FONKSİYONLARI ---
        function renderAktifMod() {
            const sureData = surelerData[guncelSureIndex];
            
            modIcerikleri.forEach(mod => mod.classList.remove('aktif'));
            const aktifModElementi = document.getElementById(guncelMod);
            aktifModElementi.classList.add('aktif');
         // YENİ: Ezber modunda sure seçimini gizle/göster
        if (guncelMod === 'mod4') {
            secimAlani.style.display = 'none';
        } else {
            secimAlani.style.display = 'flex';
        }
            
            switch (guncelMod) {
                case 'mod1': renderMod1(sureData); break;
                case 'mod2': renderMod2(sureData); break;
                case 'mod3': renderMod3(sureData); break;
                case 'mod4': 
                    // Mod 4 tüm sureleri kullanır, o yüzden tüm datayı yolla
                    renderMod4(surelerData); 
                    break;
            }
        }
        
        function sureSeciciyiDoldur() {
            surelerData.forEach((sure, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = sure.sureAdi;
                sureSecici.appendChild(option);
            });
        }

        // --- 6. OLAY DİNLEYİCİLERİ ---
        document.addEventListener('DOMContentLoaded', () => {
            sureSeciciyiDoldur();
            renderAktifMod();
       // YENİ: Tarayıcıların ses yasağını kaldırmak için ilk tıklamada sesi başlat.
            document.body.addEventListener('click', initAudio, { once: true });
        });
       
        
        sureSecici.addEventListener('change', (e) => {
            guncelSureIndex = parseInt(e.target.value);
            renderAktifMod();
        });
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                navButtons.forEach(btn => btn.classList.remove('aktif'));
                e.target.classList.add('aktif');
                guncelMod = e.target.dataset.mod;
                renderAktifMod();
            });
        });

        // TAM EKRAN JAVASCRIPT'İ
        fullscreenBtn.addEventListener('click', () => {
            if (document.body.classList.contains('fullscreen')) {
                document.body.classList.remove('fullscreen');
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            } else {
                document.body.classList.add('fullscreen');
                if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
                else if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
                else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
                else if (document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
            }
        });

        function handleFullscreenChange() {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                document.body.classList.remove('fullscreen');
            }
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);