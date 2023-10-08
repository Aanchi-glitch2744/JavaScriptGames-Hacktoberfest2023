const snake = document.getElementById('snake');
const food = document.getElementById('food');
let snakeX = 2;
let snakeY = 2;
let foodX = 5;
let foodY = 5;
let directionX = 0;
let directionY = 0;
let score = 0;
const speed = 150;

function update() {
    snakeX += directionX;
    snakeY += directionY;

    if (snakeX < 0) snakeX = 9;
    if (snakeX > 9) snakeX = 0;
    if (snakeY < 0) snakeY = 9;
    if (snakeY > 9) snakeY = 0;

    snake.style.gridColumn = snakeX + 1;
    snake.style.gridRow = snakeY + 1;

    if (snakeX === foodX && snakeY === foodY) {
        score++;
        foodX = Math.floor(Math.random() * 10);
        foodY = Math.floor(Math.random() * 10);
        food.style.gridColumn = foodX + 1;
        food.style.gridRow = foodY + 1;
    }
}

function handleInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            directionX = 0;
            directionY = -1;
            break;
        case 'ArrowDown':
            directionX = 0;
            directionY = 1;
            break;
        case 'ArrowLeft':
            directionX = -1;
            directionY = 0;
            break;
        case 'ArrowRight':
            directionX = 1;
            directionY = 0;
            break;
    }
}

setInterval(update, speed);
document.addEventListener('keydown', handleInput);
