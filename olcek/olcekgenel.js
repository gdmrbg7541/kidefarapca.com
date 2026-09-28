/* ==================================================================
   GENEL ÖLÇEKLER — kitap ölçeği olmayan sınıflar için
   ------------------------------------------------------------------
   Bu dosya ELLE yazılmıştır ve Türkçedir. Kitap karekodundan inen MEB
   ölçekleri olcek/olcekveri.js'te (üretilmiş dosya) durur; buradakiler
   onların yerine geçmez, yalnız o sınıf için henüz ölçek girilmemişse
   kullanılır.

   Dört derece, MEB rubriklerindeki alışılmış sıralamadadır:
       1 Geliştirilmeli · 2 Orta · 3 İyi · 4 Çok iyi
   ================================================================== */
window.OLCEK_GENEL = [
    {
        id: 'genel-proje',
        tur: 'proje',
        baslikTr: 'Proje Değerlendirme Ölçeği (genel)',
        olcutler: [
            {
                tr: 'Konuyu kavrama ve içerik',
                dereceler: [
                    { puan: 1, tr: 'Konu anlaşılmamış; içerik eksik ya da konuyla ilgisiz.' },
                    { puan: 2, tr: 'Konunun bir bölümü işlenmiş; önemli eksikler var.' },
                    { puan: 3, tr: 'Konu büyük ölçüde işlenmiş; küçük eksikler var.' },
                    { puan: 4, tr: 'Konu eksiksiz ve doğru biçimde işlenmiş.' }
                ]
            },
            {
                tr: 'Arapça dil kullanımı',
                dereceler: [
                    { puan: 1, tr: 'Yazım ve dil bilgisi hataları anlamayı engelliyor.' },
                    { puan: 2, tr: 'Sık hata var; bazı bölümler anlaşılmıyor.' },
                    { puan: 3, tr: 'Az sayıda hata var; metin anlaşılıyor.' },
                    { puan: 4, tr: 'Yazım, hareke ve dil bilgisi doğru; anlatım akıcı.' }
                ]
            },
            {
                tr: 'Kaynak kullanımı ve araştırma',
                dereceler: [
                    { puan: 1, tr: 'Kaynak kullanılmamış ya da belirtilmemiş.' },
                    { puan: 2, tr: 'Tek kaynağa dayanmış; kaynaklar eksik gösterilmiş.' },
                    { puan: 3, tr: 'Birkaç kaynak kullanılmış ve gösterilmiş.' },
                    { puan: 4, tr: 'Çeşitli kaynaklar kullanılmış, tamamı düzgün gösterilmiş.' }
                ]
            },
            {
                tr: 'Düzen ve sunum',
                dereceler: [
                    { puan: 1, tr: 'Dağınık; bölümler ayrılmamış, okunaklı değil.' },
                    { puan: 2, tr: 'Düzen zayıf; başlıklar ve sıra karışık.' },
                    { puan: 3, tr: 'Düzenli; küçük biçim eksikleri var.' },
                    { puan: 4, tr: 'Baştan sona düzenli, temiz ve okunaklı.' }
                ]
            },
            {
                tr: 'Özgünlük ve yaratıcılık',
                dereceler: [
                    { puan: 1, tr: 'Tamamen alıntı; kendi katkısı yok.' },
                    { puan: 2, tr: 'Çoğu alıntı; kendi katkısı sınırlı.' },
                    { puan: 3, tr: 'Kendi yorumu ve örnekleri var.' },
                    { puan: 4, tr: 'Özgün fikirler, kendi örnekleri ve yaratıcı anlatım var.' }
                ]
            },
            {
                tr: 'Zamanında teslim ve süreç',
                dereceler: [
                    { puan: 1, tr: 'Çok geç teslim; süreçte çalışma izlenmemiş.' },
                    { puan: 2, tr: 'Geç teslim; ara aşamalar aksamış.' },
                    { puan: 3, tr: 'Zamanında teslim; ara aşamaların çoğu tamam.' },
                    { puan: 4, tr: 'Zamanında teslim; planına uygun, düzenli çalışmış.' }
                ]
            }
        ]
    },
    {
        id: 'genel-performans',
        tur: 'performans',
        baslikTr: 'Performans / Ders Etkinlikleri Değerlendirme Ölçeği (genel)',
        olcutler: [
            {
                tr: 'Göreve hazırlık',
                dereceler: [
                    { puan: 1, tr: 'Hazırlıksız; gerekli araç ve bilgi yok.' },
                    { puan: 2, tr: 'Kısmen hazırlıklı; önemli eksikler var.' },
                    { puan: 3, tr: 'Hazırlıklı; küçük eksikler var.' },
                    { puan: 4, tr: 'Eksiksiz hazırlanmış, göreve hâkim.' }
                ]
            },
            {
                tr: 'Arapça ifade (konuşma / yazma)',
                dereceler: [
                    { puan: 1, tr: 'İfadeler anlaşılmıyor; kelime dağarcığı yetersiz.' },
                    { puan: 2, tr: 'Kısa ve hatalı ifadeler; yardımla anlaşılıyor.' },
                    { puan: 3, tr: 'Anlaşılır ifadeler; az sayıda hata var.' },
                    { puan: 4, tr: 'Doğru ve akıcı ifadeler; uygun kelimeler seçilmiş.' }
                ]
            },
            {
                tr: 'Okuma / telaffuz',
                dereceler: [
                    { puan: 1, tr: 'Harf ve harekeler çoğunlukla yanlış okunuyor.' },
                    { puan: 2, tr: 'Sık duraklama ve hata var.' },
                    { puan: 3, tr: 'Çoğunlukla doğru okuyor; birkaç hata var.' },
                    { puan: 4, tr: 'Harf ve harekeleri doğru, akıcı okuyor.' }
                ]
            },
            {
                tr: 'Derse katılım ve iş birliği',
                dereceler: [
                    { puan: 1, tr: 'Etkinliğe katılmıyor.' },
                    { puan: 2, tr: 'Ara sıra, hatırlatınca katılıyor.' },
                    { puan: 3, tr: 'İstekli katılıyor, arkadaşlarıyla çalışıyor.' },
                    { puan: 4, tr: 'Etkinliği sürükleyecek kadar etkin; iş birliğine örnek.' }
                ]
            },
            {
                tr: 'Görevi tamamlama',
                dereceler: [
                    { puan: 1, tr: 'Görev tamamlanmamış.' },
                    { puan: 2, tr: 'Görevin bir bölümü tamamlanmış.' },
                    { puan: 3, tr: 'Görev tamamlanmış; küçük eksikler var.' },
                    { puan: 4, tr: 'Görev eksiksiz ve zamanında tamamlanmış.' }
                ]
            }
        ]
    }
];
