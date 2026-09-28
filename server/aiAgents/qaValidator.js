/**
 * 🛡️ PEDAGOGICAL QA & VALIDATION AGENT (סוכן בקרת איכות פדגוגית)
 * Verifies JSON integrity, validates lesson structures, repairs missing fields,
 * and ensures educational completeness for any subject.
 */

function validateAndEnhanceTrack(trackData, fallbackMeta = {}) {
  if (!trackData || typeof trackData !== 'object') {
    throw new Error('Invalid track data structure');
  }

  const enhanced = { ...trackData };

  // 1. Ensure basic required metadata
  enhanced.id = enhanced.id || enhanced.trackId || `track_${Date.now()}`;
  enhanced.trackId = enhanced.id;
  enhanced.title = enhanced.title || fallbackMeta.title || 'פרויקט למידה אישי';
  enhanced.description = enhanced.description || fallbackMeta.description || `מסלול למידה חווייתי לפיתוח ${enhanced.title}.`;
  enhanced.domain = enhanced.domain || fallbackMeta.domain || 'polymath';
  
  // 2. Ensure Welcome Page structure
  if (!enhanced.welcomePage || typeof enhanced.welcomePage !== 'object') {
    enhanced.welcomePage = {
      welcomeText: `ברוכים הבאים למסלול ${enhanced.title}! במסלול זה תתנסו בלמידה מעשית, שלב-אחר-שלב, ותבנו תוצר ממשי.`,
      features: [
        { title: 'למידה חווייתית מודרכת', desc: 'שיעורים קצרים וברורים עם דוגמאות מוחשיות.' },
        { title: 'משימות עשייה מעשיות', desc: 'בכל שיעור משימה מעשית המקדמת אותך לקראת התוצר הסופי.' },
        { title: 'פרויקט גמר יישומי', desc: 'בנייה והצגה של תוצר שלם פרי ידך.' }
      ]
    };
  }

  // 3. Ensure Chapters & Lessons array
  if (!Array.isArray(enhanced.chapters) || enhanced.chapters.length === 0) {
    enhanced.chapters = [
      {
        id: 'ch1',
        title: 'פרק 1: יסודות והיכרות עם הנושא',
        lessons: []
      }
    ];
  }

  // 4. Validate & Polish each Chapter and Lesson
  enhanced.chapters = enhanced.chapters.map((ch, chIdx) => {
    const chapterId = ch.id || `ch${chIdx + 1}`;
    const chapterTitle = ch.title || `פרק ${chIdx + 1}: שלב מעשי`;

    let lessons = Array.isArray(ch.lessons) ? ch.lessons : [];
    if (lessons.length === 0) {
      lessons = [
        {
          id: `${chIdx + 1}.1`,
          title: `שיעור ${chIdx + 1}.1: מבוא והתנסות ראשונית`,
          instructions: ['קרא את חומרי הרקע והבן את מטרת השלב.', 'בצע את המשימה המעשית המוגדרת.'],
          goal: 'הבנה מעשית והתחלת העבודה על המשימה.'
        }
      ];
    }

    lessons = lessons.map((les, lesIdx) => {
      const lessonId = les.id || `${chIdx + 1}.${lesIdx + 1}`;
      const lessonTitle = les.title || `שיעור ${lessonId}: משימה יישומית`;

      // Standardize instructions array
      let instructions = Array.isArray(les.instructions)
        ? les.instructions
        : (les.instructions ? [String(les.instructions)] : ['קרא את ההנחיות בעיון.', 'בצע את המשימה שלב-אחר-שלב.']);

      // Ensure appropriate mission flag based on domain or lesson fields
      const isAssembly = !!(les.isAssemblyStep || les.partsNeeded);
      const isCoding = !!(les.isCodingMission || les.codeTemplate || les.code);
      const isExperiment = !!(les.isExperimentStep || enhanced.domain === 'science');
      const isBusiness = !!(les.isBusinessMission || enhanced.domain === 'business');
      const isDesign = !!(les.isDesignChallenge || enhanced.domain === 'design');

      return {
        ...les,
        id: lessonId,
        title: lessonTitle,
        instructions,
        isAssemblyStep: isAssembly,
        isCodingMission: isCoding,
        isExperimentStep: isExperiment,
        isBusinessMission: isBusiness,
        isDesignChallenge: isDesign,
        goal: les.goal || les.objective || 'השגת היעד המעשי של השיעור הנוכחי.',
        code: les.code || '',
        codeTemplate: les.codeTemplate || '',
        imageUrl: les.imageUrl || les.image || '',
        partsNeeded: les.partsNeeded || []
      };
    });

    return {
      ...ch,
      id: chapterId,
      title: chapterTitle,
      lessons
    };
  });

  return enhanced;
}

module.exports = {
  validateAndEnhanceTrack
};
