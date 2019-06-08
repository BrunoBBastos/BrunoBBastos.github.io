class Enemy{
	constructor(x, y, v, d = 20){
		this.pos = createVector(x, y);
		this.vel = v; //createVector(1, 1);
		this.acc = createVector(0, 0);
		this.direction = createVector(0, 0);
		this.dmt = d;
		this.life = 1;
		this.score = 1;
	}

behavior(){
	this.update();
}

	update(){
		let seekForce = this.seek();
		seekForce.setMag(this.vel);
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
		fill(100);
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
class SpawnPoint{
	constructor(x, y, n, t){
		this.pos = createVector(x, y);
		this.num = n;
		this.interval = setInterval(this.spawnEnemies.bind(this), t*1000);
		this.spawnEnemies();
	}

	spawnEnemies(){
		for(let i = 0; i< this.num; i ++){
			enemies.push(new Enemy(this.pos.x+random(-5, 5), this.pos.y+ random(-5, 5), 1));
		}
		enemies.push(new Archer(this.pos.x+random(-5, 5), this.pos.y+ random(-5, 5), 1));
	}
}