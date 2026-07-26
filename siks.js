// --- Araçlar Modal'ı ---
        const araclarModal = document.getElementById("araclar-modal");
        const araclarBtn = document.getElementById("araclar-btn");
        const araclarKapat = document.getElementsByClassName("kapat-btn")[0];

        araclarBtn.onclick = function() {
            araclarModal.style.display = "block";
        }
        araclarKapat.onclick = function() {
            araclarModal.style.display = "none";
        }
        window.addEventListener("click", function(event) {
            if (event.target == araclarModal) {
                araclarModal.style.display = "none";
            }
        });


        // --- Lightbox (Görsel Büyütme) Modal'ı ---
        const lightboxModal = document.getElementById("lightbox-modal");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxKapat = document.getElementById("lightbox-kapat");
        
        const gorselTetikleyiciler = document.querySelectorAll(".gorsel-temsili");

        gorselTetikleyiciler.forEach(function(tetikleyici) {
            tetikleyici.onclick = function() {
                const imgElement = tetikleyici.querySelector("img");
                const imgSrc = imgElement.getAttribute("src");
                
                if (imgSrc) {
                    lightboxModal.style.display = "block";
                    lightboxImg.setAttribute("src", imgSrc);
                } else {
                    console.log("Resim kaynağı bulunamadı.");
                }
            }
        });

        // Lightbox'ı kapatma (X butonu)
        lightboxKapat.onclick = function() {
            lightboxModal.style.display = "none";
        }
        
        // Lightbox'ı kapatma (Arka plana tıklama)
        lightboxModal.onclick = function(event) {
            if (event.target == lightboxModal) { 
                lightboxModal.style.display = "none";
            }
        }