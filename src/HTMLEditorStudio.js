import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MonacoEditor from 'react-monaco-editor';

// החלק הקבוע שזהה לכולם ונטען אוטומטית מאחורי הקלעים (כדי שהתלמיד יתחיל ישר מה-<body>)
const FIXED_HTML_HEAD = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>האתר שלי</title>
</head>`;

// קוד התחלתי נקי לתלמיד - מתחילים לבנות ישר מה-<body>!
const INITIAL_BODY_STARTER = `<body>

  

</body>`;

// שלד בסיסי למקרה שהתלמיד ירצה לטעון דוגמה מוכנה
const BASIC_HTML_SKELETON = `<body>

  <header>
    <h1>הכותרת הראשית שלי</h1>
  </header>

  <main>
    <h2>כותרת משנה</h2>
    <p>כאן מופיע הטקסט שלי בתוך ה-body.</p>
  </main>

</body>

<style>
  body {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 30px;
  }
  main {
    border: 2px solid #cbd5e1;
    padding: 24px;
    margin: 20px auto;
    max-width: 650px;
    border-radius: 14px;
  }
</style>`;

const QUICK_TAG_DICTIONARY = [
  { tag: '<body> ... </body>', where: 'עוטפת את כל תוכן הדף', desc: 'גוף הדף! כל מה שתכתבו בין <body> ל-</body> יופיע מיד על הדף הלבן של האתר.' },
  { tag: '<h1> עד <h3>', where: 'בתוך ה-<body>', desc: 'כותרות בדף: <h1> היא הכותרת הראשית הגדולה ביותר, <h2> כותרת משנה, ו-<h3> כותרת פנימית.' },
  { tag: '<p> ... </p>', where: 'בתוך ה-<body>', desc: 'פסקת טקסט רגילה (Paragraph) להצגת משפטים והסברים.' },
  { tag: '<style> ... </style>', where: 'מתחת ל-</body>', desc: 'אזור העיצוב! כאן קובעים צבעים (color, background), גודל כתב (font-size) ועיגול פינות (border-radius).' },
  { tag: '<header> / <main> / <footer>', where: 'בתוך ה-<body>', desc: 'תגיות סמנטיות ב-HTML5 שמחלקות את הדף לאזור כותרת עליונה, תוכן מרכזי ותחתית.' },
  { tag: '<div class="card"> ... </div>', where: 'בתוך ה-<body>', desc: 'קופסה / כרטיסייה שמשמשת לאיגוד מספר אלמנטים יחד (למשל כותרת, תמונה ופסקה בתוך מסגרת מעוצבת).' },
  { tag: '<img src="..." alt="...">', where: 'בתוך ה-<body>', desc: 'הצגת תמונה באתר. ב-src שמים את קישור התמונה וב-alt תיאור טקסטואלי שלה.' },
  { tag: '<button> ... </button>', where: 'בתוך ה-<body>', desc: 'כפתור לחיץ באתר. ניתן להוסיף לו onclick כדי להפעיל פעולה בלחיצה.' },
  { tag: '<a href="..."> ... </a>', where: 'בתוך ה-<body>', desc: 'קישור לחיץ שמעביר לעמוד אחר או לאתר חיצוני.' },
  { tag: '<ul> ו-<li>', where: 'בתוך ה-<body>', desc: 'רשימת נקודות: <ul> פותחת רשימה, וכל <li> הוא שורה אחת ברשימה.' },
  { tag: '<input> / <textarea>', where: 'בתוך ה-<body>', desc: 'שדות טופס שבהם הגולש יכול להקליד שם, אימייל או הודעה.' },
  { tag: '<script> ... </script>', where: 'מתחת ל-</body>', desc: 'אזור כתיבת פקודות JavaScript להוספת פעולות חכמות וכפתורים אינטראקטיביים.' }
];

const CSS_DESIGN_DICTIONARY = [
  {
    prop: `<style>\n  body {\n    background-color: #f0fdf4;\n  }\n</style>`,
    title: '🎨 תגית <style> ... </style> – פתיחת אזור העיצוב',
    desc: 'תגית העיצוב המרכזית! נכתבת מתחת ל-</body> ובתוכה בוחרים איזו תגית לעצב ופותחים סוגריים מסולסלים { }.',
    options: [
      'body { ... } – עיצוב כל רקע הדף והגופן הכללי של האתר',
      'main { ... } או .card { ... } – עיצוב הכרטיסייה הראשית',
      'h1 { ... } / h2 { ... } / p { ... } – עיצוב הכותרות והפסקאות',
      'img { ... } / button { ... } – עיצוב התמונות והכפתורים',
      'button:hover { ... } – עיצוב שמופעל רק כשמעבירים עכבר מעל הכפתור'
    ]
  },
  {
    prop: `body {\n  background-color: #0f172a;\n}\n.card {\n  background: linear-gradient(135deg, #2563eb, #7c3aed);\n}`,
    title: '🌈 background-color ו-background – צבעי רקע ומעברי צבעים',
    desc: 'קובע את צבע הרקע של הדף, הכרטיסייה או הכפתור. ניתן לבחור צבע אחיד, מעבר צבעים או תמונת רקע.',
    options: [
      'צבע לפי קוד HEX: למשל #ffffff (לבן), #0f172a (כהה), #10b981 (ירוק), #2563eb (כחול)',
      'צבע לפי שם באנגלית: white, black, royalblue, gold, coral, transparent (שקוף)',
      'צבע עם שקיפות (rgba): למשל rgba(255, 255, 255, 0.85)',
      'מעבר צבעים (linear-gradient): למשל linear-gradient(135deg, #6366f1, #ec4899)',
      'תמונת רקע: background-image: url("bg.jpg"); background-size: cover; background-position: center;'
    ]
  },
  {
    prop: `h1 {\n  color: #1e40af;\n  font-size: 38px;\n  font-weight: bold;\n  font-family: Arial, sans-serif;\n}`,
    title: '✍️ color, font-size, font-weight, font-family – עיצוב טקסט וגופן',
    desc: 'שולט בצבע האותיות, גודל הטקסט, עובי ההדגשה וסוג הגופן.',
    options: [
      'color (צבע כתב): כל קוד צבע (#0f172a, #ffffff) או שם צבע (white, #38bdf8)',
      'font-size (גודל אותיות): 14px (קטן), 18px (פסקה), 24px (כותרת משנה), 36px–48px (כותרת ראשית)',
      'font-weight (עובי כתב): normal (רגיל - 400), bold (מודגש - 700), 900 (עבה במיוחד)',
      'font-family (סוג גופן): Arial, sans-serif | "Segoe UI", sans-serif | "Rubik", sans-serif',
      'font-style / text-decoration: italic (נטוי) | underline (קו תחתון) | none (ללא קו)'
    ]
  },
  {
    prop: `body {\n  text-align: center;\n}\np {\n  line-height: 1.6;\n  letter-spacing: 0.5px;\n}`,
    title: '📏 text-align, line-height, letter-spacing – יישור ומרווחי טקסט',
    desc: 'קובע איפה הטקסט יעמוד בתוך הקופסה ומה יהיה המרווח בין השורות והאותיות.',
    options: [
      'text-align: right – יישור לימין (ברירת מחדל בעברית)',
      'text-align: center – מרכוז כל הטקסט והתמונות לאמצע הכרטיסייה',
      'text-align: left – יישור לשמאל (מתאים לאנגלית/קוד)',
      'line-height: 1.2 (צפוף לכותרות) | 1.6 (נוח וקריא לפסקאות) | 2.0 (מרווח כפול)',
      'letter-spacing: 0px (רגיל) | 1px–3px (ריווח אותיות מודרני לכותרות ותגיות)'
    ]
  },
  {
    prop: `.card {\n  max-width: 560px;\n  padding: 28px;\n  margin: 30px auto;\n}`,
    title: '📐 width, max-width, padding, margin – מידות, ריווח פנימי ומרכוז',
    desc: 'קובע את גודל הקופסה, את מרווח האוויר הפנימי שלה (padding) ואת המרחק והמרכוז שלה בדף (margin).',
    options: [
      'width / max-width: 100% (רוחב מלא) | max-width: 560px (רוחב כרטיסייה מקסימלי)',
      'height: auto (גובה אוטומטי לפי התוכן) | 260px (גובה קבוע לתמונה) | 100vh (גובה מסך מלא)',
      'padding (ריווח פנימי): 24px (מכל הצדדים) | 12px 28px (12px למעלה/למטה ו-28px בצדדים – מעולה לכפתור!)',
      'margin (ריווח חיצוני): 20px (רווח מסביב) | margin-bottom: 16px (רווח רק מתחת לאלמנט)',
      'margin: 30px auto – הטריק שממרכז כרטיסייה עם max-width בדיוק לאמצע המסך!'
    ]
  },
  {
    prop: `.card {\n  border-radius: 24px;\n  border: 2px solid #cbd5e1;\n}\nbutton {\n  border-radius: 999px;\n  border: none;\n}`,
    title: '⭕ border-radius ו-border – עיגול פינות ומסגרות',
    desc: 'מעגל את הפינות של כרטיסיות, תמונות וכפתורים ומוסיף מסגרת מעוצבת.',
    options: [
      'border-radius (עיגול פינות): 0px (חד) | 12px (עדין) | 24px (כרטיסייה מודרנית) | 999px (כפתור קפסולה) | 50% (עיגול מלא)',
      'border: none – ביטול מסגרת (שימושי מאוד בכפתורים מודרניים!)',
      'border: 2px solid #3b82f6 – מסגרת בקו רציף (solid) בעובי 2px',
      'border: 2px dashed #94a3b8 – מסגרת בקו מקווקו (dashed)',
      'border: 3px dotted #f59e0b – מסגרת נקודות (dotted)'
    ]
  },
  {
    prop: `.card {\n  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);\n  transition: 0.25s;\n}\nbutton:hover {\n  transform: scale(1.06);\n  cursor: pointer;\n}`,
    title: '✨ box-shadow, :hover, transform, transition – צלליות ואפקטים',
    desc: 'מוסיף עומק תלת-ממדי לכרטיסייה ואנימציה חלקה כשמעבירים את העכבר מעל כפתור או כרטיסייה.',
    options: [
      'box-shadow עדין: 0 4px 12px rgba(0, 0, 0, 0.08)',
      'box-shadow עמוק (3D): 0 20px 45px rgba(0, 0, 0, 0.2)',
      'box-shadow זוהר (Neon): 0 0 25px rgba(59, 130, 246, 0.6)',
      'transform: scale(1.05) (הגדלה ב-5%) | translateY(-4px) (ריחוף למעלה) | rotate(-2deg) (סיבוב קל)',
      'transition: 0.25s (תנועה חלקה) | cursor: pointer (הפיכת העכבר ליד מצביעה)'
    ]
  },
  {
    prop: `img {\n  width: 100%;\n  height: 260px;\n  object-fit: cover;\n  border-radius: 16px;\n}`,
    title: '🖼️ object-fit ו-display: flex – התאמת תמונות וסידור בשורה',
    desc: 'שומר על פרופורציות התמונה בלי שהיא תימתח, ומאפשר לסדר אלמנטים בשורה או בטור.',
    options: [
      'object-fit: cover – חותך ומתאים את התמונה בול לקופסה בלי לעוות או למתוח אותה',
      'object-fit: contain – מציג את כל התמונה בשלמותה בתוך הגבולות',
      'display: flex; gap: 16px; – מעמיד פריטים זה לצד זה בשורה עם רווח של 16px ביניהם',
      'flex-direction: row (בשורה) | column (בטור זה מתחת לזה)',
      'justify-content: center (מרכוז לאמצע) | space-between (פיזור לקצוות)'
    ]
  }
];

// כפתורי הוספה מהירה ללחיצה מעל העורך
const QUICK_INSERT_HTML_CHIPS = [
  { label: '<h1> כותרת', snippet: '<h1>כותרת ראשית</h1>' },
  { label: '<h2> משנה', snippet: '<h2>כותרת משנה</h2>' },
  { label: '<p> פסקה', snippet: '<p>טקסט הפסקה כאן.</p>' },
  { label: '<strong> הדגשה', snippet: '<strong>טקסט מודגש!</strong>' },
  { label: '<header>', snippet: '<header>\n  <h1>שם האתר</h1>\n</header>' },
  { label: '<main>', snippet: '<main>\n  <h2>תוכן מרכזי</h2>\n</main>' },
  { label: '<footer>', snippet: '<footer>\n  <p>© 2026 כל הזכויות שמורות</p>\n</footer>' },
  { label: '<img> תמונה', snippet: '<img src="shoe.jpg" alt="תיאור התמונה" width="220">' },
  { label: '<ul> רשימה', snippet: '<ul>\n  <li>יתרון ראשון</li>\n  <li>יתרון שני</li>\n</ul>' },
  { label: '<a> קישור', snippet: '<a href="buy.html" class="buy-btn">קנה עכשיו</a>' },
  { label: '<div class="card">', snippet: '<div class="card">\n  <h2>כותרת</h2>\n  <p>תיאור קצר</p>\n</div>' },
  { label: '<button>', snippet: '<button onclick="alert(\'שלום!\')">לחץ כאן</button>' },
  { label: '<style> עיצוב', snippet: '<style>\n  main {\n    border: 2px solid black;\n    padding: 20px;\n    border-radius: 12px;\n  }\n</style>', isStyleBlock: true }
];

const QUICK_INSERT_CSS_CHIPS = [
  { label: 'border (מסגרת)', snippet: '  border: 2px solid black;' },
  { label: 'padding (ריווח פנימי)', snippet: '  padding: 20px;' },
  { label: 'margin (ריווח חיצוני)', snippet: '  margin: 20px auto;' },
  { label: 'border-radius (פינות עגולות)', snippet: '  border-radius: 15px;' },
  { label: 'background-color (צבע רקע)', snippet: '  background-color: #f0f9ff;' },
  { label: 'linear-gradient (מעבר צבעים)', snippet: '  background: linear-gradient(135deg, #2563eb, #7c3aed);' },
  { label: 'color (צבע טקסט)', snippet: '  color: #0f172a;' },
  { label: 'font-size (גודל כתב)', snippet: '  font-size: 36px;' },
  { label: 'font-family (סוג גופן)', snippet: '  font-family: Arial, sans-serif;' },
  { label: 'text-align: center (מרכוז)', snippet: '  text-align: center;' },
  { label: 'box-shadow (צללית)', snippet: '  box-shadow: 0 10px 25px rgba(0,0,0,0.12);' },
  { label: '.buy-btn (עיצוב כפתור)', snippet: '.buy-btn {\n  text-decoration: none;\n  background-color: #10b981;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 8px;\n  display: inline-block;\n}', isFullRule: true }
];

// ============================================================================
// 🧠 מנוע תיקון וניתוח חכם ל-CSS ו-HTML (פותר טעויות כתיב נפוצות של תלמידים כמו פסיק במקום נקודה-פסיק!)
// ============================================================================
function healCssSyntax(rawCss) {
  if (!rawCss || typeof rawCss !== 'string') return { healed: '', issues: [] };
  const issues = [];
  let css = rawCss;

  // 1. תיקון פסיק אחרי סוגר מסולסל סגירה: "}," -> "}"
  if (/\}\s*,/.test(css)) {
    issues.push('פסיק מיותר אחרי סוגר מסולסל (},) ב-CSS');
    css = css.replace(/\}\s*,/g, '}');
  }

  // 2. מעבר שורה-שורה בתוך בלוקים של CSS לתיקון פסיק בסוף שורה (border: 2px solid black,) או חוסר בנקודה-פסיק
  const lines = css.split('\n');
  let insideRule = false;

  const fixedLines = lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.includes('{')) {
      insideRule = true;
      return line;
    }
    if (trimmed.includes('}')) {
      insideRule = false;
      return line;
    }
    if (!insideRule || !trimmed || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.endsWith('*/')) {
      return line;
    }

    // בדיקה אם השורה נראית כמו הצהרת CSS (property: value)
    if (/^[a-zA-Z-]+\s*:\s*[^;{}]+$/.test(trimmed)) {
      // א. אם השורה מסתיימת בפסיק (למשל border: 2px solid black,)
      if (trimmed.endsWith(',')) {
        issues.push(`בשורת CSS נכתב פסיק (,) במקום נקודה-פסיק (;): "${trimmed}"`);
        return line.replace(/,\s*$/, ';');
      }

      // ב. אם השורה לא מסתיימת בנקודה-פסיק (למשל padding: 50px)
      // נוסיף ; בסוף השורה כדי שגם אם יש עוד תכונה אחריה היא תעבוד!
      issues.push(`חסרה נקודה-פסיק (;) בסוף שורת ה-CSS: "${trimmed}"`);
      return line.replace(/\s*$/, ';');
    }

    return line;
  });

  return {
    healed: fixedLines.join('\n'),
    issues
  };
}

function analyzeAndHealStudentHtml(rawStudentCode) {
  if (!rawStudentCode || !rawStudentCode.trim()) {
    return { healedCode: '', fullDocument: '', issues: [] };
  }

  let working = rawStudentCode
    .replace(/^\s*(?:```|''')(?:html|css|javascript)?\s*/gi, '')
    .replace(/\s*(?:```|''')\s*$/gi, '');
  const allIssues = [];

  // 1. אם התלמיד פתח תגית <style> ולא סגר אותה עם </style>, נסגור אותה אוטומטית
  const styleOpenCount = (working.match(/<style\b[^>]*>/gi) || []).length;
  const styleCloseCount = (working.match(/<\/style>/gi) || []).length;
  if (styleOpenCount > styleCloseCount) {
    allIssues.push('תגית <style> נפתחה ללא תגית סגירה </style>');
    working = `${working}\n</style>`;
  }

  // 2. תיקון אוטומטי של תחביר CSS בתוך כל בלוק <style>...</style>
  working = working.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (match, openTag, cssContent, closeTag) => {
    const { healed, issues } = healCssSyntax(cssContent);
    if (issues.length > 0) {
      allIssues.push(...issues);
    }
    return `${openTag}${healed}${closeTag}`;
  });

  // 3. עטיפה במסמך HTML מלא עם כיווניות עברית (RTL)
  let fullDocument = working;
  if (!/<!DOCTYPE\s+html/i.test(working) && !/<html[\s>]/i.test(working)) {
    fullDocument = `${FIXED_HTML_HEAD}\n${working}\n</html>`;
  }

  return {
    healedCode: working,
    fullDocument,
    issues: Array.from(new Set(allIssues))
  };
}

// פירוק חכם של קוד מאוחד ל-3 לשוניות (HTML, CSS, JS) כדי שלא יאבד קוד במעבר בין המצבים!
function parseSingleCodeIntoTabs(rawCode) {
  const src = rawCode || '';
  const styleMatches = [];
  const scriptMatches = [];

  let htmlOnly = src.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, cssInner) => {
    if (cssInner && cssInner.trim()) styleMatches.push(cssInner.trim());
    return '';
  });

  htmlOnly = htmlOnly.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_, jsInner) => {
    if (jsInner && jsInner.trim()) scriptMatches.push(jsInner.trim());
    return '';
  });

  // אם יש תגית <style> פתוחה ללא סגירה בסוף הקובץ
  if (/<style\b[^>]*>/i.test(htmlOnly)) {
    const parts = htmlOnly.split(/<style\b[^>]*>/i);
    htmlOnly = parts[0];
    if (parts[1] && parts[1].trim()) {
      styleMatches.push(parts[1].trim());
    }
  }

  // חילוץ מה שבתוך ה-<body> אם יש <body>
  const bodyMatch = htmlOnly.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const cleanHtml = bodyMatch ? bodyMatch[1].trim() : htmlOnly.replace(/<\/?body\b[^>]*>/gi, '').trim();

  return {
    html: cleanHtml || '  <header>\n    <h1>שם האתר שלי</h1>\n  </header>\n\n  <main>\n    <h2>כותרת משנה</h2>\n    <p>תיאור האתר שלי</p>\n  </main>',
    css: styleMatches.join('\n\n') || 'main {\n  border: 2px solid black;\n  padding: 20px;\n  border-radius: 12px;\n}\n\nh1 {\n  font-family: Arial;\n  font-size: 40px;\n  text-align: center;\n}',
    js: scriptMatches.join('\n\n') || ''
  };
}

// רישום השלמה אוטומטית חכמה (IntelliSense) עבור HTML ו-CSS ב-Monaco (פעם אחת בלבד)
let monacoProvidersRegistered = false;
function registerSmartMonacoProviders(monaco) {
  if (!monaco || monacoProvidersRegistered) return;
  monacoProvidersRegistered = true;

  const htmlSuggestions = [
    {
      label: 'h1',
      detail: '📢 כותרת ראשית גדולה (<h1>...</h1>)',
      insertText: '<h1>${1:כותרת ראשית}</h1>',
      documentation: 'יוצרת את הכותרת הראשית והחשובה ביותר בעמוד.'
    },
    {
      label: 'h2',
      detail: '📢 כותרת משנה (<h2>...</h2>)',
      insertText: '<h2>${1:כותרת משנה}</h2>',
      documentation: 'יוצרת כותרת משנה לאזור או למוצר בדף.'
    },
    {
      label: 'h3',
      detail: '📢 כותרת פנימית (<h3>...</h3>)',
      insertText: '<h3>${1:כותרת פנימית}</h3>',
      documentation: 'כותרת בגודל בינוני לתת-נושאים.'
    },
    {
      label: 'p',
      detail: '📝 פסקת טקסט (<p>...</p>)',
      insertText: '<p>${1:הקלד כאן את טקסט הפסקה...}</p>',
      documentation: 'יוצרת פסקה חדשה של טקסט רגיל באתר.'
    },
    {
      label: 'strong',
      detail: '💪 הדגשת מילים חשובות (<strong>...</strong>)',
      insertText: '<strong>${1:טקסט מודגש!}</strong>',
      documentation: 'מדגיש מילים בכתב עבה (Bold).'
    },
    {
      label: 'header',
      detail: '🏗️ אזור כותרת עליונה סמנטי (<header>)',
      insertText: '<header>\n  <h1>${1:שם האתר}</h1>\n</header>',
      documentation: 'תגית סמנטית לחלקו העליון של הדף (לוגו, שם האתר ותפריט).'
    },
    {
      label: 'main',
      detail: '🏗️ אזור התוכן המרכזי (<main>)',
      insertText: '<main>\n  <h2>${1:כותרת המוצר}</h2>\n  <p>${2:תיאור קצר}</p>\n</main>',
      documentation: 'תגית סמנטית לעטיפת התוכן הראשי של העמוד.'
    },
    {
      label: 'footer',
      detail: '🏗️ אזור תחתית האתר (<footer>)',
      insertText: '<footer>\n  <p>© 2026 כל הזכויות שמורות</p>\n</footer>',
      documentation: 'תגית סמנטית לחלק התחתון של האתר.'
    },
    {
      label: 'img',
      detail: '🖼️ תמונה (<img src="..." alt="...">)',
      insertText: '<img src="${1:shoe.jpg}" alt="${2:תיאור התמונה}" width="${3:250}">',
      documentation: 'מציגה תמונה באתר לפי קישור או שם קובץ (src) וטקסט חלופי (alt).'
    },
    {
      label: 'a',
      detail: '🔗 קישור לחיץ (<a href="...">...</a>)',
      insertText: '<a href="${1:buy.html}" class="${2:buy-btn}">${3:קנה עכשיו}</a>',
      documentation: 'יוצר קישור או כפתור מעבר לעמוד אחר.'
    },
    {
      label: 'ul',
      detail: '📋 רשימת נקודות לא מסודרת (<ul> + <li>)',
      insertText: '<ul>\n  <li>${1:יתרון ראשון}</li>\n  <li>${2:יתרון שני}</li>\n</ul>',
      documentation: 'רשימה עם נקודות (Bullet points).'
    },
    {
      label: 'ol',
      detail: '🔢 רשימה ממוספרת (<ol> + <li>)',
      insertText: '<ol>\n  <li>${1:שלב ראשון}</li>\n  <li>${2:שלב שני}</li>\n</ol>',
      documentation: 'רשימה מסודרת עם מספרים (1, 2, 3).'
    },
    {
      label: 'li',
      detail: '• פריט ברשימה (<li>...</li>)',
      insertText: '<li>${1:פריט ברשימה}</li>',
      documentation: 'שורה בודדת בתוך רשימת <ul> או <ol>.'
    },
    {
      label: 'div.card',
      detail: '📦 כרטיסייה מעוצבת (<div class="card">)',
      insertText: '<div class="${1:card}">\n  <h2>${2:כותרת הכרטיסייה}</h2>\n  <p>${3:תוכן הכרטיסייה}</p>\n</div>',
      documentation: 'קופסה שעוטפת מספר אלמנטים יחד לעיצוב משותף.'
    },
    {
      label: 'button',
      detail: '🔘 כפתור לחיץ (<button>...</button>)',
      insertText: '<button onclick="alert(\'${1:ברוכים הבאים!}\')">${2:לחץ כאן}</button>',
      documentation: 'כפתור אינטראקטיבי בדף.'
    },
    {
      label: 'span.badge',
      detail: '✨ תגית קטנה בולטת (<span class="badge">)',
      insertText: '<span class="badge">${1:✨ מבצע מיוחד}</span>',
      documentation: 'תווית מעוצבת מעל כותרת או מחיר.'
    },
    {
      label: 'style',
      detail: '🎨 אזור עיצוב CSS (<style>...</style>)',
      insertText: '<style>\n  ${1:main} {\n    border: 2px solid black;\n    padding: 20px;\n    border-radius: 12px;\n  }\n</style>',
      documentation: 'פותח אזור להגדרת חוקי עיצוב CSS בדף.'
    },
    {
      label: 'link:css',
      detail: '🔌 קישור לקובץ style.css חיצוני (<link>)',
      insertText: '<link rel="stylesheet" href="style.css">',
      documentation: 'מחבר קובץ עיצוב style.css חיצוני לתוך ה-<head>.'
    }
  ];

  const cssSuggestions = [
    {
      label: 'border',
      detail: '🖼️ מסגרת לקופסה (border: 2px solid black;)',
      insertText: 'border: ${1:2px} solid ${2:black};'
    },
    {
      label: 'padding',
      detail: '📐 ריווח פנימי בתוך הקופסה (padding: 20px;)',
      insertText: 'padding: ${1:20px};'
    },
    {
      label: 'margin',
      detail: '📐 ריווח חיצוני מחוץ לקופסה (margin: 20px auto;)',
      insertText: 'margin: ${1:20px auto};'
    },
    {
      label: 'border-radius',
      detail: '⭕ עיגול פינות המסגרת (border-radius: 15px;)',
      insertText: 'border-radius: ${1:15px};'
    },
    {
      label: 'background-color',
      detail: '🌈 צבע רקע (background-color: #f0f9ff;)',
      insertText: 'background-color: ${1:#f0f9ff};'
    },
    {
      label: 'background: linear-gradient',
      detail: '🎨 רקע מעבר צבעים מדורג (Gradient)',
      insertText: 'background: linear-gradient(135deg, ${1:#2563eb}, ${2:#7c3aed});'
    },
    {
      label: 'color',
      detail: '✍️ צבע הטקסט (color: blue;)',
      insertText: 'color: ${1:#2563eb};'
    },
    {
      label: 'font-size',
      detail: '📏 גודל הגופן בפיקסלים (font-size: 40px;)',
      insertText: 'font-size: ${1:40px};'
    },
    {
      label: 'font-family',
      detail: '🔤 סוג הגופן (font-family: Arial;)',
      insertText: 'font-family: ${1:Arial, sans-serif};'
    },
    {
      label: 'font-weight',
      detail: '💪 עובי הגופן (font-weight: bold;)',
      insertText: 'font-weight: ${1:bold};'
    },
    {
      label: 'text-align',
      detail: '📐 יישור טקסט (text-align: center;)',
      insertText: 'text-align: ${1:center};'
    },
    {
      label: 'text-decoration',
      detail: '🔗 הסרת קו תחתון מקישור (text-decoration: none;)',
      insertText: 'text-decoration: ${1:none};'
    },
    {
      label: 'box-shadow',
      detail: '✨ צללית תלת-ממדית לקופסה (box-shadow)',
      insertText: 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);'
    },
    {
      label: 'display: flex',
      detail: '🧱 סידור אלמנטים בשורה (Flexbox)',
      insertText: 'display: flex;\n  justify-content: center;\n  gap: 16px;'
    },
    {
      label: 'max-width',
      detail: '↔️ רוחב מקסימלי לקופסה (max-width: 700px;)',
      insertText: 'max-width: ${1:700px};'
    },
    {
      label: 'main { ... }',
      detail: '📦 עיצוב מלא לתגית main',
      insertText: 'main {\n  border: ${1:2px solid black};\n  padding: ${2:30px};\n  margin: ${3:20px auto};\n  border-radius: ${4:12px};\n}'
    },
    {
      label: '.buy-btn { ... }',
      detail: '🔘 עיצוב כפתור קנייה (.buy-btn)',
      insertText: '.buy-btn {\n  text-decoration: none;\n  background-color: ${1:green};\n  color: ${2:white};\n  padding: 10px 20px;\n  border-radius: 6px;\n  display: inline-block;\n}'
    }
  ];

  // רישום עבור לשונית HTML (כולל זיהוי אם הסמן נמצא בתוך <style>)
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['<', ' ', '.', ':', 'a', 'b', 'c', 'd', 'f', 'h', 'i', 'l', 'm', 'p', 's', 't', 'u'],
    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      const word = model.getWordUntilPosition(position);
      const lineText = model.getLineContent(position.lineNumber);
      const charBefore = lineText[word.startColumn - 2];
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: charBefore === '<' ? word.startColumn - 1 : word.startColumn,
        endColumn: word.endColumn
      };

      // בדיקה האם אנחנו כרגע בתוך בלוק <style>
      const lastStyleOpen = textUntilPosition.lastIndexOf('<style');
      const lastStyleClose = textUntilPosition.lastIndexOf('</style>');
      const isInsideStyle = lastStyleOpen !== -1 && (lastStyleClose === -1 || lastStyleOpen > lastStyleClose);

      if (isInsideStyle) {
        return {
          suggestions: cssSuggestions.map((item) => ({
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Property,
            detail: item.detail,
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          }))
        };
      }

      return {
        suggestions: htmlSuggestions.map((item) => ({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: item.detail,
          documentation: item.documentation,
          insertText: item.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range
        }))
      };
    }
  });

  // רישום עבור לשונית CSS (במצב 3 קבצים)
  monaco.languages.registerCompletionItemProvider('css', {
    triggerCharacters: ['.', '#', ':', 'b', 'c', 'd', 'f', 'm', 'p', 't'],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      return {
        suggestions: cssSuggestions.map((item) => ({
          label: item.label,
          kind: monaco.languages.CompletionItemKind.Property,
          detail: item.detail,
          insertText: item.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range
        }))
      };
    }
  });
}

export default function HTMLEditorStudio() {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const projectImageInputRef = useRef(null);
  const aiAttachmentInputRef = useRef(null);
  const iframeRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const editorWrapperRef = useRef(null);

  // התלמיד מתחיל לבנות ישר מתוך ה-<body> (ה-head קבוע לכולם אוטומטית!)
  const [code, setCode] = useState(() => {
    if (location.state && typeof location.state.initialCode === 'string') {
      return location.state.initialCode;
    }
    const saved = localStorage.getItem('smartstart_open_code_body_v2');
    return saved !== null ? saved : INITIAL_BODY_STARTER;
  });

  // תמונות שהתלמיד שמר בתיקייה במחשב והעלה לעורך (למשל banner.jpg)
  const [localProjectImages, setLocalProjectImages] = useState(() => {
    try {
      const saved = localStorage.getItem('smartstart_project_images_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smartstart_project_images_v1', JSON.stringify(localProjectImages));
    } catch {}
  }, [localProjectImages]);

  const handleUploadProjectImage = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target?.result || '');
        if (!dataUrl) return;
        const cleanName = file.name.trim();
        setLocalProjectImages((prev) => ({
          ...prev,
          [cleanName]: dataUrl,
          'banner.jpg': dataUrl
        }));
        setStatusBanner(
          `✅ התמונה "${cleanName}" נטענה! כתוב בקוד: <img src="${cleanName}" alt="תמונה">`
        );
        setTimeout(() => setStatusBanner(''), 6000);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // מצב עבודה: 'single' (קובץ HTML מרכזי) | 'tabs' (3 לשוניות נפרדות: HTML, CSS, JS)
  const [editorMode, setEditorMode] = useState('single');
  const [activeTab, setActiveTab] = useState('html');
  const [tabHtml, setTabHtml] = useState('');
  const [tabCss, setTabCss] = useState('');
  const [tabJs, setTabJs] = useState('');

  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [viewLayout, setViewLayout] = useState('split'); // 'split' | 'fullEditor' | 'fullPreview'
  const [openMenu, setOpenMenu] = useState(null); // 'file' | 'quickInsert' | null
  const [showTagGuideModal, setShowTagGuideModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [quickBarMode, setQuickBarMode] = useState('html'); // 'html' | 'css'
  const [copied, setCopied] = useState(false);
  const [statusBanner, setStatusBanner] = useState('');

  const [showAiAgentPanel, setShowAiAgentPanel] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiAgentMode, setAiAgentMode] = useState('auto'); // 'auto' | 'chat' | 'edit'
  const [aiAttachments, setAiAttachments] = useState([]);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiUndoStack, setAiUndoStack] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: 'היי! 👋 אפשר לשאול אותי כל שאלה או לבקש ממני לערוך את הקוד.'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('smartstart_open_code_body_v2', code);
  }, [code]);

  // ניתוח ותיקון חכם של הקוד עבור התצוגה החיה + המרת שמות תמונות מקומיות (כמו banner.jpg) לתמונה שהתלמיד העלה
  const { healedCode, fullDocument: previewSrcDoc, issues: syntaxIssues } = useMemo(() => {
    const base = analyzeAndHealStudentHtml(code);
    let docWithImages = base.fullDocument;
    Object.entries(localProjectImages || {}).forEach(([fileName, dataUrl]) => {
      if (!fileName || !dataUrl) return;
      const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      docWithImages = docWithImages.replace(
        new RegExp(`src=(["'])${escaped}\\1`, 'gi'),
        `src=$1${dataUrl}$1`
      );
      docWithImages = docWithImages.replace(
        new RegExp(`url\\((["']?)${escaped}\\1\\)`, 'gi'),
        `url($1${dataUrl}$1)`
      );
    });
    return {
      ...base,
      fullDocument: docWithImages
    };
  }, [code, localProjectImages]);

  const compileTabsToHtml = (h, c, j) => {
    const jsSection = j && j.trim() ? `\n  <script>\n${j}\n  </script>` : '';
    const compiled = `<body>\n${h}${jsSection}\n</body>\n<style>\n${c}\n</style>`;
    setCode(compiled);
  };

  const applyAiUpdatedCode = (rawUpdatedCode) => {
    const cleaned = (rawUpdatedCode || '')
      .replace(/^\s*(?:```|''')(?:html|css|javascript)?\s*/gi, '')
      .replace(/\s*(?:```|''')\s*$/gi, '')
      .trim();
    if (!cleaned) return false;

    setAiUndoStack((prev) => [code, ...prev.slice(0, 9)]);
    setCode(cleaned);
    if (editorMode === 'tabs') {
      const parsed = parseSingleCodeIntoTabs(cleaned);
      setTabHtml(parsed.html);
      setTabCss(parsed.css);
      setTabJs(parsed.js);
    }
    return true;
  };

  const handleUndoLastAiChange = () => {
    if (aiUndoStack.length === 0) return;
    const previousCode = aiUndoStack[0];
    setAiUndoStack((prev) => prev.slice(1));
    setCode(previousCode);
    if (editorMode === 'tabs') {
      const parsed = parseSingleCodeIntoTabs(previousCode);
      setTabHtml(parsed.html);
      setTabCss(parsed.css);
      setTabJs(parsed.js);
    }
    setStatusBanner('השינוי האחרון של סוכן ה-AI בוטל והקוד הקודם שוחזר ↩️');
    setTimeout(() => setStatusBanner(''), 3500);
  };

  // 📎 העלאת תמונות וקבצים לסוכן ה-AI (תומך בכפתור, גרירה והדבקה Ctrl+V)
  const handleAddAiAttachments = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const filesArray = Array.from(filesList);
    const host = window.location.hostname || 'localhost';
    const candidateUrls =
      host === 'localhost' || host === '127.0.0.1'
        ? ['http://localhost:3002', 'http://localhost:3005']
        : [window.location.origin];

    for (const file of filesArray) {
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
      if (isImage) {
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(String(ev.target?.result || ''));
          reader.readAsDataURL(file);
        });
        if (!dataUrl) continue;

        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        const mimeType = match ? match[1] : file.type || 'image/png';
        const base64Data = match ? match[2] : '';
        let publicUrl = URL.createObjectURL(file);

        // Try uploading to server so the student gets a clean http://localhost:3002/generated_ai_images/... URL
        for (const baseUrl of candidateUrls) {
          try {
            const upRes = await fetch(`${baseUrl}/api/web-track/upload-ai-asset`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: file.name || 'image.png', dataUrl }),
              signal: AbortSignal.timeout(4000)
            });
            if (upRes.ok) {
              const upData = await upRes.json();
              if (upData.success && upData.url) {
                publicUrl = upData.url;
                break;
              }
            }
          } catch (e) {}
        }

        setAiAttachments((prev) => [
          ...prev,
          {
            id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: 'image',
            name: file.name || 'image.png',
            mimeType,
            base64Data,
            dataUrl,
            publicUrl
          }
        ]);
      } else {
        const textContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(String(ev.target?.result || ''));
          reader.readAsText(file, 'UTF-8');
        });
        setAiAttachments((prev) => [
          ...prev,
          {
            id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: 'file',
            name: file.name || 'file.txt',
            textContent: textContent.slice(0, 12000)
          }
        ]);
      }
    }
  };

  const handleRemoveAiAttachment = (attId) => {
    setAiAttachments((prev) => prev.filter((item) => item.id !== attId));
  };

  const handlePasteInAiInput = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const f = items[i].getAsFile();
        if (f) imageFiles.push(f);
      }
    }
    if (imageFiles.length > 0) {
      handleAddAiAttachments(imageFiles);
    }
  };

  const handleRunLiveAiAgent = async (quickInstruction) => {
    const userInstruction = (quickInstruction !== undefined ? quickInstruction : aiPromptInput).trim();
    const currentAttachments = quickInstruction !== undefined ? [] : [...aiAttachments];
    if ((!userInstruction && currentAttachments.length === 0) || isAiRunning) return;

    if (quickInstruction === undefined) {
      setAiPromptInput('');
      setAiAttachments([]);
    }

    const displayUserText =
      userInstruction ||
      (currentAttachments.some((a) => a.type === 'image')
        ? 'צירפתי תמונה — שלב אותה באתר או עבוד לפיה'
        : 'צירפתי קובץ — נתח ושלב אותו בקוד');

    setAiMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: displayUserText,
        attachments: currentAttachments.map((a) => ({
          type: a.type,
          name: a.name,
          previewUrl: a.publicUrl || a.dataUrl
        }))
      }
    ]);
    setIsAiRunning(true);

    let explanation = '';
    let updatedCode = '';
    let providerLabel = 'Hugging Face (Qwen2.5-Coder-32B / VL)';

    const isQuestionOnly =
      aiAgentMode === 'chat' ||
      (aiAgentMode === 'auto' &&
        currentAttachments.length === 0 &&
        /^(?:איך|מה|למה|מתי|איפה|האם|תסביר|אפשר הסבר|מה ההבדל)/i.test(userInstruction) &&
        !/^(?:תוסיף|הוסף|תשנה|שנה|תתקן|תקן|תבנה|בנה|שים|תשים)/i.test(userInstruction));

    // 1. ניסיון ראשון: דרך שרת ה-Backend (/api/web-track/ai-code-edit)
    try {
      const host = window.location.hostname || 'localhost';
      const candidateUrls =
        host === 'localhost' || host === '127.0.0.1'
          ? ['http://localhost:3002', 'http://localhost:3005']
          : [window.location.origin];

      for (const baseUrl of candidateUrls) {
        try {
          const res = await fetch(`${baseUrl}/api/web-track/ai-code-edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: displayUserText,
              currentCode: code,
              attachments: currentAttachments,
              mode: isQuestionOnly ? 'chat' : aiAgentMode
            }),
            signal: AbortSignal.timeout(22000)
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && (data.updatedCode || data.explanation)) {
              explanation = data.explanation || 'הקוד עודכן בלייב בעורך!';
              updatedCode = isQuestionOnly ? '' : data.updatedCode || '';
              providerLabel = data.provider || providerLabel;
              break;
            }
          }
        } catch (innerErr) {}
      }
    } catch (e) {}

    // 2. גיבוי ישיר מהדפדפן (תומך גם בשיחה ושאלות, גם בתמונות וקבצים מצורפים וגם בעריכת קוד בלייב!)
    if (!updatedCode && !explanation) {
      const activeGoogleKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
      if (activeGoogleKey) {
        const attachmentNotes = currentAttachments.map((att, idx) => {
          if (att.type === 'image') {
            return `תמונה מצורפת #${idx + 1} (${att.name}): קישור מוכן לשימוש ב-src או ב-background-image: url('${att.publicUrl}')`;
          }
          return `קובץ מצורף #${idx + 1} (${att.name}):\n${att.textContent || ''}`;
        });

        const systemPrompt = `You are an interactive AI Web Development Mentor & Live Coding Agent (like Antigravity / Cursor) inside a student's HTML5 + CSS3 IDE.
You can BOTH chat/answer questions in Hebrew AND edit/update the student's live code when requested, as well as inspect attached images and files.

CRITICAL RULES:
1. If the user is asking a question (e.g. "איך אני מוסיף ל-div תמונת רקע?") or chatting without asking you to modify their code (or if isQuestionOnly=${isQuestionOnly}):
   - Answer clearly, warmly, and concisely in Hebrew (include a short HTML/CSS example snippet if helpful).
   - Do NOT output ===CODE_START=== so their editor code remains untouched!
2. If the user asks you to add, change, fix, style, build, or use an attached image/file/URL in their code:
   - First, write 1-3 short, friendly sentences in Hebrew explaining what you changed or added.
   - Then write the exact delimiter on a new line: ===CODE_START===
   - After ===CODE_START===, output the COMPLETE updated code using clean <body>...</body> and <style>...</style> (and <script>...</script> if needed).
   - Do NOT wrap the code after ===CODE_START=== in \`\`\`html fences.
   - If the user provided an image URL (in text or in an attached image) and asked for a background image, use background-image: url('THE_EXACT_URL'); background-size: cover; background-position: center; on the requested element/section!`;

        const userMessage = `הקוד הנוכחי בעורך:\n${code || '<body>\n\n</body>\n<style>\n\n</style>'}${
          attachmentNotes.length > 0 ? `\n\nקבצים ותמונות שצורפו:\n${attachmentNotes.join('\n\n')}` : ''
        }\n\nהודעת המשתמש:\n${displayUserText}`;

        const userParts = [{ text: userMessage }];
        for (const att of currentAttachments) {
          if (att.type === 'image' && att.base64Data && att.mimeType) {
            userParts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: att.base64Data
              }
            });
          }
        }

        const fastModels = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.5-flash'];

        for (const gm of fastModels) {
          if (updatedCode || explanation) break;
          try {
            const gRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${gm}:generateContent?key=${encodeURIComponent(
                activeGoogleKey
              )}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: { parts: [{ text: systemPrompt }] },
                  contents: [{ role: 'user', parts: userParts }],
                  generationConfig: {
                    temperature: 0.65,
                    maxOutputTokens: 4096
                  }
                }),
                signal: AbortSignal.timeout(12000)
              }
            );

            if (gRes.ok) {
              const gData = await gRes.json();
              const rawText = (gData?.candidates?.[0]?.content?.parts || [])
                .map((p) => p.text || '')
                .join('\n')
                .trim();
              if (rawText) {
                providerLabel = `Hugging Face + ${gm}`;
                if (rawText.includes('===CODE_START===')) {
                  const parts = rawText.split('===CODE_START===');
                  explanation = (parts[0] || '').trim() || 'הקוד עודכן בהצלחה בלייב בעורך!';
                  if (!isQuestionOnly) {
                    updatedCode = (parts[1] || '')
                      .replace(/===CODE_START===/g, '')
                      .replace(/===CODE_END===/g, '');
                  }
                } else if (isQuestionOnly) {
                  explanation = rawText;
                  updatedCode = '';
                } else {
                  const fenceMatch = rawText.match(/```(?:html)?\s*([\s\S]*?)```/i);
                  if (fenceMatch && /<body|<style/i.test(fenceMatch[1])) {
                    updatedCode = fenceMatch[1];
                    explanation = rawText.replace(fenceMatch[0], '').trim() || 'הקוד עודכן בהצלחה בלייב בעורך!';
                  } else if (/^\s*<body/i.test(rawText)) {
                    updatedCode = rawText;
                    explanation = 'הקוד עודכן בהצלחה בלייב בעורך!';
                  } else {
                    explanation = rawText;
                  }
                }
              }
            }
          } catch (e) {}
        }
      }
    }

    let applied = false;
    if (updatedCode && !isQuestionOnly) {
      applied = applyAiUpdatedCode(updatedCode);
    }

    setAiMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text:
          explanation ||
          (applied
            ? 'הקוד עודכן בהצלחה בלייב!'
            : 'אני כאן לכל שאלה או בקשת עריכת קוד! נסה לשאול שוב או לכתוב מה תרצה שאוסיף לדף.'),
        applied,
        provider: providerLabel
      }
    ]);

    if (applied) {
      setStatusBanner('🤖 סוכן ה-AI עדכן את הקוד שלך בלייב! ✨');
      setTimeout(() => setStatusBanner(''), 3500);
    }

    setIsAiRunning(false);
  };

  // מעבר בטוח בין "דף HTML מאפס" לבין "3 קבצים (HTML/CSS/JS)" בלי לאבד שום קוד!
  const handleSwitchEditorMode = (targetMode) => {
    if (targetMode === editorMode) return;
    if (targetMode === 'tabs') {
      const parsed = parseSingleCodeIntoTabs(code);
      setTabHtml(parsed.html);
      setTabCss(parsed.css);
      setTabJs(parsed.js);
      setEditorMode('tabs');
      compileTabsToHtml(parsed.html, parsed.css, parsed.js);
    } else {
      compileTabsToHtml(tabHtml, tabCss, tabJs);
      setEditorMode('single');
    }
  };

  // הוספה חכמה של תגית HTML או פקודת CSS בלחיצה על כפתורי הסרגל המהיר
  const handleQuickInsert = (chip, type) => {
    const editor = editorInstanceRef.current;

    if (editorMode === 'tabs') {
      if (type === 'css') {
        const nextCss = tabCss.trim()
          ? chip.isFullRule
            ? `${tabCss}\n\n${chip.snippet}`
            : tabCss.includes('}')
            ? tabCss.replace(/\}\s*$/, `${chip.snippet}\n}`)
            : `${tabCss}\n${chip.snippet}`
          : chip.isFullRule
          ? chip.snippet
          : `main {\n${chip.snippet}\n}`;
        setTabCss(nextCss);
        compileTabsToHtml(tabHtml, nextCss, tabJs);
        setActiveTab('css');
      } else {
        const nextHtml = tabHtml.trim() ? `${tabHtml}\n  ${chip.snippet}` : `  ${chip.snippet}`;
        setTabHtml(nextHtml);
        compileTabsToHtml(nextHtml, tabCss, tabJs);
        setActiveTab('html');
      }
      return;
    }

    // במצב קובץ יחיד (single)
    if (type === 'css') {
      if (/<style\b[^>]*>[\s\S]*?<\/style>/i.test(code)) {
        if (chip.isFullRule) {
          setCode(code.replace(/<\/style>/i, `\n${chip.snippet}\n</style>`));
        } else if (/\{\s*[^}]*\}\s*<\/style>/i.test(code)) {
          setCode(code.replace(/(\}\s*<\/style>)/i, `${chip.snippet}\n$1`));
        } else {
          setCode(code.replace(/<\/style>/i, `  main {\n${chip.snippet}\n  }\n</style>`));
        }
      } else {
        const styleBlock = chip.isFullRule
          ? `\n<style>\n${chip.snippet}\n</style>`
          : `\n<style>\n  main {\n${chip.snippet}\n  }\n</style>`;
        setCode(`${code}${styleBlock}`);
      }
      return;
    }

    // הוספת תגית HTML במיקום הסמן אם העורך פתוח, או לפני </body>
    if (editor && !chip.isStyleBlock) {
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('quick-insert', [
          {
            range: selection,
            text: chip.snippet,
            forceMoveMarkers: true
          }
        ]);
        editor.focus();
        return;
      }
    }

    if (chip.isStyleBlock) {
      if (!/<style/i.test(code)) {
        setCode(`${code}\n\n${chip.snippet}`);
      }
    } else if (/<\/body>/i.test(code)) {
      setCode(code.replace(/<\/body>/i, `  ${chip.snippet}\n\n</body>`));
    } else {
      setCode(`${code}\n${chip.snippet}`);
    }
  };

  // תיקון בלחיצה אחת של שגיאות כתיב בקוד של התלמיד
  const handleAutoFixStudentCode = () => {
    if (editorMode === 'tabs') {
      const { healed } = healCssSyntax(tabCss);
      setTabCss(healed);
      compileTabsToHtml(tabHtml, healed, tabJs);
    } else {
      setCode(healedCode);
    }
    setStatusBanner('שגיאות התחביר ב-CSS תוקנו אוטומטית בקוד שלך! ✨');
    setTimeout(() => setStatusBanner(''), 3500);
  };

  const handleClearToBlankPage = () => {
    if (!code.trim() || window.confirm('האם לאפס את העורך ל-<body> ריק כדי להתחיל לבנות מחדש?')) {
      setEditorMode('single');
      setCode(INITIAL_BODY_STARTER);
      setTabHtml('');
      setTabCss('');
      setTabJs('');
      setStatusBanner('העורך אופס ל-<body> נקי – מוכן לבנייה! ✨');
      setTimeout(() => setStatusBanner(''), 3000);
    }
  };

  const handleLoadBasicSkeleton = () => {
    setEditorMode('single');
    setCode(BASIC_HTML_SKELETON);
    setStatusBanner('נטענה דוגמת <body> ו-<style> בסיסית ✨');
    setTimeout(() => setStatusBanner(''), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // פונקציית עזר להורדת קובץ בודד למחשב
  const triggerFileDownload = (filename, content, mimeType = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1. הורדת קובץ index.html מאוחד (הכל כלול בקובץ אחד)
  const handleDownloadCombinedHtml = () => {
    triggerFileDownload('index.html', previewSrcDoc, 'text/html;charset=utf-8');
    setStatusBanner('הקובץ index.html הורד למחשב בהצלחה! 🎉');
    setTimeout(() => setStatusBanner(''), 3500);
  };

  // 2. הורדת קבצים נפרדים במצב 3 קבצים (index.html + style.css + script.js)
  const getSeparateFilesContent = () => {
    const parsed = editorMode === 'tabs' ? { html: tabHtml, css: tabCss, js: tabJs } : parseSingleCodeIntoTabs(code);
    const healedCssObj = healCssSyntax(parsed.css);
    const cleanCss = healedCssObj.healed || parsed.css;
    const cleanJs = (parsed.js || '').trim();

    const indexHtmlContent = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>האתר שלי</title>
  <!-- קישור לקובץ העיצוב החיצוני style.css -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
${parsed.html}
${cleanJs ? '  <!-- קישור לקובץ הפעולות script.js -->\n  <script src="script.js"></script>\n' : ''}</body>
</html>`;

    return {
      indexHtmlContent,
      styleCssContent: cleanCss,
      scriptJsContent: cleanJs
    };
  };

  const handleDownloadAllThreeFiles = () => {
    const { indexHtmlContent, styleCssContent, scriptJsContent } = getSeparateFilesContent();
    triggerFileDownload('index.html', indexHtmlContent, 'text/html;charset=utf-8');
    setTimeout(() => {
      triggerFileDownload('style.css', styleCssContent, 'text/css;charset=utf-8');
    }, 350);
    if (scriptJsContent) {
      setTimeout(() => {
        triggerFileDownload('script.js', scriptJsContent, 'text/javascript;charset=utf-8');
      }, 700);
    }
    setStatusBanner('כל קבצי הפרויקט (index.html + style.css) הורדו למחשב! שמור אותם באותה תיקייה 📦');
    setTimeout(() => setStatusBanner(''), 4500);
  };

  const handleDownloadSingleTabFile = (which) => {
    const { indexHtmlContent, styleCssContent, scriptJsContent } = getSeparateFilesContent();
    if (which === 'html') {
      triggerFileDownload('index.html', indexHtmlContent, 'text/html;charset=utf-8');
      setStatusBanner('הקובץ index.html הורד למחשב! 🌐');
    } else if (which === 'css') {
      triggerFileDownload('style.css', styleCssContent, 'text/css;charset=utf-8');
      setStatusBanner('הקובץ style.css הורד למחשב! 🎨');
    } else if (which === 'js') {
      triggerFileDownload('script.js', scriptJsContent || '// קוד JavaScript\n', 'text/javascript;charset=utf-8');
      setStatusBanner('הקובץ script.js הורד למחשב! ⚡');
    }
    setTimeout(() => setStatusBanner(''), 3500);
  };

  const handleUploadFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        if (file.name.endsWith('.css')) {
          const parsed = editorMode === 'tabs' ? { html: tabHtml, js: tabJs } : parseSingleCodeIntoTabs(code);
          setTabHtml(parsed.html);
          setTabCss(content);
          setTabJs(parsed.js);
          setEditorMode('tabs');
          setActiveTab('css');
          compileTabsToHtml(parsed.html, content, parsed.js);
        } else {
          setEditorMode('single');
          setCode(content);
        }
        setStatusBanner(`הקובץ "${file.name}" נטען לעורך בהצלחה! 📂`);
        setTimeout(() => setStatusBanner(''), 3500);
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const syncMonacoLayout = () => {
    try {
      if (editorInstanceRef.current && editorWrapperRef.current) {
        const rect = editorWrapperRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          editorInstanceRef.current.layout({
            width: Math.floor(rect.width),
            height: Math.floor(rect.height)
          });
        } else {
          editorInstanceRef.current.layout();
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    const t1 = setTimeout(syncMonacoLayout, 30);
    const t2 = setTimeout(syncMonacoLayout, 180);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [syntaxIssues.length, viewLayout, editorMode, activeTab, showAiAgentPanel, statusBanner]);

  useEffect(() => {
    const onWinResize = () => syncMonacoLayout();
    window.addEventListener('resize', onWinResize);
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && editorWrapperRef.current) {
      ro = new ResizeObserver(() => syncMonacoLayout());
      ro.observe(editorWrapperRef.current);
    }
    return () => {
      window.removeEventListener('resize', onWinResize);
      if (ro) ro.disconnect();
    };
  }, []);

  const editorOptions = useMemo(
    () => ({
      automaticLayout: true,
      selectOnLineNumbers: true,
      readOnly: false,
      wordWrap: 'on',
      scrollBeyondLastLine: true,
      padding: { top: 14, bottom: 160 },
      minimap: { enabled: false },
      fontSize: 15,
      lineHeight: 24,
      fontFamily: "'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif",
      fontLigatures: false,
      quickSuggestions: { other: true, comments: false, strings: true },
      suggestOnTriggerCharacters: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      formatOnPaste: true,
      tabCompletion: 'on',
      scrollbar: {
        vertical: 'visible',
        horizontal: 'auto',
        useShadows: true,
        verticalHasArrows: true,
        horizontalHasArrows: false,
        verticalScrollbarSize: 16,
        horizontalScrollbarSize: 12,
        alwaysConsumeMouseWheel: false
      }
    }),
    []
  );

  // סגירה אוטומטית של תגית HTML ברגע שהתלמיד מקליד '>' + החלת גופן רגיל ונקי בעורך
  const handleEditorMount = (editor, monaco) => {
    editorInstanceRef.current = editor;
    registerSmartMonacoProviders(monaco);

    try {
      editor.updateOptions({
        fontFamily: "'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif",
        fontLigatures: false,
        automaticLayout: true,
        scrollBeyondLastLine: true,
        padding: { top: 14, bottom: 160 }
      });
      if (monaco && monaco.editor && typeof monaco.editor.remeasureFonts === 'function') {
        setTimeout(() => {
          monaco.editor.remeasureFonts();
          syncMonacoLayout();
        }, 80);
      }
      setTimeout(syncMonacoLayout, 10);
    } catch (_) {}

    editor.onKeyUp((e) => {
      // בודקים אם המשתמש הקליד '>' (Shift + .)
      if (e.browserEvent && e.browserEvent.key === '>') {
        const model = editor.getModel();
        const pos = editor.getPosition();
        if (!model || !pos) return;

        const lineContent = model.getLineContent(pos.lineNumber);
        const beforeCursor = lineContent.substring(0, pos.column - 1);
        const afterCursor = lineContent.substring(pos.column - 1);

        // תגיות שלא נסגרות עם </tag>
        const voidTags = ['img', 'br', 'hr', 'input', 'link', 'meta', '!doctype'];
        const match = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>$/);
        if (match) {
          const tagName = match[1].toLowerCase();
          if (!voidTags.includes(tagName) && !afterCursor.startsWith(`</${tagName}>`)) {
            const closeTag = `</${tagName}>`;
            editor.executeEdits('auto-close-tag', [
              {
                range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
                text: closeTag,
                forceMoveMarkers: false
              }
            ]);
            editor.setPosition(pos);
          }
        }
      }
    });
  };

  const deviceWidthMap = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  return (
    <div
      className="smart-regular-font-studio"
      style={{
        width: '100%',
        maxWidth: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f172a',
        color: '#f8fafc',
        fontFamily: "'Segoe UI', 'Rubik', 'Assistant', -apple-system, BlinkMacSystemFont, Arial, sans-serif",
        direction: 'rtl',
        overflow: 'hidden'
      }}
      onClick={() => {
        if (openMenu) setOpenMenu(null);
      }}
    >
      {/* כפיית גופן רגיל, נקי וקריא בכל אזור עריכת הקוד כולל בתוך ה-Monaco Editor */}
      <style>{`
        .smart-regular-font-studio,
        .smart-regular-font-studio button,
        .smart-regular-font-studio input,
        .smart-regular-font-studio textarea,
        .smart-regular-font-studio code,
        .smart-regular-font-studio pre,
        .smart-regular-font-studio .monaco-editor,
        .smart-regular-font-studio .monaco-editor .view-lines,
        .smart-regular-font-studio .monaco-editor .view-line,
        .smart-regular-font-studio .monaco-editor .view-line span,
        .smart-regular-font-studio .monaco-editor .margin-view-overlays {
          font-family: 'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif !important;
          letter-spacing: 0px !important;
        }
        .smart-regular-font-studio .monaco-editor {
          border-radius: 0px !important;
        }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm,.css"
        onChange={handleUploadFile}
        style={{ display: 'none' }}
      />

      <input
        ref={projectImageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUploadProjectImage}
        style={{ display: 'none' }}
      />

      <input
        ref={aiAttachmentInputRef}
        type="file"
        multiple
        accept="image/*,.html,.htm,.css,.js,.txt,.json,.md"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleAddAiAttachments(e.target.files);
          }
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />

      {/* 🧭 סרגל עליון מקוצר, נקי ומסודר עם רשימה נפתחת */}
      <header
        style={{
          height: '52px',
          padding: '0 16px',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          zIndex: 60
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ימין: כפתור חזרה + כותרת קצרה + בורר קובץ 1 / 3 קבצים */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to="/tracks"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              textDecoration: 'none',
              padding: '6px 11px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}
          >
            🏠 חזרה
          </Link>

          <div style={{ fontWeight: '900', fontSize: '0.94rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💻</span>
            <span>עורך קוד פתוח (HTML & CSS)</span>
          </div>

          <div style={{ display: 'flex', gap: '3px', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
            <button
              onClick={() => handleSwitchEditorMode('single')}
              style={{
                background: editorMode === 'single' ? '#10b981' : 'transparent',
                color: editorMode === 'single' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              📄 קובץ אחד
            </button>
            <button
              onClick={() => handleSwitchEditorMode('tabs')}
              style={{
                background: editorMode === 'tabs' ? '#10b981' : 'transparent',
                color: editorMode === 'tabs' ? '#0f172a' : '#cbd5e1',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🗂️ 3 קבצים
            </button>
          </div>
        </div>

        {/* שמאל: העלאת תמונה מהמחשב + צפייה מקדימה + הורדה + רשימה נפתחת מאוחדת לכל שאר הכלים */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {statusBanner && (
            <span style={{ fontSize: '0.76rem', color: '#4ade80', fontWeight: '700', background: 'rgba(16,185,129,0.12)', padding: '4px 9px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.3)' }}>
              {statusBanner}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              if (projectImageInputRef.current) projectImageInputRef.current.click();
            }}
            title="העלה תמונה ששמרת בתיקיית האתר שלך במחשב (למשל banner.jpg)"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#ffffff',
              border: '1px solid #a78bfa',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.35)'
            }}
          >
            <span>🖼️</span>
            <span>העלה תמונה מהמחשב לאתר</span>
          </button>

          <button
            onClick={() => setViewLayout((prev) => (prev === 'fullPreview' ? 'split' : 'fullPreview'))}
            style={{
              background: viewLayout === 'fullPreview' ? '#d97706' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            👁️ {viewLayout === 'fullPreview' ? 'חזרה לעורך' : 'צפייה מקדימה'}
          </button>

          <button
            onClick={() => {
              if (editorMode === 'tabs') {
                setShowDownloadModal(true);
              } else {
                handleDownloadCombinedHtml();
              }
            }}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            📥 הורד למחשב
          </button>

          {/* רשימה נפתחת מאוחדת לכל הפעולות והכלים */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
              style={{
                background: '#334155',
                color: '#f8fafc',
                border: '1px solid #475569',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>⚙️ כלים ופעולות</span>
              <span style={{ fontSize: '0.7rem' }}>▾</span>
            </button>

            {openMenu === 'file' && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '12px',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.5)',
                  minWidth: '250px',
                  padding: '6px',
                  zIndex: 120
                }}
              >
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setShowTagGuideModal(true);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#a78bfa',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🎨</span>
                  <span>מדריך תגיות HTML ופקודות CSS</span>
                </button>

                <div style={{ height: '1px', background: '#334155', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setOpenMenu(null);
                    handleDownloadCombinedHtml();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#38bdf8',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>📥</span>
                  <span>הורד קובץ index.html מאוחד</span>
                </button>

                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setShowDownloadModal(true);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#34d399',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🗂️</span>
                  <span>הורד כ-3 קבצים נפרדים (HTML + CSS)</span>
                </button>

                <button
                  onClick={() => {
                    setOpenMenu(null);
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#c084fc',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>📂</span>
                  <span>העלה קובץ מהמחשב</span>
                </button>

                <button
                  onClick={() => {
                    handleCopy();
                    setOpenMenu(null);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#f8fafc',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{copied ? '✅' : '📋'}</span>
                  <span>{copied ? 'הקוד הועתק!' : 'העתק קוד ללוח'}</span>
                </button>

                <div style={{ height: '1px', background: '#334155', margin: '4px 0' }} />

                <div style={{ padding: '4px 10px', fontSize: '0.73rem', color: '#94a3b8', fontWeight: '700' }}>
                  גודל תצוגה מקדימה:
                </div>
                <div style={{ display: 'flex', gap: '4px', padding: '4px 8px' }}>
                  {[
                    { id: 'desktop', label: '🖥️ מחשב' },
                    { id: 'tablet', label: '📟 טאבלט' },
                    { id: 'mobile', label: '📱 נייד' }
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      onClick={() => {
                        setPreviewDevice(dev.id);
                        setOpenMenu(null);
                      }}
                      style={{
                        flex: 1,
                        background: previewDevice === dev.id ? '#2563eb' : '#0f172a',
                        color: '#ffffff',
                        border: '1px solid #334155',
                        padding: '5px 6px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {dev.label}
                    </button>
                  ))}
                </div>

                <div style={{ height: '1px', background: '#334155', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setOpenMenu(null);
                    handleLoadBasicSkeleton();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#94a3b8',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>📄</span>
                  <span>טען תבנית HTML + CSS לדוגמה</span>
                </button>

                <button
                  onClick={() => {
                    setOpenMenu(null);
                    handleClearToBlankPage();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#f87171',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🗑️</span>
                  <span>נקה עורך להתחלה חדשה</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🖥️ גוף הסביבה: ימין - סוכן AI חי לקוד | מרכז - עורך קוד נקי | שמאל - תצוגה חיה */}
      <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* 🤖 פאנל סוכן AI חי לקוד + צ'אט וקבצים/תמונות (כמו ב-Antigravity) */}
        {showAiAgentPanel && viewLayout !== 'fullPreview' && (
          <div
            style={{
              width: '360px',
              minWidth: '325px',
              height: '100%',
              background: '#0f172a',
              borderLeft: '2px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30
            }}
            onClick={(e) => e.stopPropagation()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer?.files?.length) {
                handleAddAiAttachments(e.dataTransfer.files);
              }
            }}
          >
            {/* כותרת סוכן ה-AI */}
            <div
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                borderBottom: '1px solid #4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🤖 סוכן AI חכם (שיחה + קוד + תמונות)</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#a5b4fc', fontWeight: '700' }}>
                  Hugging Face (Qwen2.5-Coder / VL-72B + DeepSeek-V3) + Gemini 3.5
                </div>
              </div>
              {aiUndoStack.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndoLastAiChange}
                  title="בטל את השינוי האחרון שסוכן ה-AI ביצע בקוד"
                  style={{
                    background: '#f59e0b',
                    color: '#0f172a',
                    border: 'none',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ↩️ בטל שינוי
                </button>
              )}
            </div>

            {/* בורר מצב עבודה: אוטומטי (גם עונה לשאלות וגם מעדכן קוד) / שיחה בלבד / עדכון קוד */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                padding: '6px 10px',
                background: '#0b1120',
                borderBottom: '1px solid #1e293b'
              }}
            >
              {[
                { id: 'auto', label: '🤖 אוטומטי (שיחה + קוד)' },
                { id: 'chat', label: '💬 שאלה / שיחה' },
                { id: 'code', label: '⚡ עדכון קוד' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAiAgentMode(m.id)}
                  style={{
                    flex: 1,
                    background: aiAgentMode === m.id ? '#4f46e5' : '#1e293b',
                    color: aiAgentMode === m.id ? '#ffffff' : '#94a3b8',
                    border: aiAgentMode === m.id ? '1px solid #818cf8' : '1px solid #334155',
                    borderRadius: '6px',
                    padding: '4px 6px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* כפתורי פעולה מהירים לעריכת הקוד או שאלות בלייב */}
            <div
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #1e293b',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                background: '#111827'
              }}
            >
              {[
                { label: '🚀 בנה דף נחיתה', prompt: 'בנה לי דף נחיתה מודרני, מרשים ומעוצב ב-HTML5 ו-CSS3 עם אזור פתיחה, כותרת וכפתור בולט.' },
                { label: '🎨 שדרג עיצוב וצבעים', prompt: 'שדרג את העיצוב ב-<style> של הקוד שלי עם צבעים מודרניים, גרדיאנטים, פינות עגולות וצלליות יפות.' },
                { label: '🖼️ איך מוסיפים תמונת רקע?', prompt: 'איך אני מוסיף ל-div תמונת רקע ב-CSS? תסביר לי קצר וברור עם דוגמה.' },
                { label: '🛠️ תקן ושפר קוד', prompt: 'בדוק את קוד ה-HTML וה-CSS שלי, תקן כל שגיאה ושפר את הנראות והיישור של האלמנטים בדף.' }
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  disabled={isAiRunning}
                  onClick={() => handleRunLiveAiAgent(btn.prompt)}
                  style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    padding: '6px 8px',
                    borderRadius: '7px',
                    fontSize: '0.73rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textAlign: 'right'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* היסטוריית שיחה ועדכוני קוד בלייב */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-start' : 'stretch',
                    background: msg.role === 'user' ? '#2563eb' : '#1e293b',
                    color: '#f8fafc',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    lineHeight: '1.55',
                    border: msg.role === 'user' ? 'none' : '1px solid #334155'
                  }}
                >
                  <div style={{ fontWeight: '800', fontSize: '0.72rem', color: msg.role === 'user' ? '#bfdbfe' : '#a78bfa', marginBottom: '4px' }}>
                    {msg.role === 'user' ? '👤 אתה:' : '🤖 סוכן AI:'}
                  </div>

                  {/* הצגת תמונות או קבצים שצורפו להודעה */}
                  {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      {msg.attachments.map((att, aIdx) =>
                        att.kind === 'image' && att.previewUrl ? (
                          <div
                            key={aIdx}
                            style={{
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '1px solid rgba(255,255,255,0.35)',
                              background: '#0f172a',
                              maxWidth: '150px'
                            }}
                          >
                            <img
                              src={att.previewUrl}
                              alt={att.name || 'תמונה מצורפת'}
                              style={{ width: '100%', maxHeight: '95px', objectFit: 'cover', display: 'block' }}
                            />
                            <div style={{ fontSize: '0.66rem', padding: '2px 6px', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              🖼️ {att.name}
                            </div>
                          </div>
                        ) : (
                          <div
                            key={aIdx}
                            style={{
                              background: 'rgba(15, 23, 42, 0.5)',
                              border: '1px solid rgba(255,255,255,0.25)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              fontWeight: '700'
                            }}
                          >
                            📄 {att.name}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                  {msg.applied && (
                    <div
                      style={{
                        marginTop: '6px',
                        background: 'rgba(16, 185, 129, 0.16)',
                        border: '1px solid rgba(52, 211, 153, 0.4)',
                        color: '#34d399',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        display: 'inline-block'
                      }}
                    >
                      ✅ הקוד עודכן בלייב בעורך ובתצוגה!
                    </div>
                  )}
                </div>
              ))}

              {isAiRunning && (
                <div
                  style={{
                    background: '#1e293b',
                    border: '1px solid #6366f1',
                    color: '#c7d2fe',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}
                >
                  ⏳ הסוכן חושב, קורא את הקבצים/תמונות ומכין תשובה...
                </div>
              )}
            </div>

            {/* תצוגה מקדימה של תמונות וקבצים שצורפו לפני שליחה */}
            {aiAttachments.length > 0 && (
              <div
                style={{
                  padding: '8px 10px',
                  background: '#1e293b',
                  borderTop: '1px solid #334155',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  alignItems: 'center'
                }}
              >
                {aiAttachments.map((att) => (
                  <div
                    key={att.id}
                    style={{
                      position: 'relative',
                      background: '#0f172a',
                      border: '1px solid #6366f1',
                      borderRadius: '8px',
                      padding: '4px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0
                    }}
                  >
                    {att.kind === 'image' && att.previewUrl ? (
                      <img
                        src={att.previewUrl}
                        alt={att.name}
                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.1rem' }}>📄</span>
                    )}
                    <div style={{ maxWidth: '110px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {att.name}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: '#34d399', fontWeight: '700' }}>
                        {att.kind === 'image' ? '🖼️ תמונה מוכנה' : '📑 קובץ קוד'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAiAttachment(att.id)}
                      title="הסר קובץ"
                      style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '0.65rem',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* שורת הקלדת בקשה + צירוף תמונה או קובץ לסוכן */}
            <div
              style={{
                padding: '10px',
                borderTop: '1px solid #334155',
                background: '#111827',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <textarea
                rows={2}
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                onPaste={handlePasteInAiInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRunLiveAiAgent();
                  }
                }}
                placeholder="שאל כל שאלה, הדבק קישור/תמונה (Ctrl+V), או בקש לשנות קוד..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  disabled={isAiRunning}
                  onClick={() => {
                    if (aiAttachmentInputRef.current) aiAttachmentInputRef.current.click();
                  }}
                  title="העלה תמונה (לרקע / לאתר / לעיצוב) או קובץ קוד"
                  style={{
                    background: '#1e293b',
                    color: '#38bdf8',
                    border: '1px solid #38bdf8',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>📎</span>
                  <span>צרף תמונה / קובץ</span>
                </button>

                <button
                  type="button"
                  disabled={isAiRunning || (!aiPromptInput.trim() && aiAttachments.length === 0)}
                  onClick={() => handleRunLiveAiAgent()}
                  style={{
                    flex: 1,
                    background: isAiRunning
                      ? '#475569'
                      : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '900',
                    cursor: isAiRunning ? 'wait' : 'pointer'
                  }}
                >
                  {isAiRunning ? '⏳ שולח לסוכן...' : '🚀 שלח לסוכן ה-AI'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* מרכז: עורך הקוד Monaco עם סרגל עליון דק ורשימה נפתחת אחת להוספת תגיות */}
        <div
          style={{
            flex: viewLayout === 'fullEditor' ? 1 : 1.05,
            display: viewLayout === 'fullPreview' ? 'none' : 'flex',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
            borderLeft: '2px solid #1e293b',
            flexDirection: 'column',
            minWidth: 0
          }}
        >
          {/* סרגל דק מעל העורך: לשוניות קבצים + רשימה נפתחת להוספה מהירה של תגיות ו-CSS */}
          <div
            style={{
              background: '#0f172a',
              borderBottom: '1px solid #1e293b',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              position: 'relative',
              zIndex: 40,
              flexShrink: 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {editorMode === 'tabs' ? (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {[
                  { id: 'html', label: '🌐 index.html', color: '#ea580c' },
                  { id: 'css', label: '🎨 style.css', color: '#2563eb' },
                  { id: 'js', label: '⚡ script.js', color: '#ca8a04' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      if (t.id === 'css') setQuickBarMode('css');
                      else if (t.id === 'html') setQuickBarMode('html');
                    }}
                    style={{
                      background: activeTab === t.id ? t.color : '#1e293b',
                      color: '#ffffff',
                      border: activeTab === t.id ? '1px solid #ffffff' : '1px solid #334155',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700' }}>
                📄 קוד האתר (בונים ב-<code>&lt;body&gt;</code> ומעצבים ב-<code>&lt;style&gt;</code>)
              </span>
            )}

            {/* רשימה נפתחת להוספת תגית HTML או פקודת CSS */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'quickInsert' ? null : 'quickInsert')}
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid #38bdf8',
                  padding: '4px 11px',
                  borderRadius: '7px',
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⚡ הוספת תגית / CSS</span>
                <span>▾</span>
              </button>

              {openMenu === 'quickInsert' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '12px',
                    boxShadow: '0 14px 32px rgba(0,0,0,0.55)',
                    width: '320px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    padding: '8px',
                    zIndex: 130
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setQuickBarMode('html')}
                      style={{
                        flex: 1,
                        background: quickBarMode === 'html' ? '#0284c7' : '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      🏷️ תגיות HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickBarMode('css')}
                      style={{
                        flex: 1,
                        background: quickBarMode === 'css' ? '#10b981' : '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      🎨 פקודות CSS
                    </button>
                  </div>

                  <div dir="ltr" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    {(quickBarMode === 'css' ? QUICK_INSERT_CSS_CHIPS : QUICK_INSERT_HTML_CHIPS).map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => {
                          handleQuickInsert(chip, quickBarMode === 'css' ? 'css' : 'html');
                          setOpenMenu(null);
                        }}
                        style={{
                          background: '#0f172a',
                          color: quickBarMode === 'css' ? '#6ee7b7' : '#7dd3fc',
                          border: '1px solid #334155',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          fontFamily: "'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif",
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        + {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 💡 התראה חכמה כאשר מתגלה שגיאת תחביר ב-CSS */}
          {syntaxIssues.length > 0 && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: '0.76rem',
                color: '#fde68a',
                flexShrink: 0
              }}
            >
              <span>
                <strong>💡 זוהתה טעות קטנה ב-CSS: </strong>
                {syntaxIssues[0]}
              </span>
              <button
                type="button"
                onClick={handleAutoFixStudentCode}
                style={{
                  background: '#f59e0b',
                  color: '#0f172a',
                  border: 'none',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontWeight: '900',
                  fontSize: '0.73rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                ✨ תקן אוטומטית
              </button>
            </div>
          )}

          {/* אזור כתיבת הקוד */}
          <div
            ref={editorWrapperRef}
            style={{
              flex: 1,
              minHeight: 0,
              width: '100%',
              direction: 'ltr',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                overflow: 'hidden'
              }}
            >
              {editorMode === 'single' ? (
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language="html"
                  theme="vs-dark"
                  value={code}
                  editorDidMount={handleEditorMount}
                  options={editorOptions}
                  onChange={(newVal) => setCode(newVal)}
                />
              ) : (
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language={activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript'}
                  theme="vs-dark"
                  value={activeTab === 'html' ? tabHtml : activeTab === 'css' ? tabCss : tabJs}
                  editorDidMount={handleEditorMount}
                  options={editorOptions}
                  onChange={(newVal) => {
                    if (activeTab === 'html') {
                      setTabHtml(newVal);
                      compileTabsToHtml(newVal, tabCss, tabJs);
                    } else if (activeTab === 'css') {
                      setTabCss(newVal);
                      compileTabsToHtml(tabHtml, newVal, tabJs);
                    } else {
                      setTabJs(newVal);
                      compileTabsToHtml(tabHtml, tabCss, newVal);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* צד שמאל: תצוגה חיה של גוף הדף (<body>) */}
        <div
          style={{
            flex: 1,
            display: viewLayout === 'fullEditor' ? 'none' : 'flex',
            height: '100%',
            background: '#0b1120',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: previewDevice === 'desktop' ? '0' : '16px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: deviceWidthMap[previewDevice],
              height: '100%',
              background: '#ffffff',
              borderRadius: previewDevice === 'desktop' ? '0px' : '20px',
              overflow: 'hidden',
              boxShadow: previewDevice === 'desktop' ? 'none' : '0 15px 40px rgba(0,0,0,0.55)',
              border: previewDevice === 'desktop' ? 'none' : '6px solid #334155',
              transition: 'width 0.25s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* סרגל דפדפן נקי עם אפשרות פתיחה בחלון חדש ומסך מלא */}
            <div
              style={{
                background: '#f1f5f9',
                borderBottom: '1px solid #cbd5e1',
                padding: '7px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.78rem',
                color: '#334155',
                direction: 'rtl',
                flexShrink: 0
              }}
            >
              <span style={{ fontWeight: '800' }}>
                🌐 תצוגה חיה של האתר שלך (כל מה שכתבת בתוך ה-<strong>&lt;body&gt;</strong> וה-<strong>&lt;style&gt;</strong>)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const htmlDoc = previewSrcDoc || code;
                    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                  }}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  🚀 פתח בחלון דפדפן חדש
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayout((prev) => (prev === 'fullPreview' ? 'split' : 'fullPreview'))}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {viewLayout === 'fullPreview' ? '✕ סגור מסך מלא' : '⛶ הגדל תצוגה למסך מלא'}
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
                </div>
              </div>
            </div>

            {/* גוף הדף הלבן (מציג את מה שכתוב בתוך ה-<body>) */}
            <div style={{ flex: 1, position: 'relative', background: '#ffffff' }}>
              {!previewSrcDoc ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    textAlign: 'center',
                    color: '#64748b',
                    direction: 'rtl'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📄</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.15rem' }}>
                    הדף הלבן ריק ומוכן לכתיבת קוד מאפס!
                  </h3>
                  <p style={{ margin: 0, maxWidth: '420px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    התחילו להקליד את תגיות ה-HTML בעורך הכהה מימין לפי שלבי המדריך – וראו איך האתר שלכם נבנה כאן בשידור חי!
                  </p>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  title="Live HTML Preview"
                  srcDoc={previewSrcDoc}
                  sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📥 מודאל ברור ומודרך להורדת קבצים למחשב (במיוחד במצב 3 קבצים: HTML + CSS + JS) */}
      {showDownloadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px'
          }}
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '20px',
              maxWidth: '640px',
              width: '100%',
              padding: '26px',
              direction: 'rtl',
              boxShadow: '0 25px 50px rgba(0,0,0,0.45)',
              border: '2px solid #cbd5e1'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                  📥 איך תרצה להוריד ולשמור את האתר שלך במחשב?
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#475569', fontWeight: '600' }}>
                  בחר אם להוריד כתיקיית פרויקט של 3 קבצים נפרדים או כקובץ HTML אחד מאוחד:
                </p>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* אפשרות 1: 3 קבצים נפרדים */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '2px solid #34d399',
                  borderRadius: '14px',
                  padding: '18px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#065f46', marginBottom: '6px' }}>
                  🗂️ אפשרות 1: הורדת פרויקט של 3 קבצים נפרדים (index.html + style.css)
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#047857', lineHeight: '1.5', fontWeight: '600' }}>
                  המערכת תוריד למחשב שלך את <code>index.html</code> (שכבר כולל בתוכו את הקישור <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>) ואת קובץ העיצוב <code>style.css</code>.
                  <br />
                  <strong>חשוב:</strong> שמור את הקבצים באותה תיקייה במחשב כדי שהעיצוב יתחבר לדף!
                </p>

                <button
                  onClick={() => {
                    handleDownloadAllThreeFiles();
                    setShowDownloadModal(false);
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontWeight: '900',
                    fontSize: '0.96rem',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  📦 הורד את כל הקבצים יחד למחשב ( בלחיצה אחת )
                </button>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleDownloadSingleTabFile('html')}
                    style={{
                      flex: 1,
                      background: '#ffffff',
                      color: '#ea580c',
                      border: '1.5px solid #fdba74',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    📥 הורד רק index.html
                  </button>
                  <button
                    onClick={() => handleDownloadSingleTabFile('css')}
                    style={{
                      flex: 1,
                      background: '#ffffff',
                      color: '#2563eb',
                      border: '1.5px solid #93c5fd',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    📥 הורד רק style.css
                  </button>
                  <button
                    onClick={() => handleDownloadSingleTabFile('js')}
                    style={{
                      flex: 1,
                      background: '#ffffff',
                      color: '#ca8a04',
                      border: '1.5px solid #fde047',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    📥 הורד רק script.js
                  </button>
                </div>
              </div>

              {/* אפשרות 2: קובץ אחד מאוחד */}
              <div
                style={{
                  background: '#eff6ff',
                  border: '2px solid #60a5fa',
                  borderRadius: '14px',
                  padding: '18px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1e3a8a', marginBottom: '6px' }}>
                  📄 אפשרות 2: הורדה כקובץ index.html אחד מאוחד (הכי קל לשליחה ולטעינה חוזרת!)
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#1e40af', lineHeight: '1.5', fontWeight: '600' }}>
                  מאחד את ה-HTML, ה-CSS וה-JavaScript לתוך קובץ <code>index.html</code> אחד שעובד מיד מכל מקום במחשב וניתן להעלות אותו חזרה לעורך במפגש הבא.
                </p>
                <button
                  onClick={() => {
                    handleDownloadCombinedHtml();
                    setShowDownloadModal(false);
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontWeight: '900',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  📄 הורד כקובץ index.html מאוחד
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📚 מודאל מילון תגיות ופקודות עיצוב (ללא אפשרות העתקה) */}
      {showTagGuideModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowTagGuideModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '18px',
              maxWidth: '980px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '26px',
              direction: 'rtl',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
                  🎨 מילון תגיות ופקודות עיצוב (&lt;style&gt; ו-CSS)
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>
                  כאן מופיעות כל תגיות ופקודות העיצוב עם פירוט כל האפשרויות ודוגמה בקוד. קראו את הדוגמה והקלידו אותה בעצמכם בעורך!
                </p>
              </div>
              <button
                onClick={() => setShowTagGuideModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}
              >
                ✕
              </button>
            </div>

            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #ede9fe 100%)',
                  border: '1px solid #93c5fd',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1e3a8a', marginBottom: '4px' }}>
                  🎨 איך מעצבים ב-&lt;style&gt; (CSS)?
                </div>
                <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '600', lineHeight: '1.5' }}>
                  מתחת ל-<code>&lt;/body&gt;</code> פותחים תגית <code>&lt;style&gt;</code>, רושמים את שם התגית (כמו <code>body</code>, <code>main</code>, <code>h1</code>, <code>button</code>) או שם הקופסה עם נקודה (כמו <code>.card</code>) ובתוך סוגריים מסולסלים <code>{`{ }`}</code> מקלידים את פקודות העיצוב (חשוב לסיים כל שורה בנקודה-פסיק <code>;</code>!):
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '14px' }}>
                {CSS_DESIGN_DICTIONARY.map((cssItem, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #bfdbfe',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '900', fontSize: '0.96rem', color: '#1d4ed8', marginBottom: '5px' }}>
                        {cssItem.title}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: '1.5', fontWeight: '600', marginBottom: '8px' }}>
                        {cssItem.desc}
                      </div>
                      {Array.isArray(cssItem.options) && cssItem.options.length > 0 && (
                        <div
                          style={{
                            background: '#ffffff',
                            border: '1px solid #dbeafe',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            marginBottom: '6px'
                          }}
                        >
                          <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#1e40af', marginBottom: '4px' }}>
                            📋 כל האפשרויות בתגית/פקודה זו:
                          </div>
                          <ul style={{ margin: 0, paddingRight: '18px', fontSize: '0.8rem', color: '#1e293b', lineHeight: '1.55', fontWeight: '600' }}>
                            {cssItem.options.map((opt, oIdx) => (
                              <li key={oIdx}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>💻 דוגמה בקוד (להקלדה עצמית בעורך):</span>
                        <span style={{ color: '#dc2626' }}>🔒 הקלדה ידנית בלבד (ללא העתקה)</span>
                      </div>
                      <pre
                        dir="ltr"
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                          margin: 0,
                          background: '#0f172a',
                          color: '#38bdf8',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontFamily: "'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif",
                          overflowX: 'auto',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none'
                        }}
                      >
                        <code>{cssItem.prop}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
