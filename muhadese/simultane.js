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
        
        <div class="nouns-col" style="min-width: 280px; flex: 1; border-left: 2px solid #E9EEF5; padding-left: 15px; display: flex; flex-direction: column; flex-shrink: 0;">
            <h3 style="color:var(--pdf-red); margin-bottom: 15px; text-align: center; position: sticky; top: 0; background: white; z-index: 10; padding: 5px 0;">İsimler & Meslekler</h3>
            <div style="width: 100%;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #F0F4F8;">
                            <th style="padding: 10px; border: 1px solid #E9EEF5;">Çoğul (ج)</th>
                            <th style="padding: 10px; border: 1px solid #E9EEF5;">Tekil</th>
                        </tr>
                    </thead>
                    <tbody>


<tr>
    <td class="ar-txt">أَيَّام<br><small style="font-size:11px; color:#555555;">Günler</small></td>
    <td class="ar-txt">يَوْم<br><small style="font-size:11px; color:#555555;">Gün</small></td>
</tr>
<tr>
    <td class="ar-txt">سَاعَات<br><small style="font-size:11px; color:#555555;">Saatler</small></td>
    <td class="ar-txt">سَاعَة<br><small style="font-size:11px; color:#555555;">Saat / Vakit</small></td>
</tr>
<tr>
    <td class="ar-txt">أَوْقَات الصَّبَاح<br><small style="font-size:11px; color:#555555;">Sabahlar</small></td>
    <td class="ar-txt">صَبَاح<br><small style="font-size:11px; color:#555555;">Sabah</small></td>
</tr>
<tr>
    <td class="ar-txt">أَوْقَات الظُّهْر<br><small style="font-size:11px; color:#555555;">Öğle vakitleri</small></td>
    <td class="ar-txt">ظُهْر<br><small style="font-size:11px; color:#555555;">Öğle</small></td>
</tr>
<tr>
    <td class="ar-txt">أَمْسِيَة<br><small style="font-size:11px; color:#555555;">Akşamlar</small></td>
    <td class="ar-txt">مَسَاء<br><small style="font-size:11px; color:#555555;">Akşam</small></td>
</tr>
<tr>
    <td class="ar-txt">لَيَالِي<br><small style="font-size:11px; color:#555555;">Geceler</small></td>
    <td class="ar-txt">لَيْل<br><small style="font-size:11px; color:#555555;">Gece</small></td>
</tr>

<tr>
    <td class="ar-txt">مَأْكُولَات<br><small style="font-size:11px; color:#555555;">Yiyecekler</small></td>
    <td class="ar-txt">طَعَام<br><small style="font-size:11px; color:#555555;">Yemek</small></td>
</tr>
<tr>
    <td class="ar-txt">مَشْرُوبَات<br><small style="font-size:11px; color:#555555;">İçecekler</small></td>
    <td class="ar-txt">شَرَاب<br><small style="font-size:11px; color:#555555;">İçecek</small></td>
</tr>
<tr>
    <td class="ar-txt">أَجْبَان<br><small style="font-size:11px; color:#555555;">Peynirler</small></td>
    <td class="ar-txt">جُبْن<br><small style="font-size:11px; color:#555555;">Peynir</small></td>
</tr>
<tr>
    <td class="ar-txt">زَيْتُون<br><small style="font-size:11px; color:#555555;">Zeytinler (Cins isim)</small></td>
    <td class="ar-txt">زَيْتُونَة<br><small style="font-size:11px; color:#555555;">Zeytin (Tane)</small></td>
</tr>
<tr>
    <td class="ar-txt">لُحُوم<br><small style="font-size:11px; color:#555555;">Etler</small></td>
    <td class="ar-txt">لَحْم<br><small style="font-size:11px; color:#555555;">Et</small></td>
</tr>
<tr>
    <td class="ar-txt">أَسْمَاك<br><small style="font-size:11px; color:#555555;">Balıklar</small></td>
    <td class="ar-txt">سَمَك<br><small style="font-size:11px; color:#555555;">Balık</small></td>
</tr>
<tr>
    <td class="ar-txt">سَلَطَات<br><small style="font-size:11px; color:#555555;">Salatalar</small></td>
    <td class="ar-txt">سَلَطَة<br><small style="font-size:11px; color:#555555;">Salata</small></td>
</tr>
<tr>
    <td class="ar-txt">عَصَائِر<br><small style="font-size:11px; color:#555555;">Meyve suları</small></td>
    <td class="ar-txt">عَصِير<br><small style="font-size:11px; color:#555555;">Meyve suyu</small></td>
</tr>
<tr>
    <td class="ar-txt">أَلْبَان / حَلِيب<br><small style="font-size:11px; color:#555555;">Sütler</small></td>
    <td class="ar-txt">حَلِيب<br><small style="font-size:11px; color:#555555;">Süt</small></td>
</tr>

<tr>
    <td class="ar-txt">بُيُوت<br><small style="font-size:11px; color:#555555;">Evler</small></td>
    <td class="ar-txt">بَيْت<br><small style="font-size:11px; color:#555555;">Ev</small></td>
</tr>
<tr>
    <td class="ar-txt">مَدَارِس<br><small style="font-size:11px; color:#555555;">Okullar</small></td>
    <td class="ar-txt">مَدْرَسَة<br><small style="font-size:11px; color:#555555;">Okul</small></td>
</tr>
<tr>
    <td class="ar-txt">مَسَاجِد<br><small style="font-size:11px; color:#555555;">Mescidler</small></td>
    <td class="ar-txt">مَسْجِد<br><small style="font-size:11px; color:#555555;">Mescid</small></td>
</tr>
<tr>
    <td class="ar-txt">غُرَف<br><small style="font-size:11px; color:#555555;">Odalar</small></td>
    <td class="ar-txt">غُرْفَة<br><small style="font-size:11px; color:#555555;">Oda</small></td>
</tr>
<tr>
    <td class="ar-txt">مَلَابِس<br><small style="font-size:11px; color:#555555;">Elbiseler</small></td>
    <td class="ar-txt">لِبَاس / ثَوْب<br><small style="font-size:11px; color:#555555;">Elbise</small></td>
</tr>
<tr>
    <td class="ar-txt">أَسْنَان<br><small style="font-size:11px; color:#555555;">Dişler</small></td>
    <td class="ar-txt">سِنّ<br><small style="font-size:11px; color:#555555;">Diş</small></td>
</tr>
<tr>
    <td class="ar-txt">صُوَر<br><small style="font-size:11px; color:#555555;">Resimler</small></td>
    <td class="ar-txt">صُورَة<br><small style="font-size:11px; color:#555555;">Resim</small></td>
</tr>

<tr>
    <td class="ar-txt">عَائِلَات<br><small style="font-size:11px; color:#555555;">Aileler</small></td>
    <td class="ar-txt">عَائِلَة / أُسْرَة<br><small style="font-size:11px; color:#555555;">Aile</small></td>
</tr>
<tr>
    <td class="ar-txt">أُمَّهَات<br><small style="font-size:11px; color:#555555;">Anneler</small></td>
    <td class="ar-txt">أُمّ<br><small style="font-size:11px; color:#555555;">Anne</small></td>
</tr>
<tr>
    <td class="ar-txt">أَصْدِقَاء<br><small style="font-size:11px; color:#555555;">Arkadaşlar</small></td>
    <td class="ar-txt">صَدِيق<br><small style="font-size:11px; color:#555555;">Arkadaş</small></td>
</tr>
<tr>
    <td class="ar-txt">أَقَارِب<br><small style="font-size:11px; color:#555555;">Akrabalar</small></td>
    <td class="ar-txt">قَرِيب<br><small style="font-size:11px; color:#555555;">Akraba</small></td>
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
                        <tr style="background: #F0F4F8;">
                            <th style="padding: 10px; border: 1px solid #E9EEF5;">Mastar</th>
                            <th style="padding: 10px; border: 1px solid #E9EEF5;">Emir</th>
                            <th style="padding: 10px; border: 1px solid #E9EEF5;">Muzari</th>
                            <th style="padding: 10px; border: 1px solid #E9EEF5;">Mazi</th>
                        </tr>
                    </thead>
                    <tbody>



<tr>
    <td class="ar-txt">اِسْتِيقَاظ<br><small style="font-size:11px; color:#555555;">Uyanmak</small></td>
    <td class="ar-txt">اِسْتَيْقِظْ<br><small style="font-size:11px; color:#555555;">Uyan</small></td>
    <td class="ar-txt">يَسْتَيْقِظُ<br><small style="font-size:11px; color:#555555;">Uyanıyor</small></td>
    <td class="ar-txt">اِسْتَيْقَظَ<br><small style="font-size:11px; color:#555555;">Uyandı</small></td>
</tr>

<tr>
    <td class="ar-txt">وُضُوء<br><small style="font-size:11px; color:#555555;">Abdest Almak</small></td>
    <td class="ar-txt">تَوَضَّأْ<br><small style="font-size:11px; color:#555555;">Abdest Al</small></td>
    <td class="ar-txt">يَتَوَضَّأُ<br><small style="font-size:11px; color:#555555;">Abdest Alıyor</small></td>
    <td class="ar-txt">تَوَضَّأَ<br><small style="font-size:11px; color:#555555;">Abdest Aldı</small></td>
</tr>

<tr>
    <td class="ar-txt">صَلَاة<br><small style="font-size:11px; color:#555555;">Namaz Kılmak</small></td>
    <td class="ar-txt">صَلِّ<br><small style="font-size:11px; color:#555555;">Namaz Kıl</small></td>
    <td class="ar-txt">يُصَلِّي<br><small style="font-size:11px; color:#555555;">Namaz Kılıyor</small></td>
    <td class="ar-txt">صَلَّى<br><small style="font-size:11px; color:#555555;">Namaz Kıldı</small></td>
</tr>

<tr>
    <td class="ar-txt">تَنَاوُل<br><small style="font-size:11px; color:#555555;">Yemek/Almak</small></td>
    <td class="ar-txt">تَنَاوَلْ<br><small style="font-size:11px; color:#555555;">Ye/Al</small></td>
    <td class="ar-txt">يَتَنَاوَلُ<br><small style="font-size:11px; color:#555555;">Yiyor/Alıyor</small></td>
    <td class="ar-txt">تَنَاوَلَ<br><small style="font-size:11px; color:#555555;">Yedi/Aldı</small></td>
</tr>

<tr>
    <td class="ar-txt">لُبْس<br><small style="font-size:11px; color:#555555;">Giymek</small></td>
    <td class="ar-txt">اِلْبَسْ<br><small style="font-size:11px; color:#555555;">Giy</small></td>
    <td class="ar-txt">يَلْبَسُ<br><small style="font-size:11px; color:#555555;">Giyiyor</small></td>
    <td class="ar-txt">لَبِسَ<br><small style="font-size:11px; color:#555555;">Giydi</small></td>
</tr>

<tr>
    <td class="ar-txt">ذَهَاب<br><small style="font-size:11px; color:#555555;">Gitmek</small></td>
    <td class="ar-txt">اِذْهَبْ<br><small style="font-size:11px; color:#555555;">Git</small></td>
    <td class="ar-txt">يَذْهَبُ<br><small style="font-size:11px; color:#555555;">Gidiyor</small></td>
    <td class="ar-txt">ذَهَبَ<br><small style="font-size:11px; color:#555555;">Gitti</small></td>
</tr>

<tr>
    <td class="ar-txt">رُجُوع<br><small style="font-size:11px; color:#555555;">Dönmek</small></td>
    <td class="ar-txt">اِرْجِعْ<br><small style="font-size:11px; color:#555555;">Dön</small></td>
    <td class="ar-txt">يَرْجِعُ<br><small style="font-size:11px; color:#555555;">Dönüyor</small></td>
    <td class="ar-txt">رَجَعَ<br><small style="font-size:11px; color:#555555;">Döndü</small></td>
</tr>

<tr>
    <td class="ar-txt">مُسَاعَدَة<br><small style="font-size:11px; color:#555555;">Yardım Etmek</small></td>
    <td class="ar-txt">سَاعِدْ<br><small style="font-size:11px; color:#555555;">Yardım Et</small></td>
    <td class="ar-txt">يُسَاعِدُ<br><small style="font-size:11px; color:#555555;">Yardım Ediyor</small></td>
    <td class="ar-txt">سَاعَدَ<br><small style="font-size:11px; color:#555555;">Yardım Etti</small></td>
</tr>

<tr>
    <td class="ar-txt">دِرَاسَة<br><small style="font-size:11px; color:#555555;">Ders Çalışmak</small></td>
    <td class="ar-txt">اُدْرُسْ<br><small style="font-size:11px; color:#555555;">Çalış</small></td>
    <td class="ar-txt">يَدْرُسُ<br><small style="font-size:11px; color:#555555;">Çalışıyor</small></td>
    <td class="ar-txt">دَرَسَ<br><small style="font-size:11px; color:#555555;">Çalıştı</small></td>
</tr>

<tr>
    <td class="ar-txt">نَوْم<br><small style="font-size:11px; color:#555555;">Uyumak</small></td>
    <td class="ar-txt">نَمْ<br><small style="font-size:11px; color:#555555;">Uyu</small></td>
    <td class="ar-txt">يَنَامُ<br><small style="font-size:11px; color:#555555;">Uyuyor</small></td>
    <td class="ar-txt">نَامَ<br><small style="font-size:11px; color:#555555;">Uyudu</small></td>
</tr>

<tr>
    <td class="ar-txt">تَنْظِيف<br><small style="font-size:11px; color:#555555;">Temizlemek</small></td>
    <td class="ar-txt">نَظِّفْ<br><small style="font-size:11px; color:#555555;">Temizle</small></td>
    <td class="ar-txt">يُنَظِّفُ<br><small style="font-size:11px; color:#555555;">Temizliyor</small></td>
    <td class="ar-txt">نَظَّفَ<br><small style="font-size:11px; color:#555555;">Temizledi</small></td>
</tr>

<tr>
    <td class="ar-txt">شُرْب<br><small style="font-size:11px; color:#555555;">İçmek</small></td>
    <td class="ar-txt">اِشْرَبْ<br><small style="font-size:11px; color:#555555;">İç</small></td>
    <td class="ar-txt">يَشْرَبُ<br><small style="font-size:11px; color:#555555;">İçiyor</small></td>
    <td class="ar-txt">شَرِبَ<br><small style="font-size:11px; color:#555555;">İçti</small></td>
</tr>

<tr>
    <td class="ar-txt">أَكْل<br><small style="font-size:11px; color:#555555;">Yemek</small></td>
    <td class="ar-txt">كُلْ<br><small style="font-size:11px; color:#555555;">Ye</small></td>
    <td class="ar-txt">يَأْكُلُ<br><small style="font-size:11px; color:#555555;">Yiyor</small></td>
    <td class="ar-txt">أَكَلَ<br><small style="font-size:11px; color:#555555;">Yedi</small></td>
</tr>

<tr>
    <td class="ar-txt">غَسْل<br><small style="font-size:11px; color:#555555;">Yıkamak</small></td>
    <td class="ar-txt">اِغْسِلْ<br><small style="font-size:11px; color:#555555;">Yıka</small></td>
    <td class="ar-txt">يَغْسِلُ<br><small style="font-size:11px; color:#555555;">Yıkıyor</small></td>
    <td class="ar-txt">غَسَلَ<br><small style="font-size:11px; color:#555555;">Yıkadı</small></td>
</tr>

<tr>
    <td class="ar-txt">إِرَادَة<br><small style="font-size:11px; color:#555555;">İstemek</small></td>
    <td class="ar-txt">أَرِدْ<br><small style="font-size:11px; color:#555555;">İste</small></td>
    <td class="ar-txt">يُرِيدُ<br><small style="font-size:11px; color:#555555;">İstiyor</small></td>
    <td class="ar-txt">أَرَادَ<br><small style="font-size:11px; color:#555555;">İstedi</small></td>
</tr>

<tr>
    <td class="ar-txt">حُبّ<br><small style="font-size:11px; color:#555555;">Sevmek</small></td>
    <td class="ar-txt">أَحِبَّ<br><small style="font-size:11px; color:#555555;">Sev</small></td>
    <td class="ar-txt">يُحِبُّ<br><small style="font-size:11px; color:#555555;">Seviyor</small></td>
    <td class="ar-txt">أَحَبَّ<br><small style="font-size:11px; color:#555555;">Sevdi</small></td>
</tr>

<tr>
    <td class="ar-txt">مَجِيء<br><small style="font-size:11px; color:#555555;">Gelmek</small></td>
    <td class="ar-txt">تَعَالَ<br><small style="font-size:11px; color:#555555;">Gel</small></td>
    <td class="ar-txt">يَأْتِي<br><small style="font-size:11px; color:#555555;">Geliyor</small></td>
    <td class="ar-txt">أَتَى<br><small style="font-size:11px; color:#555555;">Geldi</small></td>
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
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">1. Harf-i Cerler</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Harf</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">...de / içinde</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">فِي</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">üzerinde</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">عَلَى</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">...e / ...a</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">إِلَى</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">...den / ...dan</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">مِنْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">ile / ...e</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">بِـ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">için</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">لِـ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">hakkında</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">عَنْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">gibi</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">كَـ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">...e kadar</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">حَتَّى</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">2. Diğer Harfler</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Harf</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Ve (Bağlaç)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">وَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Hemen sonra</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">فَـ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Ecek / Acak</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">سَـ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">...mı? / ...mi?</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">أَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Değil (Mazi)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">مَا</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Değil (Muzari)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">لَا</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Kesinlikle</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">قَدْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Elbette</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">لَـ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">İle / Beraber</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">مَعَ</td></tr>
            </table>
        </div>
    </div>

    <div style="display: flex; gap: 30px; align-items: flex-start; flex-direction: row-reverse;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">3. Çoğul (Cemi)</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Durum</th>
                    <th style="padding: 10px; text-align: center;">Ek</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Erkek (Özne)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">ـُونَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Erkek (Nesne)</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">ـِينَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Kadın</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">ـَات</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">4. İkil (Tesniye)</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Durum</th>
                    <th style="padding: 10px; text-align: center;">Ek</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Özne Hali</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">ـَانِ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Nesne Hali</td><td class="ar-txt" dir="rtl" style="font-size: 2.2rem; text-align: center; color: #2C3E50;">ـَيْنِ</td></tr>
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
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">1. Soru Edatları</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Ne?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَا / مَاذَا</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Kim?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَنْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Nerede?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَيْنَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Nasıl?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">كَيْفَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Ne zaman?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَتَى</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Niçin?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">لِمَاذَا</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Hangi / Kaç?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَيّ / كَمْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Nereden?</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مِنْ أَيْنَ</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">2. Yer Zarfları</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Önünde</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَمَامَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Arkasında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">خَلْفَ / وَرَاءَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Üstünde</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">فَوْقَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Altında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">تَحْتَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Yanında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">عِنْدَ / جَانِبَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Arasında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">بَيْنَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Etrafında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">حَوْلَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Sağında</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">يَمِينَ</td></tr>
            </table>
        </div>
    </div>

    <div style="display: flex; gap: 30px; align-items: flex-start; flex-direction: row-reverse;">
        
        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">3. Zaman Zarfları</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Önce / Sonra</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">قَبْلَ / بَعْدَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Bugün / Yarın</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">اَلْيَوْمَ / غَدًا</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Dün</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَمْسِ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Sabah / Akşam</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">صَبَاحًا / مَسَاءً</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">...dığı zaman</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">حِينَ / أَثْنَاءَ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Asla / Ebeden</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَبَداً</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Hâlâ / Henüz</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">لَمَّا</td></tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.8rem; margin-bottom: 15px; text-align: center; border-bottom: 3px solid #E9EEF5;">4. Bağlaçlar / Diğerleri</h3>
            <table style="width: 100%; font-size: 1.4rem; border-collapse: collapse;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px; text-align: left;">Anlamı</th>
                    <th style="padding: 10px; text-align: center;">Arapça</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Veya / Yoksa</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَوْ / أَمْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Çünkü</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">لِأَنَّ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">O zaman</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">إِذَنْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Şayet / Eğer</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">إِذَا / لَوْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Sadece</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">فَقَطْ</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Birlikte</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">مَعاً</td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td style="padding: 8px;">Ayrıca</td><td class="ar-txt" dir="rtl" style="font-size: 1.8rem; text-align: center;">أَيْضاً</td></tr>
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
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #E9EEF5;">1. Munfasıl (Ayrı)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">هُمْ</span><br><small>(Onlar)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">هُمَا</span><br><small>(O ikisi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">هُوَ</span><br><small>(O)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">هُنَّ</span><br><small>(Onlar)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">هُمَا</span><br><small>(O ikisi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">هِيَ</span><br><small>(O)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتُمْ</span><br><small>(Siz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">أَنْتُمَا</span><br><small>(Siz ikiniz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتَ</span><br><small>(Sen)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتُنَّ</span><br><small>(Siz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">أَنْتُمَا</span><br><small>(Siz ikiniz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتِ</span><br><small>(Sen)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">نَحْنُ</span><br><small>(Biz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">نَحْنُ</span><br><small>(Biz ikimiz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنَا</span><br><small>(Ben)</small></td></tr>
                
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #E9EEF5;">2. Muttasıl (Bitişik)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #F0F4F8; border-bottom: 3px solid #E9EEF5;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">ـهُمْ</span><br><small>(Onları)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـهُمَا</span><br><small>(O ikisini)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـهُ</span><br><small>(Onu)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">ـهُنَّ</span><br><small>(Onları)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـهُمَا</span><br><small>(O ikisini)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـهَا</span><br><small>(Onu)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">ـكُمْ</span><br><small>(Sizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـكُمَا</span><br><small>(Siz ikinizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـكَ</span><br><small>(Seni)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">ـكُنَّ</span><br><small>(Sizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـكُمَا</span><br><small>(Siz ikinizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـكِ</span><br><small>(Seni)</small></td></tr>
                <tr style="border-bottom: 1px solid #E9EEF5;"><td><span class="ar-txt" style="font-size:2.2rem;">ـنَا</span><br><small>(Bizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـنَا</span><br><small>(Bizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـي / نِي</span><br><small>(Beni)</small></td></tr>
                
            </table>
        </div>
    </div>

    <h3 style="color:var(--pdf-red); font-size: 1.6rem; margin: 30px 0 10px 0; border-left: 5px solid var(--pdf-red); padding-left: 10px;">İşaret Zamirleri (Bu / Şu-O)</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr style="background: #F0F4F8; border-bottom: 3px solid #E9EEF5;">
            <th style="padding: 10px;">Çoğul</th>
            <th style="padding: 10px;">İkil</th>
            <th style="padding: 10px;">Tekil</th>
        </tr>
        <tr style="border-bottom: 1px solid #E9EEF5;">
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰؤُلَاءِ / أُولٰئِكَ</span><br><small>(Bunlar/Şunlar)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰذَانِ / ذَانِكَ</span><br><small>(Bu/O ikisi)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰذَا / ذٰلِكَ</span><br><small>(Bu/O)</small></td>
        </tr>
        <tr style="border-bottom: 1px solid #E9EEF5;">
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰؤُلَاءِ / أُولٰئِكَ</span><br><small>(Bunlar/Şunlar)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰتَانِ / تَانكَ</span><br><small>(Bu/O ikisi)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">هٰذِهِ / تِلْكَ</span><br><small>(Bu/O)</small></td>
        </tr>
    </table>

    <h3 style="color:var(--pdf-red); font-size: 1.6rem; margin: 30px 0 10px 0; border-left: 5px solid var(--pdf-red); padding-left: 10px;">İsm-i Mevsuller (Ki O)</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr style="background: #F0F4F8; border-bottom: 3px solid #E9EEF5;">
            <th style="padding: 10px;">Çoğul</th>
            <th style="padding: 10px;">İkil</th>
            <th style="padding: 10px;">Tekil</th>
        </tr>
        <tr style="border-bottom: 1px solid #E9EEF5;">
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّذِينَ</span><br><small>(Onlar ki)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّذَانِ</span><br><small>(O ikisi ki)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">الَّذِي</span><br><small>(O ki)</small></td>
        </tr>
        <tr style="border-bottom: 1px solid #E9EEF5;">
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
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #E9EEF5;">1. Mazi Fiil (-dı)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #F0F4F8; border-bottom: 3px solid #E9EEF5; height: 50px;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـُوا</span><br><small>(-dılar)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـَا</span><br><small>(-dılar/2)</small></td>
                    <td><span class="ar-txt" style="font-size:1.5rem;">----</span><br><small>(-dı)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَ</span><br><small>(-dılar K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـَتَا</span><br><small>(-dılar/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـَتْ</span><br><small>(-dı K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمْ</span><br><small>(-dınız)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمَا</span><br><small>(-dınız/2)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتَ</span><br><small>(-dın)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُنَّ</span><br><small>(-dınız K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمَا</span><br><small>(-dınız/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتِ</span><br><small>(-dın K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَا</span><br><small>(-dık)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَا</span><br><small>(-dık)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُ</span><br><small>(-dım)</small></td>
                </tr>
            </table>
        </div>

        <div style="flex: 1;">
            <h3 style="color:var(--pdf-red); font-size: 1.5rem; margin-bottom: 10px; text-align: center; border-bottom: 3px solid #E9EEF5;">2. Muzari Fiil (-yor)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr style="background: #F0F4F8; border-bottom: 3px solid #E9EEF5; height: 50px;">
                    <th style="padding: 10px;">Çoğul</th>
                    <th style="padding: 10px;">İkil</th>
                    <th style="padding: 10px;">Tekil</th>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـُونَ</span><br><small>(-yorlar)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـَانِ</span><br><small>(-yorlar/2)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ‫ ـ ـ ‬</span><br><small>(-yor)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـْنَ</span><br><small>(-yorlar K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorlar/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ‫ ـ ـ ‬</span><br><small>(-yor K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـُونَ</span><br><small>(-yorsunuz)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorsunuz/2)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ‫ ـ ـ ‬</span><br><small>(-yorsun)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـْنَ</span><br><small>(-yorsunuz K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorsunuz/2 K)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـــِــينَ</span><br><small>(-yorsun K)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #E9EEF5; height: 75px;">
                    <td><span class="ar-txt" style="font-size:2.2rem;">نَـ‫ ـ ـ ‬</span><br><small>(-yoruz)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">نَـ‫ ـ ـ ‬</span><br><small>(-yoruz)</small></td>
                    <td><span class="ar-txt" style="font-size:2.2rem;">أَ‫ ـ ـ ‬</span><br><small>(-yorum)</small></td>
                </tr>
            </table>
        </div>
    </div>

    <h3 style="color:var(--pdf-red); font-size: 1.6rem; margin: 30px 0 10px 0; border-left: 5px solid var(--pdf-red); padding-left: 10px;">3. Emir Ekleri (! / -sın)</h3>
    <table style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr style="background: #F0F4F8; border-bottom: 2px solid #E9EEF5;">
            <th style="padding: 10px;">Çoğul</th>
            <th style="padding: 10px;">İkil</th>
            <th style="padding: 10px;">Tekil</th>
        </tr>
        <tr style="border-bottom: 1px solid #E9EEF5;">
            <td><span class="ar-txt" style="font-size:2.2rem;">ـُوا</span><br><small>(Yapın!)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">ـَا</span><br><small>(İkiniz yapın!)</small></td>
            <td><span class="ar-txt" style="font-size:1.5rem;">(Sükun)</span><br><small>(Yap!)</small></td>
        </tr>
        <tr style="border-bottom: 1px solid #E9EEF5;">
            <td><span class="ar-txt" style="font-size:2.2rem;">ـْنَ</span><br><small>(Yapın! K)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">ـَا</span><br><small>(İkiniz yapın! K)</small></td>
            <td><span class="ar-txt" style="font-size:2.2rem;">ـــِي</span><br><small>(Yap! K)</small></td>
        </tr>
    </table>
    
    <div style="height: 60px;"></div>
</div>`,

             // Eski halini bununla değiştirin:
tamlamalar: `<iframe src="tamlamalar.pdf#view=Fit&toolbar=1" style="width:100%; height:100%; border:none; display:block;"></iframe>`
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
        tamlamalar: 'Tamlamalar' 
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
var data = (window.data && window.data.sentence) ? window.data : { sentence: [], dialog: [] };

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

/* Kelime kelime renklendirme: renkler artik sitenin paletinden turetildi.
   Hepsi beyaz zeminde okunakli; eski listedeki soluk tonlar (#46f0f0,
   #e6beff, #aaffc3) kaldirildi. */
const wordColors = [
    '#16A085', '#C0392B', '#2980B9', '#F39C12', '#7C3AED',
    '#27AE60', '#D35400', '#2C3E50', '#E74C3C', '#0E9E86',
    '#8E44AD', '#B7950B', '#1F618D', '#A04000', '#148F77'
];

const AR_FONT = "'Arakom', sans-serif";
const TR_FONT = "'Marhey', 'Inter', sans-serif";

// --- 2. MOD VE NAVİGASYON ---
function startMode(m) {
    /* veri yoksa moda girme (grade 9 gibi yalnız kelime olan dersler) */
    if ((m === 'sentence' && (!data.sentence || !data.sentence.length)) ||
        (m === 'dialog' && (!data.dialog || !data.dialog.length))) return;
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

/* ==== KELİMELER (kart + hafıza oyunu) — ortak modül, window.data.words kullanır ==== */
(function(){
  var allWords = [];


    /* Kart yuzu renkleri: site paletinden. */
    const cardColors = ["#16A085", "#3498DB", "#F39C12", "#EF5350", "#7C3AED", "#27AE60", "#E67E22", "#20C997"];
    let mode = 'study', isAr = true, scores = [0, 0], currentPlayer = 1, activeFlipped = [];

    function playSound(id) {
        const s = document.getElementById(id);
        s.volume = 0.15; s.currentTime = 0;
        s.play().catch(() => {});
    }

    function toggleLang() {
        isAr = !isAr;
        init();
    }

function init() {
    allWords = (window.data && window.data.words) || [];
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    // Mobilde dikey modda otomatik 9 çifti ayarla
    if (isMobile && isPortrait && mode !== 'study') {
        document.getElementById('pairCount').value = "9";
    }

    const grid = document.getElementById('grid');
    const p1Box = document.getElementById('p1-box');
    const p2Box = document.getElementById('p2-box');
    const pairCount = parseInt(document.getElementById('pairCount').value);
    grid.innerHTML = '';
    
    const isStudy = mode === 'study';
    const isMem2 = mode === 'mem2';

    // İki kişilik modda kutuları göster, değilse gizle
    p1Box.style.display = isMem2 ? 'flex' : 'none';
    p2Box.style.display = isMem2 ? 'flex' : 'none';

    grid.className = `grid ${isStudy ? '' : 'memory-mode'}`;

    let selectedWords = isStudy ? allWords : allWords.slice(0, pairCount);
    let displayList = [];

    if (isStudy) {
        displayList = selectedWords;
        // ÇALIŞMA MODU: Aşağı doğru doğal uzayan yapı
        grid.style.height = "auto"; 
        grid.style.gridTemplateColumns = "repeat(5, 1fr)";
        grid.style.gridAutoRows = "minmax(180px, auto)"; 
        grid.style.gridTemplateRows = "none"; 
    } else {
        selectedWords.forEach(w => {
            displayList.push({ text: w.ar, pairId: w.ar, lang: 'ar' });
            displayList.push({ text: w.tr, pairId: w.ar, lang: 'tr' });
        });
        displayList.sort(() => Math.random() - 0.5);
        
        // OYUN MODU: Ekranı tam kaplayan yapı
        let colCount = (displayList.length <= 12) ? 4 : 6;
        let rowCount = Math.ceil(displayList.length / colCount);
        
        grid.style.height = "100%"; 
        grid.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`; 
        grid.style.gridAutoRows = "none";
    }

    grid.setAttribute('data-total', displayList.length);

 displayList.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = isStudy ? item.ar : item.pairId;
        
        // Kart metinlerini belirle
        const frontText = isStudy ? (isAr ? item.ar : item.tr) : "";
        const backText = isStudy ? (isAr ? item.tr : item.ar) : item.text;
        
        // Dil sınıflarını ve font boyutlarını belirle
        let frontLangClass = "";
        let backLangClass = "";
        
        const isFrontAr = isStudy && isAr;
        const isBackAr = isStudy ? !isAr : (item.lang === 'ar');

        if (isStudy) {
            frontLangClass = isAr ? "lang-ar" : "lang-tr";
            backLangClass = isAr ? "lang-tr" : "lang-ar";
        } else {
            // Hafıza modunda ön yüz boş, arka yüz dile göre sınıf alır
            backLangClass = item.lang === 'ar' ? "lang-ar" : "lang-tr";
        }

        // Dinamik font boyutları (JS üzerinden kontrol devam ediyor)
        const baseFontSize = "clamp(1.2rem, 2.3vw, 2.2rem)";
        const arabicFontSize = "clamp(1.5rem, 4.5vw, 3.5rem)";

        const color = isStudy ? cardColors[index % cardColors.length] : "#16A085";

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front ${frontLangClass}" 
                     style="background-color: ${color}; font-size: ${isFrontAr ? arabicFontSize : baseFontSize}">
                    <span>${frontText}</span>
                </div>
                <div class="card-face card-back ${backLangClass}" 
                     style="font-size: ${isBackAr ? arabicFontSize : baseFontSize}">
                    <span>${backText}</span>
                </div>
            </div>`;
        
        card.onclick = () => handleFlip(card);
        grid.appendChild(card);
    });

    updateUI();
}

    function handleFlip(card) {
        if (card.classList.contains('matched') || (mode !== 'study' && activeFlipped.length >= 2)) return;

        if (mode === 'study') {
            if (card.classList.contains('flipped')) {
                clearTimeout(card.studyTimer);
                card.classList.remove('flipped');
            } else {
                playSound('snd-flip');
                card.classList.add('flipped');
                card.studyTimer = setTimeout(() => card.classList.remove('flipped'), 3000);
            }
            return;
        }

        if (card.classList.contains('flipped')) return;

        playSound('snd-flip');
        card.classList.add('flipped');
        activeFlipped.push(card);
        
        if (activeFlipped.length === 2) checkMatch();
    }

    function checkMatch() {
        const [a, b] = activeFlipped;
        const isMatch = a.dataset.id === b.dataset.id;

        setTimeout(() => {
            if (isMatch) {
                playSound('snd-match');
                a.classList.add('matched');
                b.classList.add('matched');
                if (mode === 'mem2') scores[currentPlayer - 1]++;
            } else {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                if (mode === 'mem2') currentPlayer = (currentPlayer === 1) ? 2 : 1;
            }
            activeFlipped = [];
            updateUI();
        }, 800);
    }

    function updateUI() {
        document.getElementById('s1').innerText = scores[0];
        document.getElementById('s2').innerText = scores[1];
        document.getElementById('p1-box').classList.toggle('active-p', currentPlayer === 1);
        document.getElementById('p2-box').classList.toggle('active-p', currentPlayer === 2);
    }

    function setMode(m) {
        mode = m; scores = [0, 0]; currentPlayer = 1; activeFlipped = [];
        
        const studyBtn = document.getElementById('btn-study');
        const mainLangBtn = document.getElementById('lang-btn-main');
        const memStartBtn = document.getElementById('btn-memory-start');
        const memControls = document.getElementById('memory-controls');
        const toggle = document.getElementById('mode-toggle');

        if (m === 'study') {
            studyBtn.style.display = 'inline-block';
            studyBtn.classList.add('active');
            mainLangBtn.style.display = 'inline-block';
            memStartBtn.style.display = 'inline-block';
            memControls.style.display = 'none';
        } else {
            studyBtn.style.display = 'none';
            mainLangBtn.style.display = 'none';
            memStartBtn.style.display = 'none';
            memControls.style.display = 'flex';
            if (toggle) toggle.checked = (m === 'mem2');
        }
        init();
    }

    function toggleSwitch(isCheck) {
        const toggle = document.getElementById('mode-toggle');
        toggle.checked = isCheck;
        toggleMemoryMode(toggle);
    }

    function toggleMemoryMode(checkbox) {
        const newMode = checkbox.checked ? 'mem2' : 'mem1';
        setMode(newMode);
    }

    
  window.kelInit = init;
  window.kelSetMode = setMode;
  window.kelToggleLang = toggleLang;
  window.kelToggleSwitch = toggleSwitch;
  window.kelToggleMemoryMode = toggleMemoryMode;
  window.startKelime = function(){ document.getElementById('entry-panel').style.display='none'; var n=document.querySelector('.navbar'); if(n) n.style.display='none'; document.getElementById('kelime-mode').style.display='flex'; setMode('study'); };
  window.kelimeGeri = function(){ document.getElementById('kelime-mode').style.display='none'; document.getElementById('entry-panel').style.display='flex'; };
  document.addEventListener('DOMContentLoaded', function(){ try{ if(new URLSearchParams(location.search).get('mod')==='kelime') window.startKelime(); }catch(e){} });
})();

/* ==== GİRİŞ EKRANI UYARLAMA: verisi olmayan modun butonu gizlenir ====
   (örn. yalnız kelime verisi olan 9. sınıf derslerinde CÜMLE/DİYALOG gizli) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    var d = window.data || {};
    var bos = function (a) { return !a || !a.length; };
    document.querySelectorAll('#entry-panel .mode-btn').forEach(function (b) {
      var oc = b.getAttribute('onclick') || '';
      if (/startMode\('sentence'\)/.test(oc) && bos(d.sentence)) b.style.display = 'none';
      if (/startMode\('dialog'\)/.test(oc) && bos(d.dialog)) b.style.display = 'none';
      if (/startKelime/.test(oc) && bos(d.words)) b.style.display = 'none';
    });
  } catch (e) { }
});
