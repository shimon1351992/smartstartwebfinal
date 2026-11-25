import React, { useState, useEffect, useRef } from 'react';

const STORAGE_TOURNAMENT_KEY = 'smartstart_game_tournament_players_v1';
const AVATAR_OPTIONS = ['🦁', '🦊', '🚀', '🎮', '⚡', '🐉', '🦄', '🤖', '🥷', '👑', '🔥', '⭐'];

function playBellChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.48);
    });
  } catch {}
}

export default function TournamentArena({ currentGameName = '', onBackToWorkshop }) {
  // Round Timer State
  const [roundMinutes, setRoundMinutes] = useState(4);
  const [secondsLeft, setSecondsLeft] = useState(4 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundEndedBanner, setRoundEndedBanner] = useState(false);

  // Players Scoreboard State
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TOURNAMENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [newName, setNewName] = useState('');
  const [newGame, setNewGame] = useState('');
  const [newAvatar, setNewAvatar] = useState('🚀');
  const [showPodium, setShowPodium] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TOURNAMENT_KEY, JSON.stringify(players));
    } catch {}
  }, [players]);

  useEffect(() => {
    if (!timerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          setRoundEndedBanner(true);
          playBellChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleSelectDuration = (mins) => {
    setTimerRunning(false);
    setRoundEndedBanner(false);
    setRoundMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const handleStartNextRound = () => {
    setRoundNumber((r) => r + 1);
    setSecondsLeft(roundMinutes * 60);
    setRoundEndedBanner(false);
    setTimerRunning(true);
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    const cleanName = newName.trim();
    if (!cleanName) return;
    setPlayers((prev) => [
      ...prev,
      {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
        name: cleanName,
        gameTitle: newGame.trim() || currentGameName || 'משחק מקורי ב-AI',
        avatar: newAvatar,
        wins: 0,
        likes: 0
      }
    ]);
    setNewName('');
    setNewGame('');
    setNewAvatar(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
  };

  const updatePlayerStat = (id, field, delta) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: Math.max(0, (p[field] || 0) + delta) } : p))
    );
  };

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetAll = () => {
    if (!window.confirm('לאפס את כל לוח הניקוד לטורניר חדש?')) return;
    setPlayers([]);
    setRoundNumber(1);
    setTimerRunning(false);
    setSecondsLeft(roundMinutes * 60);
    setRoundEndedBanner(false);
  };

  const sortedByWins = [...players].sort((a, b) => b.wins - a.wins || b.likes - a.likes);
  const mostLoved = [...players].sort((a, b) => b.likes - a.likes)[0];

  const minsStr = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secsStr = String(secondsLeft % 60).padStart(2, '0');
  const timerPercent = Math.max(0, Math.min(100, (secondsLeft / (roundMinutes * 60)) * 100));

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', direction: 'rtl' }}>
      {/* =====================================================================
          HERO TOURNAMENT TIMER CARD
         ===================================================================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 48%, #ec4899 100%)',
          color: '#ffffff',
          borderRadius: '28px',
          padding: '26px 28px',
          boxShadow: '0 20px 50px rgba(99, 102, 241, 0.28)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.18)', padding: '5px 13px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '10px' }}>
              <span>🏆 זירת הטורניר הכיתתי</span>
              <span>•</span>
              <span>סבב #{roundNumber}</span>
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: '900' }}>
              מתחלפים, משחקים ושוברים שיאים!
            </h1>
            <p style={{ margin: 0, fontSize: '0.94rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.55' }}>
              כל סבב עוברים למשחק של חבר חדש. הצלחת לנצח או לשבור שיא? מסמנים <strong>+1 🏆</strong> — ומי שאוסף הכי הרבה ניצחונות הוא אלוף הסדנה!
            </p>
          </div>

          {/* Big Glowing Countdown */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.28)',
              borderRadius: '22px',
              padding: '16px 24px',
              textAlign: 'center',
              minWidth: '240px'
            }}
          >
            <div dir="ltr" style={{ fontSize: '3.1rem', fontWeight: '900', lineHeight: 1, letterSpacing: '2px', color: secondsLeft <= 20 && timerRunning ? '#fde047' : '#ffffff' }}>
              {minsStr}:{secsStr}
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden', margin: '10px 0 12px' }}>
              <div style={{ width: `${timerPercent}%`, height: '100%', background: '#34d399', transition: 'width 0.5s linear' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
              {[3, 4, 5].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectDuration(m)}
                  style={{
                    background: roundMinutes === m ? '#ffffff' : 'rgba(255,255,255,0.14)',
                    color: roundMinutes === m ? '#4f46e5' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.76rem',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  {m} דק׳
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setRoundEndedBanner(false);
                  if (secondsLeft === 0) setSecondsLeft(roundMinutes * 60);
                  setTimerRunning((v) => !v);
                }}
                style={{
                  flex: 1,
                  background: timerRunning ? '#fbbf24' : '#34d399',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '9px 14px',
                  fontWeight: '900',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {timerRunning ? '⏸️ השהה' : '▶️ התחל סבב'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setRoundEndedBanner(false);
                  setSecondsLeft(roundMinutes * 60);
                }}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '11px',
                  padding: '9px 12px',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        {/* Round Ended Alert Banner */}
        {roundEndedBanner && (
          <div
            style={{
              marginTop: '16px',
              background: '#fef08a',
              color: '#713f12',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontWeight: '900',
              fontSize: '1rem'
            }}
          >
            <span>🔔 נגמר סבב #{roundNumber}! עדכנו נקודות והחליפו למחשב הבא! 🔄</span>
            <button
              type="button"
              onClick={handleStartNextRound}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 16px',
                fontWeight: '900',
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              ▶️ התחל סבב #{roundNumber + 1}
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          ADD PLAYER BAR
         ===================================================================== */}
      <form
        onSubmit={handleAddPlayer}
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#f8fafc', padding: '5px 8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {AVATAR_OPTIONS.slice(0, 6).map((av) => (
            <button
              key={av}
              type="button"
              onClick={() => setNewAvatar(av)}
              style={{
                background: newAvatar === av ? '#eef2ff' : 'transparent',
                border: newAvatar === av ? '2px solid #6366f1' : '2px solid transparent',
                borderRadius: '8px',
                fontSize: '1.15rem',
                width: '34px',
                height: '34px',
                cursor: 'pointer'
              }}
            >
              {av}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="שם התלמיד/ה..."
          style={{
            flex: 1,
            minWidth: '150px',
            padding: '11px 14px',
            borderRadius: '12px',
            border: '1.5px solid #e2e8f0',
            fontSize: '0.92rem',
            fontWeight: '700',
            outline: 'none'
          }}
        />

        <input
          type="text"
          value={newGame}
          onChange={(e) => setNewGame(e.target.value)}
          placeholder="שם המשחק שבנה/תה (אופציונלי)..."
          style={{
            flex: 1,
            minWidth: '170px',
            padding: '11px 14px',
            borderRadius: '12px',
            border: '1.5px solid #e2e8f0',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px 20px',
            fontWeight: '900',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.25)'
          }}
        >
          ➕ הוסף לטורניר
        </button>
      </form>

      {/* =====================================================================
          LIVE SCOREBOARD GRID
         ===================================================================== */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 28px rgba(15, 23, 42, 0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
              📊 לוח האלופים החי ({players.length} משתתפים)
            </h2>
            <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
              לוחצים +1 🏆 על כל משחק של חבר שניצחתם (או שברתם בו שיא!), ו-💖 למשחקים שהכי אהבתם!
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {players.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    playBellChime();
                    setShowPodium(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '9px 18px',
                    fontWeight: '900',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)'
                  }}
                >
                  🎉 הכרז על המנצחים!
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  style={{
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '9px 13px',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ איפוס
                </button>
              </>
            )}
          </div>
        </div>

        {sortedByWins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '44px 20px', background: '#f8fafc', borderRadius: '18px', border: '1.5px dashed #cbd5e1' }}>
            <div style={{ fontSize: '2.6rem', marginBottom: '8px' }}>🎮🏆</div>
            <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1e293b', marginBottom: '4px' }}>
              הוסיפו את שמות התלמידים למעלה כדי להתחיל את הטורניר!
            </div>
            <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
              ברגע שמוסיפים שחקנים, לוח הניקוד מסתדר אוטומטית מהמקום הראשון למטה ✨
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
            {sortedByWins.map((player, idx) => {
              const rankBadge = idx === 0 && player.wins > 0 ? '👑 #1' : idx === 1 && player.wins > 0 ? '🥈 #2' : idx === 2 && player.wins > 0 ? '🥉 #3' : `#${idx + 1}`;
              const isLeader = idx === 0 && player.wins > 0;
              return (
                <div
                  key={player.id}
                  style={{
                    background: isLeader ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#f8fafc',
                    border: isLeader ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'transform 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.45rem',
                          flexShrink: 0
                        }}
                      >
                        {player.avatar}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: '900', fontSize: '1rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {player.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          🎮 {player.gameTitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          background: isLeader ? '#f59e0b' : '#e2e8f0',
                          color: isLeader ? '#ffffff' : '#475569',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.76rem',
                          fontWeight: '900'
                        }}
                      >
                        {rankBadge}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePlayer(player.id)}
                        title="הסר משתתף"
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', padding: '2px' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Win & Like Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => updatePlayerStat(player.id, 'wins', 1)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontWeight: '900',
                        fontSize: '0.86rem',
                        cursor: 'pointer'
                      }}
                    >
                      +1 🏆 ניצחון ({player.wins})
                    </button>

                    <button
                      type="button"
                      onClick={() => updatePlayerStat(player.id, 'wins', -1)}
                      title="הורד נקודה"
                      style={{
                        background: '#ffffff',
                        color: '#64748b',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '9px 10px',
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      -1
                    </button>

                    <button
                      type="button"
                      onClick={() => updatePlayerStat(player.id, 'likes', 1)}
                      title="הצבע למשחק הכי אהוב!"
                      style={{
                        background: '#fdf2f8',
                        color: '#db2777',
                        border: '1px solid #fbcfe8',
                        borderRadius: '11px',
                        padding: '9px 11px',
                        fontWeight: '900',
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                    >
                      💖 {player.likes}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {onBackToWorkshop && (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onBackToWorkshop}
            style={{
              background: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            ← חזרה לדף הסדנה
          </button>
        </div>
      )}

      {/* =====================================================================
          CELEBRATION PODIUM MODAL
         ===================================================================== */}
      {showPodium && sortedByWins.length > 0 && (
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
          onClick={() => setShowPodium(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)',
              color: '#ffffff',
              borderRadius: '30px',
              maxWidth: '580px',
              width: '100%',
              padding: '32px',
              border: '3px solid #fbbf24',
              textAlign: 'center',
              boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
              direction: 'rtl'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '3.2rem', marginBottom: '6px' }}>👑🏆🎉</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.9rem', fontWeight: '900', color: '#fde047' }}>
              אלופי סדנת המשחקים ב-AI!
            </h2>
            <p style={{ margin: '0 0 22px', fontSize: '0.95rem', color: '#e0e7ff' }}>
              כל הכבוד לכל היוצרים והמתחרים! הנה המובילים של היום:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {sortedByWins.slice(0, 3).map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    background: i === 0 ? 'rgba(251, 191, 36, 0.24)' : 'rgba(255, 255, 255, 0.1)',
                    border: i === 0 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    padding: '13px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '900', fontSize: '1.08rem' }}>
                        {p.avatar} {p.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#c7d2fe' }}>🎮 {p.gameTitle}</div>
                    </div>
                  </div>
                  <span style={{ background: '#fbbf24', color: '#451a03', padding: '5px 12px', borderRadius: '999px', fontWeight: '900', fontSize: '0.88rem' }}>
                    {p.wins} ניצחונות 🏆
                  </span>
                </div>
              ))}
            </div>

            {mostLoved && mostLoved.likes > 0 && (
              <div style={{ background: 'rgba(236, 72, 153, 0.22)', border: '1px solid #f472b6', borderRadius: '14px', padding: '10px 16px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '800', color: '#fbcfe8' }}>
                💖 המשחק הכי אהוב בכיתה: <strong>"{mostLoved.gameTitle}"</strong> של {mostLoved.name} ({mostLoved.likes} לייקים!)
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPodium(false)}
              style={{
                background: '#ffffff',
                color: '#1e1b4b',
                border: 'none',
                borderRadius: '12px',
                padding: '11px 26px',
                fontWeight: '900',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              סגור ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
