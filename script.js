// --- JOGO DA MEMÓRIA ---
const gameBoard = document.getElementById('memory-game');

if (gameBoard) {
    const icons = ['🚀', '💻', '☁️', '📊', '🔒', '⚙️', '📡', '💾'];
    let cards = [...icons, ...icons]; // Duplicar para formar pares
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        shuffle(cards);
        gameBoard.innerHTML = '';
        cards.forEach(icon => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = icon;
            card.innerHTML = `
                <div class="front-face">${icon}</div>
                <div class="back-face"></div>
            `;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matchedPairs++;
        if (matchedPairs === icons.length) {
            setTimeout(() => {
                document.getElementById('memory-game').style.display = 'none';
                document.getElementById('victory-message').style.display = 'block';
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    createBoard();
}

// --- FILTROS DE PROJETOS ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}