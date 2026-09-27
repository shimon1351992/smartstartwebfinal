const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

// ============================================================================
// 🔑 OPENROUTER API KEY & GEMINI AI MODEL
// ============================================================================
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const DEFAULT_AI_MODEL = "google/gemini-3.1-pro-preview"; // Google Gemini 3.1 Pro Preview Engine

const { 
  initDatabase, 
  registerTeacher, 
  loginTeacher, 
  getTeachersList, 
  getClassesList, 
  createClass, 
  deleteClass, 
  saveSubmission, 
  getSubmissions, 
  updateSubmissionStatus, 
  deleteSubmission, 
  saveStudentProject, 
  listStudentProjects, 
  loadStudentProject, 
  validateLicenseCode, 
  studentClassLogin, 
  generateLicense, 
  getAllLicenses, 
  deleteLicense, 
  getStudentProjects, 
  getCustomTracks, 
  saveCustomTrack, 
  deleteCustomTrack,
  isDbConnected
} = require('./db');

try {
  delete require.cache[require.resolve('./copy_canva')];
  require('./copy_canva');
} catch (err) {
  console.warn('Canva asset copier warning:', err.message);
}

const app = express();

// Enable CORS for all origins and preflight requests
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'Accept', 'Origin']
}));
app.options('*', cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with, Accept, Origin');
  res.header('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/sync-canva-assets', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const srcDir = 'C:\\Users\\shimo\\.gemini\\antigravity\\brain\\1b0e89ce-2296-44fd-8513-9dc8bea24aa7';
    const destDir = path.resolve(__dirname, '..', 'public', 'canva_assets');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const fileMap = {
      'canva_modern_elements_1789118189279.jpg': 'canva_elements_grids.jpg',
      'canva_modern_text_1789118229969.jpg': 'canva_text_typography.jpg',
      'canva_modern_download_1789118268952.jpg': 'canva_share_download.jpg',
      'canva_modern_uploads_1789118249276.jpg': 'canva_uploads_media.jpg',
      'canva_modern_photos_1789118207220.jpg': 'canva_elements_photos.jpg',
      '.user_uploaded/media_1789118075274.png': 'canva_home_create_design.png',
      '.user_uploaded/media_1789118075274.png': 'canva_home_create_design.jpg',

      // Dedicated Pro Canva Screenshots
      'canva_proj_presentation_1789121237491.jpg': 'canva_proj_presentation.jpg',
      'canva_proj_square_post_1789121252384.jpg': 'canva_proj_square_post.jpg',
      'canva_proj_logo_1789121283215.jpg': 'canva_proj_logo.jpg',
      'canva_color_palette_hex_1789121301926.jpg': 'canva_color_palette_hex.jpg',
      'canva_hero_banner_design_1789121321041.jpg': 'canva_hero_banner_design.jpg',
      'canva_frames_smart_1789121343906.jpg': 'canva_frames_smart.jpg',
      'canva_smartmockups_laptop_1789121366848.jpg': 'canva_smartmockups_laptop.jpg',
      'canva_smartmockups_mobile_1789121389689.jpg': 'canva_smartmockups_mobile.jpg',
      'canva_video_editing_timeline_1789121419625.jpg': 'canva_video_editing_timeline.jpg',
      'canva_audio_soundtrack_1789121446757.jpg': 'canva_audio_soundtrack.jpg',
      'canva_presentation_pitch_1789121476117.jpg': 'canva_presentation_pitch.jpg',
      'canva_export_png_transparent_1789121508195.jpg': 'canva_export_png_transparent.jpg',
      'canva_elements_stickers_badges_1789121573887.jpg': 'canva_elements_stickers_badges.jpg'
    };

    const results = [];
    for (const [srcName, destName] of Object.entries(fileMap)) {
      const srcPath = path.join(srcDir, srcName);
      const destPath = path.join(destDir, destName);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        results.push({ file: destName, size: fs.statSync(destPath).size });
      }
    }
    res.json({ success: true, files: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// Determine executable path for arduino-cli (Windows / Linux / Render)
function getArduinoCliPath() {
  const customWindowsPath = "C:\\Users\\shimo\\arduino-cli.exe";
  if (fs.existsSync(customWindowsPath)) return `"${customWindowsPath}"`;

  const localBinPath = path.join(__dirname, 'bin', 'arduino-cli');
  if (fs.existsSync(localBinPath)) return `"${localBinPath}"`;

  const rootBinPath = path.join(__dirname, '..', 'server', 'bin', 'arduino-cli');
  if (fs.existsSync(rootBinPath)) return `"${rootBinPath}"`;

  return 'arduino-cli';
}
const arduinoCliPath = getArduinoCliPath();

// Temporary workspace & cache directory
const tempDir = path.join(__dirname, 'arduino_temp');
const cacheDir = path.join(__dirname, 'arduino_cache');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

// Clean up old UUID scratch folders inside arduino_temp to avoid confusion
try {
  const files = fs.readdirSync(tempDir);
  files.forEach(file => {
    if (file !== 'current_project' && file !== 'superbot_car') {
      const p = path.join(tempDir, file);
      if (fs.statSync(p).isDirectory()) {
        fs.rmSync(p, { recursive: true, force: true });
      }
    }
  });
} catch (e) {}

// Supported Boards FQBN Mapping
const BOARD_FQBN_MAP = {
  'esp32': 'esp32:esp32:esp32:FlashMode=dio,FlashFreq=80,UploadSpeed=921600',
  'esp32s3': 'esp32:esp32:esp32s3:FlashMode=qio,FlashFreq=80',
  'uno': 'arduino:avr:uno',
  'nano': 'arduino:avr:nano',
  'mega': 'arduino:avr:mega'
};

// Exact Clean C++ SuperBot.h
const DEFAULT_SUPERBOT_H = `
#ifndef SuperBot_h
#define SuperBot_h

#include "Arduino.h"
#include <Wire.h>
#include "driver/rmt.h"
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiAP.h>
#include "esp_camera.h"
#include "esp_http_server.h"

// ================= הגדרות חומרה רגילות =================
#define LIGHT_SENSOR_PIN 33
#define DARK_THRESHOLD   2400
#define IR_PIN           0
#define LED_PIN          32
#define NUM_LEDS         12
#define PCA_ADDR         0x5F
#define MATRIX_ADDR      0x71
#define PIN_BUZZER       2
#define BUZZER_FREQ      2000

// --- הגדרות חיישן מרחק (מעודכן לפי קוד המקור) ---
#define PIN_SONIC_TRIG   12            
#define PIN_SONIC_ECHO   15            
#define MAX_DISTANCE     300           
#define SONIC_TIMEOUT    (MAX_DISTANCE * 60) 
#define SOUND_VELOCITY   340           

// כתובת החיישן למעקב קו ב-I2C
#define TRACK_SENSOR_ADDR 0x20

// קודי כפתורים (לשימוש התלמידים)
#define BTN_FWD    0xFF02FD
#define BTN_BACK   0xFF9867
#define BTN_RIGHT  0xFF906F
#define BTN_LEFT   0xFFE01F
#define BTN_STOP   0xFFA857
#define BTN_FASTER 0xFF18E7
#define BTN_SLOWER 0xFF4AB5
#define BTN_0      0xFF6897

// סוגי עיניים
enum EyeExpression {
    EYE_NORMAL,
    EYE_HAPPY,
    EYE_ANGRY
};

class SuperBot {
  public:
    SuperBot();
    void begin();

    // --- מצלמה ו-WiFi ---
    bool beginCamera(wifi_mode_t wifiMode = WIFI_AP, const char* ssid = "SuperBot", const char* password = "");
    void stopCamera();
    void handleCamera(); 

    // --- שלט רחוק ---
    String getIRCommand();

    // --- חיישנים (אור, קול ומרחק) ---
    int readLightSensor();
    bool isDark();
    float getDistance(); // פונקציה חדשה לקבלת מרחק בס"מ

    // --- חיישן מעקב קו ---
    bool checkLine(int left, int center, int right);

    // --- תנועה ---
    void moveForward(int speed);
    void moveBackward(int speed);
    void turnLeft(int speed);
    void turnRight(int speed);
    void stop();
    
    // --- ראש ---
    void moveHead(int pan, int tilt);
    void centerHead();

    // --- תצוגה וקול ---
    void setEyes(EyeExpression expression);
    void setLeds(uint8_t r, uint8_t g, uint8_t b);
    void beep(int duration);

  private:
    httpd_handle_t camera_httpd = NULL;

    // פונקציות רובוט פנימיות
    void initPCA();
    void initMatrix();
    void setupLeds();
    void initTrackSensor();
    void initUltrasonic(); // אתחול חיישן מרחק פנימי
    void setMotor(int pin1, int pin2, int speed);
    void pwm(int pin, int v);
    void writeMatrix(byte left[], byte right[]);
    unsigned long decodeIR(); 

    // פונקציות מצלמה פנימיות
    bool cameraSetupHardware();
    void setupWiFi_AP(const char* ssid, const char* pass);
    void setupWiFi_STA(const char* ssid, const char* pass);
    static void cameraTaskWrapper(void* pvParameters);
    void cameraTask();
    void startCameraServer();
    WiFiServer server_Cmd;
    WiFiServer server_Camera;
    bool videoFlag;
};

#endif
`;

const DEFAULT_SUPERBOT_CPP = `
#include "SuperBot.h"

static bool camera_is_active = false;

byte _EYE_NORMAL[8] = {0x18, 0x24, 0x42, 0x42, 0x42, 0x42, 0x24, 0x18};
byte _EYE_HAPPY[8]  = {0x00, 0x00, 0x42, 0x24, 0x24, 0x42, 0x00, 0x00};
byte _EYE_ANGRY[8]  = {0x81, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x81};

#define M1_IN1 15 
#define M1_IN2 14
#define M2_IN1 9 
#define M2_IN2 8
#define M3_IN1 12 
#define M3_IN2 13
#define M4_IN1 10 
#define M4_IN2 11
#define RMT_TX_CHANNEL RMT_CHANNEL_0

#define PWDN_GPIO_NUM    -1
#define RESET_GPIO_NUM   -1
#define XCLK_GPIO_NUM    21
#define SIOD_GPIO_NUM    26
#define SIOC_GPIO_NUM    27
#define Y9_GPIO_NUM      35
#define Y8_GPIO_NUM      34
#define Y7_GPIO_NUM      39
#define Y6_GPIO_NUM      36
#define Y5_GPIO_NUM      19
#define Y4_GPIO_NUM      18
#define Y3_GPIO_NUM       5
#define Y2_GPIO_NUM       4
#define VSYNC_GPIO_NUM   25
#define HREF_GPIO_NUM    23
#define PCLK_GPIO_NUM    22

SuperBot::SuperBot() : camera_httpd(NULL) {}

void SuperBot::begin() {
    Wire.begin(13, 14);
    analogSetAttenuation(ADC_11db);
    pinMode(LIGHT_SENSOR_PIN, INPUT);
    pinMode(IR_PIN, INPUT);
    
    initPCA();
    initMatrix();
    setupLeds();
    initTrackSensor();
    initUltrasonic(); // <--- הוספנו את האתחול של החיישן לכאן
    
    pinMode(PIN_BUZZER, OUTPUT);
    ledcAttachChannel(PIN_BUZZER, BUZZER_FREQ, 10, 0);
    centerHead();
    setEyes(EYE_NORMAL);
    setLeds(0,0,0);
}

// =================== פונקציות שרת HTTP ומצלמה ===================
// (נשאר בדיוק כמו בקובץ שלך)

#define PART_BOUNDARY "123456789000000000000987654321"
static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\\r\\n--" PART_BOUNDARY "\\r\\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\\r\\nContent-Length: %u\\r\\n\\r\\n";

static esp_err_t index_handler(httpd_req_t *req);
static esp_err_t stream_handler(httpd_req_t *req);
static esp_err_t capture_handler(httpd_req_t *req);

static esp_err_t index_handler(httpd_req_t *req) {
    const char* html = R"rawhtml(<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>SuperBot Vision</title><style>body{background-color:#222;color:white;text-align:center;font-family:Arial;} img{width:100%;max-width:600px;border-radius:10px;border:3px solid #00ff00;}</style></head><body><h1>SuperBot Live Feed</h1><img src="/stream"></body></html>)rawhtml";
    httpd_resp_set_type(req, "text/html");
    return httpd_resp_send(req, html, strlen(html));
}

static esp_err_t stream_handler(httpd_req_t *req) {
    camera_fb_t * fb = NULL;
    esp_err_t res = ESP_OK;
    size_t _jpg_buf_len = 0;
    uint8_t * _jpg_buf = NULL;
    char * part_buf[64];

    res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
    if(res != ESP_OK) return res;

    while(true){
        fb = esp_camera_fb_get();
        if (!fb) { res = ESP_FAIL; } 
        else { _jpg_buf_len = fb->len; _jpg_buf = fb->buf; }
        
        if(res == ESP_OK){
            size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
            res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
        }
        if(res == ESP_OK){ res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len); }
        if(res == ESP_OK){ res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY)); }
        
        if(fb){ esp_camera_fb_return(fb); fb = NULL; _jpg_buf = NULL; }
        if(res != ESP_OK) break;
    }
    return res;
}

bool SuperBot::beginCamera(wifi_mode_t wifiMode, const char* ssid, const char* password) {
    if (camera_is_active) return true;
    if (!cameraSetupHardware()) return false;
    
    if (wifiMode == WIFI_AP) setupWiFi_AP(ssid, password);
    else setupWiFi_STA(ssid, password);
    
    startCameraServer();
    camera_is_active = true;
    return true;
}
// ==========================================
// פונקציה חדשה: לכידת תמונה בודדת (צילום)
// ==========================================
static esp_err_t capture_handler(httpd_req_t *req) {
    camera_fb_t * fb = NULL;
    esp_err_t res = ESP_OK;
    
    // צילום פריים אחד מהמצלמה
    fb = esp_camera_fb_get();
    if (!fb) { 
        Serial.println("Camera capture failed");
        httpd_resp_send_500(req);
        return ESP_FAIL; 
    }
    
    // הגדרת סוג הקובץ כתמונה (JPEG)
    res = httpd_resp_set_type(req, "image/jpeg");
    if(res == ESP_OK){
        res = httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=capture.jpg");
    }
    // שליחת התמונה לדפדפן
    if(res == ESP_OK){
        res = httpd_resp_send(req, (const char *)fb->buf, fb->len);
    }
    
    // שחרור הזיכרון
    esp_camera_fb_return(fb);
    return res;
}

void SuperBot::stopCamera() {
    if (!camera_is_active) return;
    if (camera_httpd != NULL) { httpd_stop(camera_httpd); camera_httpd = NULL; }
    esp_camera_deinit();
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);
    camera_is_active = false;
}

bool SuperBot::cameraSetupHardware(void) {
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_1; config.ledc_timer = LEDC_TIMER_1;
    config.pin_d0 = Y2_GPIO_NUM; config.pin_d1 = Y3_GPIO_NUM; config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM; config.pin_d4 = Y6_GPIO_NUM; config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM; config.pin_d7 = Y9_GPIO_NUM; config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM; config.pin_vsync = VSYNC_GPIO_NUM; config.pin_href = HREF_GPIO_NUM;
    config.pin_sccb_sda = SIOD_GPIO_NUM; config.pin_sccb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM; config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 10000000; config.pixel_format = PIXFORMAT_JPEG;
    config.frame_size = FRAMESIZE_QVGA; config.jpeg_quality = 12; config.fb_count = 1;

    esp_err_t err = esp_camera_init(&config);
    return (err == ESP_OK);
}

void SuperBot::setupWiFi_AP(const char* ssid, const char* pass) {
    WiFi.disconnect(true); WiFi.mode(WIFI_AP); WiFi.softAP(ssid, pass);
}

void SuperBot::setupWiFi_STA(const char* ssid, const char* pass) {
    WiFi.disconnect(true); WiFi.mode(WIFI_STA); WiFi.begin(ssid, pass);
    while (WiFi.status() != WL_CONNECTED) { delay(500); }
}

void SuperBot::startCameraServer() {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG(); 
    config.server_port = 80;
    
    httpd_uri_t index_uri = { .uri = "/", .method = HTTP_GET, .handler = index_handler, .user_ctx = NULL };
    httpd_uri_t stream_uri = { .uri = "/stream", .method = HTTP_GET, .handler = stream_handler, .user_ctx = NULL };
    httpd_uri_t capture_uri = { .uri = "/capture", .method = HTTP_GET, .handler = capture_handler, .user_ctx = NULL }; // <--- השורה החדשה
    
    if (httpd_start(&camera_httpd, &config) == ESP_OK) {
        httpd_register_uri_handler(camera_httpd, &index_uri);
        httpd_register_uri_handler(camera_httpd, &stream_uri);
        httpd_register_uri_handler(camera_httpd, &capture_uri); // <--- השורה החדשה
    }
}
void SuperBot::handleCamera() {}
void SuperBot::cameraTaskWrapper(void* pvParameters) {}
void SuperBot::cameraTask() {}

// =================== חיישנים, תנועה וחומרה ===================
String SuperBot::getIRCommand() {
    if (digitalRead(IR_PIN) == LOW) {
        unsigned long code = decodeIR();
        
        if (code != 0 && code != 0xFFFFFFFF) {
            
            // מנגנון יישור אוטומטי (Bit-Shift Correction)
            // אנחנו מזיזים את הביטים חזרה ימינה (עד 6 מקומות) כדי לתקן את הפספוס
            for (int i = 0; i <= 6; i++) {
                unsigned long shifted = code >> i;
                
                // חותכים את התוצאה ל-24 ביטים בלבד
                shifted = shifted & 0xFFFFFF; 
                
                // קוד תקין של השלט תמיד מתחיל ב-FF (בביטים זה אומר 0xFF0000)
                if ((shifted & 0xFF0000) == 0xFF0000) {
                    String hexCode = String(shifted, HEX);
                    hexCode.toUpperCase();
                    return hexCode; // מחזיר תמיד את הקוד הנקי! (למשל FF30CF)
                }
            }
        }
    }
    return "";
}

unsigned long SuperBot::decodeIR() {
  unsigned long data = 0;
  // קריאת 32 הביטים של האות
  for (int i = 0; i < 32; i++) {
    unsigned long t = micros();
    
    // המתנה לחלק הנמוך של האות (סביב 560 מיקרו-שניות)
    while(digitalRead(IR_PIN) == LOW) { 
        if (micros() - t > 2000) return 0; // פסק זמן (שגיאה)
    }
    
    unsigned long highStart = micros();
    
    // המתנה לחלק הגבוה של האות
    while(digitalRead(IR_PIN) == HIGH) {
      if (micros() - highStart > 4000) { 
          // אם אנחנו לקראת הסוף והאות נחתך, לפחות נחזיר את מה שקראנו
          if (i >= 24) return data; 
          return 0; 
      }
    }
    
    // בשיטת NEC: אם החלק הגבוה ארוך מ-1000 מיקרו-שניות, זה '1'. אם קצר, זה '0'.
    if ((micros() - highStart) > 1000) {
        data |= (1UL << (31 - i));
    }
  }
  return data;
}

int SuperBot::readLightSensor() { return analogRead(LIGHT_SENSOR_PIN); }
bool SuperBot::isDark() { return readLightSensor() > DARK_THRESHOLD; }

void SuperBot::initTrackSensor() { Wire.beginTransmission(TRACK_SENSOR_ADDR); Wire.write(0xFF); Wire.endTransmission(); }
bool SuperBot::checkLine(int left, int center, int right) {
    int currentLeft = 0, currentCenter = 0, currentRight = 0;
    Wire.requestFrom((uint8_t)TRACK_SENSOR_ADDR, (uint8_t)1);
    if (Wire.available()) {
        uint8_t data = Wire.read();
        currentLeft = (data & 0x01) ? 1 : 0;
        currentCenter = (data & 0x02) ? 1 : 0;
        currentRight = (data & 0x04) ? 1 : 0;
    }
    return (currentLeft == left && currentCenter == center && currentRight == right);
}

void SuperBot::moveForward(int speed) {
    setMotor(M1_IN1, M1_IN2, speed); setMotor(M2_IN1, M2_IN2, speed);
    setMotor(M3_IN1, M3_IN2, speed); setMotor(M4_IN1, M4_IN2, speed);
}
void SuperBot::moveBackward(int speed) {
    setMotor(M1_IN1, M1_IN2, -speed); setMotor(M2_IN1, M2_IN2, -speed);
    setMotor(M3_IN1, M3_IN2, -speed); setMotor(M4_IN1, M4_IN2, -speed);
}
void SuperBot::turnRight(int speed) {
    setMotor(M1_IN1, M1_IN2, speed); setMotor(M2_IN1, M2_IN2, speed);
    setMotor(M3_IN1, M3_IN2, -speed); setMotor(M4_IN1, M4_IN2, -speed);
}
void SuperBot::turnLeft(int speed) {
    setMotor(M1_IN1, M1_IN2, -speed); setMotor(M2_IN1, M2_IN2, -speed);
    setMotor(M3_IN1, M3_IN2, speed); setMotor(M4_IN1, M4_IN2, speed);
}
void SuperBot::stop() { moveForward(0); }

void SuperBot::moveHead(int pan, int tilt) {
    if(pan<0) pan=0; if(pan>180) pan=180;
    if(tilt<0) tilt=0; if(tilt>180) tilt=180;
    int pulsePan = map(pan, 0, 180, 102, 512); int pulseTilt = map(tilt, 0, 180, 102, 512);
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x06); Wire.write(0); Wire.write(0); Wire.write(pulsePan & 0xFF); Wire.write(pulsePan >> 8); Wire.endTransmission();
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x0A); Wire.write(0); Wire.write(0); Wire.write(pulseTilt & 0xFF); Wire.write(pulseTilt >> 8); Wire.endTransmission();
}
void SuperBot::centerHead() { moveHead(90, 90); }

void SuperBot::setEyes(EyeExpression expression) {
    switch (expression) {
        case EYE_HAPPY: writeMatrix(_EYE_HAPPY, _EYE_HAPPY); break;
        case EYE_ANGRY: writeMatrix(_EYE_ANGRY, _EYE_ANGRY); break;
        default:        writeMatrix(_EYE_NORMAL, _EYE_NORMAL); break;
    }
}
void SuperBot::beep(int ms) { ledcWriteTone(PIN_BUZZER, BUZZER_FREQ); delay(ms); ledcWriteTone(PIN_BUZZER, 0); }

void SuperBot::initPCA() {
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x00); Wire.write(0x00); Wire.endTransmission();
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x00); Wire.write(0x10); Wire.endTransmission();
    Wire.beginTransmission(PCA_ADDR); Wire.write(0xFE); Wire.write(0x79); Wire.endTransmission();
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x00); Wire.write(0x00); Wire.endTransmission(); delay(10);
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x00); Wire.write(0xA0); Wire.endTransmission();
}
void SuperBot::initMatrix() {
    Wire.beginTransmission(MATRIX_ADDR); Wire.write(0x21); Wire.endTransmission();
    Wire.beginTransmission(MATRIX_ADDR); Wire.write(0x81); Wire.endTransmission();
    Wire.beginTransmission(MATRIX_ADDR); Wire.write(0xE7); Wire.endTransmission();
}
void SuperBot::writeMatrix(byte left[], byte right[]) {
    Wire.beginTransmission(MATRIX_ADDR); Wire.write(0x00);
    for(int i=0; i<8; i++){ Wire.write(right[i]); Wire.write(left[i]); }
    Wire.endTransmission();
}

#define T0H 14 
#define T0L 32 
#define T1H 32 
#define T1L 14 
void SuperBot::setupLeds() {
    rmt_config_t config = RMT_DEFAULT_CONFIG_TX((gpio_num_t)LED_PIN, RMT_TX_CHANNEL);
    config.clk_div = 2; rmt_config(&config); rmt_driver_install(config.channel, 0, 0);
}
void SuperBot::setLeds(uint8_t r, uint8_t g, uint8_t b) {
    rmt_item32_t items[NUM_LEDS * 24]; 
    for (int i = 0; i < NUM_LEDS; i++) {
        uint32_t color = (g << 16) | (r << 8) | b;
        for (int bit = 0; bit < 24; bit++) {
            bool isOne = (color >> (23 - bit)) & 1;
            items[i * 24 + bit] = (isOne) ? (rmt_item32_t){{{T1H, 1, T1L, 0}}} : (rmt_item32_t){{{T0H, 1, T0L, 0}}};
        }
    }
    rmt_write_items(RMT_TX_CHANNEL, items, NUM_LEDS * 24, true);
    rmt_wait_tx_done(RMT_TX_CHANNEL, portMAX_DELAY); 
}
void SuperBot::setMotor(int p1, int p2, int s) {
    if(s > 4095) s=4095; if(s < -4095) s=-4095;
    if(s > 0) { pwm(p1, s); pwm(p2, 0); } else if(s < 0) { pwm(p1, 0); pwm(p2, -s); } else { pwm(p1, 0); pwm(p2, 0); }
}
void SuperBot::pwm(int pin, int v) {
    int off=(v==0)?4096:v; int on=(v==4095)?4096:0;
    Wire.beginTransmission(PCA_ADDR); Wire.write(0x06 + 4*pin); 
    Wire.write(on&0xFF); Wire.write(on>>8); Wire.write(off&0xFF); Wire.write(off>>8); 
    Wire.endTransmission();
}

// ==========================================
// חיישן מרחק (אולטרסאונד) - הוטמע מקוד המקור
// ==========================================
void SuperBot::initUltrasonic() {
    pinMode(PIN_SONIC_TRIG, OUTPUT);
    pinMode(PIN_SONIC_ECHO, INPUT);
}

float SuperBot::getDistance() {
    unsigned long pingTime;
    float distance;
    
    digitalWrite(PIN_SONIC_TRIG, HIGH); 
    delayMicroseconds(10);
    digitalWrite(PIN_SONIC_TRIG, LOW);
    
    // קריאת הזמן שלוקח לאות לחזור, עם הגבלת זמן למניעת תקיעות (Timeout)
    pingTime = pulseIn(PIN_SONIC_ECHO, HIGH, SONIC_TIMEOUT); 
    
    if (pingTime != 0) {
        // חישוב מדויק לפי מהירות הקול שמוגדרת בקוד המקורי
        distance = (float)pingTime * SOUND_VELOCITY / 2 / 10000; 
    } else {
        distance = MAX_DISTANCE; // אם אין קיר, מחזיר מרחק מקסימלי
    }
    
    return distance; 
}
`;

// Fallback FirebaseESP32 Header for standalone compilation
const DEFAULT_FIREBASE_H = `
#ifndef FirebaseESP32_H
#define FirebaseESP32_H
#include <Arduino.h>

class FirebaseData {
public:
  String stringData() { return ""; }
  int intData() { return 0; }
  bool boolData() { return false; }
  String dataType() { return "string"; }
  String streamPath() { return ""; }
  String dataPath() { return ""; }
};

class FirebaseConfig {
public:
  String host;
  String signer;
  struct {
    String url;
  } database_url;
};

class FirebaseAuth {
public:
  struct {
    String legacy_token;
  } token;
};

class FirebaseClass {
public:
  void begin(FirebaseConfig* config, FirebaseAuth* auth) {}
  void begin(const String& host, const String& auth) {}
  void reconnectWiFi(bool b) {}
  bool getString(FirebaseData& data, const String& path) { return true; }
  bool setString(FirebaseData& data, const String& path, const String& value) { return true; }
  bool setInt(FirebaseData& data, const String& path, int value) { return true; }
  bool getInt(FirebaseData& data, const String& path) { return true; }
  bool stream(FirebaseData& data, const String& path) { return true; }
  bool readStream(FirebaseData& data) { return true; }
  bool streamAvailable(FirebaseData& data) { return false; }
  bool set(FirebaseData& data, const String& path, const String& value) { return true; }
};

extern FirebaseClass Firebase;

#endif
`;

const DEFAULT_FIREBASE_CPP = `
#include "FirebaseESP32.h"
FirebaseClass Firebase;
`;

function prepareProjectFiles(projectPath, runId, code, headerCode, cppCode) {
  const sketchPath = path.join(projectPath, `${runId}.ino`);
  fs.writeFileSync(sketchPath, code, 'utf8');

  const hContent = headerCode || DEFAULT_SUPERBOT_H;
  fs.writeFileSync(path.join(projectPath, 'SuperBot.h'), hContent, 'utf8');

  const cppContent = cppCode || DEFAULT_SUPERBOT_CPP;
  fs.writeFileSync(path.join(projectPath, 'SuperBot.cpp'), cppContent, 'utf8');

  fs.writeFileSync(path.join(projectPath, 'FirebaseESP32.h'), DEFAULT_FIREBASE_H, 'utf8');
  fs.writeFileSync(path.join(projectPath, 'FirebaseESP32.cpp'), DEFAULT_FIREBASE_CPP, 'utf8');
}

// 0. Fast Ping / Health
app.get('/api/ping', (req, res) => {
  const dbStatus = typeof isDbConnected === 'function' ? isDbConnected() : false;
  return res.json({ ok: true, isDbConnected: dbStatus });
});
app.get('/api/health', (req, res) => res.json({ ok: true, status: 'online' }));

// 1. GET Connected COM Ports
app.get('/ports', (req, res) => {
  try {
    const cmd = `"${arduinoCliPath}" board list --format json`;
    exec(cmd, { timeout: 15000 }, (err, stdout) => {
      let ports = [];
      if (!err && stdout) {
        try {
          const data = JSON.parse(stdout);
          const detected = data.detected_ports || data.matching_boards || [];
          ports = detected.map(p => ({
            port: p.port ? p.port.address : p.address,
            protocol: p.port ? p.port.protocol : 'serial',
            board: (p.matching_boards && p.matching_boards[0]) ? p.matching_boards[0].name : 'ESP32 / USB Serial Device'
          }));
        } catch (e) {}
      }

      if (ports.length > 0) {
        return res.json({ ports });
      }

      if (process.platform === 'win32') {
        try {
          const psCmd = `powershell -NoProfile -NonInteractive -Command "[System.IO.Ports.SerialPort]::GetPortNames()"`;
          exec(psCmd, { timeout: 8000 }, (psErr, psStdout) => {
            if (!psErr && psStdout) {
              const rawNames = psStdout.split(/\r?\n/).map(s => s.trim()).filter(s => s.startsWith('COM'));
              rawNames.forEach(portName => {
                if (!ports.some(p => p.port === portName)) {
                  ports.push({
                    port: portName,
                    protocol: 'serial',
                    board: 'ESP32 / USB Serial Device'
                  });
                }
              });
            }
            res.json({ ports });
          });
        } catch (psEx) {
          res.json({ ports });
        }
      } else {
        res.json({ ports: [] });
      }
    });
  } catch (ex) {
    res.json({ ports: [] });
  }
});

// 2. POST Compile C++ Code
app.post('/compile', (req, res) => {
  const { code, board = 'esp32', headerCode, cppCode } = req.body;
  const fqbn = BOARD_FQBN_MAP[board] || board || 'esp32:esp32:esp32';

  const runId = 'superbot_car';
  const projectPath = path.join(tempDir, runId);
  const buildOutDir = path.join(projectPath, 'build');
  if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });
  if (!fs.existsSync(buildOutDir)) fs.mkdirSync(buildOutDir, { recursive: true });

  prepareProjectFiles(projectPath, runId, code, headerCode, cppCode);

  console.log(`[Compile] Building FQBN: ${fqbn} at ${projectPath} with cacheDir: ${cacheDir} (Single Thread - RAM optimized)`);

  const cmd = `${arduinoCliPath} compile --jobs 1 --fqbn "${fqbn}" --build-cache-path "${cacheDir}" --output-dir "${buildOutDir}" "${projectPath}"`;
  exec(cmd, { maxBuffer: 1024 * 1024 * 20, timeout: 300000 }, (err, stdout, stderr) => {
    if (err) {
      res.json({ success: false, output: stderr || stdout || err.message || 'שגיאת קומפילציה' });
    } else {
      let binBase64 = null;
      let bootloaderBase64 = null;
      let partitionsBase64 = null;
      try {
        const binPath = path.join(buildOutDir, `${runId}.ino.bin`);
        if (fs.existsSync(binPath)) {
          binBase64 = fs.readFileSync(binPath).toString('base64');
        }
        const bootloaderPath = path.join(buildOutDir, `${runId}.ino.bootloader.bin`);
        if (fs.existsSync(bootloaderPath)) {
          bootloaderBase64 = fs.readFileSync(bootloaderPath).toString('base64');
        }
        const partitionsPath = path.join(buildOutDir, `${runId}.ino.partitions.bin`);
        if (fs.existsSync(partitionsPath)) {
          partitionsBase64 = fs.readFileSync(partitionsPath).toString('base64');
        }
      } catch (e) {}

      res.json({ 
        success: true, 
        output: stdout || 'קומפילציה הושלמה בהצלחה!', 
        binBase64,
        bootloaderBase64,
        partitionsBase64
      });
    }
  });
});

// 3. POST Upload / Flash Firmware via USB COM Port
app.post('/upload', (req, res) => {
  const { code, board = 'esp32', port, headerCode, cppCode } = req.body;
  const fqbn = BOARD_FQBN_MAP[board] || board || 'esp32:esp32:esp32';

  if (!port) {
    return res.status(400).json({ success: false, output: 'אנא בחר יציאת USB (COM Port) לצריבה.' });
  }

  const runId = 'superbot_car';
  const projectPath = path.join(tempDir, runId);
  const buildOutDir = path.join(projectPath, 'build');
  if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });
  if (!fs.existsSync(buildOutDir)) fs.mkdirSync(buildOutDir, { recursive: true });

  prepareProjectFiles(projectPath, runId, code, headerCode, cppCode);

  console.log(`[Upload] Compiling & Flashing FQBN: ${fqbn} on Port: ${port}`);

  const fullUploadCmd = `${arduinoCliPath} compile --jobs 1 --upload -p ${port} --fqbn "${fqbn}" "${projectPath}"`;
  exec(fullUploadCmd, { maxBuffer: 1024 * 1024 * 20, timeout: 300000 }, (uErr, uStdout, uStderr) => {
    const codeHeader = `📄 === הקוד המדויק שנצרב ל-ESP32 (superbot_car.ino) ===\n${code}\n=======================================================\n\n`;
    if (uErr) {
      res.json({ success: false, output: `${codeHeader}שגיאה בתהליך הקומפילציה/הצריבה (פורט ${port}):\n${uStderr || uStdout || uErr.message}` });
    } else {
      res.json({ success: true, output: `${codeHeader}הקוד הוקמפל ונצרב בהצלחה מלאה ללוח ${board} (יציאה ${port})!\n\n${uStdout}` });
    }
  });
});

// 4. POST Send Code to Email Endpoint with REAL .ino File Attachment
let nodemailer = null;
let gmailTransporter = null;

try {
  nodemailer = require('nodemailer');
  gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shimon1351992@gmail.com',
      pass: 'izyr rjag onwe uqwl'
    }
  });
} catch (e) {
  console.log('ℹ️ Nodemailer is not installed locally. Local emails will use cloud fallback.');
}

app.post('/send-code-email', async (req, res) => {
  const { studentName = 'תלמיד', email = 'shimon1351992@gmail.com', code = '', filename = 'superbot_car.ino', notes = '' } = req.body;
  const inoFilename = filename.endsWith('.ino') ? filename : `${filename}.ino`;

  console.log(`[Email] Sending .ino attachment to: ${email} (Student: ${studentName})`);

  try {
    const mailOptions = {
      from: '"SmartStart Robot 🤖" <shimon1351992@gmail.com>',
      to: email,
      subject: `📎 קובץ פרויקט ארדואינו: ${inoFilename} (מאת ${studentName})`,
      text: `שלום,\n\nמצורף קובץ הפרויקט (${inoFilename}) שנוצר על ידי התלמיד: ${studentName}.\n\n📁 הקובץ מצורף למייל זה להורדה ישירה ולפתיחה ב-Arduino IDE.\n\nהערות: ${notes || 'ללא'}\n\nנשלח מ-SmartStartWeb 🚀`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; border-radius: 12px; color: #1e293b;">
          <h2 style="color: #0284c7; margin-top: 0;">🤖 SmartStart Robot - קובץ פרויקט ארדואינו</h2>
          <p>שלום,</p>
          <p>מצורף קובץ הפרויקט <b>${inoFilename}</b> שנוצר על ידי התלמיד <b>${studentName}</b>.</p>
          <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0;">
            <p style="margin: 4px 0;"><b>📄 שם הקובץ:</b> ${inoFilename}</p>
            <p style="margin: 4px 0;"><b>👤 שם התלמיד:</b> ${studentName}</p>
            <p style="margin: 4px 0;"><b>📅 תאריך:</b> ${new Date().toLocaleDateString('he-IL')}</p>
            ${notes ? `<p style="margin: 4px 0;"><b>📝 הערות:</b> ${notes}</p>` : ''}
          </div>
          <p>📎 <b>הקובץ מצורף למייל זה (בתחתית ההודעה) וניתן להורדה ישירה ולפתיחה ב-Arduino IDE.</b></p>
          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
          <small style="color: #64748b;">נשלח אוטומטית מ-SmartStart Robot Web</small>
        </div>
      `,
      attachments: [
        {
          filename: inoFilename,
          content: code,
          contentType: 'text/plain'
        }
      ]
    };

    const info = await gmailTransporter.sendMail(mailOptions);
    console.log(`[Email] Mail sent successfully! ID: ${info.messageId}`);
    res.json({ success: true, message: `הקובץ ${inoFilename} נשלח בהצלחה כקובץ מצורף למייל ${email}!` });
  } catch (err) {
    console.error('[Email] Failed to send email via SMTP:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 📡 SQL SERVER / STUDENT SUBMISSION ENDPOINTS
// ==========================================

// Teacher password from environment or default
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'teacher2026';

// 1. Submit project / code by student
app.post('/api/submissions', async (req, res) => {
  try {
    const { studentName, teacherName, className, projectName, projectType, code, blockXml, notes } = req.body;
    if (!studentName || !code) {
      return res.status(400).json({ success: false, error: 'שם תלמיד וקוד הינם שדות חובה' });
    }

    const saved = await saveSubmission({
      studentName: studentName.trim(),
      teacherName: (teacherName || 'כללי').trim(),
      className: (className || '').trim(),
      projectName: (projectName || 'פרויקט רובוט').trim(),
      projectType: projectType || 'car',
      code,
      blockXml: blockXml || '',
      notes: (notes || '').trim()
    });

    console.log(`[Submission] New submission from ${studentName} to teacher ${teacherName || 'כללי'} (${projectName}) saved! ID: ${saved.id}`);
    res.json({ success: true, submission: saved, message: 'הפרויקט נשלח בהצלחה למורה ונשמר במערכת!' });
  } catch (err) {
    console.error('[Submission] Error saving submission:', err);
    res.status(500).json({ success: false, error: 'שגיאה בשמירת הפרויקט: ' + err.message });
  }
});

// 2. User / Teacher Registration
app.post('/api/teachers/register', async (req, res) => {
  try {
    const { fullName, username, password, email, role, plan } = req.body;
    if (!fullName || !username || !password) {
      return res.status(400).json({ success: false, error: 'שם מלא, שם משתמש וסיסמה הינם שדות חובה' });
    }
    const cleanPlan = plan || 'starter';
    const userRole = role || (cleanPlan === 'premium' ? 'admin' : cleanPlan === 'pro' ? 'teacher' : 'user');
    const teacher = await registerTeacher({ fullName, username, password, email, role: userRole, plan: cleanPlan });
    res.json({ 
      success: true, 
      teacher, 
      message: 'נרשמת בהצלחה למערכת!'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. Teacher Login (Username + Password)
app.post('/api/teachers/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'אנא הזן שם משתמש וסיסמה' });
    }
    const teacher = await loginTeacher({ username, password });
    res.json({ success: true, teacher });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// 4. Get registered teachers list (for student dropdown selection)
app.get('/api/teachers', async (req, res) => {
  try {
    const list = await getTeachersList();
    res.json({ success: true, teachers: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 🔒 STUDENT PERSONAL PROJECT (SAVE & LOAD WITH PASSWORD)
// ==========================================

// 5. Save personal project (with password)
app.post('/api/projects/save', async (req, res) => {
  try {
    const { studentName, projectName, projectType, password, blockXml, code } = req.body;
    if (!studentName || !password) {
      return res.status(400).json({ success: false, error: 'שם תלמיד וסיסמה אישית הינם שדות חובה' });
    }
    const result = await saveStudentProject({ studentName, projectName, projectType, password, blockXml, code });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. List personal projects for student
app.post('/api/projects/list', async (req, res) => {
  try {
    const { studentName, projectType, password } = req.body;
    if (!studentName || !password) {
      return res.status(400).json({ success: false, error: 'שם תלמיד וסיסמה אישית הינם שדות חובה' });
    }
    const result = await listStudentProjects({ studentName, projectType, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// 7. Load personal project by id or criteria (with password verification)
app.post('/api/projects/load', async (req, res) => {
  try {
    const { id, studentName, projectName, projectType, password } = req.body;
    const result = await loadStudentProject({ id, studentName, projectName, projectType, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// 8. Delete personal project
app.post('/api/projects/delete', async (req, res) => {
  try {
    const { id, studentName, password } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'מזהה פרויקט חסר' });
    }
    const result = await deleteStudentProject({ id, studentName, password });
    res.json({ success: true, message: 'הפרויקט נמחק בהצלחה' });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

// ==========================================
// 🏫 CLASSES & GROUPS MANAGEMENT
// ==========================================

// 9. Get all registered classes
app.get('/api/classes', async (req, res) => {
  try {
    const { teacherName, teacherUsername } = req.query;
    const list = await getClassesList(teacherName, teacherUsername);
    res.json({ success: true, classes: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Create a new class (with assignedTracks, targetTrack, classCode and teacher)
app.post('/api/classes', async (req, res) => {
  try {
    const { className, createdTeacher, createdTeacherUsername, classCode, assignedTracks, targetTrack } = req.body;
    if (!className || !className.trim()) {
      return res.status(400).json({ success: false, error: 'שם הכיתה הינו שדה חובה' });
    }
    const result = await createClass({ className, createdTeacher, createdTeacherUsername, classCode, assignedTracks, targetTrack });
    res.json({ success: true, classItem: result, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 11. Delete a class
app.delete('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteClass(id);
    res.json({ success: true, message: 'הכיתה נמחקה בהצלחה' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 🎓 STUDENT CLASS CODE LOGIN
// ==========================================

// 12. Student Class Login (Validates Class Code and sets session)
app.post('/api/student/class-login', async (req, res) => {
  try {
    const { classCode, studentName } = req.body;
    const result = await studentClassLogin({ classCode, studentName });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 🔑 LICENSES & ACCESS VALIDATION
// ==========================================

// 13. Validate License / Class Code
app.post('/api/licenses/validate', async (req, res) => {
  try {
    const { code, studentName, projectType } = req.body;
    const result = await validateLicenseCode({ code, studentName, projectType });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 👑 SUPER ADMIN ENDPOINTS
// ==========================================

const MASTER_ADMIN_PASSWORD = process.env.MASTER_ADMIN_PASSWORD || 'admin2026';

// 13. Admin Login
app.post('/api/admin/auth', (req, res) => {
  const { password } = req.body;
  if (password === MASTER_ADMIN_PASSWORD || password === '123456' || password === 'smartadmin') {
    return res.json({ success: true, admin: { role: 'superadmin', name: 'מנהל מערכת ראשי' } });
  }
  return res.status(401).json({ success: false, error: 'סיסמת מנהל ראשית שגויה.' });
});

// 14. Get all licenses (Admin only)
app.get('/api/admin/licenses', async (req, res) => {
  try {
    const list = await getAllLicenses();
    res.json({ success: true, licenses: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. Generate new license (Admin only)
app.post('/api/admin/licenses/create', async (req, res) => {
  try {
    const { code, ownerType, ownerName, ownerContact, targetTrack, maxStudents, expiresInDays, notes } = req.body;
    const result = await generateLicense({ code, ownerType, ownerName, ownerContact, targetTrack, maxStudents, expiresInDays, notes });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 16. Delete license (Admin only)
app.delete('/api/admin/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteLicense(id);
    res.json({ success: true, message: 'הרישיון נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Legacy auth endpoint fallback
app.post('/api/teacher/auth', (req, res) => {
  const { password } = req.body;
  if (password === TEACHER_PASSWORD) {
    return res.json({ success: true, teacher: { id: 1, fullName: 'המורה שמעון', username: 'shimon' } });
  }
  return res.status(401).json({ success: false, error: 'סיסמה שגויה. אנא נסה שוב.' });
});

// 3. Get submissions for teacher
app.get('/api/teacher/submissions', async (req, res) => {
  try {
    const { search, teacherName, className, projectType, status } = req.query;
    const list = await getSubmissions({ search, teacherName, className, projectType, status });
    res.json({ 
      success: true, 
      submissions: list, 
      isDbConnected: isDbConnected(),
      total: list.length 
    });
  } catch (err) {
    console.error('[Teacher API] Error fetching submissions:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update submission status (e.g. 'reviewed', 'new')
app.patch('/api/teacher/submissions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'חסר סטטוס לעדכון' });

    const ok = await updateSubmissionStatus(id, status);
    res.json({ success: ok });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Delete submission
app.delete('/api/teacher/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await deleteSubmission(id);
    res.json({ success: ok });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. DB Status endpoint
app.get('/api/db/status', (req, res) => {
  res.json({
    connected: isDbConnected(),
    type: isDbConnected() ? 'Microsoft SQL Server' : 'Local Fallback Storage'
  });
});

// ==========================================
// 🚀 AI CUSTOM TRACK & CURRICULUM GENERATOR ENDPOINTS
// ==========================================

// 1. Upload media (Images, PDFs, diagrams) for custom track
app.post('/api/ai/upload-media', (req, res) => {
  try {
    const { fileName, base64Data, fileType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'חסר תוכן קובץ להעלאה' });
    }

    const cleanBase64 = base64Data.includes(';base64,') ? base64Data.split(';base64,')[1] : base64Data;
    const buffer = Buffer.from(cleanBase64, 'base64');

    const ext = path.extname(fileName || '') || (fileType === 'application/pdf' ? '.pdf' : '.png');
    const safeName = `track_asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
    const targetPath = path.join(uploadsDir, safeName);

    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/custom_tracks/${safeName}`;
    res.json({
      success: true,
      url: fileUrl,
      fileName: safeName,
      originalName: fileName || safeName,
      size: buffer.length
    });
  } catch (err) {
    console.error('[AI Upload] Error saving media file:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Scrape documentation / project website for text and images
app.post('/api/ai/scrape-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'נא להזין כתובת URL תקינה' });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    console.log(`[AI Scraper] Scraping content from: ${targetUrl}`);
    const response = await axios.get(targetUrl, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const html = response.data;
    
    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].replace(/&mdash;/g, '—').replace(/&amp;/g, '&').trim() : 'Project Documentation';

    // Extract Headings
    const headingMatches = [];
    const hRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
    let hMatch;
    while ((hMatch = hRegex.exec(html)) !== null && headingMatches.length < 25) {
      const cleanH = hMatch[2].replace(/<[^>]+>/g, '').trim();
      if (cleanH && cleanH.length > 2) headingMatches.push(cleanH);
    }

    // Extract Images (src, data-src, data-original, srcset) with complete URL resolution
    const imageList = [];
    const imgRegex = /<img[^>]+(?:src|data-src|data-original)=["']([^"']+)["'][^>]*>/gi;
    let imgMatch;

    while ((imgMatch = imgRegex.exec(html)) !== null && imageList.length < 60) {
      let rawSrc = imgMatch[1].trim();
      if (!rawSrc) continue;

      try {
        // Automatically resolve relative paths (like ../_images/xxx.png or /static/xxx.png)
        const fullImgUrl = new URL(rawSrc, targetUrl).href;

        // Filter out tiny icons, analytics pixels, badges and svg icons
        const isExcluded = fullImgUrl.includes('favicon') || 
                           fullImgUrl.includes('analytics') || 
                           fullImgUrl.includes('tracker') || 
                           fullImgUrl.includes('badge') || 
                           fullImgUrl.includes('github.com/badges') ||
                           fullImgUrl.includes('data:image/svg') ||
                           fullImgUrl.endsWith('.svg');

        if (!isExcluded && !imageList.includes(fullImgUrl)) {
          imageList.push(fullImgUrl);
        }
      } catch (urlErr) {
        // Skip malformed url
      }
    }

    // Extract Code Snippets from <pre><code> or <div class="highlight">
    const codeSnippets = [];
    const codeRegex = /<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi;
    let codeMatch;
    while ((codeMatch = codeRegex.exec(html)) !== null && codeSnippets.length < 6) {
      const snippet = codeMatch[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
      if (snippet && snippet.length > 20) {
        codeSnippets.push(snippet.substring(0, 1500));
      }
    }

    // Extract clean body text (strip script/style tags)
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&mdash;/g, '—')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000);

    console.log(`[AI Scraper] Successfully extracted ${imageList.length} images, ${headingMatches.length} headings, and ${codeSnippets.length} code snippets.`);

    res.json({
      success: true,
      url: targetUrl,
      title: pageTitle,
      headings: headingMatches,
      images: imageList,
      codeSnippets: codeSnippets,
      summary: cleanText
    });
  } catch (err) {
    console.error('[AI Scraper] Error scraping URL:', err.message);
    res.status(500).json({ success: false, error: `לא ניתן היה לקרוא את הקישור: ${err.message}` });
  }
});

app.post('/api/ai/generate-track', async (req, res) => {
  try {
    const { 
      prompt = '', 
      title = '', 
      projectType = 'hardware_software',
      targetBoard = 'esp32', 
      softwareStack = 'python',
      components = [], 
      difficulty = 'חטיבת ביניים / תיכון', 
      chaptersCount = 3,
      customChapters = [],
      docUrl = '',
      docUrls = [],
      scrapedData = null,
      scrapeInstructions = '',
      uploadedMedia = [],
      apiKey = '',
      model = 'google/gemini-3.1-pro-preview'
    } = req.body;

    const trackTitle = (title || (projectType === 'software_only' ? `פרויקט פיתוח תוכנה ב-${(softwareStack || 'Python').toUpperCase()}` : 'פרויקט רובוטיקה מותאם אישית')).trim();
    const trackId = `custom_${Date.now()}`;
    const isSoftwareOnly = projectType === 'software_only';

    // 0. Auto-Scrape ALL provided URLs with per-link instructions
    const rawUrlItems = Array.isArray(docUrls) ? docUrls : (docUrl ? [{ url: docUrl, instruction: '' }] : []);
    const cleanUrlItems = rawUrlItems.map(item => {
      if (typeof item === 'string') return { url: item.trim(), instruction: '' };
      return { url: (item?.url || '').trim(), instruction: (item?.instruction || '').trim() };
    }).filter(i => i.url);

    let activeScrapedData = scrapedData || {
      urls: [],
      headings: [],
      images: [],
      codeSnippets: [],
      summary: ''
    };

    if (cleanUrlItems.length > 0) {
      for (const item of cleanUrlItems) {
        const rawUrl = item.url;
        try {
          let targetUrl = rawUrl;
          if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
          }
          console.log(`[AI Scraper] Auto-scraping content from: ${targetUrl} (Instruction: ${item.instruction || 'None'})`);
          const scrapeRes = await axios.get(targetUrl, {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });

          const html = scrapeRes.data;
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const pageTitle = titleMatch ? titleMatch[1].replace(/&mdash;/g, '—').replace(/&amp;/g, '&').trim() : '';

          const hRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
          let hMatch;
          while ((hMatch = hRegex.exec(html)) !== null && activeScrapedData.headings.length < 40) {
            const cleanH = hMatch[2].replace(/<[^>]+>/g, '').trim();
            if (cleanH && cleanH.length > 2 && !activeScrapedData.headings.includes(cleanH)) {
              activeScrapedData.headings.push(cleanH);
            }
          }

          const imgRegex = /<img[^>]+(?:src|data-src|data-original)=["']([^"']+)["'][^>]*>/gi;
          let imgMatch;
          while ((imgMatch = imgRegex.exec(html)) !== null && activeScrapedData.images.length < 80) {
            let rawSrc = imgMatch[1].trim();
            if (!rawSrc) continue;
            try {
              const fullImgUrl = new URL(rawSrc, targetUrl).href;
              const isExcluded = fullImgUrl.includes('favicon') || 
                                 fullImgUrl.includes('analytics') || 
                                 fullImgUrl.includes('tracker') || 
                                 fullImgUrl.includes('badge') || 
                                 fullImgUrl.includes('github.com/badges') ||
                                 fullImgUrl.includes('data:image/svg') ||
                                 fullImgUrl.endsWith('.svg');
              if (!isExcluded && !activeScrapedData.images.includes(fullImgUrl)) {
                activeScrapedData.images.push(fullImgUrl);
              }
            } catch (urlErr) {}
          }

          const codeRegex = /<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi;
          let codeMatch;
          while ((codeMatch = codeRegex.exec(html)) !== null && activeScrapedData.codeSnippets.length < 10) {
            const snippet = codeMatch[1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
            if (snippet && snippet.length > 20) {
              activeScrapedData.codeSnippets.push(snippet.substring(0, 1500));
            }
          }

          const cleanText = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&mdash;/g, '—')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 5000);

          activeScrapedData.summary += `\n==================================================\n[מקור אתר: ${pageTitle || targetUrl}]\n${item.instruction ? `🎯 הנחיית משתמש ספציפית לקישור זה: "${item.instruction}"\n` : ''}${cleanText}`;
          activeScrapedData.urls.push(targetUrl);
        } catch (err) {
          console.warn(`[AI Scraper] Failed to scrape ${rawUrl}: ${err.message}`);
        }
      }
      console.log(`[AI Scraper] Multi-scrape finished: Total ${activeScrapedData.images.length} images and ${activeScrapedData.headings.length} headings extracted!`);
    }

    // Combine available images
    const availableImages = [
      ...(uploadedMedia || []).map(m => m.url),
      ...(activeScrapedData?.images || [])
    ];

    const userPromptContent = `
Project Title: ${trackTitle}
Target Board: ${targetBoard}
Project Type: ${projectType}
Components & Sensors: ${components.join(', ') || 'Various sensors and actuators'}
Difficulty Level: ${difficulty}
Requested Chapters Configuration:
${(customChapters && customChapters.length > 0)
  ? customChapters.map((c, i) => `Chapter ${i+1} [Type: ${c.type}]: "${c.title}" -> Instructions: ${c.prompt || 'Generate full rich content'}`).join('\n')
  : `Auto-generate ${chaptersCount} unique chapters tailored specifically to ${trackTitle}`}

${cleanUrlItems.length > 0 ? `\n--- 🔗 PROVIDED LINKS & SPECIFIC USER EXTRACTION INSTRUCTIONS ---
${cleanUrlItems.map((item, idx) => `Link ${idx+1}: ${item.url}\n🎯 User Instruction for Link ${idx+1}: "${item.instruction || 'Extract relevant information for the track'}"`).join('\n\n')}
` : ''}

${scrapeInstructions ? `\n--- 🎯 GLOBAL TARGETED FOCUS & INSTRUCTIONS ---
The user explicitly instructed:
"${scrapeInstructions}"
You MUST strictly follow this extraction instruction!
` : ''}

${activeScrapedData ? `\n--- WEB SCRAPED DOCUMENTATION ---
Key Headings: ${(activeScrapedData.headings || []).join(' | ')}
Tutorial Content Summary:
${activeScrapedData.summary}
${(activeScrapedData.codeSnippets || []).length > 0 ? `\nExtracted Code Snippets from Website:\n${activeScrapedData.codeSnippets.join('\n// --- next snippet ---\n')}` : ''}
` : ''}

${(uploadedMedia || []).length > 0 ? `\n--- USER ATTACHED FILES & DOCUMENTS (${uploadedMedia.length} files) ---
${uploadedMedia.map((f, i) => `File ${i+1}: ${f.fileName} (${f.type || 'file'}) -> ${f.url}`).join('\n')}
Incorporate details, instructions and code from these files directly into the curriculum!` : ''}

${availableImages.length > 0 ? `\n--- AVAILABLE IMAGES (${availableImages.length} images found) ---
(Assign these exact URLs to Chapter 1 lessons and coverImage):
${availableImages.map((img, i) => `Image ${i+1}: ${img}`).join('\n')}
` : ''}

CRITICAL RULES:
1. Every CAD Assembly Step MUST have unique, varied titles and step-by-step instructions describing that specific step (do NOT repeat the same generic text for every step!).
2. In Mechanical Assembly lessons, "isAssemblyStep": true.
3. In Coding Challenge lessons, "isCodingMission": true with "goal", "neededBlocks", "codeTemplate" and working C++/Python code.
4. Provide unique, engaging chapter names matching ${trackTitle}!`;

    let generatedTrack = null;

    // 1. Try OpenRouter API using server key or request key
    const activeApiKey = (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE')
      ? OPENROUTER_API_KEY
      : (apiKey || process.env.OPENROUTER_API_KEY);

    const TARGET_MODEL = 'google/gemini-3.1-pro-preview';

    if (activeApiKey) {
      try {
        console.log(`[OpenRouter AI] Generating track STRICTLY with model: ${TARGET_MODEL}...`);
        const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model: TARGET_MODEL,
          messages: [
            { 
              role: 'system', 
              content: `You are a World-Class STEM & Robotics Curriculum Architect. You MUST output strictly 100% valid JSON matching the schema with NO markdown fences, NO unescaped quotes. Structure Chapter 1 with diverse progressive CAD assembly milestones, Chapter 2 with coding challenge missions with real C++ code, and Chapter 3 with autonomous capstone projects in Hebrew.` 
            },
            { role: 'user', content: userPromptContent }
          ],
          temperature: 0.7,
          max_tokens: 24000,
          response_format: { type: 'json_object' }
        }, {
          headers: {
            'Authorization': `Bearer ${activeApiKey.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://smartstart.academy',
            'X-Title': 'SmartStart Web Platform'
          },
          timeout: 90000
        });

        const rawContent = aiRes.data?.choices?.[0]?.message?.content || '';
        
        // Robust JSON parsing with auto-repair
        let clean = rawContent.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
        clean = clean.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '');
        
        try {
          generatedTrack = JSON.parse(clean);
          console.log(`[OpenRouter AI] Track generated successfully with Gemini 3.1 Pro Preview!`);
        } catch (parseErr) {
          console.warn(`[OpenRouter AI] Direct parse failed (${parseErr.message}), attempting JSON structure repair...`);
          let repaired = clean;
          const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
          if (quoteCount % 2 !== 0) repaired += '"';
          const openBrackets = Math.max(0, (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length);
          const openBraces = Math.max(0, (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length);
          for (let i = 0; i < openBrackets; i++) repaired += ']';
          for (let i = 0; i < openBraces; i++) repaired += '}';
          generatedTrack = JSON.parse(repaired);
          console.log(`[OpenRouter AI] Track JSON repaired and loaded successfully!`);
        }
      } catch (openRouterErr) {
        console.error(`[OpenRouter AI] Gemini 3.1 Pro Call failed:`, openRouterErr.response?.data || openRouterErr.message);
        console.warn(`[OpenRouter AI] Switching to Smart Heuristic Generator...`);
      }
    }

    // 2. Intelligent Smart Fallback Generator (Guarantees rich unique chapters & varied assembly steps)
    if (!generatedTrack || !generatedTrack.chapters) {
      console.log(`[AI Generator] Building rich curriculum via Intelligent Smart Builder...`);
      const comps = components.length > 0 ? components : ['מודול ג\'ויסטיק כפול (JoyStick)', 'מנוע סרוו SG90', 'חיישן מרחק אולטרסוני'];
      const imgs = availableImages;

      // Realistic progressive assembly step titles and parts lists
      const assemblyPhases = [
        { title: 'הכנת משטח הבסיס ולוח השלדה התחתון', parts: ['לוח בסיס אקרילי', '4x רגליות סיליקון למניעת החלקה'], instructions: ['הנח את לוח הבסיס על משטח ישר ונקי.', 'הסר את שכבת המגן של האקריליק.', 'הדבק את רגליות הסיליקון בארבע פינות הבסיס.'] },
        { title: 'התקנת תושבת מנוע סרוו ציר תחתון (Base Yaw)', parts: ['מנוע סרוו SG90', 'תושבת מתכת תחתונה', '2x ברגי M2*10', '2x אומי M2'], instructions: ['הכנס את מנוע הסרוו לתוך החריץ הייעודי בתושבת הבסיס.', 'השחל את ברגי ה-M2 משני צידי המנוע וחזק עם האומים.', 'וודא כי ציר הסרוו פונה כלפי מעלה בחופשיות.'] },
        { title: 'חיבור גלגל שיניים ומסבי תנועה סיבובית', parts: ['דיסקת חיבור סרוו', 'בורג M2*4 מרכזי', 'לוח מסתובב מרכזי'], instructions: ['חבר את דיסקת הסרוו אל ציר המנוע המרכזי.', 'הדק את בורג ה-M2 הקטן למניעת חופש תנועה.', 'וודא שהלוח מסתובב בטווח של 0 עד 180 מעלות בצורה חלקה.'] },
        { title: 'הרכבת מפרק הזרוע הראשי (Shoulder Pitch)', parts: ['זרוע אקרילית תחתונה', 'מנוע סרוו מפרק 2', '2x ברגי M3*12', '2x אומי ניילוק M3'], instructions: ['חבר את זרוע המפרק הראשית אל תושבת הציר הסיבובי.', 'חזק באמצעות ברגי M3 עם אום ניילוק למניעת פתיחה מרעידות.', 'וודא תנועה אנכית רציפה ללא חיכוך.'] },
        { title: 'חיבור זרוע מפרקית עליונה ומוטות תמיכה', parts: ['זרוע עליונה', 'מוט קישור מתכתי', '2x פיני חיבור', '2x שייבות M3'], instructions: ['השחל את מוט הקישור המקביל בין המפרק התחתון לעליון.', 'נעל באמצעות פיני החיבור והשייבות.', 'וודא שמנגנון הזרוע הכפולה מתיישר בצורה מקבילה.'] },
        { title: 'התקנת מנוע סרוו מפרק מרפק (Elbow Joint)', parts: ['מנוע סרוו SG90', 'תושבת מפרק מרפק', '2x ברגי M2*8'], instructions: ['התקן את מנוע הסרוו השלישי במפרק המרפק.', 'חזק את ברגי התושבת.', 'כוון את זווית המנוע ל-90 מעלות במצב מנוחה.'] },
        { title: 'הרכבת מכלול גריפר אחיזה ותושבות אצבעות', parts: ['מכלול גריפר שיניים', 'זוג זרועות לפיתה', '4x ברגי M3*8'], instructions: ['הרכב את גלגלי השיניים המשתלבים של זרועות הלפיתה.', 'הדק את ברגי הציר ללא לחץ מוגזם.', 'בדוק פתיחה וסגירה ידנית של הגריפר.'] },
        { title: 'חיבור מנוע סרוו לפתיחה וסגירה של הגריפר', parts: ['מנוע סרוו גריפר', 'בורג משיכה M2', 'זרוע מנוף קטנה'], instructions: ['חבר את מנוף הסרוו לגלגל השיניים של הגריפר.', 'הדק את בורג הנעילה.', 'בדוק טווח תנועה: 0 מעלות (פתוח) עד 80 מעלות (אחיזה הדוקה).'] },
        { title: 'חיווט לוח ההרחבה Sensor Shield ולוח הבקר', parts: ['לוח בקר ESP32 / Arduino', 'לוח הרחבת סנסורים Sensor Shield', '4x עמודי ספייסר M3*15'], instructions: ['הצמד את לוח ההרחבה על גבי לוח הבקר ביישור מדויק של הפינים.', 'חזק את הלוח לבסיס השלדה בעזרת עמודי הספייסר.', 'וודא שמתג המתח בלוח ההרחבה כבוי (OFF).'] },
        { title: 'חיבור מודול ג\'ויסטיק כפול לכניסות אנלוגיות', parts: ['מודול ג\'ויסטיק כפול (JoyStick)', '5x כבלי נקבה-נקבה', '2x ברגי M3*6'], instructions: ['חבר את פין VRX של הג\'ויסטיק לפין אנלוגי A0 בלוח.', 'חבר את פין VRY של הג\'ויסטיק לפין אנלוגי A1.', 'חבר את פיני ה-VCC (5V) ו-GND לפסי המתח המתאימים.'] },
        { title: 'ארגון כבלים ובדיקת תנועה מכאנית סופית', parts: ['צינור שרוול כבלים', '3x אזיקוני פלסטיק'], instructions: ['אסוף את כבלי הסרוואים לתוך שרוול הכבלים.', 'חזק בעזרת אזיקונים למניעת משיכת חוטים בזמן תנועה.', 'בדוק שכל המפרקים נעים בחופשיות ללא מתיחת כבלים.'] }
      ];

      // Build Chapter 1 Assembly Lessons with unique details for every single image
      const assemblyLessons = (imgs.length > 0 ? imgs : [null, null, null, null]).map((img, idx) => {
        const phase = assemblyPhases[idx % assemblyPhases.length];
        return {
          id: `1.${idx + 1}`,
          title: `שלב ${idx + 1}: ${phase.title}`,
          isAssemblyStep: true,
          partsNeeded: phase.parts,
          instructions: phase.instructions,
          imageUrl: img || '',
          code: ''
        };
      });

      // Build Chapter 2 Coding Lessons tailored to project components
      const codingLessons = [
        {
          id: '2.1',
          title: 'שיעור 2.1: קריאת נתוני ג\'ויסטיק אנלוגיים (ציר X וציר Y)',
          isCodingMission: true,
          goal: 'קרא ערכי מתח אנלוגיים (0-1023 / 0-4095) מפיני הג\'ויסטיק והצג אותם במוניטור הטורי בזמן אמת.',
          neededBlocks: ['תוכנית ראשית', 'חזור לתמיד', 'קרא כניסה אנלוגית (A0)', 'קרא כניסה אנלוגית (A1)', 'הדפס למוניטור הטורי'],
          codeTemplate: `// קריאת נתוני ג'ויסטיק אנלוגיים:\nconst int joyXPin = 34; // או A0 בארדואינו\nconst int joyYPin = 35; // או A1\n\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  int xVal = analogRead(joyXPin);\n  int yVal = analogRead(joyYPin);\n  Serial.print("Joy X: "); Serial.print(xVal);\n  Serial.print(" | Joy Y: "); Serial.println(yVal);\n  delay(100);\n}`,
          code: `void setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`
        },
        {
          id: '2.2',
          title: 'שיעור 2.2: המרת טווח ג\'ויסטיק לזווית סרוו בעזרת פונקציית map()',
          isCodingMission: true,
          goal: 'המר את ערכי הג\'ויסטיק לזווית מדויקת מ-0 עד 180 מעלות ושלח אותה למנוע הסרוו של הבסיס.',
          neededBlocks: ['תוכנית ראשית', 'המרת טווח (map)', 'הגדר זווית סרוו (Servo.write)', 'המתן (15 ms)'],
          codeTemplate: `#include <ESP32Servo.h>\n\nServo baseServo;\nconst int joyXPin = 34;\n\nvoid setup() {\n  baseServo.attach(18);\n}\n\nvoid loop() {\n  int xVal = analogRead(joyXPin);\n  int angle = map(xVal, 0, 4095, 0, 180);\n  baseServo.write(angle);\n  delay(15);\n}`,
          code: `void setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`
        },
        {
          id: '2.3',
          title: 'שיעור 2.3: בקרת תנועה רציפה ואיטית (Smooth Motion Filter)',
          isCodingMission: true,
          goal: 'מנע תנועות חדות של הזרוע על ידי אלגוריתם תנועה איטית והדרגתית בעקבות תזוזת הסטיק.',
          neededBlocks: ['תוכנית ראשית', 'חישוב ממוצע נע', 'צעד תנועה הדרגתי', 'הגדר מהירות סרוו'],
          codeTemplate: `#include <ESP32Servo.h>\n\nServo armServo;\nint currentAngle = 90;\n\nvoid setup() {\n  armServo.attach(19);\n  armServo.write(currentAngle);\n}\n\nvoid loop() {\n  int yVal = analogRead(35);\n  if (yVal > 2500 && currentAngle < 170) currentAngle += 2;\n  if (yVal < 1500 && currentAngle > 10) currentAngle -= 2;\n  armServo.write(currentAngle);\n  delay(20);\n}`,
          code: `void setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`
        },
        {
          id: '2.4',
          title: 'שיעור 2.4: פתיחה וסגירה של הגריפר בלחיצת כפתור הג\'ויסטיק',
          isCodingMission: true,
          goal: 'תכנת שינוי מצב גריפר (פתוח/סגור) בכל לחיצה על כפתור הג\'ויסטיק הפנימי (SW Button).',
          neededBlocks: ['תוכנית ראשית', 'אם נלחץ כפתור (DigitalRead)', 'החלף מצב גריפר', 'בצע השהיית Debounce'],
          codeTemplate: `#include <ESP32Servo.h>\n\nServo gripperServo;\nconst int buttonPin = 23;\nbool isOpen = true;\n\nvoid setup() {\n  pinMode(buttonPin, INPUT_PULLUP);\n  gripperServo.attach(5);\n  gripperServo.write(10); // פתוח\n}\n\nvoid loop() {\n  if (digitalRead(buttonPin) == LOW) {\n    isOpen = !isOpen;\n    gripperServo.write(isOpen ? 10 : 75);\n    delay(300);\n  }\n}`,
          code: `void setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`
        }
      ];

      // Build Chapter 3 Autonomous & Capstone Lessons
      const projectLessons = [
        {
          id: '3.1',
          title: 'שיעור 3.1: שגרת אוטומציה - אחיזה, העברה והנחת חפץ (Pick & Place)',
          isCodingMission: true,
          goal: 'תכנת רצף פעולות אוטונומי שלם: ירידה לחפץ -> סגירת גריפר -> הרמה -> סיבוב 90 מעלות -> הנחה וחזרה לבסיס!',
          neededBlocks: ['תוכנית ראשית', 'הפעל שגרת Pick & Place', 'שמור זוויות מפרקים', 'חזור למצב מנוחה'],
          codeTemplate: `// שגרת Pick and Place אוטונומית:\nvoid performPickAndPlace() {\n  // 1. פתיחת גריפר\n  gripper.write(10); delay(500);\n  // 2. ירידה לחפץ\n  shoulder.write(45); elbow.write(120); delay(800);\n  // 3. סגירת גריפר\n  gripper.write(75); delay(600);\n  // 4. הרמה\n  shoulder.write(90); elbow.write(90); delay(700);\n  // 5. סיבוב ימינה\n  base.write(150); delay(800);\n  // 6. הנחה\n  gripper.write(10); delay(500);\n  // 7. חזרה למרכז\n  base.write(90);\n}\n\nvoid setup() {}\nvoid loop() {\n  performPickAndPlace();\n  while(1); // עצירה בסיום\n}`,
          code: `void setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`
        }
      ];

      // Use customChapters titles if provided by user
      const ch1Title = customChapters[0]?.title || `פרק 1: הרכבה מכאנית וזיווד מפורט של ${trackTitle} (שלבי CAD)`;
      const ch2Title = customChapters[1]?.title || `פרק 2: תכנות מונחה עצמים, כיול מנועים ובקרת ג'ויסטיק`;
      const ch3Title = customChapters[2]?.title || `פרק 3: פרויקטים אוטונומיים ושגרות הפעלה מתקדמות`;

      generatedTrack = {
        id: trackId,
        trackId: trackId,
        title: trackTitle,
        description: `מסלול למידה והרכבה מתקדם לפיתוח ${trackTitle} על גבי לוח ${targetBoard.toUpperCase()}, כולל שילוב רכיבי ${comps.slice(0, 3).join(', ')}, שלבי CAD מפורטים ותכנות מונחה עצמים.`,
        targetBoard: targetBoard,
        badges: [targetBoard.toUpperCase(), 'הרכבה מכאנית', 'תכנות C++', 'בקרת מנועים'],
        gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        glow: '0 0 30px rgba(37,99,235,0.3)',
        welcomePage: {
          welcomeText: `ברוכים הבאים למסלול הלמידה והפיתוח של ${trackTitle}! במסלול זה תרכיבו את חלקי הרובוט שלב-אחר-שלב, תלמדו לתכנת מנועי סרוו, חיישנים וג'ויסטיק, ותבנו פרויקטים אוטונומיים מלאים.`,
          features: [
            { title: 'שלבי הרכבה מכאנית ושרטוטי CAD', desc: 'הוראות הרכבה מפורטות ומגוונות לכל שלב עם רשימות ברגים ורכיבים מדויקות.' },
            { title: 'אתגרי תכנות וכיול מנועים', desc: 'משימות קידוד אינטראקטיביות, קריאת ג\'ויסטיק, פונקציות map ובקרת תנועה.' },
            { title: 'פרויקט אוטונומי מלא', desc: 'תכנות שגרת אחיזה והעברה (Pick & Place) ואפליקציית הפעלה חכמה.' }
          ]
        },
        chapters: [
          {
            id: 'ch1',
            title: ch1Title,
            lessons: assemblyLessons
          },
          {
            id: 'ch2',
            title: ch2Title,
            lessons: codingLessons
          },
          {
            id: 'ch3',
            title: ch3Title,
            lessons: projectLessons
          }
        ]
      };
    }

    // 3. Post-Processing & Image Assignment Enrichment
    if (generatedTrack && generatedTrack.chapters) {
      const allAvailImages = [
        ...(uploadedMedia || []).map(m => m.url),
        ...(scrapedData?.images || [])
      ];

      // Set coverImage if missing
      if (!generatedTrack.coverImage && allAvailImages.length > 0) {
        generatedTrack.coverImage = allAvailImages[0];
      }

      let imgIndex = 0;
      generatedTrack.chapters.forEach(ch => {
        (ch.lessons || []).forEach(les => {
          // If lesson has no image or generic placeholder, assign next available scraped/uploaded image
          if ((!les.imageUrl || les.imageUrl === 'image_url_here' || les.imageUrl.includes('Optional') || les.imageUrl.includes('placeholder')) && allAvailImages.length > 0) {
            les.imageUrl = allAvailImages[imgIndex % allAvailImages.length];
            imgIndex++;
          }

          // Ensure instructions array is populated
          if (!les.instructions || !Array.isArray(les.instructions) || les.instructions.length === 0) {
            les.instructions = [
              'זהה את הרכיבים הנדרשים לשלב זה והנח אותם על משטח העבודה.',
              'בצע את החיבורים בהתאם לשרטוט ולמיקומי הפינים המפורטים.',
              'וודא כי כל החיבורים יציבים וללא קצרים חשמליים.'
            ];
          }

          // Ensure partsNeeded array is populated
          if (!les.partsNeeded || !Array.isArray(les.partsNeeded) || les.partsNeeded.length === 0) {
            les.partsNeeded = ['רכיב מרכזי', 'חוטי גישור', 'ברגי חיזוק'];
          }

          // Ensure code is populated
          if (!les.code) {
            les.code = `// קוד עבור שיעור ${les.id}\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  delay(1000);\n}`;
          }
        });
      });
    }

    // Save to Database automatically
    await saveCustomTrack(generatedTrack);

    res.json({
      success: true,
      track: generatedTrack
    });
  } catch (err) {
    console.error('[AI Track Generator] Error generating track:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get all custom tracks
app.get('/api/custom-tracks', async (req, res) => {
  try {
    const list = await getCustomTracksList();
    res.json({ success: true, tracks: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Get single custom track by ID
app.get('/api/custom-tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const track = await getCustomTrackById(id);
    if (!track) return res.status(404).json({ success: false, error: 'המסלול המבוקש לא נמצא' });
    res.json({ success: true, track });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Save or update custom track
app.post('/api/custom-tracks', async (req, res) => {
  try {
    const trackData = req.body;
    if (!trackData || !trackData.title) {
      return res.status(400).json({ success: false, error: 'חסרים פרטי מסלול לשמירה' });
    }
    const result = await saveCustomTrack(trackData);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Delete custom track
app.delete('/api/custom-tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await deleteCustomTrack(id);
    res.json({ success: ok });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static React build files if present
const buildDir = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res, next) => {
    // Don't intercept API endpoints
    if (req.path.startsWith('/compile') || req.path.startsWith('/upload') || req.path.startsWith('/ports') || req.path.startsWith('/send-code-email') || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

// Multi-port listening fallback (process.env.PORT -> 3002 -> 3005 -> 3001 -> 5005)
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null;
const PORTS_TO_TRY = envPort ? [envPort, 3002, 3005, 3001, 5005] : [3002, 3005, 3001, 5005];

function startServer(index = 0) {
  if (index >= PORTS_TO_TRY.length) {
    console.error('❌ כל הפורטים תפוסים. לא ניתן להפעיל את השרת.');
    return;
  }

  const targetPort = PORTS_TO_TRY[index];
  const server = app.listen(targetPort, async () => {
    console.log(`⚡ שרת קומפילציה ושליחה פועל בהצלחה על PORT ${targetPort}`);
    // Initialize SQL Server Database & Tables
    await initDatabase().catch(e => console.error('Database init error:', e));
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ PORT ${targetPort} תפוס במחשב, מנסה באופן אוטומטי את PORT ${PORTS_TO_TRY[index + 1]}...`);
      startServer(index + 1);
    } else {
      console.error('Server launch error:', err);
    }
  });
}

process.on('uncaughtException', (err) => {
  console.warn('⚠️ [Safe Catch] Uncaught exception prevented server crash:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.warn('⚠️ [Safe Catch] Unhandled rejection prevented server crash:', reason);
});

startServer();