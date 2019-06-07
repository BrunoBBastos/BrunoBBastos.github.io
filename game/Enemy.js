class Enemy{
	constructor(x, y, v, d = 20){
		this.pos = createVector(x, y);
		this.vel = v;
		this.dmt = d;
	}

	update(){
		this.pos.y+=this.vel;
		this.show();
	}

	show(){
		fill(100);
		rectMode(CENTER);
		rect(this.pos.x, this.pos.y, this.dmt, this.dmt*2);
	}

}