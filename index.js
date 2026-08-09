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

/* SUNUM KART ÜRETİCİSİ KALDIRILDI.
   "Sunumlar" bölümü siteden çıkarıldı: PDF slaytlar (sunum/ klasörü,
   ~128 MB) yayınlanamıyordu ve Vercel Hobby planındaki 100 MB statik
   dosya sınırını aşıyordu. Kartları basan blok burada duruyordu;
   bölümle birlikte silindi. Geri istenirse index.html'deki
   #slayt-galerisi-container bölümüyle beraber geri konur. */