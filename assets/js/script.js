


document.addEventListener("DOMContentLoaded", () => {
    // Background music element and volume control button
    const backgroundMusic = document.getElementById("background-music");
    const volumeBtn = document.getElementById("volume-btn");
    let isMuted = false;

    // Sound elements
    const clickSound = document.getElementById("click-sound");
    const winSound = document.getElementById("win-sound");
    const loseSound = document.getElementById("lose-sound");
}

// Function to start the game and display welcome message
function startGame() {
    playSound(clickSound);

    const playerName = document.getElementById("player-name").value.trim();
    const welcomeMessage = document.getElementById("welcome-message");
    const gameSection = document.getElementById("game-section");

    welcomeMessage.textContent = `Welcome, ${playerName}! Choose your move below.`;
    gameSection.style.display = "block";

    backgroundMusic.play().catch((error) => {
        console.log("Error playing background music:", error);
    });
}
