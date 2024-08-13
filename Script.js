

const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const statusPanel = document.getElementById('status-panel');
const winnerPanel = document.getElementById('winner-panel');
const winnerMessage = document.getElementById('winner-message');
const okBtn = document.getElementById('ok-btn');

let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0 };

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];


function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (currentPlayer === "O" || cells[index].textContent !== '' || !gameActive) return;

    cell.textContent = currentPlayer;
    checkMove();
    if (gameActive) askOllama();
}

function checkMove() {
    if (checkWin()) {
        endGame(`Player ${currentPlayer} wins!`);
        scores[currentPlayer]++;
        updateScoreBoard();
        return;
    }

    if (checkDraw()) {
        endGame("It's a draw!");
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
}

function checkDraw() {
    // cells.forEach(cell => {
    //     if (cell.textContent == '') return false;
    // });
    // return true;
    return [...cells].every(cell => cell.textContent !== '');
}

function updateStatus() {
    statusText.textContent = currentPlayer === 'X' ? "Your turn" : "Computer's turn, thinking...";
    statusText.style.color = currentPlayer === 'X' ? 'blue' : 'red';
}

function updateScoreBoard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function endGame(message) {
    gameActive = false;
    conversation = [{
        role: 'assistant',
        content: systemPrompt,
    }];
    winnerMessage.textContent = message;
    winnerPanel.style.display = 'flex';
    statusPanel.style.display = 'none';
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
    });
    winnerPanel.style.display = 'none';
    statusPanel.style.display = 'block';
    updateStatus();
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

okBtn.addEventListener('click', resetGame);

updateStatus();
updateScoreBoard();