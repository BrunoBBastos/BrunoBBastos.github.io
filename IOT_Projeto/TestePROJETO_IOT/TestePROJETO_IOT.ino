#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiManager.h>
#include <ESP8266WiFi.h>    
#include <ThingSpeak.h>

const String VERS = "V2.9";

WiFiServer server(80);
WiFiClient client;

String header;
unsigned long channelID = 1603036;
char* apiKey = "2DNH3A62384CBNJZ";
const char* host = "api.thingspeak.com";
bool post, ready_to_post;

void setup() {
  
  Serial.begin(115200);
  Serial.println("");
  delay(100);

  pinMode(LED_BUILTIN, OUTPUT);
  
  WiFiManager wifiManager;
  wifiManager.autoConnect("Config_ESP");
  ThingSpeak.begin(client);
  server.begin();
}

void loop() {
  internet();

  if(ready_to_post)
  {
    ready_to_post = false;
    Serial.println(writeTSData(channelID, 1, post));
  }
}

void internet()
{
//  WiFiClient client = server.available();   // Atento a clients
  client = server.available();   // Atento a clients

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


int writeTSData(long TSChannel,unsigned int TSField,float data){
  int  writeSuccess = ThingSpeak.writeField(TSChannel, TSField, data, apiKey); //write the data to the channel
  return writeSuccess;
}
