#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SÖZLÜK SİMÜLASYONU — 6. SINIF VERİSİNİ YENİDEN ÜRETİR
=====================================================
Kaynak : muhadese/veri/6_1_1 … 6_6_3 ders cümleleri (18 ders, 6 ünite)
Çıktı  : sozluk/veri/sozluk_6.js

NASIL ÇALIŞIR
  1) Ders verisindeki her cümlenin Arapçası ARAPÇA SIRAYA dizilir ve
     kelimelere bölünür.
  2) Her kelime SÖZLÜKÇE'den (aşağıdaki LEX) çözülür:
        (aranan biçim, dilbilgisi kategorisi, Türkçe karşılık)
     "Aranan biçim" üç harfli sarf kökü değil, SÖZLÜKTE ARANAN yalın
     biçimdir: ال atılır, bitişik zamir atılır, çoğul tekile döner,
     fiil maziye çevrilir.  SKIP = sorulmayan kelime (özel ad vb.).
  3) Cümle, içindeki EN ZOR olgunun seviyesine yazılır:
        1 → ال takısı ve yalın isim
        2 → bitişik zamir · sayı · kırık çoğul
        3 → sâlim fiil (muzariden maziye)
        4 → illetli · mehmuz · mezid fiil
  4) Seviye ipuçları, o seviyenin KENDİ örnekleriyle yazılır.

SÖZLÜKÇE iki kaynaktan gelir: eski sozluk_5/6/7/9 dosyalarındaki
çözümler (eski cümleler birebir aynı kalsın diye) + bu dosyadaki EK.
Ders verisi değişirse bu betik yeniden çalıştırılır.
"""
import json, re, io, os, subprocess, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # site kökü
# 1-4. ünitenin cümleleri dosyada ZATEN çözülmüş hâlde duruyor; onlara
# dokunulmaz (öğretmenin elinden geçmiş veri). Bu betik yalnız 5. ve 6.
# ünitenin cümlelerini çözüp mevcut seviyelerin SONUNA ekler.
DERSLER = ['6_5_1','6_5_2','6_5_3','6_6_1','6_6_2','6_6_3']

HAREKE = re.compile(r'[ً-ْـٰ]')
ARAPCA = re.compile(r'[^ء-ي]')
def yalin(t):
    return ARAPCA.sub('', HAREKE.sub('', t or ''))

# =====================================================================
# SÖZLÜKÇE EKİ — 5. ve 6. ünitede ilk kez geçen biçimler
#   yalın_biçim: (aranan_biçim, kategori, türkçe)
# =====================================================================
EK = {
# ---- 5. ÜNİTE · Kutsal Mekânlar -------------------------------------
'المسجد':   ('مسجد', 'isim (ال takılı)', 'mescit'),
'مسجد':     ('مسجد', 'isim', 'mescit'),
'ومسجد':    ('مسجد', 'atıf harfi + isim', 've mescidi'),
'مساجد':    ('مسجد', 'isim (kırık çoğul)', 'mescitler'),
'الحرام':   ('حرام', 'isim (sıfat · ال takılı)', 'Haram'),
'الكعبة':   ('كعبة', 'isim (ال takılı · dişil)', 'Kâbe'),
'الشريفة':  ('شريف', 'isim (sıfat · ال takılı · dişil)', 'Şerefli'),
'الشريف':   ('شريف', 'isim (sıfat · ال takılı)', 'Şerif'),
'مكة':      ('SKIP', 'isim (özel · yer)', 'Mekke'),
'المكرمة':  ('SKIP', 'isim (özel · yer)', '(Mükerreme)'),
'المدينة':  ('مدينة', 'isim (ال takılı · dişil)', 'Medine'),
'المنورة':  ('SKIP', 'isim (özel · yer)', '(Münevvere)'),
'مدينة':    ('مدينة', 'isim (dişil)', 'şehir'),
'القدس':    ('SKIP', 'isim (özel · yer)', 'Kudüs'),
'فلسطين':   ('SKIP', 'isim (özel · yer)', 'Filistin'),
'السعودية': ('SKIP', 'isim (özel · yer)', 'Suudi Arabistan'),
'أنقرة':    ('SKIP', 'isim (özel · yer)', 'Ankara'),
'تركيا':    ('SKIP', 'isim (özel · yer)', 'Türkiye'),
'بولو':     ('SKIP', 'isim (özel · yer)', 'Bolu'),
'قونيا':    ('SKIP', 'isim (özel · yer)', 'Konya'),
'إسطنبول':  ('SKIP', 'isim (özel · yer)', 'İstanbul'),
'بورصة':    ('SKIP', 'isim (özel · yer)', 'Bursa'),
'الأردن':   ('SKIP', 'isim (özel · yer)', 'Ürdün'),
'قباء':     ('SKIP', 'isim (özel · yer)', 'Kuba'),
'أحد':      ('SKIP', 'isim (özel · yer)', 'Uhud'),
'حراء':     ('SKIP', 'isim (özel · yer)', 'Hira'),
'عرفات':    ('SKIP', 'isim (özel · yer)', 'Arafat'),
'الصفا':    ('SKIP', 'isim (özel · yer)', 'Safa'),
'والمروة':  ('SKIP', 'atıf harfi + isim (özel · yer)', 've Merve'),
'البراق':   ('SKIP', 'isim (özel)', 'Burak'),
'النبوي':   ('نبوي', 'isim (sıfat · ال takılı)', 'Nebevî'),
'القبلتين': ('قبلة', 'isim (ikil · ال takılı)', 'iki kıble'),
'القبلي':   ('قبلي', 'isim (sıfat · ال takılı)', 'Kıblî'),
'القدسي':   ('قدسي', 'isim (sıfat · ال takılı)', 'Kudsî'),
'جبل':      ('جبل', 'isim', 'dağ'),
'جبال':     ('جبل', 'isim (kırık çoğul)', 'dağlar'),
'غار':      ('غار', 'isim', 'mağara'),
'قبلة':     ('قبلة', 'isim (dişil)', 'kıble'),
'قبة':      ('قبة', 'isim (dişil)', 'kubbe'),
'وقبة':     ('قبة', 'atıf harfi + isim (dişil)', 've kubbesi'),
'الصخرة':   ('صخرة', 'isim (ال takılı · dişil)', 'Sahra (kaya)'),
'الحرم':    ('حرم', 'isim (ال takılı)', 'Harem'),
'والحجر':   ('حجر', 'atıf harfi + isim (ال takılı)', 've taş'),
'المعلق':   ('معلق', 'isim (ال takılı)', 'Asılı'),
'والجامع':  ('جامع', 'atıf harfi + isim (ال takılı)', 've cami'),
'حائط':     ('حائط', 'isim (ism-i fâil)', 'duvarı'),
'الأقصى':   ('أقصى', 'isim (ال takılı · maksûr)', 'Aksâ'),
'الأماكن':  ('مكان', 'isim (kırık çoğul · ال takılı)', 'mekânları'),
'المقدسة':  ('مقدس', 'isim (sıfat · ال takılı · dişil)', 'kutsal'),
'مقدسة':    ('مقدس', 'isim (sıfat · dişil)', 'kutsal'),
'مقدس':     ('مقدس', 'isim (sıfat)', 'kutsaldır'),
'المسلمون': ('مسلم', 'isim (düzenli çoğul · ال takılı)', 'Müslüman erkekler'),
'مسلمون':   ('مسلم', 'isim (düzenli çoğul)', 'Müslümanlar'),
'المسلمين': ('مسلم', 'isim (düzenli çoğul · ال takılı)', 'Müslümanların'),
'للمسلمين': ('مسلم', 'harf-i cer + isim (düzenli çoğul)', 'Müslümanlar için'),
'مسلم':     ('مسلم', 'isim', 'Müslüman erkek'),
'والمسلمات':('مسلمة', 'atıf harfi + isim (dişil çoğul · ال takılı)', 've Müslüman kadınlar'),
'مسلمات':   ('مسلمة', 'isim (dişil çoğul)', 'Müslüman kadınlar'),
'مسلمة':    ('مسلمة', 'isim (dişil)', 'Müslüman kadın'),
'القرآن':   ('قرآن', 'isim (ال takılı)', "Kur'ân"),
'الكريم':   ('كريم', 'isim (sıfat · ال takılı)', 'Kerîm'),
'المتحف':   ('متحف', 'isim (ال takılı)', 'müzeyi'),
'الإسلام':  ('إسلام', 'isim (ال takılı · mastar)', 'İslam'),
'تاريخ':    ('تاريخ', 'isim (mastar)', 'tarihi'),
'عاصمة':    ('عاصمة', 'isim (ism-i fâil · dişil)', 'başkent'),
'الهجرة':   ('هجرة', 'isim (ال takılı · dişil)', 'hicret'),
'النبي':    ('نبي', 'isim (ال takılı)', 'Peygamber'),
'أول':      ('أول', 'isim (sıra sayı)', 'ilk'),
'مهم':      ('مهم', 'isim (sıfat)', 'önemli'),
'ومهمة':    ('مهم', 'atıf harfi + isim (sıfat · dişil)', 've önemli'),
'المهمة':   ('مهم', 'isim (sıfat · ال takılı · dişil)', 'önemli'),
'بعيد':     ('بعيد', 'isim (sıfat)', 'uzaktır'),
'بعيدة':    ('بعيد', 'isim (sıfat · dişil)', 'uzaktır'),
'قريبة':    ('قريب', 'isim (sıfat · dişil)', 'yakındır'),
'هنا':      ('هنا', 'zarf (mekân)', 'burası'),
'حول':      ('حول', 'zarf (mekân)', 'etrafında'),
'خلف':      ('خلف', 'zarf (mekân)', 'arkasında'),
'يسار':     ('يسار', 'isim', 'solunda'),
'عن':       ('عن', 'harf-i cer', '-den'),
'أم':       ('أم', 'bağlaç', 'yoksa'),
'وهي':      ('هي', 'atıf harfi + zamir', 've o'),
'وهو':      ('هو', 'atıf harfi + zamir', 've o'),
'ليست':     ('ليس', 'nakıs fiil (dişil)', 'değildir'),
'بالضبط':   ('ضبط', 'harf-i cer + isim (mastar)', 'tam olarak'),
'تقع':      ('وقع', 'fiil (muzari · misal · dişil)', 'bulunur'),
'يقع':      ('وقع', 'fiil (muzari · misal)', 'bulunur'),
'توجد':     ('وجد', 'fiil (muzari · meçhul · misal · dişil)', 'bulunur'),
'يقف':      ('وقف', 'fiil (muzari · misal)', 'durur'),
'تقف':      ('وقف', 'fiil (muzari · misal · dişil)', 'durur'),
'أقف':      ('وقف', 'fiil (muzari · misal · mütekellim)', 'dururum'),
'يسعى':     ('سعى', 'fiil (muzari · nakıs)', "sa'y eder"),
'يطوف':     ('طاف', 'fiil (muzari · ecvef)', 'tavaf eder'),
'يزور':     ('زار', 'fiil (muzari · ecvef)', 'ziyaret eder'),
'يعبر':     ('عبر', 'fiil (muzari)', 'geçer'),
'عاش':      ('عاش', 'fiil (mazi · ecvef)', 'yaşadı'),
'صلى':      ('صلى', 'fiil (mazi · nakıs · mezid)', 'salât etsin'),
'عليه':     ('SKIP', 'harf-i cer + bitişik zamir', 'ona'),
'وسلم':     ('SKIP', 'atıf harfi + fiil (mazi · mezid)', 've selam versin'),
'تعرف':     ('عرف', 'fiil (muzari · muhatap)', 'biliyorsun'),
'فتح':      ('فتح', 'fiil (mazi)', 'fethetti'),
'سأرجع':    ('رجع', 'fiil (muzari · istikbal · mütekellim)', 'döneceğim'),
'الحاسوب':  ('حاسوب', 'isim (ال takılı)', 'bilgisayar'),
'المنضدة':  ('منضدة', 'isim (ال takılı · dişil)', 'masa'),
'الكرة':    ('كرة', 'isim (ال takılı · dişil)', 'top'),
'تحت':      ('تحت', 'zarf (mekân)', 'altında'),
'الباب':    ('باب', 'isim (ال takılı)', 'kapı'),
'الشجرة':   ('شجرة', 'isim (ال takılı · dişil)', 'ağaç'),
'الرجل':    ('رجل', 'isim (ال takılı)', 'adam'),
# ---- 6. ÜNİTE · Ulaşım ----------------------------------------------
'ارجعوا':   ('رجع', 'fiil (emir · cemi)', 'dönün'),
'بالحافلة': ('حافلة', 'harf-i cer + isim (ال takılı · dişil)', 'otobüsle'),
'بالقطار':  ('قطار', 'harf-i cer + isim (ال takılı)', 'trenle'),
'القطار':   ('قطار', 'isim (ال takılı)', 'tren'),
'المترو':   ('مترو', 'isim (ال takılı)', 'metro'),
'الشاحنة':  ('شاحنة', 'isim (ال takılı · dişil)', 'kamyon'),
'السفينة':  ('سفينة', 'isim (ال takılı · dişil)', 'gemi'),
'المطار':   ('مطار', 'isim (ال takılı)', 'havalimanı'),
'مطار':     ('مطار', 'isim', 'havalimanı'),
'المحطة':   ('محطة', 'isim (ال takılı · dişil)', 'istasyon'),
'الموقف':   ('موقف', 'isim (ال takılı)', 'durak'),
'البحر':    ('بحر', 'isim (ال takılı)', 'deniz'),
'السماء':   ('سماء', 'isim (ال takılı · dişil)', 'gökyüzü'),
'الطريق':   ('طريق', 'isim (ال takılı)', 'yol'),
'شوارع':    ('شارع', 'isim (kırık çoğul)', 'caddeleri'),
'الجامعة':  ('جامعة', 'isim (ال takılı · dişil)', 'üniversite'),
'الأستاذ':  ('أستاذ', 'isim (ال takılı · meslek)', 'öğretmen'),
'حادثا':    ('حادث', 'isim (tenvinli)', 'bir kaza'),
'حادث':     ('حادث', 'isim', 'kazası'),
'سيارته':   ('سيارة', 'isim (dişil) + bitişik zamir (o)', 'arabasını'),
'سيارتك':   ('سيارة', 'isim (dişil) + bitişik zamir (sen)', 'arabanı'),
'أجرة':     ('أجرة', 'isim (dişil)', 'ücreti'),
'التذاكر':  ('تذكرة', 'isim (kırık çoğul · ال takılı)', 'biletlerin'),
'تذكرة':    ('تذكرة', 'isim (dişil)', 'bileti'),
'رخيصة':    ('رخيص', 'isim (sıfat · dişil)', 'ucuzdur'),
'طويلة':    ('طويل', 'isim (sıfat · dişil)', 'uzundur'),
'مزدحمة':   ('مزدحم', 'isim (ism-i fâil · dişil)', 'kalabalıktır'),
'ذاهب':     ('ذاهب', 'isim (ism-i fâil)', 'gidiyor'),
'شرطي':     ('شرطي', 'isim (meslek)', 'polistir'),
'طيار':     ('طيار', 'isim (meslek)', 'pilottur'),
'السائق':   ('سائق', 'isim (ism-i fâil · ال takılı · meslek)', 'sürücü'),
'السائح':   ('سائح', 'isim (ism-i fâil · ال takılı)', 'turist'),
'الموظف':   ('موظف', 'isim (ال takılı · meslek)', 'memur'),
'الولد':    ('ولد', 'isim (ال takılı)', 'çocuğu'),
'الشجاع':   ('شجاع', 'isim (sıfat · ال takılı)', 'cesur'),
'المشاة':   ('مشاة', 'isim (ال takılı · çoğul)', 'yayalar'),
'المرور':   ('مرور', 'isim (ال takılı · mastar)', 'trafik'),
'إشارات':   ('إشارة', 'isim (dişil çoğul)', 'işaretleri'),
'معلومات':  ('معلومة', 'isim (dişil çoğul)', 'bilgi'),
'ممنوع':    ('ممنوع', 'isim (ism-i mef\'ûl)', 'yasaktır'),
'الوقوف':   ('وقوف', 'isim (ال takılı · mastar)', 'durmak'),
'للعبور':   ('عبور', 'harf-i cer + isim (ال takılı · mastar)', 'geçmeye'),
'لون':      ('لون', 'isim', 'rengi'),
'لونه':     ('لون', 'isim + bitişik zamir (o)', 'rengi'),
'لونها':    ('لون', 'isim + bitişik zamir (o · dişil)', 'rengi'),
'الخط':     ('خط', 'isim (ال takılı)', 'çizginin'),
'أبيض':     ('أبيض', 'isim (sıfat · renk)', 'beyazdır'),
'أحمر':     ('أحمر', 'isim (sıfat · renk)', 'kırmızıdır'),
'أصفر':     ('أصفر', 'isim (sıfat · renk)', 'sarıdır'),
'أزرق':     ('أزرق', 'isim (sıfat · renk)', 'mavidir'),
'بني':      ('بني', 'isim (sıfat · renk)', 'kahverengidir'),
'الأصفر':   ('أصفر', 'isim (sıfat · renk · ال takılı)', 'sarı'),
'اليسار':   ('يسار', 'isim (ال takılı)', 'sola'),
'اليمين':   ('يمين', 'isim (ال takılı)', 'sağa'),
'بجانب':    ('جانب', 'harf-i cer + isim', 'yanındadır'),
'اركب':     ('ركب', 'fiil (emir)', 'bin'),
'وانزل':    ('نزل', 'atıf harfi + fiil (emir)', 've in'),
'واذهب':    ('ذهب', 'atıf harfi + fiil (emir)', 've git'),
'اتجه':     ('اتجه', 'fiil (emir · mezid · misal)', 'dön'),
'يسوق':     ('ساق', 'fiil (muzari · ecvef)', 'sürüyor'),
'تسير':     ('سار', 'fiil (muzari · ecvef · dişil)', 'ilerler'),
'تطير':     ('طار', 'fiil (muzari · ecvef · dişil)', 'uçar'),
'تهبط':     ('هبط', 'fiil (muzari · dişil)', 'iniyor'),
'تركب':     ('ركب', 'fiil (muzari · dişil)', 'biniyor'),
'ينتظر':    ('انتظر', 'fiil (muzari · mezid)', 'bekliyor'),
'يستعد':    ('استعد', 'fiil (muzari · mezid · mudâaf)', 'hazırlanır'),
'أنقذ':     ('أنقذ', 'fiil (mazi · mezid)', 'kurtardı'),
'رأيت':     ('رأى', 'fiil (mazi · mehmuz · nakıs · mütekellim)', 'gördüm'),
'شاهدت':    ('شاهد', 'fiil (mazi · mezid · mütekellim)', 'gördüm'),
'أسافر':    ('سافر', 'fiil (muzari · mezid · mütekellim)', 'seyahat ediyorum'),
'نزل':      ('نزل', 'fiil (mazi)', 'indi'),
'الفندق':   ('فندق', 'isim (ال takılı)', 'otele'),
'الصيفية':  ('صيفي', 'isim (sıfat · ال takılı · dişil)', 'yaz'),
'شاطئ':     ('شاطئ', 'isim (mehmuz)', 'kıyısı'),
'الآثار':   ('أثر', 'isim (kırık çoğul · ال takılı)', 'eserleri'),
'التاريخية':('تاريخي', 'isim (sıfat · ال takılı · dişil)', 'tarihî'),
'العمرة':   ('عمرة', 'isim (ال takılı · dişil)', 'umreye'),
'سأعمل':    ('عمل', 'fiil (muzari · istikbal · mütekellim)', 'çalışacağım'),
'شركة':     ('شركة', 'isim (dişil)', 'şirkette'),
'يذهب':     ('ذهب', 'fiil (muzari)', 'gidiyor'),
'المصنع':   ('مصنع', 'isim (ال takılı)', 'fabrikaya'),
'ستذهب':    ('ذهب', 'fiil (muzari · istikbal · muhatap)', 'gideceksin'),
'أمس':      ('أمس', 'zarf (zaman)', 'dün'),
'التلفاز':  ('تلفاز', 'isim (ال takılı)', 'televizyon'),
'كتبت':     ('كتب', 'fiil (mazi · mütekellim)', 'yazdım'),
'واجبي':    ('واجب', 'isim + bitişik zamir (ben)', 'ödevimi'),
'المكتبة':  ('مكتبة', 'isim (ال takılı · dişil)', 'kütüphaneye'),
'القادم':   ('قادم', 'isim (ism-i fâil · ال takılı)', 'gelecek'),
'سألعب':    ('لعب', 'fiil (muzari · istikbal · mütekellim)', 'oynayacağım'),
'الماضي':   ('ماضي', 'isim (ism-i fâil · ال takılı · nakıs)', 'geçen'),
'ذهبوا':    ('ذهب', 'fiil (mazi · cemi)', 'gittiler'),
'يتجول':    ('تجول', 'fiil (muzari · mezid · ecvef)', 'geziniyor'),
'اهتم':     ('اهتم', 'fiil (emir · mezid · mudâaf)', 'önem ver'),
'بقواعد':   ('قاعدة', 'harf-i cer + isim (kırık çoğul)', 'kurallarına'),
'تقد':      ('قاد', 'fiil (nehiy · ecvef · muhatap)', 'sürme'),
'بسرعة':    ('سرعة', 'harf-i cer + isim (dişil)', 'hızlı'),
'استخدام':  ('استخدام', 'isim (mastar · mezid)', 'kullanmak'),
'الهاتف':   ('هاتف', 'isim (ism-i fâil · ال takılı)', 'telefonu'),
'الجوال':   ('جوال', 'isim (sıfat · ال takılı)', 'cep'),
'بالجوال':  ('جوال', 'harf-i cer + isim (ال takılı)', 'cep telefonuyla'),
'أثناء':    ('أثناء', 'zarf (zaman)', 'sırasında'),
'السير':    ('سير', 'isim (ال takılı · mastar)', 'sürüş'),
'يجب':      ('وجب', 'fiil (muzari · misal)', 'gerekir'),
'حزام':     ('حزام', 'isim', 'kemeri'),
'الأمان':   ('أمان', 'isim (ال takılı · mastar)', 'emniyet'),
'ينام':     ('نام', 'fiil (muzari · ecvef)', 'uyuyor'),
'المقعد':   ('مقعد', 'isim (ال takılı)', 'koltukta'),
'يستمع':    ('استمع', 'fiil (muzari · mezid)', 'dinliyor'),
'الموسيقى': ('موسيقى', 'isim (ال takılı · maksûr)', 'müzik'),
'تتكلم':    ('تكلم', 'fiil (muzari · mezid · dişil)', 'konuşuyor'),
}

# =====================================================================
# 1) Eski dosyalardan sözlükçe (aynı kelime aynı çözülsün)
# =====================================================================
def eskiSozlukce():
    kod = r'''
const fs=require('fs'),vm=require('vm');
const out={};
for (const f of ['sozluk_5','sozluk_6','sozluk_7','sozluk_9']) {
  const c={window:{},console};vm.createContext(c);
  vm.runInContext(fs.readFileSync(process.argv[1]+'/sozluk/veri/'+f+'.js','utf8'),c);
  Object.values(c.window.SOZLUK_SINIF)[0].seviyeler.forEach(lv=>lv.sentences.forEach(s=>{
    s.arabic.forEach((w,i)=>{
      const k=w.text.replace(/[ً-ْـ]/g,'').replace(/[^ء-ي]/g,'');
      if(k && !out[k]) out[k]=[w.root,w.category,(s.turkish||[])[i]||''];
    });
  }));
}
process.stdout.write(JSON.stringify(out));
'''
    p = subprocess.run(['node','-e',kod,KOK], capture_output=True, text=True)
    if p.returncode: sys.exit('node hatası: '+p.stderr[:400])
    return json.loads(p.stdout)

def eskiSeviyeler():
    """Mevcut sozluk_6.js'teki dört seviyeyi (cümleler + ipuçları) okur."""
    kod = r'''
const fs=require('fs'),vm=require('vm');
const c={window:{},console};vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1]+'/sozluk/veri/sozluk_6.js','utf8'),c);
process.stdout.write(JSON.stringify(c.window.SOZLUK_SINIF['6'].seviyeler));
'''
    p = subprocess.run(['node','-e',kod,KOK], capture_output=True, text=True)
    if p.returncode: sys.exit('node hatası: '+p.stderr[:400])
    ham = json.loads(p.stdout)
    # Bu betiğin daha önce eklediği cümleler 'ders' alanı taşır; yeniden
    # çalıştırıldığında çoğalmasınlar diye atılır (betik yinelenebilir).
    for lv in ham:
        lv['sentences'] = [c for c in lv['sentences'] if not c.get('ders')]
    return {lv['level']: lv for lv in ham}

# =====================================================================
# 2) Ders cümlelerini oku
# =====================================================================
def dersCumleleri():
    cikti = []
    for d in DERSLER:
        yol = os.path.join(KOK, 'muhadese', 'veri', d + '.js')
        src = io.open(yol, encoding='utf-8').read()
        i = src.index('{', src.index('window.data'))
        veri = json.loads(src[i:src.rindex('}')+1])
        for c in veri.get('sentence', []):
            kel = sorted(c['words'], key=lambda w: w['order'])
            ar = ' '.join(w['ar'] for w in kel)
            tr = ' '.join(w['tr'] for w in c['words'])
            cikti.append({'ders': d, 'ar': ar, 'tr': tr})
    return cikti

# =====================================================================
# 3) Seviye kuralı
# =====================================================================
def seviye(kategoriler):
    s = 1
    for k in kategoriler:
        if 'fiil' in k or 'nehiy' in k:
            zor = any(x in k for x in ('ecvef','nakıs','misal','mehmuz','mezid',
                                       'mudâaf','lefif','meçhul'))
            s = max(s, 4 if zor else 3)
        elif ('bitişik zamir' in k or 'çoğul' in k or 'sayı' in k
              or 'ikil' in k or 'maksûr' in k):
            s = max(s, 2)
    return s

BASLIK = {
 1: 'Seviye 1 · <bdi class="ip-ar">ال</bdi> takısı ve yalın isim',
 2: 'Seviye 2 · Bitişik zamir, sayı ve çoğul',
 3: 'Seviye 3 · Fiiller: muzariden maziye',
 4: 'Seviye 4 · İlletli, mehmuz ve mezid fiiller',
}
KURAL = {
 1: ['Kelimenin başındaki <bdi class="ip-ar">ال</bdi> takısı atılır: '
     '<bdi class="ip-ar">الْمَسْجِدُ</bdi> → <bdi class="ip-ar">مسجد</bdi>.',
     'Harekeler ve sondaki tenvin yazılmaz.',
     'Harf-i cer kelimeye bitişikse o da atılır: '
     '<bdi class="ip-ar">بِالْقِطَارِ</bdi> → <bdi class="ip-ar">قطار</bdi>.',
     'Özel adlar (şehir, kişi) sözlükte aranmaz, atlanır.'],
 2: ['Önceki seviyenin kuralları geçerlidir.',
     'Bitişik zamir atılır: <bdi class="ip-ar">سَيَّارَتُهُ</bdi> → '
     '<bdi class="ip-ar">سيارة</bdi>.',
     'Çoğul, <b>tekil</b> biçimiyle aranır: '
     '<bdi class="ip-ar">مَسَاجِد</bdi> → <bdi class="ip-ar">مسجد</bdi>, '
     '<bdi class="ip-ar">الْمُسْلِمُونَ</bdi> → <bdi class="ip-ar">مسلم</bdi>.',
     'Dişil çoğulun tekili de dişildir: '
     '<bdi class="ip-ar">الْمُسْلِمَاتُ</bdi> → <bdi class="ip-ar">مسلمة</bdi>.'],
 3: ['Önceki seviyelerin kuralları geçerlidir.',
     'Fiil, sözlükte <b>mazi</b> (geçmiş zaman) biçimiyle aranır: '
     '<bdi class="ip-ar">يَعْبُرُ</bdi> → <bdi class="ip-ar">عبر</bdi>.',
     'Şahıs ve zaman ekleri atılır: '
     '<bdi class="ip-ar">سَأَلْعَبُ، ذَهَبُوا، كَتَبْتُ</bdi> → '
     '<bdi class="ip-ar">لعب، ذهب، كتب</bdi>.',
     'Emir ve nehiy de maziye çevrilir: '
     '<bdi class="ip-ar">اِرْكَبْ</bdi> → <bdi class="ip-ar">ركب</bdi>.'],
 4: ['Önceki seviyelerin kuralları geçerlidir.',
     '<b>Ecvef</b> (ortası illetli) fiilde harf geri gelir: '
     '<bdi class="ip-ar">يَسُوقُ</bdi> → <bdi class="ip-ar">ساق</bdi>, '
     '<bdi class="ip-ar">يَطُوفُ</bdi> → <bdi class="ip-ar">طاف</bdi>.',
     '<b>Misâl</b> fiilde düşen <bdi class="ip-ar">و</bdi> geri gelir: '
     '<bdi class="ip-ar">تَقَعُ</bdi> → <bdi class="ip-ar">وقع</bdi>, '
     '<bdi class="ip-ar">يَقِفُ</bdi> → <bdi class="ip-ar">وقف</bdi>.',
     '<b>Mezid</b> fiil, artan harfleriyle birlikte aranır: '
     '<bdi class="ip-ar">يَنْتَظِرُ</bdi> → <bdi class="ip-ar">انتظر</bdi>.'],
}

def ipucu(sv, ornekler):
    h = ('<h3 dir="ltr">' + BASLIK[sv] + '</h3>'
         '<p class="ip-sinif" dir="ltr">6. sınıf muhâdese cümlelerinden</p><ul>')
    h += ''.join('<li>' + k + '</li>' for k in KURAL[sv]) + '</ul>'
    if ornekler:
        h += '<p class="ip-bas" dir="ltr">Bu seviyeden örnekler:</p><ul class="ip-ornek">'
        for t, r, k in ornekler:
            h += ('<li><bdi class="ip-ar">' + t + '</bdi> → '
                  '<bdi class="ip-ar"><b>' + r + '</b></bdi> <i>(' + k + ')</i></li>')
        h += '</ul>'
    return h

# =====================================================================
# ÜRETİM
# =====================================================================
def main():
    LEX = eskiSozlukce()
    for k, v in EK.items():
        LEX[k] = list(v)                     # EK, eskisini EZER (daha doğru)

    eski = eskiSeviyeler()                 # 1-4. ünite: olduğu gibi kalır
    cumleler = dersCumleleri()
    kutu = {1: [], 2: [], 3: [], 4: []}
    cozulemeyen = {}
    kelimeSay = 0

    for c in cumleler:
        ar, kat, tr = [], [], []
        atla = False
        for t in c['ar'].split():
            y = yalin(t)
            if not y: continue
            g = LEX.get(y)
            if not g:
                cozulemeyen[y] = cozulemeyen.get(y, 0) + 1
                atla = True
                break
            ar.append({'text': t, 'root': g[0], 'category': g[1]})
            tr.append(g[2] or '—')
            kat.append(g[1])
        if atla or not ar: continue
        sv = seviye(kat)
        kutu[sv].append({'arabic': ar, 'turkish': tr, 'turkishFull': c['tr'],
                         'ders': c['ders']})
        kelimeSay += len(ar)

    if cozulemeyen:
        print('!! ÇÖZÜLEMEYEN (%d biçim, bu cümleler atlandı):' % len(cozulemeyen))
        print('   ' + ' '.join('%s(%d)' % (k, v) for k, v in
              sorted(cozulemeyen.items(), key=lambda x: -x[1])[:40]))

    ANAHTAR = {1: 'al', 2: 'zamir', 3: 'fiil', 4: 'illetli'}
    seviyeler = []
    for sv in (1, 2, 3, 4):
        gor, orn = set(), []
        for s in kutu[sv]:
            for i, w in enumerate(s['arabic']):
                if w['root'] == 'SKIP' or w['root'] in gor: continue
                ilgi = (('fiil' in w['category'] or 'nehiy' in w['category']) if sv >= 3
                        else ('çoğul' in w['category'] or 'bitişik zamir' in w['category']) if sv == 2
                        else 'ال takılı' in w['category'])
                if not ilgi: continue
                gor.add(w['root']); orn.append((w['text'], w['root'], w['category']))
                if len(orn) >= 6: break
            if len(orn) >= 6: break
        # Mevcut ipucu korunur; yalnız 5-6. ünite örnekleri EKLENİR.
        eskiSv = eski.get(sv, {})
        hint = eskiSv.get('hint') or ipucu(sv, [])
        hint = re.split(r'<p class="ip-bas" dir="ltr">5\. ve 6\.', hint)[0]
        if orn:
            ek = ('<p class="ip-bas" dir="ltr">5. ve 6. üniteden örnekler:</p>'
                  '<ul class="ip-ornek">' +
                  ''.join('<li><bdi class="ip-ar">%s</bdi> → '
                          '<bdi class="ip-ar"><b>%s</b></bdi> <i>(%s)</i></li>'
                          % (t, r, k) for t, r, k in orn) + '</ul>')
            hint = hint + ek
        seviyeler.append({'level': sv, 'anahtar': ANAHTAR[sv], 'hint': hint,
                          'sentences': eskiSv.get('sentences', []) + kutu[sv]})

    toplamCumle = sum(len(s['sentences']) for s in seviyeler)
    toplamKelime = sum(len(c['arabic']) for s in seviyeler for c in s['sentences'])
    veri = {'sinif': 6, 'cumle': toplamCumle, 'kelime': toplamKelime,
            'seviyeler': seviyeler}

    bas = ('/* =====================================================================\n'
           '   SÖZLÜK SİMÜLASYONU — 6. SINIF VERİSİ            (üretilmiş dosya)\n'
           '   ---------------------------------------------------------------------\n'
           '   KAYNAK: muhadese/veri/6_1_1 … 6_6_3 ders cümleleri — 6. sınıfın\n'
           '   ALTI ÜNİTESİ de kapsanıyor. Arapça ELLE YAZILMADI; ders verisinden\n'
           '   alındı.\n'
           '   KÖK: üç harfli sarf kökü değil, SÖZLÜKTE ARANAN yalın biçim\n'
           '   (ال atılır, bitişik zamir atılır, çoğul tekile döner, fiil maziye).\n'
           '   SEVİYELER: bu sınıfın verisinde gerçekten geçen olgulara göre\n'
           '   kuruldu; ipuçları da o seviyenin KENDİ örnekleriyle yazıldı.\n'
           '   ÜRETİCİ: sozluk/uret_sozluk6.py — ders verisi değişirse yeniden üretilmeli.\n'
           '   ===================================================================== */\n')
    govde = json.dumps(veri, ensure_ascii=False, indent=2)
    with io.open(os.path.join(KOK, 'sozluk', 'veri', 'sozluk_6.js'), 'w', encoding='utf-8') as f:
        f.write(bas)
        f.write('window.SOZLUK_SINIF = window.SOZLUK_SINIF || {};\n')
        f.write('window.SOZLUK_SINIF["6"] = ' + govde + ';\n')

    print('TOPLAM cümle %d · kelime %d   (5-6. üniteden eklenen: %d cümle)'
          % (veri['cumle'], veri['kelime'], sum(len(kutu[x]) for x in kutu)))
    for s in seviyeler:
        yeni = len(kutu[s['level']])
        print('  seviye %d (%-8s): %3d cümle  (+%d)'
              % (s['level'], s['anahtar'], len(s['sentences']), yeni))

main()
