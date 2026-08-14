/* ============================================================
   LL IKON SISTEMI - ozel animasyonlu SVG ikonlar (emoji yerine)
   Kullanim: llIcon('klasor')  ->  <svg class="lli">...</svg>
   ============================================================ */
const LL_IKONLAR = {
klasor: '<path d="M2.5 6.2a1.7 1.7 0 0 1 1.7-1.7h4.3l1.8 2.1h9.3a1.7 1.7 0 0 1 1.7 1.7v10.1a1.7 1.7 0 0 1-1.7 1.7H4.2a1.7 1.7 0 0 1-1.7-1.7z" fill="#f6b93b"/><path class="li-kapak" d="M2.5 9.1h19v9.3a1.7 1.7 0 0 1-1.7 1.7H4.2a1.7 1.7 0 0 1-1.7-1.7z" fill="#fad390"/>',
klasorAcik: '<path d="M2.5 6.2a1.7 1.7 0 0 1 1.7-1.7h4.3l1.8 2.1h9.3a1.7 1.7 0 0 1 1.7 1.7v3H2.5z" fill="#e58e26"/><path class="li-kapakac" d="M3.6 10.4h18.9l-2.3 8.2a1.8 1.8 0 0 1-1.7 1.3H4.3a1.8 1.8 0 0 1-1.7-2.2z" fill="#fad390"/>',
ayar: '<g class="li-disli"><path d="M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4m0 2.1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" fill="#5f6f81"/><path d="M12 1.9l1.5 2.3 2.7-.6.5 2.7 2.6 1-1.2 2.5 1.8 2.1-2.2 1.7.5 2.7-2.8.2-1.1 2.5-2.3-1.5-2.3 1.5-1.1-2.5-2.8-.2.5-2.7L3.6 12l1.8-2.1-1.2-2.5 2.6-1 .5-2.7 2.7.6z" fill="#78909c"/></g>',
kalem: '<g class="li-kalem"><path d="M3.4 17.1l9.9-9.9 3.6 3.6-9.9 9.9-4.4.8z" fill="#f1c40f"/><path d="M3.4 17.1l-.8 4.4 4.4-.8z" fill="#fff3cd"/><path d="M2.6 21.5l1.6-.3-1.3-1.3z" fill="#4a4a4a"/><path d="M14.6 5.9l3.6 3.6 2-2a1.6 1.6 0 0 0 0-2.3l-1.3-1.3a1.6 1.6 0 0 0-2.3 0z" fill="#e67e22"/></g>',
cop: '<g class="li-kapakc"><path d="M4 6.1h16v2.1H4z" fill="#c0392b"/><path d="M9.4 3.4h5.2a1 1 0 0 1 1 1v1.5H8.4V4.4a1 1 0 0 1 1-1" fill="#c0392b"/></g><path d="M5.8 8.9h12.4l-1 11.2a1.7 1.7 0 0 1-1.7 1.5H8.5a1.7 1.7 0 0 1-1.7-1.5z" fill="#e74c3c"/><g stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".85"><line class="li-cub1" x1="9.6" y1="11.6" x2="9.9" y2="18.6"/><line class="li-cub2" x1="12" y1="11.6" x2="12" y2="18.6"/><line class="li-cub3" x1="14.4" y1="11.6" x2="14.1" y2="18.6"/></g>',
not: '<path d="M4.3 3.2h11.2l4.2 4.2v13.4a1.2 1.2 0 0 1-1.2 1.2H4.3a1.2 1.2 0 0 1-1.2-1.2V4.4a1.2 1.2 0 0 1 1.2-1.2" fill="#ecf0f1"/><path d="M15.5 3.2l4.2 4.2h-4.2z" fill="#bdc3c7"/><g stroke="#95a5a6" stroke-width="1.35" stroke-linecap="round"><line class="li-satir1" x1="6.2" y1="10.4" x2="16.4" y2="10.4"/><line class="li-satir2" x1="6.2" y1="13.6" x2="16.4" y2="13.6"/><line class="li-satir3" x1="6.2" y1="16.8" x2="12.6" y2="16.8"/></g>',
grafik: '<path d="M3.2 20.2h17.6" stroke="#7f8c8d" stroke-width="1.6" stroke-linecap="round"/><rect class="li-bar1" x="5" y="12" width="3.4" height="8" rx="1" fill="#3498db"/><rect class="li-bar2" x="10.3" y="8" width="3.4" height="12" rx="1" fill="#9b59b6"/><rect class="li-bar3" x="15.6" y="5" width="3.4" height="15" rx="1" fill="#1abc9c"/>',
saat: '<circle cx="12" cy="12" r="9.2" fill="#ecf0f1" stroke="#34495e" stroke-width="1.7"/><line class="li-akrep" x1="12" y1="12" x2="12" y2="7.4" stroke="#34495e" stroke-width="1.8" stroke-linecap="round"/><line class="li-yelkovan" x1="12" y1="12" x2="16" y2="12" stroke="#e74c3c" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="1.1" fill="#34495e"/>',
terazi: '<g class="li-kefe"><line x1="4.4" y1="8.4" x2="19.6" y2="8.4" stroke="#5d4037" stroke-width="1.7" stroke-linecap="round"/><path d="M1.9 12.2h5l-2.5-4z" fill="#f39c12"/><path d="M17.1 12.2h5l-2.5-4z" fill="#f39c12"/></g><line x1="12" y1="5.4" x2="12" y2="20.4" stroke="#5d4037" stroke-width="1.9" stroke-linecap="round"/><path d="M8 20.8h8" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="5.2" r="1.5" fill="#f39c12"/>',
arti: '<circle class="li-nabiz" cx="12" cy="12" r="9.3" fill="#27ae60"/><path d="M12 6.6v10.8M6.6 12h10.8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
eksi: '<circle class="li-nabiz" cx="12" cy="12" r="9.3" fill="#e74c3c"/><path d="M6.6 12h10.8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
duyuru: '<path d="M14.6 4.6L6.8 8.8H3.9a1.3 1.3 0 0 0-1.3 1.3v3.8a1.3 1.3 0 0 0 1.3 1.3h2.9l7.8 4.2z" fill="#e67e22"/><rect x="16.4" y="7.6" width="2.4" height="8.8" rx="1.2" fill="#d35400"/><g class="li-dalga" stroke="#f39c12" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M20 9.2a4.2 4.2 0 0 1 0 5.6"/><path d="M21.6 7.2a7 7 0 0 1 0 9.6"/></g>',
kitap: '<path d="M4.4 3.6h13.2a2 2 0 0 1 2 2v14.8a2 2 0 0 1-2 2H4.4z" fill="#2980b9"/><path d="M4.4 3.6a1.8 1.8 0 0 0 0 18.8h1.9V3.6z" fill="#1f6391"/><rect class="li-imlec" x="14.6" y="3.6" width="2.6" height="7.4" fill="#f1c40f"/><path d="M14.6 11l1.3-1.5 1.3 1.5z" fill="#f39c12"/>',
kitapAcik: '<path class="li-sayfa-sol" d="M11.6 6.6C9.4 4.9 6.6 4.5 3.4 5v13.4c3.2-.5 6 0 8.2 1.7z" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/><path class="li-sayfa-sag" d="M12.4 6.6c2.2-1.7 5-2.1 8.2-1.6v13.4c-3.2-.5-6 0-8.2 1.7z" fill="#fff" stroke="#bdc3c7" stroke-width="1"/><line x1="12" y1="6.4" x2="12" y2="20.4" stroke="#7f8c8d" stroke-width="1.4"/>',
hedef: '<circle cx="12" cy="12" r="9.2" fill="#fff" stroke="#c0392b" stroke-width="2"/><circle class="li-halka" cx="12" cy="12" r="5.8" fill="none" stroke="#e74c3c" stroke-width="2"/><circle cx="12" cy="12" r="2.4" fill="#c0392b"/><path class="li-ok" d="M20.6 3.4l-6.6 6.6" stroke="#2c3e50" stroke-width="1.8" stroke-linecap="round"/><path class="li-ok" d="M20.6 3.4l-.4 3.2-2.8-.4z" fill="#f39c12"/>',
kapat: '<circle cx="12" cy="12" r="9.2" fill="#e74c3c"/><g class="li-carpi" stroke="#fff" stroke-width="2.3" stroke-linecap="round"><line x1="8.4" y1="8.4" x2="15.6" y2="15.6"/><line x1="15.6" y1="8.4" x2="8.4" y2="15.6"/></g>',
onay: '<circle cx="12" cy="12" r="9.2" fill="#27ae60"/><path class="li-tik" d="M7.4 12.4l3.2 3.2 6-6.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="16" stroke-dashoffset="0"/>',
araclar: '<g class="li-somun"><path d="M9.4 2.6a6 6 0 0 0 1.5 11.2l7.2 7.2a2 2 0 0 0 2.8-2.8l-7.2-7.2A6 6 0 0 0 9.4 2.6l2.6 2.6-1 3.4-3.4 1-2.6-2.6z" fill="#7f8c8d"/></g><path d="M4.6 19.4l6-6" stroke="#95a5a6" stroke-width="1.4" stroke-linecap="round"/>',
gonder: '<path d="M12 3.2l5.2 5.2h-3.4v6.4h-3.6V8.4H6.8z" fill="#27ae60" class="li-okYukari"/><path d="M3.6 15.4v4.2a1.4 1.4 0 0 0 1.4 1.4h14a1.4 1.4 0 0 0 1.4-1.4v-4.2" fill="none" stroke="#2c3e50" stroke-width="1.9" stroke-linecap="round"/>',
bayrak: '<line x1="5.4" y1="2.8" x2="5.4" y2="21.4" stroke="#7f8c8d" stroke-width="1.9" stroke-linecap="round"/><path class="li-kumas" d="M6.4 3.6h12.8l-2.6 4 2.6 4H6.4z" fill="#e74c3c"/>',
nokta: '<circle class="li-nabiz" cx="12" cy="12" r="6" fill="currentColor"/>',
piyon: '<circle class="li-zipla2" cx="12" cy="6.6" r="3.4" fill="#2c3e50"/><path d="M8.6 10.4h6.8l-1.4 3.6 1.8 4.6H7.2l1.8-4.6z" fill="#34495e"/><rect x="5.8" y="18.4" width="12.4" height="2.8" rx="1.4" fill="#2c3e50"/>',
kupa: '<path d="M7.4 3.6h9.2v6a4.6 4.6 0 1 1-9.2 0z" fill="#f1c40f"/><path d="M7.4 5.4H5a2 2 0 0 0 2.4 4.4M16.6 5.4H19a2 2 0 0 1-2.4 4.4" fill="none" stroke="#f39c12" stroke-width="1.5"/><rect x="10.6" y="14" width="2.8" height="3.6" fill="#e67e22"/><rect x="7.4" y="17.4" width="9.2" height="2.8" rx="1.2" fill="#e67e22"/><circle class="li-parilti" cx="12" cy="7.4" r="1.6" fill="#fff" opacity=".8"/>',
};

Object.assign(LL_IKONLAR, {
takvim: '<rect x="3" y="5" width="18" height="16.2" rx="2.2" fill="#ecf0f1" stroke="#90A4AE" stroke-width=".9"/><path d="M3 5a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 5v3.6H3z" fill="#e74c3c"/><rect x="6.6" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#c0392b"/><rect x="15.2" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#c0392b"/><g fill="#bdc3c7"><rect x="6" y="11" width="3" height="2.6" rx=".6"/><rect x="10.5" y="11" width="3" height="2.6" rx=".6"/><rect x="15" y="11" width="3" height="2.6" rx=".6"/><rect x="6" y="15.4" width="3" height="2.6" rx=".6"/></g><rect class="li-gun" x="10.5" y="15.4" width="3" height="2.6" rx=".6" fill="#3498db"/>',
yenile: '<g class="li-donen"><path d="M12 4.2A7.8 7.8 0 0 1 19.6 14" fill="none" stroke="#3498db" stroke-width="2.2" stroke-linecap="round"/><path d="M12 4.2A7.8 7.8 0 0 0 4.4 14" fill="none" stroke="#2980b9" stroke-width="2.2" stroke-linecap="round" opacity=".45"/><path d="M19.9 15.4l-2.5-3.4h5z" fill="#3498db"/><path d="M4.1 12.6l2.5 3.4h-5z" fill="#2980b9" opacity=".45"/></g>',
menu: '<g stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line class="li-cizgi1" x1="4" y1="7" x2="20" y2="7"/><line class="li-cizgi2" x1="4" y1="12" x2="20" y2="12"/><line class="li-cizgi3" x1="4" y1="17" x2="20" y2="17"/></g>',
anahtar: '<g class="li-salla"><circle cx="8" cy="8" r="4.6" fill="none" stroke="#f1c40f" stroke-width="2.4"/><path d="M11.2 11.2l9 9" stroke="#f1c40f" stroke-width="2.4" stroke-linecap="round"/><path d="M17 17l2 2M15 19l2 2" stroke="#f39c12" stroke-width="2.2" stroke-linecap="round"/></g>',
roket: '<g class="li-roket"><path d="M12 1.8c3.4 2.6 5 6.4 5 10.4l-2.4 4.2H9.4L7 12.2C7 8.2 8.6 4.4 12 1.8" fill="#ecf0f1"/><circle cx="12" cy="8.6" r="2.2" fill="#3498db"/><path d="M7 11.4L4.2 15l2.8.4z" fill="#e74c3c"/><path d="M17 11.4l2.8 3.6-2.8.4z" fill="#e74c3c"/></g><path class="li-alev" d="M12 17.2c1.4 1.6 2 3.2 0 5.2-2-2-1.4-3.6 0-5.2" fill="#f39c12"/>',
kitaplar: '<rect class="li-kitap1" x="3.2" y="6.4" width="4" height="14.4" rx="1" fill="#e74c3c"/><rect class="li-kitap2" x="8" y="4.6" width="4" height="16.2" rx="1" fill="#3498db"/><rect class="li-kitap3" x="12.8" y="7.4" width="4" height="13.4" rx="1" fill="#27ae60"/><path d="M17.6 9l4.6 1.4-3 10.4-4.6-1.4z" fill="#f39c12"/>',
elSol: '<g class="li-el"><path d="M21 10.6h-8.6l2-2.6a1.6 1.6 0 0 0-2.4-2.1L7.8 10H5.4a2 2 0 0 0-2 2v3.6a2 2 0 0 0 2 2h2.4l4.2 3.2a2 2 0 0 0 1.2.4H21a1.4 1.4 0 0 0 0-2.8 1.4 1.4 0 0 0 0-2.8 1.4 1.4 0 0 0 0-2.8 1.4 1.4 0 0 0 0-2.8" fill="#f5b041"/></g>',
kumSaati: '<path d="M6 2.6h12v2H6zM6 19.4h12v2H6z" fill="#8d6e63"/><path d="M7.4 4.6h9.2v2.4L12 12l4.6 5v2.4H7.4V17L12 12 7.4 7z" fill="#ecf0f1" opacity=".6" stroke="#95a5a6" stroke-width="1"/><path class="li-kum" d="M8.8 5.6h6.4l-3.2 4z" fill="#f39c12"/><path class="li-kum2" d="M9.6 18.4h4.8L12 14.4z" fill="#f39c12"/>',
oynat: '<circle cx="12" cy="12" r="9.2" fill="#27ae60"/><path class="li-nabiz" d="M9.8 7.6l7 4.4-7 4.4z" fill="#fff"/>',
kronometre: '<rect x="9.4" y="1.6" width="5.2" height="2.6" rx="1.2" fill="#34495e"/><circle cx="12" cy="13.4" r="8.4" fill="#ecf0f1" stroke="#34495e" stroke-width="1.8"/><line class="li-ibre" x1="12" y1="13.4" x2="12" y2="7.8" stroke="#e74c3c" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="13.4" r="1.1" fill="#34495e"/><path d="M18.4 6.2l2-2" stroke="#34495e" stroke-width="2" stroke-linecap="round"/>',
elSikisma: '<path d="M2.4 11.4l4-3.6 4.6 2.6-2 2z" fill="#f5b041"/><path d="M21.6 11.4l-4-3.6-4.6 2.6 2 2z" fill="#e59866"/><path d="M8.6 10.6l3.4-1.4 3.4 1.4 3.6 4a1.6 1.6 0 0 1-2.2 2.2l-1-.9a1.5 1.5 0 0 1-2.2 1.6 1.5 1.5 0 0 1-2.4 1.2 1.5 1.5 0 0 1-2.6-1.1z" fill="#f8c471"/><g class="li-parilti2" stroke="#f1c40f" stroke-width="1.4" stroke-linecap="round"><path d="M12 5.4v-2.4M8.4 6.2L7 4.2M15.6 6.2L17 4.2"/></g>',
konum: '<path class="li-zipla" d="M12 2.2a7 7 0 0 0-7 7c0 5.2 7 12.6 7 12.6s7-7.4 7-12.6a7 7 0 0 0-7-7" fill="#e74c3c"/><circle cx="12" cy="9.2" r="2.8" fill="#fff"/>',
kisi: '<circle cx="12" cy="7.6" r="4.2" fill="#3498db"/><path class="li-govde" d="M3.8 21.4a8.2 8.2 0 0 1 16.4 0z" fill="#2980b9"/>',
uyari: '<path d="M12 2.6l10.4 18H1.6z" fill="#f39c12"/><g class="li-unlem"><rect x="10.9" y="8.4" width="2.2" height="6.6" rx="1.1" fill="#fff"/><circle cx="12" cy="17.6" r="1.4" fill="#fff"/></g>',
okul: '<path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#c0392b"/><path d="M4.4 8.8h15.2v12.6H4.4z" fill="#ecf0f1" stroke="#90A4AE" stroke-width=".9"/><rect x="10.2" y="14.4" width="3.6" height="7" fill="#8d6e63"/><g fill="#3498db"><rect x="6" y="11.4" width="3" height="3" rx=".5"/><rect x="15" y="11.4" width="3" height="3" rx=".5"/><rect x="6" y="16.4" width="3" height="3" rx=".5"/><rect x="15" y="16.4" width="3" height="3" rx=".5"/></g><g class="li-bayrakcik"><line x1="12" y1="1" x2="12" y2="5" stroke="#7f8c8d" stroke-width="1.2"/><path d="M12.4 1.4h3.4l-.8 1.2.8 1.2h-3.4z" fill="#e74c3c"/></g>',
bayrakTr: '<line x1="4" y1="3" x2="4" y2="21.4" stroke="#7f8c8d" stroke-width="1.8" stroke-linecap="round"/><g class="li-kumas"><rect x="4.8" y="4" width="15" height="10" rx="1" fill="#e30a17"/><circle cx="10.4" cy="9" r="3.1" fill="#fff"/><circle cx="11.5" cy="9" r="2.5" fill="#e30a17"/><path d="M14.4 9l-2.2.7 1.4-1.8v2.2l1.4-1.8z" fill="#fff"/></g>',
yaprak: '<path class="li-suzul" d="M19.4 4.6c-8 0-14 4-14 10.4 0 1.8.6 3.4 1.6 4.6C9.6 16.4 13 13.8 17 12.6c-3 1.8-5.6 4.4-7.4 7.8 1 .5 2.2.8 3.4.8 5.2 0 8-5.6 6.4-16.6" fill="#e67e22"/>',
agac: '<path d="M12 2.4l4 6h-2.4l3 4.6h-2.4l3.4 5.2H6.4l3.4-5.2H7.4l3-4.6H8z" fill="#27ae60"/><rect x="10.8" y="18.2" width="2.4" height="3.4" fill="#8d6e63"/><g class="li-susu"><circle cx="10" cy="9.4" r="1" fill="#e74c3c"/><circle cx="14" cy="13" r="1" fill="#f1c40f"/><circle cx="9.4" cy="15.6" r="1" fill="#3498db"/></g>',
karTanesi: '<g class="li-donen2" stroke="#3498db" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.6v18.8M3.9 7.3l16.2 9.4M20.1 7.3L3.9 16.7"/><path d="M12 6l-2 -2M12 6l2-2M12 18l-2 2M12 18l2 2" stroke-width="1.4"/></g>',
filiz: '<path d="M12 21.4v-8" stroke="#27ae60" stroke-width="2" stroke-linecap="round"/><path class="li-yaprak2" d="M12 14c-.4-4-3-5.4-6.6-5.4 0 3.8 2.6 5.6 6.6 5.4" fill="#2ecc71"/><path class="li-yaprak3" d="M12 11.6c.4-4 3-5.6 6.6-5.6 0 3.8-2.6 5.8-6.6 5.6" fill="#27ae60"/>',
hilal: '<path class="li-parla" d="M15.4 2.6a9.6 9.6 0 1 0 6 17.6 9 9 0 0 1-6-17.6" fill="#f1c40f"/><path class="li-yildiz" d="M17.4 6.2l1 2.2 2.4.2-1.8 1.6.6 2.4-2.2-1.2-2.2 1.2.6-2.4-1.8-1.6 2.4-.2z" fill="#f39c12"/>',
balon: '<path class="li-balon" d="M12 2.4a5.6 6.6 0 0 1 5.6 6.6c0 3.6-3.2 6.4-5.6 7.6-2.4-1.2-5.6-4-5.6-7.6A5.6 6.6 0 0 1 12 2.4" fill="#e74c3c"/><path d="M12 16.6l-1 1.4h2z" fill="#c0392b"/><path d="M12 18c1.6 1.4-1.6 2.4 0 3.8" fill="none" stroke="#7f8c8d" stroke-width="1.1"/><ellipse cx="9.8" cy="7" rx="1.4" ry="2" fill="#fff" opacity=".45"/>',
koc: '<ellipse cx="12" cy="14.6" rx="7" ry="5.4" fill="#ecf0f1"/><circle cx="12" cy="8.6" r="3.6" fill="#e8dccb"/><path class="li-boynuz" d="M8.6 7.4c-2.6-.6-3.6 1.6-2.4 3.2 1 1.4 2.6.6 2.4-1M15.4 7.4c2.6-.6 3.6 1.6 2.4 3.2-1 1.4-2.6.6-2.4-1" fill="none" stroke="#c8a165" stroke-width="1.8" stroke-linecap="round"/><circle cx="10.6" cy="8.6" r=".8" fill="#2c3e50"/><circle cx="13.4" cy="8.6" r=".8" fill="#2c3e50"/><g stroke="#bdc3c7" stroke-width="1.6" stroke-linecap="round"><path d="M8.4 19.4v2M15.6 19.4v2"/></g>',
kosucu: '<circle class="li-kos" cx="14.4" cy="4.6" r="2.4" fill="#e67e22"/><g class="li-kos" stroke="#e67e22" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M14 8.4l-3.4 3.6 2.6 3.2-1.6 5.4"/><path d="M11.2 12.4L6.4 13"/><path d="M13.2 15.2l4 2.4"/></g>',
sandik: '<path d="M3.4 9.4h17.2v11a1.4 1.4 0 0 1-1.4 1.4H4.8a1.4 1.4 0 0 1-1.4-1.4z" fill="#34495e"/><path d="M3.4 9.4l2.4-3.6h12.4l2.4 3.6z" fill="#2c3e50"/><rect x="8.6" y="12" width="6.8" height="1.8" rx=".9" fill="#ecf0f1"/><path class="li-oy" d="M11 2l2.6 1v4.4l-2.6-1z" fill="#ecf0f1" stroke="#bdc3c7" stroke-width=".8"/>',
gunes: '<circle class="li-nabiz" cx="12" cy="12" r="5" fill="#f1c40f"/><g class="li-isin" stroke="#f39c12" stroke-width="1.9" stroke-linecap="round"><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.8 4.8l2.1 2.1M17.1 17.1l2.1 2.1M19.2 4.8l-2.1 2.1M6.9 17.1l-2.1 2.1"/></g>',
ampul: '<path d="M12 2.4a6.6 6.6 0 0 0-3.8 12v2.2h7.6v-2.2A6.6 6.6 0 0 0 12 2.4" fill="#f1c40f" class="li-isik"/><rect x="8.6" y="17.4" width="6.8" height="1.9" rx=".9" fill="#95a5a6"/><rect x="9.6" y="20" width="4.8" height="1.8" rx=".9" fill="#7f8c8d"/><path d="M10.2 14.2v-3.4M13.8 14.2v-3.4" stroke="#e67e22" stroke-width="1.2"/>',
});

Object.assign(LL_IKONLAR, {
veli: '<circle cx="7.6" cy="7" r="3.2" fill="#e74c3c"/><path d="M2.4 19.6a5.2 5.2 0 0 1 10.4 0z" fill="#c0392b"/><circle cx="16.6" cy="7" r="3.2" fill="#3498db"/><path d="M11.4 19.6a5.2 5.2 0 0 1 10.4 0z" fill="#2980b9"/><path class="li-kalp" d="M12 14.6c-1.2-1.4-3.2-.6-3.2 1 0 1.4 1.8 2.6 3.2 3.6 1.4-1 3.2-2.2 3.2-3.6 0-1.6-2-2.4-3.2-1" fill="#f39c12"/>',
tarama: '<circle cx="10.6" cy="10.6" r="6.6" fill="none" stroke="#34495e" stroke-width="2.1"/><path d="M15.6 15.6l5.2 5.2" stroke="#34495e" stroke-width="2.4" stroke-linecap="round"/><line class="li-mercek" x1="5.4" y1="10.6" x2="15.8" y2="10.6" stroke="#3498db" stroke-width="1.8" stroke-linecap="round"/>',
telefon: '<path class="li-salla2" d="M6.6 2.6a1.8 1.8 0 0 1 2.4.6l2 3.2a1.8 1.8 0 0 1-.4 2.4l-1.4 1a12 12 0 0 0 5 5l1-1.4a1.8 1.8 0 0 1 2.4-.4l3.2 2a1.8 1.8 0 0 1 .6 2.4l-1.4 2.2a2.4 2.4 0 0 1-2.8 1C12.4 21.6 2.4 11.6 1.4 5.4a2.4 2.4 0 0 1 1-2.8z" fill="#27ae60"/>',
meslek: '<rect x="2.6" y="7.4" width="18.8" height="12.4" rx="2" fill="#8d6e63"/><path d="M8.6 7.4V5.6a1.8 1.8 0 0 1 1.8-1.8h3.2a1.8 1.8 0 0 1 1.8 1.8v1.8h-2V6h-2.8v1.4z" fill="#5d4037"/><rect class="li-kilit" x="10.4" y="12" width="3.2" height="3" rx=".8" fill="#f1c40f"/><path d="M2.6 12.4h18.8" stroke="#6d4c41" stroke-width="1.4"/>',
vefat: '<rect x="7" y="4.4" width="10" height="17" rx="4.6" fill="#95a5a6"/><path d="M12 8v8M9 11h6" stroke="#ecf0f1" stroke-width="1.9" stroke-linecap="round"/><path class="li-cim" d="M3.4 21.4h17.2" stroke="#27ae60" stroke-width="2.2" stroke-linecap="round"/>',
para: '<circle class="li-nabiz" cx="12" cy="12" r="9" fill="#f1c40f"/><circle cx="12" cy="12" r="7" fill="none" stroke="#e67e22" stroke-width="1.2"/><path d="M12 6.6v10.8" stroke="#b9770e" stroke-width="1.6" stroke-linecap="round"/><path d="M14.8 9.4a3 3 0 0 0-2.8-1.4c-1.8 0-3 1-3 2.2 0 3 6 1.6 6 4.6 0 1.4-1.4 2.4-3.2 2.4a3.4 3.4 0 0 1-3-1.6" fill="none" stroke="#b9770e" stroke-width="1.7" stroke-linecap="round"/>',
kalp: '<path class="li-kalp" d="M12 21c-1-1-8.4-5.4-8.4-11A5 5 0 0 1 12 6.6 5 5 0 0 1 20.4 10c0 5.6-7.4 10-8.4 11" fill="#e74c3c"/>',
takvimGun: '<rect x="3" y="5" width="18" height="16.2" rx="2.2" fill="#ecf0f1" stroke="#90A4AE" stroke-width=".9"/><path d="M3 5a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 5v3.6H3z" fill="#8e44ad"/><rect x="6.6" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#6c3483"/><rect x="15.2" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#6c3483"/><g class="li-gun2"><rect x="9.4" y="11.6" width="5.2" height="5.2" rx="1" fill="#9b59b6"/></g>',
});

/* SINIF (derslik) ikonu — tahta + sira + iki ogrenci.
   Kurallar (Kurumlarim & Siniflarim): bu ANIMASYONLU ikon yalniz
   SEVIYE (kat) basliginda durur; tek tek sinif satirlarinda/kapilarinda
   ikon YOKTUR. Boylece liste sakin kalir, goz basliga gider. */
Object.assign(LL_IKONLAR, {
sinif: '<rect x="2.4" y="2.6" width="19.2" height="11.4" rx="1.4" fill="#6d4c41"/><rect x="3.6" y="3.8" width="16.8" height="9" rx=".8" fill="#2f6f52"/><g class="li-tebesir" stroke="#fff" stroke-width="1.15" stroke-linecap="round" fill="none" opacity=".92"><path d="M5.6 6.6h8.2"/><path d="M5.6 9.4h10.6"/></g><circle class="li-ogrenci1" cx="7" cy="16.6" r="1.8" fill="#3498db"/><circle class="li-ogrenci2" cx="17" cy="16.6" r="1.8" fill="#e67e22"/><g fill="#c8a165"><rect x="2.6" y="18.2" width="8.6" height="1.7" rx=".7"/><rect x="12.8" y="18.2" width="8.6" height="1.7" rx=".7"/></g><g stroke="#a1793f" stroke-width="1.3" stroke-linecap="round"><path d="M4.2 19.8v1.8M9.6 19.8v1.8M14.4 19.8v1.8M19.8 19.8v1.8"/></g>',
});

/* ikon uretici: llIcon('klasor')  /  llIcon('klasor','ek-sinif') */
function llIcon(ad, ek) {
    const ic = LL_IKONLAR[ad];
    if (!ic) return '';
    return '<svg class="lli' + (ek ? ' ' + ek : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ic + '</svg>';
}
window.llIcon = llIcon;


// ===== listelerim.js (index'e birlestirildi, tek firebase) =====
function llRootEl(){ return document.getElementById('ll-root') || document.body; }
function initListelerim(){ try{ var b=document.getElementById('login-nav-btn'); if(b) b.style.display='none'; var u=(window.firebase&&firebase.auth&&firebase.auth().currentUser); if(u && typeof verileriGetir==='function' && window._llLoadedUid !== u.uid){ window._llLoadedUid = u.uid; verileriGetir(u.uid); } setTimeout(function(){ if(typeof syncLevelActions==='function') syncLevelActions(); }, 900); setTimeout(function(){ try{ llSonSinifAcBekle(); }catch(e){} }, 300); }catch(e){console.error('initListelerim',e);} }
window.initListelerim=initListelerim;

const mufredatVerisi = {
    "9": [
        "Okula uyum ve Arapça harflerin telaffuzu", "Harflerin başta-ortada-sonda yazılışı", "Selamlaşma ifadeleri (Merhaba, Ehlen)", 
        "Tanışma diyalogları", "Şahıs zamirleri (Ana, Anta, Anti)", "İşaret isimleri (Hâzâ, Hâzihî)", 
        "Sayılar (1-10)", "Sınıf içi yönergeler", "1. ARA TATİL", "Aile bireyleri (Ümm, Eb)", 
        "İyelik zamirleri", "Evin bölümleri", "Varlıkların konumları (Altında, üstünde)", "Meslekler", 
        "Fiziksel özellikler", "Renklere giriş", "Günlük rutinler", "1. DÖNEM SONU", 
        "Müzari fiil girişi", "Müzari fiil çekimi", "Saatler (Tam/Yarım)", "Hobiler", "Spor dalları", 
        "Mevsimler ve Hava", "Kıyafetler", "Yiyecek ve İçecekler", "Meyveler-Sebzeler", "2. ARA TATİL", 
        "Ulaşım araçları", "Yer-Yön tarifleri", "Hayvanlar alemi", "Vücudun bölümleri", 
        "Gelecek zaman kipi", "Ülkeler ve Milliyetler", "Genel Müfredat Özeti", "Yıl Sonu Değerlendirmesi"
    ],
    // Buraya 5, 6, 7, 8. sınıfları da aynı formatta ekleyebilirsin.
};
    
function openDefter() {
    document.getElementById('defterModal').style.display = 'flex';
}

// Bu fonksiyon her zaman çalışabilmesi için global alanda olmalıdır

// Kazanım Takibi İçin render fonksiyonu
function renderPlan() {
    if (curLId === null || !data.levels[curLId]) return;
    const body = document.getElementById('planBody');
    if (!body) return;
    
    // Seviye verisine ulaşıyoruz (Örn: 9. Sınıflar Genel Planı)
    let level = data.levels[curLId];
    // Sınıf verisi sadece "check" durumları için lazım
    let cls = (curCId !== null) ? level.classes[curCId] : null;

    body.innerHTML = '<div class="plan-container"><div id="period1" class="period-column"></div><div id="period2" class="period-column"></div></div>';
    
    const p1 = document.getElementById('period1');
    const p2 = document.getElementById('period2');
    
    // Plan metinleri artık LEVEL bazında saklanıyor
    if(!level.planText) level.planText = {};
    // Checkbox durumları hala CLASS bazında (isteğe bağlı)
    if(cls && !cls.planStatus) cls.planStatus = {};

    let startDate = new Date("2026-09-14");
    let today = new Date();

    const longBreaks = {
        9:  { name: "1. Ara Tatil", range: "16-20 Kas", weeks: 1 },
        18: { name: "Sömestr Tatili", range: "25 Oca-5 Şub", weeks: 2 },
        22: { name: "2. Ara Tatil", range: "8-12 Mar", weeks: 1 }
    };

    let totalOffsetDays = 0;

    for (let i = 1; i <= 36; i++) {
        let weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i - 1) * 7 + totalOffsetDays);
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        let dStart = String(weekStart.getDate()).padStart(2, '0') + "." + String(weekStart.getMonth() + 1).padStart(2, '0');
        let dEnd = String(weekEnd.getDate()).padStart(2, '0') + "." + String(weekEnd.getMonth() + 1).padStart(2, '0');
        
        let isCurrentWeek = (today >= weekStart && today <= weekEnd);
        let activeClass = isCurrentWeek ? 'is-current-week' : '';
        
        // DİKKAT: updateLevelPlanText fonksiyonunu çağırıyoruz
        let weekHtml = `
            <div class="plan-card ${activeClass}">
                <div class="week-info">
                    <div class="week-number">${i}</div>
                    <span class="date-start">${dStart}</span>
                    <span class="date-end">${dEnd}</span>
                </div>
                <div class="gain-input-area">
                    <textarea onchange="updateLevelPlanText(${i}, this.value)" 
                        placeholder="Bu seviye için ortak kazanım...">${level.planText[i] || ''}</textarea>
                </div>
                <div class="check-container">
                    ${cls ? `<input type="checkbox" ${cls.planStatus[i] ? 'checked' : ''} onchange="togglePlanStatus(${i}, this.checked)">` : ''}
                </div>
            </div>`;

        let targetColumn = (i <= 18) ? p1 : p2;
        targetColumn.innerHTML += weekHtml;

        if (longBreaks[i]) {
            totalOffsetDays += (longBreaks[i].weeks * 7);
            targetColumn.innerHTML += `
                <div class="holiday-separator">
                    <div class="holiday-content">
                        <span class="holiday-icon">${llIcon('bayrak')}</span>
                        <span class="holiday-title">${longBreaks[i].name}</span>
                        <span class="holiday-dates">(${longBreaks[i].range})</span>
                    </div>
                </div>`;
        }
    }
}
function updateLevelPlanText(weekIndex, value) {
    if (curLId === null || !data.levels[curLId]) return;
    
    // Veriyi seviye (level) altına kaydediyoruz
    data.levels[curLId].planText[weekIndex] = value;
    
    // LocalStorage veya Database kaydını burada tetikleyin
    save(); 
}



function togglePlanStatus(week, status) {
    let cls = data.levels[curLId].classes[curCId];
    if(!cls.planStatus) cls.planStatus = {};
    cls.planStatus[week] = status;
    save();
}

function updatePlanText(week, text) {
    let cls = data.levels[curLId].classes[curCId];
    if(!cls.planText) cls.planText = {};
    cls.planText[week] = text;
    save();
}

// Benzersiz 6 haneli kod üretme fonksiyonu
function generateStudentCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Okunurluk için 0, O, 1, I hariç
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showTab(tabIndex) {
    // 1. Tüm sekmelerin 'active' sınıfını kaldır
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // 2. Tüm panellerin 'active' sınıfını kaldır
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // 3. Tıklanan sekmeyi aktif yap
    if (tabs[tabIndex - 1]) {
        tabs[tabIndex - 1].classList.add('active');
    }

    // 4. İlgili paneli göster
    const activePanel = document.getElementById('tab' + tabIndex);
    if (activePanel) {
        activePanel.classList.add('active');
        
        // Eğer Görev Gönder sekmesi (9) açıldıysa listeyi yükle
        if (tabIndex === 9) {
            renderMissions();
        }
    }
}

// 10 Adet Arapça Ödev Başlığı
const arabicMissions = [
    "Harflerin Yazılış Pratiği", "Tanışma Diyaloğu Ezberi", "Sayılar (1-20) Çalışması",
    "Mutfak Gereçleri Eşleştirme", "Saatler ve Zaman Kavramı", "Vücudun Bölümleri Testi",
    "Günlük Rutin Yazma", "Aile Bireyleri Tanıtımı", "Mevsimler ve Hava Durumu", "Meslekler Görsel Seti"
];

let activePatchIdx = null;

function renderMissions() {
    const container = document.getElementById('mission-list');
    const stuList = document.getElementById('m-student-list');
    if (!container) return;
    container.innerHTML = '';

    // Öğrenci listesini güncelle (Tekil öğrenci seçimi için)
    if (curLId && curCId && data.levels[curLId].classes[curCId]) {
        stuList.innerHTML = data.levels[curLId].classes[curCId].students.map((s, i) => 
            `<option value="${i}">${s.name}</option>`
        ).join('');
    }

    // 10 Başlığı Döngüyle Oluştur
    arabicMissions.forEach((title, i) => {
        const patchKey = `mission_patch_${i}`;
        const hasPatch = (localStorage.getItem(patchKey) || "").length > 0;
        
        const card = document.createElement('div');
        card.className = 'mission-card'; // CSS'teki mission-card stilini kullanır
        card.style.padding = '15px';
        card.style.position = 'relative';

        card.innerHTML = `
            <h4 class="marhey-text" style="font-size:1rem; margin-bottom:5px;">${title}</h4>
            <p style="font-size:0.75rem; color:${hasPatch ? '#27ae60' : '#7f8c8d'}; margin-bottom:10px;">
                ${hasPatch ? llIcon('onay')+' Yama Hazır' : llIcon('not')+' Yama Bekliyor'}
            </p>
            <div style="display:flex; gap:5px;">
                <button onclick="openPatchModal(${i})" class="tool-btn btn-reset" style="flex:1; padding:5px; font-size:11px;">${llIcon('araclar')} Yama</button>
                <button onclick="sendMissionFinal(${i}, '${title}')" class="tool-btn btn-start" style="flex:1.5; padding:5px; font-size:11px;">${llIcon('gonder')} Gönder</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleMTarget() {
    const type = document.getElementById('m-target-type').value;
    document.getElementById('m-student-select-wrap').style.display = (type === 'student') ? 'block' : 'none';
}

function sendMissionFinal(idx, title) {
    // 1. Arayüzdeki form verilerini al
    const deadline = document.getElementById('m-deadline').value;
    const duration = document.getElementById('m-duration').value;
    const target = document.getElementById('m-target-type').value;
    // Yerel hafızadaki yama (kod) bilgisini al
    const patch = localStorage.getItem(`mission_patch_${idx}`) || "";

    // 2. Güvenlik kontrolü
    if (!deadline) {
        alert("Lütfen son teslim tarihini seçin!");
        return;
    }

    // 3. Görev objesini oluştur (Paketle)
    const newMission = {
        id: Date.now(), // Takip için benzersiz ID
        title: title,
        deadline: deadline,
        duration: duration || "Belirtilmedi",
        target: target,
        patchCode: patch,
        status: "Bekliyor", // Başlangıç durumu
        sentDate: new Date().toLocaleDateString('tr-TR')
    };

    // 4. Hedef kitleye göre veriyi dağıt (Adrese teslim)
    if (target === 'student') {
        // Sadece seçilen tek bir öğrenciye gönder
        const sIdx = document.getElementById('m-student-list').value;
        let stu = data.levels[curLId].classes[curCId].students[sIdx];
        
        if (!stu.personalMissions) stu.personalMissions = [];
        stu.personalMissions.push(newMission);
        
    } else if (target === 'class') {
        // Mevcut sınıftaki TÜM öğrencilere tek tek ekle
        let students = data.levels[curLId].classes[curCId].students;
        students.forEach(stu => {
            if (!stu.personalMissions) stu.personalMissions = [];
            stu.personalMissions.push({...newMission}); // Her öğrenciye kopyasını gönder
        });
        
    } else if (target === 'level') {
        // Bu seviyedeki (Örn: tüm 9'lar) tüm sınıfların tüm öğrencilerine gönder
        let allOpenClasses = data.levels[curLId].classes;
        for (let classId in allOpenClasses) {
            allOpenClasses[classId].students.forEach(stu => {
                if (!stu.personalMissions) stu.personalMissions = [];
                stu.personalMissions.push({...newMission});
            });
        }
    }

    // 5. Değişiklikleri hem Local'e hem Firebase'e kaydet
    save(); 
    
    // 6. Başarı mesajı ve tabloyu güncelleme (varsa)
    alert(`"${title}" görevi başarıyla kodlandı ve hedeflere gönderildi!`);
    
    // Eğer varsa gönderilenler tablosunu tazele
    if (typeof updateSentMissionsTable === "function") {
        updateSentMissionsTable();
    }
}

function generateUniqueCode(prefix = "TCH") {
    const numbers = Math.floor(1000 + Math.random() * 9000); // 4 haneli rastgele sayı
    return `${prefix}-${numbers}`;
}

// Yama (Patch) İşlemleri
function openPatchModal(idx) {
    activePatchIdx = idx;
    const savedPatch = localStorage.getItem(`mission_patch_${idx}`) || "";
    document.getElementById('patchCodeInput').value = savedPatch;
    document.getElementById('patchTitle').innerText = arabicMissions[idx] + " Yaması";
    document.getElementById('patchModal').style.display = 'block';
}

function closePatchModal() {
    document.getElementById('patchModal').style.display = 'none';
}

function savePatch() {
    const code = document.getElementById('patchCodeInput').value;
    localStorage.setItem(`mission_patch_${activePatchIdx}`, code);
    closePatchModal();
    renderMissions(); // Görünümü tazele
}
/* Geri Sayim / Kronometre: paneli TAM EKRAN yapar (sinif projeksiyonu icin).
   Ayni tusa tekrar basmak ya da Esc tam ekrandan cikarir. */
function llTamEkran(id) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
        if (document.fullscreenElement) { document.exitFullscreen(); return; }
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch (e) { }
}
window.llTamEkran = llTamEkran;

// Eski switchTab ve showTab fonksiyonlarını SİLİP bunu yapıştırın
function switchTab(idx) {
    // 1. Tüm butonlardan ve panellerden 'active' sınıfını kaldır
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    // 3. Panel eslemesi — SADELESTIRME: Performans/Sinavlar/Genel Sonuc artik
    // tab0 icinde MOD, Geri Sayim/Kronometre/Takim ise tab4 icinde ARAC olarak
    // yasar. Eski numaralar geriye donuk calissin diye moda cevrilir.
    let panelId = "";
    switch(idx) {
        /* Üstteki "Öğrenciler" tuşu artık HER ZAMAN liste moduna döner; eskiden
           son seçili hapta kalıp hiçbir şey yapmıyormuş gibi görünüyordu. */
        case 0: panelId = "tab0"; llNotModu = 'liste'; break;  // Öğrenciler (mod haplı)
        case 1: panelId = "tab0"; llNotModu = 'hw'; break;     // -> Performans modu
        case 2: panelId = "tab0"; llNotModu = 'ex'; break;     // -> Sınavlar modu
        case 3: panelId = "tab0"; llNotModu = 'res'; break;    // -> Genel Sonuç modu
        case 4: panelId = "tab4"; break;                       // Sınıf Araçları
        case 5: panelId = "tab0"; llNotModu = 'gorev'; break;   // -> Görev Gönder modu
        case 6: panelId = "tab4"; llAracModu = 'sayim'; break; // -> Geri Sayım aracı
        case 7: panelId = "tab4"; llAracModu = 'kron'; break;  // -> Kronometre aracı
        case 8: panelId = "tab4"; llAracModu = 'takim'; break; // -> Takım aracı
        case 9: panelId = "tab8"; break;                       // Haftalık Plan
        /* 10 = Veli & Durum: ARTIK SEKME DEGIL. Ogretmen profilinde,
           "Kisisel Bilgilerim"in altindaki akordiyonda yasiyor. Eski
           cagrilar (kisayol, gecmis bag) bosa dusmesin diye oraya yollanir. */
        case 10: if (typeof llTaramaAc === 'function') llTaramaAc(); return;
        case 11: panelId = "tab0"; llNotModu = 'etkinlik'; break; // -> Etkinlikler modu
    }

    // 2. Tıklanan butonu aktif yap — birlesen sekmelerde ana tus vurgulanir.
    /* 1-3 (Performans/Sınavlar/Genel Sonuç) ile 5 (Görev Gönder) ve 11
       (Etkinlikler) artık Öğrenciler sekmesinin MODLARI: hepsi 0 numaralı
       tuşu yakar. 6-8 ise Sınıf Araçları'nın araçlarıdır. */
    const gorselIdx = ((idx >= 1 && idx <= 3) || idx === 5 || idx === 11) ? 0
                    : ((idx >= 6 && idx <= 8) ? 4 : idx);
    let aktifTus = null;
    tabs.forEach(t => {
        const oc = t.getAttribute('onclick') || '';
        if (oc.indexOf('switchTab(' + gorselIdx + ')') >= 0) aktifTus = t;
    });
    if (aktifTus) aktifTus.classList.add('active');
    /* Sinif adi rozeti = Ogrenciler sekmesi. Turuncu vurgu YALNIZ o sekme
       acikken; Haftalik Plan gibi baska bir sekmeye gecince soner. */
    try {
        var _rozet = document.getElementById('active-class-title');
        if (_rozet) _rozet.classList.toggle('aktif', gorselIdx === 0);
    } catch (e) { }

    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // 4. Veri render işlemlerini tetikle
    if(panelId === 'tab0') llNotModSec(llNotModu);
    if(panelId === 'tab4') llAracSec(llAracModu);
    if(panelId === 'tab8') renderPlan();
    /* Görev Gönder ve Etkinlikler tetiklemesi llNotModSec içine taşındı.
       Veli & Durum taraması artık profildeki #tpTarama akordiyonunda. */
}

/* ==========================================================================
   TEK LISTE, MOD HAPLARI — Ogrenciler sekmesi icindeki gorunum secici.
   Ayni ogrenci listesi yerinde durur; hap degisince yalnizca sag taraftaki
   sutunlar (yonetim / performans / sinav / genel sonuc) degisir.
   ========================================================================== */
let llNotModu = 'liste';     // 'liste' | 'hw' | 'ex' | 'res' | 'gorev' | 'etkinlik'
/* GOREV GONDER ve ETKINLIKLER de burada yasar: eskiden ust seritte ayri
   sekmelerdi (tab9 / tab11), artik Performans/Sinavlar/Genel Sonuc ile ayni
   hap seridinde. Govdeleri hala #tab9 ve #tab11 kimlikli kutular oldugu icin
   gorev.js'e HIC dokunulmadi; yalnizca yerleri ve gorunurlukleri degisti. */
/* 'kura' de bir mod: Kurayla Sec, Sinif Araclari sekmesinden buraya tasindi.
   Serit sirasi: Liste - Kura - Performans - Sinavlar - Gorev - Etkinlik - Genel Sonuc. */
const LL_MODLAR = ['kura', 'hw', 'ex', 'res', 'gorev', 'etkinlik'];
function llNotModSec(m) {
    llNotModu = (LL_MODLAR.indexOf(m) >= 0) ? m : 'liste';
    const esle = { liste: 'llModListe', kura: 'llAracKura', hw: 'llModPerf', ex: 'llModSinav',
                   res: 'llModSonuc', gorev: 'tab9', etkinlik: 'tab11' };
    Object.keys(esle).forEach(k => {
        const el = document.getElementById(esle[k]);
        if (el) el.style.display = (k === llNotModu) ? '' : 'none';
    });
    document.querySelectorAll('#llNotModlar .ll-mod-hap').forEach(b => {
        b.classList.toggle('aktif', b.getAttribute('data-mod') === llNotModu);
    });
    if (llNotModu === 'liste') renderStudents();
    else if (llNotModu === 'kura') {
        if (typeof renderActivityButtons === 'function') renderActivityButtons();
        if (typeof renderActivityStatus === 'function') renderActivityStatus();
    }
    else if (llNotModu === 'hw') renderGrades('hw');
    else if (llNotModu === 'ex') renderGrades('ex');
    else if (llNotModu === 'res') renderResults();
    else if (llNotModu === 'gorev')    llGvPanel('tab9',  'sekmeGorevCiz',    'Görev Gönder', 0);
    else if (llNotModu === 'etkinlik') llGvPanel('tab11', 'sekmeEtkinlikCiz', 'Etkinlikler',  0);
}
window.llNotModSec = llNotModSec;

/* --------------------------------------------------------------------
   GÖREV GÖNDER / ETKİNLİKLER gövdesini çizer.
   Bu iki panelin içeriğini sistem/gorev.js (GV) yazar. GV, index.html'in
   EN SONUNDA yüklendiği ve öğretmen rolü Firebase'den GEÇ geldiği için
   hapa erken basıldığında panel bomboş kalıp "tuş çalışmıyor" gibi
   görünebiliyordu. Burada üç durum da açıkça karşılanır:
     1) GV hazır + öğretmen  -> normal çizim
     2) GV hazır + rol gelmemiş / öğrenci -> açıklayıcı not
     3) GV henüz yok -> "Yükleniyor" + kısa aralıklarla 3 sn tekrar dener
   -------------------------------------------------------------------- */
function llGvNot(baslik, mesaj) {
    return '<h3 style="margin:0 0 6px; color:#9C3B0C;">' + baslik + '</h3>' +
           '<div style="text-align:center; padding:26px 12px; color:#8B6A57; background:#FFF8F2;' +
           ' border:1px dashed #F0C9A6; border-radius:14px; font-size:.9rem;">' + mesaj + '</div>';
}
function llGvPanel(kutuId, islev, baslik, deneme) {
    const el = document.getElementById(kutuId);
    if (!el) return;
    const beklenenMod = (kutuId === 'tab9') ? 'gorev' : 'etkinlik';
    if (window.GV && typeof GV[islev] === 'function') {
        try { GV[islev](); } catch (e) { }
        /* sekmeGorevCiz/sekmeEtkinlikCiz öğretmen değilse hiç yazmadan döner */
        if (!el.innerHTML.trim()) {
            el.innerHTML = llGvNot(baslik,
                'Bu bölüm yalnızca <b>öğretmen</b> ve <b>yönetici</b> hesaplarında görünür. ' +
                'Öğretmen olarak giriş yaptıysanız sayfayı bir kez yenileyin.');
        }
        return;
    }
    deneme = deneme || 0;
    if (deneme < 20) {
        if (!el.innerHTML.trim()) el.innerHTML = llGvNot(baslik, 'Yükleniyor…');
        setTimeout(function () {
            if (llNotModu === beklenenMod) llGvPanel(kutuId, islev, baslik, deneme + 1);
        }, 150);
    } else {
        el.innerHTML = llGvNot(baslik,
            'Görev sistemi (<code>sistem/gorev.js</code>) yüklenemedi. ' +
            'Sayfayı <b>Ctrl/⌘ + Shift + R</b> ile yenilemeyi deneyin.');
    }
}
window.llGvPanel = llGvPanel;

/* SINIF ARACLARI — kura / geri sayim / kronometre / takim tek sekmede. */
/* KURAYLA SEC BURADAN CIKTI: artik Ogrenciler seridinde bir mod
   (llNotModSec -> 'kura'). Araclar seridinde geri sayim, kronometre ve
   takim kaldi; varsayilan geri sayim. */
let llAracModu = 'sayim';   // 'sayim' | 'kron' | 'takim'
function llAracSec(m) {
    llAracModu = (m === 'kron' || m === 'takim') ? m : 'sayim';
    const esle = { sayim: 'llAracSayim', kron: 'llAracKron', takim: 'llAracTakim' };
    Object.keys(esle).forEach(k => {
        const el = document.getElementById(esle[k]);
        if (el) el.style.display = (k === llAracModu) ? '' : 'none';
    });
    document.querySelectorAll('#llAracHaplar .ll-mod-hap').forEach(b => {
        b.classList.toggle('aktif', b.getAttribute('data-arac') === llAracModu);
    });
    if (llAracModu === 'takim' && typeof llTakimCiz === 'function') llTakimCiz();
}
window.llAracSec = llAracSec;


/* ---------------------------------------------------------------
   AÇIK SINIFI HATIRLA
   Öğretmen sınıf listesini açıp siteyi gezdiğinde (anasayfa, bir kart,
   profil, okul penceresi...) Listelerim'e döndüğünde liste kapalı
   geliyordu: veri yeniden yüklenirken curLId/curCId sıfırlanıyor ve
   hiçbir sınıf seçili kalmıyordu. Artık son açılan sınıf kullanıcı
   kimliğiyle birlikte cihazda saklanıyor; Listelerim yeniden açıldığında
   o sınıf kendiliğinden geri açılıyor.
   --------------------------------------------------------------- */
var LL_SON_ANAHTAR = 'll_son_sinif';
function llKimlik() {
    try {
        var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
        return u ? u.uid : '';
    } catch (e) { return ''; }
}
function llSonSinifYaz(lId, cId) {
    try { localStorage.setItem(LL_SON_ANAHTAR, JSON.stringify({ u: llKimlik(), l: lId, c: cId })); } catch (e) { }
}
function llSonSinifOku() {
    try {
        var k = JSON.parse(localStorage.getItem(LL_SON_ANAHTAR) || 'null');
        if (!k || !k.l || !k.c) return null;
        var u = llKimlik();
        if (u && k.u && k.u !== u) return null;          /* başka hesabın sınıfı açılmasın */
        return k;
    } catch (e) { return null; }
}
/* Listelerim açıldığında son sınıfı geri aç (zaten bir sınıf açıksa dokunma). */
function llSonSinifAc() {
    try {
        if (typeof curCId !== 'undefined' && curCId) return false;
        if (typeof data === 'undefined' || !data || !data.levels) return false;
        var k = llSonSinifOku(); if (!k) return false;
        var lvl = data.levels[k.l];
        if (!lvl || !lvl.classes || !lvl.classes[k.c]) return false;
        selectClass(k.l, k.c);
        /* İçerik bölmesi kesin görünsün: veri yüklendikten sonra çalışan
           "sınıf seçin" yer tutucusu paneli gizlemiş olabiliyor. */
        try {
            var c = document.getElementById('content'); if (c) c.style.display = 'block';
            var h = document.getElementById('ll-select-hint'); if (h) h.style.display = 'none';
            var t = document.querySelector('#content .tabs'); if (t) t.style.display = '';
        } catch (e) { }
        return true;
    } catch (e) { return false; }
}
window.llSonSinifAc = llSonSinifAc;

/* SINIF LISTESINI GERI AC — VERIYI BEKLEYEREK.
   llSonSinifAc() tek seferliktir: "data" henuz buluttan gelmediyse
   sessizce vazgecer. Ogretmen anasayfaya gidip geri donunce (ya da
   sayfa yenilenince) veri 1-2 saniye sonra geliyor, bu yuzden liste
   kapali kaliyordu. Burada veri gelene kadar kisa araliklarla denenir.
   Kayitli sinif yoksa hic beklenmez. */
/* Sinif paneli GERCEKTEN acik mi? curCId dolu olsa bile veri tazelenince
   panel "sinif secin" yer tutucusuna donebiliyor; o hâlde acik sayilmaz. */
function llSinifGorunurMu() {
    try {
        if (typeof curCId === 'undefined' || !curCId) return false;
        var h = document.getElementById('ll-select-hint');
        if (h && getComputedStyle(h).display !== 'none') return false;
        return true;
    } catch (e) { return false; }
}
function llSonSinifAcBekle(sureMs) {
    function dur() {
        if (window._llBeklemeId) { clearInterval(window._llBeklemeId); window._llBeklemeId = 0; }
    }
    dur();
    if (llSinifGorunurMu()) return true;                    /* zaten ekranda */
    try { if (!llSonSinifOku() && !(typeof curCId !== 'undefined' && curCId)) return false; }
    catch (e) { return false; }                             /* açılacak sınıf yok */

    var bitis = Date.now() + (sureMs || 8000);
    function dene() {
        /* 1) curCId dolu ama panel yer tutucuda kalmış → aynı sınıfı yeniden seç */
        try {
            if (typeof curCId !== 'undefined' && curCId && typeof curLId !== 'undefined' && curLId &&
                typeof selectClass === 'function' && typeof data !== 'undefined' && data && data.levels &&
                data.levels[curLId] && data.levels[curLId].classes &&
                data.levels[curLId].classes[curCId]) {
                selectClass(curLId, curCId);
            }
        } catch (e) { }
        /* 2) hiç sınıf seçili değilse kayıttaki sınıfı aç */
        try { llSonSinifAc(); } catch (e) { }
        if (llSinifGorunurMu() || Date.now() > bitis) { dur(); return true; }
        return false;
    }
    if (dene()) return true;
    window._llBeklemeId = setInterval(dene, 200);
    return false;
}
window.llSinifGorunurMu = llSinifGorunurMu;
window.llSonSinifAcBekle = llSonSinifAcBekle;

function selectClass(lId, cId, element) {
    if (!data || !data.levels[lId]) return;

    /* TAM EKRAN KALDIRILDI: sinif acilinca tarayici tam ekrana geciyordu.
       Ogretmen sekmeler/adres cubugu kaybolunca sitenin geri kalanina
       ulasamiyordu. Tam ekran artik yalnizca ISTEGE BAGLI: llTamEkranDegistir()
       tusuyla acilir/kapanir (window.llTamEkranAc duruyor). */

    // 1. Önce sidebar'daki TÜM sınıflardan aktiflik sınıfını temizle
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('active-class');
    });

    // 2. Eğer bir HTML elementi (tıklanan link) gelmişse, onun kapsayıcısına vurgu ekle
    if (element) {
        const parentItem = element.closest('.class-item');
        if (parentItem) parentItem.classList.add('active-class');
    } else {
        // Eğer element gelmemişse (otomatik seçim durumunda), DOM üzerinden bulmaya çalış
        const allLinks = document.querySelectorAll('.class-link');
        allLinks.forEach(link => {
            // Linkin içindeki onclick metni kontrol ederek doğru sınıfı bul
            if (link.getAttribute('onclick').includes(`'${cId}'`)) {
                link.closest('.class-item').classList.add('active-class');
            }
        });
    }

    /* Mobilde sinif secilir secilmez cekmeceyi kapat -> icerik gorunsun. */
    try { if (typeof llCekmeceKapatMobil === 'function') llCekmeceKapatMobil(); } catch (e) { }

    // --- Mevcut seçim mantığınız (başlık güncelleme, tablo çizme vb.) ---
    const viewTitle = document.getElementById('viewTitle');
    const content = document.getElementById('content');
    if (content) content.style.display = 'block';
    var _h=document.getElementById('ll-select-hint'); if(_h) _h.style.display='none';
    var _t=document.querySelector('#content .tabs'); if(_t) _t.style.display='';

    curLId = lId; 
    curCId = cId;
    llSonSinifYaz(lId, cId);        /* siteyi gezip dönünce liste açık kalsın */
    
    if (viewTitle) {
    const className = data.levels[lId].classes[cId].name;
    // Yazı boyutunu 2.5rem (yaklaşık 40px) yaparak çok daha büyük bir başlık oluşturduk
    /* SINIF ADI = "OGRENCILER" SEKMESI.
       Eskiden ayri bir ogrenci simgesi vardi ve rozet okul penceresini
       aciyordu; ikisi de ayni yeri gosterdigi icin kafa karistiriyordu.
       Artik rozetin kendisi listeyi acan sekmedir (switchTab(0)); sinif
       DEGISTIRMEK icin cubuktaki OKUL tusu var.
       Bicim satir ici degil CSS'te (#ll-root #content .tabs #active-class-title):
       rozet oteki sekmeler gibi ancak KENDI sekmesi acikken vurgulanmali,
       bu da satir ici stille yapilamiyordu. */
    viewTitle.innerHTML = `<span id="active-class-title" class="ll-sinif-rozet"` +
        ` onclick="switchTab(0)" title="Öğrenciler — ${behKacis(className)} sınıf listesi"` +
        ` role="button" tabindex="0">${behKacis(className)}</span>`;
    /* Emniyet: kap hangi kurala takilirsa takilsin gorunur kalsin. */
    viewTitle.style.setProperty('display', 'flex', 'important');
    viewTitle.style.alignItems = 'center';
    viewTitle.style.margin = '0 6px 0 0';
}

    switchTab(0); 
    renderStudents();
    renderActivityButtons();

    // Kaldığımız yer bilgisini yükle
    const stayedPoint = document.getElementById('stayedPoint');
    if (stayedPoint) {
        stayedPoint.value = data.levels[lId].classes[cId].stayedPoint || "";
    }
}


// Kaldığımız yer bilgisini kaydetme fonksiyonu
function updateStayedPoint(val) {
    // Güvenlik: Sadece bir sınıf seçiliyse ve veri yapısı hazırsa kaydet
    if (curLId && curCId && data.levels[curLId] && data.levels[curLId].classes[curCId]) {
        data.levels[curLId].classes[curCId].stayedPoint = val;
        console.log("Kaldığımız yer kaydedildi: " + val);
        save(); // Veriyi yerel ve bulut hafızaya gönder
    } else {
        console.warn("Hata: Veri kaydedilecek sınıf seçili değil!");
    }
}

// renderPlan fonksiyonunu da güncellemek gerekebilir (daha önce eklemediysen)
function updateActivityTable() {
    const table = document.getElementById('activityStatusTable');
    if (!table) return;
    table.innerHTML = '';

    const header = table.insertRow();
    ['Etkinlik', 'Seçilen Öğrenciler'].forEach(text => {
        const th = document.createElement('th');
        th.innerText = text;
        header.appendChild(th);
    });

    for (const activity in activityPools) {
        const row = table.insertRow();
        row.insertCell(0).innerText = activity;
        const td = row.insertCell(1);

        activityPools[activity].forEach(name => {
            const box = document.createElement('div');
            
            // CSS'in çalışması için bu sınıfı mutlaka ekliyoruz
            box.classList.add('student-box');
            
            box.style.backgroundColor = getActivityColor(activity);
            box.style.padding = '5px 12px';
            box.style.borderRadius = '4px';
            box.style.color = 'white';
            box.style.display = 'inline-block';
            box.style.margin = '3px';
            box.style.position = 'relative'; 
            box.style.cursor = 'pointer';
            box.innerText = name;

            // Silme işlemi
            box.onclick = function() {
                llOnay(name + " kaydını silmek istiyor musunuz?", () => {
                    const index = activityPools[activity].indexOf(name);
                    if (index > -1) {
                        activityPools[activity].splice(index, 1);
                        if (typeof saveData === "function") saveData(); 
                        updateActivityTable(); 
                    }
                });
            };

            td.appendChild(box);
        });
    }
}
function modalAc() {
    var m=document.getElementById('login-modal'); if(m) m.style.display='flex';
}


// Modalın dışına tıklanarak kapanmasını engelleyen yapı
window.onclick = function(event) {
    let modal = document.getElementById("login-modal");
    // Bu kısmı boş bırakıyoruz veya dış tıklama kontrolünü siliyoruz.
    // Böylece sadece modalKapat() fonksiyonu tetiklendiğinde kapanacaktır.
}

function modalKapat() {
    var m=document.getElementById('login-modal'); if(m) m.style.display='none';
}

async function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const hata = document.getElementById('hata-mesaji');

    if(email === "" || pass === "") {
        hata.innerText = "Lütfen tüm alanları doldurun.";
        hata.style.display = "block";
        return;
    }

    // Firebase entegrasyonu yapıldığında burası güncellenecek
    // Şimdilik simülasyon yapalım:
    if(email && pass) {
        alert("Giriş başarılı! Verileriniz senkronize ediliyor...");
        modalKapat();
        document.getElementById('login-nav-btn').innerHTML = llIcon('onay') + " " + behKacis(email);
        // document.getElementById('main-app').style.display = 'block';
    }
}

   // --- TEMEL VERİ YAPILARI ---
let data;

// Veriyi tazelemek için bu fonksiyonu kullanacağız
function loadDataFromLocal() {
    const localData = localStorage.getItem('schoolData');
    if (localData) {
        data = JSON.parse(localData);
        if (!data.levels) data.levels = {};
        console.log("Veriler hafızadan yüklendi.");
    }
    return localData;
}

// Sayfa ilk açıldığında kontrol et
const ilkKontrol = loadDataFromLocal();

// Eğer tarayıcıda kayıtlı veri yoksa örnekleri oluştur
if (!ilkKontrol) {
    let varsayilanVeri = { levels: {}, levelOrder: [] };
    for (let i = 1; i <= 3; i++) {
        let lId = 'L' + i;
        varsayilanVeri.levelOrder.push(lId);
        varsayilanVeri.levels[lId] = {
            name: i + ". Seviye",
            classes: {},
            config: { 
                hw: [{n: '1. Ödev', w: 25}, {n: '2. Ödev', w: 25}, {n: '3. Ödev', w: 25}, {n: '4. Ödev', w: 25}], 
                ex: [{n: 'Dinleme', w: 25}, {n: 'Konuşma', w: 25}, {n: 'Yazılı', w: 50}] 
            }
        };

        ['A', 'B', 'C'].forEach(letter => {
            let cId = 'C' + i + letter;
            let students = [];
            for (let s = 1; s <= 10; s++) {
                students.push({
                    name: i + "-" + letter + " Öğrencisi " + s,
                    hw: [0, 0, 0, 0], ex: [0, 0, 0], history: [],
                    skills: { 'Konuşma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'Sözlük': 5, 'Tercüme': 5 },
                    notes: ""
                });
            }
            varsayilanVeri.levels[lId].classes[cId] = {
                name: i + "-" + letter + " Şubesi",
                students: students,
                planStatus: {}, planText: {}, stayedPoint: ""
            };
        });
    }
    localStorage.setItem('schoolData', JSON.stringify(varsayilanVeri));
    data = varsayilanVeri;
}

// Global Değişkenler
let curLId = null, curCId = null;
let pools = {}; 
let alertCallback = null;
let audioCtx = null;

/* Gizli bolumdeki sabit pencereyi PROFILDEyken de gosterir.
   ONEMLI: pencere YERINDE birakilir (body'ye tasinmaz!) — tasinirsa
   #ll-root kapsamli stiller (agirlik satirlari vb.) kopar ve tasarim
   bozulur. Bunun yerine gizli bolum "gorunmez tasiyici" kipine alinir:
   bolum display:block ama visibility:hidden olur, yalniz pencere gorunur. */
function llGovdeyeAl(id) {
    try {
        var el = document.getElementById(id);
        if (!el) return;
        /* Onceki surum pencereyi body'ye tasidiysa kapsam icin GERI koy */
        var kok = document.getElementById('ll-root');
        if (el.parentElement === document.body && kok) kok.appendChild(el);
        var sec = document.getElementById('listelerim-section');
        if (!sec) return;
        if (getComputedStyle(sec).display === 'none') sec.classList.add('ll-modal-tasiyici');
        /* Bekci: acik pencere kalmayinca tasiyici kipini kaldirir */
        if (!window._llTasiyiciBekci) {
            window._llTasiyiciBekci = setInterval(function () {
                var s = document.getElementById('listelerim-section');
                if (!s || !s.classList.contains('ll-modal-tasiyici')) return;
                var acikVar = ['lvlModal', 'tatilModal', 'behModal', 'skillModal', 'noteModal', 'defterModal'].some(function (mid) {
                    var m = document.getElementById(mid);
                    return m && m.style.display && m.style.display !== 'none';
                });
                if (!acikVar) s.classList.remove('ll-modal-tasiyici');
            }, 500);
        }
    } catch (e) { }
}
window.llGovdeyeAl = llGovdeyeAl;

function openTatiller() {
    llGovdeyeAl('tatilModal');
    const modal = document.getElementById('tatilModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error("Tatil modalı HTML içinde bulunamadı!");
    }
}

    /* --- SES SİSTEMİ (yumuşak) ---
       Eski sesler ham osilatördü: aniden başlayıp aniden kesiliyor, bu da
       sınıfta tiz bir "bip" ve baş/son çıtırtısı olarak duyuluyordu. Artık
       her ses YUMUŞAK GİRİŞ–SÖNÜM zarfından (attack/release) ve alçak geçiren
       süzgeçten geçer; ses düzeyi de düşürüldü. Kura sonucu tek tiz bip
       yerine iki notalı sakin bir çan sesidir. */
    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    /* Tek yumuşak nota: f = frekans, sure = saniye, gecikme = saniye, tepe = ses düzeyi */
    function llTon(f, sure, gecikme, tepe) {
        try {
            initAudio();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            sure = sure || 0.5; gecikme = gecikme || 0; tepe = tepe || 0.085;
            var t0 = audioCtx.currentTime + gecikme;
            var osc = audioCtx.createOscillator();
            var suz = audioCtx.createBiquadFilter();
            var kaz = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t0);
            suz.type = 'lowpass';
            suz.frequency.setValueAtTime(1600, t0);
            suz.Q.value = 0.7;
            kaz.gain.setValueAtTime(0.0001, t0);
            kaz.gain.exponentialRampToValueAtTime(tepe, t0 + 0.045);   /* yumuşak giriş */
            kaz.gain.exponentialRampToValueAtTime(0.0001, t0 + sure);  /* yumuşak sönüm */
            osc.connect(suz); suz.connect(kaz); kaz.connect(audioCtx.destination);
            osc.start(t0);
            osc.stop(t0 + sure + 0.06);
        } catch (e) { }
    }
    /* Eski çağrılar bozulmasın: playBeep artık yumuşak tona yönlenir. */
    function playBeep(freq, dur) {
        llTon(freq || 523, Math.max(0.32, ((dur || 200) / 1000) * 2), 0, 0.08);
    }
    /* Kura sonucu: iki notalı sakin çan (Do → Sol) */
    function llKuraSesi() {
        llTon(523.25, 0.60, 0,    0.080);
        llTon(783.99, 0.85, 0.11, 0.065);
    }
    /* Artı / eksi puan: kısa ve yumuşak */
    function llPuanSesi(arti) {
        if (arti) { llTon(659.25, 0.45, 0, 0.070); llTon(880.00, 0.50, 0.08, 0.055); }
        else      { llTon(392.00, 0.55, 0, 0.065); }
    }

    // --- UYARI SİSTEMİ ---
    function showConfirm(title, text, icon, callback) {
        document.getElementById('alertTitle').innerText = title;
        document.getElementById('alertText').innerText = text;
        document.getElementById('alertIcon').innerHTML = icon;
        document.getElementById('customAlertModal').style.display = 'flex';
        alertCallback = callback;
    }
    function closeAlert(result) {
        document.getElementById('customAlertModal').style.display = 'none';
        if(result && alertCallback) alertCallback();
    }

    // --- VERİ YÖNETİMİ ---
// save() fonksiyonunu şu şekilde güncelleyin
function save() {
    // 1. Önce bilgisayara (Local) kaydet
    localStorage.setItem('schoolData', JSON.stringify(data));
    renderSidebar();
    /* Profildeki "Kurumlarim & Siniflarim" binasi da guncel kalsin
       (sifre/onay pencereleri asenkron kapandigi icin zamanlayiciya
       guvenilmez). Kullanici bir alana yaziyorsa dokunma. */
    try {
        if (document.getElementById('tpOkullar')) {
            var _a = document.activeElement;
            if (!(_a && (_a.tagName === 'INPUT' || _a.tagName === 'SELECT' || _a.tagName === 'TEXTAREA')))
                renderTeacherProfile();
        }
    } catch (e) { }

    // 2. Eğer giriş yapılmışsa buluta (Firebase) gönder
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection("kullanicilar").doc(user.uid).set({
            userData: JSON.stringify(data),
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        .then(() => console.log("Bulutla eşleşti ✅"))
        .catch((error) => console.error("Bulut kayıt hatası:", error));
    }
}

/* ================= KODLA OGRENCI EKLE =================
   Sistemde KAYITLI bir ogrenci (or. baska sinifta) KODUYLA bu sinifa da
   eklenir: kimligi (ad, kod, bagli hesap) tasinir; yeni sinifta notlari
   sifirdan baslar. Ayni sinifa ikinci kez eklenemez.                        */
function kodlaOgrenciEkle() {
    if (!curLId || !curCId || !data.levels[curLId] || !data.levels[curLId].classes[curCId]) {
        llBilgi('Önce soldan bir sınıf seçin.'); return;
    }
    const el = document.getElementById('kodlaEkleKod');
    const kod = ((el && el.value) || '').replace(/[\s\u00A0]+/g, '').toUpperCase();
    if (!kod) { llBilgi('Lütfen öğrencinin kodunu yazın (örn. TCH-4582-X8B2).'); return; }

    /* aktif tum siniflarda ara */
    let bulunan = null, bulunduguSinif = '';
    Object.keys(data.levels).forEach(lId => {
        const lvl = data.levels[lId];
        Object.keys(lvl.classes || {}).forEach(cId => {
            (lvl.classes[cId].students || []).forEach(st => {
                if (((st.loginCode || '').toUpperCase() === kod) && !bulunan) {
                    bulunan = st;
                    bulunduguSinif = (lvl.name || lId) + ' / ' + (lvl.classes[cId].name || cId);
                }
            });
        });
    });

    const hedef = data.levels[curLId].classes[curCId];
    if (!Array.isArray(hedef.students)) hedef.students = [];

    if ((hedef.students || []).some(st => (st.loginCode || '').toUpperCase() === kod)) {
        llBilgi('Bu öğrenci zaten bu sınıfta kayıtlı.'); return;
    }
    if (!bulunan) {
        /* arsivde mi? */
        const arsivde = (data.arsiv || []).some(a =>
            ((a.veri && a.veri.students) || []).some(st => (st.loginCode || '').toUpperCase() === kod));
        llBilgi(arsivde
            ? 'Bu kod arşivlenmiş bir sınıfta bulundu. Önce 🗄 Arşiv bölümünden o sınıfı geri yükleyin.'
            : 'Bu kodla kayıtlı öğrenci bulunamadı. Kodu kontrol edin.'); 
        return;
    }

    llOnay('"' + (bulunan.name || 'Öğrenci') + '" (' + bulunduguSinif + ') bu sınıfa da eklensin mi?\n' +
        'Kimliği ve bağlı hesabı taşınır; bu sınıftaki notları sıfırdan başlar.', () => {
        hedef.students.push({
            name: bulunan.name || 'Öğrenci',
            loginCode: bulunan.loginCode,
            hesapUid: bulunan.hesapUid || undefined,
            hesapEmail: bulunan.hesapEmail || undefined,
            hw: [], ex: [], history: [], personalMissions: [],
            skills: { 'Konuşma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'Sözlük': 5, 'Tercüme': 5 },
            notes: '', behLog: [], noteLog: []
        });
        save();
        if (typeof renderStudents === 'function') renderStudents();
        if (el) el.value = '';
        llBilgi('"' + (bulunan.name || 'Öğrenci') + '" bu sınıfa eklendi. ✓');
    }, { evet: 'Sınıfa Ekle', ton: 'normal' });
}
window.kodlaOgrenciEkle = kodlaOgrenciEkle;

/* ================= SITE TASARIMLI UYARI & ONAY PENCERELERI =================
   Tarayicinin ham alert()/confirm() kutulari yerine site paletinde
   pencereler. llBilgi: tek tusla kapanan bilgi/uyari. llOnay: Evet/Vazgec.
   alert() SITE GENELINDE llBilgi'ye yonlendirilir.                          */
function llBilgi(mesaj, baslik) {
    let k = document.getElementById('llBilgiModal');
    if (!k) {
        k = document.createElement('div');
        k.id = 'llBilgiModal';
        k.setAttribute('style', 'display:none; position:fixed; inset:0; z-index:1000090; background:rgba(0,0,0,.55);' +
            'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
        k.innerHTML = `
            <div style="background:#fff; width:100%; max-width:420px; border-radius:16px; overflow:hidden; box-shadow:0 18px 46px rgba(0,0,0,.35);">
                <div id="llBilgiBaslik" style="background:linear-gradient(135deg,#F39C12,#D84315); color:#fff; padding:12px 16px; font-weight:700;"></div>
                <div style="padding:18px 16px;">
                    <p id="llBilgiMetin" style="margin:0 0 16px; color:#6B4A38; line-height:1.6; white-space:pre-line;"></p>
                    <button type="button" id="llBilgiTamam" style="width:100%; padding:12px; border:none; border-radius:11px;
                        cursor:pointer; font-family:inherit; font-weight:700; font-size:1rem; color:#fff;
                        background:linear-gradient(135deg,#F39C12,#D84315);">Tamam</button>
                </div>
            </div>`;
        document.body.appendChild(k);
        k.querySelector('#llBilgiTamam').onclick = () => { k.style.display = 'none'; };
    }
    k.querySelector('#llBilgiBaslik').textContent = baslik || '📢 Bilgi';
    k.querySelector('#llBilgiMetin').textContent = String(mesaj == null ? '' : mesaj);
    k.style.display = 'flex';
    setTimeout(() => { try { k.querySelector('#llBilgiTamam').focus(); } catch (e) { } }, 60);
}
window.llBilgi = llBilgi;
/* Tum ham alert'ler site tasarimina donusur (engellemesiz). */
window.alert = function (m) { llBilgi(m); };

function llOnay(mesaj, evet, ayar) {
    ayar = ayar || {};
    let k = document.getElementById('llOnayModal');
    if (!k) {
        k = document.createElement('div');
        k.id = 'llOnayModal';
        k.setAttribute('style', 'display:none; position:fixed; inset:0; z-index:1000090; background:rgba(0,0,0,.55);' +
            'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
        k.innerHTML = `
            <div style="background:#fff; width:100%; max-width:440px; border-radius:16px; overflow:hidden; box-shadow:0 18px 46px rgba(0,0,0,.35);">
                <div id="llOnayBaslik" style="color:#fff; padding:12px 16px; font-weight:700;"></div>
                <div style="padding:18px 16px;">
                    <p id="llOnayMetin" style="margin:0 0 16px; color:#6B4A38; line-height:1.6; white-space:pre-line;"></p>
                    <div style="display:flex; gap:9px;">
                        <button type="button" id="llOnayEvet" style="flex:1; padding:12px; border:none; border-radius:11px;
                            cursor:pointer; font-family:inherit; font-weight:700; font-size:1rem; color:#fff;"></button>
                        <button type="button" id="llOnayVazgec" style="padding:12px 18px; border:1px solid #F0DACA;
                            border-radius:11px; cursor:pointer; font-family:inherit; font-weight:700; color:#B34700;
                            background:#fff;">Vazgeç</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(k);
    }
    const tehlike = ayar.ton !== 'normal';
    k.querySelector('#llOnayBaslik').textContent = ayar.baslik || (tehlike ? '⚠️ Emin misiniz?' : '❓ Onay');
    k.querySelector('#llOnayBaslik').style.background = tehlike
        ? 'linear-gradient(135deg,#E74C3C,#C0392B)' : 'linear-gradient(135deg,#F39C12,#D84315)';
    k.querySelector('#llOnayMetin').textContent = String(mesaj == null ? '' : mesaj);
    const ev = k.querySelector('#llOnayEvet');
    ev.textContent = ayar.evet || 'Evet';
    ev.style.background = tehlike
        ? 'linear-gradient(135deg,#E74C3C,#C0392B)' : 'linear-gradient(135deg,#20C997,#16A085)';
    ev.onclick = () => { k.style.display = 'none'; try { evet && evet(); } catch (e) { console.warn(e); } };
    k.querySelector('#llOnayVazgec').onclick = () => { k.style.display = 'none'; };
    k.style.display = 'flex';
    /* Esc = VAZGEÇ. Kaçış tuşu hiçbir zaman onaylamaz; yanlışlıkla silme/
       çıkış olmasın diye evet yalnız düğmeyle verilir. Perdeye tıklamak da
       kapatır. Dinleyici tek sefer bağlanır (k._llKacis işareti). */
    if (!k._llKacis) {
        k._llKacis = true;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && k.style.display !== 'none') { k.style.display = 'none'; e.preventDefault(); }
        });
        k.addEventListener('click', (e) => { if (e.target === k) k.style.display = 'none'; });
    }
    setTimeout(() => { try { k.querySelector('#llOnayVazgec').focus(); } catch (e) { } }, 60);
}
window.llOnay = llOnay;

/* ================= KURUM (okul/kurs) KATMANI =================
   Kurumlar seviye+siniflari gruplar: data.kurumlar = {K..:{name}},
   seviyede lvl.kurumId tutulur. Kurumsuz seviyeler "Genel" bolumunde. */
function addKurum() {
    let name = prompt("Yeni Kurum Adı (Örn: Fatih Kur'an Kursu):");
    if (!name || !name.trim()) return;
    if (!data.kurumlar) data.kurumlar = {};
    data.kurumlar['K' + Date.now()] = { name: name.trim() };
    save();
}
window.addKurum = addKurum;

function kurumSecMenu() {
    /* Kurum varsa yeni seviyenin hangi kuruma bağlanacağını sorar. */
    const ks = data.kurumlar || {};
    const idler = Object.keys(ks);
    if (!idler.length) return null;
    if (idler.length === 1) return idler[0];
    let liste = idler.map((id, i) => (i + 1) + ') ' + ks[id].name).join('\n');
    const c = prompt('Bu seviye hangi kuruma eklensin?\n' + liste + '\n(numara yazın)', '1');
    if (c === null) return undefined;                 /* vazgecti */
    const i = parseInt(c) - 1;
    return idler[i] || idler[0];
}

function kurumSil(kId) {
    islemSifresiSor(function () {
        llOnay('Kurum silinsin mi? (Seviyeler silinmez, "Genel" bölümüne taşınır)', () => {
            Object.values(data.levels || {}).forEach(l => { if (l && l.kurumId === kId) delete l.kurumId; });
            if (data.kurumlar) delete data.kurumlar[kId];
            save();
        }, { evet: 'Kurumu Sil' });
    });
}
window.kurumSil = kurumSil;
function kurumAdDegistir(kId) {
    const k = data.kurumlar && data.kurumlar[kId];
    if (!k) return;
    const n = prompt('Kurum adı:', k.name);
    if (n && n.trim()) { k.name = n.trim(); save(); }
}
window.kurumAdDegistir = kurumAdDegistir;
var _kurumKapali = {};
function kurumAcKapa(kId) {
    _kurumKapali[kId] = !_kurumKapali[kId];
    renderSidebar();
}
window.kurumAcKapa = kurumAcKapa;

function addLevel(oncedenKurum) {
    let name = prompt("Yeni Seviye Adı (Örn: 10. Sınıflar):");
    if(name) {
        /* kurum onceden verildiyse sorma; 'GENEL' -> kurumsuz bolume ekle */
        let kurumId;
        if (oncedenKurum === 'GENEL') kurumId = null;
        else if (oncedenKurum && data.kurumlar && data.kurumlar[oncedenKurum]) kurumId = oncedenKurum;
        else kurumId = kurumSecMenu();
        if (kurumId === undefined) return;            /* kurum seciminden vazgecti */
        let id = 'L' + Date.now();
        data.levels[id] = { 
            name: name, 
            kurumId: kurumId || undefined,
            classes: {}, 
            planText: {},
            config: { 
                // Yeni seviyede otomatik 4 ödev %25
                hw: [
                    {n: '1. Ödev', w: 25}, {n: '2. Ödev', w: 25}, 
                    {n: '3. Ödev', w: 25}, {n: '4. Ödev', w: 25}
                ], 
                // Yeni seviyede otomatik Sınav Ağırlıkları
                ex: [
                    {n: 'Dinleme', w: 25}, 
                    {n: 'Konuşma', w: 25}, 
                    {n: 'Yazılı', w: 50}
                ] 
            } 
        };
        if(!data.levelOrder) data.levelOrder = [];
        data.levelOrder.push(id);
        save();
    }
}

    function addClass(lId) {
        let name = prompt("Yeni Sınıf Adı (Örn: 10A):");
        if(name && data.levels[lId]) {
            let id = 'C' + Date.now();
            if(!data.levels[lId].classes) data.levels[lId].classes = {};
            data.levels[lId].classes[id] = { name: name, students: [] };
            save();
        }
    }
    
    /* Sinif silme/duzenleme icin ISLEM SIFRESI. Ilk kullanımda belirlenir,
       veriyle birlikte kaydedilir. Giris MASKELI bir pencerede yapilir
       (type="password") — yazilirken ekranda gorunmez. Dogrulanirsa
       devam() calistirilir. */
    /* Sinif silme/duzenleme onayi: KAYIT OLURKEN KULLANILAN HESAP SIFRESI
       sorulur (maskeli). Firebase uzerinden gercekten dogrulanir
       (reauthenticateWithCredential). Hesap oturumu yoksa (cevrimdisi/mock)
       eski "islem sifresi" duzeni yedek olarak calisir. */
    function islemSifresiSor(devam) {
        const fu = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
        const hesapModu = !!(fu && fu.email && !fu.isAnonymous &&
            firebase.auth.EmailAuthProvider && fu.reauthenticateWithCredential);

        const kayitli = (data.ayarlar && data.ayarlar.islemSifresi) || '';
        const kurulum = !hesapModu && !kayitli;

        let k = document.getElementById('llSifreModal');
        if (!k) {
            k = document.createElement('div');
            k.id = 'llSifreModal';
            k.setAttribute('style', 'display:none; position:fixed; inset:0; z-index:1000080; background:rgba(0,0,0,.55);' +
                'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
            k.innerHTML = `
                <div style="background:#fff; width:100%; max-width:380px; border-radius:16px; overflow:hidden;">
                    <div id="llSifreBaslik" style="background:linear-gradient(135deg,#F39C12,#D84315); color:#fff;
                        padding:12px 16px; font-weight:700;">🔒 Şifre</div>
                    <div style="padding:16px; display:flex; flex-direction:column; gap:10px;">
                        <p id="llSifreAciklama" style="margin:0; font-size:.85rem; color:#6B4A38;"></p>
                        <input type="password" id="llSifre1" autocomplete="current-password" placeholder="Şifre"
                            style="padding:12px; border:1px solid #E8A87C; border-radius:10px; font-family:inherit; font-size:1rem;">
                        <input type="password" id="llSifre2" autocomplete="new-password" placeholder="Şifre (tekrar)"
                            style="display:none; padding:12px; border:1px solid #E8A87C; border-radius:10px; font-family:inherit; font-size:1rem;">
                        <p id="llSifreNot" style="min-height:17px; margin:0; font-size:.83rem; color:#E74C3C;"></p>
                        <div style="display:flex; gap:9px;">
                            <button type="button" id="llSifreOnay" style="flex:1; padding:11px; border:none; border-radius:10px;
                                cursor:pointer; font-family:inherit; font-weight:700; color:#fff;
                                background:linear-gradient(135deg,#F39C12,#D84315);">Onayla</button>
                            <button type="button" id="llSifreIptal" style="padding:11px 16px; border:1px solid #F0DACA;
                                border-radius:10px; cursor:pointer; font-family:inherit; font-weight:700; color:#B34700;
                                background:#fff;">İptal</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(k);
        }

        const v1 = k.querySelector('#llSifre1');
        const v2 = k.querySelector('#llSifre2');
        const not = k.querySelector('#llSifreNot');
        const aciklama = k.querySelector('#llSifreAciklama');
        const baslik = k.querySelector('#llSifreBaslik');
        const onayTus = k.querySelector('#llSifreOnay');
        v1.value = ''; v2.value = ''; not.textContent = '';
        onayTus.disabled = false; onayTus.textContent = 'Onayla';

        if (hesapModu) {
            baslik.textContent = '🔒 Hesap Şifreniz';
            aciklama.textContent = 'Bu işlem için siteye kayıt olurken belirlediğiniz hesap şifrenizi girin (' + fu.email + ').';
            v2.style.display = 'none';
            v1.placeholder = 'Hesap şifreniz';
        } else {
            baslik.textContent = kurulum ? '🔒 İşlem Şifresi Belirle (ilk kurulum)' : '🔒 İşlem Şifresi';
            aciklama.textContent = kurulum ? 'Çevrimdışı kullanım için bir işlem şifresi belirleyin.' : '';
            v2.style.display = kurulum ? '' : 'none';
            v1.placeholder = kurulum ? 'Yeni şifre' : 'Şifre';
        }

        const kapat = () => { k.style.display = 'none'; };
        const onayla = () => {
            const a = v1.value;
            if (hesapModu) {
                if (!a) { not.textContent = 'Şifre boş olamaz.'; return; }
                onayTus.disabled = true; onayTus.textContent = 'Kontrol ediliyor…';
                const cred = firebase.auth.EmailAuthProvider.credential(fu.email, a);
                fu.reauthenticateWithCredential(cred).then(() => {
                    kapat(); devam();
                }).catch((e) => {
                    onayTus.disabled = false; onayTus.textContent = 'Onayla';
                    const kod = (e && e.code) || '';
                    not.textContent = /too-many/.test(kod)
                        ? 'Çok fazla deneme — biraz bekleyip tekrar deneyin.'
                        : (/network/.test(kod) ? 'Bağlantı hatası — internetinizi kontrol edin.' : 'Şifre yanlış.');
                    v1.value = ''; v1.focus();
                });
                return;
            }
            const at = a.trim();
            if (kurulum) {
                if (!at) { not.textContent = 'Şifre boş olamaz.'; return; }
                if (at !== v2.value.trim()) { not.textContent = 'Şifreler uyuşmuyor.'; return; }
                if (!data.ayarlar) data.ayarlar = {};
                data.ayarlar.islemSifresi = at;
                save();
                kapat(); devam();
            } else {
                if (at !== kayitli) { not.textContent = 'Şifre yanlış.'; v1.value = ''; v1.focus(); return; }
                kapat(); devam();
            }
        };
        onayTus.onclick = onayla;
        k.querySelector('#llSifreIptal').onclick = kapat;
        v1.onkeydown = v2.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); onayla(); } };

        k.style.display = 'flex';
        setTimeout(() => { try { v1.focus(); } catch (e) { } }, 60);
    }
    window.islemSifresiSor = islemSifresiSor;

    // Silme ve Düzenleme Fonksiyonları
    function editLevelName(lId) {
        let n = prompt("Yeni İsim:", data.levels[lId].name);
        if(n) { data.levels[lId].name = n; save(); }
    }
    /* Seviye silme de sinif/kurum silme gibi ONCE SIFRE ister.
       Sira: sifre modali (z-index 1000080) -> onay modali (1000090). */
    function deleteLevel(lId) {
        islemSifresiSor(function () {
        llOnay("Seviyeyi ve TÜM sınıflarını silmek istiyor musunuz?\nBu işlem geri alınamaz.", () => {
            /* seviyedeki tum siniflarin ogrencilerinin bulut bagi da kopar */
            const kopanlar = [];
            try {
                const cls = (data.levels[lId] || {}).classes || {};
                Object.keys(cls).forEach(cId => {
                    ((cls[cId] || {}).students || []).forEach(st => kopanlar.push(st));
                });
            } catch (e) { }
            delete data.levels[lId];
            data.levelOrder = data.levelOrder.filter(id => id !== lId);
            if(curLId === lId) document.getElementById('content').style.display='none';
            save();
            bagDurumGuncelle(kopanlar, 'kopuk');
        }, { evet: 'Seviyeyi Sil' });
        });
    }
    function editClassName(lId, cId) {
        islemSifresiSor(function () {
            let n = prompt("Yeni İsim:", data.levels[lId].classes[cId].name);
            if(n) { data.levels[lId].classes[cId].name = n; save(); }
        });
    }
    function deleteClass(lId, cId) {
        islemSifresiSor(function () {
        llOnay("Sınıfı silmek istiyor musunuz?\n\nİpucu: Silmek yerine ARŞİVLEYEBİLİRSİNİZ (🗄) — tüm bilgiler saklanır.", () => {
            const kopanlar = ((data.levels[lId].classes[cId] || {}).students || []).slice();
            delete data.levels[lId].classes[cId];
            if(curCId === cId) document.getElementById('content').style.display='none';
            save();
            bagDurumGuncelle(kopanlar, 'kopuk');
        }, { evet: 'Sınıfı Sil' });
        });
    }

    /* Sinif silinir/arsivlenirken BAGLI ogrencilerin bulut kaydi da
       guncellenir; boylece ogrenci girisinde "hayalet sinif" gorunmez.
       kopuk  -> sinif silindi: ogrenci yeni kodla yeniden baglanabilir
                 (davet kodu yeniden kullanilabilir yapilir)
       arsiv  -> sinif arsivde: geri yuklenince otomatik tekrar baglanir   */
    function bagDurumGuncelle(ogrenciler, durum) {
        try {
            if (typeof db === 'undefined' || !db) return;
            if (typeof firebase === 'undefined' || !firebase.auth || !firebase.auth().currentUser) return;
            (ogrenciler || []).forEach(st => {
                if (!st || !st.hesapUid) return;
                db.collection('ogrenciBaglari').doc(st.hesapUid)
                    .set({ durum: durum, guncelleme: Date.now() }, { merge: true })
                    .catch(() => { });
                if (durum === 'kopuk' && st.loginCode) {
                    db.collection('davetler').doc(String(st.loginCode).toUpperCase())
                        .set({ kullanildi: false, ogrenciUid: null, guncelleme: Date.now() }, { merge: true })
                        .catch(() => { });
                }
            });
        } catch (e) { }
    }

    /* ============ SINIF ARSIVI ============
       Sene sonunda sinif SILINMEZ: tum verisiyle (ogrenciler, notlar,
       davranis, notlar defteri...) arsive kaldirilir; istenirse geri yuklenir. */
    function sinifArsivle(lId, cId) {
        islemSifresiSor(function () {
        const lvl = data.levels[lId];
        const cls = lvl && lvl.classes && lvl.classes[cId];
        if (!cls) return;
        llOnay('"' + (cls.name || cId) + '" sınıfı TÜM bilgileriyle arşive kaldırılsın mı?\n(Aktif listeden çıkar, hiçbir veri silinmez; Arşiv bölümünden geri yüklenebilir.)', () => {
        if (!Array.isArray(data.arsiv)) data.arsiv = [];
        const d = new Date(), iki = n => String(n).padStart(2, '0');
        data.arsiv.push({
            id: 'A' + Date.now(),
            ad: cls.name || cId,
            seviyeAd: lvl.name || lId,
            lId: lId,
            tarih: iki(d.getDate()) + '.' + iki(d.getMonth() + 1) + '.' + d.getFullYear(),
            ogrenciSayisi: (cls.students || []).length,
            veri: JSON.parse(JSON.stringify(cls))
        });
        delete lvl.classes[cId];
        if (curCId === cId) document.getElementById('content').style.display = 'none';
        save();
        bagDurumGuncelle((data.arsiv[data.arsiv.length - 1].veri || {}).students, 'arsiv');
        alert('Sınıf arşive kaldırıldı. Kenar çubuğunun altındaki 🗄 Arşiv bölümünden ulaşabilirsiniz.');
        }, { evet: 'Arşivle', ton: 'normal' });
        });
    }
    window.sinifArsivle = sinifArsivle;

    /* SEVIYE arsivle: seviye TUM siniflariyla tek kayit olarak arsive gider. */
    function seviyeArsivle(lId) {
        islemSifresiSor(function () {
            const lvl = data.levels[lId];
            if (!lvl) return;
            const siniflar = Object.values(lvl.classes || {});
            const ogrSay = siniflar.reduce((t, c) => t + ((c.students || []).length), 0);
            llOnay('"' + (lvl.name || lId) + '" seviyesi TÜM sınıflarıyla (' + siniflar.length + ' sınıf, ' +
                ogrSay + ' öğrenci) arşive kaldırılsın mı?\nHiçbir veri silinmez; Arşiv bölümünden geri yüklenir.', () => {
                if (!Array.isArray(data.arsiv)) data.arsiv = [];
                const d = new Date(), iki = n => String(n).padStart(2, '0');
                data.arsiv.push({
                    id: 'A' + Date.now(), tur: 'seviye',
                    ad: lvl.name || lId, lId: lId,
                    kurumAd: (lvl.kurumId && data.kurumlar && data.kurumlar[lvl.kurumId]) ? data.kurumlar[lvl.kurumId].name : '',
                    tarih: iki(d.getDate()) + '.' + iki(d.getMonth() + 1) + '.' + d.getFullYear(),
                    sinifSayisi: siniflar.length, ogrenciSayisi: ogrSay,
                    veri: JSON.parse(JSON.stringify(lvl))
                });
                siniflar.forEach(c => bagDurumGuncelle(c.students, 'arsiv'));
                delete data.levels[lId];
                data.levelOrder = (data.levelOrder || []).filter(id => id !== lId);
                if (curLId === lId) document.getElementById('content').style.display = 'none';
                save();
                llBilgi('Seviye tüm sınıflarıyla arşive kaldırıldı.');
            }, { evet: 'Arşivle', ton: 'normal' });
        });
    }
    window.seviyeArsivle = seviyeArsivle;

    /* KURUM (tum okul) arsivle: kurum + butun seviyeleri tek kayit. */
    function kurumArsivle(kId) {
        islemSifresiSor(function () {
            const kurum = data.kurumlar && data.kurumlar[kId];
            if (!kurum) return;
            const uyeIdler = (data.levelOrder || Object.keys(data.levels)).filter(l => data.levels[l] && data.levels[l].kurumId === kId);
            let sinifSay = 0, ogrSay = 0;
            uyeIdler.forEach(l => Object.values(data.levels[l].classes || {}).forEach(c => { sinifSay++; ogrSay += (c.students || []).length; }));
            llOnay('"' + kurum.name + '" kurumu TÜM okul olarak (' + uyeIdler.length + ' seviye, ' + sinifSay +
                ' sınıf, ' + ogrSay + ' öğrenci) arşive kaldırılsın mı?\nHiçbir veri silinmez; Arşiv bölümünden geri yüklenir.', () => {
                if (!Array.isArray(data.arsiv)) data.arsiv = [];
                const d = new Date(), iki = n => String(n).padStart(2, '0');
                const seviyeler = {};
                uyeIdler.forEach(l => { seviyeler[l] = JSON.parse(JSON.stringify(data.levels[l])); });
                data.arsiv.push({
                    id: 'A' + Date.now(), tur: 'kurum',
                    ad: kurum.name, kId: kId,
                    tarih: iki(d.getDate()) + '.' + iki(d.getMonth() + 1) + '.' + d.getFullYear(),
                    seviyeSayisi: uyeIdler.length, sinifSayisi: sinifSay, ogrenciSayisi: ogrSay,
                    veri: { kurum: { name: kurum.name }, levels: seviyeler, sira: uyeIdler.slice() }
                });
                uyeIdler.forEach(l => Object.values(data.levels[l].classes || {}).forEach(c => bagDurumGuncelle(c.students, 'arsiv')));
                uyeIdler.forEach(l => { delete data.levels[l]; });
                data.levelOrder = (data.levelOrder || []).filter(id => !uyeIdler.includes(id));
                delete data.kurumlar[kId];
                if (uyeIdler.includes(curLId)) document.getElementById('content').style.display = 'none';
                save();
                llBilgi('Kurum, tüm okul verisiyle arşive kaldırıldı.');
            }, { evet: 'Okulu Arşivle', ton: 'normal' });
        });
    }
    window.kurumArsivle = kurumArsivle;

    /* Geri yuklemede bagli hesaplari yeni koordinatlarla ONAYLIya cevirir. */
    function baglariOnayla(lId) {
        try {
            if (typeof db === 'undefined' || !db || !firebase.auth().currentUser) return;
            const lvl = data.levels[lId];
            if (!lvl) return;
            Object.keys(lvl.classes || {}).forEach(cId => {
                (lvl.classes[cId].students || []).forEach((st, ix) => {
                    if (!st || !st.hesapUid) return;
                    db.collection('ogrenciBaglari').doc(st.hesapUid).set({
                        durum: 'onayli', lId: lId, cId: cId, sIdx: ix,
                        seviyeAd: lvl.name || lId, sinifAd: lvl.classes[cId].name || cId,
                        guncelleme: Date.now()
                    }, { merge: true }).catch(() => { });
                    if (st.loginCode) db.collection('davetler').doc(String(st.loginCode).toUpperCase())
                        .set({ kullanildi: true, ogrenciUid: st.hesapUid, lId: lId, cId: cId, sIdx: ix, guncelleme: Date.now() }, { merge: true })
                        .catch(() => { });
                });
            });
        } catch (e) { }
    }

    function arsivAc() {
        let k = document.getElementById('llArsivModal');
        if (!k) {
            k = document.createElement('div');
            k.id = 'llArsivModal';
            k.setAttribute('style', 'display:none; position:fixed; inset:0; z-index:10070; background:rgba(0,0,0,.55);' +
                'backdrop-filter:blur(4px); align-items:center; justify-content:center; padding:16px;');
            k.innerHTML = '<div style="background:#fff; width:100%; max-width:620px; max-height:84vh; border-radius:16px;' +
                'overflow:hidden; display:flex; flex-direction:column;">' +
                '<div style="background:linear-gradient(135deg,#8B6A57,#6B4A38); color:#fff; padding:13px 17px;' +
                'display:flex; justify-content:space-between; align-items:center;"><strong>🗄 Sınıf Arşivi</strong>' +
                '<span style="cursor:pointer; font-size:24px;" onclick="document.getElementById(\'llArsivModal\').style.display=\'none\'">&times;</span></div>' +
                '<div id="llArsivGovde" style="flex:1; overflow-y:auto; padding:15px; background:#FBF6F1;"></div></div>';
            document.body.appendChild(k);
        }
        arsivCiz();
        k.style.display = 'flex';
    }
    window.arsivAc = arsivAc;

    function arsivCiz() {
        const g = document.getElementById('llArsivGovde');
        if (!g) return;
        const liste = data.arsiv || [];
        if (!liste.length) {
            g.innerHTML = '<p style="text-align:center; color:#8B6A57; padding:26px 10px;">Arşiv boş. Bir sınıfın yanındaki 🗄 tuşuyla, sene sonunda sınıfı tüm bilgileriyle buraya kaldırabilirsiniz.</p>';
            return;
        }
        g.innerHTML = liste.slice().reverse().map(a => {
            const tur = a.tur || 'sinif';
            const rozet = tur === 'kurum' ? '🏫 Kurum (tüm okul)' : (tur === 'seviye' ? '📁 Seviye' : '👥 Sınıf');
            const detay = tur === 'kurum'
                ? `${a.seviyeSayisi} seviye · ${a.sinifSayisi} sınıf · ${a.ogrenciSayisi} öğrenci`
                : (tur === 'seviye'
                    ? `${a.kurumAd ? behKacis(a.kurumAd) + ' · ' : ''}${a.sinifSayisi} sınıf · ${a.ogrenciSayisi} öğrenci`
                    : `${behKacis(a.seviyeAd || '')} · ${a.ogrenciSayisi} öğrenci`);
            return `
            <div style="background:#fff; border:1px solid #EADFD5; border-radius:12px; padding:12px 14px; margin-bottom:10px;
                display:flex; align-items:center; gap:10px;">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span style="font-weight:700; color:#6B4A38;">${behKacis(a.ad)}</span>
                        <span style="font-size:.7rem; font-weight:700; padding:2px 9px; border-radius:999px;
                            background:${tur === 'kurum' ? '#F4ECF7; color:#8e44ad' : (tur === 'seviye' ? '#FEF5E7; color:#B9770E' : '#EAF7F3; color:#16A085')};">${rozet}</span>
                    </div>
                    <div style="font-size:.78rem; color:#A6836E; margin-top:3px;">${detay} · ${a.tarih} tarihinde arşivlendi</div>
                </div>
                <button onclick="arsivGeriYukle('${a.id}')" style="padding:8px 14px; border:none; border-radius:9px; cursor:pointer;
                    font-family:inherit; font-weight:700; color:#fff; background:linear-gradient(135deg,#20C997,#16A085);">Geri Yükle</button>
            </div>`;
        }).join('');
    }

    function arsivGeriYukle(aId) {
        islemSifresiSor(function () {
        const i = (data.arsiv || []).findIndex(x => x.id === aId);
        if (i < 0) return;
        const a = data.arsiv[i];
        const tur = a.tur || 'sinif';

        /* ---- SEVIYE geri yukleme ---- */
        if (tur === 'seviye') {
            const hedefLId = data.levels[a.lId] ? ('L' + Date.now()) : a.lId;
            const lvl = JSON.parse(JSON.stringify(a.veri));
            if (lvl.kurumId && !(data.kurumlar && data.kurumlar[lvl.kurumId])) delete lvl.kurumId;
            data.levels[hedefLId] = lvl;
            if (!Array.isArray(data.levelOrder)) data.levelOrder = Object.keys(data.levels);
            if (!data.levelOrder.includes(hedefLId)) data.levelOrder.push(hedefLId);
            data.arsiv.splice(i, 1);
            save();
            baglariOnayla(hedefLId);
            arsivCiz();
            llBilgi('"' + a.ad + '" seviyesi tüm sınıflarıyla geri yüklendi.');
            return;
        }

        /* ---- KURUM (tum okul) geri yukleme ---- */
        if (tur === 'kurum') {
            if (!data.kurumlar) data.kurumlar = {};
            const hedefK = (data.kurumlar[a.kId]) ? ('K' + Date.now()) : a.kId;
            data.kurumlar[hedefK] = { name: (a.veri.kurum && a.veri.kurum.name) || a.ad };
            if (!Array.isArray(data.levelOrder)) data.levelOrder = Object.keys(data.levels);
            (a.veri.sira || Object.keys(a.veri.levels || {})).forEach(eskiL => {
                const lvl = JSON.parse(JSON.stringify(a.veri.levels[eskiL]));
                lvl.kurumId = hedefK;
                const hedefLId = data.levels[eskiL] ? ('L' + Date.now() + Math.floor(Math.random() * 999)) : eskiL;
                data.levels[hedefLId] = lvl;
                if (!data.levelOrder.includes(hedefLId)) data.levelOrder.push(hedefLId);
                baglariOnayla(hedefLId);
            });
            data.arsiv.splice(i, 1);
            save();
            arsivCiz();
            llBilgi('"' + a.ad + '" kurumu tüm okul verisiyle geri yüklendi.');
            return;
        }

        /* ---- TEK SINIF (eski davranis) ---- */
        let hedefL = data.levels[a.lId] ? a.lId : Object.keys(data.levels)[0];
        if (!hedefL) { alert('Geri yüklemek için önce bir seviye oluşturun.'); return; }
        const yeniC = 'C' + Date.now();
        data.levels[hedefL].classes[yeniC] = JSON.parse(JSON.stringify(a.veri));
        data.arsiv.splice(i, 1);
        save();
        /* bagli ogrencileri yeni koordinatlarla yeniden ONAYLI yap */
        try {
            if (typeof db !== 'undefined' && db && firebase.auth().currentUser) {
                (data.levels[hedefL].classes[yeniC].students || []).forEach((st, ix) => {
                    if (!st || !st.hesapUid) return;
                    db.collection('ogrenciBaglari').doc(st.hesapUid).set({
                        durum: 'onayli', lId: hedefL, cId: yeniC, sIdx: ix,
                        seviyeAd: data.levels[hedefL].name || hedefL,
                        sinifAd: data.levels[hedefL].classes[yeniC].name || yeniC,
                        guncelleme: Date.now()
                    }, { merge: true }).catch(() => { });
                    if (st.loginCode) db.collection('davetler').doc(String(st.loginCode).toUpperCase())
                        .set({ kullanildi: true, ogrenciUid: st.hesapUid, lId: hedefL, cId: yeniC, sIdx: ix, guncelleme: Date.now() }, { merge: true })
                        .catch(() => { });
                });
            }
        } catch (e) { }
        arsivCiz();
        alert('"' + a.ad + '" sınıfı "' + (data.levels[hedefL].name || hedefL) + '" seviyesine geri yüklendi.');
        });
    }
    window.arsivGeriYukle = arsivGeriYukle;

function renderSidebar() {
    const nav = document.getElementById('levelNav');
    if (!nav) return; // Nav elementi yoksa çık
    /* Çizim bitince son açık sınıfı geri aç (kendi içinde "zaten açıksa
       dokunma" kontrolü var; sonsuz döngü olmaması için işaretle). */
    if (!window._llGeriAcmaBekliyor) {
        window._llGeriAcmaBekliyor = 1;
        setTimeout(function () { window._llGeriAcmaBekliyor = 0; try { llSonSinifAc(); } catch (e) { } }, 60);
    }
    nav.innerHTML = '';

    // KRİTİK HATA KORUMASI: data veya data.levels tanımsızsa fonksiyonu durdur
    if (!data || !data.levels) {
        console.warn("Sidebar render edilemedi: Veri henüz hazır değil.");
        return; 
    }

    // --- 0. KIMLIK KARTI (ogrenci profilindeki gibi bas harfli avatar) ---
    var pk = document.getElementById('llProfilKart');
    if (pk) {
        var pkAd = '';
        try {
            var pfu = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
            pkAd = (pfu && pfu.displayName) || (window.appState && (appState.userName || appState.userFullName)) || '';
        } catch (e) { }
        var pkRol = (window.appState && appState.userRole) || 'teacher';
        var pkRolYazi = pkRol === 'student' ? '🎓 Öğrenci' : (pkRol === 'admin' ? '😎 Yönetici' : '🧑‍🏫 Öğretmen');
        var pkBas = pkAd ? pkAd.trim().split(/\s+/).map(function (p) { return p.charAt(0); }).join('').slice(0, 2).toUpperCase() : 'Ö';
        pk.innerHTML = '<div class="ll-profil-kart">' +
            '<span class="ll-pk-avatar">' + behKacis(pkBas) + '</span>' +
            '<span class="ll-pk-metin"><b>' + behKacis(pkAd || 'Öğretmen') + '</b>' +
            '<small>' + pkRolYazi + '</small></span></div>';
    }

    // --- 1. ÖĞRETMEN KODU: gizli durur, TIKLANINCA görünür ---
    // Artik #levelNav'a degil, SOL SUTUN kabina (#teacher-code-display) cizilir;
    // masaustu perdesinde sol dar sutun = kisayollar + kod + bekleyen istekler.
    const staticCode = localStorage.getItem('teacher_static_code');
    const tkKap = document.getElementById('teacher-code-display');
    if (staticCode) {
        let codeHtml = `
        <details class="teacher-code-area" style="margin: 0 5px 12px 5px; padding: 8px 10px; border-radius: 8px;">
            <summary class="tk-etiket" style="cursor: pointer; list-style: none; display: flex; align-items: center; gap: 7px;
                font-size: 0.78rem; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;"
                title="Kodu görmek için tıkla">🎫 Öğretmen Kodu <span class="tk-ok" style="margin-left:auto; transition: transform .2s;">▸</span></summary>
            <div class="tk-kod" style="font-size: 1.05rem; font-family: 'Nunito', sans-serif; font-weight: 700;
                margin-top: 7px; text-align: center;">${staticCode}</div>
        </details>`;
        if (tkKap) tkKap.innerHTML = codeHtml;
        else nav.innerHTML += codeHtml;   /* emniyet: kap yoksa eski yer */
    } else if (tkKap) {
        tkKap.innerHTML = '';
    }

    // --- 1a. PERDE KURUM SUZGECI (rozetten acilinca yalniz o kurum) ---
    let filtre = (window.llKurumFiltre === undefined) ? null : window.llKurumFiltre;
    if (filtre !== null && filtre !== '' && !(data.kurumlar && data.kurumlar[filtre])) filtre = '';
    const filtreAktif = (filtre !== null);

    // --- 1b. KURUM EKLE (gri/sonuk) + kurum YOKSA genel Seviye Ekle ---
    const kurumVarMi = Object.keys(data.kurumlar || {}).length > 0;
    if (filtreAktif) {
        const filtreAd = (filtre === '') ? 'Genel' : ((data.kurumlar[filtre] && data.kurumlar[filtre].name) || 'Kurum');
        nav.innerHTML += `
        <div style="display:flex; align-items:center; gap:8px; margin:0 5px 10px 5px; padding:7px 10px;
            border-radius:9px; background:#F6EEE9; border:1px dashed #D5BFAE; font-size:.78rem; color:#6B4A38;">
            <span style="flex:1;">Yalnız <b>${behKacis(filtreAd)}</b> görünüyor</span>
            <button type="button" onclick="llPerdeAc(null)" style="background:#fff; border:1px solid #D5BFAE;
                color:#6B4A38; border-radius:7px; cursor:pointer; padding:3px 9px; font-family:inherit;
                font-size:.75rem; font-weight:700;">Tümünü göster</button>
        </div>`;
    } else {
    nav.innerHTML += `
        <button type="button" class="btn-add ll-seviye-ekle-tus" onclick="addKurum()"
            style="width: calc(100% - 10px); margin: 0 5px 8px 5px; background:#F1F3F5;
            color:#7f8c8d; border:1px dashed #CBD3D9; box-shadow:none;
            font-size:.8rem; font-weight:600;">
            <svg class="lli" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#95a5a6"/><path d="M4.4 8.8h15.2v12.6H4.4z" fill="#d5dbdf"/><rect x="10.2" y="14.4" width="3.6" height="7" fill="#7f8c8d"/><g fill="#95a5a6"><rect x="6" y="11.4" width="3" height="3" rx=".5"/><rect x="15" y="11.4" width="3" height="3" rx=".5"/></g><g stroke="#7f8c8d" stroke-width="2" stroke-linecap="round"><path d="M19.6 3.2v3.6M17.8 5h3.6"/></g></svg> Kurum Ekle
        </button>`;
    if (!kurumVarMi) {
        nav.innerHTML += `
        <button type="button" class="btn-add ll-seviye-ekle-tus" onclick="addLevel()"
            style="width: calc(100% - 10px); margin: 0 5px 12px 5px;">
            <svg class="lli" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6a2 2 0 0 1 2-2h4l2 2.4h8A2 2 0 0 1 21 8.4V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#f39c12"/><g stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 10.6v6M9 13.6h6"/></g></svg> Seviye Ekle
        </button>`;
    }
    }

    // --- 2. KURUM GRUPLARI + SEVİYE VE SINIF LİSTESİ ---
    let levelIds = data.levelOrder || Object.keys(data.levels);
    const kurumlar = data.kurumlar || {};

    /* Seviye HTML'ini ureten ic fonksiyon (kurum gruplama tekrar kullanir) */
    const seviyeHtmlYap = (lId) => {
        let lvl = data.levels[lId];
        if(!lvl) return;
        
        let html = `
        <div class="level-container" draggable="true" data-id="${lId}" ondragstart="drag(event)" ondragover="allowDrop(event)" ondrop="drop(event)">
            <div class="level-head">
                <span onclick="handleLevelNameClick('${lId}', this)" title="Tek tik: ac/kapa · Cift tik: ismi degistir" style="cursor:pointer; flex:1; font-weight:bold;">${llIcon('sinif')} ${lvl.name}</span>
                <div class="level-actions">
                    <button onclick="openLvlConfig('${lId}')" title="Seviye Ayarları">${llIcon('ayar')}</button>
                    <button onclick="editLevelName('${lId}')" title="İsmi Değiştir">${llIcon('kalem')}</button>
                    <button onclick="seviyeArsivle('${lId}')" title="Seviyeyi arşivle (tüm sınıflarıyla sakla)">🗄</button>
                    <button onclick="deleteLevel('${lId}')" title="Seviyeyi Sil">${llIcon('cop')}</button>
                    <button class="ll-sinif-ekle" onclick="addClass('${lId}')" title="Sınıf Ekle">+</button>
                </div>
            </div>
            <div class="class-list" id="list-${lId}">`;
        
        if (lvl.classes) {
            for(let cId in lvl.classes) {
                html += `
                <div class="class-item">
                    <a class="class-link" onclick="selectClass('${lId}','${cId}')">${lvl.classes[cId].name}</a>
                    <div class="class-actions">
                        <button onclick="editClassName('${lId}','${cId}')" title="İsmi Değiştir">${llIcon('kalem')}</button>
                        <button onclick="sinifArsivle('${lId}','${cId}')" title="Sınıfı arşivle (silmeden sakla)">🗄</button>
                        <button onclick="deleteClass('${lId}','${cId}')" title="Sınıfı Sil">${llIcon('cop')}</button>
                    </div>
                </div>`;
            }
        }
        
        html += `</div></div>`;
        return html;
    };

    /* kurum kurum ciz; kurumsuzlar "Genel" altinda */
    const gruplar = {};
    levelIds.forEach(lId => {
        const lvl = data.levels[lId];
        if (!lvl) return;
        const k = (lvl.kurumId && kurumlar[lvl.kurumId]) ? lvl.kurumId : '';
        if (!gruplar[k]) gruplar[k] = [];
        gruplar[k].push(lId);
    });
    const kurumSirasi = Object.keys(kurumlar);   /* BOS kurumlar da listelenir */
    const kurumBaslik = (kId, ad, adet) => `
        <div class="kurum-baslik" style="display:flex; align-items:center; gap:7px; margin:2px 5px 6px 5px;
            padding:7px 10px; border-radius:9px; background:linear-gradient(90deg,#8e44ad,#6c3483); color:#fff;
            font-weight:700; font-size:.92rem; cursor:pointer;" onclick="kurumAcKapa('${kId}')">
            <svg class="lli" viewBox="0 0 24 24" style="width:1.15em;height:1.15em;"><path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#f5eef8"/><path d="M4.4 8.8h15.2v12.6H4.4z" fill="#fff" opacity=".92"/><rect x="10.2" y="14.4" width="3.6" height="7" fill="#6c3483"/></svg>
            <span style="flex:1;">${behKacis(ad)} <small style="opacity:.75;">(${adet})</small></span>
            <button onclick="event.stopPropagation(); kurumAdDegistir('${kId}')" title="Kurum adını değiştir" style="background:rgba(255,255,255,.18); border:none; color:#fff; border-radius:6px; cursor:pointer; padding:2px 7px;">${llIcon('kalem')}</button>
            <button onclick="event.stopPropagation(); kurumArsivle('${kId}')" title="Tüm okulu arşivle (kurum + seviyeler + sınıflar)" style="background:rgba(255,255,255,.18); border:none; color:#fff; border-radius:6px; cursor:pointer; padding:2px 7px;">🗄</button>
            <button onclick="event.stopPropagation(); kurumSil('${kId}')" title="Kurumu sil (seviyeler Genel'e taşınır)" style="background:rgba(255,255,255,.18); border:none; color:#fff; border-radius:6px; cursor:pointer; padding:2px 7px;">${llIcon('cop')}</button>
            <span>${_kurumKapali[kId] ? '▸' : '▾'}</span>
        </div>`;

    /* Her kurumun altinda KENDI "Seviye Ekle" tusu (dogrudan o kuruma ekler) */
    const kurumSeviyeEkleTus = (kId) => `
        <button type="button" onclick="addLevel('${kId}')"
            style="display:block; width:calc(100% - 10px); margin:2px 5px 10px 5px; padding:8px 10px;
            border:1px dashed rgba(142,68,173,.5); border-radius:9px; background:rgba(142,68,173,.06);
            color:#8e44ad; cursor:pointer; font-family:inherit; font-size:.82rem; font-weight:700;">+ Seviye Ekle</button>`;

    (filtreAktif ? kurumSirasi.filter(k => k === filtre) : kurumSirasi).forEach(kId => {
        const uyeler = gruplar[kId] || [];
        nav.innerHTML += kurumBaslik(kId, kurumlar[kId].name, uyeler.length);
        if (filtreAktif || !_kurumKapali[kId]) {
            let ic = '';
            uyeler.forEach(lId => { ic += seviyeHtmlYap(lId); });
            if (!ic) {
                ic = `<div style="margin:0 5px 4px 5px; font-size:.78rem; color:#A6836E;">Bu kurumda henüz seviye yok.</div>`;
            }
            ic += kurumSeviyeEkleTus(kId);
            nav.innerHTML += `<div class="kurum-ic" style="margin-left:6px;">${ic}</div>`;
        }
    });
    if (gruplar[''] && (!filtreAktif || filtre === '')) {
        if (kurumVarMi) {
            nav.innerHTML += `<div style="margin:6px 5px 6px 5px; font-size:.8rem; font-weight:700; color:#8B6A57;
                display:flex; align-items:center; gap:6px;">${llIcon('klasor')} Genel</div>`;
        }
        let ic = '';
        gruplar[''].forEach(lId => { ic += seviyeHtmlYap(lId); });
        nav.innerHTML += ic;
        if (kurumVarMi) {
            nav.innerHTML += `
        <button type="button" onclick="addLevel('GENEL')"
            style="display:block; width:calc(100% - 10px); margin:2px 5px 10px 5px; padding:8px 10px;
            border:1px dashed #D5BFAE; border-radius:9px; background:#FBF6F1;
            color:#8B6A57; cursor:pointer; font-family:inherit; font-size:.82rem; font-weight:700;">+ Seviye Ekle (Genel)</button>`;
        }
    }

    /* --- ARSIV girisi (en altta, kucuk; suzgec acikken gizli) --- */
    if (filtreAktif) return;
    const arsivAdet = (data.arsiv && data.arsiv.length) || 0;
    nav.innerHTML += `
        <button type="button" onclick="arsivAc()" title="Arşivlenen sınıflar"
            style="display:flex; align-items:center; gap:8px; width:calc(100% - 10px); margin:10px 5px 6px 5px;
            padding:8px 11px; border-radius:9px; cursor:pointer; background:#fff; color:#6B4A38;
            border:1px dashed #D5BFAE; font-family:inherit; font-size:.85rem; font-weight:700;">
            🗄 <span style="flex:1; text-align:left;">Arşiv</span>
            ${arsivAdet ? `<span style="background:#8B6A57; color:#fff; border-radius:9px; padding:1px 8px; font-size:.75rem;">${arsivAdet}</span>` : ''}
        </button>`;
}
// Sidebar çizildikten sonra ilk sınıfı otomatik seçen fonksiyon
function selectFirstClassAutomatically() {
    // 1. İlk seviye konteynerini bul
    const firstLevel = document.querySelector('.level-container');
    if (!firstLevel) return;

    // 2. İlk seviyenin altındaki sınıf listesini (class-list) görünür yap
    const firstClassList = firstLevel.querySelector('.class-list');
    if (firstClassList) {
        firstClassList.classList.add('active');
    }

    // 3. İlk sınıfın linkini (class-link) bul ve ona tıkla
    const firstClassLink = firstLevel.querySelector('.class-link');
    if (firstClassLink) {
        firstClassLink.click();
    }
}

// Mevcut class seçme fonksiyonunuzu (muhtemelen showClass gibi bir isimdedir) 
// aktiflik sınıfını ekleyecek şekilde güncelleyin:
function updateActiveClassUI(clickedElement) {
    // Önce tüm aktif sınıfları temizle
    document.querySelectorAll('.class-item').forEach(item => {
        item.classList.remove('active-class');
    });
    
    // Tıklanan elemanın kapsayıcısına (class-item) aktiflik sınıfı ekle
    const classItem = clickedElement.closest('.class-item');
    if (classItem) {
        classItem.classList.add('active-class');
    }
}

let currentRole = 'teacher';
let llIsLoginMode = true;

function llSetRole(role) {
    currentRole = role;
    llIsLoginMode = true; 
    
    // UI Güncelleme: Butonların aktiflik durumunu değiştir
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active-role'));
    
    // HTML'deki buton ID'sine göre seçim
    const targetBtn = document.getElementById(role === 'student' ? 'btn-student' : 'btn-teacher');
    if(targetBtn) targetBtn.classList.add('active-role');
    
    const footer = document.getElementById('auth-footer-links');
    const passGroup = document.getElementById('password-main-group');
    const rePassGroup = document.getElementById('re-password-group');
    const primaryLabel = document.getElementById('primary-label');
    const actionBtn = document.getElementById('auth-action-btn');
    const authTitle = document.getElementById('auth-title');
    const guestArea = document.getElementById('guest-access-area');

    // Başlangıç ayarları
    if(rePassGroup) rePassGroup.style.display = 'none';
    actionBtn.innerText = "Giriş Yap";

    if (role === 'student') {
        authTitle.innerText = "Öğrenci Dünyası Girişi";
        primaryLabel.innerText = "Öğrenci Kodun";
        if(passGroup) passGroup.style.display = 'none';
        if(footer) footer.style.display = 'none';
        if(guestArea) guestArea.style.display = 'none';
        actionBtn.innerText = "Derslere Başla";
    } else {
        authTitle.innerText = "Öğretmen Yönetim Paneli";
        primaryLabel.innerText = "E-posta Adresi";
        if(passGroup) passGroup.style.display = 'flex';
        if(footer) footer.style.display = 'block';
        if(guestArea) guestArea.style.display = 'block';
        actionBtn.innerText = "Sisteme Gir";
    }
}

// Birden fazla öğretmen karmaşasını önlemek için veri çekme mantığı (Firebase Örneği)
function getMyData() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    if (currentRole === 'teacher') {
        // Sadece bu öğretmene (UID) ait sınıfları getir
        return db.collection("classes").where("ogretmenId", "==", user.uid);
    } else if (currentRole === 'parent') {
        // Velinin eşleştiği öğrenciyi ve o öğrencinin öğretmeninin ödevlerini getir
        // Veri yapısında: { veliUid: "...", ogrenciId: "...", ogretmenId: "..." }
        return db.collection("homeworks").where("targetOgrenciId", "==", myChildId);
    }
}

// llAuthIslemi() fonksiyonunuzun en başına currentRole kontrolü eklemeyi unutmayın
// Örn: localStorage.setItem('user_role', currentRole);
let curNoteStuIdx = null;

function openNoteModal(idx) {
    curNoteStuIdx = idx;
    let s = data.levels[curLId].classes[curCId].students[idx];
    
    // Başlık ve içeriği doldur
    const titleEl = document.getElementById('noteModalTitle');
    if (titleEl) {
        titleEl.style.fontSize = "1.5rem"; // Başlığı büyüt
        titleEl.innerHTML = llIcon('not') + " " + behKacis(s.name || '');
    }
    
    const textarea = document.getElementById('studentNoteText');
    if (textarea) {
        textarea.value = s.notes || "";
        textarea.placeholder = "Öğrenciye dair özel notlarınızı buraya büyük ve okunaklı şekilde yazabilirsiniz...";
    }
    
    noteLogCiz();
    document.getElementById('noteModal').style.display = 'flex';
}

/* Özel Notlar penceresindeki otomatik kayıt defteri (artı/eksi geçmişi). */
function noteLogCiz() {
    const kutu = document.getElementById('noteLogListe');
    if (!kutu) return;
    const s = data.levels[curLId].classes[curCId].students[curNoteStuIdx];
    const kayitlar = (s && Array.isArray(s.noteLog)) ? s.noteLog.slice() : [];
    const ozet = document.getElementById('noteLogOzet');

    if (!kayitlar.length) {
        kutu.innerHTML = `<p class="note-log-bos">Henüz otomatik kayıt yok. Performans sekmesinde bir öğrenciye artı ya da eksi verdiğinizde sebebi ve notu burada birikir.</p>`;
        if (ozet) ozet.innerHTML = '';
        return;
    }

    kayitlar.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    const net = kayitlar.reduce((t, k) => t + (parseInt(k.d) || 0), 0);
    const artiSayi = kayitlar.filter(k => (k.d || 0) > 0).length;
    const eksiSayi = kayitlar.filter(k => (k.d || 0) < 0).length;

    if (ozet) {
        ozet.innerHTML = `<span class="note-ozet-rozet arti">${llIcon('arti')} ${artiSayi} artı</span>
            <span class="note-ozet-rozet eksi">${llIcon('eksi')} ${eksiSayi} eksi</span>
            <span class="note-ozet-rozet net ${net > 0 ? 'arti' : (net < 0 ? 'eksi' : '')}">Net: ${net > 0 ? '+' : ''}${net}</span>`;
    }

    kutu.innerHTML = kayitlar.map(k => {
        const arti = (k.d || 0) > 0;
        return `<div class="note-log-kayit ${arti ? 'arti' : 'eksi'}">
            <div class="note-log-ust">
                <span class="note-log-puan">${arti ? '+' : ''}${k.d}</span>
                <span class="note-log-sebep">${behKacis(k.sebep || '')}</span>
                <span class="note-log-tarih">${behKacis(k.tarih || '')}</span>
            </div>
            ${k.not ? `<div class="note-log-not">${behKacis(k.not)}</div>` : ''}
        </div>`;
    }).join('');
}

function closeNoteModal() {
    let note = document.getElementById('studentNoteText').value;
    data.levels[curLId].classes[curCId].students[curNoteStuIdx].notes = note;
    save();
    document.getElementById('noteModal').style.display = 'none';
}

    function toggleClasses(lId) {
    const targetList = document.getElementById(`list-${lId}`);
    
    // Tıklanan listenin şu anki durumunu kontrol et (Açık mı kapalı mı?)
    const isAlreadyOpen = targetList.style.display === "block";

    // 1. Önce sayfadaki TÜM sınıf listelerini kapat
    document.querySelectorAll('.class-list').forEach(el => {
        el.style.display = 'none';
    });

    // 2. Eğer tıkladığımız liste önceden kapalıysa, şimdi aç
    // (Eğer zaten açıksa, yukarıdaki kodla kapandı ve öyle kalacak)
    if (!isAlreadyOpen) {
        targetList.style.display = "block";
    }
    if(typeof syncLevelActions==='function') syncLevelActions();
}

    // --- SÜRÜKLE BIRAK (SEVİYE SIRALAMA) ---
    function allowDrop(ev) { ev.preventDefault(); }
    function drag(ev) { ev.dataTransfer.setData("text", ev.target.getAttribute('data-id')); }
    function drop(ev) {
        ev.preventDefault();
        let draggedId = ev.dataTransfer.getData("text");
        let targetId = ev.target.closest('.level-container').getAttribute('data-id');
        if(draggedId === targetId) return;
        
        let order = data.levelOrder;
        order.splice(order.indexOf(draggedId), 1);
        order.splice(order.indexOf(targetId), 0, draggedId);
        data.levelOrder = order;
        save();
    }

function renderStudents() {
    if (!curLId || !curCId || !data.levels[curLId] || !data.levels[curLId].classes[curCId]) return;
    
    let students = data.levels[curLId].classes[curCId].students || [];
    let table = document.getElementById('stuTable');
    if (!table) return;
    
    table.innerHTML = `
        <thead>
            <tr>
                <th width="50">#</th>
                <th style="text-align:left; padding-left:15px;">Öğrenci Adı</th>
                <th width="90" style="text-align:center;" title="Okuldaki numarası — takım kurarken kullanılır">Okul No</th>
                <th width="140" style="text-align:center;">Giriş Kodu</th>
                <th width="210" style="text-align:center;">İşlemler</th>
                <th width="80" style="text-align:center;">Sil</th>
            </tr>
        </thead>
        <tbody id="stuTableBody"></tbody>`;
    
    const tableBody = document.getElementById('stuTableBody');

    students.forEach((s, i) => {
        let row = tableBody.insertRow();
        
        row.setAttribute('draggable', 'true');
        row.ondragstart = (e) => e.dataTransfer.setData("text/plain", i);
        row.ondragover = (e) => e.preventDefault();
        row.ondrop = (e) => {
            e.preventDefault();
            let from = parseInt(e.dataTransfer.getData("text/plain"));
            let moved = students.splice(from, 1)[0];
            students.splice(i, 0, moved);
            save(); renderStudents();
        };

        row.innerHTML = `
            <td style="text-align:center; font-weight:bold; font-size:1.2rem;">${i + 1}</td>
            <td>
                <input type="text" value="${behKacis(s.name || '')}"
                       onchange="updateStudentName(${i}, this.value)"
                       class="student-name-input"
                       placeholder="Öğrenci Adı">
            </td>
            <td style="text-align:center;">
                <input type="text" value="${behKacis(s.numara == null ? '' : String(s.numara))}"
                       onchange="updateStudentNo(${i}, this.value)"
                       class="student-no-input" placeholder="—" inputmode="numeric" maxlength="6"
                       title="Okul numarası (isteğe bağlı) — takım kurarken numarayla çağırabilirsin">
            </td>
            <td style="text-align:center;">
                <code class="secure-code" 
                      onclick="this.classList.toggle('revealed')" 
                      title="Görmek için tıklayın"
                      style="background:#eee; color:#eee; padding:6px 12px; border-radius:8px; cursor:pointer; font-family:monospace; user-select:none; transition:0.3s; display:inline-block; min-width:100px; font-weight:bold;">
                    ${s.loginCode || '---'}
                </code>
            </td>
            <td>
                <div class="action-cell">
                    <button class="big-action-btn" onclick="openNoteModal(${i})" title="Özel Notlar">${llIcon('not')}</button>
                    <button class="big-action-btn" onclick="openSkillModal(${i})" title="Beceriler">${llIcon('grafik')}</button>
                    <button class="big-action-btn veli-btn${veliDolu(s) ? ' dolu' : ''}" onclick="openVeliModal(${i})" title="Veli Bilgileri">${llIcon('veli')}</button>
                </div>
            </td>
            <td>
                <div class="action-cell">
                    <button class="big-action-btn delete-btn" onclick="deleteStu(${i})" title="Sil">${llIcon('cop')}</button>
                </div>
            </td>
        `;
    });

    /* Takim araci acikken liste degisirse katilimci seridi de tazelensin. */
    if (typeof llTakimCiz === 'function') llTakimCiz();
}

function addSingleStudent() {
    let val = document.getElementById('singleStuName').value.trim();
    
    // Öğretmenin sabit kodunu alıyoruz (Örn: TCH-4582)
    const teacherCode = localStorage.getItem('teacher_static_code') || "TCH";

    if (val) {
        const currentClass = data.levels[curLId].classes[curCId];
        
        // --- GÜVENLİK GÜNCELLEMESİ: Rastgele Karma Kod Üretimi ---
        // Okunabilirliği artırmak için benzer karakterleri (0, O, 1, I, L) hariç tuttuk
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
        let secureHash = '';
        for (let i = 0; i < 4; i++) {
            secureHash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Yeni format: ÖğretmenKodu-RastgeleKod (Örn: TCH-4582-X8B2)
        const sCode = `${teacherCode}-${secureHash}`; 

        // Yeni öğrenci objesini oluştur
        const newStudent = { 
            name: val, 
            loginCode: sCode.toUpperCase(), 
            hw: [], 
            ex: [], 
            history: [], 
            personalMissions: [], 
            skills: { 'Konuşma': 5, 'Yazma': 5, 'Okuma': 5, 'Vezin': 5, 'Sözlük': 5, 'Tercüme': 5 },
            notes: ""
        };

        currentClass.students.push(newStudent);

        // Giriş kutusunu temizle
        document.getElementById('singleStuName').value = "";
        
        // Veriyi kaydet ve listeyi yenile
        save(); 
        renderStudents();
        
        console.log(`Güvenli Kod Oluşturuldu: ${val} -> ${sCode}`);
    } else {
        alert("Lütfen öğrenci adı giriniz!");
    }
}

function updateStudentName(i, val) {
    if (val.trim()) {
        data.levels[curLId].classes[curCId].students[i].name = val.trim();
        save();
    }
}

/* Okul numarasi (istege bagli). Bos birakilirsa alan tamamen silinir.
   Sadece rakam kabul edilir; takim kurarken numarayla cagirmak icin kullanilir. */
function updateStudentNo(i, val) {
    try {
        var ogr = data.levels[curLId].classes[curCId].students[i];
        if (!ogr) return;
        var temiz = String(val == null ? '' : val).replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 6);
        if (!temiz) { delete ogr.numara; }
        else { ogr.numara = temiz; }
        save();
        if (typeof llTakimCiz === 'function') llTakimCiz();
    } catch (e) { console.warn('updateStudentNo', e); }
}
window.updateStudentNo = updateStudentNo;

/* Ogrenci silme de sifre ister (kurum/seviye/sinif silme ile ayni kural). */
function deleteStu(i) {
    const devam = function () {
        showConfirm("Öğrenci Sil", "Bu öğrenciyi silmek istediğinize emin misiniz?", llIcon('cop','lli-xl'), () => {
            data.levels[curLId].classes[curCId].students.splice(i, 1);
            save();
            renderStudents();
        });
    };
    if (typeof islemSifresiSor === 'function') islemSifresiSor(devam); else devam();
}

// --- NOTLAR VE SONUÇLAR ---

/* ==========================================================================
   DÖNEM SİSTEMİ — notlar dönem dönem tutulur (1. Dönem, 2. Dönem, ...)
   --------------------------------------------------------------------------
   - Dönem listesi seviyede saklanır: lvl.config.donemler / aktifDonem
   - 1. Dönem notları ESKİ alanlarda kalır (s.hw / s.ex) -> geriye uyumlu.
     Sonraki dönemler s.hwD[d] / s.exD[d] altındadır.
   - Performans / Sınavlar / Genel Sonuç sekmelerinin üstünde dönem şeridi
     görünür; Genel Sonuç ayrıca "Genel (Tümü)" görünümü sunar.
   ========================================================================== */

function donemler(lId) {
    const lvl = data.levels[lId];
    if (!lvl) return ['1. Dönem'];
    if (!lvl.config) lvl.config = {};
    if (!Array.isArray(lvl.config.donemler) || !lvl.config.donemler.length) lvl.config.donemler = ['1. Dönem'];
    let a = parseInt(lvl.config.aktifDonem);
    if (!isFinite(a) || a < 0 || a >= lvl.config.donemler.length) lvl.config.aktifDonem = 0;
    return lvl.config.donemler;
}
function aktifDonem(lId) { donemler(lId); return parseInt(data.levels[lId].config.aktifDonem) || 0; }

/* Ogrencinin ilgili donemdeki not dizisi (yoksa acilir). */
function donemNotlari(s, type, di) {
    if (!di) { if (!Array.isArray(s[type])) s[type] = []; return s[type]; }
    const k = type + 'D';
    if (!s[k]) s[k] = {};
    if (!Array.isArray(s[k][di])) s[k][di] = [];
    return s[k][di];
}
window.llDonemNotlari = donemNotlari;
window.llAktifDonem = aktifDonem;

var resGenelAcik = false;      /* Genel Sonuç: tek dönem mi, tümü mü */

function donemSec(di) {
    donemler(curLId);
    data.levels[curLId].config.aktifDonem = di;
    resGenelAcik = false;
    save();
    renderGrades('hw'); renderGrades('ex');
    if (typeof renderResults === 'function') renderResults();
}
window.donemSec = donemSec;
function donemGenelSec() {
    resGenelAcik = true;
    renderResults();
}
window.donemGenelSec = donemGenelSec;
function donemEkle() {
    const ds = donemler(curLId);
    const ad = prompt('Yeni dönemin adı:', (ds.length + 1) + '. Dönem');
    if (!ad || !ad.trim()) return;
    ds.push(ad.trim());
    donemSec(ds.length - 1);
}
window.donemEkle = donemEkle;

/* Tablonun ustune donem seridi cizer. tip: 'hw' | 'ex' | 'res' */
function donemSeritCiz(tableEl, tip) {
    if (!tableEl || !tableEl.parentElement) return;
    let kutu = document.getElementById('donemSerit_' + tip);
    if (!kutu || kutu.parentElement !== tableEl.parentElement) {
        if (kutu) kutu.remove();
        kutu = document.createElement('div');
        kutu.id = 'donemSerit_' + tip;
        kutu.setAttribute('style', 'display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin:0 0 12px;');
        tableEl.parentElement.insertBefore(kutu, tableEl);
    }
    const ds = donemler(curLId);
    const akt = (tip === 'res' && resGenelAcik) ? -1 : aktifDonem(curLId);
    const hap = (etkin, ic, oc, baslik) =>
        `<button type="button" onclick="${oc}" title="${baslik || ''}" style="padding:6px 16px; border-radius:999px;` +
        `cursor:pointer; font-family:inherit; font-weight:700; font-size:.85rem; border:1px solid ` +
        (etkin ? '#16A085; background:#16A085; color:#fff;' : '#D5E3E0; background:#fff; color:#5c7a74;') +
        `">${ic}</button>`;
    let h = ds.map((ad, i) => hap(akt === i, behKacis(ad), 'donemSec(' + i + ')', ad + ' notları')).join('');
    if (tip === 'res' && ds.length > 1)
        h += hap(akt === -1, 'Genel (Tümü)', 'donemGenelSec()', 'Bütün dönemlerin sonucu');
    h += hap(false, '+ Dönem', 'donemEkle()', 'Yeni dönem ekle');
    kutu.innerHTML = h;
}

function renderGrades(type) {
    let config = data.levels[curLId].config[type];
    let table = document.getElementById(type + 'Table');
    if (!table) return;

    donemSeritCiz(table, type);          /* donem secici tablo ustunde */
    const dnm = aktifDonem(curLId);      /* gosterilen donem */

    // Davranış puanı yalnızca Performans sekmesinde (hw) ve seviye ayarında
    // açıldıysa görünür. Kapalıysa tablo eskisi gibi kalır.
    const beh = (type === 'hw') ? behAyar(curLId) : null;
    const behAcik = !!(beh && beh.aktif);
    if (type === 'hw') behBilgiCiz(beh);

    // Tablo başlıklarını oluştur
    const ortEtki = !!(behAcik && beh.ortEtki);
    /* Ayri "Davranış" / "Davranışlı ORT" sutunu YOK: sayilar isim yanindaki
       arti/eksi tuslarinin USTUNDE, etki dogrudan Ağ. ORT'un icindedir. */
    table.innerHTML = `<tr><th>Öğrenci</th>${config.map(c => `<th>${c.n} (%${c.w})</th>`).join('')} <th title="${ortEtki ? 'Davranış puanı katılmış ağırlıklı ortalama' : 'Ağırlıklı ortalama'}">Ağ. ORT</th></tr>`;

    data.levels[curLId].classes[curCId].students.forEach((s, si) => {
        let row = table.insertRow();
        const nameCell = row.insertCell();
        if (type === 'hw' && beh) {
            /* +/- tuslari OGRENCI ISMININ YANINDA; ustlerinde KAC ARTI /
               KAC EKSI alindigi yazar (yatay hap bicimi). Davranis puani
               seviyede ACIK degilse tuslar gri ve pasif gorunur. */
            const eksiN = (s.behLog || []).filter(k => (parseInt(k.d) || 0) < 0).length;
            const artiN = (s.behLog || []).filter(k => (parseInt(k.d) || 0) > 0).length;
            const hapStil = 'display:inline-flex; align-items:center; justify-content:center; gap:5px;' +
                'min-width:44px; padding:3px 11px; border-radius:999px; font-weight:800; line-height:1.25;';
            const pasifStil = ' opacity:.35; filter:grayscale(1); cursor:default; pointer-events:none;';
            const eksiT = behAcik
                ? `onclick="behAc(${si},-1)" title="Eksi ver (-${beh.adim}) — şimdiye dek ${eksiN} eksi" style="${hapStil}"`
                : `disabled title="Davranış puanı kapalı — Seviye Ayarları penceresinden açabilirsiniz" style="${hapStil}${pasifStil}"`;
            const artiT = behAcik
                ? `onclick="behAc(${si},1)" title="Artı ver (+${beh.adim}) — şimdiye dek ${artiN} artı" style="${hapStil}"`
                : `disabled title="Davranış puanı kapalı — Seviye Ayarları penceresinden açabilirsiniz" style="${hapStil}${pasifStil}"`;
            nameCell.innerHTML =
                `<div style="display:flex; align-items:center; gap:7px;">` +
                `<button type="button" class="beh-tus eksi" ${eksiT}>&minus;${behAcik ? `<span style="font-size:.82em;">${eksiN}</span>` : ''}</button>` +
                `<button type="button" class="beh-tus arti" ${artiT}>+${behAcik ? `<span style="font-size:.82em;">${artiN}</span>` : ''}</button>` +
                `<span style="flex:1;">${behKacis(s.name)}</span>` +
                (behAcik ? `<button type="button" class="beh-gecmis-tus" onclick="behGecmis(${si})" title="Davranış geçmişi">${llIcon('saat')}</button>` : '') +
                `</div>`;
        } else {
            nameCell.innerText = s.name;
        }

        let weightedTotal = 0;

        const notlar = donemNotlari(s, type, dnm);
        config.forEach((c, ci) => {
            // Veri varsa al, yoksa 0 kabul et (AKTIF DONEMIN notlari)
            let val = notlar[ci] ? parseFloat(notlar[ci]) : 0;
            let weight = parseFloat(c.w || 0) / 100;
            weightedTotal += (val * weight);

            row.insertCell().innerHTML = `
                <input type="number"
                       value="${val}"
                       onfocus="if(this.value=='0'){this.value='';} this.select();"
                       onblur="if(this.value.trim()==''){this.value='0';}"
                       onchange="updateGrade('${type}',${si},${ci},this.value)"
                       style="width:60px; text-align:center; border-radius:4px; border:1px solid #ddd;">`;
        });

        // Ağırlıklı ortalama: davranış etkisi (net × katsayı) DOĞRUDAN içinde.
        // Artı puanlar ekler, eksi puanlar ortalamadan DÜŞER; fark rozetle görünür.
        let avgCell = row.insertCell();
        avgCell.style.fontWeight = "bold";
        if (type === 'hw' && ortEtki) {
            const r = behOrtUygula(weightedTotal, beh, s);
            avgCell.className = 'beh-ort-hucre ' + (r.etki > 0 ? 'arti' : (r.etki < 0 ? 'eksi' : ''));
            if (!r.etki) avgCell.style.color = "var(--primary)";
            avgCell.innerHTML = `${r.son.toFixed(2)}${r.etki ? `<span class="beh-ort-fark">${r.etki > 0 ? '+' : ''}${r.etki.toFixed(2)}</span>` : ''}`;
            avgCell.title = `Ödev ortalaması ${weightedTotal.toFixed(2)} ${r.etki >= 0 ? '+' : '−'} ${Math.abs(r.etki).toFixed(2)} davranış = ${r.son.toFixed(2)}`;
        } else {
            avgCell.style.color = "var(--primary)";
            avgCell.innerText = weightedTotal.toFixed(2);
        }
    });
}

/* ==========================================================================
   DAVRANIŞ PUANI — PERFORMANS SEKMESİ İŞLEYİŞİ
   ========================================================================== */

/* Öğrencinin net davranış puanı: kayıtların toplamı.
   Toplamı ayrıca saklamıyoruz ki bir kayıt silinince puan kendiliğinden düzelsin. */
function behNet(s) {
    if (!s || !Array.isArray(s.behLog)) return 0;
    return s.behLog.reduce((t, k) => t + (parseInt(k.d) || 0), 0);
}

/* Performans sekmesinin üstündeki bilgi/uyarı şeridi. */
function behBilgiCiz(beh) {
    const kutu = document.getElementById('behBilgi');
    if (!kutu) return;
    if (!beh || !beh.aktif) {
        kutu.innerHTML = `<div class="beh-uyari">${llIcon('terazi')} <strong>Davranış puanı kapalı.</strong>
            Öğrencilere artı/eksi verebilmek için soldaki seviyenin <strong>${llIcon('ayar')} Seviye Ayarları</strong> penceresinden
            “Davranış Puanı” bölümünü açmanız yeterli.</div>`;
    } else {
        kutu.innerHTML = `<div class="beh-uyari" style="border-left-color:#27ae60; background:#f2fbf5; color:#1e8449;">
            ${llIcon('terazi')} <strong>Davranış puanı açık.</strong> Her basış <strong>${beh.adim}</strong> puan değerinde;
            artı veya eksiye bastığınızda sebep sorulur, sisteme ve öğrencinin <strong>Özel Notlar</strong>ına kaydedilir.
            ${beh.ortEtki
                ? `<br>${llIcon('grafik')} Ortalamaya <strong>yansıyor</strong>: net puan × <strong>${beh.ortKat}</strong> katsayısı ağırlıklı ortalamaya eklenir (0–100 arasında tutulur).`
                : `<br>${llIcon('grafik')} Ortalamaya <strong>yansımıyor</strong>. İsterseniz Seviye Ayarları’ndan “Ödev ortalamasına yansısın” seçeneğini açabilirsiniz.`}
            </div>`;
    }
}

let behSecim = null;   // { si, yon, adim, sebep }

/* + veya - tuşuna basılınca sebep popup'ını açar. */
function behAc(si, yon) {
    const beh = behAyar(curLId);
    if (!beh || !beh.aktif) return;
    const s = data.levels[curLId].classes[curCId].students[si];
    if (!s) return;

    behSecim = { si: si, yon: (yon < 0 ? -1 : 1), adim: beh.adim, sebep: null };

    const modal = document.getElementById('behModal');
    const arti = behSecim.yon > 0;
    modal.classList.toggle('yon-arti', arti);
    modal.classList.toggle('yon-eksi', !arti);

    document.getElementById('behBaslik').innerHTML = arti ? llIcon('arti')+' Artı Puan' : llIcon('eksi')+' Eksi Puan';
    document.getElementById('behOgrenci').innerText = s.name;
    document.getElementById('behMiktar').innerText = (arti ? '+' : '−') + beh.adim;
    document.getElementById('behSoru').innerText = arti
        ? 'Hangi davranışı için artı veriyorsunuz?'
        : 'Hangi davranışı için eksi veriyorsunuz?';

    const liste = arti ? beh.arti : beh.eksi;
    document.getElementById('behSecenekler').innerHTML = liste.map((t, i) =>
        `<button type="button" class="beh-sec" onclick="behSebepSec(this, ${i})">${behKacis(t)}</button>`
    ).join('');

    document.getElementById('behNot').value = '';
    document.getElementById('behOnay').disabled = true;
    modal.style.display = 'flex';
}

/* Popup'ta bir sebep başlığı seçilir. */
function behSebepSec(el, i) {
    if (!behSecim) return;
    const beh = behAyar(curLId);
    const liste = behSecim.yon > 0 ? beh.arti : beh.eksi;
    behSecim.sebep = liste[i];
    document.querySelectorAll('#behSecenekler .beh-sec').forEach(b => b.classList.remove('secili'));
    el.classList.add('secili');
    document.getElementById('behOnay').disabled = false;
}

function behKapat() {
    behSecim = null;
    const m = document.getElementById('behModal');
    if (m) m.style.display = 'none';
}

/* Sebebiyle birlikte puanı kaydeder (localStorage + Firestore -> save()). */
function behKaydet() {
    if (!behSecim || !behSecim.sebep) return;
    const s = data.levels[curLId].classes[curCId].students[behSecim.si];
    if (!s) return;
    if (!Array.isArray(s.behLog)) s.behLog = [];

    const d = new Date();
    const ikili = n => String(n).padStart(2, '0');
    const kayit = {
        d: behSecim.yon * behSecim.adim,                 // +2 / -1 gibi
        sebep: behSecim.sebep,                           // seçilen başlık
        not: (document.getElementById('behNot').value || '').trim(),
        tarih: `${ikili(d.getDate())}.${ikili(d.getMonth() + 1)}.${d.getFullYear()} ${ikili(d.getHours())}:${ikili(d.getMinutes())}`,
        ts: d.getTime()
    };
    s.behLog.push(kayit);

    // Aynı kayıt öğrencinin "Özel Notlar" defterine de düşsün.
    if (!Array.isArray(s.noteLog)) s.noteLog = [];
    s.noteLog.push({
        tur: 'davranis',
        d: kayit.d,
        baslik: (kayit.d > 0 ? 'Artı puan' : 'Eksi puan') + ' (' + (kayit.d > 0 ? '+' : '') + kayit.d + ')',
        sebep: kayit.sebep,
        not: kayit.not,
        tarih: kayit.tarih,
        ts: kayit.ts
    });

    if (typeof llPuanSesi === 'function') llPuanSesi(behSecim.yon > 0);
    save();
    behKapat();
    renderGrades('hw');
}

/* Bir öğrencinin davranış geçmişini gösterir. */
let behLogStu = null;
function behGecmis(si) {
    behLogStu = si;
    const s = data.levels[curLId].classes[curCId].students[si];
    if (!s) return;
    document.getElementById('behLogOgrenci').innerText = s.name;
    behLogCiz();
    document.getElementById('behLogModal').style.display = 'flex';
}

function behLogCiz() {
    const s = data.levels[curLId].classes[curCId].students[behLogStu];
    const kayitlar = (s && Array.isArray(s.behLog)) ? s.behLog : [];
    const artiT = kayitlar.filter(k => k.d > 0).reduce((t, k) => t + k.d, 0);
    const eksiT = kayitlar.filter(k => k.d < 0).reduce((t, k) => t + k.d, 0);

    document.getElementById('behLogOzet').innerHTML = `
        <div><span style="color:#1e8449;">+${artiT}</span><small>Artı</small></div>
        <div><span style="color:#c0392b;">${eksiT}</span><small>Eksi</small></div>
        <div><span>${artiT + eksiT > 0 ? '+' : ''}${artiT + eksiT}</span><small>Net</small></div>`;

    const kap = document.getElementById('behLogListe');
    if (!kayitlar.length) {
        kap.innerHTML = `<div class="beh-bos">Henüz kayıt yok.</div>`;
        return;
    }
    // En yeni kayıt en üstte
    kap.innerHTML = kayitlar.map((k, i) => ({ k: k, i: i })).reverse().map(o => `
        <div class="beh-kayit">
            <div class="beh-d ${o.k.d > 0 ? 'arti' : 'eksi'}">${o.k.d > 0 ? '+' : ''}${o.k.d}</div>
            <div class="beh-sebep">${behKacis(o.k.sebep)}
                <small>${behKacis(o.k.tarih || '')}${o.k.not ? ' • ' + behKacis(o.k.not) : ''}</small>
            </div>
            <button class="beh-kaldir" onclick="behKayitSil(${o.i})" title="Bu kaydı sil">${llIcon('cop')}</button>
        </div>`).join('');
}

/* Yanlışlıkla verilen bir puanı sebebiyle birlikte kaldırır. */
function behKayitSil(i) {
    const s = data.levels[curLId].classes[curCId].students[behLogStu];
    if (!s || !Array.isArray(s.behLog)) return;
    llOnay("Bu davranış kaydı silinsin mi? Puan da geri alınacak.", () => {
        const silinen = s.behLog[i];
        s.behLog.splice(i, 1);
        // Özel Notlar defterindeki eşi de kaldırılsın.
        if (silinen && Array.isArray(s.noteLog)) {
            const j = s.noteLog.findIndex(n => n.tur === 'davranis' && n.ts === silinen.ts && n.sebep === silinen.sebep);
            if (j > -1) s.noteLog.splice(j, 1);
        }
        save();
        behLogCiz();
        renderGrades('hw');
    }, { evet: 'Kaydı Sil' });
}

function behLogKapat() {
    const m = document.getElementById('behLogModal');
    if (m) m.style.display = 'none';
    behLogStu = null;
}

    function updateGrade(t, si, ci, v) {
        let s = data.levels[curLId].classes[curCId].students[si];
        /* Not, AKTIF DONEMIN dizisine yazilir (1. Donem = eski s.hw/s.ex). */
        donemNotlari(s, t, aktifDonem(curLId))[ci] = v;
        save(); renderGrades(t);
    }


    // --- BECERİ (SKILLS) YÖNETİMİ ---
    const skillTypes = [
        {n: 'Konuşma', c: '#3498db'}, {n: 'Yazma', c: '#e74c3c'}, 
        {n: 'Okuma', c: '#2ecc71'}, {n: 'Vezin', c: '#f1c40f'}, 
        {n: 'Sözlük', c: '#9b59b6'}, {n: 'Tercüme', c: '#e67e22'}
    ];
    let curSkillStuIdx = null;

    function openSkillModal(idx) {
        curSkillStuIdx = idx;
        let s = data.levels[curLId].classes[curCId].students[idx];
        if(!s.skills) s.skills = {};
        document.getElementById('skillModalTitle').innerText = s.name + " - Beceriler";
        let c = document.getElementById('skillSliders');
        c.innerHTML = '';
        skillTypes.forEach(sk => {
            let val = s.skills[sk.n] || 1;
            c.innerHTML += `
                <div style="margin-bottom:15px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${sk.n}</span><span style="color:${sk.c}; font-weight:bold;">${val}/10</span>
                    </div>
                    <input type="range" min="1" max="10" value="${val}" class="skill-slider"
                    style="background: linear-gradient(to right, ${sk.c} ${(val-1)*11.1}%, #e0e0e0 ${(val-1)*11.1}%);"
                    oninput="this.previousElementSibling.children[1].innerText=this.value+'/10'; this.style.background='linear-gradient(to right, ${sk.c} '+(this.value-1)*11.1+'%, #e0e0e0 '+(this.value-1)*11.1+'%)'; updateSkillVal('${sk.n}', this.value)">
                </div>`;
        });
        document.getElementById('skillModal').style.display = 'flex';
    }
    
    function updateSkillVal(n, v) {
        data.levels[curLId].classes[curCId].students[curSkillStuIdx].skills[n] = parseInt(v);
    }
    function closeSkillModal() { save(); document.getElementById('skillModal').style.display = 'none'; }

    // --- ETKİNLİK VE KURA ---
    function pick(type, color) {
        if(!curCId) return alert("Sınıf seçin!");
        let cls = data.levels[curLId].classes[curCId];
        if(!cls.students.length) return alert("Öğrenci yok!");

        if(!pools[type] || !pools[type].length) pools[type] = [...Array(cls.students.length).keys()];
        
        let disp = document.getElementById('luckyStudent');
        let count = 0;
        let int = setInterval(() => {
            disp.innerText = cls.students[Math.floor(Math.random()*cls.students.length)].name;
            if(++count > 20) {
                clearInterval(int);
                let pIdx = Math.floor(Math.random()*pools[type].length);
                let sIdx = pools[type].splice(pIdx, 1)[0];
                let stu = cls.students[sIdx];
                disp.innerText = stu.name;
                document.getElementById('activityType').innerHTML = llIcon('hedef') + " " + behKacis(type || '');
                if(!stu.history) stu.history = [];
                stu.history.push(color);
                llKuraSesi();
                save(); renderActivityStatus();
            }
        }, 80);
    }

function renderActivityButtons() {
    const grid = document.querySelector('.activity-grid'); 
    if (!grid || !curLId || !data.levels[curLId]) return;

    let level = data.levels[curLId];
    
    // Eğer kura listesi boşsa (ilk kez açılıyorsa) varsayılanları kullan
    let kuraList = level.config.kura || [
        {n: 'Konuşma'}, {n: 'Yazma'}, {n: 'Okuma'},
        {n: 'Vezin'}, {n: 'Sözlük'}, {n: 'Tercüme'}
    ];

    grid.innerHTML = ''; 
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

    kuraList.forEach((item, index) => {
        const color = colors[index % colors.length];
        const wrapper = document.createElement('div');
        wrapper.className = 'act-btn-wrapper';
        wrapper.style.width = "100%";
        
        wrapper.innerHTML = `
            <button class="act-btn" style="background:${color}; width:100%; min-height:95px; border-radius:12px; border:none; color:white; font-weight:bold; cursor:pointer; font-family:'Marhey', sans-serif; font-size:1.1rem;" 
                    onclick="pick('${item.n}', '${color}')">
                ${item.n}
            </button>
        `;
        grid.appendChild(wrapper);
    });

    /* + Baslik Ekle karosu: yeni kura basligi buradan eklenir; Seviye
       Ayarlari listesi ayni config'ten okudugu icin OTOMATIK guncellenir. */
    const ekle = document.createElement('div');
    ekle.className = 'act-btn-wrapper';
    ekle.style.width = "100%";
    ekle.innerHTML = `
        <button class="act-btn" onclick="kuraBaslikEkle()" title="Yeni kura başlığı ekle"
            style="background:#fff; width:100%; min-height:95px; border-radius:12px; border:2px dashed #E8A87C;
            color:#B34700; font-weight:bold; cursor:pointer; font-family:'Marhey', sans-serif; font-size:1.05rem;">+ Başlık Ekle</button>`;
    grid.appendChild(ekle);
}

function kuraBaslikEkle() {
    if (!curLId || !data.levels[curLId]) return;
    const ad = prompt('Yeni kura başlığı (Örn: Ezber):');
    if (!ad || !ad.trim()) return;
    const lvl = data.levels[curLId];
    if (!Array.isArray(lvl.config.kura) || !lvl.config.kura.length) {
        lvl.config.kura = [
            {n: 'Konuşma'}, {n: 'Yazma'}, {n: 'Okuma'},
            {n: 'Vezin'}, {n: 'Sözlük'}, {n: 'Tercüme'}
        ];
    }
    if (lvl.config.kura.some(k => (k.n || '').toLowerCase() === ad.trim().toLowerCase())) {
        alert('Bu başlık zaten var.'); return;
    }
    lvl.config.kura.push({ n: ad.trim() });
    save();
    renderActivityButtons();
    if (typeof renderActivityStatus === 'function') renderActivityStatus();
}
window.kuraBaslikEkle = kuraBaslikEkle;


function addKuraRow(name = "") {
    const container = document.getElementById('lvlKuraList');
    const div = document.createElement('div');
    div.style = "margin-bottom:8px; display:flex; gap:5px;";
    div.innerHTML = `
        <input type="text" class="kura-n" value="${name}" placeholder="Kura Başlığı" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px;">
        <span title="Kura başlıkları buradan silinemez (kura geçmişi ve havuzlar korunur)" style="display:inline-flex; align-items:center; padding:0 10px; color:#B9A08D; font-size:1rem;">🔒</span>
    `;
    container.appendChild(div);
}

    function renderActivityStatus() {
        if(!curCId) return;
        let table = document.getElementById('activityStatusTable');
        table.innerHTML = `<tr><th>Öğrenci</th><th>Geçmiş (Silmek için tıkla)</th><th>Havuz Durumu</th></tr>`;
        data.levels[curLId].classes[curCId].students.forEach((s, idx) => {
            let hist = (s.history||[]).map((c, hi) => `<span class="marker" style="background:${c}; cursor:pointer;" onclick="delHist(${idx},${hi})"></span>`).join('');
            let poolSt = skillTypes.map(st => {
                let exist = !pools[st.n] || pools[st.n].includes(idx);
                return `<span style="font-size:0.8em; color:${exist?'#2ecc71':'#e74c3c'}; ${!exist?'text-decoration:line-through':''}">${llIcon('nokta')} ${st.n}</span>`;
            }).join(' ');
            table.insertRow().innerHTML = `<td>${s.name}</td><td>${hist}</td><td>${poolSt}</td>`;
        });
    }

    function delHist(si, hi) {
        llOnay("Silinsin mi?", () => {
            data.levels[curLId].classes[curCId].students[si].history.splice(hi, 1);
            save(); renderActivityStatus();
        });
    }
    function resetPools() {
        llOnay("Tüm geçmiş ve havuzlar sıfırlansın mı?", () => {
            pools = {};
            data.levels[curLId].classes[curCId].students.forEach(s => s.history = []);
            save(); renderActivityStatus();
        });
    }

    // --- SEVİYE AYARLARI ---

/* ==========================================================================
   DAVRANIŞ PUANI (ARTI / EKSİ) — VARSAYILANLAR
   Bu bölüm seviye ayarlarında HER ZAMAN görünür, ama varsayılan olarak
   PASİFTİR. Öğretmen isterse anahtarı açar; ancak o zaman Performans
   sekmesinde öğrencilere +/- verilebilir.
   ========================================================================== */
const BEH_VARSAYILAN_EKSI = [
    "Sınıf düzenini bozmak",
    "Saygısızlık",
    "Ödevini yapmamak",
    "Derse geç kalmak",
    "İzinsiz konuşmak",
    "Arkadaşını rahatsız etmek",
    "Ders malzemesi getirmemek",
    "Derste telefonla ilgilenmek",
    "Ders dışı işle uğraşmak",
    "Sıra ve temizlik kurallarına uymamak"
];
const BEH_VARSAYILAN_ARTI = [
    "Çalışkan",
    "Örnek davranış",
    "Derse aktif katılım",
    "Ödevini eksiksiz yapmak",
    "Arkadaşına yardım etmek",
    "Nazik ve saygılı",
    "Sorumluluk almak",
    "Defteri temiz ve düzenli",
    "Gönüllü söz almak",
    "Belirgin gelişme gösterdi"
];

/* Seviyenin davranış ayarını getirir; yoksa varsayılanı kurar. */
function behAyar(lId) {
    const lvl = data.levels[lId];
    if (!lvl) return null;
    if (!lvl.config) lvl.config = {};
    if (!lvl.config.beh) {
        lvl.config.beh = {
            aktif: false,                        // varsayılan: PASİF
            adim: 1,                             // bir basışta verilen puan (1-3)
            arti: BEH_VARSAYILAN_ARTI.slice(),
            eksi: BEH_VARSAYILAN_EKSI.slice(),
            ortEtki: true,                       // ödev ortalamasına yansısın mı? — VARSAYILAN AÇIK
            ortKat: 1                            // net puan × katsayı
        };
    }
    const b = lvl.config.beh;
    if (typeof b.aktif !== 'boolean') b.aktif = false;
    b.adim = Math.min(3, Math.max(1, parseInt(b.adim) || 1));   // en az 1, en fazla 3
    if (typeof b.ortEtki !== 'boolean') b.ortEtki = true;
    /* GEÇİŞ: "ortalamaya yansısın" artık VARSAYILAN AÇIK. Öğretmen bu ayarı
       Seviye Ayarları penceresinden hiç kaydetmediyse (ortEtkiSecildi yok),
       eski kayıtlardaki otomatik false değeri açığa çevrilir. Öğretmen
       kutuyu bilerek kapatıp kaydederse ortEtkiSecildi=true olur ve
       tercihi bir daha ezilmez. */
    if (!b.ortEtkiSecildi && !b.ortEtki) b.ortEtki = true;
    let k = parseFloat(b.ortKat);
    if (!isFinite(k) || k < 0) k = 1;
    b.ortKat = Math.min(10, Math.round(k * 100) / 100);
    if (!Array.isArray(b.arti) || !b.arti.length) b.arti = BEH_VARSAYILAN_ARTI.slice();
    if (!Array.isArray(b.eksi) || !b.eksi.length) b.eksi = BEH_VARSAYILAN_EKSI.slice();
    return b;
}

/* Davranışın ödev ortalamasına etkisi: net × katsayı, sonuç 0-100 arasına sıkıştırılır. */
function behOrtEtkisi(beh, s) {
    if (!beh || !beh.aktif || !beh.ortEtki) return 0;
    return behNet(s) * (parseFloat(beh.ortKat) || 0);
}
function behOrtUygula(ort, beh, s) {
    const e = behOrtEtkisi(beh, s);
    if (!e) return { son: ort, etki: 0 };
    return { son: Math.max(0, Math.min(100, ort + e)), etki: e };
}

/* HTML'e güvenli yazdırma (sebep başlıkları kullanıcıdan geliyor). */
function behKacis(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 1. Ayar Penceresini Açan Ana Fonksiyon
function openLvlConfig(lId) {
    curLId = lId;
    const lvl = data.levels[lId];
    if (!lvl) return;

    llGovdeyeAl('lvlModal');   /* profilden acilinca da gorunsun (gizli bolumden cikar) */
    const modal = document.getElementById('lvlModal');
    if (!modal) return;

    // 1. Veri Yapısı Kontrolü (Eğer yoksa varsayılanları ata)
    if (!lvl.config) lvl.config = {};
    if (!lvl.config.hw) lvl.config.hw = [{n: '1. Ödev', w: 25}, {n: '2. Ödev', w: 25}, {n: '3. Ödev', w: 25}, {n: '4. Ödev', w: 25}];
    if (!lvl.config.ex) lvl.config.ex = [{n: 'Dinleme', w: 25}, {n: 'Konuşma', w: 25}, {n: 'Yazılı', w: 50}];
    if (!lvl.config.kura) lvl.config.kura = [{n: 'Konuşma'}, {n: 'Yazma'}, {n: 'Okuma'}, {n: 'Vezin'}, {n: 'Sözlük'}, {n: 'Tercüme'}];
    const beh = behAyar(lId);

    // Pencere artık ekranın %80'ini kaplıyor: başlık + kaydırılan gövde + alt bar
    modal.style.display = 'flex';

    // Modal içeriğini her açılışta sıfırdan ve düzenli bir yapıyla kuralım
    modal.innerHTML = `
        <div class="lvl-bas">
            <div>
                <h3>${llIcon('ayar')} Seviye Ayarları</h3>
                <div class="lvl-ad">${behKacis(lvl.name || '')}</div>
            </div>
            <button class="lvl-kapat" onclick="lvlKapat()" title="Kapat">&times;</button>
        </div>

        <div class="lvl-govde">
            <div class="lvl-bilgi">
                <div style="font-weight: bold; margin-bottom: 3px;">${llIcon('duyuru')} Kapsam Bilgilendirmesi:</div>
                Bu seviyede yapacağınız isim ve ağırlık (%) değişiklikleri, bu seviyeye bağlı <strong>tüm sınıflarda</strong> otomatik olarak güncellenir. Değişiklikler Ödev, Sınav ve Kura sekmelerinin tamamını etkiler.
            </div>

            <div class="lvl-izgara">
                <div class="lvl-kart">
                    <h4>${llIcon('kitap')} Ödevler (Ağırlık %)</h4>
                    <div id="lvlHwList"></div>
                    <button class="btn-add" onclick="llOdevOneriAc()" style="width:100%; margin-top:10px;">+ Ödev Ekle</button>
                    <div id="lvlHwToplam" style="margin-top:10px; padding:8px 12px; border-radius:9px; border:1px solid #A7E8CF; background:#EAFBF4; color:#0E7C66; font-weight:700; font-size:.84rem; text-align:center; line-height:1.35;"></div>
                </div>
                <div class="lvl-kart">
                    <h4 style="border-bottom-color: var(--danger);">${llIcon('not')} Sınavlar (Ağırlık %)</h4>
                    <div id="lvlExList"></div>
                    <button class="btn-add" onclick="addConfigRow('ex')" style="width:100%; margin-top:10px; background:var(--secondary);">+ Sınav Ekle</button>
                </div>
                <div class="lvl-kart">
                    <h4 style="border-bottom-color: #2ecc71;">${llIcon('hedef')} Kura Kategorileri</h4>
                    <div id="lvlKuraList"></div>
                    <button class="btn-add" onclick="addKuraRow()" style="width:100%; margin-top:10px; background:#2ecc71;">+ Yeni Kura Kutusu Ekle</button>
                </div>

                <div class="lvl-kart lvl-genis">
                    <h4 style="border-bottom-color:#27ae60;">${llIcon('terazi')} Davranış Puanı (Artı / Eksi)</h4>
                    <div class="beh-ust">
                        <div class="beh-tanim">
                            Bu bölüm her seviyede hazır bulunur ve <strong>varsayılan olarak kapalıdır</strong>.
                            Açarsanız <strong>Performans</strong> sekmesinde her öğrencinin yanında artı/eksi tuşları belirir.
                            Her basışta sebep sorulur ve seçilen sebep tarihiyle birlikte sisteme kaydedilir.
                        </div>
                        <label class="beh-anahtar">
                            <input type="checkbox" id="behAktif" ${beh.aktif ? 'checked' : ''} onchange="behAktifDegisti(this)">
                            <span class="beh-ray"></span>
                            <span class="beh-durum" id="behDurumYazi">${beh.aktif ? 'Açık' : 'Kapalı'}</span>
                        </label>
                    </div>

                    <div class="beh-icerik ${beh.aktif ? '' : 'pasif'}" id="behIcerik">
                        <div class="beh-satir">
                            <label>Bir basışta verilecek puan:</label>
                            <div class="beh-adim" id="behAdim">
                                <button type="button" class="${beh.adim === 1 ? 'secili' : ''}" onclick="behAdimSec(1)">1</button>
                                <button type="button" class="${beh.adim === 2 ? 'secili' : ''}" onclick="behAdimSec(2)">2</button>
                                <button type="button" class="${beh.adim === 3 ? 'secili' : ''}" onclick="behAdimSec(3)">3</button>
                            </div>
                            <span class="beh-ornek" id="behOrnek">Örnek: bir artı <strong>+${beh.adim}</strong>, bir eksi <strong>-${beh.adim}</strong> puan.</span>
                        </div>

                        <div class="beh-satir beh-ort-satir">
                            <label class="beh-anahtar">
                                <input type="checkbox" id="behOrtEtki" ${beh.ortEtki ? 'checked' : ''} onchange="behOrtDegisti(this)">
                                <span>Ödev ortalamasına yansısın</span>
                            </label>
                            <div class="beh-kat-kutu ${beh.ortEtki ? '' : 'pasif'}" id="behKatKutu">
                                <label for="behOrtKat">Katsayı:</label>
                                <input type="number" id="behOrtKat" min="0" max="10" step="0.25" value="${beh.ortKat}" oninput="behOrnekGuncelle()">
                                <span class="beh-ornek" id="behOrtOrnek"></span>
                            </div>
                        </div>

                        <div class="beh-sebep-kolon">
                            <div class="beh-kutu arti">
                                <h5>${llIcon('arti')} Artı sebepleri (örnek alınacak davranışlar)</h5>
                                <div class="beh-liste" id="behArtiListe"></div>
                                <button type="button" class="beh-ekle" onclick="behSebepEkle('arti')">+ Yeni başlık ekle</button>
                            </div>
                            <div class="beh-kutu eksi">
                                <h5>${llIcon('eksi')} Eksi sebepleri (sık görülen hatalar)</h5>
                                <div class="beh-liste" id="behEksiListe"></div>
                                <button type="button" class="beh-ekle" onclick="behSebepEkle('eksi')">+ Yeni başlık ekle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="lvl-alt">
            <span class="lvl-not">* Tüm sınıflar ve sekmeler güncellenecektir.</span>
            <button class="lvl-iptal" onclick="lvlKapat()">İptal</button>
            <button class="lvl-kaydet" onclick="saveLvlConfig()">Değişiklikleri Kaydet</button>
        </div>
    `;

    // 2. Ödevleri yükle
    lvl.config.hw.forEach(item => addConfigRowWithData('hw', item.n, item.w));
    llHwToplamGuncelle();   // ağırlık toplamı göstergesini kur (tek ödev → otomatik 100)

    // 3. Sınavları yükle
    lvl.config.ex.forEach(item => addConfigRowWithData('ex', item.n, item.w));

    // 4. Kura başlıklarını yükle (Sınavdan bağımsız kendi dizisinden çeker)
    lvl.config.kura.forEach(item => {
        addKuraRowWithData(item.n);
    });

    // 5. Davranış sebep başlıklarını yükle
    beh.arti.forEach(t => behSebepSatiri('arti', t));
    beh.eksi.forEach(t => behSebepSatiri('eksi', t));
}

/* Seviye ayarları penceresini kapatır. */
function lvlKapat() {
    const m = document.getElementById('lvlModal');
    if (m) m.style.display = 'none';
}

/* Anahtar açılıp kapandığında alt ayarları sönükleştir/canlandır. */
function behAktifDegisti(el) {
    const icerik = document.getElementById('behIcerik');
    const yazi = document.getElementById('behDurumYazi');
    if (icerik) icerik.classList.toggle('pasif', !el.checked);
    if (yazi) yazi.innerText = el.checked ? 'Açık' : 'Kapalı';
}

/* Bir basışta verilecek puanı seçer (en az 1, en fazla 3). */
function behAdimSec(n) {
    n = Math.min(3, Math.max(1, parseInt(n) || 1));
    const kutu = document.getElementById('behAdim');
    if (!kutu) return;
    Array.from(kutu.children).forEach((b, i) => b.classList.toggle('secili', (i + 1) === n));
    const ornek = document.getElementById('behOrnek');
    if (ornek) ornek.innerHTML = `Örnek: bir artı <strong>+${n}</strong>, bir eksi <strong>-${n}</strong> puan.`;
    behOrnekGuncelle();
}

/* "Ortalamaya yansısın" anahtarı. */
function behOrtDegisti(el) {
    const kutu = document.getElementById('behKatKutu');
    if (kutu) kutu.classList.toggle('pasif', !el.checked);
    behOrnekGuncelle();
}

/* Katsayı örneğini canlı gösterir. */
function behOrnekGuncelle() {
    const cikti = document.getElementById('behOrtOrnek');
    if (!cikti) return;
    const kat = behOrtKatOku();
    const adim = behAdimOku();
    cikti.innerHTML = `Örnek: net <strong>+${adim * 2}</strong> puan → ortalamaya <strong>+${(adim * 2 * kat).toFixed(2)}</strong> eklenir. (Sonuç 0–100 arasında tutulur.)`;
}

/* Katsayıyı okur (0–10 arası). */
function behOrtKatOku() {
    const el = document.getElementById('behOrtKat');
    let k = el ? parseFloat(el.value) : 1;
    if (!isFinite(k) || k < 0) k = 1;
    return Math.min(10, Math.round(k * 100) / 100);
}

/* Seçili adım değerini okur. */
function behAdimOku() {
    const kutu = document.getElementById('behAdim');
    if (!kutu) return 1;
    let n = 1;
    Array.from(kutu.children).forEach((b, i) => { if (b.classList.contains('secili')) n = i + 1; });
    return Math.min(3, Math.max(1, n));
}

/* Sebep başlığı satırı ekler (artı veya eksi listesine). */
function behSebepSatiri(tur, metin) {
    const kap = document.getElementById(tur === 'arti' ? 'behArtiListe' : 'behEksiListe');
    if (!kap) return;
    const sat = document.createElement('div');
    sat.className = 'beh-sat';
    sat.innerHTML = `
        <input type="text" class="beh-${tur}-n" value="${behKacis(metin)}" placeholder="Başlık...">
        <button type="button" onclick="this.parentElement.remove()" title="Kaldır">${llIcon('kapat')}</button>`;
    kap.appendChild(sat);
}
function behSebepEkle(tur) {
    behSebepSatiri(tur, '');
    const kap = document.getElementById(tur === 'arti' ? 'behArtiListe' : 'behEksiListe');
    if (kap && kap.lastElementChild) {
        kap.scrollTop = kap.scrollHeight;
        const inp = kap.lastElementChild.querySelector('input');
        if (inp) inp.focus();
    }
}

// Yardımcı Fonksiyon: Kura satırını veriyle ekler
function addKuraRowWithData(name) {
    const kuraList = document.getElementById('lvlKuraList');
    if (!kuraList) return;
    const row = document.createElement('div');
    row.style = "margin-bottom:8px; display:flex; gap:5px;";
    row.innerHTML = `
        <input type="text" class="kura-n" value="${name}" placeholder="Kura Adı" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px;">
        <span title="Kura başlıkları buradan silinemez (kura geçmişi ve havuzlar korunur)" style="display:inline-flex; align-items:center; padding:0 10px; color:#B9A08D; font-size:1rem;">🔒</span>
    `;
    kuraList.appendChild(row);
}


function addKuraRow() {
    addKuraRowWithData(""); // Boş satır ekler
}

// 2. Yeni Satır Ekleme (Manuel + butonu için)
function addConfigRow(t) {
    addConfigRowWithData(t, '', 0);
    if (t === 'hw') llHwToplamGuncelle();
}

// 3. Veriyle Satır Oluşturma (Sistemin ihtiyaç duyduğu asıl parça)
function addConfigRowWithData(t, name, weight) {
    const container = document.getElementById(t === 'hw' ? 'lvlHwList' : 'lvlExList');
    if (!container) return;

    // Ödev (hw) ağırlıkları 0-100 arası; her değişiklikte toplam göstergesi güncellenir.
    const wEk = (t === 'hw') ? ' min="0" max="100" oninput="llHwToplamGuncelle()"' : '';
    const sil = (t === 'hw') ? 'this.parentElement.remove(); llHwToplamGuncelle();' : 'this.parentElement.remove()';
    const div = document.createElement('div');
    div.style = "margin-bottom:8px; display:flex; gap:5px; align-items:center;";
    div.innerHTML = `
        <input type="text" class="${t}-n" value="${name}" placeholder="Ad" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <input type="number" class="${t}-w" value="${weight}"${wEk} placeholder="%" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <button onclick="${sil}" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">${llIcon('kapat')}</button>
    `;
    container.appendChild(div);
}

/* ÖDEV AĞIRLIK GÖSTERGESİ — canlı toplam + tek ödev otomatik 100.
   · 1 ödev  → ağırlık otomatik 100, alan kilitli.
   · 2+ ödev → toplam tam 100 olmalı ve hiçbir ödev 0 kalmamalı; aksi hâlde
     gösterge kırmızıya döner (kaydetme sırasında da engellenir).                */
function llHwToplamGuncelle() {
    const kutu = document.getElementById('lvlHwToplam');
    if (!kutu) return;
    const wIn = Array.prototype.slice.call(document.querySelectorAll('#lvlHwList .hw-w'));
    const yesil = () => { kutu.style.background = '#EAFBF4'; kutu.style.color = '#0E7C66'; kutu.style.borderColor = '#A7E8CF'; };
    const kirmizi = () => { kutu.style.background = '#FDECEA'; kutu.style.color = '#B4231E'; kutu.style.borderColor = '#F5B7B1'; };
    if (wIn.length === 0) { kutu.style.display = 'none'; return; }
    kutu.style.display = 'block';
    if (wIn.length === 1) {
        wIn[0].value = 100; wIn[0].readOnly = true; wIn[0].style.background = '#EAFBF4';
        yesil(); kutu.innerHTML = '✓ Tek ödev — ağırlık otomatik <b>100</b>';
        return;
    }
    let toplam = 0, sifir = 0;
    wIn.forEach(el => { el.readOnly = false; el.style.background = '';
        let v = parseInt(el.value, 10); if (!isFinite(v)) v = 0;
        toplam += v; if (v <= 0) sifir++; });
    if (toplam === 100 && sifir === 0) { yesil(); kutu.innerHTML = '✓ Toplam ağırlık: <b>100</b> / 100'; }
    else {
        kirmizi();
        kutu.innerHTML = (toplam !== 100)
            ? '⚠️ Toplam ağırlık: <b>' + toplam + '</b> / 100 — tam <b>100</b> olmalı'
            : '⚠️ Ağırlığı 0 olan ödev var — yeni ödevi ekleyince ağırlıkları 100 olacak şekilde yeniden dağıtın';
    }
}
window.llHwToplamGuncelle = llHwToplamGuncelle;

// 4. Kaydetme Fonksiyonu
function saveLvlConfig() {
    if (!curLId || !data.levels[curLId]) return;

    // 1. Ödevleri topla
    let newHw = [];
    document.querySelectorAll('.hw-n').forEach((el, i) => {
        let wInputs = document.querySelectorAll('.hw-w');
        let w = wInputs[i] ? wInputs[i].value : 0;
        if (el.value.trim() !== "") {
            newHw.push({ n: el.value.trim(), w: parseInt(w) || 0 });
        }
    });

    // 1b. ÖDEV AĞIRLIK DENETİMİ — toplam tam 100 olmalı (ne fazla ne az).
    //     Tek ödev otomatik 100; 2+ ödevde toplam 100 değilse ya da ağırlığı 0
    //     kalan ödev varsa site tasarımlı uyarı gösterilir ve KAYIT ENGELLENİR
    //     (pencere açık kalır, öğretmen ağırlıkları düzeltir).
    if (newHw.length === 1) {
        newHw[0].w = 100;
    } else if (newHw.length >= 2) {
        let hwTop = 0, hwSifir = 0;
        newHw.forEach(x => { const v = parseInt(x.w, 10) || 0; hwTop += v; if (v <= 0) hwSifir++; });
        if (hwTop !== 100 || hwSifir > 0) {
            const mesaj = (hwTop !== 100)
                ? ('Ödev ağırlıklarının toplamı tam 100 olmalı — ne fazla ne az.\n\nŞu anki toplam: ' + hwTop + '. Lütfen ağırlıkları 100 olacak şekilde düzeltin.')
                : ('Her ödevin bir ağırlığı olmalı; ağırlığı 0 olan ödev var.\n\nYeni bir ödev eklediyseniz ağırlıkları 100 olacak şekilde yeniden dağıtın.');
            llBilgi(mesaj, '⚠️ Ödev ağırlığı geçersiz');
            return;
        }
    }

    // 2. Sınavları topla (Sadece .ex-n ve .ex-w sınıfından alır)
    let newEx = [];
    document.querySelectorAll('.ex-n').forEach((el, i) => {
        let wInputs = document.querySelectorAll('.ex-w');
        let w = wInputs[i] ? wInputs[i].value : 0;
        if (el.value.trim() !== "") {
            newEx.push({ n: el.value.trim(), w: parseInt(w) || 0 });
        }
    });

    // 3. Kura Başlıklarını topla (Sadece .kura-n sınıfından alır)
    let newKura = [];
    document.querySelectorAll('.kura-n').forEach((el) => {
        if (el.value.trim() !== "") {
            newKura.push({ n: el.value.trim() }); // Kura için ağırlık gerekmez
        }
    });

    // 4. Davranış puanı ayarlarını topla (bölüm her zaman penceredeydi)
    const behKutu = document.getElementById('behAktif');
    if (behKutu) {
        const beh = behAyar(curLId);
        beh.aktif = behKutu.checked;
        beh.adim = behAdimOku();
        const ortKutu = document.getElementById('behOrtEtki');
        beh.ortEtki = !!(ortKutu && ortKutu.checked);
        beh.ortEtkiSecildi = true;   // öğretmen tercihini kaydetti; varsayılan bir daha ezmez
        beh.ortKat = behOrtKatOku();

        let yeniArti = [], yeniEksi = [];
        document.querySelectorAll('.beh-arti-n').forEach(el => { if (el.value.trim() !== "") yeniArti.push(el.value.trim()); });
        document.querySelectorAll('.beh-eksi-n').forEach(el => { if (el.value.trim() !== "") yeniEksi.push(el.value.trim()); });
        // Liste tamamen boşaltıldıysa varsayılanlara dön (sebepsiz puan verilmesin)
        beh.arti = yeniArti.length ? yeniArti : BEH_VARSAYILAN_ARTI.slice();
        beh.eksi = yeniEksi.length ? yeniEksi : BEH_VARSAYILAN_EKSI.slice();
    }

    // Verileri birbirinden bağımsız dizilere mühürle
    data.levels[curLId].config.hw = newHw;
    data.levels[curLId].config.ex = newEx;
    data.levels[curLId].config.kura = newKura; // Yeni bağımsız kura dizisi

    save();

    // Arayüzü kapat ve güncelle
    document.getElementById('lvlModal').style.display = 'none';

    // Kura butonlarını sadece 'kura' dizisinden çizecek şekilde tetikle
    renderActivityButtons();

    if (curCId) {
        renderGrades('hw');
        renderGrades('ex');
        renderResults();
    }
    
    alert("Tüm ayarlar (Ödev, Sınav, Kura ve Davranış Puanı) kaydedildi!");
}

function renderConfRows(t, items) {
    const id = (t === 'hw' ? 'lvlHwList' : 'lvlExList');
    const container = document.getElementById(id);
    
    if (!container) return; // Eğer modal henüz DOM'da tam oluşmadıysa hata verme.
    
    container.innerHTML = '';
    const list = items || [];
    
    list.forEach(item => {
        container.innerHTML += `
            <div style="margin-bottom:8px; display:flex; gap:5px; align-items:center;">
                <input type="text" class="${t}-n" value="${item.n}" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
                <input type="number" class="${t}-w" value="${item.w}" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
                <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">${llIcon('kapat')}</button>
            </div>`;
    });
}


function addConfigRow(t) {
    const container = document.getElementById(t === 'hw' ? 'lvlHwList' : 'lvlExList');
    if (!container) return;
    
    const rowHtml = `
        <div style="margin-bottom:8px; display:flex; gap:5px; align-items:center;">
            <input type="text" class="${t}-n" placeholder="Yeni Ad..." style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
            <input type="number" class="${t}-w" value="0" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
            <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">${llIcon('kapat')}</button>
        </div>`;
    
    container.insertAdjacentHTML('beforeend', rowHtml);
}

// ======================================================
    // === YENİ ÖZELLİKLER (GERİ SAYIM, KRONOMETRE, TAKIM) ===
    // ======================================================

    // --- GERİ SAYIM SİSTEMİ (Özel Değişken İsimleri ile) ---
    var cdTimer = null;
    var cdTotalSeconds = 0;

    function adjustCountdown(amount) {
        if (cdTimer) return; 
        let currentMins = Math.floor(cdTotalSeconds / 60);
        currentMins += amount;
        if (currentMins < 0) currentMins = 0; 
        cdTotalSeconds = currentMins * 60;
        
        const minDisplay = document.getElementById('manual-min-val');
        if (minDisplay) minDisplay.innerText = currentMins;
        renderCdTime();
    }

    function startCountdown() {
        if (cdTimer) return; 
        if (cdTotalSeconds <= 0) {
            alert("Lütfen önce süre belirleyin!");
            return;
        }
        cdTimer = setInterval(() => {
            cdTotalSeconds--;
            if (cdTotalSeconds <= 0) {
                cdTotalSeconds = 0;
                renderCdTime();
                stopCountdown();
                alert("Süre doldu!");
                return;
            }
            renderCdTime();
        }, 1000);
    }

    function stopCountdown() {
        clearInterval(cdTimer);
        cdTimer = null;
    }

    function resetCountdown() {
        stopCountdown();
        cdTotalSeconds = 0;
        const minDisplay = document.getElementById('manual-min-val');
        if (minDisplay) minDisplay.innerText = "0";
        renderCdTime();
    }

    function renderCdTime() {
        let m = Math.floor(cdTotalSeconds / 60);
        let s = cdTotalSeconds % 60;
        const el = document.getElementById('countdown-display');
        if (el) {
            el.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }

    // --- KRONOMETRE SİSTEMİ ---
    let sw_interval = null;
    let sw_start = 0;
    let sw_elapsed = 0;
    let lap_counter = 0;

    function startStopwatch() {
        if(!sw_interval) {
            sw_start = Date.now() - sw_elapsed;
            sw_interval = setInterval(() => {
                sw_elapsed = Date.now() - sw_start;
                document.getElementById('stopwatch-display').innerText = formatMs(sw_elapsed);
            }, 10);
        }
    }

    function stopStopwatch() {
        clearInterval(sw_interval);
        sw_interval = null;
    }

    function resetStopwatch() {
        stopStopwatch();
        sw_elapsed = 0;
        lap_counter = 0;
        document.getElementById('stopwatch-display').innerText = "00:00:00";
        const lapListEl = document.getElementById('lapList');
        if (lapListEl) lapListEl.innerHTML = "";
    }

    // Giriş/Çıkış butonunu yöneten yardımcı fonksiyon
function loginButonTikla() {
    const user = firebase.auth().currentUser;
    if (user) {
        // Eğer kullanıcı varsa çıkış onayı iste
        llOnay("Çıkış yapmak istediğinize emin misiniz?", () => {
            firebase.auth().signOut().then(() => {
                alert("Başarıyla çıkış yapıldı.");
                location.reload(); // Sayfayı yenileyerek temiz bir başlangıç yapın
            });
        }, { evet: 'Çıkış Yap' });
    } else {
        // Kullanıcı yoksa giriş modalını aç
        modalAc(); 
    }
}
   
    function recordLap() {
        const lapListEl = document.getElementById('lapList');
        if(sw_elapsed > 0 && lapListEl) {
            lap_counter++;
            let d = document.createElement('div');
            d.style.padding = "5px";
            d.style.borderBottom = "1px solid #eee";
            d.innerText = `Tur ${lap_counter}: ${formatMs(sw_elapsed)}`;
            lapListEl.prepend(d);
        }
    }

/* ==================== TAKIM OLUSTURUCU ====================
   Amac: ogrencileri ISIM, SIRA NO veya OKUL NO ile hizlica takimlara ayirmak.
   - Listede olmayan (mail ile giris yapmamis) oyuncular "misafir" olarak eklenir.
   - Katilmayan ogrenciler tek tikla disarida birakilir.
   - Misafirler ve katilim durumu cihazda (localStorage) sinif bazinda saklanir;
     bulut verisine (data / Firestore) hicbir sey yazilmaz.
========================================================== */
var LL_TAKIM = window.LL_TAKIM || {
    etiket: 'isim',      // 'isim' | 'sira' | 'okul'
    misafir: [],         // ['Ali', 'Veli']
    disarida: [],        // normalize edilmis adlar
    sinifAnahtar: '',
    son: null,           // {boyut:n} | {sayi:n} | {elle:'metin'}
    sonTakim: null,
    sonAd: null
};
window.LL_TAKIM = LL_TAKIM;

function llTakimAnahtar() {
    var l = (typeof curLId !== 'undefined' && curLId) ? curLId : '0';
    var c = (typeof curCId !== 'undefined' && curCId) ? curCId : '0';
    return 'kidef_takim_' + l + '_' + c;
}

function llTakimYukle() {
    var a = llTakimAnahtar();
    if (LL_TAKIM.sinifAnahtar === a) return;
    LL_TAKIM.sinifAnahtar = a;
    LL_TAKIM.misafir = [];
    LL_TAKIM.disarida = [];
    LL_TAKIM.sonTakim = null;
    try {
        var ham = localStorage.getItem(a);
        if (ham) {
            var o = JSON.parse(ham) || {};
            if (Array.isArray(o.misafir)) LL_TAKIM.misafir = o.misafir.slice(0, 80);
            if (Array.isArray(o.disarida)) LL_TAKIM.disarida = o.disarida.slice(0, 300);
            if (o.etiket === 'isim' || o.etiket === 'sira' || o.etiket === 'okul') LL_TAKIM.etiket = o.etiket;
        }
    } catch (e) { }
}

function llTakimKaydet() {
    try {
        localStorage.setItem(LL_TAKIM.sinifAnahtar || llTakimAnahtar(), JSON.stringify({
            misafir: LL_TAKIM.misafir, disarida: LL_TAKIM.disarida, etiket: LL_TAKIM.etiket
        }));
    } catch (e) { }
}

/* Turkce duyarli sadelestirme — "İSMAİL" ile "ismail" eslessin. */
function llTakimNorm(s) {
    return String(s == null ? '' : s)
        .replace(/[İIı]/g, 'i')
        .toLowerCase()
        .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
        .replace(/\s+/g, ' ').trim();
}

/* Sinifin ogrencileri + misafirler. */
function llTakimListe() {
    var liste = [];
    try {
        var st = (data && data.levels && data.levels[curLId] && data.levels[curLId].classes[curCId])
            ? (data.levels[curLId].classes[curCId].students || []) : [];
        st.forEach(function (s, i) {
            var no = (s.numara == null || s.numara === '') ? null : String(s.numara).trim();
            liste.push({ ad: (s.name || ('Öğrenci ' + (i + 1))), sira: i + 1, okul: no || null, misafir: false });
        });
    } catch (e) { }
    LL_TAKIM.misafir.forEach(function (ad) {
        liste.push({ ad: ad, sira: null, okul: null, misafir: true });
    });
    return liste;
}

function llTakimDisMi(ad) { return LL_TAKIM.disarida.indexOf(llTakimNorm(ad)) >= 0; }

function llTakimAktif() {
    return llTakimListe().filter(function (k) { return !llTakimDisMi(k.ad); });
}

/* Kartlarda numara rozetinde ne yazacak? */
function llTakimNoMetin(k) {
    if (LL_TAKIM.etiket === 'sira' && k.sira) return String(k.sira);
    if (LL_TAKIM.etiket === 'okul' && k.okul) return String(k.okul);
    return '';
}

/* --- Akordiyon: ayni anda tek bolum acik. Secim cihazda saklanir,
       sinif degistirince sifirlanmaz (sinif bazli degil, kullanici tercihi). --- */
function llTakimAcikOku() {
    try { var v = localStorage.getItem('kidef_takim_acik'); if (v !== null) return v; } catch (e) { }
    return '2';   // varsayilan: Katilimcilar acik gelsin
}
function llTakimKatlaUygula() {
    var yeni = String(LL_TAKIM.acik == null ? '' : LL_TAKIM.acik);
    document.querySelectorAll('#llAracTakim .tk-blok').forEach(function (b) {
        var ac = (b.getAttribute('data-tkblok') === yeni);
        b.classList.toggle('acik', ac);
        var tus = b.querySelector('.tk-baslik');
        if (tus) tus.setAttribute('aria-expanded', ac ? 'true' : 'false');
    });
}
function llTakimKatla(no) {
    var hedef = String(no);
    LL_TAKIM.acik = (String(LL_TAKIM.acik) === hedef) ? '' : hedef;   // ayni basliga tekrar basinca kapanir
    llTakimKatlaUygula();
    try { localStorage.setItem('kidef_takim_acik', LL_TAKIM.acik); } catch (e) { }
}
/* Bir bolumu ZORLA acar (icerideki bir uyari o bolumu isaret ediyorsa). */
function llTakimAc(no) {
    if (String(LL_TAKIM.acik) === String(no)) return;
    LL_TAKIM.acik = String(no);
    llTakimKatlaUygula();
    try { localStorage.setItem('kidef_takim_acik', LL_TAKIM.acik); } catch (e) { }
}

function llTakimUyar(mesaj, iyi) {
    var el = document.getElementById('llTakimUyari');
    if (!el) { if (mesaj) console.warn(mesaj); return; }
    if (!mesaj) { el.style.display = 'none'; el.textContent = ''; return; }
    el.className = 'tk-uyari' + (iyi ? ' iyi' : '');
    el.textContent = mesaj;
    el.style.display = 'block';
}

/* --- Katilimci seridi --- */
function llTakimCiz() {
    var kap = document.getElementById('llTakimKatilim');
    if (!kap) return;
    llTakimYukle();

    if (LL_TAKIM.acik === undefined) LL_TAKIM.acik = llTakimAcikOku();
    llTakimKatlaUygula();

    document.querySelectorAll('#llAracTakim .tk-mod').forEach(function (b) {
        b.classList.toggle('aktif', b.getAttribute('data-tkmod') === LL_TAKIM.etiket);
    });
    var ozet1 = document.getElementById('llTakimOzet1');
    if (ozet1) ozet1.textContent = { isim: 'İsim', sira: 'Sıra No', okul: 'Okul No' }[LL_TAKIM.etiket] || 'İsim';

    var liste = llTakimListe();
    var h = '';
    liste.forEach(function (k) {
        var dis = llTakimDisMi(k.ad);
        var no = llTakimNoMetin(k);
        h += '<span class="tk-cip' + (dis ? ' yok' : '') + (k.misafir ? ' misafir' : '') + '"' +
            ' data-tkad="' + behKacis(k.ad) + '" role="button" tabindex="0"' +
            ' title="' + (dis ? 'Katılmıyor — eklemek için tıkla' : 'Katılıyor — çıkarmak için tıkla') + '">' +
            (no ? '<b class="tk-no">' + behKacis(no) + '</b>' : '') +
            '<span class="tk-ad">' + behKacis(k.ad) + '</span>' +
            (k.misafir ? '<i class="tk-sil" data-tksil="' + behKacis(k.ad) + '" title="Misafiri kaldır">×</i>' : '') +
            '</span>';
    });
    kap.innerHTML = h || '<div class="tk-bos">Bu sınıfta öğrenci yok. Aşağıdan misafir oyuncu ekleyerek de takım kurabilirsin.</div>';

    if (!kap._tkBagli) {
        kap._tkBagli = true;
        kap.addEventListener('click', function (e) {
            var sil = e.target.closest ? e.target.closest('[data-tksil]') : null;
            if (sil) { e.stopPropagation(); llTakimMisafirSil(sil.getAttribute('data-tksil')); return; }
            var cip = e.target.closest ? e.target.closest('[data-tkad]') : null;
            if (cip) llTakimKatilimDegis(cip.getAttribute('data-tkad'));
        });
        kap.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var cip = e.target.closest ? e.target.closest('[data-tkad]') : null;
            if (cip) { e.preventDefault(); llTakimKatilimDegis(cip.getAttribute('data-tkad')); }
        });
    }

    var sayac = document.getElementById('llTakimSayac');
    if (sayac) {
        var akt = llTakimAktif();
        var mis = akt.filter(function (k) { return k.misafir; }).length;
        var ogr = akt.length - mis;
        sayac.textContent = akt.length + ' katılımcı' + (mis ? ' · ' + ogr + ' öğrenci + ' + mis + ' misafir' : '');
    }
}

function llTakimKatilimDegis(ad) {
    var n = llTakimNorm(ad);
    var i = LL_TAKIM.disarida.indexOf(n);
    if (i >= 0) LL_TAKIM.disarida.splice(i, 1); else LL_TAKIM.disarida.push(n);
    llTakimKaydet(); llTakimCiz(); llTakimUyar('');
}
function llTakimHepsi(katil) {
    if (katil) LL_TAKIM.disarida = [];
    else LL_TAKIM.disarida = llTakimListe().map(function (k) { return llTakimNorm(k.ad); });
    llTakimKaydet(); llTakimCiz(); llTakimUyar('');
}
function llTakimEtiketSec(t) {
    LL_TAKIM.etiket = (t === 'sira' || t === 'okul') ? t : 'isim';
    llTakimKaydet(); llTakimCiz();
    if (LL_TAKIM.sonTakim) llTakimYaz(LL_TAKIM.sonTakim, LL_TAKIM.sonAd);
    if (LL_TAKIM.etiket === 'okul') {
        var eksik = llTakimListe().filter(function (k) { return !k.misafir && !k.okul; }).length;
        if (eksik) { llTakimUyar(eksik + ' öğrencinin okul numarası boş. Öğrenciler sekmesindeki "Okul No" sütunundan girebilirsin.'); return; }
    }
    llTakimUyar('');
}

/* --- Misafir oyuncular --- */
function llTakimMisafirEkle() {
    var g = document.getElementById('llTakimMisafirAd');
    if (!g) return;
    var ham = String(g.value || '').trim();
    if (!ham) { llTakimUyar('Önce misafir oyuncunun adını yaz.'); g.focus(); return; }
    var eklendi = llTakimMisafirKat(ham.split(/[,;\n]/));
    g.value = '';
    llTakimCiz();
    llTakimUyar(eklendi.length ? (eklendi.length + ' misafir oyuncu eklendi: ' + eklendi.join(', ')) : 'Bu isim(ler) zaten listede.', !!eklendi.length);
    g.focus();
}
/* Dizi halinde misafir ekler, gercekten eklenenleri dondurur. */
function llTakimMisafirKat(adlar) {
    var eklendi = [];
    var varOlan = llTakimListe().map(function (k) { return llTakimNorm(k.ad); });
    (adlar || []).forEach(function (a) {
        a = String(a || '').replace(/\s+/g, ' ').trim().slice(0, 40);
        if (!a) return;
        var n = llTakimNorm(a);
        if (!n || varOlan.indexOf(n) >= 0) return;
        varOlan.push(n);
        LL_TAKIM.misafir.push(a);
        eklendi.push(a);
        var d = LL_TAKIM.disarida.indexOf(n);
        if (d >= 0) LL_TAKIM.disarida.splice(d, 1);
    });
    if (eklendi.length) llTakimKaydet();
    return eklendi;
}
function llTakimMisafirSil(ad) {
    var n = llTakimNorm(ad);
    LL_TAKIM.misafir = LL_TAKIM.misafir.filter(function (a) { return llTakimNorm(a) !== n; });
    var d = LL_TAKIM.disarida.indexOf(n);
    if (d >= 0) LL_TAKIM.disarida.splice(d, 1);
    llTakimKaydet(); llTakimCiz(); llTakimUyar('');
}

/* --- Eslestirme: jeton -> katilimci --- */
function llTakimEslestir(jeton, liste) {
    var s = String(jeton || '').trim();
    if (!s) return null;

    if (/^\d+$/.test(s)) {
        var n = parseInt(s, 10);
        var oncelik = (LL_TAKIM.etiket === 'okul') ? ['okul', 'sira'] : ['sira', 'okul'];
        for (var a = 0; a < oncelik.length; a++) {
            for (var i = 0; i < liste.length; i++) {
                var k = liste[i];
                if (oncelik[a] === 'okul' && k.okul != null && parseInt(k.okul, 10) === n) return k;
                if (oncelik[a] === 'sira' && k.sira != null && k.sira === n) return k;
            }
        }
        return null;
    }

    var nn = llTakimNorm(s);
    if (!nn) return null;
    var tam = null, bas = null, ic = null;
    liste.forEach(function (k) {
        var kn = llTakimNorm(k.ad);
        if (kn === nn) { if (!tam) tam = k; return; }
        if (kn.indexOf(nn) === 0) { if (!bas) bas = k; return; }
        if (kn.indexOf(nn) >= 0) { if (!ic) ic = k; return; }
        var pr = kn.split(' '), qr = nn.split(' ');
        var uyar = qr.length > 0 && qr.every(function (q, qi) { return pr[qi] && pr[qi].indexOf(q) === 0; });
        if (uyar && !bas) bas = k;
    });
    return tam || bas || ic || null;
}

/* --- Rastgele dagitim (round-robin: takimlar en fazla 1 kisi farkeder) --- */
function llTakimRastgele(secim) {
    llTakimYukle();
    var akt = llTakimAktif();
    if (!akt.length) {
        llTakimUyar('Katılımcı yok. Sınıfa öğrenci ekle ya da aşağıdan misafir oyuncu tanımla.');
        llTakimYaz([], null); return;
    }
    var havuz = akt.slice();
    for (var i = havuz.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = havuz[i]; havuz[i] = havuz[j]; havuz[j] = t;
    }
    var adet = secim.sayi
        ? Math.max(1, Math.min(secim.sayi, havuz.length))
        : Math.max(1, Math.ceil(havuz.length / Math.max(1, secim.boyut)));
    var takimlar = [];
    for (var k = 0; k < adet; k++) takimlar.push([]);
    havuz.forEach(function (u, idx) { takimlar[idx % adet].push(u); });
    LL_TAKIM.son = secim;
    llTakimUyar('');
    llTakimYaz(takimlar, null, true);
}

/* Eski imza korundu: takim BUYUKLUGUNE gore rastgele dagitim. */
function createTeams(size) { llTakimRastgele({ boyut: parseInt(size, 10) || 2 }); }
/* Takim SAYISINA gore rastgele dagitim. */
function llTakimSayiIle(n) { llTakimRastgele({ sayi: parseInt(n, 10) || 2 }); }

function llTakimKaristir() {
    if (LL_TAKIM.son && LL_TAKIM.son.elle) { llTakimElle(); return; }
    if (LL_TAKIM.son) { llTakimRastgele(LL_TAKIM.son); return; }
    llTakimRastgele({ boyut: 2 });
}

/* --- Elle / hizli takim: her satir bir takim; "|" ayni satirda boler --- */
function llTakimElleCozumle(metin) {
    var liste = llTakimListe();
    var takimlar = [], adlar = [], yeniMisafir = [], bulunmayanNo = [];

    var parcalar = [];
    String(metin || '').split(/\r?\n/).forEach(function (satir) {
        satir.split('|').forEach(function (p) { if (p.trim()) parcalar.push(p.trim()); });
    });

    parcalar.forEach(function (p) {
        var takimAdi = '';
        var iki = p.match(/^([^:]{1,28}):([\s\S]*)$/);
        if (iki && !/^[\s\d.,;-]+$/.test(iki[1])) { takimAdi = iki[1].trim(); p = iki[2]; }

        var jeton = (/[,;]/.test(p)) ? p.split(/[,;]/) : p.trim().split(/\s+/);

        var uyeler = [];
        jeton.forEach(function (j) {
            j = String(j || '').trim();
            if (!j) return;
            var ara = j.match(/^(\d+)\s*[-–]\s*(\d+)$/);   // 1-6 araligi
            var jetonlar = [j];
            if (ara) {
                jetonlar = [];
                var b = parseInt(ara[1], 10), s = parseInt(ara[2], 10), yon = (b <= s) ? 1 : -1;
                for (var v = b; (yon > 0 ? v <= s : v >= s) && jetonlar.length < 200; v += yon) jetonlar.push(String(v));
            }
            jetonlar.forEach(function (jj) {
                var bul = llTakimEslestir(jj, liste);
                if (!bul) {
                    if (/^\d+$/.test(jj)) { if (bulunmayanNo.indexOf(jj) < 0) bulunmayanNo.push(jj); return; }
                    bul = { ad: jj.slice(0, 40), sira: null, okul: null, misafir: true };
                    liste.push(bul);
                    if (yeniMisafir.indexOf(bul.ad) < 0) yeniMisafir.push(bul.ad);
                }
                if (uyeler.indexOf(bul) < 0) uyeler.push(bul);
            });
        });
        if (uyeler.length) { takimlar.push(uyeler); adlar.push(takimAdi); }
    });

    return { takimlar: takimlar, adlar: adlar, yeniMisafir: yeniMisafir, bulunmayanNo: bulunmayanNo };
}

function llTakimElle() {
    llTakimYukle();
    var kutu = document.getElementById('llTakimHizli');
    var metin = kutu ? String(kutu.value || '') : '';
    if (!metin.trim()) {
        llTakimUyar('Kutuya takımları yaz. Örnek: "1 3 5 | 2 4 6" ya da her satıra bir takım.');
        if (kutu) kutu.focus();
        return;
    }
    var c = llTakimElleCozumle(metin);
    if (!c.takimlar.length) { llTakimUyar('Hiçbir takım okunamadı. Numaraları boşluk/virgülle ayır.'); return; }

    if (c.yeniMisafir.length) llTakimMisafirKat(c.yeniMisafir);

    /* Kurulan takimlarda yer alan herkes otomatik olarak katilimci sayilir. */
    c.takimlar.forEach(function (t) {
        t.forEach(function (u) {
            var d = LL_TAKIM.disarida.indexOf(llTakimNorm(u.ad));
            if (d >= 0) LL_TAKIM.disarida.splice(d, 1);
        });
    });
    llTakimKaydet();

    LL_TAKIM.son = { elle: metin };
    llTakimCiz();
    llTakimYaz(c.takimlar, c.adlar, true);

    var notlar = [];
    if (c.yeniMisafir.length) notlar.push('Listede olmayan ' + c.yeniMisafir.length + ' oyuncu misafir olarak eklendi: ' + c.yeniMisafir.join(', '));
    if (c.bulunmayanNo.length) notlar.push('Karşılığı bulunmayan numara: ' + c.bulunmayanNo.join(', '));
    llTakimUyar(notlar.join(' · '), !c.bulunmayanNo.length);
}

/* --- Sonuc kartlari --- */
function llTakimYaz(takimlar, adlar, kaydir) {
    var kap = document.getElementById('teamContainer');
    if (!kap) return;
    var arac = document.getElementById('llTakimArac');
    if (!takimlar || !takimlar.length) {
        kap.innerHTML = '';
        if (arac) arac.style.display = 'none';
        LL_TAKIM.sonTakim = null; LL_TAKIM.sonAd = null;
        return;
    }
    var h = '';
    takimlar.forEach(function (t, i) {
        var baslik = (adlar && adlar[i]) ? adlar[i] : ('Takım ' + (i + 1));
        h += '<div class="team-card"><div class="team-title">' + behKacis(baslik) +
            ' <em class="tm-adet">' + t.length + '</em></div>';
        t.forEach(function (u) {
            var no = llTakimNoMetin(u);
            h += '<div class="team-member">' +
                (no ? '<b class="tm-no">' + behKacis(no) + '</b>' : '') +
                '<span>' + behKacis(u.ad) + '</span>' +
                (u.misafir ? '<i class="tm-misafir" title="Listede olmayan oyuncu">misafir</i>' : '') +
                '</div>';
        });
        h += '</div>';
    });
    kap.innerHTML = h;
    LL_TAKIM.sonTakim = takimlar;
    LL_TAKIM.sonAd = adlar || null;
    if (arac) arac.style.display = '';

    /* Akordiyon acikken kartlar ekranin altinda kalabiliyor: gerekiyorsa getir. */
    if (kaydir) {
        try {
            var r = kap.getBoundingClientRect();
            if (r.top > window.innerHeight - 90) kap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) { }
    }
}

function llTakimMetin() {
    if (!LL_TAKIM.sonTakim) return '';
    return LL_TAKIM.sonTakim.map(function (t, i) {
        var baslik = (LL_TAKIM.sonAd && LL_TAKIM.sonAd[i]) ? LL_TAKIM.sonAd[i] : ('Takım ' + (i + 1));
        return baslik + '\n' + t.map(function (u) {
            var no = llTakimNoMetin(u);
            return '  - ' + (no ? no + '. ' : '') + u.ad + (u.misafir ? ' (misafir)' : '');
        }).join('\n');
    }).join('\n\n');
}

function llTakimKopyala() {
    var metin = llTakimMetin();
    if (!metin) { llTakimUyar('Önce takımları kur.'); return; }
    var bitir = function (ok) { llTakimUyar(ok ? 'Takımlar panoya kopyalandı.' : 'Kopyalanamadı — metni elle seçebilirsin.', ok); };
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(metin).then(function () { bitir(true); }, function () { bitir(false); });
            return;
        }
    } catch (e) { }
    try {
        var ta = document.createElement('textarea');
        ta.value = metin; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        bitir(ok);
    } catch (e2) { bitir(false); }
}

function clearTeams() {
    LL_TAKIM.son = null;
    llTakimYaz([], null);
    llTakimUyar('');
}

window.llTakimCiz = llTakimCiz;
window.llTakimKatla = llTakimKatla;
window.llTakimAc = llTakimAc;
window.llTakimEtiketSec = llTakimEtiketSec;
window.llTakimKatilimDegis = llTakimKatilimDegis;
window.llTakimHepsi = llTakimHepsi;
window.llTakimMisafirEkle = llTakimMisafirEkle;
window.llTakimMisafirSil = llTakimMisafirSil;
window.llTakimSayiIle = llTakimSayiIle;
window.llTakimKaristir = llTakimKaristir;
window.llTakimElle = llTakimElle;
window.llTakimKopyala = llTakimKopyala;
window.createTeams = createTeams;
window.clearTeams = clearTeams;

    // --- YARDIMCI FONKSİYONLAR ---
    function formatMs(ms) {
        let date = new Date(ms);
        let m = String(date.getUTCMinutes()).padStart(2, '0');
        let s = String(date.getUTCSeconds()).padStart(2, '0');
        let cs = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
        return `${m}:${s}:${cs}`;
    }

    // İlk Çalıştırma
    if(typeof renderSidebar === 'function') renderSidebar();

    // ==========================================
    // SAYFA YÜKLENDİĞİNDE ÇALIŞACAKLAR
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
       
    });
function llToggleSidebar() {
    var r = llRootEl();
    /* Ok/eski tuslarla ACILIYORSA kurum filtresi sifirlanir: tam liste gorunur. */
    if (r.classList.contains('sidebar-closed') && window.llKurumFiltre != null) {
        window.llKurumFiltre = null;
        try { if (typeof renderSidebar === 'function') renderSidebar(); } catch (e) { }
    }
    r.classList.toggle('sidebar-closed');
    window.dispatchEvent(new Event('resize'));
}

/* Perdeyi belirli bir kurum suzgeciyle ac (null = tum liste).
   '' (bos) = Genel (kurumsuz seviyeler). */
window.llKurumFiltre = null;
function llPerdeAc(kurumFiltre) {
    window.llKurumFiltre = (kurumFiltre === undefined) ? null : kurumFiltre;
    try { if (typeof renderSidebar === 'function') renderSidebar(); } catch (e) { }
    llRootEl().classList.remove('sidebar-closed');
    window.dispatchEvent(new Event('resize'));
}
window.llPerdeAc = llPerdeAc;

/* Sekme cubugundaki SINIF ROZETINE tiklaninca: acik sinifin KURUMUYLA
   suzulmus liste iner — yalniz o kurumun seviye ve siniflari. */
function llRozetPerdeAc() {
    var f = null;
    try {
        if (typeof curLId !== 'undefined' && curLId && data && data.levels && data.levels[curLId]) {
            var k = data.levels[curLId].kurumId;
            f = (k && data.kurumlar && data.kurumlar[k]) ? k : '';
        }
    } catch (e) { }
    llPerdeAc(f);
}
window.llRozetPerdeAc = llRozetPerdeAc;

/* ======================================================================
   OKUL POPUP — sinif rozetine tiklaninca acilan kurum/sinif haritasi.
   Her kurum bir OKUL BINASI olarak cizilir: catida bayrak, tabelada
   kurum adi, her seviye bir KAT, siniflar katin KAPILARI. Cok seviyesi/
   sinifi olan kurumun binasi BUYUR. "Genel" seviyeler gri binada.
   ====================================================================== */
function llOkulPopupAc() {
    llOkulPopupKapat();
    /* BASLIKTAKI OKUL TUSU = LISTEYE DON. Ogretmen anasayfaya gidip bir
       kart actiktan sonra bu tusa basinca yalnizca pencere aciliyor, arkada
       sinif listesi kapali kaliyordu. Artik once Listelerim gorunumune
       donulur ve en son acik olan sinif geri acilir; pencere onun ustune
       gelir, kapatilinca liste acik durur. */
    try {
        if (typeof appState !== 'undefined' && appState.currentView !== 'listelerim-section' &&
            typeof changeView === 'function') {
            changeView('listelerim-section');
            try { initListelerim(); } catch (e) { }
        }
        setTimeout(function () { try { llSonSinifAcBekle(); } catch (e) { } }, 120);
    } catch (e) { }
    /* VERI HENUZ YUKLENMEMIS OLABILIR. Basliktaki okul tusuna, siteye yeni
       girilip Listelerim'e hic ugranmadan basilirsa "data" bos oluyordu ve
       pencere sessizce hic acilmiyordu. Artik:
         1) once yerel kopya denenir,
         2) yoksa bos bir yapiyla pencere YINE DE acilir (kullanici en
            azindan "+ Kurum Ekle" gorur),
         3) girisli kullanici icin bulut yuklemesi tetiklenir; veri gelince
            pencere hala aciksa kendini tazeler.
       Boylece tus her durumda bir sey yapar. */
    if (typeof data === 'undefined' || !data) {
        try { if (typeof loadDataFromLocal === 'function') loadDataFromLocal(); } catch (e) { }
    }
    if (typeof data === 'undefined' || !data) data = { levels: {}, levelOrder: [], kurumlar: {} };
    if (!data.levels) data.levels = {};
    var _bosMu = !Object.keys(data.levels).length && !Object.keys(data.kurumlar || {}).length;
    if (_bosMu && !window._llOkulTazeleniyor) {
        try {
            var _u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
            if (_u && typeof initListelerim === 'function') {
                window._llOkulTazeleniyor = true;
                initListelerim();
                /* SABIT 1200 ms YETMIYORDU: bulut okumasi bazen daha uzun
                   suruyor, o zaman pencere bos kaliyor ve ogretmen "once
                   profile girmem gerekiyor" saniyordu. Artik veri gelene
                   kadar kisa araliklarla BEKLENIR (en cok ~8 sn). */
                var _dene = 0;
                var _bekle = setInterval(function () {
                    _dene++;
                    var geldi = data && (Object.keys(data.levels || {}).length || Object.keys(data.kurumlar || {}).length);
                    var acik = !!document.getElementById('llOkulPopup');
                    if (!acik || geldi || _dene > 26) {
                        clearInterval(_bekle);
                        window._llOkulTazeleniyor = false;
                        if (acik && geldi) llOkulPopupAc();
                    }
                }, 300);
            }
        } catch (e) { }
    }
    var kurumlar = data.kurumlar || {};
    var levelIds = data.levelOrder || Object.keys(data.levels);
    var gruplar = {};
    levelIds.forEach(function (lId) {
        var lvl = data.levels[lId]; if (!lvl) return;
        var g = (lvl.kurumId && kurumlar[lvl.kurumId]) ? lvl.kurumId : '';
        (gruplar[g] = gruplar[g] || []).push(lId);
    });
    var katYap = function (lId) {
        var lvl = data.levels[lId];
        var kapilar = '';
        var cIds = lvl.classes ? Object.keys(lvl.classes) : [];
        cIds.forEach(function (cId) {
            var aktif = (typeof curLId !== 'undefined' && lId === curLId && typeof curCId !== 'undefined' && cId === curCId);
            kapilar += '<button type="button" class="okul-kapi' + (aktif ? ' aktif' : '') + '"' +
                ' onclick="llOkulSinifSec(\'' + lId + '\',\'' + cId + '\')">' + behKacis(lvl.classes[cId].name) + '</button>';
        });
        if (!kapilar) kapilar = '<span class="okul-bos">sınıf yok</span>';
        /* SEVIYE AYARLARI: bu pencere eskiden yalniz sinif secmeye yariyordu;
           ayarlara ulasmak icin profildeki okul haritasina gitmek gerekiyordu.
           Artik her seviyenin isminin yaninda dislisi var — hem sinif adi
           rozetinden hem sekme cubugundaki OKUL tusundan ayni yere ulasilir.
           Pencere once kapanir ki ayar penceresi ustte kalsin. */
        var ayarTus = '<span class="okul-kat-tus">' +
            '<button type="button" class="okul-mtus" title="Seviye ayarları (dersler, ağırlıklar, dönemler)"' +
            ' onclick="llOkulSeviyeAyar(\'' + lId + '\')">' + llIcon('ayar') + '</button></span>';
        /* animasyonlu SINIF ikonu SADECE kat (seviye) basliginda; kapilarda ikon yok */
        return '<div class="okul-kat"><span class="okul-kat-ad" title="' + behKacis(lvl.name) + '">' +
            llIcon('sinif') + '<span class="okul-kat-yazi">' + behKacis(lvl.name) + '</span></span>' +
            ayarTus +
            '<span class="okul-kapilar">' + kapilar + '</span></div>';
    };
    var binaYap = function (ad, uyeler, genelMi) {
        var toplamSinif = 0;
        uyeler.forEach(function (lId) { toplamSinif += Object.keys((data.levels[lId] && data.levels[lId].classes) || {}).length; });
        var buyuk = (uyeler.length >= 4 || toplamSinif >= 10) ? ' buyuk' : '';
        var katlar = '';
        uyeler.forEach(function (lId) { katlar += katYap(lId); });
        if (!katlar) katlar = '<div class="okul-kat"><span class="okul-bos">Bu kurumda henüz seviye yok</span></div>';
        var pencere = '<svg class="okul-pencere" viewBox="0 0 20 16" aria-hidden="true" focusable="false">' +
            '<rect x="0.6" y="0.6" width="18.8" height="14.8" rx="2" fill="#CFE7F5" stroke="#8FB8D4" stroke-width="1.2"/>' +
            '<path d="M10 1.2v13.6M1.2 8h17.6" stroke="#8FB8D4" stroke-width="1.1"/></svg>';
        return '<div class="okul-bina' + (genelMi ? ' genel' : '') + buyuk + '">' +
            '<svg class="okul-bayrak" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                '<line x1="12" y1="2.4" x2="12" y2="11" stroke="#7f8c8d" stroke-width="1.6"/>' +
                '<path class="li-bayrakcik" d="M12.6 2.8h7l-1.7 2.5 1.7 2.5h-7z" fill="#e74c3c"/></svg>' +
            '<svg class="okul-cati" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
                '<path d="M50 0 L98 18 H2 Z" fill="' + (genelMi ? '#78909C' : '#C0392B') + '"/>' +
                '<path d="M50 0 L98 18 H88 L50 3.6 L12 18 H2 Z" fill="rgba(255,255,255,.14)"/></svg>' +
            '<div class="okul-sacak"></div>' +
            '<div class="okul-tabela"><svg class="okul-kep" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                '<path d="M2 9.4L12 4.6l10 4.8-10 4.8z" fill="#F1C40F"/>' +
                '<path d="M6.4 12.4v3.4c0 1.5 2.6 2.8 5.6 2.8s5.6-1.3 5.6-2.8v-3.4L12 15.2z" fill="#F7DC6F"/>' +
                '<path d="M20.6 10.2v4.6" stroke="#F1C40F" stroke-width="1.3" stroke-linecap="round"/></svg>' +
                '<span>' + behKacis(ad) + '</span></div>' +
            '<div class="okul-govde">' + katlar + '</div>' +
            '<div class="okul-giris">' + pencere +
                '<svg class="okul-kapi-svg" viewBox="0 0 40 32" aria-hidden="true" focusable="false">' +
                    '<path d="M3 32V13a17 13 0 0 1 34 0v19z" fill="#6B4A38"/>' +
                    '<path d="M12.5 9.6a7.5 6 0 0 1 15 0v1.8h-15z" fill="#CFE7F5" stroke="#5D4037" stroke-width="1"/>' +
                    '<rect x="7.6" y="13.4" width="11" height="18.6" rx="1.6" fill="#8B5E3C" stroke="#5D4037" stroke-width="1"/>' +
                    '<rect x="21.4" y="13.4" width="11" height="18.6" rx="1.6" fill="#8B5E3C" stroke="#5D4037" stroke-width="1"/>' +
                    '<circle cx="16.4" cy="23" r="1.2" fill="#F1C40F"/><circle cx="23.6" cy="23" r="1.2" fill="#F1C40F"/></svg>' +
                pencere + '</div>' +
            '<div class="okul-taban"></div>' +
        '</div>';
    };
    var ic = '';
    Object.keys(kurumlar).forEach(function (kId) { ic += binaYap(kurumlar[kId].name, gruplar[kId] || [], false); });
    if (gruplar['']) ic += binaYap('Genel', gruplar[''], true);
    /* HIC KURUM YOKSA: bos bir cumle yerine dogrudan kurulum daveti.
       Ogretmen ilk girisinde bu pencereden isini kurabilsin. */
    if (!ic) ic = '<div class="okul-bosluk">' +
        '<p>Henüz kurum eklenmemiş.</p>' +
        '<button type="button" class="okul-ekle-buyuk" onclick="llOkulKurumEkle()">' +
        '+ Kurum Ekle</button>' +
        '<small>Kurumu ekledikten sonra içine seviye ve sınıf açabilirsin.</small></div>';
    var k = document.createElement('div');
    k.id = 'llOkulPopup';
    k.innerHTML = '<div class="okul-panel">' +
        '<div class="okul-baslik"><strong>Kurumlar &amp; Sınıflar</strong>' +
        '<span class="okul-baslik-tus">' +
        '<button type="button" class="okul-ekle-kucuk" title="Yeni kurum ekle"' +
        ' onclick="llOkulKurumEkle()">+ Kurum</button>' +
        '<button type="button" class="okul-kapat" title="Kapat" onclick="llOkulPopupKapat()">&times;</button>' +
        '</span></div>' +
        '<div class="okul-icerik">' + ic + '</div></div>';
    k.addEventListener('click', function (e) { if (e.target === k) llOkulPopupKapat(); });
    document.body.appendChild(k);
    if (!window._llOkulEsc) {
        window._llOkulEsc = function (e) { if (e.key === 'Escape') llOkulPopupKapat(); };
    }
    document.addEventListener('keydown', window._llOkulEsc);
}
function llOkulPopupKapat() {
    var k = document.getElementById('llOkulPopup');
    if (k) k.remove();
    if (window._llOkulEsc) document.removeEventListener('keydown', window._llOkulEsc);
}
function llOkulSinifSec(lId, cId) {
    llOkulPopupKapat();
    /* Pencere artik sitenin HER YERINDEN acilabiliyor (baslikta okul tusu).
       Listelerim gorunumu acik degilse once oraya gecilmeli; yoksa sinif
       seciliyor ama ekranda hicbir sey degismiyor — "siniflar acilmiyor"
       sikayetinin sebebi buydu. */
    try {
        if (typeof appState !== 'undefined' && appState.currentView !== 'listelerim-section' &&
            typeof changeView === 'function') {
            changeView('listelerim-section');
            try { initListelerim(); } catch (e) { }
        }
    } catch (e) { }
    setTimeout(function () { try { selectClass(lId, cId); } catch (e) { console.warn('sınıf açılamadı:', e && e.message); } }, 0);
}
/* Pencereden yeni kurum ekle; eklendikten sonra pencere yeniden cizilir ki
   yeni kurum aninda gorunsun (bos durumdan cikis da boyle olur). */
function llOkulKurumEkle() {
    try { addKurum(); } catch (e) { console.warn('kurum eklenemedi:', e && e.message); return; }
    llOkulPopupKapat();
    setTimeout(function () { try { llOkulPopupAc(); } catch (e) { } }, 0);
}

/* Okul penceresinden seviye ayarlarini ac: once pencere kapanir, sonra
   ayar penceresi acilir (ikisi ust uste binmesin). */
function llOkulSeviyeAyar(lId) {
    llOkulPopupKapat();
    /* Ayar penceresi Listelerim bolumunun icinde yasiyor; baska bir
       gorunumdeyken acilirsa gorunmez kalir. Once oraya gecilir. */
    try {
        if (typeof appState !== 'undefined' && appState.currentView !== 'listelerim-section' &&
            typeof changeView === 'function') {
            changeView('listelerim-section');
            try { initListelerim(); } catch (e) { }
        }
    } catch (e) { }
    setTimeout(function () {
        try { openLvlConfig(lId); }
        catch (e) { console.warn('seviye ayarları açılamadı:', e && e.message); }
    }, 0);
}
window.llOkulPopupAc = llOkulPopupAc;
window.llOkulPopupKapat = llOkulPopupKapat;
window.llOkulSinifSec = llOkulSinifSec;
window.llOkulSeviyeAyar = llOkulSeviyeAyar;
window.llOkulKurumEkle = llOkulKurumEkle;

/* ======================================================================
   OGRETMEN PROFILI — ogrenci profiliyle AYNI akordiyon sistemi, yalniz
   icerik farkli. #student-profile-section icine cizilir; profil tusuna
   basinca router (renderStudentProfile) ogretmen rolunde buraya yonlenir.
   Kategoriler: Kisisel Bilgilerim / Kurumlarim & Siniflarim /
   Ogretmen Kodum / Bekleyen Istekler / Tatiller / Yonetim.
   ====================================================================== */
function llAkordiyon(id, renk, baslikHtml, icerik, acik) {
    return '<details id="' + id + '" class="glass-card profile-accordion"' + (acik ? ' open' : '') +
        ' style="margin-bottom:25px; border-bottom:4px solid ' + renk + ';">' +
        '<summary style="cursor:pointer; display:flex; align-items:center; gap:8px; color:#16A085;' +
        'font-weight:700; font-size:1.15rem; list-style:none;">' + baslikHtml +
        '<span class="acc-chevron" style="margin-left:auto; color:#16A085; transition:transform 0.2s;">▸</span></summary>' +
        '<div style="margin-top:16px; text-align:left;">' + icerik + '</div></details>';
}
function llRozetHtml(yazi) {
    return '<span style="font-size:0.75rem; font-weight:600; background:#EAF7F3; color:#16A085; padding:3px 10px; border-radius:20px;">' + yazi + '</span>';
}
function renderTeacherProfile(deneme) {
    var sec = document.getElementById('student-profile-section');
    if (!sec) return;

    /* --- 1. KISISEL BILGILERIM (ogrenci kartiyla ayni desen) --- */
    var ad = (window.appState && appState.currentUserName && appState.currentUserName !== 'Belirtilmedi' && appState.currentUserName !== 'Öğrenci') ? appState.currentUserName : '';
    var eposta = (window.appState && appState.currentUser) || '';
    /* appState heniz dolmadiysa isim/e-posta dogrudan oturumdan alinir */
    try {
        var tFu = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
        if (!ad && tFu && tFu.displayName) ad = tFu.displayName;
        if ((!eposta || eposta === 'Misafir Öğrenci' || eposta === 'anonim') && tFu && tFu.email) eposta = tFu.email;
    } catch (e) { }
    var telTam = (window.appState && appState.currentUserPhone) || '';
    var tel = telTam.replace(/^\+90/, '').replace(/\s/g, '');
    var cinsiyet = (window.appState && appState.currentUserGender) || '';
    var telGecerli = /^5[0-9]{9}$/.test(tel);
    var eksik = (!telGecerli || !cinsiyet);
    var fLbl = 'font-size:0.75rem; font-weight:700; color:#16A085; text-transform:uppercase; letter-spacing:0.3px; display:block; margin-bottom:5px;';
    var fBox = 'padding:11px 12px; background:#F7F9FC; border:1px solid #E9EEF5; border-radius:10px; color:#2c3e50; font-size:0.95rem; min-height:20px;';
    var inp = 'width:100%; padding:11px 12px; border:1px solid #E9EEF5; border-radius:10px; font-family:inherit; font-size:0.95rem; box-sizing:border-box; background:#fff;';
    var kisisel =
        '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">' +
            '<div><label style="' + fLbl + '">Ad Soyad</label><div style="' + fBox + '">' + (ad ? behKacis(ad) : '<span style="color:#999;">Belirtilmedi</span>') + '</div></div>' +
            '<div><label style="' + fLbl + '">E-posta</label><div style="' + fBox + '">' + behKacis(eposta) + '</div></div>' +
            '<div><label style="' + fLbl + '">Meslek</label><input id="profile-meslek" type="text" value="Eğitmen" readonly style="' + inp + ' background:#F0F4F8; color:#16A085; font-weight:bold;"></div>' +
            '<div><label style="' + fLbl + '">Telefon <span style="color:#EF5350;">*</span></label>' +
                '<div style="display:flex;">' +
                '<span style="padding:11px 12px; background:#E9EEF5; border:1px solid #E9EEF5; border-radius:10px 0 0 10px; color:#555; font-weight:bold;">+90</span>' +
                '<input id="profile-phone" type="tel" maxlength="10" value="' + behKacis(tel) + '" placeholder="5XX XXX XX XX" style="' + inp + ' border-radius:0 10px 10px 0; border-left:none;"></div></div>' +
            '<div><label style="' + fLbl + '">Cinsiyet <span style="color:#EF5350;">*</span></label>' +
                '<select id="profile-gender" style="' + inp + '">' +
                '<option value=""' + (cinsiyet === '' ? ' selected' : '') + '>Seçiniz…</option>' +
                '<option value="erkek"' + (cinsiyet === 'erkek' ? ' selected' : '') + '>Erkek</option>' +
                '<option value="kadin"' + (cinsiyet === 'kadin' ? ' selected' : '') + '>Kadın</option>' +
                '</select></div>' +
        '</div>' +
        '<div style="display:flex; align-items:center; gap:14px; margin-top:16px; flex-wrap:wrap;">' +
            '<button onclick="saveMyProfileInfo()" style="padding:11px 22px; border:none; border-radius:10px; background:#16A085; color:#fff; font-weight:700; cursor:pointer; font-family:inherit; font-size:0.95rem;">Bilgilerimi Kaydet</button>' +
            '<span id="profile-info-status" style="font-size:0.9rem; min-height:16px;"></span>' +
        '</div>' +
        (eksik ? '<div style="margin-top:14px; padding:11px 14px; background:#FEF3E2; border:1px solid #F39C12; border-radius:10px; color:#B9770E; font-size:0.9rem;">⚠️ Telefon ve/veya cinsiyet bilginiz eksik ya da hatalı. Lütfen güncelleyip kaydedin.</div>' : '');

    /* OGRETMEN KODU + BEKLEYEN ISTEKLER artik Kisisel Bilgilerim'in ICINDE */
    var altCizgi = 'margin:22px 0 10px; padding-top:16px; border-top:1px dashed #E9EEF5; font-weight:700; color:#16A085; font-size:1.02rem;';
    var tKod = '';
    try { tKod = localStorage.getItem('teacher_static_code') || ''; } catch (e) { }
    kisisel += '<div style="' + altCizgi + '">🎫 Öğretmen Kodum</div>' +
        (tKod
            ? '<p style="margin:0 0 12px; color:#666; font-size:0.92rem;">Öğrencilerin bu kodla sana bağlanır (kayıt olurken ya da profillerindeki "Öğretmene Bağlan" bölümünden):</p>' +
              '<div style="display:inline-block; padding:12px 26px; background:#FFF8F2; border:2px dashed #E67E22; border-radius:12px;' +
              ' font-size:1.35rem; font-weight:800; letter-spacing:1.5px; color:#D84315; font-family:\'Nunito\', sans-serif;">' + behKacis(tKod) + '</div>'
            : '<p style="margin:0; color:#999;">Kod henüz oluşmadı — sınıf listen açıldığında otomatik oluşur.</p>');
    kisisel += '<div style="' + altCizgi + '">🔔 Bekleyen İstekler</div>' +
        '<p style="margin:0 0 12px; color:#666; font-size:0.92rem;">Hesabını sınıfına bağlamak isteyen öğrencilerin istekleri:</p>' +
        '<button type="button" onclick="llProfilIslem(\'istek\')" style="padding:11px 22px; border:none; border-radius:10px;' +
        ' background:#4facfe; color:#fff; font-weight:700; cursor:pointer; font-family:inherit;">İstekleri Gör</button>';

    /* HER ZAMAN KAPALI baslar (en altta) — uyari varsa acilinca gorunur */
    /* SITE ERISIM KILIDI — yalniz YONETICI gorur (kilit.js saglar) */
    var kilitAkordiyon = (appState.userRole === 'admin' && typeof window.kilitPanelHtml === 'function')
        ? llAkordiyon('tpKilit', '#7B241C', '<span>🔐 Site Erişim Kilidi</span>', window.kilitPanelHtml(), false)
        : '';
    var kisiselAkordiyon = llAkordiyon('tpKisisel', '#F39C12',
        '<span>👤 Kişisel Bilgilerim</span>' + llRozetHtml('Öğretmen') +
        (eksik ? '<span style="font-size:0.75rem; font-weight:600; background:#FEF3E2; color:#B9770E; padding:3px 10px; border-radius:20px;">⚠️ eksik bilgi</span>' : ''),
        kisisel, false);

    /* --- VELI & DURUM TARAMASI ---
       Eskiden sinif seridinde ayri bir sekmeydi (#tab10). Artik profilde,
       "Kisisel Bilgilerim"in hemen ALTINDA. Icerik akordiyon ilk acildiginda
       renderTarama() ile doldurulur (tembel cizim: kapaliyken tablo kurulmaz). */
    var taramaIc =
        '<div id="tpTaramaKutu">' +
            '<p class="tarama-aciklama">Tüm seviyelerdeki bütün sınıflar taranır. Bir ölçüt seçin; uyan öğrenciler liste hâlinde çıkar.</p>' +
            '<input type="search" class="tarama-arama" placeholder="İsim, sınıf, seviye veya meslek ara…"' +
            ' value="' + behKacis(window.taramaAramaHam || '') + '" oninput="taramaAramaDegisti(this)">' +
            '<div id="taramaCipler" class="tarama-cipler"></div>' +
            '<div id="taramaOzet" class="tarama-ozet"></div>' +
            '<div id="taramaSonuc"></div>' +
        '</div>';
    /* Profil arada bir kendini yeniden cizer (tpTazele / veri yenilenmesi).
       Tarama acikken bu, akordiyonu kapatip sonuclari silmesin. */
    var taramaAcikti = false;
    try { var _tv = document.getElementById('tpTarama'); taramaAcikti = !!(_tv && _tv.open); } catch (e) { }
    var taramaAkordiyon = llAkordiyon('tpTarama', '#34495e',
        '<span>🔎 Veli &amp; Durum Taraması</span>' + llRozetHtml('tüm sınıflar'), taramaIc, taramaAcikti);

    /* Tatil takvimi akordiyonu (dogrudan gomulu icerik) */
    var tatilIc = llTatilIcerikHtml();
    if (!tatilIc) {
        tatilIc = '<button type="button" onclick="llProfilIslem(\'tatil\')" style="padding:11px 22px; border:none;' +
            ' border-radius:10px; background:#9b59b6; color:#fff; font-weight:700; cursor:pointer; font-family:inherit;">Tatilleri Aç</button>';
    }
    var tatilAkordiyon = llAkordiyon('tpTatil', '#9b59b6', '<span>🏖 Tatiller</span>', tatilIc, false);

    var html = '';

    /* --- BILDIRIM: ogrenci gorev tamamlayinca profilin tepesinde serit --- */
    var yb = window._gvYeniSonuc;
    if (yb && ((yb.n || 0) + (yb.etk || 0)) > 0) {
        var sonYazi = '';
        if (yb.son) {
            /* Ogrenci ISMI one cikar (ad varsa; yoksa e-posta) */
            var kisi = yb.son.ad || yb.son.email || '';
            sonYazi = ' Son: <b>' + behKacis(yb.son.baslik || yb.son.oyun || 'Görev') + '</b>' +
                (kisi ? ' — <b style="color:#1E8449;">' + behKacis(kisi) + '</b>' : '') +
                (yb.son.yuzde != null ? ' (%' + behKacis(yb.son.yuzde) + ')' : '') + '.';
        }
        var parcalar = [];
        if (yb.n) parcalar.push(yb.n + ' görev tamamlandı');
        if (yb.etk) parcalar.push(yb.etk + ' yeni etkinlik');
        /* Serit TIKLANABILIR: ilgili ogrencinin sinifinin Etkinlikler
           sekmesine goturur (llBildirimGit). Gordum tusu ayrica durur. */
        html += '<div id="tpBildirim" class="glass-card" onclick="llBildirimGit()" title="Sınıfın Etkinlikler sekmesine git"' +
            ' style="margin-bottom:25px; border-left:5px solid #27AE60;' +
            ' display:flex; align-items:center; gap:14px; flex-wrap:wrap; cursor:pointer;">' +
            '<span style="display:inline-flex; width:40px; height:40px; border-radius:50%; background:#E8F8F0;' +
            ' align-items:center; justify-content:center; font-size:1.35rem; flex:none;">🔔</span>' +
            '<span style="flex:1; min-width:220px; color:#5A4034;"><b style="color:#1E8449;">' + parcalar.join(' · ') + '!</b>' + sonYazi +
            ' <small style="color:#8B6A57;">Tıkla: öğrencinin sınıfında Etkinlikler açılır.</small></span>' +
            '<button type="button" onclick="event.stopPropagation(); llProfilIslem(\'sonucGoruldu\')" style="padding:10px 18px; border:none;' +
            ' border-radius:10px; background:#27AE60; color:#fff; font-weight:700; cursor:pointer; font-family:inherit;">Gördüm</button>' +
            '</div>';
    }

    /* --- 2. KURUMLARIM & SINIFLARIM --- */
    /* ONEMLI: data, listelerim.js icinde "let" ile tanimli oldugundan
       window.data YOKTUR — cipla isimle erisilmeli. Ayrica profil,
       Listelerim hic acilmadan geldiyse bulut verisini ceken
       initListelerim BIR KEZ tetiklenir ve profil tazelenir. */
    if (!window._llProfilInit) {
        window._llProfilInit = 1;
        try { if (typeof initListelerim === 'function') initListelerim(); } catch (e) { }
        setTimeout(function () {
            try {
                var akt = document.activeElement;
                var s2 = document.getElementById('student-profile-section');
                if (akt && s2 && s2.contains(akt) && (akt.tagName === 'INPUT' || akt.tagName === 'SELECT')) return;
                renderTeacherProfile();
            } catch (e) { }
        }, 1600);
    }
    if (typeof data === 'undefined' || !data || !data.levels) {
        deneme = deneme || 0;
        html += llAkordiyon('tpSiniflar', '#E67E22',
            '<span>🏫 Kurumlarım &amp; Sınıflarım</span>', 'Sınıf verileri yükleniyor…', true);
        sec.innerHTML = html + tatilAkordiyon + kisiselAkordiyon + kilitAkordiyon;
        if (deneme < 10) setTimeout(function () { renderTeacherProfile(deneme + 1); }, 700);
        return;
    }
    /* ==================================================================
       KURUMLARIM & SINIFLARIM — OKUL BINASI TASARIMI
       Her kurum bir okul binasi olarak cizilir: her SEVIYE bir KAT,
       her SINIF o katin KAPISI (koridor). Animasyonlu ikon SADECE kat
       (seviye) basliginda durur — sinif kapilarinda ikon yok.
       "Listeyi Duzenle" tusu EN USTTE; duzenleme islemleri (kat ekle,
       koridordaki + ile sinif ekle, seviye ayarlari, silme) yalnizca
       duzenleme modunda binanin uzerinde belirir. Duzenleme modunda bir
       sinif kapisina tiklaninca BUYUK TUSLU POPUP acilir.
       ================================================================== */
    var kurumlar = data.kurumlar || {};
    var levelIds = data.levelOrder || Object.keys(data.levels);
    var duzen = !!window.llProfilDuzen;   /* duzenleme modu acik mi? */
    if (!duzen) window._tpYeniKat = null; /* duzenleme bitince taslak kat gider */
    var gruplar = {};
    levelIds.forEach(function (lId) {
        var lvl = data.levels[lId]; if (!lvl) return;
        var g = (lvl.kurumId && kurumlar[lvl.kurumId]) ? lvl.kurumId : '';
        (gruplar[g] = gruplar[g] || []).push(lId);
    });
    /* kucuk islem tusu (duzenleme modunda gorunur) */
    var mTus = function (ikon, baslik, tik, acikTema) {
        return '<button type="button" class="okul-mtus' + (acikTema ? ' acik' : '') +
            '" title="' + baslik + '" onclick="' + tik + '">' + ikon + '</button>';
    };
    var sinifToplam = 0;

    /* --- bir KAT (seviye) --- */
    var katYap = function (lId) {
        var lvl = data.levels[lId];
        if (!lvl) return '';
        var kapilar = '';
        var cIds = lvl.classes ? Object.keys(lvl.classes) : [];
        cIds.forEach(function (cId) {
            sinifToplam++;
            var tik = duzen ? 'tpSinifPopupAc(\'' + lId + '\',\'' + cId + '\')'
                            : 'llProfilSinifSec(\'' + lId + '\',\'' + cId + '\')';
            kapilar += '<button type="button" class="okul-kapi" onclick="' + tik + '">' +
                behKacis(lvl.classes[cId].name) + '</button>';
        });
        if (!kapilar && !duzen) kapilar = '<span class="okul-bos">sınıf yok</span>';
        /* koridordaki + : seviye adi varsa duzenleme boyunca HEP gorunur */
        if (duzen) kapilar += '<button type="button" class="okul-kapi okul-ekle" title="Bu seviyeye sınıf ekle"' +
            ' onclick="addClass(\'' + lId + '\'); tpTazele();">+</button>';
        var tuslar = duzen
            ? '<span class="okul-kat-tus">' +
              mTus('⚙️', 'Seviye ayarları (dersler, ağırlıklar, dönemler)', 'openLvlConfig(\'' + lId + '\')') +
              mTus('✏️', 'Seviye ismini değiştir', 'editLevelName(\'' + lId + '\'); tpTazele();') +
              mTus('🗄', 'Seviyeyi arşivle', 'seviyeArsivle(\'' + lId + '\'); tpTazele();') +
              mTus('🗑', 'Seviyeyi sil', 'deleteLevel(\'' + lId + '\'); tpTazele();') + '</span>'
            : '';
        /* animasyonlu ikon SADECE burada — seviye (kat) basliginda */
        /* SIRA: [seviye ismi] [seviye ayarlari vb. tuslar] [sinif kapilari]
           Tuslar eskiden satirin en sagindaydi (kapilardan sonra); ayarlarin
           hangi seviyeye ait oldugu uzak kaliyordu. Artik ismin hemen yaninda.
           duzen sinifi: duzenleme modunda isim sutunu icerigi kadar daralir,
           tuslar isme yapisir. */
        return '<div class="okul-kat' + (duzen ? ' duzen' : '') + '"><span class="okul-kat-ad" title="' + behKacis(lvl.name) + '">' +
            llIcon('sinif') + '<span class="okul-kat-yazi">' + behKacis(lvl.name) + '</span></span>' +
            tuslar +
            '<span class="okul-kapilar">' + kapilar + '</span></div>';
    };

    /* --- taslak kat: "Seviye Ekle" basilinca binaya eklenen bos kat --- */
    var taslakKat = function (kId) {
        return '<div class="okul-kat okul-kat-yeni">' +
            '<span class="okul-kat-ad">' + llIcon('sinif') +
            '<input type="text" id="tpKatAd" class="okul-kat-input" placeholder="Seviye adı (örn. 10. Sınıflar)"' +
            ' onkeydown="if(event.key===\'Enter\'){event.preventDefault();tpKatOnayla(\'' + kId + '\');}' +
            'else if(event.key===\'Escape\'){tpKatIptal();}"></span>' +
            '<span class="okul-kapilar">' +
            '<button type="button" class="okul-kapi okul-onay" onclick="tpKatOnayla(\'' + kId + '\')">✓ Ekle</button>' +
            '<button type="button" class="okul-kapi okul-iptal" onclick="tpKatIptal()">✕</button>' +
            '</span></div>';
    };

    /* --- bir BINA (kurum) --- */
    var binaYap = function (kId, ad, uyeler, genelMi) {
        var toplamSinif = 0;
        uyeler.forEach(function (lId) { toplamSinif += Object.keys((data.levels[lId] && data.levels[lId].classes) || {}).length; });
        var buyuk = (uyeler.length >= 4 || toplamSinif >= 10) ? ' buyuk' : '';
        var katlar = '';
        uyeler.forEach(function (lId) { katlar += katYap(lId); });
        if (duzen && window._tpYeniKat === (kId || 'GENEL')) katlar += taslakKat(kId || 'GENEL');
        if (!katlar) katlar = '<div class="okul-kat"><span class="okul-bos">Bu kurumda henüz seviye yok</span></div>';
        var pencere = '<svg class="okul-pencere" viewBox="0 0 20 16" aria-hidden="true" focusable="false">' +
            '<rect x="0.6" y="0.6" width="18.8" height="14.8" rx="2" fill="#CFE7F5" stroke="#8FB8D4" stroke-width="1.2"/>' +
            '<path d="M10 1.2v13.6M1.2 8h17.6" stroke="#8FB8D4" stroke-width="1.1"/></svg>';
        /* duzenleme modunda tabelanin uzerinde kurum islemleri */
        var kurumTus = (duzen && !genelMi)
            ? '<span class="okul-kurum-tus">' +
              mTus('✏️', 'Kurum adını değiştir', 'kurumAdDegistir(\'' + kId + '\'); tpTazele();', true) +
              mTus('🗄', 'Tüm okulu arşivle', 'kurumArsivle(\'' + kId + '\'); tpTazele();', true) +
              mTus('🗑', 'Kurumu sil (seviyeler Genel\\\'e taşınır)', 'kurumSil(\'' + kId + '\'); tpTazele();', true) +
              '</span>'
            : '';
        /* "Seviye Ekle" = binaya KAT ekler */
        var katEkleTus = duzen
            ? '<button type="button" class="okul-kat-ekle" onclick="tpKatAc(\'' + (kId || 'GENEL') + '\')">' +
              '🧱 Seviye (kat) Ekle</button>'
            : '';
        return '<div class="okul-bina' + (genelMi ? ' genel' : '') + buyuk + '">' +
            '<svg class="okul-bayrak" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                '<line x1="12" y1="2.4" x2="12" y2="11" stroke="#7f8c8d" stroke-width="1.6"/>' +
                '<path class="li-bayrakcik" d="M12.6 2.8h7l-1.7 2.5 1.7 2.5h-7z" fill="#e74c3c"/></svg>' +
            '<svg class="okul-cati" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
                '<path d="M50 0 L98 18 H2 Z" fill="' + (genelMi ? '#78909C' : '#C0392B') + '"/>' +
                '<path d="M50 0 L98 18 H88 L50 3.6 L12 18 H2 Z" fill="rgba(255,255,255,.14)"/></svg>' +
            '<div class="okul-sacak"></div>' +
            '<div class="okul-tabela"><svg class="okul-kep" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                '<path d="M2 9.4L12 4.6l10 4.8-10 4.8z" fill="#F1C40F"/>' +
                '<path d="M6.4 12.4v3.4c0 1.5 2.6 2.8 5.6 2.8s5.6-1.3 5.6-2.8v-3.4L12 15.2z" fill="#F7DC6F"/>' +
                '<path d="M20.6 10.2v4.6" stroke="#F1C40F" stroke-width="1.3" stroke-linecap="round"/></svg>' +
                '<span>' + behKacis(ad) + '</span>' + kurumTus + '</div>' +
            '<div class="okul-govde">' + katlar + '</div>' +
            (katEkleTus ? '<div class="okul-katbar">' + katEkleTus + '</div>' : '') +
            '<div class="okul-giris">' + pencere +
                '<svg class="okul-kapi-svg" viewBox="0 0 40 32" aria-hidden="true" focusable="false">' +
                    '<path d="M3 32V13a17 13 0 0 1 34 0v19z" fill="#6B4A38"/>' +
                    '<path d="M12.5 9.6a7.5 6 0 0 1 15 0v1.8h-15z" fill="#CFE7F5" stroke="#5D4037" stroke-width="1"/>' +
                    '<rect x="7.6" y="13.4" width="11" height="18.6" rx="1.6" fill="#8B5E3C" stroke="#5D4037" stroke-width="1"/>' +
                    '<rect x="21.4" y="13.4" width="11" height="18.6" rx="1.6" fill="#8B5E3C" stroke="#5D4037" stroke-width="1"/>' +
                    '<circle cx="16.4" cy="23" r="1.2" fill="#F1C40F"/><circle cx="23.6" cy="23" r="1.2" fill="#F1C40F"/></svg>' +
                pencere + '</div>' +
            '<div class="okul-taban"></div>' +
        '</div>';
    };

    /* --- UST CUBUK: Listeyi Duzenle / Bitir + Arsiv + Kurum Ekle --- */
    var agac = '<div class="tp-arac">' +
        '<button type="button" class="tp-duzen' + (duzen ? ' bitir' : '') + '" onclick="llProfilDuzenle()">' +
        (duzen ? '✔ Düzenlemeyi Bitir' : '🛠 Listeyi Düzenle') + '</button>' +
        (duzen ? '<button type="button" class="tp-kurum" onclick="llProfilIslem(\'kurum\'); tpTazele();">🏫 Kurum Ekle</button>' : '') +
        '<button type="button" class="tp-arsiv" onclick="llProfilIslem(\'arsiv\')">🗄 Arşiv</button>' +
        '</div>' +
        (duzen ? '<p class="tp-ipucu">Düzenleme açık: kata <b>+</b> ile sınıf ekleyebilir, bir sınıfa tıklayarak' +
                 ' isim değiştirme / arşivleme / silme penceresini açabilirsiniz.</p>' : '');

    var binalar = '';
    Object.keys(kurumlar).forEach(function (kId) {
        binalar += binaYap(kId, kurumlar[kId].name, gruplar[kId] || [], false);
    });
    if (gruplar[''] || (duzen && window._tpYeniKat === 'GENEL') || !Object.keys(kurumlar).length) {
        binalar += binaYap('', 'Genel', gruplar[''] || [], true);
    }
    agac += '<div id="tpOkullar">' + binalar + '</div>';

    html += llAkordiyon('tpSiniflar', '#E67E22',
        '<span>🏫 Kurumlarım &amp; Sınıflarım</span>' + llRozetHtml(sinifToplam + ' sınıf'), agac, true);

    /* SIRALAMA: Kurumlarim & Siniflarim -> Tatiller -> Kisisel Bilgilerim ->
       Veli & Durum Taramasi (Kisisel Bilgilerim'in ALTINDA) -> Yonetim kilidi */
    sec.innerHTML = html + tatilAkordiyon + kisiselAkordiyon + taramaAkordiyon + kilitAkordiyon;

    /* Tarama tablosu ancak akordiyon acilinca cizilir (yuzlerce ogrencide
       kapali dururken bosuna DOM kurmasin). */
    try {
        var _td = document.getElementById('tpTarama');
        if (_td) {
            _td.addEventListener('toggle', function () { if (_td.open) renderTarama(); });
            if (_td.open) renderTarama();
        }
    } catch (e) { }
}

/* Veli & Durum taramasini dogrudan acar: profile gecer, akordiyonu acar,
   ekrani oraya kaydirir. Eski switchTab(10) cagrilari da buraya duser. */
function llTaramaAc() {
    try {
        if (typeof changeView === 'function' &&
            !(window.appState && appState.currentView === 'student-profile-section')) {
            changeView('student-profile-section');
        }
    } catch (e) { }
    setTimeout(function () {
        var d = document.getElementById('tpTarama');
        if (!d) { try { renderTeacherProfile(); } catch (e) { } d = document.getElementById('tpTarama'); }
        if (!d) return;
        d.setAttribute('open', '');
        try { renderTarama(); } catch (e) { }
        try { d.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
    }, 240);
}
window.llTaramaAc = llTaramaAc;
/* ======================================================================
   PROFIL OKUL BINASI — YARDIMCI ISLEVLER
   tpTazele      : bir islemden sonra profili yeniden cizer (prompt/onay
                   pencereleri asenkron kapandigi icin kisa gecikmeli).
   tpKatAc       : "Seviye (kat) Ekle" — binaya bos bir KAT ve isim alani
                   koyar (henuz veriye yazmaz).
   tpKatOnayla   : isim yazilinca seviyeyi gercekten olusturur.
   tpSinifPopupAc: duzenleme modunda sinif kapisina tiklaninca BUYUK
                   tuslu islem penceresi (isim degistir / arsivle / sil).
   ====================================================================== */
function tpTazele(gecikme) {
    setTimeout(function () {
        try {
            var akt = document.activeElement, s = document.getElementById('student-profile-section');
            if (akt && s && s.contains(akt) && akt.tagName === 'INPUT') return;
            renderTeacherProfile();
        } catch (e) { }
    }, gecikme || 260);
}
function tpKatAc(kId) {
    window._tpYeniKat = kId || 'GENEL';
    try { renderTeacherProfile(); } catch (e) { }
    setTimeout(function () { var i = document.getElementById('tpKatAd'); if (i) i.focus(); }, 60);
}
function tpKatIptal() {
    window._tpYeniKat = null;
    try { renderTeacherProfile(); } catch (e) { }
}
function tpKatOnayla(kId) {
    var i = document.getElementById('tpKatAd');
    var ad = i ? String(i.value || '').trim() : '';
    if (!ad) { if (i) i.focus(); return; }
    var kurumId = (kId && kId !== 'GENEL' && data.kurumlar && data.kurumlar[kId]) ? kId : undefined;
    var id = 'L' + Date.now();
    data.levels[id] = {
        name: ad, kurumId: kurumId, classes: {}, planText: {},
        config: {
            hw: [{ n: '1. Ödev', w: 25 }, { n: '2. Ödev', w: 25 }, { n: '3. Ödev', w: 25 }, { n: '4. Ödev', w: 25 }],
            ex: [{ n: 'Dinleme', w: 25 }, { n: 'Konuşma', w: 25 }, { n: 'Yazılı', w: 50 }]
        }
    };
    if (!data.levelOrder) data.levelOrder = [];
    data.levelOrder.push(id);
    window._tpYeniKat = null;
    try { save(); } catch (e) { }
    try { renderTeacherProfile(); } catch (e) { }
}
function tpSinifPopupKapat() {
    var k = document.getElementById('tpSinifPopup');
    if (k) k.remove();
    if (window._tpSinifEsc) { document.removeEventListener('keydown', window._tpSinifEsc); window._tpSinifEsc = null; }
}
function tpSinifPopupAc(lId, cId) {
    tpSinifPopupKapat();
    var lvl = data.levels && data.levels[lId];
    var cls = lvl && lvl.classes && lvl.classes[cId];
    if (!cls) return;
    var tus = function (ikon, yazi, alt, tik, sinif) {
        return '<button type="button" class="tps-tus ' + sinif + '" onclick="tpSinifPopupKapat(); ' + tik + '">' +
            '<span class="tps-ikon">' + ikon + '</span><span class="tps-yazi"><b>' + yazi + '</b>' +
            '<small>' + alt + '</small></span></button>';
    };
    var k = document.createElement('div');
    k.id = 'tpSinifPopup';
    k.innerHTML = '<div class="tps-panel">' +
        '<div class="tps-baslik"><strong>🚪 ' + behKacis(cls.name) + '</strong>' +
        '<button type="button" class="tps-kapat" title="Kapat" onclick="tpSinifPopupKapat()">&times;</button></div>' +
        '<div class="tps-govde">' +
        tus('📂', 'Sınıfı Aç', 'Listelerim\'de bu sınıfa git', 'llProfilSinifSec(\'' + lId + '\',\'' + cId + '\')', 'ac') +
        tus('✏️', 'İsmi Değiştir', 'Sınıfın adını güncelle', 'editClassName(\'' + lId + '\',\'' + cId + '\'); tpTazele();', 'ad') +
        tus('🗄', 'Arşivle', 'Silmeden sakla, sonra geri yükle', 'sinifArsivle(\'' + lId + '\',\'' + cId + '\'); tpTazele(700);', 'ars') +
        tus('🗑', 'Sınıfı Sil', 'Kalıcı olarak kaldır', 'deleteClass(\'' + lId + '\',\'' + cId + '\'); tpTazele(700);', 'sil') +
        '</div></div>';
    k.addEventListener('click', function (e) { if (e.target === k) tpSinifPopupKapat(); });
    document.body.appendChild(k);
    window._tpSinifEsc = function (e) { if (e.key === 'Escape') tpSinifPopupKapat(); };
    document.addEventListener('keydown', window._tpSinifEsc);
}
window.tpTazele = tpTazele;
window.tpKatAc = tpKatAc;
window.tpKatIptal = tpKatIptal;
window.tpKatOnayla = tpKatOnayla;
window.tpSinifPopupAc = tpSinifPopupAc;
window.tpSinifPopupKapat = tpSinifPopupKapat;

/* Profildeki sinif kutusuna tiklaninca: Listelerim acilir + o sinif secilir. */
function llProfilSinifSec(lId, cId) {
    try { if (typeof window.openListelerim === 'function') window.openListelerim(); } catch (e) { }
    setTimeout(function () { try { selectClass(lId, cId); } catch (e) { } }, 160);
}
/* Liste yonetimi: ESKI gorunume gitmez — profildeki agacin uzerinde
   DUZENLEME MODUNU acar/kapatir (ekle/sil/arsiv/ayar tuslari belirir). */
function llProfilDuzenle() {
    window.llProfilDuzen = !window.llProfilDuzen;
    try { renderTeacherProfile(); } catch (e) { }
    /* duzenleme tuslari gorunsun diye kategori acik kalsin */
    try { var d = document.getElementById('tpSiniflar'); if (d) d.setAttribute('open', ''); } catch (e) { }
}
function llProfilIslem(t) {
    try {
        if (t === 'istek' && window.OH && OH.istekPaneliAc) OH.istekPaneliAc();
        else if (t === 'tatil' && typeof openTatiller === 'function') openTatiller();
        else if (t === 'kurum' && typeof addKurum === 'function') addKurum();
        else if (t === 'arsiv' && typeof arsivAc === 'function') arsivAc();
        else if (t === 'sonucGoruldu') {
            if (window.GV && GV.sonucGoruldu) GV.sonucGoruldu();
            else window._gvYeniSonuc = { n: 0, son: null };
            setTimeout(function () { try { renderTeacherProfile(); } catch (e) { } }, 60);
        }
    } catch (e) { }
    if (t === 'kurum') setTimeout(function () { try { renderTeacherProfile(); } catch (e) { } }, 900);
}
/* Tatil takvimini (tatilModal'in ic paneli) akordiyona GOMMEK icin kopyalar:
   kapat (x) tusu ve pencere kabuk stilleri soyulur; pencere baska yerlerden
   acilmaya devam edebilsin diye TASIMAK yerine KLONLANIR. */
function llTatilIcerikHtml() {
    try {
        var modal = document.getElementById('tatilModal');
        if (!modal || !modal.firstElementChild) return '';
        var klon = modal.firstElementChild.cloneNode(true);
        klon.querySelectorAll('button').forEach(function (b) {
            var oc = b.getAttribute('onclick') || '';
            if (oc.indexOf('tatilModal') >= 0) b.remove();
        });
        klon.removeAttribute('style');
        return klon.innerHTML;
    } catch (e) { return ''; }
}

/* ======================================================================
   ODEV EKLE ONERILERI — Seviye Ayarlari'nda "+ Odev Ekle" basilinca
   tanimli oyun/etkinlik gorevleri (GV.OYUNLAR) oneri olarak listelenir;
   biri secilirse odev o adla eklenir, "Bos Odev" ile eski davranis surer.
   ====================================================================== */
function llOdevOneriAc() {
    var eski = document.getElementById('llOdevOneri');
    if (eski) eski.remove();
    var oyunlar = (window.GV && GV.OYUNLAR && GV.OYUNLAR.length) ? GV.OYUNLAR : [];
    /* SURE TAKIPLI icerikler (puan uretmez) performans odevi onerisi OLMAZ */
    oyunlar = oyunlar.filter(function (o) { return (o.tur || 'puan') !== 'sure'; });
    if (!oyunlar.length) { addConfigRow('hw'); return; }   /* katalog yoksa eski davranis */
    var k = document.createElement('div');
    k.id = 'llOdevOneri';
    k.setAttribute('style', 'position:fixed; inset:0; z-index:1000001; background:rgba(0,0,0,.45);' +
        ' backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:16px;');
    var ic = '';
    oyunlar.forEach(function (o) {
        ic += '<button type="button" onclick="llOdevOneriSec(\'' + String(o.ad).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')"' +
            ' style="display:flex; align-items:center; gap:9px; width:100%; text-align:left; margin:0 0 8px;' +
            ' padding:11px 14px; border:1px solid #F0DACA; border-radius:10px; background:#FFF8F2; color:#B34700;' +
            ' font-family:inherit; font-weight:700; font-size:.95rem; cursor:pointer;">🎮 ' + behKacis(o.ad) + '</button>';
    });
    ic += '<button type="button" onclick="llOdevOneriSec(null)"' +
        ' style="display:flex; align-items:center; gap:9px; width:100%; text-align:left; padding:11px 14px;' +
        ' border:1px dashed #CBD3D9; border-radius:10px; background:#F8F9FA; color:#5f6f74;' +
        ' font-family:inherit; font-weight:700; font-size:.95rem; cursor:pointer;">✏️ Boş Ödev (ismini kendim yazayım)</button>';
    k.innerHTML = '<div style="background:#fff; width:100%; max-width:440px; max-height:82vh; border-radius:16px;' +
        ' overflow:hidden; display:flex; flex-direction:column; box-shadow:0 18px 46px rgba(0,0,0,.35);">' +
        '<div style="background:linear-gradient(135deg,#F39C12 0%,#E67E22 48%,#D84315 100%); color:#fff; padding:12px 16px;' +
        ' display:flex; justify-content:space-between; align-items:center; font-family:\'Marhey\',sans-serif;">' +
        '<strong>Ödev Ekle</strong>' +
        '<span onclick="document.getElementById(\'llOdevOneri\').remove()" style="cursor:pointer; font-size:24px; line-height:1;">&times;</span></div>' +
        '<div style="padding:14px; overflow-y:auto;">' +
        '<p style="margin:0 0 10px; font-size:.85rem; color:#7f8c8d;">Tanımlı oyun/etkinlik görevlerinden birini seç ya da boş ödev ekle:</p>' +
        ic + '</div></div>';
    k.addEventListener('click', function (e) { if (e.target === k) k.remove(); });
    document.body.appendChild(k);
}
function llOdevOneriSec(ad) {
    var k = document.getElementById('llOdevOneri');
    if (k) k.remove();
    addConfigRowWithData('hw', ad || '', 0);   // seçilen ödev adı korunur
    llHwToplamGuncelle();                        // yeni ödevle toplam 100'ü aşıyor/eksiliyor → uyar
}
window.llOdevOneriAc = llOdevOneriAc;
window.llOdevOneriSec = llOdevOneriSec;

/* ======================================================================
   TAM EKRAN — sinif gorunumu tam ekranda yasar.
   Sinif acilinca otomatik girilir; ← geri tusu once tam ekrandan cikar.
   Cubuktaki ⛶ tusu elle ac/kapa yapar.
   ====================================================================== */
function llTamEkranAc() {
    try {
        if (document.fullscreenElement || document.webkitFullscreenElement) return;
        var el = document.documentElement;
        if (el.requestFullscreen) { var p = el.requestFullscreen(); if (p && p.catch) p.catch(function () { }); }
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } catch (e) { }
}
function llTamEkranKapat() {
    try {
        if (document.fullscreenElement && document.exitFullscreen) { var p = document.exitFullscreen(); if (p && p.catch) p.catch(function () { }); }
        else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    } catch (e) { }
}
function llTamEkranDegistir() {
    if (document.fullscreenElement || document.webkitFullscreenElement) llTamEkranKapat();
    else llTamEkranAc();
}
window.llTamEkranAc = llTamEkranAc;
window.llTamEkranKapat = llTamEkranKapat;
window.llTamEkranDegistir = llTamEkranDegistir;

/* GERI tusu (sekme cubugunun basindaki ←): once TAM EKRANDAN cikar,
   sonra profildeki Kurumlarim & Siniflarim bolumune doner. */
function llProfilDon() {
    try { llTamEkranKapat(); } catch (e) { }
    try { if (typeof changeView === 'function') changeView('student-profile-section'); } catch (e) { }
    setTimeout(function () {
        try {
            var d = document.getElementById('tpSiniflar');
            if (d) { d.setAttribute('open', ''); d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        } catch (e) { }
    }, 140);
}
window.llProfilDon = llProfilDon;

window.renderTeacherProfile = renderTeacherProfile;
window.llProfilSinifSec = llProfilSinifSec;
window.llProfilDuzenle = llProfilDuzenle;
window.llProfilIslem = llProfilIslem;

/* BILDIRIME TIKLAYINCA ILGILI YERE GIT: son sonucun ogrencisinin sinifi
   (ogrenciBaglari'ndan) bulunur; Listelerim acilir, o sinif secilir ve
   ETKINLIKLER sekmesine gecilir. Sinif bulunamazsa acik/son sinifla yetinilir.
   Gitmek "gordum" sayilir (serit ve yesil nokta soner). */
function llBildirimGit() {
    try { if (window.GV && GV.sonucGoruldu) GV.sonucGoruldu(); } catch (e) { }
    var son = (window._gvYeniSonuc || {}).son || null;
    var uid = son && son.ogrenciUid;
    var ac = function (lId, cId) {
        try { if (typeof changeView === 'function') changeView('listelerim-section'); } catch (e) { }
        try { if (typeof initListelerim === 'function' && (typeof data === 'undefined' || !data)) initListelerim(); } catch (e) { }
        var dene = 0;
        var tik = setInterval(function () {
            dene++;
            var hazir = (typeof data !== 'undefined') && data && data.levels;
            if ((hazir && (!lId || data.levels[lId])) || dene > 24) {
                clearInterval(tik);
                try {
                    if (lId && cId && hazir && data.levels[lId]) { selectClass(lId, cId); switchTab(11); }
                    else if (typeof curLId !== 'undefined' && curLId && curCId) { selectClass(curLId, curCId); switchTab(11); }
                } catch (e) { }
            }
        }, 250);
    };
    var D = null;
    try { D = (typeof db !== 'undefined' && db) ? db : ((typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) ? firebase.firestore() : null); } catch (e) { }
    if (uid && D) {
        D.collection('ogrenciBaglari').doc(uid).get().then(function (doc) {
            var v = (doc.exists && doc.data()) || {};
            ac(v.lId || null, v.cId || null);
        }).catch(function () { ac(null, null); });
    } else ac(null, null);
}
window.llBildirimGit = llBildirimGit;

/* Sidebar her yeniden cizildiginde (ekleme/silme/arsiv sonrasi hep cizilir)
   profil goruntudeyse OGRETMEN PROFILI de tazelenir — boylece profildeki
   duzenlemelerin sonucu aninda gorunur. */
function llProfilSidebarSar() {
    if (typeof window.renderSidebar !== 'function' || window.renderSidebar._tp) return;
    var _rs = window.renderSidebar;
    var yeni = function () {
        var r = _rs.apply(this, arguments);
        try {
            if (window.appState && appState.currentView === 'student-profile-section' &&
                (appState.userRole === 'teacher' || appState.userRole === 'admin')) {
                clearTimeout(window._tpTazele);
                window._tpTazele = setTimeout(function () {
                    try {
                        var akt = document.activeElement;
                        var s2 = document.getElementById('student-profile-section');
                        if (akt && s2 && s2.contains(akt) &&
                            (akt.tagName === 'INPUT' || akt.tagName === 'SELECT' || akt.tagName === 'TEXTAREA')) return;
                        renderTeacherProfile();
                    } catch (e) { }
                }, 250);
            }
        } catch (e) { }
        return r;
    };
    yeni._tp = true;
    window.renderSidebar = yeni;
}
llProfilSidebarSar();

/* ======================================================================
   MOBIL CEKMECE DAVRANISI
   Dar ekranda sidebar sayfa akisindan cikip soldan kayan bir cekmeceye
   doner (listelerim.css bolum 12.4). Masaustunde eskisi gibi sabit acik
   kalir. Burada yalnizca "ne zaman kapali baslasin" karari verilir.
   ====================================================================== */
function llMobilMi() {
    try { return window.matchMedia('(max-width: 900px)').matches; }
    catch (e) { return (window.innerWidth || 1200) <= 900; }
}
/* Ekran genisligi degistiginde cekmeceyi dogru duruma getir. */
function llCekmeceUygula(zorla) {
    var r = (typeof llRootEl === 'function') ? llRootEl() : document.getElementById('ll-root');
    if (!r) return;
    var mobil = llMobilMi();
    if (mobil) {
        /* Mobilde varsayilan KAPALI; kullanici acmadiysa kapali kalsin. */
        if (zorla || r.dataset.llMod !== 'mobil') r.classList.add('sidebar-closed');
        r.dataset.llMod = 'mobil';
    } else {
        /* Masaustunde de VARSAYILAN KAPALI: ogretmen profile/listeye girince
           icerik tam gorunur; cekmece sol-alt menu tusuyla acilir. */
        if (zorla || r.dataset.llMod !== 'masaustu') r.classList.add('sidebar-closed');
        r.dataset.llMod = 'masaustu';
    }
}
/* Sinif secilince cekmece kapansin -> icerik hemen gorunur. */
function llCekmeceKapatMobil() {
    /* Cekmece artik masaustunde de icerigin USTUNDE yuzer: sinif secilince
       her genislikte kapatilir ki icerik gorunsun. */
    var r = (typeof llRootEl === 'function') ? llRootEl() : document.getElementById('ll-root');
    if (r) r.classList.add('sidebar-closed');
}
window.llCekmeceUygula = llCekmeceUygula;
window.llCekmeceKapatMobil = llCekmeceKapatMobil;
(function () {
    var _z = null;
    window.addEventListener('resize', function () {
        clearTimeout(_z);
        _z = setTimeout(function () { llCekmeceUygula(false); }, 180);
    });
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', function () { llCekmeceUygula(true); });
    else llCekmeceUygula(true);
})();

// Sınav/Ödev hesaplamasını ağırlıklara göre yapan fonksiyon
function renderResults() {
    let table = document.getElementById('resTable');
    if (!table || !curLId || !curCId) return;

    let lvl = data.levels[curLId];
    const rBeh = behAyar(curLId);
    const rEtki = !!(rBeh && rBeh.aktif && rBeh.ortEtki);
    donemSeritCiz(table, 'res');
    const ds = donemler(curLId);

    /* Bir ogrencinin BIR donemdeki agirlikli odev/sinav ortalamalari.
       Davranis etkisi odev ortalamasinin dogrudan icindedir. */
    const donemSkoru = (s, di) => {
        let hw = 0, ex = 0;
        const hn = donemNotlari(s, 'hw', di), en = donemNotlari(s, 'ex', di);
        lvl.config.hw.forEach((c, i) => { hw += (parseFloat(hn[i] || 0)) * (parseFloat(c.w || 0) / 100); });
        lvl.config.ex.forEach((c, i) => { ex += (parseFloat(en[i] || 0)) * (parseFloat(c.w || 0) / 100); });
        let etki = 0;
        if (rEtki) { const r = behOrtUygula(hw, rBeh, s); etki = r.etki; hw = r.son; }
        return { hw: hw, ex: ex, etki: etki };
    };
    const hwHucreYap = (p) => {
        const sinif = p.etki > 0 ? 'arti' : (p.etki < 0 ? 'eksi' : '');
        return `<td class="beh-ort-hucre ${sinif}" style="font-weight:bold;" title="Davranış etkisi ${p.etki >= 0 ? '+' : ''}${p.etki.toFixed(2)} dahildir">${p.hw.toFixed(2)}${p.etki ? `<span class="beh-ort-fark">${p.etki > 0 ? '+' : ''}${p.etki.toFixed(2)}</span>` : ''}</td>`;
    };

    if (resGenelAcik && ds.length > 1) {
        /* ---- GENEL (TUM DONEMLER): donem donem + genel ortalama ---- */
        table.innerHTML = `<tr><th>Öğrenci</th>${ds.map(ad => `<th>${behKacis(ad)} Ödev</th><th>${behKacis(ad)} Sınav</th>`).join('')}<th title="Dönem ödev ortalamalarının ortalaması">Genel Ödev</th><th title="Dönem sınav ortalamalarının ortalaması">Genel Sınav</th></tr>`;
        lvl.classes[curCId].students.forEach(s => {
            let hucreler = '', hwT = 0, exT = 0;
            ds.forEach((ad, di) => {
                const p = donemSkoru(s, di);
                hwT += p.hw; exT += p.ex;
                hucreler += hwHucreYap(p) + `<td style="font-weight:bold; color:var(--accent);">${p.ex.toFixed(2)}</td>`;
            });
            table.insertRow().innerHTML = `
                <td>${behKacis(s.name || '')}</td>
                ${hucreler}
                <td style="font-weight:bold; background:#EAF7F3;">${(hwT / ds.length).toFixed(2)}</td>
                <td style="font-weight:bold; color:var(--accent); background:#EAF7F3;">${(exT / ds.length).toFixed(2)}</td>
            `;
        });
        return;
    }

    /* ---- TEK DONEM ---- */
    const dnm = aktifDonem(curLId);
    table.innerHTML = `<tr><th>Öğrenci</th><th>Ödev Ort. (%100)</th><th>Sınav Ort. (%100)</th></tr>`;
    lvl.classes[curCId].students.forEach(s => {
        const p = donemSkoru(s, dnm);
        table.insertRow().innerHTML = `
            <td>${behKacis(s.name || '')}</td>
            ${hwHucreYap(p)}
            <td style="font-weight:bold; color:var(--accent);">${p.ex.toFixed(2)}</td>
        `;
    });
}
function addConfigRow(type, name = "", weight = 0) {
    const container = document.getElementById(type === "hw" ? "lvlHwList" : "lvlExList");
    if (!container) return;

    const row = document.createElement("div");
    row.style = "margin-bottom:8px; display:flex; gap:5px; align-items:center;";
    row.innerHTML = `
        <input type="text" class="${type}-n" value="${name}" placeholder="Ad" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <input type="number" class="${type}-w" value="${weight}" placeholder="%" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <button onclick="this.parentElement.remove()" style="background:#e74c3c; color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">${llIcon('kapat')}</button>
    `;
    container.appendChild(row);
}

let mevcutMod = 'login'; // Varsayılan mod giriş

function llModuDegistir() {
    const title = document.getElementById('auth-title');
    const subTitle = document.querySelector('.auth-header-area p'); // Açıklama metnini seçer
    const btn = document.getElementById('auth-action-btn');
    const link = document.getElementById('auth-switch-link');
    const text = document.getElementById('auth-switch-text');
    const passLabel = document.getElementById('password-label');
    const rePassGroup = document.getElementById('re-password-group');
    const hata = document.getElementById('hata-mesaji');

    if (hata) hata.style.display = "none";

    if (mevcutMod === 'login') {
        // --- KAYIT OLMA MODUNA GEÇİŞ ---
        mevcutMod = 'signup';
        title.innerText = "Yeni Hesap Oluştur";
        if (subTitle) subTitle.innerText = "Verilerinizi senkronize etmek için kayıt olun."; // İSTEDİĞİN DEĞİŞİKLİK
        
        if (passLabel) passLabel.innerText = "Şifre Oluştur";
        if (rePassGroup) rePassGroup.style.display = "flex"; 
        
        btn.innerText = "Kayıt Ol";
        text.innerText = "Zaten hesabınız var mı?";
        link.innerText = "Giriş Yapın";
    } else {
        // --- GİRİŞ YAPMA MODUNA GEÇİŞ ---
        mevcutMod = 'login';
        title.innerText = "Öğretmen Girişi";
        if (subTitle) subTitle.innerText = "Verilerinizi senkronize etmek için giriş yapın.";
        
        if (passLabel) passLabel.innerText = "Şifre";
        if (rePassGroup) rePassGroup.style.display = "none";
        
        btn.innerText = "Giriş Yap";
        text.innerText = "Hesabınız yok mu?";
        link.innerText = "Kayıt Olun";
    }
}


async function llAuthIslemi() {
    const emailInput = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const rePass = document.getElementById('re-password') ? document.getElementById('re-password').value : ""; 
    const hata = document.getElementById('hata-mesaji');

    if (hata) hata.style.display = "none";

    // --- ÖĞRENCİ GİRİŞ KONTROLÜ ---
    if (currentRole === 'student') {
        const inputCode = emailInput.toUpperCase();
        if (!inputCode) {
            hata.innerText = "Lütfen giriş kodunu yazın.";
            hata.style.display = "block";
            return;
        }

        // KRİTİK YAMA: Eğer global 'data' boşsa, yerel hafızadan yükle
        if (!window.data || !window.data.levels) {
            const localData = localStorage.getItem('schoolData');
            if (localData) window.data = JSON.parse(localData);
        }

        let foundStudent = null;
        let coords = null;

        // Veri yapısı hala yoksa hata ver
        if (!window.data || !window.data.levels) {
            hata.innerText = "Sistem verileri yüklenemedi. Lütfen sayfayı yenileyin.";
            hata.style.display = "block";
            return;
        }

        // Tüm Seviyeleri ve Sınıfları Tara
        for (let lId in window.data.levels) {
            for (let cId in window.data.levels[lId].classes) {
                const students = window.data.levels[lId].classes[cId].students || [];
                const sIdx = students.findIndex(s => 
                    (s.loginCode || "").toString().trim().toUpperCase() === inputCode
                );

                if (sIdx !== -1) {
                    foundStudent = students[sIdx];
                    coords = { lId, cId, sIdx };
                    break;
                }
            }
            if (foundStudent) break;
        }

        if (foundStudent) {
            // Giriş bilgilerini kaydet
            localStorage.setItem('logged_student', JSON.stringify({ ...coords, name: foundStudent.name, role: 'student' }));
            
            alert("Hoş geldin, " + foundStudent.name);
            modalKapat();
            
            // Görünümü güncelle
            llRootEl().classList.add('logged-in');
            
            // Öğrenci panelini otomatik aç
            if (typeof switchView === "function") {
                switchView('student');
            }
            return;
        } else {
            hata.innerText = "Geçersiz giriş kodu!";
            hata.style.display = "block";
            return;
        }
    }

    // --- ÖĞRETMEN (FIREBASE) GİRİŞİ ---
    if (!emailInput || !pass) {
        hata.innerText = "Lütfen e-posta ve şifre giriniz.";
        hata.style.display = "block";
        return;
    }

    try {
        hata.style.display = "none";
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

        let userCredential;
        if (mevcutMod === 'login') {
            userCredential = await firebase.auth().signInWithEmailAndPassword(emailInput, pass);
            
            const doc = await db.collection("kullanicilar").doc(userCredential.user.uid).get();
            if (doc.exists && doc.data().teacherStaticCode) {
                localStorage.setItem('teacher_static_code', doc.data().teacherStaticCode);
            }
        } else {
            // YENİ KAYIT MODU
            if (pass !== rePass) { throw new Error("Şifreler eşleşmiyor."); }
            userCredential = await firebase.auth().createUserWithEmailAndPassword(emailInput, pass);
            
            const staticCode = "TCH-" + Math.floor(1000 + Math.random() * 9999);
            localStorage.setItem('teacher_static_code', staticCode);

            let dataToUpload = localStorage.getItem('schoolData') || JSON.stringify({ levels: {}, levelOrder: [] });
            
            await db.collection("kullanicilar").doc(userCredential.user.uid).set({
                userData: dataToUpload,
                teacherStaticCode: staticCode,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            alert("Hesap oluşturuldu! Sabit Kodunuz: " + staticCode);
        }
        
        modalKapat();
        llRootEl().classList.add('logged-in');
        
        // Öğretmen verilerini çek
        if (typeof verileriGetir === "function") {
            verileriGetir(userCredential.user.uid);
        }
    } catch (error) {
        hata.innerText = "Hata: " + error.message;
        hata.style.display = "block";
    }
}

// --- ENTER TUŞU ÖZELLİĞİ ---
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('login-modal');
    if (modal && modal.style.display !== 'none' && event.key === 'Enter') {
        if (event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            // Sitenin gercek kimlik katmani auth.js'tir; varsa ONA yonlendir.
            if (typeof window.authIslemi === 'function') window.authIslemi();
            else llAuthIslemi();
        }
    }
});

function llTogglePassword(id) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


/* firebaseConfig kaldirildi - paylasilan firebase kullaniliyor */

// Firebase Config zaten sizde var...

/* listelerim kendi login onAuthStateChanged'i kaldirildi - index unified auth yonetiyor. Veri yukleme initListelerim() ile view acilinca yapilir. */

function verileriGetir(uid) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';

    // Sayfa yenilendiğinde eski ID'leri temizle ki taze veri yüklensin
    curLId = null; 
    curCId = null;

    db.collection("kullanicilar").doc(uid).get()
    .then((doc) => {
        // Her zaman bu hesabin KENDI verisini yukle; baska hesaptan kalan yerel veri asla gorunmesin
        if (doc.exists && doc.data().userData) {
            try {
                data = JSON.parse(doc.data().userData); 
                if (!data || typeof data !== 'object') data = { levels: {}, levelOrder: [] };
                if (!data.levels) data.levels = {};
                console.log("Bulut verileri başarıyla senkronize edildi! 🔄");
            } catch (e) {
                console.error("JSON ayrıştırma hatası:", e);
                data = { levels: {}, levelOrder: [] };
            }
        } else {
            // Bu hesabin kendi listesi yok -> bos basla (onceki ogretmenin listeleri gorunmesin)
            data = { levels: {}, levelOrder: [] };
        }
        // Yerel kopyayi ve ogretmen kodunu da bu hesaba gore guncelle (hesaplar arasi sizinti engellenir)
        try { localStorage.setItem('schoolData', JSON.stringify(data)); } catch(e){}
        try {
            var _sc = (doc.exists && doc.data().teacherStaticCode) ? doc.data().teacherStaticCode : null;
            if (_sc) localStorage.setItem('teacher_static_code', _sc);
            else localStorage.removeItem('teacher_static_code');
        } catch(e){}

        // 1. Sidebar'ı oluştur
        renderSidebar(); 
        llRootEl().classList.add('logged-in'); 

        // 2. Otomatik secim YOK - kullanici secene kadar placeholder goster
        if (typeof showLLPlaceholder === "function") showLLPlaceholder();

        // 3. Yükleme ekranını kaldır
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
        }, 300);
    })
    .catch((err) => {
        console.error("Veritabanı bağlantı hatası:", err);
        if (overlay) overlay.style.display = 'none';
        renderSidebar();
    });
}

function misafirGiris() {
    // 1. Önce hafızadaki (varsa misafir modunda girilen) veriyi tazeleyelim
    loadDataFromLocal();
    
    // 2. Modalı gizle ve kilitleri aç
    document.getElementById('login-modal').style.display = 'none';
    llRootEl().classList.add('logged-in');
    
    // 3. Misafir modunu hafızaya al
    localStorage.setItem('auth_status', 'guest');
    
    // 4. Sidebar'ı çiz ve ilk sınıfı seç
    if (typeof renderSidebar === "function") {
        renderSidebar();
        setTimeout(() => {
            const firstLevel = document.querySelector('.level-container');
            if (firstLevel) {
                const firstClassList = firstLevel.querySelector('.class-list');
                if (firstClassList) firstClassList.style.display = "block";
                const firstClassLink = firstLevel.querySelector('.class-link');
                if (firstClassLink) firstClassLink.click();
            }
        }, 300);
    }
}
  

// --- ÖĞRENCİ MODÜLÜ ---

let isStudentViewOpen = false;

function switchView(role) {
    const overlay = document.getElementById('student-overlay');
    const studentContent = document.getElementById('student-dynamic-content');
    const emailInput = document.getElementById('email'); 

    if (role === 'student') {
        // --- ÖĞRENCİ PANELİNİ AÇ ---
        overlay.style.display = 'block';
        isStudentViewOpen = true; // Global değişkeni güncelle
        llRootEl().classList.add('role-student');
        
        // Öğrenciye özel kartları yerleştir
        studentContent.innerHTML = `
            <div class="student-card" onclick="alert('Satranç Dünyam Açılıyor...')" style="background: #FFF9C4; padding: 40px; border-radius: 25px; cursor: pointer; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div>${llIcon('piyon','lli-xxl')}</div>
                <h3 style="margin-top:15px;">Satranç Dünyam</h3>
            </div>
            
            <div class="student-card" style="background: #C8E6C9; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div>${llIcon('kupa','lli-xxl')}</div>
                <h3 style="margin-top:15px;">Puan Durumum</h3>
                <p style="font-size: 32px; font-weight: bold; color: #2E7D32;">Giriş Başarılı ${llIcon('onay')}</p>
            </div>

            <div class="student-card" style="background: #E3F2FD; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div>${llIcon('takvim','lli-xxl')}</div>
                <h3 style="margin-top:15px;">Haftalık Görevler</h3>
                <p style="font-size: 14px; color: #666;">Görevlerini buradan takip edebilirsin.</p>
            </div>
        `;
    } else {
        // --- ÇIKIŞ MANTIĞI ---
        
        // localStorage'da kayıtlı bir öğrenci var mı kontrol et
        const loggedStudent = localStorage.getItem('logged_student');

        if (loggedStudent) {
            // DURUM 1: GERÇEK ÖĞRENCİ GİRİŞİ YAPILMIŞSA
            overlay.style.display = 'none';
            isStudentViewOpen = false;
            
            // Tamamen sistemden çıkar ve giriş ekranına at
            llRootEl().classList.remove('role-student');
            llRootEl().classList.remove('logged-in'); 
            localStorage.removeItem('logged_student'); 
            
            if (emailInput) emailInput.value = "";
            
            if (typeof modalAc === "function") {
                modalAc(); 
                if (typeof llSetRole === "function") llSetRole('student');
            }
        } else {
            // DURUM 2: ÖĞRETMEN SADECE GÖRÜNÜME BAKIP KAPATIYORSA
            overlay.style.display = 'none';
            isStudentViewOpen = false;
            
            // Sadece öğrenci rolü sınıfını kaldır, logged-in (öğretmen oturumu) kalsın
            llRootEl().classList.remove('role-student');
            
            // Not: modalAc() çağrılmaz, öğretmen kaldığı yerden devam eder.
        }
    }
}


function renderStudentDashboard(container) {
    container.innerHTML = `
        <div class="student-card marhey-text" style="padding: 20px; background: #fffde7; border-radius: 15px;">
            <h2 style="color: #fbc02d;">Benim Dünyam</h2>
            <div class="game-links" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div class="game-item" style="background: white; padding: 15px; border-radius: 10px; text-align: center; border: 2px solid #fff9c4;">
                    <span>${llIcon('piyon','lli-b')}</span><br>Satranç Dünyam
                </div>
                <div class="game-item" style="background: white; padding: 15px; border-radius: 10px; text-align: center; border: 2px solid #fff9c4;">
                    <span>${llIcon('not','lli-b')}</span><br>Ödevlerim
                </div>
            </div>
        </div>
    `;
} 

function renderStudentDashboardContent() {
    const studentContent = document.getElementById('student-dynamic-content');
    if (!studentContent) return;

    const okunmamisMesaj = (typeof ogrMesajOkunmamis === 'function') ? ogrMesajOkunmamis() : 0;

    studentContent.innerHTML = `
        <div class="student-card" onclick="alert('Satranç Dünyam Açılıyor...')" style="background: #FFF9C4; padding: 40px; border-radius: 25px; cursor: pointer; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div>${llIcon('piyon','lli-xxl')}</div>
            <h3 style="margin-top:15px;">Satranç Dünyam</h3>
        </div>
        
        <div class="student-card" style="background: #C8E6C9; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div>${llIcon('kupa','lli-xxl')}</div>
            <h3 style="margin-top:15px;">Puan Durumum</h3>
            <p style="font-size: 32px; font-weight: bold; color: #2E7D32;">Giriş Yapıldı ${llIcon('onay')}</p>
        </div>

        <div class="student-card" style="background: #E3F2FD; padding: 40px; border-radius: 25px; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div>${llIcon('takvim','lli-xxl')}</div>
            <h3 style="margin-top:15px;">Haftalık Görevler</h3>
            <p style="font-size: 14px; color: #666;">Görevlerini buradan takip edebilirsin.</p>
        </div>

        <div class="student-card" onclick="ogrMesajAc()" style="background: #FFE0B2; padding: 40px; border-radius: 25px; cursor: pointer; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div>${llIcon('duyuru','lli-xxl')}</div>
            <h3 style="margin-top:15px;">Öğretmenimden Mesajlar${okunmamisMesaj ? `<span id="ogrMesajRozet" class="ogr-mesaj-rozet">${okunmamisMesaj}</span>` : ''}</h3>
            <p style="font-size: 14px; color: #666;">Sadece sen ve öğretmenin görebilir.</p>
        </div>
    `;
}

function syncLevelActions(){ try{ document.querySelectorAll('#ll-root .level-container').forEach(function(lc){ var list=lc.querySelector('.class-list'); var acts=lc.querySelector('.level-actions'); if(acts) acts.style.display=(list && list.style.display==='block')?'flex':'none'; }); }catch(e){} }
window.syncLevelActions=syncLevelActions;

// --- Seviye ismi: tek tik ac/kapa, cift tik yerinde duzenle ---
var _lvlClickTimer={};
function handleLevelNameClick(lId, spanEl){
  try{
    if(_lvlClickTimer[lId]){ clearTimeout(_lvlClickTimer[lId]); _lvlClickTimer[lId]=null; inlineRenameLevel(lId, spanEl); }
    else { _lvlClickTimer[lId]=setTimeout(function(){ _lvlClickTimer[lId]=null; if(typeof toggleClasses==='function') toggleClasses(lId); }, 220); }
  }catch(e){ if(typeof toggleClasses==='function') toggleClasses(lId); }
}
window.handleLevelNameClick=handleLevelNameClick;
function inlineRenameLevel(lId, spanEl){
  if(!spanEl || spanEl.querySelector('input')) return;
  if(!data.levels || !data.levels[lId]) return;
  var cur=data.levels[lId].name||'';
  spanEl.textContent='';
  var inp=document.createElement('input'); inp.type='text'; inp.value=cur;
  inp.setAttribute('style','width:88%; font-weight:bold; font-family:inherit; font-size:inherit; border:1px solid rgba(255,255,255,0.7); border-radius:4px; padding:2px 6px; background:rgba(255,255,255,0.2); color:#fff;');
  inp.onclick=function(e){ e.stopPropagation(); };
  spanEl.appendChild(inp); inp.focus(); inp.select();
  var done=false;
  function finish(sv){ if(done) return; done=true; var v=(inp.value||'').trim(); var name=(sv&&v)?v:cur; if(sv&&v&&v!==cur){ data.levels[lId].name=v; if(typeof save==='function') save(); } spanEl.innerHTML=llIcon('sinif')+' '+behKacis(name); }
  inp.onblur=function(){ finish(true); };
  inp.onkeydown=function(e){ if(e.key==='Enter'){ e.preventDefault(); finish(true); inp.blur(); } else if(e.key==='Escape'){ finish(false); } };
}
window.inlineRenameLevel=inlineRenameLevel;

function showLLPlaceholder(){ try{ var content=document.getElementById('content'); if(!content) return; content.style.display='block'; var hint=document.getElementById('ll-select-hint'); if(hint) hint.style.display='block'; var tabs=content.querySelector('.tabs'); if(tabs) tabs.style.display='none'; content.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); }); var vt=document.getElementById('viewTitle'); if(vt) vt.innerHTML=''; }catch(e){} }
window.showLLPlaceholder=showLLPlaceholder;


/* ==========================================================================
   VELİ BİLGİLERİ  —  öğrenci başına ayrıntılı aile/durum kaydı
   ========================================================================== */

const VELI_DURUM = ['Sağ', 'Vefat etti', 'Bilinmiyor'];
const VELI_MADDI = ['İyi', 'Orta', 'Kötü', 'Çok kötü', 'Belirtilmedi'];
const VELI_BIRLIKTE = ['Anne ve baba ile', 'Sadece anne ile', 'Sadece baba ile', 'Akraba/vasi ile', 'Yurt/pansiyon', 'Diğer'];

/* Öğrencinin veli kaydını getirir; yoksa boş şablonu kurar. */
function veliAyar(s) {
    if (!s) return null;
    if (!s.veli || typeof s.veli !== 'object') s.veli = {};
    const v = s.veli;
    const alanlar = {
        anneAd: '', anneTel: '', anneMeslek: '', anneDurum: 'Bilinmiyor',
        babaAd: '', babaTel: '', babaMeslek: '', babaDurum: 'Bilinmiyor',
        veliKim: '', veliTel: '', evTel: '', adres: '',
        maddi: 'Belirtilmedi', birlikte: '', kardes: '',
        ayriMi: false, saglik: '', ozelDurum: ''
    };
    Object.keys(alanlar).forEach(k => { if (v[k] === undefined) v[k] = alanlar[k]; });
    return v;
}

/* Kartta küçük bir işaret göstermek için: veli bilgisi girilmiş mi? */
function veliDolu(s) {
    const v = s && s.veli;
    if (!v) return false;
    return !!(v.anneAd || v.babaAd || v.anneTel || v.babaTel || v.veliTel ||
              (v.maddi && v.maddi !== 'Belirtilmedi') ||
              (v.anneDurum && v.anneDurum !== 'Bilinmiyor') ||
              (v.babaDurum && v.babaDurum !== 'Bilinmiyor'));
}

let curVeliStuIdx = null;

function veliSecenek(liste, secili) {
    return liste.map(o => `<option value="${behKacis(o)}"${o === secili ? ' selected' : ''}>${behKacis(o)}</option>`).join('');
}

function openVeliModal(idx) {
    curVeliStuIdx = idx;
    const s = data.levels[curLId].classes[curCId].students[idx];
    if (!s) return;
    const v = veliAyar(s);

    const govde = document.getElementById('veliModalGovde');
    const baslik = document.getElementById('veliModalTitle');
    if (baslik) baslik.innerHTML = llIcon('veli') + ' ' + behKacis(s.name || 'Öğrenci') + ' — Veli Bilgileri';
    if (!govde) return;

    govde.innerHTML = `
        <div class="veli-izgara">

            <div class="veli-kart anne">
                <h4>${llIcon('kisi')} Anne</h4>
                <label>Adı Soyadı<input type="text" id="vAnneAd" value="${behKacis(v.anneAd)}" placeholder="Anne adı"></label>
                <label>${llIcon('telefon')} Telefon<input type="tel" id="vAnneTel" value="${behKacis(v.anneTel)}" placeholder="05xx xxx xx xx"></label>
                <label>${llIcon('meslek')} Meslek<input type="text" id="vAnneMeslek" value="${behKacis(v.anneMeslek)}" placeholder="Mesleği"></label>
                <label>Durum<select id="vAnneDurum">${veliSecenek(VELI_DURUM, v.anneDurum)}</select></label>
            </div>

            <div class="veli-kart baba">
                <h4>${llIcon('kisi')} Baba</h4>
                <label>Adı Soyadı<input type="text" id="vBabaAd" value="${behKacis(v.babaAd)}" placeholder="Baba adı"></label>
                <label>${llIcon('telefon')} Telefon<input type="tel" id="vBabaTel" value="${behKacis(v.babaTel)}" placeholder="05xx xxx xx xx"></label>
                <label>${llIcon('meslek')} Meslek<input type="text" id="vBabaMeslek" value="${behKacis(v.babaMeslek)}" placeholder="Mesleği"></label>
                <label>Durum<select id="vBabaDurum">${veliSecenek(VELI_DURUM, v.babaDurum)}</select></label>
            </div>

            <div class="veli-kart iletisim">
                <h4>${llIcon('telefon')} İletişim</h4>
                <label>Birincil veli (kim?)<input type="text" id="vVeliKim" value="${behKacis(v.veliKim)}" placeholder="Anne / Baba / Amca / Vasi..."></label>
                <label>Veli telefonu<input type="tel" id="vVeliTel" value="${behKacis(v.veliTel)}" placeholder="05xx xxx xx xx"></label>
                <label>Ev telefonu<input type="tel" id="vEvTel" value="${behKacis(v.evTel)}" placeholder="0xxx xxx xx xx"></label>
                <label>Adres<textarea id="vAdres" rows="2" placeholder="Mahalle / sokak / ilçe">${behKacis(v.adres)}</textarea></label>
            </div>

            <div class="veli-kart durum">
                <h4>${llIcon('para')} Aile Durumu</h4>
                <label>Maddi durum<select id="vMaddi">${veliSecenek(VELI_MADDI, v.maddi)}</select></label>
                <label>Kiminle yaşıyor<select id="vBirlikte"><option value="">Belirtilmedi</option>${veliSecenek(VELI_BIRLIKTE, v.birlikte)}</select></label>
                <label>Kardeş sayısı<input type="number" id="vKardes" min="0" max="20" value="${behKacis(String(v.kardes || ''))}" placeholder="0"></label>
                <label class="veli-onay"><input type="checkbox" id="vAyriMi" ${v.ayriMi ? 'checked' : ''}><span>Anne–baba ayrı yaşıyor / boşanmış</span></label>
            </div>

            <div class="veli-kart genis saglik">
                <h4>${llIcon('kalp')} Sağlık ve Özel Durum</h4>
                <label>Sağlık notu (alerji, kronik rahatsızlık, ilaç…)<textarea id="vSaglik" rows="2" placeholder="Varsa yazın">${behKacis(v.saglik)}</textarea></label>
                <label>Diğer özel durumlar (öğretmenin bilmesi gerekenler)<textarea id="vOzelDurum" rows="3" placeholder="Varsa yazın">${behKacis(v.ozelDurum)}</textarea></label>
            </div>

        </div>
        <p class="veli-gizlilik">${llIcon('anahtar')} Bu bilgiler yalnızca sizin hesabınızda saklanır; öğrenciler ve diğer veliler göremez.</p>`;

    document.getElementById('veliModal').style.display = 'flex';
}

function veliKaydet() {
    const s = data.levels[curLId].classes[curCId].students[curVeliStuIdx];
    if (!s) return veliKapat();
    const v = veliAyar(s);
    const al = id => { const e = document.getElementById(id); return e ? (e.value || '').trim() : ''; };

    v.anneAd = al('vAnneAd');  v.anneTel = al('vAnneTel');  v.anneMeslek = al('vAnneMeslek');  v.anneDurum = al('vAnneDurum');
    v.babaAd = al('vBabaAd');  v.babaTel = al('vBabaTel');  v.babaMeslek = al('vBabaMeslek');  v.babaDurum = al('vBabaDurum');
    v.veliKim = al('vVeliKim'); v.veliTel = al('vVeliTel'); v.evTel = al('vEvTel'); v.adres = al('vAdres');
    v.maddi = al('vMaddi'); v.birlikte = al('vBirlikte'); v.kardes = al('vKardes');
    const ay = document.getElementById('vAyriMi');
    v.ayriMi = !!(ay && ay.checked);
    v.saglik = al('vSaglik'); v.ozelDurum = al('vOzelDurum');

    save();
    renderStudents();
    veliKapat();
}

function veliKapat() {
    const m = document.getElementById('veliModal');
    if (m) m.style.display = 'none';
    curVeliStuIdx = null;
}

window.openVeliModal = openVeliModal;
window.veliKaydet = veliKaydet;
window.veliKapat = veliKapat;


/* ==========================================================================
   VELİ & DURUM TARAMASI  —  tüm seviye ve sınıflarda süzme
   ========================================================================== */

const TARAMA_SUZGECLER = [
    { id: 'maddiKotu',   ad: 'Maddi durumu kötü',        ikon: 'para',    test: v => v.maddi === 'Kötü' || v.maddi === 'Çok kötü' },
    { id: 'anneVefat',   ad: 'Annesi vefat etmiş',       ikon: 'vefat',   test: v => v.anneDurum === 'Vefat etti' },
    { id: 'babaVefat',   ad: 'Babası vefat etmiş',       ikon: 'vefat',   test: v => v.babaDurum === 'Vefat etti' },
    { id: 'yetim',       ad: 'Anne veya babası vefat',   ikon: 'kalp',    test: v => v.anneDurum === 'Vefat etti' || v.babaDurum === 'Vefat etti' },
    { id: 'ikisiDe',     ad: 'İkisi de vefat etmiş',     ikon: 'vefat',   test: v => v.anneDurum === 'Vefat etti' && v.babaDurum === 'Vefat etti' },
    { id: 'ayri',        ad: 'Anne–baba ayrı',           ikon: 'veli',    test: v => !!v.ayriMi },
    { id: 'saglik',      ad: 'Sağlık notu olanlar',      ikon: 'kalp',    test: v => !!(v.saglik && v.saglik.trim()) },
    { id: 'ozel',        ad: 'Özel durumu olanlar',      ikon: 'uyari',   test: v => !!(v.ozelDurum && v.ozelDurum.trim()) },
    { id: 'telYok',      ad: 'İletişim bilgisi eksik',   ikon: 'telefon', test: v => !(v.veliTel || v.anneTel || v.babaTel || v.evTel) },
    { id: 'bosKayit',    ad: 'Veli bilgisi hiç girilmemiş', ikon: 'not',  test: (v, s) => !veliDolu(s) }
];

let taramaSecili = 'maddiKotu';
let taramaArama = '';

/* Tüm seviye/sınıflardaki öğrencileri düz bir listeye çevirir. */
function taramaTumOgrenciler() {
    const cikti = [];
    const sira = (data.levelOrder && data.levelOrder.length) ? data.levelOrder : Object.keys(data.levels || {});
    sira.forEach(lId => {
        const lvl = data.levels[lId];
        if (!lvl) return;
        Object.keys(lvl.classes || {}).forEach(cId => {
            const snf = lvl.classes[cId];
            (snf.students || []).forEach((s, si) => {
                cikti.push({ s: s, si: si, lId: lId, cId: cId, seviye: lvl.name || '', sinif: snf.name || '' });
            });
        });
    });
    return cikti;
}

function taramaSuzgecSec(id) {
    taramaSecili = id;
    renderTarama();
}

function taramaAramaDegisti(el) {
    /* Ham metin de saklanir: profil yeniden cizilince kutuya geri yazilir. */
    window.taramaAramaHam = el.value || '';
    taramaArama = (el.value || '').toLocaleLowerCase('tr');
    renderTarama();
}

/* Tarama artik PROFILDE oldugu icin once Listelerim gorunumune gecilir,
   sonra sinif secilir ve veli penceresi acilir. */
function taramaAc(lId, cId, si) {
    curLId = lId; curCId = cId;
    try { if (typeof changeView === 'function') changeView('listelerim-section'); } catch (e) { }
    try { if (typeof initListelerim === 'function') initListelerim(); } catch (e) { }
    setTimeout(function () {
        if (typeof selectClass === 'function') { try { selectClass(lId, cId); } catch (e) { } }
        try { switchTab(0); } catch (e) { }
        setTimeout(function () { try { openVeliModal(si); } catch (e) { } }, 90);
    }, 180);
}

function renderTarama() {
    const kutu = document.getElementById('taramaSonuc');
    const cipKutu = document.getElementById('taramaCipler');
    if (!kutu) return;

    const hepsi = taramaTumOgrenciler();

    if (cipKutu) {
        cipKutu.innerHTML = TARAMA_SUZGECLER.map(f => {
            const adet = hepsi.filter(o => { try { return f.test(veliAyar(o.s), o.s); } catch (e) { return false; } }).length;
            return `<button class="tarama-cip ${f.id === taramaSecili ? 'secili' : ''}" onclick="taramaSuzgecSec('${f.id}')">
                        ${llIcon(f.ikon)} <span>${behKacis(f.ad)}</span> <b>${adet}</b>
                    </button>`;
        }).join('');
    }

    const suz = TARAMA_SUZGECLER.find(f => f.id === taramaSecili) || TARAMA_SUZGECLER[0];
    let liste = hepsi.filter(o => { try { return suz.test(veliAyar(o.s), o.s); } catch (e) { return false; } });

    if (taramaArama) {
        liste = liste.filter(o => (
            (o.s.name || '') + ' ' + o.seviye + ' ' + o.sinif + ' ' +
            (o.s.veli ? [o.s.veli.anneAd, o.s.veli.babaAd, o.s.veli.veliKim, o.s.veli.anneMeslek, o.s.veli.babaMeslek].join(' ') : '')
        ).toLocaleLowerCase('tr').includes(taramaArama));
    }

    const ozet = document.getElementById('taramaOzet');
    if (ozet) {
        ozet.innerHTML = `${llIcon(suz.ikon)} <strong>${behKacis(suz.ad)}</strong> —
            toplam <strong>${liste.length}</strong> öğrenci
            <span class="tarama-toplam">(taranan: ${hepsi.length} öğrenci, ${Object.keys(data.levels || {}).length} seviye)</span>`;
    }

    if (!liste.length) {
        kutu.innerHTML = `<p class="tarama-bos">${llIcon('tarama')} Bu ölçüte uyan öğrenci bulunamadı.</p>`;
        return;
    }

    kutu.innerHTML = `<table class="tarama-tablo">
        <thead><tr>
            <th>#</th><th>Öğrenci</th><th>Seviye</th><th>Sınıf</th>
            <th>Anne</th><th>Baba</th><th>Maddi</th><th>İletişim</th><th>Not</th><th></th>
        </tr></thead>
        <tbody>${liste.map((o, i) => {
            const v = veliAyar(o.s);
            const dur = d => d === 'Vefat etti' ? `<span class="tarama-vefat">${llIcon('vefat')} vefat</span>` : (d === 'Sağ' ? 'sağ' : '—');
            const tel = v.veliTel || v.anneTel || v.babaTel || v.evTel || '';
            const notlar = [v.saglik, v.ozelDurum].filter(Boolean).join(' • ');
            return `<tr>
                <td>${i + 1}</td>
                <td class="tarama-ad">${behKacis(o.s.name || '')}</td>
                <td>${behKacis(o.seviye)}</td>
                <td>${behKacis(o.sinif)}</td>
                <td>${behKacis(v.anneAd || '—')}<br><small>${dur(v.anneDurum)}${v.anneMeslek ? ' · ' + behKacis(v.anneMeslek) : ''}</small></td>
                <td>${behKacis(v.babaAd || '—')}<br><small>${dur(v.babaDurum)}${v.babaMeslek ? ' · ' + behKacis(v.babaMeslek) : ''}</small></td>
                <td><span class="tarama-maddi m-${behKacis((v.maddi || '').replace(/\s+/g, ''))}">${behKacis(v.maddi || '—')}</span></td>
                <td>${tel ? behKacis(tel) : '<span class="tarama-eksik">eksik</span>'}</td>
                <td class="tarama-not">${behKacis(notlar) || '—'}</td>
                <td><button class="tarama-git" onclick="taramaAc('${o.lId}','${o.cId}',${o.si})" title="Veli bilgilerini aç">${llIcon('veli')}</button></td>
            </tr>`;
        }).join('')}</tbody></table>`;
}

window.renderTarama = renderTarama;
window.taramaSuzgecSec = taramaSuzgecSec;
window.taramaAramaDegisti = taramaAramaDegisti;
window.taramaAc = taramaAc;


/* ==========================================================================
   SINIF MESAJLARI — öğretmenden toplu duyuru, öğrenciden özel cevap
   Gizlilik: hiçbir öğrenci başka bir öğrencinin adını, kodunu veya
   iletişim bilgisini göremez; öğrenciler birbirine yazamaz. Yazışma
   yalnızca öğretmen ile tek bir öğrenci arasındadır.
   ========================================================================== */

const DUYURU_SINIR = 1000;

function duyuruDepo() {
    if (typeof data === 'undefined' || !data) return [];
    if (!Array.isArray(data.mesajlar)) data.mesajlar = [];
    return data.mesajlar;
}

function duyuruAnahtar(lId, cId, si) { return lId + '|' + cId + '|' + si; }

function duyuruZaman(d) {
    const i = n => String(n).padStart(2, '0');
    return `${i(d.getDate())}.${i(d.getMonth() + 1)}.${d.getFullYear()} ${i(d.getHours())}:${i(d.getMinutes())}`;
}

/* Seçilen kapsamdaki öğrencileri çözer. */
function duyuruAlicilar(kapsam) {
    const cikti = [];
    const sira = (data.levelOrder && data.levelOrder.length) ? data.levelOrder : Object.keys(data.levels || {});
    sira.forEach(lId => {
        const lvl = data.levels[lId];
        if (!lvl) return;
        if (kapsam.tur === 'seviye' && lId !== kapsam.lId) return;
        Object.keys(lvl.classes || {}).forEach(cId => {
            if (kapsam.tur === 'sinif' && (lId !== kapsam.lId || cId !== kapsam.cId)) return;
            (lvl.classes[cId].students || []).forEach((s, si) => {
                cikti.push({ lId, cId, si, ad: s.name || '' });
            });
        });
    });
    return cikti;
}

function duyuruEtiket(kapsam) {
    if (kapsam.tur === 'tum') return 'Tüm seviyeler — bütün sınıflarım';
    const lvl = data.levels[kapsam.lId];
    if (kapsam.tur === 'seviye') return (lvl ? lvl.name : '?') + ' — bu seviyedeki tüm sınıflar';
    const snf = lvl && lvl.classes ? lvl.classes[kapsam.cId] : null;
    return (lvl ? lvl.name : '?') + ' / ' + (snf ? snf.name : '?');
}

let duyuruKapsamSecim = { tur: 'tum', lId: null, cId: null };

function duyuruKapsamCiz() {
    const kutu = document.getElementById('duyuruKapsam');
    if (!kutu) return;
    const sira = (data.levelOrder && data.levelOrder.length) ? data.levelOrder : Object.keys(data.levels || {});
    const seviyeler = sira.filter(l => data.levels[l]);

    const k = duyuruKapsamSecim;
    const seviyeSec = `<select id="duyuruSeviye" onchange="duyuruSeviyeDegisti(this.value)">
        <option value="">Seviye seçin…</option>
        ${seviyeler.map(l => `<option value="${behKacis(l)}"${l === k.lId ? ' selected' : ''}>${behKacis(data.levels[l].name || l)}</option>`).join('')}
    </select>`;

    let sinifSec = '';
    if (k.tur === 'sinif') {
        const lvl = k.lId ? data.levels[k.lId] : null;
        const sinflar = lvl ? Object.keys(lvl.classes || {}) : [];
        sinifSec = `<select id="duyuruSinif" onchange="duyuruSinifDegisti(this.value)">
            <option value="">Sınıf seçin…</option>
            ${sinflar.map(c => `<option value="${behKacis(c)}"${c === k.cId ? ' selected' : ''}>${behKacis(lvl.classes[c].name || c)}</option>`).join('')}
        </select>`;
    }

    kutu.innerHTML = `
        <label class="duyuru-secenek ${k.tur === 'tum' ? 'secili' : ''}">
            <input type="radio" name="duyuruTur" value="tum" ${k.tur === 'tum' ? 'checked' : ''} onchange="duyuruTurDegisti('tum')">
            <span>${llIcon('kitaplar')} <b>Tüm seviyeler</b> — bütün sınıflarım</span>
        </label>
        <label class="duyuru-secenek ${k.tur === 'seviye' ? 'secili' : ''}">
            <input type="radio" name="duyuruTur" value="seviye" ${k.tur === 'seviye' ? 'checked' : ''} onchange="duyuruTurDegisti('seviye')">
            <span>${llIcon('klasor')} <b>Bir seviyedeki tüm sınıflar</b></span>
        </label>
        <label class="duyuru-secenek ${k.tur === 'sinif' ? 'secili' : ''}">
            <input type="radio" name="duyuruTur" value="sinif" ${k.tur === 'sinif' ? 'checked' : ''} onchange="duyuruTurDegisti('sinif')">
            <span>${llIcon('klasorAcik')} <b>Tek bir sınıf</b></span>
        </label>
        ${(k.tur === 'seviye' || k.tur === 'sinif') ? `<div class="duyuru-secim">${seviyeSec}${sinifSec}</div>` : ''}
        <div class="duyuru-hedef" id="duyuruHedefOzet"></div>`;

    duyuruHedefOzet();
}

function duyuruHedefOzet() {
    const el = document.getElementById('duyuruHedefOzet');
    if (!el) return;
    const k = duyuruKapsamSecim;
    if ((k.tur === 'seviye' && !k.lId) || (k.tur === 'sinif' && (!k.lId || !k.cId))) {
        el.innerHTML = `<span class="duyuru-uyari">${llIcon('uyari')} Önce hedefi seçin.</span>`;
        return;
    }
    const adet = duyuruAlicilar(k).length;
    el.innerHTML = `${llIcon('kisi')} <strong>${adet}</strong> öğrenciye gidecek — <em>${behKacis(duyuruEtiket(k))}</em>`;
}

function duyuruTurDegisti(t) {
    duyuruKapsamSecim.tur = t;
    if (t === 'tum') { duyuruKapsamSecim.lId = null; duyuruKapsamSecim.cId = null; }
    if (t === 'seviye') duyuruKapsamSecim.cId = null;
    if ((t === 'seviye' || t === 'sinif') && !duyuruKapsamSecim.lId && curLId) duyuruKapsamSecim.lId = curLId;
    if (t === 'sinif' && !duyuruKapsamSecim.cId && curCId) duyuruKapsamSecim.cId = curCId;
    duyuruKapsamCiz();
}
function duyuruSeviyeDegisti(v) { duyuruKapsamSecim.lId = v || null; duyuruKapsamSecim.cId = null; duyuruKapsamCiz(); }
function duyuruSinifDegisti(v) { duyuruKapsamSecim.cId = v || null; duyuruKapsamCiz(); }

function duyuruSayacGuncelle() {
    const t = document.getElementById('duyuruMetin');
    const s = document.getElementById('duyuruSayac');
    if (t && s) {
        if (t.value.length > DUYURU_SINIR) t.value = t.value.slice(0, DUYURU_SINIR);
        s.innerText = t.value.length + ' / ' + DUYURU_SINIR;
    }
}

function duyuruDurumYaz(metin, iyi) {
    const el = document.getElementById('duyuruDurum');
    if (!el) return;
    el.className = 'duyuru-durum ' + (iyi ? 'iyi' : 'kotu');
    el.innerHTML = (iyi ? llIcon('onay') : llIcon('uyari')) + ' ' + behKacis(metin);
    setTimeout(() => { if (el) { el.innerHTML = ''; el.className = 'duyuru-durum'; } }, 5000);
}

function duyuruGonder() {
    const k = duyuruKapsamSecim;
    if ((k.tur === 'seviye' && !k.lId) || (k.tur === 'sinif' && (!k.lId || !k.cId))) {
        return duyuruDurumYaz('Önce mesajın kime gideceğini seçin.', false);
    }
    const metin = (document.getElementById('duyuruMetin').value || '').trim();
    if (!metin) return duyuruDurumYaz('Boş mesaj gönderilemez.', false);

    const alicilar = duyuruAlicilar(k);
    if (!alicilar.length) return duyuruDurumYaz('Bu kapsamda hiç öğrenci yok.', false);

    const d = new Date();
    const kayit = {
        id: 'M' + d.getTime() + '-' + Math.floor(Math.random() * 1000),
        kapsam: { tur: k.tur, lId: k.lId, cId: k.cId },
        etiket: duyuruEtiket(k),
        baslik: (document.getElementById('duyuruBaslik').value || '').trim(),
        metin: metin,
        ts: d.getTime(),
        tarih: duyuruZaman(d),
        gonderen: 'ogretmen',
        hedef: alicilar.map(a => duyuruAnahtar(a.lId, a.cId, a.si)),
        okuyan: [],
        cevaplar: []
    };

    duyuruDepo().push(kayit);
    save();

    // Bulut kopyası (öğrenci başka cihazdan bakarsa görebilsin diye)
    try {
        if (window.firebase && firebase.auth && firebase.auth().currentUser && window.db) {
            db.collection('sinifMesajlari').add({
                ogretmenUid: firebase.auth().currentUser.uid,
                mesajId: kayit.id,
                etiket: kayit.etiket,
                baslik: kayit.baslik,
                metin: kayit.metin,
                hedefSayi: alicilar.length,
                olusturma: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(e => console.warn('Duyuru bulut kaydı yapılamadı:', e));
        }
    } catch (e) { console.warn('Duyuru bulut kaydı atlandı:', e); }

    document.getElementById('duyuruMetin').value = '';
    document.getElementById('duyuruBaslik').value = '';
    duyuruSayacGuncelle();
    duyuruDurumYaz(alicilar.length + ' öğrenciye gönderildi.', true);
    duyuruGecmisCiz();
}

function duyuruSil(id) {
    llOnay('Bu mesaj tüm öğrencilerden kaldırılsın mı?', () => {
        const dep = duyuruDepo();
        const i = dep.findIndex(m => m.id === id);
        if (i > -1) dep.splice(i, 1);
        save();
        duyuruGecmisCiz();
    }, { evet: 'Kaldır' });
}

function duyuruGecmisCiz() {
    const kutu = document.getElementById('duyuruGecmis');
    if (!kutu) return;
    const liste = duyuruDepo().slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
    if (!liste.length) {
        kutu.innerHTML = `<p class="tarama-bos">${llIcon('duyuru')} Henüz mesaj göndermediniz.</p>`;
        return;
    }
    kutu.innerHTML = liste.map(m => {
        const cevapSayi = (m.cevaplar || []).length;
        const okundu = (m.okuyan || []).length;
        return `<div class="duyuru-kayit">
            <div class="duyuru-kayit-ust">
                <span class="duyuru-etiket-rozet">${behKacis(m.etiket || '')}</span>
                <span class="duyuru-tarih">${behKacis(m.tarih || '')}</span>
                <button class="duyuru-sil" onclick="duyuruSil('${m.id}')" title="Mesajı kaldır">${llIcon('cop')}</button>
            </div>
            ${m.baslik ? `<div class="duyuru-baslik">${behKacis(m.baslik)}</div>` : ''}
            <div class="duyuru-metin-oku">${behKacis(m.metin || '')}</div>
            <div class="duyuru-kayit-alt">
                ${llIcon('kisi')} ${(m.hedef || []).length} alıcı ·
                ${llIcon('onay')} ${okundu} okundu ·
                ${llIcon('not')} ${cevapSayi} cevap
                ${cevapSayi ? `<button class="duyuru-cevap-tus" onclick="duyuruCevaplar('${m.id}')">Cevapları gör</button>` : ''}
            </div>
        </div>`;
    }).join('');
}

function duyuruCevaplar(id) {
    const m = duyuruDepo().find(x => x.id === id);
    if (!m) return;
    const kutu = document.getElementById('duyuruGecmis');
    const hedef = kutu ? kutu.querySelector('[data-cevap="' + id + '"]') : null;
    if (hedef) { hedef.remove(); return; }
    const blok = document.createElement('div');
    blok.className = 'duyuru-cevap-liste';
    blok.setAttribute('data-cevap', id);
    blok.innerHTML = (m.cevaplar || []).map(c => `
        <div class="duyuru-cevap ${c.from === 'ogretmen' ? 'benim' : ''}">
            <b>${behKacis(c.from === 'ogretmen' ? 'Siz' : (c.ad || 'Öğrenci'))}</b>
            <span class="duyuru-tarih">${behKacis(c.tarih || '')}</span>
            <p>${behKacis(c.metin || '')}</p>
        </div>`).join('');
    if (kutu) kutu.appendChild(blok);
}

function renderDuyuru() {
    duyuruKapsamCiz();
    duyuruSayacGuncelle();
    duyuruGecmisCiz();
}

/* ---------- ÖĞRENCİ TARAFI ---------- */

/* Giriş yapmış öğrenciye gelen mesajlar (başka öğrenciyi asla göstermez). */
function ogrenciMesajlari() {
    let g = null;
    try { g = JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return []; }
    if (!g) return [];
    const anahtar = duyuruAnahtar(g.lId, g.cId, g.sIdx);
    return duyuruDepo()
        .filter(m => (m.hedef || []).indexOf(anahtar) > -1)
        .sort((a, b) => (b.ts || 0) - (a.ts || 0))
        .map(m => ({
            id: m.id,
            baslik: m.baslik,
            metin: m.metin,
            tarih: m.tarih,
            // Öğrenciye yalnızca kendi yazışması gösterilir.
            cevaplar: (m.cevaplar || []).filter(c => c.k === anahtar)
        }));
}

function ogrenciMesajOkundu(id) {
    let g = null;
    try { g = JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return; }
    if (!g) return;
    const m = duyuruDepo().find(x => x.id === id);
    if (!m) return;
    if (!Array.isArray(m.okuyan)) m.okuyan = [];
    const a = duyuruAnahtar(g.lId, g.cId, g.sIdx);
    if (m.okuyan.indexOf(a) === -1) { m.okuyan.push(a); save(); }
}

function ogrenciCevapYaz(id, metin) {
    let g = null;
    try { g = JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return false; }
    if (!g || !metin || !metin.trim()) return false;
    const m = duyuruDepo().find(x => x.id === id);
    if (!m) return false;
    if (!Array.isArray(m.cevaplar)) m.cevaplar = [];
    const d = new Date();
    m.cevaplar.push({
        k: duyuruAnahtar(g.lId, g.cId, g.sIdx),
        ad: g.name || 'Öğrenci',
        metin: metin.trim().slice(0, DUYURU_SINIR),
        from: 'ogrenci',
        ts: d.getTime(),
        tarih: duyuruZaman(d)
    });
    save();
    return true;
}

window.renderDuyuru = renderDuyuru;
window.duyuruGonder = duyuruGonder;
window.duyuruSil = duyuruSil;
window.duyuruCevaplar = duyuruCevaplar;
window.duyuruTurDegisti = duyuruTurDegisti;
window.duyuruSeviyeDegisti = duyuruSeviyeDegisti;
window.duyuruSinifDegisti = duyuruSinifDegisti;
window.duyuruSayacGuncelle = duyuruSayacGuncelle;
window.ogrenciMesajlari = ogrenciMesajlari;
window.ogrenciMesajOkundu = ogrenciMesajOkundu;
window.ogrenciCevapYaz = ogrenciCevapYaz;


/* ==========================================================================
   ÖĞRENCİ TARAFI — Öğretmenden gelen mesajlar
   Öğrenci yalnızca kendisine gelen mesajı ve kendi cevaplarını görür.
   Başka öğrencinin adı, numarası veya cevabı hiçbir şekilde gösterilmez.
   ========================================================================== */

function ogrMesajOkunmamis() {
    let g = null;
    try { g = JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return 0; }
    if (!g) return 0;
    const a = duyuruAnahtar(g.lId, g.cId, g.sIdx);
    return duyuruDepo().filter(m =>
        (m.hedef || []).indexOf(a) > -1 && (m.okuyan || []).indexOf(a) === -1
    ).length;
}

function ogrMesajKatman() {
    let k = document.getElementById('ogrMesajModal');
    if (k) return k;
    k = document.createElement('div');
    k.id = 'ogrMesajModal';
    k.className = 'veli-modal';
    k.style.display = 'none';
    k.innerHTML = `
        <div class="veli-modal-kutu" style="max-width:760px;">
            <div class="veli-modal-bas">
                <h3>${llIcon('duyuru')} Öğretmenimden Mesajlar</h3>
                <button class="veli-kapat-tus" onclick="ogrMesajKapat()" title="Kapat" aria-label="Kapat">&times;</button>
            </div>
            <div id="ogrMesajGovde" class="veli-modal-govde"></div>
        </div>`;
    (typeof llRootEl === 'function' ? llRootEl() : document.body).appendChild(k);
    return k;
}

function ogrMesajCiz() {
    const govde = document.getElementById('ogrMesajGovde');
    if (!govde) return;
    const th = (typeof ogrenciThread === 'function') ? ogrenciThread() : [];
    const balonlar = th.length ? th.map(b => `
        <div class="im-balon ${b.from === 'ogretmen' ? 'ogrenci' : 'benim'}">
            ${b.baslik ? `<b class="im-balon-baslik">${behKacis(b.baslik)}</b>` : ''}
            <p>${behKacis(b.metin || '')}</p>
            <span class="im-balon-tarih">${behKacis(b.from === 'ogretmen' ? 'Öğretmenim' : 'Ben')} · ${behKacis(b.tarih || '')}</span>
        </div>`).join('')
        : `<p class="im-sohbet-bos">${llIcon('duyuru')} Henüz mesajın yok. Öğretmenine buradan yazabilirsin.</p>`;
    govde.innerHTML = `
        <div class="im-sohbet ogr">${balonlar}</div>
        <div class="im-yaz">
            <input type="text" id="ogrYeniMesaj" maxlength="1000" placeholder="Öğretmenine mesaj yaz…"
                onkeypress="if(event.key==='Enter') ogrCevapGonder()">
            <button onclick="ogrCevapGonder()">${llIcon('gonder')} Gönder</button>
        </div>
        <p class="veli-gizlilik">${llIcon('anahtar')} Bu yazışmayı yalnızca sen ve öğretmenin görebilir. Sınıftaki diğer öğrenciler mesajlarını, adını veya numaranı göremez; sen de onlarınkini göremezsin.</p>`;
    const kut = govde.querySelector('.im-sohbet');
    if (kut) kut.scrollTop = kut.scrollHeight;
}

/* Öğrenci gönder tuşu: yeni mesaj (id verilirse eski cevap kutusu da çalışır). */
function ogrCevapGonder(id) {
    if (id) {
        const eski = document.getElementById('ogrCvp-' + id);
        if (eski) {
            const m2 = (eski.value || '').trim();
            if (m2 && ogrenciCevapYaz(id, m2)) { eski.value = ''; ogrMesajCiz(); }
            return;
        }
    }
    const el = document.getElementById('ogrYeniMesaj');
    if (!el) return;
    const metin = (el.value || '').trim();
    if (!metin) return;
    if (typeof ogrenciYeniMesaj === 'function' && ogrenciYeniMesaj(metin)) { el.value = ''; ogrMesajCiz(); }
}

function ogrMesajAc() {
    const k = ogrMesajKatman();
    ogrMesajCiz();
    k.style.display = 'flex';
    // Açılınca hepsi okundu sayılır
    ogrenciMesajlari().forEach(m => ogrenciMesajOkundu(m.id));
    const r = document.getElementById('ogrMesajRozet');
    if (r) r.style.display = 'none';
}

function ogrMesajKapat() {
    const k = document.getElementById('ogrMesajModal');
    if (k) k.style.display = 'none';
    if (typeof renderStudentDashboardContent === 'function') renderStudentDashboardContent();
}

window.ogrMesajAc = ogrMesajAc;
window.ogrMesajKapat = ogrMesajKapat;
window.ogrCevapGonder = ogrCevapGonder;
window.ogrMesajOkunmamis = ogrMesajOkunmamis;


/* ==========================================================================
   İLETİŞİM MERKEZİ — kulaklık (İletişim) pop-up'ının içine gömülür.
   Öğretmen/yönetici: Seviyeler → Sınıflar → Öğrenciler şeklinde açılır.
     • Seviyeye mesaj  → o seviyedeki BÜTÜN sınıflara gider
     • Sınıfa mesaj    → yalnızca o sınıfa gider
     • Öğrenciye mesaj → yalnızca o öğrenciye gider (birebir yazışma)
   Gizlilik: hiçbir öğrenci başka öğrencinin adını, numarasını veya mesajını
   göremez; öğrenciler birbirine yazamaz. Öğrenci yalnızca öğretmenine yazar.
   ========================================================================== */

let imDurum = { gorunum: 'seviye', lId: null, cId: null, si: null, tur: null };

/* data henüz yüklenmediyse (Listelerim hiç açılmadıysa) yerel kopyadan al. */
function imVeriYukle() {
    try {
        if (typeof data !== 'undefined' && data && data.levels && Object.keys(data.levels).length) return true;
        const s = localStorage.getItem('schoolData');
        if (s) {
            const p = JSON.parse(s);
            if (p && typeof p === 'object' && p.levels) {
                if (typeof data === 'undefined' || !data || !data.levels || !Object.keys(data.levels).length) data = p;
                return Object.keys(p.levels).length > 0;
            }
        }
    } catch (e) { }
    return false;
}
/* ==========================================================================
   YETKI KILIDI — Kod ile giris yapmis bir ogrenci oturumu varsa, ogretmen
   mesajlasma yuzeyinin TAMAMI kapalidir. Ogrenci yalnizca kendi kutusunu
   (ogrMesajAc) kullanabilir; seviye/sinif/ogrenci listelerine, toplu mesaja
   ve mesaj silmeye erisemez.
   ========================================================================== */
function imOgrenciOturumu() {
    try {
        /* 1) Kod ile acilmis yerel ogrenci oturumu -> her kosulda ogrenci. */
        if (localStorage.getItem('logged_student')) return true;
        /* 2) Firebase'de rolu "student" (veya misafir) olan hesap HER ZAMAN
              ogrencidir. Yalnizca 'teacher' / 'admin' ogretmen yuzeyini gorur.
              Bu kontrol sart; cunku e-posta ile giren ogrencide (1) numarali
              anahtar henuz bulunmayabilir -> eskiden buradan sizinti oluyordu. */
        if (typeof appState !== 'undefined' && appState.userRole)
            return (appState.userRole !== 'teacher' && appState.userRole !== 'admin');
        /* 3) Rol hic cozulmediyse kapali tarafa dus. */
        return true;
    } catch (e) { return true; }
}
function imOgretmenMi() { return !imOgrenciOturumu(); }
window.imOgrenciOturumu = imOgrenciOturumu;
window.imOgretmenMi = imOgretmenMi;

function imVar() { return imOgretmenMi() && imVeriYukle(); }

function imJs(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function imSeviyeler() {
    if (!imVeriYukle()) return [];
    const sira = (data.levelOrder && data.levelOrder.length) ? data.levelOrder : Object.keys(data.levels || {});
    return sira.filter(l => data.levels[l]);
}
function imSiniflar(lId) {
    const lvl = data.levels ? data.levels[lId] : null;
    return lvl ? Object.keys(lvl.classes || {}) : [];
}
function imOgrenciler(lId, cId) {
    const lvl = data.levels ? data.levels[lId] : null;
    const snf = lvl && lvl.classes ? lvl.classes[cId] : null;
    return snf ? (snf.students || []) : [];
}
function imSeviyeAd(lId) { const l = data.levels ? data.levels[lId] : null; return l ? (l.name || lId) : lId; }
function imSinifAd(lId, cId) {
    const l = data.levels ? data.levels[lId] : null;
    const c = l && l.classes ? l.classes[cId] : null;
    return c ? (c.name || cId) : cId;
}

/* ---------- okunmamış sayaçları (öğrenciden öğretmene gelenler) ---------- */

function imOkunmamisAnahtar(K) {
    let n = 0;
    duyuruDepo().forEach(m => {
        if ((m.hedef || []).indexOf(K) === -1) return;
        if (m.gonderen === 'ogrenci' && !m.ogretmenOkudu) n++;
        (m.cevaplar || []).forEach(c => {
            if (c.k === K && c.from !== 'ogretmen' && !c.ogretmenOkudu) n++;
        });
    });
    return n;
}
function imOkunmamisSinif(lId, cId) {
    let n = 0;
    imOgrenciler(lId, cId).forEach((s, si) => { n += imOkunmamisAnahtar(duyuruAnahtar(lId, cId, si)); });
    return n;
}
function imOkunmamisSeviye(lId) {
    let n = 0;
    imSiniflar(lId).forEach(cId => { n += imOkunmamisSinif(lId, cId); });
    return n;
}
function imOkunmamisToplam() {
    if (!imOgretmenMi()) return 0;
    if (!imVeriYukle()) return 0;
    let n = 0;
    imSeviyeler().forEach(lId => { n += imOkunmamisSeviye(lId); });
    return n;
}
function imRozet(n) { return n ? `<span class="im-rozet">${n}</span>` : ''; }

function imOkuduIsaretle(K) {
    let dokun = false;
    duyuruDepo().forEach(m => {
        if ((m.hedef || []).indexOf(K) === -1) return;
        if (m.gonderen === 'ogrenci' && !m.ogretmenOkudu) { m.ogretmenOkudu = true; dokun = true; }
        (m.cevaplar || []).forEach(c => {
            if (c.k === K && c.from !== 'ogretmen' && !c.ogretmenOkudu) { c.ogretmenOkudu = true; dokun = true; }
        });
    });
    if (dokun) save();
}

/* ---------- birebir yazışma dizisi ---------- */

/* NOT: imThread ortak okuma yardimcisidir; ogrenci kutusu da (ogrenciThread)
   bunu kullanir. Gizlilik anahtar (K) ile saglanir, yetki kilidi burada degil
   cizim/gonderim fonksiyonlarindadir. */
function imThread(K) {
    const out = [];
    duyuruDepo().forEach(m => {
        if ((m.hedef || []).indexOf(K) === -1) return;
        out.push({
            tip: 'mesaj', id: m.id,
            from: (m.gonderen === 'ogrenci') ? 'ogrenci' : 'ogretmen',
            baslik: m.baslik || '', metin: m.metin || '',
            ts: m.ts || 0, tarih: m.tarih || '',
            toplu: (m.hedef || []).length > 1,
            etiket: m.etiket || ''
        });
        (m.cevaplar || []).forEach(c => {
            if (c.k !== K) return;
            out.push({
                tip: 'cevap', id: m.id,
                from: (c.from === 'ogretmen') ? 'ogretmen' : 'ogrenci',
                baslik: '', metin: c.metin || '', ts: c.ts || 0, tarih: c.tarih || '', toplu: false, etiket: ''
            });
        });
    });
    return out.sort((a, b) => (a.ts || 0) - (b.ts || 0));
}

/* ---------- gezinme ---------- */

function imGit(gorunum, lId, cId, si) {
    if (!imOgretmenMi()) return imCiz();
    imDurum = { gorunum: gorunum, lId: lId || null, cId: cId || null, si: (si == null ? null : si), tur: imDurum.tur };
    imCiz();
}
function imGeri() {
    if (!imOgretmenMi()) return imCiz();
    const d = imDurum;
    if (d.gorunum === 'thread') return imGit('ogrenci', d.lId, d.cId);
    if (d.gorunum === 'toplu') {
        if (d.tur === 'sinif') return imGit('sinif', d.lId);
        if (d.tur === 'seviye') return imGit('seviye');
        return imGit('seviye');
    }
    if (d.gorunum === 'ogrenci') return imGit('sinif', d.lId);
    if (d.gorunum === 'sinif') return imGit('seviye');
    imGit('seviye');
}
function imToplu(tur, lId, cId) {
    if (!imOgretmenMi()) return imCiz();
    imDurum = { gorunum: 'toplu', tur: tur, lId: lId || null, cId: cId || null, si: null };
    imCiz();
}

/* ---------- çizim ---------- */

function imYol() {
    const d = imDurum;
    const par = [`<button class="im-yol-tus" onclick="imGit('seviye')">${llIcon('kitaplar')} Seviyeler</button>`];
    if (d.lId) par.push(`<button class="im-yol-tus" onclick="imGit('sinif','${imJs(d.lId)}')">${behKacis(imSeviyeAd(d.lId))}</button>`);
    if (d.cId) par.push(`<button class="im-yol-tus" onclick="imGit('ogrenci','${imJs(d.lId)}','${imJs(d.cId)}')">${behKacis(imSinifAd(d.lId, d.cId))}</button>`);
    if (d.gorunum === 'thread' && d.si != null) {
        const s = imOgrenciler(d.lId, d.cId)[d.si];
        par.push(`<span class="im-yol-son">${behKacis(s ? s.name : 'Öğrenci')}</span>`);
    }
    if (d.gorunum === 'toplu') par.push(`<span class="im-yol-son">Toplu mesaj</span>`);
    return `<div class="im-yol">${par.join('<span class="im-yol-ayrac">›</span>')}</div>`;
}

function imCiz() {
    const kok = document.getElementById('imGovde');
    if (!kok) return;
    /* Ogrenci oturumu acikken ogretmen paneli hicbir sekilde cizilmez. */
    if (!imOgretmenMi()) {
        imDurum = { gorunum: 'seviye', lId: null, cId: null, si: null, tur: null };
        kok.innerHTML = `<div class="im-bos">${llIcon('uyari')}
            <p>Bu bölüm yalnızca öğretmen ve yöneticiler içindir.</p>
            <p class="im-bos-alt">Öğretmeninize mesaj yazmak için öğrenci panelindeki
            “Öğretmenimden Mesajlar” bölümünü kullanın.</p></div>`;
        kok.style.display = 'none';
        return;
    }
    if (!imVeriYukle()) {
        kok.innerHTML = `<div class="im-bos">${llIcon('uyari')}
            <p>Henüz seviye ve sınıf oluşturmadınız.</p>
            <p class="im-bos-alt">Listelerim bölümünden seviye ve sınıf ekleyince öğrencilerinize buradan mesaj gönderebilirsiniz.</p></div>`;
        return;
    }
    const d = imDurum;
    if (d.gorunum === 'sinif' && !d.lId) d.gorunum = 'seviye';
    if (d.gorunum === 'ogrenci' && (!d.lId || !d.cId)) d.gorunum = 'seviye';
    let govde = '';
    if (d.gorunum === 'seviye') govde = imSeviyeListesi();
    else if (d.gorunum === 'sinif') govde = imSinifListesi();
    else if (d.gorunum === 'ogrenci') govde = imOgrenciListesi();
    else if (d.gorunum === 'thread') govde = imThreadCiz();
    else if (d.gorunum === 'toplu') govde = imTopluCiz();
    /* Kok gorunumde yol cizgisi gereksiz (tek parca) -> gizle. */
    kok.innerHTML = (d.gorunum === 'seviye' ? '' : imYol()) + govde;
    const kut = kok.querySelector('.im-sohbet');
    if (kut) kut.scrollTop = kut.scrollHeight;
}

function imSeviyeListesi() {
    const sev = imSeviyeler();
    if (!sev.length) return `<div class="im-bos">${llIcon('uyari')}<p>Hiç seviye yok.</p></div>`;
    const satir = sev.map(lId => {
        const sn = imSiniflar(lId);
        let ogr = 0; sn.forEach(c => ogr += imOgrenciler(lId, c).length);
        const ok = imOkunmamisSeviye(lId);
        return `<div class="im-satir">
            <button class="im-satir-ana" onclick="imGit('sinif','${imJs(lId)}')">
                <span class="im-ikon">${llIcon('klasor')}</span>
                <span class="im-metin"><b>${behKacis(imSeviyeAd(lId))}</b>
                    <em>${sn.length} sınıf · ${ogr} öğrenci</em></span>
                ${imRozet(ok)}
                <span class="im-ok">›</span>
            </button>
            <button class="im-mesaj-tus" onclick="imToplu('seviye','${imJs(lId)}')" title="Bu seviyedeki tüm sınıflara mesaj">
                ${llIcon('duyuru')} Seviyeye yaz
            </button>
        </div>`;
    }).join('');
    return `<div class="im-baslik-satir">
            <h4>${llIcon('kitaplar')} Seviyeler</h4>
            <button class="im-hepsi-tus" onclick="imToplu('tum')">${llIcon('duyuru')} Tüm öğrencilerime yaz</button>
        </div>
        <p class="im-aciklama">Bir seviyeye yazarsanız o seviyedeki bütün sınıflara gider. Sınıfa girip tek bir öğrenciye de yazabilirsiniz.</p>
        <div class="im-liste">${satir}</div>`;
}

function imSinifListesi() {
    const lId = imDurum.lId;
    const sn = imSiniflar(lId);
    const satir = sn.length ? sn.map(cId => {
        const ok = imOkunmamisSinif(lId, cId);
        return `<div class="im-satir">
            <button class="im-satir-ana" onclick="imGit('ogrenci','${imJs(lId)}','${imJs(cId)}')">
                <span class="im-ikon">${llIcon('klasorAcik')}</span>
                <span class="im-metin"><b>${behKacis(imSinifAd(lId, cId))}</b>
                    <em>${imOgrenciler(lId, cId).length} öğrenci</em></span>
                ${imRozet(ok)}
                <span class="im-ok">›</span>
            </button>
            <button class="im-mesaj-tus" onclick="imToplu('sinif','${imJs(lId)}','${imJs(cId)}')" title="Yalnızca bu sınıfa mesaj">
                ${llIcon('duyuru')} Sınıfa yaz
            </button>
        </div>`;
    }).join('') : `<div class="im-bos">${llIcon('uyari')}<p>Bu seviyede sınıf yok.</p></div>`;
    return `<div class="im-baslik-satir">
            <h4>${llIcon('klasor')} ${behKacis(imSeviyeAd(lId))}</h4>
            <button class="im-hepsi-tus" onclick="imToplu('seviye','${imJs(lId)}')">${llIcon('duyuru')} Seviyenin tamamına yaz</button>
        </div>
        <div class="im-liste">${satir}</div>`;
}

function imOgrenciListesi() {
    const { lId, cId } = imDurum;
    const ogr = imOgrenciler(lId, cId);
    const satir = ogr.length ? ogr.map((s, si) => {
        const K = duyuruAnahtar(lId, cId, si);
        const ok = imOkunmamisAnahtar(K);
        const th = imThread(K);
        const son = th.length ? th[th.length - 1] : null;
        const onizle = son ? ((son.from === 'ogretmen' ? 'Siz: ' : '') + (son.metin || '').slice(0, 46)) : 'Henüz yazışma yok';
        return `<div class="im-satir">
            <button class="im-satir-ana" onclick="imGit('thread','${imJs(lId)}','${imJs(cId)}',${si})">
                <span class="im-ikon">${llIcon('kisi')}</span>
                <span class="im-metin"><b>${behKacis(s.name || ('Öğrenci ' + (si + 1)))}</b>
                    <em>${behKacis(onizle)}</em></span>
                ${imRozet(ok)}
                <span class="im-ok">›</span>
            </button>
        </div>`;
    }).join('') : `<div class="im-bos">${llIcon('uyari')}<p>Bu sınıfta öğrenci yok.</p></div>`;
    return `<div class="im-baslik-satir">
            <h4>${llIcon('klasorAcik')} ${behKacis(imSinifAd(lId, cId))}</h4>
            <button class="im-hepsi-tus" onclick="imToplu('sinif','${imJs(lId)}','${imJs(cId)}')">${llIcon('duyuru')} Sınıfın tamamına yaz</button>
        </div>
        <p class="im-aciklama">Bir öğrenciye tıklayınca yalnızca onunla yazışırsınız. Diğer öğrenciler bu yazışmayı göremez.</p>
        <div class="im-liste">${satir}</div>`;
}

function imThreadCiz() {
    const { lId, cId, si } = imDurum;
    const s = imOgrenciler(lId, cId)[si];
    if (!s) return `<div class="im-bos">${llIcon('uyari')}<p>Öğrenci bulunamadı.</p></div>`;
    const K = duyuruAnahtar(lId, cId, si);
    imOkuduIsaretle(K);
    const th = imThread(K);
    const balon = th.length ? th.map(b => `
        <div class="im-balon ${b.from === 'ogretmen' ? 'benim' : 'ogrenci'}">
            ${b.toplu ? `<span class="im-toplu-rozet">${llIcon('duyuru')} ${behKacis(b.etiket || 'Toplu mesaj')}</span>` : ''}
            ${b.baslik ? `<b class="im-balon-baslik">${behKacis(b.baslik)}</b>` : ''}
            <p>${behKacis(b.metin)}</p>
            <span class="im-balon-tarih">${behKacis(b.tarih)}</span>
        </div>`).join('') : `<p class="im-sohbet-bos">${llIcon('duyuru')} Henüz yazışma yok. İlk mesajı siz yazın.</p>`;
    return `<div class="im-baslik-satir">
            <h4>${llIcon('kisi')} ${behKacis(s.name || 'Öğrenci')}</h4>
            <span class="im-etiket-kucuk">${behKacis(imSeviyeAd(lId))} / ${behKacis(imSinifAd(lId, cId))}</span>
        </div>
        <div class="im-sohbet">${balon}</div>
        <div class="im-yaz">
            <input type="text" id="imYaziAlani" maxlength="1000" placeholder="${behKacis(s.name || 'Öğrenci')} için mesaj yazın…"
                onkeypress="if(event.key==='Enter') imBireBirGonder()">
            <button onclick="imBireBirGonder()">${llIcon('gonder')} Gönder</button>
        </div>
        <p class="im-gizlilik">${llIcon('anahtar')} Bu yazışmayı yalnızca siz ve bu öğrenci görebilir. Sınıftaki diğer öğrenciler göremez.</p>`;
}

function imTopluCiz() {
    const d = imDurum;
    const kapsam = { tur: d.tur, lId: d.lId, cId: d.cId };
    const alici = duyuruAlicilar(kapsam);
    const etiket = duyuruEtiket(kapsam);
    const gecmis = duyuruDepo()
        .filter(m => m.gonderen !== 'ogrenci' && (m.hedef || []).length > 1 && m.kapsam &&
            m.kapsam.tur === d.tur && (m.kapsam.lId || null) === (d.lId || null) && (m.kapsam.cId || null) === (d.cId || null))
        .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    const gec = gecmis.length ? gecmis.map(m => `
        <div class="im-gecmis-kayit">
            <div class="im-gecmis-ust">
                <span class="im-tarih">${behKacis(m.tarih || '')}</span>
                <button class="im-sil" onclick="imMesajSil('${imJs(m.id)}')" title="Mesajı geri çek">${llIcon('cop')}</button>
            </div>
            ${m.baslik ? `<b>${behKacis(m.baslik)}</b>` : ''}
            <p>${behKacis(m.metin || '')}</p>
            <div class="im-gecmis-alt">${llIcon('kisi')} ${(m.hedef || []).length} alıcı · ${llIcon('onay')} ${(m.okuyan || []).length} okudu</div>
        </div>`).join('') : `<p class="im-sohbet-bos">${llIcon('duyuru')} Bu kapsama henüz mesaj göndermediniz.</p>`;
    return `<div class="im-baslik-satir">
            <h4>${llIcon('duyuru')} Toplu mesaj</h4>
        </div>
        <div class="im-hedef-kutu">${llIcon('hedef')} <b>${alici.length}</b> öğrenciye gidecek — <em>${behKacis(etiket)}</em></div>
        <input type="text" id="imTopluBaslik" class="im-input" maxlength="80" placeholder="Başlık (isteğe bağlı)">
        <textarea id="imTopluMetin" class="im-metin" rows="4" maxlength="1000" placeholder="Mesajınızı yazın…" oninput="imSayac()"></textarea>
        <div class="im-yaz-alt">
            <span id="imSayacYazi" class="im-sayac">0 / 1000</span>
            <button class="im-gonder-tus" onclick="imTopluGonder()">${llIcon('gonder')} Gönder</button>
        </div>
        <div id="imDurumYazi" class="im-durum"></div>
        <p class="im-gizlilik">${llIcon('anahtar')} Toplu mesajda öğrenciler birbirinin adını, numarasını veya cevabını göremez. Cevaplar yalnızca size gelir.</p>
        <h5 class="im-alt-baslik">${llIcon('saat')} Bu kapsama gönderilenler</h5>
        <div class="im-gecmis">${gec}</div>`;
}

function imSayac() {
    const t = document.getElementById('imTopluMetin');
    const s = document.getElementById('imSayacYazi');
    if (t && s) s.innerText = t.value.length + ' / ' + DUYURU_SINIR;
}
function imDurumYaz(metin, iyi) {
    const el = document.getElementById('imDurumYazi');
    if (!el) return;
    el.className = 'im-durum ' + (iyi ? 'iyi' : 'kotu');
    el.innerHTML = (iyi ? llIcon('onay') : llIcon('uyari')) + ' ' + behKacis(metin);
    setTimeout(() => { const e2 = document.getElementById('imDurumYazi'); if (e2) { e2.innerHTML = ''; e2.className = 'im-durum'; } }, 4000);
}

function imKayitYaz(kayit) {
    duyuruDepo().push(kayit);
    if (duyuruDepo().length > 4000) duyuruDepo().splice(0, duyuruDepo().length - 4000);
    save();
}

function imBireBirGonder() {
    if (!imOgretmenMi()) return;
    const { lId, cId, si } = imDurum;
    const el = document.getElementById('imYaziAlani');
    if (!el) return;
    const metin = (el.value || '').trim();
    if (!metin) return;
    const s = imOgrenciler(lId, cId)[si];
    if (!s) return;
    const d = new Date();
    imKayitYaz({
        id: 'M' + d.getTime() + '-' + Math.floor(Math.random() * 1000),
        kapsam: { tur: 'ogrenci', lId: lId, cId: cId, si: si },
        etiket: imSeviyeAd(lId) + ' / ' + imSinifAd(lId, cId) + ' — ' + (s.name || 'Öğrenci'),
        baslik: '',
        metin: metin.slice(0, DUYURU_SINIR),
        ts: d.getTime(),
        tarih: duyuruZaman(d),
        gonderen: 'ogretmen',
        ozel: true,
        hedef: [duyuruAnahtar(lId, cId, si)],
        okuyan: [],
        cevaplar: []
    });
    el.value = '';
    imCiz();
}

function imTopluGonder() {
    if (!imOgretmenMi()) return;
    const d0 = imDurum;
    const kapsam = { tur: d0.tur, lId: d0.lId, cId: d0.cId };
    const metinEl = document.getElementById('imTopluMetin');
    const metin = metinEl ? (metinEl.value || '').trim() : '';
    if (!metin) return imDurumYaz('Boş mesaj gönderilemez.', false);
    const alicilar = duyuruAlicilar(kapsam);
    if (!alicilar.length) return imDurumYaz('Bu kapsamda hiç öğrenci yok.', false);
    const d = new Date();
    const basEl = document.getElementById('imTopluBaslik');
    const kayit = {
        id: 'M' + d.getTime() + '-' + Math.floor(Math.random() * 1000),
        kapsam: { tur: kapsam.tur, lId: kapsam.lId, cId: kapsam.cId },
        etiket: duyuruEtiket(kapsam),
        baslik: basEl ? (basEl.value || '').trim() : '',
        metin: metin.slice(0, DUYURU_SINIR),
        ts: d.getTime(),
        tarih: duyuruZaman(d),
        gonderen: 'ogretmen',
        hedef: alicilar.map(a => duyuruAnahtar(a.lId, a.cId, a.si)),
        okuyan: [],
        cevaplar: []
    };
    imKayitYaz(kayit);
    try {
        if (window.firebase && firebase.auth && firebase.auth().currentUser && window.db) {
            db.collection('sinifMesajlari').add({
                ogretmenUid: firebase.auth().currentUser.uid,
                mesajId: kayit.id, etiket: kayit.etiket, baslik: kayit.baslik, metin: kayit.metin,
                hedefSayi: alicilar.length,
                olusturma: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(e => console.warn('Toplu mesaj bulut kaydı yapılamadı:', e));
        }
    } catch (e) { }
    if (metinEl) metinEl.value = '';
    if (basEl) basEl.value = '';
    imCiz();
    imDurumYaz(alicilar.length + ' öğrenciye gönderildi.', true);
}

function imMesajSil(id) {
    if (!imOgretmenMi()) return;
    llOnay('Bu mesaj tüm öğrencilerden kaldırılsın mı?', () => {
        const dep = duyuruDepo();
        const i = dep.findIndex(m => m.id === id);
        if (i > -1) dep.splice(i, 1);
        save();
        imCiz();
    }, { evet: 'Kaldır' });
}

/* Pop-up açıldığında çağrılır. */
function imAcildi() {
    if (!imOgretmenMi()) return imCiz();
    if (!imDurum || !imDurum.gorunum) imDurum = { gorunum: 'seviye', lId: null, cId: null, si: null, tur: null };
    if (imDurum.gorunum === 'toplu') imDurum.gorunum = 'seviye';
    imCiz();
}

window.imVar = imVar;
window.imOgretmenMi = imOgretmenMi;
window.imOgrenciOturumu = imOgrenciOturumu;
window.imAcildi = imAcildi;
window.imCiz = imCiz;
window.imGit = imGit;
window.imGeri = imGeri;
window.imToplu = imToplu;
window.imTopluGonder = imTopluGonder;
window.imBireBirGonder = imBireBirGonder;
window.imMesajSil = imMesajSil;
window.imSayac = imSayac;
window.imOkunmamisToplam = imOkunmamisToplam;
window.imThread = imThread;

/* ---------- ÖĞRENCİ: öğretmenine yeni mesaj yazabilir ---------- */

function ogrenciYeniMesaj(metin) {
    let g = null;
    try { g = JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return false; }
    if (!g || !metin || !metin.trim()) return false;
    if (typeof data === 'undefined' || !data) { try { data = JSON.parse(localStorage.getItem('schoolData') || 'null'); } catch (e) { } }
    if (!data) return false;
    const d = new Date();
    duyuruDepo().push({
        id: 'S' + d.getTime() + '-' + Math.floor(Math.random() * 1000),
        kapsam: { tur: 'ogrenci', lId: g.lId, cId: g.cId, si: g.sIdx },
        etiket: 'Öğrenciden mesaj',
        baslik: '',
        metin: metin.trim().slice(0, DUYURU_SINIR),
        ts: d.getTime(),
        tarih: duyuruZaman(d),
        gonderen: 'ogrenci',
        ad: g.name || 'Öğrenci',
        ozel: true,
        ogretmenOkudu: false,
        hedef: [duyuruAnahtar(g.lId, g.cId, g.sIdx)],
        okuyan: [duyuruAnahtar(g.lId, g.cId, g.sIdx)],
        cevaplar: []
    });
    save();
    return true;
}
window.ogrenciYeniMesaj = ogrenciYeniMesaj;

/* Öğrencinin kendi yazışma dizisi — yalnızca kendisine gelenler + kendi yazdıkları. */
function ogrenciThread() {
    let g = null;
    try { g = JSON.parse(localStorage.getItem('logged_student') || 'null'); } catch (e) { return []; }
    if (!g) return [];
    return imThread(duyuruAnahtar(g.lId, g.cId, g.sIdx));
}
window.ogrenciThread = ogrenciThread;
