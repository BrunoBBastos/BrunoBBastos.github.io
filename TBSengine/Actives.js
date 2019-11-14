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
  push();
  strokeWeight(5)
  stroke(255, 0, 0);
  line(origin.x - sqSides/2, origin.y - sqSides/2, target.x - sqSides/2, target.y - sqSides/2);
  pop();
  let blockers = [];
  blockers = scanBlockers(origin, target);
  let clearLOS = false;
  for(let i = 0; i < blockers.length; i++){
    clearLOS |= separatedAxisT(origin, target, blockers[i]);
    print(clearLOS);
  }
  if(clearLOS || blockers.length == 0) print("able to attack");
  else print("final line of sight blocked!");
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
// List all the points from the block
let blockerPts = [];
blockerPts.push(createVector(blocker.loc.x - sqSides/2, blocker.loc.y - sqSides/2));
blockerPts.push(createVector(blocker.loc.x + sqSides/2, blocker.loc.y - sqSides/2));
blockerPts.push(createVector(blocker.loc.x + sqSides/2, blocker.loc.y + sqSides/2));
blockerPts.push(createVector(blocker.loc.x - sqSides/2, blocker.loc.y + sqSides/2));
// Measure the projection of the block on the normal
for(let i = 0; i < blockerPts.length; i++){
  let t = normalAxis.dot(blockerPts[i]);
  tMax = max(tMax, t);
  tMin = min(tMin, t);
}

return !(lineProj >= tMin && lineProj <= tMax);
}