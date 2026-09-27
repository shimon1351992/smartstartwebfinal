import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Smarthouse from './Smarthouse';
import Builder from './Builder';
import RobotSmall from './RobotSmall';
import SrobotBuilder from './SrobotBuilder';
import CodeToBlock from './CodeToBlock';
import WebBlocks from './WebBlocks';
import CodeEditorPage from './CodeEditorPage';
import FreenoveCar from './FreenoveCar';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import AuthPage from './AuthPage';
import CustomTrackCreator from './CustomTrackCreator';
import CustomTrackStudio from './CustomTrackStudio';
import GenAIWebTrack from './GenAIWebTrack';
import HTMLEditorStudio from './HTMLEditorStudio';
import { getActiveServerUrl } from './serverPort';

import LandingPage from './LandingPage';
import DriverModal from './DriverModal';
import { CAR_4WD_HERO, SMARTHOUSE_HERO, TURTLE_HERO } from './projectImages';

// 🚀 Learning Dashboard Home Component
function Home() {
  const [currentUser, setCurrentUser] = React.useState(() => {
    try {
      const saved = sessionStorage.getItem('smartstart_teacher_user') || localStorage.getItem('smartstart_teacher_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentStudent, setCurrentStudent] = React.useState(() => {
    try {
      const saved = localStorage.getItem('smartstart_student_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [customTracks, setCustomTracks] = React.useState([]);
  const [showDriverModal, setShowDriverModal] = React.useState(false);

  React.useEffect(() => {
    async function loadTracks() {
      try {
        const serverUrl = await getActiveServerUrl();
        const res = await axios.get(`${serverUrl}/api/custom-tracks`);
        if (res.data && res.data.success && Array.isArray(res.data.tracks)) {
          setCustomTracks(res.data.tracks);
        }
      } catch (e) {
        console.log('Could not fetch custom tracks:', e);
      }
    }
    loadTracks();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('smartstart_teacher_user');
    localStorage.removeItem('smartstart_teacher_user');
    localStorage.removeItem('smartstart_student_session');
    window.location.href = '/';
  };

  const handleDeleteCustomTrack = async (e, trackId, trackTitle) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את המסלול "${trackTitle}"?`)) return;

    try {
      const serverUrl = await getActiveServerUrl();
      const res = await axios.delete(`${serverUrl}/api/custom-tracks/${trackId}`);
      if (res.data && res.data.success) {
        setCustomTracks(prev => prev.filter(t => (t.id || t.trackId) !== trackId));
      } else {
        alert('שגיאה במחיקת המסלול');
      }
    } catch (err) {
      console.error('Error deleting custom track:', err);
      alert('שגיאה בתקשורת עם השרת במחיקת המסלול');
    }
  };

  const learningTracks = React.useMemo(() => [
    {
      to: "/FreenoveCar",
      title: "רובוט מכונית 4WD Pro",
      description: "הרכבה וכיול 4WD Pro, מנוע סרוו Pan-Tilt, מעקב אחר קו, עקיפת מכשולים ושליטה ב-Wi-Fi.",
      imgUrl: CAR_4WD_HERO,
      badges: ["4WD Pro", "ESP32", "Wi-Fi & App"],
      gradient: "linear-gradient(135deg, #4F46E5 0%, #7E22CE 100%)",
      glow: "0 0 30px rgba(79, 70, 229, 0.3)"
    },
    {
      to: "/RobotSmall",
      title: "רובוט צב חכם Keyestudio",
      description: "הרכבה מכאנית מפורטת צעד-אחר-צעד, בקרת מנועים, חיישנים וניווט אוטונומי.",
      imgUrl: TURTLE_HERO,
      badges: ["KS0558 V3.0", "רובוטיקה", "ניווט"],
      gradient: "linear-gradient(135deg, #FF9900 0%, #FF5500 100%)",
      glow: "0 0 30px rgba(255, 153, 0, 0.3)"
    },
    {
      to: "/smarthouse",
      title: "בית חכם IoT",
      description: "בניית בית חכם אוטומטי, תכנות 13 חיישנים, מנועים, מסך LCD, RFID ותקשורת ענן.",
      imgUrl: SMARTHOUSE_HERO,
      badges: ["KS5009 ESP32", "חיישנים", "IoT Cloud"],
      gradient: "linear-gradient(135deg, #FF007A 0%, #FF758C 100%)",
      glow: "0 0 30px rgba(255, 0, 122, 0.3)"
    },
    {
      to: "/genrativeAI",
      title: "genrative AI",
      description: "עולם של יצירה, עיצוב, AI ואפליקציות: מסע יצירתי ב-Canva, מיתוג, תלת-ממד, פיתוח אתרים ואפליקציות ב-30 מפגשים.",
      imgUrl: "/genai_course/assets/home-background-original.png",
      badges: ["30 מפגשים", "6 יחידות", "Canva & AI", "3D & Web Apps"],
      gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #06b6d4 100%)",
      glow: "0 0 30px rgba(99, 102, 241, 0.35)"
    }
  ], []);

  // Filter tracks only for students who logged in with specific class code
  const visibleTracks = React.useMemo(() => {
    const allTracks = [
      ...learningTracks,
      ...customTracks.map(trk => ({
        to: `/track/custom/${trk.id || trk.trackId}`,
        title: trk.title,
        description: trk.description,
        imgUrl: trk.coverImage,
        badges: trk.badges || ['AI Custom', trk.targetBoard?.toUpperCase() || 'ESP32'],
        gradient: trk.gradient || 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        glow: trk.glow || '0 0 30px rgba(16, 185, 129, 0.3)',
        trackKey: trk.id || trk.trackId
      }))
    ];

    // Teachers always see all tracks!
    if (currentUser) {
      return learningTracks;
    }
    // If student is logged in with assigned tracks, filter accordingly
    if (currentStudent && currentStudent.assignedTracks && !currentStudent.assignedTracks.includes('all')) {
      const assigned = currentStudent.assignedTracks;
      return allTracks.filter(track => {
        if (track.to === '/FreenoveCar' && assigned.includes('car')) return true;
        if (track.to === '/RobotSmall' && assigned.includes('turtle')) return true;
        if (track.to === '/smarthouse' && assigned.includes('house')) return true;
        if (track.trackKey && assigned.includes(track.trackKey)) return true;
        return false;
      });
    }
    return learningTracks;
  }, [currentUser, currentStudent, learningTracks, customTracks]);

  const userTier = React.useMemo(() => {
    if (!currentUser) return 0;
    // Explicit starter / basic plan is ALWAYS Tier 1 (only learning tracks)
    if (currentUser.plan === 'starter' || currentUser.plan === 'individual' || currentUser.tier === 1) {
      return 1;
    }
    // Premium / Admin is Tier 3 (everything including AI)
    if (currentUser.plan === 'premium' || currentUser.plan === 'enterprise' || currentUser.tier === 3 || currentUser.role === 'admin' || currentUser.username === 'shimon1351992') {
      return 3;
    }
    // Pro / Teacher is Tier 2 (tracks + classes + dev tools)
    if (currentUser.plan === 'pro' || currentUser.tier === 2 || currentUser.role === 'teacher') {
      return 2;
    }
    return 1;
  }, [currentUser]);

  const canManageStudents = userTier >= 2;
  const canAccessDevTools = userTier >= 2;
  const canCreateAI = userTier >= 3;

  const devTools = [
    {
      to: "/builder",
      title: "סביבת פיתוח בלוקים",
      description: "סביבת פיתוח חופשית בבלוקים ל-Arduino ו-ESP32, כולל מחולל בלוקים ב-AI מובנה, קומפילציה וצריבה ישירה.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      badges: ["Arduino Studio", "AI Block Builder", "ESP32 Flashing"],
      gradient: "linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)",
      glow: "0 0 30px rgba(79, 70, 229, 0.3)"
    },
    {
      to: "/WebBlocks",
      title: "פיתוח אתרים בבלוקים",
      description: "פיתוח אתרים ואפליקציות רשת בבלוקים, כולל מחולל בלוקי HTML/CSS/JS ב-AI ותצוגת Monaco Editor.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      badges: ["HTML5 / CSS3", "AI Web Blocks", "Monaco Editor"],
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
      glow: "0 0 30px rgba(14, 165, 233, 0.3)"
    },
    {
      to: "/CodeEditor",
      title: "סביבת פיתוח ארדואינו",
      description: "עורך קוד מקצועי מבוסס VS Code לכתיבת קוד C++ ו-Arduino נקי עם שמירה והורדת קובצי .ino.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
      badges: ["VS Code Engine", "C++ / Arduino", "Live Preview"],
      gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      glow: "0 0 30px rgba(99, 102, 241, 0.3)"
    }
  ];

  // If student is logged in, show the dedicated clean Classroom Track Selector
  if (currentStudent && !currentUser) {
    return (
      <div className="tracks-root-bg">
        {/* Dynamic Ambient Moving Canvas (No static image, glowing organic orbs + cyber grid) */}
        <div className="tracks-ambient-canvas" aria-hidden="true">
          <div className="tracks-cyber-grid" />
          <div className="tracks-floating-orb tracks-orb-cyan" />
          <div className="tracks-floating-orb tracks-orb-purple" />
          <div className="tracks-floating-orb tracks-orb-magenta" />
          <div className="tracks-floating-orb tracks-orb-emerald" />
        </div>

        {/* Top Navbar */}
        <div style={{ padding: '16px 20px 0' }}>
          <header className="tracks-glass-header" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Right: Logo & Student Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.12)',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)'
                }}>
                  <img 
                    src="/logo_icon.png" 
                    alt="SmartStart Logo" 
                    style={{ width: '38px', height: '38px', objectFit: 'contain' }} 
                  />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
                  SmartStart <span style={{ color: '#2563eb' }}>IoT</span>
                </span>
              </Link>

              <span style={{
                fontSize: '0.88rem',
                fontWeight: '700',
                padding: '6px 16px',
                borderRadius: '30px',
                background: 'rgba(238, 242, 255, 0.85)',
                border: '1px solid rgba(199, 210, 254, 0.9)',
                color: '#3730a3',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                כיתה: <b style={{ color: '#1e1b4b' }}>{currentStudent.className}</b>
              </span>

              <span style={{
                fontSize: '0.88rem',
                fontWeight: '700',
                padding: '6px 16px',
                borderRadius: '30px',
                background: 'rgba(236, 253, 245, 0.85)',
                border: '1px solid rgba(167, 243, 208, 0.9)',
                color: '#065f46',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                תלמיד: <b style={{ color: '#064e3b' }}>{currentStudent.studentName}</b>
              </span>

              {currentStudent.teacherName && (
                <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '600' }}>
                  מורה: {currentStudent.teacherName}
                </span>
              )}
            </div>

            {/* Left: Driver Helper & Logout (Pushed to far left) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: 'auto' }}>
              <button
                onClick={() => setShowDriverModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(238, 242, 255, 0.9)',
                  border: '1.5px solid rgba(199, 210, 254, 0.9)',
                  color: '#4338ca',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                title="מדריך התקנת דרייברים לצריבת בקרים ב-USB"
              >
                <span>🔌</span>
                <span>דרייברים ל-USB</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(254, 202, 202, 0.9)',
                  background: 'rgba(254, 242, 242, 0.9)',
                  color: '#b91c1c',
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
              >
                <span>🚪</span>
                <span>יציאה מכיתה</span>
              </button>
            </div>
          </header>
        </div>

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Welcome Banner */}
          <div className="tracks-hero-card" style={{ textAlign: 'center', maxWidth: '820px', width: '100%', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '30px',
              background: 'rgba(238, 242, 255, 0.85)',
              border: '1px solid rgba(199, 210, 254, 0.9)',
              color: '#3730a3',
              fontSize: '0.88rem',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              <span>🎓</span>
              <span>מרחב הלמידה והפרויקטים של הכיתה</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.9rem)',
              fontWeight: '900',
              margin: '0 0 14px 0',
              color: '#0f172a',
              lineHeight: '1.25'
            }}>
              {visibleTracks.length === 1 
                ? `שלום ${currentStudent.studentName}, הפרויקט שלך מוכן להתחלה`
                : `שלום ${currentStudent.studentName}, בחר פרויקט להתחלה`}
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#475569',
              margin: 0,
              lineHeight: '1.7',
              fontWeight: '500',
              maxWidth: '680px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {visibleTracks.length === 1 
                ? `המורה שלך שייך לכיתה את הפרויקט הבא. לחץ על כניסה לפרויקט כדי לפתוח את שיעורי ה-CAD, סביבת הבלוקים והקוד:`
                : `המורה שלך שייך לכיתה ${visibleTracks.length} מסלולי למידה והרכבה מעשיים. לחץ על הפרויקט שברצונך ללמוד כדי לפתוח את שיעורי ה-CAD, הבלוקים והקוד:`}
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: visibleTracks.length === 1 ? '1fr' : `repeat(auto-fit, minmax(340px, 1fr))`,
            gap: '32px',
            width: '100%',
            maxWidth: visibleTracks.length === 1 ? '480px' : visibleTracks.length === 2 ? '900px' : '1150px'
          }}>
            {visibleTracks.map((mod, index) => (
              <div
                key={index}
                className="tracks-track-card"
              >
                {/* Prototype Image Container */}
                {mod.imgUrl && (
                  <div style={{
                    width: '100%',
                    height: '240px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    overflow: 'hidden',
                    position: 'relative',
                    boxSizing: 'border-box',
                    borderBottom: '1.5px solid rgba(226, 232, 240, 0.8)'
                  }}>
                    <img
                      src={mod.imgUrl}
                      alt={mod.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {mod.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          background: 'rgba(238, 242, 255, 0.9)',
                          color: '#4338ca',
                          border: '1px solid rgba(199, 210, 254, 0.9)'
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <h3 style={{
                    fontSize: '1.45rem',
                    fontWeight: '900',
                    color: '#0f172a',
                    margin: '0 0 10px 0'
                  }}>
                    {mod.title}
                  </h3>

                  <p style={{
                    fontSize: '0.96rem',
                    color: '#475569',
                    lineHeight: '1.65',
                    margin: '0 0 24px 0',
                    flex: 1,
                    fontWeight: '500'
                  }}>
                    {mod.description}
                  </p>

                  <Link
                    to={mod.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 24px',
                      borderRadius: '14px',
                      background: mod.gradient || 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '1rem',
                      boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <span>כניסה לפרויקט</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          padding: '24px 28px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#64748b',
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)'
        }}>
          SmartStart Web Platform © {new Date().getFullYear()} - מרחב למידה לכיתה
        </footer>

        {/* Driver Modal Component */}
        <DriverModal isOpen={showDriverModal} onClose={() => setShowDriverModal(false)} />
      </div>
    );
  }

  return (
    <div className="tracks-root-bg">
      {/* Dynamic Ambient Moving Canvas (No static image, flowing tech color orbs & cyber grid) */}
      <div className="tracks-ambient-canvas" aria-hidden="true">
        <div className="tracks-cyber-grid" />
        <div className="tracks-floating-orb tracks-orb-cyan" />
        <div className="tracks-floating-orb tracks-orb-purple" />
        <div className="tracks-floating-orb tracks-orb-magenta" />
        <div className="tracks-floating-orb tracks-orb-emerald" />
      </div>

      {/* High-Tech Sticky Glassmorphism Header */}
      <header className="tracks-glass-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'calc(100% - 32px)',
        boxSizing: 'border-box'
      }}>
        {/* Right: Platform Logo & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)'
            }}>
              <img 
                src="/logo_icon.png" 
                alt="SmartStart Logo" 
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                SmartStart <span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IoT</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.2px' }}>
                מרכז הפיקוד והלמידה
              </div>
            </div>
          </Link>
        </div>

        {/* Left: Quick Actions & Navigation (Pushed to far left) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginRight: 'auto' }}>
          {/* Teacher Space Link */}
          {canManageStudents && (
            <Link
              to="/teacher"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '14px',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: '800',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <span>🏫</span>
              <span>מרחב מורה וניהול כיתות</span>
            </Link>
          )}

          {/* Red Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(254, 242, 242, 0.9)',
              border: '1.5px solid rgba(254, 202, 202, 0.9)',
              color: '#dc2626',
              padding: '9px 18px',
              borderRadius: '14px',
              fontSize: '0.86rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.06)'
            }}
          >
            <span>🚪</span>
            <span>התנתק</span>
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main style={{ maxWidth: '1380px', margin: '28px auto 60px', width: '100%', padding: '0 24px', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
        {/* Welcome Command Banner & Resume Spotlight */}
        <div className="tracks-hero-card">
          {/* Ambient subtle glow orbs inside card */}
          <div style={{
            position: 'absolute',
            top: '-70px',
            left: '-70px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-70px',
            right: '-70px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '28px' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(238, 242, 255, 0.9)',
                border: '1.5px solid rgba(199, 210, 254, 0.9)',
                borderRadius: '20px',
                padding: '5px 14px',
                marginBottom: '14px',
                fontSize: '0.84rem',
                color: '#4338ca',
                fontWeight: '800'
              }}>
                <span>⚡</span>
                <span>מרכז פיתוח ולמידה</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
                fontWeight: '900',
                margin: '0 0 10px 0',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
                color: '#0f172a'
              }}>
                שלום, <span style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {currentUser ? (currentUser.fullName || currentUser.username) : currentStudent ? currentStudent.studentName : 'יוצר ומפתח'}
                </span>!
              </h1>
              <p style={{
                fontSize: '1.05rem',
                color: '#475569',
                margin: 0,
                lineHeight: 1.6,
                maxWidth: '640px',
                fontWeight: '500'
              }}>
                בחר מסלול למידה להמשך עבודה, תכנת בבלוקים או צרוב קוד ישירות לבקר ה-ESP32 שלך.
              </p>
            </div>

            {/* Spotlight: המשך מאיפה שעצרת (Resume Track) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid rgba(226, 232, 240, 0.95)',
              borderRadius: '24px',
              padding: '22px 24px',
              minWidth: '280px',
              maxWidth: '360px',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ המשך מאיפה שעצרת
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', background: 'rgba(241, 245, 249, 0.9)', padding: '3px 10px', borderRadius: '8px' }}>
                  מסלול פעיל
                </span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>
                רובוט מכונית 4WD Pro
              </div>
              <div style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.45, fontWeight: '500' }}>
                הרכבה מכאנית, כיול סרוו, חיישנים וצריבת קוד Web Serial ישירות מהדפדפן.
              </div>
              <Link
                to="/FreenoveCar"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  padding: '11px 20px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: '800',
                  boxShadow: '0 6px 18px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.2s',
                  marginTop: '4px'
                }}
              >
                <span>המשך למידה במסלול</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 1: GUIDED FLAGSHIP TRACKS */}
        <section style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '5px', height: '26px', borderRadius: '4px', background: 'linear-gradient(180deg, #ec4899 0%, #f59e0b 100%)' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0, color: '#0f172a', letterSpacing: '-0.3px' }}>
                מסלולי למידה מודרכים
              </h2>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '26px'
          }}>
            {visibleTracks.map((mod, index) => (
              <Link 
                key={index} 
                to={mod.to} 
                className="tracks-track-card"
              >
                {/* Edge to Edge Image Header */}
                {mod.imgUrl && (
                  <div style={{
                    width: '100%',
                    height: '210px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#f1f5f9'
                  }}>
                    <img 
                      src={mod.imgUrl} 
                      alt={mod.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent)'
                    }} />
                  </div>
                )}

                {/* Card Body */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {mod.badges?.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(238, 242, 255, 0.95)',
                          color: '#4338ca',
                          border: '1px solid rgba(199, 210, 254, 0.9)'
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-0.3px' }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1, fontWeight: '500' }}>
                    {mod.description}
                  </p>

                  {/* Gradient Action Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderRadius: '14px',
                    background: mod.gradient || 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
                  }}>
                    <span>כניסה למסלול</span>
                    <span style={{ fontSize: '1.1rem' }}>←</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 1.5: AI CUSTOM TRACKS (מוצג רק עבור מנוי פרימיום 300 ₪ / מנהל) */}
        {canCreateAI && (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '5px', height: '26px', borderRadius: '4px', background: 'linear-gradient(180deg, #059669 0%, #10B981 100%)' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0, color: '#0f172a', letterSpacing: '-0.3px' }}>
                  מסלולי למידה אישיים (AI)
                </h2>
              </div>

              <Link
                to="/custom-track-creator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>+ צור מסלול למידה חדש ב-AI</span>
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '26px'
            }}>
              {customTracks.map((trk, index) => (
                <Link
                  key={index}
                  to={`/track/custom/${trk.id || trk.trackId}`}
                  className="tracks-track-card"
                  style={{
                    border: '1.5px solid rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCustomTrack(e, trk.id || trk.trackId, trk.title)}
                    title="מחק מסלול זה"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 10,
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1.5px solid rgba(254, 202, 202, 0.9)',
                      borderRadius: '10px',
                      padding: '5px 12px',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <span>🗑️</span>
                    <span>מחק</span>
                  </button>

                  {trk.coverImage && (
                    <div style={{
                      width: '100%',
                      height: '210px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#f1f5f9'
                    }}>
                      <img 
                        src={trk.coverImage} 
                        alt={trk.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60px',
                        background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent)'
                      }} />
                    </div>
                  )}

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {trk.badges?.map((b, bIdx) => (
                        <span key={bIdx} style={{
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(236, 253, 245, 0.95)',
                          color: '#047857',
                          border: '1px solid rgba(167, 243, 208, 0.9)'
                        }}>{b}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-0.3px' }}>
                      {trk.title}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1, fontWeight: '500' }}>
                      {trk.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '0.92rem',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
                    }}>
                      <span>כניסה למסלול</span>
                      <span>←</span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Action Card to create new Track */}
              <Link
                to="/custom-track-creator"
                style={{
                  border: '2px dashed rgba(16, 185, 129, 0.45)',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '36px 24px',
                  minHeight: '280px',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(236, 253, 245, 0.95)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: '800',
                  marginBottom: '16px',
                  border: '1.5px solid rgba(167, 243, 208, 0.9)',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.15)'
                }}>
                  +
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>
                  צור מסלול חדש ב-AI
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, maxWidth: '280px', lineHeight: 1.5, fontWeight: '500' }}>
                  הגדר רכיבים, העלה תמונות או הדבק קישור לאתר מדריך וה-AI ייצור מסלול שלם
                </p>
              </Link>
            </div>
          </section>
        )}

        {/* SECTION 2: DEVELOPER TOOLS & SANDBOXES (מוצג רק עבור מנוי מורה 140 ₪ ומעלה) */}
        {canAccessDevTools && (
          <section style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
              <div style={{ width: '5px', height: '26px', borderRadius: '4px', background: 'linear-gradient(180deg, #3b82f6 0%, #10b981 100%)' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0, color: '#0f172a', letterSpacing: '-0.3px' }}>
                סביבות פיתוח וארגז כלים
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '26px'
            }}>
              {devTools.map((mod, index) => (
                <Link 
                  key={index} 
                  to={mod.to} 
                  className="tracks-track-card"
                  style={{
                    padding: '28px 24px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: mod.gradient || 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: mod.glow || '0 8px 20px rgba(79, 70, 229, 0.25)'
                    }}>
                      {mod.icon}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {mod.badges.slice(0, 2).map((b, bIdx) => (
                        <span 
                          key={bIdx}
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(241, 245, 249, 0.9)',
                            color: '#475569',
                            border: '1px solid rgba(226, 232, 240, 0.9)'
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1, fontWeight: '500' }}>
                    {mod.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: 'rgba(238, 242, 255, 0.8)',
                    border: '1.5px solid rgba(199, 210, 254, 0.9)',
                    color: '#2563eb',
                    fontWeight: '800',
                    fontSize: '0.88rem'
                  }}>
                    <span>כניסה לסביבה</span>
                    <span>←</span>
                  </div>
                </Link>
              ))}

              {/* USB Drivers Card as an interactive developer tool */}
              <div
                onClick={() => setShowDriverModal(true)}
                className="tracks-track-card"
                style={{
                  padding: '28px 24px',
                  cursor: 'pointer',
                  border: '1.5px solid rgba(153, 246, 228, 0.9)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '1.6rem',
                    boxShadow: '0 8px 20px rgba(6, 182, 212, 0.25)'
                  }}>
                    🔌
                  </div>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(240, 253, 250, 0.95)',
                    color: '#0f766e',
                    border: '1px solid rgba(153, 246, 228, 0.9)'
                  }}>
                    עוזר חומרה וצריבה
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>
                  עוזר דרייברים וצריבה USB
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px 0', flexGrow: 1, fontWeight: '500' }}>
                  מדריך מהיר להורדה והתקנה של דרייברי CH340 ו-CP2102 לזיהוי מהיר של כרטיסי Arduino ו-ESP32 במחשב.
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(240, 253, 250, 0.9)',
                  border: '1.5px solid rgba(153, 246, 228, 0.9)',
                  color: '#0f766e',
                  fontWeight: '800',
                  fontSize: '0.88rem'
                }}>
                  <span>פתח עוזר דרייברים</span>
                  <span>⚡</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1.5px solid rgba(226, 232, 240, 0.85)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.88rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.9)'
          }}>
            <img src="/logo_icon.png" alt="Logo" style={{ height: '26px', width: 'auto' }} />
          </div>
          <span style={{ fontWeight: '600' }}>SmartStart IoT Platform © {new Date().getFullYear()} - פלטפורמת למידה ורובוטיקה חכמה</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/landing" style={{ color: '#475569', textDecoration: 'none', fontWeight: '700' }}>דף נחיתה</Link>
          <Link to="/teacher" style={{ color: '#475569', textDecoration: 'none', fontWeight: '700' }}>מרחב מורים</Link>
          <span style={{ color: '#059669', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            שרתי למידה פעילים
          </span>
        </div>
      </footer>

      {/* Driver Modal Component */}
      <DriverModal isOpen={showDriverModal} onClose={() => setShowDriverModal(false)} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Root is the High-Converting Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* 🚀 Interactive Learning Tracks & Student Command Center */}
        <Route path="/tracks" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/custom-track-creator" element={<CustomTrackCreator />} />
        <Route path="/track/custom/:id" element={<CustomTrackStudio />} />
        <Route path="/custom-track/:id" element={<CustomTrackStudio />} />

        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/smarthouse" element={<Smarthouse />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/RobotSmall" element={<RobotSmall />} />
        <Route path="/SrobotBuilder" element={<SrobotBuilder />} />
        <Route path="/CodeToBlock" element={<CodeToBlock />} />
        <Route path="/WebBlocks" element={<WebBlocks />} />
        <Route path="/genrativeAI" element={<GenAIWebTrack />} />
        <Route path="/genai" element={<GenAIWebTrack />} />
        <Route path="/generativeAI" element={<GenAIWebTrack />} />
        <Route path="/generative-ai" element={<GenAIWebTrack />} />
        <Route path="/canva" element={<GenAIWebTrack />} />
        <Route path="/CodeEditor" element={<CodeEditorPage />} />
        <Route path="/htmleditor" element={<HTMLEditorStudio />} />
        <Route path="/html-editor" element={<HTMLEditorStudio />} />
        <Route path="/FreenoveCar" element={<FreenoveCar />} />
      </Routes>
    </Router>
  );
}

export default App;