# Minesweeper Puzzle

**Description:**
Minesweeper Puzzle is a classic single-player puzzle game that challenges your logic and memory skills. The goal is to clear a grid of hidden mines without triggering any explosions. Customize the difficulty by changing the number of mines and the grid size!

## Rules:
1. The game is played on a grid, where some cells contain hidden mines, while others are safe.
2. Click on a cell to uncover it. The numbers revealed on each cell represent the count of mines in adjacent cells.
3. Use logic to determine the locations of mines and avoid clicking on them.
4. The game ends if you trigger a mine, in which case you'll receive a "Game Over" message.

## How to Play:
1. Click the "Play" button on the start screen to start the game.
2. Use your mouse to click on the grid cells and uncover them.
3. Pay attention to the numbers on the uncovered cells to deduce the locations of mines.
4. If you uncover a mine, you lose the game, so proceed with caution.
5. The game ends when you either clear the entire grid or trigger a mine. A "Game Over" message will inform you of the outcome.

## How to Use This Code Locally:
1. Clone or download this repository to your local machine.
2. Ensure you have a compatible web browser (e.g., Google Chrome, Firefox) to run the game.
3. Open the HTML file (`index.html`) in your web browser to play the game.

## Customizing the Game:
- **Change Number of Mines:** To make the game more or less challenging, open the `scripts.js` file and modify the `totalMines` variable to your desired number of mines.

- **Change Grid Size:** You can also change the size of the game grid by adjusting the values of `rows` and `columns` in the `scripts.js` file.

```javascript
const size = 10;//set the grid size as you want it to be , note its a n*n grid
const totalMines = 20;//for more challenge increase this number and for less challenge decrease it
```

## Have Fun and Challenge Yourself:
Minesweeper is a timeless game that provides hours of entertainment while enhancing your problem-solving skills. Customize it to match your preferred level of difficulty and amaze everyone with your strategic thinking. Enjoy the game!
