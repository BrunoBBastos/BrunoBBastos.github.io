let player;
let enemies = [];
let archers = [];
let arrows=[];
let enemyArrows = [];
let spawnPoints = [];
let coins = [];
let score = 0;
let highScore = 0;
let level = 0;
let levelDuration;
let runtime = 0;
let mode = 0;
let enemiesK = 0, coinsPicked = 0, arrowsFired = 0;
let lastWave = false;


function setup() {
	createCanvas(800, 600);
}

function draw() {
	operationMode();
}

function updateElements(){
	// Deleta flechas se passarem dos limites da tela
	for(let a = 0; a < arrows.length; a++){
		if(arrows[a].wasShot){
			arrows[a].update();
			if(arrows[a].pos.x<arrows[a].dmt || arrows[a].pos.x>width+arrows[a].dmt ||arrows[a].pos.y<arrows[a].dmt || arrows[a].pos.y>height+arrows[a].dmt){
				arrows.splice(a, 1);
			}
		}
	}
	for(let i = 0; i < enemyArrows.length; i++){
		if(enemyArrows[i].wasShot){
			enemyArrows[i].update();
			if(enemyArrows[i].pos.x<enemyArrows[i].dmt || enemyArrows[i].pos.x>width+enemyArrows[i].dmt ||enemyArrows[i].pos.y<enemyArrows[i].dmt || enemyArrows[i].pos.y>height+enemyArrows[i].dmt){
				enemyArrows.splice(i, 1);
			}
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
		arrows[arrows.length -1].shoot(arrowOrigin);
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
					score += enemies[e].score;
					
					enemies.splice(e, 1);
				}
				arrows.splice(a, 1);
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
			mode = 5;
			break;
		}
	}
	//testa se o inimigo alcança o player
	for(let e = 0; e < enemies.length; e++){
		if(circleRectCollision(player, enemies[e])){
			// noLoop();
			console.log("Game Over");
			mode = 5;
			break;
		}
	}
	// Testa se o player recolhe as moedas
	for(let c = 0; c < coins.length; c++){
		if(circleCircleCollision(player, coins[c])){
			coins.splice(c, 1);
			score+=2;
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

