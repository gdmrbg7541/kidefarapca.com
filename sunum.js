pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // URL'den dosya adını al
        const urlParams = new URLSearchParams(window.location.search);
        const pdfYolu = urlParams.get('dosya');

        if (!pdfYolu) {
            document.getElementById('loading-info').innerText = "Dosya bulunamadı!";
        } else {
            baslatSunum(pdfYolu);
        }

        let pdfDoc = null;
        let pageNum = 1;
        let pageRendering = false;
        let pageNumPending = null;
        const container = document.getElementById('canvas-container');
        const loadingInfo = document.getElementById('loading-info');

        function baslatSunum(url) {
            pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
                pdfDoc = pdfDoc_;
                document.title = url.replace('.pdf', '').replace(/_/g, ' '); // Sekme adını ayarla
                loadingInfo.style.display = 'none';
                renderPage(pageNum);
            }).catch(function(error) {
                loadingInfo.innerText = "Yükleme Hatası: " + error.message;
            });
        }

        // TİTREŞİMSİZ RENDER MANTIĞI
        function renderPage(num) {
            pageRendering = true;

            pdfDoc.getPage(num).then(function(page) {
                const viewport = page.getViewport({scale: 1});
                const scale = Math.min(window.innerWidth / viewport.width, window.innerHeight / viewport.height);
                const scaledViewport = page.getViewport({scale: scale});

                // Her sayfa için YENİ bir canvas oluşturuyoruz (Eski sayfa ekranda kalmaya devam ediyor)
                const newCanvas = document.createElement('canvas');
                newCanvas.className = 'pdf-page';
                newCanvas.height = scaledViewport.height;
                newCanvas.width = scaledViewport.width;
                const ctx = newCanvas.getContext('2d');

                const renderContext = {
                    canvasContext: ctx,
                    viewport: scaledViewport
                };
                
                // Çizim işlemi
                page.render(renderContext).promise.then(function() {
                    pageRendering = false;
                    
                    // Yeni sayfa tamamen çizildikten sonra eskisini silip yenisini ekliyoruz
                    container.innerHTML = ''; 
                    container.appendChild(newCanvas);

                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });
        }

        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        function onNextPage() {
            if (pdfDoc === null || pageNum >= pdfDoc.numPages) return;
            pageNum++;
            queueRenderPage(pageNum);
        }

        function onPrevPage() {
            if (pdfDoc === null || pageNum <= 1) return;
            pageNum--;
            queueRenderPage(pageNum);
        }

        // ==========================================
        // UI GİZLE/GÖSTER MANTIĞI
        // ==========================================
        const uiLayer = document.getElementById('ui-layer');
        let uiTimeout;

        function uiGoster() {
            uiLayer.classList.add('show');
            clearTimeout(uiTimeout);
            // 2.5 saniye hareketsizlikten sonra gizle
            uiTimeout = setTimeout(() => {
                uiLayer.classList.remove('show');
            }, 2500); 
        }

        // Fare hareketi, ekrana dokunma veya tıklama olduğunda arayüzü göster
        document.addEventListener('mousemove', uiGoster);
        document.addEventListener('touchstart', uiGoster);
        document.addEventListener('click', uiGoster);
        
        // İlk açılışta butonları göster
        uiGoster();

        // ==========================================
        // KONTROLLER
        // ==========================================
        document.getElementById('next-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // UI gizleme tıklamasıyla çakışmasın
            onNextPage();
        });
        
        document.getElementById('prev-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            onPrevPage();
        });

        // Klavye ile geçiş
        document.addEventListener('keydown', (e) => {
            uiGoster(); // Tuşa basılınca da UI görünsün
            if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
                e.preventDefault();
                onNextPage();
            } else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) {
                e.preventDefault();
                onPrevPage();
            }
        });

        // Ekran boyutu değişirse slaytı yeniden boyutlandır
        window.addEventListener('resize', () => {
            if (pdfDoc) queueRenderPage(pageNum);
        });