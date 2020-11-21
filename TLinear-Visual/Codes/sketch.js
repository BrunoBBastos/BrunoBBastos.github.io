let points = [];
let particles = [];
let planeSize = 10; // gera um plano de n*n elementos
let center;
let unitSize = 45;

let M = [];
M = [[-1, 4], [-2, 5]];
// M = [[0, 1], [1, 0]];



function setup() {
 	createCanvas(800, 500);
 	center = createVector(width/2, height/2);
	
	particlesSetup(points, particles);
 	applyTransform(M, points, particles);
}

function draw() {
	background(0);
	drawAxis(1);
	drawPoints(points);
  	for(p of particles){
  		p.update();
  	}
}

function drawAxis(scale){
	push();
	translate(center);
	stroke(255);
	fill(255);
	textAlign(CENTER, CENTER);
	strokeWeight(1);
	for(let i = -10; i < 10; i++){
		if(i==0)continue;
		text(i * scale, -15, -i * unitSize);
	}
	for(let i = -10; i < 10; i++){
		if(i==0)continue;
		text(i * scale, i * unitSize, 15);
	}
	strokeWeight(3);
	line(-width/2, 0, width/2, 0);
	line(0, -height/2, 0, height/2);
	pop();
}

function drawPoints(set){
	return;
	push();
	translate(center);
	stroke('cyan');
	strokeWeight(10);
	for(let i = 0; i < set.length; i++){
		if(i == 258)stroke('red');
		else stroke('cyan');
		point(set[i].x * unitSize, set[i].y * -unitSize);
	}
	pop();
}

function matrixTransform(M, v){ // Aplica uma transformação em um vetor P5
	let vec = vecToMatrix(v); // transforma um vetor P5 numa matriz
	let product = matrixMult(M, vec); // multiplica a mat tranformação pelo "vetor"
	let result = matrixToVec(product); // converte o produto de volta a um vetor P5
	return result;
}

function matrixMult(A, B){
	if(A[0].length != B.length) {
		console.log("número de colunas de A deve ser igual ao de linhas de B");
		return null; 
	}
	let result = [];
	for(let i = 0; i < A.length; i++){
		let row = [];
		result.push(row);
		for(let j = 0; j < B[0].length; j++){
			let sum = 0;
			for(let a = 0; a < A[0].length; a++){
				sum += A[i][a] * B[a][j];
			}
			result[i][j] = sum;
		}
	}
	return result;
}

function vecToMatrix(v){
	if(v instanceof p5.Vector){
		let vec = [];
		vec[0] = [];
		vec[1] = [];
		vec[0].push(v.x);
		vec[1].push(v.y);
		return vec;
	}
	if(v instanceof Array){ // recebe um conjunto de vetores e transforma numa matriz
		console.log("Ainda não fiz essa parte :(");
		return null;
	}
}

function matrixToVec(M){ // expandir para matrizes de formato nxm
	let vec = createVector(M[0], M[1]);
	return vec;
}

class Particle{
	constructor(vec){
		this.pos = vec;
		this.maxSpd = .001;
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.destiny = this.pos.copy();
		this.origin = this.pos.copy();
		this.progress = 0;
		this.col = 'magenta';
	}

	update(){
		this.move();
		this.show();
	}

	move(){
		if(this.progress < 1){
			this.progress += 0.01;
			let d = this.origin.dist(this.destiny);
			let a = this.acc.copy();
			let b = this.origin.copy();
			a.mult(d * this.progress);
			b.add(a);
			this.pos.set(b);
		}

		
	}

	show(){
		push();
		translate(center);
		stroke(this.col);
		strokeWeight(4);
		point(this.pos.x * unitSize, this.pos.y * -unitSize);
		pop(0);
	}

	moveTo(vec){
		this.destiny = vec; // armazena o destino da partícula
		this.acc = this.destiny.copy(); // atualiza a velocidade...
		let p = this.pos.copy(); 
		this.acc.sub(p); // para a direção do destino
		this.acc.normalize(); // transforma num vetor unitário 
	}
}

function particlesSetup(ptsArray, partclsArray){
	for(let i = -planeSize; i <= planeSize; i++){
 		for(let j = -planeSize; j <= planeSize; j++){
 			let v;
 			v = createVector(i, j);
 			ptsArray.push(v);// REMOVER
 			let p = new Particle(v);
 		partclsArray.push(p);
 		}
 	}
}

function applyTransform(M, ptsArray, partclsArray){
	for(let i = 0; i < ptsArray.length; i++){
 		ptsArray[i] = matrixTransform(M, ptsArray[i]);
 		partclsArray[i].moveTo(ptsArray[i]);
 	}
}