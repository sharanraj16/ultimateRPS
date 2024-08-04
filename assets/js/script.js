document.addEventListener("DOMContentLoaded", () => {
    const backgroundMusic = document.getElementById("background-music");
    const volumeBtn = document.getElementById("volume-btn");
    let isMuted = false;

    volumeBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        if (isMuted) {
            backgroundMusic.muted = true;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            backgroundMusic.muted = false;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    // Define themes
    const themes = {
        theme1: 'theme1',
        theme2: 'theme2',
        theme3: 'theme3',
        theme4: 'theme4',
    };

    function applyTheme(theme) {
        document.body.classList.remove(...Object.values(themes));
        document.body.classList.add(themes[theme]);
    }

    // Event listeners for theme buttons
    document.getElementById('theme1-btn').addEventListener('click', () => applyTheme('theme1'));
    document.getElementById('theme2-btn').addEventListener('click', () => applyTheme('theme2'));
    document.getElementById('theme3-btn').addEventListener('click', () => applyTheme('theme3'));
    document.getElementById('theme4-btn').addEventListener('click', () => applyTheme('theme4'));

    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;
    const maxScore = 10;
    let timerInterval;
    let timerTime = 15;
    let difficulty = 1; // Default difficulty level

    // Load sound elements
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');

    // Function to play sounds
    function playSound(sound) {
        sound.currentTime = 0; // Restart sound
        sound.play().catch(error => {
            console.log("Error playing sound:", error);
        });
    }

    // Show the Customize modal
    document.getElementById('customize-btn').addEventListener('click', function() {
        document.getElementById('customize-modal').style.display = 'block';
    });

    // Close the Customize modal
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('customize-modal').style.display = 'none';
    });

    // Close the modal if clicked outside of it
    window.onclick = function(event) {
        if (event.target === document.getElementById('customize-modal')) {
            document.getElementById('customize-modal').style.display = 'none';
        }
        if (event.target === document.getElementById('rules-modal')) {
            hideRules();
        }
    };

    // Apply the selected theme
    window.setTheme = function(theme) {
        applyTheme(theme);
    };

    window.showDifficulty = function() {
        const playerName = document.getElementById('player-name').value.trim();
        const nameError = document.getElementById('name-error');

        if (playerName === "") {
            nameError.textContent = "Please enter a valid name.";
        } else {
            nameError.textContent = "";
            document.getElementById('name-section').style.display = 'none';
            document.getElementById('difficulty-section').style.display = 'block';
        }
    };

    window.setDifficulty = function(level) {
        difficulty = level;
        document.getElementById('difficulty-section').style.display = 'none';
        startGame();
    };

    function startGame() {
        playSound(clickSound);

        const playerName = document.getElementById('player-name').value.trim();
        const welcomeMessage = document.getElementById('welcome-message');
        const gameSection = document.getElementById('game-section');

        welcomeMessage.textContent = `Welcome, ${playerName}! Choose your move below.`;
        gameSection.style.display = 'block';
        startTimer();

        // Start background music
        backgroundMusic.play().catch(error => {
            console.log("Error playing background music:", error);
        });
    }

    function startTimer() {
        timerTime = 15;
        document.getElementById('timer-container').style.display = 'block';
        document.getElementById('timer').textContent = `Time left: ${timerTime}s`;
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timerTime--;
        document.getElementById('timer').textContent = `Time left: ${timerTime}s`;

        if (timerTime <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timer-container').style.display = 'none';
            playGame(null); // Automatically play for computer
        }
    }

    window.playGame = function(playerChoice) {
        playSound(clickSound);
        clearInterval(timerInterval);
        document.getElementById('timer-container').style.display = 'none';

        if (playerScore >= maxScore || computerScore >= maxScore) {
            return; // Game is over, no more actions allowed
        }

        const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

        // Adjust computer's choice based on difficulty level
        let computerChoice = choices[Math.floor(Math.random() * choices.length)];
        if (difficulty > 1) {
            if (Math.random() < (difficulty - 1) * 0.2) { // Increase chance of winning
                computerChoice = getComputerWinningChoice(playerChoice);
            }
        }

        const resultMessage = document.getElementById('result-message');

        const winningConditions = {
            rock: ['scissors', 'lizard'],
            paper: ['rock', 'spock'],
            scissors: ['paper', 'lizard'],
            lizard: ['paper', 'spock'],
            spock: ['rock', 'scissors']
        };

        let result;

        if (playerChoice === computerChoice) {
            result = "It's a draw!";
        } else if (winningConditions[playerChoice].includes(computerChoice)) {
            result = `You win this round! The computer chose ${computerChoice}.`;
            playerScore++;
        } else {
            result = `You lose this round! The computer chose ${computerChoice}.`;
            computerScore++;
        }

        roundsPlayed++; // Increment rounds counter

        document.getElementById('player-score').textContent = `Player Score: ${playerScore}`;
        document.getElementById('computer-score').textContent = `Computer Score: ${computerScore}`;

        if (playerScore >= maxScore || computerScore >= maxScore) {
            endGame(playerScore >= maxScore ? "Congratulations! You won the game!" : "Game Over! The computer won the game.");
        } else {
            resultMessage.classList.remove('fade-in');
            void resultMessage.offsetWidth; // Trigger reflow
            resultMessage.classList.add('fade-in');
            resultMessage.textContent = result;
            startTimer(); // Restart timer for the next round
        }
    };

    function getComputerWinningChoice(playerChoice) {
        const winningConditions = {
            rock: 'paper',
            paper: 'scissors',
            scissors: 'rock',
            lizard: 'rock',
            spock: 'lizard'
        };
        return winningConditions[playerChoice];
    }

    function endGame(message) {
        document.getElementById('game-section').style.display = 'none';
        document.getElementById('game-over-message').textContent = message;
        document.getElementById('game-over').style.display = 'block';

        // Play win/lose sound based on the final result
        if (message.includes("Congratulations")) {
            playSound(winSound);
        } else {
            playSound(loseSound);
        }

        // Stop background music when the game ends
        backgroundMusic.pause();
    }

    window.restartGame = function() {
        playSound(clickSound);

        // Reset game state
        playerScore = 0;
        computerScore = 0;
        roundsPlayed = 0;

        document.getElementById('player-score').textContent = `Player Score: ${playerScore}`;
        document.getElementById('computer-score').textContent = `Computer Score: ${computerScore}`;
        document.getElementById('result-message').textContent = "";

        document.getElementById('name-section').style.display = 'block';
        document.getElementById('game-section').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('difficulty-section').style.display = 'none'; // Hide difficulty section initially

        // Restart background music
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(error => {
            console.log("Error playing background music:", error);
        });
    };

    window.showRules = function() {
        playSound(clickSound);
        document.getElementById('rules-modal').style.display = 'block';
    };

    window.hideRules = function() {
        document.getElementById('rules-modal').style.display = 'none';
    };
});
