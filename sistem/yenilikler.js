/* ===========================================================================
   YENİLİKLER — öğretmen profilindeki "güncelleme" şeridi
   ---------------------------------------------------------------------------
   Siteye yeni bir özellik eklendiğinde buraya BİR SATIR eklenir; öğretmen
   profiline girdiğinde mor bir şerit hâlinde görür, "Okudum" deyince kapanır.

   YENİ KAYIT EKLERKEN:
     · Listenin BAŞINA ekle (en yenisi üstte).
     · id ARTAN ve BENZERSİZ olmalı — okundu bilgisi id ile tutuluyor.
       Var olan bir id'yi değiştirme, yoksa herkeste yeniden "okunmadı"
       hâline döner.
     · tarih 'YYYY-MM-DD'. Yalnız gösterim için; sıralama id ile yapılır.
     · metin tek cümle olsun; şerit uzarsa okunmuyor.

   Okundu bilgisi tarayıcıda: localStorage['kidef_yenilik_gorulen'] = en son
   okunan id. Hesaba değil cihaza bağlıdır; öğretmen başka cihazdan girerse
   şeridi bir kez daha görür — bilinçli tercih, sunucuya yazmıyoruz.
   =========================================================================== */
(function () {
    'use strict';

    var ANAHTAR = 'kidef_yenilik_gorulen';

    /* EN YENİSİ EN ÜSTTE */
    var LISTE = [
        {
            id: 6,
            tarih: '2026-08-24',
            baslik: 'Haftalık plana "Yöneticinin tavsiyesi"',
            metin: 'Haftalık Kazanım Takibi sekmesine bir tavsiye penceresi eklendi. ' +
                   'Seviyenin sınıfına göre 36 haftalık kazanım önerisi ve yıl sonu ' +
                   'hedefi çıkar; beğendiğin haftaları işaretleyip kendi planına ' +
                   'aktarırsın, yazdıklarının üstüne izinsiz yazılmaz.'
        },
        {
            id: 5,
            tarih: '2026-08-22',
            baslik: 'Kalıplar Tablosu artık tahtada canlı yarışıyor',
            metin: 'Bilgi yarışmasına "Kalıplar Tablosu" konusu eklendi (459 soru). ' +
                   'Yarışma sırasında tablonun kendisi tahtada açılıyor: soru gelince ' +
                   'kök yükleniyor ve hedef hücre yanıyor, cevap açılınca kelime türüyor.'
        },
        {
            id: 4,
            tarih: '2026-08-22',
            baslik: 'Öğrenciler karekodla hesapsız katılabiliyor',
            metin: 'Bilgi yarışmasına katılmak için artık öğrencinin hesabı olması ' +
                   'gerekmiyor: karekodu okutup adını yazması yeterli.'
        },
        {
            id: 3,
            tarih: '2026-08-22',
            baslik: 'Soru süresi zorluğa göre ayarlanabiliyor',
            metin: 'Bilgi yarışmasında kolay 30, orta 45, zor 60 saniye olarak ' +
                   'geliyor; ana ekrandaki kronometre düğmesinden her seviye için ' +
                   'elle de süre yazabilirsin.'
        },
        {
            id: 2,
            tarih: '2026-08-15',
            baslik: '6. sınıfa bilgi yarışması',
            metin: '6. sınıf için 173 soruluk bilgi yarışması hazır — sorular ' +
                   'muhâdese ders verisinden üretildi, kelimeler derslerle birebir aynı.'
        },
        {
            id: 1,
            tarih: '2026-08-15',
            baslik: 'Sınıf etkinlikleri yeniden düzenlendi',
            metin: 'İmam Hatip sınıf kartları kolaydan zora sıralandı; 5 ve 9. ' +
                   'sınıflara Alfabe etkinliği eklendi.'
        }
    ];

    function okunanId() {
        try { return parseInt(localStorage.getItem(ANAHTAR), 10) || 0; }
        catch (e) { return 0; }
    }

    window.KidefYenilikler = {
        /* Tüm kayıtlar (en yeni önce) */
        hepsi: function () { return LISTE.slice(); },
        /* Bu cihazda henüz okunmamış olanlar */
        yeniler: function () {
            var o = okunanId();
            return LISTE.filter(function (y) { return y.id > o; });
        },
        sonId: function () { return LISTE.length ? LISTE[0].id : 0; },
        /* Hepsini okundu say */
        okundu: function () {
            try { localStorage.setItem(ANAHTAR, String(LISTE.length ? LISTE[0].id : 0)); }
            catch (e) {}
        },
        /* Geliştirme sırasında sınamak için: id'ler benzersiz ve azalan mı? */
        denetle: function () {
            var h = [], gor = {};
            LISTE.forEach(function (y, i) {
                if (gor[y.id]) h.push('yinelenen id: ' + y.id);
                gor[y.id] = 1;
                if (!y.baslik || !y.metin) h.push(y.id + ': başlık/metin eksik');
                if (!/^\d{4}-\d{2}-\d{2}$/.test(y.tarih || '')) h.push(y.id + ': tarih biçimi');
                if (i && LISTE[i - 1].id <= y.id) h.push('sıra bozuk: ' + y.id);
            });
            return h;
        }
    };
})();
