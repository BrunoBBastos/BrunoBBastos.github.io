class Player{
	constructor(x, y, v = 3, d = 20){
		this.pos = createVector(x, y);
		this.acc = createVector(0, 0);
		this.speed = v;
		this.dmt = d;
		this.col = createVector(180, 200, 255);
		this.money = 0;
		this.score = 0;
		this.hasSpecialArrows = 0;
	}

	update(){
		this.keyboard();
		this.acc.setMag(this.speed);
		this.pos.add(this.acc);
		this.acc.set(0, 0);
		this.show();
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

	keyboard(){
		if(keyIsDown(87)) this.acc.y-=3;
		if(keyIsDown(65)) this.acc.x-=3;
		if(keyIsDown(83)) this.acc.y+=3;
		if(keyIsDown(68)) this.acc.x+=3;
	}

	scorePoints(s){
		this.score+=s;
		this.money+=s;
	}

	buySpecialArrows(){
		if(this.money >= 10){
			this.hasSpecialArrows++;
			this.money-=10;
			console.log("bought an arrow")
		}
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
		this.isSpecial = false;
	}

	update(){
		if(this.wasShot){
			this.pos.add(this.heading);
			this.show();
		}
	}

	show(){
		push();
		fill(220);
		translate(this.pos.x, this.pos.y);
		let dir = this.heading;
		angleMode(RADIANS);
		rotate(dir.heading()+HALF_PI);
		line(0, 0, 0, 15);
		triangle(-4, 6, 0, -6, 4, +6);
		pop();
	}

	shoot(o){
		this.origin = o;
		this.heading = this.heading.sub(this.origin);
		this.heading.setMag(7);
		this.pos = this.shooter.pos.copy();
		this.wasShot = true;
	}
}