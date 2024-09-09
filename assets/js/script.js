/* jshint esversion: 6 */

document.addEventListener("DOMContentLoaded", () => {
    // Background music element and volume control button
    const backgroundMusic = document.getElementById("background-music");
    const volumeBtn = document.getElementById("volume-btn");
    let isMuted = false;

    // Sound elements
    const clickSound = document.getElementById("click-sound");
    const winSound = document.getElementById("win-sound");
    const loseSound = document.getElementById("lose-sound");

    // Game state variables
    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;
    const maxScore = 10; // Winning score
    let difficulty = 1; // Initial difficulty level
    let timerInterval;
    let timeLeft = 45; // Game timer
    let gameStarted = false;

    // Function to play a given sound
    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch((error) => {
            console.log("Error playing sound:", error);
        });
    }
  // Function to start or reset the game timer
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval); // Clear any existing timer

    timeLeft = 45; // Reset time left
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

    timerInterval = setInterval(function () {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame("Time is up!"); // End the game when time runs out
        }
    }, 1000);
}

// Function to end the game and display the result
function endGame(message) {
    document.getElementById("game-over-message").textContent = message;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-section").style.display = "none";
    backgroundMusic.pause(); // Stop background music
    playSound(message.includes("Congratulations") ? winSound : loseSound); // Play win/lose sound
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

// Play the game with the player's choice
window.playGame = (playerChoice) => {
    if (!gameStarted) {
        startTimer(); // Start the timer when the first move is made
        gameStarted = true;
    }

    playSound(clickSound);

    if (playerScore >= maxScore || computerScore >= maxScore) {
        return; // Do nothing if the game is already won
    }

    const choices = ["rock", "paper", "scissors", "lizard", "spock"];

    // Determine computer's choice, with a chance to favor winning if difficulty is higher
    let computerChoice = choices[Math.floor(Math.random() * choices.length)];
    if (difficulty > 1) {
        if (Math.random() < (difficulty - 1) * 0.2) {
            computerChoice = getComputerWinningChoice(playerChoice);
        }
    }

    const resultMessage = document.getElementById("result-message");

    // Define winning conditions for each choice
    const winningConditions = {
        rock: ["scissors", "lizard"],
        paper: ["rock", "spock"],
        scissors: ["paper", "lizard"],
        lizard: ["paper", "spock"],
        spock: ["rock", "scissors"],
    };

    let result;

    // Determine the result of the round
    if (playerChoice === computerChoice) {
        result = "It's a draw!";
    } else if (winningConditions[playerChoice].includes(computerChoice)) {
        result = `You win this round! The computer chose ${computerChoice}.`;
        playerScore++;
    } else {
        result = `You lose this round! The computer chose ${computerChoice}.`;
        computerScore++;
    }

    roundsPlayed++;

    // Game level selection after entering a valid player name
    window.showDifficulty = () => {
        const playerName = document.getElementById("player-name").value.trim();
        const nameError = document.getElementById("name-error");
        const maxLength = 10; // Set maximum allowed length

        if (playerName === "" || playerName.length > maxLength) {
            nameError.textContent = `Please enter a valid name (maximum ${maxLength} characters).`;
        } else {
            nameError.textContent = "";
            document.getElementById("name-section").style.display = "none";
            document.getElementById("difficulty-section").style.display = "block";
        }
    };

    // Set the game difficulty and start the game
    window.setDifficulty = (level) => {
        difficulty = level;
        document.getElementById("difficulty-section").style.display = "none";
        startGame();
    };
});