class Active{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.loc = createVector(this.pos.x * sqSides + sqSides/2, this.pos.y * sqSides + sqSides/2);
    this.hasMoves = false;
    this.lifes = 5;
    this.dmg = 2;
    this.col = color(180, 180, 180);
    this.baseMoves = 3;
    this.moves = this.baseMoves;
    this.availableMoves = [];
    this.category = "Generic";
  }

  show(){
    stroke(0);
    fill(this.col);
    circle(this.loc.x, this.loc.y, 20);    
  }

  move(j, i){
    let index = j + i * cols;
    if(grid[i][j].isOccupied || this.availableMoves[i][j] < 0) return;
    grid[this.pos.y][this.pos.x].isOccupied = false;
    this.pos.set(j, i);
    grid[i][j].isOccupied = true;
    this.moves = this.availableMoves[i][j];
    this.update();
    this.availableMoves = findAvailableTiles(this);
  }

  update(){
    this.loc.set(this.pos.x * sqSides + sqSides/2, this.pos.y * sqSides + sqSides/2);
  }

  setupTurn(){
    this.update();
    this.hasMoves = true;
    this.moves = this.baseMoves;
    this.availableMoves = [0];
    this.availableMoves = findAvailableTiles(this);
  }

  turn(){
    if(this.moves > 0){ 
      push();     
      textAlign(CENTER, CENTER);
      textSize(20);
      noFill();
      stroke(70, 150, 120);
      strokeWeight(3);
      for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
          if(this.availableMoves[r][c] >= 0){
            square(grid[r][c].loc.x, grid[r][c].loc.y, sqSides);
          }
        }
      }
      pop();
    }
  }

  attack(other){
    print(this.category + " attacking " + other.category);
    lineOfSight(this.loc, other.loc);
  }

  interact(other){
    if(other ==  this){

    }
    else{
      this.attack(other);
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
  if(clearLOS || blockers.length == 0) print("able to attack");
  else print("final line of sight blocked!");
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
if(!(lineProj >= tMin && lineProj <= tMax)) {
  print("clear");
  print(ptA);
  print( ptB );
  print(blocker.pos);
}
return !(lineProj >= tMin && lineProj <= tMax);
}