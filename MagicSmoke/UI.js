// GRAPHIC BITS
function intro(){
	if (millis() < 2000) {
		background(0);
		push();
		fill(150, 150, 150);
		textSize(80);
		textStyle(BOLD);
		textAlign(CENTER, CENTER);
		text("MAGIC\nSMOKE", width/2, height / 2);
		pop();
	}
	else {
		mode++;
	}
}

function menu() {
	background(0);
	push();
	textSize(48);
	fill(130);
	textStyle(BOLD);
	textAlign(CENTER, CENTER);
	textSize(28);
	text("Click for a new game", width / 2, height * 3 / 4);
	pop();
	mode++;
}

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

function mouseHover(){
	mousePos = createVector(mouseX, mouseY);
	let where = "";
	if(mousePos.x <= cols * sqSides && mousePos.y <= rows *sqSides) where = "Arena Tiles";
	else if(mousePos.x > cols * sqSides  && mousePos.y > player.cardUI.pos.y) where = "Cards";
	
	push();
	textSize(15);
	textAlign(CENTER, CENTER);
	text("--- Info ---", cols * sqSides + 100, rows * sqSides);
	textSize(12);
	text(where, cols * sqSides + 100, rows * sqSides + 50)
	pop(0);
}

class UICardBox{
	constructor(x, y, title, buttons){
		this.pos = createVector(x, y);
		this.boxTitle = title;
		this.buttons = [];
		this.spacing = 30;
	}

	show(){
		this.detectMouse();
		push();
		textSize(20);
		textAlign(CENTER, CENTER);
		text(this.boxTitle, this.pos.x, this.pos.y);

		textSize(15);
		for(let i = 0; i < this.buttons.length; i++){
			push();
			if(i == this.highlight) stroke(160, 255, 170);
			text(this.buttons[i].cardName, this.pos.x, this.pos.y + (i + 1) * this.spacing);
			pop();
		}
		pop();
	}

	update(b){
		this.buttons = b;
	}

	detectMouse(pos){
		this.highlight = -1;
		for(let i = 0; i < this.buttons.length; i++){
			let top = this.pos.y + (i+1) * this.spacing - 10;
			let bot = top + 20;
			let left = this.pos.x - 50;
			let right = left + 100;
			if(mouseY >= top && mouseY <= bot && mouseX >= left && mouseX <= right){
				this.highlight = i;
				break;
			}
		}
	}
}