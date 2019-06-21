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
let playButton, levelSelButton;

let playerImg = [], grassImg;
let archerImg = [], bossImg = [], soldierImg = [];
let ptStr;
let font;

function preload() {
	font = loadFont('./data/manaspc.ttf'); //
	playerImg[1] = loadImage("./data/player1.png");
	playerImg[2] = loadImage("./data/player2.png");
	grassImg = loadImage("./data/grassImg.png");
	archerImg[1] = loadImage("./data/archer1.png");
	archerImg[2] = loadImage("./data/archer2.png");
	bossImg[1] = loadImage("./data/boss1.png");
	bossImg[2] = loadImage("./data/boss2.png");
	soldierImg[1] = loadImage("./data/soldier1.png");
	soldierImg[2] = loadImage("./data/soldier2.png");
}

function setup() {
	createCanvas(800, 600);
	createButtons();
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

		case 6:
			levelSelect();
			break;
	}
}

function presentation() {															// REFATORAR

	if (millis() < 4000) {
		background(0);
		push();
		fill(255, 211, 0);
		textSize(80);
		textFont(font);
		textStyle(BOLD);
		textAlign(CENTER, CENTER);
		// strokeWeight(7);
		stroke(255, 211, 0);
		text("DRAW\nARROW", width/2, height / 2);

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
	textFont(font);
	// text("Score: " + totalScore, width / 2, height / 4);
	playButton.show();
	levelSelButton.show();
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
	fill(0);
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

class Button {
	constructor(x, y, m, c, s) {
		this.pos = createVector(x, y);
		this.screen = m;
		this.content = c;
		this.fSize = s;
		this.h = this.fSize + 20;
		this.bbox = font.textBounds(this.content, this.pos.x, this.pos.y, this.fSize);
	}

	show() {
		push();
		rectMode(CENTER);
		textAlign(CENTER, CENTER);
		if (this.detectsMouse()) {
			strokeWeight(7);
			stroke(255, 211, 0);
		}
		textFont(font);
		textSize(this.fSize);
		text(this.content, this.pos.x, this.pos.y);
		noFill();
		// rect(this.pos.x, this.pos.y, width, this.fSize + 20);
		pop();
	}

	detectsMouse() {
		// Recebe um objeto círculo e outro retangular
		// Pontos de teste
		let testX = mouseX,
			testY = mouseY;
		// Testa se o círculo está à direita ou à esquerda do retângulo
		// if (mouseX < this.pos.x - this.bbox.w / 2) testX = this.bbox.x - this.bbox.w / 2;
		// else if (mouseX > this.bbox.x + this.bbox.w / 2) testX = this.bbox.x + this.bbox.w / 2;
		// Testa se o círculo está acima ou abaixo do retângulo
		if (mouseY < this.pos.y - this.h / 2) testY = this.pos.y - this.h / 2;
		else if (mouseY > this.pos.y + this.h / 2) testY = this.pos.y + this.h / 2;
		// Calcula catetos para encontrar a hipotenusa (distância)
		let distX = mouseX - testX;
		let distY = mouseY - testY;
		let distance = sqrt((distX * distX) + (distY * distY));
		// Retorna V ou F se intersectar
		return (distance <= 0);
	}

}

function createButtons() {
	playButton = new Button(width / 2, height / 2, 1, "Clique para Jogar!", 48);
	levelSelButton = new Button(width / 2, height / 4, 1, "Selecionar Level", 48);
	lvl1Button = new Button(width / 2, height * 2 / 7, 6, "Level 1", 48);
	lvl2Button = new Button(width / 2, height * 3 / 7, 6, "Level 2", 48);
	lvl3Button = new Button(width / 2, height * 4 / 7, 6, "Level 3", 48);
	lvl4Button = new Button(width / 2, height * 5 / 7, 6, "Level 4", 48);
	lvl5Button = new Button(width / 2, height * 6 / 7, 6, "Level 5", 48);
}

function levelSelect() {
	background(0);
	push();
	textSize(48);
	fill(130);
	textStyle(BOLD);
	textAlign(CENTER, CENTER);
	textFont(font);
	text("Score: " + totalScore, width / 2, height / 7);
	lvl1Button.show();
	lvl2Button.show();
	lvl3Button.show();
	lvl4Button.show();
	lvl5Button.show();
	textSize(28);
	pop();
}