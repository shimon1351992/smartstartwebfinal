import React, { useState, useEffect } from 'react';
import { getBlockProp } from './webBlocksDefinitions';

// =========================================================================
// 🎨 CONTEXT-AWARE PROFESSIONAL CSS3 & HTML5 DESIGN STUDIO
// =========================================================================

const STANDARD_FONT = "'Heebo', 'Rubik', Arial, 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const FULL_DESIGN_TABS = ['content', 'layout', 'text', 'colors', 'dimensions', 'borders', 'effects', 'css'];
const CONTAINER_TABS = ['content', 'layout', 'colors', 'dimensions', 'borders', 'effects', 'text', 'css'];
const TEXT_TABS = ['content', 'text', 'colors', 'dimensions', 'borders', 'layout', 'effects', 'css'];
const MEDIA_TABS = ['content', 'dimensions', 'borders', 'effects', 'layout', 'colors', 'css'];
const FORM_TABS = ['content', 'text', 'colors', 'dimensions', 'borders', 'layout', 'effects', 'css'];

const ELEMENT_CONFIG = {
  // 1. Structure & Semantic HTML5 Containers
  web_page_container: { name: 'דף אינטרנט (מסגרת בסיס)', icon: '🌐', allowedTabs: ['content', 'colors', 'text', 'dimensions', 'layout', 'css'], defaultTab: 'colors' },
  web_semantic_container: { name: 'אזור סמנטי (HTML5)', icon: '🧱', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_grid_container: { name: 'רשת CSS Grid', icon: '🪟', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_row_flex: { name: 'שורה גמישה (Flex)', icon: '↔️', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_card: { name: 'כרטיסייה / מיכל', icon: '🃏', allowedTabs: CONTAINER_TABS, defaultTab: 'colors' },
  web_navbar_custom: { name: 'סרגל ניווט (<nav>)', icon: '🧭', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_divider: { name: 'קו מפריד (<hr>)', icon: '➖', allowedTabs: ['colors', 'dimensions', 'effects', 'css'], defaultTab: 'colors' },
  web_spacer: { name: 'מרווח ריווח', icon: '↕️', allowedTabs: ['dimensions', 'css'], defaultTab: 'dimensions' },

  // 2. Typography & Lists & Tables
  web_heading: { name: 'כותרת (H1–H6)', icon: '✍️', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_paragraph: { name: 'פסקת טקסט (<p>)', icon: '📝', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_badge: { name: 'תגית מעוצבת (Badge)', icon: '🏷️', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_text_format: { name: 'טקסט סמנטי', icon: '💬', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_text_output_label: { name: 'תווית פלט דינמית', icon: '📤', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_output_box: { name: 'תיבת פלט מעוצבת', icon: '📥', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_list_container: { name: 'רשימה (<ul>/<ol>)', icon: '📋', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_list_item: { name: 'פריט רשימה (<li>)', icon: '•', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_table: { name: 'טבלה (<table>)', icon: '📊', allowedTabs: ['colors', 'dimensions', 'borders', 'text', 'effects', 'css'], defaultTab: 'colors' },
  web_table_section: { name: 'אזור טבלה', icon: '📑', allowedTabs: ['content', 'colors', 'text', 'css'], defaultTab: 'colors' },
  web_table_row: { name: 'שורה בטבלה (<tr>)', icon: '➖', allowedTabs: ['colors', 'borders', 'effects', 'css'], defaultTab: 'colors' },
  web_table_cell: { name: 'תא בטבלה (<th>/<td>)', icon: '▫️', allowedTabs: TEXT_TABS, defaultTab: 'content' },

  // 3. Media, SVG & Embeds
  web_image: { name: 'תמונה (<img>)', icon: '🖼️', allowedTabs: MEDIA_TABS, defaultTab: 'content' },
  web_figure: { name: 'מסגרת מדיה (<figure>)', icon: '🖼️', allowedTabs: ['content', 'dimensions', 'colors', 'borders', 'layout', 'effects', 'css'], defaultTab: 'content' },
  web_svg_icon: { name: 'אייקון SVG וקטורי', icon: '✨', allowedTabs: ['content', 'colors', 'dimensions', 'effects', 'layout', 'css'], defaultTab: 'content' },
  web_html5_video: { name: 'וידאו HTML5 (<video>)', icon: '🎬', allowedTabs: MEDIA_TABS, defaultTab: 'content' },
  web_video_embed: { name: 'סרטון YouTube', icon: '▶️', allowedTabs: MEDIA_TABS, defaultTab: 'content' },
  web_audio_player: { name: 'נגן אודיו (<audio>)', icon: '🎵', allowedTabs: ['content', 'dimensions', 'borders', 'effects', 'css'], defaultTab: 'content' },
  web_iframe_embed: { name: 'הטמעה (<iframe>)', icon: '🌐', allowedTabs: MEDIA_TABS, defaultTab: 'content' },

  // 4. Links, Buttons & Interactive HTML5
  web_link: { name: 'קישור (<a>)', icon: '🔗', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_button_with_actions: { name: 'כפתור אינטראקטיבי', icon: '🔘', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_button: { name: 'כפתור פשוט', icon: '🔘', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_button_link: { name: 'כפתור מעבר עמוד', icon: '🔗', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_details_accordion: { name: 'אקורדיון (<details>)', icon: '🔽', allowedTabs: CONTAINER_TABS, defaultTab: 'content' },
  web_dialog_modal: { name: 'חלון קופץ (<dialog>)', icon: '🪟', allowedTabs: CONTAINER_TABS, defaultTab: 'content' },
  web_progress_meter: { name: 'מד התקדמות', icon: '📶', allowedTabs: ['content', 'dimensions', 'colors', 'borders', 'effects', 'css'], defaultTab: 'content' },

  // 5. HTML5 Forms
  web_form: { name: 'טופס (<form>)', icon: '📋', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_fieldset: { name: 'קבוצת שדות (<fieldset>)', icon: '🗂️', allowedTabs: CONTAINER_TABS, defaultTab: 'content' },
  web_label: { name: 'תווית שדה (<label>)', icon: '🏷️', allowedTabs: TEXT_TABS, defaultTab: 'content' },
  web_input_field: { name: 'שדה קלט (<input>)', icon: '📥', allowedTabs: FORM_TABS, defaultTab: 'content' },
  web_textarea: { name: 'תיבת טקסט (<textarea>)', icon: '📝', allowedTabs: FORM_TABS, defaultTab: 'content' },
  web_select_container: { name: 'תיבת בחירה (<select>)', icon: '🔽', allowedTabs: FORM_TABS, defaultTab: 'content' },
  web_select_option: { name: 'אפשרות (<option>)', icon: '▫️', allowedTabs: ['content'], defaultTab: 'content' },
  web_checkbox: { name: 'תיבת סימון', icon: '☑️', allowedTabs: ['content', 'text', 'colors', 'dimensions', 'css'], defaultTab: 'content' },
  web_slider_input: { name: 'סליידר טווח', icon: '🎚️', allowedTabs: ['content', 'colors', 'dimensions', 'css'], defaultTab: 'content' },
  web_color_picker_input: { name: 'דוגם צבע', icon: '🎨', allowedTabs: ['content', 'dimensions', 'css'], defaultTab: 'content' },
  web_submit_button: { name: 'כפתור שליחת טופס', icon: '🚀', allowedTabs: TEXT_TABS, defaultTab: 'content' },

  // 6. Database & Auth Blocks
  db_connect_config: { name: 'חיבור דאטה-בייס', icon: '🗄️', allowedTabs: ['content'], defaultTab: 'content' },
  db_seed_data: { name: 'נתוני פתיחה (Seed)', icon: '🌱', allowedTabs: ['content'], defaultTab: 'content' },
  db_save_record: { name: 'שמירה לדאטה-בייס', icon: '💾', allowedTabs: ['content'], defaultTab: 'content' },
  db_render_list: { name: 'תצוגת נתונים מהדאטה-בייס', icon: '📊', allowedTabs: CONTAINER_TABS, defaultTab: 'content' },
  db_auth_action: { name: 'התחברות והרשמה', icon: '🔐', allowedTabs: ['content'], defaultTab: 'content' },
  db_session_badge: { name: 'תגית משתמש מחובר', icon: '👤', allowedTabs: ['content', 'colors', 'borders', 'dimensions', 'css'], defaultTab: 'content' },

  // Legacy blocks kept compatible for older saved files
  web_navbar: { name: 'סרגל ניווט', icon: '🧭', allowedTabs: CONTAINER_TABS, defaultTab: 'colors' },
  web_footer: { name: 'כותרת תחתונה', icon: '🦶', allowedTabs: CONTAINER_TABS, defaultTab: 'colors' },
  web_hero_section: { name: 'באנר פתיחה', icon: '🌟', allowedTabs: FULL_DESIGN_TABS, defaultTab: 'content' },
  web_grid_columns: { name: 'רשת עמודות', icon: '🪟', allowedTabs: CONTAINER_TABS, defaultTab: 'layout' },
  web_product_card: { name: 'כרטיס מוצר', icon: '🛍️', allowedTabs: FULL_DESIGN_TABS, defaultTab: 'content' },
  web_pricing_card: { name: 'טבלת מחיר', icon: '💎', allowedTabs: FULL_DESIGN_TABS, defaultTab: 'content' }
};

const ALL_TABS = {
  content: { id: 'content', label: 'תוכן', icon: '📝' },
  layout: { id: 'layout', label: 'פריסה', icon: '📐' },
  text: { id: 'text', label: 'גופן', icon: '✍️' },
  colors: { id: 'colors', label: 'צבעים', icon: '🎨' },
  dimensions: { id: 'dimensions', label: 'מידות', icon: '📏' },
  borders: { id: 'borders', label: 'מסגרות', icon: '⭕' },
  effects: { id: 'effects', label: 'אפקטים', icon: '✨' },
  css: { id: 'css', label: 'CSS חופשי', icon: '💻' }
};

const COLOR_SWATCHES = ['#0f172a', '#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#ffffff', '#f8fafc', '#e2e8f0'];

const GRADIENT_PRESETS = [
  { label: 'ללא גרדיאנט', value: 'none' },
  { label: 'כחול-סגול הייטק', value: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' },
  { label: 'שקיעה מודרנית', value: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)' },
  { label: 'אוקיינוס רענן', value: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
  { label: 'אמרלד יוקרתי', value: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
  { label: 'לילה כהה (Dark SaaS)', value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
  { label: 'זהב פרימיום', value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
];

const SHADOW_PRESETS = [
  { label: 'ללא צל', x: '0', y: '0', blur: '0', spread: '0', color: 'rgba(15,23,42,0)' },
  { label: 'צל עדין (Soft)', x: '0', y: '4', blur: '14', spread: '0', color: 'rgba(15,23,42,0.08)' },
  { label: 'כרטיס מוגבה (SaaS)', x: '0', y: '14', blur: '34', spread: '-6', color: 'rgba(15,23,42,0.16)' },
  { label: 'עומק דרמטי', x: '0', y: '25', blur: '50', spread: '-12', color: 'rgba(15,23,42,0.28)' },
  { label: 'הילה זוהרת (Glow)', x: '0', y: '0', blur: '28', spread: '2', color: 'rgba(37,99,235,0.45)' }
];

const inputStyle = {
  width: '100%',
  padding: '8px 11px',
  border: '1.5px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.86rem',
  background: '#ffffff',
  color: '#0f172a',
  outline: 'none',
  fontFamily: STANDARD_FONT,
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: '#334155',
  marginBottom: '5px',
  fontFamily: STANDARD_FONT
};

const cardSectionStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

function FieldInput({ label, value, onChange, placeholder = '', dir = 'rtl', type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, direction: dir }}
      />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function ColorPickerField({ label, value, onChange, allowTransparent = false }) {
  const safeHex = value && value.startsWith('#') && (value.length === 7 || value.length === 4) ? value : '#2563eb';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        {allowTransparent && (
          <button
            type="button"
            onClick={() => onChange('transparent')}
            style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '6px', border: '1px solid #cbd5e1', background: value === 'transparent' ? '#0f172a' : '#fff', color: value === 'transparent' ? '#fff' : '#475569', cursor: 'pointer' }}
          >
            שקוף
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input
          type="color"
          value={safeHex}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '36px', height: '34px', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff / rgba(...)"
          style={{ ...inputStyle, direction: 'ltr', fontFamily: 'monospace', fontSize: '0.8rem' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            title={c}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '5px',
              background: c,
              border: value === c ? '2px solid #2563eb' : '1px solid #cbd5e1',
              cursor: 'pointer',
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function WebBlockDesignPanel({ selectedBlock, onUpdateField, onBackToToolbox }) {
  const blockType = selectedBlock ? selectedBlock.type : null;
  const config = (blockType && ELEMENT_CONFIG[blockType]) ? ELEMENT_CONFIG[blockType] : {
    name: blockType || 'אלמנט HTML5',
    icon: '🧩',
    allowedTabs: FULL_DESIGN_TABS,
    defaultTab: 'colors'
  };

  const [activeTab, setActiveTab] = useState(config.defaultTab || 'colors');
  const [designMode, setDesignMode] = useState('normal'); // 'normal' | 'hover' | 'mobile'
  const [paddingExpanded, setPaddingExpanded] = useState(false);
  const [marginExpanded, setMarginExpanded] = useState(false);
  const [radiusExpanded, setRadiusExpanded] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#2563eb');
  const [gradientColor2, setGradientColor2] = useState('#7c3aed');
  const [gradientAngle, setGradientAngle] = useState('135deg');

  useEffect(() => {
    setActiveTab((prev) => {
      if (config.allowedTabs && !config.allowedTabs.includes(prev)) {
        return config.defaultTab || config.allowedTabs[0] || 'colors';
      }
      return prev;
    });
  }, [blockType, config.allowedTabs, config.defaultTab]);

  if (!selectedBlock) {
    return (
      <div style={{ padding: '44px 20px', textAlign: 'center', color: '#64748b', direction: 'rtl', fontFamily: STANDARD_FONT }}>
        <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🎯</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          בחר אלמנט לעיצוב
        </h3>
        <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#64748b', maxWidth: '270px', margin: '0 auto 18px' }}>
          לחץ על כל בלוק בבמה או בעץ השכבות כדי לשלוט בכל תכונות ה-CSS וה-HTML5 שלו.
        </p>
        {onBackToToolbox && (
          <button
            type="button"
            onClick={onBackToToolbox}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.86rem' }}
          >
            👁️ חזרה לתצוגה החיה
          </button>
        )}
      </div>
    );
  }

  const getVal = (field, fallback = '') => {
    if (
      selectedBlock?.customProperties &&
      Object.prototype.hasOwnProperty.call(selectedBlock.customProperties, field)
    ) {
      const customVal = selectedBlock.customProperties[field];
      return customVal === undefined || customVal === null ? fallback : customVal;
    }
    return getBlockProp(selectedBlock, field, fallback);
  };
  const setProp = (fieldName, value) => onUpdateField(selectedBlock, fieldName, value);
  const hasField = (name) => Boolean(selectedBlock.getField && selectedBlock.getField(name));

  const visibleTabs = config.allowedTabs.map((tId) => ALL_TABS[tId]).filter(Boolean);

  // Render Dynamic HTML5 Content Tab based on fields actually present on the block
  const renderContentTab = () => {
    const textFieldName = ['TEXT', 'TITLE', 'CONTENT', 'SUMMARY', 'CAPTION', 'LABEL', 'LEGEND'].find((f) => hasField(f));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {hasField('TAG') && blockType === 'web_semantic_container' && (
          <FieldSelect
            label="תגית HTML5 סמנטית:"
            value={getVal('TAG', 'section')}
            onChange={(v) => setProp('TAG', v)}
            options={[
              { label: '<section> מקטע תוכן', value: 'section' },
              { label: '<header> כותרת עליונה', value: 'header' },
              { label: '<nav> תפריט ניווט', value: 'nav' },
              { label: '<main> תוכן ראשי', value: 'main' },
              { label: '<article> מאמר / פריט', value: 'article' },
              { label: '<aside> סרגל צד', value: 'aside' },
              { label: '<footer> תחתית דף', value: 'footer' },
              { label: '<div> מיכל כללי', value: 'div' }
            ]}
          />
        )}

        {hasField('TAG') && blockType === 'web_heading' && (
          <FieldSelect
            label="רמת כותרת (Heading Level):"
            value={getVal('TAG', 'h1')}
            onChange={(v) => setProp('TAG', v)}
            options={['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((h) => ({ label: `<${h}> כותרת ${h.toUpperCase()}`, value: h }))}
          />
        )}

        {hasField('TAG') && blockType === 'web_text_format' && (
          <FieldSelect
            label="תגית טקסט סמנטית:"
            value={getVal('TAG', 'blockquote')}
            onChange={(v) => setProp('TAG', v)}
            options={[
              { label: '<blockquote> ציטוט', value: 'blockquote' },
              { label: '<mark> הדגשה (Marker)', value: 'mark' },
              { label: '<code> קוד', value: 'code' },
              { label: '<pre> בלוק קוד', value: 'pre' },
              { label: '<strong> הדגש חזק', value: 'strong' },
              { label: '<em> נטוי', value: 'em' },
              { label: '<small> אותיות קטנות', value: 'small' },
              { label: '<time> תאריך/שעה', value: 'time' }
            ]}
          />
        )}

        {textFieldName && (
          <FieldInput
            label="תוכן הטקסט:"
            value={getVal(textFieldName)}
            onChange={(v) => setProp(textFieldName, v)}
          />
        )}

        {hasField('SUBTITLE') && (
          <FieldInput label="כותרת משנה:" value={getVal('SUBTITLE')} onChange={(v) => setProp('SUBTITLE', v)} />
        )}

        {hasField('ELEMENT_ID') && (
          <FieldInput label="מזהה ייחודי (HTML id):" value={getVal('ELEMENT_ID')} onChange={(v) => setProp('ELEMENT_ID', v)} dir="ltr" placeholder="heroSection" />
        )}

        {hasField('INPUT_ID') && (
          <FieldInput label="מזהה שדה (id):" value={getVal('INPUT_ID')} onChange={(v) => setProp('INPUT_ID', v)} dir="ltr" placeholder="TextBox1" />
        )}

        {hasField('FOR_ID') && (
          <FieldInput label="מקושר לשדה (for=):" value={getVal('FOR_ID')} onChange={(v) => setProp('FOR_ID', v)} dir="ltr" placeholder="emailInput" />
        )}

        {(hasField('URL') || hasField('HREF')) && (
          <div style={cardSectionStyle}>
            <FieldInput
              label="כתובת קישור (href / URL):"
              value={hasField('URL') ? getVal('URL') : getVal('HREF')}
              onChange={(v) => setProp(hasField('URL') ? 'URL' : 'HREF', v)}
              dir="ltr"
              placeholder="services.html או https://..."
            />
            {hasField('TARGET') && (
              <FieldSelect
                label="פתיחת קישור (target):"
                value={getVal('TARGET', '_self')}
                onChange={(v) => setProp('TARGET', v)}
                options={[
                  { label: 'באותה לשונית (_self)', value: '_self' },
                  { label: 'בלשונית חדשה (_blank)', value: '_blank' }
                ]}
              />
            )}
          </div>
        )}

        {(hasField('COLLECTION') || hasField('DB_URL') || hasField('FIELD_IDS') || hasField('TARGET_ID')) && (
          <div style={cardSectionStyle}>
            {hasField('DB_MODE') && (
              <FieldSelect
                label="מנוע דאטה-בייס:"
                value={getVal('DB_MODE', 'local')}
                onChange={(v) => setProp('DB_MODE', v)}
                options={[
                  { label: '💾 מסד נתונים מקומי (SmartDB)', value: 'local' },
                  { label: '🔥 Firebase Realtime DB (REST)', value: 'firebase' },
                  { label: '🌐 שרת REST API חיצוני', value: 'rest' }
                ]}
              />
            )}
            {hasField('COLLECTION') && (
              <FieldInput label="שם טבלה / קולקציה (Collection):" value={getVal('COLLECTION')} onChange={(v) => setProp('COLLECTION', v)} dir="ltr" placeholder="projects" />
            )}
            {hasField('DB_URL') && (
              <FieldInput label="כתובת שרת / Firebase URL:" value={getVal('DB_URL')} onChange={(v) => setProp('DB_URL', v)} dir="ltr" placeholder="https://your-app-default-rtdb.firebaseio.com" />
            )}
            {hasField('FIELD_IDS') && (
              <FieldInput label="מזהי שדות לשמירה (מופרדים בפסיק):" value={getVal('FIELD_IDS')} onChange={(v) => setProp('FIELD_IDS', v)} dir="ltr" placeholder="projectTitle,clientEmail,planType" />
            )}
            {hasField('TARGET_ID') && (
              <FieldInput label="מזהה מיכל יעד:" value={getVal('TARGET_ID')} onChange={(v) => setProp('TARGET_ID', v)} dir="ltr" placeholder="dbRecordsFeed" />
            )}
            {hasField('STATUS_ID') && (
              <FieldInput label="מזהה תיבת סטטוס:" value={getVal('STATUS_ID')} onChange={(v) => setProp('STATUS_ID', v)} dir="ltr" placeholder="dbStatusOut" />
            )}
          </div>
        )}

        {hasField('SRC') && (
          <div style={cardSectionStyle}>
            {blockType === 'web_image' && (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '9px', background: '#eff6ff', border: '1.5px dashed #3b82f6', borderRadius: '8px', cursor: 'pointer', color: '#1d4ed8', fontWeight: '700', fontSize: '0.84rem' }}>
                <span>📁 העלה תמונה מהמחשב</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => ev.target?.result && setProp('SRC', ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}
            <FieldInput label="מקור קובץ / כתובת (src):" value={getVal('SRC')} onChange={(v) => setProp('SRC', v)} dir="ltr" />
            {hasField('ALT') && (
              <FieldInput label="תיאור חלופי לנגישות ו-SEO (alt):" value={getVal('ALT')} onChange={(v) => setProp('ALT', v)} />
            )}
            {hasField('POSTER') && (
              <FieldInput label="תמונת קדימון (poster):" value={getVal('POSTER')} onChange={(v) => setProp('POSTER', v)} dir="ltr" />
            )}
          </div>
        )}

        {hasField('ICON') && blockType === 'web_svg_icon' && (
          <div style={cardSectionStyle}>
            <FieldSelect
              label="אייקון וקטורי (SVG):"
              value={getVal('ICON', 'star')}
              onChange={(v) => setProp('ICON', v)}
              options={[
                { label: '⭐ כוכב', value: 'star' },
                { label: '✅ הצלחה / וי', value: 'check' },
                { label: '⚡ ברק', value: 'bolt' },
                { label: '🚀 רקטה', value: 'rocket' },
                { label: '🛒 עגלה', value: 'cart' },
                { label: '🛡️ אבטחה', value: 'shield' },
                { label: '❤️ לב', value: 'heart' },
                { label: '💎 יהלום', value: 'gem' },
                { label: '🎯 מטרה', value: 'target' },
                { label: '✏️ קוד SVG מותאם', value: 'custom' }
              ]}
            />
            {getVal('ICON') === 'custom' && (
              <FieldInput label="תגיות SVG פנימיות:" value={getVal('CUSTOM_SVG')} onChange={(v) => setProp('CUSTOM_SVG', v)} dir="ltr" />
            )}
          </div>
        )}

        {hasField('VIDEO_ID') && (
          <FieldInput label="מזהה YouTube:" value={getVal('VIDEO_ID')} onChange={(v) => setProp('VIDEO_ID', v)} dir="ltr" />
        )}

        {hasField('TYPE') && blockType === 'web_input_field' && (
          <div style={cardSectionStyle}>
            <FieldSelect
              label="סוג קלט HTML5 (type):"
              value={getVal('TYPE', 'text')}
              onChange={(v) => setProp('TYPE', v)}
              options={[
                { label: 'טקסט (text)', value: 'text' },
                { label: 'אימייל (email)', value: 'email' },
                { label: 'טלפון (tel)', value: 'tel' },
                { label: 'סיסמה (password)', value: 'password' },
                { label: 'מספר (number)', value: 'number' },
                { label: 'קישור (url)', value: 'url' },
                { label: 'חיפוש (search)', value: 'search' },
                { label: 'תאריך (date)', value: 'date' },
                { label: 'שעה (time)', value: 'time' },
                { label: 'תאריך ושעה (datetime-local)', value: 'datetime-local' },
                { label: 'העלאת קובץ (file)', value: 'file' },
                { label: 'כפתור בחירה (radio)', value: 'radio' },
                { label: 'סימון (checkbox)', value: 'checkbox' }
              ]}
            />
            {hasField('NAME') && <FieldInput label="שם שדה (name):" value={getVal('NAME')} onChange={(v) => setProp('NAME', v)} dir="ltr" />}
            {hasField('PLACEHOLDER') && <FieldInput label="טקסט רמז (placeholder):" value={getVal('PLACEHOLDER')} onChange={(v) => setProp('PLACEHOLDER', v)} />}
          </div>
        )}

        {hasField('PLACEHOLDER') && blockType !== 'web_input_field' && (
          <FieldInput label="טקסט רמז (placeholder):" value={getVal('PLACEHOLDER')} onChange={(v) => setProp('PLACEHOLDER', v)} />
        )}

        {hasField('VALUE') && (
          <FieldInput label="ערך (value):" value={getVal('VALUE')} onChange={(v) => setProp('VALUE', v)} dir="ltr" />
        )}

        {hasField('MAX') && (
          <FieldInput label="מקסימום (max):" value={getVal('MAX')} onChange={(v) => setProp('MAX', v)} dir="ltr" />
        )}

        {hasField('ACTION_TYPE') && (
          <div style={cardSectionStyle}>
            <FieldSelect
              label="⚡ פעולה בלחיצה:"
              value={getVal('ACTION_TYPE', 'alert')}
              onChange={(v) => setProp('ACTION_TYPE', v)}
              options={[
                { label: '💬 הצג הודעה קופצת', value: 'alert' },
                { label: '📄 עבור לעמוד באתר', value: 'navigate' },
                { label: '🔗 פתח קישור חיצוני', value: 'open_url' },
                { label: '🎨 שנה צבע רקע לדף', value: 'change_bg' },
                { label: '🔝 גלול לראש הדף', value: 'scroll_top' },
                { label: '💻 קוד JS חופשי', value: 'custom_js' }
              ]}
            />
            {getVal('ACTION_TYPE', 'alert') !== 'scroll_top' && (
              <FieldInput
                label="ערך הפעולה:"
                value={getVal('ACTION_VAL') || getVal('ALERT_MSG', '')}
                onChange={(v) => setProp('ACTION_VAL', v)}
                dir={getVal('ACTION_TYPE') === 'open_url' || getVal('ACTION_TYPE') === 'custom_js' ? 'ltr' : 'rtl'}
              />
            )}
          </div>
        )}

        {hasField('TARGET_PAGE') && (
          <FieldInput label="עמוד יעד לניווט:" value={getVal('TARGET_PAGE', 'index.html')} onChange={(v) => setProp('TARGET_PAGE', v)} dir="ltr" />
        )}
      </div>
    );
  };

  // Hover & Mobile Mode Panels (shown prominently when user picks :hover or Mobile mode)
  const renderHoverPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af', lineHeight: 1.5 }}>
        <strong>🖱️ מצב מעבר עכבר (:hover)</strong> — הגדרות אלו יפעלו אוטומטית כשהמשתמש ירחף עם העכבר מעל אלמנט זה!
      </div>
      <FieldSelect
        label="אפקט מהיר במעבר עכבר:"
        value={getVal('HOVER_EFFECT', 'none')}
        onChange={(v) => setProp('HOVER_EFFECT', v)}
        options={[
          { label: 'ללא אפקט מוגדר מראש', value: 'none' },
          { label: 'הרמה אלגנטית + צל (Lift)', value: 'lift' },
          { label: 'הגדלה עדינה (Zoom 1.05x)', value: 'zoom' },
          { label: 'הילה זוהרת (Glow)', value: 'glow' },
          { label: 'סיבוב קל (Tilt)', value: 'rotate' },
          { label: 'שקיפות עדינה (Fade)', value: 'fade' }
        ]}
      />
      <ColorPickerField label="צבע רקע במעבר עכבר:" value={getVal('HOVER_BG', '')} onChange={(v) => setProp('HOVER_BG', v)} allowTransparent />
      <ColorPickerField label="צבע טקסט במעבר עכבר:" value={getVal('HOVER_COLOR', '')} onChange={(v) => setProp('HOVER_COLOR', v)} />
      <ColorPickerField label="צבע מסגרת במעבר עכבר:" value={getVal('HOVER_BORDER_COLOR', '')} onChange={(v) => setProp('HOVER_BORDER_COLOR', v)} />

      <div style={cardSectionStyle}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>טרנספורמציה מדויקת ב-:hover</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <FieldInput label="הזזה Y (px)" value={getVal('HOVER_TRANSLATE_Y', '')} onChange={(v) => setProp('HOVER_TRANSLATE_Y', v)} dir="ltr" placeholder="-6px" />
          <FieldInput label="קנה מידה" value={getVal('HOVER_SCALE', '')} onChange={(v) => setProp('HOVER_SCALE', v)} dir="ltr" placeholder="1.05" />
          <FieldInput label="סיבוב (deg)" value={getVal('HOVER_ROTATE', '')} onChange={(v) => setProp('HOVER_ROTATE', v)} dir="ltr" placeholder="2deg" />
        </div>
        <FieldInput label="צל מותאם ב-:hover (box-shadow):" value={getVal('HOVER_SHADOW', '')} onChange={(v) => setProp('HOVER_SHADOW', v)} dir="ltr" placeholder="0 16px 32px rgba(37,99,235,0.3)" />
      </div>

      <div style={cardSectionStyle}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>🎯 מצב מיקוד (:focus) — לשדות טופס וכפתורים</label>
        <ColorPickerField label="צבע מסגרת ב-:focus:" value={getVal('FOCUS_BORDER_COLOR', '')} onChange={(v) => setProp('FOCUS_BORDER_COLOR', v)} />
        <FieldInput label="הילת Focus (box-shadow):" value={getVal('FOCUS_SHADOW', '')} onChange={(v) => setProp('FOCUS_SHADOW', v)} dir="ltr" placeholder="0 0 0 3px rgba(37,99,235,0.25)" />
      </div>
    </div>
  );

  const renderMobilePanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#5b21b6', lineHeight: 1.5 }}>
        <strong>📱 עיצוב רספונסיבי למובייל (@media max-width: 768px)</strong> — דורס ערכים אך ורק במסכי טלפון.
      </div>
      <FieldSelect
        label="תצוגה במובייל (display):"
        value={getVal('MOBILE_DISPLAY', '')}
        onChange={(v) => setProp('MOBILE_DISPLAY', v)}
        options={[
          { label: 'כמו בדסקטופ (ברירת מחדל)', value: '' },
          { label: 'הסתר במובייל (none)', value: 'none' },
          { label: 'בלוק מלא (block)', value: 'block' },
          { label: 'גמיש (flex)', value: 'flex' },
          { label: 'רשת (grid)', value: 'grid' }
        ]}
      />
      <FieldSelect
        label="כיוון סידור במובייל (flex-direction):"
        value={getVal('MOBILE_FLEX_DIR', '')}
        onChange={(v) => setProp('MOBILE_FLEX_DIR', v)}
        options={[
          { label: 'ללא שינוי', value: '' },
          { label: 'עמודה אנכית (column)', value: 'column' },
          { label: 'עמודה הפוכה (column-reverse)', value: 'column-reverse' },
          { label: 'שורה אופקית (row)', value: 'row' }
        ]}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <FieldInput label="רוחב במובייל:" value={getVal('MOBILE_WIDTH', '')} onChange={(v) => setProp('MOBILE_WIDTH', v)} dir="ltr" placeholder="100%" />
        <FieldInput label="ריפוד (Padding):" value={getVal('MOBILE_PADDING', '')} onChange={(v) => setProp('MOBILE_PADDING', v)} dir="ltr" placeholder="16px" />
        <FieldInput label="גודל גופן:" value={getVal('MOBILE_FONT_SIZE', '')} onChange={(v) => setProp('MOBILE_FONT_SIZE', v)} dir="ltr" placeholder="22px" />
        <FieldSelect
          label="יישור טקסט במובייל:"
          value={getVal('MOBILE_TEXT_ALIGN', '')}
          onChange={(v) => setProp('MOBILE_TEXT_ALIGN', v)}
          options={[
            { label: 'ללא שינוי', value: '' },
            { label: 'ימין', value: 'right' },
            { label: 'מרכז', value: 'center' },
            { label: 'שמאל', value: 'left' }
          ]}
        />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', direction: 'rtl', fontFamily: STANDARD_FONT }}>
      {/* Selected Block Top Identity + State Switcher */}
      <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{config.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {config.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                {blockType}
              </div>
            </div>
          </div>
          {onBackToToolbox && (
            <button
              type="button"
              onClick={onBackToToolbox}
              style={{ fontSize: '0.74rem', padding: '4px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}
            >
              👁️ תצוגה
            </button>
          )}
        </div>

        {/* Normal / :hover / Mobile State Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
          {[
            { id: 'normal', label: '✨ רגיל' },
            { id: 'hover', label: '🖱️ :hover' },
            { id: 'mobile', label: '📱 מובייל' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setDesignMode(m.id)}
              style={{
                padding: '5px 4px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: designMode === m.id ? '#ffffff' : 'transparent',
                color: designMode === m.id ? (m.id === 'hover' ? '#2563eb' : m.id === 'mobile' ? '#7c3aed' : '#0f172a') : '#475569',
                boxShadow: designMode === m.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Category Tabs (Only shown in Normal mode) */}
      {designMode === 'normal' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px 10px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          {visibleTabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '5px 9px',
                  borderRadius: '7px',
                  border: active ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  background: active ? '#eff6ff' : '#f8fafc',
                  color: active ? '#1d4ed8' : '#475569',
                  fontSize: '0.76rem',
                  fontWeight: active ? '800' : '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {designMode === 'hover' && renderHoverPanel()}
        {designMode === 'mobile' && renderMobilePanel()}

        {designMode === 'normal' && activeTab === 'content' && renderContentTab()}

        {designMode === 'normal' && activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FieldSelect
              label="סוג תצוגה (display):"
              value={getVal('DISPLAY', '')}
              onChange={(v) => setProp('DISPLAY', v)}
              options={[
                { label: 'ברירת מחדל של הבלוק', value: '' },
                { label: 'גמיש (flex)', value: 'flex' },
                { label: 'גמיש מוטמע (inline-flex)', value: 'inline-flex' },
                { label: 'רשת (grid)', value: 'grid' },
                { label: 'בלוק (block)', value: 'block' },
                { label: 'שורה-בלוק (inline-block)', value: 'inline-block' },
                { label: 'מוסתר (none)', value: 'none' }
              ]}
            />

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>📐 הגדרות מיכל Flex / Grid</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FieldSelect
                  label="כיוון (flex-direction):"
                  value={getVal('DIRECTION', 'column')}
                  onChange={(v) => setProp('DIRECTION', v)}
                  options={[
                    { label: 'שורה (row)', value: 'row' },
                    { label: 'עמודה (column)', value: 'column' },
                    { label: 'שורה הפוכה (row-reverse)', value: 'row-reverse' },
                    { label: 'עמודה הפוכה (column-reverse)', value: 'column-reverse' }
                  ]}
                />
                <FieldInput label="רווח פנימי (gap):" value={getVal('GAP', '16px')} onChange={(v) => setProp('GAP', v)} dir="ltr" placeholder="20px" />
                <FieldSelect
                  label="יישור ראשי (justify-content):"
                  value={getVal('JUSTIFY', 'flex-start')}
                  onChange={(v) => setProp('JUSTIFY', v)}
                  options={[
                    { label: 'התחלה (flex-start)', value: 'flex-start' },
                    { label: 'מרכז (center)', value: 'center' },
                    { label: 'סוף (flex-end)', value: 'flex-end' },
                    { label: 'רווח בין (space-between)', value: 'space-between' },
                    { label: 'רווח שווה (space-around)', value: 'space-around' }
                  ]}
                />
                <FieldSelect
                  label="יישור משני (align-items):"
                  value={getVal('ALIGN_ITEMS', 'stretch')}
                  onChange={(v) => setProp('ALIGN_ITEMS', v)}
                  options={[
                    { label: 'מתיחה (stretch)', value: 'stretch' },
                    { label: 'מרכז (center)', value: 'center' },
                    { label: 'התחלה (flex-start)', value: 'flex-start' },
                    { label: 'סוף (flex-end)', value: 'flex-end' }
                  ]}
                />
              </div>
              <FieldInput
                label="תבנית עמודות Grid (grid-template-columns):"
                value={getVal('GRID_COLS', '')}
                onChange={(v) => setProp('GRID_COLS', v)}
                dir="ltr"
                placeholder="repeat(auto-fit, minmax(260px, 1fr))"
              />
            </div>

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>🧩 התנהגות כפריט בתוך Flex / Grid</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FieldInput label="גדילה (flex-grow):" value={getVal('FLEX_GROW', '')} onChange={(v) => setProp('FLEX_GROW', v)} dir="ltr" placeholder="1" />
                <FieldInput label="בסיס (flex-basis):" value={getVal('FLEX_BASIS', '')} onChange={(v) => setProp('FLEX_BASIS', v)} dir="ltr" placeholder="280px" />
                <FieldSelect
                  label="יישור עצמי (align-self):"
                  value={getVal('ALIGN_SELF', 'auto')}
                  onChange={(v) => setProp('ALIGN_SELF', v)}
                  options={[
                    { label: 'אוטומטי', value: 'auto' },
                    { label: 'מרכז', value: 'center' },
                    { label: 'התחלה', value: 'flex-start' },
                    { label: 'סוף', value: 'flex-end' },
                    { label: 'מתיחה', value: 'stretch' }
                  ]}
                />
                <FieldInput label="מיזוג עמודות (grid-column):" value={getVal('GRID_COL_SPAN', '')} onChange={(v) => setProp('GRID_COL_SPAN', v)} dir="ltr" placeholder="span 2" />
              </div>
            </div>

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>📌 מיקום מתקדם ושכבות (position & z-index)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FieldSelect
                  label="מיקום (position):"
                  value={getVal('POSITION', 'static')}
                  onChange={(v) => setProp('POSITION', v)}
                  options={[
                    { label: 'רגיל (static)', value: 'static' },
                    { label: 'יחסי (relative)', value: 'relative' },
                    { label: 'מוחלט (absolute)', value: 'absolute' },
                    { label: 'דביק בגלילה (sticky)', value: 'sticky' },
                    { label: 'קבוע למסך (fixed)', value: 'fixed' }
                  ]}
                />
                <FieldInput label="שכבה (z-index):" value={getVal('Z_INDEX', '')} onChange={(v) => setProp('Z_INDEX', v)} dir="ltr" placeholder="10" />
              </div>
              {getVal('POSITION', 'static') !== 'static' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                  <FieldInput label="top" value={getVal('POS_TOP', '')} onChange={(v) => setProp('POS_TOP', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="right" value={getVal('POS_RIGHT', '')} onChange={(v) => setProp('POS_RIGHT', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="bottom" value={getVal('POS_BOTTOM', '')} onChange={(v) => setProp('POS_BOTTOM', v)} dir="ltr" placeholder="" />
                  <FieldInput label="left" value={getVal('POS_LEFT', '')} onChange={(v) => setProp('POS_LEFT', v)} dir="ltr" placeholder="" />
                </div>
              )}
            </div>
          </div>
        )}

        {designMode === 'normal' && activeTab === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FieldSelect
              label="משפחת גופנים (Google Fonts):"
              value={getVal('FONT') || getVal('FONT_FAMILY', 'inherit')}
              onChange={(v) => setProp('FONT', v)}
              options={[
                { label: 'ברירת מחדל של האתר', value: 'inherit' },
                { label: 'Heebo (הייטק / SaaS)', value: "'Heebo', sans-serif" },
                { label: 'Rubik (מודרני ועגול)', value: "'Rubik', sans-serif" },
                { label: 'Assistant (קריא ונקי)', value: "'Assistant', sans-serif" },
                { label: 'Secular One (כותרות עוצמתיות)', value: "'Secular One', sans-serif" },
                { label: 'Varela Round (רך וידידותי)', value: "'Varela Round', sans-serif" },
                { label: 'Inter / Poppins (אנגלית Pro)', value: "'Poppins', 'Inter', sans-serif" },
                { label: 'קוד (Monospace)', value: "ui-monospace, Menlo, monospace" }
              ]}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <FieldInput label="גודל גופן (font-size):" value={getVal('FONT_SIZE') || getVal('SIZE', '')} onChange={(v) => setProp('FONT_SIZE', v)} dir="ltr" placeholder="18px / 2.5rem" />
              <FieldSelect
                label="משקל גופן (weight):"
                value={getVal('FONT_WEIGHT', '400')}
                onChange={(v) => setProp('FONT_WEIGHT', v)}
                options={[
                  { label: 'דק (300)', value: '300' },
                  { label: 'רגיל (400)', value: '400' },
                  { label: 'בינוני (500)', value: '500' },
                  { label: 'מודגש (700)', value: '700' },
                  { label: 'עבה מאוד (800)', value: '800' },
                  { label: 'Black (900)', value: '900' }
                ]}
              />
              <FieldSelect
                label="יישור טקסט:"
                value={getVal('ALIGN') || getVal('TEXT_ALIGN', 'right')}
                onChange={(v) => setProp('ALIGN', v)}
                options={[
                  { label: 'ימין (right)', value: 'right' },
                  { label: 'מרכז (center)', value: 'center' },
                  { label: 'שמאל (left)', value: 'left' },
                  { label: 'מיושר לשני הצדדים (justify)', value: 'justify' }
                ]}
              />
              <FieldInput label="גובה שורה (line-height):" value={getVal('LINE_HEIGHT', '')} onChange={(v) => setProp('LINE_HEIGHT', v)} dir="ltr" placeholder="1.6" />
              <FieldInput label="מרווח אותיות:" value={getVal('LETTER_SPACING', '')} onChange={(v) => setProp('LETTER_SPACING', v)} dir="ltr" placeholder="-0.5px" />
              <FieldSelect
                label="קו / קישוט טקסט:"
                value={getVal('TEXT_DECORATION', 'none')}
                onChange={(v) => setProp('TEXT_DECORATION', v)}
                options={[
                  { label: 'ללא', value: 'none' },
                  { label: 'קו תחתון', value: 'underline' },
                  { label: 'קו חוצה', value: 'line-through' }
                ]}
              />
            </div>

            <FieldSelect
              label="🌈 טקסט בגרדיאנט (Gradient Text):"
              value={getVal('TEXT_GRADIENT', 'none')}
              onChange={(v) => setProp('TEXT_GRADIENT', v)}
              options={[
                { label: 'כבוי (צבע רגיל)', value: 'none' },
                { label: 'כחול-סגול זוהר', value: 'linear-gradient(135deg, #2563eb, #9333ea)' },
                { label: 'ורוד-כתום שקיעה', value: 'linear-gradient(135deg, #f97316, #db2777)' },
                { label: 'טורקיז-אמרלד', value: 'linear-gradient(135deg, #06b6d4, #10b981)' },
                { label: 'זהב יוקרתי', value: 'linear-gradient(135deg, #fbbf24, #d97706)' }
              ]}
            />

            <div style={cardSectionStyle}>
              <FieldInput
                label={`צל טקסט (Text Shadow): ${getVal('TEXT_SHADOW_SIZE', '0')}px`}
                value={getVal('TEXT_SHADOW_SIZE', '0')}
                onChange={(v) => setProp('TEXT_SHADOW_SIZE', v)}
                type="range"
              />
              <ColorPickerField label="צבע צל טקסט:" value={getVal('TEXT_SHADOW_COLOR', 'rgba(0,0,0,0.35)')} onChange={(v) => setProp('TEXT_SHADOW_COLOR', v)} />
            </div>
          </div>
        )}

        {designMode === 'normal' && activeTab === 'colors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ColorPickerField label="צבע טקסט:" value={getVal('TEXT_COLOR') || getVal('COLOR', '#0f172a')} onChange={(v) => setProp('TEXT_COLOR', v)} />
            <ColorPickerField label="צבע רקע:" value={getVal('BG_COLOR', '#ffffff')} onChange={(v) => setProp('BG_COLOR', v)} allowTransparent />

            <div style={cardSectionStyle}>
              <FieldSelect
                label="תבנית גרדיאנט מוכנה:"
                value={getVal('GRADIENT', 'none')}
                onChange={(v) => setProp('GRADIENT', v)}
                options={GRADIENT_PRESETS}
              />
              <label style={{ ...labelStyle, marginBottom: 0 }}>בונה גרדיאנט חופשי:</label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} style={{ width: '36px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }} />
                <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} style={{ width: '36px', height: '32px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }} />
                <select value={gradientAngle} onChange={(e) => setGradientAngle(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                  <option value="135deg">אלכסון 135°</option>
                  <option value="90deg">אופקי 90°</option>
                  <option value="180deg">אנכי 180°</option>
                </select>
                <button
                  type="button"
                  onClick={() => setProp('GRADIENT', `linear-gradient(${gradientAngle}, ${gradientColor1}, ${gradientColor2})`)}
                  style={{ padding: '7px 10px', borderRadius: '7px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  החל
                </button>
              </div>
            </div>

            <div style={cardSectionStyle}>
              <FieldInput label="🖼️ תמונת רקע (URL או ריק לביטול):" value={getVal('BG_IMAGE', '')} onChange={(v) => setProp('BG_IMAGE', v)} dir="ltr" placeholder="https://images.unsplash.com/..." />
              {getVal('BG_IMAGE', '') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <FieldSelect
                    label="שכבת הצללה (Overlay):"
                    value={getVal('BG_OVERLAY', 'none')}
                    onChange={(v) => setProp('BG_OVERLAY', v)}
                    options={[
                      { label: 'ללא הצללה', value: 'none' },
                      { label: 'כהה עדין (35%)', value: 'rgba(15,23,42,0.35)' },
                      { label: 'כהה מודרני (55%)', value: 'rgba(15,23,42,0.55)' },
                      { label: 'כהה דרמטי (75%)', value: 'rgba(15,23,42,0.75)' },
                      { label: 'בהיר חלבי (65%)', value: 'rgba(255,255,255,0.65)' }
                    ]}
                  />
                  <FieldSelect
                    label="אפקט גלילה (Parallax):"
                    value={getVal('BG_ATTACHMENT', 'scroll')}
                    onChange={(v) => setProp('BG_ATTACHMENT', v)}
                    options={[
                      { label: 'רגיל (scroll)', value: 'scroll' },
                      { label: 'פרלקס קבוע (fixed)', value: 'fixed' }
                    ]}
                  />
                </div>
              )}
            </div>

            <FieldInput
              label={`שקיפות (Opacity): ${getVal('OPACITY', '1')}`}
              value={getVal('OPACITY', '1')}
              onChange={(v) => setProp('OPACITY', v)}
              dir="ltr"
              placeholder="0.1 עד 1"
            />
          </div>
        )}

        {designMode === 'normal' && activeTab === 'dimensions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blockType === 'web_image' && (
              <div style={{ ...cardSectionStyle, background: '#eff6ff', borderColor: '#bfdbfe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e40af' }}>
                    🖼️ גודל תמונה מהיר (ללא חיתוך):
                  </span>
                  <span style={{ fontSize: '0.73rem', color: '#3b82f6', fontWeight: '600' }}>
                    גובה: auto שומר פרופורציות מלאות
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'אוטומטי', val: 'auto' },
                    { label: '150px', val: '150px' },
                    { label: '250px', val: '250px' },
                    { label: '400px', val: '400px' },
                    { label: '600px', val: '600px' },
                    { label: '50%', val: '50%' },
                    { label: '100%', val: '100%' }
                  ].map((preset) => {
                    const isActive = getVal('WIDTH', '') === preset.val;
                    return (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setProp('WIDTH', preset.val)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '7px',
                          border: isActive ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                          background: isActive ? '#2563eb' : '#ffffff',
                          color: isActive ? '#ffffff' : '#334155',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <FieldSelect
                  label="התאמת תמונה במסגרת (object-fit):"
                  value={getVal('OBJECT_FIT', 'contain')}
                  onChange={(v) => setProp('OBJECT_FIT', v)}
                  options={[
                    { label: 'הצג תמונה במלואה ללא חיתוך (contain)', value: 'contain' },
                    { label: 'מילוי מלא של המסגרת — עלול לחתוך (cover)', value: 'cover' },
                    { label: 'מתיחה לגבולות המסגרת (fill)', value: 'fill' },
                    { label: 'הקטנה בלבד ללא חיתוך (scale-down)', value: 'scale-down' }
                  ]}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <FieldInput label="רוחב (width):" value={getVal('WIDTH', '')} onChange={(v) => setProp('WIDTH', v)} dir="ltr" placeholder="250px / 50% / auto" />
              <FieldInput label="רוחב מקסימלי (max-width):" value={getVal('MAX_WIDTH', '')} onChange={(v) => setProp('MAX_WIDTH', v)} dir="ltr" placeholder="100% / none" />
              <FieldInput label="גובה (height):" value={getVal('HEIGHT', '')} onChange={(v) => setProp('HEIGHT', v)} dir="ltr" placeholder="auto / 300px" />
              <FieldInput label="גובה מינימלי (min-height):" value={getVal('MIN_HEIGHT', '')} onChange={(v) => setProp('MIN_HEIGHT', v)} dir="ltr" placeholder="auto / 200px" />
              <FieldSelect
                label="יחס גובה-רוחב (aspect-ratio):"
                value={getVal('ASPECT_RATIO', 'auto')}
                onChange={(v) => setProp('ASPECT_RATIO', v)}
                options={[
                  { label: 'אוטומטי (auto)', value: 'auto' },
                  { label: 'ריבוע (1 / 1)', value: '1 / 1' },
                  { label: 'קולנועי (16 / 9)', value: '16 / 9' },
                  { label: 'קלאסי (4 / 3)', value: '4 / 3' },
                  { label: 'אנכי (3 / 4)', value: '3 / 4' }
                ]}
              />
              <FieldSelect
                label="גלישת תוכן (overflow):"
                value={getVal('OVERFLOW', 'visible')}
                onChange={(v) => setProp('OVERFLOW', v)}
                options={[
                  { label: 'רגיל (visible)', value: 'visible' },
                  { label: 'חתוך בגבולות (hidden)', value: 'hidden' },
                  { label: 'גלילה אוטומטית (auto)', value: 'auto' }
                ]}
              />
            </div>

            <div style={cardSectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>ריפוד פנימי (Padding):</label>
                <button type="button" onClick={() => setPaddingExpanded(!paddingExpanded)} style={{ fontSize: '0.73rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
                  {paddingExpanded ? 'מצב פשוט' : '4 צדדים מדויקים'}
                </button>
              </div>
              {!paddingExpanded ? (
                <FieldInput label="ריפוד (לדוגמה: 24px או 16px 32px):" value={getVal('PADDING', '')} onChange={(v) => setProp('PADDING', v)} dir="ltr" placeholder="24px" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                  <FieldInput label="למעלה" value={getVal('PADDING_TOP', '')} onChange={(v) => setProp('PADDING_TOP', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="ימין" value={getVal('PADDING_RIGHT', '')} onChange={(v) => setProp('PADDING_RIGHT', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="למטה" value={getVal('PADDING_BOTTOM', '')} onChange={(v) => setProp('PADDING_BOTTOM', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="שמאל" value={getVal('PADDING_LEFT', '')} onChange={(v) => setProp('PADDING_LEFT', v)} dir="ltr" placeholder="0" />
                </div>
              )}
            </div>

            <div style={cardSectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>שוליים חיצוניים (Margin):</label>
                <button type="button" onClick={() => setMarginExpanded(!marginExpanded)} style={{ fontSize: '0.73rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
                  {marginExpanded ? 'מצב פשוט' : '4 צדדים מדויקים'}
                </button>
              </div>
              {!marginExpanded ? (
                <FieldInput label="שוליים (למרכוז כתוב: 0 auto):" value={getVal('MARGIN', '')} onChange={(v) => setProp('MARGIN', v)} dir="ltr" placeholder="0 auto 24px auto" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                  <FieldInput label="למעלה" value={getVal('MARGIN_TOP', '')} onChange={(v) => setProp('MARGIN_TOP', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="ימין" value={getVal('MARGIN_RIGHT', '')} onChange={(v) => setProp('MARGIN_RIGHT', v)} dir="ltr" placeholder="auto" />
                  <FieldInput label="למטה" value={getVal('MARGIN_BOTTOM', '')} onChange={(v) => setProp('MARGIN_BOTTOM', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="שמאל" value={getVal('MARGIN_LEFT', '')} onChange={(v) => setProp('MARGIN_LEFT', v)} dir="ltr" placeholder="auto" />
                </div>
              )}
            </div>
          </div>
        )}

        {designMode === 'normal' && activeTab === 'borders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={cardSectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>עיגול פינות (Border Radius):</label>
                <button type="button" onClick={() => setRadiusExpanded(!radiusExpanded)} style={{ fontSize: '0.73rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>
                  {radiusExpanded ? 'פינות אחידות' : 'שליטה בכל פינה'}
                </button>
              </div>
              {!radiusExpanded ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <FieldInput label="ערך (px / %):" value={getVal('RADIUS') || getVal('BORDER_RADIUS', '')} onChange={(v) => setProp('RADIUS', v)} dir="ltr" placeholder="16px" />
                  </div>
                  <button type="button" onClick={() => setProp('RADIUS', '999px')} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>גלולה</button>
                  <button type="button" onClick={() => setProp('RADIUS', '50%')} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>עיגול</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <FieldInput label="עליונה שמאל" value={getVal('RADIUS_TL', '')} onChange={(v) => setProp('RADIUS_TL', v)} dir="ltr" placeholder="16px" />
                  <FieldInput label="עליונה ימין" value={getVal('RADIUS_TR', '')} onChange={(v) => setProp('RADIUS_TR', v)} dir="ltr" placeholder="16px" />
                  <FieldInput label="תחתונה ימין" value={getVal('RADIUS_BR', '')} onChange={(v) => setProp('RADIUS_BR', v)} dir="ltr" placeholder="0" />
                  <FieldInput label="תחתונה שמאל" value={getVal('RADIUS_BL', '')} onChange={(v) => setProp('RADIUS_BL', v)} dir="ltr" placeholder="0" />
                </div>
              )}
            </div>

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>מסגרת (Border):</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FieldInput label="עובי (border-width):" value={getVal('BORDER_WIDTH', '0px')} onChange={(v) => setProp('BORDER_WIDTH', v)} dir="ltr" placeholder="1px" />
                <FieldSelect
                  label="סגנון:"
                  value={getVal('BORDER_STYLE', 'solid')}
                  onChange={(v) => setProp('BORDER_STYLE', v)}
                  options={[
                    { label: 'רציף (solid)', value: 'solid' },
                    { label: 'מקווקו (dashed)', value: 'dashed' },
                    { label: 'נקודות (dotted)', value: 'dotted' },
                    { label: 'כפול (double)', value: 'double' }
                  ]}
                />
              </div>
              <FieldSelect
                label="צד המסגרת:"
                value={getVal('BORDER_SIDE', 'all')}
                onChange={(v) => setProp('BORDER_SIDE', v)}
                options={[
                  { label: 'כל המסגרת (4 צדדים)', value: 'all' },
                  { label: 'עליון בלבד (border-top)', value: 'top' },
                  { label: 'ימין בלבד (border-right)', value: 'right' },
                  { label: 'תחתון בלבד (border-bottom)', value: 'bottom' },
                  { label: 'שמאל בלבד (border-left)', value: 'left' }
                ]}
              />
              <ColorPickerField label="צבע מסגרת:" value={getVal('BORDER_COLOR', '#cbd5e1')} onChange={(v) => setProp('BORDER_COLOR', v)} />
            </div>
          </div>
        )}

        {designMode === 'normal' && activeTab === 'effects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>🌑 בונה הצללות (Box Shadow Builder)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {SHADOW_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setProp('SHADOW_X', p.x);
                      setProp('SHADOW_Y', p.y);
                      setProp('SHADOW_BLUR', p.blur);
                      setProp('SHADOW_SPREAD', p.spread);
                      setProp('SHADOW_COLOR', p.color);
                    }}
                    style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                <FieldInput label="X" value={getVal('SHADOW_X', '')} onChange={(v) => setProp('SHADOW_X', v)} dir="ltr" placeholder="0" />
                <FieldInput label="Y" value={getVal('SHADOW_Y', '')} onChange={(v) => setProp('SHADOW_Y', v)} dir="ltr" placeholder="12" />
                <FieldInput label="טשטוש" value={getVal('SHADOW_BLUR', '')} onChange={(v) => setProp('SHADOW_BLUR', v)} dir="ltr" placeholder="28" />
                <FieldInput label="התפשטות" value={getVal('SHADOW_SPREAD', '')} onChange={(v) => setProp('SHADOW_SPREAD', v)} dir="ltr" placeholder="0" />
              </div>
              <ColorPickerField label="צבע הצל:" value={getVal('SHADOW_COLOR', 'rgba(15,23,42,0.18)')} onChange={(v) => setProp('SHADOW_COLOR', v)} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={getVal('SHADOW_INSET', '') === 'true' || getVal('SHADOW_INSET', false) === true}
                  onChange={(e) => setProp('SHADOW_INSET', e.target.checked ? 'true' : '')}
                />
                <span>צל פנימי (inset)</span>
              </label>
            </div>

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>🔄 טרנספורמציה 2D (Transform)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                <FieldInput label="הזזה X" value={getVal('TRANSLATE_X', '')} onChange={(v) => setProp('TRANSLATE_X', v)} dir="ltr" placeholder="0px" />
                <FieldInput label="הזזה Y" value={getVal('TRANSLATE_Y', '')} onChange={(v) => setProp('TRANSLATE_Y', v)} dir="ltr" placeholder="0px" />
                <FieldInput label="קנה מידה" value={getVal('SCALE', '')} onChange={(v) => setProp('SCALE', v)} dir="ltr" placeholder="1" />
                <FieldInput label="סיבוב" value={getVal('ROTATE', '')} onChange={(v) => setProp('ROTATE', v)} dir="ltr" placeholder="0deg" />
              </div>
            </div>

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>🧊 זכוכית ופילטרים (Glassmorphism & Filters)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FieldInput label="טשטוש רקע (backdrop-blur px):" value={getVal('BLUR_AMOUNT', '')} onChange={(v) => setProp('BLUR_AMOUNT', v)} dir="ltr" placeholder="12" />
                <FieldInput label="בהירות % (brightness):" value={getVal('FILTER_BRIGHTNESS', '')} onChange={(v) => setProp('FILTER_BRIGHTNESS', v)} dir="ltr" placeholder="100" />
                <FieldInput label="ניגודיות % (contrast):" value={getVal('FILTER_CONTRAST', '')} onChange={(v) => setProp('FILTER_CONTRAST', v)} dir="ltr" placeholder="100" />
                <FieldInput label="רוויה % (saturate):" value={getVal('FILTER_SATURATE', '')} onChange={(v) => setProp('FILTER_SATURATE', v)} dir="ltr" placeholder="100" />
              </div>
            </div>

            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>🎞️ אנימציות ומעברים (Animations)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <FieldSelect
                  label="אנימציה:"
                  value={getVal('ANIMATION', 'none')}
                  onChange={(v) => setProp('ANIMATION', v)}
                  options={[
                    { label: 'ללא אנימציה', value: 'none' },
                    { label: 'כניסה מלמטה (Fade Up)', value: 'fadeInUp' },
                    { label: 'כניסה מהצד (Slide In)', value: 'slideInRight' },
                    { label: 'ריחוף אינסופי (Float)', value: 'float' },
                    { label: 'דופק עדין (Pulse)', value: 'pulse' },
                    { label: 'זוהר פועם (Glow)', value: 'glow_pulse' }
                  ]}
                />
                <FieldInput label="מהירות מעבר (Transition):" value={getVal('TRANSITION_DURATION', '0.25s')} onChange={(v) => setProp('TRANSITION_DURATION', v)} dir="ltr" placeholder="0.25s" />
              </div>
            </div>
          </div>
        )}

        {designMode === 'normal' && activeTab === 'css' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={cardSectionStyle}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>🏷️ תכונות HTML5 גלובליות (Attributes)</label>
              <FieldInput label="מחלקות CSS (class):" value={getVal('CSS_CLASS', '')} onChange={(v) => setProp('CSS_CLASS', v)} dir="ltr" placeholder="hero-btn shadow-lg" />
              <FieldInput label="תיאור בריחוף (title):" value={getVal('TITLE_ATTR', '')} onChange={(v) => setProp('TITLE_ATTR', v)} />
              <FieldInput label="תווית נגישות (aria-label):" value={getVal('ARIA_LABEL', '')} onChange={(v) => setProp('ARIA_LABEL', v)} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={getVal('IS_HIDDEN', '') === 'true' || getVal('IS_HIDDEN', false) === true}
                  onChange={(e) => setProp('IS_HIDDEN', e.target.checked ? 'true' : '')}
                />
                <span>הסתר אלמנט בדף (hidden)</span>
              </label>
            </div>

            <div>
              <label style={labelStyle}>💻 CSS ישיר על האלמנט (Inline style):</label>
              <textarea
                rows={3}
                value={getVal('CUSTOM_INLINE_CSS', '')}
                onChange={(e) => setProp('CUSTOM_INLINE_CSS', e.target.value)}
                placeholder="clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);"
                style={{ ...inputStyle, direction: 'ltr', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={labelStyle}>🎨 חוקי CSS ממוקדים (& = האלמנט הזה, כולל ::before / :nth-child):</label>
              <textarea
                rows={4}
                value={getVal('CUSTOM_BLOCK_CSS', '')}
                onChange={(e) => setProp('CUSTOM_BLOCK_CSS', e.target.value)}
                placeholder={`&:hover { filter: brightness(1.08); }\n&::after { content: ""; display: block; }`}
                style={{ ...inputStyle, direction: 'ltr', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
