import React, { useState, useEffect } from 'react';
import { getBlockProp } from './webBlocksDefinitions';

// =========================================================================
// 🎨 CONTEXT-AWARE SMART DESIGN STUDIO (WITH FULL RICH TEXT & ACTION BUTTON)
// =========================================================================

// Element category definitions and their permitted design tabs
const ELEMENT_CONFIG = {
  // 1. TYPOGRAPHY (Headings, Paragraphs, Badges, Bullet items, Links)
  web_heading: {
    name: 'כותרת',
    icon: '✍️',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_paragraph: {
    name: 'פסקת טקסט',
    icon: '📝',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_badge: {
    name: 'תגית מעוצבת',
    icon: '🏷️',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },
  web_bullet_item: {
    name: 'פריט ברשימה',
    icon: '✅',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_link: {
    name: 'קישור אינטרנט',
    icon: '🔗',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  html_text: {
    name: 'טקסט פשוט',
    icon: '📝',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'effects'],
    defaultTab: 'content'
  },

  // 2. BUTTONS & ACTIONS (With Full Text & Action Styling)
  web_button_with_actions: {
    name: 'כפתור עם פעולות',
    icon: '🔘',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_action_button: {
    name: 'כפתור פעולה חכם',
    icon: '🔘',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_button: {
    name: 'כפתור פעולה',
    icon: '🔘',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_button_link: {
    name: 'כפתור מעבר עמוד',
    icon: '🔗',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_whatsapp_button: {
    name: 'כפתור וואטסאפ',
    icon: '💬',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_call_button: {
    name: 'כפתור חיוג',
    icon: '📞',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_action_change_bg: {
    name: 'כפתור החלפת רקע',
    icon: '⚡',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  html_button: {
    name: 'כפתור',
    icon: '🔘',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },

  // 3. MEDIA & IMAGES
  web_image: {
    name: 'תמונה',
    icon: '🖼️',
    allowedTabs: ['content', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },
  web_video_embed: {
    name: 'סרטון יוטיוב',
    icon: '🎬',
    allowedTabs: ['content', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },

  // 4. STRUCTURE & CONTAINERS (Cards, Flexbox, Main Page)
  web_card: {
    name: 'כרטיסייה מעוצבת',
    icon: '📦',
    allowedTabs: ['colors', 'dimensions', 'borders', 'layout', 'effects'],
    defaultTab: 'colors'
  },
  web_row_flex: {
    name: 'תיבת פריסה (Flexbox)',
    icon: '📐',
    allowedTabs: ['layout', 'dimensions', 'colors', 'borders', 'effects'],
    defaultTab: 'layout'
  },
  web_page_container: {
    name: 'דף ראשי',
    icon: '📄',
    allowedTabs: ['colors', 'text', 'dimensions', 'layout'],
    defaultTab: 'colors'
  },

  // 5. NAVIGATIONS & FOOTERS
  web_navbar: {
    name: 'סרגל ניווט',
    icon: '🧭',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'effects'],
    defaultTab: 'content'
  },
  web_navbar_custom: {
    name: 'סרגל מותאם אישית',
    icon: '🧭',
    allowedTabs: ['colors', 'layout', 'dimensions', 'borders', 'effects'],
    defaultTab: 'colors'
  },
  web_footer: {
    name: 'חלק תחתון (פוטר)',
    icon: '🦶',
    allowedTabs: ['content', 'text', 'colors', 'dimensions'],
    defaultTab: 'content'
  },

  // 6. FORMS, INPUTS & OUTPUTS
  web_form: {
    name: 'טופס אינטראקטיבי',
    icon: '📋',
    allowedTabs: ['content', 'colors', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },
  web_input_field: {
    name: 'שדה קלט',
    icon: '🔤',
    allowedTabs: ['content', 'text', 'dimensions', 'borders', 'colors'],
    defaultTab: 'content'
  },
  web_input_with_button: {
    name: 'שדה קלט + כפתור',
    icon: '🔤',
    allowedTabs: ['content', 'text', 'dimensions', 'borders', 'colors', 'effects'],
    defaultTab: 'content'
  },
  web_textarea: {
    name: 'תיבת הודעה',
    icon: '📝',
    allowedTabs: ['content', 'text', 'dimensions', 'borders', 'colors'],
    defaultTab: 'content'
  },
  web_dropdown_select: {
    name: 'תפריט בחירה',
    icon: '🔽',
    allowedTabs: ['content', 'text', 'dimensions', 'borders', 'colors'],
    defaultTab: 'content'
  },
  web_checkbox: {
    name: 'תיבת סימון',
    icon: '☑️',
    allowedTabs: ['content', 'text', 'colors', 'dimensions'],
    defaultTab: 'content'
  },
  web_slider_input: {
    name: 'סליידר מספר',
    icon: '🎚️',
    allowedTabs: ['content', 'colors', 'dimensions'],
    defaultTab: 'content'
  },
  web_color_picker_input: {
    name: 'דוגם צבע',
    icon: '🎨',
    allowedTabs: ['content', 'colors', 'dimensions'],
    defaultTab: 'content'
  },
  web_submit_button: {
    name: 'כפתור שליחת טופס',
    icon: '🚀',
    allowedTabs: ['content', 'text', 'colors', 'borders', 'dimensions', 'effects'],
    defaultTab: 'content'
  },
  web_output_box: {
    name: 'אזור הצגת פלט',
    icon: '📤',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },
  web_text_output_label: {
    name: 'תווית הצגת פלט',
    icon: '📤',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },
  web_stat_counter: {
    name: 'מונה נתונים',
    icon: '📊',
    allowedTabs: ['content', 'text', 'colors', 'dimensions', 'borders', 'effects'],
    defaultTab: 'content'
  },
  html_input: {
    name: 'שדה קלט',
    icon: '📥',
    allowedTabs: ['content', 'text', 'dimensions', 'borders', 'colors'],
    defaultTab: 'content'
  },

  // 7. DIVIDERS & SPACERS
  web_divider: {
    name: 'קו מפריד',
    icon: '➖',
    allowedTabs: ['colors', 'dimensions'],
    defaultTab: 'colors'
  },
  web_spacer: {
    name: 'מרווח גובה',
    icon: '↕️',
    allowedTabs: ['dimensions'],
    defaultTab: 'dimensions'
  },
  web_custom_html: {
    name: 'קוד מותאם',
    icon: '💻',
    allowedTabs: ['content', 'dimensions', 'colors'],
    defaultTab: 'content'
  }
};

// All available tab definitions
const ALL_TABS = {
  content: { id: 'content', label: 'תוכן', icon: '📝' },
  text: { id: 'text', label: 'גופן', icon: '✍️' },
  colors: { id: 'colors', label: 'צבעים', icon: '🎨' },
  dimensions: { id: 'dimensions', label: 'מידות', icon: '📐' },
  borders: { id: 'borders', label: 'פינות', icon: '⭕' },
  effects: { id: 'effects', label: 'אפקטים', icon: '✨' },
  layout: { id: 'layout', label: 'סידור', icon: '🗂️' }
};

// Standard crisp Hebrew font
const STANDARD_FONT = "Arial, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif";

export default function WebBlockDesignPanel({ selectedBlock, onUpdateField, onBackToToolbox }) {
  const blockType = selectedBlock ? selectedBlock.type : null;
  const config = (blockType && ELEMENT_CONFIG[blockType]) ? ELEMENT_CONFIG[blockType] : {
    name: blockType || 'אלמנט',
    icon: '🎨',
    allowedTabs: ['colors', 'dimensions', 'effects'],
    defaultTab: 'colors'
  };

  // Active design tab
  const [activeTab, setActiveTab] = useState(config.defaultTab || 'colors');

  // Custom Gradient Builder internal states
  const [gradientColor1, setGradientColor1] = useState('#2563eb');
  const [gradientColor2, setGradientColor2] = useState('#9333ea');
  const [gradientAngle, setGradientAngle] = useState('135deg');

  // When selected block changes, switch to a valid allowed tab
  useEffect(() => {
    if (config.allowedTabs && !config.allowedTabs.includes(activeTab)) {
      setActiveTab(config.defaultTab || config.allowedTabs[0] || 'colors');
    }
  }, [blockType]);

  if (!selectedBlock) {
    return (
      <div style={{ padding: '50px 24px', textAlign: 'center', color: '#64748b', direction: 'rtl', fontFamily: STANDARD_FONT }}>
        <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🎯</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px', fontFamily: STANDARD_FONT }}>
          לא נבחר אלמנט
        </h3>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#64748b', maxWidth: '280px', margin: '0 auto', fontFamily: STANDARD_FONT }}>
          לחץ על כל בלוק במשטח כדי לעצב אותו בקלות!
        </p>
      </div>
    );
  }

  // Current values
  const currentBg = getBlockProp(selectedBlock, 'BG_COLOR', '#ffffff');
  const currentGradient = getBlockProp(selectedBlock, 'GRADIENT', 'none');
  const currentBgImage = getBlockProp(selectedBlock, 'BG_IMAGE', '');
  const currentBgSize = getBlockProp(selectedBlock, 'BG_SIZE', 'cover');
  const currentBgPosition = getBlockProp(selectedBlock, 'BG_POSITION', 'center');
  const currentBgRepeat = getBlockProp(selectedBlock, 'BG_REPEAT', 'no-repeat');
  const currentTextColor = getBlockProp(selectedBlock, 'TEXT_COLOR') || getBlockProp(selectedBlock, 'COLOR', '#0f172a');
  const currentOpacity = getBlockProp(selectedBlock, 'OPACITY', '1');

  // Typography (Full Suite)
  const currentFont = getBlockProp(selectedBlock, 'FONT') || getBlockProp(selectedBlock, 'FONT_FAMILY', 'Arial, sans-serif');
  const currentFontSize = getBlockProp(selectedBlock, 'FONT_SIZE') || getBlockProp(selectedBlock, 'SIZE', '16px');
  const currentFontWeight = getBlockProp(selectedBlock, 'FONT_WEIGHT', '400');
  const currentFontStyle = getBlockProp(selectedBlock, 'FONT_STYLE', 'normal');
  const currentAlign = getBlockProp(selectedBlock, 'ALIGN') || getBlockProp(selectedBlock, 'TEXT_ALIGN', 'right');
  const currentTextDecoration = getBlockProp(selectedBlock, 'TEXT_DECORATION', 'none');
  const currentLineHeight = getBlockProp(selectedBlock, 'LINE_HEIGHT', '1.6');
  const currentLetterSpacing = getBlockProp(selectedBlock, 'LETTER_SPACING', '0px');

  // Dimensions & Spacing
  const currentWidth = getBlockProp(selectedBlock, 'WIDTH', '100%');
  const currentHeight = getBlockProp(selectedBlock, 'HEIGHT', 'auto');
  const currentPadding = getBlockProp(selectedBlock, 'PADDING', '16px');
  const currentMargin = getBlockProp(selectedBlock, 'MARGIN', '0px');

  // Borders & Radius
  const currentRadius = getBlockProp(selectedBlock, 'RADIUS') || getBlockProp(selectedBlock, 'BORDER_RADIUS', '8px');
  const currentBorderWidth = getBlockProp(selectedBlock, 'BORDER_WIDTH', '0px');
  const currentBorderStyle = getBlockProp(selectedBlock, 'BORDER_STYLE', 'solid');
  const currentBorderColor = getBlockProp(selectedBlock, 'BORDER_COLOR', '#cbd5e1');

  // Effects, Sliders & Animations
  const currentShadowSize = getBlockProp(selectedBlock, 'SHADOW_SIZE', '0');
  const currentShadowColor = getBlockProp(selectedBlock, 'SHADOW_COLOR', '#2563eb');
  
  const currentTextShadowSize = getBlockProp(selectedBlock, 'TEXT_SHADOW_SIZE', '0');
  const currentTextShadowColor = getBlockProp(selectedBlock, 'TEXT_SHADOW_COLOR', '#000000');

  const currentBlurAmount = getBlockProp(selectedBlock, 'BLUR_AMOUNT', '0');
  const currentRotate = getBlockProp(selectedBlock, 'ROTATE', '0');
  const currentHoverEffect = getBlockProp(selectedBlock, 'HOVER_EFFECT', 'none');
  const currentAnimation = getBlockProp(selectedBlock, 'ANIMATION', 'none');
  const currentFilter = getBlockProp(selectedBlock, 'FILTER', 'none');
  const currentCursor = getBlockProp(selectedBlock, 'CURSOR', 'default');
  
  // Flexbox values
  const currentDirection = getBlockProp(selectedBlock, 'DIRECTION', 'row');
  const currentJustify = getBlockProp(selectedBlock, 'JUSTIFY', 'flex-start');
  const currentAlignItems = getBlockProp(selectedBlock, 'ALIGN_ITEMS', 'center');
  const currentGap = getBlockProp(selectedBlock, 'GAP', '16px');
  const currentWrap = getBlockProp(selectedBlock, 'WRAP', 'wrap');

  // Button Action Values
  const currentActionType = getBlockProp(selectedBlock, 'ACTION_TYPE', 'alert');
  const currentActionVal = getBlockProp(selectedBlock, 'ACTION_VAL') || getBlockProp(selectedBlock, 'ALERT_MSG', 'שלום! ✨');

  // Change handler
  const setProp = (fieldName, value) => {
    onUpdateField(selectedBlock, fieldName, value);
  };

  // Apply Custom 2-Color Gradient
  const applyCustomGradient = () => {
    const gradVal = `linear-gradient(${gradientAngle}, ${gradientColor1}, ${gradientColor2})`;
    setProp('GRADIENT', gradVal);
  };

  // Height & Sizing options that guarantee visual expansion
  const SIZING_OPTIONS = [
    { label: 'אוטומטי (Auto)', value: 'auto' },
    { label: '100px (קומפקטי)', value: '100px' },
    { label: '200px (קטן)', value: '200px' },
    { label: '300px (בינוני)', value: '300px' },
    { label: '450px (גדול)', value: '450px' },
    { label: '600px (ענק)', value: '600px' },
    { label: '750px (מורחב)', value: '750px' },
    { label: '1000px (מקסימלי)', value: '1000px' },
    { label: '25vh (רבע מסך)', value: '25vh' },
    { label: '50vh (חצי מסך)', value: '50vh' },
    { label: '75vh (שלושת רבעי מסך)', value: '75vh' },
    { label: '100vh (גובה מסך מלא)', value: '100vh' },
    { label: '50% (חצי)', value: '50%' },
    { label: '100% (מלא)', value: '100%' }
  ];

  // Clean numeric helper for display in inputs
  const extractCleanNumber = (val) => {
    if (!val || val === 'auto' || val === 'none') return '';
    return String(val).replace(/[^0-9.-]/g, '');
  };

  // Filter tabs dynamically based on the current element's configuration!
  const visibleTabs = config.allowedTabs.map(tId => ALL_TABS[tId]).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', direction: 'rtl', fontFamily: STANDARD_FONT }}>
      
      {/* 🧭 כותרת עליונה */}
      <div style={{ 
        padding: '14px 20px', 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontFamily: STANDARD_FONT
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', fontFamily: STANDARD_FONT, lineHeight: 1.3 }}>
              עיצוב: {config.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontFamily: STANDARD_FONT }}>
              שליטה מלאה בעיצוב, טקסט ופעולות בלייב
            </div>
          </div>
        </div>
        <button 
          onClick={onBackToToolbox}
          style={{ 
            background: '#f1f5f9', 
            border: '1px solid #cbd5e1', 
            color: '#334155', 
            padding: '7px 14px', 
            borderRadius: '8px', 
            fontSize: '0.88rem', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontFamily: STANDARD_FONT,
            transition: 'all 0.15s ease'
          }}
        >
          ✕ סגור
        </button>
      </div>

      {/* 🗂️ סרגל טאבים מסונן וממוקד */}
      <div style={{ 
        display: 'flex', 
        background: '#f8fafc', 
        padding: '8px 10px', 
        borderBottom: '1px solid #e2e8f0', 
        gap: '6px',
        overflowX: 'auto',
        fontFamily: STANDARD_FONT
      }}>
        {visibleTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              minWidth: '60px',
              padding: '9px 6px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === t.id ? '#2563eb' : 'transparent',
              color: activeTab === t.id ? '#ffffff' : '#64748b',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              boxShadow: activeTab === t.id ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
              transition: 'all 0.15s ease',
              fontFamily: STANDARD_FONT
            }}
          >
            <span style={{ fontSize: '1.05rem' }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 📱 אזור תוכן הכרטיסייה הפעילה */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: STANDARD_FONT }}>
        
        {/* ========================================================================= */}
        {/* 1. 📝 כרטיסיית תוכן & פעולות כפתור                                          */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* טקסט / כותרת */}
            {(selectedBlock.getField && (selectedBlock.getField('TEXT') || selectedBlock.getField('TITLE') || selectedBlock.getField('LABEL'))) && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  טקסט להצגה:
                </label>
                <input
                  type="text"
                  value={getBlockProp(selectedBlock, 'TEXT') || getBlockProp(selectedBlock, 'TITLE') || getBlockProp(selectedBlock, 'LABEL')}
                  onChange={(e) => {
                    if (selectedBlock.getField('TEXT')) setProp('TEXT', e.target.value);
                    else if (selectedBlock.getField('TITLE')) setProp('TITLE', e.target.value);
                    else if (selectedBlock.getField('LABEL')) setProp('LABEL', e.target.value);
                  }}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', fontFamily: STANDARD_FONT }}
                />
              </div>
            )}

            {/* כפתור בסרגל ניווט (CTA Text) */}
            {blockType === 'web_navbar' && (
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px', fontFamily: STANDARD_FONT }}>
                  טקסט כפתור ניווט (CTA):
                </label>
                <input
                  type="text"
                  value={getBlockProp(selectedBlock, 'CTA_TEXT')}
                  onChange={(e) => setProp('CTA_TEXT', e.target.value)}
                  placeholder="לדוגמה: צור קשר 🚀"
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', outline: 'none', marginBottom: '10px' }}
                />
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px', fontFamily: STANDARD_FONT }}>
                  עמוד היעד של הכפתור:
                </label>
                <select
                  value={getBlockProp(selectedBlock, 'CTA_PAGE', 'contact.html')}
                  onChange={(e) => setProp('CTA_PAGE', e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff', outline: 'none' }}
                >
                  <option value="index.html">דף הבית (index.html)</option>
                  <option value="about.html">אודות (about.html)</option>
                  <option value="services.html">שירותים (services.html)</option>
                  <option value="contact.html">צור קשר (contact.html)</option>
                </select>
              </div>
            )}

            {/* ⚡ הגדרת פעולה אינטראקטיבית לכפתור (Interactive Button Actions) */}
            {['web_action_button', 'web_button'].includes(blockType) && (
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1.5px solid #bae6fd' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '10px', fontFamily: STANDARD_FONT }}>
                  ⚡ מה קורה כשהמשתמש לוחץ על הכפתור:
                </label>

                {/* בחירת סוג הפעולה */}
                <div style={{ marginBottom: '12px' }}>
                  <select
                    value={currentActionType}
                    onChange={(e) => setProp('ACTION_TYPE', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', background: '#fff', outline: 'none', fontWeight: 'bold' }}
                  >
                    <option value="alert">🔔 הצגת הודעה קופצת (Alert)</option>
                    <option value="navigate">🔗 מעבר לעמוד בתוך האתר</option>
                    <option value="open_url">🌐 פתיחת קישור חיצוני (חלון חדש)</option>
                    <option value="change_bg">🎨 שינוי צבע הרקע של האתר</option>
                    <option value="scroll_top">⬆️ גלילה חלקה לראש הדף</option>
                    <option value="play_sound">🎵 השמעת צליל ביפ/הצלחה</option>
                    <option value="custom_js">💻 הרצת קוד JavaScript מותאם</option>
                  </select>
                </div>

                {/* ערך הפעולה בהתאם לבחירה */}
                {currentActionType === 'alert' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>תוכן ההודעה הקופצת:</label>
                    <input
                      type="text"
                      value={currentActionVal}
                      onChange={(e) => {
                        setProp('ACTION_VAL', e.target.value);
                        setProp('ALERT_MSG', e.target.value);
                      }}
                      placeholder="לדוגמה: תודה שפנית אלינו! נחזור אליך בהקדם"
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                )}

                {currentActionType === 'navigate' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>בחר עמוד יעד:</label>
                    <select
                      value={currentActionVal || 'about.html'}
                      onChange={(e) => setProp('ACTION_VAL', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}
                    >
                      <option value="index.html">דף הבית (index.html)</option>
                      <option value="about.html">אודות (about.html)</option>
                      <option value="services.html">שירותים (services.html)</option>
                      <option value="contact.html">צור קשר (contact.html)</option>
                    </select>
                  </div>
                )}

                {currentActionType === 'open_url' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>כתובת אתר (URL):</label>
                    <input
                      type="text"
                      value={currentActionVal}
                      onChange={(e) => setProp('ACTION_VAL', e.target.value)}
                      placeholder="https://google.com"
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', direction: 'ltr' }}
                    />
                  </div>
                )}

                {currentActionType === 'change_bg' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>בחר צבע רקע חדש:</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={currentActionVal.startsWith('#') ? currentActionVal : '#fef08a'}
                        onChange={(e) => setProp('ACTION_VAL', e.target.value)}
                        style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        value={currentActionVal}
                        onChange={(e) => setProp('ACTION_VAL', e.target.value)}
                        placeholder="#fef08a"
                        style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                )}

                {currentActionType === 'custom_js' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>פקודת JavaScript:</label>
                    <input
                      type="text"
                      value={currentActionVal}
                      onChange={(e) => setProp('ACTION_VAL', e.target.value)}
                      placeholder="console.log('Clicked');"
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', direction: 'ltr', fontFamily: 'monospace' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* קישור תמונה */}
            {selectedBlock.getField && selectedBlock.getField('SRC') && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  קישור לתמונה (URL):
                </label>
                <input
                  type="text"
                  value={getBlockProp(selectedBlock, 'SRC')}
                  onChange={(e) => setProp('SRC', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', direction: 'ltr', outline: 'none', fontFamily: STANDARD_FONT }}
                />
              </div>
            )}

            {/* מזהה וידאו יוטיוב */}
            {selectedBlock.getField && selectedBlock.getField('VIDEO_ID') && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  מזהה סרטון YouTube (למשל dQw4w9WgXcQ):
                </label>
                <input
                  type="text"
                  value={getBlockProp(selectedBlock, 'VIDEO_ID')}
                  onChange={(e) => setProp('VIDEO_ID', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', direction: 'ltr', outline: 'none', fontFamily: STANDARD_FONT }}
                />
              </div>
            )}

            {/* מספר וואטסאפ / טלפון */}
            {selectedBlock.getField && selectedBlock.getField('PHONE') && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  מספר טלפון ליצירת קשר:
                </label>
                <input
                  type="tel"
                  value={getBlockProp(selectedBlock, 'PHONE')}
                  onChange={(e) => setProp('PHONE', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', direction: 'ltr', outline: 'none', fontFamily: STANDARD_FONT }}
                />
              </div>
            )}

            {/* עמוד יעד לניווט */}
            {selectedBlock.getField && selectedBlock.getField('TARGET_PAGE') && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  עמוד היעד באתר:
                </label>
                <select
                  value={getBlockProp(selectedBlock, 'TARGET_PAGE')}
                  onChange={(e) => setProp('TARGET_PAGE', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', background: '#fff', outline: 'none', fontFamily: STANDARD_FONT }}
                >
                  <option value="index.html">דף הבית (index.html)</option>
                  <option value="about.html">אודות (about.html)</option>
                  <option value="services.html">שירותים (services.html)</option>
                  <option value="contact.html">צור קשר (contact.html)</option>
                </select>
              </div>
            )}

            {/* שדות טופס: Placeholder */}
            {selectedBlock.getField && selectedBlock.getField('PLACEHOLDER') && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  טקסט רמז (Placeholder):
                </label>
                <input
                  type="text"
                  value={getBlockProp(selectedBlock, 'PLACEHOLDER')}
                  onChange={(e) => setProp('PLACEHOLDER', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', fontFamily: STANDARD_FONT }}
                />
              </div>
            )}

            {/* שם מותג וזכויות יוצרים בפוטר */}
            {selectedBlock.getField && selectedBlock.getField('BRAND') && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  שם העסק / מותג:
                </label>
                <input
                  type="text"
                  value={getBlockProp(selectedBlock, 'BRAND')}
                  onChange={(e) => setProp('BRAND', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', fontFamily: STANDARD_FONT }}
                />
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ✍️ כרטיסיית טיפוגרפיה וגופנים (Full Rich Text Suite)                      */}
        {/* ========================================================================= */}
        {activeTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* משפחת גופן */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                סגנון גופן:
              </label>
              <select
                value={currentFont}
                onChange={(e) => {
                  setProp('FONT', e.target.value);
                  setProp('FONT_FAMILY', e.target.value);
                }}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', background: '#fff', outline: 'none', fontFamily: STANDARD_FONT }}
              >
                <option value="Arial, sans-serif">גופן רגיל (Standard Arial)</option>
                <option value="Heebo, sans-serif">Heebo (מודרני)</option>
                <option value="Assistant, sans-serif">Assistant (אלגנטי)</option>
                <option value="Rubik, sans-serif">Rubik (צעיר)</option>
                <option value="Secular One, sans-serif">Secular One (מודגש)</option>
                <option value="Varela Round, sans-serif">Varela Round (מעוגל)</option>
              </select>
            </div>

            {/* גודל גופן עם כפתורים מהירים + שדה חופשי */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                גודל טקסט:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'קטן (14px)', val: '14px' },
                  { label: 'רגיל (16px)', val: '16px' },
                  { label: 'בינוני (20px)', val: '20px' },
                  { label: 'גדול (26px)', val: '26px' },
                  { label: 'בולט (32px)', val: '32px' },
                  { label: 'ענק (40px)', val: '40px' },
                  { label: 'כותרת (48px)', val: '48px' },
                  { label: 'ענקית (56px)', val: '56px' }
                ].map(sz => (
                  <button
                    key={sz.val}
                    onClick={() => {
                      setProp('FONT_SIZE', sz.val);
                      setProp('SIZE', sz.val);
                    }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentFontSize === sz.val ? '#2563eb' : '#cbd5e1'),
                      background: currentFontSize === sz.val ? '#eff6ff' : '#ffffff',
                      color: currentFontSize === sz.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', whiteSpace: 'nowrap' }}>גודל מותאם אישית:</span>
                <input
                  type="text"
                  value={currentFontSize}
                  onChange={(e) => {
                    setProp('FONT_SIZE', e.target.value);
                    setProp('SIZE', e.target.value);
                  }}
                  placeholder="לדוגמה: 22px או 2.5rem"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* עובי גופן (דק, רגיל, מודגש, שחור כבד) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                עובי והדגשת גופן (Font Weight):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'דק (300)', val: '300' },
                  { label: 'רגיל (400)', val: '400' },
                  { label: 'מודגש (700)', val: '700' },
                  { label: 'שחור כבד (900)', val: '900' }
                ].map(w => (
                  <button
                    key={w.val}
                    onClick={() => setProp('FONT_WEIGHT', w.val)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentFontWeight === w.val ? '#2563eb' : '#cbd5e1'),
                      background: currentFontWeight === w.val ? '#eff6ff' : '#ffffff',
                      color: currentFontWeight === w.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* יישור טקסט */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                יישור טקסט (Alignment):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'ימין ➡️', val: 'right' },
                  { label: 'מרכז ↔️', val: 'center' },
                  { label: 'שמאל ⬅️', val: 'left' },
                  { label: 'מיושר לשני הצדדים', val: 'justify' }
                ].map(al => (
                  <button
                    key={al.val}
                    onClick={() => {
                      setProp('ALIGN', al.val);
                      setProp('TEXT_ALIGN', al.val);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentAlign === al.val ? '#2563eb' : '#cbd5e1'),
                      background: currentAlign === al.val ? '#eff6ff' : '#ffffff',
                      color: currentAlign === al.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {al.label}
                  </button>
                ))}
              </div>
            </div>

            {/* קו תחתון, נטוי וקו חוצה */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                עיצוב נוסף (נטוי / קו תחתון):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setProp('FONT_STYLE', currentFontStyle === 'italic' ? 'normal' : 'italic')}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: '1.5px solid ' + (currentFontStyle === 'italic' ? '#2563eb' : '#cbd5e1'),
                    background: currentFontStyle === 'italic' ? '#eff6ff' : '#ffffff',
                    color: currentFontStyle === 'italic' ? '#2563eb' : '#334155',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: STANDARD_FONT
                  }}
                >
                  𝐼 טקסט נטוי (Italic)
                </button>
                <button
                  onClick={() => setProp('TEXT_DECORATION', currentTextDecoration === 'underline' ? 'none' : 'underline')}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: '1.5px solid ' + (currentTextDecoration === 'underline' ? '#2563eb' : '#cbd5e1'),
                    background: currentTextDecoration === 'underline' ? '#eff6ff' : '#ffffff',
                    color: currentTextDecoration === 'underline' ? '#2563eb' : '#334155',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: STANDARD_FONT
                  }}
                >
                  <u>U קו תחתון</u>
                </button>
              </div>
            </div>

            {/* מרווח שורות ורווח אותיות */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px', fontFamily: STANDARD_FONT }}>
                  מרווח שורות:
                </label>
                <input
                  type="text"
                  value={currentLineHeight}
                  onChange={(e) => setProp('LINE_HEIGHT', e.target.value)}
                  placeholder="1.6"
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px', fontFamily: STANDARD_FONT }}>
                  רווח אותיות:
                </label>
                <input
                  type="text"
                  value={currentLetterSpacing}
                  onChange={(e) => setProp('LETTER_SPACING', e.target.value)}
                  placeholder="0px"
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. 🎨 כרטיסיית צבעים ומחולל מעברי צבעים                                     */}
        {/* ========================================================================= */}
        {activeTab === 'colors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* צבע רקע */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px', fontFamily: STANDARD_FONT }}>
                צבע רקע (מלא / שקוף):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={currentBg.startsWith('#') ? currentBg : '#ffffff'}
                  onChange={(e) => {
                    setProp('BG_COLOR', e.target.value);
                    setProp('GRADIENT', 'none');
                  }}
                  style={{ width: '48px', height: '44px', border: '1.5px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', padding: '0', background: 'none' }}
                />
                <input
                  type="text"
                  value={currentBg}
                  onChange={(e) => {
                    setProp('BG_COLOR', e.target.value);
                    setProp('GRADIENT', 'none');
                  }}
                  placeholder="#ffffff"
                  style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', fontFamily: 'monospace', outline: 'none' }}
                />
                <button
                  onClick={() => {
                    setProp('BG_COLOR', 'transparent');
                    setProp('GRADIENT', 'none');
                  }}
                  style={{ 
                    background: currentBg === 'transparent' ? '#fee2e2' : '#ffffff', 
                    border: '1.5px solid ' + (currentBg === 'transparent' ? '#ef4444' : '#cbd5e1'), 
                    padding: '9px 14px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    fontFamily: STANDARD_FONT
                  }}
                >
                  שקוף
                </button>
              </div>
            </div>

            {/* 🖼️ תמונת רקע לאלמנט (Background Image) */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b', fontFamily: STANDARD_FONT, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🖼️ תמונת רקע לאלמנט (Background Image):
                </label>
                {currentBgImage && currentBgImage !== 'none' && currentBgImage !== '' && (
                  <button
                    onClick={() => setProp('BG_IMAGE', '')}
                    style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: STANDARD_FONT }}
                  >
                    🗑️ הסר תמונת רקע
                  </button>
                )}
              </div>

              {/* העלאת קובץ מהמחשב */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#eff6ff', border: '1.5px dashed #3b82f6', borderRadius: '8px', cursor: 'pointer', color: '#1d4ed8', fontWeight: 'bold', fontSize: '0.88rem' }}>
                  <span>📁 העלה תמונת רקע מהמחשב</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          if (uploadEvent.target && uploadEvent.target.result) {
                            setProp('BG_IMAGE', uploadEvent.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* הזנת קישור לתמונה */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>או הזן כתובת אינטרנט לתמונה (URL):</span>
                <input
                  type="text"
                  value={currentBgImage && !currentBgImage.startsWith('data:') ? currentBgImage : ''}
                  onChange={(e) => setProp('BG_IMAGE', e.target.value.trim())}
                  placeholder="https://images.unsplash.com/photo-..."
                  style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', direction: 'ltr', fontFamily: 'monospace', outline: 'none' }}
                />
              </div>

              {/* הגדרות התאמה ומיקום לרקע */}
              {currentBgImage && currentBgImage !== 'none' && currentBgImage !== '' && (
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>גודל והתאמה:</span>
                      <select
                        value={currentBgSize}
                        onChange={(e) => setProp('BG_SIZE', e.target.value)}
                        style={{ width: '100%', padding: '7px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.82rem', background: '#fff' }}
                      >
                        <option value="cover">כיסוי מלא (Cover)</option>
                        <option value="contain">הכלה שלמה (Contain)</option>
                        <option value="auto">אוטומטי (Auto)</option>
                        <option value="100% 100%">מתיחה מלאה (100% 100%)</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>מיקום הרקע:</span>
                      <select
                        value={currentBgPosition}
                        onChange={(e) => setProp('BG_POSITION', e.target.value)}
                        style={{ width: '100%', padding: '7px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.82rem', background: '#fff' }}
                      >
                        <option value="center">מרכז (Center)</option>
                        <option value="top center">עליון (Top)</option>
                        <option value="bottom center">תחתון (Bottom)</option>
                        <option value="right center">ימין (Right)</option>
                        <option value="left center">שמאל (Left)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* טפטים מומלצים לבחירה מהירה */}
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>טפטים מומלצים בלחיצה מהירה:</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { label: 'כהה מודרני', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
                    { label: 'טבע ירוק', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80' },
                    { label: 'עננים סגולים', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' },
                    { label: 'טקסטורה עדינה', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80' }
                  ].map(preset => (
                    <button
                      key={preset.url}
                      onClick={() => {
                        setProp('BG_IMAGE', preset.url);
                        setProp('BG_SIZE', 'cover');
                      }}
                      style={{
                        padding: '6px 4px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={preset.label}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 🌈 מחולל מעבר צבעים מותאם אישית */}
            {['web_card', 'web_page_container', 'web_action_button', 'web_button', 'web_button_link', 'web_navbar', 'web_navbar_custom', 'web_footer', 'web_badge'].includes(blockType) && (
              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1.5px solid #bae6fd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0369a1', fontFamily: STANDARD_FONT, margin: 0 }}>
                    🌈 יצירת מעבר צבעים אישי (Gradient):
                  </label>
                  {currentGradient !== 'none' && (
                    <button
                      onClick={() => setProp('GRADIENT', 'none')}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: STANDARD_FONT }}
                    >
                      ביטול מעבר
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155' }}>צבע 1</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: '#0284c7' }}>➔</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155' }}>צבע 2</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(e.target.value)}
                    style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', background: '#fff', outline: 'none', fontFamily: STANDARD_FONT }}
                  >
                    <option value="135deg">אלכסון (135°)</option>
                    <option value="90deg">מימין לשמאל (90°)</option>
                    <option value="180deg">מלמעלה למטה (180°)</option>
                    <option value="45deg">אלכסון הפוך (45°)</option>
                  </select>

                  <button
                    onClick={applyCustomGradient}
                    style={{
                      background: `linear-gradient(${gradientAngle}, ${gradientColor1}, ${gradientColor2})`,
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    ✨ החל מעבר
                  </button>
                </div>
              </div>
            )}

            {/* צבע טקסט */}
            {!['web_divider', 'web_spacer'].includes(blockType) && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px', fontFamily: STANDARD_FONT }}>
                  צבע טקסט:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="color"
                    value={currentTextColor.startsWith('#') ? currentTextColor : '#0f172a'}
                    onChange={(e) => {
                      setProp('TEXT_COLOR', e.target.value);
                      setProp('COLOR', e.target.value);
                    }}
                    style={{ width: '48px', height: '44px', border: '1.5px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', padding: '0', background: 'none' }}
                  />
                  <input
                    type="text"
                    value={currentTextColor}
                    onChange={(e) => {
                      setProp('TEXT_COLOR', e.target.value);
                      setProp('COLOR', e.target.value);
                    }}
                    placeholder="#0f172a"
                    style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.92rem', fontFamily: 'monospace', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* שקיפות האלמנט */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                שקיפות (Opacity):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'מלא (100%)', val: '1' },
                  { label: 'עדין (85%)', val: '0.85' },
                  { label: 'חצי (60%)', val: '0.6' },
                  { label: 'שקוף (35%)', val: '0.35' }
                ].map(op => (
                  <button
                    key={op.val}
                    onClick={() => setProp('OPACITY', op.val)}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentOpacity === op.val ? '#2563eb' : '#cbd5e1'),
                      background: currentOpacity === op.val ? '#eff6ff' : '#ffffff',
                      color: currentOpacity === op.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. 📐 כרטיסיית מידות (Guaranteed Height & Width Expansion)                   */}
        {/* ========================================================================= */}
        {activeTab === 'dimensions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* גובה האלמנט Height (מובטח שיעבוד וירחיב את האלמנט בלייב) */}
            {blockType !== 'web_divider' && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  ↕️ גובה האלמנט (Height):
                </label>
                
                {/* כפתורי קיצור נפוצים לגובה */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                  {[
                    { label: 'אוטומטי', val: 'auto' },
                    { label: '100px', val: '100px' },
                    { label: '200px', val: '200px' },
                    { label: '300px', val: '300px' },
                    { label: '450px', val: '450px' },
                    { label: '600px', val: '600px' },
                    { label: '50vh (חצי)', val: '50vh' },
                    { label: '100vh (מסך)', val: '100vh' }
                  ].map(h => (
                    <button
                      key={h.val}
                      onClick={() => setProp('HEIGHT', h.val)}
                      style={{
                        padding: '8px 2px',
                        borderRadius: '6px',
                        border: '1.5px solid ' + (currentHeight === h.val ? '#2563eb' : '#cbd5e1'),
                        background: currentHeight === h.val ? '#eff6ff' : '#ffffff',
                        color: currentHeight === h.val ? '#2563eb' : '#334155',
                        fontWeight: 'bold',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        fontFamily: STANDARD_FONT
                      }}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>

                {/* הזנת מספר חופשי + בחירת יחידת מידה לגובה */}
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>הקלד כל גובה חופשי:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={extractCleanNumber(currentHeight) || (currentHeight === 'auto' ? '' : currentHeight)}
                      onChange={(e) => {
                        const inputVal = e.target.value.trim();
                        if (!inputVal) {
                          setProp('HEIGHT', 'auto');
                          return;
                        }
                        if (inputVal.includes('%') || inputVal.includes('px') || inputVal.includes('vh') || inputVal.includes('rem') || inputVal === 'auto') {
                          setProp('HEIGHT', inputVal);
                        } else {
                          const currentUnit = currentHeight.includes('vh') ? 'vh' : (currentHeight.includes('%') ? '%' : (currentHeight.includes('rem') ? 'rem' : 'px'));
                          setProp('HEIGHT', `${inputVal}${currentUnit}`);
                        }
                      }}
                      placeholder="לדוגמה: 100, 250, 450, 80"
                      style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                    />
                    
                    {/* בורר יחידות מידה לגובה */}
                    <div style={{ display: 'flex', gap: '2px', background: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
                      {['px', 'vh', '%', 'rem'].map(unit => {
                        const isSelected = currentHeight.includes(unit) || (!currentHeight.includes('vh') && !currentHeight.includes('%') && !currentHeight.includes('rem') && unit === 'px');
                        return (
                          <button
                            key={unit}
                            onClick={() => {
                              const num = extractCleanNumber(currentHeight) || '200';
                              setProp('HEIGHT', `${num}${unit}`);
                            }}
                            style={{
                              padding: '5px 8px',
                              border: 'none',
                              borderRadius: '4px',
                              background: isSelected ? '#2563eb' : 'transparent',
                              color: isSelected ? '#ffffff' : '#475569',
                              fontSize: '0.78rem',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            {unit}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* רוחב האלמנט Width */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                ↔️ רוחב האלמנט (Width):
              </label>

              {/* כפתורי קיצור נפוצים */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
                {[
                  { label: '100% (מלא)', val: '100%' },
                  { label: '75%', val: '75%' },
                  { label: '50% (חצי)', val: '50%' },
                  { label: '33% (שליש)', val: '33.33%' },
                  { label: '400px', val: '400px' },
                  { label: '600px', val: '600px' },
                  { label: '800px', val: '800px' },
                  { label: 'אוטומטי', val: 'auto' }
                ].map(w => (
                  <button
                    key={w.val}
                    onClick={() => setProp('WIDTH', w.val)}
                    style={{
                      padding: '8px 2px',
                      borderRadius: '6px',
                      border: '1.5px solid ' + (currentWidth === w.val ? '#2563eb' : '#cbd5e1'),
                      background: currentWidth === w.val ? '#eff6ff' : '#ffffff',
                      color: currentWidth === w.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* הזנת מספר חופשי + בחירת יחידת מידה */}
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>הקלד כל מספר חופשי:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={extractCleanNumber(currentWidth) || currentWidth}
                    onChange={(e) => {
                      const inputVal = e.target.value.trim();
                      if (!inputVal) {
                        setProp('WIDTH', '100%');
                        return;
                      }
                      if (inputVal.includes('%') || inputVal.includes('px') || inputVal.includes('rem') || inputVal.includes('vw') || inputVal === 'auto' || inputVal === 'fit-content') {
                        setProp('WIDTH', inputVal);
                      } else {
                        const currentUnit = currentWidth.includes('px') ? 'px' : (currentWidth.includes('vw') ? 'vw' : (currentWidth.includes('rem') ? 'rem' : '%'));
                        setProp('WIDTH', `${inputVal}${currentUnit}`);
                      }
                    }}
                    placeholder="לדוגמה: 350, 500, 80, 100"
                    style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                  />
                  
                  {/* בורר יחידות מידה */}
                  <div style={{ display: 'flex', gap: '2px', background: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
                    {['px', '%', 'rem', 'vw'].map(unit => {
                      const isSelected = currentWidth.includes(unit) || (!currentWidth.includes('%') && !currentWidth.includes('rem') && !currentWidth.includes('vw') && unit === 'px');
                      return (
                        <button
                          key={unit}
                          onClick={() => {
                            const num = extractCleanNumber(currentWidth) || '300';
                            setProp('WIDTH', `${num}${unit}`);
                          }}
                          style={{
                            padding: '5px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            background: isSelected ? '#2563eb' : 'transparent',
                            color: isSelected ? '#ffffff' : '#475569',
                            fontSize: '0.78rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {unit}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* מרווח פנימי Padding */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                מרווח פנימי (Padding):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'ללא (0px)', val: '0px' },
                  { label: 'מצומצם (8px)', val: '8px' },
                  { label: 'רגיל (16px)', val: '16px' },
                  { label: 'מרווח (24px)', val: '24px' },
                  { label: 'גדול (32px)', val: '32px' },
                  { label: 'ענק (48px)', val: '48px' }
                ].map(p => (
                  <button
                    key={p.val}
                    onClick={() => setProp('PADDING', p.val)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentPadding === p.val ? '#2563eb' : '#cbd5e1'),
                      background: currentPadding === p.val ? '#eff6ff' : '#ffffff',
                      color: currentPadding === p.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', whiteSpace: 'nowrap' }}>פדינג מותאם:</span>
                <input
                  type="text"
                  value={currentPadding}
                  onChange={(e) => setProp('PADDING', e.target.value)}
                  placeholder="למשל 12px 24px או 40"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* מרווח חיצוני Margin */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                רווח חיצוני (Margin):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'ללא', val: '0px' },
                  { label: 'קטן (8px)', val: '8px' },
                  { label: 'בינוני (16px)', val: '16px' },
                  { label: 'גדול (24px)', val: '24px' }
                ].map(m => (
                  <button
                    key={m.val}
                    onClick={() => setProp('MARGIN', m.val)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentMargin === m.val ? '#2563eb' : '#cbd5e1'),
                      background: currentMargin === m.val ? '#eff6ff' : '#ffffff',
                      color: currentMargin === m.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', whiteSpace: 'nowrap' }}>מרג'ין מותאם:</span>
                <input
                  type="text"
                  value={currentMargin}
                  onChange={(e) => setProp('MARGIN', e.target.value)}
                  placeholder="למשל 20px auto או 30"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. ⭕ כרטיסיית פינות ומסגרות                                               */}
        {/* ========================================================================= */}
        {activeTab === 'borders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* עיגול פינות */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                עיגול פינות (Border Radius):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'ישר (0px)', val: '0px' },
                  { label: 'קל (8px)', val: '8px' },
                  { label: 'בינוני (16px)', val: '16px' },
                  { label: 'עגול (24px)', val: '24px' },
                  { label: 'ענק (32px)', val: '32px' },
                  { label: 'עגול מלא', val: '9999px' }
                ].map(rd => (
                  <button
                    key={rd.val}
                    onClick={() => {
                      setProp('RADIUS', rd.val);
                      setProp('BORDER_RADIUS', rd.val);
                    }}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentRadius === rd.val ? '#2563eb' : '#cbd5e1'),
                      background: currentRadius === rd.val ? '#eff6ff' : '#ffffff',
                      color: currentRadius === rd.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {rd.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', whiteSpace: 'nowrap' }}>עיגול מותאם:</span>
                <input
                  type="text"
                  value={currentRadius}
                  onChange={(e) => {
                    setProp('RADIUS', e.target.value);
                    setProp('BORDER_RADIUS', e.target.value);
                  }}
                  placeholder="למשל 18px או 50%"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* עובי מסגרת */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                עובי מסגרת (Border Width):
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'ללא מסגרת', val: '0px' },
                  { label: 'דקה (1px)', val: '1px' },
                  { label: 'בינונית (2px)', val: '2px' },
                  { label: 'עבה (4px)', val: '4px' }
                ].map(bw => (
                  <button
                    key={bw.val}
                    onClick={() => setProp('BORDER_WIDTH', bw.val)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentBorderWidth === bw.val ? '#2563eb' : '#cbd5e1'),
                      background: currentBorderWidth === bw.val ? '#eff6ff' : '#ffffff',
                      color: currentBorderWidth === bw.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {bw.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', whiteSpace: 'nowrap' }}>עובי מותאם:</span>
                <input
                  type="text"
                  value={currentBorderWidth}
                  onChange={(e) => setProp('BORDER_WIDTH', e.target.value)}
                  placeholder="למשל 3px או 6"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* סגנון וצבע מסגרת */}
            {currentBorderWidth !== '0px' && currentBorderWidth !== '0' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                    סגנון קו המסגרת:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { label: 'רציף (Solid)', val: 'solid' },
                      { label: 'מקווקו (Dashed)', val: 'dashed' },
                      { label: 'נקודות (Dotted)', val: 'dotted' }
                    ].map(bs => (
                      <button
                        key={bs.val}
                        onClick={() => setProp('BORDER_STYLE', bs.val)}
                        style={{
                          flex: 1,
                          padding: '9px 4px',
                          borderRadius: '8px',
                          border: '1.5px solid ' + (currentBorderStyle === bs.val ? '#2563eb' : '#cbd5e1'),
                          background: currentBorderStyle === bs.val ? '#eff6ff' : '#ffffff',
                          color: currentBorderStyle === bs.val ? '#2563eb' : '#334155',
                          fontWeight: 'bold',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          fontFamily: STANDARD_FONT
                        }}
                      >
                        {bs.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                    צבע מסגרת:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      value={currentBorderColor.startsWith('#') ? currentBorderColor : '#cbd5e1'}
                      onChange={(e) => setProp('BORDER_COLOR', e.target.value)}
                      style={{ width: '44px', height: '40px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', padding: '0' }}
                    />
                    <input
                      type="text"
                      value={currentBorderColor}
                      onChange={(e) => setProp('BORDER_COLOR', e.target.value)}
                      style={{ flex: 1, padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. ✨ כרטיסיית אפקטים וסליידרים                                             */}
        {/* ========================================================================= */}
        {activeTab === 'effects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* 🎚️ סליידר צללית תיבה */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', fontFamily: STANDARD_FONT, margin: 0 }}>
                  🎚️ גודל וצבע צללית (Box Shadow):
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2563eb' }}>{currentShadowSize}px</span>
              </div>

              <input
                type="range"
                min="0"
                max="60"
                value={currentShadowSize}
                onChange={(e) => {
                  setProp('SHADOW_SIZE', e.target.value);
                  setProp('SHADOW', '');
                }}
                style={{ width: '100%', cursor: 'pointer', marginBottom: '12px' }}
              />

              {parseInt(currentShadowSize, 10) > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="color"
                    value={currentShadowColor.startsWith('#') ? currentShadowColor : '#2563eb'}
                    onChange={(e) => setProp('SHADOW_COLOR', e.target.value)}
                    style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>צבע צללית:</span>
                  <input
                    type="text"
                    value={currentShadowColor}
                    onChange={(e) => setProp('SHADOW_COLOR', e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
              )}
            </div>

            {/* 🎚️ סליידר צללית טקסט */}
            {!['web_image', 'web_video_embed', 'web_divider', 'web_spacer'].includes(blockType) && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', fontFamily: STANDARD_FONT, margin: 0 }}>
                    🎚️ צללית טקסט (Text Shadow):
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2563eb' }}>{currentTextShadowSize}px</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="30"
                  value={currentTextShadowSize}
                  onChange={(e) => {
                    setProp('TEXT_SHADOW_SIZE', e.target.value);
                    setProp('TEXT_SHADOW', '');
                  }}
                  style={{ width: '100%', cursor: 'pointer', marginBottom: '12px' }}
                />

                {parseInt(currentTextShadowSize, 10) > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="color"
                      value={currentTextShadowColor.startsWith('#') ? currentTextShadowColor : '#000000'}
                      onChange={(e) => setProp('TEXT_SHADOW_COLOR', e.target.value)}
                      style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                    />
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>צבע צל טקסט:</span>
                    <input
                      type="text"
                      value={currentTextShadowColor}
                      onChange={(e) => setProp('TEXT_SHADOW_COLOR', e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'monospace' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 🎚️ סליידר טשטוש זכוכית */}
            {['web_card', 'web_page_container', 'web_navbar', 'web_navbar_custom', 'web_image'].includes(blockType) && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', fontFamily: STANDARD_FONT, margin: 0 }}>
                    🌫️ טשטוש רקע זכוכית (Glassmorphism):
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2563eb' }}>{currentBlurAmount}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={currentBlurAmount}
                  onChange={(e) => setProp('BLUR_AMOUNT', e.target.value)}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            )}

            {/* 🎚️ סליידר סיבוב זווית */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a', fontFamily: STANDARD_FONT, margin: 0 }}>
                  🔄 סיבוב זווית (Rotate):
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2563eb' }}>{currentRotate}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={extractCleanNumber(currentRotate) || 0}
                onChange={(e) => setProp('ROTATE', e.target.value)}
                style={{ width: '100%', cursor: 'pointer', marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>-180°</span>
                <span onClick={() => setProp('ROTATE', '0')} style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}>איפוס (0°)</span>
                <span>+180°</span>
              </div>
            </div>

            {/* אנימציה רציפה חיה */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                אנימציה רציפה חיה:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { label: 'ללא', val: 'none' },
                  { label: '💓 פעימת לב (Pulse)', val: 'pulse' },
                  { label: '🌊 ריחוף צף (Float)', val: 'float' },
                  { label: '💡 נצנוץ זוהר (Glow)', val: 'glow_pulse' }
                ].map(an => (
                  <button
                    key={an.val}
                    onClick={() => setProp('ANIMATION', an.val)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentAnimation === an.val ? '#2563eb' : '#cbd5e1'),
                      background: currentAnimation === an.val ? '#eff6ff' : '#ffffff',
                      color: currentAnimation === an.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {an.label}
                  </button>
                ))}
              </div>
            </div>

            {/* אפקט מעבר עכבר Hover */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                אנימציה במעבר עכבר (Hover):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { label: 'ללא', val: 'none' },
                  { label: '🚀 ריחוף קל למעלה', val: 'lift' },
                  { label: '🔍 הגדלה עדינה', val: 'zoom' },
                  { label: '💫 סיבוב קל', val: 'rotate' },
                  { label: '💡 זוהר כחול', val: 'glow' },
                  { label: '🌫️ שקיפות עדינה', val: 'fade' }
                ].map(hv => (
                  <button
                    key={hv.label}
                    onClick={() => setProp('HOVER_EFFECT', hv.val)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentHoverEffect === hv.val ? '#2563eb' : '#cbd5e1'),
                      background: currentHoverEffect === hv.val ? '#eff6ff' : '#ffffff',
                      color: currentHoverEffect === hv.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {hv.label}
                  </button>
                ))}
              </div>
            </div>

            {/* סמן עכבר Cursor */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                סמן עכבר (Cursor):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { label: 'רגיל', val: 'default' },
                  { label: '👆 הצבעה (Pointer)', val: 'pointer' },
                  { label: '🔍 זכוכית מגדלת', val: 'zoom-in' },
                  { label: '✍️ טקסט', val: 'text' },
                  { label: '✋ גרירה (Grab)', val: 'grab' },
                  { label: '🚫 חסום', val: 'not-allowed' }
                ].map(cs => (
                  <button
                    key={cs.val}
                    onClick={() => setProp('CURSOR', cs.val)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentCursor === cs.val ? '#2563eb' : '#cbd5e1'),
                      background: currentCursor === cs.val ? '#eff6ff' : '#ffffff',
                      color: currentCursor === cs.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {cs.label}
                  </button>
                ))}
              </div>
            </div>

            {/* פילטרים גרפיים לתמונות וכרטיסיות */}
            {['web_image', 'web_card', 'web_video_embed'].includes(blockType) && (
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                  פילטר גרפי (Filter):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'ללא', val: 'none' },
                    { label: '🖤 שחור לבן', val: 'grayscale(100%)' },
                    { label: '🌫️ טשטוש', val: 'blur(3px)' },
                    { label: '🌟 בהירות', val: 'brightness(1.3)' },
                    { label: '🎨 ניגודיות', val: 'contrast(150%)' },
                    { label: '🔮 ספיה רטרו', val: 'sepia(80%)' }
                  ].map(fl => (
                    <button
                      key={fl.val}
                      onClick={() => setProp('FILTER', fl.val)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '8px',
                        border: '1.5px solid ' + (currentFilter === fl.val ? '#2563eb' : '#cbd5e1'),
                        background: currentFilter === fl.val ? '#eff6ff' : '#ffffff',
                        color: currentFilter === fl.val ? '#2563eb' : '#334155',
                        fontWeight: 'bold',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontFamily: STANDARD_FONT
                      }}
                    >
                      {fl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. 🗂️ כרטיסיית סידור ו-Flexbox                                             */}
        {/* ========================================================================= */}
        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* כיוון Flexbox */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                כיוון סידור הפריטים:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'שורה (זה לצד זה)', val: 'row' },
                  { label: 'טור (זה מתחת לזה)', val: 'column' }
                ].map(d => (
                  <button
                    key={d.val}
                    onClick={() => setProp('DIRECTION', d.val)}
                    style={{
                      flex: 1,
                      padding: '11px 8px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentDirection === d.val ? '#2563eb' : '#cbd5e1'),
                      background: currentDirection === d.val ? '#eff6ff' : '#ffffff',
                      color: currentDirection === d.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* יישור ראשי Justify Content */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                יישור ופיזור:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { label: 'לימין', val: 'flex-start' },
                  { label: 'למרכז', val: 'center' },
                  { label: 'לשמאל', val: 'flex-end' },
                  { label: 'פיזור שווה', val: 'space-between' }
                ].map(j => (
                  <button
                    key={j.val}
                    onClick={() => setProp('JUSTIFY', j.val)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentJustify === j.val ? '#2563eb' : '#cbd5e1'),
                      background: currentJustify === j.val ? '#eff6ff' : '#ffffff',
                      color: currentJustify === j.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {j.label}
                  </button>
                ))}
              </div>
            </div>

            {/* יישור אנכי Align Items */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                יישור אנכי:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { label: 'למעלה', val: 'flex-start' },
                  { label: 'מרכז', val: 'center' },
                  { label: 'מתוח', val: 'stretch' }
                ].map(ai => (
                  <button
                    key={ai.val}
                    onClick={() => setProp('ALIGN_ITEMS', ai.val)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentAlignItems === ai.val ? '#2563eb' : '#cbd5e1'),
                      background: currentAlignItems === ai.val ? '#eff6ff' : '#ffffff',
                      color: currentAlignItems === ai.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {ai.label}
                  </button>
                ))}
              </div>
            </div>

            {/* רווח בין אלמנטים Gap עם אפשרות חופשית */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                רווח בין הפריטים (Gap):
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'ללא (0)', val: '0px' },
                  { label: 'קטן (8px)', val: '8px' },
                  { label: 'בינוני (16px)', val: '16px' },
                  { label: 'גדול (24px)', val: '24px' }
                ].map(g => (
                  <button
                    key={g.val}
                    onClick={() => setProp('GAP', g.val)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentGap === g.val ? '#2563eb' : '#cbd5e1'),
                      background: currentGap === g.val ? '#eff6ff' : '#ffffff',
                      color: currentGap === g.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: '#64748b', whiteSpace: 'nowrap' }}>רווח מותאם:</span>
                <input
                  type="text"
                  value={currentGap}
                  onChange={(e) => setProp('GAP', e.target.value)}
                  placeholder="למשל 20px או 30"
                  style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', direction: 'ltr', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* שבירת שורות Flex Wrap */}
            <div>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px', fontFamily: STANDARD_FONT }}>
                גלישת שורות:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'גלישה למטה', val: 'wrap' },
                  { label: 'שורה אחת', val: 'nowrap' }
                ].map(wr => (
                  <button
                    key={wr.val}
                    onClick={() => setProp('WRAP', wr.val)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid ' + (currentWrap === wr.val ? '#2563eb' : '#cbd5e1'),
                      background: currentWrap === wr.val ? '#eff6ff' : '#ffffff',
                      color: currentWrap === wr.val ? '#2563eb' : '#334155',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontFamily: STANDARD_FONT
                    }}
                  >
                    {wr.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
