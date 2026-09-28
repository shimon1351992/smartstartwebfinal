import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, 
  Zap, 
  Code2, 
  Bot, 
  Sparkles, 
  Usb, 
  CheckCircle2, 
  ArrowLeft, 
  Play, 
  Pause, 
  Users, 
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Layers,
  ShieldCheck,
  Compass,
  GraduationCap,
  Award
} from 'lucide-react';
import { TURTLE_HERO, SMARTHOUSE_HERO, CAR_4WD_HERO } from './projectImages';
import './LandingPage.css';

// 🖼️ High-Res Custom Background Assets
const BG_MAIN = encodeURI('/bg_header.jpg');
const BG_TRACKS = encodeURI('/bg_cards.jpg');

// 🎬 Dynamic Multi-Robot & Smart Home Video Showcase Data
const HERO_VIDEOS = [
  {
    id: 'car',
    title: '🏎️ רובוט מכונית 4WD Pro',
    videoUrl: '/videos/video_4wd.mp4',
    poster: CAR_4WD_HERO
  },
  {
    id: 'turtle',
    title: '🐢 רובוט צב KS0558',
    videoUrl: '/videos/video_turtle.mp4',
    poster: TURTLE_HERO
  },
  {
    id: 'house',
    title: '🏡 בית חכם IoT',
    videoUrl: '/videos/video_house.mp4',
    poster: SMARTHOUSE_HERO
  }
];

// 🔮 Living Interactive Particle Canvas Component
function HeroParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const particleCount = Math.min(Math.floor(width / 34), 45);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2 + 1.2,
        color: i % 2 === 0 ? 'rgba(37, 99, 235, 0.45)' : 'rgba(124, 58, 237, 0.4)'
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 100) {
          const force = (100 - mDist) / 100;
          p.x -= (mdx / mDist) * force * 1.5;
          p.y -= (mdy / mDist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-particle-bg" />;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  // Selected track for details modal (NO direct entry to course from landing page)
  const [selectedTrackModal, setSelectedTrackModal] = useState(null);

  // Auto-scrolling showcase slider
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Check if student or teacher already logged in
  const studentSession = localStorage.getItem('smartstart_student_session');
  const userSession = sessionStorage.getItem('smartstart_user') || sessionStorage.getItem('smartstart_teacher_user');
  const isLoggedIn = !!(studentSession || userSession);

  // 🎬 Dynamic Hero Multi-Robot Video Showcase State (Silky smooth 5s rotation, NO re-render thrashing!)
  const [activeHeroVideoIndex, setActiveHeroVideoIndex] = useState(0);
  const heroVideoRefs = useRef([]);

  // Auto-switch between robot & smart home videos every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroVideoIndex((current) => (current + 1) % HERO_VIDEOS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Ensure active video plays from beginning and inactive videos pause (saving GPU & memory)
  useEffect(() => {
    heroVideoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeHeroVideoIndex) {
        try {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } catch (e) {
          // ignore
        }
      } else {
        try {
          vid.pause();
        } catch (e) {
          // ignore
        }
      }
    });
  }, [activeHeroVideoIndex]);

  // Spring Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(
      '.scroll-reveal-left, .scroll-reveal-up'
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const tracksData = [
    {
      id: 'car',
      title: 'רובוט מכונית 4WD Pro',
      subtitle: 'ערכת הדגל של Freenove ESP32',
      tag: 'רובוטיקה ובינה מלאכותית',
      color: '#4f46e5',
      accentBg: '#eef2ff',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
      img: CAR_4WD_HERO,
      description: 'רכב 4x4 עוצמתי עם מנועי סרוו דו-ציריים, שידור וידאו חי ממצלמת Wi-Fi, ואלגוריתמים אוטונומיים לעקיפת מכשולים ומעקב קו.',
      stats: { steps: '25 שלבים', board: 'ESP32 Dual-Core', age: 'גילאי 10-18' },
      highlights: [
        'שידור וידאו חי ממצלמת Wi-Fi לדפדפן',
        'מנוע סרוו Pan-Tilt לתנועת מצלמה מלאה',
        'מעקב קו חכם ואלגוריתם עקיפת מכשולים',
        'שליטה מלאה מאפליקציה ודפדפן'
      ],
      kitComponents: [
        'בקר ESP32 WROVER עם Wi-Fi ו-Bluetooth',
        'מצלמת וידאו OV2640 מובנית',
        'שלדת אלומיניום 4WD עם 4 מנועי DC חזקים',
        'חיישן מעקב קו אופטי 3 ערוצים',
        'חיישן מרחק אולטרסוניק עם תאורת RGB',
        'מנועי סרוו וכבלי חיבור מהיר ללא הלחמות'
      ]
    },
    {
      id: 'house',
      title: 'בית חכם IoT אוטונומי',
      subtitle: 'ערכת Keyestudio KS5009 ESP32',
      tag: 'אינטרנט של הדברים וחיישנים',
      color: '#e11d48',
      accentBg: '#fff1f2',
      gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      img: SMARTHOUSE_HERO,
      description: 'בניית בית חכם מעץ עם 13 חיישנים ומודולים: בקרת אקלים, חיישני גז ועשן, מנועי סרוו לפתיחת דלת וחלון, קורא RFID וענן IoT.',
      stats: { steps: '20 שלבים', board: 'ESP32 IoT Board', age: 'גילאי 9-18' },
      highlights: [
        '13 חיישנים ומודולים מתקדמים',
        'בקרת כניסה מאובטחת בכרטיסי RFID וסרוו',
        'מסך LCD1602 להצגת נתוני אקלים',
        'התראות בטיחות בזמן אמת ותקשורת ענן'
      ],
      kitComponents: [
        'לוח פיתוח ESP32 Plus ייעודי לחיישנים',
        'מבנה עץ איכותי בחיתוך לייזר מדויק',
        'קורא כרטיסים RFID RC522 וצ׳יפ מפתח',
        'חיישני טמפרטורה, לחות, גז MQ-2 ואש',
        'מנוע סרוו לדלת, מאוורר וזמזם התראה',
        'מסך תצוגה LCD1602 עם מתאם I2C'
      ]
    },
    {
      id: 'turtle',
      title: 'רובוט צב חכם Smart Turtle',
      subtitle: 'ערכת Keyestudio KS0558 V3.0',
      tag: 'רובוטיקה ניידת וניווט',
      color: '#ea580c',
      accentBg: '#fff7ed',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      img: TURTLE_HERO,
      description: 'הרכבה מכאנית של שלדת הצב החכם, תכנות מטריצת לדים מונפשת 8x8 להבעות פנים, ניווט חכם עם חיישן מרחק אולטרסוניק ושלט רחוק.',
      stats: { steps: '16 שלבים', board: 'Arduino V3 Plus', age: 'גילאי 8-16' },
      highlights: [
        'מטריצת לדים 8x8 להנפשת הבעות פנים וציורים',
        'חיישן אולטרסוניק "עיניים חכמות" למניעת התנגשות',
        'שליטה מרחוק בשלט אינפרא-אדום ו-Bluetooth',
        'מעקב אחר פסי אור וקווים שחורים'
      ],
      kitComponents: [
        'בקר Keyestudio V3 Plus תואם Arduino',
        'לוח הרחבה ייעודי לחיבור מנועים וחיישנים',
        'מטריצת לדים 8x8 Dot Matrix אדומה',
        'חיישן מרחק אולטרסוניק בעיצוב עיניים',
        'שלט רחוק IR, מקלט וחיישני מעקב קו',
        'שלדת אקריליק חזקה ומנועי גיר עם גלגלים'
      ]
    },
    {
      id: 'genai',
      title: 'GenAI, עיצוב ואפליקציות Web',
      subtitle: 'מסע של 30 מפגשים ביצירה דיגיטלית',
      tag: 'בינה מלאכותית, עיצוב וקוד',
      color: '#0284c7',
      accentBg: '#f0f9ff',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      img: '/genai_course/assets/home-background-original.png',
      description: '30 מפגשים חווייתיים: עיצוב ומיתוג ב-Canva, גרפיקה תלת-ממדית, הנחיית מודלי AI (פרומפטים), ועד פיתוח אתרים ואפליקציות ב-HTML/CSS.',
      stats: { steps: '30 מפגשים', board: 'HTML / CSS / Canva', age: 'לכל הגילאים' },
      highlights: [
        'עיצוב מיתוג וסושיאל מקצועי ב-Canva',
        'הנחיית מודלי AI מתקדמים (Gemini)',
        'פיתוח אתרים ואפליקציות בבלוקים ובקוד חי',
        'פרויקט גמר: אתר אישי באוויר'
      ],
      kitComponents: [
        'גישה לסביבת WebBlocks Studio לפיתוח אתרים בבלוקים',
        'עורך קוד מקצועי Monaco Editor עם תצוגה חיה',
        'ערכות נכסים גרפיים, תבניות מיתוג ופריסטים מעודכנים',
        'סוכן AI מובנה לסיוע בכתיבת קוד ורעיונות'
      ]
    }
  ];

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTrackIndex((prev) => (prev + 1) % tracksData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, tracksData.length]);



  const faqs = [
    {
      q: 'האם נדרש ידע מוקדם בתכנות או באלקטרוניקה?',
      a: 'ממש לא. כל המסלולים בנויים בשיטה מדורגת וברורה: מתחילים מהרכבה פיזית מהנה לפי שרטוטים, ממשיכים בתכנות בבלוקים צבעוניים בעברית, ומתקדמים לקוד C++ אמיתי.'
    },
    {
      q: 'האם צריך להתקין תוכנות או דרייברים במחשב?',
      a: 'אפס התקנות! הכל פועל ישירות מתוך הדפדפן (Chrome / Edge). הודות לטכנולוגיית Web Serial API, מחברים כבל USB וצורבים את הקוד לבקר בלחיצת כפתור אחת.'
    },
    {
      q: 'איזה מחשב נדרש כדי להשתמש במערכת?',
      a: 'כל מחשב רגיל (Windows, Mac, Chromebook) עם חיבור USB ודפדפן מודרני. אין צורך במחשב גיימינג או בכרטיס מסך מיוחד.'
    },
    {
      q: 'כיצד מורים ובתי ספר יכולים להשתמש בפלטפורמה?',
      a: 'למורים יש מרחב ניהול ייעודי: יצירת כיתות בלחיצת כפתור, הנפקת קודי כניסה מהירים לתלמידים ללא צורך במיילים, מעקב התקדמות בלייב ובדיקת הגשות אוטומטית.'
    }
  ];

  const currentTrack = tracksData[activeTrackIndex];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(248, 250, 252, 0.45) 100%), url(${BG_MAIN})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      color: '#0f172a',
      direction: 'rtl',
      fontFamily: 'var(--font-main)',
      overflowX: 'hidden',
      position: 'relative'
    }}>

      {/* 🔮 Soft Aurora Mesh Lights */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="aurora-glow-1" style={{ position: 'absolute', top: '-15%', right: '-10%', width: '750px', height: '750px' }} />
        <div className="aurora-glow-2" style={{ position: 'absolute', top: '35%', left: '-12%', width: '800px', height: '800px' }} />
      </div>

      {/* ========================================================
          1. TRANSLUCENT FROSTED GLASS NAVBAR (PROMINENT LARGE LOGO)
      ======================================================== */}
      <div style={{ padding: '16px 20px 0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <header className="floating-glass-nav">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            flexWrap: 'wrap'
          }}>
            {/* 🌟 Significantly Enlarged, Clear Official Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
              <div style={{
                width: '78px',
                height: '78px',
                borderRadius: '22px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.18)',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                flexShrink: 0
              }}>
                <img 
                  src="/logo_icon.png" 
                  alt="SmartStart IoT" 
                  style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(37, 99, 235, 0.22))' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.4px', display: 'block', lineHeight: 1.1 }}>
                  SmartStart<span style={{ color: '#2563eb' }}> IoT</span>
                </span>
                <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '700', letterSpacing: '0.4px' }}>
                  FUTURE ROBOTICS & AI LEADERS
                </span>
              </div>
            </Link>

            {/* Clean Navigation Links with Icons */}
            <nav style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '0.96rem',
              fontWeight: '600'
            }}>
              <a href="#tracks" style={{ color: '#334155', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={17} color="#2563eb" />
                <span>המסלולים</span>
              </a>
              <a href="#features" style={{ color: '#334155', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={17} color="#f59e0b" />
                <span>יתרונות המערכת</span>
              </a>
              <a href="#schools" style={{ color: '#334155', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={17} color="#10b981" />
                <span>לבתי ספר ומורים</span>
              </a>
              <a href="#faq" style={{ color: '#334155', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={17} color="#8b5cf6" />
                <span>שאלות ותשובות</span>
              </a>
            </nav>

            {/* Action CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/login?tab=student')}
                className="btn-glass-code"
                title="כניסה מהירה לתלמידים עם קוד כיתה"
              >
                <Users size={16} color="#4f46e5" />
                <span>כניסה עם קוד כיתה</span>
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/tracks')}
                  className="btn-primary-tech"
                  style={{
                    padding: '10px 22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>למרחב הלמידה</span>
                  <ArrowLeft size={16} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login?tab=login')}
                  className="btn-primary-tech"
                  style={{
                    padding: '10px 22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>התחברות / הרשמה</span>
                  <ArrowLeft size={16} />
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* ========================================================
          2. HIGH-IMPACT HERO: PURE 3D ROBOT & SHEER GLASS
          (NO telemetry box, NO opaque white boxes)
      ======================================================== */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '30px 20px 24px',
        overflow: 'hidden'
      }}>
        {/* Living interactive particle stream */}
        <HeroParticleCanvas />

        <div style={{
          maxWidth: '1180px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px',
          position: 'relative',
          zIndex: 2
        }}>

          {/* Top Card: Hero Pitch & Sales Value (Centered, Luxurious Sheer Glass Card) */}
          <div className="sheer-glass-card" style={{
            width: '100%',
            padding: '42px 48px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Luminous High-Tech Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 20px',
              borderRadius: '30px',
              background: 'rgba(238, 242, 255, 0.9)',
              border: '1px solid rgba(199, 210, 254, 0.95)',
              color: '#3730a3',
              fontSize: '0.88rem',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span>הפלטפורמה המעשית המובילה לרובוטיקה, IoT ו-AI</span>
              <Sparkles size={16} color="#7c3aed" />
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
              fontWeight: '900',
              lineHeight: '1.16',
              margin: '0 0 18px 0',
              color: '#0f172a',
              letterSpacing: '-0.8px',
              maxWidth: '850px'
            }}>
              ממציאים, בונים ומקודדים. <br />
              <span style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #db2777 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                הכל מהדפדפן – באפס התקנות.
              </span>
            </h1>

            {/* Concise Sales Value Proposition */}
            <p style={{
              fontSize: 'clamp(1.05rem, 1.4vw, 1.22rem)',
              color: '#334155',
              maxWidth: '720px',
              lineHeight: '1.65',
              margin: '0 auto 30px',
              fontWeight: '500'
            }}>
              חיבור ישיר של בקרי <strong>ESP32 ב-USB (Web Serial)</strong>, סביבת תכנות ויזואלית בבלוקים עם תרגום C++ חי בזמן אמת, וערכות רובוטיקה פיזיות המגיעות עד הכיתה והבית.
            </p>

            {/* Primary Action CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <button
                onClick={() => navigate(isLoggedIn ? '/tracks' : '/login?tab=student')}
                className="btn-primary-tech"
                style={{
                  padding: '16px 36px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '1rem'
                }}
              >
                <span>🚀 התחילו ללמוד עכשיו</span>
                <ArrowLeft size={18} />
              </button>

              <a
                href="#tracks"
                className="btn-secondary-tech"
                style={{
                  padding: '16px 28px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem'
                }}
              >
                <Compass size={18} color="#2563eb" />
                <span>גלו את 4 מסלולי הדגל</span>
              </a>
            </div>

            {/* Trust Metrics Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              paddingTop: '22px',
              borderTop: '1px solid rgba(226, 232, 240, 0.9)',
              color: '#334155',
              fontSize: '0.92rem',
              fontWeight: '600',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>צריבה ישירה מהדפדפן ב-USB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>סנכרון בלוקים ו-C++ חי</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>בקרי ESP32 ו-Arduino מקוריים</span>
              </div>
            </div>
          </div>

          {/* Cinematic Centerpiece Video Showcase (Full 16:9, Complete Video, No Clipping) */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Video Selector Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              {HERO_VIDEOS.map((vid, idx) => (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => setActiveHeroVideoIndex(idx)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    background: idx === activeHeroVideoIndex ? '#2563eb' : 'rgba(255, 255, 255, 0.9)',
                    color: idx === activeHeroVideoIndex ? '#ffffff' : '#334155',
                    border: idx === activeHeroVideoIndex ? '1.5px solid #2563eb' : '1.5px solid rgba(226, 232, 240, 0.95)',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: idx === activeHeroVideoIndex ? '0 4px 14px rgba(37, 99, 235, 0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {vid.title}
                </button>
              ))}
            </div>

            {/* 16:9 Video Canvas */}
            <div className="hero-video-showcase">
              {/* Stacked Hardware-Accelerated Local H.264 Videos with Opacity Crossfade */}
              {HERO_VIDEOS.map((vid, idx) => (
                <video
                  key={vid.id}
                  ref={(el) => (heroVideoRefs.current[idx] = el)}
                  src={vid.videoUrl}
                  poster={vid.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  className={`hero-video-item ${idx === activeHeroVideoIndex ? 'is-active' : ''}`}
                />
              ))}

              {/* Minimalist Navigation Dots (Clickable) */}
              <div className="hero-video-dots">
                {HERO_VIDEOS.map((vid, idx) => (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => setActiveHeroVideoIndex(idx)}
                    className={`hero-video-dot ${idx === activeHeroVideoIndex ? 'is-active' : ''}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. SCROLL REVEAL SECTION: HIGH-TECH BENTO GRID
      ======================================================== */}
      <section id="features" className="scroll-reveal-left" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1360px',
        margin: '40px auto 70px',
        padding: '0 24px'
      }}>
          {/* Header - Sheer Glass Card */}
        <div className="sheer-glass-card" style={{
          textAlign: 'center',
          maxWidth: '780px',
          margin: '0 auto 36px',
          padding: '24px 32px'
        }}>
          <span style={{ fontSize: '0.86rem', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            ארכיטקטורת הדור הבא
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: '900', margin: '6px 0 10px 0', color: '#0f172a' }}>
            למה מובילי ה-STEM בוחרים ב-SmartStart?
          </h2>
          <p style={{ color: '#334155', fontSize: '1.08rem', margin: 0, lineHeight: '1.65', fontWeight: '600' }}>
            מערכת הנדסית שלמה שתוכננה להסיר את כל המכשולים הטכניים ולהתמקד בהמצאה ויצירה נטו.
          </p>
        </div>

        {/* Bento Grid (Sheer Glass Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>

          {/* Bento Tile 1: Web Serial USB (Wide 7 cols) */}
          <div className="bento-card stagger-1" style={{ gridColumn: 'span 7', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Usb size={26} color="#2563eb" />
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.78rem', fontWeight: '700', padding: '4px 14px', borderRadius: '20px' }}>
                Web Serial API
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>
              צריבה ישירה מהדפדפן ב-USB ללא שום התקנה
            </h3>
            <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: '1.65', margin: 0, maxWidth: '520px', fontWeight: '600' }}>
              שכחו מהתקנות כבדות של Arduino IDE, הגדרות קומפיילר או בעיות דרייברים בכיתה. חיבור כבל USB ולחיצה אחת בדפדפן כרום – והקוד רץ חי על הבקר.
            </p>
          </div>

          {/* Bento Tile 2: Dual Engine (5 cols) */}
          <div className="bento-card stagger-2" style={{ gridColumn: 'span 5', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={26} color="#7c3aed" />
              </div>
              <span style={{ background: '#f3e8ff', color: '#6b21a8', fontSize: '0.78rem', fontWeight: '700', padding: '4px 14px', borderRadius: '20px' }}>
                Live Dual-Sync
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>
              סנכרון בלוקים ↔ קוד C++ מלא
            </h3>
            <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: '1.65', margin: 0, fontWeight: '600' }}>
              תכנות ויזואלי מהנה בעברית שמתרגם בזמן אמת ל-C++ אמיתי. מאפשר מעבר חלק וטבעי מבלוקים לשפת קוד תעשייתית.
            </p>
          </div>

          {/* Bento Tile 3: AI Creator (5 cols) */}
          <div className="bento-card stagger-3" style={{ gridColumn: 'span 5', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={26} color="#10b981" />
              </div>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.78rem', fontWeight: '700', padding: '4px 14px', borderRadius: '20px' }}>
                Gemini 3.1 Pro
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>
              מחולל מסלולים ב-AI
            </h3>
            <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: '1.65', margin: 0, fontWeight: '600' }}>
              העלאת קובץ PDF או קישור לאינטרנט – וסוכן הבינה המלאכותית בונה מסלול למידה שלם ותרגילים אישיים לתלמיד.
            </p>
          </div>

          {/* Bento Tile 4: CAD & Interactive Sim (Wide 7 cols) */}
          <div className="bento-card stagger-4" style={{ gridColumn: 'span 7', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={26} color="#e11d48" />
              </div>
              <span style={{ background: '#ffe4e6', color: '#9f1239', fontSize: '0.78rem', fontWeight: '700', padding: '4px 14px', borderRadius: '20px' }}>
                CAD 3D Guide
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' }}>
              הרכבה פיזית מודרכת בתלת-ממד שלב-אחר-שלב
            </h3>
            <p style={{ color: '#334155', fontSize: '1.02rem', lineHeight: '1.65', margin: 0, maxWidth: '520px', fontWeight: '600' }}>
              דיאגרמות פירוק והרכבה מדויקות (Exploded View), רשימת ברגים ורכיבים לכל צעד, והוראות ברורות שמבטיחות 100% הצלחה בהרכבת החומרה.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. SCROLL REVEAL SECTION: 3D TRACKS SHOWCASE SLIDER
          (Includes BG_TRACKS directly inside the showcase card!)
      ======================================================== */}
      <section id="tracks" className="scroll-reveal-left" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto 80px',
        padding: '0 24px'
      }}>
        {/* Header - Sheer Glass Card */}
        <div className="sheer-glass-card" style={{
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto 32px',
          padding: '24px 32px'
        }}>
          <span style={{ fontSize: '0.86rem', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            4 מסלולי הדגל
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: '900', margin: '6px 0 10px 0', color: '#0f172a' }}>
            בחרו מסלול וצאו למסע
          </h2>
          <p style={{ color: '#334155', fontSize: '1.08rem', margin: 0, lineHeight: '1.6', fontWeight: '600' }}>
            כל מסלול כולל ערכת חומרה פיזית מלאה, סביבת תכנות בדפדפן ומדריכים מקיפים.
          </p>
        </div>

        {/* 🌟 ONE SINGLE GRAND TRACK SHOWCASE CARD (NO TOP TABS, NO BOTTOM TABS) */}
        <div
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="sheer-glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            padding: '48px 52px 56px',
            position: 'relative',
            minHeight: '480px',
            boxSizing: 'border-box'
          }}
        >
          {/* Floating Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTrackIndex((prev) => (prev === 0 ? tracksData.length - 1 : prev - 1));
            }}
            className="track-nav-btn"
            style={{ right: '16px' }}
            aria-label="Previous Track"
            title="מסלול קודם"
          >
            <ChevronRight size={26} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTrackIndex((prev) => (prev + 1) % tracksData.length);
            }}
            className="track-nav-btn"
            style={{ left: '16px' }}
            aria-label="Next Track"
            title="מסלול הבא"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Visual Showcase Stage with BG_TRACKS runway inside! */}
          <div style={{
            position: 'relative',
            height: '420px',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.5) 100%), url(${BG_TRACKS})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: 'inset 0 0 35px rgba(37, 99, 235, 0.1)'
          }}>
            <img
              src={currentTrack.img}
              alt={currentTrack.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '28px',
                boxSizing: 'border-box',
                transition: 'transform 0.4s ease'
              }}
            />
            {/* Tag Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `1.5px solid ${currentTrack.color}`,
              color: currentTrack.color,
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '0.86rem',
              fontWeight: '700',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }}>
              {currentTrack.tag}
            </div>
          </div>

          {/* Sales Content Side */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.96rem', color: currentTrack.color, fontWeight: '700', marginBottom: '8px' }}>
              {currentTrack.subtitle}
            </span>
            <h3 style={{ fontSize: 'clamp(2rem, 3vw, 2.7rem)', fontWeight: '900', margin: '0 0 16px 0', color: '#0f172a' }}>
              {currentTrack.title}
            </h3>
            <p style={{ fontSize: '1.08rem', color: '#334155', lineHeight: '1.68', margin: '0 0 24px 0', fontWeight: '600' }}>
              {currentTrack.description}
            </p>

            {/* Specs Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <span style={{ background: currentTrack.accentBg, color: currentTrack.color, padding: '7px 16px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '700' }}>
                📊 {currentTrack.stats.steps}
              </span>
              <span style={{ background: currentTrack.accentBg, color: currentTrack.color, padding: '7px 16px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '700' }}>
                ⚡ {currentTrack.stats.board}
              </span>
              <span style={{ background: currentTrack.accentBg, color: currentTrack.color, padding: '7px 16px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '700' }}>
                🎯 {currentTrack.stats.age}
              </span>
            </div>

            {/* Highlights Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '32px' }}>
              {currentTrack.highlights.map((point, pIdx) => (
                <div key={pIdx} style={{ fontSize: '0.94rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <CheckCircle2 size={18} color={currentTrack.color} />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Action Button: Opens Details Modal */}
            <button
              onClick={() => setSelectedTrackModal(currentTrack)}
              className="btn-primary-tech"
              style={{
                alignSelf: 'flex-start',
                padding: '15px 32px',
                background: currentTrack.gradient,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '1rem',
                fontWeight: '700'
              }}
            >
              <span>סילבוס ומפרט ערכה מלא 🔍</span>
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Minimalist Slide Dots Indicator at Card Bottom */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '6px 14px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            {tracksData.map((trk, idx) => (
              <button
                key={trk.id}
                type="button"
                onClick={() => setActiveTrackIndex(idx)}
                style={{
                  width: activeTrackIndex === idx ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeTrackIndex === idx ? trk.color : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
                aria-label={trk.title}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SCROLL REVEAL: FOR SCHOOLS & TEACHERS
      ======================================================== */}
      <section id="schools" className="scroll-reveal-left" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1360px',
        margin: '0 auto 70px',
        padding: '0 24px'
      }}>
        <div className="sheer-glass-card" style={{
          padding: '46px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 16px',
              borderRadius: '20px',
              background: 'rgba(224, 231, 255, 0.85)',
              color: '#3730a3',
              fontSize: '0.86rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              <GraduationCap size={16} />
              <span>פתרון שלם למערכת החינוך</span>
            </div>
            <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '900', lineHeight: '1.2', margin: '0 0 16px 0', color: '#0f172a' }}>
              מורים ורכזי STEM? <br />
              הכניסו רובוטיקה מעשית לכיתה
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', margin: '0 0 28px 0', fontWeight: '500' }}>
              דשבורד מורה לניהול כיתות, חלוקת קודי גישה מהירים ללא מיילים אישיים, מעקב התקדמות תלמידים בזמן אמת ומערכי שיעור מובנים.
            </p>
            <button
              onClick={() => navigate(isLoggedIn ? '/teacher' : '/login?tab=login')}
              className="btn-primary-tech"
              style={{
                padding: '13px 30px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>כניסה למרחב מורה וניהול כיתות</span>
              <ArrowLeft size={16} />
            </button>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '22px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: '600', fontSize: '0.94rem' }}>
              <ShieldCheck size={20} color="#2563eb" />
              <span>התחברות מהירה של תלמידים עם קוד כיתה פשוט</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: '600', fontSize: '0.94rem' }}>
              <ShieldCheck size={20} color="#2563eb" />
              <span>שליחת קוד התלמיד ישירות למורה בלחיצת כפתור לבדיקה</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: '600', fontSize: '0.94rem' }}>
              <ShieldCheck size={20} color="#2563eb" />
              <span>אפס תקלות התקנה: צריבה ישירה ב-USB ללא שום דרייברים</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', fontWeight: '600', fontSize: '0.94rem' }}>
              <ShieldCheck size={20} color="#2563eb" />
              <span>תמיכה פדגוגית מלאה ומערכי שיעור מותאמים לכיתה</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. CLEAN FAQ ACCORDION (SHEER GLASS)
      ======================================================== */}
      <section id="faq" className="scroll-reveal-up" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '880px',
        margin: '0 auto 70px',
        padding: '0 24px'
      }}>
        <div className="sheer-glass-card" style={{
          textAlign: 'center',
          maxWidth: '520px',
          margin: '0 auto 30px',
          padding: '18px 24px'
        }}>
          <span style={{ fontSize: '0.86rem', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            שאלות ותשובות
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)', fontWeight: '900', margin: '4px 0 0 0', color: '#0f172a' }}>
            כל מה שחשוב לדעת
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="sheer-glass-card"
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    textAlign: 'right',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'inherit'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color="#2563eb"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease'
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 24px 22px 24px',
                    color: '#475569',
                    fontSize: '0.98rem',
                    lineHeight: '1.7',
                    borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                    paddingTop: '16px',
                    fontWeight: '500'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          7. BOTTOM SALES CTA BANNER
      ======================================================== */}
      <section className="scroll-reveal-up" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1240px',
        margin: '0 auto 70px',
        padding: '0 24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '54px 40px',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
          color: '#ffffff'
        }}>
          <h2 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', fontWeight: '900', margin: '0 0 16px 0' }}>
            מוכנים להפוך ליוצרי העתיד?
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '640px', margin: '0 auto 32px', lineHeight: '1.7', fontWeight: '500' }}>
            הצטרפו לאלפי תלמידים, מורים ומייקרים שכבר בונים, מתכנתים וממציאים עם SmartStart IoT.
          </p>
          <button
            onClick={() => navigate(isLoggedIn ? '/tracks' : '/register')}
            style={{
              padding: '17px 44px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              fontFamily: 'var(--font-main)',
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.45)',
              transition: 'all 0.25s ease'
            }}
          >
            🚀 התחילו עכשיו ללא עלות
          </button>
        </div>
      </section>

      {/* ========================================================
          8. CLEAN BRIGHT FOOTER
      ======================================================== */}
      <footer style={{
        borderTop: '1px solid rgba(226, 232, 240, 0.7)',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '38px 24px 28px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '26px'
        }}>
          {/* Logo & Slogan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#ffffff',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <img src="/logo_icon.png" alt="SmartStart IoT" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>SmartStart IoT</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>פלטפורמת הלמידה וההרכבה האינטראקטיבית</div>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '24px', fontSize: '0.94rem', color: '#475569', fontWeight: '600' }}>
            <a href="#tracks" style={{ color: 'inherit', textDecoration: 'none' }}>המסלולים</a>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>יתרונות המערכת</a>
            <a href="#schools" style={{ color: 'inherit', textDecoration: 'none' }}>מרחב מורה</a>
            <a href="#faq" style={{ color: 'inherit', textDecoration: 'none' }}>שאלות ותשובות</a>
            <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>כניסה למערכת</Link>
          </div>
        </div>

        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          textAlign: 'center',
          fontSize: '0.84rem',
          color: '#94a3b8',
          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
          paddingTop: '20px'
        }}>
          © {new Date().getFullYear()} SmartStart IoT. כל הזכויות שמורות.
        </div>
      </footer>

      {/* ========================================================
          🔍 TRACK DETAILS & SYLLABUS MODAL (NO DIRECT COURSE ENTRY)
      ======================================================== */}
      {selectedTrackModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(28px)',
            borderRadius: '28px',
            padding: '36px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={() => setSelectedTrackModal(null)}
              style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#475569',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}
            >
              ✕
            </button>

            {/* Header with image */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              <img
                src={selectedTrackModal.img}
                alt={selectedTrackModal.title}
                style={{
                  width: '120px',
                  height: '90px',
                  borderRadius: '16px',
                  objectFit: 'contain',
                  background: selectedTrackModal.accentBg,
                  padding: '8px'
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: '10px',
                  background: selectedTrackModal.accentBg,
                  color: selectedTrackModal.color
                }}>
                  {selectedTrackModal.tag}
                </span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {selectedTrackModal.title}
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: '600' }}>
                  {selectedTrackModal.subtitle}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.65', marginBottom: '22px', fontWeight: '500' }}>
              {selectedTrackModal.description}
            </p>

            {/* Hardware Components Section */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.12rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color={selectedTrackModal.color} />
                <span>מה כוללת ערכת החומרה הפיזית?</span>
              </h4>
              <div style={{
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '18px',
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {selectedTrackModal.kitComponents.map((comp, cIdx) => (
                  <div key={cIdx} style={{ fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                    <span style={{ color: selectedTrackModal.color, fontWeight: '900' }}>•</span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons inside Modal */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <button
                onClick={() => {
                  setSelectedTrackModal(null);
                  navigate('/login?tab=register');
                }}
                className="btn-primary-tech"
                style={{
                  flex: 1,
                  padding: '14px',
                  background: selectedTrackModal.gradient
                }}
              >
                🚀 להרשמה והצטרפות למסלול זה
              </button>

              <button
                onClick={() => {
                  setSelectedTrackModal(null);
                  navigate('/login?tab=student');
                }}
                className="btn-secondary-tech"
                style={{
                  padding: '14px 24px'
                }}
              >
                🎓 כניסה עם קוד כיתה
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
