/**
 * 🎨 VISUAL STYLING & THEMING AGENT (סוכן עיצוב ויזואלי ומיתוג)
 * Generates bespoke color palettes, glowing gradients, icons, and theme badges for any subject.
 */

const THEME_PALETTES = {
  science: [
    { gradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)', glow: '0 8px 32px rgba(2, 132, 199, 0.35)', accent: '#0284c7', icon: '🔬', badge: 'מדע וחלל 🚀' },
    { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)', glow: '0 8px 32px rgba(99, 102, 241, 0.35)', accent: '#6366f1', icon: '🌌', badge: 'אסטרונומיה עמוקה 🪐' },
    { gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)', glow: '0 8px 32px rgba(5, 150, 105, 0.35)', accent: '#059669', icon: '🧬', badge: 'ביולוגיה ורפואה 🌿' }
  ],
  business: [
    { gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #f59e0b 100%)', glow: '0 8px 32px rgba(217, 119, 6, 0.35)', accent: '#d97706', icon: '💼', badge: 'יזמות וסטארט-אפ 💡' },
    { gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%)', glow: '0 8px 32px rgba(59, 130, 246, 0.35)', accent: '#2563eb', icon: '📈', badge: 'צמיחה ושיווק 🚀' }
  ],
  design: [
    { gradient: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #f472b6 100%)', glow: '0 8px 32px rgba(219, 39, 119, 0.35)', accent: '#db2777', icon: '🎨', badge: 'קריאייטיב ו-UI/UX ✨' },
    { gradient: 'linear-gradient(135deg, #4c0519 0%, #e11d48 50%, #fb7185 100%)', glow: '0 8px 32px rgba(225, 29, 72, 0.35)', accent: '#e11d48', icon: '✨', badge: 'עיצוב ומיתוג 🌟' }
  ],
  software: [
    { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)', glow: '0 8px 32px rgba(67, 56, 202, 0.35)', accent: '#4f46e5', icon: '💻', badge: 'פיתוח תוכנה ו-AI ⚡' },
    { gradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #06b6d4 100%)', glow: '0 8px 32px rgba(6, 182, 212, 0.35)', accent: '#0284c7', icon: '🐍', badge: 'Python & Data 🧠' }
  ],
  robotics: [
    { gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)', glow: '0 8px 32px rgba(5, 150, 105, 0.35)', accent: '#059669', icon: '🤖', badge: 'רובוטיקה ו-IoT 🏎️' },
    { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #2563eb 50%, #38bdf8 100%)', glow: '0 8px 32px rgba(37, 99, 235, 0.35)', accent: '#2563eb', icon: '⚙️', badge: 'הנדסה ואלקטרוניקה 🔌' }
  ],
  polymath: [
    { gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)', glow: '0 8px 32px rgba(124, 58, 237, 0.35)', accent: '#7c3aed', icon: '🌍', badge: 'מסלול חקר אוניברסלי 🌐' },
    { gradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #2dd4bf 100%)', glow: '0 8px 32px rgba(13, 148, 136, 0.35)', accent: '#0d9488', icon: '🌱', badge: 'קיימות ומדע יישומי 🌏' }
  ]
};

function generateThemeForTrack(domainId = 'polymath', title = '', customKeywords = []) {
  const domainKey = THEME_PALETTES[domainId] ? domainId : 'polymath';
  const options = THEME_PALETTES[domainKey];
  
  // Pick deterministic palette based on title hash for consistency
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const selected = options[Math.abs(hash) % options.length];

  return {
    domain: domainKey,
    gradient: selected.gradient,
    glow: selected.glow,
    accentColor: selected.accent,
    icon: selected.icon,
    badge: selected.badge,
    badges: [selected.badge, 'מסלול מודרך', 'פרויקט מעשי']
  };
}

module.exports = {
  generateThemeForTrack,
  THEME_PALETTES
};
