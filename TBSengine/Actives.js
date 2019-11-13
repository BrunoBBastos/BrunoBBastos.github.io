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
      stroke(this.col);
      strokeWeight(3);
      //for(let i = 0; i < this.availableMoves.length; i++){
        for(let r = 0; r < rows; r++){
          for(let c = 0; c < cols; c++){
            if(this.availableMoves[r][c] >= 0){
              square(grid[r][c].loc.x, grid[r][c].loc.y, sqSides);
            }
          }
        }
        /*if(this.availableMoves[i] >= 0){   
          square(grid[i].loc.x, grid[i].loc.y, sqSides);
        }
      }*/
      pop();
    }
    else endTurn();
  }

  attack(other){
    print(this.category + " attacking " + other.category);
  }

  interact(other){
    if(other ==  this){
      popUpSelf(this);
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