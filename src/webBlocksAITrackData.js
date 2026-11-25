// =========================================================================
// 🌐 קורס שנתי מקצועי (32 מפגשים × 90 דקות): פיתוח אתרים בבלוקים (WebBlocks Pro) ו-AI
// מרעיון ראשון לאתר מסחרי רב-עמודי, עיצוב CSS3 חופשי, JS חכם ו-SmartDB + Auth
// =========================================================================
import { WEBBLOCKS_Q1_SESSIONS } from './webBlocksCurriculumQ1';
import { WEBBLOCKS_Q2_SESSIONS } from './webBlocksCurriculumQ2';
import { WEBBLOCKS_Q3_SESSIONS } from './webBlocksCurriculumQ3';
import { WEBBLOCKS_Q4_SESSIONS } from './webBlocksCurriculumQ4';

export const WEBBLOCKS_AI_QUARTERS = [
  {
    id: 'q1',
    num: 1,
    icon: '🧱',
    shortName: "רבעון א' (1–8)",
    rangeLabel: 'מפגשים 1–8',
    name: "רבעון א': שלד HTML5 של דף הבית (index.html) מלמעלה למטה",
    description: 'מסיימים חלק אחרי חלק את דף הבית: <body> סמנטי ← סרגל ניווט ← Hero ומדיה ← גריד יתרונות ← תוכן ← טבלה ו-FAQ ← טופס ו-Footer.',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    firstSessionId: 1
  },
  {
    id: 'q2',
    num: 2,
    icon: '🎨',
    shortName: "רבעון ב' (9–16)",
    rangeLabel: 'מפגשים 9–16',
    name: "רבעון ב': אתר רב-עמודי, טפסי HTML5 מלאים וליטוש CSS3",
    description: 'עמודי אודות וקטלוג, חלון <dialog>, טפסי Select/Slider/WhatsApp, עיצוב :hover, HTML/CSS חופשי, רספונסיביות ובקרת 🌳 שכבות.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    firstSessionId: 9
  },
  {
    id: 'q3',
    num: 3,
    icon: '⚡',
    shortName: "רבעון ג' (17–24)",
    rangeLabel: 'מפגשים 17–24',
    name: "רבעון ג': אינטראקציות DOM ו-JavaScript — האתר מתעורר לחיים",
    description: 'הצג/הסתר (Toggle), מחשבון ו-Output Box, מחליף מצב יום/לילה, אפקטי קול ומודאל, Custom JS, עוגנים חלקים וגרסה 2.0.',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    firstSessionId: 17
  },
  {
    id: 'q4',
    num: 4,
    icon: '🗄️',
    shortName: "רבעון ד' (25–32)",
    rangeLabel: 'מפגשים 25–32',
    name: "רבעון ד': מסד נתונים (SmartDB), התחברות, SEO ו-Demo Day",
    description: 'הגדרת SmartDB ו-Seed, תצוגת רשימה חיה, שמירת רשומות, עמוד התחברות ופורטל ניהול, ביקורת SEO בגוגל ו-Demo Day.',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    firstSessionId: 25
  }
];

export const FREE_AI_TOOLS_CATALOG = [
  {
    categoryId: 'chat_code',
    categoryTitle: '✍️ כתיבת תוכן, שיווק, תכנון וקוד ב-AI (צ׳אטבוטים)',
    categoryColor: '#7c3aed',
    categoryBg: '#f5f3ff',
    categoryBorder: '#ddd6fe',
    tools: [
      {
        name: 'ChatGPT (OpenAI)',
        url: 'https://chatgpt.com',
        icon: '🤖',
        badge: 'חינם • הכי מומלץ',
        purpose: 'יצירת שמות מותג, סלוגנים, כתיבת תוכן לעמודים וייצור קוד HTML/CSS/JS לבלוק קוד חופשי.'
      },
      {
        name: 'Google Gemini',
        url: 'https://gemini.google.com',
        icon: '✨',
        badge: 'חינם • עברית מצוינת',
        purpose: 'סיעור מוחות, תכנון מפת אתר, כתיבת טבלאות השוואה, סיפור מותג ויצירת תמונות.'
      },
      {
        name: 'Claude AI',
        url: 'https://claude.ai',
        icon: '🧠',
        badge: 'חינם • אלוף בכתיבה וקוד',
        purpose: 'מעולה לכתיבה שיווקית טבעית בעברית וליצירת מחשבונים, חידונים ווידג׳טים אינטראקטיביים.'
      },
      {
        name: 'Microsoft Copilot',
        url: 'https://copilot.microsoft.com',
        icon: '🌐',
        badge: 'חינם • טקסט + תמונות',
        purpose: 'צ׳אט חכם המחובר לאינטרנט וכולל יצירת תמונות חינמית באמצעות מודל DALL-E 3.'
      },
      {
        name: 'Perplexity AI',
        url: 'https://www.perplexity.ai',
        icon: '🔍',
        badge: 'חינם • מחקר ועובדות',
        purpose: 'מנוע מחקר חכם למציאת עובדות, נתונים וסטטיסטיקות אמיתיות לנושא האתר שלך.'
      }
    ]
  },
  {
    categoryId: 'images_logos',
    categoryTitle: '🎨 יצירת תמונות, לוגואים, באנרים ואייקונים ב-AI',
    categoryColor: '#2563eb',
    categoryBg: '#eff6ff',
    categoryBorder: '#bfdbfe',
    tools: [
      {
        name: 'Ideogram AI',
        url: 'https://ideogram.ai',
        icon: '🎯',
        badge: 'חינם • מעולה ללוגו עם טקסט',
        purpose: 'הכלי הטוב בעולם ליצירת לוגואים ובאנרים שכוללים את שם המותג שלך באנגלית בתוך התמונה.'
      },
      {
        name: 'Leonardo.ai',
        url: 'https://leonardo.ai',
        icon: '🦁',
        badge: 'חינם (מכסה יומית)',
        purpose: 'יצירת תמונות מרהיבות של מוצרים, דמויות גיימינג, חיות, גאדג׳טים ותמונות אווירה לאתר.'
      },
      {
        name: 'Bing Image Creator',
        url: 'https://www.bing.com/images/create',
        icon: '🖼️',
        badge: 'חינם • DALL-E 3',
        purpose: 'מחולל תמונות חינמי מבית מייקרוסופט ליצירת 4 תמונות איכותיות בכל לחיצה.'
      },
      {
        name: 'Recraft AI',
        url: 'https://www.recraft.ai',
        icon: '📐',
        badge: 'חינם • אייקונים ואיורים',
        purpose: 'יצירת סטים של אייקונים אחידים (Icons), איורים נקיים ולוגואים בצבעי המותג של האתר.'
      },
      {
        name: 'Canva (Magic Studio)',
        url: 'https://www.canva.com',
        icon: '🖌️',
        badge: 'חינם • עיצוב גרפי ו-AI',
        purpose: 'עיצוב באנרים לאתר, הוספת כותרות בעברית על תמונות, יצירת לוגו ועריכה גרפית קלה.'
      }
    ]
  },
  {
    categoryId: 'image_tools',
    categoryTitle: '🪄 עריכת תמונות, הסרת רקע והעלאת תמונות לאתר',
    categoryColor: '#0891b2',
    categoryBg: '#ecfeff',
    categoryBorder: '#a5f3fc',
    tools: [
      {
        name: 'Remove.bg',
        url: 'https://www.remove.bg',
        icon: '✂️',
        badge: 'חינם • ללא הרשמה',
        purpose: 'הסרת הרקע מתמונת לוגו או תמונת מוצר בלחיצה אחת כדי לקבל תמונה נקייה ושקופה.'
      },
      {
        name: 'Clipdrop AI',
        url: 'https://clipdrop.co',
        icon: '🪄',
        badge: 'חינם • כלי עריכה ב-AI',
        purpose: 'מחיקת עצמים מיותרים מתמונות, הסרת רקע, שיפור תאורה והגדלת חדות התמונה.'
      },
      {
        name: 'Postimages (קישור לתמונה)',
        url: 'https://postimages.org',
        icon: '🔗',
        badge: 'חינם • ללא הרשמה',
        purpose: 'מעלים תמונה ששמרתם במחשב ומקבלים "קישור ישיר" (Direct Link) להדבקה בבלוק תמונה ב-WebBlocks!'
      }
    ]
  },
  {
    categoryId: 'colors_media',
    categoryTitle: '🌈 פלטות צבעים, מאגרי תמונות ומוזיקת AI',
    categoryColor: '#059669',
    categoryBg: '#ecfdf5',
    categoryBorder: '#a7f3d0',
    tools: [
      {
        name: 'Coolors.co',
        url: 'https://coolors.co/generate',
        icon: '🎨',
        badge: 'חינם • פלטות צבעים',
        purpose: 'לוחצים על מקש הרווח ומקבלים שילובי צבעים מקצועיים וקודי HEX להעתקה לעיצוב האתר.'
      },
      {
        name: 'ColorSpace',
        url: 'https://mycolor.space',
        icon: '🌈',
        badge: 'חינם • גרדיאנטים',
        purpose: 'מכניסים צבע ראשי אחד ומקבלים אוטומטית פלטות צבעים ורקעים מדורגים שמתאימים לו.'
      },
      {
        name: 'Unsplash / Pexels',
        url: 'https://unsplash.com',
        icon: '📸',
        badge: 'חינם • תמונות HD לאתר',
        purpose: 'מאגר תמונות חופשי לאתרים — קליק ימני על תמונה ⬅️ "העתק כתובת תמונה" ⬅️ הדבקה בבלוק תמונה.'
      },
      {
        name: 'Suno AI',
        url: 'https://suno.com',
        icon: '🎵',
        badge: 'חינם • מוזיקה וג׳ינגל ב-AI',
        purpose: 'יצירת שיר נושא או ג׳ינגל מקורי למותג האתר שלך לשילוב בבלוק אודיו/מוזיקה.'
      }
    ]
  }
];

export const STUDENT_SITE_IDEAS = [
  {
    id: 'gaming',
    title: 'מועדון וחנות גיימינג',
    defaultBrand: 'CyberArena',
    icon: '🎮',
    description: 'סקירות משחקים, טורנירים, ציוד לגיימרים ומחשבון בניית עמדת גיימינג.',
    topicKeyword: 'מועדון גיימינג, טורנירים וציוד לגיימרים'
  },
  {
    id: 'pets',
    title: 'אימוץ וטיפוח חיות מחמד',
    defaultBrand: 'HappyPaws',
    icon: '🐾',
    description: 'אימוץ כלבים וחתולים, מדריכי גידול, חנות פינוקים ותיאום אימוץ בוואטסאפ.',
    topicKeyword: 'אימוץ חיות מחמד, אילוף וטיפוח כלבים וחתולים'
  },
  {
    id: 'fashion',
    title: 'מותג אופנה וסטריט-סטייל',
    defaultBrand: 'UrbanVibe',
    icon: '👟',
    description: 'קולקציות ביגוד, סניקרס ואקססוריז בעיצוב אישי וקטלוג תמונות מ-AI.',
    topicKeyword: 'מותג אופנת רחוב, סניקרס ועיצוב צעיר'
  },
  {
    id: 'tech',
    title: 'סטארט-אפ גאדג׳טים ורובוטיקה',
    defaultBrand: 'NovaTech',
    icon: '🚀',
    description: 'רחפנים, רובוטים חכמים, גאדג׳טים עתידניים והדגמות וידאו.',
    topicKeyword: 'סטארט-אפ גאדג׳טים חכמים, רובוטיקה וחדשנות'
  },
  {
    id: 'sports',
    title: 'אקדמיית ספורט ואלופים',
    defaultBrand: 'ChampionClub',
    icon: '⚽',
    description: 'תוכניות אימון, טבלאות שיאים, הרשמה לאימונים ומחשבון כושר.',
    topicKeyword: 'אקדמיית ספורט, אימונים, תחרויות ואורח חיים בריא'
  },
  {
    id: 'custom',
    title: 'נושא מקורי משלי',
    defaultBrand: 'MySmartSite',
    icon: '💡',
    description: 'מוזיקה, בישול ואפייה, צילום, קסמים, מדע או עסק אישי משלך.',
    topicKeyword: 'אתר מקורי בהתאמה אישית'
  }
];

// =========================================================================
// 32 מפגשים מפורטים — בכל מפגש 6 שלבים מעשיים (סה"כ 90 דקות עבודה מלאות)
// =========================================================================
export const WEBBLOCKS_AI_SESSIONS = [
  ...WEBBLOCKS_Q1_SESSIONS,
  ...WEBBLOCKS_Q2_SESSIONS,
  ...WEBBLOCKS_Q3_SESSIONS,
  ...WEBBLOCKS_Q4_SESSIONS
];
