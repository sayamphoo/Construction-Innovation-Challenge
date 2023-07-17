#include <ACROBOTIC_SSD1306.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <Wire.h>

#define BUZZER D8
#define LED D4

// OLED
#define SDA_PIN D6
#define SCL_PIN D5
SoftwareSerial mySerial(D1, D2); // RX, TX

const char *const ssid = "swu_project";
const char *const password = "11111111";

unsigned int pm1 = 0;
unsigned int pm2_5 = 0;
unsigned int pm10 = 0;

unsigned int oldPm1 = 0;
unsigned int oldPm2_5 = 0;
unsigned int oldPm10 = 0;

void airSensor()
{
  int index = 0;
  char value;
  char previousValue;

  while (mySerial.available())
  {
    value = mySerial.read();
    if ((index == 0 && value != 0x42) || (index == 1 && value != 0x4d))
    {
      break;
    }

    if (index == 4 || index == 6 || index == 8 || index == 10 || index == 12 || index == 14)
    {
      previousValue = value;
    }
    else if (index == 5)
    {
      pm1 = 256 * previousValue + value;
    }
    else if (index == 7)
    {
      pm2_5 = 256 * previousValue + value;
    }
    else if (index == 9)
    {
      pm10 = 256 * previousValue + value;
    }
    else if (index > 15)
    {
      break;
    }
    index++;
  }
  while (mySerial.available())
    mySerial.read();
}

// OLED
void showOLED()
{
  oled.setTextXY(3, 0);
  oled.putString("PM1   : ");
  oled.putString(String(pm1).c_str());

  oled.setTextXY(4, 0);
  oled.putString("PM2.5 : ");
  oled.putString(String(pm2_5).c_str());
  oled.setTextXY(5, 0);
  oled.putString("PM10  : ");
  oled.putString(String(pm10).c_str());

  oled.setTextXY(7, 4);
  oled.putString("(gu/m^3)");
}

void clearOLED()
{
  oled.clearDisplay();
}

void buzzer(int num)
{
  switch (num)
  {
    case 0:
      digitalWrite(BUZZER, HIGH);
      delay(100);
      digitalWrite(BUZZER, LOW);
      delay(50);
      digitalWrite(BUZZER, HIGH);
      delay(100);
      break;
    case 1:
      digitalWrite(BUZZER, HIGH);
      delay(200);
      digitalWrite(BUZZER, LOW);
      delay(200);
      digitalWrite(BUZZER, HIGH);
      delay(200);
      break;
    default:
      break;
  }

  digitalWrite(BUZZER, LOW);
}

const char *const SERVICE_URL = "http://34.201.53.199:7700/air-sensor";
void sendData()
{
  DynamicJsonDocument json(1024);
  json["pm1"] = pm1;
  json["pm2_5"] = pm2_5;
  json["pm10"] = pm10;

  String jsonString;
  serializeJson(json, jsonString);

  WiFiClient client;
  HTTPClient http;
  http.begin(client, SERVICE_URL);
  http.addHeader("Content-Type", "application/json");
  http.POST(jsonString);
  delay(3000);
  http.end();
}

void connectionWifi()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    oled.clearDisplay();
    oled.setTextXY(4, 1);
    oled.putString("connecting...");

    while (WiFi.status() != WL_CONNECTED)
    {
      buzzer(1);
    }

    clearOLED();
  }
}

void setup()
{
  pinMode(BUZZER, OUTPUT);
  pinMode(LED, OUTPUT);

  Serial.begin(9600);
  while (!Serial)
    ;
  mySerial.begin(9600);
  // OLED
  Wire.begin(SDA_PIN, SCL_PIN);
  oled.init();
  oled.clearDisplay();

  WiFi.begin(ssid, password);
  oled.setTextXY(4, 1);
  oled.putString("connecting...");
  while (WiFi.status() != WL_CONNECTED)
  {
    digitalWrite(LED, LOW);
    delay(50);
    digitalWrite(LED, HIGH);
    delay(750);
  }

  oled.setTextXY(5, 1);
  oled.putString("succeeded!");

  buzzer(0);
  delay(1500);
  clearOLED();
}

void loop()
{
  airSensor();

  if (pm1 != oldPm1 || pm2_5 != pm2_5 || pm10 != oldPm10)
  {
    showOLED();
    connectionWifi();
    sendData();
    oldPm1 = pm1;
    oldPm2_5 = pm2_5;
    oldPm10 = oldPm10;
  }

  delay(1000);
}
