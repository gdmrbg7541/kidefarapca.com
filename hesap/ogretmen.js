/* ==========================================
   ÖĞRETMEN (EĞİTMEN) BİLGİLERİ VE TAKVİMLERİ
   ========================================== */

function createDefaultSchedule() {
    const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    return days.map(day => ({
        name: day,
        slots: null,  // Dinamik slotlar eklenebilir
        data: {},     // '09:00': 'musait' veya 'dolu' şeklinde veriler tutar
        startH: 9,    // Mesai başlangıcı
        endH: 17      // Mesai bitişi
    }));
}

/* Öğretmen kimlik kartları — YALNIZ ad/telefon eşlemesi içindir.
   Takvim ve randevu ekranları oturumdaki e-postayı bu listeyle eşleştirip
   öğretmenin id'sini (hoca1/hoca2) buluyor; kimlik doğrulama Firebase Auth
   ile yapılır, bu dosyayla DEĞİL.

   ⚠️ Buraya bir daha ASLA parola yazılmasın: bu dosya siteyle birlikte
   herkese açık yayımlanıyor. Eskiden burada duran "password" alanları
   kaldırıldı; onları kullanan tek yer auth.js'teki Firebase'siz yedek
   giriş daliydi, o da (isFirebaseReady hep true olduğu için) ölü koddu ve
   birlikte temizlendi. */
window.DATA_OGRETMENLER = [
    {
        id: "hoca1",
        name: "Eğitmen Geylani",
        phone: "+905386482614",
        email: "hoca1@mail.com"
    },
    {
        id: "hoca2",
        name: "Geylani",
        phone: "Belirtilmedi",
        email: "gylndmrbg@gmail.com"
    }
];

// Öğretmenlerin haftalık takvimleri
window.DATA_TEACHER_SCHEDULES = {
    "hoca1": createDefaultSchedule(),
    "hoca2": createDefaultSchedule()
};
