// =========================================================================
// 💻 מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (שיעורים 9-16)
// מסלול כפול: WebBlocks Studio או עורך HTML & CSS
// =========================================================================

export const MODULE_2_LESSONS = [
  {
    id: 9,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 9: הנחת היסודות – Container ושלד HTML ראשון',
    duration: '90 דקות',
    icon: '🏗️',
    objective: 'תחילת שלב הפיתוח המעשי! יצירת שלד הדף הראשון: כיווניות RTL לעברית, מיכל מרכזי (Container), וחיבור צבעי המותג מ-Canva.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'איך עובד דף אינטרנט? HTML לשלד, CSS לעיצוב וסטייל.' },
      { phase: '20 דק׳', text: 'בחירת סביבת העבודה שלכם: WebBlocks (בלוקים) או עורך HTML (קוד).' },
      { phase: '35 דק׳', text: 'פיתוח מעשי: הגדרת מיכל הדף הראשי, כיווניות RTL וצבע הרקע.' },
      { phase: '20 דק׳', text: 'בדיקת Live Preview וראיית הדף הראשון רץ בדפדפן!' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: פתיחת קובץ ספר הצבעים שעיצבתם בשיעור 2',
        location: 'דפדפן ⬅️ canva.com ⬅️ הפרויקטים שלי',
        desc: 'השאירו את טאב ה-Canva פתוח כדי להעתיק את קודי ה-HEX של צבעי המותג שלכם.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: פתיחת סביבת WebBlocks Studio',
        desc: 'פתחו את WebBlocks Studio ולחצו על יצירת פרויקט חדש.'
      },
      {
        title: 'שלב 2: גרירת בלוק דף ראשי (Container)',
        desc: 'מתוך קטגוריית ״שלד ומבנה״, גררו את בלוק ה-Container למשטח העבודה.'
      },
      {
        title: 'שלב 3: הגדרת RTL וצבע רקע',
        desc: 'הגדירו כיווניות עברית (RTL) והדביקו את קוד ה-HEX של צבע הרקע שלכם.'
      }
    ],
    htmlTasks: [
      {
        title: 'כתיבת שלד HTML5 מלא בעורך הקוד',
        desc: 'פתחו את עורך ה-HTML והזינו את השלד הבסיסי:',
        code: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>האתר של [שם המותג]</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a; /* צבע הרקע מה-Canva */
      color: #f8fafc;
      font-family: 'Rubik', sans-serif;
      direction: rtl;
    }
    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="main-container">
    <h1>🚀 האתר שלי באוויר!</h1>
  </div>
</body>
</html>`
      }
    ],
    geminiPrompt: 'הסבר לי בשפה פשוטה וברורה מדוע חשוב להגדיר dir="rtl" בכל אתר בעברית ואיך תגית viewport עוזרת לאתר להיראות טוב בסמארטפון.',
    proChallenge: 'שנו את צבע הרקע וצבע הטקסט ובדקו שהם תואמים בול לספר המותג שלכם ב-Canva.',
    outcomeTitle: 'דף אינטרנט חי ראשון עם כיווניות עברית וצבעי מותג',
    outcomeDesc: 'סביבת העבודה מוכנה והשלד הראשון של האתר רץ בצורה חלקה בדפדפן.',
    previewImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    tags: ['HTML5', 'Container', 'WebBlocks', 'RTL עברית']
  },

  {
    id: 10,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 10: סרגל ניווט עליון (Navbar) והטמעת הלוגו',
    duration: '90 דקות',
    icon: '🧭',
    objective: 'בניית סרגל ניווט עליון רספונסיבי, הטמעת הלוגו שיוצא מ-Canva, הוספת קישורי עמודים וכפתור צור קשר בולט.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'אנטומיה של תפריט ניווט: לוגו מימין, קישורים באמצע וכפתור קריאה לפעולה משמאל.' },
      { phase: '20 דק׳', text: 'חיבור הלוגו שהורדנו מ-Canva לדף האתר.' },
      { phase: '35 דק׳', text: 'פיתוח ב-WebBlocks או HTML: הגדרת תפריט דביק (Sticky) ועיצוב קישורים.' },
      { phase: '20 דק׳', text: 'בדיקת תצוגה מקדימה וריחוף עכבר מעל כפתורי הניווט.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: איתור קובץ הלוגו השקוף (logo.png)',
        location: 'תיקיית ההורדות במחשב',
        desc: 'ודאו שקובץ הלוגו שעיצבתם בשיעור 3 זמין להעלאה לסטודיו.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Navbar בראש הדף',
        desc: 'מתוך קטגוריית ״מבנה״ גררו את בלוק ה-Navbar והניחו אותו ראשון בתוך ה-Container.'
      },
      {
        title: 'שלב 2: הזנת שם המותג וכפתור ה-CTA',
        desc: 'הזינו את שם המותג בשדה הכותרת והגדירו כפתור ״צור קשר 🚀״.'
      }
    ],
    htmlTasks: [
      {
        title: 'בניית Navbar עם Flexbox בקוד HTML & CSS',
        desc: 'הטמיעו את סרגל הניווט העליון:',
        code: `<header class="navbar">
  <div class="nav-brand">
    <span class="brand-icon">⚡</span>
    <span class="brand-title">שם המותג שלי</span>
  </div>
  <nav class="nav-links">
    <a href="#home">בית</a>
    <a href="#products">מוצרים</a>
    <a href="#about">אודות</a>
    <a href="#contact">צור קשר</a>
  </nav>
  <a href="#contact" class="nav-btn">הזמן עכשיו 🚀</a>
</header>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid #334155;
    border-radius: 14px;
  }
  .nav-brand { font-size: 1.3rem; font-weight: 900; color: #38bdf8; }
  .nav-links a { color: #94a3b8; text-decoration: none; margin-left: 20px; font-weight: 600; }
  .nav-links a:hover { color: #38bdf8; }
  .nav-btn {
    background: #4f46e5; color: white; padding: 8px 18px; border-radius: 8px;
    text-decoration: none; font-weight: 700;
  }
</style>`
      }
    ],
    geminiPrompt: 'הצע לי 4 קישורים מנצחים לסרגל ניווט עליון של אתר [שם הנושא שלך] שיגרמו לגולש להבין מיד מה הוא יכול למצוא באתר.',
    proChallenge: 'הגדירו position: sticky ל-Navbar כדי שהוא יישאר נעוץ בראש המסך בזמן גלילה.',
    outcomeTitle: 'סרגל ניווט עליון מרהיב ופעיל עם מיתוג אישי',
    outcomeDesc: 'תפריט עליון מקצועי עם לוגו, קישורי דפים וכפתור הנעה לפעולה מעוצב.',
    previewImg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    tags: ['Navbar', 'סרגל ניווט', 'לוגו', 'Flexbox']
  },

  {
    id: 11,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 11: הטמעת ה-Hero Banner וכותרות ראשיות',
    duration: '90 דקות',
    icon: '⚡',
    objective: 'שילוב הבאנר הראשי (Hero) שעיצבנו ב-Canva ישירות לתוך קוד האתר / WebBlocks, הדגשת כותרת H1 וכפתור CTA אינטראקטיבי.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'החיבור בין העיצוב הגרפי ב-Canva למבנה האתר בקוד.' },
      { phase: '20 דק׳', text: 'הטמעת תמונת הבאנר כרקע או כתמונה מובילה עם טקסט חי.' },
      { phase: '35 דק׳', text: 'בנייה מעשית: יצירת סקשן ה-Hero עם ריווחים פנימיים (Padding).' },
      { phase: '20 דק׳', text: 'בדיקת תצוגה מקדימה והתאמת גדלי טקסט.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: ייבוא תמונת ה-Hero שעיצבתם בשיעור 5',
        location: 'תיקיית assets במחשב ⬅️ hero.png',
        desc: 'ודאו שהתמונה חדה, ביחס 16:9 ומוכנה להטמעה.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Hero ב-WebBlocks Studio',
        desc: 'גררו בלוק Hero Banner מתחת ל-Navbar.'
      },
      {
        title: 'שלב 2: הגדרת תמונת הרקע והכותרת',
        desc: 'הזינו את כותרת ה-H1, תיאור קצר והגדירו את צבע הכפתור הראשי.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד Hero Banner מושלם ב-HTML & CSS',
        desc: 'הטמיעו את הבאנר הראשי עם גרדיאנט רקע וכפתור מודגש:',
        code: `<section class="hero">
  <div class="hero-inner">
    <span class="hero-tag">✨ השקה רשמית</span>
    <h1 class="hero-title">העתיד של [שם המותג] כבר כאן</h1>
    <p class="hero-subtitle">המוצרים המובילים, העיצובים החדשניים והחוויה הכי טובה ברשת.</p>
    <div class="hero-actions">
      <a href="#products" class="btn btn-primary">צפו בקטלוג 🔥</a>
      <a href="#about" class="btn btn-secondary">מי אנחנו ℹ️</a>
    </div>
  </div>
</section>

<style>
  .hero {
    background: radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%);
    padding: 90px 20px;
    text-align: center;
    border-radius: 20px;
    margin: 24px 0;
    border: 1px solid #312e81;
  }
  .hero-tag {
    background: rgba(99, 102, 241, 0.15); color: #818cf8;
    padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem;
  }
  .hero-title { font-size: 3.2rem; font-weight: 900; margin: 20px 0 12px 0; }
  .hero-subtitle { font-size: 1.25rem; color: #94a3b8; max-width: 600px; margin: 0 auto 30px auto; }
  .btn { padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 800; display: inline-block; margin: 0 8px; }
  .btn-primary { background: #6366f1; color: white; }
  .btn-secondary { background: #1e293b; color: #cbd5e1; border: 1px solid #475569; }
</style>`
      }
    ],
    geminiPrompt: 'עבור Hero Section של אתר [שם הנושא שלך], הצע לי 2 כפתורים משלימים (כפתור ראשי לקנייה/הצטרפות וכפתור משני למידע נוסף) עם ניסוחים קצרים ומזמינים.',
    proChallenge: 'הוסיפו אנימציית מעבר קלה לכפתור כך שירחף למעלה (translateY) בעת מעבר עכבר.',
    outcomeTitle: 'באנר ראשי מרשים באוויר עם כותרות וכפתורים',
    outcomeDesc: 'סקשן ה-Hero מוטמע בהצלחה ומשדר מקצועיות ואחידות עם העיצוב ב-Canva.',
    previewImg: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
    tags: ['Hero Section', 'באנר ראשי', 'H1', 'עיצוב כפתורים']
  },

  {
    id: 12,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 12: פריסת גריד ו-Flexbox לכרטיסיות מוצרים',
    duration: '90 דקות',
    icon: '📐',
    objective: 'שליטה בעקרונות פריסת Flexbox ו-CSS Grid: סידור מספר כרטיסיות בשורה, מרווחים אחידים (Gap), ועטיפת שורות אוטומטית (Flex Wrap).',
    timeAllocation: [
      { phase: '15 דק׳', text: 'תורת הפריסה המודרנית: למה Flexbox שינה את עולם בניית האתרים?' },
      { phase: '20 דק׳', text: 'הגדרת שורת כרטיסיות (Row) עם מרווחים אחידים (gap: 20px).' },
      { phase: '35 דק׳', text: 'פיתוח מעשי: בניית הגריד שבו ישבו כרטיסיות המוצרים שלנו.' },
      { phase: '20 דק׳', text: 'בדיקת רספונסיביות בעת הקטנת חלון התצוגה המקדימה.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: פתיחת כרטיסיות ה-Canva שעיצבתם בשיעור 6',
        desc: 'וודאו שהתמונות הריבועיות מוכנות להצבה בתוך הגריד החדש שנפתח.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק שורה (Row Flexbox)',
        desc: 'ב-WebBlocks Studio גררו בלוק Row Flexbox והגדירו Direction ל-Row ו-Gap ל-20px.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד פריסת Flexbox רספונסיבי לכרטיסיות',
        desc: 'הגדירו שורת כרטיסיות שמתקפלת אוטומטית במסכים קטנים:',
        code: `<div class="cards-grid">
  <div class="card-item">כרטיסייה 1</div>
  <div class="card-item">כרטיסייה 2</div>
  <div class="card-item">כרטיסייה 3</div>
</div>

<style>
  .cards-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
    margin: 40px auto;
    max-width: 1200px;
  }
  .card-item {
    flex: 1 1 300px; /* מתרחב ומתכווץ עד מינימום 300px */
    max-width: 360px;
    background: #1e293b;
    border-radius: 16px;
    padding: 24px;
    border: 1px solid #334155;
    text-align: center;
  }
</style>`
      }
    ],
    geminiPrompt: 'הסבר לי איך flex-wrap: wrap עוזר לכרטיסיות להסתדר אחת מתחת לשנייה כשהגולש פותח את האתר בסמארטפון.',
    proChallenge: 'התנסו בשינוי ערך ה-gap בין הכרטיסיות ובדקו איך זה משפיע על האווריריות של הדף.',
    outcomeTitle: 'גריד כרטיסיות רספונסיבי מוכן לקליטת המוצרים',
    outcomeDesc: 'מבנה Flexbox מושלם שמסדר אלמנטים באופן הרמוני ומתאים לכל גודל מסך.',
    previewImg: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1000&q=80',
    tags: ['Flexbox', 'Grid', 'פריסה רספונסיבית', 'Gap']
  },

  {
    id: 13,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 13: הטמעת כרטיסיות המידע והמוצרים המעוצבים',
    duration: '90 דקות',
    icon: '🛍️',
    objective: 'שילוב תמונות ה-Canva הריבועיות בתוך הכרטיסיות, הוספת תגיות מחיר (Badges), כותרות מוצר וכפתורי רכישה / מידע מהיר.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'שילוב תמונות מדויק: חיתוך (object-fit: cover) ופינות מעוגלות.' },
      { phase: '20 דק׳', text: 'הטמעת 3 כרטיסיות מוצר מלאות עם כל הנתונים משיעור 6.' },
      { phase: '35 דק׳', text: 'פיתוח ב-WebBlocks או בעורך HTML ועיצוב תגיות מחיר.' },
      { phase: '20 דק׳', text: 'בדיקת נראות ואיזון גבהים בין הכרטיסיות.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: ייצוא 3 תמונות מוצר מרובעות מ-Canva',
        desc: 'הורידו את שלושת העיצובים משיעור 6 כ-PNG באיכות גבוהה עם שמות קבצים מסודרים (card1.png, card2.png, card3.png).'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הזנת תמונות ותוכן לכרטיסיות',
        desc: 'ב-WebBlocks Studio בחרו בכל כרטיסייה, העלו את תמונת המוצר מ-Canva, עדכנו שם, מחיר ותיאור קצר.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד כרטיסיית מוצר מלאה ב-HTML & CSS',
        desc: 'כרטיסיית מוצר עם תמונה ריבועית, תגית מחיר וכפתור רכישה:',
        code: `<div class="product-card">
  <div class="card-img-wrapper">
    <img src="card1.png" alt="מוצר מוביל">
    <span class="badge">חדש 🔥</span>
  </div>
  <div class="card-body">
    <h3 class="product-title">[שם המוצר שעיצבת]</h3>
    <p class="product-desc">תיאור קצר ומנצח של המוצר שמסביר למה הוא שווה כל שקל.</p>
    <div class="card-footer">
      <span class="price">₪199</span>
      <button class="buy-btn">הזמן עכשיו</button>
    </div>
  </div>
</div>

<style>
  .product-card {
    background: #1e293b;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #334155;
    transition: transform 0.2s, box-shadow 0.2s;
    text-align: right;
  }
  .card-img-wrapper { position: relative; }
  .card-img-wrapper img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .badge {
    position: absolute; top: 12px; right: 12px;
    background: #ec4899; color: white; padding: 4px 10px;
    border-radius: 20px; font-size: 0.75rem; font-weight: 800;
  }
  .card-body { padding: 20px; }
  .product-title { margin: 0 0 8px 0; color: #f8fafc; font-size: 1.15rem; }
  .product-desc { margin: 0 0 16px 0; color: #94a3b8; font-size: 0.85rem; line-height: 1.5; }
  .card-footer { display: flex; justify-content: space-between; align-items: center; }
  .price { font-size: 1.25rem; font-weight: 900; color: #38bdf8; }
  .buy-btn {
    background: #6366f1; color: white; border: none; padding: 8px 16px;
    border-radius: 8px; font-weight: 700; cursor: pointer;
  }
</style>`
      }
    ],
    geminiPrompt: 'כתוב לי 3 תיאורי מוצר שיווקיים וסוחפים באורך שני משפטים כל אחד עבור [שם המוצר שלך], המדגישים את התועלת ללקוח.',
    proChallenge: 'הוסיפו תגית "הנמכר ביותר 🔥" (Best Seller Badge) בפינה העליונה של הכרטיסייה הראשונה.',
    outcomeTitle: 'שלישיית כרטיסיות מוצר/תוכן מעוצבות ומושלמות עם תמונות Canva',
    outcomeDesc: 'כרטיסיות פרימיום עם תמונה ריבועית חדה, כותרת, תגית מחיר וכפתור הנעה לפעולה.',
    previewImg: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
    tags: ['כרטיסיות מוצר', 'Card Component', 'תגיות מחיר', 'UI Design']
  },

  {
    id: 14,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 14: סקשן היתרונות והערך המוסף (Features Grid)',
    duration: '90 דקות',
    icon: '⚡',
    objective: 'בניית סקשן ״למה לבחור בנו?״ (Why Choose Us / Features) עם אייקונים גרפיים, כותרות עוצמתיות וטקסט קצר ומדויק.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'מהו סקשן Features וכיצד הוא בונה ביטחון אצל הגולש?' },
      { phase: '20 דק׳', text: 'ניסוח 3 היתרונות הבולטים ביותר של המיזם שלכם בעזרת Gemini.' },
      { phase: '35 דק׳', text: 'פיתוח גריד 3 עמודות עם אייקונים וכותרות.' },
      { phase: '20 דק׳', text: 'בדיקת רספונסיביות של גריד היתרונות במובייל.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: בחירת או עיצוב 3-4 אייקונים ב-Canva',
        desc: 'צרו 3 סמלים גרפיים מינימליסטיים המייצגים את יתרונות המיזם שלכם (למשל: משלוח מהיר, שירות 24/7, איכות פרימיום).'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Features Grid ב-WebBlocks',
        desc: 'גררו בלוק גריד של 3 עמודות עם אייקון, כותרת ותיאור לכל עמודה.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד סקשן יתרונות (Features Grid) ב-HTML & CSS',
        desc: 'מבנה גריד מודרני בן 3 עמודות עם אייקונים וכותרות:',
        code: `<section class="features-section">
  <h2 class="section-title">למה לבחור בנו? 🚀</h2>
  <div class="features-grid">
    <div class="feature-box">
      <div class="feature-icon">⚡</div>
      <h3>משלוח מהיר במיוחד</h3>
      <p>אספקה לכל הארץ תוך 24-48 שעות ישירות עד פתח הבית.</p>
    </div>
    <div class="feature-box">
      <div class="feature-icon">🛡️</div>
      <h3>100% אחריות מלאה</h3>
      <p>שירות לקוחות זמין ומחויבות מוחלטת לשביעות רצונכם.</p>
    </div>
    <div class="feature-box">
      <div class="feature-icon">✨</div>
      <h3>איכות ללא פשרות</h3>
      <p>חומרי הגלם והטכנולוגיות המתקדמות ביותר בשוק העולמי.</p>
    </div>
  </div>
</section>

<style>
  .features-section { padding: 60px 20px; text-align: center; max-width: 1200px; margin: 0 auto; }
  .section-title { font-size: 2rem; color: #0f172a; margin-bottom: 40px; font-weight: 900; }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  .feature-box {
    background: #ffffff;
    padding: 30px 24px;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s;
  }
  .feature-box:hover { transform: translateY(-5px); }
  .feature-icon { font-size: 2.5rem; margin-bottom: 16px; }
  .feature-box h3 { margin: 0 0 10px 0; color: #1e293b; font-size: 1.2rem; font-weight: 800; }
  .feature-box p { margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.6; }
</style>`
      }
    ],
    geminiPrompt: 'עבור מיזם בתחום [שם הנושא שלך], מהם 3 היתרונות התחרותיים הכי משמעותיים שיגרמו ללקוחות לבחור דווקא בנו? נסח כותרת של 2 מילים והסבר של משפט אחד לכל יתרון.',
    proChallenge: 'הוסיפו מסגרת זוהרת בעדינות (border-gradient) סביב כל יתרון.',
    outcomeTitle: 'סקשן יתרונות בולט (Features) שמבליט את החוזקות של המיזם',
    outcomeDesc: 'גריד 3 עמודות עם אייקונים מעוצבים וכותרות שמשכנעות את הגולש להישאר באתר.',
    previewImg: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
    tags: ['Features', 'יתרונות המותג', 'Grid Layout', 'ערך מוסף']
  },

  {
    id: 15,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 15: סקשן עדויות, המלצות ודירוגים (Social Proof)',
    duration: '90 דקות',
    icon: '⭐',
    objective: 'בניית סקשן חוות דעת של לקוחות מרוצים (Testimonials) עם כוכבי דירוג, ציטוטים אמיתיים ותמונות אווטאר של לקוחות.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'חשיבות ה-Social Proof: למה 90% מהאנשים קונים רק אחרי קריאת ביקורות?' },
      { phase: '20 דק׳', text: 'כתיבת 3 ביקורות אותנטיות בעזרת Gemini.' },
      { phase: '35 דק׳', text: 'פיתוח סקשן עדויות עם כוכבי זהב ואוואטרים.' },
      { phase: '20 דק׳', text: 'בדיקת סידור הכרטיסיות במסך רחב ומובייל.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב אווטארים עגולים ב-Canva',
        desc: 'השתמשו במסגרת עגולה (Frame Circle) ב-Canva כדי לייצא תמונות פרופיל של 3 לקוחות מרוצים.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Testimonials ב-WebBlocks Studio',
        desc: 'גררו בלוק המלצות, הזינו שמות לקוחות, תפקיד, דירוג 5 כוכבים וציטוט נלהב.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד סקשן המלצות לקוחות (Testimonials) ב-HTML & CSS',
        desc: 'כרטיסיות ציטוט עם אווטאר עגול ודירוג כוכבי זהב:',
        code: `<section class="testimonials-section">
  <h2>מה הלקוחות שלנו אומרים? ⭐</h2>
  <div class="testimonials-grid">
    <div class="test-card">
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <p class="quote">״המוצר פשוט שינה לי את החיים! איכות מדהימה ושירות לקוחות שעונה תוך דקות.״</p>
      <div class="author">
        <img src="avatar1.png" alt="דניאל כהן" class="avatar">
        <div>
          <strong>דניאל כהן</strong>
          <span>גיימר ומעצב</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .testimonials-section { padding: 50px 20px; background: #0f172a; color: white; text-align: center; }
  .testimonials-grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 30px; }
  .test-card {
    background: #1e293b; padding: 24px; border-radius: 16px; max-width: 340px;
    border: 1px solid #334155; text-align: right;
  }
  .stars { margin-bottom: 12px; font-size: 1.1rem; }
  .quote { font-style: italic; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px; }
  .author { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
  .author strong { display: block; font-size: 0.95rem; color: #f8fafc; }
  .author span { font-size: 0.78rem; color: #94a3b8; }
</style>`
      }
    ],
    geminiPrompt: 'כתוב לי 3 המלצות אותנטיות ומפרגנות של לקוחות עבור [שם המותג שלך], כולל שמות לקוחות, ציטוט נלהב ודירוג 5 כוכבים.',
    proChallenge: 'הוסיפו סמל גרפי גדול של מרכאות ("") ברקע של כל כרטיסיית עדות בשקיפות עדינה.',
    outcomeTitle: 'סקשן המלצות ודירוגים (Social Proof) שמייצר אמון מיידי',
    outcomeDesc: 'כרטיסיות עדות מעוצבות עם כוכבי זהב, אווטארים וציטוטי לקוחות מרגשים.',
    previewImg: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
    tags: ['Social Proof', 'Testimonials', 'המלצות לקוחות', 'כוכבי דירוג']
  },

  {
    id: 16,
    module: 2,
    moduleTitle: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)',
    title: 'מפגש 16: בניית הפוטר (Footer) וסגירת שלד דף הבית',
    duration: '90 דקות',
    icon: '⚓',
    objective: 'עיצוב ופיתוח תחתית האתר (Footer) עם לוגו המותג, קישורי רשתות חברתיות, זכויות יוצרים ומפת אתר קצרה.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'תפקיד הפוטר: אישור חוקיות, קישורי מדיניות, נגישות ואמון.' },
      { phase: '20 דק׳', text: 'התאמת לוגו בהיר לרקע כהה ב-Canva.' },
      { phase: '35 דק׳', text: 'פיתוח פוטר 3 עמודות עם קישורים וזכויות יוצרים.' },
      { phase: '20 דק׳', text: 'בדיקת גלילה רציפה של כל דף הבית מקצה לקצה!' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: התאמת גרסת לוגו בהירה לפוטר כהה ב-Canva',
        desc: 'ייצאו את הלוגו שלכם עם טקסט לבן/בהיר שיראה מעולה על רקע הפוטר הכהה.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Footer ב-WebBlocks Studio',
        desc: 'גררו בלוק פוטר בתחתית הדף, הוסיפו לוגו, קישורי ניווט ושורת זכויות יוצרים (Copyright).'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד פוטר עשיר ומקצועי (Footer) ב-HTML & CSS',
        desc: 'פוטר בן 3 עמודות עם לוגו, קישורים מהירים ושורת זכויות יוצרים:',
        code: `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-col">
      <h4 class="footer-brand">[שם המותג]</h4>
      <p>המובילים בתחום החדשנות הדיגיטלית וחוויית המשתמש.</p>
    </div>
    <div class="footer-col">
      <h4>קישורים מהירים</h4>
      <ul>
        <li><a href="#hero">ראשי</a></li>
        <li><a href="#features">יתרונות</a></li>
        <li><a href="#products">מוצרים</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>צרו קשר</h4>
      <p>אימייל: info@brand.com</p>
      <p>טלפון: 03-1234567</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 [שם המותג]. כל הזכויות שמורות. נבנה ב-GenAI Web Track 🚀</p>
  </div>
</footer>

<style>
  .site-footer { background: #0b0f19; color: #94a3b8; padding: 50px 20px 20px 20px; text-align: right; border-top: 1px solid #1e293b; }
  .footer-container { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 30px; }
  .footer-col { flex: 1 1 240px; }
  .footer-brand { color: #38bdf8; font-size: 1.4rem; font-weight: 900; margin: 0 0 12px 0; }
  .footer-col h4 { color: #f8fafc; margin: 0 0 14px 0; }
  .footer-col ul { list-style: none; padding: 0; margin: 0; }
  .footer-col ul li { margin-bottom: 8px; }
  .footer-col a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
  .footer-col a:hover { color: #38bdf8; }
  .footer-bottom { text-align: center; border-top: 1px solid #1e293b; margin-top: 40px; padding-top: 20px; font-size: 0.8rem; }
</style>`
      }
    ],
    geminiPrompt: 'כתוב לי שורת זכויות יוצרים מקצועית בעברית עבור אתר [שם המותג שלך], כולל ציון שנה נוכחית ומשפט מגן קצר.',
    proChallenge: 'הוסיפו קישורים לרשתות החברתיות (אינסטגרם, טיקטוק, יוטיוב) עם אפקט מעבר צבע בריחוף.',
    outcomeTitle: 'דף בית שלם, עשיר ומגובש מקצה לקצה - כולל פוטר מקצועי',
    outcomeDesc: 'סיום מודול 2 בהצלחה! דף הבית עומד במלוא תפארתו: Header, Hero, Cards, Features, Reviews ו-Footer.',
    previewImg: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1000&q=80',
    tags: ['Footer', 'פוטר תחתון', 'דף בית מלא', 'זכויות יוצרים']
  }
];
