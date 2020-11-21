let points = [];
let particles = [];
let planeSize = 10; // gera um plano de (-n a n)^2 elementos
let center;
let resolution = 35; // resolução da escala
let currentMatrix;
let M = [];
M = [[-1, 3], [2, 0]];
// M = [[0, 1], [1, 0]];


function setup() {
 	createCanvas(800, 500);
 	center = createVector(width/2, height/2);
 	currentMatrix = M;
	
	particlesSetup(points, particles);
 	alert("clique para visualizar a transformação\n"
		 + M[0] +"\n"
		 + M[1]);
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
	for(let i = -10; i <= 10; i++){
		if(i==0)continue;
		text(i * scale, -15, -i * resolution);
	}
	for(let i = -10; i <= 10; i++){
		if(i==0)continue;
		text(i * scale, i * resolution, 15);
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
		point(set[i].x * resolution, set[i].y * -resolution);
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
		this.spd = .005;
		// this.vel = createVector(0, 0);
		this.dir = createVector(0, 0); // direção
		this.destiny = this.pos.copy(); // posição destino
		this.origin = this.pos.copy(); // posição inicial antes da transformação
		this.progress = 0; // % do caminho percorrido
		this.col = 'magenta';
	}

	update(){
		this.move();
		this.show();
	}

	move(){
		if(this.progress < 1){
			this.progress += this.spd;
			let d = this.origin.dist(this.destiny);
			let a = this.dir.copy();
			let b = this.origin.copy();
			a.mult(d * this.progress);
			b.add(a);
			this.pos.set(b);
		}
		else{
			this.origin = this.pos.copy();
		}
	}

	show(){
		push();
		translate(center);
		stroke(this.col);
		strokeWeight(6);
		point(this.pos.x * resolution, this.pos.y * -resolution);
		pop(0);
	}

	moveTo(vec){
		this.progress = 0;
		this.destiny = vec; // armazena o destino da partícula
		this.dir = this.destiny.copy(); // atualiza a velocidade...
		let p = this.pos.copy(); 
		this.dir.sub(p); // para a direção do destino
		this.dir.normalize(); // transforma num vetor unitário 
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

function mouseClicked(){
	applyTransform(currentMatrix, points, particles);
}

function mouseWheel(event) {
  let pulse = event.delta / -100;
  resolution += 2 * pulse;
  resolution = constrain(resolution, 10, 70);
  return false;
}