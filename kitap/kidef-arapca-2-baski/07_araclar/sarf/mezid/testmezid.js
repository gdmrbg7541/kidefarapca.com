// Web Audio API Sinüs Dalgası Sistemi
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

const sounds = {
    correct: () => { playTone(880, 'sine', 0.4); },
    wrong: () => { playTone(150, 'sawtooth', 0.3); },
    click: () => { playTone(440, 'sine', 0.05); }
};

const rawData = [
    { q: "'اِقْتِـرَان' kelimesi hangi kalıptandır?", a: "İfti’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'يَصْفَرُّ' kelimesi hangi kalıptandır?", a: "İf’ilâl", options: ["Müfâ’ale", "İnfi’âl", "İfti’âl", "İf’ilâl", "Tefâul"] },
    { q: "'تَفَضَّلْ' kelimesi hangi kalıptandır?", a: "Tefe’ul", options: ["Müfâ’ale", "İnfi’âl", "İfti’âl", "Tefe’ul", "Tefâul"] },
    { q: "'مُتَشَائِم' kelimesi hangi kalıptandır?", a: "Tefâul", options: ["Müfâ’ale", "İfti’âl", "Tefe’ul", "Tefâul", "İstif’âl"] },
    { q: "'اِسْتِـرْحَام' kelimesi hangi kalıptandır?", a: "İstif’âl", options: ["Müfâ’ale", "İnfi’âl", "İfti’âl", "İf’ilâl", "İstif’âl"] },
    { q: "'يُدْرِكُ' kelimesi hangi kalıptandır?", a: "İf’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'مُدَرِّس' kelimesi hangi kalıptandır?", a: "Tef’îl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'مُحَاسَبَة' kelimesi hangi kalıptandır?", a: "Müfâ’ale", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'يَرْتَبِطُ' kelimesi hangi kalıptandır?", a: "İfti’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "Sadece şedde ( ّ ) alarak türeyen kelimeler hangi kalıptadır?", a: "Tef’îl", options: ["Tef’îl", "Müfâ’ale", "İfti’âl", "Tefe’ul", "Tefâul"] },
    { q: "T ( تَـ ) ve şedde ( ّ ) alarak türeyen kelimeler hangi kalıptadır?", a: "Tefe’ul", options: ["Tef’îl", "Müfâ’ale", "İfti’âl", "Tefe’ul", "Tefâul"] },
    { q: "Sadece hemze ( أ ) alarak türeyen kelimeler hangi kalıptadır?", a: "İf’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "Sadece elif ( ــا ) alarak türeyen kelimeler hangi kalıptadır?", a: "Müfâ’ale", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'حَافَظَ' kelimesi hangi kalıptandır?", a: "Müfâ’ale", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'مُنْحَرِف' kelimesi hangi kalıptandır?", a: "İnfi’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'اِحْتَمَلَ' kelimesi hangi kalıptandır?", a: "İfti’âl", options: ["Müfâ’ale", "İnfi’âl", "İfti’âl", "İf’ilâl", "İstif’âl"] },
    { q: "'اِحْمَـرَّ' kelimesi hangi kalıptandır?", a: "İf’ilâl", options: ["İf’âl", "İnfi’âl", "İfti’âl", "İf’ilâl", "İstif’âl"] },
    { q: "'تَحَكُّم' kelimesi hangi kalıptandır?", a: "Tefe’ul", options: ["Müfâ’ale", "İnfi’âl", "İfti’âl", "Tefe’ul", "Tefâul"] },
    { q: "'يَتَمَايَلُ' kelimesi hangi kalıptandır?", a: "Tefâul", options: ["Müfâ’ale", "İfti’âl", "Tefe’ul", "Tefâul", "İstif’âl"] },
    { q: "'اِسْتَخْبَـرَ' kelimesi hangi kalıptandır?", a: "İstif’âl", options: ["İnfi’âl", "İfti’âl", "Tefe’ul", "İf’âl", "İstif’âl"] },
    { q: "'إِقْنَاع' kelimesi hangi kalıptandır?", a: "İf’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'تَثْبِـيت' kelimesi hangi kalıptandır?", a: "Tef’îl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'يُمَارِسُ' kelimesi hangi kalıptandır?", a: "Müfâ’ale", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'اِنْحِصَار' kelimesi hangi kalıptandır?", a: "İnfi’âl", options: ["İf’âl", "Tef’îl", "Müfâ’ale", "İnfi’âl", "İfti’âl"] },
    { q: "'مُتَفَكِّر' kelimesi hangi kalıptandır?", a: "Tefe’ul", options: ["Müfâ’ale", "İfti’âl", "Tefe’ul", "Tefâul", "İstif’âl"] },
    { q: "Hemze ( ا ) ve te harfi ( تـ ) alarak türeyen kelimeler hangi kalıptadır?", a: "İfti’âl", options: ["İf’âl", "İfti’âl", "İf’ilâl", "İnfi’âl", "İstif’âl"] },
    { q: "Hemze ( ا ) ve şedde ( ّ ) alarak türeyen bir fiil hangi kalıptandır?", a: "İf’ilâl", options: ["İf’âl", "İfti’âl", "İf’ilâl", "İnfi’âl", "İstif’âl"] },
    { q: "Hemze ( ا ), sin ( ـسـ ) ve t ( ـتـ ) alarak türeyen bir fiil hangi kalıptandır?", a: "İstif’âl", options: ["İf’âl", "İfti’âl", "İf’ilâl", "İnfi’âl", "İstif’âl"] },
    { q: "'نَسْتَقْبِلُ' kelimesini sözlükte nasıl aramalıyız?", a: "اِسْتَقْبَلَ", options: ["اِسْتَقْبِلُ", "يَسْتَقْبِلُ", "أَسْتَقْبِلُ", "مُسْتَقْبَلٌ", "اِسْتَقْبَلَ"] },
    { q: "'تَمَتَّعْتُمْ' kelimesini sözlükte nasıl aramalıyız?", a: "تَمَتَّعَ", options: ["تَعْتُمْ", "تَمَتَّعَ", "مَتَعَ", "مَتَّعْتُ", "يَتَمَتَّعُ"] }
];

let questions = [...rawData].sort(() => Math.random() - 0.5);
let currentIdx = 0;
let userAnswers = new Array(questions.length).fill(null);

function updateUI() {
    const data = questions[currentIdx];
    document.getElementById('counter').innerText = `Soru: ${currentIdx + 1} / ${questions.length}`;
    document.getElementById('question').innerHTML = data.q.replace(/'([^']+)'/g, '<br><span class="arabic-word">$1</span><br>');

    const optionsEl = document.getElementById('options');
    optionsEl.innerHTML = '';
    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        if (userAnswers[currentIdx]) {
            if (opt === data.a) btn.classList.add('correct');
            else if (opt === userAnswers[currentIdx]) btn.classList.add('wrong');
            btn.disabled = true;
        }
        btn.onclick = () => {
            userAnswers[currentIdx] = opt;
            if (opt === data.a) { sounds.correct(); btn.classList.add('correct'); }
            else { sounds.wrong(); btn.classList.add('wrong'); 
                   Array.from(optionsEl.children).forEach(b => { if(b.innerText === data.a) b.classList.add('correct'); });
            }
            document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
            document.getElementById('next-btn').disabled = false;
        };
        optionsEl.appendChild(btn);
    });
    document.getElementById('next-btn').disabled = !userAnswers[currentIdx];
    document.getElementById('prev-btn').disabled = currentIdx === 0;
}

document.getElementById('next-btn').onclick = () => { if (currentIdx < questions.length - 1) { sounds.click(); currentIdx++; updateUI(); } };
document.getElementById('prev-btn').onclick = () => { if (currentIdx > 0) { sounds.click(); currentIdx--; updateUI(); } };

updateUI();