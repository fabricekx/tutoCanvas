const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext("2d");

const nbOfParticuls = 5;
const particleArray = [];
let hue = 0;

//3
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// console.log(ctx);

let mouse = {
  x: 0,
  y: 0,
};

canvas.addEventListener("click", (event) => {
  // console.log(event);
  mouse.x = event.x;
  mouse.y = event.y;
  createParticules();
});

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;

  createParticules();
});

function animate() {
  // on va d'abord effacer les anciens dessins avec la fonction clearRect
  ctx.clearRect(0, 0, canvas.width, canvas.height); // on efface tout le canvas
  // ctx.fillStyle= 'rgba(0,0,0,0.1)';
  // ctx.fillRect(0,0,canvas.width,canvas.height);
  // console.log(particleArray.length);
  hue += 5;
  handleParticuls();
  requestAnimationFrame(animate);
}
animate();

class Particle {
  constructor() {
    this.x = mouse.x; // provient du listener
    this.y = mouse.y;
    this.size = Math.random() * 5 + 1; // (taille entre 1 et 5)
    this.speedX = Math.random() * 3 - 1.5; // entre -1.5 et + 1.5
    this.speedY = Math.random() * 3 - 1.5;
    this.color = "hsl(" + hue + ", 100%,50%)";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath(); // permet de dire qu'on va faire un autre dessin

    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // (left, top, rayon, angle début, angle fin)
    ctx.fill();
  }
}

function createParticules() {
  for (let i = 0; i < nbOfParticuls; i++) {
    // particleArray[i]= new Particle;
    particleArray.push(new Particle());
  }
}

//createParticules(); // à déplacer dans le click ou mouseMove
// console.log(particleArray);

function handleParticuls() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();

    // boucle pour calculer les distance
    for (let j = i + 1; j < particleArray.length; j++) {
      const dx = particleArray[i].x - particleArray[j].x;
      const dy = particleArray[i].y - particleArray[j].y;
      const distance = dx * dx + dy * dy;

      ctx.beginPath();
      if (distance < 100 * 100) {
        // si la distance est inférieure à 100, on va tracer une ligne

        ctx.strokeStyle = particleArray[i].color; // couleur de la ligne
        ctx.lineWidth = 1 - distance / 100;
        ctx.moveTo(particleArray[i].x, particleArray[i].y); // début ligne
        ctx.lineTo(particleArray[j].x, particleArray[j].y); // fin de ligne
      }
      ctx.stroke(); // tracage de la ligne
    }

    if (particleArray[i].size <= 0.3) {
      particleArray.splice(i, 1); // on retire un élement à l'indice i
      i--; // pour éviter de sauter la particule suivant
    }
  }
}
