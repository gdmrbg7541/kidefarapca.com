#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GOOGLE ANALYTICS DENETİMİ VE EKLEME
===================================

Sitedeki HTML sayfalarını tarar; ölçüm kodu (GA4) olmayanlara ekler,
bozuk/çift kurulum varsa bildirir.

    python3 ga_ekle.py          → yalnız denetle ve raporla
    python3 ga_ekle.py --yaz    → eksik olanlara ekle

Kod bloğu <title> etiketinden hemen SONRA, <head> içine yazılır — sitedeki
mevcut sayfalarla aynı yere. Zaten kodu olan sayfaya ikinci kez eklenmez,
yani betiği istediğin kadar çalıştırabilirsin.

ATLANANLAR: öğrenciye/ziyaretçiye açık olmayan iç araç sayfaları ve yedek
kopyalar. Bunlara ölçüm koymak istatistiği kirletir. Listeyi aşağıdan
değiştirebilirsin.
"""

import io, os, re, sys, unicodedata

KOK = os.path.dirname(os.path.abspath(__file__))
OLCUM_ID = 'G-FV9JD15KLW'

# Taranmayan klasörler (altyapı / geçici / dış kopya)
ATLA_KLASOR = {'.git', 'node_modules', '_kidef_tmp', '_to_delete', 'functions'}

# Ölçüm KODU KONULMAYACAK sayfalar — iç araçlar ve yedekler.
# Yol, depo kökünden itibaren yazılır.
ATLA_SAYFA = {
    '_yolkontrol.html',                    # yol/yönlendirme kontrol aracı
    'surekontrol.html',                    # süre kontrol aracı
    'sozluk_veri_giris.html',              # yönetici veri giriş ekranı
}

def _nrm(y):
    """macOS dosya adlarını ayrık (NFD) saklar: 'ı', 'ğ', 'İ' gibi harfler
       burada yazdığımız birleşik (NFC) hâlle eşleşmez. Karşılaştırmadan
       önce iki tarafı da aynı biçime getiriyoruz."""
    return unicodedata.normalize('NFC', y)

ATLA_SAYFA = {_nrm(x) for x in ATLA_SAYFA}

BLOK = (
    '    <!-- Google Analytics (GA4) -->\n'
    '    <script async src="https://www.googletagmanager.com/gtag/js?id=' + OLCUM_ID + '"></script>\n'
    '    <script>\n'
    '      window.dataLayer = window.dataLayer || [];\n'
    '      function gtag(){dataLayer.push(arguments);}\n'
    '      gtag(\'js\', new Date());\n'
    '      gtag(\'config\', \'' + OLCUM_ID + '\');\n'
    '    </script>\n'
)

RE_BETIK  = re.compile(r'googletagmanager\.com/gtag/js')
RE_KONFIG = re.compile(r"gtag\(\s*['\"]config['\"]")
RE_TITLE  = re.compile(r'</title\s*>', re.I)
RE_HEAD   = re.compile(r'<head[^>]*>', re.I)


def oku(yol):
    return io.open(yol, encoding='utf-8', errors='ignore').read()


def sayfalar():
    cik = []
    for d, ks, fs in os.walk(KOK):
        ks[:] = [k for k in ks if k not in ATLA_KLASOR and not k.startswith('.')]
        for f in sorted(fs):
            if not f.endswith('.html'):
                continue
            tam = os.path.join(d, f)
            bagil = os.path.relpath(tam, KOK).replace(os.sep, '/')
            cik.append((bagil, tam))
    cik.sort()
    return cik


def ekle(metin):
    """Bloğu </title>'dan sonra, yoksa <head>'den sonra yerleştirir.
       Yerleştirilemezse None döner."""
    m = RE_TITLE.search(metin)
    if m:
        i = m.end()
        # </title> satırının sonuna kadar ilerle
        j = metin.find('\n', i)
        j = (j + 1) if j >= 0 else i
        return metin[:j] + BLOK + metin[j:]
    m = RE_HEAD.search(metin)
    if m:
        i = m.end()
        j = metin.find('\n', i)
        j = (j + 1) if j >= 0 else i
        return metin[:j] + BLOK + metin[j:]
    return None


def main():
    yazacak = '--yaz' in sys.argv
    var, yok, bozuk, atlanan, basarisiz, eklendi = [], [], [], [], [], []

    for bagil, tam in sayfalar():
        s = oku(tam)
        nb = len(RE_BETIK.findall(s))
        nk = len(RE_KONFIG.findall(s))

        if nb or nk:
            var.append(bagil)
            if nb != 1 or nk != 1:
                bozuk.append((bagil, 'betik=%d konfig=%d' % (nb, nk)))
            continue

        if _nrm(bagil) in ATLA_SAYFA:
            atlanan.append(bagil)
            continue

        yok.append(bagil)
        if yazacak:
            yeni = ekle(s)
            if yeni is None:
                basarisiz.append(bagil)
            else:
                io.open(tam, 'w', encoding='utf-8').write(yeni)
                eklendi.append(bagil)

    print('Ölçüm kimliği: %s' % OLCUM_ID)
    print('Kodu OLAN     : %d sayfa' % len(var))
    print('Kodu OLMAYAN  : %d sayfa' % len(yok))
    print('Bilerek atlanan: %d sayfa' % len(atlanan))
    for a in atlanan:
        print('   · %s' % a)

    if bozuk:
        print('\n! BOZUK / ÇİFT KURULUM (%d):' % len(bozuk))
        for a, n in bozuk:
            print('   · %s → %s' % (a, n))
    else:
        print('\nBozuk/çift kurulum yok.')

    if yok:
        print('\nKodu olmayanlar:')
        for a in yok:
            print('   · %s' % a)

    if not yazacak:
        print('\n(yalnız denetim — eklemek için: python3 ga_ekle.py --yaz)')
        return

    print('\nEKLENDİ: %d sayfa' % len(eklendi))
    if basarisiz:
        print('! <head>/<title> bulunamadığı için eklenemedi (%d):' % len(basarisiz))
        for a in basarisiz:
            print('   · %s' % a)


if __name__ == '__main__':
    main()
