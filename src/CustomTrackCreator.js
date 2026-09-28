import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getActiveServerUrl } from './serverPort';
import {
  DOMAIN_OPTIONS,
  SCIENCE_FIELDS,
  SCIENCE_MATERIALS,
  BUSINESS_VERTICALS,
  BUSINESS_DELIVERABLES,
  DESIGN_DISCIPLINES,
  DESIGN_DELIVERABLES,
  POLYMATH_STYLES,
  buildClientCurriculum,
  saveTrackLocally
} from './clientDomainCurriculum';

// Hardware components list
const HARDWARE_COMPONENTS = [
  'מודול ג\'ויסטיק כפול (JoyStick)',
  'מנוע סרוו (SG90 / MG995)',
  'חיישן מרחק אולטרסוני (HC-SR04)',
  'מסך LCD 1602 I2C',
  'מסך OLED 0.96 I2C',
  'חיישן טמפרטורה ולחות (DHT11/DHT22)',
  'חיישן תנועה PIR',
  'חיישן זיהוי קו (Line Follower)',
  'מודול ממסר (Relay Module)',
  'חיישן RFID (RC522)',
  'זמזם פאסיבי/אקטיבי (Buzzer)',
  'חיישן גז ועשן (MQ-2)',
  'משאבת מים 5V',
  'חיישן לחות אדמה',
  'סוללת Li-ion 18650',
  'מנועי DC וגיר'
];

// Software languages and stacks
const SOFTWARE_STACKS = [
  { id: 'python', name: '🐍 Python (פייתון)', desc: 'ספריות, פונקציות, לוגיקה, עיבוד נתונים ואוטומציה' },
  { id: 'web', name: '🌐 Web (HTML5 / CSS3 / JavaScript)', desc: 'אתרי אינטרנט, מניפולציית DOM, משחקי Canvas ואינטראקטיביות' },
  { id: 'cpp_csharp', name: '⚙️ C++ / C# (מונחה עצמים)', desc: 'תכנות מונחה עצמים (OOP), אלגוריתמיקה ומבני נתונים' },
  { id: 'blockly', name: '🧩 בלוקים ולוגיקה (Blockly)', desc: 'תכנות ויזואלי, פיתוח חשיבה מחשובית ופתרון בעיות' },
  { id: 'ai_data', name: '🤖 AI & Data Science בסיסי', desc: 'מודלים, זיהוי תמונה בסיסי, ניתוח נתונים ובינה מלאכותית' }
];

// Software features by stack
const SOFTWARE_FEATURES_MAP = {
  python: [
    'משתנים, טיפוסי נתונים וקלט משתמש',
    'תנאים ולוגיקה (if / elif / else)',
    'לולאות (for / while) ומבני חזרות',
    'פונקציות ופרמטרים (def / return)',
    'רשימות, מילונים ומבני נתונים (Lists / Dicts)',
    'עבודה עם קבצים (Read / Write)',
    'ספריות חיצוניות (Requests, Math, Random)',
    'פיתוח ממשק משתמש בסיסי (Tkinter/Pygame)',
    'מבוא לתכנות מונחה עצמים (Classes / Objects)'
  ],
  web: [
    'עיצוב ממשק משתמש (HTML5 / CSS3)',
    'אינטראקטיביות ואירועים (JavaScript)',
    'מניפולציית DOM ואלמנטים דינמיים',
    'גרפיקה וציור ב-HTML Canvas',
    'שמירת נתונים מקומית (LocalStorage)',
    'תקשורת שרת ו-REST API (Fetch/Axios)',
    'לוגיקת משחק ובדיקת התנגשויות',
    'אפקטים קוליים וצלילים (Web Audio)',
    'טפסים ואימות קלט משתמש',
    'עיצוב רספונסיבי למובייל ולמחשב'
  ],
  cpp_csharp: [
    'יסודות השפה ומבנה תוכנית ראשית',
    'מצביעים וניהול זיכרון (Pointers/References)',
    'מחלקות ואובייקטים (Classes & Objects)',
    'הורשה ופולימורפיזם (Inheritance & Polymorphism)',
    'מבני נתונים (Arrays, Vectors, Lists)',
    'אלגוריתמי חיפוש ומיון (Sorting & Searching)',
    'טיפול בשגיאות וחריגות (Exceptions)'
  ],
  blockly: [
    'בלוקי תנועה ופקודות ישירות',
    'תנאים והחלטות בלוגיקה',
    'לולאות חזרתיות',
    'משתנים וערכים דינמיים',
    'פונקציות מותאמות אישית בבלוקים',
    'אירועים ולחיצות כפתור'
  ],
  ai_data: [
    'איסוף וניקוי נתונים ראשוני',
    'זיהוי תבניות בסיסי',
    'עבודה עם מודל שפה ו-API של בינה מלאכותית',
    'זיהוי תמונות ואובייקטים פשוט',
    'ניתוח רגשות וטקסט (Sentiment Analysis)'
  ]
};

export default function CustomTrackCreator() {
  const navigate = useNavigate();

  // Domain selection (null indicates Screen 0: Domain Picker)
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [projectType, setProjectType] = useState(null);

  // Science domain states
  const [selectedScienceField, setSelectedScienceField] = useState(SCIENCE_FIELDS[0]);
  const [selectedScienceMaterials, setSelectedScienceMaterials] = useState([SCIENCE_MATERIALS[0], SCIENCE_MATERIALS[1]]);

  // Business domain states
  const [selectedBusinessVertical, setSelectedBusinessVertical] = useState(BUSINESS_VERTICALS[0]);
  const [selectedBusinessDeliverables, setSelectedBusinessDeliverables] = useState([BUSINESS_DELIVERABLES[0], BUSINESS_DELIVERABLES[1]]);

  // Design domain states
  const [selectedDesignDiscipline, setSelectedDesignDiscipline] = useState(DESIGN_DISCIPLINES[0]);
  const [selectedDesignDeliverables, setSelectedDesignDeliverables] = useState([DESIGN_DELIVERABLES[0], DESIGN_DELIVERABLES[1]]);

  // Polymath domain states
  const [selectedPolymathStyle, setSelectedPolymathStyle] = useState(POLYMATH_STYLES[0]);

  // Active AI Agent index during generation (0: Orchestrator, 1: Domain Content, 2: Styling, 3: QA)
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);

  const currentDomainInfo = DOMAIN_OPTIONS.find(d => d.id === selectedDomain) || DOMAIN_OPTIONS[0];

  // Active Wizard Tab (1: Details, 2: Components/Tech, 3: Chapters & Guidance, 4: Media & URL, 5: Launch AI)
  const [activeStep, setActiveStep] = useState(1);

  // Common Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [difficulty, setDifficulty] = useState('חטיבת ביניים / תיכון');
  const [userPrompt, setUserPrompt] = useState('');

  // Hardware Specific
  const [targetBoard, setTargetBoard] = useState('esp32');
  const [selectedHwComponents, setSelectedHwComponents] = useState([
    'מודול ג\'ויסטיק כפול (JoyStick)',
    'מנוע סרוו (SG90 / MG995)'
  ]);

  // Software Specific
  const [softwareStack, setSoftwareStack] = useState('python');
  const [selectedSwFeatures, setSelectedSwFeatures] = useState([
    'משתנים, טיפוסי נתונים וקלט משתמש',
    'תנאים ולוגיקה (if / elif / else)',
    'פונקציות ופרמטרים (def / return)'
  ]);

  const [customInput, setCustomInput] = useState('');

  // Custom Chapters Configuration
  const [customChapters, setCustomChapters] = useState([
    { id: 'ch1', title: 'פרק 1: הרכבה מכאנית וזיווד מפורט (שלבי CAD)', type: 'assembly', prompt: 'משוך את כל תמונות ה-CAD ברצף שלב אחר שלב, צור הוראות הרכבה מפורטות ומגוונות ורשימת ברגים מדויקת.' },
    { id: 'ch2', title: 'פרק 2: תכנות מונחה עצמים, כיול מנועים וחיישנים', type: 'coding', prompt: 'צור לפחות 10 שיעורי תכנות מודולריים ומשימות קוד עם בלוקים נדרשים וקוד C++ מלא.' },
    { id: 'ch3', title: 'פרק 3: פרויקטים אוטונומיים ואפליקציות מתקדמות', type: 'autonomous', prompt: 'שלב שגרות הפעלה מלאות, שליטה חכמה ופרויקט גמר פועל.' }
  ]);

  // Update default chapter titles when project type or title changes
  useEffect(() => {
    if (projectType === 'software_only') {
      const lang = softwareStack.toUpperCase();
      setCustomChapters([
        { id: 'ch1', title: `פרק 1: יסודות השפה והגדרת סביבת עבודה ב-${lang}`, type: 'syntax', prompt: `הסבר תחביר בסיסי, פקודות ראשונות והרצת קוד ראשוני ב-${lang}.` },
        { id: 'ch2', title: `פרק 2: אתגרי תכנות, פונקציות ואלגוריתמיקה מעשית`, type: 'coding', prompt: `משימות תכנות אינטראקטיביות, מניפולציית נתונים וקוד פתרון מלא.` },
        { id: 'ch3', title: `פרק 3: פרויקט גמר ואפליקציה אינטראקטיבית`, type: 'autonomous', prompt: `בניית פרויקט מעשי שלם המשלב את כל הידע שנרכש.` }
      ]);
    }
  }, [projectType, softwareStack]);

  // Multiple Web URLs State with per-link instruction
  const [docUrls, setDocUrls] = useState([
    { url: '', instruction: '' }
  ]);
  const [scrapeInstructions, setScrapeInstructions] = useState('');

  // Uploaded Files (PDF, Word, Code, Images) State
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStepMessage, setGenStepMessage] = useState('');
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Chapter Handlers
  const handleAddChapter = () => {
    const nextIdx = customChapters.length + 1;
    setCustomChapters([
      ...customChapters,
      {
        id: `ch${nextIdx}`,
        title: `פרק ${nextIdx}: נושא מותאם אישית`,
        type: 'coding',
        prompt: ''
      }
    ]);
  };

  const handleUpdateChapter = (idx, field, value) => {
    const updated = [...customChapters];
    updated[idx][field] = value;
    setCustomChapters(updated);
  };

  const handleRemoveChapter = (idx) => {
    if (customChapters.length <= 1) return;
    setCustomChapters(customChapters.filter((_, i) => i !== idx));
  };

  // Multi-URL Handlers
  const handleAddUrl = () => {
    setDocUrls([...docUrls, { url: '', instruction: '' }]);
  };

  const handleUrlChange = (index, field, value) => {
    const updated = [...docUrls];
    updated[index] = { ...updated[index], [field]: value };
    setDocUrls(updated);
  };

  const handleRemoveUrl = (index) => {
    if (docUrls.length === 1) {
      setDocUrls([{ url: '', instruction: '' }]);
    } else {
      setDocUrls(docUrls.filter((_, i) => i !== index));
    }
  };

  // Toggle Hardware Component
  const toggleHwComponent = (comp) => {
    if (selectedHwComponents.includes(comp)) {
      setSelectedHwComponents(selectedHwComponents.filter(c => c !== comp));
    } else {
      setSelectedHwComponents([...selectedHwComponents, comp]);
    }
  };

  // Toggle Software Feature
  const toggleSwFeature = (feat) => {
    if (selectedSwFeatures.includes(feat)) {
      setSelectedSwFeatures(selectedSwFeatures.filter(f => f !== feat));
    } else {
      setSelectedSwFeatures([...selectedSwFeatures, feat]);
    }
  };

  const toggleScienceMaterial = (mat) => {
    setSelectedScienceMaterials(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);
  };

  const toggleBusinessDeliverable = (del) => {
    setSelectedBusinessDeliverables(prev => prev.includes(del) ? prev.filter(d => d !== del) : [...prev, del]);
  };

  const toggleDesignDeliverable = (des) => {
    setSelectedDesignDeliverables(prev => prev.includes(des) ? prev.filter(d => d !== des) : [...prev, des]);
  };

  // Add Custom Item
  const handleAddCustomItem = (e) => {
    if (e) e.preventDefault();
    const val = customInput.trim();
    if (!val) return;
    if (selectedDomain === 'robotics') {
      if (!selectedHwComponents.includes(val)) setSelectedHwComponents([...selectedHwComponents, val]);
    } else if (selectedDomain === 'software') {
      if (!selectedSwFeatures.includes(val)) setSelectedSwFeatures([...selectedSwFeatures, val]);
    } else if (selectedDomain === 'science') {
      if (!selectedScienceMaterials.includes(val)) setSelectedScienceMaterials([...selectedScienceMaterials, val]);
    } else if (selectedDomain === 'business') {
      if (!selectedBusinessDeliverables.includes(val)) setSelectedBusinessDeliverables([...selectedBusinessDeliverables, val]);
    } else if (selectedDomain === 'design') {
      if (!selectedDesignDeliverables.includes(val)) setSelectedDesignDeliverables([...selectedDesignDeliverables, val]);
    }
    setCustomInput('');
  };

  // File Upload Handler (PDF, Word, Code, Images)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const serverUrl = await getActiveServerUrl();
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const res = await axios.post(`${serverUrl}/api/ai/upload-media`, {
              fileName: file.name,
              fileType: file.type,
              base64Data: reader.result
            });
            if (res.data && res.data.success) {
              setUploadedFiles(prev => [...prev, {
                url: res.data.url,
                fileName: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                type: file.type || file.name.split('.').pop()
              }]);
            }
          } catch (err) {
            console.error('Error uploading file:', err);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Failed to get server url for upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Generate Track via AI Multi-Agent System
  const handleGenerateTrack = async () => {
    const cleanUrls = docUrls.filter(item => item.url && item.url.trim());
    if (!projectTitle.trim() && cleanUrls.length === 0 && !userPrompt.trim()) {
      setErrorMessage('נא להזין שם פרויקט, רעיון או קישור לאתר!');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);
    setGeneratedTrack(null);
    setActiveAgentIndex(0);

    const domainKey = selectedDomain || 'polymath';
    const domainObj = DOMAIN_OPTIONS.find(d => d.id === domainKey) || DOMAIN_OPTIONS[0];

    const agentSteps = [
      `👑 סוכן Orchestrator: מנתח את הדרישות ומסווג את מבנה הלמידה ב-${domainObj.title}...`,
      `🧠 סוכן תוכן מומחה: בונה את תוכנית הלימודים הפדגוגית, שיעורים ומשימות...`,
      `🎨 סוכן עיצוב ומיתוג: מתאים פלטת צבעים, גרדיאנטים זוהרים, אייקונים ותגיות...`,
      `🛡️ סוכן בקרת איכות (QA): בודק שלמות פדגוגית, מאמת משימות יישומיות ומלטש תוצרים...`
    ];

    let currentAgent = 0;
    setGenStepMessage(agentSteps[0]);
    const timer = setInterval(() => {
      currentAgent = (currentAgent + 1) % agentSteps.length;
      setActiveAgentIndex(currentAgent);
      setGenStepMessage(agentSteps[currentAgent]);
    }, 2000);

    const selectedComponentsList = domainKey === 'robotics' ? selectedHwComponents :
      domainKey === 'software' ? selectedSwFeatures :
      domainKey === 'science' ? selectedScienceMaterials :
      domainKey === 'business' ? selectedBusinessDeliverables :
      domainKey === 'design' ? selectedDesignDeliverables :
      [selectedPolymathStyle];

    try {
      const serverUrl = await getActiveServerUrl();
      const res = await axios.post(`${serverUrl}/api/ai/generate-track`, {
        title: projectTitle.trim(),
        domain: domainKey,
        projectType: domainKey === 'robotics' ? 'hardware_software' : 'software_only',
        targetBoard: domainKey === 'robotics' ? targetBoard : softwareStack,
        softwareStack: domainKey === 'software' ? softwareStack : undefined,
        components: selectedComponentsList,
        difficulty,
        chaptersCount: customChapters.length,
        customChapters,
        docUrls: cleanUrls,
        docUrl: cleanUrls[0]?.url || '',
        prompt: `[מסלול ${domainObj.title}] ${userPrompt.trim()}`,
        scrapeInstructions: scrapeInstructions.trim(),
        uploadedMedia: uploadedFiles,
        model: 'google/gemini-3.1-pro-preview'
      }, { timeout: 45000 });

      clearInterval(timer);

      if (res.data && res.data.success && res.data.track) {
        saveTrackLocally(res.data.track);
        setGeneratedTrack(res.data.track);
      } else {
        throw new Error(res.data?.error || 'תגובה לא תקינה מהשרת');
      }
    } catch (err) {
      clearInterval(timer);
      console.warn('[Creator] Server generation unavailable or timed out, generating via Client Multi-Agent engine...', err.message);
      
      // Resilient Client Multi-Agent Fallback
      const fallbackTrack = buildClientCurriculum(domainKey, {
        title: projectTitle.trim(),
        targetBoard,
        softwareStack,
        components: selectedComponentsList,
        customChapters,
        availableImages: uploadedFiles.map(f => f.url)
      });

      saveTrackLocally(fallbackTrack);
      setGeneratedTrack(fallbackTrack);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      direction: 'rtl',
      fontFamily: "'Rubik', system-ui, -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 36px',
        background: '#ffffff',
        borderBottom: '2px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (projectType !== null && !generatedTrack) {
                setProjectType(null);
              } else {
                navigate('/tracks');
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '14px',
              border: '2px solid #cbd5e1',
              background: '#f1f5f9',
              color: '#1e293b',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            <span>←</span>
            <span>{projectType !== null && !generatedTrack ? 'חזור לבחירת סוג פרויקט' : 'חזרה למסלולים'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🤖✨</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>
                מחולל מסלולי למידה חכם ב-AI (Gemini 3.1 Pro)
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', fontWeight: '600' }}>
                יצירת מסלולי הרכבה מכאנית, רובוטיקה ופיתוח תוכנה ב-Gemini 3.1 Pro Preview
              </p>
            </div>
          </div>
        </div>

        {selectedDomain && (
          <span style={{
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '900',
            background: currentDomainInfo.gradient,
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {currentDomainInfo.icon} {currentDomainInfo.title}
          </span>
        )}
      </header>

      {/* ========================================================================= */}
      {/* SCREEN 0: SELECT DOMAIN (6 SPECIALIZED AGENTS) */}
      {/* ========================================================================= */}
      {selectedDomain === null && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '20px',
              background: '#eff6ff',
              color: '#2563eb',
              fontWeight: '900',
              fontSize: '0.9rem',
              marginBottom: '14px',
              border: '1px solid #bfdbfe'
            }}>
              שלב ראשון • בחירת תחום הפרויקט והסוכן המומחה
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '950', color: '#0f172a', margin: '0 0 12px 0' }}>
              איזה סוג פרויקט תרצה ליצור היום?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600', maxWidth: '750px', margin: '0 auto' }}>
              בחר את התחום והסוכן החכם המומחה לאותו תחום יבנה עבורך את מערך השיעורים, שלבי העשייה, והעיצוב הוויזואלי.
            </p>
          </div>

          {/* 6 DOMAIN CARDS RESPONSIVE GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', width: '100%' }}>
            {DOMAIN_OPTIONS.map(dom => (
              <div
                key={dom.id}
                onClick={() => {
                  setSelectedDomain(dom.id);
                  setProjectType(dom.id === 'robotics' ? 'hardware_software' : 'software_only');
                  setCustomChapters(dom.defaultChapters);
                  setActiveStep(1);
                }}
                style={{
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '24px',
                  padding: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = dom.color;
                  e.currentTarget.style.boxShadow = `0 18px 38px ${dom.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.03)';
                }}
              >
                <div>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: dom.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', marginBottom: '18px' }}>
                    {dom.icon}
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: '950', color: '#0f172a', margin: '0 0 8px 0' }}>
                    {dom.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: dom.color, fontWeight: '800', marginBottom: '14px' }}>
                    {dom.badge}
                  </div>
                  <p style={{ fontSize: '0.93rem', color: '#64748b', lineHeight: '1.6', margin: '0 0 20px 0', fontWeight: '500' }}>
                    {dom.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '26px' }}>
                    {dom.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{ background: dom.bg, color: dom.color, padding: '4px 10px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '800' }}>
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: dom.gradient,
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: `0 6px 18px ${dom.color}40`
                  }}
                >
                  בחר במסלול {dom.title.split(',')[0]} ←
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 1..5: WIZARD STEPS */}
      {/* ========================================================================= */}
      {projectType !== null && (
        <div style={{ maxWidth: '960px', margin: '30px auto', padding: '0 20px', width: '100%', flex: 1 }}>
          
          {/* STEP INDICATOR TABS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', background: '#ffffff', padding: '10px', borderRadius: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflowX: 'auto', gap: '6px' }}>
            {[
              { num: 1, title: '1. פרטי הפרויקט' },
              { num: 2, title: selectedDomain === 'robotics' ? '2. רכיבים וחיישנים' :
                              selectedDomain === 'software' ? '2. שפה וספריות' :
                              selectedDomain === 'science' ? '2. ציוד מעבדה וחקר' :
                              selectedDomain === 'business' ? '2. תוצרים עסקיים' :
                              selectedDomain === 'design' ? '2. תוצרי עיצוב ומדיה' :
                              '2. מוקדי עשייה' },
              { num: 3, title: '3. מבנה הפרקים והנחיות' },
              { num: 4, title: '4. קישורים, קבצים ותיעוד' },
              { num: 5, title: '5. שיגור ב-AI' }
            ].map(tab => (
              <button
                key={tab.num}
                type="button"
                onClick={() => setActiveStep(tab.num)}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  borderRadius: '14px',
                  border: 'none',
                  background: activeStep === tab.num ? currentDomainInfo.color : 'transparent',
                  color: activeStep === tab.num ? '#ffffff' : '#64748b',
                  fontWeight: '900',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* TAB 1: DETAILS & BOARD/STACK/DISCIPLINE */}
          {activeStep === 1 && (
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.6rem' }}>{currentDomainInfo.icon}</span>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>
                  פרטים בסיסיים והגדרת תחום: {currentDomainInfo.title}
                </h2>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                  שם הפרויקט / המסלול: *
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder={
                    selectedDomain === 'robotics' ? 'לדוגמה: רובוט זרוע מפרקית 4DOF עם ג\'ויסטיק ו-ESP32' :
                    selectedDomain === 'software' ? 'לדוגמה: פיתוח צ\'אטבוט מבוסס AI בפייתון / אתר אינטראקטיבי' :
                    selectedDomain === 'science' ? 'לדוגמה: חקר מערכת השמש ומושבות על המאדים / פיזיקה של גלים ואור' :
                    selectedDomain === 'business' ? 'לדוגמה: הקמת מיזם סטארטאפ EdTech / חנות מסחר מקוון ומותג אופנה' :
                    selectedDomain === 'design' ? 'לדוגמה: עיצוב זהות מותג מלאה וממשק UI/UX לאפליקציית כושר' :
                    'לדוגמה: אמנות הדיבייט והרטוריקה הציבורית / קורס תזונה וכושר פונקציונלי'
                  }
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '2px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: '600',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* DOMAIN SPECIFIC SELECTION IN STEP 1 */}
              {selectedDomain === 'robotics' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                    בקר ראשי (Target Board):
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {[
                      { id: 'esp32', name: 'ESP32 (Wi-Fi + BLE)', desc: 'מומלץ לרובוטיקה ו-IoT' },
                      { id: 'uno', name: 'Arduino Uno R3', desc: 'קלאסי לפרויקטים בסיסיים' },
                      { id: 'nano', name: 'Arduino Nano', desc: 'קומפקטי וקל משקל' },
                      { id: 'pico', name: 'Raspberry Pi Pico', desc: 'עוצמתי ומהיר' }
                    ].map(b => (
                      <div
                        key={b.id}
                        onClick={() => setTargetBoard(b.id)}
                        style={{
                          padding: '14px',
                          borderRadius: '14px',
                          border: targetBoard === b.id ? '2.5px solid #2563eb' : '2px solid #e2e8f0',
                          background: targetBoard === b.id ? '#eff6ff' : '#f8fafc',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontWeight: '900', color: targetBoard === b.id ? '#1e40af' : '#0f172a' }}>{b.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain === 'software' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                    שפת תכנות / סביבת פיתוח:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {SOFTWARE_STACKS.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSoftwareStack(s.id);
                          setSelectedSwFeatures(SOFTWARE_FEATURES_MAP[s.id] || []);
                        }}
                        style={{
                          padding: '14px',
                          borderRadius: '14px',
                          border: softwareStack === s.id ? '2.5px solid #4f46e5' : '2px solid #e2e8f0',
                          background: softwareStack === s.id ? '#eef2ff' : '#f8fafc',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontWeight: '900', color: softwareStack === s.id ? '#3730a3' : '#0f172a' }}>{s.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain === 'science' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                    ענף מחקר מדעי ראשי:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SCIENCE_FIELDS.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSelectedScienceField(f)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: selectedScienceField === f ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                          background: selectedScienceField === f ? '#f0f9ff' : '#ffffff',
                          color: selectedScienceField === f ? '#0369a1' : '#334155',
                          fontWeight: '800',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        {selectedScienceField === f ? '✓ ' : ''}{f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain === 'business' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                    תחום פעילות עסקית / ורטיקל:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {BUSINESS_VERTICALS.map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSelectedBusinessVertical(v)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: selectedBusinessVertical === v ? '2px solid #d97706' : '1.5px solid #cbd5e1',
                          background: selectedBusinessVertical === v ? '#fffbeb' : '#ffffff',
                          color: selectedBusinessVertical === v ? '#b45309' : '#334155',
                          fontWeight: '800',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        {selectedBusinessVertical === v ? '✓ ' : ''}{v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain === 'design' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                    התמחות ויזואלית ראשית:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {DESIGN_DISCIPLINES.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDesignDiscipline(d)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: selectedDesignDiscipline === d ? '2px solid #db2777' : '1.5px solid #cbd5e1',
                          background: selectedDesignDiscipline === d ? '#fdf2f8' : '#ffffff',
                          color: selectedDesignDiscipline === d ? '#be185d' : '#334155',
                          fontWeight: '800',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        {selectedDesignDiscipline === d ? '✓ ' : ''}{d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain === 'polymath' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                    סגנון למידה מועדף:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {POLYMATH_STYLES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedPolymathStyle(s)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '12px',
                          border: selectedPolymathStyle === s ? '2px solid #7c3aed' : '1.5px solid #cbd5e1',
                          background: selectedPolymathStyle === s ? '#faf5ff' : '#ffffff',
                          color: selectedPolymathStyle === s ? '#6d28d9' : '#334155',
                          fontWeight: '800',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        {selectedPolymathStyle === s ? '✓ ' : ''}{s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty Grid */}
              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontWeight: '800', marginBottom: '8px', color: '#334155' }}>
                  קהל יעד ורמת קושי:
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #cbd5e1', fontSize: '0.95rem', fontWeight: '700' }}
                >
                  <option value="יסודי / היכרות ראשונה">יסודי / היכרות ראשונה</option>
                  <option value="חטיבת ביניים / תיכון">חטיבת ביניים / תיכון</option>
                  <option value="מתקדמים / רמה מקצועית ומעמיקה">מתקדמים / רמה מקצועית ומעמיקה</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '14px',
                    background: currentDomainInfo.gradient,
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: `0 6px 16px ${currentDomainInfo.color}35`
                  }}
                >
                  המשך לשלב הבא ←
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENTS / FEATURES / LAB SELECTION */}
          {activeStep === 2 && (
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.03)' }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>
                {selectedDomain === 'robotics' ? '🤖 בחר רכיבי חומרה וחיישנים' :
                 selectedDomain === 'software' ? `💻 בחר נושאי לימוד ופיצ'רים (${softwareStack.toUpperCase()})` :
                 selectedDomain === 'science' ? '🔬 בחר ציוד וחומרים למעבדת הניסויים' :
                 selectedDomain === 'business' ? '💼 בחר תוצרים עסקיים ומסמכי יזמות' :
                 selectedDomain === 'design' ? '🎨 בחר תוצרי עיצוב, מיתוג ו-UI/UX' :
                 '🌍 בחר מוקדי עשייה וסגנון למידה'}
              </h2>
              <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.92rem', fontWeight: '600' }}>
                הסוכן המומחה יתאים את השיעורים והמשימות המעשיות לכל רכיב ותוצר שתבחר כאן.
              </p>

              {/* Chips Grid based on domain */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                {selectedDomain === 'robotics' && (
                  HARDWARE_COMPONENTS.map(comp => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => toggleHwComponent(comp)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: selectedHwComponents.includes(comp) ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                        background: selectedHwComponents.includes(comp) ? '#eff6ff' : '#ffffff',
                        color: selectedHwComponents.includes(comp) ? '#1e40af' : '#334155',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{selectedHwComponents.includes(comp) ? '✓' : '+'}</span>
                      <span>{comp}</span>
                    </button>
                  ))
                )}

                {selectedDomain === 'software' && (
                  (SOFTWARE_FEATURES_MAP[softwareStack] || []).map(feat => (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleSwFeature(feat)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: selectedSwFeatures.includes(feat) ? '2px solid #4f46e5' : '1.5px solid #cbd5e1',
                        background: selectedSwFeatures.includes(feat) ? '#eef2ff' : '#ffffff',
                        color: selectedSwFeatures.includes(feat) ? '#3730a3' : '#334155',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{selectedSwFeatures.includes(feat) ? '✓' : '+'}</span>
                      <span>{feat}</span>
                    </button>
                  ))
                )}

                {selectedDomain === 'science' && (
                  SCIENCE_MATERIALS.map(mat => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => toggleScienceMaterial(mat)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: selectedScienceMaterials.includes(mat) ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                        background: selectedScienceMaterials.includes(mat) ? '#f0f9ff' : '#ffffff',
                        color: selectedScienceMaterials.includes(mat) ? '#0369a1' : '#334155',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{selectedScienceMaterials.includes(mat) ? '✓' : '+'}</span>
                      <span>{mat}</span>
                    </button>
                  ))
                )}

                {selectedDomain === 'business' && (
                  BUSINESS_DELIVERABLES.map(del => (
                    <button
                      key={del}
                      type="button"
                      onClick={() => toggleBusinessDeliverable(del)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: selectedBusinessDeliverables.includes(del) ? '2px solid #d97706' : '1.5px solid #cbd5e1',
                        background: selectedBusinessDeliverables.includes(del) ? '#fffbeb' : '#ffffff',
                        color: selectedBusinessDeliverables.includes(del) ? '#b45309' : '#334155',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{selectedBusinessDeliverables.includes(del) ? '✓' : '+'}</span>
                      <span>{del}</span>
                    </button>
                  ))
                )}

                {selectedDomain === 'design' && (
                  DESIGN_DELIVERABLES.map(des => (
                    <button
                      key={des}
                      type="button"
                      onClick={() => toggleDesignDeliverable(des)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: selectedDesignDeliverables.includes(des) ? '2px solid #db2777' : '1.5px solid #cbd5e1',
                        background: selectedDesignDeliverables.includes(des) ? '#fdf2f8' : '#ffffff',
                        color: selectedDesignDeliverables.includes(des) ? '#be185d' : '#334155',
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{selectedDesignDeliverables.includes(des) ? '✓' : '+'}</span>
                      <span>{des}</span>
                    </button>
                  ))
                )}

                {selectedDomain === 'polymath' && (
                  POLYMATH_STYLES.map(style => (
                    <div
                      key={style}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '14px',
                        border: '2px solid #7c3aed',
                        background: '#faf5ff',
                        color: '#6d28d9',
                        fontWeight: '800',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✓ {style}
                    </div>
                  ))
                )}
              </div>

              {/* Add Custom Component / Deliverable */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="הוסף רכיב / תוצר / ציוד אישי נוסף..."
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '14px',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomItem(e); }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  style={{
                    padding: '12px 22px',
                    borderRadius: '14px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  + הוסף
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  style={{ padding: '12px 24px', borderRadius: '14px', background: '#f1f5f9', color: '#1e293b', border: '1.5px solid #cbd5e1', fontWeight: '800', cursor: 'pointer' }}
                >
                  → שלב קודם
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '14px',
                    background: currentDomainInfo.gradient,
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: `0 6px 16px ${currentDomainInfo.color}35`
                  }}
                >
                  המשך להגדרת הפרקים ←
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM CHAPTERS & SPECIFIC GUIDANCE */}
          {activeStep === 3 && (
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>
                    📚 הגדרת פרקי המסלול והנחיות לכל פרק
                  </h2>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.92rem', fontWeight: '600' }}>
                    קבע מה יהיה הנושא והסוג של כל פרק (הרכבה, קוד, אוטונומי) והזן הנחיות חופשיות לסוכן ה-AI.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddChapter}
                  style={{
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontWeight: '900',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>+</span>
                  <span>הוסף פרק נוסף</span>
                </button>
              </div>

              {/* Chapters List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                {customChapters.map((ch, idx) => (
                  <div
                    key={ch.id || idx}
                    style={{
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '20px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '900', fontSize: '1rem', color: '#1e40af' }}>
                        פרק {idx + 1}
                      </span>
                      {customChapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChapter(idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            fontWeight: '800',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          ✕ מחק פרק
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '14px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.85rem', marginBottom: '6px', color: '#334155' }}>
                          כותרת הפרק:
                        </label>
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => handleUpdateChapter(idx, 'title', e.target.value)}
                          placeholder="שם הפרק..."
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', fontWeight: '700', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.85rem', marginBottom: '6px', color: '#334155' }}>
                          סוג התוכן בפרק:
                        </label>
                        <select
                          value={ch.type}
                          onChange={(e) => handleUpdateChapter(idx, 'type', e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem', fontWeight: '700' }}
                        >
                          <option value="assembly">🛠️ הרכבה מכאנית ו-CAD (ללא קוד)</option>
                          <option value="coding">💻 אתגרי תכנות, משימות וקוד C++/Python</option>
                          <option value="autonomous">🚀 פרויקטים אוטונומיים ואפליקציות</option>
                          <option value="iot">🌐 תקשורת ענן, Wi-Fi ו-IoT</option>
                          <option value="syntax">📖 יסודות השפה ותחביר בסיסי</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '800', fontSize: '0.85rem', marginBottom: '6px', color: '#334155' }}>
                        🎯 הנחיות חופשיות לסוכן ה-AI עבור פרק זה:
                      </label>
                      <input
                        type="text"
                        value={ch.prompt}
                        onChange={(e) => handleUpdateChapter(idx, 'prompt', e.target.value)}
                        placeholder="לדוגמה: צור לפחות 10 משימות תכנות עם קריאת נתוני ג'ויסטיק וכיול מנועי סרוו..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  style={{ padding: '12px 24px', borderRadius: '14px', background: '#f1f5f9', color: '#1e293b', border: '1.5px solid #cbd5e1', fontWeight: '800', cursor: 'pointer' }}
                >
                  → שלב קודם
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '14px',
                    background: projectType === 'hardware_software' ? '#2563eb' : '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  המשך לקישורים וקבצים ←
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MULTIPLE URLS WITH DEDICATED INSTRUCTIONS & FILE UPLOADS */}
          {activeStep === 4 && (
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.03)' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>
                🌐 קישורים לאתרים, קבצים ותיעוד הפרויקט
              </h2>
              <p style={{ margin: '0 0 22px 0', color: '#64748b', fontSize: '0.92rem', fontWeight: '600' }}>
                סוכן ה-AI (Gemini 3.1 Pro) יסרוק אוטומטית את כל הקישורים והקבצים שתזין ויחלץ מכל קישור בדיוק את מה שתגדיר עבורו בהנחיה החופשית.
              </p>

              {/* 1. MULTIPLE URLS SECTION WITH PER-LINK INSTRUCTION */}
              <div style={{ marginBottom: '28px', background: '#f8fafc', padding: '22px', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label style={{ fontWeight: '900', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔗</span>
                    <span>קישורי אינטרנט לתיעוד הפרויקט (מדריכים, Wiki, GitHub, Keyestudio):</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    + הוסף קישור נוסף
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {docUrls.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px 18px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: '900', color: '#1e40af', fontSize: '0.95rem' }}>
                          🔗 קישור {idx + 1}
                        </span>
                        {docUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveUrl(idx)}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '4px 10px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              fontSize: '0.82rem'
                            }}
                          >
                            ✕ הסר קישור
                          </button>
                        )}
                      </div>

                      {/* Top Free-text instruction input */}
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.86rem', marginBottom: '5px', color: '#334155' }}>
                          ✍️ מה תרצה שהמערכת תחלץ ותיקח מקישור זה? (הנחיה חופשית ל-AI):
                        </label>
                        <input
                          type="text"
                          value={item.instruction || ''}
                          onChange={(e) => handleUrlChange(idx, 'instruction', e.target.value)}
                          placeholder="לדוגמה: משוך מפה רק את תמונות ההרכבה ורשימת הברגים / קח מפה את קוד ה-C++ והגדרת הפינים..."
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* URL input */}
                      <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.86rem', marginBottom: '5px', color: '#334155' }}>
                          🌐 כתובת הקישור (URL):
                        </label>
                        <input
                          type="url"
                          value={item.url || ''}
                          onChange={(e) => handleUrlChange(idx, 'url', e.target.value)}
                          placeholder="https://docs.keyestudio.com/... או https://github.com/..."
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            direction: 'ltr',
                            textAlign: 'left',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. FILE UPLOADS SECTION (PDF, WORD, CODE, IMAGES) */}
              <div style={{ marginBottom: '28px', background: '#f8fafc', padding: '22px', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontWeight: '900', fontSize: '1.05rem', color: '#0f172a', marginBottom: '10px' }}>
                  📂 העלאת קבצים (PDF, Word, קוד C++/Python/Ino, תמונות שרטוט):
                </label>

                <div style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ino,.py,.cpp,.h,.cs,.js,.html,.css,.json,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    id="fileUploadInput"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="fileUploadInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '2.4rem' }}>📁</span>
                    <span style={{ fontWeight: '900', fontSize: '1rem', color: '#0f172a' }}>
                      לחץ כאן לבחירת קבצים מהמחשב (או גרור לכאן)
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      תומך במסמכי PDF, וורד, קבצי קוד (.ino, .py, .cpp) ותמונות CAD
                    </span>
                  </label>
                </div>

                {isUploading && (
                  <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#2563eb', fontWeight: '800' }}>
                    ⏳ מעלה ומעבד קבצים...
                  </div>
                )}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '8px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.86rem',
                          fontWeight: '700',
                          color: '#1e293b'
                        }}
                      >
                        <span>📄</span>
                        <span>{file.fileName}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({file.size})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '900', cursor: 'pointer', marginRight: '4px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. TARGETED EXTRACTION INSTRUCTIONS */}
              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontWeight: '900', marginBottom: '8px', color: '#0f172a' }}>
                  🎯 הנחיות גלובליות נוספות לסוכן (מה למשוך ואיך לבנות את המסלול):
                </label>
                <textarea
                  value={scrapeInstructions}
                  onChange={(e) => setScrapeInstructions(e.target.value)}
                  placeholder="לדוגמה: משוך את כל תמונות ה-CAD שלב אחר שלב לפרק 1, בפרק 2 צור אתגרי תכנות מנועים עם בלוקים, ובפרק 3 צור פרויקט אוטונומי..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  style={{ padding: '12px 24px', borderRadius: '14px', background: '#f1f5f9', color: '#1e293b', border: '1.5px solid #cbd5e1', fontWeight: '800', cursor: 'pointer' }}
                >
                  → שלב קודם
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '14px',
                    background: projectType === 'hardware_software' ? '#2563eb' : '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  המשך לשלב היצירה ←
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: FINAL GENERATION & MULTI-AGENT PIPELINE */}
          {activeStep === 5 && (
            <div style={{ background: '#ffffff', padding: '36px', borderRadius: '24px', border: '1.5px solid #e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2rem' }}>{currentDomainInfo.icon}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '950', color: '#0f172a' }}>
                    סיכום והפעלת רשת הסוכנים של ה-AI
                  </h2>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem', fontWeight: '600' }}>
                    הפעלת 4 סוכני AI מומחים (ניהול, תוכן, עיצוב ובקרת איכות) ב-Gemini 3.1 Pro
                  </p>
                </div>
              </div>

              {/* Summary Box */}
              <div style={{
                background: '#f8fafc',
                padding: '22px',
                borderRadius: '20px',
                border: '1.5px solid #e2e8f0',
                marginBottom: '26px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>תחום וסוכן מוביל:</span>
                  <span style={{ fontWeight: '900', color: currentDomainInfo.color, fontSize: '1rem' }}>
                    {currentDomainInfo.icon} {currentDomainInfo.title}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>שם הפרויקט:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>
                    {projectTitle || 'ייקבע אוטומטית לפי תוכן האתר וההנחיות'}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>פוקוס ורמת קושי:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>
                    {selectedDomain === 'robotics' ? `לוח: ${targetBoard} | ${difficulty}` :
                     selectedDomain === 'software' ? `שפה: ${softwareStack.toUpperCase()} | ${difficulty}` :
                     difficulty}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>רכיבים ותוצרים נבחרים:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>
                    {(selectedDomain === 'robotics' ? selectedHwComponents :
                      selectedDomain === 'software' ? selectedSwFeatures :
                      selectedDomain === 'science' ? selectedScienceMaterials :
                      selectedDomain === 'business' ? selectedBusinessDeliverables :
                      selectedDomain === 'design' ? selectedDesignDeliverables :
                      [selectedPolymathStyle]).join(', ') || 'ברירת מחדל של הסוכן'}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>פרקים מוגדרים:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>
                    {customChapters.length} פרקים ({customChapters.map(c => c.title).join(' • ')})
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>מקורות מידע וקבצים:</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>
                    {docUrls.filter(u => u.url && u.url.trim()).length} קישורים, {uploadedFiles.length} קבצים
                  </span>
                </div>
              </div>

              {/* Additional Custom Instructions Prompt */}
              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontWeight: '900', marginBottom: '8px', color: '#0f172a' }}>
                  דגשים סופיים למסלול (אופציונלי):
                </label>
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="לדוגמה: שים דגש על שילוב דוגמאות מהעולם האמיתי, טיפים מעשיים ואתגרי בונוס..."
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '14px', fontWeight: '800', marginBottom: '20px', border: '1.5px solid #fca5a5' }}>
                  ❌ {errorMessage}
                </div>
              )}

              {/* Launch Button */}
              {!isGenerating && !generatedTrack && (
                <button
                  type="button"
                  onClick={handleGenerateTrack}
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '18px',
                    background: currentDomainInfo.gradient,
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '950',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    boxShadow: `0 8px 25px ${currentDomainInfo.color}40`,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>🚀</span>
                  <span>הפעל את רשת הסוכנים וצור מסלול {currentDomainInfo.title.split(',')[0]} (Gemini 3.1 Pro)</span>
                  <span>←</span>
                </button>
              )}

              {/* Multi-Agent Live Visualizer UI during generation */}
              {isGenerating && (
                <div style={{
                  background: '#f8fafc',
                  border: '2px solid #cbd5e1',
                  borderRadius: '24px',
                  padding: '28px',
                  textAlign: 'center'
                }}>
                  {/* Top Live Progress Bar */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#eff6ff', padding: '8px 20px', borderRadius: '20px', border: '1px solid #bfdbfe', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.4rem', animation: 'spin 2s linear infinite' }}>⚙️</span>
                    <span style={{ fontWeight: '900', color: '#1e40af', fontSize: '0.95rem' }}>
                      רשת 4 הסוכנים פועלת בסנכרון מלא ב-Gemini 3.1 Pro Preview
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '950', color: '#0f172a', margin: '0 0 10px 0' }}>
                    {genStepMessage}
                  </h3>

                  {/* 4 Agent Cards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    marginTop: '22px'
                  }}>
                    {[
                      { name: 'סוכן Orchestrator', role: 'סיווג וארכיטקטורה', icon: '👑', color: '#6366f1' },
                      { name: `סוכן תוכן ${currentDomainInfo.title.split(',')[0]}`, role: 'פדגוגיה ושיעורים', icon: currentDomainInfo.icon, color: currentDomainInfo.color },
                      { name: 'סוכן עיצוב ויזואלי', role: 'פלטה ותגיות זוהרות', icon: '🎨', color: '#ec4899' },
                      { name: 'סוכן בקרת איכות QA', role: 'אימות מבנה ושלמות', icon: '🛡️', color: '#10b981' }
                    ].map((agent, aIdx) => {
                      const isActive = activeAgentIndex === aIdx;
                      const isCompleted = activeAgentIndex > aIdx;
                      return (
                        <div
                          key={aIdx}
                          style={{
                            background: isActive ? '#ffffff' : isCompleted ? '#f0fdf4' : '#f8fafc',
                            border: isActive ? `2px solid ${agent.color}` : isCompleted ? '2px solid #86efac' : '1.5px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '16px',
                            textAlign: 'center',
                            boxShadow: isActive ? `0 8px 24px ${agent.color}30` : 'none',
                            transition: 'all 0.3s ease',
                            transform: isActive ? 'scale(1.03)' : 'scale(1)'
                          }}
                        >
                          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{agent.icon}</div>
                          <div style={{ fontWeight: '900', fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                            {agent.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', marginBottom: '10px' }}>
                            {agent.role}
                          </div>
                          <div>
                            {isActive ? (
                              <span style={{ background: `${agent.color}20`, color: agent.color, padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900' }}>
                                ⚡ מעבד כעת...
                              </span>
                            ) : isCompleted ? (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900' }}>
                                ✓ הושלם
                              </span>
                            ) : (
                              <span style={{ background: '#e2e8f0', color: '#64748b', padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                                ⏳ בתור
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Generated Success Preview */}
              {generatedTrack && (
                <div style={{
                  background: '#f0fdf4',
                  border: '2px solid #86efac',
                  borderRadius: '24px',
                  padding: '30px',
                  textAlign: 'center',
                  boxShadow: '0 8px 26px rgba(16,185,129,0.12)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉✨</div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: '950', color: '#14532d', margin: '0 0 10px 0' }}>
                    רשת הסוכנים השלימה בהצלחה את יצירת המסלול!
                  </h3>
                  <p style={{ fontSize: '1.05rem', color: '#166534', fontWeight: '800', marginBottom: '22px' }}>
                    {generatedTrack.title} ({generatedTrack.chapters?.length || 3} פרקים, {generatedTrack.chapters?.reduce((acc, c) => acc + (c.lessons?.length || 0), 0) || 0} שיעורים מותאמים)
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/track/custom/${generatedTrack.id || generatedTrack.trackId}`)}
                    style={{
                      padding: '16px 36px',
                      borderRadius: '16px',
                      background: currentDomainInfo.gradient,
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: '950',
                      fontSize: '1.15rem',
                      cursor: 'pointer',
                      boxShadow: `0 8px 24px ${currentDomainInfo.color}45`,
                      fontFamily: 'inherit'
                    }}
                  >
                    פתח את מסלול ה-{currentDomainInfo.title.split(',')[0]} החדש בסטודיו ↗
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
