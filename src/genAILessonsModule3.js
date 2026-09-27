// =========================================================================
// 🌐 מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (שיעורים 17-24)
// שדרוג חוויית המשתמש, וואטסאפ, טפסים, גלריות, תפריט מובייל ו-FAQ
// =========================================================================

export const MODULE_3_LESSONS = [
  {
    id: 17,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 17: יצירת והטמעת סרטון תדמית מונפש מ-Canva',
    duration: '90 דקות',
    icon: '🎬',
    objective: 'יצירת סרטון אנימציה קצר ב-Canva Video (באורך 5-10 שניות) והטמעתו באתר באמצעות תגית <video> או iframe עם ניגון אוטומטי לופ.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'איך וידאו מגדיל המרות באתר ב-80%?' },
      { phase: '25 דק׳', text: 'יצירת סרטון תדמית מונפש ב-Canva Video (1920x1080) וייצוא כ-MP4.' },
      { phase: '30 דק׳', text: 'הטמעת הווידאו עם מאפייני autoplay, muted, loop ו-playsinline.' },
      { phase: '20 דק׳', text: 'בדיקת ניגון חלק ללא תקיעות בכל הדפדפנים.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: יצירת סרטון וידאו (1920x1080) ב-Canva',
        desc: 'בחרו תבנית וידאו קצרה, שלבו את הלוגו ואפקטי אנימציית טקסט דינמיים, והורידו כקובץ MP4.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Video ב-WebBlocks Studio',
        desc: 'גררו בלוק Video והגדירו מצב Autoplay, Muted ו-Loop לרקע חי.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד הטמעת סרטון רקע מונפש (Video Background) ב-HTML',
        desc: 'תגית video עם מאפייני autoplay, muted, loop ו-playsinline:',
        code: `<div class="video-container">
  <video autoplay muted loop playsinline class="bg-video">
    <source src="promo-video.mp4" type="video/mp4">
  </video>
  <div class="video-overlay">
    <h2>חוויה שלא הכרתם ✨</h2>
    <p>גלו את הדור הבא של [שם המותג]</p>
  </div>
</div>

<style>
  .video-container { position: relative; width: 100%; height: 350px; overflow: hidden; border-radius: 18px; margin: 30px 0; }
  .bg-video { width: 100%; height: 100%; object-fit: cover; }
  .video-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: white; text-align: center;
  }
</style>`
      }
    ],
    geminiPrompt: 'הצע לי תסריט קצרצר בן 3 שקפים לסרטון תדמית מונפש ב-Canva של 7 שניות עבור אתר [שם הנושא שלך].',
    proChallenge: 'הוסיפו שכבת כיסוי כהה שקופה (Overlay) מעל הווידאו כדי שהטקסטים שמעליו יהיו קריאים תמיד.',
    outcomeTitle: 'סרטון תדמית מונפש מ-Canva מוטמע ורץ באתר',
    outcomeDesc: 'שדרוג מולטימדיה משמעותי שהופך את האתר לחווייתי, חי ודינמי.',
    previewImg: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
    tags: ['וידאו', 'Canva Video', 'תגית video', 'אנימציה']
  },

  {
    id: 18,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 18: מיקרו-אנימציות ואפקטי ריחוף (Hover & Transitions)',
    duration: '90 דקות',
    icon: '✨',
    objective: 'שדרוג חוויית המשתמש (UX) עם אנימציות CSS מתקדמות: אפקט ריחוף כפתורים, הגדלת כרטיסיות (Scale), מעברי צבע חלקים וצללים דינמיים.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'מהן מיקרו-אינטראקציות וכיצד הן יוצרות תחושת יוקרה ומהירות באתר?' },
      { phase: '20 דק׳', text: 'עקרונות ה-transition ב-CSS: משך זמן (duration) וסוג תנועה (ease-in-out).' },
      { phase: '35 דק׳', text: 'פיתוח אפקטי :hover על כפתורים, תמונות וכרטיסיות.' },
      { phase: '20 דק׳', text: 'בדיקת ריחוף עכבר חלקה ומהנה בדפדפן.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: השראת תנועה מ-Canva',
        desc: 'בחנו את אפקטי המעבר ב-Canva והחליטו על סגנון תנועה אלגנטי ולא מוגזם לאתר.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: החלת אפקט Hover ב-WebBlockDesignPanel',
        desc: 'סמנו את כרטיסיות המוצרים והגדירו אפקט Hover של שינוי צל וריחוף.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד אנימציות ריחוף חלקות ב-CSS',
        desc: 'הוסיפו אפקט הרמה יוקרתי לכרטיסיות ולכפתורים:',
        code: `<style>
  /* כרטיסייה שמתרוממת בעדינות עם צל עמוק */
  .interactive-card {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
    cursor: pointer;
  }
  .interactive-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 35px rgba(56, 189, 248, 0.2);
  }

  /* כפתור זוהר שמתרחב קלות */
  .glow-btn {
    transition: all 0.25s ease;
  }
  .glow-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
    filter: brightness(1.1);
  }
</style>`
      }
    ],
    geminiPrompt: 'הסבר לי איך להשתמש במאפיין transition ב-CSS בצורה נכונה שלא תאט את האתר ולא תעשה סחרחורת למשתמש.',
    proChallenge: 'הוסיפו אפקט זום קל (overflow: hidden + transform: scale(1.08)) לתמונת המוצר בלבד בזמן מעבר עכבר.',
    outcomeTitle: 'אתר אינטראקטיבי, חי ותגובתי לכל תנועת עכבר',
    outcomeDesc: 'מעברי צבע חלקים, ריחוף כרטיסיות ותחושת פרימיום ברמה בינלאומית.',
    previewImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    tags: ['Hover', 'Transition', 'מיקרו-אנימציות', 'UI/UX']
  },

  {
    id: 19,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 19: אינטגרציית וואטסאפ ושיחה ישירה',
    duration: '90 דקות',
    icon: '💬',
    objective: 'חיבור כפתור וואטסאפ צף (Floating WhatsApp Widget) עם הודעת פתיחה מותאמת אישית שנשלחת ישירות לטלפון של בעל העסק.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'איך עובד קישור וואטסאפ ישיר? פרוטוקול wa.me והודעות מוכנות מראש.' },
      { phase: '20 דק׳', text: 'ניסוח הודעת פתיחה שיווקית ומזמינה בעזרת Gemini.' },
      { phase: '35 דק׳', text: 'פיתוח כפתור וואטסאפ צף בפינת המסך (fixed position).' },
      { phase: '20 דק׳', text: 'בדיקת פתיחת שיחת וואטסאפ בלחיצה אחת מהאתר!' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: ייצוא אייקון וואטסאפ ירוק וחד מ-Canva',
        desc: 'הורידו את סמל הוואטסאפ הרשמי בפורמט PNG שקוף.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: שימוש בבלוק WhatsApp Button',
        desc: 'גררו בלוק WhatsApp Button, הזינו את מספר הטלפון והודעת הפתיחה.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד כפתור וואטסאפ צף בפינת המסך',
        desc: 'הטמיעו כפתור צף קבוע בפינה הימנית או השמאלית:',
        code: `<!-- כפתור וואטסאפ צף -->
<a href="https://wa.me/972501234567?text=%D7%94%D7%99%D7%99%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%9E%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%F0%9F%9A%80" 
   target="_blank" 
   class="whatsapp-float"
   title="דברו איתנו בוואטסאפ">
  💬
</a>

<style>
  .whatsapp-float {
    position: fixed;
    bottom: 24px;
    left: 24px;
    width: 60px;
    height: 60px;
    background: #25d366;
    color: white;
    border-radius: 50%;
    text-align: center;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    z-index: 999;
    transition: transform 0.2s;
  }
  .whatsapp-float:hover { transform: scale(1.1); }
</style>`
      }
    ],
    geminiPrompt: 'עבור אתר [שם הנושא שלך], כתוב לי הודעת פתיחה מנצחת לוואטסאפ שלקוח ישלח כשהוא לוחץ על הכפתור, והמר אותה לפורמט URL encoded (עם סימני אחוז).',
    proChallenge: 'הוסיפו בועת טקסט קטנה ליד הכפתור שאומרת: "זמינים עכשיו לשאלות! 🟢".',
    outcomeTitle: 'ערוץ מכירות ישיר: כפתור וואטסאפ צף ופעיל באתר',
    outcomeDesc: 'חיבור תקשורת חי שמאפשר לגולשים לפתוח שיחת שירות או רכישה מיידית מכל מכשיר.',
    previewImg: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1000&q=80',
    tags: ['וואטסאפ', 'Floating Button', 'שירות לקוחות', 'אינטראקטיביות']
  },

  {
    id: 20,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 20: טופס לידים ויצירת קשר פעיל',
    duration: '90 דקות',
    icon: '📝',
    objective: 'בניית טופס יצירת קשר מקצועי (Contact Form) עם שדות קלט (שם, אימייל, טלפון, הודעה), אימות תקינות נתונים וכפתור שליחה מעוצב.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'אנטומיה של טופס לידים: מה גורם לאנשים להשאיר פרטים?' },
      { phase: '20 דק׳', text: 'שדות HTML5 חכמים: input type="email", type="tel" ומאפיין required.' },
      { phase: '35 דק׳', text: 'פיתוח ועיצוב הטופס ב-WebBlocks או בקוד HTML.' },
      { phase: '20 דק׳', text: 'בדיקת ולידציה ושליחת טופס לדוגמה.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב באנר יצירת קשר ב-Canva',
        desc: 'צרו באנר מרובע או רחב המזמין לקוחות לקבל הצעת מחיר או ייעוץ חינם.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Contact Form',
        desc: 'גררו בלוק Form, הגדירו שדות חובה וכפתור שליחה עם אנימציית טעינה.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד טופס יצירת קשר מודרני ב-HTML & CSS',
        desc: 'טופס עם אימות מובנה, תוויות ברורות ושדות מותאמים אישית:',
        code: `<form class="contact-form" onsubmit="event.preventDefault(); alert('ההודעה נשלחה בהצלחה! נחזור בהקדם 🚀');">
  <h3>צרו איתנו קשר ✉️</h3>
  <div class="form-group">
    <label>שם מלא *</label>
    <input type="text" required placeholder="ישראל ישראלי">
  </div>
  <div class="form-group">
    <label>טלפון נייד *</label>
    <input type="tel" required placeholder="050-1234567">
  </div>
  <div class="form-group">
    <label>אימייל *</label>
    <input type="email" required placeholder="your@email.com">
  </div>
  <div class="form-group">
    <label>איך נוכל לעזור?</label>
    <textarea rows="3" placeholder="ספרו לנו קצת על מה שאתם מחפשים..."></textarea>
  </div>
  <button type="submit" class="submit-btn">שלח הודעה עכשיו 🚀</button>
</form>

<style>
  .contact-form {
    background: #1e293b; padding: 30px; border-radius: 18px;
    max-width: 450px; margin: 30px auto; border: 1px solid #334155; text-align: right;
  }
  .contact-form h3 { margin: 0 0 20px 0; color: #f8fafc; font-size: 1.3rem; }
  .form-group { margin-bottom: 14px; }
  .form-group label { display: block; font-size: 0.82rem; color: #94a3b8; margin-bottom: 6px; }
  .form-group input, .form-group textarea {
    width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid #334155;
    border-radius: 8px; color: white; box-sizing: border-box; font-family: inherit;
  }
  .submit-btn {
    width: 100%; background: linear-gradient(135deg, #6366f1 0%, #8b3dff 100%);
    color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 800; cursor: pointer;
  }
</style>`
      }
    ],
    geminiPrompt: 'עבור אתר [שם הנושא שלך], אילו 3 שאלות הכי קצרות ומדויקות כדאי לשאול בטופס יצירת קשר כדי שלא יעייף את הלקוח?',
    proChallenge: 'הוסיפו הודעת הצלחה (Success Toast) ירוקה ויפה שמופיעה לאחר לחיצה על כפתור השליחה.',
    outcomeTitle: 'טופס לידים פעיל לקליטת פניות לקוחות ישירות מהאתר',
    outcomeDesc: 'איסוף מידע חכם, שדות קלט מוגנים ואימות שגיאות מובנה.',
    previewImg: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=1000&q=80',
    tags: ['טופס לידים', 'Contact Form', 'ולידציה', 'שדות קלט']
  },

  {
    id: 21,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 21: יצירת דף שני (אודות העסק) וחיבור קישורים',
    duration: '90 דקות',
    icon: '📄',
    objective: 'הרחבת האתר לאתר רב-עמודי (Multi-Page): יצירת דף חדש about.html (או דף משני ב-WebBlocks), עיצובו וחיבור קישורי ניווט הדדיים בין שני הדפים.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'מבנה אתר רב-עמודי: ארגון קבצים, תיקיות ונתיבי קישורים פנימיים (Relative Paths).' },
      { phase: '20 דק׳', text: 'כתיבת סיפור המותג (Brand Story) לדף האודות בעזרת Gemini.' },
      { phase: '35 דק׳', text: 'בניית דף about.html וחיבור קישורי ה-Navbar וה-Footer.' },
      { phase: '20 דק׳', text: 'בדיקת מעבר חלק הלוך ושוב בין דף הבית לדף האודות!' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב באנר או תמונת "הסיפור שלנו" ב-Canva',
        desc: 'צרו באנר 16:9 מיוחד לדף האודות המציג את ערכי המותג והחזון שלו.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הוספת דף חדש בפרויקט WebBlocks',
        desc: 'פתחו את מנהל הדפים, הוסיפו דף "אודות", והגדירו כפתור קישור מדף הבית אליו.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד חיבור ניווט בין דף הבית לדף האודות (HTML)',
        desc: 'כך נראים הקישורים ההדדיים שמאפשרים לגולש לעבור בין הדפים:',
        code: `<!-- בתוך index.html: קישור לדף אודות -->
<nav class="navbar">
  <a href="index.html" class="active">בית</a>
  <a href="about.html">אודות המותג</a>
</nav>

<!-- בתוך about.html: קישור חזרה לדף הבית -->
<nav class="navbar">
  <a href="index.html">חזרה לדף הבית ⬅️</a>
  <a href="about.html" class="active">אודות המותג</a>
</nav>`
      }
    ],
    geminiPrompt: 'כתוב לי עמוד "הסיפור שלנו" (About Us) מרתק, מרגש ומעורר השראה עבור מותג [שם הנושא שלך]. חלק אותו ל: 1. איך הכל התחיל, 2. החזון והערכים שלנו, 3. ההבטחה שלנו ללקוח.',
    proChallenge: 'וודאו שהסגנונות (CSS) של ה-Navbar וה-Footer זהים לחלוטין בשני הדפים ליצירת עקביות מושלמת.',
    outcomeTitle: 'אתר רב-עמודי אמיתי עם ניווט חי בין דף הבית לדף אודות',
    outcomeDesc: 'מעבר מאתר של עמוד בודד למבנה אתר מורכב עם דפים מקושרים הדדית.',
    previewImg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    tags: ['Multi-Page', 'אודות', 'קישורים פנימיים', 'ארכיטקטורת אתר']
  },

  {
    id: 22,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 22: יצירת דף גלריית תמונות עשירה עם קטגוריות',
    duration: '90 דקות',
    icon: '🖼️',
    objective: 'בניית דף שלישי באתר: גלריית תמונות עשירה (gallery.html) עם תגיות סינון לפי קטגוריות, אפקט זום (Lightbox) בלחיצה ומראה ויזואלי מרהיב.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'עקרונות גלריה מודרנית: חיתוך אחיד, שוליים מדויקים ומהירות טעינה.' },
      { phase: '20 דק׳', text: 'איסוף והכנת 6 תמונות מובילות מ-Canva לגלריה.' },
      { phase: '35 דק׳', text: 'פיתוח גריד תמונות רספונסיבי עם אפקט הגדלה בריחוף.' },
      { phase: '20 דק׳', text: 'בדיקת ניווט אל דף הגלריה מכל הדפים באתר.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: ייצוא סט 6 תמונות אווירה ומוצר מ-Canva',
        desc: 'עצבו 6 תמונות ביחס 4:3 או 1:1 עם אפקטי תאורה וצבע אחידים לשפת המותג.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק Gallery רספונסיבי',
        desc: 'ב-WebBlocks Studio צרו דף גלריה, גררו בלוק Image Gallery והעלו את 6 התמונות.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד גריד גלריית תמונות רספונסיבי ב-CSS Grid',
        desc: 'גריד תמונות שמתאים את עצמו למסך עם אפקט זום מרהיב:',
        code: `<div class="gallery-grid">
  <div class="gallery-item"><img src="gal1.jpg" alt="גלריה 1"></div>
  <div class="gallery-item"><img src="gal2.jpg" alt="גלריה 2"></div>
  <div class="gallery-item"><img src="gal3.jpg" alt="גלריה 3"></div>
  <div class="gallery-item"><img src="gal4.jpg" alt="גלריה 4"></div>
  <div class="gallery-item"><img src="gal5.jpg" alt="גלריה 5"></div>
  <div class="gallery-item"><img src="gal6.jpg" alt="גלריה 6"></div>
</div>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .gallery-item {
    border-radius: 14px;
    overflow: hidden;
    height: 220px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .gallery-item:hover img {
    transform: scale(1.1);
  }
</style>`
      }
    ],
    geminiPrompt: 'הצע לי 4 שמות של קטגוריות סינון מעניינות עבור גלריית תמונות של אתר [שם הנושא שלך].',
    proChallenge: 'הוסיפו כפתורי פילטר בראש הגלריה (הכל / פופולרי / חדש) בעזרת כפתורים מעוצבים.',
    outcomeTitle: 'דף גלריה ויזואלי מהפנט עם 6 תמונות מוצר מובילות',
    outcomeDesc: 'חוויה חזותית עשירה שמשאירה רושם בלתי נשכח על הגולשים באתר.',
    previewImg: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80',
    tags: ['גלריה', 'CSS Grid', 'זום תמונות', 'Visual Showcase']
  },

  {
    id: 23,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 23: תפריט מובייל והמבורגר רספונסיבי',
    duration: '90 דקות',
    icon: '🍔',
    objective: 'המרת תפריט הניווט לתפריט המבורגר (Hamburger Menu) מתקפל במסכי סמארטפון, שנפתח במחווה חלקה בלחיצה.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'למה צריך תפריט המבורגר? התמודדות עם מגבלת רוחב במסכי מובייל.' },
      { phase: '20 דק׳', text: 'איך עובד כפתור Toggle ב-CSS וב-JavaScript קל.' },
      { phase: '35 דק׳', text: 'פיתוח תפריט מובייל נפתח (Drawer / Dropdown).' },
      { phase: '20 דק׳', text: 'בדיקת פתיחה וסגירה במצב מובייל (375px).' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב אייקון המבורגר 3 פסים ב-Canva',
        desc: 'עצבו אייקון המבורגר נקי שתואם לצבעי המותג.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הפעלת רכיב Mobile Drawer ב-WebBlocks Studio',
        desc: 'בבלוק ה-Navbar סמנו "הפעל המבורגר במובייל" ובחרו צבע רקע לתפריט הנפתח.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד תפריט המבורגר רספונסיבי ב-HTML, CSS ו-JS קצר',
        desc: 'תפריט שנעלם במסכי מחשב ומופיע ככפתור המבורגר במסכים מתחת ל-768px:',
        code: `<nav class="nav-container">
  <div class="logo">[לוגו המותג]</div>
  <button class="hamburger-btn" onclick="document.querySelector('.nav-links').classList.toggle('open')">☰</button>
  <div class="nav-links">
    <a href="index.html">בית</a>
    <a href="about.html">אודות</a>
    <a href="gallery.html">גלריה</a>
    <a href="#contact">צור קשר</a>
  </div>
</nav>

<style>
  .nav-container { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #0f172a; }
  .logo { color: #38bdf8; font-weight: 900; font-size: 1.2rem; }
  .nav-links { display: flex; gap: 20px; }
  .nav-links a { color: #cbd5e1; text-decoration: none; font-weight: 700; }
  .hamburger-btn { display: none; background: none; border: none; color: white; font-size: 1.8rem; cursor: pointer; }

  @media (max-width: 768px) {
    .hamburger-btn { display: block; }
    .nav-links {
      display: none; position: absolute; top: 65px; left: 0; right: 0;
      background: #1e293b; flex-direction: column; padding: 20px; gap: 16px; text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .nav-links.open { display: flex; }
  }
</style>`
      }
    ],
    geminiPrompt: 'הסבר לי איך Media Query (@media) ב-CSS מזהה מתי המסך הוא סמארטפון ומתי הוא מחשב שולחני.',
    proChallenge: 'הוסיפו אפקט שבו כפתור ההמבורגר (☰) הופך לאיקס (✕) כשהתפריט פתוח.',
    outcomeTitle: 'תפריט ניווט מובייל מושלם (Mobile Navbar) שמתאים לכל טלפון',
    outcomeDesc: 'חוויית גלישה רספונסיבית ברמה מקצועית עם תפריט המבורגר מתקפל ואינטואיטיבי.',
    previewImg: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80',
    tags: ['Hamburger Menu', 'Mobile Navbar', 'רספונסיביות', 'ניווט מובייל']
  },

  {
    id: 24,
    module: 3,
    moduleTitle: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)',
    title: 'מפגש 24: רכיב שאלות ותשובות מתקפל (Accordion FAQ)',
    duration: '90 דקות',
    icon: '❓',
    objective: 'בניית רכיב שאלות ותשובות נפוצות (FAQ Accordion) אינטראקטיבי שנפתח ונסגר בלחיצה, להסרת חששות לקוחות ולמענה מהיר.',
    timeAllocation: [
      { phase: '15 דק׳', text: 'למה FAQ הוא רכיב חובה? הפחתת עומס מפניות וחיזוק האמון.' },
      { phase: '20 דק׳', text: 'ניסוח 4 שאלות ותשובות נפוצות חכמות בעזרת Gemini.' },
      { phase: '35 דק׳', text: 'פיתוח רכיב Accordion בעזרת תגיות <details> ו-<summary> מעוצבות.' },
      { phase: '20 דק׳', text: 'בדיקת פתיחה וסגירה חלקה של כל השאלות.' }
    ],
    canvaTasks: [
      {
        title: 'שלב 1: עיצוב באנר או כותרת לסקשן FAQ ב-Canva',
        desc: 'עצבו כותרת נעימה עם סמל סימן שאלה תואם לצבעי המותג.'
      }
    ],
    webBlocksTasks: [
      {
        title: 'שלב 1: הנחת בלוק FAQ ב-WebBlocks Studio',
        desc: 'גררו בלוק שאלות ותשובות והזינו 4 שאלות ותשובות מפורטות.'
      }
    ],
    htmlTasks: [
      {
        title: 'קוד רכיב שאלות ותשובות מתקפל (Accordion) ב-HTML טהור',
        desc: 'השתמשו בתגיות details ו-summary האלגנטיות:',
        code: `<section class="faq-section">
  <h2>שאלות נפוצות ❓</h2>
  <div class="faq-accordion">
    <details class="faq-item">
      <summary class="faq-question">תוך כמה זמן מגיע המשלוח? 🚚</summary>
      <div class="faq-answer">
        המשלוחים שלנו מגיעים לכל חלקי הארץ בתוך 2 עד 4 ימי עסקים בלבד, ישירות עד פתח הדלת עם שליח.
      </div>
    </details>
    <details class="faq-item">
      <summary class="faq-question">האם ניתן להחליף או להחזיר מוצר? 🔄</summary>
      <div class="faq-answer">
        כן, בהחלט! ניתן להחליף או להחזיר כל מוצר שלא נעשה בו שימוש בתוך 14 יום מרגע קבלת החבילה.
      </div>
    </details>
    <details class="faq-item">
      <summary class="faq-question">איך ניתן ליצור איתכם קשר? 💬</summary>
      <div class="faq-answer">
        אנחנו זמינים בוואטסאפ, באימייל ובטופס יצירת הקשר באתר בימים א'-ה' בין השעות 09:00 ל-18:00.
      </div>
    </details>
  </div>
</section>

<style>
  .faq-section { max-width: 800px; margin: 40px auto; padding: 0 20px; text-align: right; }
  .faq-item {
    background: #1e293b; border: 1px solid #334155; border-radius: 12px;
    margin-bottom: 12px; overflow: hidden;
  }
  .faq-question {
    padding: 18px 20px; font-weight: 800; color: #38bdf8; cursor: pointer;
    list-style: none; font-size: 1.1rem;
  }
  .faq-answer { padding: 0 20px 20px 20px; color: #cbd5e1; line-height: 1.6; font-size: 0.95rem; }
</style>`
      }
    ],
    geminiPrompt: 'עבור אתר בתחום [שם הנושא שלך], כתוב לי 4 שאלות שהכי מטרידות לקוחות לפני שהם מזמינים, ואת התשובות הכי מרגיעות ומקצועיות עבורן.',
    proChallenge: 'הוסיפו אפקט הדגשה של צבע המסגרת כאשר השאלה פתוחה.',
    outcomeTitle: 'רכיב שאלות ותשובות אינטראקטיבי שפותר ספקות ללקוח',
    outcomeDesc: 'סיום מודול 3 בהצלחה: אתר רב-עמודי, עשיר במולטימדיה, אינטראקציות ורספונסיביות מלאה.',
    previewImg: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    tags: ['Accordion', 'FAQ', 'שאלות ותשובות', 'אינטראקטיביות']
  }
];
