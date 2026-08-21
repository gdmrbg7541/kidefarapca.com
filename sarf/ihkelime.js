/* =====================================================================
   İMAM HATİP KELİME LİSTELERİ            (sarf/ihkelime.js)
   ---------------------------------------------------------------------
   NE YAPAR
   index.html → İmam Hatip → "N. Sınıf Kelime Listeleri" kartı
   kaliplartablosu.html'i  ?liste=ih-N  ile açar. O sınıfın ÜNİTELERİ birer
   öbek, DERSLERİ birer kelime listesi olarak kelime ekranında belirir.

   NEDEN AYRI BİR EKRAN DEĞİL
   Listeler sayfanın KENDİ kategori mekanizmasına ekleniyor
   (renderThematicLists içindeki kanca → kategoriEkle). Böylece açılan
   ekran öteki konu listeleriyle birebir aynı: Liste Modu · Çalışma
   Kartları · Hafıza Oyunu (Geylani: "liste başlıkları hafıza çalışma
   kartları liste görünümü kısmıyla aynı olsun").

   KİTAP İKONU
   Doğrudan kitap ikonuna basıldığında bu listeler GÖRÜNMEZ; ekran eski
   konu listeleriyle açılır. İmam Hatip listeleri yalnız derin bağlantıyla
   gelindiğinde kurulur, o sırada da öteki konu listeleri gösterilmez —
   öğretmen tek bir sınıfın müfredatına bakar.

   VERİ
   Kelimeler muhadese/veri/<ders>.js içindeki `words` dizisinden okunur;
   ayrı bir kelime deposu yoktur. Sınıfın ders dosyaları derin bağlantı
   geldiğinde bir kez yüklenir.

   DERİN BAĞLANTI
   ?liste=ih-6        → 6. sınıfın bütün ünite/dersleri
   ?liste=ih-6-3-1    → aynısı + 3. ünite 1. dersin listesi açık gelir

   MÜFREDAT AĞACI muhadese/muhadese.js'teki educationData'dan üretildi;
   yeni ünite/ders eklenince burası da güncellenmeli.
   ===================================================================== */
(function () {
    'use strict';
    if (window.KidefIHKelime) return;

    var MUFREDAT = {
        "5": [
            {
                "ad": "1. Ünite: Merhaba | مَرْحَبًا",
                "dersler": [
                    {
                        "ad": "1. Ders: Arap Harfleri ve Sesler | اَلْحُرُوفُ الْعَرَبِيَّة وَالصَّوَائِت",
                        "id": "5_1_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Kendini Tanıtma | عِبَارَات التَّحِيَّة وَالتَّعَارُف وَالْوَدَاع",
                        "id": "5_1_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "2. Ünite: Sınıfım | صَفِّي",
                "dersler": [
                    {
                        "ad": "1. Ders: Sınıf Eşyaları | مُكَوِّنَاتُ الصَّفِّ",
                        "id": "5_2_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Kırtasiye Malzemeleri | أَدَوَات الدِّرَاسَة",
                        "id": "5_2_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "3. Ünite: Ailem | عَائِلَتِي",
                "dersler": [
                    {
                        "ad": "1. Ders: Aile Bireyleri | أَفْرَادُ العَائِلَة",
                        "id": "5_3_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Meslekler | الْمِهَن",
                        "id": "5_3_2",
                        "veri": true
                    },
                    {
                        "ad": "3. Ders: Sıfatlar | اَلصِّفَات",
                        "id": "5_3_3",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "4. Ünite: Güzel Evim | بَيْتِي الجَمِيل",
                "dersler": [
                    {
                        "ad": "1. Ders: Evin Bölümleri | أَقْسَامُ البَيْت",
                        "id": "5_4_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Evin Eşyaları | أَدَوَات البَيْت",
                        "id": "5_4_2",
                        "veri": true
                    },
                    {
                        "ad": "3. Ders: Sıfatlar | اَلصِّفَات",
                        "id": "5_4_3",
                        "veri": true
                    },
                    {
                        "ad": "4. Ders: Sayılar | اَلْأَعْدَاد",
                        "id": "5_4_4",
                        "veri": true
                    }
                ]
            }
        ],
        "6": [
            {
                "ad": "1. Ünite: Günlük Hayat | الحَياةُ اليَوْمِيَّة",
                "dersler": [
                    {
                        "ad": "1. Ders: Okulda | في المَدْرَسَة",
                        "id": "6_1_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Oyunlar | الأَلْعاب",
                        "id": "6_1_2",
                        "veri": true
                    },
                    {
                        "ad": "3. Ders: Evde | في البَيْت",
                        "id": "6_1_3",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "2. Ünite: Yiyecekler ve İçecekler | المَأْكولات وَالمَشْروبات",
                "dersler": [
                    {
                        "ad": "1. Ders: Kahvaltıda | في الفَطور",
                        "id": "6_2_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Öğle Yemeğinde | في الغَداء",
                        "id": "6_2_2",
                        "veri": true
                    },
                    {
                        "ad": "3. Ders: Akşam Yemeğinde | في العَشاء",
                        "id": "6_2_3",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "3. Ünite: Sağlık | الصِّحَّة",
                "dersler": [
                    {
                        "ad": "1. Ders: Vücut Organları | أَعْضاءُ الجِسْم",
                        "id": "6_3_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Hastanede | في المُسْتَشْفى",
                        "id": "6_3_2",
                        "veri": true
                    },
                    {
                        "ad": "3. Ders: Temizlik | النَّظافَة",
                        "id": "6_3_3",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "4. Ünite: Kıyafetler | المَلابِس",
                "dersler": [
                    {
                        "ad": "1. Ders: Mevsimler | الفُصول",
                        "id": "6_4_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Kışlık Kıyafetler | المَلابِسُ الشِّتَوِيَّة",
                        "id": "6_4_2",
                        "veri": true
                    },
                    {
                        "ad": "3. Ders: Yazlık Kıyafetler | المَلابِسُ الصَّيْفِيَّة",
                        "id": "6_4_3",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "5. Ünite: Kutsal Mekânlar | الأَماكِنُ المُقَدَّسَة",
                "dersler": [
                    {
                        "ad": "1. Ders: Mekke-i Mükerreme'de | في مَكَّةَ المُكَرَّمَة",
                        "id": "6_5_1",
                        "veri": false
                    },
                    {
                        "ad": "2. Ders: Medine-i Münevvere'de | في المَدينَةِ المُنَوَّرَة",
                        "id": "6_5_2",
                        "veri": false
                    },
                    {
                        "ad": "3. Ders: Kudüs-i Şerif'te | في القُدْسِ الشَّريف",
                        "id": "6_5_3",
                        "veri": false
                    }
                ]
            },
            {
                "ad": "6. Ünite: Ulaşım ve Trafik | المُواصَلات وَالمُرور",
                "dersler": [
                    {
                        "ad": "1. Ders: Ulaşım Araçları | وَسائِلُ المُواصَلات",
                        "id": "6_6_1",
                        "veri": false
                    },
                    {
                        "ad": "2. Ders: Trafik | المُرور",
                        "id": "6_6_2",
                        "veri": false
                    },
                    {
                        "ad": "3. Ders: Tatil Yolumda | في طَريقي إِلى العُطْلَة",
                        "id": "6_6_3",
                        "veri": false
                    }
                ]
            }
        ],
        "7": [
            {
                "ad": "1. Ünite: Bugün Ne Yaptım? | ماذا فَعَلْتُ اليَوْمَ؟",
                "dersler": [
                    {
                        "ad": "Günlük Etkinlikler ve Saatler | الأَنْشِطَةُ اليَوْمِيَّة وَالسّاعات",
                        "id": "7_1",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "2. Ünite: Alışveriş Zamanı | وَقْتُ التَّسَوُّق",
                "dersler": [
                    {
                        "ad": "Alışveriş, Miktar ve Sayılar | التَّسَوُّق وَالكَمِّيّات وَالأَعْداد",
                        "id": "7_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "3. Ünite: Nereye Seyahat Edelim? | إِلى أَيْنَ نُسافِرُ؟",
                "dersler": [
                    {
                        "ad": "Ulaşım ve Seyahat | المُواصَلات وَالسَّفَر",
                        "id": "7_3",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "4. Ünite: Şehrim ve Ülkem | مَدينَتي وَبَلَدي",
                "dersler": [
                    {
                        "ad": "Şehrim ve Ülkem | المَدينَة وَالبَلَد",
                        "id": "7_4",
                        "veri": true
                    }
                ]
            }
        ],
        "8": [
            {
                "ad": "1. Ünite: Güzel Bir Günüm | يَوْمي الجَميل",
                "dersler": [
                    {
                        "ad": "1. Ders: Günlük Etkinliklerim | أَنْشِطَتي اليَوْمِيَّة",
                        "id": "8_1_1",
                        "veri": false
                    },
                    {
                        "ad": "2. Ders: Zaman ve Saat İfadeleri | تَعْبيراتُ الوَقْتِ وَالسّاعَة",
                        "id": "8_1_2",
                        "veri": false
                    }
                ]
            },
            {
                "ad": "2. Ünite: Sağlıklı Hayatım | حَياتي الصِّحِّيَّة",
                "dersler": [
                    {
                        "ad": "1. Ders: Sağlık | الصِّحَّة",
                        "id": "8_2_1",
                        "veri": false
                    },
                    {
                        "ad": "2. Ders: Spor | الرِّياضَة",
                        "id": "8_2_2",
                        "veri": false
                    }
                ]
            },
            {
                "ad": "3. Ünite: İletişim Günlüğüm | يَوْمِيَّتي الاِتِّصالِيَّة",
                "dersler": [
                    {
                        "ad": "1. Ders: İletişim Araçları | وَسائِلُ الاِتِّصال",
                        "id": "8_3_1",
                        "veri": false
                    },
                    {
                        "ad": "2. Ders: İletişim İfadeleri | عِباراتُ الاِتِّصال",
                        "id": "8_3_2",
                        "veri": false
                    }
                ]
            },
            {
                "ad": "4. Ünite: Mezun Oluyorum | أَتَخَرَّجُ",
                "dersler": [
                    {
                        "ad": "1. Ders: Meslekler | المِهَن",
                        "id": "8_4_1",
                        "veri": false
                    },
                    {
                        "ad": "2. Ders: Mezuniyet Sonrası Hedeflerim | أَهْدافي بَعْدَ التَّخَرُّج",
                        "id": "8_4_2",
                        "veri": false
                    }
                ]
            }
        ],
        "9": [
            {
                "ad": "1. Ünite: Selamlaşma ve Tanışma | التَّحِيَّة والتَّعارُف",
                "dersler": [
                    {
                        "ad": "1. Ders: Selamlaşma | التَّحِيَّة",
                        "id": "9_1_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Tanışma | التَّعارُف",
                        "id": "9_1_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "2. Ünite: Okul ve Meslekler | المَدْرَسَة والمِهَن",
                "dersler": [
                    {
                        "ad": "1. Ders: Okuldayım | في المَدْرَسَة",
                        "id": "9_2_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Meslekler ve Ailem | المِهَن والأُسْرَة",
                        "id": "9_2_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "3. Ünite: Evdeyim | في البَيْت",
                "dersler": [
                    {
                        "ad": "1. Ders: Evdeyim | في البَيْت",
                        "id": "9_3_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Odamda | في غُرْفَتي",
                        "id": "9_3_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "4. Ünite: Günlük Hayat | الحَياة اليَوْمِيَّة",
                "dersler": [
                    {
                        "ad": "1. Ders: Bir Günüm | يَوْمي",
                        "id": "9_4_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Günlük Rutin | النِّظام اليَوْمِيّ",
                        "id": "9_4_2",
                        "veri": true
                    }
                ]
            }
        ],
        "10": [
            {
                "ad": "1. Ünite: Değerlerim | قِيَمي",
                "dersler": [
                    {
                        "ad": "1. Ders: Akrabalarım | أَقارِبي",
                        "id": "10_1_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Güzel Davranışlarım | مُعامَلاتي الحَسَنَة",
                        "id": "10_1_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "2. Ünite: Kendimi Keşfediyorum | أَكْتَشِفُ نَفْسي",
                "dersler": [
                    {
                        "ad": "1. Ders: Sağlığım | صِحَّتي",
                        "id": "10_2_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Hobilerim | هِواياتي",
                        "id": "10_2_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "3. Ünite: Seyahat Etmeyi Seviyorum | أُحِبُّ السِّياحَة",
                "dersler": [
                    {
                        "ad": "1. Ders: Tarihi ve Turistik Mekanlar | الأَماكِن التّاريخِيَّة والسِّياحِيَّة",
                        "id": "10_3_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Ulaşım Araçları | المُواصَلات",
                        "id": "10_3_2",
                        "veri": true
                    }
                ]
            },
            {
                "ad": "4. Ünite: Tatile Hazırlanıyorum | أَسْتَعِدُّ لِلْعُطْلَة",
                "dersler": [
                    {
                        "ad": "1. Ders: Mevsimlere Göre Giyinirim | أَلْبَسُ حَسَبَ الفُصول",
                        "id": "10_4_1",
                        "veri": true
                    },
                    {
                        "ad": "2. Ders: Alışveriş Yapıyorum | أَتَسَوَّقُ",
                        "id": "10_4_2",
                        "veri": true
                    }
                ]
            }
        ]
    };
    var SINIFLAR = Object.keys(MUFREDAT);
    var IKON = ['\ud83c\udf1f', '\ud83c\udf40', '\ud83c\udfaf', '\ud83e\udded', '\ud83d\udd11', '\ud83c\udf08'];

    var _kip = null;          /* {sinif, ders} — derin bağlantı geldiyse dolu */
    var _kelime = {};         /* ders id → [{ar,tr}] */
    var _kuruldu = false;

    function ayir(ad) {
        var i = String(ad).indexOf('|');
        return i < 0 ? { tr: String(ad).trim(), ar: '' }
                     : { tr: ad.slice(0, i).trim(), ar: ad.slice(i + 1).trim() };
    }

    /* ---------- ders dosyalarını yükle ---------- */
    function dosyaYukle(id, bitti) {
        var s = document.createElement('script');
        s.src = 'muhadese/veri/' + id + '.js?v=1';
        s.onload = function () {
            var d = window.data;
            _kelime[id] = (d && Array.isArray(d.words)) ? d.words.slice() : [];
            window.data = undefined;
            s.remove(); bitti();
        };
        s.onerror = function () { _kelime[id] = []; s.remove(); bitti(); };
        document.head.appendChild(s);
    }
    function sinifYukle(sinif, bitti) {
        var idler = [];
        (MUFREDAT[sinif] || []).forEach(function (u) {
            u.dersler.forEach(function (d) { if (d.veri && d.id && !_kelime[d.id]) idler.push(d.id); });
        });
        if (!idler.length) { bitti(); return; }
        var kalan = idler.length;
        idler.forEach(function (id) { dosyaYukle(id, function () { if (--kalan === 0) bitti(); }); });
    }

    /* ---------- sayfanın kendi kategori tablolarına ekle ---------- */
    function anahtar(sinif, ui, di) { return 'ih_' + sinif + '_' + (ui + 1) + '_' + (di + 1); }
    function grupAnahtar(sinif, ui) { return 'ihg_' + sinif + '_' + (ui + 1); }

    /* renderThematicLists her çizimde çağırıyor. Kip kapalıysa hiçbir şey
       yapmıyor; açıkken ÖTEKİ listeler boşaltılıp yalnız bu sınıf kalıyor. */
    function kategoriEkle(kategoriler) {
        if (!_kip) return;
        var sinif = _kip.sinif;
        for (var k in kategoriler) kategoriler[k].items = [];      /* sadece bu sınıf görünsün */
        (MUFREDAT[sinif] || []).forEach(function (u, ui) {
            u.dersler.forEach(function (d, di) {
                var kel = (d.id && _kelime[d.id]) ? _kelime[d.id] : [];
                if (!kel.length) return;                            /* verisi yoksa liste açılmaz */
                var da = ayir(d.ad), k = anahtar(sinif, ui, di);
                kategoriler[k] = kategoriler[k] || {};
                kategoriler[k].title = da.tr;
                kategoriler[k].arTitle = da.ar;
                kategoriler[k].icon = IKON[ui % IKON.length];
                kategoriler[k].grup = grupAnahtar(sinif, ui);
                kategoriler[k].items = kel.map(function (w) {
                    return { rootKey: w.ar, arText: w.ar, trText: w.tr || '', emoji: '' };
                });
            });
        });
    }

    /* Öbek başlıkları (ünite adları) ve kategori tanımları, sayfanın kendi
       küresel tablolarına yazılıyor — sıralama ve gruplama oradan okunuyor. */
    function tablolariHazirla(sinif) {
        if (typeof kategoriGruplari === 'undefined' || typeof kategoriTanimlari === 'undefined') return;
        (MUFREDAT[sinif] || []).forEach(function (u, ui) {
            var ua = ayir(u.ad);
            kategoriGruplari[grupAnahtar(sinif, ui)] = {
                title: ua.tr + (ua.ar ? '  ' + ua.ar : ''), icon: IKON[ui % IKON.length]
            };
            u.dersler.forEach(function (d, di) {
                var da = ayir(d.ad);
                kategoriTanimlari[anahtar(sinif, ui, di)] = {
                    title: da.tr, arTitle: da.ar, icon: IKON[ui % IKON.length],
                    grup: grupAnahtar(sinif, ui), items: []
                };
            });
        });
    }

    /* ---------- derin bağlantı ---------- */
    function baslat() {
        var m = /[?&]liste=ih-(\d+)(?:-(\d+))?(?:-(\d+))?/.exec(location.search);
        if (!m || !MUFREDAT[m[1]]) return;
        _kip = { sinif: m[1], ders: (m[2] ? anahtar(m[1], +m[2] - 1, (+(m[3] || 1)) - 1) : null) };
        sinifYukle(_kip.sinif, function () {
            tablolariHazirla(_kip.sinif);
            _kuruldu = true;
            if (typeof openVerbModal === 'function') openVerbModal();
            else if (typeof renderThematicLists === 'function') renderThematicLists();
            /* Liste birkaç kez yeniden çizilebiliyor; istenen ders
               paneli açılana kadar kısa aralıklarla deneniyor. */
            if (_kip.ders) {
                /* Kelime ekranı açılışta birkaç kez yeniden çiziliyor ve
                   çizim açık paneli kapatıyor; panel açık kalana kadar
                   her turda yeniden açılıyor. */
                var deneme = 0;
                var vur = setInterval(function () {
                    dersAc(_kip.ders);
                    if (++deneme > 16) clearInterval(vur);
                }, 250);
            }
        });
    }
    /* İstenen dersin panelini sayfanın kendi akordiyonuyla aç */
    function dersAc(k) {
        var bas = document.getElementById('header-' + k);
        if (!bas) return false;
        if (!bas.classList.contains('active')) bas.click();
        bas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return bas.classList.contains('active');
    }

    window.KidefIHKelime = {
        kategoriEkle: kategoriEkle,
        kip: function () { return _kip; },
        mufredat: MUFREDAT
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat);
    else baslat();
})();
