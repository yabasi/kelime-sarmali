class WordGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.wordInput = document.getElementById('word-input');
        this.submitButton = document.getElementById('submit-word');
        this.scoreValue = document.getElementById('score-value');
        this.timeValue = document.getElementById('time-value');
        this.alertBar = document.getElementById('alert-bar');
        this.gameContainer = document.getElementById('game-container');
        
        this.score = 0;
        this.timeLeft = 60;
        this.letters = [];
        this.usedWords = [];
        this.possibleWords = [];
        this.turkishWords = [
            'anne', 'baba', 'çocuk', 'ev', 'araba', 'okul', 'kitap', 'kalem', 'defter',
            'ağaç', 'çiçek', 'güneş', 'ay', 'yıldız', 'deniz', 'göl', 'dağ', 'orman',
            'kuş', 'kedi', 'köpek', 'balık', 'at', 'inek', 'koyun', 'tavuk', 'horoz',
            'elma', 'armut', 'portakal', 'muz', 'üzüm', 'kiraz', 'çilek', 'karpuz',
            'ekmek', 'su', 'süt', 'çay', 'kahve', 'yemek', 'sofra', 'tabak', 'bardak',
            'masa', 'sandalye', 'koltuk', 'yatak', 'dolap', 'pencere', 'kapı', 'tavan'
        ];

        this.init();
    }

    init() {
        this.setupCanvas();
        this.addEventListeners();
        this.startGame();
    }

    setupCanvas() {
        this.canvasSize = 300;
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
    }

    addEventListeners() {
        this.submitButton.addEventListener('click', () => this.submitWord());
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitWord();
            }
        });
    }

    startGame() {
        this.score = 0;
        this.timeLeft = this.timeLeft;
        this.letters = [];
        this.usedWords = [];
        this.scoreValue.textContent = this.score;
        this.timeValue.textContent = this.timeLeft;
        this.startTimer();
        this.generateInitialLetters();
        this.drawSpiral();
        this.findPossibleWords();
    }

    generateInitialLetters() {
        for (let i = 0; i < 20; i++) {
            this.letters.push(this.getRandomLetter());
        }
    }

    getRandomLetter() {
        const alphabet = 'ABCDEFGHIJKLMNOPRSTUVYZÇĞİÖŞÜ';
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    drawSpiral() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        let angle = 0;
        let radius = 20;
        const letterSpacing = 20;

        for (let i = 0; i < this.letters.length; i++) {
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.letters[i], x, y);

            angle += 0.5;
            radius += letterSpacing / (2 * Math.PI);
        }

        if (radius > this.canvasSize / 2 - 20) {
            this.canvasSize += 100;
            this.canvas.width = this.canvasSize;
            this.canvas.height = this.canvasSize;
            this.drawSpiral();
        }
    }

    findPossibleWords() {
        this.possibleWords = this.turkishWords.filter(word => {
            let availableLetters = [...this.letters];
            for (let char of word) {
                let index = availableLetters.findIndex(l => l.toLowerCase() === char.toLowerCase());
                if (index === -1) return false;
                availableLetters.splice(index, 1);
            }
            return true;
        });
    }

    showAlert(message) {
        this.alertBar.textContent = message;
        this.alertBar.classList.remove('hidden');
        setTimeout(() => {
            this.alertBar.classList.add('hidden');
        }, 3000);
    }

    submitWord() {
        const word = this.wordInput.value.trim().toLowerCase();
        if (word.length >= 3 && this.isValidWord(word)) {
            this.score += word.length;
            this.scoreValue.textContent = this.score;
            this.usedWords.push(word);
            this.wordInput.value = '';

            for (let char of word) {
                let index = this.letters.findIndex(l => l.toLowerCase() === char.toLowerCase());
                if (index !== -1) {
                    this.letters.splice(index, 1);
                }
            }

            for (let i = 0; i < word.length; i++) {
                this.letters.push(this.getRandomLetter());
            }
            this.drawSpiral();
            this.findPossibleWords();
        } else {
            this.showAlert('Geçersiz kelime! Lütfen mevcut harflerle geçerli bir Türkçe kelime oluşturun.');
            this.wordInput.value = '';
        }
    }

    isValidWord(word) {
        if (!this.turkishWords.includes(word.toLowerCase())) return false;

        let availableLetters = [...this.letters];
        for (let char of word) {
            let index = availableLetters.findIndex(l => l.toLowerCase() === char.toLowerCase());
            if (index === -1) return false;
            availableLetters.splice(index, 1);
        }
        return true;
    }

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            this.timeValue.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.showGameOverScreen();
            }
        }, 1000);
    }

    showGameOverScreen() {
        const missedWords = this.possibleWords.filter(word => !this.usedWords.includes(word));
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over-screen';
        gameOverScreen.innerHTML = `
            <div id="game-over-content">
                <h2>Oyun Bitti!</h2>
                <p>Puanınız: ${this.score}</p>
                <h3>Kullandığınız Kelimeler:</h3>
                <div id="word-list">
                    ${this.usedWords.map(word => `<p>${word}</p>`).join('')}
                </div>
                <h3>Kaçırdığınız Kelimeler:</h3>
                <div id="missed-word-list">
                    ${missedWords.map(word => `<p>${word}</p>`).join('')}
                </div>
                <button id="play-again">Tekrar Oyna</button>
            </div>
        `;
        document.body.appendChild(gameOverScreen);

        document.getElementById('play-again').addEventListener('click', () => {
            document.body.removeChild(gameOverScreen);
            this.startGame();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordGame();
});
