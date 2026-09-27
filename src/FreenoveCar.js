import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import MonacoEditor from 'react-monaco-editor';
import 'blockly/javascript';
import { registerAllBlocks, getAllRegisteredBlocks, registerFallbackBlock, SYSTEM_CUSTOM_BLOCKS, getDynamicProjectCategories } from './blockRegistry';
import AIBlockGeneratorModal from './AIBlockGeneratorModal';
import FlashingModal from './FlashingModal';
import DriverModal from './DriverModal';
import SendCodeModal from './SendCodeModal';
import SavedProjectModal from './SavedProjectModal';
import SubscriptionModal, { isTrackUnlocked } from './SubscriptionModal';
import ComPortStatusBadge from './ComPortStatusBadge';
import { SUPERBOT_H_CODE, SUPERBOT_CPP_CODE, SUPERBOT_INO_FULL_CODE, mergeBlocksWithBaseTemplate } from './superbotCode';
import { CAR_4WD_HERO } from './projectImages';

// Base Freenove Docs CDN Image URL
const FREENOVE_IMG_BASE = 'https://docs.freenove.com/projects/fnk0053/en/latest/_images/';

// Pre-register all system blocks at top-level module evaluation
registerAllBlocks();

// Register Freenove Car Specific Basic Arduino Blocks
function registerFreenoveCarBasicBlocks() {
  Blockly.Blocks['freenove_motor_drive'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🏎️ נהיגה 4WD")
          .appendField(new Blockly.FieldDropdown([
            ["קדימה", "FORWARD"],
            ["אחורה", "BACKWARD"],
            ["שמאלה", "LEFT"],
            ["ימינה", "RIGHT"],
            ["עצור", "STOP"]
          ]), "DIR")
          .appendField("מהירות:")
          .appendField(new Blockly.FieldTextInput("200"), "SPEED");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4f46e5');
      this.setTooltip("מניע את 4 מנועי המכונית");
    }
  };
  const motorGen = function(block) {
    const dir = block.getFieldValue('DIR');
    const speed = block.getFieldValue('SPEED') || '200';
    return `bot.moveForward(${speed}); // ${dir}\n`;
  };
  javascriptGenerator.forBlock['freenove_motor_drive'] = motorGen;
  javascriptGenerator['freenove_motor_drive'] = motorGen;

  Blockly.Blocks['freenove_servo_angle'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📐 זווית סרוו:")
          .appendField(new Blockly.FieldTextInput("90"), "ANGLE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7e22ce');
      this.setTooltip("מכוון את מנוע הסרוו לזווית הנבחרת");
    }
  };
  const servoGen = function(block) {
    const angle = block.getFieldValue('ANGLE') || '90';
    return `bot.moveHead(${angle}, 90);\n`;
  };
  javascriptGenerator.forBlock['freenove_servo_angle'] = servoGen;
  javascriptGenerator['freenove_servo_angle'] = servoGen;

  Blockly.Blocks['freenove_ultrasonic_distance'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📏 מרחק (ס\"מ)");
      this.setOutput(true, null);
      this.setColour('#059669');
      this.setTooltip("מחזיר מרחק בס\"מ ממכשול מול המכונית");
    }
  };
  const ultrasonicGen = function(block) {
    return [`bot.getDistance()`, javascriptGenerator.ORDER_ATOMIC];
  };
  javascriptGenerator.forBlock['freenove_ultrasonic_distance'] = ultrasonicGen;
  javascriptGenerator['freenove_ultrasonic_distance'] = ultrasonicGen;

  Blockly.Blocks['freenove_line_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🛤️ חיישן קו:")
          .appendField(new Blockly.FieldDropdown([
            ["שמאל", "LEFT"],
            ["מרכז", "CENTER"],
            ["ימין", "RIGHT"]
          ]), "SENSOR");
      this.setOutput(true, null);
      this.setColour('#ea580c');
      this.setTooltip("מחזיר אמת אם החיישן מזהה קו שחור");
    }
  };
  const lineGen = function(block) {
    const sensor = block.getFieldValue('SENSOR');
    return [`bot.checkLine(0, 1, 0)`, javascriptGenerator.ORDER_ATOMIC];
  };
  javascriptGenerator.forBlock['freenove_line_sensor'] = lineGen;
  javascriptGenerator['freenove_line_sensor'] = lineGen;

  Blockly.Blocks['freenove_delay'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("⏱️ המתן (מילי-שניות):")
          .appendField(new Blockly.FieldTextInput("1000"), "MS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("ממתין מספר מילי-שניות לפני המעבר לפקודה הבאה");
    }
  };
  const delayGen = function(block) {
    const ms = block.getFieldValue('MS') || '1000';
    return `delay(${ms});\n`;
  };
  javascriptGenerator.forBlock['freenove_delay'] = delayGen;
  javascriptGenerator['freenove_delay'] = delayGen;
}

// COMPLETE ALL 32 ASSEMBLY STEPS FROM FREENOVE OFFICIAL DOCS
const ASSEMBLY_STEPS_ALL = [
  // --- WELCOME PAGE ---
  {
    id: 'step_0.0',
    title: '✨ ברוכים הבאים לפרויקט רובוט מכונית 4WD Pro (Freenove ESP32)!',
    isWelcomePage: true,
    videoUrl: 'https://video.aliexpress-media.com/play/u/ae_sg_item/2213001014720/p/1/e/6/t/10301/1100063412438.mp4?from=chrome&definition=h265',
    videoLink: 'https://video.aliexpress-media.com/play/u/ae_sg_item/2213001014720/p/1/e/6/t/10301/1100063412438.mp4?from=chrome&definition=h265',
    welcomeText: 'ברוכים הבאים למסלול הרובוטיקה המתקדם! בפרויקט זה תבנו בעצמכם מכונית רובוטית 4WD Pro עוצמתית המבוססת על בקר ESP32-Wrover-Dev, עם ראש Pan-Tilt דו-צדדי, מצלמה בזמן אמת, מטריצת לדים, חיישן אולטרסוני, חיישן מעקב קו ושליטה מלאה באפליקציית Wi-Fi.',
    features: [
      { icon: '🏎️', title: '32 שלבי הרכבה מפורטים', desc: 'הרכבה מכאנית מלאה של ה-4WD, מנועי ה-DC, הגלגלים ושלדת האלומיניום.' },
      { icon: '📷', title: 'ראש Pan-Tilt ומצלמת ESP32', desc: 'תנועה דו-צירית למצלמת ה-Wi-Fi למעקב חזותי וצפייה בלייב.' },
      { icon: '🧩', title: 'תכנות בבלוקים ובקוד C++', desc: 'עריכת קוד C++ מלאה, סביבת Blockly ומחולל AI אוטומטי.' },
      { icon: '📱', title: 'שליטה באפליקציה ו-Wi-Fi', desc: 'נהיגה מרחוק באפליקציה, עקיפת מכשולים אוטונומית ומעקב קו.' }
    ]
  },
  { id: '1.0', title: 'ערכת חלקי תושבות המנוע (Motor Fixed Bracket Package)', partsNeeded: ['תושבת אלומיניום', '2x ברגי M3*30', '2x ברגי M3*8', '2x אומי M3'], instructions: ['זהה את חלקי תושבת המנוע בערכה: תושבות אלומיניום, ברגי M3*30, ברגי M3*8 ואומי M3.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_00.png` },
  { id: '1.1', title: 'שלב 1: חיבור תושבת המנוע ל-Car Shield', partsNeeded: ['2x ברגי M3*8', 'תושבת אלומיניום', 'לוח Car Shield תחתון'], instructions: ['הפוך את לוח השלדה כשהחלק התחתון מופנה כלפי מעלה.', 'חזק את תושבת המתכת לשלדה בעזרת שני ברגי M3*8.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_01.png` },
  { id: '1.2', title: 'שלב 2: הרכבת מנוע ה-DC לתושבת', partsNeeded: ['מנוע DC צהוב', '2x ברגי M3*30', '2x אומי M3'], instructions: ['הנח את מנוע ה-DC הצהוב בצמוד לתושבת המתכת.', 'הכנס שני ברגי M3*30 והדק בעזרת אומי M3 בצד השני.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_02.png` },
  { id: '1.3', title: 'שלב 3: חיווט כבלי המנוע לטרמינלים', partsNeeded: ['כבלי הזנת מנוע (אדום/שחור)'], instructions: ['העבר את כבלי המנוע דרך חור הכבלים במרכז הלוח.', 'חבר את הכבלים לטרמינלי המנוע העליונים ב-Car Shield.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_03.png` },
  { id: '1.4', title: 'שלב 4: הרכבת הגלגל לציר מנוע ה-DC', partsNeeded: ['גלגל גומי 65 מ"מ'], instructions: ['יישר את חור ציר ה-D בגלגל עם ציר מנוע ה-DC והחלק בלחץ עדין.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_04.png` },
  { id: '1.5', title: 'שלב 5: הרכבת 4 הגלגלים המלאה', partsNeeded: ['4x גלגלים', '4x מנועי DC'], instructions: ['חזור על הפעולה עבור כל 4 הגלגלים עד להשלמת כל גלגלי ה-4WD.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_05.png` },
  { id: '1.6', title: 'שלב 6: התקנת לוח בקר ה-ESP32-Wrover-Dev', partsNeeded: ['לוח ESP32-Wrover-Dev'], instructions: ['הכנס בזהירות את לוח ה-ESP32 לתושבת ה-Shield. אזהרה: אל תהפוך את כיוון הלוח כדי למנוע שריפת הרכיב.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_06.png` },
  { id: '1.7', title: 'שלב 7: ערכת חלקי מנוע הסרוו (Servo Package)', partsNeeded: ['מנוע סרוו SG90', '3x זרועות רוקר', '2x ברגי M2*8', 'בורג M2*4'], instructions: ['זהה את חלקי מנוע הסרוו בערכה: מנוע סרוו, 3 זרועות רוקר, ברגי M2*8 ובורג M2*4.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_07.png` },
  { id: '1.8', title: 'שלב 8: חיבור Servo1 ל-Car Shield', partsNeeded: ['2x ברגי M2*16', '2x אומי M2'], instructions: ['חזק את מנוע סרוו 1 ללוח ה-Car Shield בעזרת שני ברגי M2*16 ואומי M2.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_08.png` },
  { id: '1.9', title: 'שלב 9: חיבור שני לוחות ה-Pan-Tilt האקריליים', partsNeeded: ['בורג M2*16', 'אום M2'], instructions: ['חזק את שני חלקי ה-Pan-Tilt האקריליים יחד בעזרת בורג M2*16 ואום M2.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_09.png` },
  { id: '1.10', title: 'שלב 10: חיבור תושבת ה-Pan-Tilt ל-Servo1 (איפוס 90°)', partsNeeded: ['2x ברגי M2.5*8', 'בורג M2*4'], instructions: ['כוון את הסרוו ל-90 מעלות, חזק את התושבת לזרוע הרוקר בברגי M2.5*8 והדק לציר בבורג M2*4.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_10.png` },
  { id: '1.11', title: 'שלב 11: חיבור Servo2 לתושבת Pan-Tilt', partsNeeded: ['2x ברגי M2*16', '2x אומי M2'], instructions: ['חזק את מנוע סרוו 2 לתושבת ה-Pan-Tilt בעזרת שני ברגי M2*16 ואומי M2.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_11.png` },
  { id: '1.12', title: 'שלב 12: חיווט כבלי מנועי הסרוו ללוח', partsNeeded: ['כבלי Servo1 ו-Servo2'], instructions: ['חבר את כבלי Servo1 ו-Servo2 לפורטים המיועדים ב-Shield.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_12.png` },
  { id: '1.13', title: 'שלב 13: חלקי האקריליק של תושבת מטריצת ה-LED', partsNeeded: ['לוחות אקריליק לראש הרובוט'], instructions: ['זהה את לוחות האקריליק עבור הרכבת ראש הרובוט ומטריצת ה-LED.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_13.png` },
  { id: '1.14', title: 'שלב 14: פירוק רכיב המצלמה מ-ESP32', partsNeeded: ['בקר ESP32 CAM'], instructions: ['שחרר בעדינות את מנעול ה-FPC Connector והסר את המצלמה בזהירות.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_14.png` },
  { id: '1.15', title: 'שלב 15: חיבור תושבת המצלמה ל-Pan-Tilt', partsNeeded: ['4x ברגי M1.4*6'], instructions: ['חבר את תושבת המצלמה לתושבת ה-Pan-Tilt בעזרת ארבעה ברגי M1.4*6.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_15.png` },
  { id: '1.16', title: 'שלב 16: חיבור מטריצת ה-LED ל-Pan-Tilt', partsNeeded: ['4x ברגי M1.4*6', 'מטריצת LED'], instructions: ['חזק את מטריצת ה-LED לתושבת בעזרת ארבעה ברגי M1.4*6.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_16.png` },
  { id: '1.17', title: 'שלב 17: הוספת אומי M3 כספייסרים בין הלוחות', partsNeeded: ['2x אומי M3'], instructions: ['הנח שני אומי M3 כספייסרים בין שני לוחות האקריליק.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_17.png` },
  { id: '1.18', title: 'שלב 18: חיזוק הלוחות האקריליים (חלק 1)', partsNeeded: ['בורג M2*16', 'אום M2'], instructions: ['חזק את שני לוחות האקריליק בעזרת בורג M2*16 ואום M2.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_18.png` },
  { id: '1.19', title: 'שלב 19: חיזוק הלוחות האקריליים (חלק 2)', partsNeeded: ['בורג M2*16', 'אום M2'], instructions: ['חזק את החלק האקרילי השני בעזרת בורג M2*16 ואום M2.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_19.png` },
  { id: '1.20', title: 'שלב 20: חיבור זרוע הרוקר ללוח האקרילי', partsNeeded: ['2x ברגי M2.5*8'], instructions: ['חבר את זרוע הרוקר ללוח האקרילי בעזרת שני ברגי M2.5*8.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_20.png` },
  { id: '1.21', title: 'שלב 21: חיבור תושבת האולטרסוני ל-Servo2 (איפוס 90°)', partsNeeded: ['בורג M2*4'], instructions: ['כוון את סרוו 2 ל-90 מעלות והדק את התושבת לציר בבורג M2*4.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_21.png` },
  { id: '1.22', title: 'שלב 22: סיום הרכבת מכלול ה-Pan-Tilt והמטריצה', partsNeeded: ['מכלול מורכב ראש הרובוט'], instructions: ['בצע בדיקה ויזואלית מלאה של מכלול ה-Pan-Tilt המורכב.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_22.png` },
  { id: '1.23', title: 'שלב 23: התקנת מודול חיישני מעקב הקו בתחתית השלדה', partsNeeded: ['2x עמודי ספייסר M3*28', '4x ברגי M3*6'], instructions: ['חזק 2 עמודי ספייסר M3*28 לתחתית השלדה בברגי M3*6, וחבר אליהם את מודול מעקב הקו.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_23.png` },
  { id: '1.24', title: 'שלב 24: חיווט כבל מודול מעקב הקו', partsNeeded: ['כבל שטוח 5-Pin'], instructions: ['חבר את הכבל השטוח בין מודול מעקב הקו לפורט ה-TRACKING בלוח.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_24.png` },
  { id: '1.25', title: 'שלב 25: הרמת נעילת תופסן כבל ה-FPC', partsNeeded: ['מחבר FPC Connector ב-ESP32'], instructions: ['הרם בזהירות את נעילת התופסן במחבר ה-FPC.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_25.png` },
  { id: '1.26', title: 'שלב 26: הכנסת כבל ה-FPC (הצד הכחול כלפי מעלה)', partsNeeded: ['כבל FPC של המצלמה'], instructions: ['ודא שהצד הכחול פונה כלפי מעלה וצד המגעים המוזהבים כלפי מטה.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_26.png` },
  { id: '1.27', title: 'שלב 27: העברת כבל ה-FPC דרך החריץ האקרילי', partsNeeded: ['לוח אקרילי עליון'], instructions: ['ודא כבל ה-FPC עובר בצורה חלקה דרך החריץ בלוח האקרילי.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_27.png` },
  { id: '1.28', title: 'שלב 28: חיווט כבל ה-4P של מטריצת ה-LED', partsNeeded: ['כבל 4P Jumper'], instructions: ['חבר את כבל ה-4P בין מטריצת ה-LED ללוח בהתאם לסימונים.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_28.png` },
  { id: '1.29', title: 'שלב 29: הכנסת ברגי M3*6 מתחתית ה-Shield', partsNeeded: ['4x ברגי M3*6'], instructions: ['הכנס ארבעה ברגי M3*6 כלפי מעלה מתחתית ה-Car Shield.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_29.png` },
  { id: '1.30', title: 'שלב 30: חיזוק 4 עמודי ספייסר M3*28 עליונים', partsNeeded: ['4x עמודי ספייסר M3*28'], instructions: ['הברג ארבעה עמודי ספייסר M3*28 על גבי ברגי ה-M3*6.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_30.png` },
  { id: '1.31', title: 'שלב 31: חיזוק הלוח האקרילי העליון לרובוט', partsNeeded: ['לוח אקרילי עליון', '4x ברגי M3*6'], instructions: ['יישר את הלוח האקרילי העליון מעל עמודי הספייסר והדק בעזרת ארבעה ברגי M3*6.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_31.png` },
  { id: '1.32', title: 'שלב 32: בדיקת איכות סופית והדלקת המפסק הראשי', partsNeeded: ['2x סוללות 18650'], instructions: ['הכנס 2 סוללות 18650 טעונות, הדלק את מפסק ה-Power ובדוק שנורת ה-LED הירוקה דולקת.'], imgUrl: `${FREENOVE_IMG_BASE}Chapter01_37.png` }
];

const OOP_CHAPTER_2_LESSONS = [
  {
    id: '2.1',
    title: 'שיעור 2.1: תכנון תנועה בעזרת 🤖 תוכנית רובוט ו-🏎️ סע',
    goal: 'גרור את הבלוק "🤖 תוכנית רובוט" והכנס לתוכו בלוקי "🏎️ סע", "⏱️ המתן" ו-"🛑 עצור" לבניית קוד הנהיגה הראשוני.',
    neededBlocks: ['🤖 תוכנית רובוט', '🏎️ סע (קדימה)', '⏱️ המתן', '🏎️ סע (ימינה)', '🏎️ סע (אחורה)', '🛑 עצור'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid setup() {\n  bot.begin();\n  bot.moveForward(200);\n  delay(2000);\n  bot.turnRight(180);\n  delay(1000);\n  bot.moveBackward(150);\n  delay(1000);\n  bot.stop();\n}\n\nvoid loop() {}`
  },
  {
    id: '2.2',
    title: 'שיעור 2.2: כוונון וסריקת ראש בעזרת 📐 סובב ראש',
    goal: 'תכנת סריקה חלקה של ראש הרובוט ואיפוס מרכז הראש בעזרת הבלוק "📐 סובב ראש".',
    neededBlocks: ['🤖 תוכנית רובוט', '📐 סובב ראש (Pan: 45, Tilt: 90)', '⏱️ המתן', '📐 סובב ראש (Pan: 135, Tilt: 90)', '📐 סובב ראש (Pan: 90, Tilt: 90)'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid setup() {\n  bot.begin();\n  bot.moveHead(45, 90);  // צידוד 45°\n  delay(500);\n  bot.moveHead(135, 90); // צידוד 135°\n  delay(500);\n  bot.moveHead(90, 90);  // מרכוז\n}\n\nvoid loop() {}`
  },
  {
    id: '2.3',
    title: 'שיעור 2.3: הבעת רגשות ופרצופים בעזרת 👀 הבעת עיניים',
    goal: 'החלף בין הבעות עיניים במטריצת ה-LED בעזרת הבלוק "👀 הבעת עיניים".',
    neededBlocks: ['🤖 תוכנית רובוט', '👀 הבעת עיניים (שמח 😊)', '⏱️ המתן', '👀 הבעת עיניים (כועס 😡)', '👀 הבעת עיניים (רגיל 😐)'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid setup() {\n  bot.begin();\n  bot.setEyes(EYE_HAPPY);\n  delay(1500);\n  bot.setEyes(EYE_ANGRY);\n  delay(1500);\n  bot.setEyes(EYE_NORMAL);\n}\n\nvoid loop() {}`
  },
  {
    id: '2.4',
    title: 'שיעור 2.4: עיצוב צבעי תאורה בעזרת 🎨 תאורת RGB',
    goal: 'תכנת שינוי צבעי 12 נוריות ה-RGB של הרובוט בעזרת הבלוק "🎨 תאורת RGB".',
    neededBlocks: ['🤖 תוכנית רובוט', '🎨 תאורת RGB (אדום)', '⏱️ המתן', '🎨 תאורת RGB (ירוק)', '🎨 תאורת RGB (כחול)'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid setup() {\n  bot.begin();\n  bot.setLeds(255, 0, 0);\n  delay(1000);\n  bot.setLeds(0, 255, 0);\n  delay(1000);\n  bot.setLeds(0, 0, 255);\n}\n\nvoid loop() {}`
  },
  {
    id: '2.5',
    title: 'שיעור 2.5: זהירות מכשולים בעזרת 📏 מרחק (ס"מ)',
    goal: 'השתמש בבלוק "📏 מרחק (ס"מ)" בתוך תנאי אם/אחרת כדי לעצור ולצפצף מול מכשול קרוב.',
    neededBlocks: ['🤖 תוכנית רובוט', '🔀 אם... אחרת', '📏 מרחק (ס"מ)', '🔔 צפצוף', '🛑 עצור', '🏎️ סע'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid loop() {\n  float dist = bot.getDistance();\n  if (dist < 15.0) {\n    bot.beep(200);\n    bot.stop();\n  } else {\n    bot.moveForward(150);\n  }\n}`
  },
  {
    id: '2.6',
    title: 'שיעור 2.6: תאורת לילה אוטומטית בעזרת 🌙 חשוך?',
    goal: 'קרא את חיישן האור בעזרת הבלוק "🌙 חשוך?" והדלק תאורת RGB לבנה בחשיכה.',
    neededBlocks: ['🤖 תוכנית רובוט', '🔀 אם... אחרת', '🌙 חשוך?', '🎨 תאורת RGB (לבן)', '🎨 תאורת RGB (כבוי)'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid loop() {\n  if (bot.isDark()) {\n    bot.setLeds(255, 255, 255);\n  } else {\n    bot.setLeds(0, 0, 0);\n  }\n}`
  },
  {
    id: '2.7',
    title: 'שיעור 2.7: מעקב קו אוטונומי בעזרת 🛤️ חיישן קו',
    goal: 'תכנת ניווט אוטונומי על מסלול קו שחור בעזרת הבלוק "🛤️ חיישן קו".',
    neededBlocks: ['🤖 תוכנית רובוט', '🔀 אם... אחרת', '🛤️ חיישן קו (מרכז)', '🏎️ סע (קדימה)', '🏎️ סע (שמאל)', '🏎️ סע (ימין)'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid loop() {\n  if (bot.checkLine(0, 1, 0)) {\n    bot.moveForward(150);\n  } else if (bot.checkLine(1, 0, 0)) {\n    bot.turnLeft(150);\n  }\n}`
  },
  {
    id: '2.8',
    title: 'שיעור 2.8: נהיגה בשלט רחוק IR בעזרת 📶 קליטת שלט',
    goal: 'קלוט לחיצות משלט ה-IR והפעל פקודות נהיגה בהתאם.',
    neededBlocks: ['🤖 תוכנית רובוט', '🔀 אם...', '🏎️ סע', '🛑 עצור'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid loop() {\n  String cmd = bot.getIRCommand();\n  if (cmd == "FF02FD") {\n    bot.moveForward(200);\n  } else if (cmd == "FFA857") {\n    bot.stop();\n  }\n}`
  },
  {
    id: '2.9',
    title: 'שיעור 2.9: שידור וידאו בלייב בעזרת 🎥 מצלמת Wi-Fi',
    goal: 'הפעל שרת מצלמת Wi-Fi בלייב בעזרת הבלוק "🎥 מצלמת Wi-Fi".',
    neededBlocks: ['🤖 תוכנית רובוט', '🎥 מצלמת Wi-Fi (רשת: SuperBot_WiFi)'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid setup() {\n  bot.begin();\n  bot.beginCamera(WIFI_AP, "SuperBot_WiFi", "12345678");\n}\n\nvoid loop() {}`
  },
  {
    id: '2.10',
    title: 'שיעור 2.10: הפעלה מלאה של כל מודולי הרובוט (אתגר הסיום)',
    goal: 'פרויקט סיכום פרק 2: הפעלת כל פונקציות הרובוט במקביל (תנועה, ראש, עיניים, RGB, אולטרסוני, IR ומצלמה)!',
    neededBlocks: ['🤖 תוכנית רובוט', '👀 הבעת עיניים', '🎨 תאורת RGB', '🔔 צפצוף', '🎥 מצלמת Wi-Fi', '📏 מרחק (ס"מ)', '🏎️ סע', '🛑 עצור'],
    codeTemplate: `// 🎯 קוד C++ המיועד להיווצר:\nvoid setup() {\n  bot.begin();\n  bot.setEyes(EYE_HAPPY);\n  bot.setLeds(0, 255, 100);\n  bot.beep(100);\n  bot.beginCamera(WIFI_AP, "SuperBot_Pro", "12345678");\n}\n\nvoid loop() {\n  if (bot.getDistance() < 20) {\n    bot.setEyes(EYE_ANGRY);\n    bot.beep(200);\n    bot.turnRight(200);\n  }\n}`
  }
];

const FIREBASE_CHAPTER_4_LESSONS = [
  {
    id: '4.0',
    title: 'מדריך מיוחד: פתיחת פרויקט וחיבור Firebase Realtime Database (צעד-אחר-צעד)',
    goal: 'למד כיצד להקים פרויקט ענן חינמי ב-Google Firebase, להגדיר בסיס נתונים בזמן אמת (Realtime Database), ולהפיק את מפתחות התקשורת הנדרשים ל-ESP32.',
    setupGuide: [
      { step: '1', title: 'כניסה ל-Firebase Console', desc: 'היכנס לאתר console.firebase.google.com והתחבר בעזרת חשבון ה-Google שלך.' },
      { step: '2', title: 'יצירת פרויקט חדש (Create a Project)', desc: 'לחץ על "Add project" / "צור פרויקט", הזן שם לפרויקט (למשל edorobot-iot), אשר את התנאים ולחץ "Create Project".' },
      { step: '3', title: 'הקמת בסיס נתונים בזמן אמת (Realtime Database)', desc: 'בתפריט הצדדי לחץ על Build -> Realtime Database, ולאחר מכן לחץ על "Create Database". בחר את מיקום השרת הקרוב ביותר.' },
      { step: '4', title: 'הגדרת הרשאות גישה (Security Rules)', desc: 'במסך בחירת ההרשאות בחר ב-"Start in test mode" (מצב ניסיון) כך שהרשאות הקריאה והכתיבה יוגדרו כציבוריות (.read: true, .write: true).' },
      { step: '5', title: 'העתקת ה-URL ומפתח האבטחה (Database URL & Auth Secret)', desc: 'העתק את כתובת ה-URL של בסיס הנתונים (למשל edorobot-e9cb1-default-rtdb.firebaseio.com), ועבור להגדרות הפרויקט (Project Settings -> Service Accounts -> Database secrets) כדי להעתיק את Secret Key.' }
    ]
  },
  {
    id: '4.1',
    title: 'שיעור 4.1: התחברות ל-WiFi וחיבור ראשוני ל-Firebase Realtime Database',
    goal: 'חבר את בקר ה-ESP32 לרשת ה-WiFi והגדר את החיבור הראשוני ל-Firebase בעזרת הבלוק "🔥 התחבר ל-WiFi & Firebase".',
    neededBlocks: ['🤖 תוכנית רובוט', '🔥 התחבר ל-WiFi & Firebase (SSID, Pass, URL, Auth)', '👀 הבעת עיניים', '🔔 צפצוף'],
    codeTemplate: `#include "SuperBot.h"\n#include <WiFi.h>\n#include <FirebaseESP32.h>\n\n#define WIFI_SSID "bamaale-teacher"\n#define WIFI_PASSWORD "OrtMala2025"\n#define FIREBASE_URL "edorobot-e9cb1-default-rtdb.firebaseio.com"\n#define FIREBASE_AUTH "8zaipFwVBlCAPF5Cz5WlK0bw5IyDAgc3IrKjpsEc"\n\nSuperBot bot;\nFirebaseData firebaseData;\nFirebaseConfig config;\nFirebaseAuth auth;\n\nvoid setup() {\n  Serial.begin(115200);\n  bot.begin();\n  bot.setEyes(EYE_HAPPY);\n  bot.beep(200);\n\n  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n  }\n  config.database_url = FIREBASE_URL;\n  if (strlen(FIREBASE_AUTH) > 0) {\n    config.signer.tokens.legacy_token = FIREBASE_AUTH;\n  }\n  Firebase.begin(&config, &auth);\n  Firebase.reconnectWiFi(true);\n}\n\nvoid loop() {}`
  },
  {
    id: '4.2',
    title: 'שיעור 4.2: קליטת פקודות נהיגה בזמן אמת מהענן (FORWARD, BACK, LEFT, RIGHT, STOP)',
    goal: 'הפעל פונקציית טיפול בפקודות handleFirebaseCommand(cmd) וקרא פקודות מחרוזת מ-Firebase בלולאה הראשית.',
    neededBlocks: ['🤖 תוכנית רובוט', '📡 קליטת פקודה מ-Firebase (/move/test/int)', '🏎️ סע', '🛑 עצור'],
    codeTemplate: `void loop() {\n  if (Firebase.getString(firebaseData, "/move/test/int")) {\n    if (firebaseData.dataType() == "string") {\n      String fbCommand = firebaseData.stringData();\n      handleFirebaseCommand(fbCommand);\n    }\n  }\n}\n\nvoid handleFirebaseCommand(String cmd) {\n  if (cmd == "1" || cmd == "FORWARD") {\n    robot.moveForward(200);\n  } else if (cmd == "2" || cmd == "BACK") {\n    robot.moveBackward(200);\n  } else if (cmd == "3" || cmd == "LEFT") {\n    robot.turnLeft(200);\n  } else if (cmd == "4" || cmd == "RIGHT") {\n    robot.turnRight(200);\n  } else if (cmd == "0" || cmd == "STOP") {\n    robot.stop();\n  }\n}`
  },
  {
    id: '4.3',
    title: 'שיעור 4.3: שליטה מרחוק על תאורת RGB והבעות עיניים בענן',
    goal: 'תכנת שינוי צבעי תאורה והבעת עיניים ברובוט לפי פקודות המתקבלות מ-Firebase.',
    neededBlocks: ['🤖 תוכנית רובוט', '📡 קליטת פקודה מ-Firebase', '👀 הבעת עיניים', '🎨 תאורת RGB'],
    codeTemplate: `void handleFirebaseCommand(String cmd) {\n  if (cmd == "HAPPY") {\n    robot.setEyes(EYE_HAPPY);\n    robot.setLeds(0, 255, 0);\n  } else if (cmd == "ANGRY") {\n    robot.setEyes(EYE_ANGRY);\n    robot.setLeds(255, 0, 0);\n  }\n}`
  },
  {
    id: '4.4',
    title: 'שיעור 4.4: שידור נתוני חיישן אולטרסוני ל-Firebase Database בזמן אמת',
    goal: 'מדוד את המרחק ממכשולים בעזרת bot.getDistance() ושלח את הנתון ל-Firebase בנתיב /robot/distance.',
    neededBlocks: ['🤖 תוכנית רובוט', '📏 מרחק (ס"מ)', '📤 שלח נתון ל-Firebase (/robot/distance)', '⏱️ המתן'],
    codeTemplate: `void loop() {\n  float distance = robot.getDistance();\n  Firebase.setFloat(firebaseData, "/robot/distance", distance);\n  delay(1000);\n}`
  },
  {
    id: '4.5',
    title: 'שיעור 4.5: אתגר סיום: רובוט אוטונומי נשלט ענן בחיבור מלא ל-Firebase',
    goal: 'פרויקט סיום פרק 4: חיבור מלא של כל רכיבי הרובוט (נהיגה, חיישנים, עיניים, RGB וזמזם) לשליטה ודיווח מלא בענן Firebase!',
    neededBlocks: ['🤖 תוכנית רובוט', '🔥 התחבר ל-WiFi & Firebase', '📡 קליטת פקודה מ-Firebase', '📤 שלח נתון ל-Firebase', '📏 מרחק (ס"מ)', '🏎️ סע', '🛑 עצור'],
    codeTemplate: `// 🎯 קוד C++ מלא ומקיף לכל פונקציות הרובוט ב-Firebase\nvoid setup() {\n  robot.begin();\n  connectFirebase();\n}\n\nvoid loop() {\n  listenFirebaseCommands();\n  reportSensorData();\n}`
  }
];

const CHAPTER_BRIEFINGS = {
  ch1: {
    id: 'intro_ch1',
    chapterId: 'ch1',
    isBriefing: true,
    title: '🛠️ תדריך משימה: הרכבה מכאנית וזיווד מפורט',
    subtitle: '32 שלבי CAD מקוריים לבניית רובוט מכונית 4WD Pro מושלם',
    badge: 'פרק 1 • חומרה ומכאניקה',
    badgeColor: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
    overview: 'ברוכים הבאים לשלב הבנייה המעשית! בפרק זה תרכיבו את כל השלדה הפיזית, מנועי ה-DC, גלגלי הגומי, מנועי הסרוו לראש ה-Pan-Tilt, מטריצת ה-LED, מודול מעקב הקו ולוח הבקר ESP32.',
    kit: [
      'שלדת אלומיניום תחתונה ולוח Car Shield',
      '4 מנועי DC צהובים ו-4 גלגלי גומי שטח',
      'לוח בקר ESP32-Wrover-Dev עם מצלמה',
      '2 מנועי סרוו SG90 למכלול Pan-Tilt',
      'מטריצת 64 נוריות LED ומודול מעקב קו',
      'ערכת ברגים, אומים, ספייסרים M2/M3 ומברג'
    ],
    objectives: [
      'הרכבת תושבות המנועים ומערכת ההנעה 4WD',
      'חיווט מנועי ה-DC לטרמינלי הכוח ב-Shield',
      'התקנת בקר ה-ESP32 לתושבת המרכזית',
      'בניית ראש ה-Pan-Tilt הדו-צירי ומצלמת ה-Wi-Fi',
      'התקנת מודול מעקב הקו ומטריצת ה-LED',
      'בדיקת מתח והדלקה ראשונית של המערכת'
    ],
    timeEst: '60-90 דקות',
    skills: ['מכאניקה עדינה', 'קריאת שרטוטי CAD', 'חיווט אלקטרוניקה', 'בקרת איכות'],
    proTip: 'סדרו את הברגים והאומים בקעריות קטנות לפי מידות (M2 מול M3). הימנעו מהידוק יתר כדי לא לסדוק את לוחות האקריליק!',
    firstLessonId: '1.0'
  },
  ch2: {
    id: 'intro_ch2',
    chapterId: 'ch2',
    isBriefing: true,
    title: '💻 תדריך משימה: תכנות מונחה עצמים (OOP) וספריית הרובוט',
    subtitle: '10 שיעורי תכנות אינטראקטיביים עם סביבת בלוקים וקוד C++ מלא',
    badge: 'פרק 2 • תוכנה ובקרה',
    badgeColor: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15))',
    overview: 'בפרק זה נלמד לתכנת את הרובוט ב-C++ מונחה עצמים ובבלוקים חכמים. נשלוט על המנועים, הראש הממונע, הבעות העיניים, נורות ה-RGB וחיישני המרחק והאור.',
    kit: [
      'רובוט 4WD Pro מורכב ופועל',
      'כבל תקשורת Micro-USB למחשב',
      '2 סוללות 18650 טעונות במלואן'
    ],
    objectives: [
      'שליטה בתנועת הרובוט: נסיעה קדימה, אחורה וסיבובים',
      'כיוונון זוויות וסריקת מרחב בעזרת ראש ה-Pan-Tilt',
      'הצגת הבעות פנים ואמוג\'ים במטריצת ה-LED',
      'שליטה על 12 נורות RGB בתחתית הרובוט',
      'מדידת מרחק ממכשולים בעזרת חיישן אולטרסוני',
      'זיהוי רמת תאורה בחדר בעזרת חיישן אור LDR'
    ],
    timeEst: '45-60 דקות',
    skills: ['תכנות מונחה עצמים', 'C++ לארדואינו', 'בקרת תנועה', 'אלגוריתמיקה בסיסית'],
    proTip: 'סביבת העבודה נפתחת בחלון נפרד לנוחות מרבית לצד חוברת ההדרכה. מומלץ להציג את שני החלונות זה לצד זה!',
    firstLessonId: '2.1'
  },
  ch3: {
    id: 'intro_ch3',
    chapterId: 'ch3',
    isBriefing: true,
    title: '🚀 תדריך משימה: רובוטיקה אוטונומית ואפליקציות מתקדמות',
    subtitle: '10 פרויקטים מתקדמים: אלגוריתמי ניווט, שלט רחוק, ושידור Wi-Fi',
    badge: 'פרק 3 • רובוטיקה אוטונומית',
    badgeColor: '#ec4899',
    bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15))',
    overview: 'שילוב כל מודולי החומרה והתוכנה לבניית רובוט אוטונומי חכם: נסיעה אוטונומית ללא התנגשות, מעקב קו שחור מהיר, נהיגה בשלט אינפרא-אדום, ושידור וידאו חי דרך Wi-Fi!',
    kit: [
      'רובוט 4WD Pro מוכן לפעולה',
      'שלט רחוק IR כלול בערכה',
      'משטח / מסלול קו שחור',
      'סמארטפון או מחשב עם חיבור Wi-Fi'
    ],
    objectives: [
      'בניית אלגוריתם עקיפת מכשולים אוטונומי בזמן אמת',
      'פיתוח אלגוריתם מעקב קו שחור מהיר',
      'תכנות קליטה ופענוח פקודות משלט רחוק IR',
      'הקמת שרת Wi-Fi AP עצמאי בבקר ה-ESP32',
      'הזרמת וידאו חי בזמן אמת לדפדפן האינטרנט'
    ],
    timeEst: '60-90 דקות',
    skills: ['אלגוריתמי ניווט', 'תקשורת Wi-Fi', 'הזרמת וידאו בזמן אמת', 'מערכות משוב'],
    proTip: 'בניסוי מעקב קו שחור, ודאו כי גובה חיישן הקו מהקרקע הוא בין 1 ל-2 ס"מ לקבלת דיוק מרבי.',
    firstLessonId: '3.1'
  },
  ch4: {
    id: 'intro_ch4',
    chapterId: 'ch4',
    isBriefing: true,
    title: '🔥 תדריך משימה: תקשורת ענן ו-Firebase Realtime IoT',
    subtitle: '5 שיעורי ענן + מדריך פתיחת פרויקט וחיבור ESP32 בזמן אמת',
    badge: 'פרק 4 • Cloud & IoT',
    badgeColor: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
    overview: 'חיבור הרובוט לענן האינטרנט! נלמד להקים בסיס נתונים ב-Google Firebase, לשלוט ברובוט מכל מקום בעולם ולקבל נתוני טלמטריה וחיישנים בזמן אמת ישירות לבסיס הנתונים.',
    kit: [
      'רובוט 4WD Pro פועל',
      'חשבון Google פעיל (ל-Firebase Console)',
      'רשת אינטרנט ביתית Wi-Fi 2.4GHz'
    ],
    objectives: [
      'הקמת פרויקט חינמי ב-Firebase Console והגדרת Realtime DB',
      'חיבור מאובטח של ה-ESP32 לרשת ה-WiFi ולענן Firebase',
      'קליטת פקודות נהיגה ותאורה בזמן אמת מהענן',
      'שידור נתוני חיישן אולטרסוני לענן בעת תנועה',
      'פרויקט גמר: רובוט אוטונומי נשלט ומדווח ענן מלא'
    ],
    timeEst: '45-60 דקות',
    skills: ['IoT & Cloud', 'Google Firebase', 'תקשורת JSON / REST', 'טלמטריה בזמן אמת'],
    proTip: 'וודאו כי הגדרתם את כללי האבטחה (Rules) ב-Firebase למצב פתוח לקריאה וכתיבה במצב ניסיון (.read: true, .write: true).',
    firstLessonId: '4.0'
  }
};

const COURSE_CHAPTERS = [
  { id: 'ch1', title: '🛠️ פרק 1: הרכבה מכאנית וזיווד מפורט (32 שלבי CAD)', description: 'מדריך הרכבת CAD מקורי מלא 32 שלבים מתוך האתר הרשמי', lessons: ASSEMBLY_STEPS_ALL },
  {
    id: 'ch2',
    title: '💻 פרק 2: תכנות מונחה עצמים (OOP) ושימוש בספריית הרובוט (10 שיעורים)',
    description: 'משימות תכנות ב-C++ מונחה עצמים (Object-Oriented Programming) בעזרת הבלוקים הייעודיים לרובוט',
    lessons: OOP_CHAPTER_2_LESSONS
  },
  {
    id: 'ch3',
    title: '🚀 פרק 3: פרויקטים אוטונומיים ואפליקציות (10 שיעורים)',
    description: 'בניית פרויקטים רובוטיים מתקדמים ואפליקציות Wi-Fi',
    lessons: [
      { id: '3.1', title: 'שיעור 3.1: רובוט אוטונומי חומק ממכשולים בחלל', goal: 'אלגוריתם עקיפת מכשולים אוטונומי מלא.' },
      { id: '3.2', title: 'שיעור 3.2: רובוט עוקב אור (Light Tracing Car)', goal: 'ניווט לעבר מקור אור חזק.' },
      { id: '3.3', title: 'שיעור 3.3: רובוט אוטונומי עוקב קו שחור', goal: 'אלגוריתם PID עוקב קו מהיר.' },
      { id: '3.4', title: 'שיעור 3.4: מכונית שלט רחוק אינפרא-אדום', goal: 'שליטה מלאה בנהיגה דרך שלט IR.' },
      { id: '3.5', title: 'שיעור 3.5: מכונית מרובת מצבים (Multi-Mode Smart Car)', goal: 'מעבר בין מצבים בלחיצת כפתור בשלט.' },
      { id: '3.6', title: 'שיעור 3.6: הגדרת נקודת גישה Wi-Fi (AP Mode)', goal: 'הפעלת רשת Wi-Fi עצמאית ב-ESP32.' },
      { id: '3.7', title: 'שיעור 3.7: שרת אינטרנט לבקרת נהיגה (ESP32 Web Server)', goal: 'דף אינטרנט פנימי לשליטה ברובוט.' },
      { id: '3.8', title: 'שיעור 3.8: שידור וידאו בזמן אמת ממצלמת ESP32-CAM', goal: 'שידור וידאו בלייב לדפדפן.' },
      { id: '3.9', title: 'שיעור 3.9: אפליקציית שלט רחוק ב-AppInventor', goal: 'אפליקציית Android/iOS מותאמת אישית.' },
      { id: '3.10', title: 'שיעור 3.10: פרויקט סיום: רובוט מתקדם רב-משימתי', goal: 'שילוב כל היכולות לפרויקט גמר יוקרתי!' }
    ]
  },
  {
    id: 'ch4',
    title: '🔥 פרק 4: תקשורת ענן ו-Firebase IoT (5 שיעורים + מדריך פתיחת פרויקט)',
    description: 'חיבור בקר ESP32 לבסיס נתונים בענן ב-Firebase Realtime Database לשליטה ודיווח בזמן אמת',
    lessons: FIREBASE_CHAPTER_4_LESSONS
  }
];

function FreenoveCar() {
  const navigate = useNavigate();
  const [selectedLessonId, setSelectedLessonId] = useState('step_0.0');
  const [completedLessons, setCompletedLessons] = useState({});

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/tracks');
    }
  };

  const handleHomeClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const isTeacher = !!sessionStorage.getItem('smartstart_teacher_user');
    if (isTeacher) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/tracks');
      }
    } else {
      setSelectedLessonId('step_0.0');
    }
  };

  // Lightbox, AI & Flashing Modal States
  const [zoomImageSrc, setZoomImageSrc] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showFlashingModal, setShowFlashingModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [flashingMode, setFlashingMode] = useState('flash');

  // Workspace Controls State
  const [selectedBoard, setSelectedBoard] = useState('esp32');
  const [comPort, setComPort] = useState('COM3');
  const [filename, setFilename] = useState('superbot_car.ino');
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  // MULTI-FILE CODE EDITOR TABS STATE
  const [activeFileTab, setActiveFileTab] = useState('main'); // 'main', 'header', 'cpp'
  const [headerCode, setHeaderCode] = useState(SUPERBOT_H_CODE);
  const [cppCode, setCppCode] = useState(SUPERBOT_CPP_CODE);

  // Toolbox config state
  const [toolboxConfig, setToolboxConfig] = useState(null);

  // Blockly & Monaco State
  const blocklyDivRef = useRef(null);
  const [workspace, setWorkspace] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');

  // Save Code State & Notification
  const [isCodeSaved, setIsCodeSaved] = useState(false);
  const [saveNotification, setSaveNotification] = useState('');
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [showSavedProjectModal, setShowSavedProjectModal] = useState(false);
  const [savedProjectModalTab, setSavedProjectModalTab] = useState('save');
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  // 🔑 Access & Subscription Gate
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedLockedLesson, setSelectedLockedLesson] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(() => isTrackUnlocked('car'));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkedParts, setCheckedParts] = useState({});

  const togglePartCheck = (lessonId, partIdx) => {
    const k = `${lessonId}_${partIdx}`;
    setCheckedParts(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const isLessonFree = (lessonId) => {
    return lessonId === 'welcome' || lessonId === 'step_0.0' || lessonId.startsWith('intro_') || lessonId === '1.0' || lessonId === '1.1';
  };

  const handleLessonClick = (lesson) => {
    if (!isUnlocked && !isLessonFree(lesson.id)) {
      setSelectedLockedLesson(lesson);
      setShowSubscriptionModal(true);
      return;
    }
    setSelectedLessonId(lesson.id);
    setIsSidebarOpen(false);
  };

  const handleLoadPersonalProject = ({ blockXml, code: loadedCode, projectName: loadedProjName }) => {
    if (workspace && blockXml) {
      try {
        workspace.clear();
        const dom = Blockly.utils.xml.textToDom(blockXml);
        Blockly.Xml.domToWorkspace(dom, workspace);
      } catch (e) {
        console.error('Error loading workspace from XML:', e);
      }
    }
    if (loadedCode) {
      setGeneratedCode(loadedCode);
    }
    if (loadedProjName) {
      setFilename(loadedProjName.endsWith('.ino') ? loadedProjName : `${loadedProjName}.ino`);
    }
    setSaveNotification('🎉 הפרויקט נטען בהצלחה ללוח העבודה!');
    setTimeout(() => setSaveNotification(''), 4000);
  };

  const handleSaveCode = () => {
    if (workspace) {
      const freshCode = generateCodeForWorkspace(workspace);
      setGeneratedCode(freshCode);
      try {
        localStorage.setItem('superbot_saved_code', freshCode);
      } catch (e) {}
      setIsCodeSaved(true);
      setSaveNotification('✅ הקוד נשמר בהצלחה! כעת ניתן לצרוב.');
      setTimeout(() => setSaveNotification(''), 4000);
    }
  };

  // Check if opened as standalone workspace popup window
  const isStandalone = new URLSearchParams(window.location.search).get('standalone') === 'true';

  // Active Lesson or Chapter Mission Briefing lookup
  let currentLesson = null;
  let currentChapter = null;
  let currentBriefing = null;

  if (selectedLessonId.startsWith('intro_')) {
    const chKey = selectedLessonId.replace('intro_', '');
    currentBriefing = CHAPTER_BRIEFINGS[chKey] || CHAPTER_BRIEFINGS['ch1'];
    currentChapter = COURSE_CHAPTERS.find(c => c.id === chKey) || COURSE_CHAPTERS[0];
  } else {
    COURSE_CHAPTERS.forEach(ch => {
      ch.lessons.forEach(l => {
        if (l.id === selectedLessonId) {
          currentLesson = l;
          currentChapter = ch;
        }
      });
    });

    if (!currentLesson) {
      currentLesson = ASSEMBLY_STEPS_ALL[0];
      currentChapter = COURSE_CHAPTERS[0];
    }
  }

  // Linear sequence of all navigable pages (Chapter Briefings + Lessons)
  const ALL_SEQUENCE_ITEMS = useMemo(() => {
    const seq = [];
    COURSE_CHAPTERS.forEach(ch => {
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
  COURSE_CHAPTERS.forEach(ch => {
    totalLessonsCount += ch.lessons.filter(l => !l.isWelcomePage).length;
  });

  const chapterLessons = currentChapter ? currentChapter.lessons.filter(l => !l.isWelcomePage) : [];
  const currentStepIndex = currentLesson ? chapterLessons.findIndex(l => l.id === currentLesson.id) : -1;

  // Load clean & focused robot toolbox configuration
  const loadToolboxConfiguration = () => {
    registerAllBlocks();
    registerFreenoveCarBasicBlocks();

    const robotToolbox = {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: '🤖 רובוט',
          colour: '#4f46e5',
          contents: [
            { kind: 'block', type: 'robot_block_globals' },
            { kind: 'block', type: 'robot_block_setup' },
            { kind: 'block', type: 'robot_block_loop' },
            { kind: 'block', type: 'robot_block_bottom' },
            { kind: 'block', type: 'firebase_wifi_defines' },
            { kind: 'block', type: 'superbot_begin' },
            { kind: 'block', type: 'superbot_move' },
            { kind: 'block', type: 'superbot_stop' },
            { kind: 'block', type: 'superbot_head' },
            { kind: 'block', type: 'superbot_eyes' },
            { kind: 'block', type: 'superbot_leds' },
            { kind: 'block', type: 'superbot_get_distance' },
            { kind: 'block', type: 'superbot_is_dark' },
            { kind: 'block', type: 'superbot_camera_begin' },
            { kind: 'block', type: 'superbot_beep' },
            { kind: 'block', type: 'freenove_motor_drive' },
            { kind: 'block', type: 'freenove_servo_angle' },
            { kind: 'block', type: 'freenove_ultrasonic_distance' },
            { kind: 'block', type: 'freenove_line_sensor' },
            { kind: 'block', type: 'freenove_delay' },
            { kind: 'block', type: 'superbot_shape_dance' },
            { kind: 'block', type: 'superbot_grand_finale' },
            { kind: 'block', type: 'superbot_line_tracking' },
            { kind: 'block', type: 'superbot_handle_firebase' },
            { kind: 'block', type: 'superbot_handle_remote' }
          ]
        },
        {
          kind: 'category',
          name: '🔥 Firebase & ענן',
          colour: '#ff6f00',
          contents: [
            { kind: 'block', type: 'firebase_connect_full' },
            { kind: 'block', type: 'firebase_read_command' },
            { kind: 'block', type: 'firebase_send_data' }
          ]
        },
        {
          kind: 'category',
          name: '🔀 לוגיקה ותנאים',
          colour: '#2563eb',
          contents: [
            { kind: 'block', type: 'controls_if' },
            { kind: 'block', type: 'logic_compare' },
            { kind: 'block', type: 'logic_operation' },
            { kind: 'block', type: 'logic_boolean' }
          ]
        },
        {
          kind: 'category',
          name: '🔁 לולאות',
          colour: '#10b981',
          contents: [
            { kind: 'block', type: 'controls_repeat_ext' },
            { kind: 'block', type: 'controls_whileUntil' },
            { kind: 'block', type: 'controls_for' }
          ]
        },
        {
          kind: 'category',
          name: '🔢 מתמטיקה',
          colour: '#f59e0b',
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
            { kind: 'block', type: 'text_join' }
          ]
        },
        {
          kind: 'category',
          name: '📌 משתנים',
          custom: 'VARIABLE',
          colour: '#a855f7'
        },
        {
          kind: 'category',
          name: '⚙️ פונקציות',
          custom: 'PROCEDURE',
          colour: '#6366f1'
        }
      ]
    };

    const dynamicProjectCats = getDynamicProjectCategories();
    dynamicProjectCats.forEach(cat => {
      robotToolbox.contents.push(cat);
    });

    setToolboxConfig(robotToolbox);
    if (workspace) {
      workspace.updateToolbox(robotToolbox);
    }
  };

  useEffect(() => {
    loadToolboxConfiguration();
  }, []);

  // Live C++ Generator (Using top blocks merged into rich C++ base template)
  const generateCodeForWorkspace = (ws) => {
    if (!ws) return SUPERBOT_INO_FULL_CODE;
    try {
      const rawBlockCode = javascriptGenerator.workspaceToCode(ws);
      if (!rawBlockCode || !rawBlockCode.trim()) return SUPERBOT_INO_FULL_CODE;
      return mergeBlocksWithBaseTemplate(rawBlockCode, SUPERBOT_INO_FULL_CODE);
    } catch (err) {
      console.error('Error generating live code:', err);
      return SUPERBOT_INO_FULL_CODE;
    }
  };

  // Initialize Blockly Workspace
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
          zoom: { controls: true, wheel: true, startScale: 1.0 },
          grid: { spacing: 20, length: 3, colour: '#cbd5e1', snap: true }
        });

        const updateLiveCode = () => {
          const code = generateCodeForWorkspace(ws);
          setGeneratedCode(code);
        };

        ws.addChangeListener(updateLiveCode);
        setWorkspace(ws);
      } catch (err) {
        console.error('Error initializing Blockly workspace:', err);
      }
    }
  }, [workspace, toolboxConfig]);

  useEffect(() => {
    if (workspace) {
      const timer = setTimeout(() => {
        try {
          Blockly.svgResize(workspace);
        } catch (e) {
          console.error(e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [workspace, isEditorVisible]);

  const handlePrevLesson = () => {
    if (currentSequenceIndex > 0) {
      setSelectedLessonId(ALL_SEQUENCE_ITEMS[currentSequenceIndex - 1].id);
    } else if (currentSequenceIndex === 0) {
      setSelectedLessonId('step_0.0');
    }
  };

  const handleCompleteLesson = () => {
    if (currentLesson && currentLesson.id) {
      setCompletedLessons(prev => ({ ...prev, [currentLesson.id]: true }));
    }
    if (currentSequenceIndex >= 0 && currentSequenceIndex < ALL_SEQUENCE_ITEMS.length - 1) {
      const nextItem = ALL_SEQUENCE_ITEMS[currentSequenceIndex + 1];
      setSelectedLessonId(nextItem.id);
    } else {
      alert('🏆 כל הכבוד! השלמת בהצלחה את כל שלבי ומשימות המסלול!');
    }
  };

  // Download all 3 project files (.ino, SuperBot.h, SuperBot.cpp)
  const handleDownloadCode = () => {
    const downloadSingle = (content, fname) => {
      const element = document.createElement("a");
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = fname;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    const mainName = filename || "superbot_car.ino";
    const mainContent = generatedCode || `#include "SuperBot.h"\n\nSuperBot bot;\n\nvoid setup() {\n  bot.begin();\n}\n\nvoid loop() {\n}`;
    
    downloadSingle(mainContent, mainName);
    setTimeout(() => downloadSingle(headerCode, "SuperBot.h"), 300);
    setTimeout(() => downloadSingle(cppCode, "SuperBot.cpp"), 600);
  };

  // Open Standalone Workspace Window ONLY
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
  const handleOpenStandaloneWorkspace = handleOpenWorkspaceInNewWindow;

  // 1. STANDALONE WORKSPACE POPUP VIEW ONLY (EXACT MATCH TO USER PICTURE)
  if (isStandalone) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', direction: 'rtl', overflow: 'hidden' }}>
        
        {/* TOP WORKSPACE TOOLBAR */}
        <div style={{ padding: '10px 18px', background: '#ffffff', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => { 
              handleSaveCode();
              setFlashingMode('flash'); 
              setShowFlashingModal(true); 
            }} className="builder-btn builder-btn-hero">
              🚀 צרוב ל-ESP32 / SuperBot
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
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#ffffff', borderColor: '#2563eb', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(37,99,235,0.35)' }}
            >
              📤 שלח קוד למורה
            </button>

            {/* 📁 DROPDOWN ACTIONS MENU */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="builder-btn"
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  color: '#1e293b',
                  fontWeight: '700',
                  padding: '7px 14px',
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
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '9px 12px',
                      textAlign: 'right',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%'
                    }}
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
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '9px 12px',
                      textAlign: 'right',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%'
                    }}
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
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '9px 12px',
                      textAlign: 'right',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%'
                    }}
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
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '9px 12px',
                      textAlign: 'right',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📄 הורד קוד (.ino)
                  </button>

                  <a
                    href="/SmartStart_Agent.bat"
                    download="SmartStart_Agent.bat"
                    onClick={() => setShowActionsDropdown(false)}
                    style={{
                      textDecoration: 'none',
                      padding: '9px 12px',
                      textAlign: 'right',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#047857',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ecfdf5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📥 מאיץ צריבה למחשב
                  </a>
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
              <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} className="builder-input-field" style={{ width: '130px', padding: '4px 8px' }} />
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
              <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="builder-select-box" style={{ padding: '4px 8px', fontWeight: 'bold', color: '#4338ca' }}>
                <option value="esp32">🔥 ESP32 Dev Module</option>
                <option value="uno">🤖 Arduino Uno</option>
              </select>
            </div>
          </div>
        </div>

        {/* SPLIT WORKSPACE CONTAINER */}
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
              id="freenoveBlocklyDiv"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
            />
          </div>

          {/* LIVE MONACO C++ MULTI-FILE CODE PANEL (RIGHT SIDE) */}
          {isEditorVisible && (
            <div 
              className="builder-side-code-panel"
              style={{ width: '450px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #cbd5e1', background: '#0f172a', color: '#ffffff', flexShrink: 0, direction: 'rtl' }}
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
                  📄 {filename || 'superbot_car.ino'}
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
                  📘 SuperBot.h
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
                  📙 SuperBot.cpp
                </button>
              </div>

              {/* MONACO EDITOR AREA */}
              <div style={{ flex: 1, direction: 'ltr' }}>
                <MonacoEditor
                  key={activeFileTab + '_' + (activeFileTab === 'main' ? generatedCode : activeFileTab === 'header' ? headerCode : cppCode)}
                  width="100%"
                  height="100%"
                  language="cpp"
                  theme="vs-dark"
                  value={
                    activeFileTab === 'main'
                      ? (generatedCode || SUPERBOT_INO_FULL_CODE)
                      : activeFileTab === 'header'
                      ? headerCode
                      : cppCode
                  }
                  onChange={(newValue) => {
                    if (activeFileTab === 'main') {
                      setGeneratedCode(newValue);
                    } else if (activeFileTab === 'header') {
                      setHeaderCode(newValue);
                    } else if (activeFileTab === 'cpp') {
                      setCppCode(newValue);
                    }
                  }}
                  options={{
                    selectOnLineNumbers: true,
                    readOnly: false,
                    wordWrap: 'on',
                    fontSize: 13,
                    minimap: { enabled: false }
                  }}
                />
              </div>
            </div>
          )}

          {/* 🚀 FLASHING & COMPILATION PROCESS MODAL (FOR STANDALONE WINDOW) */}
          <FlashingModal 
            isOpen={showFlashingModal}
            onClose={() => setShowFlashingModal(false)}
            mode={flashingMode}
            board={selectedBoard}
            comPort={comPort}
            filename={filename}
            code={generatedCode || SUPERBOT_INO_FULL_CODE}
          />

          {/* 🔌 USB DRIVERS DOWNLOAD MODAL (FOR STANDALONE WINDOW) */}
          <DriverModal
            isOpen={showDriverModal}
            onClose={() => setShowDriverModal(false)}
          />

          {/* 📧 SEND CODE TO EMAIL / TEACHER MODAL (FOR STANDALONE WINDOW) */}
          <SendCodeModal 
            isOpen={showSendEmailModal}
            onClose={() => setShowSendEmailModal(false)}
            filename={filename}
            projectName="🏎️ רובוט מכונית 4WD"
            projectType="car"
            blockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''}
            code={generatedCode || SUPERBOT_INO_FULL_CODE}
          />

          {/* 🔒 PERSONAL SAVED PROJECT MODAL */}
          <SavedProjectModal
            isOpen={showSavedProjectModal}
            onClose={() => setShowSavedProjectModal(false)}
            initialTab={savedProjectModalTab}
            projectType="car"
            defaultProjectName="רובוט מכונית 4WD"
            currentBlockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''}
            currentCode={generatedCode || SUPERBOT_INO_FULL_CODE}
            onLoadProject={handleLoadPersonalProject}
          />

        </div>
      </div>
    );
  }

  // 2. MAIN WEBSITE LESSONS VIEW ONLY (NO WORKSPACE TAB IN SITE)
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', direction: 'rtl', overflow: 'hidden', position: 'relative' }}>
      
      {/* 🌟 TOP STUDIO NAVBAR (HIDDEN ON WELCOME LANDING) */}
      {!currentLesson?.isWelcomePage && (
        <div className="builder-header-toolbar" style={{ padding: '12px 28px', background: '#ffffff', borderBottom: '1.5px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, flexWrap: 'wrap', gap: '12px' }}>
          <div className="builder-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              type="button"
              onClick={handleHomeClick} 
              className="builder-btn" 
              style={{ textDecoration: 'none', background: '#f8fafc', border: '1.5px solid #cbd5e1', color: '#1e293b', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', fontSize: '0.92rem' }}
            >
              <span>🏠</span>
              <span>דף הבית</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="builder-brand-title" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
                🏎️ רובוט מכונית 4WD Pro חכמה (ESP32)
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
                background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)',
                color: '#3730a3',
                border: '1.5px solid #c7d2fe',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(99, 102, 241, 0.15)',
                transition: 'all 0.2s ease',
                fontSize: '0.94rem'
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>📚</span>
              <span>תוכנית השיעורים והפרקים</span>
              <span style={{
                background: '#4f46e5',
                color: '#ffffff',
                padding: '2px 9px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '900'
              }}>
                {Object.keys(completedLessons).length}/{totalLessonsCount}
              </span>
            </button>

            {currentChapter && (
              <span style={{
                padding: '6px 14px',
                borderRadius: '12px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'none',
                maxWidth: '260px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentChapter.title}
              </span>
            )}
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
                  <span>🏎️</span>
                  <span>תוכנית השיעורים המלאה</span>
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#818cf8', marginTop: '6px' }}>
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
                  background: 'linear-gradient(90deg, #06b6d4, #6366f1, #10b981)',
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>

            {/* Chapters Accordion / List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {COURSE_CHAPTERS.map(ch => {
                const chapterLessons = ch.lessons.filter(l => !l.isWelcomePage);
                const chapterDoneCount = chapterLessons.filter(l => completedLessons[l.id]).length;
                const isCurrentChapter = currentChapter && currentChapter.id === ch.id;

                return (
                  <div key={ch.id} style={{ borderRadius: '16px', background: '#f8fafc', border: isCurrentChapter ? '2px solid #818cf8' : '1px solid #e2e8f0', overflow: 'hidden', boxShadow: isCurrentChapter ? '0 4px 16px rgba(99,102,241,0.08)' : 'none' }}>
                    
                    {/* Chapter Header */}
                    <div style={{ padding: '12px 16px', background: isCurrentChapter ? '#eef2ff' : '#f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.88rem', color: isCurrentChapter ? '#3730a3' : '#334155' }}>
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
                          background: selectedLessonId === `intro_${ch.id}` ? 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)' : '#ffffff',
                          border: 'none',
                          borderBottom: '1px solid #f1f5f9',
                          borderRight: selectedLessonId === `intro_${ch.id}` ? '4px solid #7c3aed' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.84rem',
                          fontWeight: selectedLessonId === `intro_${ch.id}` ? '800' : '600',
                          color: selectedLessonId === `intro_${ch.id}` ? '#6d28d9' : '#4b5563'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📋</span>
                          <span>תדריך משימה: {CHAPTER_BRIEFINGS[ch.id].title.replace(/^[^:]*:\s*/, '')}</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '8px', background: '#f3e8ff', color: '#7c3aed', fontWeight: 'bold' }}>
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
                            onClick={() => handleLessonClick(l)}
                            style={{
                              padding: '10px 16px',
                              textAlign: 'right',
                              background: isSelected ? '#e0e7ff' : '#ffffff',
                              border: 'none',
                              borderBottom: '1px solid #f1f5f9',
                              borderRight: isSelected ? '4px solid #4f46e5' : 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.82rem',
                              fontWeight: isSelected ? '800' : '500',
                              color: isSelected ? '#4338ca' : '#475569',
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
        
        {/* 📜 SIDEBAR: ALL LESSONS TRACKER (HIDDEN ON WELCOME LANDING PAGE FOR 100% FULL WIDTH) */}
        {false && (
          <div style={{ width: '340px', background: '#ffffff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ padding: '16px 20px', background: '#0f172a', color: '#ffffff' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>🏎️ תוכנית השיעורים (4WD Pro)</h3>
              <div style={{ fontSize: '0.78rem', color: '#818cf8', marginTop: '4px' }}>
                {Object.keys(completedLessons).length} מתוך {totalLessonsCount} שיעורים הושלמו
              </div>
            </div>

            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {COURSE_CHAPTERS.map(ch => (
                <div key={ch.id} style={{ borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f1f5f9', fontWeight: '800', fontSize: '0.85rem', color: '#334155' }}>
                    {ch.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {ch.lessons.map(l => {
                      const isSelected = l.id === selectedLessonId;
                      const isDone = completedLessons[l.id];
                      return (
                        <button
                          key={l.id}
                          onClick={() => setSelectedLessonId(l.id)}
                          style={{
                            padding: '10px 14px',
                            textAlign: 'right',
                            background: isSelected ? '#e0e7ff' : '#ffffff',
                            border: 'none',
                            borderBottom: '1px solid #f1f5f9',
                            borderRight: isSelected ? '4px solid #4f46e5' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? '800' : '500',
                            color: isSelected ? '#4338ca' : '#475569'
                          }}
                        >
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {l.title}
                          </span>
                          {isDone && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                backgroundImage: 'linear-gradient(180deg, rgba(8, 12, 28, 0.40) 0%, rgba(12, 17, 38, 0.65) 42%, rgba(6, 10, 24, 0.94) 100%), url("/background_4w_robot.jpg")',
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
                    border: '1.5px solid rgba(129, 140, 248, 0.35)',
                    borderRadius: '28px',
                    padding: '36px 40px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 35px rgba(99, 102, 241, 0.15)',
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
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: `1.5px solid ${currentBriefing.badgeColor || '#818cf8'}`,
                        color: '#c7d2fe',
                        fontSize: '0.88rem',
                        fontWeight: '800',
                        marginBottom: '14px'
                      }}>
                        <span>{currentBriefing.badge}</span>
                      </div>

                      <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: '900', margin: '0 0 10px 0', color: '#ffffff', textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>
                        {currentBriefing.title}
                      </h1>

                      <p style={{ fontSize: '1.15rem', color: '#cbd5e1', margin: '0 0 16px 0', fontWeight: '500' }}>
                        {currentBriefing.subtitle}
                      </p>

                      <p style={{ fontSize: '1.02rem', color: '#94a3b8', margin: 0, lineHeight: '1.7', maxWidth: '850px' }}>
                        {currentBriefing.overview}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
                      <button
                        onClick={() => setSelectedLessonId(currentBriefing.firstLessonId)}
                        style={{
                          padding: '18px 36px',
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #a855f7 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: '900',
                          fontSize: '1.12rem',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.55), 0 0 20px rgba(6, 182, 212, 0.35)',
                          transition: 'all 0.25s ease',
                          fontFamily: 'inherit',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 14px 40px rgba(99, 102, 241, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.55)';
                        }}
                      >
                        🚀 התחל את משימות הפרק ←
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600' }}>
                        <span>⏱️ זמן משוער:</span>
                        <span style={{ color: '#38bdf8', fontWeight: '800' }}>{currentBriefing.timeEst}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Detail Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                    
                    {/* CARD 1 */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1.5px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '24px',
                      padding: '28px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.35)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid #818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                          🎯
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                          מטרות ויעדי הפרק
                        </h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentBriefing.objectives?.map((obj, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ color: '#10b981', fontWeight: '900', fontSize: '1.1rem', lineHeight: '1.2' }}>✓</span>
                            <span style={{ color: '#e2e8f0', fontSize: '0.96rem', lineHeight: '1.5', fontWeight: '500' }}>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CARD 2 */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1.5px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '24px',
                      padding: '28px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.35)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid #22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                          🧰
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                          מה כוללת הערכה לפרק זה?
                        </h3>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                        {currentBriefing.kit?.map((item, i) => (
                          <div key={i} style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', color: '#bae6fd', fontSize: '0.9rem', fontWeight: '700' }}>
                            🔩 {item}
                          </div>
                        ))}
                      </div>

                      {currentBriefing.skills && (
                        <>
                          <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#94a3b8', marginBottom: '10px' }}>
                            💡 מיומנויות נרכשות:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {currentBriefing.skills.map((s, idx) => (
                              <span key={idx} style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe', fontSize: '0.82rem', fontWeight: '700', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                                ✨ {s}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* CARD 3 */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1.5px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: '24px',
                      padding: '28px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                            💡
                          </div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                            טיפ חשוב להצלחה במשימה
                          </h3>
                        </div>

                        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '18px', color: '#fde68a', fontSize: '0.98rem', lineHeight: '1.7', fontWeight: '500' }}>
                          {currentBriefing.proTip}
                        </div>
                      </div>

                      <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setSelectedLessonId(currentBriefing.firstLessonId)}
                          style={{
                            flex: 1,
                            padding: '12px 20px',
                            borderRadius: '12px',
                            background: '#f59e0b',
                            color: '#0f172a',
                            border: 'none',
                            fontWeight: '900',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          התחל בשיעור הראשון ←
                        </button>
                        <button
                          onClick={() => setIsSidebarOpen(true)}
                          style={{
                            padding: '12px 18px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            fontWeight: '800',
                            fontSize: '0.95rem',
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

            {/* 🛠️ CASE B: ATMOSPHERIC BANNER FOR STANDARD LESSONS (BLENDED WITH OPENING ROBOT BACKGROUND) */}
            {currentLesson && !currentLesson.isWelcomePage && !currentBriefing && (
              <div style={{
                backgroundImage: 'linear-gradient(90deg, rgba(8, 12, 28, 0.90) 0%, rgba(15, 23, 42, 0.62) 50%, rgba(8, 12, 28, 0.30) 100%), url("/background_4w_robot.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                backgroundRepeat: 'no-repeat',
                padding: '32px 42px',
                borderRadius: '26px',
                border: '1.5px solid rgba(129, 140, 248, 0.45)',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.22), 0 0 30px rgba(99, 102, 241, 0.2)',
                marginBottom: '26px',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.86rem', padding: '6px 16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.35)', color: '#e0e7ff', fontWeight: '800', border: '1px solid rgba(129, 140, 248, 0.55)', backdropFilter: 'blur(8px)' }}>
                      {currentChapter ? currentChapter.title : ''}
                    </span>
                    <span style={{ fontSize: '0.82rem', padding: '5px 12px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.25)', color: '#67e8f9', fontWeight: '800', border: '1px solid rgba(6, 182, 212, 0.45)' }}>
                      🤖 4WD Pro Robot
                    </span>
                  </div>
                  <span style={{ fontSize: '0.94rem', color: '#38bdf8', fontWeight: '900', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>
                    שלב {currentLesson.id}
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 1.95rem)', fontWeight: '900', color: '#ffffff', margin: 0, textShadow: '0 2px 14px rgba(0,0,0,0.7)' }}>
                  {currentLesson.title}
                </h2>
              </div>
            )}

            {/* 🌌 FULL-WIDTH FUTURISTIC WORLD OF ROBOTICS WELCOME LANDING */}
            {currentLesson?.isWelcomePage && (
              <div style={{
                width: '100%',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(180deg, rgba(8, 12, 28, 0.42) 0%, rgba(12, 17, 38, 0.68) 42%, rgba(6, 10, 24, 0.94) 100%), url("/background_4w_robot.jpg")',
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
                      background: 'rgba(10, 16, 36, 0.62)',
                      border: '1.5px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '28px',
                      padding: '36px 38px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 35px rgba(139, 92, 246, 0.15)',
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
                        background: 'rgba(129, 140, 248, 0.2)',
                        border: '1px solid rgba(168, 85, 247, 0.45)',
                        color: '#c4b5fd',
                        fontSize: '0.92rem',
                        fontWeight: '800',
                        marginBottom: '18px',
                        boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
                      }}>
                        ✨ ברוכים הבאים לעולם הרובוטיקה והפיתוח העתידני
                      </div>

                      <h1 style={{
                        fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)',
                        fontWeight: '900',
                        lineHeight: '1.18',
                        margin: '0 0 16px 0',
                        color: '#ffffff',
                        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(168, 85, 247, 0.35)'
                      }}>
                        🏎️ רובוט מכונית 4WD Pro (Freenove ESP32)
                      </h1>

                      <p style={{
                        fontSize: '1.15rem',
                        color: '#e2e8f0',
                        lineHeight: '1.8',
                        margin: '0 0 28px 0',
                        fontWeight: '400',
                        textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                      }}>
                        צא למסע מרגש בעולם הרובוטיקה המתקדם! הרכב במו ידיך מכונית 4WD Pro עוצמתית, תכנת מנועי סרוו דו-ציריים (Pan-Tilt), חבר מצלמת Wi-Fi לשידור וידאו חי, ותכנת אלגוריתמים אוטונומיים למעקב קו ועקיפת מכשולים!
                      </p>

                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button 
                          onClick={() => setSelectedLessonId('intro_ch1')} 
                          style={{
                            padding: '18px 42px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #a855f7 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: '900',
                            fontSize: '1.15rem',
                            cursor: 'pointer',
                            boxShadow: '0 12px 35px rgba(99, 102, 241, 0.55), 0 0 25px rgba(6, 182, 212, 0.35)',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 16px 45px rgba(99, 102, 241, 0.7), 0 0 35px rgba(6, 182, 212, 0.55)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.55), 0 0 25px rgba(6, 182, 212, 0.35)';
                          }}
                        >
                          🚀 היכנס לעולם הרובוטיקה והתחל בהרכבה צעד-אחר-צעד ←
                        </button>
                      </div>
                    </div>

                    {/* LEFT: HOLOGRAPHIC PROTOTYPE SHOWCASE CARD */}
                    <div style={{
                      background: 'rgba(12, 19, 42, 0.62)',
                      border: '2px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '28px',
                      overflow: 'hidden',
                      boxShadow: '0 25px 65px rgba(0,0,0,0.6), 0 0 40px rgba(168, 85, 247, 0.22)',
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
                        border: '1px solid rgba(168, 85, 247, 0.5)',
                        padding: '6px 14px',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        color: '#c7d2fe',
                        fontWeight: '800',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        📸 דגם מוגמר סופי · 4WD Smart Car Pro
                      </div>

                      {/* Zoomed-in robot car showcase from background artwork */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '240px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '2px solid rgba(168, 85, 247, 0.45)',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 30px rgba(6, 182, 212, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src="/robot_4w_final.jpg" 
                          alt="4WD Smart Car Pro Prototype"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      </div>

                      {/* Spec chips */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '14px', width: '100%' }}>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#38bdf8', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          ⚡ בקר ESP32 Dual Core
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#c084fc', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          📹 מצלמת Wi-Fi חיה
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#34d399', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          🎮 שליטה באפליקציה
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#f472b6', fontSize: '0.78rem', fontWeight: '800', padding: '5px 12px', borderRadius: '10px' }}>
                          🤖 עקיפת מכשולים ומעקב קו
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 CYBER EXPERIENCE CARDS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                    {currentLesson.features.map((feat, idx) => {
                      const glowColors = [
                        { border: 'rgba(168, 85, 247, 0.35)', badge: 'rgba(168, 85, 247, 0.18)' },
                        { border: 'rgba(56, 189, 248, 0.35)', badge: 'rgba(56, 189, 248, 0.18)' },
                        { border: 'rgba(52, 211, 153, 0.35)', badge: 'rgba(52, 211, 153, 0.18)' },
                        { border: 'rgba(244, 114, 182, 0.35)', badge: 'rgba(244, 114, 182, 0.18)' }
                      ][idx % 4];
                      return (
                        <div key={idx} style={{
                          background: 'rgba(12, 18, 38, 0.65)',
                          border: `1.5px solid ${glowColors.border}`,
                          borderRadius: '24px',
                          padding: '26px 22px',
                          backdropFilter: 'blur(20px)',
                          textAlign: 'right',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                          transition: 'all 0.25s ease'
                        }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: glowColors.badge,
                            border: `1px solid ${glowColors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            marginBottom: '16px',
                            boxShadow: `0 0 20px ${glowColors.badge}`
                          }}>
                            {feat.icon}
                          </div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0' }}>{feat.title}</h4>
                          <p style={{ fontSize: '0.94rem', color: '#cbd5e1', margin: 0, lineHeight: '1.65' }}>{feat.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* FULL-WIDTH CINEMA VIDEO STAGE */}
                  <div style={{
                    background: 'rgba(10, 16, 38, 0.75)',
                    border: '2px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: '30px',
                    padding: '32px 30px',
                    backdropFilter: 'blur(24px)',
                    marginTop: '8px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 50px rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', padding: '0 6px', flexWrap: 'wrap', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.5rem' }}>🎬</span>
                          <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '1.35rem', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
                            סרטון הדגמה בלייב: רובוט מכונית 4WD Pro בפעולה!
                          </span>
                        </div>
                        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.92rem' }}>
                          צפו ביכולות הנסיעה, היגוי ה-Pan-Tilt, הזרמת הווידאו החיה והחיישנים החכמים
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedLessonId('intro_ch1')}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          🚀 התחל בהרכבה
                        </button>
                        <a 
                          href={currentLesson.videoLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 18px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#38bdf8',
                            fontSize: '0.95rem',
                            fontWeight: '800',
                            textDecoration: 'none'
                          }}
                        >
                          📺 פתח בלשונית חדשה ↗
                        </a>
                      </div>
                    </div>

                    {/* Cinema Frame */}
                    <div style={{
                      width: '100%',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(6, 182, 212, 0.25)',
                      border: '2px solid rgba(56, 189, 248, 0.4)',
                      background: '#000000',
                      position: 'relative'
                    }}>
                      <video 
                        src={currentLesson.videoUrl} 
                        controls 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        style={{ width: '100%', maxHeight: '560px', objectFit: 'contain', display: 'block' }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* FIREBASE SETUP GUIDE DISPLAY */}
            {currentLesson?.setupGuide && (
              <div style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1.5px solid #cbd5e1', marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ff6f00', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔥 מדריך פתיחת פרויקט וחיבור Firebase Realtime Database צעד-אחר-צעד
                </h4>
                <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '24px', fontWeight: '500' }}>
                  {currentLesson.goal}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
                  {currentLesson.setupGuide.map((item) => (
                    <div key={item.step} style={{ background: '#fff7ed', padding: '20px', borderRadius: '18px', border: '1.5px solid #ffedd5', boxShadow: '0 4px 14px rgba(255,111,0,0.06)' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ff6f00', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '12px' }}>
                        {item.step}
                      </div>
                      <h5 style={{ fontSize: '1rem', fontWeight: '800', color: '#c2410c', margin: '0 0 8px 0' }}>
                        {item.title}
                      </h5>
                      <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0, lineHeight: '1.6', fontWeight: '500' }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleOpenWorkspaceInNewWindow} 
                  className="builder-btn builder-btn-hero" 
                  style={{ padding: '16px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #ff6f00 0%, #ff9900 100%)', boxShadow: '0 10px 25px rgba(255,111,0,0.3)' }}
                >
                  🧪 פתח את סביבת העבודה לתרגול המשימה בחלונית חדשה ↗
                </button>
              </div>
            )}

            {/* ASSEMBLY LESSON CONTENT */}
            {currentLesson?.instructions && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(440px, 1.25fr) minmax(380px, 1fr)', gap: '28px', marginBottom: '28px' }}>
                
                {/* OFFICIAL FREENOVE CAD IMAGE COLUMN */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '24px', border: '1.5px solid #cbd5e1', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.3rem' }}>📐</span>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          שרטוט CAD רשמי (Freenove Engineering)
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>התבונן בכיוון ההרכבה וסדר הברגת הרכיבים</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setZoomImageSrc(currentLesson.imgUrl)} 
                      className="builder-btn"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#f5f3ff', color: '#4338ca', fontWeight: '800', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>🔍</span> הגדל מסך מלא
                    </button>
                  </div>

                  <div 
                    onClick={() => setZoomImageSrc(currentLesson.imgUrl)}
                    title="לחץ להגדלה במסך מלא"
                    style={{ 
                      background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)', 
                      padding: '16px', 
                      borderRadius: '18px', 
                      border: '2px dashed #cbd5e1', 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justify: 'center',
                      minHeight: '400px',
                      cursor: 'zoom-in',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease, transform 0.2s ease'
                    }}
                  >
                    <img 
                      src={currentLesson.imgUrl} 
                      alt={currentLesson.title}
                      style={{ maxWidth: '100%', borderRadius: '12px', objectFit: 'contain', maxHeight: '520px', width: '100%', transition: 'transform 0.2s ease' }}
                    />
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(15,23,42,0.75)', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
                      🔍 לחץ לתקריב HD
                    </div>
                  </div>
                </div>

                {/* Instructions & Interactive Parts Column */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '24px', border: '1.5px solid #cbd5e1', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', display: 'flex', flexDirection: 'column' }}>
                  {currentLesson.partsNeeded && (
                    <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>🔩</span> רכיבים וברגים נדרשים לשלב זה:
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>סמן כל רכיב שהכנת</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {currentLesson.partsNeeded.map((part, idx) => {
                          const isChecked = !!checkedParts[`${currentLesson.id}_${idx}`];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => togglePartCheck(currentLesson.id, idx)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '12px',
                                background: isChecked ? '#ecfdf5' : '#f8fafc',
                                color: isChecked ? '#065f46' : '#1e293b',
                                fontSize: '0.88rem',
                                fontWeight: '700',
                                border: isChecked ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: isChecked ? 'line-through' : 'none',
                                opacity: isChecked ? 0.85 : 1,
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span>{isChecked ? '✅' : '⬜'}</span>
                              <span>{part}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📝</span> פעולות ביצוע צעד-אחר-צעד:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {currentLesson.instructions.map((inst, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          gap: '14px', 
                          alignItems: 'flex-start',
                          padding: '12px 16px',
                          background: '#f8fafc',
                          borderRadius: '14px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: '#4f46e5', 
                          color: '#ffffff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '0.85rem', 
                          fontWeight: '800',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ color: '#334155', fontSize: '0.96rem', lineHeight: '1.65', fontWeight: '500' }}>
                          {inst}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', padding: '12px 16px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔧</span>
                    <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: '600', lineHeight: '1.4' }}>
                      טיפ הרכבה: אין צורך להפעיל כוח חזק בעת הברגה לשלדת האקריליק. הדק עד למגע יציב בלבד.
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* CODING LESSON CHALLENGE VIEW (SPLIT BLOCKS NEEDED & TARGET C++ PREVIEW) */}
            {currentLesson?.codeTemplate && (
              <div style={{ background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1.5px solid #cbd5e1', marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                  🎯 משימת התכנות בשיעור זה:
                </h4>
                <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '24px', fontWeight: '500' }}>
                  {currentLesson.goal}
                </p>

                {/* 2-COLUMN SPLIT CHALLENGE GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  
                  {/* COLUMN 1: BLOCKS NEEDED FOR THIS CHALLENGE */}
                  {currentLesson.neededBlocks && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#4338ca', margin: 0, marginBottom: '14px' }}>
                        🧩 הבלוקים הנדרשים לבניית המשימה:
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px', fontWeight: '500' }}>
                        גרור את הבלוקים הללו בסביבת הפיתוח וחבר אותם בסדר הנכון למילוי הקוד:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {currentLesson.neededBlocks.map((bName, idx) => (
                          <span 
                            key={idx} 
                            style={{ 
                              padding: '10px 18px', 
                              borderRadius: '14px', 
                              background: '#ffffff', 
                              color: '#1e1b4b', 
                              fontSize: '0.92rem', 
                              fontWeight: '800', 
                              border: '2px solid #6366f1',
                              boxShadow: '0 4px 12px rgba(99,102,241,0.08)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {bName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COLUMN 2: C++ TARGET CODE STRUCTURE PREVIEW */}
                  <div style={{ background: '#0f172a', padding: '20px', borderRadius: '18px', direction: 'ltr', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                      💻 קוד C++ המיועד להיווצר בלייב:
                    </div>
                    <pre style={{ margin: 0, color: '#f1f5f9', fontSize: '0.9rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', flex: 1 }}>
                      {currentLesson.codeTemplate}
                    </pre>
                  </div>

                </div>

                {/* OPEN WORKSPACE IN STANDALONE BROWSER WINDOW BUTTON ONLY */}
                <button 
                  onClick={handleOpenWorkspaceInNewWindow} 
                  className="builder-btn builder-btn-hero" 
                  style={{ padding: '16px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}
                >
                  🧪 פתח את סביבת העבודה לתרגול המשימה בחלונית חדשה ↗
                </button>
              </div>
            )}

            {currentLesson && !currentLesson.isWelcomePage && (
              <div 
                style={{ 
                  position: 'sticky', 
                  bottom: '16px', 
                  zIndex: 40,
                  marginTop: '36px',
                  background: 'rgba(255, 255, 255, 0.94)', 
                  backdropFilter: 'blur(16px)', 
                  border: '1.5px solid #cbd5e1', 
                  borderRadius: '20px', 
                  padding: '14px 24px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                {/* BACKWARD BUTTON */}
                <button
                  type="button"
                  onClick={handlePrevLesson}
                  disabled={currentSequenceIndex <= 0}
                  className="builder-btn"
                  style={{
                    padding: '12px 22px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    background: currentSequenceIndex <= 0 ? '#f1f5f9' : '#ffffff',
                    color: currentSequenceIndex <= 0 ? '#94a3b8' : '#334155',
                    border: '1.5px solid #cbd5e1',
                    cursor: currentSequenceIndex <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: currentSequenceIndex <= 0 ? 0.6 : 1,
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
                      background: '#eef2ff',
                      border: '1px solid #c7d2fe',
                      color: '#4338ca',
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
                    margin: 0
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

      {/* 📚 FLOATING QUICK-ACCESS CURRICULUM TAB (STAYS ACCESSIBLE AT ALL SCROLL DEPTHS) */}
      {!currentLesson?.isWelcomePage && (
        <div 
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: 'fixed',
            right: 0,
            top: '40%',
            zIndex: 9990,
            background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
            color: '#ffffff',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            border: '1.5px solid rgba(129, 140, 248, 0.55)',
            borderRight: 'none',
            boxShadow: '-6px 6px 25px rgba(15, 23, 42, 0.45), 0 0 15px rgba(99, 102, 241, 0.3)',
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
            e.currentTarget.style.boxShadow = '-10px 8px 30px rgba(99, 102, 241, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '-6px 6px 25px rgba(15, 23, 42, 0.45)';
          }}
          title="לחץ לפתיחת תוכנית השיעורים המלאה"
        >
          <span style={{ fontSize: '1.35rem' }}>📚</span>
          <span style={{ writingMode: 'vertical-rl', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', color: '#e0e7ff' }}>
            תוכנית השיעורים
          </span>
          <span style={{ fontSize: '0.72rem', background: '#4f46e5', color: '#ffffff', padding: '3px 7px', borderRadius: '8px', fontWeight: 'bold' }}>
            {Object.keys(completedLessons).length}/{totalLessonsCount}
          </span>
        </div>
      )}

      {/* 🔍 PERFECTLY CENTERED GLOBAL FULLSCREEN LIGHTBOX MODAL */}
      {zoomImageSrc && (
        <div 
          onClick={() => setZoomImageSrc(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            zIndex: 999999,
            backdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              background: '#ffffff',
              padding: '24px',
              borderRadius: '24px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              maxWidth: '85vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              margin: 'auto'
            }}
          >
            <button 
              onClick={() => setZoomImageSrc(null)}
              style={{
                position: 'absolute',
                top: '-18px',
                right: '-18px',
                background: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                padding: 0,
                margin: 0,
                zIndex: 100
              }}
              title="סגור חלון"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <img 
              src={zoomImageSrc} 
              alt="Zoomed Official CAD Schematic" 
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </div>
        </div>
      )}

      {/* ✨ UPGRADED AI BLOCK GENERATOR MODAL */}
      <AIBlockGeneratorModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onBlockCreated={() => {
          loadToolboxConfiguration();
        }}
      />

      {/* 🚀 FLASHING & COMPILATION PROCESS MODAL */}
      <FlashingModal 
        isOpen={showFlashingModal}
        onClose={() => setShowFlashingModal(false)}
        mode={flashingMode}
        board={selectedBoard}
        comPort={comPort}
        filename={filename}
        code={generatedCode || SUPERBOT_INO_FULL_CODE}
      />

      {/* 🔌 USB DRIVERS DOWNLOAD MODAL */}
      <DriverModal
        isOpen={showDriverModal}
        onClose={() => setShowDriverModal(false)}
      />

      {/* 📧 SEND CODE TO EMAIL / TEACHER MODAL */}
      <SendCodeModal 
        isOpen={showSendEmailModal}
        onClose={() => setShowSendEmailModal(false)}
        filename={filename}
        projectName="🏎️ רובוט מכונית 4WD"
        projectType="car"
        blockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''}
        code={generatedCode || SUPERBOT_INO_FULL_CODE}
      />

      {/* 🔒 PERSONAL SAVED PROJECT MODAL */}
      <SavedProjectModal
        isOpen={showSavedProjectModal}
        onClose={() => setShowSavedProjectModal(false)}
        initialTab={savedProjectModalTab}
        projectType="car"
        defaultProjectName="רובוט מכונית 4WD"
        currentBlockXml={workspace ? (() => { try { return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace)); } catch(e){ return ''; } })() : ''}
        currentCode={generatedCode || SUPERBOT_INO_FULL_CODE}
        onLoadProject={handleLoadPersonalProject}
      />

      {/* 🔑 SUBSCRIPTION & CLASS ACCESS CODE MODAL */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setSelectedLockedLesson(null);
        }}
        projectType="car"
        lessonTitle={selectedLockedLesson ? selectedLockedLesson.title : ''}
        onUnlockSuccess={(license) => {
          setIsUnlocked(true);
          if (selectedLockedLesson) {
            setSelectedLessonId(selectedLockedLesson.id);
          }
        }}
      />

    </div>
  );
}

export default FreenoveCar;
