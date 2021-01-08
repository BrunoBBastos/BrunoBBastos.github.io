/*
Criado por Bruno B Bastos em 21/11/20

Faltando:
	Resetar página
	Reorganizar elementos da página
	Normalizar autovetores
	Melhorar visual
	Autovetores e Autovalores - feito 22/11/20
	Entrada de matrizes - feito 23/11/2020
	Refactorar as funções de matrizes num objeto Matriz - feito 28/11/2020
	User inputs (selecionar pontos, linhas, áreas, etc) - feito 08/01/2021
*/

let particles = [];
let inputs = [];
let checkBoxes = [];
let selectedPoints = [];

let center;
let planeSize = 10; // Gera um plano de (2n + 1)² elementos
let resolution = 20; // Resolução da escala, número de pixels a cada unidade
let currentMatrix; // Matriz apresentada no canvas
let mousePos, mouseInfo;

let userMat = []; // Matriz editável pelo usuário
userMat = [[-1, 0], [-1, 1]];

let font;

function preload(){
	font = loadFont('assets/Helvetica.ttf');
}

function setup() {
	UIsetup();
	particlesSetup(particles);
}

function draw() { // Reorganizar!
	drawAxis();
	if(checkBoxes[0].checked()) drawEigenvectors(currentMatrix);
	for(p of particles){
		p.update();
	}

	push();
	strokeWeight(3);
	stroke('yellow');
	beginShape();
	translate(center);
	for(let s of selectedPoints) vertex(s.pos.x * resolution, s.pos.y * -resolution);
	endShape(CLOSE);
	pop();

	printUserMatrix();
	let pos = trackMouse();
	mouseInfo.html('(' + pos.x + ', ' + pos.y +')');
}

function drawAxis(){
	background(0);
	push();
	// Cor e configurações de estilo
	stroke(255);
	strokeWeight(2);
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(10);
	
	translate(center); // Posiciona a origem na posição "centro"
	line(-width/2, 0, width/2, 0); // Eixo X
	line(0, -height/2, 0, height/2); // Eixo Y
	strokeWeight(1);
	if(resolution >= 15 && checkBoxes[2].checked()){
		for(let i = -100; i <= 100; i++){
			if(i==0)continue;
			// Escrever a escala à esquerda do eixo Y
			text(i, -10, -i * resolution); // Coordenadas y são invertidas neste canvas
		} // A variável scale serve para ajustar a escala à resolução
		for(let i = -100; i <= 100; i++){
			if(i==0)continue;
			// Escrever a escala abaixo do eixo X
			text(i, i * resolution, 10);
		}
	}
	pop();
}

function drawEigenvectors(M){
	push();
	stroke('cyan');
	strokeWeight(2);
	translate(center);
	let r = resolution * 1000;
	for(let i = 0; i < M.eigenvectors.length; i++){
		line(M.eigenvectors[i].x * r, M.eigenvectors[i].y * (-r),
			 M.eigenvectors[i].x * -(r), M.eigenvectors[i].y * r);
	}
	pop();
}

class Particle{
	constructor(vec){
		this.pos = vec.copy();
		this.visualPos = vec.copy(); // Posição
		this.spd = .005; // Velocidade durante transformação
		this.dir = createVector(0, 0); // direção do movimento
		this.destination = this.visualPos.copy(); // posição destino
		this.origin = this.visualPos.copy(); // posição inicial antes da transformação
		this.travelDistance = 0;
		this.progress = 0; // % do caminho percorrido
		this.col = 'magenta';
	}

	update(shape){
		this.move();
		this.show(shape);
	}

	move(){
		/* 	
		Graças à propriedade T(αv) = αT(v) é possível aplicar a transformação T na posição (pos)
		da partícula em pequenas frações (spd) resultando num movimento que preserva a
		linearidade
		*/
		if(this.progress < 1){
			this.progress += this.spd;
			let a = this.dir.copy();
			let b = this.origin.copy();
			a.mult(this.travelDistance * this.progress);
			b.add(a);
			this.pos.set(b);
		}
		else{ // Adicionar uma forma de escapar daqui, uma vez concluído
			this.origin.set(this.pos.copy());
			// Devido à imprecisão numérica do js, é necessário corrigir ao final do movimento
			this.pos.set(this.destination); 
		}
	}

	show(){
		push();
		translate(center);
		stroke(this.col);
		strokeWeight(5);
		point(this.pos.x * resolution, this.pos.y * -resolution);
		pop(0);
	}

	applyTransform(){
		this.destination = matrixTransform(currentMatrix, this.destination); // Definida em MATH.js
		this.progress = 0; // no momento é necessário resetar o progresso, refatorar o algoritmo de movimentação
		this.dir = this.destination.copy();
		let p = this.pos.copy(); 
		this.dir.sub(p);
		this.dir.normalize();
		this.travelDistance = this.origin.dist(this.destination);
	}
}

function particlesSetup(partclsArray){
	for(let i = -planeSize; i <= planeSize; i++){
 		for(let j = -planeSize; j <= planeSize; j++){
 			let v;
			v = createVector(i, j);
			let p = new Particle(v);
 			partclsArray.push(p);
 		}
 	}
}

function updateMatrix(){
	currentMatrix = new Matrix(userMat, 0);
}

function applyBut(){///////////////////////////////////////////////////////////////
	for(let i = 0; i < particles.length; i++){
		particles[i].applyTransform();
	}
}

function updateResolution(event) { // Para eventos globais, "delta", para função de elemento, "deltaY"
  let pulse = event.deltaY / -100; // Incrementos de 100 com sinal de acordo com a direção
  resolution += 2 * pulse; // Expandir algoritmo para transformar em decimal ao invés de negativo
  resolution = constrain(resolution, 1, 200);
  return false;
}

function UIsetup(){

	// Documentação boa pra ajudar com isso aqui:
	// https://developer.mozilla.org/en-US/docs/Web/CSS/position
	// Colocar tudo em posição absoluta

	canvas = createCanvas(640, 480);
	canvas.mouseClicked(selectPoint);
 	canvas.mouseWheel(updateResolution);
	canvas.mouseOver(trackMouse);
 	center = createVector(width/2, height/2);
 	currentMatrix = new Matrix(userMat, 0);

 	let title = createP("Matriz da transformação:");
	title.position(320, 0, 'relative');
	 
 	let a00 = createInput(String(userMat[0][0]));
 	let a01 = createInput(String(userMat[0][1]));
 	let a10 = createInput(String(userMat[1][0]));
 	let a11 = createInput(String(userMat[1][1]));
	 
 	a00.size(20, 20);
 	a01.size(20, 20);
 	a10.size(20, 20);
	a11.size(20, 20);
	 
 	a00.position(360, 0, 'relative');
 	a01.position(380, 0, 'relative');
 	a10.position(305, 40, 'relative');
	a11.position(325, 40, 'relative');
	 
 	a00.input(getVal00);
 	a01.input(getVal01);
 	a10.input(getVal10);
	a11.input(getVal11);
	
	let buttonApplyMat = createButton('Aplicar Transformação');
	buttonApplyMat.mouseClicked(applyBut);
	buttonApplyMat.position(500, height + 80, 'absolute');
	let buttonSendMat = createButton('Enviar Matriz');
	buttonSendMat.mouseClicked(updateMatrix);
	buttonSendMat.position(500, height + 50, 'absolute');
	// botão resetar página
	
	
	checkBoxes[0] = createCheckbox('Autovetores');
	// checkBoxes[1] = createCheckbox('Linhas');
	checkBoxes[2] = createCheckbox('Escala', true);

	mousePos = createVector();
	mouseInfo = createP('');
}

function getVal00(){ // Só deve ser acessada pela função do botão
	userMat[0][0] = Number(this.value());
}

function getVal01(){
	userMat[0][1] = Number(this.value());
}

function getVal10(){
	userMat[1][0] = Number(this.value());
}

function getVal11(){
	userMat[1][1] = Number(this.value());
}

function trackMouse(){
	mousePos.set(mouseX, mouseY);
	mousePos.sub(center);
	mousePos.div(resolution);
	mousePos.y *= -1;
	if(!keyIsDown(CONTROL)){
		mousePos.x = round(mousePos.x); // TODO Testar distância ao invés de arredondar
		mousePos.y = round(mousePos.y); 
	}

	return mousePos;
}

function selectPoint(){
	let x = mousePos.x;
	let y = mousePos.y;
	let found = false;
	for(let p of particles){
		if(p.pos.x == x && p.pos.y == y){
			p.col = 'yellow';
			if(!selectedPoints.includes(p)) selectedPoints.push(p);
			found = true;
			break;
		}
	}
	if(!found){
		let pos = createVector(x, y);
		let p = new Particle(pos);
		particles.push(p);
	}

}

function printUserMatrix(){
	let brackets = {"top_left": "\u23A1",
                    "middle_left": "\u23A2",
                    "bottom_left": "\u23A3",
                    "top_right": "\u23A4",
                    "middle_right": "\u23A5",
					"bottom_right": "\u23A6"
					};

	push();
	fill(180);
	stroke(180);
	textSize(15);
	textAlign(CENTER, CENTER);
	
	let bbox1, bbox2, col1, col2;
	// Cria um retângulo que contém o texto de cada coluna da matriz e escolhe o maior
	// para centralizar os números dentro da matriz
	bbox1 = String(currentMatrix.mtx[0][0]);
	bbox2 = String(currentMatrix.mtx[1][0]);
	bbox1 = font.textBounds(bbox1, 0, 0, 15);
	bbox2 = font.textBounds(bbox2, 0, 0, 15);
	col1 = max(bbox1.w, bbox2.w);
	bbox1 = String(currentMatrix.mtx[0][1]);
	bbox2 = String(currentMatrix.mtx[1][1]);
	bbox1 = font.textBounds(bbox1, 0, 0, 15);
	bbox2 = font.textBounds(bbox2, 0, 0, 15);
	col2 = max(bbox1.w, bbox2.w);

	text(brackets.top_left + '\n' + brackets.bottom_left, 30, 60);
	let hSpacing = 40 + col1/2; 
	text(currentMatrix.mtx[0][0], hSpacing, 45);
	text(currentMatrix.mtx[1][0], hSpacing, 70);
	hSpacing += 10 + col1/2 + col2/2;
	text(currentMatrix.mtx[0][1], hSpacing, 45);
	text(currentMatrix.mtx[1][1], hSpacing, 70);
	hSpacing += 10 + col2/2;
	text(brackets.top_right + '\n' + brackets.bottom_right, hSpacing, 60);
	
	pop();
}