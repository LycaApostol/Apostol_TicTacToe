const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const aiToggleBtn = document.getElementById("ai-toggle");
const statusCard = document.getElementById("status-card");
const statusText = document.getElementById("status");
const catScoreEl = document.getElementById("cat-score");
const dogScoreEl = document.getElementById("dog-score");
const drawScoreEl = document.getElementById("draw-score");

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "🐱";
let aiEnabled = false;
let scores = { cat: 0, dog: 0, draw: 0 };

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", () => handleCellClick(cell));
});

restartBtn.addEventListener("click", resetGame);
aiToggleBtn.addEventListener("click", toggleAI);

function handleCellClick(cell) {
    const index = parseInt(cell.id);
    if (boardState[index] !== "" || checkWinner()) return;

    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        updateScore(currentPlayer);
        alert(`${currentPlayer} wins!`);
        return;
    }

    if (!boardState.includes("")) {
        updateScore("draw");
        alert("It's a draw!");
        return;
    }

    currentPlayer = currentPlayer === "🐱" ? "🐶" : "🐱";

    if (aiEnabled && currentPlayer === "🐶") {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let emptyCells = boardState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (emptyCells.length === 0) return;

    let randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    boardState[randomMove] = "🐶";
    cells[randomMove].textContent = "🐶";

    if (checkWinner()) {
        updateScore("🐶");
        alert("🐶 wins!");
        return;
    }

    if (!boardState.includes("")) {
        updateScore("draw");
        alert("It's a draw!");
        return;
    }

    currentPlayer = "🐱";
}

function checkWinner() {
    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return boardState[a] !== "" && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
}

function updateScore(winner) {
    if (winner === "draw") {
        scores.draw++;
        drawScoreEl.textContent = scores.draw;
        statusText.textContent = "It's a draw!";
    } else {
        scores[winner === "🐱" ? "cat" : "dog"]++;
        catScoreEl.textContent = scores.cat;
        dogScoreEl.textContent = scores.dog;
        statusText.textContent = `${winner} wins!`;
    }
    statusCard.classList.remove("hidden");
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    currentPlayer = "🐱";
    statusCard.classList.add("hidden");
}

function toggleAI() {
    aiEnabled = !aiEnabled;
    aiToggleBtn.textContent = aiEnabled ? "Playing vs AI" : "Playing vs Player";
    resetGame();
}
