const playBoard = document.querySelector(".play-board");
const scoreDisplay = document.querySelector(".score");
const livesDisplay = document.querySelector(".lives");
const timerDisplay = document.querySelector(".timer");
const audio = document.getElementById('myAudio');

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let gameOver = false;
let lastRenderTime = 0;
const snakeSpeed = 100;
let score = 0;
let timer = 0;
let lives = 3;
let gameStarted = false;
let timerIntervalID;
let paused = false;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Snake moving directions
const changeDirection = (e) => {
    if (!gameStarted && !paused) {
        startTimer();
        gameStarted = true;
    }

    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.key.toLowerCase() === 'p') {
        paused = !paused;
        if (paused) {
            pauseModal.style.display = "flex";
            clearInterval(timerIntervalID);
        } else {
            pauseModal.style.display = "none";
            startTimer();
            window.requestAnimationFrame(initGame);
        }
    }
}

// Handle game over and reset game
const handleGameOver = () => {
    lives--;
    if (lives > 0) {
        alert(`Oops! Lives remaining: ${lives}`);
        resetGame();
    } else {
        playAudio();
        alert("Game Over! Press OK to restart.");
        clearInterval(timerIntervalID);
        location.reload();
    }
}

// Reset game
const resetGame = () => {
    snakeX = 5;
    snakeY = 10;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    gameOver = false;
    changeFoodPosition();
    updateDisplay();
    gameStarted = false; 
    timer = 0;
    timerDisplay.textContent = `Timer: ${timer}`;
    clearInterval(timerIntervalID);
    window.requestAnimationFrame(initGame);
}

// Update display
const updateDisplay = () => {
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
}

// Initialize game
const initGame = (currentTime) => {
    if (paused) return;
    if (gameOver) return handleGameOver();
    window.requestAnimationFrame(initGame);

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < snakeSpeed / 1000) return;

    lastRenderTime = currentTime;

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // If snake hits the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        updateDisplay();
    }

    // Snake body gets bigger with food
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    // Check if snake hits itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (i === 0) {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}">
                                <img src="ribbon.png" class="ribbon-img">
                           </div>`;
        } else {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }

        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;

    // Check if snake hits the wall
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
}

// Start the timer
const startTimer = () => {
    clearInterval(timerIntervalID);
    timerIntervalID = setInterval(() => {
        if (!paused) {
            timer++;
            timerDisplay.innerText = `Timer: ${timer}`;
        }
    }, 1000);
}

// Add event listeners for continue and restart buttons
continueButton.addEventListener("click", () => {
    paused = false;
    pauseModal.style.display = "none";
    startTimer();
    window.requestAnimationFrame(initGame);
});

restartButton.addEventListener("click", () => {
    paused = false;
    pauseModal.style.display = "none";
    lives = 3;
    score = 0;
    timer = 0;
    resetGame();
    updateDisplay();
    window.requestAnimationFrame(initGame);
});

const playAudio = () => {
    audio.play();
}

changeFoodPosition();
document.addEventListener("keydown", changeDirection);
window.requestAnimationFrame(initGame);
