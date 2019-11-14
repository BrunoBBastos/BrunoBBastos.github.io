// Variáveis Globais
let player, enemy;
let popUps = [];
let grid = [];
let buttons = [];
let mode = 0;
let actives = []; // array to hold active pieces on the table
let currentTurn;
let currentActive;

let rows, cols, sqSides = 30;

function setup() {
  createCanvas(801, 801);
  
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

  rows = 16;
  cols = 14;

  for(let r = 0; r < rows; r++){
    grid[r] = [];
    for(let c = 0; c < cols; c++){
      let tile = new Tile(r, c);
      grid[r].push(tile);
    }
  }

  setupLayouts();
  loadLayout(JpLayout);

  buttons.push(new UIButton(50, 16 * sqSides + 50, "Move", emptyTemplate));
  buttons.push(new UIButton(150, 16 * sqSides + 50, "Attack", emptyTemplate));
  buttons.push(new UIButton(250, 16 * sqSides + 50, "End Turn", endTurn));
  buttons.push(new UIButton(350, 16 * sqSides + 50, "Paulo Ricardo", emptyTemplate));


  currentTurn = 1;
  currentActive = 0;
  mode++;
}

function setupPlayers(){
  player = new Player(3, 5);
  enemy = new Enemy(6, 8);
  actives.push(player);
  actives.push(enemy);
  mode++;
  player.setupTurn();
}

function runMatch(){
  background(230);

  for(r of grid){
    for(t of r){
      t.show();
    }
  }

  for(a of actives){
   a.show();
 }
 actives[currentActive].turn();

 for(b of buttons){
  b.show();
}

}

function endTurn(){
  currentActive++;
  if(currentActive > actives.length-1) {
    currentActive = 0;
    currentTurn++;
  }
  actives[currentActive].setupTurn();

}