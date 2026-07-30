// --- SESLENDİRME VE GTM STATE DEĞİŞKENLERİ ---
var completionStatus = { sentence: {}, dialog: {} };
var progressMemory = { sentence: {}, dialog: {} };  

function speakCurrentSentence() {
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
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
}


// --- 🔑 ORTAK KALIPLAR TABLOSU ŞABLONU ---
const generateKalipTablosuHTML = () => {
    return `
    <div id="kalip-container-main" style="width:100%; direction:rtl; text-align:right;">
        <div class="tabs">
            <div id="root-display-box">
                <div style="flex: 1; display: flex; gap: 15px; justify-content: center; align-items: center; border-left: 1px solid rgba(0,0,0,0.1);">
                    <i class="fas fa-sync-alt root-icon" onclick="resetTableOnly()"></i>
                    <i class="fas fa-pen root-icon" onclick="openKeyboard()"></i>
                </div>
                <span id="root-text-display">KÖK GİR</span>
            </div>    
            <button id="tab-btn-0" class="tab-btn active" onclick="openTab(event, 0)">SÜLÂSİ MÜCERRED  3</button>
            <button id="tab-btn-1" class="tab-btn" onclick="openTab(event, 1)">+SÜLÂSİ MEZİD 3  </button>
        </div>

        <div class="window-pencere">
            <div id="mainSliderBandi" class="slider-bandi">
                
                <div id="tab1" class="tab-content">
                    <div class="container">
                        <table>
                            <thead>
                                <tr>
                                    <th width="80px">BÂBLAR</th>
                                    <th>MAZİ</th>
                                    <th>MUZARI</th>
                                    <th>EMİR</th>
                                    <th width="280px">MASTAR</th>
                                    <th>İSMİFÂİL</th>
                                    <th>İSİ MEF'ÛL</th>
                                    <th>ZAMAN MEKÂN</th>
                                    <th>İSMİ ÂLET</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td align="center">Birinci Bâb</td>
                                    <td><div class="glass-box"><span class="ref">1</span><span class="ar">فَعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">2</span><span class="ar">يَفْعُلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">3</span><span class="ar">أُفْعُلْ</span></div></td>
                                    <td rowspan="6" valign="top">
                                        <div class="mastar-grid">
                                            <div class="glass-box"><span class="ref">17</span><span class="ar-small">فَعَل</span></div>
                                            <div class="glass-box"><span class="ref">18</span><span class="ar-small">فَعِل</span></div>
                                            <div class="glass-box"><span class="ref">19</span><span class="ar-small">فَعْل</span></div>
                                            <div class="glass-box"><span class="ref">20</span><span class="ar-small">فِعْل</span></div>
                                            <div class="glass-box"><span class="ref">21</span><span class="ar-small">فُعْل</span></div>
                                            <div class="glass-box"><span class="ref">22</span><span class="ar-small">فَعَال</span></div>
                                            <div class="glass-box"><span class="ref">23</span><span class="ar-small">فِعَال</span></div>
                                            <div class="glass-box"><span class="ref">24</span><span class="ar-small">فُعَال</span></div>
                                            <div class="glass-box"><span class="ref">25</span><span class="ar-small">فُعُول</span></div>
                                            <div class="glass-box"><span class="ref">26</span><span class="ar-small">فَعُول</span></div>
                                            <div class="glass-box"><span class="ref">27</span><span class="ar-small">فُعْلَان</span></div>
                                            <div class="glass-box"><span class="ref">28</span><span class="ar-small">فَعْلَان</span></div>
                                            <div class="glass-box"><span class="ref">29</span><span class="ar-small">فِعْلَان</span></div>
                                            <div class="glass-box"><span class="ref">30</span><span class="ar-small">أَفْعَل</span></div>
                                            <div class="glass-box"><span class="ref">31</span><span class="ar-small">فَعْلَاء</span></div>
                                            <div class="glass-box"><span class="ref">32</span><span class="ar-small">فَعْلَى</span></div>
                                        </div>
                                    </td>
                                    <td rowspan="6">
                                        <div style="display: flex; flex-direction: column; gap: 5px; align-items: center; justify-content: center;">
                                            <div class="glass-box"><span class="ref">33</span><span class="ar">فَاعِل</span></div>
                                            <div class="glass-box"><span class="ref">34</span><span class="ar">فَعَّال</span></div>
                                            <div class="glass-box"><span class="ref">35</span><span class="ar">فَعِيل</span></div>
                                        </div>
                                    </td>
                                    <td rowspan="6"><div class="glass-box"><span class="ref">36</span><span class="ar">مَفْعُول</span></div></td>
                                    <td rowspan="3"><div class="glass-box"><span class="ref">37</span><span class="ar">مَفْعِل</span></div></td>
                                    <td rowspan="3"><div class="glass-box"><span class="ref">39</span><span class="ar">مِفْعَل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">İkinci Bâb</td>
                                    <td><div class="glass-box"><span class="ref">1</span><span class="ar">فَعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">4</span><span class="ar">يَفْعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">5</span><span class="ar">اِفْعِلْ</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Üçüncü Bâb</td>
                                    <td><div class="glass-box"><span class="ref">1</span><span class="ar">فَعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">6</span><span class="ar">يَفْعَلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">7</span><span class="ar">اِفْعَلْ</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Dördüncü Bâb</td>
                                    <td><div class="glass-box"><span class="ref">8</span><span class="ar">فَعِلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">9</span><span class="ar">يَفْعَلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">10</span><span class="ar">اِفْعَلْ</span></div></td>
                                    <td rowspan="3"><div class="glass-box"><span class="ref">38</span><span class="ar">مَفْعَل</span></div></td>
                                    <td rowspan="3"><div class="glass-box"><span class="ref">40</span><span class="ar">مِفْعَال</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Beşinci Bâb</td>
                                    <td><div class="glass-box"><span class="ref">11</span><span class="ar">فَعُلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">12</span><span class="ar">يَفْعُلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">13</span><span class="ar">أُفْعُلْ</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Altıncı Bâb</td>
                                    <td><div class="glass-box"><span class="ref">14</span><span class="ar">فَعِلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">15</span><span class="ar">يَفْعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">16</span><span class="ar">اِفْعِلْ</span></div></td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="footer-container">
                            <div class="footer-block cemi-area">
                                <div class="block-title">CEMİ TEKSİR</div>
                                <div class="cemi-grid">
                                    <div class="glass-box"><span class="ref">41</span><span class="ar-small">أَفْعَال</span></div>
                                    <div class="glass-box"><span class="ref">42</span><span class="ar-small">فُعُل</span></div>
                                    <div class="glass-box"><span class="ref">43</span><span class="ar-small">فُعُول</span></div>
                                    <div class="glass-box"><span class="ref">44</span><span class="ar-small">فِعَال</span></div>
                                    <div class="glass-box"><span class="ref">45</span><span class="ar-small">فُعَّال</span></div>
                                    <div class="glass-box"><span class="ref">46</span><span class="ar-small">فُعَلَاء</span></div>
                                    <div class="glass-box"><span class="ref">47</span><span class="ar-small">فَعَلَة</span></div>
                                    <div class="glass-box"><span class="ref">48</span><span class="ar-small">فَعَائِل</span></div>
                                </div>
                            </div>
                            <div class="footer-block tafdil-area">
                                <div class="block-title">İSMİ TAFDİL</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                                    <div class="glass-box"><span class="ref">50</span><span class="ar-small">أَفْعَل</span></div>
                                    <div class="glass-box"><span class="ref">51</span><span class="ar-small">فُعْلَى</span></div>
                                </div>
                            </div>
                            <div class="footer-block tasgir-area">
                                <div class="block-title">İSMİ TASĞİR</div>
                                <div class="glass-box"><span class="ref">49</span><span class="ar-small">فُعَيْل</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="tab2" class="tab-content">
                    <div class="container">
                        <table>
                            <thead>
                                <tr>
                                    <th width="100px">3+</th>
                                    <th>MAZİ</th><th>MUZARI</th><th>EMİR</th>
                                    <th>MASTAR</th><th>İSMİ FÂİL</th><th>İSMİ MEF'ÛL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td align="center">İf'al</td>
                                    <td><div class="glass-box"><span class="ref">52</span><span class="ar">أَفْعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">53</span><span class="ar">يُفْعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">54</span><span class="ar">أَفْعِلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">55</span><span class="ar">إِفْعَال</span></div></td>
                                    <td><div class="glass-box"><span class="ref">56</span><span class="ar">مُفْعِل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">57</span><span class="ar">مُفْعَل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Tef'il</td>
                                    <td><div class="glass-box"><span class="ref">58</span><span class="ar">فَعَّلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">59</span><span class="ar">يُفَعِّلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">60</span><span class="ar">فَعِّلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">61</span><span class="ar">تَفْعِيل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">62</span><span class="ar">مُفَعِّل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">63</span><span class="ar">مُفَعَّل</span></div></td>
                                </tr>
                               <tr>
                                    <td align="center">Müfa'ale</td>
                                    <td><div class="glass-box"><span class="ref">64</span><span class="ar">فَاعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">65</span><span class="ar">يُفَاعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">66</span><span class="ar">فَاعِلْ</span></div></td>
                                    <td>
                                        <div style="display: flex; flex-direction: row; gap: 6px; align-items: center; justify-content: center;">
                                            <div class="glass-box"><span class="ref">67</span><span class="ar">مُفَاعَلَة</span></div>
                                            <div class="glass-box"><span class="ref">68</span><span class="ar">فِعَال</span></div>
                                        </div>
                                    </td>
                                    <td><div class="glass-box"><span class="ref">69</span><span class="ar">مُفَاعِل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">70</span><span class="ar">مُفَاعَل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">İnfi'âl</td>
                                    <td><div class="glass-box"><span class="ref">71</span><span class="ar">انْفَعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">72</span><span class="ar">يَنْفَعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">73</span><span class="ar">انْفَعِلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">74</span><span class="ar">انْفِعَال</span></div></td>
                                    <td><div class="glass-box"><span class="ref">75</span><span class="ar">مُنْفَعِل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">76</span><span class="ar">مُنْفَعَل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">İfti'âl</td>
                                    <td><div class="glass-box"><span class="ref">77</span><span class="ar">افْتَعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">78</span><span class="ar">يَفْتَعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">79</span><span class="ar">افْتَعِلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">80</span><span class="ar">افْتِعَال</span></div></td>
                                    <td><div class="glass-box"><span class="ref">81</span><span class="ar">مُفْتَعِل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">82</span><span class="ar">مُفْتَعَل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">İf'ilâl</td>
                                    <td><div class="glass-box"><span class="ref">83</span><span class="ar">افْعَلَّ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">84</span><span class="ar">يَفْعَلُّ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">85</span><span class="ar">افْعَلِلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">86</span><span class="ar">افْعِلَال</span></div></td>
                                    <td><div class="glass-box"><span class="ref">87</span><span class="ar">مُفْعَلّ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">x</span><span class="ar">-</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Tefe''ul</td>
                                    <td><div class="glass-box"><span class="ref">88</span><span class="ar">تَفَعَّلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">89</span><span class="ar">يَتَفَعَّلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">90</span><span class="ar">تَفَعَّلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">91</span><span class="ar">تَفَعُّل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">92</span><span class="ar">مُتَفَعِّل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">93</span><span class="ar">مُتَفَعَّل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">Tefâ'ul</td>
                                    <td><div class="glass-box"><span class="ref">94</span><span class="ar">تَفَاعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">95</span><span class="ar">يَتَفَاعَلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">96</span><span class="ar">تَفَاعَلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">97</span><span class="ar">تَفَاعُل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">98</span><span class="ar">مُتَفَاعِل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">99</span><span class="ar">مُتَفَاعَل</span></div></td>
                                </tr>
                                <tr>
                                    <td align="center">İstif'âl</td>
                                    <td><div class="glass-box"><span class="ref">100</span><span class="ar">اسْتَفْعَلَ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">101</span><span class="ar">يَسْتَفْعِلُ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">102</span><span class="ar">اسْتَفْعِلْ</span></div></td>
                                    <td><div class="glass-box"><span class="ref">103</span><span class="ar">اسْتِفْعَال</span></div></td>
                                    <td><div class="glass-box"><span class="ref">104</span><span class="ar">مُسْتَفْعِل</span></div></td>
                                    <td><div class="glass-box"><span class="ref">105</span><span class="ar">مُسْتَفْعَل</span></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>`;
};

// POPUP İÇERİKLERİ
const popupData = {
    
       prepositions: `
<div style="width:100%; max-height: 60vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
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
<div style="width:100%; max-height: 60vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
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
`,
       pronouns: `
<div style="width:100%; max-height: 60vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
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
            <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">هُnuَّ</span><br><small>(Onlar)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">هُمَا</span><br><small>(O ikisi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">هِيَ</span><br><small>(O)</small></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتُمْ</span><br><small>(Siz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">أَنْتُمَا</span><br><small>(Siz ikiniz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتَ</span><br><small>(Sen)</small></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتُنَّ</span><br><small>(Siz)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">أَنْتُمَا</span><br><small>(Siz ikiniz)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">أَنْتِ</span><br><small>(Sen)</small></td></tr>
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
            <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـهُنَّ</span><br><small>(Onları)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـهُمَا</span><br><small>(O ikisini)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـهَا</span><br><small>(Onu)</small></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـكُمْ</span><br><small>(Sizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـكُمَا</span><br><small>(Siz ikinizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـكَ</span><br><small>(Seni)</small></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td><span class="ar-txt" style="font-size:2.2rem;">ـكُنَّ</span><br><small>(Sizi)</small></td><td><span class="ar-txt" style="font-size:1.8rem;">ـكُمَا</span><br><small>(Siz ikinizi)</small></td><td><span class="ar-txt" style="font-size:2.2rem;">ـكِ</span><br><small>(Seni)</small></td></tr>
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
        <td><span class="ar-txt" style="font-size:2.2rem;">هٰتَانِ / تَانِكَ</span><br><small>(Bu/O ikisi)</small></td>
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
        <td><span class="ar-txt" style="font-size:2.2rem;">الَّذِينَ</span><br><small>(Onlar ki)</small></td>
        <td><span class="ar-txt" style="font-size:2.2rem;">الَّذَانِ</span><br><small>(O ikisi ki)</small></td>
        <td><span class="ar-txt" style="font-size:2.2rem;">الَّذِي</span><br><small>(O ki)</small></td>
    </tr>
    <tr style="border-bottom: 1px solid #eee;">
        <td><span class="ar-txt" style="font-size:2.2rem;">اللَّاتِي</span><br><small>(Onlar ki)</small></td>
        <td><span class="ar-txt" style="font-size:2.2rem;">اللَّتَانِ</span><br><small>(O ikisi ki)</small></td>
        <td><span class="ar-txt" style="font-size:2.2rem;">الَّتِي</span><br><small>(O ki)</small></td>
    </tr>
</table>
<div style="height: 60px;"></div>
</div>`,
    suffix: `
<div style="width:100%; max-height: 60vh; overflow-y: auto; padding: 10px 20px 40px 10px;">
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
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْنَا</span><br><small>(-dık)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمَا</span><br><small>(-dınız/2 K)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتِ</span><br><small>(-dın K)</small></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee; height: 75px;">
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمْ</span><br><small>(-dınız)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُمَا</span><br><small>(-dınız/2)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتَ</span><br><small>(-dın)</small></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee; height: 75px;">
                <td><span class="ar-txt" style="font-size:2.2rem;"> ـ ـ ـْتُنَّ</span><br><small>(-dınız K)</small></td>
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
                <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ </span><br><small>(-yor)</small></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee; height: 75px;">
                <td><span class="ar-txt" style="font-size:2.2rem;">يَـ ـ ـ ـْنَ</span><br><small>(-yorlar K)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorlar/2 K)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ </span><br><small>(-yor K)</small></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee; height: 75px;">
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـُونَ</span><br><small>(-yorsunuz)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorsunuz/2)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ </span><br><small>(-yorsun)</small></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee; height: 75px;">
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـْنَ</span><br><small>(-yorsunuz K)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـَانِ</span><br><small>(-yorsunuz/2 K)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">تَـ ـ ـ ـــِــينَ</span><br><small>(-yorsun K)</small></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee; height: 75px;">
                <td><span class="ar-txt" style="font-size:2.2rem;">نَـ ـ ـ </span><br><small>(-yoruz)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">نَـ ـ ـ </span><br><small>(-yoruz)</small></td>
                <td><span class="ar-txt" style="font-size:2.2rem;">أَ ـ ـ </span><br><small>(-yorum)</small></td>
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

tamlamalar: `<iframe src="tamlamalar.pdf#view=Fit&toolbar=1" style="width:100%; height:100%; border:none; display:block;"></iframe>`,
sulasi: generateKalipTablosuHTML(),
mezid: `<iframe src="kaliplartablosu.html" style="width:100%; height:100%; min-height: 65vh; border:none; display:block; border-radius: 8px;"></iframe>`
};

function setActiveButton(type) {
    const buttons = document.querySelectorAll('.nav-trigger');
    buttons.forEach(btn => {
        btn.style.border = "none";
        btn.style.boxShadow = "none";
    });

    const activeBtn = event.currentTarget;
    activeBtn.style.border = "2px solid white";
    activeBtn.style.boxShadow = "0 0 10px rgba(255,255,255,0.5)";
}

function showPopup(type) {
    const overlay = document.getElementById('popup-overlay');
    const content = document.getElementById('popup-content');
    const title = document.getElementById('popup-title');
    
    const titles = {
        prepositions: "Harfler",
        soruedatlari: "Edatlar & Zarflar",
        pronouns: "Zamirler",
        suffix: "Fiil Kipleri",
        tamlamalar: "Tamlamalar",
        mezid: "Sülasi Mücerred ve Mezid Fiiller (+3)"
    };
    
    title.innerText = titles[type] || "Bilgi Paneli";
    content.innerHTML = popupData[type] || "<p>İçerik bulunamadı.</p>";
    
    if (type === 'sulasi') {
        document.querySelectorAll('#kalip-container-main .glass-box').forEach((box) => {
            const textEl = box.querySelector('.ar, .ar-small');
            if (textEl) {
                if (!textEl.hasAttribute('data-original')) {
                    textEl.setAttribute('data-original', textEl.innerText);
                }
                box.style.cursor = "pointer";
                box.onclick = function() { applyToSpecificBox(this); };
            }
        });

        const targetBtn = document.getElementById(`tab-btn-0`);
        if (targetBtn) {
            setTimeout(() => {
                targetBtn.click();
            }, 50);
        }
    }
    
    overlay.style.display = 'flex';
    
    document.querySelector('.controls')?.classList.add('controls-hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.add('force-hide'));
}

function togglePopup(show) {
    const overlay = document.getElementById('popup-overlay');
    const controls = document.querySelector('.controls');
    
    overlay.style.display = show ? 'flex' : 'none';
    
    if (controls) {
        if (show) {
            controls.classList.add('controls-hidden');
        } else {
            controls.classList.remove('controls-hidden');
        }
    }
    
    if (!show) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('force-hide'));
        document.querySelectorAll('.nav-trigger').forEach(btn => {
            btn.style.border = "none";
            btn.style.boxShadow = "none";
        });
    }
}

function closePopup(e) { 
    if (e.target.id === 'popup-overlay') {
        togglePopup(false); 
    }
}

const letters = "ا ب ت ث ج ح kh د ذ ر ز س ş ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" ");
let currentRoot = ""; 

const arabicKeyMap = {
    '"': 'ذ', 'q':'ض', 'w':'ص', 'e':'ث', 'r':'ق', 't':'ف', 'y':'غ', 'u':'ع', 'ı':'ه', 'o':'خ', 'p':'ح', 'ğ':'ج', 'ü':'د',
    'a':'ش', 's':'س', 'd':'ي', 'f':'ب', 'g':'ل', 'h':'ا', 'j':'ت', 'k':'ن', 'l':'م', 'ş':'ك', 'i':'ط',
    'z':'ئ', 'x':'ء', 'c':'ؤ', 'v':'ر', 'b':'لا', 'n':'ى', 'm':'ة', 'ö':'ز', 'ç':'ظ'
};

let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50; 
let currentTabActive = 0;    

const SoundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playClick() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },
    playClose() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    playReset() {
        this.init();
        const now = this.ctx.currentTime;
        [440, 880].forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (index * 0.04));
            osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.15 + (index * 0.04));
            gain.gain.setValueAtTime(0.08, now + (index * 0.04));
            gain.gain.linearRampToValueAtTime(0.001, now + 0.18 + (index * 0.04));
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + (index * 0.04));
            osc.stop(now + 0.18 + (index * 0.04));
        });
    }
};

function handleSwipeGesture() {
    const distance = touchStartX - touchEndX;
    const buttons = document.querySelectorAll("#kalip-container-main .tab-btn");
    if (distance > minSwipeDistance && currentTabActive === 1) {
        currentTabActive = 0;
        if(buttons[0]) buttons[0].click();
    } else if (distance < -minSwipeDistance && currentTabActive === 0) {
        currentTabActive = 1;
        if(buttons[1]) buttons[1].click();
    }
}

function openTab(evt, tabIndex) {
    SoundEngine.playClick(); 
    const band = document.getElementById('mainSliderBandi');
    const buttons = document.querySelectorAll("#kalip-container-main .tab-btn");

    currentTabActive = tabIndex;
    buttons.forEach(btn => btn.classList.remove("active"));
    evt.currentTarget.classList.add("active");

    if (tabIndex === 1) {
        band.style.transform = "translateX(50%)"; 
    } else {
        band.style.transform = "translateX(0%)";  
    }
}

function toggleKB(show) {
    const overlay = document.getElementById('keyboard-overlay');
    const tempDisplay = document.getElementById('temp-root-display');
    if (show) {
        currentRoot = ""; 
        if (tempDisplay) tempDisplay.innerText = "";
    }
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

function openKeyboard() {
    SoundEngine.playClick(); 
    resetTableOnly(true);    
    toggleKB(true);
}

function closeKeyboard() {
    SoundEngine.playClose(); 
    toggleKB(false);
}

function addLetter(char) {
    if (currentRoot.length < 3) {
        SoundEngine.playClick(); 
        currentRoot += char;
        updateTempDisplay();
        highlightKey(char);
        if (currentRoot.length === 3) {
            setTimeout(() => { confirmRoot(); }, 300);
        }
    }
}

function handleBackspace() {
    SoundEngine.playClose(); 
    if (currentRoot.length > 0) {
        currentRoot = currentRoot.slice(0, -1);
        updateTempDisplay();
    }
}

function updateTempDisplay() {
    const display = document.getElementById('temp-root-display');
    if (display) {
        display.innerText = currentRoot.trim(); 
        display.style.direction = "rtl";
    }
}

function highlightKey(char) {
    const keys = document.querySelectorAll('.key');
    keys.forEach(k => {
        if (k.innerText.trim() === char) {
            k.classList.add('active-key');
            setTimeout(() => k.classList.remove('active-key'), 150);
        }
    });
}

function confirmRoot() {
    if (currentRoot.length === 3) {
        SoundEngine.playReset(); 
        const rootTextSpan = document.getElementById('root-text-display');
        if (rootTextSpan) {
            rootTextSpan.innerText = currentRoot;
        }
        toggleKB(false);
    }
}

document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('keyboard-overlay');
    if (!overlay || overlay.style.display === 'none' || overlay.style.display === '') return;

    const key = e.key.toLocaleLowerCase('tr-TR');
    if (key === 'backspace') {
        handleBackspace();
        e.preventDefault();
    } else if (key === 'escape') {
        closeKeyboard();
    } else if (arabicKeyMap[key]) {
        SoundEngine.playClick(); 
        addLetter(arabicKeyMap[key]);
        e.preventDefault();
    }
});

function resetTableOnly(isSilent = false) {
    if (!isSilent) {
        SoundEngine.playReset(); 
    }
    document.querySelectorAll('#kalip-container-main .glass-box').forEach(box => {
        const el = box.querySelector('.ar, .ar-small');
        if (el) {
            const original = el.getAttribute('data-original');
            if (original) el.innerText = original;
        }
        box.style.backgroundColor = ""; 
        box.style.borderColor = "";
    });
    
    const rootDisplay = document.getElementById('root-text-display');
    if (rootDisplay) {
        rootDisplay.innerText = "KÖK GİR";
    }
    currentRoot = "";
}

function applyToSpecificBox(boxElement) {
    const targetEl = boxElement.querySelector('.ar, .ar-small');
    if (!targetEl) return;

    const kalip = targetEl.getAttribute('data-original');
    
    if (boxElement.style.backgroundColor.includes("rgba(0, 255, 65")) {
        SoundEngine.playClose();
        targetEl.innerText = kalip;
        boxElement.style.backgroundColor = "";
        boxElement.style.borderColor = "";
        return;
    }

    if (currentRoot.length !== 3) {
        alert("Lütfen önce 3 harfli bir kök girin!");
        openKeyboard();
        return;
    }

    SoundEngine.playClick(); 
    targetEl.innerText = applyRootToKalip(currentRoot, kalip);
    boxElement.style.backgroundColor = "rgba(0, 255, 65, 0.3)"; 
    boxElement.style.borderColor = "#000"; 
}

function applyRootToKalip(root, kalip) {
    if (!root || root.length !== 3) return kalip;
    const r = root.split(""); 
    let result = kalip;

    result = result.replace(/ف/g, "TEMP1");
    result = result.replace(/ع/g, "TEMP2");
    result = result.replace(/ل/g, "TEMP3");

    result = result.replace(/TEMP1/g, r[0]);
    result = result.replace(/TEMP2/g, r[1]);
    result = result.replace(/TEMP3/g, r[2]);
    
    return result;
}

// SIMULTANE VERİ SETİ
const data = {
sentence: [
    {
        words: [
            { tr: "Sabah", order: 2, ar: "في الصَّباح" },
            { tr: "erken", order: 3, ar: "مُبَكِّرًا." },
            { tr: "uyanırım.", order: 1, ar: "أَسْتَيْقِظُ" }
        ]
    },
    {
        words: [
            { tr: "Abdest alırım,", order: 1, ar: "أَتَوَضَّأُ،" },
            { tr: "sonra", order: 2, ar: "ثُمَّ" },
            { tr: "sabah namazını", order: 4, ar: "الفَجْر." },
            { tr: "kılarım.", order: 3, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Ailemle", order: 3, ar: "مَع عائِلَتي." },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Elbiselerimi", order: 2, ar: "مَلابِسي." },
            { tr: "giyerim.", order: 1, ar: "أَلْبَسُ" }
        ]
    },
    {
        words: [
            { tr: "Okula", order: 2, ar: "إِلى المَدْرَسَة." },
            { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Öğleyin", order: 3, ar: "ظُهْرًا." },
            { tr: "eve", order: 2, ar: "إِلى البَيْت" },
            { tr: "dönerim.", order: 1, ar: "أَرْجِعُ" }
        ]
    },
    {
        words: [
            { tr: "Evde", order: 3, ar: "في البَيْت." },
            { tr: "anneme", order: 2, ar: "أُمّي" },
            { tr: "yardım ederim.", order: 1, ar: "أُساعِدُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam", order: 3, ar: "مَساءً." },
            { tr: "derslerimi", order: 2, ar: "دُروسي" },
            { tr: "çalışırım.", order: 1, ar: "أَدْرُسُ" }
        ]
    },
    {
        words: [
            { tr: "Yatsı namazını", order: 2, ar: "العِشاء." },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Gece", order: 2, ar: "لَيْلًا." },
            { tr: "uyurum.", order: 1, ar: "أَنامُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "erken", order: 3, ar: "مُبَكِّرًا." },
            { tr: "uyanıyor.", order: 2, ar: "يَـسْتَيْقِظُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "erken", order: 3, ar: "مُبَكِّرًا." },
            { tr: "uyanıyor.", order: 2, ar: "تَـسْتَيْقِظُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "sabah namazı", order: 3, ar: "الفَجْر." },
            { tr: "kılıyor.", order: 2, ar: "يُـصَلّي" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "sabah namazı", order: 3, ar: "الفَجْر." },
            { tr: "kılıyor.", order: 2, ar: "تُـصَلّي" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "kahvaltı", order: 3, ar: "الفَطور." },
            { tr: "yapıyor.", order: 2, ar: "يَـتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "kahvaltı", order: 3, ar: "الفَطور." },
            { tr: "yapıyor.", order: 2, ar: "تَـتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هُو" },
            { tr: "dişlerini", order: 3, ar: "أَسْنانَهُ." },
            { tr: "temizliyor.", order: 2, ar: "يُـنَظِّفُ" }
        ]
    },
    {
        words: [
            { tr: "O", order: 1, ar: "هِي" },
            { tr: "dişlerini", order: 3, ar: "أَسْنانَها." },
            { tr: "temizliyor.", order: 2, ar: "تُـنَظِّفُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "öğleyin", order: 4, ar: "ظُهْرًا." },
            { tr: "eve", order: 3, ar: "إِلى البَيْت" },
            { tr: "dönüyorsun.", order: 2, ar: "تَـرْجِعُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "öğleyin", order: 4, ar: "ظُهْرًا." },
            { tr: "eve", order: 3, ar: "إِلى البَيْت" },
            { tr: "dönüyorsun.", order: 2, ar: "تَـرْجِعينَ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "annene", order: 3, ar: "أُمَّكَ." },
            { tr: "yardım ediyorsun.", order: 2, ar: "تُـساعِدُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "annene", order: 3, ar: "أُمَّكِ." },
            { tr: "yardım ediyorsun.", order: 2, ar: "تُـساعِدينَ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "akşam", order: 4, ar: "مَساءً." },
            { tr: "dersleri", order: 3, ar: "الدُّروس" },
            { tr: "çalışıyorsun.", order: 2, ar: "تَـدْرُسُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "akşam", order: 4, ar: "مَساءً." },
            { tr: "dersleri", order: 3, ar: "الدُّروس" },
            { tr: "çalışıyorsun.", order: 2, ar: "تَـدْرُسينَ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتَ" },
            { tr: "gece", order: 3, ar: "لَيْلًا." },
            { tr: "uyuyorsun.", order: 2, ar: "تَـنامُ" }
        ]
    },
    {
        words: [
            { tr: "Sen", order: 1, ar: "أَنْتِ" },
            { tr: "gece", order: 3, ar: "لَيْلًا." },
            { tr: "uyuyorsun.", order: 2, ar: "تَـنامينَ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltıda", order: 4, ar: "في الفَطور." },
            { tr: "zeytin", order: 2, ar: "الزَّيْتون" },
            { tr: "ve peynir", order: 3, ar: "وَالجُبْن" },
            { tr: "yiyorum.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltıda", order: 3, ar: "في الفَطور." },
            { tr: "süt", order: 2, ar: "الحَليب" },
            { tr: "içiyorum.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Öğle yemeğinde", order: 4, ar: "في الغَداء." },
            { tr: "et", order: 2, ar: "اللَّحْم" },
            { tr: "ve pirinç", order: 3, ar: "وَالأُرْز" },
            { tr: "yiyorum.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Öğle yemeğinden", order: 4, ar: "الغَداء." },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "kahve", order: 2, ar: "القَهْوَة" },
            { tr: "içiyorum.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinde", order: 4, ar: "في العَشاء." },
            { tr: "balık", order: 2, ar: "السَّمَك" },
            { tr: "ve salata", order: 3, ar: "وَالسَّلَطَة" },
            { tr: "yiyorum.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinde", order: 3, ar: "في العَشاء." },
            { tr: "meyve suyu", order: 2, ar: "العَصير" },
            { tr: "içiyorum.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Sabah", order: 5, ar: "صَباحًا." },
            { tr: "saat", order: 3, ar: "في السّاعَة" },
            { tr: "yedide", order: 4, ar: "السّابِعَة" },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltıda", order: 4, ar: "في الفَطور." },
            { tr: "bal", order: 2, ar: "العَسَل" },
            { tr: "ve tereyağı", order: 3, ar: "وَالزُّبْدَة" },
            { tr: "yerim.", order: 1, ar: "آكُلُ"}
        ]
    },
    {
        words: [
            { tr: "Saat", order: 3, ar: "في السّاعَة" },
            { tr: "sekizde", order: 4, ar: "الثّامِنَة." },
            { tr: "okula", order: 2, ar: "إِلى مدْرَسَة" },
            { tr: "giderim.", order: 1, ar: "أَذْهَبُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinde", order: 4, ar: "في العَشاء." },
            { tr: "tavuk", order: 2, ar: "الدَّجاج" },
            { tr: "ve pirinç", order: 3, ar: "وَالأُرْز" },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    {
        words: [
            { tr: "Gece", order: 5, ar: "لَيْلًا." },
            { tr: "saat", order: 2, ar: "في السّاعَة" },
            { tr: "on", order: 4, ar: "عَشْرَة" },
            { tr: "birde", order: 3, ar: "الحادِيَة" },
            { tr: "uyurum.", order: 1, ar: "أَنامُ" }
        ]
    },

    // --- Saatler ---

    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "bir.", order: 2, ar: "الواحِدَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "iki.", order: 2, ar: "الثّانِيَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "üç.", order: 2, ar: "الثّالِثَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "dört.", order: 2, ar: "الرّابِعَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "beş.", order: 2, ar: "الخامِسَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "altı.", order: 2, ar: "السّادِسَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "yedi.", order: 2, ar: "السّابِعَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "sekiz.", order: 2, ar: "الثّامِنَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "dokuz.", order: 2, ar: "التّاسِعَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "on.", order: 2, ar: "العاشِرَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "on", order: 3, ar: "عَشْرَة" }, { tr: "bir.", order: 2, ar: "الحادِيَة" }] },
    { words: [{ tr: "Saat", order: 1, ar: "السّاعَة" }, { tr: "on", order: 3, ar: "عَشْرَة" }, { tr: "iki.", order: 2, ar: "الثّانِيَة" }] },
    
// --- Dini Rutinler ---
    {
        words: [
            { tr: "Güneşin", order: 5, ar: "الشَّمْس." },
            { tr: "doğuşundan", order: 4, ar: "شُروق" },
            { tr: "önce", order: 3, ar: "قَبْل" },
            { tr: "sabah namazını", order: 2, ar: "الفَجْر" },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Muhammed", order: 1, ar: "مُحَمَّد" },
            { tr: "öğle namazını", order: 3, ar: "الظُّهْر" },
            { tr: "cemaatle", order: 4, ar: "مَع الجَماعَة." },
            { tr: "kılıyor.", order: 2, ar: "يُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Halid", order: 1, ar: "خالِد" },
            { tr: "ikindi namazını", order: 3, ar: "العَصْر" },
            { tr: "camide", order: 4, ar: "في المَسْجِد." },
            { tr: "kılıyor.", order: 2, ar: "يُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Güneş", order: 5, ar: "الشَّمْس." },
            { tr: "battıktan", order: 4, ar: "غُروب" },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "akşam namazını", order: 2, ar: "المَغْرِب" },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    {
        words: [
            { tr: "Uyumadan", order: 4, ar: "النَّوْم." },
            { tr: "önce", order: 3, ar: "قَبْل" },
            { tr: "yatsı namazını", order: 2, ar: "العِشاء" },
            { tr: "kılarım.", order: 1, ar: "أُصَلّي" }
        ]
    },
    // --- Günler ---
    
  { words: [{ tr: "Pazartesi", order: 2, ar: "الاِثْنَيْن" }, { tr: "günü", order: 1, ar: "يَوْمُ" }] },
  { words: [{ tr: "Salı", order: 2, ar: "الثُّلاثاء" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Çarşamba", order: 2, ar: "الأَرْبِعاء" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Perşembe", order: 2, ar: "الخَميس" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Cuma", order: 2, ar: "الجُمُعَة" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Cumartesi", order: 2, ar: "السَّبْت" }, { tr: "günü", order: 1, ar: "يَوْم" }] },
  { words: [{ tr: "Pazar", order: 2, ar: "الأَحَد" }, { tr: "günü", order: 1, ar: "يَوْم" }] },

    {
        words: [
  { tr: "Pazar", order: 3, ar: "الأَحَد" },
  { tr: "günü", order: 2, ar: "يَوْم" },
  { tr: "Cumartesi", order: 6, ar: "السَّبْت‫.‬" },
  { tr: "gününden", order: 5, ar: "يَوْم" },
  { tr: "sonra", order: 4, ar: "بَعْد" },
  { tr: "gelir.", order: 1, ar: "يَأْتي" }
        ]
    },
    {
        words: [
           
       { tr: "Pazartesi", order: 3, ar: "الاِثْنَيْن" },
       { tr: "günü", order: 2, ar: "يَوْم" },
       { tr: "Salı", order: 6, ar: "الثُّلاثاء‫.‬" },
       { tr: "gününden", order: 5, ar: "يَوْم" },
       { tr: "önce", order: 4, ar: "قَبْل" },
       { tr: "gelir.", order: 1, ar: "يَأْتي" }
]
       
    },
    {
        words: [
  { tr: "Salı", order: 3, ar: "الثُّلاثاء" },
  { tr: "günü", order: 2, ar: "يَوْم" },
  { tr: "Çarşamba", order: 6, ar: "الأَرْبِعاء‫.‬" },
  { tr: "gününden", order: 5, ar: "يَوْم" },
  { tr: "önce", order: 4, ar: "قَبْل" },
  { tr: "gelir.", order: 1, ar: "يَأْتي" }
        ]
    },
    {
        words: [
            
        { tr: "Cuma", order: 3, ar: "الجُمُعَة" },
        { tr: "günü", order: 2, ar: "يَوْم" },
        { tr: "Perşembe", order: 6, ar: "الخَميس‫.‬" },
        { tr: "gününden", order: 5, ar: "يَوْم" },
        { tr: "sonra", order: 4, ar: "بَعْد" },
        { tr: "gelir.", order: 1, ar: "يَأْتي" }
        ]
        
    },
    // --- Son Eklemeler ---
    {
        words: [
            { tr: "Gece", order: 5, ar: "لَيْلًا." },
            { tr: "saat", order: 2, ar: "في السّاعَة" },
            { tr: "on", order: 4, ar: "عَشْرَة" },
            { tr: "ikide", order: 3, ar: "الثّانِيَة" },
            { tr: "uyurum.", order: 1, ar: "أَنامُ" }
        ]
    },
    {
        words: [
            { tr: "Arkadaşımla", order: 3, ar: "مَع صَديقي." },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Öğle yemeğinde", order: 3, ar: "في الغَداء." },
            { tr: "balık", order: 2, ar: "السَّمَك" },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    {
        words: [
            { tr: "Akşam yemeğinden", order: 4, ar: "العَشاء." },
            { tr: "sonra", order: 3, ar: "بَعْد" },
            { tr: "kahve", order: 2, ar: "القَهْوَة" },
            { tr: "içerim.", order: 1, ar: "أَشْرَبُ" }
        ]
    },
    {
        words: [
            { tr: "Yemekten", order: 4, ar: "الطَّعام" },
            { tr: "önce", order: 3, ar: "قَبْل" },
            { tr: "ve sonrasında", order: 5, ar: "وَبَعْدَه." },
            { tr: "ellerimi", order: 2, ar: "يَدَيّ" },
            { tr: "yıkarım.", order: 1, ar: "أَغْسِلُ" }
        ]
    },
    {
        words: [
            { tr: "Kahvaltı", order: 2, ar: "الفَطور." },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        words: [
            { tr: "Dişlerimi", order: 2, ar: "أَسْناني." },
            { tr: "temizlerim.", order: 1, ar: "أُنَظِّفُ" }
        ]
    },
    {
        words: [
            { tr: "Anneme", order: 2, ar: "أُمّي." },
            { tr: "yardım ederim.", order: 1, ar: "أُساعِدُ" }
        ]
    },
    {
        words: [
            { tr: "Eve", order: 2, ar: "إِلى البَيْت." },
            { tr: "dönerim.", order: 1, ar: "أَرْجِعُ" }
        ]
    }
],
dialog: [
    // Diyalog 1: Yemek ve İçecek İsteği
    {
        p1: [
            { tr: "Yiyeceklerden", order: 3, ar: "مِن المَأْكولات؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "istersin?", order: 2, ar: "تُريدُ" }
        ],
        p2: [
            { tr: "Köfte", order: 2, ar: "الكُفْتَة" },
            { tr: "ve pirinç (pilav)", order: 3, ar: "وَالأُرْز." },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    {
        p1: [
            { tr: "İçeceklerden", order: 3, ar: "مِن المَشْروبات؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "istersin (k)?", order: 2, ar: "تُريدينَ" }
        ],
        p2: [
            { tr: "Çay", order: 2, ar: "الشّاي." },
            { tr: "istiyorum.", order: 1, ar: "أُريدُ" }
        ]
    },
    // Diyalog 2: Sevgi/Beğeni Soruları
    {
        p1: [
            { tr: "Köfteyi", order: 3, ar: "الكُفْتَة؟" },
            { tr: "sever", order: 2, ar: "تُحِبُّ" },
            { tr: "misin?", order: 1, ar: "هَلْ"}
        ],
        
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
            { tr: "köfteyi", order: 3, ar: "الكُفْتَة" },
            { tr: "çok", order: 4, ar: "كَثيرًا." },
            { tr: "severim.", order: 2, ar: "أُحِبُّ" }
        ]
    },
    // Diyalog 3: Ahmet ve Fatih (Günlük Rutin)
    {
        p1: [
            { tr: "Ey", order: 4, ar: "يا" },
            { tr: "Fatih,", order: 5, ar: "فاتِح؟" },
            { tr: "ne zaman", order: 1, ar: "مَتى" },
            { tr: "kahvaltı", order: 3, ar: "الفَطور" },
            { tr: "yaparsın?", order: 2, ar: "تَتَناوَلُ" }
        ],

        p2: [
            { tr: "Sabah", order: 5, ar: "صَباحًا." },
            { tr: "saat", order: 3, ar: "في السّاعَة" },
            { tr: "yedide", order: 4, ar: "السّابِعَة" },
            { tr: "kahvaltı", order: 2, ar: "الفَطور" },
            { tr: "yaparım.", order: 1, ar: "أَتَناوَلُ" }
        ]
    },
    {
        p1: [
            { tr: "Kahvaltıda", order: 3, ar: "في الفَطور؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "yersin?", order: 2, ar: "تَأْكُلُ" }
        ],
        p2: [
            { tr: "Bal", order: 2, ar: "العَسَل" },
            { tr: "ve tereyağı", order: 3, ar: "وَالزُّبْدَة." },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    {
        p1: [
            { tr: "Akşam yemeğinde", order: 3, ar: "في العَشاء؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "yersin?", order: 2, ar: "تَأْكُلُ" }
        ],
        p2: [
            { tr: "Tavuk", order: 2, ar: "الدَّجاج" },
            { tr: "ve pirinç", order: 3, ar: "وَالأُرْز." },
            { tr: "yerim.", order: 1, ar: "آكُلُ" }
        ]
    },
    // Diyalog 4: Merve ve Zeynep
    {
        p1: [
            { tr: "Öğle yemeğinden", order: 5, ar: "الغَداء؟" },
            { tr: "sonra", order: 4, ar: "بَعْد" },
            { tr: "kahve", order: 3, ar: "القَهْوَة" },
            { tr: "içer", order: 1, ar: "تَشْرَبينَ" },
            { tr: "misin?", order: 2, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Hayır,", order: 1, ar: "لا،" },
            { tr: "çay", order: 3, ar: "الشّاي." },
            { tr: "içerim.", order: 2, ar: "أَشْرَبُ" }
        ]
    },
    {
        p1: [
            { tr: "Evde", order: 4, ar: "في البَيْت؟" },
            { tr: "annene", order: 3, ar: "أُمَّكِ" },
            { tr: "yardım eder", order: 2, ar: "تُساعِدين" },
            { tr: "misin?", order: 1, ar: "هَلْ" }
        ],
        p2: [
            { tr: "Evet,", order: 1, ar: "نَعَمْ،" },
            { tr: "anneme", order: 3, ar: "أُمّي" },
            { tr: "yardım ederim", order: 2, ar: "أُساعِدُ" },
            { tr: "ve", order: 4, ar: "وَأُنَظِّفُ" },
            { tr: "odamı", order: 5, ar: "غُرْفَتي." },
            { tr: "temizlerim.", order: 4, ar: "وَأُنَظِّفُ" }
        ]
    },
    // Diyalog 5: Ömer ve Bilal
    {
        p1: [
            { tr: "İçeceklerden", order: 3, ar: "مِن المَشْروبات؟" },
            { tr: "ne", order: 1, ar: "ماذا" },
            { tr: "seversin?", order: 2, ar: "تُحِبُّ" }
        ],
        p2: [
            { tr: "Çayı", order: 2, ar: "الشّاي" },
            { tr: "çok", order: 3, ar: "كَثيرًا." },
            { tr: "severim.", order: 1, ar: "أُحِبُّ" }
        ]
    },
    // Diyalog 6: İsmail Metni (Diyalog yapısında p1/p2 olarak bölünmüştür)
    {
        p1: [
            { tr: "İsmail", order: 2, ar: "إِسْماعيل" },
            { tr: "sabah", order: 4, ar: "صَباحًا‫.‬" },
            { tr: "altıda", order: 3, ar: "في السّادِسَة" },
            { tr: "uyanır.", order: 1, ar: "يَـسْتَيْقِظُ" }
        ],
        p2: [
            { tr: "Abdest alır,", order: 1, ar: "يَتَوَضَّأُ" },
            { tr: "sonra", order: 2, ar: "ثُمَّ" },
            { tr: "sabah namazını", order: 4, ar: "الفَجْر." },
            { tr: "kılar.", order: 3, ar: "يُصَلّي" }
        ]
    }
]

};

var mode = 'sentence'; 
var currentIdx = 0;
var step = 1;
var pTurn = 1;
var colorCounter = 0;
var currentDirection = 'tr-to-ar'; 
const wordColors = [
    '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', 
    '#46f0f0', '#f032e6', '#008080', '#e6beff', '#9a6324', 
    '#800000', '#aaffc3', '#808000', '#000075', '#d2691e'
];

const AR_FONT = "'Arakom', sans-serif";
const TR_FONT = "'Inter', sans-serif";

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

function changeSentence(dir) {
    if (!data[mode]) return;

    if (dir === 1) {
        const currentWords = mode === 'sentence' ? 
            data.sentence[currentIdx].words : 
            (pTurn === 1 ? data.dialog[currentIdx].p1 : data.dialog[currentIdx].p2);
        
        if (step <= currentWords.length) {
            const w = currentWords.find(item => item.order === step);
            const trId = mode === 'sentence' ? 's-tr' : (pTurn === 1 ? 'p1-tr' : 'p2-tr');
            const arId = mode === 'sentence' ? 's-ar' : (pTurn === 1 ? 'p1-ar' : 'p2-ar');
            const originalIdx = currentWords.indexOf(w);
            
            if (mode === 'dialog' && pTurn === 2 && w.order === 1) {
                speakCurrentSentence(); 
            }

            handleMove(w.order, (currentDirection === 'tr-to-ar' ? w.ar : w.tr), trId, arId, pTurn, originalIdx, true);
            return; 
        }
    }

    currentIdx = (currentIdx + dir + data[mode].length) % data[mode].length;
    
    step = 1; 
    pTurn = 1; 
    colorCounter = 0;
    render(); 

    if (completionStatus[mode][currentIdx]) {
        forceOpenPage();
    }
}

function forceOpenPage() {
    if (mode === 'sentence') {
        const words = data.sentence[currentIdx].words;
        for (let i = 1; i <= words.length; i++) {
            const w = words.find(item => item.order === i);
            if (w) {
                handleMove(w.order, (currentDirection === 'tr-to-ar' ? w.ar : w.tr), 's-tr', 's-ar', 1, words.indexOf(w), true);
            }
        }
    } else {
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

function handleMove(order, outputText, trId, arId, playerNum, originalIndex, isAuto = false) {
    const clickedWord = event?.currentTarget || document.querySelector(`[data-container="${trId}"][data-order="${order}"]`);

    if (!isAuto && clickedWord?.classList.contains('completed')) {
        undoToStep(order, trId, arId, playerNum);
        completionStatus[mode][currentIdx] = false; 
        return;
    }

    if (order === 1 && !isAuto) {
        window.speechSynthesis.cancel(); 
        if (mode === 'dialog' && playerNum === 2) {
            speakCurrentSentence(); 
        }
    }

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
        pTurn = 2; 
        step = 1; 
        colorCounter = 0;
        document.querySelectorAll(`[data-container="p2-tr"][data-order="1"]`).forEach(w => w.className = 'word active');
    }

    let isFinished = (mode === 'sentence') ? 
        (step > data.sentence[currentIdx].words.length) : 
        (pTurn === 2 && step > data.dialog[currentIdx].p2.length);

    if (isFinished) {
        completionStatus[mode][currentIdx] = true; 
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