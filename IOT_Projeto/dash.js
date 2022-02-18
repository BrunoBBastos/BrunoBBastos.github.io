let imagens = ['lampOFF.png','lampON.png'];
let estado = 0;
//chave WRITE do ThingSpeak
var KEY = "2DNH3A62384CBNJZ"; 

function mudar_estado()
{
	estado = Number(!estado);
	document.getElementById("foto_lamp").src = imagens[estado];
	//criar um objeto capaz de enviar dados via requisição HTTP GET
	const http = new XMLHttpRequest();
	http.open("GET", "http://192.168.1.69/toggle")
	http.send()
}