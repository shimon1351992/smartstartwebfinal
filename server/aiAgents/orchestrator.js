/**
 * 👑 AI MULTI-AGENT ORCHESTRATOR (סוכן-על מנצח ומנהל סוכנים)
 * Coordinates Domain Experts, Styling Agent, and QA Validator.
 * Handles OpenRouter Gemini 3.1 Pro generation with robust JSON repair,
 * and includes a rich, multi-domain heuristic fallback generator.
 */

const axios = require('axios');
const { DOMAINS } = require('./domainAgents');
const { generateThemeForTrack } = require('./stylingAgent');
const { validateAndEnhanceTrack } = require('./qaValidator');

/**
 * Classifies domain from user input if not explicitly provided
 */
function classifyDomain(params = {}) {
  const { domain, domainId, projectType, title = '', prompt = '', softwareStack = '' } = params;

  if (domain && DOMAINS[domain]) return domain;
  if (domainId && DOMAINS[domainId]) return domainId;

  // Direct mapping from legacy projectType
  if (projectType === 'software_only') return 'software';
  if (projectType === 'hardware_software') return 'robotics';

  const combinedText = `${title} ${prompt} ${softwareStack}`.toLowerCase();

  // Science
  if (/מדע|חלל|אסטרונומיה|פיזיקה|כימיה|ביולוגיה|גנטיקה|אקולוגיה|חקר|ניסוי|מעבדה|science|space|physics|chemistry|biology/.test(combinedText)) {
    return 'science';
  }

  // Business & Entrepreneurship
  if (/יזמות|סטארטאפ|סטארט-אפ|עסקים|שיווק|מכירות|פיננסים|תקציב|משקיעים|pitch|startup|business|marketing|sales|finance/.test(combinedText)) {
    return 'business';
  }

  // Design & Media
  if (/עיצוב|מיתוג|גרפיקה|טיפוגרפיה|צבעים|לוגו|קריאייטיב|ux|ui|figma|canva|design|brand|graphic/.test(combinedText)) {
    return 'design';
  }

  // Software & AI
  if (/תוכנה|קוד|פיתוח|אלגוריתם|בינה מלאכותית|פייתון|python|javascript|react|c\+\+|node|backend|frontend|software|code/.test(combinedText)) {
    return 'software';
  }

  // Robotics & Hardware
  if (/רובוט|רובוטיקה|זרוע|מנוע|סרוו|חיישן|ארדואינו|arduino|esp32|iot|רחפן|מכאני|cad|robotics|hardware/.test(combinedText)) {
    return 'robotics';
  }

  return 'polymath';
}

/**
 * Builds Smart Domain-Specific Curriculum Fallback (Guaranteed to return complete, rich tracks)
 */
function buildSmartCurriculum(domainKey, params = {}) {
  const {
    title = '',
    prompt = '',
    components = [],
    softwareStack = 'python',
    targetBoard = 'esp32',
    customChapters = [],
    availableImages = []
  } = params;

  const trackTitle = title.trim() || 'פרויקט למידה אינטראקטיבי';
  const trackId = `track_${Date.now()}`;
  const domainInfo = DOMAINS[domainKey] || DOMAINS.polymath;

  let chapters = [];

  switch (domainKey) {
    case 'science': {
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
              materials: ['מערך ניסוי מלא', 'משקפי מגן וכפפות במידת הצורך', 'לוח רישום נתונים'],
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
    }

    case 'business': {
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
    }

    case 'design': {
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
    }

    case 'software': {
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
              code: `// קוד תוכנית ראשוני\nfunction initApp() {\n  console.log("Ready!");\n}\ninitApp();`,
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
    }

    case 'robotics': {
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
    }

    case 'polymath':
    default: {
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
  }

  return {
    id: trackId,
    trackId: trackId,
    title: trackTitle,
    description: `מסלול למידה חווייתי ומעמיק ב${domainInfo.name}, המקנה ידע עיוני ומיומנויות מעשיות לפיתוח ${trackTitle}.`,
    domain: domainKey,
    chapters
  };
}

/**
 * Main Orchestration Function:
 * 1. Classifies Domain
 * 2. Prepares Domain System Prompt
 * 3. Attempts OpenRouter Gemini 3.1 Pro generation
 * 4. Falls back to Smart Multi-Domain Heuristic if needed
 * 5. Applies Visual Theming Agent
 * 6. Applies Pedagogical QA Validator
 */
async function orchestrateTrackGeneration(requestBody = {}) {
  const {
    prompt = '',
    title = '',
    domain: requestedDomain,
    projectType = 'hardware_software',
    targetBoard = 'esp32',
    softwareStack = 'python',
    components = [],
    difficulty = 'חטיבת ביניים / תיכון',
    chaptersCount = 3,
    customChapters = [],
    activeScrapedData = null,
    availableImages = [],
    apiKey = ''
  } = requestBody;

  // 1. Identify Domain
  const domainKey = classifyDomain({
    domain: requestedDomain,
    projectType,
    title,
    prompt,
    softwareStack
  });

  const domain = DOMAINS[domainKey] || DOMAINS.polymath;
  console.log(`[Orchestrator] Selected Domain: "${domain.name}" (${domainKey})`);

  const trackTitle = (title || `פרויקט ${domain.name}`).trim();

  let generatedTrack = null;

  // 2. Formulate LLM Prompt with Domain Expert System Prompt
  const activeApiKey = (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'YOUR_OPENROUTER_API_KEY_HERE')
    ? process.env.OPENROUTER_API_KEY
    : apiKey;

  if (activeApiKey) {
    try {
      const TARGET_MODEL = 'google/gemini-3.1-pro-preview';
      console.log(`[Orchestrator] Invoking OpenRouter Gemini 3.1 Pro for Domain: ${domainKey}...`);

      const systemPrompt = `You are a World-Class Curriculum Architect and Multi-Agent Orchestrator specialized in ${domain.englishName}.
${domain.systemPrompt}

CRITICAL RULES:
1. Output strictly 100% valid JSON with NO markdown fences, NO backticks, NO explanation.
2. Structure the track with exactly ${chaptersCount || 3} progressive, rich chapters in Hebrew.
3. Every lesson MUST have a clear title, instructions array, and goal.
4. For science projects: set "isExperimentStep": true, include "materials", "hypothesis", and "keyTakeaways".
5. For business projects: set "isBusinessMission": true, include "targetAudience", and "mentorTip".
6. For design projects: set "isDesignChallenge": true, include "recommendedHex" array, and "designerTip".
7. For software projects: set "isCodingMission": true, include "codeTemplate" and valid syntax.
8. For robotics projects: set "isAssemblyStep": true for mechanical assembly with "partsNeeded", and "isCodingMission": true for C++ coding.
9. Match the JSON schema: { id, title, description, domain, welcomePage: { welcomeText, features: [...] }, chapters: [ { id, title, lessons: [...] } ] }`;

      const userContent = `
Generate a full, rich learning track for:
Domain: ${domain.englishName} (${domain.name})
Track Title: ${trackTitle}
Target Audience / Difficulty: ${difficulty}
User Prompt: ${prompt || 'Create an engaging hands-on curriculum'}
${components.length > 0 ? `Selected Components: ${components.join(', ')}` : ''}
${softwareStack ? `Software Stack: ${softwareStack}` : ''}
${targetBoard ? `Target Board: ${targetBoard}` : ''}
${(customChapters && customChapters.length > 0)
  ? `Custom Chapters:\n` + customChapters.map((c, i) => `Ch ${i+1}: ${c.title}`).join('\n')
  : `Create ${chaptersCount || 3} progressive chapters.`}
${activeScrapedData?.summary ? `Scraped Web Knowledge:\n${activeScrapedData.summary.substring(0, 3000)}` : ''}
`;

      const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: TARGET_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 24000,
        response_format: { type: 'json_object' }
      }, {
        headers: {
          'Authorization': `Bearer ${activeApiKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://smartstart.academy',
          'X-Title': 'SmartStart Multi-Agent Platform'
        },
        timeout: 60000
      });

      const rawContent = aiRes.data?.choices?.[0]?.message?.content || '';
      let clean = rawContent.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      clean = clean.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '');

      try {
        generatedTrack = JSON.parse(clean);
        console.log(`[Orchestrator] Successfully generated track via Gemini 3.1 Pro!`);
      } catch (parseErr) {
        console.warn(`[Orchestrator] Direct parse failed, repairing JSON...`);
        let repaired = clean;
        const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
        if (quoteCount % 2 !== 0) repaired += '"';
        const openBrackets = Math.max(0, (repaired.match(/\[/g) || []).length - (repaired.match(/\]/g) || []).length);
        const openBraces = Math.max(0, (repaired.match(/\{/g) || []).length - (repaired.match(/\}/g) || []).length);
        for (let i = 0; i < openBrackets; i++) repaired += ']';
        for (let i = 0; i < openBraces; i++) repaired += '}';
        generatedTrack = JSON.parse(repaired);
        console.log(`[Orchestrator] JSON repaired successfully!`);
      }
    } catch (err) {
      console.warn(`[Orchestrator] OpenRouter generation failed (${err.message}). Using Smart Curriculum Fallback.`);
    }
  }

  // 3. Smart Heuristic Fallback if AI was unavailable or failed
  if (!generatedTrack || !generatedTrack.chapters || generatedTrack.chapters.length === 0) {
    console.log(`[Orchestrator] Generating track via Smart Multi-Domain Curriculum Engine...`);
    generatedTrack = buildSmartCurriculum(domainKey, {
      title: trackTitle,
      prompt,
      components,
      softwareStack,
      targetBoard,
      customChapters,
      availableImages
    });
  }

  // 4. Invoke Theming & Styling Agent
  console.log(`[Orchestrator] Invoking Visual Styling Agent...`);
  const visualTheme = generateThemeForTrack(domainKey, trackTitle);
  generatedTrack.gradient = visualTheme.gradient;
  generatedTrack.glow = visualTheme.glow;
  generatedTrack.accentColor = visualTheme.accentColor;
  generatedTrack.icon = visualTheme.icon;
  generatedTrack.badges = visualTheme.badges;
  generatedTrack.domain = domainKey;

  // 5. Invoke Pedagogical QA & Validator Agent
  console.log(`[Orchestrator] Invoking Pedagogical QA & Validator Agent...`);
  const finalTrack = validateAndEnhanceTrack(generatedTrack, {
    domain: domainKey,
    title: trackTitle
  });

  // Assign images if available
  if (availableImages.length > 0) {
    if (!finalTrack.coverImage) {
      finalTrack.coverImage = availableImages[0];
    }
    let imgIdx = 0;
    finalTrack.chapters.forEach(ch => {
      (ch.lessons || []).forEach(les => {
        if (!les.imageUrl) {
          les.imageUrl = availableImages[imgIdx % availableImages.length];
          imgIdx++;
        }
      });
    });
  }

  console.log(`[Orchestrator] Track generation complete! Total chapters: ${finalTrack.chapters.length}`);
  return finalTrack;
}

module.exports = {
  orchestrateTrackGeneration,
  classifyDomain,
  buildSmartCurriculum
};
