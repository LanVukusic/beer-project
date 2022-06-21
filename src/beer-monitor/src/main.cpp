#include <Arduino.h>
#include "ESP8266WiFi.h"
#include "ESP8266WebServer.h"
#include <ESP8266mDNS.h>

const char *wifiName = "nLa";
const char *wifiPass = "tugicamalo";
const char *dnsName = "esp8266";
ESP8266WebServer server(80);

#include <OneWire.h>
#include <DallasTemperature.h>
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void handleRootPath()
{ // Handler for the rooth path
  server.sendHeader("Access-Control-Allow-Origin", "*");

  float temp = sensors.getTempCByIndex(0);

  server.send(200, "text/plain", String(temp));
}

void setup()
{

  Serial.begin(9600);
  WiFi.begin(wifiName, wifiPass); // Connect to the WiFi network

  while (WiFi.status() != WL_CONNECTED)
  { // Wait for connection

    delay(500);
    Serial.print("*");
  }
  Serial.println("");

  if (WiFi.status() == WL_CONNECTED) // If WiFi connected to hot spot then start mDNS
  {
    if (MDNS.begin(dnsName, WiFi.localIP()))
    { // Start mDNS with name esp8266
      Serial.println("MDNS started: " + String(dnsName));
    }
    else
    {
      Serial.println("MDNS failed");
    }
  }

  sensors.begin();

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP()); // Print the local IP

  // server.on("/other", []() { // Define the handling function for the path
  //   server.send(200, "text / plain", "Other URL");

  // });

  MDNS.addService("http", "tcp", 80); // Add the service to the mDNS responder

  server.on("/", handleRootPath); // Associate the handler function to the path
  server.begin();                 // Start the server
  Serial.println("Server listening");
}

void loop()
{
  MDNS.update();
  server.handleClient(); // Handling of incoming requests
  sensors.requestTemperatures();
}
