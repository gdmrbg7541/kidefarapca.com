// 1. OYUN VERİSİ
        const gameData = [{"root":"ح-ك-م","arapca_harekeli":"حَاكِم","arapca_harekesiz":"حاكم","turkce":"Hâkim 🧑‍⚖️","kalipNo":"33"},{"root":"ح-ك-م","arapca_harekeli":"حَكِيم","arapca_harekesiz":"حكيم","turkce":"Hekîm 👨‍⚕️","kalipNo":"35"},{"root":"ح-ك-م","arapca_harekeli":"مَحْكُوم","arapca_harekesiz":"محكوم","turkce":"Mahkum ⛓️","kalipNo":"36"},{"root":"ع-ر-ف","arapca_harekeli":"عِرْفَان","arapca_harekesiz":"عرفان","turkce":"İrfân 💡","kalipNo":"29"},{"root":"ع-ر-ف","arapca_harekeli":"عَارِف","arapca_harekesiz":"عارف","turkce":"Ârif 🧠","kalipNo":"33"},{"root":"ع-ر-ف","arapca_harekeli":"تَعْرِيف","arapca_harekesiz":"تعريف","turkce":"Tarif 📝","kalipNo":"61"},{"root":"ع-ل-م","arapca_harekeli":"عَالِم","arapca_harekesiz":"عالم","turkce":"Âlim 🎓","kalipNo":"33"},{"root":"ع-ل-м","arapca_harekeli":"تَعْلِيم","arapca_harekesiz":"تعليم","turkce":"Talim 🧑‍🏫","kalipNo":"61"},{"root":"ع-ل-м","arapca_harekeli":"مُعَلِّم","arapca_harekesiz":"معلم","turkce":"Muallim 👨‍🏫","kalipNo":"62"},{"root":"ر-ح-م","arapca_harekeli":"رَحِيم","arapca_harekesiz":"رحيم","turkce":"Rahîm 💖","kalipNo":"35"},{"root":"ر-ح-м","arapca_harekeli":"رَحْمَان","arapca_harekesiz":"رحمان","turkce":"Rahmân 💗","kalipNo":"28"},{"root":"ر-ح-м","arapca_harekeli":"مَرْحُوم","arapca_harekesiz":"مرحوم","turkce":"Merhum 🪦","kalipNo":"36"},{"root":"ر-ح-м","arapca_harekeli":"اِسْتِرْحَام","arapca_harekesiz":"استرحام","turkce":"İstirham 🙏","kalipNo":"103"},{"root":"ح-ف-ظ","arapca_harekeli":"حَافِظ","arapca_harekesiz":"حافظ","turkce":"Hâfız 📖","kalipNo":"33"},{"root":"ح-ف-ظ","arapca_harekeli":"مُحَافَظَة","arapca_harekesiz":"محافظة","turkce":"Muhafaza 🛡️","kalipNo":"67"},{"root":"ح-ف-ظ","arapca_harekeli":"مُحَافِظ","arapca_harekesiz":"محافظ","turkce":"Muhafız 💂","kalipNo":"69"},{"root":"ك-ت-ب","arapca_harekeli":"كِتَاب","arapca_harekesiz":"كتاب","turkce":"Kitâp 📚","kalipNo":"23"},{"root":"ك-ت-ب","arapca_harekeli":"مَكْتُوب","arapca_harekesiz":"مكتوب","turkce":"Mektup ✉️","kalipNo":"36"},{"root":"ك-ت-ب","arapca_harekeli":"كَاتِب","arapca_harekesiz":"كاتب","turkce":"Kâtip ✍️","kalipNo":"33"},{"root":"ك-ت-ب","arapca_harekeli":"مَكْتَب","arapca_harekesiz":"مكتب","turkce":"Mektep 🏫","kalipNo":"38"},{"root":"н-ظ-р","arapca_harekeli":"نَظَر","arapca_harekesiz":"نظر","turkce":"Nazar 👀","kalipNo":"17"},{"root":"н-ظ-р","arapca_harekeli":"مُنَاظَرَة","arapca_harekesiz":"مناظرة","turkce":"Münazara 🗣️","kalipNo":"67"},{"root":"н-ظ-р","arapca_harekeli":"اِنْتِظَار","arapca_harekesiz":"انتظار","turkce":"İntizar ⏳","kalipNo":"80"},{"root":"м-к-н","arapca_harekeli":"إِمْكَان","arapca_harekesiz":"إمكان","turkce":"İmkân ✨","kalipNo":"55"},{"root":"м-к-н","arapca_harekeli":"مُمْكِن","arapca_harekesiz":"ممكن","turkce":"Mümkün ✅","kalipNo":"56"},{"root":"м-к-н","arapca_harekeli":"تَمْكِين","arapca_harekesiz":"تمكين","turkce":"Temkin 🧐","kalipNo":"61"},{"root":"ح-س-н","arapca_harekeli":"حَسَن","arapca_harekesiz":"حسن","turkce":"Hasan 😊","kalipNo":"17"},{"root":"ح-س-н","arapca_harekeli":"حُسَيْن","arapca_harekesiz":"حسين","turkce":"Hüseyin 🧒","kalipNo":"49"},{"root":"ح-س-н","arapca_harekeli":"أَحْسَن","arapca_harekesiz":"أحسن","turkce":"Ahsen 🌟","kalipNo":"30"},{"root":"ح-س-н","arapca_harekeli":"حُسْنَى","arapca_harekesiz":"حسنى","turkce":"Hüsna 🌸","kalipNo":"51"},{"root":"ح-س-н","arapca_harekeli":"إِحْسَان","arapca_harekesiz":"إحسان","turkce":"İhsan ❤️","kalipNo":"55"},{"root":"ح-س-н","arapca_harekeli":"مُحْسِن","arapca_harekesiz":"محسن","turkce":"Muhsin 🥰","kalipNo":"56"},{"root":"ح-س-н","arapca_harekeli":"تَحْسِين","arapca_harekesiz":"تحسين","turkce":"Tahsin 👍","kalipNo":"61"},{"root":"س-ع-د","arapca_harekeli":"سَعَادَة","arapca_harekesiz":"سعادة","turkce":"Saâdet 🥳","kalipNo":"22"},{"root":"س-ع-د","arapca_harekeli":"سُعَاد","arapca_harekesiz":"سعاد","turkce":"Suâd 😌","kalipNo":"24"},{"root":"س-ع-د","arapca_harekeli":"سَعِيد","arapca_harekesiz":"سعيد","turkce":"Saîd 😀","kalipNo":"35"},{"root":"س-ع-د","arapca_harekeli":"مَسْعُود","arapca_harekesiz":"مسعود","turkce":"Mesud 😁","kalipNo":"36"},{"root":"ج-ه-ل","arapca_harekeli":"جَاهِل","arapca_harekesiz":"جاهل","turkce":"Câhil 🤷","kalipNo":"33"},{"root":"ج-ه-ل","arapca_harekeli":"مَجْهُول","arapca_harekesiz":"مجهول","turkce":"Meçhul ❓","kalipNo":"36"},{"root":"ج-ه-ل","arapca_harekeli":"جُهَلَاء","arapca_harekesiz":"جهلاء","turkce":"Cühela 👥","kalipNo":"46"},{"root":"و-ج-د","arapca_harekeli":"وُجُود","arapca_harekesiz":"وجود","turkce":"Vücut 🧘","kalipNo":"25"},{"root":"و-ج-د","arapca_harekeli":"وِجْدَان","arapca_harekesiz":"وجدان","turkce":"Vicdan 💖","kalipNo":"29"},{"root":"و-ج-د","arapca_harekeli":"مَوْجُود","arapca_harekesiz":"موجود","turkce":"Mevcut 📍","kalipNo":"36"},{"root":"و-ج-د","arapca_harekeli":"إِيجَاد","arapca_harekesiz":"إيجاد","turkce":"İcât 💡","kalipNo":"55"},{"root":"و-ج-د","arapca_harekeli":"مُوجِد","arapca_harekesiz":"موجد","turkce":"Mucit 👨‍🔬","kalipNo":"56"},{"root":"س-ك-н","arapca_harekeli":"سَاكِن","arapca_harekesiz":"ساكن","turkce":"Sâkin 🏠","kalipNo":"33"},{"root":"س-ك-н","arapca_harekeli":"مَسْكُون","arapca_harekesiz":"مسكون","turkce":"Meskûn 🏘️","kalipNo":"36"},{"root":"س-ك-н","arapca_harekeli":"مَسْكَن","arapca_harekesiz":"مسكن","turkce":"Mesken 🏡","kalipNo":"38"},{"root":"س-ك-н","arapca_harekeli":"إِسْكَان","arapca_harekesiz":"إسكان","turkce":"İskân 🏗️","kalipNo":"55"},{"root":"س-ك-н","arapca_harekeli":"تَسْكِين","arapca_harekesiz":"تسكين","turkce":"Teskin 😌","kalipNo":"61"},{"root":"ج-ه-د","arapca_harekeli":"جَاهِد","arapca_harekesiz":"جاهد","turkce":"Câhit 💪","kalipNo":"33"},{"root":"ج-ه-د","arapca_harekeli":"جِهَاد","arapca_harekesiz":"جهاد","turkce":"Cihât ⚔️","kalipNo":"68"},{"root":"ج-ه-د","arapca_harekeli":"مُجَاهِد","arapca_harekesiz":"مجاهد","turkce":"Mücâhit 🛡️","kalipNo":"69"},{"root":"ج-ه-د","arapca_harekeli":"اِجْتِهَاد","arapca_harekesiz":"اجتهاد","turkce":"İçtihât ⚖️","kalipNo":"80"},{"root":"ج-ه-د","arapca_harekeli":"مُجْتَهِد","arapca_harekesiz":"مجتهد","turkce":"Müçtehid 👨‍⚖️","kalipNo":"81"},{"root":"س-ل-м","arapca_harekeli":"سَلَام","arapca_harekesiz":"سلام","turkce":"Selâm 🕊️","kalipNo":"22"},{"root":"س-ل-м","arapca_harekeli":"سَالِم","arapca_harekesiz":"سالم","turkce":"Sâlim ✅","kalipNo":"33"},{"root":"س-ل-м","arapca_harekeli":"سَلِيم","arapca_harekesiz":"سليم","turkce":"Selîm 😊","kalipNo":"35"},{"root":"س-ل-м","arapca_harekeli":"إِسْلَام","arapca_harekesiz":"إسلام","turkce":"İslam ☪️","kalipNo":"55"},{"root":"س-ل-м","arapca_harekeli":"مُسْلِم","arapca_harekesiz":"مسلم","turkce":"Müslim 🕌","kalipNo":"56"},{"root":"س-ل-м","arapca_harekeli":"تَسْلِيم","arapca_harekesiz":"تسليم","turkce":"Teslim 🤝","kalipNo":"61"},{"root":"ق-ر-ب","arapca_harekeli":"قُرْبَان","arapca_harekesiz":"قربان","turkce":"Kurban 🐑","kalipNo":"27"},{"root":"ق-ر-ب","arapca_harekeli":"أَقْرَب","arapca_harekesiz":"أقرب","turkce":"Akreb 🦂","kalipNo":"30"},{"root":"ق-ر-ب","arapca_harekeli":"تَقْرِيبًا","arapca_harekesiz":"تقريبا","turkce":"Takriben 📐","kalipNo":"61"},{"root":"н-ظ-м","arapca_harekeli":"نَظْم","arapca_harekesiz":"نظم","turkce":"Nazım 📜","kalipNo":"19"},{"root":"н-ظ-м","arapca_harekeli":"نِظَام","arapca_harekesiz":"نظام","turkce":"Nizam ⚖️","kalipNo":"23"},{"root":"н-ظ-м","arapca_harekeli":"نَاظِم","arapca_harekesiz":"ناظم","turkce":"Nâzım ✍️","kalipNo":"33"},{"root":"н-ظ-м","arapca_harekeli":"مَنْظُوم","arapca_harekesiz":"منظوم","turkce":"Manzum 🎶","kalipNo":"36"},{"root":"н-ظ-м","arapca_harekeli":"تَنْظِيم","arapca_harekesiz":"تنظيم","turkce":"Tanzim 🗂️","kalipNo":"61"},{"root":"н-ظ-м","arapca_harekeli":"اِنْتِظَام","arapca_harekesiz":"انتظام","turkce":"İntizam 📏","kalipNo":"80"},{"root":"н-ظ-м","arapca_harekeli":"مُنْتَظَمًا","arapca_harekesiz":"منتظما","turkce":"Muntazam ✨","kalipNo":"82"},{"root":"د-خ-ل","arapca_harekeli":"دَاخِل","arapca_harekesiz":"داخل","turkce":"Dâhil ➡️","kalipNo":"33"},{"root":"د-خ-ل","arapca_harekeli":"إِدْخَال","arapca_harekesiz":"إدخال","turkce":"İthâl 📥","kalipNo":"55"},{"root":"د-خ-ل","arapca_harekeli":"مُدَاخَلَة","arapca_harekesiz":"مداخلة","turkce":"Müdahale ✋","kalipNo":"67"},{"root":"р-к-б","arapca_harekeli":"مَرْكَب","arapca_harekesiz":"مركب","turkce":"Merkeb 🐴","kalipNo":"38"},{"root":"р-к-б","arapca_harekeli":"تَرْكِيب","arapca_harekesiz":"تركيب","turkce":"Terkib 🧪","kalipNo":"61"},{"root":"р-к-б","arapca_harekeli":"مُرَكَّب","arapca_harekesiz":"مركب","turkce":"Mürekkeb ✒️","kalipNo":"63"},{"root":"ط-б-ق","arapca_harekeli":"طَبَقَة","arapca_harekesiz":"طبقة","turkce":"Tabaka 層","kalipNo":"17"},{"root":"ط-б-ق","arapca_harekeli":"تَطْبِيقَات","arapca_harekesiz":"تطبيقات","turkce":"Tatbikat 🏋️","kalipNo":"61"},{"root":"ط-б-ق","arapca_harekeli":"مُطَابَقَات","arapca_harekesiz":"مطابقات","turkce":"Mutabakat 🤝","kalipNo":"67"},{"root":"ط-б-ق","arapca_harekeli":"مُطَابِق","arapca_harekesiz":"مطابق","turkce":"Mutabık ✅","kalipNo":"69"},{"root":"н-ق-л","arapca_harekeli":"نَقْلِيَّة","arapca_harekesiz":"نقلية","turkce":"Nakliye 🚚","kalipNo":"19"},{"root":"н-ق-л","arapca_harekeli":"نَقِيل","arapca_harekesiz":"نقيل","turkce":"Nakîl 🔄","kalipNo":"35"},{"root":"н-ق-л","arapca_harekeli":"مَنْقُول","arapca_harekesiz":"منقول","turkce":"Menkul 🚗","kalipNo":"36"},{"root":"н-ق-л","arapca_harekeli":"اِنْتِقَال","arapca_harekesiz":"انتقال","turkce":"İntikal ↪️","kalipNo":"80"},{"root":"ш-р-б","arapca_harekeli":"شَرْبَة","arapca_harekesiz":"شربة","turkce":"Şerbet 🍹","kalipNo":"19"},{"root":"ш-р-б","arapca_harekeli":"شَرَاب","arapca_harekesiz":"شراب","turkce":"Şarâp 🍷","kalipNo":"22"},{"root":"ш-р-б","arapca_harekeli":"شُرُوب","arapca_harekesiz":"شروب","turkce":"Şurub 🍾","kalipNo":"25"},{"root":"ш-р-б","arapca_harekeli":"مَشْرُوبَات","arapca_harekesiz":"مشروبات","turkce":"Meşrubat 🥤","kalipNo":"36"},{"root":"ш-р-б","arapca_harekeli":"مَشْرَب","arapca_harekesiz":"مشرب","turkce":"Meşreb 🌿","kalipNo":"38"},{"root":"р-ج-ع","arapca_harekeli":"مَرْجِع","arapca_harekesiz":"مرجع","turkce":"Merci ↩️","kalipNo":"37"},{"root":"р-ج-ع","arapca_harekeli":"مُرَاجَعَة","arapca_harekesiz":"مراجعة","turkce":"Müracaat 📝","kalipNo":"67"},{"root":"р-ج-ع","arapca_harekeli":"اِرْتِجَاع","arapca_harekesiz":"ارتجاع","turkce":"İrtica 🔙","kalipNo":"80"},{"root":"ш-к-л","arapca_harekeli":"شَكْل","arapca_harekesiz":"شكل","turkce":"Şekil 🧩","kalipNo":"19"},{"root":"ш-к-л","arapca_harekeli":"أَشْكَال","arapca_harekesiz":"أشكال","turkce":"Eşkâl 🔶","kalipNo":"41"},{"root":"ш-к-л","arapca_harekeli":"مُشْكِل","arapca_harekesiz":"مشكل","turkce":"Müşkil 🤔","kalipNo":"56"},{"root":"ш-к-л","arapca_harekeli":"تَشْكِيلَات","arapca_harekesiz":"تشكيلات","turkce":"Teşkilat 👥","kalipNo":"61"},{"root":"н-с-б","arapca_harekeli":"نَسَب","arapca_harekesiz":"نسب","turkce":"Neseb 👨‍👩‍👧‍👦","kalipNo":"17"},{"root":"н-с-б","arapca_harekeli":"نِسْبَة","arapca_harekesiz":"نسبة","turkce":"Nisbet 📊","kalipNo":"20"},{"root":"н-с-б","arapca_harekeli":"مَنْسُوب","arapca_harekesiz":"منسوب","turkce":"Mensub 🔗","kalipNo":"36"},{"root":"н-с-б","arapca_harekeli":"مُنَاسَبَة","arapca_harekesiz":"مناسبة","turkce":"Münasebet 🎉","kalipNo":"67"},{"root":"н-с-б","arapca_harekeli":"اِنْتِسَاب","arapca_harekesiz":"انتساب","turkce":"İntisab 🖇️","kalipNo":"80"},{"root":"ш-ه-د","arapca_harekeli":"شَهَADَة","arapca_harekesiz":"شهادة","turkce":"Şehâdet 📜","kalipNo":"22"},{"root":"ш-ه-d","arapca_harekeli":"شَاهِد","arapca_harekesiz":"شاهد","turkce":"Şâhit 👀","kalipNo":"33"},{"root":"ш-ه-d","arapca_harekeli":"شَهِيد","arapca_harekesiz":"شهيد","turkce":"Şehît 🌺","kalipNo":"35"},{"root":"ш-ه-d","arapca_harekeli":"شُهَدَاء","arapca_harekesiz":"شهداء","turkce":"Şühedâ 🌷","kalipNo":"46"},{"root":"ш-ه-d","arapca_harekeli":"مُشَاهَدَة","arapca_harekesiz":"مشاهدة","turkce":"Müşahede 🔬","kalipNo":"67"},{"root":"б-р-к","arapca_harekeli":"بَرَكَة","arapca_harekesiz":"بركة","turkce":"Bereket 🌾","kalipNo":"17"},{"root":"б-р-к","arapca_harekeli":"تَبْرِيك","arapca_harekesiz":"تبريك","turkce":"Tebrik 🎉","kalipNo":"61"},{"root":"б-r-к","arapca_harekeli":"مُبَارَك","arapca_harekesiz":"مبارك","turkce":"Mübarek ✨","kalipNo":"70"},{"root":"б-r-к","arapca_harekeli":"تَبَرُّك","arapca_harekesiz":"تبرك","turkce":"Teberrük 🙏","kalipNo":"91"},{"root":"ق-д-р","arapca_harekeli":"مِقْدَار","arapca_harekesiz":"مقدار","turkce":"Miktâr 📏","kalipNo":"40"},{"root":"ق-д-r","arapca_harekeli":"قَدَر","arapca_harekesiz":"قدر","turkce":"Kader 🌌","kalipNo":"17"},{"root":"ق-д-r","arapca_harekeli":"تَقْدِير","arapca_harekesiz":"تقدير","turkce":"Takdir 👍","kalipNo":"61"},{"root":"ق-д-r","arapca_harekeli":"مُقَدَّرَات","arapca_harekesiz":"مقدرات","turkce":"Mukadderat 🌠","kalipNo":"63"},{"root":"ق-д-r","arapca_harekeli":"قُدْرَة","arapca_harekesiz":"قدرة","turkce":"Kudret 💪","kalipNo":"21"},{"root":"ق-д-r","arapca_harekeli":"اِقْتِدَار","arapca_harekesiz":"اقتدار","turkce":"İktidar 🏛️","kalipNo":"80"},{"root":"ق-д-r","arapca_harekeli":"قَADِر","arapca_harekesiz":"قادر","turkce":"Kâdir ⚡","kalipNo":"33"},{"root":"ق-д-r","arapca_harekeli":"مُقْتَدِر","arapca_harekesiz":"مقتدر","turkce":"Muktedir 🌟","kalipNo":"81"},{"root":"ق-д-r","arapca_harekeli":"قَدِير","arapca_harekesiz":"قدير","turkce":"Kadîr ✨","kalipNo":"35"},{"root":"м-л-к","arapca_harekeli":"مَلَك","arapca_harekesiz":"ملَك","turkce":"Melek 😇","kalipNo":"17"},{"root":"м-л-к","arapca_harekeli":"مُلْك","arapca_harekesiz":"ملْك","turkce":"Mülk 👑","kalipNo":"21"},{"root":"м-л-к","arapca_harekeli":"مَالِك","arapca_harekesiz":"مالك","turkce":"Mâlik 🔑","kalipNo":"33"},{"root":"м-л-к","arapca_harekeli":"مَلِيك","arapca_harekesiz":"مليك","turkce":"Melîk 🤴","kalipNo":"35"},{"root":"м-л-к","arapca_harekeli":"مَمْلُوك","arapca_harekesiz":"مملوك","turkce":"Memlük 💂","kalipNo":"36"},{"root":"м-л-к","arapca_harekeli":"مَمْلَكَة","arapca_harekesiz":"مملكة","turkce":"Memleket 🇹🇷","kalipNo":"38"},{"root":"м-л-к","arapca_harekeli":"أَمْلَاك","arapca_harekesiz":"أملاك","turkce":"Emlâk 🏘️","kalipNo":"41"},{"root":"р-с-л","arapca_harekeli":"رِسَالَة","arapca_harekesiz":"رسالة","turkce":"Risâle 📜","kalipNo":"23"},{"root":"р-с-л","arapca_harekeli":"رَسُول","arapca_harekesiz":"رسول","turkce":"Resul 🗣️","kalipNo":"26"},{"root":"р-с-л","arapca_harekeli":"أَرْسَل","arapca_harekesiz":"أرسل","turkce":"Ersel 🕊️","kalipNo":"30"},{"root":"р-с-л","arapca_harekeli":"إِرْسَالِيَّة","arapca_harekesiz":"إرسالية","turkce":"İrsaliye 🧾","kalipNo":"55"},{"root":"р-с-л","arapca_harekeli":"مُرْسَل","arapca_harekesiz":"مرسل","turkce":"Mürsel 📨","kalipNo":"57"},{"root":"н-ص-р","arapca_harekeli":"نُصْرَة","arapca_harekesiz":"نصرة","turkce":"Nusret ✌️","kalipNo":"21"},{"root":"н-ص-р","arapca_harekeli":"نَاصِر","arapca_harekesiz":"ناصر","turkce":"Nâsır 🛡️","kalipNo":"33"},{"root":"н-ص-р","arapca_harekeli":"مَنْصُور","arapca_harekesiz":"منصور","turkce":"Mansur 🥇","kalipNo":"36"},{"root":"ح-м-л","arapca_harekeli":"حَمْلَة","arapca_harekesiz":"حملة","turkce":"Hamle ♟️","kalipNo":"19"},{"root":"ح-м-л","arapca_harekeli":"حَامِلَة","arapca_harekesiz":"حاملة","turkce":"Hâmile 🤰","kalipNo":"33"},{"root":"ح-м-л","arapca_harekeli":"حَمَّال","arapca_harekesiz":"حمال","turkce":"Hammâl 🎒","kalipNo":"34"},{"root":"ح-м-л","arapca_harekeli":"اِحْتِمَال","arapca_harekesiz":"احتمال","turkce":"İhtimal 🎲","kalipNo":"80"},{"root":"ح-м-л","arapca_harekeli":"مُحْتَمَل","arapca_harekesiz":"محتمل","turkce":"Muhtemel ✅","kalipNo":"82"},{"root":"ح-м-л","arapca_harekeli":"تَحَمُّل","arapca_harekesiz":"تحمل","turkce":"Tahammül 🏋️","kalipNo":"91"},{"root":"ح-ق-ق","arapca_harekeli":"حَقّ","arapca_harekesiz":"حق","turkce":"Hak ⚖️","kalipNo":"19"},{"root":"ح-ق-ق","arapca_harekeli":"حُقُوق","arapca_harekesiz":"حقوق","turkce":"Hukuk 🏛️","kalipNo":"43"},{"root":"ح-ق-ق","arapca_harekeli":"حَقِيقة","arapca_harekesiz":"حقيقة","turkce":"Hakîkat 💎","kalipNo":"35"},{"root":"ح-ق-ق","arapca_harekeli":"تَحْقِiq","arapca_harekesiz":"تحقيق","turkce":"Tahkik 🕵️","kalipNo":"61"},{"root":"ح-ق-ق","arapca_harekeli":"مُحَقَّق","arapca_harekesiz":"محقق","turkce":"Muhakkak ✅","kalipNo":"63"},{"root":"ح-ق-ق","arapca_harekeli":"اِسْتِحْقَاق","arapca_harekesiz":"استحقاق","turkce":"İstihkak 🏅","kalipNo":"103"},{"root":"ح-ق-ق","arapca_harekeli":"مُسْتَحَقّ","arapca_harekesiz":"مستحق","turkce":"Müstehak 👍","kalipNo":"105"},{"root":"х-л-с","arapca_harekeli":"خَالِص","arapca_harekesiz":"خالص","turkce":"Hâlis 💧","kalipNo":"33"},{"root":"х-л-с","arapca_harekeli":"إِخْلَاص","arapca_harekesiz":"إخلاص","turkce":"İhlâs 💖","kalipNo":"55"},{"root":"х-л-с","arapca_harekeli":"مُخْلِص","arapca_harekesiz":"مخلص","turkce":"Muhlis 😊","kalipNo":"56"},{"root":"к-м-л","arapca_harekeli":"كَمَال","arapca_harekesiz":"كمال","turkce":"Kemâl ✨","kalipNo":"22"},{"root":"к-м-л","arapca_harekeli":"كَامِل","arapca_harekesiz":"كامل","turkce":"Kâmil 🌟","kalipNo":"33"},{"root":"к-м-л","arapca_harekeli":"إِكْمَال","arapca_harekesiz":"إكمال","turkce":"İkmâl 🏁","kalipNo":"55"},{"root":"к-м-л","arapca_harekeli":"تَكْمِيل","arapca_harekesiz":"تكميل","turkce":"Tekmil ✅","kalipNo":"61"},{"root":"к-м-л","arapca_harekeli":"مُكَمَّل","arapca_harekesiz":"مكمل","turkce":"Mükemmel 💯","kalipNo":"63"},{"root":"р-ш-д","arapca_harekeli":"رَشِيد","arapca_harekesiz":"رشيد","turkce":"Reşît 🧠","kalipNo":"35"},{"root":"р-ш-д","arapca_harekeli":"رُشْد","arapca_harekesiz":"رشد","turkce":"Rüşt 🧑","kalipNo":"21"},{"root":"р-ш-д","arapca_harekeli":"إِرْشَAD","arapca_harekesiz":"إرشاد","turkce":"İrşât 🧭","kalipNo":"55"},{"root":"р-ш-д","arapca_harekeli":"رَشَAD","arapca_harekesiz":"رشاد","turkce":"Reşât ✨","kalipNo":"22"},{"root":"р-ш-д","arapca_harekeli":"مُرْشِد","arapca_harekesiz":"مرشد","turkce":"Mürşid 🧑‍🏫","kalipNo":"56"},{"root":"р-ш-д","arapca_harekeli":"رَاشِد","arapca_harekesiz":"راشد","turkce":"Râşid 🚶","kalipNo":"33"},{"root":"أ-м-н","arapca_harekeli":"أَمَان","arapca_harekesiz":"أمان","turkce":"Emân 🛡️","kalipNo":"22"},{"root":"أ-м-н","arapca_harekeli":"أَمِين","arapca_harekesiz":"أمين","turkce":"Emîn 🔒","kalipNo":"35"},{"root":"أ-м-н","arapca_harekeli":"إِيمَان","arapca_harekesiz":"إيمان","turkce":"İman 💖","kalipNo":"55"},{"root":"أ-м-н","arapca_harekeli":"مُؤْمِن","arapca_harekesiz":"مؤمن","turkce":"Mümin 🙏","kalipNo":"56"},{"root":"أ-м-н","arapca_harekeli":"تَأْمِين","arapca_harekesiz":"تأمين","turkce":"Temin 🤝","kalipNo":"61"},{"root":"ج-м-ع","arapca_harekeli":"جَمْع","arapca_harekesiz":"جمع","turkce":"Cem 👥","kalipNo":"19"},{"root":"ج-м-ع","arapca_harekeli":"جَمْعِيَّة","arapca_harekesiz":"جمعية","turkce":"Cemiyet 🏛️","kalipNo":"19"},{"root":"ج-м-ع","arapca_harekeli":"جَمَاعة","arapca_harekesiz":"جماعة","turkce":"Cemâat 👨‍👩‍👧‍👦","kalipNo":"22"},{"root":"ج-м-ع","arapca_harekeli":"جَامِع","arapca_harekesiz":"جامع","turkce":"Câmi 🕌","kalipNo":"33"},{"root":"ج-м-ع","arapca_harekeli":"مَجْمُوعَة","arapca_harekesiz":"مجموعة","turkce":"Mecmua 📚","kalipNo":"36"},{"root":"ج-м-ع","arapca_harekeli":"اِجْتِمَاع","arapca_harekesiz":"اجتماع","turkce":"İçtima 🤝","kalipNo":"80"},{"root":"ح-м-д","arapca_harekeli":"حَمْد","arapca_harekesiz":"حمد","turkce":"Hamd 🙏","kalipNo":"19"},{"root":"ح-м-д","arapca_harekeli":"أَحْمَد","arapca_harekesiz":"أحمد","turkce":"Ahmet 🌟","kalipNo":"30"},{"root":"ح-м-д","arapca_harekeli":"حَمِيد","arapca_harekesiz":"حميد","turkce":"Hamît 😊","kalipNo":"35"},{"root":"ح-м-д","arapca_harekeli":"مَحْمُود","arapca_harekesiz":"محمود","turkce":"Mahmut ✨","kalipNo":"36"},{"root":"ح-м-д","arapca_harekeli":"مُحَمَّد","arapca_harekesiz":"محمد","turkce":"Muhammet 💖","kalipNo":"63"},{"root":"ш-ه-р","arapca_harekeli":"شَهْر","arapca_harekesiz":"شهر","turkce":"Şehir (Ay) 📅","kalipNo":"19"},{"root":"ш-ه-r","arapca_harekeli":"شُهْرَة","arapca_harekesiz":"شهرة","turkce":"Şöhret 🌟","kalipNo":"21"},{"root":"ш-ه-r","arapca_harekeli":"مَشْهُور","arapca_harekesiz":"مشهور","turkce":"Meşhur 🤩","kalipNo":"36"},{"root":"ш-ه-r","arapca_harekeli":"تَشْهِير","arapca_harekesiz":"تشهير","turkce":"Teşhir 🎨","kalipNo":"61"},{"root":"ш-к-р","arapca_harekeli":"شُكْر","arapca_harekesiz":"شكر","turkce":"Şükür 🙏","kalipNo":"21"},{"root":"ш-к-р","arapca_harekeli":"شُكْرَان","arapca_harekesiz":"شكران","turkce":"Şükrân 💖","kalipNo":"27"},{"root":"ш-к-р","arapca_harekeli":"شَاكِر","arapca_harekesiz":"شاكر","turkce":"Şâkir 😊","kalipNo":"33"},{"root":"ш-к-р","arapca_harekeli":"تَشَكُّر","arapca_harekesiz":"تشكر","turkce":"Teşekkür 🙌","kalipNo":"91"},{"root":"ш-к-р","arapca_harekeli":"مُتَشَكِّr","arapca_harekesiz":"متشكر","turkce":"Müteşekkir 🥰","kalipNo":"92"},{"root":"ф-к-р","arapca_harekeli":"فِكْر","arapca_harekesiz":"فكر","turkce":"Fikir 🧠","kalipNo":"20"},{"root":"ф-к-р","arapca_harekeli":"تَفَكُّر","arapca_harekesiz":"تفكر","turkce":"Tefekkür 🤔","kalipNo":"91"},{"root":"ф-к-р","arapca_harekeli":"مُتَفَكِّr","arapca_harekesiz":"متفكر","turkce":"Mütefekkir 🧘","kalipNo":"92"},{"root":"و-к-л","arapca_harekeli":"وَكَالَة","arapca_harekesiz":"وكالة","turkce":"Vekâlet 📜","kalipNo":"22"},{"root":"و-к-л","arapca_harekeli":"وَكِيل","arapca_harekesiz":"وكيل","turkce":"Vekîl 🧑‍💼","kalipNo":"35"},{"root":"و-к-л","arapca_harekeli":"مُوَكِّل","arapca_harekesiz":"موكل","turkce":"Müvekkil 👤","kalipNo":"62"},{"root":"و-к-л","arapca_harekeli":"تَوَكُّل","arapca_harekesiz":"توكل","turkce":"Tevekkül 🤲","kalipNo":"91"},{"root":"к-б-р","arapca_harekeli":"كِبْر","arapca_harekesiz":"كبر","turkce":"Kibir 😤","kalipNo":"20"},{"root":"к-б-р","arapca_harekeli":"كِبَار","arapca_harekesiz":"كبار","turkce":"Kibâr 😊","kalipNo":"44"},{"root":"к-б-р","arapca_harekeli":"أَكْبَر","arapca_harekesiz":"أكبر","turkce":"Ekber 📏","kalipNo":"30"},{"root":"к-б-р","arapca_harekeli":"كُبْرَى","arapca_harekesiz":"كبرى","turkce":"Kübra 📐","kalipNo":"51"},{"root":"к-б-р","arapca_harekeli":"تَكْبِير","arapca_harekesiz":"تكبير","turkce":"Tekbir 🙌","kalipNo":"61"},{"root":"к-б-р","arapca_harekeli":"تَكَبُّر","arapca_harekesiz":"تكبر","turkce":"Tekebbür 😒","kalipNo":"91"},{"root":"к-б-р","arapca_harekeli":"مُتَكَبِّr","arapca_harekesiz":"متكبر","turkce":"MütekeBBir 🙄","kalipNo":"92"},{"root":"ع-ق-л","arapca_harekeli":"عَقْل","arapca_harekesiz":"عقل","turkce":"Akıl 🧠","kalipNo":"19"},{"root":"ع-ق-л","arapca_harekeli":"عَاقِل","arapca_harekesiz":"عاقل","turkce":"Âkil 👨‍🏫","kalipNo":"33"},{"root":"ع-ق-л","arapca_harekeli":"مَعْقُول","arapca_harekesiz":"معقول","turkce":"Makul 👍","kalipNo":"36"},{"root":"ع-ق-л","arapca_harekeli":"عُقَلَاء","arapca_harekesiz":"عقلاء","turkce":"Ukelâ 🧐","kalipNo":"46"},{"root":"ع-ق-л","arapca_harekeli":"اِعْتِقَال","arapca_harekesiz":"اعتقال","turkce":"İtikal ⛓️","kalipNo":"80"},{"root":"ذ-к-р","arapca_harekeli":"ذِكْر","arapca_harekesiz":"ذكر","turkce":"Zikir 📿","kalipNo":"20"},{"root":"ذ-к-р","arapca_harekeli":"ذَاكِر","arapca_harekesiz":"ذاكر","turkce":"Zâkir 🧘","kalipNo":"33"},{"root":"ذ-к-р","arapca_harekeli":"مَذْكُور","arapca_harekesiz":"مذكور","turkce":"Mezkûr 📝","kalipNo":"36"},{"root":"ذ-к-р","arapca_harekeli":" تَذْكِرَة","arapca_harekesiz":" تذكرة","turkce":"Tezkire 🎟️","kalipNo":"65"},{"root":"ذ-к-r","arapca_harekeli":"تَذَكُّر","arapca_harekesiz":"تذكر","turkce":"Tezekkür 🤔","kalipNo":"91"},{"root":"ع-б-д","arapca_harekeli":"عَبْد","arapca_harekesiz":"عبد","turkce":"Abd 🙇","kalipNo":"19"},{"root":"ع-б-д","arapca_harekeli":"عِبَADَة","arapca_harekesiz":"عبادة","turkce":"İbâdet 🙏","kalipNo":"22"},{"root":"ع-б-д","arapca_harekeli":"مَعْبُود","arapca_harekesiz":"معبود","turkce":"Mabud ✨","kalipNo":"36"},{"root":"ع-б-д","arapca_harekeli":"مَعْبَد","arapca_harekesiz":"معبد","turkce":"Mabed 🏛️","kalipNo":"38"},{"root":"ع-б-д","arapca_harekeli":"عَابِد","arapca_harekesiz":"عابد","turkce":"Âbid 🧘","kalipNo":"33"}];

        // 2. DOM ELEMANLARI
        const startScreen = document.getElementById('start-screen');
        const gameWrapper1P = document.getElementById('game-wrapper-1p');
        const gameWrapper2P = document.getElementById('game-wrapper-2p');
        const gameOverScreen = document.getElementById('game-over-screen');
        const onePlayerBtn = document.getElementById('one-player-btn');
        const twoPlayerBtn = document.getElementById('two-player-btn');
        const restartButton = document.getElementById('restart-button');
        const back1PToMenuBtn = document.getElementById('back-1p-to-menu');
        const back2PToMenuBtn = document.getElementById('back-2p-to-menu');
        const wordDisplay1P = document.getElementById('word-display-1p');
        const optionsArea1P = document.getElementById('options-area-1p');
        const feedbackArea1P = document.getElementById('feedback-area-1p');
        const progressContainer1P = document.getElementById('progress-container-1p');
        const playerInfo1P = document.getElementById('player-info-1p');
        const wordDisplayP1 = document.getElementById('word-display-p1');
        const optionsAreaP1 = document.getElementById('options-area-p1');
        const feedbackAreaP1 = document.getElementById('feedback-area-p1');
        const progressContainerP1 = document.getElementById('progress-container-p1');
        const scoreDisplayP1 = document.getElementById('score-display-p1');
        const wordDisplayP2 = document.getElementById('word-display-p2');
        const optionsAreaP2 = document.getElementById('options-area-p2');
        const feedbackAreaP2 = document.getElementById('feedback-area-p2');
        const progressContainerP2 = document.getElementById('progress-container-p2');
        const scoreDisplayP2 = document.getElementById('score-display-p2');
        const finalScore = document.getElementById('final-score');

        // 3. OYUN DEĞİŞKENLERİ
        let currentQuestion1P = {};
        let score1P = 0; 
        let currentQuestionNumber = 0; 
        let waitingForNext1P = false;
        const TOTAL_QUESTIONS = 10;
        let gameMode = 1; 
        let currentQuestionP1 = {};
        let currentQuestionP2 = {};
        let scoreP1 = 0;
        let scoreP2 = 0;
        let questionStartTimeP1 = 0;
        let questionStartTimeP2 = 0;
        let answeredP1 = false;
        let answeredP2 = false;
        let tempAnswerP1 = null; 
        let tempAnswerP2 = null;

        // 4. SES SİSTEMİ
        let audioCtx;
        
        function initAudio() {
            if (audioCtx) return; 
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("Web Audio API not supported");
            }
        }
        
        function playSound(type) {
            if (!audioCtx) {
                initAudio();
            }
            if (!audioCtx) return;
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); 
            if (type === 'click') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'correct') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.3);
            } else if (type === 'wrong') {
                oscillator.type = 'square'; 
                oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2); 
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.2);
            }
        }

        // 5. OYUN MANTIĞI

        // Puan Patlama Animasyonu (Yıldız)
        function showPointAnimation(baseElement) {
            if (!baseElement) return;
            const rect = baseElement.getBoundingClientRect();
            const particleCount = 3; 
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'point-particle';
                particle.textContent = '⭐️';
                
                const randomX = (Math.random() - 0.5) * 10; 
                particle.style.setProperty('--random-x', `${randomX}vmin`);
                
                particle.style.top = `${rect.top + (rect.height / 2)}px`;
                particle.style.left = `${rect.left + (rect.width / 2)}px`;
                
                particle.style.animationDelay = `${Math.random() * 0.3}s`;
                document.body.appendChild(particle);
                setTimeout(() => { particle.remove(); }, 1500);
            }
        }

        // Hız Bonusu Animasyonu (Şimşek)
        function showSpeedAnimation(baseElement) {
            if (!baseElement) return;
            const rect = baseElement.getBoundingClientRect();
            const particleCount = 4; 

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'speed-particle';
                particle.textContent = '⚡️';
                
                const randomX = (Math.random() - 0.5) * 12; 
                particle.style.setProperty('--random-x', `${randomX}vmin`);
                
                particle.style.top = `${rect.top + (rect.height / 2)}px`;
                particle.style.left = `${rect.left + (rect.width / 2)}px`;
                
                particle.style.animationDelay = `${Math.random() * 0.2}s`; 
                document.body.appendChild(particle);
                setTimeout(() => { particle.remove(); }, 1200); 
            }
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // GARANTİ 4 ŞIK MANTIĞI
        function getQuestionOptions(correctAnswer) {
            const TARGET_OPTIONS = 4;
            let options = [correctAnswer];
            
            let siblings = gameData.filter(word => 
                word.root === correctAnswer.root && 
                word.turkce !== correctAnswer.turkce
            );
            shuffleArray(siblings);
            
            let siblingsToAdd = siblings.slice(0, TARGET_OPTIONS - 1);
            options = [...options, ...siblingsToAdd];
            
            let remainingSpots = TARGET_OPTIONS - options.length;
            if (remainingSpots > 0) {
                let nonSiblings = gameData.filter(word => 
                    word.root !== correctAnswer.root
                );
                shuffleArray(nonSiblings);
                options = [...options, ...nonSiblings.slice(0, remainingSpots)];
            }
            
            return shuffleArray(options);
        }

        // --- EKRAN YÖNETİMİ ---
        function showStartScreen() {
            gameWrapper1P.style.display = 'none';
            gameWrapper2P.style.display = 'none';
            gameOverScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        }

        // --- 1P OYUN FONKSİYONLARI ---
        function start1PGame() {
            gameMode = 1;
            score1P = 0;
            currentQuestionNumber = 0;
            waitingForNext1P = false;
            window._haBasZaman = Date.now();   /* GOREV: gercek oynanis suresi */
            
            playerInfo1P.style.display = 'block';
            playerInfo1P.textContent = '⭐️ 0'; 
            progressContainer1P.querySelectorAll('.progress-dot').forEach(dot => {
                dot.className = 'progress-dot';
            });
            
            startScreen.style.display = 'none';
            gameWrapper1P.style.display = 'flex';
            
            loadNewQuestion1P();
        }
        
        function loadNewQuestion1P() {
            waitingForNext1P = false;
            
            const randomIndex = Math.floor(Math.random() * gameData.length);
            const correctAnswer = gameData[randomIndex];
            currentQuestion1P = correctAnswer;
            
            const options = getQuestionOptions(correctAnswer); 
            
            wordDisplay1P.textContent = correctAnswer.arapca_harekesiz;
            optionsArea1P.innerHTML = '';
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.turkce;
                button.onclick = (e) => checkAnswer1P(option, e.target);
                optionsArea1P.appendChild(button);
            });
        }

        function checkAnswer1P(selectedOption, clickedButton) {
            if (waitingForNext1P) return; 
            playSound('click'); 
            
            waitingForNext1P = true;
            currentQuestionNumber++; 
            
            optionsArea1P.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
            const isCorrect = selectedOption.turkce === currentQuestion1P.turkce;
            
            let pointsEarned = 0;
            if (isCorrect) {
                pointsEarned = 10;
                score1P += pointsEarned;
                playerInfo1P.textContent = `⭐️ ${score1P}`; 
                
                showPointAnimation(clickedButton); 
                setTimeout(() => { showSpeedAnimation(clickedButton); }, 300); 
                
                clickedButton.classList.add('correct-option'); 
                playSound('correct'); 
            } else {
                clickedButton.classList.add('wrong-option', 'shake'); 
                playSound('wrong'); 
                
                optionsArea1P.querySelectorAll('.option-button').forEach(btn => {
                    if (btn.textContent === currentQuestion1P.turkce) {
                        btn.classList.add('correct-option');
                    }
                });
            }
            
            updateProgress(isCorrect, 0); 
            setTimeout(nextStep1P, 2000);
        }

        function nextStep1P() {
            optionsArea1P.querySelectorAll('.option-button.shake').forEach(btn => btn.classList.remove('shake'));
            if (currentQuestionNumber >= TOTAL_QUESTIONS) {
                showGameOver();
            } else {
                loadNewQuestion1P();
            }
        }

        // --- 2P OYUN FONKSİYONLARI ---
        function start2PGame() {
            gameMode = 2;
            scoreP1 = 0;
            scoreP2 = 0;
            currentQuestionNumber = 0;
            
            scoreDisplayP1.textContent = '⭐️ 0'; 
            scoreDisplayP2.textContent = '⭐️ 0'; 
            
            progressContainerP1.querySelectorAll('.progress-dot').forEach(dot => {
                dot.className = 'progress-dot progress-dot-2p';
            });
            progressContainerP2.querySelectorAll('.progress-dot').forEach(dot => {
                dot.className = 'progress-dot progress-dot-2p';
            });
            
            startScreen.style.display = 'none';
            gameWrapper2P.style.display = 'flex';
            
            loadNewQuestion2P();
        }

        function loadNewQuestion2P() {
            answeredP1 = false;
            answeredP2 = false;
            tempAnswerP1 = null;
            tempAnswerP2 = null;
            
            const randomIndexP1 = Math.floor(Math.random() * gameData.length);
            currentQuestionP1 = gameData[randomIndexP1];
            const optionsP1 = getQuestionOptions(currentQuestionP1); 
            
            wordDisplayP1.textContent = currentQuestionP1.arapca_harekesiz;
            optionsAreaP1.innerHTML = '';
            optionsP1.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button', 'option-button-2p');
                button.textContent = option.turkce;
                button.onclick = (e) => checkAnswer2P(option, e.target, 1);
                optionsAreaP1.appendChild(button);
            });
            
            let randomIndexP2 = Math.floor(Math.random() * gameData.length);
            while (randomIndexP2 === randomIndexP1) {
                randomIndexP2 = Math.floor(Math.random() * gameData.length);
            }
            currentQuestionP2 = gameData[randomIndexP2];
            const optionsP2 = getQuestionOptions(currentQuestionP2); 
            
            wordDisplayP2.textContent = currentQuestionP2.arapca_harekesiz;
            optionsAreaP2.innerHTML = '';
            optionsP2.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button', 'option-button-2p');
                button.textContent = option.turkce;
                button.onclick = (e) => checkAnswer2P(option, e.target, 2);
                optionsAreaP2.appendChild(button);
            });

            questionStartTimeP1 = Date.now();
            questionStartTimeP2 = Date.now();
        }

        function checkAnswer2P(selectedOption, clickedButton, player) {
            playSound('click'); 
            
            const timeTaken = Date.now() - (player === 1 ? questionStartTimeP1 : questionStartTimeP2);

            if (player === 1 && !answeredP1) {
                answeredP1 = true;
                optionsAreaP1.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
                tempAnswerP1 = { selectedOption, clickedButton, timeTaken };
            } else if (player === 2 && !answeredP2) {
                answeredP2 = true;
                optionsAreaP2.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
                tempAnswerP2 = { selectedOption, clickedButton, timeTaken };
            }

            if (answeredP1 && answeredP2) {
                show2PResults();
            }
        }

        function show2PResults() {
            currentQuestionNumber++;
            
            const isCorrectP1 = tempAnswerP1.selectedOption.turkce === currentQuestionP1.turkce;
            const isCorrectP2 = tempAnswerP2.selectedOption.turkce === currentQuestionP2.turkce;
            let pointsP1 = 0;
            let pointsP2 = 0;
            let bonusP1 = false;
            let bonusP2 = false;

            if (isCorrectP1) pointsP1 = 5;
            if (isCorrectP2) pointsP2 = 5;

            if (isCorrectP1 && isCorrectP2) {
                if (tempAnswerP1.timeTaken < tempAnswerP2.timeTaken) {
                    pointsP1 += 5; 
                    bonusP1 = true; 
                } else if (tempAnswerP2.timeTaken < tempAnswerP1.timeTaken) {
                    pointsP2 += 5; 
                    bonusP2 = true; 
                }
            }
            
            scoreP1 += pointsP1;
            scoreP2 += pointsP2;
            scoreDisplayP1.textContent = `⭐️ ${scoreP1}`; 
            scoreDisplayP2.textContent = `⭐️ ${scoreP2}`; 

            // Animasyonlar
            if (pointsP1 > 0) {
                showPointAnimation(tempAnswerP1.clickedButton); 
                if (bonusP1) {
                    setTimeout(() => { showSpeedAnimation(tempAnswerP1.clickedButton); }, 300);
                }
            }
            if (pointsP2 > 0) {
                showPointAnimation(tempAnswerP2.clickedButton); 
                if (bonusP2) {
                    setTimeout(() => { showSpeedAnimation(tempAnswerP2.clickedButton); }, 300);
                }
            }

            // Görsel Geribildirim
            if (isCorrectP1) {
                tempAnswerP1.clickedButton.classList.add('correct-option');
                if (pointsP1 > 0) playSound('correct'); 
            } else {
                tempAnswerP1.clickedButton.classList.add('wrong-option', 'shake');
                playSound('wrong'); 
                optionsAreaP1.querySelectorAll('.option-button').forEach(btn => {
                    if (btn.textContent === currentQuestionP1.turkce) {
                        btn.classList.add('correct-option');
                    }
                });
            }
            
            if (isCorrectP2) {
                tempAnswerP2.clickedButton.classList.add('correct-option');
                if (pointsP2 > 0 && !isCorrectP1) playSound('correct');
            } else {
                tempAnswerP2.clickedButton.classList.add('wrong-option', 'shake');
                if (!isCorrectP1) playSound('wrong'); 
                optionsAreaP2.querySelectorAll('.option-button').forEach(btn => {
                    if (btn.textContent === currentQuestionP2.turkce) {
                        btn.classList.add('correct-option');
                    }
                });
            }

            updateProgress(isCorrectP1, 1);
            updateProgress(isCorrectP2, 2);

            setTimeout(nextStep2P, 2500); 
        }

        function nextStep2P() {
            optionsAreaP1.querySelectorAll('.option-button.shake').forEach(btn => btn.classList.remove('shake'));
            optionsAreaP2.querySelectorAll('.option-button.shake').forEach(btn => btn.classList.remove('shake'));

            if (currentQuestionNumber >= TOTAL_QUESTIONS) {
                showGameOver();
            } else {
                loadNewQuestion2P();
            }
        }

        // --- ORTAK FONKSİYONLAR ---
        function updateProgress(isCorrect, player) {
            let container;
            if (player === 0) container = progressContainer1P; 
            if (player === 1) container = progressContainerP1; 
            if (player === 2) container = progressContainerP2; 
            
            const dot = container.children[currentQuestionNumber - 1];
            if (dot) {
                dot.classList.add(isCorrect ? 'correct' : 'wrong');
            }
        }
        
        function showGameOver() {
            gameWrapper1P.style.display = 'none';
            gameWrapper2P.style.display = 'none';
            
            if (gameMode === 1) {
                finalScore.textContent = `${TOTAL_QUESTIONS} sorudan ${score1P} puan aldınız!`;
                /* GOREV KOPRUSU — puan yalniz TEK KISILIK moddan bildirilir
                   (dogru sayisi = puan/10; soru basina 10 puan verilir). */
                try { if (window.KidefGorev && KidefGorev.aktif) KidefGorev.bildir({
                    dogru: Math.round(score1P / 10), toplam: TOTAL_QUESTIONS, mod: '1p',
                    sureSn: window._haBasZaman ? Math.round((Date.now() - window._haBasZaman) / 1000) : null
                }); } catch (e) { }
            } else {
                let winnerMessage = '';
                if (scoreP1 > scoreP2) {
                    winnerMessage = '🏆 1. OYUNCU KAZANDI! 🏆'; 
                } else if (scoreP2 > scoreP1) {
                    winnerMessage = '🏆 2. OYUNCU KAZANDI! 🏆'; 
                } else {
                    winnerMessage = '🤝 BERABERE! 🤝';
                }
                finalScore.innerHTML = `
                    <span style="color: #d63384">⭐️ 1. Oyuncu: ${scoreP1} Puan</span><br>
                    <span style="color: #0d6efd">⭐️ 2. Oyuncu: ${scoreP2} Puan</span><br><br>
                    <strong>${winnerMessage}</strong>
                `;
            }
            
            gameOverScreen.style.display = 'flex';
        }

        // 6. OYUNU BAŞLAT
        function initGame() {
            function setViewportHeight() {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
            setViewportHeight();
            window.addEventListener('resize', setViewportHeight);

            progressContainer1P.innerHTML = '';
            for (let i = 0; i < TOTAL_QUESTIONS; i++) {
                const dot = document.createElement('div');
                dot.classList.add('progress-dot');
                progressContainer1P.appendChild(dot);
            }
            progressContainerP1.innerHTML = '';
            for (let i = 0; i < TOTAL_QUESTIONS; i++) {
                const dot = document.createElement('div');
                dot.classList.add('progress-dot', 'progress-dot-2p');
                progressContainerP1.appendChild(dot);
            }
            progressContainerP2.innerHTML = '';
            for (let i = 0; i < TOTAL_QUESTIONS; i++) {
                const dot = document.createElement('div');
                dot.classList.add('progress-dot', 'progress-dot-2p');
                progressContainerP2.appendChild(dot);
            }
            
            onePlayerBtn.onclick = () => {
                initAudio();
                playSound('click');
                start1PGame();
            };
            
            // GÜNCELLEME: 'D' harfi kaldırıldı (SyntaxError Düzeltmesi)
            twoPlayerBtn.onclick = () => { 
                initAudio();
                playSound('click');
                start2PGame();
            };

            restartButton.onclick = () => {
                playSound('click');
                showStartScreen();
            };
            back1PToMenuBtn.onclick = () => {
                playSound('click');
                showStartScreen();
            };
            back2PToMenuBtn.onclick = () => {
                playSound('click');
                showStartScreen();
            };
            
            function firstTouchHandler() {
                initAudio();
                document.removeEventListener('click', firstTouchHandler);
                document.removeEventListener('touchstart', firstTouchHandler);
            }
            document.addEventListener('click', firstTouchHandler);
            document.addEventListener('touchstart', firstTouchHandler);

            showStartScreen();
        }
        
        document.addEventListener('DOMContentLoaded', initGame);