export const CANVA_ASSETS_MAP = {
  home_create: '/canva_assets/canva_home_create_design.png',
  proj_presentation: '/canva_assets/canva_home_create_design.png',
  proj_square: '/canva_assets/canva_home_create_design.png',
  proj_logo: '/canva_assets/canva_home_create_design.png',
  elements_grids: '/canva_assets/canva_elements_grids.jpg',
  elements_photos: '/canva_assets/canva_elements_photos.jpg',
  text_typography: '/canva_assets/canva_text_typography.jpg',
  uploads_media: '/canva_assets/canva_uploads_media.jpg',
  share_download: '/canva_assets/canva_share_download.jpg',
  color_palette_hex: '/canva_assets/canva_elements_grids.jpg',
  hero_banner_design: '/canva_assets/canva_elements_grids.jpg',
  frames_smart: '/canva_assets/canva_elements_grids.jpg',
  smartmockups_laptop: '/canva_assets/canva_elements_grids.jpg',
  smartmockups_mobile: '/canva_assets/canva_elements_grids.jpg',
  video_timeline: '/canva_assets/canva_elements_grids.jpg',
  audio_soundtrack: '/canva_assets/canva_elements_grids.jpg',
  presentation_pitch: '/canva_assets/canva_elements_grids.jpg',
  export_transparent: '/canva_assets/canva_share_download.jpg',
  stickers_badges: '/canva_assets/canva_elements_grids.jpg'
};

export const MODULE_DEFINITIONS = [
  { id: 'all', title: 'כל 32 המפגשים (המסלול המלא)', icon: '📚', count: 32 },
  { id: '1', title: 'מודול 1: יזמות, חקר שוק ומיתוג ב-Canva (1-8)', icon: '🎨', count: 8 },
  { id: '2', title: 'מודול 2: פיתוח השלד והתוכן - בלוקים או HTML (9-16)', icon: '💻', count: 8 },
  { id: '3', title: 'מודול 3: מולטימדיה, אינטראקטיביות ורב-עמודיות (17-24)', icon: '🎬', count: 8 },
  { id: '4', title: 'מודול 4: בינה מלאכותית, השקה חיה ותיק עבודות (25-32)', icon: '🚀', count: 8 }
];

export const CANVA_PRESETS_GUIDE = [
  {
    id: 'custom_size',
    name: 'גודל מותאם אישית (Custom Size)',
    path: 'בראש הדף ⬅️ כפתור "צור עיצוב" ⬅️ "גודל מותאם אישית (➕)"',
    dimensions: 'לפי בחירה (px)',
    icon: '📐',
    color: '#8b3dff',
    badge: 'המומלץ לדיוק מקסימלי',
    desc: 'הזנת רוחב וגובה מדויקים בפיקסלים לכרטיסיות (1080x1080), באנרים (1920x400) או כל אלמנט ייחודי.'
  },
  {
    id: 'presentation',
    name: 'מצגת 16:9 (Presentation)',
    path: 'בראש הדף ⬅️ כפתור "צור עיצוב" ⬅️ "מצגת (16:9)"',
    dimensions: '1920 × 1080 px',
    icon: '🖥️',
    color: '#7c3aed',
    badge: 'לבנארים ודפי נחיתה',
    desc: 'סטנדרט מסכי מחשב – מושלם ל-Hero Banner, לוחות השראה ומצגות גמר.'
  },
  {
    id: 'instagram_portrait',
    name: 'פוסט ל-Instagram לאורך (4:5)',
    path: 'בראש הדף ⬅️ כפתור "צור עיצוב" ⬅️ "פוסט ל-Instagram (4:5)"',
    dimensions: '1080 × 1350 px',
    icon: '📱',
    color: '#ec4899',
    badge: 'פורמט מובייל מודרני',
    desc: 'הפורמט האנכי הפופולרי ב-Canva כיום, מעולה לבאנרים אנכיים וכרטיסיות מובייל.'
  },
  {
    id: 'logo',
    name: 'לוגו (Logo Design)',
    path: 'בראש הדף ⬅️ כפתור "צור עיצוב" ⬅️ "לוגו (500x500)"',
    dimensions: '500 × 500 px',
    icon: '🎨',
    color: '#0284c7',
    badge: 'זהות מותג',
    desc: 'רזולוציה ריבועית חדה מותאמת לסרגל הניווט (Navbar) ולאייקון הדפדפן (Favicon).'
  },
  {
    id: 'video_horizontal',
    name: 'סרטון לרוחב (Video 16:9)',
    path: 'בראש הדף ⬅️ כפתור "צור עיצוב" ⬅️ "סרטון לרוחב"',
    dimensions: '1920 × 1080 px',
    icon: '🎬',
    color: '#f59e0b',
    badge: 'וידאו ומולטימדיה',
    desc: 'עורך וידאו מובנה עם ציר זמן (Timeline), מוזיקה ואפקטים מוטמעים באתר.'
  }
];

export function getCanvaLessonSlides(lesson) {
  if (!lesson) return [];

  const tasks = lesson.canvaTasks || [];
  return tasks.map((task, idx) => {
    const loc = task.location || '';
    const desc = task.desc || '';
    const title = task.title || `שלב ${idx + 1}`;
    const combined = `${title} ${loc} ${desc} ${lesson.title || ''}`.toLowerCase();

    let image = CANVA_ASSETS_MAP.elements_grids;
    let badgeColor = '#7d2ae8';
    let category = 'אלמנטים ועיצוב קנבס';
    let superpower = lesson.canvaSuperpower || 'עיצוב קנבס מתקדם';
    let targetType = 'grids';
    let proTip = 'הקפידו על שפת עיצוב אחידה וצבעי מותג ברורים.';
    let shortcut = 'Ctrl + Z לביטול | Ctrl + G לקיבוץ';
    let whatToLookFor = 'משטח העבודה ב-Canva עם האלמנטים המעוצבים.';
    let actionTrail = ['משטח העבודה', 'Canva'];
    let selfCheck = [
      'ביצעתי את הפעולה במדויק ב-Canva',
      'התוצאה על הקנבס תואמת למודל המודגם'
    ];

    // Priority 1: Download / Share / Export
    if (combined.includes('שתף') || combined.includes('הורד') || combined.includes('הורדה') || combined.includes('ייצוא') || combined.includes('png') || combined.includes('jpg') || combined.includes('download') || combined.includes('share') || combined.includes('שמירת') || combined.includes('ייצאו')) {
      image = CANVA_ASSETS_MAP.share_download;
      category = 'ייצוא והורדת קובץ PNG';
      superpower = 'High-Res Asset Exporting';
      targetType = 'download_png';
      badgeColor = '#10b981';
      actionTrail = ['בפינה העליונה', 'שתף (Share)', 'הורדה (Download)', 'סוג קובץ: PNG'];
      proTip = 'וודאו שסוג הקובץ הוא PNG (או סמנו ״רקע שקוף״ ללוגו) לקבלת חדות מקסימלית באתר.';
      shortcut = 'בפינה העליונה ⬅️ שתף ⬅️ הורדה ⬅️ PNG';
      whatToLookFor = 'חלון ההורדה ב-Canva עם כפתור ״הורדה״ סגול וקובץ ה-PNG שנשמר במחשב.';
      selfCheck = [
        'בחרתי בפורמט PNG איכותי',
        'הקובץ נשמר בתיקיית ההורדות במחשב'
      ];
    }
    // Priority 2: Text / Typography / Headings / Fonts / Slogans
    else if (combined.includes('טקסט') || combined.includes('text') || combined.includes('כותרת') || combined.includes('גופן') || combined.includes('גופנים') || combined.includes('פונט') || combined.includes('טיפוגרפיה') || combined.includes('typography') || combined.includes('סלוגן') || combined.includes('הוסף כותרת') || combined.includes('סגנונות גופנים')) {
      image = CANVA_ASSETS_MAP.text_typography;
      category = 'טיפוגרפיה, כותרות וגופנים';
      superpower = 'Hebrew Typography & Hierarchy';
      targetType = 'typography';
      badgeColor = '#ec4899';
      actionTrail = ['סרגל כלים ימני', 'טקסט (Text)', 'הוסף כותרת ראשית / משנית'];
      proTip = 'בחרו גופן עברי מודרני (Rubik, Heebo, Assistant) ושמרו על היררכיית גדלים ברורה.';
      shortcut = 'T במקלדת להוספת תיבת טקסט מיידית';
      whatToLookFor = 'סרגל הטיפוגרפיה העליון עם בחירת גופן, גודל, צבע וכותרות מעוצבות על הקנבס.';
      selfCheck = [
        'השתמשתי בגופן עברי נקי (Rubik / Heebo)',
        'יש הבדל גדלים ברור בין כותרת ראשית למשנית'
      ];
    }
    // Priority 3: Photos / Images / Moodboard / Backgrounds
    else if (combined.includes('תמונות') || combined.includes('photos') || combined.includes('photo') || combined.includes('תמונה') || combined.includes('אווירה') || combined.includes('קולאז׳') || combined.includes('איסוף תמונות') || combined.includes('רקעים') || combined.includes('רקע מודרני')) {
      image = CANVA_ASSETS_MAP.elements_photos;
      category = 'איסוף תמונות אווירה ומדיה';
      superpower = 'Visual Moodboard & Imagery';
      targetType = 'photos';
      badgeColor = '#0284c7';
      actionTrail = ['סרגל כלים ימני', 'אלמנטים (Elements)', 'תמונות (Photos)'];
      proTip = 'השתמשו במסנן הצבעים ב-Canva כדי למצוא תמונות שמתאימות בול לצבעי המותג שלכם, או ב-Magic Media (מדיה קסומה) ב-AI.';
      shortcut = 'חפשו מילות מפתח באנגלית (כמו Modern Tech, Neon, Minimal) לתוצאות עשירות';
      whatToLookFor = 'חלונית חיפוש התמונות בסרגל הימני עם גלריית תמונות עשירה הנבחרות לקנבס.';
      selfCheck = [
        'גררתי תמונות איכותיות לתוך משבצות הרשת',
        'לכל התמונות יש גוון צבעים אחיד והרמוני'
      ];
    }
    // Priority 4: Uploads / Media files
    else if (combined.includes('העלאות') || combined.includes('uploads') || combined.includes('upload') || combined.includes('העלאת') || combined.includes('קבצים') || combined.includes('גרור תמונה למסגרת')) {
      image = CANVA_ASSETS_MAP.uploads_media;
      category = 'העלאת נכסים ומדיה אישית';
      superpower = 'Custom Media Asset Management';
      targetType = 'uploads';
      badgeColor = '#f59e0b';
      actionTrail = ['סרגל כלים ימני', 'העלאות (Uploads)', 'העלאת קבצים'];
      proTip = 'העלו תמונות בפורמט PNG עם רקע שקוף לקבלת מראה מקצועי ונקי באתר.';
      shortcut = 'גררו קבצים ישירות מהמחשב אל חלון הדפדפן להעלאה מיידית';
      whatToLookFor = 'חלונית ״העלאות״ בסרגל הצד עם כפתור סגול ״העלאת קבצים״ והגלריה שלכם.';
      selfCheck = [
        'העליתי קובץ אישי לגלריית ההעלאות',
        'מיקמתי את התמונה המועלית בקנבס'
      ];
    }
    // Priority 5: Color Palette / HEX
    else if (combined.includes('hex') || combined.includes('פלטת') || (combined.includes('צבע') && !combined.includes('תמונות'))) {
      image = CANVA_ASSETS_MAP.elements_grids;
      category = 'פלטת צבעים וספר מותג HEX';
      superpower = 'Color Theory & HEX Palettes';
      targetType = 'color_palette';
      badgeColor = '#ec4899';
      actionTrail = ['סרגל עליון בעורך', 'צבע מסמך', '➕ הוסף צבע חדש', 'הדבק קוד HEX'];
      proTip = 'העתיקו את 4 קודי ה-HEX המדויקים כדי להשתמש בהם גם בהגדרות ב-WebBlocks Studio!';
      shortcut = 'Ctrl + C / Ctrl + V להעתקה והדבקה מהירה של קוד HEX';
      whatToLookFor = 'עיגולי צבע על גבי הקנבס עם קודי ה-HEX של ספר המותג (#8b3dff, #00c4cc וכו\').';
      selfCheck = [
        'הגדרתי 4 צבעים: ראשי, משני, רקע וצבע הדגשה',
        'הקפדתי על ניגודיות קריאה בין טקסט לרקע'
      ];
    }
    // Priority 6: Logo / Favicon
    else if (combined.includes('לוגו') || combined.includes('logo') || combined.includes('סמליל') || combined.includes('favicon')) {
      image = CANVA_ASSETS_MAP.elements_grids;
      category = 'עיצוב לוגו וזהות מותג';
      superpower = 'Logo Design & Brandmark';
      targetType = 'logo';
      badgeColor = '#8b3dff';
      actionTrail = ['בראש הדף ב-Canva', 'כפתור ״צור עיצוב״', 'לוגו (500×500 px)', 'אלמנטים ⬅️ גרפיקה'];
      proTip = 'לוגו מנצח הוא פשוט וזכיר! שלבו אייקון יחיד בצבע בולט לצד שם המותג.';
      shortcut = 'R = מלבן בסיס | C = מעגל בסיס | Shift לשינוי גודל פרופורציונלי';
      whatToLookFor = 'קנבס ריבועי עם אייקון וקטורי ממוקד ושם המותג.';
      selfCheck = [
        'הלוגו ברור וקריא גם בגודל קטן',
        'ייצאתי כ-PNG עם רקע שקוף'
      ];
    }
    // Priority 7: Grids / Shapes / Elements / Frames / Badges
    else if (combined.includes('רשת') || combined.includes('grid') || combined.includes('אלמנט') || combined.includes('צורות') || combined.includes('מסגרת') || combined.includes('frame') || combined.includes('3d') || combined.includes('גרפיקה') || combined.includes('אייקון') || combined.includes('באנר')) {
      image = CANVA_ASSETS_MAP.elements_grids;
      category = 'אלמנטים, רשתות ועיצוב קנבס';
      superpower = 'Layout Structure & Visual Assets';
      targetType = 'grids';
      badgeColor = '#7d2ae8';
      actionTrail = ['סרגל כלים ימני', 'אלמנטים (Elements)', 'צורות ומסגרות'];
      proTip = 'השתמשו ברשתות (Grids) ובמסגרות (Frames) לבניית מבנה מסודר ומאוזן.';
      shortcut = 'R = מלבן | C = עיגול | L = קו ישר | Ctrl + G לקיבוץ אלמנטים';
      whatToLookFor = 'סרגל האלמנטים ומשטח העבודה עם צורות, רשתות וקווים מעוצבים.';
      selfCheck = [
        'הנחתי את צורות הבסיס במשטח העבודה',
        'יישרתי את האלמנטים בעזרת קווי העזר הסגולים של Canva'
      ];
    }
    // Priority 8: Home / Account / Create / Project format selection
    else {
      image = CANVA_ASSETS_MAP.home_create;
      category = 'מסך הבית ויצירת עיצוב';
      superpower = 'Project Setup & Sizing';
      targetType = 'home_create';
      badgeColor = '#8b3dff';
      actionTrail = ['מסך הבית', 'canva.com', 'כפתור סגול: ״צור עיצוב״', 'גודל מותאם אישית (➕)'];
      proTip = 'השתמשו בכפתור ״צור עיצוב״ בפינה העליונה כדי להגדיר מידות מדויקות בפיקסלים.';
      shortcut = 'Ctrl + D לשמירת סימניה של Canva בדפדפן';
      whatToLookFor = 'מסך הבית של Canva עם הכפתור הסגול ״צור עיצוב״ בפינה העליונה.';
      selfCheck = [
        'התחברתי ל-Canva עם חשבון Google',
        'פתחתי את הפרויקט במידות הנכונות'
      ];
    }

    const steps = [
      `פתחו את Canva ועברו למיקום: ${loc || 'משטח העבודה'}.`,
      `${desc || 'בצעו את השלב בהתאם להנחיות המוקרנות על המסך.'}`,
      'בדקו שהתוצאה על משטח העבודה ב-Canva תואמת למודל המעוצב מימין.',
      'המשיכו לשלב הבא במסלול או עברו להטמעה באתר.'
    ];

    return {
      id: `l${lesson.id}_s${idx + 1}`,
      title: title.startsWith('שלב') ? title : `שלב ${idx + 1}: ${title.replace(/^משימה \d+:\s*/, '')}`,
      category,
      superpower,
      targetType,
      badge: `שלב ${idx + 1} מתוך ${tasks.length}`,
      badgeColor,
      location: loc,
      actionTrail,
      image,
      description: desc || `ביצוע שלב ${idx + 1} במפגש ${lesson.id}.`,
      steps,
      proTip,
      shortcut,
      whatToLookFor,
      selfCheck
    };
  });
}
