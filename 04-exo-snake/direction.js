
// registre des touches
const keys = {};

// helper pour enregistrer une touche
function key(keyName, action) {
    keys[keyName] = action;
}

// écoute clavier
window.addEventListener("keydown", (e) => {
  console.log(e.key);
    if (keys[e.key]) {
       
   

        e.preventDefault();
        keys[e.key]();
    }
});

// Définition des fonctions
function upArrow() {
  if (snake.direction.y !== 1) { // pour empêcher le demi tour
    snake.nextDirection = { x: 0, y: -1 };
  }
}

function downArrow() {
  if (snake.direction.y !== -1) {
    snake.nextDirection = { x: 0, y: 1 };
  }
}

function rightArrow() {
  if (snake.direction.x !== -1) {
    snake.nextDirection = { x: 1, y: 0 };
  }
}

function leftArrow() {
  if (snake.direction.x !== 1) {
    snake.nextDirection = { x: -1, y: 0 };
  }
}

function replay() {
  if (!gameState.running) {
    // 1️⃣ reset du snake
    snake.body = [{ x: 10, y: 10 }];
    snake.direction = { x: 1, y: 0 };
    snake.nextDirection = { x: 1, y: 0 };

    // 2️⃣ reset du score
    score = 0;
    scoreSpan.textContent = score;

    // 3️⃣ vider les food existantes si tu veux
    foods.length = 0;

    // 4️⃣ remettre le jeu en running
    gameState.running = true;
    gameState.pause = false;

    // re rentre dans la boucle de jeu:
    gameLoop();
  }
}



// Mapping des touches avec la fonction key:
key("ArrowUp", upArrow); // on ne met pas les (), car on veut passer la fonction, pas l'exécuter
key("ArrowDown", downArrow);
key("ArrowRight", rightArrow);
key("ArrowLeft", leftArrow);

// pause
key("Escape", () => gameState.pause = !gameState.pause);
key(" ", () => gameState.pause = !gameState.pause);

// Bonus pour les touches zsdq:
key("z", upArrow);
key("s", downArrow);
key("d", rightArrow);
key("q", leftArrow);

//Rejouer
key("Enter", replay)
