class Active{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.loc = createVector(this.pos.x * sqSides + sqSides/2, this.pos.y * sqSides + sqSides/2);
    
    this.lifes = 5;
    this.dmg = 2;
    this.atkRange = 9;
    this.col = color(180, 180, 180);
    this.baseMoves = 3;
    this.moves = this.baseMoves;
    this.baseAP = 1;
    this.actionPoints = this.baseAP;
    this.availableMoves = [];
    this.availableTargets = [];
    this.category = "Generic";
    this.robot = testRLoaders();
    this.deck = new Deck(this.robot);
    this.deck.shuffleActiveDeck();
    this.cardUI = new UICardBox(cols * sqSides + 100, rows * sqSides / 2, "----- CARDS -----", this.deck.hand);
  }

  show(){
    push();
    stroke(0);
    fill(this.col);
    circle(this.loc.x, this.loc.y, 20);
    pop();
    this.cardUI.show();
   // this.showDeck();  
  }

  showDeck(){
    push();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("----- CARDS -----", cols * sqSides + 100, rows * sqSides / 2);

    textAlign(CENTER, CENTER);
    textSize(15);
    text(this.deck.hand[0].cardName, cols * sqSides + 100, rows * sqSides / 2 + 30);
    text(this.deck.hand[1].cardName, cols * sqSides + 100, rows * sqSides / 2+ 60);
    text(this.deck.hand[2].cardName, cols * sqSides + 100, rows * sqSides / 2 + 90);
    text(this.deck.hand[3].cardName, cols * sqSides + 100, rows * sqSides / 2 + 120);
    text(this.deck.hand[4].cardName, cols * sqSides + 100, rows * sqSides / 2 + 150);
    pop();
  }

  move(j, i){
    let index = j + i * cols;
    if(grid[i][j].isOccupied || this.availableMoves[i][j] < 0) return;
    grid[this.pos.y][this.pos.x].isOccupied = false;
    this.pos.set(j, i);
    grid[i][j].isOccupied = true;
    this.moves = this.availableMoves[i][j];
    this.update();
  }

  update(){
    this.availableMoves = [0];
    this.availableTargets = [0];
    this.loc.set(this.pos.x * sqSides + sqSides/2, this.pos.y * sqSides + sqSides/2);
    this.availableMoves = findAvailableTiles(this);
    this.availableTargets = this.scanTargets();
    this.cardUI.update(this.deck.hand);
  }

  setupTurn(){
    this.moves = this.baseMoves;
    this.actionPoints = this.baseAP;
    this.update();
    this.deck.drawHand();
  }

  loadDeck(){

  }

  turn(){
    push();     
    textAlign(CENTER, CENTER);
    textSize(20);
    noFill();
    strokeWeight(3);
    stroke(123, 144, 160);
    circle(this.loc.x, this.loc.y, 20);

    if(this.moves > 0){
      stroke(70, 150, 120);
      for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
          if(this.availableMoves[r][c] >= 0){
            square(grid[r][c].loc.x, grid[r][c].loc.y, sqSides);
          }
        }
      }
    }
    if(this.actionPoints > 0){
      stroke(180, 70, 100);
      for(let i = 0; i < this.availableTargets.length; i++){
        square(this.availableTargets[i].loc.x, this.availableTargets[i].loc.y, sqSides);
      }
    }
    pop();
  }

  attack(other){
    if(this.actionPoints <= 0) return;

    print(this.category + " attacking " + other.category);
    // print(round(this.loc.dist(other.loc)/sqSides));
    this.actionPoints--;
    other.lifes -= this.dmg;
    print(other.category + " took " + this.dmg + " pts of damage!");
  }

  scanTargets(){
    let targets = [];
    for(let i = 0; i < actives.length; i++){
      if(actives[i].category != this.category){
        if(lineOfSight(this.loc, actives[i].loc)){
          targets.push(actives[i]);
        }
      }
    }
    return targets;
  }

  interact(other){
    if(other ==  this){

    }
    else{
      if(this.availableTargets.includes(other) && round(this.loc.dist(other.loc)/sqSides) <= this.atkRange){
        this.attack(other);
      }
    }
  }

}

class Player extends Active{
  constructor(x, y){
    super(x, y);
    this.col = color(0, 0, 180);
    this.category = "Hero";
  }

}

class Enemy extends Active{
  constructor(x, y){
    super(x, y);
    this.col = color(180, 0, 0);
    this.category = "Monster";
  }

}

function lineOfSight(origin, target){
  // Put tiles that may block the LOS in an array 
  let blockers = [];
  blockers = scanBlockers(origin, target);
  // Get the vertices of both tiles
  let originPoints = [], targetPoints = [];
  originPoints = getPoints(origin);
  targetPoints = getPoints(target);
  // Assume the LOS is blocked 
  let clearLOS;

  for(let j = 0; j < originPoints.length; j++){
    for(let k = 0; k < targetPoints.length; k++){
      clearLOS = true;
      for(let i = 0; i < blockers.length; i++){
        clearLOS &= separatedAxisT(originPoints[j], targetPoints[k], blockers[i]);
        if(!clearLOS) break;
      }
      if(clearLOS) break;
    }
    if(clearLOS) break;
  }
  return(clearLOS || blockers.length == 0);
  // else print("final line of sight blocked!");
}

function getPoints(tile){
  let ptArr = [];
  ptArr.push(createVector(tile.x - sqSides/2, tile.y - sqSides/2));
  ptArr.push(createVector(tile.x + sqSides/2, tile.y - sqSides/2));
  ptArr.push(createVector(tile.x + sqSides/2, tile.y + sqSides/2));
  ptArr.push(createVector(tile.x - sqSides/2, tile.y + sqSides/2));
  return ptArr;
}


function scanBlockers(origin, target){
  let top = int(min(origin.y, target.y)/sqSides);
  let bot = int(max(origin.y, target.y)/sqSides);
  let lft = int(min(origin.x, target.x)/sqSides);
  let rgt = int(max(origin.x, target.x)/sqSides);

  let blockers = [];
  for(let r = top; r <= bot; r++){
    for(let c = lft; c <= rgt; c++){
      if(grid[r][c].wall) blockers.push(grid[r][c]);
    }
  }
  return blockers;
}

function separatedAxisT(ptA, ptB, blocker){
//Copy js vectors
let A = createVector();
let B = createVector();
A = ptA.copy();
B = ptB.copy();
// Find the normal vector to B - A
let normalAxis = createVector();
normalAxis.set(B.y - A.y, -(B.x - A.x));

let tMax = -Infinity, tMin = Infinity;
// Find B-A projection on the normal axis
let lineProj = A.dot(normalAxis);
// Get all the vertices from the block
let blockerPts = [];
blockerPts = getPoints(blocker.loc);
// Measure the projection of the block on the normal
for(let i = 0; i < blockerPts.length; i++){
  let t = normalAxis.dot(blockerPts[i]);
  tMax = max(tMax, t);
  tMin = min(tMin, t);
}
// Return true if the line and the wall do not overlap
return !(lineProj >= tMin && lineProj <= tMax);
}