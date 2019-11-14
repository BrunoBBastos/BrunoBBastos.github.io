// PLAYER MOVEMENT

function findAvailableTiles(actv){
	
	let fakePos = createVector(actv.pos.y, actv.pos.x);
	let overlayGrid = [];

	for(let r = 0; r < rows; r++){
		overlayGrid[r] = [];
		for(let c = 0; c < cols; c++){
			overlayGrid[r][c] = -1;
			if(grid[r][c].isOccupied && !actv.pos.equals(grid[r][c].pos)) overlayGrid[r][c] = -255;
			else if(actv.pos.equals(grid[r][c].pos)) {
				overlayGrid[r][c] = actv.moves;
			}
		}
	}
	
	floodFill(overlayGrid, actv.moves);
	
	return overlayGrid;
}

function floodFill(tiles, moves){
	if(moves <= -1) return;

	for(let r = 0; r < rows; r++){
		for(let c = 0; c < cols; c++){
			if(tiles[r][c] == moves){
				if(r-1 >= 0 && tiles[r-1][c] == -1) tiles[r-1][c] = moves - 1;
				if(c+1 <= cols && tiles[r][c+1] == -1) tiles[r][c+1] = moves - 1;
				if(r+1 <= rows && tiles[r+1][c] == -1) tiles[r+1][c] = moves - 1;
				if(c-1 >= 0 && tiles[r][c-1] == -1) tiles[r][c-1] = moves - 1;
			}
		}
	}
	floodFill(tiles, moves - 1);
}


function selectTile(x, y){
	let i = int(y / sqSides);
	let j = int(x / sqSides);

	for(let a = 0; a < actives.length; a++){
		if(actives[a].pos.x == j && actives[a].pos.y == i){
			actives[currentActive].interact(actives[a]);
			return;
		}
	}

	actives[currentActive].move(j, i);
}

function mouseClicked(){
	if(mouseX <= cols * sqSides && mouseY < rows * sqSides) selectTile(mouseX, mouseY);
	else{
		for(b of buttons){
			if(b.checkClick(mouseX, mouseY)) break;
		}
	}
}

class UIButton{
	constructor(x, y, txt, foo){
		this.loc = createVector(x, y);
		this.txt = txt;
		this.w = 100;
		this.h = 50;
		this.foo = foo;
	}

	show(){
		push();
		fill(255);
		rect(this.loc.x, this.loc.y, this.w, this.h);
		fill(0);
		textSize(16);
		textAlign(CENTER, CENTER);
		text(this.txt, this.loc.x, this.loc.y);
		pop();
	}

	checkClick(x, y){
		if(x > this.loc.x - this.w / 2 && x < this.loc.x + this.w / 2){
			if(y > this.loc.y - this.h / 2 && y < this.loc.y + this.h / 2){
				this.foo();
			}
		}
	}
}

function emptyTemplate(){
	return;
}