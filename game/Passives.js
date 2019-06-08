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