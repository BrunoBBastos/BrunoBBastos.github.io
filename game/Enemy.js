class Enemy{
	constructor(x, y, v, d = 20){
		this.pos = createVector(x, y);
		this.vel = v; //createVector(1, 1);
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
		let seekForce = this.seek();
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
		fill(150);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt);
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
		this.attackSpeed = 2000;
		this.score = 50;
		this.life = 10;
		this.auraRadius = 200;
		this.type = 'mage';
	}

	behavior(){
		this.aura();
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
		fill(0);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt);
	}

}
//////////////////////////////////////////////////////////////////
class SpawnPoint{
	constructor(x, y, t, s, a, m){
		this.pos = createVector(x, y);
		this.minions = [s, a, m];
		this.period = t;
		this.interval = setInterval(this.spawnEnemies.bind(this), t*1000, this.minions[0],this.minions[1], this.minions[2]);
		this.spawnEnemies(this.minions[0],this.minions[1], this.minions[2]);
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
	}

	resetInterval(){
		clearTimeout(this.interval);
		this.interval = setInterval(this.spawnEnemies.bind(this), this.period*1000, this.minions[0],this.minions[1], this.minions[2]);
	}

	addMinions(soldiersN, archersN, magesN){
		this.minions[0] += soldiersN;
		this.minions[1] += archersN;
		this.minions[2] += magesN;
	}
}	