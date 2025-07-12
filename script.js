// JavaScript logic for Tap To Fruit Game

const fruits = ['🍎', '🍌', '🍓', '🍇', '🍉', '🍍', '🍒', '🥝', '🥭'];
const gameArea = document.getElementById("gameArea");
const scoreSpan = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const playBtn = document.getElementById("playBtn");
const selectLevelBtn = document.getElementById("selectLevelBtn");
const highScoreBtn = document.getElementById("highScoreBtn");
const landingScreen = document.getElementById("landingScreen");
const scoreboard = document.getElementById("scoreboard");
const tapSound = document.getElementById("tapSound");
const bombSound = document.getElementById("bombSound");
const gameOverSound = document.getElementById("gameOverSound");
const starSound = document.getElementById("starSound");
const levelModal = document.getElementById("levelModal");
const highScoreModal = document.getElementById("highScoreModal");
const closeHighScore = document.getElementById("closeHighScore");
const scoreEasy = document.getElementById("scoreEasy");
const scoreMedium = document.getElementById("scoreMedium");
const scoreHard = document.getElementById("scoreHard");
const levelWarningModal = document.getElementById("levelWarningModal");
const closeLevelWarning = document.getElementById("closeLevelWarning");

closeLevelWarning.addEventListener("click", () => {
  levelWarningModal.style.display = "none";
});

let score = 0;
let fruitTimeout;
let fruitSpeed = 0;
let currentLevel = "";
let isLevelSelected = false;

function randomPosition() {
  const x = Math.random() * (window.innerWidth - 50);
  const y = Math.random() * (window.innerHeight - 120);
  return { x, y };
}

function updateScoreboard() {
  scoreSpan.textContent = score;
}

function updateHighScore() {
  const key = "highScore" + capitalize(currentLevel);
  const previous = localStorage.getItem(key) || 0;
  if (score > parseInt(previous)) {
    localStorage.setItem(key, score);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showHighScore() {
  scoreEasy.textContent = localStorage.getItem("highScoreEasy") || 0;
  scoreMedium.textContent = localStorage.getItem("highScoreMedium") || 0;
  scoreHard.textContent = localStorage.getItem("highScoreHard") || 0;
  highScoreModal.style.display = "block";
}

function endGame() {
  clearTimeout(fruitTimeout);
  gameArea.querySelectorAll(".fruit").forEach(f => f.remove());
  gameOverSound.play();
  updateHighScore();
  gameOverScreen.style.display = 'block';
}

function createFruit() {
  if (gameOverScreen.style.display === 'block') return;
  gameArea.querySelectorAll(".fruit").forEach(f => f.remove());

  let fruitCount = 1;
  if (score >= 19 && score < 35) fruitCount = 2;
  if (score >= 35) fruitCount = 3;

  for (let i = 0; i < fruitCount; i++) {
    const fruit = document.createElement("div");
    fruit.className = "fruit";

    const rand = Math.random();
    const isBomb = rand < 0.15;
    const isStar = !isBomb && rand < 0.25;

    fruit.textContent = isBomb ? '💣' : (isStar ? '🌟' : fruits[Math.floor(Math.random() * fruits.length)]);
    const pos = randomPosition();
    fruit.style.left = pos.x + "px";
    fruit.style.top = pos.y + "px";

    fruit.addEventListener("click", () => {
      if (fruit.textContent === '💣') {
        bombSound.play();
        endGame();
      } else if (fruit.textContent === '🌟') {
        score += 5;
        starSound.currentTime = 0;
        starSound.play();
        fruit.remove();
        updateScoreboard();
      } else {
        score++;
        tapSound.currentTime = 0;
        tapSound.play();
        fruit.remove();
        updateScoreboard();
      }

      if (!document.querySelector(".fruit")) {
        clearTimeout(fruitTimeout);
        setTimeout(createFruit, 300);
      }
    });

    gameArea.appendChild(fruit);
  }

  fruitTimeout = setTimeout(() => {
    gameArea.querySelectorAll(".fruit").forEach(f => f.remove());
    setTimeout(createFruit, 300);
  }, fruitSpeed);
}

playBtn.addEventListener("click", () => {
  if (!isLevelSelected) {
    levelWarningModal.style.display = "block";
    return;
  }
  landingScreen.style.display = "none";
  scoreboard.style.display = "flex";
  score = 0;
  updateScoreboard();
  createFruit();
});

restartBtn.addEventListener("click", () => {
  score = 0;
  updateScoreboard();
  gameOverScreen.style.display = 'none';
  createFruit();
});

homeBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  landingScreen.style.display = "flex";
  scoreboard.style.display = "none";
  gameArea.querySelectorAll(".fruit").forEach(f => f.remove());
  clearTimeout(fruitTimeout);
  score = 0;
  updateScoreboard();
});

selectLevelBtn.addEventListener("click", () => {
  levelModal.style.display = "block";
});

document.querySelectorAll(".levelBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    fruitSpeed = parseInt(btn.dataset.speed);
    currentLevel = btn.textContent.toLowerCase();
    isLevelSelected = true;

    document.querySelectorAll(".levelBtn").forEach(b => b.classList.remove("selectedLevel"));
    btn.classList.add("selectedLevel");

    levelModal.style.display = "none";
  });
});

highScoreBtn.addEventListener("click", () => {
  showHighScore();
});

closeHighScore.addEventListener("click", () => {
  highScoreModal.style.display = "none";
});

function showModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}
