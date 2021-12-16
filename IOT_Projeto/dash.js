let imagens = ['lampOFF.png','lampON.png'];
let estado = 0;

function mudar_estado()
{
	estado = Number(!estado);
	document.getElementById("foto_lamp").src = imagens[estado];
	sendToServer(estado);
}

function sendToServer(state)
{
	//chave WRITE do ThingSpeak
	var KEY = "2DNH3A62384CBNJZ";  
	//criar um objeto capaz de enviar dados via requisição HTTP GET
	const http = new XMLHttpRequest();
	//prepara um GET passando a váriavel lux como ultimo parâmetro do link
	http.open("GET", "https://api.thingspeak.com/update?api_key="+ KEY +" &field1 =0"+state);

	//envia um GET
	http.send();
	//quando a requisição retornar ele chama o console e imprime o valor gerado
	http.onload = console.log(http.responseText+""+state)
}