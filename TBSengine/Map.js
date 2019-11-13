class Tile{
  constructor(y, x){
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
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      grid[r][c].isOccupied = layout[r][c];
      grid[r][c].wall = layout[r][c];
    }
  }
}

let bigLayout;
let JpLayout;

function setupLayouts(){
  bigLayout = [];
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
     bigLayout[j + i * cols] = (i == 0 || j == 0 || i == rows -1 || j == cols -1);
   }
 }

 JpLayout = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
 [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
 [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
 [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
}