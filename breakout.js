document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('#score');
    const blockWidth = 100;
    const blockHeight = 20;
    const boardWidth = 780;
    const boardHeight = 600;
    let xDirection = -5;
    let yDirection = 5;
    const ballDiameter = 20;

    let timerID;
    let score = 0;

    const userStart = [330, 10];
    let currentPosition = userStart;

    const ballStart = [370, 40];
    let currentBallPosition = ballStart;

    class Block {
        constructor(xAxis, yAxis) {
            this.bottomLeft = [xAxis, yAxis];
            this.bottomRight = [xAxis + blockWidth, yAxis];
            this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
            this.topLeft = [xAxis, yAxis + blockHeight];
        }
    }

    const blocks = [
        new Block(10, 570),
        new Block(120, 570),
        new Block(230, 570),
        new Block(340, 570),
        new Block(450, 570),
        new Block(560, 570),
        new Block(670, 570),
        new Block(10, 540),
        new Block(120, 540),
        new Block(230, 540),
        new Block(340, 540),
        new Block(450, 540),
        new Block(560, 540),
        new Block(670, 540),
        new Block(10, 510),
        new Block(120, 510),
        new Block(230, 510),
        new Block(340, 510),
        new Block(450, 510),
        new Block(560, 510),
        new Block(670, 510),
    ];

    function addBlocks() {
        for (let i = 0; i < blocks.length; i++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.style.left = blocks[i].bottomLeft[0] + 'px';
            block.style.bottom = blocks[i].bottomLeft[1] + 'px';
            grid.appendChild(block);
        }
    }

    addBlocks();

    const user = document.createElement('div');
    user.classList.add('user');
    grid.appendChild(user);
    drawUser();

    const ball = document.createElement('div');
    ball.classList.add('ball');
    grid.appendChild(ball);
    drawBall();

    function drawUser() {
        user.style.left = currentPosition[0] + 'px';
        user.style.bottom = currentPosition[1] + 'px';
    }

    function drawBall() {
        ball.style.left = currentBallPosition[0] + 'px';
        ball.style.bottom = currentBallPosition[1] + 'px';
    }

    function moveUser(e) {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentPosition[0] > 0) {
                    currentPosition[0] -= 20;
                    drawUser();
                }
                break;
            case 'ArrowRight':
                if (currentPosition[0] < boardWidth - blockWidth) {
                    currentPosition[0] += 20;
                    drawUser();
                }
                break;
        }
    }
    document.addEventListener('keydown', moveUser);

    function moveBall() {
        currentBallPosition[0] += xDirection;
        currentBallPosition[1] += yDirection;
        drawBall();
        checkForCollision();
    }
    timerID = setInterval(moveBall, 30);

    function checkForCollision() {
        for (let i = 0; i < blocks.length; i++) {
            if (
                currentBallPosition[0] + ballDiameter > blocks[i].bottomLeft[0] &&
                currentBallPosition[0] < blocks[i].bottomRight[0] &&
                currentBallPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
                currentBallPosition[1] < blocks[i].topLeft[1]
            ) {
                const allBlocks = document.querySelectorAll('.block');
                allBlocks[i].classList.remove('block');
                blocks.splice(i, 1);
                score++;
                scoreDisplay.innerHTML = score;
                changeDirection();
                if (blocks.length === 0) {
                    scoreDisplay.innerHTML = 'You Win!';
                    clearInterval(timerID);
                }
            }
        }
        if (
            currentBallPosition[0] >= boardWidth - ballDiameter ||
            currentBallPosition[0] <= 0 ||
            currentBallPosition[1] >= boardHeight - ballDiameter
        ) {
            changeDirection();
        }

        if (
            currentBallPosition[1] <= 0
        ) {
            clearInterval(timerID);
            scoreDisplay.innerHTML = 'Game Over';
            document.removeEventListener('keydown', moveUser);
        }

        // Checks for user paddle collisions
        if (
            currentBallPosition[0] + ballDiameter > currentPosition[0] &&
            currentBallPosition[0] < currentPosition[0] + blockWidth &&
            currentBallPosition[1] + ballDiameter > currentPosition[1] &&
            currentBallPosition[1] < currentPosition[1] + blockHeight
        ) {
            changeDirection();
        }
    }

    function changeDirection() {
        if (xDirection === 5 && yDirection === 5) {
            yDirection = -5;
            return;
        }
        if (xDirection === 5 && yDirection === -5) {
            xDirection = -5;
            return;
        }
        if (xDirection === -5 && yDirection === -5) {
            yDirection = 5;
            return;
        }
        if (xDirection === -5 && yDirection === 5) {
            xDirection = 5;
            return;
        }
    }

    class FPSCounter {
        constructor() {
            this.fps = 0;
            this.lastUpdate = performance.now();
            this.frameCount = 0;
        }

        update() {
            this.frameCount++;
            const now = performance.now();
            const elapsed = now - this.lastUpdate;
            if (elapsed >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.lastUpdate = now;
                fpsCounterDisplay.textContent = `FPS: ${this.fps}`;
            }
        }
    }

    const fpsCounter = new FPSCounter();

    function gameLoop() {
        moveBall();
        fpsCounter.update();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
