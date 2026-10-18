/* =====================================================================
   TEST KAPIŞMASI — FİİL ÇEKİMİ                     (oyunlar/tk_fiil.js)
   ---------------------------------------------------------------------
   Her sınıfa (5-10) bir «Fiil Çekimi» dersi ekler. Sorular o sınıfın
   KİTABINDA GEÇEN fiillerden ve kitabın İŞLEDİĞİ çekimlerden üretilir;
   kitapta olmayan kişi/zaman hiç sorulmaz (çeldirici olarak da çıkmaz):

     5. sınıf   6 fiil   emir — erkeğe / kıza (اُكْتُبْ / اُكْتُبي)
     6. sınıf   8 fiil   tekil: şimdiki zaman (ben, sen, o) + geçmiş (o)
                         2025-2026 kitabı seçiliyse geçmiş ve gelecek de tekil
     7. sınıf  10 fiil   tekil + biz: şimdiki, gelecek; geçmiş tekil
                         2027-2028 kitabı seçiliyse yalnız şimdiki zaman tekil
     8. sınıf  12 fiil   tekil + biz: geçmiş, şimdiki, gelecek; emir (erkeğe/kıza)
     9. sınıf  12 fiil   tekil: şimdiki ve geçmiş zaman (lise 9 kitabı
                         çoğul/ikil işlemiyor — 8. sınıftan geniş değil)
    10. sınıf  16 fiil   tam çekim (tekil, ikil, çoğul): geçmiş, şimdiki,
                         gelecek, emir, olumsuz emir

   KAPSAM nereden: muhadese/veri/<sınıf>_*.js metinlerindeki çekimli
   fiiller (Türkçe karşılıklarındaki kişi ekleriyle birlikte sayıldı) ve
   sistem/ciktiveri.js'teki yıllık plan «Dil bilgisi» satırları.
   6. ve 7. sınıfta hangi kitabın oynanacağını Test Kapışması'nın kendi yıl
   seçimi belirler (oyunlar/tk_ortaokul.js ile aynı).

   ÇEKİMLER: sâlim fiiller _kaynak/tk-fiil/cekim.js üreticisiyle (I, II,
   III, IV, V, VI, VIII, X. bab) yazıldı. Üretici sarf/fiiller.js'teki 16
   sâlim fiilin bütün biçimleriyle sınandı (ayrılan 5 yerin beşi de
   fiiller.js'in yanlışı) ve kitap metinlerindeki 1.683 fiil geçişinin
   hepsiyle iç harekede örtüştü. Veri _kaynak/tk-fiil/insa.js + yaz.js ile
   bu dosyaya gömülür; elle düzeltme yerine orada değiştirip yeniden
   kurun. İlletli,
   hemzeli ve muzâaf fiiller (أَحَبَّ، أَرادَ، نامَ، زارَ، صَلّى، اِشْتَرى، قَرَأَ،
   أَكَلَ، اِخْتارَ، أَخَذَ، قامَ) YALNIZ tekil + biz kişilerle ve tek tek
   yazılarak girdi; tam çekim isteyen 10. sınıfta yalnız sâlim fiil var.
   HAREKE: Arapca_Hareke_Kuralları — fiil son harf dâhil tam harekeli,
   med harfinden önceki harf harekesiz (سافَرْتُ، يُسافِرُ، اُكْتُبي), şedde
   harekeden önce.

   SORU TÜRLERİ (dört şık, tek doğru):
     A) zamir → çekim       أَنْتِ  «yazmak · geçmiş zaman»  → كَتَبْتِ
     B) çekim → zamir       كَتَبْتِ → أَنْتِ (altında «sen (kız)»)
     C) çekim → Türkçe      تَكْتُبينَ → Sen (kız) yazıyorsun
     D) Türkçe → çekim      Ben gideceğim → سَأَذْهَبُ
   Aynı biçim iki kişiye uyuyorsa (تَكْتُبُ = sen (erkek) / o (kız))
   öbürü çeldirici yapılmaz.

   SORU BİÇİMİ tk_alfabe.js'teki gibi:
     { id, tip:'alfabe', alt:'fiil', soruTuru, soruHtml, ustlik, siklar:[{html, dogru}] }
   testkapismasi.js bu biçimi kendi çizer ve denetler.
   ===================================================================== */
(function () {
    'use strict';
    if (window.TKFiil) return;

    function metin(k, tr, yer) {
        var m = (window.KidefDil && window.KidefDil.metin) ? window.KidefDil.metin(k, tr) : tr;
        if (!yer || m == null) return m;
        return String(m).replace(/\{([A-Za-z0-9_]+)\}/g, function (t, ad) {
            return Object.prototype.hasOwnProperty.call(yer, ad) ? String(yer[ad]) : t;
        });
    }
    function karistir(a) {
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }
    function kacis(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    /* ---------------- 1. ZAMİRLER ------------------------------------
       Sîga sırası sarf/fiiller.js ile aynı:
       0 هو 1 هما 2 هم 3 هي 4 هما(müennes) 5 هنّ 6 أنتَ 7 أنتما 8 أنتم
       9 أنتِ 10 أنتما(müennes) 11 أنتنّ 12 أنا 13 نحن
       Emir ve olumsuz emirde sıra: 0 أنتَ 1 أنتما 2 أنتم 3 أنتِ 4 أنتما 5 أنتنّ */
    var ZAMIR = ['هُوَ', 'هُما', 'هُمْ', 'هِيَ', 'هُما', 'هُنَّ', 'أَنْتَ', 'أَنْتُما', 'أَنْتُمْ',
                 'أَنْتِ', 'أَنْتُما', 'أَنْتُنَّ', 'أَنا', 'نَحْنُ'];
    var ETIKET = ['o (erkek)', 'o ikisi (erkek)', 'onlar (erkekler)', 'o (kız)', 'o ikisi (kız)', 'onlar (kızlar)',
                  'sen (erkek)', 'siz ikiniz', 'siz (erkekler)', 'sen (kız)', 'siz ikiniz', 'siz (kızlar)', 'ben', 'biz'];
    var KISI_TR = ['O (erkek)', 'O ikisi (erkek)', 'Onlar (erkekler)', 'O (kız)', 'O ikisi (kız)', 'Onlar (kızlar)',
                   'Sen (erkek)', 'Siz ikiniz', 'Siz (erkekler)', 'Sen (kız)', 'Siz ikiniz', 'Siz (kızlar)', 'Ben', 'Biz'];
    var EMIR_SIGA = [6, 7, 8, 9, 10, 11];
    var EMIR_TR = ['(erkeğe)', '(iki kişiye)', '(erkeklere)', '(kıza)', '(iki kişiye)', '(kızlara)'];

    /* ---------------- 2. FİİLLER -------------------------------------
       t: Türkçe «geçmiş|şimdiki|gelecek|emir|emir (çoğul)» — 3. tekil
       m: mâzî (14 sîga)   u: muzâri (14)   e: emir (6)   n: olumsuz emir (6, لا olmadan)
       null = o kişi kitapta yok / bu fiil için yazılmadı (o kişi sorulmaz). */
    var FIIL = {
        'كتب': { t: 'yazdı|yazıyor|yazacak|yaz|yazın',
            m: ['كَتَبَ', 'كَتَبا', 'كَتَبوا', 'كَتَبَتْ', 'كَتَبَتا', 'كَتَبْنَ', 'كَتَبْتَ', 'كَتَبْتُما', 'كَتَبْتُمْ', 'كَتَبْتِ', 'كَتَبْتُما', 'كَتَبْتُنَّ', 'كَتَبْتُ', 'كَتَبْنا'],
            u: ['يَكْتُبُ', 'يَكْتُبانِ', 'يَكْتُبونَ', 'تَكْتُبُ', 'تَكْتُبانِ', 'يَكْتُبْنَ', 'تَكْتُبُ', 'تَكْتُبانِ', 'تَكْتُبونَ', 'تَكْتُبينَ', 'تَكْتُبانِ', 'تَكْتُبْنَ', 'أَكْتُبُ', 'نَكْتُبُ'],
            e: ['اُكْتُبْ', 'اُكْتُبا', 'اُكْتُبوا', 'اُكْتُبي', 'اُكْتُبا', 'اُكْتُبْنَ'],
            n: ['تَكْتُبْ', 'تَكْتُبا', 'تَكْتُبوا', 'تَكْتُبي', 'تَكْتُبا', 'تَكْتُبْنَ'] },
        'فتح': { t: 'açtı|açıyor|açacak|aç|açın',
            m: ['فَتَحَ', 'فَتَحا', 'فَتَحوا', 'فَتَحَتْ', 'فَتَحَتا', 'فَتَحْنَ', 'فَتَحْتَ', 'فَتَحْتُما', 'فَتَحْتُمْ', 'فَتَحْتِ', 'فَتَحْتُما', 'فَتَحْتُنَّ', 'فَتَحْتُ', 'فَتَحْنا'],
            u: ['يَفْتَحُ', 'يَفْتَحانِ', 'يَفْتَحونَ', 'تَفْتَحُ', 'تَفْتَحانِ', 'يَفْتَحْنَ', 'تَفْتَحُ', 'تَفْتَحانِ', 'تَفْتَحونَ', 'تَفْتَحينَ', 'تَفْتَحانِ', 'تَفْتَحْنَ', 'أَفْتَحُ', 'نَفْتَحُ'],
            e: ['اِفْتَحْ', 'اِفْتَحا', 'اِفْتَحوا', 'اِفْتَحي', 'اِفْتَحا', 'اِفْتَحْنَ'],
            n: ['تَفْتَحْ', 'تَفْتَحا', 'تَفْتَحوا', 'تَفْتَحي', 'تَفْتَحا', 'تَفْتَحْنَ'] },
        'أغلق': { t: 'kapattı|kapatıyor|kapatacak|kapat|kapatın',
            m: ['أَغْلَقَ', 'أَغْلَقا', 'أَغْلَقوا', 'أَغْلَقَتْ', 'أَغْلَقَتا', 'أَغْلَقْنَ', 'أَغْلَقْتَ', 'أَغْلَقْتُما', 'أَغْلَقْتُمْ', 'أَغْلَقْتِ', 'أَغْلَقْتُما', 'أَغْلَقْتُنَّ', 'أَغْلَقْتُ', 'أَغْلَقْنا'],
            u: ['يُغْلِقُ', 'يُغْلِقانِ', 'يُغْلِقونَ', 'تُغْلِقُ', 'تُغْلِقانِ', 'يُغْلِقْنَ', 'تُغْلِقُ', 'تُغْلِقانِ', 'تُغْلِقونَ', 'تُغْلِقينَ', 'تُغْلِقانِ', 'تُغْلِقْنَ', 'أُغْلِقُ', 'نُغْلِقُ'],
            e: ['أَغْلِقْ', 'أَغْلِقا', 'أَغْلِقوا', 'أَغْلِقي', 'أَغْلِقا', 'أَغْلِقْنَ'],
            n: ['تُغْلِقْ', 'تُغْلِقا', 'تُغْلِقوا', 'تُغْلِقي', 'تُغْلِقا', 'تُغْلِقْنَ'] },
        'أخذ': { t: 'aldı|alıyor|alacak|al|alın',
            m: ['أَخَذَ', null, null, 'أَخَذَتْ', null, null, 'أَخَذْتَ', null, null, 'أَخَذْتِ', null, null, 'أَخَذْتُ', 'أَخَذْنا'],
            u: ['يَأْخُذُ', null, null, 'تَأْخُذُ', null, null, 'تَأْخُذُ', null, null, 'تَأْخُذينَ', null, null, 'آخُذُ', 'نَأْخُذُ'],
            e: ['خُذْ', null, null, 'خُذي', null, null] },
        'جلس': { t: 'oturdu|oturuyor|oturacak|otur|oturun',
            m: ['جَلَسَ', 'جَلَسا', 'جَلَسوا', 'جَلَسَتْ', 'جَلَسَتا', 'جَلَسْنَ', 'جَلَسْتَ', 'جَلَسْتُما', 'جَلَسْتُمْ', 'جَلَسْتِ', 'جَلَسْتُما', 'جَلَسْتُنَّ', 'جَلَسْتُ', 'جَلَسْنا'],
            u: ['يَجْلِسُ', 'يَجْلِسانِ', 'يَجْلِسونَ', 'تَجْلِسُ', 'تَجْلِسانِ', 'يَجْلِسْنَ', 'تَجْلِسُ', 'تَجْلِسانِ', 'تَجْلِسونَ', 'تَجْلِسينَ', 'تَجْلِسانِ', 'تَجْلِسْنَ', 'أَجْلِسُ', 'نَجْلِسُ'],
            e: ['اِجْلِسْ', 'اِجْلِسا', 'اِجْلِسوا', 'اِجْلِسي', 'اِجْلِسا', 'اِجْلِسْنَ'],
            n: ['تَجْلِسْ', 'تَجْلِسا', 'تَجْلِسوا', 'تَجْلِسي', 'تَجْلِسا', 'تَجْلِسْنَ'] },
        'قام': { t: 'kalktı|kalkıyor|kalkacak|kalk|kalkın',
            m: ['قامَ', null, null, 'قامَتْ', null, null, 'قُمْتَ', null, null, 'قُمْتِ', null, null, 'قُمْتُ', 'قُمْنا'],
            u: ['يَقومُ', null, null, 'تَقومُ', null, null, 'تَقومُ', null, null, 'تَقومينَ', null, null, 'أَقومُ', 'نَقومُ'],
            e: ['قُمْ', null, null, 'قومي', null, null] },
        'ذهب': { t: 'gitti|gidiyor|gidecek|git|gidin',
            m: ['ذَهَبَ', 'ذَهَبا', 'ذَهَبوا', 'ذَهَبَتْ', 'ذَهَبَتا', 'ذَهَبْنَ', 'ذَهَبْتَ', 'ذَهَبْتُما', 'ذَهَبْتُمْ', 'ذَهَبْتِ', 'ذَهَبْتُما', 'ذَهَبْتُنَّ', 'ذَهَبْتُ', 'ذَهَبْنا'],
            u: ['يَذْهَبُ', 'يَذْهَبانِ', 'يَذْهَبونَ', 'تَذْهَبُ', 'تَذْهَبانِ', 'يَذْهَبْنَ', 'تَذْهَبُ', 'تَذْهَبانِ', 'تَذْهَبونَ', 'تَذْهَبينَ', 'تَذْهَبانِ', 'تَذْهَبْنَ', 'أَذْهَبُ', 'نَذْهَبُ'],
            e: ['اِذْهَبْ', 'اِذْهَبا', 'اِذْهَبوا', 'اِذْهَبي', 'اِذْهَبا', 'اِذْهَبْنَ'],
            n: ['تَذْهَبْ', 'تَذْهَبا', 'تَذْهَبوا', 'تَذْهَبي', 'تَذْهَبا', 'تَذْهَبْنَ'] },
        'أحب': { t: 'sevdi|seviyor|sevecek|sev|sevin',
            m: ['أَحَبَّ', null, null, 'أَحَبَّتْ', null, null, 'أَحْبَبْتَ', null, null, 'أَحْبَبْتِ', null, null, 'أَحْبَبْتُ', 'أَحْبَبْنا'],
            u: ['يُحِبُّ', null, null, 'تُحِبُّ', null, null, 'تُحِبُّ', null, null, 'تُحِبّينَ', null, null, 'أُحِبُّ', 'نُحِبُّ'],
            e: [null, null, null, null, null, null] },
        'اختار': { t: 'seçti|seçiyor|seçecek|seç|seçin',
            m: ['اِخْتارَ', null, null, 'اِخْتارَتْ', null, null, 'اِخْتَرْتَ', null, null, 'اِخْتَرْتِ', null, null, 'اِخْتَرْتُ', 'اِخْتَرْنا'],
            u: ['يَخْتارُ', null, null, 'تَخْتارُ', null, null, 'تَخْتارُ', null, null, 'تَخْتارينَ', null, null, 'أَخْتارُ', 'نَخْتارُ'],
            e: ['اِخْتَرْ', null, null, 'اِخْتاري', null, null] },
        'أكل': { t: 'yedi|yiyor|yiyecek|ye|yiyin',
            m: ['أَكَلَ', null, null, 'أَكَلَتْ', null, null, 'أَكَلْتَ', null, null, 'أَكَلْتِ', null, null, 'أَكَلْتُ', 'أَكَلْنا'],
            u: ['يَأْكُلُ', null, null, 'تَأْكُلُ', null, null, 'تَأْكُلُ', null, null, 'تَأْكُلينَ', null, null, 'آكُلُ', 'نَأْكُلُ'],
            e: ['كُلْ', null, null, 'كُلي', null, null] },
        'قرأ': { t: 'okudu|okuyor|okuyacak|oku|okuyun',
            m: ['قَرَأَ', null, null, 'قَرَأَتْ', null, null, 'قَرَأْتَ', null, null, 'قَرَأْتِ', null, null, 'قَرَأْتُ', 'قَرَأْنا'],
            u: ['يَقْرَأُ', null, null, 'تَقْرَأُ', null, null, 'تَقْرَأُ', null, null, 'تَقْرَئينَ', null, null, 'أَقْرَأُ', 'نَقْرَأُ'],
            e: ['اِقْرَأْ', null, null, 'اِقْرَئي', null, null] },
        'فضل': { t: 'tercih etti|tercih ediyor|tercih edecek|tercih et|tercih edin',
            m: ['فَضَّلَ', 'فَضَّلا', 'فَضَّلوا', 'فَضَّلَتْ', 'فَضَّلَتا', 'فَضَّلْنَ', 'فَضَّلْتَ', 'فَضَّلْتُما', 'فَضَّلْتُمْ', 'فَضَّلْتِ', 'فَضَّلْتُما', 'فَضَّلْتُنَّ', 'فَضَّلْتُ', 'فَضَّلْنا'],
            u: ['يُفَضِّلُ', 'يُفَضِّلانِ', 'يُفَضِّلونَ', 'تُفَضِّلُ', 'تُفَضِّلانِ', 'يُفَضِّلْنَ', 'تُفَضِّلُ', 'تُفَضِّلانِ', 'تُفَضِّلونَ', 'تُفَضِّلينَ', 'تُفَضِّلانِ', 'تُفَضِّلْنَ', 'أُفَضِّلُ', 'نُفَضِّلُ'],
            e: ['فَضِّلْ', 'فَضِّلا', 'فَضِّلوا', 'فَضِّلي', 'فَضِّلا', 'فَضِّلْنَ'],
            n: ['تُفَضِّلْ', 'تُفَضِّلا', 'تُفَضِّلوا', 'تُفَضِّلي', 'تُفَضِّلا', 'تُفَضِّلْنَ'] },
        'فعل': { t: 'yaptı|yapıyor|yapacak|yap|yapın',
            m: ['فَعَلَ', 'فَعَلا', 'فَعَلوا', 'فَعَلَتْ', 'فَعَلَتا', 'فَعَلْنَ', 'فَعَلْتَ', 'فَعَلْتُما', 'فَعَلْتُمْ', 'فَعَلْتِ', 'فَعَلْتُما', 'فَعَلْتُنَّ', 'فَعَلْتُ', 'فَعَلْنا'],
            u: ['يَفْعَلُ', 'يَفْعَلانِ', 'يَفْعَلونَ', 'تَفْعَلُ', 'تَفْعَلانِ', 'يَفْعَلْنَ', 'تَفْعَلُ', 'تَفْعَلانِ', 'تَفْعَلونَ', 'تَفْعَلينَ', 'تَفْعَلانِ', 'تَفْعَلْنَ', 'أَفْعَلُ', 'نَفْعَلُ'],
            e: ['اِفْعَلْ', 'اِفْعَلا', 'اِفْعَلوا', 'اِفْعَلي', 'اِفْعَلا', 'اِفْعَلْنَ'],
            n: ['تَفْعَلْ', 'تَفْعَلا', 'تَفْعَلوا', 'تَفْعَلي', 'تَفْعَلا', 'تَفْعَلْنَ'] },
        'زار': { t: 'ziyaret etti|ziyaret ediyor|ziyaret edecek|ziyaret et|ziyaret edin',
            m: ['زارَ', null, null, 'زارَتْ', null, null, 'زُرْتَ', null, null, 'زُرْتِ', null, null, 'زُرْتُ', 'زُرْنا'],
            u: ['يَزورُ', null, null, 'تَزورُ', null, null, 'تَزورُ', null, null, 'تَزورينَ', null, null, 'أَزورُ', 'نَزورُ'],
            e: ['زُرْ', null, null, 'زوري', null, null] },
        'نظف': { t: 'temizledi|temizliyor|temizleyecek|temizle|temizleyin',
            m: ['نَظَّفَ', 'نَظَّفا', 'نَظَّفوا', 'نَظَّفَتْ', 'نَظَّفَتا', 'نَظَّفْنَ', 'نَظَّفْتَ', 'نَظَّفْتُما', 'نَظَّفْتُمْ', 'نَظَّفْتِ', 'نَظَّفْتُما', 'نَظَّفْتُنَّ', 'نَظَّفْتُ', 'نَظَّفْنا'],
            u: ['يُنَظِّفُ', 'يُنَظِّفانِ', 'يُنَظِّفونَ', 'تُنَظِّفُ', 'تُنَظِّفانِ', 'يُنَظِّفْنَ', 'تُنَظِّفُ', 'تُنَظِّفانِ', 'تُنَظِّفونَ', 'تُنَظِّفينَ', 'تُنَظِّفانِ', 'تُنَظِّفْنَ', 'أُنَظِّفُ', 'نُنَظِّفُ'],
            e: ['نَظِّفْ', 'نَظِّفا', 'نَظِّفوا', 'نَظِّفي', 'نَظِّفا', 'نَظِّفْنَ'],
            n: ['تُنَظِّفْ', 'تُنَظِّفا', 'تُنَظِّفوا', 'تُنَظِّفي', 'تُنَظِّفا', 'تُنَظِّفْنَ'] },
        'دخل': { t: 'girdi|giriyor|girecek|gir|girin',
            m: ['دَخَلَ', 'دَخَلا', 'دَخَلوا', 'دَخَلَتْ', 'دَخَلَتا', 'دَخَلْنَ', 'دَخَلْتَ', 'دَخَلْتُما', 'دَخَلْتُمْ', 'دَخَلْتِ', 'دَخَلْتُما', 'دَخَلْتُنَّ', 'دَخَلْتُ', 'دَخَلْنا'],
            u: ['يَدْخُلُ', 'يَدْخُلانِ', 'يَدْخُلونَ', 'تَدْخُلُ', 'تَدْخُلانِ', 'يَدْخُلْنَ', 'تَدْخُلُ', 'تَدْخُلانِ', 'تَدْخُلونَ', 'تَدْخُلينَ', 'تَدْخُلانِ', 'تَدْخُلْنَ', 'أَدْخُلُ', 'نَدْخُلُ'],
            e: ['اُدْخُلْ', 'اُدْخُلا', 'اُدْخُلوا', 'اُدْخُلي', 'اُدْخُلا', 'اُدْخُلْنَ'],
            n: ['تَدْخُلْ', 'تَدْخُلا', 'تَدْخُلوا', 'تَدْخُلي', 'تَدْخُلا', 'تَدْخُلْنَ'] },
        'عمل': { t: 'çalıştı|çalışıyor|çalışacak|çalış|çalışın',
            m: ['عَمِلَ', 'عَمِلا', 'عَمِلوا', 'عَمِلَتْ', 'عَمِلَتا', 'عَمِلْنَ', 'عَمِلْتَ', 'عَمِلْتُما', 'عَمِلْتُمْ', 'عَمِلْتِ', 'عَمِلْتُما', 'عَمِلْتُنَّ', 'عَمِلْتُ', 'عَمِلْنا'],
            u: ['يَعْمَلُ', 'يَعْمَلانِ', 'يَعْمَلونَ', 'تَعْمَلُ', 'تَعْمَلانِ', 'يَعْمَلْنَ', 'تَعْمَلُ', 'تَعْمَلانِ', 'تَعْمَلونَ', 'تَعْمَلينَ', 'تَعْمَلانِ', 'تَعْمَلْنَ', 'أَعْمَلُ', 'نَعْمَلُ'],
            e: ['اِعْمَلْ', 'اِعْمَلا', 'اِعْمَلوا', 'اِعْمَلي', 'اِعْمَلا', 'اِعْمَلْنَ'],
            n: ['تَعْمَلْ', 'تَعْمَلا', 'تَعْمَلوا', 'تَعْمَلي', 'تَعْمَلا', 'تَعْمَلْنَ'] },
        'استيقظ': { t: 'uyandı|uyanıyor|uyanacak|uyan|uyanın',
            m: ['اِسْتَيْقَظَ', 'اِسْتَيْقَظا', 'اِسْتَيْقَظوا', 'اِسْتَيْقَظَتْ', 'اِسْتَيْقَظَتا', 'اِسْتَيْقَظْنَ', 'اِسْتَيْقَظْتَ', 'اِسْتَيْقَظْتُما', 'اِسْتَيْقَظْتُمْ', 'اِسْتَيْقَظْتِ', 'اِسْتَيْقَظْتُما', 'اِسْتَيْقَظْتُنَّ', 'اِسْتَيْقَظْتُ', 'اِسْتَيْقَظْنا'],
            u: ['يَسْتَيْقِظُ', 'يَسْتَيْقِظانِ', 'يَسْتَيْقِظونَ', 'تَسْتَيْقِظُ', 'تَسْتَيْقِظانِ', 'يَسْتَيْقِظْنَ', 'تَسْتَيْقِظُ', 'تَسْتَيْقِظانِ', 'تَسْتَيْقِظونَ', 'تَسْتَيْقِظينَ', 'تَسْتَيْقِظانِ', 'تَسْتَيْقِظْنَ', 'أَسْتَيْقِظُ', 'نَسْتَيْقِظُ'],
            e: ['اِسْتَيْقِظْ', 'اِسْتَيْقِظا', 'اِسْتَيْقِظوا', 'اِسْتَيْقِظي', 'اِسْتَيْقِظا', 'اِسْتَيْقِظْنَ'],
            n: ['تَسْتَيْقِظْ', 'تَسْتَيْقِظا', 'تَسْتَيْقِظوا', 'تَسْتَيْقِظي', 'تَسْتَيْقِظا', 'تَسْتَيْقِظْنَ'] },
        'نام': { t: 'uyudu|uyuyor|uyuyacak|uyu|uyuyun',
            m: ['نامَ', null, null, 'نامَتْ', null, null, 'نِمْتَ', null, null, 'نِمْتِ', null, null, 'نِمْتُ', 'نِمْنا'],
            u: ['يَنامُ', null, null, 'تَنامُ', null, null, 'تَنامُ', null, null, 'تَنامينَ', null, null, 'أَنامُ', 'نَنامُ'],
            e: ['نَمْ', null, null, 'نامي', null, null] },
        'ساعد': { t: 'yardım etti|yardım ediyor|yardım edecek|yardım et|yardım edin',
            m: ['ساعَدَ', 'ساعَدا', 'ساعَدوا', 'ساعَدَتْ', 'ساعَدَتا', 'ساعَدْنَ', 'ساعَدْتَ', 'ساعَدْتُما', 'ساعَدْتُمْ', 'ساعَدْتِ', 'ساعَدْتُما', 'ساعَدْتُنَّ', 'ساعَدْتُ', 'ساعَدْنا'],
            u: ['يُساعِدُ', 'يُساعِدانِ', 'يُساعِدونَ', 'تُساعِدُ', 'تُساعِدانِ', 'يُساعِدْنَ', 'تُساعِدُ', 'تُساعِدانِ', 'تُساعِدونَ', 'تُساعِدينَ', 'تُساعِدانِ', 'تُساعِدْنَ', 'أُساعِدُ', 'نُساعِدُ'],
            e: ['ساعِدْ', 'ساعِدا', 'ساعِدوا', 'ساعِدي', 'ساعِدا', 'ساعِدْنَ'],
            n: ['تُساعِدْ', 'تُساعِدا', 'تُساعِدوا', 'تُساعِدي', 'تُساعِدا', 'تُساعِدْنَ'] },
        'صلى': { t: 'namaz kıldı|namaz kılıyor|namaz kılacak|namaz kıl|namaz kılın',
            m: ['صَلّى', null, null, 'صَلَّتْ', null, null, 'صَلَّيْتَ', null, null, 'صَلَّيْتِ', null, null, 'صَلَّيْتُ', 'صَلَّيْنا'],
            u: ['يُصَلّي', null, null, 'تُصَلّي', null, null, 'تُصَلّي', null, null, 'تُصَلّينَ', null, null, 'أُصَلّي', 'نُصَلّي'],
            e: ['صَلِّ', null, null, 'صَلّي', null, null] },
        'لعب': { t: 'oynadı|oynuyor|oynayacak|oyna|oynayın',
            m: ['لَعِبَ', 'لَعِبا', 'لَعِبوا', 'لَعِبَتْ', 'لَعِبَتا', 'لَعِبْنَ', 'لَعِبْتَ', 'لَعِبْتُما', 'لَعِبْتُمْ', 'لَعِبْتِ', 'لَعِبْتُما', 'لَعِبْتُنَّ', 'لَعِبْتُ', 'لَعِبْنا'],
            u: ['يَلْعَبُ', 'يَلْعَبانِ', 'يَلْعَبونَ', 'تَلْعَبُ', 'تَلْعَبانِ', 'يَلْعَبْنَ', 'تَلْعَبُ', 'تَلْعَبانِ', 'تَلْعَبونَ', 'تَلْعَبينَ', 'تَلْعَبانِ', 'تَلْعَبْنَ', 'أَلْعَبُ', 'نَلْعَبُ'],
            e: ['اِلْعَبْ', 'اِلْعَبا', 'اِلْعَبوا', 'اِلْعَبي', 'اِلْعَبا', 'اِلْعَبْنَ'],
            n: ['تَلْعَبْ', 'تَلْعَبا', 'تَلْعَبوا', 'تَلْعَبي', 'تَلْعَبا', 'تَلْعَبْنَ'] },
        'تناول': { t: 'yedi|yiyor|yiyecek|ye|yiyin',
            m: ['تَناوَلَ', 'تَناوَلا', 'تَناوَلوا', 'تَناوَلَتْ', 'تَناوَلَتا', 'تَناوَلْنَ', 'تَناوَلْتَ', 'تَناوَلْتُما', 'تَناوَلْتُمْ', 'تَناوَلْتِ', 'تَناوَلْتُما', 'تَناوَلْتُنَّ', 'تَناوَلْتُ', 'تَناوَلْنا'],
            u: ['يَتَناوَلُ', 'يَتَناوَلانِ', 'يَتَناوَلونَ', 'تَتَناوَلُ', 'تَتَناوَلانِ', 'يَتَناوَلْنَ', 'تَتَناوَلُ', 'تَتَناوَلانِ', 'تَتَناوَلونَ', 'تَتَناوَلينَ', 'تَتَناوَلانِ', 'تَتَناوَلْنَ', 'أَتَناوَلُ', 'نَتَناوَلُ'],
            e: ['تَناوَلْ', 'تَناوَلا', 'تَناوَلوا', 'تَناوَلي', 'تَناوَلا', 'تَناوَلْنَ'],
            n: ['تَتَناوَلْ', 'تَتَناوَلا', 'تَتَناوَلوا', 'تَتَناوَلي', 'تَتَناوَلا', 'تَتَناوَلْنَ'] },
        'سافر': { t: 'seyahat etti|seyahat ediyor|seyahat edecek|seyahat et|seyahat edin',
            m: ['سافَرَ', 'سافَرا', 'سافَروا', 'سافَرَتْ', 'سافَرَتا', 'سافَرْنَ', 'سافَرْتَ', 'سافَرْتُما', 'سافَرْتُمْ', 'سافَرْتِ', 'سافَرْتُما', 'سافَرْتُنَّ', 'سافَرْتُ', 'سافَرْنا'],
            u: ['يُسافِرُ', 'يُسافِرانِ', 'يُسافِرونَ', 'تُسافِرُ', 'تُسافِرانِ', 'يُسافِرْنَ', 'تُسافِرُ', 'تُسافِرانِ', 'تُسافِرونَ', 'تُسافِرينَ', 'تُسافِرانِ', 'تُسافِرْنَ', 'أُسافِرُ', 'نُسافِرُ'],
            e: ['سافِرْ', 'سافِرا', 'سافِروا', 'سافِري', 'سافِرا', 'سافِرْنَ'],
            n: ['تُسافِرْ', 'تُسافِرا', 'تُسافِروا', 'تُسافِري', 'تُسافِرا', 'تُسافِرْنَ'] },
        'تجول': { t: 'gezdi|geziyor|gezecek|gez|gezin',
            m: ['تَجَوَّلَ', 'تَجَوَّلا', 'تَجَوَّلوا', 'تَجَوَّلَتْ', 'تَجَوَّلَتا', 'تَجَوَّلْنَ', 'تَجَوَّلْتَ', 'تَجَوَّلْتُما', 'تَجَوَّلْتُمْ', 'تَجَوَّلْتِ', 'تَجَوَّلْتُما', 'تَجَوَّلْتُنَّ', 'تَجَوَّلْتُ', 'تَجَوَّلْنا'],
            u: ['يَتَجَوَّلُ', 'يَتَجَوَّلانِ', 'يَتَجَوَّلونَ', 'تَتَجَوَّلُ', 'تَتَجَوَّلانِ', 'يَتَجَوَّلْنَ', 'تَتَجَوَّلُ', 'تَتَجَوَّلانِ', 'تَتَجَوَّلونَ', 'تَتَجَوَّلينَ', 'تَتَجَوَّلانِ', 'تَتَجَوَّلْنَ', 'أَتَجَوَّلُ', 'نَتَجَوَّلُ'],
            e: ['تَجَوَّلْ', 'تَجَوَّلا', 'تَجَوَّلوا', 'تَجَوَّلي', 'تَجَوَّلا', 'تَجَوَّلْنَ'],
            n: ['تَتَجَوَّلْ', 'تَتَجَوَّلا', 'تَتَجَوَّلوا', 'تَتَجَوَّلي', 'تَتَجَوَّلا', 'تَتَجَوَّلْنَ'] },
        'شرب': { t: 'içti|içiyor|içecek|iç|için',
            m: ['شَرِبَ', 'شَرِبا', 'شَرِبوا', 'شَرِبَتْ', 'شَرِبَتا', 'شَرِبْنَ', 'شَرِبْتَ', 'شَرِبْتُما', 'شَرِبْتُمْ', 'شَرِبْتِ', 'شَرِبْتُما', 'شَرِبْتُنَّ', 'شَرِبْتُ', 'شَرِبْنا'],
            u: ['يَشْرَبُ', 'يَشْرَبانِ', 'يَشْرَبونَ', 'تَشْرَبُ', 'تَشْرَبانِ', 'يَشْرَبْنَ', 'تَشْرَبُ', 'تَشْرَبانِ', 'تَشْرَبونَ', 'تَشْرَبينَ', 'تَشْرَبانِ', 'تَشْرَبْنَ', 'أَشْرَبُ', 'نَشْرَبُ'],
            e: ['اِشْرَبْ', 'اِشْرَبا', 'اِشْرَبوا', 'اِشْرَبي', 'اِشْرَبا', 'اِشْرَبْنَ'],
            n: ['تَشْرَبْ', 'تَشْرَبا', 'تَشْرَبوا', 'تَشْرَبي', 'تَشْرَبا', 'تَشْرَبْنَ'] },
        'رجع': { t: 'döndü|dönüyor|dönecek|dön|dönün',
            m: ['رَجَعَ', 'رَجَعا', 'رَجَعوا', 'رَجَعَتْ', 'رَجَعَتا', 'رَجَعْنَ', 'رَجَعْتَ', 'رَجَعْتُما', 'رَجَعْتُمْ', 'رَجَعْتِ', 'رَجَعْتُما', 'رَجَعْتُنَّ', 'رَجَعْتُ', 'رَجَعْنا'],
            u: ['يَرْجِعُ', 'يَرْجِعانِ', 'يَرْجِعونَ', 'تَرْجِعُ', 'تَرْجِعانِ', 'يَرْجِعْنَ', 'تَرْجِعُ', 'تَرْجِعانِ', 'تَرْجِعونَ', 'تَرْجِعينَ', 'تَرْجِعانِ', 'تَرْجِعْنَ', 'أَرْجِعُ', 'نَرْجِعُ'],
            e: ['اِرْجِعْ', 'اِرْجِعا', 'اِرْجِعوا', 'اِرْجِعي', 'اِرْجِعا', 'اِرْجِعْنَ'],
            n: ['تَرْجِعْ', 'تَرْجِعا', 'تَرْجِعوا', 'تَرْجِعي', 'تَرْجِعا', 'تَرْجِعْنَ'] },
        'ركب': { t: 'bindi|biniyor|binecek|bin|binin',
            m: ['رَكِبَ', 'رَكِبا', 'رَكِبوا', 'رَكِبَتْ', 'رَكِبَتا', 'رَكِبْنَ', 'رَكِبْتَ', 'رَكِبْتُما', 'رَكِبْتُمْ', 'رَكِبْتِ', 'رَكِبْتُما', 'رَكِبْتُنَّ', 'رَكِبْتُ', 'رَكِبْنا'],
            u: ['يَرْكَبُ', 'يَرْكَبانِ', 'يَرْكَبونَ', 'تَرْكَبُ', 'تَرْكَبانِ', 'يَرْكَبْنَ', 'تَرْكَبُ', 'تَرْكَبانِ', 'تَرْكَبونَ', 'تَرْكَبينَ', 'تَرْكَبانِ', 'تَرْكَبْنَ', 'أَرْكَبُ', 'نَرْكَبُ'],
            e: ['اِرْكَبْ', 'اِرْكَبا', 'اِرْكَبوا', 'اِرْكَبي', 'اِرْكَبا', 'اِرْكَبْنَ'],
            n: ['تَرْكَبْ', 'تَرْكَبا', 'تَرْكَبوا', 'تَرْكَبي', 'تَرْكَبا', 'تَرْكَبْنَ'] },
        'لبس': { t: 'giydi|giyiyor|giyecek|giy|giyin',
            m: ['لَبِسَ', 'لَبِسا', 'لَبِسوا', 'لَبِسَتْ', 'لَبِسَتا', 'لَبِسْنَ', 'لَبِسْتَ', 'لَبِسْتُما', 'لَبِسْتُمْ', 'لَبِسْتِ', 'لَبِسْتُما', 'لَبِسْتُنَّ', 'لَبِسْتُ', 'لَبِسْنا'],
            u: ['يَلْبَسُ', 'يَلْبَسانِ', 'يَلْبَسونَ', 'تَلْبَسُ', 'تَلْبَسانِ', 'يَلْبَسْنَ', 'تَلْبَسُ', 'تَلْبَسانِ', 'تَلْبَسونَ', 'تَلْبَسينَ', 'تَلْبَسانِ', 'تَلْبَسْنَ', 'أَلْبَسُ', 'نَلْبَسُ'],
            e: ['اِلْبَسْ', 'اِلْبَسا', 'اِلْبَسوا', 'اِلْبَسي', 'اِلْبَسا', 'اِلْبَسْنَ'],
            n: ['تَلْبَسْ', 'تَلْبَسا', 'تَلْبَسوا', 'تَلْبَسي', 'تَلْبَسا', 'تَلْبَسْنَ'] },
        'نظر': { t: 'baktı|bakıyor|bakacak|bak|bakın',
            m: ['نَظَرَ', 'نَظَرا', 'نَظَروا', 'نَظَرَتْ', 'نَظَرَتا', 'نَظَرْنَ', 'نَظَرْتَ', 'نَظَرْتُما', 'نَظَرْتُمْ', 'نَظَرْتِ', 'نَظَرْتُما', 'نَظَرْتُنَّ', 'نَظَرْتُ', 'نَظَرْنا'],
            u: ['يَنْظُرُ', 'يَنْظُرانِ', 'يَنْظُرونَ', 'تَنْظُرُ', 'تَنْظُرانِ', 'يَنْظُرْنَ', 'تَنْظُرُ', 'تَنْظُرانِ', 'تَنْظُرونَ', 'تَنْظُرينَ', 'تَنْظُرانِ', 'تَنْظُرْنَ', 'أَنْظُرُ', 'نَنْظُرُ'],
            e: ['اُنْظُرْ', 'اُنْظُرا', 'اُنْظُروا', 'اُنْظُري', 'اُنْظُرا', 'اُنْظُرْنَ'],
            n: ['تَنْظُرْ', 'تَنْظُرا', 'تَنْظُروا', 'تَنْظُري', 'تَنْظُرا', 'تَنْظُرْنَ'] },
        'استمع': { t: 'dinledi|dinliyor|dinleyecek|dinle|dinleyin',
            m: ['اِسْتَمَعَ', 'اِسْتَمَعا', 'اِسْتَمَعوا', 'اِسْتَمَعَتْ', 'اِسْتَمَعَتا', 'اِسْتَمَعْنَ', 'اِسْتَمَعْتَ', 'اِسْتَمَعْتُما', 'اِسْتَمَعْتُمْ', 'اِسْتَمَعْتِ', 'اِسْتَمَعْتُما', 'اِسْتَمَعْتُنَّ', 'اِسْتَمَعْتُ', 'اِسْتَمَعْنا'],
            u: ['يَسْتَمِعُ', 'يَسْتَمِعانِ', 'يَسْتَمِعونَ', 'تَسْتَمِعُ', 'تَسْتَمِعانِ', 'يَسْتَمِعْنَ', 'تَسْتَمِعُ', 'تَسْتَمِعانِ', 'تَسْتَمِعونَ', 'تَسْتَمِعينَ', 'تَسْتَمِعانِ', 'تَسْتَمِعْنَ', 'أَسْتَمِعُ', 'نَسْتَمِعُ'],
            e: ['اِسْتَمِعْ', 'اِسْتَمِعا', 'اِسْتَمِعوا', 'اِسْتَمِعي', 'اِسْتَمِعا', 'اِسْتَمِعْنَ'],
            n: ['تَسْتَمِعْ', 'تَسْتَمِعا', 'تَسْتَمِعوا', 'تَسْتَمِعي', 'تَسْتَمِعا', 'تَسْتَمِعْنَ'] },
        'أراد': { t: 'istedi|istiyor|isteyecek|iste|isteyin',
            m: ['أَرادَ', null, null, 'أَرادَتْ', null, null, 'أَرَدْتَ', null, null, 'أَرَدْتِ', null, null, 'أَرَدْتُ', 'أَرَدْنا'],
            u: ['يُريدُ', null, null, 'تُريدُ', null, null, 'تُريدُ', null, null, 'تُريدينَ', null, null, 'أُريدُ', 'نُريدُ'],
            e: [null, null, null, null, null, null] },
        'خرج': { t: 'çıktı|çıkıyor|çıkacak|çık|çıkın',
            m: ['خَرَجَ', 'خَرَجا', 'خَرَجوا', 'خَرَجَتْ', 'خَرَجَتا', 'خَرَجْنَ', 'خَرَجْتَ', 'خَرَجْتُما', 'خَرَجْتُمْ', 'خَرَجْتِ', 'خَرَجْتُما', 'خَرَجْتُنَّ', 'خَرَجْتُ', 'خَرَجْنا'],
            u: ['يَخْرُجُ', 'يَخْرُجانِ', 'يَخْرُجونَ', 'تَخْرُجُ', 'تَخْرُجانِ', 'يَخْرُجْنَ', 'تَخْرُجُ', 'تَخْرُجانِ', 'تَخْرُجونَ', 'تَخْرُجينَ', 'تَخْرُجانِ', 'تَخْرُجْنَ', 'أَخْرُجُ', 'نَخْرُجُ'],
            e: ['اُخْرُجْ', 'اُخْرُجا', 'اُخْرُجوا', 'اُخْرُجي', 'اُخْرُجا', 'اُخْرُجْنَ'],
            n: ['تَخْرُجْ', 'تَخْرُجا', 'تَخْرُجوا', 'تَخْرُجي', 'تَخْرُجا', 'تَخْرُجْنَ'] },
        'غسل': { t: 'yıkadı|yıkıyor|yıkayacak|yıka|yıkayın',
            m: ['غَسَلَ', 'غَسَلا', 'غَسَلوا', 'غَسَلَتْ', 'غَسَلَتا', 'غَسَلْنَ', 'غَسَلْتَ', 'غَسَلْتُما', 'غَسَلْتُمْ', 'غَسَلْتِ', 'غَسَلْتُما', 'غَسَلْتُنَّ', 'غَسَلْتُ', 'غَسَلْنا'],
            u: ['يَغْسِلُ', 'يَغْسِلانِ', 'يَغْسِلونَ', 'تَغْسِلُ', 'تَغْسِلانِ', 'يَغْسِلْنَ', 'تَغْسِلُ', 'تَغْسِلانِ', 'تَغْسِلونَ', 'تَغْسِلينَ', 'تَغْسِلانِ', 'تَغْسِلْنَ', 'أَغْسِلُ', 'نَغْسِلُ'],
            e: ['اِغْسِلْ', 'اِغْسِلا', 'اِغْسِلوا', 'اِغْسِلي', 'اِغْسِلا', 'اِغْسِلْنَ'],
            n: ['تَغْسِلْ', 'تَغْسِلا', 'تَغْسِلوا', 'تَغْسِلي', 'تَغْسِلا', 'تَغْسِلْنَ'] },
        'اشترى': { t: 'satın aldı|satın alıyor|satın alacak|satın al|satın alın',
            m: ['اِشْتَرى', null, null, 'اِشْتَرَتْ', null, null, 'اِشْتَرَيْتَ', null, null, 'اِشْتَرَيْتِ', null, null, 'اِشْتَرَيْتُ', 'اِشْتَرَيْنا'],
            u: ['يَشْتَري', null, null, 'تَشْتَري', null, null, 'تَشْتَري', null, null, 'تَشْتَرينَ', null, null, 'أَشْتَري', 'نَشْتَري'],
            e: ['اِشْتَرِ', null, null, 'اِشْتَري', null, null] },
        'رسم': { t: 'çizdi|çiziyor|çizecek|çiz|çizin',
            m: ['رَسَمَ', 'رَسَما', 'رَسَموا', 'رَسَمَتْ', 'رَسَمَتا', 'رَسَمْنَ', 'رَسَمْتَ', 'رَسَمْتُما', 'رَسَمْتُمْ', 'رَسَمْتِ', 'رَسَمْتُما', 'رَسَمْتُنَّ', 'رَسَمْتُ', 'رَسَمْنا'],
            u: ['يَرْسُمُ', 'يَرْسُمانِ', 'يَرْسُمونَ', 'تَرْسُمُ', 'تَرْسُمانِ', 'يَرْسُمْنَ', 'تَرْسُمُ', 'تَرْسُمانِ', 'تَرْسُمونَ', 'تَرْسُمينَ', 'تَرْسُمانِ', 'تَرْسُمْنَ', 'أَرْسُمُ', 'نَرْسُمُ'],
            e: ['اُرْسُمْ', 'اُرْسُما', 'اُرْسُموا', 'اُرْسُمي', 'اُرْسُما', 'اُرْسُمْنَ'],
            n: ['تَرْسُمْ', 'تَرْسُما', 'تَرْسُموا', 'تَرْسُمي', 'تَرْسُما', 'تَرْسُمْنَ'] }
    };

    /* ---------------- 3. SINIF KAPSAMLARI ----------------------------
       f: fiiller (kitapta en çok geçenler; Türkçe anlamı aynı iki fiil
          aynı sınıfa konmadı)   z: zaman → sîgalar   k: kapsam adı */
    var KAPSAM = {
        '5': { k: 'emir', f: ['كتب', 'فتح', 'أغلق', 'أخذ', 'جلس', 'قام'],
            z: { emir: [0, 3] } },
        '8': { k: 'tekilbiz', f: ['ذهب', 'أحب', 'اختار', 'أكل', 'قرأ', 'فضل', 'فعل', 'زار', 'كتب', 'نظف', 'دخل', 'جلس'],
            z: { mazi: [12, 13, 6, 9, 0, 3], muzari: [12, 13, 6, 9, 0, 3], gelecek: [12, 13, 6, 9, 0, 3], emir: [0, 3] } },
        '9': { k: 'tekil', f: ['عمل', 'أكل', 'استيقظ', 'قرأ', 'ذهب', 'نام', 'فعل', 'ساعد', 'صلى', 'جلس', 'كتب', 'لعب'],
            z: { muzari: [12, 6, 9, 0, 3], mazi: [12, 6, 9, 0, 3] } },
        '10': { k: 'tam', f: ['ذهب', 'عمل', 'تناول', 'فضل', 'سافر', 'فعل', 'تجول', 'ساعد', 'شرب', 'رجع', 'ركب', 'لبس', 'نظر', 'استمع', 'كتب', 'نظف'],
            z: { mazi: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13], muzari: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13], gelecek: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13], emir: [0, 1, 2, 3, 5], nehiy: [0, 1, 2, 3, 5] } },
        '6@2026-2027': { k: 'tekil', f: ['ذهب', 'أراد', 'فضل', 'استيقظ', 'لبس', 'أكل', 'أحب', 'خرج'],
            z: { muzari: [12, 6, 9, 0, 3], mazi: [0, 3] } },
        '6@2025-2026': { k: 'tekil', f: ['أراد', 'فضل', 'ذهب', 'أكل', 'غسل', 'استيقظ', 'لعب', 'شرب'],
            z: { muzari: [12, 6, 9, 0, 3], mazi: [12, 6, 9, 0, 3], gelecek: [12, 6, 9, 0, 3] } },
        '7@2026-2027': { k: 'tekilbiz', f: ['أراد', 'فضل', 'زار', 'ذهب', 'اشترى', 'لعب', 'صلى', 'أحب', 'عمل', 'رسم'],
            z: { muzari: [12, 13, 6, 9, 0, 3], gelecek: [12, 13, 6, 9, 0, 3], mazi: [12, 6, 9, 0, 3] } },
        '7@2027-2028': { k: 'tekil', f: ['صلى', 'ذهب', 'رجع', 'أراد', 'أكل', 'ساعد', 'شرب', 'نام', 'نظف', 'استيقظ'],
            z: { muzari: [12, 6, 9, 0, 3] } }
    };

    var ZAMAN = {
        mazi:    ['tk.f_mazi', 'geçmiş zaman'],
        muzari:  ['tk.f_muzari', 'şimdiki zaman'],
        gelecek: ['tk.f_gelecek', 'gelecek zaman'],
        emir:    ['tk.f_emir', 'emir'],
        nehiy:   ['tk.f_nehiy', 'olumsuz emir']
    };
    var KAPSAM_AD = {
        emir:     ['tk.f_k_emir', 'erkeğe / kıza emir'],
        tekil:    ['tk.f_k_tekil', 'tekil'],
        tekilbiz: ['tk.f_k_tekilbiz', 'tekil ve biz'],
        tam:      ['tk.f_k_tam', 'tam çekim']
    };

    /* ---------------- 4. TÜRKÇE ÇEKİM --------------------------------
       3. tekilden kişi ekleri; ünlü uyumu son ünlüye bakar. */
    function sonUnlu(s) { var m = String(s).toLocaleLowerCase('tr').match(/[aeıioöuü](?=[^aeıioöuü]*$)/); return m ? m[0] : 'a'; }
    function ince(v) { return 'eiöü'.indexOf(v) >= 0; }
    function buyuk(s) { return s.charAt(0).toLocaleUpperCase('tr') + s.slice(1); }
    var SINIF = ['3t', '3t', '3c', '3t', '3t', '3c', '2t', '2c', '2c', '2t', '2c', '2c', '1t', '1c'];
    function gecmis(g, k) {
        var v = sonUnlu(g), niz = { 'ı': 'nız', 'i': 'niz', 'u': 'nuz', 'ü': 'nüz' }[v] || 'nız';
        return { '1t': g + 'm', '2t': g + 'n', '1c': g + 'k', '2c': g + niz, '3c': g + (ince(v) ? 'ler' : 'lar') }[k] || g;
    }
    function simdi(s, k) { return { '1t': s + 'um', '2t': s + 'sun', '1c': s + 'uz', '2c': s + 'sunuz', '3c': s + 'lar' }[k] || s; }
    function gelecek(c, k) {
        var a = !ince(sonUnlu(c)), kok = c.slice(0, -1);
        return { '1t': kok + 'ğ' + (a ? 'ım' : 'im'), '1c': kok + 'ğ' + (a ? 'ız' : 'iz'), '2t': c + (a ? 'sın' : 'sin'),
                 '2c': c + (a ? 'sınız' : 'siniz'), '3c': c + (a ? 'lar' : 'ler') }[k] || c;
    }
    function cumle(t, z, sg) {
        var p = t.split('|');
        if (z === 'emir') return buyuk(sg === 0 || sg === 3 ? p[3] : p[4]) + '! ' + EMIR_TR[sg];
        if (z === 'nehiy') {
            var e = p[3], v = ince(sonUnlu(e));
            return buyuk(e + (sg === 0 || sg === 3 ? (v ? 'me' : 'ma') : (v ? 'meyin' : 'mayın'))) + '! ' + EMIR_TR[sg];
        }
        var k = SINIF[sg];
        return KISI_TR[sg] + ' ' + (z === 'mazi' ? gecmis(p[0], k) : z === 'gelecek' ? gelecek(p[2], k) : simdi(p[1], k));
    }
    function mastar(t) { var e = t.split('|')[3]; return e + (ince(sonUnlu(e)) ? 'mek' : 'mak'); }

    /* ---------------- 5. BİÇİM ---------------------------------------- */
    function bicim(v, z, sg) {
        if (!v) return null;
        if (z === 'mazi') return v.m[sg] || null;
        if (z === 'muzari') return v.u[sg] || null;
        if (z === 'gelecek') return v.u[sg] ? 'سَ' + v.u[sg] : null;
        if (z === 'emir') return (v.e && v.e[sg]) || null;
        if (z === 'nehiy') return (v.n && v.n[sg]) ? 'لا ' + v.n[sg] : null;
        return null;
    }
    function sigaOf(z, sg) { return (z === 'emir' || z === 'nehiy') ? EMIR_SIGA[sg] : sg; }

    /* ---------------- 6. DERSLER -------------------------------------- */
    var SINIFLAR = [5, 6, 7, 8, 9, 10];
    /* 6. ve 7. sınıfın iki kitabı var: tk_ortaokul.js'in o an kurduğu
       derslerin yılı esas alınır (yıl seçimi orada). Bulunamazsa ilk kayıt. */
    function kapsamAnahtar(sinif) {
        var s = String(sinif), adaylar = Object.keys(KAPSAM).filter(function (k) { return k.split('@')[0] === s; });
        if (adaylar.length <= 1) return adaylar[0] || null;
        var o = window.TKOrtaokul, yil = '';
        try {
            var d = (o && o.dersler) ? o.dersler() : [];
            for (var i = 0; i < d.length; i++) if (String(d[i].sinif) === s) { yil = d[i].yil; break; }
        } catch (e) { yil = ''; }
        return (yil && KAPSAM[s + '@' + yil]) ? s + '@' + yil : adaylar[0];
    }
    function bul(id) {
        var m = /^fiil-(\d+)$/.exec(String(id || ''));
        if (!m) return null;
        var sinif = +m[1], a = kapsamAnahtar(sinif);
        if (!a) return null;
        var K = KAPSAM[a], ka = KAPSAM_AD[K.k] || KAPSAM_AD.tekil;
        return {
            id: 'fiil-' + sinif, sinif: sinif, kapsam: K, anahtar: a,
            ad: metin('tk.d_fiil', 'Fiil Çekimi'),
            alt: metin('tk.f_alt', '{n} fiil', { n: K.f.length }) + ' · ' + metin(ka[0], ka[1])
        };
    }
    function dersler() {
        var r = [];
        SINIFLAR.forEach(function (s) { var d = bul('fiil-' + s); if (d) r.push(d); });
        return r;
    }

    /* ---------------- 7. SORU ÜRETİMİ --------------------------------- */
    function zamanAd(z) { return metin(ZAMAN[z][0], ZAMAN[z][1]); }
    /* kapsamdaki bütün (zaman, sîga) çiftleri */
    function ciftler(K) {
        var r = [];
        Object.keys(K.z).forEach(function (z) { K.z[z].forEach(function (sg) { r.push([z, sg]); }); });
        return r;
    }
    /* B türünde zamir şıkları: kapsamdaki kişiler, en az ben/sen/o */
    function zamirHavuzu(K) {
        var h = {};
        ciftler(K).forEach(function (c) { h[sigaOf(c[0], c[1])] = 1; });
        [12, 6, 9, 0, 3].forEach(function (s) { h[s] = 1; });
        return Object.keys(h).map(Number);
    }
    /* aynı zamandaki BÜTÜN bilinen kişilerde f biçimini veren sîgalar (doğru sayılır) */
    function ayniBicim(v, z, f) {
        var r = [], n = (z === 'emir' || z === 'nehiy') ? 6 : 14;
        for (var sg = 0; sg < n; sg++) if (bicim(v, z, sg) === f) r.push(sigaOf(z, sg));
        return r;
    }
    function arapSik(f) { return '<span class="tka-h tkf-ar">' + kacis(f) + '</span>'; }
    function trSik(s) { return '<span class="tkf-tr">' + kacis(s) + '</span>'; }

    /* Çeldirici sırası: A aynı fiil-aynı zaman-başka kişi, B aynı fiil-başka
       zaman, C başka fiil-aynı zaman-aynı kişi, D başka fiil-aynı zaman.
       Hepsi KAPSAM İÇİNDEN (kitapta olmayan biçim şıkta da görünmez). */
    function celdiriciler(K, fk, z, sg, uygun, deger) {
        var v = FIIL[fk], A = [], B = [], C = [], D = [];
        ciftler(K).forEach(function (c) {
            if (c[0] === z && c[1] === sg) return;
            var x = deger(v, c[0], c[1], fk);
            if (x == null) return;
            (c[0] === z ? A : B).push([x, c]);
        });
        K.f.forEach(function (fk2) {
            if (fk2 === fk) return;
            var v2 = FIIL[fk2];
            var x = deger(v2, z, sg, fk2);
            if (x != null) C.push([x, [z, sg], fk2]);
            (K.z[z] || []).forEach(function (sg2) {
                if (sg2 === sg) return;
                var y = deger(v2, z, sg2, fk2);
                if (y != null) D.push([y, [z, sg2], fk2]);
            });
        });
        var secilen = [], gor = {};
        function al(liste, enCok) {
            karistir(liste);
            for (var i = 0; i < liste.length && secilen.length < 3 && enCok > 0; i++) {
                var x = liste[i][0];
                if (gor[x] || !uygun(liste[i])) continue;
                gor[x] = 1; secilen.push(x); enCok--;
            }
        }
        al(A, 2); al(B, 1); al(A, 3); al(B, 3); al(C, 3); al(D, 3);
        return { liste: secilen, gor: gor };
    }

    /* A) zamir → çekim */
    function zamirCekim(K, fk, z, sg) {
        var v = FIIL[fk], f0 = bicim(v, z, sg);
        if (!f0) return null;
        var p = sigaOf(z, sg), zam = ZAMIR[p];
        var c = celdiriciler(K, fk, z, sg, function (o) {
            /* aynı zamirli başka sîga (هُما eril/dişil) da doğru olurdu */
            var p2 = sigaOf(o[1][0], o[1][1]);
            return !(o[2] == null && o[1][0] === z && ZAMIR[p2] === zam);
        }, function (v2, z2, sg2) { var f = bicim(v2, z2, sg2); return (f && f !== f0) ? f : null; });
        if (c.liste.length < 3) return null;
        var cins = (p === 1 || p === 4) ? ' · ' + (p === 1 ? 'erkek' : 'kız') : '';
        return {
            tip: 'alfabe', alt: 'fiil', soruTuru: 'arapca',
            soruHtml: '<span class="tkf-z">' + kacis(zam) + '</span>' +
                      '<span class="tka-anlam">' + kacis(mastar(v.t) + ' · ' + zamanAd(z) + cins) + '</span>',
            ustlik: metin('tk.f_s_cekim', 'Doğru çekim hangisi?'),
            siklar: karistir([{ html: arapSik(f0), dogru: true }].concat(c.liste.map(function (f) { return { html: arapSik(f), dogru: false }; })))
        };
    }

    /* B) çekim → zamir */
    function cekimZamir(K, fk, z, sg) {
        var v = FIIL[fk], f0 = bicim(v, z, sg);
        if (!f0) return null;
        var p = sigaOf(z, sg), dogrular = {}, gor = {};
        /* Biçim başka bir zamanda da aynı yazılıyorsa (V/VI. babda emir اُ ـا
           ile mâzî هُما: تَناوَلا) o zamanın zamiri de çeldirici olmaz. */
        Object.keys(ZAMAN).forEach(function (z2) {
            ayniBicim(v, z2, f0).forEach(function (q) { dogrular[ZAMIR[q]] = 1; });
        });
        gor[ZAMIR[p]] = 1;
        var havuz = karistir(zamirHavuzu(K).filter(function (q) { return !dogrular[ZAMIR[q]]; }));
        /* önce aynı kişi sınıfından (sen/sen, o/o) — ayırt etmek asıl iş */
        havuz.sort(function (a, b) { return (SINIF[b] === SINIF[p]) - (SINIF[a] === SINIF[p]); });
        var sec = [];
        for (var i = 0; i < havuz.length && sec.length < 3; i++) {
            var zq = ZAMIR[havuz[i]];
            if (gor[zq]) continue;
            gor[zq] = 1; sec.push(havuz[i]);
        }
        if (sec.length < 3) return null;
        function sik(q, d) {
            return { html: '<span class="tka-h tkf-ar">' + kacis(ZAMIR[q]) + '</span><span class="tkf-et">' + kacis(ETIKET[q]) + '</span>', dogru: d };
        }
        return {
            tip: 'alfabe', alt: 'fiil', soruTuru: 'arapca',
            soruHtml: '<span class="tkf-f">' + kacis(f0) + '</span>' +
                      '<span class="tka-anlam">' + kacis(mastar(v.t) + ' · ' + zamanAd(z)) + '</span>',
            ustlik: metin('tk.f_s_zamir', 'Hangi zamirle kullanılır?'),
            siklar: karistir([sik(p, true)].concat(sec.map(function (q) { return sik(q, false); })))
        };
    }

    /* C) çekim → Türkçe */
    function cekimTr(K, fk, z, sg) {
        var v = FIIL[fk], f0 = bicim(v, z, sg);
        if (!f0) return null;
        var s0 = cumle(v.t, z, sg), dogru = {};
        /* bu biçimin karşılığı olan bütün cümleler doğru sayılır */
        Object.keys(ZAMAN).forEach(function (z2) {
            var n = (z2 === 'emir' || z2 === 'nehiy') ? 6 : 14;
            for (var q = 0; q < n; q++) if (bicim(v, z2, q) === f0) dogru[cumle(v.t, z2, q)] = 1;
        });
        var c = celdiriciler(K, fk, z, sg, function () { return true; }, function (v2, z2, sg2) {
            var f = bicim(v2, z2, sg2);
            if (!f || f === f0) return null;
            var s = cumle(v2.t, z2, sg2);
            return dogru[s] ? null : s;
        });
        if (c.liste.length < 3) return null;
        return {
            tip: 'alfabe', alt: 'fiil', soruTuru: 'arapca',
            soruHtml: '<span class="tkf-f">' + kacis(f0) + '</span>',
            ustlik: metin('tk.f_s_tr', 'Türkçesi hangisi?'),
            siklar: karistir([{ html: trSik(s0), dogru: true }].concat(c.liste.map(function (s) { return { html: trSik(s), dogru: false }; })))
        };
    }

    /* D) Türkçe → çekim */
    function trCekim(K, fk, z, sg) {
        var v = FIIL[fk], f0 = bicim(v, z, sg);
        if (!f0) return null;
        var s0 = cumle(v.t, z, sg);
        var c = celdiriciler(K, fk, z, sg, function () { return true; }, function (v2, z2, sg2) {
            var f = bicim(v2, z2, sg2);
            return (f && f !== f0) ? f : null;
        });
        if (c.liste.length < 3) return null;
        return {
            tip: 'alfabe', alt: 'fiil', soruTuru: 'cumle',
            soruHtml: '<span class="tkf-cumle">' + kacis(s0) + '</span>',
            ustlik: metin('tk.f_s_ar', 'Arapçası hangisi?'),
            siklar: karistir([{ html: arapSik(f0), dogru: true }].concat(c.liste.map(function (f) { return { html: arapSik(f), dogru: false }; })))
        };
    }

    var TURLER = [zamirCekim, cekimZamir, cekimTr, trCekim];

    /* Boş dizge = soru sağlam (tk_alfabe.js'in denetle()'siyle aynı ölçüt). */
    function denetle(s) {
        if (!s) return 'soru üretilemedi';
        if (!s.siklar || s.siklar.length !== 4) return 'şık sayısı 4 değil';
        var d = 0, gor = {};
        for (var i = 0; i < 4; i++) {
            if (s.siklar[i].dogru) d++;
            if (gor[s.siklar[i].html]) return 'tekrar eden şık';
            gor[s.siklar[i].html] = 1;
        }
        if (d !== 1) return 'doğru şık sayısı ' + d;
        if (!s.soruHtml) return 'soru metni yok';
        return '';
    }

    /* adet kadar soru: bütün (tür, fiil, zaman, kişi) birleşimleri karıştırılır,
       türler sırayla dizilir (bir türün üst üste yığılmaması için); aynı soru
       metni iki kez çıkmaz. 2 kişilik «farklı sorular» için havuz 2×15'i aşar. */
    function uret(dersId, adet) {
        var d = bul(dersId);
        if (!d) return [];
        var K = d.kapsam, gruplar = TURLER.map(function () { return []; });
        K.f.forEach(function (fk) {
            if (!FIIL[fk]) return;
            ciftler(K).forEach(function (c) {
                if (!bicim(FIIL[fk], c[0], c[1])) return;
                TURLER.forEach(function (t, ti) { gruplar[ti].push([fk, c[0], c[1]]); });
            });
        });
        gruplar.forEach(karistir);
        var liste = [], gorulen = {}, no = 95000, ti = Math.floor(Math.random() * TURLER.length), bos = 0;
        while (liste.length < adet && bos < TURLER.length) {
            var g = gruplar[ti % TURLER.length], tur = TURLER[ti % TURLER.length];
            ti++;
            if (!g.length) { bos++; continue; }
            bos = 0;
            var b = g.shift(), s = tur(K, b[0], b[1], b[2]);
            if (denetle(s) !== '') continue;
            var imza = s.soruHtml;
            if (gorulen[imza]) continue;
            gorulen[imza] = 1;
            s.id = no++;
            liste.push(s);
        }
        return liste;
    }

    /* ---------------- 8. GÖRÜNÜM -------------------------------------
       Temel kurallar (.tka-govde, .tka-ustlik, .tka-sik, .tka-h, .tka-etiket,
       .tka-anlam) tk_alfabe.js'ten gelir; burada yalnız fiil sorusunun
       kendi parçaları var. */
    function bicemKur() {
        if (document.getElementById('tkf-stil')) return;
        var st = document.createElement('style');
        st.id = 'tkf-stil';
        st.textContent = [
            '.tkf-z,.tkf-f{display:block;direction:rtl;unicode-bidi:isolate;line-height:1.25;',
            '  font-weight:400;font-synthesis:none;font-synthesis-weight:none;-webkit-text-stroke:0}',
            '.tkf-ar{font-weight:400;font-synthesis:none;font-synthesis-weight:none}',
            '.quiz-options.tka .tkf-ar{font-size:1.45em;line-height:1.3}',
            '.tkf-tr{display:block;direction:ltr;unicode-bidi:isolate;font-family:"Rubik",sans-serif;',
            '  font-size:.82em;line-height:1.2;white-space:normal}',
            '.tkf-et{display:block;width:100%;text-align:center;direction:ltr;unicode-bidi:isolate;',
            '  font-family:"Rubik",sans-serif;font-size:.52em;line-height:1.2;color:#64748b;margin-top:2px}',
            /* Türkçe soru cümlesi: kutunun yazı tipi Arakom (!important) — Latin harfleri
               orada tırnak/ünlem başka yazı tipinden geliyordu; cümle kendi yazı tipini taşır. */
            '.quiz-question.tka-cumle .tkf-cumle{display:block;font-family:"Rubik",sans-serif;font-size:1.35em;line-height:1.25}'
        ].join('\n');
        document.head.appendChild(st);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bicemKur);
    else bicemKur();

    window.TKFiil = {
        dersler: dersler,
        bul: bul,
        mi: function (id) { return /^fiil-\d+$/.test(String(id || '')); },
        uret: uret,
        denetle: denetle,
        /* ölçüm için (deneme betikleri) */
        _veri: { FIIL: FIIL, KAPSAM: KAPSAM, ZAMIR: ZAMIR }, _cumle: cumle, _bicim: bicim
    };
})();
