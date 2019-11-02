class Active{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.loc = createVector(this.pos.x * sqSides + sqSides/2, this.pos.y * sqSides + sqSides/2);
    this.hasMoves = false;
    this.lifes = 5;
    this.col = color(180, 180, 180);
    this.baseMoves = 3;
    this.moves = this.baseMoves;
    this.availableMoves = [];
  }

  show(){
    stroke(0);
    fill(this.col);
    circle(this.loc.x, this.loc.y, 20);    
  }

  move(j, i){
    let index = j + i * cols;
    if(grid[index].isOccupied || this.availableMoves[index] < 0) return;
    grid[this.pos.x + this.pos.y * cols].isOccupied = false;
    this.pos.set(j, i);
    grid[index].isOccupied = true;
    this.moves = this.availableMoves[index];
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
    if(this.moves>0){ 
      push();     
      textAlign(CENTER, CENTER);
      textSize(20);
      noFill();
      stroke(this.col);
      strokeWeight(3);
      for(let i = 0; i < this.availableMoves.length; i++){
        if(this.availableMoves[i] >= 0){   
          square(grid[i].loc.x, grid[i].loc.y, sqSides);
        }
      }
      pop();
    }
    else endTurn();
  }
}

class Player extends Active{
  constructor(x, y){
    super(x, y);
    this.col = color(0, 0, 180);
  }

}

class Enemy extends Active{
  constructor(x, y){
    super(x, y);
    this.col = color(180, 0, 0);
  }

}