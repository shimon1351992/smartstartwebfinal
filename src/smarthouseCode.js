// ==========================================
// 🏡 SMARTHOUSE ESP32 CODE TEMPLATES & MULTI-FILE SUPPORT
// ==========================================

export const SMARTHOUSE_H_CODE = `#ifndef SMARTHOUSE_H
#define SMARTHOUSE_H

#include <Arduino.h>
#include <Wire.h>
#include <LCD_I2C.h>
#include <ESP32Servo.h>
#include <Adafruit_NeoPixel.h>

// 📌 Keyestudio KS5009 Pin Definitions
#define PIN_GAS_SENSOR     23
#define PIN_YELLOW_LED     12
#define PIN_RGB_LED        26
#define PIN_BUZZER         25
#define PIN_BTN_LEFT       16
#define PIN_BTN_RIGHT      27
#define PIN_PIR_MOTION     14
#define PIN_FAN_IN_PLUS    19
#define PIN_FAN_IN_MINUS   18
#define PIN_STEAM_SENSOR   34
#define PIN_WINDOW_SERVO   5
#define PIN_DOOR_SERVO     13
#define PIN_DHT11          17
#define PIN_I2C_SDA        21
#define PIN_I2C_SCL        22

class SmartHouse {
public:
  SmartHouse();
  void begin();

  // Actuators
  void setYellowLED(bool state);
  void setRGBColor(uint8_t r, uint8_t g, uint8_t b);
  void setFanSpeed(int speed);
  void openDoor(int angle = 90);
  void closeDoor();
  void openWindow(int angle = 90);
  void closeWindow();
  void playTone(int freq, int duration = 200);
  void stopTone();

  // Sensors
  int readGas();
  int readSteam();
  bool readMotion();
  bool readLeftButton();
  bool readRightButton();

  // Display
  void printLCD(String line1, String line2);
  void printLCDNumber(int num, String line2);

private:
  Servo _doorServo;
  Servo _winServo;
  Adafruit_NeoPixel _rgb;
  LCD_I2C _lcd;
};

#endif // SMARTHOUSE_H
`;

export const SMARTHOUSE_CPP_CODE = `#include "SmartHouse.h"

SmartHouse::SmartHouse() 
  : _rgb(1, PIN_RGB_LED, NEO_GRB + NEO_KHZ800), _lcd(0x27, 16, 2) {}

void SmartHouse::begin() {
  pinMode(PIN_YELLOW_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_FAN_IN_PLUS, OUTPUT);
  pinMode(PIN_FAN_IN_MINUS, OUTPUT);
  pinMode(PIN_GAS_SENSOR, INPUT);
  pinMode(PIN_PIR_MOTION, INPUT);
  pinMode(PIN_BTN_LEFT, INPUT);
  pinMode(PIN_BTN_RIGHT, INPUT);

  _doorServo.attach(PIN_DOOR_SERVO, 500, 2500);
  _winServo.attach(PIN_WINDOW_SERVO, 500, 2500);
  _doorServo.write(0);
  _winServo.write(0);

  _rgb.begin();
  _rgb.show();

  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  _lcd.begin();
  _lcd.display();
  _lcd.backlight();
  printLCD("Smart Home IoT", "ESP32 Ready!");
}

void SmartHouse::setYellowLED(bool state) {
  digitalWrite(PIN_YELLOW_LED, state ? HIGH : LOW);
}

void SmartHouse::setRGBColor(uint8_t r, uint8_t g, uint8_t b) {
  _rgb.setPixelColor(0, _rgb.Color(r, g, b));
  _rgb.show();
}

void SmartHouse::setFanSpeed(int speed) {
  analogWrite(PIN_FAN_IN_PLUS, constrain(speed, 0, 255));
  digitalWrite(PIN_FAN_IN_MINUS, LOW);
}

void SmartHouse::openDoor(int angle) {
  _doorServo.write(angle);
}

void SmartHouse::closeDoor() {
  _doorServo.write(0);
}

void SmartHouse::openWindow(int angle) {
  _winServo.write(angle);
}

void SmartHouse::closeWindow() {
  _winServo.write(0);
}

void SmartHouse::playTone(int freq, int duration) {
  tone(PIN_BUZZER, freq, duration);
}

void SmartHouse::stopTone() {
  noTone(PIN_BUZZER);
}

int SmartHouse::readGas() {
  return analogRead(PIN_GAS_SENSOR);
}

int SmartHouse::readSteam() {
  return analogRead(PIN_STEAM_SENSOR);
}

bool SmartHouse::readMotion() {
  return digitalRead(PIN_PIR_MOTION) == HIGH;
}

bool SmartHouse::readLeftButton() {
  return digitalRead(PIN_BTN_LEFT) == HIGH;
}

bool SmartHouse::readRightButton() {
  return digitalRead(PIN_BTN_RIGHT) == HIGH;
}

void SmartHouse::printLCD(String line1, String line2) {
  _lcd.clear();
  _lcd.setCursor(0, 0);
  _lcd.print(line1);
  _lcd.setCursor(0, 1);
  _lcd.print(line2);
}

void SmartHouse::printLCDNumber(int num, String line2) {
  _lcd.clear();
  _lcd.setCursor(0, 0);
  _lcd.print(num);
  _lcd.setCursor(0, 1);
  _lcd.print(line2);
}
`;

export const SMARTHOUSE_INO_FULL_CODE = `#include <LCD_I2C.h>
#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <addons/RTDBHelper.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <math.h>

// ==========================================
// 📌 KS5009 ACCURATE HARDWARE PIN MAPPINGS
// ==========================================
const int gasSensorPin = 23;        // חיישן גז ועשן MQ-2 (IO23)
const int yellowLedPin = 12;        // תאורת LED צהובה (IO12)
const int rgbLedPin = 26;           // מודול תאורת RGB סלון (IO26)
const int buzzerPin = 25;           // זמזם פסיבי (IO25)
const int buttonLeftPin = 16;       // לחצן שמאלי (IO16)
const int buttonRightPin = 27;      // לחצן ימני (IO27)
const int motionSensorPin = 14;     // חיישן תנועה PIR (IO14)
const int fanPin19 = 19;            // מאוורר IN+ (IO19)
const int fanPin18 = 18;            // מאוורר IN- (IO18)
const int waterSensorPin = 34;      // חיישן אדים / גשם (IO34)
const int windowServoPin = 5;       // סרוו חלון (IO5)
const int doorServoPin = 13;        // סרוו דלת (IO13)
const int lcdSDA = 21;              // I2C SDA (IO21)
const int lcdSCL = 22;              // I2C SCL (IO22)

// ==========================================
// ⚙️ OBJECTS & SYSTEM VARIABLES
// ==========================================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

LCD_I2C lcd(0x27, 16, 2);
Servo windowServo;
Servo doorServo;

int gassValue = 0;
int yellowLedValue = 0;
int finaldata = 0;
int waterSensorValue = 0;

int code1 = 8;
int code2 = 7;
int code3 = 5;
int code4 = 4;

int code[4] = {0, 0, 0, 0};       // קוד בן 4 ספרות
int currentDigitIndex = 0;         // אינדקס של הספרה הנוכחית
bool codeEntered = false;          // דגל שמסמן אם הקוד הוזן
bool correctCodeEntered = false;   // דגל שמסמן שהקוד הנכון הוזן

// פונקציות להצהרה מוקדמת
void updateLCDPassword();
void resetCodeEntry();
void setdata(String value, String DataLink);
int getdata(String DataLink);
void printLCD(String FirsRwoText, String SecendRowText);
void printLCDINT(int FirsRwoText, String SecendRowText);
void handleButtonPresses(int port1, int port2, int c1, int c2, int c3, int c4);
void display7Values(String label1, int value1, String label2, int value2, String label3, int value3, String label4, int value4);
int getSteamSensorTemperature(int numofPin);
int getGasSensorValue(int gasPin);
int calculateLux(int pinNumber);

// ==========================================
// ⚡ SETUP FUNCTION (פעם אחת בזינוק)
// ==========================================
void setup() {
  Serial.begin(115200);

  pinMode(gasSensorPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(yellowLedPin, OUTPUT);
  pinMode(fanPin19, OUTPUT);
  pinMode(fanPin18, OUTPUT);
  pinMode(motionSensorPin, INPUT);
  pinMode(buttonLeftPin, INPUT);
  pinMode(buttonRightPin, INPUT);

  windowServo.attach(windowServoPin, 500, 2500);
  doorServo.attach(doorServoPin, 500, 2500);
  windowServo.write(0);
  doorServo.write(0);

  Wire.begin(lcdSDA, lcdSCL);
  lcd.begin();
  lcd.display();
  lcd.backlight();
  printLCD("Smart Home IoT", "ESP32 Ready!");
}

// ==========================================
// 🔁 LOOP FUNCTION (בלולאה אינסופית)
// ==========================================
void loop() {
  // 💡 הוסיפו בלוקים או פונקציות ללולאה הראשית
  delay(50);
}

// ==========================================
// 🛠️ SMART HOUSE HELPER FUNCTIONS
// ==========================================

int getSteamSensorTemperature(int numofPin) {
  int sensorValue = analogRead(numofPin);
  sensorValue = constrain(sensorValue, 0, 2000);
  float temperatureCelsius = map(sensorValue, 0, 2000, 0, 100);
  return (int)temperatureCelsius;
}

int getGasSensorValue(int gasPin) {
  int sensorValue = analogRead(gasPin);
  Serial.print("Gas Sensor Value: ");
  Serial.println(sensorValue);
  return sensorValue;
}

int calculateLux(int pinNumber) {
  int sensorValue = analogRead(pinNumber);
  float lux = map(sensorValue, 0, 1023, 0, 1000);
  return int(lux);
}

void printLCD(String FirsRwoText, String SecendRowText) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(FirsRwoText);
  lcd.setCursor(0, 1);
  lcd.print(SecendRowText);
}

void printLCDINT(int FirsRwoText, String SecendRowText) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(FirsRwoText);
  lcd.setCursor(0, 1);
  lcd.print(SecendRowText);
}

int getdata(String DataLink) {
  if (Firebase.getString(fbdo, DataLink)) {
    String data = fbdo.stringData();
    finaldata = data.toInt();
  }
  return finaldata;
}

void setdata(String value, String DataLink) {
  if (Firebase.setString(fbdo, DataLink, value)) {
    Serial.println("Data updated successfully to " + DataLink);
  } else {
    Serial.println("Failed to update data: " + fbdo.errorReason());
  }
}

void updateLCDPassword() {
  lcd.setCursor(0, 0);
  lcd.print("Enter code:     ");
  lcd.setCursor(0, 1);
  for (int i = 0; i < 4; i++) {
    lcd.print(code[i]);
  }
  lcd.setCursor(currentDigitIndex, 1);
}

void handleButtonPresses(int port1, int port2, int c1, int c2, int c3, int c4) {
  bool button1Pressed = digitalRead(port1) == HIGH;
  bool button2Pressed = digitalRead(port2) == HIGH;
  delay(100);

  if (button1Pressed) {
    code[currentDigitIndex]++;
    if (code[currentDigitIndex] > 9) code[currentDigitIndex] = 0;
    updateLCDPassword();
  }

  if (button2Pressed) {
    currentDigitIndex++;
    if (currentDigitIndex >= 4) {
      codeEntered = true;
      if (code[0] == c1 && code[1] == c2 && code[2] == c3 && code[3] == c4) {
        correctCodeEntered = true;
        printLCD("Access Granted!", "Door Opening...");
        doorServo.write(90);
        delay(4000);
        doorServo.write(0);
        resetCodeEntry();
      } else {
        printLCD("Access Denied!", "Try Again");
        tone(buzzerPin, 1000, 500);
        delay(1500);
        resetCodeEntry();
      }
    }
    updateLCDPassword();
  }
}

void resetCodeEntry() {
  codeEntered = false;
  correctCodeEntered = false;
  currentDigitIndex = 0;
  for (int i = 0; i < 4; i++) {
    code[i] = 0;
  }
  lcd.clear();
  lcd.print("Enter code:");
  updateLCDPassword();
}

void display7Values(String label1, int value1,
                    String label2, int value2,
                    String label3, int value3,
                    String label4, int value4) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(label1 + ":" + value1 + " " + label2 + ":" + value2);
  lcd.setCursor(0, 1);
  lcd.print(label4 + ":" + value4 + " " + label3 + ":" + value3);
}
`;

export function mergeSmartHouseBlocks(blockCode, baseTemplate) {
  if (!blockCode || !blockCode.trim()) {
    return baseTemplate || SMARTHOUSE_INO_FULL_CODE;
  }

  const cleanBlockCode = blockCode.trim();

  // Extract Section Markers
  const extractSection = (markerName) => {
    const regex = new RegExp(`// ___BLOCK_${markerName}_START___([\\s\\S]*?)// ___BLOCK_${markerName}_END___`, 'g');
    let matches = [];
    let match;
    while ((match = regex.exec(cleanBlockCode)) !== null) {
      if (match[1] && match[1].trim()) {
        matches.push(match[1].trim());
      }
    }
    return matches.length > 0 ? matches.join('\n') : null;
  };

  const globalsContent = extractSection('GLOBALS');
  const setupContent = extractSection('SETUP');
  const loopContent = extractSection('LOOP');
  const bottomContent = extractSection('BOTTOM');

  const hasMarkers = globalsContent !== null || setupContent !== null || loopContent !== null || bottomContent !== null;

  let finalCode = baseTemplate || SMARTHOUSE_INO_FULL_CODE;

  if (hasMarkers) {
    // 1. Inject Globals (Above void setup)
    if (globalsContent) {
      finalCode = `// 📌 משתנים והגדרות עליונות (מעל setup):\n${globalsContent}\n\n${finalCode}`;
    }

    // 2. Inject Setup (Inside void setup)
    if (setupContent) {
      const setupPattern = /void\s+setup\s*\(\s*\)\s*\{([\s\S]*?)\}/;
      finalCode = finalCode.replace(setupPattern, (match, innerSetup) => {
        const indentedSetup = setupContent.split('\n').map(l => l.trim() ? `  ${l}` : '').join('\n');
        return `void setup() {\n  Serial.begin(115200);\n\n  // Pin modes\n  pinMode(gasSensorPin, INPUT);\n  pinMode(buzzerPin, OUTPUT);\n  pinMode(yellowLedPin, OUTPUT);\n  pinMode(fanPin19, OUTPUT);\n  pinMode(fanPin18, OUTPUT);\n  pinMode(motionSensorPin, INPUT);\n  pinMode(buttonLeftPin, INPUT);\n  pinMode(buttonRightPin, INPUT);\n\n  windowServo.attach(windowServoPin, 500, 2500);\n  doorServo.attach(doorServoPin, 500, 2500);\n  windowServo.write(0);\n  doorServo.write(0);\n\n  Wire.begin(lcdSDA, lcdSCL);\n  lcd.begin();\n  lcd.display();\n  lcd.backlight();\n  printLCD("Smart Home IoT", "ESP32 Ready!");\n\n  // ⚡ קוד מבלוק ה-setup:\n${indentedSetup}\n}`;
      });
    }

    // 3. Inject Loop (Inside void loop)
    if (loopContent) {
      const loopPattern = /void\s+loop\s*\(\s*\)\s*\{([\s\S]*?)\}/;
      finalCode = finalCode.replace(loopPattern, (match, innerLoop) => {
        const indentedLoop = loopContent.split('\n').map(l => l.trim() ? `  ${l}` : '').join('\n');
        return `void loop() {\n  // 🔁 קוד מבלוק ה-loop:\n${indentedLoop}\n}`;
      });
    }

    // 4. Inject Bottom Functions (Below void loop)
    if (bottomContent) {
      finalCode = `${finalCode}\n\n// ⚙️ פונקציות וקוד נוסף (מתחת ל-loop):\n${bottomContent}\n`;
    }

    return finalCode;
  }

  // Fallback: If blocks were dragged without container blocks, inject directly into void loop()
  const loopPattern = /void\s+loop\s*\(\s*\)\s*\{([\s\S]*?)\}/;
  finalCode = finalCode.replace(loopPattern, (match, innerLoop) => {
    const indentedBlocks = cleanBlockCode.split('\n').map(l => l.trim() ? `  ${l}` : '').join('\n');
    return `void loop() {\n  // 🔁 קוד בלוקים:\n${indentedBlocks}\n}`;
  });

  return finalCode;
}
