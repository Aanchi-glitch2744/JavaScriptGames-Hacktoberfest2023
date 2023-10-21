const board = document.getElementById("board");
const gameOverMessage = document.getElementById("game-over-message");
const size = 10;
const totalMines = 20;
let mines = [];

function initBoard() {
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        board.appendChild(cell);
    }

    const cells = board.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleClick(index));
    });

    generateMines();
    calculateAdjacentMines();
}

function generateMines() {
    mines = [];
    while (mines.length < totalMines) {
        const mineLocation = Math.floor(Math.random() * size * size);
        if (!mines.includes(mineLocation)) {
            mines.push(mineLocation);
        }
    }
}

function calculateAdjacentMines() {
    const cells = board.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        if (!cell.classList.contains("mine")) {
            const adjacentMines = getAdjacentMines(index);
            if (adjacentMines > 0) {
                cell.setAttribute("data-mines", adjacentMines);
            }
        }
    });
}

function getAdjacentMines(index) {
    const neighbors = [
        -size - 1,
        -size,
        -size + 1,
        -1,
        1,
        size - 1,
        size,
        size + 1,
    ];
    let count = 0;

    for (const neighbor of neighbors) {
        const neighborIndex = index + neighbor;
        if (isInBounds(neighborIndex) && mines.includes(neighborIndex)) {
            count++;
        }
    }

    return count;
}

function isInBounds(index) {
    return index >= 0 && index < size * size;
}
function checkWin() {
    const cells = board.querySelectorAll(".cell");
    const safeCells = Array.from(cells).filter(
        (cell) => !cell.classList.contains("mine")
    );

    const allSafeCellsUncovered = safeCells.every((cell) =>
        cell.classList.contains("uncovered")
    );

    if (allSafeCellsUncovered) {
        gameOverMessage.textContent = "Congratulations! You won the game!";
        gameOverMessage.style.display = "block";
    }
}

function handleClick(index) {
    if (mines.includes(index)) {
        uncoverAllCells();
        gameOverMessage.textContent =
            "Game over! You hit a mine. Well, you can always reload the page and try again!";
        gameOverMessage.style.display = "block";
        board.style.pointerEvents = "none";
    } else {
        const cell = board.children[index];
        cell.classList.add("uncovered");
        if (cell.getAttribute("data-mines")) {
            cell.textContent = cell.getAttribute("data-mines");
        } else if (cell.textContent === "0") {
            uncoverAdjacentCells(index);
        }
        checkWin();
    }
}

function uncoverAdjacentCells(index) {
    const neighbors = [
        -size - 1,
        -size,
        -size + 1,
        -1,
        1,
        size - 1,
        size,
        size + 1,
    ];

    for (const neighbor of neighbors) {
        const neighborIndex = index + neighbor;
        if (isInBounds(neighborIndex) && !mines.includes(neighborIndex)) {
            const cell = board.children[neighborIndex];
            if (!cell.classList.contains("uncovered")) {
                cell.classList.add("uncovered");
                if (cell.textContent === "0") {
                    uncoverAdjacentCells(neighborIndex);
                }
            }
        }
    }
}

function startGame() {
    document.querySelector(".start-screen").style.display = "none";
    board.style.display = "grid";
    initBoard();
}
function uncoverAllCells() {
    const cells = board.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        if (!cell.classList.contains("uncovered")) {
            cell.classList.add("uncovered");
            if (mines.includes(index)) {
                const mineCircle = document.createElement("div");
                mineCircle.classList.add("mine");
                cell.innerHTML = "";
                cell.appendChild(mineCircle);
            } else if (cell.getAttribute("data-mines")) {
                cell.textContent = cell.getAttribute("data-mines");
            }
        }
    });
    gameOverMessage.style.display = "block";
}
