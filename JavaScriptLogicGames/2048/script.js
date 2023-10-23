
document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('game-board');
    const size = 4; // Size of the game board (4x4 in this case)
    const boardData = new Array(size).fill(null).map(() => new Array(size).fill(null));

    // Initialize the game board
    function initGame() {
        // Add initial tiles to the board
        addTile();
        addTile();
        updateBoard();
    }

    // Add a new tile (2 or 4) to a random empty cell
    function addTile() {
        const emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (!boardData[i][j]) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            boardData[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Update the visual representation of the game board
    function updateBoard() {
        // Clear the board
        board.innerHTML = '';
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const tile = boardData[i][j];
                const tileDiv = document.createElement('div');
                tileDiv.classList.add('tile');
                tileDiv.innerText = tile ? tile : '';
                tileDiv.style.backgroundColor = getTileColor(tile);
                board.appendChild(tileDiv);
            }
        }
    }

    // Define tile colors
    function getTileColor(value) {
        // Customize tile colors based on the value
        switch (value) {
            case 2:
                return '#EEE4DA';
            case 4:
                return '#EDE0C8';
            // Add more colors for higher values if needed
            default:
                return '#CDC1B4';
        }
    }

    // Initialize the game
    initGame();
});
