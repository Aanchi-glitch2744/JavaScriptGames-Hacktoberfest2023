const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Paddle properties
        const paddleWidth = 75;
        const paddleHeight = 10;
        let paddleX = (canvas.width - paddleWidth) / 2;

        // Ball properties
        const ballRadius = 10;
        let ballX = canvas.width / 2;
        let ballY = canvas.height - 30;
        let ballSpeedX = 5;
        let ballSpeedY = -5;

        // Paddle controls
        let rightPressed = false;
        let leftPressed = false;

        // Brick properties
        const brickRowCount = 3;
        const brickColumnCount = 5;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        // Event listeners for paddle control
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        function keyDownHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            } else if (e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }

        // Collision detection for bricks
        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const brick = bricks[c][r];
                    if (brick.status == 1) {
                        if (
                            ballX > brick.x &&
                            ballX < brick.x + brickWidth &&
                            ballY > brick.y &&
                            ballY < brick.y + brickHeight
                        ) {
                            ballSpeedY = -ballSpeedY;
                            brick.status = 0;
                        }
                    }
                }
            }
        }

        // Draw the ball
        function drawBall() {
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }

        // Draw the paddle
        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }

        // Draw the bricks
        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status == 1) {
                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }

        // Game over condition
        function gameOver() {
            const isGameOver = bricks.every((col) => col.every((brick) => brick.status == 0));
            if (isGameOver) {
                alert("Congratulations! You won!");
                document.location.reload();
            }
        }

        // Game update
        function updateGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();
            gameOver();

            if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballY + ballSpeedY < ballRadius) {
                ballSpeedY = -ballSpeedY;
            } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
                if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballSpeedY = -ballSpeedY;
                } else {
                    alert("Game Over. Try again!");
                    document.location.reload();
                }
            }

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            ballX += ballSpeedX;
            ballY += ballSpeedY;
            requestAnimationFrame(updateGame);
        }

        updateGame();
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        