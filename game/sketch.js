let player;
let enemies = [];
let archers = [];
let arrows=[];
let enemyArrows = [];
let spawnPoints = [];
let coins = [];
let barriers =[];
let fakeEnemy = [];
let fakeArrows = [];
let gravity;
let money = 0;
let highScore = 0;
let level = 0;
let levelDuration;
let runtime = 0;
let mode = 0;
let enemiesK = 0, coinsPicked = 0, arrowsFired = 0;
let wave = 0;
let lastWave = false;
let levelResult;

let playerImg;
let ptStr;
let font;

function preload(){
	font = loadFont('manaspc.ttf'); //
	playerImg = loadImage("playerImg.png");

}

function setup() {
	createCanvas(800, 600);
	fakeArrows[1000] = 1;													// REFATORAR A APRESENTAÇÃO
	gravity = createVector(0, 0, -0.007);
}

function draw() {
	operationMode();
}	
																			// APENAS FUNÇÕES DE GERENCIAMENTO
function operationMode(){

	switch(mode){

		case 0:
		presentation();
		break;

		case 1:
		menu();
		break;

		case 2:
		setupGame();
		break;

		case 3:
		gameOn();
		break;

		case 4:
		pauseGame();
		break;

		case 5:
		clearTimeout(levelDuration);
		for(let s = 0; s < spawnPoints.length; s++){
			clearTimeout(spawnPoints[s].interval);
		}
		spawnPoints.splice(0, spawnPoints.length);
		clearTimeout(coinInterval);
		logStats();
		noLoop();
		break;
	}
}

function presentation(){															// REFATORAR

	if(millis() < 1000){
		background(0);
		if(fakeArrows.length == 1001){
			fakeArrows.splice(0, fakeArrows.length);
			push();
			textSize(80);
			textFont(font);
			textStyle(BOLD);
			textAlign(CENTER, CENTER);
			ptStr = font.textToPoints("Archer", 200, height/2);
			stroke(255);
			strokeWeight(5);
			fakeEnemy.push(new Enemy(10, 10 ,0));
			for(let i = 0; i < ptStr.length; i++){
				let arrowPoint = ptStr[i];
				point(arrowPoint.x, arrowPoint.y);
				fakeArrows.push(new Arrow(arrowPoint.x, arrowPoint.y, fakeEnemy[0]));
				fakeArrows[i].shoot(fakeEnemy.pos);
			}
			pop();
		}
		else{
			for(let j = 0; j<fakeArrows.length; j++){
				fakeArrows[j].update();
			}
		}
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
	textFont(font);
	text("High Score: " + highScore, width/2, height/4);
	text("Clique para Jogar!", width/2, height/2);
	textSize(28);
	text("Controles: \nMover: w, a, s, d\nAtirar: clique arraste e solte\nComprar Flecha Magica: barra de espacos", width/2, height*3/4);
	pop();
}

function setupGame(){
	player = new Player(width/2, height/2);
	manageLevel();
	coinInterval = setInterval(gibMoney, 5000);
	mode++;
}

function startGame(){
}

function manageLevel(){
	if(!lastWave)
	{
		wave++;
		loadLevel();
		levelDuration = setTimeout(manageLevel, runTime*1000);
	}
}

function loadLevel(){
	let randomP;
	switch(wave){
		case 0:
		break;

		case 1:
		console.log("1st Wave");
		let barrierO = createVector(width/4, height/2);
		let barrierE = createVector(width/2, height/4);
		barriers.push(new Barrier(barrierO, barrierE));
		barrierO = createVector(width*3/4, height/2);
		barrierE = createVector(width/2, height*3/4);
		barriers.push(new Barrier(barrierO, barrierE));

		randomP = random(width);
		spawnPoints.push(new SpawnPoint(randomP, 	  0, 3, 3, 1, 0, 0));
		randomP = random(width);
		spawnPoints.push(new SpawnPoint(randomP, height, 3, 3, 1, 0, 0));

		runTime = 12;															// REFACTOR RUNTIME
		break;

		case 2:
		console.log("2nd Wave");
		spawnPoints[0].period+=2000;
		spawnPoints[1].period+=2000;
		spawnPoints[0].resetInterval(); 
		spawnPoints[1].resetInterval(); 
		randomP = random(height);
		spawnPoints.push(new SpawnPoint(0, 	   randomP, 5, 3, 1, 0, 0));
		randomP = random(height);
		spawnPoints.push(new SpawnPoint(width, randomP, 5, 3, 1, 0, 0));

		runTime = 15;
		break;

		case 3:
		console.log("3rd Wave");
		spawnPoints[0].addMinions(1, 0, 0);
		spawnPoints[1].addMinions(1, 0, 0);
		spawnPoints[2].resetInterval();
		spawnPoints[3].resetInterval();

		returnTime = 20;
		break;

		case 4:
		console.log("4th Wave");
		spawnPoints[2].addMinions(0, 1, 0);
		spawnPoints[3].addMinions(0, 1, 0);
		break;

		case 5:
		console.log("5th Wave");
		spawnPoints[0].manyWaves = 1;
		spawnPoints[1].manyWaves = 1;
		spawnPoints[2].manyWaves = 1;
		spawnPoints[3].manyWaves = 1;
		spawnPoints[0].addMinions(0, 0, 1);
		spawnPoints[1].resetInterval;
		spawnPoints[2].resetInterval;
		spawnPoints[3].resetInterval;
		runtime = 5;
		lastWave = true;
		break;
	}
}

function gameOn(){
	updateScreen();
	detectCollisions();
	updateElements();
	if(lastWave){
		if(enemies.length == 0){
			console.log("VICTORY!");
			levelResult = true;
			mode = 5;		}
	}
}

function logStats(){
	let accuracy = 0;
	if(enemiesK !=0)accuracy = (100*enemiesK/arrowsFired).toFixed(2);
	push();
	textSize(18);
	fill(220,20,60);
	textStyle(BOLD);
	textFont('Helvetica');
	textAlign(RIGHT, CENTER);
	text("Score: " + player.score 
		+ "\nEnemies killed: " + enemiesK
		+ "\nCoins picked: " + coinsPicked
		+ "\nArrows fired: " + arrowsFired
		+ "\n % Accuracy: " + accuracy,
		width*7/8, height/8);
	textSize(18);
	fill(0);
	textAlign(CENTER);
	if(levelResult)	text("- Victory! -\nPress 'Esc' to continue", width/2, height/2);
	else text("- Game Over! -\nPress 'Esc' to continue", width/2, height/2);
	pop();
	enemiesK = 0;
	coinsPicked = 0;
	arrowsFired = 0;
}

function endGame(){
	if(highScore < player.score){
		highScore = player.score;
	}
	player.score = 0;
	mode = 1;
	barriers.splice(0, barriers.length);
	enemies.splice(0, enemies.length);
	archers.splice(0, archers.length);
	arrows.splice(0, arrows.length);
	enemyArrows.splice(0, enemyArrows.length);
	coins.splice(0, coins.length);
	lastWave = false;
	wave = 0;
}