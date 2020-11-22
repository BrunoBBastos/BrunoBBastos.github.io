/*
Criado por Bruno B Bastos em 21/11/20

Faltando:
	Resetar página
	User inputs (selecionar pontos, linhas, áreas, etc)
	Entrada de matrizes
	Autovetores e Autovalores - feito 22/11/20
	Refactorar as funções de matrizes num objeto Matriz
*/

let points = [];
let particles = [];
let lines = [];
let eigenVecs = [];
let eigenVals = [];
let planeSize = 10; // gera um plano de (-n a n)^2 elementos
let center;
let resolution = 35; // resolução da escala
let currentMatrix;
let Mat = [];
Mat = [[-1, 3], [2, 0]]; // Exemplo L21.5
// Mat = [[0, -1], [-1, 0]];


function setup() {
 	createCanvas(800, 500);
 	center = createVector(width/2, height/2);
 	currentMatrix = Mat;
	
	particlesSetup(points, particles);
 	alert("clique para visualizar a transformação\n"
		 + currentMatrix[0] +"\n"
		 + currentMatrix[1]);
 	
 	getEigenvectors(currentMatrix, eigenVecs, eigenVals);
 	console.log(eigenVals);
 	console.log(eigenVecs);
}

function draw() {
	background(0);
	drawAxis(1);
	drawPoints(points);
	drawEigenVecLines(eigenVecs);
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
	textSize(10)
	for(let i = -10; i <= 10; i++){
		if(i==0)continue;
		text(i * scale, -15, -i * resolution);
	}
	for(let i = -10; i <= 10; i++){
		if(i==0)continue;
		text(i * scale, i * resolution, 15);
	}
	strokeWeight(2);
	line(-width/2, 0, width/2, 0);
	line(0, -height/2, 0, height/2);
	pop();
}

function drawPoints(set){
	return;
	push();
	translate(center);
	stroke('cyan');
	strokeWeight(7);
	for(let i = 0; i < set.length; i++){
		if(i == 258)stroke('red');
		else stroke('cyan');
		point(set[i].x * resolution, set[i].y * -resolution);
	}
	pop();
}


class Particle{
	constructor(vec){
		this.pos = vec;
		this.spd = .005;
		// this.vel = createVector(0, 0);
		this.dir = createVector(0, 0); // direção
		this.destiny = this.pos.copy(); // posição destino
		this.origin = this.pos.copy(); // posição inicial antes da transformação
		this.course = 0;
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
			// let d = this.origin.dist(this.destiny);
			let a = this.dir.copy();
			let b = this.origin.copy();
			a.mult(this.course * this.progress);
			b.add(a);
			this.pos.set(b);
		}
		else{
			this.origin = this.pos.copy();
		}
		/* 	Graças à propriedade T(αv) = αT(v) é possível aplicar a transformação T na posição (pos)
			da partícula em pequenas frações (spd) resultando num movimento que preserva a
			linearidade
		*/
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
		this.course = this.origin.dist(this.destiny);
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
  resolution = constrain(resolution, 10, 90);
  return false;
}

function getEigenvectors(M, vecs, vals){// a função eigenvectors(M) já chama por eigenValues, refazer isso aqui
	vals.push(eigenvalues(M)); // Encontrei um problema pra receber o resultado aqui...
	vecs.push(eigenvectors(M)); // saindo da função, os resultados desaparecem
	// console.log(vecs); // Só consegui resolver com o método push()
	// Aparentemente o array sendo passado é multinível
}

function drawEigenVecLines(vecs){
	push();
	translate(center);
	stroke('cyan');
	strokeWeight(1);
	for(let i = 0; i < vecs[0].length; i++){ 
	// gambiarra horrível, reformular a forma de armazenamento de variáveis
		line(vecs[0][i].x * 10 * resolution, vecs[0][i].y * 10 * -resolution,
			 vecs[0][i].x * -10 * resolution, vecs[0][i].y * -10 * -resolution);
	}
	pop()
}
