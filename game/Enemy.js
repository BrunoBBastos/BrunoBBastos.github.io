class Enemy{
	constructor(x, y, v, d = 20){
		this.pos = createVector(x, y);
		this.direction = createVector(0, 0);
		this.vel = v;
		this.dmt = d;
		this.life = 1;
	}

	update(){
		this.chooseDirection();
		this.separate();
		this.direction.setMag(this.vel);
		this.pos.add(this.direction);
		this.show();
	}

	show(){
		fill(100);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt);
	}

	chooseDirection(){
		let objective = player.pos.copy();
		this.direction = objective.sub(this.pos);
		this.direction.setMag(this.vel);
	}

	separate(){
		let repulsion = this.vel;
		let desiredDist = this.dmt*1.5;
		let sum = createVector();
		let count = 0;
		for(let e of enemies){
			let distance = dist(this.pos.x, this.pos.y, e.pos.y, e.pos.y);
			if(this != e && distance < desiredDist){
				let difference = this.pos.copy();
				difference = difference.sub(e.pos);
				difference.div(distance);
				sum.add(difference);
				count++;
			}
		}
		if(count > 0){
			sum.div(count);
			//sum.normalize();
			sum.setMag(repulsion);
			// this.direction.sub(sum);
			this.direction.add(sum);
		}
	}
}

//////////////////////////////////////////////////////////////////
class SpawnPoint{
	constructor(x, y, n, t){
		this.pos = createVector(x, y);
		this.num = n;
		this.interval = setInterval(this.spawnEnemies.bind(this), t*1000);
	}

	spawnEnemies(){
		for(let i = 0; i< this.num; i ++){
			enemies.push(new Enemy(this.pos.x+random(-5, 5), this.pos.y+ random(-5, 5), 1));
		}
	}
}