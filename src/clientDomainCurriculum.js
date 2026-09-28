/**
 * 🌐 CLIENT-SIDE MULTI-AGENT ENGINE & FALLBACK CURRICULUM
 * Provides domain configuration, smart instant fallback curriculum generation,
 * themes, and local storage caching for offline/cold-start resilience.
 */

export const DOMAIN_OPTIONS = [
  {
    id: 'robotics',
    title: 'רובוטיקה, חומרה ו-IoT',
    englishTitle: 'Robotics & Hardware',
    icon: '🤖',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    bg: '#eff6ff',
    badge: 'ESP32 • Arduino • CAD • C++',
    description: 'מסלול משולב לחומרה, זרועות רובוטיות, רכבים חכמים ו-IoT. כולל שלבי הרכבה CAD מפורטים, שרטוטי חיווט וקוד C++ מלא.',
    tags: ['ESP32 / Arduino', 'חיישנים ומנועי סרוו', 'הרכבה מכאנית שלב-אחר-שלב', 'משימות קוד C++'],
    defaultChapters: [
      { id: 'ch1', title: 'פרק 1: הרכבה מכאנית וזיווד מפורט (שלבי CAD)', type: 'assembly', prompt: 'משוך את כל תמונות ה-CAD ברצף שלב אחר שלב, צור הוראות הרכבה מפורטות ומגוונות ורשימת ברגים מדויקת.' },
      { id: 'ch2', title: 'פרק 2: תכנות מונחה עצמים, כיול מנועים וחיישנים', type: 'coding', prompt: 'צור לפחות 10 שיעורי תכנות מודולריים ומשימות קוד עם בלוקים נדרשים וקוד C++ מלא.' },
      { id: 'ch3', title: 'פרק 3: פרויקטים אוטונומיים ואפליקציות מתקדמות', type: 'autonomous', prompt: 'שלב שגרות הפעלה מלאות, שליטה חכמה ופרויקט גמר פועל.' }
    ]
  },
  {
    id: 'software',
    title: 'תוכנה, קוד ובינה מלאכותית',
    englishTitle: 'Software & AI',
    icon: '💻',
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    bg: '#eef2ff',
    badge: 'Python • Web • C++ • AI',
    description: 'מסלול פיתוח תוכנה מודרני: אתרים אינטראקטיביים, בוטים, אלגוריתמיקה ואוטומציה ללא צורך בחומרה פיזית.',
    tags: ['Python / JavaScript / C++', 'אתגרי אלגוריתמיקה', 'ממשק משתמש ו-Web', 'פרויקט גמר פועל'],
    defaultChapters: [
      { id: 'ch1', title: 'פרק 1: ארכיטקטורה, הגדרת סביבה ויסודות השפה', type: 'syntax', prompt: 'הסבר תחביר בסיסי, פקודות ראשונות והרצת קוד ראשוני.' },
      { id: 'ch2', title: 'פרק 2: פונקציות ליבה, אלגוריתמיקה ומבני נתונים', type: 'coding', prompt: 'משימות תכנות אינטראקטיביות, מניפולציית נתונים וקוד פתרון מלא.' },
      { id: 'ch3', title: 'פרק 3: פרויקט גמר ואפליקציה אינטראקטיבית', type: 'autonomous', prompt: 'בניית פרויקט מעשי שלם המשלב את כל הידע שנרכש.' }
    ]
  },
  {
    id: 'science',
    title: 'מדעים, חלל ופיזיקה',
    englishTitle: 'Science & Deep Tech',
    icon: '🔬',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    bg: '#f0f9ff',
    badge: 'חלל • פיזיקה • ניסויים ומעבדה',
    description: 'מסלול חקר מדעי מעמיק המבוסס על המתודה המדעית: ניסוח שאלת חקר, השערה, ניסויי מעבדה מודרכים וניתוח ממצאים.',
    tags: ['שאלות חקר והשערות', 'מעבדת ניסויים ביתית/בית ספרית', 'מדידות ועיבוד נתונים', 'תגליות מדעיות מרתקות'],
    defaultChapters: [
      { id: 'ch1', title: 'פרק 1: שאלת המחקר, רקע מדעי ותצפיות ראשוניות', type: 'science', prompt: 'הגדר את תופעת הטבע, שאלת החקר והשערה מדעית מנומקת.' },
      { id: 'ch2', title: 'פרק 2: מעבדת ניסויים מעשית, מדידות ואיסוף נתונים', type: 'science', prompt: 'מערך ניסוי מבוקר, טבלת מדידות ובידוד משתנים.' },
      { id: 'ch3', title: 'פרק 3: הסקת מסקנות, ניתוח ממצאים ומחקר עתידי', type: 'science', prompt: 'ניתוח גרפי, אימות מול ההשערה והשלכות לעולם האמיתי.' }
    ]
  },
  {
    id: 'business',
    title: 'יזמות, עסקים וסטארט-אפים',
    englishTitle: 'Entrepreneurship & Innovation',
    icon: '💼',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    bg: '#fffbeb',
    badge: 'Lean Canvas • Pitch • שיווק ומכירות',
    description: 'מסלול מנטורינג ליזמים צעירים: מזיהוי בעיה והצעת ערך, דרך מודל עסקי Lean Canvas, תמחור ועד לבניית מצגת משקיעים מנצחת.',
    tags: ['הגדרת ערך וכאב לקוח', 'Lean Canvas מלא', 'אסטרטגיית שיווק ותמחור', 'מצגת משקיעים (Pitch Deck)'],
    defaultChapters: [
      { id: 'ch1', title: 'פרק 1: זיהוי בעיה, מחקר שוק והצעת ערך ייחודית', type: 'business', prompt: 'מיפוי כאבי לקוח, מתחרים והצעת ערך מנצחת.' },
      { id: 'ch2', title: 'פרק 2: מודל עסקי Lean Canvas, תמחור ויחידות כלכליות', type: 'business', prompt: 'קנבס מודל עסקי, ערוצי הפצה ומבנה הכנסות.' },
      { id: 'ch3', title: 'פרק 3: חדירה לשוק, מצגת משקיעים (Pitch) וגיוס לקוחות', type: 'business', prompt: 'מצגת 10 שקפים, פיץ 60 שניות והשקה ראשונית.' }
    ]
  },
  {
    id: 'design',
    title: 'עיצוב גרפי, מיתוג ו-UX',
    englishTitle: 'Creative Design & Branding',
    icon: '🎨',
    color: '#db2777',
    gradient: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
    bg: '#fdf2f8',
    badge: 'Moodboard • לוגו • UI/UX • פלטות HEX',
    description: 'מסלול קריאייטיב ויזואלי: בניית לוח השראה, תורת הצבעים, טיפוגרפיה, עיצוב לוגו, מסכי ממשק UI/UX והפקת Mockups לתיק עבודות.',
    tags: ['לוחות השראה (Moodboard)', 'תורת הצבעים ו-HEX', 'עיצוב ממשק משתמש (UI/UX)', 'תיק עבודות והדמיות'],
    defaultChapters: [
      { id: 'ch1', title: 'פרק 1: קונספט ויזואלי, לוח השראה (Moodboard) ושפת מותג', type: 'design', prompt: 'פיתוח זהות מותג, סקיצות לוגו ופלטת צבעים.' },
      { id: 'ch2', title: 'פרק 2: עיצוב ממשק משתמש (UI/UX) ומערכת עיצוב', type: 'design', prompt: 'תכנון Wireframes, חוקי קומפוזיציה ו-Design System.' },
      { id: 'ch3', title: 'פרק 3: עיצוב נכסים דיגיטליים, Mockups ותיק עבודות', type: 'design', prompt: 'הדמיות תלת-ממדיות, באנרים להשקה וספר מותג.' }
    ]
  },
  {
    id: 'polymath',
    title: 'נושא חופשי / כל תחום שתרצה',
    englishTitle: 'Universal Topic',
    icon: '🌍',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    bg: '#faf5ff',
    badge: 'רב-תחומי • ידע כללי • פרויקט עצמאי',
    description: 'כתוב כל נושא בעולם - היסטוריה, מוזיקה, ספורט, קולינריה, פילוסופיה או מיומנות אישית, והסוכן הרב-תחומי יבנה עבורך קורס חווייתי מעשי.',
    tags: ['גמישות מוחלטת לכל נושא', 'שילוב עיוני ומעשי', 'משימות פעולה שלב-אחר-שלב', 'פרויקט גמר אישי'],
    defaultChapters: [
      { id: 'ch1', title: 'פרק 1: מבוא, מושגי יסוד ומיפוי עולם הנושא', type: 'action', prompt: 'היכרות עם הנושא, מושגי מפתח וחשיבות בעולם המודרני.' },
      { id: 'ch2', title: 'פרק 2: יישום מעשי, פיתוח מיומנויות ואתגרי עשייה', type: 'action', prompt: 'התנסות מעשית מודרכת שלב-אחר-שלב.' },
      { id: 'ch3', title: 'פרק 3: פרויקט גמר יישומי, סיכום והצגה לעולם', type: 'action', prompt: 'ליטוש תוצר סופי שלם והצגת ההישגים.' }
    ]
  }
];

export const SCIENCE_FIELDS = [
  'חלל, אסטרונומיה ומערכת השמש',
  'פיזיקה קלאסית: כוחות ותנועה',
  'אלקטרומגנטיות וגלים',
  'כימיה וחומרים מיוחדים',
  'ביולוגיה, גנטיקה ותאים',
  'אנרגיה מתחדשת וקיימות',
  'אופטיקה ואור',
  'מדעי המוח וקוגניציה'
];

export const SCIENCE_MATERIALS = [
  'מחברת תצפיות ומדידה',
  'כלי מדידה ומאזניים',
  'חיישני מדידה וטמפרטורה',
  'שעון עצר וסטופר',
  'מקור אור ומנסרה',
  'ציוד מעבדה ביתי נגיש',
  'גיליון עיבוד נתונים (Sheets)',
  'משקפי מגן'
];

export const BUSINESS_VERTICALS = [
  'B2B SaaS (תוכנה לארגונים)',
  'E-Commerce ומסחר אלקטרוני',
  'FinTech ופיננסים חכמים',
  'EdTech וטכנולוגיות למידה',
  'HealthTech ואיכות חיים',
  'בינה מלאכותית ואוטומציה (AI)',
  'קיימות ועסקים ירוקים (CleanTech)',
  'אפליקציות צרכניות (B2C)'
];

export const BUSINESS_DELIVERABLES = [
  'הגדרת הצעת ערך (Value Proposition)',
  'מודל עסקי Lean Canvas שלם',
  'ניתוח מתחרים ובידול שוק',
  'אסטרטגיית תמחור ומודל הכנסות',
  'חישוב CAC ו-LTV ראשוני',
  'אסטרטגיית Go-To-Market ושיווק',
  'מצגת משקיעים (Pitch Deck) של 10 שקפים',
  'Elevator Pitch של 60 שניות'
];

export const DESIGN_DISCIPLINES = [
  'זהות מותג ושפה ויזואלית',
  'עיצוב ממשק משתמש (UI/UX)',
  'טיפוגרפיה ותורת הצבעים',
  'עיצוב לוגו וסמלילים וקטוריים',
  'נכסי סושיאל ומדיה דיגיטלית',
  'איור דיגיטלי ואייקונים',
  'הדמיות מוצר ו-Mockups',
  'עיצוב אתרים רספונסיביים'
];

export const DESIGN_DELIVERABLES = [
  'לוח השראה (Moodboard) מעוצב',
  'פלטת צבעי HEX מאוזנת (60-30-10)',
  'ספר מותג וגופנים מותאמים',
  'סקיצות ועיצוב לוגו סופי',
  'Wireframes של מסכי האפליקציה',
  'Design System: כפתורים ורכיבים',
  'הדמיות מוקאפ בתוך מכשירים',
  'באנר השקה ופוסטים לרשתות'
];

export const POLYMATH_STYLES = [
  'למידה מבוססת פרויקט מעשי (PBL)',
  'מחקר עיוני ומעשי משולב',
  'אתגר התנסות יומי מודרך',
  'תרגול מיומנות אישית',
  'בניית תיק תוצרים אישי'
];

/**
 * Builds rich instant curriculum for any domain on client
 */
export function buildClientCurriculum(domainKey = 'polymath', params = {}) {
  const {
    title = '',
    targetBoard = 'esp32',
    softwareStack = 'python',
    components = [],
    customChapters = [],
    availableImages = []
  } = params;

  const trackTitle = (title || 'פרויקט למידה אישי').trim();
  const trackId = `track_${Date.now()}`;
  const domainInfo = DOMAIN_OPTIONS.find(d => d.id === domainKey) || DOMAIN_OPTIONS[5];

  let chapters = [];

  switch (domainKey) {
    case 'science':
      chapters = [
        {
          id: 'ch1',
          title: customChapters[0]?.title || `פרק 1: שאלת המחקר, רקע תיאורטי ותצפיות ב-${trackTitle}`,
          lessons: [
            {
              id: '1.1',
              title: `שיעור 1.1: תופעת הטבע והרקע המדעי של ${trackTitle}`,
              goal: 'הבנת העקרונות המדעיים והפיזיקליים העומדים בבסיס הנושא.',
              isExperimentStep: true,
              hypothesis: 'כיצד שינוי התנאים המרכזיים ישפיע על התוצאה המדעית הנצפית?',
              materials: ['מחברת תצפיות ומדידה', 'כלי מדידה בסיסי', 'גישה למקורות מידע מדעיים'],
              instructions: [
                `חקור את המושגים התיאורטיים המובילים ב-${trackTitle}.`,
                'זהה את המשתנה הבלתי תלוי ואת המשתנה התלוי בשאלת המחקר.',
                'נסח השערה מדעית ברורה ומנומקת על פי מודל מדעי מוכח.'
              ],
              keyTakeaways: 'הבנה עמוקה של התופעה, שאלת חקר מוגדרת והשערה ברורה לבדיקה.'
            },
            {
              id: '1.2',
              title: 'שיעור 1.2: איסוף נתונים ראשוני ומיפוי גורמים משפיעים',
              goal: 'ביצוע מדידות ראשוניות ורישום תצפיות כבסיס לניסוי.',
              isExperimentStep: true,
              hypothesis: 'איסוף נתונים בתנאי בקרה יאפשר לאמת או להפריך את השערת המחקר.',
              materials: ['טבלת איסוף נתונים', 'חיישן או מכשיר מדידה', 'כרונומטר / שעון עצר'],
              instructions: [
                'מדוד ובצע 3 חזרות לפחות כדי להבטיח מהימנות מדעית.',
                'רשום את התוצאות בטבלה מסודרת כולל יחידות מידה מדויקות.',
                'בודד משתנים מתערבים כדי למנוע הטיות בתוצאה.'
              ],
              keyTakeaways: 'מדידה מדעית מדויקת, תיעוד נתונים אמין ובידוד משתנים.'
            }
          ]
        },
        {
          id: 'ch2',
          title: customChapters[1]?.title || 'פרק 2: מעבדת ניסויים מעשית, איסוף מדדים וביצוע מדידות',
          lessons: [
            {
              id: '2.1',
              title: 'שיעור 2.1: מערך הניסוי המרכזי והרצת בדיקות',
              goal: 'הפעלת מערך הניסוי המלא ובדיקת ההשערה בתנאים מבוקרים.',
              isExperimentStep: true,
              hypothesis: 'הפעלת מערך הניסוי תחשוף קשר מובהק בין המשתנים.',
              materials: ['מערך ניסוי מלא', 'משקפי מגן וכפפות', 'לוח רישום נתונים'],
              instructions: [
                'הכן את ציוד הניסוי בהתאם להנחיות הבטיחות.',
                'הפעל את המערכת ובצע הרצה בתנאי ביקורת (קבוצת ביקורת).',
                'הפעל את קבוצת הניסוי, שנה את המשתנה הבלתי תלוי ותעד בזמן אמת.'
              ],
              keyTakeaways: 'ביצוע ניסוי מדעי מבוקר, הקפדה על נהלי בטיחות ואיסוף נתונים שיטתי.'
            },
            {
              id: '2.2',
              title: 'שיעור 2.2: עיבוד סטטיסטי וגרפי של הנתונים',
              goal: 'ניתוח הממצאים באמצעות גרפים, חישובי ממוצעים וסטיות תקן.',
              isExperimentStep: true,
              materials: ['גיליון נתונים (Excel / Google Sheets)', 'מחשבון גרפי'],
              instructions: [
                'הזן את נתוני המדידות לגיליון האלקטרוני.',
                'חשב ערכי ממוצע, סטיית תקן ושגיאת מדידה לכל סדרת בדיקות.',
                'הפק גרף פיזור או גרף עמודות מתאים הממחיש את המגמה המדעית.'
              ],
              keyTakeaways: 'ניתוח נתונים כמותי, ויזואליזציה של תוצאות והבנת מובהקות סטטיסטית.'
            }
          ]
        },
        {
          id: 'ch3',
          title: customChapters[2]?.title || 'פרק 3: מסקנות מדעיות, השלכות טכנולוגיות ומחקר עתידי',
          lessons: [
            {
              id: '3.1',
              title: `שיעור 3.1: ניסוח מסקנות ואימות מול הקהילה המדעית ב-${trackTitle}`,
              goal: 'הסקת מסקנות מוצקות והצגת התוצרים כמאמר מדעי / פוסטר מחקרי.',
              isExperimentStep: true,
              instructions: [
                'השווה בין ההשערה המקורית לבין הממצאים שהתקבלו בפועל.',
                'הסבר תופעות חריגות ומגבלות של מערך הניסוי הנוכחי.',
                'הצג הצעות לפיתוח עתידי, טכנולוגיות פורצות דרך ויישום בעולם האמיתי.'
              ],
              keyTakeaways: 'חשיבה ביקורתית, עמידה בסטנדרטים של מחקר מדעי והצגת ממצאים מקצועית.'
            }
          ]
        }
      ];
      break;

    case 'business':
      chapters = [
        {
          id: 'ch1',
          title: customChapters[0]?.title || `פרק 1: זיהוי בעיה, מחקר שוק והצעת ערך ייחודית ל-${trackTitle}`,
          lessons: [
            {
              id: '1.1',
              title: `שיעור 1.1: הגדרת הבעיה והצעת הערך (Value Proposition)`,
              goal: 'הגדרת הכאב המרכזי של הלקוח וניסוח הצעת ערך בלתי ניתנת לסירוב.',
              isBusinessMission: true,
              targetAudience: 'לקוחות קצה, משתמשים פוטנציאליים ומקבלי החלטות בארגונים.',
              instructions: [
                `מפה את 3 הכאבים המרכזיים שהמיזם של ${trackTitle} פותר.`,
                'ראיין 3 אנשים מקהל היעד ובדוק האם הם מוכנים לשלם על פתרון.',
                'נסח משפט הצעת ערך מנצח: "אנו עוזרים ל-[קהל יעד] להשיג [תוצאה] ללא [כאב מרכזי]".'
              ],
              mentorTip: 'אל תתאהב בפתרון שלך - תתאהב בבעיה של הלקוח שלך.'
            },
            {
              id: '1.2',
              title: 'שיעור 1.2: ניתוח מתחרים ויתרון תחרותי לא הוגן (Unfair Advantage)',
              goal: 'מיפוי מפת השוק ובניית בידול מובהק מול שחקנים קיימים.',
              isBusinessMission: true,
              instructions: [
                'בחר 3 מתחרים ישירים ו-2 מתחרים עקיפים בתחום.',
                'בנה מטריצת השוואה: מחיר, חוויית משתמש, מהירות ופיצ\'רים ייחודיים.',
                'הגדר את היתרון הבלעדי שלך: טכנולוגיה ייחודית, מומחיות, או קהילה נאמנה.'
              ],
              mentorTip: 'בידול אמיתי נמדד במה שאתה בוחר במפורש לא לעשות.'
            }
          ]
        },
        {
          id: 'ch2',
          title: customChapters[1]?.title || 'פרק 2: מודל עסקי Lean Canvas, תמחור ויחידות כלכליות',
          lessons: [
            {
              id: '2.1',
              title: 'שיעור 2.1: מילוי קנבס מודל עסקי (Lean Canvas מלא)',
              goal: 'הפיכת הרעיון לתוכנית עסקית בת עמוד אחד המתארת את כל רכיבי המיזם.',
              isBusinessMission: true,
              instructions: [
                'הגדר את פלחי הלקוחות (Early Adopters).',
                'קבע את ערוצי ההפצה והשיווק (Inbound & Outbound Channels).',
                'הגדר את מבנה העלויות הקבועות והמשתנות ואת זרמי ההכנסות.'
              ],
              mentorTip: 'Lean Canvas הוא מסמך חי שמתעדכן אחרי כל מפגש עם לקוח אמיתי.'
            },
            {
              id: '2.2',
              title: 'שיעור 2.2: אסטרטגיית תמחור, CAC ו-LTV',
              goal: 'חישוב עלות גיוס לקוח מול הערך של הלקוח לאורך זמן.',
              isBusinessMission: true,
              instructions: [
                'בחר מודל תמחור: מנוי חודשי (SaaS), תשלום פר שימוש, או חד-פעמי.',
                'הערך את ה-CAC (עלות גיוס לקוח) המשוערת בערוצי השיווק הנבחרים.',
                'וודא כי ה-LTV גבוה לפחות פי 3 מה-CAC כדי להבטיח רווחיות בריאה.'
              ],
              mentorTip: 'רוב הסטארטאפים מתמחרים נמוך מדי מתוך פחד. תמחר לפי הערך, לא לפי העלות.'
            }
          ]
        },
        {
          id: 'ch3',
          title: customChapters[2]?.title || 'פרק 3: חדירה לשוק (Go-To-Market), מצגת משקיעים וגיוס לקוחות',
          lessons: [
            {
              id: '3.1',
              title: 'שיעור 3.1: בניית מצגת משקיעים (Pitch Deck) מנצחת ב-10 שקפים',
              goal: 'יצירת סיפור יזמי משכנע המגייס משקיעים, שותפים ולקוחות ראשונים.',
              isBusinessMission: true,
              instructions: [
                'בנה את 10 שקפי הליבה: בעיה, פתרון, גודל שוק, מודל עסקי, משיכה, צוות ו-Ask.',
                'תרגל פיץ\' קצר של 60 שניות (Elevator Pitch) מול מראה או עמיתים.',
                'בצע השקה ראשונית ל-100 המשתמשים הראשונים וקבל פידבק אמיתי.'
              ],
              mentorTip: 'משקיעים משקיעים באנשים, באנרגיה ובמהירות הלמידה שלהם, לא רק ברעיון.'
            }
          ]
        }
      ];
      break;

    case 'design':
      chapters = [
        {
          id: 'ch1',
          title: customChapters[0]?.title || `פרק 1: קונספט ויזואלי, לוח השראה (Moodboard) ושפת מותג ב-${trackTitle}`,
          lessons: [
            {
              id: '1.1',
              title: `שיעור 1.1: גיבוש זהות מותג ולוח השראה (Moodboard)`,
              goal: 'יצירת קונספט עיצובי כולל אווירה, טיפוגרפיה ורגשות שהמותג מעביר.',
              isDesignChallenge: true,
              recommendedHex: ['#0f172a', '#3b82f6', '#ec4899', '#f8fafc'],
              instructions: [
                `אסוף 10 דימויים ויזואליים המבטאים את האנרגיה של ${trackTitle}.`,
                'בחר 2 משפחות גופנים (כותרות וטקסט רץ) המשתלבות בהרמוניה.',
                'הגדר את פלטת הצבעים: צבע ראשי, צבע משני, צבע רקע וצבע הדגשה (Accent).'
              ],
              designerTip: 'השתמש בחוק ה-60-30-10: 60% צבע רקע ניטרלי, 30% צבע משלים, 10% צבע פוקוס בולט.'
            },
            {
              id: '1.2',
              title: 'שיעור 1.2: עיצוב לוגו, סמליל ואייקונים וקטוריים',
              goal: 'יצירת סמליל מובחן שעובד היטב בכל גודל (מפביקון ועד שלט חוצות).',
              isDesignChallenge: true,
              instructions: [
                'שרטט 5 סקיצות מהירות של לוגו בעיפרון ודף לפני מעבר למחשב.',
                'העבר את הסקיצה הנבחרת לכלי וקטורי (Figma / Illustrator).',
                'בדוק נראות של הלוגו בגרסת שחור-לבן, רקע כהה ורקע בהיר.'
              ],
              designerTip: 'לוגו טוב הוא לוגו שניתן לצייר מהזיכרון על מפית תוך 5 שניות.'
            }
          ]
        },
        {
          id: 'ch2',
          title: customChapters[1]?.title || 'פרק 2: עיצוב ממשק משתמש (UI/UX) ומערכת עיצוב (Design System)',
          lessons: [
            {
              id: '2.1',
              title: 'שיעור 2.1: תכנון Wireframes וחוויית משתמש (UX)',
              goal: 'מיפוי מסכי המשתמש, היררכיה חזותית וזרימת פעולות אינטואיטיבית.',
              isDesignChallenge: true,
              instructions: [
                'שרטט את מבנה המסך הראשי: Header, Hero, תוכן מרכזי ו-Footer.',
                'וודא ריווחים קבועים (Grid של 8 פיקסלים) לשמירה על סדר עין.',
                'הגדר לחצני Call to Action ברורים שלא מתחרים זה בזה.'
              ],
              designerTip: 'אם המשתמש צריך לחשוב איפה ללחוץ, ה-UX נכשל. פשטות היא המפתח.'
            },
            {
              id: '2.2',
              title: 'שיעור 2.2: יצירת Design System - כפתורים, שדות קלט וכרטיסים',
              goal: 'בניית ספריית רכיבים אחידה ומודולרית שתשמש את כל הממשק.',
              isDesignChallenge: true,
              instructions: [
                'עצב 3 מצבים לכל כפתור: Default, Hover ו-Active.',
                'הגדר רמות צל (Shadows) ועגלגלות פינות (Border Radius) אחידות.',
                'בדוק ניגודיות צבעים (Accessibility Contrast) לפי תקן WCAG AA.'
              ],
              designerTip: 'עקביות ויזואלית בונה אמון ומקצועיות אצל המשתמש תוך שניות.'
            }
          ]
        },
        {
          id: 'ch3',
          title: customChapters[2]?.title || 'פרק 3: עיצוב נכסים דיגיטליים, הדמיית מוקאפ ותיק עבודות',
          lessons: [
            {
              id: '3.1',
              title: 'שיעור 3.1: הפקת Mockups תלת-ממדיים והצגה לתיק עבודות',
              goal: 'הטמעת העיצובים בתוך מכשירים אמיתיים (טלפונים, מחשבים) להצגה מרשימה.',
              isDesignChallenge: true,
              instructions: [
                'בחר Mockup מקצועי המציג את המוצר בסביבה טבעית.',
                'עצב פוסט סושיאל ובאנר השקה הכוללים את השפה הוויזואלית החדשה.',
                'ייצא את כל הנכסים בפורמטים המתאימים (SVG, WebP, PNG באיכות גבוהה).'
              ],
              designerTip: 'תיק עבודות חזק מציג לא רק את התוצאה הסופית, אלא את תהליך החשיבה שהוביל אליה.'
            }
          ]
        }
      ];
      break;

    case 'software':
      const lang = softwareStack.toUpperCase();
      chapters = [
        {
          id: 'ch1',
          title: customChapters[0]?.title || `פרק 1: ארכיטקטורה, הגדרת סביבה ומבני נתונים ב-${lang}`,
          lessons: [
            {
              id: '1.1',
              title: `שיעור 1.1: תכנון ארכיטקטורת המערכת והגדרת הפרויקט ב-${lang}`,
              goal: 'הקמת שלד הפרויקט, חלוקה למודולים וכתיבת קוד ראשוני.',
              isCodingMission: true,
              neededBlocks: ['קלט נתונים', 'פונקציה ראשית', 'הדפסה לקונסול'],
              codeTemplate: `// שלד פרויקט ב-${lang}\nfunction initApp() {\n  console.log("Starting ${trackTitle}...");\n}\ninitApp();`,
              code: `function initApp() {\n  console.log("Ready!");\n}\ninitApp();`,
              instructions: [
                'פתח את סביבת הפיתוח והגדר את קובצי הפרויקט המרכזיים.',
                'הגדר את מבני הנתונים הראשיים שיחזיקו את מצב האפליקציה.',
                'הרץ בדיקת תקשורת וודא שאין שגיאות קומפילציה או הרצה.'
              ]
            },
            {
              id: '1.2',
              title: 'שיעור 1.2: מודל נתונים, פונקציות ליבה וטיפול בשגיאות',
              goal: 'בניית פונקציות העיבוד והבטחת קוד עמיד בפני קלטים לא תקינים.',
              isCodingMission: true,
              neededBlocks: ['תנאים ולוגיקה', 'לולאות עיבוד', 'טיפול בשגיאות try/catch'],
              codeTemplate: `function processData(items) {\n  if (!Array.isArray(items)) throw new Error("Invalid input");\n  return items.map(item => ({ ...item, processed: true }));\n}`,
              code: `function processData(items) {\n  return items;\n}`,
              instructions: [
                'כתוב פונקציות טהורות (Pure Functions) לחישוב ולוגיקה.',
                'הוסף מנגנון אימות לקלט המשתמש.',
                'טפל במקרי קצה ובשגיאות בלתי צפויות.'
              ]
            }
          ]
        },
        {
          id: 'ch2',
          title: customChapters[1]?.title || 'פרק 2: אינטגרציות, APIs ולוגיקה מתקדמת',
          lessons: [
            {
              id: '2.1',
              title: 'שיעור 2.1: משיכת נתונים מ-API חיצוני וסנכרון אסינכרוני',
              goal: 'שילוב בקשות HTTP אסינכרוניות ועדכון הממשק בזמן אמת.',
              isCodingMission: true,
              neededBlocks: ['פונקציה אסינכרונית (async/await)', 'שליחת בקשת Fetch', 'עיבוד תגובת JSON'],
              codeTemplate: `async function fetchData(url) {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}`,
              code: `async function fetchData(url) {\n}`,
              instructions: [
                'בצע קריאת API לקבלת נתונים חיים.',
                'טפל במצבי טעינה (Loading States) ושגיאות רשת.',
                'עדכן את מבנה הנתונים בהתאם למידע שהתקבל.'
              ]
            }
          ]
        },
        {
          id: 'ch3',
          title: customChapters[2]?.title || 'פרק 3: פרויקט גמר, אופטימיזציה ודיפלוי מלא',
          lessons: [
            {
              id: '3.1',
              title: `שיעור 3.1: שילוב כל המודולים לפרויקט ${trackTitle} מלא ופועל`,
              goal: 'בדיקת המערכת מקצה לקצה ופריסה חיה לענן.',
              isCodingMission: true,
              instructions: [
                'הרץ בדיקות יחידה ובדיקות אינטגרציה.',
                'בצע אופטימיזציה לביצועים וניקוי קוד (Refactoring).',
                'העלה את הפרויקט ל-GitHub ובצע דיפלוי פעיל ברשת.'
              ]
            }
          ]
        }
      ];
      break;

    case 'robotics':
      const comps = components.length > 0 ? components : ['מודול ג\'ויסטיק כפול', 'מנוע סרוו SG90', 'חיישן אולטרסוני'];
      const imgs = availableImages;

      const assemblyPhases = [
        { title: 'הכנת משטח הבסיס ולוח השלדה התחתון', parts: ['לוח בסיס אקרילי', '4x רגליות סיליקון'], instructions: ['הנח את לוח הבסיס על משטח ישר.', 'הסר את שכבת המגן.', 'הדבק את רגליות הסיליקון בארבע הפינות.'] },
        { title: 'התקנת תושבת מנוע סרוו ציר תחתון (Base Yaw)', parts: ['מנוע סרוו SG90', 'תושבת מתכת', '2x ברגי M2*10'], instructions: ['הכנס את מנוע הסרוו לחריץ הייעודי.', 'השחל ברגי M2 וחזק עם אומים.', 'וודא כי ציר הסרוו פונה כלפי מעלה בחופשיות.'] },
        { title: 'הרכבת מפרק הזרוע הראשי וזיווד מנועים', parts: ['זרוע אקרילית', 'מנוע סרוו מפרק 2', 'ברגי M3'], instructions: ['חבר את זרוע המפרק לתחתית הציר.', 'חזק באמצעות ברגי M3.', 'וודא תנועה חלקה ללא חיכוך.'] },
        { title: 'חיווט לוח הבקר וחיבור רכיבי האלקטרוניקה', parts: [`לוח ${targetBoard.toUpperCase()}`, 'חוטי גישור זכר-נקבה', ...comps.slice(0, 2)], instructions: ['חבר את כבלי הסרוו והחיישנים לפי דיאגרמת הפינים.', 'וודא שקווי המתח VCC ו-GND מחוברים כראוי.', 'חבר את כבל התקשורת למחשב.'] }
      ];

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

      chapters = [
        {
          id: 'ch1',
          title: customChapters[0]?.title || `פרק 1: הרכבה מכאנית וזיווד מפורט של ${trackTitle}`,
          lessons: assemblyLessons
        },
        {
          id: 'ch2',
          title: customChapters[1]?.title || 'פרק 2: כיול מנועים, קריאת חיישנים ובקרת תנועה ב-C++',
          lessons: [
            {
              id: '2.1',
              title: 'שיעור 2.1: אתחול בקרת סרוו וקריאת פינים אנלוגיים',
              isCodingMission: true,
              goal: 'קריאת נתונים מחיישן/ג\'ויסטיק ושליטה על זווית המנוע.',
              neededBlocks: ['תוכנית ראשית', 'המרת טווח (map)', 'הגדר זווית סרוו'],
              codeTemplate: `#include <ESP32Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  Serial.begin(115200);\n  myServo.attach(18);\n}\n\nvoid loop() {\n  int val = analogRead(34);\n  int angle = map(val, 0, 4095, 0, 180);\n  myServo.write(angle);\n  delay(20);\n}`,
              code: `void setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n}`,
              instructions: [
                'חבר את אות הבקרה של המנוע לפין GPIO 18.',
                'בצע כיול לטווח התנועה מ-0 ועד 180 מעלות.',
                'צפה בנתוני המוניטור הטורי וודא קריאה יציבה.'
              ]
            }
          ]
        },
        {
          id: 'ch3',
          title: customChapters[2]?.title || 'פרק 3: שגרות אוטונומיות חכמות ופרויקט גמר מלא',
          lessons: [
            {
              id: '3.1',
              title: 'שיעור 3.1: שגרת אוטומציה מלאה (Pick & Place / Autonomous Move)',
              isCodingMission: true,
              goal: 'תכנות רצף פעולות עצמאי מלא ללא מגע יד אדם.',
              instructions: [
                'הגדר את נקודות היעד במרחב התנועה.',
                'כתוב פונקציית תנועה הדרגתית המונעת טלטול של הרובוט.',
                'בדוק ביצוע רציף ורשום זמני מחזור מדויקים.'
              ],
              codeTemplate: `void runAutonomousMission() {\n  // רצף פעולות אוטונומי\n}\n\nvoid setup() {}\nvoid loop() {\n  runAutonomousMission();\n}`,
              code: `void setup() {}\nvoid loop() {}`
            }
          ]
        }
      ];
      break;

    case 'polymath':
    default:
      chapters = [
        {
          id: 'ch1',
          title: customChapters[0]?.title || `פרק 1: מבוא, מושגי יסוד ומיפוי עולם ה-${trackTitle}`,
          lessons: [
            {
              id: '1.1',
              title: `שיעור 1.1: היכרות עם ${trackTitle} וחשיבותו בעולם המודרני`,
              goal: 'רכישת ידע יסודי, הבנת מפת הדרכים והגדרת תוצר הלמידה.',
              isActionMission: true,
              instructions: [
                `למד את עקרונות היסוד של ${trackTitle}.`,
                'זהה 3 יישומים מעשיים מוחשיים בתעשייה או בחיי היומיום.',
                'הגדר את פרויקט הגמר האישי שלך ואת יעדי ההצלחה.'
              ],
              keyTakeaways: 'תמונת מבט רחבה, הבנת מושגי מפתח והצבת יעדים ברורים.'
            },
            {
              id: '1.2',
              title: 'שיעור 1.2: כלי עבודה, מיומנויות נדרשות ושיטות פעולה',
              goal: 'הכשרת סביבת העבודה והכלים המקצועיים הנדרשים.',
              isActionMission: true,
              instructions: [
                'הכר את הכלים והפלטפורמות המובילות בתחום זה.',
                'בצע תרגול התנעה ראשוני לבחינת השליטה הבסיסית.',
                'תעד את התובנות הראשונות שלך ביומן הפרויקט.'
              ]
            }
          ]
        },
        {
          id: 'ch2',
          title: customChapters[1]?.title || 'פרק 2: יישום מעשי, פיתוח מיומנויות ואתגרי עשייה',
          lessons: [
            {
              id: '2.1',
              title: 'שיעור 2.1: משימת ביצוע מודרכת שלב-אחר-שלב',
              goal: 'הוצאה לפועל של שלב הביצוע המרכזי והתמודדות עם אתגרים.',
              isActionMission: true,
              instructions: [
                'בצע את משימת השלב שלב-אחר-שלב על פי ההנחיות.',
                'נתח את התוצאות ביחס ליעד שהוגדר מראש.',
                'שפר ודייק את התוצר בהתאם לסטנדרטים מקצועיים.'
              ]
            }
          ]
        },
        {
          id: 'ch3',
          title: customChapters[2]?.title || 'פרק 3: פרויקט גמר יישומי, סיכום והצגה לעולם',
          lessons: [
            {
              id: '3.1',
              title: `שיעור 3.1: ליטוש התוצר הסופי והצגת פרויקט ${trackTitle}`,
              goal: 'בניית תוצר שלם, עצמאי ואיכותי הראוי לשיתוף.',
              isActionMission: true,
              instructions: [
                'אחד את כל חלקי הפרויקט לתוצר שלם ומגובש.',
                'בצע בדיקת איכות סופית (QA) לווידוא שלמות התוצר.',
                'הכן סיכום קצר או סרטון הדגמה המציג את ההישגים שלך.'
              ]
            }
          ]
        }
      ];
      break;
  }

  return {
    id: trackId,
    trackId: trackId,
    title: trackTitle,
    description: `מסלול למידה חווייתי ומעמיק ב${domainInfo.title}, המקנה ידע עיוני ומיומנויות מעשיות לפיתוח ${trackTitle}.`,
    domain: domainKey,
    gradient: domainInfo.gradient,
    glow: `0 8px 32px ${domainInfo.color}40`,
    accentColor: domainInfo.color,
    icon: domainInfo.icon,
    badge: domainInfo.badge,
    badges: [domainInfo.badge, 'מסלול מודרך', 'פרויקט מעשי'],
    welcomePage: {
      welcomeText: `ברוכים הבאים למסלול ${trackTitle}! במסלול זה תתנסו בלמידה מעשית, שלב-אחר-שלב, ותבנו תוצר ממשי.`,
      features: [
        { title: 'למידה חווייתית מודרכת', desc: 'שיעורים קצרים וברורים עם דוגמאות מוחשיות.' },
        { title: 'משימות עשייה מעשיות', desc: 'בכל שיעור משימה מעשית המקדמת אותך לקראת התוצר הסופי.' },
        { title: 'פרויקט גמר יישומי', desc: 'בנייה והצגה של תוצר שלם פרי ידך.' }
      ]
    },
    chapters
  };
}

export function saveTrackLocally(track) {
  if (!track) return;
  try {
    const existing = JSON.parse(localStorage.getItem('smartstart_custom_tracks') || '[]');
    const filtered = existing.filter(t => t.id !== track.id && t.trackId !== track.trackId);
    localStorage.setItem('smartstart_custom_tracks', JSON.stringify([track, ...filtered]));
  } catch (err) {
    console.warn('[LocalStorage] Save track failed:', err);
  }
}
