document.addEventListener("DOMContentLoaded", function () {
    const cells = document.querySelectorAll(".cell");
    const statusCard = document.getElementById("status-card");
    const status = document.getElementById("status");
    const restartBtn = document.getElementById("restart");
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameActive = false;
                status.innerText = `Player ${board[a]} Wins!`;
                statusCard.style.display = "flex"; // Show status card
                disableBoard();
                return;
            }
        }

        if (!board.includes("")) {
            gameActive = false;
            status.innerText = "It's a Draw!";
            statusCard.style.display = "flex"; // Show status card
        }
    }

    function disableBoard() {
        cells.forEach(cell => cell.disabled = true);
    }

    function handleCellClick(event) {
        const index = event.target.id;
        if (!gameActive || board[index] !== "") return;

        board[index] = currentPlayer;
        event.target.innerText = currentPlayer;

        checkWinner();

        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }

    function restartGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusCard.style.display = "none"; // Hide status card
        cells.forEach(cell => {
            cell.innerText = "";
            cell.disabled = false;
        });
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    restartBtn.addEventListener("click", restartGame);

    // SignalR Setup
    const connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

    connection.start().then(() => {
        cells.forEach((cell, index) => {
            cell.addEventListener("click", function () {
                if (board[index] === "" && gameActive) {
                    connection.invoke("MakeMove", index, currentPlayer);
                }
            });
        });

        connection.on("ReceiveMove", (index, player) => {
            board[index] = player;
            cells[index].textContent = player;
            checkWinner();
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        });
    }).catch(err => console.error(err));
});
