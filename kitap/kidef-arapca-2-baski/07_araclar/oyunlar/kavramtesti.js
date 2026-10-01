function switchTab(tabName) {
        // 1. Tüm sekmeleri gizle, isteneni aç
        document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById('tab-' + tabName).classList.add('active');

        // 2. Tüm butonların aktifliğini kaldır
        const buttons = document.querySelectorAll('.menu-btn');
        buttons.forEach(btn => btn.classList.remove('active'));

        // 3. Doğru butona aktiflik ver
        // buttons[0] -> Ev butonu olduğu için 1'i kullanıyoruz.

        if(tabName === 'schema') {
            buttons[1].classList.add('active'); // Fiil Şeması
        }
    }

    function toggleElement(el) {
        if (el.classList.contains('hidden-content')) {
            el.classList.remove('hidden-content');
        }
    }

    function askSchemaQuestion() {
        document.querySelectorAll('.hidden-content').forEach(el => {
            el.classList.remove('hidden-content');
        });

        const candidates = document.querySelectorAll('.hideable');
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selectedElement = candidates[randomIndex];

        let questionText = "?";
        const type = selectedElement.getAttribute('data-type');

        switch(type) {
            case 'root': questionText = "Konu?"; break;
            case 'group': questionText = "Grup?"; break;
            case 'title': questionText = "Fiil?"; break;
            case 'desc': questionText = "Tanım?"; break;
            case 'example': questionText = "Örnek?"; break;
        }

        selectedElement.setAttribute('data-text', questionText);
        selectedElement.classList.add('hidden-content');
    }
