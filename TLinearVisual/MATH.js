/*
	Tentar organizar isso aqui de acordo com as seguintes regras pra facilitar a leitura:
		* Uma matrix genérica será passada ou criada numa variável chamada "M"
		* Uma matrix específica será chamada "A" operações serão realizadas entre "A" e "B"
		* Especificar funções para matrizes 2D para serem usadas com os vetores geométricos da bibioteca P5
				Isso vai permitir uma atualização mais fácil para expandir para matrizes 3D
*/





function bhaskara(coefs){
// recebe um array com os coeficientes 
// a = coefs[0], b = coefs[1], c = coefs[2]
	let result = [];
	let delta = (coefs[1] * coefs[1]) - (4 * coefs[0] * coefs[2]);
	let x1, x2;
	x1 = (-coefs[1] + sqrt(delta)) / (2 * coefs[0]);
	x2 = (-coefs[1] - sqrt(delta)) / (2 * coefs[0]);
	result.push(x1);
	result.push(x2);
	return result;
}

class Matrix{
	constructor(M, isDisposable = true){ // Criar extensão da classe genérica para evitar problemas de recall
		this.mtx = M;
		this.rows = this.mtx.length;
		this.cols = this.mtx[0].length;
		if(isDisposable) return;

		this.det = undefined;
		this.tr = undefined;
		this.eigenvalues = undefined;
		this.eigenvectors = undefined;

		this.is2D = false;
		this.isSquare = (this.rows == this.cols);
		if(this.isSquare){
			if(this.rows == 2) this.is2D = true;
			this.det = this.determinant(this.mtx);
			this.tr = this.trace(this.mtx);
		}
		if(this.is2D){
			this.eigenvalues = this.findEigenvalues();
			this.eigenvectors = this.findEigenvectors();
		}
	}

	determinant(M){ // recursiva para matrizes nxn
		let det = 0;
		if(M.length <= 2){ // caso base
			det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
		}
		else {
			let coeficients = []; // encontra os coefs...
			coeficients = M[0]; // na primeira linha da matriz

			for(let c = 0; c < coeficients.length; c++){
				let reducedMatrix = [];

				for(let i = 1; i < M.length; i++){ // ignore a linha do coeficiente (linha 0)
					let row = [];

					for(let j = 0; j < M.length; j++){
						if(j == c) continue; // ignora a coluna do coeficiente
						row.push(M[i][j]); // recolhe elementos para a matriz reduzida, linha por linha
					}
					reducedMatrix.push(row); // recolhe as linhas da matriz reduzida
				}
				let signal = 1;
				if(c & 1) signal = -1;
				det += coeficients[c] * this.determinant(reducedMatrix) * signal;
			}
		}
		return det;
	}

	trace(){
		let sum = 0;
		for(let i = 0; i < this.mtx.length; i++){
			sum += this.mtx[i][i];
		}
		return sum;
	}

	scalarMult(scalar){
		let M = [];
		for(let i = 0; i < this.mtx.length; i++){
			let row = [];
			for(let j = 0; j < this.mtx[0].length; j++){
				row[j] = this.mtx[i][j] * scalar;
			}
			M.push(row);
		}
		let result = new Matrix(M);
		return result;
	}

	addMatrix(scalarA, B, scalarB){ // Pensando em adicionar um overload para simplificar e evitar confusões
		if(this.mtx.length != B.mtx.length || this.mtx[0].length != B.mtx[0].length){
			console.log("Dimensões incompatíveis");
			return null;
		}

		let M = [];
		for(let i = 0; i < this.mtx.length; i++){
			let row = [];
			for(let j = 0; j < this.mtx[0].length; j++){
				row[j] = this.mtx[i][j] * scalarA + B.mtx[i][j] * scalarB;
			}
			M.push(row);
		}
		let result = new Matrix(M);
		return result;
	}

	multMatrix(A){ // A == this, B == 'A'
		if(this.mtx[0].length != A.mtx.length) {
			console.log("Dimensões incompatíveis");
			return null; 
		}

		let M = [];
		for(let i = 0; i < this.mtx.length; i++){
			let row = [];
			M.push(row);
			for(let j = 0; j < A.mtx[0].length; j++){
				let sum = 0;
				for(let a = 0; a < this.mtx[0].length; a++){
					sum += this.mtx[i][a] * A.mtx[a][j];
				}
				M[i][j] = sum;
			}
		}
		let result = new Matrix(M);
		return result;
	}

	findEigenvalues(){
		// Hardcoded formula para M2x2,
		// parece funcionar para outras nxn se resolvida por partes como fiz no algoritmo determinant(). Pesquisar
		// Resolvendo o problema com uma M genérica
		// encontrei que o determinante da (M - λI)
		// tem a forma ad - aλ - dλ + λ^2 - bc
		// (ad-bc) - λ(a + d) + λ^2
		// det(M) - λ(tr(M)) + λ^2
		if(!this.isSquare || !this.is2D){
			console.log("Matriz incompatível!");
			return null;
		}

		let lambdas = [];
		let lambdaCoefs = [];
		lambdaCoefs[0] = 1;
		lambdaCoefs[1] = -this.tr;
		lambdaCoefs[2] = this.det;
		lambdas = bhaskara(lambdaCoefs);
		return lambdas;
	}

	findEigenvectors(){
		if(!this.isSquare || !this.is2D){
			console.log("Matriz incompatível!");
			return null;
		}
		// Segundo o Teorema de Cayley-Hamilton
		// (M - λ1I)(M - λ2I) = (M - λ2I)(M - λ1I) = 0
		// (M - λ1I) é formado por colunas de autovetores correspondentes a λ2 e vice e versa. Pesquisar o pq. 
		let vecs = [];
		for(let i = 0 ; i < this.eigenvalues.length; i++){ // Para cada lambda encontrado...
			// if(this.eigenvalues[i] isNaN) continue; // (Se não for número, sair)

			let lambdaI = createIdentityMatrix(this.rows); // ...criar uma matriz lambda * Identidade
			lambdaI = lambdaI.scalarMult(this.eigenvalues[i]);
			let MminusL = new Matrix(this.mtx);
			MminusL = MminusL.addMatrix(1, lambdaI, -1); // Encontrar (M - λI)

			for(let j = 0; j < this.eigenvalues.length; j++){ // ADICIONAR: Testar se o lambda corresponde ao v
				if(j == i) continue; // A matriz (M - λiI) vai corresponder a um autovetor diferente
				for(let c = 0; c < this.mtx[0].length; c++){
					let v = matrixToVec(MminusL, c);
					if(v.x == 0 && v.y == 0) continue; //  Autovetor tem que ser diferente de (0, 0) // Add (x, y, z)
					// ADICIONAR: normalizar o vetor ou colocá-lo na escala da base da Matrix
					vecs[j] = v; // Como as colunas são múltiplas entre si, qqr uma serve desde que não seja == 0
					break; // (Terminar a busca se achado um autovetor válido)
				}
			}
		}
		return vecs;
	}
}

function vecToMatrix(v, len){ // recebe um vetor P5 e o retorna em formato de matrix
	let vec = [];
	vec[0] = [];
	vec[1] = [];
	vec[0].push(v.x);
	vec[1].push(v.y);
	if(len == 3){
		vec[2] = [];
		vec[2].push(v.z);
	}
	let result = new Matrix(vec);
	return result;
}

function matrixToVec(M, j){ // Recebe uma matriz e retorna um vetor geométrico tirado da coluna j
	let vec;
	if(M.mtx.length == 2){
		vec = createVector(M.mtx[0][j], M.mtx[1][j]);
	}
	else if(M.mtx.length == 3){
		vec = createVector(M.mtx[0][j], M.mtx[1][j], M.mtx[2][j]);
	}
	else{
		console.log("Matriz incompatível");
		return null;
	}

	return vec;
}

function matrixTransform(M, v){ // Aplica uma transformação M em um vetor P5
	let vec = vecToMatrix(v, M.length); // transforma um vetor P5 numa matriz
	let product = M.multMatrix(vec); // multiplica a mat transformação pelo "vetor"
	let result = matrixToVec(product, 0); // converte o produto de volta a um vetor P5
	return result;
}

function createIdentityMatrix(n){
	let M = [];
	for(let i = 0; i < n; i++){
		let row = [];
		for(let j = 0; j < n; j++){
			if(i == j) row.push(1);
			else row.push(0);
		}
		M.push(row);
	}
	let result = new Matrix(M);
	return result;
}

