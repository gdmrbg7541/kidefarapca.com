/* ==================================================================
   SESLİ OKUMA AÇ/KAPA  (şeritteki hoparlör anahtarı)
   ------------------------------------------------------------------
   Cümleler tarayıcının konuşma motoruyla okunuyor; bu motorun sesleri
   çoğu cihazda internetten geliyor. Anahtar kapalıyken hiçbir yerde
   ses üretilmez. Tercih localStorage'da saklanır: ders değişse de,
   sayfa kapanıp açılsa da aynı kalır.
   VARSAYILAN: KAPALI (Geylani: "ses başta kapalı olsun"). Sesi isteyen
   anahtarı açar; o tercih de saklanır, her derste tekrar açmak gerekmez.
   ================================================================== */
var SES_ANAHTARI = 'kidefSesliOkuma';

function sesliOkumaTercihi() {
    try {
        var v = localStorage.getItem(SES_ANAHTARI);
        return (v === null) ? false : (v === '1');   /* kayıt yoksa kapalı */
    } catch (e) { return false; }
}

window.sesliOkumaAcik = sesliOkumaTercihi();   /* ilk seslendirmeden ÖNCE hazır olsun */

function sesliOkumaUygula(acik) {
    window.sesliOkumaAcik = !!acik;
    var kutu = document.getElementById('sesSwitch');
    var tus = document.getElementById('ses-toggle');
    if (tus) tus.checked = !!acik;
    if (kutu) {
        kutu.classList.toggle('ses-kapali', !acik);
        kutu.setAttribute('title', acik ? 'Sesli okuma açık' : 'Sesli okuma kapalı');
    }
    /* Kapatıldığı anda okunmakta olan cümle de sussun */
    if (!acik && window.speechSynthesis) window.speechSynthesis.cancel();
}

function sesliOkumaDegistir() {
    var tus = document.getElementById('ses-toggle');
    var acik = tus ? !!tus.checked : true;
    try { localStorage.setItem(SES_ANAHTARI, acik ? '1' : '0'); } catch (e) { }
    sesliOkumaUygula(acik);
}
window.sesliOkumaDegistir = sesliOkumaDegistir;

(function () {
    function kur() { sesliOkumaUygula(window.sesliOkumaAcik); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();

function speakCurrentSentence() {
    // Mevcut konuşmayı iptal et
    window.speechSynthesis.cancel();
    if (!window.sesliOkumaAcik) return;          /* anahtar kapalı: hiç okuma */

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
    if (!window.sesliOkumaAcik) return;          /* anahtar kapalı: hiç okuma */

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
<div class="mp">
<h2 class="mp-bas">HARFLER VE EKLER <span class="mp-bas-ar" dir="rtl">اَلْحُرُوف</span></h2>
  <section class="mp-blok" style="--mpc:#16A085">
    <h3 class="mp-alt"><span class="mp-no">1</span> Harf-i Cerler<span class="mp-alt-ar" dir="rtl">حُرُوف الْجَرّ</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">فِي</div><div class="mp-tr">...de / içinde</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">عَلَى</div><div class="mp-tr">üzerinde</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">إِلَى</div><div class="mp-tr">...e / ...a</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مِنْ</div><div class="mp-tr">...den / ...dan</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">بِـ</div><div class="mp-tr">ile / ...e</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">لِـ</div><div class="mp-tr">için</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">عَنْ</div><div class="mp-tr">hakkında</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">كَـ</div><div class="mp-tr">gibi</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">حَتَّى</div><div class="mp-tr">...e kadar</div></div>
    </div>
  </section>
  <section class="mp-blok" style="--mpc:#F39C12">
    <h3 class="mp-alt"><span class="mp-no">2</span> Diğer Harfler<span class="mp-alt-ar" dir="rtl">حُرُوف أُخْرَى</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">وَ</div><div class="mp-tr">Ve (Bağlaç)</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">فَـ</div><div class="mp-tr">Hemen sonra</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">سَـ</div><div class="mp-tr">Ecek / Acak</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَ</div><div class="mp-tr">...mı? / ...mi?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مَا</div><div class="mp-tr">Değil (Mazi)</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">لَا</div><div class="mp-tr">Değil (Muzari)</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">قَدْ</div><div class="mp-tr">Kesinlikle</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">لَـ</div><div class="mp-tr">Elbette</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مَعَ</div><div class="mp-tr">İle / Beraber</div></div>
    </div>
  </section>
  <section class="mp-blok" style="--mpc:#EE5253">
    <h3 class="mp-alt"><span class="mp-no">3</span> Çoğul (Cemi)<span class="mp-alt-ar" dir="rtl">اَلْجَمْع</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">ـُونَ</div><div class="mp-tr">Erkek (Özne)</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">ـِينَ</div><div class="mp-tr">Erkek (Nesne)</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">ـَات</div><div class="mp-tr">Kadın</div></div>
    </div>
  </section>
  <section class="mp-blok" style="--mpc:#7C3AED">
    <h3 class="mp-alt"><span class="mp-no">4</span> İkil (Tesniye)<span class="mp-alt-ar" dir="rtl">اَلْمُثَنَّى</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">ـَانِ</div><div class="mp-tr">Özne Hali</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">ـَيْنِ</div><div class="mp-tr">Nesne Hali</div></div>
    </div>
  </section>
</div>`,
          soruedatlari: `
<div class="mp">
<h2 class="mp-bas">EDATLAR VE ZARFLAR <span class="mp-bas-ar" dir="rtl">اَلظُّرُوف</span></h2>
  <section class="mp-blok" style="--mpc:#16A085">
    <h3 class="mp-alt"><span class="mp-no">1</span> Soru Edatları<span class="mp-alt-ar" dir="rtl">أَدَوَات الاِسْتِفْهَام</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مَا / مَاذَا</div><div class="mp-tr">Ne?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مَنْ</div><div class="mp-tr">Kim?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَيْنَ</div><div class="mp-tr">Nerede?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">كَيْفَ</div><div class="mp-tr">Nasıl?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مَتَى</div><div class="mp-tr">Ne zaman?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">لِمَاذَا</div><div class="mp-tr">Niçin?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَيّ / كَمْ</div><div class="mp-tr">Hangi / Kaç?</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مِنْ أَيْنَ</div><div class="mp-tr">Nereden?</div></div>
    </div>
  </section>
  <section class="mp-blok" style="--mpc:#F39C12">
    <h3 class="mp-alt"><span class="mp-no">2</span> Yer Zarfları<span class="mp-alt-ar" dir="rtl">ظُرُوف الْمَكَان</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَمَامَ</div><div class="mp-tr">Önünde</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">خَلْفَ / وَرَاءَ</div><div class="mp-tr">Arkasında</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">فَوْقَ</div><div class="mp-tr">Üstünde</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">تَحْتَ</div><div class="mp-tr">Altında</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">عِنْدَ / جَانِبَ</div><div class="mp-tr">Yanında</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">بَيْنَ</div><div class="mp-tr">Arasında</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">حَوْلَ</div><div class="mp-tr">Etrafında</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">يَمِينَ</div><div class="mp-tr">Sağında</div></div>
    </div>
  </section>
  <section class="mp-blok" style="--mpc:#EE5253">
    <h3 class="mp-alt"><span class="mp-no">3</span> Zaman Zarfları<span class="mp-alt-ar" dir="rtl">ظُرُوف الزَّمَان</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">قَبْلَ / بَعْدَ</div><div class="mp-tr">Önce / Sonra</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">اَلْيَوْمَ / غَدًا</div><div class="mp-tr">Bugün / Yarın</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَمْسِ</div><div class="mp-tr">Dün</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">صَبَاحًا / مَسَاءً</div><div class="mp-tr">Sabah / Akşam</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">حِينَ / أَثْنَاءَ</div><div class="mp-tr">...dığı zaman</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَبَداً</div><div class="mp-tr">Asla / Ebeden</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">لَمَّا</div><div class="mp-tr">Hâlâ / Henüz</div></div>
    </div>
  </section>
  <section class="mp-blok" style="--mpc:#7C3AED">
    <h3 class="mp-alt"><span class="mp-no">4</span> Bağlaçlar / Diğerleri<span class="mp-alt-ar" dir="rtl">حُرُوف الْعَطْف</span></h3>
    <div class="mp-izgara">
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَوْ / أَمْ</div><div class="mp-tr">Veya / Yoksa</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">لِأَنَّ</div><div class="mp-tr">Çünkü</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">إِذَنْ</div><div class="mp-tr">O zaman</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">إِذَا / لَوْ</div><div class="mp-tr">Şayet / Eğer</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">فَقَطْ</div><div class="mp-tr">Sadece</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">مَعاً</div><div class="mp-tr">Birlikte</div></div>
      <div class="mp-kart"><div class="mp-ar" dir="rtl">أَيْضاً</div><div class="mp-tr">Ayrıca</div></div>
    </div>
  </section>
</div>`,
         pronouns: `
<div class="mp">
<h2 class="mp-bas">ZAMİRLER <span class="mp-bas-ar" dir="rtl">اَلضَّمَائِر</span></h2>
  <section class="mp-blok" style="--mpc:#16A085">
    <h3 class="mp-alt"><span class="mp-no">1</span> Munfasıl (Ayrı)<span class="mp-alt-ar" dir="rtl">ضَمِير مُنْفَصِل</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">هُمْ</div><div class="mp-tr">Onlar</div></td><td><div class="mp-ar" dir="rtl">هُمَا</div><div class="mp-tr">O ikisi</div></td><td><div class="mp-ar" dir="rtl">هُوَ</div><div class="mp-tr">O</div></td><td class="mp-etiket">O (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">هُنَّ</div><div class="mp-tr">Onlar</div></td><td><div class="mp-ar" dir="rtl">هُمَا</div><div class="mp-tr">O ikisi</div></td><td><div class="mp-ar" dir="rtl">هِيَ</div><div class="mp-tr">O</div></td><td class="mp-etiket">O (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">أَنْتُمْ</div><div class="mp-tr">Siz</div></td><td><div class="mp-ar" dir="rtl">أَنْتُمَا</div><div class="mp-tr">Siz ikiniz</div></td><td><div class="mp-ar" dir="rtl">أَنْتَ</div><div class="mp-tr">Sen</div></td><td class="mp-etiket">Sen (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">أَنْتُنَّ</div><div class="mp-tr">Siz</div></td><td><div class="mp-ar" dir="rtl">أَنْتُمَا</div><div class="mp-tr">Siz ikiniz</div></td><td><div class="mp-ar" dir="rtl">أَنْتِ</div><div class="mp-tr">Sen</div></td><td class="mp-etiket">Sen (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">نَحْنُ</div><div class="mp-tr">Biz</div></td><td><div class="mp-ar" dir="rtl">نَحْنُ</div><div class="mp-tr">Biz ikimiz</div></td><td><div class="mp-ar" dir="rtl">أَنَا</div><div class="mp-tr">Ben</div></td><td class="mp-etiket">Ben / Biz</td></tr>
      </tbody>
    </table></div>
  </section>
  <section class="mp-blok" style="--mpc:#F39C12">
    <h3 class="mp-alt"><span class="mp-no">2</span> Muttasıl (Bitişik)<span class="mp-alt-ar" dir="rtl">ضَمِير مُتَّصِل</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">ـهُمْ</div><div class="mp-tr">Onları</div></td><td><div class="mp-ar" dir="rtl">ـهُمَا</div><div class="mp-tr">O ikisini</div></td><td><div class="mp-ar" dir="rtl">ـهُ</div><div class="mp-tr">Onu</div></td><td class="mp-etiket">Onu (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـهُنَّ</div><div class="mp-tr">Onları</div></td><td><div class="mp-ar" dir="rtl">ـهُمَا</div><div class="mp-tr">O ikisini</div></td><td><div class="mp-ar" dir="rtl">ـهَا</div><div class="mp-tr">Onu</div></td><td class="mp-etiket">Onu (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـكُمْ</div><div class="mp-tr">Sizi</div></td><td><div class="mp-ar" dir="rtl">ـكُمَا</div><div class="mp-tr">Siz ikinizi</div></td><td><div class="mp-ar" dir="rtl">ـكَ</div><div class="mp-tr">Seni</div></td><td class="mp-etiket">Seni (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـكُنَّ</div><div class="mp-tr">Sizi</div></td><td><div class="mp-ar" dir="rtl">ـكُمَا</div><div class="mp-tr">Siz ikinizi</div></td><td><div class="mp-ar" dir="rtl">ـكِ</div><div class="mp-tr">Seni</div></td><td class="mp-etiket">Seni (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـنَا</div><div class="mp-tr">Bizi</div></td><td><div class="mp-ar" dir="rtl">ـنَا</div><div class="mp-tr">Bizi</div></td><td><div class="mp-ar" dir="rtl">ـي / نِي</div><div class="mp-tr">Beni</div></td><td class="mp-etiket">Beni / Bizi</td></tr>
      </tbody>
    </table></div>
  </section>
  <section class="mp-blok" style="--mpc:#EE5253">
    <h3 class="mp-alt"><span class="mp-no">3</span> İşaret Zamirleri (Bu / Şu-O)<span class="mp-alt-ar" dir="rtl">اِسْم الإِشَارَة</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">هٰؤُلَاءِ / أُولٰئِكَ</div><div class="mp-tr">Bunlar/Şunlar</div></td><td><div class="mp-ar" dir="rtl">هٰذَانِ / ذَانِكَ</div><div class="mp-tr">Bu/O ikisi</div></td><td><div class="mp-ar" dir="rtl">هٰذَا / ذٰلِكَ</div><div class="mp-tr">Bu/O</div></td><td class="mp-etiket">Erkek</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">هٰؤُلَاءِ / أُولٰئِكَ</div><div class="mp-tr">Bunlar/Şunlar</div></td><td><div class="mp-ar" dir="rtl">هٰتَانِ / تَانكَ</div><div class="mp-tr">Bu/O ikisi</div></td><td><div class="mp-ar" dir="rtl">هٰذِهِ / تِلْكَ</div><div class="mp-tr">Bu/O</div></td><td class="mp-etiket">Kadın</td></tr>
      </tbody>
    </table></div>
  </section>
  <section class="mp-blok" style="--mpc:#7C3AED">
    <h3 class="mp-alt"><span class="mp-no">4</span> İsm-i Mevsuller (Ki O)<span class="mp-alt-ar" dir="rtl">اِسْم الْمَوْصُول</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">الَّذِينَ</div><div class="mp-tr">Onlar ki</div></td><td><div class="mp-ar" dir="rtl">الَّذَانِ</div><div class="mp-tr">O ikisi ki</div></td><td><div class="mp-ar" dir="rtl">الَّذِي</div><div class="mp-tr">O ki</div></td><td class="mp-etiket">Erkek</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">اللَّاتِي</div><div class="mp-tr">Onlar ki</div></td><td><div class="mp-ar" dir="rtl">اللَّتَانِ</div><div class="mp-tr">O ikisi ki</div></td><td><div class="mp-ar" dir="rtl">الَّتِي</div><div class="mp-tr">O ki</div></td><td class="mp-etiket">Kadın</td></tr>
      </tbody>
    </table></div>
  </section>
</div>`,
        suffix: `
<div class="mp">
<h2 class="mp-bas">FİİL KİPLERİ <span class="mp-bas-ar" dir="rtl">تَصْرِيف الْفِعْل</span></h2>
  <section class="mp-blok" style="--mpc:#16A085">
    <h3 class="mp-alt"><span class="mp-no">1</span> Mazi Fiil (-dı)<span class="mp-alt-ar" dir="rtl">اَلْمَاضِي</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">ـ ـ ـُوا</div><div class="mp-tr">-dılar</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـَا</div><div class="mp-tr">-dılar/2</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـَ</div><div class="mp-tr">-dı</div></td><td class="mp-etiket">O (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـ ـ ـْنَ</div><div class="mp-tr">-dılar K</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـَتَا</div><div class="mp-tr">-dılar/2 K</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـَتْ</div><div class="mp-tr">-dı K</div></td><td class="mp-etiket">O (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـ ـ ـْتُمْ</div><div class="mp-tr">-dınız</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْتُمَا</div><div class="mp-tr">-dınız/2</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْتَ</div><div class="mp-tr">-dın</div></td><td class="mp-etiket">Sen (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـ ـ ـْتُنَّ</div><div class="mp-tr">-dınız K</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْتُمَا</div><div class="mp-tr">-dınız/2 K</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْتِ</div><div class="mp-tr">-dın K</div></td><td class="mp-etiket">Sen (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـ ـ ـْنَا</div><div class="mp-tr">-dık</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْنَا</div><div class="mp-tr">-dık</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْتُ</div><div class="mp-tr">-dım</div></td><td class="mp-etiket">Ben / Biz</td></tr>
      </tbody>
    </table></div>
  </section>
  <section class="mp-blok" style="--mpc:#F39C12">
    <h3 class="mp-alt"><span class="mp-no">2</span> Muzari Fiil (-yor)<span class="mp-alt-ar" dir="rtl">اَلْمُضَارِع</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">يَـ ـ ـ ـُونَ</div><div class="mp-tr">-yorlar</div></td><td><div class="mp-ar" dir="rtl">يَـ ـ ـ ـَانِ</div><div class="mp-tr">-yorlar/2</div></td><td><div class="mp-ar" dir="rtl">يَـ‫ ـ ـ ‬</div><div class="mp-tr">-yor</div></td><td class="mp-etiket">O (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">يَـ ـ ـ ـْنَ</div><div class="mp-tr">-yorlar K</div></td><td><div class="mp-ar" dir="rtl">تَـ ـ ـ ـَانِ</div><div class="mp-tr">-yorlar/2 K</div></td><td><div class="mp-ar" dir="rtl">تَـ‫ ـ ـ ‬</div><div class="mp-tr">-yor K</div></td><td class="mp-etiket">O (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">تَـ ـ ـ ـُونَ</div><div class="mp-tr">-yorsunuz</div></td><td><div class="mp-ar" dir="rtl">تَـ ـ ـ ـَانِ</div><div class="mp-tr">-yorsunuz/2</div></td><td><div class="mp-ar" dir="rtl">تَـ‫ ـ ـ ‬</div><div class="mp-tr">-yorsun</div></td><td class="mp-etiket">Sen (E)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">تَـ ـ ـ ـْنَ</div><div class="mp-tr">-yorsunuz K</div></td><td><div class="mp-ar" dir="rtl">تَـ ـ ـ ـَانِ</div><div class="mp-tr">-yorsunuz/2 K</div></td><td><div class="mp-ar" dir="rtl">تَـ ـ ـ ـــِــينَ</div><div class="mp-tr">-yorsun K</div></td><td class="mp-etiket">Sen (K)</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">نَـ‫ ـ ـ ‬</div><div class="mp-tr">-yoruz</div></td><td><div class="mp-ar" dir="rtl">نَـ‫ ـ ـ ‬</div><div class="mp-tr">-yoruz</div></td><td><div class="mp-ar" dir="rtl">أَ‫ ـ ـ ‬</div><div class="mp-tr">-yorum</div></td><td class="mp-etiket">Ben / Biz</td></tr>
      </tbody>
    </table></div>
  </section>
  <section class="mp-blok" style="--mpc:#EE5253">
    <h3 class="mp-alt"><span class="mp-no">3</span> Emir Ekleri (! / -sın)<span class="mp-alt-ar" dir="rtl">اَلأَمْر</span></h3>
    <div class="mp-tablo-kutu"><table class="mp-tablo">
      <thead><tr><th>Çoğul</th><th>İkil</th><th>Tekil</th><th class="mp-kose"></th></tr></thead>
      <tbody>
        <tr><td><div class="mp-ar" dir="rtl">ـُوا</div><div class="mp-tr">Yapın!</div></td><td><div class="mp-ar" dir="rtl">ـَا</div><div class="mp-tr">İkiniz yapın!</div></td><td><div class="mp-ar" dir="rtl">ـ ـ ـْ</div><div class="mp-tr">Yap!</div></td><td class="mp-etiket">Erkek</td></tr>
        <tr><td><div class="mp-ar" dir="rtl">ـْنَ</div><div class="mp-tr">Yapın! K</div></td><td><div class="mp-ar" dir="rtl">ـَا</div><div class="mp-tr">İkiniz yapın! K</div></td><td><div class="mp-ar" dir="rtl">ـــِي</div><div class="mp-tr">Yap! K</div></td><td class="mp-etiket">Kadın</td></tr>
      </tbody>
    </table></div>
  </section>
</div>`,

             // Eski halini bununla değiştirin:
tamlamalar: `<iframe src="tamlamalar.pdf#view=Fit&toolbar=1" style="width:100%; height:100%; border:none; display:block;"></iframe>`
    };


   
// 2. SEÇİLİ BUTONU VURGULAMA FONKSİYONU
    /* Eski sürüm global 'event'e bakıyordu; klavyeyle ya da koddan
       açılınca yanlış düğmeyi işaretliyordu. Artık AÇILAN PANELİN
       türüne bakılıyor, vurgu da .aktif sınıfıyla veriliyor. */
    function setActiveButton(type) { window.setActiveButton(type); }

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

    /* Panel şeridin ALTINDAN başlasın: navbar yüksekliği sabit değil
       (punto ve sekme sayısı değişiyor), o yüzden ölçüp yazıyoruz. */
    const nav = document.querySelector('.navbar');
    if (nav) {
        const h = Math.round(nav.getBoundingClientRect().height);
        if (h > 0) document.documentElement.style.setProperty('--nav-yuk', h + 'px');
    }
    if (!show) setActiveButton(null);          /* kapanınca sekme vurgusu sönsün */

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

/* Turuncu başlık şeridi kalktığı için kapatma yolu tek bir küçük
   düğmeye kalmasın: Escape de paneli kapatır.
   NOT: togglePopup paneli SINIFLA değil, style.display ile açıyor;
   açıklık ondan okunur. */
document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var o = document.getElementById('popup-overlay');
    if (o && o.style.display === 'flex') togglePopup(false);
});

function setActiveButton(type) {
    if (type && window.sekmeleriAc) sekmeleriAc(true);   /* panel açıldıysa şerit görünsün */
    var ad = null;
    document.querySelectorAll('.nav-trigger').forEach(function (btn) {
        btn.style.border = '';
        btn.style.boxShadow = '';
        var s2 = !!type && btn.getAttribute('data-panel') === type;
        btn.classList.toggle('aktif', s2);
        if (s2) ad = btn.textContent.replace(/\s+/g, ' ').trim();
    });
    /* (Sekmeler doğrudan şeritte; ayrı bir gösterge düğmesi yok.) */
}

/* ============================================================
   ŞERİT ÖLÇÜSÜ
   Bilgi panelleri şeridin ALTINDAN başlasın diye yükseklik
   ölçülüp --nav-yuk'e yazılır (akordiyon kalktı, ölçüm kaldı).
   ============================================================ */
function kaynakOlcuYaz() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var h = Math.round(nav.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--nav-yuk', h + 'px');
}
function kaynakAc() { /* akordiyon kaldırıldı; eski çağrılar sessizce geçer */ }
window.addEventListener('resize', kaynakOlcuYaz);
window.kaynakAc = kaynakAc;

/* Bilgi sekmeleri başta kapalı; şeritteki ok tuşuyla açılıp kapanır. */
function sekmeleriAc(zorla) {
    var kap = document.getElementById('bilgiSekmeleri');
    var tus = document.getElementById('sekmeAc');
    if (!kap || !tus) return;
    var ac = (typeof zorla === 'boolean') ? zorla : kap.classList.contains('kapali');
    kap.classList.toggle('kapali', !ac);
    tus.setAttribute('aria-expanded', ac ? 'true' : 'false');
    tus.setAttribute('title', ac ? 'Bilgi sekmelerini gizle' : 'Bilgi sekmelerini göster');
    tus.setAttribute('aria-label', tus.getAttribute('title'));
    if (typeof kaynakOlcuYaz === 'function') kaynakOlcuYaz();
}
window.sekmeleriAc = sekmeleriAc;

/* Akordiyondaki çalışma modu düğmeleri */
function modIsaretle(m) {
    document.querySelectorAll('.mod-trigger').forEach(function (b2) {
        b2.classList.toggle('aktif', b2.getAttribute('data-mod') === m);
    });
}
function kaynakMod(m) {
    if (typeof togglePopup === 'function') togglePopup(false);
    if (m === 'kelime') { if (window.startKelime) window.startKelime(); }
    else if (typeof startMode === 'function') startMode(m);
    modIsaretle(m);
}
/* Verisi olmayan mod akordiyonda da gizlenir (giriş ekranındaki kuralın aynısı). */
function modGorunurluk() {
    var d = window.data || {};
    var bos = function (a) { return !a || !a.length; };
    var esle = { kelime: bos(d.words), sentence: bos(d.sentence), dialog: bos(d.dialog) };
    document.querySelectorAll('.mod-trigger').forEach(function (b2) {
        var m = b2.getAttribute('data-mod');
        if (esle[m]) b2.setAttribute('hidden', ''); else b2.removeAttribute('hidden');
    });
}
document.addEventListener('DOMContentLoaded', modGorunurluk);
setTimeout(modGorunurluk, 900);
window.kaynakMod = kaynakMod;
window.modIsaretle = modIsaretle;
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
    document.querySelector('.navbar').style.display = 'flex';
    document.getElementById('sentence-mode').style.display = (m === 'sentence' ? 'flex' : 'none');
    document.getElementById('dialog-mode').style.display = (m === 'dialog' ? 'flex' : 'none');
    var km = document.getElementById('kelime-mode');
    if (km) km.style.display = 'none';         /* kelime kipinden çıkılıyor */
    if (window.modIsaretle) modIsaretle(m);
    render();
}

function goHome() {
    /* Ara seçim ekranı kalktı; şeritteki geri tuşu artık doğrudan
       geldiğimiz listeye/indekse döner. */
    currentIdx = 0;
    if (typeof muhGeri === 'function') { muhGeri(); return; }
    location.href = 'muhadese.html';
}

/* DİL ANAHTARI — .switch-wrapper sayfada İKİ TANE: biri kelime
   kipindeki hafıza oyunu (tek/iki kişilik), biri şeritteki TR/AR.
   querySelector ilkini bulduğu için ateş simgesi yanlış anahtarın
   üstünde çıkıyordu. Artık doğrudan TR/AR anahtarı seçiliyor. */
function dilAnahtari() {
    return document.getElementById('dilSwitch') ||
           document.querySelector('.navbar .switch-wrapper');
}

window.onload = function() {
    const wrapper = dilAnahtari();
    const toggle = document.getElementById('direction-toggle');
    if (wrapper && toggle && !toggle.checked) {
        wrapper.classList.add('fire-mode');
    }
};

function toggleDirection() {
    const toggle = document.getElementById('direction-toggle');
    const wrapper = dilAnahtari();
    const langTr = document.getElementById('lang-tr');
    const langAr = document.getElementById('lang-ar');

    document.querySelectorAll('.switch-wrapper.fire-mode').forEach(function (w) {
        if (w !== wrapper) w.classList.remove('fire-mode');   /* yanlış anahtarda kalmasın */
    });
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
        /* SARF KÖPRÜSÜ: kelimenin kökü ve türü span'a işlenir. Tıklanınca
           sol alttaki tür şeridinde o tür yanar, oradan kalıplar tablosuna
           geçilir (bkz. muhadese/sarfkopru.js). Kelimenin üstüne hiçbir şey
           eklenmez — cümle temiz kalır. Kök her zaman kelimenin
           ARAPÇASINDAN bulunur; yön ne olursa olsun aynı kelimeyi gösterir. */
        if (window.KidefSarf && w.ar) window.KidefSarf.kelimeIsaretle(span, w.ar);

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
  /* ============================================================
     KELİMELER — iki kip
       liste : bütün kelimeler tek ekranda (hızlı gözden geçirme)
       study : kartlar; basınca çevrilir, 3 sn sonra kendiliğinden kapanır
     Hafıza oyunu (eşleştirme, skor, iki kişilik) kaldırıldı.
     ============================================================ */
  var allWords = [];

    /* Kart yuzu renkleri: site paletinden. */
    const cardColors = ["#16A085", "#3498DB", "#F39C12", "#EF5350", "#7C3AED", "#27AE60", "#E67E22", "#20C997"];
    let mode = 'liste', isAr = true, sutun = 3;   /* sutun: listenin sütun sayısı (1|2|3) */
    let sutunElle = false;                        /* kullanıcı seçtiyse otomatik ayar susar */

    function playSound(id) {
        const s = document.getElementById(id);
        if (!s) return;
        s.volume = 0.15; s.currentTime = 0;
        s.play().catch(() => {});
    }

    function toggleLang() {
        isAr = !isAr;
        init();
    }

    function init() {
        allWords = (window.data && window.data.words) || [];
        const liste = document.getElementById('kel-liste');
        const grid  = document.getElementById('grid');
        const sayi  = document.getElementById('kelSayi');
        if (!liste || !grid) return;

        if (sayi) sayi.textContent = allWords.length ? allWords.length + ' kelime' : '';

        if (mode === 'liste') { grid.style.display = 'none'; liste.style.display = 'block'; listeCiz(liste); }
        else { liste.style.display = 'none'; grid.style.display = 'grid'; kartCiz(grid); }
    }

    /* ---------- LİSTE: hızlı gözden geçirme ---------- */
    function listeCiz(kap) {
        if (!allWords.length) { kap.innerHTML = '<p class="kel-bos">Bu derste kelime listesi yok.</p>'; return; }
        /* Çizgili defter yaprağı: .kl-defter zemindeki çizgileri taşır,
           satırlar saydam durur. Sıra soldan sağa: numara · TÜRKÇE ·
           noktalı bağ · ARAPÇA. Arapça en sağda duruyor, böylece göz
           sağ sütunda tek hizada aşağı iniyor. */
        kap.innerHTML = '<div class="kl-defter sutun-' + sutun + '"><ol class="kl-izgara">' + allWords.map(function (w, i) {
            return '<li class="kl-satir">' +
                     '<span class="kl-no">' + (i + 1) + '</span>' +
                     '<span class="kl-tr">' + (w.tr || '') + '</span>' +
                     '<i class="kl-nokta" aria-hidden="true"></i>' +
                     '<span class="kl-ar" dir="rtl">' + (w.ar || '') + '</span>' +
                   '</li>';
        }).join('') + '</ol></div>';
        otoSutun(kap);
    }

    /* ---------- KARTLAR: kendini deneme ---------- */
    function kartCiz(grid) {
        grid.innerHTML = '';
        grid.className = 'grid';
        grid.style.height = 'auto';
        grid.style.gridTemplateColumns = '';
        grid.style.gridAutoRows = '';
        grid.style.gridTemplateRows = '';
        if (!allWords.length) { grid.innerHTML = '<p class="kel-bos">Bu derste kelime listesi yok.</p>'; return; }
        grid.setAttribute('data-total', allWords.length);

        const baseFontSize = "clamp(1.2rem, 2.3vw, 2.2rem)";
        const arabicFontSize = "clamp(1.5rem, 4.5vw, 3.5rem)";

        allWords.forEach(function (item, index) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = item.ar;

            const frontText = isAr ? item.ar : item.tr;
            const backText  = isAr ? item.tr : item.ar;
            const frontLangClass = isAr ? 'lang-ar' : 'lang-tr';
            const backLangClass  = isAr ? 'lang-tr' : 'lang-ar';
            const color = cardColors[index % cardColors.length];

            /* Arapça yüz rtl olmalı: kelime listesindeki girdilerin beşte biri
               tek kelime değil ("في المَصْنَع." gibi). LTR'de sıralama ve
               özellikle sondaki nokta yanlış tarafa düşüyordu. */
            const frontDir = isAr ? 'rtl' : 'ltr';
            const backDir  = isAr ? 'ltr' : 'rtl';

            card.innerHTML =
                '<div class="card-inner">' +
                  '<div class="card-face card-front ' + frontLangClass + '" dir="' + frontDir +
                    '" style="background-color:' + color +
                    '; font-size:' + (isAr ? arabicFontSize : baseFontSize) + '"><span>' + frontText + '</span></div>' +
                  '<div class="card-face card-back ' + backLangClass + '" dir="' + backDir +
                    '" style="font-size:' + (isAr ? baseFontSize : arabicFontSize) + '"><span>' + backText + '</span></div>' +
                '</div>';

            card.onclick = function () { handleFlip(card); };
            grid.appendChild(card);
        });
    }

    function handleFlip(card) {
        if (card.classList.contains('flipped')) {
            clearTimeout(card.studyTimer);
            card.classList.remove('flipped');
            return;
        }
        playSound('snd-flip');
        card.classList.add('flipped');
        card.studyTimer = setTimeout(function () { card.classList.remove('flipped'); }, 3000);
    }

    function setMode(m) {
        mode = (m === 'study') ? 'study' : 'liste';
        const lt = document.getElementById('btn-liste');
        const st = document.getElementById('btn-study');
        const yon = document.getElementById('lang-btn-main');
        const sut = document.getElementById('kelSutun');
        if (lt) { lt.classList.toggle('aktif', mode === 'liste'); lt.setAttribute('aria-selected', mode === 'liste'); }
        if (st) { st.classList.toggle('aktif', mode === 'study'); st.setAttribute('aria-selected', mode === 'study'); }
        /* Ön yüz seçimi yalnız kart kipinde anlamlı; listede iki dil de görünüyor. */
        if (yon) yon.style.display = (mode === 'study') ? 'inline-flex' : 'none';
        /* Sütun seçici de tersi: yalnız liste kipinde. */
        if (sut) sut.style.display = (mode === 'liste') ? 'inline-flex' : 'none';
        init();
    }

    /* Sütun sayısı yalnız bir sınıf değiştiriyor (.sutun-1/2/3); asıl
       ölçüler CSS'te, çünkü satır yüksekliği ile defter çizgisinin adımı
       aynı değişkenden beslenmek zorunda. Tek sütunda yazılar büyüyor. */
    function setSutun(n) {
        sutunElle = true;                 /* bundan sonra otomatik ayar susar */
        sutun = (n === 1 || n === 2) ? n : 3;
        isaretle();
        const d = document.querySelector('.kl-defter');
        if (d) d.className = 'kl-defter sutun-' + sutun;
    }

    /* Sütun sayısını İÇERİĞE göre seç.
       Kelime listelerinde üç sütun rahat; ama kalıp başlıklarında satırlar
       öbek ya da cümle olabiliyor ve üç sütunda karşılık kırpılıyor.
       Bir satırın ihtiyacı olan gerçek genişlik ölçülüp kaç sütun sığdığı
       hesaplanıyor. Kullanıcı seçici ile bir şey seçtiyse buraya girilmez. */
    function otoSutun(kap) {
        if (sutunElle) return;
        const d = kap.querySelector('.kl-defter');
        const satirlar = [].slice.call(kap.querySelectorAll('.kl-satir'));
        if (!d || !satirlar.length) return;
        let enGenis = 0;
        satirlar.forEach(function (r) {
            const no = r.querySelector('.kl-no'), tr = r.querySelector('.kl-tr'), ar = r.querySelector('.kl-ar');
            if (!no || !tr || !ar) return;
            /* tr.scrollWidth = kırpılmamış hâlinin gerçek genişliği */
            const g = no.offsetWidth + tr.scrollWidth + ar.offsetWidth + 78;
            if (g > enGenis) enGenis = g;
        });
        const alan = d.clientWidth - 32;
        let n = Math.floor((alan + 30) / (enGenis + 30));
        n = Math.max(1, Math.min(3, n));
        if (n !== sutun) { sutun = n; isaretle(); d.className = 'kl-defter sutun-' + sutun; }
    }

    function isaretle() {
        [].forEach.call(document.querySelectorAll('.kel-sutun-t'), function (b) {
            const secili = Number(b.dataset.sutun) === sutun;
            b.classList.toggle('aktif', secili);
            b.setAttribute('aria-pressed', secili ? 'true' : 'false');
        });
    }

  window.kelInit = init;
  window.kelSetMode = setMode;
  window.kelSetSutun = setSutun;
  window.kelToggleLang = toggleLang;
  window.startKelime = function(){
    /* Ara seçim ekranı yok; şerit hep açık kalır. */
    var n = document.querySelector('.navbar'); if (n) n.style.display = 'flex';
    var sm = document.getElementById('sentence-mode'); if (sm) sm.style.display = 'none';
    var dm = document.getElementById('dialog-mode');   if (dm) dm.style.display = 'none';
    document.getElementById('kelime-mode').style.display = 'flex';
    setMode('liste');            /* varsayılan: hızlı gözden geçirme */
    if (window.modIsaretle) modIsaretle('kelime');
  };
  /* kelimeGeri kaldırıldı: dönülecek ara ekran yok. Eski çağrılar için
     zararsız bir karşılık bırakıldı — şeritteki geri tuşuna yönlenir. */
  window.kelimeGeri = function(){ if (typeof goHome === 'function') goHome(); };
  /* Ders açılınca ara seçim ekranı (KELİMELER / CÜMLE / DİYALOG)
     gösterilmez: modlar zaten şeritte duruyor. Doğrudan KELİMELER
     kipi başlar; o dersin kelime verisi yoksa sırayla cümle, sonra
     diyalog denenir. */
  function ilkKipiAc() {
    try {
      var d2 = window.data || {};
      var dolu = function (a) { return !!(a && a.length); };
      if (dolu(d2.words)) { window.startKelime(); return; }
      if (dolu(d2.sentence)) { startMode('sentence'); return; }
      if (dolu(d2.dialog)) { startMode('dialog'); return; }
    } catch (e) {}
  }
  window.ilkKipiAc = ilkKipiAc;
  document.addEventListener('DOMContentLoaded', function(){
    try {
      if (!window.KIDEF_DERS) return;                 /* liste kipinde dokunma */
      setTimeout(ilkKipiAc, 60);                      /* veri yüklensin */
    } catch(e){}
  });
})();

/* Giriş ekranı kaldırıldı; verisi olmayan modun ŞERİTTEKİ simgesi
   modGorunurluk() ile gizleniyor (aşağıda). */

