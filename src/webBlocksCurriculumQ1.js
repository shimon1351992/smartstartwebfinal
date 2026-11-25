import { blockStep, designStep, saveStep, buildStage } from './webBlocksCurriculumHelpers';

export const WEBBLOCKS_Q1_SESSIONS = [
  // מפגש 1: שלד המסמך ומערכת העיצוב של המותג
  {
    id: 1,
    quarter: 'q1',
    finishedPart: 'שלד דף הבית (<body> + <header> / <main> / <footer>)',
    title: 'שלד המסמך ומערכת העיצוב של האתר',
    goal: 'מכינים את מעטפת הדף (<body>) ומחלקים אותו ל-3 אזורים סמנטיים: ראש, תוכן ראשי ותחתית.',
    stages: [
      {
        title: 'בחירת רעיון ומותג ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'קובעים את נושא האתר ושם המותג לפני הבנייה.',
        steps: ['העתק את הפרומפט, קבל שם מותג וסלוגן מה-AI, ובחר פלטת צבעים.'],
        prompt: 'יש לי רעיון לאתר בתחום: "[SITE_TOPIC]". הצע לי שם מותג קצר וקליט וסלוגן של עד 6 מילים.',
        expectedResult: 'שם מותג וסלוגן מוכנים.'
      },
      buildStage({
        title: 'בניית שלד ה-HTML של דף הבית',
        type: 'blocks',
        summary: 'מניחים את קונטיינר הדף הראשי ומחלקים אותו סמנטית — בדיוק כמו ב-Apple ו-Stripe.',
        stepDetails: [
          blockStep({
            title: 'שורש המסמך: 📄 דף ראשי (Container)',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'דף ראשי',
            blockTitle: '📄 דף ראשי (Container)',
            blockType: 'web_page_container',
            blockXml: `<block type="web_page_container"><field name="BG_COLOR">#f8fafc</field><field name="FONT">Heebo, sans-serif</field></block>`,
            explanation: 'בלוק זה הוא תגית <body> — הבסיס שמחזיק את כל העמוד וקובע רקע, גופן ורוחב.',
            blockFields: [
              { label: 'רקע וגופן', value: 'בחר לפי הסגנון שלך (בהיר או כהה)' },
              { label: 'רוחב אתר', value: 'רגיל (1140px) או רחב (1320px)' }
            ],
            designFreedomTip: 'תוכל לשנות רקע וגופן בכל רגע דרך 🎨 צבעים ו-✍️ גופן.',
            task: 'פתח "🧱 מבנה ופריסה" משמאל וגרור את "📄 דף ראשי (Container)" לאזור הבנייה.'
          }),
          blockStep({
            title: 'חלוקת הדף ל-3 אזורים: <header>, <main>, <footer>',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'אזור סמנטי',
            blockTitle: '🧱 אזור סמנטי',
            blockType: 'web_semantic_container',
            blockXml: `<block type="web_semantic_container"><field name="TAG">header</field><next><block type="web_semantic_container"><field name="TAG">main</field><next><block type="web_semantic_container"><field name="TAG">footer</field></block></next></block></next></block>`,
            explanation: 'דף HTML תקני מתחלק תמיד ל-3 אזורים עיקריים: ראש הדף (<header>), תוכן (<main>) ותחתית (<footer>).',
            blockFields: [
              { label: 'אזור 1', value: '<header> (בראש הדף)' },
              { label: 'אזור 2 ו-3', value: '<main> ואחריו <footer>' }
            ],
            designFreedomTip: 'השתמש ב-🌳 שכבות מימין כדי לראות את שלושת האזורים מסודרים.',
            task: 'גרור 3 בלוקי "🧱 אזור סמנטי" לתוך "תוכן הדף", וקבע אותם ל-header, main ו-footer.'
          }),
          blockStep({
            title: 'נשימה והפרדה בין אזורים (מרווח וקו מפריד)',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'מרווח קו מפריד',
            blockTitle: '↕️ מרווח ריק / ➖ קו מפריד',
            blockType: 'web_spacer',
            blockXml: `<block type="web_spacer"><next><block type="web_divider"></block></next></block>`,
            explanation: 'ריווח נקי בין אזורים הוא הסוד לעיצוב יוקרתי וקריא.',
            blockFields: [
              { label: 'מרווח ריק', value: 'יוצר רווח גמיש בלי צבע' },
              { label: 'קו מפריד', value: 'פס עדין בין סקשנים' }
            ],
            designFreedomTip: 'ב-📏 מידות תוכל לכוון גובה ו-Margin מדויקים לכל אזור.',
            task: 'הוסף בלוק "↕️ מרווח ריק" או "➖ קו מפריד" כדי לתת אוויר בין האזורים.'
          })
        ]
      }),
      buildStage({
        title: 'עיצוב מערכת המותג ובדיקת מסכים',
        type: 'design',
        summary: 'מגדירים את אופי האתר ב-8 לשוניות הסטודיו ושומרים נקודת התחלה.',
        stepDetails: [
          designStep({
            title: 'התאמת שפה עיצובית בסטודיו CSS3',
            explanation: 'בחר את "📄 דף ראשי" ב-🌳 שכבות ועצב את הטון הכללי: בהיר כמו Apple, כהה כמו Linear או צבעוני.',
            blockFields: [
              { label: '🎨 צבעים + ✍️ גופן', value: 'צבע רקע וגופן ראשי למותג' }
            ],
            designFreedomTip: 'לשוניות: 🎨 צבעים • ✍️ גופן • 📏 מידות',
            task: 'בחר את השלד בתצוגה החיה ועצב רקע, גופן וריווח לפי הטעם שלך.'
          }),
          saveStep({
            title: 'בדיקה ב-3 מסכים ושמירת גרסת בסיס',
            explanation: 'בודקים בסרגל העליון שהשלד נקי במסך מחשב, טאבלט ומובייל.',
            task: 'לחץ על 🖥️ ➔ 📟 ➔ 📱 ואז 📂 קובץ ⬅️ שמור HTML.'
          })
        ],
        checklist: [
          'הדף מתחיל ב-📄 דף ראשי (<body>).',
          'בתוכו מונחים <header>, <main> ו-<footer> בסדר הנכון.',
          'נבחר סגנון צבעים ופונט מוביל למותג.'
        ]
      })
    ]
  },

  // מפגש 2: אזור הניווט העליון (<header> + <nav>)
  {
    id: 2,
    quarter: 'q1',
    finishedPart: 'אזור הניווט העליון (<header> + <nav>)',
    title: 'סרגל הניווט העליון של האתר (Header & Navbar)',
    goal: 'בונים ומסיימים את סרגל הניווט בראש הדף: לוגו מותג, קישורים וכפתור פעולה.',
    stages: [
      {
        title: 'תכנון תפריט הניווט ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'בוחרים 3–4 שמות קישורים קצרים וברורים לראש האתר.',
        steps: ['העתק את הפרומפט ובחר 4 מילות תפריט קצרות לאתר שלך.'],
        prompt: 'עבור האתר "[SITE_NAME]" ([SITE_TOPIC]), הצע 4 פריטי תפריט קצרים בני מילה-שתיים + טקסט לכפתור ראשי אחד בסרגל.',
        expectedResult: 'רשימת קישורים מדויקת לסרגל.'
      },
      buildStage({
        title: 'בניית ה-Navbar בתוך <header>',
        type: 'blocks',
        summary: 'סרגל הניווט יושב תמיד בתוך <header> — כמו ב-Vercel וב-Airbnb.',
        stepDetails: [
          blockStep({
            title: 'הנחת סרגל ניווט מותאם (Navbar)',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'תפריט ניווט',
            blockTitle: '🧭 סרגל ניווט מותאם',
            blockType: 'web_navbar_custom',
            blockXml: `<block type="web_semantic_container"><field name="TAG">header</field><statement name="CHILDREN"><block type="web_navbar_custom"></block></statement></block>`,
            explanation: 'מחברים את סרגל הניווט ישירות בתוך האזור הסמנטי <header>.',
            blockFields: [
              { label: 'מיקום', value: 'בתוך <header>' },
              { label: 'רקע', value: 'בהיר, שקוף או כהה לבחירתך' }
            ],
            designFreedomTip: 'לשוניות: 📐 פריסה (יישור וגאפ) • 🎨 צבעים',
            task: 'גרור "🧭 סרגל ניווט מותאם" לתוך אזור ה-<header> שבנית במפגש 1.'
          }),
          blockStep({
            title: 'לוגו וקטורי חד (SVG) למותג',
            toolboxCategory: '🎨 מדיה ווקטור',
            searchHint: 'SVG',
            blockTitle: '✨ אייקון וקטורי (SVG)',
            blockType: 'web_svg_icon',
            explanation: 'אייקון SVG נשאר חד בכל רזולוציה ומשדר מותג מקצועי כבר מהשנייה הראשונה.',
            blockFields: [
              { label: 'צבע וגודל', value: 'מותאם לצבע המותג שלך' }
            ],
            designFreedomTip: 'ב-📏 מידות קובעים גודל אחיד (למשל 32px).',
            task: 'הכנס "✨ אייקון וקטורי (SVG)" בתחילת הסרגל כסמל האתר.'
          }),
          blockStep({
            title: 'קישורי ניווט + כפתור קישור ראשי',
            toolboxCategory: '🔘 קישורים ורכיבים',
            searchHint: 'קישור',
            blockTitle: '🔗 קישור / 🔘 כפתור קישור',
            blockType: 'web_link',
            blockXml: `<block type="web_link"><next><block type="web_button_link"></block></next></block>`,
            explanation: 'קישורים רגילים מעבירים לאזורים או לעמודים, וכפתור הקישור מדגיש את הפעולה החשובה ביותר.',
            blockFields: [
              { label: 'קישורים', value: '3–4 קישורים קצרים (בית, יתרונות, צור קשר)' },
              { label: 'כפתור קישור', value: 'קריאה לפעולה בצד הנגדי' }
            ],
            designFreedomTip: 'במצב :hover תוכל לצבוע את הקישור כשעוברים עליו עם העכבר!',
            task: 'הוסף לסרגל 3 בלוקי "🔗 קישור" ו"🔘 כפתור קישור" אחד בולט.'
          })
        ]
      }),
      buildStage({
        title: 'ליטוש :hover והתאמת הסרגל למובייל',
        type: 'design',
        summary: 'מוודאים שהסרגל מגיב בריחוף ונראה מעולה גם בטלפון.',
        stepDetails: [
          designStep({
            title: 'עיצוב מצב :hover ומצב 📱 מובייל לסרגל',
            explanation: 'סמן את הקישורים ואת הסרגל ב-👁️ תצוגה חיה והוסף מעבר צבע נעים ב-:hover.',
            blockFields: [
              { label: ':hover', value: 'שינוי צבע טקסט/כפתור בריחוף' },
              { label: '📱 מובייל', value: 'עטיפה לשורות (wrap) במסך צר' }
            ],
            designFreedomTip: 'לשוניות: 📐 פריסה • 🎨 צבעים • ⭕ מסגרות',
            task: 'עצב צללית/רקע לסרגל במצב רגיל, צבע ריחוף ב-:hover ובדוק תצוגת 📱 מובייל.'
          })
        ],
        checklist: [
          'הסרגל יושב בתוך <header>.',
          'יש אייקון לוגו SVG, קישורים נקיים וכפתור ראשי.',
          'הקישורים מגיבים ב-:hover והסרגל תקין במובייל.'
        ]
      })
    ]
  },

  // מפגש 3: אזור הפתיחה — טקסטים וכפתורים (<section id="hero">)
  {
    id: 3,
    quarter: 'q1',
    finishedPart: 'החלק הטקסטואלי של ה-Hero (<section id="hero">)',
    title: 'אזור הפתיחה (Hero): Badge, כותרת H1 ושורת כפתורים',
    goal: 'בונים בראש ה-<main> את אזור המסר הראשי של האתר: תגית, H1 יחידה בדף, תיאור ושורת CTA.',
    stages: [
      {
        title: 'דיוק מסר ה-Hero ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'כותבים כותרת מנצחת (עד 7 מילים) ומשפט משנה חד.',
        steps: ['בקש מ-AI 3 רעיונות לכותרת H1 חדה שמוכרת את הרעיון בשנייה אחת.'],
        prompt: 'עבור "[SITE_NAME]" ([SITE_TOPIC]), כתוב כותרת H1 של עד 7 מילים ותיאור של שורה אחת בסגנון אתרים מובילים.',
        expectedResult: 'כותרת H1 + תיאור מדויק.'
      },
      buildStage({
        title: 'בניית מבנה ה-Hero בתוך <main>',
        type: 'blocks',
        summary: 'באתרי Stripe ו-Linear הסקשן הראשון ב-<main> תמיד בנוי כך: תגית ← H1 ← פסקה ← שורת כפתורים.',
        stepDetails: [
          blockStep({
            title: 'פתיחת <section id="hero"> + תגית נושא (Badge)',
            toolboxCategory: '📝 טקסטים וכותרות',
            searchHint: 'תגית',
            blockTitle: '🏷️ תגית (Badge)',
            blockType: 'web_badge',
            blockXml: `<block type="web_semantic_container"><field name="TAG">section</field><field name="ELEMENT_ID">hero</field><statement name="CHILDREN"><block type="web_badge"></block></statement></block>`,
            explanation: 'פותחים <section> עם מזהה hero בתוך <main>, ובראשו שמים תגית קטנה שמכריזה על החידוש.',
            blockFields: [
              { label: 'ID הסקשן', value: 'hero (בתוך <main>)' },
              { label: 'תגית', value: 'טקסט קצר של 2–3 מילים' }
            ],
            designFreedomTip: 'לשוניות: 🎨 צבעים • ⭕ מסגרות (עיגול גלולה)',
            task: 'גרור <section> עם מזהה "hero" לתוך <main>, והנח בתוכו "🏷️ תגית (Badge)".'
          }),
          blockStep({
            title: 'כותרת H1 יחידה בדף + פסקת הסבר',
            toolboxCategory: '📝 טקסטים וכותרות',
            searchHint: 'כותרת',
            blockTitle: '✍️ כותרת (h1) + 📝 פסקת טקסט',
            blockType: 'web_heading',
            blockXml: `<block type="web_heading"><field name="TAG">h1</field><next><block type="web_paragraph"></block></next></block>`,
            explanation: 'בגוגל קיים כלל זהב: כותרת H1 אחת בולטת בראש הדף, ומתחתיה פסקה קריאה.',
            blockFields: [
              { label: 'רמת כותרת', value: 'h1' },
              { label: 'פסקה', value: '1–2 משפטים קצרים' }
            ],
            designFreedomTip: 'ב-✍️ גופן תן ל-H1 משקל כבד (800–900) וגודל גדול בהרבה מהפסקה.',
            task: 'גרור מתחת לתגית בלוק "✍️ כותרת" במצב h1 ואחריו "📝 פסקת טקסט".'
          }),
          blockStep({
            title: 'שורת Flexbox עם 2 כפתורים (ראשי ומשני)',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'שורת פלקס',
            blockTitle: '↔️ שורת גמישות (Row Flex) + 🔘 כפתור',
            blockType: 'web_row_flex',
            blockXml: `<block type="web_row_flex"><statement name="CHILDREN"><block type="web_button"><next><block type="web_button_link"></block></next></block></statement></block>`,
            explanation: 'במקום לשים כפתור מתחת לכפתור, מחזיקים את שניהם זה לצד זה בתוך שורת Flex.',
            blockFields: [
              { label: 'כפתור 1', value: 'כפתור פעולה ראשי (CTA)' },
              { label: 'כפתור 2', value: 'קישור משני ("למד עוד")' }
            ],
            designFreedomTip: 'לשוניות: 📐 פריסה (Gap ויישור) • ✨ אפקטים (Hover)',
            task: 'גרור "↔️ שורת גמישות (Row Flex)" והנח בתוכה "🔘 כפתור" ו"🔘 כפתור קישור".'
          })
        ]
      }),
      buildStage({
        title: 'עיצוב טיפוגרפי ל-Hero',
        type: 'design',
        summary: 'מדגישים את ההיררכיה בין התגית, ה-H1, הפסקה והכפתורים.',
        stepDetails: [
          designStep({
            title: 'יצירת ניגודיות ומיקוד ב-Hero',
            explanation: 'בחר רוחב מקסימלי נעים לטקסט ומרווחים ברורים בין אלמנט לאלמנט.',
            blockFields: [
              { label: '✍️ גופן + 📏 מידות', value: 'כותרת גדולה, פסקה ברוחב נוח' }
            ],
            designFreedomTip: 'לשוניות: ✍️ גופן • 🎨 צבעים • 📏 מידות • ✨ אפקטים',
            task: 'עצב את ה-H1, הפסקה ושני הכפתורים בסגנון מנוגד וברור.'
          })
        ],
        checklist: [
          'סקשן hero נמצא בראש ה-<main>.',
          'יש רק כותרת h1 אחת בדף.',
          'שורת הכפתורים מסודרת ב-Row Flex ומגיבה ב-:hover.'
        ]
      })
    ]
  },

  // מפגש 4: הצד הוויזואלי של ה-Hero (<figure> ומדיה עשירה)
  {
    id: 4,
    quarter: 'q1',
    finishedPart: 'הוויזואליה של ה-Hero (תמונה סמנטית / וידאו)',
    title: 'מדיה חכמה ב-Hero: תמונות, <figure> ווידאו',
    goal: 'משלבים תמונה או וידאו איכותי לצד הטקסט של ה-Hero (פריסת Split) בתוך תגית <figure> תקינה.',
    stages: [
      {
        title: 'יצירת תמונת דגל ב-AI',
        duration: '15 דק׳',
        type: 'ai',
        summary: 'מייצרים תמונת מותג נקייה ללא טקסט ושומרים בתיקיית "האתר שלי".',
        steps: ['הרץ את הפרומפט בכלי יצירת תמונות והורד את התוצאה הטובה ביותר.'],
        prompt: 'תמונת מותג מקצועית ומוארת עבור "[SITE_NAME]" בנושא "[SITE_TOPIC]", צילום אולפן חד ויוקרתי ללא טקסט על התמונה.',
        expectedResult: 'קובץ תמונה שמור לשימוש באתר.'
      },
      buildStage({
        title: 'הוספת <figure>, תמונה ווידאו ב-Hero',
        type: 'blocks',
        summary: 'באתרים מובילים כמו Apple ו-Shopify, תמונת המוצר יושבת בתגית <figure> עם alt לגוגל.',
        stepDetails: [
          blockStep({
            title: 'עטיפה בתגית <figure> + בלוק תמונה (alt)',
            toolboxCategory: '🎨 מדיה ווקטור',
            searchHint: 'תמונה figure',
            blockTitle: '🖼️ מסגרת תמונה (Figure) + 🖼️ תמונה',
            blockType: 'web_figure',
            blockXml: `<block type="web_figure"><statement name="CHILDREN"><block type="web_image"></block></statement></block>`,
            explanation: 'תגית <figure> אומרת לדפדפן שמדובר בתוכן ויזואלי עצמאי עם כיתוב מתחתיו.',
            blockFields: [
              { label: 'מקור תמונה', value: 'העלה מהמחשב או הדבק קישור' },
              { label: 'תיאור (alt)', value: 'חובה ל-SEO של גוגל ונגישות!' }
            ],
            designFreedomTip: 'ב-⭕ מסגרות הוסף פינות עגולות, וב-✨ אפקטים צללית עמוקה.',
            task: 'גרור "🖼️ מסגרת תמונה (Figure)" לסקשן hero והכנס לתוכה "🖼️ תמונה" עם תיאור alt.'
          }),
          blockStep({
            title: 'שילוב וידאו HTML5 או הטמעת YouTube (לבחירה)',
            toolboxCategory: '🎨 מדיה ווקטור',
            searchHint: 'וידאו',
            blockTitle: '🎬 וידאו HTML5 / ▶️ הטמעת YouTube',
            blockType: 'web_html5_video',
            blockXml: `<block type="web_html5_video"><next><block type="web_video_embed"></block></next></block>`,
            explanation: 'אם האתר שלך מתאים לתנועה או הדגמה חיה, אפשר להציג סרטון במקום או בנוסף לתמונה.',
            blockFields: [
              { label: 'וידאו HTML5', value: 'נגן מקומי עם שליטה ב-autoplay/controls' },
              { label: 'YouTube', value: 'הדבקת קישור סרטון בקלות' }
            ],
            designFreedomTip: 'כוון יחס רוחב-גובה ב-📏 מידות כדי שהסרטון לא יחרוג במובייל.',
            task: 'התנסה בבלוק "🎬 וידאו HTML5" או "▶️ הטמעת וידאו" (השאר את מה שמתאים לאתר שלך).'
          })
        ]
      }),
      buildStage({
        title: 'פריסה מפוצלת (טקסט + מדיה) והתאמה למובייל',
        type: 'design',
        summary: 'מסדרים את ה-Hero בשתי עמודות על מחשב ובטור אחד במובייל.',
        stepDetails: [
          designStep({
            title: 'מעבר מפריסת שורה במחשב לטור במובייל',
            explanation: 'בחר את קונטיינר ה-Hero ב-🌳 שכבות והפוך אותו לדו-עמודתי במחשב.',
            blockFields: [
              { label: 'רגיל (מחשב)', value: 'שורה (row) — טקסט בצד אחד ומדיה ממול' },
              { label: '📱 מובייל', value: 'טור (column) — אחד מתחת לשני' }
            ],
            designFreedomTip: 'לשוניות: 📐 פריסה • 📏 מידות • ⭕ מסגרות',
            task: 'סדר במחשב טקסט לצד תמונה, ועבור ל-📱 מובייל לוודא שהמדיה מתיישרת למלוא הרוחב.'
          })
        ],
        checklist: [
          'לתמונת ה-Hero יש תיאור alt איכותי.',
          'אזור ה-Hero נראה מרשים בפריסה מפוצלת במחשב.',
          'במובייל הטקסט והתמונה מסתדרים בטור בלי גלילה לצד.'
        ]
      })
    ]
  },

  // מפגש 5: אזור היתרונות והשירותים (<section id="features">)
  {
    id: 5,
    quarter: 'q1',
    finishedPart: 'אזור היתרונות/השירותים (<section id="features">)',
    title: 'גריד כרטיסים ורשימות יתרונות (CSS Grid & Lists)',
    goal: 'בונים את הסקשן השני בדף הבית: כותרת H2 + רשת של 3 כרטיסיות שירות/יתרון ורשימות תבליטים.',
    stages: [
      {
        title: 'ניסוח 3–4 יתרונות מרכזיים ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'כותבים 3 כרטיסיות תוכן אחידות באורכן.',
        steps: ['בקש מה-AI 3 כותרות קצרות + 2 נקודות לכל כרטיסייה.'],
        prompt: 'עבור "[SITE_NAME]" ([SITE_TOPIC]), כתוב 3 יתרונות מרכזיים: לכל יתרון כותרת של 3 מילים, תיאור קצר ו-2 נקודות לרשימה.',
        expectedResult: 'תוכן מאוזן ל-3 כרטיסיות.'
      },
      buildStage({
        title: 'בניית גריד הכרטיסיות בתוך <section id="features">',
        type: 'blocks',
        summary: 'באתרים כמו Stripe ו-Vercel, סקשן התכונות בנוי מ-CSS Grid אוטומטי וכרטיסים זהים.',
        stepDetails: [
          blockStep({
            title: 'יצירת סקשן עם H2 ורשת (Grid Container)',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'רשת גריד',
            blockTitle: '🔲 רשת עמודות (CSS Grid)',
            blockType: 'web_grid_container',
            blockXml: `<block type="web_semantic_container"><field name="TAG">section</field><field name="ELEMENT_ID">features</field><statement name="CHILDREN"><block type="web_heading"><field name="TAG">h2</field><next><block type="web_grid_container"></block></next></block></statement></block>`,
            explanation: 'בלוק CSS Grid מחלק את השטח לעמודות שוות ושומר על יישור סימטרי בכל גודל מסך.',
            blockFields: [
              { label: 'ID הסקשן', value: 'features (אחרי #hero בתוך <main>)' },
              { label: 'כותרת סקשן', value: 'h2 ("למה לבחור בנו?")' }
            ],
            designFreedomTip: 'ב-📐 פריסה קבע עמודות (למשל 3) ומרווח Gap שווה ביניהן.',
            task: 'פתח <section> חדש בשם features בתוך <main>, שים כותרת h2 ומתחתיה "🔲 רשת עמודות".'
          }),
          blockStep({
            title: 'הנחת כרטיסייה (Card) עם אייקון וכותרת H3',
            toolboxCategory: '🧱 מבנה ופריסה',
            searchHint: 'כרטיסייה',
            blockTitle: '📦 כרטיסייה מעוצבת (Card)',
            blockType: 'web_card',
            blockXml: `<block type="web_card"><statement name="CHILDREN"><block type="web_svg_icon"><next><block type="web_heading"><field name="TAG">h3</field></block></next></block></statement></block>`,
            explanation: 'כל פריט ברשת עטוף ב-Card עם אייקון וכותרת H3 (רמה אחת מתחת ל-H2 של הסקשן).',
            blockFields: [
              { label: 'רמת כותרת', value: 'h3 (שמירה על היררכיית HTML)' },
              { label: 'שכפול מהיר', value: 'קליק ימני על הכרטיסייה ⬅️ שכפל 3 פעמים' }
            ],
            designFreedomTip: 'ב-✨ אפקטים הוסף אפקט הרמה עדין במצב :hover על כל כרטיסייה.',
            task: 'בנה כרטיסייה אחת מושלמת עם אייקון + h3 + תיאור, ושכפל אותה ל-3 כרטיסיות בגריד.'
          }),
          blockStep({
            title: 'רשימה מסודרת (<ul> / <li>) בתוך כרטיסייה',
            toolboxCategory: '📊 רשימות וטבלאות',
            searchHint: 'רשימה',
            blockTitle: '📋 רשימה (UL/OL) + • פריט רשימה (LI)',
            blockType: 'web_list_container',
            blockXml: `<block type="web_list_container"><statement name="CHILDREN"><block type="web_list_item"><next><block type="web_list_item"></block></next></block></statement></block>`,
            explanation: 'רשימת תכונות מהירה ב-<ul> ו-<li> קלה לסריקה בעין ומועדפת על מנועי חיפוש.',
            blockFields: [
              { label: 'סוג רשימה', value: 'UL (תבליטים) או OL (מספרים)' }
            ],
            designFreedomTip: 'ב-✍️ גופן התאם רווח שורות נעים לכל <li>.',
            task: 'הוסף לכל כרטיסייה "📋 רשימה" עם 2–3 פריטי "פריט רשימה (<li>)".'
          })
        ]
      }),
      buildStage({
        title: 'איזון עמודות וריחוף כרטיסים',
        type: 'design',
        summary: 'מוודאים שבדסקטופ יש 3 עמודות ובמובייל עמודה אחת נקייה.',
        stepDetails: [
          designStep({
            title: 'עיצוב הכרטיסיות במצב רגיל, :hover ו-📱 מובייל',
            explanation: 'כוון את הגריד והכרטיסיות כך שיהיה אחיד ומאוזן.',
            blockFields: [
              { label: 'מחשב / 📱 מובייל', value: '3 עמודות במחשב ← 1 עמודה במובייל' }
            ],
            designFreedomTip: 'לשוניות: 📐 פריסה • ⭕ מסגרות • ✨ אפקטים',
            task: 'שדרג את צבעי המסגרות והצלליות של הכרטיסיות ובדוק תצוגת מובייל.'
          })
        ],
        checklist: [
          'סקשן #features בנוי עם כותרת h2 וכרטיסיות h3.',
          'הכרטיסיות מסודרות בתוך Grid Container אחיד.',
          'רשימות התבליטים (<ul>/<li>) קריאות ומעוצבות.'
        ]
      })
    ]
  },

  // מפגש 6: אזור תוכן, הוכחה חברתית והטמעה (<section id="showcase">)
  {
    id: 6,
    quarter: 'q1',
    finishedPart: 'סקשן סיפור, המלצות ומדיה (<section id="showcase">)',
    title: 'תוכן עשיר: <article>, <aside>, ציטוטים והטמעות',
    goal: 'מסיימים את סקשן התוכן וההמלצות בעזרת תגיות <article>/<aside>, עיצוב טקסטים סמנטיים, מדדי דירוג והטמעה.',
    stages: [
      {
        title: 'כתיבת המלצת לקוח וסיפור קצר ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מייצרים ציטוט אמין של משתמש ונתון הצלחה מרשים.',
        steps: ['בקש מ-AI המלצה אותנטית קצרה ו-2 תיאורים של חוויית משתמש.'],
        prompt: 'כתוב ציטוט המלצה אמין וקצר של לקוח מרוצה עבור "[SITE_NAME]" ([SITE_TOPIC]), כולל הדגשה של תועלת אחת ברורה.',
        expectedResult: 'טקסט המלצה מוכן להצגה.'
      },
      buildStage({
        title: 'בניית סקשן הוכחה חברתית והעשרת תוכן',
        type: 'blocks',
        summary: 'בלוגים ודפי מוצר בגוגל מפרידים בין <article> (תוכן עיקרי) ל-<aside> (תוכן צד תומך) ומשתמשים בתגיות הדגשה תקניות.',
        stepDetails: [
          blockStep({
            title: 'הפרדת <article> ו-<aside> + ציטוט והדגשה',
            toolboxCategory: '📝 טקסטים וכותרות',
            searchHint: 'ציטוט הדגשה',
            blockTitle: '✨ טקסט סמנטי (blockquote / mark / strong / time)',
            blockType: 'web_text_format',
            blockXml: `<block type="web_semantic_container"><field name="TAG">article</field><statement name="CHILDREN"><block type="web_text_format"></block></statement><next><block type="web_semantic_container"><field name="TAG">aside</field></block></next></block>`,
            explanation: 'בלוק הטקסט הסמנטי נותן משמעות אמיתית לציטוט (blockquote), הדגשת מרקר (mark) או תאריך (time).',
            blockFields: [
              { label: 'סוג תגית', value: 'blockquote לציטוט או mark להדגשה' }
            ],
            designFreedomTip: 'ב-🎨 צבעים ו-⭕ מסגרות תן לציטוט קו צד עבה בצבע המותג.',
            task: 'צור סקשן עם <article> ו-<aside>, והכנס ציטוט והדגשה בעזרת "✨ טקסט סמנטי".'
          }),
          blockStep({
            title: 'מד שביעות רצון / התקדמות + נגן אודיו והטמעת מפה',
            toolboxCategory: '🔘 קישורים ורכיבים',
            searchHint: 'מד התקדמות',
            blockTitle: '📊 מד התקדמות + 🎵 נגן אודיו + 🌐 הטמעת iframe',
            blockType: 'web_progress_meter',
            blockXml: `<block type="web_progress_meter"><next><block type="web_audio_player"><next><block type="web_iframe_embed"></block></next></block></next></block>`,
            explanation: 'אפשר לשלב ב-<aside> מד אחוזי שביעות רצון, נגן אודיו/פודקאסט או מפה מוטמעת.',
            blockFields: [
              { label: 'מד התקדמות', value: 'למשל 98% שביעות רצון' },
              { label: 'אודיו / iframe', value: 'פודקאסט, סאונד או Google Maps' }
            ],
            designFreedomTip: 'ב-🎨 צבעים התאם את צבע המד והמסגרות של הנגן לצבע האתר.',
            task: 'הוסף מדדי דירוג ("📊 מד התקדמות") ובחר אם לשלב נגן אודיו או הטמעת iframe.'
          })
        ]
      }),
      buildStage({
        title: 'עיצוב <article> לצד <aside>',
        type: 'design',
        summary: 'מסדרים יחס של 2:1 בדסקטופ ומעבר טבעי במובייל.',
        stepDetails: [
          designStep({
            title: 'חלוקת רוחב נעימה בין התוכן לצד',
            explanation: 'כוון את העיצוב כך שהציטוט והמדד ימשכו את העין.',
            blockFields: [
              { label: '📏 מידות + 🎨 צבעים', value: 'רקע עדין המבליט את ההמלצה' }
            ],
            designFreedomTip: 'לשוניות: 🎨 צבעים • ⭕ מסגרות • 📐 פריסה',
            task: 'עצב מסגרת צד מודגשת לציטוט ורקע עדין ל-<aside>.'
          })
        ],
        checklist: [
          'נוספו אלמנטי <article> ו-<aside> סמנטיים.',
          'שולבו ציטוט/הדגשה תקניים ומדדי הצלחה.',
          'נשמר קו עיצובי אחיד עם שאר דף הבית.'
        ]
      })
    ]
  },

  // מפגש 7: אזור מחירון / השוואה ושאלות נפוצות (<section id="pricing"> + #faq)
  {
    id: 7,
    quarter: 'q1',
    finishedPart: 'סקשן השוואה/טבלה ושאלות נפוצות (<section id="pricing"> + #faq)',
    title: 'טבלאות HTML5 אמיתיות ואקורדיון שאלות נפוצות (FAQ)',
    goal: 'בונים טבלת השוואה מסודרת (<table>, <thead>, <tbody>, <tfoot>) ורשימת שאלות נפתחות (<details>).',
    stages: [
      {
        title: 'בניית נתוני ההשוואה והשאלות ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מכינים טבלה של 3 חבילות/השוואות ו-3 שאלות ותשובות נפוצות.',
        steps: ['בקש מ-AI טבלה של 3 מסלולים + 3 שאלות שגולשים שואלים.'],
        prompt: 'עבור "[SITE_NAME]" ([SITE_TOPIC]), הכן השוואה קצרה בין 3 מסלולים/אפשרויות + 3 שאלות נפוצות ותשובות קצרות.',
        expectedResult: 'תוכן לטבלה ולאקורדיון.'
      },
      buildStage({
        title: 'בניית טבלה סמנטית ו-FAQ ללא JavaScript',
        type: 'blocks',
        summary: 'אתרים כמו Shopify ו-Linear מציגים מחירון בטבלת HTML מסודרת ושאלות נפתחות בתגית <details>.',
        stepDetails: [
          blockStep({
            title: 'היררכיית טבלה מלאה: Table ➔ Section ➔ Row ➔ Cell',
            toolboxCategory: '📊 רשימות וטבלאות',
            searchHint: 'טבלה',
            blockTitle: '📊 טבלה (Table) + חלק + שורה + תא',
            blockType: 'web_table',
            blockXml: `<block type="web_table"><statement name="CHILDREN"><block type="web_table_section"><statement name="CHILDREN"><block type="web_table_row"><statement name="CHILDREN"><block type="web_table_cell"></block></statement></block></statement></block></statement></block>`,
            explanation: 'טבלה תקנית מורכבת מארבעה חלקים: טבלה ⬅️ ראש/גוף/תחתית (thead/tbody/tfoot) ⬅️ שורה (tr) ⬅️ תא (th/td).',
            blockFields: [
              { label: 'שורת כותרת', value: 'thead עם תאי th מודגשים' },
              { label: 'שורות נתונים', value: 'tbody עם תאי td (ואפילו colspan)' }
            ],
            designFreedomTip: 'צבע את שורת הכותרת בצבע המותג דרך 🎨 צבעים.',
            task: 'בנה טבלה תקנית בת 3 עמודות עם thead, tbody ושורות נתונים ברורות.'
          }),
          blockStep({
            title: 'שאלות נפוצות נפתחות (<details> Accordion)',
            toolboxCategory: '🔘 קישורים ורכיבים',
            searchHint: 'אקורדיון',
            blockTitle: '🪗 אקורדיון פתיחה (Details)',
            blockType: 'web_details_accordion',
            explanation: 'תגית HTML5 חכמה שנפתחת ונסגרת בלחיצה באופן טבעי — בלי לכתוב שורת JavaScript אחת!',
            blockFields: [
              { label: 'כותרת השאלה', value: 'טקסט <summary> שהגולש לוחץ עליו' },
              { label: 'התשובה', value: 'פסקה שנחשפת רק בלחיצה' }
            ],
            designFreedomTip: 'ב-⭕ מסגרות הוסף גבול דק ופינות עגולות לכל שאלה.',
            task: 'צור 3 בלוקי "🪗 אקורדיון פתיחה" עם שאלות ותשובות קצרות.'
          })
        ]
      }),
      buildStage({
        title: 'קריאות טבלאות ועיצוב FAQ',
        type: 'design',
        summary: 'דואגים שהטבלה תהיה קריאה ומרווחת גם במסך צר.',
        stepDetails: [
          designStep({
            title: 'ליטוש ריווחים בטבלה ובשאלות',
            explanation: 'ריווח פנימי נדיב (Padding) בתאי טבלה הוא ההבדל בין טבלה מיושנת לעיצוב מודרני.',
            blockFields: [
              { label: '📏 מידות', value: 'Padding של 12–16px בכל תא' }
            ],
            designFreedomTip: 'לשוניות: 📏 מידות • 🎨 צבעים • ⭕ מסגרות',
            task: 'רווח את תאי הטבלה ועצב את אקורדיון השאלות בקו נקי.'
          })
        ],
        checklist: [
          'הטבלה משתמשת ב-thead, tbody ובכותרת th.',
          '3 שאלות ה-FAQ נפתחות ונסגרות בלחיצה.',
          'הנתונים קריאים במחשב ובמובייל.'
        ]
      })
    ]
  },

  // מפגש 8: אזור יצירת קשר בתחתית הדף וה-Footer
  {
    id: 8,
    quarter: 'q1',
    finishedPart: 'סקשן יצירת קשר + <footer> שלם (סיום דף הבית index.html!)',
    title: 'טופס פנייה ראשוני והשלמת תחתית האתר (Footer)',
    goal: 'סוגרים את דף הבית במבנה שלם: סקשן יצירת קשר עם טופס HTML5 נגיש, ו-<footer> מקצועי עם חזרה לראש הדף.',
    stages: [
      {
        title: 'דיוק הטופס והקישורים בתחתית ב-AI',
        duration: '10 דק׳',
        type: 'ai',
        summary: 'מגדירים כותרת מזמינה ליצירת קשר ואת הטקסט ל-Footer.',
        steps: ['בקש מה-AI טקסט קצר מעל הטופס ושורת זכויות שמורות ל-Footer.'],
        prompt: 'עבור "[SITE_NAME]", כתוב כותרת מזמינה להשארת פרטים + שורת זכויות שמורות קצרה לתחתית האתר.',
        expectedResult: 'קופי נקי לטופס ול-Footer.'
      },
      buildStage({
        title: 'בניית הטופס והשלמת ה-<footer>',
        type: 'blocks',
        summary: 'טופס נגיש ואיכותי תמיד בנוי מ-<form> ⬅️ <fieldset> ⬅️ <label> + שדה קלט + כפתור שליחה.',
        stepDetails: [
          blockStep({
            title: 'מסגרת טופס: Form + Fieldset + Label',
            toolboxCategory: '📋 טפסים וקלט HTML5',
            searchHint: 'טופס קבוצת שדות',
            blockTitle: '📋 טופס (<form>) + 📁 קבוצת שדות + 🏷️ תווית',
            blockType: 'web_form',
            blockXml: `<block type="web_form"><statement name="CHILDREN"><block type="web_fieldset"><statement name="CHILDREN"><block type="web_label"><next><block type="web_input_field"></block></next></block></statement></block></statement></block>`,
            explanation: 'שילוב label ו-fieldset עוזר לכל גולש (וגם לקוראי מסך) להבין בדיוק מה ממלאים בכל שדה.',
            blockFields: [
              { label: 'תווית (Label)', value: 'שם מלא / אימייל' },
              { label: 'קלט (Input)', value: 'סוג text / email' }
            ],
            designFreedomTip: 'תן לטופס כרטיס נקי עם עיגול פינות וצל עדין.',
            task: 'הוסף סקשן אחרון ב-<main>, גרור "📋 טופס", בתוכו "📁 קבוצת שדות", תוויות "🏷️ Label" ושדות קלט.'
          }),
          blockStep({
            title: 'תיבת טקסט רחבה (Textarea) + כפתור שליחה (Submit)',
            toolboxCategory: '📋 טפסים וקלט HTML5',
            searchHint: 'תיבת הודעה שליחה',
            blockTitle: '📝 תיבת הודעה + 🚀 כפתור שליחת טופס',
            blockType: 'web_textarea',
            blockXml: `<block type="web_textarea"><next><block type="web_submit_button"></block></next></block>`,
            explanation: 'תיבת טקסט להודעה ארוכה וכפתור שליחה ייעודי מסוג submit.',
            blockFields: [
              { label: 'טקסט מוקדם', value: 'כתבו לנו במה נוכל לעזור...' },
              { label: 'שליחה', value: 'כפתור Submit בולט בצבע המותג' }
            ],
            designFreedomTip: 'לשוניות: 🎨 צבעים • ⭕ מסגרות • :hover לכפתור.',
            task: 'השלם את הטופס עם "📝 תיבת הודעה" ו"🚀 כפתור שליחת טופס".'
          }),
          blockStep({
            title: 'השלמת תחתית הדף (<footer>) + גלילה לראש הדף',
            toolboxCategory: '⚡ אירועים ו-JS',
            searchHint: 'גלילה לראש הדף',
            blockTitle: '⬆️ גלילה לראש הדף (Scroll Top)',
            blockType: 'action_scroll_top',
            blockXml: `<block type="web_semantic_container"><field name="TAG">footer</field><statement name="CHILDREN"><block type="web_row_flex"><statement name="CHILDREN"><block type="web_paragraph"><next><block type="web_button"><statement name="DO"><block type="action_scroll_top"></block></statement></block></next></block></statement></block></statement></block>`,
            explanation: 'מכניסים לאזור <footer> שנוצר במפגש 1 את פרטי המותג וכפתור נוח שחוזר לראש הדף.',
            blockFields: [
              { label: 'מיקום', value: 'בתוך <footer> (מחוץ ל-<main>)' },
              { label: 'כפתור חזרה', value: 'מפעיל ⬆️ גלילה לראש הדף' }
            ],
            designFreedomTip: 'תן ל-<footer> רקע כהה או בהיר המבדיל אותו מסיום הדף.',
            task: 'השלם את אזור <footer> עם טקסט זכויות, קישורים וכפתור שמפעיל "⬆️ גלילה לראש הדף".'
          })
        ]
      }),
      buildStage({
        title: 'סיום דף הבית (index.html) והשקה ראשונה!',
        type: 'save',
        summary: 'עוברים על כל דף הבית מלמעלה למטה ומייצאים קובץ שלם.',
        stepDetails: [
          saveStep({
            title: 'בדיקה סופית של כל דף הבית index.html',
            explanation: 'תצוגה מלאה על מחשב, טאבלט ומובייל ושמירת העבודה.',
            task: 'לחץ 👁️ תצוגה מלאה, עבור על כל חלקי הדף, בדוק ב-3 גדלי מסך ושמור קובץ HTML.'
          })
        ],
        checklist: [
          'דף הבית בנוי ברצף HTML תקני: <header> ← <main> (Hero, Features, Showcase, Pricing, FAQ, Contact) ← <footer>.',
          'הטופס כולל תוויות ושליחה מסודרים.',
          'ה-<footer> כולל זכויות וכפתור חזרה למעלה, והכל נראה מעולה ב-3 מסכים.'
        ]
      })
    ]
  }
];
