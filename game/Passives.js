class Coin{
	constructor(x, y){
		this.pos = createVector(x, y);
		this.dmt = 10;
	}	

	show(){
		fill(255, 168, 18);
		ellipse(this.pos.x, this.pos.y, sin(millis()/1000)*this.dmt, this.dmt);
	}
}
////////////////////////////////////////////////////////////////
class Barrier
{
	constructor(o, e){
		this.origin = o;
		this.ending = e;
	}

	show(){
		push()
		strokeWeight(4);
		stroke(50, 180, 70);
		line(this.origin.x, this.origin.y, this.ending.x, this.ending.y);
		pop();
	}
}

function wall(s, bar) {

		let S = s.pos.copy(),
		P = bar.origin.copy(),
		Q = bar.ending.copy();

		let PS = S.sub(P);
		let PQ = Q.sub(P);
		let dot = PS.dot(PQ);
		let PQsq = PQ.magSq();
		let param = -1;
		if (PQsq != 0) param = dot / PQsq;

		let xx, yy;

		if (param < 0) {
			xx = bar.origin.x;
			yy = bar.origin.y;
		} else if (param > 1) {
			xx = bar.ending.x;
			yy = bar.ending.y;
		} else {
			xx = bar.origin.x + param * PQ.x;
			yy = bar.origin.y + param * PQ.y;
		}

		let dx = s.pos.x - xx;
		let dy = s.pos.y - yy;
		let distance = sqrt(dx * dx + dy * dy);
		if(distance < s.dmt/2){
			xy = createVector(xx, yy);
			S = s.pos.copy();
			S = S.sub(xy);
			distance = s.dmt/2 - distance;
			S.setMag(distance);
		s.pos.add(S);
	}
}

/////////////////////////////////////////////////////////////////

function gibMoney(){
	coins.push(new Coin(random(width), random(height)));
}

function updateScreen(){
	background(180, 255, 220);
	push();
	textSize(22);
	fill(255, 168, 18);
	textStyle(BOLD);
	textAlign(CENTER, CENTER);
	textFont(font);
	text(player.money, width/2, height/16);
	pop();
}

function keyPressed(){
	switch(mode){
		case 0:
		break;
		// Menu
		case 1:
		break;
		// SetupGame
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
			endGame();
			loop();
		}
		break;
	}
}

function keyTyped(){
	switch(mode){

		case 3:
		if(key === ' '){
			player.buySpecialArrows();
		}
		break;
	}
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
			levelResult = false;
			mode = 5;
			break;
		}
	}
	//testa se o inimigo alcança o player
	for(let e = 0; e < enemies.length; e++){
		if(circleRectCollision(player, enemies[e])){
			levelResult = false;
			mode = 5;
			break;
		}
	}
	// Testa se o player recolhe as moedas
	for(let c = 0; c < coins.length; c++){
		if(circleCircleCollision(player, coins[c])){
			coins.splice(c, 1);
			currentScore += 3;
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
