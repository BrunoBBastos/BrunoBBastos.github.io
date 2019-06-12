class Enemy{
	constructor(x, y, v, d = 20){
		this.pos = createVector(x, y);
		this.vel = v;
		this.acc = createVector(0, 0);
		this.direction = createVector(0, 0);
		this.dmt = d;
		this.life = 1;
		this.score = 1;
		this.bonus = 0;
		this.type = 'soldier';
	}

	behavior(){
		this.update();
	}

	update(){
		let barrierList = [...barriers];
		let seekForce = createVector(0, 0);
		this.pathfinding(this.pos, player.pos, barrierList);
		seekForce.set(this.direction);
		seekForce.setMag(this.vel+this.bonus);
		let separation = this.separate();
		this.acc.add(seekForce);
		this.acc.add(separation);
		this.march();
		this.show();
	}

	march(){
		this.pos.add(this.acc);
		this.acc.set(0, 0);	
	}

	seek(){
		let steering = player.pos.copy();
		steering = steering.sub(this.pos);
		return steering;
	}

	separate(){
		let desiredDistance = this.dmt*1.5;
		let steering = createVector(0, 0);
		let total = 0;
		for(let other of enemies){
			let distance = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
			if(this != other && distance < desiredDistance && distance > 0){
				let difference = this.pos.copy();
				difference = difference.sub(other.pos);
				difference.div(distance);
				steering.add(difference);
				total++;
			}
		}
		return steering;
	}

	show(){
		fill(200);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt);
	}

	pathfinding(from, to, list){
		let wtf = list;
		let startingP = createVector();
		let objective = createVector();
		startingP.set(from);
		objective.set(to);
		if(wtf.length>0){
			for(let b = 0; b < wtf.length; b++){
				if(intersects(startingP, wtf[b])){
					let closest = createVector();
					if(dist(wtf[b].origin.x, wtf[b].origin.y, objective.x, objective.y) < dist(wtf[b].ending.x, wtf[b].ending.y, objective.x, objective.y)){
						closest.set(wtf[b].origin.x, wtf[b].origin.y)
					}
					else closest.set(wtf[b].ending.x, wtf[b].ending.y);
					objective = closest.copy();
					wtf.splice(b, 1);
					this.pathfinding(startingP, objective, wtf);

				}		
			}
			this.direction.set(objective.sub(startingP));
		}
		else{
			objective = objective.sub(startingP);
			this.direction.set(objective);
		}
	}

	die(){
		player.score+=this.score;
		player.money+=this.score;
	}
}

//////////////////////////////////////////////////////////////////
class Archer extends Enemy{
	constructor(x, y, v, d = 20){
		super(x, y, v, d = 20);
		this.sightRadius = 300;
		this.lastTimeStamp = 0;
		this.attackSpeed = 2000;
		this.score = 3;
		this.bonus = 0;
		this.type = 'archer';
	}

	behavior(){
		let distance = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
		if(distance > this.sightRadius){
			this.update();
		}
		else if((millis() - this.lastTimeStamp) > this.attackSpeed){
			this.shoot();
			this.lastTimeStamp = millis();
		}
		else{
			this.show();
		}
	}

	shoot(){
		enemyArrows.push(new Arrow(player.pos.x, player.pos.y, this));
		let arrowOrigin = createVector(this.pos.x, this.pos.y);
		enemyArrows[enemyArrows.length -1].shoot(arrowOrigin);
	}

	show(){
		fill('red');
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt);
	}

}

//////////////////////////////////////////////////////////////////
class Mage extends Enemy{
	constructor(x, y, v, d = 20){
		super(x, y, v, d = 20);
		this.sightRadius = 400;
		this.lastTimeStamp = 0;
		this.attackSpeed = 3000;
		this.score = 50;
		this.life = 5;
		this.auraRadius = 200;
		this.spawnP = new SpawnPoint(this.pos.x, this.pos.y, 5, Infinity, 3, 1, 0);
		spawnPoints.push(this.spawnP);
		this.col = 0;
		this.type = 'mage';
	}

	behavior(){
		this.col = map(this.life, 0, 5, 255, 0, true);

		this.aura();
		this.spawnP.pos.set(this.pos);
		let distance = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
		if(distance > this.sightRadius){
			this.update();
		}
		else if((millis() - this.lastTimeStamp) > this.attackSpeed){
			this.shoot();
			this.lastTimeStamp = millis();
		}
		else{
			this.show();
		}
	}

	aura(){
		for(let other of enemies){
			if(this.type != other.type && dist(other.pos.x, other.pos.y, this.pos.x, this.pos.y) < this.auraRadius){
				other.bonus = 0.7;
			}
			else other.bonus = 0;
		}
	}

	shoot(){
		enemyArrows.push(new Arrow(player.pos.x, player.pos.y, this));
		let arrowOrigin = createVector(this.pos.x, this.pos.y);
		enemyArrows[enemyArrows.length -1].shoot(arrowOrigin);
	}

	show(){
		fill(this.col);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt);
	}
	die(){
		player.score += this.score;
		player.money += this.score;
		this.spawnP.stop();
	}

}
//////////////////////////////////////////////////////////////////
class SpawnPoint{
	constructor(x, y, t, w, s, a, m){
		this.pos = createVector(x, y);
		this.minions = [s, a, m];
		this.period = t*1000;
		this.manyWaves = w;
		this.currentWave = this.manyWaves;
		this.interval = 0;
		this.start();
		// this.spawnEnemies(this.minions[0],this.minions[1], this.minions[2]);
	}

	spawnEnemies(soldiersN, archersN, magesN){
		for(let s = 0; s < soldiersN; s++){
			enemies.push(new Enemy(this.pos.x+random(-10, 10), this.pos.y+ random(-10, 10), 1));
		}
		for(let a = 0; a < archersN; a++){
			enemies.push(new Archer(this.pos.x+random(-10, 10), this.pos.y+ random(-10, 10), 1));
		}
		for(let a = 0; a < magesN; a++){
			enemies.push(new Mage(this.pos.x+random(-10, 10), this.pos.y+ random(-10, 10), 0.7));
		}
		this.currentWave--;
		if(this.currentWave == 0){
			this.stop();
		}
	}

	start(){
		this.interval = setInterval(this.spawnEnemies.bind(this), this.period, this.minions[0],this.minions[1], this.minions[2]);
		this.currentWave = this.manyWaves;
	}

	resetInterval(){
		clearInterval(this.interval);
		this.interval = setInterval(this.spawnEnemies.bind(this), this.period, this.minions[0],this.minions[1], this.minions[2]);
		this.currentWave = this.manyWaves;
	}

	addMinions(soldiersN, archersN, magesN){
		this.minions[0] += soldiersN;
		this.minions[1] += archersN;
		this.minions[2] += magesN;
		this.resetInterval();
	}

	stop(){
		clearInterval(this.interval);
	}
}	


function intersects(from, bar){
	if(bar){
			const x1 = bar.origin.x // Pontos da barreira
			const y1 = bar.origin.y
			const x2 = bar.ending.x
			const y2 = bar.ending.y
			const x3 = from.x // Linha de visão
			const y3 = from.y
			const x4 = player.pos.x
			const y4 = player.pos.y
			const den = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4); // Cálculo da determinante
			if(den == 0) return;
			const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4))/den;
			const u =-((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3))/den;

			return(t>0 && t<1 && u>0 && u<1) // Se intersecta
		}
	}