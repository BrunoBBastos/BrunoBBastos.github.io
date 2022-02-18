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
	http.open("GET", "http://192.168.1.60/toggle")
	http.send()

	// const xhttp = new XMLHttpRequest();
	// xhttp.open("GET", "https://api.thingspeak.com/update?api_key=" + KEY + "&field1=0"+estado);
	// xhttp.send();
	// xhttp.onload = console.log(http.responseText+""+estado)
}