import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import MonacoEditor from 'react-monaco-editor';
import 'blockly/javascript';
import { registerAllBlocks, registerFallbackBlock } from './blockRegistry';
import AIBlockGeneratorModal from './AIBlockGeneratorModal';
import FlashingModal from './FlashingModal';
import DriverModal from './DriverModal';
import SendCodeModal from './SendCodeModal';
import SavedProjectModal from './SavedProjectModal';
import SubscriptionModal, { isTrackUnlocked } from './SubscriptionModal';
import ComPortStatusBadge from './ComPortStatusBadge';
import { SMARTHOUSE_HERO } from './projectImages';
import { SMARTHOUSE_H_CODE, SMARTHOUSE_CPP_CODE, SMARTHOUSE_INO_FULL_CODE, mergeSmartHouseBlocks } from './smarthouseCode';

// Base Keyestudio Docs CDN Image URL
const KEYESTUDIO_IMG_BASE = 'https://docs.keyestudio.com/projects/KS5009/en/latest/_images/';

// Pre-register all system blocks at top-level module evaluation
registerAllBlocks();

// =========================================================================
// REGISTER ALL SMART HOUSE BLOCKS IN ONE PLACE (EXACT MATCH TO SYSTEM DESIGN)
// =========================================================================
function registerSmartHouseBasicBlocks() {

  // --- 0. 4 CORE STRUCTURAL SECTION BLOCKS (GLOBALS, SETUP, LOOP, BOTTOM) + FIREBASE DEFINES ---
  Blockly.Blocks['smarthouse_block_globals'] = {
    init: function() {
      this.appendDummyInput().appendField("📌 (מעל setup): משתנים והגדרות עליונות");
      this.appendStatementInput("GLOBALS");
      this.setColour('#6366f1');
      this.setTooltip("הגדרות ומשתנים גלובליים מעל פונקציית setup");
    }
  };
  javascriptGenerator.forBlock['smarthouse_block_globals'] = function(block) {
    const code = javascriptGenerator.statementToCode(block, 'GLOBALS');
    return `// ___BLOCK_GLOBALS_START___\n${code}\n// ___BLOCK_GLOBALS_END___\n`;
  };

  Blockly.Blocks['smarthouse_block_setup'] = {
    init: function() {
      this.appendDummyInput().appendField("⚡ (setup): פעם אחת בדיוק");
      this.appendStatementInput("SETUP");
      this.setColour('#3b82f6');
      this.setTooltip("פונקציית setup - מורצת פעם אחת בלבד בעת הפעלת הבקר");
    }
  };
  javascriptGenerator.forBlock['smarthouse_block_setup'] = function(block) {
    const code = javascriptGenerator.statementToCode(block, 'SETUP');
    return `// ___BLOCK_SETUP_START___\n${code}\n// ___BLOCK_SETUP_END___\n`;
  };

  Blockly.Blocks['smarthouse_block_loop'] = {
    init: function() {
      this.appendDummyInput().appendField("🔁 (loop): בלולאה אינסופית");
      this.appendStatementInput("LOOP");
      this.setColour('#8b5cf6');
      this.setTooltip("פונקציית loop - מורצת שוב ושוב בלולאה אינסופית");
    }
  };
  javascriptGenerator.forBlock['smarthouse_block_loop'] = function(block) {
    const code = javascriptGenerator.statementToCode(block, 'LOOP');
    return `// ___BLOCK_LOOP_START___\n${code}\n// ___BLOCK_LOOP_END___\n`;
  };

  Blockly.Blocks['smarthouse_block_bottom'] = {
    init: function() {
      this.appendDummyInput().appendField("⚙️ (מתחת ל-loop): פונקציות וקוד נוסף");
      this.appendStatementInput("BOTTOM_FUNCTIONS");
      this.setColour('#0ea5e9');
      this.setTooltip("פונקציות עזר וקוד הממוקם מתחת לפונקציית ה-loop הראשית");
    }
  };
  javascriptGenerator.forBlock['smarthouse_block_bottom'] = function(block) {
    const code = javascriptGenerator.statementToCode(block, 'BOTTOM_FUNCTIONS');
    return `// ___BLOCK_BOTTOM_START___\n${code}\n// ___BLOCK_BOTTOM_END___\n`;
  };

  Blockly.Blocks['firebase_wifi_defines'] = {
    init: function() {
      this.appendDummyInput().appendField("🔥 הגדרות רשת ו-Firebase (#define)");
      this.appendDummyInput().appendField("שם רשת WiFi (SSID):").appendField(new Blockly.FieldTextInput("alina"), "SSID");
      this.appendDummyInput().appendField("סיסמת WiFi:").appendField(new Blockly.FieldTextInput("0523611662"), "PASS");
      this.appendDummyInput().appendField("כתובת Database URL:").appendField(new Blockly.FieldTextInput("smarthouse-85b56-default-rtdb.firebaseio.com"), "URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ea580c');
      this.setTooltip("מגדיר קבועי רשת WiFi וכתובת בסיס נתונים בענן");
    }
  };
  javascriptGenerator.forBlock['firebase_wifi_defines'] = function(block) {
    const ssid = block.getFieldValue('SSID') || 'alina';
    const pass = block.getFieldValue('PASS') || '0523611662';
    const url = block.getFieldValue('URL') || 'smarthouse-85b56-default-rtdb.firebaseio.com';
    return `#define WIFI_SSID "${ssid}"\n#define WIFI_PASSWORD "${pass}"\n#define DATABASE_URL "${url}"\n`;
  };

  // --- 1. FUNCTION DEFINITIONS (PURPLE BLOCKS WITH STATEMENT INPUT) ---
  const defineFunctionBlock = (id, label, funcName) => {
    Blockly.Blocks[id] = {
      init: function() {
        this.appendDummyInput().appendField(label);
        this.appendStatementInput("STATEMENTS").setCheck(null).appendField("בלוקים");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip(`מגדיר את הפונקציה ${funcName}`);
      }
    };
    javascriptGenerator.forBlock[id] = function(block) {
      const statements = javascriptGenerator.statementToCode(block, 'STATEMENTS') || '';
      return `void ${funcName}() {\n${statements}}\n`;
    };
  };

  defineFunctionBlock('gass_function', 'פונקציה: בדיקת גז', 'checkGas');
  defineFunctionBlock('motion_sensor_function', 'פונקציה: בדיקת חיישן תנועה', 'checkMotion');
  defineFunctionBlock('light_sensor_function', 'פונקציה: בדיקת חיישן אור', 'checkLight');
  defineFunctionBlock('temp_function', 'פונקציה: בדיקת טמפרטורה', 'checkTemperature');
  defineFunctionBlock('activate_alarm_function', 'פונקציה: הפעלה/כיבוי אזעקה', 'activateAlarm');
  defineFunctionBlock('open_window_function', 'פונקציה: פתיחת/סגירת חלון', 'openWindow');
  defineFunctionBlock('open_door_function', 'פונקציה: פתיחת/סגירת דלת', 'openDoor');

  // --- 2. FUNCTION CALLS (PURPLE SIMPLE STATEMENT BLOCKS) ---
  const defineCallBlock = (id, label, codeToRun) => {
    Blockly.Blocks[id] = {
      init: function() {
        this.appendDummyInput().appendField(label);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip(`קריאה לפונקציה: ${label}`);
      }
    };
    javascriptGenerator.forBlock[id] = function() {
      return `${codeToRun}\n`;
    };
  };

  defineCallBlock('call_gass_function', 'קריאה לפונקציה: בדיקת גז', 'checkGas();');
  defineCallBlock('call_motion_sensor_function', 'קריאה לפונקציה: בדיקת חיישן תנועה', 'checkMotion();');
  defineCallBlock('call_light_sensor_function', 'קריאה לפונקציה: בדיקת חיישן אור', 'checkLight();');
  defineCallBlock('call_temp_function', 'קריאה לפונקציה: בדיקת טמפרטורה', 'checkTemperature();');
  defineCallBlock('call_activate_alarm_function', 'קריאה לפונקציה: הפעלת אזעקה', 'activateAlarm();');
  defineCallBlock('call_open_window_function', 'קריאה לפונקציה: פתיחת/סגירת חלון', 'openWindow();');
  defineCallBlock('call_open_door_function', 'קריאה לפונקציה: פתיחה/סגירת דלת', 'openDoor();');

  // Call Handle Button Presses (With Ports and 4-Digit Code)
  Blockly.Blocks['call_handle_button_presses'] = {
    init: function() {
      this.appendDummyInput().appendField("טפל בלחיצות כפתורים וקוד סודי");
      this.appendValueInput("PORT1").setCheck("Number").appendField("פורט 1");
      this.appendValueInput("PORT2").setCheck("Number").appendField("פורט 2");
      this.appendValueInput("CODE1").setCheck("Number").appendField("קוד 1");
      this.appendValueInput("CODE2").setCheck("Number").appendField("קוד 2");
      this.appendValueInput("CODE3").setCheck("Number").appendField("קוד 3");
      this.appendValueInput("CODE4").setCheck("Number").appendField("קוד 4");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("בודק לחיצות על כפתורי הקיר ומזין קוד סודי לפתיחת הדלת");
    }
  };
  javascriptGenerator.forBlock['call_handle_button_presses'] = function(block) {
    const port1 = javascriptGenerator.valueToCode(block, 'PORT1', javascriptGenerator.ORDER_ATOMIC) || '16';
    const port2 = javascriptGenerator.valueToCode(block, 'PORT2', javascriptGenerator.ORDER_ATOMIC) || '27';
    const code1 = javascriptGenerator.valueToCode(block, 'CODE1', javascriptGenerator.ORDER_ATOMIC) || '8';
    const code2 = javascriptGenerator.valueToCode(block, 'CODE2', javascriptGenerator.ORDER_ATOMIC) || '7';
    const code3 = javascriptGenerator.valueToCode(block, 'CODE3', javascriptGenerator.ORDER_ATOMIC) || '5';
    const code4 = javascriptGenerator.valueToCode(block, 'CODE4', javascriptGenerator.ORDER_ATOMIC) || '4';
    return `handleButtonPresses(${port1}, ${port2}, ${code1}, ${code2}, ${code3}, ${code4});\n`;
  };

  // --- 3. STRUCTURE & DELAY BLOCKS (GREEN) ---
  Blockly.Blocks['infinite_loop'] = {
    init: function() {
      this.appendDummyInput().appendField("Arduino Code");
      this.appendStatementInput("SETUP").setCheck(null).appendField("פעם אחת");
      this.appendStatementInput("LOOP").setCheck(null).appendField("לעולמים");
      this.setColour(120);
      this.setTooltip("מבנה קוד ארדואינו: Setup רץ פעם אחת ו-Loop רץ בלולאה אינסופית");
    }
  };
  javascriptGenerator.forBlock['infinite_loop'] = function(block) {
    const setupCode = javascriptGenerator.statementToCode(block, 'SETUP') || '';
    const loopCode = javascriptGenerator.statementToCode(block, 'LOOP') || '';
    return `// ___BLOCK_SETUP_START___\n${setupCode}\n// ___BLOCK_SETUP_END___\n// ___BLOCK_LOOP_START___\n${loopCode}\n// ___BLOCK_LOOP_END___\n`;
  };

  Blockly.Blocks['delay_seconds'] = {
    init: function() {
      this.appendValueInput("SECONDS").setCheck("Number").appendField("חכה");
      this.appendDummyInput().appendField("שניות");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(70);
      this.setTooltip("משהה את ריצת התוכנית למספר שניות");
    }
  };
  javascriptGenerator.forBlock['delay_seconds'] = function(block) {
    const seconds = javascriptGenerator.valueToCode(block, 'SECONDS', javascriptGenerator.ORDER_ATOMIC) || '1';
    return `delay(${seconds} * 1000);\n`;
  };

  // --- 4. LCD DISPLAY BLOCKS (GREEN / TEAL) ---
  Blockly.Blocks['lcd_display_text'] = {
    init: function() {
      this.appendDummyInput().appendField("הדפסה למסך");
      this.appendValueInput("FIRST_TEXT").setCheck("String").appendField("שורה 1 - טקסט");
      this.appendValueInput("SECOND_TEXT").setCheck("String").appendField("שורה 2 - טקסט");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מדפיס טקסט על ה-LCD בשתי שורות");
    }
  };
  javascriptGenerator.forBlock['lcd_display_text'] = function(block) {
    const firstText = javascriptGenerator.valueToCode(block, 'FIRST_TEXT', javascriptGenerator.ORDER_ATOMIC) || '""';
    const secondText = javascriptGenerator.valueToCode(block, 'SECOND_TEXT', javascriptGenerator.ORDER_ATOMIC) || '""';
    return `printLCD(${firstText}, ${secondText});\n`;
  };

  Blockly.Blocks['call_printlcdint'] = {
    init: function() {
      this.appendDummyInput().appendField("הדפסה למסך");
      this.appendValueInput("FIRST_TEXT").setCheck("Number").appendField("שורה 1 - מספר");
      this.appendValueInput("SECOND_TEXT").setCheck("String").appendField("שורה 2 - טקסט");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מדפיס מספר בשורה הראשונה וטקסט בשורה השנייה");
    }
  };
  javascriptGenerator.forBlock['call_printlcdint'] = function(block) {
    const firstText = javascriptGenerator.valueToCode(block, 'FIRST_TEXT', javascriptGenerator.ORDER_ATOMIC) || '0';
    const secondText = javascriptGenerator.valueToCode(block, 'SECOND_TEXT', javascriptGenerator.ORDER_ATOMIC) || '""';
    return `printLCDINT(${firstText}, ${secondText});\n`;
  };

  Blockly.Blocks['lcd_clear'] = {
    init: function() {
      this.appendDummyInput().appendField("נקה מסך");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מנקה את תצוגת מסך ה-LCD");
    }
  };
  javascriptGenerator.forBlock['lcd_clear'] = function() {
    return 'lcd.clear();\n';
  };

  Blockly.Blocks['lcd_set_cursor'] = {
    init: function() {
      this.appendValueInput("COLUMN").setCheck("Number").appendField("עדכן עמודה");
      this.appendValueInput("ROW").setCheck("Number").appendField("עדכן שורה");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מציב את סמן ה-LCD בעמודה ושורה מבוקשים");
    }
  };
  javascriptGenerator.forBlock['lcd_set_cursor'] = function(block) {
    const column = javascriptGenerator.valueToCode(block, 'COLUMN', javascriptGenerator.ORDER_ATOMIC) || '0';
    const row = javascriptGenerator.valueToCode(block, 'ROW', javascriptGenerator.ORDER_ATOMIC) || '0';
    return `lcd.setCursor(${column}, ${row});\n`;
  };

  Blockly.Blocks['lcd_multi_print'] = {
    init: function() {
      this.appendDummyInput().appendField("הצגת נתוני חיישנים");
      this.appendValueInput("LABEL1").setCheck("String").appendField("תווית 1");
      this.appendValueInput("VALUE1").setCheck("Number").appendField("חיישן אור");
      this.appendValueInput("LABEL2").setCheck("String").appendField("תווית 2");
      this.appendValueInput("VALUE2").setCheck("Number").appendField("חיישן גז");
      this.appendValueInput("LABEL3").setCheck("String").appendField("תווית 3");
      this.appendValueInput("VALUE3").setCheck("Number").appendField("חיישן תנועה");
      this.appendValueInput("LABEL4").setCheck("String").appendField("תווית 4");
      this.appendValueInput("VALUE4").setCheck("Number").appendField("טמפרטורה");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מציג 4 תוויות ו-4 ערכי חיישנים במסך ה-LCD בו-זמנית");
    }
  };
  javascriptGenerator.forBlock['lcd_multi_print'] = function(block) {
    const label1 = javascriptGenerator.valueToCode(block, 'LABEL1', javascriptGenerator.ORDER_ATOMIC) || '"L"';
    const value1 = javascriptGenerator.valueToCode(block, 'VALUE1', javascriptGenerator.ORDER_ATOMIC) || '0';
    const label2 = javascriptGenerator.valueToCode(block, 'LABEL2', javascriptGenerator.ORDER_ATOMIC) || '"G"';
    const value2 = javascriptGenerator.valueToCode(block, 'VALUE2', javascriptGenerator.ORDER_ATOMIC) || '0';
    const label3 = javascriptGenerator.valueToCode(block, 'LABEL3', javascriptGenerator.ORDER_ATOMIC) || '"M"';
    const value3 = javascriptGenerator.valueToCode(block, 'VALUE3', javascriptGenerator.ORDER_ATOMIC) || '0';
    const label4 = javascriptGenerator.valueToCode(block, 'LABEL4', javascriptGenerator.ORDER_ATOMIC) || '"T"';
    const value4 = javascriptGenerator.valueToCode(block, 'VALUE4', javascriptGenerator.ORDER_ATOMIC) || '0';
    return `display7Values(${label1}, ${value1}, ${label2}, ${value2}, ${label3}, ${value3}, ${label4}, ${value4});\n`;
  };

  Blockly.Blocks['update_lcd_password'] = {
    init: function() {
      this.appendDummyInput().appendField("עדכן תצוגת קוד סודי ב-LCD");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מעדכן את 4 ספרות הקוד והסמן במסך");
    }
  };
  javascriptGenerator.forBlock['update_lcd_password'] = function() {
    return 'updateLCDPassword();\n';
  };

  Blockly.Blocks['reset_code_entry'] = {
    init: function() {
      this.appendDummyInput().appendField("איפוס הזנת קוד סודי");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("מאפס את הזנת הקוד ומנקה את המסך להזנה מחדש");
    }
  };
  javascriptGenerator.forBlock['reset_code_entry'] = function() {
    return 'resetCodeEntry();\n';
  };

  // --- 5. SENSORS & VALUE-RETURNING BLOCKS (BLUE / TEAL OUTPUTS) ---
  Blockly.Blocks['get_gas_sensor_value_with_pin'] = {
    init: function() {
      this.appendDummyInput().appendField("קבלת מידע מחיישן גז");
      this.appendValueInput("PIN").setCheck("Number").appendField("מספר פורט");
      this.appendDummyInput().appendField("(ערך)");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(210);
      this.setTooltip("קורא ערך מחיישן גז המחובר לפין שצוין (getGasSensorValue)");
    }
  };
  javascriptGenerator.forBlock['get_gas_sensor_value_with_pin'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '23';
    return [`getGasSensorValue(${pin})`, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  Blockly.Blocks['get_steam_sensor_temperature_with_pin'] = {
    init: function() {
      this.appendDummyInput().appendField("קבלת מידע מחיישן טמפרטורה");
      this.appendValueInput("PIN").setCheck("Number").appendField("מספר פורט");
      this.appendDummyInput().appendField("(°C)");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(210);
      this.setTooltip("מחשב ומחזיר טמפרטורה בצלזיוס מחיישן האדים/גשם (getSteamSensorTemperature)");
    }
  };
  javascriptGenerator.forBlock['get_steam_sensor_temperature_with_pin'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '34';
    return [`getSteamSensorTemperature(${pin})`, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  Blockly.Blocks['calculate_lux'] = {
    init: function() {
      this.appendDummyInput().appendField("קבלת מידע מחיישן אור");
      this.appendValueInput("PIN").setCheck("Number").appendField("מספר פורט");
      this.appendDummyInput().appendField("(Lux)");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(210);
      this.setTooltip("מחשב ומחזיר עוצמת תאורה בלוקס (calculateLux)");
    }
  };
  javascriptGenerator.forBlock['calculate_lux'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '35';
    return [`calculateLux(${pin})`, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  Blockly.Blocks['motion_sensore'] = {
    init: function() {
      this.appendDummyInput().appendField("קבלת מידע מחיישן תנועה");
      this.appendValueInput("PIN").setCheck("Number").appendField("מספר פורט");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(210);
      this.setTooltip("קורא ערך דיגיטלי (HIGH/LOW) מחיישן התנועה PIR");
    }
  };
  javascriptGenerator.forBlock['motion_sensore'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '14';
    return [`digitalRead(${pin})`, javascriptGenerator.ORDER_ATOMIC];
  };

  Blockly.Blocks['esp32_analog_read'] = {
    init: function() {
      this.appendDummyInput().appendField("קבלת מידע מחיישן אנלוגי");
      this.appendValueInput("PIN").setCheck("Number").appendField("פורט");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(210);
      this.setTooltip("קורא ערך אנלוגי (0-4095) מפין ה-ESP32");
    }
  };
  javascriptGenerator.forBlock['esp32_analog_read'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '34';
    return [`analogRead(${pin})`, javascriptGenerator.ORDER_ATOMIC];
  };

  Blockly.Blocks['call_getdata'] = {
    init: function() {
      this.appendDummyInput().appendField("קבל נתון מענן Firebase");
      this.appendValueInput("DATALINK").setCheck("String").appendField("קישור DataLink");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour(350);
      this.setTooltip("קורא נתון שנשמר ב-Firebase בנתיב המבוקש (getdata)");
    }
  };
  javascriptGenerator.forBlock['call_getdata'] = function(block) {
    const datalink = javascriptGenerator.valueToCode(block, 'DATALINK', javascriptGenerator.ORDER_NONE) || '"/smart_house/motionValue"';
    return [`getdata(${datalink})`, javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // --- 6. ACTUATORS & HARDWARE CONTROL (BLUE / ORANGE STATEMENTS) ---
  Blockly.Blocks['white_led'] = {
    init: function() {
      this.appendDummyInput().appendField("הדלקה/כיבוי לד לבן");
      this.appendValueInput("PIN").setCheck("Number").appendField("פורט");
      this.appendDummyInput().appendField("ערך").appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "VALUE");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("מדליק או מכבה את נורת ה-LED בפין הנבחר");
    }
  };
  javascriptGenerator.forBlock['white_led'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '12';
    const value = block.getFieldValue('VALUE');
    return `digitalWrite(${pin}, ${value});\n`;
  };

  Blockly.Blocks['yellow_led'] = {
    init: function() {
      this.appendDummyInput().appendField("להדלקה/כיבוי לד צהוב");
      this.appendValueInput("PIN").setCheck("Number").appendField("פורט");
      this.appendDummyInput().appendField("ערך").appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "VALUE");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("מדליק או מכבה את נורת ה-LED הצהובה בתקרה");
    }
  };
  javascriptGenerator.forBlock['yellow_led'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '12';
    const value = block.getFieldValue('VALUE');
    return `digitalWrite(${pin}, ${value});\n`;
  };

  Blockly.Blocks['buzzer_tone'] = {
    init: function() {
      this.appendDummyInput().appendField("הפעל זמזם");
      this.appendValueInput("PIN").setCheck("Number").appendField("פורט");
      this.appendDummyInput().appendField("טון").appendField(new Blockly.FieldDropdown([
        ["C4 (262Hz)", "262"], ["D4 (294Hz)", "294"], ["E4 (330Hz)", "330"],
        ["F4 (349Hz)", "349"], ["G4 (392Hz)", "392"], ["A4 (440Hz)", "440"],
        ["B4 (494Hz)", "494"], ["C5 (523Hz)", "523"], ["1000Hz (Alarm)", "1000"],
        ["2000Hz (Beep)", "2000"]
      ]), "TONE");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("משמיע טון צליל בזמזם");
    }
  };
  javascriptGenerator.forBlock['buzzer_tone'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '25';
    const tone = block.getFieldValue('TONE') || '1000';
    return `tone(${pin}, ${tone});\n`;
  };

  Blockly.Blocks['no_tone'] = {
    init: function() {
      this.appendDummyInput().appendField("כבה זמזם");
      this.appendValueInput("PIN").setCheck("Number").appendField("פורט");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("מפסיק את השמעת הצליל בזמזם");
    }
  };
  javascriptGenerator.forBlock['no_tone'] = function(block) {
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '25';
    return `noTone(${pin});\n`;
  };

  Blockly.Blocks['fan_sensore'] = {
    init: function() {
      this.appendDummyInput().appendField("הפעלת מאוורר");
      this.appendValueInput("PIN1").setCheck("Number").appendField("פורט 1");
      this.appendValueInput("VALUE1").setCheck("Boolean").appendField("ערך");
      this.appendValueInput("PIN2").setCheck("Number").appendField("פורט 2");
      this.appendValueInput("VALUE2").setCheck("Boolean").appendField("ערך");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("שולט במנוע המאוורר בעזרת שני פינים דיגיטליים");
    }
  };
  javascriptGenerator.forBlock['fan_sensore'] = function(block) {
    const pin1 = javascriptGenerator.valueToCode(block, 'PIN1', javascriptGenerator.ORDER_ATOMIC) || '19';
    const value1 = javascriptGenerator.valueToCode(block, 'VALUE1', javascriptGenerator.ORDER_ATOMIC) || 'HIGH';
    const pin2 = javascriptGenerator.valueToCode(block, 'PIN2', javascriptGenerator.ORDER_ATOMIC) || '18';
    const value2 = javascriptGenerator.valueToCode(block, 'VALUE2', javascriptGenerator.ORDER_ATOMIC) || 'LOW';
    return `digitalWrite(${pin1}, ${value1});\ndigitalWrite(${pin2}, ${value2});\n`;
  };

  Blockly.Blocks['open_door'] = {
    init: function() {
      this.appendDummyInput().appendField("פתיחת דלת");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("פותח את דלת הבית בעזרת מנוע סרוו (90°)");
    }
  };
  javascriptGenerator.forBlock['open_door'] = function() {
    return 'doorServo.write(90);\n';
  };

  Blockly.Blocks['close_door'] = {
    init: function() {
      this.appendDummyInput().appendField("סגירת דלת");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("סוגר ונועל את דלת הבית בעזרת מנוע סרוו (0°)");
    }
  };
  javascriptGenerator.forBlock['close_door'] = function() {
    return 'doorServo.write(0);\n';
  };

  Blockly.Blocks['open_window'] = {
    init: function() {
      this.appendDummyInput().appendField("פתיחת חלון");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("פותח את חלון הבית בעזרת מנוע סרוו (180°)");
    }
  };
  javascriptGenerator.forBlock['open_window'] = function() {
    return 'windowServo.write(180);\n';
  };

  Blockly.Blocks['close_window'] = {
    init: function() {
      this.appendDummyInput().appendField("סגירת חלון");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("סוגר את חלון הבית בעזרת מנוע סרוו (0°)");
    }
  };
  javascriptGenerator.forBlock['close_window'] = function() {
    return 'windowServo.write(0);\n';
  };

  Blockly.Blocks['servo_write'] = {
    init: function() {
      this.appendDummyInput().appendField("קביעת זווית ושם לסרבו");
      this.appendDummyInput().appendField("שם").appendField(new Blockly.FieldTextInput("doorServo"), "SERVO_NAME");
      this.appendValueInput("ANGLE").setCheck("Number").appendField("זווית");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(300);
      this.setTooltip("מכוון את זווית הסרוו (0 עד 180 מעלות)");
    }
  };
  javascriptGenerator.forBlock['servo_write'] = function(block) {
    const servoName = block.getFieldValue('SERVO_NAME') || 'doorServo';
    const angle = javascriptGenerator.valueToCode(block, 'ANGLE', javascriptGenerator.ORDER_ATOMIC) || '90';
    return `${servoName}.write(${angle});\n`;
  };

  Blockly.Blocks['servo_attach'] = {
    init: function() {
      this.appendDummyInput().appendField("חיבור סרבו לפורט");
      this.appendDummyInput().appendField("שם").appendField(new Blockly.FieldTextInput("doorServo"), "SERVO_NAME");
      this.appendValueInput("PIN").setCheck("Number").appendField("מספר פורט");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(300);
      this.setTooltip("מחבר אובייקט סרוו לפין ה-ESP32");
    }
  };
  javascriptGenerator.forBlock['servo_attach'] = function(block) {
    const servoName = block.getFieldValue('SERVO_NAME') || 'doorServo';
    const pin = javascriptGenerator.valueToCode(block, 'PIN', javascriptGenerator.ORDER_ATOMIC) || '13';
    return `${servoName}.attach(${pin}, 500, 2500);\n`;
  };

  Blockly.Blocks['wifi_connect'] = {
    init: function() {
      this.appendDummyInput().appendField("התחברות ל-Wi-Fi");
      this.appendValueInput("WIFI_SSID").setCheck("String").appendField("שם הרשת");
      this.appendValueInput("WIFI_PASSWORD").setCheck("String").appendField("סיסמה");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("מתחבר לרשת ה-WiFi ומציג את הסטטוס במסך ה-LCD");
    }
  };
  javascriptGenerator.forBlock['wifi_connect'] = function(block) {
    const wifi_ssid = javascriptGenerator.valueToCode(block, 'WIFI_SSID', javascriptGenerator.ORDER_ATOMIC) || '"alina"';
    const wifi_password = javascriptGenerator.valueToCode(block, 'WIFI_PASSWORD', javascriptGenerator.ORDER_ATOMIC) || '"0523611662"';
    return `// 📡 WiFi Connect\nWiFi.begin(${wifi_ssid}, ${wifi_password});\nwhile (WiFi.status() != WL_CONNECTED) {\n  delay(300);\n  Serial.print(".");\n}\nSerial.println("\\nWiFi Connected!");\nprintLCD("WiFi Connected!", WiFi.localIP().toString());\n`;
  };

  Blockly.Blocks['firebase_config'] = {
    init: function() {
      this.appendDummyInput().appendField("התחברות ל- Firebase");
      this.appendValueInput("DATABASE_URL").setCheck("String").appendField("קישור ל-Database");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(350);
      this.setTooltip("מגדיר ומתחבר למסד הנתונים Firebase RTDB");
    }
  };
  javascriptGenerator.forBlock['firebase_config'] = function(block) {
    const database_url = javascriptGenerator.valueToCode(block, 'DATABASE_URL', javascriptGenerator.ORDER_ATOMIC) || '"smarthouse-85b56-default-rtdb.firebaseio.com"';
    return `// 🔥 Firebase Config\nconfig.database_url = ${database_url};\nconfig.signer.test_mode = true;\nFirebase.reconnectNetwork(true);\nFirebase.begin(&config, &auth);\n`;
  };

  Blockly.Blocks['call_setdata_function'] = {
    init: function() {
      this.appendDummyInput().appendField("שלח נתון לענן Firebase");
      this.appendValueInput("VALUE").setCheck("String").appendField("ערך");
      this.appendValueInput("DATALINK").setCheck("String").appendField("קישור DataLink");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(350);
      this.setTooltip("שולח ערך ומעדכן את בסיס הנתונים בענן (setdata)");
    }
  };
  javascriptGenerator.forBlock['call_setdata_function'] = function(block) {
    const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_NONE) || '"1"';
    const datalink = javascriptGenerator.valueToCode(block, 'DATALINK', javascriptGenerator.ORDER_NONE) || '"/smart_house/motionValue"';
    return `setdata(${value}, ${datalink});\n`;
  };

  Blockly.Blocks['correct_code_entered'] = {
    init: function() {
      this.appendDummyInput().appendField("קוד פתיחה");
      this.appendStatementInput("CORRECT_CODE").setCheck(null).appendField("בצע אם הקוד נכון");
      this.appendStatementInput("INCORRECT_CODE").setCheck(null).appendField("בצע אם הקוד שגוי");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("בודק האם הוזן קוד הפתיחה הנכון ומבצע פעולות בהתאם");
    }
  };
  javascriptGenerator.forBlock['correct_code_entered'] = function(block) {
    const correct = javascriptGenerator.statementToCode(block, 'CORRECT_CODE') || '';
    const incorrect = javascriptGenerator.statementToCode(block, 'INCORRECT_CODE') || '';
    return `if (correctCodeEntered) {\n${correct}} else {\n  updateLCDPassword();\n${incorrect}}\n`;
  };

  // --- 7. HELPER TYPES (BOOLEANS, STRINGS, LOGIC) ---
  Blockly.Blocks['boolean_true'] = {
    init: function() {
      this.appendDummyInput().appendField("אמת");
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("מחזיר ערך אמת (true / HIGH)");
    }
  };
  javascriptGenerator.forBlock['boolean_true'] = function() {
    return ['true', javascriptGenerator.ORDER_ATOMIC];
  };

  Blockly.Blocks['boolean_false'] = {
    init: function() {
      this.appendDummyInput().appendField("שקר");
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("מחזיר ערך שקר (false / LOW)");
    }
  };
  javascriptGenerator.forBlock['boolean_false'] = function() {
    return ['false', javascriptGenerator.ORDER_ATOMIC];
  };

  Blockly.Blocks['int_to_string'] = {
    init: function() {
      this.appendValueInput("NUMBER").setCheck("Number").appendField("המר מספר לטקסט");
      this.setOutput(true, "String");
      this.setColour(160);
      this.setTooltip("ממיר מספר למחרוזת טקסט");
    }
  };
  javascriptGenerator.forBlock['int_to_string'] = function(block) {
    const number = javascriptGenerator.valueToCode(block, 'NUMBER', javascriptGenerator.ORDER_ATOMIC) || '0';
    return [`String(${number})`, javascriptGenerator.ORDER_ATOMIC];
  };
}

// 🔌 ALL 15 OFFICIAL KEYESTUDIO KS5009 DETAILED WIRING SUB-STEPS
const SMART_HOME_WIRING_STEPS = [
  {
    stepNum: 1,
    componentName: 'חיישן טמפרטורה ולחות XHT11 (Temperature & Humidity Sensor)',
    pinConnection: 'חיבור לפין דיגיטלי IO17 | כבל דופונט 3P קצר (15 ס"מ)',
    wireType: 'כבל 3P קצר (15cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A60-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A60.png`,
    instructions: 'חברו את כבל ה-3P מחיישן הטמפרטורה והלחות XHT11 לפין IO17 בלוח הבקר ESP32 PLUS.'
  },
  {
    stepNum: 2,
    componentName: 'מודול נורת LED צהובה (Yellow LED Module)',
    pinConnection: 'חיבור לפין דיגיטלי IO12 | כבל דופונט 3P קצר (15 ס"מ)',
    wireType: 'כבל 3P קצר (15cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A61-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A61.png`,
    instructions: 'חברו את כבל ה-3P ממודול ה-LED הצהוב בתקרה לפין IO12 בלוח הבקר.'
  },
  {
    stepNum: 3,
    componentName: 'חיישן אדים וטיפות גשם (Steam / Rain Sensor)',
    pinConnection: 'חיבור לפין אנלוגי IO34 | כבל דופונט 3P קצר (15 ס"מ)',
    wireType: 'כבל 3P קצר (15cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A62-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A62.png`,
    instructions: 'חברו את כבל ה-3P מחיישן האדים והגשם שעל הגג לפין האנלוגי IO34 בלוח.'
  },
  {
    stepNum: 4,
    componentName: 'מנוע מאוורר אוורור (130 DC Motor / Fan)',
    pinConnection: 'חיבור IN- לפין IO18 ו-IN+ לפין IO19 | 4 חוטי דופונט מופרדים',
    wireType: '4 חוטי דופונט מופרדים (Dupont Wires)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A63-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A63.png`,
    instructions: 'חברו את חוטי מנוע ה-DC: הדק IN- לפין IO18 והדק IN+ לפין IO19 בלוח הבקר.'
  },
  {
    stepNum: 5,
    componentName: 'חיישן תנועה PIR (PIR Motion Sensor)',
    pinConnection: 'חיבור לפין דיגיטלי IO14 | כבל דופונט 3P קצר (15 ס"מ)',
    wireType: 'כבל 3P קצר (15cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A64-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A64.png`,
    instructions: 'חברו את כבל ה-3P מחיישן התנועה PIR בכניסת הבית לפין IO14 בלוח הבקר.'
  },
  {
    stepNum: 6,
    componentName: 'מודול לחצן שמאלי (Left Button Module)',
    pinConnection: 'חיבור לפין דיגיטלי IO16 | כבל דופונט 3P ארוך (20 ס"מ)',
    wireType: 'כבל 3P ארוך (20cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A65-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A65.png`,
    instructions: 'חברו את כבל ה-3P מהלחצן השמאלי בקיר לפין IO16 בלוח הבקר.'
  },
  {
    stepNum: 7,
    componentName: 'מודול לחצן ימני (Right Button Module)',
    pinConnection: 'חיבור לפין דיגיטלי IO27 | כבל דופונט 3P ארוך (20 ס"מ)',
    wireType: 'כבל 3P ארוך (20cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A66-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A66.png`,
    instructions: 'חברו את כבל ה-3P מהלחצן הימני בקיר לפין IO27 בלוח הבקר.'
  },
  {
    stepNum: 8,
    componentName: 'מודול קורא כרטיסים RFID RC522 (RFID Door Lock)',
    pinConnection: 'חיבור לשקע תקשורת IIC (SDA/SCL) | כבל 4P מאוחד (20 ס"מ)',
    wireType: 'כבל 4P מאוחד (4P Splicing Cable)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A67-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A67.png`,
    instructions: 'חברו את כבל ה-4P ממודול ה-RFID בדלת הכניסה לשקע תקשורת IIC (I2C) בלוח הבקר.'
  },
  {
    stepNum: 9,
    componentName: 'מסך תצוגה LCD1602 I2C (I2C LCD Display)',
    pinConnection: 'חיבור לשקע תקשורת IIC (SDA/SCL) | כבל 4P מאוחד (20 ס"מ)',
    wireType: 'כבל 4P מאוחד (4P Splicing Cable)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A68-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A68.png`,
    instructions: 'חברו את כבל ה-4P ממסך ה-LCD1602 שבחזית לשקע תקשורת IIC (I2C) בלוח הבקר.'
  },
  {
    stepNum: 10,
    componentName: 'מודול תאורת 6812 RGB Neopixel (RGB Living Room Light)',
    pinConnection: 'חיבור לפין דיגיטלי IO26 | כבל דופונט 3P קצר (15 ס"מ)',
    wireType: 'כבל 3P קצר (15cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A69-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A69.png`,
    instructions: 'חברו את כבל ה-3P ממודול ה-RGB שבסלון לפין IO26 בלוח הבקר.'
  },
  {
    stepNum: 11,
    componentName: 'חיישן גז ועשן אנלוגי MQ-2 (Gas & Smoke Sensor)',
    pinConnection: 'חיבור לפין אנלוגי IO23 | כבל דופונט 3P ארוך (20 ס"מ)',
    wireType: 'כבל 3P ארוך (20cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A70-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A70.png`,
    instructions: 'חברו את כבל ה-3P מחיישן הגז והעשן שבמטבח לפין IO23 בלוח הבקר.'
  },
  {
    stepNum: 12,
    componentName: 'מודול זמזם פסיבי (Passive Buzzer Alarm)',
    pinConnection: 'חיבור לפין דיגיטלי IO25 | כבל דופונט 3P ארוך (20 ס"מ)',
    wireType: 'כבל 3P ארוך (20cm)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A71-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A71.png`,
    instructions: 'חברו את כבל ה-3P ממודול הזמזם הפסיבי לפין IO25 בלוח הבקר.'
  },
  {
    stepNum: 13,
    componentName: 'מנוע סרוו לחלון (Window Servo Motor)',
    pinConnection: 'חיבור לפין IO5 | כבל סרוו: חום (GND), אדום (5V), כתום (IO5)',
    wireType: 'כבל סרוו 3 גידים (GND, 5V, Signal)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A72-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A72.png`,
    instructions: 'חברו את כבל מנוע הסרוו של החלון לשורת פיני הסרוו: חום ל-GND, אדום ל-5V, כתום לפין IO5.'
  },
  {
    stepNum: 14,
    componentName: 'מנוע סרוו לדלת כניסה (Door Servo Motor)',
    pinConnection: 'חיבור לפין IO13 | כבל סרוו: חום (GND), אדום (5V), כתום (IO13)',
    wireType: 'כבל סרוו 3 גידים (GND, 5V, Signal)',
    diagramImg: `${KEYESTUDIO_IMG_BASE}A73-1.png`,
    boardImg: `${KEYESTUDIO_IMG_BASE}A73.png`,
    instructions: 'חברו את כבל מנוע הסרוו של הדלת: חום ל-GND, אדום ל-5V, כתום לפין IO13.'
  },
  {
    stepNum: 15,
    componentName: 'אספקת מתח וחיבור בית הסוללות (Power Supply & Battery Case)',
    pinConnection: 'חיבור תקע שחור/אדום לשקע DC בלוח הבקר ESP32 PLUS',
    wireType: 'מחבר שקע DC ישיר 7-12V',
    boardImg: `${KEYESTUDIO_IMG_BASE}A74.jpeg`,
    instructions: 'חברו את מחבר המתח מבית הסוללות (6 סוללות AA) לשקע ה-DC השחור בלוח הבקר להפעלת המערכת.'
  }
];

const SMART_HOME_ASSEMBLY_ALL = [
  { 
    id: 'ks_welcome', 
    title: '✨ ברוכים הבאים לפרויקט הבית החכם IoT (Keyestudio KS5009)!', 
    isWelcomePage: true,
    videoUrl: 'https://video.aliexpress-media.com/play/u/ae_sg_item/3000000699004/p/1/e/6/t/10301/1100067992406.mp4?from=chrome&definition=h265',
    videoLink: 'https://video.aliexpress-media.com/play/u/ae_sg_item/3000000699004/p/1/e/6/t/10301/1100067992406.mp4?from=chrome&definition=h265',
    welcomeText: 'ברוכים הבאים למסלול הבנייה והתכנות המתקדם של הבית החכם! במסלול זה תבנו בעצמכם בית חכם מלא מעץ, ותתכננו 13 חיישנים ומודולים מתקדמים: חיישן טמפרטורה ולחות, חיישן גז ועשן, מנועי סרוו לדלת ולחלון, מאוורר, קורא כרטיסים RFID, מסך LCD ועוד!',
    features: [
      { icon: '🏠', title: '20 שלבי הרכבה מפורטים', desc: 'הרכבה מכאנית של מבנה הבית מלוחות עץ איכותיים, תושבות וחיבור כל המודולים.' },
      { icon: '💡', title: '13 חיישנים ומודולים', desc: 'חיישני אקלים, גז, גשם, תנועה, תאורת RGB, מנועי סרוו, מאוורר ומסך LCD1602.' },
      { icon: '🔒', title: 'אבטחה ודלת חכמה RFID', desc: 'מנגנון נעילה ופתיחת דלת וחלון אוטומטיים וזיהוי תנועה עם זמזם התרעה.' },
      { icon: '💻', title: 'תכנות בבלוקים ו-C++', desc: 'שליטה מלאה בכל מערכות הבית החכם בעזרת סביבת בלוקים מתקדמת וקוד Arduino.' }
    ]
  },
  { 
    id: 'ks_step_1.1', 
    title: 'הרכבה - שלב 1', 
    partsNeeded: ['לוח עץ בסיסי (Base Board) x1', 'קירות עץ היקפיים x2', '24x ברגי M4*8mm', '24x אומי M4'], 
    instructions: [
      '1. זהו את הרכיבים הנדרשים: לוח הבסיס מעץ, 2 קירות עץ היקפיים, 24 ברגי M4*8mm ו-24 אומי M4.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הניחו את לוח הבסיס על משטח עבודה ישר וחברו את קירות העץ בעזרת ברגי ה-M4 והאומים.',
      '3. הדקו את האומים בצורה יציבה, וודאו שהתוצאה תואמת לתמונת הפרוטוטייפ.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A01.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A02.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A03.png`
  },
  { 
    id: 'ks_step_1.2', 
    title: 'הרכבה - שלב 2', 
    partsNeeded: ['מסגרות עץ היקפיות x2', '8x ברגי M4*8mm', '8x אומי M4'], 
    instructions: [
      '1. זהו את לוחות המסגרת המבנית מעץ, 8 ברגי M4*8mm ו-8 אומי M4.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הרכיבו את לוחות המסגרת משני צידי המבנה ליצירת מסגרת יציבה לבית.',
      '3. חזקו בברגי M4*8mm ואומים ליציבות מרבית.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A04.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A05.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A06.png`
  },
  { 
    id: 'ks_step_1.3', 
    title: 'הרכבה - שלב 3', 
    partsNeeded: ['לוח בקר ESP32 PLUS Development Board x1', '4x עמודי ספייסר פליז M3*10mm Dual-pass', '4x ברגי M3*6mm'], 
    instructions: [
      '1. זהו את לוח הבקר ESP32 PLUS, 4 עמודי ספייסר פליז M3*10mm ו-4 ברגי M3*6mm.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הניחו את 4 עמודי הספייסר בחורי לוח העץ הבסיסי והבריגו אותם.',
      '3. הציבו את לוח הבקר ESP32 PLUS מעל עמודי הפליז והדקו ב-4 ברגי M3*6mm.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A07.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A08.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A09.png`
  },
  { 
    id: 'ks_step_1.4', 
    title: 'הרכבה - שלב 4', 
    partsNeeded: ['תושבות זווית עץ x4', '12x ברגי M4*8mm', '12x אומי M4'], 
    instructions: [
      '1. זהו את 4 תושבות הזווית מעץ, 12 ברגי M4*8mm ו-12 אומי M4.',
      '2. עקבו אחר שלבי הבנייה בשרטוט: חברו את תושבות הזווית בפינות הפנימיות לחיזוק והצמדת הקירות.',
      '3. הדקו בעזרת ברגי M4*8mm ואומים לקבלת שלדה קשיחה.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A10.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A11.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A12.png`
  },
  { 
    id: 'ks_step_1.5', 
    title: 'הרכבה - שלב 5', 
    partsNeeded: ['קורות עץ עליונות לגג x2', '8x ברגי M4*8mm', '8x אומי M4'], 
    instructions: [
      '1. זהו את 2 קורות העץ העליונות לתמיכת הגג, 8 ברגי M4*8mm ו-8 אומי M4.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הרכיבו את קורות התמיכה המשופעות בחלק העליון של קירות הבית.',
      '3. חזקו את הקורות ללוחות הקיר בעזרת הברגים והאומים.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A13.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A14.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A15.png`
  },
  { 
    id: 'ks_step_1.6', 
    title: 'הרכבה - שלב 6', 
    partsNeeded: ['מסגרת חלון אקריליק שקוף x1', '2x אומי ניילון ננעלים (M3 Self-locking nuts)', '2x ברגי M3*10mm'], 
    instructions: [
      '1. זהו את חלון האקריליק השקוף, 2 ברגי M3*10mm ו-2 אומי ניילון ננעלים M3.',
      '2. עקבו אחר שלבי הבנייה בשרטוט: הרכיבו את ציר החלון למסגרת העץ.',
      '3. ⚠️ שימו לב: אל תהדקו עד הסוף את אומי הניילון הננעלים (Self-locking) כדי לאפשר לחלון להיפתח ולהיסגר בחופשיות!'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A16.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A17.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A18.png`
  },
  { 
    id: 'ks_step_1.7', 
    title: 'הרכבה - שלב 7', 
    partsNeeded: ['מנוע סרוו SG90 x1', 'זרוע סרוו מפלסטיק x1', '2x ברגי M2*12mm', 'בורג M1.4*6mm x1'], 
    instructions: [
      '1. ⚠️ חשוב מאוד: כוונו את זווית מנוע הסרוו ל-0 מעלות בדיוק לפני ההתקנה (עיינו בקוד האיפוס).',
      '2. עקבו אחר שלבי הבנייה בתמונות: התקינו את מנוע הסרוו למסגרת העץ בעזרת ברגי M2*12mm.',
      '3. חברו את זרוע הסרוו למנגנון החלון והדקו בעזרת בורג M1.4*6mm כפי שמוצג בתמונות.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A19.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}wps1-1.jpg`,
    extraImg: `${KEYESTUDIO_IMG_BASE}wps2.jpg`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A22.png`
  },
  { 
    id: 'ks_step_1.8', 
    title: 'הרכבה - שלב 8', 
    partsNeeded: ['מנוע סרוו SG90 x1', 'דלת עץ כניסה x1', 'זרוע מנוף x1', '2x ברגי M2*12mm', 'בורג M1.4*6mm x1'], 
    instructions: [
      '1. ⚠️ כוונו את מנוע הסרוו של הדלת ל-0 מעלות (מצב סגור) לפני החיבור.',
      '2. עקבו אחר שלבי הבנייה בתמונות ובשרטוט: התקינו את מנוע הסרוו לקיר הכניסה בעזרת ברגי M2*12mm.',
      '3. חברו את ציר הדלת לזרוע הסרוו והדקו בעזרת בורג M1.4*6mm.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A23.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A24.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A25.png`
  },
  { 
    id: 'ks_step_1.9', 
    title: 'הרכבה - שלב 9', 
    partsNeeded: ['מנוע 130 DC x1', 'להבי מאוורר פלסטיק x1', 'תושבת מנוע מעץ x1', '2x ברגי M3*6mm'], 
    instructions: [
      '1. זהו את מנוע ה-130 DC, להבי המאוורר, תושבת העץ ו-2 ברגי M3*6mm.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הכניסו את מנוע ה-DC לתושבת העגולה בגג הבית וחזקו בברגים.',
      '3. הלבישו בעדינות ובלחץ קל את להבי המאוורר על גבי ציר המנוע.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A26.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A27.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A28.png`
  },
  { 
    id: 'ks_step_1.10', 
    title: 'הרכבה - שלב 10', 
    partsNeeded: ['חיישן גז ועשן אנלוגי (MQ-2) x1', '2x ברגי M3*6mm', '2x אומי M3'], 
    instructions: [
      '1. זהו את חיישן הגז והעשן MQ-2, 2 ברגי M3*6mm ו-2 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בתמונות ובשרטוט: מקמו את חיישן הגז באזור המטבח מעל תושבת העץ הייעודית.',
      '3. הדקו בעזרת 2 ברגי M3*6mm ואומים M3.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A29.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A30.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A31.png`
  },
  { 
    id: 'ks_step_1.11', 
    title: 'הרכבה - שלב 11', 
    partsNeeded: ['חיישן אדים וגשם (Steam Sensor) x1', '2x ברגי M3*6mm', '2x אומי M3'], 
    instructions: [
      '1. זהו את לוח חיישן האדים/גשם (Steam Sensor), 2 ברגי M3*6mm ו-2 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בתמונות: התקינו את החיישן על שיפוע גג הבית בחלק העליון לקליטת טיפות גשם.',
      '3. הדקו בעזרת 2 ברגי M3*6mm ואומים.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A32.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A33.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A34.png`
  },
  { 
    id: 'ks_step_1.12', 
    title: 'הרכבה - שלב 12', 
    partsNeeded: ['חיישן תנועה PIR x1', 'עדשת פלסטיק עגולה x1', '2x ברגי M3*6mm'], 
    instructions: [
      '1. זהו את חיישן התנועה PIR, עדשת הכיפה הלבנה ו-2 ברגי M3*6mm.',
      '2. עקבו אחר שלבי הבנייה בשרטוט: התקינו את חיישן התנועה בחזית מעל דלת הכניסה הראשית.',
      '3. קבעו את עדשת הפלסטיק והדקו בברגי M3*6mm לוודא שהחיישן מזהה תנועה בכניסה.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A35.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A36.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A37.png`
  },
  { 
    id: 'ks_step_1.13', 
    title: 'הרכבה - שלב 13', 
    partsNeeded: ['חיישן טמפרטורה ולחות XHT11 x1', '2x ברגי M3*6mm', '2x אומי M3'], 
    instructions: [
      '1. זהו את מודול חיישן האקלים XHT11, 2 ברגי M3*6mm ו-2 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בתמונות: חברו את החיישן בתוך חלל הבית הפנימי למדידת טמפרטורה ולחות החדר.',
      '3. הדקו בעזרת 2 ברגי M3*6mm ואומים M3.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A38.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A39.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A40.png`
  },
  { 
    id: 'ks_step_1.14', 
    title: 'הרכבה - שלב 14', 
    partsNeeded: ['מודול נורת LED צהובה x1', '2x ברגי M3*6mm', '2x אומי M3'], 
    instructions: [
      '1. זהו את מודול ה-LED הצהוב, 2 ברגי M3*6mm ו-2 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בשרטוט: התקינו את מודול ה-LED בתקרת הבית עבור תאורת החדר הראשית.',
      '3. הדקו בעזרת ברגי M3*6mm ואומים.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A41.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A43.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A44.png`
  },
  { 
    id: 'ks_step_1.15', 
    title: 'הרכבה - שלב 15', 
    partsNeeded: ['מודול תאורת 6812 RGB x1', '2x ברגי M3*6mm', '2x אומי M3'], 
    instructions: [
      '1. זהו את מודול תאורת ה-RGB 6812, 2 ברגי M3*6mm ו-2 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בתמונות: התקינו את מודול ה-RGB בסלון הבית ליצירת תאורת אווירה צבעונית.',
      '3. הדקו בברגי M3*6mm ואומים.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A45.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A46.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A47.png`
  },
  { 
    id: 'ks_step_1.16', 
    title: 'הרכבה - שלב 16', 
    partsNeeded: ['מודול זמזם פסיבי (Buzzer) x1', '2x ברגי M3*6mm', '2x אומי M3'], 
    instructions: [
      '1. זהו את מודול הזמזם הפסיבי, 2 ברגי M3*6mm ו-2 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בשרטוט: התקינו את זמזם ההתראה הקולית ליד מודול האבטחה להשמעת צלילים ומנגינות.',
      '3. הדקו ב-2 ברגי M3*6mm ואומים M3.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A48.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A49.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A50.png`
  },
  { 
    id: 'ks_step_1.17', 
    title: 'הרכבה - שלב 17', 
    partsNeeded: ['מודול קורא כרטיסים RFID RC522 x1', '4x ברגי M3*6mm', '4x אומי M3'], 
    instructions: [
      '1. זהו את מודול קורא כרטיסי ה-RFID RC522, 4 ברגי M3*6mm ו-4 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הרכיבו את מודול ה-RFID בקיר החיצוני בסמוך לדלת הכניסה לבקרת גישה.',
      '3. הדקו ב-4 ברגי M3*6mm ואומים.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A51.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A52.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A53.png`
  },
  { 
    id: 'ks_step_1.18', 
    title: 'הרכבה - שלב 18', 
    partsNeeded: ['מסך תצוגה LCD1602 I2C x1', '4x ברגי M3*6mm', '4x אומי M3'], 
    instructions: [
      '1. זהו את מסך ה-LCD1602 הכחול עם מתאם ה-I2C, 4 ברגי M3*6mm ו-4 אומי M3.',
      '2. עקבו אחר שלבי הבנייה בשרטוט: התקינו את מסך ה-LCD בחלון התצוגה המרכזי של חזית הבית.',
      '3. הדקו בעזרת 4 ברגי M3*6mm ואומים.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A54.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A55.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A56.png`
  },
  { 
    id: 'ks_step_1.19', 
    title: 'הרכבה - שלב 19', 
    partsNeeded: ['לוחות עץ לגג העליון x2', '4x ברגי M4*8mm', '4x אומי M4'], 
    instructions: [
      '1. זהו את 2 לוחות סגירת הגג מעץ, 4 ברגי M4*8mm ו-4 אומי M4.',
      '2. עקבו אחר שלבי הבנייה בתמונות: הניחו את לוחות הגג על גבי הקורות העליונות.',
      '3. הדקו בעזרת 4 ברגי M4*8mm ואומים לסגירה מושלמת של הבית.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A57.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A58.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A59.png`
  },
  { 
    id: 'ks_step_1.20', 
    title: 'הרכבה - שלב 20', 
    partsNeeded: ['לוח עץ גב/בסיס סוללות x1', 'בית 6 סוללות AA x1', '2x ברגי M3*8mm שטוחים', '2x אומי M3'], 
    instructions: [
      '1. זהו את לוח התושבת מעץ, בית הסוללות וברגי ה-M3*8mm השטוחים.',
      '2. הרכיבו את בית הסוללות ללוח התושבת והצמידו לגב הבית בעזרת הברגים והאומים.',
      '3. עברו למדריך החיווט המפורט שלמטה לחיבור כל 13 המודולים, החיישנים והמנועים ללוח הבקר ESP32 PLUS.'
    ], 
    partsImg: `${KEYESTUDIO_IMG_BASE}A75.png`,
    assemblyImg: `${KEYESTUDIO_IMG_BASE}A76.png`,
    prototypeImg: `${KEYESTUDIO_IMG_BASE}A77.png`,
    wiringList: SMART_HOME_WIRING_STEPS
  }
];

// 💻 COMPLETE ARDUINO / C++ LESSONS CURRICULUM WITH EXACT VERBATIM SYSTEM BLOCK NAMES
const SMART_HOME_CODING_CHAPTER2 = [
  {
    id: '2.1',
    title: 'פרויקט 1.1: הבהוב נורת LED צהובה (LED Blink)',
    goal: 'הכרת אופן בקרת יציאה דיגיטלית ב-ESP32, קביעת מצב OUTPUT והבהוב נורת LED צהובה בפין IO12 במרווחי זמן של חצי שנייה.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'בלוק מכולת הלולאה הראשית של התוכנית' },
      { name: 'להדלקה/כיבוי לד צהוב (פורט: [12] ערך: [HIGH])', category: 'בית חכם', color: '#2563eb', desc: 'מדליק את נורת ה-LED הצהובה בתקרה' },
      { name: 'חכה [0.5] שניות', category: 'בית חכם', color: '#059669', desc: 'משהה את פעולת התוכנית לחצי שנייה' },
      { name: 'להדלקה/כיבוי לד צהוב (פורט: [12] ערך: [LOW])', category: 'בית חכם', color: '#2563eb', desc: 'מכבה את נורת ה-LED הצהובה' },
      { name: 'חכה [0.5] שניות', category: 'בית חכם', color: '#059669', desc: 'השהייה נוספת של חצי שנייה להשלמת מחזור הבהוב מלא' }
    ],
    blockInstructions: '1. מקטגוריית "🏠 בית חכם", גררו את הבלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו לתוכו את הבלוק "להדלקה/כיבוי לד צהוב", הזינו פורט 12 ובחרו ערך HIGH.\n3. חברו מתחתיו את הבלוק "חכה [ ] שניות" והזינו 0.5.\n4. הוסיפו בלוק "להדלקה/כיבוי לד צהוב" נוסף עם פורט 12 וערך LOW.\n5. סיימו עם בלוק "חכה [ ] שניות" והזינו 0.5.',
    codeTemplate: `#define LED_PIN 12 // פין נורת ה-LED הצהובה בתקרה

void setup() {
  pinMode(LED_PIN, OUTPUT); // הגדרת הפין כיציאה
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // הדלקת נורת LED
  delay(500);                  // המתנה 500 מילי-שניות
  digitalWrite(LED_PIN, LOW);  // כיבוי נורת LED
  delay(500);                  // המתנה 500 מילי-שניות
}`
  },
  {
    id: '2.2',
    title: 'פרויקט 1.2: עמעום נורת LED נושמת (Breathing LED PWM)',
    goal: 'שליטה בעוצמת התאורה באמצעות אות PWM באפנון רוחב פולס (Pulse Width Modulation) בבקר ה-ESP32.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'מריץ את מחזור עמעום האור ברצף' },
      { name: 'חזור [ ] פעמים (לולאות)', category: 'לולאות', color: '#0d9488', desc: 'לולאת שינוי עוצמה הדרגתית' },
      { name: 'להדלקה/כיבוי לד צהוב (פורט: [12] ערך: [...])', category: 'בית חכם', color: '#2563eb', desc: 'קביעת עוצמת ה-LED' },
      { name: 'חכה [0.02] שניות', category: 'בית חכם', color: '#059669', desc: 'השהייה קצרה למעבר חלק ונשימה רכה של האור' }
    ],
    blockInstructions: '1. גררו את הבלוק "🔁 (loop): בלולאה אינסופית".\n2. שלבו לולאת חזרה להגברת עוצמת התאורה ולולאה נוספת להפחתת העוצמה.\n3. הוסיפו בלוקי "חכה [0.02] שניות" בין שלבי השינוי.',
    codeTemplate: `#define LED_PIN 12

void setup() {
  ledcAttach(LED_PIN, 5000, 8);
}

void loop() {
  for (int duty = 0; duty <= 255; duty += 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }
  for (int duty = 255; duty >= 0; duty -= 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }
}`
  },
  {
    id: '2.3',
    title: 'פרויקט 2.1: קריאת לחצנים דיגיטליים (Read the Button)',
    goal: 'קריאת אותות כניסה דיגיטליים משני לחצני הקיר (פינים IO16 ו-IO27) והצגת מצב הלחיצה ב-Serial Monitor.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'בדיקת כפתורים שוטפת' },
      { name: 'אם [ ] בצע (controls_if)', category: 'בקרה', color: '#4338ca', desc: 'תנאי בדיקה אם לחצן נלחץ' },
      { name: 'קבלת מידע מחיישן אנלוגי (פורט: [16])', category: 'בית חכם', color: '#2563eb', desc: 'קריאת מצב לחצן שמאלי' },
      { name: 'קבלת מידע מחיישן אנלוגי (פורט: [27])', category: 'בית חכם', color: '#2563eb', desc: 'קריאת מצב לחצן ימני' },
      { name: 'הדפסה למסך (שורה 1: "Button Pressed", שורה 2: "Left")', category: 'בית חכם', color: '#059669', desc: 'הצגת הודעת לחיצה' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו בלוק "אם [ ] בצע" מקטגוריית בקרה.\n3. השוו את "קבלת מידע מחיישן אנלוגי (פורט 16)" ל-1 (HIGH).\n4. בפנים הוסיפו "הדפסה למסך" עם הודעת לחיצה.\n5. חזרו על הפעולה עם בלוק תנאי נוסף עבור פורט 27 (לחצן ימני).',
    codeTemplate: `#define BTN_LEFT  16 // לחצן שמאלי
#define BTN_RIGHT 27 // לחצן ימני

void setup() {
  Serial.begin(115200);
  pinMode(BTN_LEFT, INPUT);
  pinMode(BTN_RIGHT, INPUT);
}

void loop() {
  int leftState = digitalRead(BTN_LEFT);
  int rightState = digitalRead(BTN_RIGHT);

  if (leftState == HIGH) {
    Serial.println("🔘 לחצן שמאלי נלחץ! (Left Button Pressed)");
  }
  if (rightState == HIGH) {
    Serial.println("🔘 לחצן ימני נלחץ! (Right Button Pressed)");
  }
  delay(100);
}`
  },
  {
    id: '2.4',
    title: 'פרויקט 2.2: מנורת שולחן חכמה מבוססת לחצן (Table Lamp)',
    goal: 'תכנות מתג תאורה חכם Toggle: כל לחיצה על כפתור הקיר הופכת את מצב הנורה.',
    blocksNeeded: [
      { name: '📌 (מעל setup): משתנים והגדרות עליונות', category: 'בית חכם', color: '#6366f1', desc: 'הגדרת משתנה מצב התאורה lampState' },
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'לולאת בדיקת לחיצה והפיכת מצב' },
      { name: 'אם [ ] בצע (קבלת מידע מפורט 16 == אמת)', category: 'בקרה', color: '#4338ca', desc: 'זיהוי לחיצה על כפתור הקיר' },
      { name: 'להדלקה/כיבוי לד צהוב (פורט: [12] ערך: [HIGH/LOW])', category: 'בית חכם', color: '#2563eb', desc: 'שינוי מצב הנורה' },
      { name: 'חכה [0.2] שניות', category: 'בית חכם', color: '#059669', desc: 'מניעת קפיצות כפתור (Debounce)' }
    ],
    blockInstructions: '1. גררו את בלוק ה-Globals להגדרת משתנה מצב.\n2. בתוך ה-Loop, הוסיפו תנאי "אם נלחץ כפתור 16".\n3. שלבו בלוק "להדלקה/כיבוי לד צהוב" עם ערך הפוך מהמצב הקודם.\n4. הוסיפו "חכה [0.2] שניות" ליציבות.',
    codeTemplate: `#define LED_PIN 12
#define BTN_PIN 16

bool lampState = false;
int lastBtnState = LOW;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BTN_PIN, INPUT);
}

void loop() {
  int currentBtn = digitalRead(BTN_PIN);
  if (currentBtn == HIGH && lastBtnState == LOW) {
    lampState = !lampState;
    digitalWrite(LED_PIN, lampState ? HIGH : LOW);
    delay(200);
  }
  lastBtnState = currentBtn;
}`
  },
  {
    id: '2.5',
    title: 'פרויקט 3.1 & 3.2: זיהוי תנועה PIR והתרעה קולית (PIR Sensor Alarm)',
    goal: 'אלגוריתם אבטחה לזיהוי תנועת אדם בכניסה לבית בעזרת חיישן PIR (פין IO14) והפעלת זמזם ותאורה.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'מעקב רציף אחר תנועה' },
      { name: 'קבלת מידע מחיישן תנועה (מספר פורט: [14])', category: 'בית חכם', color: '#2563eb', desc: 'מחזיר אמת (HIGH) כאשר מזוהה תנועה' },
      { name: 'אם [ ] בצע אחרת [ ] (controls_if_else)', category: 'בקרה', color: '#4338ca', desc: 'תנאי פיצול בין תנועה לשקט' },
      { name: 'הפעל זמזם (פורט: [25] טון: [1000Hz (Alarm)])', category: 'בית חכם', color: '#2563eb', desc: 'השמעת צפצוף אזעקה' },
      { name: 'להדלקה/כיבוי לד צהוב (פורט: [12] ערך: [HIGH])', category: 'בית חכם', color: '#2563eb', desc: 'הדלקת תאורת אבטחה' },
      { name: 'כבה זמזם (פורט: [25])', category: 'בית חכם', color: '#2563eb', desc: 'כיבוי הזמזם כשאין תנועה' },
      { name: 'להדלקה/כיבוי לד צהוב (פורט: [12] ערך: [LOW])', category: 'בית חכם', color: '#2563eb', desc: 'כיבוי תאורה כשאין תנועה' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו לתוכו בלוק "אם [ ] בצע אחרת [ ]".\n3. בתנאי: חברו "קבלת מידע מחיישן תנועה (פורט: 14)" שווה ל-"אמת".\n4. בחלק ה-בצע: הוסיפו "להדלקה/כיבוי לד צהוב" (HIGH) ו-"הפעל זמזם" (1000Hz).\n5. בחלק ה-אחרת: הוסיפו "להדלקה/כיבוי לד צהוב" (LOW) ו-"כבה זמזם".',
    codeTemplate: `#define PIR_PIN    14 // חיישן תנועה PIR בכניסה
#define LED_PIN    12 // תאורה ראשית
#define BUZZER_PIN 25 // זמזם התרעה

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  int motion = digitalRead(PIR_PIN);
  if (motion == HIGH) {
    Serial.println("🚨 זוהתה תנועת אדם! הפעלת אזעקה ותאורה");
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 1000, 300);
  } else {
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER_PIN);
  }
  delay(150);
}`
  },
  {
    id: '2.6',
    title: 'פרויקט 4.1 & 4.2: נגינת מנגינות בזמזם פסיבי (Music Box)',
    goal: 'הפקת תדרי קול ומנגינת "יום הולדת שמח" בעזרת הזמזם הפסיבי בפין IO25.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'לולאת ניגון המנגינה' },
      { name: 'הפעל זמזם (פורט: [25] טון: [C4 (262Hz)])', category: 'בית חכם', color: '#2563eb', desc: 'השמעת תו דו (C4)' },
      { name: 'חכה [0.4] שניות', category: 'בית חכם', color: '#059669', desc: 'משך השמעת התו' },
      { name: 'הפעל זמזם (פורט: [25] טון: [D4 (294Hz)])', category: 'בית חכם', color: '#2563eb', desc: 'השמעת תו רה (D4)' },
      { name: 'הפעל זמזם (פורט: [25] טון: [E4 (330Hz)])', category: 'בית חכם', color: '#2563eb', desc: 'השמעת תו מי (E4)' },
      { name: 'כבה זמזם (פורט: [25])', category: 'בית חכם', color: '#2563eb', desc: 'הפרדה שקטה בין צלילים' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. שלבו רצף של בלוקי "הפעל זמזם" עם התווים C4, D4, E4.\n3. בין כל צליל הוסיפו "חכה [0.4] שניות" ו-"כבה זמזם".\n4. בסיום המנגינה הוסיפו "חכה [3] שניות".',
    codeTemplate: `#define BUZZER_PIN 25

int melody[] = { 262, 262, 294, 262, 349, 330, 262, 262, 294, 262, 392, 349 };
int noteDurations[] = { 4, 4, 2, 2, 2, 1, 4, 4, 2, 2, 2, 1 };

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  for (int note = 0; note < 12; note++) {
    int duration = 1000 / noteDurations[note];
    tone(BUZZER_PIN, melody[note], duration);
    delay(duration * 1.30);
    noTone(BUZZER_PIN);
  }
  delay(3000);
}`
  }
];

const SMART_HOME_CODING_CHAPTER3 = [
  {
    id: '3.1',
    title: 'פרויקט 5.1: פתיחה וסגירת דלת כניסה במנוע סרוו (Door Control)',
    goal: 'שליטה בזווית מנוע הסרוו של דלת הכניסה (פין IO13) – 0 מעלות (סגור) ל-90 מעלות (פתוח).',
    blocksNeeded: [
      { name: '⚡ (setup): פעם אחת בדיוק', category: 'בית חכם', color: '#3b82f6', desc: 'אתחול מנוע הסרוו של הדלת' },
      { name: 'חיבור סרבו לפורט (שם: "doorServo" מספר פורט: [13])', category: 'בית חכם', color: '#8b5cf6', desc: 'חיבור סרוו הדלת לפין IO13' },
      { name: 'סגירת דלת', category: 'בית חכם', color: '#2563eb', desc: 'קביעת זווית התחלתית סגורה (0°)' },
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'בדיקת כפתור לפתיחת דלת' },
      { name: 'פתיחת דלת', category: 'בית חכם', color: '#2563eb', desc: 'פתיחת הדלת (90°)' },
      { name: 'חכה [4] שניות', category: 'בית חכם', color: '#059669', desc: 'זמן השהיית דלת פתוחה לכניסה' }
    ],
    blockInstructions: '1. בתוך ה-Setup: חברו בלוק "חיבור סרבו לפורט" (שם: doorServo, פורט: 13) ובלוק "סגירת דלת".\n2. בתוך ה-Loop: בדקו אם נלחץ כפתור הכניסה (פורט 16).\n3. כאשר נלחץ: שלבו בלוק "פתיחת דלת", "חכה [4] שניות", ולאחריו "סגירת דלת".',
    codeTemplate: `#include <ESP32Servo.h>

#define DOOR_SERVO_PIN 13
#define BTN_PIN 16

Servo doorServo;
bool isDoorOpen = false;

void setup() {
  doorServo.attach(DOOR_SERVO_PIN, 500, 2500);
  doorServo.write(0);
  pinMode(BTN_PIN, INPUT);
}

void loop() {
  if (digitalRead(BTN_PIN) == HIGH) {
    isDoorOpen = !isDoorOpen;
    doorServo.write(isDoorOpen ? 90 : 0);
    delay(500);
  }
}`
  },
  {
    id: '3.2',
    title: 'פרויקט 5.2: סגירת חלון אוטומטית בזיהוי גשם (Rain Sensor & Window Servo)',
    goal: 'קריאת רמת הרטיבות מחיישן הגשם (פין אנלוגי IO34) וסגירת חלון הבית בעזרת מנוע סרוו בפין IO5.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'ניטור מתמיד של מזג האוויר' },
      { name: 'קבלת מידע מחיישן אנלוגי (פורט: [34])', category: 'בית חכם', color: '#2563eb', desc: 'קריאת ערך חיישן טיפות הגשם' },
      { name: 'אם [ ] בצע אחרת [ ]', category: 'בקרה', color: '#4338ca', desc: 'בדיקה אם ערך הגשם מעל סף 500' },
      { name: 'סגירת חלון', category: 'בית חכם', color: '#2563eb', desc: 'סגירת החלון (0°) להגנה מגשם' },
      { name: 'פתיחת חלון', category: 'בית חכם', color: '#2563eb', desc: 'פתיחת החלון (180°) לאוורור כשאין גשם' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו בלוק "אם [ ] בצע אחרת [ ]".\n3. בתנאי: חברו "קבלת מידע מחיישן אנלוגי (פורט: 34) > 500".\n4. ב-בצע: הוסיפו בלוק "סגירת חלון".\n5. ב-אחרת: הוסיפו בלוק "פתיחת חלון".',
    codeTemplate: `#include <ESP32Servo.h>

#define WINDOW_SERVO_PIN 5
#define RAIN_SENSOR_PIN  34

Servo windowServo;

void setup() {
  Serial.begin(115200);
  windowServo.attach(WINDOW_SERVO_PIN, 500, 2500);
  windowServo.write(90);
}

void loop() {
  int rainValue = analogRead(RAIN_SENSOR_PIN);
  Serial.print("Rain Sensor Value: ");
  Serial.println(rainValue);

  if (rainValue > 500) {
    Serial.println("🌧️ גשם זוהה! סגירת חלון אוטומטית");
    windowServo.write(0);
  } else {
    windowServo.write(90);
  }
  delay(500);
}`
  },
  {
    id: '3.3',
    title: 'פרויקט 6.1 & 6.2: תאורת אווירה צבעונית SK6812 RGB Neopixel',
    goal: 'שליטה במודול תאורת RGB SK6812 הדיגיטלי בסלון (פין IO26) ויצירת שילוב צבעים דינמי.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'מחזור החלפת גווני תאורת אווירה' },
      { name: 'להדלקה/כיבוי לד צהוב / RGB', category: 'בית חכם', color: '#2563eb', desc: 'הגדרת צבעי תאורה בסלון' },
      { name: 'חכה [1.5] שניות', category: 'בית חכם', color: '#059669', desc: 'המתנה בין צבע לצבע' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הגדירו צבע ראשון (כתום חם) והוסיפו "חכה [1.5] שניות".\n3. הגדירו צבע שני (כחול צלול) והוסיפו "חכה [1.5] שניות".\n4. הגדירו צבע שלישי (סגול יוקרתי) והוסיפו "חכה [1.5] שניות".',
    codeTemplate: `#include <Adafruit_NeoPixel.h>

#define RGB_PIN   26
#define NUM_LEDS  1

Adafruit_NeoPixel strip(NUM_LEDS, RGB_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show();
}

void loop() {
  strip.setPixelColor(0, strip.Color(255, 120, 0));
  strip.show();
  delay(1500);

  strip.setPixelColor(0, strip.Color(0, 200, 255));
  strip.show();
  delay(1500);

  strip.setPixelColor(0, strip.Color(180, 0, 255));
  strip.show();
  delay(1500);
}`
  },
  {
    id: '3.4',
    title: 'פרויקט 7.1 & 7.2: בקרת מנוע DC ומאוורר אוורור (Control the Fan)',
    goal: 'הפעלת מנוע ה-130 DC של מאוורר הגג במהירויות משתנות בעזרת אות PWM על פינים IO18 ו-IO19.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'בקרת פעולת המאוורר' },
      { name: 'הפעלת מאוורר (פורט 1: [19] ערך: [HIGH] פורט 2: [18] ערך: [LOW])', category: 'בית חכם', color: '#2563eb', desc: 'הפעלת סיבוב המאוורר' },
      { name: 'חכה [3] שניות', category: 'בית חכם', color: '#059669', desc: 'משך פעולת האוורור' },
      { name: 'הפעלת מאוורר (פורט 1: [19] ערך: [LOW] פורט 2: [18] ערך: [LOW])', category: 'בית חכם', color: '#2563eb', desc: 'כיבוי מנוע המאוורר' },
      { name: 'חכה [2] שניות', category: 'בית חכם', color: '#059669', desc: 'השהיית הפסקה' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו בלוק "הפעלת מאוורר" עם פורט 1 (19) כ-HIGH ופורט 2 (18) כ-LOW.\n3. חברו מתחתיו בלוק "חכה [3] שניות".\n4. הכניסו בלוק "הפעלת מאוורר" עם שני הפינים כ-LOW לכיבוי.\n5. חברו בלוק "חכה [2] שניות".',
    codeTemplate: `#define FAN_IN_MINUS 18
#define FAN_IN_PLUS  19

void setFanSpeed(int speed) {
  analogWrite(FAN_IN_PLUS, constrain(speed, 0, 255));
  digitalWrite(FAN_IN_MINUS, LOW);
}

void setup() {
  pinMode(FAN_IN_MINUS, OUTPUT);
  pinMode(FAN_IN_PLUS, OUTPUT);
}

void loop() {
  setFanSpeed(150);
  delay(3000);
  setFanSpeed(255);
  delay(3000);
  setFanSpeed(0);
  delay(2000);
}`
  },
  {
    id: '3.5',
    title: 'פרויקט 8.1: הצגת תווים ונתונים במסך LCD1602 I2C',
    goal: 'תקשורת I2C מול מסך LCD1602 (כתובת 0x27) והדפסת הודעות מצב.',
    blocksNeeded: [
      { name: '⚡ (setup): פעם אחת בדיוק', category: 'בית חכם', color: '#3b82f6', desc: 'אתחול מסך ה-LCD בזינוק הלוח' },
      { name: 'נקה מסך', category: 'בית חכם', color: '#059669', desc: 'איפוס וניקוי תווים קודמים' },
      { name: 'הדפסה למסך (שורה 1 - טקסט: ["Smart Home IoT"] שורה 2 - טקסט: ["ESP32 Ready!"])', category: 'בית חכם', color: '#059669', desc: 'הדפסת טקסט בשתי שורות ה-LCD' }
    ],
    blockInstructions: '1. גררו בלוק "⚡ (setup): פעם אחת בדיוק".\n2. הכניסו לתוכו בלוק "נקה מסך".\n3. הוסיפו בלוק "הדפסה למסך", והזינו שורה 1: "Smart Home IoT" ושורה 2: "ESP32 Ready!".',
    codeTemplate: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Smart Home IoT");
  lcd.setCursor(0, 1);
  lcd.print("ESP32 Online! :)");
}

void loop() {
}`
  },
  {
    id: '3.6',
    title: 'פרויקט 8.2: מערכת חירום וגילוי דליפת גז ועשן MQ-2',
    goal: 'קריאת רמת הגז באוויר בפין IO23 והפעלת מאוורר, פתיחת חלון והשמעת אזעקה בעת דליפה.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'בדיקת גז ועשן שוטפת' },
      { name: 'קבלת מידע מחיישן גז (מספר פורט: [23]) (ערך)', category: 'בית חכם', color: '#2563eb', desc: 'קריאת רמת הגז באוויר' },
      { name: 'אם [ ] בצע אחרת [ ]', category: 'בקרה', color: '#4338ca', desc: 'בדיקה אם רמת הגז עולה מעל 450' },
      { name: 'הפעלת מאוורר (פורט 1: [19] ערך: [HIGH] פורט 2: [18] ערך: [LOW])', category: 'בית חכם', color: '#2563eb', desc: 'אוורור חירום וסילוק הגז' },
      { name: 'פתיחת חלון', category: 'בית חכם', color: '#2563eb', desc: 'פתיחת החלון לשחרור עשן' },
      { name: 'הפעל זמזם (פורט: [25] טון: [1000Hz (Alarm)])', category: 'בית חכם', color: '#2563eb', desc: 'השמעת סירנת אזעקה' },
      { name: 'כבה זמזם (פורט: [25])', category: 'בית חכם', color: '#2563eb', desc: 'הפסקת האזעקה באוויר נקי' },
      { name: 'סגירת חלון', category: 'בית חכם', color: '#2563eb', desc: 'סגירת החלון בחזרה' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו בלוק "אם [ ] בצע אחרת [ ]".\n3. בתנאי: חברו "קבלת מידע מחיישן גז (מספר פורט: 23) (ערך) > 450".\n4. ב-בצע: הוסיפו "הפעלת מאוורר", "פתיחת חלון" ו-"הפעל זמזם".\n5. ב-אחרת: הוסיפו כיבוי מאוורר, "סגירת חלון" ו-"כבה זמזם".',
    codeTemplate: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>

#define GAS_PIN      23
#define BUZZER_PIN   25
#define FAN_PIN      19
#define WINDOW_SERVO 5

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo winServo;

void setup() {
  Wire.begin();
  lcd.init();
  lcd.backlight();
  winServo.attach(WINDOW_SERVO, 500, 2500);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
}

void loop() {
  int gasLevel = analogRead(GAS_PIN);
  lcd.setCursor(0, 0);
  lcd.print("Gas: " + String(gasLevel) + " ppm   ");

  if (gasLevel > 450) {
    lcd.setCursor(0, 1);
    lcd.print("⚠️ GAS DANGER!  ");
    digitalWrite(FAN_PIN, HIGH);
    winServo.write(90);
    tone(BUZZER_PIN, 1200, 400);
  } else {
    lcd.setCursor(0, 1);
    lcd.print("Air Quality: OK ");
    digitalWrite(FAN_PIN, LOW);
    noTone(BUZZER_PIN);
  }
  delay(300);
}`
  },
  {
    id: '3.7',
    title: 'פרויקט 9: תחנה מטאורולוגית טמפרטורה ולחות XHT11',
    goal: 'קריאת טמפרטורה ולחות מהחיישן הדיגיטלי XHT11 (פין IO17) והצגתם במסך ה-LCD1602.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'רענון מתמיד של נתוני האקלים' },
      { name: 'הצגת נתוני חיישנים', category: 'בית חכם', color: '#059669', desc: 'הצגת 4 נתוני חיישנים במסך ה-LCD' },
      { name: 'קבלת מידע מחיישן טמפרטורה (מספר פורט: [34]) (°C)', category: 'בית חכם', color: '#2563eb', desc: 'מדידת טמפרטורה מדויקת' },
      { name: 'קבלת מידע מחיישן אור (מספר פורט: [35]) (Lux)', category: 'בית חכם', color: '#2563eb', desc: 'מדידת עוצמת תאורה' },
      { name: 'חכה [1] שניות', category: 'בית חכם', color: '#059669', desc: 'מרווח רענון תצוגה' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו לתוכו בלוק "הצגת נתוני חיישנים".\n3. חברו "קבלת מידע מחיישן טמפרטורה (פורט: 34)" ו-"קבלת מידע מחיישן אור (פורט: 35)".\n4. הוסיפו בלוק "חכה [1] שניות".',
    codeTemplate: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHTPIN  17
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Wire.begin();
  lcd.init();
  lcd.backlight();
  dht.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float humi = dht.readHumidity();

  lcd.setCursor(0, 0);
  lcd.print("Temp: " + String(temp, 1) + " C ");
  lcd.setCursor(0, 1);
  lcd.print("Humi: " + String(humi, 1) + " % ");
  delay(1000);
}`
  }
];

const SMART_HOME_CODING_CHAPTER4 = [
  {
    id: '4.1',
    title: 'פרויקט 10: מנעול דלת מאובטח בכרטיס ותגית RFID RC522',
    goal: 'קריאת קוד הזיהוי (UID) מכרטיסי RFID ופתיחת מנעול הדלת בסרוו (IO13) למשך 5 שניות.',
    blocksNeeded: [
      { name: '⚡ (setup): פעם אחת בדיוק', category: 'בית חכם', color: '#3b82f6', desc: 'אתחול סרוו הדלת' },
      { name: 'חיבור סרבו לפורט (שם: "doorServo" מספר פורט: [13])', category: 'בית חכם', color: '#8b5cf6', desc: 'חיבור מנוע סרוו הדלת' },
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'סריקת כרטיסי RFID' },
      { name: 'פונקציה: פתיחת/סגירת דלת', category: 'בית חכם', color: '#8b5cf6', desc: 'פונקציית פתיחה אוטומטית' },
      { name: 'קריאה לפונקציה: פתיחה/סגירת דלת', category: 'בית חכם', color: '#8b5cf6', desc: 'הפעלת פתיחת הדלת' },
      { name: 'הפעל זמזם (פורט: [25] טון: [2000Hz (Beep)])', category: 'בית חכם', color: '#2563eb', desc: 'צליל אישור כניסה' }
    ],
    blockInstructions: '1. ב-Setup: הוסיפו "חיבור סרבו לפורט" (doorServo, פורט 13).\n2. הגדירו "פונקציה: פתיחת/סגירת דלת" המכילה "פתיחת דלת", "חכה [5] שניות", ו-"סגירת דלת".\n3. ב-Loop: בעת זיהוי כרטיס תקין, השמיעו צפצוף אישור וקראו לפונקציית פתיחת הדלת.',
    codeTemplate: `#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>

#define SS_PIN     21
#define RST_PIN    22
#define DOOR_SERVO 13
#define BUZZER_PIN 25

MFRC522 rfid(SS_PIN, RST_PIN);
Servo doorServo;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  doorServo.attach(DOOR_SERVO, 500, 2500);
  doorServo.write(0);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  Serial.println("🔑 כרטיס RFID זוהה! פתיחת דלת...");
  tone(BUZZER_PIN, 2000, 150);
  
  doorServo.write(90);
  delay(5000);
  doorServo.write(0);
  
  rfid.PICC_HaltA();
}`
  },
  {
    id: '4.2',
    title: 'פרויקט 11: פתיחת דלת בקוד מורס סודי (Morse Code Door)',
    goal: 'פענוח רצף לחיצות קצרות וארוכות בלחיצה על הכפתור לפתיחת דלת הבית בקוד סודי.',
    blocksNeeded: [
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'בדיקת קוד כפתורים רציפה' },
      { name: 'טפל בלחיצות כפתורים וקוד סודי (פורט 1: [16] פורט 2: [27] קוד 1-4: [8, 7, 5, 4])', category: 'בית חכם', color: '#8b5cf6', desc: 'ניהול 4 ספרות קוד כניסה ואימות' },
      { name: 'קוד פתיחה (בצע אם הקוד נכון / בצע אם הקוד שגוי)', category: 'בית חכם', color: '#059669', desc: 'פתיחת דלת או הפעלת אזעקה' },
      { name: 'עדכן תצוגת קוד סודי ב-LCD', category: 'בית חכם', color: '#059669', desc: 'רענון תצוגת כוכביות במסך' }
    ],
    blockInstructions: '1. גררו בלוק "🔁 (loop): בלולאה אינסופית".\n2. הכניסו בלוק "טפל בלחיצות כפתורים וקוד סודי" והזינו את מספרי הפורטים והקוד הסודי.\n3. שלבו בלוק "קוד פתיחה" – בצע פתיחת דלת אם הקוד נכון, או השמעת אזעקה ואיפוס אם שגוי.',
    codeTemplate: `#include <ESP32Servo.h>

#define BTN_PIN     16
#define DOOR_SERVO  13
#define BUZZER_PIN  25

Servo doorServo;
String enteredCode = "";
unsigned long pressStart = 0;

void setup() {
  Serial.begin(115200);
  doorServo.attach(DOOR_SERVO, 500, 2500);
  doorServo.write(0);
  pinMode(BTN_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(BTN_PIN) == HIGH) {
    pressStart = millis();
    tone(BUZZER_PIN, 800);
    while (digitalRead(BTN_PIN) == HIGH) delay(10);
    noTone(BUZZER_PIN);
    unsigned long duration = millis() - pressStart;

    if (duration < 300) enteredCode += ".";
    else enteredCode += "-";
    Serial.println("Code: " + enteredCode);

    if (enteredCode == "...---...") {
      Serial.println("🔓 קוד מורס תקין! פתיחת דלת");
      doorServo.write(90);
      delay(4000);
      doorServo.write(0);
      enteredCode = "";
    }
  }
}`
  },
  {
    id: '4.3',
    title: 'פרויקט 12.1 & 12.2: שרת Web Server לשליטה מרחוק ב-Wi-Fi',
    goal: 'שרת אינטרנט מובנה על ה-ESP32 המאפשר לשלוט בתאורת הבית ובמאוורר מכל דפדפן ברשת הביתית.',
    blocksNeeded: [
      { name: '🔥 הגדרות רשת ו-Firebase (#define)', category: 'בית חכם', color: '#ea580c', desc: 'הגדרת שם רשת WiFi (SSID) וסיסמה' },
      { name: '⚡ (setup): פעם אחת בדיוק', category: 'בית חכם', color: '#3b82f6', desc: 'אתחול ה-WiFi והשרת' },
      { name: 'התחברות ל-Wi-Fi (שם הרשת: [...] סיסמה: [...])', category: 'בית חכם', color: '#2563eb', desc: 'חיבור לרשת הביתית והצגת ה-IP' },
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'טיפול בפקודות מהדפדפן' }
    ],
    blockInstructions: '1. בראש התוכנית: גררו בלוק "🔥 הגדרות רשת ו-Firebase (#define)".\n2. בתוך Setup: הוסיפו בלוק "התחברות ל-Wi-Fi".\n3. בתוך Loop: הבקר יאזין לבקשות דפדפן וישלוט בתאורה ובמאוורר.',
    codeTemplate: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YourWiFiName";
const char* password = "YourPassword";

WebServer server(80);

#define LED_PIN 12
#define FAN_PIN 19

void handleRoot() {
  String html = "<h1>🏡 בית חכם IoT - שליטה ב-WiFi</h1>";
  html += "<p><a href=\"/led/on\"><button>הדלק תאורה</button></a> <a href=\"/led/off\"><button>כבה תאורה</button></a></p>";
  html += "<p><a href=\"/fan/on\"><button>הפעל מאוורר</button></a> <a href=\"/fan/off\"><button>כבה מאוורר</button></a></p>";
  server.send(200, "text/html; charset=utf-8", html);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nמחובר ל-WiFi! כתובת IP: " + WiFi.localIP().toString());

  server.on("/", handleRoot);
  server.on("/led/on", []() { digitalWrite(LED_PIN, HIGH); server.send(200, "text/plain", "LED ON"); });
  server.on("/led/off", []() { digitalWrite(LED_PIN, LOW); server.send(200, "text/plain", "LED OFF"); });
  server.on("/fan/on", []() { digitalWrite(FAN_PIN, HIGH); server.send(200, "text/plain", "FAN ON"); });
  server.on("/fan/off", []() { digitalWrite(FAN_PIN, LOW); server.send(200, "text/plain", "FAN OFF"); });
  server.begin();
}

void loop() {
  server.handleClient();
}`
  },
  {
    id: '4.4',
    title: 'פרויקט 13.2: פרויקט גמר: בית חכם אוטונומי ומקושר IoT מלא',
    goal: 'שילוב כל 13 המודולים למערכת ניהול בית חכם אוטונומית מלאה: גילוי גז, הגנת גשם, אבטחה, בקרת אקלים ו-Firebase!',
    blocksNeeded: [
      { name: '📌 (מעל setup): משתנים והגדרות עליונות', category: 'בית חכם', color: '#6366f1', desc: 'הגדרת משתנים גלובליים ו-Firebase' },
      { name: '⚡ (setup): פעם אחת בדיוק', category: 'בית חכם', color: '#3b82f6', desc: 'אתחול 13 הרכיבים והתחברות לענן' },
      { name: '🔁 (loop): בלולאה אינסופית', category: 'בית חכם', color: '#8b5cf6', desc: 'לולאת ניהול בית חכם אוטונומי' },
      { name: 'קריאה לפונקציה: בדיקת גז', category: 'בית חכם', color: '#8b5cf6', desc: 'בדיקת בטיחות גז במטבח' },
      { name: 'קריאה לפונקציה: בדיקת חיישן תנועה', category: 'בית חכם', color: '#8b5cf6', desc: 'בקרת תאורה ואבטחה' },
      { name: 'טפל בלחיצות כפתורים וקוד סודי', category: 'בית חכם', color: '#8b5cf6', desc: 'ניהול כניסה חכמה' },
      { name: 'שלח נתון לענן Firebase (ערך: [...] קישור DataLink: [...])', category: 'בית חכם', color: '#ea580c', desc: 'סנכרון מצב חיישנים בזמן אמת לענן' }
    ],
    blockInstructions: '1. שלבו את 4 בלוקי המבנה הראשיים (Globals, Setup, Loop, Bottom).\n2. הגדירו את הפונקציות הייעודיות לבדיקת גז, אבטחה, חלון ודלת.\n3. ב-Loop קראו לפונקציות ושלחו נתוני תנועה וחיישנים לענן Firebase.',
    codeTemplate: SMARTHOUSE_INO_FULL_CODE
  }
];

const CHAPTER_BRIEFINGS = {
  ch1: {
    id: 'intro_ch1',
    chapterId: 'ch1',
    isBriefing: true,
    title: '🛠️ תדריך משימה: הרכבה מכאנית וזיווד בית חכם IoT (KS5009)',
    subtitle: 'מדריך הרכבה שלם: 20 שלבי CAD מפורטים + 15 שלבי חיווט מלאים',
    badge: 'פרק 1 • חומרה, נגרות והרכבה מכאנית',
    badgeColor: '#e11d48',
    bgGradient: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(190, 18, 60, 0.15))',
    overview: 'ברוכים הבאים לשלב הבנייה המעשית של הבית החכם! בפרק זה תרכיבו את שלדת העץ האיכותית, דלתות וחלונות מנועי סרוו, מאוורר תקרה, מסך LCD, ואת כל 13 חיישני הבית עם חיווט מדויק ללוח הבקר ESP32.',
    kit: [
      'לוחות עץ לבניית קירות, גג, חלונות ומסגרת הבית',
      'בקר ESP32 ומגן הרחבה רב-ערוצי Keyestudio KS5009',
      '2 מנועי סרוו 9g (לדלת ולחלון) ומנוע DC מאוורר גג',
      'מסך LCD1602 בתקשורת I2C ומודול RFID RC522',
      'חיישני גז MQ-2, גשם, תנועה PIR, טמפרטורה XHT11',
      'ערכת ברגים M3/M4, עמודי הגבהה, כבלי Dupont ומברג'
    ],
    objectives: [
      'הרכבת לוח הבסיס, הקירות והמחיצות הפנימיות מעץ',
      'התקנת מנועי הסרוו לדלת הכניסה ולחלון הגג',
      'התקנת מנוע המאוורר, נורות ה-LED ומסך ה-LCD1602',
      'חיבור לוח ה-ESP32 ומגן החיישנים הרב-ערוצי',
      'ביצוע 15 שלבי חיווט כבלי ה-Dupont לפי מפת הפינים הרשמית',
      'בדיקת שלמות מכאנית ומוכנות לחיבור מתח'
    ],
    timeEst: '60-90 דקות',
    skills: ['הרכבה מכאנית מדויקת', 'קריאת שרטוטי CAD', 'חיווט אלקטרוניקה', 'זיהוי פינים GPIO'],
    proTip: 'סדרו את הברגים והמחברים לפי מידות. בעת חיבור מנועי הסרוו, ודאו שהם במצב 0 מעלות לפני הברגת זרוע הדלת/חלון!',
    firstLessonId: 'ks_step_1.1'
  },
  ch2: {
    id: 'intro_ch2',
    chapterId: 'ch2',
    isBriefing: true,
    title: '💡 תדריך משימה: תכנות מודולים בסיסיים וחיישנים',
    subtitle: '6 שיעורי תכנות אינטראקטיביים עם בלוקים ייעודיים וקוד C++ מלא',
    badge: 'פרק 2 • תוכנה, יציאות דיגיטליות וחיישנים',
    badgeColor: '#f43f5e',
    bgGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(225, 29, 72, 0.15))',
    overview: 'בפרק זה נכיר את יסודות תכנות הבקר ESP32 בבית החכם: נלמד לשלוט בתאורת LED צהובה, לעמעם נוריות בעזרת PWM, לקרוא כפתורים פיזיים, לזהות תנועת בני אדם עם חיישן PIR ולהפיק צלילים ומנגינות בזמזם פסיבי.',
    kit: [
      'ערכת בית חכם ESP32 מורכבת ומחוברת',
      'כבל USB Type-C לחיבור למחשב',
      'ספק כוח / סוללות תואמות'
    ],
    objectives: [
      'הדלקה, כיבוי והבהוב תאורת LED צהובה (Digital Output)',
      'עמעום ובקרת בהירות נורת LED בעזרת אות PWM',
      'קריאת מצב לחצן פיזי ובקרת מיתוג (Digital Input)',
      'זיהוי נוכחות אדם ותנועה בעזרת חיישן PIR אינפרא-אדום',
      'הפקת צלילים, התראות קוליות ומנגינות בזמזם פסיבי',
      'שילוב תנועה ותאורה אוטומטית לחיסכון באנרגיה'
    ],
    timeEst: '45-60 דקות',
    skills: ['תכנות בבלוקים', 'קוד C++ לארדואינו', 'קלט/פלט דיגיטלי', 'בקרת PWM'],
    proTip: 'סביבת העבודה נפתחת בלחיצת כפתור בחלון נפרד לנוחות מרבית, כך שתוכלו לגרור בלוקים לצד מדריך השלב!',
    firstLessonId: '2.1'
  },
  ch3: {
    id: 'intro_ch3',
    chapterId: 'ch3',
    isBriefing: true,
    title: '🏡 תדריך משימה: מנועים, תאורת אקלים וחיישנים מתקדמים',
    subtitle: '7 שיעורים מעשיים: סרוו דלת וחלון, תאורת RGB, מאוורר, LCD1602, גז MQ-2 וחיישן XHT11',
    badge: 'פרק 3 • אקטיואטורים, בקרת אקלים ותצוגה',
    badgeColor: '#0ea5e9',
    bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(2, 132, 199, 0.15))',
    overview: 'שדרוג יכולות הבית החכם לרמה אוטונומית מתקדמת: נתכנת מנועי סרוו לפתיחת דלת וחלון לפי דרישה, נשלוט במאוורר גג DC, נציג נתונים בזמן אמת על מסך LCD1602 I2C, ונטפל בגילוי גז דולף ועשן.',
    kit: [
      'בקר בית חכם עם סרוו דלת וסרוו חלון',
      'חיישן טמפרטורה ולחות XHT11 וחיישן גז MQ-2',
      'מאוורר DC 130 ותאורת SK6812 RGB',
      'מסך תצוגה LCD1602 I2C'
    ],
    objectives: [
      'פתיחה וסגירת דלת כניסה וחלון אוורור במנועי סרוו',
      'הפעלת תאורת אווירה צבעונית SK6812 RGB במגוון צבעים',
      'בקרת מהירות מנוע מאוורר DC לפי פקודה',
      'הצגת הודעות ונתוני טמפרטורה ולחות על מסך LCD1602 I2C',
      'מערכת בטיחות: גילוי גז ועשן MQ-2 עם אזעקת חירום',
      'קריאת רמת גשם וחיישן קיטור לסגירה אוטומטית של חלונות'
    ],
    timeEst: '60-80 דקות',
    skills: ['בקרת מנועי סרוו ו-DC', 'תקשורת I2C', 'חיישנים אנלוגיים', 'לוגיקת בטיחות'],
    proTip: 'חיישן הגז MQ-2 דורש חימום מקדים של כ-30 שניות עד להגעה לערכים יציבים. אין להילחץ אם הוא מתחמם מעט, זה טבעי לפעולתו!',
    firstLessonId: '3.1'
  },
  ch4: {
    id: 'intro_ch4',
    chapterId: 'ch4',
    isBriefing: true,
    title: '🚀 תדריך משימה: אבטחה חכמה, תקשורת Wi-Fi ופרויקט גמר IoT',
    subtitle: '4 שיעורים מתקדמים: RFID, שרת Web Server מקומי, Firebase ופרויקט בית חכם אוטונומי מלא',
    badge: 'פרק 4 • Cloud, IoT ואבטחה מתקדמת',
    badgeColor: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
    overview: 'שיא המסלול: חיבור הבית החכם לרשת האינטרנט ולענן! נתכנת מנעול דלת חכם מבוסס כרטיסי RFID RC522, נקים שרת Web Server עצמאי על גבי ה-ESP32, ונשלב את כל 13 המודולים לפרויקט בית חכם אוטונומי מקיף!',
    kit: [
      'בית חכם KS5009 מורכב עם כל 13 המודולים',
      'כרטיס ותגית RFID RC522',
      'מחשב / סמארטפון לגלישה לשרת הבית החכם'
    ],
    objectives: [
      'זיהוי כרטיסי RFID לפתיחת דלת מורשית וסירוב לבלתי מורשים',
      'שידור והזנת קוד מורס בסיוע הזמזם ונורת ה-LED',
      'הקמת שרת אינטרנט מקומי Web Server על גבי ה-ESP32 לשליטה מהדפדפן',
      'פרויקט גמר: בית חכם אוטונומי מלא המשלב אבטחה, אקלים, תאורה וענן'
    ],
    timeEst: '60-90 דקות',
    skills: ['תקשורת Wi-Fi & Web Server', 'אבטחת RFID', 'ארכיטקטורת IoT', 'אינטגרציית מערכות'],
    proTip: 'כאשר ה-ESP32 מפעיל שרת Web, ודאו שהמחשב או הטלפון מחוברים לאותה רשת Wi-Fi כדי לפתוח את כתובת ה-IP בדפדפן!',
    firstLessonId: '4.1'
  }
};

const SMART_HOME_CHAPTERS = [
  { 
    id: 'ch1', 
    title: '🛠️ פרק 1: הרכבה מכאנית וזיווד מפורט (20 שלבי CAD + 15 שלבי חיווט)', 
    description: 'מדריך הרכבת הבית, החיישנים וכל 15 חיבורי החיווט צעד-אחר-צעד לפי מפרט Keyestudio KS5009 הרשמי', 
    lessons: SMART_HOME_ASSEMBLY_ALL 
  },
  { 
    id: 'ch2', 
    title: '💡 פרק 2: תכנות מודולים בסיסיים וחיישנים (שיעורים 2.1 עד 2.6)', 
    description: 'הבהוב תאורת LED, עמעום PWM, קריאת לחצנים, זיהוי תנועה PIR ומנגינות בזמזם פסיבי', 
    lessons: SMART_HOME_CODING_CHAPTER2 
  },
  { 
    id: 'ch3', 
    title: '🏡 פרק 3: תכנות מנועים, תאורת RGB וחיישני אקלים (שיעורים 3.1 עד 3.7)', 
    description: 'סרוו דלת וחלון, תאורת SK6812 RGB, מאוורר DC, מסך LCD1602, גילוי גז MQ-2 וחיישן XHT11', 
    lessons: SMART_HOME_CODING_CHAPTER3 
  },
  { 
    id: 'ch4', 
    title: '🚀 פרק 4: אבטחה חכמה, תקשורת Wi-Fi ופרויקט גמר IoT (שיעורים 4.1 עד 4.4)', 
    description: 'מנעול RFID, קוד מורס, שרת אינטרנט Web Server ופרויקט גמר בית חכם אוטונומי מלא', 
    lessons: SMART_HOME_CODING_CHAPTER4 
  }
];

function Smarthouse() {
  const navigate = useNavigate();
  const isStandalone = new URLSearchParams(window.location.search).get('standalone') === 'true';

  const [smartHouseKit, setSmartHouseKit] = useState('ks5009');
  const [showKitSelectModal, setShowKitSelectModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(isStandalone ? 'workspace' : 'curriculum');
  const [selectedLessonId, setSelectedLessonId] = useState('ks_welcome');
  const [completedLessons, setCompletedLessons] = useState({});

  const handleSelectKitModal = (kit) => {
    setSmartHouseKit(kit);
    setShowKitSelectModal(false);
  };

  const [activeFileTab, setActiveFileTab] = useState('main'); // 'main' | 'header' | 'cpp'
  const [mainCode, setMainCode] = useState(SMARTHOUSE_INO_FULL_CODE);
  const [headerCode, setHeaderCode] = useState(SMARTHOUSE_H_CODE);
  const [cppCode, setCppCode] = useState(SMARTHOUSE_CPP_CODE);

  const [zoomImageSrc, setZoomImageSrc] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showFlashingModal, setShowFlashingModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [showSavedProjectModal, setShowSavedProjectModal] = useState(false);
  const [savedProjectModalTab, setSavedProjectModalTab] = useState('save');
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [saveNotification, setSaveNotification] = useState('');

  const [flashingMode, setFlashingMode] = useState('flash');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedLockedLesson, setSelectedLockedLesson] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(() => isTrackUnlocked('smarthouse'));

  const [selectedBoard, setSelectedBoard] = useState('esp32');
  const [comPort, setComPort] = useState('COM3');
  const [filename, setFilename] = useState('smarthouse_main.ino');
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  const blocklyDivRef = useRef(null);
  const [toolboxConfig, setToolboxConfig] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [isWorkspaceInitialized, setIsWorkspaceInitialized] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(SMARTHOUSE_INO_FULL_CODE);

  const isLessonFree = (lessonId) => {
    if (isTrackUnlocked('smarthouse')) return true;
    return lessonId === 'ks_welcome' || lessonId.startsWith('intro_') || lessonId === 'ks_step_1.1' || lessonId === 'ks_step_1.2' || lessonId === '2.1';
  };

  const handleLessonClick = (lesson) => {
    if (!isTrackUnlocked('smarthouse') && !isLessonFree(lesson.id)) {
      setSelectedLockedLesson(lesson);
      setShowSubscriptionModal(true);
      return;
    }
    setSelectedLessonId(lesson.id);
  };

  const handleGoBack = () => {
    try {
      navigate('/tracks');
    } catch (e) {
      navigate('/');
    }
  };

  // Open Standalone Workspace Window
  const handleOpenWorkspaceInNewWindow = () => {
    try {
      const currentUrl = window.location.href;
      const targetUrl = currentUrl.includes('?') 
        ? `${currentUrl}&standalone=true` 
        : `${currentUrl}?standalone=true`;
      window.open(targetUrl, '_blank', 'width=1350,height=900,resizable=yes,scrollbars=yes');
    } catch (e) {
      console.error('Error opening standalone browser window:', e);
    }
  };

  // Active Lesson or Chapter Mission Briefing lookup
  let currentLesson = null;
  let currentChapter = null;
  let currentBriefing = null;

  if (selectedLessonId.startsWith('intro_')) {
    const chKey = selectedLessonId.replace('intro_', '');
    currentBriefing = CHAPTER_BRIEFINGS[chKey] || CHAPTER_BRIEFINGS['ch1'];
    currentChapter = SMART_HOME_CHAPTERS.find(c => c.id === chKey) || SMART_HOME_CHAPTERS[0];
  } else {
    SMART_HOME_CHAPTERS.forEach(ch => {
      ch.lessons.forEach(l => {
        if (l.id === selectedLessonId) {
          currentLesson = l;
          currentChapter = ch;
        }
      });
    });

    if (!currentLesson) {
      currentLesson = SMART_HOME_ASSEMBLY_ALL[0];
      currentChapter = SMART_HOME_CHAPTERS[0];
    }
  }

  // Linear sequence of all navigable pages (Chapter Briefings + Lessons)
  const ALL_SEQUENCE_ITEMS = useMemo(() => {
    const seq = [];
    SMART_HOME_CHAPTERS.forEach(ch => {
      seq.push({ id: `intro_${ch.id}`, title: `📋 תדריך משימה: ${ch.title}`, isBriefing: true, chapterId: ch.id });
      ch.lessons.forEach(l => {
        if (!l.isWelcomePage) {
          seq.push(l);
        }
      });
    });
    return seq;
  }, []);

  const currentSequenceIndex = ALL_SEQUENCE_ITEMS.findIndex(item => item.id === selectedLessonId);

  // Calculate Total Lessons across all chapters (excluding welcome)
  let totalLessonsCount = 0;
  SMART_HOME_CHAPTERS.forEach(ch => {
    totalLessonsCount += ch.lessons.filter(l => !l.isWelcomePage).length;
  });

  // 🏠 TOOLBOX: ONLY 5 CLEAN CATEGORIES (CONTROL, LOOPS, MATH, TEXT, SMART HOUSE) - NO EXTRA ROBOT/ESP/FIREBASE
  const loadToolboxConfiguration = () => {
    registerSmartHouseBasicBlocks();
    
    const standardToolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: '🎮 בקרה',
          colour: '#4338ca',
          contents: [
            { kind: 'block', type: 'controls_if' },
            { kind: 'block', type: 'controls_if_else' },
            { kind: 'block', type: 'logic_compare' },
            { kind: 'block', type: 'boolean_true' },
            { kind: 'block', type: 'boolean_false' },
            { kind: 'block', type: 'logic_compare_custom' }
          ]
        },
        {
          kind: 'category',
          name: '🔁 לולאות',
          colour: '#0d9488',
          contents: [
            { kind: 'block', type: 'controls_repeat_ext' },
            { kind: 'block', type: 'infinite_loop' }
          ]
        },
        {
          kind: 'category',
          name: '🔢 מתמטיקה',
          colour: '#4f46e5',
          contents: [
            { kind: 'block', type: 'math_number' },
            { kind: 'block', type: 'math_arithmetic' }
          ]
        },
        {
          kind: 'category',
          name: '📝 טקסט',
          colour: '#ec4899',
          contents: [
            { kind: 'block', type: 'text' },
            { kind: 'block', type: 'text_print' },
            { kind: 'block', type: 'double_quoted_text' },
            { kind: 'block', type: 'int_to_string' }
          ]
        },
        {
          kind: 'category',
          name: '🏠 בית חכם',
          colour: '#2563eb',
          contents: [
            // 🌟 4 CORE USER CONTROL STRUCTURE BLOCKS + FIREBASE DEFINES
            { kind: 'block', type: 'smarthouse_block_globals' },
            { kind: 'block', type: 'smarthouse_block_setup' },
            { kind: 'block', type: 'smarthouse_block_loop' },
            { kind: 'block', type: 'smarthouse_block_bottom' },
            { kind: 'block', type: 'firebase_wifi_defines' },
            // Function Definitions
            { kind: 'block', type: 'gass_function' },
            { kind: 'block', type: 'motion_sensor_function' },
            { kind: 'block', type: 'light_sensor_function' },
            { kind: 'block', type: 'temp_function' },
            { kind: 'block', type: 'activate_alarm_function' },
            { kind: 'block', type: 'open_window_function' },
            { kind: 'block', type: 'open_door_function' },
            // Function Calls
            { kind: 'block', type: 'call_gass_function' },
            { kind: 'block', type: 'call_motion_sensor_function' },
            { kind: 'block', type: 'call_light_sensor_function' },
            { kind: 'block', type: 'call_temp_function' },
            { kind: 'block', type: 'call_activate_alarm_function' },
            { kind: 'block', type: 'call_open_window_function' },
            { kind: 'block', type: 'call_open_door_function' },
            // Arduino Code Structure & Delays
            { kind: 'block', type: 'delay_seconds' },
            // LCD Display Functions
            { kind: 'block', type: 'lcd_display_text' },
            { kind: 'block', type: 'call_printlcdint' },
            { kind: 'block', type: 'lcd_clear' },
            { kind: 'block', type: 'lcd_set_cursor' },
            { kind: 'block', type: 'lcd_multi_print' },
            { kind: 'block', type: 'update_lcd_password' },
            { kind: 'block', type: 'reset_code_entry' },
            // Sensor Value Getters (Returns Value)
            { kind: 'block', type: 'get_gas_sensor_value_with_pin' },
            { kind: 'block', type: 'get_steam_sensor_temperature_with_pin' },
            { kind: 'block', type: 'calculate_lux' },
            { kind: 'block', type: 'motion_sensore' },
            { kind: 'block', type: 'esp32_analog_read' },
            { kind: 'block', type: 'call_getdata' },
            // Actuators & Controls (Statements)
            { kind: 'block', type: 'white_led' },
            { kind: 'block', type: 'yellow_led' },
            { kind: 'block', type: 'buzzer_tone' },
            { kind: 'block', type: 'no_tone' },
            { kind: 'block', type: 'fan_sensore' },
            { kind: 'block', type: 'open_door' },
            { kind: 'block', type: 'close_door' },
            { kind: 'block', type: 'open_window' },
            { kind: 'block', type: 'close_window' },
            { kind: 'block', type: 'servo_write' },
            { kind: 'block', type: 'servo_attach' },
            // WiFi & Cloud
            { kind: 'block', type: 'wifi_connect' },
            { kind: 'block', type: 'firebase_config' },
            { kind: 'block', type: 'call_setdata_function' },
            // Keypad & Password logic
            { kind: 'block', type: 'call_handle_button_presses' },
            { kind: 'block', type: 'correct_code_entered' }
          ]
        }
      ]
    };

    setToolboxConfig(standardToolbox);
    if (workspace) {
      workspace.updateToolbox(standardToolbox);
    }
  };

  useEffect(() => {
    loadToolboxConfiguration();
  }, []);

  const generateCodeForWorkspace = (ws) => {
    if (!ws) return currentLesson?.codeTemplate || SMARTHOUSE_INO_FULL_CODE;
    try {
      const rawBlockCode = javascriptGenerator.workspaceToCode(ws);
      if (!rawBlockCode || !rawBlockCode.trim()) return currentLesson?.codeTemplate || SMARTHOUSE_INO_FULL_CODE;
      return mergeSmartHouseBlocks(rawBlockCode, currentLesson?.codeTemplate || SMARTHOUSE_INO_FULL_CODE);
    } catch (err) {
      console.error('Error generating live code:', err);
      return currentLesson?.codeTemplate || SMARTHOUSE_INO_FULL_CODE;
    }
  };

  useEffect(() => {
    if (blocklyDivRef.current && !workspace && toolboxConfig) {
      try {
        if (toolboxConfig.contents) {
          const scanAndRegister = (contents) => {
            contents.forEach(item => {
              if (item.kind === 'block' && item.type) {
                if (!Blockly.Blocks[item.type]) {
                  registerFallbackBlock(item.type);
                }
              } else if (item.contents) {
                scanAndRegister(item.contents);
              }
            });
          };
          scanAndRegister(toolboxConfig.contents);
        }

        const ws = Blockly.inject(blocklyDivRef.current, {
          toolbox: toolboxConfig,
          scrollbars: true,
          trashcan: true,
          grid: {
            spacing: 20,
            length: 3,
            colour: '#cbd5e1',
            snap: true
          },
          zoom: {
            controls: true,
            wheel: true,
            startScale: 0.9,
            maxScale: 2,
            minScale: 0.5,
            scaleSpeed: 1.1
          }
        });

        const updateLiveCode = () => {
          const code = generateCodeForWorkspace(ws);
          setGeneratedCode(code);
          setMainCode(code);
        };

        ws.addChangeListener(updateLiveCode);
        setWorkspace(ws);
        setIsWorkspaceInitialized(true);
        updateLiveCode();

        requestAnimationFrame(() => {
          try {
            Blockly.svgResize(ws);
          } catch (e) {}
        });
      } catch (err) {
        console.error('Failed to initialize Blockly:', err);
      }
    }
  }, [toolboxConfig, workspace]);

  useEffect(() => {
    if (currentLesson && currentLesson.codeTemplate) {
      setGeneratedCode(currentLesson.codeTemplate);
      setMainCode(currentLesson.codeTemplate);
    }
  }, [selectedLessonId]);

  useEffect(() => {
    if (workspace) {
      requestAnimationFrame(() => {
        try {
          Blockly.svgResize(workspace);
        } catch (e) {}
      });
    }
  }, [activeTab, isEditorVisible]);

  const handleSaveCode = () => {
    setSaveNotification('✅ הקוד נשמר בהצלחה!');
    setTimeout(() => setSaveNotification(''), 3000);
  };

  const handleDownloadCode = () => {
    const downloadSingle = (content, name) => {
      const element = document.createElement("a");
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    const mainName = filename || "smarthouse_main.ino";
    const mainContent = mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE;
    downloadSingle(mainContent, mainName);
    setTimeout(() => downloadSingle(headerCode, "SmartHouse.h"), 300);
    setTimeout(() => downloadSingle(cppCode, "SmartHouse.cpp"), 600);
  };

  const handleLoadPersonalProject = (loadedProject) => {
    if (!loadedProject) return;
    if (loadedProject.code) {
      setMainCode(loadedProject.code);
      setGeneratedCode(loadedProject.code);
    }
    if (loadedProject.blockXml && workspace) {
      try {
        workspace.clear();
        const dom = Blockly.utils.xml.textToDom(loadedProject.blockXml);
        Blockly.Xml.domToWorkspace(dom, workspace);
      } catch (e) {
        console.error("Error loading blockXml into workspace:", e);
      }
    }
    setShowSavedProjectModal(false);
  };

  const handleCompleteLesson = () => {
    if (currentLesson && currentLesson.id) {
      setCompletedLessons(prev => ({ ...prev, [currentLesson.id]: true }));
    }
    
    // Find next sequential page in linear course order
    const nextIdx = currentSequenceIndex + 1;
    if (nextIdx < ALL_SEQUENCE_ITEMS.length) {
      setSelectedLessonId(ALL_SEQUENCE_ITEMS[nextIdx].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    const prevIdx = currentSequenceIndex - 1;
    if (prevIdx >= 0) {
      setSelectedLessonId(ALL_SEQUENCE_ITEMS[prevIdx].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. STANDALONE WORKSPACE POPUP VIEW ONLY (MATCHING 4WD CAR & TOOLBOX)
  if (isStandalone) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', direction: 'rtl', overflow: 'hidden' }}>
        
        {/* TOP WORKSPACE TOOLBAR */}
        <div style={{ padding: '10px 18px', background: '#ffffff', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => { 
                handleSaveCode();
                setFlashingMode('flash'); 
                setShowFlashingModal(true); 
              }} 
              className="builder-btn builder-btn-hero"
              style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#ffffff' }}
            >
              🚀 צרוב ל-ESP32 / SmartHouse
            </button>

            <button 
              type="button"
              onClick={() => setShowDriverModal(true)} 
              className="builder-btn" 
              style={{ background: '#f8fafc', color: '#1e293b', border: '1.5px solid #cbd5e1', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="הורדת דרייברים לחיבור כבל USB של ה-ESP32"
            >
              🔌 דרייברים ל-USB
            </button>

            <button 
              type="button"
              onClick={() => setShowSendEmailModal(true)} 
              className="builder-btn" 
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="שליחת הקוד למורה ב-WhatsApp / אימייל"
            >
              📧 שלח קוד למורה
            </button>

            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="builder-btn"
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  color: '#334155',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                ⚙️ פעולות נוספות ▾
              </button>

              {showActionsDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                    minWidth: '220px',
                    zIndex: 9999,
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onMouseLeave={() => setShowActionsDropdown(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSavedProjectModalTab('save');
                      setShowSavedProjectModal(true);
                      setShowActionsDropdown(false);
                    }}
                    style={{ background: 'transparent', border: 'none', padding: '9px 12px', textAlign: 'right', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    💾 שמור פרויקט בענן
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSavedProjectModalTab('load');
                      setShowSavedProjectModal(true);
                      setShowActionsDropdown(false);
                    }}
                    style={{ background: 'transparent', border: 'none', padding: '9px 12px', textAlign: 'right', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📂 פתח פרויקטים שמורים
                  </button>

                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveCode();
                      setFlashingMode('compile');
                      setShowFlashingModal(true);
                      setShowActionsDropdown(false);
                    }}
                    style={{ background: 'transparent', border: 'none', padding: '9px 12px', textAlign: 'right', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    ⚙️ קמפל קוד
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadCode();
                      setShowActionsDropdown(false);
                    }}
                    style={{ background: 'transparent', border: 'none', padding: '9px 12px', textAlign: 'right', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📄 הורד קוד (.ino)
                  </button>
                </div>
              )}
            </div>

            {saveNotification && (
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#15803d', background: '#f0fdf4', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                {saveNotification}
              </span>
            )}

            <button onClick={() => setIsEditorVisible(!isEditorVisible)} className="builder-btn" style={{ background: '#f8fafc' }}>
              👁️ {isEditorVisible ? 'הסתר קוד' : 'הצג קוד בלייב'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 'bold', color: '#475569' }}>שם קובץ:</span>
              <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} className="builder-input-field" style={{ width: '150px', padding: '4px 8px' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 'bold', color: '#475569' }}>יציאה:</span>
              <select value={comPort} onChange={(e) => setComPort(e.target.value)} className="builder-select-box" style={{ padding: '4px 8px' }}>
                {Array.from({ length: 20 }, (_, i) => `COM${i + 1}`).map(port => (
                  <option key={port} value={port}>{port}</option>
                ))}
              </select>
              <ComPortStatusBadge currentPort={comPort} onSelectPort={setComPort} board={selectedBoard} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 'bold', color: '#475569' }}>בחר לוח:</span>
              <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="builder-select-box" style={{ padding: '4px 8px', fontWeight: 'bold', color: '#e11d48' }}>
                <option value="esp32">🔥 ESP32 Dev Module</option>
                <option value="uno">🤖 Arduino Uno</option>
              </select>
            </div>
          </div>
        </div>

        {/* SPLIT WORKSPACE CONTAINER (BLOCKLY ON LEFT, MONACO CODE EDITOR ON RIGHT) */}
        <div 
          className="builder-workspace-container" 
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'row', 
            width: '100%', 
            height: '100%', 
            position: 'relative', 
            overflow: 'hidden',
            direction: 'ltr'
          }}
        >
          {/* BLOCKLY WORKSPACE MAIN AREA (LEFT SIDE) */}
          <div className="builder-blockly-wrapper" style={{ flex: 1, height: '100%', position: 'relative', minHeight: '580px', direction: 'rtl' }}>
            <div 
              ref={blocklyDivRef} 
              id="smarthouseBlocklyDiv"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
            />
          </div>

          {/* LIVE MONACO C++ MULTI-FILE CODE PANEL (RIGHT SIDE) */}
          {isEditorVisible && (
            <div 
              className="builder-side-code-panel"
              style={{ width: '460px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #cbd5e1', background: '#0f172a', color: '#ffffff', flexShrink: 0, direction: 'rtl' }}
            >
              {/* Header Title & Close Button */}
              <div className="code-panel-header" style={{ padding: '10px 14px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 'bold' }}>💻 עורך קוד מרובה קבצים (C++ / Arduino)</span>
                <button 
                  onClick={() => setIsEditorVisible(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>

              {/* MULTI-FILE TAB SELECTOR */}
              <div style={{ display: 'flex', background: '#0f172a', borderBottom: '1px solid #334155', padding: '4px 8px 0 8px', gap: '4px', direction: 'ltr' }}>
                <button
                  onClick={() => setActiveFileTab('main')}
                  style={{
                    padding: '8px 12px',
                    background: activeFileTab === 'main' ? '#1e293b' : 'transparent',
                    color: activeFileTab === 'main' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    borderBottom: activeFileTab === 'main' ? '2px solid #38bdf8' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    borderRadius: '6px 6px 0 0'
                  }}
                >
                  📄 {filename || 'smarthouse_main.ino'}
                </button>

                <button
                  onClick={() => setActiveFileTab('header')}
                  style={{
                    padding: '8px 12px',
                    background: activeFileTab === 'header' ? '#1e293b' : 'transparent',
                    color: activeFileTab === 'header' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    borderBottom: activeFileTab === 'header' ? '2px solid #38bdf8' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    borderRadius: '6px 6px 0 0'
                  }}
                >
                  📘 SmartHouse.h
                </button>

                <button
                  onClick={() => setActiveFileTab('cpp')}
                  style={{
                    padding: '8px 12px',
                    background: activeFileTab === 'cpp' ? '#1e293b' : 'transparent',
                    color: activeFileTab === 'cpp' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    borderBottom: activeFileTab === 'cpp' ? '2px solid #38bdf8' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    borderRadius: '6px 6px 0 0'
                  }}
                >
                  📙 SmartHouse.cpp
                </button>
              </div>

              {/* MONACO EDITOR AREA */}
              <div style={{ flex: 1, direction: 'ltr' }}>
                <MonacoEditor
                  language="cpp"
                  theme="vs-dark"
                  value={
                    activeFileTab === 'main'
                      ? (mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE)
                      : activeFileTab === 'header'
                      ? headerCode
                      : cppCode
                  }
                  onChange={(newCode) => {
                    if (activeFileTab === 'main') setMainCode(newCode);
                    else if (activeFileTab === 'header') setHeaderCode(newCode);
                    else if (activeFileTab === 'cpp') setCppCode(newCode);
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: false,
                    tabSize: 2,
                    wordWrap: 'on'
                  }}
                  editorDidMount={(editor) => setMonacoInstance(editor)}
                />
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        <AIBlockGeneratorModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} workspace={workspace} />
        <FlashingModal isOpen={showFlashingModal} onClose={() => setShowFlashingModal(false)} mode={flashingMode} code={mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE} port={comPort} board={selectedBoard} />
        <DriverModal isOpen={showDriverModal} onClose={() => setShowDriverModal(false)} />
        <SendCodeModal isOpen={showSendEmailModal} onClose={() => setShowSendEmailModal(false)} filename={filename} projectName="🏡 בית חכם IoT" projectType="smarthouse" blockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''} code={mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE} />
        <SavedProjectModal isOpen={showSavedProjectModal} onClose={() => setShowSavedProjectModal(false)} initialTab={savedProjectModalTab} projectType="smarthouse" defaultProjectName="בית חכם IoT" currentBlockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''} currentCode={mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE} onLoadProject={handleLoadPersonalProject} />
      </div>
    );
  }

  // 2. EMBEDDED CURRICULUM VIEW (WITH TOP NAVBAR)
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', direction: 'rtl', overflow: 'hidden', position: 'relative' }}>
      
      {/* 🌟 TOP STUDIO NAVBAR (ONLY SHOWN FOR IN-DEPTH LESSONS, HIDDEN ON WELCOME LANDING) */}
      {!currentLesson?.isWelcomePage && (
        <div className="builder-header-toolbar" style={{ padding: '12px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
          <div className="builder-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              type="button"
              onClick={handleGoBack} 
              className="builder-btn" 
              style={{ textDecoration: 'none', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#1e293b', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.92rem' }}
            >
              <span>🏠</span>
              <span>חזרה למסלולים</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="builder-brand-title" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
                🏡 בית חכם IoT Keyestudio (KS5009)
              </span>
            </div>
          </div>

          {/* Center Navigation: Curriculum Drawer Toggle & Active Chapter Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="builder-btn"
              style={{
                background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                color: '#be123c',
                border: '1.5px solid #fecdd3',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(225, 29, 72, 0.15)',
                transition: 'all 0.2s ease',
                fontSize: '0.94rem'
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>📚</span>
              <span>תוכנית השיעורים והפרקים</span>
              <span style={{
                background: '#e11d48',
                color: '#ffffff',
                padding: '2px 9px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '900'
              }}>
                {Object.keys(completedLessons).length}/{totalLessonsCount}
              </span>
            </button>
          </div>

          {/* Action Controls - Standalone Workspace Button Only */}
          <div className="builder-controls-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button"
              onClick={handleOpenWorkspaceInNewWindow}
              className="builder-btn builder-btn-hero"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '900',
                padding: '9px 20px',
                fontSize: '0.92rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '12px'
              }}
            >
              <span>🧪</span>
              <span>פתח סביבת עבודה בחלונית חדשה ↗</span>
            </button>
          </div>
        </div>
      )}

      {/* 📜 SLIDING CURRICULUM DRAWER OVERLAY */}
      {isSidebarOpen && (
        <>
          {/* Semi-transparent backdrop */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 99990,
              cursor: 'pointer'
            }}
          />

          {/* Sliding Drawer Container */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '420px',
              maxWidth: '88vw',
              background: '#ffffff',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.3)',
              zIndex: 99995,
              display: 'flex',
              flexDirection: 'column',
              direction: 'rtl'
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '20px 24px', background: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏡</span>
                  <span>תוכנית הלימודים המלאה</span>
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#fda4af', marginTop: '6px' }}>
                  {Object.keys(completedLessons).length} מתוך {totalLessonsCount} שיעורים הושלמו ({Math.round((Object.keys(completedLessons).length / (totalLessonsCount || 1)) * 100)}%)
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                title="סגור תפריט"
              >
                ✕
              </button>
            </div>

            {/* Overall Progress Bar */}
            <div style={{ width: '100%', height: '5px', background: '#1e293b' }}>
              <div 
                style={{ 
                  width: `${Math.min(100, Math.round((Object.keys(completedLessons).length / (totalLessonsCount || 1)) * 100))}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #e11d48, #f43f5e, #10b981)',
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>

            {/* Chapters Accordion / List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SMART_HOME_CHAPTERS.map(ch => {
                const chapterLessons = ch.lessons.filter(l => !l.isWelcomePage);
                const chapterDoneCount = chapterLessons.filter(l => completedLessons[l.id]).length;
                const isCurrentChapter = currentChapter && currentChapter.id === ch.id;

                return (
                  <div key={ch.id} style={{ borderRadius: '16px', background: '#f8fafc', border: isCurrentChapter ? '2px solid #fb7185' : '1px solid #e2e8f0', overflow: 'hidden', boxShadow: isCurrentChapter ? '0 4px 16px rgba(225,29,72,0.08)' : 'none' }}>
                    
                    {/* Chapter Header */}
                    <div style={{ padding: '12px 16px', background: isCurrentChapter ? '#fff1f2' : '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.88rem', color: isCurrentChapter ? '#9f1239' : '#334155' }}>
                        {ch.title}
                      </div>
                      <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: '12px', background: chapterDoneCount === chapterLessons.length && chapterLessons.length > 0 ? '#dcfce7' : '#ffffff', color: chapterDoneCount === chapterLessons.length && chapterLessons.length > 0 ? '#15803d' : '#64748b', fontWeight: 'bold' }}>
                        {chapterDoneCount}/{chapterLessons.length}
                      </span>
                    </div>

                    {/* Chapter Mission Briefing Link */}
                    {CHAPTER_BRIEFINGS[ch.id] && (
                      <button
                        onClick={() => {
                          setSelectedLessonId(`intro_${ch.id}`);
                          setIsSidebarOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          textAlign: 'right',
                          background: selectedLessonId === `intro_${ch.id}` ? 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%)' : '#ffffff',
                          border: 'none',
                          borderBottom: '1px solid #f1f5f9',
                          borderRight: selectedLessonId === `intro_${ch.id}` ? '4px solid #e11d48' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.84rem',
                          fontWeight: selectedLessonId === `intro_${ch.id}` ? '800' : '600',
                          color: selectedLessonId === `intro_${ch.id}` ? '#be123c' : '#4b5563'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📋</span>
                          <span>תדריך משימה: {CHAPTER_BRIEFINGS[ch.id].title.replace(/^[^:]*:\s*/, '')}</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '8px', background: '#ffe4e6', color: '#be123c', fontWeight: 'bold' }}>
                          הקדמה
                        </span>
                      </button>
                    )}

                    {/* Lessons list */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {ch.lessons.map(l => {
                        if (l.isWelcomePage) return null;
                        const isSelected = l.id === selectedLessonId;
                        const isDone = completedLessons[l.id];

                        return (
                          <button
                            key={l.id}
                            onClick={() => {
                              handleLessonClick(l);
                              setIsSidebarOpen(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              textAlign: 'right',
                              background: isSelected ? '#fff1f2' : '#ffffff',
                              border: 'none',
                              borderBottom: '1px solid #f1f5f9',
                              borderRight: isSelected ? '4px solid #e11d48' : 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.82rem',
                              fontWeight: isSelected ? '800' : '500',
                              color: isSelected ? '#be123c' : '#475569',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {l.title}
                            </span>
                            {isDone ? (
                              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', marginRight: '8px' }}>✓</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 🔙 TOP-LEFT CLEAN BACK BUTTON (FOR WELCOME LANDING ONLY) */}
      {currentLesson?.isWelcomePage && (
        <button
          onClick={handleGoBack}
          style={{
            position: 'fixed',
            top: '24px',
            left: '24px',
            zIndex: 9999,
            padding: '12px 24px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: '800',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.25s ease',
            fontFamily: "'Rubik', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>←</span>
          <span>חזרה</span>
        </button>
      )}

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        
        {/* 📺 MAIN CONTENT CONTAINER (MATCHING /tracks HIGH-TECH BACKGROUND) */}
        <div 
          className={(!currentLesson?.isWelcomePage && !currentBriefing) ? 'tracks-root-bg' : ''}
          style={{ 
            flex: 1, 
            minHeight: 0,
            height: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            overflowY: 'auto', 
            position: 'relative',
            backgroundColor: (!currentLesson?.isWelcomePage && !currentBriefing) ? '#f6f8fc' : 'transparent',
            padding: (currentLesson?.isWelcomePage || currentBriefing) ? '0' : '24px 24px 48px 24px' 
          }}
        >
          {/* Ambient Moving Tech Canvas matching /tracks (Image 2) */}
          {!currentLesson?.isWelcomePage && !currentBriefing && (
            <div className="tracks-ambient-canvas" aria-hidden="true">
              <div className="tracks-cyber-grid" />
              <div className="tracks-floating-orb tracks-orb-cyan" />
              <div className="tracks-floating-orb tracks-orb-purple" />
              <div className="tracks-floating-orb tracks-orb-magenta" />
              <div className="tracks-floating-orb tracks-orb-emerald" />
            </div>
          )}

          {/* CURRICULUM & LESSON STEP DETAILS */}
          <div style={{ width: '100%', maxWidth: (currentLesson?.isWelcomePage || currentBriefing) ? '100%' : '1500px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            
            {/* 📋 CASE A: CHAPTER MISSION BRIEFING (VIBRANT BACKGROUND LIKE OPENING SLIDE) */}
            {currentBriefing && (
              <div style={{
                width: '100%',
                minHeight: 'calc(100vh - 65px)',
                backgroundImage: 'linear-gradient(180deg, rgba(8, 12, 28, 0.40) 0%, rgba(12, 17, 38, 0.65) 42%, rgba(6, 10, 24, 0.94) 100%), url("/smart_house_background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                color: '#ffffff',
                padding: '48px 32px 100px',
                direction: 'rtl',
                boxSizing: 'border-box'
              }}>
                <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Hero Banner */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.72)',
                    border: '1.5px solid rgba(244, 63, 94, 0.35)',
                    borderRadius: '28px',
                    padding: '36px 40px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 35px rgba(225, 29, 72, 0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '24px'
                  }}>
                    <div style={{ flex: 1, minWidth: '320px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 18px',
                        borderRadius: '24px',
                        background: 'rgba(225, 29, 72, 0.2)',
                        border: `1.5px solid ${currentBriefing.badgeColor || '#f43f5e'}`,
                        color: '#fecdd3',
                        fontSize: '0.88rem',
                        fontWeight: '800',
                        marginBottom: '14px'
                      }}>
                        <span>{currentBriefing.badge}</span>
                      </div>

                      <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: '900', margin: '0 0 10px 0', color: '#ffffff', textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>
                        {currentBriefing.title}
                      </h1>

                      <p style={{ fontSize: '1.15rem', color: '#fecdd3', margin: '0 0 16px 0', fontWeight: '500' }}>
                        {currentBriefing.subtitle}
                      </p>

                      <p style={{ fontSize: '1.02rem', color: '#cbd5e1', margin: 0, lineHeight: '1.7', maxWidth: '850px' }}>
                        {currentBriefing.overview}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
                      <button
                        onClick={() => setSelectedLessonId(currentBriefing.firstLessonId)}
                        style={{
                          padding: '18px 36px',
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: '900',
                          fontSize: '1.12rem',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(225, 29, 72, 0.55), 0 0 20px rgba(251, 113, 133, 0.35)',
                          transition: 'all 0.25s ease',
                          fontFamily: 'inherit',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 14px 40px rgba(225, 29, 72, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(225, 29, 72, 0.55)';
                        }}
                      >
                        🚀 התחל את משימות הפרק ←
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600' }}>
                        <span>⏱️ זמן משוער:</span>
                        <span style={{ color: '#fecdd3', fontWeight: '800' }}>{currentBriefing.timeEst}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Detail Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    
                    {/* Card 1: Kit components */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.68)',
                      border: '1.5px solid rgba(244, 63, 94, 0.25)',
                      borderRadius: '24px',
                      padding: '28px 24px',
                      backdropFilter: 'blur(16px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>🧰</span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                          ערכת רכיבים נדרשת
                        </h3>
                      </div>
                      <ul style={{ margin: 0, paddingRight: '20px', color: '#cbd5e1', fontSize: '0.94rem', lineHeight: '1.8' }}>
                        {currentBriefing.kit.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Card 2: Mission Objectives */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.68)',
                      border: '1.5px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '24px',
                      padding: '28px 24px',
                      backdropFilter: 'blur(16px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>🎯</span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                          יעדי המשימה
                        </h3>
                      </div>
                      <ul style={{ margin: 0, paddingRight: '20px', color: '#cbd5e1', fontSize: '0.94rem', lineHeight: '1.8' }}>
                        {currentBriefing.objectives.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Card 3: Skills & Pro-Tip */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.68)',
                      border: '1.5px solid rgba(52, 211, 153, 0.25)',
                      borderRadius: '24px',
                      padding: '28px 24px',
                      backdropFilter: 'blur(16px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '1.3rem' }}>💡</span>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                            טיפ מהנדס להצלחה
                          </h3>
                        </div>
                        <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.92rem', lineHeight: '1.7', background: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {currentBriefing.proTip}
                        </p>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', marginBottom: '8px' }}>
                          מיומנויות נרכשות:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {currentBriefing.skills.map((skill, idx) => (
                            <span key={idx} style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.35)', color: '#6ee7b7', fontSize: '0.78rem', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' }}>
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setIsSidebarOpen(true)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#e2e8f0',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          ☰ כל השיעורים
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* 🛠️ CASE B: ATMOSPHERIC BANNER FOR STANDARD LESSONS */}
            {currentLesson && !currentLesson.isWelcomePage && !currentBriefing && (
              <div style={{
                backgroundImage: 'linear-gradient(90deg, rgba(8, 12, 28, 0.90) 0%, rgba(15, 23, 42, 0.62) 50%, rgba(8, 12, 28, 0.30) 100%), url("/smart_house_background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                backgroundRepeat: 'no-repeat',
                padding: '32px 42px',
                borderRadius: '26px',
                border: '1.5px solid rgba(244, 63, 94, 0.45)',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.22), 0 0 30px rgba(225, 29, 72, 0.2)',
                marginBottom: '26px',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.86rem', padding: '6px 16px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.35)', color: '#ffe4e6', fontWeight: '800', border: '1px solid rgba(251, 113, 133, 0.55)', backdropFilter: 'blur(8px)' }}>
                      {currentChapter ? currentChapter.title : ''}
                    </span>
                    <span style={{ fontSize: '0.82rem', padding: '5px 12px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.25)', color: '#67e8f9', fontWeight: '800', border: '1px solid rgba(6, 182, 212, 0.45)' }}>
                      🏡 KS5009 Smart Home IoT
                    </span>
                  </div>
                  <span style={{ fontSize: '0.94rem', color: '#fecdd3', fontWeight: '900', textShadow: '0 0 10px rgba(244, 63, 94, 0.5)' }}>
                    שלב {currentLesson.id}
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 1.95rem)', fontWeight: '900', color: '#ffffff', margin: 0, textShadow: '0 2px 14px rgba(0,0,0,0.7)' }}>
                  {currentLesson.title}
                </h2>
              </div>
            )}

            {/* WELCOME LANDING */}
            {currentLesson?.isWelcomePage && (
              <div style={{
                width: '100%',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(180deg, rgba(8, 12, 28, 0.42) 0%, rgba(12, 17, 38, 0.68) 42%, rgba(6, 10, 24, 0.94) 100%), url("/smart_house_background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                color: '#ffffff',
                padding: '56px 32px 80px',
                direction: 'rtl',
                boxSizing: 'border-box',
                fontFamily: "'Rubik', system-ui, -apple-system, sans-serif"
              }}>
                <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '44px' }}>
                  
                  {/* HERO BANNER & SHOWCASE */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '32px', alignItems: 'stretch' }}>
                    
                    {/* RIGHT: HERO TEXT PANEL */}
                    <div style={{
                      background: 'rgba(10, 16, 36, 0.65)',
                      border: '1.5px solid rgba(244, 63, 94, 0.35)',
                      borderRadius: '28px',
                      padding: '36px 38px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 35px rgba(244, 63, 94, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 22px',
                        borderRadius: '30px',
                        background: 'rgba(244, 63, 94, 0.18)',
                        border: '1px solid rgba(251, 113, 133, 0.45)',
                        color: '#fecdd3',
                        fontSize: '0.92rem',
                        fontWeight: '800',
                        marginBottom: '18px',
                        boxShadow: '0 0 20px rgba(244, 63, 94, 0.25)'
                      }}>
                        ✨ ערכת בית חכם IoT מלאה (Keyestudio KS5009)
                      </div>

                      <h1 style={{
                        fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)',
                        fontWeight: '900',
                        lineHeight: '1.18',
                        margin: '0 0 16px 0',
                        color: '#ffffff',
                        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(244, 63, 94, 0.35)'
                      }}>
                        🏡 בנו ותכנתו בית חכם IoT אוטונומי מלא!
                      </h1>

                      <p style={{
                        fontSize: '1.15rem',
                        color: '#e2e8f0',
                        lineHeight: '1.8',
                        margin: '0 0 28px 0',
                        fontWeight: '400',
                        textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                      }}>
                        {currentLesson.welcomeText}
                      </p>

                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button 
                          onClick={() => setSelectedLessonId('intro_ch1')} 
                          style={{
                            padding: '18px 42px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: '900',
                            fontSize: '1.15rem',
                            cursor: 'pointer',
                            boxShadow: '0 12px 35px rgba(225, 29, 72, 0.55), 0 0 25px rgba(251, 113, 133, 0.35)',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 16px 45px rgba(225, 29, 72, 0.7), 0 0 35px rgba(251, 113, 133, 0.55)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(225, 29, 72, 0.55), 0 0 25px rgba(251, 113, 133, 0.35)';
                          }}
                        >
                          🚀 היכנס לעולם הבית החכם והתחל בהרכבה צעד-אחר-צעד ←
                        </button>
                      </div>
                    </div>

                    {/* LEFT: HOLOGRAPHIC PROTOTYPE SHOWCASE CARD */}
                    <div style={{
                      background: 'rgba(12, 19, 42, 0.62)',
                      border: '2px solid rgba(244, 63, 94, 0.4)',
                      borderRadius: '28px',
                      overflow: 'hidden',
                      boxShadow: '0 25px 65px rgba(0,0,0,0.6), 0 0 40px rgba(244, 63, 94, 0.22)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      minHeight: '380px',
                      padding: '28px 24px',
                      boxSizing: 'border-box',
                      backdropFilter: 'blur(20px)'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 3,
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(244, 63, 94, 0.5)',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        color: '#fecdd3',
                        fontWeight: '800',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        📸 דגם מוגמר סופי · Smart House IoT ESP32
                      </div>

                      {/* Smart house showcase */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '330px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '2px solid rgba(244, 63, 94, 0.45)',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 30px rgba(244, 63, 94, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'radial-gradient(circle at center, rgba(30, 27, 75, 0.6) 0%, rgba(10, 16, 36, 0.95) 100%)'
                      }}>
                        <img 
                          src={SMARTHOUSE_HERO} 
                          alt="Smart House IoT Model"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            display: 'block'
                          }}
                        />
                      </div>

                      {/* Spec chips */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '14px', width: '100%' }}>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fda4af', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          ⚡ בקר ESP32 חזק
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38bdf8', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          🌡️ 13 חיישני סביבה
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#34d399', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          💳 כניסה RFID וסרוו
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#facc15', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          ☁️ תקשורת ענן IoT
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentLesson.features && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                      {currentLesson.features.map((feat, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(15, 23, 42, 0.55)',
                          border: '1.5px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '22px',
                          padding: '24px',
                          backdropFilter: 'blur(16px)',
                          textAlign: 'right',
                          fontFamily: 'inherit'
                        }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{feat.icon}</div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', fontFamily: 'inherit' }}>{feat.title}</h4>
                          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', margin: 0, lineHeight: '1.6', fontFamily: 'inherit' }}>{feat.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '2px solid rgba(244, 63, 94, 0.3)', borderRadius: '28px', padding: '28px', backdropFilter: 'blur(20px)', marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', padding: '0 8px', flexWrap: 'wrap', gap: '14px' }}>
                      <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.2rem' }}>
                        🎬 הדגמת היכולות וההרכבה המלאה (Official Keyestudio Video)
                      </span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedLessonId('intro_ch1')}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(225, 29, 72, 0.4)',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit'
                          }}
                        >
                          🚀 התחל בהרכבה ←
                        </button>
                        {currentLesson.videoLink && (
                          <a href={currentLesson.videoLink} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: '0.95rem', fontWeight: 'bold', textDecoration: 'none' }}>
                            📺 פתח בלשונית חדשה ↗
                          </a>
                        )}
                      </div>
                    </div>
                    {currentLesson.videoUrl && (
                      <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', background: '#000000' }}>
                        <video src={currentLesson.videoUrl} controls autoPlay muted loop playsInline style={{ width: '100%', maxHeight: '550px', objectFit: 'contain', display: 'block', borderRadius: '20px' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ASSEMBLY STEP IMAGES */}
            {currentLesson && !currentLesson.isWelcomePage && !currentBriefing && (currentLesson.partsImg || currentLesson.assemblyImg || currentLesson.prototypeImg) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '28px', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  {currentLesson.partsImg && (
                    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden', width: '100%' }}>
                      <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>📸 1. רכיבים נדרשים לשלב</span>
                        <button onClick={() => setZoomImageSrc(currentLesson.partsImg)} style={{ background: '#eff6ff', color: '#2563eb', border: '1.5px solid #bfdbfe', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '800' }}>🔍 הגדל</button>
                      </div>
                      <div onClick={() => setZoomImageSrc(currentLesson.partsImg)} style={{ background: '#ffffff', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                        <img src={currentLesson.partsImg} alt="רכיבים נדרשים" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                      </div>
                    </div>
                  )}

                  {currentLesson.assemblyImg && (
                    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden', width: '100%' }}>
                      <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>📐 2. שרטוט הרכבה (Installation Diagram)</span>
                        <button onClick={() => setZoomImageSrc(currentLesson.assemblyImg)} style={{ background: '#eff6ff', color: '#2563eb', border: '1.5px solid #bfdbfe', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '800' }}>🔍 הגדל</button>
                      </div>
                      <div onClick={() => setZoomImageSrc(currentLesson.assemblyImg)} style={{ background: '#ffffff', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                        <img src={currentLesson.assemblyImg} alt="שרטוט הרכבה" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                      </div>
                    </div>
                  )}

                  {currentLesson.prototypeImg && (
                    <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '24px', overflow: 'hidden', width: '100%' }}>
                      <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>✨ 3. תוצאת השלב (Finished Step)</span>
                        <button onClick={() => setZoomImageSrc(currentLesson.prototypeImg)} style={{ background: '#eff6ff', color: '#2563eb', border: '1.5px solid #bfdbfe', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '800' }}>🔍 הגדל</button>
                      </div>
                      <div onClick={() => setZoomImageSrc(currentLesson.prototypeImg)} style={{ background: '#ffffff', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                        <img src={currentLesson.prototypeImg} alt="תוצאת השלב" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* 15 WIRING STEPS */}
                {currentLesson.wiringList && Array.isArray(currentLesson.wiringList) && (
                  <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', padding: '28px 32px', borderRadius: '24px', border: '2px solid #6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '2.5rem' }}>🔌⚡</span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '950' }}>מדריך חיווט מלא של כל 13 המודולים והרכיבים ל-ESP32 PLUS</h3>
                          <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem', color: '#c7d2fe', fontWeight: '600' }}>עקבו אחר חיבורי הפינים והאיורים המפורטים מטה עבור כל רכיב ומודול בנפרד (15 שלבי חיווט מפורטים):</p>
                        </div>
                      </div>
                      <span style={{ background: '#4f46e5', color: '#ffffff', padding: '8px 20px', borderRadius: '16px', fontSize: '0.95rem', fontWeight: '800' }}>15 חיבורי חומרה</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
                      {currentLesson.wiringList.map((wire, idx) => (
                        <div key={idx} style={{ background: '#ffffff', border: '2px solid #e0e7ff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', borderBottom: '1.5px solid #e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ background: '#4f46e5', color: '#ffffff', padding: '6px 14px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '900' }}>חיווט #{wire.stepNum}</span>
                              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>{wire.componentName}</h4>
                            </div>
                            <span style={{ background: '#fef2f2', color: '#e11d48', border: '1.5px solid #fecdd3', padding: '6px 16px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '800' }}>📌 {wire.pinConnection}</span>
                          </div>
                          {wire.instructions && (
                            <div style={{ padding: '14px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '0.95rem', fontWeight: '600' }}>💡 {wire.instructions}</div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: wire.diagramImg ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr', gap: '20px', padding: '24px' }}>
                            {wire.diagramImg && (
                              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '10px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#475569' }}>📐 תרשים מיקום פינים (Wiring Diagram)</span>
                                  <button onClick={() => setZoomImageSrc(wire.diagramImg)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '800', color: '#2563eb' }}>🔍 הגדל</button>
                                </div>
                                <div onClick={() => setZoomImageSrc(wire.diagramImg)} style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                                  <img src={wire.diagramImg} alt={`${wire.componentName} Diagram`} style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }} />
                                </div>
                              </div>
                            )}
                            {wire.boardImg && (
                              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '10px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#475569' }}>📸 תמונת תקריב חיווט בלוח ESP32 PLUS</span>
                                  <button onClick={() => setZoomImageSrc(wire.boardImg)} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '800', color: '#2563eb' }}>🔍 הגדל</button>
                                </div>
                                <div onClick={() => setZoomImageSrc(wire.boardImg)} style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                                  <img src={wire.boardImg} alt={`${wire.componentName} Board Photo`} style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CODING LESSON VIEW WITH BOTH BLOCKLY BREAKDOWN & C++ CODE */}
            {currentLesson && !currentLesson.isWelcomePage && !currentBriefing && currentLesson.codeTemplate && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '28px' }}>
                
                {/* 1. GOAL & EXPLANATION CARD */}
                <div style={{ background: '#ffffff', padding: '24px 28px', borderRadius: '24px', border: '1.5px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🎯</span> מטרת השיעור והסבר טכני:
                  </h4>
                  <p style={{ color: '#334155', fontSize: '1rem', margin: 0, lineHeight: '1.7' }}>
                    {currentLesson.goal}
                  </p>
                </div>

                {/* 2. 🧩 BLOCKLY BLOCKS NEEDED CARD */}
                {currentLesson.blocksNeeded && (
                  <div style={{ background: '#ffffff', padding: '26px 28px', borderRadius: '24px', border: '2px solid #bfdbfe', boxShadow: '0 6px 20px rgba(37,99,235,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🧩</span> הבלוקים המדויקים מתוך לשונית "🏠 בית חכם":
                      </h4>
                      <span style={{ background: '#eff6ff', color: '#2563eb', border: '1.5px solid #bfdbfe', padding: '6px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800' }}>
                        סביבת הבלוקים
                      </span>
                    </div>

                    {/* Block Badges List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {currentLesson.blocksNeeded.map((blk, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f8fafc', borderRadius: '14px', border: '1.5px solid #e2e8f0', flexWrap: 'wrap' }}>
                          <span style={{ background: blk.color || '#2563eb', color: '#ffffff', padding: '6px 14px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '900', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            {blk.name}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '800', background: '#e2e8f0', padding: '4px 10px', borderRadius: '8px' }}>
                            קטגוריה: {blk.category}
                          </span>
                          <span style={{ fontSize: '0.9rem', color: '#334155', flex: 1, fontWeight: '600' }}>
                            {blk.desc}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Step-by-step block instructions */}
                    {currentLesson.blockInstructions && (
                      <div style={{ background: '#f0f9ff', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid #bae6fd' }}>
                        <div style={{ fontWeight: '900', color: '#0369a1', fontSize: '0.96rem', marginBottom: '8px' }}>
                          🛠️ שלבי חיבור הבלוקים צעד-אחר-צעד:
                        </div>
                        <div style={{ color: '#0c4a6e', fontSize: '0.92rem', lineHeight: '1.8', whiteSpace: 'pre-line', fontWeight: '600' }}>
                          {currentLesson.blockInstructions}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. 💻 ARDUINO / C++ CODE TEMPLATE CARD */}
                <div style={{ background: '#ffffff', padding: '24px 28px', borderRadius: '24px', border: '1.5px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>💻</span> קוד C++ / Arduino שנוצר מהבלוקים (ESP32 Code):
                    </h4>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700' }}>קובץ: smarthouse_main.ino</span>
                  </div>

                  <div style={{ background: '#0f172a', padding: '20px', borderRadius: '16px', direction: 'ltr', textAlign: 'left', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '12px' }}>
                      <span>Arduino C++ (ESP32)</span>
                      <span>{currentLesson.id}</span>
                    </div>
                    <pre style={{ margin: 0, color: '#38bdf8', fontSize: '0.92rem', fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {currentLesson.codeTemplate}
                    </pre>
                  </div>

                  <button onClick={handleOpenWorkspaceInNewWindow} className="builder-btn builder-btn-hero" style={{ padding: '16px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' }}>
                    💻 פתח בסביבת העבודה בחלון נפרד ↗
                  </button>
                </div>

              </div>
            )}

            {/* 🚀 STICKY BOTTOM NAVIGATION BAR */}
            {!currentLesson?.isWelcomePage && !currentBriefing && (
              <div style={{
                position: 'sticky',
                bottom: '16px',
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(16px)',
                padding: '14px 24px',
                borderRadius: '20px',
                border: '1.5px solid #cbd5e1',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 40,
                marginTop: '36px',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                {/* BACKWARD BUTTON */}
                <button 
                  type="button"
                  onClick={handlePrevLesson}
                  disabled={currentSequenceIndex === 0}
                  className="builder-btn" 
                  style={{ 
                    padding: '14px 26px', 
                    fontSize: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    margin: 0,
                    background: currentSequenceIndex === 0 ? '#f1f5f9' : '#ffffff',
                    color: currentSequenceIndex === 0 ? '#94a3b8' : '#1e293b',
                    border: '1.5px solid #cbd5e1',
                    cursor: currentSequenceIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentSequenceIndex === 0 ? 0.6 : 1,
                    boxShadow: 'none'
                  }}
                >
                  <span>→</span>
                  <span>שלב קודם</span>
                </button>

                {/* PROGRESS COUNTER PILL & QUICK SYLLABUS BUTTON */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ background: '#f1f5f9', padding: '6px 16px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', border: '1px solid #e2e8f0' }}>
                    שלב {currentSequenceIndex + 1} מתוך {ALL_SEQUENCE_ITEMS.length}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      color: '#be123c',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '0.84rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                    title="פתח את מפת השיעורים המלאה"
                  >
                    <span>📚</span> מפת השיעורים
                  </button>

                  {Boolean(currentLesson && completedLessons[currentLesson.id]) && (
                    <span style={{ fontSize: '0.82rem', background: '#ecfdf5', color: '#059669', fontWeight: '800', padding: '4px 12px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                      ✓ שלב זה הושלם
                    </span>
                  )}
                </div>

                {/* FORWARD / COMPLETE BUTTON */}
                <button 
                  type="button"
                  onClick={handleCompleteLesson} 
                  className="builder-btn builder-btn-hero" 
                  style={{ 
                    padding: '14px 30px', 
                    fontSize: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
                  }}
                >
                  <span>{currentSequenceIndex === ALL_SEQUENCE_ITEMS.length - 1 ? '🏆 סיום הקורס!' : 'סיימתי את השלב! עבור לשלב הבא'}</span>
                  <span>←</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 📚 FLOATING QUICK-ACCESS CURRICULUM TAB */}
      {!currentLesson?.isWelcomePage && (
        <div 
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: 'fixed',
            right: 0,
            top: '40%',
            zIndex: 9990,
            background: 'linear-gradient(180deg, #9f1239 0%, #be123c 60%, #e11d48 100%)',
            color: '#ffffff',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            border: '1.5px solid rgba(251, 113, 133, 0.55)',
            borderRight: 'none',
            boxShadow: '-6px 6px 25px rgba(15, 23, 42, 0.45), 0 0 15px rgba(225, 29, 72, 0.3)',
            padding: '14px 10px 14px 8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.25s ease',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '-10px 8px 30px rgba(225, 29, 72, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '-6px 6px 25px rgba(15, 23, 42, 0.45)';
          }}
          title="לחץ לפתיחת תוכנית השיעורים המלאה"
        >
          <span style={{ fontSize: '1.35rem' }}>📚</span>
          <span style={{ writingMode: 'vertical-rl', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', color: '#fff1f2' }}>
            תוכנית השיעורים
          </span>
          <span style={{ fontSize: '0.72rem', background: '#881337', color: '#ffffff', padding: '3px 7px', borderRadius: '8px', fontWeight: 'bold' }}>
            {Object.keys(completedLessons).length}/{totalLessonsCount}
          </span>
        </div>
      )}

      {/* 🔍 LIGHTBOX MODAL */}
      {zoomImageSrc && (
        <div onClick={() => setZoomImageSrc(null)} style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(9, 13, 22, 0.96)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', background: '#ffffff', borderRadius: '28px', padding: '28px', maxWidth: '92vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 90px rgba(0,0,0,0.7)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1.5px solid #e2e8f0', direction: 'rtl' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>🔍 תצוגת שרטוט והרכבה מוגדלת</span>
              <button onClick={() => setZoomImageSrc(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: '#475569' }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', maxHeight: '76vh', width: '100%' }}>
              <img src={zoomImageSrc} alt="Enlarged Visual Step" style={{ maxWidth: '100%', maxHeight: '74vh', objectFit: 'contain', borderRadius: '16px' }} />
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AIBlockGeneratorModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} workspace={workspace} />
      <FlashingModal isOpen={showFlashingModal} onClose={() => setShowFlashingModal(false)} mode={flashingMode} code={mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE} port={comPort} board={selectedBoard} />
      <DriverModal isOpen={showDriverModal} onClose={() => setShowDriverModal(false)} />
      <SendCodeModal isOpen={showSendEmailModal} onClose={() => setShowSendEmailModal(false)} filename={filename} projectName="🏡 בית חכם IoT" projectType="smarthouse" blockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''} code={mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE} />
      <SavedProjectModal isOpen={showSavedProjectModal} onClose={() => setShowSavedProjectModal(false)} initialTab={savedProjectModalTab} projectType="smarthouse" defaultProjectName="בית חכם IoT" currentBlockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''} currentCode={mainCode || generatedCode || SMARTHOUSE_INO_FULL_CODE} onLoadProject={handleLoadPersonalProject} />

      {/* KIT SELECTION POPUP */}
      {showKitSelectModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', direction: 'rtl' }}>
          <div style={{ background: '#ffffff', borderRadius: '32px', padding: '40px 36px', maxWidth: '820px', width: '100%', boxShadow: '0 25px 70px rgba(0,0,0,0.4)', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowKitSelectModal(false)} style={{ position: 'absolute', top: '20px', left: '20px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}>✕</button>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏡</div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>בחרו את דגם ערכת הבית החכם שלכם</h2>
            <p style={{ color: '#64748b', fontSize: '1.02rem', margin: '0 0 32px 0' }}>SmartStart תומכת בכל דגמי הבית החכם של Keyestudio. בחרו את הדגם שברשותכם:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'right' }}>
              <div onClick={() => handleSelectKitModal('ks5009')} style={{ border: smartHouseKit === 'ks5009' ? '2.5px solid #e11d48' : '2px solid #e2e8f0', background: smartHouseKit === 'ks5009' ? '#fff1f2' : '#ffffff', borderRadius: '24px', padding: '24px', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>בית חכם ESP32 (דגם KS5009)</h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>ערכת עץ מלאה עם בקר ESP32 מובנה, 13 חיישנים, מסך LCD, RFID, מנועי סרוו ואוורור.</p>
                <button type="button" style={{ width: '100%', padding: '12px', borderRadius: '14px', background: '#e11d48', color: '#ffffff', border: 'none', fontWeight: '800', cursor: 'pointer' }}>בחר דגם זה והתחל ⬅</button>
              </div>
              <div onClick={() => handleSelectKitModal('ks0085')} style={{ border: smartHouseKit === 'ks0085' ? '2.5px solid #e11d48' : '2px solid #e2e8f0', background: smartHouseKit === 'ks0085' ? '#fff1f2' : '#ffffff', borderRadius: '24px', padding: '24px', cursor: 'pointer' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>בית חכם Arduino Uno (דגם KS0085)</h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>ערכת הבית החכם עם לוח Arduino PLUS ומודול ESP8266 חיצוני לתקשורת Wi-Fi.</p>
                <button type="button" style={{ width: '100%', padding: '12px', borderRadius: '14px', background: '#0f172a', color: '#ffffff', border: 'none', fontWeight: '800', cursor: 'pointer' }}>בחר דגם זה והתחל ⬅</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION MODAL */}
      {showSubscriptionModal && (
        <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} onSuccess={() => setIsUnlocked(true)} projectType="smarthouse" lessonTitle={selectedLockedLesson ? selectedLockedLesson.title : 'השיעור הנבחר'} />
      )}
    </div>
  );
}

export default Smarthouse;
