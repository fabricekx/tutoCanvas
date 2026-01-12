const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext("2d");

const particleArray = [];

//3
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // ctx.fillStyle = "gray";
  // ctx.fillRect(10,10,50,50); //top, left, width, height
});

console.log(ctx);

//2
// ctx.fillStyle = "gray";
// ctx.fillRect(10,10,50,50); //top, left, width, height

//4

ctx.fillStyle = "red";
ctx.strokeStyle = "green"; // contour
ctx.lineWidth = 5; // largeur du contour
ctx.beginPath(); // permet de dire qu'on va faire un autre dessin
//ctx.arc(100, 100, 50, 0, Math.PI * 2); // (left, top, rayon, angle début, angle fin)

// attention, ne trace que l'arc, sens horraire
ctx.fill(); // trace le replissage
ctx.stroke();
// remarque: le floux et la mauvaise position sont dus à l'étirement du canvas dans la
// fenetre. Il faut donc adapter la largeur du canvas comme précédement avec
// canvas.width = window.innerWidth; canvas.height = window.innerHeight;

//5
let mouse = {
  x: 0,
  y: 0,
};

canvas.addEventListener("click", (event) => {
  console.log(event);
  mouse.x = event.x;
  mouse.y = event.y;
  createParticules();
  // ctx.fillStyle = "red";
  // ctx.beginPath(); // permet de dire qu'on va faire un autre dessin

  // ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2); // (left, top, rayon, angle début, angle fin)
  // ctx.fill();
//   drawCircle();
});

// function drawCircle() {
//   ctx.fillStyle = "green";
//   ctx.beginPath(); // permet de dire qu'on va faire un autre dessin

//   ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2); // (left, top, rayon, angle début, angle fin)
//   ctx.fill();
// }

//6
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
    // drawCircle();
// drawImage();
createParticules();
  
});

//6' Bonus: tracer une image
let patern = null;
const img = new Image();
img.src = "texture.jpg";

img.onload = () => {
  patern = ctx.createPattern(img, "no-repeat");

  
};

function drawImage() {
    if (!patern) return;
    ctx.fillStyle = patern;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
  ctx.fill();
};

//7

function animate() {
// on va d'abord effacer les anciens dessins avec la fonction clearRect
ctx.clearRect(0,0,canvas.width, canvas.height) // on efface tout le canvas
// drawCircle();
handleParticuls();
requestAnimationFrame(animate);
}

animate();

//8
class Particle {
constructor() {
    this.x = mouse.x ;// provient du listener
    this.y = mouse.y;
    this.size = Math.random()*5 +1; // (taille entre 1 et 5)
    this.speedX = Math.random() * 3 - 1.5; // entre -1.5 et + 1.5
    this.speedY = Math.random() * 3 - 1.5;
}
update() {
    this.x += this.speedX;
    this.y += this.speedY;
};
draw(){
ctx.fillStyle = "green";
  ctx.beginPath(); // permet de dire qu'on va faire un autre dessin

  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // (left, top, rayon, angle début, angle fin)
  ctx.fill();
}
}

function createParticules() {
    for (let i=0; i<20 ;i++ ){
// particleArray[i]= new Particle;
particleArray.push(new Particle);
    };
};

//createParticules(); // à déplacer dans le mouseMove
console.log(particleArray);

function handleParticuls() {
    for (let i=0; i<particleArray.length; i++){
        particleArray[i].update();
        particleArray[i].draw();
    }
}