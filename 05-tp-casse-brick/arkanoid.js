// Étape 1 — Setup minimal
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
//   canvas.width = 600;
//   canvas.height = 400;
  canvas.style.width = window.innerWidth *0.8+ "px"; // pour le css
  canvas.style.height = window.innerHeight *0.8 + "px";

  canvas.width = window.innerWidth *.8; // pour le canvas
  canvas.height = window.innerHeight *.8;
}

console.log(window.innerWidth);
window.addEventListener("resize",resizeCanvas ); // on appelle la fonction, on ne l'exécute pas
resizeCanvas();

// test du canvas
//   ctx.fillStyle = "gray";
//   ctx.fillRect(0,10,canvas.width,canvas.height); //top, left, width, height

/////////////////////////////////// Étape 2 — La balle/////////////////////////////////////
// Modélisation
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 6,
  vx: 3,
  vy: -3
};

// Dessin
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // x,y,taille, angle début, angle fin
  ctx.fillStyle = "white";
  ctx.fill();
}

// drawBall();

// Mouvement sera appelée dans la boucle de jeu
function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
}

//  //////////////////////Étape 3 — Rebonds sur les murs /////////////////////////////////////
function wallCollision() {
  if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
    ball.vx *= -1;
  }

  if (ball.y < ball.radius) {
    ball.vy *= -1;
  }
}
// (la perte de balle viendra plus tard)
// on peut déjà tester dans une fonction gameLoop avec ces 3 premières fonctions

//////////////////   Étape 4 — La raquette ///////////////////////////////
const paddle = {
  width: canvas.width/15, // a rendre responsive
  height: 12,
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  speed: 8
};

function drawPaddle() {
ctx.fillStyle = "grey";
ctx.strokeStyle = "dark";
ctx.lineWidth = 5;
//  ctx.shadowColor = "lime";
//   ctx.shadowBlur = 15;
ctx.beginPath();
ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
ctx.fill();
ctx.stroke();
};

///////// Étape 5 — Contrôle clavier / souris //////////////////
let right = false;
let left = false;
let pause = false;

window.addEventListener("keydown", (e) => { 
  if (e.code === "Space") {
    pause = !pause;
  }
});

window.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") right = true;
  if (e.key === "ArrowLeft") left = true;
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowRight") right = false;
  if (e.key === "ArrowLeft") left = false;
});

function updatePaddle() {
  if (right && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.speed;
  }
  if (left && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
}


////////////////////  Étape 6 — Collision balle / raquette /////////////////////////
function paddleCollision() {
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.vy *= -1;
    ball.y = paddle.y - ball.radius;
  }
}



// Bonus plus tard : angle selon l’endroit touché.
// Fonction améliorée:
function paddleCollisionAngle() {
    // Collision balle / paddle
if (
  ball.y + ball.radius > paddle.y &&
  ball.y + ball.radius < paddle.y + paddle.height &&
  ball.x > paddle.x &&
  ball.x < paddle.x + paddle.width
) {
  // Calcul du point de contact relatif à la raquette
  const hitPoint = (ball.x - paddle.x) / paddle.width; // 0 = gauche, 0.5 = milieu ,1 = droite

  // Angle maximal de rebond (par ex. 75°)
  const maxAngle = Math.PI * 5 / 12; // 75 degrés

  // Convertir hitPoint en angle
  const angle = (hitPoint - 0.5) * 2 * maxAngle;

  const speed = Math.sqrt(ball.vx**2 + ball.vy**2); // vitesse constante

  ball.vx = speed * Math.sin(angle);
  ball.vy = -Math.abs(speed * Math.cos(angle)); // toujours vers le haut
}

}

///////////////////////////  Étape 7 — Les briques  ////////////////////////////////////////
// Grille de briques
const brick = {
  rows: 5,
//   cols: 10,
cols: Math.floor(canvas.width/60),
  width: Math.floor(canvas.width/20), // rendre dynamique, j'ai donc  10/20 
  height: 20,
//   padding: 
  offsetTop: 40,
  offsetLeft: 30

};

brick.padding= (canvas.width + brick.offsetLeft - ((brick.cols * brick.width )))/ (2+brick.cols);

const bricks = [];

for (let c = 0; c < brick.cols; c++) {
  bricks[c] = []; // tableau de tableau
  for (let r = 0; r < brick.rows; r++) {
    bricks[c][r] = { x: 0, y: 0, alive: true }; // on crée un abjet avec ces 3 propriétés
  }
}

// Dessin
function drawBricks() {
  for (let c = 0; c < brick.cols; c++) {
    for (let r = 0; r < brick.rows; r++) {
      const b = bricks[c][r];
      if (!b.alive) continue;

      const x = c * (brick.width + brick.padding) + brick.offsetLeft;
      const y = r * (brick.height + brick.padding/3) + brick.offsetTop;

      b.x = x;
      b.y = y;

      ctx.fillStyle = "orange";
      ctx.fillRect(x, y, brick.width, brick.height);
    }
  }
}

 ////////////////   Étape 8 — Collision balle / briques /////////////////
function brickCollision() {
  for (let c = 0; c < brick.cols; c++) {
    for (let r = 0; r < brick.rows; r++) {
      const b = bricks[c][r];
      if (!b.alive) continue;

      if (
        ball.x > b.x &&
        ball.x < b.x + brick.width &&
        ball.y > b.y &&
        ball.y < b.y + brick.height
      ) {
        ball.vy *= -1;
        b.alive = false;
      }
    }
  }
}

//////////// 10 Fonction Pause ///////
// Ne pas oublier de faire le addEventListener sur la touche space
function pauseGame() {
     {
    // Dessiner le texte pause
    // ctx.fillStyle = "rgba(0,0,0,0.5)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", canvas.width/2, canvas.height/2);

    
  }
}

//// 11 Vies //////////////
11 //// Définir les vies

let lives = 3; // nombre de vies initial

// Affichage des vies
function drawLives() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Lives: " + lives, 10, 30);
}

// fonction balle perdue
function ballLoosed() {
if (ball.y - ball.radius > canvas.height) { // balle hors du bas
    lives--; // perte d'une vie

if (lives <= 0) {
        gameOver();
    }

    else {
        pause = true;
        setTimeout(()=>{   resetBallAndPaddle(); pause = false}, 600)
    ; // fonction pour remettre la balle et la raquette au départ
}
    
}
}

function resetBallAndPaddle() {
  // replacer la balle au centre
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.vx = 3; // vitesse initiale
  ball.vy = -3;

  // replacer la raquette au centre
  paddle.x = (canvas.width - paddle.width) / 2;
}

function gameOver() {
  pause = true; // ou gameState.running = false si tu veux gérer running
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.font = "20px sans-serif";
  ctx.fillText("Press Enter to restart", canvas.width / 2, canvas.height / 2 + 40);
}

///////////////////   Redémarrer le jeu avec Enter ///////////////////////////////
window.addEventListener("keydown", (e) => {
  if (e.code === "Enter" && lives <= 0) {
    lives = 3;
    score = 0;
    resetBallAndPaddle();
    pause = false;
    bricks.forEach(b => b.destroyed = false); // si tu marques les briques détruites
  }
});

/////////////////////////  Étape finale — Game loop ////////////////////////////
function gameLoop() {

    if (pause) { pauseGame();
        
    }

    else {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  updateBall();
  updatePaddle();

  wallCollision();
//   paddleCollision();
paddleCollisionAngle();
  brickCollision();

  drawPaddle();
  drawBricks();
drawLives();
ballLoosed(); 
}

  requestAnimationFrame(gameLoop);
}

gameLoop();