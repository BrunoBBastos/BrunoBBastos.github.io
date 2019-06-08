class Player{
	constructor(x, y, d = 30){
		this.pos = createVector(x, y);
		this.dmt = d;
		this.col = createVector(180, 200, 255);
	}

	show(){
		this.edges();
		fill(this.col.x, this.col.y, this.col.z);
		circle(this.pos.x, this.pos.y, this.dmt);
	}

	edges(){
		this.pos.x = constrain(this.pos.x, this.dmt/2, width - this.dmt/2);
		this.pos.y = constrain(this.pos.y, this.dmt/2, height - this.dmt/2);
	}
}

class Arrow{
	constructor(x, y, s, v){
		this.shooter = s;
		this.pos = createVector(this.shooter.pos.x, this.shooter.pos.y);
		this.dmt = 10;
		this.speed;
		this.heading = createVector(x, y);
		this.finalVector = createVector(0, 0);
		this.origin = createVector(0, 0);
		this.wasShot = false;
	}

	update(){
		if(this.wasShot){
			this.pos.add(this.heading);
			this.show();
		}
	}

	show(){
		circle(this.pos.x, this.pos.y, this.dmt);
	}

	shoot(o){
		this.origin = o;
		this.heading = this.heading.sub(this.origin);
		this.heading.setMag(7);
		this.pos = this.shooter.pos.copy();
		this.wasShot = true;
	}
}