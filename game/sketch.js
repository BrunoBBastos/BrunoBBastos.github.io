let player;
let enemies = [];
let archers = [];
let arrows=[];
let enemyArrows = [];
let spawnPoints = [];
let score = 0;
duration = 0;


function setup() {
	createCanvas(800, 600);
	player = new Player(width/2, height*2/3);
	spawnPoints.push(new SpawnPoint(50, 50, 2, 5));
	spawnPoints.push(new SpawnPoint(width - 50, height - 50, 2, 5));
}

function draw() {
	updateScreen();
	keyboard();
	detectCollisions();
	updateElements();
}

function updateElements(){
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

	for(let e of enemies){
		e.behavior();
	}

	player.show(); // Player acima das flechas
}

function mousePressed(){
	arrows.push(new Arrow(mouseX, mouseY, player));
}

function mouseReleased(){
	let arrowOrigin = createVector(mouseX, mouseY);
	arrows[arrows.length -1].shoot(arrowOrigin);
}

function keyboard(){
	if(keyIsDown(87)) player.pos.y-=3;
	if(keyIsDown(65)) player.pos.x-=3;
	if(keyIsDown(83)) player.pos.y+=3;
	if(keyIsDown(68)) player.pos.x+=3;
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

function detectCollisions(){
	//Testa se a flecha acerta o alvo
	for(let a = 0; a < arrows.length; a++){
		let itHits = false;
		for(let e = 0; e < enemies.length; e++){
			if(circleRectCollision(arrows[a], enemies[e])){
				score+= enemies[e].score;
				arrows.splice(a, 1);
				enemies.splice(e, 1);
				itHits = true;
				break;
			}
			if(itHits){
				break;
			}
		}
	}

	for(let a = 0; a < enemyArrows.length; a++){
		if(circleCircleCollision(enemyArrows[a], player)){
			noLoop();
			console.log("Game Over");
			break;
		}
	}

	//testa se o inimigo alcança o player
	for(let e = 0; e < enemies.length; e++){
		if(circleRectCollision(player, enemies[e])){
			noLoop();
			console.log("Game Over");
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

