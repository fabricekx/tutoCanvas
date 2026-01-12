const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext("2d");

const particleArray = [];

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
  // createParticules();

});


canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  
createParticules();
  
});





function animate() {
// on va d'abord effacer les anciens dessins avec la fonction clearRect
ctx.clearRect(0,0,canvas.width, canvas.height) // on efface tout le canvas
handleParticuls();
requestAnimationFrame(animate);
}
animate();


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

//createParticules(); // à déplacer dans le click ou mouseMove
// console.log(particleArray);

function handleParticuls() {
    for (let i=0; i<particleArray.length; i++){
        particleArray[i].update();
        particleArray[i].draw();
    }
}