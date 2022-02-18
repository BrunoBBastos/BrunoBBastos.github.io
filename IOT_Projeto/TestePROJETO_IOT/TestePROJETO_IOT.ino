//#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiManager.h>    

#define RELAY 3

const String VERS = "V2.3";

WiFiServer server(80);
WiFiClient poster;
bool doOnce = true;
String page;
String header;
String apiKey = "2DNH3A62384CBNJZ";
const char* host = "api.thingspeak.com";
bool post, ready_to_post;



void setup() {
  
  Serial.begin(115200);
  Serial.println("");
  delay(100);

  pinMode(LED_BUILTIN, OUTPUT);
  
  WiFiManager wifiManager;
  wifiManager.setSTAStaticIPConfig(IPAddress(192,168,1,60), IPAddress(192,168,1,1), IPAddress(255,255,255,0)); // Tentar remover
  wifiManager.autoConnect("Config_ESP");
  server.begin();
}

void loop() {
  internet();
  if(ready_to_post)
  {
    ready_to_post = false;
    postState(post);
  }
}

void internet()
{
  WiFiClient client = server.available();   // Atento a clients

  if (client) {                             // Se um novo client conectar,
    String currentLine = "";                // receber dados enviados pelo client numa String
    while (client.connected()) {            // repetir enquanto conectado
      if (client.available()) {             // se o client enviou bytes,
        char c = client.read();             // ler um byte, e
        header += c;
        if (c == '\n') {                    // se for uma nova linha:
          // se a linha atual estiver vazia, foram recebidas duas novas linhas seguidas         
          // esse é o fim do request HTTP do client, então enviar resposta:
          if (currentLine.length() == 0) {
            // header HTTP sempre começa com código de resposta (exp.: HTTP/1.1 200 OK)
            // e um content-type pro client saber o que está vindo, e então uma linha em branco:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            // mudar o estado do GPIO
            if (header.indexOf("GET /toggle") >= 0) {
              toggleRelay();
            }

            // exibir página htlm
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<title>Interruptor Online</title>");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            // CSS
            client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
            client.println(".button { background-color: #195B6A; border: none; color: white; padding: 16px 40px;");
            client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}</style></head>");

            // Título
            client.println("<body><h1> " + VERS + "</h1>");
            // Botão
            client.println("<p><a href=\"/toggle\"><button class=\"button\">ON / OFF</button></a></p>");
            client.println("</body></html>");

            // A resposta HTTP acaba em outra linha em branco
            client.println();
            // Sair do while
            break;
          } else { // Se receber uma nova linha, limpar a linha em uso
            currentLine = "";
          }
        } else if (c != '\r') {  // Qualquer outra coisa diferente de carriage-return,
          currentLine += c;      // adicionar ao fim da linha
        }
      }
    }
    header = "";
    // Fechar conexão
    client.stop();
  }
}

void toggleRelay()
{
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  ready_to_post = true;
  post = digitalRead(LED_BUILTIN);
 delay(100);
}

//https://api.thingspeak.com/update?api_key=2DNH3A62384CBNJZ&field1=01

//https://api.thingspeak.com/update?api_key=2DNH3A62384CBNJZ&field1=01" // ESSE É o certo




void postState(bool state)
{/*
  HTTPClient http;
  http.begin(poster, host);
   http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  // Data to send with HTTP POST
  String httpRequestData = "api_key=" + apiKey + "&field1=0" + String(state);           
  // Send HTTP POST request
  Serial.println(httpRequestData);
  int httpResponseCode = http.POST(httpRequestData);
  Serial.print("HTTP Response code is: ");
      Serial.println(httpResponseCode);
      http.end();
*/
//Inicia um client TCP para o envio dos dados
  WiFiClient client;
  Serial.println("Cliente conectando");
  if (client.connect(host,80)) {
    Serial.println("conectado");
    String postStr = apiKey;
           postStr +="&amp;field1=0";
           postStr += String(state);
//           postStr +="&amp;field2=";
//           postStr += String(umidade);
           postStr += "\r\n\r\n";
 
     client.print("POST /update HTTP/1.1\n");
     client.print("Host: api.thingspeak.com\n");
     client.print("Connection: close\n");
     client.print("X-THINGSPEAKAPIKEY: "+apiKey+"\n");
     client.print("Content-Type: application/x-www-form-urlencoded\n");
     client.print("Content-Length: ");
     client.print(postStr.length());
     client.print("\n\n");
     client.print(postStr);
 
     //Logs na porta serial
     Serial.print("Relé: ");
     Serial.print(state);
  }
  else
  {
    Serial.println("falha na conexão");
  }
  client.stop();
}
