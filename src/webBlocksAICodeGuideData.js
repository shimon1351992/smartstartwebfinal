import { WEBBLOCKS_AI_SESSIONS } from './webBlocksAITrackData';
import { OPEN_CODE_SOURCE_SESSIONS } from './webBlocksOpenCodeSourceSessions';
import { buildSession1RichSlides } from './session1InteractiveLesson';

// ============================================================================
// 📚 מילון תגיות ופקודות עיצוב בלבד (<style> ו-CSS) – עם פירוט כל האפשרויות ודוגמה בקוד!
// ============================================================================
export const OPEN_CODE_TAGS_ENCYCLOPEDIA = [
  {
    categoryId: 'style_tag_selectors',
    categoryTitle: '1. 🎨 תגית העיצוב <style> ואיך בוחרים מה לעצב (Selectors)',
    categorySubtitle: 'איך פותחים את אזור העיצוב מתחת ל-</body> ובוחרים איזו תגית או קופסה לעצב:',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    tags: [
      {
        tag: '<style> ... </style>',
        name: 'תגית העיצוב של האתר',
        explanation: 'תגית ה-HTML שבתוכה כותבים את כל חוקי העיצוב (CSS) של הדף: צבעים, גופנים, מידות, מסגרות, פינות עגולות ואפקטים.',
        usageRule: 'פותחים <style> מיד מתחת ל-</body> וסוגרים ב-</style> בסוף העיצוב. כל שורת עיצוב מסתיימת בנקודה-פסיק (;).',
        optionsList: [
          'עיצוב תגית ישירות: כותבים את שם התגית ופותחים סוגריים מסולסלים, למשל body { ... } או h1 { ... }',
          'עיצוב לפי מחלקה (class): מוסיפים נקודה לפני השם, למשל .card { ... } עבור <div class="card">',
          'עיצוב לפי מזהה (id): מוסיפים סולמית לפני השם, למשל #hero { ... } עבור <div id="hero">',
          'עיצוב במעבר עכבר (:hover): מוסיפים :hover בסוף השם, למשל button:hover { ... }'
        ],
        example: `<style>\n  body {\n    background-color: #f0f9ff;\n  }\n  h1 {\n    color: #1d4ed8;\n  }\n</style>`
      },
      {
        tag: 'body / main / h1 / p / img / button',
        name: 'עיצוב לפי שם תגית (Tag Selector)',
        explanation: 'כאשר כותבים שם של תגית בתוך <style>, העיצוב חל אוטומטית על התגית הזו בדף.',
        usageRule: 'כותבים את שם התגית באנגלית באותיות קטנות (בלי סוגריים משולשים < >) ואז { }.',
        optionsList: [
          'body { ... } – עיצוב כל רקע המסך, הגופן הראשי ויישור ברירת המחדל של הדף כולו',
          'main { ... } – עיצוב תיבת התוכן/הכרטיסייה המרכזית של האתר',
          'h1 { ... } / h2 { ... } / h3 { ... } – עיצוב הכותרת הראשית וכותרות המשנה',
          'p { ... } – עיצוב פסקאות הטקסט באתר',
          'img { ... } – עיצוב התמונות (רוחב, גובה, עיגול פינות)',
          'button { ... } – עיצוב כפתורי הפעולה באתר'
        ],
        example: `<style>\n  main {\n    background-color: #ffffff;\n    padding: 28px;\n    border-radius: 20px;\n  }\n</style>`
      },
      {
        tag: '.card / .badge / .btn',
        name: 'עיצוב קופסה לפי מחלקה (Class Selector)',
        explanation: 'מאפשר לתת שם ייחודי לקופסה ב-HTML (למשל class="card" או class="badge") ולעצב רק אותה ב-<style> בעזרת נקודה (.) לפני השם.',
        usageRule: 'ב-<body> כותבים class="card", וב-<style> כותבים .card { ... } (עם נקודה בהתחלה!).',
        optionsList: [
          '.card { ... } – עיצוב כרטיסייה (רקע, ריווח פנימי, פינות עגולות וצללית)',
          '.badge { ... } – עיצוב תגית קטנה מעל הכותרת (רקע צבעוני, עיגול קפסולה וגופן מודגש)',
          '.row { ... } – עיצוב שורה שמסדרת אלמנטים זה לצד זה (display: flex)',
          'אפשר להמציא כל שם באנגלית שרוצים, כל עוד השם ב-class="" תואם לשם שאחרי הנקודה ב-<style>!'
        ],
        example: `<style>\n  .card {\n    background-color: #ffffff;\n    border-radius: 24px;\n    padding: 30px;\n  }\n  .badge {\n    background-color: #dbeafe;\n    color: #1e40af;\n    padding: 6px 14px;\n    border-radius: 999px;\n  }\n</style>`
      },
      {
        tag: ':hover (אפקט מעבר עכבר)',
        name: 'עיצוב שמופעל כשמעבירים עכבר',
        explanation: 'תוספת מיוחדת שגורמת לכפתור, לתמונה או לכרטיסייה להשתנות ברגע שהגולש מניח עליהם את סמן העכבר.',
        usageRule: 'מצמידים :hover מיד אחרי שם התגית או המחלקה (ללא רווח), למשל button:hover { ... }.',
        optionsList: [
          'button:hover – שינוי צבע הכפתור או הגדלתו במעבר עכבר',
          '.card:hover – הרמת הכרטיסייה למעלה או חיזוק הצללית שלה במעבר עכבר',
          'img:hover – הגדלה עדינה של התמונה כשמצביעים עליה',
          'a:hover – שינוי צבע קישור במעבר עכבר'
        ],
        example: `<style>\n  button {\n    background-color: #2563eb;\n    color: white;\n    transition: 0.25s;\n  }\n  button:hover {\n    background-color: #1d4ed8;\n    transform: scale(1.06);\n  }\n</style>`
      }
    ]
  },
  {
    categoryId: 'style_colors_bg',
    categoryTitle: '2. 🌈 צבעים, מעברי צבעים ותמונות רקע (Colors & Backgrounds)',
    categorySubtitle: 'כל הדרכים לצבוע את רקע האתר, הכרטיסיות, הטקסטים והכפתורים:',
    color: '#db2777',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    tags: [
      {
        tag: 'background-color',
        name: 'צבע רקע אחיד',
        explanation: 'צובע את הרקע של כל הדף (body), של כרטיסייה (.card / main), של תגית (.badge) או של כפתור (button).',
        usageRule: 'כותבים background-color: ואז את קוד הצבע או שמו באנגלית, ומסיימים ב-;',
        optionsList: [
          'קוד צבע HEX (הכי מקצועי): #ffffff (לבן), #0f172a (כחול-לילה כהה), #10b981 (ירוק אמרלד), #2563eb (כחול), #7c3aed (סגול), #f59e0b (כתום-זהב)',
          'שם צבע באנגלית: white, black, royalblue, gold, coral, lightcyan, lavender',
          'צבע שקוף למחצה (rgba): rgba(255, 255, 255, 0.85) – המספר האחרון (0 עד 1) קובע את רמת האטימות',
          'transparent – רקע שקוף לחלוטין'
        ],
        example: `<style>\n  body {\n    background-color: #0f172a;\n  }\n  .card {\n    background-color: #1e293b;\n  }\n</style>`
      },
      {
        tag: 'background: linear-gradient(...)',
        name: 'מעבר צבעים מדורג (Gradient)',
        explanation: 'יוצר רקע מרהיב שמשלב 2 או 3 צבעים שמתמזגים זה בזה בזווית שתבחרו.',
        usageRule: 'כותבים background: linear-gradient(זווית, צבע-ראשון, צבע-שני);',
        optionsList: [
          '135deg – מעבר אלכסוני מודרני (הכי פופולרי לכרטיסיות וכפתורים!)',
          '90deg או to right – מעבר אופקי משמאל לימין',
          '180deg או to bottom – מעבר אנכי מלמעלה למטה',
          'שילוב 3 צבעים: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
          'מעבר עגול מהמרכז: radial-gradient(circle, #38bdf8, #0f172a)'
        ],
        example: `<style>\n  body {\n    background: linear-gradient(135deg, #0f172a, #1e1b4b);\n  }\n  button {\n    background: linear-gradient(135deg, #2563eb, #7c3aed);\n    color: white;\n  }\n</style>`
      },
      {
        tag: 'background-image / background-size',
        name: 'תמונת רקע לאתר או לכרטיסייה',
        explanation: 'מאפשר לשים תמונה שיצרתם ב-AI כרקע של כל הדף או כרקע של קופסה מעוצבת.',
        usageRule: 'משלבים background-image יחד עם background-size: cover כדי שהתמונה תכסה את כל השטח.',
        optionsList: [
          'background-image: url("banner.jpg"); – טעינת תמונה ששמרתם והעליתם לעורך או קישור מהאינטרנט',
          'background-size: cover; – התאמת התמונה לכיסוי מלא של האזור בלי שוליים ריקים',
          'background-size: contain; – הצגת כל התמונה בשלמותה',
          'background-position: center; – מרכוז התמונה לאמצע',
          'background-repeat: no-repeat; – מניעת שכפול של התמונה'
        ],
        example: `<style>\n  body {\n    background-image: url("banner.jpg");\n    background-size: cover;\n    background-position: center;\n  }\n</style>`
      },
      {
        tag: 'color ו- opacity',
        name: 'צבע הטקסט ושקיפות האלמנט',
        explanation: 'color קובע את צבע האותיות והטקסט בתוך התגית. opacity קובע כמה האלמנט כולו יהיה שקוף או אטום.',
        usageRule: 'על רקע כהה בוחרים color בהיר (כמו #ffffff או #38bdf8), ועל רקע בהיר בוחרים color כהה (כמו #0f172a).',
        optionsList: [
          'color: #ffffff; – טקסט לבן חד (מושלם על כפתורים ורקעים כהים)',
          'color: #0f172a; – טקסט כהה קריא (מושלם על כרטיסייה לבנה)',
          'color: #2563eb; – טקסט כחול מודגש לכותרות',
          'opacity: 1; – אטום לגמרי (רגיל) | opacity: 0.85; – מעט שקוף | opacity: 0.5; – חצי שקוף'
        ],
        example: `<style>\n  h1 {\n    color: #38bdf8;\n  }\n  p {\n    color: #e2e8f0;\n    opacity: 0.9;\n  }\n</style>`
      }
    ]
  },
  {
    categoryId: 'style_typography',
    categoryTitle: '3. ✍️ עיצוב טקסט, גופנים ויישור (Typography & Alignment)',
    categorySubtitle: 'שליטה מלאה בגודל הכתב, עובי האותיות, סוג הגופן, היישור והמרווחים:',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    tags: [
      {
        tag: 'font-size',
        name: 'גודל הטקסט והאותיות',
        explanation: 'קובע כמה גדולות יהיו האותיות בכותרת, בפסקה, בתגית או בכפתור.',
        usageRule: 'נמדד בפיקסלים (px). ככל שהמספר גדול יותר – הכתב גדול יותר.',
        optionsList: [
          '12px עד 14px – גודל מתאים לתגיות קטנות (Badge) או הערות שוליים',
          '16px עד 18px – גודל אידיאלי ונוח לקריאה עבור פסקאות טקסט (<p>) וכפתורים',
          '22px עד 28px – גודל מצוין לכותרת משנה (<h2> או <h3>)',
          '36px עד 52px – גודל עוצמתי לכותרת ראשית של האתר (<h1>)'
        ],
        example: `<style>\n  h1 {\n    font-size: 40px;\n  }\n  p {\n    font-size: 18px;\n  }\n</style>`
      },
      {
        tag: 'font-weight ו- font-family',
        name: 'עובי הכתב וסוג הגופן (Font)',
        explanation: 'font-weight קובע עד כמה האותיות יהיו דקות או עבות ומודגשות. font-family קובע את סגנון הגופן.',
        usageRule: 'מומלץ להגדיר font-family בתוך body { ... } כדי שכל האתר יקבל גופן אחיד ונקי.',
        optionsList: [
          'font-weight: normal; (או 400) – עובי כתב רגיל לפסקאות',
          'font-weight: bold; (או 700) – כתב מודגש לכותרות ולכפתורים',
          'font-weight: 900; – כתב עבה וכבד במיוחד לכותרות ראשיים',
          'font-weight: 300; – כתב דק ועדין',
          'font-family: Arial, sans-serif; | "Segoe UI", sans-serif; | "Rubik", sans-serif;'
        ],
        example: `<style>\n  body {\n    font-family: "Segoe UI", Arial, sans-serif;\n  }\n  h1 {\n    font-weight: 900;\n  }\n</style>`
      },
      {
        tag: 'text-align',
        name: 'יישור טקסט ותוכן (ימין / מרכז / שמאל)',
        explanation: 'קובע לאיזה כיוון יתיישרו הטקסטים, התמונות והכפתורים שבתוך הקופסה.',
        usageRule: 'אם כותבים text-align: center בתוך body או .card, כל הכותרות, הפסקאות והכפתורים בפנים יתמרכזו לאמצע!',
        optionsList: [
          'text-align: center; – מרכוז מושלם לאמצע הקופסה (הכי פופולרי בכרטיסיות ובדפי נחיתה)',
          'text-align: right; – יישור לימין (מתאים לכתבות וטקסטים ארוכים בעברית)',
          'text-align: left; – יישור לשמאל (מתאים לאנגלית)',
          'text-align: justify; – יישור שורות לשני הצדדים כמו בעיתון'
        ],
        example: `<style>\n  .card {\n    text-align: center;\n  }\n</style>`
      },
      {
        tag: 'line-height / letter-spacing / text-decoration',
        name: 'מרווח שורות, מרווח אותיות וקו תחתון',
        explanation: 'פקודות לשדרוג הקריאות והמראה המקצועי של הטקסטים והקישורים באתר.',
        usageRule: 'line-height מומלץ בכל פסקה (<p>), ו-text-decoration: none מומלץ בכל קישור (<a>).',
        optionsList: [
          'line-height: 1.6; – פותח רווח נעים לקריאה בין שורות הפסקה (1.2 צפוף לכותרות, 1.6 רגיל, 2.0 מרווח)',
          'letter-spacing: 1px; – רווח אוויר בין האותיות (אפשר גם 2px–3px לתגיות וכותרות)',
          'text-decoration: none; – מסיר את הקו התחתון מקישורים (<a>)',
          'text-decoration: underline; – מוסיף קו תחתון לטקסט',
          'font-style: italic; – הופך את הכתב לנטוי'
        ],
        example: `<style>\n  p {\n    line-height: 1.6;\n    letter-spacing: 0.5px;\n  }\n  a {\n    text-decoration: none;\n  }\n</style>`
      }
    ]
  },
  {
    categoryId: 'style_dimensions_spacing',
    categoryTitle: '4. 📐 מידות, ריווח פנימי ומרכוז קופסאות (Dimensions, Padding & Margin)',
    categorySubtitle: 'איך קובעים את הגודל של הכרטיסייה והתמונה, יוצרים מרווח אוויר פנימי וממרכזים לאמצע הדף:',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    tags: [
      {
        tag: 'width ו- max-width',
        name: 'רוחב אלמנט ורוחב מקסימלי לכרטיסייה',
        explanation: 'width קובע את הרוחב המדויק, ו-max-width קובע רוחב מקסימלי כך שהכרטיסייה לא תימתח על כל המסך במחשב אבל תתאים את עצמה למסך קטן.',
        usageRule: 'לכרטיסייה ראשית נותנים max-width: 560px, ולתמונה בתוכה נותנים width: 100%.',
        optionsList: [
          'width: 100%; – תופס את כל הרוחב של הקופסה שבה הוא נמצא (מעולה לתמונות בתוך כרטיסייה!)',
          'max-width: 560px; – מגביל את רוחב הכרטיסייה ל-560 פיקסלים (אפשר גם 480px, 650px, 900px)',
          'width: 300px; – רוחב קבוע בפיקסלים',
          'width: 50%; – חצי מרוחב הקופסה',
          'width: fit-content; – רוחב שמתאים בדיוק לאורך הטקסט בפנים'
        ],
        example: `<style>\n  .card {\n    max-width: 560px;\n  }\n  img {\n    width: 100%;\n  }\n</style>`
      },
      {
        tag: 'height ו- object-fit',
        name: 'גובה אלמנט והתאמת פרופורציות תמונה',
        explanation: 'height קובע את הגובה, ו-object-fit: cover שומר שהתמונה לא תימעך או תימתח כשנותנים לה גובה קבוע!',
        usageRule: 'כשנותנים לתמונה גם width: 100% וגם height: 260px, תמיד מוסיפים object-fit: cover;.',
        optionsList: [
          'height: auto; – גובה אוטומטי שגדל לפי התוכן (ברירת מחדל לקופסאות)',
          'height: 260px; – גובה קבוע בפיקסלים (מעולה לבאנרים ותמונות בכרטיסייה)',
          'min-height: 100vh; – גובה של מסך מלא לפחות (לשימוש ב-body)',
          'object-fit: cover; – חותך ומתאים את התמונה בול למידות בלי לעוות אותה',
          'object-fit: contain; – מציג את כל התמונה בשלמותה בלי לחתוך שום חלק'
        ],
        example: `<style>\n  img {\n    width: 100%;\n    height: 260px;\n    object-fit: cover;\n  }\n</style>`
      },
      {
        tag: 'padding',
        name: 'ריווח פנימי (אוויר בתוך הקופסה/כפתור)',
        explanation: 'יוצר מרחק פנימי בין המסגרת של הקופסה (או הכפתור) לבין הטקסט והתמונות שבתוכה, כדי שהתוכן לא יידבק לקצוות.',
        usageRule: 'אפשר לתת מספר אחד לכל הכיוונים, או שני מספרים (למעלה/למטה ואז ימין/שמאל).',
        optionsList: [
          'padding: 28px; – ריווח פנימי שווה של 28px מכל 4 הצדדים (מעולה לכרטיסייה)',
          'padding: 14px 32px; – 14px למעלה ולמטה, ו-32px בימין ובשמאל (הכי יפה לכפתורים ותגיות!)',
          'padding-top / padding-bottom / padding-right / padding-left – ריווח רק בצד אחד ספציפי'
        ],
        example: `<style>\n  .card {\n    padding: 32px;\n  }\n  button {\n    padding: 14px 32px;\n  }\n</style>`
      },
      {
        tag: 'margin',
        name: 'ריווח חיצוני ומרכוז כרטיסייה לאמצע המסך',
        explanation: 'יוצר מרחק מחוץ לקופסה (בין אלמנט אחד לאלמנט שאחריו), ומאפשר למרכז קופסאות בדיוק לאמצע המסך.',
        usageRule: 'הפקודה margin: 30px auto; ממרכזת כל קופסה שיש לה max-width או width לאמצע הדף!',
        optionsList: [
          'margin: 30px auto; – 30px רווח מלמעלה ומלמטה, ומרכוז אוטומטי (auto) לימין ולשמאל!',
          'margin-bottom: 16px; – רווח של 16px מתחת לאלמנט (כדי להפריד בין כותרת, פסקה ותמונה)',
          'margin-top: 20px; – רווח של 20px מעל האלמנט',
          'margin: 0; – איפוס כל הרווחים החיצוניים'
        ],
        example: `<style>\n  .card {\n    max-width: 560px;\n    margin: 40px auto;\n  }\n  h1 {\n    margin-bottom: 10px;\n  }\n</style>`
      }
    ]
  },
  {
    categoryId: 'style_borders_corners',
    categoryTitle: '5. ⭕ עיגול פינות ומסגרות מעוצבות (Borders & Corners)',
    categorySubtitle: 'איך מעגלים פינות של כרטיסייה, תמונה וכפתור ומוסיפים מסגרות:',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    tags: [
      {
        tag: 'border-radius',
        name: 'עיגול פינות',
        explanation: 'מעגל את הפינות החדות של כרטיסייה, תמונה, תגית או כפתור.',
        usageRule: 'נמדד בפיקסלים (px) או באחוזים (%).',
        optionsList: [
          'border-radius: 0px; – פינות מרובעות וחדות',
          'border-radius: 12px; – עיגול פינות עדין ונקי',
          'border-radius: 24px; – עיגול פינות מודרני ויוקרתי לכרטיסייה (.card) או לתמונה',
          'border-radius: 999px; – צורת קפסולה עגולה בצדדים (מושלם לכפתורים ולתגיות Badge!)',
          'border-radius: 50%; – הופך תמונה ריבועית לעיגול מושלם (כמו תמונת פרופיל)'
        ],
        example: `<style>\n  .card {\n    border-radius: 24px;\n  }\n  img {\n    border-radius: 16px;\n  }\n  button {\n    border-radius: 999px;\n  }\n</style>`
      },
      {
        tag: 'border',
        name: 'מסגרת סביב אלמנט',
        explanation: 'מוסיפה קו מסגרת מסביב לכרטיסייה, לתמונה או לכפתור (או מבטלת מסגרת קיימת).',
        usageRule: 'כותבים בסדר הבא: עובי הקו, סגנון הקו, וצבע הקו – למשל border: 2px solid #3b82f6;.',
        optionsList: [
          'border: none; – הסרת המסגרת לגמרי (חובה בכפתורים מודרניים כדי להעלים את המסגרת האפורה!)',
          'border: 2px solid #cbd5e1; – מסגרת בקו רציף וחלק (solid)',
          'border: 2px dashed #60a5fa; – מסגרת בקו מקווקו (dashed)',
          'border: 3px dotted #f59e0b; – מסגרת של נקודות (dotted)',
          'border: 4px double #8b5cf6; – מסגרת כפולה (double)'
        ],
        example: `<style>\n  .card {\n    border: 2px solid #e2e8f0;\n  }\n  button {\n    border: none;\n  }\n</style>`
      }
    ]
  },
  {
    categoryId: 'style_effects_layout',
    categoryTitle: '6. ✨ צלליות, אפקטים וסידור בשורה (Shadows, Hover & Flexbox)',
    categorySubtitle: 'הפקודות שהופכות אתר רגיל לאתר חי, תלת-ממדי ומקצועי:',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    tags: [
      {
        tag: 'box-shadow ו- text-shadow',
        name: 'צללית תלת-ממדית לקופסה ולטקסט',
        explanation: 'box-shadow מוסיף צל מתחת לכרטיסייה או לכפתור ונותן תחושת עומק וריחוף. text-shadow מוסיף צל או זוהר לאותיות הכותרת.',
        usageRule: 'המספרים קובעים: הזזה הצידה, הזזה למטה, רמת טשטוש הצל, וצבע הצל.',
        optionsList: [
          'צללית רכה ונקייה לכרטיסייה: box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);',
          'צללית עמוקה תלת-ממדית (3D): box-shadow: 0 22px 50px rgba(0, 0, 0, 0.28);',
          'אפקט זוהר ניאון (Glow): box-shadow: 0 0 25px rgba(59, 130, 246, 0.65);',
          'צללית לטקסט כותרת: text-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);',
          'box-shadow: none; – ביטול צללית'
        ],
        example: `<style>\n  .card {\n    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);\n  }\n  button {\n    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);\n  }\n</style>`
      },
      {
        tag: 'transform / transition / cursor',
        name: 'אנימציה חלקה, הגדלה וסמן יד מצביעה',
        explanation: 'transform משנה את גודל או מיקום האלמנט (במיוחד ב-:hover), transition הופך את השינוי לאנימציה חלקה, ו-cursor: pointer הופך את העכבר ליד מצביעה.',
        usageRule: 'נותנים transition: 0.25s ו-cursor: pointer לתגית הרגילה, ואת ה-transform כותבים בתוך ה-:hover.',
        optionsList: [
          'transform: scale(1.06); – הגדלת הכפתור או התמונה ב-6%',
          'transform: translateY(-5px); – הרמת הכרטיסייה או הכפתור 5 פיקסלים למעלה',
          'transform: rotate(-2deg); – סיבוב קל של האלמנט בזווית',
          'transition: 0.25s; – זמן המעבר בשניות (גורם לאנימציה להיות חלקה ולא קופצנית)',
          'cursor: pointer; – משנה את סמן העכבר ליד מצביעה כשעוברים מעל הכפתור'
        ],
        example: `<style>\n  button {\n    cursor: pointer;\n    transition: 0.25s;\n  }\n  button:hover {\n    transform: translateY(-3px) scale(1.05);\n  }\n</style>`
      },
      {
        tag: 'display: flex / justify-content / gap',
        name: 'סידור אלמנטים בשורה או בטור (Flexbox)',
        explanation: 'כאשר שמים מספר פריטים בתוך קופסה ונותנים לה display: flex, הם מסתדרים אוטומטית בשורה אחת יפה עם רווח קבוע ביניהם.',
        usageRule: 'כותבים בתוך העיצוב של הקופסה שעוטפת את הפריטים (למשל .row או .card).',
        optionsList: [
          'display: flex; – הפעלת סידור גמיש',
          'flex-direction: row; (בשורה זה לצד זה) | flex-direction: column; (בטור זה מתחת לזה)',
          'justify-content: center; (מרכוז לאמצע) | space-between; (פיזור לקצוות) | space-around;',
          'align-items: center; – יישור אנכי של כל הפריטים לאמצע השורה',
          'gap: 16px; – רווח אוטומטי של 16px בין פריט לפריט | flex-wrap: wrap; (ירידת שורה במסך צר)'
        ],
        example: `<style>\n  .row {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    gap: 16px;\n  }\n</style>`
      },
      {
        tag: 'backdrop-filter ו- filter',
        name: 'אפקט זכוכית מטושטשת ופילטרים לתמונות',
        explanation: 'backdrop-filter מטשטש את הרקע שמאחורי כרטיסייה שקופה למחצה (Glassmorphism), ו-filter מוסיף אפקטים גרפיים לתמונות.',
        usageRule: 'לאפקט זכוכית משלבים background: rgba(255,255,255,0.15) יחד עם backdrop-filter: blur(10px).',
        optionsList: [
          'backdrop-filter: blur(10px); – אפקט זכוכית חלבית יוקרתית',
          'filter: brightness(1.1); – הבהרת תמונה ב-10%',
          'filter: contrast(1.15); – חידוד ניגודיות התמונה',
          'filter: grayscale(100%); – הפיכת תמונה לשחור-לבן',
          'filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25)); – צללית שעוקבת אחרי צורת תמונה שקופה'
        ],
        example: `<style>\n  .glass-card {\n    background: rgba(255, 255, 255, 0.15);\n    backdrop-filter: blur(10px);\n  }\n</style>`
      }
    ]
  }
];

// ============================================================================
// 🧠 מחולל אתגר הנדסת פרומפטים ברמה גבוהה לכל שלב AI (ללא פרומפט מוכן להעתקה!)
// התלמיד מרכיב בעצמו את הפרומפט מתוך 4 אבני הבניין של הנדסת פרומפטים מקצועית
// ============================================================================
export function buildAIChallengeForStage(session, stage) {
  const rawPrompt = stage.prompt || '';
  const isImagePrompt =
    /[A-Za-z]{5,}/.test(rawPrompt) &&
    !/כתוב|תן לי|אני בונה|עבור האתר|אתה מומחה/.test(rawPrompt);

  // חילוץ דרישות המשימה מתוך נושא השלב כדי להציג לתלמיד מה עליו לבקש מה-AI (בלי לתת לו פרומפט מוכן)
  const bulletLines = rawPrompt
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[1-9]\./.test(l))
    .map((l) => l.replace(/^[1-9]\.\s*/, ''));

  if (isImagePrompt) {
    return {
      isImageAI: true,
      challengeTitle: '🎨 אתגר הנדסת פרומפט ליצירת תמונה/גרפיקה ב-AI (הרכבה עצמית)',
      roleHint:
        'הגדר ל-AI תפקיד של אמן דיגיטלי / מעצב תלת-ממד (למשל: "Act as a 3D digital artist / brand designer").',
      contextHint:
        'תאר את נושא התמונה עבור האתר שלך "[SITE_NAME]" בתחום [SITE_TOPIC] ומה האובייקט המרכזי שצריך להופיע במרכז הפריים.',
      taskDeliverables: [
        stage.summary || 'יצירת תמונה מקורית ומדויקת לאתר.',
        'הגדרת סגנון אמנותי ברור (למשל: 3D glossy render / minimalist vector emblem / cinematic hero banner).',
        'הגדרת פלטת הצבעים והתאורה בתמונה (למשל: vibrant neon lighting, studio lighting, clean background).',
        'הגדרת יחס התמונה והקומפוזיציה (למשל: centered icon על רקע נקי, או wide 16:9 עבור באנר).'
      ],
      styleConstraints:
        'דרוש תמונה חדה באיכות גבוהה (4k resolution, ultra-detailed) ובקש להימנע מעומס או טקסט משובש (no cluttered text).',
      proTip:
        '💡 טיפ של מקצועני AI: אם תרצה לנסח את הפרומפט באנגלית למחולל תמונות, תוכל להרכיב אותו בעברית ולבקש מ-ChatGPT/Gemini לשדרג ולתרגם לך אותו לפרומפט תמונה מקצועי באנגלית!'
    };
  }

  return {
    isImageAI: false,
    challengeTitle: '🧠 אתגר הנדסת פרומפטים (Prompt Engineering) – הרכב את הפרומפט בעצמך!',
    roleHint:
      'הגדר ל-AI מומחיות ברורה במשפט הראשון (למשל: "אתה מומחה מיתוג וקופירייטר בכיר לאתרים" / "אתה מעצב UI/UX ומומחה חוויית משתמש" / "אתה מפתח Front-End בכיר").',
    contextHint:
      'הצג ל-AI את הפרויקט שלך: שם האתר "[SITE_NAME]", התחום שלו ([SITE_TOPIC]), מי קהל היעד של האתר ואיזו אווירה האתר צריך לשדר.',
    taskDeliverables:
      bulletLines.length > 0
        ? bulletLines
        : [
            stage.summary,
            `תוצר מותאם אישית עבור "${ stage.expectedResult || 'השלב הנוכחי באתר' }".`,
            'חלוקה מסודרת לסעיפים קצרים וברורים שמוכנים לשילוב באתר.'
          ],
    styleConstraints:
      'הגדר ל-AI חוקים מדויקים: אורך מקסימלי לכל משפט (כדי שלא ייצא טקסט ארוך מדי), שילוב אימוג׳ים מתאימים, עברית קולחת ומזמינה, ומתן 2–3 חלופות לבחירה.',
    proTip:
      '💡 טיפ להעלאת רמת ה-AI: בקש מה-AI בסוף הפרומפט שלך גם להסביר במשפט קצר למה ההצעה שלו מתאימה לעיצוב ולחוויית המשתמש של האתר שלך!'
  };
}

// ============================================================================
// 🎨 מחולל מדריך עיצוב מעמיק (CSS ב-<style>) לכל שקופית קוד פתוח
// מסביר לתלמיד איך לעצב כל אלמנט ונותן לו ארגז כלים שלם לעבודה עיצובית
// ============================================================================
function buildDesignGuideForOpenCodeStage(sessionId, stageNum, override) {
  const code = override.codeExample || '';

  // זיהוי חכם של האלמנטים המופיעים בשקופית כדי לתת הסבר עיצוב מדויק
  const hasNavOrFooter = /<nav|<footer|\bnav\b|\bfooter\b/.test(code);
  const hasImage = /<img|\.logo|\.avatar|\.hero-img/.test(code);
  const hasFlexRow = /class="row"|class="btn-row"|display:\s*flex/.test(code);
  const hasFormOrInput = /<input|<select|<textarea|<form/.test(code);
  const hasTable = /<table|\bth\b|\btd\b/.test(code);
  const hasButton = /<button|class="btn|class="pill-btn|class="wa-btn/.test(code);
  const hasKeyframes = /@keyframes|animation:|transform:/.test(code);

  const cssProperties = [];

  // 1. רקעים וגרדיאנטים (תמיד רלוונטי לעיצוב!)
  cssProperties.push({
    prop: 'background: linear-gradient(135deg, #2563eb, #7c3aed);',
    title: '🎨 צבע רקע ומעבר צבעים (Gradient)',
    desc: 'צובע את הרקע של הדף (body), הכרטיסייה (.card) או הכפתור. אפשר לתת צבע אחד או שילוב מרהיב של 2–3 צבעים בזווית!'
  });

  // 2. מרווחים ומרכוז
  cssProperties.push({
    prop: 'padding: 24px;  margin: 18px auto;  max-width: 750px;',
    title: '📐 ריווח פנימי (Padding) ומרכוז קופסה (Margin)',
    desc: 'padding נותן מרווח נשימה בין התוכן למסגרת הקופסה, ו-margin: 18px auto ממרכז את הכרטיסייה בדיוק לאמצע העמוד.'
  });

  // 3. מסגרות ועיגול פינות
  cssProperties.push({
    prop: 'border-radius: 20px;  border: 2px solid #60a5fa;',
    title: '🖼️ עיגול פינות ומסגרות (Border)',
    desc: 'שנה את המספר ב-border-radius (למשל 16px לקופסה, 50% לעיגול, 999px לכמוסה) ובחר סגנון מסגרת: solid (רציף) או dashed (מקווקו).'
  });

  // 4. צלליות תלת-ממד
  cssProperties.push({
    prop: 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);',
    title: '✨ צללית עומק תלת-ממדית (Shadow)',
    desc: 'מוסיפה צל רך מתחת לכרטיסייה, לתמונה או לכפתור וגורמת להם לבלוט מעל הרקע של האתר.'
  });

  if (hasFlexRow || hasNavOrFooter) {
    cssProperties.push({
      prop: 'display: flex;  justify-content: center;  gap: 16px;  flex-wrap: wrap;',
      title: '🧱 סידור בשורה גמישה (Flexbox)',
      desc: 'מעמיד כרטיסיות, קישורים או כפתורים זה לצד זה בשורה סימטרית עם מרווח אחיד (gap) ביניהם.'
    });
  }

  if (hasImage) {
    cssProperties.push({
      prop: 'width: 100%;  height: 200px;  object-fit: cover;  border-radius: 16px;',
      title: '📸 עיצוב וחיתוך חכם לתמונות',
      desc: 'object-fit: cover דואג שהתמונה תמלא את המסגרת שלה בצורה מושלמת בלי להימתח או להתעוות!'
    });
  }

  if (hasFormOrInput) {
    cssProperties.push({
      prop: 'padding: 12px 16px;  border-radius: 12px;  border: 2px solid #93c5fd;  font-size: 16px;',
      title: '📥 עיצוב שדות קלט, סליידרים וטפסים',
      desc: 'הופך שדות <input>, <select> ו-<textarea> רגילים לשדות מודרניים, רחבים ומעוצבים בצבעי המותג.'
    });
  }

  if (hasTable) {
    cssProperties.push({
      prop: 'border-collapse: collapse;  width: 100%;  padding: 12px;',
      title: '📊 עיצוב טבלאות השוואה יוקרתיות',
      desc: 'מאחד את קווי הטבלה ונותן לכותרות (th) ולתאים (td) צבעים ומרווחים ברורים.'
    });
  }

  if (hasButton || hasKeyframes || cssProperties.length < 6) {
    cssProperties.push({
      prop: 'transition: 0.3s;   /* ובשורה הבאה: */   .card:hover { transform: translateY(-5px); }',
      title: '🚀 אפקט ריחוף חי במעבר עכבר (:hover)',
      desc: 'גורם לכפתור או לכרטיסייה לזוז כלפי מעלה או לגדול (scale(1.05)) כשעוברים עליהם עם העכבר!'
    });
  }

  // הסבר מותאם על איך ניגשים לעיצוב בשלב הזה
  const howItWorks =
    'כדי לעצב את הרכיבים של שקופית זו, רד לתחתית הקוד אל תוך תגית <style> ... </style>. ' +
    'עבור תגית רגילה כתוב את שמה (כמו h1, p, nav, button), ועבור קופסה עם class כתוב נקודה לפניה (כמו .card, .row, .badge) ופתח סוגריים מסולסלים { }.';

  const creativeMission =
    override.selfExplain ||
    'אל תסתפק בעיצוב הבסיסי! נסה לפחות 3 שילובי צבעים שונים (או גרדיאנטים), שחק עם עיגול הפינות (border-radius), הוסף צללית (box-shadow) ואפקט מעבר עכבר (:hover) עד שהחלק הזה באתר נראה ברמה הגבוהה ביותר!';

  return {
    title: '🎨 איך מעצבים את החלק הזה ב-<style>? (עיקר העבודה שלך!)',
    howItWorks,
    cssProperties: cssProperties.slice(0, 6),
    creativeMission
  };
}

// ============================================================================
// הגדרת השקופיות המעשיות של קוד פתוח עבור כל 32 המפגשים:
// כל המפגשים ושקופיות ה-AI מסונכרנים 1-ל-1 עם מסלול הבלוקים!
// ============================================================================
const OPEN_CODE_STAGE_OVERRIDES = {
  // --------------------------------------------------------------------------
  // מפגש 1: בחירת רעיון לאתר, מיתוג ב-AI והקמת שלד דף הבית
  // --------------------------------------------------------------------------
  1: {
    2: {
      title: 'שלב 2: הקמת מסגרת הדף וכרטיסיית הפתיחה בקוד ועיצובה',
      summary: 'פותחים את עורך הקוד החי, כותבים בעצמנו ב-<body> את כרטיסיית הפתיחה עם <h1> ו-<p>, ומתחילים לעצב אותה ב-<style>.',
      codeExample: `<body>\n  <div class="card">\n    <h1>[SITE_NAME]</h1>\n    <p>הסלוגן הקצר שיצרתי ב-AI לאתר שלי</p>\n  </div>\n</body>`,
      steps: [
        'לחץ למעלה על "פתח סביבת פיתוח" ובחר ב-"עורך קוד חי (קוד פתוח)" – הדף שלך כבר מתחיל מוכן מתגית <body>.',
        'הקלד בעצמך בתוך ה-<body> קופסת כרטיסייה: <div class="card"> ובסופה סגור עם </div>.',
        'בתוך הכרטיסייה הקלד תגית <h1>...</h1> עם שם המותג שלך, ומתחתיה תגית <p>...</p> עם הסלוגן מה-AI.',
        'משימת עיצוב: פתח מתחת ל-</body> תגית <style>...</style> והתחל לעצב את צבע הרקע של הדף (body) ואת הכרטיסייה הראשונה שלך (.card)!'
      ],
      selfExplain: 'השקע בעיצוב הכרטיסייה הראשונה: בחר צבע רקע לדף, צבע לכרטיסייה, גודל כתב ל-h1, עיגול פינות (border-radius) וצללית (box-shadow)!'
    },
    4: {
      title: 'שלב 4: הוספת תגית וכרטיסייה שנייה בדף ועיצובן',
      summary: 'מקלידים תגית <span class="badge"> מעל הכותרת, קו מפריד <hr>, וכרטיסייה שנייה עם <h2> ורשימת <ul> של 3 נקודות – ומעצבים אותן.',
      codeExample: `  <div class="card">\n    <span class="badge">✨ [SITE_TOPIC]</span>\n    <h1>[SITE_NAME]</h1>\n    <p>הסלוגן שלי</p>\n  </div>\n  <hr>\n  <div class="card">\n    <h2>מה מחכה לכם באתר?</h2>\n    <ul>\n      <li>נקודה 1 מה-AI</li>\n      <li>נקודה 2 מה-AI</li>\n      <li>נקודה 3 מה-AI</li>\n    </ul>\n  </div>`,
      steps: [
        'בכרטיסייה הראשונה (מעל ה-<h1>), הקלד בעצמך תגית <span class="badge"> עם טקסט הפתיחה הקצר מה-AI.',
        'מתחת לכרטיסייה הראשונה (אחרי ה-</div>), הקלד תגית <hr> ופתח כרטיסייה שנייה <div class="card">...</div>.',
        'בתוך הכרטיסייה השנייה הקלד <h2>מה מחכה לכם באתר?</h2> ומתחתיה רשימת <ul> עם 3 שורות <li>.',
        'משימת עיצוב ב-<style>: עצב את תגית ה-.badge ככמוסה צבעונית (background, color, padding, border-radius: 999px) ועצב את כותרת ה-h2 והרשימה!'
      ],
      selfExplain: 'עצב את ה-.badge עם צבע רקע בולט וטקסט מודגש, ונסה להוסיף ל-ul עיצוב של list-style: none כדי שהאימוג׳ים שלך יובילו כל שורה!'
    },
    5: {
      title: 'שלב 5: סדנת עיצוב מעמיקה בתגית <style> – צבעים, מסגרות וצלליות (🎨)',
      summary: 'משקיעים בעיצוב המלא של דף הבית בתוך תגית ה-<style>: רקעים מדורגים, מרווחים, פינות עגולות, צלליות וגדלי כתב.',
      codeExample: `<style>\n  body {\n    background: linear-gradient(135deg, #eff6ff, #f5f3ff);\n    text-align: center;\n    font-family: sans-serif;\n  }\n  .card {\n    background: white;\n    padding: 28px;\n    margin: 20px auto;\n    max-width: 720px;\n    border-radius: 22px;\n    border: 2px solid #dbeafe;\n    box-shadow: 0 10px 25px rgba(0,0,0,0.08);\n  }\n  h1 {\n    color: #2563eb;\n    font-size: 38px;\n  }\n</style>`,
      steps: [
        'בתוך ה-<style> מתחת ל-</body>, עצב את ה-body עם צבע רקע נעים או גרדיאנט (linear-gradient) ויישור למרכז (text-align: center).',
        'עצב את .card עם ריווח פנימי (padding), מרכוז (margin: 20px auto), עיגול פינות (border-radius), מסגרת (border) וצללית (box-shadow).',
        'עצב את h1, h2 ו-p עם גדלי כתב (font-size) וצבעים (color) שמתאימים למותג שלך.',
        'בדוק בתצוגת "📱 מובייל" ו-"🖥️ מחשב" בראש העורך שהעיצוב שיצרת נראה מרהיב בשני המסכים.'
      ],
      selfExplain: 'זה הזמן להתנסות בעיצוב! נסה לשנות את מספרי ה-padding, ה-border-radius והצבעים, והוסף .card:hover כדי לראות את הכרטיסיות מגיבות למעבר עכבר!'
    },
    6: {
      title: 'שלב 6: אתגר בונוס (<button> מעוצב) ושמירת קובץ ה-HTML למחשב',
      summary: 'מקלידים כפתור ברכה אינטראקטיבי, מעצבים אותו מאפס ב-<style> עם אפקט ריחוף, ושומרים את הקובץ index.html.',
      codeExample: `<button onclick="alert('ברוכים הבאים ל-[SITE_NAME]!')">\n  ברוכים הבאים לאתר שלי! 🚀\n</button>`,
      steps: [
        'משימת אתגר: בתחתית הכרטיסייה הראשונה ב-<body>, הקלד בעצמך תגית <button onclick="alert(\'...\')"> עם הודעה קופצת משלך.',
        'משימת עיצוב הכפתור: הוסף ב-<style> עיצוב לתגית button (צבע רקע או גרדיאנט, צבע כתב לבן, padding: 12px 24px, border: none, border-radius: 12px) והוסף button:hover!',
        'לחץ על הכפתור בתצוגה החיה ובדוק שעיצוב הריחוף וההודעה הקופצת עובדים.',
        'שמירה למחשב: לחץ בסרגל העליון של עורך הקוד על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור בתיקייה האישית שלך.'
      ],
      selfExplain: 'כפתור מעוצב היטב מושך לחיצות! תן ל-button שלך צללית ואפקט הגדלה במעבר עכבר (button:hover { transform: scale(1.05); })!',
      checklist: [
        'הקלדתי בעצמי ב-<body> כותרת ראשית (<h1>), תגית (<span>) ופסקה (<p>) עם שם המותג והסלוגן שלי.',
        'הוספתי כרטיסייה שנייה עם כותרת משנה (<h2>) ורשימה (<ul>) של 3 פריטי <li>.',
        'עיצבתי לעומק את הדף, הכותרות, התגית, הכרטיסיות והכפתור בתוך תגית <style>.',
        'הורדתי ושמרתי את הקובץ index.html במחשב שלי.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 2: הנדסת פרומפטים (Prompt Engineering) וקופירייטינג שיווקי
  // --------------------------------------------------------------------------
  2: {
    1: {
      title: 'שלב 1: טעינת האתר מהשיעור הקודם בעורך הקוד החי',
      summary: 'מעלים את קובץ ה-HTML ששמרנו במפגש 1 חזרה לעורך הקוד כדי להמשיך לבנות ולעצב אותו.',
      codeExample: `<body>\n  <div class="card">\n    <h1>[SITE_NAME]</h1>\n  </div>\n</body>`,
      steps: [
        'פתח את עורך הקוד החי בחלון חדש.',
        'לחץ בסרגל העליון על "📂 קובץ וייצוא" ⬅️ "📂 העלה קובץ HTML מהמחשב".',
        'בחר מהמחשב שלך את הקובץ index.html ששמרת בסוף מפגש 1.',
        'ודא שהקוד והעיצובים שלך ב-<style> מהשיעור הקודם מופיעים בעורך ובתצוגה החיה!'
      ],
      selfExplain: 'בדוק את ה-<style> שלך מהשיעור הקודם וחשוב אילו צבעים ואפקטים תרצה להוסיף היום לכרטיסיות החדשות!'
    },
    3: {
      title: 'שלב 3: בניית ועיצוב כרטיסיית "למה לבחור בנו?" בקוד',
      summary: 'מקלידים ב-<body> כרטיסייה חדשה עבור 4 היתרונות מה-AI ומעצבים לה מראה ייחודי ב-<style>.',
      codeExample: `  <div class="card why-card">\n    <span class="badge">⭐ האיכות שלנו</span>\n    <h2>למה לבחור ב-[SITE_NAME]?</h2>\n    <p>שני משפטי הפתיחה מה-AI...</p>\n    <ul>\n      <li>יתרון 1 מה-AI</li>\n      <li>יתרון 2 מה-AI</li>\n      <li>יתרון 3 מה-AI</li>\n      <li>יתרון 4 מה-AI</li>\n    </ul>\n  </div>`,
      steps: [
        'בתחתית ה-<body> (לפני </body>), הקלד בעצמך כרטיסייה חדשה: <div class="card why-card">...</div>.',
        'בתוך הכרטיסייה הקלד <span class="badge">⭐ האיכות שלנו</span>, כותרת <h2> ופסקה <p> עם משפטי הפתיחה מה-AI.',
        'הקלד רשימת <ul> ובתוכה 4 שורות <li> עם 4 היתרונות והאימוג׳ים מה-AI.',
        'משימת עיצוב ב-<style>: עצב את .why-card ואת פריטי הרשימה (li) עם רקע עדין, ריווח בין שורות ומסגרת צבעונית!'
      ],
      selfExplain: 'תוכל לעצב כל שורת li ב-<style> כקופסה קטנה משלה (למשל li { background: #f8fafc; margin: 8px 0; padding: 10px; border-radius: 10px; })!'
    },
    5: {
      title: 'שלב 5: בניית אזור השאלות הנפוצות ועיצוב טיפוגרפי מתקדם ב-<style> (🎨)',
      summary: 'מקלידים כרטיסיית שאלות נפוצות עם <h3> ו-<p> ומעצבים לעומק את היררכיית הטקסט, הצבעים והמרווחים ב-<style>.',
      codeExample: `  <div class="card faq-card">\n    <h2>❓ שאלות נפוצות</h2>\n    <h3>שאלה 1 מה-AI?</h3>\n    <p>תשובה 1 מה-AI.</p>\n    <hr>\n    <h3>שאלה 2 מה-AI?</h3>\n    <p>תשובה 2 מה-AI.</p>\n  </div>`,
      steps: [
        'הקלד בתחתית ה-<body> כרטיסייה חדשה <div class="card faq-card"> עם כותרת <h2>❓ שאלות נפוצות</h2>.',
        'עבור כל אחת מ-3 השאלות: הקלד תגית <h3> עבור השאלה, מתחתיה תגית <p> עבור התשובה, וביניהן <hr>.',
        'משימת עיצוב ב-<style>: עצב את כותרות ה-h3 בצבע בולט וגודל 20px, ואת פסקאות ה-p בגודל 16px, צבע כהה נעים ו-line-height: 1.6.'
      ],
      selfExplain: 'הבדל ברור בצבע ובגודל בין השאלה (h3) לתשובה (p) הוא סוד העיצוב של אתרים מקצועיים!'
    },
    6: {
      title: 'שלב 6: אתגר עיצוב מסגרות מיוחדות ושמירת הקובץ המעודכן',
      summary: 'מוסיפים פס מסגרת צבעוני בולט לכרטיסיית השאלות הנפוצות ב-<style> ושומרים את הקובץ.',
      codeExample: `  .faq-card {\n    border-right: 6px solid #7c3aed;\n    text-align: right;\n  }`,
      steps: [
        'משימת אתגר עיצובית: הוסף ב-<style> מחלקה .faq-card עם פס מסגרת ימני עבה (border-right: 6px solid ...), יישור לימין וצללית.',
        'בדוק את הנראות והעיצוב בתצוגת "📱 מובייל" ו-"📟 טאבלט".',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור את הקובץ המעודכן במחשב.'
      ],
      selfExplain: 'שחק עם צבעי המסגרות של כל 3 הכרטיסיות בדף כך שלכל כרטיסייה יהיה אופי עיצובי מיוחד!',
      checklist: [
        'טענתי את הקובץ ממפגש 1 בעורך הקוד החי.',
        'הקלדתי ועיצבתי כרטיסיית "למה לבחור בנו?" עם 4 יתרונות מ-AI.',
        'הקלדתי ועיצבתי כרטיסיית "שאלות נפוצות (FAQ)" עם תגיות <h3> ו-<p>.',
        'הורדתי ושמרתי את הקובץ index.html המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 3: עיצוב לוגו ב-AI, פלטת צבעים (HEX) וסטודיו העיצוב החי
  // --------------------------------------------------------------------------
  3: {
    3: {
      title: 'שלב 3: הוספת הלוגו לראש דף הבית בקוד ועיצובו הראשוני',
      summary: 'מקלידים את תגית התמונה <img> של הלוגו בראש כרטיסיית הפתיחה ב-<body>.',
      codeExample: `  <div class="card hero-card">\n    <img class="logo" src="קישור_לתמונת_הלוגו" width="110">\n    <h1>[SITE_NAME]</h1>\n    <p>הסלוגן שלי</p>\n  </div>`,
      steps: [
        'בעורך הקוד החי, מצא את הכרטיסייה הראשונה בראש ה-<body> והוסף לה את השם class="card hero-card".',
        'מעל הכותרת הראשית <h1>, הקלד בעצמך תגית תמונה: <img class="logo" src="..." width="110">.',
        'הדבק בתוך src="..." את קישור תמונת הלוגו שיצרת בשלב 2.'
      ],
      selfExplain: 'מיד בשלב הבא נעצב את ה-.logo ואת ה-.hero-card בתוך ה-<style>!'
    },
    4: {
      title: 'שלב 4: יישום פלטת הצבעים והגרדיאנטים ב-<style> (🎨)',
      summary: 'צובעים את האתר לפי קודי ה-HEX שיצרנו ב-AI ובונים רקע מדורג (linear-gradient) לכרטיסייה הראשית.',
      codeExample: `  body {\n    background: #f0f9ff;\n  }\n  .hero-card {\n    background: linear-gradient(135deg, #2563eb, #7c3aed);\n    color: white;\n  }\n  .hero-card h1 {\n    color: white;\n  }`,
      steps: [
        'בתוך ה-<style>, עדכן את ה-background של body לקוד ה-HEX הבהיר מהפלטה שיצרת בשלב 1.',
        'הקלד עיצוב ל-.hero-card עם רקע מדורג: background: linear-gradient(135deg, #צבע1, #צבע2); והזן את קודי ה-HEX שלך!',
        'עדכן את צבע הטקסט ב-.hero-card ללבן (color: white;) כדי שיהיה קריא וחד מעל הגרדיאנט.',
        'עדכן את צבע ה-button וה-.badge לצבע ה-Accent הבולט מהפלטה שלך.'
      ],
      selfExplain: 'נסה זוויות שונות בגרדיאנט (למשל 45deg, 90deg, 135deg) ובדוק איזה שילוב צבעים נראה הכי יוקרתי!'
    },
    5: {
      title: 'שלב 5: עיצוב מסגרות, צללים וגופנים ללוגו ולכרטיסיות ב-<style>',
      summary: 'משדרגים את מראה הלוגו והכרטיסיות עם עיגול פינות (border-radius), מסגרת (border) וצללית (box-shadow).',
      codeExample: `  .logo {\n    border-radius: 20px;\n    border: 3px solid white;\n    box-shadow: 0 6px 16px rgba(0,0,0,0.2);\n  }\n  .card {\n    padding: 24px;\n    border-radius: 18px;\n    box-shadow: 0 4px 14px rgba(0,0,0,0.08);\n  }`,
      steps: [
        'הקלד ב-<style> עיצוב ל-.logo: עיגול פינות border-radius: 20px, מסגרת border: 3px solid white וצללית box-shadow.',
        'ודא שלמחלקת .card יש padding: 24px, עיגול פינות של 18px וצללית נעימה.'
      ],
      selfExplain: 'רוצה לוגו עגול כמו באפליקציות? תן ל-.logo עיגול פינות של border-radius: 50%!'
    },
    6: {
      title: 'שלב 6: אתגר אנימציית ריחוף ללוגו ושמירת הקובץ',
      summary: 'מוסיפים אפקט הגדלה במעבר עכבר (:hover) ללוגו ושומרים את האתר המעוצב.',
      codeExample: `  .logo {\n    transition: 0.3s;\n  }\n  .logo:hover {\n    transform: scale(1.1) rotate(3deg);\n  }`,
      steps: [
        'משימת אתגר עיצובית: הוסף ב-<style> את הכלל .logo:hover עם transform: scale(1.1) ועבור עם העכבר על הלוגו בתצוגה החיה!',
        'בדוק את נראות הצבעים והלוגו ב-🖥️ מחשב וב-📱 מובייל.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'תוכל להוסיף גם rotate(3deg) בתוך ה-transform כדי שהלוגו יסתובב קלות במעבר עכבר!',
      checklist: [
        'הרכבתי פרומפטים ליצירת פלטת 4 צבעי HEX ולוגו ב-AI.',
        'הקלדתי את תמונת הלוגו (<img>) בראש דף הבית.',
        'עיצבתי רקע מדורג (linear-gradient), מסגרות וצבעי מותג בתוך ה-<style>.',
        'הורדתי ושמרתי את הקובץ index.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 4: אדריכלות אתר: סרגל ניווט עליון (Navbar) ופוטר תחתון (Footer)
  // --------------------------------------------------------------------------
  4: {
    2: {
      title: 'שלב 2: הקמת סרגל ניווט (<nav>) בראש הדף בקוד',
      summary: 'מקלידים תגית <nav> כרכיב הראשון בתוך ה-<body> ובה שם המותג, 3 קישורים וכפתור CTA.',
      codeExample: `<body>\n  <nav>\n    <strong>[SITE_NAME]</strong>\n    <a href="index.html">ראשי</a>\n    <a href="about.html">אודות</a>\n    <a href="contact.html" class="cta-link">הצטרפו עכשיו 🚀</a>\n  </nav>`,
      steps: [
        'בראש ה-<body> (מעל הכרטיסייה הראשונה), הקלד תגית <nav> וסגור ב-</nav>.',
        'כתוב בתוכה <strong> עם שם המותג שלך + אימוג׳י מתאים.',
        'הקלד 3 תגיות קישור <a href="..."> עם שמות העמודים שיצרת ב-AI בשלב 1, ולכפתור ה-CTA תן class="cta-link".'
      ],
      selfExplain: 'מיד נעצב את סרגל הניווט והקישורים כך שיעמדו בשורה יוקרתית בראש האתר!'
    },
    3: {
      title: 'שלב 3: הוספת סרגל תחתון (<footer>) בתחתית הדף בקוד',
      summary: 'מקלידים תגית <footer> שסוגרת את תחתית ה-<body> עם שם המותג וזכויות יוצרים.',
      codeExample: `  <footer>\n    <p><strong>[SITE_NAME]</strong> • כל הזכויות שמורות © 2026</p>\n  </footer>\n</body>`,
      steps: [
        'גלול לתחתית אזור ה-<body> (ממש לפני תגית הסגירה </body>).',
        'הקלד תגית <footer> וסגור ב-</footer>.',
        'כתוב בתוכה את שם האתר שלך ואת משפט זכויות היוצרים שיצרת ב-AI בשלב 1.'
      ],
      selfExplain: 'אפשר להוסיף ב-<footer> גם את שמך כמעצב ומפתח האתר!'
    },
    5: {
      title: 'שלב 5: עיצוב מקיף לניווט, לפוטר ולשורת ההכרזה ב-<style> (🎨)',
      summary: 'מוסיפים את שורת ההכרזה מתחת ל-<nav> ומעצבים ב-<style> את סרגל הניווט, הקישורים והפוטר.',
      codeExample: `  nav {\n    background: #0f172a;\n    padding: 14px 22px;\n    border-radius: 14px;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    color: white;\n  }\n  nav a {\n    color: white;\n    text-decoration: none;\n    margin: 0 10px;\n    font-weight: bold;\n  }\n  footer {\n    background: #0f172a;\n    color: white;\n    padding: 18px;\n    border-radius: 14px;\n    margin-top: 24px;\n  }`,
      steps: [
        'מתחת ל-</nav> ב-<body>, הקלד שורת הכרזה: <div class="announce">משפט ההכרזה מה-AI</div>.',
        'בתוך ה-<style>, הקלד עיצוב ל-nav ול-nav a עם display: flex, רקע כהה/צבעוני, ו-text-decoration: none להסרת הקו התחתון מהקישורים.',
        'הוסף אפקט מעבר עכבר לקישורים בתפריט (nav a:hover { color: #38bdf8; }) ועצב גם את ה-footer ואת ה-.announce.'
      ],
      selfExplain: 'עצב גם את כפתור ה-.cta-link בתוך התפריט עם רקע בולט ו-border-radius: 999px כך שיבלוט משאר הקישורים!'
    },
    6: {
      title: 'שלב 6: בדיקת רספונסיביות של הניווט ושמירת הקובץ',
      summary: 'מוודאים שסרגל הניווט מסתדר יפה גם במובייל (flex-wrap: wrap) ושומרים את הקובץ.',
      codeExample: `  nav {\n    flex-wrap: wrap;\n    gap: 10px;\n  }`,
      steps: [
        'הוסף בתוך העיצוב של nav ב-<style> את השורה flex-wrap: wrap; כדי שהקישורים יסתדרו אוטומטית במסך צר.',
        'לחץ על כפתורי התצוגה "🖥️ מחשב", "📟 טאבלט" ו-"📱 מובייל" ובדוק איך סרגל הניווט נראה.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'בדוק שגם שורת ההכרזה (.announce) מעוצבת עם צבע רקע שמושך את העין מתחת לתפריט!',
      checklist: [
        'בראש ה-<body> מופיע סרגל ניווט (<nav>) עם שם האתר, קישורים וכפתור CTA.',
        'הוספתי ועיצבתי שורת הכרזה מתחת לסרגל הניווט.',
        'בתחתית ה-<body> מופיע <footer> מעוצב עם זכויות יוצרים.',
        'הורדתי ושמרתי את הקובץ index.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 5: עיצוב אזור הפתיחה (Hero Section) ויצירת באנרים ב-AI
  // --------------------------------------------------------------------------
  5: {
    2: {
      title: 'שלב 2: שילוב תמונת ה-Hero בכרטיסייה הראשית ועיצובה',
      summary: 'מקלידים תגית תמונה <img class="hero-img"> בתוך כרטיסיית הפתיחה ומעצבים אותה ברוחב מלא.',
      codeExample: `  <div class="card hero-card">\n    <h1>[SITE_NAME]</h1>\n    <p>הסלוגן שלי</p>\n    <img class="hero-img" src="קישור_לתמונת_הבאנר">\n  </div>`,
      steps: [
        'בתוך הכרטיסייה הראשונה ב-<body> (מתחת לפסקת הסלוגן <p>), הקלד תגית <img class="hero-img" src="...">.',
        'הדבק בתוך src="..." את כתובת תמונת ה-Hero שיצרת בשלב 1.',
        'ב-<style>, הקלד עיצוב ל-.hero-img עם width: 100%, עיגול פינות border-radius: 16px, וצללית box-shadow.'
      ],
      selfExplain: 'הגדר ל-.hero-img גם max-height: 320px; ו-object-fit: cover; למראה קולנועי מדויק!'
    },
    4: {
      title: 'שלב 4: הצבת שני הכפתורים בשורה אחת (Flexbox) בקוד',
      summary: 'יוצרים קופסת <div class="btn-row"> מתחת לתמונת ה-Hero ובתוכה שני כפתורים זה לצד זה.',
      codeExample: `    <div class="btn-row">\n      <a href="https://wa.me/972500000000" class="btn-main">דברו איתנו 💬</a>\n      <a href="about.html" class="btn-sec">גלו עוד עלינו 👈</a>\n    </div>`,
      steps: [
        'מתחת לתמונת ה-Hero (בתוך הכרטיסייה הראשית), הקלד <div class="btn-row">...</div>.',
        'הקלד בתוכה קישור כפתור ראשון (<a class="btn-main">) עם הטקסט הראשי מה-AI.',
        'הקלד לצידו קישור כפתור שני (<a href="about.html" class="btn-sec">) עם הטקסט המשני מה-AI.'
      ],
      selfExplain: 'מיד בשלב הבא נעצב את שני הכפתורים כך שייראו כמו כפתורי הזמנה יוקרתיים!'
    },
    5: {
      title: 'שלב 5: עיצוב תמונת ה-Hero וצמד הכפתורים ב-<style> (🎨)',
      summary: 'מעמידים את הכפתורים בשורה עם display: flex ומעצבים להם צבעים, מסגרות ואפקט ריחוף ב-<style>.',
      codeExample: `  .btn-row {\n    display: flex;\n    justify-content: center;\n    gap: 16px;\n    margin-top: 18px;\n  }\n  .btn-main, .btn-sec {\n    padding: 12px 22px;\n    border-radius: 12px;\n    text-decoration: none;\n    font-weight: bold;\n    transition: 0.3s;\n  }\n  .btn-main { background: #10b981; color: white; }\n  .btn-sec { background: white; color: #1e293b; }`,
      steps: [
        'הקלד ב-<style> את המחלקה .btn-row עם display: flex; justify-content: center; gap: 16px;.',
        'עצב את .btn-main בצבע בולט (או גרדיאנט) ואת .btn-sec בצבע מנוגד עם מסגרת נאה.',
        'הוסף לתמונת .hero-img מסגרת עדינה וצללית עמוקה.'
      ],
      selfExplain: 'השקע בעיצוב צמד הכפתורים: נסה לתת לכפתור הראשי צללית זוהרת ולכפתור השני מסגרת בעובי 2px!'
    },
    6: {
      title: 'שלב 6: אתגר עיצוב אפקטי ריחוף (:hover) ושמירת הקובץ',
      summary: 'מוסיפים אפקט הרמה במעבר עכבר לכפתורים ולתמונת ה-Hero ושומרים את הקובץ.',
      codeExample: `  .btn-main:hover, .btn-sec:hover {\n    transform: translateY(-4px) scale(1.04);\n  }`,
      steps: [
        'משימת אתגר עיצובית: הוסף ב-<style> אפקט ריחוף לכפתורים (.btn-main:hover, .btn-sec:hover) עם transform: translateY(-4px).',
        'בדוק שאזור ה-Hero והכפתורים נראים מצוין גם ב-"📱 מובייל".',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'נסה להוסיף גם .hero-img:hover { transform: scale(1.02); } לתמונת הבאנר!',
      checklist: [
        'הרכבתי פרומפט לתמונת באנר (Hero) ב-AI ושילבתי אותה ברוחב 100%.',
        'הקלדתי קופסת .btn-row עם שני כפתורים זה לצד זה (display: flex).',
        'עיצבתי צבעים, צלליות ואפקט ריחוף לכפתורים ב-<style>.',
        'הורדתי ושמרתי את הקובץ index.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 6: פריסה חכמה בשורות ועמודות (Flexbox) ושלישיית כרטיסיות עם AI
  // --------------------------------------------------------------------------
  6: {
    3: {
      title: 'שלב 3: הקמת שורת ה-Flexbox והכרטיסייה הראשונה בקוד',
      summary: 'מקלידים ב-<body> שורת <div class="row"> ובונים בתוכה את הכרטיסייה הראשונה מתוך ה-3.',
      codeExample: `  <h2>הקטגוריות המובילות שלנו 🌟</h2>\n  <div class="row">\n    <div class="col-card">\n      <span class="badge">🔥 מוביל</span>\n      <img src="קישור_תמונה_1" width="100%">\n      <h3>כותרת כרטיסייה 1</h3>\n      <p>תיאור קצר מה-AI</p>\n    </div>\n  </div>`,
      steps: [
        'מתחת לכרטיסיית ה-Hero ב-<body>, הקלד כותרת <h2>הקטגוריות המובילות שלנו 🌟</h2>.',
        'מתחת לכותרת פתח שורה גמישה: <div class="row">...</div>.',
        'בתוך ה-.row פתח כרטיסייה ראשונה <div class="col-card"> והקלד בתוכה: <span>, <img>, <h3> ו-<p> עם התוכן של כרטיסייה מס׳ 1.'
      ],
      selfExplain: 'בחר כותרת <h2> מלהיבה שמתאימה לנושא האתר שלך!'
    },
    4: {
      title: 'שלב 4: כתיבת כרטיסיות 2 ו-3 לתוך שורת ה-Flexbox בקוד',
      summary: 'מוסיפים שתי קופסאות <div class="col-card"> נוספות בתוך אותה שורת <div class="row">.',
      codeExample: `  <div class="row">\n    <div class="col-card">...כרטיסייה 1...</div>\n    <div class="col-card">...כרטיסייה 2...</div>\n    <div class="col-card">...כרטיסייה 3...</div>\n  </div>`,
      steps: [
        'בתוך ה-<div class="row">, הקלד שתי קופסאות <div class="col-card">...</div> נוספות עבור כרטיסיות 2 ו-3.',
        'הזן בכרטיסייה 2 ובכרטיסייה 3 את התגית, התמונה, הכותרת (<h3>) והפסקה לפי התוכן מה-AI.',
        'הוסף בתחתית כל אחת מ-3 הכרטיסיות <button>לפרטים נוספים 👈</button>.'
      ],
      selfExplain: 'ודא שכל 3 ה-<div class="col-card"> נמצאות בתוך אותו <div class="row">!'
    },
    5: {
      title: 'שלב 5: עיצוב שורת ה-Flexbox ו-3 הכרטיסיות ב-<style> (🎨)',
      summary: 'מגדירים ב-<style> את display: flex לשורה ומעצבים ל-3 הכרטיסיות רוחב אחיד, מסגרות ואפקט ריחוף.',
      codeExample: `  .row {\n    display: flex;\n    justify-content: center;\n    gap: 18px;\n    flex-wrap: wrap;\n  }\n  .col-card {\n    background: white;\n    width: 230px;\n    padding: 18px;\n    border-radius: 18px;\n    border: 2px solid #e2e8f0;\n    box-shadow: 0 6px 16px rgba(0,0,0,0.08);\n    transition: 0.3s;\n  }\n  .col-card img {\n    height: 150px;\n    object-fit: cover;\n    border-radius: 12px;\n  }`,
      steps: [
        'הקלד ב-<style> עיצוב ל-.row עם display: flex; justify-content: center; gap: 18px; flex-wrap: wrap;.',
        'הגדר ל-.col-card רוחב אחיד (width: 230px;), רקע, מסגרת, פינות עגולות וצללית.',
        'הגדר ל-.col-card img גובה אחיד (height: 150px; object-fit: cover;) כדי שכל 3 הכרטיסיות יהיו באותו גובה בדיוק.',
        'הוסף .col-card:hover עם transform: translateY(-6px) ושינוי צבע מסגרת במעבר עכבר!'
      ],
      selfExplain: 'השקע בעיצוב הכרטיסיות והכפתורים שבתוכן כך שכל השלישייה תיראה כמו חנות או קטלוג יוקרתי!'
    },
    6: {
      title: 'שלב 6: בדיקת שבירת שורות במובייל ושמירת הקובץ',
      summary: 'רואים איך ה-flex-wrap: wrap מסדר את 3 הכרטיסיות אוטומטית במובייל ושומרים את הקובץ.',
      codeExample: `/* בזכות flex-wrap: wrap הכרטיסיות יורדות שורה אוטומטית במובייל! */`,
      steps: [
        'לחץ על תצוגת "🖥️ מחשב", ואז עבור ל-"📟 טאבלט" ול-"📱 מובייל" – שים לב איך הכרטיסיות יורדות שורה אוטומטית במסך צר!',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'כוונן את ה-gap וה-width של הכרטיסיות עד שהסימטריה שלהן מושלמת!',
      checklist: [
        'הרכבתי פרומפטים לתוכן ול-3 איורים בעזרת ה-AI.',
        'הקלדתי את 3 הכרטיסיות בתוך <div class="row"> עם display: flex.',
        'עיצבתי לכרטיסיות ולתמונות מידות אחידות ואפקט ריחוף ב-<style>.',
        'הורדתי ושמרתי את הקובץ index.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 7: עיצוב רספונסיבי (Responsive Design) ודיוק מרווחים לכל המסכים
  // --------------------------------------------------------------------------
  7: {
    1: {
      title: 'שלב 1: אבחון עיצוב האתר ב-3 המסכים (מחשב, טאבלט, מובייל)',
      summary: 'בודקים בעורך הקוד החי איך כל אזור בדף נראה ב-3 מצבי התצוגה.',
      codeExample: `<!-- נבדוק את עיצוב הקוד שלנו ב-3 גדלי מסך: מחשב, טאבלט ומובייל -->`,
      steps: [
        'ודא שהקובץ index.html שלך פתוח בעורך הקוד החי.',
        'לחץ על כפתור "📱 מובייל" בסרגל התצוגה החיה וגלול את האתר שלך מראש העמוד ועד ה-<footer>.',
        'בדוק: האם יש כותרות ארוכות מדי? האם יש כרטיסיות שצמודות מדי זו לזו?',
        'לחץ על "📟 טאבלט" ובדוק איך נראית שורת 3 הכרטיסיות שבנית במפגש הקודם.'
      ],
      selfExplain: 'רשום לעצמך אילו מרווחים וגדלי גופן כדאי לדייק ב-<style>!'
    },
    3: {
      title: 'שלב 3: שליטה בעיצוב Padding ו-Margin ב-<style> (🎨)',
      summary: 'מכוונים ב-<style> את המרווח הפנימי (padding) והמרווח החיצוני (margin) של כל הכרטיסיות בדף.',
      codeExample: `  .card {\n    padding: 28px;\n    margin: 22px auto;\n  }\n  footer {\n    margin-top: 32px;\n  }`,
      steps: [
        'עדכן ב-<body> את הכותרות והמשפטים הקצרים שיצרת ב-AI בשלב 2.',
        'בתוך ה-<style>, הגדר ל-.card מרווח פנימי padding: 28px; ומרווח חיצוני margin: 22px auto;.',
        'הוסף ל-footer מרווח עליון margin-top: 32px; כדי שהתוכן לא יידבק לתחתית.'
      ],
      selfExplain: 'זכור: padding מרחיב את הקופסה מבפנים, ו-margin מרחיק קופסאות זו מזו מבחוץ!'
    },
    5: {
      title: 'שלב 5: בניית ועיצוב כרטיסיית ה-CTA התחתונה בקוד',
      summary: 'מקלידים כרטיסיית הנעה לפעולה ממורכזת מעל ה-<footer> ומעצבים אותה עם גרדיאנט בולט ב-<style>.',
      codeExample: `  <div class="card cta-box">\n    <h2>מוכנים להתחיל? 🚀</h2>\n    <p>הצטרפו עכשיו ל-[SITE_NAME]!</p>\n    <a href="contact.html" class="btn-main">צרו קשר עכשיו 📞</a>\n  </div>`,
      steps: [
        'מעל ה-<footer> בתחתית ה-<body>, הקלד קופסה <div class="card cta-box">...</div>.',
        'הקלד בתוכה כותרת <h2> ופסקה <p> עם התוכן שיצרת ב-AI בשלב 4, וקישור <a href="contact.html" class="btn-main">.',
        'משימת עיצוב ב-<style>: תן ל-.cta-box רקע מדורג (linear-gradient) בולט, צבע כתב לבן ומסגרת מיוחדת.'
      ],
      selfExplain: 'עצב את .cta-box בצבעים חגיגיים שמושכים את העין בסוף הדף!'
    },
    6: {
      title: 'שלב 6: כתיבת כלל @media למובייל, בדיקת 3 המסכים ושמירת הקובץ',
      summary: 'מקלידים כלל רספונסיבי למובייל ב-<style> ושומרים את הקובץ.',
      codeExample: `  @media (max-width: 600px) {\n    .col-card {\n      width: 90%;\n    }\n    h1 {\n      font-size: 28px;\n    }\n  }`,
      steps: [
        'הקלד בסוף ה-<style> כלל @media (max-width: 600px) שמגדיר .col-card { width: 90%; } ומתאים את גודל ה-h1 למסכי טלפון.',
        'בדוק את הדף בתצוגת "🖥️ מחשב", "📟 טאבלט" ו-"📱 מובייל" וודא שהכול מיושר.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'כלל @media מאפשר לך לעצב את האתר במיוחד למסכי סמארטפון!',
      checklist: [
        'קיצרתי וליטשתי את הכותרות לתצוגת מובייל בעזרת ה-AI.',
        'כיוונתי padding ו-margin לכל הכרטיסיות ב-<style>.',
        'הוספתי ועיצבתי כרטיסיית CTA בולטת וכלל @media למובייל.',
        'הורדתי ושמרתי את הקובץ index.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 8: מיני-האקתון סיום רבעון א׳: אנימציות חיות, ביקורת AI והשקת דף הבית
  // --------------------------------------------------------------------------
  8: {
    2: {
      title: 'שלב 2: בניית ועיצוב כרטיסיית "הטבת השקה" מיוחדת בקוד',
      summary: 'מקלידים ב-<body> כרטיסיית מבצע/הטבת השקה מיוחדת לפי הרעיון מה-AI ומעצבים אותה ב-<style>.',
      codeExample: `  <div class="card promo-box">\n    <span class="badge">🎁 הטבת השקה</span>\n    <h2>מבצע השקה מיוחד ב-[SITE_NAME]!</h2>\n    <p>הירשמו היום וקבלו הטבה בלעדית.</p>\n    <button onclick="alert('ההטבה נשמרה עבורך! 🎉')">קבל הטבה ✨</button>\n  </div>`,
      steps: [
        'בתוך ה-<body>, הקלד קופסה חדשה <div class="card promo-box">...</div>.',
        'הקלד בתוכה תגית <span>, כותרת <h2>, פסקה <p> וכפתור <button onclick="alert(\'...\')"> עם תוכן הטבת ההשקה משלב 1.',
        'משימת עיצוב ב-<style>: עצב את .promo-box עם מסגרת מקווקוות (border: 3px dashed #f59e0b) ורקע חגיגי!'
      ],
      selfExplain: 'עצב את כרטיסיית ההטבה כך שתבלוט מיד לעין של כל מבקר שנכנס לדף הבית!'
    },
    3: {
      title: 'שלב 3: הוספת אנימציות CSS חיות ואפקטי ריחוף ב-<style> (🎨)',
      summary: 'מוסיפים תנועה וחיים לדף הבית באמצעות @keyframes ואפקטי :hover ב-<style>.',
      codeExample: `  @keyframes float {\n    0%, 100% { transform: translateY(0); }\n    50% { transform: translateY(-6px); }\n  }\n  .logo {\n    animation: float 3s infinite ease-in-out;\n  }\n  .col-card:hover {\n    transform: translateY(-6px);\n  }`,
      steps: [
        'הקלד בתוך ה-<style> אנימציית @keyframes float כפי שמופיע בדוגמה.',
        'חבר את האנימציה ללוגו שלך באמצעות השורה animation: float 3s infinite ease-in-out;.',
        'הוסף ל-.col-card:hover אפקט הרמה במעבר עכבר (transform: translateY(-6px);).'
      ],
      selfExplain: 'תוכל להוסיף אנימציה גם לכפתור הראשי או לתגית ה-.badge!'
    },
    4: {
      title: 'שלב 4: ליטוש טיפוגרפיה וצלליות טקסט ב-<style>',
      summary: 'מדייקים את משקלי הגופן, מרווח האותיות וצלליות הטקסט (text-shadow) של הכותרות בדף הבית.',
      codeExample: `  h1 {\n    font-weight: 900;\n    letter-spacing: 1px;\n    text-shadow: 0 2px 8px rgba(0,0,0,0.2);\n  }\n  h2 {\n    font-size: 26px;\n    color: #1e293b;\n  }`,
      steps: [
        'בתוך ה-<style>, הוסף ל-h1 משקל גופן מודגש (font-weight: 900;), ריווח אותיות וצללית טקסט (text-shadow).',
        'ודא שלכל כותרות ה-h2 יש גודל אחיד וצבע הרמוני.'
      ],
      selfExplain: 'עבור על כל האתר וודא שכל הצבעים, הכפתורים והכותרות משתלבים יחד בהרמוניה!'
    },
    5: {
      title: 'שלב 5: הורדת הקובץ ופתיחתו כאתר עצמאי בדפדפן',
      summary: 'מורידים את הקובץ index.html ופותחים אותו כאתר אמיתי בדפדפן המחשב.',
      codeExample: `<!-- הקובץ index.html שלך מוכן להרצה ישירות בדפדפן כרום/אדג׳! -->`,
      steps: [
        'לחץ בסרגל העליון של עורך הקוד על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html".',
        'פתח את התיקייה שלך במחשב ולחץ פעמיים על הקובץ index.html – האתר שכתבת ועיצבת ייפתח כאתר אמיתי בדפדפן!'
      ],
      selfExplain: 'כל הכבוד! כתבת ועיצבת בעצמך דף בית שלם בקוד פתוח!'
    },
    6: {
      title: 'שלב 6: הצגת סיום רבעון א׳ וסימון השלמה',
      summary: 'מציגים את דף הבית והעיצובים שיצרנו לכיתה ומסמנים את סיום רבעון א׳!',
      codeExample: `<!-- סיום רבעון א׳ בהצלחה! 🎉 -->`,
      steps: [
        'הצג לכיתה ב-30 שניות את שם המותג שלך, הלוגו ותמונת ה-Hero, ואת העיצוב שבנית ב-<style>.',
        'סמן את כל המשימות ולחץ למטה על כפתור השלמת מפגש 8!'
      ],
      selfExplain: 'אתה מוכן לרבעון ב׳ שבו נבנה ונעצב עמודים נוספים לאתר!',
      checklist: [
        'בניתי ועיצבתי כרטיסיית הטבת השקה מיוחדת בקוד.',
        'הוספתי אנימציית @keyframes float ואפקטי ריחוף (:hover) ב-<style>.',
        'בדקתי את הקובץ index.html כאתר עצמאי בדפדפן המחשב.',
        'סיימתי בהצלחה את רבעון א׳ (בניית ועיצוב דף הבית בקוד פתוח)!'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 9: סיפור המותג, דמות אווטאר ב-AI ובניית עמוד "אודות" (about.html)
  // --------------------------------------------------------------------------
  9: {
    3: {
      title: 'שלב 3: הקמת עמוד "אודות" (about.html) ואזור הדמות והסיפור בקוד',
      summary: 'בונים בקוד את עמוד האודות עם סרגל ניווט, תמונת הדמות מה-AI וסיפור המותג.',
      codeExample: `<body>\n  <nav>\n    <strong>[SITE_NAME]</strong>\n    <a href="index.html">ראשי</a>\n    <a href="about.html">אודות</a>\n  </nav>\n  <div class="card about-hero">\n    <img class="avatar" src="קישור_דמות_AI">\n    <div>\n      <h1>הסיפור של [SITE_NAME]</h1>\n      <p>איך הכל התחיל... (הפסקה מה-AI)</p>\n    </div>\n  </div>\n</body>`,
      steps: [
        'בעורך הקוד החי, נקה את תוכן הכרטיסיות של דף הבית (השאר את ה-<nav>, ה-<footer> וה-<style> כדי לשמור על אותו עיצוב!).',
        'בתוך ה-<body>, הקלד כרטיסייה <div class="card about-hero">.',
        'הקלד בתוכה תגית <img class="avatar" src="..."> עם קישור דמות ה-AI משלב 1, ולצידה <h1> ו-<p> עם סיפור המותג משלב 2.'
      ],
      selfExplain: 'תוכל לתת ל-.about-hero עיצוב של display: flex; align-items: center; gap: 20px; כדי שהדמות והטקסט יעמדו זה לצד זה!'
    },
    4: {
      title: 'שלב 4: בניית ועיצוב כרטיסיית "החזון והערכים שלנו" בקוד',
      summary: 'מוסיפים כרטיסייה שנייה בעמוד האודות עם החזון, 3 ערכי הליבה וכפתור חזרה לדף הבית.',
      codeExample: `  <div class="card">\n    <span class="badge">🎯 הערכים שלנו</span>\n    <h2>החזון שמוביל אותנו</h2>\n    <p>פסקת החזון מה-AI...</p>\n    <ul>\n      <li>ערך 1 מה-AI</li>\n      <li>ערך 2 מה-AI</li>\n      <li>ערך 3 מה-AI</li>\n    </ul>\n    <a href="index.html" class="btn-main">🏠 חזרה לדף הבית</a>\n  </div>`,
      steps: [
        'מתחת לכרטיסיית הסיפור, הקלד כרטיסייה שנייה <div class="card">.',
        'הקלד בתוכה תגית <span>, כותרת <h2>החזון שמוביל אותנו</h2> ופסקת החזון מה-AI.',
        'הקלד רשימה <ul> עם 3 שורות <li> עבור 3 ערכי הליבה מה-AI, ובתחתית קישור <a href="index.html" class="btn-main"> לחזרה לדף הבית.'
      ],
      selfExplain: 'עצב ב-<style> את רשימת הערכים כך שכל ערך יופיע בצבע או מסגרת בולטת!'
    },
    5: {
      title: 'שלב 5: עיצוב תמונת הדמות כעיגול מושלם וזוהר ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את תמונת ה-.avatar עם border-radius: 50%, מסגרת צבעונית וצללית.',
      codeExample: `  .avatar {\n    width: 180px;\n    height: 180px;\n    border-radius: 50%;\n    border: 4px solid #2563eb;\n    object-fit: cover;\n    box-shadow: 0 6px 18px rgba(0,0,0,0.15);\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב למחלקה .avatar.',
        'הגדר לה רוחב וגובה שווים (180px) ועיגול פינות border-radius: 50%; שהופך אותה לעיגול מושלם!',
        'הוסף לה מסגרת בעובי 4px בצבע המותג שלך וצללית box-shadow מרשימה.'
      ],
      selfExplain: 'הוסף גם .avatar:hover עם transform: scale(1.06) כדי שתמונת הדמות תגיב למעבר עכבר!'
    },
    6: {
      title: 'שלב 6: שמירת הקובץ about.html במחשב',
      summary: 'מורידים את העמוד השני של האתר ושומרים אותו בשם about.html באותה תיקייה של index.html.',
      codeExample: `<!-- שמור את הקובץ בשם about.html באותה תיקייה של index.html -->`,
      steps: [
        'בדוק את עיצוב עמוד האודות בתצוגת מחשב, טאבלט ומובייל.',
        'הורד את הקובץ מהעורך ושמור אותו בתיקייה שלך בשם about.html (לצד index.html).'
      ],
      selfExplain: 'כששני הקבצים באותה תיקייה, לחיצה על הקישורים בתפריט תעביר ביניהם מיד!',
      checklist: [
        'הרכבתי פרומפטים לדמות אווטאר תלת-ממדית ולסיפור מותג ב-AI.',
        'הקלדתי בקוד את עמוד האודות (about.html) בשתי כרטיסיות.',
        'עיצבתי את תמונת הדמות כעיגול עם border-radius: 50% ב-<style>.',
        'שמרתי את הקובץ about.html בתיקייה שלי.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 10: מספרי הצלחה (Stat Counters) והמלצות גולשים (Social Proof)
  // --------------------------------------------------------------------------
  10: {
    2: {
      title: 'שלב 2: בניית שורת 3 מוני נתונים (Stat Counters) בקוד',
      summary: 'מקלידים שורת <div class="row"> ובתוכה 3 קופסאות נתונים מספריים מרשימות.',
      codeExample: `  <div class="row">\n    <div class="stat-box">\n      <h2>+2,500</h2>\n      <p>משתמשים פעילים</p>\n    </div>\n    <div class="stat-box">\n      <h2>99%</h2>\n      <p>שביעות רצון</p>\n    </div>\n    <div class="stat-box">\n      <h2>24/7</h2>\n      <p>זמינות ושירות</p>\n    </div>\n  </div>`,
      steps: [
        'בעורך הקוד החי, הקלד ב-<body> שורה גמישה <div class="row">.',
        'בתוך השורה הקלד 3 קופסאות <div class="stat-box">.',
        'בכל קופסה הקלד <h2> עם המספר ו-<p> עם התיאור לפי התוצאה מה-AI בשלב 1.'
      ],
      selfExplain: 'מיד נעצב את .stat-box עם מסגרות וצבעים בולטים!'
    },
    3: {
      title: 'שלב 3: בניית אזור המלצות הלקוחות (Testimonials) בקוד',
      summary: 'מקלידים שורת Flexbox של 3 כרטיסיות המלצה עם דירוג 5 כוכבים ושם הממליץ.',
      codeExample: `  <h2>מה אומרים עלינו? 💬</h2>\n  <div class="row">\n    <div class="col-card">\n      <span>⭐⭐⭐⭐⭐</span>\n      <p>"ציטוט המלצה 1 מה-AI"</p>\n      <h3>- שם הממליץ</h3>\n    </div>\n  </div>`,
      steps: [
        'מתחת לשורת מוני הנתונים, הקלד כותרת <h2>מה אומרים עלינו? 💬</h2>.',
        'פתח מתחתיה <div class="row"> ובתוכה 3 כרטיסיות <div class="col-card">.',
        'בכל כרטיסייה הקלד: <span>⭐⭐⭐⭐⭐</span>, מתחתיה <p> עם ציטוט ההמלצה, ומתחתיה <h3> עם שם הממליץ.'
      ],
      selfExplain: 'שים את ציטוט ההמלצה בתוך מירכאות "..." והוסף לו font-style: italic ב-<style>!'
    },
    5: {
      title: 'שלב 5: עיצוב מוני הנתונים וכרטיסיות ההמלצה ב-<style> (🎨)',
      summary: 'מעניקים למוני הנתונים (.stat-box) ולכרטיסיות ההמלצה מידות, מסגרות, גרדיאנטים וצבעים ב-<style>.',
      codeExample: `  .stat-box {\n    background: white;\n    width: 180px;\n    padding: 18px;\n    border-radius: 18px;\n    border: 2px solid #3b82f6;\n    box-shadow: 0 6px 16px rgba(59,130,246,0.12);\n  }\n  .stat-box h2 {\n    color: #2563eb;\n    font-size: 34px;\n    margin: 0;\n  }`,
      steps: [
        'הקלד ב-<style> עיצוב ל-.stat-box עם רוחב אחיד, מסגרת צבעונית, פינות עגולות וצללית.',
        'הגדר ל-.stat-box h2 גודל גופן גדול (34px) וצבע מודגש כדי שהמספרים יבלטו.',
        'עצב גם את כרטיסיות ההמלצה עם אפקט הרמה במעבר עכבר (:hover).'
      ],
      selfExplain: 'בחר לכל .stat-box צבע מסגרת שמשתלב עם פלטת הצבעים של האתר שלך!'
    },
    6: {
      title: 'שלב 6: בדיקה ושמירת הקובץ המעודכן',
      summary: 'בודקים את תצוגת המונים וההמלצות במובייל ושומרים את הקובץ.',
      codeExample: `<!-- בדוק בתצוגת 📱 מובייל ושמור את הקובץ במחשב -->`,
      steps: [
        'בדוק את העמוד ב-"📱 מובייל" וודא שהמונים והכרטיסיות מסתדרים יפה.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור את הקובץ המעודכן במחשב.'
      ],
      selfExplain: 'האתר שלך כולל עכשיו מוני נתונים והמלצות בעיצוב מקצועי!',
      checklist: [
        'הקלדתי שורת Flexbox עם 3 קופסאות מונה נתונים (.stat-box).',
        'הקלדתי 3 כרטיסיות המלצות לקוחות עם דירוג כוכבים.',
        'עיצבתי מידות, מסגרות וצבעים ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 11: פתיחת עמוד שלישי (גלריה/קטלוג) ויצירת סדרת תמונות אחידה ב-AI
  // --------------------------------------------------------------------------
  11: {
    3: {
      title: 'שלב 3: הקמת עמוד הגלריה (gallery.html) ובניית השורה הראשונה בקוד',
      summary: 'יוצרים את עמוד הקטלוג ומקלידים את שורת ה-Flexbox הראשונה עבור פריטים 1 ו-2.',
      codeExample: `<body>\n  <h1>הקטלוג שלנו ✨</h1>\n  <div class="row">\n    <div class="item-card">\n      <img src="קישור_תמונה_1" width="100%">\n      <span class="badge">🔥 פופולרי</span>\n      <h3>שם פריט 1</h3>\n      <p>תיאור קצר מה-AI</p>\n      <button>לרכישה / פרטים 🛒</button>\n    </div>\n  </div>\n</body>`,
      steps: [
        'בעורך הקוד החי, הקלד את הכותרת הראשית ב-<body>: <h1>הקטלוג שלנו ✨</h1>.',
        'פתח שורת <div class="row"> ובתוכה הקלד 2 כרטיסיות <div class="item-card"> (עבור פריט 1 ופריט 2).',
        'בכל כרטיסייה הקלד: <img>, <span class="badge">, <h3>, <p> ו-<button> לפי התוכן משלב 1 ו-2.'
      ],
      selfExplain: 'תוכל לכתוב בתגית ה-<span class="badge"> את מחיר הפריט או קטגוריה מיוחדת!'
    },
    4: {
      title: 'שלב 4: כתיבת השורה השנייה בקטלוג (פריטים 3 ו-4) בקוד',
      summary: 'מקלידים עוד 2 כרטיסיות <div class="item-card"> עבור פריטים 3 ו-4.',
      codeExample: `    <div class="item-card">\n      <img src="קישור_תמונה_3" width="100%">\n      <span class="badge">✨ חדש</span>\n      <h3>שם פריט 3</h3>\n      <p>תיאור קצר מה-AI</p>\n      <button>לרכישה / פרטים 🛒</button>\n    </div>`,
      steps: [
        'הקלד 2 כרטיסיות <div class="item-card"> נוספות עבור פריט 3 ופריט 4.',
        'הזן בהן את קישורי התמונות (src), השמות (<h3>), התגיות והתיאורים של פריטים 3 ו-4.'
      ],
      selfExplain: 'הוסף onclick="alert(\'המוצר נוסף לסל!\')" לכל כפתור בקטלוג!'
    },
    5: {
      title: 'שלב 5: עיצוב אחיד ויוקרתי לכרטיסיות הקטלוג ב-<style> (🎨)',
      summary: 'נותנים לכל 4 הכרטיסיות והתמונות בגלריה מידות זהות, מסגרות ואפקט ריחוף ב-<style>.',
      codeExample: `  .item-card {\n    background: white;\n    width: 260px;\n    padding: 18px;\n    border-radius: 18px;\n    border: 2px solid #e2e8f0;\n    box-shadow: 0 6px 18px rgba(0,0,0,0.08);\n    transition: 0.3s;\n  }\n  .item-card img {\n    height: 190px;\n    object-fit: cover;\n    border-radius: 12px;\n  }\n  .item-card:hover {\n    transform: translateY(-6px);\n    border-color: #2563eb;\n  }`,
      steps: [
        'הקלד ב-<style> עיצוב ל-.item-card עם רוחב 260px, פינות עגולות, מסגרת וצללית.',
        'הגדר ל-.item-card img גובה אחיד של 190px עם object-fit: cover;.',
        'הוסף .item-card:hover עם transform: translateY(-6px); ושינוי צבע המסגרת במעבר עכבר.'
      ],
      selfExplain: 'עצב את כפתורי הקטלוג והתגיות (.badge) בצבעים בולטים שמתאימים לחנות או לגלריה שלך!'
    },
    6: {
      title: 'שלב 6: שמירת קובץ עמוד הגלריה (gallery.html) במחשב',
      summary: 'מורידים ושומרים את קובץ עמוד הגלריה בתיקייה האישית במחשב.',
      codeExample: `<!-- שמור את הקובץ בשם gallery.html בתיקיית האתר שלך -->`,
      steps: [
        'בדוק את עיצוב עמוד הגלריה ב-🖥️ מחשב, 📟 טאבלט ו-📱 מובייל.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור בשם gallery.html באותה תיקייה שבה שמורים index.html ו-about.html.'
      ],
      selfExplain: 'עכשיו יש לך כבר 3 עמודים מעוצבים באתר!',
      checklist: [
        'בניתי עמוד חדש עבור הגלריה/קטלוג (gallery.html).',
        'הרכבתי פרומפטים ליצירת 4 תמונות בסגנון אחיד ב-AI.',
        'הקלדתי ועיצבתי בקוד 4 כרטיסיות מוצר/פרויקט מלאות (.item-card).',
        'שמרתי את קובץ ה-HTML של העמוד החדש במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 12: יצירת רכיבי UI מתקדמים: כרטיסיית הדגשה ומועדון ה-VIP
  // --------------------------------------------------------------------------
  12: {
    1: {
      title: 'שלב 1: בניית ועיצוב כרטיסיית מוצר/פרויקט הדגל (Featured Card) בקוד',
      summary: 'מקלידים ב-<body> כרטיסיית הדגשה מיוחדת שמוצגת בראש הקטלוג או דף הבית.',
      codeExample: `  <div class="card featured-card">\n    <span class="badge">👑 מוצר הדגל</span>\n    <h2>המוצר המוביל של [SITE_NAME]</h2>\n    <p>תיאור מיוחד ומודגש של פריט הדגל באתר</p>\n    <button>הזמן עכשיו ב-VIP 🚀</button>\n  </div>`,
      steps: [
        'פתח את הקובץ gallery.html או index.html שלך בעורך הקוד החי.',
        'הקלד ב-<body> קופסה מיוחדת <div class="card featured-card">.',
        'הקלד בתוכה תגית <span>, כותרת <h2>, פסקת תיאור <p> וכפתור פעולה, ועצב את .featured-card ב-<style>!'
      ],
      selfExplain: 'תן ל-.featured-card מסגרת זהובה או זוהרת ורקע מיוחד שמבדיל אותה משאר הכרטיסיות!'
    },
    2: {
      title: 'שלב 2: שדרוג הקוד והעיצוב של כרטיסיית הדגל למותג שלך',
      summary: 'מדייקים את הטקסטים, התמונה והכפתור של כרטיסיית הדגל ומוסיפים לה אפקטים ב-<style>.',
      codeExample: `  <div class="card featured-card">\n    <span class="badge">🔥 מהדורה מוגבלת</span>\n    <h2>שם המוצר המיוחד שלי</h2>\n    <p>כולל אחריות מלאה ובונוס מיוחד למצטרפים!</p>\n    <button onclick="alert('נבחרה מהדורת הדגל!')">בחר במהדורה זו ⭐</button>\n  </div>`,
      steps: [
        'עדכן את הטקסטים בתוך ה-.featured-card כך שיתאימו בדיוק לנושא האתר שלך.',
        'הוסף לכפתור onclick="alert(\'...\')" עם הודעה מותאמת אישית ועצב אותו ב-<style>.'
      ],
      selfExplain: 'הוסף ל-.featured-card צללית מודגשת (box-shadow) כדי שתיראה יוקרתית!'
    },
    3: {
      title: 'שלב 3: בניית אזור "הצטרפות למועדון ה-VIP" בקוד HTML',
      summary: 'מקלידים בתחתית העמוד קופסת הרשמה מהירה למועדון החברים עם שדות <input> לשם ולאימייל.',
      codeExample: `  <div class="card vip-box">\n    <h2>🌟 הצטרפו למועדון ה-VIP של [SITE_NAME]</h2>\n    <p>הירשמו וקבלו הטבה מידית:</p>\n    <input type="text" placeholder="השם שלך...">\n    <input type="email" placeholder="האימייל שלך...">\n    <button onclick="alert('ברוכים הבאים למועדון ה-VIP! 🎉')">הצטרף למועדון 🚀</button>\n  </div>`,
      steps: [
        'לפני ה-<footer> בתחתית ה-<body>, הקלד קופסה <div class="card vip-box">.',
        'הקלד בתוכה שתי תגיות <input>: אחת לשם הגולש ואחת לאימייל שלו (עם placeholder מתאים).',
        'הקלד לצידן תגית <button> להרשמה למועדון.'
      ],
      selfExplain: 'מיד בשלב 5 נעצב את קופסת ה-VIP ואת שדות הקלט ב-<style>!'
    },
    5: {
      title: 'שלב 5: עיצוב אזור ה-VIP ושדות הקלט ב-<style> (🎨)',
      summary: 'מעצבים את כרטיסיית מועדון ה-VIP עם רקע מדורג יוקרתי ומעצבים את שדות ה-input.',
      codeExample: `  .vip-box {\n    background: linear-gradient(135deg, #1e1b4b, #4c1d95);\n    color: white;\n    border: 2px solid #a78bfa;\n  }\n  .vip-box input {\n    padding: 10px 14px;\n    border-radius: 10px;\n    border: none;\n    margin: 6px;\n  }`,
      steps: [
        'עדכן ב-.vip-box את הכותרת, משפט ההטבה והודעת הכפתור לפי התוצאה מה-AI בשלב 4.',
        'בתוך ה-<style>, תן ל-.vip-box רקע מדורג (linear-gradient) יוקרתי ומסגרת בעובי 2px.',
        'הקלד עיצוב ל-.vip-box input עם padding: 10px 14px; ו-border-radius: 10px;.'
      ],
      selfExplain: 'בחר למועדון ה-VIP שלך צבעים בולטים (כמו סגול-זהב או כחול-טורקיז)!'
    },
    6: {
      title: 'שלב 6: בדיקה ושמירת הקובץ המעודכן',
      summary: 'בודקים את פעולת כפתור ההרשמה ושומרים את הקובץ למחשב.',
      codeExample: `<!-- לחץ על כפתור ההרשמה בתצוגה החיה ובדוק שההודעה קופצת! -->`,
      steps: [
        'לחץ על כפתור ההרשמה בתצוגה המקדימה ובדוק שההודעה קופצת.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור את העמוד המעודכן במחשב.'
      ],
      selfExplain: 'שמור את הקובץ בתיקייה שלך להמשך!',
      checklist: [
        'הקלדתי בקוד כרטיסיית מוצר דגל (.featured-card) ואזור הרשמה למועדון VIP (.vip-box).',
        'הוספתי שדות <input> לשם ולאימייל וכפתור הצטרפות.',
        'עיצבתי אותם בהתאמה מלאה למותג שלי ב-<style>.',
        'הורדתי ושמרתי את הקובץ במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 13: וידאו, סאונד ומולטימדיה: הטמעת נגן וידאו ואפקטים קוליים
  // --------------------------------------------------------------------------
  13: {
    2: {
      title: 'שלב 2: הטמעת נגן הווידאו באתר בקוד (<iframe>)',
      summary: 'מקלידים כרטיסיית וידאו ב-<body> ומטמיעים בתוכה סרטון YouTube באמצעות <iframe>.',
      codeExample: `  <div class="card video-card">\n    <span class="badge">🎬 וידאו חי</span>\n    <h2>צפו בפעולה 🎬</h2>\n    <p>פסקת ההסבר מה-AI...</p>\n    <iframe width="100%" height="340" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>\n  </div>`,
      steps: [
        'בתוך ה-<body>, הקלד כרטיסייה <div class="card video-card"> והוסף בה תגית, <h2> ו-<p> מה-AI.',
        'מתחת לפסקה הקלד תגית <iframe width="100%" height="340" src="..." allowfullscreen></iframe>.',
        'הדבק ב-src קישור הטמעה של סרטון YouTube (במבנה https://www.youtube.com/embed/VIDEO_ID).'
      ],
      selfExplain: 'ב-YouTube אפשר ללחוץ על "שתף" ⬅️ "הטמעה (Embed)" ולהעתיק את קישור הסרטון!'
    },
    3: {
      title: 'שלב 3: הוספת כפתור לייק אינטראקטיבי מתחת לסרטון בקוד',
      summary: 'מקלידים מתחת לסרטון כפתור לייק שמקפיץ הודעת תודה חגיגית בלחיצה.',
      codeExample: `    <div class="btn-row">\n      <button onclick="alert('תודה על הלייק! 🎉')">👍 אהבתי את הסרטון!</button>\n    </div>`,
      steps: [
        'מתחת לתגית ה-</iframe> (בתוך כרטיסיית הווידאו), הקלד כפתור <button>.',
        'כתוב על הכפתור "👍 אהבתי את הסרטון!" והוסף לו onclick="alert(\'תודה על הלייק! 🎉\')".',
        'לחץ על הכפתור בתצוגה החיה ובדוק שההודעה קופצת!'
      ],
      selfExplain: 'עצב את כפתור הלייק ב-<style> עם צבע בולט ואפקט :hover!'
    },
    5: {
      title: 'שלב 5: שילוב העובדות ועיצוב מסך הווידאו ב-<style> (🎨)',
      summary: 'מוסיפים את 3 עובדות ה"הידעת?" ברשימת <ul> ומעצבים את כרטיסיית הווידאו בסגנון קולנועי כהה.',
      codeExample: `  .video-card {\n    background: #0f172a;\n    color: white;\n    border: 2px solid #38bdf8;\n  }\n  .video-card h2 {\n    color: #38bdf8;\n  }\n  iframe {\n    border: none;\n    border-radius: 16px;\n    box-shadow: 0 8px 24px rgba(0,0,0,0.4);\n  }`,
      steps: [
        'מתחת לכפתור הלייק ב-.video-card, הקלד רשימה <ul> עם 3 שורות <li> עבור 3 עובדות ה"הידעת?" מה-AI בשלב 4.',
        'בתוך ה-<style>, תן ל-.video-card רקע כהה (background: #0f172a;), מסגרת זוהרת וצבע כתב לבן (color: white;) כמו במסך קולנוע.',
        'הוסף ל-iframe עיגול פינות border-radius: 16px; וצללית מודגשת.'
      ],
      selfExplain: 'שנה את צבע הכותרת והמסגרת ב-.video-card לצבע ניאון זוהר (כמו תכלת, ירוק או ורוד)!'
    },
    6: {
      title: 'שלב 6: בדיקת הווידאו במובייל ושמירת הקובץ',
      summary: 'בודקים שנגן הווידאו מתאים את עצמו לרוחב המסך במובייל ושומרים את הקובץ.',
      codeExample: `<!-- width="100%" דואג שהסרטון יתאים אוטומטית לכל מסך! -->`,
      steps: [
        'עבור לתצוגת "📱 מובייל" וודא שנגן הווידאו מתכווץ אוטומטית לרוחב הטלפון.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור במחשב.'
      ],
      selfExplain: 'שמור את הקובץ המעודכן בתיקיית האתר שלך!',
      checklist: [
        'הטמעתי סרטון YouTube פועל באתר באמצעות <iframe>.',
        'הקלדתי כפתור לייק אינטראקטיבי מתחת לסרטון.',
        'הוספתי 3 עובדות "הידעת?" ועיצבתי את כרטיסיית הווידאו ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 14: חיבור כל עמודי האתר למערכת ניווט שלמה (Multi-Page Navigation)
  // --------------------------------------------------------------------------
  14: {
    2: {
      title: 'שלב 2: בדיקת קישורי סרגל הניווט (<nav>) בכל העמודים',
      summary: 'מוודאים שבראש הקוד מופיע סרגל <nav> עם קישורים ל-index.html, about.html, gallery.html ו-contact.html.',
      codeExample: `  <nav>\n    <strong>[SITE_NAME]</strong>\n    <a href="index.html">🏠 דף הבית</a>\n    <a href="about.html">ℹ️ אודות</a>\n    <a href="gallery.html">🖼️ גלריה</a>\n    <a href="contact.html">📞 צור קשר</a>\n  </nav>`,
      steps: [
        'פתח את index.html בעורך הקוד החי ובדוק את תגית ה-<nav> בראש ה-<body>.',
        'ודא שיש בה 4 קישורי <a href="..."> המובילים ל-index.html, about.html, gallery.html ו-contact.html.'
      ],
      selfExplain: 'כשכל הקבצים באותה תיקייה במחשב, הקישורים יעבירו מעמוד לעמוד בלחיצה!'
    },
    3: {
      title: 'שלב 3: הקמת סרגל כפתורי ניווט בדף הבית (index.html) בקוד',
      summary: 'מקלידים בדף הבית כרטיסיית ניווט עם 3 כפתורי קישור לעמודי האתר.',
      codeExample: `  <div class="card">\n    <h3>המשיכו לגלות את האתר שלנו 🧭</h3>\n    <div class="btn-row">\n      <a href="about.html" class="nav-btn">הסיפור שלנו 📖</a>\n      <a href="gallery.html" class="nav-btn">לגלריה המלאה 🖼️</a>\n      <a href="contact.html" class="nav-btn">דברו איתנו 💬</a>\n    </div>\n  </div>`,
      steps: [
        'לפני ה-<footer> בדף הבית, הקלד כרטיסייה <div class="card"> עם כותרת <h3>המשיכו לגלות את האתר שלנו 🧭</h3>.',
        'בתוכה הקלד <div class="btn-row"> עם 3 תגיות קישור <a class="nav-btn"> המובילות ל-about.html, ל-gallery.html ול-contact.html.',
        'כתוב בתוך הקישורים את הטקסטים המזמינים שיצרת ב-AI בשלב 1.'
      ],
      selfExplain: 'הוסף אימוג׳י מתאים לכל אחד מ-3 כפתורי הניווט!'
    },
    4: {
      title: 'שלב 4: הוספת כפתורי מעבר בעמוד האודות ובעמוד הגלריה',
      summary: 'מוסיפים קוד של כפתורי "לעמוד הבא" ו"חזרה לדף הבית" בתחתית עמודי האתר.',
      codeExample: `  <div class="btn-row">\n    <a href="index.html" class="nav-btn">🏠 חזרה לדף הבית</a>\n    <a href="contact.html" class="nav-btn">📞 מעבר לצור קשר</a>\n  </div>`,
      steps: [
        'הקלד את קוד ה-<div class="btn-row"> עם כפתורי המעבר.',
        'שלב אותו גם בתחתית עמוד האודות (about.html) וגם בתחתית עמוד הגלריה (gallery.html).'
      ],
      selfExplain: 'כך הגולש לעולם לא נתקע בעמוד ותמיד יכול להמשיך הלאה!'
    },
    5: {
      title: 'שלב 5: עיצוב אחיד לכפתורי הניווט (.nav-btn) ב-<style> (🎨)',
      summary: 'מעצבים את המחלקה .nav-btn בצבעים בולטים עם עיגול פינות, צללית ואפקט ריחוף.',
      codeExample: `  .nav-btn {\n    background: linear-gradient(135deg, #2563eb, #1d4ed8);\n    color: white;\n    padding: 12px 20px;\n    border-radius: 12px;\n    text-decoration: none;\n    font-weight: bold;\n    transition: 0.25s;\n  }\n  .nav-btn:hover {\n    transform: scale(1.06);\n    box-shadow: 0 6px 16px rgba(37,99,235,0.3);\n  }`,
      steps: [
        'הקלד ב-<style> את העיצוב עבור .nav-btn עם רקע מדורג, עיגול פינות 12px וכתב מודגש.',
        'הוסף .nav-btn:hover עם transform: scale(1.06); וצללית במעבר עכבר.'
      ],
      selfExplain: 'בחר לכפתורי הניווט את צבע המותג המרכזי שלך!'
    },
    6: {
      title: 'שלב 6: הורדת קובצי האתר ושמירתם באותה תיקייה',
      summary: 'שומרים את הגרסה המעודכנת של העמודים בתיקיית הפרויקט במחשב.',
      codeExample: `<!-- ודא שכל קובצי ה-HTML שמורים באותה תיקייה במחשב -->`,
      steps: [
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור את העמודים המעודכנים באותה תיקייה במחשב.',
        'פתח את index.html מהתיקייה בדפדפן ונסה לעבור בין העמודים בלחיצה!'
      ],
      selfExplain: 'עבודה מעולה! כל עמודי האתר שלך מחוברים זה לזה.',
      checklist: [
        'חיברתי קישורי ניווט (<a>) בין דף הבית, אודות, גלריה וצור קשר.',
        'עיצבתי את כפתורי המעבר (.nav-btn) ב-<style>.',
        'הורדתי ושמרתי את קובצי ה-HTML המעודכנים באותה תיקייה במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 15: עיצוב עלית: גרדיאנטים רב-שכבתיים, מסגרות מיוחדות ואנימציות CSS
  // --------------------------------------------------------------------------
  15: {
    2: {
      title: 'שלב 2: שדרוג כרטיסיית ה-Hero והכפתורים עם גרדיאנטים ב-<style> (🎨)',
      summary: 'מיישמים את מתכון הגרדיאנטים מה-AI בזווית 135deg בתוך תגית ה-<style>.',
      codeExample: `  .hero-card {\n    background: linear-gradient(135deg, #1e3a8a, #7c3aed);\n    color: white;\n  }\n  button, .btn-main {\n    background: linear-gradient(135deg, #10b981, #059669);\n    color: white;\n  }`,
      steps: [
        'בעורך הקוד החי, גלול לאזור ה-<style>.',
        'עדכן ב-.hero-card את ה-background ל-linear-gradient(135deg, #צבע1, #צבע2) עם קודי ה-HEX מה-AI בשלב 1.',
        'הוסף גם ל-button ול-.btn-main רקע מדורג עם זוג הצבעים השני מה-AI!'
      ],
      selfExplain: 'אפשר לשלב אפילו 3 צבעים בתוך linear-gradient אחד!'
    },
    3: {
      title: 'שלב 3: עיצוב מסגרות מיוחדות ועיגול פינות מדויק ב-<style>',
      summary: 'מוסיפים מסגרות צבעוניות (solid / dashed) ועיגול פינות של 20px לכרטיסיות.',
      codeExample: `  .col-card {\n    border: 2px solid #93c5fd;\n    border-radius: 20px;\n  }\n  .promo-box {\n    border: 2px dashed #f59e0b;\n  }`,
      steps: [
        'בתוך ה-<style>, הוסף ל-.col-card מסגרת בעובי 2px עם קוד הצבע מה-AI ועיגול פינות של 20px.',
        'תן לאחת הכרטיסיות המיוחדות בדף מסגרת מקווקוות (border: 2px dashed ...) להבלטה.'
      ],
      selfExplain: 'נסה סגנונות מסגרת שונים: solid (רציף), dashed (מקווקו) או double (כפול)!'
    },
    4: {
      title: 'שלב 4: שליטה במרווח אותיות, גובה שורה וצללית טקסט ב-<style>',
      summary: 'משדרגים את הטיפוגרפיה של הכותרות באמצעות letter-spacing ו-text-shadow.',
      codeExample: `  h1 {\n    letter-spacing: 1px;\n    text-shadow: 0 3px 10px rgba(0,0,0,0.25);\n  }\n  .badge {\n    font-weight: 800;\n  }`,
      steps: [
        'בתוך ה-<style>, הוסף ל-h1 מרווח אותיות letter-spacing: 1px; וצללית טקסט מודגשת.',
        'הגדר ל-.badge משקל גופן מודגש מאוד (font-weight: 800;).'
      ],
      selfExplain: 'צללית טקסט (text-shadow) גורמת לכותרת לבלוט מעל רקע צבעוני!'
    },
    5: {
      title: 'שלב 5: שילוב אנימציות CSS חיות (Pulse, Float) ב-<style>',
      summary: 'מוסיפים אפקטים דינמיים של פעימה וריחוף בתוך ה-<style>.',
      codeExample: `  @keyframes pulse {\n    0%, 100% { transform: scale(1); }\n    50% { transform: scale(1.06); }\n  }\n  .badge {\n    display: inline-block;\n    animation: pulse 2s infinite;\n  }`,
      steps: [
        'הקלד ב-<style> אנימציית @keyframes pulse כפי שמופיע בדוגמה.',
        'חבר את האנימציה לתגיות ה-.badge שלך באמצעות animation: pulse 2s infinite;.'
      ],
      selfExplain: 'אלמנט עם אנימציה מושך מיד את העין של הגולש שנכנס לאתר!'
    },
    6: {
      title: 'שלב 6: שמירת העמודים המשודרגים במחשב',
      summary: 'מורידים ושומרים את הקבצים המעודכנים במחשב.',
      codeExample: `<!-- בדוק את העיצוב בתצוגת מחשב ומובייל ושמור את הקובץ -->`,
      steps: [
        'בדוק את העמוד בתצוגת "🖥️ מחשב" ובתצוגת "📱 מובייל".',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור בתיקיית האתר שלך.'
      ],
      selfExplain: 'שלב את חוקי ה-<style> המשודרגים שלך גם בשאר עמודי האתר!',
      checklist: [
        'הגדרתי רקעים מדורגים (linear-gradient) לכרטיסיות ולכפתורים ב-<style>.',
        'עיצבתי מסגרות, צלליות טקסט ואנימציות @keyframes.',
        'שמרתי את הקבצים המעודכנים בתיקיית הפרויקט במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 16: תערוכת אמצע שנה: אריזת האתר הרב-עמודי והצגתו לכיתה
  // --------------------------------------------------------------------------
  16: {
    2: {
      title: 'שלב 2: בדיקת שלמות קוד ה-HTML וה-CSS של העמודים',
      summary: 'עוברים על קוד העמודים ומוודאים שכל התגיות, העיצובים, התמונות והקישורים תקינים.',
      codeExample: `<!-- ודא שבראש ה-<body> יש <nav> ובתחתית יש <footer> בכל עמוד -->`,
      steps: [
        'טען את הקובץ index.html שלך בעורך הקוד החי.',
        'בדוק שמופיעים סרגל הניווט <nav> וה-<footer> עם שם המותג שלך.',
        'בדוק שכל התמונות (<img>) והסרטון (<iframe>) נטענים ומעוצבים כראוי בתצוגה החיה.'
      ],
      selfExplain: 'אם תמונה לא נטענת, בדוק שהקישור בתוך src="..." שלם ותקין!'
    },
    3: {
      title: 'שלב 3: הוספת ועיצוב אזור "🎉 חדש באתר!" לקראת התערוכה בקוד',
      summary: 'מקלידים בדף הבית כרטיסיית הדגשה שמציגה את החידושים האחרונים באתר ומעצבים אותה.',
      codeExample: `  <div class="card launch-card">\n    <span class="badge">🎉 השקת אמצע שנה</span>\n    <h3>ברוכים הבאים לתערוכת האתר [SITE_NAME]!</h3>\n    <p>היכנסו לעמוד האודות, צפו בסרטון ובקרו בגלריה שלנו.</p>\n  </div>`,
      steps: [
        'בדף הבית (index.html), הקלד ב-<body> כרטיסייה <div class="card launch-card"> עם תגית <span class="badge">🎉 השקת אמצע שנה</span>.',
        'הקלד בתוכה כותרת <h3> ופסקה שמזמינה את המבקרים בתערוכה לגלות את העמודים שבנית.',
        'עצב ב-<style> את .launch-card עם רקע חגיגי ומסגרת בולטת.'
      ],
      selfExplain: 'תן לכרטיסיית ההשקה צבע רקע או גרדיאנט חגיגי ב-<style>!'
    },
    4: {
      title: 'שלב 4: בדיקה רספונסיבית מלאה ב-3 גדלי המסך (🎨)',
      summary: 'מוודאים שכל האלמנטים בדף נראים מעולה במחשב, בטאבלט ובמובייל.',
      codeExample: `  img, iframe {\n    max-width: 100%;\n  }`,
      steps: [
        'עבור על העמוד ב-3 מצבי התצוגה בעורך: 🖥️ מחשב, 📟 טאבלט ו-📱 מובייל.',
        'ודא שב-<style> מופיע img, iframe { max-width: 100%; } כדי שאף תמונה לא תחרוג מהמסך.'
      ],
      selfExplain: 'max-width: 100% שומר על כל התמונות בתוך גבולות המסך!'
    },
    5: {
      title: 'שלב 5: הורדת הקבצים והרצת האתר ישירות בדפדפן',
      summary: 'מורידים את קובצי ה-HTML לתיקייה אחת ופותחים אותם בדפדפן להצגה.',
      codeExample: `<!-- פתח את index.html מהתיקייה במחשב והצג אותו בדפדפן! -->`,
      steps: [
        'הורד את הגרסה הסופית של index.html (ו-about.html / gallery.html) לתיקייה שלך במחשב.',
        'פתח את הקובץ index.html בדפדפן ולחץ על קישורי הניווט כדי לעבור בין העמודים שלך בלייב!'
      ],
      selfExplain: 'האתר הרב-עמודי שלך עובד כמו אתר אמיתי לכל דבר!'
    },
    6: {
      title: 'שלב 6: הצגה בתערוכת אמצע השנה וסימון השלמה',
      summary: 'מציגים את האתר הרב-עמודי ואת קוד ה-HTML/CSS שכתבנו לכיתה ומסיימים את רבעון ב׳!',
      codeExample: `<!-- סיום רבעון ב׳ בהצלחה! 🏆 -->`,
      steps: [
        'הצג את האתר שלך ואת קוד ה-HTML וה-<style> שכתבת לכיתה לפי תסריט ה-60 שניות משלב 1.',
        'סמן את המשימות ולחץ על כפתור השלמת מפגש 16!'
      ],
      selfExplain: 'ברבעון ג׳ נהפוך את האתר לאינטראקטיבי וחכם עם JavaScript וטפסים!',
      checklist: [
        'הרכבתי פרומפט לתסריט הצגה של 60 שניות עם ה-AI.',
        'וידאתי שכל עמודי האתר מחוברים, מעוצבים ופועלים בדפדפן.',
        'הצגתי את האתר הרב-עמודי שלי בתערוכת אמצע השנה!'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 17: אירועים ופעולות (Events): בניית סרגל מצב לילה/יום וכפתורים חכמים
  // --------------------------------------------------------------------------
  17: {
    2: {
      title: 'שלב 2: בניית סרגל החלפת מצב תצוגה (יום / לילה / מיוחד) בקוד',
      summary: 'מקלידים ב-<body> שורה של 3 כפתורים שמשנים את צבע הרקע של הדף בזמן אמת!',
      codeExample: `  <div class="btn-row">\n    <button class="pill-btn" onclick="document.body.style.background='#f0f9ff'">☀️ מצב יום</button>\n    <button class="pill-btn" onclick="document.body.style.background='#0f172a'">🌙 מצב לילה</button>\n    <button class="pill-btn" onclick="document.body.style.background='#3b0764'">⚡ מצב מיוחד</button>\n  </div>`,
      steps: [
        'מתחת לסרגל הניווט ב-<body>, הקלד <div class="btn-row">...</div>.',
        'הקלד בתוכה 3 כפתורי <button class="pill-btn">: "☀️ מצב יום", "🌙 מצב לילה" ו-"⚡ מצב מיוחד".',
        'בכל כפתור הוסף onclick="document.body.style.background=\'#קוד_צבע\'" עם 3 קודי ה-HEX מה-AI בשלב 1.',
        'לחץ על שלושת הכפתורים בתצוגה החיה וראה איך צבע הרקע של האתר משתנה מיד!'
      ],
      selfExplain: 'בחר את 3 צבעי הרקע שהכי מגניבים בעיניך למצבי התצוגה של האתר!'
    },
    3: {
      title: 'שלב 3: בניית כפתורי "טיפ יומי" ו"קופון סודי" בקוד',
      summary: 'מקלידים שני כפתורים אינטראקטיביים שמקפיצים את הודעות ההפתעה מה-AI בלחיצה.',
      codeExample: `  <div class="btn-row">\n    <button onclick="alert('הטיפ היומי מה-AI!')">💡 הטיפ היומי שלנו</button>\n    <button onclick="alert('קוד קופון סודי: VIP2026 🎁')">🎁 חשוף קוד קופון סודי</button>\n  </div>`,
      steps: [
        'באזור המרכזי של הדף, הקלד <div class="btn-row"> עם שני כפתורי <button>.',
        'בכפתור הראשון ("💡 הטיפ היומי שלנו") הוסף onclick="alert(\'...\')" עם הטיפ מה-AI.',
        'בכפתור השני ("🎁 חשוף קוד קופון סודי") הוסף onclick="alert(\'...\')" עם קוד ההטבה מה-AI.'
      ],
      selfExplain: 'עצב את שני הכפתורים האלו ב-<style> עם צבעים בולטים!'
    },
    4: {
      title: 'שלב 4: הוספת כפתור "⬆️ חזרה לראש העמוד" בתחתית הדף בקוד',
      summary: 'מקלידים מעל ה-<footer> כפתור שמבצע גלילה חלקה לראש העמוד בלחיצה.',
      codeExample: `  <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})">\n    ⬆️ חזרה לראש העמוד\n  </button>`,
      steps: [
        'גלול לתחתית ה-<body> (ממש מעל ה-<footer>).',
        'הקלד כפתור <button onclick="window.scrollTo({top: 0, behavior: \'smooth\'})">⬆️ חזרה לראש העמוד</button>.',
        'גלול לתחתית התצוגה המקדימה ולחץ על הכפתור כדי לבדוק שהוא מעלה אותך למעלה בחלקות!'
      ],
      selfExplain: 'הפקודה window.scrollTo גוללת את הדף לנקודה 0 (ראש העמוד)!'
    },
    5: {
      title: 'שלב 5: עיצוב כפתורי הפעולות ככפתורי כמוסה (Pills) ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את כפתורי מצב התצוגה עם עיגול פינות מלא (border-radius: 999px), מסגרות וצלליות.',
      codeExample: `  .pill-btn {\n    border-radius: 999px;\n    padding: 10px 20px;\n    border: 2px solid #cbd5e1;\n    font-weight: bold;\n    cursor: pointer;\n    transition: 0.25s;\n  }\n  .pill-btn:hover {\n    transform: scale(1.07);\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב למחלקה .pill-btn.',
        'תן לה עיגול פינות של border-radius: 999px; (צורת כמוסה עגולה), padding: 10px 20px; ואפקט :hover.'
      ],
      selfExplain: 'אפשר לתת לכל כפתור צבע רקע שונה או מסגרת זוהרת!'
    },
    6: {
      title: 'שלב 6: בדיקה ושמירת הקובץ המעודכן',
      summary: 'בודקים את כל הכפתורים האינטראקטיביים ושומרים את הקובץ במחשב.',
      codeExample: `<!-- בדוק את כל הכפתורים החדשים בתצוגה החיה ושמור את index.html -->`,
      steps: [
        'נסה את כל הכפתורים שבנית היום בתצוגה המקדימה החיה.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'מעולה! הוספת ועיצבת לאתר שלך אירועי לחיצה (onclick) ב-JavaScript!',
      checklist: [
        'בניתי סרגל של 3 כפתורים להחלפת צבע הרקע של הדף.',
        'בניתי כפתורי טיפ יומי וקופון עם הודעה קופצת.',
        'הוספתי כפתור גלילה לראש העמוד בתחתית האתר ועיצבתי הכול ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 18: קלט ופלט בזמן אמת (Input & Output): האתר מדבר עם המשתמש
  // --------------------------------------------------------------------------
  18: {
    2: {
      title: 'שלב 2: הוספת שדה קלט (Input1) וקופסת פלט (Label1) בקוד',
      summary: 'מקלידים בכרטיסייה תגית <input id="Input1"> לקריאת שם הגולש ותגית <div id="Label1"> להצגת התשובה.',
      codeExample: `  <div class="card">\n    <h2>✨ הודעה אישית במיוחד בשבילך</h2>\n    <input id="Input1" placeholder="הקלד את השם שלך...">\n    <div id="Label1">כאן תופיע ההודעה האישית שלך!</div>\n  </div>`,
      steps: [
        'הקלד ב-<body> כרטיסייה <div class="card"> עם הכותרת <h2> מה-AI בשלב 1.',
        'בתוכה הקלד שדה קלט: <input id="Input1" placeholder="הקלד את השם שלך...">.',
        'מתחתיו הקלד קופסת פלט: <div id="Label1">כאן תופיע ההודעה האישית שלך!</div>.'
      ],
      selfExplain: 'המזהה id="Input1" ו-id="Label1" מאפשר גם ל-<script> וגם ל-<style> למצוא ולעצב אותם!'
    },
    3: {
      title: 'שלב 3: חיבור הכפתור ופונקציית <script> שקוראת מהקלט ומציגה בפלט',
      summary: 'מקלידים כפתור וכותבים פונקציית JavaScript קצרה ב-<script> שמחברת בין Input1 ל-Label1.',
      codeExample: `<!-- בתוך הכרטיסייה ב-<body>: -->\n<button onclick="showMsg()">✨ צור לי הודעה אישית!</button>\n\n<!-- בסוף הקוד (מתחת ל-</style>): -->\n<script>\n  function showMsg() {\n    var name = document.getElementById('Input1').value;\n    document.getElementById('Label1').innerText = 'שלום ' + name + '! ברוך הבא ל-[SITE_NAME] 🚀';\n  }\n</script>`,
      steps: [
        'בין Input1 ל-Label1 ב-<body>, הקלד <button onclick="showMsg()">✨ צור לי הודעה אישית!</button>.',
        'מתחת לתגית </style> בסוף הקוד, פתח תגית <script>...</script> והקלד את הפונקציה showMsg() כמו בדוגמה.',
        'הזן במשפט את טקסט הפתיחה וטקסט הסיום שיצרת ב-AI בשלב 1.',
        'הקלד את שמך בתיבת הקלט בתצוגה החיה ולחץ על הכפתור – ההודעה האישית תופיע מיד בקופסת הפלט!'
      ],
      selfExplain: 'שנה את המשפט בתוך הפונקציה כך שיכלול אימוג׳ים וברכה מקורית משלך!'
    },
    4: {
      title: 'שלב 4: שדרוג לשני שדות קלט (Input1 ו-Input2) וחיבורם ב-<script>',
      summary: 'מוסיפים שדה קלט שני (Input2) ומשלבים את שני השדות יחד בתוצאה אחת!',
      codeExample: `<!-- ב-<body> מתחת ל-Input1: -->\n<input id="Input2" placeholder="מה התחום/המוצר האהוב עליך?">\n\n<!-- עדכון הפונקציה ב-<script>: -->\n<script>\n  function showMsg() {\n    var name = document.getElementById('Input1').value;\n    var fav = document.getElementById('Input2').value;\n    document.getElementById('Label1').innerText = 'היי ' + name + ', בחירה מעולה ב-' + fav + '!';\n  }\n</script>`,
      steps: [
        'הקלד מתחת ל-Input1 ב-<body> שדה קלט שני: <input id="Input2" placeholder="..."/>.',
        'בתוך הפונקציה showMsg() ב-<script>, קרא גם את הערך של Input2 וחבר את שני השדות למשפט אחד באמצעות סימן +.',
        'נסה להקליד בשני השדות וללחוץ על הכפתור בתצוגה החיה!'
      ],
      selfExplain: 'הסימן + ב-JavaScript מחבר מילים ומשתנים למשפט אחד שלם!'
    },
    5: {
      title: 'שלב 5: עיצוב שדות הקלט וקופסת הפלט (#Label1) ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את שדות ה-input ואת קופסת הפלט #Label1 כך שתבלוט כמו מסך תצוגה דיגיטלי.',
      codeExample: `  input {\n    padding: 12px 16px;\n    border-radius: 12px;\n    border: 2px solid #93c5fd;\n    margin: 6px;\n    font-size: 16px;\n  }\n  #Label1 {\n    margin-top: 16px;\n    padding: 18px;\n    background: linear-gradient(135deg, #eff6ff, #dbeafe);\n    border: 2px solid #2563eb;\n    border-radius: 14px;\n    font-size: 18px;\n    font-weight: bold;\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב ל-#Label1 עם רקע מדורג, מסגרת 2px, עיגול פינות 14px וגודל גופן 18px מודגש.',
        'הקלד עיצוב ל-input והתאם את צבע המסגרת והפינות לצבעי המותג שלך.'
      ],
      selfExplain: 'בחר לקופסת התוצאה #Label1 צבע רקע, מסגרת וצללית שיגרמו לה לבלוט!'
    },
    6: {
      title: 'שלב 6: בדיקה ושמירת הקובץ המעודכן',
      summary: 'בודקים את פעולת הקלט והפלט ושומרים את הקובץ במחשב.',
      codeExample: `<!-- בדוק שהקלדה בשני השדות ולחיצה על הכפתור מציגה את המשפט המלא! -->`,
      steps: [
        'בדוק שכל השדות והכפתור עובדים חלק בתצוגה החיה.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור במחשב.'
      ],
      selfExplain: 'האתר שלך כבר יודע לדבר עם המשתמשים בזמן אמת!',
      checklist: [
        'הקלדתי שדות קלט (Input1, Input2) וקופסת פלט (Label1) ב-<body>.',
        'כתבתי פונקציית <script> שמציגה את הקלט של המשתמש בתוך קופסת הפלט.',
        'עיצבתי את שדות הקלט וקופסת הפלט ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 19: רכיבי בחירה מתקדמים: תפריטים נפתחים (Dropdown), סליידרים וצ׳קבוקסים
  // --------------------------------------------------------------------------
  19: {
    2: {
      title: 'שלב 2: הוספת תפריט בחירה נפתח (<select>) וסליידר טווח (type="range") בקוד',
      summary: 'מקלידים ב-<body> תגית <select> עם אפשרויות <option> וסליידר מספרים <input type="range">.',
      codeExample: `  <div class="card">\n    <h2>🎛️ הרכיבו לעצמכם בהתאמה אישית</h2>\n    <select id="Select1">\n      <option>אפשרות 1 מה-AI</option>\n      <option>אפשרות 2 מה-AI</option>\n      <option>אפשרות 3 מה-AI</option>\n    </select>\n    <br><br>\n    <input type="range" id="Slider1" min="1" max="100" value="50">\n  </div>`,
      steps: [
        'הקלד ב-<body> כרטיסייה חדשה עם כותרת <h2>🎛️ הרכיבו לעצמכם בהתאמה אישית</h2>.',
        'הקלד בתוכה <select id="Select1"> ובתוכו 3–4 שורות <option> עם האפשרויות מה-AI בשלב 1.',
        'מתחתיו הקלד סליידר: <input type="range" id="Slider1" min="1" max="100" value="50">.'
      ],
      selfExplain: 'שנה את ה-min וה-max של הסליידר לטווח המספרים שמתאים לאתר שלך!'
    },
    3: {
      title: 'שלב 3: הוספת תיבות סימון (Checkbox) ובוחר צבע (Color Picker) בקוד',
      summary: 'מקלידים תיבות סימון <input type="checkbox"> ובוחר צבע <input type="color">.',
      codeExample: `    <p>\n      <label><input type="checkbox"> תוספת 1</label>\n      <label><input type="checkbox"> תוספת 2</label>\n    </p>\n    <p>בחר צבע מועדף: <input type="color" id="Color1" value="#2563eb"></p>`,
      steps: [
        'מתחת לסליידר, הקלד תיבות סימון <input type="checkbox"> עם התוספות מה-AI.',
        'מתחתיהן הקלד בוחר צבע: <input type="color" id="Color1" value="#2563eb">.'
      ],
      selfExplain: 'נסה ללחוץ על בוחר הצבע בתצוגה החיה – ייפתח לך חלון בחירת צבעים מלא!'
    },
    4: {
      title: 'שלב 4: חיבור כפתור ופונקציית <script> שמציגה את סיכום הבחירה',
      summary: 'מחברים כפתור שקורא את הבחירה מהתפריט (Select1) ומהסליידר (Slider1) ומציג סיכום ב-CustomOutput.',
      codeExample: `<!-- בכרטיסייה ב-<body>: -->\n<button onclick="showSummary()">✅ הצג סיכום התאמה אישית</button>\n<div id="CustomOutput">הסיכום שלך יופיע כאן...</div>\n\n<!-- ב-<script>: -->\n<script>\n  function showSummary() {\n    var choice = document.getElementById('Select1').value;\n    var num = document.getElementById('Slider1').value;\n    document.getElementById('CustomOutput').innerText = 'בחרת: ' + choice + ' | כמות/רמה: ' + num;\n  }\n</script>`,
      steps: [
        'הקלד בתחתית הכרטיסייה כפתור <button onclick="showSummary()"> ומתחתיו <div id="CustomOutput">.',
        'בתוך ה-<script>, הקלד את הפונקציה showSummary() שקוראת את Select1 ו-Slider1 ומציגה אותם ב-CustomOutput.',
        'בחר אפשרות בתפריט, הזז את הסליידר ולחץ על הכפתור בתצוגה החיה!'
      ],
      selfExplain: 'אפשר לקרוא גם את הצבע מתוך Color1 ולהציג אותו בסיכום!'
    },
    5: {
      title: 'שלב 5: עיצוב פאנל ההתאמה האישית ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את תפריט ה-select, ה-label וקופסת התוצאה #CustomOutput.',
      codeExample: `  select {\n    padding: 10px 16px;\n    border-radius: 10px;\n    border: 2px solid #7c3aed;\n    font-size: 16px;\n  }\n  #CustomOutput {\n    margin-top: 14px;\n    padding: 16px;\n    background: #f5f3ff;\n    border: 2px solid #7c3aed;\n    border-radius: 12px;\n    font-weight: bold;\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב ל-select ול-#CustomOutput.',
        'בחר צבעי מסגרת, רקע וצללית שגורמים לפאנל להיראות כמו לוח בקרה מודרני.'
      ],
      selfExplain: 'עצב את הפאנל בצבעים שאתה הכי אוהב!'
    },
    6: {
      title: 'שלב 6: בדיקה ושמירת הקובץ המעודכן',
      summary: 'בודקים את כל רכיבי הבחירה ושומרים את הקובץ במחשב.',
      codeExample: `<!-- בדוק את התפריט הנפתח והסליידר גם ב-📱 מובייל ושמור -->`,
      steps: [
        'בדוק את התפריט הנפתח והסליידר גם בתצוגת "📱 מובייל".',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור במחשב.'
      ],
      selfExplain: 'שמור את הקובץ המעודכן בתיקייה שלך!',
      checklist: [
        'הקלדתי תפריט בחירה נפתח (<select>) וסליידר טווח (<input type="range">).',
        'הוספתי תיבות סימון (checkbox) ובוחר צבע (color).',
        'חיברתי פונקציית <script> שמציגה את סיכום הבחירה ועיצבתי ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 20: בניית עמוד "צור קשר" חכם וטפסים (contact.html)
  // --------------------------------------------------------------------------
  20: {
    2: {
      title: 'שלב 2: הקמת מיכל הטופס (<form>) בעמוד צור קשר בקוד',
      summary: 'מקלידים ב-<body> טופס <form id="Form1"> עם 4 שדות <input> ותיבת הודעה גדולה <textarea>.',
      codeExample: `  <div class="card">\n    <h1>צרו קשר עם [SITE_NAME] 📞</h1>\n    <form id="Form1" onsubmit="return false;">\n      <input id="Input1" type="text" placeholder="שם מלא..."><br>\n      <input id="Input2" type="tel" placeholder="טלפון..."><br>\n      <input id="Input3" type="email" placeholder="אימייל..."><br>\n      <input id="Input4" type="date"><br>\n      <textarea id="Textarea1" rows="4" placeholder="כתבו לנו הודעה..."></textarea>\n    </form>\n  </div>`,
      steps: [
        'בעורך הקוד החי, צור כרטיסייה עבור עמוד צור קשר עם כותרת <h1>צרו קשר 📞</h1>.',
        'בתוכה פתח תגית טופס: <form id="Form1" onsubmit="return false;">... </form>.',
        'הקלד בתוך הטופס 4 תגיות <input> (שם Input1, טלפון Input2, אימייל Input3, תאריך Input4) ומתחתיהן <textarea id="Textarea1">.'
      ],
      selfExplain: 'התאם את ה-placeholder בכל שדה לפי מה שיצרת ב-AI בשלב 1!'
    },
    3: {
      title: 'שלב 3: הוספת כפתור שליחה חכם וכפתור איפוס טופס בקוד',
      summary: 'מקלידים בתחתית הטופס כפתור שמקפיץ סיכום של הנתונים שהוזנו וכפתור type="reset" שמנקה את השדות.',
      codeExample: `<!-- בתחתית ה-<form>: -->\n<div class="btn-row">\n  <button type="button" onclick="sendForm()">שלח פנייה 🚀</button>\n  <button type="reset" class="btn-reset">נקה טופס 🧹</button>\n</div>\n\n<script>\n  function sendForm() {\n    var name = document.getElementById('Input1').value;\n    var msg = document.getElementById('Textarea1').value;\n    alert('תודה ' + name + '! הפנייה שלך התקבלה: ' + msg);\n  }\n</script>`,
      steps: [
        'בתחתית ה-<form>, הקלד <div class="btn-row"> עם כפתור שליחה onclick="sendForm()" וכפתור איפוס <button type="reset">נקה טופס 🧹</button>.',
        'בתוך ה-<script>, הקלד את הפונקציה sendForm() שקוראת את השם וההודעה ומקפיצה אישור ב-alert.',
        'מלא את השדות בתצוגה החיה, לחץ על "שלח פנייה" ואז על "נקה טופס" ובדוק שהכול פועל!'
      ],
      selfExplain: 'כפתור עם type="reset" בתוך <form> מנקה אוטומטית את כל השדות בלחיצה!'
    },
    5: {
      title: 'שלב 5: עיצוב הטופס, השדות והכפתורים ב-<style> (🎨)',
      summary: 'מוסיפים את כרטיסיית שעות הפעילות ומעצבים לעומק את שדות הטופס והכפתורים ב-<style>.',
      codeExample: `  form input, form textarea {\n    width: 85%;\n    padding: 12px;\n    margin: 8px 0;\n    border-radius: 12px;\n    border: 2px solid #cbd5e1;\n    font-family: sans-serif;\n  }\n  .btn-reset {\n    background: #e2e8f0;\n    color: #1e293b;\n  }`,
      steps: [
        'מתחת לכרטיסיית הטופס ב-<body>, הקלד כרטיסייה שנייה עם רשימת <ul> של 3 שורות שעות הפעילות ופרטי הקשר מה-AI בשלב 4.',
        'בתוך ה-<style>, הגדר ל-form input, form textarea רוחב אחיד (width: 85%;), ריווח, פינות עגולות ומסגרת צבעונית.'
      ],
      selfExplain: 'עצב את כפתור "שלח פנייה" בגרדיאנט בולט ואת "נקה טופס" בצבע בהיר ועדין!'
    },
    6: {
      title: 'שלב 6: שמירת הקובץ contact.html במחשב',
      summary: 'מורידים ושומרים את הקובץ contact.html בתיקיית האתר במחשב.',
      codeExample: `<!-- שמור את הקובץ בשם contact.html בתיקיית הפרויקט שלך -->`,
      steps: [
        'בדוק את עיצוב טופס יצירת הקשר בתצוגת מחשב ומובייל.',
        'הורד את הקובץ ושמור אותו בשם contact.html בתיקיית הפרויקט שלך.'
      ],
      selfExplain: 'עכשיו כל 4 עמודי האתר שלך קיימים, מעוצבים ומוכנים!',
      checklist: [
        'הקלדתי טופס (<form>) בעמוד contact.html עם שדות <input> ו-<textarea>.',
        'חיברתי כפתור שמציג את נתוני הטופס וכפתור type="reset" שמאפס את השדות.',
        'הוספתי כרטיסיית שעות פעילות ועיצבתי את הטופס ב-<style>.',
        'שמרתי את הקובץ contact.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 21: חיבור האתר ל-WhatsApp אמיתי ושיחת טלפון מהירה
  // --------------------------------------------------------------------------
  21: {
    2: {
      title: 'שלב 2: חיבור הטופס לשליחת הודעה ישירות ל-WhatsApp ב-<script>',
      summary: 'מקלידים כפתור ופונקציית JavaScript שלוקחת את השם (Input1) וההודעה (Textarea1) ופותחת שיחת WhatsApp עם הטקסט המוכן!',
      codeExample: `<!-- בתוך הטופס ב-<body>: -->\n<button type="button" class="wa-btn" onclick="sendWhatsApp()">💬 שלח פנייה בוואטסאפ</button>\n\n<!-- ב-<script>: -->\n<script>\n  function sendWhatsApp() {\n    var name = document.getElementById('Input1').value;\n    var msg = document.getElementById('Textarea1').value;\n    var text = 'שלום, אני ' + name + ': ' + msg;\n    window.open('https://wa.me/972500000000?text=' + encodeURIComponent(text), '_blank');\n  }\n</script>`,
      steps: [
        'טען את הקובץ contact.html שלך בעורך הקוד החי.',
        'בתחתית הטופס הקלד כפתור: <button type="button" class="wa-btn" onclick="sendWhatsApp()">💬 שלח פנייה בוואטסאפ</button>.',
        'בתוך ה-<script>, הקלד את הפונקציה sendWhatsApp() כפי שמופיע בדוגמה.',
        'מלא שם והודעה בתצוגה החיה ולחץ על הכפתור!'
      ],
      selfExplain: 'אפשר להחליף את המספר 972500000000 למספר שתרצה!'
    },
    3: {
      title: 'שלב 3: הוספת כרטיסיית ערוצי קשר מהירים (וואטסאפ + חיוג מהיר) בקוד',
      summary: 'מקלידים כרטיסייה עם קישור וואטסאפ ישיר וקישור חיוג טלפוני מהיר (href="tel:...").',
      codeExample: `  <div class="card">\n    <h2>מענה מהיר בוואטסאפ ובטלפון ⚡</h2>\n    <div class="btn-row">\n      <a href="https://wa.me/972500000000" target="_blank" class="wa-btn">💬 צ׳אט בוואטסאפ</a>\n      <a href="tel:0500000000" class="call-btn">📞 חיוג מהיר</a>\n    </div>\n  </div>`,
      steps: [
        'מתחת לכרטיסיית הטופס ב-<body>, הקלד כרטיסייה חדשה עם הכותרת והמשפט מה-AI בשלב 1.',
        'בתוכה הקלד <div class="btn-row"> עם קישור לוואטסאפ וקישור חיוג מהיר <a href="tel:0500000000">.'
      ],
      selfExplain: 'קישור שמתחיל ב-tel: פותח אוטומטית את החייגן כשלוחצים עליו מהטלפון!'
    },
    4: {
      title: 'שלב 4: הוספת תצוגה מקדימה של ההודעה לפני השליחה בקוד',
      summary: 'מקלידים קופסת פלט <div id="PreviewMsg"> שמראה חיווי חי בתוך הדף בעת שליחת הפנייה.',
      codeExample: `<!-- מתחת לכפתורי הטופס ב-<body>: -->\n<div id="PreviewMsg"></div>\n\n<!-- שורה נוספת בתוך הפונקציה sendWhatsApp() ב-<script>: -->\ndocument.getElementById('PreviewMsg').innerText = '✅ הפנייה נשלחה מאת: ' + name;`,
      steps: [
        'הקלד מתחת לכפתורי הטופס תגית <div id="PreviewMsg"></div>.',
        'בתוך הפונקציה sendWhatsApp() ב-<script>, הוסף שורה שמעדכנת את PreviewMsg עם שם השולח.'
      ],
      selfExplain: 'עצב את #PreviewMsg ב-<style> עם צבע ירוק עדין ומסגרת!'
    },
    5: {
      title: 'שלב 5: עיצוב כפתורי הוואטסאפ והחיוג ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את .wa-btn בירוק וואטסאפ רשמי (#16a34a) ואת .call-btn בכחול בולט עם צללית ואפקט ריחוף.',
      codeExample: `  .wa-btn {\n    background: #16a34a;\n    color: white;\n    padding: 12px 22px;\n    border-radius: 12px;\n    text-decoration: none;\n    font-weight: bold;\n    border: none;\n    cursor: pointer;\n    transition: 0.3s;\n  }\n  .call-btn {\n    background: #2563eb;\n    color: white;\n    padding: 12px 22px;\n    border-radius: 12px;\n    text-decoration: none;\n    font-weight: bold;\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב ל-.wa-btn עם צבע רקע ירוק (#16a34a) וטקסט לבן.',
        'הקלד עיצוב ל-.call-btn עם צבע משלים, פינות עגולות ואפקט :hover.'
      ],
      selfExplain: 'הוסף צללית ירוקה עדינה ל-.wa-btn כדי שיבלוט בעמוד!'
    },
    6: {
      title: 'שלב 6: בדיקה במובייל ושמירת הקובץ contact.html',
      summary: 'בודקים איך כפתורי הוואטסאפ והחיוג מסתדרים במסך סמארטפון ושומרים את הקובץ.',
      codeExample: `<!-- בדוק ב-📱 מובייל ושמור את contact.html המעודכן -->`,
      steps: [
        'עבור לתצוגת "📱 מובייל" וודא שהכפתורים רחבים ונוחים ללחיצה.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור את contact.html המעודכן במחשב.'
      ],
      selfExplain: 'הטופס שלך מחובר עכשיו ישירות ל-WhatsApp!',
      checklist: [
        'חיברתי את הטופס לפונקציית sendWhatsApp() ב-<script>.',
        'הקלדתי כרטיסייה עם כפתור וואטסאפ ישיר וכפתור חיוג מהיר (tel:).',
        'עיצבתי את הכפתורים ב-<style>.',
        'שמרתי את הקובץ contact.html במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 22: פיתוח מיני-אפליקציה באתר (חלק א׳: אפיון ובניית ממשק המשתמש)
  // --------------------------------------------------------------------------
  22: {
    2: {
      title: 'שלב 2: הקמת כרטיסיית המיני-אפליקציה והכותרת שלה בקוד',
      summary: 'מקלידים ב-<body> קופסת <div class="card app-box"> עבור המיני-אפליקציה שלנו.',
      codeExample: `  <div class="card app-box">\n    <span class="badge">⚡ כלי חכם אונליין</span>\n    <h2>שם המיני-אפליקציה מה-AI</h2>\n    <p>הזינו את הנתונים למטה וקבלו המלצה מותאמת אישית!</p>\n  </div>`,
      steps: [
        'פתח את הקובץ index.html שלך בעורך הקוד החי.',
        'הקלד ב-<body> קופסה חדשה <div class="card app-box">...</div>.',
        'הקלד בראשה <span class="badge">⚡ כלי חכם אונליין</span>, כותרת <h2> עם שם המיני-אפליקציה מה-AI בשלב 1, ופסקה <p> קצרה.'
      ],
      selfExplain: 'בחר שם מגניב למיני-אפליקציה שלך שמתאים לנושא האתר!'
    },
    3: {
      title: 'שלב 3: הוספת שדות הקלט של המיני-אפליקציה (AppInput1, AppSelect1, AppSlider1) בקוד',
      summary: 'מקלידים בתוך .app-box את שלושת רכיבי הקלט של המיני-אפליקציה עם מזהי id ברורים.',
      codeExample: `    <input id="AppInput1" placeholder="הקלד כאן..."><br><br>\n    <select id="AppSelect1">\n      <option>אפשרות 1</option>\n      <option>אפשרות 2</option>\n      <option>אפשרות 3</option>\n    </select><br><br>\n    <input type="range" id="AppSlider1" min="1" max="100" value="50">`,
      steps: [
        'בתוך כרטיסיית .app-box, הקלד שדה קלט ראשון: <input id="AppInput1" placeholder="...">.',
        'מתחתיו הקלד תפריט בחירה: <select id="AppSelect1"> עם 4 אפשרויות <option> מה-AI.',
        'מתחתיו הקלד סליידר: <input type="range" id="AppSlider1" min="1" max="100" value="50">.'
      ],
      selfExplain: 'הקפד על שמות ה-id המדויקים (AppInput1, AppSelect1, AppSlider1) – נשתמש בהם בשיעור הבא!'
    },
    4: {
      title: 'שלב 4: הוספת כפתור הפעלה וקופסת מסך התוצאה (AppOutput) בקוד',
      summary: 'מקלידים את כפתור ההפעלה ואת מסך הפלט <div id="AppOutput"> שבו תוצג התוצאה.',
      codeExample: `    <div class="btn-row">\n      <button onclick="runMyApp()">🚀 חשב והצג תוצאה!</button>\n    </div>\n    <div id="AppOutput">\n      הזינו את הנתונים למעלה ולחצו על הכפתור לקבלת התוצאה...\n    </div>`,
      steps: [
        'מתחת לסליידר ב-.app-box, הקלד כפתור: <button onclick="runMyApp()">🚀 חשב והצג תוצאה!</button>.',
        'מתחת לכפתור הקלד קופסת תוצאה: <div id="AppOutput">הזינו את הנתונים למעלה ולחצו על הכפתור...</div>.'
      ],
      selfExplain: 'מיד בשלב 5 נעצב את המיני-אפליקציה ואת מסך ה-#AppOutput ב-<style>!'
    },
    5: {
      title: 'שלב 5: עיצוב המיני-אפליקציה כמכשיר הייטקיסטי ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את .app-box ואת מסך התוצאה #AppOutput כך שייראה כמו מסך דיגיטלי יוקרתי.',
      codeExample: `  .app-box {\n    border: 3px solid #2563eb;\n    border-radius: 24px;\n    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.15);\n  }\n  #AppOutput {\n    margin-top: 16px;\n    padding: 18px;\n    background: #0f172a;\n    color: #38bdf8;\n    border-radius: 14px;\n    font-size: 18px;\n    font-weight: bold;\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב ל-.app-box עם מסגרת בעובי 3px, עיגול פינות 24px וצללית מודגשת.',
        'הקלד עיצוב ל-#AppOutput עם רקע כהה (#0f172a) וצבע כתב תכלת/ירוק זוהר (#38bdf8) כמו מסך דיגיטלי!'
      ],
      selfExplain: 'תוכל לבחור למסך הדיגיטלי #AppOutput כל צבע טקסט ומסגרת זוהרת שאתה אוהב!'
    },
    6: {
      title: 'שלב 6: שמירת הקובץ לקראת חיבור המוח של האפליקציה במפגש הבא',
      summary: 'שומרים את ממשק המיני-אפליקציה המעוצב בקובץ ה-HTML.',
      codeExample: `<!-- ודא שהמזהים AppInput1, AppSelect1, AppSlider1 ו-AppOutput מופיעים בקוד ושמור -->`,
      steps: [
        'ודא שהמזהים AppInput1, AppSelect1, AppSlider1 ו-AppOutput כתובים נכון בקוד.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'הממשק של המיני-אפליקציה שלך מוכן ומעוצב!',
      checklist: [
        'אפיינתי מיני-אפליקציה מקורית עם ה-AI.',
        'הקלדתי בקוד את 3 שדות הקלט (AppInput1, AppSelect1, AppSlider1).',
        'הוספתי כפתור הפעלה וקופסת תוצאה (#AppOutput) בעיצוב מסך דיגיטלי ב-<style>.',
        'הורדתי ושמרתי את הקובץ במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 23: פיתוח מיני-אפליקציה באתר (חלק ב׳: חיבור הלוגיקה והתוצאות החיות)
  // --------------------------------------------------------------------------
  23: {
    2: {
      title: 'שלב 2: כתיבת פונקציית runMyApp() ב-<script> להצגת התוצאה החיה',
      summary: 'מקלידים ב-<script> את הפונקציה שקוראת את AppInput1, AppSelect1 ו-AppSlider1 ומציגה את התוצאה ב-AppOutput.',
      codeExample: `<script>\n  function runMyApp() {\n    var v1 = document.getElementById('AppInput1').value;\n    var v2 = document.getElementById('AppSelect1').value;\n    var v3 = document.getElementById('AppSlider1').value;\n    document.getElementById('AppOutput').innerText =\n      '🎯 התוצאה עבור ' + v1 + ': מסלול ' + v2 + ' בעוצמה/תקציב ' + v3 + '!';\n  }\n</script>`,
      steps: [
        'טען את הקובץ עם ממשק המיני-אפליקציה ממפגש 22 בעורך הקוד החי.',
        'בתוך תגית ה-<script> בסוף הקוד, הקלד את הפונקציה runMyApp() כפי שמופיע בדוגמה.',
        'התאם את משפט התוצאה לנוסחה שיצרת ב-AI בשלב 1.',
        'הזן נתונים ב-3 השדות בתצוגה החיה ולחץ על "🚀 חשב והצג תוצאה!" כדי לראות את הקסם פועל!'
      ],
      selfExplain: 'אפשר לבצע גם חישוב מתמטי (למשל v3 * 10) ולהציג מחיר או ציון מחושב!'
    },
    3: {
      title: 'שלב 3: הוספת כפתור "🔄 בדיקה חדשה / איפוס תוצאה" בקוד',
      summary: 'מקלידים לצד כפתור ההפעלה כפתור שני שמנקה את מסך התוצאה לבדיקה חדשה.',
      codeExample: `<!-- בתוך .btn-row במיני-אפליקציה: -->\n<button onclick="resetApp()" class="btn-reset">🔄 איפוס תוצאה</button>\n\n<!-- בתוך ה-<script>: -->\nfunction resetApp() {\n  document.getElementById('AppOutput').innerText = 'המערכת מוכנה לבדיקה חדשה...';\n}`,
      steps: [
        'לצד כפתור ההפעלה של המיני-אפליקציה ב-<body>, הקלד כפתור שני: <button onclick="resetApp()">🔄 איפוס תוצאה</button>.',
        'בתוך ה-<script>, הקלד את הפונקציה resetApp() שמחזירה את הטקסט של AppOutput למצב התחלתי.',
        'נסה להריץ חישוב במיני-אפליקציה ואז ללחוץ על כפתור האיפוס!'
      ],
      selfExplain: 'כפתור איפוס נותן למיני-אפליקציה שלך תחושה של אפליקציה אמיתית!'
    },
    4: {
      title: 'שלב 4: הוספת כפתור "📲 שלח את התוצאה שלי בוואטסאפ" בקוד',
      summary: 'מאפשרים לגולש לשלוח את התוצאה שקיבל במיני-אפליקציה ישירות לוואטסאפ!',
      codeExample: `<!-- מתחת ל-AppOutput ב-<body>: -->\n<button class="wa-btn" onclick="shareAppResult()">📲 שלח את התוצאה שלי בוואטסאפ</button>\n\n<!-- בתוך ה-<script>: -->\nfunction shareAppResult() {\n  var res = document.getElementById('AppOutput').innerText;\n  window.open('https://wa.me/972500000000?text=' + encodeURIComponent(res), '_blank');\n}`,
      steps: [
        'מתחת לקופסת התוצאה AppOutput ב-<body>, הקלד כפתור onclick="shareAppResult()".',
        'בתוך ה-<script>, הקלד את הפונקציה shareAppResult() שקוראת את הטקסט מתוך AppOutput ושולחת אותו לוואטסאפ!'
      ],
      selfExplain: 'עכשיו כל גולש יכול לשתף את התוצאה שיצאה לו במיני-אפליקציה שלך!'
    },
    5: {
      title: 'שלב 5: ליטוש עיצוב הכפתורים ומסך הפלט ב-<style> (🎨)',
      summary: 'מוסיפים עיצוב מדורג לכפתור ההפעלה ומסגרת זוהרת למסך התוצאה #AppOutput ב-<style>.',
      codeExample: `  #AppOutput {\n    border: 2px solid #38bdf8;\n    box-shadow: 0 4px 16px rgba(56, 189, 248, 0.25);\n  }`,
      steps: [
        'בתוך ה-<style>, הוסף ל-#AppOutput מסגרת זוהרת וצללית צבעונית.',
        'ודא שקופסת התוצאה והכפתורים נראים מצוין גם בתצוגת "📱 מובייל".'
      ],
      selfExplain: 'עצב את המיני-אפליקציה שלך כך שתהיה גולת הכותרת של דף הבית!'
    },
    6: {
      title: 'שלב 6: בדיקה מלאה ושמירת הקובץ במחשב',
      summary: 'מבצעים 3 בדיקות שונות במיני-אפליקציה ושומרים את הקובץ.',
      codeExample: `<!-- בדוק 3 שילובים שונים של נתונים במיני-אפליקציה ושמור את הקובץ -->`,
      steps: [
        'הזן 3 שילובים שונים של נתונים במיני-אפליקציה ובדוק שהתוצאה מתעדכנת בכל פעם.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'כל הכבוד! פיתחת ועיצבת מיני-אפליקציה אינטראקטיבית שלמה ב-HTML, CSS ו-JavaScript!',
      checklist: [
        'כתבתי את הפונקציה runMyApp() ב-<script> להצגת 3 השדות ב-AppOutput.',
        'הוספתי כפתור איפוס תוצאה וכפתור שיתוף התוצאה בוואטסאפ.',
        'בדקתי שהמיני-אפליקציה פועלת בזמן אמת ומעוצבת ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 24: בדיקות שמישות (User Testing) ושדרוג חוויית המשתמש עם AI
  // --------------------------------------------------------------------------
  24: {
    1: {
      title: 'שלב 1: ביצוע מבדק משתמשים (User Testing) עם חבר לכיתה',
      summary: 'נותנים לחבר לכיתה להתנסות באתר ובמיני-אפליקציה שלנו בלי להסביר לו מראש ורושמים מה לשפר.',
      codeExample: `<!-- תן לחבר לגלוש באתר שלך ולהפעיל את המיני-אפליקציה -->`,
      steps: [
        'פתח את האתר שלך בעורך הקוד החי (או בדפדפן).',
        'בקש מחבר לכיתה לגלוש באתר שלך במשך 5 דקות: להפעיל את המיני-אפליקציה ולמלא את טופס צור קשר.',
        'רשום 2 דברים שהוא אהב בעיצוב ו-2 דברים שבהם הוא התלבט או שאפשר לשפר.'
      ],
      selfExplain: 'בדיקת משתמשים אמיתית מגלה לנו מיד אילו כפתורים או עיצובים כדאי לחדד!'
    },
    3: {
      title: 'שלב 3: הוספת מדריך 3 צעדים בראש המיני-אפליקציה בקוד',
      summary: 'מקלידים 3 תגיות שלבים (1️⃣, 2️⃣, 3️⃣) בראש המיני-אפליקציה לחוויית שימוש ברורה.',
      codeExample: `    <div class="btn-row">\n      <span class="badge">1️⃣ הזינו פרטים</span>\n      <span class="badge">2️⃣ בחרו העדפות</span>\n      <span class="badge">3️⃣ קבלו תוצאה מיד!</span>\n    </div>`,
      steps: [
        'בראש כרטיסיית המיני-אפליקציה (.app-box), מתחת לכותרת <h2>, הקלד <div class="btn-row">.',
        'הקלד לתוכו 3 תגיות <span class="badge">: "1️⃣ הזינו פרטים", "2️⃣ בחרו העדפות", "3️⃣ קבלו תוצאה מיד!".',
        'בעמוד צור קשר (contact.html), הוסף מתחת לטופס תגית <span> עם משפט האמון והפרטיות מה-AI בשלב 2.'
      ],
      selfExplain: 'שלוש תגיות קצרות ומעוצבות מסבירות לכל גולש בשנייה איך להשתמש באפליקציה שלך!'
    },
    4: {
      title: 'שלב 4: בדיקת שדות ריקים (if) ושיפור טקסטי הרמז (placeholder) בקוד',
      summary: 'משפרים את ה-placeholder בשדות הקלט ומוסיפים בדיקה ב-<script> אם השדה ריק.',
      codeExample: `  if (!v1) {\n    alert('נא להקליד שם או ערך בשדה הראשון!');\n    return;\n  }`,
      steps: [
        'עבור על שדות ה-<input> במיני-אפליקציה וודא שבכל placeholder יש דוגמה ברורה.',
        'בתחילת הפונקציה runMyApp() ב-<script>, הקלד בדיקת if (!v1) שמקפיצה תזכורת אם המשתמש שכח להקליד בשדה הראשון!'
      ],
      selfExplain: 'בדיקת קלט (Validation) מונעת הצגת תוצאה חסרה!'
    },
    5: {
      title: 'שלב 5: ליטוש העיצוב ב-<style> (🎨) ובדיקה ב-3 המסכים',
      summary: 'מדייקים את נראות המיני-אפליקציה והטפסים במחשב, בטאבלט ובמובייל.',
      codeExample: `  .badge {\n    padding: 6px 14px;\n    border-radius: 999px;\n    background: #dbeafe;\n    color: #1e40af;\n  }`,
      steps: [
        'בדוק את המיני-אפליקציה בתצוגת "📱 מובייל" וודא ש-3 תגיות השלבים והכפתורים מסתדרים יפה.',
        'התאם ב-<style> את הריווח (padding), המסגרות והצלליות במידת הצורך.'
      ],
      selfExplain: 'וודא שהכול קריא, מרווח ונעים לעין!'
    },
    6: {
      title: 'שלב 6: שמירת קובצי סיום רבעון ג׳ במחשב',
      summary: 'שומרים את כל קובצי האתר המעודכנים בסיום רבעון ג׳.',
      codeExample: `<!-- סיום רבעון ג׳ בהצלחה! הורד ושמור את הקבצים המעודכנים -->`,
      steps: [
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור את הקבצים המעודכנים במחשב.'
      ],
      selfExplain: 'סיימת את רבעון ג׳! ברבעון ד׳ נכין את פרויקט הגמר השנתי!',
      checklist: [
        'ביצעתי בדיקת משתמשים הדדית עם חבר לכיתה.',
        'הקלדתי סרגל של 3 תגיות הדרכה בראש המיני-אפליקציה.',
        'שיפרתי את טקסטי הרמז (placeholder) והוספתי בדיקת קלט ב-<script>.',
        'הורדתי ושמרתי את הקבצים המעודכנים במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 25: צוללים לקוד: ארגון ושדרוג קוד ה-HTML וה-CSS שלנו
  // --------------------------------------------------------------------------
  25: {
    1: {
      title: 'שלב 1: סיור במבנה המלא של הקוד שכתבנו (<body>, <style>, <script>)',
      summary: 'סוקרים בעורך הקוד החי את 3 החלקים המרכזיים שבנינו באתר שלנו.',
      codeExample: `<body>\n  <!-- 1. מבנה ותוכן האתר (HTML) -->\n</body>\n<style>\n  /* 2. עיצוב וצבעים (CSS) */\n</style>\n<script>\n  // 3. פעולות חכמות ואינטראקטיביות (JS)\n</script>`,
      steps: [
        'טען את הקובץ index.html שלך בעורך הקוד החי.',
        'זהה בקוד שלך את 3 החלקים שבנית: 1) אזור <body> ובתוכו תגיות התוכן (<nav>, <div>, <h1>, <p>, <button>, <footer>), 2) אזור <style> עם חוקי ה-CSS, 3) אזור <script> עם פונקציות ה-JavaScript.'
      ],
      selfExplain: 'שילוב של HTML + CSS + JS הוא הבסיס של כל אתר אינטרנט בעולם!'
    },
    3: {
      title: 'שלב 3: ארגון הקוד עם הערות מסודרות ועדכון טקסטים בקוד',
      summary: 'מקלידים הערות סדר בקוד (<!-- ... -->) כדי לחלק את ה-<body> וה-<style> לאזורים ברורים.',
      codeExample: `  <!-- ====== אזור הפתיחה (Hero) ====== -->\n  <div class="card hero-card">...</div>\n\n  <!-- ====== אזור המיני-אפליקציה ====== -->\n  <div class="card app-box">...</div>`,
      steps: [
        'בתוך ה-<body>, הקלד שורות הערה <!-- שם האזור --> מעל כל אזור מרכזי בדף (סרגל ניווט, אזור Hero, כרטיסיות, מיני-אפליקציה, פוטר).',
        'בדוק שהתצוגה החיה מתעדכנת בזמן אמת ושההערות עוזרות לך להתמצא בקוד בקלות!'
      ],
      selfExplain: 'הערות בקוד עוזרות לכל מתכנת להבין מיד איפה נמצא כל חלק בדף!'
    },
    4: {
      title: 'שלב 4: כתיבת כרטיסייה חדשה בקוד HTML לפי הצעת ה-AI',
      summary: 'מקלידים ב-<body> את התגית או הכרטיסייה החדשה שה-AI הציע לנו בשלב 2.',
      codeExample: `  <div class="card">\n    <h2>✨ פיצ׳ר חדש באתר [SITE_NAME]</h2>\n    <p>התוכן החדש שהוספתי בעצמי בקוד HTML!</p>\n  </div>`,
      steps: [
        'בעורך הקוד, מצא את תגית ה-<footer> בתחתית ה-<body>.',
        'מעל ה-<footer>, הקלד קופסת <div class="card"> חדשה עם הכותרת והתוכן שה-AI הציע לך בשלב 2.'
      ],
      selfExplain: 'שלב בכרטיסייה החדשה כל תגית שלמדת (תמונה, רשימה או כפתור)!'
    },
    5: {
      title: 'שלב 5: עיצוב הכרטיסייה החדשה בתגית <style> (🎨)',
      summary: 'מוסיפים עיצוב ייחודי לכרטיסייה החדשה שבנינו בתוך ה-<style>.',
      codeExample: `  .card:hover {\n    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);\n  }`,
      steps: [
        'בתוך ה-<style>, הוסף לכרטיסייה החדשה שיצרת רקע מדורג או מסגרת צבעונית ואפקט :hover.',
        'צפה בתוצאה החיה מיד בצד שמאל של העורך!'
      ],
      selfExplain: 'שחק עם הגדרות ה-CSS ובחר את המראה שאתה הכי אוהב!'
    },
    6: {
      title: 'שלב 6: שמירת הקובץ המעודכן במחשב',
      summary: 'שומרים את הקובץ המאורגן והמעודכן במחשב.',
      codeExample: `<!-- הורד ושמור את index.html המעודכן במחשב -->`,
      steps: [
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'הקוד שלך עכשיו מסודר, קריא ומקצועי!',
      checklist: [
        'סקרתי את 3 החלקים של מסמך הקוד (<body>, <style>, <script>).',
        'הוספתי הערות ארגון בקוד ה-HTML.',
        'הקלדתי ועיצבתי כרטיסייה חדשה בקוד.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 26: יצירת רכיבי עלית בקוד: טבלת השוואת חבילות וסרגלי התקדמות
  // --------------------------------------------------------------------------
  26: {
    2: {
      title: 'שלב 2: בניית ושילוב טבלת השוואת החבילות (<table>) בקוד',
      summary: 'מקלידים ב-<body> את קוד הטבלה (<table>, <tr>, <th>, <td>) להשוואת מסלולים/חבילות באתר.',
      codeExample: `  <div class="card">\n    <h2>📊 השוואת המסלולים שלנו</h2>\n    <table>\n      <tr>\n        <th>מסלול</th>\n        <th>מה כלול?</th>\n        <th>מחיר</th>\n      </tr>\n      <tr>\n        <td>בסיסי</td>\n        <td>גישה רגילה ✔️</td>\n        <td>חינם</td>\n      </tr>\n      <tr>\n        <td>VIP 👑</td>\n        <td>הכול כלול + בונוסים ✔️</td>\n        <td>49 ₪</td>\n      </tr>\n    </table>\n  </div>`,
      steps: [
        'פתח את index.html או gallery.html בעורך הקוד החי.',
        'הקלד ב-<body> כרטיסייה חדשה ובתוכה בנה טבלת <table> עם שורות <tr>, כותרות <th> ותאים <td> לפי התוכן מה-AI בשלב 1.',
        'בדוק שטבלת ההשוואה מוצגת בבירור בתצוגה המקדימה!'
      ],
      selfExplain: 'תוכל להוסיף עוד שורות <tr> לטבלה עבור מסלולים או מוצרים נוספים!'
    },
    4: {
      title: 'שלב 4: הוספת כרטיסיית סרגלי ההתקדמות (Progress Bars) בקוד',
      summary: 'מקלידים ב-<body> כרטיסיית מדדי איכות עם סרגלי אחוזים צבעוניים.',
      codeExample: `  <div class="card">\n    <h2>📈 מדדי האיכות שלנו</h2>\n    <p>איכות ושירות – 98%</p>\n    <div class="bar-bg"><div class="bar-fill" style="width: 98%;"></div></div>\n    <p>מהירות וחדשנות – 95%</p>\n    <div class="bar-bg"><div class="bar-fill" style="width: 95%;"></div></div>\n  </div>`,
      steps: [
        'הקלד ב-<body> כרטיסייה חדשה עבור סרגלי ההתקדמות.',
        'הקלד בה קופסת רקע <div class="bar-bg"> ובתוכה פס מילוי <div class="bar-fill" style="width: 98%;"></div> עבור כל מדד.'
      ],
      selfExplain: 'שנה את האחוזים ב-width: 98% לכל אחוז שמתאים למדדים שלך!'
    },
    5: {
      title: 'שלב 5: עיצוב הטבלה וסרגלי ההתקדמות ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את גבולות הטבלה (table, th, td) ואת הצבעים של סרגלי ההתקדמות.',
      codeExample: `  table {\n    width: 100%;\n    border-collapse: collapse;\n    margin-top: 12px;\n  }\n  th, td {\n    border: 1px solid #cbd5e1;\n    padding: 12px;\n  }\n  th { background: #2563eb; color: white; }\n  .bar-bg {\n    background: #e2e8f0;\n    border-radius: 999px;\n    height: 16px;\n    overflow: hidden;\n  }\n  .bar-fill {\n    background: linear-gradient(90deg, #2563eb, #10b981);\n    height: 100%;\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב ל-table, th, td כדי שהטבלה תיראה יוקרתית ומסודרת.',
        'הקלד עיצוב ל-.bar-bg ול-.bar-fill עם רקע מדורג צבעוני.'
      ],
      selfExplain: 'בחר לכותרות הטבלה (th) ולסרגלי ההתקדמות את צבעי המותג שלך!'
    },
    6: {
      title: 'שלב 6: בדיקה במובייל ושמירת הקובץ',
      summary: 'מוודאים שהטבלה וסרגלי ההתקדמות רספונסיביים ושומרים את הקובץ.',
      codeExample: `<!-- בדוק את הטבלה וסרגלי האחוזים ב-📱 מובייל ושמור -->`,
      steps: [
        'בדוק את העמוד בתצוגת "📱 מובייל" ו-"📟 טאבלט".',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור במחשב.'
      ],
      selfExplain: 'הוספת ועיצבת באתר שלך שני רכיבי UI מתקדמים ביותר!',
      checklist: [
        'בניתי ושילבתי טבלת השוואת חבילות (<table>) באתר.',
        'הוספתי סרגלי התקדמות ומדדי איכות צבעוניים.',
        'עיצבתי אותם ב-<style> ושמרתי את הקובץ במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 27: קסמים ב-JavaScript בעזרת AI (הגרלה אקראית ושעון חי)
  // --------------------------------------------------------------------------
  27: {
    1: {
      prompt: 'אני כותב פונקציית JavaScript באתר "[SITE_NAME]" בתחום [SITE_TOPIC].\nבאתר יש קופסת פלט עם מזהה id="RandomBox".\nכתוב לי פונקציית JavaScript קצרה בשם pickRandomTip() שמגרילה באופן אקראי אחד מתוך 5 משפטי אתגר/טיפים/עובדות מגניבים בתחום [SITE_TOPIC] ומציגה אותו בתוך document.getElementById(\'RandomBox\').innerText!'
    },
    2: {
      title: 'שלב 2: בניית מכונת ההגרלה באתר עם <script> ו-RandomBox',
      summary: 'מקלידים ב-<body> כרטיסיית הגרלה עם כפתור וקופסת פלט RandomBox, וכותבים את פונקציית ההגרלה ב-<script>.',
      codeExample: `<!-- ב-<body>: -->\n<div class="card">\n  <h2>🎲 גלגל המזל / הטיפ היומי של האתר</h2>\n  <div class="btn-row">\n    <button onclick="pickRandomTip()">🎰 לחץ להגרלה אקראית!</button>\n  </div>\n  <div id="RandomBox">לחצו על הכפתור להגרלת טיפ!</div>\n</div>\n\n<!-- ב-<script>: -->\n<script>\n  function pickRandomTip() {\n    var tips = ['טיפ 1 מה-AI', 'טיפ 2 מה-AI', 'טיפ 3 מה-AI', 'טיפ 4 מה-AI'];\n    var i = Math.floor(Math.random() * tips.length);\n    document.getElementById('RandomBox').innerText = '✨ ' + tips[i];\n  }\n</script>`,
      steps: [
        'טען את הקובץ index.html שלך בעורך הקוד החי.',
        'הקלד ב-<body> כרטיסייה עם כותרת <h2>🎲 גלגל המזל / הטיפ היומי</h2>, כפתור onclick="pickRandomTip()" וקופסת פלט <div id="RandomBox">.',
        'בתוך ה-<script>, הקלד את הפונקציה pickRandomTip() עם המשפטים מה-AI ולחץ על הכפתור בתצוגה החיה מספר פעמים!'
      ],
      selfExplain: 'Math.random() מגריל בכל לחיצה משפט אחר מתוך המערך tips!'
    },
    3: {
      prompt: 'כתוב לי פונקציית JavaScript קצרה בשם showLiveTime() שקוראת את התאריך והשעה הנוכחיים במחשב ומציגה אותם בעברית בתוך document.getElementById(\'RandomBox\').innerText עם ברכה קצרה של האתר "[SITE_NAME]".'
    },
    4: {
      title: 'שלב 4: הוספת כפתור שני להצגת זמן חי (showLiveTime) בקוד',
      summary: 'מקלידים לצד כפתור ההגרלה כפתור שני שמציג את התאריך והשעה הנוכחיים בתוך RandomBox.',
      codeExample: `<!-- לצד כפתור ההגרלה ב-.btn-row: -->\n<button onclick="showLiveTime()">🕒 הצג זמן אמת</button>\n\n<!-- בתוך ה-<script>: -->\nfunction showLiveTime() {\n  var now = new Date().toLocaleTimeString('he-IL');\n  document.getElementById('RandomBox').innerText = '🕒 השעה עכשיו ב-[SITE_NAME]: ' + now;\n}`,
      steps: [
        'בתוך ה-.btn-row של כרטיסיית ההגרלה, הקלד כפתור שני: <button onclick="showLiveTime()">🕒 הצג זמן אמת</button>.',
        'בתוך ה-<script>, הקלד את הפונקציה showLiveTime() כפי שמופיע בדוגמה.',
        'בדוק את שני הכפתורים בתצוגה החיה!'
      ],
      selfExplain: 'new Date().toLocaleTimeString קורא את השעון המדויק של המחשב בשנייה שלחצת!'
    },
    5: {
      title: 'שלב 5: עיצוב כרטיסיית ה-JavaScript וקופסת #RandomBox ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את קופסת הפלט #RandomBox עם גופן גדול, מסגרת צבעונית וצללית.',
      codeExample: `  #RandomBox {\n    margin-top: 14px;\n    padding: 18px;\n    background: #fef3c7;\n    color: #92400e;\n    border: 2px solid #f59e0b;\n    border-radius: 14px;\n    font-size: 20px;\n    font-weight: bold;\n  }`,
      steps: [
        'בתוך ה-<style>, תן לקופסת הפלט #RandomBox עיצוב בולט עם גופן גדול (20px), צבע רקע נעים ומסגרת בעובי 2px.'
      ],
      selfExplain: 'בחר ל-#RandomBox כל שילוב צבעים וגרדיאנט שאתה אוהב!'
    },
    6: {
      title: 'שלב 6: בדיקה ושמירת הקובץ המעודכן',
      summary: 'בודקים את פעולת קוד ה-JavaScript ושומרים את הקובץ במחשב.',
      codeExample: `<!-- בדוק שלחיצה חוזרת על כפתור ההגרלה מחליפה בין המשפטים ושמור -->`,
      steps: [
        'בדוק שלחיצה חוזרת על כפתור ההגרלה מחליפה בין המשפטים השונים.',
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ index.html" ושמור במחשב.'
      ],
      selfExplain: 'שילבת באתר שלך הגרלה אקראית ושעון זמן אמת ב-JavaScript!',
      checklist: [
        'כתבתי פונקציית הגרלה אקראית pickRandomTip() ב-<script>.',
        'כתבתי פונקציית הצגת זמן אמת showLiveTime() ב-<script>.',
        'עיצבתי את קופסת הפלט #RandomBox ב-<style>.',
        'הורדתי ושמרתי את הקובץ המעודכן במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 28: קידום אתרים בגוגל (SEO), נגישות ובדיקת איכות מקיפה
  // --------------------------------------------------------------------------
  28: {
    2: {
      title: 'שלב 2: בדיקת היררכיית כותרות תקנית (h1 -> h2 -> h3) בקוד',
      summary: 'מוודאים שבראש ה-<body> יש כותרת <h1> ראשית אחת וכותרות משנה מסודרות <h2> ו-<h3>.',
      codeExample: `  <h1>[SITE_NAME] - כותרת ה-SEO הראשית מה-AI</h1>\n  ...\n  <p class="seo-text">פסקת הסיכום עם מילות המפתח מה-AI...</p>`,
      steps: [
        'טען את index.html בעורך הקוד החי.',
        'בדוק שהכותרת הראשית בראש העמוד מוגדרת כ-<h1> וכוללת את מילות המפתח מה-AI בשלב 1.',
        'בדוק שכותרות האזורים הבאים מוגדרות כ-<h2> וכותרות הכרטיסיות הפנימיות כ-<h3>.',
        'הקלד מעל ה-<footer> את פסקת ה-SEO שיצרת בשלב 1.'
      ],
      selfExplain: 'מנועי חיפוש כמו גוגל סורקים קודם כול את תגית ה-<h1> כדי להבין על מה האתר!'
    },
    3: {
      title: 'שלב 3: בדיקת ניגודיות צבעים ונגישות ב-<style> (🎨)',
      summary: 'מוודאים ב-<style> שכל טקסט וכפתור באתר קריאים בבירור ושגודל הגופן נוח לקריאה.',
      codeExample: `  p, li {\n    font-size: 16px;\n    line-height: 1.6;\n  }`,
      steps: [
        'בתוך ה-<style>, ודא שעל רקע בהיר צבע הכתב כהה וחד, ועל רקע כהה צבע הכתב לבן או בהיר מאוד.',
        'ודא שגודל הגופן של פסקאות הטקסט (p, li) הוא לפחות 16px עם גובה שורה line-height: 1.6.'
      ],
      selfExplain: 'אתר נגיש הוא אתר שנוח וברור לקריאה עבור כל גולש!'
    },
    4: {
      title: 'שלב 4: הוספת כפתור "♿ מצב קריאה נוח / טקסט מוגדל" בקוד',
      summary: 'מקלידים בסרגל מצבי התצוגה כפתור נגישות שמגדיל את הכתב ומפעיל ניגודיות גבוהה.',
      codeExample: `<button class="pill-btn" onclick="document.body.style.fontSize='20px'; document.body.style.background='#ffffff'; alert('הופעל מצב קריאה נגיש!');">\n  ♿ מצב קריאה נוח\n</button>`,
      steps: [
        'בתוך סרגל מצבי התצוגה בראש ה-<body>, הקלד כפתור "♿ מצב קריאה נוח" כמו בדוגמה למעלה.',
        'לחץ עליו בתצוגה החיה ובדוק שהכתב גדל והרקע הופך ללבן נקי!'
      ],
      selfExplain: 'בלחיצה אחת הגולש יכול להגדיל את הכתב בכל האתר!'
    },
    5: {
      title: 'שלב 5: בדיקת ניקיון ותקינות קוד ה-HTML וה-<style>',
      summary: 'סוקרים את הקוד בעורך ומוודאים שכל תגית שנפתחה גם נסגרת כראוי ושאין תגיות ריקות.',
      codeExample: `<!-- ודא שכל <div> נסגר ב-</div> ושהקוד מסודר ונקי -->`,
      steps: [
        'עבור על הקוד בעורך הקוד החי ובדוק שכל תגית שנפתחה נסגרת כראוי.',
        'מחק תגיות ריקות או מיותרות שנשארו בטעות.'
      ],
      selfExplain: 'קוד נקי ומסודר מונע באגים בעיצוב!'
    },
    6: {
      title: 'שלב 6: שמירת קובצי האתר במחשב',
      summary: 'שומרים את העמודים לאחר שדרוג ה-SEO והנגישות.',
      codeExample: `<!-- הורד ושמור את הקבצים המעודכנים בתיקיית האתר שלך -->`,
      steps: [
        'לחץ על "📂 קובץ וייצוא" ⬅️ "📥 הורד קובץ" ושמור את הקבצים המעודכנים בתיקייה שלך.'
      ],
      selfExplain: 'האתר שלך עומד עכשיו גם בסטנדרטים של SEO ונגישות!',
      checklist: [
        'עדכנתי כותרות <h1> ו-<h2> עם מילות מפתח ל-SEO בעזרת ה-AI.',
        'בדקתי ניגודיות צבעים וגודל גופן נגיש ב-<style>.',
        'הקלדתי כפתור מצב קריאה נגיש בדף הבית.',
        'הורדתי ושמרתי את הקבצים המעודכנים במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 29: מרתון פרויקט גמר (חלק א׳): אינטגרציה, השלמת תוצרי AI וליטוש עיצובי
  // --------------------------------------------------------------------------
  29: {
    2: {
      title: 'שלב 2: בדיקה וליטוש עיצובי מלא של דף הבית (index.html)',
      summary: 'טוענים את דף הבית בעורך הקוד החי ומוודאים שכל האזורים והמיני-אפליקציה פועלים ומעוצבים בשלמות.',
      codeExample: `<!-- בדיקת index.html: ניווט, לוגו, Hero, כרטיסיות, וידאו, מיני-אפליקציה ופוטר -->`,
      steps: [
        'טען את index.html בעורך הקוד החי.',
        'בדוק את עיצוב סרגל הניווט, הלוגו, באנר ה-Hero, שורת 3 הכרטיסיות, סרטון הווידאו והמיני-אפליקציה.',
        'בצע כל ליטוש עיצובי ב-<style> ושמור את index.html מחדש.'
      ],
      selfExplain: 'הוסף את משפט המחץ האחרון שקיבלת מה-AI בשלב 1 בראש דף הבית!'
    },
    3: {
      title: 'שלב 3: בדיקה וליטוש עיצובי מלא של עמוד האודות (about.html)',
      summary: 'טוענים את עמוד האודות ומוודאים שדמות ה-AI, המונים וההמלצות מעוצבים באותה פלטת צבעים.',
      codeExample: `<!-- בדיקת about.html: אווטאר עגול, סיפור המותג, מוני הצלחה והמלצות -->`,
      steps: [
        'טען את about.html בעורך הקוד החי.',
        'ודא שסרגל הניווט <nav>, ה-<footer> וה-<style> תואמים לאלו של דף הבית.',
        'שמור את about.html המעודכן.'
      ],
      selfExplain: 'ודא שכל הקישורים בסרגל הניווט עובדים!'
    },
    4: {
      title: 'שלב 4: בדיקה וליטוש עיצובי מלא של עמוד הגלריה (gallery.html)',
      summary: 'מוודאים שכל תמונות הקטלוג, טבלת ההשוואה וכרטיסיית ה-VIP בעמוד הגלריה מיושרים ומעוצבים.',
      codeExample: `<!-- בדיקת gallery.html: 4 כרטיסיות קטלוג, כרטיסיית דגל ומועדון VIP -->`,
      steps: [
        'טען את gallery.html בעורך הקוד החי.',
        'בדוק שכל 4 כרטיסיות הקטלוג באותו גובה ורוחב ושכל התמונות מוצגות כראוי.',
        'שמור את gallery.html המעודכן.'
      ],
      selfExplain: 'בדוק שכל הכפתורים בגלריה מעוצבים ומגיבים ללחיצה!'
    },
    5: {
      title: 'שלב 5: בדיקה וליטוש עיצובי מלא של עמוד צור קשר (contact.html)',
      summary: 'בודקים את קוד ועיצוב טופס צור הקשר, כפתור האיפוס והשליחה לוואטסאפ.',
      codeExample: `<!-- בדיקת contact.html: טופס מלא, שליחה ל-WhatsApp וכפתור חיוג מהיר -->`,
      steps: [
        'טען את contact.html בעורך הקוד החי.',
        'בדוק את כל שדות הטופס, כפתור השליחה לוואטסאפ וכפתור איפוס הטופס.',
        'שמור את contact.html המעודכן.'
      ],
      selfExplain: 'נסה למלא פנייה לדוגמה כדי לוודא שהכול מוכן להדגמה!'
    },
    6: {
      title: 'שלב 6: גיבוי כל 4 הקבצים בתיקיית פרויקט הגמר',
      summary: 'מוודאים שכל 4 קובצי ה-HTML שמורים בתיקייה מסודרת במחשב.',
      codeExample: `<!-- תיקיית פרויקט גמר: index.html, about.html, gallery.html, contact.html -->`,
      steps: [
        'ודא שבתיקיית פרויקט הגמר שלך במחשב נמצאים כל 4 הקבצים המעודכנים מהיום.'
      ],
      selfExplain: 'פרויקט הגמר הרב-עמודי שלך מלוטש ומוכן!',
      checklist: [
        'ליטשתי ושמרתי את קוד ועיצוב דף הבית (index.html) והמיני-אפליקציה.',
        'ליטשתי ושמרתי את קוד ועיצוב עמוד האודות (about.html) ועמוד הגלריה (gallery.html).',
        'ליטשתי ושמרתי את קוד ועיצוב עמוד צור קשר (contact.html).',
        'כל קובצי פרויקט הגמר שמורים בתיקייה אחת במחשב.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 30: מרתון פרויקט גמר (חלק ב׳): תעודת זהות לפרויקט והרצה כאתר עצמאי
  // --------------------------------------------------------------------------
  30: {
    2: {
      title: 'שלב 2: הוספת כרטיסיית "מאחורי הקלעים של הפרויקט" בקוד HTML',
      summary: 'מקלידים בעמוד האודות (או בדף הבית) כרטיסייה מיוחדת שמציגה איך בנינו ועיצבנו את האתר בקוד פתוח ו-AI.',
      codeExample: `  <div class="card project-id">\n    <span class="badge">🎓 פרויקט גמר שנתי</span>\n    <h2>מאחורי הקלעים של פיתוח האתר</h2>\n    <ul>\n      <li>נבנה בקוד פתוח: HTML5, CSS3 ו-JavaScript</li>\n      <li>עיצוב ומיתוג בשילוב כלי AI מתקדמים</li>\n      <li>כולל מיני-אפליקציה חיה וחיבור ל-WhatsApp</li>\n    </ul>\n  </div>`,
      steps: [
        'טען את הקובץ about.html (או index.html) שלך בעורך הקוד החי.',
        'הקלד ב-<body> כרטיסייה חדשה <div class="card project-id"> עם תגית "🎓 פרויקט גמר שנתי" וכותרת <h2>.',
        'הקלד בתוכה רשימת <ul> עם סעיפי תעודת הזהות שיצרת ב-AI בשלב 1.'
      ],
      selfExplain: 'כתוב בגאווה אילו שפות קוד, טכניקות עיצוב וכלי AI שילבת בפרויקט שלך!'
    },
    3: {
      title: 'שלב 3: עיצוב כרטיסיית תעודת הזהות ב-<style> (🎨)',
      summary: 'מעצבים ב-<style> את .project-id עם מסגרת חגיגית, גרדיאנט וצללית.',
      codeExample: `  .project-id {\n    border: 3px solid #10b981;\n    background: linear-gradient(135deg, #ecfdf5, #eff6ff);\n  }`,
      steps: [
        'בתוך ה-<style>, הקלד עיצוב ל-.project-id עם מסגרת בולטת ורקע מדורג חגיגי.',
        'הורד ושמור שוב את הקובץ בתיקייה שלך.'
      ],
      selfExplain: 'תן לכרטיסיית תעודת הזהות מראה של תעודת הצטיינות!'
    },
    4: {
      title: 'שלב 4: בדיקת הרצה עצמאית בדפדפן (מחוץ לעורך הקוד)',
      summary: 'פותחים את האתר מהתיקייה במחשב ישירות בדפדפן ובודקים את כל המעברים והפיצ׳רים.',
      codeExample: `<!-- לחץ פעמיים על index.html בתיקייה שלך במחשב ובדוק את האתר בדפדפן! -->`,
      steps: [
        'פתח את תיקיית הפרויקט שלך במחשב ולחץ פעמיים על הקובץ index.html.',
        'בדוק בדפדפן: 1) החלפת מצבי תצוגה (יום/לילה), 2) הפעלת המיני-אפליקציה, 3) כפתור ההגרלה ב-JavaScript.',
        'לחץ על קישורי הניווט כדי לעבור ל-about.html, ל-gallery.html ול-contact.html וודא שכולם נפתחים חלק!'
      ],
      selfExplain: 'האתר שכתבת ועיצבת בקוד רץ בכל דפדפן בעולם בלי צורך בשום תוכנה נוספת!'
    },
    5: {
      title: 'שלב 5: בדיקת טעינה חוזרת לעורך הקוד החי להדגמה',
      summary: 'מוודאים שהקובץ נטען חזרה לעורך הקוד בלחיצה כדי שנוכל להציג גם את הקוד שלנו באירוע הסיום.',
      codeExample: `<!-- באירוע הסיום נציג גם את האתר החי וגם את קוד ה-HTML/CSS/JS שכתבנו! -->`,
      steps: [
        'נסה להעלות את index.html חזרה לעורך הקוד החי באמצעות "📂 קובץ וייצוא" ⬅️ "📂 העלה קובץ HTML מהמחשב" וודא שכל הקוד מופיע מיד.'
      ],
      selfExplain: 'תוכל להראות לקהל באירוע הסיום את מאות שורות הקוד והעיצוב שכתבת בעצמך!'
    },
    6: {
      title: 'שלב 6: סימון השלמת אריזת הפרויקט',
      summary: 'מסמנים את סיום אריזת פרויקט הגמר.',
      codeExample: `<!-- פרויקט הגמר מוכן ב-100% לאירוע ההשקה! 🎉 -->`,
      steps: [
        'סמן את המשימות ולחץ למטה על כפתור השלמת מפגש 30!'
      ],
      selfExplain: 'במפגש הבא נעשה חזרה גנרלית קצרה לקראת ה-Demo Day!',
      checklist: [
        'יצרתי ושילבתי בקוד את כרטיסיית תעודת הזהות של פרויקט הגמר.',
        'הרצתי ובדקתי את האתר המלא ישירות בדפדפן המחשב.',
        'וידאתי שכל הקבצים שמורים ומוכנים להצגה.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 31: חזרה גנרלית וסימולציית הגשה לקראת אירוע ההשקה (Demo Day)
  // --------------------------------------------------------------------------
  31: {
    3: {
      title: 'שלב 3: תרגול מעשי של מסלול ההדגמה בעורך הקוד החי ובדפדפן',
      summary: 'מתרגלים את המעבר החלק בין האתר בדפדפן, תצוגת המובייל והצגת קוד ה-HTML/CSS/JS שכתבנו.',
      codeExample: `<!-- סדר ההדגמה: 1. האתר החי והמיני-אפליקציה -> 2. תצוגת מובייל -> 3. הצגת הקוד והעיצוב -->`,
      steps: [
        'פתח את עורך הקוד החי וטען את דף הבית שלך (index.html).',
        'תרגל לפי הסדר: 1) הדגמת האתר והמיני-אפליקציה בתצוגה החיה, 2) לחיצה על "📱 מובייל" להצגת הרספונסיביות, 3) הצגת קוד ה-<body>, ה-<style> וה-<script> שכתבת בעצמך!'
      ],
      selfExplain: 'הקהל יתלהב לראות שאתר כזה מרשים נכתב ועוצב על ידך בשורות קוד אמיתיות!'
    },
    4: {
      title: 'שלב 4: חזרה גנרלית בזוגות (Peer Pitch)',
      summary: 'מציגים את ההדגמה שלנו לחבר שלצידנו ומקבלים משוב אחרון.',
      codeExample: `<!-- הצג לחבר ב-2 דקות את האתר והקוד שלך וקבל משוב -->`,
      steps: [
        'בצע את ההדגמה החיה של 2 דקות מול החבר שלצידך בכיתה.',
        'צפה בהדגמה של החבר שלך ותן לו משוב חיובי וטיפ אחד לשיפור.'
      ],
      selfExplain: 'תרגול מול חבר נותן ביטחון מלא לקראת ההצגה מול הכיתה!'
    },
    5: {
      title: 'שלב 5: תיקונים אחרונים בקוד וב-<style> (🎨)',
      summary: 'מבצעים ליטושים אחרונים בקוד ובעיצוב אם התגלו במהלך החזרה הגנרלית.',
      codeExample: `<!-- בצע כל ליטוש אחרון בצבעים או בטקסטים ושמור שוב את הקובץ -->`,
      steps: [
        'תקן כל פרט קטן שגילית במהלך החזרה הגנרלית ושמור שוב את הקובץ במחשב.'
      ],
      selfExplain: 'האתר שלך מוכן ב-100% לאירוע ההשקה!'
    },
    6: {
      title: 'שלב 6: אישור מוכנות לאירוע ה-Demo Day',
      summary: 'מסמנים מוכנות מלאה למפגש ה-32 החגיגי.',
      codeExample: `<!-- מוכנים ל-Demo Day! 🚀 -->`,
      steps: [
        'סמן את המשימות ולחץ על כפתור השלמת מפגש 31!'
      ],
      selfExplain: 'בהצלחה באירוע ההשקה החגיגי!',
      checklist: [
        'הרכבתי תסריט הדגמה חיה של 2 דקות עם ה-AI.',
        'תרגלתי שאלות ותשובות על הפרויקט שלי.',
        'ביצעתי חזרה גנרלית מלאה של האתר והקוד.'
      ]
    }
  },

  // --------------------------------------------------------------------------
  // מפגש 32: 🎉 Demo Day: אירוע השקת האתרים השנתי!
  // --------------------------------------------------------------------------
  32: {
    1: {
      title: 'שלב 1: פתיחת עמדת ההדגמה שלך לקראת ההצגה',
      summary: 'מכינים את האתר פתוח ומוכן להצגה גם בעורך הקוד החי וגם כטאב עצמאי בדפדפן.',
      codeExample: `<!-- פתח את האתר גם בעורך הקוד החי וגם בדפדפן להדגמה מלאה! -->`,
      steps: [
        'פתח את עורך הקוד החי בחלון חדש וטען את דף הבית הסופי שלך (index.html).',
        'פתח במקביל את הקובץ index.html מהתיקייה שלך כטאב עצמאי בדפדפן.',
        'ודא שכל התמונות, הווידאו והמיני-אפליקציה מוכנים להדגמה.'
      ],
      selfExplain: 'עמדת ההדגמה שלך מוכנה להצגה!'
    },
    3: {
      title: 'שלב 3: סבב ההצגות המרכזי – הצגת האתר, העיצוב ותוצרי ה-AI',
      summary: 'כל תלמיד מציג לכיתה את האתר שבנה ועיצב, את הלוגו והתמונות מ-AI ואת העמודים השונים.',
      codeExample: `<!-- הצגת דף הבית, סרגל הניווט, הלוגו, באנר ה-Hero ועמודי האודות והגלריה -->`,
      steps: [
        'כאשר מגיע תורך, הצג על המסך את דף הבית של "[SITE_NAME]", סרגל הניווט, הלוגו ובאנר ה-Hero.',
        'הדגם את המעבר לעמוד האודות ולעמוד הגלריה שבהם משולבים תוצרי ה-AI שלך.'
      ],
      selfExplain: 'ספר לקהל איך בחרת את פלטת הצבעים ואיך הרכבת את הפרומפטים ב-AI!'
    },
    4: {
      title: 'שלב 4: הדגמת המיני-אפליקציה, ה-JavaScript והרספונסיביות',
      summary: 'מדגימים בלייב איך האתר מגיב לגולש ואיך הוא נראה במובייל ובטאבלט.',
      codeExample: `<!-- הדגמת המיני-אפליקציה החיה, הגרלת ה-JS, טופס ה-WhatsApp ותצוגת המובייל -->`,
      steps: [
        'הדגם בלייב הזנת נתונים במיני-אפליקציה שלך והצגת התוצאה במסך הפלט.',
        'הדגם את כפתור ההגרלה ב-JavaScript ואת שליחת הטופס ל-WhatsApp.',
        'הראה איך האתר מתאים את עצמו ל-🖥️ מחשב, 📟 טאבלט ו-📱 מובייל.'
      ],
      selfExplain: 'תן לאחד התלמידים בקהל לבחור ערכים להזנה במיני-אפליקציה שלך בלייב!'
    },
    5: {
      title: 'שלב 5: הצגת מאחורי הקלעים – קוד ה-HTML, ה-CSS וה-JavaScript שכתבת!',
      summary: 'מראים לקהל את קוד המקור המלא ואת חוקי העיצוב ב-<style> שכתבנו בעצמנו מאפס לאורך השנה.',
      codeExample: `<!-- הצג בעורך הקוד החי את ה-<body>, ה-<style> וה-<script> שבנית! -->`,
      steps: [
        'הצג בעורך הקוד החי את אזור ה-<body>, את חוקי העיצוב ב-<style> ואת הפונקציות שכתבת ב-<script>!'
      ],
      selfExplain: 'זה הרגע להראות בגאווה שאתה כותב ומעצב קוד אמיתי של מפתחי אתרים!'
    },
    6: {
      title: 'שלב 6: סיום הקורס השנתי ושמירת תיק העבודות! 🏆',
      summary: 'חותמים את השנה ומסמנים 32/32 מפגשים שהושלמו בהצלחה!',
      codeExample: `<!-- 🏆 כל הכבוד! סיימת בהצלחה 32 מפגשי פיתוח אתרים בקוד פתוח + AI! 🎉 -->`,
      steps: [
        'שמור עותק של תיקיית האתר שלך בדיסק-און-קי או בענן האישי שלך.',
        'סמן את המשימות ולחץ על כפתור השלמת מפגש 32 להשלמת 100% מהמסלול השנתי!'
      ],
      selfExplain: 'ברכות על השלמת המסלול השנתי בפיתוח ועיצוב אתרים בקוד פתוח בשילוב בינה מלאכותית!',
      checklist: [
        'הצגתי את האתר הרב-עמודי, העיצובים ותוצרי ה-AI שלי באירוע ה-Demo Day!',
        'הדגמתי את המיני-אפליקציה, ה-JavaScript והרספונסיביות בלייב.',
        'סיימתי בהצלחה את כל 32 המפגשים של המסלול השנתי! 🏆🎉'
      ]
    }
  }
};

// ============================================================================
// ✨ מחולל שקפי מיקרו (Micro-Slides):
// הופך כל מפגש לרצף של שקפים נקיים וממוקדים שבהם בכל שקף יש:
// 1. הסבר פשוט אחד (משפט אחד ברור)
// 2. דוגמה קטנה אחת (1 עד 4 שורות בלבד!)
// 3. משימה אחת פשוטה לביצוע עכשיו
// ============================================================================

function getFocusedOpenCodeMicroData(stepText, stageCodeExample, stageSummary) {
  const s = stepText || '';

  // 1. פתיחת עורך הקוד או טעינת קובץ
  if (/פתח.*עורך הקוד|העלה קובץ HTML|נקה את תוכן|טען את הקובץ/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '💻 הכנת עורך הקוד החי',
      simpleExplanation:
        'דף ה-HTML בעורך הקוד כבר מוכן עם הגדרות העברית – אנחנו מתחילים לכתוב ישר בתוך תגית ה-<body>.',
      smallExample: `<body>\n  <!-- כאן נכתוב את הקוד שלנו -->\n</body>`
    };
  }

  // 2. הורדה ושמירת קובץ למחשב
  if (/הורד קובץ|הורד את הקובץ|שמור.*במחשב|קובץ וייצוא/.test(s)) {
    return {
      microType: 'save',
      badgeTitle: '💾 שמירת קובץ האתר למחשב',
      simpleExplanation:
        'הורדת הקובץ שומרת במחשב שלך קובץ אתר אמיתי שניתן לפתוח בדפדפן ולהמשיך לערוך במפגש הבא.',
      smallExample: `📂 קובץ וייצוא  ⬅️  📥 הורד קובץ index.html`
    };
  }

  // 3. בדיקת תצוגת מובייל / טאבלט / מחשב
  if (/מובייל|טאבלט|3 המסכים|תצוגת מחשב/.test(s) && !/@media/.test(s)) {
    return {
      microType: 'save',
      badgeTitle: '📱 בדיקת התאמה למסכים',
      simpleExplanation:
        'אתר מקצועי חייב להיראות מסודר וקריא גם על מסך מחשב רחב וגם על מסך סמארטפון.',
      smallExample: `🖥️ מחשב   |   📟 טאבלט   |   📱 מובייל`
    };
  }

  // 4. עיצוב CSS ב-<style>: כלל @media למובייל
  if (/@media/.test(s)) {
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: התאמה למובייל (@media)',
      simpleExplanation:
        'כלל @media ב-<style> מאפשר להגדיר גודל מיוחד לכרטיסיות ולכותרות כאשר גולשים באתר מהטלפון.',
      smallExample: `@media (max-width: 600px) {\n  .col-card { width: 90%; }\n  h1 { font-size: 28px; }\n}`
    };
  }

  // 5. עיצוב CSS ב-<style>: אנימציית @keyframes או :hover
  if (/@keyframes|animation:|:hover|transform:|ריחוף|מעבר עכבר/.test(s)) {
    if (/@keyframes/.test(s)) {
      return {
        microType: 'design',
        badgeTitle: '🎨 עיצוב ב-<style>: אנימציה חיה (@keyframes)',
        simpleExplanation:
          'פקודת @keyframes ב-<style> יוצרת תנועה חיה ורציפה (כמו ריחוף עדין מעלה-מטה) לאלמנט שבחרנו.',
        smallExample: `@keyframes float {\n  50% { transform: translateY(-6px); }\n}\n.logo { animation: float 3s infinite; }`
      };
    }
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: אפקט ריחוף (:hover)',
      simpleExplanation:
        'התוספת :hover ב-<style> גורמת לכפתור או לכרטיסייה לגדול או לזוז ברגע שמעבירים עליהם את העכבר.',
      smallExample: `.card:hover, button:hover {\n  transform: translateY(-4px) scale(1.03);\n  transition: 0.3s;\n}`
    };
  }

  // 6. עיצוב CSS ב-<style>: סידור בשורה עם Flexbox
  if (/display:\s*flex|flex-wrap/.test(s)) {
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: סידור בשורה (Flexbox)',
      simpleExplanation:
        'הפקודה display: flex ב-<style> מעמידה את הכרטיסיות או הכפתורים זה לצד זה בשורה עם רווח שווה (gap).',
      smallExample: `.row {\n  display: flex;\n  justify-content: center;\n  gap: 16px;\n}`
    };
  }

  // 7. עיצוב CSS ב-<style>: עיגול פינות, מסגרת וצללית
  if (/border-radius|box-shadow|border:|border-right/.test(s)) {
    if (/50%/.test(s)) {
      return {
        microType: 'design',
        badgeTitle: '🎨 עיצוב ב-<style>: תמונה עגולה ומסגרת',
        simpleExplanation:
          'עיגול פינות של border-radius: 50% ב-<style> הופך תמונה מרובעת לעיגול מושלם עם מסגרת וצללית.',
        smallExample: `.avatar {\n  border-radius: 50%;\n  border: 4px solid #2563eb;\n  box-shadow: 0 6px 16px rgba(0,0,0,0.15);\n}`
      };
    }
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: עיגול פינות וצללית',
      simpleExplanation:
        'ב-<style> הפקודה border-radius מעגלת את פינות הקופסה, ו-box-shadow מוסיפה לה צללית תלת-ממדית.',
      smallExample: `.card {\n  border-radius: 20px;\n  border: 2px solid #dbeafe;\n  box-shadow: 0 8px 20px rgba(0,0,0,0.08);\n}`
    };
  }

  // 8. עיצוב CSS ב-<style>: ריווח פנימי (padding) ומרכוז (margin)
  if (/\bpadding\b|\bmargin\b/.test(s) && !/<button|<span/.test(s)) {
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: מרווחים ומרכוז (Padding & Margin)',
      simpleExplanation:
        'padding נותן מרווח אוויר בתוך הקופסה, ו-margin: 20px auto ממרכז את הקופסה בדיוק לאמצע העמוד.',
      smallExample: `.card {\n  padding: 24px;\n  margin: 20px auto;\n  max-width: 720px;\n}`
    };
  }

  // 9. עיצוב CSS ב-<style>: גודל וצבע כתב (color, font-size, text-shadow)
  if (/font-size|font-weight|text-shadow|צבע הטקסט|צבע הכתב/.test(s)) {
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: צבע וגודל כתב (Typography)',
      simpleExplanation:
        'ב-<style> הפקודה color קובעת את צבע הטקסט, ו-font-size קובעת את גודל האותיות בפיקסלים.',
      smallExample: `h1 {\n  color: #2563eb;\n  font-size: 38px;\n}`
    };
  }

  // 10. עיצוב CSS ב-<style>: צבע רקע או גרדיאנט
  if (/<style>|background|linear-gradient|משימת עיצוב/.test(s)) {
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב ב-<style>: צבע רקע ומעבר צבעים',
      simpleExplanation:
        'מתחת ל-</body> פותחים תגית <style> וקובעים את צבע הרקע (background) של הדף או הכרטיסייה.',
      smallExample: `<style>\n  body {\n    background: linear-gradient(135deg, #eff6ff, #f5f3ff);\n  }\n</style>`
    };
  }

  // 11. בניית HTML: סרגל ניווט <nav>
  if (/<nav>/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: סרגל ניווט <nav>',
      simpleExplanation:
        'תגית <nav> בראש ה-<body> יוצרת את סרגל הניווט העליון עם שם המותג והקישורים לדפי האתר.',
      smallExample: `<nav>\n  <strong>[SITE_NAME]</strong>\n  <a href="index.html">ראשי</a>\n  <a href="about.html">אודות</a>\n</nav>`
    };
  }

  // 12. בניית HTML: סרגל תחתון <footer>
  if (/<footer>/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: סרגל תחתון <footer>',
      simpleExplanation:
        'תגית <footer> בתחתית ה-<body> סוגרת את העמוד עם שם המותג ושורת זכויות היוצרים.',
      smallExample: `<footer>\n  <p>© 2026 [SITE_NAME] • כל הזכויות שמורות</p>\n</footer>`
    };
  }

  // 13. בניית HTML: תגית <span class="badge">
  if (/<span/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: תגית בולטת <span>',
      simpleExplanation:
        'תגית <span class="badge"> יוצרת תווית קטנה ובולטת מעל הכותרת להצגת נושא האתר או מבצע.',
      smallExample: `<span class="badge">✨ [SITE_TOPIC]</span>`
    };
  }

  // 14. בניית HTML: רשימת <ul> ו-<li>
  if (/<ul>|<li>/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: רשימת נקודות <ul>',
      simpleExplanation:
        'תגית <ul> פותחת רשימת נקודות מסודרת, וכל שורה ברשימה נכתבת בתוך תגית <li>.',
      smallExample: `<ul>\n  <li>יתרון 1 באתר שלי</li>\n  <li>יתרון 2 באתר שלי</li>\n</ul>`
    };
  }

  // 15. בניית HTML: תמונה <img>
  if (/<img/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: הוספת תמונה <img>',
      simpleExplanation:
        'תגית <img> מציגה תמונה בדף – בתוך המרכאות של src="..." מדביקים את קישור התמונה.',
      smallExample: `<img class="logo" src="קישור_לתמונה" width="120">`
    };
  }

  // 16. בניית HTML: כפתור <button>
  if (/<button/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: כפתור לחיץ <button>',
      simpleExplanation:
        'תגית <button> יוצרת כפתור באתר שמבצע פעולה או מציג הודעה כשלוחצים עליו.',
      smallExample: `<button onclick="alert('ברוכים הבאים ל-[SITE_NAME]!')">\n  לחץ כאן 🚀\n</button>`
    };
  }

  // 17. בניית HTML: קישורים <a href="...">
  if (/<a\s/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: קישור לחיץ <a>',
      simpleExplanation:
        'תגית <a> יוצרת קישור או כפתור שמעביר את הגולש לעמוד אחר באתר או לשליחת הודעה.',
      smallExample: `<a href="contact.html" class="btn-main">דברו איתנו 💬</a>`
    };
  }

  // 18. בניית HTML: שדות קלט וטפסים (<input>, <select>, <textarea>)
  if (/<input|<select|<textarea/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: שדה קלט <input>',
      simpleExplanation:
        'תגיות <input>, <select> ו-<textarea> מאפשרות לגולש להקליד טקסט או לבחור אפשרות באתר.',
      smallExample: `<input id="Input1" placeholder="הקלד כאן...">`
    };
  }

  // 19. בניית HTML: טבלה <table>
  if (/<table|<tr>|<td>|<th>/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: טבלה <table>',
      simpleExplanation:
        'תגית <table> יוצרת טבלה: <tr> היא שורה, <th> היא כותרת עמודה, ו-<td> הוא תא רגיל.',
      smallExample: `<table>\n  <tr><th>מסלול</th><th>מחיר</th></tr>\n  <tr><td>VIP</td><td>99 ₪</td></tr>\n</table>`
    };
  }

  // 20. בניית קוד חכם ב-<script>
  if (/<script>|function\s/.test(s)) {
    return {
      microType: 'blocks',
      badgeTitle: '⚡ קוד חכם ב-<script>: פונקציית JavaScript',
      simpleExplanation:
        'תגית <script> מתחת ל-</style> מאפשרת להוסיף חישובים ופעולות חכמות שמגיבות ללחיצת הגולש.',
      smallExample: `<script>\n  function runAction() {\n    alert('הפעולה בוצעה בהצלחה!');\n  }\n</script>`
    };
  }

  // 21. בניית HTML: כותרות <h1> / <h2> / <h3> ופסקאות <p>
  if (/<h1>|<h2>|<h3>|<p>/.test(s)) {
    if (/<h1>/.test(s)) {
      return {
        microType: 'blocks',
        badgeTitle: '🧱 בניית קוד ב-<body>: כותרת <h1> ופסקה <p>',
        simpleExplanation:
          'תגית <h1> מציגה את הכותרת הראשית של העמוד, ותגית <p> מציגה פסקת טקסט מתחתיה.',
        smallExample: `<h1>[SITE_NAME]</h1>\n<p>הסלוגן של האתר שלי</p>`
      };
    }
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: כותרת משנה ופסקה',
      simpleExplanation:
        'תגית <h2> (או <h3>) יוצרת כותרת לאזור חדש בדף, ותגית <p> מציגה את ההסבר מתחתיה.',
      smallExample: `<h2>כותרת האזור</h2>\n<p>תיאור קצר וברור לגולשים באתר.</p>`
    };
  }

  // 22. בניית HTML: קופסת כרטיסייה <div class="card"> או שורת <div class="row">
  if (/<div/.test(s)) {
    if (/class="row"|class="btn-row"/.test(s)) {
      return {
        microType: 'blocks',
        badgeTitle: '🧱 בניית קוד ב-<body>: פתיחת שורה <div class="row">',
        simpleExplanation:
          'קופסת <div class="row"> מאגדת מספר כרטיסיות או כפתורים יחד כדי שיעמדו בשורה אחת.',
        smallExample: `<div class="row">\n  <!-- כאן נכתוב את הכרטיסיות שבשורה -->\n</div>`
      };
    }
    return {
      microType: 'blocks',
      badgeTitle: '🧱 בניית קוד ב-<body>: פתיחת כרטיסייה <div class="card">',
      simpleExplanation:
        'תגית <div class="card"> יוצרת קופסה שעוטפת את הכותרת, הטקסט והתמונה במסגרת מעוצבת אחת.',
      smallExample: `<div class="card">\n  <!-- כאן נכנס תוכן הכרטיסייה -->\n</div>`
    };
  }

  // ברירת מחדל: לוקחים עד 4 שורות קצרות מתוך הדוגמה של השלב
  const fallbackLines = (stageCodeExample || `<body>\n  <div class="card">...</div>\n</body>`)
    .split('\n')
    .slice(0, 4)
    .join('\n');

  return {
    microType: 'blocks',
    badgeTitle: '🧱 בניית קוד בעורך החי',
    simpleExplanation: stageSummary || 'מוסיפים את הרכיב החדש לקוד ה-HTML ובודקים בתצוגה החיה.',
    smallExample: fallbackLines
  };
}

function getFocusedBlocksMicroData(stepText, stageType, stageSummary) {
  const s = stepText || '';
  if (stageType === 'design' || /צבע|גרדיאנט|padding|margin|border|צללית|ריווח|עיצוב/.test(s)) {
    return {
      microType: 'design',
      badgeTitle: '🎨 עיצוב בסטודיו הבלוקים',
      simpleExplanation:
        'בחלונית העיצוב משמאל ניתן לשנות צבעים, מרווחים, עיגול פינות וצלליות לכל בלוק שבחרת.',
      smallExample: `🎨 חלונית עיצוב  ⬅️  בחר צבע רקע, גודל גופן, ריווח (Padding) ועיגול פינות`
    };
  }
  if (stageType === 'save' || /הורד|שמור|מובייל|טאבלט/.test(s)) {
    return {
      microType: 'save',
      badgeTitle: '🚀 בדיקה ושמירת האתר',
      simpleExplanation:
        'בודקים שהאתר נראה מעולה במחשב ובמובייל ושומרים את הקובץ המעודכן למחשב.',
      smallExample: `📱 בדיקת מובייל  ⬅️  💾 הורד ושמור קובץ HTML למחשב`
    };
  }
  return {
    microType: 'blocks',
    badgeTitle: '🧱 בנייה בבלוקים',
    simpleExplanation:
      stageSummary || 'גוררים את הבלוק המתאים מהתפריט הימני אל הדף ומזינים בו את התוכן.',
    smallExample: `➕ גרירת בלוק לדף  ⬅️  הזנת התוכן בתוך הבלוק`
  };
}

export function expandSessionToMicroSlides(session, isCodeTrack) {
  if (session.id === 1) {
    return {
      ...session,
      title: 'מבוא ל-HTML5 + CSS3: בחירת נושא לאתר ובניית כרטיסיית הדגל הראשונה',
      goal: 'בחירת נושא ושם מותג לאתר, היכרות מעשית עם הבנאי (HTML5) והמעצב (CSS3), תגיות בסיס, מודל הקופסה (Box Model) ובניית כרטיסיית האתר הראשונה שלנו!',
      stages: buildSession1RichSlides(undefined, isCodeTrack)
    };
  }

  const sessionOverrides = isCodeTrack ? OPEN_CODE_STAGE_OVERRIDES[session.id] || {} : {};
  const microSlides = [];

  (session.stages || []).forEach((rawStage, stageIdx) => {
    const stageNum = stageIdx + 1;
    const override = sessionOverrides[stageNum];
    const stage = override ? { ...rawStage, ...override } : rawStage;

    // 1. אם זה שלב AI -> הופך לשתי משימות AI ממוקדות במפגש (משימת תוכן/צבעים + משימת יצירת תמונה ב-FLUX.1)
    if (stage.type === 'ai' || stage.prompt) {
      const challenge = buildAIChallengeForStage(session, stage);
      const isImg = challenge.isImageAI;
      const deliverableSummary = (challenge.taskDeliverables || []).slice(0, 2).join(' • ');

      const smallFormula = isImg
        ? `צור לי תמונה מרשימה עבור האתר "[SITE_NAME]" בתחום [SITE_TOPIC] שמתאימה לנושא המפגש: ${session.title}`
        : `אתה מומחה לבניית אתרים ומיתוג. אני בונה את האתר "[SITE_NAME]" בתחום [SITE_TOPIC].\nעבור מפגש ${session.id} (${session.title}), כתוב עבורי: ${deliverableSummary || stage.summary}\nסגנון: קצר, ברור ומשולב באימוג׳ים מתאימים.`;

      microSlides.push({
        type: 'ai',
        isAI: true,
        badgeTitle: isImg ? '🖼️ משימת AI: יצירת תמונה' : '🧠 משימת AI: יצירת תוכן וטקסט',
        title: stage.title.replace(/^שלב \d+:\s*/, ''),
        summary: stage.summary,
        simpleExplanation: `${stage.summary} (${deliverableSummary})`,
        smallExample: smallFormula,
        aiSuggestedPrompt: smallFormula,
        aiSuggestedMode: isImg ? 'image' : 'text',
        singleTask:
          'לחץ על הכפתור למטה כדי לשלוח את המשימה לחלון הצ׳אט באזור סוכני ה-AI (או נסח בעצמך), ושמור את התוצאה לשילוב באתר!',
        steps: [
          'בצע את משימת ה-AI בחלון הצ׳אט של סוכן ה-AI ושמור את התוצאה לשילוב באתר.'
        ],
        aiChallenge: challenge
      });

      // הוספת משימת AI שנייה משלימה לכל מפגש (אם הראשונה הייתה טקסט -> נוסיף יצירת תמונה למפגש, ואם הראשונה תמונה -> נוסיף טקסט/צבעים)
      if (!isImg) {
        const imgPrompt = `צור לי תמונה מקורית ומרהיבה עבור האתר "[SITE_NAME]" בתחום [SITE_TOPIC] לשילוב במפגש "${session.title}"`;
        microSlides.push({
          type: 'ai',
          isAI: true,
          badgeTitle: '🖼️ משימת AI: יצירת תמונה למפגש',
          title: `יצירת תמונה או באנר ב-AI עבור ${session.title}`,
          summary: `ניצור בעזרת סוכן התמונות (FLUX.1) תמונה מקורית חדשה שמתאימה לרכיב שאנחנו בונים במפגש ${session.id}.`,
          simpleExplanation: `בחלון הצ'אט של סוכן ה-AI נוכל ליצור תמונה מותאמת אישית ולהעתיק את ה-URL שלה ישר לקוד או לבלוקים.`,
          smallExample: imgPrompt,
          aiSuggestedPrompt: imgPrompt,
          aiSuggestedMode: 'image',
          singleTask:
            'פתח את חלון הצ׳אט באזור סוכני ה-AI, צור תמונה חדשה שמתאימה למפגש זה והעתק את הקישור שלה (URL) לשילוב באתר!',
          steps: [
            'צור תמונה חדשה בחלון הצ׳אט של סוכן ה-AI והעתק את ה-URL שלה לשילוב באתר.'
          ]
        });
      } else {
        const txtPrompt = `עבור האתר "[SITE_NAME]" בתחום [SITE_TOPIC], כתוב לי כותרת מלהיבה, טקסט קצר ופלטת צבעי HEX שמתאימים למפגש "${session.title}".`;
        microSlides.push({
          type: 'ai',
          isAI: true,
          badgeTitle: '💬 משימת AI: קופירייטינג וצבעים למפגש',
          title: `יצירת כותרות, טקסט ופלטת צבעים עבור ${session.title}`,
          summary: `ניעזר בסוכן ה-AI ליצירת טקסטים שיווקיים וקודי צבעים שישדרגו את הרכיב החדש במפגש ${session.id}.`,
          simpleExplanation: `סוכן ה-AI יכתוב עבורנו כותרות וטקסטים מוכנים להעתקה ויציע קודי צבעי HEX מתאימים.`,
          smallExample: txtPrompt,
          aiSuggestedPrompt: txtPrompt,
          aiSuggestedMode: 'text',
          singleTask:
            'פתח את חלון הצ׳אט באזור סוכני ה-AI, בקש כותרות וטקסטים למפגש זה והדבק אותם באתר שלך!',
          steps: [
            'בקש מסוכן ה-AI בצ׳אט כותרות וטקסטים למפגש זה ושלב אותם באתר.'
          ]
        });
      }
      return;
    }

    // 2. שלבי בנייה, עיצוב ושמירה -> כל פעולה ברשימת steps מקבלת שקף תכנות נקי ועצמאי משלה!
    const stageSteps =
      Array.isArray(stage.steps) && stage.steps.length > 0
        ? stage.steps
        : Array.isArray(stage.stepDetails)
        ? stage.stepDetails.map((d) => d.task || d.title || '')
        : [];
    stageSteps.forEach((stepText, stepIdx) => {
      if (isCodeTrack) {
        const focused = getFocusedOpenCodeMicroData(
          stepText,
          stage.codeExample,
          stage.summary
        );
        microSlides.push({
          type: focused.microType,
          isAI: false,
          badgeTitle: focused.badgeTitle,
          title:
            stepIdx === 0
              ? stage.title.replace(/^שלב \d+:\s*/, '')
              : `${focused.badgeTitle.replace(/^[^\s]+\s*/, '')}`,
          summary: focused.simpleExplanation,
          simpleExplanation: focused.simpleExplanation,
          smallExample: focused.smallExample,
          codeExample: focused.smallExample,
          singleTask: stepText,
          steps: [stepText]
        });
      } else {
        const detail = Array.isArray(stage.stepDetails) ? stage.stepDetails[stepIdx] : null;
        const isLastStepInStage = stepIdx === stageSteps.length - 1;
        if (detail) {
          microSlides.push({
            type: detail.microType || stage.type || 'blocks',
            isAI: false,
            badgeTitle: detail.badgeTitle || '🧩 בנייה בבלוקים (WebBlocks Pro)',
            title:
              detail.title ||
              (stepIdx === 0
                ? stage.title.replace(/^שלב \d+:\s*/, '')
                : stage.summary || 'בניית רכיב בבלוקים'),
            summary: detail.explanation || stage.summary,
            simpleExplanation: detail.explanation || stage.summary,
            smallExample: detail.example || '',
            toolboxCategory: detail.toolboxCategory || '',
            searchHint: detail.searchHint || '',
            blockTitle: detail.blockTitle || '',
            blockType: detail.blockType || '',
            blockXml: detail.blockXml || '',
            blockFields: Array.isArray(detail.blockFields) ? detail.blockFields : [],
            designFreedomTip: detail.designFreedomTip || '',
            singleTask: detail.task || stepText,
            steps: [detail.task || stepText],
            ...(isLastStepInStage && stage.checklist ? { checklist: stage.checklist } : {})
          });
        } else {
          const focused = getFocusedBlocksMicroData(
            stepText,
            stage.type,
            stage.summary
          );
          microSlides.push({
            type: focused.microType,
            isAI: false,
            badgeTitle: focused.badgeTitle,
            title:
              stepIdx === 0
                ? stage.title.replace(/^שלב \d+:\s*/, '')
                : `${focused.badgeTitle.replace(/^[^\s]+\s*/, '')}`,
            summary: focused.simpleExplanation,
            simpleExplanation: focused.simpleExplanation,
            smallExample: focused.smallExample,
            singleTask: stepText,
            steps: [stepText],
            ...(isLastStepInStage && stage.checklist ? { checklist: stage.checklist } : {})
          });
        }
      }
    });

    // 3. אם יש משימת עיצוב יצירתית (selfExplain) בקוד פתוח -> מקבלת שקף עיצוב עצמאי ונקי משלה!
    if (isCodeTrack && stage.selfExplain && stage.type !== 'save') {
      microSlides.push({
        type: 'design',
        isAI: false,
        badgeTitle: '🎨 משימת עיצוב אישית ב-<style>',
        title: 'שדרוג העיצוב האישי שלך ב-<style>',
        summary: 'עיקר העבודה של מעצב אתרים הוא התאמת הצבעים, המרווחים והאפקטים לטעם האישי שלך.',
        simpleExplanation:
          'בתוך תגית <style> תוכל לשנות כל צבע, גודל גופן, עיגול פינות וצללית כדי שהאתר שלך ייראה ייחודי ומקורי.',
        smallExample: `.card {\n  background: linear-gradient(135deg, #ffffff, #f0f9ff);\n  border-radius: 22px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n}`,
        codeExample: `.card {\n  background: linear-gradient(135deg, #ffffff, #f0f9ff);\n  border-radius: 22px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n}`,
        singleTask: stage.selfExplain,
        steps: [stage.selfExplain]
      });
    }
  });

  // מספור נקי ונפרד למשימות תכנות ולמשימות AI בכל מפגש!
  let codingCount = 0;
  let aiCount = 0;
  const totalCoding = microSlides.filter((ms) => !ms.isAI).length;
  const totalAI = microSlides.filter((ms) => ms.isAI).length;

  const numberedMicroSlides = microSlides.map((ms) => {
    if (ms.isAI) {
      aiCount += 1;
      return {
        ...ms,
        microIndex: aiCount,
        totalMicroInSession: totalAI,
        title: `משימת AI ${aiCount}: ${ms.title}`
      };
    }
    codingCount += 1;
    return {
      ...ms,
      microIndex: codingCount,
      totalMicroInSession: totalCoding,
      title: `משימת תכנות ${codingCount}: ${ms.title}`
    };
  });

  return {
    ...session,
    goal: isCodeTrack
      ? session.goal
          .replace(/ב-WebBlocks Studio/g, 'בעורך הקוד החי')
          .replace(/ב-WebBlocks/g, 'בקוד פתוח')
          .replace(/בבלוקים/g, 'בקוד פתוח')
      : session.goal,
    stages: numberedMicroSlides
  };
}

export function upgradeAIStageForSelfPrompting(session, stage) {
  return stage;
}

export const OPEN_CODE_AI_SESSIONS = OPEN_CODE_SOURCE_SESSIONS.map((session) =>
  expandSessionToMicroSlides(session, true)
);

export const UPGRADED_BLOCKS_AI_SESSIONS = WEBBLOCKS_AI_SESSIONS.map((session) =>
  expandSessionToMicroSlides(session, false)
);

