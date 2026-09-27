import React from 'react';

export default function DriverModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        direction: 'rtl',
        fontFamily: 'Assistant, system-ui, sans-serif'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1.5px solid #cbd5e1',
          padding: '32px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
            }}
          >
            🔌
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>
              הורדת דרייברים לחיבור לוח ה-ESP32
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.92rem', color: '#64748b', fontWeight: '600' }}>
              התקנה חד-פעמית כדי שהמחשב והדפדפן יזהו את כבל ה-USB לצריבה ישירה
            </p>
          </div>
        </div>

        {/* Instructions Intro */}
        <div
          style={{
            background: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#1e3a8a',
            fontWeight: '600'
          }}
        >
          💡 <strong>מדוע צריך דרייבר?</strong> לוחות ESP32 ו-Arduino כוללים שבב תקשורת (USB-to-UART). אם הלוח לא מופיע ברשימת הפורטים או שהצריבה נכשלת, התקן את אחד משני הדרייברים הבאים לפי סוג הלוח שברשותך:
        </div>

        {/* Drivers Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '26px' }}>
          
          {/* DRIVER 1: CP2102 (Silicon Labs) */}
          <div
            style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span
                  style={{
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    marginBottom: '6px',
                    display: 'inline-block'
                  }}
                >
                  ⭐ מומלץ ביותר (ברירת מחדל ל-ESP32)
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                  דרייבר CP2102 / CP210x (Silicon Labs)
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', fontWeight: '500' }}>
                  מתאים לרוב לוחות ESP32 DevKit, Freenove 4WD, NodeMCU ו-Keyestudio.
                </p>
              </div>

              <a
                href="https://www.silabs.com/documents/public/software/CP210x_Windows_Drivers.zip"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                <span>📥</span>
                <span>הורד דרייבר (ZIP)</span>
              </a>
            </div>

            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
              <strong>הוראות התקנה:</strong>
              <ol style={{ margin: '4px 0 0 0', paddingRight: '20px' }}>
                <li>חלץ את קובץ ה-ZIP שהורדת לתיקייה במחשב.</li>
                <li>הפעל את הקובץ <code>CP210xVCPInstaller_x64.exe</code> (או <code>_x86</code> במערכת 32bit).</li>
                <li>לחץ על <strong>Next</strong> ולאחר מכן <strong>Finish</strong>.</li>
              </ol>
            </div>
          </div>

          {/* DRIVER 2: CH340 / CH341 (WCH) */}
          <div
            style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span
                  style={{
                    background: '#fef3c7',
                    color: '#b45309',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    marginBottom: '6px',
                    display: 'inline-block'
                  }}
                >
                  תואם Arduino ולוחות סיניים
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                  דרייבר CH340 / CH341 / CH340G (WCH)
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', fontWeight: '500' }}>
                  מתאים ללוחות Arduino Uno/Nano תואמים, ESP32-CAM ולוחות מבוססי שבב CH340.
                </p>
              </div>

              <a
                href="https://www.wch.cn/downloads/CH341SER_EXE.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                }}
              >
                <span>📥</span>
                <span>הורד דרייבר (EXE)</span>
              </a>
            </div>

            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
              <strong>הוראות התקנה:</strong>
              <ol style={{ margin: '4px 0 0 0', paddingRight: '20px' }}>
                <li>הפעל את קובץ ההתקנה <code>CH341SER.EXE</code>.</li>
                <li>בחלון שייפתח לחץ על הכפתור <strong>INSTALL</strong>.</li>
                <li>תקבל הודעה <strong>"Driver install success!"</strong>.</li>
              </ol>
            </div>
          </div>

        </div>

        {/* Bottom Tip & Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.88rem', color: '#059669', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✨</span>
            <span>לאחר ההתקנה: נתק וחבר מחדש את כבל ה-USB של הרובוט, ולחץ שוב על "חבר USB בדפדפן"!</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 28px',
              borderRadius: '14px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontWeight: '900',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            הבנתי, סגור
          </button>
        </div>
      </div>
    </div>
  );
}
