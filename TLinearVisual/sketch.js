/*
Criado por Bruno B Bastos em 21/11/20

Faltando:
	Resetar página
	User inputs (selecionar pontos, linhas, áreas, etc)
	Entrada de matrizes - feito 23/11/2020
	Autovetores e Autovalores - feito 22/11/20
	Refactorar as funções de matrizes num objeto Matriz
*/

let points = [];
let particles = [];
let lines = [];
let eigenVecs = [];
let eigenVals = [];
let inputs = [];

let planeSize = 10; // gera um plano de (-n a n)^2 elementos
let center;
let resolution = 20; // resolução da escala
let currentMatrix;

let Mat = [];
// Mat = [[-1, 3], [2, 0]]; // Exemplo L21.5
Mat = [[0, -1], [-1, 0]];


function setup() {
 	UIsetup();
	particlesSetup(points, particles);
 	updateMatrix();
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
	textSize(10);
	if(resolution >= 15){
		for(let i = -10; i <= 10; i++){
			if(i==0)continue;
			text(i * scale, -10, -i * resolution);
		}
		for(let i = -10; i <= 10; i++){
			if(i==0)continue;
			text(i * scale, i * resolution, 10);
		}
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

function getEigenvectors(M){// a função eigenvectors(M) já chama por eigenValues, refazer isso aqui
	eigenVals = eigenvalues(M); // Encontrei um problema pra receber o resultado aqui
	eigenVecs = eigenvectors(M); // saindo da função, os resultados desaparecem
	// Só consegui resolver com o método push()
	// Aparentemente o array sendo passado é multinível
	// Passar o array para receber de uma terceira função aparentemente gera problemas de escopo
	// Redundância enorme!
}

function drawEigenVecLines(vecs){
	push();
	translate(center);
	stroke('cyan');
	strokeWeight(1);
	for(let i = 0; i < vecs.length; i++){
		line(vecs[i].x * 100 * resolution, vecs[i].y * 100 * -resolution,
			 vecs[i].x * -100 * resolution, vecs[i].y * -100 * -resolution);
	}
	pop();
}

class Particle{
	constructor(vec){
		this.pos = vec;
		this.spd = .005;
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
		/* 	
		Graças à propriedade T(αv) = αT(v) é possível aplicar a transformação T na posição (pos)
		da partícula em pequenas frações (spd) resultando num movimento que preserva a
		linearidade
		*/
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

function UIsetup(){ // Funções de html e da interface do usuário serão a minha ruína, observe:
	// Documentação boa pra ajudar com isso aqui:
	// https://developer.mozilla.org/en-US/docs/Web/CSS/position

	canvas = createCanvas(800, 500);
 	canvas.mouseClicked(applyTransform);
 	canvas.mouseWheel(updateResolution);

 	center = createVector(width/2, height/2);
 	currentMatrix = Mat;

 	let title = createP("Matriz da transformação:");
 	title.position(320, 0, 'relative');
 	let a00 = createInput(String(currentMatrix[0][0]));
 	a00.size(20, 20);
 	a00.position(360, 0, 'relative');
 	let a01 = createInput(String(currentMatrix[0][1]));
 	a01.size(20, 20);
 	a01.position(380, 0, 'relative');
 	let a10 = createInput(String(currentMatrix[1][0]));
 	a10.size(20, 20);
 	a10.position(305, 40, 'relative');
 	let a11 = createInput(String(currentMatrix[1][1]));
 	a11.size(20, 20);
 	a11.position(325, 40, 'relative');

 	a00.changed(getVal00);
 	a01.changed(getVal01);
 	a10.changed(getVal10);
 	a11.changed(getVal11);

 	let button = createButton('Autovetores');
 	button.mousePressed(updateMatrix);
 	button.position(400, 0, 'relative');
}

function getVal00(){
	Mat[0][0] = Number(this.value());
}

function getVal01(){
	Mat[0][1] = Number(this.value());
}

function getVal10(){
	Mat[1][0] = Number(this.value());
}

function getVal11(){
	Mat[1][1] = Number(this.value());
}

function applyTransform(){
	for(let i = 0; i < points.length; i++){
 		points[i] = matrixTransform(currentMatrix, points[i]);
 		particles[i].moveTo(points[i]);
 	}
}

function updateMatrix(){
	currentMatrix = Mat;
	getEigenvectors(currentMatrix, eigenVecs, eigenVals);
 	console.log(eigenVals);
 	console.log(eigenVecs);
}

function updateResolution(event) { // Para eventos globais, "delta", para função de elemento, "deltaY"
  let pulse = event.deltaY / -100; // Incrementos de 100 com sinal de acordo com a direção
  resolution += 2 * pulse; // Expandir algoritmo para transformar em decimal ao invés de negativo
  resolution = constrain(resolution, 10, 200);
  return false;
}