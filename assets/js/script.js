let playerScore = 0;
  let computerScore = 0;
  let roundsPlayed = 0;
  const maxScore = 10;
  let difficulty = 1;
  let timerInterval;
  let timeLeft = 60;
  let gameStarted = false;

  const clickSound = document.getElementById("click-sound");
  const winSound = document.getElementById("win-sound");
  const loseSound = document.getElementById("lose-sound");

  function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.log("Error playing sound:", error);
    });
  }