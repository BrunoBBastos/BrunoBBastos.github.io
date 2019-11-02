class Tile{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.loc = createVector(this.pos.x * sqSides + sqSides/2, this.pos.y * sqSides + sqSides/2);
    this.len = sqSides;
    this.isOccupied = false;
    this.wall = false;
  }

  show(){
    stroke(180);
    if(this.wall) fill(100);
    else noFill();
    square(this.loc.x, this.loc.y, this.len);
  }

  validateIndex() {
    if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > cols - 1 || this.pos.y > rows - 1) return -1;
    // return (this.x + this.y * cols);
    else return true;
  }
}

function loadLayout(layout){
  for(let i = 0; i < rows * cols; i++){
    grid[i].isOccupied = layout[i];
    grid[i].wall = layout[i];
  }
}