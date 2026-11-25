// ============================================================================
// 🤖 קורס שנתי מלא (25 מפגשים × 90 דקות): פיתוח אתרים ב-AI (פרומפטים)
// 5 יחידות × 5 מפגשים = 25 מפגשים | 100% Prompt-Driven Web & App Building
// ============================================================================
import { AI_WEB_UNIT_1_SESSIONS } from './aiWebCurriculumU1';
import { AI_WEB_UNIT_2_SESSIONS } from './aiWebCurriculumU2';
import { AI_WEB_UNIT_3_SESSIONS } from './aiWebCurriculumU3';
import { AI_WEB_UNIT_4_SESSIONS } from './aiWebCurriculumU4';
import { AI_WEB_UNIT_5_SESSIONS } from './aiWebCurriculumU5';

export const AI_WEB_UNITS = [
  {
    id: 'u1',
    num: 1,
    icon: '✨',
    shortName: 'יחידה 1 (1–5)',
    rangeLabel: 'מפגשים 1–5',
    name: 'יחידה 1: יסודות Prompt Engineering ודף נחיתה פרימיום',
    description:
      'נוסחת 5 הרכיבים, מיתוג ויצירת מדיה ב-AI (FLUX.1), בנייה מודולרית סקשן-אחר-סקשן, Art Direction, יום/לילה ומובייל + Show & Tell #1.',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    firstSessionId: 1
  },
  {
    id: 'u2',
    num: 2,
    icon: '🔍',
    shortName: 'יחידה 2 (6–10)',
    rangeLabel: 'מפגשים 6–10',
    name: 'יחידה 2: "רנטגן קוד", ציד באגים ואתר רב-עמודי',
    description:
      'קריאת קוד בעזרת AI, מעבדת ציד באגים, אדריכלות רב-עמודית (Design System Prompt), קטלוג ו-Quick View, טפסים חכמים עם ולידציה ו-FAQ.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    firstSessionId: 6
  },
  {
    id: 'u3',
    num: 3,
    icon: '⚡',
    shortName: 'יחידה 3 (11–15)',
    rangeLabel: 'מפגשים 11–15',
    name: 'יחידה 3: אינטראקטיביות ואפליקציות Web (Spec-to-App)',
    description:
      'מנוע חיפוש וסינון חי, מחשבון/כלי מותאם למותג, סל קניות וקופונים, חידון/מיני-משחק ממותג ומעבדת QA כיתתית ("שבור ותקן").',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    firstSessionId: 11
  },
  {
    id: 'u4',
    num: 4,
    icon: '🧠',
    shortName: 'יחידה 4 (16–20)',
    rangeLabel: 'מפגשים 16–20',
    name: 'יחידה 4: זיכרון נתונים, משתמשים, פאנל ניהול וצ׳אטבוט',
    description:
      'סכמת LocalStorage, הרשמה ואזור אישי, פאנל ניהול Admin CRUD + ביקורות, צ׳אטבוט חכם באתר התלמיד, נגישות WCAG וביקורת SEO.',
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
    firstSessionId: 16
  },
  {
    id: 'u5',
    num: 5,
    icon: '🏆',
    shortName: 'יחידה 5 (21–25)',
    rangeLabel: 'מפגשים 21–25',
    name: 'יחידה 5: ספרינט פרויקט גמר, פרסום באוויר ו-Demo Day',
    description:
      'מסמך אפיון PRD עם AI Co-Pilot, ספרינט בנייה 1 (ליבה), ספרינט בנייה 2 (וואו פקטור), QA ופרסום קישור חי, ויום השקה חגיגי!',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    firstSessionId: 21
  }
];

export const AI_WEB_SESSIONS = [
  ...AI_WEB_UNIT_1_SESSIONS,
  ...AI_WEB_UNIT_2_SESSIONS,
  ...AI_WEB_UNIT_3_SESSIONS,
  ...AI_WEB_UNIT_4_SESSIONS,
  ...AI_WEB_UNIT_5_SESSIONS
];

export const STUDENT_SITE_IDEAS = [
  {
    id: 'gaming',
    title: 'מועדון וחנות גיימינג',
    defaultBrand: 'CyberArena',
    icon: '🎮',
    description: 'סקירות משחקים, טורנירים, ציוד גיימינג ובונה עמדת משחק חכם.',
    topicKeyword: 'מועדון גיימינג, טורנירים וציוד לגיימרים'
  },
  {
    id: 'pets',
    title: 'אימוץ וטיפוח חיות מחמד',
    defaultBrand: 'HappyPaws',
    icon: '🐾',
    description: 'אימוץ כלבים וחתולים, מדריכי גידול, חנות פינוקים ומחשבון האכלה.',
    topicKeyword: 'אימוץ חיות מחמד, אילוף וטיפוח כלבים וחתולים'
  },
  {
    id: 'fashion',
    title: 'מותג אופנה וסטריט-סטייל',
    defaultBrand: 'UrbanVibe',
    icon: '👟',
    description: 'קולקציות ביגוד, סניקרס במהדורה מוגבלת וקטלוג חכם.',
    topicKeyword: 'מותג אופנת רחוב, סניקרס ועיצוב צעיר'
  },
  {
    id: 'tech',
    title: 'סטארט-אפ גאדג׳טים ורובוטיקה',
    defaultBrand: 'NovaTech',
    icon: '🚀',
    description: 'רחפנים, רובוטים חכמים, גאדג׳טים עתידניים ומתכנן חבילות טק.',
    topicKeyword: 'סטארט-אפ גאדג׳טים חכמים, רובוטיקה וחדשנות'
  },
  {
    id: 'sports',
    title: 'אקדמיית ספורט ואלופים',
    defaultBrand: 'ChampZone',
    icon: '⚽',
    description: 'תוכניות אימון, ציוד ספורט, חידון כושר ומחשבון אימונים אישי.',
    topicKeyword: 'אקדמיית ספורט, אימונים, ציוד ואורח חיים בריא'
  },
  {
    id: 'food',
    title: 'מסעדת שף / מאפייה בוטיק',
    defaultBrand: 'BurgerBoss',
    icon: '🍔',
    description: 'תפריט דיגיטלי חי, הרכבת ארוחה בסליידרים, סל משלוחים וקופונים.',
    topicKeyword: 'מסעדת בוטיק, תפריט מעוצב ומשלוחים מהירים'
  },
  {
    id: 'music',
    title: 'אולפן מוזיקה והופעות',
    defaultBrand: 'BeatWave',
    icon: '🎵',
    description: 'ציוד סאונד, כרטיסים להופעות, חידון מוזיקלי ופלייליסטים.',
    topicKeyword: 'אולפן מוזיקה, ציוד אודיו והופעות חיות'
  },
  {
    id: 'custom',
    title: 'מיזם מקורי משלי',
    defaultBrand: 'MySmartSite',
    icon: '💡',
    description: 'צילום, אפייה, מדע, קומיקס, נסיעות או כל סטארטאפ אישי שתחלמו עליו.',
    topicKeyword: 'מיזם דיגיטלי מקורי בהתאמה אישית'
  }
];

// ============================================================================
// 📖 ספר הפרומפטים האינטראקטיבי (Prompt Engineering Playbook)
// מחליף את מילון תגיות ה-HTML הישן — מותאם ב-100% למסלול הפרומפטים!
// ============================================================================
export const PROMPT_PLAYBOOK_CATALOG = [
  {
    categoryId: 'formulas',
    categoryTitle: '📐 נוסחאות-על לפרומפטים מנצחים',
    categorySubtitle: 'תבניות הזהב שהופכות כל בקשה ל-AI לאתר מדויק ברמת סטארטאפ',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    items: [
      {
        title: 'נוסחת 5 הרכיבים (בניית סקשן / עמוד חדש)',
        badge: 'יחידה 1 • חובה',
        whenToUse: 'בכל פעם שמתחילים לבנות אזור או עמוד חדש מאפס.',
        formula: '🎯 תפקיד + 📦 משימה ותוכן + 🎨 סגנון וצבעים + ⚡ התנהגות + 🚫 מגבלות',
        examplePrompt:
          'פעל כמעצב ומפתח אתרים בכיר. בנה עבור "[SITE_NAME]" (תחום: [SITE_TOPIC]) סקשן פתיחה בעברית RTL הכולל תגית קצרה, כותרת חזקה, תיאור בן 2 שורות ו-2 כפתורים. סגנון: מודרני ונקי עם רקע כהה ונגיעות טורקיז. שמור על התאמה מלאה למובייל וללא טקסט גנרי.'
      },
      {
        title: 'נוסחת ההוספה השמורה (Additive Prompt)',
        badge: 'יחידה 1–5 • מונע מחיקות!',
        whenToUse: 'כשרוצים להוסיף סקשן חדש מבלי שה-AI ימחק או יהרוס את מה שכבר בניתם.',
        formula: '🔒 שמור על הקיים + ➕ איפה להוסיף + 📦 מה בדיוק להוסיף + 🎨 באותו עיצוב',
        examplePrompt:
          'שמור על כל הקוד, התמונות והעיצוב הקיימים ב-"[SITE_NAME]" בלי למחוק כלום. הוסף מתחת לסקשן ה-Hero סקשן חדש של 3 כרטיסיות יתרונות באותה פלטת צבעים וטיפוגרפיה.'
      },
      {
        title: 'נוסחת העריכה הכירורגית (Surgical Edit)',
        badge: 'יחידה 2 • דיוק לייזר',
        whenToUse: 'כשרוצים לשנות רק פרט אחד (כפתור, כותרת, צבע) בלי שה-AI ייגע בשאר האתר.',
        formula: '🎯 מטרה ספציפית אחת + ✏️ השינוי המדויק + 🚫 במה אסור לגעת',
        examplePrompt:
          'עריכה כירורגית בלבד: מצא רק את הכפתור הראשי ב-Hero של "[SITE_NAME]", הגדל את הפונט שלו ל-1.15rem והוסף לו אפקט זוהר ב-Hover. אל תשנה אף אלמנט אחר בדף.'
      },
      {
        title: 'נוסחת ה-Design System (אחידות בין עמודים)',
        badge: 'יחידה 2–5 • רב-עמודי',
        whenToUse: 'כשעוברים לבנות עמוד חדש (`about.html`, `catalog.html`) ורוצים שייראה תאום לדף הבית.',
        formula: '🧬 שמור על אותו Navbar + 🎨 אותם משתני צבע וגופן + 📄 התוכן הייחודי לעמוד זה',
        examplePrompt:
          'בנה את עמוד האודות (about.html) עבור "[SITE_NAME]" כך שיראה 100% חלק מאותו אתר של index.html: השתמש בדיוק באותו Navbar (עם סימון "אודות" כפעיל), אותה פלטת צבעים ו-Footer תואם.'
      }
    ]
  },
  {
    categoryId: 'design',
    categoryTitle: '🎨 מילון סגנונות עיצוב ו-Art Direction',
    categorySubtitle: 'מילות קסם עיצוביות שה-AI מבין מיד כדי להרים את המראה של האתר',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    items: [
      {
        title: 'Glassmorphism (אפקט זכוכית חלבית)',
        badge: 'יוקרתי ומודרני',
        whenToUse: 'לכרטיסיות, Navbar צף וחלונות קופצים על רקע כהה או צבעוני.',
        formula: 'רקע חצי-שקוף + backdrop-filter: blur(12px) + גבול דק 1px בהיר',
        examplePrompt:
          'שדרג את הכרטיסיות ואת ה-Navbar באתר "[SITE_NAME]" לסגנון Glassmorphism עדין: רקע שקוף למחצה, טשטוש רקע (backdrop-filter: blur(12px)), גבול דק של 1px וצללית רכה.'
      },
      {
        title: 'Bento Grid (פריסת קופסאות אסימטרית בסגנון Apple)',
        badge: 'סופר טרנדי',
        whenToUse: 'להצגת יתרונות, תכונות מוצר או גלריית שירותים בדף הבית.',
        formula: 'CSS Grid עם כרטיסייה אחת רחבה (span 2) לצד כרטיסיות קטנות יותר',
        examplePrompt:
          'סדר את סקשן היתרונות של "[SITE_NAME]" בתבנית Bento Grid מודרנית (כרטיסייה אחת רחבה בולטת + 3 כרטיסיות משלימות) עם פינות מעוגלות 22px, אייקונים צבעוניים ואפקט ריחוף עדין.'
      },
      {
        title: 'Dark / Light Mode עם משתני CSS',
        badge: 'חוויית פרימיום',
        whenToUse: 'לתת לגולש לבחור בין מצב לילה כהה למצב יום בהיר.',
        formula: 'משתני :root + מחלקת .light-theme + כפתור 🌙/☀️ ב-Navbar + שמירה ב-localStorage',
        examplePrompt:
          'הוסף ל-"[SITE_NAME]" מתג 🌙/☀️ ב-Navbar שמעביר את כל האתר בין מצב לילה למצב יום באמצעות משתני CSS, שומר את הבחירה ב-localStorage ומוודא ניגודיות קריאה בשני המצבים.'
      },
      {
        title: 'מיקרו-אנימציות גלילה (Scroll Reveal)',
        badge: 'תנועה אלגנטית',
        whenToUse: 'כדי שהסקשנים והכרטיסיות ייכנסו בצורה חלקה כשגוללים למטה.',
        formula: 'IntersectionObserver + Fade-Up של 20px במשך 0.4s עם השהיה מדורגת',
        examplePrompt:
          'הוסף אנימציית כניסה עדינה בגלילה (IntersectionObserver) לכל הסקשנים והכרטיסיות ב-"[SITE_NAME]" כך שייחשפו מלמטה למעלה בהדרגה, וכבד גם העדפת prefers-reduced-motion.'
      }
    ]
  },
  {
    categoryId: 'interactive',
    categoryTitle: '⚡ מתכוני אפליקציות ולוגיקה (Spec-to-App)',
    categorySubtitle: 'איך מנסחים התנהגות (קלט ← עיבוד ← פלט) לפיצ׳רים אינטראקטיביים',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    items: [
      {
        title: 'חיפוש וסינון משולב בזמן אמת',
        badge: 'מפגש 11',
        whenToUse: 'בקטלוג מוצרים, גלריית פרויקטים או רשימת תכנים.',
        formula: 'קלט (חיפוש + קטגוריה + מיון) ← סינון מערך ITEMS בזמן אמת ← הצגה + מצב ריק',
        examplePrompt:
          'הוסף ל-catalog.html מנוע חיפוש וסינון חי (oninput) שמשלב תיבת חיפוש טקסט, כפתורי קטגוריה ומיון מחיר. הצג מונה תוצאות, ואם אין התאמה — הצג הודעה נחמדה עם כפתור "נקה סינון".'
      },
      {
        title: 'מגירת סל קניות + קופון חד-פעמי + Toast',
        badge: 'מפגש 13',
        whenToUse: 'לניהול הזמנות, סל פריטים או רשימת פעילויות שנבחרו.',
        formula: 'מערך cart ← הוספה (מעלה כמות אם כבר קיים) ← מגירה צדדית + קופון + Toast בלי alert',
        examplePrompt:
          'הוסף מגירת סל קניות צדדית עם כפתורי +/- לכמות, מחיקה, קופון SMART15 שמופעל פעם אחת בלבד (15% הנחה), והתראת Toast אלגנטית בפינה בכל הוספה במקום alert.'
      },
      {
        title: 'זיכרון נתונים מאובטח (LocalStorage Schema)',
        badge: 'מפגש 16',
        whenToUse: 'כדי שסל, מועדפים, משתמש מחובר ושיא משחק לא ייעלמו ברענון.',
        formula: 'שמות מפתחות קבועים + שמירה בכל שינוי + טעינה בתוך try/catch + כפתור איפוס',
        examplePrompt:
          'חבר את הנתונים של "[SITE_NAME]" ל-localStorage תחת מפתחות קבועים (mysite_cart, mysite_favorites, mysite_theme) בתוך try/catch בטוח כך שכל בחירה נשמרת גם אחרי רענון ומעבר עמוד.'
      },
      {
        title: 'צ׳אטבוט עוזר מותג צף',
        badge: 'מפגש 19',
        whenToUse: 'לתת לגולשים עזרה מיידית, המלצות וניווט מהיר בתוך האתר.',
        formula: 'כפתור צף סגור כברירת מחדל + 4 שאלות מהירות + זיהוי מילות מפתח + אנימציית "מקליד..."',
        examplePrompt:
          'הוסף בפינה השמאלית-תחתונה כפתור צ׳אטבוט צף בשם העוזר של "[SITE_NAME]" עם 4 שאלות מהירות, זיהוי מילות מפתח בעברית (מחיר, המלצה, קופון, קשר), אנימציית הקלדה וקישורים לחיצים.'
      }
    ]
  },
  {
    categoryId: 'debugging',
    categoryTitle: '🐞 פרומפטי דיבאגינג, QA, נגישות ו-SEO',
    categorySubtitle: 'מה כותבים ל-AI כשמשהו נשבר או לפני שמפרסמים את האתר לעולם',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    items: [
      {
        title: 'נוסחת דיווח הבאג המדויקת',
        badge: 'מפגש 7 • מציל חיים!',
        whenToUse: 'בכל פעם שכפתור לא מגיב, תמונה נשברת או עיצוב משתבש.',
        formula: '📍 איפה זה קורה + ❌ מה קורה בפועל + ✅ מה אמור לקרות + 🗣️ תסביר מה תיקנת',
        examplePrompt:
          'מצאתי באג בעמוד הנוכחי: כאשר אני לוחץ על [שם הכפתור], במקום שיקרה [התנהגות רצויה], בפועל קורה [מה שקורה עכשיו]. אתר את השגיאה, תקן רק אותה בלי לשנות עיצוב אחר, והסבר לי בשורה אחת מה גרם לזה.'
      },
      {
        title: 'ביקורת קוד ו-QA עצמית (AI Audit)',
        badge: 'מפגשים 7, 15, 24',
        whenToUse: 'לפני הגשה למורה או לפני Demo Day כדי לגלות בעיות נסתרות.',
        formula: '🔍 מצב הסבר בלבד ← רשימת תקלות לפי חומרה ← ואז פרומפט תיקון נקי',
        examplePrompt:
          'בצע ביקורת QA מלאה על העמוד הנוכחי של "[SITE_NAME]" (אל תשנה קוד עדיין): בדוק מובייל (375px), קישורים, ניגודיות צבעים, שגיאות JS וטיפול בקלט ריק — ורשום לי רשימה ממוספרת של מה שכדאי לתקן.'
      },
      {
        title: 'פרומפט תיקון מובייל (Responsive Fix)',
        badge: 'מפגש 5',
        whenToUse: 'כשבתצוגת "📱 נייד" משהו גולש הצידה או צפוף מדי.',
        formula: 'תפריט המבורגר + טור אחד מתחת ל-768px + overflow-x: hidden + פונט clamp()',
        examplePrompt:
          'תקן את תצוגת המובייל (מתחת ל-768px) של "[SITE_NAME]": הפוך את ה-Navbar לתפריט המבורגר נפתח, בטל כל גלילה אופקית, סדר כרטיסיות בטור אחד והתאם כפתורים ללחיצה נוחה באצבע.'
      },
      {
        title: 'בדיקת נגישות WCAG + SEO לגוגל',
        badge: 'מפגש 20',
        whenToUse: 'להכנת האתר לסטנדרט מקצועי ולשיתוף יפה בוואטסאפ ובגוגל.',
        formula: 'Meta description + Open Graph + alt + aria-label + focus-visible + ווידג׳ט ♿',
        examplePrompt:
          'שדרג את ה-SEO והנגישות של "[SITE_NAME]": הוסף title ו-meta description בעברית, תגיות Open Graph, תיאורי alt ו-aria-label, טבעת פוקוס למקלדת (:focus-visible) ותפריט נגישות צף ♿.'
      }
    ]
  }
];

export const FREE_AI_TOOLS_CATALOG = [
  {
    categoryId: 'chat_ideation',
    categoryTitle: '💬 כלי AI חיצוניים להשראה, כתיבת תוכן ותכנון PRD',
    categoryColor: '#7c3aed',
    categoryBg: '#f5f3ff',
    categoryBorder: '#ddd6fe',
    tools: [
      {
        name: 'Google Gemini',
        url: 'https://gemini.google.com',
        icon: '✨',
        badge: 'חינם • מצוין בעברית',
        purpose: 'סיעור מוחות, תכנון מפת אתר, כתיבת סיפור מותג, שאלות טריוויה וטקסטים שיווקיים.'
      },
      {
        name: 'ChatGPT',
        url: 'https://chatgpt.com',
        icon: '🤖',
        badge: 'חינם • פופולרי',
        purpose: 'כתיבת סלוגנים, תסריט פיץ׳ ל-Demo Day, ורעיונות לפיצ׳רים אינטראקטיביים.'
      },
      {
        name: 'Claude AI',
        url: 'https://claude.ai',
        icon: '🧠',
        badge: 'חינם • אלוף בלוגיקה וכתיבה',
        purpose: 'ניסוח מסמכי PRD, קופירייטינג טבעי בעברית וחשיבה על חוויית משתמש.'
      },
      {
        name: 'Perplexity AI',
        url: 'https://www.perplexity.ai',
        icon: '🔍',
        badge: 'חינם • מחקר ועובדות',
        purpose: 'מציאת עובדות, מחירים אמיתיים ונתונים מעניינים לשילוב באתר המותג שלך.'
      }
    ]
  },
  {
    categoryId: 'visuals_branding',
    categoryTitle: '🎨 יצירת תמונות, לוגואים ופלטות צבעים (בנוסף לסטודיו המובנה)',
    categoryColor: '#2563eb',
    categoryBg: '#eff6ff',
    categoryBorder: '#bfdbfe',
    tools: [
      {
        name: 'Ideogram AI',
        url: 'https://ideogram.ai',
        icon: '🎯',
        badge: 'חינם • מעולה ללוגו',
        purpose: 'יצירת לוגואים ובאנרים מדויקים עם שם המותג שלכם.'
      },
      {
        name: 'Leonardo.ai',
        url: 'https://leonardo.ai',
        icon: '🦁',
        badge: 'חינם (מכסה יומית)',
        purpose: 'יצירת צילומי מוצרים, דמויות גיימינג ואווירה מרהיבה.'
      },
      {
        name: 'Coolors.co',
        url: 'https://coolors.co/generate',
        icon: '🎨',
        badge: 'חינם • פלטות HEX',
        purpose: 'לוחצים על מקש הרווח ומקבלים פלטות צבעים מקצועיות עם קודי HEX להדבקה בפרומפט.'
      },
      {
        name: 'Remove.bg',
        url: 'https://www.remove.bg',
        icon: '✂️',
        badge: 'חינם • הסרת רקע',
        purpose: 'הסרת רקע מלוגו או מוצר בלחיצה אחת כדי לקבל PNG נקי להעלאה לסטודיו.'
      }
    ]
  }
];

// ============================================================================
// 🧠 מד איכות פרומפט חי (Live Prompt Coach) — נותן לתלמיד ציון וטיפ מיידי!
// ============================================================================
export function evaluatePromptQuality(rawPrompt = '', mode = 'build') {
  const text = String(rawPrompt || '').trim();
  if (!text) {
    return {
      score: 0,
      level: 'empty',
      label: 'התחל לכתוב פרומפט...',
      color: '#94a3b8',
      checks: [],
      tip: 'נסו לשלב מה בונים, לאיזה מותג, איך זה ייראה ואיך זה יתנהג!'
    };
  }

  if (mode === 'image') {
    const hasSubject = text.length >= 12;
    const hasStyle = /צילום|סטודיו|ניאון|וקטור|מינימליסטי|תלת.?ממד|קולנוע|יוקרת|אור|תאורה|רקע|מודרני|ריאליסטי|איור/i.test(text);
    const hasDetail = text.split(/\s+/).length >= 6;
    const checks = [
      { label: 'תיאור נושא ברור', ok: hasSubject },
      { label: 'סגנון / תאורה / אווירה', ok: hasStyle },
      { label: 'פירוט עשיר (6+ מילים)', ok: hasDetail }
    ];
    const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
    return {
      score,
      level: score >= 90 ? 'pro' : score >= 60 ? 'good' : 'basic',
      label: score >= 90 ? '🌟 פרומפט תמונה מקצועי!' : score >= 60 ? '👍 טוב — אפשר להוסיף סגנון' : '💡 פרומפט קצר מדי',
      color: score >= 90 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444',
      checks,
      tip: !hasStyle
        ? 'טיפ: הוסף מילות סגנון כמו "צילום סטודיו", "תאורת ניאון" או "וקטור מינימליסטי"!'
        : !hasDetail
        ? 'טיפ: תאר קצת יותר פרטים — מה ברקע ואיזה צבעים שולטים?'
        : 'מעולה! ה-AI ייצר תמונה מדויקת ומרשימה.'
    };
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasGoal = /בנה|הוסף|שדרג|תקן|עצב|צור|שנה|החלף|הסבר|בדוק|ארגן|חבר/i.test(text);
  const hasStructureOrContent = /כותרת|כפתור|כרטיס|סקשן|תפריט|עמוד|טופס|קטלוג|סל|מחשבון|חיפוש|משחק|חידון|בוט|נגישות|navbar|hero|footer|modal|localstorage/i.test(text);
  const hasStyleOrUX = /צבע|עיצוב|מודרני|כהה|בהיר|מובייל|רספונסיבי|אנימצי|ריווח|גופן|זכוכית|גרדיאנט|עברית|rtl|hover|ניגודיות|פלטת|#/i.test(text);
  const hasConstraintOrContext = wordCount >= 14 || /שמור|אל תמחק|בלי|ללא|כירורגי|המותג|עבור|בתחום|וודא|ודא/i.test(text);

  const checks = [
    { label: 'פעולה ברורה', ok: hasGoal },
    { label: 'רכיבים / תוכן מדויק', ok: hasStructureOrContent },
    { label: 'סגנון / עיצוב / מובייל', ok: hasStyleOrUX },
    { label: 'פירוט ומגבלות (שמור על הקיים)', ok: hasConstraintOrContext }
  ];

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);

  let tip = 'פרומפט ברמת ארכיטקט! 🚀 מוכן לשליחה.';
  if (!hasStructureOrContent) {
    tip = 'טיפ: פרט אילו אלמנטים בדיוק לבנות (למשל: כותרת, 3 כרטיסיות, כפתור, טופס).';
  } else if (!hasStyleOrUX) {
    tip = 'טיפ: הוסף הכוונת עיצוב (צבעים, אווירה, ריווח או התאמה למובייל).';
  } else if (!hasConstraintOrContext) {
    tip = 'טיפ: הוסף "שמור על הקוד הקיים" או עוד קצת פרטים כדי למנוע ניחושים של ה-AI.';
  }

  return {
    score,
    level: score >= 75 ? 'pro' : score >= 50 ? 'good' : 'basic',
    label: score === 100 ? '🔥 פרומפט אלוף (100%)' : score >= 75 ? '✅ פרומפט חזק' : score >= 50 ? '⚡ פרומפט סביר — שפר עוד קצת' : '⚠️ פרומפט כללי מדי',
    color: score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
    checks,
    tip
  };
}
