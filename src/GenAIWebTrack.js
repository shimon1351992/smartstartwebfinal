import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODULE_DEFINITIONS, CANVA_PRESETS_GUIDE } from './canvaData';
import { GENAI_LESSONS, IDEATION_TOPICS } from './genAILessonsData';

export { GENAI_LESSONS };

const SYSTEM_FONT = "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function GenAIWebTrack() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedTopicId, setSelectedTopicId] = useState('gaming');
  const [checkedSubTasks, setCheckedSubTasks] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const navigate = useNavigate();

  const currentLesson = GENAI_LESSONS[selectedLessonIndex] || GENAI_LESSONS[0];
  const currentTopic = IDEATION_TOPICS.find(t => t.id === selectedTopicId) || IDEATION_TOPICS[0];

  const handleToggleTask = (taskId) => {
    setCheckedSubTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleToggleComplete = (lessonId) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenInHTMLEditor = (codeText) => {
    navigate('/htmleditor', { state: { initialCode: codeText } });
  };

  const handleSelectLesson = (fullIndex) => {
    setSelectedLessonIndex(fullIndex);
    setCurrentPageIndex(0);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // -------------------------------------------------------------------------
  // 🧭 בניית מערך עמודים ממוקדים (דף נפרד לכל פעולה בודדת!)
  const canvaTasks = currentLesson?.canvaTasks || [];
  const webBlocksTasks = currentLesson?.webBlocksTasks || [];
  const htmlTasks = currentLesson?.htmlTasks || [];

  const pages = [
    // עמוד 1: יעד המפגש והתוצר הסופי
    {
      id: 'target',
      type: 'target',
      title: 'היעד והתוצר הסופי',
      shortTitle: 'יעד 🎯',
      category: 'יעד המפגש',
      categoryIcon: '🎯'
    },
    // עמודי Canva: עמוד שלם ונקי לכל משימת עיצוב בודדת!
    ...canvaTasks.map((task, idx) => ({
      id: `canva_${idx}`,
      type: 'canva',
      taskIndex: idx,
      totalCanva: canvaTasks.length,
      task: task,
      title: task.title,
      shortTitle: `קאנבה ${idx + 1} 🎨`,
      category: 'עיצוב ב-Canva',
      categoryIcon: '🎨'
    })),
    // עמודי WebBlocks: עמוד שלם ונקי לכל משימת בלוקים בודדת!
    ...webBlocksTasks.map((task, idx) => ({
      id: `webblocks_${idx}`,
      type: 'webblocks',
      taskIndex: idx,
      totalWebBlocks: webBlocksTasks.length,
      task: task,
      title: task.title,
      shortTitle: `בלוקים ${webBlocksTasks.length > 1 ? (idx + 1) + ' ' : ''}🧱`,
      category: 'בנייה ב-WebBlocks',
      categoryIcon: '🧱'
    })),
    // עמודי HTML: עמוד שלם ונקי לכל משימת קוד בודדת!
    ...htmlTasks.map((task, idx) => ({
      id: `html_${idx}`,
      type: 'html',
      taskIndex: idx,
      totalHtml: htmlTasks.length,
      task: task,
      title: task.title,
      shortTitle: `קוד ${htmlTasks.length > 1 ? (idx + 1) + ' ' : ''}⌨️`,
      category: 'פיתוח בקוד',
      categoryIcon: '⌨️'
    })),
    // עמוד בינה מלאכותית Gemini AI
    {
      id: 'gemini',
      type: 'gemini',
      title: 'שדרוג עם Gemini AI',
      shortTitle: 'AI 🤖',
      category: 'בינה מלאכותית',
      categoryIcon: '🤖'
    },
    // עמוד סיום המפגש וחגיגת הצלחה
    {
      id: 'complete',
      type: 'complete',
      title: `סיום מפגש ${currentLesson.id}!`,
      shortTitle: 'סיום 🎉',
      category: 'סיום והתקדמות',
      categoryIcon: '🎉'
    }
  ];

  const totalPages = pages.length;
  const safePageIndex = Math.min(currentPageIndex, totalPages - 1);
  const currentPage = pages[safePageIndex] || pages[0];
  const progressPercent = Math.round(((safePageIndex + 1) / totalPages) * 100);

  const handleNextPage = () => {
    if (safePageIndex < totalPages - 1) {
      setCurrentPageIndex(safePageIndex + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // סיום המפגש: סימון כהושלם ומעבר לשיעור הבא
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
      }
      if (selectedLessonIndex < GENAI_LESSONS.length - 1) {
        setSelectedLessonIndex(prev => prev + 1);
        setCurrentPageIndex(0);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = () => {
    if (safePageIndex > 0) {
      setCurrentPageIndex(safePageIndex - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const filteredLessons = GENAI_LESSONS.filter(l => {
    if (selectedModuleFilter === 'all') return true;
    return String(l.module) === String(selectedModuleFilter);
  });

  const completionPercentage = Math.round((completedLessons.length / GENAI_LESSONS.length) * 100);
  const isLessonDone = completedLessons.includes(currentLesson.id);
  const [showOldStudio, setShowOldStudio] = useState(false);

  if (!showOldStudio) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: '#09111f',
        zIndex: 9999
      }}>
        {/* 🔙 כפתור חזרה נקי בצד שמאל למעלה (בדיוק כמו בתמונה של הרכב) */}
        <button
          onClick={() => navigate('/tracks')}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 100000,
            padding: '10px 22px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: '800',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.25s ease',
            fontFamily: "'Rubik', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
          title="חזרה לתפריט הראשי"
        >
          <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>←</span>
          <span>חזרה</span>
        </button>

        {/* 🚀 פתיחת דף הפתיחה המקורי בחלון מלא ללא שום שינוי בקוד */}
        <iframe
          src="/genai_course/index.html"
          title="עולם של יצירה, עיצוב, AI ואפליקציות"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: SYSTEM_FONT,
      direction: 'rtl',
      color: '#0f172a',
      paddingBottom: '80px'
    }}>
      {/* 🌟 סרגל עליון ראשי */}
      <header style={{
        background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #311042 100%)',
        color: '#ffffff',
        padding: '14px 28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* מיתוג וכותרת */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #00c4cc 0%, #7d2ae8 100%)',
                color: '#ffffff',
                fontWeight: '900',
                fontSize: '1.2rem',
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(125,42,232,0.45)'
              }}>
                SS
              </div>
            </Link>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#ffffff' }}>
                  SmartStart Web & GenAI Track
                </span>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: '800'
                }}>
                  32 שיעורים מקיפים 🚀
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                מסע היזם: חקר שוק עם AI ⬅️ עיצוב ב-Canva ⬅️ פיתוח בבלוקים / HTML ⬅️ השקה חיה
              </p>
            </div>
          </div>

          {/* מצב התקדמות + קיצורי דרך */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* אחוז התקדמות */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>התקדמות במסלול</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 'bold', color: '#38bdf8' }}>
                  {completedLessons.length} / {GENAI_LESSONS.length} מפגשים ({completionPercentage}%)
                </div>
              </div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: `conic-gradient(#00c4cc ${completionPercentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#090d16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>
                  {completionPercentage}%
                </div>
              </div>
            </div>

            {/* כפתור WebBlocks */}
            <button
              onClick={() => navigate('/WebBlocks')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
              }}
            >
              <span>🧱</span> פתח WebBlocks
            </button>

            {/* כפתור HTML Studio */}
            <button
              onClick={() => navigate('/htmleditor')}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(2,132,199,0.3)'
              }}
            >
              <span>⌨️</span> פתח עורך HTML
            </button>
          </div>
        </div>
      </header>

      {/* 🚀 סרגל מודולים (Milestone Stepper) */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1.5px solid #e2e8f0',
        padding: '12px 28px'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {[
            { mod: '1', title: 'שלב 1: יזמות ומיתוג ב-Canva', sub: 'שיעורים 1-8 • חקר AI, לוגו ובאנרים', icon: '🎨', color: '#8b3dff' },
            { mod: '2', title: 'שלב 2: פיתוח השלד והתוכן', sub: 'שיעורים 9-16 • בלוקים / HTML, Navbar, Cards', icon: '💻', color: '#16a34a' },
            { mod: '3', title: 'שלב 3: מולטימדיה ואינטראקטיביות', sub: 'שיעורים 17-24 • וידאו, וואטסאפ, FAQ', icon: '🎬', color: '#0284c7' },
            { mod: '4', title: 'שלב 4: AI והשקה חיה', sub: 'שיעורים 25-32 • סוכן AI, דומיין, Demo Day', icon: '🚀', color: '#f59e0b' }
          ].map(phase => {
            const isSelected = selectedModuleFilter === phase.mod;
            return (
              <div
                key={phase.mod}
                onClick={() => setSelectedModuleFilter(isSelected ? 'all' : phase.mod)}
                style={{
                  background: isSelected ? `${phase.color}12` : '#f8fafc',
                  border: isSelected ? `2px solid ${phase.color}` : '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  fontSize: '1.3rem',
                  background: isSelected ? phase.color : '#e2e8f0',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? 'white' : '#475569'
                }}>
                  {phase.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '900', color: isSelected ? phase.color : '#1e293b' }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {phase.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🧭 מבנה ראשי: סרגל שיעורים מימין + נגן עמודים ממוקד משמאל */}
      <div style={{
        maxWidth: '1440px',
        margin: '24px auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>

        {/* 📚 רשימת שיעורים בסרגל צד */}
        <aside style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          maxHeight: 'calc(100vh - 170px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '90px'
        }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
                כל 32 המפגשים 📚
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                מציג {filteredLessons.length} מתוך 32
              </span>
            </div>
            {selectedModuleFilter !== 'all' && (
              <button
                onClick={() => setSelectedModuleFilter('all')}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  color: '#475569',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                הצג הכל
              </button>
            )}
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingLeft: '4px'
          }}>
            {filteredLessons.map((lesson) => {
              const fullIndex = GENAI_LESSONS.findIndex(l => l.id === lesson.id);
              const isSelected = fullIndex === selectedLessonIndex;
              const isDone = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(fullIndex)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' : '#f8fafc',
                    border: isSelected ? '2px solid #8b3dff' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '1.2rem' }}>{lesson.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? '900' : '700',
                        color: isSelected ? '#6d28d9' : '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        מפגש {lesson.id}: {lesson.title.split(':')[1] || lesson.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        {lesson.duration} • מודול {lesson.module}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {lesson.previewImg && (
                      <div
                        title={`צפה בתוצר הסופי של מפגש ${lesson.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage(lesson);
                        }}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: isSelected ? '1.5px solid #8b3dff' : '1px solid #cbd5e1',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={lesson.previewImg}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    )}
                    <span style={{ fontSize: '0.9rem' }}>
                      {isDone ? '✅' : '⚪'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 🌟 נגן עמודי המפגש הממוקד: בדיוק משימה אחת נקייה בעמוד! */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 🏷️ כרטיסיית כותרת המפגש + סרגל שלבים אינטראקטיבי */}
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1.5px solid #e2e8f0',
            padding: '22px 28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            {/* שורת ראש: תגיות + סימון כהושלם */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: '#f3e8ff',
                  color: '#7c3aed',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '800'
                }}>
                  {currentLesson.moduleTitle.split(':')[0]}
                </span>
                <span style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700'
                }}>
                  ⏱️ {currentLesson.duration}
                </span>
              </div>

              <button
                onClick={() => handleToggleComplete(currentLesson.id)}
                style={{
                  background: isLessonDone ? '#dcfce7' : '#f8fafc',
                  color: isLessonDone ? '#15803d' : '#475569',
                  border: '1.5px solid',
                  borderColor: isLessonDone ? '#86efac' : '#cbd5e1',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {isLessonDone ? '✅ מפגש הושלם' : 'סימון כהושלם ⚪'}
              </button>
            </div>

            {/* כותרת המפגש */}
            <h1 style={{ margin: '0 0 6px 0', fontSize: '1.55rem', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{currentLesson.icon}</span>
              <span>{currentLesson.title}</span>
            </h1>

            {/* 🎯 סרגל התקדמות עמודים אינטראקטיבי ונקי */}
            <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#6d28d9' }}>
                  שלב {safePageIndex + 1} מתוך {totalPages}: {currentPage.title}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>
                  {progressPercent}% הושלמו במפגש
                </span>
              </div>

              {/* קו התקדמות חלק */}
              <div style={{
                height: '6px',
                width: '100%',
                background: '#e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #8b3dff 0%, #10b981 100%)',
                  borderRadius: '10px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* כפתורי שלב קומפקטיים וקליקביליים */}
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {pages.map((p, pIdx) => {
                  const isActive = pIdx === safePageIndex;
                  const isDone = pIdx < safePageIndex;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setCurrentPageIndex(pIdx)}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                          : isDone
                          ? '#f0fdf4'
                          : '#f8fafc',
                        color: isActive
                          ? '#ffffff'
                          : isDone
                          ? '#166534'
                          : '#64748b',
                        border: isActive
                          ? '2px solid #6d28d9'
                          : isDone
                          ? '1.5px solid #86efac'
                          : '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isActive ? '0 2px 10px rgba(124,58,237,0.25)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isDone && <span style={{ color: '#16a34a' }}>✓</span>}
                      <span>{p.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 🎯 סוג עמוד 1: היעד והתוצר הסופי של המפגש                           */}
          {/* ================================================================= */}
          {currentPage.type === 'target' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* עבור מפגש 1 בלבד: בחירת נושא הפרויקט מ-6 הכרטיסיות */}
              {currentLesson.id === 1 && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '22px',
                  border: '1.5px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 100%)',
                    border: '1.5px solid #c7d2fe',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '18px'
                  }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: '900', color: '#1e1b4b' }}>
                      💡 צעד ראשון: בחרו את נושא האתר שלכם!
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                      בחרו באחד מ-6 התחומים הבאים – כל פרויקט מגיע עם שם מותג, סלוגן ופרומפט מחקר ל-Gemini:
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '14px',
                    marginBottom: '20px'
                  }}>
                    {IDEATION_TOPICS.map(topic => {
                      const isSelected = selectedTopicId === topic.id;
                      return (
                        <div
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          style={{
                            background: isSelected ? '#ffffff' : '#f8fafc',
                            border: isSelected ? `2.5px solid ${topic.accentColor}` : '1.5px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '16px',
                            cursor: 'pointer',
                            boxShadow: isSelected ? `0 6px 20px ${topic.accentColor}25` : 'none',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          {isSelected && (
                            <span style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              background: topic.accentColor,
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '0.7rem',
                              fontWeight: '800'
                            }}>
                              נבחר לבנייה ⭐
                            </span>
                          )}

                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                            {topic.title}
                          </h4>
                          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b' }}>
                            {topic.subtitle}
                          </p>

                          <div style={{
                            background: '#f1f5f9',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            marginBottom: '8px'
                          }}>
                            <div style={{ fontWeight: 'bold', color: topic.accentColor }}>
                              מותג: {topic.suggestedBrand}
                            </div>
                            <div style={{ color: '#475569', fontSize: '0.72rem' }}>
                              ״{topic.suggestedSlogan}״
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>צבעי מותג:</span>
                            {topic.recommendedColors.map((c, i) => (
                              <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c, border: '1px solid #cbd5e1' }} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* פרומפט מחקר ל-Gemini של הנושא הנבחר */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: '#475569', fontSize: '0.84rem' }}>
                        📋 פרומפט מחקר שוק עבור <strong>{currentTopic.title}</strong>:
                      </span>
                      <button
                        onClick={() => handleCopyPrompt(currentTopic.geminiResearchPrompt)}
                        style={{
                          background: currentTopic.accentColor,
                          color: 'white',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedPrompt ? '✅ הועתק!' : '📋 העתק פרומפט'}
                      </button>
                    </div>

                    <div style={{
                      background: '#0f172a',
                      color: '#38bdf8',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      fontFamily: 'monospace'
                    }}>
                      {currentTopic.geminiResearchPrompt}
                    </div>
                  </div>
                </div>
              )}

              {/* כרטיסיית התוצר הסופי המרכזית */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #e2e8f0',
                padding: '32px 36px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>
                    🎯
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#d97706' }}>
                      היעד של המפגש היום
                    </span>
                    <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '900', color: '#0f172a' }}>
                      {currentLesson.outcomeTitle || 'מה אנחנו יוצרים היום?'}
                    </h2>
                  </div>
                </div>

                <p style={{ margin: '0 0 24px 0', fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
                  {currentLesson.outcomeDesc || currentLesson.objective}
                </p>

                {/* תמונת התוצר הסופי המלאה */}
                {currentLesson.previewImg && (
                  <div
                    onClick={() => setLightboxImage(currentLesson)}
                    style={{
                      borderRadius: '18px',
                      overflow: 'hidden',
                      maxHeight: '440px',
                      marginBottom: '26px',
                      cursor: 'pointer',
                      position: 'relative',
                      border: '2px solid #cbd5e1',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                    }}
                    title="לחצו להגדלת התוצר הסופי למסך מלא"
                  >
                    <img
                      src={currentLesson.previewImg}
                      alt={currentLesson.outcomeTitle}
                      style={{ width: '100%', height: '100%', maxHeight: '440px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span>🔍</span> לחצו להגדלת התמונה במסך מלא
                    </div>
                  </div>
                )}

                {/* תגיות נושא */}
                {currentLesson.tags && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
                    {currentLesson.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '5px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* כפתור אחד יחיד ומוביל למעבר לשלב הבא */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  borderTop: '1.5px solid #f1f5f9',
                  paddingTop: '22px'
                }}>
                  <button
                    onClick={handleNextPage}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 34px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '1.06rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 6px 20px rgba(124,58,237,0.35)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <span>בואו נתחיל בעיצוב ב-Canva</span>
                    <span>⬅️</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* 🎨 סוג עמוד 2: משימת Canva בודדת וממוקדת (One Task per Page!)       */}
          {/* ================================================================= */}
          {currentPage.type === 'canva' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #e2e8f0',
                padding: '32px 36px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px'
              }}>
                {/* כותרת משימת העיצוב */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <span style={{
                      background: '#f3e8ff',
                      color: '#7c3aed',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '8px'
                    }}>
                      🎨 עיצוב ב-Canva • צעד {currentPage.taskIndex + 1} מתוך {currentPage.totalCanva}
                    </span>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '1.45rem', fontWeight: '900', color: '#0f172a' }}>
                      {currentPage.task.title}
                    </h2>
                  </div>

                  {/* כפתור פתיחת Canva */}
                  <a
                    href="https://www.canva.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, #8b3dff 0%, #7d2ae8 100%)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '0.92rem',
                      fontWeight: '900',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(125,42,232,0.35)'
                    }}
                  >
                    <span>🚀</span> פתח את Canva.com בחלון חדש
                  </a>
                </div>

                {/* 📍 תגית נתיב הפעולה המדויק ב-Canva בעברית */}
                <div style={{
                  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                  border: '1.5px solid #d8b4fe',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#8b3dff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    📍
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#6b21a8' }}>
                      הנתיב המדויק ב-Canva (ממשק עברית עדכני):
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#581c87', marginTop: '2px' }}>
                      {currentPage.task.location}
                    </div>
                  </div>
                </div>

                {/* הסבר המשימה - מרווח וקריא */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '24px 28px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '900', color: '#1e293b' }}>
                    מה עושים בשלב זה?
                  </h4>
                  <p style={{ margin: 0, fontSize: '1.02rem', color: '#475569', lineHeight: 1.7 }}>
                    {currentPage.task.desc}
                  </p>
                </div>

                {/* צ'קבוקס סימון הצלחה אינטראקטיבי */}
                {(() => {
                  const taskId = `l_${currentLesson.id}_canva_${currentPage.taskIndex}`;
                  const isDone = checkedSubTasks[taskId];

                  return (
                    <div
                      onClick={() => handleToggleTask(taskId)}
                      style={{
                        background: isDone ? '#f0fdf4' : '#ffffff',
                        border: isDone ? '2px solid #86efac' : '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px 22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                        background: isDone ? '#16a34a' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '900',
                        fontSize: '0.95rem'
                      }}>
                        {isDone ? '✓' : ''}
                      </div>

                      <span style={{
                        fontSize: '0.96rem',
                        fontWeight: '800',
                        color: isDone ? '#166534' : '#334155'
                      }}>
                        {isDone ? 'כל הכבוד! שלב זה סומן כהושלם ב-Canva ✨' : 'לחצו כאן לסמן שסיימתם שלב זה בהצלחה ב-Canva'}
                      </span>
                    </div>
                  );
                })()}

                {/* טיפ מעצבים */}
                <div style={{
                  background: '#fef3c7',
                  border: '1.5px solid #fde047',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  fontSize: '0.9rem',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.4rem' }}>💡</span>
                  <span>
                    <strong>טיפ של מעצבים:</strong> {currentLesson.canvaSuperpower ? `סופר-כוח השבוע: ${currentLesson.canvaSuperpower}. ` : ''}
                    הקפידו על שמירת קבצים באיכות גבוהה וארגון נכסים מסודר.
                  </span>
                </div>

                {/* כפתורי ניווט */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1.5px solid #f1f5f9',
                  paddingTop: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <button
                    onClick={handlePrevPage}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      color: '#475569',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>➡️</span>
                    <span>לשלב הקודם</span>
                  </button>

                  <button
                    onClick={handleNextPage}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 34px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 6px 20px rgba(16,185,129,0.35)'
                    }}
                  >
                    <span>
                      {currentPage.taskIndex < currentPage.totalCanva - 1
                        ? 'המשך למשימת העיצוב הבאה'
                        : 'סיימתי את כל העיצובים, עבור לבנייה באתר'}
                    </span>
                    <span>⬅️</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* 🧱 סוג עמוד 3: בנייה ב-WebBlocks Studio                             */}
          {/* ================================================================= */}
          {/* ================================================================= */}
          {/* 🧱 סוג עמוד 3: משימת WebBlocks בודדת וממוקדת (One Task per Page!)   */}
          {/* ================================================================= */}
          {currentPage.type === 'webblocks' && currentPage.task && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #e2e8f0',
                padding: '32px 36px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <span style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '8px'
                    }}>
                      🧱 שלב הבנייה בבלוקים {currentPage.totalWebBlocks > 1 ? `• צעד ${currentPage.taskIndex + 1} מתוך ${currentPage.totalWebBlocks}` : ''}
                    </span>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '1.45rem', fontWeight: '900', color: '#166534' }}>
                      {currentPage.task.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => navigate('/WebBlocks')}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '900',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(22,163,74,0.3)'
                    }}
                  >
                    <span>🚀</span> פתח את WebBlocks Studio
                  </button>
                </div>

                {/* הסבר המשימה - מרווח וקריא */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '24px 28px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '900', color: '#1e293b' }}>
                    מה עושים בשלב זה?
                  </h4>
                  <p style={{ margin: 0, fontSize: '1.02rem', color: '#475569', lineHeight: 1.7 }}>
                    {currentPage.task.desc}
                  </p>
                </div>

                {/* טיפ מקצועי לבנייה בבלוקים */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1.5px solid #86efac',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '1.4rem' }}>💡</div>
                  <div style={{ fontSize: '0.92rem', color: '#166534', fontWeight: '700' }}>
                    ב-WebBlocks גוררים את הרכיבים מהסרגל הצדדי ומחברים אותם כמו חלקי לגו דיגיטליים!
                  </div>
                </div>

                {/* צ'קבוקס סימון הצלחה אינטראקטיבי */}
                {(() => {
                  const taskId = `l_${currentLesson.id}_wb_${currentPage.taskIndex}`;
                  const isDone = checkedSubTasks[taskId];

                  return (
                    <div
                      onClick={() => handleToggleTask(taskId)}
                      style={{
                        background: isDone ? '#f0fdf4' : '#ffffff',
                        border: isDone ? '2px solid #86efac' : '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px 22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                        background: isDone ? '#16a34a' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '900',
                        fontSize: '0.95rem'
                      }}>
                        {isDone ? '✓' : ''}
                      </div>

                      <span style={{
                        fontSize: '0.96rem',
                        fontWeight: '800',
                        color: isDone ? '#166534' : '#334155'
                      }}>
                        {isDone ? 'שלב זה הושלם ב-WebBlocks Studio! 🎉' : 'סיימתי שלב זה ב-WebBlocks Studio (לחצו לסימון הצלחה)'}
                      </span>
                    </div>
                  );
                })()}

                {/* כפתורי ניווט */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1.5px solid #f1f5f9',
                  paddingTop: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <button
                    onClick={handlePrevPage}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      color: '#475569',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>➡️</span>
                    <span>לשלב הקודם</span>
                  </button>

                  <button
                    onClick={handleNextPage}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 34px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 6px 20px rgba(2,132,199,0.35)'
                    }}
                  >
                    <span>
                      {currentPage.taskIndex < currentPage.totalWebBlocks - 1
                        ? 'למשימת הבלוקים הבאה'
                        : 'המשך לשלב קוד ה-HTML'}
                    </span>
                    <span>⬅️</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* ⌨️ סוג עמוד 4: משימת קוד HTML & CSS בודדת (One Task per Page!)       */}
          {/* ================================================================= */}
          {currentPage.type === 'html' && currentPage.task && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #e2e8f0',
                padding: '32px 36px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <span style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '8px'
                    }}>
                      ⌨️ שלב הקוד החי {currentPage.totalHtml > 1 ? `• צעד ${currentPage.taskIndex + 1} מתוך ${currentPage.totalHtml}` : ''}
                    </span>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '1.45rem', fontWeight: '900', color: '#0369a1' }}>
                      {currentPage.task.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleCopyCode(currentPage.task.code)}
                      style={{
                        background: '#f1f5f9',
                        color: '#0f172a',
                        border: '1.5px solid #cbd5e1',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {copiedCode ? '✅ הועתק!' : '📋 העתק קוד'}
                    </button>

                    <button
                      onClick={() => handleOpenInHTMLEditor(currentPage.task.code)}
                      style={{
                        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: '900',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(2,132,199,0.3)'
                      }}
                    >
                      <span>🚀</span> פתח בעורך HTML החי
                    </button>
                  </div>
                </div>

                {/* הסבר המשימה */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '20px 24px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: '900', color: '#1e293b' }}>
                    הסבר הקוד:
                  </h4>
                  <p style={{ margin: 0, fontSize: '1.02rem', color: '#475569', lineHeight: 1.6 }}>
                    {currentPage.task.desc}
                  </p>
                </div>

                {/* קוד המשימה ב-Dark Code Box מרווח ומעוצב */}
                <div style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
                }}>
                  <div style={{
                    background: '#1e293b',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #334155'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 'bold' }}>
                      HTML5 & CSS3 Snippet
                    </span>
                    <button
                      onClick={() => handleCopyCode(currentPage.task.code)}
                      style={{
                        background: 'transparent',
                        color: '#38bdf8',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedCode ? '✅ הועתק!' : '📋 העתק'}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: '22px 26px',
                    color: '#e2e8f0',
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                    fontFamily: 'Consolas, "Fira Code", monospace',
                    overflowX: 'auto',
                    direction: 'ltr',
                    textAlign: 'left'
                  }}>
                    <code>{currentPage.task.code}</code>
                  </pre>
                </div>

                {/* צ'קבוקס סימון הצלחה אינטראקטיבי */}
                {(() => {
                  const taskId = `l_${currentLesson.id}_html_${currentPage.taskIndex}`;
                  const isDone = checkedSubTasks[taskId];

                  return (
                    <div
                      onClick={() => handleToggleTask(taskId)}
                      style={{
                        background: isDone ? '#f0fdf4' : '#ffffff',
                        border: isDone ? '2px solid #86efac' : '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px 22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                        background: isDone ? '#16a34a' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '900',
                        fontSize: '0.95rem'
                      }}>
                        {isDone ? '✓' : ''}
                      </div>

                      <span style={{
                        fontSize: '0.96rem',
                        fontWeight: '800',
                        color: isDone ? '#166534' : '#334155'
                      }}>
                        {isDone ? 'הקוד הוטמע והורץ בהצלחה! 💻' : 'הבנתי והרצתי את הקוד בעורך ה-HTML (לחצו לסימון הצלחה)'}
                      </span>
                    </div>
                  );
                })()}

                {/* כפתורי ניווט */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1.5px solid #f1f5f9',
                  paddingTop: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <button
                    onClick={handlePrevPage}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      color: '#475569',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>➡️</span>
                    <span>לשלב הקודם</span>
                  </button>

                  <button
                    onClick={handleNextPage}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 34px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 6px 20px rgba(124,58,237,0.35)'
                    }}
                  >
                    <span>
                      {currentPage.taskIndex < currentPage.totalHtml - 1
                        ? 'למשימת הקוד הבאה'
                        : 'המשך לשלב ה-AI'}
                    </span>
                    <span>⬅️</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* 🤖 סוג עמוד 5: פרומפט הזהב ל-Gemini AI                              */}
          {/* ================================================================= */}
          {currentPage.type === 'gemini' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
                color: 'white',
                borderRadius: '24px',
                padding: '32px 36px',
                boxShadow: '0 6px 25px rgba(124,58,237,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>🤖</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: '#38bdf8' }}>
                        פרומפט הזהב של המפגש ל-Gemini AI
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        העתיקו את הפרומפט המדויק בלחיצת כפתור והדביקו ב-Google Gemini לקבלת רעיונות וטקסטים:
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyPrompt(currentLesson.geminiPrompt)}
                    style={{
                      background: 'linear-gradient(135deg, #00c4cc 0%, #7d2ae8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '12px',
                      fontWeight: '900',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0,196,204,0.3)'
                    }}
                  >
                    {copiedPrompt ? '✅ פרומפט הועתק!' : '📋 העתק פרומפט בלחיצה'}
                  </button>
                </div>

                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  fontSize: '0.96rem',
                  lineHeight: 1.7,
                  color: '#f8fafc'
                }}>
                  {currentLesson.geminiPrompt}
                </div>
              </div>

              {/* אתגר מתקדמים */}
              {currentLesson.proChallenge && (
                <div style={{
                  background: '#fef3c7',
                  border: '1.5px solid #fcd34d',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <span style={{ fontSize: '1.8rem' }}>🏆</span>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '900', color: '#92400e' }}>
                      אתגר למתקדמים (Pro Challenge):
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.94rem', color: '#78350f', lineHeight: 1.6 }}>
                      {currentLesson.proChallenge}
                    </p>
                  </div>
                </div>
              )}

              {/* כפתורי ניווט */}
              <div style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #e2e8f0',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <button
                  onClick={handlePrevPage}
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    color: '#475569',
                    padding: '12px 22px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>➡️</span>
                  <span>חזרה לשלב הקוד</span>
                </button>

                <button
                  onClick={handleNextPage}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 34px',
                    borderRadius: '14px',
                    fontWeight: '900',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.35)'
                  }}
                >
                  <span>מעבר לחגיגת סיום המפגש</span>
                  <span>⬅️</span>
                </button>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* 🎉 סוג עמוד 6: חגיגת סיום המפגש ומעבר למפגש הבא                     */}
          {/* ================================================================= */}
          {currentPage.type === 'complete' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #86efac',
                borderRadius: '24px',
                padding: '36px 40px',
                textAlign: 'center',
                boxShadow: '0 6px 25px rgba(34,197,94,0.12)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.6rem', fontWeight: '900', color: '#166534' }}>
                  כל הכבוד! סיימתם בהצלחה את מפגש {currentLesson.id}!
                </h2>
                <p style={{ margin: '0 auto 24px auto', maxWidth: '640px', fontSize: '1.02rem', color: '#15803d', lineHeight: 1.6 }}>
                  השלמתם את הגדרת היעד, עיצבתם במדויק ב-Canva, בניתם את הרכיבים באתר ושדרגתם בעזרת בינה מלאכותית.
                </p>

                {/* כרטיסיית הישגים */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  maxWidth: '700px',
                  margin: '0 auto 30px auto'
                }}>
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '1.3rem' }}>🎯</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534' }}>היעד הושג</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '1.3rem' }}>🎨</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534' }}>עוצב ב-Canva</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '1.3rem' }}>💻</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534' }}>נבנה באתר</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '1.3rem' }}>🤖</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534' }}>שודרג עם AI</div>
                  </div>
                </div>

                {/* כפתורי ניווט */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handlePrevPage}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      color: '#475569',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>➡️</span>
                    <span>חזרה לשלב ה-AI</span>
                  </button>

                  <button
                    onClick={handleNextPage}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 38px',
                      borderRadius: '14px',
                      fontWeight: '900',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <span>{selectedLessonIndex < GENAI_LESSONS.length - 1 ? 'סיום המפגש ומעבר למפגש הבא' : 'סיום כל המסלול בהצלחה!'}</span>
                    <span>{selectedLessonIndex < GENAI_LESSONS.length - 1 ? '⬅️' : '🏆'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* 🔍 מודאל הגדלת תמונת התוצר הסופי (Lightbox Modal) */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1e293b',
              borderRadius: '24px',
              maxWidth: '920px',
              width: '100%',
              maxHeight: '92vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1.5px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid #334155',
              background: '#0f172a'
            }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#818cf8',
                  background: 'rgba(99,102,241,0.2)',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}>
                  🎯 התוצר הסופי של מפגש {lightboxImage.id}
                </span>
                <h3 style={{ margin: '6px 0 0 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: '900' }}>
                  {lightboxImage.outcomeTitle || lightboxImage.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                style={{
                  background: '#334155',
                  border: 'none',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              flex: 1,
              maxHeight: '58vh',
              overflow: 'hidden',
              background: '#090d16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={lightboxImage.previewImg}
                alt={lightboxImage.outcomeTitle || 'תוצר סופי'}
                style={{ maxWidth: '100%', maxHeight: '58vh', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '18px 24px', background: '#0f172a', borderTop: '1px solid #334155' }}>
              <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {lightboxImage.outcomeDesc || lightboxImage.objective}
              </p>
              {lightboxImage.tags && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {lightboxImage.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        border: '1px solid #334155',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
