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
// 🔑 HUGGING FACE & AI CONFIGURATION
// ============================================================================
const DEFAULT_AI_MODEL = "black-forest-labs/FLUX.1-schnell";

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

const { orchestrateTrackGeneration, classifyDomain } = require('./aiAgents/orchestrator');

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

    // 1. Determine active API key
    const activeApiKey = (apiKey || process.env.google_api_key || process.env.GOOGLE_API_KEY || '').trim();

    // 2. Invoke AI Multi-Agent Orchestrator (Domain Experts + Styling + QA Validation)
    const generatedTrack = await orchestrateTrackGeneration({
      ...req.body,
      title: trackTitle,
      activeScrapedData,
      availableImages,
      apiKey: activeApiKey
    });

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

// ============================================================================
// 🎨🤖 WEB DEVELOPMENT TRACK: HUGGING FACE & AI AGENTS
// ============================================================================
const generatedAiImagesDir = path.join(__dirname, '..', 'public', 'generated_ai_images');
if (!fs.existsSync(generatedAiImagesDir)) {
  fs.mkdirSync(generatedAiImagesDir, { recursive: true });
}
app.use('/generated_ai_images', express.static(generatedAiImagesDir));

function getActiveGeminiKeys() {
  try {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: true });
  } catch (e) {}
  const googleKey = (
    process.env.google_api_key ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.REACT_APP_GOOGLE_API_KEY ||
    ''
  ).trim();
  const hfToken = (
    process.env.hugin_facebook_app_id ||
    process.env.HF_TOKEN ||
    process.env.HUGGINGFACE_API_KEY ||
    process.env.REACT_APP_HF_TOKEN ||
    ''
  ).trim();
  return { googleKey, hfToken };
}

async function translateHebrewPromptToEnglish(userRequest, isLogoRequest = false, brandName = 'MySite', topic = '') {
  const raw = String(userRequest || '').trim();
  if (!raw) {
    return isLogoRequest
      ? `Modern minimalist vector brand logo emblem for ${brandName}, clean flat graphic design, studio lighting`
      : 'Professional modern website hero photography, high resolution, ultra detailed, 8k';
  }

  // Strip conversational Hebrew prefixes ("צור לי תמונה של...", "תיצור לי תמונה של...", "תמונה של...")
  let cleanCore = raw
    .replace(/^(?:היי\s+|שלום\s+|בבקשה\s+)?(?:תיצור|צור|תייצר|ייצר|צייר|תצייר|תכין|הכן|תביא|הצג|תעשה|עשה)\s+(?:לי\s+|לנו\s+|עבורי\s+)?(?:בבקשה\s+)?(?:תמונה|איור|ציור|צילום|רקע|באנר|לוגו|סמל)?\s*(?:יפה\s+|מגניבה\s+|מקצועית\s+|אמיתית\s+|מגרה\s+)?(?:של\s+|עבור\s+|ל-?\s*)?/i, '')
    .replace(/^(?:תמונה|איור|ציור|צילום|רקע|באנר)\s+(?:יפה\s+|מגניבה\s+|מקצועית\s+)?(?:של\s+|עבור\s+)?/i, '')
    .trim();

  if (!cleanCore) cleanCore = raw;

  let translatedCore = cleanCore;

  // Layer 1: MyMemory Free Translation API (server-friendly, no 429 block, no API key required)
  if (/[\u0590-\u05FF]/.test(translatedCore)) {
    try {
      const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanCore)}&langpair=he|en`;
      const mmRes = await axios.get(mmUrl, { timeout: 4500 });
      const mmText = (mmRes.data?.responseData?.translatedText || '').trim();
      if (mmText && !/[\u0590-\u05FF]/.test(mmText) && !mmText.includes('MYMEMORY WARNING')) {
        translatedCore = mmText;
      }
    } catch (err) {}
  }

  // Layer 2: Fast Free Gemini Lite models (gemini-3.5-flash-lite / gemini-flash-lite-latest)
  if (/[\u0590-\u05FF]/.test(translatedCore)) {
    const { googleKey } = getActiveGeminiKeys();
    if (googleKey) {
      for (const gm of ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite']) {
        if (!/[\u0590-\u05FF]/.test(translatedCore)) break;
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${gm}:generateContent?key=${encodeURIComponent(googleKey)}`;
          const res = await axios.post(
            url,
            {
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Translate this Hebrew image description to English (output ONLY the English translation, nothing else): "${cleanCore}"`
                    }
                  ]
                }
              ],
              generationConfig: { temperature: 0.2, maxOutputTokens: 100 }
            },
            { timeout: 5000 }
          );
          const gText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (gText && !/[\u0590-\u05FF]/.test(gText)) {
            translatedCore = gText.replace(/^["']|["']$/g, '').trim();
          }
        } catch (err) {}
      }
    }
  }

  // Layer 3: Google Translate with Browser User-Agent
  if (/[\u0590-\u05FF]/.test(translatedCore)) {
    try {
      const gtUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=he&tl=en&dt=t&q=${encodeURIComponent(cleanCore)}`;
      const gtRes = await axios.get(gtUrl, {
        timeout: 4000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      });
      if (Array.isArray(gtRes.data?.[0])) {
        const joined = gtRes.data[0].map((part) => part?.[0] || '').join('').trim();
        if (joined && !/[\u0590-\u05FF]/.test(joined)) {
          translatedCore = joined;
        }
      }
    } catch (err) {}
  }

  // Layer 4: Built-in Hebrew-to-English visual dictionary (ensures Hebrew characters are NEVER sent to FLUX)
  if (/[\u0590-\u05FF]/.test(translatedCore)) {
    const dict = [
      [/סלט ירקות/g, 'fresh vegetable salad'],
      [/סלט/g, 'fresh salad'],
      [/ירקות/g, 'fresh vegetables'],
      [/עסיסי/g, 'juicy'],
      [/מסעדות|מסעדה/g, 'gourmet restaurant'],
      [/שווארמה/g, 'delicious middle eastern shawarma wrap'],
      [/פלאפל/g, 'crispy falafel in pita'],
      [/המבורגר|בורגר/g, 'juicy gourmet burger'],
      [/פיצה/g, 'hot Italian pizza with melted cheese'],
      [/גלידה/g, 'colorful artisan ice cream'],
      [/עוגה|קינוח/g, 'sweet gourmet cake dessert'],
      [/קפה/g, 'cup of artisan coffee'],
      [/אוכל/g, 'delicious gourmet food'],
      [/סניקרס|נעליים|נעלי ספורט/g, 'modern stylish sneakers shoes'],
      [/אופנה|בגדים|חולצה/g, 'trendy fashion clothing'],
      [/גיימינג|משחקי מחשב|קונסולה/g, 'neon RGB gaming setup room'],
      [/מחשב/g, 'modern computer setup'],
      [/רובוט/g, 'futuristic friendly robot'],
      [/כלב|גור כלבים/g, 'cute happy dog puppy'],
      [/חתול/g, 'cute fluffy cat'],
      [/חיות מחמד|חיה/g, 'cute domestic pet animal'],
      [/מכונית|רכב/g, ' sleek modern sports car'],
      [/כדורגל|ספורט/g, 'soccer stadium sports action'],
      [/טבע|נוף|ים|חוף/g, 'scenic nature landscape beach']
    ];
    let fallbackEn = translatedCore;
    for (const [hebRegex, engWord] of dict) {
      fallbackEn = fallbackEn.replace(hebRegex, ` ${engWord} `);
    }
    fallbackEn = fallbackEn.replace(/[\u0590-\u05FF]+/g, ' ').replace(/\s+/g, ' ').trim();
    translatedCore = fallbackEn || 'modern commercial photography';
  }

  if (isLogoRequest) {
    return `${translatedCore}, modern minimalist vector brand logo icon for "${brandName}", clean flat graphic design, studio lighting, high resolution`;
  }
  return `${translatedCore}, professional high resolution photography, ultra detailed, realistic natural lighting, sharp focus, 8k`;
}

// Upload image/file attachment from the Live AI Agent panel so images get clean URLs
app.post('/api/web-track/upload-ai-asset', (req, res) => {
  try {
    const { fileName = 'asset.png', dataUrl = '' } = req.body || {};
    const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ success: false, error: 'Invalid dataUrl' });
    }
    const mimeType = match[1];
    const base64Data = match[2];
    const ext = (fileName.split('.').pop() || 'png').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'png';
    const safeName = `ai_upload_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
    const targetPath = path.join(generatedAiImagesDir, safeName);
    fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
    const hostBase = `${req.protocol}://${req.get('host')}`;
    const publicUrl = `${hostBase}/generated_ai_images/${safeName}`;
    return res.json({
      success: true,
      url: publicUrl,
      mimeType,
      fileName: safeName
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

async function callGeminiTextModel(systemPrompt, userPrompt, options = {}) {
  const { googleKey, hfToken } = getActiveGeminiKeys();
  const maxOutputTokens = options.maxOutputTokens || 2048;
  const attachments = Array.isArray(options.attachments) ? options.attachments : [];
  const history = Array.isArray(options.history) ? options.history.slice(-6) : [];

  // 1. Try Hugging Face Inference Router with strongest Free Models (Qwen2.5-VL-72B / Qwen2.5-Coder-32B / DeepSeek-V3 / Llama-3.3-70B)
  if (hfToken) {
    const hasImageAttachment = attachments.some((a) => a.type === 'image' && a.dataUrl);
    const hfModels = hasImageAttachment
      ? ['Qwen/Qwen2.5-VL-72B-Instruct', 'meta-llama/Llama-3.2-90B-Vision-Instruct']
      : [
          'Qwen/Qwen2.5-Coder-32B-Instruct',
          'deepseek-ai/DeepSeek-V3-0324',
          'Qwen/Qwen2.5-72B-Instruct',
          'meta-llama/Llama-3.3-70B-Instruct'
        ];
    for (const hfModel of hfModels) {
      try {
        const userContent = hasImageAttachment
          ? [
              { type: 'text', text: userPrompt },
              ...attachments
                .filter((a) => a.type === 'image' && a.dataUrl)
                .map((img) => ({ type: 'image_url', image_url: { url: img.dataUrl } }))
            ]
          : userPrompt;

        const hfMessages = [
          { role: 'system', content: systemPrompt },
          ...history
            .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && h.text)
            .map((h) => ({
              role: h.role,
              content: String(h.text).slice(0, 1500)
            })),
          { role: 'user', content: userContent }
        ];

        const res = await axios.post(
          'https://router.huggingface.co/v1/chat/completions',
          {
            model: hfModel,
            messages: hfMessages,
            temperature: 0.65,
            max_tokens: Math.min(maxOutputTokens, 6144)
          },
          {
            headers: {
              Authorization: `Bearer ${hfToken}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );
        const text = res.data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          console.log(`✅ [AI Agent] תשובה התקבלה ממודל: Hugging Face (${hfModel})`);
          return { text, provider: `Hugging Face (${hfModel})` };
        }
      } catch (err) {}
    }
  }

  // 2. Try Fast Multimodal Vision + Code Models (gemini-3.5-flash-lite / gemini-flash-lite-latest / gemini-3.5-flash)
  if (googleKey) {
    const fastModels = [
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
      'gemini-2.5-flash'
    ];

    const userParts = [{ text: userPrompt }];
    for (const att of attachments) {
      if (att.type === 'image' && att.base64Data && att.mimeType) {
        userParts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.base64Data
          }
        });
      }
    }

    const geminiContents = [
      ...history
        .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && h.text)
        .map((h) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.text).slice(0, 1500) }]
        })),
      { role: 'user', parts: userParts }
    ];

    for (const gm of fastModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${gm}:generateContent?key=${encodeURIComponent(googleKey)}`;
        const generationConfig = {
          temperature: 0.65,
          maxOutputTokens
        };
        if (gm.includes('2.5')) {
          generationConfig.thinkingConfig = { thinkingBudget: 0 };
        }

        const res = await axios.post(
          url,
          {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig
          },
          { timeout: 18000 }
        );
        const text = res.data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n').trim();
        if (text) {
          console.log(`✅ [AI Agent] תשובה התקבלה ממודל מהיר: ${gm}`);
          return { text, provider: `Gemini (${gm})` };
        }
      } catch (err) {
        console.warn(`[AI Agent] ${gm} notice:`, err.response?.data?.error?.message || err.message);
      }
    }
  }

  throw new Error('No AI response available');
}

function buildSmartLiveCodeFallback(prompt = '', currentCode = '', attachments = []) {
  const reqText = String(prompt || '').trim();
  const baseCode =
    String(currentCode || '').trim() ||
    `<body>\n  <h1>האתר שלי</h1>\n  <p>ברוכים הבאים לאתר שלי!</p>\n</body>\n\n<style>\n  body {\n    direction: rtl;\n    font-family: 'Segoe UI', sans-serif;\n    background: #0f172a;\n    color: #f8fafc;\n    padding: 24px;\n    text-align: center;\n  }\n</style>`;

  // Check if user is asking a conversational question ("איך...", "מה...", "למה...")
  const isPureQuestion =
    /^(?:איך|מה|למה|מתי|איפה|האם|תסביר|אפשר הסבר|מה ההבדל)/i.test(reqText) &&
    !/^(?:תוסיף|הוסף|תשנה|שנה|תתקן|תקן|תבנה|בנה|שים|תשים)/i.test(reqText);

  if (isPureQuestion) {
    if (/תמונת רקע|רקע.*תמונה|background-image/i.test(reqText)) {
      return {
        explanation: `כדי להוסיף תמונת רקע ל-\`div\` (או ל-\`header\`), מוסיפים ב-CSS בתוך תגית ה-\`<style>\` את המאפיין \`background-image\` יחד עם \`background-size: cover\`:\n\n\`\`\`css\n.my-box {\n  background-image: url('קישור-לתמונה.jpg');\n  background-size: cover;\n  background-position: center;\n  min-height: 300px;\n}\n\`\`\`\nאם תרצה שאוסיף את זה עבורך ישירות לקוד — פשוט כתוב לי "תוסיף תמונת רקע לחלק העליון"!`,
        updatedCode: '',
        provider: 'Smart Web Mentor'
      };
    }
    return {
      explanation: `שאלה מצוינת! ב-HTML ו-CSS אנחנו בונים את האלמנטים בתוך ה-\`<body>\` ומעצבים אותם בתוך ה-\`<style>\` לפי שם התגית או ה-\`class\`.\n\nאתה יכול לשאול אותי כל שאלה או לבקש ממני לבצע את השינוי ישירות בקוד שלך (ואפילו לצרף תמונה או קובץ בלחצן 📎)!`,
      updatedCode: '',
      provider: 'Smart Web Mentor'
    };
  }

  let bodyInner = '';
  let styleInner = '';
  const bodyMatch = baseCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const styleMatch = baseCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);

  if (bodyMatch) {
    bodyInner = bodyMatch[1].trim();
  } else {
    bodyInner = baseCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').trim();
  }
  if (styleMatch) {
    styleInner = styleMatch[1].trim();
  }

  // Extract any image URL from attachments or from prompt text
  const attachedImg = (attachments || []).find((a) => a.type === 'image' && (a.publicUrl || a.dataUrl));
  const urlInTextMatch = reqText.match(/https?:\/\/[^\s"'<>]+/i);
  const targetImgUrl = attachedImg?.publicUrl || attachedImg?.dataUrl || (urlInTextMatch ? urlInTextMatch[0] : '');

  let explanation = 'עדכנתי ושדרגתי את הקוד שלך בלייב לפי הבקשה!';

  if (targetImgUrl && /רקע|חלק הראשון|header|הדר|באנר/i.test(reqText)) {
    explanation = 'הגדרתי את התמונה כתמונת רקע מרשימה בחלק העליון (header) של הדף עם התאמה מלאה!';
    styleInner += `\n\n  header {\n    background-image: linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('${targetImgUrl}');\n    background-size: cover;\n    background-position: center;\n    color: #ffffff;\n    padding: 60px 20px;\n    border-radius: 16px;\n    text-align: center;\n  }`;
  } else if (targetImgUrl) {
    explanation = 'שילבתי את התמונה שצירפת בתוך הדף בעיצוב מודרני!';
    bodyInner += `\n\n  <div class="ai-image-showcase">\n    <img src="${targetImgUrl}" alt="תמונה באתר" />\n  </div>`;
    styleInner += `\n\n  .ai-image-showcase img {\n    max-width: 100%;\n    width: 480px;\n    border-radius: 16px;\n    box-shadow: 0 12px 30px rgba(0,0,0,0.25);\n    margin: 20px auto;\n    display: block;\n  }`;
  } else if (/ניווט|תפריט|navbar|הדר|header/i.test(reqText)) {
    explanation = 'הוספתי תפריט ניווט עליון (Navbar) יוקרתי ומעוצב לראש הדף!';
    bodyInner = `  <nav class="ai-navbar">\n    <div class="ai-logo">✨ האתר שלי</div>\n    <div class="ai-nav-links">\n      <a href="#home">ראשי</a>\n      <a href="#about">אודות</a>\n      <a href="#gallery">גלריה</a>\n      <a href="#contact">צור קשר</a>\n    </div>\n  </nav>\n\n${bodyInner}`;
    styleInner += `\n\n  .ai-navbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    background: rgba(30, 41, 59, 0.9);\n    padding: 14px 24px;\n    border-radius: 14px;\n    margin-bottom: 24px;\n    box-shadow: 0 8px 24px rgba(0,0,0,0.2);\n  }\n  .ai-logo {\n    font-weight: 800;\n    font-size: 1.25rem;\n    color: #38bdf8;\n  }\n  .ai-nav-links {\n    display: flex;\n    gap: 18px;\n  }\n  .ai-nav-links a {\n    color: #e2e8f0;\n    text-decoration: none;\n    font-weight: 600;\n    transition: color 0.2s;\n  }\n  .ai-nav-links a:hover {\n    color: #38bdf8;\n  }`;
  } else if (/כפתור|button/i.test(reqText)) {
    explanation = 'הוספתי כפתור מעוצב עם אפקט ריחוף (Hover) אינטראקטיבי!';
    bodyInner += `\n\n  <div style="margin: 20px 0;">\n    <button class="ai-action-btn" onclick="alert('שלום! לחצת על הכפתור 🚀')">לחץ כאן עכשיו 🚀</button>\n  </div>`;
    styleInner += `\n\n  .ai-action-btn {\n    background: linear-gradient(135deg, #6366f1, #ec4899);\n    color: #ffffff;\n    border: none;\n    padding: 12px 28px;\n    border-radius: 999px;\n    font-size: 1.05rem;\n    font-weight: 800;\n    cursor: pointer;\n    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);\n    transition: transform 0.2s ease, box-shadow 0.2s ease;\n  }\n  .ai-action-btn:hover {\n    transform: translateY(-3px) scale(1.03);\n    box-shadow: 0 12px 28px rgba(236, 72, 153, 0.45);\n  }`;
  } else if (/כרטיס|מוצר|גלרי|card/i.test(reqText)) {
    explanation = 'הוספתי אזור כרטיסיות מעוצבות (Cards) עם אפקט תלת-ממדי בריחוף!';
    bodyInner += `\n\n  <section class="ai-cards-grid">\n    <div class="ai-card">\n      <h3>🌟 כרטיסייה ראשונה</h3>\n      <p>תיאור קצר ומרשים של התוכן או המוצר הראשון באתר שלך.</p>\n      <button class="ai-card-btn">לפרטים נוספים</button>\n    </div>\n    <div class="ai-card">\n      <h3>🔥 כרטיסייה שנייה</h3>\n      <p>תיאור קצר ומרשים של התוכן או המוצר השני באתר שלך.</p>\n      <button class="ai-card-btn">לפרטים נוספים</button>\n    </div>\n  </section>`;
    styleInner += `\n\n  .ai-cards-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    gap: 20px;\n    margin: 24px 0;\n  }\n  .ai-card {\n    background: rgba(30, 41, 59, 0.85);\n    border: 1px solid rgba(148, 163, 184, 0.2);\n    border-radius: 16px;\n    padding: 20px;\n    text-align: right;\n    box-shadow: 0 10px 25px rgba(0,0,0,0.18);\n    transition: transform 0.25s ease;\n  }\n  .ai-card:hover {\n    transform: translateY(-5px);\n  }\n  .ai-card-btn {\n    margin-top: 12px;\n    background: #38bdf8;\n    color: #0f172a;\n    border: none;\n    padding: 8px 16px;\n    border-radius: 8px;\n    font-weight: 700;\n    cursor: pointer;\n  }`;
  } else {
    explanation = 'שדרגתי את עיצוב ה-CSS של הדף והוספתי אזור תוכן מעוצב לפי הבקשה שלך!';
    bodyInner += `\n\n  <section class="ai-highlight-box">\n    <h2>✨ ${reqText}</h2>\n    <p>אזור חדש שנוצר ועוצב אוטומטית על ידי סוכן ה-AI באתר שלך.</p>\n  </section>`;
    styleInner += `\n\n  .ai-highlight-box {\n    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15));\n    border: 1px solid rgba(99, 102, 241, 0.35);\n    border-radius: 16px;\n    padding: 22px;\n    margin: 22px auto;\n    max-width: 680px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);\n  }`;
  }

  const updatedCode = `<body>\n${bodyInner}\n</body>\n\n<style>\n${styleInner}\n</style>`;
  return { explanation, updatedCode, provider: 'Smart Live Code Agent' };
}

app.post('/api/web-track/ai-text', async (req, res) => {
  try {
    const { prompt = '', brandName = 'MySite', topic = 'אתר אינטרנט' } = req.body || {};
    if (!prompt.trim()) {
      return res.status(400).json({ success: false, error: 'נא להזין בקשה לסוכן הטקסט' });
    }

    console.log(`💬 [AI Text Request] שולח בקשה למודל טקסט עבור "${brandName}": "${prompt.trim()}"`);

    const systemPrompt = `אתה מנטור AI ידידותי, קצר וקולע לתלמידים שבונים אתר אינטרנט ב-HTML ו-CSS.
שם האתר של התלמיד: "${brandName}". נושא האתר: "${topic}".
ענה תמיד בעברית ברורה, קצרה, מעשית ומעוצבת היטב (עד 8 שורות), עם דוגמאות קוד HTML/CSS קצרות שמוכנות להדבקה באתר.`;

    const { text, provider } = await callGeminiTextModel(systemPrompt, prompt, {
      maxOutputTokens: 1500
    });
    return res.json({ success: true, reply: text, provider });
  } catch (err) {
    console.error('[WebTrack AI Text Error]:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/web-track/ai-code-edit', async (req, res) => {
  try {
    const { prompt = '', currentCode = '', attachments = [], mode = 'auto' } = req.body || {};
    if (!prompt.trim() && (!Array.isArray(attachments) || attachments.length === 0)) {
      return res.status(400).json({ success: false, error: 'נא להזין הודעה או לצרף קובץ/תמונה לסוכן' });
    }

    console.log(
      `🤖 [AI Live Agent] הודעה: "${prompt.trim()}" | קבצים מצורפים: ${Array.isArray(attachments) ? attachments.length : 0}`
    );

    const attachmentContextLines = [];
    if (Array.isArray(attachments) && attachments.length > 0) {
      attachments.forEach((att, idx) => {
        if (att.type === 'image') {
          attachmentContextLines.push(
            `תמונה מצורפת #${idx + 1} (${att.name || 'image'}): קישור לשימוש בקוד HTML/CSS (בתגית <img> או ב-background-image: url(...)): ${att.publicUrl || 'מצורפת כתמונה'}`
          );
        } else if (att.type === 'file' && att.textContent) {
          attachmentContextLines.push(
            `קובץ מצורף #${idx + 1} (${att.name || 'file'}):\n${String(att.textContent).slice(0, 6000)}`
          );
        }
      });
    }

    const systemPrompt = `You are an interactive AI Web Development Mentor & Live Coding Agent (like Antigravity / Cursor) inside a student's HTML5 + CSS3 IDE.
You can BOTH chat/answer questions in Hebrew AND edit/update the student's live code when requested, as well as inspect attached images and files.

CRITICAL RULES:
1. If the user is asking a question, asking "how do I..." (e.g. "איך אני מוסיף ל-div תמונת רקע?"), or chatting WITHOUT asking you to modify their project code right now (or if mode="${mode}" is "chat"):
   - Answer clearly, warmly, and concisely in Hebrew (include a short HTML/CSS example snippet if helpful).
   - Do NOT output ===CODE_START=== so their editor code remains untouched!
2. If the user asks you to add, change, fix, style, build, or use an attached image/file/URL in their code (or if mode="${mode}" is "edit"):
   - First, write 1-3 short, friendly sentences in Hebrew explaining what you changed or added.
   - Then write the exact delimiter on a new line: ===CODE_START===
   - After ===CODE_START===, output the COMPLETE updated code using clean <body>...</body> and <style>...</style> (and <script>...</script> if needed).
   - Do NOT wrap the code after ===CODE_START=== in \`\`\`html fences.
   - If the user provided an image URL (in text or in an attached image's URL) and asked for a background image, use background-image: url('THE_EXACT_URL'); background-size: cover; background-position: center; on the requested element/section!
   - Always preserve existing parts of the user's code unless asked to replace them.`;

    const userMessage = `הקוד הנוכחי בעורך:\n${currentCode || '<body>\n\n</body>\n<style>\n\n</style>'}${
      attachmentContextLines.length > 0 ? `\n\nקבצים ותמונות שצורפו ע"י המשתמש:\n${attachmentContextLines.join('\n\n')}` : ''
    }\n\nהודעת המשתמש:\n${prompt || 'נתח את הקובץ/התמונה שצירפתי ושלב או הסבר בהתאם.'}`;

    try {
      const { text, provider } = await callGeminiTextModel(systemPrompt, userMessage, {
        maxOutputTokens: 4096,
        attachments
      });

      let explanation = '';
      let updatedCode = '';

      if (text.includes('===CODE_START===')) {
        const parts = text.split('===CODE_START===');
        explanation = (parts[0] || '').trim() || 'הקוד עודכן בהצלחה בלייב בעורך!';
        updatedCode = (parts[1] || '').replace(/===CODE_START===/g, '').replace(/===CODE_END===/g, '');
      } else {
        // Check if the user asked a question vs asked to edit
        const isQuestionOnly =
          mode === 'chat' ||
          (/^(?:איך|מה|למה|מתי|איפה|האם|תסביר|אפשר הסבר|מה ההבדל)/i.test(prompt.trim()) &&
            !/^(?:תוסיף|הוסף|תשנה|שנה|תתקן|תקן|תבנה|בנה|שים|תשים)/i.test(prompt.trim()));

        if (isQuestionOnly) {
          explanation = text.trim();
          updatedCode = '';
        } else {
          const fenceMatch = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
          if (fenceMatch && /<body|<style/i.test(fenceMatch[1])) {
            updatedCode = fenceMatch[1];
            explanation = text.replace(fenceMatch[0], '').trim() || 'הקוד עודכן בהצלחה בלייב בעורך!';
          } else if (/^\s*<body/i.test(text)) {
            updatedCode = text;
            explanation = 'הקוד עודכן בהצלחה בלייב בעורך!';
          } else {
            explanation = text.trim();
          }
        }
      }

      updatedCode = updatedCode
        .replace(/^```(?:html|css|javascript)?\s*/gi, '')
        .replace(/```\s*$/gi, '')
        .trim();

      if (updatedCode || explanation) {
        return res.json({
          success: true,
          explanation: explanation || 'הקוד עודכן בהצלחה בלייב בעורך!',
          updatedCode,
          provider
        });
      }
    } catch (modelErr) {
      console.warn('[WebTrack AI Code Edit] Falling back to Smart Live Code Engine:', modelErr.message);
    }

    const fallback = buildSmartLiveCodeFallback(prompt, currentCode, attachments);
    return res.json({
      success: true,
      explanation: fallback.explanation,
      updatedCode: fallback.updatedCode,
      provider: fallback.provider
    });
  } catch (err) {
    console.error('[WebTrack AI Code Edit Error]:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

async function generateHuggingFaceImage(englishPrompt) {
  const { hfToken } = getActiveGeminiKeys();
  const seed = Math.floor(Math.random() * 1000000);
  const hfSpaces = [
    {
      label: 'Hugging Face (black-forest-labs/FLUX.1-dev)',
      base: 'https://black-forest-labs-flux-1-dev.hf.space',
      endpoint: '/gradio_api/call/infer',
      payload: [englishPrompt, seed, true, 1024, 768, 3.5, 24]
    },
    {
      label: 'Hugging Face (black-forest-labs/FLUX.1-schnell)',
      base: 'https://black-forest-labs-flux-1-schnell.hf.space',
      endpoint: '/gradio_api/call/infer',
      payload: [englishPrompt, seed, true, 1024, 768, 4]
    },
    {
      label: 'Hugging Face (multimodalart/FLUX.1-merged)',
      base: 'https://multimodalart-flux-1-merged.hf.space',
      endpoint: '/gradio_api/call/infer',
      payload: [englishPrompt, seed, true, 1024, 768, 3.5, 8]
    },
    {
      label: 'Hugging Face (stabilityai/stable-diffusion-3.5-large-turbo)',
      base: 'https://stabilityai-stable-diffusion-3-5-large-turbo.hf.space',
      endpoint: '/gradio_api/call/infer',
      payload: [englishPrompt, '', seed, true, 1024, 768, 1.0, 4]
    }
  ];

  const reqHeaders = { 'Content-Type': 'application/json' };
  const getHeaders = {};
  if (hfToken) {
    reqHeaders.Authorization = `Bearer ${hfToken}`;
    getHeaders.Authorization = `Bearer ${hfToken}`;
  }

  for (const space of hfSpaces) {
    try {
      console.log(
        `🚀 [AI Image] פונה למודל: ${space.label} (${hfToken ? 'מאומת עם מפתח HF API' : 'ציבורי'})...`
      );
      const postRes = await axios.post(
        `${space.base}${space.endpoint}`,
        { data: space.payload },
        { headers: reqHeaders, timeout: 12000 }
      );
      const eventId = postRes.data?.event_id;
      if (!eventId) continue;

      const sseRes = await axios.get(`${space.base}${space.endpoint}/${eventId}`, {
        headers: getHeaders,
        responseType: 'text',
        timeout: 24000
      });
      const sseText = String(sseRes.data || '');
      const urlMatch = sseText.match(/"url":\s*"([^"]+)"/);
      if (urlMatch && urlMatch[1]) {
        console.log(`✅ [AI Image] תמונה נוצרה בהצלחה ע"י ${space.label}!`);
        console.log(`🔗 [AI Image URL]: ${urlMatch[1]}`);
        return {
          remoteUrl: urlMatch[1],
          provider: `${space.label}${hfToken ? ' • HF API Key' : ''}`
        };
      }
    } catch (err) {
      console.warn(`⚠️ [WebTrack HF Space] ${space.label} notice:`, err.message);
    }
  }

  return null;
}

app.post('/api/web-track/ai-image', async (req, res) => {
  try {
    const {
      prompt = '',
      brandName = 'MySite',
      topic = '',
      presetId = 'hero'
    } = req.body || {};

    const hostBase = `${req.protocol}://${req.get('host')}`;
    const userRequest = (prompt || '').trim() || `תמונה מקצועית בנושא ${topic} עבור האתר ${brandName}`;
    const isLogoRequest = presetId === 'logo' || userRequest.includes('לוגו') || userRequest.includes('סמל');

    console.log(`\n🖼️ [AI Image Request] בקשה חדשה: "${userRequest}"`);

    // 1. Instant Hebrew -> English translation for Hugging Face FLUX.1-schnell (no OpenRouter, no 22s delay)
    const englishPrompt = await translateHebrewPromptToEnglish(
      userRequest,
      isLogoRequest,
      brandName,
      topic
    );
    console.log(`🌐 [AI Image Prompt Translated]: "${englishPrompt}"`);

    // 2. Generate real image using Hugging Face models (FLUX.1-schnell / FLUX.1-merged / SD 3.5)
    const hfResult = await generateHuggingFaceImage(englishPrompt);
    if (hfResult) {
      const finalUrl = hfResult.localFileName
        ? `${hostBase}/generated_ai_images/${hfResult.localFileName}`
        : hfResult.remoteUrl;
      return res.json({
        success: true,
        url: finalUrl,
        isHuggingFace: true,
        englishPrompt,
        provider: hfResult.provider
      });
    }

    return res.json({
      success: false,
      error: 'לא התקבלה תמונה מ-Hugging Face'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Alias route so legacy /api/web-track/generate-image callers also work seamlessly
app.post('/api/web-track/generate-image', async (req, res) => {
  try {
    const { prompt = '', brandName = 'MySite', topic = '', presetId = 'hero' } = req.body || {};
    const hostBase = `${req.protocol}://${req.get('host')}`;
    const userRequest = (prompt || '').trim() || `תמונה מקצועית בנושא ${topic} עבור האתר ${brandName}`;
    const isLogoRequest = presetId === 'logo' || userRequest.includes('לוגו') || userRequest.includes('סמל');
    const englishPrompt = await translateHebrewPromptToEnglish(userRequest, isLogoRequest, brandName, topic);
    const hfResult = await generateHuggingFaceImage(englishPrompt);
    if (hfResult) {
      const finalUrl = hfResult.localFileName
        ? `${hostBase}/generated_ai_images/${hfResult.localFileName}`
        : hfResult.remoteUrl;
      return res.json({
        success: true,
        url: finalUrl,
        imageUrl: finalUrl,
        translatedPrompt: englishPrompt,
        provider: hfResult.provider
      });
    }
    return res.status(503).json({ success: false, error: 'לא התקבלה תמונה משרת ה-AI כרגע' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 🚀 AI WEB BUILDER STUDIO (25-Session 100% Prompt-Driven Web Track)
// Supports multi-turn history, multi-page context, X-Ray explain mode & Demo Day live publish
// ============================================================================
const publishedSitesDir = path.join(__dirname, '..', 'public', 'published_sites');
if (!fs.existsSync(publishedSitesDir)) {
  fs.mkdirSync(publishedSitesDir, { recursive: true });
}
app.use('/published_sites', express.static(publishedSitesDir));

function buildStudioSmartFallback({ prompt = '', currentCode = '', activePage = 'index.html', brandName = 'המשחק שלי', topic = 'משחק ארקייד', mode = 'build', attachments = [] }) {
  const reqText = String(prompt || '').trim();
  if (mode === 'explain') {
    return {
      explanation: `🔍 **הצצה מאחורי הקלעים של "${brandName}":**\n\nהמשחק שלך בנוי מ-3 חלקים פשוטים:\n1. **עיצוב ומסכים (HTML + CSS):** מסך הפתיחה, לוח הניקוד, מסך הניצחון וכפתור "שחק שוב".\n2. **במת המשחק (Canvas):** האזור שבו הדמות, המכשולים, החלקיקים והרקע מצוירים ב-60 פריימים לשנייה.\n3. **מוח המשחק (JavaScript):** חוקי התנועה, התנגשויות, ניקוד, שעון זמן וצלילי Web Audio.\n\n💡 תוכל לעבור למצב **🎮 בנה ושדרג משחק** ולבקש כל שינוי או שדרוג שתרצה!`,
      updatedCode: '',
      provider: 'SmartStart AI Game Mentor'
    };
  }

  const hasExistingGame = /<canvas|<script[\s\S]{300,}<\/script>/i.test(currentCode || '') && (currentCode || '').length > 500;
  if (!hasExistingGame) {
    const safeTitle = String(brandName || 'המשחק שלי').replace(/[<>"']/g, '');
    const starterGame = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Heebo', sans-serif; background: radial-gradient(circle at top, #1e1b4b, #090d16 70%); color: #f8fafc; overflow: hidden; user-select: none; }
    .glass { background: rgba(15, 23, 42, 0.72); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.12); }
    canvas { touch-action: none; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-3">
  <div class="w-full max-w-3xl flex flex-col gap-3">
    <div class="glass rounded-2xl px-4 py-2.5 flex items-center justify-between text-sm font-bold shadow-xl">
      <div class="flex items-center gap-3">
        <span class="text-cyan-300 text-base font-black">🎮 ${safeTitle}</span>
        <span id="hudScore" class="bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 px-3 py-1 rounded-full">ניקוד: 0</span>
        <span id="hudBest" class="bg-amber-500/20 border border-amber-400/40 text-amber-200 px-3 py-1 rounded-full">🏆 שיא: 0</span>
      </div>
      <div class="flex items-center gap-2">
        <span id="hudTime" class="bg-purple-500/20 border border-purple-400/40 text-purple-200 px-3 py-1 rounded-full">⏱️ 45 שנ׳</span>
        <button id="muteBtn" onclick="toggleMute()" class="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg cursor-pointer">🔊</button>
      </div>
    </div>

    <div class="relative rounded-3xl overflow-hidden border border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.65)] bg-slate-950">
      <canvas id="gameCanvas" width="800" height="460" class="w-full h-auto block"></canvas>

      <div id="startOverlay" class="absolute inset-0 glass flex flex-col items-center justify-center text-center p-6">
        <span class="px-4 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-extrabold mb-3">✨ משחק AI מקורי</span>
        <h1 class="text-3xl sm:text-4xl font-black text-white mb-2">${safeTitle}</h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-md mb-6">זוזו בחיצים (או עכבר/אצבע), אספו כוכבי אנרגיה והתחמקו ממטאורים אדומים! שרדו 45 שניות או הגיעו ל-200 נקודות כדי לנצח!</p>
        <button onclick="startGame()" class="px-8 py-3.5 rounded-2xl bg-gradient-to-l from-cyan-400 to-purple-500 text-slate-950 font-black text-lg shadow-[0_0_30px_rgba(34,211,238,0.45)] hover:scale-105 transition cursor-pointer">🚀 התחל משחק</button>
      </div>

      <div id="endOverlay" class="hidden absolute inset-0 glass flex flex-col items-center justify-center text-center p-6">
        <div id="endEmoji" class="text-5xl mb-2">🏆</div>
        <h2 id="endTitle" class="text-3xl sm:text-4xl font-black text-white mb-2">ניצחת!</h2>
        <p id="endStats" class="text-cyan-200 text-lg font-bold mb-6"></p>
        <button onclick="startGame()" class="px-8 py-3 rounded-2xl bg-gradient-to-l from-emerald-400 to-cyan-400 text-slate-950 font-black text-base hover:scale-105 transition cursor-pointer">🔄 שחק שוב</button>
      </div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let running = false, muted = false, score = 0, timeLeft = 45, lastTick = 0, shake = 0;
    let bestScore = Number(localStorage.getItem('smartstart_game_best_${safeTitle.slice(0, 12)}') || 0);
    document.getElementById('hudBest').textContent = '🏆 שיא: ' + bestScore;

    const player = { x: 400, y: 380, r: 22, vx: 0, speed: 6.5 };
    const keys = {};
    let stars = [], meteors = [], particles = [];

    function beep(freq, dur, type = 'sine') {
      if (muted) return;
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.value = freq; g.gain.value = 0.08;
        o.connect(g); g.connect(ac.destination); o.start();
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
        o.stop(ac.currentTime + dur);
      } catch(e) {}
    }
    function toggleMute() { muted = !muted; document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊'; }

    function spawnParticles(x, y, color, count = 14) {
      for (let i = 0; i < count; i++) {
        particles.push({ x, y, vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7, life: 1, color });
      }
    }

    function startGame() {
      running = true; score = 0; timeLeft = 45; shake = 0;
      player.x = canvas.width / 2; stars = []; meteors = []; particles = [];
      document.getElementById('startOverlay').classList.add('hidden');
      document.getElementById('endOverlay').classList.add('hidden');
      document.getElementById('hudScore').textContent = 'ניקוד: 0';
      document.getElementById('hudTime').textContent = '⏱️ 45 שנ׳';
      lastTick = performance.now();
      beep(520, 0.12, 'triangle');
      requestAnimationFrame(loop);
    }

    function finishGame(won) {
      running = false;
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('smartstart_game_best_${safeTitle.slice(0, 12)}', bestScore);
        document.getElementById('hudBest').textContent = '🏆 שיא: ' + bestScore;
      }
      document.getElementById('endEmoji').textContent = won ? '🏆🎉' : '💥';
      document.getElementById('endTitle').textContent = won ? '🏆 ניצחת!' : 'נפסלת — נסה שוב!';
      document.getElementById('endStats').textContent = 'ניקוד סופי: ' + score + ' | שיא אישי: ' + bestScore;
      document.getElementById('endOverlay').classList.remove('hidden');
      beep(won ? 760 : 180, 0.35, won ? 'triangle' : 'sawtooth');
    }

    function loop(now) {
      if (!running) return;
      const dt = Math.min((now - lastTick) / 1000, 0.05);
      lastTick = now;
      timeLeft -= dt;
      document.getElementById('hudTime').textContent = '⏱️ ' + Math.max(0, Math.ceil(timeLeft)) + ' שנ׳';
      if (timeLeft <= 0 || score >= 200) { finishGame(true); return; }

      if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
      if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
      player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x));

      if (Math.random() < 0.045) stars.push({ x: Math.random() * (canvas.width - 40) + 20, y: -20, r: 13, vy: 3 + Math.random() * 2.5 });
      if (Math.random() < 0.038) meteors.push({ x: Math.random() * (canvas.width - 40) + 20, y: -20, r: 17, vy: 3.6 + Math.random() * 3 });

      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= 0.85; }
      ctx.fillStyle = '#070b14'; ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw glowing player
      const pg = ctx.createRadialGradient(player.x, player.y, 4, player.x, player.y, player.r * 1.5);
      pg.addColorStop(0, '#38bdf8'); pg.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(player.x, player.y, player.r * 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();

      stars = stars.filter(s => {
        s.y += s.vy;
        ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        if (Math.hypot(s.x - player.x, s.y - player.y) < s.r + player.r) {
          score += 15; document.getElementById('hudScore').textContent = 'ניקוד: ' + score;
          spawnParticles(s.x, s.y, '#facc15', 14); beep(680, 0.09); return false;
        }
        return s.y < canvas.height + 30;
      });

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]; m.y += m.vy;
        ctx.fillStyle = '#f43f5e'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
        if (Math.hypot(m.x - player.x, m.y - player.y) < m.r + player.r - 4) {
          shake = 14; spawnParticles(player.x, player.y, '#f43f5e', 24); finishGame(false); ctx.restore(); return;
        }
        if (m.y > canvas.height + 30) meteors.splice(i, 1);
      }

      particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.04;
        ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; return p.life > 0;
      });

      ctx.restore();
      requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
    canvas.addEventListener('pointermove', e => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      player.x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    });
  </script>
</body>
</html>`;
    return {
      explanation: `בניתי עבורך את גרסת הפתיחה המהירה והיפה של **"${safeTitle}"**! 🎮✨\nאפשר כבר לשחק מיד (עם החיצים או העכבר), וכל הזמן לשדרג אותו בפרומפטים נוספים — תוספת כוחות-על, בוס, צלילים, תמונות AI או שינוי חוקי המשחק!`,
      updatedCode: starterGame,
      provider: 'SmartStart AI Game Engine'
    };
  }

  const fb = buildSmartLiveCodeFallback(reqText, currentCode, attachments);
  return fb;
}

app.post('/api/ai-web-studio/chat', async (req, res) => {
  try {
    const {
      prompt = '',
      currentCode = '',
      activePage = 'index.html',
      allPageNames = ['index.html'],
      brandName = 'המשחק שלי',
      topic = 'משחק דפדפן',
      sessionTitle = '',
      mode = 'build', // 'build' | 'explain' | 'auto'
      history = [],
      attachments = []
    } = req.body || {};

    if (!prompt.trim() && (!Array.isArray(attachments) || attachments.length === 0)) {
      return res.status(400).json({ success: false, error: 'נא לכתוב פרומפט או לצרף תמונה לסוכן ה-AI' });
    }

    console.log(`🎮 [AI Game Studio] page=${activePage} | mode=${mode} | game="${brandName}" | prompt="${prompt.trim().slice(0, 90)}"`);

    const attachmentContextLines = [];
    if (Array.isArray(attachments) && attachments.length > 0) {
      attachments.forEach((att, idx) => {
        if (att.type === 'image') {
          attachmentContextLines.push(
            `תמונה מצורפת #${idx + 1} (${att.name || 'image'}): השתמש בכתובת המדויקת הזו בתוך המשחק (ב-Image() ב-Canvas, ב-<img> או ב-background-image): ${att.publicUrl || 'מצורפת כתמונה'}`
          );
        } else if (att.type === 'file' && att.textContent) {
          attachmentContextLines.push(
            `קובץ מצורף #${idx + 1} (${att.name || 'file'}):\n${String(att.textContent).slice(0, 6000)}`
          );
        }
      });
    }

    const pagesListText = Array.isArray(allPageNames) && allPageNames.length > 0
      ? allPageNames.join(', ')
      : activePage;

    const systemPrompt = `You are SmartStart AI Game Studio — an elite, ultra-creative Hebrew-first Indie Game & Web Developer helping students in a fun 90-minute AI Game Creation & Classroom Tournament Workshop!

PROJECT CONTEXT:
- Game / Project Name: "${brandName}"
- Concept / Theme: "${topic}"
- Active File: "${activePage}" (All files: ${pagesListText})
${sessionTitle ? `- Context: "${sessionTitle}"` : ''}

CRITICAL OPERATING MODES:
1. If mode is "explain":
   - Explain clearly, warmly, and simply in Hebrew how the game works or suggest cool upgrades (3-4 short bullets).
   - Do NOT output ===CODE_START=== so the game stays untouched.

2. If mode is "build" (or "auto"):
   - First, write 2-3 enthusiastic, short sentences in Hebrew explaining what you built or upgraded, plus 1 fun upgrade idea they can try next!
   - Then output on its own line: ===CODE_START===
   - After ===CODE_START===, output a COMPLETE, self-contained, immediately playable HTML5 document (\`<!DOCTYPE html><html lang="he" dir="rtl">...</html>\`).
   - NEVER wrap code after ===CODE_START=== in markdown \`\`\` fences.
   - PREMIUM VISUAL QUALITY (GEMINI-CLASS CRAFT):
     * Include Google Font \`Heebo\` and Tailwind CSS CDN (\`<script src="https://cdn.tailwindcss.com"></script>\`) so the UI, HUD, start screen, overlays, buttons, and victory/high-score screens look stunning, vibrant, modern, and glassmorphic!
     * Use smooth 60fps \`requestAnimationFrame\` HTML5 Canvas (or rich interactive SVG/DOM/Three.js if requested), glowing effects, particle bursts, smooth animations, and responsive scaling so the game fits cleanly inside ANY viewport without awkward scrolling!
   - TOURNAMENT-READY GAMEPLAY EXCELLENCE:
     * Support WHATEVER winning/competition style the student chose:
       - Clear Victory screen (\`🏆 ניצחת!\`) for win-goal / boss / escape / level games,
       - Live survival countdown/stopwatch & best time record for survival games ("לשרוד בלי להיפסל"),
       - High-Score countdown & Top-5 localStorage leaderboard for high-score games ("להגיע להכי הרבה נקודות")!
     * Always include a clean Start Screen with 1-line Hebrew controls instructions ("זזים בחיצים..."), clear live HUD (score/timer/lives/high-score), and an instant "🔄 שחק שוב" button on Win/Game Over!
     * Never use ugly browser \`alert()\` — use sleek in-game overlays and Toast badges!
     * For sound effects, use crisp synthesized **Web Audio API** sounds (never broken external MP3s) with a working 🔊/🔇 mute button!
   - PRESERVATION RULE: When the student ALREADY has a working game in "${activePage}", PRESERVE everything that works (visuals, controls, high scores, sounds, images) and apply their requested upgrade/fix cleanly without breaking gameplay!
   - IMAGES: If an attached or AI-generated image URL is given, load and draw that EXACT URL seamlessly in the game (with clean fallback if image fails to load).`;

    const userMessage = `הקוד הנוכחי במשחק ("${activePage}"):
${currentCode && currentCode.trim() ? currentCode : '(קובץ חדש וריק — בנה משחק שלם, יפה ומהנה מאפס לפי בקשת התלמיד!)'}
${attachmentContextLines.length > 0 ? `\nתמונות וקבצים שצורפו:\n${attachmentContextLines.join('\n\n')}` : ''}

פרומפט התלמיד:
${prompt || 'שלב את התמונה שצירפתי בצורה יפה בתוך המשחק!'}`;

    try {
      const { text, provider } = await callGeminiTextModel(systemPrompt, userMessage, {
        maxOutputTokens: 8192,
        attachments,
        history
      });

      let explanation = '';
      let updatedCode = '';

      if (mode === 'explain') {
        explanation = text.replace(/===CODE_START===[\s\S]*/g, '').trim();
      } else if (text.includes('===CODE_START===')) {
        const parts = text.split('===CODE_START===');
        explanation = (parts[0] || '').trim() || `עדכנתי את העמוד ${activePage} בלייב לפי הפרומפט שלך! ✨`;
        updatedCode = (parts[1] || '').replace(/===CODE_START===/g, '').replace(/===CODE_END===/g, '');
      } else {
        const fenceMatch = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
        if (fenceMatch && /<!doctype|<html|<body|<style/i.test(fenceMatch[1])) {
          updatedCode = fenceMatch[1];
          explanation = text.replace(fenceMatch[0], '').trim() || `עדכנתי את העמוד ${activePage} בלייב! ✨`;
        } else if (/^\s*(?:<!doctype|<html|<body)/i.test(text)) {
          updatedCode = text;
          explanation = `בניתי ועדכנתי את העמוד ${activePage} בלייב! ✨`;
        } else {
          explanation = text.trim();
        }
      }

      updatedCode = updatedCode
        .replace(/^```(?:html|css|javascript)?\s*/gi, '')
        .replace(/```\s*$/gi, '')
        .trim();

      if (updatedCode || explanation) {
        return res.json({
          success: true,
          explanation: explanation || `העמוד ${activePage} עודכן בהצלחה!`,
          updatedCode,
          provider
        });
      }
    } catch (modelErr) {
      console.warn('[AI Web Studio] Model fallback triggered:', modelErr.message);
    }

    const fallback = buildStudioSmartFallback({
      prompt,
      currentCode,
      activePage,
      brandName,
      topic,
      mode,
      attachments
    });

    return res.json({
      success: true,
      explanation: fallback.explanation,
      updatedCode: fallback.updatedCode,
      provider: fallback.provider
    });
  } catch (err) {
    console.error('[AI Web Studio Chat Error]:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Publish multi-page student website to a real shareable URL for Demo Day
app.post('/api/ai-web-studio/publish', (req, res) => {
  try {
    const { brandName = 'mysite', studentName = 'student', pages = {} } = req.body || {};
    const pageEntries = Object.entries(pages || {}).filter(([name, html]) => name && typeof html === 'string' && html.trim());
    if (pageEntries.length === 0) {
      return res.status(400).json({ success: false, error: 'אין עמודים לפרסום באתר' });
    }

    const rawSlug = `${brandName}-${studentName}`
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32) || 'site';
    const siteId = `${rawSlug}-${Date.now().toString(36)}`;
    const siteDir = path.join(publishedSitesDir, siteId);
    fs.mkdirSync(siteDir, { recursive: true });

    let entryFile = 'index.html';
    pageEntries.forEach(([rawName, htmlContent], idx) => {
      const safeFile = path.basename(String(rawName)).replace(/[^a-zA-Z0-9._-]/g, '_') || `page${idx + 1}.html`;
      const finalFile = safeFile.endsWith('.html') ? safeFile : `${safeFile}.html`;
      if (idx === 0 && !pages['index.html']) {
        entryFile = finalFile;
      }
      fs.writeFileSync(path.join(siteDir, finalFile), htmlContent, 'utf8');
    });

    const hostBase = `${req.protocol}://${req.get('host')}`;
    const liveUrl = `${hostBase}/published_sites/${siteId}/${entryFile}`;
    console.log(`🌐 [AI Web Studio Publish] אתר פורסם בהצלחה: ${liveUrl}`);
    return res.json({
      success: true,
      siteId,
      liveUrl,
      pagesCount: pageEntries.length
    });
  } catch (err) {
    console.error('[AI Web Studio Publish Error]:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static React build files if present
const buildDir = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res, next) => {
    // Don't intercept API or static asset endpoints
    if (
      req.path.startsWith('/compile') ||
      req.path.startsWith('/upload') ||
      req.path.startsWith('/ports') ||
      req.path.startsWith('/send-code-email') ||
      req.path.startsWith('/api') ||
      req.path.startsWith('/published_sites') ||
      req.path.startsWith('/generated_ai_images')
    ) {
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