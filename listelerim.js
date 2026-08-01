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
takvim: '<rect x="3" y="5" width="18" height="16.2" rx="2.2" fill="#ecf0f1"/><path d="M3 5a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 5v3.6H3z" fill="#e74c3c"/><rect x="6.6" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#c0392b"/><rect x="15.2" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#c0392b"/><g fill="#bdc3c7"><rect x="6" y="11" width="3" height="2.6" rx=".6"/><rect x="10.5" y="11" width="3" height="2.6" rx=".6"/><rect x="15" y="11" width="3" height="2.6" rx=".6"/><rect x="6" y="15.4" width="3" height="2.6" rx=".6"/></g><rect class="li-gun" x="10.5" y="15.4" width="3" height="2.6" rx=".6" fill="#3498db"/>',
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
okul: '<path d="M12 2.2l9.4 5.2v1.4H2.6V7.4z" fill="#c0392b"/><path d="M4.4 8.8h15.2v12.6H4.4z" fill="#ecf0f1"/><rect x="10.2" y="14.4" width="3.6" height="7" fill="#8d6e63"/><g fill="#3498db"><rect x="6" y="11.4" width="3" height="3" rx=".5"/><rect x="15" y="11.4" width="3" height="3" rx=".5"/><rect x="6" y="16.4" width="3" height="3" rx=".5"/><rect x="15" y="16.4" width="3" height="3" rx=".5"/></g><g class="li-bayrakcik"><line x1="12" y1="1" x2="12" y2="5" stroke="#7f8c8d" stroke-width="1.2"/><path d="M12.4 1.4h3.4l-.8 1.2.8 1.2h-3.4z" fill="#e74c3c"/></g>',
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
takvimGun: '<rect x="3" y="5" width="18" height="16.2" rx="2.2" fill="#ecf0f1"/><path d="M3 5a2.2 2.2 0 0 1 2.2-2.2h13.6A2.2 2.2 0 0 1 21 5v3.6H3z" fill="#8e44ad"/><rect x="6.6" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#6c3483"/><rect x="15.2" y="1.6" width="2.2" height="4.4" rx="1.1" fill="#6c3483"/><g class="li-gun2"><rect x="9.4" y="11.6" width="5.2" height="5.2" rx="1" fill="#9b59b6"/></g>',
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
function initListelerim(){ try{ var b=document.getElementById('login-nav-btn'); if(b) b.style.display='none'; var u=(window.firebase&&firebase.auth&&firebase.auth().currentUser); if(u && typeof verileriGetir==='function' && window._llLoadedUid !== u.uid){ window._llLoadedUid = u.uid; verileriGetir(u.uid); } setTimeout(function(){ if(typeof syncLevelActions==='function') syncLevelActions(); }, 900); }catch(e){console.error('initListelerim',e);} }
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
// Eski switchTab ve showTab fonksiyonlarını SİLİP bunu yapıştırın
function switchTab(idx) {
    // 1. Tüm butonlardan ve panellerden 'active' sınıfını kaldır
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    // 2. Tıklanan butonu aktif yap
    if (tabs[idx]) {
        tabs[idx].classList.add('active');
    }

    // 3. Butonun onclick içindeki ID'yi bul veya index ile eşleştir
    // HTML'deki sıranıza göre manuel eşleştirme (Kaymayı önleyen kesin çözüm):
    let panelId = "";
    switch(idx) {
        case 0: panelId = "tab0"; break; // Öğrenciler
        case 1: panelId = "tab1"; break; // Performans
        case 2: panelId = "tab2"; break; // Sınavlar
        case 3: panelId = "tab3"; break; // Genel Sonuç
        case 4: panelId = "tab4"; break; // Kurayla Seç
        case 5: panelId = "tab9"; break; // Görev Gönder (Sıralamadaki yeri 5)
        case 6: panelId = "tab5"; break; // Geri Sayım
        case 7: panelId = "tab6"; break; // Kronometre
        case 8: panelId = "tab7"; break; // Takım Oluştur
        case 9: panelId = "tab8"; break; // Haftalık Plan
        case 10: panelId = "tab10"; break; // Veli & Durum (tüm seviyeler)
        case 11: panelId = "tab11"; break; // Etkinlikler (oyun/gorev gelisimi)
        // Sınıf Mesajları sekmesi kaldırıldı -> İletişim (kulaklık) pop-up'ına taşındı
    }

    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // 4. Veri render işlemlerini tetikle
    if(panelId === 'tab0') renderStudents();
    if(panelId === 'tab1') renderGrades('hw');
    if(panelId === 'tab2') renderGrades('ex');
    if(panelId === 'tab3') renderResults();
    if(panelId === 'tab4') renderActivityStatus();
    if(panelId === 'tab8') renderPlan();
    if(panelId === 'tab9') { /* Görev Gönder: yeni görev sistemi (gorev.js) */
        if (window.GV && GV.sekmeGorevCiz) GV.sekmeGorevCiz(); else renderMissions();
    }
    if(panelId === 'tab11' && window.GV && GV.sekmeEtkinlikCiz) GV.sekmeEtkinlikCiz();
    if(panelId === 'tab10') renderTarama();  // Veli & Durum taraması
}


function selectClass(lId, cId, element) {
    if (!data || !data.levels[lId]) return;

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
    
    if (viewTitle) {
    const className = data.levels[lId].classes[cId].name;
    // Yazı boyutunu 2.5rem (yaklaşık 40px) yaparak çok daha büyük bir başlık oluşturduk
    viewTitle.innerHTML = `<span id="active-class-title" style="font-size: 2.5rem; display: block;">${className}</span>`;
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
                if (confirm(name + " kaydını silmek istiyor musunuz?")) {
                    const index = activityPools[activity].indexOf(name);
                    if (index > -1) {
                        activityPools[activity].splice(index, 1);
                        if (typeof saveData === "function") saveData(); 
                        updateActivityTable(); 
                    }
                }
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

function openTatiller() {
    const modal = document.getElementById('tatilModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error("Tatil modalı HTML içinde bulunamadı!");
    }
}

    // --- SES SİSTEMİ ---
    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    function playBeep(freq = 523, dur = 200) {
        initAudio();
        if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        setTimeout(() => osc.stop(), dur);
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

function addLevel() {
    let name = prompt("Yeni Seviye Adı (Örn: 10. Sınıflar):");
    if(name) {
        let id = 'L' + Date.now();
        data.levels[id] = { 
            name: name, 
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
    
    // Silme ve Düzenleme Fonksiyonları
    function editLevelName(lId) {
        let n = prompt("Yeni İsim:", data.levels[lId].name);
        if(n) { data.levels[lId].name = n; save(); }
    }
    function deleteLevel(lId) {
        if(confirm("Seviyeyi ve tüm sınıfları silmek istiyor musunuz?")) {
            delete data.levels[lId];
            data.levelOrder = data.levelOrder.filter(id => id !== lId);
            if(curLId === lId) document.getElementById('content').style.display='none';
            save();
        }
    }
    function editClassName(lId, cId) {
        let n = prompt("Yeni İsim:", data.levels[lId].classes[cId].name);
        if(n) { data.levels[lId].classes[cId].name = n; save(); }
    }
    function deleteClass(lId, cId) {
        if(confirm("Sınıfı silmek istiyor musunuz?")) {
            delete data.levels[lId].classes[cId];
            if(curCId === cId) document.getElementById('content').style.display='none';
            save();
        }
    }

function renderSidebar() {
    const nav = document.getElementById('levelNav');
    if (!nav) return; // Nav elementi yoksa çık
    nav.innerHTML = '';

    // KRİTİK HATA KORUMASI: data veya data.levels tanımsızsa fonksiyonu durdur
    if (!data || !data.levels) {
        console.warn("Sidebar render edilemedi: Veri henüz hazır değil.");
        return; 
    }

    // --- 1. ÖĞRETMEN KODU GÖSTERİMİ (YENİ) ---
    const staticCode = localStorage.getItem('teacher_static_code');
    if (staticCode) {
        let codeHtml = `
        <div class="teacher-code-area" style="
            margin: 0 5px 15px 5px;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
        ">
            <div class="tk-etiket" style="font-size: 0.7rem; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Öğretmen Kodu</div>
            <div class="tk-kod" style="font-size: 1.1rem; font-family: 'Nunito', sans-serif; font-weight: 700; margin-top: 3px;">
                ${staticCode}
            </div>
        </div>`;
        nav.innerHTML += codeHtml;
    }

    // --- 2. SEVİYE VE SINIF LİSTESİ ---
    let levelIds = data.levelOrder || Object.keys(data.levels);
    
    levelIds.forEach(lId => {
        let lvl = data.levels[lId];
        if(!lvl) return;
        
        let html = `
        <div class="level-container" draggable="true" data-id="${lId}" ondragstart="drag(event)" ondragover="allowDrop(event)" ondrop="drop(event)">
            <div class="level-head">
                <span onclick="handleLevelNameClick('${lId}', this)" title="Tek tik: ac/kapa · Cift tik: ismi degistir" style="cursor:pointer; flex:1; font-weight:bold;">${llIcon('klasor')} ${lvl.name}</span>
                <div class="level-actions">
                    <button onclick="openLvlConfig('${lId}')" title="Seviye Ayarları">${llIcon('ayar')}</button>
                    <button onclick="editLevelName('${lId}')" title="İsmi Değiştir">${llIcon('kalem')}</button>
                    <button onclick="deleteLevel('${lId}')" title="Seviyeyi Sil">${llIcon('cop')}</button>
                    <button class="ll-sinif-ekle" onclick="addClass('${lId}')" title="Sınıf Ekle">+</button>
                </div>
            </div>
            <div class="class-list" id="list-${lId}">`;
        
        if (lvl.classes) {
            for(let cId in lvl.classes) {
                html += `
                <div class="class-item">
                    <a class="class-link" onclick="selectClass('${lId}','${cId}')">${llIcon('klasorAcik')} ${lvl.classes[cId].name}</a>
                    <div class="class-actions">
                        <button onclick="editClassName('${lId}','${cId}')" title="İsmi Değiştir">${llIcon('kalem')}</button>
                        <button onclick="deleteClass('${lId}','${cId}')" title="Sınıfı Sil">${llIcon('cop')}</button>
                    </div>
                </div>`;
            }
        }
        
        html += `</div></div>`;
        nav.innerHTML += html;
    });
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

function deleteStu(i) {
    showConfirm("Öğrenci Sil", "Bu öğrenciyi silmek istediğinize emin misiniz?", llIcon('cop','lli-xl'), () => {
        data.levels[curLId].classes[curCId].students.splice(i, 1);
        save(); 
        renderStudents();
    });
}

// --- NOTLAR VE SONUÇLAR ---
function renderGrades(type) {
    let config = data.levels[curLId].config[type];
    let table = document.getElementById(type + 'Table');
    if (!table) return;

    // Davranış puanı yalnızca Performans sekmesinde (hw) ve seviye ayarında
    // açıldıysa görünür. Kapalıysa tablo eskisi gibi kalır.
    const beh = (type === 'hw') ? behAyar(curLId) : null;
    const behAcik = !!(beh && beh.aktif);
    if (type === 'hw') behBilgiCiz(beh);

    // Tablo başlıklarını oluştur
    const ortEtki = !!(behAcik && beh.ortEtki);
    table.innerHTML = `<tr><th>Öğrenci</th>${config.map(c => `<th>${c.n} (%${c.w})</th>`).join('')} <th>Ağ. ORT</th>${ortEtki ? '<th title="Davranış puanı katılmış ortalama">Davranışlı ORT</th>' : ''}${behAcik ? '<th>Davranış</th>' : ''}</tr>`;

    data.levels[curLId].classes[curCId].students.forEach((s, si) => {
        let row = table.insertRow();
        row.insertCell().innerText = s.name;

        let weightedTotal = 0;

        config.forEach((c, ci) => {
            // Veri varsa al, yoksa 0 kabul et
            let val = (s[type] && s[type][ci]) ? parseFloat(s[type][ci]) : 0;
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

        // Ağırlıklı ortalamayı hücreye yaz
        let avgCell = row.insertCell();
        avgCell.style.fontWeight = "bold";
        avgCell.style.color = "var(--primary)";
        avgCell.innerText = weightedTotal.toFixed(2);

        // Davranışlı ortalama sütunu (seviye ayarında "ortalamaya yansısın" açıksa)
        if (ortEtki) {
            const r = behOrtUygula(weightedTotal, beh, s);
            const dCell = row.insertCell();
            dCell.style.fontWeight = "bold";
            dCell.className = 'beh-ort-hucre ' + (r.etki > 0 ? 'arti' : (r.etki < 0 ? 'eksi' : ''));
            dCell.innerHTML = `${r.son.toFixed(2)}<span class="beh-ort-fark">${r.etki > 0 ? '+' : ''}${r.etki ? r.etki.toFixed(2) : '0'}</span>`;
            dCell.title = `Ağırlıklı ortalama ${weightedTotal.toFixed(2)} ${r.etki >= 0 ? '+' : '−'} ${Math.abs(r.etki).toFixed(2)} davranış = ${r.son.toFixed(2)}`;
        }

        // Davranış sütunu: eksi tuşu — net puan — artı tuşu — geçmiş
        if (behAcik) {
            const net = behNet(s);
            const sinif = net > 0 ? 'arti' : (net < 0 ? 'eksi' : '');
            const cell = row.insertCell();
            cell.innerHTML = `
                <div class="beh-hucre">
                    <button class="beh-tus eksi" onclick="behAc(${si},-1)" title="Eksi ver (-${beh.adim})">&minus;</button>
                    <span class="beh-net ${sinif}">${net > 0 ? '+' : ''}${net}</span>
                    <button class="beh-tus arti" onclick="behAc(${si},1)" title="Artı ver (+${beh.adim})">+</button>
                    <button class="beh-gecmis-tus" onclick="behGecmis(${si})" title="Davranış geçmişi">${llIcon('saat')}</button>
                </div>`;
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

    if (typeof playBeep === 'function') playBeep(behSecim.yon > 0 ? 880 : 320, 140);
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
    if (!confirm("Bu davranış kaydı silinsin mi? Puan da geri alınacak.")) return;
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
}

function behLogKapat() {
    const m = document.getElementById('behLogModal');
    if (m) m.style.display = 'none';
    behLogStu = null;
}

    function updateGrade(t, si, ci, v) {
        let s = data.levels[curLId].classes[curCId].students[si];
        if(!s[t]) s[t] = [];
        s[t][ci] = v; save(); renderGrades(t);
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
                playBeep(880, 150);
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
}


function addKuraRow(name = "") {
    const container = document.getElementById('lvlKuraList');
    const div = document.createElement('div');
    div.style = "margin-bottom:8px; display:flex; gap:5px;";
    div.innerHTML = `
        <input type="text" class="kura-n" value="${name}" placeholder="Kura Başlığı" style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px;">
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:8px; padding:0 12px; cursor:pointer;">${llIcon('cop')}</button>
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
        if(confirm("Silinsin mi?")) {
            data.levels[curLId].classes[curCId].students[si].history.splice(hi, 1);
            save(); renderActivityStatus();
        }
    }
    function resetPools() {
        if(confirm("Tüm geçmiş ve havuzlar sıfırlansın mı?")) {
            pools = {};
            data.levels[curLId].classes[curCId].students.forEach(s => s.history = []);
            save(); renderActivityStatus();
        }
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
                    <button class="btn-add" onclick="addConfigRow('hw')" style="width:100%; margin-top:10px;">+ Ödev Ekle</button>
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
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:8px; padding:0 12px; cursor:pointer;">${llIcon('cop')}</button>
    `;
    kuraList.appendChild(row);
}


function addKuraRow() {
    addKuraRowWithData(""); // Boş satır ekler
}

// 2. Yeni Satır Ekleme (Manuel + butonu için)
function addConfigRow(t) {
    addConfigRowWithData(t, '', 0);
}

// 3. Veriyle Satır Oluşturma (Sistemin ihtiyaç duyduğu asıl parça)
function addConfigRowWithData(t, name, weight) {
    const container = document.getElementById(t === 'hw' ? 'lvlHwList' : 'lvlExList');
    if (!container) return;
    
    const div = document.createElement('div');
    div.style = "margin-bottom:8px; display:flex; gap:5px; align-items:center;";
    div.innerHTML = `
        <input type="text" class="${t}-n" value="${name}" placeholder="Ad" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <input type="number" class="${t}-w" value="${weight}" placeholder="%" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;">
        <button onclick="this.parentElement.remove()" style="background:var(--danger); color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">${llIcon('kapat')}</button>
    `;
    container.appendChild(div);
}

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
        if(confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            firebase.auth().signOut().then(() => {
                alert("Başarıyla çıkış yapıldı.");
                location.reload(); // Sayfayı yenileyerek temiz bir başlangıç yapın
            });
        }
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

    // --- TAKIM OLUŞTURMA ---
    function createTeams(size) {
        if(typeof curLId === 'undefined' || curLId === null) return alert("Lütfen önce bir sınıf seçin!");
        let students = data.levels[curLId].classes[curCId].students;
        if(!students || students.length === 0) return alert("Sınıfta öğrenci yok!");

        let names = students.map(s => s.name);
        names.sort(() => Math.random() - 0.5);

        let teams = [];
        while(names.length) {
            teams.push(names.splice(0, size));
        }

        if(teams.length > 1 && teams[teams.length-1].length < size) {
            let leftovers = teams.pop();
            let i = 0;
            while(leftovers.length) {
                teams[i].push(leftovers.pop());
                i = (i + 1) % teams.length;
            }
        }

        let container = document.getElementById('teamContainer');
        if(container) {
            container.innerHTML = '';
            teams.forEach((team, i) => {
                let card = document.createElement('div');
                card.className = 'team-card';
                card.innerHTML = `<div class="team-title">Takım ${i+1}</div>`;
                team.forEach(member => {
                    card.innerHTML += `<div class="team-member">${member}</div>`;
                });
                container.appendChild(card);
            });
        }
    }
    
    function clearTeams() {
        const container = document.getElementById('teamContainer');
        if(container) container.innerHTML = '';
    }

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
    llRootEl().classList.toggle('sidebar-closed');
    window.dispatchEvent(new Event('resize'));
}

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
        /* Masaustune donunce her zaman acik olsun. */
        if (r.dataset.llMod === 'mobil') r.classList.remove('sidebar-closed');
        r.dataset.llMod = 'masaustu';
    }
}
/* Sinif secilince cekmece kapansin -> icerik hemen gorunur. */
function llCekmeceKapatMobil() {
    if (!llMobilMi()) return;
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
    table.innerHTML = `<tr><th>Öğrenci</th><th>Ödev Ort. (%100)</th>${rEtki ? '<th title="Davranış puanı katılmış ödev ortalaması">Davranışlı Ödev ORT</th>' : ''}<th>Sınav Ort. (%100)</th></tr>`;

    lvl.classes[curCId].students.forEach(s => {
        let hwScore = 0;
        let exScore = 0;
        
        // Ödev Ağırlıklı Hesaplama
        lvl.config.hw.forEach((c, i) => {
            let val = parseFloat((s.hw || [])[i] || 0);
            let weight = parseFloat(c.w || 0) / 100; // Yüzdelik ağırlık (25/100 = 0.25)
            hwScore += (val * weight);
        });
        
        // Sınav Ağırlıklı Hesaplama
        lvl.config.ex.forEach((c, i) => {
            let val = parseFloat((s.ex || [])[i] || 0);
            let weight = parseFloat(c.w || 0) / 100; // Yüzdelik ağırlık (50/100 = 0.50)
            exScore += (val * weight);
        });
        
        let davHucre = '';
        if (rEtki) {
            const r = behOrtUygula(hwScore, rBeh, s);
            const sinif = r.etki > 0 ? 'arti' : (r.etki < 0 ? 'eksi' : '');
            davHucre = `<td class="beh-ort-hucre ${sinif}" style="font-weight:bold;" title="${hwScore.toFixed(2)} ${r.etki >= 0 ? '+' : '−'} ${Math.abs(r.etki).toFixed(2)} davranış">${r.son.toFixed(2)}<span class="beh-ort-fark">${r.etki > 0 ? '+' : ''}${r.etki ? r.etki.toFixed(2) : '0'}</span></td>`;
        }
        table.insertRow().innerHTML = `
            <td>${behKacis(s.name || '')}</td>
            <td style="font-weight:bold;">${hwScore.toFixed(2)}</td>
            ${davHucre}
            <td style="font-weight:bold; color:var(--accent);">${exScore.toFixed(2)}</td>
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
  function finish(sv){ if(done) return; done=true; var v=(inp.value||'').trim(); var name=(sv&&v)?v:cur; if(sv&&v&&v!==cur){ data.levels[lId].name=v; if(typeof save==='function') save(); } spanEl.innerHTML=llIcon('klasor')+' '+behKacis(name); }
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
    taramaArama = (el.value || '').toLocaleLowerCase('tr');
    renderTarama();
}

function taramaAc(lId, cId, si) {
    curLId = lId; curCId = cId;
    if (typeof selectClass === 'function') { try { selectClass(lId, cId); } catch (e) {} }
    switchTab(0);
    setTimeout(() => openVeliModal(si), 60);
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
    if (!confirm('Bu mesaj tüm öğrencilerden kaldırılsın mı?')) return;
    const dep = duyuruDepo();
    const i = dep.findIndex(m => m.id === id);
    if (i > -1) dep.splice(i, 1);
    save();
    duyuruGecmisCiz();
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
    if (!confirm('Bu mesaj tüm öğrencilerden kaldırılsın mı?')) return;
    const dep = duyuruDepo();
    const i = dep.findIndex(m => m.id === id);
    if (i > -1) dep.splice(i, 1);
    save();
    imCiz();
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
