///////////////// VARIABLES GLOBALES ///////////////////
const canvas = document.getElementById("arenaWrapper");
const ctx = canvas.getContext("2d");

const nombreCaseLargeur = 20;
const nombreCaseHauteur = 20;

let TILE_SIZE; // calculé dynamiquement
let tickTime = 150; // vitesse du serpent en ms
//let pause = false; // placé dans gameState.js
let score = 0;
///////////////// REDIMENSION CANVAS ///////////////////
function resizeCanvas() {
  const container = document.getElementById("container");
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height * 0.8) - 100; // carré
  canvas.width = size;
  canvas.height = size;

  TILE_SIZE = Math.floor(size / nombreCaseLargeur);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// console.log("Tile Size : " + TILE_SIZE );
// console.log (" canvas size: " + canvas.width);

// Gestion des boutons de l'écran d'acceuil
let startGame = document.getElementById("startGame");
let gameCover = document.getElementById("gameCover");
//click sur startGame
startGame.addEventListener("click", () =>
  setTimeout(() => ((startGame.hidden = true), (gameCover.hidden = true)), 100)
);

// Affichage du score
const scoreSpan = document.getElementById("score").querySelector("span");
scoreSpan.textContent = score;

class Food {
  constructor(size) {
    this.size = size;
    this.placeRandom();
  }

  placeRandom() {
    this.x = Math.floor(Math.random() * nombreCaseLargeur); // on garde la grille de 20 cases
    this.y = Math.floor(Math.random() * nombreCaseHauteur);
  }

  draw(ctx) {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(
      this.x * this.size + this.size / 2, // pour centrer le cercle
      this.y * this.size + this.size / 2,
      this.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}

// Création de mon tableau d'objet food:
const foods = [];
const MAX_FOOD = 5;

function spawnFood() {
  if (!gameState.pause) {
    const newFood = new Food(TILE_SIZE);
    foods.push(newFood);

    // si > MAX_FOOD, retirer le plus ancien
    if (foods.length > MAX_FOOD) {
      foods.shift(); // supprime le premier élément du tableau
    }
  }
}

// lancer toutes les secondes
setInterval(spawnFood, 1000);

function drawFoods() {
  // sera utiliser dans gameLoop
  foods.forEach((food) => food.draw(ctx));
}

// modélisation du serpent:
const snake = {
  body: [
    { x: 10, y: 10 }, // body[0] = tête
  ],
  direction: { x: 1, y: 0 }, // démarre vers la droite
  nextDirection: { x: 1, y: 0 }, // évite les demi-tours instantanés
  growing: false,
  color: "green"
};

function moveSnake() {
  // appliquer la direction validée par le clavier
  snake.direction = snake.nextDirection;

  const head = snake.body[0];
  let newX = head.x + snake.direction.x;
  let newY = head.y + snake.direction.y;

  // gestion des bords (wrap)
  if (newX < 0) newX = nombreCaseLargeur - 1;
  if (newX >= nombreCaseLargeur) newX = 0;
  if (newY < 0) newY = nombreCaseHauteur - 1;
  if (newY >= nombreCaseHauteur) newY = 0;

  const newHead = { x: newX, y: newY };

  // ajouter la nouvelle tête devant
  snake.body.unshift(newHead); //unshift ajoute devant

  // 💥 collision avec soi-même
  if (checkSelfCollision()) {
    endGame();
  }
  // 👉 collision food ici
  checkFoodCollision();

  // retirer la queue (tant qu'on ne mange pas)
  // si on n'a pas mangé → on retire la queue
  if (!snake.growing) {
    snake.body.pop(); // pop supprime le dernier
  } else {
    snake.growing = false;
  }
}

function drawSnake() {

  snake.body.forEach((segment, index) => {
       if (index === 0) {
      ctx.fillStyle = "brown"; // tête
    } else {
      ctx.fillStyle = snake.color; // corps
    }
    ctx.fillRect(
      segment.x * TILE_SIZE,
      segment.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  });
}

function checkFoodCollision() {
  const head = snake.body[0];
  // //////ATTENTION: on fait ici une boucle inversée car le splice ferait sauter un élément ////
  // autre solution boucle normale et i-- après le splice
  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];

    if (head.x === food.x && head.y === food.y) {
      // manger la food
      foods.splice(i, 1);

      // faire grandir le serpent
      growSnake();

      // augmenter le score
      score++;
      scoreSpan.textContent = score;
    }
  }
}

function growSnake() {
  snake.growing = true;
  const tail = snake.body[snake.body.length - 1]; // dernier segment du serpent
  snake.body.push({ ...tail }); // ... est le spread opérator, c'est à dire que plutot que d'ajouter
  // l'objet tail (donc d'avoir deux segment qui pointent vers le meme objet), on va ajouter une simple copie
  // de l'objet tail, et donc le dernier segment sera bien un objet différent
}

function checkSelfCollision() {
  const head = snake.body[0];

  // on ignore l'index 0 (la tête)
  for (let i = 1; i < snake.body.length; i++) {
    const segment = snake.body[i];

    if (segment.x === head.x && segment.y === head.y) {
      return true;
    }
  }

  return false;
}

function endGame() {
  gameState.pause = true;
  gameState.running = false;

  console.log("💀 GAME OVER");
}



let lastTick = 0;

function gameLoop(timestamp) {
  if (!gameState.running) {
    // on affiche le visuel game over et un sort de la boucle
    console.log("dans gameloop");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter to play", canvas.width / 2, canvas.height / 1.5);
    ;
    return
  }

  if (gameState.pause && gameState.running) {
    ctx.fillStyle = "white";
    ctx.font = "25px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Press Space to play", canvas.width / 2, canvas.height / 1.5);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Press Space to Pause", 60, 10);
    drawFoods();
    drawSnake();
  }

  if (!gameState.pause && timestamp - lastTick > tickTime) {
    moveSnake();
    lastTick = timestamp;
  }

  requestAnimationFrame(gameLoop); //le requestAnimationFrame passe automatiquement le timestamp à la fonction

}

gameLoop();
