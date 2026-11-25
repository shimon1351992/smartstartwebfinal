import React, { useState, useEffect } from 'react';
import { STUDENT_SITE_IDEAS } from './webBlocksAITrackData';
import BlocklyVisualPreview from './BlocklyVisualPreview';

// ============================================================================
// 🎯 פרופילי תוכן לנושאי האתרים של התלמידים במפגש 1
// ============================================================================
const SESSION_1_TOPIC_PROFILES = {
  fashion: {
    defaultBrand: 'UrbanVibe',
    icon: '👟',
    subHeadline: 'קולקציית הסטריט-וור והסניקרס החדשה של השנה',
    paragraphDesc: 'עיצובים מקוריים במהדורה מוגבלת, בד נושם ואיכות פרימיום ללא פשרות.',
    actionText: 'לרכישה מהקולקציה 🛒',
    imagePromptEn:
      'Futuristic glowing sneaker in a luxury neon streetwear store, professional product photography, 8k, no text',
    imagePromptHe: 'נעל סניקרס עתידנית וזוהרת בחנות אופנה יוקרתית עם תאורת ניאון, צילום מקצועי חד ללא טקסט'
  },
  gaming: {
    defaultBrand: 'CyberArena',
    icon: '🎮',
    subHeadline: 'זירת הגיימינג, הטורנירים והציוד המקצועי של ישראל',
    paragraphDesc: 'הצטרפו לאלפי גיימרים בקהילה המובילה, שדרגו את עמדת המשחק שלכם והתחרו בלייב.',
    actionText: 'הצטרף לטורניר עכשיו 🚀',
    imagePromptEn:
      'Futuristic gaming setup room with wide monitors, purple and blue RGB neon lights, cyber style, 8k, no text',
    imagePromptHe: 'חדר גיימינג עתידני עם מסכים רחבים ותאורת ניאון סגולה וכחולה, איכות גבוהה ללא טקסט'
  },
  food: {
    defaultBrand: 'BurgerBoss',
    icon: '🍔',
    subHeadline: 'ההמבורגר והאוכל הכי עסיסי בעיר — חם וטרי עד הבית!',
    paragraphDesc: '100% בשר איכותי, לחמניית בריוש קלויה במקום ורטבים סודיים בהכנה ביתית.',
    actionText: 'הזמן משלוח חם 🍔',
    imagePromptEn:
      'Juicy gourmet double cheeseburger with crispy fries on a rustic wooden table, restaurant photography, 8k, no text',
    imagePromptHe: 'המבורגר גורמה עסיסי כפול עם גבינה נמסה וצ׳יפס פריך על שולחן עץ במסעדה, צילום מקצועי ללא טקסט'
  },
  pets: {
    defaultBrand: 'HappyPaws',
    icon: '🐾',
    subHeadline: 'הבית החם לחיות מחמד, אימוץ חברים וציוד מפנק',
    paragraphDesc: 'כל מה שהכלב או החתול שלכם צריכים כדי להיות מאושרים, בריאים ושמחים.',
    actionText: 'הכירו את החברים שלנו 🐶',
    imagePromptEn:
      'Cute smiling golden retriever puppy and fluffy kitten on green grass in sunny park, 8k photography, no text',
    imagePromptHe: 'גור כלבים גולדן רטריבר חמוד מחייך בדשא ירוק בשמש, צילום חד וצבעוני ללא טקסט'
  },
  tech: {
    defaultBrand: 'NovaTech',
    icon: '🤖',
    subHeadline: 'גאדג׳טים חכמים, רובוטיקה וטכנולוגיית העתיד',
    paragraphDesc: 'המוצרים החדשניים ביותר בעולם הטכנולוגיה והבינה המלאכותית במקום אחד.',
    actionText: 'גלה את העתיד ⚡',
    imagePromptEn:
      'Friendly modern AI robot with holographic smartwatch in a bright high-tech lab, 8k render, no text',
    imagePromptHe: 'רובוט בינה מלאכותית ידידותי ומודרני במעבדת הייטק מוארת עם הולוגרמות, ללא טקסט'
  },
  sports: {
    defaultBrand: 'ChampZone',
    icon: '⚽',
    subHeadline: 'ציוד ספורט, אימונים וביצועים ברמה של אלופים',
    paragraphDesc: 'נעלי ריצה, בגדי אימון ותוכניות כושר שייקחו אתכם לקצה היכולת.',
    actionText: 'התחל להתאמן 🏆',
    imagePromptEn:
      'Illuminated Champions League soccer stadium at night with a pro soccer ball on the grass, 8k, no text',
    imagePromptHe: 'אצטדיון כדורגל מואר בלילה עם כדור מקצועי במרכז הדשא, צילום ספורט דרמטי ללא טקסט'
  },
  music: {
    defaultBrand: 'BeatWave',
    icon: '🎵',
    subHeadline: 'אולפן המוזיקה, הפלייליסטים וההופעות החיות',
    paragraphDesc: 'גלו אמנים חדשים, ציוד סאונד אולפני וחוויית מוזיקה בעוצמה שלא הכרתם.',
    actionText: 'האזן עכשיו 🎧',
    imagePromptEn:
      'Professional music recording studio with glowing neon headphones, electric guitar and sound waves, 8k, no text',
    imagePromptHe: 'אולפן הקלטות מקצועי עם אוזניות מוארות בניאון, גיטרה חשמלית וגלי קול צבעוניים, ללא טקסט'
  }
};

// ============================================================================
// 🧰 כלי AI חיצוניים מומלצים לתלמידים (לטקסט, תמונות וצבעים)
// ============================================================================
const EXTERNAL_TEXT_AI_TOOLS = [
  { name: 'ChatGPT', icon: '💬', url: 'https://chatgpt.com', badge: 'מומלץ לטקסט ורעיונות' },
  { name: 'Google Gemini', icon: '✨', url: 'https://gemini.google.com', badge: 'חינמי ומהיר בעברית' },
  { name: 'Claude AI', icon: '🧠', url: 'https://claude.ai', badge: 'ניסוחים מעולים' },
  { name: 'Microsoft Copilot', icon: '🤖', url: 'https://copilot.microsoft.com', badge: 'טקסט + תמונות' }
];

const EXTERNAL_IMAGE_AI_TOOLS = [
  { name: 'ChatGPT Images', icon: '🎨', url: 'https://chatgpt.com', badge: 'יצירת תמונות בצ׳אט' },
  { name: 'Google Gemini', icon: '✨', url: 'https://gemini.google.com', badge: 'Imagen 3 חינמי' },
  { name: 'Leonardo.ai', icon: '🦁', url: 'https://app.leonardo.ai', badge: 'מדהים לתמונות אתרים' },
  { name: 'Bing Image Creator', icon: '🖼️', url: 'https://www.bing.com/images/create', badge: 'DALL-E 3 חינם' },
  { name: 'Ideogram.ai', icon: '🌈', url: 'https://ideogram.ai', badge: 'מעולה לבאנרים ולוגואים' },
  { name: 'Canva AI', icon: '🖌️', url: 'https://www.canva.com', badge: 'עיצוב ותמונות' }
];

const EXTERNAL_COLOR_AI_TOOLS = [
  { name: 'Coolors.co', icon: '🎨', url: 'https://coolors.co/generate', badge: 'מחולל פלטות צבעים' },
  { name: 'ChatGPT', icon: '💬', url: 'https://chatgpt.com', badge: 'בקשת קודי HEX' },
  { name: 'Google Gemini', icon: '✨', url: 'https://gemini.google.com', badge: 'התאמת צבעים למותג' }
];

const COLOR_PALETTES = [
  {
    id: 'ocean_tech',
    name: '🌊 כחול הייטק',
    pageBg: '#f0f9ff',
    cardBg: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#2563eb'
  },
  {
    id: 'cyber_night',
    name: '🌌 לילה ניאון',
    pageBg: '#0f172a',
    cardBg: '#1e293b',
    textColor: '#f8fafc',
    accentColor: '#8b5cf6'
  },
  {
    id: 'emerald_fresh',
    name: '🌿 ירוק אמרלד',
    pageBg: '#ecfdf5',
    cardBg: '#ffffff',
    textColor: '#064e3b',
    accentColor: '#10b981'
  },
  {
    id: 'sunset_fire',
    name: '🔥 כתום אנרגטי',
    pageBg: '#fff7ed',
    cardBg: '#ffffff',
    textColor: '#431407',
    accentColor: '#ea580c'
  },
  {
    id: 'royal_pink',
    name: '👑 ורוד-סגול',
    pageBg: '#fdf2f8',
    cardBg: '#ffffff',
    textColor: '#500724',
    accentColor: '#db2777'
  }
];

export function getTopicProfile(studentIdea) {
  const ideaId = studentIdea?.ideaId || 'gaming';
  const base = SESSION_1_TOPIC_PROFILES[ideaId] || SESSION_1_TOPIC_PROFILES.gaming;
  const brand = (studentIdea?.customBrandName || '').trim() || base.defaultBrand;
  const topic = (studentIdea?.customTopic || '').trim() || base.subHeadline;
  return {
    ...base,
    ideaId,
    brand,
    topic
  };
}

// ============================================================================
// 🎓 בניית 20 הצעדים ההגיוניים של מפגש 1: הכרטיסייה הראשונה של האתר שלי!
// מופרדים ב-100% בין מסלול בלוקים (WebBlocks) למסלול קוד פתוח (HTML & CSS)
// ============================================================================
export function buildSession1StepsList(
  studentIdea,
  isCodeTrack,
  palette,
  customSlogan,
  customDesc,
  customBtnText
) {
  const p = getTopicProfile(studentIdea);
  const { brand, icon, topic } = p;
  const pal = palette || COLOR_PALETTES[0];
  const slogan = customSlogan || p.subHeadline;
  const desc = customDesc || p.paragraphDesc;
  const btnText = customBtnText || p.actionText;

  // ==========================================================================
  // 🧩 מסלול א': מפגש 1 לפי היגיון HTML5 — שלד הדף ומערכת העיצוב של המותג (8 צעדים ממוקדים)
  // ==========================================================================
  if (!isCodeTrack) {
    return [
      {
        stepNum: 1,
        groupTitle: '1. רעיון ומותג',
        kind: 'ai_brand_step',
        type: 'ai',
        isAI: true,
        title: 'בחירת נושא האתר ושם המותג',
        whyLogical: 'בוחרים תחום ושם מותג לאתר בעזרת AI (ולצידו פותחים תיקייה בשם "האתר שלי" על שולחן העבודה).',
        aiTools: EXTERNAL_TEXT_AI_TOOLS,
        promptToCopy: `אני בונה אתר בנושא "${topic}". הצע לי 5 שמות קצרים וקליטים למותג + סלוגן של עד 6 מילים.`,
        taskInstruction: 'בחר נושא למטה, התייעץ עם AI אם תרצה, ורשום את שם המותג שלך.'
      },
      {
        stepNum: 2,
        groupTitle: '2. כניסה לסביבה',
        kind: 'launch_workspace',
        type: 'blocks',
        title: 'פתיחת WebBlocks Pro בטאב מקביל',
        whyLogical: 'סביבת הבלוקים בנויה משמאל לימין (LTR): קטגוריות משמאל, בלוקים באמצע, ותצוגה חיה + עיצוב CSS מימין.',
        taskInstruction: 'פתח את WebBlocks בטאב חדש, לחץ למעלה על "✨ כלים ו-AI" ⬅️ "🧹 נקה והתחל מדף ראשי נקי", וחזור לכאן.'
      },
      {
        stepNum: 3,
        groupTitle: '3. שורש ה-HTML',
        kind: 'blocks_step',
        type: 'blocks',
        title: 'שורש המסמך (<body>): דף ראשי (Container)',
        whyLogical: 'כמו באתרי Apple ו-Stripe, כל דף מתחיל במעטפת <body> שקובעת רקע, גופן ורוחב.',
        toolboxCategory: '🧱 מבנה ופריסה',
        searchHint: 'דף ראשי',
        blockColor: '#0f172a',
        blockType: 'web_page_container',
        blockXml: `<block type="web_page_container"><field name="BG_COLOR">${pal.pageBg}</field><field name="FONT">Heebo, sans-serif</field></block>`,
        blockTitle: '📄 דף ראשי (Container)',
        blockFields: [
          { label: 'רקע', value: `צבע פתיחה לבחירתך (כגון ${pal.pageBg})` },
          { label: 'גופן ורוחב', value: 'Heebo / Rubik • רוחב 1140px' }
        ],
        designFreedomTip: 'תוכל לשנות רקע וגופן בכל רגע ב-🎨 עיצוב CSS ⬅️ 🎨 צבעים / ✍️ גופן.',
        taskInstruction: 'גרור מקטגוריית "🧱 מבנה ופריסה" את "📄 דף ראשי (Container)" ובחר רקע וגופן למותג שלך.'
      },
      {
        stepNum: 4,
        groupTitle: '4. שלד סמנטי',
        kind: 'blocks_step',
        type: 'blocks',
        title: 'חלוקת הדף ל-3 אזורים: <header>, <main>, <footer>',
        whyLogical: 'שלד HTML5 תקני מחלק את העמוד לראש (<header>), תוכן ראשי (<main>) ותחתית (<footer>) — כך גוגל וקוראי מסך מבינים את האתר.',
        toolboxCategory: '🧱 מבנה ופריסה',
        searchHint: 'אזור סמנטי',
        blockColor: '#0f172a',
        blockType: 'web_semantic_container',
        blockXml: `<block type="web_semantic_container"><field name="TAG">header</field><next><block type="web_semantic_container"><field name="TAG">main</field><next><block type="web_semantic_container"><field name="TAG">footer</field></block></next></block></next></block>`,
        blockTitle: '🧱 אזור סמנטי (Semantic Container)',
        blockFields: [
          { label: 'איפה מחברים?', value: 'בתוך "תוכן הדף:" של דף ראשי' },
          { label: '3 האזורים', value: 'ראשון: header • שני: main • שלישי: footer' }
        ],
        designFreedomTip: 'פתח את טאב "🌳 שכבות" מימין וראה את 3 האזורים מסודרים ברצף.',
        taskInstruction: 'גרור 3 בלוקים של "🧱 אזור סמנטי" אחד מתחת לשני בתוך דף ראשי, וקבע אותם ל-header, main ו-footer.'
      },
      {
        stepNum: 5,
        groupTitle: '5. ריווח והפרדה',
        kind: 'blocks_step',
        type: 'blocks',
        title: 'נשימה והפרדה בין אזורים (Spacer ו-Divider)',
        whyLogical: 'אוויר ורווחים נקיים בין אזורים הם ההבדל בין אתר צפוף לעיצוב יוקרתי.',
        toolboxCategory: '🧱 מבנה ופריסה',
        searchHint: 'מרווח קו',
        blockColor: '#0f172a',
        blockType: 'web_spacer',
        blockXml: `<block type="web_spacer"><next><block type="web_divider"></block></next></block>`,
        blockTitle: '↕️ מרווח ריק + ➖ קו מפריד',
        blockFields: [
          { label: 'מרווח ריק', value: 'מוסיף רווח גמיש בין אזורים' },
          { label: 'קו מפריד', value: 'קו אופקי דק ועדין' }
        ],
        designFreedomTip: 'ב-📏 מידות תוכל לשנות את הגובה והצבע של המפריד לפי הסגנון שלך.',
        taskInstruction: 'שלב "↕️ מרווח ריק" או "➖ קו מפריד" בין האזורים כדי שהדף יהיה מאוורר ונקי.'
      },
      {
        stepNum: 6,
        groupTitle: '6. פלטת המותג',
        kind: 'ai_palette_step',
        type: 'ai',
        isAI: true,
        title: 'בחירת הסגנון והצבעים של האתר שלך',
        whyLogical: 'לפני שממלאים תוכן במפגש 2, בוחרים שפה עיצובית: מינימליסטי בהיר (Apple), טכנולוגי כהה (Linear) או צבעוני (Shopify).',
        aiTools: EXTERNAL_COLOR_AI_TOOLS,
        promptToCopy: `הצע 3 צבעים (קוד HEX) לאתר "${brand}" בנושא "${topic}": רקע ראשי, רקע כרטיס וצבע כפתור בולט.`,
        taskInstruction: 'בחר אחת מ-5 הפלטות למטה (או התייעץ עם AI) ולמד את קודי הצבע שלה.'
      },
      {
        stepNum: 7,
        groupTitle: '7. סטודיו CSS3',
        kind: 'blocks_step',
        type: 'design',
        title: 'היכרות עם 🎨 עיצוב CSS מימין (8 לשוניות)',
        whyLogical: 'בחירת כל אזור בתצוגה החיה או ב-🌳 שכבות פותחת מיד 8 לשוניות CSS3 לעיצוב עצמאי מוחלט.',
        toolboxCategory: '🎨 עיצוב CSS (פאנל ימני)',
        searchHint: 'עיצוב CSS',
        blockColor: '#7c3aed',
        blockType: 'web_page_container',
        blockTitle: 'סטודיו CSS3 — עיצוב לפי בחירתך',
        blockFields: [
          { label: 'צבע + רקע', value: `לשונית 🎨 צבעים (${pal.pageBg})` },
          { label: 'טיפוגרפיה ורווחים', value: 'לשוניות ✍️ גופן ו-📏 מידות' }
        ],
        designStudioGuide: {
          selectedBlockName: '📄 דף ראשי / 🧱 אזורים',
          activeTabs: ['🎨 צבעים', '✍️ גופן', '📏 מידות'],
          settings: [
            { tab: '🎨 צבעים', label: 'צבע רקע של הדף', value: pal.pageBg },
            { tab: '✍️ גופן', label: 'גופן ראשי למותג', value: 'Heebo / Rubik' }
          ]
        },
        designFreedomTip: 'לשוניות מומלצות עכשיו: 🎨 צבעים • ✍️ גופן • 📏 מידות (הסגנון הוא 100% שלך!).',
        taskInstruction: 'בחר את האזורים בתצוגה החיה או ב-🌳 שכבות, ושנה את צבע הרקע והגופן ב-🎨 עיצוב CSS.'
      },
      {
        stepNum: 8,
        groupTitle: '8. שמירה והמשך',
        kind: 'blocks_step',
        type: 'save',
        title: 'בדיקת 3 מסכים ושמירת שלד הבסיס (index.html)',
        whyLogical: 'השלד הסמנטי מוכן! במפגש הבא נכנס לתוך <header> ונבנה סרגל ניווט עליון מלא.',
        toolboxCategory: 'סרגל עליון (🖥️ 📟 📱 + 📂 קובץ)',
        searchHint: 'הורד HTML',
        blockColor: '#059669',
        blockType: 'web_semantic_container',
        blockXml: `<block type="web_page_container"><statement name="CHILDREN"><block type="web_semantic_container"><field name="TAG">header</field><next><block type="web_semantic_container"><field name="TAG">main</field><next><block type="web_semantic_container"><field name="TAG">footer</field></block></next></block></next></block></statement></block>`,
        blockTitle: 'שלד דף הבית המושלם שלך',
        blockFields: [
          { label: 'בדיקת מסכים', value: '🖥️ מחשב ➔ 📟 טאבלט ➔ 📱 מובייל' },
          { label: 'שמירה', value: '📂 קובץ ⬅️ 📥 הורד קובץ HTML' }
        ],
        taskInstruction: 'בדוק את השלד ב-3 גדלי מסך למעלה ושמור את index.html דרך "📂 קובץ".'
      }
    ];
  }

  // ==========================================================================
  // 💻 מסלול ב': 20 צעדים הגיוניים בקוד פתוח בלבד (HTML & CSS — ללא בלוקים!)
  // ==========================================================================
  return [
    {
      stepNum: 1,
      groupTitle: 'שלב א׳: תיקיית הפרויקט והקונספט',
      kind: 'folder_setup',
      type: 'save',
      title: 'יצירת תיקיית פרויקט אישית במחשב ("האתר שלי") 📁',
      whyLogical: 'בעולם פיתוח האתרים בקוד פתוח, קובץ ה-HTML וכל התמונות של האתר חייבים לשבת יחד באותה תיקייה במחשב כדי שהקוד יוכל להציג את התמונות.',
      folderSteps: [
        'עבור ל"שולחן העבודה" (Desktop) במחשב שלך.',
        'לחץ קליק ימני בעכבר על מקום ריק ⬅️ בחר "חדש" (New) ⬅️ "תיקייה" (Folder).',
        'תן לתיקייה את השם: "האתר שלי" (למשל: האתר שלי - ' + brand + ').',
        'בתוך התיקייה הזו נשמור היום את התמונות שניצור ב-AI ואת קובץ ה-index.html שלנו!'
      ],
      taskInstruction: 'פתח עכשיו על שולחן העבודה במחשב תיקייה חדשה בשם "האתר שלי" וסמן שהצלחת!'
    },
    {
      stepNum: 2,
      groupTitle: 'שלב א׳: תיקיית הפרויקט והקונספט',
      kind: 'ai_brand_step',
      type: 'ai',
      isAI: true,
      title: 'בחירת נושא האתר ויצירת שם מותג בצ׳אט AI 💡',
      whyLogical: 'לפני שכותבים את שורת הקוד הראשונה של הכרטיסייה שלנו, נחליט על מה האתר ונעזר בצ׳אט AI כדי לבחור שם מותג מנצח.',
      aiTools: EXTERNAL_TEXT_AI_TOOLS,
      promptToCopy: `אני תלמיד שבונה אתר אינטרנט חדש בנושא "${topic}". תציע לי 5 שמות קצרים, קליטים ומגניבים למותג של האתר שלי, ולכל שם תסביר במשפט קצר למה הוא מתאים.`,
      saveExplanation: 'לאחר שבחרת שם מתשובת ה-AI, הקלד אותו בתיבה למטה כדי שכל דוגמאות הקוד בהמשך יתאימו לשם האתר שלך!',
      taskInstruction: 'בחר את נושא האתר, העתק את הפרומפט לצ׳אט ה-AI (ChatGPT / Gemini), ורשום למטה את שם המותג שבחרת.'
    },
    {
      stepNum: 3,
      groupTitle: 'שלב א׳: תיקיית הפרויקט והקונספט',
      kind: 'launch_workspace',
      type: 'blocks',
      title: 'פתיחת עורך הקוד הפתוח (HTML Studio) בטאב מקביל 🚀',
      whyLogical: 'בעורך הקוד הפתוח שבמערכת נכתוב את הקוד צעד-אחר-צעד ונראה בצד שמאל של העורך את התצוגה החיה של האתר מתעדכנת מיד!',
      taskInstruction: 'לחץ על הכפתור הירוק למטה כדי לפתוח את עורך הקוד הפתוח בטאב חדש בדפדפן, ואז חזור לטאב הזה כדי להתחיל בצעד 4.'
    },
    {
      stepNum: 4,
      groupTitle: 'שלב ב׳: שלד הדף והכרטיסייה הראשונה ב-HTML',
      kind: 'code_step',
      type: 'blocks',
      title: 'הכרת גוף הדף: תגית הפתיחה <body> ותגית הסגירה </body> 💻',
      whyLogical: 'ב-HTML, כל תוכן שאנחנו רוצים שיופיע על מסך האתר (כותרות, כרטיסיות, תמונות וכפתורים) חייב להיכתב בין תגית הפתיחה <body> לתגית הסגירה </body>.',
      codeLocation: 'בעורך הקוד הפתוח',
      codeSnippet: `<body>\n\n</body>`,
      taskInstruction: 'בעורך הקוד הפתוח שפתחת, ודא שמופיעה תגית הפתיחה <body> בראש העורך ותגית הסגירה </body> מתחתיה.'
    },
    {
      stepNum: 5,
      groupTitle: 'שלב ב׳: שלד הדף והכרטיסייה הראשונה ב-HTML',
      kind: 'code_step',
      type: 'blocks',
      title: 'יצירת מסגרת הכרטיסייה הראשונה: <div class="card"> 📦',
      whyLogical: 'אנחנו בונים היום את הכרטיסייה הראשונה של האתר! ב-HTML תגית <div> יוצרת "קופסה" שמאגדת מספר אלמנטים יחד. אנו נותנים לה את השם class="card" כדי שנוכל לעצב אותה בהמשך.',
      codeLocation: 'בתוך ה-<body>',
      codeSnippet: `<body>\n  <div class="card">\n\n  </div>\n</body>`,
      taskInstruction: 'בתוך ה-<body> בעורך הקוד, כתוב תגית פתיחה <div class="card"> ומתחתיה תגית סגירה </div>.'
    },
    {
      stepNum: 6,
      groupTitle: 'שלב ג׳: כותרות הכרטיסייה וטקסט מ-AI',
      kind: 'code_step',
      type: 'blocks',
      title: 'כתיבת הכותרת הראשית <h1> בתוך הכרטיסייה 🔤',
      whyLogical: 'תגית <h1> (Heading 1) היא הכותרת הראשית והחשובה ביותר בכרטיסייה שלנו, ולכן נכתוב בתוכה את שם המותג של האתר.',
      codeLocation: 'בתוך <div class="card">',
      codeSnippet: `<body>\n  <div class="card">\n    <h1>${brand} ${icon}</h1>\n  </div>\n</body>`,
      taskInstruction: `בתוך ה-<div class="card">, הוסף שורה חדשה וכתוב: <h1>${brand} ${icon}</h1>. תראה מיד את הכותרת מופיעה בתצוגה החיה של עורך הקוד!`
    },
    {
      stepNum: 7,
      groupTitle: 'שלב ג׳: כותרות הכרטיסייה וטקסט מ-AI',
      kind: 'ai_slogan_step',
      type: 'ai',
      isAI: true,
      title: 'יצירת משפט פתיחה (סלוגן) לכרטיסייה בצ׳אט AI 💬',
      whyLogical: 'מתחת לכותרת הראשית <h1> אנחנו רוצים להוסיף כותרת משנה <h2> עם סלוגן קצר ומושך שניצור בעזרת צ׳אט AI.',
      aiTools: EXTERNAL_TEXT_AI_TOOLS,
      promptToCopy: `לאתר שלי קוראים "${brand}" והוא עוסק ב-"${topic}". כתוב לי 3 הצעות לסלוגן קצר, מלהיב וקליט בעברית (עד 8 מילים) שיופיע ככותרת משנה בכרטיסייה הראשונה של האתר.`,
      saveExplanation: 'העתק את הסלוגן שהכי אהבת מתשובת ה-AI והדבק אותו בתיבה למטה (מומלץ גם לשמור אותו בקובץ טקסט בתיקיית "האתר שלי").',
      taskInstruction: 'העתק את הפרומפט לצ׳אט ה-AI (ChatGPT / Gemini), בחר את הסלוגן שהכי אהבת והדבק אותו בתיבה למטה.'
    },
    {
      stepNum: 8,
      groupTitle: 'שלב ג׳: כותרות הכרטיסייה וטקסט מ-AI',
      kind: 'code_step',
      type: 'blocks',
      title: 'כתיבת כותרת המשנה <h2> עם הסלוגן מתחת ל-<h1> ✍️',
      whyLogical: 'תגית <h2> מציגה כותרת משנה קצת יותר קטנה מתחת לכותרת הראשית. נכניס לתוכה את הסלוגן שהבאנו מה-AI.',
      codeLocation: 'מתחת ל-<h1> בתוך <div class="card">',
      codeSnippet: `  <div class="card">\n    <h1>${brand} ${icon}</h1>\n    <h2>${slogan}</h2>\n  </div>`,
      taskInstruction: `בעורך הקוד, מתחת לתגית ה-<h1>, הוסף שורה חדשה וכתוב: <h2>${slogan}</h2>.`
    },
    {
      stepNum: 9,
      groupTitle: 'שלב ד׳: יצירת תמונה ב-AI ושמירתה בתיקייה במחשב',
      kind: 'ai_image_step',
      type: 'ai',
      isAI: true,
      title: 'יצירת תמונת דגל בכלי AI ושמירתה בתיקיית "האתר שלי" 🎨',
      whyLogical: 'כדי להציג תמונה בקוד HTML, אנחנו יוצרים את התמונה בכלי AI ושומרים אותה כקובץ (banner.jpg) בתוך תיקיית "האתר שלי" במחשב.',
      aiTools: EXTERNAL_IMAGE_AI_TOOLS,
      promptToCopy: p.imagePromptEn,
      promptToCopyHe: p.imagePromptHe,
      saveSteps: [
        'היכנס לאחד מכלי התמונות למטה (ChatGPT, Gemini, Leonardo.ai או Bing Image Creator) והדבק את הפרומפט.',
        'לאחר שה-AI יצר את התמונה, לחץ על כפתור ההורדה (Download 📥) או קליק ימני על התמונה ⬅️ "שמור תמונה בשם..." (Save image as...).',
        'בחלון השמירה במחשב, היכנס לתיקיית "האתר שלי" שפתחנו על שולחן העבודה בצעד 1.',
        'שמור את התמונה בשם קצר ופשוט באנגלית: banner.jpg'
      ],
      taskInstruction: 'צור תמונה בכלי ה-AI ושמור אותה בתוך תיקיית "האתר שלי" במחשב בשם banner.jpg.'
    },
    {
      stepNum: 10,
      groupTitle: 'שלב ד׳: יצירת תמונה ב-AI ושמירתה בתיקייה במחשב',
      kind: 'code_step',
      type: 'blocks',
      title: 'העלאת התמונה לעורך וכתיבת תגית התמונה <img> 🖼️',
      whyLogical: 'ברגע שאנחנו מעלים את banner.jpg לעורך הקוד וכותבים <img src="banner.jpg">, הדפדפן שואב את התמונה ומציג אותה מיד בכרטיסייה שלנו!',
      codeLocation: 'מתחת ל-<h2> בתוך <div class="card">',
      codeSnippet: `  <div class="card">\n    <h1>${brand} ${icon}</h1>\n    <h2>${slogan}</h2>\n    <img src="banner.jpg" alt="${brand}">\n  </div>`,
      taskInstruction: '1. בעורך הקוד לחץ למעלה על הכפתור הסגול "🖼️ העלה תמונה מהמחשב לאתר" ובחר את הקובץ banner.jpg מתיקיית "האתר שלי". 2. מתחת ל-<h2> כתוב את השורה: <img src="banner.jpg" alt="' + brand + '">'
    },
    {
      stepNum: 11,
      groupTitle: 'שלב ה׳: פסקת תיאור וכפתור פעולה ב-HTML',
      kind: 'ai_paragraph_step',
      type: 'ai',
      isAI: true,
      title: 'כתיבת פסקת הסבר קצרה בצ׳אט AI עבור הכרטיסייה 📝',
      whyLogical: 'מתחת לתמונה נוסיף פסקת טקסט קצרה (2 משפטים) שמסבירה לגולש מה הוא ימצא באתר שלנו.',
      aiTools: EXTERNAL_TEXT_AI_TOOLS,
      promptToCopy: `כתוב לי פסקה קצרה ומושכת של 2 משפטים בלבד עבור הכרטיסייה הראשונה באתר "${brand}" שעוסק ב-"${topic}". כתוב בעברית קלילה שמדברת לגולשים.`,
      saveExplanation: 'העתק את הפסקה מתשובת ה-AI והדבק אותה בתיבה למטה.',
      taskInstruction: 'בקש מצ׳אט ה-AI פסקה של 2 משפטים לאתר שלך והדבק אותה בתיבה למטה.'
    },
    {
      stepNum: 12,
      groupTitle: 'שלב ה׳: פסקת תיאור וכפתור פעולה ב-HTML',
      kind: 'code_step',
      type: 'blocks',
      title: 'כתיבת תגית פסקה <p> מתחת לתמונה 📄',
      whyLogical: 'ב-HTML תגית <p> (קיצור של Paragraph) משמשת להצגת פסקאות טקסט קריאות ומסודרות.',
      codeLocation: 'מתחת לתגית ה-<img> בתוך הכרטיסייה',
      codeSnippet: `    <img src="banner.jpg" alt="${brand}">\n    <p>${desc}</p>`,
      taskInstruction: `מתחת לתגית ה-<img> בעורך הקוד, הוסף שורה חדשה וכתוב: <p>${desc}</p>.`
    },
    {
      stepNum: 13,
      groupTitle: 'שלב ה׳: פסקת תיאור וכפתור פעולה ב-HTML',
      kind: 'code_step',
      type: 'blocks',
      title: 'הוספת כפתור פעולה <button> בתחתית הכרטיסייה 🔘',
      whyLogical: 'כדי להשלים את מבנה הכרטיסייה הראשונה, נוסיף בתחתיתה כפתור לחיץ באמצעות תגית <button>.',
      codeLocation: 'מתחת לתגית ה-<p> בתוך הכרטיסייה',
      codeSnippet: `    <p>${desc}</p>\n    <button>${btnText}</button>\n  </div>`,
      taskInstruction: `מתחת לתגית ה-<p>, הוסף שורה חדשה וכתוב: <button>${btnText}</button>.`
    },
    {
      stepNum: 14,
      groupTitle: 'שלב ו׳: עיצוב הכרטיסייה ב-CSS צעד-אחר-צעד',
      kind: 'ai_palette_step',
      type: 'design',
      title: 'בחירת פלטת צבעים (קודי HEX) לעיצוב הכרטיסייה 🎨',
      whyLogical: 'סיימנו לכתוב את כל ה-HTML של הכרטיסייה הראשונה! עכשיו נעצב אותה ב-CSS כדי שתיראה מדהים. לשם כך נבחר קודי צבעים (כמו #2563eb).',
      aiTools: EXTERNAL_COLOR_AI_TOOLS,
      promptToCopy: `אני מעצב ב-CSS כרטיסייה ראשונה לאתר "${brand}" שעוסק ב-"${topic}". תציע לי פלטת צבעים מקצועית עם 4 קודי HEX מדויקים: 1. צבע רקע לדף (body), 2. צבע רקע לכרטיסייה (.card), 3. צבע טקסט, 4. צבע הדגשה לכותרת (h1) ולכפתור (button).`,
      taskInstruction: 'בחר אחת מפלטות הצבעים המוכנות למטה (או היעזר ב-Coolors / צ׳אט ה-AI) כדי שקודי הצבעים יתעדכנו אוטומטית בדוגמאות ה-CSS של צעדים 15–19.'
    },
    {
      stepNum: 15,
      groupTitle: 'שלב ו׳: עיצוב הכרטיסייה ב-CSS צעד-אחר-צעד',
      kind: 'code_step',
      type: 'design',
      title: 'פתיחת תגית <style> ועיצוב רקע הדף (body) 🖌️',
      whyLogical: 'מתחת לתגית הסגירה </body> אנחנו פותחים אזור <style>. שם כותבים פקודות CSS שצובעות את רקע הדף (background-color) וממרכזות את הטקסט (text-align: center).',
      codeLocation: 'מתחת ל-</body> בעורך הקוד',
      codeSnippet: `<style>\n  body {\n    background-color: ${pal.pageBg};\n    color: ${pal.textColor};\n    font-family: Arial, sans-serif;\n    text-align: center;\n    padding: 30px;\n  }\n</style>`,
      taskInstruction: 'מתחת לתגית </body> בעורך הקוד, פתח תגית <style> ו-</style> וכתוב בתוכה את עיצוב ה-body כפי שמופיע בדוגמה.'
    },
    {
      stepNum: 16,
      groupTitle: 'שלב ו׳: עיצוב הכרטיסייה ב-CSS צעד-אחר-צעד',
      kind: 'code_step',
      type: 'design',
      title: 'עיצוב קופסת הכרטיסייה (.card) עם פינות עגולות וצל ✨',
      whyLogical: 'בגלל שנתנו לקופסה שלנו class="card", ב-CSS נפנה אליה עם נקודה בהתחלה (.card) וניתן לה רקע נקי, רוחב מוגדר (max-width), ריווח פנימי (padding), פינות עגולות (border-radius) וצל (box-shadow).',
      codeLocation: 'בתוך ה-<style> מתחת ל-body',
      codeSnippet: `  .card {\n    background-color: ${pal.cardBg};\n    max-width: 560px;\n    margin: 0 auto;\n    padding: 28px;\n    border-radius: 24px;\n    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);\n  }`,
      taskInstruction: 'בתוך תגית ה-<style>, הוסף את כלל העיצוב .card וראה בתצוגה החיה של העורך איך נוצרת כרטיסייה מעוצבת במרכז המסך!'
    },
    {
      stepNum: 17,
      groupTitle: 'שלב ו׳: עיצוב הכרטיסייה ב-CSS צעד-אחר-צעד',
      kind: 'code_step',
      type: 'design',
      title: 'עיצוב הכותרת הראשית (h1) וכותרת המשנה (h2) ב-CSS 🎨',
      whyLogical: 'נצבע את הכותרת הראשית h1 בצבע ההדגשה של המותג (color) ונגדיל אותה ל-36 פיקסלים (font-size: 36px), ונקבע את גודל כותרת המשנה h2.',
      codeLocation: 'בתוך ה-<style>',
      codeSnippet: `  h1 {\n    color: ${pal.accentColor};\n    font-size: 36px;\n    margin-bottom: 8px;\n  }\n  h2 {\n    font-size: 20px;\n    margin-bottom: 18px;\n  }`,
      taskInstruction: 'הוסף בתוך ה-<style> את הגדרות העיצוב עבור h1 ועבור h2.'
    },
    {
      stepNum: 18,
      groupTitle: 'שלב ו׳: עיצוב הכרטיסייה ב-CSS צעד-אחר-צעד',
      kind: 'code_step',
      type: 'design',
      title: 'עיצוב התמונה (img) והפסקה (p) בתוך הכרטיסייה 🖼️',
      whyLogical: 'נגדיר לתמונה רוחב של 100% מרוחב הכרטיסייה ופינות מעוגלות של 16px, ונגדיר לפסקה גודל כתב נעים וגובה שורה מרווח (line-height).',
      codeLocation: 'בתוך ה-<style>',
      codeSnippet: `  img {\n    width: 100%;\n    max-height: 280px;\n    object-fit: cover;\n    border-radius: 16px;\n    margin-bottom: 16px;\n  }\n  p {\n    font-size: 17px;\n    line-height: 1.6;\n    margin-bottom: 22px;\n  }`,
      taskInstruction: 'הוסף בתוך ה-<style> את הגדרות העיצוב עבור img ועבור p.'
    },
    {
      stepNum: 19,
      groupTitle: 'שלב ו׳: עיצוב הכרטיסייה ב-CSS צעד-אחר-צעד',
      kind: 'code_step',
      type: 'design',
      title: 'עיצוב כפתור הפעולה (button) בצבע המותג 🔘',
      whyLogical: 'נעצב את הכפתור עם צבע רקע בולט (background-color), טקסט לבן, ללא מסגרת אפורה (border: none), ריווח פנימי (padding) ופינות עגולות.',
      codeLocation: 'בתוך ה-<style>',
      codeSnippet: `  button {\n    background-color: ${pal.accentColor};\n    color: #ffffff;\n    border: none;\n    padding: 14px 28px;\n    border-radius: 12px;\n    font-size: 17px;\n    font-weight: bold;\n    cursor: pointer;\n  }`,
      taskInstruction: 'הוסף בתוך ה-<style> את כלל העיצוב עבור button וראה בתצוגה החיה של העורך איך הכפתור מקבל עיצוב יוקרתי!'
    },
    {
      stepNum: 20,
      groupTitle: 'שלב ז׳: שמירת האתר בתיקיית הפרויקט במחשב',
      kind: 'code_step',
      type: 'save',
      showFullStarterCode: true,
      title: 'שמירת קובץ ה-index.html בתיקיית "האתר שלי" ופתיחתו בדפדפן! 🏆',
      whyLogical: 'כאשר שומרים את הקובץ index.html בתוך תיקיית "האתר שלי" (בדיוק באותה תיקייה שבה נמצאת התמונה banner.jpg), הדפדפן במחשב יודע לחבר ביניהם ולהציג את האתר שלך בצורה מושלמת!',
      codeLocation: 'הקוד המלא של הכרטיסייה הראשונה שיצרנו היום',
      codeSnippet: `<body>\n  <div class="card">\n    <h1>${brand} ${icon}</h1>\n    <h2>${slogan}</h2>\n    <img src="banner.jpg" alt="${brand}">\n    <p>${desc}</p>\n    <button>${btnText}</button>\n  </div>\n</body>\n\n<style>\n  body {\n    background-color: ${pal.pageBg};\n    color: ${pal.textColor};\n    font-family: Arial, sans-serif;\n    text-align: center;\n    padding: 30px;\n  }\n  .card {\n    background-color: ${pal.cardBg};\n    max-width: 560px;\n    margin: 0 auto;\n    padding: 28px;\n    border-radius: 24px;\n    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);\n  }\n  h1 {\n    color: ${pal.accentColor};\n    font-size: 36px;\n    margin-bottom: 8px;\n  }\n  h2 {\n    font-size: 20px;\n    margin-bottom: 18px;\n  }\n  img {\n    width: 100%;\n    max-height: 280px;\n    object-fit: cover;\n    border-radius: 16px;\n    margin-bottom: 16px;\n  }\n  p {\n    font-size: 17px;\n    line-height: 1.6;\n    margin-bottom: 22px;\n  }\n  button {\n    background-color: ${pal.accentColor};\n    color: #ffffff;\n    border: none;\n    padding: 14px 28px;\n    border-radius: 12px;\n    font-size: 17px;\n    font-weight: bold;\n    cursor: pointer;\n  }\n</style>`,
      taskInstruction: '1. בעורך הקוד לחץ למעלה על הכפתור הירוק "📥 הורד למחשב". 2. העבר או שמור את הקובץ index.html לתוך תיקיית "האתר שלי" על שולחן העבודה (ליד banner.jpg). 3. לחץ פעמיים על הקובץ בתיקייה וראה את האתר שלך נפתח בדפדפן!'
    }
  ];
}

// שמירה על תאימות לייצוא הקיים
export function buildSession1RichSlides(studentIdea, isCodeTrack = false) {
  const steps = buildSession1StepsList(studentIdea, isCodeTrack);
  return steps.map((s, idx) => ({
    ...s,
    slideNumber: idx + 1,
    isRichSession1Slide: true,
    microIndex: idx + 1,
    totalMicroInSession: steps.length,
    badgeTitle: `צעד ${idx + 1} מתוך ${steps.length} • ${s.groupTitle}`,
    title: `צעד ${idx + 1}: ${s.title}`,
    summary: s.whyLogical,
    simpleExplanation: s.whyLogical,
    singleTask: s.taskInstruction,
    steps: [s.taskInstruction]
  }));
}

const STORAGE_KEY_S1_CHECKS_BLOCKS = 'smartstart_s1_20steps_blocks_v2';
const STORAGE_KEY_S1_CHECKS_CODE = 'smartstart_s1_20steps_code_v2';

// ============================================================================
// 🌟 רכיב מדריך 20 הצעדים של מפגש 1:
// - ללא תצוגה חיה במדריך (התצוגה החיה נמצאת בעורך הקוד / WebBlocks!)
// - ללא סוכן פנימי (הפניה לכלי AI זמינים + העתקת פרומפט + הסבר שמירה בתיקייה!)
// - הפרדה מוחלטת וברורה בין בלוקים לקוד פתוח!
// ============================================================================
export function Session1RichSlideView({
  studentIdea,
  setStudentIdea,
  activeTrack,
  setActiveTrack,
  launchChosenWorkspace,
  onCompleteSession1
}) {
  const isCodeTrack = activeTrack === 'code';
  const profile = getTopicProfile(studentIdea);

  const [stepNum, setStepNum] = useState(1);

  const [completedBlocksSteps, setCompletedBlocksSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_S1_CHECKS_BLOCKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedCodeSteps, setCompletedCodeSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_S1_CHECKS_CODE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_S1_CHECKS_BLOCKS, JSON.stringify(completedBlocksSteps));
    } catch {}
  }, [completedBlocksSteps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_S1_CHECKS_CODE, JSON.stringify(completedCodeSteps));
    } catch {}
  }, [completedCodeSteps]);

  const [customSlogan, setCustomSlogan] = useState(profile.subHeadline);
  const [customDesc, setCustomDesc] = useState(profile.paragraphDesc);
  const [customBtnText, setCustomBtnText] = useState(profile.actionText);
  const [selectedPaletteId, setSelectedPaletteId] = useState('ocean_tech');
  const [copiedId, setCopiedId] = useState(null);

  const palette =
    COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  const stepsList = buildSession1StepsList(
    studentIdea,
    isCodeTrack,
    palette,
    customSlogan,
    customDesc,
    customBtnText
  );

  const safeStepNum = Math.min(stepNum, stepsList.length);
  const currentStep = stepsList[safeStepNum - 1] || stepsList[0];
  const completedSteps = isCodeTrack ? completedCodeSteps : completedBlocksSteps;
  const isCurrentStepDone = completedSteps.includes(safeStepNum);

  const toggleStepDone = (num, forceTrue = false) => {
    if (isCodeTrack) {
      setCompletedCodeSteps((prev) => {
        if (forceTrue) return prev.includes(num) ? prev : [...prev, num];
        return prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num];
      });
    } else {
      setCompletedBlocksSteps((prev) => {
        if (forceTrue) return prev.includes(num) ? prev : [...prev, num];
        return prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num];
      });
    }
  };

  const handleCompleteCurrentAndNext = () => {
    toggleStepDone(safeStepNum, true);
    if (safeStepNum < stepsList.length) {
      setStepNum(safeStepNum + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCompleteSession1) {
      onCompleteSession1();
    }
  };

  const handleSelectTopic = (ideaObj) => {
    const newProfile = SESSION_1_TOPIC_PROFILES[ideaObj.id] || SESSION_1_TOPIC_PROFILES.gaming;
    if (setStudentIdea) {
      setStudentIdea({
        ideaId: ideaObj.id,
        customBrandName: ideaObj.defaultBrand,
        customTopic: ideaObj.description
      });
    }
    setCustomSlogan(newProfile.subHeadline);
    setCustomDesc(newProfile.paragraphDesc);
    setCustomBtnText(newProfile.actionText);
  };

  const handleCopyText = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <div
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        direction: 'rtl',
        fontFamily: "'Heebo', 'Segoe UI', Tahoma, sans-serif"
      }}
    >
      {/* =====================================================================
          1. כותרת נקייה + מד התקדמות דק ומינימליסטי
         ===================================================================== */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: isCodeTrack ? '#ecfdf5' : '#eff6ff',
                  color: isCodeTrack ? '#047857' : '#1d4ed8',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}
              >
                {isCodeTrack ? '💻 מפגש 1 • שלד הדף בקוד' : '✓ מסיימים היום: שלד דף הבית (<body>)'}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>
                {stepsList.length} צעדים
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.22rem', fontWeight: '900', color: '#0f172a' }}>
              פרויקט <bdi dir="ltr" style={{ color: '#2563eb' }}>{profile.brand}</bdi>
            </h2>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: '800'
            }}
          >
            <span style={{ color: '#10b981' }}>●</span>
            <span>הושלמו {completedSteps.length} מתוך {stepsList.length}</span>
          </div>
        </div>

        {/* סרגל צעדים דק ונקי */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {stepsList.map((st) => {
            const isActive = st.stepNum === safeStepNum;
            const isDone = completedSteps.includes(st.stepNum);
            return (
              <button
                key={st.stepNum}
                type="button"
                onClick={() => setStepNum(st.stepNum)}
                title={`צעד ${st.stepNum}: ${st.title}`}
                style={{
                  flex: isActive ? '1.6' : '1',
                  height: '32px',
                  borderRadius: '9px',
                  border: isActive
                    ? 'none'
                    : isDone
                    ? '1px solid #bbf7d0'
                    : '1px solid #e2e8f0',
                  background: isActive
                    ? isCodeTrack
                      ? '#059669'
                      : '#2563eb'
                    : isDone
                    ? '#ecfdf5'
                    : '#f8fafc',
                  color: isActive ? '#ffffff' : isDone ? '#047857' : '#64748b',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isDone && !isActive ? '✓' : st.stepNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. הכרטיסייה המרכזית של הצעד הנוכחי (נקייה, בהירה ומאווררת)
         ===================================================================== */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 28px rgba(15, 23, 42, 0.045)',
          overflow: 'hidden'
        }}
      >
        {/* כותרת הצעד */}
        <div
          style={{
            background: '#ffffff',
            padding: '20px 26px 16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  color: isCodeTrack ? '#059669' : '#2563eb',
                  fontSize: '0.78rem',
                  fontWeight: '900'
                }}
              >
                שלב {currentStep.stepNum} מתוך {stepsList.length}
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>
                {currentStep.groupTitle}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
              {currentStep.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => toggleStepDone(safeStepNum)}
            style={{
              background: isCurrentStepDone ? '#ecfdf5' : '#f8fafc',
              color: isCurrentStepDone ? '#047857' : '#475569',
              border: isCurrentStepDone ? '1px solid #86efac' : '1px solid #e2e8f0',
              padding: '7px 14px',
              borderRadius: '999px',
              fontWeight: '800',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            {isCurrentStepDone ? '✓ הושלם' : '○ סמן כבוצע'}
          </button>
        </div>

        {/* גוף הצעד */}
        <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: '600', color: '#475569', lineHeight: '1.6' }}>
            {currentStep.whyLogical}
          </p>

          {/* =================================================================
              צעד 1: פתיחת תיקייה במחשב ("האתר שלי")
             ================================================================= */}
          {currentStep.kind === 'folder_setup' && (
            <div
              style={{
                background: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ fontWeight: '900', fontSize: '1rem', color: '#065f46' }}>
                📁 איך פותחים את תיקיית הפרויקט במחשב (צעד-אחר-צעד):
              </div>
              {currentStep.folderSteps.map((fs, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontWeight: '800',
                    fontSize: '0.94rem',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      flexShrink: 0
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>{fs}</span>
                </div>
              ))}
            </div>
          )}

          {/* =================================================================
              צעד 2: בחירת נושא האתר + צ'אט AI לבחירת שם מותג
             ================================================================= */}
          {currentStep.kind === 'ai_brand_step' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
                  1. בחר את נושא האתר שלך:
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
                    gap: '8px'
                  }}
                >
                  {STUDENT_SITE_IDEAS.map((idea) => {
                    const isSelected = studentIdea?.ideaId === idea.id;
                    return (
                      <button
                        key={idea.id}
                        type="button"
                        onClick={() => handleSelectTopic(idea)}
                        style={{
                          padding: '10px',
                          borderRadius: '12px',
                          border: isSelected ? '2.5px solid #2563eb' : '1px solid #cbd5e1',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem' }}>{idea.icon}</div>
                        <div style={{ fontWeight: '900', fontSize: '0.83rem', color: '#0f172a', marginTop: '4px' }}>
                          {idea.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* הפניה לצ'אט AI חיצוני + פרומפט מוכן להעתקה */}
              <div
                style={{
                  background: '#f5f3ff',
                  border: '2px solid #c4b5fd',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#4c1d95' }}>
                  2. פתח אחד מכלי הצ׳אט של ה-AI והדבק בו את הפרומפט הבא כדי לקבל רעיונות לשם האתר:
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentStep.aiTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #a78bfa',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        textDecoration: 'none',
                        color: '#4c1d95',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{tool.icon}</span>
                      <span>פתח את {tool.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#7c3aed' }}>({tool.badge}) ↗️</span>
                    </a>
                  ))}
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #ddd6fe',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '220px', fontWeight: '800', fontSize: '0.92rem', color: '#1e1b4b' }}>
                    "{currentStep.promptToCopy}"
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentStep.promptToCopy, 'brand_prompt')}
                    style={{
                      background: copiedId === 'brand_prompt' ? '#16a34a' : '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      fontWeight: '900',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === 'brand_prompt' ? '✓ הפרומפט הועתק!' : '📋 העתק פרומפט ל-AI'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>
                  3. 🏷️ הקלד כאן את שם המותג שבחרת לאתר שלך:
                </label>
                <input
                  type="text"
                  value={studentIdea?.customBrandName || ''}
                  onChange={(e) =>
                    setStudentIdea &&
                    setStudentIdea((prev) => ({ ...prev, customBrandName: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '2px solid #93c5fd',
                    fontSize: '1rem',
                    fontWeight: '800',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              צעד 3: פתיחת סביבת הפיתוח בטאב מקביל
             ================================================================= */}
          {currentStep.kind === 'launch_workspace' && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: isCodeTrack ? '#ecfdf5' : '#eff6ff',
                  color: isCodeTrack ? '#059669' : '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem'
                }}
              >
                {isCodeTrack ? '💻' : '🧩'}
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.02rem', color: '#0f172a', maxWidth: '460px' }}>
                {isCodeTrack
                  ? 'פותחים את עורך הקוד הפתוח בטאב חדש (עם תצוגה חיה בצד)'
                  : 'פותחים את סביבת הבלוקים WebBlocks בטאב חדש (עם תצוגה חיה בצד)'}
              </div>
              <button
                type="button"
                onClick={() =>
                  launchChosenWorkspace && launchChosenWorkspace(isCodeTrack ? 'code' : 'blocks')
                }
                style={{
                  background: isCodeTrack ? '#059669' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '11px',
                  fontWeight: '800',
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)'
                }}
              >
                {isCodeTrack
                  ? 'פתח את עורך הקוד בטאב חדש ↗'
                  : 'פתח את סביבת WebBlocks בטאב חדש ↗'}
              </button>
            </div>
          )}

          {/* =================================================================
              צעדים 7 ו-11: יצירת טקסטים (סלוגן / פסקה) בצ'אט AI חיצוני
             ================================================================= */}
          {(currentStep.kind === 'ai_slogan_step' || currentStep.kind === 'ai_paragraph_step') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  background: '#f5f3ff',
                  border: '2px solid #c4b5fd',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#4c1d95' }}>
                  1. בחר צ׳אט AI זמין והדבק בו את הפרומפט המוכן:
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentStep.aiTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #a78bfa',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        textDecoration: 'none',
                        color: '#4c1d95',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#7c3aed' }}>↗️</span>
                    </a>
                  ))}
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #ddd6fe',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '220px', fontWeight: '800', fontSize: '0.94rem', color: '#1e1b4b' }}>
                    "{currentStep.promptToCopy}"
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentStep.promptToCopy, `prompt_${stepNum}`)}
                    style={{
                      background: copiedId === `prompt_${stepNum}` ? '#16a34a' : '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 16px',
                      borderRadius: '10px',
                      fontWeight: '900',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === `prompt_${stepNum}` ? '✓ הפרומפט הועתק!' : '📋 העתק פרומפט ל-AI'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '900', color: '#0f172a', marginBottom: '6px' }}>
                  2. ✍️ הדבק כאן את הטקסט שקיבלת מה-AI (כדי שנוסיף אותו לכרטיסייה בצעד הבא!):
                </label>
                <input
                  type="text"
                  value={currentStep.kind === 'ai_slogan_step' ? customSlogan : customDesc}
                  onChange={(e) =>
                    currentStep.kind === 'ai_slogan_step'
                      ? setCustomSlogan(e.target.value)
                      : setCustomDesc(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              צעד 9: יצירת תמונת דגל בכלי AI חיצוני ושמירתה בתיקייה במחשב
             ================================================================= */}
          {currentStep.kind === 'ai_image_step' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: '#fdf2f8',
                  border: '2px solid #f472b6',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.96rem', color: '#831843' }}>
                  1. בחר כלי AI ליצירת תמונות (חינמי) והדבק בו את הפרומפט:
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentStep.aiTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #f472b6',
                        borderRadius: '10px',
                        padding: '8px 13px',
                        textDecoration: 'none',
                        color: '#831843',
                        fontWeight: '900',
                        fontSize: '0.84rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#be185d' }}>({tool.badge}) ↗️</span>
                    </a>
                  ))}
                </div>

                {/* פרומפט בעברית */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fbcfe8',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '220px', fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    🇮🇱 <strong>פרומפט בעברית (ל-ChatGPT / Gemini):</strong> "{currentStep.promptToCopyHe}"
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentStep.promptToCopyHe, 'img_prompt_he')}
                    style={{
                      background: copiedId === 'img_prompt_he' ? '#16a34a' : '#db2777',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: '900',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === 'img_prompt_he' ? '✓ הועתק!' : '📋 העתק פרומפט בעברית'}
                  </button>
                </div>

                {/* פרומפט באנגלית */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fbcfe8',
                    borderRadius: '12px',
                    padding: '11px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div dir="ltr" style={{ flex: 1, minWidth: '220px', fontSize: '0.86rem', fontWeight: '700', color: '#334155', textAlign: 'left' }}>
                    🇺🇸 <strong>Prompt (ל-Leonardo / Ideogram):</strong> "{currentStep.promptToCopy}"
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentStep.promptToCopy, 'img_prompt_en')}
                    style={{
                      background: copiedId === 'img_prompt_en' ? '#16a34a' : '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: '900',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === 'img_prompt_en' ? '✓ הועתק!' : '📋 העתק פרומפט באנגלית'}
                  </button>
                </div>
              </div>

              {/* הסבר מדויק איפה ואיך לשמור את התמונה במחשב */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '2px solid #86efac',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.96rem', color: '#065f46' }}>
                  2. 📥 איפה שומרים את התמונה כדי שנוכל להעלות אותה לאתר?
                </div>
                {currentStep.saveSteps.map((st, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #bbf7d0',
                      borderRadius: '10px',
                      padding: '9px 14px',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      color: '#0f172a'
                    }}
                  >
                    {idx + 1}. {st}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              צעד 14: בחירת פלטת צבעים (עם הפניה לכלים חיצוניים + 5 פלטות מוכנות)
             ================================================================= */}
          {currentStep.kind === 'ai_palette_step' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: '#f5f3ff',
                  border: '1.5px solid #c4b5fd',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#4c1d95' }}>
                  רוצה להתייעץ עם AI או מחולל צבעים לבחירת צבעי המותג שלך?
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentStep.aiTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #a78bfa',
                        borderRadius: '9px',
                        padding: '7px 12px',
                        textDecoration: 'none',
                        color: '#4c1d95',
                        fontWeight: '800',
                        fontSize: '0.82rem'
                      }}
                    >
                      {tool.icon} {tool.name} ({tool.badge}) ↗️
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleCopyText(currentStep.promptToCopy, 'color_prompt')}
                    style={{
                      background: copiedId === 'color_prompt' ? '#16a34a' : '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '9px',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === 'color_prompt' ? '✓ הפרומפט הועתק!' : '📋 העתק פרומפט לבקשת צבעים מ-AI'}
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '900', fontSize: '0.92rem', color: '#0f172a', marginBottom: '8px' }}>
                  בחר את פלטת הצבעים לכרטיסייה שלך (קודי הצבעים יופיעו אוטומטית בצעדים 15–19):
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
                    gap: '10px'
                  }}
                >
                  {COLOR_PALETTES.map((pal) => {
                    const isSel = pal.id === selectedPaletteId;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedPaletteId(pal.id)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: isSel ? `2.5px solid ${pal.accentColor}` : '1px solid #cbd5e1',
                          background: isSel ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              background: pal.pageBg,
                              border: '1px solid #94a3b8'
                            }}
                          />
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '999px',
                              background: pal.accentColor
                            }}
                          />
                        </div>
                        <div style={{ fontWeight: '900', fontSize: '0.84rem', color: '#0f172a' }}>
                          {pal.name}
                        </div>
                        <div dir="ltr" style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>
                          {pal.pageBg} • {pal.accentColor}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              צעדי בנייה ועיצוב בבלוקים בלבד (WebBlocks — ללא ערבוב קוד!)
             ================================================================= */}
          {currentStep.kind === 'blocks_step' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* פס מיקום קצר */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {currentStep.toolboxCategory && (
                  <span
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1e3a8a',
                      borderRadius: '999px',
                      padding: '4px 12px',
                      fontSize: '0.82rem',
                      fontWeight: '800'
                    }}
                  >
                    📂 {currentStep.toolboxCategory}
                  </span>
                )}
                {currentStep.searchHint && (
                  <span
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      borderRadius: '999px',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '700'
                    }}
                  >
                    🔍 חיפוש: &quot;{currentStep.searchHint}&quot;
                  </span>
                )}
              </div>

              {/* תמונה אמיתית של הבלוק(ים) מתוך Blockly */}
              {currentStep.blockType && (
                <BlocklyVisualPreview
                  blockType={currentStep.blockType}
                  blockXml={currentStep.blockXml}
                  fallbackTitle={currentStep.blockTitle}
                  accentColor={currentStep.blockColor}
                  maxHeight={240}
                />
              )}

              {/* שדות קצרים וממוקדים (2–3 צ׳יפים נקיים) */}
              {currentStep.blockFields && currentStep.blockFields.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '8px'
                  }}
                >
                  {currentStep.blockFields.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '0.83rem'
                      }}
                    >
                      <div style={{ fontWeight: '900', color: '#0f172a', marginBottom: '2px' }}>
                        {f.label}
                      </div>
                      <div style={{ color: '#475569', fontWeight: '600' }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* תגית עיצוב בסטודיו — רק הלשוניות הרלוונטיות */}
              {(currentStep.designStudioGuide || currentStep.designFreedomTip) && (
                <div
                  style={{
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#581c87' }}>
                    🎨 {currentStep.designFreedomTip || 'עצב בחופשיות בסטודיו CSS3 מימין'}
                  </span>
                  {currentStep.designStudioGuide?.activeTabs && (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {currentStep.designStudioGuide.activeTabs.map((tabLabel) => (
                        <span
                          key={tabLabel}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #c4b5fd',
                            color: '#6d28d9',
                            borderRadius: '999px',
                            padding: '2px 9px',
                            fontSize: '0.76rem',
                            fontWeight: '900'
                          }}
                        >
                          {tabLabel}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              צעדי כתיבת קוד ועיצוב בקוד פתוח בלבד (HTML & CSS — ללא העתקת קוד!)
             ================================================================= */}
          {currentStep.kind === 'code_step' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  background: '#0f172a',
                  borderRadius: '14px',
                  border: '2px solid #10b981',
                  overflow: 'hidden',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              >
                <div
                  style={{
                    background: '#1e293b',
                    padding: '9px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    color: '#34d399',
                    fontSize: '0.84rem',
                    fontWeight: '900'
                  }}
                >
                  <span>💻 איפה כותבים בעורך הקוד: {currentStep.codeLocation}</span>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.16)',
                      color: '#6ee7b7',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '800'
                    }}
                  >
                    🔒 הקלדה עצמית בעורך הקוד (ללא העתקה)
                  </span>
                </div>
                <pre
                  dir="ltr"
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    margin: 0,
                    padding: '16px 20px',
                    color: '#f8fafc',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '0.98rem',
                    lineHeight: '1.65',
                    overflowX: 'auto',
                    textAlign: 'left',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                >
                  <code>{currentStep.codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* תיבת ההוראה לביצוע בצעד זה */}
          <div
            style={{
              background: isCurrentStepDone ? '#f0fdf4' : '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRight: isCurrentStepDone ? '3.5px solid #10b981' : '3.5px solid #2563eb',
              borderRadius: '12px',
              padding: '13px 16px'
            }}
          >
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: '900',
                color: isCurrentStepDone ? '#047857' : '#1d4ed8',
                marginBottom: '3px'
              }}
            >
              🎯 המשימה שלך
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.55' }}>
              {currentStep.taskInstruction}
            </div>
          </div>

          {/* כפתורי ניווט + סימון הצלחה ומעבר לצעד הבא */}
          <div
            style={{
              borderTop: '1px solid #f1f5f9',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              disabled={safeStepNum <= 1}
              onClick={() => {
                setStepNum(Math.max(1, safeStepNum - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: '#ffffff',
                color: safeStepNum <= 1 ? '#cbd5e1' : '#475569',
                border: '1px solid #e2e8f0',
                padding: '11px 18px',
                borderRadius: '11px',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: safeStepNum <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              → צעד קודם
            </button>

            <button
              type="button"
              onClick={handleCompleteCurrentAndNext}
              style={{
                flex: 1,
                minWidth: '230px',
                background: isCodeTrack ? '#059669' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '11px',
                fontWeight: '800',
                fontSize: '0.94rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.14)'
              }}
            >
              {safeStepNum < stepsList.length
                ? `ביצעתי, המשך לצעד ${safeStepNum + 1} ←`
                : `סיימתי את מפגש 1 • המשך למפגש 2 ←`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
