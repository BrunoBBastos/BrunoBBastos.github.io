/*

*/

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
	let vec = createVector(M[0][0], M[1][0]);
	return vec;
}

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

function determinant(M){ // recursiva para matrizes nxn
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
				det += coeficients[c] * determinant(reducedMatrix) * signal;
			}
		}
		return det;
	}

	function trace(M){
		let sum = 0;
		for(let i = 0; i < M.length; i++){
			sum += M[i][i];
		}
		return sum;
	}

	function eigenvalues(M){
		// Hardcoded formula para M2x2,
		// parece funcionar para outras nxn se resolvida por partes como fiz no algoritmo do det(M)
		// Resolvendo o problema com uma M genérica
		// encontrei que o determinante da (T - λI)
		// tem a forma ad - aλ - dλ + λ^2 - bc
		// (ad-bc) - λ(a + d) + λ^2
		// det(M) - λ(tr(M)) + λ^2
		let lambdas = [];
		let lambdaCoefs = [];
		lambdaCoefs[0] = 1;
		lambdaCoefs[1] = -trace(M);
		lambdaCoefs[2] = determinant(M);
		lambdas = bhaskara(lambdaCoefs);
		return lambdas;
	}

	function cramersRule(ugh){ // Tinha que fazer a piada
		
	}

	function eigenvectors(M){ // Tentando escrever uma forma base que sirva para matrizes maiores
		// Consultar Teorema de Cayley-Hamilton
		let lambdas = [];
		let vecs =[];
		lambdas = eigenvalues(M);
		for(let i = 0 ; i < lambdas.length; i++){ // para cada lambda encontrado
			// if(lambdas[i] isNaN) continue; // Se não for número, sair
			let lambdaI = createIdentityMatrix(M.length); // criar uma matriz lambda * Identidade do tamanho de M
			lambdaI = scalarMult(lambdas[i], lambdaI);
			let MminusL = copyMatrix(M);
			MminusL = addMatrix(M, 1, lambdaI, -1); // Encontrar (M - λI)
			for(let j = 0; j < lambdas.length; j++){ // ADICIONAR: Testar se o lambda corresponde ao v
				if(j == i) continue; // A matriz (M - λiI) vai corresponder a um autovetor diferente
				vecs.push(matrixToVec(MminusL)); // Como as colunas são múltiplas entre si, qqr uma deve servir
			}
		}
		// console.log(lambdas);
		return vecs;
	}

	function copyMatrix(M){
	// Copiar arrays multiníveis com o operador '=' traz todo tipo de problema 
	let rows = M.length;
	let cols = M[0].length;
	let result = [];
	for(let i = 0; i < rows; i++){
		let newRow = [];
		for(let j = 0; j < cols; j++){
			newRow[j] = M[i][j];
		}
		result.push(newRow);
	}
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
	return M;
}

function addMatrix(A, scalarA, B, scalarB){
		if(A.length != B.length || A[0].length != A[0].length){
			console.log("dimensões diferentes");
			return null;
		}

		let result = [];
		for(let i = 0; i < A.length; i++){
			let row = [];
			for(let j = 0; j < A[0].length; j++){
				row[j] = A[i][j] * scalarA + B[i][j] * scalarB;
			}
			result.push(row);
		}
		return result;
}

function scalarMult(scalar, M){
	let result = [];
	for(let i = 0; i < M.length; i++){
		let row = [];
		for(let j = 0; j < M[0].length; j++){
			row[j] = M[i][j] * scalar;
		}
		result.push(row);
	}
	return result;
}