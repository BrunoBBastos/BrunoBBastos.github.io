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
}

function setup() {
	createCanvas(800, 600);
	loadImgs();
	fakeArrows[1000] = 1;
	gravity = createVector(0, 0, -0.007);
}

function draw() {
	operationMode();
	angleMode(DEGREES);
}

function updateElements(){

	for(let b of barriers){
		b.show();
	}
	for(let i = 0; i < arrows.length; i++){
		if(arrows[i].wasShot){
			arrows[i].update();
			if(!arrows[i].isFlying) arrows.splice(i, 1);
		}
	}
	for(let j = 0; j < enemyArrows.length; j++){
		if(enemyArrows[j].wasShot){
			enemyArrows[j].update();
			if(!enemyArrows[j].isFlying) enemyArrows.splice(j, 1);
		}
	}
	// Ordena inimigos a adotarem seu comportamento
	for(let e of enemies){
		e.behavior();
	}
	// Mostra moedas
	for(let c of coins){
		c.show();
	}
	// Atualiza o player
	player.update(); 
}

function mousePressed(){
	switch(mode){
		case 0:
		return;
		break;

		case 1:
		
		break;

		case 3:
		// Prepara flecha
		arrows.push(new Arrow(mouseX, mouseY, player));
		console.log(arrows);
		break;
	}
}

function mouseReleased(){
	switch(mode){
		case 0:
		return;
		break;

		case 1:
		mode++;
		break;

		case 3:
		// Atira flecha
		let arrowOrigin = createVector(mouseX, mouseY);
		/*if(arrows[arrows.length -1].heading.x == arrowOrigin.x && arrows[arrows.length -1].heading.y == arrowOrigin.y){
		 arrows.splice(arrows.length -1, 1);
		 return;
		}*/
		arrows[arrows.length -1].shoot(arrowOrigin);
		if(player.hasSpecialArrows) {
			arrows[arrows.length -1].isSpecial = true;
			arrows[arrows.length -1].dmt = 15;
			arrows[arrows.length -1].col.set(85, 0, 200);
			player.hasSpecialArrows--;
		}
		arrowsFired++;
		break;
	}
}

function detectCollisions(){
	//Testa se a flecha acerta o alvo
	for(let a = 0; a < arrows.length; a++){
		let itHits = false;
		for(let e = 0; e < enemies.length; e++){
			if(circleRectCollision(arrows[a], enemies[e])){
				enemies[e].life--;
				if(enemies[e].life <= 0){
					enemies[e].die();
					enemies.splice(e, 1);
				}
				if(!arrows[a].isSpecial) {
					arrows.splice(a, 1);
				}
				itHits = true;
				enemiesK++;
				break;
			}
			if(itHits){
				break;
			}
		}
	}
	// Testa se o player é atingido por setas inimigas
	for(let a = 0; a < enemyArrows.length; a++){
		if(circleCircleCollision(enemyArrows[a], player)){
			
			console.log("Game Over");
			levelResult = false;
			mode = 5;
			break;
		}
	}
	//testa se o inimigo alcança o player
	for(let e = 0; e < enemies.length; e++){
		if(circleRectCollision(player, enemies[e])){
			console.log("Game Over");
			levelResult = false;
			mode = 5;
			break;
		}
	}
	// Testa se o player recolhe as moedas
	for(let c = 0; c < coins.length; c++){
		if(circleCircleCollision(player, coins[c])){
			coins.splice(c, 1);
			player.scorePoints(3);
			coinsPicked++;
			continue;
		}
	}
}

function circleRectCollision(c, r){
	// Recebe um objeto círculo e outro retangular
    // Pontos de teste
    let testX = c.pos.x,
    testY = c.pos.y;
	// Testa se o círculo está à direita ou à esquerda do retângulo
	if (c.pos.x < r.pos.x - r.dmt / 2) testX = r.pos.x - r.dmt / 2;
	else if (c.pos.x > r.pos.x + r.dmt / 2) testX = r.pos.x + r.dmt / 2;
	// Testa se o círculo está acima ou abaixo do retângulo
	if (c.pos.y < r.pos.y - r.dmt / 2) testY = r.pos.y - r.dmt / 2;
	else if (c.pos.y > r.pos.y + r.dmt / 2) testY = r.pos.y + r.dmt / 2;
	// Calcula catetos para encontrar a hipotenusa (distância)
	let distX = c.pos.x - testX;
	let distY = c.pos.y - testY;
	let distance = sqrt((distX * distX) + (distY * distY));
	// Retorna V ou F se intersectar
	return (distance <= c.dmt / 2);
}

function circleCircleCollision(c, o){
	return(dist(c.pos.x, c.pos.y, o.pos.x, o.pos.y) < c.dmt /2 + o.dmt/2);
}

