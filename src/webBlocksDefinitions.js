import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

// =========================================================================
// 🌐 WEBLOCKS: ADVANCED UNIVERSAL CSS ENGINE & COMPOSABLE HTML BLOCKS
// =========================================================================

// Helper to normalize numeric values (e.g. "25" -> "25px", "50%" -> "50%", "50vh" -> "50vh")
export const normalizeCssUnit = (val, defaultUnit = 'px') => {
  if (!val || typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === 'auto' || trimmed === 'none' || trimmed === 'inherit' || trimmed === 'fit-content') {
    return trimmed;
  }
  // If it's a pure number or decimal without unit, append default unit
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}${defaultUnit}`;
  }
  return trimmed;
};

// Safe property retriever from both Blockly Fields and customProperties
export const getBlockProp = (block, fieldName, fallback = '') => {
  if (!block) return fallback;
  try {
    if (typeof block.getField === 'function' && block.getField(fieldName)) {
      const val = block.getFieldValue(fieldName);
      if (val !== null && val !== undefined && val !== '') return val;
    }
  } catch (e) {}
  if (block.customProperties && block.customProperties[fieldName] !== undefined && block.customProperties[fieldName] !== '') {
    return block.customProperties[fieldName];
  }
  return fallback;
};

// Universal CSS Style Builder: Merges base block styles with all custom CSS properties
export const buildUniversalStyleString = (block, defaultStyles = {}) => {
  const styles = { ...defaultStyles };

  // 1. Colors, Gradients, Background Image & Background
  const bgImage = getBlockProp(block, 'BG_IMAGE');
  const bgSize = getBlockProp(block, 'BG_SIZE', 'cover');
  const bgPosition = getBlockProp(block, 'BG_POSITION', 'center');
  const bgRepeat = getBlockProp(block, 'BG_REPEAT', 'no-repeat');

  const gradient = getBlockProp(block, 'GRADIENT');
  const bg = getBlockProp(block, 'BG_COLOR');

  if (bgImage && bgImage !== 'none' && bgImage !== '') {
    const imgUrl = bgImage.startsWith('url(') ? bgImage : `url('${bgImage}')`;
    if (gradient && gradient !== 'none') {
      styles['background-image'] = `${gradient}, ${imgUrl}`;
    } else {
      styles['background-image'] = imgUrl;
    }
    styles['background-size'] = bgSize;
    styles['background-position'] = bgPosition;
    styles['background-repeat'] = bgRepeat;
    if (bg && bg !== 'transparent') styles['background-color'] = bg;
  } else if (gradient && gradient !== 'none') {
    styles['background'] = gradient;
  } else if (bg && bg !== 'transparent') {
    styles['background-color'] = bg;
  } else if (bg === 'transparent') {
    styles['background-color'] = 'transparent';
  }

  const color = getBlockProp(block, 'TEXT_COLOR') || getBlockProp(block, 'COLOR');
  if (color) styles['color'] = color;

  const opacity = getBlockProp(block, 'OPACITY');
  if (opacity && opacity !== '1' && opacity !== '100%') styles['opacity'] = opacity;

  // 2. Typography & Fonts (Full Rich Text Suite)
  const font = getBlockProp(block, 'FONT') || getBlockProp(block, 'FONT_FAMILY');
  if (font && font !== 'inherit') styles['font-family'] = font;

  const fontSize = getBlockProp(block, 'FONT_SIZE') || getBlockProp(block, 'SIZE');
  if (fontSize) styles['font-size'] = normalizeCssUnit(fontSize, 'px');

  const fontWeight = getBlockProp(block, 'FONT_WEIGHT');
  if (fontWeight) styles['font-weight'] = fontWeight;

  const align = getBlockProp(block, 'ALIGN') || getBlockProp(block, 'TEXT_ALIGN');
  if (align) styles['text-align'] = align;

  const textDecoration = getBlockProp(block, 'TEXT_DECORATION');
  if (textDecoration && textDecoration !== 'none') styles['text-decoration'] = textDecoration;

  const fontStyle = getBlockProp(block, 'FONT_STYLE');
  if (fontStyle && fontStyle !== 'normal') styles['font-style'] = fontStyle;

  const lineHeight = getBlockProp(block, 'LINE_HEIGHT');
  if (lineHeight) styles['line-height'] = lineHeight;

  const letterSpacing = getBlockProp(block, 'LETTER_SPACING');
  if (letterSpacing && letterSpacing !== '0px') styles['letter-spacing'] = normalizeCssUnit(letterSpacing, 'px');

  // Custom Slider Text Shadow
  const customTextShadowSize = getBlockProp(block, 'TEXT_SHADOW_SIZE');
  const customTextShadowColor = getBlockProp(block, 'TEXT_SHADOW_COLOR', '#000000');
  const textShadowPreset = getBlockProp(block, 'TEXT_SHADOW');

  if (customTextShadowSize && parseInt(customTextShadowSize, 10) > 0) {
    const s = parseInt(customTextShadowSize, 10);
    styles['text-shadow'] = `0 ${Math.round(s/2)}px ${s}px ${customTextShadowColor}`;
  } else if (textShadowPreset && textShadowPreset !== 'none') {
    styles['text-shadow'] = textShadowPreset;
  }

  // 3. Spacing & Dimensions (Width, Height, Padding, Margin, Min-Height)
  const padding = getBlockProp(block, 'PADDING');
  if (padding) styles['padding'] = normalizeCssUnit(padding, 'px');

  const margin = getBlockProp(block, 'MARGIN');
  if (margin) styles['margin'] = normalizeCssUnit(margin, 'px');

  const width = getBlockProp(block, 'WIDTH');
  if (width) styles['width'] = normalizeCssUnit(width, '%');

  const height = getBlockProp(block, 'HEIGHT');
  if (height && height !== 'auto') {
    const normH = normalizeCssUnit(height, 'px');
    styles['height'] = normH;
    styles['min-height'] = normH; // Guarantees visual expansion in Flexbox!
  }

  const minHeight = getBlockProp(block, 'MIN_HEIGHT');
  if (minHeight) styles['min-height'] = normalizeCssUnit(minHeight, 'px');

  const maxWidth = getBlockProp(block, 'MAX_WIDTH');
  if (maxWidth && maxWidth !== 'none') styles['max-width'] = normalizeCssUnit(maxWidth, '%');

  // 4. Borders & Radius
  const radius = getBlockProp(block, 'RADIUS') || getBlockProp(block, 'BORDER_RADIUS');
  if (radius) styles['border-radius'] = normalizeCssUnit(radius, 'px');

  const borderWidth = getBlockProp(block, 'BORDER_WIDTH');
  const borderStyle = getBlockProp(block, 'BORDER_STYLE', 'solid');
  const borderColor = getBlockProp(block, 'BORDER_COLOR', '#cbd5e1');
  if (borderWidth && borderWidth !== '0px' && borderWidth !== '0') {
    styles['border'] = `${normalizeCssUnit(borderWidth, 'px')} ${borderStyle} ${borderColor}`;
  } else if (borderWidth === '0px' || borderWidth === '0') {
    styles['border'] = 'none';
  }

  // 5. Custom Slider Box Shadow
  const customShadowSize = getBlockProp(block, 'SHADOW_SIZE');
  const customShadowBlur = getBlockProp(block, 'SHADOW_BLUR');
  const customShadowColor = getBlockProp(block, 'SHADOW_COLOR', 'rgba(0,0,0,0.2)');
  const shadowPreset = getBlockProp(block, 'SHADOW') || getBlockProp(block, 'BOX_SHADOW');

  if (customShadowSize !== '' && customShadowSize !== undefined && parseInt(customShadowSize, 10) > 0) {
    const sz = parseInt(customShadowSize, 10);
    const blr = customShadowBlur ? parseInt(customShadowBlur, 10) : sz * 2;
    styles['box-shadow'] = `0 ${Math.round(sz/2)}px ${blr}px ${customShadowColor}`;
  } else if (shadowPreset && shadowPreset !== 'none') {
    styles['box-shadow'] = shadowPreset;
  } else if (shadowPreset === 'none' || customShadowSize === '0') {
    styles['box-shadow'] = 'none';
  }

  // Custom Slider Blur / Backdrop Blur
  const customBlur = getBlockProp(block, 'BLUR_AMOUNT');
  if (customBlur && parseInt(customBlur, 10) > 0) {
    styles['backdrop-filter'] = `blur(${customBlur}px)`;
    styles['-webkit-backdrop-filter'] = `blur(${customBlur}px)`;
  } else {
    const backdropBlur = getBlockProp(block, 'BACKDROP_BLUR');
    if (backdropBlur && backdropBlur !== 'none') {
      styles['backdrop-filter'] = backdropBlur;
      styles['-webkit-backdrop-filter'] = backdropBlur;
    }
  }

  const filter = getBlockProp(block, 'FILTER');
  if (filter && filter !== 'none') styles['filter'] = filter;

  const rotate = getBlockProp(block, 'ROTATE');
  if (rotate && rotate !== '0deg' && rotate !== '0' && rotate !== 0) {
    styles['transform'] = `rotate(${normalizeCssUnit(String(rotate), 'deg')})`;
  }

  const cursor = getBlockProp(block, 'CURSOR');
  if (cursor && cursor !== 'default') styles['cursor'] = cursor;

  // 6. Continuous Animation Class/Style
  const anim = getBlockProp(block, 'ANIMATION');
  if (anim === 'pulse') styles['animation'] = 'smartPulse 2s infinite ease-in-out';
  else if (anim === 'float') styles['animation'] = 'smartFloat 3s infinite ease-in-out';
  else if (anim === 'glow_pulse') styles['animation'] = 'smartGlowPulse 2s infinite alternate';

  styles['box-sizing'] = 'border-box';
  styles['transition'] = 'all 0.25s ease';

  // Convert style object to CSS string
  return Object.entries(styles)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
};

// Universal Hover Handler attributes
export const buildHoverAttributes = (block) => {
  const hoverEffect = getBlockProp(block, 'HOVER_EFFECT', 'none');
  if (hoverEffect === 'lift') {
    return `onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 15px 30px -5px rgba(0,0,0,0.18)'" onmouseout="this.style.transform=''; this.style.boxShadow=''"`;
  }
  if (hoverEffect === 'zoom') {
    return `onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"`;
  }
  if (hoverEffect === 'rotate') {
    return `onmouseover="this.style.transform='rotate(3deg) scale(1.03)'" onmouseout="this.style.transform='rotate(0deg) scale(1)'"`;
  }
  if (hoverEffect === 'glow') {
    return `onmouseover="this.style.boxShadow='0 0 30px rgba(37,99,235,0.55)'" onmouseout="this.style.boxShadow=''"`;
  }
  if (hoverEffect === 'fade') {
    return `onmouseover="this.style.opacity='0.75'" onmouseout="this.style.opacity='1'"`;
  }
  return '';
};

export function registerWebBlocks() {
  if (!javascriptGenerator.forBlock) {
    javascriptGenerator.forBlock = {};
  }

  const setGen = (name, fn) => {
    javascriptGenerator.forBlock[name] = fn;
    javascriptGenerator[name] = fn;
  };

  // ---------------------------------------------------------
  // 1. 🧱 מבנה ושלד (STRUCTURE & FULL FLEXBOX CONTAINERS)
  // ---------------------------------------------------------

  // Page Wrapper (Main Container)
  Blockly.Blocks['web_page_container'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📄 דף ראשי (Container)");
      this.appendDummyInput()
          .appendField("צבע רקע:")
          .appendField(new Blockly.FieldTextInput("#f8fafc"), "BG_COLOR")
          .appendField("גופן:")
          .appendField(new Blockly.FieldDropdown([
            ["גופן רגיל", "Arial, sans-serif"],
            ["Heebo (מודרני)", "Heebo, sans-serif"],
            ["Assistant", "Assistant, sans-serif"],
            ["Rubik", "Rubik, sans-serif"],
            ["Secular One", "Secular One, sans-serif"],
            ["Varela Round", "Varela Round, sans-serif"]
          ]), "FONT");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("תוכן הדף:");
      this.setColour('#3b82f6');
      this.setTooltip("מעטפת ראשית לכל האתר - קובעת רקע, גופן ופריסה");
    }
  };
  setGen('web_page_container', function(block) {
    const bg = getBlockProp(block, 'BG_COLOR', '#f8fafc');
    const font = getBlockProp(block, 'FONT', 'Arial, sans-serif');
    const align = getBlockProp(block, 'ALIGN_ITEMS', 'stretch');
    const justify = getBlockProp(block, 'JUSTIFY', 'flex-start');
    const gap = getBlockProp(block, 'GAP', '0px');
    const padding = getBlockProp(block, 'PADDING', '24px');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'min-height': '100vh',
      'background-color': bg,
      'font-family': font,
      'padding': padding,
      'direction': 'rtl',
      'display': 'flex',
      'flex-direction': 'column',
      'align-items': align,
      'justify-content': justify,
      'gap': gap,
      'width': '100%',
      'overflow-x': 'hidden'
    });

    return `<div data-block-id="${block.id}" style="${styleStr}">\n${children}</div>\n`;
  });

  // Card Box (Modular box with Flexbox support & Guaranteed Height sizing)
  Blockly.Blocks['web_card'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📦 כרטיסייה מעוצבת (Card)");
      this.appendDummyInput()
          .appendField("צבע:")
          .appendField(new Blockly.FieldTextInput("#ffffff"), "BG_COLOR")
          .appendField("עיגול:")
          .appendField(new Blockly.FieldDropdown([
            ["קל (8px)", "8px"],
            ["בינוני (16px)", "16px"],
            ["עגול (24px)", "24px"],
            ["ענק (32px)", "32px"],
            ["ללא (0px)", "0px"]
          ]), "RADIUS");
      this.appendDummyInput()
          .appendField("צללית:")
          .appendField(new Blockly.FieldDropdown([
            ["עדינה", "0 4px 6px -1px rgba(0,0,0,0.1)"],
            ["עמוקה 3D", "0 20px 25px -5px rgba(0,0,0,0.12)"],
            ["זוהר כחול", "0 0 25px rgba(37,99,235,0.2)"],
            ["ללא צל", "none"]
          ]), "SHADOW");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("תוכן הכרטיסייה:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#6366f1');
      this.setTooltip("יוצר כרטיסייה מעוצבת להכלת אלמנטים");
    }
  };
  setGen('web_card', function(block) {
    const bg = getBlockProp(block, 'BG_COLOR', '#ffffff');
    const radius = getBlockProp(block, 'RADIUS', '16px');
    const shadow = getBlockProp(block, 'SHADOW', '0 4px 6px -1px rgba(0,0,0,0.1)');
    const dir = getBlockProp(block, 'DIRECTION', 'column');
    const justify = getBlockProp(block, 'JUSTIFY', 'flex-start');
    const align = getBlockProp(block, 'ALIGN_ITEMS', 'stretch');
    const gap = getBlockProp(block, 'GAP', '14px');
    const padding = getBlockProp(block, 'PADDING', '24px');
    const margin = getBlockProp(block, 'MARGIN', '0 0 20px 0');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'border-radius': radius,
      'box-shadow': shadow,
      'padding': padding,
      'margin': margin,
      'border': '1px solid rgba(0,0,0,0.06)',
      'width': '100%',
      'display': 'flex',
      'flex-direction': dir,
      'justify-content': justify,
      'align-items': align,
      'gap': gap
    });

    const hoverAttr = buildHoverAttributes(block) || `onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'"`;

    return `<div data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>\n${children}</div>\n`;
  });

  // Flexbox Row / Container (Complete Flex Layout with Direction, Justify, Align, Wrap & Gap)
  Blockly.Blocks['web_row_flex'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📐 תיבת Flexbox (פריסה וסידור)");
      this.appendDummyInput()
          .appendField("כיוון:")
          .appendField(new Blockly.FieldDropdown([
            ["↔️ שורה (Row)", "row"],
            ["↕️ טור (Column)", "column"],
            ["🔄 שורה הפוכה", "row-reverse"],
            ["🔃 טור הפוך", "column-reverse"]
          ]), "DIRECTION")
          .appendField("יישור:")
          .appendField(new Blockly.FieldDropdown([
            ["ימין", "flex-start"],
            ["מרכז", "center"],
            ["שמאל", "flex-end"],
            ["פיזור שווה", "space-between"]
          ]), "JUSTIFY");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("אלמנטים בפנים:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#8b5cf6');
      this.setTooltip("מסדר וממקם אלמנטים עם מנוע Flexbox מלא");
    }
  };
  setGen('web_row_flex', function(block) {
    const dir = getBlockProp(block, 'DIRECTION', 'row');
    const justify = getBlockProp(block, 'JUSTIFY', 'flex-start');
    const align = getBlockProp(block, 'ALIGN_ITEMS', 'center');
    const wrap = getBlockProp(block, 'WRAP', 'wrap');
    const gap = getBlockProp(block, 'GAP', '16px');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'display': 'flex',
      'flex-direction': dir,
      'justify-content': justify,
      'align-items': align,
      'flex-wrap': wrap,
      'gap': gap,
      'width': '100%',
      'margin': '4px 0'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<div data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>\n${children}</div>\n`;
  });

  // Divider Line
  Blockly.Blocks['web_divider'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("➖ קו מפריד מעוצב | צבע:")
          .appendField(new Blockly.FieldTextInput("#e2e8f0"), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#94a3b8');
      this.setTooltip("מוסיף קו מפריד אסתטי בין מקטעים");
    }
  };
  setGen('web_divider', function(block) {
    const color = getBlockProp(block, 'COLOR', '#e2e8f0');
    const styleStr = buildUniversalStyleString(block, {
      'border': 'none',
      'border-top': `1px solid ${color}`,
      'margin': '24px 0',
      'width': '100%'
    });
    return `<hr data-block-id="${block.id}" style="${styleStr}" />\n`;
  });

  // Spacer
  Blockly.Blocks['web_spacer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↕️ מרווח גובה (Spacer) | גובה:")
          .appendField(new Blockly.FieldDropdown([
            ["קטן (16px)", "16px"],
            ["בינוני (32px)", "32px"],
            ["גדול (48px)", "48px"],
            ["ענק (64px)", "64px"]
          ]), "HEIGHT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#cbd5e1');
      this.setTooltip("מוסיף רווח אנכי בין אלמנטים");
    }
  };
  setGen('web_spacer', function(block) {
    const h = getBlockProp(block, 'HEIGHT', '32px');
    return `<div data-block-id="${block.id}" style="height: ${h}; width: 100%;"></div>\n`;
  });

  // ---------------------------------------------------------
  // 2. 🧭 סרגלי ניווט (NAVBARS - WITH LIVE TEXT STYLING)
  // ---------------------------------------------------------

  Blockly.Blocks['web_navbar'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🧭 סרגל ניווט (Navbar)");
      this.appendDummyInput()
          .appendField("סגנון:")
          .appendField(new Blockly.FieldDropdown([
            ["☰ המבורגר נפתח", "hamburger"],
            ["🚀 קלאסי + כפתור", "classic_cta"],
            ["🧊 צף מעוגל", "floating_pill"],
            ["✨ מרכז", "centered"]
          ]), "STYLE_TYPE")
          .appendField("שם האתר:")
          .appendField(new Blockly.FieldTextInput("העסק שלי 🚀"), "TITLE");
      this.appendDummyInput()
          .appendField("יישור:")
          .appendField(new Blockly.FieldDropdown([
            ["ימין", "right"],
            ["מרכז", "center"],
            ["שמאל", "left"]
          ]), "ALIGN")
          .appendField("כפתור:")
          .appendField(new Blockly.FieldTextInput("צור קשר 🚀"), "CTA_TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f172a');
      this.setTooltip("סרגל ניווט עם שליטה מלאה בכל מאפייני ה-CSS ועיצוב הטקסט");
    }
  };
  setGen('web_navbar', function(block) {
    const styleType = getBlockProp(block, 'STYLE_TYPE', 'classic_cta');
    const title = getBlockProp(block, 'TITLE', 'האתר שלי');
    const align = getBlockProp(block, 'ALIGN', 'right');
    const ctaText = getBlockProp(block, 'CTA_TEXT', '');
    const bg = getBlockProp(block, 'BG_COLOR', '#1e293b');
    const text = getBlockProp(block, 'TEXT_COLOR', '#ffffff');
    const font = getBlockProp(block, 'FONT', 'inherit');
    const customFontSize = getBlockProp(block, 'FONT_SIZE', '');
    const customFontWeight = getBlockProp(block, 'FONT_WEIGHT', '800');
    const customTextShadow = getBlockProp(block, 'TEXT_SHADOW', '');
    const customLetterSpacing = getBlockProp(block, 'LETTER_SPACING', '');
    const ctaPage = getBlockProp(block, 'CTA_PAGE', 'contact.html');
    const navId = `nav_${Math.random().toString(36).substr(2, 6)}`;

    const titleFontSize = customFontSize ? normalizeCssUnit(customFontSize, 'px') : '1.35rem';
    const titleFontWeight = customFontWeight || '800';
    const titleStyle = `margin: 0; font-size: ${titleFontSize}; font-weight: ${titleFontWeight}; color: ${text}; font-family: ${font}; ${customTextShadow ? `text-shadow: ${customTextShadow};` : ''} ${customLetterSpacing ? `letter-spacing: ${customLetterSpacing};` : ''}`;

    const ctaButtonHtml = ctaText ? `<a href="${ctaPage}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 8px 18px; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(37,99,235,0.3); transition: all 0.2s;">${ctaText}</a>` : '';

    const baseNavStyles = {
      'background-color': bg,
      'color': text,
      'font-family': font,
      'padding': '14px 24px',
      'border-radius': '12px',
      'display': 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'width': '100%',
      'margin-bottom': '24px',
      'box-shadow': '0 4px 15px rgba(0,0,0,0.15)',
      'position': 'relative'
    };

    if (styleType === 'floating_pill') {
      baseNavStyles['border-radius'] = '9999px';
      baseNavStyles['backdrop-filter'] = 'blur(12px)';
    }

    const styleStr = buildUniversalStyleString(block, baseNavStyles);
    const hoverAttr = buildHoverAttributes(block);

    if (styleType === 'hamburger') {
      return `<nav data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>
  <div style="display: flex; align-items: center; gap: 12px; ${align === 'center' ? 'flex: 1; justify-content: center;' : ''}">
    <button onclick="var d=document.getElementById('${navId}_drawer'); d.style.display=(d.style.display==='none'||!d.style.display)?'flex':'none'" style="background: rgba(255,255,255,0.12); border: none; color: ${text}; padding: 8px 14px; font-size: 1.2rem; border-radius: 8px; cursor: pointer;">☰</button>
    <h2 style="${titleStyle}">${title}</h2>
  </div>
  ${ctaButtonHtml}
  <div id="${navId}_drawer" style="display: none; position: absolute; top: 100%; right: 0; width: 220px; background: ${bg}; border-radius: 0 0 12px 12px; padding: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); flex-direction: column; gap: 10px; z-index: 100; border-top: 1px solid rgba(255,255,255,0.1);">
    <a href="index.html" style="color: ${text}; text-decoration: none; font-weight: 600; padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.06);">🏠 דף הבית</a>
    <a href="about.html" style="color: ${text}; text-decoration: none; font-weight: 600; padding: 8px; border-radius: 6px;">ℹ️ אודות</a>
    <a href="services.html" style="color: ${text}; text-decoration: none; font-weight: 600; padding: 8px; border-radius: 6px;">💼 שירותים</a>
    <a href="contact.html" style="color: ${text}; text-decoration: none; font-weight: 600; padding: 8px; border-radius: 6px;">📞 צור קשר</a>
  </div>
</nav>\n`;
    }

    if (styleType === 'centered') {
      return `<nav data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>
  <h2 style="${titleStyle} margin-bottom: 10px;">${title}</h2>
  <div style="display: flex; justify-content: center; gap: 24px; font-weight: 600;">
    <a href="index.html" style="color: ${text}; text-decoration: none;">ראשי</a>
    <a href="about.html" style="color: ${text}; text-decoration: none;">אודות</a>
    <a href="services.html" style="color: ${text}; text-decoration: none;">שירותים</a>
    <a href="contact.html" style="color: ${text}; text-decoration: none;">צור קשר</a>
  </div>
</nav>\n`;
    }

    return `<nav data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>
  <h2 style="${titleStyle} ${align === 'center' ? 'flex: 1; text-align: center;' : ''}">${title}</h2>
  <div style="display: flex; align-items: center; gap: 18px;">
    <a href="index.html" style="color: ${text}; text-decoration: none; font-weight: 500;">ראשי</a>
    <a href="about.html" style="color: ${text}; text-decoration: none; font-weight: 500;">אודות</a>
    <a href="services.html" style="color: ${text}; text-decoration: none; font-weight: 500;">שירותים</a>
    ${ctaButtonHtml}
  </div>
</nav>\n`;
  });

  // Custom Navbar Container
  Blockly.Blocks['web_navbar_custom'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🧭 מעטפת סרגל ניווט מותאם (Custom Navbar)");
      this.appendDummyInput()
          .appendField("צבע רקע:")
          .appendField(new Blockly.FieldTextInput("#1e293b"), "BG_COLOR");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("אלמנטים בתוך הסרגל:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f172a');
      this.setTooltip("סרגל ניווט מותאם אישית מאפס עם תמיכת CSS מלאה");
    }
  };
  setGen('web_navbar_custom', function(block) {
    const bg = getBlockProp(block, 'BG_COLOR', '#1e293b');
    const justify = getBlockProp(block, 'JUSTIFY', 'space-between');
    const align = getBlockProp(block, 'ALIGN_ITEMS', 'center');
    const gap = getBlockProp(block, 'GAP', '14px');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'padding': '14px 24px',
      'border-radius': '12px',
      'display': 'flex',
      'flex-direction': 'row',
      'justify-content': justify,
      'align-items': align,
      'flex-wrap': 'wrap',
      'gap': gap,
      'width': '100%',
      'margin-bottom': '24px',
      'box-shadow': '0 4px 12px rgba(0,0,0,0.1)'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<nav data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>\n${children}</nav>\n`;
  });

  // Footer Block
  Blockly.Blocks['web_footer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🦶 חלק תחתון (Footer)");
      this.appendDummyInput()
          .appendField("שם מותג:")
          .appendField(new Blockly.FieldTextInput("SmartStart Web"), "BRAND");
      this.appendDummyInput()
          .appendField("זכויות יוצרים:")
          .appendField(new Blockly.FieldTextInput("כל הזכויות שמורות © 2026"), "COPYRIGHT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f172a');
      this.setTooltip("פוטר תחתון עם שליטה מלאה בעיצוב CSS");
    }
  };
  setGen('web_footer', function(block) {
    const brand = getBlockProp(block, 'BRAND', 'SmartStart');
    const copyright = getBlockProp(block, 'COPYRIGHT', 'כל הזכויות שמורות');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#0f172a',
      'color': '#94a3b8',
      'border-radius': '16px',
      'padding': '32px 24px',
      'width': '100%',
      'margin-top': '40px',
      'text-align': 'center'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<footer data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-bottom: 10px;">${brand}</h3>
  <p style="font-size: 0.9rem; max-width: 500px; margin: 0 auto 16px auto; line-height: 1.5;">האתר נבנה בגאווה בעזרת סטודיו הבלוקים WebBlocks!</p>
  <div style="display: flex; justify-content: center; gap: 18px; margin-bottom: 16px; font-weight: 600;">
    <a href="index.html" style="color: #38bdf8; text-decoration: none;">ראשי</a>
    <a href="about.html" style="color: #38bdf8; text-decoration: none;">אודות</a>
    <a href="services.html" style="color: #38bdf8; text-decoration: none;">שירותים</a>
    <a href="contact.html" style="color: #38bdf8; text-decoration: none;">צור קשר</a>
  </div>
  <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin-bottom: 14px;" />
  <div style="font-size: 0.82rem;">${copyright}</div>
</footer>\n`;
  });

  // ---------------------------------------------------------
  // 3. ✍️ טקסט וכותרות (TYPOGRAPHY)
  // ---------------------------------------------------------

  // Heading Block
  Blockly.Blocks['web_heading'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("✍️ כותרת:")
          .appendField(new Blockly.FieldTextInput("ברוכים הבאים לאתר שלי!"), "TEXT");
      this.appendDummyInput()
          .appendField("סוג:")
          .appendField(new Blockly.FieldDropdown([
            ["H1 (ראשית)", "h1"],
            ["H2 (משנית)", "h2"],
            ["H3", "h3"],
            ["H4", "h4"]
          ]), "TAG")
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("heading_1"), "ELEMENT_ID")
          .appendField("יישור:")
          .appendField(new Blockly.FieldDropdown([
            ["ימין", "right"],
            ["מרכז", "center"],
            ["שמאל", "left"]
          ]), "ALIGN");
      this.appendValueInput("DYNAMIC_TEXT")
          .setCheck(null)
          .appendField("טקסט דינמי (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0284c7');
      this.setTooltip("כותרת מעוצבת עם מזהה ושליטת גופן מלאה");
    }
  };
  // Helper to resolve initial element text (supports static text or connected string blocks)
  function resolveElementInitialText(block, inputName, staticFieldName, defaultFallback) {
    let dynVal = javascriptGenerator.valueToCode(block, inputName, javascriptGenerator.ORDER_ATOMIC);
    if (dynVal && dynVal !== "''") {
      let clean = dynVal.trim();
      if ((clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith('"') && clean.endsWith('"'))) {
        return clean.slice(1, -1);
      }
    }
    return getBlockProp(block, staticFieldName, defaultFallback);
  }

  // Helper to inject runtime script when a dynamic expression (e.g. TextBox.Text) is connected directly to a text element
  function generateDynamicBindingScript(block, elementId, inputName) {
    let dynVal = javascriptGenerator.valueToCode(block, inputName, javascriptGenerator.ORDER_ATOMIC);
    if (dynVal && dynVal !== "''") {
      let clean = dynVal.trim();
      if (!((clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith('"') && clean.endsWith('"')))) {
        const cleanId = elementId.replace(/[^a-zA-Z0-9_]/g, '_');
        return `<script>
(function() {
  function update_${cleanId}() {
    try {
      var val = ${dynVal};
      if (val !== undefined && val !== null && val !== '') {
        smartSetText('${elementId}', val);
      }
    } catch(e) {}
  }
  document.addEventListener('DOMContentLoaded', function() {
    update_${cleanId}();
    document.querySelectorAll('input, textarea, select').forEach(function(i) {
      i.addEventListener('input', update_${cleanId});
      i.addEventListener('change', update_${cleanId});
    });
    document.querySelectorAll('button').forEach(function(b) {
      b.addEventListener('click', function() {
        setTimeout(update_${cleanId}, 10);
      });
    });
  });
})();
</script>\n`;
      }
    }
    return '';
  }

  setGen('web_heading', function(block) {
    const text = resolveElementInitialText(block, 'DYNAMIC_TEXT', 'TEXT', '');
    const tag = getBlockProp(block, 'TAG', 'h1');
    const elementId = getBlockProp(block, 'ELEMENT_ID', `heading_${Math.random().toString(36).substr(2, 4)}`);
    const color = getBlockProp(block, 'COLOR', '#0f172a');
    const align = getBlockProp(block, 'ALIGN', 'right');

    const styleStr = buildUniversalStyleString(block, {
      'color': color,
      'text-align': align,
      'margin': '4px 0',
      'font-weight': 'bold'
    });

    const hoverAttr = buildHoverAttributes(block);
    const bindScript = generateDynamicBindingScript(block, elementId, 'DYNAMIC_TEXT');

    return `<${tag} id="${elementId}" data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>${text}</${tag}>\n${bindScript}`;
  });

  // Paragraph Block
  Blockly.Blocks['web_paragraph'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📝 פסקת טקסט:")
          .appendField(new Blockly.FieldTextInput("זהו אתר חדש שנבנה באמצעות בלוקים!"), "TEXT");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("paragraph_1"), "ELEMENT_ID")
          .appendField("גודל:")
          .appendField(new Blockly.FieldDropdown([
            ["רגיל (16px)", "16px"],
            ["גדול (18px)", "18px"],
            ["קטן (14px)", "14px"]
          ]), "SIZE");
      this.appendValueInput("DYNAMIC_TEXT")
          .setCheck(null)
          .appendField("טקסט דינמי (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0ea5e9');
      this.setTooltip("פסקת טקסט עם מזהה ושליטת טיפוגרפיה ו-CSS מלאה");
    }
  };
  setGen('web_paragraph', function(block) {
    const text = resolveElementInitialText(block, 'DYNAMIC_TEXT', 'TEXT', '');
    const elementId = getBlockProp(block, 'ELEMENT_ID', `para_${Math.random().toString(36).substr(2, 4)}`);
    const color = getBlockProp(block, 'COLOR', '#475569');
    const size = getBlockProp(block, 'SIZE', '16px');

    const styleStr = buildUniversalStyleString(block, {
      'color': color,
      'font-size': size,
      'line-height': '1.6',
      'margin': '0 0 12px 0'
    });

    const hoverAttr = buildHoverAttributes(block);
    const bindScript = generateDynamicBindingScript(block, elementId, 'DYNAMIC_TEXT');

    return `<p id="${elementId}" data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>${text}</p>\n${bindScript}`;
  });

  // Badge Block
  Blockly.Blocks['web_badge'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🏷️ תגית (Badge):")
          .appendField(new Blockly.FieldTextInput("חדש! 🔥"), "TEXT");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("badge_1"), "ELEMENT_ID")
          .appendField("צבע רקע:")
          .appendField(new Blockly.FieldTextInput("#dbeafe"), "BG_COLOR");
      this.appendValueInput("DYNAMIC_TEXT")
          .setCheck(null)
          .appendField("טקסט דינמי (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#38bdf8');
      this.setTooltip("תגית מעוצבת עם מזהה");
    }
  };
  setGen('web_badge', function(block) {
    const text = resolveElementInitialText(block, 'DYNAMIC_TEXT', 'TEXT', 'תגית');
    const elementId = getBlockProp(block, 'ELEMENT_ID', `badge_${Math.random().toString(36).substr(2, 4)}`);
    const bg = getBlockProp(block, 'BG_COLOR', '#dbeafe');
    const color = getBlockProp(block, 'TEXT_COLOR', '#1e40af');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'color': color,
      'padding': '4px 12px',
      'border-radius': '9999px',
      'font-size': '0.85rem',
      'font-weight': 'bold',
      'display': 'inline-block',
      'margin-bottom': '8px'
    });

    const hoverAttr = buildHoverAttributes(block);
    const bindScript = generateDynamicBindingScript(block, elementId, 'DYNAMIC_TEXT');

    return `<span id="${elementId}" data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>${text}</span>\n${bindScript}`;
  });

  // Bullet point item
  Blockly.Blocks['web_bullet_item'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("✅ פריט ברשימה | אייקון:")
          .appendField(new Blockly.FieldDropdown([
            ["✅ V ירוק", "✅"],
            ["🚀 טיל", "🚀"],
            ["⭐ כוכב", "⭐"],
            ["💡 נורה", "💡"],
            ["🔹 נקודה כחולה", "🔹"]
          ]), "ICON");
      this.appendDummyInput()
          .appendField("טקסט:")
          .appendField(new Blockly.FieldTextInput("שירות מהיר ומקצועי ללא פשרות"), "TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip("מוסיף פריט עם אייקון לרשימת יתרונות");
    }
  };
  setGen('web_bullet_item', function(block) {
    const icon = getBlockProp(block, 'ICON', '✅');
    const text = getBlockProp(block, 'TEXT', '');

    const styleStr = buildUniversalStyleString(block, {
      'display': 'flex',
      'align-items': 'center',
      'gap': '10px',
      'margin-bottom': '10px',
      'font-size': '1rem',
      'color': '#334155'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<div data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>\n  <span>${icon}</span>\n  <span style="font-weight: 600;">${text}</span>\n</div>\n`;
  });

  // Legacy Text
  Blockly.Blocks["html_text"] = {
    init: function () {
      this.appendDummyInput().appendField("טקסט:").appendField(new Blockly.FieldTextInput("שלום עולם"), "TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
    },
  };
  setGen("html_text", function (block) {
    const text = getBlockProp(block, "TEXT", "שלום עולם");
    const styleStr = buildUniversalStyleString(block, {});
    return `<p data-block-id="${block.id}" style="${styleStr}">${text}</p>\n`;
  });

  // ---------------------------------------------------------
  // 4. 🖼️ מדיה ותמונות (MEDIA)
  // ---------------------------------------------------------

  // Image Block
  Blockly.Blocks['web_image'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🖼️ תמונה | קישור URL:")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop"), "SRC");
      this.appendDummyInput()
          .appendField("רוחב:")
          .appendField(new Blockly.FieldDropdown([
            ["100% (רוחב מלא)", "100%"],
            ["300px (בינוני)", "300px"],
            ["150px (קטן)", "150px"]
          ]), "WIDTH")
          .appendField("פינות:")
          .appendField(new Blockly.FieldDropdown([
            ["כן (12px)", "12px"],
            ["עיגול מלא (50%)", "50%"],
            ["ללא (0px)", "0px"]
          ]), "RADIUS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip("תמונה מעוצבת עם שליטת גודל ופינות ב-CSS");
    }
  };
  setGen('web_image', function(block) {
    const src = getBlockProp(block, 'SRC', '');
    const width = getBlockProp(block, 'WIDTH', '100%');
    const radius = getBlockProp(block, 'RADIUS', '12px');

    const styleStr = buildUniversalStyleString(block, {
      'width': width,
      'max-width': '100%',
      'height': 'auto',
      'border-radius': radius,
      'display': 'block',
      'margin': '12px 0',
      'box-shadow': '0 4px 6px rgba(0,0,0,0.05)'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<img data-block-id="${block.id}" src="${src}" alt="תמונה" style="${styleStr}" ${hoverAttr} />\n`;
  });

  // Video Embed Block (YouTube)
  Blockly.Blocks['web_video_embed'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎬 סרטון וידאו (YouTube Embed)");
      this.appendDummyInput()
          .appendField("מזהה סרטון:")
          .appendField(new Blockly.FieldTextInput("dQw4w9WgXcQ"), "VIDEO_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ef4444');
      this.setTooltip("מטמיע נגן וידאו מיוטיוב בתוך האתר");
    }
  };
  setGen('web_video_embed', function(block) {
    const vid = getBlockProp(block, 'VIDEO_ID', 'dQw4w9WgXcQ');
    return `<div data-block-id="${block.id}" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 14px; margin: 16px 0; box-shadow: 0 8px 20px rgba(0,0,0,0.15); width: 100%;">\n  <iframe src="https://www.youtube.com/embed/${vid}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>\n</div>\n`;
  });

  // ---------------------------------------------------------
  // 5. 🔘 כפתורים מודולריים שמרכיבים בלוקים בתוכם (COMPOSABLE BUTTONS)
  // ---------------------------------------------------------

  // Helper to extract executable JS for button click handlers
  // Helper to separate pure JS actions from HTML elements snapped inside container statements
  function separateJsAndHtml(rawCode) {
    let jsParts = [];
    let htmlParts = [];
    
    let lines = (rawCode || '').split('\n');
    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('<script>') && trimmed.endsWith('</script>')) {
        let js = trimmed.slice(8, -9).trim();
        if (js) jsParts.push(js);
      } else if (trimmed.startsWith('<')) {
        htmlParts.push(line);
      } else {
        jsParts.push(trimmed);
      }
    }
    return {
      js: jsParts.join('; '),
      html: htmlParts.join('\n')
    };
  }

  // 🔘 כפתור עם פעולות מורכבות בתוכו (User snaps any action blocks INSIDE!)
  Blockly.Blocks['web_button_with_actions'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔘 כפתור פעולה | טקסט:")
          .appendField(new Blockly.FieldTextInput("לחץ עלי! 🚀"), "LABEL");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("⚡ בעת לחיצה (OnClick) בצע:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("כפתור המפעיל את כל הבלוקים שמורכבים בתוכו בעת לחיצה!");
    }
  };
  setGen('web_button_with_actions', function(block) {
    const label = getBlockProp(block, 'LABEL', 'לחץ עלי');
    const bg = getBlockProp(block, 'BG_COLOR', '#2563eb');
    const text = getBlockProp(block, 'TEXT_COLOR', '#ffffff');

    let genCode = javascriptGenerator.statementToCode(block, 'DO') || '';
    let parsed = separateJsAndHtml(genCode);

    let clickJs = parsed.js.trim() || `alert('לחצת על הכפתור!')`;
    const clickAttr = `onclick="${clickJs.replace(/"/g, "'")}"`;

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'color': text,
      'border': 'none',
      'padding': '12px 24px',
      'font-size': '1rem',
      'font-weight': 'bold',
      'border-radius': '10px',
      'cursor': 'pointer',
      'box-shadow': '0 4px 14px rgba(37,99,235,0.25)',
      'margin': '6px 0',
      'display': 'inline-block'
    });

    const hoverAttr = buildHoverAttributes(block) || `onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"`;

    return `<div data-block-id="${block.id}" style="margin: 6px 0; text-align: right;">\n  <button type="button" ${clickAttr} style="${styleStr}" ${hoverAttr}>${label}</button>\n  ${parsed.html ? `<div style="margin-top: 8px;">${parsed.html}</div>\n` : ''}</div>\n`;
  });

  // Standard Interactive Button Block (Also supports inner DO statements)
  Blockly.Blocks['web_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔘 כפתור פעולה | טקסט:")
          .appendField(new Blockly.FieldTextInput("לחץ כאן! 🚀"), "LABEL");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("⚡ בעת לחיצה בצע:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("כפתור מעוצב שמפעיל את הבלוקים שבתוכו בלחיצה");
    }
  };
  setGen('web_button', function(block) {
    const label = getBlockProp(block, 'LABEL', 'כפתור');
    const bg = getBlockProp(block, 'BG_COLOR', '#2563eb');
    const text = getBlockProp(block, 'TEXT_COLOR', '#ffffff');
    const alertMsg = getBlockProp(block, 'ALERT_MSG', '');

    let genCode = javascriptGenerator.statementToCode(block, 'DO') || '';
    let parsed = separateJsAndHtml(genCode);

    let clickHandler = '';
    if (parsed.js.trim()) {
      clickHandler = `onclick="${parsed.js.trim().replace(/"/g, "'")}"`;
    } else if (alertMsg) {
      clickHandler = `onclick="alert('${alertMsg.replace(/'/g, "\\'")}')"`;
    } else {
      clickHandler = `onclick="alert('שלום! ✨')"`;
    }

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'color': text,
      'border': 'none',
      'padding': '10px 22px',
      'font-size': '1rem',
      'font-weight': 'bold',
      'border-radius': '10px',
      'cursor': 'pointer',
      'box-shadow': '0 4px 12px rgba(37,99,235,0.2)',
      'margin': '6px 0'
    });

    const hoverAttr = buildHoverAttributes(block) || `onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"`;

    return `<div data-block-id="${block.id}" style="margin: 6px 0; text-align: right;">\n  <button type="button" ${clickHandler} style="${styleStr}" ${hoverAttr}>${label}</button>\n  ${parsed.html ? `<div style="margin-top: 8px;">${parsed.html}</div>\n` : ''}</div>\n`;
  });

  // Page Link Button (Navigate between website pages)
  Blockly.Blocks['web_button_link'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔗 כפתור מעבר עמוד | טקסט:")
          .appendField(new Blockly.FieldTextInput("מעבר לעמוד אודות ↗️"), "LABEL");
      this.appendDummyInput()
          .appendField("עמוד יעד:")
          .appendField(new Blockly.FieldDropdown([
            ["דף הבית (index.html)", "index.html"],
            ["אודות (about.html)", "about.html"],
            ["שירותים (services.html)", "services.html"],
            ["צור קשר (contact.html)", "contact.html"]
          ]), "TARGET_PAGE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#3b82f6');
      this.setTooltip("כפתור שמנווט לעמוד אחר בתוך האתר");
    }
  };
  setGen('web_button_link', function(block) {
    const label = getBlockProp(block, 'LABEL', 'עבור עמוד');
    const page = getBlockProp(block, 'TARGET_PAGE', 'index.html');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#2563eb',
      'color': '#ffffff',
      'text-decoration': 'none',
      'padding': '10px 22px',
      'font-size': '1rem',
      'font-weight': 'bold',
      'border-radius': '10px',
      'display': 'inline-block',
      'margin': '6px 0',
      'box-shadow': '0 4px 12px rgba(37,99,235,0.2)'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<a data-block-id="${block.id}" href="${page}" style="${styleStr}" ${hoverAttr}>${label}</a>\n`;
  });

  // Direct WhatsApp Contact Button
  Blockly.Blocks['web_whatsapp_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💬 כפתור WhatsApp | טלפון:")
          .appendField(new Blockly.FieldTextInput("0501234567"), "PHONE");
      this.appendDummyInput()
          .appendField("טקסט:")
          .appendField(new Blockly.FieldTextInput("שלח הודעה ב-WhatsApp 💬"), "LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#22c55e');
      this.setTooltip("כפתור שפותח שיחת וואטסאפ ישירה עם העסק");
    }
  };
  setGen('web_whatsapp_button', function(block) {
    const phone = (getBlockProp(block, 'PHONE', '0500000000')).replace(/[^0-9]/g, '');
    const label = getBlockProp(block, 'LABEL', 'וואטסאפ');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#22c55e',
      'color': '#ffffff',
      'text-decoration': 'none',
      'padding': '10px 22px',
      'font-size': '1rem',
      'font-weight': 'bold',
      'border-radius': '10px',
      'display': 'inline-flex',
      'align-items': 'center',
      'gap': '8px',
      'margin': '6px 0',
      'box-shadow': '0 4px 12px rgba(34,197,94,0.3)'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<a data-block-id="${block.id}" href="https://wa.me/972${phone.startsWith('0') ? phone.slice(1) : phone}" target="_blank" rel="noopener noreferrer" style="${styleStr}" ${hoverAttr}>${label}</a>\n`;
  });

  // Direct Call Button
  Blockly.Blocks['web_call_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📞 כפתור חיוג טלפוני | מספר:")
          .appendField(new Blockly.FieldTextInput("03-1234567"), "PHONE");
      this.appendDummyInput()
          .appendField("טקסט:")
          .appendField(new Blockly.FieldTextInput("התקשר עכשיו 📞"), "LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("כפתור שמחייג ישירות למספר הטלפון של העסק");
    }
  };
  setGen('web_call_button', function(block) {
    const phone = getBlockProp(block, 'PHONE', '03-0000000');
    const label = getBlockProp(block, 'LABEL', 'חיוג');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#059669',
      'color': '#ffffff',
      'text-decoration': 'none',
      'padding': '10px 22px',
      'font-size': '1rem',
      'font-weight': 'bold',
      'border-radius': '10px',
      'display': 'inline-flex',
      'align-items': 'center',
      'gap': '8px',
      'margin': '6px 0',
      'box-shadow': '0 4px 12px rgba(5,150,105,0.3)'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<a data-block-id="${block.id}" href="tel:${phone}" style="${styleStr}" ${hoverAttr}>${label}</a>\n`;
  });

  // Regular Link
  Blockly.Blocks['web_link'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔗 קישור (Link) | טקסט:")
          .appendField(new Blockly.FieldTextInput("מעבר לאתר חיצוני ↗️"), "TEXT");
      this.appendDummyInput()
          .appendField("כתובת URL:")
          .appendField(new Blockly.FieldTextInput("https://google.com"), "URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("מוסיף קישור אינטרנט");
    }
  };
  setGen('web_link', function(block) {
    const text = getBlockProp(block, 'TEXT', 'קישור');
    const url = getBlockProp(block, 'URL', '#');

    const styleStr = buildUniversalStyleString(block, {
      'color': '#2563eb',
      'text-decoration': 'underline',
      'font-weight': '600',
      'margin': '4px 0',
      'display': 'inline-block'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<a data-block-id="${block.id}" href="${url}" target="_blank" rel="noopener noreferrer" style="${styleStr}" ${hoverAttr}>${text}</a>\n`;
  });

  // Legacy Button
  Blockly.Blocks["html_button"] = {
    init: function () {
      this.appendDummyInput().appendField("כפתור עם טקסט:").appendField(new Blockly.FieldTextInput("לחץ עלי"), "LABEL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
    },
  };
  setGen("html_button", function (block) {
    const label = getBlockProp(block, "LABEL", "לחץ עלי");
    const styleStr = buildUniversalStyleString(block, {});
    return `<button data-block-id="${block.id}" style="${styleStr}">${label}</button>\n`;
  });

  // ---------------------------------------------------------
  // 6. ⚡ בלוקי פעולות להרכבה בתוך כפתורים (ACTION BLOCKS)
  // ---------------------------------------------------------

  // 1. Action: Alert Popup
  Blockly.Blocks['action_alert'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔔 הצג הודעה קופצת:")
          .appendField(new Blockly.FieldTextInput("ברוכים הבאים לאתר שלי! ✨"), "MSG");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e11d48');
      this.setTooltip("מציג הודעה קופצת במסך כשהמשתמש לוחץ על הכפתור");
    }
  };
  setGen('action_alert', function(block) {
    const msg = (getBlockProp(block, 'MSG', 'שלום!')).replace(/'/g, "\\'");
    return `alert('${msg}'); `;
  });

  // 2. Action: Change Background Color
  Blockly.Blocks['action_change_bg'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎨 שנה צבע רקע של האתר ל:")
          .appendField(new Blockly.FieldTextInput("#fef08a"), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("משנה את צבע הרקע של האתר בעת לחיצה");
    }
  };
  setGen('action_change_bg', function(block) {
    const color = getBlockProp(block, 'COLOR', '#fef08a');
    return `smartChangeBg('${color}'); `;
  });

  // 3. Action: Navigate to Page
  Blockly.Blocks['action_navigate_page'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔗 עבור לעמוד:")
          .appendField(new Blockly.FieldDropdown([
            ["דף הבית (index.html)", "index.html"],
            ["אודות (about.html)", "about.html"],
            ["שירותים (services.html)", "services.html"],
            ["צור קשר (contact.html)", "contact.html"]
          ]), "PAGE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("עובר לעמוד אחר בתוך האתר");
    }
  };
  setGen('action_navigate_page', function(block) {
    const page = getBlockProp(block, 'PAGE', 'about.html');
    return `smartNavigate('${page}'); `;
  });

  // 4. Action: Open External URL
  Blockly.Blocks['action_open_url'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌐 פתח אתר בטאב חדש:")
          .appendField(new Blockly.FieldTextInput("https://google.com"), "URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0284c7');
      this.setTooltip("פותח אתר אינטרנט חיצוני בלשונית חדשה");
    }
  };
  setGen('action_open_url', function(block) {
    const url = getBlockProp(block, 'URL', 'https://google.com');
    return `smartOpenUrl('${url}'); `;
  });

  // 5. Action: Scroll to Top
  Blockly.Blocks['action_scroll_top'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("⬆️ גלול את הדף לראש העמוד");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#8b5cf6');
      this.setTooltip("גולל את הדף בחזרה למעלה בצורה חלקה");
    }
  };
  setGen('action_scroll_top', function(block) {
    return `smartScrollTop(); `;
  });

  // 6. Action: Play Sound Effect
  Blockly.Blocks['action_play_sound'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎵 השמע צליל אינטראקטיבי");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ec4899');
      this.setTooltip("משמיע צליל נעים ברמקול בלחיצה");
    }
  };
  setGen('action_play_sound', function(block) {
    return `smartPlaySound(); `;
  });

  // 7. Action: Custom JS Code
  Blockly.Blocks['action_custom_js'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💻 הרץ פקודת JavaScript:")
          .appendField(new Blockly.FieldTextInput("console.log('כפתור נלחץ!');"), "CODE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#475569');
      this.setTooltip("מריץ כל שורת קוד JavaScript חופשית");
    }
  };
  setGen('action_custom_js', function(block) {
    const code = getBlockProp(block, 'CODE', '');
    return `${code} `;
  });

  // Legacy Change BG
  Blockly.Blocks['web_action_change_bg'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("⚡ כפתור החלפת רקע | כפתור:")
          .appendField(new Blockly.FieldTextInput("🎨 החלף צבע!"), "LABEL");
      this.appendDummyInput()
          .appendField("צבע רקע חדש:")
          .appendField(new Blockly.FieldTextInput("#fef08a"), "TARGET_COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e11d48');
      this.setTooltip("כפתור שמשנה את צבע הרקע של האתר בלחיצה בזמן אמת");
    }
  };
  setGen('web_action_change_bg', function(block) {
    const label = getBlockProp(block, 'LABEL', 'החלף צבע');
    const color = getBlockProp(block, 'TARGET_COLOR', '#fef08a');

    const styleStr = buildUniversalStyleString(block, {
      'background': 'linear-gradient(135deg, #f43f5e, #e11d48)',
      'color': '#ffffff',
      'border': 'none',
      'padding': '10px 20px',
      'font-weight': 'bold',
      'border-radius': '10px',
      'cursor': 'pointer',
      'box-shadow': '0 4px 12px rgba(225,29,72,0.3)',
      'margin': '6px 0'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<button data-block-id="${block.id}" onclick="document.body.style.backgroundColor='${color}'" style="${styleStr}" ${hoverAttr}>${label}</button>\n`;
  });

  // Custom Raw HTML Block
  Blockly.Blocks['web_custom_html'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💻 קוד HTML מותאם אישית:")
          .appendField(new Blockly.FieldTextInput("<div class='custom-box'>תוכן חופשי</div>"), "RAW_HTML");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#475569');
      this.setTooltip("מאפשר להזין קוד HTML/CSS ישיר");
    }
  };
  setGen('web_custom_html', function(block) {
    const raw = getBlockProp(block, 'RAW_HTML', '');
    return `<div data-block-id="${block.id}">${raw}</div>\n`;
  });

  // ---------------------------------------------------------
  // 7. 📥 רכיבי קלט ופלט (APP INVENTOR STYLE: TEXTBOX, LABEL, BUTTON)
  // ---------------------------------------------------------

  // 1. Form Container
  Blockly.Blocks['web_form'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📋 טופס אינטראקטיבי (Form) | כותרת:")
          .appendField(new Blockly.FieldTextInput("טופס יצירת קשר"), "FORM_TITLE");
      this.appendDummyInput()
          .appendField("מזהה טופס (ID):")
          .appendField(new Blockly.FieldTextInput("contact_form"), "FORM_ID");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("שדות וכפתורים בטופס:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("מעטפת טופס שלמה להכלת שדות קלט וכפתור שליחה");
    }
  };
  setGen('web_form', function(block) {
    const title = getBlockProp(block, 'FORM_TITLE', 'טופס');
    const formId = getBlockProp(block, 'FORM_ID', 'contact_form');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'padding': '24px',
      'border-radius': '14px',
      'border': '1px solid #e2e8f0',
      'box-shadow': '0 4px 12px rgba(0,0,0,0.06)',
      'width': '100%',
      'margin': '12px 0'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<form id="${formId}" data-block-id="${block.id}" onsubmit="event.preventDefault();" style="${styleStr}" ${hoverAttr}>
  <h3 style="margin-top: 0; margin-bottom: 16px; color: #1e293b; font-size: 1.25rem; font-weight: 700; text-align: right;">${title}</h3>
${children}</form>\n`;
  });

  // 2. Input Field (TextBox)
  Blockly.Blocks['web_input_field'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔤 תיבת קלט (TextBox) | כותרת:")
          .appendField(new Blockly.FieldTextInput("הכנס שם מלא:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("TextBox1"), "INPUT_ID")
          .appendField("סוג:")
          .appendField(new Blockly.FieldDropdown([
            ["טקסט (Text)", "text"],
            ["טלפון (Tel)", "tel"],
            ["אימייל (Email)", "email"],
            ["סיסמה (Password)", "password"],
            ["מספר (Number)", "number"],
            ["תאריך (Date)", "date"]
          ]), "TYPE");
      this.appendDummyInput()
          .appendField("רמז (Placeholder):")
          .appendField(new Blockly.FieldTextInput("הקלד כאן..."), "PLACEHOLDER");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("שדה קלט למשתמש (מקביל ל-TextBox ב-App Inventor)");
    }
  };
  setGen('web_input_field', function(block) {
    const label = getBlockProp(block, 'LABEL', 'קלט:');
    const placeholder = getBlockProp(block, 'PLACEHOLDER', '');
    const type = getBlockProp(block, 'TYPE', 'text');
    const inputId = getBlockProp(block, 'INPUT_ID', 'TextBox1');

    const inputStyleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'padding': '10px 14px',
      'border': '1.5px solid #cbd5e1',
      'border-radius': '8px',
      'font-size': '0.95rem',
      'outline': 'none',
      'box-sizing': 'border-box'
    });

    return `<div data-block-id="${block.id}" style="margin-bottom: 14px; text-align: right; width: 100%; box-sizing: border-box;">\n  <label style="display: block; font-weight: 700; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">${label}</label>\n  <input id="${inputId}" type="${type}" placeholder="${placeholder}" style="${inputStyleStr}" />\n</div>\n`;
  });

  // 3. Textarea Block
  Blockly.Blocks['web_textarea'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📝 תיבת הודעה (Textarea) | כותרת:")
          .appendField(new Blockly.FieldTextInput("תוכן ההודעה:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("user_message"), "INPUT_ID")
          .appendField("רמז:")
          .appendField(new Blockly.FieldTextInput("כתוב כאן את הודעתך..."), "PLACEHOLDER");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#b45309');
      this.setTooltip("מוסיף שדה טקסט רב-שורתי להשארת הודעה");
    }
  };
  setGen('web_textarea', function(block) {
    const label = getBlockProp(block, 'LABEL', 'הודעה:');
    const placeholder = getBlockProp(block, 'PLACEHOLDER', '');
    const inputId = getBlockProp(block, 'INPUT_ID', 'user_message');

    const textareaStyleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'padding': '10px 14px',
      'border': '1.5px solid #cbd5e1',
      'border-radius': '8px',
      'font-size': '0.95rem',
      'outline': 'none',
      'resize': 'vertical',
      'box-sizing': 'border-box'
    });

    return `<div data-block-id="${block.id}" style="margin-bottom: 14px; text-align: right; width: 100%; box-sizing: border-box;">\n  <label style="display: block; font-weight: 700; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">${label}</label>\n  <textarea id="${inputId}" placeholder="${placeholder}" rows="4" style="${textareaStyleStr}"></textarea>\n</div>\n`;
  });

  // 4. Dropdown Select Block
  Blockly.Blocks['web_dropdown_select'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔽 תפריט בחירה (Select) | כותרת:")
          .appendField(new Blockly.FieldTextInput("בחר שירות:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("selected_service"), "INPUT_ID");
      this.appendDummyInput()
          .appendField("אפשרות 1:")
          .appendField(new Blockly.FieldTextInput("בניית אתר מודרני"), "OPT1")
          .appendField("אפשרות 2:")
          .appendField(new Blockly.FieldTextInput("עיצוב ממשק וגרפיקה"), "OPT2")
          .appendField("אפשרות 3:")
          .appendField(new Blockly.FieldTextInput("ייעוץ דיגיטלי"), "OPT3");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ca8a04');
      this.setTooltip("מוסיף תפריט בחירה נפתח");
    }
  };
  setGen('web_dropdown_select', function(block) {
    const label = getBlockProp(block, 'LABEL', 'בחירה:');
    const inputId = getBlockProp(block, 'INPUT_ID', 'selected_service');
    const opt1 = getBlockProp(block, 'OPT1', 'אפשרות 1');
    const opt2 = getBlockProp(block, 'OPT2', 'אפשרות 2');
    const opt3 = getBlockProp(block, 'OPT3', 'אפשרות 3');

    const selectStyleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'padding': '10px 14px',
      'border': '1.5px solid #cbd5e1',
      'border-radius': '8px',
      'font-size': '0.95rem',
      'outline': 'none',
      'background': '#ffffff',
      'box-sizing': 'border-box'
    });

    return `<div data-block-id="${block.id}" style="margin-bottom: 14px; text-align: right; width: 100%; box-sizing: border-box;">\n  <label style="display: block; font-weight: 700; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">${label}</label>\n  <select id="${inputId}" style="${selectStyleStr}">\n    <option>${opt1}</option>\n    <option>${opt2}</option>\n    <option>${opt3}</option>\n  </select>\n</div>\n`;
  });

  // 5. Checkbox Block
  Blockly.Blocks['web_checkbox'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("☑️ תיבת סימון (Checkbox) | טקסט:")
          .appendField(new Blockly.FieldTextInput("אני מאשר קבלת עדכונים והודעות"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("agree_updates"), "INPUT_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#eab308');
      this.setTooltip("מוסיף תיבת סימון (Checkbox) לאישור תנאים או בחירות מרובות");
    }
  };
  setGen('web_checkbox', function(block) {
    const label = getBlockProp(block, 'LABEL', 'אישור');
    const inputId = getBlockProp(block, 'INPUT_ID', 'checkbox_1');

    return `<div data-block-id="${block.id}" style="display: flex; align-items: center; gap: 10px; margin: 12px 0; text-align: right;">\n  <input id="${inputId}" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;" />\n  <label for="${inputId}" style="font-size: 0.92rem; color: #334155; font-weight: 600; cursor: pointer;">${label}</label>\n</div>\n`;
  });

  // 6. Range Slider Input
  Blockly.Blocks['web_slider_input'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎚️ סליידר מספר (Range) | כותרת:")
          .appendField(new Blockly.FieldTextInput("בחר כמות / תקציב:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("range_val"), "INPUT_ID")
          .appendField("מינימום:")
          .appendField(new Blockly.FieldTextInput("1"), "MIN")
          .appendField("מקסימום:")
          .appendField(new Blockly.FieldTextInput("100"), "MAX")
          .appendField("התחלתי:")
          .appendField(new Blockly.FieldTextInput("50"), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#f59e0b');
      this.setTooltip("מוסיף סליידר לבחירת ערך מספרי בטווח");
    }
  };
  setGen('web_slider_input', function(block) {
    const label = getBlockProp(block, 'LABEL', 'ערך:');
    const inputId = getBlockProp(block, 'INPUT_ID', 'range_1');
    const min = getBlockProp(block, 'MIN', '1');
    const max = getBlockProp(block, 'MAX', '100');
    const val = getBlockProp(block, 'VALUE', '50');

    return `<div data-block-id="${block.id}" style="margin-bottom: 14px; text-align: right; width: 100%; box-sizing: border-box;">\n  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">\n    <label style="font-weight: 700; color: #334155; font-size: 0.9rem;">${label}</label>\n    <span id="${inputId}_display" style="font-weight: bold; color: #2563eb;">${val}</span>\n  </div>\n  <input id="${inputId}" type="range" min="${min}" max="${max}" value="${val}" oninput="document.getElementById('${inputId}_display').innerText=this.value" style="width: 100%; cursor: pointer;" />\n</div>\n`;
  });

  // 7. Color Picker Input
  Blockly.Blocks['web_color_picker_input'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎨 דוגם צבע (Color Input) | כותרת:")
          .appendField(new Blockly.FieldTextInput("בחר צבע מועדף:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("fav_color"), "INPUT_ID")
          .appendField("צבע ברירת מחדל:")
          .appendField(new Blockly.FieldTextInput("#2563eb"), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ec4899');
      this.setTooltip("מוסיף כפתור בחירת צבע");
    }
  };
  setGen('web_color_picker_input', function(block) {
    const label = getBlockProp(block, 'LABEL', 'צבע:');
    const inputId = getBlockProp(block, 'INPUT_ID', 'color_1');
    const val = getBlockProp(block, 'VALUE', '#2563eb');

    return `<div data-block-id="${block.id}" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; width: 100%; box-sizing: border-box; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">\n  <label style="font-weight: 700; color: #334155; font-size: 0.9rem;">${label}</label>\n  <input id="${inputId}" type="color" value="${val}" style="width: 44px; height: 36px; border: none; border-radius: 6px; cursor: pointer; background: transparent;" />\n</div>\n`;
  });

  // 8. Submit Button with Action Statement
  Blockly.Blocks['web_submit_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🚀 כפתור שליחת טופס (Submit) | טקסט:")
          .appendField(new Blockly.FieldTextInput("שלח טופס עכשיו 🚀"), "LABEL");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("⚡ בעת לחיצה בצע:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("כפתור ייעודי לשליחת טופס והפעלת פעולות קלט/פלט");
    }
  };
  setGen('web_submit_button', function(block) {
    const label = getBlockProp(block, 'LABEL', 'שלח טופס 🚀');
    const bg = getBlockProp(block, 'BG_COLOR', '#2563eb');
    const text = getBlockProp(block, 'TEXT_COLOR', '#ffffff');

    let innerCode = javascriptGenerator.statementToCode(block, 'DO') || '';
    innerCode = innerCode.trim().replace(/\r?\n/g, ' ');

    let clickHandler = innerCode ? `onclick="${innerCode.replace(/"/g, "'")}"` : `onclick="alert('הטופס נשלח בהצלחה! ✨')"`;

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'color': text,
      'border': 'none',
      'padding': '12px 24px',
      'font-size': '1rem',
      'font-weight': 'bold',
      'border-radius': '10px',
      'cursor': 'pointer',
      'box-shadow': '0 4px 14px rgba(37,99,235,0.25)',
      'margin': '10px 0',
      'width': '100%',
      'display': 'block'
    });

    const hoverAttr = buildHoverAttributes(block) || `onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"`;

    return `<button data-block-id="${block.id}" type="submit" ${clickHandler} style="${styleStr}" ${hoverAttr}>${label}</button>\n`;
  });


  // 9. Output Display Box
  Blockly.Blocks['web_output_box'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📤 אזור הצגת פלט (Output Box) | כותרת:")
          .appendField(new Blockly.FieldTextInput("תוצאה ומידע:"), "TITLE");
      this.appendDummyInput()
          .appendField("מזהה פלט (ID):")
          .appendField(new Blockly.FieldTextInput("Label1"), "BOX_ID")
          .appendField("טקסט התחלתי:")
          .appendField(new Blockly.FieldTextInput("כאן יוצג הפלט..."), "DEFAULT_TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תיבת תצוגה נקייה להצגת תוצאות לפי מזהה ID");
    }
  };
  setGen('web_output_box', function(block) {
    const title = getBlockProp(block, 'TITLE', 'תוצאה:');
    const boxId = getBlockProp(block, 'BOX_ID', 'Label1');
    const defaultText = getBlockProp(block, 'DEFAULT_TEXT', 'כאן יוצג הפלט...');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#f0fdf4',
      'border': '2px dashed #86efac',
      'border-radius': '12px',
      'padding': '16px 20px',
      'margin': '16px 0',
      'text-align': 'right',
      'width': '100%',
      'box-sizing': 'border-box'
    });

    return `<div id="${boxId}_card" data-block-id="${block.id}" style="${styleStr}">\n  <div style="font-size: 0.85rem; font-weight: bold; color: #15803d; margin-bottom: 6px;">📤 ${title}</div>\n  <div id="${boxId}" style="font-size: 1.1rem; font-weight: 700; color: #166534; min-height: 24px;">${defaultText}</div>\n</div>\n`;
  });

  // 10. Simple Text Output Label (App Inventor: Label)
  Blockly.Blocks['web_text_output_label'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🏷️ תווית להצגת טקסט (Label) | מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("Label1"), "BOX_ID")
          .appendField("טקסט התחלתי:")
          .appendField(new Blockly.FieldTextInput("כאן יוצג הפלט..."), "DEFAULT_TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תווית תצוגה נקייה באתר שמציגה את הטקסט שמתעדכן בלחיצה על כפתור");
    }
  };
  setGen('web_text_output_label', function(block) {
    const boxId = getBlockProp(block, 'BOX_ID', 'Label1');
    const defaultText = getBlockProp(block, 'DEFAULT_TEXT', 'כאן יוצג הפלט...');
    const styleStr = buildUniversalStyleString(block, {
      'font-size': '1.15rem',
      'font-weight': 'bold',
      'color': '#2563eb',
      'margin': '10px 0',
      'display': 'block',
      'text-align': 'right',
      'min-height': '28px'
    });
    return `<div id="${boxId}" data-block-id="${block.id}" style="${styleStr}">${defaultText}</div>\n`;
  });

  // 11. Combined Input Field + Action Button
  Blockly.Blocks['web_input_with_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔤 שדה קלט + כפתור | כותרת:")
          .appendField(new Blockly.FieldTextInput("הכנס שם מלא:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה שדה (ID):")
          .appendField(new Blockly.FieldTextInput("TextBox1"), "INPUT_ID")
          .appendField("טקסט כפתור:")
          .appendField(new Blockly.FieldTextInput("הצג תוצאה 🚀"), "BTN_LABEL");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("⚡ בעת לחיצה בצע:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("שדה קלט משולב עם כפתור צמוד שמפעיל את הפעולות שבתוכו");
    }
  };
  setGen('web_input_with_button', function(block) {
    const label = getBlockProp(block, 'LABEL', 'קלט:');
    const inputId = getBlockProp(block, 'INPUT_ID', 'TextBox1');
    const btnLabel = getBlockProp(block, 'BTN_LABEL', 'שלח 🚀');
    
    // Extract executable JS and any inner HTML elements from DO
    let genCode = javascriptGenerator.statementToCode(block, 'DO') || '';
    let parsed = separateJsAndHtml(genCode);
    
    let clickJs = parsed.js.trim();
    if (!clickJs) {
      clickJs = `smartSetText('Label1', smartGetText('${inputId}')); smartSetText('${inputId}_output', smartGetText('${inputId}'));`;
    }

    const clickAttr = `onclick="${clickJs.replace(/"/g, "'")}"`;

    return `<div data-block-id="${block.id}" style="margin: 14px 0; text-align: right; width: 100%; box-sizing: border-box;">
  <label style="display: block; font-weight: 700; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">${label}</label>
  <div style="display: flex; gap: 8px; align-items: stretch;">
    <input id="${inputId}" type="text" placeholder="הקלד כאן..." style="flex: 1; padding: 10px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; box-sizing: border-box;" />
    <button type="button" ${clickAttr} style="background: #2563eb; color: #ffffff; border: none; padding: 10px 22px; font-weight: bold; border-radius: 8px; cursor: pointer; transition: all 0.2s; white-space: nowrap;">${btnLabel}</button>
  </div>
  <div id="${inputId}_output" style="margin-top: 8px; font-weight: bold; color: #2563eb; font-size: 1.05rem; min-height: 24px;"></div>
  ${parsed.html ? `<div style="margin-top: 8px;">${parsed.html}</div>\n` : ''}
</div>\n`;
  });

  // 12. Stat Counter Box
  Blockly.Blocks['web_stat_counter'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📊 מונה נתונים (Stat Counter) | כותרת:")
          .appendField(new Blockly.FieldTextInput("לקוחות מרוצים:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("counter_1"), "BOX_ID")
          .appendField("מספר/ערך:")
          .appendField(new Blockly.FieldTextInput("1,500+"), "VALUE");
      this.appendValueInput("DYNAMIC_VAL")
          .setCheck(null)
          .appendField("ערך דינמי (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0284c7');
      this.setTooltip("מציג נתון מרשים ומספר מעוצב");
    }
  };
  setGen('web_stat_counter', function(block) {
    const label = getBlockProp(block, 'LABEL', 'נתון:');
    const boxId = getBlockProp(block, 'BOX_ID', 'counter_1');
    const val = resolveElementInitialText(block, 'DYNAMIC_VAL', 'VALUE', '100+');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'border': '1px solid #e2e8f0',
      'border-radius': '12px',
      'padding': '16px 24px',
      'text-align': 'center',
      'box-shadow': '0 4px 10px rgba(0,0,0,0.05)',
      'margin': '8px 0',
      'width': '100%',
      'box-sizing': 'border-box'
    });

    const bindScript = generateDynamicBindingScript(block, boxId, 'DYNAMIC_VAL');

    return `<div data-block-id="${block.id}" style="${styleStr}">\n  <div id="${boxId}" style="font-size: 2rem; font-weight: 900; color: #2563eb; line-height: 1.1;">${val}</div>\n  <div style="font-size: 0.9rem; font-weight: 600; color: #64748b; margin-top: 4px;">${label}</div>\n</div>\n${bindScript}`;
  });

  // ---------------------------------------------------------
  // 8. ⚡ בלוקי קריאה והשמה בסגנון APP INVENTOR (GETTERS & SETTERS)
  // ---------------------------------------------------------

  // Getter: TextBox.Text (קרא טקסט משדה קלט)
  Blockly.Blocks['val_get_input'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📥 [")
          .appendField(new Blockly.FieldTextInput("TextBox1"), "INPUT_ID")
          .appendField("] .Text (קרא טקסט משדה)");
      this.setOutput(true, null);
      this.setColour('#d97706');
      this.setTooltip("מחזיר את הטקסט שנמצא בתוך שדה הקלט (מקביל ל-TextBox.Text ב-App Inventor)");
    }
  };
  setGen('val_get_input', function(block) {
    const inputId = getBlockProp(block, 'INPUT_ID', 'TextBox1');
    return [`((document.getElementById('${inputId}') ? document.getElementById('${inputId}').value : '') || (window.smartGetText ? smartGetText('${inputId}') : ''))`, javascriptGenerator.ORDER_ATOMIC];
  });

  // Value Expression: Plain Text String
  Blockly.Blocks['val_static_text'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔤 טקסט:")
          .appendField(new Blockly.FieldTextInput("שלום עולם"), "TEXT");
      this.setOutput(true, null);
      this.setColour('#0284c7');
      this.setTooltip("מחזיר מחרוזת טקסט");
    }
  };
  setGen('val_static_text', function(block) {
    const text = (getBlockProp(block, 'TEXT', '')).replace(/'/g, "\\'");
    return [`'${text}'`, javascriptGenerator.ORDER_ATOMIC];
  });

  // Value Expression: Join Texts
  Blockly.Blocks['val_join_text'] = {
    init: function() {
      this.appendValueInput("A")
          .setCheck(null)
          .appendField("🔗 חבר טקסט (join):");
      this.appendValueInput("B")
          .setCheck(null)
          .appendField("+");
      this.setOutput(true, null);
      this.setColour('#3b82f6');
      this.setTooltip("מחבר שני טקסטים או ערכים יחד");
    }
  };
  setGen('val_join_text', function(block) {
    const a = javascriptGenerator.valueToCode(block, 'A', javascriptGenerator.ORDER_ATOMIC) || "''";
    const b = javascriptGenerator.valueToCode(block, 'B', javascriptGenerator.ORDER_ATOMIC) || "''";
    return [`(String(${a}) + String(${b}))`, javascriptGenerator.ORDER_ATOMIC];
  });

  // Helper to ensure action blocks are safely executed as onclick or inside script tags
  function wrapActionCode(block, code) {
    let p = block.getParent();
    while (p) {
      if (p.type === 'web_button' || p.type === 'web_button_with_actions' || p.type === 'web_input_with_button' || p.type === 'web_submit_button') {
        return code;
      }
      p = p.getParent();
    }
    return `<script>${code}</script>\n`;
  }

  // Setter: set Label.Text to [ ] (קבע את הטקסט של תווית/אלמנט)
  Blockly.Blocks['action_display_in_element'] = {
    init: function() {
      this.appendValueInput("VAL")
          .setCheck(null)
          .appendField("📤 קבע את הטקסט של [")
          .appendField(new Blockly.FieldTextInput("Label1"), "OUTPUT_ID")
          .appendField("] .Text להיות:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("מעדכן את הטקסט המוצג בתווית/אלמנט (מקביל ל-set Label.Text to ב-App Inventor)");
    }
  };
  setGen('action_display_in_element', function(block) {
    const outputId = getBlockProp(block, 'OUTPUT_ID', 'Label1');
    const valCode = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC) || "''";
    return wrapActionCode(block, `(function(){ var v = ${valCode}; var t = document.getElementById('${outputId}'); if(t){ if(t.tagName==='INPUT'||t.tagName==='TEXTAREA') t.value=v; else t.innerText=v; } if(window.smartSetText) smartSetText('${outputId}', v); })(); `);
  });

  // Action: Direct Copy Input to Output Box (Simple one-step block)
  Blockly.Blocks['action_read_input_to_output'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📤 העבר טקסט מ- [")
          .appendField(new Blockly.FieldTextInput("TextBox1"), "INPUT_ID")
          .appendField("] אל [")
          .appendField(new Blockly.FieldTextInput("Label1"), "OUTPUT_ID")
          .appendField("]");
      this.appendDummyInput()
          .appendField("טקסט לפני (אופציונלי):")
          .appendField(new Blockly.FieldTextInput("שלום "), "PREFIX")
          .appendField("טקסט אחרי:")
          .appendField(new Blockly.FieldTextInput("! תודה שפנית אלינו."), "SUFFIX");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("קורא את מה שהוקלד ב-TextBox ומציג אותו מיד ב-Label");
    }
  };
  setGen('action_read_input_to_output', function(block) {
    const inputId = getBlockProp(block, 'INPUT_ID', 'TextBox1');
    const outputId = getBlockProp(block, 'OUTPUT_ID', 'Label1');
    const prefix = (getBlockProp(block, 'PREFIX', '')).replace(/'/g, "\\'");
    const suffix = (getBlockProp(block, 'SUFFIX', '')).replace(/'/g, "\\'");
    return wrapActionCode(block, `(function(){ var v = '${prefix}' + ((document.getElementById('${inputId}') ? document.getElementById('${inputId}').value : '') || (window.smartGetText ? smartGetText('${inputId}') : '')) + '${suffix}'; var t = document.getElementById('${outputId}'); if(t){ if(t.tagName==='INPUT'||t.tagName==='TEXTAREA') t.value=v; else t.innerText=v; } if(window.smartSetText) smartSetText('${outputId}', v); })(); `);
  });

  // Action: Alert Input Data / Value (Notifier.ShowAlert)
  Blockly.Blocks['action_form_alert_data'] = {
    init: function() {
      this.appendValueInput("VAL")
          .setCheck(null)
          .appendField("🔔 הצג הודעה (Notifier / Alert) עם הערך:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#e11d48');
      this.setTooltip("מקפיץ הודעת Alert שמכילה את הערך המחובר");
    }
  };
  setGen('action_form_alert_data', function(block) {
    const valCode = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC) || "'הודעה!'";
    return wrapActionCode(block, `alert(${valCode}); `);
  });

  // Action: Send Form to WhatsApp
  Blockly.Blocks['action_send_form_to_whatsapp'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💬 שלח לוואטסאפ | טלפון:")
          .appendField(new Blockly.FieldTextInput("0501234567"), "PHONE");
      this.appendValueInput("MESSAGE")
          .setCheck(null)
          .appendField("תוכן ההודעה:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#22c55e');
      this.setTooltip("שולח הודעה ישירות לוואטסאפ");
    }
  };
  setGen('action_send_form_to_whatsapp', function(block) {
    const phone = getBlockProp(block, 'PHONE', '0501234567');
    const msgCode = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_ATOMIC) || "'שלום'";
    return wrapActionCode(block, `var _p='${phone}'.replace(/[^0-9]/g,''); if(_p.startsWith('0')) _p='972'+_p.slice(1); window.open('https://wa.me/'+_p+'?text='+encodeURIComponent(${msgCode}), '_blank'); `);
  });

  // Action: Reset Form
  Blockly.Blocks['action_reset_form'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🧹 נקה את כל שדות הטופס (ID):")
          .appendField(new Blockly.FieldTextInput("contact_form"), "FORM_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#64748b');
      this.setTooltip("מנקה ומאפס את כל שדות הטופס");
    }
  };
  setGen('action_reset_form', function(block) {
    const formId = getBlockProp(block, 'FORM_ID', 'contact_form');
    return wrapActionCode(block, `smartResetForm('${formId}'); `);
  });

  // Action: Set Element Text (set Component.Text to)
  Blockly.Blocks['action_set_element_text'] = {
    init: function() {
      this.appendValueInput("NEW_TEXT")
          .setCheck(null)
          .appendField("✍️ קבע את הטקסט של [")
          .appendField(new Blockly.FieldTextInput("Label1"), "TARGET_ID")
          .appendField("] להיות:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#3b82f6');
      this.setTooltip("מעדכן טקסט של כל אלמנט בדף לפי ה-ID שלו");
    }
  };
  setGen('action_set_element_text', function(block) {
    const targetId = getBlockProp(block, 'TARGET_ID', 'Label1');
    const valCode = javascriptGenerator.valueToCode(block, 'NEW_TEXT', javascriptGenerator.ORDER_ATOMIC) || "'הפעולה הושלמה בהצלחה!'";
    return wrapActionCode(block, `smartSetText('${targetId}', ${valCode}); `);
  });

  // Legacy Input
  Blockly.Blocks["html_input"] = {
    init: function () {
      this.appendDummyInput().appendField("תיבת קלט עם placeholder:").appendField(new Blockly.FieldTextInput("הכנס טקסט..."), "PLACEHOLDER");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
    },
  };
  setGen("html_input", function (block) {
    const placeholder = getBlockProp(block, "PLACEHOLDER", "");
    const styleStr = buildUniversalStyleString(block, {});
    return `<input data-block-id="${block.id}" type="text" placeholder="${placeholder}" style="${styleStr}" />\n`;
  });
}

// Pre-register immediately at module import
registerWebBlocks();

// =========================================================================
// 🧰 DEDICATED WEBLOCKS TOOLBOX CONFIGURATION
// =========================================================================
export const WEB_BLOCKS_TOOLBOX = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "🧱 מבנה ושלד",
      colour: "#3b82f6",
      contents: [
        { kind: "block", type: "web_page_container" },
        { kind: "block", type: "web_card" },
        { kind: "block", type: "web_row_flex" },
        { kind: "block", type: "web_divider" },
        { kind: "block", type: "web_spacer" }
      ]
    },
    {
      kind: "category",
      name: "🧭 סרגל ניווט ופוטר",
      colour: "#0f172a",
      contents: [
        { kind: "block", type: "web_navbar" },
        { kind: "block", type: "web_navbar_custom" },
        { kind: "block", type: "web_footer" }
      ]
    },
    {
      kind: "category",
      name: "✍️ טקסט וכותרות",
      colour: "#0284c7",
      contents: [
        { kind: "block", type: "web_heading" },
        { kind: "block", type: "web_paragraph" },
        { kind: "block", type: "web_badge" },
        { kind: "block", type: "web_bullet_item" },
        { kind: "block", type: "val_get_input" },
        { kind: "block", type: "val_static_text" },
        { kind: "block", type: "val_join_text" },
        { kind: "block", type: "html_text" }
      ]
    },
    {
      kind: "category",
      name: "🔘 כפתורים ופעולות",
      colour: "#2563eb",
      contents: [
        { kind: "block", type: "web_button_with_actions" },
        { kind: "block", type: "web_button" },
        { kind: "block", type: "web_button_link" },
        { kind: "block", type: "web_whatsapp_button" },
        { kind: "block", type: "web_call_button" },
        { kind: "block", type: "web_link" },
        { kind: "block", type: "html_button" }
      ]
    },
    {
      kind: "category",
      name: "🖼️ תמונות ווידאו",
      colour: "#10b981",
      contents: [
        { kind: "block", type: "web_image" },
        { kind: "block", type: "web_video_embed" }
      ]
    },
    {
      kind: "category",
      name: "📥 טפסים ושדות קלט",
      colour: "#d97706",
      contents: [
        { kind: "block", type: "web_input_field" },
        { kind: "block", type: "web_textarea" },
        { kind: "block", type: "web_dropdown_select" },
        { kind: "block", type: "web_checkbox" },
        { kind: "block", type: "web_slider_input" },
        { kind: "block", type: "web_color_picker_input" },
        { kind: "block", type: "web_form" },
        { kind: "block", type: "web_submit_button" },
        { kind: "block", type: "web_input_with_button" },
        { kind: "block", type: "val_get_input" },
        { kind: "block", type: "val_static_text" },
        { kind: "block", type: "val_join_text" }
      ]
    },
    {
      kind: "category",
      name: "📤 אזורי פלט ומידע",
      colour: "#059669",
      contents: [
        { kind: "block", type: "web_text_output_label" },
        { kind: "block", type: "web_output_box" },
        { kind: "block", type: "web_stat_counter" },
        { kind: "block", type: "action_display_in_element" },
        { kind: "block", type: "action_read_input_to_output" },
        { kind: "block", type: "action_form_alert_data" },
        { kind: "block", type: "action_send_form_to_whatsapp" },
        { kind: "block", type: "action_reset_form" },
        { kind: "block", type: "val_get_input" },
        { kind: "block", type: "val_static_text" },
        { kind: "block", type: "val_join_text" }
      ]
    },
    {
      kind: "category",
      name: "⚡ פעולות לחיצה (לכפתור)",
      colour: "#e11d48",
      contents: [
        { kind: "block", type: "action_display_in_element" },
        { kind: "block", type: "action_read_input_to_output" },
        { kind: "block", type: "action_form_alert_data" },
        { kind: "block", type: "action_send_form_to_whatsapp" },
        { kind: "block", type: "action_reset_form" },
        { kind: "block", type: "action_alert" },
        { kind: "block", type: "action_change_bg" },
        { kind: "block", type: "action_navigate_page" },
        { kind: "block", type: "action_open_url" },
        { kind: "block", type: "action_scroll_top" },
        { kind: "block", type: "action_play_sound" },
        { kind: "block", type: "action_custom_js" },
        { kind: "block", type: "val_get_input" },
        { kind: "block", type: "val_static_text" },
        { kind: "block", type: "val_join_text" }
      ]
    },
    {
      kind: "category",
      name: "💻 קוד מותאם אישית",
      colour: "#475569",
      contents: [
        { kind: "block", type: "web_custom_html" }
      ]
    }
  ]
};

