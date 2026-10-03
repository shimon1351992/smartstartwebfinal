import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getActiveServerUrl } from './serverPort';
import ConfirmModal from './ConfirmModal';
import './TeacherDashboard.css';

// 🎯 Core STEM Tracks for Class Assignment
const CORE_TRACKS = [
  {
    key: 'car',
    title: 'רובוט מכונית 4WD Pro',
    subtitle: 'ערכת Freenove ESP32',
    icon: '🏎️',
    color: '#2563eb',
    accentBg: '#eff6ff',
    borderColor: '#3b82f6',
    tag: 'רובוטיקה ו-AI',
    steps: '25 שלבים',
    desc: 'הרכבה מכאנית, שידור וידאו חי ב-Wi-Fi, מעקב קו ועקיפת מכשולים'
  },
  {
    key: 'turtle',
    title: 'רובוט צב חכם Smart Turtle',
    subtitle: 'ערכת Keyestudio KS0558',
    icon: '🐢',
    color: '#ea580c',
    accentBg: '#fff7ed',
    borderColor: '#f97316',
    tag: 'רובוטיקה ניידת',
    steps: '16 שלבים',
    desc: 'מטריצת לדים מונפשת, חיישן אולטרסוניק ושלט רחוק'
  },
  {
    key: 'house',
    title: 'בית חכם IoT אוטונומי',
    subtitle: 'ערכת Keyestudio KS5009 ESP32',
    icon: '🏡',
    color: '#e11d48',
    accentBg: '#fff1f2',
    borderColor: '#f43f5e',
    tag: 'אינטרנט של הדברים',
    steps: '20 שלבים',
    desc: '13 חיישנים, בקרת אקלים, כרטיסי RFID והתראות בזמן אמת'
  },
  {
    key: 'genai',
    title: 'GenAI, עיצוב ו-Web',
    subtitle: 'סביבת WebBlocks Studio',
    icon: '🌐',
    color: '#0284c7',
    accentBg: '#f0f9ff',
    borderColor: '#06b6d4',
    tag: 'בינה מלאכותית וקוד',
    steps: '30 מפגשים',
    desc: 'עיצוב ב-Canva, פרומפטים ל-AI ופיתוח אתרים ואפליקציות'
  }
];

function TeacherDashboard() {
  const [currentTeacher, setCurrentTeacher] = useState(() => {
    try {
      const saved = sessionStorage.getItem('smartstart_teacher_user') || localStorage.getItem('smartstart_teacher_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  // Dashboard view tab: 'classes' | 'submissions'
  const [activeDashboardTab, setActiveDashboardTab] = useState('classes');

  // Submissions data
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Classes management state
  const [classesList, setClassesList] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTargetTrack, setNewClassTargetTrack] = useState('car');
  const [newClassCode, setNewClassCode] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [classModalLoading, setClassModalLoading] = useState(false);
  const [classModalMsg, setClassModalMsg] = useState({ type: '', text: '' });

  // Code modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  // System Confirm Modal state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    icon: '🗑️',
    type: 'danger',
    confirmText: 'אישור מחיקה',
    cancelText: 'ביטול',
    onConfirm: null
  });

  const [availableCustomTracks, setAvailableCustomTracks] = useState([]);

  // Check saved teacher session on mount
  useEffect(() => {
    let activeTeacher = null;
    try {
      const saved = sessionStorage.getItem('smartstart_teacher_user') || localStorage.getItem('smartstart_teacher_user');
      if (saved) {
        activeTeacher = JSON.parse(saved);
        setCurrentTeacher(activeTeacher);
      }
    } catch (e) {}
    fetchClasses(activeTeacher);
    fetchCustomTracks();
  }, []);

  const fetchCustomTracks = async () => {
    try {
      const res = await fetch('/api/custom-tracks');
      const data = await res.json();
      if (data.success && Array.isArray(data.tracks)) {
        setAvailableCustomTracks(data.tracks);
      }
    } catch (e) {}
  };

  // Fetch submissions whenever logged in teacher or filters change
  useEffect(() => {
    if (currentTeacher) {
      fetchSubmissions();
      fetchClasses(currentTeacher);
    }
  }, [currentTeacher, searchTerm, selectedProjectType, selectedClass, selectedStatus]);

  // Load classes from server (strictly filtered for this specific teacher)
  const fetchClasses = async (teacherObj) => {
    try {
      const activeTeacher = teacherObj || currentTeacher;
      const serverUrl = await getActiveServerUrl();
      const teacherName = activeTeacher ? (activeTeacher.fullName || activeTeacher.username || '') : '';
      const teacherUsername = activeTeacher ? (activeTeacher.username || '') : '';
      const isMasterAdmin = activeTeacher && (activeTeacher.username === 'shimon1351992' || activeTeacher.role === 'superadmin' || activeTeacher.role === 'admin');
      
      const queryParam = isMasterAdmin ? '' : `?teacherName=${encodeURIComponent(teacherName)}&teacherUsername=${encodeURIComponent(teacherUsername)}`;
      const res = await fetch(`${serverUrl}/api/classes${queryParam}`);
      const data = await res.json();
      if (data.success && data.classes) {
        const filtered = isMasterAdmin ? data.classes : data.classes.filter(c => {
          const cTeacher = String(c.createdTeacher || '').toLowerCase().trim();
          const cUser = String(c.createdTeacherUsername || '').toLowerCase().trim();
          const targetName = teacherName.toLowerCase().trim();
          const targetUser = teacherUsername.toLowerCase().trim();

          if (!targetName && !targetUser) return false;

          return (targetName && (cTeacher === targetName || cTeacher.includes(targetName))) || 
                 (targetUser && (cUser === targetUser || cTeacher === targetUser || cTeacher.includes(targetUser)));
        });
        setClassesList(filtered);
        return;
      }
    } catch (err) {
      console.warn('Backend classes fetch failed, using fallback:', err);
    }
    // Offline/serverless fallback from localStorage
    try {
      const localSaved = localStorage.getItem('smartstart_local_classes');
      if (localSaved) {
        setClassesList(JSON.parse(localSaved));
      }
    } catch (e) {}
  };

  // Create new class with direct targetTrack and classCode
  const handleCreateClass = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newClassName.trim()) {
      setClassModalMsg({ type: 'error', text: '❌ אנא הזן שם כיתה' });
      return;
    }

    setClassModalLoading(true);
    setClassModalMsg({ type: 'info', text: '⏳ פותח כיתה חדשה ומפיק קוד גישה...' });

    try {
      const serverUrl = await getActiveServerUrl();
      const teacherFullName = currentTeacher ? (currentTeacher.fullName || currentTeacher.username) : 'מורה';
      const teacherUsername = currentTeacher ? (currentTeacher.username || '') : '';

      const res = await fetch(`${serverUrl}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: newClassName.trim(),
          createdTeacher: teacherFullName,
          createdTeacherUsername: teacherUsername,
          classCode: newClassCode.trim().toUpperCase(),
          targetTrack: newClassTargetTrack,
          assignedTracks: [newClassTargetTrack]
        })
      });

      const data = await res.json();
      if (data.success || data.classCode || data.id || (data.classItem && data.classItem.classCode)) {
        const classObj = data.classItem || data;
        const generated = classObj.classCode || newClassCode.trim().toUpperCase() || '';
        setClassModalMsg({ 
          type: 'success', 
          text: `🎉 הכיתה "${newClassName.trim()}" נפתחה בהצלחה! קוד הגישה שהופק לתלמידים: ${generated}` 
        });
        setNewClassName('');
        setNewClassCode('');
        fetchClasses(currentTeacher);
      } else {
        setClassModalMsg({ type: 'error', text: `❌ ${data.error || 'שגיאה ביצירת כיתה'}` });
      }
    } catch (err) {
      // Local fallback for offline/serverless
      const generated = newClassCode.trim().toUpperCase() || `CLS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCls = { 
        id: Date.now(), 
        className: newClassName.trim(),
        classCode: generated,
        targetTrack: newClassTargetTrack,
        assignedTracks: [newClassTargetTrack],
        createdTeacher: currentTeacher ? currentTeacher.fullName : 'מורה'
      };
      setClassesList(prev => {
        const updated = [newCls, ...prev];
        try {
          localStorage.setItem('smartstart_local_classes', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      setClassModalMsg({ type: 'success', text: `🎉 הכיתה נפתחה! קוד גישה לתלמידים: ${generated}` });
      setNewClassName('');
      setNewClassCode('');
    } finally {
      setClassModalLoading(false);
    }
  };

  // Copy WhatsApp Invite
  const handleCopyClassWhatsApp = (cls) => {
    const code = cls.classCode || 'SMART-2026';
    const siteUrl = window.location.origin;
    const targetKey = cls.targetTrack || (cls.assignedTracks && cls.assignedTracks[0]) || 'car';

    let trackName = '🏎️ רובוט מכונית 4WD Pro';
    if (targetKey === 'turtle') trackName = '🐢 רובוט צב חכם Smart Turtle';
    if (targetKey === 'house') trackName = '🏡 בית חכם IoT אוטונומי';
    if (targetKey === 'genai') trackName = '🌐 GenAI, עיצוב ו-Web';

    const msg = `שלום לכל תלמידי כיתה *${cls.className}*! 🚀\n\nמצורף קישור ישיר לשיעורי הרובוטיקה והתכנות:\n👉 ${siteUrl}\n\n📌 *איך נכנסים:*\n1. בעמוד הראשי לוחצים על *"כניסה עם קוד כיתה"*\n2. מזינים את קוד הכיתה שלכם: *${code}*\n3. מזינים את שמכם המלא\n\n📚 *מסלול הלימוד הייעודי שלכם:* ${trackName}\nבהזנת הקוד תיכנסו ישירות לשיעור! בהצלחה לכולם! ✨`;
    navigator.clipboard.writeText(msg);
    setCopiedCodeId(`wa-${cls.id || cls.className}`);
    setTimeout(() => setCopiedCodeId(null), 3000);
  };

  // Copy code directly
  const handleCopySingleCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(`code-${id}`);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Delete class
  const handleDeleteClass = (id, className) => {
    setConfirmDialog({
      isOpen: true,
      title: 'מחיקת כיתה מהמערכת',
      message: `האם אתה בטוח שברצונך למחוק את "${className}" מהמערכת?`,
      icon: '🏫',
      type: 'danger',
      confirmText: 'מחק כיתה',
      cancelText: 'ביטול',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const serverUrl = await getActiveServerUrl();
          await fetch(`${serverUrl}/api/classes/${id}`, { method: 'DELETE' });
        } catch (err) {}

        setClassesList(prev => {
          const updated = prev.filter(c => c.id != id);
          try {
            localStorage.setItem('smartstart_local_classes', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        if (selectedClass === className) setSelectedClass('');
      }
    });
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('smartstart_teacher_user');
    localStorage.removeItem('smartstart_teacher_user');
    setCurrentTeacher(null);
  };

  // Fetch only this teacher's submissions
  const fetchSubmissions = async () => {
    if (!currentTeacher) return;
    setIsLoading(true);
    let serverList = [];
    let dbStatus = false;

    const teacherName = currentTeacher.fullName;

    let fetchSucceeded = false;

    try {
      const serverUrl = await getActiveServerUrl();
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (teacherName) params.append('teacherName', teacherName);
      if (selectedClass) params.append('className', selectedClass);
      if (selectedProjectType) params.append('projectType', selectedProjectType);
      if (selectedStatus) params.append('status', selectedStatus);

      const res = await fetch(`${serverUrl}/api/teacher/submissions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        serverList = data.submissions || [];
        dbStatus = !!data.isDbConnected;
        fetchSucceeded = true;
        // Clean old localStorage duplicates since server is active
        try { localStorage.removeItem('smartstart_browser_submissions'); } catch (e) {}
      }
    } catch (err) {
      console.warn('Backend submissions fetch failed, checking local browser storage:', err);
    }

    if (fetchSucceeded) {
      setSubmissions(serverList);
      setIsDbConnected(dbStatus);
      setIsLoading(false);
      return;
    }

    // Fallback only if server is completely offline
    try {
      const localList = JSON.parse(localStorage.getItem('smartstart_browser_submissions') || '[]');
      let filtered = localList.filter(item => !item.teacherName || item.teacherName === teacherName || item.teacherName === 'כללי');

      if (selectedClass) {
        filtered = filtered.filter(item => item.className === selectedClass);
      }

      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          (item.studentName && item.studentName.toLowerCase().includes(s)) ||
          (item.projectName && item.projectName.toLowerCase().includes(s)) ||
          (item.className && item.className.toLowerCase().includes(s)) ||
          (item.notes && item.notes.toLowerCase().includes(s))
        );
      }
      if (selectedProjectType) {
        filtered = filtered.filter(item => item.projectType === selectedProjectType);
      }
      if (selectedStatus) {
        filtered = filtered.filter(item => item.status === selectedStatus);
      }

      setSubmissions(filtered);
      setIsDbConnected(false);
    } catch (e) {
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Download .ino file
  const handleDownloadIno = (sub) => {
    const blob = new Blob([sub.code || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (sub.studentName || 'student').replace(/\s+/g, '_');
    const safeProject = (sub.projectName || 'robot').replace(/\s+/g, '_');
    link.download = `${safeName}_${safeProject}.ino`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download .xml (Blockly) file
  const handleDownloadXml = (sub) => {
    if (!sub.blockXml) return;
    const blob = new Blob([sub.blockXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (sub.studentName || 'student').replace(/\s+/g, '_');
    link.download = `${safeName}_blocks.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle status
  const handleToggleStatus = async (sub) => {
    const nextStatus = sub.status === 'reviewed' ? 'new' : 'reviewed';
    try {
      const serverUrl = await getActiveServerUrl();
      await fetch(`${serverUrl}/api/teacher/submissions/${sub.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (e) {}

    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: nextStatus } : s));
    try {
      const localList = JSON.parse(localStorage.getItem('smartstart_browser_submissions') || '[]');
      const updatedLocal = localList.map(s => s.id === sub.id ? { ...s, status: nextStatus } : s);
      localStorage.setItem('smartstart_browser_submissions', JSON.stringify(updatedLocal));
    } catch (e) {}
  };

  // Delete submission
  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'מחיקת הגשת תלמיד',
      message: 'האם אתה בטוח שברצונך למחוק הגשה זו? הפעולה תסיר את הקובץ וההגשה לצמיתות.',
      icon: '🗑️',
      type: 'danger',
      confirmText: 'מחק הגשה',
      cancelText: 'ביטול',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        try {
          const serverUrl = await getActiveServerUrl();
          await fetch(`${serverUrl}/api/teacher/submissions/${id}`, {
            method: 'DELETE'
          });
        } catch (e) {}

        setSubmissions(prev => prev.filter(s => s.id !== id));
        try {
          const localList = JSON.parse(localStorage.getItem('smartstart_browser_submissions') || '[]');
          const updatedLocal = localList.filter(s => s.id !== id);
          localStorage.setItem('smartstart_browser_submissions', JSON.stringify(updatedLocal));
        } catch (e) {}
      }
    });
  };

  // Copy code in modal
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  if (!currentTeacher) {
    return <Navigate to="/login?tab=login" replace />;
  }

  return (
    <div className="teacher-container">
      {/* Header (Light Theme) */}
      <header className="teacher-header">
        <div className="teacher-brand">
          <Link to="/" className="teacher-logo-badge">
            👨‍🏫
          </Link>
          <div className="teacher-title-wrap">
            <h1>
              {currentTeacher ? `האזור האישי של ${currentTeacher.fullName}` : 'מרחב מורה | כניסה והרשמה'}
            </h1>
            <span>
              {currentTeacher ? 'הגשות התלמידים שנשלחו אליך, בדיקת קוד והורדת קבצים' : 'התחבר או הירשם כדי לנהל את הגשות התלמידים שלך'}
            </span>
          </div>
        </div>

        <div className="teacher-header-actions">
          {currentTeacher && (
            <div className="db-status-badge" title={isDbConnected ? 'מחובר ל-SQL Server' : 'מערכת פעילה'}>
              <span className="db-status-dot"></span>
              {isDbConnected ? 'SQL Server מחובר' : 'מערכת הגשות פעילה'}
            </div>
          )}

          {currentTeacher && (
            <button 
              type="button" 
              onClick={() => { setActiveDashboardTab('classes'); setClassModalMsg({ type: '', text: '' }); }} 
              className="teacher-nav-link" 
              style={{
                cursor: 'pointer',
                background: activeDashboardTab === 'classes' ? '#eff6ff' : '#ffffff',
                color: activeDashboardTab === 'classes' ? '#1d4ed8' : '#334155',
                borderColor: activeDashboardTab === 'classes' ? '#bfdbfe' : '#cbd5e1',
                fontWeight: 'bold'
              }}
            >
              🏫 ניהול כיתות ({classesList.length})
            </button>
          )}

          <Link to="/" className="teacher-nav-link">
            🏠 דף הבית
          </Link>

          <Link to="/tracks" className="teacher-nav-link">
            🚀 מסלולים
          </Link>

          {currentTeacher && (
            <button
              type="button"
              onClick={handleLogout}
              className="teacher-nav-link"
              style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2', cursor: 'pointer' }}
              title="התנתק מהחשבון"
            >
              🚪 התנתק
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="teacher-content">
        <div>
          {/* Top Dashboard Tabs Navigation */}
          <div className="teacher-tabs-container">
              <button
                type="button"
                onClick={() => setActiveDashboardTab('classes')}
                className={`teacher-tab-btn ${activeDashboardTab === 'classes' ? 'active' : ''}`}
              >
                <span className="teacher-tab-icon">🏫</span>
                <span className="teacher-tab-label">ניהול כיתות ושיוך מסלולים</span>
                <span className="teacher-tab-count">{classesList.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDashboardTab('submissions')}
                className={`teacher-tab-btn ${activeDashboardTab === 'submissions' ? 'active' : ''}`}
              >
                <span className="teacher-tab-icon">📬</span>
                <span className="teacher-tab-label">בדיקת הגשות תלמידים וקוד</span>
                <span className="teacher-tab-count">{submissions.length}</span>
              </button>
            </div>

            {activeDashboardTab === 'classes' ? (
              /* Class Management Tab View */
              <div className="classes-management-view">
                {/* ➕ Create Class Card */}
                <div className="create-class-card">
                  <div className="create-class-header">
                    <div className="create-class-title-wrap">
                      <h3>➕ יצירת כיתה חדשה ושיוך מסלול ישיר</h3>
                      <p>הזן שם כיתה ובחר את מסלול הלימוד הייעודי. תלמיד שיזין את קוד הכיתה בדף ההתחברות ייכנס ישירות למסלול שנבחר!</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateClass}>
                    {/* Class Name */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                        🏷️ שם הכיתה / הקבוצה: <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="למשל: כיתה ט׳3 - רובוטיקה מתקדמת / נבחרת מצטיינים"
                        required
                        style={{
                          width: '100%',
                          padding: '13px 18px',
                          borderRadius: '14px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '1rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: '#f8fafc',
                          color: '#0f172a',
                          fontWeight: '600'
                        }}
                      />
                    </div>

                    {/* Track Selection Cards */}
                    <div style={{ marginBottom: '22px' }}>
                      <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
                        🎯 בחר את מסלול הלימוד הייעודי לכיתה (כניסה ישירה לתלמידים): <span style={{ color: '#ef4444' }}>*</span>
                      </label>

                      <div className="tracks-selection-grid">
                        {[
                          ...CORE_TRACKS,
                          ...availableCustomTracks.map(trk => ({
                            key: trk.id || trk.trackId,
                            title: trk.title,
                            subtitle: 'מסלול מותאם אישית',
                            icon: '✨',
                            color: '#8b5cf6',
                            accentBg: '#f5f3ff',
                            borderColor: '#8b5cf6',
                            tag: 'מסלול AI',
                            steps: `${trk.steps?.length || 10} שלבים`,
                            desc: trk.description || 'מסלול מותאם אישית שנוצר במערכת'
                          }))
                        ].map(track => {
                          const isSelected = newClassTargetTrack === track.key;
                          return (
                            <div
                              key={track.key}
                              onClick={() => setNewClassTargetTrack(track.key)}
                              className={`track-select-card ${isSelected ? 'selected' : ''}`}
                              style={{
                                borderColor: isSelected ? track.borderColor : '#e2e8f0',
                                background: isSelected ? track.accentBg : '#ffffff'
                              }}
                            >
                              <div className="track-card-top">
                                <span className="track-card-icon" style={{ background: track.accentBg }}>
                                  {track.icon}
                                </span>
                                {isSelected ? (
                                  <span className="track-card-check" style={{ background: track.color }}>
                                    ✓ מסלול נבחר
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', background: '#f1f5f9' }}>
                                    {track.tag}
                                  </span>
                                )}
                              </div>

                              <div className="track-card-title">{track.title}</div>
                              <div className="track-card-subtitle">{track.subtitle}</div>
                              <div className="track-card-desc">{track.desc}</div>

                              <div className="track-card-footer" style={{ color: track.color }}>
                                <span>⚡ {track.steps}</span>
                                <span>🚀 כניסה ישירה</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Code & Submit Button */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 240px' }}>
                        <input
                          type="text"
                          value={newClassCode}
                          onChange={(e) => setNewClassCode(e.target.value.toUpperCase())}
                          placeholder="קוד כיתה מותאם אישית (אופציונלי, למשל: ROBOT-2026)"
                          style={{
                            width: '100%',
                            padding: '13px 18px',
                            borderRadius: '14px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.94rem',
                            direction: 'ltr',
                            textAlign: 'center',
                            fontWeight: '700',
                            outline: 'none',
                            background: '#ffffff',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={classModalLoading}
                        style={{
                          padding: '13px 28px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '14px',
                          fontWeight: '800',
                          fontSize: '1rem',
                          cursor: classModalLoading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {classModalLoading ? '⏳ מייצר כיתה...' : '➕ צור כיתה והפק קוד גישה'}
                      </button>
                    </div>
                  </form>

                  {/* Status Message */}
                  {classModalMsg.text && (
                    <div style={{
                      marginTop: '18px',
                      padding: '14px 20px',
                      borderRadius: '14px',
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      background: classModalMsg.type === 'error' ? '#fef2f2' : classModalMsg.type === 'success' ? '#f0fdf4' : '#eff6ff',
                      color: classModalMsg.type === 'error' ? '#dc2626' : classModalMsg.type === 'success' ? '#15803d' : '#1d4ed8',
                      border: classModalMsg.type === 'error' ? '1.5px solid #fecaca' : classModalMsg.type === 'success' ? '1.5px solid #bbf7d0' : '1.5px solid #bfdbfe'
                    }}>
                      {classModalMsg.text}
                    </div>
                  )}
                </div>

                {/* 📋 Active Classes Grid */}
                <div className="classes-grid-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                        📋 רשימת הכיתות הפעילות שלך ({classesList.length})
                      </h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                        העתק את קוד הכיתה או שתף הודעת וואטסאפ מוכנה עם קישור כניסה ישיר למסלול שנבחר
                      </p>
                    </div>
                  </div>

                  {classesList.length === 0 ? (
                    <div style={{
                      padding: '60px 24px',
                      textAlign: 'center',
                      background: '#ffffff',
                      borderRadius: '22px',
                      border: '1.5px solid #e2e8f0',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🏫</div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#0f172a' }}>עדיין לא פתחת כיתות לימוד</h4>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
                        השתמש בטופס למעלה כדי לפתוח כיתה ראשונה, לשייך מסלול ולהפיק קוד גישה לתלמידים.
                      </p>
                    </div>
                  ) : (
                    <div className="classes-grid">
                      {classesList.map(c => {
                        const code = c.classCode || `CLS-${c.id || '2026'}`;
                        const isWaCopied = copiedCodeId === `wa-${c.id || c.className}`;
                        const isCodeCopied = copiedCodeId === `code-${c.id || c.className}`;
                        const targetKey = c.targetTrack || (c.assignedTracks && c.assignedTracks[0]) || 'car';
                        const trackInfo = [
                          ...CORE_TRACKS,
                          ...availableCustomTracks.map(trk => ({
                            key: trk.id || trk.trackId,
                            title: trk.title,
                            icon: '✨',
                            color: '#8b5cf6',
                            accentBg: '#f5f3ff',
                            borderColor: '#8b5cf6'
                          }))
                        ].find(t => t.key === targetKey) || CORE_TRACKS[0];

                        return (
                          <div key={c.id || c.className} className="class-card">
                            <div className="class-card-header">
                              <div className="class-card-name">
                                <span>🏫</span>
                                <span>{c.className}</span>
                              </div>
                              <span className="class-card-code-badge" title="קוד הכניסה לתלמידים">
                                🔑 {code}
                              </span>
                            </div>

                            <div className="class-card-track-badge" style={{ background: trackInfo.accentBg, borderColor: trackInfo.borderColor }}>
                              <span style={{ fontSize: '1.4rem' }}>{trackInfo.icon}</span>
                              <div>
                                <div className="class-card-track-title" style={{ color: trackInfo.color }}>
                                  {trackInfo.title}
                                </div>
                                <div className="class-card-track-sub">
                                  🚀 כניסה ישירה למסלול זה בהזנת הקוד
                                </div>
                              </div>
                            </div>

                            <div className="class-card-actions">
                              <button
                                type="button"
                                onClick={() => handleCopySingleCode(code, c.id || c.className)}
                                className={`btn-class-action btn-class-copy ${isCodeCopied ? 'copied' : ''}`}
                              >
                                {isCodeCopied ? '✓ הועתק!' : '📋 העתק קוד'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyClassWhatsApp(c)}
                                className={`btn-class-action btn-class-whatsapp ${isWaCopied ? 'copied' : ''}`}
                              >
                                {isWaCopied ? '✓ הודעה הועתקה!' : '💬 הודעת וואטסאפ'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteClass(c.id, c.className)}
                                className="btn-class-action btn-class-delete"
                                title="מחק כיתה זו"
                              >
                                🗑️ מחק
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Submissions Table Tab View */
              <div>
                {/* Controls Bar */}
                <div className="teacher-controls">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 חיפוש לפי שם תלמיד, כיתה, פרויקט..."
                className="teacher-search-input"
              />

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="teacher-select"
              >
                <option value="">🏫 כל הכיתות ({classesList.length})</option>
                {classesList.map(c => (
                  <option key={c.id || c.className} value={c.className}>{c.className}</option>
                ))}
              </select>

              <select
                value={selectedProjectType}
                onChange={(e) => setSelectedProjectType(e.target.value)}
                className="teacher-select"
              >
                <option value="">כל סוגי הפרויקטים</option>
                <option value="car">🏎️ רובוט מכונית 4WD</option>
                <option value="turtle">🤖 רובוט צב חכם</option>
                <option value="smarthouse">🏡 בית חכם IoT</option>
                <option value="builder">⚡ סטודיו פיתוח ארדואינו</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="teacher-select"
              >
                <option value="">כל הסטטוסים</option>
                <option value="new">🟢 הגשות חדשות בלבד</option>
                <option value="reviewed">🔵 נבדק</option>
              </select>

              <button onClick={fetchSubmissions} className="teacher-refresh-btn">
                🔄 רענן הגשות
              </button>
            </div>

            {/* Submissions List */}
            <div className="teacher-table-card">
              {isLoading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                  טוען את ההגשות שלך...
                </div>
              ) : submissions.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                  <h3 style={{ margin: 0, color: '#0f172a' }}>אין עדיין הגשות שנשלחו אליך</h3>
                  <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>כאשר תלמיד יבחר ב-<b>{currentTeacher.fullName}</b> בעת השליחה, ההגשה תופיע כאן מיד.</p>
                </div>
              ) : (
                <table className="submissions-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>שם התלמיד / תאריך</th>
                      <th>כיתה / קבוצה</th>
                      <th>שם הפרויקט</th>
                      <th>הערות התלמיד</th>
                      <th>סטטוס</th>
                      <th style={{ textAlign: 'left' }}>פעולות והורדה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, idx) => (
                      <tr key={sub.id || idx}>
                        <td style={{ color: '#94a3b8', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td>
                          <div className="student-cell">
                            <div className="student-avatar">
                              {(sub.studentName || 'ת')[0]}
                            </div>
                            <div>
                              <div className="student-info-name">{sub.studentName}</div>
                              <div className="student-info-date">📅 {formatDate(sub.createdAt)}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: '700', color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '8px', fontSize: '0.84rem' }}>
                            🏫 {sub.className || 'כללי'}
                          </span>
                        </td>
                        <td>
                          <span className="project-tag">
                            {sub.projectName || 'פרויקט רובוט'}
                          </span>
                        </td>
                        <td style={{ maxWidth: '240px', color: '#64748b', fontSize: '0.86rem' }}>
                          {sub.notes || '—'}
                        </td>
                        <td>
                          <span 
                            onClick={() => handleToggleStatus(sub)}
                            className={`badge-status ${sub.status === 'reviewed' ? 'badge-status-reviewed' : 'badge-status-new'}`}
                            title="לחץ כדי לשנות סטטוס"
                          >
                            {sub.status === 'reviewed' ? '✓ נבדק' : '● חדש'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleDownloadIno(sub)}
                              className="btn-action btn-action-download"
                              title="הורד קובץ .ino למחשב"
                            >
                              📥 הורד .ino
                            </button>

                            {sub.blockXml && (
                              <button
                                onClick={() => handleDownloadXml(sub)}
                                className="btn-action"
                                style={{ background: '#7c3aed', color: 'white' }}
                                title="הורד קובץ בלוקים XML"
                              >
                                🧩 בלוקים
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="btn-action btn-action-view"
                              title="צפה בקוד המלא"
                            >
                              👁️ צפה בקוד
                            </button>

                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="btn-action btn-action-delete"
                              title="מחק הגשה"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
            )}
          </div>
      </main>

      {/* Code Viewer Modal - Light */}
      {selectedSubmission && (
        <div className="modal-code-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-code-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-code-header">
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>
                  💻 קוד הפרויקט של {selectedSubmission.studentName}
                </h3>
                <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  כיתה: {selectedSubmission.className || '—'} | פרויקט: {selectedSubmission.projectName} | תאריך: {formatDate(selectedSubmission.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-code-body">
              <pre className="modal-code-pre">
                {selectedSubmission.code || '// אין תוכן קוד להצגה'}
              </pre>
            </div>

            <div className="modal-code-footer">
              <button
                onClick={() => handleCopyCode(selectedSubmission.code)}
                className="btn-action"
                style={{ background: copied ? '#ecfdf5' : '#ffffff', color: copied ? '#059669' : '#334155', border: '1px solid #cbd5e1', padding: '10px 18px' }}
              >
                {copied ? '✅ הועתק ללוח!' : '📋 העתק קוד C++'}
              </button>

              <button
                onClick={() => handleDownloadIno(selectedSubmission)}
                className="btn-action btn-action-download"
                style={{ padding: '10px 18px' }}
              >
                📥 הורד קובץ .ino למחשב
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="btn-action"
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 18px' }}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 🔔 CUSTOM SYSTEM CONFIRM/ALERT MODAL */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        icon={confirmDialog.icon}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default TeacherDashboard;
