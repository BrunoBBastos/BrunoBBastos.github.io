class Passives{
	constructor(x, y){
		this.pos = createVector(x, y);
		this.dmt = 10;
	}	

	show(){
		fill(255, 168, 18);
		ellipse(this.pos.x, this.pos.y, sin(millis()/1000)*this.dmt, this.dmt);
	}
}

function manageLevel(){
	level++;
	loadWaves();
	levelDuration = setTimeout(manageLevel, runTime*1000);
}

function loadWaves(){

	switch(level){
		case 0:
		break;

		case 1:
		spawnPoints.push(new SpawnPoint(0, 0, 3, 3, 0, 1));
		runTime = 20;
		break;

		case 2:
		spawnPoints[0].addMinions(-1, 1, 0);
		spawnPoints[0].period+=2;
		spawnPoints[0].resetInterval();
		spawnPoints.push(new SpawnPoint(width, height, 5, 2, 0, 0));
		break;

		case 3:
		spawnPoints[1].addMinions(0, 1, 0);
		spawnPoints[1].resetInterval();
		break;

		case 4:
		spawnPoints[0].addMinions(1, 0, 0);
		spawnPoints[0].resetInterval();
		spawnPoints[1].addMinions(1, 0, 0);
		spawnPoints[1].resetInterval();
		break;

		case 5:
		spawnPoints[0].addMinions(0, 1, 0);
		spawnPoints[0].resetInterval();
		spawnPoints[1].addMinions(0, 1, 0);
		spawnPoints[1].resetInterval();
		break;
	}
}

function operationMode(){
	
	switch(mode){

		case 0:
		presentation();
		break;

		case 1:
		menu();
		break;

		case 2:
		initGame();
		break;

		case 3:
		gameOn();
		break;

		case 4:
		pauseGame();
		break;

		case 5:
		logStats();
		noLoop();
		break;
	}
}

function presentation(){
	if(millis() < 2000){
		background(0);
		push();
		textSize(60);
		fill(255);
		textStyle(BOLD);
		textAlign(CENTER, CENTER);
		textFont('Helvetica');
		text("Title", width/2, height/2);
		pop();
	}
	else{
		mode++;
	}
}

function menu(){
	background(0);
	push();
	textSize(48);
	fill(130);
	textStyle(BOLD);
	textAlign(CENTER, CENTER);
	textFont('Helvetica');
	text("High Score: " + highScore, width/2, height/4);
	text("Play", width/2, height/2);
	textSize(28);
	text("Controls: \n w, a, s, d \n click and drag to shoot", width/2, height*3/4);
	pop();
}

function initGame(){
	player = new Player(width/2, height/2);
	startGame();
	mode++;
	
}

function gameOn(){
	updateScreen();
	detectCollisions();
	updateElements();
}

function startGame(){
	manageLevel();
	coinInterval = setInterval(gibMoney, 5000);
}

function gibMoney(){
	coins.push(new Passives(random(width), random(height)));
}

function updateScreen(){
	background(180, 255, 220);
	push();
	textSize(22);
	fill(255, 168, 18);
	textStyle(BOLD);
	textAlign(CENTER, CENTER);
	textFont('Helvetica');
	text(score, width/2, height/16);
	pop();
}

function gameOver(){
	if(highScore < score){
		highScore = score;
	}
	score = 0;
	mode = 1;
	clearTimeout(levelDuration);
	enemies.splice(0, enemies.length);
	archers.splice(0, archers.length);
	arrows.splice(0, arrows.length);
	enemyArrows.splice(0, enemyArrows.length);
	for(let s = 0; s < spawnPoints.length; s++){
		clearTimeout(spawnPoints[s].interval);
	}
	spawnPoints.splice(0, spawnPoints.length);
	clearTimeout(coinInterval);
	coins.splice(0, coins.length);
	level = 0;
}

function logStats(){
	let accuracy = 0;
	if(enemiesK !=0)accuracy = (100*enemiesK/arrowsFired).toFixed(2);
	push();
	textSize(20);
	fill(220,20,60);
	// textStyle(BOLD);
	textFont('Helvetica');
	textAlign(RIGHT, CENTER);
	text("Score: " + score 
		+ "\nEnemies killed: " + enemiesK
		+ "\nCoins picked: " + coinsPicked
		+ "\nArrows fired: " + arrowsFired
		+ "\n % Accuracy: " + accuracy,
		width*7/8, height/8);
	pop();
}

function keyPressed(){
	switch(mode){
		case 0:
		break;
		// Menu
		case 1:
		break;
		// Init
		case 2:
		break;
		// GameOn
		case 3:
		// if(keyCode === ESCAPE){
		// 	mode++;
		// }
		break;
		// Pause
		case 4:
		// if(keyCode === ESCAPE){
		// 	mode--;
		// }
		break;
		// End Game
		case 5:
		if(keyCode === ESCAPE){
			mode=1;
			gameOver();
			loop();
		}
		break;
	}
}