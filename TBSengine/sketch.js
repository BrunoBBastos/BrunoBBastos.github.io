// Variáveis Globais
let player, enemy;
let grid = [];
let mode = 0;
let actives = []; // array to hold active pieces on the table
let currentTurn;
let currentActive;

let rows, cols, sqSides = 30;

function setup() {
  createCanvas(601, 601);
  
  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  manageMode();
  
}

function manageMode(){
  switch(mode){
    case 0:
    mode++;
    break;

    case 1:
    setupLevel();
    break;

    case 2:
    setupPlayers();
    break;

    case 3:
    runMatch();
    break;
  }
}

function setupLevel(){

  rows = floor(width / sqSides);
  cols = floor(height / sqSides);
  for(let c = 0; c < cols; c++){
    for(let r = 0; r < rows; r++){
      let tile = new Tile(r, c);
      if(!floor(random(0, 21))) tile.isOccupied = true;
      grid.push(tile);
    }
  }

  let layout = [];
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
     layout[j + i * cols] = (i == 0 || j == 0 || i == rows -1 || j == cols -1);
   }
 }
 loadLayout(layout);

 currentTurn = 1;
 currentActive = 0;
 mode++;
}

function setupPlayers(){
  player = new Player(7, 7);
  enemy = new Enemy(10, 10);
  actives.push(player);
  actives.push(enemy);
  mode++;
  player.setupTurn();
}

function runMatch(){
  background(230);

  for(t of grid){
    t.show();
  }

  for(a of actives){
    a.show();
  }

  actives[currentActive].turn();

}

function endTurn(){
  currentActive++;
  if(currentActive > actives.length-1) {
    currentActive = 0;
    currentTurn++;
  }
  actives[currentActive].setupTurn();

}