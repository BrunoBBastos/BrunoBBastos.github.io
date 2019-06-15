let player;
let enemies = [];
let archers = [];
let arrows = [];
let enemyArrows = [];
let spawnPoints = [];
let coins = [];
let barriers = [];
let fakeEnemy = [];
let fakeArrows = [];
let gravity;
let currentScore = 0;
let score = [0, 0, 0, 0, 0];
let totalScore = 0;
let level = 0;
let levelDuration;
let runTime = 0;
let mode = 0;
let enemiesK = 0, coinsPicked = 0, arrowsFired = 0;
let wave = 0;
let lastWave = false;
let levelResult;

let playerImg;
let ptStr;
let font;

function preload() {
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

function operationMode() {

	switch (mode) {

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
			for (let s = 0; s < spawnPoints.length; s++) {
				clearTimeout(spawnPoints[s].interval);
			}
			spawnPoints.splice(0, spawnPoints.length);
			clearTimeout(coinInterval);
			logStats();
			noLoop();
			break;
	}
}

function presentation() {															// REFATORAR

	if (millis() < 1000) {
		background(0);
		if (fakeArrows.length == 1001) {
			fakeArrows.splice(0, fakeArrows.length);
			push();
			textSize(80);
			textFont(font);
			textStyle(BOLD);
			textAlign(CENTER, CENTER);
			ptStr = font.textToPoints("Archer", 200, height / 2);
			stroke(255);
			strokeWeight(5);
			fakeEnemy.push(new Enemy(10, 10, 0));
			for (let i = 0; i < ptStr.length; i++) {
				let arrowPoint = ptStr[i];
				point(arrowPoint.x, arrowPoint.y);
				fakeArrows.push(new Arrow(arrowPoint.x, arrowPoint.y, fakeEnemy[0]));
				fakeArrows[i].shoot(fakeEnemy.pos);
			}
			pop();
		}
		else {
			for (let j = 0; j < fakeArrows.length; j++) {
				fakeArrows[j].update();
			}
		}
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
	textFont(font);
	text("Score: " + totalScore, width / 2, height / 4);
	text("Clique para Jogar!", width / 2, height / 2);
	textSize(28);
	text("Controles: \nMover: w, a, s, d\nAtirar: clique arraste e solte\nComprar Flecha Magica: barra de espacos", width / 2, height * 3 / 4);
	pop();
}

function setupGame() {
	player = new Player(width / 2, height / 2);
	manageLevel();
	coinInterval = setInterval(gibMoney, 5000);
	mode++;
}

function gameOn() {
	updateScreen();
	detectCollisions();
	updateElements();
	if (lastWave) {
		if (enemies.length == 0) {
			console.log("VICTORY!");
			levelResult = true;
			if (level == 5) {

			}
			mode = 5;
		}
	}
}

function logStats() {

	let accuracy = 0;
	if (enemiesK != 0) accuracy = (100 * enemiesK / arrowsFired).toFixed(2);
	if (score[level] < currentScore * accuracy / 100 && levelResult) score[level] = int(currentScore * accuracy / 100);
	let star;
	if (accuracy < 46) star = '*';
	else if (accuracy > 46 && accuracy < 85) star = '**';
	else star = '***';

	push();
	textSize(18);
	fill(220, 20, 60);
	textStyle(BOLD);
	textFont('Helvetica');
	textAlign(RIGHT, CENTER);
	text("\nInimigos derrotados: " + enemiesK
		+ "\nMoedas coletadas: " + coinsPicked
		+ "\nPontuação: " + currentScore
		+ "\nFlechas disparadas: " + arrowsFired
		+ "\n% Precisão: " + accuracy
		+ "\nPontuação da Partida: " + score[level],
		width * 7 / 8, height / 8);
	textSize(18);
	fill(0);
	textAlign(CENTER);
	if (levelResult) {
		fill(255, 168, 18);
		text("Nível " + (level + 1) + "\n" + star + "\n- Vitória! -\nPressione 'Esc' para continuar", width / 2, height / 2);
	}
	else text("Nível " + (level + 1) + "- Game Over! -\nPressione 'Esc' para continuar", width / 2, height / 2);
	pop();
	enemiesK = 0;
	coinsPicked = 0;
	arrowsFired = 0;
}

function endGame() {
	// if (currentScore > score[level]) score[level] = currentScore;
	totalScore = 0;
	for (let i = 0; i < score.length; i++) {
		totalScore += score[i];
	}
	if (levelResult) level++;
	currentScore = 0;
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