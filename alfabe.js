const harfler = [
        {h: 'ا', tr: 'Elif', b:'ا', o:'ـا', s:'ـا', nobind: true}, 
        {h: 'ب', tr: 'Be', b:'بـ', o:'ـبـ', s:'ـب'},
        {h: 'ت', tr: 'Te', b:'تـ', o:'ـتـ', s:'ـت'}, 
        {h: 'ث', tr: 'Peltek S̱e', b:'ثـ', o:'ـثـ', s:'ـث'},
        {h: 'ج', tr: 'Cim', b:'جـ', o:'ـجـ', s:'ـج'}, 
        {h: 'ح', tr: 'Ḥa', b:'حـ', o:'ـحـ', s:'ـح'},
        {h: 'خ', tr: 'Ḫa (Hırıltılı)', b:'خـ', o:'ـخـ', s:'ـخ'}, 
        {h: 'د', tr: 'Dal', b:'د', o:'ـد', s:'ـد', nobind: true},
        {h: 'ذ', tr: 'Ẕel (Peltek)', b:'ذ', o:'ـذ', s:'ـذ', nobind: true}, 
        {h: 'ر', tr: 'Ra', b:'ر', o:'ـر', s:'ـر', nobind: true},
        {h: 'ز', tr: 'Ze', b:'ز', o:'ـز', s:'ـز', nobind: true}, 
        {h: 'س', tr: 'Sin', b:'سـ', o:'ـسـ', s:'ـس'},
        {h: 'ش', tr: 'Şın', b:'شـ', o:'ـشـ', s:'ـش'}, 
        {h: 'ص', tr: 'Ṣad (Kalın S)', b:'صـ', o:'ـصـ', s:'ـص'},
        {h: 'ض', tr: 'Ḍad', b:'ضـ', o:'ـضـ', s:'ـض'}, 
        {h: 'ط', tr: 'Ṭa', b:'طـ', o:'ـطـ', s:'ـط'},
        {h: 'ظ', tr: 'Ẓa', b:'ظـ', o:'ـظـ', s:'ـظ'}, 
        {h: 'ع', tr: 'Ayn (ʿ)', b:'عـ', o:'ـعـ', s:'ـع'},
        {h: 'غ', tr: 'Ğayn', b:'غـ', o:'ـغـ', s:'ـغ'}, 
        {h: 'ف', tr: 'Fe', b:'فـ', o:'ـفـ', s:'ـف'},
        {h: 'ق', tr: 'Qaf', b:'قـ', o:'ـقـ', s:'ـق'}, 
        {h: 'ك', tr: 'Kef', b:'كـ', o:'ـكـ', s:'ـك'},
        {h: 'ل', tr: 'Lam', b:'لـ', o:'ـلـ', s:'ـل'}, 
        {h: 'م', tr: 'Mim', b:'مـ', o:'ـمـ', s:'ـم'},
        {h: 'ن', tr: 'Nun', b:'نـ', o:'نـ', s:'ـن'}, 
        {h: 'و', tr: 'Waw', b:'و', o:'ـو', s:'ـو', nobind: true},
        {h: 'ه', tr: 'He', b:'هـ', o:'ـهـ', s:'ـه'}, 
        {h: 'ي', tr: 'Ye', b:'يـ', o:'ـيـ', s:'ـي'}
    ];

/* Yazılışı birbirine benzeyen harf aileleri (kart arka plan renkleri için).
   Aynı gövdeyi paylaşan harfler aynı grupta; kendine özgü yazılan harfler "tek". */
const HARF_AILE = {
    'ب':'be',  'ت':'be',  'ث':'be',
    'ج':'cim', 'ح':'cim', 'خ':'cim',
    'د':'dal', 'ذ':'dal',
    'ر':'ra',  'ز':'ra',
    'س':'sin', 'ش':'sin',
    'ص':'sad', 'ض':'sad',
    'ط':'ta',  'ظ':'ta',
    'ع':'ayn', 'غ':'ayn',
    'ف':'fe',  'ق':'fe'
};
// --- WEB AUDIO API İLE SİNÜS DALGASI (SINE WAVE) SES ÜRETECİ ---
let audioCtx;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSineTone(freq1, freq2, duration) {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine'; // Sinüs Dalgası
    
    osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
    if(freq2) {
        osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + duration);
    }

    // Sesi yumuşak başlat ve bitir (Çıt sesini önler)
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Özel Ses Fonksiyonları
const playClick = () => { playSineTone(600, null, 0.1); };

const playCorrect = () => {
    playSineTone(440, null, 0.1); // La
    setTimeout(() => playSineTone(554.37, null, 0.1), 100); // Do#
    setTimeout(() => playSineTone(659.25, null, 0.3), 200); // Mi
};

const playWrong = () => {
    playSineTone(250, null, 0.15); // Kalın bip
    setTimeout(() => playSineTone(200, null, 0.25), 150); // Daha kalın bip
};
// -----------------------------------------------------------------

window.handleFlipBox = function(el) {
    playClick();
    if (el.classList.contains('is-flipped')) {
        clearTimeout(el.studyTimer);
        el.classList.remove('is-flipped');
    } else {
        el.classList.add('is-flipped');
        el.studyTimer = setTimeout(() => {
            el.classList.remove('is-flipped');
        }, 3000);
    }
};

const ui = {
    tab: (e, id) => {
        if (e) e.preventDefault(); 
        playClick(); 
        
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
        
        const target = document.getElementById(id);
        if(target) target.classList.add('active');
        
        if(e && e.currentTarget) e.currentTarget.classList.add('active');
    },
    init: () => {
        const g1 = document.getElementById('g1');
        g1.innerHTML = "";
        harfler.forEach((i, idx) => {
            const nc = i.nobind ? 'nobind' : '';
            const fc = 'fam-' + (HARF_AILE[i.h] || 'tek');
            g1.innerHTML += `
                <div class="char-card ${nc} ${fc}" onclick="harfDetay.open(${idx})" title="Detay için tıkla: mahreç ve yazılış">
                    <span class="card-num">${idx + 1}</span>
                    <div class="arabic-seq" style="display: flex; justify-content: space-around; width: 100%; padding: 0 5px;">
                        <span class="b-green">${i.b}</span>
                        <span class="o-blue">${i.o}</span>
                        <span class="s-purple">${i.s}</span>
                        <span class="n-black">${i.h}</span>
                    </div>
                    <div class="tr-label">${i.tr}</div>
                </div>`;
        });
        
        const g2 = document.getElementById('g2');
        g2.innerHTML = "";
        harfler.forEach(i => {
            const nc = i.nobind ? 'nobind' : '';
            g2.innerHTML += `<div class="flip-box ${nc}" onclick="handleFlipBox(this)"><div class="flip-inner"><div class="face">${i.h}</div><div class="face face-back">${i.tr}</div></div></div>`;
        });
        
        if(typeof memoryGame !== 'undefined') memoryGame.init();
    }
};

const memoryGame = {
    mode: 'single', turn: 1, opened: [], matchedCount: 0, targetPairs: 9, scores: { p1: 0, p2: 0 },
    
    toggleSwitch: function(isMulti) {
        document.getElementById('mem-toggle').checked = isMulti;
        playClick();
        this.mode = isMulti ? 'multi' : 'single';
        this.init();
    },

    init: function() {
        const g3 = document.getElementById('g3');
        if (!g3) return;
        
        this.targetPairs = parseInt(document.getElementById('pairCount').value);
        g3.innerHTML = "";
        document.getElementById('resetArea').style.display = 'none';
        this.opened = []; this.matchedCount = 0; this.turn = 1; this.scores = { p1: 0, p2: 0 };
        
        document.getElementById('msc1').innerText = "0";
        document.getElementById('msc2').innerText = "0";
        
        this.updateTurnUI();

        let items = [];
        [...harfler].sort(() => Math.random() - 0.5).slice(0, this.targetPairs).forEach(h => {
            items.push({ text: h.h, match: h.tr });
            items.push({ text: h.tr, match: h.tr });
        });

        items.sort(() => Math.random() - 0.5).forEach(item => {
            const card = document.createElement('div');
            card.className = 'mem-item'; card.innerText = item.text; card.dataset.match = item.match;
            card.onclick = () => this.handleFlip(card);
            g3.appendChild(card);
        });

        let totalCards = this.targetPairs * 2;
        let cols = 4; 
        if (totalCards > 12) cols = 6; 
        if (totalCards > 24) cols = 7; 
        if (window.innerWidth <= 768) cols = (totalCards <= 12) ? 3 : 4;

        g3.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    },
    
    updateTurnUI: function() {
        const p1Box = document.getElementById('p1-box');
        const p2Box = document.getElementById('p2-box');
        const title1 = document.getElementById('p1-title');

        if (this.mode === 'single') {
            title1.innerText = "SKOR";
            p1Box.style.display = 'flex';
            p1Box.classList.remove('active-p'); 
            p2Box.style.display = 'none';
        } else {
            title1.innerText = "OYUNCU 1";
            p1Box.style.display = 'flex';
            p2Box.style.display = 'flex';
            p1Box.classList.toggle('active-p', this.turn === 1);
            p2Box.classList.toggle('active-p', this.turn === 2);
        }
    },
    
    handleFlip: function(card) {
        if (this.opened.length < 2 && !card.classList.contains('show') && !card.classList.contains('matched')) {
            playClick();
            const turnClass = this.turn === 1 ? 'p1-turn' : 'p2-turn';
            card.classList.add('show', turnClass);
            this.opened.push(card);
            if (this.opened.length === 2) setTimeout(() => this.checkMatch(), 600);
        }
    },
    
    checkMatch: function() {
        const [c1, c2] = this.opened;
        if (c1.dataset.match === c2.dataset.match) {
            playCorrect(); // Sinüs Dalgası ile Doğru Sesi
            
            c1.classList.add('matched'); c2.classList.add('matched');

            let activePlayer = this.mode === 'multi' ? this.turn : 1;
            this.scores['p' + activePlayer]++;
            document.getElementById('msc' + activePlayer).innerText = this.scores['p' + activePlayer];
            
            this.matchedCount++; this.opened = [];
            
            if (this.matchedCount === this.targetPairs) {
                document.getElementById('resetArea').style.display = 'block';
                setTimeout(() => {
                    let msg = "Tebrikler!";
                    if (this.mode === 'multi') msg = this.scores.p1 > this.scores.p2 ? "OYUNCU 1 KAZANDI! 🎉" : (this.scores.p2 > this.scores.p1 ? "OYUNCU 2 KAZANDI! 🎉" : "BERABERE! 🤝");
                    alert(msg);
                }, 400);
            }
        } else {
            playWrong(); // Sinüs Dalgası ile Yanlış Sesi
            
            setTimeout(() => {
                c1.classList.remove('show', 'p1-turn', 'p2-turn');
                c2.classList.remove('show', 'p1-turn', 'p2-turn');
                this.opened = [];
                if (this.mode === 'multi') { 
                    this.turn = this.turn === 1 ? 2 : 1; 
                    this.updateTurnUI(); 
                }
            }, 800);
        }
    }
};

const game = {
    mode: 'multi', 
    score: {p1:0, p2:0}, cur: "", p1S: null, p2S: null, t1: 0, t2: 0, questionPool: [],
    
    toggleMode: function(m) {
        playClick();
        this.mode = m;
        document.getElementById('yarisma-toggle').checked = (m === 'multi');
    },

    // Yeni eklendi: Menüye / Mod seçimine geri dönme
    showMenu: function() {
        playClick();
        document.getElementById('duel-stage-container').style.display = 'none';
        document.getElementById('startInfo').style.display = 'flex';
        
        // Arka planda çalışan sayacı durdur (Hata önleyici)
        if (this.timerTimeout) clearTimeout(this.timerTimeout);
        if (this.animTimeout) clearTimeout(this.animTimeout);
        
        // Puanları ve arayüzü sıfırla
        this.score = {p1:0, p2:0};
        document.getElementById('sc1').innerText = "0";
        document.getElementById('sc2').innerText = "0";
        document.getElementById('pb1').style.width = '0%';
        document.getElementById('pb2').style.width = '0%';
    },

    fillPool: function() { this.questionPool = [...harfler].sort(() => Math.random() - 0.5); },
    
    start: function() {
        playClick(); 
        
        document.getElementById('startInfo').style.display = 'none'; 
        document.getElementById('duel-stage-container').style.display = 'flex';
        
        // Moda göre arayüzü ayarla
        if (this.mode === 'single') {
            document.getElementById('z2').style.display = 'none';
            document.getElementById('pb2-container').style.display = 'none';
            document.getElementById('z1-title').innerHTML = 'SKOR: <b id="sc1">' + this.score.p1 + '</b>';
        } else {
            document.getElementById('z2').style.display = 'flex';
            document.getElementById('pb2-container').style.display = 'block';
            document.getElementById('z1-title').innerHTML = 'OYUNCU 1 SKOR: <b id="sc1">' + this.score.p1 + '</b>';
            document.getElementById('z2-title').innerHTML = 'OYUNCU 2 SKOR: <b id="sc2">' + this.score.p2 + '</b>';
        }

        document.getElementById('z1').classList.remove('zone-correct', 'zone-wrong');
        document.getElementById('z2').classList.remove('zone-correct', 'zone-wrong');
        
        document.getElementById('countdown-overlay').style.display = 'none';
        const nBtn = document.getElementById('nextBtn');
        nBtn.style.display = 'none'; 
        
        this.p1S = this.p2S = null;
        if(this.questionPool.length === 0) this.fillPool();
        const target = this.questionPool.pop(); 
        this.cur = target.tr;
        
        let activePlayers = this.mode === 'single' ? ['1'] : ['1', '2'];

        activePlayers.forEach(p => {
            document.getElementById(`dq${p}`).innerText = target.h;
            const grid = document.getElementById(`ag${p}`); 
            grid.innerHTML = "";
            let opts = [this.cur]; 
            while(opts.length < 4) { 
                let r = harfler[Math.floor(Math.random()*harfler.length)].tr; 
                if(!opts.includes(r)) opts.push(r); 
            }
            opts.sort(() => Math.random() - 0.5).forEach(o => { 
                grid.innerHTML += `<button class="btn-ans" onclick="game.select('${p}',this,'${o}')">${o}</button>`; 
            });
        });
    },
    
    select: function(p, btn, val) { 
        if(this[`p${p}S`] !== null) return; 
        playClick(); 
        this[`p${p}S`] = val; this[`t${p}`] = Date.now(); 
        btn.classList.add('selected'); 
        
        if (this.mode === 'single') {
            if(this.p1S) this.reveal();
        } else {
            if(this.p1S && this.p2S) this.reveal(); 
        }
    },
    
    reveal: function() {
        let p1Correct = (this.p1S === this.cur);

        // --- TEK KİŞİLİK MANTIK ---
        if (this.mode === 'single') {
            const z1 = document.getElementById('z1');
            if(p1Correct) {
                z1.classList.add('zone-correct'); 
                const popup = document.createElement('div'); 
                popup.className = 'puan-popup'; popup.innerText = "+10"; 
                z1.appendChild(popup); setTimeout(() => popup.remove(), 1000);
                this.score.p1 += 10; 
                playCorrect();
            } else {
                z1.classList.add('zone-wrong');
                playWrong();
            }
        } 
        // --- İKİ KİŞİLİK MANTIK ---
        else {
            let p2Correct = (this.p2S === this.cur);
            
            ['1','2'].forEach(p => {
                const z = document.getElementById(`z${p}`);
                const isCorrect = this[`p${p}S`] === this.cur;
                
                if(isCorrect) {
                    z.classList.add('zone-correct'); 
                    const popup = document.createElement('div'); 
                    popup.className = 'puan-popup'; popup.innerText = "+5"; 
                    z.appendChild(popup); setTimeout(() => popup.remove(), 1000);
                    this.score[`p${p}`] += 5;
                } else { 
                    z.classList.add('zone-wrong'); 
                }
            });

            if(p1Correct || p2Correct) playCorrect(); else playWrong();

            if(p1Correct && !p2Correct) {
                this.score.p1 += 5;
                const p1Bonus = document.createElement('div'); 
                p1Bonus.className = 'puan-popup'; p1Bonus.innerText = "HATA BONUSU! +5"; p1Bonus.style.color = "#38bdf8"; p1Bonus.style.top = "15%";
                document.getElementById('z1').appendChild(p1Bonus); setTimeout(() => p1Bonus.remove(), 1000);
            } else if(p2Correct && !p1Correct) {
                this.score.p2 += 5;
                const p2Bonus = document.createElement('div'); 
                p2Bonus.className = 'puan-popup'; p2Bonus.innerText = "HATA BONUSU! +5"; p2Bonus.style.color = "#4ade80"; p2Bonus.style.top = "15%";
                document.getElementById('z2').appendChild(p2Bonus); setTimeout(() => p2Bonus.remove(), 1000);
            } else if(p1Correct && p2Correct) {
                if(this.t1 < this.t2) {
                    this.score.p1 += 5;
                    const p1Bonus = document.createElement('div'); 
                    p1Bonus.className = 'puan-popup'; p1Bonus.innerText = "HIZLI! +5"; p1Bonus.style.color = "#38bdf8"; p1Bonus.style.top = "15%";
                    document.getElementById('z1').appendChild(p1Bonus); setTimeout(() => p1Bonus.remove(), 1000);
                } else if(this.t2 < this.t1) {
                    this.score.p2 += 5;
                    const p2Bonus = document.createElement('div'); 
                    p2Bonus.className = 'puan-popup'; p2Bonus.innerText = "HIZLI! +5"; p2Bonus.style.color = "#4ade80"; p2Bonus.style.top = "15%";
                    document.getElementById('z2').appendChild(p2Bonus); setTimeout(() => p2Bonus.remove(), 1000);
                }
            }
        }

        // Skor Sınırı ve Bar Güncellemesi
        if(this.score.p1 > 100) this.score.p1 = 100;
        if(this.score.p2 > 100) this.score.p2 = 100;

        document.getElementById('sc1').innerText = this.score.p1; 
        if(this.mode !== 'single') document.getElementById('sc2').innerText = this.score.p2; 
        
        document.getElementById('pb1').style.width = this.score.p1 + '%';
        document.getElementById('pb2').style.width = this.score.p2 + '%';

        // Bitiş Kontrolü
        if(this.score.p1 >= 100 || this.score.p2 >= 100) {
            const nBtn = document.getElementById('nextBtn');
            nBtn.innerText = "🏆 YENİDEN BAŞLAT";
            nBtn.onclick = () => this.resetGame();
            nBtn.style.display = 'block'; 
            
            setTimeout(() => {
                if (this.mode === 'single') {
                    alert("HARİKA! 100 PUANLA OYUNU TAMAMLADIN! 🎉");
                } else {
                    if(this.score.p1 === 100 && this.score.p2 === 100) alert("İNANILMAZ! BERABERE BİTTİ! 🤝");
                    else if(this.score.p1 >= 100) alert("OYUNCU 1 KAZANDI! 🎉");
                    else alert("OYUNCU 2 KAZANDI! 🎉");
                }
            }, 500);
        } else {
            this.startCountdown();
        }
    },
    
    startCountdown: function() {
        const overlay = document.getElementById('countdown-overlay');
        const circle = document.getElementById('countdown-circle');
        
        overlay.classList.remove('pop-out');
        overlay.style.display = 'block';
        
        circle.style.transition = 'none';
        circle.style.strokeDashoffset = '0';
        
        void circle.offsetWidth;
        
        circle.style.transition = 'stroke-dashoffset 2s linear';
        circle.style.strokeDashoffset = '264'; 
        
        this.timerTimeout = setTimeout(() => {
            overlay.classList.add('pop-out');
            this.animTimeout = setTimeout(() => {
                overlay.style.display = 'none';
                this.start();
            }, 400); 
        }, 2000);
    },
    
    resetGame: function() {
        // Yeniden Başlatılınca Mod Seçimine Dönsün
        this.showMenu(); 
    }
};

ui.init();