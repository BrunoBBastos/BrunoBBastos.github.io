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
		selectTile(mouseX, mouseY);
	}

function popUpSelf(actv){
	popUps.push(new popUp(actv));
}

function clearPopUp(){
	popUps.splice(0, 1);
}

class popUp{
	constructor(actv){
		this.actv = actv;
		this.loc = createVector(this.actv.loc.x, this.actv.loc.y);
	}

	show(){
		push();

		fill(255, 180);
		rect(this.loc.x, this.loc.y, 300, 100);
		textAlign(CENTER, CENTER);
		text("Attack!", this.loc.x, this.loc.y);
		pop();
	}

	resolve(x, y){
		if(x > this.loc.x - 150 && x < this.loc.x + 150){
			if(y > this.loc.y - 50 && y < this.loc.y + 50){
				alert();
				clearPopUp();
			}
		}
		else{
			clearPopUp();
		}
	}

}