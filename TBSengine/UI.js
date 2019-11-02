// PLAYER MOVEMENT

function findAvailableTiles(actv){
	print("actv moves: " + actv.moves);
	let posIndex = actv.pos.x + actv.pos.y * cols;
	let overlayGrid = [rows * cols];
	for(let i = 0; i < rows * cols; i++){
		overlayGrid[i] = -1;
		if(grid[i].isOccupied && posIndex != i) overlayGrid[i] = -255;
		else if(posIndex == i) overlayGrid[i] = actv.moves;
	}

	floodFill(overlayGrid, actv.moves);
	return overlayGrid;
}

function floodFill(tiles, moves){
	if(moves <= -1) return;

	for(let i = 0; i < tiles.length; i++){
		if(tiles[i] == moves){
			if(tiles[i - cols] == -1) tiles[i - cols] = moves - 1;
			if(tiles[i + 1] == -1) tiles[i + 1] = moves - 1;
			if(tiles[i + cols] == -1) tiles[i + cols] = moves - 1;
			if(tiles[i - 1] == -1) tiles[i - 1] = moves - 1;
		}
	}
	floodFill(tiles, moves - 1);
}



function selectTile(x, y){
	let i = int(y / sqSides);
	let j = int(x / sqSides);
	actives[currentActive].move(j, i);
}

function mouseClicked(){
	selectTile(mouseX, mouseY);
}
