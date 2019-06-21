class Player {
	constructor(x, y, v = 3, d = 20) {
		this.pos = createVector(x, y);
		this.acc = createVector(0, 0);
		this.speed = v;
		this.dmt = d;
		this.col = createVector(180, 200, 255);
		this.money = 0;
		this.hasSpecialArrows = 0;
	}

	update() {
		this.keyboard();
		this.acc.setMag(this.speed);
		this.pos.add(this.acc);
		this.acc.set(0, 0);
		this.show();
	}

	show() {
		this.edges();
		push();
		imageMode(CENTER);
		let dir = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
		if (arrows.length > 0) {
			if (!arrows[arrows.length - 1].wasShot) {
				let pointing = arrows[arrows.length - 1].heading.copy();
				dir.set(pointing.x - mouseX, pointing.y - mouseY);
				playerImg[0] = playerImg[1]
			}
		}
		else playerImg[0] = playerImg[2];

		translate(this.pos.x, this.pos.y);
		rotate(dir.heading());
		image(playerImg[0], 0, 0);
		pop();
	}

	edges() {
		this.pos.x = constrain(this.pos.x, this.dmt / 2, width - this.dmt / 2);
		this.pos.y = constrain(this.pos.y, this.dmt / 2, height - this.dmt / 2);
		for (let b of barriers) {
			wall(this, b);
		}
	}

	keyboard() {
		if (keyIsDown(87)) this.acc.y -= 3;
		if (keyIsDown(65)) this.acc.x -= 3;
		if (keyIsDown(83)) this.acc.y += 3;
		if (keyIsDown(68)) this.acc.x += 3;
	}

	scorePoints(s) {
		this.money += s;
	}

	buySpecialArrows() {
		if (this.money >= 15) {
			this.hasSpecialArrows++;
			this.money -= 15;
		}
	}
}

class Arrow {
	constructor(x, y, s, v) {
		this.shooter = s;
		this.pos = createVector(this.shooter.pos.x, this.shooter.pos.y, 2);
		this.vel = createVector(0, 0, 0);
		this.acc = createVector(0, 0, 0);
		this.dmt = 5;
		this.heading = createVector(x, y, 0);
		this.finalVector = createVector(0, 0, 0);
		this.origin = createVector(0, 0, 0);
		this.wasShot = false;
		this.isFlying = true;
		this.isSpecial = false;
		this.col = createVector(220, 220, 200);
		this.loadingTime = millis();
	}

	update() {
		if (this.wasShot) {
			this.acc.add(gravity);
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.set(0, 0, 0);
			this.show();
		}
		if (this.pos.z <= 0) {
			this.isFlying = false;
		}
		if (this.pos.x < -this.dmt || this.pos.x > width + this.dmt || this.pos.y < -this.dmt || this.pos.y > height + this.dmt) {
			this.isFlying = false;
		}
	}

	show() {
		push();
		fill(this.col.x, this.col.y, this.col.z);
		translate(this.pos.x, this.pos.y);
		let dir = this.heading;
		angleMode(RADIANS);
		rotate(dir.heading());
		triangle(-12, 4, -12, -4, 0, 0);
		line(-27, 0, -12, 0);
		pop();
	}

	shoot(o) {
		this.loadingTime = -this.loadingTime + millis();
		this.loadingTime = map(this.loadingTime, 0, 1000, 7, 12, true);
		this.origin = o;
		this.heading = this.heading.sub(this.origin);
		this.heading.setMag(this.loadingTime);
		this.pos = this.shooter.pos.copy();
		this.pos.z += this.loadingTime;
		this.wasShot = true;
		this.isFlying = true;
		this.acc.add(this.heading);
	}
}

