function speakCurrentSentence() {
    // Mevcut konuşmayı iptal et
    window.speechSynthesis.cancel();

    let wordsData = [];
    let langCode = "";

    if (mode === 'sentence') {
        wordsData = data.sentence[currentIdx].words;
        langCode = (currentDirection === 'tr-to-ar') ? 'tr-TR' : 'ar-SA';
    } else {
        wordsData = pTurn === 1 ? data.dialog[currentIdx].p1 : data.dialog[currentIdx].p2;
        langCode = (currentDirection === 'tr-to-ar') ? 'tr-TR' : 'ar-SA';
    }

    let fullText = "";
    if (currentDirection === 'ar-to-tr') {
        // KRİTER: Arapça seslendirmede numaralandırmayı (order) esas al
        fullText = [...wordsData]
            .sort((a, b) => a.order - b.order)
            .map(w => w.ar)
            .join(" ");
    } else {
        fullText = wordsData.map(w => w.tr).join(" ");
    }

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

// Seslendirme fonksiyonu
function speakText(text, lang) {
    // Eğer tarayıcıda devam eden bir konuşma varsa durdur
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // lang: 'ar-SA' (Arapça) veya 'tr-TR' (Türkçe)
    utterance.lang = lang;
    utterance.rate = 0.9; // Okuma hızı (opsiyonel)
    
    window.speechSynthesis.speak(utterance);
}

  // Her cümlenin tamamlanma durumunu tutar
  var completionStatus = { sentence: {}, dialog: {} };
  var progressMemory = { sentence: {}, dialog: {} };  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-FV9JD15KLW');

/* ================================ */

// POPUP İÇERİKLERİ
    const popupData = {
words: `
    <div class="words-container" style="display: flex; flex-direction: row-reverse; gap: 20px; width: 100%; padding: 15px; overflow-y: auto; max-height: 80vh; -webkit-overflow-scrolling: touch; align-items: flex-start;">
        
        <div class="nouns-col" style="min-width: 280px; flex: 1; border-left: 2px solid #eee; padding-left: 15px; display: flex; flex-direction: column; flex-shrink: 0;">
            <h3 style="color:var(--pdf-red); margin-bottom: 15px; text-align: center; position: sticky; top: 0; background: white; z-index: 10; padding: 5px 0;">İsimler & Meslekler</h3>
            <div style="width: 100%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Çoğul (ج)</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Tekil</th>
                        </tr>
                    </thead>
                    <tbody>


<tr>
    <td class="ar-txt">أَيَّام<br><small style="font-size:11px; color:#666;">Günler</small></td>
    <td class="ar-txt">يَوْم<br><small style="font-size:11px; color:#666;">Gün</small></td>
</tr>
<tr>
    <td class="ar-txt">سَاعَات<br><small style="font-size:11px; color:#666;">Saatler</small></td>
    <td class="ar-txt">سَاعَة<br><small style="font-size:11px; color:#666;">Saat / Vakit</small></td>
</tr>
<tr>
    <td class="ar-txt">أَوْقَات الصَّبَاح<br><small style="font-size:11px; color:#666;">Sabahlar</small></td>
    <td class="ar-txt">صَبَاح<br><small style="font-size:11px; color:#666;">Sabah</small></td>
</tr>
<tr>
    <td class="ar-txt">أَوْقَات الظُّهْر<br><small style="font-size:11px; color:#666;">Öğle vakitleri</small></td>
    <td class="ar-txt">ظُهْر<br><small style="font-size:11px; color:#666;">Öğle</small></td>
</tr>
<tr>
    <td class="ar-txt">أَمْسِيَة<br><small style="font-size:11px; color:#666;">Akşamlar</small></td>
    <td class="ar-txt">مَسَاء<br><small style="font-size:11px; color:#666;">Akşam</small></td>
</tr>
<tr>
    <td class="ar-txt">لَيَالِي<br><small style="font-size:11px; color:#666;">Geceler</small></td>
    <td class="ar-txt">لَيْل<br><small style="font-size:11px; color:#666;">Gece</small></td>
</tr>

<tr>
    <td class="ar-txt">مَأْكُولَات<br><small style="font-size:11px; color:#666;">Yiyecekler</small></td>
    <td class="ar-txt">طَعَام<br><small style="font-size:11px; color:#666;">Yemek</small></td>
</tr>
<tr>
    <td class="ar-txt">مَشْرُوبَات<br><small style="font-size:11px; color:#666;">İçecekler</small></td>
    <td class="ar-txt">شَرَاب<br><small style="font-size:11px; color:#666;">İçecek</small></td>
</tr>
<tr>
    <td class="ar-txt">أَجْبَان<br><small style="font-size:11px; color:#666;">Peynirler</small></td>
    <td class="ar-txt">جُبْن<br><small style="font-size:11px; color:#666;">Peynir</small></td>
</tr>
<tr>
    <td class="ar-txt">زَيْتُون<br><small style="font-size:11px; color:#666;">Zeytinler (Cins isim)</small></td>
    <td class="ar-txt">زَيْتُونَة<br><small style="font-size:11px; color:#666;">Zeytin (Tane)</small></td>
</tr>
<tr>
    <td class="ar-txt">لُحُوم<br><small style="font-size:11px; color:#666;">Etler</small></td>
    <td class="ar-txt">لَحْم<br><small style="font-size:11px; color:#666;">Et</small></td>
</tr>
<tr>
    <td class="ar-txt">أَسْمَاك<br><small style="font-size:11px; color:#666;">Balıklar</small></td>
    <td class="ar-txt">سَمَك<br><small style="font-size:11px; color:#666;">Balık</small></td>
</tr>
<tr>
    <td class="ar-txt">سَلَطَات<br><small style="font-size:11px; color:#666;">Salatalar</small></td>
    <td class="ar-txt">سَلَطَة<br><small style="font-size:11px; color:#666;">Salata</small></td>
</tr>
<tr>
    <td class="ar-txt">عَصَائِر<br><small style="font-size:11px; color:#666;">Meyve suları</small></td>
    <td class="ar-txt">عَصِير<br><small style="font-size:11px; color:#666;">Meyve suyu</small></td>
</tr>
<tr>
    <td class="ar-txt">أَلْبَان / حَلِيب<br><small style="font-size:11px; color:#666;">Sütler</small></td>
    <td class="ar-txt">حَلِيب<br><small style="font-size:11px; color:#666;">Süt</small></td>
</tr>

<tr>
    <td class="ar-txt">بُيُوت<br><small style="font-size:11px; color:#666;">Evler</small></td>
    <td class="ar-txt">بَيْت<br><small style="font-size:11px; color:#666;">Ev</small></td>
</tr>
<tr>
    <td class="ar-txt">مَدَارِس<br><small style="font-size:11px; color:#666;">Okullar</small></td>
    <td class="ar-txt">مَدْرَسَة<br><small style="font-size:11px; color:#666;">Okul</small></td>
</tr>
<tr>
    <td class="ar-txt">مَسَاجِد<br><small style="font-size:11px; color:#666;">Mescidler</small></td>
    <td class="ar-txt">مَسْجِد<br><small style="font-size:11px; color:#666;">Mescid</small></td>
</tr>
<tr>
    <td class="ar-txt">غُرَف<br><small style="font-size:11px; color:#666;">Odalar</small></td>
    <td class="ar-txt">غُرْفَة<br><small style="font-size:11px; color:#666;">Oda</small></td>
</tr>
<tr>
    <td class="ar-txt">مَلَابِس<br><small style="font-size:11px; color:#666;">Elbiseler</small></td>
    <td class="ar-txt">لِبَاس / ثَوْب<br><small style="font-size:11px; color:#666;">Elbise</small></td>
</tr>
<tr>
    <td class="ar-txt">أَسْنَان<br><small style="font-size:11px; color:#666;">Dişler</small></td>
    <td class="ar-txt">سِنّ<br><small style="font-size:11px; color:#666;">Diş</small></td>
</tr>
<tr>
    <td class="ar-txt">صُوَر<br><small style="font-size:11px; color:#666;">Resimler</small></td>
    <td class="ar-txt">صُورَة<br><small style="font-size:11px; color:#666;">Resim</small></td>
</tr>

<tr>
    <td class="ar-txt">عَائِلَات<br><small style="font-size:11px; color:#666;">Aileler</small></td>
    <td class="ar-txt">عَائِلَة / أُسْرَة<br><small style="font-size:11px; color:#666;">Aile</small></td>
</tr>
<tr>
    <td class="ar-txt">أُمَّهَات<br><small style="font-size:11px; color:#666;">Anneler</small></td>
    <td class="ar-txt">أُمّ<br><small style="font-size:11px; color:#666;">Anne</small></td>
</tr>
<tr>
    <td class="ar-txt">أَصْدِقَاء<br><small style="font-size:11px; color:#666;">Arkadaşlar</small></td>
    <td class="ar-txt">صَدِيق<br><small style="font-size:11px; color:#666;">Arkadaş</small></td>
</tr>
<tr>
    <td class="ar-txt">أَقَارِب<br><small style="font-size:11px; color:#666;">Akrabalar</small></td>
    <td class="ar-txt">قَرِيب<br><small style="font-size:11px; color:#666;">Akraba</small></td>
</tr>

                    </tbody>
                </table>
            </div>
        </div>

        <div class="verbs-col" style="min-width: 400px; flex: 2; display: flex; flex-direction: column; flex-shrink: 0;">
            <h3 style="color:var(--pdf-red); margin-bottom: 15px; text-align: center; position: sticky; top: 0; background: white; z-index: 10; padding: 5px 0;">Fiiller</h3>
            <div style="width: 100%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Mastar</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Emir</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Muzari</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Mazi</th>
                        </tr>
                    </thead>
                    <tbody>



<tr>
    <td class="ar-txt">اِسْتِيقَاظ<br><small style="font-size:11px; color:#666;">Uyanmak</small></td>
    <td class="ar-txt">اِسْتَيْقِظْ<br><small style="font-size:11px; color:#666;">Uyan</small></td>
    <td class="ar-txt">يَسْتَيْقِظُ<br><small style="font-size:11px; color:#666;">Uyanıyor</small></td>
    <td class="ar-txt">اِسْتَيْقَظَ<br><small style="font-size:11px; color:#666;">Uyandı</small></td>
</tr>

<tr>
    <td class="ar-txt">وُضُوء<br><small style="font-size:11px; color:#666;">Abdest Almak</small></td>
    <td class="ar-txt">تَوَضَّأْ<br><small style="font-size:11px; color:#666;">Abdest Al</small></td>
    <td class="ar-txt">يَتَوَضَّأُ<br><small style="font-size:11px; color:#666;">Abdest Alıyor</small></td>
    <td class="ar-txt">تَوَضَّأَ<br><small style="font-size:11px; color:#666;">Abdest Aldı</small></td>
</tr>

<tr>
    <td class="ar-txt">صَلَاة<br><small style="font-size:11px; color:#666;">Namaz Kılmak</small></td>
    <td class="ar-txt">صَلِّ<br><small style="font-size:11px; color:#666;">Namaz Kıl</small></td>
    <td class="ar-txt">يُصَلِّي<br><small style="font-size:11px; color:#666;">Namaz Kılıyor</small></td>
    <td class="ar-txt">صَلَّى<br><small style="font-size:11px; color:#666;">Namaz Kıldı</small></td>
</tr>

<tr>
    <td class="ar-txt">تَنَاوُل<br><small style="font-size:11px; color:#666;">Yemek/Almak</small></td>
    <td class="ar-txt">تَنَاوَلْ<br><small style="font-size:11px; color:#666;">Ye/Al</small></td>
    <td class="ar-txt">يَتَنَاوَلُ<br><small style="font-size:11px; color:#666;">Yiyor/Alıyor</small></td>
    <td class="ar-txt">تَنَاوَلَ<br><small style="font-size:11px; color:#666;">Yedi/Aldı</small></td>
</tr>

<tr>
    <td class="ar-txt">لُبْس<br><small style="font-size:11px; color:#666;">Giymek</small></td>
    <td class="ar-txt">اِلْبَسْ<br><small style="font-size:11px; color:#666;">Giy</small></td>
    <td class="ar-txt">يَلْبَسُ<br><small style="font-size:11px; color:#666;">Giyiyor</small></td>
    <td class="ar-txt">لَبِسَ<br><small style="font-size:11px; color:#666;">Giydi</small></td>
</tr>

<tr>
    <td class="ar-txt">ذَهَاب<br><small style="font-size:11px; color:#666;">Gitmek</small></td>
    <td class="ar-txt">اِذْهَبْ<br><small style="font-size:11px; color:#666;">Git</small></td>
    <td class="ar-txt">يَذْهَبُ<br><small style="font-size:11px; color:#666;">Gidiyor</small></td>
    <td class="ar-txt">ذَهَبَ<br><small style="font-size:11px; color:#666;">Gitti</small></td>
</tr>

<tr>
    <td class="ar-txt">رُجُوع<br><small style="font-size:11px; color:#666;">Dönmek</small></td>
    <td class="ar-txt">اِرْجِعْ<br><small style="font-size:11px; color:#666;">Dön</small></td>
    <td class="ar-txt">يَرْجِعُ<br><small style="font-size:11px; color:#666;">Dönüyor</small></td>
    <td class="ar-txt">رَجَعَ<br><small style="font-size:11px; color:#666;">Döndü</small></td>
</tr>

<tr>
    <td class="ar-txt">مُسَاعَدَة<br><small style="font-size:11px; color:#666;">Yardım Etmek</small></td>
    <td class="ar-txt">سَاعِدْ<br><small style="font-size:11px; color:#666;">Yardım Et</small></td>
    <td class="ar-txt">يُسَاعِدُ<br><small style="font-size:11px; color:#666;">Yardım Ediyor</small></td>
    <td class="ar-txt">سَاعَدَ<br><small style="font-size:11px; color:#666;">Yardım Etti</small></td>
</tr>

<tr>
    <td class="ar-txt">دِرَاسَة<br><small style="font-size:11px; color:#666;">Ders Çalışmak</small></td>
    <td class="ar-txt">اُدْرُسْ<br><small style="font-size:11px; color:#666;">Çalış</small></td>
    <td class="ar-txt">يَدْرُسُ<br><small style="font-size:11px; color:#666;">Çalışıyor</small></td>
    <td class="ar-txt">دَرَسَ<br><small style="font-size:11px; color:#666;">Çalıştı</small></td>
</tr>

<tr>
    <td class="ar-txt">نَوْم<br><small style="font-size:11px; color:#666;">Uyumak</small></td>
    <td class="ar-txt">نَمْ<br><small style="font-size:11px; color:#666;">Uyu</small></td>
    <td class="ar-txt">يَنَامُ<br><small style="font-size:11px; color:#666;">Uyuyor</small></td>
    <td class="ar-txt">نَامَ<br><small style="font-size:11px; color:#666;">Uyudu</small></td>
</tr>

<tr>
    <td class="ar-txt">تَنْظِيف<br><small style="font-size:11px; color:#666;">Temizlemek</small></td>
    <td class="ar-txt">نَظِّفْ<br><small style="font-size:11px; color:#666;">Temizle</small></td>
    <td class="ar-txt">يُنَظِّفُ<br><small style="font-size:11px; color:#666;">Temizliyor</small></td>
    <td class="ar-txt">نَظَّفَ<br><small style="font-size:11px; color:#666;">Temizledi</small></td>
</tr>

<tr>
    <td class="ar-txt">شُرْب<br><small style="font-size:11px; color:#666;">İçmek</small></td>
    <td class="ar-txt">اِشْرَبْ<br><small style="font-size:11px; color:#666;">İç</small></td>
    <td class="ar-txt">يَشْرَبُ<br><small style="font-size:11px; color:#666;">İçiyor</small></td>
    <td class="ar-txt">شَرِبَ<br><small style="font-size:11px; color:#666;">İçti</small></td>
</tr>

<tr>
    <td class="ar-txt">أَكْل<br><small style="font-size:11px; color:#666;">Yemek</small></td>
    <td class="ar-txt">كُلْ<br><small style="font-size:11px; color:#666;">Ye</small></td>
    <td class="ar-txt">يَأْكُلُ<br><small style="font-size:11px; color:#666;">Yiyor</small></td>
    <td class="ar-txt">أَكَلَ<br><small style="font-size:11px; color:#666;">Yedi</small></td>
</tr>

<tr>
    <td class="ar-txt">غَسْل<br><small style="font-size:11px; color:#666;">Yıkamak</small></td>
    <td class="ar-txt">اِغْسِلْ<br><small style="font-size:11px; color:#666;">Yıka</small></td>
    <td class="ar-txt">يَغْسِلُ<br><small style="font-size:11px; color:#666;">Yıkıyor</small></td>
    <td class="ar-txt">غَسَلَ<br><small style="font-size:11px; color:#666;">Yıkadı</small></td>
</tr>

<tr>
    <td class="ar-txt">إِرَادَة<br><small style="font-size:11px; color:#666;">İstemek</small></td>
    <td class="ar-txt">أَرِدْ<br><small style="font-size:11px; color:#666;">İste</small></td>
    <td class="ar-txt">يُرِيدُ<br><small style="font-size:11px; color:#666;">İstiyor</small></td>
    <td class="ar-txt">أَرَادَ<br><small style="font-size:11px; color:#666;">İstedi</small></td>
</tr>

<tr>
    <td class="ar-txt">حُبّ<br><small style="font-size:11px; color:#666;">Sevmek</small></td>
    <td class="ar-txt">أَحِبَّ<br><small style="font-size:11px; color:#666;">Sev</small></td>
    <td class="ar-txt">يُحِبُّ<br><small style="font-size:11px; color:#666;">Seviyor</small></td>
    <td class="ar-txt">أَحَبَّ<br><small style="font-size:11px; color:#666;">Sevdi</small></td>
</tr>

<tr>
    <td class="ar-txt">مَجِيء<br><small style="font-size:11px; color:#666;">Gelmek</small></td>
    <td class="ar-txt">تَعَالَ<br><small style="font-size:11px; color:#666;">Gel</small></td>
    <td class="ar-txt">يَأْتِي<br><small style="font-size:11px; color:#666;">Geliyor</small></td>
    <td class="ar-txt">أَتَى<br><small style="font-size:11px; color:#666;">Geldi</small></td>
</tr>



                    </tbody>
                </table>
            </div>
        </div>
    </div>`,
       
            prepositions: `
<div style="width:100%; max-height: 75vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
    <h2 style="color:var(--pdf-red); margin-bottom:20px; text-align:center; font-size: 2.5rem; border-bottom: 3px solid var(--pdf-red); padding-bottom: 10px;">HARFLER VE EKLER</h2>
    
    <div style="display: flex; gap: 30px; align-items: flex-start; flex-direction: row-reverse; margin-bottom: 30px;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">1. Harf-i Cerler</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Harf</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">...de / içinde</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">فِي</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">üzerinde</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">عَلَى</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">...e / ...a</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">إِلَى</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">...den / ...dan</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">مِنْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">ile / ...e</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">بِـ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">için</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">لِـ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">hakkında</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">عَنْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">gibi</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">كَـ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">...e kadar</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">حَتَّى</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">2. Diğer Harfler</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Harf</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Ve (Bağlaç)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">وَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Hemen sonra</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">فَـ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Ecek / Acak</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">سَـ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">...mı? / ...mi?</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">أَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Değil (Mazi)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">مَا</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Değil (Muzari)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">لَا</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Kesinlikle</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">قَدْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Elbette</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">لَـ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">İle / Beraber</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">مَعَ</td></tr>
            </table>
        </div>
    </div>

    <div style="display: flex; gap: 30px; align-items: flex-start; flex-direction: row-reverse;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">3. Çoğul (Cemi)</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Durum</th>
                    <th style="padding: 10px; text-align: center;">Ek</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Erkek (Özne)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">ـُونَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Erkek (Nesne)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">ـِينَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Kadın</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">ـَات</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">4. İkil (Tesniye)</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Durum</th>
                    <th style="padding: 10px; text-align: center;">Ek</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Özne Hali</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">ـَانِ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Nesne Hali</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #333;">ـَيْنِ</td></tr>
                <tr style="border-bottom: 1px solid transparent;"><td style="padding: 8px; color:transparent;">.</td><td class="ar-txt" style="font-size: 2.2rem; text-align: center; color: transparent;">.</td></tr>
            </table>
        </div>
    </div>
    
    <div style="height: 40px;"></div>
</div>`,
          soruedatlari: `
<div style="width:100%; max-height: 75vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
    <h2 style="color:var(--pdf-red); margin-bottom:20px; text-align:center; font-size: 2.5rem; border-bottom: 3px solid var(--pdf-red); padding-bottom: 10px;">EDATLAR VE ZARFLAR</h2>
    
    <div style="display: flex; gap: 30px; align-items: flex-start; flex-direction: row-reverse; margin-bottom: 40px;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">1. Soru Edatları</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Ne?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَا / مَاذَا</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Kim?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَنْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Nerede?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَيْنَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Nasıl?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">كَيْفَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Ne zaman?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَتَى</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Niçin?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">لِمَاذَا</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Hangi / Kaç?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَيّ / كَمْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Nereden?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مِنْ أَيْنَ</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">2. Yer Zarfları</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Önünde</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَمَامَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Arkasında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">خَلْفَ / وَرَاءَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Üstünde</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">فَوْقَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Altında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">تَحْتَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Yanında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">عِنْدَ / جَانِبَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Arasında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">بَيْنَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Etrafında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">حَوْلَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Sağında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">يَمِينَ</td></tr>
            </table>
        </div>
    </div>

    <div style="display: flex; gap: 30px; align-items: flex-start; flex-direction: row-reverse;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">3. Zaman Zarfları</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Önce / Sonra</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">قَبْلَ / بَعْدَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Bugün / Yarın</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">اَلْيَوْمَ / غَدًا</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Dün</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَمْسِ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Sabah / Akşam</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">صَبَاحًا / مَسَاءً</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">...dığı zaman</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">حِينَ / أَثْنَاءَ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Asla / Ebeden</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَبَداً</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Hâlâ / Henüz</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">لَمَّا</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #eee;">4. Bağlaçlar / Diğerleri</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Veya / Yoksa</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَوْ / أَمْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Çünkü</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">لِأَنَّ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">O zaman</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">إِذَنْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Şayet / Eğer</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">إِذَا / لَوْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Sadece</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">فَقَطْ</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Birlikte</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَعاً</td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px;">Ayrıca</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَيْضاً</td></tr>
            </table>
        </div>
    </div>
</div>
</div>`,
         pronouns: `
<div style="width:100%; max-height: 75vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
    <h2 style="color:var(--pdf-red); margin-bottom:20px; text-align:center; font-size: 2.2rem; border-bottom: 3px solid var(--pdf-red); padding-bottom: 10px;">ZAMİRLER VE EDATLAR</h2>
    
    <div style="display: flex; gap: 20px; align-items: flex-start; flex-direction: row-reverse;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #eee;">1. Munfasıl (Ayrı)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">هُمْ</span><br><small>(Onlar)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">هُمَا</span><br><small>(O ikisi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">هُوَ</span><br><small>(O)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">هُنَّ</span><br><small>(Onlar)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">هُمَا</span><br><small>(O ikisi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">هِيَ</span><br><small>(O)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتُمْ</span><br><small>(Siz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">أَنْتُمَا</span><br><small>(Siz ikiniz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتَ</span><br><small>(Sen)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتُنَّ</span><br><small>(Siz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">أَنْتُمَا</span><br><small>(Siz ikiniz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتِ</span><br><small>(Sen)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">نَحْنُ</span><br><small>(Biz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">نَحْنُ</span><br><small>(Biz ikimiz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنَا</span><br><small>(Ben)</small></td></tr>
                
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #eee;">2. Muttasıl (Bitişik)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #f8fafc; border-bottom: 3px solid #ddd;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـهُمْ</span><br><small>(Onları)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـهُمَا</span><br><small>(O ikisini)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـهُ</span><br><small>(Onu)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـهُنَّ</span><br><small>(Onları)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـهُمَا</span><br><small>(O ikisini)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـهَا</span><br><small>(Onu)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـكُمْ</span><br><small>(Sizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـكُمَا</span><br><small>(Siz ikinizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـكَ</span><br><small>(Seni)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـكُنَّ</span><br><small>(Sizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـكُمَا</span><br><small>(Siz ikinizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـكِ</span><br><small>(Seni)</small></td></tr>
                <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـنَا</span><br><small>(Bizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـنَا</span><br><small>(Bizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـي / نِي</span><br><small>(Beni)</small></td></tr>
                
            </table>
        </div>
    </div>

    <h3 style="color:var(--pdf-red); font-size: 1.6rem; margin: 30px 0 10px 0; border-left: 5px solid var(--pdf-red); padding-left: 10px;">İşaret Zamirleri (Bu / Şu-O)</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr style="background: #f8fafc; border-bottom: 3px solid #ddd;">
            <th style="padding: 10px;">Çoğul</th>
            <th style="padding: 10px;">İkil</th>
            <th style="padding: 10px;">Tekil</th>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰؤُلَاءِ / أُولٰئِكَ</span><br><small>(Bunlar/Şunlar)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰذَانِ / ذَانِكَ</span><br><small>(Bu/O ikisi)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰذَا / ذٰلِكَ</span><br><small>(Bu/O)</small></td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰؤُلَاءِ / أُولٰئِكَ</span><br><small>(Bunlar/Şunlar)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰتَانِ / تَانكَ</span><br><small>(Bu/O ikisi)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰذِهِ / تِلْكَ</span><br><small>(Bu/O)</small></td>
        </tr>
    </table>

    <h3 style="color:var(--pdf-red); font-size: 1.6rem; margin: 30px 0 10px 0; border-left: 5px solid var(--pdf-red); padding-left: 10px;">İsm-i Mevsuller (Ki O)</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr style="background: #f8fafc; border-bottom: 3px solid #ddd;">
            <th style="padding: 10px;">Çoğul</th>
            <th style="padding: 10px;">İkil</th>
            <th style="padding: 10px;">Tekil</th>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّذِينَ</span><br><small>(Onlar ki)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّذَانِ</span><br><small>(O ikisi ki)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّذِي</span><br><small>(O ki)</small></td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td><span class="ar-txt" style="font-size:2.2rem;">اللَّاتِي</span><br><small>(Onlar ki)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">اللَّتَانِ</span><br><small>(O ikisi ki)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّتِي</span><br><small>(O ki)</small></td>
        </tr>
    </table>
    <div style="height: 60px;"></div>
</div>`,
        suffix: `
<div style="width:100%; max-height: 75vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
    <h2 style="color:var(--pdf-red); margin-bottom:20px; text-align:center; font-size: 2.2rem; border-bottom: 3px solid var(--pdf-red); padding-bottom: 10px;">FİİL ÇEKİM EKLERİ</h2>
    
    <div style="display: flex; gap: 20px; align-items: flex-start; flex-direction: row-reverse;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #eee;">1. Mazi Fiil (-dı)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #f8fafc; border-bottom: 3px solid #ddd; height: 50px;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـُوا</span><br><small>(-dılar)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـَا</span><br><small>(-dılar/2)</small></td>
                    <td><span class="ar-txt" style="font-size:1.5rem;">----</span><br><small>(-dı)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَ</span><br><small>(-dılar K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـَتَا</span><br><small>(-dılar/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـَتْ</span><br><small>(-dı K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمْ</span><br><small>(-dınız)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمَا</span><br><small>(-dınız/2)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتَ</span><br><small>(-dın)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُنَّ</span><br><small>(-dınız K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمَا</span><br><small>(-dınız/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتِ</span><br><small>(-dın K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَا</span><br><small>(-dık)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَا</span><br><small>(-dık)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُ</span><br><small>(-dım)</small></td>
                </tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #eee;">2. Muzari Fiil (-yor)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #f8fafc; border-bottom: 3px solid #ddd; height: 50px;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـُونَ</span><br><small>(-yorlar)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـَانِ</span><br><small>(-yorlar/2)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ‫ ـ ـ ‬</span><br><small>(-yor)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـْنَ</span><br><small>(-yorlar K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorlar/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ‫ ـ ـ ‬</span><br><small>(-yor K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـُونَ</span><br><small>(-yorsunuz)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorsunuz/2)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ‫ ـ ـ ‬</span><br><small>(-yorsun)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـْنَ</span><br><small>(-yorsunuz K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorsunuz/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـــِــينَ</span><br><small>(-yorsun K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">نَـ‫ ـ ـ ‬</span><br><small>(-yoruz)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">نَـ‫ ـ ـ ‬</span><br><small>(-yoruz)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">أَ‫ ـ ـ ‬</span><br><small>(-yorum)</small></td>
                </tr>
            </table>
        </div>
    </div>

    <h3 style="color:var(--pdf-red); font-size: 1.6rem; margin: 30px 0 10px 0; border-left: 5px solid var(--pdf-red); padding-left: 10px;">3. Emir Ekleri (! / -sın)</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr style="background: #f8fafc; border-bottom: 2px solid #ddd;">
            <th style="padding: 10px;">Çoğul</th>
            <th style="padding: 10px;">İkil</th>
            <th style="padding: 10px;">Tekil</th>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td><span class="ar-txt" style="font-size:2.2rem;">ـُوا</span><br><small>(Yapın!)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">ـَا</span><br><small>(İkiniz yapın!)</small></td>
            <td><span class="ar-txt" style="font-size:1.5rem;">(Sükun)</span><br><small>(Yap!)</small></td>
        </tr>
        <tr style="border-bottom: 1px solid #eee;">
            <td><span class="ar-txt" style="font-size:2.2rem;">ـْنَ</span><br><small>(Yapın! K)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">ـَا</span><br><small>(İkiniz yapın! K)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">ـــِي</span><br><small>(Yap! K)</small></td>
        </tr>
    </table>
    
    <div style="height: 60px;"></div>
</div>`,

             // Eski halini bununla değiştirin:
tamlamalar: `<iframe src="tamlamalar.pdf#view=Fit&toolbar=1" style="width:100%; height:100%; border:none; display:block;"></iframe>`,
sulasi: `<iframe src="sulasi.pdf#view=Fit&toolbar=1" style="width:100%; height:100%; border:none; display:block;"></iframe>`,
mezid: `<iframe src="mezid.pdf#view=Fit&toolbar=1" style="width:100%; height:100%; border:none; display:block;"></iframe>`
    };


   
// 2. SEÇİLİ BUTONU VURGULAMA FONKSİYONU
    function setActiveButton(type) {
        // Tüm nav-trigger butonlarından beyaz kenarlığı kaldır
        const buttons = document.querySelectorAll('.nav-trigger');
        buttons.forEach(btn => {
            btn.style.border = "none";
            btn.style.boxShadow = "none";
        });

        // Tıklanan butona beyaz kenarlık ve parlama ekle
        const activeBtn = event.currentTarget;
        activeBtn.style.border = "2px solid white";
        activeBtn.style.boxShadow = "0 0 10px rgba(255,255,255,0.5)";
    }

// --- BİRLEŞTİRİLMİŞ POPUP YÖNETİMİ ---

function showPopup(type) {
    const titles = { 
        words: 'Kelime Listesi', 
        prepositions: 'Harf-i Cerler', 
        soruedatlari: 'Soru Edatları', 
        pronouns: 'Zamir Tablosu', 
        suffix: 'Fiil Kipleri', 
        tamlamalar: 'Tamlamalar', 
        sulasi: 'Sülasi', 
        mezid: 'Mezid' 
    };

    const content = popupData[type];
    if (content) {
        const popupBody = document.getElementById('popup-content');
        
        // İçeriği yerleştiriyoruz
        popupBody.innerHTML = content;
        document.getElementById('popup-title').innerText = titles[type] || 'Bilgi Paneli';
        
        // --- KAYDIRMA SIFIRLAMA (EKLEME) ---
        // Popup ana gövdesini en yukarı çek
        popupBody.scrollTop = 0; 
        
        // Eğer "Kelime Listesi" açıldıysa, içindeki özel kapsayıcıyı da en yukarı çek
        const wordsContainer = popupBody.querySelector('.words-container');
        if (wordsContainer) {
            wordsContainer.scrollTop = 0;
        }
        // ----------------------------------

        // Paneli aç ve butonları gizle
        togglePopup(true);
        
        // Navigasyon butonunu vurgula
        setActiveButton(type);
    }
}

function togglePopup(show) {
    const overlay = document.getElementById('popup-overlay');
    const controls = document.querySelector('.controls');
    
    // Popup'ı göster/gizle
    overlay.style.display = show ? 'flex' : 'none';
    
    if (controls) {
        if (show) {
            // Popup açıldığında ileri/geri panelini tamamen yok et
            controls.classList.add('controls-hidden');
            controls.style.display = 'none'; 
        } else {
            // Popup kapandığında ileri/geri panelini tekrar göster
            controls.classList.remove('controls-hidden');
            controls.style.display = 'flex'; 
        }
    }
    
    // Kapatma anında üst menüdeki buton vurgularını temizle
    if (!show) {
        document.querySelectorAll('.nav-trigger').forEach(btn => {
            btn.style.border = "none";
            btn.style.boxShadow = "none";
        });
    }
}

function closePopup(e) { 
    // Dış siyah alana (overlay) tıklandığında kapatma işlemini tetikle
    if (e.target.id === 'popup-overlay') {
        togglePopup(false); 
    }
}

function setActiveButton(type) {
    // Tüm butonların stilini sıfırla
    document.querySelectorAll('.nav-trigger').forEach(btn => {
        btn.style.border = "none";
        btn.style.boxShadow = "none";
    });
    
    // Eğer tetikleyici bir event varsa ilgili butonu vurgula
    if (event && event.currentTarget && event.currentTarget.classList.contains('nav-trigger')) {
        event.currentTarget.style.border = "2px solid white";
        event.currentTarget.style.boxShadow = "0 0 10px rgba(255,255,255,0.5)";
    }
}
const data = {
sentence: [
    // --- BÖLÜM 1: TANIŞMA VE KİMLİK ---

    // 1. Senin uyruğun nedir?
    {
        words: [
            { tr: "Senin uyruğun", order: 2, ar: "جِنْسِيَّتُكَ؟" },
            { tr: "nedir?", order: 1, ar: "مَا" }
        ]
    },
    // 2. Ben Türküm.
    {
        words: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Türküm.", order: 2, ar: "تُرْكِيٌّ." }
        ]
    },
    // 3. Sen nerelisin? (Kadın)
    // Mantık: Sen (Anti) - Nere (Eyne) -den (Min)
    {
        words: [
            { tr: "Sen", order: 2, ar: "أَنْتِ؟" },
            { tr: "neredensin?", order: 1, ar: "مِنْ أَيْنَ" }
        ]
    },
    // 4. Ben Mısırlıyım.
    // Mantık: Ben (Ena) - Mısır (Misr) -'danım (Min)
    {
        words: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Mısır'danım.", order: 2, ar: "مِنْ مِصْر." }
        ]
    },
    // 5. Nerede yaşıyorsun?
    {
        words: [
            { tr: "Nerede", order: 1, ar: "أَيْنَ" },
            { tr: "yaşıyorsun?", order: 2, ar: "تَعِيشُ؟" }
        ]
    },
    // 6. Konya şehrinde yaşıyorum.
    // Mantık: Konya (Konya) - şehrin (Medineti) -de (Fi) - yaşıyorum (Eişu)
    {
        words: [
            { tr: "Konya", order: 3, ar: "قُونْيَا." },
            { tr: "şehrinde", order: 2, ar: "فِي مَدِينَة" },
            { tr: "yaşıyorum.", order: 1, ar: "أَعِيشُ" }
        ]
    },

    // --- BÖLÜM 2: ŞEHİRLER VE ÖZELLİKLERİ ---

    // 7. Konya şehri ne ile meşhurdur?
    {
        words: [
            { tr: "Konya", order: 4, ar: "قُونْيَا." },
            { tr: "şehri", order: 3, ar: "مَدِينَة" },
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" },
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ]
    },
    // 8. Mevlana Müzesi ile meşhurdur.
    {
        words: [
            { tr: "Mevlana", order: 3, ar: "مَوْلَانَا." },
            { tr: "müzesi ile", order: 2, ar: "بِمُتْحَف" },
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    // 9. Türkiye'de nerede gezindin?
    {
        words: [
            { tr: "Türkiyede", order: 3, ar: "في تُرْكِيا." },
            { tr: "nerede", order: 1, ar: "أَيْنَ" },
            { tr: "gezindin?", order: 2, ar: "تَجَوَّلْتِ" }
        ]
    },
    // 10. İstanbul'da gezindim.
    {
        words: [
            { tr: "İstanbulda", order: 2, ar: "فی إِسْطَنْبُول." },
            { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
        ]
    },
    // 11. Şu an nereye gidiyorsun?
    {
        words: [
            { tr: "Şu an", order: 3, ar: "الآن‫.‬" },
            { tr: "nereye", order: 1, ar: "إِلَى أَيْنَ" },
            { tr: "gidiyorsun?", order: 2, ar: "تَذْهَبِينَ" }
        ]
    },
    // 12. Ülkeme dönüyorum.
    {
        words: [
            { tr: "Ülkeme", order: 2, ar: "إِلَى بَلَدِي." },
            { tr: "dönüyorum.", order: 1, ar: "أَرْجِعُ" }
        ]
    },
    // 13. Merve İstanbul'da gezindi.
    {
        words: [
            { tr: "Merve", order: 2, ar: "مَرْوَة" },
            { tr: "İstanbulda", order: 3, ar: "في إِسْطَنْبُول." },
            { tr: "gezindi.", order: 1, ar: "تَجَوَّلَتْ" }
        ]
    },
    // 14. Yunus Konya'da yaşıyor.
{
        words: [
            { tr: "Yunus", order: 2, ar: "يُونُس" },
            { tr: "Konya'da", order: 3, ar: "فِي قُونْيَا." },
            { tr: "yaşıyor.", order: 1, ar: "يَعِيشُ" }
        ]
    },
    // 15. Konya Mevlana Müzesi ile meşhurdur.
    {
        words: [
            { tr: "Konya", order: 1, ar: "قُونْيَا" },
            { tr: "Mevlana", order: 4, ar: "مَوْلَانَا." },
            { tr: "müzesi ile", order: 3, ar: "بِمُتْحَف" },
            { tr: "meşhurdur.", order: 2, ar: "مَشْهُورَة" }
        ]
    },
    // 16. Yakutiye medresesi Erzurum'dadır.
    {
        words: [
            { tr: "Yakutiye", order: 2, ar: "الْيَاكُوتِيَّة" },
            { tr: "Medresesi", order: 1, ar: "الْمَدْرَسَة" },
            { tr: "Erzurum'dadır.", order: 3, ar: "فِي أَرْضُرُوم." }
        ]
    },
    // 17. Urfa'daki Balıklıgöl'de gezindim.
    {
        words: [
            { tr: "Urfa'daki", order: 4, ar: "فِي أُورْفَة." }, 
            { tr: "Balıklı", order: 3, ar: "الْأَسْمَاك" },
            { tr: "gölde", order: 2, ar: "فِي بُحَيْرَة" }, 
            { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
        ]
    },
    // 18. Mersin Kız Kalesi ile meşhurdur.
    {
        words: [
            { tr: "Mersin", order: 2, ar: "مَرْسِين" },
            { tr: "kız", order: 4, ar: "الْفَتَاة." },
            { tr: "kalesi ile", order: 3, ar: "بِقَلْعَة" },
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    // 19. Trabzon'daki Uzungöl'e seyahat ettim.
    {
        words: [
            { tr: "Trabzon'daki", order: 3, ar: "فِي طِرَابْزُون." },
            { tr: "Uzungöl'e", order: 2, ar: "إِلَى أُوزُونْغُول" },
            { tr: "seyahat ettim.", order: 1, ar: "سَافَرْتُ" }
        ]
    },
    // 20. İstanbul'daki büyük Ayasofya camisini ziyaret ettim.
    {
        words: [
            { tr: "İstanbul'daki", order: 5, ar: "فِي إِسْطَنْبُول." },
            { tr: "Büyük", order: 4, ar: "الْكَبير" },
            { tr: "Ayasofya", order: 3, ar: "آيَاصُوفْيَا" },
            { tr: "camisini", order: 2, ar: "مَسْجِد" },
            { tr: "ziyaret ettim.", order: 1, ar: "زُرْتُ" }
        ]
    },

    // --- BÖLÜM 3: FİİL ÇEKİMLERİ (GİTMEK) ---

    // 21. O, deniz kenarına gitti. (Erkek)
    {
        words: [
            { tr: "O", order: 1, ar: "هُوَ" },
            { tr: "deniz", order: 4, ar: "الْبَحْر." },
            { tr: "kenarına", order: 3, ar: "إِلَى شَاطِئ" },
            { tr: "gitti.", order: 2, ar: "ذَهَبَ" }
        ]
    },
    // 22. O ikisi dağa gittiler.
    {
        words: [
            { tr: "O ikisi", order: 1, ar: "هُمَا" },
            { tr: "dağa", order: 3, ar: "إِلَى الْجَبَل." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبَا" }
        ]
    },
    // 23. Onlar camiye gittiler. (Erkek)
    {
        words: [
            { tr: "Onlar", order: 1, ar: "هُمْ" },
            { tr: "camiye", order: 3, ar: "إِلَى الْمَسْجِد." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبُوا" }
        ]
    },
    // 24. O eve gitti. (Kadın)
    {
        words: [
            { tr: "O", order: 1, ar: "هِيَ" },
            { tr: "eve", order: 3, ar: "إِلَى الْبَيْت." },
            { tr: "gitti.", order: 2, ar: "ذَهَبَتْ" }
        ]
    },
    // 25. O ikisi okula gittiler. (Kadın)
    {
        words: [
            { tr: "O ikisi", order: 1, ar: "هُمَا" },
            { tr: "okula", order: 3, ar: "إِلَى الْمَدْرَسَة." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبَتَا" }
        ]
    },
    // 26. Onlar bahçeye gittiler. (Kadın)
    {
        words: [
            { tr: "Onlar", order: 1, ar: "هُنَّ" },
            { tr: "bahçeye", order: 3, ar: "إِلَى الْحَدِيقَة." },
            { tr: "gittiler.", order: 2, ar: "ذَهَبْنَ" }
        ]
    },

    // --- BÖLÜM 4: OKUMA PARÇASI (VATAN SEVGİSİ) ---

    // 27. Merhaba, ismim Murat.
    {
        words: [
            { tr: "Merhaba,", order: 1, ar: "مَرْحَبًا،" },
            { tr: "ismim", order: 2, ar: "اِسْمي" },
            { tr: "Murat'tır.", order: 3, ar: "مُراد." }
        ]
    },
    // 28. Ben Türk vatandaşıyım.
    {
        words: [
            { tr: "Ben", order: 1, ar: "وَأَنَا" },
            { tr: "Türk", order: 3, ar: "تُرْكِيّ." },
            { tr: "vatandaşıyım.", order: 2, ar: "مُواطِن" }
        ]
    },
    // 29. Ailemle Ankara şehrinde yaşıyorum.
    {
        words: [
            { tr: "Ailemle", order: 4, ar: "مَع أُسْرَتي." },
            { tr: "Ankara", order: 3, ar: "أَنْقَرَة" },
            { tr: "şehrinde", order: 2, ar: "فِي مَدينَة" },
            { tr: "yaşıyorum.", order: 1, ar: "أَعيشُ" }
        ]
    },
    // 30. Ankara güzel ve önemli bir şehirdir.
    {
        words: [
            { tr: "Ankara", order: 1, ar: "أَنْقَرَة" },
            { tr: "güzel", order: 3, ar: "جَميلَة" },
            { tr: "ve önemli", order: 4, ar: "ومُهِمَّة." },
            { tr: "şehirdir.", order: 2, ar: "مَدينَة" }
        ]
    },
    // 31. Çünkü o Türkiye'nin başkentidir.
    {
        words: [
            { tr: "Çünkü o", order: 1, ar: "لِأَنَّها" },
            { tr: "Türkiye'nin", order: 3, ar: "تُرْكِيا." },
            { tr: "başkentidir.", order: 2, ar: "عاصِمَة" }
        ]
    },
    // 32. Ayrıca ortasında bulunur.
    {
        words: [
            { tr: "Ayrıca", order: 3, ar: "أَيْضًا." },
            { tr: "ortasında", order: 2, ar: "فِي وَسَطِها" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 33. Vatanımı çok seviyorum.
    {
        words: [
            { tr: "Vatanımı", order: 2, ar: "وَطَني" },
            { tr: "çok", order: 3, ar: "كَثيرًا." },
            { tr: "seviyorum.", order: 1, ar: "أُحِبُّ" }
        ]
    },
    // 34. Çünkü orada bayrak altında özgürce yaşıyorum.
    {
        words: [
            { tr: "Çünkü ben", order: 1, ar: "لِأَنَّني" },
            { tr: "orada", order: 3, ar: "فيه" },
            { tr: "bayrak", order: 6, ar: "العَلَم." },
            { tr: "altında", order: 5, ar: "تَحْت" },
            { tr: "özgürce", order: 4, ar: "حُرًّا" },
            { tr: "yaşıyorum.", order: 2, ar: "أَعيشُ" }
        ]
    },
    // 35. Türkiye tarihi ve turistik mekanlarıyla meşhurdur.
    {
        words: [
            { tr: "Türkiye", order: 2, ar: "تُرْكِيا" },
            { tr: "tarihi", order: 4, ar: "التّاريخِيَّة" },
            { tr: "ve turistik", order: 5, ar: "وَالسِّياحِيَّة." },
            { tr: "mekanlarıyla", order: 3, ar: "بِأَماكِنِها" },
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },

// 36. Ayasofya, Topkapı ve Mevlana gibi.
    // Cümle: Büyük Ayasofya camisi ve Topkapı sarayı ve Mevlana müzesi gibi.
    {
        words: [
            { tr: "Büyük", order: 3, ar: "الْكَبير،" }, // Cümle başı büyük
            { tr: "Ayasofya", order: 2, ar: "آياصوفْيا" }, // Özel isim
            { tr: "camisi gibi", order: 1, ar: "كَمَسْجِد" }, // Küçük harf
            { tr: "ve sarayı", order: 4, ar: "وَقَصْر" }, // Küçük harf (ve + saray)
            { tr: "Topkapı", order: 5, ar: "توبْكابي،" }, // Özel isim
            { tr: "ve müzesi", order: 6, ar: "وَمُتْحَف" }, // Küçük harf (ve + müze)
            { tr: "Mevlana", order: 7, ar: "مَوْلانا." } // Özel isim
        ]
    },
    // 37. Türkiye güzel doğasıyla da meşhurdur.
    {
        words: [
            { tr: "ve Türkiye", order: 1, ar: "وَتُرْكِيا" }, // Özel isim büyük, bağlaç küçük
            { tr: "güzel", order: 4, ar: "الجَميلَة" },
            { tr: "doğasıyla", order: 3, ar: "بِطَبيعَتِها" },
            { tr: "da", order: 5, ar: "أَيْضًا." },
            { tr: "meşhurdur.", order: 2, ar: "مَشْهورَة" }
        ]
    },
    // 38. Her zaman vatanımı savunurum.
    {
        words: [
            { tr: "Vatanımı", order: 2, ar: "عَنْ وَطَني" },
            { tr: "her", order: 3, ar: "فِي كُلّ" }, // Cümle başı büyük
            { tr: "zaman", order: 4, ar: "وَقْت." },
            { tr: "savunurum.", order: 1, ar: "أُدافِعُ" }
        ]
    },
    // 39. Ona ilmimle ve işimle hizmet ederim.
    {
        words: [
            { tr: "İlmimle", order: 2, ar: "بِعِلْمي" },
            { tr: "ve amelimle", order: 3, ar: "وَعَمَلي." },
            { tr: "ona hizmet ederim.", order: 1, ar: "أَخْدِمُهُ" }
        ]
    },
    // 40. Onun için işimde daima çabalarım.
    {
        words: [
            { tr: "Onun için", order: 3, ar: "مِنْ أَجْلِه" }, // Cümle başı büyük
            { tr: "işimde", order: 2, ar: "فِي عَمَلي" },
            { tr: "daima", order: 4, ar: "دائِمًا." },
            { tr: "çabalarım.", order: 1, ar: "أَجْتَهِدُ" }
        ]
    },
    // 41. Vatandan daha değerli bir şey yoktur.
    {
        words: [
            { tr: "Vatandan", order: 4, ar: "مِن الوَطَن." }, // Cümle başı büyük
            { tr: "daha değerli", order: 3, ar: "أَغْلى" },
            { tr: "bir şey", order: 2, ar: "شَيْء" },
            { tr: "yoktur.", order: 1, ar: "فَلَا" }
        ]
    },

    // --- BÖLÜM 5: COĞRAFİ KONUM VE YÖNLER ---

    // 42. Türkiye Asya ve Avrupa arasında bulunur.
    {
        words: [
            { tr: "Türkiye", order: 2, ar: "تُرْكِيا" }, // Özel isim
            { tr: "Asya", order: 4, ar: "آسْيا" }, // Özel isim
            { tr: "ve Avrupa", order: 5, ar: "وَأوروبّا." }, // 've' küçük, 'Avrupa' büyük
            { tr: "arasında", order: 3, ar: "بَيْنَ" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 43. Trabzon Türkiye'nin kuzeyindedir.
    {
        words: [
            { tr: "Trabzon", order: 2, ar: "طِرابْزون" }, // Özel isim
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." }, // Özel isim
            { tr: "kuzeyinde", order: 3, ar: "فِي شَمال" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 44. Mersin Türkiye'nin güneyindedir.
    {
        words: [
            { tr: "Mersin", order: 2, ar: "مَرْسين" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "güneyinde", order: 3, ar: "فِي جَنوب" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 45. Erzurum Türkiye'nin doğusundadır.
    {
        words: [
            { tr: "Erzurum", order: 2, ar: "أَرْضُروم" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "doğusunda", order: 3, ar: "فِي شَرْق" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 46. İstanbul Türkiye'nin batısındadır.
    {
        words: [
            { tr: "İstanbul", order: 2, ar: "إِسْطَنْبول" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "batısında", order: 3, ar: "فِي غَرْب" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    // 47. Konya Türkiye'nin ortasındadır.
    {
        words: [
            { tr: "Konya", order: 2, ar: "قونْيا" },
            { tr: "Türkiye'nin", order: 4, ar: "تُرْكِيا." },
            { tr: "ortasında", order: 3, ar: "فِي وَسَط" },
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },

    // --- BÖLÜM 6: TREN İSTASYONU DİYALOĞU ---

    // 48. Ne istiyorsun?
    {
        words: [
            { tr: "Ne", order: 1, ar: "مَاذَا" }, // Cümle başı büyük
            { tr: "istiyorsun?", order: 2, ar: "تُرِيدُ؟" }
        ]
    },
    // 49. Hızlı tren için bilet istiyorum.
    {
        words: [
            { tr: "Hızlı", order: 4, ar: "السَّرِيع." }, // Cümle başı büyük
            { tr: "tren için", order: 3, ar: "لِلْقِطَارِ" },
            { tr: "bilet", order: 2, ar: "تَذْكِرَةً" },
            { tr: "istiyorum.", order: 1, ar: "أُرِيدُ" }
        ]
    }
],
dialog : [
    // --- 1. DİYALOG: KİMLİK VE YAŞAM (Temel Soru-Cevaplar) ---
    {
        p1: [
            { tr: "Senin uyruğun", order: 2, ar: "جِنْسِيَّتُكَ" },
            { tr: "nedir?", order: 1, ar: "مَا" }
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Türküm.", order: 2, ar: "تُرْكِيٌّ." } // Özel isim büyük
        ]
    },
    {
        p1: [
            { tr: "Sen", order: 2, ar: "أَنْتِ؟" },
            { tr: "neredensin?", order: 1, ar: "مِنْ أَيْنَ" } // Birleştirildi (Min eyne)
        ],
        p2: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "Mısır'danım.", order: 2, ar: "مِنْ مِصْر." } // Birleştirildi (Min Misr)
        ]
    },
    {
        p1: [
            { tr: "Nerede", order: 1, ar: "أَيْنَ" }, // Cümle başı
            { tr: "yaşıyorsun?", order: 2, ar: "تَعِيشُ؟" } // Küçük harf
        ],
        p2: [
            { tr: "Konya", order: 3, ar: "قُونْيَا." }, // Özel isim
            { tr: "şehrinde", order: 2, ar: "فِي مَدِينَةِ" }, // Birleştirildi (Fi medineti)
            { tr: "yaşıyorum.", order: 1, ar: "أَعِيشُ" } // Ayrı kaldı
        ]
    },

    // --- 2. DİYALOG: ŞEHİR TANITIMI VE SEYAHAT ---
    {
        p1: [
            { tr: "Konya", order: 4, ar: "قُونْيَا؟" },
            { tr: "şehri", order: 3, ar: "مَدِينَة" }, // Küçük harf
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" }, // Küçük harf
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ],
        p2: [
            { tr: "Mevlana", order: 3, ar: "مَوْلَانَا." }, // Özel isim
            { tr: "müzesi ile", order: 2, ar: "بِمُتْحَفِ" }, // 'Bi' bitişik olduğu için 'ile' birleşik kaldı
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    {
        p1: [
            { tr: "Türkiye'de", order: 3, ar: "فِي تُرْكِيا" }, // Birleştirildi (Fi Turkiya)
            { tr: "nerede", order: 1, ar: "أَيْنَ" },
            { tr: "gezindin?", order: 2, ar: "تَجَوَّلْتِ" }
        ],
        p2: [
            { tr: "İstanbul'da", order: 2, ar: "فِي إِسْطَنْبُول." }, // Birleştirildi
            { tr: "gezindim.", order: 1, ar: "تَجَوَّلْتُ" }
        ]
    },
    {
        p1: [
            { tr: "Şu an", order: 3, ar: "الآن." }, // Cümle başı büyük
            { tr: "nereye", order: 1, ar: "إِلَى أَيْنَ" }, // Küçük harf
            { tr: "gidiyorsun?", order: 2, ar: "تَذْهَبِينَ" }
        ],
        p2: [
            { tr: "Ülkeme", order: 2, ar: "إِلَى بَلَدِي." }, // Birleştirildi
            { tr: "dönüyorum.", order: 1, ar: "أَرْجِعُ" }
        ]
    },

    // --- 3. DİYALOG: GEÇMİŞ ZAMAN SORULARI (Seyahat Anıları) ---
    {
        p1: [
            { tr: "Nereye", order: 1, ar: "إِلَى أَيْنَ" }, // Birleştirildi, Cümle başı büyük
            { tr: "seyahat ettiniz?", order: 2, ar: "سَافَرْتُمْ؟" } // Küçük harf
        ],
        p2: [
            { tr: "Trabzon'a", order: 2, ar: "إِلَى طِرَابْزُون." }, // Birleştirildi
            { tr: "seyahat ettik.", order: 1, ar: "سَافَرْنَا" }
        ]
    },
    {
        p1: [
            { tr: "Annenle", order: 3, ar: "مَعَ أُمِّكِ؟" }, // Birleştirildi, Cümle başı büyük
            { tr: "nereye", order: 1, ar: "إِلَى أَيْنَ" }, // Birleştirildi, küçük harf
            { tr: "seyahat ettin?", order: 2, ar: "سَافَرْتِ" }
        ],
        p2: [
            { tr: "Onunla", order: 2, ar: "مَعَهَا" }, // Cümle başı büyük
            { tr: "Konya'ya", order: 3, ar: "إِلَى قُونْيَا." }, // Birleştirildi
            { tr: "seyahat ettim.", order: 1, ar: "سَافَرْتُ" }
        ]
    },
    {
        p1: [
            { tr: "Hangi", order: 1, ar: "أَيَّ" }, // Cümle başı büyük
            { tr: "tarihi", order: 3, ar: "تَارِيخِيٍّ" }, // Küçük harf
            { tr: "mekanı", order: 2, ar: "مَكَانٍ" },
            { tr: "ziyaret ettiniz?", order: 4, ar: "زُرْتُنَّ؟" }
        ],
        p2: [
            { tr: "Balıklı", order: 3, ar: "الْأَسْمَاكِ." }, // Özel isim (Balıklıgöl)
            { tr: "gölü", order: 2, ar: "بُحَيْرَةَ" }, // Küçük harf
            { tr: "ziyaret ettik.", order: 1, ar: "زُرْنَا" }
        ]
    },

    // --- 4. DİYALOG: YUSUF VE SALİH (Şam ve Suriye) ---
    {
        p1: [
            { tr: "Merhaba,", order: 1, ar: "مَرْحَبًا،" },
            { tr: "ben", order: 2, ar: "أَنَا" },
            { tr: "Türküm,", order: 3, ar: "تُرْكِيٌّ،" },
            { tr: "nerelisin?", order: 4, ar: "مِنْ أَيْنَ أَنْتَ؟" }
        ],
        p2: [
            { tr: "Hoş geldin,", order: 1, ar: "أَهْلًا،" },
            { tr: "ben", order: 2, ar: "أَنَا" },
            { tr: "Suriyeliyim,", order: 3, ar: "سُورِيٌّ،" },
            { tr: "Şam'da", order: 5, ar: "فِي دِمَشْق." }, // Birleştirildi
            { tr: "yaşıyorum.", order: 4, ar: "أَعِيشُ" }
        ]
    },
    {
        p1: [
            { tr: "Şam mı!", order: 1, ar: "دِمَشْق!" }, // Özel isim
            { tr: "O", order: 3, ar: "هِيَ" }, // Cümle başı
            { tr: "Suriye'nin", order: 5, ar: "سُورِيا؟" }, // Özel isim
            { tr: "başkenti", order: 4, ar: "عَاصِمَةُ" }, // Küçük harf
            { tr: "midir?", order: 2, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" }, // Cümle başı
            { tr: "Suriye'nin", order: 4, ar: "سُورِيا." }, // 've' küçük, Ülke büyük
            { tr: "güneyinde", order: 3, ar: "فِي جَنُوب" }, // 've tekau fi cenubi' (güneyinde bulunur) - Birleştirildi
            { tr: "bulunur.", order: 2, ar: "وَتَقَعُ" } // Arapçası üstte birleştiği için boş (veya yukarıdaki düzeni koruyabiliriz)
            // Düzeltme: Senin 'order' yapına sadık kalarak:
        ]
    },
    
    {
        p1: [
            { tr: "Şam", order: 3, ar: "دِمَشْق؟" },
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" },
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ],
        p2: [
            { tr: "Tarihiyle", order: 2, ar: "بِتَارِيخِهَا" }, // Cümle başı büyük
            { tr: "ve güzelliğiyle", order: 3, ar: "وَجَمَالِهَا" }, // Küçük harf, Vav bitişik
            { tr: "İstanbul gibi", order: 4, ar: "كَإِسْطَنْبُول." }, // 'Gibi' (Ka) bitişik, Özel isim büyük
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    },
    {
        p1: [
            { tr: "Ben", order: 1, ar: "أَنَا" },
            { tr: "onu ziyaret etmeyi", order: 3, ar: "أَنْ أَزُورَهَا." }, // Küçük harf
            { tr: "istiyorum.", order: 2, ar: "أُرِيدُ" }
        ],
        p2: [
            { tr: "İnşallah,", order: 1, ar: "إِنْ شَاءَ الله،" },
            { tr: "birlikte", order: 3, ar: "مَعًا." },
            { tr: "ziyaret ederiz.", order: 2, ar: "نَزُورُهَا" }
        ]
    },

    // --- 5. DİYALOG: RAŞİD VE KAZIM (Mısır ve Kahire) ---
    {
        p1: [
            { tr: "Selamun aleyküm,", order: 1, ar: "السَّلَامُ عَلَيْكُم،" },
            { tr: "sen", order: 3, ar: "أَنْتَ؟" },
            { tr: "neredensin?", order: 2, ar: "مِنْ أَيْنَ" } // Birleştirildi
        ],
        p2: [
            { tr: "Ve aleykum selam,", order: 1, ar: "وَعَلَيْكُم السَّلَام،" },
            { tr: "ben", order: 2, ar: "أَنَا" },
            { tr: "Mısır'danım.", order: 3, ar: "مِنْ مِصْر." } // Birleştirildi
        ]
    },
    {
        p1: [
            { tr: "Mısır", order: 3, ar: "مِصْر؟" }, // Cümle başı ve Özel isim
            { tr: "nerede", order: 1, ar: "أَيْنَ" }, // Küçük harf
            { tr: "bulunur?", order: 2, ar: "تَقَعُ" }
        ],
        p2: [
            { tr: "Afrika'nın", order: 3, ar: "إِفْرِيقْيَا؟" }, // Cümle başı ve Özel isim
            { tr: "kuzeyinde", order: 2, ar: "فِي شَمَال" }, // Birleştirildi
            { tr: "bulunur.", order: 1, ar: "تَقَعُ" }
        ]
    },
    {
        p1: [
            { tr: "Mısır'ın", order: 3, ar: "مِصْر؟" },
            { tr: "başkenti", order: 2, ar: "عَاصِمَة" },
            { tr: "nedir?", order: 1, ar: "مَا" }
        ],
        p2: [
            { tr: "Başkenti", order: 1, ar: "عَاصِمَتُهَا" }, // Cümle başı
            { tr: "Kahire'dir.", order: 2, ar: "القَاهِرَة." } // Özel isim
        ]
    },
    {
        p1: [
            { tr: "Kahire", order: 3, ar: "القَاهِرَة؟" },
            { tr: "ne ile", order: 1, ar: "بِمَاذَا" },
            { tr: "meşhurdur?", order: 2, ar: "تَشْتَهِرُ" }
        ],
        p2: [
            { tr: "Tarihi", order: 3, ar: "التَّارِيخِيَّة." }, // Cümle başı
            { tr: "mekanlarıyla", order: 2, ar: "بِأَمَاكِنِهَا" }, // Bi-emakiniha (Bi bitişik)
            { tr: "meşhurdur.", order: 1, ar: "تَشْتَهِرُ" }
        ]
    }
]

};

// --- 1. GLOBAL DEĞİŞKENLER ---
// --- 1. GLOBAL DEĞİŞKENLER VE HAFIZA ---
var mode = 'sentence'; 
var currentIdx = 0;
var step = 1;
var pTurn = 1;
var colorCounter = 0;
var currentDirection = 'tr-to-ar'; 
var completionStatus = { sentence: {}, dialog: {} }; 
var progressMemory = { sentence: {}, dialog: {} }; 

const wordColors = [
    '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', 
    '#46f0f0', '#f032e6', '#008080', '#e6beff', '#9a6324', 
    '#800000', '#aaffc3', '#808000', '#000075', '#d2691e'
];

const AR_FONT = "'Arakom', sans-serif";
const TR_FONT = "'Inter', sans-serif";

// --- 2. MOD VE NAVİGASYON ---
function startMode(m) {
    if (typeof togglePopup === "function") togglePopup(false); 
    mode = m;
    document.getElementById('entry-panel').style.display = 'none';
    document.querySelector('.navbar').style.display = 'flex';
    document.getElementById('sentence-mode').style.display = (m === 'sentence' ? 'flex' : 'none');
    document.getElementById('dialog-mode').style.display = (m === 'dialog' ? 'flex' : 'none');
    render();
}

function goHome() {
    document.getElementById('entry-panel').style.display = 'flex';
    document.querySelector('.navbar').style.display = 'none';
    currentIdx = 0;
}

window.onload = function() {
    const wrapper = document.querySelector('.switch-wrapper');
    const toggle = document.getElementById('direction-toggle');
    if (toggle && !toggle.checked) {
        wrapper.classList.add('fire-mode');
    }
};

function toggleDirection() {
    const toggle = document.getElementById('direction-toggle');
    const wrapper = document.querySelector('.switch-wrapper');
    const langTr = document.getElementById('lang-tr');
    const langAr = document.getElementById('lang-ar');

    if (!toggle.checked) {
        currentDirection = 'tr-to-ar';
        wrapper.classList.add('fire-mode');
        langTr.classList.add('active-lang');
        langAr.classList.remove('active-lang');
    } else {
        currentDirection = 'ar-to-tr';
        wrapper.classList.remove('fire-mode');
        langAr.classList.add('active-lang');
        langTr.classList.remove('active-lang');
    }
    render();
}

// --- 2. GÜNCELLEMİŞ NAVİGASYON VE KLAVYE KONTROLLERİ ---

function changeSentence(dir) {
    if (!data[mode]) return;

    // İLERİ BASILDIĞINDA: Önce mevcut cümlede açılacak kelime var mı bak
    if (dir === 1) {
        const currentWords = mode === 'sentence' ? 
            data.sentence[currentIdx].words : 
            (pTurn === 1 ? data.dialog[currentIdx].p1 : data.dialog[currentIdx].p2);
        
        if (step <= currentWords.length) {
            const w = currentWords.find(item => item.order === step);
            const trId = mode === 'sentence' ? 's-tr' : (pTurn === 1 ? 'p1-tr' : 'p2-tr');
            const arId = mode === 'sentence' ? 's-ar' : (pTurn === 1 ? 'p1-ar' : 'p2-ar');
            const originalIdx = currentWords.indexOf(w);
            
            // --- GÜNCELLEME BURASI: İleri tuşuyla 2. cümlenin ilk kelimesi açılıyorsa ses çal ---
            if (mode === 'dialog' && pTurn === 2 && w.order === 1) {
                speakCurrentSentence(); 
            }
            // -------------------------------------------------------------------------------

            // Sıradaki kelimeyi aç
            handleMove(w.order, (currentDirection === 'tr-to-ar' ? w.ar : w.tr), trId, arId, pTurn, originalIdx, true);
            return; // Cümle/Sayfa değiştirmeden çık
        }
    }

    // SAYFA DEĞİŞTİRME: Kelimeler bittiyse veya geri basıldıysa
    currentIdx = (currentIdx + dir + data[mode].length) % data[mode].length;
    
    // Değişkenleri ve ekranı sıfırla
    step = 1; 
    pTurn = 1; 
    colorCounter = 0;
    render(); 

    // GERİ GELİNDİĞİNDE: Eğer sayfa daha önce bitirilmişse her şeyi aç
    if (completionStatus[mode][currentIdx]) {
        forceOpenPage();
    }
}

function forceOpenPage() {
    // Mevcut mod verilerini al[cite: 3]
    if (mode === 'sentence') {
        const words = data.sentence[currentIdx].words;
        // Sıralı açılma garantisi için order üzerinden döngü[cite: 3]
        for (let i = 1; i <= words.length; i++) {
            const w = words.find(item => item.order === i);
            if (w) {
                handleMove(w.order, (currentDirection === 'tr-to-ar' ? w.ar : w.tr), 's-tr', 's-ar', 1, words.indexOf(w), true);
            }
        }
    } else {
        // Diyalog modu: Önce P1 sonra P2[cite: 3]
        const p1 = data.dialog[currentIdx].p1;
        for (let i = 1; i <= p1.length; i++) {
            const w = p1.find(item => item.order === i);
            if (w) handleMove(w.order, (currentDirection === 'tr-to-ar' ? w.ar : w.tr), 'p1-tr', 'p1-ar', 1, p1.indexOf(w), true);
        }
        
        const p2 = data.dialog[currentIdx].p2;
        for (let i = 1; i <= p2.length; i++) {
            const w = p2.find(item => item.order === i);
            if (w) handleMove(w.order, (currentDirection === 'tr-to-ar' ? w.ar : w.tr), 'p2-tr', 'p2-ar', 2, p2.indexOf(w), true);
        }
    }
}

// Klavye tuşlarını changeSentence fonksiyonuna bağla[cite: 3]
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        changeSentence(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        changeSentence(-1);
    }
});

function render() {
    step = 1;
    pTurn = 1;
    colorCounter = 0;

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.classList.remove('highlight-next');

    if (mode === 'sentence') {
        renderContent(data.sentence[currentIdx].words, 's-tr', 's-ar');
    } else {
        renderContent(data.dialog[currentIdx].p1, 'p1-tr', 'p1-ar', 1);
        renderContent(data.dialog[currentIdx].p2, 'p2-tr', 'p2-ar', 2);
    }

    // Sayfa açıldığında otomatik olarak bir kez seslendirir
    speakCurrentSentence();
}

function renderContent(words, trId, arId, playerNum = null) {
    const trCont = document.getElementById(trId);
    const arOutput = document.getElementById(arId);
    if (!trCont || !arOutput) return;

    trCont.innerHTML = '';
    arOutput.innerHTML = '';
    
    let displayWords = [...words];

    if (currentDirection === 'ar-to-tr') {
        displayWords.sort((a, b) => a.order - b.order);
        trCont.style.direction = 'rtl';
        arOutput.style.direction = 'ltr'; 

        words.forEach((_, i) => {
            const slot = document.createElement('span');
            slot.id = `${arId}-slot-${i}`; 
            slot.style.marginRight = "12px";
            slot.style.fontFamily = TR_FONT;
            slot.innerText = ""; 
            arOutput.appendChild(slot);
        });
    } else {
        trCont.style.direction = 'ltr';
        arOutput.style.direction = 'rtl';
    }

    displayWords.forEach((w, index) => {
        const span = document.createElement('span');
        const isActive = (playerNum === null || playerNum === 1) && w.order === 1;
        
        span.className = `word ${isActive ? 'active' : 'passive'}`;
        span.id = `${trId}-item-${index}`;
        span.setAttribute('data-order', w.order);
        span.setAttribute('data-container', trId);
        
        const originalIndex = words.indexOf(w);

        if (currentDirection === 'tr-to-ar') {
            span.innerText = w.tr;
            span.style.fontFamily = TR_FONT;
            span.onclick = () => handleMove(w.order, w.ar, trId, arId, playerNum, -1);
        } else {
            span.innerText = w.ar;
            span.style.fontFamily = AR_FONT;
            span.onclick = () => handleMove(w.order, w.tr, trId, arId, playerNum, originalIndex);
        }
        trCont.appendChild(span);
    });
}

// --- 4. TIKLAMA VE YERLEŞİM ---
function handleMove(order, outputText, trId, arId, playerNum, originalIndex, isAuto = false) {
    const clickedWord = event?.currentTarget || document.querySelector(`[data-container="${trId}"][data-order="${order}"]`);

    // Geri alma mantığı
    if (!isAuto && clickedWord?.classList.contains('completed')) {
        undoToStep(order, trId, arId, playerNum);
        completionStatus[mode][currentIdx] = false; 
        return;
    }

    // GÜNCELLEME: Ses Kontrolü
    if (order === 1 && !isAuto) {
        // Her halükarda mevcut (ilk cümlenin) sesini durdur
        window.speechSynthesis.cancel(); 

        // Eğer diyalog modundaysak ve kullanıcı İKİNCİ cümleye (P2) başladıysa sesi çal
        if (mode === 'dialog' && playerNum === 2) {
            speakCurrentSentence(); 
        }
    }

    // Sıra kontrolü
    if (order !== step) return;
    
    const activeColor = wordColors[colorCounter % wordColors.length];

    const allMatchingWords = document.querySelectorAll(`[data-container="${trId}"][data-order="${order}"]`);
    allMatchingWords.forEach(wordEl => {
        wordEl.className = 'word completed';
        wordEl.style.color = activeColor;
        wordEl.style.borderColor = activeColor;
    });

    if (currentDirection === 'ar-to-tr') {
        const targetSlot = document.getElementById(`${arId}-slot-${originalIndex}`);
        if (targetSlot) {
            targetSlot.innerText = outputText;
            targetSlot.style.color = activeColor;
        }
    } else {
        const outArea = document.getElementById(arId);
        if (outArea && !document.getElementById(`out-${trId}-${order}`)) {
            outArea.innerHTML += `<span id="out-${trId}-${order}" style="color: ${activeColor}; font-family: ${AR_FONT}; margin-left:8px;">${outputText}</span> `;
        }
    }

    step++;
    colorCounter++;
    
    updateFlowLogic(trId, playerNum);
}

function updateFlowLogic(trId, playerNum) {
    document.querySelectorAll(`[data-container="${trId}"].word.active`).forEach(w => w.className = 'word passive');
    const nextWords = document.querySelectorAll(`[data-container="${trId}"][data-order="${step}"]`);
    
    if (nextWords.length > 0) {
        nextWords.forEach(next => next.className = 'word active');
    } else if (mode === 'dialog' && playerNum === 1) {
        // Birinci konuşmacı (P1) bittiğinde burası çalışır
        pTurn = 2; 
        step = 1; 
        colorCounter = 0;
        
        // İkinci konuşmacının (P2) ilk kelimesini aktif et
        document.querySelectorAll(`[data-container="p2-tr"][data-order="1"]`).forEach(w => w.className = 'word active');
        
        
    }

    let isFinished = (mode === 'sentence') ? 
        (step > data.sentence[currentIdx].words.length) : 
        (pTurn === 2 && step > data.dialog[currentIdx].p2.length);

    if (isFinished) {
        completionStatus[mode][currentIdx] = true; // Sayfayı Tamamlandı olarak işaretle[cite: 1]
        document.getElementById('next-btn')?.classList.add('highlight-next');
    } else {
        document.getElementById('next-btn')?.classList.remove('highlight-next');
    }
}

function undoToStep(targetOrder, trId, arId, playerNum) {
    const containerWords = document.querySelectorAll(`[data-container="${trId}"]`);
    containerWords.forEach(wordEl => {
        const wordOrder = parseInt(wordEl.getAttribute('data-order'));
        if (wordOrder >= targetOrder) {
            wordEl.className = 'word passive';
            wordEl.style.color = '';
            wordEl.style.borderColor = '';
            
            if (currentDirection === 'tr-to-ar') {
                const outEl = document.getElementById(`out-${trId}-${wordOrder}`);
                if (outEl) outEl.remove();
            } else {
                const originalIdx = Array.from(containerWords).indexOf(wordEl);
                const targetSlot = document.getElementById(`${arId}-slot-${originalIdx}`);
                if (targetSlot) targetSlot.innerText = "";
            }
        }
    });

    step = targetOrder;
    colorCounter = targetOrder - 1;
    updateFlowLogic(trId, playerNum);
}