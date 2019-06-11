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
		push();
		fill(255, 150, 150, 150);
		noStroke();
		circle(this.pos.x, this.pos.y, this.dmt);

		let dir = createVector(mouseX - this.pos.x, mouseY-this.pos.y);
		if(arrows.length>0){
			if(!arrows[arrows.length-1].wasShot){
				let pointing = arrows[arrows.length-1].heading.copy();
				dir.set(pointing.x-mouseX, pointing.y-mouseY);
			}}

			imageMode(CENTER);
			angleMode(RADIANS);
			translate(this.pos.x, this.pos.y);
			rotate(dir.heading()+HALF_PI);
			image(playerImg, 0, 0);
			pop();
		}

		edges(){
			this.pos.x = constrain(this.pos.x, this.dmt/2, width - this.dmt/2);
			this.pos.y = constrain(this.pos.y, this.dmt/2, height - this.dmt/2);
			for(let b of barriers){
				wall(this, b);
			}
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
			if(this.money >=15){
				this.hasSpecialArrows++;
				this.money-=15;
			}
		}
	}

	class Arrow{
		constructor(x, y, s, v){
			this.shooter = s;
			this.pos = createVector(this.shooter.pos.x, this.shooter.pos.y);
			this.dmt = 1;
			this.speed;
			this.heading = createVector(x, y);
			this.finalVector = createVector(0, 0);
			this.origin = createVector(0, 0);
			this.wasShot = false;
			this.isSpecial = false;
			this.col = createVector(220, 220, 200);
		}

		update(){
			if(this.wasShot){
				this.pos.add(this.heading);
				this.show();
			}
		}

		show(){
			push();
			fill(this.col.x, this.col.y, this.col.z);
			translate(this.pos.x, this.pos.y);
			let dir = this.heading;
			angleMode(RADIANS);
			rotate(dir.heading()+HALF_PI);
			line(0, 12, 0, 27);
			triangle(-4, 12, 0, 0, 4, 12);
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
		// console.log(S);
		s.pos.add(S);
	}
}