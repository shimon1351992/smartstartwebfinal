import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MonacoEditor from 'react-monaco-editor';

const STARTER_TEMPLATES = {
  starter: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>האתר שלי</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Rubik', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      color: #0f172a;
      direction: rtl;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px 20px;
      text-align: center;
    }
    .hero {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 60px 20px;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.2);
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }
    p {
      font-size: 1.2rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 24px auto;
    }
    .btn {
      display: inline-block;
      background-color: #ffffff;
      color: #4f46e5;
      padding: 12px 28px;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 12px;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>🚀 ברוכים הבאים לאתר החדש שלי!</h1>
      <p>כאן תוכלו לכתוב קוד HTML ו-CSS טהור, להטמיע את העיצובים שיצרתם ב-Canva ולראות את התוצאה בזמן אמת!</p>
      <a href="#" class="btn">גלו עוד</a>
    </div>
  </div>
</body>
</html>`,
  landing: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>דף נחיתה מקצועי</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Rubik', sans-serif;
      background-color: #0f172a;
      color: #f8fafc;
      direction: rtl;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background: rgba(15, 23, 42, 0.8);
      border-bottom: 1px solid #1e293b;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 900;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      margin-left: 24px;
      font-weight: 600;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: #38bdf8; }
    .hero {
      text-align: center;
      padding: 80px 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid #38bdf8;
      color: #38bdf8;
      border-radius: 30px;
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 3rem;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 20px;
    }
    p {
      color: #94a3b8;
      font-size: 1.25rem;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .cta-btn {
      background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
      color: #ffffff;
      padding: 14px 36px;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 800;
      text-decoration: none;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(56, 189, 248, 0.3);
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">⚡ המותג שלי</div>
    <div class="nav-links">
      <a href="#">בית</a>
      <a href="#">מוצרים</a>
      <a href="#">אודות</a>
      <a href="#">צור קשר</a>
    </div>
  </nav>
  <div class="hero">
    <div class="badge">✨ פותח במיוחד בקורס GenAI</div>
    <h1>העתיד הדיגיטלי מתחיל כאן ועכשיו</h1>
    <p>ברוכים הבאים למוצר שבנינו מהרעיון ב-AI, דרך העיצוב ב-Canva ועד הקוד שרץ ישירות בדפדפן.</p>
    <button class="cta-btn">הצטרפו עכשיו</button>
  </div>
</body>
</html>`,
  cards: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>גלריית כרטיסיות</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Rubik', sans-serif;
      background-color: #f1f5f9;
      color: #1e293b;
      padding: 40px 20px;
      direction: rtl;
    }
    .header { text-align: center; margin-bottom: 40px; }
    h1 { font-size: 2.2rem; color: #0f172a; margin-bottom: 8px; }
    .cards-grid {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      width: 320px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 25px rgba(0,0,0,0.12);
    }
    .card-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      background: #e2e8f0;
    }
    .card-body { padding: 20px; }
    .card-tag {
      font-size: 0.75rem;
      font-weight: 800;
      color: #6366f1;
      background: #e0e7ff;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .card-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
    .card-text { font-size: 0.95rem; color: #64748b; line-height: 1.5; margin-bottom: 16px; }
    .card-btn {
      display: block;
      width: 100%;
      text-align: center;
      padding: 10px;
      background: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>המוצרים המובילים שלנו 🌟</h1>
    <p>כל הכרטיסיות עוצבו ב-Canva והוטמעו ב-HTML</p>
  </div>
  <div class="cards-grid">
    <div class="card">
      <img class="card-img" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Product">
      <div class="card-body">
        <span class="card-tag">מהדורה מוגבלת</span>
        <h3 class="card-title">סניקרס Cyber Red</h3>
        <p class="card-text">עיצוב עתידני עם כריות אוויר מתקדמות ונוחות מקסימלית לכל היום.</p>
        <a href="#" class="card-btn">לרכישה מהירה</a>
      </div>
    </div>
    <div class="card">
      <img class="card-img" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" alt="Product">
      <div class="card-body">
        <span class="card-tag">רב מכר</span>
        <h3 class="card-title">שעון חכם NeoPulse</h3>
        <p class="card-text">סנכרון מלא עם בינה מלאכותית, מדידת דופק ומסך AMOLED מדהים.</p>
        <a href="#" class="card-btn">לרכישה מהירה</a>
      </div>
    </div>
    <div class="card">
      <img class="card-img" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" alt="Product">
      <div class="card-body">
        <span class="card-tag">אודיו PRO</span>
        <h3 class="card-title">אוזניות Sonic Pro</h3>
        <p class="card-text">סינון רעשים אקטיבי היברידי וסוללה שמספיקה ל-40 שעות נגינה רצופות.</p>
        <a href="#" class="card-btn">לרכישה מהירה</a>
      </div>
    </div>
  </div>
</body>
</html>`
};

export default function HTMLEditorStudio() {
  const location = useLocation();
  const [code, setCode] = useState(() => {
    if (location.state && location.state.initialCode) {
      return location.state.initialCode;
    }
    const saved = localStorage.getItem('smartstart_html_code');
    return saved || STARTER_TEMPLATES.starter;
  });

  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [selectedTemplate, setSelectedTemplate] = useState('starter');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('smartstart_html_code', code);
  }, [code]);

  const handleTemplateChange = (tplKey) => {
    if (STARTER_TEMPLATES[tplKey]) {
      if (window.confirm('האם להחליף את הקוד בתבנית שנבחרה? (מומלץ לשמור קוד קודם)')) {
        setSelectedTemplate(tplKey);
        setCode(STARTER_TEMPLATES[tplKey]);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveStatus('הקובץ index.html הורד בהצלחה! 🎉');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const deviceWidthMap = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f172a',
      color: '#f8fafc',
      fontFamily: "'Rubik', sans-serif",
      direction: 'rtl',
      overflow: 'hidden'
    }}>
      {/* 🌟 סרגל עליון מקצועי */}
      <header style={{
        height: '60px',
        padding: '0 20px',
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50
      }}>
        {/* צד ימין: מיתוג וכותרת */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/genrativeAI"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#334155',
              color: '#f8fafc',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: '700',
              transition: 'background 0.2s'
            }}
          >
            ⬅️ חזרה לשיעורי הקורס
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>⌨️</span>
            <div>
              <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#38bdf8' }}>
                HTML & CSS Studio
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                עורך קוד חי לתלמידי GenAI Web Track
              </div>
            </div>
          </div>
        </div>

        {/* אמצע: בורר תבניות ומצב מובייל/מחשב */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* בחירת תבנית מהירה */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>תבנית:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '0.85rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="starter">📄 דף נקי ובסיסי</option>
              <option value="landing">🚀 דף נחיתה מודרני</option>
              <option value="cards">🛍️ גריד כרטיסיות ומוצרים</option>
            </select>
          </div>

          {/* מצבי תצוגה מקדימה */}
          <div style={{
            display: 'flex',
            background: '#0f172a',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            <button
              onClick={() => setPreviewDevice('desktop')}
              style={{
                background: previewDevice === 'desktop' ? '#38bdf8' : 'transparent',
                color: previewDevice === 'desktop' ? '#0f172a' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.8rem'
              }}
              title="תצוגת מחשב"
            >
              🖥️ מחשב
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              style={{
                background: previewDevice === 'tablet' ? '#38bdf8' : 'transparent',
                color: previewDevice === 'tablet' ? '#0f172a' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.8rem'
              }}
              title="תצוגת טאבלט"
            >
              📱 טאבלט
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              style={{
                background: previewDevice === 'mobile' ? '#38bdf8' : 'transparent',
                color: previewDevice === 'mobile' ? '#0f172a' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.8rem'
              }}
              title="תצוגת סמארטפון"
            >
              📲 מובייל
            </button>
          </div>
        </div>

        {/* צד שמאל: כפתורי פעולה */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saveStatus && (
            <span style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 'bold' }}>
              {saveStatus}
            </span>
          )}

          <Link
            to="/WebBlocks"
            style={{
              background: '#047857',
              color: 'white',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="מעבר לבנייה בעזרת בלוקים חזותיים"
          >
            🧱 פתח ב-WebBlocks
          </Link>

          <button
            onClick={handleCopy}
            style={{
              background: '#334155',
              color: '#f8fafc',
              border: '1px solid #475569',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {copied ? '✅ הועתק!' : '📋 העתק קוד'}
          </button>

          <button
            onClick={handleDownload}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37,99,235,0.4)'
            }}
          >
            💾 הורד index.html
          </button>
        </div>
      </header>

      {/* 🖥️ גוף העורך: חלוקה מפוצלת של עורך קוד Monaco ו-Live Preview */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* עורך קוד Monaco (ימין) */}
        <div style={{
          width: '50%',
          height: '100%',
          borderLeft: '2px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          direction: 'ltr'
        }}>
          <div style={{
            background: '#1e293b',
            color: '#94a3b8',
            padding: '6px 16px',
            fontSize: '0.78rem',
            fontWeight: '700',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>📄 index.html & style</span>
            <span style={{ color: '#38bdf8' }}>HTML5 + CSS3</span>
          </div>

          <div style={{ flex: 1 }}>
            <MonacoEditor
              height="100%"
              language="html"
              theme="vs-dark"
              value={code}
              options={{
                selectOnLineNumbers: true,
                readOnly: false,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                minimap: { enabled: true },
                fontSize: 14,
                lineHeight: 22,
                fontFamily: 'Consolas, "Fira Code", monospace'
              }}
              onChange={(newVal) => setCode(newVal)}
            />
          </div>
        </div>

        {/* חלון תצוגה מקדימה חיה (שמאל) */}
        <div style={{
          width: '50%',
          height: '100%',
          background: '#090d16',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            background: '#1e293b',
            color: '#94a3b8',
            padding: '6px 16px',
            fontSize: '0.78rem',
            fontWeight: '700',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🌐 תצוגה מקדימה חיה (Live Preview)</span>
            <span>רוחב: {deviceWidthMap[previewDevice]}</span>
          </div>

          <div style={{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: previewDevice === 'desktop' ? '0' : '20px',
            background: '#0b1120',
            overflow: 'auto'
          }}>
            <div style={{
              width: deviceWidthMap[previewDevice],
              height: '100%',
              background: '#ffffff',
              borderRadius: previewDevice === 'desktop' ? '0px' : '16px',
              overflow: 'hidden',
              boxShadow: previewDevice === 'desktop' ? 'none' : '0 10px 40px rgba(0,0,0,0.6)',
              border: previewDevice === 'desktop' ? 'none' : '4px solid #334155',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <iframe
                ref={iframeRef}
                title="Live HTML Preview"
                srcDoc={code}
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
