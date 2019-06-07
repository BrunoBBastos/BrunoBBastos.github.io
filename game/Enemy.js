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
		this.pos.add(this.direction);
		this.show();
	}

	show(){
		fill(100);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt*3/2);
	}


	chooseDirection(){
		let objective = player.pos.copy();
		this.direction = objective.sub(this.pos);
		this.direction.setMag(this.vel);
	}
}