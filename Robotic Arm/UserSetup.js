let braco;
let base;
let dT = 30;
let debug = false;

function setup() {
  frameRate(dT);
  createCanvas(640, 480);
  base = createVector(width / 2, height / 2);
  // braco = new Arm(3);
  braco = new Arm2(base, 3, 3 * PI / 2, 80);
  
}

function draw() {
  background(50);
  braco.display();
}


function mousePressed(){
  // let mousePos = createVector(mouseX, mouseY);
  let mousePos = createVector(base.x + 80, base.y );
  braco.fabrik(mousePos);
}