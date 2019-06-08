class Passives{
	constructor(x, y){
		this.pos = createVector(x, y);
		this.dmt = 10;
	}	

	show(){
		fill(255, 168, 18);
		ellipse(this.pos.x, this.pos.y, sin(millis()/1000)*this.dmt, this.dmt);
	}
}

function manageLevel(){
	level++;
	loadWaves();
	setTimeout(manageLevel, runTime*1000);
}

function loadWaves(){

	switch(level){
		case 0:
		break;

		case 1:
		spawnPoints.push(new SpawnPoint(0, 0, 3, 3, 0, 0));
		runTime = 20;
		break;

		case 2:
		spawnPoints[0].addMinions(-1, 1, 0);
		spawnPoints[0].period+=2;
		spawnPoints[0].resetInterval();
		spawnPoints.push(new SpawnPoint(width, height, 5, 2, 0, 0));
		break;

		case 3:
		spawnPoints[1].addMinions(0, 1, 0);
		spawnPoints[1].resetInterval();
		break;

		case 4:
		spawnPoints[0].addMinions(1, 0, 0);
		spawnPoints[0].resetInterval();
		spawnPoints[1].addMinions(1, 0, 0);
		spawnPoints[1].resetInterval();
		break;

		case 5:
		spawnPoints[0].addMinions(0, 1, 0);
		spawnPoints[0].resetInterval();
		spawnPoints[1].addMinions(0, 1, 0);
		spawnPoints[1].resetInterval();
		break;
	}
}

function gibMoney(){
	coins.push(new Passives(random(width), random(height)));
}

function startGame(){
	manageLevel();
	setInterval(gibMoney, 5000);
}