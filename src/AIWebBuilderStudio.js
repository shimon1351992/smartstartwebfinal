import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getActiveServerUrl } from './serverPort';
import SavedProjectModal from './SavedProjectModal';
import SendCodeModal from './SendCodeModal';

const STORAGE_GAME_HTML_KEY = 'smartstart_ai_game_html_v3';
const STORAGE_UNDO_KEY = 'smartstart_ai_game_undo_v3';
const STORAGE_MEDIA_KEY = 'smartstart_ai_game_media_v3';
const STORAGE_GAME_IDEA_KEY = 'smartstart_ai_game_idea_v3';

function createBlankGameCanvas(gameName = 'המשחק שלי') {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${gameName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Heebo', 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #ecfeff 100%);
      color: #0f172a;
      padding: 24px;
      text-align: center;
    }
    .stage-card {
      max-width: 500px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(16px);
      border: 2px solid rgba(99, 102, 241, 0.18);
      border-radius: 28px;
      padding: 38px 30px;
      box-shadow: 0 24px 60px rgba(99, 102, 241, 0.14);
    }
    .emoji { font-size: 3.4rem; margin-bottom: 12px; display: block; }
    .pill {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1, #ec4899);
      color: #fff;
      padding: 5px 14px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 800;
      margin-bottom: 14px;
    }
    h1 { font-size: 1.75rem; font-weight: 900; margin-bottom: 10px; color: #1e1b4b; }
    p { font-size: 0.96rem; color: #475569; line-height: 1.65; }
  </style>
</head>
<body>
  <div class="stage-card">
    <span class="emoji">🎮✨</span>
    <span class="pill">במת המשחק החיה שלך</span>
    <h1>מוכנים לבנות את "${gameName}"!</h1>
    <p>כתבו את הרעיון שלכם בצ׳אט מימין (או לחצו על הכפתור בדף הסדנה) — והמשחק שלכם יופיע כאן מוכן למשחק תוך שניות!</p>
  </div>
</body>
</html>`;
}

export default function AIWebBuilderStudio({
  embedded = false,
  gameName: propGameName = '',
  gameTopic: propGameTopic = '',
  pendingStudioRequest = null,
  onClearPendingRequest = null,
  onBackToWorkshop = null
}) {
  const [savedIdea] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_GAME_IDEA_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const gameName = (propGameName || savedIdea?.gameName || 'המשחק שלי').trim();
  const gameTopic = (propGameTopic || savedIdea?.gameplay || 'משחק מקורי').trim();

  const [gameCode, setGameCode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GAME_HTML_KEY);
      if (saved && saved.trim()) return saved;
    } catch {}
    return createBlankGameCanvas(gameName);
  });

  const [undoStack, setUndoStack] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UNDO_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [mediaAssets, setMediaAssets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MEDIA_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [chatMode, setChatMode] = useState('build'); // 'build' | 'image'
  const [promptInput, setPromptInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      mode: 'build',
      text: `היי! 👋 אני סוכן ה-AI שלך לבניית משחקים!\nספר/י לי איזה משחק בא לך להמציא — משחק ניצחון, הישרדות בזמן או שבירת שיא נקודות — ואני אבנה ואשדרג אותו איתך בלייב! 🎮✨`
    }
  ]);

  // Clean UI toggles
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [isFullscreenPlay, setIsFullscreenPlay] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCodePeek, setShowCodePeek] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [publishData, setPublishData] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAME_HTML_KEY, gameCode);
    } catch {}
  }, [gameCode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UNDO_KEY, JSON.stringify(undoStack.slice(0, 10)));
    } catch {}
  }, [undoStack]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(mediaAssets.slice(0, 12)));
    } catch {}
  }, [mediaAssets]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages, isRunning]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Send prompt to AI (build game or create AI image)
  const handleSendPrompt = async (overrideText = null, overrideMode = null) => {
    const text = (overrideText !== null ? overrideText : promptInput).trim();
    const effectiveMode = overrideMode || chatMode;
    const currentAtts = overrideText !== null ? [] : [...attachments];

    if ((!text && currentAtts.length === 0) || isRunning) return;

    if (overrideText === null) {
      setPromptInput('');
      setAttachments([]);
    }

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user',
      mode: effectiveMode,
      text: text || 'צירפתי תמונה — שלב אותה במשחק!',
      attachments: currentAtts.map((a) => ({
        type: a.type,
        name: a.name,
        previewUrl: a.publicUrl || a.dataUrl
      }))
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsRunning(true);

    try {
      const serverUrl = await getActiveServerUrl();

      if (effectiveMode === 'image') {
        const resp = await fetch(`${serverUrl}/api/web-track/ai-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            brandName: gameName,
            topic: gameTopic,
            presetId: 'hero'
          })
        });
        const data = await resp.json();
        if (resp.ok && data.success && data.url) {
          const asset = {
            id: `img_${Date.now()}`,
            url: data.url,
            prompt: text
          };
          setMediaAssets((prev) => [asset, ...prev.slice(0, 11)]);
          setChatMessages((prev) => [
            ...prev,
            {
              id: `a_${Date.now()}`,
              role: 'assistant',
              mode: 'image',
              text: 'הנה התמונה שיצרתי לך! 🎨 לחץ על הכפתור למטה כדי להכניס אותה ישר לתוך המשחק:',
              imageAsset: asset
            }
          ]);
        } else {
          throw new Error(data?.error || 'שרת התמונות עמוס כרגע — נסה שוב בעוד כמה שניות או העלה תמונה בכפתור 📎');
        }
      } else {
        const historyPayload = chatMessages
          .filter((m) => m.id !== 'welcome' && m.mode !== 'image')
          .slice(-6)
          .map((m) => ({ role: m.role, text: m.text }));

        const resp = await fetch(`${serverUrl}/api/ai-web-studio/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userMsg.text,
            currentCode: gameCode,
            activePage: 'index.html',
            allPageNames: ['index.html'],
            brandName: gameName,
            topic: gameTopic,
            sessionTitle: 'סדנת יצירת משחקים ב-AI (90 דק׳)',
            mode: 'build',
            history: historyPayload,
            attachments: currentAtts
          })
        });

        const data = await resp.json();
        if (!resp.ok || !data.success) {
          throw new Error(data?.error || 'תקלה זמנית בתקשורת עם ה-AI');
        }

        let applied = false;
        if (data.updatedCode && data.updatedCode.trim()) {
          setUndoStack((prev) => [gameCode, ...prev.slice(0, 9)]);
          setGameCode(data.updatedCode);
          applied = true;
          showToast('🎮 המשחק עודכן בלייב! נסה לשחק!');
        }

        setChatMessages((prev) => [
          ...prev,
          {
            id: `a_${Date.now()}`,
            role: 'assistant',
            mode: 'build',
            applied,
            text: data.explanation || 'המשחק שלך מוכן ומעודכן בלייב! ✨'
          }
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          mode: effectiveMode,
          text: `⚠️ ${err.message || 'תקלה זמנית — נסה לשלוח שוב!'}`
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // Receive prompt / fullscreen trigger from Workshop tab
  useEffect(() => {
    if (!pendingStudioRequest) return;

    if (pendingStudioRequest.type === 'fullscreen') {
      setIsFullscreenPlay(true);
    } else if (pendingStudioRequest.prompt) {
      setIsFullscreenPlay(false);
      const targetMode = pendingStudioRequest.mode || 'build';
      setChatMode(targetMode);
      if (pendingStudioRequest.autoSend) {
        handleSendPrompt(pendingStudioRequest.prompt, targetMode);
      } else {
        setPromptInput(pendingStudioRequest.prompt);
        showToast('✨ הפרומפט מוכן בצ׳אט — אפשר לערוך ולשלוח!');
      }
    }

    if (typeof onClearPendingRequest === 'function') {
      onClearPendingRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingStudioRequest]);

  // Attach image
  const handleAddAttachments = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const serverUrl = await getActiveServerUrl();
    for (const file of Array.from(filesList).slice(0, 3)) {
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
      if (!isImage) continue;
      const dataUrl = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (ev) => resolve(String(ev.target?.result || ''));
        r.readAsDataURL(file);
      });
      if (!dataUrl) continue;
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      let publicUrl = dataUrl;
      try {
        const upRes = await fetch(`${serverUrl}/api/web-track/upload-ai-asset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name || 'sprite.png', dataUrl })
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          if (upData.success && upData.url) publicUrl = upData.url;
        }
      } catch {}
      setAttachments((prev) => [
        ...prev,
        {
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          type: 'image',
          name: file.name || 'image.png',
          mimeType: match ? match[1] : 'image/png',
          base64Data: match ? match[2] : '',
          dataUrl,
          publicUrl
        }
      ]);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevCode = undoStack[0];
    setUndoStack((s) => s.slice(1));
    setGameCode(prevCode);
    setShowMoreMenu(false);
    showToast('↩️ שוחזרה הגרסה הקודמת של המשחק!');
  };

  const handleDownload = () => {
    const blob = new Blob([gameCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameName.replace(/\s+/g, '_') || 'my_game'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMoreMenu(false);
    showToast('📥 קובץ המשחק הורד למחשב!');
  };

  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const serverUrl = await getActiveServerUrl();
      const studentName = localStorage.getItem('smartstart_saved_student_name') || 'player';
      const resp = await fetch(`${serverUrl}/api/ai-web-studio/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: gameName,
          studentName,
          pages: { 'index.html': gameCode }
        })
      });
      const data = await resp.json();
      if (resp.ok && data.success && data.liveUrl) {
        setPublishData(data);
      } else {
        throw new Error(data?.error || 'שגיאה בפרסום');
      }
    } catch (err) {
      showToast(`⚠️ ${err.message || 'לא ניתן לפרסם כרגע — ודא שהשרת פועל'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const quickChips = useMemo(
    () => [
      { label: '🎨 שדרג גרפיקה ואפקטים', prompt: 'שדרג את מראה המשחק: הוסף רקע חי, חלקיקי פיצוץ/נצנוץ, קונפטי בניצחון ואנימציות חלקות!' },
      { label: '🔊 הוסף צלילי ארקייד', prompt: 'הוסף אפקטים קוליים מגניבים ב-Web Audio API לכל פעולה במשחק + כפתור השתקה 🔊/🔇!' },
      { label: '🏆 טבלת Top 5 שיאים', prompt: 'הוסף טבלת Top 5 שיאים שנשמרת ב-localStorage עם שם שחקן כדי שנוכל להתחרות בטורניר!' }
    ],
    []
  );

  const previewWidth = previewDevice === 'mobile' ? '390px' : '100%';

  return (
    <div
      dir="rtl"
      onClick={() => setShowMoreMenu(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: embedded ? 'calc(100vh - 88px)' : '100vh',
        minHeight: embedded ? '620px' : '100vh',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Heebo', 'Segoe UI', Tahoma, sans-serif",
        borderRadius: embedded ? '24px' : '0',
        overflow: 'hidden',
        border: embedded ? '1px solid #e2e8f0' : 'none',
        boxShadow: embedded ? '0 20px 60px rgba(99, 102, 241, 0.12)' : 'none'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) handleAddAttachments(e.target.files);
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />

      {/* =====================================================================
          ULTRA-CLEAN TOP BAR (ONLY 4 SIMPLE CONTROLS!)
         ===================================================================== */}
      <div
        style={{
          padding: '10px 16px',
          background: 'linear-gradient(90deg, #ffffff 0%, #f5f3ff 55%, #ecfeff 100%)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        {/* Right: Title & Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {embedded && onBackToWorkshop ? (
            <button
              type="button"
              onClick={onBackToWorkshop}
              style={{
                background: '#ffffff',
                color: '#475569',
                border: '1px solid #e2e8f0',
                padding: '7px 12px',
                borderRadius: '11px',
                fontSize: '0.82rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              ← לשלבי הסדנה
            </button>
          ) : (
            <Link
              to="/web-ai-track"
              style={{
                background: '#ffffff',
                color: '#475569',
                border: '1px solid #e2e8f0',
                padding: '7px 12px',
                borderRadius: '11px',
                fontSize: '0.82rem',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              ← חזרה לסדנה
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '9px',
                fontSize: '0.75rem',
                fontWeight: '900'
              }}
            >
              🎮 AI Game Studio
            </span>
            <strong style={{ fontSize: '0.96rem', color: '#1e1b4b' }}>{gameName}</strong>
          </div>
        </div>

        {/* Left: 4 Clean Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {toastMsg && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: '800',
                color: '#047857',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '5px 11px',
                borderRadius: '999px'
              }}
            >
              {toastMsg}
            </span>
          )}

          {/* Control 1: Desktop / Phone */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            {[
              { id: 'desktop', label: '🖥️' },
              { id: 'mobile', label: '📱' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setPreviewDevice(d.id)}
                title={d.id === 'desktop' ? 'תצוגת מחשב' : 'תצוגת טלפון'}
                style={{
                  background: previewDevice === d.id ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '4px 9px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: previewDevice === d.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Control 2: Fullscreen Play for Tournament! */}
          <button
            type="button"
            onClick={() => setIsFullscreenPlay((v) => !v)}
            style={{
              background: isFullscreenPlay ? '#f59e0b' : '#eef2ff',
              color: isFullscreenPlay ? '#ffffff' : '#4f46e5',
              border: isFullscreenPlay ? 'none' : '1px solid #c7d2fe',
              padding: '7px 13px',
              borderRadius: '11px',
              fontSize: '0.82rem',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            {isFullscreenPlay ? '💬 חזרה לצ׳אט ה-AI' : '⛶ מסך מלא לטורניר'}
          </button>

          {/* Control 3: Publish Live + QR */}
          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublishLive}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '11px',
              fontSize: '0.82rem',
              fontWeight: '900',
              cursor: isPublishing ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.28)'
            }}
          >
            {isPublishing ? '⏳ מפרסם...' : '🌐 פרסם + QR'}
          </button>

          {/* Control 4: Clean "More" Menu */}
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowMoreMenu((v) => !v)}
              style={{
                background: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '7px 12px',
                borderRadius: '11px',
                fontSize: '0.84rem',
                fontWeight: '900',
                cursor: 'pointer'
              }}
            >
              ⋯ עוד
            </button>

            {showMoreMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '215px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '6px',
                  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.16)',
                  zIndex: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <button
                  type="button"
                  disabled={undoStack.length === 0}
                  onClick={handleUndo}
                  style={{
                    textAlign: 'right',
                    background: 'transparent',
                    color: undoStack.length === 0 ? '#cbd5e1' : '#d97706',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 11px',
                    fontSize: '0.83rem',
                    fontWeight: '800',
                    cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ↩️ בטל שינוי אחרון ({undoStack.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowSaveModal(true);
                  }}
                  style={{ textAlign: 'right', background: 'transparent', color: '#0f172a', border: 'none', borderRadius: '10px', padding: '9px 11px', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  💾 שמור / טען בענן
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowSendModal(true);
                  }}
                  style={{ textAlign: 'right', background: 'transparent', color: '#0f172a', border: 'none', borderRadius: '10px', padding: '9px 11px', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  📤 הגש למורה
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  style={{ textAlign: 'right', background: 'transparent', color: '#0f172a', border: 'none', borderRadius: '10px', padding: '9px 11px', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  📥 הורד קובץ המשחק
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowCodePeek((v) => !v);
                  }}
                  style={{ textAlign: 'right', background: 'transparent', color: '#4f46e5', border: 'none', borderRadius: '10px', padding: '9px 11px', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  🔍 {showCodePeek ? 'הסתר קוד' : 'הצץ בקוד'}
                </button>
                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    if (window.confirm('להתחיל משחק חדש לגמרי מאפס?')) {
                      setUndoStack((prev) => [gameCode, ...prev.slice(0, 9)]);
                      setGameCode(createBlankGameCanvas(gameName));
                    }
                  }}
                  style={{ textAlign: 'right', background: 'transparent', color: '#e11d48', border: 'none', borderRadius: '10px', padding: '9px 11px', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  🔄 התחל משחק חדש
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN BODY: RIGHT = LIGHT AIRY AI CHAT | LEFT = HUGE PLAYABLE GAME STAGE
         ===================================================================== */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {/* RIGHT PANE: AI CHAT (Hidden in Fullscreen Tournament Play Mode!) */}
        {!isFullscreenPlay && (
          <div
            style={{
              width: '380px',
              minWidth: '320px',
              maxWidth: '42%',
              background: '#f8fafc',
              borderLeft: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer?.files?.length) handleAddAttachments(e.dataTransfer.files);
            }}
          >
            {/* 2 Clean Mode Pills */}
            <div style={{ padding: '10px 12px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setChatMode('build')}
                style={{
                  background: chatMode === 'build' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f1f5f9',
                  color: chatMode === 'build' ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
              >
                🎮 בנה ושדרג משחק
              </button>
              <button
                type="button"
                onClick={() => setChatMode('image')}
                style={{
                  background: chatMode === 'image' ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : '#f1f5f9',
                  color: chatMode === 'image' ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  cursor: 'pointer'
                }}
              >
                🖼️ צור תמונה ב-AI
              </button>
            </div>

            {/* 3 Fun Quick Upgrade Pills */}
            <div style={{ padding: '8px 12px', background: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isRunning}
                  onClick={() => {
                    setChatMode('build');
                    setPromptInput(chip.prompt);
                  }}
                  style={{
                    background: '#f5f3ff',
                    color: '#5b21b6',
                    border: '1px solid #ddd6fe',
                    borderRadius: '999px',
                    padding: '4px 11px',
                    fontSize: '0.73rem',
                    fontWeight: '800',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      background: isUser ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : '#ffffff',
                      color: isUser ? '#ffffff' : '#1e293b',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '11px 13px',
                      fontSize: '0.85rem',
                      lineHeight: '1.58',
                      boxShadow: isUser ? '0 4px 14px rgba(99, 102, 241, 0.2)' : '0 2px 8px rgba(15, 23, 42, 0.04)'
                    }}
                  >
                    <div style={{ fontSize: '0.71rem', fontWeight: '900', color: isUser ? '#e0e7ff' : '#6366f1', marginBottom: '4px' }}>
                      {isUser ? '👤 אני' : '🤖 סוכן המשחקים'}
                    </div>

                    {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {msg.attachments.map((att, i) => (
                          <img key={i} src={att.previewUrl} alt={att.name} style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '8px' }} />
                        ))}
                      </div>
                    )}

                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                    {msg.imageAsset && (
                      <div style={{ marginTop: '8px', background: '#f8fafc', borderRadius: '12px', padding: '8px', border: '1px solid #e2e8f0' }}>
                        <img src={msg.imageAsset.url} alt={msg.imageAsset.prompt} style={{ width: '100%', maxHeight: '175px', objectFit: 'cover', borderRadius: '9px', display: 'block' }} />
                        <button
                          type="button"
                          onClick={() => {
                            setChatMode('build');
                            setPromptInput(`שלב את התמונה הזו בצורה יפה בתוך המשחק (כדמות או כרקע):\n${msg.imageAsset.url}`);
                          }}
                          style={{
                            width: '100%',
                            marginTop: '8px',
                            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9px',
                            padding: '7px',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            cursor: 'pointer'
                          }}
                        >
                          ➕ שלב תמונה זו במשחק!
                        </button>
                      </div>
                    )}

                    {msg.applied && (
                      <div style={{ marginTop: '7px', display: 'inline-block', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '3px 9px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '800' }}>
                        ✅ המשחק עודכן משמאל — נסה לשחק!
                      </div>
                    )}
                  </div>
                );
              })}

              {isRunning && (
                <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', color: '#4338ca', padding: '11px 14px', borderRadius: '14px', fontSize: '0.83rem', fontWeight: '800' }}>
                  {chatMode === 'image' ? '🎨 מצייר תמונה מקורית ב-AI...' : '⚡ בונה ומשדרג את המשחק שלך בלייב...'}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Pending attachments */}
            {attachments.length > 0 && (
              <div style={{ padding: '6px 12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                {attachments.map((att) => (
                  <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '8px', padding: '3px 7px', fontSize: '0.73rem' }}>
                    <img src={att.publicUrl || att.dataUrl} alt={att.name} style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '5px' }} />
                    <button
                      type="button"
                      onClick={() => setAttachments((p) => p.filter((x) => x.id !== att.id))}
                      style={{ background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div style={{ padding: '10px 12px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onPaste={(e) => {
                  const items = e.clipboardData?.items || [];
                  const imgs = [];
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                      const f = items[i].getAsFile();
                      if (f) imgs.push(f);
                    }
                  }
                  if (imgs.length) handleAddAttachments(imgs);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                placeholder={
                  chatMode === 'image'
                    ? 'תאר איזו דמות או רקע ליצור ב-AI...'
                    : 'כתוב ל-AI מה לבנות, לשדרג או לתקן במשחק שלך...'
                }
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '9px 12px',
                  fontSize: '0.86rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.5'
                }}
              />
              <div style={{ display: 'flex', gap: '7px' }}>
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="צרף תמונה מהמחשב"
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '11px',
                    padding: '9px 12px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  📎
                </button>
                <button
                  type="button"
                  disabled={isRunning || (!promptInput.trim() && attachments.length === 0)}
                  onClick={() => handleSendPrompt()}
                  style={{
                    flex: 1,
                    background: isRunning
                      ? '#94a3b8'
                      : chatMode === 'image'
                      ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '11px',
                    padding: '9px 16px',
                    fontSize: '0.88rem',
                    fontWeight: '900',
                    cursor: isRunning ? 'wait' : 'pointer',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.25)'
                  }}
                >
                  {chatMode === 'image' ? '🎨 צור תמונה' : '🚀 שלח ל-AI'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANE: HUGE LIVE PLAYABLE GAME STAGE */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            background: previewDevice === 'mobile' ? 'linear-gradient(135deg, #e0e7ff, #fce7f3)' : '#090d16',
            justifyContent: 'center',
            alignItems: 'stretch',
            padding: previewDevice === 'mobile' ? '16px' : '0',
            overflow: 'hidden'
          }}
        >
          <iframe
            key={previewDevice}
            title="Live AI Game Preview"
            srcDoc={gameCode}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            style={{
              width: previewWidth,
              maxWidth: '100%',
              height: '100%',
              border: previewDevice === 'mobile' ? '10px solid #1e1b4b' : 'none',
              borderRadius: previewDevice === 'mobile' ? '28px' : '0',
              background: '#090d16',
              boxShadow: previewDevice === 'mobile' ? '0 24px 60px rgba(30, 27, 75, 0.35)' : 'none'
            }}
          />

          {showCodePeek && !isFullscreenPlay && (
            <div style={{ width: '40%', minWidth: '280px', background: '#0f172a', borderRight: '2px solid #6366f1', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 12px', background: '#1e1b4b', color: '#e0e7ff', fontSize: '0.78rem', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🔍 הצצה בקוד המשחק</span>
                <button type="button" onClick={() => setShowCodePeek(false)} style={{ background: 'transparent', color: '#c7d2fe', border: 'none', cursor: 'pointer', fontWeight: '900' }}>✕</button>
              </div>
              <textarea
                dir="ltr"
                spellCheck={false}
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                style={{ flex: 1, width: '100%', boxSizing: 'border-box', background: '#0b1120', color: '#e2e8f0', border: 'none', padding: '12px', fontFamily: 'Consolas, monospace', fontSize: '0.78rem', resize: 'none', outline: 'none' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cloud Save Modal */}
      <SavedProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        initialTab="save"
        projectType="ai_game"
        defaultProjectName={gameName}
        currentBlockXml=""
        currentCode={gameCode}
        onLoadProject={({ code }) => {
          if (code) {
            setGameCode(code);
            showToast('📂 המשחק נטען מהענן!');
            setShowSaveModal(false);
          }
        }}
      />

      {/* Submit to Teacher Modal */}
      <SendCodeModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        code={gameCode}
        blockXml=""
        filename={`${gameName.replace(/\s+/g, '_')}_game.html`}
        projectName={`${gameName} — משחק AI`}
        projectType="ai_game"
      />

      {/* Live Published + QR Code Modal */}
      {publishData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '20px'
          }}
          onClick={() => setPublishData(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              textAlign: 'center',
              direction: 'rtl',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '2.6rem', marginBottom: '6px' }}>🎉📱🎮</div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: '900', color: '#065f46' }}>
              "{gameName}" באוויר!
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#475569' }}>
              סרקו עם הטלפון כדי לשחק מיד או שתפו את הקישור עם החברים וההורים:
            </p>
            <div style={{ display: 'inline-block', padding: '12px', background: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publishData.liveUrl)}`}
                alt="QR Code למשחק"
                style={{ width: '170px', height: '170px', display: 'block', borderRadius: '10px' }}
              />
            </div>
            <div dir="ltr" style={{ background: '#f1f5f9', borderRadius: '10px', padding: '8px 10px', fontSize: '0.78rem', fontWeight: '700', color: '#334155', wordBreak: 'break-all', marginBottom: '16px' }}>
              {publishData.liveUrl}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={publishData.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: '11px', fontWeight: '900', fontSize: '0.88rem' }}
              >
                🚀 פתח משחק ↗
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(publishData.liveUrl);
                  setCopiedKey('qr_link');
                  setTimeout(() => setCopiedKey(''), 2000);
                }}
                style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '11px', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                {copiedKey === 'qr_link' ? '✅ הועתק!' : '📋 העתק קישור'}
              </button>
              <button
                type="button"
                onClick={() => setPublishData(null)}
                style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '10px 14px', borderRadius: '11px', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer' }}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
