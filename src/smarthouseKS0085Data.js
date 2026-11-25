// Keyestudio KS0085 Smart Home Kit for Arduino
// Complete building & wiring guide directly extracted from the official Keyestudio KS0085 documentation:
// https://docs.keyestudio.com/projects/KS0085/en/latest/docs/2.%20Product%20installation/2.%20Product%20installation.html

const KS0085_IMG_BASE = 'https://docs.keyestudio.com/projects/KS0085/en/latest/_images/';

export const KS0085_WIRING_LIST = [
  {
    stepNum: 1,
    componentName: 'חיישן תנועה אינפרא-אדום PIR Motion Sensor',
    pinConnection: 'G -> G | V -> V | S -> פין 2 (מיקום ⑤ על לוח העץ)',
    instructions: 'חברו את כבל ה-3 פינים (G/V/S) מחיישן התנועה PIR ללוח ההרחבה בפין דיגיטלי 2.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317084823.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313143554.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143558.png`
  },
  {
    stepNum: 2,
    componentName: 'זמזם פסיבי Passive Buzzer',
    pinConnection: 'G -> G | V -> V | S -> פין 3 (מיקום ⑯ על לוח העץ)',
    instructions: 'חברו את כבל הזמזם הפסיבי לפין דיגיטלי 3 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317084834.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313143731.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143736.png`
  },
  {
    stepNum: 3,
    componentName: 'לחצן ראשון Button 1',
    pinConnection: 'G -> G | V -> V | S -> פין 4 (מיקום ③ על לוח העץ)',
    instructions: 'חברו את לחצן 1 לפין דיגיטלי 4 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317084848.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144155.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144159.png`
  },
  {
    stepNum: 4,
    componentName: 'מודול נורת LED צהובה Yellow LED',
    pinConnection: 'G -> G | V -> V | S -> פין 5 (מיקום ⑫ על לוח העץ)',
    instructions: 'חברו את מודול ה-LED הצהוב לפין דיגיטלי 5 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317084904.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144251.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144254.png`
  },
  {
    stepNum: 5,
    componentName: 'מודול מאוורר ומנוע Fan Module',
    pinConnection: 'GND -> G | VCC -> V | INA -> פין 7 | INB -> פין 6 (מיקום ⑮)',
    instructions: 'חברו את ארבעת החוטים של מודול המאוורר: GND ל-G, VCC ל-V, וקווי הבקרה INA ו-INB לפינים 7 ו-6 בהתאמה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317084935.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144325.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144329.png`
  },
  {
    stepNum: 6,
    componentName: 'לחצן שני Button 2',
    pinConnection: 'G -> G | V -> V | S -> פין 8 (מיקום ④ על לוח העץ)',
    instructions: 'חברו את לחצן 2 לפין דיגיטלי 8 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317084958.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144512.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144516.png`
  },
  {
    stepNum: 7,
    componentName: 'מנוע סרוו דלת Servo 1 (Door)',
    pinConnection: 'חוט חום -> G | חוט אדום -> V | חוט כתום -> פין 9 (מיקום ⑰)',
    instructions: 'חברו את כבל מנוע הסרוו של הדלת לפין 9 בלוח ההרחבה. שימו לב לסדר הצבעים: חום (GND), אדום (VCC), כתום (אות Signal).',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085050.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144605.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144609.png`
  },
  {
    stepNum: 8,
    componentName: 'מנוע סרוו חלון Servo 2 (Window)',
    pinConnection: 'חוט חום -> G | חוט אדום -> V | חוט כתום -> פין 10 (מיקום ⑪)',
    instructions: 'חברו את כבל מנוע הסרוו של החלון לפין 10 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085128.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144715.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144719.png`
  },
  {
    stepNum: 9,
    componentName: 'חיישן גז ועשן MQ-2 Gas Sensor',
    pinConnection: 'GND -> G | VCC -> V | D0 -> פין 11 | A0 -> פין A0 (מיקום ⑩)',
    instructions: 'חברו את 4 החוטים מחיישן הגז: GND ו-VCC למתח, D0 לפין דיגיטלי 11 ו-A0 לפין אנלוגי A0.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085144.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144753.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144757.png`
  },
  {
    stepNum: 10,
    componentName: 'מודול ממסר Relay Module',
    pinConnection: 'G -> G | V -> V | S -> פין 12 (מיקום ⑥ על לוח העץ)',
    instructions: 'חברו את מודול הממסר (Relay) לפין דיגיטלי 12 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085152.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313144852.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313144913.png`
  },
  {
    stepNum: 11,
    componentName: 'מודול נורת LED לבנה White LED',
    pinConnection: 'G -> G | V -> V | S -> פין 13 (מיקום ① על לוח העץ)',
    instructions: 'חברו את מודול ה-LED הלבן לפין דיגיטלי 13 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085204.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313145003.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145007.png`
  },
  {
    stepNum: 12,
    componentName: 'מסך תצוגה LCD1602 Display (I2C)',
    pinConnection: 'GND -> GND | VCC -> 5V | SDA -> SDA | SCL -> SCL (מיקום ②)',
    instructions: 'חברו את 4 החוטים מממשק ה-I2C של מסך ה-LCD1602 ישירות לפיני ה-I2C בלוח ההרחבה (SDA ו-SCL).',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085224.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313145054.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145057.png`
  },
  {
    stepNum: 13,
    componentName: 'חיישן אור Photocell Sensor (LDR)',
    pinConnection: 'G -> G | V -> V | S -> פין A1 (מיקום ⑭ על לוח העץ)',
    instructions: 'חברו את חיישן האור האנלוגי לפין A1 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085244.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313145145.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145148.png`
  },
  {
    stepNum: 14,
    componentName: 'חיישן לחות קרקע Soil Humidity Sensor',
    pinConnection: 'G -> G | V -> V | S -> פין A2 בלוח ההרחבה',
    instructions: 'חברו את כבל חיישן לחות הקרקע לפין אנלוגי A2 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085306.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313145229.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145234.png`
  },
  {
    stepNum: 15,
    componentName: 'חיישן אדים וגשם Steam / Rain Sensor',
    pinConnection: 'G -> G | V -> V | S -> פין A3 (מיקום ⑬ על לוח העץ)',
    instructions: 'חברו את כבל חיישן האדים לפין אנלוגי A3 בלוח ההרחבה.',
    diagramImg: `${KS0085_IMG_BASE}img-20230317085322.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313145328.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145332.png`
  },
  {
    stepNum: 16,
    componentName: 'חיבור אספקת חשמל Power Supply',
    pinConnection: 'חיבור שקע ה-DC בלוח הבקר לסוללות 6x AA',
    instructions: 'חברו את מחבר ה-DC מבית הסוללות (6 סוללות AA) לשקע המתח השחור בלוח הבקר כדי להפעיל את המערכת.',
    diagramImg: `${KS0085_IMG_BASE}img-20230313145419.png`,
    boardImg: `${KS0085_IMG_BASE}img-20230313145422.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145422.png`
  }
];

export const SMART_HOME_KS0085_ASSEMBLY_ALL = [
  { 
    id: 'ks0085_welcome', 
    title: '✨ ברוכים הבאים לפרויקט בית חכם Arduino (Keyestudio KS0085)!', 
    isWelcomePage: true,
    welcomeText: 'ברוכים הבאים למסלול הבנייה הרשמי של ערכת הבית החכם Keyestudio KS0085 מבוססת Arduino! במסלול זה תרכיבו את מבנה הבית מלוחות עץ, תחברו 14 חיישנים ומודולים חכמים (גז, תנועה, סרוו חלון ודלת, מאוורר, מסך LCD ועוד), ותחווטו את כל הרכיבים ללוח ההרחבה.',
    features: [
      { icon: '🏠', title: '19 שלבי הרכבה + שלב גג', desc: 'הרכבה מכאנית מפורטת צעד-אחר-צעד של שלדת הבית, הקירות והמפרקים הנעים מלוחות עץ איכותיים.' },
      { icon: '🔌', title: '16 שלבי חיווט מפורטים', desc: 'הנחיות חיווט מלאות עם טבלאות פינים, צבעי כבלים ותרשימים לכל חיישן ומודול בנפרד.' },
      { icon: '🪟', title: 'כיול סרוו 90° לחלון ודלת', desc: 'הוראות מדויקות לכיול זוויות מנועי הסרוו טרם הרכבת החלון והדלת למניעת שבירה.' },
      { icon: '📱', title: 'תקשורת Bluetooth ומסך LCD', desc: 'שליטה אלחוטית דרך הסמארטפון ותצוגת נתונים חיה על גבי מסך LCD1602 I2C.' }
    ],
    partsNeeded: ['ערכת חלקי עץ Board A~I מלאה', 'לוח בקר Keyestudio PLUS Mainboard', 'לוח הרחבה V5 Sensor Shield', 'ערכת ברגים ואומים M3 ו-M4', 'חיישנים ומנועים'],
    instructions: [
      '1. פתחו את קופסת הערכה ובדקו את לוחות העץ (Board A עד Board I) והרכיבים לפי התמונה מטה.',
      '2. הכינו משטח עבודה ישר, מברג מתאים, ואת חלקי הערכה.',
      '3. עברו לשלב 1 בסרגל השלבים העליון להתחלת ההרכבה.'
    ],
    assemblyImg: `${KS0085_IMG_BASE}img-20230313133550.png`
  },
  { 
    id: 'ks0085_step_1', 
    title: 'הרכבה - שלב 1: שלדת עץ בסיסית ודפנות', 
    partsNeeded: ['לוח עץ בסיס (Base Board) x1', 'קירות עץ היקפיים x2', '24x ברגי M4*8mm', '24x אומי M4'], 
    instructions: [
      '1. זהו את הרכיבים הנדרשים: לוח הבסיס מעץ, 2 קירות עץ היקפיים, 24 ברגי M4*8mm ו-24 אומי M4.',
      '2. עקבו אחר שרטוט ההרכבה: הניחו את לוח הבסיס על משטח עבודה ישר וחברו את קירות העץ בעזרת ברגי ה-M4 והאומים.',
      '3. הדקו היטב את האומים וודאו שהתוצאה תואמת לתמונת הפרוטוטייפ.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313133930.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313134049.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313134107.png`
  },
  { 
    id: 'ks0085_step_2', 
    title: 'הרכבה - שלב 2: מסגרות עץ וחיזוקי דפנות', 
    partsNeeded: ['מסגרות עץ היקפיות x2', '8x ברגי M4*8mm', '8x אומי M4'], 
    instructions: [
      '1. זהו את לוחות המסגרת המבנית מעץ, 8 ברגי M4*8mm ו-8 אומי M4.',
      '2. עקבו אחר שרטוט ההרכבה: הרכיבו את לוחות המסגרת משני צידי המבנה ליצירת קשיחות מבנית.',
      '3. חזקו בברגי M4*8mm ואומים לקבלת שלדה יציבה.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313134129.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313134141.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313134256.png`
  },
  { 
    id: 'ks0085_step_3', 
    title: 'הרכבה - שלב 3: התקנת לוח בקר PLUS Mainboard (Arduino)', 
    partsNeeded: ['לוח בקר Keyestudio PLUS Mainboard x1', '4x עמודי ספייסר פליז M3*10mm Dual-pass', '4x ברגי M3*6mm'], 
    instructions: [
      '1. זהו את לוח הבקר PLUS Mainboard, 4 עמודי ספייסר פליז M3*10mm ו-4 ברגי M3*6mm.',
      '2. הניחו את 4 עמודי הספייסר בחורי לוח העץ הבסיסי והבריגו אותם.',
      '3. הציבו את לוח הבקר מעל עמודי הפליז והדקו ב-4 ברגי M3*6mm.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313134336.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313134350.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313134400.png`
  },
  { 
    id: 'ks0085_step_4', 
    title: 'הרכבה - שלב 4: תושבות פינה וחיזוקי שלדה', 
    partsNeeded: ['תושבות זווית עץ x4', '12x ברגי M4*8mm', '12x אומי M4'], 
    instructions: [
      '1. זהו את 4 תושבות הזווית מעץ, 12 ברגי M4*8mm ו-12 אומי M4.',
      '2. חברו את תושבות הזווית בפינות הפנימיות לחיזוק והצמדת הקירות לפי השרטוט.',
      '3. הדקו בעזרת ברגי M4*8mm ואומים.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313134423.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313134433.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313134443.png`
  },
  { 
    id: 'ks0085_step_5', 
    title: 'הרכבה - שלב 5: כיול מנוע סרוו חלון ל-90° והרכבתו', 
    partsNeeded: ['מנוע סרוו Micro Servo x1', 'תושבת עץ לסרוו', 'ברגי הצמדה'], 
    instructions: [
      '1. חשוב מאוד: לפני ההרכבה יש לכייל את מנוע הסרוו של החלון לזווית 90° (חיבור חום ל-G, אדום ל-V, כתום לפין 10).',
      '2. לאחר שהסרוו הסתובב אוטומטית ל-90°, הרכיבו אותו על תושבת העץ.',
      '3. הדקו את הברגים לפי שרטוט ההרכבה.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313153014.jpg`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313134542.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313134552.png`
  },
  { 
    id: 'ks0085_step_6', 
    title: 'הרכבה - שלב 6: הרכבת חלון אקרילי וזרוע הסרוו', 
    partsNeeded: ['חלון אקרילי שקוף x1', 'זרוע סרוו חד-צדדית', 'בורג ציר ואום נעילה עצמית (Self-locking nut)'], 
    instructions: [
      '1. שימו לב: אין להדק חזק מדי את אום הנעילה העצמית כדי לאפשר תנועה חלקה של החלון!',
      '2. בעת ההרכבה החלון חייב להיות במצב סגור כפי שמוצג באיור.',
      '3. חברו את זרוע הסרוו לציר החלון והדקו קלות.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313134928.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313135716.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313135729.png`
  },
  { 
    id: 'ks0085_step_7', 
    title: 'הרכבה - שלב 7: הרכבת דופן קדמית ומסגרת דלת', 
    partsNeeded: ['לוח עץ דופן קדמית עם פתח דלת', 'לוחות חיזוק עץ', 'ברגי M4 ואומים'], 
    instructions: [
      '1. זהו את לוח הדופן הקדמית בעל פתח הכניסה לדלת.',
      '2. חברו את לוחות החיזוק לקצוות הדופן לפי השרטוט.',
      '3. הדקו בברגי M4*8mm ואומים.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313141949.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313141959.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142012.png`
  },
  { 
    id: 'ks0085_step_8', 
    title: 'הרכבה - שלב 8: התקנת מנוע סרוו דלת ודלת הכניסה', 
    partsNeeded: ['מנוע סרוו דלת x1', 'דלת עץ כניסה', 'זרוע סרוו וברגים'], 
    instructions: [
      '1. התקינו את מנוע הסרוו הייעודי של הדלת בתושבת העץ שמעל הדלת.',
      '2. חברו את דלת הכניסה בעזרת ציר הזרוע אל הסרוו.',
      '3. ודאו שהדלת נפתחת ונסגרת בחופשיות ללא חיכוך.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142042.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313142055.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142105.png`
  },
  { 
    id: 'ks0085_step_9', 
    title: 'הרכבה - שלב 9: דופן ימנית והתקנת חיישן גז ועשן MQ-2', 
    partsNeeded: ['חיישן גז ועשן MQ-2 Gas Sensor', 'לוח עץ דופן ימנית', 'ברגי M3 ואומים'], 
    instructions: [
      '1. מקמו את חיישן הגז MQ-2 בפתח הייעודי (מיקום ⑩) בדופן העץ הימנית.',
      '2. הבריגו את חיישן הגז בעזרת ברגי M3*10mm ואומים.',
      '3. ודאו שפתח הגילוי פונה כלפי פנים הבית.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142233.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313142246.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142259.png`
  },
  { 
    id: 'ks0085_step_10', 
    title: 'הרכבה - שלב 10: דופן שמאלית והתקנת חיישן תנועה PIR', 
    partsNeeded: ['חיישן תנועה PIR Motion Sensor', 'לוח עץ דופן שמאלית', 'ברגי M3'], 
    instructions: [
      '1. מקמו את חיישן התנועה PIR בפתח המעוגל בדופן העץ השמאלית (מיקום ⑤).',
      '2. הדקו את החיישן בעזרת ברגי M3*10mm ואומים.',
      '3. ודאו שהכיפה הלבנה של החיישן בולטת כלפי חוץ לזיהוי תנועה מקסימלי.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142331.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313142341.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142358.png`
  },
  { 
    id: 'ks0085_step_11', 
    title: 'הרכבה - שלב 11: התקנת זמזם פסיבי ומודול LED צהוב', 
    partsNeeded: ['זמזם פסיבי Passive Buzzer', 'מודול נורת LED צהובה', 'ברגי M3 ואומים'], 
    instructions: [
      '1. חברו את הזמזם הפסיבי במיקום ⑯ בעזרת ברגי M3.',
      '2. חברו את מודול ה-LED הצהוב במיקום ⑫.',
      '3. הדקו את כל האומים בצורה יציבה.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142427.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313142437.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142450.png`
  },
  { 
    id: 'ks0085_step_12', 
    title: 'הרכבה - שלב 12: התקנת מודול Bluetooth על לוח ההרחבה', 
    partsNeeded: ['מודול Bluetooth HC-06', 'לוח הרחבה V5 Sensor Shield'], 
    instructions: [
      '1. זהו את מודול ה-Bluetooth ואת לוח ההרחבה V5 Sensor Shield.',
      '2. חברו את הפינים של מודול ה-Bluetooth לשקע הייעודי בלוח ההרחבה: VCC ל-5V, GND ל-GND, TXD ל-RXD, ו-RXD ל-TXD.',
      '3. ודאו שהמודול מהודק היטב לשקע.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142514.png`,
    assemblyImg: `${KS0085_IMG_BASE}image-20250417105441840.png`,
    prototypeImg: `${KS0085_IMG_BASE}image-20250417105526047.png`
  },
  { 
    id: 'ks0085_step_13', 
    title: 'הרכבה - שלב 13: התקנת מודול מאוורר ומנוע DC', 
    partsNeeded: ['מודול מנוע מאוורר Fan Module', 'להב מאוורר אדום', 'ברגי M3'], 
    instructions: [
      '1. הרכיבו את מודול מנוע המאוורר בחלון הייעודי (מיקום ⑮) בדופן העץ.',
      '2. הדקו בעזרת ברגי M3 ואומים.',
      '3. הלבישו את להב המאוורר האדום על גבי ציר המנוע.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142748.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313142804.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142814.png`
  },
  { 
    id: 'ks0085_step_14', 
    title: 'הרכבה - שלב 14: התקנת מודול ממסר (Relay)', 
    partsNeeded: ['מודול ממסר Relay Module x1', 'ברגי M3*10mm ואומים'], 
    instructions: [
      '1. מקמו את מודול הממסר במיקום ⑥ על גבי לוח העץ.',
      '2. הבריגו בעזרת 2 ברגי M3*10mm ואומים.',
      '3. ודאו שהמחברים הפתוחים פונים לכיוון מרכז הבית לחיווט קל.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313153056.jpg`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313153128.jpg`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313142855.png`
  },
  { 
    id: 'ks0085_step_15', 
    title: 'הרכבה - שלב 15: התקנת מסך תצוגה LCD1602 I2C', 
    partsNeeded: ['מסך תצוגה LCD1602 עם מתאם I2C', 'ברגי M3*10mm ואומים'], 
    instructions: [
      '1. הניחו את מסך ה-LCD1602 מול החלון המלבני הייעודי בדופן (מיקום ②).',
      '2. חברו ב-4 ברגי M3*10mm והדקו ב-4 אומים מהצד הפנימי.',
      '3. ודאו שהמסך ישר ומקביל לדופן הבית.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313142945.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313142959.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143009.png`
  },
  { 
    id: 'ks0085_step_16', 
    title: 'הרכבה - שלב 16: התקנת חיישן אור (Photocell) וחיישן אדים (Steam)', 
    partsNeeded: ['חיישן אור LDR Photocell', 'חיישן אדים וגשם Steam Sensor', 'ברגי M3 ואומים'], 
    instructions: [
      '1. חברו את חיישן האור במיקום ⑭ בברגי M3.',
      '2. חברו את חיישן האדים/גשם במיקום ⑬.',
      '3. הדקו את האומים היטב.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313143115.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313143126.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143135.png`
  },
  { 
    id: 'ks0085_step_17', 
    title: 'הרכבה - שלב 17: התקנת בית סוללות ומחבר מתח', 
    partsNeeded: ['בית סוללות 6x AA x1', 'ברגי M3*8mm ואומים'], 
    instructions: [
      '1. מקמו את בית הסוללות בחלק האחורי של לוח הבסיס לפי השרטוט.',
      '2. הבריגו בעזרת ברגי M3 ואומים.',
      '3. ודאו שכבל ה-DC מגיע בנוחות לשקע המתח בלוח הבקר.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230315153204.jpg`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313143210.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143220.png`
  },
  { 
    id: 'ks0085_step_18', 
    title: 'הרכבה - שלב 18: הרכבת לוח ההרחבה על גבי ה-Arduino', 
    partsNeeded: ['לוח הרחבה V5 Sensor Shield'], 
    instructions: [
      '1. ישרו את פיני לוח ההרחבה V5 מעל לוח ה-PLUS Mainboard (Arduino).',
      '2. לחצו בעדינות ובאופן שווה עד שכל הפינים נכנסים במלואם לשקעי ה-Arduino.',
      '3. ודאו שאין פינים שהתעקמו או נשארו בחוץ.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313143242.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313143253.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143303.png`
  },
  { 
    id: 'ks0085_step_19', 
    title: 'הרכבה - שלב 19: חיבור קירות הבית לשלדה הסופית', 
    partsNeeded: ['דפנות הבית המורכבות', 'ברגי M4*8mm ואומים'], 
    instructions: [
      '1. העמידו את כל דפנות הבית המורכבות ושילבו את חריצי העץ יחד.',
      '2. חזקו בברגי M4*8mm ואומי M4 בכל נקודות הממשק.',
      '3. ודאו שהמבנה כולו יציב ומרובע.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313143329.png`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313143340.png`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313143350.png`
  },
  { 
    id: 'ks0085_step_20', 
    title: 'הרכבה - שלב 20: התקנת גג הבית והשלמת המבנה', 
    partsNeeded: ['לוחות גג עץ x2', 'ברגי M4*8mm ואומים'], 
    instructions: [
      '1. הניחו את לוחות הגג מעל קורות הגג המשופעות.',
      '2. חברו בברגי M4*8mm ואומים לקבלת גג סגור ומדויק.',
      '3. מבנה הבית החכם Keyestudio KS0085 הושלם בהצלחה! כעת עברו לשלב החיווט.'
    ], 
    partsImg: `${KS0085_IMG_BASE}img-20230313145918.jpg`,
    assemblyImg: `${KS0085_IMG_BASE}img-20230313145929.jpg`,
    prototypeImg: `${KS0085_IMG_BASE}img-20230313145650.png`
  },
  {
    id: 'ks0085_step_wiring',
    title: 'מדריך חיווט מלא של כל הרכיבים ללוח ההרחבה (Arduino KS0085)',
    instructions: [
      '1. עקבו צעד-אחר-צעד אחר 16 חיבורי החיווט המפורטים מטה.',
      '2. ודאו שכל כבל 3 פינים מחובר נכון: G (שחור/חום ל-GND), V (אדום ל-VCC), ו-S (אות צהוב/כתום/לבן לפין הבקרה).',
      '3. בסיום חברו את כבל הסוללות להפעלת המערכת!'
    ],
    wiringList: KS0085_WIRING_LIST
  }
];

export const SMART_HOME_KS0085_CHAPTERS = [
  { 
    id: 'ch1_ks0085', 
    title: '🛠️ פרק 1: הרכבה מכאנית וזיווד מלא (Keyestudio KS0085)', 
    description: 'מדריך הרכבה שלם צעד-אחר-צעד לפי 20 שלבי הבנייה הרשמיים של ערכת הבית החכם KS0085 לארדואינו', 
    lessons: SMART_HOME_KS0085_ASSEMBLY_ALL 
  },
  { 
    id: 'ch2_ks0085', 
    title: '🔌 פרק 2: מדריך חיווט מפורט של כל 14 החיישנים והמודולים', 
    description: 'חיווט מסודר ללוח ההרחבה V5 Shield עבור חיישני הגז, התנועה, האור, האדים, המאוורר, הסרוו והמסך', 
    lessons: [
      SMART_HOME_KS0085_ASSEMBLY_ALL[SMART_HOME_KS0085_ASSEMBLY_ALL.length - 1]
    ]
  }
];
