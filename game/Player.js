class Player{
	constructor(x, y, d = 30){
		this.pos = createVector(x, y);
		this.dmt = d;
		this.col = createVector(180, 200, 255);
	}

	show(){
		fill(this.col.x, this.col.y, this.col.z);
		circle(this.pos.x, this.pos.y, this.dmt);
	}
}

class Arrow{
	constructor(x, y){
		this.pos = createVector(player.pos.x, player.pos.y);
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
		circle(this.pos.x, this.pos.y, 10);
	}

	shoot(o){
		this.origin = o;
		this.heading = this.heading.sub(this.origin);
		this.heading.setMag(7);
		this.pos = player.pos.copy();
		this.wasShot = true;
	}
}