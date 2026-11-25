import { blockStep, designStep, saveStep, buildStage } from './webBlocksCurriculumHelpers';

export const WEBBLOCKS_Q2_SESSIONS = [
  // מפגש 9: עמוד אודות (about.html) וניווט בין עמודים
  {
    id: 9,
    quarter: 'q2',
    finishedPart: 'עמוד "אודות" שלם (about.html) מקושר מה-Navbar',
    title: 'ארכיטקטורת ריבוי עמודים: עמוד "אודות" וניווט חכם',
    goal: 'מוסיפים עמוד חדש לאתר (about.html), מחברים אותו הדדית מדף הבית בעזרת בלוקי הניווט ושומרים על אחידות.',
    stages: [
      {
        title: 'כתיבת סיפור המותג ב-AI לעמוד "אודות"',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מנסחים סיפור קצר ואישי ("הסיפור שלנו") שמתאים לעמוד נפרד.',
        steps: ['בקש מה-AI פסקת סיפור מותג בת 4 שורות + 3 ערכים מובילים.'],
        prompt: 'כתוב סיפור מותג קצר ומרגש לעמוד "אודות" של "[SITE_NAME]" ([SITE_TOPIC]) + 3 ערכי ליבה.',
        expectedResult: 'תוכן ממוקד לעמוד about.html.'
      },
      buildStage({
        title: 'פתיחת about.html וחיבור הניווט',
        type: 'blocks',
        summary: 'באתרים גדולים כמו Apple ו-Airbnb ה-Header וה-Footer זהים בכל עמוד, והתוכן באמצע (<main>) משתנה.',
        stepDetails: [
          blockStep({
            title: 'הוספת עמוד חדש + כפתור פעולות מתקדם לניווט',
            toolboxCategory: '🔘 קישורים ורכיבים',
            searchHint: 'כפתור פעולות',
            blockTitle: '🔘 כפתור פעולות + 📄 מעבר בין עמודים',
            blockType: 'web_button_with_actions',
            blockXml: `<block type="web_button_with_actions"><statement name="DO"><block type="action_navigate_page"></block></statement></block>`,
            explanation: 'יוצרים עמוד חדש מהתפריט העליון "➕ הוסף עמוד חדש לאתר", ומחברים אליו כפתור או קישור ניווט.',
            blockFields: [
              { label: 'שם העמוד', value: 'about (אודות)' },
              { label: 'פעולה', value: 'מעבר לעמוד פנימי (navigate_page)' }
            ],
            designFreedomTip: 'הדבק בראש העמוד החדש את אותו <header> ובסוף את אותו <footer>.',
            task: 'לחץ למעלה "➕ הוסף עמוד חדש לאתר" בשם about, וחבר כפתור שמפעיל "📄 מעבר לעמוד" ל-about.html ו-index.html.'
          }),
          blockStep({
            title: 'פתיחת קישור חיצוני + תווית תצוגה בעמוד אודות',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'פתח כתובת',
            blockTitle: '🌐 פתח קישור חיצוני + 🏷️ תווית טקסט',
            blockType: 'action_open_url',
            blockXml: `<block type="web_text_output_label"><next><block type="web_button"><statement name="DO"><block type="action_open_url"></block></statement></block></next></block>`,
            explanation: 'תווית טקסט קצרה מדגישה נתון מפתח (כמו "שנת הקמה"), וכפתור עם open_url פותח רשתות חברתיות או קישור חיצוני בטאב חדש.',
            blockFields: [
              { label: 'קישור חיצוני', value: 'כתובת אינטרנט של רשת חברתית / השראה' }
            ],
            designFreedomTip: 'תן לכותרת בעמוד about.html אותם צבעים וגופן כמו בדף הבית.',
            task: 'בנה את עמוד about.html עם 🏷️ תווית, סיפור המותג, וכפתור "🌐 פתח קישור חיצוני".'
          })
        ]
      }),
      buildStage({
        title: 'אחידות ניווט בין index.html ל-about.html',
        type: 'design',
        summary: 'עוברים בין העמודים ומוודאים שמרגישים שזה אתר אחד אחיד.',
        stepDetails: [
          designStep({
            title: 'בדיקת זרימה בין העמודים',
            explanation: 'השאר את כותרת ה-H1 בעמוד אודות באותו סגנון ורוחב של דף הבית.',
            blockFields: [
              { label: 'עקביות מותג', value: 'פונט, צבעים וניווט זהים' }
            ],
            designFreedomTip: 'לשוניות: 🎨 צבעים • ✍️ גופן',
            task: 'בדוק שמעבר מדף הבית לעמוד "אודות" ובחזרה עובד חלק ונראה אחיד.'
          })
        ],
        checklist: [
          'נוצר עמוד חדש about.html.',
          'קיים ניווט הדדי תקין בין index.html ל-about.html.',
          'העיצוב וה-Navbar אחידים בשני העמודים.'
        ]
      })
    ]
  },

  // מפגש 10: עמוד קטלוג / גלריה (catalog.html) + חלון קופץ (<dialog>)
  {
    id: 10,
    quarter: 'q2',
    finishedPart: 'עמוד קטלוג / גלריה (catalog.html) עם חלון פופאפ <dialog>',
    title: 'עמוד קטלוג מוצרים/פרויקטים וחלון הצצה מהירה (<dialog>)',
    goal: 'בונים עמוד קטלוג עם רשת כרטיסים ומדדי דירוג, שפותח בלחיצה חלון <dialog> מקצועי עם פרטים נוספים.',
    stages: [
      {
        title: 'יצירת 4 פריטי קטלוג ותיאורים ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מכינים שמות, תגיות קצרות ופרטים מורחבים לפריטים באתר.',
        steps: ['בקש מה-AI שמות ותיאורים קצרים ל-4 מוצרים או פרויקטים לקטלוג שלך.'],
        prompt: 'עבור הקטלוג של "[SITE_NAME]" ([SITE_TOPIC]), כתוב 4 פריטים: שם פריט, תגית קצרה (למשל "פופולרי"), ותיאור מפורט לפופאפ.',
        expectedResult: 'תוכן מפורט ל-4 פריטים בקטלוג.'
      },
      buildStage({
        title: 'בניית הקטלוג וחלון המודאל <dialog>',
        type: 'blocks',
        summary: 'באתרי Shopify, לחיצה על כרטיס קטלוג פותחת חלון "הצצה מהירה" (<dialog>) בלי לצאת מהדף.',
        stepDetails: [
          blockStep({
            title: 'רשת כרטיסי קטלוג בעמוד catalog.html',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'רשת כרטיסייה',
            blockTitle: '🔲 רשת עמודות + 📦 כרטיסייה מעוצבת',
            blockType: 'web_grid_container',
            blockXml: `<block type="web_grid_container"><statement name="CHILDREN"><block type="web_card"><statement name="CHILDREN"><block type="web_image"><next><block type="web_heading"><field name="TAG">h3</field><next><block type="web_progress_meter"></block></next></block></next></block></statement></block></statement></block>`,
            explanation: 'בכל כרטיס בקטלוג שמים תמונה, כותרת h3, תגית או מד פופולריות וכפתור "לפרטים".',
            blockFields: [
              { label: 'עמוד חדש', value: 'catalog (קטלוג)' },
              { label: 'תכולת כרטיס', value: 'תמונה + כותרת + מד התקדמות/דירוג + כפתור' }
            ],
            designFreedomTip: 'במצב :hover תן לכרטיסים צל מודגש יותר או הגדלה עדינה.',
            task: 'פתח עמוד catalog ובנה גריד של 3–4 כרטיסי פריטים.'
          }),
          blockStep({
            title: 'חלון קופץ תקני (<dialog>) + כפתור פתיחה/סגירה',
            toolboxCategory: '🔘 קישורים ורכיבים',
            searchHint: 'חלון קופץ',
            blockTitle: '🪟 חלון קופץ (Dialog Modal) + 🎛️ שליטה במודאל',
            blockType: 'web_dialog_modal',
            blockXml: `<block type="web_dialog_modal"><statement name="CHILDREN"><block type="web_heading"><field name="TAG">h3</field><next><block type="web_button"><statement name="DO"><block type="action_dialog_control"></block></statement></block></next></block></statement></block>`,
            explanation: 'תגית <dialog> נותנת חלון קופץ אמיתי מעל העמוד; בלוק השליטה ב-⚡ אירועים פותח או סוגר אותו לפי ID.',
            blockFields: [
              { label: 'מזהה המודאל', value: 'itemModal' },
              { label: 'כפתורי שליטה', value: 'כפתור פתיחה (showModal) וכפתור סגירה (close)' }
            ],
            designFreedomTip: 'ב-⭕ מסגרות תן למודאל עיגול פינות נעים וב-✨ אפקטים צל חזק.',
            task: 'הוסף "🪟 חלון קופץ (Dialog)" לעמוד, וחבר כפתור שפותח אותו וכפתור בפנים שסוגר אותו.'
          })
        ]
      }),
      buildStage({
        title: 'עיצוב כרטיסי הקטלוג והמודאל',
        type: 'design',
        summary: 'מדגישים את התמונות ואת הכרטיסים שיהיו ברורים ומזמינים.',
        stepDetails: [
          designStep({
            title: 'ליטוש כרטיסים ומסגרת המודאל',
            explanation: 'כוון גובה אחיד לתמונות בקטלוג כדי שכל הכרטיסים בשורה יסתדרו בקו אחד.',
            blockFields: [
              { label: '📏 מידות', value: 'גובה קבוע לתמונות הכרטיס' }
            ],
            designFreedomTip: 'לשוניות: 📏 מידות • ⭕ מסגרות • ✨ אפקטים',
            task: 'אחד את גדלי התמונות בכרטיסים ועצב את חלון המודאל.'
          })
        ],
        checklist: [
          'נוצר עמוד catalog.html עם ניווט מהסרגל.',
          'יש גריד כרטיסים אחיד ומעוצב.',
          'לחיצה על כפתור פותחת וסוגרת חלון <dialog> תקין.'
        ]
      })
    ]
  },

  // מפגש 11: עמוד צור קשר / הזמנה (contact.html) עם כל פקדי HTML5
  {
    id: 11,
    quarter: 'q2',
    finishedPart: 'עמוד "צור קשר / הזמנת שירות" (contact.html) עם כל פקדי HTML5',
    title: 'פקדי קלט HTML5 מתקדמים: Select, Checkbox, Slider ובוחר צבע',
    goal: 'בונים עמוד contact.html מלא שמדגים את כל סוגי הקלט החכמים ב-HTML5.',
    stages: [
      {
        title: 'תכנון טופס ההזמנה/פנייה ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'בוחרים 4–5 אפשרויות לרשימה נפתחת (Select) ולתיבות סימון.',
        steps: ['בקש מה-AI רשימת נושאי פנייה מתאימים לאתר שלך.'],
        prompt: 'עבור טופס פנייה באתר "[SITE_NAME]" ([SITE_TOPIC]), הצע 4 אפשרויות לרשימה נפתחת + 2 שאלות סימון (כן/לא).',
        expectedResult: 'אפשרויות מדויקות לטופס העמוד.'
      },
      buildStage({
        title: 'בניית טופס מלא בעמוד contact.html',
        type: 'blocks',
        summary: 'באתרים מקצועיים טפסים מורכבים משתמשים ברשימת Select, תיבות סימון, סרגל טווח (Slider) ובוחר צבע.',
        stepDetails: [
          blockStep({
            title: 'רשימה נפתחת (<select> + <option>) ותיבת סימון (<checkbox>)',
            toolboxCategory: '📋 טפסים וקלט HTML5',
            searchHint: 'בחירה נפתחת',
            blockTitle: '🔽 רשימה נפתחת (Select) + אפשרות (Option) + ☑️ תיבת סימון',
            blockType: 'web_select_container',
            blockXml: `<block type="web_select_container"><statement name="CHILDREN"><block type="web_select_option"><next><block type="web_select_option"></block></next></block></statement><next><block type="web_checkbox"></block></next></block>`,
            explanation: 'בלוק Select מחזיק בתוכו אפשרויות <option>, ותיבת סימון מאפשרת אישור תנאים או שירות נוסף.',
            blockFields: [
              { label: 'Select ID', value: 'serviceType' },
              { label: 'אפשרויות', value: '3–4 בלוקי option בתוך הרשימה' }
            ],
            designFreedomTip: 'תן לתוויות הטופס ריווח עליון עדין ב-📏 מידות.',
            task: 'פתח עמוד contact.html עם טופס מלא והוסף בו "🔽 רשימה נפתחת", אפשרויות ו-"☑️ תיבת סימון".'
          }),
          blockStep({
            title: 'סליידר בחירת טווח (Slider) + בוחר צבע (Color Picker)',
            toolboxCategory: '📋 טפסים וקלט HTML5',
            searchHint: 'סליידר צבע',
            blockTitle: '🎚️ סליידר טווח (Slider) + 🎨 בוחר צבע',
            blockType: 'web_slider_input',
            blockXml: `<block type="web_slider_input"><next><block type="web_color_picker_input"></block></next></block>`,
            explanation: 'שני פקדי HTML5 אינטראקטיביים ללא צורך בקוד: גלילת תקציב/כמות ובחירת צבע אישית.',
            blockFields: [
              { label: 'Slider', value: 'טווח מינימום–מקסימום (למשל 100 עד 1000)' },
              { label: 'Color Picker', value: 'קלט צבע מובנה של הדפדפן' }
            ],
            designFreedomTip: 'סדר את הטופס בשני טורים נקיים (Grid) או בעמודה מרוכזת.',
            task: 'הוסף לטופס את "🎚️ סליידר טווח" ואת "🎨 בוחר צבע" עם תוויות ברורות.'
          })
        ]
      }),
      buildStage({
        title: 'עיצוב מרווח ונגיש של contact.html',
        type: 'design',
        summary: 'מוודאים שהשדות מיושרים, רחבים וברורים בכל מסך.',
        stepDetails: [
          designStep({
            title: 'יישור שדות הטופס וכרטיס הרקע',
            explanation: 'תן לטופס כולו רוחב מקסימלי נוח (כ-600px) ומסגרת נקייה.',
            blockFields: [
              { label: '📏 מידות', value: 'Max Width: 600px ורווח פנימי 24px' }
            ],
            designFreedomTip: 'לשוניות: 📏 מידות • ⭕ מסגרות • 🎨 צבעים',
            task: 'עטוף את הטופס בכרטיס מעוצב ויישר את כל השדות לרוחב מלא.'
          })
        ],
        checklist: [
          'קיים עמוד contact.html מקושר מה-Navbar.',
          'הטופס כולל Select + Options, Checkbox, Slider ובוחר צבע.',
          'כל שדה מתויג ב-Label ברור.'
        ]
      })
    ]
  },

  // מפגש 12: חיבור הטפסים לפעולות מיידיות
  {
    id: 12,
    quarter: 'q2',
    finishedPart: 'שליחת פניות חיה ל-WhatsApp + אישור ואיפוס חכם של הטפסים',
    title: 'חיבור טפסים לפעולה: WhatsApp, התראות ואיפוס שדות',
    goal: 'הופכים את הטפסים באתר לפעילים באמת: שליחת הודעה מעוצבת ל-WhatsApp, הצגת אישור לגולש ואיפוס נקי.',
    stages: [
      {
        title: 'ניסוח הודעת "תודה" והודעת WhatsApp ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מנסחים תבנית הודעה ברורה שהגולש ישלח לעסק.',
        steps: ['בקש מה-AI משפט פתיחה נעים להודעת תודה אחרי שליחת טופס.'],
        prompt: 'כתוב הודעת "תודה שפנית אל [SITE_NAME]" קצרה וחמה שמופיעה לאחר מילוי טופס באתר.',
        expectedResult: 'הודעת אישור מזמינה.'
      },
      buildStage({
        title: 'חיבור פעולות השליחה לכפתורים',
        type: 'blocks',
        summary: 'אירועים בדף מחברים בין לחיצה על כפתור לבין עיבוד שדות הטופס.',
        stepDetails: [
          blockStep({
            title: 'שליחת נתוני הטופס ל-WhatsApp או התראת נתונים',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'וואטסאפ התראה',
            blockTitle: '💬 שלח טופס לוואטסאפ / 📋 הצג נתוני טופס',
            blockType: 'action_send_form_to_whatsapp',
            blockXml: `<block type="action_send_form_to_whatsapp"><next><block type="action_form_alert_data"></block></next></block>`,
            explanation: 'בלוק WhatsApp אוסף את שדות הטופס ופותח הודעה מוכנה לשליחה; בלוק form_alert מציג סיכום מיידי.',
            blockFields: [
              { label: 'טלפון', value: 'קידומת בינלאומית (למשל 972...)' },
              { label: 'מיקום הבלוק', value: 'בתוך כפתור "🚀 שלח" או "🔘 כפתור פעולות"' }
            ],
            designFreedomTip: 'תן לכפתור ה-WhatsApp צבע ירוק עדין או צבע מבטא תואם למותג.',
            task: 'חבר לכפתור השליחה של הטופס "💬 שלח טופס לוואטסאפ" (או "📋 הצג נתוני טופס").'
          }),
          blockStep({
            title: 'הודעת Alert ידידותית + כפתור איפוס טופס (Reset Form)',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'איפוס הודעה',
            blockTitle: '🔔 הודעת התראה + 🔄 איפוס טופס',
            blockType: 'action_alert',
            blockXml: `<block type="action_alert"><next><block type="action_reset_form"></block></next></block>`,
            explanation: 'לגולש מגיע משוב ברור שפנייתו התקבלה (action_alert) וניקוי אוטומטי של השדות (action_reset_form).',
            blockFields: [
              { label: 'טקסט הודעה', value: '"תודה! ההודעה נקלטה בהצלחה"' },
              { label: 'מזהה הטופס לאיפוס', value: 'ה-ID של הטופס' }
            ],
            designFreedomTip: 'הוסף כפתור משני "נקה שדות" בעיצוב עדין ליד כפתור השליחה.',
            task: 'הוסף "🔔 הודעת התראה" ו"🔄 איפוס טופס" כדי להשלים את זרימת הטופס.'
          })
        ]
      }),
      buildStage({
        title: 'בדיקת שליחה מלאה מקצה לקצה',
        type: 'save',
        summary: 'ממלאים את הטופס ב-👁️ תצוגה מלאה ובודקים שכל ההתראות עובדות.',
        stepDetails: [
          saveStep({
            title: 'בדיקת שליחה ואיפוס בתצוגה מלאה',
            explanation: 'מלא שמות ניסיון בטופס ובדוק שהכפתורים מגיבים כמצופה.',
            task: 'פתח 👁️ תצוגה מלאה, מלא את הטופס ב-contact.html ובדוק שליחה ואיפוס.'
          })
        ],
        checklist: [
          'הכפתור שולח/מציג את נתוני הטופס.',
          'מוצגת הודעת משוב ידידותית.',
          'הטופס מתאפס נקי בלחיצה.'
        ]
      })
    ]
  },

  // מפגש 13: ליטוש CSS3 גלובלי
  {
    id: 13,
    quarter: 'q2',
    finishedPart: 'שפה עיצובית ברמת פרמיום בכל עמודי האתר (CSS3 Hover & Effects)',
    title: 'סטודיו CSS3 מתקדם: גרדיאנטים, צלליות ומצבי :hover',
    goal: 'משדרגים את מראה כל עמודי האתר לרמה של Stripe ו-Linear בלי לשנות בלוק HTML אחד.',
    stages: [
      {
        title: 'בחירת השראה עיצובית ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מבקשים המלצה לשילוב צבעים ומידת צללים לפי סגנון התלמיד.',
        steps: ['בקש מ-AI 2 קודי צבע משלימים וגרדיאנט אלגנטי לכפתורים.'],
        prompt: 'עבור האתר "[SITE_NAME]", המלץ על קוד HEX לצבע רקע משני + גרדיאנט אלגנטי לכפתור ראשי.',
        expectedResult: 'פלטת CSS מדויקת לשדרוג.'
      },
      buildStage({
        title: 'הפרדת HTML מעיצוב CSS3 בסטודיו',
        type: 'design',
        summary: 'אותו שלד HTML בדיוק יכול להיראות יוקרתי פי 10 בעזרת מצבי :hover, מסגרות ואפקטים.',
        stepDetails: [
          designStep({
            title: 'שדרוג גרדיאנטים, גבולות עדינים ואפקטי צל',
            explanation: 'עבור על כל הכפתורים והכרטיסיות עם לשוניות המסגרות והאפקטים.',
            blockFields: [
              { label: '⭕ מסגרות', value: 'גבול דק 1px שנותן חדות לכרטיס' },
              { label: '✨ אפקטים', value: 'Box Shadow רך וריחוף :hover' }
            ],
            designFreedomTip: 'לשוניות: 🎨 צבעים • ⭕ מסגרות • ✨ אפקטים • מצב :hover',
            task: 'שדרג את כפתורי האתר והכרטיסיות עם גרדיאנט או גבול חד במצב רגיל ותגובה ב-:hover.'
          }),
          designStep({
            title: 'אחידות בין כל עמודי האתר',
            explanation: 'וודא שלכותרות H1/H2 ולכפתורים הראשיים יש אותו אופי בכל העמודים.',
            blockFields: [
              { label: 'עקביות', value: 'אותם עיגולי פינות ומרווחים בכל עמוד' }
            ],
            designFreedomTip: 'השתמש ב-🎨 סטודיו מוגדל למעלה לעבודה נוחה ומדויקת.',
            task: 'בדוק את 4 העמודים (בית, אודות, קטלוג, צור קשר) ואחד את סגנון הכותרות והכפתורים.'
          })
        ],
        checklist: [
          'הכפתורים והכרטיסיות מגיבים חלק במצב :hover.',
          'נבחרו צבעים, גבולות וצללים אחידים לאורך כל האתר.'
        ]
      })
    ]
  },

  // מפגש 14: אזורים מותאמים אישית בקוד חופשי (HTML & CSS)
  {
    id: 14,
    quarter: 'q2',
    finishedPart: 'אלמנט חתימה אישי בקוד חופשי (Custom HTML & Custom CSS)',
    title: 'הרחבת היכולות: בלוק HTML חופשי ו-CSS חופשי',
    goal: 'לומדים איך הבלוקים מתרגמים ל-HTML ו-CSS אמיתיים דרך "💻 קוד חי", ומוסיפים אלמנט ייחודי אישי.',
    stages: [
      {
        title: 'יצירת רעיון לאפקט CSS אישי ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'יוצרים קטע קצר של HTML/CSS (למשל פס לוגואים רץ או תג זוהר).',
        steps: ['בקש מה-AI דוגמה פשוטה וקצרה לתגית מעוצבת ב-HTML ו-CSS.'],
        prompt: 'כתוב קטע HTML ו-CSS קצר ופשוט לתגית הכרזה זוהרת או פס טקסט מעוצב לאתר "[SITE_NAME]" (מימין לימין).',
        expectedResult: 'רכיב מותאם אישי.'
      },
      buildStage({
        title: 'שילוב בלוקי HTML חופשי ו-CSS חופשי',
        type: 'blocks',
        summary: 'כשרוצים להוסיף אפקט שאין לו בלוק מוכן (כמו אנימציית keyframes), מחברים את בלוקי הקוד החופשי.',
        stepDetails: [
          blockStep({
            title: 'הטמעת קטע משלך עם 🌐 HTML חופשי',
            toolboxCategory: '💻 HTML ו-CSS חופשי',
            searchHint: 'HTML חופשי',
            blockTitle: '💻 HTML חופשי (Custom HTML)',
            blockType: 'web_custom_html',
            explanation: 'מאפשר להכניס כל תגית HTML מיוחדת ישירות לתוך מבנה הדף שלך.',
            blockFields: [
              { label: 'הדבקה', value: 'קוד HTML נקי של האלמנט שבחרת' }
            ],
            designFreedomTip: 'הבט במקביל בטאב "💻 קוד חי" למעלה כדי לראות את הקוד המלא שהבלוקים יוצרים.',
            task: 'פתח "💻 HTML ו-CSS חופשי" משמאל, גרור "💻 HTML חופשי" והכנס בו אלמנט חתימה קטן.'
          }),
          blockStep({
            title: 'אנימציה וחוקי עיצוב מיוחדים ב-🎨 CSS חופשי',
            toolboxCategory: '💻 HTML ו-CSS חופשי',
            searchHint: 'CSS חופשי',
            blockTitle: '🎨 CSS חופשי (Custom CSS)',
            blockType: 'web_custom_css',
            explanation: 'מוסיף כללי עיצוב גלובליים כמו @keyframes אנימציות או משתני עיצוב לכל העמוד.',
            blockFields: [
              { label: 'תוכן CSS', value: 'חוקי עיצוב קצרים או אנימציה' }
            ],
            designFreedomTip: 'אפשר גם לערוך נקודתית בלשונית ה-8 בסטודיו ("💻 CSS חופשי").',
            task: 'הוסף בלוק "🎨 CSS חופשי" לאתר והוסף בו אפקט מעבר או אנימציה עדינה.'
          })
        ]
      }),
      buildStage({
        title: 'השוואת בלוקים מול 💻 קוד חי',
        type: 'save',
        summary: 'מבינים את הקשר הישיר בין כל בלוק לקוד שמתחתיו.',
        stepDetails: [
          saveStep({
            title: 'הצצה ב-💻 קוד חי וגיבוי הקובץ',
            explanation: 'הצץ למעלה ב-"💻 קוד חי" וראה איך הקוד שבנית מסודר.',
            task: 'פתח לרגע "💻 קוד חי" למעלה, חזור לבנייה ושמור גרסה.'
          })
        ],
        checklist: [
          'נעשה שימוש בבלוקי web_custom_html ו-web_custom_css.',
          'ראיתי ב-💻 קוד חי איך הבלוקים נהפכים ל-HTML אמיתי.'
        ]
      })
    ]
  },

  // מפגש 15: התאמה מלאה לכל מסך (Responsive)
  {
    id: 15,
    quarter: 'q2',
    finishedPart: 'אתר רספונסיבי ב-100% במחשב, טאבלט וסמארטפון',
    title: 'עיצוב רספונסיבי מלא: Desktop ➔ Tablet ➔ Mobile',
    goal: 'עוברים עמוד-עמוד וסקשן-סקשן ומתאימים אותם לתצוגה מושלמת בטלפון דרך מצב 📱 מובייל.',
    stages: [
      {
        title: 'איתור בעיות תצוגה במובייל',
        duration: '10 דק׳',
        type: 'design',
        summary: 'סורקים את כל העמודים במסך 📱 מובייל ומזהים כותרות או עמודות צפופות.',
        stepDetails: [
          designStep({
            title: 'תיקון גדלי גופן ופריסה במצב 📱 מובייל',
            explanation: 'כל הגדרה שמשנים כשלשונית 📱 מובייל למעלה פעילה חלה אך ורק על טלפונים.',
            blockFields: [
              { label: 'מצב בסטודיו', value: '📱 מובייל (למעלה בתוך 🎨 עיצוב CSS)' }
            ],
            designFreedomTip: 'הקטן כותרת H1 במובייל ל-28–34px ושנה Flexbox של 2 עמודות ל-Column.',
            task: 'עבור בין 4 העמודים במצב 📱, הקטן כותרות גדולות וסדר עמודות לטור נקי.'
          }),
          saveStep({
            title: 'בדיקת גלילה אפס-תקלות ב-3 מסכים',
            explanation: 'מוודאים שאין חריגה לצדדים באף גודל מסך.',
            task: 'עבור 🖥️ ➔ 📟 ➔ 📱 בכל עמודי האתר ובדוק שהכל יושב במסך בלי גלילה לצד.'
          })
        ],
        checklist: [
          'כל 4 העמודים נבדקו במצב 📱 מובייל.',
          'אין טקסטים חתוכים או גלילה אופקית מיותרת.'
        ]
      }
    ]
  },

  // מפגש 16: סדר בעץ ה-DOM והשקת גרסה 1.0
  {
    id: 16,
    quarter: 'q2',
    finishedPart: 'גרסה 1.0 שלמה ונקייה של אתר רב-עמודי',
    title: 'סידור עץ ה-DOM ב-🌳 שכבות והשקת גרסה 1.0',
    goal: 'מבצעים סדר וארגון בעץ ה-HTML של כל העמודים לקראת כניסת ה-JavaScript והדאטה-בייס במחצית השנייה.',
    stages: [
      {
        title: 'ביקורת עץ האתר (🌳 שכבות)',
        duration: '15 דק׳',
        type: 'save',
        summary: 'מנקים בלוקים מיותרים ונותנים שמות ID ברורים לחלקים המרכזיים.',
        stepDetails: [
          designStep({
            title: 'בדיקת סדר והיררכיה בפאנל 🌳 שכבות',
            explanation: 'באתרים מסודרים רואים בקליק את העץ: header ⬅️ main ⬅️ sections ⬅️ footer.',
            blockFields: [
              { label: 'פאנל המפקח', value: '🌳 שכבות מימין' }
            ],
            designFreedomTip: 'ודא שלסקשנים המרכזיים יש ID ברור (hero, features, pricing, contact).',
            task: 'פתח "🌳 שכבות", בדוק שאין בלוקים תלושים בחוץ והענק ID ברורים לאזורים.'
          }),
          saveStep({
            title: 'שמירה וגיבוי גרסה 1.0 של האתר',
            explanation: 'מייצאים את כל האתר כנקודת ציון מסודרת לפני שמחברים קוד JS ומסד נתונים.',
            task: 'בדוק ב-👁️ תצוגה מלאה את כל הקישורים בין העמודים ושמור את הפרויקט.'
          })
        ],
        checklist: [
          'כל 4 העמודים מחוברים ומסודרים בעץ ה-DOM.',
          'לסקשנים מרכזיים יש ID ברורים.',
          'האתר מוכן לחיבור שכבת האינטראקטיביות (JS) במפגש הבא!'
        ]
      }
    ]
  }
];
