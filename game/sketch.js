let player;
let enemies = [];
let arrows=[];
let spawnPoints = [];
duration = 0;


function setup() {
	createCanvas(800, 600);
	player = new Player(width/2, height*2/3);
	spawnPoints.push(new SpawnPoint(50, 50, 3, 3));
	spawnPoints.push(new SpawnPoint(width - 50, height - 50, 3, 3));
 
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

	for(let e of enemies){
		e.update();
	}

	player.show(); // Player acima das flechas
}

function mousePressed(){
	arrows.push(new Arrow(mouseX, mouseY));
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
}

function detectCollisions(){
	//Testa se a flecha acerta o alvo
	for(let a = 0; a < arrows.length; a++){
		let itHits = false;
		for(let e = 0; e < enemies.length; e++){
			if(circleRectCollision(arrows[a], enemies[e])){
			
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

