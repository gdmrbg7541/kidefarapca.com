document.addEventListener("DOMContentLoaded", () => {
  
  const header = document.querySelector('.site-header');
  const setHeaderHeight = () => {
    if (header) {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  };
  
  window.addEventListener('load', () => {
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  });
  setHeaderHeight();

  document.querySelectorAll("a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    if (href.startsWith("#")) {
      a.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth"
          });
        }
      });
      return; 
    }

    const newFlipbookPath = "flipbooks/pratiksayfalar/flipbookpratiksayfalar.html";
    
    let isException = false;
    if (href.startsWith("https://") || href.startsWith("mailto:")) {
        isException = true;
    } else if (href === "araclar.html" || href === "flipbookkidef.html" || href === newFlipbookPath) {
        isException = true;
    }

    if (href.endsWith(".html") && !isException) {
      // Oyun/araç sayfaları YENİ SEKMEDE açılsın (rel="opener": geri tuşu sekmeyi kapatabilsin)
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "opener");
    }
    else if (isException) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });

  let audioCtx = null;

  function initAudio() {
    if (audioCtx) return; 
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      console.log("AudioContext başlatıldı.");
    } catch(e) {
      console.error("Web Audio API desteklenmiyor.", e);
    }
  }

  function playSine(durationMs, freq = 440) {
    if (!audioCtx) return; 

    const durationSec = durationMs / 1000;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); 

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + durationSec * 0.1); 
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + durationSec);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + durationSec);
  }

  function playVibrate(durationMs) {
    if (navigator.vibrate) {
      navigator.vibrate(durationMs);
    }
  }

  function playHaptics(type) {
    switch (type) {
      case 'detent': 
        playVibrate(5); 
        break;
      case 'card-select': 
        playVibrate(25); 
        playSine(70, 600);
        break;
      case 'button-press': 
        playVibrate(15);
        break;
    }
  }

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  document.querySelectorAll('.game-card:not(.game-card-soon)').forEach(card => {
    card.addEventListener('click', function(e) {
      initAudio(); 
      
      if (e.target.classList.contains('status-badge')) {
        playHaptics('button-press'); 
        return true; 
      }

      if (card.getAttribute('target') === '_blank') {
        if (isTouchDevice) {
          // Mobil: ilk dokunuş kartı ortalar; açmak için rozete ("Aç/Başla") basılır
          e.preventDefault();
          card.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
          });
          return;
        }
        // Masaüstü: karta tıklayınca varsayılan davranışla YENİ SEKMEDE açılsın
        return true;
      }
      
      if (card.id === 'one-cikan-card' && isTouchDevice) {
        e.preventDefault(); 
        if (card.classList.contains('is-selected')) {
           card.classList.remove('is-selected');
        } else {
           document.querySelectorAll('.game-card.is-selected').forEach(sc => sc.classList.remove('is-selected'));
           card.classList.add('is-selected');
           playHaptics('card-select');
        }
        return; 
      }

      e.preventDefault(); 
      if (isTouchDevice) {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
      }
    });
  });

  document.body.addEventListener('click', function(e) {
    if (!e.target.closest('.game-card')) {
      document.querySelectorAll('#one-cikan-card.is-selected').forEach(selectedCard => {
        selectedCard.classList.remove('is-selected');
      });
    }
  }, true); 

  function findClosestCardToCenter(grid) {
    const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
    let minDistance = Infinity;
    let closestCard = null;

    for (const card of grid.children) {
        if (!card.classList.contains('game-card')) continue; 
        
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - (grid.scrollLeft + grid.clientWidth / 2));
        
        if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
        }
    }
    return closestCard;
  }

  document.querySelectorAll('.mobile-scroll-grid-single').forEach(grid => {
      let isThrottled = false;
      let lastCenteredCard = null;

      const updateScaling = () => {
          if (isThrottled) return;
          isThrottled = true;
          
          setTimeout(() => {
              const closestCard = findClosestCardToCenter(grid);
              
              if (closestCard && closestCard !== lastCenteredCard) {
                  initAudio(); 
                  playHaptics('detent'); 
                  
                  if (lastCenteredCard) {
                      lastCenteredCard.classList.remove('is-centered');
                  }
                  closestCard.classList.add('is-centered');
                  lastCenteredCard = closestCard;
              }
              isThrottled = false;
          }, 50); 
      };

      grid.addEventListener('scroll', updateScaling);
      
      setTimeout(() => {
        const closestCard = findClosestCardToCenter(grid);
        if (closestCard) {
            closestCard.classList.add('is-centered');
            lastCenteredCard = closestCard;
        }
      }, 300);
  });
});

function showSupportMessage() {
    alert("kidefarapca@gmail.com üzerinden iletişime geçerek desteklerinizi iletebilirsiniz. İlginiz için teşekkür ederiz!");
}
function openSupportModal() {
    document.getElementById("supportModal").style.display = "block";
    if (navigator.vibrate) navigator.vibrate(20); 
}
function closeSupportModal() {
    document.getElementById("supportModal").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("supportModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ==========================================
// KART ÜRETİCİ YAMASI (index.html için)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const slaytContainer = document.getElementById('slayt-galerisi-container');
    if (!slaytContainer) return;

    /* Gösterilecek sunumlar. Dosyalar sunum/ klasöründedir; klasörü
       sunum.js kendisi ekler.

       ⚠️ DOSYA ADI ile EKRANDA GÖRÜNEN AD artık ayrı:
       Dosya adları eskiden emoji, boşluk, Türkçe harf ve kesme işareti
       içeriyordu ("🧐 Aksam-ı Seb'a.pdf"). Bunlar adrese girince yüzde
       kodlamasıyla devasa bağlantılara dönüşüyor; sunucudan sunucuya
       (Vercel, CDN, önbellek) farklı çözülebiliyor ve paylaşılan bağlantı
       kırılıyor. Dosyalar sade ASCII adlara çevrildi; başlıktaki emoji ve
       Türkçe yazım "ad" alanında yaşamaya devam ediyor. */
    const pdfListesi = [
        { dosya: "harf-i-tarif.pdf",                      ad: "🧐 Harf-i Tarîf" },
        { dosya: "kaliplari-pekistir.pdf",                ad: "🛠️ Kalıpları Pekiştir" },
        { dosya: "arapcada-kelime.pdf",                   ad: "🤔 Arapçada Kelime" },
        { dosya: "ismin-4-ozelligi.pdf",                  ad: "🤔 İsmin 4 Özelliği" },
        { dosya: "mufred-tesniye-cem-isimler.pdf",        ad: "🧐 Müfred, Tesniye, Cem İsimler" },
        { dosya: "mazi-fiil.pdf",                         ad: "🧐 Mazi Fiil" },
        { dosya: "kim-daha-hizli.pdf",                    ad: "⚔️ Kim Daha Hızlı" },
        { dosya: "cogul-isimler-merfu-mansub-mecrur.pdf", ad: "🔬 Çoğul İsimlerin Merfu, Mansub ve Mecrur Halleri" },
        { dosya: "muzari-fiil.pdf",                       ad: "🧐 Muzari Fiil" },
        { dosya: "emir-fiil.pdf",                         ad: "🧐 Emir Fiil" },
        { dosya: "aksam-i-seba.pdf",                      ad: "🧐 Aksam-ı Seb'a" }
    ];

    pdfListesi.forEach(kayit => {
        const dosyaAdi = (typeof kayit === 'string') ? kayit : kayit.dosya;
        const gorunenIsim = (typeof kayit === 'string')
            ? kayit.replace('.pdf', '').replace(/_/g, ' ')
            : kayit.ad;

        const card = document.createElement('a');
        // Tıklanınca sunum.html dosyasını yeni sekmede ve parametreyle aç
        card.href = `sunum.html?dosya=${encodeURIComponent(dosyaAdi)}`; 
        card.target = "_blank"; // Yeni sekmede açılma garantisi
        card.className = 'game-card kss-card';
        
        card.innerHTML = `
            <div class="default-game-content">
                <div class="default-game-emoji"><svg viewBox="0 0 64 64" aria-hidden="true" style="width:1.6em;height:1.6em;display:block;overflow:visible">
                    <line x1="6" y1="8" x2="58" y2="8" stroke="#64748b" stroke-width="4.5" stroke-linecap="round"/>
                    <rect x="12" y="10" width="40" height="31" rx="3" fill="#fff" stroke="#b9c3d4" stroke-width="2.2"/>
                    <rect x="17" y="15" width="19" height="5" rx="2.2" fill="#7C3AED"/>
                    <line class="kga-madde" x1="17" y1="27" x2="46" y2="27" stroke="#94a3b8" stroke-width="3.2" stroke-linecap="round"/>
                    <line class="kga-madde m2x" x1="17" y1="34" x2="40" y2="34" stroke="#cbd5e1" stroke-width="3.2" stroke-linecap="round"/>
                    <circle class="kga-imlec" cx="47" cy="33" r="3" fill="#EE5253"/>
                    <path d="M32 41 v6 m0 0 a3 3 0 1 0 .1 0" fill="none" stroke="#94a3b8" stroke-width="2.4"/>
                </svg></div>
                <h3 style="min-height: 2.6em; font-size: 1.1em; display:flex; align-items:center; justify-content:center; text-align:center;">
                    ${gorunenIsim}
                </h3>
                <span class="game-card-description">Etkileşimli Slayt</span>
                <span class="status-badge available">Sunumu Aç</span>
            </div>
        `;

        slaytContainer.appendChild(card);
    });
});