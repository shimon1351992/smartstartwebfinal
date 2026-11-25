import { blockStep, designStep, saveStep, buildStage } from './webBlocksCurriculumHelpers';

export const WEBBLOCKS_Q3_SESSIONS = [
  // מפגש 17: שליטה בנראות אלמנטים (Show / Hide / Toggle)
  {
    id: 17,
    quarter: 'q3',
    finishedPart: 'אזור הצגה/הסתרה דינמי ומיקרו-אינטראקציות בלחיצה',
    title: 'שליטה ב-DOM: הצג/הסתר (Toggle) והחלפת Class',
    goal: 'מחברים כפתורים למזהי ה-ID שבנינו ב-HTML כדי לחשוף תוכן נוסף או להחליף מצב עיצוב בלחיצה.',
    stages: [
      {
        title: 'בחירת אינטראקציית Toggle חכמה ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מחליטים איזה חלק באתר ייחשף או ישתנה בלחיצת כפתור (כמו "קרא עוד" או פרטים נסתרים).',
        steps: ['הרץ פרומפט לקבלת טקסט סודי/מורחב שייפתח בלחיצה באתר שלך.'],
        prompt: 'הצע רעיון לפיצ׳ר "לחץ לחשיפה" (Toggle) באתר "[SITE_NAME]" ([SITE_TOPIC]) + טקסט קצר של 3 שורות שייחשף בלחיצה.',
        expectedResult: 'תוכן לפתיחה אינטראקטיבית.'
      },
      buildStage({
        title: 'חיבור פעולות Toggle ו-Class לאלמנט לפי ID',
        type: 'blocks',
        summary: 'JavaScript מאתרת אלמנט ב-HTML לפי ה-ID שלו, ומסתירה/מציגה אותו או מוסיפה לו Class עיצובי.',
        stepDetails: [
          blockStep({
            title: 'הסתר / הצג אלמנט בלחיצה (Toggle Element)',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'הצג הסתר',
            blockTitle: '👁️ הצג / הסתר אלמנט',
            blockType: 'action_toggle_element',
            blockXml: `<block type="web_button"><statement name="DO"><block type="action_toggle_element"></block></statement></block>`,
            explanation: 'שם המפתח כאן הוא תאימות מדויקת: ה-ID שמוגדר בפקודת ההצגה חייב להיות זהה ל-ID של הכרטיס/אזור.',
            blockFields: [
              { label: 'ID היעד', value: 'למשל extraInfoBox' }
            ],
            designFreedomTip: 'עצב את הכפתור הפותח בצבע בולט כך שהגולש ירצה ללחוץ.',
            task: 'תן לכרטיס/אזור ID ברור, וחבר לכפתור את "👁️ הצג / הסתר אלמנט" לאותו ID.'
          }),
          blockStep({
            title: 'החלפת Class עיצובית בלחיצה (Toggle Class)',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'החלף class',
            blockTitle: '🏷️ הוסף/הסר Class לאלמנט',
            blockType: 'action_toggle_class',
            explanation: 'למשל הפעלה/ביטול של Class מיוחד (כמו "active" או "highlight") שמשנה את המסגרת או הרקע של כרטיס.',
            blockFields: [
              { label: 'ID האלמנט + שם Class', value: 'למשל highlightCard ו-active' }
            ],
            designFreedomTip: 'אפשר להגדיר את המראה של ה-Class בבלוק "🎨 CSS חופשי" ממפגש 14.',
            task: 'חבר כפתור שני ל-"🏷️ הוסף/הסר Class לאלמנט" ובדוק בתצוגה החיה.'
          })
        ]
      }),
      buildStage({
        title: 'בדיקת זרימת הלחיצות בתצוגה מלאה',
        type: 'save',
        summary: 'בודקים שהפתיחה והסגירה חלקות בלי קפיצות מוזרות.',
        stepDetails: [
          saveStep({
            title: 'ניסוי כפתורי ה-Toggle בתצוגה מלאה',
            explanation: 'ודא שכל לחיצה פותחת וסוגרת בדיוק את האלמנט הנכון.',
            task: 'לחץ 👁️ תצוגה מלאה, בדוק את כפתורי ה-Toggle ושמור גרסה.'
          })
        ],
        checklist: [
          'השתמשתי ב-ID תואם בין הכפתור לאלמנט היעד.',
          'פתיחה והסתרה עובדות חלק בתצוגה מלאה.'
        ]
      })
    ]
  },

  // מפגש 18: מחשבון / סימולטור חי בדף (Output Box + מחרוזות)
  {
    id: 18,
    quarter: 'q3',
    finishedPart: 'סקשן מחשבון / סימולטור / ברכה אינטראקטיבית חיה בדף',
    title: 'קריאת קלט והצגת פלט חי ב-DOM (Output Box ומחרוזות)',
    goal: 'בונים באתר ווידג׳ט אינטראקטיבי שקולט טקסט או מספר מהגולש, מחבר הודעה מותאמת ומציג אותה בתיבת פלט.',
    stages: [
      {
        title: 'בחירת רעיון לסימולטור אישי ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'בוחרים ווידג׳ט שימושי לגולש (למשל ברכה אישית, הצעת מחיר, או חישוב המלצה).',
        steps: ['בקש מה-AI רעיון לווידג׳ט קצר עם שדה קלט אחד ותוצאה חיה.'],
        prompt: 'הצע רעיון לווידג׳ט קלט-פלט קצר באתר "[SITE_NAME]" ([SITE_TOPIC]) שבו הגולש מקליד פרט ומקבל מיד תשובה מותאמת.',
        expectedResult: 'תרחיש קלט ← פלט ברור.'
      },
      buildStage({
        title: 'בניית זרימת קלט ← עיבוד ← פלט ב-DOM',
        type: 'blocks',
        summary: 'בלוק Input מקבל מהגולש נתון ← בלוקי val מעבדים/מחברים טקסט ← action מדפיס אותו לתיבת Output.',
        stepDetails: [
          blockStep({
            title: 'תיבת פלט חיה (Output Box) וקריאה מהירה משדה קלט',
            toolboxCategory: '📝 טקסטים וכותרות',
            searchHint: 'תיבת פלט',
            blockTitle: '📟 תיבת פלט (Output Box) + 📥 קרא קלט לפלט',
            blockType: 'web_output_box',
            blockXml: `<block type="web_output_box"><next><block type="web_button"><statement name="DO"><block type="action_read_input_to_output"></block></statement></block></next></block>`,
            explanation: 'שמים באתר שדה קלט ותיבת פלט (עם ID ברור), וכפתור שמעביר את הערך ישירות לתצוגה.',
            blockFields: [
              { label: 'Input ID', value: 'userInputName' },
              { label: 'Output ID', value: 'liveResultBox' }
            ],
            designFreedomTip: 'עצב את תיבת הפלט ככרטיס מודגש עם רקע בהיר וטקסט קריא.',
            task: 'הוסף לסקשן הווידג׳ט שדה קלט, "📟 תיבת פלט" וכפתור עם "📥 קרא קלט לפלט".'
          }),
          blockStep({
            title: 'חיבור מחרוזות מותאמות אישית (Join Text + Display)',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'חבר טקסט',
            blockTitle: '🖥️ הצג באלמנט + 🔗 חבר טקסטים + קבל קלט + טקסט קבוע',
            blockType: 'action_display_in_element',
            blockXml: `<block type="action_display_in_element"><value name="VAL"><block type="val_join_text"><value name="A"><block type="val_static_text"></block></value><value name="B"><block type="val_get_input"></block></value></block></value></block>`,
            explanation: 'בעזרת "🔗 חבר טקסטים" משלבים משפט פתיחה קבוע ("שלום ") עם מה שהגולש הקליד, ומציגים באלמנט היעד!',
            blockFields: [
              { label: 'val_static_text', value: 'משפט קבוע (למשל "ברוך הבא, ")' },
              { label: 'val_get_input', value: 'ערך חי מתוך השדה' }
            ],
            designFreedomTip: 'הדגש את הטקסט בתיבת הפלט בגודל וצבע מובחנים ב-✍️ גופן.',
            task: 'שדרג את כפתור הווידג׳ט לבלוק "🖥️ הצג באלמנט" שמחבר טקסט קבוע עם הערך מהשדה.'
          })
        ]
      }),
      buildStage({
        title: 'בדיקת הווידג׳ט בתצוגה מלאה',
        type: 'save',
        summary: 'מקלידים ערכים שונים ובודקים שהתגובה מופיעה מיד.',
        stepDetails: [
          saveStep({
            title: 'הרצת סימולציה חיה של קלט ופלט',
            explanation: 'מלא טקסט אמיתי ובדוק שהחישוב/ברכה מתעדכנים מיידית בלי רענון דף.',
            task: 'נסה 2–3 שמות/ערכים בתצוגה מלאה ושמור.'
          })
        ],
        checklist: [
          'הווידג׳ט כולל Input, Button ו-Output Box.',
          'שולבו בלוקי val_get_input, val_static_text ו-val_join_text.',
          'התצוגה מתעדכנת מיידית בדף.'
        ]
      })
    ]
  },

  // מפגש 19: מחליף מצב יום/לילה (Dark/Light Mode) ועיצוב בלייב
  {
    id: 19,
    quarter: 'q3',
    finishedPart: 'כפתור החלפת מצב יום/לילה (Theme Switcher) והתאמת עיצוב בלייב',
    title: 'שינוי עיצוב ו-Dark/Light Mode בזמן אמת באמצעות JS',
    goal: 'מאפשרים לגולש להחליף בלחיצת כפתור את צבע הרקע של הדף או את הסגנון של אלמנטים באתר בלייב.',
    stages: [
      {
        title: 'בחירת פלטת יום מול לילה ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'קובעים 2 קודי צבע מתאימים למעבר מהיר בין מצב יום למצב לילה.',
        steps: ['בקש מה-AI קוד צבע רקע כהה יוקרתי וצבע רקע בהיר נעים לעין.'],
        prompt: 'הצע צבע רקע וצבע טקסט למצבים "יום" ו"לילה" באתר "[SITE_NAME]" (קודי HEX).',
        expectedResult: 'צבעים מוכנים למחליף הערכות.'
      },
      buildStage({
        title: 'כפתורי שליטה בעיצוב בזמן אמת',
        type: 'blocks',
        summary: 'ממש כמו באתר Linear או Vercel, הגולש לוחץ על כפתור בסרגל העליון והאווירה מתחלפת.',
        stepDetails: [
          blockStep({
            title: 'שנה רקע עמוד + שינוי סגנון לאלמנט (Set Style)',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'שנה סגנון רקע',
            blockTitle: '🎨 שנה סגנון (Set Style) + 🌈 שנה רקע',
            blockType: 'action_set_style',
            blockXml: `<block type="web_button"><statement name="DO"><block type="action_change_bg"><next><block type="action_set_style"></block></next></block></statement></block>`,
            explanation: 'בלוק Set Style משנה כל תכונת CSS (צבע, רקע, גודל, גבול) של אלמנט מסוים בזמן ריצה לפי ה-ID שלו.',
            blockFields: [
              { label: 'action_change_bg', value: 'משנה את צבע רקע הדף כולו' },
              { label: 'action_set_style', value: 'משנה תכונת CSS (color/background) של אלמנט לפי ID' }
            ],
            designFreedomTip: 'שים את כפתור 🌙 מצב לילה / ☀️ מצב יום בתוך ה-Navbar כדי שיהיה זמין מכל מקום.',
            task: 'הוסף לסרגל הניווט כפתור שמפעיל "🌈 שנה רקע" ו-"🎨 שנה סגנון".'
          })
        ]
      }),
      buildStage({
        title: 'בדיקת קריאות בשני המצבים',
        type: 'design',
        summary: 'מוודאים שהטקסט נשאר קריא גם במצב הבהיר וגם במצב הכהה.',
        stepDetails: [
          designStep({
            title: 'איזון ניגודיות (Contrast) ביום ובלילה',
            explanation: 'ודא שכאשר הרקע נהיה כהה, צבע הטקסט משתנה לבהיר כדי שיישאר חד וקריא.',
            blockFields: [
              { label: 'בדיקה', value: 'לחיצה ב-👁️ תצוגה מלאה' }
            ],
            designFreedomTip: 'לשונית 🎨 צבעים — שמור על ניגודיות ברורה בין רקע לטקסט.',
            task: 'בדוק את מחליף המצבים בתצוגה מלאה וודא קריאות מושלמת.'
          })
        ],
        checklist: [
          'הכפתור משנה את רקע הדף ואת צבע הטקסט בהתאם.',
          'שני המצבים נראים אסתטיים וקריאים.'
        ]
      })
    ]
  },

  // מפגש 20: מולטימדיה, אפקטי קול וחלונות מודאל מתקדמים
  {
    id: 20,
    quarter: 'q3',
    finishedPart: 'חוויית מולטימדיה חכמה (צלילי משוב ופופאפ אינטראקטיבי)',
    title: 'אפקטי קול (Play Sound) והקפצת מודאל מתוך אירוע',
    goal: 'מוסיפים חוויית ממשק מושקעת: צליל קליק או הצלחה עדין והפעלת חלונות <dialog> מתוך זרימות משתמש.',
    stages: [
      {
        title: 'שילוב אירוע קול ושליטה במודאל',
        duration: '15 דק׳',
        type: 'blocks',
        summary: 'באתרים אינטראקטיביים (למשל משחקים, כלי AI או אפליקציות למידה), פעולות מרכזיות מלוות בצליל עדין ובחלונות אישור.',
        stepDetails: [
          blockStep({
            title: 'השמעת צליל + פתיחת מודאל חכם מתוך פעולה',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'צליל מודאל',
            blockTitle: '🔊 השמע צליל (Play Sound) + 🪟 שליטה במודאל',
            blockType: 'action_play_sound',
            blockXml: `<block type="web_button"><statement name="DO"><block type="action_play_sound"><next><block type="action_dialog_control"></block></next></block></statement></block>`,
            explanation: 'אפשר לשרשר שתי פעולות זו אחרי זו בתוך אותו כפתור: קודם השמעת צליל קצר ואז פתיחת חלון ההטבה/אישור!',
            blockFields: [
              { label: 'סוג צליל', value: 'הצלחה / קליק / התראה' },
              { label: 'מודאל', value: 'קישור ל-ID של חלון <dialog>' }
            ],
            designFreedomTip: 'עצב את חלון האישור בצבעי המותג עם אייקון יפה בפנים.',
            task: 'חבר לכפתור פעולה מרכזי באתר "🔊 השמע צליל" + פתיחת "🪟 מודאל" מעוצב.'
          })
        ]
      },
      buildStage({
        title: 'התנסות חיה ובקרת איכות',
        type: 'save',
        summary: 'לוחצים בתצוגה מלאה ובודקים שהצליל והפופאפ עובדים בהרמוניה.',
        stepDetails: [
          saveStep({
            title: 'בדיקת סאונד ומודאל בתצוגה מלאה',
            explanation: 'בדוק שגם כפתור הסגירה של המודאל פועל חלק.',
            task: 'נסה את פעולת הכפתור בתצוגה מלאה ושמור.'
          })
        ],
        checklist: [
          'שרשרת הפעולות מפעילה צליל ופותחת את המודאל.',
          'יש כפתור סגירה ברור בתוך המודאל.'
        ]
      })
    ]
  },

  // מפגש 21: פיצ'ר JavaScript מותאם אישית (action_custom_js)
  {
    id: 21,
    quarter: 'q3',
    finishedPart: 'פיצ׳ר JavaScript ייחודי לפי הרעיון האישי של התלמיד',
    title: 'כוח מלא עם Custom JS: סינון, ספירה לאחור או חישוב מותאם',
    goal: 'לומדים איך כותבים שורת/קטע קוד קטן בבלוק action_custom_js שמתממשק ישירות לעץ ה-HTML של האתר.',
    stages: [
      {
        title: 'כתיבת סקריפט קצר וממוקד בעזרת AI',
        duration: '15 דק׳',
        type: 'ai',
        summary: 'משתמשים ב-AI כדי לתכנן פונקציית JS קצרה שפונה אל אלמנט לפי ה-ID שלו.',
        steps: ['העתק את הפרומפט ובקש קוד JS קצר של 5–10 שורות לאפקט או מחשבון לאתר שלך.'],
        prompt: 'כתוב קטע JavaScript קצר ופשוט (ללא ספריות חיצוניות) שמחשב תוצאה או מסנן פריטים ומעדכן אלמנט לפי document.getElementById עבור האתר "[SITE_NAME]" ([SITE_TOPIC]).',
        expectedResult: 'קטע JS נקי וקצר.'
      },
      buildStage({
        title: 'הרצת קוד חופשי מתוך הבלוקים',
        type: 'blocks',
        summary: 'ממש כמו שיש בלוקי HTML/CSS חופשיים לעיצוב, action_custom_js מאפשר לתת לאתר כל לוגיקה בעולם.',
        stepDetails: [
          blockStep({
            title: 'הוספת בלוק קוד JS חופשי (Custom JS)',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'JS חופשי',
            blockTitle: '💻 קוד JS חופשי (Custom JS)',
            blockType: 'action_custom_js',
            explanation: 'הבלוק מריץ כל קוד JavaScript תקין ברגע לחיצה על כפתור או טעינת עמוד.',
            blockFields: [
              { label: 'דוגמה פשוטה', value: 'עדכון מונה קליקים או טיימר ב-element.innerText' }
            ],
            designFreedomTip: 'הצג את הפלט של הקוד בתוך כרטיס מעוצב עם תווית ברורה.',
            task: 'חבר כפתור לבלוק "💻 קוד JS חופשי" והרץ פיצ׳ר ייחודי לאתר שלך (מונה/חישוב/טיימר).'
          })
        ]
      }),
      buildStage({
        title: 'בדיקת הפיצ׳ר ואימות קוד נקי',
        type: 'save',
        summary: 'מוודאים שהקוד רץ חלק בלי שגיאות.',
        stepDetails: [
          saveStep({
            title: 'בדיקת הפיצ׳ר החדש בתצוגה מלאה',
            explanation: 'פתח תצוגה מלאה ולחץ כמה פעמים כדי לראות את ה-DOM מגיב בזמן אמת.',
            task: 'בדוק את ה-Custom JS בתצוגה מלאה ושמור.'
          })
        ],
        checklist: [
          'פיצ׳ר ה-JS מותאם לאלמנט עם ID אמיתי באתר.',
          'הלוגיקה עובדת מיידית בלחיצה.'
        ]
      })
    ]
  },

  // מפגש 22: ניווט עוגנים חלק ושיפור חוויית משתמש (UX)
  {
    id: 22,
    quarter: 'q3',
    finishedPart: 'ניווט חלק בין סקשני דף הבית (#hero, #features, #pricing, #contact)',
    title: 'ניווט עוגנים (Anchor Links) ושיפור חוויית גלישה (UX)',
    goal: 'מחברים את קישורי התפריט בדף הבית לקפיצה ישירה ומדויקת לסקשנים הסמנטיים שיצרנו (#features, #pricing, #contact).',
    stages: [
      {
        title: 'חיבור קישורי ה-Navbar למזהי הסקשנים',
        duration: '15 דק׳',
        type: 'blocks',
        summary: 'קישור שמתחיל בסולמית (#features) מקפיץ את הגולש ישר למקום המדויק בעמוד — ככה נבנים דפי נחיתה כמו Apple ו-Stripe.',
        stepDetails: [
          blockStep({
            title: 'התאמת כתובת ה-URL בקישורי הסרגל לעוגנים (#)',
            toolboxCategory: '🔘 קישורים ורכיבים',
            searchHint: 'קישור',
            blockTitle: '🔗 קישור עוגן (#section-id)',
            blockType: 'web_link',
            explanation: 'אם הסקשן נקרא features, כתובת הקישור תהיה #features. לחיצה מביאה את הגולש ישר לשם!',
            blockFields: [
              { label: 'דוגמאות כתובת', value: '#features | #showcase | #pricing | #contact' }
            ],
            designFreedomTip: 'בלשונית "🎨 CSS חופשי" תוכל להוסיף html { scroll-behavior: smooth; } לגלילה חלקה.',
            task: 'עדכן את קישורי דף הבית כך שיעברו ישירות לסקשנים (#features, #pricing, #contact).'
          })
        ]
      },
      buildStage({
        title: 'ליטוש חוויית הגולש ומרווחים',
        type: 'design',
        summary: 'מוודאים שהקפיצה לעוגנים מביאה את הכותרת לתצוגה ברורה ונוחה.',
        stepDetails: [
          designStep({
            title: 'איזון ריווחי עליון (Padding Top) לכל סקשן',
            explanation: 'ריווח עליון טוב מבטיח שכאשר גולש קופץ לסקשן, הכותרת לא נצמדת מדי לקצה העליון.',
            blockFields: [
              { label: '📏 מידות', value: 'Padding Top 40–60px לכל סקשן' }
            ],
            designFreedomTip: 'לשונית 📏 מידות',
            task: 'בדוק את הקפיצות מכל קישור וכוון ריווחים עליונים נעימים.'
          })
        ],
        checklist: [
          'קישורי הניווט בדף הבית קופצים לסקשנים הנכונים (#features, #pricing, #contact).',
          'הריווח העליון והכפתורים מרגישים נוחים ואינטואיטיביים.'
        ]
      })
    ]
  },

  // מפגש 23: בדיקת מזהי ID ואיכות האינטראקציות
  {
    id: 23,
    quarter: 'q3',
    finishedPart: 'אפס באגים באינטראקציות, בעוגנים ובטפסים בכל העמודים',
    title: 'בקרת איכות DOM & JS: איתור קישורים וכפתורים שבורים',
    goal: 'עוברים בצורה שיטתית על כל עמוד, בודקים את כל הכפתורים, המודאלים והמזהים בעץ ה-🌳 שכבות ומתקנים תקלות.',
    stages: [
      {
        title: 'סריקת איכות מלאה (QA)',
        duration: '15 דק׳',
        type: 'save',
        summary: 'בדיקה כמו צוות QA מקצועי לפני חיבור השרת והדאטה-בייס.',
        stepDetails: [
          designStep({
            title: 'אימות כל מזהי ה-ID והכפתורים ב-🌳 שכבות',
            explanation: 'מוודאים שאין שני אלמנטים עם אותו ID ושכל אירוע מכוון לשם ID קיים.',
            blockFields: [
              { label: 'בדיקה', value: 'עץ 🌳 שכבות מול כפתורי ⚡ אירועים' }
            ],
            designFreedomTip: 'השתמש בתצוגה חיה לבדוק כל כפתור ומצב :hover.',
            task: 'סרוק את עץ ה-🌳 שכבות בכל עמוד ותקן מזהים כפולים או חסרים.'
          }),
          saveStep({
            title: 'שמירת גרסה נקייה אחרי בדיקות QA',
            explanation: 'שומרים עותק עובד ומאומת.',
            task: 'פתח 👁️ תצוגה מלאה, לחץ על כל הכפתורים/טפסים/מודאלים ושמור.'
          })
        ],
        checklist: [
          'אין מזהי ID כפולים שמתנגשים זה בזה.',
          'כל הטפסים, המודאלים והאפקטים נבדקו ועובדים חלק.'
        ]
      }
    ]
  },

  // מפגש 24: פרויקט ביניים 2.0
  {
    id: 24,
    quarter: 'q3',
    finishedPart: 'גרסה 2.0: אתר מרובה עמודים אינטראקטיבי ומגיב במלואו',
    title: 'איחוד וליטוש גרסה 2.0: אתר אינטראקטיבי חי',
    goal: 'מסיימים את שלב הקליינט (HTML + CSS3 + JS) עם אתר מלוטש, אינטראקטיבי ומרשים לפני שמוסיפים מסד נתונים.',
    stages: [
      {
        title: 'שדרוג סופי לפני חיבור הדאטה-בייס',
        duration: '15 דק׳',
        type: 'save',
        summary: 'תצוגת ביניים והצגה קצרה של האינטראקציות המרשימות באתר.',
        stepDetails: [
          saveStep({
            title: 'בדיקה מסכמת והצגת גרסה 2.0',
            explanation: 'בודקים שכל 4 העמודים והווידג׳טים מוכנים לשלב הבא: מסד הנתונים SmartDB.',
            task: 'הרץ סבב בדיקה ב-3 גדלי מסך, ייצא גיבוי והצג 2 פיצ׳רים אינטראקטיביים שבנית.'
          })
        ],
        checklist: [
          'האתר כולו בנוי בסדר HTML5 סמנטי ומעוצב בחופשיות בסטודיו.',
          'כל האינטראקציות, הטפסים והרספונסיביות עובדות חלק.'
        ]
      }
    ]
  }
];
