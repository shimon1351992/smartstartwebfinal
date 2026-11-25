import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEGO_WEDO_PROJECTS } from './legoWeDoData';
import './LegoWeDoTrack.css';

export default function LegoWeDoTrack() {
  const navigate = useNavigate();
  // If null, show the beautiful Project Selection Lobby page!
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('assembly'); // 'assembly' | 'coding' | 'parts-inventory'
  const [completedSteps, setCompletedSteps] = useState({});
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // If a project is selected:
  const currentProject = selectedProjectIndex !== null ? LEGO_WEDO_PROJECTS[selectedProjectIndex] : null;
  const currentStep = currentProject ? (currentProject.steps[currentStepIndex] || currentProject.steps[0]) : null;
  const totalSteps = currentProject ? currentProject.steps.length : 0;

  const toggleStepCompleted = (projId, stepNum) => {
    const key = `${projId}_step_${stepNum}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      setActiveTab('coding');
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  // =========================================================================
  // VIEW 1: BEAUTIFUL PROJECT SELECTION PAGE (עמוד בחירת פרויקטים)
  // =========================================================================
  if (selectedProjectIndex === null) {
    return (
      <div className="wedo-page-container">
        {/* Header */}
        <header className="wedo-header">
          <div className="wedo-header-left">
            <button onClick={() => navigate('/tracks')} className="wedo-back-btn">
              <span>⬅️</span>
              <span>חזרה לכל המסלולים</span>
            </button>
            <div className="wedo-title-group">
              <h1 className="wedo-main-title">
                <span>🧱</span>
                <span>Lego WeDo 2.0 • בחירת פרויקט לבנייה</span>
              </h1>
              <p className="wedo-subtitle">
                ערכת ליבה רשמית 45300 (285 חלקים) • דגמים נבחרים מתוך BrickLink Studio 2.0
              </p>
            </div>
          </div>

          <div className="wedo-set-badge">
            ערכת WeDo 2.0 • 45300
          </div>
        </header>

        {/* Lobby Main Content */}
        <main className="wedo-lobby-main">
          
          <div className="wedo-lobby-hero">
            <div className="wedo-lobby-hero-badge">
              <span>🚀</span>
              <span>מרכז הפרויקטים לבנייה ותכנות</span>
            </div>
            <h2 className="wedo-lobby-hero-title">
              איזה דגם תרצו לבנות היום?
            </h2>
            <p className="wedo-lobby-hero-desc">
              בחרו באחד הפרויקטים הבאים כדי לפתוח את שלבי הבנייה המפורטים והמלאים, תכנות קוד בלוקים בתוכנת WeDo 2.0 וחוברות PDF להורדה.
            </p>
          </div>

          {/* Grid of Projects */}
          <div className="wedo-lobby-grid">
            {LEGO_WEDO_PROJECTS.map((proj, idx) => (
              <div key={proj.id} className="wedo-lobby-card">
                
                {/* Project Image Preview */}
                <div 
                  className="wedo-lobby-card-image-wrap"
                  onClick={() => {
                    setSelectedProjectIndex(idx);
                    setCurrentStepIndex(0);
                    setActiveTab('assembly');
                  }}
                >
                  <img
                    src={proj.coverImage || proj.steps[proj.steps.length - 1].image}
                    alt={proj.title}
                    className="wedo-lobby-card-image"
                  />
                  <div className="wedo-lobby-image-overlay">
                    <span className="wedo-lobby-badge-step">
                      {proj.stepsCount} שלבי בנייה
                    </span>
                    <span className="wedo-lobby-badge-time">
                      ⏱️ {proj.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Project Body */}
                <div className="wedo-lobby-card-body">
                  <div className="wedo-lobby-card-header">
                    <h3 className="wedo-lobby-card-title">{proj.title}</h3>
                    <span className="wedo-lobby-difficulty-tag">{proj.difficulty}</span>
                  </div>

                  <p className="wedo-lobby-card-desc">{proj.subtitle}</p>

                  {/* Mechanism tags */}
                  {proj.mechanisms && (
                    <div className="wedo-lobby-tags">
                      {proj.mechanisms.map((mech, mIdx) => (
                        <span key={mIdx} className="wedo-lobby-tag-chip">
                          ⚙️ {mech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="wedo-lobby-card-actions">
                    <button
                      onClick={() => {
                        setSelectedProjectIndex(idx);
                        setCurrentStepIndex(0);
                        setActiveTab('assembly');
                      }}
                      className="wedo-lobby-start-btn"
                    >
                      <span>התחל בבנייה</span>
                      <span>🚀</span>
                    </button>

                    {proj.pdfUrl && (
                      <a
                        href={proj.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="wedo-lobby-pdf-btn"
                        title="הורדת חוברת הוראות מלאה ב-PDF"
                      >
                        <span>📄 חוברת PDF</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL-WIDTH INSTRUCTION & ASSEMBLY STUDIO (עמוד שלבי הבנייה)
  // =========================================================================
  return (
    <div className="wedo-page-container">
      {/* 🚀 Header with Back to Projects */}
      <header className="wedo-header">
        <div className="wedo-header-left">
          <button 
            onClick={() => setSelectedProjectIndex(null)} 
            className="wedo-back-btn"
          >
            <span>🔙</span>
            <span>חזרה לבחירת פרויקטים</span>
          </button>
          <div className="wedo-title-group">
            <h1 className="wedo-main-title">
              <span>🧱</span>
              <span>{currentProject.title}</span>
            </h1>
            <p className="wedo-subtitle">
              {currentProject.subtitle} • ערכת ליבה WeDo 2.0 (45300)
            </p>
          </div>
        </div>

        <div className="wedo-set-badge">
          ערכת WeDo 2.0 • 45300
        </div>
      </header>

      {/* Main Container */}
      <main className="wedo-main">

        {/* 📑 Mode Bar */}
        <div className="wedo-mode-bar">
          <button
            onClick={() => setActiveTab('assembly')}
            className={`wedo-mode-btn ${activeTab === 'assembly' ? 'active' : ''}`}
          >
            <span>🛠️</span>
            <span>שלבי בנייה מכאנית ({currentStepIndex + 1}/{totalSteps})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('coding')}
            className={`wedo-mode-btn ${activeTab === 'coding' ? 'active' : ''}`}
          >
            <span>💻</span>
            <span>תכנות ולוגיקה (קוד בלוקים)</span>
          </button>

          <button
            onClick={() => setActiveTab('parts-inventory')}
            className={`wedo-mode-btn ${activeTab === 'parts-inventory' ? 'active' : ''}`}
          >
            <span>📦</span>
            <span>חלקים המשמשים בדגם</span>
          </button>

          {currentProject.pdfUrl && (
            <a
              href={currentProject.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="wedo-mode-btn"
              style={{ marginRight: 'auto', textDecoration: 'none', color: '#0369a1' }}
            >
              <span>📄</span>
              <span>חוברת הוראות PDF להורדה</span>
            </a>
          )}
        </div>

        {/* ================================================================ */}
        {/* 🛠️ TAB 1: ASSEMBLY STAGE (FULL-WIDTH INSTRUCTION VIEW)           */}
        {/* ================================================================ */}
        {activeTab === 'assembly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Stepper Bar on Top */}
            <div className="wedo-stepper">
              {currentProject.steps.map((st, sIdx) => {
                const isCurrent = sIdx === currentStepIndex;
                const isDone = completedSteps[`${currentProject.id}_step_${st.stepNumber}`];
                return (
                  <button
                    key={st.stepNumber}
                    onClick={() => setCurrentStepIndex(sIdx)}
                    className={`wedo-step-circle-btn ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}
                  >
                    <span className="wedo-step-num">{isDone ? '✓' : st.stepNumber}</span>
                    <span className="wedo-step-label">שלב {st.stepNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* FULL-WIDTH STAGE CARD (NO SIDEBAR!) */}
            <div className="wedo-stage-card-fullwidth">
              
              {/* Full Width Instruction Image */}
              <div 
                className="wedo-instruction-image-container full-width"
                onClick={() => setIsZoomModalOpen(true)}
                title="לחץ להגדלת תרשים ההוראות במסך מלא"
              >
                <img
                  src={currentStep.image}
                  alt={`${currentProject.title} - שלב ${currentStep.stepNumber}`}
                  className="wedo-instruction-image full-width"
                  loading="eager"
                />
                
                <div className="wedo-zoom-hint">
                  <span>🔍</span>
                  <span>לחץ להגדלה במסך מלא</span>
                </div>
              </div>

              {/* Navigation & Controls Bar Below Image */}
              <div className="wedo-fullwidth-nav-bar">
                
                {/* Previous Step Button */}
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="wedo-nav-btn wedo-nav-btn-prev"
                >
                  <span>➡️ השלב הקודם</span>
                </button>

                {/* Center Info: Step Indicator & Completion Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                    שלב {currentStep.stepNumber} מתוך {totalSteps}
                  </span>

                  <button
                    onClick={() => toggleStepCompleted(currentProject.id, currentStep.stepNumber)}
                    className={`wedo-complete-toggle-btn ${
                      completedSteps[`${currentProject.id}_step_${currentStep.stepNumber}`] ? 'done' : ''
                    }`}
                  >
                    {completedSteps[`${currentProject.id}_step_${currentStep.stepNumber}`]
                      ? '✓ הושלם'
                      : 'סמן כהושלם'}
                  </button>

                  <button
                    onClick={() => setIsZoomModalOpen(true)}
                    className="wedo-zoom-btn-action"
                    title="הגדל במסך מלא"
                  >
                    <span>🔍 מסך מלא</span>
                  </button>
                </div>

                {/* Next Step Button */}
                <button
                  onClick={handleNextStep}
                  className="wedo-nav-btn wedo-nav-btn-next"
                >
                  <span>
                    {currentStepIndex === totalSteps - 1 ? 'סיום ועבור לתכנות 🚀' : 'השלב הבא ⬅️'}
                  </span>
                </button>

              </div>

            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 💻 TAB 2: CODING & LOGIC (WEDO BLOCKS STYLE)                     */}
        {/* ================================================================ */}
        {activeTab === 'coding' && (
          <div className="wedo-coding-card">
            <div className="wedo-coding-header">
              <h3 className="wedo-coding-title">
                <span>💻</span>
                <span>{currentProject.codingGuide.title}</span>
              </h3>
              <span className="wedo-proj-badge">תוכנת WeDo 2.0 • קוד בלוקים</span>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {currentProject.codingGuide.concept}
            </p>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>
              רצף הבלוקים להפעלת המודל:
            </h4>

            <div className="wedo-blocks-grid">
              {currentProject.codingGuide.blocksSequence.map((block, bIdx) => (
                <div key={bIdx} className="wedo-block-card">
                  <div className="wedo-block-icon">{block.icon}</div>
                  <div className="wedo-block-info">
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}>
                      בלוק #{bIdx + 1}
                    </span>
                    <h5 className="wedo-block-name">{block.name}</h5>
                    <p className="wedo-block-desc">{block.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="wedo-success-banner">
              <div className="wedo-success-text">
                <h4>🎉 סיימתם בהצלחה את הבנייה והתכנות!</h4>
                <p>הדגם חי ומוכן לפעולה. לחצו על כפתור ההפעלה בתוכנה לבדיקת המערכת.</p>
              </div>
              <button
                onClick={() => setSelectedProjectIndex(null)}
                className="wedo-switch-proj-btn"
              >
                חזרה לבחירת פרויקטים 🔙
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 📦 TAB 3: PARTS INVENTORY                                        */}
        {/* ================================================================ */}
        {activeTab === 'parts-inventory' && (
          <div className="wedo-coding-card">
            <h3 className="wedo-coding-title">
              <span>📦</span>
              <span>רשימת הרכיבים המשמשים ב-{currentProject.title}</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
              כל הרכיבים להלן מופיעים במגש המיון של ערכת WeDo 2.0 (ערכה 45300).
            </p>

            <div className="wedo-blocks-grid" style={{ marginTop: '12px' }}>
              {currentProject.componentsUsed.map((comp, cIdx) => (
                <div key={cIdx} className="wedo-block-card">
                  <div className="wedo-block-icon" style={{ padding: '4px' }}>
                    {comp.imgUrl ? (
                      <img
                        src={comp.imgUrl}
                        alt={comp.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">🧩</text></svg>'; }}
                      />
                    ) : (
                      '🧩'
                    )}
                  </div>
                  <div className="wedo-block-info" style={{ flex: 1 }}>
                    <h5 className="wedo-block-name">{comp.name}</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                        מק"ט: {comp.partNo}
                      </span>
                      <span className="wedo-callout-item-qty">כמות: {comp.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 🔍 Lightbox Modal for Fullscreen Instruction Inspection */}
      {isZoomModalOpen && (
        <div 
          className="wedo-zoom-modal-backdrop"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="wedo-zoom-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="wedo-zoom-modal-close" 
              onClick={() => setIsZoomModalOpen(false)}
            >
              ✕
            </button>
            <img
              src={currentStep.image}
              alt={currentStep.title}
              className="wedo-zoom-modal-img"
            />
            <div className="wedo-zoom-modal-caption">
              <span>{currentProject.title} • שלב {currentStep.stepNumber}</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>לחץ בכל מקום לסגירה</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
