// Start button functionality
document.getElementById("start-button").addEventListener("click", function () {
    document.getElementById("storyboard").style.display = "none";
    document.getElementById("game").style.display = "block";
});

// Victory screen
document.getElementById("home-button-victory").addEventListener("click", () => {
    location.reload();
});

document.getElementById("restart-button-victory").addEventListener("click", () => {
    document.getElementById("victory").style.display = "none";
    lives = 3;
    score = 0;
    resetGame();
    document.getElementById("game").style.display = "block";
});

// Lose screen
document.getElementById("home-button-lose").addEventListener("click", () => {
    location.reload();
});

document.getElementById("restart-button-lose").addEventListener("click", () => {
    document.getElementById("lose").style.display = "none";
    lives = 3;
    score = 0;
    resetGame();
    document.getElementById("game").style.display = "block";
});
