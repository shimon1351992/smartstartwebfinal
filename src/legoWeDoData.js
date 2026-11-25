// Lego WeDo 2.0 (Set 45300) Curriculum Data
// Complete building guides & coding lessons for the two Studio 2.0 models:
// 1. Milo the Science Rover (8 steps)
// 2. WeDo Race Car (5 steps)
// High-resolution instruction pages directly rendered from BrickLink Studio 2.0

export const LEGO_WEDO_PROJECTS = [
  {
    id: 'milo',
    title: '🏎️ מכונית מירוץ',
    subtitle: 'דגם WeDo 2.0 מהיר עם בקר Smart Hub, מנוע והנעה קדמית (8 שלבים)',
    difficulty: 'מתחילים (קל)',
    stepsCount: 8,
    estimatedTime: '20-25 דקות',
    heroColor: '#0284c7',
    heroGradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    category: 'רובוטיקה ותנועה',
    badge: 'WeDo 2.0 • 45300',
    coverImage: '/wedo_assets/milo_step_8.jpg',
    pdfUrl: '/wedo_assets/milo_instructions.pdf',
    description: 'הרובוט מילו הוא דגם הדגל של ערכת WeDo 2.0. ברובוט זה תבנו שלדת חלל יציבה עם שתי קורות 1x16, תעגנו את בקר ה-Smart Hub, תתקינו מנוע WeDo עם תמסורת גלגלות וצמיגי שטח רחבים לנסיעה יציבה על כל משטח.',
    mechanisms: ['תמסורת גלגלות והנעה (Pulley Drive)', 'בסיס שלדה מוקשחת (Beam Chassis)', 'שליטה במנוע וסיבוב דו-כיווני'],
    componentsUsed: [
      { name: 'Smart Hub 2 I/O (בקר מרכזי)', count: 1, partNo: '19071', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/19071.png' },
      { name: 'מנוע בינוני WeDo Medium Motor', count: 1, partNo: '21980', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/21980.png' },
      { name: 'קורת טכניק 1x16 עם חורים (ירוק ליים)', count: 2, partNo: '3703', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3703.png' },
      { name: 'מסגרת טכניק פתוחה 4x4 (אפור)', count: 1, partNo: '6179', imgUrl: 'https://img.bricklink.com/ItemImage/PN/86/6179.png' },
      { name: 'קורת טכניק 1x8 עם חורים (ירוק ליים)', count: 2, partNo: '3702', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3702.png' },
      { name: 'קורת טכניק 1x4 עם חורים (ירוק ליים)', count: 2, partNo: '3701', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3701.png' },
      { name: 'לוח חרטום משופע (ירוק ליים)', count: 1, partNo: '43719', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/43719.png' },
      { name: 'גלגלת שקופה Wedge-Belt Wheel 24mm', count: 5, partNo: '4185', imgUrl: 'https://img.bricklink.com/ItemImage/PN/15/4185.png' },
      { name: 'צמיג שטח רחב Knobby Tyre 30.4x14', count: 2, partNo: '58090', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/58090.png' },
      { name: 'חישוק גלגל לבן Wheel Rim', count: 2, partNo: '56902', imgUrl: 'https://img.bricklink.com/ItemImage/PN/1/56902.png' },
      { name: 'רצועת גומי דקה / צמיג גומי שחור', count: 2, partNo: '70162', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/70162.png' },
      { name: 'צירי טכניק ופיני חיבור', count: 6, partNo: '3706/32062/43093', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/3706.png' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'שלב 1: בניית שלדת הבסיס האחורית',
        instruction: 'הניחו שתי קורות טכניק 1x16 ירוקות במקביל. חברו אותן במרכז באמצעות מסגרת 4x4 אפורה. הכניסו שני פיני ציר (Axle Pins) בחלק האחורי של הקורות – פינים אלו ישמשו כצירי הגלגלים האחוריים.',
        image: '/wedo_assets/milo_step_1.jpg',
        parts: [
          { name: 'קורת טכניק 1x16 (ירוק ליים)', count: 2, partNo: '3703', color: '#84cc16', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3703.png' },
          { name: 'מסגרת 4x4 פתוחה (אפור)', count: 1, partNo: '6179', color: '#64748b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/86/6179.png' },
          { name: 'פין ציר עם חיכוך Axle Pin', count: 2, partNo: '43093', color: '#1e293b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/43093.png' }
        ],
        proTip: 'ודאו שהקורות ישרות ומקבילות בדיוק ומחוברות חזק למסגרת האפורה.',
      },
      {
        stepNumber: 2,
        title: 'שלב 2: הכנת יחידת הבקר (Smart Hub)',
        instruction: 'הפכו את בקר ה-Smart Hub. חברו בתחתיתו שתי קורות 1x4 ירוקות ושתי קורות 1x8 ירוקות בצדדים כדי לאפשר עיגון חזק ויציב לשלדה.',
        image: '/wedo_assets/milo_step_2.jpg',
        parts: [
          { name: 'בקר Smart Hub 2 I/O (לבן/אפור)', count: 1, partNo: '19071', color: '#e2e8f0', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/19071.png' },
          { name: 'קורת טכניק 1x8 עם חורים (ירוק)', count: 2, partNo: '3702', color: '#84cc16', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3702.png' },
          { name: 'קורת טכניק 1x4 עם חורים (ירוק)', count: 2, partNo: '3701', color: '#84cc16', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3701.png' }
        ],
        proTip: 'שימו לב שכיוון הקורות משאיר את שקעי החיבור של הכבלים פתוחים ונגישים.',
      },
      {
        stepNumber: 3,
        title: 'שלב 3: חיבור בקר ה-Smart Hub לשלדה',
        instruction: 'הצמידו את יחידת ה-Smart Hub המורכבת ישירות מעל מסגרת הבסיס שהכנתם בשלב 1. לחצו בחוזקה עד שכל החלקים ננעלים יחד באופן מושלם.',
        image: '/wedo_assets/milo_step_3.jpg',
        parts: [],
        proTip: 'ודאו שכפתור ההפעלה הירוק של הבקר פונה כלפי מעלה ונגיש ללחיצה נוחה.',
      },
      {
        stepNumber: 4,
        title: 'שלב 4: הרכבת לוח חרטום הרכב',
        instruction: 'חברו את לוח החרטום המשופע (Wedge Plate) בקדמת ה-Smart Hub מעל קורות השלדה. לוח זה ישמש כמשטח עגינה יציב עבור המנוע.',
        image: '/wedo_assets/milo_step_4.jpg',
        parts: [
          { name: 'לוח חרטום משופע Wedge Plate (ירוק)', count: 1, partNo: '43719', color: '#84cc16', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/43719.png' }
        ],
        proTip: 'הלוח המשופע מעניק לרובוט את המראה האווירודינמי והעתידני של רכב שטח בחלל.',
      },
      {
        stepNumber: 5,
        title: 'שלב 5: התקנת מנוע ה-WeDo הבינוני',
        instruction: 'הניחו את המנוע הבינוני (Medium Motor) על גבי לוח החרטום הירוק. השחילו ציר 2M אדום לתוך פתח הציר המרכזי של המנוע.',
        image: '/wedo_assets/milo_step_5.jpg',
        parts: [
          { name: 'מנוע WeDo 2.0 בינוני Medium Motor', count: 1, partNo: '21980', color: '#94a3b8', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/21980.png' },
          { name: 'ציר טכניק 2M עם חריץ (אדום)', count: 1, partNo: '32062', color: '#ef4444', imgUrl: 'https://img.bricklink.com/ItemImage/PN/5/32062.png' }
        ],
        proTip: 'חברו את כבל המנוע לאחת מיציאות הבקר (Port A או Port B) בגב ה-Smart Hub.',
      },
      {
        stepNumber: 6,
        title: 'שלב 6: הרכבת ציר ההנעה הקדמי והגלגלות',
        instruction: 'השחילו ציר טכניק שחור דרך החורים הקדמיים של הקורות ישירות מתחת למנוע. הרכיבו שתי גלגלות שקופות (24mm) משני צדי הציר ליצירת מנגנון העברת הכוח.',
        image: '/wedo_assets/milo_step_6.jpg',
        parts: [
          { name: 'ציר טכניק ארוך (שחור)', count: 1, partNo: '3706', color: '#1e293b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/3706.png' },
          { name: 'גלגלת שקופה Wedge-Belt Wheel 24mm', count: 2, partNo: '4185', color: '#38bdf8', imgUrl: 'https://img.bricklink.com/ItemImage/PN/15/4185.png' }
        ],
        proTip: 'סובבו ביד את הציר כדי לוודא שהוא מסתובב בחופשיות ללא חיכוך בקורות הירוקות.',
      },
      {
        stepNumber: 7,
        title: 'שלב 7: הרכבת הגלגלים האחוריים',
        instruction: 'הרכיבו שני גלגלים שקופים עם צמיגי גומי דקים (O-Ring / Belt) וחברו אותם על פיני הציר בחלק האחורי של הרכב.',
        image: '/wedo_assets/milo_step_7.jpg',
        parts: [
          { name: 'גלגלת שקופה Wedge-Belt Wheel 24mm', count: 2, partNo: '4185', color: '#38bdf8', imgUrl: 'https://img.bricklink.com/ItemImage/PN/15/4185.png' },
          { name: 'צמיג גומי שחור דק (Belt Ring)', count: 2, partNo: '70162', color: '#1e293b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/70162.png' }
        ],
        proTip: 'הצמיגים הדקים מאחור מקטינים את החיכוך ומאפשרים לרובוט להסתובב בקלות.',
      },
      {
        stepNumber: 8,
        title: 'שלב 8: התקנת גלגלי השטח הקדמיים וסיום הדגם!',
        instruction: 'הלבישו את צמיגי השטח הרחבים (Knobby Tyres) על חישוקי הגלגלים הלבנים, וחברו אותם לציר הקדמי משני הצדדים. הוסיפו גלגלת העברה נוספת מול ציר המנוע. רובוט מילו שלכם מוכן לפעולה!',
        image: '/wedo_assets/milo_step_8.jpg',
        parts: [
          { name: 'צמיג שטח רחב Knobby Tyre 30.4x14', count: 2, partNo: '58090', color: '#1e293b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/58090.png' },
          { name: 'חישוק גלגל לבן Wheel Rim', count: 2, partNo: '56902', color: '#ffffff', imgUrl: 'https://img.bricklink.com/ItemImage/PN/1/56902.png' },
          { name: 'גלגלת שקופה Wedge-Belt Wheel 24mm', count: 1, partNo: '4185', color: '#38bdf8', imgUrl: 'https://img.bricklink.com/ItemImage/PN/15/4185.png' }
        ],
        proTip: 'כל הכבוד! עברו ללשונית "תכנות ולוגיקה" כדי ללמוד כיצד לתכנת את מילו לנסיעה אוטונומית.',
      }
    ],
    codingGuide: {
      title: 'תכנות רובוט מילו לנסיעה מדעית',
      concept: 'בתוכנת WeDo 2.0 נבנה תוכנית שמפעילה את המנוע בכיוון קדימה, מכוונת את עוצמת המנוע וזמן הנסיעה, ובסיום משמיעה צליל מדע חללי!',
      blocksSequence: [
        {
          name: 'בלוק התחלה (Start Block)',
          desc: 'מפעיל את התוכנית בלחיצה על כפתור ההפעלה הירוק.',
          icon: '▶️'
        },
        {
          name: 'בלוק כיוון סיבוב מנוע (Motor Direction)',
          desc: 'מגדיר שהמנוע יסתובב קדימה כך שרובוט מילו יתקדם.',
          icon: '🔄'
        },
        {
          name: 'בלוק עוצמת מנוע (Motor Power 8)',
          desc: 'מגדיר עוצמת סיבוב של 8 מתוך 10 לתנועה מהירה ויציבה.',
          icon: '⚡'
        },
        {
          name: 'בלוק זמן פעולה (Motor On For 5 Sec)',
          desc: 'מפעיל את המנוע למשך 5 שניות בדיוק ואז עוצר.',
          icon: '⏱️'
        },
        {
          name: 'בלוק צליל רובר (Play Rover Sound)',
          desc: 'משמיע אפקט צליל מדע ורובוטיקה כאשר הרובוט השלים את המסלול.',
          icon: '🎵'
        }
      ]
    }
  },
  {
    id: 'racecar',
    title: '🚗 מכונית',
    subtitle: 'דגם WeDo 2.0 קלאסי עם שלדת קורות מחוזקת ו-4 גלגלים (5 שלבים)',
    difficulty: 'מתחילים (קל)',
    stepsCount: 5,
    estimatedTime: '15-20 דקות',
    heroColor: '#ef4444',
    heroGradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
    category: 'מהירות ותמסורת',
    badge: 'WeDo 2.0 • 45300',
    coverImage: '/wedo_assets/racecar_step_5.jpg',
    pdfUrl: '/wedo_assets/racecar_instructions.pdf',
    description: 'בניית מכונית מרוץ קלה ומהירה במיוחד. הדגם מדגים עקרונות של הפחתת משקל, יחסי תמסורת בין מנוע לציר הגלגלים, והאצה מהירה לקו הסיום עם תכנות בלוקים מתקדם ב-WeDo 2.0.',
    mechanisms: ['תמסורת מהירות ישירה (Direct Gear/Wheel Drive)', 'שלדת מרוץ מלבנית קשיחה', 'שליטה בעוצמת מנוע מקסימלית ובלימה'],
    componentsUsed: [
      { name: 'Smart Hub 2 I/O (בקר מרכזי)', count: 1, partNo: '19071', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/19071.png' },
      { name: 'מנוע בינוני WeDo Medium Motor', count: 1, partNo: '21980', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/21980.png' },
      { name: 'קורת טכניק 1x16 עם חורים (ירוק ליים)', count: 2, partNo: '3703', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3703.png' },
      { name: 'לוח שטוח 2x8 (כתום)', count: 2, partNo: '3034', imgUrl: 'https://img.bricklink.com/ItemImage/PN/4/3034.png' },
      { name: 'לוח שטוח 2x6 עם חורים (כתום)', count: 1, partNo: '32001', imgUrl: 'https://img.bricklink.com/ItemImage/PN/4/32001.png' },
      { name: 'חישוק גלגל קטן לבן Wheel Rim', count: 4, partNo: '56902', imgUrl: 'https://img.bricklink.com/ItemImage/PN/1/56902.png' },
      { name: 'צמיג שטח רחב Knobby Tyre 30.4x14', count: 4, partNo: '58090', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/58090.png' },
      { name: 'גלגלת שקופה Wedge-Belt Wheel 24mm', count: 2, partNo: '4185', imgUrl: 'https://img.bricklink.com/ItemImage/PN/15/4185.png' },
      { name: 'ציר טכניק ארוך (שחור)', count: 2, partNo: '3706', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/3706.png' },
      { name: 'ציר טכניק 2M עם חריץ (אדום)', count: 1, partNo: '32062', imgUrl: 'https://img.bricklink.com/ItemImage/PN/5/32062.png' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'שלב 1: הרכבת שלדת המרוץ המלבנית',
        instruction: 'הניחו שתי קורות טכניק 1x16 ירוקות במקביל. חברו אותן בשני הקצוות בעזרת שני לוחות 2x8 כתומים ליצירת שלדת רכב מלבנית קשיחה וחזקה.',
        image: '/wedo_assets/racecar_step_1.jpg',
        parts: [
          { name: 'לוח 2x8 (כתום)', count: 2, partNo: '3034', color: '#f97316', imgUrl: 'https://img.bricklink.com/ItemImage/PN/4/3034.png' },
          { name: 'קורת טכניק 1x16 (ירוק ליים)', count: 2, partNo: '3703', color: '#84cc16', imgUrl: 'https://img.bricklink.com/ItemImage/PN/34/3703.png' }
        ],
        proTip: 'הדקו היטב את הלוחות הכתומים אל הקורות כדי שהשלדה לא תתעוות במהירויות גבוהות.',
      },
      {
        stepNumber: 2,
        title: 'שלב 2: התקנת מנוע המרוצים האחורי',
        instruction: 'חברו את המנוע הבינוני (Medium Motor) על גבי הלוח הכתום בחלק האחורי של השלדה. ודאו שהציר שלו פונה כלפי חוץ לצד ימין של הרכב.',
        image: '/wedo_assets/racecar_step_2.jpg',
        parts: [
          { name: 'מנוע WeDo 2.0 בינוני Medium Motor', count: 1, partNo: '21980', color: '#94a3b8', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/21980.png' }
        ],
        proTip: 'מיקום המנוע מאחור מעניק לרכב מרכז כובד אחורי ואחיזת כביש מעולה בזמן הזינוק!',
      },
      {
        stepNumber: 3,
        title: 'שלב 3: התקנת צירי הגלגלים וגלגלות התמסורת',
        instruction: 'השחילו ציר שחור דרך החורים הקדמיים של הקורות, וציר שחור נוסף דרך החורים האחוריים. הכניסו ציר 2M אדום לתוך המנוע וחברו גלגלות שקופות (24mm) ליצירת מגע תמסורת ישיר.',
        image: '/wedo_assets/racecar_step_3.jpg',
        parts: [
          { name: 'ציר טכניק ארוך (שחור)', count: 2, partNo: '3706', color: '#1e293b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/3706.png' },
          { name: 'גלגלת שקופה Wedge-Belt Wheel 24mm', count: 2, partNo: '4185', color: '#38bdf8', imgUrl: 'https://img.bricklink.com/ItemImage/PN/15/4185.png' },
          { name: 'ציר טכניק 2M (אדום)', count: 1, partNo: '32062', color: '#ef4444', imgUrl: 'https://img.bricklink.com/ItemImage/PN/5/32062.png' }
        ],
        proTip: 'ודאו ששתי הגלגלות נוגעות זו בזו בצורה מדויקת כדי שסיבוב המנוע יועבר מיד לציר הגלגלים.',
      },
      {
        stepNumber: 4,
        title: 'שלב 4: הרכבת ארבעת גלגלי המרוץ',
        instruction: 'הרכיבו את 4 הגלגלים על צירי הרכב: הלבישו את צמיגי השטח על 4 חישוקי הגלגלים הלבנים וחברו אותם לצירי הגלגלים. סובבו את הגלגלים ביד לבדיקה שאין חיכוך.',
        image: '/wedo_assets/racecar_step_4.jpg',
        parts: [
          { name: 'חישוק גלגל לבן Wheel Rim', count: 4, partNo: '56902', color: '#ffffff', imgUrl: 'https://img.bricklink.com/ItemImage/PN/1/56902.png' },
          { name: 'צמיג שטח Knobby Tyre', count: 4, partNo: '58090', color: '#1e293b', imgUrl: 'https://img.bricklink.com/ItemImage/PN/11/58090.png' }
        ],
        proTip: 'השאירו מרווח קטנטן (כמילימטר) בין הגלגל לקורת השלדה כדי לאפשר סיבוב חלק ללא חיכוך.',
      },
      {
        stepNumber: 5,
        title: 'שלב 5: חיבור בקר ה-Smart Hub וסיום המכונית!',
        instruction: 'הניחו לוח 2x6 כתום במרכז השלדה והרכיבו עליו את בקר ה-Smart Hub. חברו את כבל המנוע לאחת מיציאות הבקר (Port A). מכונית המרוץ מוכנה לזינוק!',
        image: '/wedo_assets/racecar_step_5.jpg',
        parts: [
          { name: 'בקר Smart Hub 2 I/O', count: 1, partNo: '19071', color: '#e2e8f0', imgUrl: 'https://img.bricklink.com/ItemImage/PN/0/19071.png' },
          { name: 'לוח שטוח 2x6 כתום', count: 1, partNo: '32001', color: '#f97316', imgUrl: 'https://img.bricklink.com/ItemImage/PN/4/32001.png' }
        ],
        proTip: 'מדהים! הדגם שלכם שלם. לחצו על "תכנות ולוגיקה" כדי ללמוד איך לתכנת זינוק מהיר ובלימת חירום.',
      }
    ],
    codingGuide: {
      title: 'תכנות מכונית המרוץ לזינוק ובלימה',
      concept: 'במכונית מרוץ נרצה להגיע למהירות מקסימלית מיידית, לשמור עליה לאורך מסלול המרוץ, ולבצע עצירה מבוקרת עם חצוצרת ניצחון!',
      blocksSequence: [
        {
          name: 'בלוק התחלה (Start Block)',
          desc: 'מפעיל את רצף הזינוק של המכונית ברגע הלחיצה.',
          icon: '🏁'
        },
        {
          name: 'בלוק הגדרת כיוון (Motor Clockwise)',
          desc: 'מכוון את כיוון סיבוב המנוע קדימה.',
          icon: '🏎️'
        },
        {
          name: 'בלוק עוצמת מנוע מקסימלית (Motor Power 10)',
          desc: 'קובע את עוצמת המנוע ל-10 (מקסימום מהירות ב-WeDo 2.0).',
          icon: '⚡'
        },
        {
          name: 'בלוק זמן נסיעה (Motor On For 4 Seconds)',
          desc: 'מזניק את המכונית למשך 4 שניות של נסיעה מהירה.',
          icon: '⏱️'
        },
        {
          name: 'בלוק כיבוי מנוע (Motor Off)',
          desc: 'בולמת את המכונית מיד לאחר חציית קו הסיום.',
          icon: '🛑'
        },
        {
          name: 'בלוק חגיגת ניצחון (Play Fanfare Sound)',
          desc: 'משמיע שיר או תרועת ניצחון למנצח במרוץ!',
          icon: '🏆'
        }
      ]
    }
  }
];
