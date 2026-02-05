// --- NAVEGAÇÃO ATIVA ---
const navLinks = document.querySelectorAll('.main-header nav a');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

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
const filterContainer = document.querySelector('.filter-container');

if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const btn = e.target;
            
            // Atualizar botões
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filtrar cards (busca dinâmica)
            const filterValue = btn.getAttribute('data-filter');
            const currentCards = document.querySelectorAll('.project-card');

            currentCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = ''; // Reseta para o padrão do CSS
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });
}