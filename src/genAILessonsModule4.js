// =========================================================================
// 🚀 מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (שיעורים 25-32)
// סוכני AI, מחולל קוד, בדיקות QA, SEO, מצגת פיץ', העלאה לענן ו-Demo Day
// =========================================================================

export const MODULE_4_LESSONS = [
  {
    id: 25,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 25: שילוב סוכן בינה מלאכותית (AI Assistant) באתר',
    duration: '90 דקות',
    icon: '🤖',
    objective: 'חיבור ווידג׳ט עוזר AI אינטראקטיבי שעונה לשאלות הגולשים על מוצרי האתר בהתאם להוראות האפיון (System Prompt) שהגדרנו.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'סוכני AI באתרי אינטרנט: איך צ׳אטבוט חכם מגדיל מכירות ומספק מענה מיידי?' },
      { phase: '20 דק׳', text: 'כתיבת System Prompt לסוכן: הגדרת תפקיד, טון דיבור וידע על מוצרי האתר.' },
      { phase: '35 דק׳', text: 'הטמעת חלונית צ׳אט אינטראקטיבית באתר.' },
      { phase: '20 דק׳', text: 'בדיקת שיחה חיה עם סוכן ה-AI באתר.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב אווטאר רובוט / סוכן AI ב-Canva',
        desc: 'צרו סמל עגול וחמוד שישמש כאייקון של העוזר הדיגיטלי באתר.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת ווידג׳ט AI Assistant ב-WebBlocks Studio',
        desc: 'גררו בלוק AI Chat Widget והגדירו את הודעת הפתיחה וההנחיות.'
      }
    ],
    htmlTasks: [
      {
        title: 'חלונית צ׳אטבוט AI אינטראקטיבית ב-HTML & CSS',
        desc: 'הטמיעו חלונית צ׳אט חכמה בפינת האתר:',
        code: `<div class="ai-widget">
  <button class="ai-toggle-btn" onclick="document.querySelector('.ai-chat-box').classList.toggle('open')">🤖</button>
  
  <div class="ai-chat-box">
    <div class="ai-chat-header">
      <span>עוזר AI חכם | [שם המותג]</span>
      <button onclick="document.querySelector('.ai-chat-box').classList.remove('open')">✕</button>
    </div>
    <div class="ai-chat-messages">
      <div class="msg ai">היי! אני העוזר האישי של האתר 🤖 איך אוכל לעזור לך היום?</div>
    </div>
    <div class="ai-chat-input">
      <input type="text" placeholder="שאל אותי כל שאלה...">
      <button>שלח</button>
    </div>
  </div>
</div>

<style>
  .ai-widget { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
  .ai-toggle-btn {
    width: 60px; height: 60px; border-radius: 50%; background: #6366f1; color: white;
    font-size: 28px; border: none; cursor: pointer; box-shadow: 0 6px 20px rgba(99,102,241,0.4);
  }
  .ai-chat-box {
    display: none; position: absolute; bottom: 70px; right: 0; width: 320px; height: 420px;
    background: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden;
    flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }
  .ai-chat-box.open { display: flex; }
  .ai-chat-header { background: #6366f1; color: white; padding: 12px; font-weight: 800; display: flex; justify-content: space-between; }
  .ai-chat-messages { flex: 1; padding: 16px; overflow-y: auto; text-align: right; }
  .msg.ai { background: #0f172a; padding: 10px 14px; border-radius: 10px; color: #cbd5e1; font-size: 0.9rem; }
  .ai-chat-input { display: flex; padding: 8px; background: #0f172a; border-top: 1px solid #334155; }
  .ai-chat-input input { flex: 1; background: #1e293b; border: 1px solid #475569; color: white; padding: 8px; border-radius: 6px; }
  .ai-chat-input button { background: #6366f1; color: white; border: none; padding: 8px 14px; border-radius: 6px; margin-right: 6px; }
</style>`
      }
    ],
    geminiPrompt: 'כתוב לי System Prompt מפורט לעוזר AI של אתר [שם הנושא שלך]. הגדר: 1. מי הוא (סוכן שירות ידידותי), 2. מה מותר לו לענות (פרטי מוצרים, משלוחים, טיפים), 3. טון דיבור קליל ומנומס בעברית.',
    proChallenge: 'הוסיפו כפתורי שאלות מהירות (Quick Prompts) כמו: "מהם דמי המשלוח?" או "מה המוצר הכי נמכר?".',
    outcomeTitle: 'סוכן AI חי ואינטראקטיבי משולב בתוך האתר',
    outcomeDesc: 'עוזר בינה מלאכותית מותאם אישית שמשדרג את חוויית הלקוח ומספק מענה סביב השעון.',
    previewImg: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
    tags: ['AI Assistant', 'צ׳אטבוט', 'System Prompt', 'בינה מלאכותית']
  },

  {
    id: 26,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 26: מחולל בלוקי HTML ב-AI ליצירת פיצ׳רים ייחודיים',
    duration: '90 דקות',
    icon: '⚡',
    objective: 'שימוש במחולל בלוקי ה-AI (AI Block Generator Modal) בסטודיו ליצירת קומפוננטות מורכבות לפי בקשה טקסטואלית והטמעתן באתר.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'איך עובד מחולל קוד ב-AI: מפרומפט טבעי לרכיב HTML/CSS מוכן.' },
      { phase: '20 דק׳', text: 'ניסוח בקשות מדויקות לרכיבים ייחודיים (ספירה לאחור, מחשבון מחיר, טבלת השוואה).' },
      { phase: '35 דק׳', text: 'יצירת הרכיב עם מחולל ה-AI והטמעתו בדף.' },
      { phase: '20 דק׳', text: 'בדיקת פעולה והתאמת צבעים לשפת המותג.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב באנר לספירה לאחור או מבצע ב-Canva',
        desc: 'צרו באנר מלהיב המכריז על מבצע מוגבל בזמן.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: פתיחת מודאל מחולל ה-AI ב-WebBlocks',
        desc: 'לחצו על הכפתור הסגול ״מחולל בלוקים ב-AI״ והזינו בקשה לרכיב מותאם אישית.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד רכיב ספירה לאחור למבצע (Countdown Timer) שנוצר ב-AI',
        desc: 'הטמיעו טיימר ספירה לאחור שיוצר דחיפות:',
        code: `<div class="countdown-banner">
  <h3>🔥 המבצע מסתיים בעוד:</h3>
  <div class="timer-display">
    <div class="timer-unit"><span id="hours">12</span> שעות</div>
    <div class="timer-unit"><span id="minutes">45</span> דקות</div>
    <div class="timer-unit"><span id="seconds">30</span> שניות</div>
  </div>
</div>

<style>
  .countdown-banner {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white; padding: 24px; border-radius: 16px; text-align: center;
    max-width: 600px; margin: 30px auto; box-shadow: 0 10px 25px rgba(239,68,68,0.3);
  }
  .timer-display { display: flex; justify-content: center; gap: 16px; margin-top: 12px; }
  .timer-unit {
    background: rgba(0,0,0,0.3); padding: 10px 16px; border-radius: 8px; font-weight: 800; font-size: 1.1rem;
  }
  .timer-unit span { font-size: 1.8rem; display: block; }
</style>`
      }
    ],
    geminiPrompt: 'כתוב לי פרומפט מדויק עבור מחולל קוד AI כדי שייצור עבורי טבלת השוואת מחירים (Pricing Table) של 3 חבילות שירות בעיצוב כהה ומודרני.',
    proChallenge: 'שלבו טיימר חי ב-JavaScript שסופר לאחור כל שניה.',
    outcomeTitle: 'קומפוננטת קוד מותאמת אישית שפותחה עם AI מוטמעת באתר',
    outcomeDesc: 'שליטה בכלים מתקדמים ליצירת רכיבי קוד עשירים בעזרת בינה מלאכותית יוצרת.',
    previewImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    tags: ['AI Block Generator', 'קוד אוטומטי', 'רכיבים מתקדמים', 'Countdown']
  },

  {
    id: 27,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 27: מבחן הרספונסיביות הגדול – מובייל, טאבלט ומחשב',
    duration: '90 דקות',
    icon: '📱',
    objective: 'בדיקת האתר השלם בכל גדלי המסכים (Desktop, Tablet, Mobile) בעזרת מצבי התצוגה המפוצלים, ותיקון גדלי טקסטים ומרווחים.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'בדיקות איכות (QA) לאתרים: למה אתר שלא נראה טוב במובייל מאבד לקוחות?' },
      { phase: '25 דק׳', text: 'בדיקה שיטתית של כל דפי האתר במצב 375px (מובייל).' },
      { phase: '30 דק׳', text: 'תיקוני CSS מהירים: גדלי גופנים, גלילה אופקית מיותרת ומרווחים.' },
      { phase: '20 דק׳', text: 'אישור תקינות רספונסיביות מלאה.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: בדיקת התאמת תמונות Canva למסכי מובייל',
        desc: 'וודאו שהטקסטים בתוך התמונות שעיצבתם ב-Canva קריאים גם במסך קטן של טלפון.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: מעבר בין מצבי תצוגה מקדימה',
        desc: 'ב-WebBlocks Studio עברו בין כפתורי המחשב, הטאבלט והסמארטפון ובדקו את כל הרכיבים.'
      }
    ],
    htmlTasks: [
      {
        title: 'חוקי CSS Media Queries למניעת שגיאות מובייל',
        desc: 'הוסיפו חוקים המבטיחים שהאתר לא ייחתך באף מסך:',
        code: `<style>
  /* מניעת גלילה אופקית שוברת */
  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }
  
  /* התאמת גדלי כותרות בסמארטפון */
  @media (max-width: 600px) {
    h1 { font-size: 2rem !important; }
    h2 { font-size: 1.6rem !important; }
    .hero { padding: 50px 16px !important; }
    .features-grid, .cards-grid { gap: 16px !important; }
  }
</style>`
      }
    ],
    geminiPrompt: 'הסבר לי מהן 3 הטעויות הכי נפוצות שגורמות לאתר להיראות שבור במובייל ואיך פותרים אותן ב-CSS בקלות.',
    proChallenge: 'וודאו שאף תמונה או כרטיסייה לא מייצרת פס גלילה אופקי במסך הסמארטפון.',
    outcomeTitle: 'אתר רספונסיבי לחלוטין שעובד מושלם בכל מכשיר ומסך',
    outcomeDesc: 'מעבר מוצלח של מבחן ה-QA הטכני והבטחת חוויית משתמש חלקה בכל גודל תצוגה.',
    previewImg: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1000&q=80',
    tags: ['QA', 'בדיקות רספונסיביות', 'מובייל', 'CSS Debugging']
  },

  {
    id: 28,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 28: אופטימיזציה, נגישות (SEO) ומהירות טעינה',
    duration: '90 דקות',
    icon: '⚡',
    objective: 'שדרוג ביצועי האתר: כיווץ משקל תמונות, הוספת תגיות מטא (Meta Tags) לשיתוף בוואטסאפ וגוגל, תגיות alt לנגישות והגדרת אייקון טאב (Favicon).',
    timeAllocation: [
      { phase: '15 דק׳', text: 'מהירות טעינה ו-SEO: איך לגרום לאתר לטעון בתוך שניה אחת ולהופיע בגוגל?' },
      { phase: '20 דק׳', text: 'הגדרת תגיות Open Graph לשיתוף קישור מעוצב בוואטסאפ.' },
      { phase: '35 דק׳', text: 'הוספת תגיות נגישות alt לכל התמונות והטמעת Favicon.' },
      { phase: '20 דק׳', text: 'בדיקת ביצועים וציון מהירות.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: ייצוא Favicon 32x32 פיקסלים מ-Canva',
        desc: 'קחו את סמל הלוגו שלכם ושמרו אותו בגודל מרובע קטן עם רקע שקוף כ-Favicon.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הגדרת מטא-דאטה ב-WebBlocks Studio',
        desc: 'הזינו את כותרת הדף הרשמית ותיאור האתר לשיתוף ברשתות.'
      }
    ],
    htmlTasks: [
      {
        title: 'תגיות SEO, נגישות ושיתוף מנצח ב-HTML',
        desc: 'הוסיפו בתוך תגית <head> את תגיות המטא המקצועיות:',
        code: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[שם המותג] - האתר הרשמי</title>
  <meta name="description" content="האתר הרשמי של [שם המותג] - מגוון מוצרים איכותיים בעיצוב עתידני.">
  
  <!-- תגיות לשיתוף מעוצב בוואטסאפ ובפייסבוק -->
  <meta property="og:title" content="[שם המותג] 🚀">
  <meta property="og:description" content="היכנסו עכשיו וגלו את המוצרים החדשים!">
  <meta property="og:image" content="hero.png">
  
  <!-- אייקון טאב דפדפן -->
  <link rel="icon" type="image/png" href="logo.png">
</head>`
      }
    ],
    geminiPrompt: 'כתוב לי תיאור מטא (Meta Description) שיווקי באורך 150 תווים עבור אתר [שם הנושא שלך] שיגרום לאנשים ללחוץ על הקישור כשהוא מופיע בגוגל.',
    proChallenge: 'וודאו שלכל תגית img באתר יש מאפיין alt עם תיאור ברור בעברית.',
    outcomeTitle: 'אתר מהיר, מותאם לגוגל (SEO) ומוכן לשיתוף חברתי',
    outcomeDesc: 'תגיות שיתוף מרהיבות לוואטסאפ, Favicon בלשונית הדפדפן ונגישות ברמה גבוהה.',
    previewImg: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=1000&q=80',
    tags: ['SEO', 'Favicon', 'מהירות טעינה', 'Open Graph']
  },

  {
    id: 29,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 29: עיצוב מצגת השקה (Pitch Deck) ב-Canva',
    duration: '90 דקות',
    icon: '📊',
    objective: 'עיצוב מצגת פיץ׳ (Pitch Deck) מקצועית בת 5 שקפים ב-Canva לקראת הצגת הפרויקט באירוע הסיום מול הכיתה והמורים.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'איך מציגים מיזם דיגיטלי ב-3 דקות? מבנה הפיץ׳ המנצח של עולם הסטארטאפים.' },
      { phase: '20 דק׳', text: 'בניית תוכן השקפים בעזרת Gemini: הבעיה, הפתרון, האתר, הטכנולוגיה והחזון.' },
      { phase: '35 דק׳', text: 'עיצוב המצגת ב-Canva עם צילומי מסך מהאתר החי ומוקאפים.' },
      { phase: '20 דק׳', text: 'תרגול דיבור והצגה עצמית קצרה.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: פתיחת מסמך מצגת (1920x1080)',
        location: 'בראש הדף ⬅️ "צור עיצוב" ⬅️ "מצגת (16:9)"',
        desc: 'בחרו תבנית הייטקיסטית ונקייה התואמת לצבעי המותג שלכם.'
      },
      {
        title: 'שלב 2: שקף 1 – שער המיזם ושם היזם',
        desc: 'הציגו את הלוגו, הסלוגן ואת שמכם כמפתח ומעצב האתר.'
      },
      {
        title: 'שלב 3: שקף 2 ו-3 – הבעיה והפתרון + צילומי מסך מהאתר',
        desc: 'הכניסו צילומי מסך חדים של דף הבית, הכרטיסיות וה-Hero Banner שבניתם.'
      },
      {
        title: 'שלב 4: שקף 4 ו-5 – הטכנולוגיה והחזון לעתיד',
        desc: 'ספרו באילו כלים השתמשתם: Canva, AI, WebBlocks, HTML/CSS ומה היעד הבא.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: צילום מסך של האתר החי',
        desc: 'פתחו את ה-Live Preview וצלמו צילום מסך נקי של האתר שלכם לשילוב במצגת.'
      }
    ],
    htmlTasks: [
      {
        title: 'בדיקת מוכנות הקוד להצגה חיה',
        desc: 'וודאו שכל הקישורים עובדים ושהאתר רץ ללא שגיאות קונסול:',
        code: `<!-- בדיקה מהירה: וודאו שכל הדפים מקושרים -->
<a href="index.html">בית</a> | <a href="about.html">אודות</a> | <a href="gallery.html">גלריה</a>`
      }
    ],
    geminiPrompt: 'כתוב לי תסריט פיץ׳ בן דקה וחצי (90 שניות) להצגת פרויקט האתר שלי מול הכיתה. התסריט צריך להיות כריזמטי, מרתק ולהסביר למה האתר הזה ייחודי.',
    proChallenge: 'השתמשו ב-Smartmockups ב-Canva כדי להציג את האתר שלכם בתוך מסך מחשב נייד או סמארטפון אמיתי.',
    outcomeTitle: 'מצגת השקה מקצועית בת 5 שקפים מוכנה להצגה',
    outcomeDesc: 'Pitch Deck מרהיב המשלב צילומי מסך מהאתר החי ומסביר את כל תהליך הפיתוח.',
    previewImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80',
    tags: ['Pitch Deck', 'מצגת השקה', 'Canva Presentation', 'דמו דיי']
  },

  {
    id: 30,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 30: העלאה לאוויר ודומיין חי בענן (Live Deployment)',
    duration: '90 דקות',
    icon: '🌐',
    objective: 'הרגע הגדול הגיע! ייצוא כל קבצי האתר (HTML, CSS, Assets), פרסום חי ברשת בענן וקבלת קישור אינטרנט אמיתי לשיתוף עם משפחה וחברים.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'איך אתר עולה לאוויר? שרתים, אחסון ענן (Hosting) ודומיינים.' },
      { phase: '20 דק׳', text: 'הורדת חבילת הקבצים השלמה (index.html, about.html, תיקיית assets).' },
      { phase: '35 דק׳', text: 'העלאה לשרת ענן בלחיצה אחת וקבלת כתובת URL חיה.' },
      { phase: '20 דק׳', text: 'פתיחת האתר החי בסמארטפון האישי באמצעות סריקת QR Code!' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב באנר השקה רשמי "האתר שלי באוויר!" ב-Canva',
        desc: 'עצבו פוסט חגיגי לסטורי או לוואטסאפ המכריז על עליית האתר לרשת.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: ייצוא פרויקט WebBlocks מלא כ-ZIP',
        desc: 'לחצו על כפתור ״ייצוא פרויקט מלא״ להורדת כל קבצי ה-HTML והעיצובים למחשב.'
      }
    ],
    htmlTasks: [
      {
        title: 'בדיקת קובץ index.html לפני העלאה',
        desc: 'וודאו שכל נתיבי התמונות יחסיים (ללא כונן מקומי כמו C:) כדי שהאתר יעבוד בענן:',
        code: `<!-- נכון: נתיב יחסי תקין לענן -->
<img src="logo.png" alt="לוגו">

<!-- שגוי: נתיב מקומי שלא יעבוד לאחרים ברשת -->
<!-- <img src="file:///C:/Users/.../logo.png"> -->`
      }
    ],
    geminiPrompt: 'כתוב לי הודעת וואטסאפ חגיגית וקצרה לחברים ולמשפחה עם קישור לאתר החדש שהעליתי היום לאוויר, שמזמינה אותם להיכנס ולתת משוב.',
    proChallenge: 'צרו קוד QR ב-Canva המקשר ישירות לכתובת האתר החי שלכם והדפיסו או שמרו בסמארטפון.',
    outcomeTitle: 'האתר רץ חי ברשת עם קישור ציבורי אמיתי!',
    outcomeDesc: 'הפרויקט עלה לאוויר בענן ונגיש לכל אדם בעולם מכל מחשב וסמארטפון.',
    previewImg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    tags: ['Deployment', 'העלאה לאוויר', 'שרת ענן', 'קישור חי']
  },

  {
    id: 31,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 31: יצירת כרטיסיית פרויקט בתיק העבודות האישי',
    duration: '90 דקות',
    icon: '💼',
    objective: 'תיעוד הפרויקט בתיק העבודות (Portfolio Case Study): תיאור האתגר, כלי ה-AI ששימשו בפיתוח, צילומי מסך לפני ואחרי וקישור לאתר החי.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'חשיבותו של תיק עבודות (Portfolio) בקבלה ליחידות טכנולוגיות ועבודה בהייטק.' },
      { phase: '20 דק׳', text: 'כתיבת סיכום Case Study מקצועי בעזרת Gemini.' },
      { phase: '35 דק׳', text: 'עיצוב כרטיסיית הפרויקט בתיק העבודות האישי.' },
      { phase: '20 דק׳', text: 'הוספת הקישור לקורות החיים / פרופיל אישי.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב מוקאפ מרובע לפרויקט ב-Canva',
        desc: 'הציגו את האתר שלכם בתוך מסך מחשב שולחני יפהפה ככרטיס ביקור דיגיטלי.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: שמירת הפרויקט בענן תחת השם הסופי',
        desc: 'וודאו שהפרויקט שמור בחשבונכם עם שם ברור ותאריך סיום.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד כרטיסיית תיק עבודות להטמעה באתר האישי',
        desc: 'כך נראית כרטיסיית הפרויקט שתוכלו להציג בפורטפוליו שלכם:',
        code: `<div class="portfolio-item">
  <img src="project-preview.png" alt="פרויקט גמר" class="portfolio-thumb">
  <div class="portfolio-info">
    <span class="tag">GenAI & Web Development</span>
    <h3>[שם המותג שבנית]</h3>
    <p>אתר אינטרנט מלא ומותג דיגיטלי שפותח מאפס בעזרת כלי בינה מלאכותית, עיצוב ב-Canva וקוד HTML/CSS.</p>
    <div class="tech-stack">
      <span>Canva</span> • <span>Gemini AI</span> • <span>HTML5</span> • <span>CSS3</span>
    </div>
    <a href="https://your-site-link.com" target="_blank" class="live-link">צפה באתר החי 🚀</a>
  </div>
</div>`
      }
    ],
    geminiPrompt: 'כתוב לי פסקת סיכום פרויקט מקצועית (Case Study) לקורות חיים או לתיק עבודות, המתארת את הפרויקט שבניתי: חקר שוק עם AI, מיתוג ב-Canva, ופיתוח אתר רספונסיבי מלא.',
    proChallenge: 'ציינו את האתגר הטכנולוגי הגדול ביותר שנתקלתם בו במהלך הפיתוח ואיך הצלחתם לפתור אותו.',
    outcomeTitle: 'תיעוד פרויקט גמר מלא בתיק העבודות הדיגיטלי',
    outcomeDesc: 'נכס מקצועי יוקרתי שניתן להציג בראיונות, בקבלה למגמות מחשבים ובפני מעסיקים.',
    previewImg: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1000&q=80',
    tags: ['תיק עבודות', 'Portfolio', 'Case Study', 'הייטק']
  },

  {
    id: 32,
    module: 4,
    moduleTitle: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)',
    title: 'מפגש 32: אירוע הסיום: Demo Day ותעודות גמר חגיגיות!',
    duration: '90 דקות',
    icon: '🏆',
    objective: 'מפגש השיא החגיגי של הקורס! הצגת האתרים החיים מול הכיתה והאורחים (Demo Day), משוב שופטים, חלוקת תעודות גמר רשמיות וציון ההצלחה.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'פתיחה חגיגית של יום הדמו והכנת המסכים להצגה.' },
      { phase: '50 דק׳', text: 'במת הפיץ׳: כל תלמיד מציג את המצגת והאתר החי במשך 3 דקות ומקבל מחיאות כפיים ומשוב.' },
      { phase: '15 דק׳', text: 'סיכום המורים, משוב על ההתקדמות המדהימה מתחילת הקורס ועד היום.' },
      { phase: '10 דק׳', text: 'הענקת תעודות מפתח ומעצב GenAI רשמיות וצילום כיתתי משותף!' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: פתיחת מצגת הפיץ׳ ב-Canva במצב Present',
        location: 'בראש הדף ⬅️ "הצג" (Present) / כפתור מסך מלא',
        desc: 'היכנסו למצב מסך מלא והתכוננו להצגת חייכם!'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: פתיחת האתר החי בטאב נפרד',
        desc: 'פתחו את האתר החי והדגימו גלילה, לחיצה על כפתורים ותפריט מובייל.'
      }
    ],
    htmlTasks: [
      {
        title: 'הצגת הקוד הנקי והאתר הפעיל בדפדפן',
        desc: 'הדגימו את מבנה הקוד, תגיות ה-HTML ועיצובי ה-CSS שבניתם:',
        code: `<!-- 🏆 ברכות חמות על סיום מוצלח של 32 מפגשי GenAI Web Track! -->
<!-- עברת מסע מדהים מניצוץ של רעיון ועד אתר אינטרנט חי ברשת! -->`
      }
    ],
    geminiPrompt: 'כתוב לי נאום סיום קצר ומעורר השראה (דקה אחת) להצגת פרויקט הגמר שלי מול הכיתה, המורים וההורים.',
    proChallenge: 'הכינו תשובה קצרה לשאלת שופטים אפשרית: ״מהו הפיצ׳ר הבא שהיית מוסיף לאתר אם היו לך עוד שבועיים?״.',
    outcomeTitle: 'בוגר מסלול GenAI & Web Development + תעודת גמר יוקרתית!',
    outcomeDesc: 'סיום מוצלח של 32 מפגשים מקיפים עם אתר אינטרנט חי, נכסי מיתוג מלאים וידע מעמיק ב-Canva, WebBlocks ו-HTML.',
    previewImg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    tags: ['Demo Day', 'Graduation', 'תעודת סיום', 'הישג ענק']
  }
];
