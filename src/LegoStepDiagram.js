import React from 'react';

// ==========================================================================
// High-Fidelity 3D Isometric LEGO Building Step Illustrator
// Designed specifically to match the official LEGO Education WeDo 2.0 Software
// ==========================================================================

export default function LegoStepDiagram({ type, stepNumber }) {
  // Common 3D LEGO defs: bevel gradients, drop shadows, stud highlights
  const renderDefs = () => (
    <defs>
      {/* Drop Shadows */}
      <filter id="legoStageShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.18" />
      </filter>
      <filter id="legoPieceShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.25" />
      </filter>

      {/* Stud Shading */}
      <linearGradient id="studHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
      </linearGradient>

      {/* Connection Indicator Arrow Gradient */}
      <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>

      {/* Part Color Gradients */}
      <linearGradient id="azureGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="60%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>

      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a3e635" />
        <stop offset="60%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#65a30d" />
      </linearGradient>

      <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="60%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>

      <linearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="80%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
  );

  // Helper: 3D Isometric Stud
  const renderStud = (cx, cy, r = 7, color = '#cbd5e1') => (
    <g key={`${cx}-${cy}`}>
      {/* Stud Body */}
      <ellipse cx={cx} cy={cy + 3} rx={r} ry={r * 0.45} fill="#0f172a" opacity="0.2" />
      <path d={`M ${cx - r} ${cy} L ${cx - r} ${cy - 4} A ${r} ${r * 0.45} 0 0 1 ${cx + r} ${cy - 4} L ${cx + r} ${cy} Z`} fill={color} filter="brightness(0.9)" />
      {/* Stud Top */}
      <ellipse cx={cx} cy={cy - 4} rx={r} ry={r * 0.45} fill={color} stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" />
      <ellipse cx={cx} cy={cy - 4} rx={r * 0.6} ry={r * 0.28} fill="none" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.15" />
    </g>
  );

  // Helper: Technic Pin Hole
  const renderHole = (cx, cy, r = 6) => (
    <g key={`hole-${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={r} fill="#1e293b" />
      <circle cx={cx} cy={cy} r={r - 1.5} fill="#0f172a" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#64748b" strokeWidth="1" opacity="0.6" />
    </g>
  );

  // Render official WeDo connection arrow
  const renderConnectionArrow = (x1, y1, x2, y2, label) => (
    <g>
      <path
        d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 20} ${x2} ${y2}`}
        fill="none"
        stroke="#22c55e"
        strokeWidth="4"
        strokeDasharray="6,4"
      />
      <circle cx={x2} cy={y2} r="5" fill="#22c55e" />
      <polygon
        points={`${x2},${y2} ${x2 - 10},${y2 - 12} ${x2 + 4},${y2 - 14}`}
        fill="#16a34a"
      />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 26} fill="#15803d" fontSize="11" fontWeight="800" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );

  // Switch between 8 Steps of Dino & 8 Steps of Ride
  const renderContent = () => {
    switch (type) {
      // ======================================================================
      // 🐊 PROJECT 1: SNAPPING DINO (Lego WeDo 2.0 Set 45300)
      // ======================================================================
      case 'dino_step1':
        return (
          <g transform="translate(40, 20)">
            {/* Soft Platform Shadow */}
            <ellipse cx="210" cy="225" rx="200" ry="30" fill="#0f172a" opacity="0.1" filter="blur(8px)" />

            {/* Part 1: PLATE 2X16 BLACK (4282) */}
            <g filter="url(#legoPieceShadow)">
              {/* Plate Side & Top */}
              <path d="M 30 170 L 390 170 L 380 195 L 20 195 Z" fill="#1e293b" />
              <path d="M 20 195 L 380 195 L 380 205 L 20 205 Z" fill="#0f172a" />
              {/* Studs row */}
              {[...Array(14)].map((_, i) => renderStud(48 + i * 25, 175, 7, '#334155'))}
            </g>

            {/* Part 2: 2x BRICK 2X4 AZURE (3001) */}
            <g filter="url(#legoPieceShadow)">
              {/* Azure Brick 1 */}
              <rect x="140" y="115" width="70" height="45" rx="2" fill="url(#azureGrad)" />
              <rect x="140" y="160" width="70" height="8" fill="#0369a1" />
              {[...Array(4)].map((_, i) => renderStud(150 + i * 17, 115, 6, '#38bdf8'))}

              {/* Azure Brick 2 */}
              <rect x="215" y="115" width="70" height="45" rx="2" fill="url(#azureGrad)" />
              <rect x="215" y="160" width="70" height="8" fill="#0369a1" />
              {[...Array(4)].map((_, i) => renderStud(225 + i * 17, 115, 6, '#38bdf8'))}
            </g>

            {/* Part 3: PLATE 2X6 ORANGE (32001) clicking down */}
            <g filter="url(#legoPieceShadow)" transform="translate(0, -10)">
              <rect x="155" y="85" width="115" height="18" rx="2" fill="url(#orangeGrad)" />
              {[...Array(6)].map((_, i) => renderStud(165 + i * 18, 85, 5, '#fb923c'))}
            </g>

            {/* Connection Arrow */}
            {renderConnectionArrow(210, 50, 210, 75, 'לחץ לנעילה')}
          </g>
        );

      case 'dino_step2':
        return (
          <g transform="translate(40, 20)">
            <ellipse cx="210" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Base plate */}
            <rect x="50" y="180" width="320" height="20" rx="3" fill="#1e293b" />

            {/* SMART HUB 4X8X3 (19071) */}
            <g filter="url(#legoPieceShadow)">
              {/* Main Hub Body */}
              <rect x="120" y="80" width="200" height="95" rx="8" fill="url(#hubGrad)" stroke="#cbd5e1" strokeWidth="2" />
              {/* Front side bevel */}
              <rect x="120" y="165" width="200" height="15" rx="2" fill="#94a3b8" />
              
              {/* Circular Green WeDo Button */}
              <circle cx="220" cy="115" r="18" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
              <circle cx="220" cy="115" r="14" fill="#4ade80" />
              <polygon points="216,108 226,115 216,122" fill="#ffffff" />
              
              {/* Top Studs 4x8 */}
              {[...Array(8)].map((_, i) => renderStud(135 + i * 24, 78, 7, '#f8fafc'))}

              {/* Ports A & B */}
              <rect x="300" y="115" width="16" height="14" rx="2" fill="#0f172a" />
              <text x="308" y="126" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>
              <rect x="300" y="135" width="16" height="14" rx="2" fill="#0f172a" />
              <text x="308" y="146" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>
            </g>

            {/* Plates 1x4 White holding base */}
            <rect x="130" y="172" width="70" height="8" rx="2" fill="#ffffff" stroke="#cbd5e1" />
            <rect x="240" y="172" width="70" height="8" rx="2" fill="#ffffff" stroke="#cbd5e1" />

            {renderConnectionArrow(220, 35, 220, 68, 'חיבור ה-Smart Hub לשלדה')}
          </g>
        );

      case 'dino_step3':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Hub in background */}
            <rect x="180" y="100" width="170" height="80" rx="6" fill="#e2e8f0" opacity="0.8" />
            <circle cx="250" cy="120" r="12" fill="#22c55e" opacity="0.8" />

            {/* MEDIUM MOTOR (21980) */}
            <g filter="url(#legoPieceShadow)">
              <rect x="70" y="110" width="105" height="65" rx="6" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
              <rect x="70" y="165" width="105" height="10" fill="#64748b" />
              <text x="122" y="146" fill="#1e293b" fontSize="11" fontWeight="800" textAnchor="middle">WeDo MOTOR</text>

              {/* Red Axle Output socket */}
              <circle cx="55" cy="142" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
              <path d="M 50 142 L 60 142 M 55 137 L 55 147" stroke="#ffffff" strokeWidth="2.5" />

              {/* Axle 3M Grey protruding */}
              <rect x="30" y="139" width="25" height="6" fill="#64748b" />

              {/* Wedge-Belt Wheel 24mm (Tr. Light Blue) */}
              <g transform="translate(35, 142)">
                <circle cx="0" cy="0" r="28" fill="#38bdf8" opacity="0.8" stroke="#0284c7" strokeWidth="3" />
                <circle cx="0" cy="0" r="18" fill="#0284c7" opacity="0.6" />
                <circle cx="0" cy="0" r="6" fill="#0f172a" />
                {/* Pulley Groove */}
                <circle cx="0" cy="0" r="26" fill="none" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="6,3" />
              </g>

              {/* Red V-Belt 24 */}
              <path
                d="M 35 116 C 110 116, 120 100, 150 100"
                fill="none"
                stroke="#ef4444"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>

            {renderConnectionArrow(35, 70, 35, 110, 'הרכבת הגלגלת והרצועה על ציר המנוע')}
          </g>
        );

      case 'dino_step4':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Technic Beam 1x4 Lime Green */}
            <g filter="url(#legoPieceShadow)">
              <rect x="90" y="140" width="140" height="30" rx="15" fill="url(#greenGrad)" stroke="#65a30d" strokeWidth="2" />
              {[...Array(4)].map((_, i) => renderHole(110 + i * 33, 155, 7))}
            </g>

            {/* Driven Pulley Wheel 24mm with Axle 6M */}
            <g filter="url(#legoPieceShadow)">
              <circle cx="210" cy="155" r="28" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="3" />
              <circle cx="210" cy="155" r="8" fill="#1e293b" />

              {/* Red Belt loop from motor pulley to this pulley */}
              <ellipse cx="140" cy="155" rx="70" ry="26" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="8,4" />

              {/* Crank Arm: Technic 1x2 Lime Green */}
              <g transform="translate(210, 155) rotate(-35)">
                <rect x="-10" y="-12" width="55" height="24" rx="12" fill="url(#greenGrad)" stroke="#4d7c0f" strokeWidth="1.5" />
                {renderHole(0, 0, 5)}
                {renderHole(35, 0, 5)}
                {/* Crank pin */}
                <circle cx="35" cy="0" r="4" fill="#f97316" />
              </g>
            </g>

            {renderConnectionArrow(210, 75, 235, 130, 'ארכובה (Crank) שמרימה את הלסת')}
          </g>
        );

      case 'dino_step5':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="220" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Lower Jaw Assembly */}
            <g filter="url(#legoPieceShadow)">
              {/* Plate 2x6 Orange */}
              <rect x="60" y="160" width="180" height="24" rx="3" fill="url(#orangeGrad)" />
              
              {/* Side Curved Beams: Brick 1x6 w/Bow Lime Green */}
              <path d="M 60 160 Q 150 195 240 160 L 240 142 Q 150 170 60 142 Z" fill="url(#greenGrad)" stroke="#65a30d" strokeWidth="1.5" />

              {/* Lower Teeth: Inverted Roof Tiles 1x2 Orange & 45 deg */}
              <polygon points="75,160 88,135 101,160" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="115,160 128,135 141,160" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="155,160 168,135 181,160" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="195,160 208,135 221,160" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Studs */}
              {[...Array(6)].map((_, i) => renderStud(75 + i * 26, 160, 5, '#fb923c'))}
            </g>

            {renderConnectionArrow(150, 60, 150, 130, 'שיני הלסת התחתונה משיפועי לגו')}
          </g>
        );

      case 'dino_step6':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="220" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Lower jaw stationary */}
            <rect x="60" y="185" width="220" height="22" rx="3" fill="#ea580c" opacity="0.6" />

            {/* Pivot Axle 4M with End Stop & Bush */}
            <circle cx="250" cy="155" r="9" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
            <circle cx="250" cy="155" r="3" fill="#ffffff" />
            <text x="250" y="138" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle">ציר מפרק 4M</text>

            {/* Upper Jaw Angled up on Pivot */}
            <g filter="url(#legoPieceShadow)" transform="rotate(-24 250 155)">
              {/* Technic Beam 1x8 Lime Green */}
              <rect x="50" y="140" width="210" height="28" rx="4" fill="url(#greenGrad)" stroke="#65a30d" strokeWidth="2" />
              
              {/* Upper Teeth hanging down */}
              <polygon points="65,168 78,195 91,168" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="105,168 118,195 131,168" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="145,168 158,195 171,168" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Studs on top of upper jaw */}
              {[...Array(7)].map((_, i) => renderStud(65 + i * 26, 140, 5, '#84cc16'))}
            </g>

            {renderConnectionArrow(140, 50, 160, 105, 'חיבור הלסת העליונה למפרק הסיבוב')}
          </g>
        );

      case 'dino_step7':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="220" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Jaw silhouette */}
            <rect x="60" y="185" width="220" height="18" rx="2" fill="#ea580c" opacity="0.5" />
            <rect x="60" y="95" width="220" height="18" rx="2" fill="#84cc16" opacity="0.5" />

            {/* DETECT SENSOR (20844) */}
            <g filter="url(#legoPieceShadow)">
              <rect x="130" y="125" width="100" height="50" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              {/* Sensor Twin Eyes */}
              <circle cx="158" cy="150" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="158" cy="150" r="9" fill="#0284c7" />
              <circle cx="156" cy="148" r="3" fill="#ffffff" />

              <circle cx="202" cy="150" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="202" cy="150" r="9" fill="#0284c7" />
              <circle cx="200" cy="148" r="3" fill="#ffffff" />

              {/* Sensor Wire running to Port A */}
              <path d="M 230 150 Q 290 160 320 130" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              <rect x="315" y="120" width="14" height="18" rx="2" fill="#0f172a" />
              <text x="322" y="133" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>

              {/* Detection Cone */}
              <polygon points="130,150 40,110 40,190" fill="#06b6d4" opacity="0.25" />
              <text x="75" y="154" fill="#0284c7" fontSize="10" fontWeight="bold">זיהוי טרף</text>
            </g>

            {renderConnectionArrow(180, 50, 180, 115, 'התקנת חיישן המרחק (Detect) וחיבור לשקע A')}
          </g>
        );

      case 'dino_step8':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="200" ry="25" fill="#0f172a" opacity="0.12" />

            {/* Complete Realistic 3D Lego Dino Head */}
            <g filter="url(#legoStageShadow)">
              {/* Lower Jaw */}
              <path d="M 50 185 L 260 185 L 260 210 L 40 210 Z" fill="url(#orangeGrad)" stroke="#c2410c" strokeWidth="1.5" />
              
              {/* Upper Jaw with Studs and Teeth */}
              <path d="M 40 135 L 270 120 L 270 165 L 45 175 Z" fill="url(#greenGrad)" stroke="#4d7c0f" strokeWidth="2" />
              
              {/* Teeth */}
              {[...Array(5)].map((_, i) => (
                <polygon key={i} points={`${60 + i * 36},173 ${72 + i * 36},195 ${84 + i * 36},173`} fill="#ffffff" stroke="#cbd5e1" />
              ))}

              {/* Round 1x1 Tiles with Eye Print (98138) */}
              <g transform="translate(195, 100)">
                <ellipse cx="0" cy="0" rx="18" ry="16" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
                <circle cx="2" cy="0" r="9" fill="#0f172a" />
                <circle cx="-1" cy="-3" r="3.5" fill="#ffffff" />
              </g>
              <g transform="translate(235, 95)">
                <ellipse cx="0" cy="0" rx="16" ry="14" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
                <circle cx="2" cy="0" r="8" fill="#0f172a" />
                <circle cx="-1" cy="-2.5" r="3" fill="#ffffff" />
              </g>

              {/* Antennae */}
              <line x1="240" y1="90" x2="270" y2="45" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="270" cy="45" r="4.5" fill="#38bdf8" />
            </g>

            {/* Success Ribbon */}
            <rect x="90" y="10" width="280" height="38" rx="19" fill="#059669" filter="url(#legoPieceShadow)" />
            <text x="230" y="34" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
              ✨ מודל הדינוזאור מושלם! עברו לתכנות
            </text>
          </g>
        );

      // ======================================================================
      // 🎡 PROJECT 2: CARNIVAL RIDE (Lego WeDo 2.0 Set 45300)
      // ======================================================================
      case 'ride_step1':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Technic Beam 1x16 Green (3703) */}
            <g filter="url(#legoPieceShadow)">
              <rect x="40" y="150" width="360" height="26" rx="13" fill="url(#greenGrad)" stroke="#65a30d" strokeWidth="2" />
              {[...Array(13)].map((_, i) => renderHole(60 + i * 26, 163, 6))}
            </g>

            {/* Cross Crossbeam Plate 2x8 with holes (3738) */}
            <g filter="url(#legoPieceShadow)">
              <rect x="180" y="110" width="80" height="110" rx="4" fill="#15803d" stroke="#166534" strokeWidth="2" opacity="0.85" />
              {[...Array(4)].map((_, i) => renderHole(200, 125 + i * 24, 5))}
              {[...Array(4)].map((_, i) => renderHole(240, 125 + i * 24, 5))}
            </g>

            {renderConnectionArrow(220, 45, 220, 100, 'בסיס צלב X רחב ויציב')}
          </g>
        );

      case 'ride_step2':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Base beam */}
            <rect x="40" y="175" width="360" height="20" rx="3" fill="#84cc16" opacity="0.6" />

            {/* Smart Hub 4x8x3 mounted on side */}
            <g filter="url(#legoPieceShadow)">
              <rect x="60" y="90" width="150" height="85" rx="8" fill="url(#hubGrad)" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="135" cy="120" r="14" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
              <text x="135" y="155" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">משקולת יציבות</text>
            </g>

            {/* Center Area highlight for Turntable */}
            <circle cx="280" cy="150" r="32" fill="none" stroke="#0284c7" strokeWidth="3" strokeDasharray="6,4" />
            <text x="280" y="110" fill="#0284c7" fontSize="12" fontWeight="bold" textAnchor="middle">מרכז הקרוסלה</text>

            {renderConnectionArrow(280, 50, 280, 115, 'הכנת ציר הסיבוב המרכזי')}
          </g>
        );

      case 'ride_step3':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Turntable 4x4 Black (61485) */}
            <g filter="url(#legoPieceShadow)" transform="translate(220, 105)">
              <rect x="-45" y="30" width="90" height="24" rx="6" fill="#0f172a" />
              <ellipse cx="0" cy="30" rx="48" ry="20" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
              <ellipse cx="0" cy="28" rx="36" ry="15" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <ellipse cx="0" cy="26" rx="14" ry="6" fill="#0f172a" />

              {/* 360 Rotation indicator */}
              <path d="M -30 26 A 40 16 0 0 1 30 26" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5,3" />
              <polygon points="30,23 38,27 30,31" fill="#38bdf8" />
            </g>

            {renderConnectionArrow(220, 40, 220, 95, 'בסיס מסתובב 360° (Turntable 4x4)')}
          </g>
        );

      case 'ride_step4':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Motor horizontal */}
            <g filter="url(#legoPieceShadow)">
              <rect x="70" y="150" width="100" height="50" rx="6" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
              
              {/* Bevel Gear Z20 Yellow (32198) on motor */}
              <circle cx="190" cy="175" r="22" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
              <circle cx="190" cy="175" r="7" fill="#713f12" />
              <text x="190" y="179" fill="#713f12" fontSize="9" fontWeight="bold" textAnchor="middle">Z20</text>

              {/* Conical Gear Z12 Black (32270) on vertical axle */}
              <circle cx="208" cy="158" r="15" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="208" y="162" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Z12</text>

              {/* Axle 10M Black (3737) vertical */}
              <rect x="204" y="30" width="8" height="135" rx="3" fill="#0f172a" stroke="#334155" />
              
              {/* 90 deg Arrow */}
              <path d="M 190 150 L 208 150 L 208 135" fill="none" stroke="#22c55e" strokeWidth="2" />
            </g>

            {renderConnectionArrow(208, 10, 208, 25, 'תמסורת זוויתית 90° (Bevel Gears)')}
          </g>
        );

      case 'ride_step5':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Central Mast */}
            <rect x="216" y="80" width="8" height="130" fill="#0f172a" />

            {/* Rotor Cross Arms at Top */}
            <g filter="url(#legoPieceShadow)" transform="translate(70, 75)">
              <rect x="0" y="0" width="300" height="22" rx="11" fill="url(#greenGrad)" stroke="#65a30d" strokeWidth="2" />
              {[...Array(9)].map((_, i) => renderHole(20 + i * 32, 11, 5.5))}
              
              {/* 1/2 Bush Yellow on top */}
              <rect x="142" y="-8" width="16" height="10" rx="3" fill="#facc15" stroke="#ca8a04" />
            </g>

            {renderConnectionArrow(220, 20, 220, 65, 'זרועות עליונות לתליית מושבי הסנובורד')}
          </g>
        );

      case 'ride_step6':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Mast and arms */}
            <rect x="216" y="60" width="8" height="150" fill="#0f172a" />
            <rect x="70" y="60" width="300" height="18" rx="9" fill="#84cc16" />

            {/* Left Hanging Snowboard flying out */}
            <g transform="rotate(20 100 70)" filter="url(#legoPieceShadow)">
              <line x1="100" y1="70" x2="80" y2="175" stroke="#475569" strokeWidth="2.5" strokeDasharray="5,3" />
              {/* Snowboard 93218 Orange */}
              <rect x="50" y="170" width="60" height="14" rx="7" fill="url(#orangeGrad)" stroke="#c2410c" strokeWidth="1.5" />
            </g>

            {/* Right Hanging Snowboard flying out */}
            <g transform="rotate(-20 340 70)" filter="url(#legoPieceShadow)">
              <line x1="340" y1="70" x2="360" y2="175" stroke="#475569" strokeWidth="2.5" strokeDasharray="5,3" />
              {/* Snowboard 93218 Orange */}
              <rect x="330" y="170" width="60" height="14" rx="7" fill="url(#orangeGrad)" stroke="#c2410c" strokeWidth="1.5" />
            </g>

            {renderConnectionArrow(220, 20, 220, 55, 'מושבי סנובורד תלויים לעוצמת סיבוב צנטריפוגלית')}
          </g>
        );

      case 'ride_step7':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="190" ry="25" fill="#0f172a" opacity="0.1" />

            {/* Handholding TILT SENSOR (20841) */}
            <g filter="url(#legoPieceShadow)" transform="translate(150, 90)">
              <rect x="0" y="0" width="130" height="70" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* Tilt Symbol */}
              <circle cx="65" cy="35" r="22" fill="#e0f2fe" />
              <path d="M 50 35 L 80 35 M 65 20 L 65 50" stroke="#0284c7" strokeWidth="3" />
              <polygon points="80,31 87,35 80,39" fill="#0284c7" />
              <polygon points="61,20 65,13 69,20" fill="#0284c7" />

              <text x="65" y="62" fill="#0369a1" fontSize="10" fontWeight="bold" textAnchor="middle">חיישן הטיה Tilt</text>
            </g>

            {/* Cable running to Port A */}
            <path d="M 150 130 Q 90 150 60 180" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <rect x="50" y="175" width="16" height="18" rx="2" fill="#0f172a" />
            <text x="58" y="188" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>

            {renderConnectionArrow(215, 30, 215, 80, 'חיישן הטיה המשמש כידית מפעיל (מצערת)')}
          </g>
        );

      case 'ride_step8':
        return (
          <g transform="translate(30, 20)">
            <ellipse cx="230" cy="225" rx="200" ry="25" fill="#0f172a" opacity="0.12" />

            {/* Carousel Spinning Animation Frame */}
            <g filter="url(#legoStageShadow)" transform="translate(220, 130)">
              {/* Pillar */}
              <rect x="-6" y="-50" width="12" height="110" fill="#0f172a" />
              
              {/* Rotor Spin Blur */}
              <ellipse cx="0" cy="-50" rx="170" ry="24" fill="#38bdf8" opacity="0.18" />

              {/* Red Flower On Top (98262) */}
              <circle cx="0" cy="-70" r="14" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
              <circle cx="0" cy="-70" r="5" fill="#facc15" />
              <line x1="0" y1="-56" x2="0" y2="-50" stroke="#22c55e" strokeWidth="4" />

              {/* Flying Snowboard Left */}
              <line x1="-110" y1="-50" x2="-145" y2="25" stroke="#475569" strokeWidth="2.5" />
              <rect x="-170" y="20" width="50" height="12" rx="6" fill="url(#orangeGrad)" transform="rotate(-25 -145 25)" />

              {/* Flying Snowboard Right */}
              <line x1="110" y1="-50" x2="145" y2="25" stroke="#475569" strokeWidth="2.5" />
              <rect x="120" y="20" width="50" height="12" rx="6" fill="url(#orangeGrad)" transform="rotate(25 145 25)" />
            </g>

            {/* Success Banner */}
            <rect x="80" y="10" width="300" height="38" rx="19" fill="#0284c7" filter="url(#legoPieceShadow)" />
            <text x="230" y="34" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
              🎡 הקרוסלה מוכנה לפעולה! עברו לתכנות
            </text>
          </g>
        );

      default:
        return (
          <text x="250" y="150" fill="#64748b" textAnchor="middle">שלב {stepNumber}</text>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 500 270"
        style={{ width: '100%', height: 'auto', maxHeight: '340px' }}
      >
        {renderDefs()}
        {renderContent()}
      </svg>
    </div>
  );
}
