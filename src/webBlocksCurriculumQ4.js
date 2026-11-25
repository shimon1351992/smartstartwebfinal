import { blockStep, designStep, saveStep, buildStage } from './webBlocksCurriculumHelpers';

export const WEBBLOCKS_Q4_SESSIONS = [
  // מפגש 25: חיבור הדאטה-בייס ויצירת נתוני בסיס (SmartDB)
  {
    id: 25,
    quarter: 'q4',
    finishedPart: 'תשתית מסד הנתונים (SmartDB) + נתוני פתיחה מאותחלים',
    title: 'שכבת הנתונים (SmartDB): הגדרת חיבור ואתחול רשומות',
    goal: 'לומדים להפריד בין התצוגה (HTML) לנתונים (Database) — כמו ב-Airbnb — ומחברים את SmartDB לאתר.',
    stages: [
      {
        title: 'תכנון טבלת הנתונים של האתר ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'קובעים אילו רשומות יישמרו באתר (מוצרים, ביקורות, כתבות, תגובות או הזמנות).',
        steps: ['בקש מה-AI להגדיר 3 רשומות פתיחה לדאטה-בייס של האתר שלך.'],
        prompt: 'עבור האתר "[SITE_NAME]" ([SITE_TOPIC]), הצע שם לטבלת נתונים (Collection) ו-3 רשומות דוגמה עם כותרת ותיאור קצר.',
        expectedResult: '3 רשומות פתיחה מוכנות ל-Seed.'
      },
      buildStage({
        title: 'הגדרת SmartDB ואתחול נתוני דוגמה',
        type: 'blocks',
        summary: 'לפני שמציגים רשימות דינמיות בדף, מגדירים את החיבור לדאטה-בייס וטוענים לתוכו נתוני התחלה (Seed Data).',
        stepDetails: [
          blockStep({
            title: 'הגדרת חיבור מסד נתונים (DB Connect Config)',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'דאטה בייס',
            blockTitle: '🗄️ הגדרת חיבור SmartDB',
            blockType: 'db_connect_config',
            blockXml: `<block type="db_connect_config"><next><block type="db_seed_data"></block></next></block>`,
            explanation: 'בלוק ההגדרה קובע את שם אוסף הנתונים (Collection) ואת מצב השמירה המקומי/שרת.',
            blockFields: [
              { label: 'מצב שמירה', value: 'local (שמירה רציפה בדפדפן) או REST' },
              { label: 'Collection', value: 'שם קצר באנגלית (למשל items / reviews)' }
            ],
            designFreedomTip: 'תשתית הנתונים עובדת ברקע בלי להכביד על העיצוב.',
            task: 'פתח "🗄️ דאטה-בייס ואימות" משמאל, הכנס בראש הדף את "🗄️ הגדרת חיבור SmartDB".'
          }),
          blockStep({
            title: 'טעינת נתוני פתיחה אוטומטית (DB Seed Data)',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'נתוני דוגמה',
            blockTitle: '🌱 אתחול נתוני דוגמה (Seed Data)',
            blockType: 'db_seed_data',
            explanation: 'בלוק Seed ממלא את מסד הנתונים ב-3 רשומות ראשונות כדי שהאתר אף פעם לא ייראה ריק בכניסה ראשונה.',
            blockFields: [
              { label: 'נתונים', value: 'פריטים ראשוניים במבנה נקי (כותרת ותיאור)' }
            ],
            designFreedomTip: 'תוכל להוסיף נתוני דוגמה המותאמים לנושא האתר שלך.',
            task: 'חבר מתחת לבלוק החיבור את "🌱 אתחול נתוני דוגמה" והכנס 2–3 פריטים ראשונים.'
          })
        ]
      }),
      buildStage({
        title: 'בדיקת האתחול',
        type: 'save',
        summary: 'מוודאים שבטעינת הדף הדאטה-בייס נטען ללא שגיאות.',
        stepDetails: [
          saveStep({
            title: 'אימות חיבור ה-DB בתצוגה מלאה',
            explanation: 'פותחים תצוגה מלאה ומתכוננים להצגת הרשימה על המסך במפגש הבא.',
            task: 'בדוק ב-👁️ תצוגה מלאה ושמור גרסה.'
          })
        ],
        checklist: [
          'הוגדר בלוק db_connect_config עם שם Collection ברור.',
          'נשמרו נתוני פתיחה בבלוק db_seed_data.'
        ]
      })
    ]
  },

  // מפגש 26: אזור / עמוד תצוגה דינמית מהדאטה-בייס (db_render_list)
  {
    id: 26,
    quarter: 'q4',
    finishedPart: 'אזור/עמוד תצוגה דינמי הנטען אוטומטית מהדאטה-בייס (db_render_list)',
    title: 'רינדור דינמי מהדאטה-בייס (Render List) אל ה-HTML',
    goal: 'מציגים את הרשומות מתוך SmartDB ישירות לתוך אזור ייעודי באתר בצורה אוטומטית.',
    stages: [
      {
        title: 'חיבור הדאטה-בייס לסקשן תצוגה באתר',
        duration: '15 דק׳',
        type: 'blocks',
        summary: 'במקום להקליד ידנית כל כרטיס, מכינים אזור תצוגה (ID) והדאטה-בייס ממלא אותו אוטומטית בכל הרשומות!',
        stepDetails: [
          blockStep({
            title: 'הצגת רשימה מהדאטה-בייס (DB Render List)',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'הצג רשימה',
            blockTitle: '📜 הצג רשימה מהדאטה-בייס (Render List)',
            blockType: 'db_render_list',
            blockXml: `<block type="web_semantic_container"><field name="TAG">section</field><field name="ELEMENT_ID">dbFeed</field></block>`,
            explanation: 'בלוק Render List לוקח את כל הרשומות מתוך SmartDB ומייצר מהן כרטיסיות מעוצבות בתוך האזור שסימנת.',
            blockFields: [
              { label: 'אזור היעד (ID)', value: 'למשל dbFeed (אזור ריק עם ID)' },
              { label: 'Collection', value: 'אותו שם ממפגש 25' }
            ],
            designFreedomTip: 'עצב את האזור המכיל (dbFeed) כ-Grid או Flex ב-📐 פריסה.',
            task: 'צור סקשן עם ID בשם dbFeed (בעמוד הבית או בעמוד feed.html), והצב את "📜 הצג רשימה מהדאטה-בייס".'
          })
        ]
      },
      buildStage({
        title: 'עיצוב כרטיסיות הפיד הדינמי',
        type: 'design',
        summary: 'מוודאים שהרשומות שנטענות מהדאטה-בייס נראות כחלק טבעי מהעיצוב של האתר.',
        stepDetails: [
          designStep({
            title: 'סגנון האזור המציג ב-📐 פריסה ו-🎨 צבעים',
            explanation: 'כוון ריווח (Gap) וכיוון נקי לסקשן שמחזיק את הרשומות.',
            blockFields: [
              { label: 'פריסה', value: 'Grid או רשימה עם מרווח 16px' }
            ],
            designFreedomTip: 'לשוניות: 📐 פריסה • 🎨 צבעים • 📏 מידות',
            task: 'בדוק ב-👁️ תצוגה מלאה שהנתונים מופיעים מעוצבים וברורים.'
          })
        ],
        checklist: [
          'הרשומות מהדאטה-בייס מופיעות אוטומטית על המסך.',
          'עיצוב הרשימה תואם את שאר האתר.'
        ]
      })
    ]
  },

  // מפגש 27: טופס שמוסיף ושומר נתונים לדאטה-בייס (db_save_record)
  {
    id: 27,
    quarter: 'q4',
    finishedPart: 'טופס פרסום/שמירה חי ששומר רשומות קבועות בדאטה-בייס',
    title: 'שמירת נתונים אמיתית מטופס (db_save_record) + רענון חי',
    goal: 'מחברים טופס הוספה לבלוק db_save_record — הגולש שולח פריט/תגובה, הנתון נשמר לתמיד ומופיע מיד ברשימה!',
    stages: [
      {
        title: 'בניית זרימת הוספה ושמירה חיה',
        duration: '15 דק׳',
        type: 'blocks',
        summary: 'שילוב של טופס HTML5 (ממפגש 8/11) + שמירה בדאטה-בייס + רענון אוטומטי של db_render_list.',
        stepDetails: [
          blockStep({
            title: 'שמור רשומה חדשה בדאטה-בייס (DB Save Record)',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'שמור רשומה',
            blockTitle: '💾 שמור רשומה בדאטה-בייס (Save Record)',
            blockType: 'db_save_record',
            blockXml: `<block type="web_button"><statement name="DO"><block type="db_save_record"><next><block type="db_render_list"></block></next></block></statement></block>`,
            explanation: 'בלוק השמירה קורא את הקלט מהשדות ושומר את הרשומה החדשה; הצמדת Render List מיד אחריו מעדכנת את המסך במקום!',
            blockFields: [
              { label: 'שדות קלט', value: 'ה-ID של שדה הכותרת ושדה התוכן' },
              { label: 'רענון', value: 'הצמדת db_render_list מתחתיו' }
            ],
            designFreedomTip: 'שים את טופס ההוספה לצד הרשימה המתעדכנת כדי שהגולש יראה תוצאה מיידית.',
            task: 'חבר לטופס הוספה את "💾 שמור רשומה בדאטה-בייס" ואחריו את "📜 הצג רשימה מהדאטה-בייס".'
          })
        ]
      },
      buildStage({
        title: 'בדיקת שמירה מתמשכת (Persistence)',
        type: 'save',
        summary: 'מוסיפים רשומה ומוודאים שהיא נשארת שמורה גם אחרי רענון!',
        stepDetails: [
          saveStep({
            title: 'פרסום רשומה ובדיקה בתצוגה מלאה',
            explanation: 'מלא כותרת ותיאור, לחץ פרסם וראה את הפריט מתווסף מיד לדאטה-בייס.',
            task: 'הוסף פריט חדש בתצוגה מלאה, רענן לבדיקת שימור ושמור.'
          })
        ],
        checklist: [
          'מילוי הטופס שומר רשומה אמיתית ב-SmartDB.',
          'הרשימה מתעדכנת מיידית עם הפריט החדש.'
        ]
      })
    ]
  },

  // מפגש 28: עמוד התחברות והרשמה (login.html) ותג משתמש ב-Navbar
  {
    id: 28,
    quarter: 'q4',
    finishedPart: 'עמוד התחברות והרשמה (login.html) + תג משתמש מחובר ב-Navbar',
    title: 'מערכת התחברות והרשמה (Auth) ותג סטטוס משתמש',
    goal: 'בונים עמוד login.html שלם ומוסיפים ל-Navbar תג מצב שמציג בכל עמודי האתר מי מחובר כרגע.',
    stages: [
      {
        title: 'בניית עמוד login.html ותג סשן ב-Navbar',
        duration: '15 דק׳',
        type: 'blocks',
        summary: 'כמו באתרים מובילים, ההתחברות יושבת בעמוד נקי משלה והסטטוס של המשתמש מוצג קבוע בראש האתר.',
        stepDetails: [
          blockStep({
            title: 'פעולת אימות והרשמה (DB Auth Action)',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'התחברות',
            blockTitle: '🔐 התחברות / הרשמה (Auth Action)',
            blockType: 'db_auth_action',
            blockXml: `<block type="web_form"><statement name="CHILDREN"><block type="web_input_field"><next><block type="web_button"><statement name="DO"><block type="db_auth_action"></block></statement></block></next></block></statement></block>`,
            explanation: 'בלוק האימות מאפשר להתחבר או להירשם עם שם משתמש וסיסמה (או התנתקות בלחיצה).',
            blockFields: [
              { label: 'עמוד חדש', value: 'login (התחברות)' },
              { label: 'שדות', value: 'אימייל/שם משתמש + סיסמה' }
            ],
            designFreedomTip: 'עצב את login.html ככרטיס ממורכז נקי (סגנון Apple/Google Login).',
            task: 'פתח עמוד login.html עם כרטיס התחברות וחבר את הכפתור ל-"🔐 התחברות / הרשמה".'
          }),
          blockStep({
            title: 'הוספת תג משתמש מחובר (Session Badge) לסרגל הניווט',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'תג משתמש',
            blockTitle: '👤 תג משתמש מחובר (Session Badge)',
            blockType: 'db_session_badge',
            explanation: 'הבלוק מציג אוטומטית את שם המשתמש המחובר ("שלום, נועה") או כפתור כניסה.',
            blockFields: [
              { label: 'מיקום', value: 'בתוך ה-<header> / Navbar העליון' }
            ],
            designFreedomTip: 'עצב כתג גלולה (Pill) עדין בצבע המותג בפינת הסרגל.',
            task: 'הוסף ל-Navbar שלך את "👤 תג משתמש מחובר".'
          })
        ]
      },
      buildStage({
        title: 'בדיקת זרימת הרשמה ➔ התחברות ➔ הצגה בסרגל',
        type: 'save',
        summary: 'מוודאים שהשם של המשתמש מופיע מיד בתג הסרגל לאחר הכניסה.',
        stepDetails: [
          saveStep({
            title: 'הרשמה והתחברות בתצוגה מלאה',
            explanation: 'נסה להירשם ולהתחבר בעמוד login.html ובדוק את תג המשתמש למעלה.',
            task: 'בצע התחברות בתצוגה מלאה וראה את השם מתעדכן בתג ה-Navbar.'
          })
        ],
        checklist: [
          'קיים עמוד login.html נקי ומעוצב.',
          'תג המשתמש מציג את מצב ההתחברות בראש האתר.'
        ]
      })
    ]
  },

  // מפגש 29: עמוד אזור אישי / פורטל ניהול (portal.html)
  {
    id: 29,
    quarter: 'q4',
    finishedPart: 'עמוד אזור אישי / לוח ניהול שלם (portal.html)',
    title: 'בניית אזור אישי ופורטל ניהול (Portal Dashboard)',
    goal: 'מאחדים בעמוד portal.html אחד את ההתחברות, הוספת הפריטים, התצוגה הדינמית והניהול — ווב אפליקציה מלאה!',
    stages: [
      {
        title: 'שילוב לוח ניהול שלם ב-portal.html',
        duration: '15 דק׳',
        type: 'blocks',
        summary: 'דף הפורטל משלב סיכום סטטוס למעלה, טופס יצירה בצד אחד, ורשימת הרשומות בצד השני.',
        stepDetails: [
          blockStep({
            title: 'הקמת הדשבורד ב-portal.html',
            toolboxCategory: '🗄️ דאטה-בייס ואימות',
            searchHint: 'רשימה שמור',
            blockTitle: '🗄️ לוח ניהול: Auth + Render List + Save Record',
            blockType: 'db_render_list',
            blockXml: `<block type="web_grid_container"><statement name="CHILDREN"><block type="web_card"><statement name="CHILDREN"><block type="db_session_badge"><next><block type="db_save_record"></block></next></block></statement><next><block type="web_card"><statement name="CHILDREN"><block type="db_render_list"></block></statement></block></next></block></statement></block>`,
            explanation: 'בעמוד portal.html מרכזים תג משתמש, כפתור התנתקות, טופס ניהול ורשימה חיה מחוברים לאותו מקור נתונים.',
            blockFields: [
              { label: 'עמוד חדש', value: 'portal (אזור אישי)' },
              { label: 'פריסה', value: '2 עמודות בדסקטופ (Grid) ועמודה במובייל' }
            ],
            designFreedomTip: 'עצב את הפורטל בסגנון נקי כמו לוח הבקרה של Linear או Shopify.',
            task: 'פתח עמוד portal.html, הוסף קישור אליו מה-Navbar ובנה דשבורד דו-עמודתי עם תג משתמש, טופס ורשימה.'
          })
        ]
      },
      buildStage({
        title: 'בדיקת הפורטל המלא',
        type: 'save',
        summary: 'עוברים על החוויה המלאה מהתחברות ועד ניהול נתונים בפורטל.',
        stepDetails: [
          saveStep({
            title: 'בדיקת זרימה מלאה ב-portal.html',
            explanation: 'ודא שכל הפעולות בפורטל מסונכרנות עם הדאטה-בייס.',
            task: 'בדוק התחברות, הוספת פריט והתנתקות מתוך הפורטל ושמור.'
          })
        ],
        checklist: [
          'עמוד portal.html מקושר ומעוצב כדשבורד.',
          'שמירה ותצוגה של נתונים עובדות חלק בפורטל.'
        ]
      })
    ]
  },

  // מפגש 30: ביקורת SEO לגוגל ונגישות ב-קוד חי
  {
    id: 30,
    quarter: 'q4',
    finishedPart: 'הסמכת איכות SEO ונגישות בכל עמודי האתר (מוכן לגוגל!)',
    title: 'אופטימיזציית HTML למנועי חיפוש (SEO) ונגישות',
    goal: 'בודקים את האתר דרך העיניים של גוגל ב-"💻 קוד חי" ו-"🌳 שכבות": סדר כותרות H1←H2←H3, תיאורי alt ותגיות סמנטיות.',
    stages: [
      {
        title: 'בדיקת SEO ונגישות ברמת מפתח בכיר',
        duration: '15 דק׳',
        type: 'design',
        summary: '4 הבדיקות שכל אתר מוביל בגוגל עובר לפני עלייה לאוויר.',
        stepDetails: [
          designStep({
            title: 'צ׳קליסט SEO במבט על 💻 קוד חי ו-🌳 שכבות',
            explanation: 'בודקים 4 דברים בכל עמוד: (1) H1 יחידה בראש <main>, (2) סדר H2/H3 תקין, (3) alt לכל תמונה, (4) תגיות סמנטיות.',
            blockFields: [
              { label: '💻 קוד חי', value: 'וידוא קיום header, main, footer ו-alt' },
              { label: '🌳 שכבות', value: 'וידוא שרק כותרת אחת מוגדרת כ-h1' }
            ],
            designFreedomTip: 'לא נוגעים בעיצוב שעובד — רק מדייקים סמנטיקה וניגודיות צבעים.',
            task: 'עבור על כל עמוד דרך "💻 קוד חי" ו-"🌳 שכבות" ותקן כל alt חסר או רמת כותרת.'
          })
        ],
        checklist: [
          'בכל עמוד יש בדיוק H1 אחת ברורה.',
          'לכל התמונות יש תיאור alt איכותי.',
          'לכל האתר יש תגיות סמנטיות נקיות (header/nav/main/section/footer).'
        ]
      }
    ]
  },

  // מפגש 31: ייצוא סופי, בדיקת קצה לקצה והכנת הצגה
  {
    id: 31,
    quarter: 'q4',
    finishedPart: 'חבילת האתר המוגמרת (כל העמודים מיוצאים ומאומתים)',
    title: 'הכנות להשקה: בדיקת קצה לקצה (E2E) וייצוא מלא',
    goal: 'עוברים על כל 6 העמודים מההתחלה עד הסוף ב-3 גדלי מסך, מייצאים את הפרויקט ומכינים דקת הצגה.',
    stages: [
      {
        title: 'כתיבת פיץ׳ הצגה קצר ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מכינים 3 נקודות קצרות להציג מחר/במפגש הסיום.',
        steps: ['בקש מה-AI טקסט הצגה של 45 שניות להצגת הפרויקט שלך בכיתה.'],
        prompt: 'עזור לי להכין הצגה קצרה של 45 שניות לפרויקט "[SITE_NAME]" ([SITE_TOPIC]): הבעיה, העיצוב שבחרתי ומה האתר יודע לעשות.',
        expectedResult: 'טקסט הצגה חד ובטוח.'
      },
      buildStage({
        title: 'ייצוא סופי של כל קבצי האתר',
        type: 'save',
        summary: 'בדיקה סופית של ניווט, טפסים, JS, DB ו-3 גדלי מסך.',
        stepDetails: [
          saveStep({
            title: 'ייצוא ושמירה סופית מתוך תפריט 📂 קובץ',
            explanation: 'מורידים לתיקיית "האתר שלי" את הקובץ המלא והמעודכן ביותר.',
            task: 'בדוק ב-👁️ תצוגה מלאה במחשב/טאבלט/מובייל וייצא דרך 📂 קובץ.'
          })
        ],
        checklist: [
          'כל הקישורים בין העמודים עובדים בלי תקלה.',
          'האתר מיוצא ושמור בתיקיית הפרויקט.',
          'ההצגה הקצרה שלי מוכנה.'
        ]
      })
    ]
  },

  // מפגש 32: Demo Day — השקת האתר המלא!
  {
    id: 32,
    quarter: 'q4',
    finishedPart: 'האתר השלם שלך באוויר — מוצג בגאווה ב-Demo Day!',
    title: 'Demo Day: השקת האתר השלם!',
    goal: 'מציגים את האתר השלם שנבנה שלב אחר שלב: משלד HTML5 סמנטי ← עיצוב CSS3 חופשי ← אינטראקציות JS ← מסד נתונים והתחברות.',
    stages: [
      {
        title: 'הצגת הפרויקט המוגמר',
        duration: '20 דק׳',
        type: 'save',
        summary: 'כל תלמיד מציג בגאווה את האתר שלו מ-index.html ועד הפורטל.',
        stepDetails: [
          saveStep({
            title: 'חגיגת Demo Day: מצג האתר המלא ב-👁️ תצוגה מלאה',
            explanation: 'פותחים את האתר ב-👁️ תצוגה מלאה ומציגים: דף הבית, קטלוג/מודאל, טופס/ווידג׳ט, התחברות ופורטל.',
            task: 'הפעל "👁️ תצוגה מלאה", הצג את האתר שיצרת מהיסוד וקבל מחיאות כפיים!'
          })
        ],
        checklist: [
          'הצגתי את האתר שלי שלב-אחר-שלב ב-Demo Day.',
          'האתר משלב HTML5 סמנטי, CSS3 בעיצוב עצמי, JS אינטראקטיבי ודאטה-בייס!'
        ]
      }
    ]
  }
];
