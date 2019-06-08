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
	loadLevel();
	setTimeout(manageLevel, runTime*1000);
}

function loadLevel(){

	switch(level){
		case 0:
		break;

		case 1:
		spawnPoints.push(new SpawnPoint(0, 0, 5, 3, 0, 0));
		runTime = 25;
		break;

		case 2:
		spawnPoints[0].addMinions(-1, 1, 0);
		spawnPoints[0].resetInterval();
		spawnPoints.push(new SpawnPoint(width, height, 5, 2, 0, 0));
		runTime = 25;
		break;

		case 3:
		spawnPoints[1].addMinions(0, 1, 0);
		spawnPoints[1].resetInterval();
		runTime = 25;
		break;

		case 4:
		break;

		case 5:
		break;
	}
}