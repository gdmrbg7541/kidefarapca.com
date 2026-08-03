/**
 * ==============================================================================
 * YAPAY ZEKA (AI) İÇİN VERİ EKLEME VE DÜZENLEME REFERANS REHBERİ
 * ==============================================================================
 * 
 * Bu dosya, projeye yeni kelimeler, fiiller, kökler ve kurallar eklenirken 
 * AI'ın (Yapay Zekanın) referans alması için hazırlanmıştır.
 * Lütfen veri eklerken buradaki yapıları, dizilimleri ve isimlendirme standartlarını 
 * (örn: cogulKalip DEĞİL, cogulId) BİREBİR uygulayın.
 * 
 * ANA DOSYALARIN GÖREVLERİ:
 * 1. verikaliplartablosu.js : Kök tabanlı (fiiller, ism-i fail, ism-i mekan, kırık çoğullar) detaylı türetmelerin ve kelime ailelerinin bulunduğu asıl veri dosyasıdır. Fiil çekimleri de buradadır.
 * 2. sozlukverileri.js : Kök bağımsız, sadece sözlükte ve tematik listelerde (hayvanlar, meyveler, renkler vb.) çıkması istenen "Bağımsız Sözlük Kelimeleri"nin eklendiği yerdir.
 */

// ==============================================================================
// ÖRNEK 1: VERİ KALIPLAR TABLOSUNA TAM DONANIMLI KÖK EKLEME (verikaliplartablosu.js)
// ==============================================================================
const ORNEK_KOK_EKLEME_VERIKALIPLAR = {
    // Kök her zaman BOŞLUKSUZ olarak yazılır. (Örn: "ت ج ر" DEĞİL, "تجر")
    "تجر": {
        // --- Mazi Fiil (Kalıp 1, 52, 58 vb.) ---
        1: { 
            // Mazi fiil çekimi: 15 elemanlı olmalıdır. (Huve'den Nahnu'ya)
            cekimi: ["تَجَرَ", "تَجَرَا", "تَجَرُوا", "تَجَرَتْ", "تَجَرَتَا", "تَجَرْنَ", "تَجَرْتَ", "تَجَرْتُمَا", "تَجَرْتُمْ", "تَجَرْتِ", "تَجَرْتُمَا", "تَجَرْتُنَّ", "تَجَرْتُ", "تَجَرْنَا", "تَجَرْنَا"],
            base: { 
                emoji: "🤝", 
                arText: "تَجَرَ", 
                trText: "Ticaret yaptı.",
                ornek: { ar: "تَاجَرَ فِي السُّوقِ", tr: "Çarşıda ticaret yaptı." }
            }
        },

        // --- Muzari Fiil (Kalıp 2, 53, 59 vb.) ---
        2: { 
            // Muzari fiil çekimi: 15 elemanlı olmalıdır.
            cekimi: ["يَتْجُرُ", "يَتْجُرَانِ", "يَتْجُرُونَ", "تَتْجُرُ", "تَتْجُرَانِ", "يَتْجُرْنَ", "تَتْجُرُ", "تَتْجُرَانِ", "تَتْجُرُونَ", "تَتْجُرِينَ", "تَتْجُرَانِ", "تَتْجُرْنَ", "أَتْجُرُ", "نَتْجُرُ", "نَتْجُرُ"],
            base: { 
                emoji: "📈", 
                arText: "يَتْجُرُ", 
                trText: "Ticaret yapar."
            }
        },

        // --- Emir Fiil (Kalıp 3, 54, 60 vb.) ---
        3: { 
            // Emir fiil çekimi: 6 elemanlı olmalıdır. (Ente, Entuma, Entum, Enti, Entuma, Entunne)
            cekimi: ["اُتْجُرْ", "اُتْجُرَا", "اُتْجُرُوا", "اُتْجُرِي", "اُتْجُرَا", "اُتْجُرْنَ"],
            base: { 
                emoji: "❗", 
                arText: "اُتْجُرْ", 
                trText: "Ticaret yap!"
            }
        },

        // --- İsm-i Fail (Kalıp 33 vb.) ve TEMATİK LİSTE (tip) / ÇOĞUL (cogulId) BAĞLANTISI ---
        33: {
            // DİKKAT 1: Bu kelimeyi "Meslekler" gibi tematik listelere otomatik dahil etmek için `tip: "meslek"` ataması yapılır. 
            // Sadece bu etiketi (tip) kalıbın içine eklemek yeterlidir, sozlukverileri'ne çoğaltmaya gerek yoktur!
            tip: "meslek",

            // DİKKAT 2: Eğer kelimenin özel bir Kırık Çoğulu (Düzensiz Çoğulu) varsa, 'kuralliCogul' YAZILMAZ!
            // Onun yerine o çoğulun tablodaki kalıp ID'si (cogulId) olarak verilir. (cogulKalip DEĞİL!)
            cogulId: 45,

            base: {
                emoji: "👨‍💼",
                arText: "تَاجِر",
                trText: "Tâcir / Tüccar (Ticaret yapan)."
            },

            // suggestsPlus: true -> Bu kelimenin sonuna "ة" (müennes/dişil takısı) vb. eklenebileceğini gösterir.
            suggestsPlus: true,

            // "ة" takısı ile oluşan yeni kelime. Buna kurallı dişil çoğul eklenebilir. (Çünkü Tacireler düzenli gelir)
            "ة": { 
                kuralliCogul: "disil", // تَاجِرَة => تَاجِرَات (Tacirat) otomatik üretir.
                emoji: "👩‍💼", 
                arText: "تَاجِرَة", 
                trText: "Kadın Tacir."
            }
        },

        // --- Kırık Çoğul (Kalıp 45) ---
        45: {
            base: {
                emoji: "👥",
                arText: "تُجَّار",
                trText: "Tüccarlar."
            }
        }
    }
};

// ==============================================================================
// ÖRNEK 2: KURALLI ÇOĞUL KULLANIMI (verikaliplartablosu.js)
// ==============================================================================
const ORNEK_KURALLI_COGUL = {
    "علم": {
        33: {
            // Eğer düzensiz/kırık çoğulu YOKSA, sonuna otomatik "ون" (Eril) veya "ات" (Dişil)
            // eklemesi için kuralliCogul parametresi kullanılır. (cogulId KULLANILMADIĞINDAN EMİN OLUN).
            kuralliCogul: "eril", // عَالِم => عَالِمُونَ (Alimler) otomatik üretir.
            base: {
                emoji: "🧠",
                arText: "عَالِم",
                trText: "Alim / Bilen."
            }
        }
    }
};

// ==============================================================================
// ÖRNEK 3: SÖZLÜK VERİLERİNE KÖK BAĞIMSIZ TEMATİK KELİME EKLEME (sozlukverileri.js)
// ==============================================================================
const ORNEK_SOZLUK_TEMATIK_KELIME = {
    // Anahtar (Key) ismi listelerde okunabilir olması için "Kategori: Kelime" formatındadır.
    // DİKKAT: Eğer kelime fiil kökenli bir "Meslek" ise (örn: Terzi, Çiftçi) buraya EKLENMEZ, 
    // doğrudan "verikaliplartablosu.js" içindeki köküne "tip: meslek" atanır.
    // Burası sadece kök yapısına uymayanlar (Kedi, Su, Metro vb.) içindir.
    
    "Hayvan: Kedi": {
        isDictOnly: true, // ZORUNLU: Bu kelimenin kalıplar tablosunda yeri olmadığını, saf sözlük kelimesi olduğunu belirtir.
        tip: "hayvan",    // ZORUNLU: Hangi tematik listeye gideceğini belirler. (örn: hayvan, renk, meyve, ulasim, meslek vb.)
        
        tekil: {
            base: {
                emoji: "🐈",
                arText: "قِطّ",
                trText: "Kedi",
                ornek: { ar: "اَلْقِطُّ نَائِمٌ", tr: "Kedi uyuyor." }
            }
        },
        
        // Eğer çoğulu varsa doğrudan 'cogul' objesi içinde belirtilir.
        cogul: {
            base: {
                emoji: "🐈‍⬛",
                arText: "قِطَط",
                trText: "Kediler"
            }
        }
    }
};

/**
 * ==============================================================================
 * KRİTİK KURALLAR VE HATIRLATMALAR (CRITICAL RULES)
 * ==============================================================================
 * 1. Kırık Çoğul Bağlantısı: `verikaliplartablosu.js` içerisinde bir kalıbı diğerine (çoğuluna) bağlamak için KESİNLİKLE `cogulId` kullanılmalıdır. `cogulKalip` KULLANMAYIN.
 * 2. Kurallı vs Kırık Çoğul Çakışması: Bir kelimenin `cogulId`'si varsa, base objesinin hemen dışında `kuralliCogul: "eril"` OLMAMALIDIR. İkisi aynı anda bulunamaz. (Ancak "ة" takısının kendi içinde `kuralliCogul: "disil"` olması normaldir).
 * 3. Kök İsimleri: `verikaliplartablosu.js` içindeki anahtarlar her zaman bitişik/boşluksuz (örn: "كتب") yazılır. Harfler arasında boşluk ("ك ت ب") BIRAKMAYIN.
 * 4. isDictOnly Kullanımı: Yalnızca `sozlukverileri.js` içerisine eklenen listelik/kategorik kelimelerde `isDictOnly: true` kullanılır.
 * 5. Fiil Çekimleri Array Uzunlukları: Mazi ve Muzari çekimleri her zaman 15 elemanlı olmalıdır. Emir çekimleri 6 elemanlı olmalıdır.
 */
