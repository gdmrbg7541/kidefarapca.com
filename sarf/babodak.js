/* ============================================================================
   BÂB ODAK MODU (babodak.js) — TABLO İÇİ SÜRÜM
   İf'al–İstif'al bâblarının ⓘ ikonuna basınca:
     • Tablo YERİNDE kalır (başlıklar + seçilen bâbın kalıp satırı görünür),
       yalnız DİĞER 8 bâb satırı gizlenir → görsel bütünlük bozulmaz.
     • Seçilen bâbın hemen altına, AYNI TABLONUN sütunlarına hizalı 3 örnek
       kök satırı eklenir: köke tıklayınca kök uçar, zâid harfler kırmızı
       süzülür, kelime ColorEngine ile renklenir (kök siyah, ek kırmızı),
       Türkçesi belirir (konuanlatimimezid.html motorunun portu).
     • "Örnekler" ↔ "Dilbilgisi" akordiyondur (biri açılınca diğeri kapanır);
       Dilbilgisi içeriği kaliplartablosu'nun MEVCUT bâb bilgi veritabanından
       (getBabInfo) gelir — hiçbir metin kopyalanmadı.
     • Eklenen satırlar DOM'da saklanır → bölüm geçişinde, odaktan çıkıp
       yeniden girişte açılan örnekler SIFIRLANMAZ (bâb başına ayrı durum).
   Bağımlılıklar (kaliplartablosu.js): ColorEngine, getBabInfo, showBabInfo.
   Bu dosya kaliplartablosu.js'den SONRA yüklenmelidir.
   ============================================================================ */
/* Satır süzülme süresi: kalıp odağı da bunu okuyor ki iki odağın
   hareketi birebir aynı olsun. */
window.BO_SURE = '1s cubic-bezier(.22,1,.36,1)';
(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1) VERİ — konuanlatimimezid.html'den port (3 örnek kök × 6 türev).
          Anahtarlar getBabInfo başlıklarıyla birebir aynı.
          Düzeltmeler: Tefa'ul kökü 'باعد'→'بعد'; İf'ılal'daki '_' kalıntıları.
       ------------------------------------------------------------------ */
    const BO_DATA = {
        "İf'al": {
            roots: [
                { word: 'كرم', mean: ['İkram etti', 'İkram ediyor', 'İkram et', 'İkram', 'İkram eden', 'İkram edilen'], derived: ["أَكْرَمَ", "يُكْرِمُ", "أَكْرِمْ", "إِكْرَامٌ", "مُكْرِمٌ", "مُكْرَمٌ"] },
                { word: 'حسن', mean: ['Güzelleştirdi', 'Güzelleştiriyor', 'Güzelleştir', 'İhsan', 'Muhsin', 'İhsan edilen'], derived: ["أَحْسَنَ", "يُحْسِنُ", "أَحْسِنْ", "إِحْسَانٌ", "مُحْسِنٌ", "مُحْسَنٌ"] },
                { word: 'علن', mean: ['İlan etti', 'İlan ediyor', 'İlan et', 'İlan', 'İlan eden', 'İlan edilen'], derived: ["أَعْلَنَ", "يُعْلِنُ", "أَعْلِنْ", "إِعْلَانٌ", "مُعْلِنٌ", "مُعْلَنٌ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">أَ</span>${r[0]}ْ${r[1]}َ${r[2]}َ`,
                r => `<span class="bo-zaid">يُ</span>${r[0]}ْ${r[1]}ِ${r[2]}ُ`,
                r => `<span class="bo-zaid">أَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ْ`,
                r => `<span class="bo-zaid">إِ</span>${r[0]}ْ${r[1]}<span class="bo-zaid">َا</span>${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}ْ${r[1]}ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}ْ${r[1]}َ${r[2]}ٌ`
            ]
        },
        "Tef'il": {
            roots: [
                { word: 'علم', mean: ['Öğretti', 'Öğretiyor', 'Öğret', 'Eğitim', 'Öğretmen', 'Öğretilen'], derived: ["عَلَّمَ", "يُعَلِّمُ", "عَلِّمْ", "تَعْلِيمٌ", "مُعَلِّمٌ", "مُعَلَّمٌ"] },
                { word: 'ذكر', mean: ['Hatırlattı', 'Hatırlatıyor', 'Hatırlat', 'Zikir', 'Hatırlatan', 'Hatırlatılan'], derived: ["ذَكَّرَ", "يُذَكِّرُ", "ذَكِّرْ", "تَذْكِيرٌ", "مُذَكِّرٌ", "مُذَكَّرٌ"] },
                { word: 'قدم', mean: ['Takdim etti', 'Sunuyor', 'Sun', 'Takdim', 'Sunan', 'Sunulan'], derived: ["قَدَّمَ", "يُقَدِّمُ", "قَدِّمْ", "تَقْدِيمٌ", "مُقَدِّمٌ", "مُقَدَّمٌ"] }
            ],
            patterns: [
                r => `${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>َ${r[2]}َ`,
                r => `<span class="bo-zaid">يُ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>ِ${r[2]}ُ`,
                r => `${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>ِ${r[2]}ْ`,
                r => `<span class="bo-zaid">تَ</span>${r[0]}ْ${r[1]}<span class="bo-zaid">ِي</span>${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>َ${r[2]}ٌ`
            ]
        },
        "Mufa'ale": {
            roots: [
                { word: 'كتب', mean: ['Yazıştı', 'Yazışıyor', 'Yazış', 'Yazışma', 'Yazışan', 'Yazışılan'], derived: ["كَاتَبَ", "يُكَاتِبُ", "كَاتِبْ", "مُكَاتَبَةٌ", "مُكَاتِبٌ", "مُكَاتَبٌ"] },
                { word: 'قتل', mean: ['Savaştı', 'Savaşıyor', 'Savaş', 'Savaşmak', 'Savaşan', '-'], derived: ["قَاتَلَ", "يُقَاتِلُ", "قَاتِلْ", "مُقَاتَلَةٌ", "مُقَاتِلٌ", "مُقَاتَلٌ"] },
                { word: 'شرك', mean: ['Paylaştı', 'Paylaşıyor', 'Paylaş', 'Ortaklık', 'Ortak', '-'], derived: ["شَارَكَ", "يُشَارِكُ", "شَارِكْ", "مُشَارَكَةٌ", "مُشَارِكٌ", "مُشَارَكٌ"] }
            ],
            patterns: [
                r => `${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}َ`,
                r => `<span class="bo-zaid">يُ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}ِ${r[2]}ُ`,
                r => `${r[0]}<span class="bo-zaid">ا</span>${r[1]}ِ${r[2]}ْ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}<span class="bo-zaid">َة</span>`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}ٌ`
            ]
        },
        "İnfi'al": {
            roots: [
                { word: 'كسر', mean: ['Kırıldı', 'Kırılıyor', 'Kırıl', 'İnkisar', 'Münkesir', '-'], derived: ["اِنْكَسَرَ", "يَنْكَسِرُ", "اِنْكَسِرْ", "اِنْكِسَارٌ", "مُنْكَسِرٌ", "مُنْكَسَرٌ"] },
                { word: 'قلب', mean: ['Ters döndü', 'Dönüyor', 'Dön', 'İnkilap', 'Münkalib', '-'], derived: ["اِنْقَلَبَ", "يَنْقَلِبُ", "اِنْقَلِبْ", "اِنْقِلَابٌ", "مُنْقَلِبٌ", "مُنْقَلَبٌ"] },
                { word: 'قطع', mean: ['Kesildi', 'Kesiliyor', 'Kesil', 'İnkita', 'Münkati', '-'], derived: ["اِنْقَطَعَ", "يَنْقَطِعُ", "اِنْقَطِعْ", "اِنْقِطَاعٌ", "مُنْقَطِعٌ", "مُنْقَطَعٌ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">اِنْ</span>${r[0]}َ${r[1]}َ${r[2]}َ`,
                r => `<span class="bo-zaid">يَنْ</span>${r[0]}َ${r[1]}ِ${r[2]}ُ`,
                r => `<span class="bo-zaid">اِنْ</span>${r[0]}َ${r[1]}ِ${r[2]}ْ`,
                r => `<span class="bo-zaid">اِنْ</span>${r[0]}ِ${r[1]}<span class="bo-zaid">ا</span>${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُنْ</span>${r[0]}َ${r[1]}ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُنْ</span>${r[0]}َ${r[1]}َ${r[2]}ٌ`
            ]
        },
        "İfti'al": {
            roots: [
                { word: 'جمع', mean: ['Toplandı', 'Toplanıyor', 'Toplan', 'İçtima', 'Müçtemi', '-'], derived: ["اِجْتَمَعَ", "يَجْتَمِعُ", "اِجْتَمِعْ", "اِجْتِمَاعٌ", "مُجْتَمِعٌ", "مُجْتَمَعٌ"] },
                { word: 'نشر', mean: ['Yayıldı', 'Yayılıyor', 'Yayıl', 'İntişar', 'Münteşir', '-'], derived: ["اِنْتَشَرَ", "يَنْتَشِرُ", "اِنْتَشِرْ", "اِنْتِشَارٌ", "مُنْتَشِرٌ", "مُنْتَشَرٌ"] },
                { word: 'نظر', mean: ['Bekledi', 'Bekliyor', 'Bekle', 'İntizar', 'Müntezir', 'Müntezar'], derived: ["اِنْتَظَرَ", "يَنْتَظِرُ", "اِنْتَظِرْ", "اِنْتِظَارٌ", "مُنْتَظِرٌ", "مُنْتَظَرٌ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">اِ</span>${r[0]}<span class="bo-zaid">ْتَ</span>${r[1]}َ${r[2]}َ`,
                r => `<span class="bo-zaid">يَ</span>${r[0]}<span class="bo-zaid">ْتَ</span>${r[1]}ِ${r[2]}ُ`,
                r => `<span class="bo-zaid">اِ</span>${r[0]}<span class="bo-zaid">ْتَ</span>${r[1]}ِ${r[2]}ْ`,
                r => `<span class="bo-zaid">اِ</span>${r[0]}<span class="bo-zaid">ْتِ</span><span class="bo-zaid">ا</span>${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}<span class="bo-zaid">ْتَ</span>${r[1]}ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}<span class="bo-zaid">ْتَ</span>${r[1]}َ${r[2]}ٌ`
            ]
        },
        "İf'ılal": {
            roots: [
                { word: 'حمر', mean: ['Kızardı', 'Kızarıyor', 'Kızar', 'İhmirar', 'Muhmerr', '-'], derived: ["اِحْمَرَّ", "يَحْمَرُّ", "اِحْمَرِّلْ", "اِحْمِرَارٌ", "مُحْمَرٌّ", "مُحْمَرٌّ"] },
                { word: 'صفر', mean: ['Sarardı', 'Sararıyor', 'Sarar', 'İsfirar', 'Musferr', '-'], derived: ["اِصْفَرَّ", "يَصْفَرُّ", "اِصْفَرِّلْ", "اِصْفِرَارٌ", "مُصْفَرٌّ", "مُصْفَرٌّ"] },
                { word: 'بيض', mean: ['Beyazladı', 'Beyazlıyor', 'Beyazla', 'İbyizaz', 'Mubyezz', '-'], derived: ["اِبْيَضَّ", "يَبْيَضُّ", "اِبْيَضِّلْ", "اِبْيِضَاضٌ", "مُبْيَضٌّ", "مُبْيَضٌّ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">اِ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="bo-zaid">َّ</span>`,
                r => `<span class="bo-zaid">يَ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="bo-zaid">ُّ</span>`,
                r => `<span class="bo-zaid">اِ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="bo-zaid">ِّلْ</span>`,
                r => `<span class="bo-zaid">اِ</span>${r[0]}ْ${r[1]}ِ<span class="bo-zaid">ا</span>${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="bo-zaid">ٌّ</span>`,
                r => `<span class="bo-zaid">مُ</span>${r[0]}ْ${r[1]}َ${r[2]}<span class="bo-zaid">ٌّ</span>`
            ]
        },
        "Tefe'ul": {
            roots: [
                { word: 'علم', mean: ['Öğrendi', 'Öğreniyor', 'Öğren', 'Taallüm', 'Müteallim', '-'], derived: ["تَعَلَّمَ", "يَتَعَلَّمُ", "تَعَلَّمْ", "تَعَلُّمٌ", "مُتَعَلِّمٌ", "مُتَعَلَّمٌ"] },
                { word: 'ذكر', mean: ['Düşündü', 'Düşünüyor', 'Düşün', 'Tezekkür', 'Mütezekkir', '-'], derived: ["تَذَكَّرَ", "يَتَذَكَّرُ", "تَذَكَّرْ", "تَذَكُّرٌ", "مُتَذَكِّرٌ", "مُتَذَكَّرٌ"] },
                { word: 'كلم', mean: ['Konuştu', 'Konuşuyor', 'Konuş', 'Tekellüm', 'Mütekellim', '-'], derived: ["تَكَلَّمَ", "يَتَكَلَّمُ", "تَكَلَّمْ", "تَكَلُّمٌ", "مُتَكَلِّمٌ", "مُتَكَلَّمٌ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">تَ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>َ${r[2]}َ`,
                r => `<span class="bo-zaid">يَتَ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>َ${r[2]}ُ`,
                r => `<span class="bo-zaid">تَ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>َ${r[2]}ْ`,
                r => `<span class="bo-zaid">تَ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>ُ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُتَ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُتَ</span>${r[0]}َ${r[1]}<span class="bo-zaid">ّ</span>َ${r[2]}ٌ`
            ]
        },
        "Tefa'ul": {
            roots: [
                { word: 'نصر', mean: ['Yardımlaştı', 'Yardımlaşıyor', 'Yardımlaş', 'Tenâsur', 'Mütenasir', '-'], derived: ["تَنَاصَرَ", "يَتَنَاصَرُ", "تَنَاصَرْ", "تَنَاصُرٌ", "مُتَنَاصِرٌ", "مُتَنَاصَرٌ"] },
                { word: 'كتب', mean: ['Yazıştılar', 'Yazışıyorlar', 'Yazışın', 'Tekatüb', 'Mütekatib', '-'], derived: ["تَكَاتَبَ", "يَتَكَاتَبُ", "تَكَاتَبْ", "تَكَاتُبٌ", "مُتَكَاتِبٌ", "مُتَكَاتَبٌ"] },
                { word: 'بعد', mean: ['Uzaklaştı', 'Uzaklaşıyor', 'Uzaklaş', 'Tebaüd', 'Mütebaid', '-'], derived: ["تَبَاعَدَ", "يَتَبَاعَدُ", "تَبَاعَدْ", "تَبَاعُدٌ", "مُتَبَاعِدٌ", "مُتَبَاعَدٌ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">تَ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}َ`,
                r => `<span class="bo-zaid">يَتَ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}ُ`,
                r => `<span class="bo-zaid">تَ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}ْ`,
                r => `<span class="bo-zaid">تَ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}ُ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُتَ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُتَ</span>${r[0]}<span class="bo-zaid">ا</span>${r[1]}َ${r[2]}ٌ`
            ]
        },
        "İstif'al": {
            roots: [
                { word: 'غفر', mean: ['Af diledi', 'Af diliyor', 'Af dile', 'İstiğfar', 'Müstağfir', '-'], derived: ["اِسْتَغْفَرَ", "يَسْتَغْفِرُ", "اِسْتَغْفِرْ", "اِسْتِغْفَارٌ", "مُسْتَغْفِرٌ", "مُسْتَغْفَرٌ"] },
                { word: 'خرج', mean: ['Çıkardı', 'Çıkarıyor', 'Çıkar', 'İstihraç', 'Müstahriç', 'Müstahraç'], derived: ["اِسْتَخْرَجَ", "يَسْتَخْرِجُ", "اِسْتَخْرِجْ", "اِسْتِخْرَاجٌ", "مُسْتَخْرِجٌ", "مُسْتَخْرَجٌ"] },
                { word: 'خدم', mean: ['Çalıştırdı', 'Çalıştırıyor', 'Çalıştır', 'İstihdam', 'Müstahdim', 'Müstahdam'], derived: ["اِسْتَخْدَمَ", "يَسْتَخْدِمُ", "اِسْتَخْدِمْ", "اِسْتِخْدَامٌ", "مُسْتَخْدِمٌ", "مُسْتَخْدَمٌ"] }
            ],
            patterns: [
                r => `<span class="bo-zaid">اِسْتَ</span>${r[0]}ْ${r[1]}َ${r[2]}َ`,
                r => `<span class="bo-zaid">يَسْتَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ُ`,
                r => `<span class="bo-zaid">اِسْتَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ْ`,
                r => `<span class="bo-zaid">اِسْتِ</span>${r[0]}ْ${r[1]}<span class="bo-zaid">ا</span>${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُسْتَ</span>${r[0]}ْ${r[1]}ِ${r[2]}ٌ`,
                r => `<span class="bo-zaid">مُسْتَ</span>${r[0]}ْ${r[1]}َ${r[2]}ٌ`
            ]
        }
    };

    /* ------------------------------------------------------------------
       2) STİL — tablo görünümüyle uyumlu (glass-box benzeri), bo- öneki
       ------------------------------------------------------------------ */
    const CSS = `
/* Kapatma: aynı bâbın ⓘ ikonuna tekrar basınca odak kapanır (ayrı tuş yok) */

/* Kök hücresi (bâb adı sütununda) — tablonun cam kutu diliyle.
   "tıkla" yazısı yok; kökün SAĞINDA özel animasyonlu tıklama SVG'si var. */
.bo-kok{ display:inline-flex; align-items:center; gap:10px; direction:ltr;
    cursor:pointer; background:#ebf5ff; color:#3498db;
    border:3px dashed #3498db; border-radius:8px; margin:2px; padding:6px 14px;
    font-family:'Arakom',sans-serif; font-size:2.8rem; line-height:1.3;
    transition:transform .2s cubic-bezier(.34,1.4,.5,1), background .2s, box-shadow .2s; }
.bo-kok .bo-kok-yazi{ direction:rtl; }
.bo-kok:hover{ transform:scale(1.06); background:#d6eaff; box-shadow:0 8px 20px rgba(52,152,219,.35); }
.bo-kok:active{ transform:scale(.95); }
/* Tıklama ikonu: halka nabız gibi yayılır, imleç ok'u dokunur gibi kıpırdar */
.bo-tik-ico{ width:30px; height:30px; flex:0 0 auto; color:#3498db; opacity:.9; }
.bo-tik-ico .bt-halka{ transform-origin:9px 9px; animation:btHalka 1.6s ease-out infinite; }
@keyframes btHalka{ 0%{ transform:scale(.35); opacity:1; } 70%{ transform:scale(1.2); opacity:0; } 100%{ transform:scale(1.2); opacity:0; } }
.bo-tik-ico .bt-ok{ animation:btOk 1.6s ease-in-out infinite; }
@keyframes btOk{ 0%,100%{ transform:translate(0,0); } 35%{ transform:translate(-2.4px,-2.4px); } 60%{ transform:translate(0,0); } }
.bo-kok:hover .bo-tik-ico{ opacity:1; }

/* Hedef hücreler — .glass-box görünümünün eşi. İKİ SATIR yüksekliğinde
   (Arapça + Türkçesi rahat sığar), Arapça ve Türkçe BÜYÜK. */
.bo-hedef{ position:relative; display:flex; flex-direction:column; align-items:center;
    justify-content:center; background:#f8f9fa; border:1px solid #d1d5db;
    border-bottom:4px solid #9ca3af; border-radius:8px; margin:2px; min-height:128px;
    padding:8px 2px 6px; text-align:center; transition:all .3s; }
.bo-hedef .bo-ar, .bo-hedef .srf-word{ font-family:'Arakom',sans-serif;
    font-size:3.5rem; line-height:1.35; direction:rtl; }  /* kalıpla AYNI boyut */
.bo-zaid{ display:inline-block; color:#E53935; line-height:1; will-change:transform,opacity; }
/* DAMGA: şedde gibi yalnız-işaret zâidler. Düz inline span → harf bitişmesi
   BOZULMAZ (kök ayrılmaz); işaret önce gizli, damga inince kırmızı belirir. */
/* Not: işaret span'ı BAŞTA BOŞTUR (data-isaret'te bekler) — tarayıcı işareti
   komşu harfin koşusunda çizdiği için opacity ile gizlemek İŞE YARAMIYOR;
   işaret ancak damga konunca DOM'a yazılır. */
.bo-damga{ color:#E53935; }
/* Yukarıdan harfin üstüne inen damga kopyası — yalnız transform/opacity
   animasyonlanır (kompozitör), yerleşim tetiklenmez → takılma olmaz */
.bo-damga-ucan{ position:absolute; color:#E53935; font-family:'Arakom',sans-serif;
    pointer-events:none; z-index:5; line-height:1;
    text-shadow:0 3px 8px rgba(229,57,53,.4); will-change:transform,opacity; }
.bo-tamam{ border-color:#2ecc71 !important; border-bottom-color:#27ae60 !important;
    animation:boComplete .75s ease-out; }
@keyframes boComplete{
    0%{ box-shadow:0 0 0 0 rgba(46,204,113,.55); transform:scale(1); }
    45%{ box-shadow:0 0 0 9px rgba(46,204,113,0); transform:scale(1.04); }
    100%{ box-shadow:0 0 0 0 rgba(46,204,113,0); transform:scale(1); } }
.bo-final{ animation:boPopIn .5s cubic-bezier(.34,1.55,.5,1) both; }
@keyframes boPopIn{ 0%{ transform:scale(.5); opacity:0;} 60%{ transform:scale(1.12); opacity:1;} 100%{ transform:scale(1);} }
.bo-anlam{ background:rgba(231,76,60,.92); color:#fff; border-radius:8px; padding:4px 14px;
    font-size:1.35rem; margin-top:6px; width:fit-content; font-family:'Inter',sans-serif;
    animation:boMeaning .45s .12s both cubic-bezier(.2,1,.3,1); }
@keyframes boMeaning{ 0%{ opacity:0; transform:translateY(9px) scale(.9);} 100%{ opacity:1; transform:none;} }

/* Odak satırları: bâb satırı yukarı SÜZÜLÜRKEN (FLIP) örnekler arkasından belirir */
.bo-belir{ animation: boBelir .5s cubic-bezier(.2,1,.3,1) both; }
@keyframes boBelir{ from{ opacity:0; transform:translateY(-16px); } to{ opacity:1; transform:none; } }
/* Süzülen bâb satırı diğerlerinin üstünden geçerken net görünsün */
.bo-kayan{ position:relative; z-index:50; }
/* ODAKTAYKEN kalıp yazıları BÜYÜK (2.5rem); kapanınca sınıf kalkar, eskiye döner.
   (#tab2 id'si şart: sayfanın "#tab2 .ar {2.2rem !important}" kuralını ezmek için) */
/* ODAKTAKİ SATIRIN VEZİNLERİ — TEK KURAL, İKİ YOL.
   ⓘ ile açılan bâb odağı (bo-odak-kalip) ve bir vezne basınca açılan
   kalıp odağı (ko-odak-satir, sarf/kalipliste.js) aynı ölçüyü kullanır;
   iki ayrı yerde yazılsaydı biri değişince öbürü sessizce ayrışırdı.
   3.5rem'den 3rem'e indirildi: 3.5 fazla büyük duruyordu. */
#tab2 tr.bo-odak-kalip .glass-box .ar,
#tab2 tr.ko-odak-satir .glass-box .ar{ font-size:3rem !important; }

/* Uçan kök */
.bo-ucus{ position:fixed; z-index:9999999; pointer-events:none; color:#3498db; font-weight:700;
    font-family:'Arakom',sans-serif; line-height:1; display:flex; align-items:center; justify-content:center;
    transition:left .6s cubic-bezier(.4,0,.2,1), top .6s cubic-bezier(.4,0,.2,1);
    filter:drop-shadow(0 6px 16px rgba(52,152,219,.5)); will-change:left,top; }

/* MUFA'ALE MASTAR (67/68): ikisi birden açık kalmaz — kapalı olan yalnız
   ORTALI BÜYÜK kalıp numarasını gösterir; mastar sütunu da daraltıldı. */
#tab2 th:nth-child(5){ width:13% !important; }
/* Bâb adı sütunu da sabitlenir; böylece TÜM sütunlar birbirine yakın genişlikte olur */
#tab2 th:nth-child(1){ width:16% !important; }
.bo-kapali{ width:46px !important; min-width:46px !important; flex:0 0 46px !important;
    align-self:stretch; cursor:pointer; }
.bo-kapali:hover{ background:#fff3e6 !important; border-color:#f39c12 !important; }
.bo-kapali .ar{ display:none !important; }
.bo-kapali .ref{ position:static !important; top:auto !important; right:auto !important; left:auto !important;
    transform:none !important; margin:0 !important; display:flex !important;
    align-items:center; justify-content:center; width:100%; height:100%;
    font-size:1rem !important; opacity:.75; pointer-events:none; }
.bo-acik6768{ flex:1 1 auto !important; width:auto !important; }

/* Dilbilgisi satırı — mevcut bilgi metni, tablo genişliğinde beyaz kart (BÜYÜK yazı) */
.bo-dilbilgisi{ direction:ltr; text-align:left; color:#2c3e50; font-size:1.7rem; line-height:1.75;
    background:#fff; border:1px solid #d1d5db; border-bottom:4px solid #9ca3af;
    border-radius:10px; margin:4px 2px 8px; padding:20px 26px; font-family:'Inter','Segoe UI',sans-serif; }
.bo-dilbilgisi .arabic-sample{ font-family:'Arakom',sans-serif; color:#3498db; font-weight:700;
    font-size:1.3em; direction:rtl; display:inline-block; }
@keyframes boBilgiVurgu{ 0%{ box-shadow:0 0 0 0 rgba(243,156,18,.6); }
    100%{ box-shadow:0 0 0 18px rgba(243,156,18,0); } }
.bo-dilbilgisi.bo-vurgu{ animation:boBilgiVurgu 1.1s ease 2; }
.bo-satir td{ vertical-align:middle; }
/* Odak satırları nth-child şerit renklerinden ETKİLENMESİN — nötr zemin.
   (id + sınıf özgüllüğü, sayfanın !important'lı nth-child kurallarını ezer) */
#tab2 tr.bo-satir td{ background-color:#fbfcfd !important; }
/* ⓘ ODAKTAYKEN ✕ OLUR: aynı düğme hem açıyor hem kapatıyor; öğretmen
   nereden kapatacağını simgeden görüyor (Geylani: "info simgesi çarpıya
   dönüşsün ki nereden kapatması gerektiğini bilsin"). */
.info-icon.bo-kapat{ color:#ef4444 !important; }
.info-icon.bo-kapat i{ display:none !important; }
.info-icon.bo-kapat::after{ content:'\\2715'; font-family:'Inter','Segoe UI',sans-serif;
    font-weight:900; font-size:1.02rem; line-height:1; }
/* BÂB ODAĞI AÇIKKEN KAHVERENGİ KÖK LEVHASI ÇEKİLİR: odak satırları
   tablonun en üstüne taşınıyor, levha tam onların üstüne düşüyordu.
   Odak kapanınca levha geri geliyor. */
body.bo-odak-acik .draggable-root-clone:not(#crisp-root-clone){
    opacity:0 !important; pointer-events:none !important; transition:opacity .25s ease; }
@media (max-width:900px){
    .bo-kok{ font-size:1.6rem; padding:4px 8px 2px; }
    .bo-hedef{ min-height:88px; }
    .bo-hedef .bo-ar, .bo-hedef .srf-word{ font-size:2rem; }
    .bo-anlam{ font-size:.95rem; padding:2px 8px; }
    .bo-btn{ font-size:.85rem; padding:5px 10px; }
    .bo-ipucu{ display:none; }
}`;

    const styleEl = document.createElement('style');
    styleEl.id = 'bab-odak-css';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    /* ------------------------------------------------------------------
       3) DURUM — bâb başına satır önbelleği (sıfırlanmama garantisi)
       ------------------------------------------------------------------ */
    const babRows = {};    // babTitle -> { rows:[tr...], filled:[0,0,0], babRow:tr }
    let aktifBab = null;   // odaktaki bâb başlığı (yoksa null)

    function slug(s) { return s.replace(/[^a-zA-Z0-9]/g, ''); }

    // Son hareke temizliği: kelime sonundaki tenvin/hareke/cezm kaldırılır,
    // ŞEDDE korunur (harfin kendisine aittir). Mastar ve sonrası sütunlarda kullanılır.
    const SON_HAREKE = /[\u064B-\u0650\u0652]/;   // tenvinler + üstün/esre/ötre + cezm (şedde \u0651 HARİÇ)
    function sonHarekeTemizle(s) {
        let i = s.length, shadda = '';
        while (i > 0) {
            const c = s[i - 1];
            if (SON_HAREKE.test(c)) { i--; continue; }
            if (c === '\u0651') { shadda = '\u0651'; i--; continue; }
            break;
        }
        return s.slice(0, i) + shadda;
    }
    // Kalıp HTML'i sonu </span> ile bitebilir (zâid vurgusu) — içindeki kuyruğu temizle
    function patternSonHarekeTemizle(html) {
        if (html.endsWith('</span>')) {
            return sonHarekeTemizle(html.slice(0, html.length - 7)) + '</span>';
        }
        return sonHarekeTemizle(html);
    }

    // ŞEDDE ÇÖZÜMÜ: yalnız işaretlerden oluşan zâid span'ları (ör. ّ / َّ / ٌّ)
    // bitişmeyi bozmayan .bo-damga span'ına çevrilir (harf ayrılmaz, işaret
    // damga animasyonuyla gelir). İşaretle BAŞLAYIP harf içerenlerde (ör. ِّلْ / ِي)
    // baştaki işaretler damgaya, kalan harfler normal zâide ayrılır.
    const YALNIZ_ISARET = /^[\u064B-\u0652\u0670]+$/;
    function zaidDamgaIsle(html) {
        return html.replace(/<span class="bo-zaid">([^<]+)<\/span>/g, (m, icerik) => {
            if (YALNIZ_ISARET.test(icerik)) {
                return '<span class="bo-damga" data-isaret="' + icerik + '"></span>';
            }
            const bas = icerik.match(/^[\u064B-\u0652\u0670]+/);
            if (bas) {
                return '<span class="bo-damga" data-isaret="' + bas[0] + '"></span>' +
                       '<span class="bo-zaid">' + icerik.slice(bas[0].length) + '</span>';
            }
            return m;
        });
    }

    function colorizeSafe(word, rootChars) {
        try {
            if (typeof ColorEngine !== 'undefined' && ColorEngine.colorize) {
                return ColorEngine.colorize(word, rootChars);
            }
        } catch (e) { /* renklendirilemezse düz göster */ }
        return `<span class="bo-ar">${word}</span>`;
    }

    // Bâb başlığından tablodaki satırı bul.
    // 1. yol: initBabIcons ikonlara title="<Bâb> Özellikleri" yazar — kesin eşleşme.
    // 2. yol (yedek): hücre metni bâb adını birebir içeriyorsa.
    function findBabRow(title) {
        for (const ic of document.querySelectorAll('td .info-icon')) {
            const t = (ic.getAttribute('title') || '').replace(' Özellikleri', '').trim();
            if (t === title) return ic.closest('tr');
        }
        for (const td of document.querySelectorAll('td[align="center"]')) {
            const raw = (td.innerText || td.textContent || '').replace(/ⓘ/g, '').trim();
            if (raw === title || raw.includes(title)) return td.closest('tr');
        }
        return null;
    }

    /* ------------------------------------------------------------------
       4) ODAK SATIRLARINI KUR (bâb başına bir kez; DOM'da kalıcı)
       ------------------------------------------------------------------ */
    function buildRows(babTitle, info, babRow) {
        const data = BO_DATA[babTitle];
        const colCount = babRow.children.length; // 7 (bâb adı + 6 kalıp)
        const rows = [];

        // a) 3 örnek kök satırı — sütunlar bâb satırıyla birebir hizalı.
        //    İşlev tuşları (geri dön + sıfırla) SVG ikon olarak İLK kök hücresinde.
        data.roots.forEach((rootObj, rIdx) => {
            const tr = document.createElement('tr');
            tr.className = 'bo-satir bo-ornek';
            const tdKok = document.createElement('td');
            tdKok.setAttribute('align', 'center');
            const kok = document.createElement('div');
            kok.className = 'bo-kok';
            kok.innerHTML = `<span class="bo-kok-yazi">${rootObj.word}</span>
                <svg class="bo-tik-ico" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="bt-halka" cx="9" cy="9" r="4.6" fill="none" stroke="currentColor" stroke-width="1.7"/>
                    <path class="bt-ok" d="M11.3 11.3l8 2.9-3.4 1.4-1.4 3.4z" fill="currentColor"/>
                </svg>`;
            kok.addEventListener('click', () => startAnim(babTitle, rIdx, kok));
            tdKok.appendChild(kok);
            tr.appendChild(tdKok);
            for (let c = 0; c < 6; c++) {
                const td = document.createElement('td');
                const hedef = document.createElement('div');
                hedef.className = 'bo-hedef';
                hedef.id = `bo-${slug(babTitle)}-${rIdx}-${c}`;
                td.appendChild(hedef);
                tr.appendChild(td);
            }
            rows.push(tr);
        });

        // b) Dilbilgisi satırı — 3. örneğin ALTINDA sürekli görünür (kaydırınca okunur);
        //    içerik kaliplartablosu'nun MEVCUT bilgi veritabanından (getBabInfo.desc).
        const bilgi = document.createElement('tr');
        bilgi.className = 'bo-satir bo-bilgi';
        const bilgiTd = document.createElement('td');
        bilgiTd.colSpan = colCount;
        bilgiTd.innerHTML = `<div class="bo-dilbilgisi">${info.desc || ''}</div>`;
        bilgi.appendChild(bilgiTd);
        rows.push(bilgi);

        return { rows, filled: [0, 0, 0], babRow };
    }

    /* ------------------------------------------------------------------
       5) ANİMASYON (konuanlatimimezid startAnim portu)
       ------------------------------------------------------------------ */
    // Sütunun kalıp şablonunu BÂB SATIRINDAKİ kutudan oku (data-original).
    // Mastar hücresinde 67/68'den AÇIK olan kutunun şablonu alınır.
    function kalipSablonu(st, col) {
        const td = st.babRow && st.babRow.children[col + 1];
        if (!td) return null;
        const kutular = Array.from(td.querySelectorAll('.glass-box'));
        if (!kutular.length) return null;
        const acik = kutular.find(b => !b.classList.contains('bo-kapali')) || kutular[0];
        return acik.getAttribute('data-original');
    }

    // Ham yerleştirme: ف/ع/ل → kök harfleri, SARF KURALI UYGULANMAZ.
    // İf'ılal (renk/kusur) bâbında illetli harf korunur, i'lal olmaz —
    // بيض → اِبْيَضَّ (motorun ecvef kuralı بَاضَّ üretirdi, o yüzden atlanır).
    function hamYerlestir(root, sablon) {
        return sablon
            .replace(/ف/g, '\u0001').replace(/ع/g, '\u0002').replace(/ل/g, '\u0003')
            .replace(/\u0001/g, root[0]).replace(/\u0002/g, root[1]).replace(/\u0003/g, root[2]);
    }

    function startAnim(babTitle, row, kokEl) {
        const data = BO_DATA[babTitle];
        const st = babRows[babTitle];
        const col = st.filled[row];
        if (col >= 6) return;
        const rootObj = data.roots[row];
        const target = document.getElementById(`bo-${slug(babTitle)}-${row}-${col}`);
        if (!target || target.dataset.animating === 'true') return;
        target.dataset.animating = 'true';

        // 1) Kök uçuşu — doğrudan hedefe (taşmasız easing)
        const s = kokEl.getBoundingClientRect();
        const t = target.getBoundingClientRect();
        const fly = document.createElement('div');
        fly.className = 'bo-ucus';
        fly.textContent = rootObj.word;
        Object.assign(fly.style, {
            left: s.left + 'px', top: s.top + 'px',
            width: s.width + 'px', height: s.height + 'px',
            fontSize: Math.min(s.height * 0.65, 50) + 'px'
        });
        document.body.appendChild(fly);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            fly.style.left = (t.left + (t.width - s.width) / 2) + 'px';
            fly.style.top = (t.top + (t.height - s.height) / 2) + 'px';
        }));

        // 2) Varınca: kalıp + zâid harfler sırayla süzülür
        // Mastar ve sonrası (sütun 3,4,5): son hareke gösterilmez
        const isimSutunu = col >= 3;
        setTimeout(() => {
            if (fly.parentNode) fly.parentNode.removeChild(fly);
            let patHtml = data.patterns[col](rootObj.word);
            if (isimSutunu) patHtml = patternSonHarekeTemizle(patHtml);
            patHtml = zaidDamgaIsle(patHtml);   // şedde vb. yalnız-işaretler → damga
            target.innerHTML = `<div class="bo-ar">${patHtml}</div>`;
            target.querySelectorAll('.bo-zaid').forEach((z, zi) => {
                z.style.transform = 'translateY(-40px) scale(1.35)';
                z.style.opacity = '0';
                setTimeout(() => {
                    z.style.transition = 'transform .5s cubic-bezier(.34,1.6,.5,1), opacity .3s ease-out';
                    z.style.transform = 'translateY(0) scale(1)';
                    z.style.opacity = '1';
                }, 80 + zi * 90);
            });
            // DAMGA: şedde/hareke, hedef harfin ÜZERİNE yukarıdan iner ve "mühürlenir".
            // Kelime metni bitişik kalır (kök ayrılmaz); işaret inince yerinde belirir.
            const arFont = getComputedStyle(target.querySelector('.bo-ar')).fontSize;
            target.querySelectorAll('.bo-damga').forEach((d, di) => {
                // İNİŞ HEDEFİ ÖLÇÜMÜ: işaret bir anlığına yerine yazılır (aynı
                // karede geri silindiği için EKRANA ÇİZİLMEZ), Range ile işaretin
                // GERÇEK konacağı nokta ölçülür — damga tam oraya iner.
                const isaret = d.getAttribute('data-isaret') || '';
                let dr = d.getBoundingClientRect();
                try {
                    d.textContent = isaret;
                    const rng = document.createRange();
                    rng.selectNodeContents(d);
                    const rr = rng.getBoundingClientRect();
                    if (rr && rr.height) dr = rr;
                    d.textContent = '';
                } catch (e) { d.textContent = ''; }
                const tr = target.getBoundingClientRect();
                const uc = document.createElement('div');
                uc.className = 'bo-damga-ucan';
                uc.textContent = isaret;
                // NİHAİ konum: işaretin gerçek yeri; kelimeyle AYNI font boyutu
                uc.style.left = (dr.left - tr.left + dr.width / 2) + 'px';
                uc.style.top = (dr.top - tr.top) + 'px';
                uc.style.fontSize = arFont;
                uc.style.opacity = '1';
                uc.style.transform = 'translate(-50%, -46px) scale(1.25)';
                target.appendChild(uc);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    // İniş .25s bekleyip .5s sürer (t≈750ms'de konar); solma inişten SONRA
                    uc.style.transition = 'transform .5s cubic-bezier(.34,1.3,.5,1) ' + (0.25 + di * 0.06) + 's, opacity .2s ease ' + (0.7 + di * 0.06) + 's';
                    uc.style.transform = 'translate(-50%, 0) scale(1)';
                    uc.style.opacity = '0';
                }));
                // Şedde metinde damga KONDUĞU ANDA belirir (önce değil)
                setTimeout(() => { d.textContent = d.getAttribute('data-isaret') || ''; d.classList.add('geldi'); }, 730 + di * 60);
                setTimeout(() => { if (uc.parentNode) uc.remove(); }, 980 + di * 60);
            });

            // 3) Nihai kelime: KÖKÜN VEZNE GİRİŞİNİ SARF MOTORU YAPAR —
            //    bâb satırındaki kalıp şablonu + applyRootToKalip (SarfEngine
            //    kuralları: i'lal, ecvef, misal, şedde...). Motor yoksa eski liste.
            setTimeout(() => {
                let kelime = null;
                const sablon = kalipSablonu(st, col);
                if (sablon) {
                    if (babTitle === "İf'ılal") {
                        // Renk/kusur bâbı: illetli harf korunur, i'lal YOK → ham yerleştirme
                        kelime = hamYerlestir(rootObj.word, sablon);
                    } else if (typeof applyRootToKalip === 'function') {
                        try { kelime = applyRootToKalip(rootObj.word, sablon); } catch (e) { kelime = null; }
                    }
                }
                if (!kelime) kelime = rootObj.derived[col];
                if (isimSutunu) kelime = sonHarekeTemizle(kelime);
                const renkli = colorizeSafe(kelime, rootObj.word.split(''));
                const anlam = rootObj.mean[col] && rootObj.mean[col] !== '-' ? `<div class="bo-anlam">${rootObj.mean[col]}</div>` : '';
                target.innerHTML = `<div class="bo-final bo-ar">${renkli}</div>${anlam}`;
                target.classList.add('bo-tamam');
                delete target.dataset.animating;
            }, 1050);

            st.filled[row]++;
        }, 640);
    }

    /* ------------------------------------------------------------------
       6) ODAK AÇ / KAPAT — tablo yerinde; diğer bâb satırları gizlenir
       ------------------------------------------------------------------ */
    // FLIP kaydırması: satır DOM'da anında taşınır ama gözle eski konumundan
    // yeni konumuna 1 saniyede SÜZÜLEREK gider (açılış-kapanış sürekliliği).
    function kaydir(row, eskiTop) {
        const delta = eskiTop - row.getBoundingClientRect().top;
        if (!delta) return;
        row.classList.add('bo-kayan');
        row.style.transition = 'none';
        row.style.transform = 'translateY(' + delta + 'px)';
        void row.offsetHeight;                                  // reflow
        row.style.transition = 'transform ' + window.BO_SURE;
        row.style.transform = '';
        const bitis = () => {
            row.style.transition = '';
            row.classList.remove('bo-kayan');
            row.removeEventListener('transitionend', bitis);
        };
        row.addEventListener('transitionend', bitis);
    }
    function openOdak(info) {
        const title = info.title;
        if (aktifBab === title) return;          // zaten odakta
        if (aktifBab) closeOdak();               // başka bâb odaktaysa önce kapat

        let st = babRows[title];
        let babRow = st ? st.babRow : findBabRow(title);
        if (!babRow || !babRow.isConnected) { babRow = findBabRow(title); }
        if (!babRow) return;                     // satır bulunamadı → hiçbir şey yapma

        if (!st) { st = babRows[title] = buildRows(title, info, babRow); }
        st.babRow = babRow;

        // FLIP başlangıcı: satırın taşınmadan ÖNCEKİ ekran konumu
        const eskiTop = babRow.getBoundingClientRect().top;
        // Satırın KENDİ şerit rengini yakala (en üste taşınınca nth-child değişse de korunacak)
        st.tdRenk = Array.from(babRow.children).map(td => getComputedStyle(td).backgroundColor);

        // Diğer bâb satırlarını gizle (yalnız bu tbody içinde)
        const tbody = babRow.parentElement;
        Array.from(tbody.children).forEach(tr => {
            if (tr === babRow || tr.classList.contains('bo-satir')) return;
            tr.dataset.boGizli = '1';
            tr.style.display = 'none';
        });

        // Bâb satırını TABLONUN EN ÜSTÜNE taşı (başlığın hemen altı) — kapatınca
        // geri koymak için orijinal konumunu (bo-satir olmayan sonraki satır) sakla.
        let n = babRow.nextElementSibling;
        while (n && n.classList.contains('bo-satir')) n = n.nextElementSibling;
        st.origNext = n;   // null olabilir (en sondaydı)
        if (tbody.firstElementChild !== babRow) tbody.insertBefore(babRow, tbody.firstElementChild);
        // Orijinal şerit rengini sabitle (nth-child artık 1 olsa da eski renk kalır)
        Array.from(babRow.children).forEach((td, i) => {
            if (st.tdRenk && st.tdRenk[i]) td.style.setProperty('background-color', st.tdRenk[i], 'important');
        });
        // Odaktayken bu bâbın kalıp yazıları büyük görünsün (2.5rem)
        babRow.classList.add('bo-odak-kalip');
        /* ⓘ simgesi ✕ olsun: aynı düğme odağı kapatıyor. */
        const ikon = babRow.querySelector('.info-icon');
        if (ikon) {
            ikon.classList.add('bo-kapat');
            if (!ikon.dataset.boBaslik) ikon.dataset.boBaslik = ikon.getAttribute('title') || '';
            ikon.setAttribute('title', 'Bilgiyi kapat');
        }

        /* Ekranda İLERİ düğmesi YOK (köke dokunmak zaten kolay) —
           ilerletme SUNUM KUMANDASININ ileri tuşundan geliyor, aşağıdaki
           keydown dinleyicisine bak. Bilgi adımı her açılışta sıfırlanır. */
        st.ileriBilgi = false;

        // Odak satırlarını bâb satırının hemen altına yerleştir / geri göster
        let ref = babRow;
        st.rows.forEach(r => {
            if (r.parentElement !== tbody || r.previousElementSibling !== ref) {
                tbody.insertBefore(r, ref.nextSibling);
            }
            ref = r;
        });
        // Tüm odak satırları görünür: 3 örnek + altında dilbilgisi (durum korunur)
        st.rows.forEach(r => { r.style.display = ''; });

        // Bâb satırı eski yerinden EN ÜSTE 1 saniyede süzülür (FLIP)
        kaydir(babRow, eskiTop);
        // Odak satırları, satır yukarı süzülürken arkasından sırayla belirir
        st.rows.forEach((r, i) => {
            r.classList.remove('bo-belir');
            void r.offsetWidth;                     // animasyonu yeniden tetikle
            r.style.animationDelay = (350 + i * 90) + 'ms';
            r.classList.add('bo-belir');
        });

        aktifBab = title;
        ustKilit();
        // NOT: scrollIntoView KULLANMA — RTL düzende yatay kaydırma yapıp tabloyu
        // görünümden kaçırıyor. Kullanıcı zaten bu satıra tıkladı; satır görünürde.
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
    }

    function closeOdak() {
        if (!aktifBab) return;
        /* ✕ yeniden ⓘ olur. */
        document.querySelectorAll('.info-icon.bo-kapat').forEach(ik => {
            ik.classList.remove('bo-kapat');
            if (ik.dataset.boBaslik !== undefined) {
                ik.setAttribute('title', ik.dataset.boBaslik);
                delete ik.dataset.boBaslik;
            }
        });
        const st = babRows[aktifBab];
        if (st) {
            // FLIP başlangıcı: satırın üstteki (taşınmadan önceki) ekran konumu
            const eskiTop = st.babRow ? st.babRow.getBoundingClientRect().top : null;
            // Odak satırlarını DOM'DAN ÇIKAR (bellekte kalır → durum korunur).
            // Tabloda gizli satır bırakmıyoruz: yoksa nth-child şerit renkleri
            // kayıp bâb satırları grileşiyordu.
            st.rows.forEach(r => { r.classList.remove('bo-belir'); r.remove(); });
            const tbody = st.babRow && st.babRow.parentElement;
            if (tbody) {
                // Bâb satırını orijinal konumuna geri koy
                if (st.origNext && st.origNext.parentElement === tbody) {
                    tbody.insertBefore(st.babRow, st.origNext);
                } else if (st.origNext === null) {
                    tbody.appendChild(st.babRow);
                }
                st.origNext = undefined;
                // Sabitlenen şerit rengini bırak (nth-child yine doğru rengi verir)
                Array.from(st.babRow.children).forEach(td => td.style.removeProperty('background-color'));
                // Kalıp yazıları eski boyutuna dönsün
                st.babRow.classList.remove('bo-odak-kalip');
                // Gizlenen bâb satırlarını geri getir
                Array.from(tbody.children).forEach(tr => {
                    if (tr.dataset.boGizli) { tr.style.display = ''; delete tr.dataset.boGizli; }
                });
                // Satır üstten ESKİ YERİNE 1 saniyede süzülür (açılışın tersi, kesintisiz)
                if (eskiTop !== null) kaydir(st.babRow, eskiTop);
            }
        }
        aktifBab = null;
        ustKilit();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.playClose) SoundEngine.playClose();
    }

    /* ---- İLERİ ADIMI ----
       Sıra: 1. kökün 6 hücresi → 2. kök → 3. kök → dilbilgisi → kapat.
       Her basış birebir KÖKE TIKLAMA işlevidir (startAnim'in kendi
       kilidi ve sırası neyse o); hangi satırın sırada olduğu filled
       sayacından okunur — durum bâbla birlikte saklandığı için odak
       kapatılıp açılsa da kaldığı yerden sürer. */
    function ileriAdim(title) {
        title = title || aktifBab;
        const st = title && babRows[title];
        if (!st) return;
        const r = st.filled.findIndex(n => n < 6);
        if (r >= 0) {
            const kok = st.rows[r] && st.rows[r].querySelector('.bo-kok');
            if (kok) kok.click();               /* köke tıklama işlevi */
            return;
        }
        /* Üç satır da dolu → önce EN ALTTAKİ dilbilgisi öne gelsin */
        if (!st.ileriBilgi) {
            st.ileriBilgi = true;
            const kutu = st.rows[3] && st.rows[3].querySelector('.bo-dilbilgisi');
            if (kutu) {
                const rec = kutu.getBoundingClientRect();
                /* scrollIntoView DEĞİL: RTL tabloda yatay kaydırıp görünümü
                   kaçırıyor (openOdak'taki not) — yalnız dikey kaydırılır. */
                if (rec.bottom > window.innerHeight - 12) {
                    window.scrollBy({ top: rec.bottom - window.innerHeight + 28, behavior: 'smooth' });
                }
                kutu.classList.remove('bo-vurgu');
                void kutu.offsetWidth;
                kutu.classList.add('bo-vurgu');
            }
            if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) SoundEngine.playClick();
            return;
        }
        /* Bilgi de gösterildi → ⓘ'ye yeniden basılmış gibi kapat */
        closeOdak();
    }

    /* ---- ÜST ÇUBUK KİLİDİ ----
       Bâb odağı YA DA kalıp odağı (vezin örnekleri) açıkken üstteki
       kök/kronometre/kitap dalga vurguları durur, arama çalışmaz
       (CSS: body.ust-kilit). İki sistemin durumu birlikte okunur;
       kalıp odağı kendi tarafını window.KalipOdak ile bildirir. */
    function ustKilit() {
        const kalip = !!(window.KalipOdak && window.KalipOdak.aktif && window.KalipOdak.aktif());
        const aktif = !!aktifBab || kalip;
        document.body.classList.toggle('ust-kilit', aktif);
        /* Kahverengi kök levhası bâb odağında çekiliyor (CSS). */
        document.body.classList.toggle('bo-odak-acik', !!aktifBab);
        /* STOR PERDE yalnız örnek listesinde: sayfa kayar, başlık yapışır
           (CSS: body.ko-stor). Bâb ⓘ odağında gerek yok. */
        document.body.classList.toggle('ko-stor', kalip);
    }
    window.kidefUstKilit = ustKilit;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aktifBab) closeOdak();
    });

    /* SUNUM KUMANDASININ İLERİ TUŞU = KÖKE TIKLAMA.
       Kumandalar donanımsal olarak PageDown / sağ ok / boşluk gönderir
       (sayfanın eski kök-gezdirme dinleyicisiyle aynı tuş takımı — o
       özellik kaldırıldı, tuşlar buraya geçti). YALNIZ bâb odağı
       açıkken çalışır; sanal klavye açıkken ya da bir yazı alanı
       odaktayken karışmaz. Yakalama evresinde dinlenir ki sayfanın
       kaydırması ve öteki dinleyiciler araya girmesin. */
    document.addEventListener('keydown', (e) => {
        if (!aktifBab) return;
        if (e.key !== 'ArrowRight' && e.key !== 'PageDown' && e.key !== ' ') return;
        const kb = document.getElementById('keyboard-overlay');
        if (kb && (kb.style.display === 'flex' || kb.style.display === 'block')) return;
        const aktifEl = document.activeElement;
        if (aktifEl && (aktifEl.tagName === 'INPUT' || aktifEl.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        e.stopPropagation();
        ileriAdim(aktifBab);
    }, true);

    /* ------------------------------------------------------------------
       7) showBabInfo'YU DEVRAL — bilinen bâb ise tablo-içi odak, değilse eski ekran
       ------------------------------------------------------------------ */
    /* ------------------------------------------------------------------
       8) MUFA'ALE MASTARI (67/68) — ikisi birden açık kalmaz.
          Varsayılan: 68 kapalı (yalnız ortalı büyük numara), 67 açık.
          Seçilen kökte 68. kalıp TANIMLIYSA: 68 açık, 67 kapalı.
       ------------------------------------------------------------------ */
    function refKutusu(refId) {
        return Array.from(document.querySelectorAll('#tab2 .glass-box')).find(b => {
            const r = b.querySelector('.ref');
            return r && parseInt(r.innerText.trim()) === refId;
        });
    }
    function mastar6768Guncelle(root) {
        const b67 = refKutusu(67), b68 = refKutusu(68);
        if (!b67 || !b68) return;
        let kul68 = false;
        try {
            if (root && root.length === 3 && typeof sozlukVerileri !== 'undefined' && sozlukVerileri[root]) {
                kul68 = Object.keys(sozlukVerileri[root]).some(k => parseInt(k) === 68);
            }
        } catch (e) { /* veri yoksa varsayılan kalır */ }
        const acik = kul68 ? b68 : b67, kapali = kul68 ? b67 : b68;
        acik.classList.remove('bo-kapali'); acik.classList.add('bo-acik6768');
        kapali.classList.remove('bo-acik6768'); kapali.classList.add('bo-kapali');
    }
    // MERAK TIKLAMASI: kapalı kutuya (67 ya da 68) tıklayınca takas olur —
    // tıklanan açılır, diğeri küçülür. (Capture aşamasında yakalanır ki sayfanın
    // kendi kutu-tıklama davranışı bu "açma" tıklamasında tetiklenmesin.)
    function mastar6768TiklamaKur() {
        [67, 68].forEach(id => {
            const kutu = refKutusu(id);
            if (!kutu || kutu.dataset.bo6768) return;
            kutu.dataset.bo6768 = '1';
            kutu.addEventListener('click', (e) => {
                if (!kutu.classList.contains('bo-kapali')) return;   // açıkken normal davranış
                e.stopImmediatePropagation();
                e.preventDefault();
                const diger = refKutusu(id === 67 ? 68 : 67);
                kutu.classList.remove('bo-kapali'); kutu.classList.add('bo-acik6768');
                if (diger) { diger.classList.remove('bo-acik6768'); diger.classList.add('bo-kapali'); }
            }, true);
        });
    }
    // Başlangıç durumu (68 kapalı) — DOM hazır olunca
    const mastar6768Baslat = () => { mastar6768Guncelle(null); mastar6768TiklamaKur(); };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mastar6768Baslat);
    } else { mastar6768Baslat(); }
    // Kök onaylanınca güncelle (confirmRoot → highlightEasterEggBoxes yolu)
    const origHighlight = window.highlightEasterEggBoxes;
    if (typeof origHighlight === 'function') {
        window.highlightEasterEggBoxes = function (root) {
            origHighlight(root);
            mastar6768Guncelle(root);
        };
    }
    // Tablo sıfırlanınca varsayılana dön
    const origResetTable = window.resetTableOnly;
    if (typeof origResetTable === 'function') {
        window.resetTableOnly = function () {
            const sonuc = origResetTable.apply(this, arguments);
            mastar6768Guncelle(null);
            return sonuc;
        };
    }

    /* DIŞA AÇILAN KAPI: kalıp odağı (sarf/kalipliste.js) ile bâb odağı
       aynı satırları taşıyıp gizlediği için ikisi AYNI ANDA açık olamaz.
       Öbürünün kapanabilmesi için buradan küçük bir kapı veriyoruz —
       Escape olayı taklit etmek yerine doğrudan kendi kapanışını çağırsın
       (Escape'i perde ve kalıp odağı da dinliyor, yarış çıkardı). */
    window.BabOdak = {
        kapat: closeOdak,
        aktif: function () { return aktifBab; },
        ileri: function () { ileriAdim(aktifBab); }
    };

    const origShowBabInfo = window.showBabInfo;
    window.showBabInfo = function (rawName) {
        let info = null;
        try { if (typeof getBabInfo === 'function') info = getBabInfo(rawName); } catch (e) { /* yoksay */ }
        if (info && BO_DATA[info.title]) {
            // AÇ/KAPAT: aynı bâbın ⓘ ikonuna tekrar basılırsa odak kapanır
            if (aktifBab === info.title) { closeOdak(); } else { openOdak(info); }
            return;
        }
        if (typeof origShowBabInfo === 'function') origShowBabInfo(rawName);
    };
})();
