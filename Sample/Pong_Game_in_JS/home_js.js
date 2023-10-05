// Pong game variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;

let playerScore = 0;
let computerScore = 0;

// Event listeners for paddle movement
canvas.addEventListener("mousemove", (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
    paddle1Y = mouseY;
});

// Function to move the computer paddle
function moveComputerPaddle() {
    const centerOfPaddle = paddle2Y + paddleHeight / 2;
    if (centerOfPaddle < ballY - 35) {
        paddle2Y += paddleSpeed;
    } else if (centerOfPaddle > ballY + 35) {
        paddle2Y -= paddleSpeed;
    }
}

// Function to update game state
function updateGame() {
    moveComputerPaddle();

    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        ballX <= paddleWidth &&
        ballY > paddle1Y &&
        ballY < paddle1Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    if (
        ballX >= canvas.width - paddleWidth - ballSize &&
        ballY > paddle2Y &&
        ballY < paddle2Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX <= 0) {
        computerScore++;
        resetBall();
    } else if (ballX >= canvas.width) {
        playerScore++;
        resetBall();
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// Function to reset the ball
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
}

// Function to render the game
function drawGame() {
    // Clear the canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "24px Arial";
    ctx.fillText("Player: " + playerScore, 50, 50);
    ctx.fillText("Computer: " + computerScore, canvas.width - 200, 50);
}

// Game loop
function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
