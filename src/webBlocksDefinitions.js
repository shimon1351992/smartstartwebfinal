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

// Safe property retriever from both customProperties (Design Studio) and Blockly Fields (with XML <data> hydration)
export const getBlockProp = (block, fieldName, fallback = '') => {
  if (!block) return fallback;
  if (!block.customProperties && block.data) {
    try {
      const parsed = JSON.parse(block.data);
      if (parsed && typeof parsed === 'object') {
        block.customProperties = parsed;
      }
    } catch (e) {}
  }
  if (block.customProperties && block.customProperties[fieldName] !== undefined && block.customProperties[fieldName] !== '') {
    return block.customProperties[fieldName];
  }
  try {
    if (typeof block.getField === 'function' && block.getField(fieldName)) {
      const val = block.getFieldValue(fieldName);
      if (val !== null && val !== undefined && val !== '') return val;
    }
  } catch (e) {}
  return fallback;
};

// Universal CSS Style Builder: Merges base block styles with all custom CSS3 properties
export const buildUniversalStyleString = (block, defaultStyles = {}) => {
  const styles = { ...defaultStyles };

  // 0. Display & Positioning & Z-Index
  const display = getBlockProp(block, 'DISPLAY');
  if (display) styles['display'] = display;

  const position = getBlockProp(block, 'POSITION');
  if (position && position !== 'static') {
    styles['position'] = position;
    const posTop = getBlockProp(block, 'POS_TOP');
    const posRight = getBlockProp(block, 'POS_RIGHT');
    const posBottom = getBlockProp(block, 'POS_BOTTOM');
    const posLeft = getBlockProp(block, 'POS_LEFT');
    if (posTop !== '') styles['top'] = normalizeCssUnit(posTop, 'px');
    if (posRight !== '') styles['right'] = normalizeCssUnit(posRight, 'px');
    if (posBottom !== '') styles['bottom'] = normalizeCssUnit(posBottom, 'px');
    if (posLeft !== '') styles['left'] = normalizeCssUnit(posLeft, 'px');
  }

  const zIndex = getBlockProp(block, 'Z_INDEX');
  if (zIndex !== '' && zIndex !== 'auto') styles['z-index'] = zIndex;

  // 1. Colors, Gradients, Background Image, Overlay & Parallax
  const bgImage = getBlockProp(block, 'BG_IMAGE');
  const bgSize = getBlockProp(block, 'BG_SIZE', 'cover');
  const bgPosition = getBlockProp(block, 'BG_POSITION', 'center');
  const bgRepeat = getBlockProp(block, 'BG_REPEAT', 'no-repeat');
  const bgAttachment = getBlockProp(block, 'BG_ATTACHMENT');
  const bgOverlay = getBlockProp(block, 'BG_OVERLAY');

  const gradient = getBlockProp(block, 'GRADIENT');
  const bg = getBlockProp(block, 'BG_COLOR');

  if (bgImage && bgImage !== 'none' && bgImage !== '') {
    const imgUrl = bgImage.startsWith('url(') ? bgImage : `url('${bgImage}')`;
    const overlayGrad = bgOverlay && bgOverlay !== 'none' ? `linear-gradient(${bgOverlay}, ${bgOverlay})` : '';
    if (gradient && gradient !== 'none') {
      styles['background-image'] = `${gradient}, ${imgUrl}`;
    } else if (overlayGrad) {
      styles['background-image'] = `${overlayGrad}, ${imgUrl}`;
    } else {
      styles['background-image'] = imgUrl;
    }
    styles['background-size'] = bgSize;
    styles['background-position'] = bgPosition;
    styles['background-repeat'] = bgRepeat;
    if (bgAttachment && bgAttachment !== 'scroll') styles['background-attachment'] = bgAttachment;
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

  const textGradient = getBlockProp(block, 'TEXT_GRADIENT');
  if (textGradient && textGradient !== 'none' && textGradient !== 'false') {
    styles['background-image'] = textGradient;
    styles['-webkit-background-clip'] = 'text';
    styles['background-clip'] = 'text';
    styles['-webkit-text-fill-color'] = 'transparent';
    styles['color'] = 'transparent';
  }

  const opacity = getBlockProp(block, 'OPACITY');
  if (opacity !== '' && opacity !== '1' && opacity !== '100%') styles['opacity'] = opacity;

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

  const textTransform = getBlockProp(block, 'TEXT_TRANSFORM');
  if (textTransform && textTransform !== 'none') styles['text-transform'] = textTransform;

  const whiteSpace = getBlockProp(block, 'WHITE_SPACE');
  if (whiteSpace && whiteSpace !== 'normal') styles['white-space'] = whiteSpace;

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
    styles['text-shadow'] = `0 ${Math.round(s / 2)}px ${s}px ${customTextShadowColor}`;
  } else if (textShadowPreset && textShadowPreset !== 'none') {
    styles['text-shadow'] = textShadowPreset;
  }

  // 3. Spacing & Dimensions (4-Side Box Model + Min/Max + Aspect Ratio + Overflow)
  const padding = getBlockProp(block, 'PADDING');
  if (padding) styles['padding'] = normalizeCssUnit(padding, 'px');
  const padT = getBlockProp(block, 'PADDING_TOP');
  const padR = getBlockProp(block, 'PADDING_RIGHT');
  const padB = getBlockProp(block, 'PADDING_BOTTOM');
  const padL = getBlockProp(block, 'PADDING_LEFT');
  if (padT !== '') styles['padding-top'] = normalizeCssUnit(padT, 'px');
  if (padR !== '') styles['padding-right'] = normalizeCssUnit(padR, 'px');
  if (padB !== '') styles['padding-bottom'] = normalizeCssUnit(padB, 'px');
  if (padL !== '') styles['padding-left'] = normalizeCssUnit(padL, 'px');

  const margin = getBlockProp(block, 'MARGIN');
  if (margin) styles['margin'] = normalizeCssUnit(margin, 'px');
  const marT = getBlockProp(block, 'MARGIN_TOP');
  const marR = getBlockProp(block, 'MARGIN_RIGHT');
  const marB = getBlockProp(block, 'MARGIN_BOTTOM');
  const marL = getBlockProp(block, 'MARGIN_LEFT');
  if (marT !== '') styles['margin-top'] = normalizeCssUnit(marT, 'px');
  if (marR !== '') styles['margin-right'] = normalizeCssUnit(marR, 'px');
  if (marB !== '') styles['margin-bottom'] = normalizeCssUnit(marB, 'px');
  if (marL !== '') styles['margin-left'] = normalizeCssUnit(marL, 'px');

  const hasCustomWidth =
    block?.customProperties &&
    Object.prototype.hasOwnProperty.call(block.customProperties, 'WIDTH');
  const width = hasCustomWidth ? block.customProperties.WIDTH : getBlockProp(block, 'WIDTH');
  if (width) {
    styles['width'] = normalizeCssUnit(width, block?.type === 'web_image' ? 'px' : '%');
  } else if (hasCustomWidth && styles['width']) {
    styles['width'] = 'auto';
  }

  const minWidth = getBlockProp(block, 'MIN_WIDTH');
  if (minWidth) styles['min-width'] = normalizeCssUnit(minWidth, 'px');

  const maxWidth = getBlockProp(block, 'MAX_WIDTH');
  if (maxWidth) {
    styles['max-width'] = maxWidth === 'none' ? 'none' : normalizeCssUnit(maxWidth, 'px');
  }

  const height = getBlockProp(block, 'HEIGHT');
  if (height && height !== 'auto') {
    const normH = normalizeCssUnit(height, 'px');
    styles['height'] = normH;
    if (block?.type !== 'web_image') {
      styles['min-height'] = normH;
    }
  }

  const minHeight = getBlockProp(block, 'MIN_HEIGHT');
  if (minHeight) styles['min-height'] = normalizeCssUnit(minHeight, 'px');

  const maxHeight = getBlockProp(block, 'MAX_HEIGHT');
  if (maxHeight) {
    styles['max-height'] = maxHeight === 'none' ? 'none' : normalizeCssUnit(maxHeight, 'px');
  }

  const aspectRatio = getBlockProp(block, 'ASPECT_RATIO');
  if (aspectRatio && aspectRatio !== 'auto') styles['aspect-ratio'] = aspectRatio;

  const objectFit = getBlockProp(block, 'OBJECT_FIT');
  if (objectFit) styles['object-fit'] = objectFit;

  const overflow = getBlockProp(block, 'OVERFLOW');
  if (overflow && overflow !== 'visible') styles['overflow'] = overflow;

  // 3b. Flexbox / Grid Container & Child Overrides
  const flexDir = getBlockProp(block, 'DIRECTION');
  if (flexDir && styles['display'] === 'flex') styles['flex-direction'] = flexDir;

  const justify = getBlockProp(block, 'JUSTIFY');
  if (justify && (styles['display'] === 'flex' || styles['display'] === 'inline-flex' || styles['display'] === 'grid')) {
    styles['justify-content'] = justify;
  }

  const alignItems = getBlockProp(block, 'ALIGN_ITEMS');
  if (alignItems && (styles['display'] === 'flex' || styles['display'] === 'inline-flex' || styles['display'] === 'grid')) {
    styles['align-items'] = alignItems;
  }

  const gap = getBlockProp(block, 'GAP');
  if (gap && (styles['display'] === 'flex' || styles['display'] === 'inline-flex' || styles['display'] === 'grid')) {
    styles['gap'] = normalizeCssUnit(gap, 'px');
  }

  const gridCols = getBlockProp(block, 'GRID_COLS');
  if (gridCols && styles['display'] === 'grid') styles['grid-template-columns'] = gridCols;

  const flexGrow = getBlockProp(block, 'FLEX_GROW');
  if (flexGrow !== '') styles['flex-grow'] = flexGrow;

  const flexBasis = getBlockProp(block, 'FLEX_BASIS');
  if (flexBasis) styles['flex-basis'] = normalizeCssUnit(flexBasis, 'px');

  const alignSelf = getBlockProp(block, 'ALIGN_SELF');
  if (alignSelf && alignSelf !== 'auto') styles['align-self'] = alignSelf;

  const orderVal = getBlockProp(block, 'ORDER');
  if (orderVal !== '' && orderVal !== '0') styles['order'] = orderVal;

  const gridColSpan = getBlockProp(block, 'GRID_COL_SPAN');
  if (gridColSpan && gridColSpan !== 'auto') styles['grid-column'] = gridColSpan;

  // 4. Borders & Radius (Unified + Individual Corners)
  const radius = getBlockProp(block, 'RADIUS') || getBlockProp(block, 'BORDER_RADIUS');
  if (radius) styles['border-radius'] = normalizeCssUnit(radius, 'px');
  const radTL = getBlockProp(block, 'RADIUS_TL');
  const radTR = getBlockProp(block, 'RADIUS_TR');
  const radBR = getBlockProp(block, 'RADIUS_BR');
  const radBL = getBlockProp(block, 'RADIUS_BL');
  if (radTL !== '') styles['border-top-left-radius'] = normalizeCssUnit(radTL, 'px');
  if (radTR !== '') styles['border-top-right-radius'] = normalizeCssUnit(radTR, 'px');
  if (radBR !== '') styles['border-bottom-right-radius'] = normalizeCssUnit(radBR, 'px');
  if (radBL !== '') styles['border-bottom-left-radius'] = normalizeCssUnit(radBL, 'px');

  const borderWidth = getBlockProp(block, 'BORDER_WIDTH');
  const borderStyle = getBlockProp(block, 'BORDER_STYLE', 'solid');
  const borderColor = getBlockProp(block, 'BORDER_COLOR', '#cbd5e1');
  if (borderWidth && borderWidth !== '0px' && borderWidth !== '0') {
    const bw = normalizeCssUnit(borderWidth, 'px');
    const borderSide = getBlockProp(block, 'BORDER_SIDE', 'all');
    if (borderSide === 'top') styles['border-top'] = `${bw} ${borderStyle} ${borderColor}`;
    else if (borderSide === 'right') styles['border-right'] = `${bw} ${borderStyle} ${borderColor}`;
    else if (borderSide === 'bottom') styles['border-bottom'] = `${bw} ${borderStyle} ${borderColor}`;
    else if (borderSide === 'left') styles['border-left'] = `${bw} ${borderStyle} ${borderColor}`;
    else styles['border'] = `${bw} ${borderStyle} ${borderColor}`;
  } else if (borderWidth === '0px' || borderWidth === '0') {
    styles['border'] = 'none';
  }

  // 5. Box Shadow Builder + Slider + Presets
  const shadowX = getBlockProp(block, 'SHADOW_X');
  const shadowY = getBlockProp(block, 'SHADOW_Y');
  const shadowBlurCustom = getBlockProp(block, 'SHADOW_BLUR');
  const shadowSpread = getBlockProp(block, 'SHADOW_SPREAD', '0');
  const shadowInset = getBlockProp(block, 'SHADOW_INSET');
  const customShadowSize = getBlockProp(block, 'SHADOW_SIZE');
  const customShadowColor = getBlockProp(block, 'SHADOW_COLOR', 'rgba(15,23,42,0.18)');
  const shadowPreset = getBlockProp(block, 'SHADOW') || getBlockProp(block, 'BOX_SHADOW');

  if ((shadowX !== '' && shadowX !== undefined) || (shadowY !== '' && shadowY !== undefined)) {
    const sx = normalizeCssUnit(String(shadowX || '0'), 'px');
    const sy = normalizeCssUnit(String(shadowY || '8'), 'px');
    const sb = normalizeCssUnit(String(shadowBlurCustom || '24'), 'px');
    const ssp = normalizeCssUnit(String(shadowSpread || '0'), 'px');
    const insetStr = shadowInset === 'true' || shadowInset === true ? 'inset ' : '';
    styles['box-shadow'] = `${insetStr}${sx} ${sy} ${sb} ${ssp} ${customShadowColor}`;
  } else if (customShadowSize !== '' && customShadowSize !== undefined && parseInt(customShadowSize, 10) > 0) {
    const sz = parseInt(customShadowSize, 10);
    const blr = shadowBlurCustom ? parseInt(shadowBlurCustom, 10) : sz * 2;
    styles['box-shadow'] = `0 ${Math.round(sz / 2)}px ${blr}px ${customShadowColor}`;
  } else if (shadowPreset && shadowPreset !== 'none') {
    styles['box-shadow'] = shadowPreset;
  } else if (shadowPreset === 'none' || customShadowSize === '0') {
    styles['box-shadow'] = 'none';
  }

  // Backdrop Blur & Filters
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

  const filterParts = [];
  const filter = getBlockProp(block, 'FILTER');
  if (filter && filter !== 'none') filterParts.push(filter);
  const fBright = getBlockProp(block, 'FILTER_BRIGHTNESS');
  if (fBright && fBright !== '100' && fBright !== '1') filterParts.push(`brightness(${fBright}%)`);
  const fContrast = getBlockProp(block, 'FILTER_CONTRAST');
  if (fContrast && fContrast !== '100' && fContrast !== '1') filterParts.push(`contrast(${fContrast}%)`);
  const fSaturate = getBlockProp(block, 'FILTER_SATURATE');
  if (fSaturate && fSaturate !== '100' && fSaturate !== '1') filterParts.push(`saturate(${fSaturate}%)`);
  if (filterParts.length > 0) styles['filter'] = filterParts.join(' ');

  const mixBlend = getBlockProp(block, 'MIX_BLEND_MODE');
  if (mixBlend && mixBlend !== 'normal') styles['mix-blend-mode'] = mixBlend;

  // Full 2D Transform Builder
  const transformParts = [];
  const transX = getBlockProp(block, 'TRANSLATE_X');
  const transY = getBlockProp(block, 'TRANSLATE_Y');
  const scale = getBlockProp(block, 'SCALE');
  const rotate = getBlockProp(block, 'ROTATE');
  const skewX = getBlockProp(block, 'SKEW_X');
  if (transX && transX !== '0' && transX !== '0px') transformParts.push(`translateX(${normalizeCssUnit(String(transX), 'px')})`);
  if (transY && transY !== '0' && transY !== '0px') transformParts.push(`translateY(${normalizeCssUnit(String(transY), 'px')})`);
  if (scale && scale !== '1' && scale !== '100%') transformParts.push(`scale(${scale})`);
  if (rotate && rotate !== '0deg' && rotate !== '0' && rotate !== 0) transformParts.push(`rotate(${normalizeCssUnit(String(rotate), 'deg')})`);
  if (skewX && skewX !== '0' && skewX !== '0deg') transformParts.push(`skewX(${normalizeCssUnit(String(skewX), 'deg')})`);
  if (transformParts.length > 0) styles['transform'] = transformParts.join(' ');

  const cursor = getBlockProp(block, 'CURSOR');
  if (cursor && cursor !== 'default') styles['cursor'] = cursor;

  // 6. Continuous / Entrance Animations & Transitions
  const anim = getBlockProp(block, 'ANIMATION');
  const animDur = getBlockProp(block, 'ANIMATION_DURATION', '2s');
  if (anim === 'pulse') styles['animation'] = `smartPulse ${animDur} infinite ease-in-out`;
  else if (anim === 'float') styles['animation'] = `smartFloat ${animDur} infinite ease-in-out`;
  else if (anim === 'glow_pulse') styles['animation'] = `smartGlowPulse ${animDur} infinite alternate`;
  else if (anim === 'fadeInUp') styles['animation'] = `wbFadeInUp 0.7s ease-out both`;
  else if (anim === 'slideInRight') styles['animation'] = `wbSlideInRight 0.6s ease-out both`;

  const transDur = getBlockProp(block, 'TRANSITION_DURATION', '0.25s');
  const transTiming = getBlockProp(block, 'TRANSITION_TIMING', 'ease');
  styles['box-sizing'] = 'border-box';
  styles['transition'] = `all ${transDur} ${transTiming}`;

  // Convert style object to CSS string + append optional freeform inline CSS
  const baseCss = Object.entries(styles)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  const customInline = getBlockProp(block, 'CUSTOM_INLINE_CSS', '').trim();
  return customInline ? `${baseCss} ${customInline}` : baseCss;
};

// Build extra HTML5 global attributes (class, title, aria-label, hidden)
export const buildBlockExtraAttributes = (block) => {
  const attrs = [];
  const cssClass = getBlockProp(block, 'CSS_CLASS', '').trim();
  if (cssClass) attrs.push(`class="${cssClass.replace(/"/g, '&quot;')}"`);
  const titleAttr = getBlockProp(block, 'TITLE_ATTR', '').trim();
  if (titleAttr) attrs.push(`title="${titleAttr.replace(/"/g, '&quot;')}"`);
  const ariaLabel = getBlockProp(block, 'ARIA_LABEL', '').trim();
  if (ariaLabel) attrs.push(`aria-label="${ariaLabel.replace(/"/g, '&quot;')}"`);
  const isHidden = getBlockProp(block, 'IS_HIDDEN', '');
  if (isHidden === 'true' || isHidden === true) attrs.push('hidden');
  return attrs.join(' ');
};

// Keep legacy export name working while preferring real CSS :hover rules
export const buildHoverAttributes = (block) => {
  return buildBlockExtraAttributes(block);
};

// Generate real CSS3 rules (:hover, :focus, @media mobile, custom block CSS) for all blocks in a workspace
export const generateDynamicCssForWorkspace = (ws) => {
  if (!ws || typeof ws.getAllBlocks !== 'function') return '';
  const blocks = ws.getAllBlocks(false);
  const rules = [
    `@keyframes wbFadeInUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }`,
    `@keyframes wbSlideInRight { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }`
  ];

  blocks.forEach((block) => {
    const sel = `[data-block-id="${block.id}"]`;

    // 1. Real CSS :hover rules
    const hoverDecls = [];
    const hoverEffect = getBlockProp(block, 'HOVER_EFFECT', 'none');
    if (hoverEffect === 'lift') {
      hoverDecls.push('transform: translateY(-6px) !important;', 'box-shadow: 0 15px 30px -5px rgba(0,0,0,0.18) !important;');
    } else if (hoverEffect === 'zoom') {
      hoverDecls.push('transform: scale(1.05) !important;');
    } else if (hoverEffect === 'rotate') {
      hoverDecls.push('transform: rotate(3deg) scale(1.03) !important;');
    } else if (hoverEffect === 'glow') {
      hoverDecls.push('box-shadow: 0 0 30px rgba(37,99,235,0.55) !important;');
    } else if (hoverEffect === 'fade') {
      hoverDecls.push('opacity: 0.78 !important;');
    }

    const hBg = getBlockProp(block, 'HOVER_BG');
    if (hBg) hoverDecls.push(`background: ${hBg} !important; background-color: ${hBg} !important;`);
    const hColor = getBlockProp(block, 'HOVER_COLOR');
    if (hColor) hoverDecls.push(`color: ${hColor} !important;`);
    const hBorderColor = getBlockProp(block, 'HOVER_BORDER_COLOR');
    if (hBorderColor) hoverDecls.push(`border-color: ${hBorderColor} !important;`);
    const hShadow = getBlockProp(block, 'HOVER_SHADOW');
    if (hShadow) hoverDecls.push(`box-shadow: ${hShadow} !important;`);

    const hTransformParts = [];
    const hTy = getBlockProp(block, 'HOVER_TRANSLATE_Y');
    const hScale = getBlockProp(block, 'HOVER_SCALE');
    const hRot = getBlockProp(block, 'HOVER_ROTATE');
    if (hTy && hTy !== '0') hTransformParts.push(`translateY(${normalizeCssUnit(String(hTy), 'px')})`);
    if (hScale && hScale !== '1') hTransformParts.push(`scale(${hScale})`);
    if (hRot && hRot !== '0') hTransformParts.push(`rotate(${normalizeCssUnit(String(hRot), 'deg')})`);
    if (hTransformParts.length > 0) hoverDecls.push(`transform: ${hTransformParts.join(' ')} !important;`);

    if (hoverDecls.length > 0) {
      rules.push(`${sel}:hover { ${hoverDecls.join(' ')} }`);
    }

    // 2. Real CSS :focus rules (for inputs/buttons)
    const fBorder = getBlockProp(block, 'FOCUS_BORDER_COLOR');
    const fShadow = getBlockProp(block, 'FOCUS_SHADOW');
    if (fBorder || fShadow) {
      const fParts = [];
      if (fBorder) fParts.push(`border-color: ${fBorder} !important;`);
      if (fShadow) fParts.push(`box-shadow: ${fShadow} !important;`);
      rules.push(`${sel}:focus, ${sel} input:focus, ${sel} textarea:focus, ${sel} select:focus { ${fParts.join(' ')} }`);
    }

    // 3. Per-block Mobile Responsive Overrides (@media <= 768px)
    const mobParts = [];
    const mDisplay = getBlockProp(block, 'MOBILE_DISPLAY');
    if (mDisplay) mobParts.push(`display: ${mDisplay} !important;`);
    const mWidth = getBlockProp(block, 'MOBILE_WIDTH');
    if (mWidth) mobParts.push(`width: ${normalizeCssUnit(mWidth, '%')} !important;`);
    const mPadding = getBlockProp(block, 'MOBILE_PADDING');
    if (mPadding) mobParts.push(`padding: ${normalizeCssUnit(mPadding, 'px')} !important;`);
    const mFontSize = getBlockProp(block, 'MOBILE_FONT_SIZE');
    if (mFontSize) mobParts.push(`font-size: ${normalizeCssUnit(mFontSize, 'px')} !important;`);
    const mFlexDir = getBlockProp(block, 'MOBILE_FLEX_DIR');
    if (mFlexDir) mobParts.push(`flex-direction: ${mFlexDir} !important;`);
    const mAlign = getBlockProp(block, 'MOBILE_TEXT_ALIGN');
    if (mAlign) mobParts.push(`text-align: ${mAlign} !important;`);
    if (mobParts.length > 0) {
      rules.push(`@media screen and (max-width: 768px) { ${sel} { ${mobParts.join(' ')} } }`);
    }

    // 4. Custom Block Scoped CSS (& replaced with block selector)
    const customBlockCss = getBlockProp(block, 'CUSTOM_BLOCK_CSS', '').trim();
    if (customBlockCss) {
      rules.push(customBlockCss.replace(/&/g, sel));
    }
  });

  return rules.join('\n    ');
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
            ["Heebo (מודרני)", "Heebo, sans-serif"],
            ["Rubik (עגול וחד)", "Rubik, sans-serif"],
            ["Assistant (נקי)", "Assistant, sans-serif"],
            ["Secular One (כותרות)", "Secular One, sans-serif"],
            ["Varela Round", "Varela Round, sans-serif"],
            ["Fredoka (צעיר)", "Fredoka, sans-serif"],
            ["גופן מערכת (System)", "system-ui, sans-serif"],
            ["גופן מערכת (Arial)", "Arial, sans-serif"],
            ["גופן מונו (קוד)", "monospace"]
          ]), "FONT");
      this.appendDummyInput()
          .appendField("סידור הדף:")
          .appendField(new Blockly.FieldDropdown([
            ["🎯 ממורכז באמצע המסך", "center"],
            ["↔️ רוחב מלא מתוח", "stretch"],
            ["➡️ צמוד לימין", "flex-start"],
            ["⬅️ צמוד לשמאל", "flex-end"]
          ]), "ALIGN_ITEMS")
          .appendField("רוחב אתר:")
          .appendField(new Blockly.FieldDropdown([
            ["רגיל (1140px)", "1140px"],
            ["רחב (1320px)", "1320px"],
            ["קומפקטי (900px)", "900px"],
            ["מסך מלא (100%)", "100%"]
          ]), "SITE_WIDTH");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("תוכן הדף:");
      this.setColour('#3b82f6');
      this.setTooltip("מעטפת ראשית לכל האתר - קובעת רקע, גופן, מרכוז ורוחב האתר");
    }
  };
  setGen('web_page_container', function(block) {
    const bg = getBlockProp(block, 'BG_COLOR', '#f8fafc');
    const font = getBlockProp(block, 'FONT', 'Heebo, sans-serif');
    const align = getBlockProp(block, 'ALIGN_ITEMS', 'center');
    const siteWidth = getBlockProp(block, 'SITE_WIDTH', '1140px');
    const justify = getBlockProp(block, 'JUSTIFY', 'flex-start');
    const gap = getBlockProp(block, 'GAP', '0px');
    const padding = getBlockProp(block, 'PADDING', '28px 20px');
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
      '--site-max-width': siteWidth,
      'overflow-x': 'hidden'
    });

    return `<div data-block-id="${block.id}" class="wb-page-root" style="${styleStr}">\n${children}</div>\n`;
  });

  // Card Box (Modular box with Flexbox support, Auto Centering & Content Alignment)
  Blockly.Blocks['web_card'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📦 כרטיסייה מעוצבת (Card)");
      this.appendDummyInput()
          .appendField("צבע:")
          .appendField(new Blockly.FieldTextInput("#ffffff"), "BG_COLOR")
          .appendField("עיגול:")
          .appendField(new Blockly.FieldDropdown([
            ["בינוני (16px)", "16px"],
            ["קל (8px)", "8px"],
            ["עגול (24px)", "24px"],
            ["ענק (32px)", "32px"],
            ["ללא (0px)", "0px"]
          ]), "RADIUS");
      this.appendDummyInput()
          .appendField("יישור תוכן:")
          .appendField(new Blockly.FieldDropdown([
            ["ימין", "right"],
            ["מרכז (באמצע)", "center"],
            ["שמאל", "left"]
          ]), "CONTENT_ALIGN")
          .appendField("צללית:")
          .appendField(new Blockly.FieldDropdown([
            ["עדינה", "0 4px 6px -1px rgba(0,0,0,0.1)"],
            ["רכה", "0 4px 12px rgba(15,23,42,0.08)"],
            ["מודגשת", "0 10px 15px -3px rgba(0,0,0,0.1)"],
            ["עמוקה 3D", "0 20px 30px -8px rgba(15,23,42,0.14)"],
            ["זוהר כחול", "0 0 28px rgba(37,99,235,0.24)"],
            ["זוהר סגול", "0 0 28px rgba(124,58,237,0.28)"],
            ["ללא צל", "none"]
          ]), "SHADOW");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("תוכן הכרטיסייה:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#6366f1');
      this.setTooltip("יוצר כרטיסייה מעוצבת וממורכזת להכלת אלמנטים");
    }
  };
  setGen('web_card', function(block) {
    const bg = getBlockProp(block, 'BG_COLOR', '#ffffff');
    const radius = getBlockProp(block, 'RADIUS', '16px');
    const shadow = getBlockProp(block, 'SHADOW', '0 4px 12px rgba(15,23,42,0.08)');
    const contentAlign = getBlockProp(block, 'CONTENT_ALIGN', 'right');
    const dir = getBlockProp(block, 'DIRECTION', 'column');
    const justify = getBlockProp(block, 'JUSTIFY', 'flex-start');
    const defaultFlexAlign =
      contentAlign === 'center'
        ? 'center'
        : contentAlign === 'left'
        ? 'flex-end'
        : 'flex-start';
    const align = getBlockProp(block, 'ALIGN_ITEMS', defaultFlexAlign);
    const gap = getBlockProp(block, 'GAP', '14px');
    const padding = getBlockProp(block, 'PADDING', '28px');
    const margin = getBlockProp(block, 'MARGIN', '0 auto 24px auto');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'background-color': bg,
      'border-radius': radius,
      'box-shadow': shadow,
      'padding': padding,
      'margin': margin,
      'border': '1px solid rgba(15,23,42,0.07)',
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'display': 'flex',
      'flex-direction': dir,
      'justify-content': justify,
      'align-items': align,
      'text-align': contentAlign,
      'gap': gap
    });

    const hoverAttr = buildHoverAttributes(block) || `onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'"`;

    return `<div data-block-id="${block.id}" class="wb-card" style="${styleStr}" ${hoverAttr}>\n${children}</div>\n`;
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
      'border-radius': '14px',
      'display': 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 24px auto',
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
      'border-radius': '14px',
      'display': 'flex',
      'flex-direction': 'row',
      'justify-content': justify,
      'align-items': align,
      'flex-wrap': 'wrap',
      'gap': gap,
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 24px auto',
      'box-shadow': '0 4px 12px rgba(0,0,0,0.1)'
    });

    const hoverAttr = buildHoverAttributes(block);

    return `<nav data-block-id="${block.id}" class="wb-navbar-custom" style="${styleStr}" ${hoverAttr}>\n${children}</nav>\n`;
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
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '40px auto 0 auto',
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
            ["H4", "h4"],
            ["H5", "h5"],
            ["H6", "h6"]
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
      'padding': '5px 14px',
      'border-radius': '9999px',
      'font-size': '0.85rem',
      'font-weight': 'bold',
      'display': 'inline-block',
      'width': 'fit-content',
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
            ["75%", "75%"],
            ["50% (חצי)", "50%"],
            ["33.33% (שליש)", "33.33%"],
            ["800px (רחב)", "800px"],
            ["600px (גדול)", "600px"],
            ["400px (בינוני-גדול)", "400px"],
            ["300px (בינוני)", "300px"],
            ["200px (קטן-בינוני)", "200px"],
            ["150px (קטן)", "150px"],
            ["אוטומטי (Auto)", "auto"]
          ]), "WIDTH")
          .appendField("פינות:")
          .appendField(new Blockly.FieldDropdown([
            ["כן (12px)", "12px"],
            ["עדינות (6px)", "6px"],
            ["עגולות (24px)", "24px"],
            ["עיגול מלא (50%)", "50%"],
            ["ללא (0px)", "0px"]
          ]), "RADIUS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip("תמונה מעוצבת עם שליטת גודל, רוחב, גובה ופינות ב-CSS");
    }
  };
  setGen('web_image', function(block) {
    const src = getBlockProp(block, 'SRC', '');
    const alt = getBlockProp(block, 'ALT', 'תמונה');
    const loading = getBlockProp(block, 'LOADING', 'lazy');
    const hasCustomWidth =
      block?.customProperties &&
      Object.prototype.hasOwnProperty.call(block.customProperties, 'WIDTH');
    const rawWidth = hasCustomWidth
      ? (block.customProperties.WIDTH || 'auto')
      : getBlockProp(block, 'WIDTH', '100%');
    const width = normalizeCssUnit(rawWidth, 'px');
    const radius = getBlockProp(block, 'RADIUS', '12px');
    const align = getBlockProp(block, 'ALIGN', '');
    const objectFit = getBlockProp(block, 'OBJECT_FIT', 'contain');
    const height = getBlockProp(block, 'HEIGHT', 'auto');

    let defaultMargin = '12px 0';
    if (align === 'center') defaultMargin = '12px auto';
    else if (align === 'left') defaultMargin = '12px auto 12px 0';
    else if (align === 'right') defaultMargin = '12px 0 12px auto';

    const baseStyles = {
      'width': width,
      'max-width': '100%',
      'height': height && height !== 'auto' ? normalizeCssUnit(height, 'px') : 'auto',
      'object-fit': objectFit || 'contain',
      'border-radius': radius,
      'display': 'block',
      'margin': defaultMargin,
      'box-shadow': '0 4px 6px rgba(0,0,0,0.05)'
    };

    const styleStr = buildUniversalStyleString(block, baseStyles);

    const hoverAttr = buildHoverAttributes(block);

    return `<img data-block-id="${block.id}" src="${src}" alt="${alt.replace(/"/g, '&quot;')}" loading="${loading}" style="${styleStr}" ${hoverAttr} />\n`;
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
            ["שירותים ומחירים (services.html)", "services.html"],
            ["פורטל ודאטה-בייס (portal.html)", "portal.html"],
            ["אודות (about.html)", "about.html"],
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

  // Regular & Composable Link (<a>)
  Blockly.Blocks['web_link'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔗 קישור (<a>) | טקסט:")
          .appendField(new Blockly.FieldTextInput("מעבר לקישור ↗️"), "TEXT");
      this.appendDummyInput()
          .appendField("כתובת URL / עוגן:")
          .appendField(new Blockly.FieldTextInput("https://google.com"), "URL")
          .appendField("פתיחה:")
          .appendField(new Blockly.FieldDropdown([
            ["באותו עמוד (_self)", "_self"],
            ["בלשונית חדשה (_blank)", "_blank"]
          ]), "TARGET");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("או עטוף בלוקים בקישור (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תגית קישור <a> תקנית - יכולה להכיל טקסט או לעטוף כרטיסייה/תמונה/כפתור");
    }
  };
  setGen('web_link', function(block) {
    const text = getBlockProp(block, 'TEXT', 'קישור');
    const url = getBlockProp(block, 'URL', '#');
    const target = getBlockProp(block, 'TARGET', '_self');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';

    const styleStr = buildUniversalStyleString(block, {
      'color': '#2563eb',
      'text-decoration': children.trim() ? 'none' : 'underline',
      'font-weight': '600',
      'margin': '4px 0',
      'display': children.trim() ? 'block' : 'inline-block'
    });

    const hoverAttr = buildHoverAttributes(block);
    const targetAttr = target === '_blank' ? `target="_blank" rel="noopener noreferrer"` : '';
    const innerContent = children.trim() ? `\n${children}` : text;

    return `<a data-block-id="${block.id}" href="${url}" ${targetAttr} style="${styleStr}" ${hoverAttr}>${innerContent}</a>\n`;
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
            ["שירותים ומחירים (services.html)", "services.html"],
            ["פורטל ודאטה-בייס (portal.html)", "portal.html"],
            ["אודות (about.html)", "about.html"],
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

  // 2. Input Field (All HTML5 Input Types)
  Blockly.Blocks['web_input_field'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔤 שדה קלט (<input>) | תווית:")
          .appendField(new Blockly.FieldTextInput("הכנס שם מלא:"), "LABEL");
      this.appendDummyInput()
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("TextBox1"), "INPUT_ID")
          .appendField("סוג:")
          .appendField(new Blockly.FieldDropdown([
            ["טקסט (Text)", "text"],
            ["אימייל (Email)", "email"],
            ["טלפון (Tel)", "tel"],
            ["סיסמה (Password)", "password"],
            ["מספר (Number)", "number"],
            ["קישור (URL)", "url"],
            ["חיפוש (Search)", "search"],
            ["תאריך (Date)", "date"],
            ["שעה (Time)", "time"],
            ["תאריך ושעה (DateTime)", "datetime-local"],
            ["חודש (Month)", "month"],
            ["העלאת קובץ (File)", "file"],
            ["בחירה בודדת (Radio)", "radio"],
            ["תיבת סימון (Checkbox)", "checkbox"]
          ]), "TYPE");
      this.appendDummyInput()
          .appendField("רמז (Placeholder):")
          .appendField(new Blockly.FieldTextInput("הקלד כאן..."), "PLACEHOLDER")
          .appendField("חובה:")
          .appendField(new Blockly.FieldDropdown([
            ["אופציונלי", "false"],
            ["שדה חובה (required)", "true"]
          ]), "REQUIRED");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("שדה קלט HTML5 מלא עם תמיכה בכל הסוגים (text, email, date, file, radio, number ועוד)");
    }
  };
  setGen('web_input_field', function(block) {
    const label = getBlockProp(block, 'LABEL', 'קלט:');
    const placeholder = getBlockProp(block, 'PLACEHOLDER', '');
    const type = getBlockProp(block, 'TYPE', 'text');
    const inputId = getBlockProp(block, 'INPUT_ID', 'TextBox1');
    const nameAttr = getBlockProp(block, 'INPUT_NAME', inputId);
    const isRequired = getBlockProp(block, 'REQUIRED', 'false') === 'true';
    const minVal = getBlockProp(block, 'MIN', '');
    const maxVal = getBlockProp(block, 'MAX', '');
    const stepVal = getBlockProp(block, 'STEP', '');
    const patternVal = getBlockProp(block, 'PATTERN', '');

    const extraAttrs = [
      `name="${nameAttr}"`,
      isRequired ? 'required' : '',
      minVal !== '' ? `min="${minVal}"` : '',
      maxVal !== '' ? `max="${maxVal}"` : '',
      stepVal !== '' ? `step="${stepVal}"` : '',
      patternVal !== '' ? `pattern="${patternVal.replace(/"/g, '&quot;')}"` : ''
    ].filter(Boolean).join(' ');

    if (type === 'checkbox' || type === 'radio') {
      return `<div data-block-id="${block.id}" style="display: flex; align-items: center; gap: 10px; margin: 10px 0; text-align: right;" ${buildBlockExtraAttributes(block)}>\n  <input id="${inputId}" type="${type}" ${extraAttrs} style="width: 18px; height: 18px; cursor: pointer;" />\n  <label for="${inputId}" style="font-weight: 700; color: #334155; font-size: 0.92rem; cursor: pointer;">${label}</label>\n</div>\n`;
    }

    const inputStyleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'padding': '10px 14px',
      'border': '1.5px solid #cbd5e1',
      'border-radius': '8px',
      'font-size': '0.95rem',
      'outline': 'none',
      'box-sizing': 'border-box'
    });

    return `<div data-block-id="${block.id}" style="margin-bottom: 14px; text-align: right; width: 100%; box-sizing: border-box;" ${buildBlockExtraAttributes(block)}>\n  ${label ? `<label for="${inputId}" style="display: block; font-weight: 700; margin-bottom: 6px; color: #334155; font-size: 0.9rem;">${label}</label>\n  ` : ''}<input id="${inputId}" type="${type}" placeholder="${placeholder}" ${extraAttrs} style="${inputStyleStr}" />\n</div>\n`;
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

  // ---------------------------------------------------------
  // 🌟 10. רכיבי על מוכנים (PRO UI COMPONENTS)
  // ---------------------------------------------------------

  // 10.1 ✨ Hero Section (אזור פתיחה יוקרתי)
  Blockly.Blocks['web_hero_section'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("✨ אזור פתיחה יוקרתי (Hero Banner)");
      this.appendDummyInput()
          .appendField("ערכת עיצוב:")
          .appendField(new Blockly.FieldDropdown([
            ["🌌 סייבר-ניאון כהה", "cyber_dark"],
            ["💎 כחול הייטק מודרני", "tech_blue"],
            ["🌅 שקיעה צבעונית", "sunset_glow"],
            ["🌿 ירוק אמרלד נקי", "emerald_clean"],
            ["🤍 לבן מינימליסטי", "minimal_light"]
          ]), "STYLE_PRESET")
          .appendField("פריסה:")
          .appendField(new Blockly.FieldDropdown([
            ["🎯 ממורכז באמצע", "center"],
            ["🖼️ דו-צדדי (טקסט + תמונה)", "split"]
          ]), "LAYOUT_MODE");
      this.appendDummyInput()
          .appendField("תגית:")
          .appendField(new Blockly.FieldTextInput("ברוכים הבאים לדור הבא 🚀"), "BADGE")
          .appendField("כותרת:")
          .appendField(new Blockly.FieldTextInput("בונים את העתיד הדיגיטלי שלך"), "TITLE");
      this.appendDummyInput()
          .appendField("תת-כותרת:")
          .appendField(new Blockly.FieldTextInput("חוויית גלישה מתקדמת, עיצוב מרהיב וטכנולוגיה חכמה במקום אחד."), "SUBTITLE");
      this.appendDummyInput()
          .appendField("טקסט כפתור:")
          .appendField(new Blockly.FieldTextInput("התחל עכשיו 🚀"), "BTN_TEXT")
          .appendField("קישור כפתור:")
          .appendField(new Blockly.FieldTextInput("contact.html"), "BTN_LINK");
      this.appendDummyInput()
          .appendField("תמונה (לדו-צדדי):")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop"), "IMG_URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("אזור פתיחה יוקרתי (Hero Section) עם תגית, כותרת, תת-כותרת, כפתור ותמונה");
    }
  };
  setGen('web_hero_section', function(block) {
    const preset = getBlockProp(block, 'STYLE_PRESET', 'cyber_dark');
    const layoutMode = getBlockProp(block, 'LAYOUT_MODE', 'center');
    const badge = getBlockProp(block, 'BADGE', 'ברוכים הבאים 🚀');
    const title = getBlockProp(block, 'TITLE', 'בונים את העתיד הדיגיטלי שלך');
    const subtitle = getBlockProp(block, 'SUBTITLE', '');
    const btnText = getBlockProp(block, 'BTN_TEXT', 'התחל עכשיו 🚀');
    const btnLink = getBlockProp(block, 'BTN_LINK', 'contact.html');
    const imgUrl = getBlockProp(block, 'IMG_URL', '');

    const themes = {
      cyber_dark: {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
        text: '#ffffff',
        sub: '#cbd5e1',
        badgeBg: 'rgba(139, 92, 246, 0.25)',
        badgeColor: '#c4b5fd',
        btnBg: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        btnText: '#ffffff'
      },
      tech_blue: {
        bg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0ea5e9 100%)',
        text: '#ffffff',
        sub: '#e0f2fe',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
        badgeColor: '#ffffff',
        btnBg: '#ffffff',
        btnText: '#1e3a8a'
      },
      sunset_glow: {
        bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #db2777 100%)',
        text: '#ffffff',
        sub: '#ffedd5',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
        badgeColor: '#ffffff',
        btnBg: '#ffffff',
        btnText: '#9a3412'
      },
      emerald_clean: {
        bg: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%)',
        text: '#ffffff',
        sub: '#d1fae5',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
        badgeColor: '#ffffff',
        btnBg: '#ffffff',
        btnText: '#065f46'
      },
      minimal_light: {
        bg: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        text: '#0f172a',
        sub: '#475569',
        badgeBg: '#dbeafe',
        badgeColor: '#1e40af',
        btnBg: '#2563eb',
        btnText: '#ffffff'
      }
    };

    const t = themes[preset] || themes.cyber_dark;

    const styleStr = buildUniversalStyleString(block, {
      'background': t.bg,
      'color': t.text,
      'border-radius': '24px',
      'padding': '48px 36px',
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 28px auto',
      'box-shadow': '0 20px 40px -12px rgba(15, 23, 42, 0.22)',
      'position': 'relative',
      'overflow': 'hidden'
    });

    const hoverAttr = buildHoverAttributes(block);

    if (layoutMode === 'split' && imgUrl) {
      return `<section data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>
  <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 32px;">
    <div style="flex: 1 1 360px; text-align: right;">
      ${badge ? `<span style="display: inline-block; background: ${t.badgeBg}; color: ${t.badgeColor}; padding: 6px 16px; border-radius: 9999px; font-size: 0.88rem; font-weight: 800; margin-bottom: 16px;">${badge}</span>` : ''}
      <h1 style="font-size: clamp(2rem, 4vw, 3.1rem); font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: ${t.text};">${title}</h1>
      <p style="font-size: 1.15rem; line-height: 1.65; color: ${t.sub}; margin: 0 0 26px 0;">${subtitle}</p>
      ${btnText ? `<a href="${btnLink}" style="display: inline-block; background: ${t.btnBg}; color: ${t.btnText}; padding: 14px 30px; border-radius: 12px; font-weight: 800; font-size: 1.05rem; text-decoration: none; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">${btnText}</a>` : ''}
    </div>
    <div style="flex: 1 1 320px; text-align: center;">
      <img src="${imgUrl}" alt="${title}" style="width: 100%; max-width: 460px; border-radius: 18px; box-shadow: 0 16px 35px rgba(0,0,0,0.3); object-fit: contain;" />
    </div>
  </div>
</section>\n`;
    }

    return `<section data-block-id="${block.id}" style="${styleStr}; text-align: center;" ${hoverAttr}>
  <div style="max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
    ${badge ? `<span style="display: inline-block; background: ${t.badgeBg}; color: ${t.badgeColor}; padding: 6px 16px; border-radius: 9999px; font-size: 0.88rem; font-weight: 800; margin-bottom: 16px; width: fit-content;">${badge}</span>` : ''}
    <h1 style="font-size: clamp(2.1rem, 4.5vw, 3.4rem); font-weight: 900; line-height: 1.2; margin: 0 0 16px 0; color: ${t.text}; text-align: center;">${title}</h1>
    <p style="font-size: 1.18rem; line-height: 1.65; color: ${t.sub}; margin: 0 0 28px 0; text-align: center;">${subtitle}</p>
    ${btnText ? `<a href="${btnLink}" style="display: inline-block; background: ${t.btnBg}; color: ${t.btnText}; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 1.05rem; text-decoration: none; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">${btnText}</a>` : ''}
  </div>
</section>\n`;
  });

  // 10.2 🏛️ Responsive Grid Columns (רשת עמודות חכמה 2/3/4 עמודות)
  Blockly.Blocks['web_grid_columns'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🏛️ רשת עמודות חכמה (CSS Grid)")
          .appendField("עמודות:")
          .appendField(new Blockly.FieldDropdown([
            ["3 עמודות בשורה", "3"],
            ["2 עמודות בשורה", "2"],
            ["4 עמודות בשורה", "4"]
          ]), "COLS")
          .appendField("מרווח:")
          .appendField(new Blockly.FieldDropdown([
            ["רגיל (24px)", "24px"],
            ["צמוד (14px)", "14px"],
            ["רחב (36px)", "36px"]
          ]), "GAP");
      this.appendStatementInput("CHILDREN")
          .setCheck(null)
          .appendField("כרטיסים / רכיבים בתוך הרשת:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#6366f1');
      this.setTooltip("מסדר כרטיסים ורכיבים ב-2, 3 או 4 עמודות שוות שמתאימות אוטומטית למובייל");
    }
  };
  setGen('web_grid_columns', function(block) {
    const cols = parseInt(getBlockProp(block, 'COLS', '3'), 10) || 3;
    const gap = getBlockProp(block, 'GAP', '24px');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const minPx = cols === 4 ? '220px' : cols === 2 ? '320px' : '270px';

    const styleStr = buildUniversalStyleString(block, {
      'display': 'grid',
      'grid-template-columns': `repeat(auto-fit, minmax(${minPx}, 1fr))`,
      'gap': gap,
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 28px auto',
      'align-items': 'stretch'
    });

    return `<div data-block-id="${block.id}" class="wb-grid-container" style="${styleStr}">\n${children}</div>\n`;
  });

  // 10.3 🛍️ E-Commerce Product Card (כרטיס מוצר לחנות)
  Blockly.Blocks['web_product_card'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🛍️ כרטיס מוצר לחנות (Product Card)");
      this.appendDummyInput()
          .appendField("שם מוצר:")
          .appendField(new Blockly.FieldTextInput("אוזניות גיימינג Pro X"), "TITLE")
          .appendField("תגית:")
          .appendField(new Blockly.FieldTextInput("מבצע חם 🔥"), "BADGE");
      this.appendDummyInput()
          .appendField("מחיר:")
          .appendField(new Blockly.FieldTextInput("₪299"), "PRICE")
          .appendField("מחיר קודם:")
          .appendField(new Blockly.FieldTextInput("₪399"), "OLD_PRICE")
          .appendField("דירוג:")
          .appendField(new Blockly.FieldDropdown([
            ["⭐⭐⭐⭐⭐ (5.0)", "⭐⭐⭐⭐⭐"],
            ["⭐⭐⭐⭐ (4.0)", "⭐⭐⭐⭐"],
            ["⭐⭐⭐ (3.0)", "⭐⭐⭐"]
          ]), "RATING");
      this.appendDummyInput()
          .appendField("תיאור:")
          .appendField(new Blockly.FieldTextInput("סאונד היקפי 7.1, מיקרופון מבטל רעשים ותאורת RGB חכמה."), "DESC");
      this.appendDummyInput()
          .appendField("תמונה URL:")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"), "IMG_URL")
          .appendField("כפתור:")
          .appendField(new Blockly.FieldTextInput("הוסף לסל 🛒"), "BTN_TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#db2777');
      this.setTooltip("כרטיס מוצר מעוצב לחנות עם תמונה, תגית מבצע, כוכבים, מחיר וכפתור רכישה");
    }
  };
  setGen('web_product_card', function(block) {
    const title = getBlockProp(block, 'TITLE', 'מוצר מוביל');
    const badge = getBlockProp(block, 'BADGE', 'חדש');
    const price = getBlockProp(block, 'PRICE', '₪199');
    const oldPrice = getBlockProp(block, 'OLD_PRICE', '');
    const rating = getBlockProp(block, 'RATING', '⭐⭐⭐⭐⭐');
    const desc = getBlockProp(block, 'DESC', '');
    const imgUrl = getBlockProp(block, 'IMG_URL', '');
    const btnText = getBlockProp(block, 'BTN_TEXT', 'הוסף לסל 🛒');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'border-radius': '20px',
      'overflow': 'hidden',
      'box-shadow': '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
      'border': '1px solid #e2e8f0',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
      'width': '100%'
    });

    const hoverAttr = buildHoverAttributes(block) || `onmouseover="this.style.transform='translateY(-6px)'" onmouseout="this.style.transform='translateY(0)'"`;

    return `<div data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>
  <div style="position: relative; width: 100%; height: 220px; overflow: hidden; background: #f1f5f9;">
    ${badge ? `<span style="position: absolute; top: 12px; right: 12px; background: #e11d48; color: #ffffff; padding: 4px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; z-index: 2;">${badge}</span>` : ''}
    <img src="${imgUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: contain;" />
  </div>
  <div style="padding: 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; text-align: right;">
    <div style="font-size: 0.85rem;">${rating}</div>
    <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a;">${title}</h3>
    <p style="margin: 0; font-size: 0.92rem; color: #64748b; line-height: 1.5; flex: 1;">${desc}</p>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
      <div>
        <span style="font-size: 1.4rem; font-weight: 900; color: #0f172a;">${price}</span>
        ${oldPrice ? `<span style="font-size: 0.9rem; color: #94a3b8; text-decoration: line-through; margin-right: 8px;">${oldPrice}</span>` : ''}
      </div>
      <button type="button" onclick="alert('המוצר ${title.replace(/'/g, '')} נוסף לסל בהצלחה! 🛒')" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.9rem;">${btnText}</button>
    </div>
  </div>
</div>\n`;
  });

  // 10.4 💎 Pricing Card (כרטיס חבילת מחיר)
  Blockly.Blocks['web_pricing_card'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💎 כרטיס חבילת מחיר (Pricing Card)");
      this.appendDummyInput()
          .appendField("שם חבילה:")
          .appendField(new Blockly.FieldTextInput("חבילת VIP Pro"), "PLAN_NAME")
          .appendField("סגנון:")
          .appendField(new Blockly.FieldDropdown([
            ["🌟 מודגש (הכי פופולרי)", "featured"],
            ["🤍 רגיל ונקי", "standard"]
          ]), "STYLE_MODE");
      this.appendDummyInput()
          .appendField("מחיר:")
          .appendField(new Blockly.FieldTextInput("₪99"), "PRICE")
          .appendField("תקופה:")
          .appendField(new Blockly.FieldTextInput("לחודש"), "PERIOD")
          .appendField("תגית:")
          .appendField(new Blockly.FieldTextInput("הכי משתלם ⭐"), "BADGE");
      this.appendDummyInput()
          .appendField("יתרון 1:")
          .appendField(new Blockly.FieldTextInput("גישה מלאה לכל התכנים והכלים"), "FEAT1");
      this.appendDummyInput()
          .appendField("יתרון 2:")
          .appendField(new Blockly.FieldTextInput("תמיכה אישית בוואטסאפ 24/7"), "FEAT2");
      this.appendDummyInput()
          .appendField("יתרון 3:")
          .appendField(new Blockly.FieldTextInput("עדכונים ושדרוגים בחינם"), "FEAT3")
          .appendField("כפתור:")
          .appendField(new Blockly.FieldTextInput("הצטרף עכשיו 🚀"), "BTN_TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("כרטיס תמחור מקצועי להצגת חבילות ומנויים באתר");
    }
  };
  setGen('web_pricing_card', function(block) {
    const planName = getBlockProp(block, 'PLAN_NAME', 'חבילת Pro');
    const styleMode = getBlockProp(block, 'STYLE_MODE', 'featured');
    const price = getBlockProp(block, 'PRICE', '₪99');
    const period = getBlockProp(block, 'PERIOD', 'לחודש');
    const badge = getBlockProp(block, 'BADGE', 'מומלץ ⭐');
    const feat1 = getBlockProp(block, 'FEAT1', '');
    const feat2 = getBlockProp(block, 'FEAT2', '');
    const feat3 = getBlockProp(block, 'FEAT3', '');
    const btnText = getBlockProp(block, 'BTN_TEXT', 'הצטרף עכשיו 🚀');

    const isFeatured = styleMode === 'featured';

    const styleStr = buildUniversalStyleString(block, {
      'background': isFeatured ? 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)' : '#ffffff',
      'color': isFeatured ? '#ffffff' : '#0f172a',
      'border-radius': '22px',
      'padding': '32px 26px',
      'border': isFeatured ? '2px solid #818cf8' : '1px solid #cbd5e1',
      'box-shadow': isFeatured ? '0 20px 38px -10px rgba(79, 70, 229, 0.35)' : '0 8px 20px rgba(15, 23, 42, 0.06)',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
      'text-align': 'right',
      'width': '100%'
    });

    return `<div data-block-id="${block.id}" style="${styleStr}">
  <div>
    ${badge ? `<span style="display: inline-block; background: ${isFeatured ? '#4f46e5' : '#dbeafe'}; color: ${isFeatured ? '#ffffff' : '#1e40af'}; padding: 4px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; margin-bottom: 12px;">${badge}</span>` : ''}
    <h3 style="margin: 0 0 8px 0; font-size: 1.35rem; font-weight: 800;">${planName}</h3>
    <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 20px;">
      <span style="font-size: 2.5rem; font-weight: 900;">${price}</span>
      <span style="font-size: 0.92rem; opacity: 0.8;">/ ${period}</span>
    </div>
    <hr style="border: none; border-top: 1px solid ${isFeatured ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}; margin-bottom: 18px;" />
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 26px;">
      ${feat1 ? `<div style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem;"><span>✅</span><span>${feat1}</span></div>` : ''}
      ${feat2 ? `<div style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem;"><span>✅</span><span>${feat2}</span></div>` : ''}
      ${feat3 ? `<div style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem;"><span>✅</span><span>${feat3}</span></div>` : ''}
    </div>
  </div>
  <button type="button" onclick="alert('בחרת ב-${planName.replace(/'/g, '')}! נציג יחזור אליך בהקדם 🚀')" style="width: 100%; background: ${isFeatured ? '#6366f1' : '#0f172a'}; color: #ffffff; border: none; padding: 13px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer;">${btnText}</button>
</div>\n`;
  });

  // 10.5 💬 Testimonial Card (כרטיס המלצת לקוח)
  Blockly.Blocks['web_testimonial_card'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💬 כרטיס המלצת לקוח (Testimonial)");
      this.appendDummyInput()
          .appendField("שם הממליץ:")
          .appendField(new Blockly.FieldTextInput("דניאל כהן"), "NAME")
          .appendField("תפקיד/תיאור:")
          .appendField(new Blockly.FieldTextInput("לקוח מרוצה"), "ROLE")
          .appendField("כוכבים:")
          .appendField(new Blockly.FieldDropdown([
            ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["⭐⭐⭐⭐", "⭐⭐⭐⭐"]
          ]), "STARS");
      this.appendDummyInput()
          .appendField("תוכן ההמלצה:")
          .appendField(new Blockly.FieldTextInput("השירות הכי מקצועי שנתקלתי בו! האתר עובד מהר ונראה מיליון דולר."), "QUOTE");
      this.appendDummyInput()
          .appendField("תמונת פרופיל URL:")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"), "AVATAR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0891b2');
      this.setTooltip("כרטיס ביקורת והמלצת לקוח עם תמונת פרופיל, דירוג כוכבים וציטוט");
    }
  };
  setGen('web_testimonial_card', function(block) {
    const name = getBlockProp(block, 'NAME', 'דניאל כהן');
    const role = getBlockProp(block, 'ROLE', 'לקוח מרוצה');
    const stars = getBlockProp(block, 'STARS', '⭐⭐⭐⭐⭐');
    const quote = getBlockProp(block, 'QUOTE', '');
    const avatar = getBlockProp(block, 'AVATAR', '');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'border-radius': '18px',
      'padding': '24px',
      'border': '1px solid #e2e8f0',
      'box-shadow': '0 8px 20px rgba(15, 23, 42, 0.06)',
      'display': 'flex',
      'flex-direction': 'column',
      'gap': '14px',
      'text-align': 'right',
      'width': '100%'
    });

    return `<div data-block-id="${block.id}" style="${styleStr}">
  <div style="font-size: 0.95rem;">${stars}</div>
  <p style="margin: 0; font-size: 1rem; color: #334155; line-height: 1.6; font-style: italic;">"${quote}"</p>
  <div style="display: flex; align-items: center; gap: 12px; margin-top: 6px;">
    ${avatar ? `<img src="${avatar}" alt="${name}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #38bdf8;" />` : ''}
    <div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">${name}</div>
      <div style="font-size: 0.8rem; color: #64748b;">${role}</div>
    </div>
  </div>
</div>\n`;
  });

  // 10.6 ❓ FAQ Accordion Item (שאלה ותשובה מתקפלת)
  Blockly.Blocks['web_faq_item'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("❓ שאלה נפוצה מתקפלת (FAQ Accordion)");
      this.appendDummyInput()
          .appendField("השאלה:")
          .appendField(new Blockly.FieldTextInput("איך אפשר להזמין ולקבל משלוח מהיר?"), "QUESTION");
      this.appendDummyInput()
          .appendField("התשובה:")
          .appendField(new Blockly.FieldTextInput("בוחרים את המוצר באתר, לוחצים על כפתור ההזמנה והשליח בדרך אליכם תוך 24 שעות!"), "ANSWER");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0d9488');
      this.setTooltip("בלוק שאלה ותשובה אינטראקטיבי שנפתח ונסגר בלחיצה");
    }
  };
  setGen('web_faq_item', function(block) {
    const question = getBlockProp(block, 'QUESTION', 'שאלה נפוצה?');
    const answer = getBlockProp(block, 'ANSWER', 'תשובה מפורטת.');

    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'border': '1px solid #cbd5e1',
      'border-radius': '14px',
      'padding': '16px 20px',
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 12px auto',
      'text-align': 'right',
      'box-shadow': '0 2px 8px rgba(15, 23, 42, 0.04)'
    });

    return `<details data-block-id="${block.id}" style="${styleStr}">
  <summary style="font-weight: 800; font-size: 1.05rem; color: #0f172a; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center;">
    <span>❓ ${question}</span>
    <span style="color: #2563eb; font-size: 0.9rem;">▼</span>
  </summary>
  <p style="margin: 12px 0 0 0; padding-top: 12px; border-top: 1px solid #f1f5f9; color: #475569; line-height: 1.6; font-size: 0.96rem;">${answer}</p>
</details>\n`;
  });

  // 10.7 📊 Progress / Skill Bar (סרגל התקדמות אחוזים)
  Blockly.Blocks['web_progress_bar'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📊 סרגל התקדמות אחוזים | כותרת:")
          .appendField(new Blockly.FieldTextInput("שביעות רצון לקוחות"), "LABEL")
          .appendField("אחוז (0-100):")
          .appendField(new Blockly.FieldTextInput("96"), "PERCENT")
          .appendField("צבע:")
          .appendField(new Blockly.FieldTextInput("#2563eb"), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("מציג סרגל התקדמות ויזואלי עם אחוזים");
    }
  };
  setGen('web_progress_bar', function(block) {
    const label = getBlockProp(block, 'LABEL', 'מדד הצלחה');
    const pct = Math.min(100, Math.max(0, parseInt(getBlockProp(block, 'PERCENT', '90'), 10) || 90));
    const color = getBlockProp(block, 'COLOR', '#2563eb');

    return `<div data-block-id="${block.id}" style="width: 100%; margin: 10px 0; text-align: right;">
  <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.92rem; color: #1e293b; margin-bottom: 6px;">
    <span>${label}</span>
    <span style="color: ${color};">${pct}%</span>
  </div>
  <div style="width: 100%; height: 12px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
    <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: 999px; transition: width 0.6s ease;"></div>
  </div>
</div>\n`;
  });

  // 10.8 🖼️ Smart Image Gallery (גלריית 3 תמונות מעוצבת)
  Blockly.Blocks['web_image_gallery'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🖼️ גלריית תמונות חכמה (3 תמונות בשורה)");
      this.appendDummyInput()
          .appendField("תמונה 1:")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop"), "IMG1")
          .appendField("כיתוב 1:")
          .appendField(new Blockly.FieldTextInput("עמדת גיימינג מתקדמת"), "CAP1");
      this.appendDummyInput()
          .appendField("תמונה 2:")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop"), "IMG2")
          .appendField("כיתוב 2:")
          .appendField(new Blockly.FieldTextInput("טורנירים בשידור חי"), "CAP2");
      this.appendDummyInput()
          .appendField("תמונה 3:")
          .appendField(new Blockly.FieldTextInput("https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop"), "IMG3")
          .appendField("כיתוב 3:")
          .appendField(new Blockly.FieldTextInput("הציוד החדשני בעולם"), "CAP3");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip("גלריית תמונות רספונסיבית עם כיתובים ואפקט ריחוף");
    }
  };
  setGen('web_image_gallery', function(block) {
    const items = [
      { img: getBlockProp(block, 'IMG1', ''), cap: getBlockProp(block, 'CAP1', '') },
      { img: getBlockProp(block, 'IMG2', ''), cap: getBlockProp(block, 'CAP2', '') },
      { img: getBlockProp(block, 'IMG3', ''), cap: getBlockProp(block, 'CAP3', '') }
    ].filter((x) => x.img);

    const cardsHtml = items
      .map(
        (item) => `<div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 18px rgba(15,23,42,0.08); border: 1px solid #e2e8f0; transition: transform 0.25s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
    <img src="${item.img}" alt="${item.cap}" style="width: 100%; height: 210px; object-fit: contain; display: block; background: #f8fafc;" />
    ${item.cap ? `<div style="padding: 12px 16px; font-weight: 700; font-size: 0.95rem; color: #0f172a; text-align: center;">${item.cap}</div>` : ''}
  </div>`
      )
      .join('\n  ');

    return `<div data-block-id="${block.id}" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; width: 100%; max-width: var(--site-max-width, 1140px); margin: 0 auto 24px auto;">
  ${cardsHtml}
</div>\n`;
  });

  // 10.9 🌐 Social Media Links Bar (שורת רשתות חברתיות)
  Blockly.Blocks['web_social_links'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌐 כפתורי רשתות חברתיות (Social Links)");
      this.appendDummyInput()
          .appendField("אינסטגרם:")
          .appendField(new Blockly.FieldTextInput("https://instagram.com"), "INSTAGRAM")
          .appendField("טיקטוק:")
          .appendField(new Blockly.FieldTextInput("https://tiktok.com"), "TIKTOK");
      this.appendDummyInput()
          .appendField("יוטיוב:")
          .appendField(new Blockly.FieldTextInput("https://youtube.com"), "YOUTUBE")
          .appendField("דיסקורד:")
          .appendField(new Blockly.FieldTextInput("https://discord.com"), "DISCORD");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4f46e5');
      this.setTooltip("שורת כפתורים מעוצבים לרשתות החברתיות של המותג");
    }
  };
  setGen('web_social_links', function(block) {
    const ig = getBlockProp(block, 'INSTAGRAM', '');
    const tt = getBlockProp(block, 'TIKTOK', '');
    const yt = getBlockProp(block, 'YOUTUBE', '');
    const dc = getBlockProp(block, 'DISCORD', '');

    return `<div data-block-id="${block.id}" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; width: 100%; margin: 16px auto;">
  ${ig ? `<a href="${ig}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(253,29,29,0.25);">📸 Instagram</a>` : ''}
  ${tt ? `<a href="${tt}" target="_blank" rel="noopener noreferrer" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(15,23,42,0.25);">🎵 TikTok</a>` : ''}
  ${yt ? `<a href="${yt}" target="_blank" rel="noopener noreferrer" style="background: #dc2626; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(220,38,38,0.25);">▶️ YouTube</a>` : ''}
  ${dc ? `<a href="${dc}" target="_blank" rel="noopener noreferrer" style="background: #5865F2; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(88,101,242,0.25);">🎮 Discord</a>` : ''}
</div>\n`;
  });

  // 10.10 📋 Complete List Block (<ul> / <ol> רשימה מלאה מסודרת או עם נקודות)
  Blockly.Blocks['web_list_block'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📋 רשימה מלאה (<ul> / <ol>) — סוג:")
          .appendField(new Blockly.FieldDropdown([
            ["• רשימת נקודות (ul)", "ul"],
            ["1. רשימה ממוספרת (ol)", "ol"],
            ["✅ רשימת יתרונות מעוצבת", "check"]
          ]), "LIST_TYPE");
      this.appendDummyInput()
          .appendField("שורה 1:")
          .appendField(new Blockly.FieldTextInput("משלוח מהיר לכל הארץ"), "ITEM1")
          .appendField("שורה 2:")
          .appendField(new Blockly.FieldTextInput("אחריות מלאה לשנה"), "ITEM2");
      this.appendDummyInput()
          .appendField("שורה 3:")
          .appendField(new Blockly.FieldTextInput("שירות לקוחות VIP 24/7"), "ITEM3")
          .appendField("שורה 4 (אופציונלי):")
          .appendField(new Blockly.FieldTextInput(""), "ITEM4");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0284c7');
      this.setTooltip("רשימת HTML מלאה (<ul> או <ol>) עם פריטי <li> ועיצוב מלא");
    }
  };
  setGen('web_list_block', function(block) {
    const listType = getBlockProp(block, 'LIST_TYPE', 'ul');
    const items = [
      getBlockProp(block, 'ITEM1', ''),
      getBlockProp(block, 'ITEM2', ''),
      getBlockProp(block, 'ITEM3', ''),
      getBlockProp(block, 'ITEM4', '')
    ].filter(Boolean);
    const tag = listType === 'ol' ? 'ol' : 'ul';
    const isCheck = listType === 'check';
    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'padding': isCheck ? '16px 20px' : '16px 34px 16px 20px',
      'border-radius': '14px',
      'border': '1px solid #e2e8f0',
      'margin': '0 0 16px 0',
      'color': '#1e293b',
      'font-size': '16px',
      'line-height': '1.8',
      'list-style': isCheck ? 'none' : (tag === 'ol' ? 'decimal' : 'disc')
    });
    const hoverAttr = buildHoverAttributes(block);
    const lis = items
      .map((it) => `<li style="margin-bottom: 6px; font-weight: 600;">${isCheck ? '✅ ' : ''}${it}</li>`)
      .join('\n  ');
    return `<${tag} data-block-id="${block.id}" style="${styleStr}" ${hoverAttr}>\n  ${lis}\n</${tag}>\n`;
  });

  // 10.11 📊 Comparison Table Block (<table> טבלת השוואה / מחירון מלאה)
  Blockly.Blocks['web_table_block'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📊 טבלת נתונים והשוואה (<table>) — כותרת:")
          .appendField(new Blockly.FieldTextInput("טבלת השוואת מסלולים ומוצרים"), "TITLE");
      this.appendDummyInput()
          .appendField("עמודה 1:")
          .appendField(new Blockly.FieldTextInput("מוצר / חבילה"), "COL1")
          .appendField("עמודה 2:")
          .appendField(new Blockly.FieldTextInput("מה כלול"), "COL2")
          .appendField("עמודה 3:")
          .appendField(new Blockly.FieldTextInput("מחיר"), "COL3");
      this.appendDummyInput()
          .appendField("שורה 1:")
          .appendField(new Blockly.FieldTextInput("חבילת בסיס"), "R1C1")
          .appendField(new Blockly.FieldTextInput("גישה מלאה + משלוח"), "R1C2")
          .appendField(new Blockly.FieldTextInput("₪99"), "R1C3");
      this.appendDummyInput()
          .appendField("שורה 2:")
          .appendField(new Blockly.FieldTextInput("חבילת Pro ⭐"), "R2C1")
          .appendField(new Blockly.FieldTextInput("הכל כלול + בונוס מיוחד"), "R2C2")
          .appendField(new Blockly.FieldTextInput("₪179"), "R2C3");
      this.appendDummyInput()
          .appendField("שורה 3:")
          .appendField(new Blockly.FieldTextInput("חבילת VIP 👑"), "R3C1")
          .appendField(new Blockly.FieldTextInput("ליווי אישי + אחריות כפולה"), "R3C2")
          .appendField(new Blockly.FieldTextInput("₪299"), "R3C3");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("טבלת HTML (<table>, <thead>, <tbody>, <tr>, <th>, <td>) מעוצבת להשוואת מוצרים או מחירים");
    }
  };
  setGen('web_table_block', function(block) {
    const title = getBlockProp(block, 'TITLE', '');
    const c1 = getBlockProp(block, 'COL1', 'עמודה 1');
    const c2 = getBlockProp(block, 'COL2', 'עמודה 2');
    const c3 = getBlockProp(block, 'COL3', 'עמודה 3');
    const rows = [
      [getBlockProp(block, 'R1C1', ''), getBlockProp(block, 'R1C2', ''), getBlockProp(block, 'R1C3', '')],
      [getBlockProp(block, 'R2C1', ''), getBlockProp(block, 'R2C2', ''), getBlockProp(block, 'R2C3', '')],
      [getBlockProp(block, 'R3C1', ''), getBlockProp(block, 'R3C2', ''), getBlockProp(block, 'R3C3', '')]
    ].filter((r) => r.some(Boolean));

    const headerBg = getBlockProp(block, 'BG_COLOR', '#1e293b');
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 24px auto',
      'background-color': '#ffffff',
      'border-radius': '16px',
      'overflow': 'hidden',
      'box-shadow': '0 8px 24px rgba(15,23,42,0.07)',
      'border': '1px solid #e2e8f0'
    });

    const rowsHtml = rows
      .map(
        (r, idx) => `<tr style="background: ${idx % 2 === 1 ? '#f8fafc' : '#ffffff'}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 13px 16px; font-weight: 800; color: #0f172a;">${r[0]}</td>
        <td style="padding: 13px 16px; color: #475569;">${r[1]}</td>
        <td style="padding: 13px 16px; font-weight: 800; color: #2563eb;">${r[2]}</td>
      </tr>`
      )
      .join('\n      ');

    return `<div data-block-id="${block.id}" style="${styleStr}">
  ${title ? `<div style="padding: 14px 20px; font-weight: 900; font-size: 1.1rem; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${title}</div>` : ''}
  <table style="width: 100%; border-collapse: collapse; text-align: right;">
    <thead>
      <tr style="background: ${headerBg}; color: #ffffff;">
        <th style="padding: 13px 16px; font-weight: 800;">${c1}</th>
        <th style="padding: 13px 16px; font-weight: 800;">${c2}</th>
        <th style="padding: 13px 16px; font-weight: 800;">${c3}</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</div>\n`;
  });

  // 10.12 🎵 Audio Player Block (<audio controls> נגן אודיו ומוזיקה)
  Blockly.Blocks['web_audio_player'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎵 נגן מוזיקה / אודיו (<audio>) — כותרת:")
          .appendField(new Blockly.FieldTextInput("פסקול האתר / פודקאסט"), "TITLE");
      this.appendDummyInput()
          .appendField("קישור לקובץ שמע (MP3):")
          .appendField(new Blockly.FieldTextInput("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"), "AUDIO_URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#10b981');
      this.setTooltip("נגן אודיו מובנה ב-HTML5 (<audio controls>)");
    }
  };
  setGen('web_audio_player', function(block) {
    const title = getBlockProp(block, 'TITLE', 'נגן מוזיקה');
    const url = getBlockProp(block, 'AUDIO_URL', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'padding': '16px 20px',
      'border-radius': '16px',
      'border': '1px solid #cbd5e1',
      'margin': '0 0 16px 0',
      'max-width': '520px'
    });
    return `<div data-block-id="${block.id}" style="${styleStr}">
  <div style="font-weight: 800; color: #0f172a; margin-bottom: 8px;">🎵 ${title}</div>
  <audio controls src="${url}" style="width: 100%;"></audio>
</div>\n`;
  });

  // 10.13 🎨 Custom CSS Block (<style> כתיבת חוקי CSS מותאמים אישית)
  Blockly.Blocks['web_custom_css'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎨 עיצוב CSS מותאם אישית (<style>):")
          .appendField(new Blockly.FieldTextInput(".my-glow { box-shadow: 0 0 25px rgba(59,130,246,0.5); }"), "CSS_CODE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#475569');
      this.setTooltip("מאפשר להוסיף כל חוק CSS מותאם אישית או אנימציית @keyframes לדף");
    }
  };
  setGen('web_custom_css', function(block) {
    const css = getBlockProp(block, 'CSS_CODE', '');
    return `<style data-block-id="${block.id}">\n${css}\n</style>\n`;
  });

  // =========================================================================
  // 11. MODULAR HTML5 BUILDING BLOCKS (No monolithic super-components)
  // =========================================================================

  // 11.1 Semantic HTML5 Container (<section>, <article>, <header>, <nav>, <main>, <aside>, <footer>, <div>)
  Blockly.Blocks['web_semantic_container'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🧱 אזור סמנטי:")
          .appendField(new Blockly.FieldDropdown([
            ["<section> מקטע תוכן", "section"],
            ["<header> כותרת עליונה", "header"],
            ["<nav> תפריט ניווט", "nav"],
            ["<main> תוכן ראשי", "main"],
            ["<article> מאמר / פריט", "article"],
            ["<aside> סרגל צד", "aside"],
            ["<footer> תחתית דף", "footer"],
            ["<div> מיכל כללי", "div"]
          ]), "TAG")
          .appendField("מזהה (ID):")
          .appendField(new Blockly.FieldTextInput(""), "ELEMENT_ID");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("תוכן פנימי:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f172a');
      this.setTooltip("תגית מבנה סמנטית של HTML5. גרור פנימה אלמנטים ועצב בסטודיו (Flex, Grid, רקע, ריווח)");
    }
  };
  setGen('web_semantic_container', function(block) {
    const allowedTags = ['section', 'header', 'nav', 'main', 'article', 'aside', 'footer', 'div'];
    const rawTag = getBlockProp(block, 'TAG', 'section');
    const tag = allowedTags.includes(rawTag) ? rawTag : 'section';
    const elId = getBlockProp(block, 'ELEMENT_ID', '').trim();
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'max-width': tag === 'header' || tag === 'footer' || tag === 'nav' ? '100%' : 'var(--site-max-width, 1140px)',
      'margin': '0 auto',
      'padding': '24px 20px',
      'display': 'flex',
      'flex-direction': 'column',
      'gap': '16px',
      'box-sizing': 'border-box'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    const idAttr = elId ? `id="${elId.replace(/"/g, '&quot;')}"` : '';
    return `<${tag} ${idAttr} data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}</${tag}>\n`;
  });

  // 11.2 Modular CSS Grid Container
  Blockly.Blocks['web_grid_container'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🪟 רשת CSS Grid — עמודות:")
          .appendField(new Blockly.FieldDropdown([
            ["רספונסיבי אוטומטי (auto-fit)", "repeat(auto-fit, minmax(260px, 1fr))"],
            ["2 עמודות שוות (1fr 1fr)", "repeat(2, 1fr)"],
            ["3 עמודות שוות (1fr 1fr 1fr)", "repeat(3, 1fr)"],
            ["4 עמודות שוות", "repeat(4, 1fr)"],
            ["סיידבר + תוכן (1fr 2fr)", "1fr 2fr"],
            ["תוכן + סיידבר (2fr 1fr)", "2fr 1fr"],
            ["עמודה 1 (1fr)", "1fr"]
          ]), "GRID_COLS")
          .appendField("רווח:")
          .appendField(new Blockly.FieldTextInput("24px"), "GAP");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("פריטים ברשת:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f172a');
      this.setTooltip("מיכל CSS Grid לבניית גלריות, מדפי מוצרים, טבלאות מחירים ופריסות רב-עמודתיות בעצמך");
    }
  };
  setGen('web_grid_container', function(block) {
    const gridCols = getBlockProp(block, 'GRID_COLS', 'repeat(auto-fit, minmax(260px, 1fr))');
    const gap = normalizeCssUnit(getBlockProp(block, 'GAP', '24px'));
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'display': 'grid',
      'grid-template-columns': gridCols,
      'gap': gap,
      'width': '100%',
      'max-width': 'var(--site-max-width, 1140px)',
      'margin': '0 auto 24px auto',
      'align-items': 'stretch',
      'box-sizing': 'border-box'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<div data-block-id="${block.id}" class="wb-grid-container" style="${styleStr}" ${extraAttrs}>\n${children}</div>\n`;
  });

  // 11.3 Formatted Text Block (<blockquote>, <code>, <pre>, <mark>, <strong>, <em>, <small>, <time>)
  Blockly.Blocks['web_text_format'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("✍️ טקסט סמנטי:")
          .appendField(new Blockly.FieldDropdown([
            ["<blockquote> ציטוט מעוצב", "blockquote"],
            ["<mark> טקסט מודגש (Marker)", "mark"],
            ["<code> קוד בתוך שורה", "code"],
            ["<pre> בלוק קוד", "pre"],
            ["<strong> הדגשה חשובה", "strong"],
            ["<em> טקסט נטוי (דגש)", "em"],
            ["<small> הערה / אותיות קטנות", "small"],
            ["<time> תאריך / שעה", "time"]
          ]), "TAG")
          .appendField(new Blockly.FieldTextInput("טקסט לדוגמה..."), "CONTENT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#2563eb');
      this.setTooltip("תגיות טקסט סמנטיות של HTML5 לציטוטים, קוד, הדגשות, הערות ותאריכים");
    }
  };
  setGen('web_text_format', function(block) {
    const allowedTags = ['blockquote', 'mark', 'code', 'pre', 'strong', 'em', 'small', 'time'];
    const rawTag = getBlockProp(block, 'TAG', 'blockquote');
    const tag = allowedTags.includes(rawTag) ? rawTag : 'blockquote';
    const content = getBlockProp(block, 'CONTENT', '');
    const defaultsByTag = {
      blockquote: {
        'border-right': '4px solid var(--brand-primary, #2563eb)',
        'padding': '12px 18px',
        'margin': '8px 0',
        'background-color': 'rgba(37, 99, 235, 0.05)',
        'border-radius': '0 10px 10px 0',
        'font-size': '1.05rem',
        'color': '#334155',
        'font-style': 'italic'
      },
      code: {
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, monospace',
        'background-color': '#f1f5f9',
        'color': '#be123c',
        'padding': '3px 8px',
        'border-radius': '6px',
        'font-size': '0.9em',
        'direction': 'ltr',
        'display': 'inline-block'
      },
      pre: {
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, monospace',
        'background-color': '#0f172a',
        'color': '#e2e8f0',
        'padding': '16px',
        'border-radius': '12px',
        'overflow-x': 'auto',
        'direction': 'ltr',
        'text-align': 'left',
        'font-size': '0.88rem'
      },
      mark: {
        'background-color': '#fef08a',
        'color': '#0f172a',
        'padding': '2px 8px',
        'border-radius': '6px',
        'display': 'inline-block'
      },
      small: {
        'font-size': '0.85rem',
        'color': '#64748b',
        'display': 'inline-block'
      }
    };
    const styleStr = buildUniversalStyleString(block, defaultsByTag[tag] || { 'display': 'inline-block' });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<${tag} data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>${content}</${tag}>\n`;
  });

  // 11.4 List Container (<ul> / <ol>) & List Item (<li>)
  Blockly.Blocks['web_list_container'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📋 רשימה (List):")
          .appendField(new Blockly.FieldDropdown([
            ["<ul> רשימת תבליטים", "ul"],
            ["<ol> רשימה ממוספרת", "ol"]
          ]), "LIST_TYPE")
          .appendField("סגנון:")
          .appendField(new Blockly.FieldDropdown([
            ["ברירת מחדל", "default"],
            ["ללא תבליטים (none)", "none"],
            ["עיגול ריק (circle)", "circle"],
            ["ריבוע (square)", "square"]
          ]), "MARKER");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("פריטי רשימה (<li>):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("רשימת HTML5 תקנית (<ul> או <ol>). הכנס לתוכה בלוקי 'פריט רשימה (<li>)'");
    }
  };
  setGen('web_list_container', function(block) {
    const tag = getBlockProp(block, 'LIST_TYPE', 'ul') === 'ol' ? 'ol' : 'ul';
    const marker = getBlockProp(block, 'MARKER', 'default');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const defaults = {
      'margin': '0',
      'padding': marker === 'none' ? '0' : '0 22px 0 0',
      'display': 'flex',
      'flex-direction': 'column',
      'gap': '10px',
      'color': 'inherit'
    };
    if (marker !== 'default') {
      defaults['list-style-type'] = marker;
    }
    const styleStr = buildUniversalStyleString(block, defaults);
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<${tag} data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}</${tag}>\n`;
  });

  Blockly.Blocks['web_list_item'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("• פריט רשימה (<li>):")
          .appendField(new Blockly.FieldTextInput("פריט ברשימה"), "TEXT");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("תוכן פנימי נוסף (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("תגית <li> בתוך רשימה. ניתן להכניס טקסט פשוט או קישורים/בלוקים פנימיים");
    }
  };
  setGen('web_list_item', function(block) {
    const text = getBlockProp(block, 'TEXT', '');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'line-height': '1.6',
      'color': 'inherit'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<li data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>${text}${children ? `\n${children}` : ''}</li>\n`;
  });

  // 11.5 Modular HTML5 Table (<table>, <thead>/<tbody>/<tfoot>, <tr>, <th>/<td>)
  Blockly.Blocks['web_table'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📊 טבלת HTML5 (<table>)");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("חלקי טבלה (<thead> / <tbody> / <tr>):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("טבלת HTML5 מודולרית. הרכב בתוכה אזורי טבלה, שורות ותאים בעצמך");
    }
  };
  setGen('web_table', function(block) {
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'border-collapse': 'collapse',
      'background-color': '#ffffff',
      'border-radius': '12px',
      'overflow': 'hidden',
      'box-shadow': '0 4px 18px rgba(15,23,42,0.06)',
      'text-align': 'right'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<table data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}</table>\n`;
  });

  Blockly.Blocks['web_table_section'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📑 אזור טבלה:")
          .appendField(new Blockly.FieldDropdown([
            ["<thead> כותרת טבלה", "thead"],
            ["<tbody> גוף הטבלה", "tbody"],
            ["<tfoot> סיכום טבלה", "tfoot"]
          ]), "SECTION_TAG");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("שורות (<tr>):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("מגדיר אזור סמנטי בטבלה (thead, tbody, tfoot)");
    }
  };
  setGen('web_table_section', function(block) {
    const allowed = ['thead', 'tbody', 'tfoot'];
    const raw = getBlockProp(block, 'SECTION_TAG', 'tbody');
    const tag = allowed.includes(raw) ? raw : 'tbody';
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, tag === 'thead' ? {
      'background-color': '#0f172a',
      'color': '#ffffff'
    } : {});
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<${tag} data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}</${tag}>\n`;
  });

  Blockly.Blocks['web_table_row'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("➖ שורה בטבלה (<tr>)");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("תאים (<th> / <td>):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("שורת טבלה (<tr>). הכנס לתוכה תאי כותרת או תאי תוכן");
    }
  };
  setGen('web_table_row', function(block) {
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'border-bottom': '1px solid #e2e8f0'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<tr data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}</tr>\n`;
  });

  Blockly.Blocks['web_table_cell'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("▫️ תא בטבלה:")
          .appendField(new Blockly.FieldDropdown([
            ["<td> תא תוכן", "td"],
            ["<th> תא כותרת", "th"]
          ]), "CELL_TAG")
          .appendField(new Blockly.FieldTextInput("ערך"), "TEXT")
          .appendField("מיזוג עמודות:")
          .appendField(new Blockly.FieldNumber(1, 1, 12), "COLSPAN")
          .appendField("שורות:")
          .appendField(new Blockly.FieldNumber(1, 1, 12), "ROWSPAN");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("בלוקים בתא (אופציונלי):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#7c3aed');
      this.setTooltip("תא טבלה (<th> או <td>) עם תמיכה במיזוג עמודות/שורות (colspan/rowspan) ותוכן מותאם");
    }
  };
  setGen('web_table_cell', function(block) {
    const tag = getBlockProp(block, 'CELL_TAG', 'td') === 'th' ? 'th' : 'td';
    const text = getBlockProp(block, 'TEXT', '');
    const colspan = parseInt(getBlockProp(block, 'COLSPAN', 1), 10) || 1;
    const rowspan = parseInt(getBlockProp(block, 'ROWSPAN', 1), 10) || 1;
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'padding': '12px 16px',
      'font-weight': tag === 'th' ? '800' : '500',
      'vertical-align': 'middle'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    const spanAttrs = `${colspan > 1 ? `colspan="${colspan}"` : ''} ${rowspan > 1 ? `rowspan="${rowspan}"` : ''}`.trim();
    return `<${tag} data-block-id="${block.id}" ${spanAttrs} style="${styleStr}" ${extraAttrs}>${text}${children ? `\n${children}` : ''}</${tag}>\n`;
  });

  // 11.6 Media, Vector & Embeds (<figure>, <video>, <iframe>, <svg>)
  Blockly.Blocks['web_figure'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🖼️ מסגרת מדיה (<figure>) כיתוב:")
          .appendField(new Blockly.FieldTextInput("תיאור התמונה או הגרף"), "CAPTION");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("תוכן המדיה:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#db2777');
      this.setTooltip("תגית <figure> עם <figcaption> להצגת תמונות, סרטונים או דיאגרמות עם כיתוב תקני");
    }
  };
  setGen('web_figure', function(block) {
    const caption = getBlockProp(block, 'CAPTION', '');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'margin': '0',
      'display': 'flex',
      'flex-direction': 'column',
      'gap': '8px'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<figure data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}${caption ? `  <figcaption style="font-size: 0.85rem; color: #64748b; text-align: center;">${caption}</figcaption>\n` : ''}</figure>\n`;
  });

  Blockly.Blocks['web_html5_video'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎬 נגן וידאו HTML5 (<video>) קישור:")
          .appendField(new Blockly.FieldTextInput("https://www.w3schools.com/html/mov_bbb.mp4"), "SRC");
      this.appendDummyInput()
          .appendField("תמונת קדימון (Poster):")
          .appendField(new Blockly.FieldTextInput(""), "POSTER")
          .appendField("פקדים:")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "CONTROLS")
          .appendField("הפעלה אוטומטית:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "AUTOPLAY")
          .appendField("השתק:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "MUTED")
          .appendField("לופ:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "LOOP");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#db2777');
      this.setTooltip("נגן <video> מקורי של HTML5 עם שליטה מלאה בפקדים, לופ, השתק ותמונת פתיחה");
    }
  };
  setGen('web_html5_video', function(block) {
    const src = getBlockProp(block, 'SRC', '');
    const poster = getBlockProp(block, 'POSTER', '').trim();
    const controls = getBlockProp(block, 'CONTROLS', 'TRUE') === 'TRUE' || getBlockProp(block, 'CONTROLS', true) === true;
    const autoplay = getBlockProp(block, 'AUTOPLAY', 'FALSE') === 'TRUE' || getBlockProp(block, 'AUTOPLAY', false) === true;
    const muted = getBlockProp(block, 'MUTED', 'FALSE') === 'TRUE' || getBlockProp(block, 'MUTED', false) === true;
    const loop = getBlockProp(block, 'LOOP', 'FALSE') === 'TRUE' || getBlockProp(block, 'LOOP', false) === true;
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'max-width': '100%',
      'border-radius': '14px',
      'display': 'block',
      'background-color': '#0f172a'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    const attrs = [
      controls ? 'controls' : '',
      autoplay ? 'autoplay playsinline' : '',
      muted ? 'muted' : '',
      loop ? 'loop' : '',
      poster ? `poster="${poster.replace(/"/g, '&quot;')}"` : ''
    ].filter(Boolean).join(' ');
    return `<video data-block-id="${block.id}" src="${src.replace(/"/g, '&quot;')}" ${attrs} style="${styleStr}" ${extraAttrs}></video>\n`;
  });

  Blockly.Blocks['web_iframe_embed'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌐 הטמעה חיצונית (<iframe>) כתובת:")
          .appendField(new Blockly.FieldTextInput("https://www.openstreetmap.org/export/embed.html"), "SRC");
      this.appendDummyInput()
          .appendField("תיאור (title):")
          .appendField(new Blockly.FieldTextInput("תוכן מוטמע"), "TITLE")
          .appendField("גובה:")
          .appendField(new Blockly.FieldTextInput("360px"), "HEIGHT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#db2777');
      this.setTooltip("תגית <iframe> להטמעת מפות, טפסי Google, סרטונים, לוחות שנה וכלים חיצוניים");
    }
  };
  setGen('web_iframe_embed', function(block) {
    const src = getBlockProp(block, 'SRC', '');
    const title = getBlockProp(block, 'TITLE', 'Embedded content');
    const height = normalizeCssUnit(getBlockProp(block, 'HEIGHT', '360px'));
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'height': height,
      'border': 'none',
      'border-radius': '14px',
      'display': 'block'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<iframe data-block-id="${block.id}" src="${src.replace(/"/g, '&quot;')}" title="${title.replace(/"/g, '&quot;')}" loading="lazy" allowfullscreen style="${styleStr}" ${extraAttrs}></iframe>\n`;
  });

  Blockly.Blocks['web_svg_icon'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("✨ אייקון וקטורי (SVG):")
          .appendField(new Blockly.FieldDropdown([
            ["⭐ כוכב", "star"],
            ["✅ הצלחה / וי", "check"],
            ["⚡ ברק / מהירות", "bolt"],
            ["🚀 רקטה / השקה", "rocket"],
            ["🛒 עגלת קניות", "cart"],
            ["🛡️ אבטחה", "shield"],
            ["❤️ לב", "heart"],
            ["💎 פרימיום", "gem"],
            ["🎯 מטרה", "target"],
            ["✏️ קוד <svg> מותאם", "custom"]
          ]), "ICON")
          .appendField("גודל:")
          .appendField(new Blockly.FieldTextInput("32px"), "SIZE")
          .appendField("צבע:")
          .appendField(new Blockly.FieldTextInput("#2563eb"), "COLOR");
      this.appendDummyInput()
          .appendField("קוד SVG מותאם (כשנבחר 'מותאם'):")
          .appendField(new Blockly.FieldTextInput('<circle cx="12" cy="12" r="9" />'), "CUSTOM_SVG");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#db2777');
      this.setTooltip("אייקון SVG וקטורי חד בכל רזולוציה עם שליטה בגודל ובצבע");
    }
  };
  setGen('web_svg_icon', function(block) {
    const icon = getBlockProp(block, 'ICON', 'star');
    const size = normalizeCssUnit(getBlockProp(block, 'SIZE', '32px'));
    const color = getBlockProp(block, 'COLOR', '#2563eb');
    const customSvg = getBlockProp(block, 'CUSTOM_SVG', '');
    const iconPaths = {
      star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />',
      check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />',
      bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />',
      rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
      cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      gem: '<polygon points="6 3 18 3 22 9 12 22 2 9"/><polyline points="2 9 22 9"/><polyline points="12 22 8 9 12 3 16 9 12 22"/>',
      target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      custom: customSvg || '<circle cx="12" cy="12" r="9" />'
    };
    const inner = iconPaths[icon] || iconPaths.star;
    const styleStr = buildUniversalStyleString(block, {
      'width': size,
      'height': size,
      'color': color,
      'display': 'inline-block',
      'flex-shrink': '0'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<svg data-block-id="${block.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${styleStr}" ${extraAttrs}>${inner}</svg>\n`;
  });

  // 11.7 Interactive HTML5 Elements (<details>/<summary>, <dialog>, <progress>/<meter>)
  Blockly.Blocks['web_details_accordion'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔽 אקורדיון נפתח (<details>) כותרת:")
          .appendField(new Blockly.FieldTextInput("לחץ כאן כדי לפתוח פרטים נוספים"), "SUMMARY")
          .appendField("פתוח כברירת מחדל:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "OPEN_DEFAULT");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("תוכן פנימי כשהאקורדיון פתוח:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ea580c');
      this.setTooltip("תגית <details> + <summary> של HTML5 ליצירת שאלות נפוצות (FAQ) ותפריטים מתקפלים ללא קוד JS");
    }
  };
  setGen('web_details_accordion', function(block) {
    const summary = getBlockProp(block, 'SUMMARY', 'פרטים נוספים');
    const isOpen = getBlockProp(block, 'OPEN_DEFAULT', 'FALSE') === 'TRUE' || getBlockProp(block, 'OPEN_DEFAULT', false) === true;
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'background-color': '#ffffff',
      'border': '1px solid #e2e8f0',
      'border-radius': '14px',
      'padding': '14px 18px',
      'width': '100%',
      'box-sizing': 'border-box'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<details data-block-id="${block.id}" ${isOpen ? 'open' : ''} style="${styleStr}" ${extraAttrs}>\n  <summary style="font-weight: 800; cursor: pointer; list-style-position: inside; color: inherit;">${summary}</summary>\n  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">\n${children}  </div>\n</details>\n`;
  });

  Blockly.Blocks['web_dialog_modal'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🪟 חלון קופץ (<dialog>) מזהה ID:")
          .appendField(new Blockly.FieldTextInput("myModal"), "ELEMENT_ID")
          .appendField("פתוח בתצוגה:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "OPEN_DEFAULT");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("תוכן החלון הקופץ:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ea580c');
      this.setTooltip("תגית <dialog> מקורית של HTML5 לחלונות קופצים (Modals). פותחים/סוגרים בעזרת פעולת 'פתח/סגור חלון קופץ'");
    }
  };
  setGen('web_dialog_modal', function(block) {
    const elId = getBlockProp(block, 'ELEMENT_ID', 'myModal').trim() || 'myModal';
    const isOpen = getBlockProp(block, 'OPEN_DEFAULT', 'FALSE') === 'TRUE' || getBlockProp(block, 'OPEN_DEFAULT', false) === true;
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'border': 'none',
      'border-radius': '20px',
      'padding': '28px',
      'max-width': '480px',
      'width': '90%',
      'background-color': '#ffffff',
      'box-shadow': '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
      'margin': 'auto'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<dialog id="${elId.replace(/"/g, '&quot;')}" data-block-id="${block.id}" ${isOpen ? 'open' : ''} style="${styleStr}" ${extraAttrs}>\n${children}</dialog>\n`;
  });

  Blockly.Blocks['web_progress_meter'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📶 מד התקדמות:")
          .appendField(new Blockly.FieldDropdown([
            ["<progress> פס התקדמות", "progress"],
            ["<meter> מד ערך / ציון", "meter"]
          ]), "TAG")
          .appendField("ערך:")
          .appendField(new Blockly.FieldNumber(75, 0, 10000), "VALUE")
          .appendField("מתוך:")
          .appendField(new Blockly.FieldNumber(100, 1, 10000), "MAX");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#ea580c');
      this.setTooltip("תגית <progress> או <meter> של HTML5 להצגת מיומנויות, מלאי, או התקדמות משימה");
    }
  };
  setGen('web_progress_meter', function(block) {
    const tag = getBlockProp(block, 'TAG', 'progress') === 'meter' ? 'meter' : 'progress';
    const val = getBlockProp(block, 'VALUE', 75);
    const max = getBlockProp(block, 'MAX', 100);
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'height': '14px',
      'accent-color': 'var(--brand-primary, #2563eb)',
      'border-radius': '999px'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<${tag} data-block-id="${block.id}" value="${val}" max="${max}" style="${styleStr}" ${extraAttrs}>${val}/${max}</${tag}>\n`;
  });

  // 11.8 HTML5 Form Controls (<fieldset>, <label>, <select>, <option>)
  Blockly.Blocks['web_fieldset'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🗂️ קבוצת שדות (<fieldset>) כותרת:")
          .appendField(new Blockly.FieldTextInput("פרטי הזמנה"), "LEGEND");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("שדות הקבוצה:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תגית <fieldset> + <legend> לארגון קבוצות שדות בתוך טפסים");
    }
  };
  setGen('web_fieldset', function(block) {
    const legend = getBlockProp(block, 'LEGEND', '');
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'border': '1px solid #cbd5e1',
      'border-radius': '14px',
      'padding': '16px 20px',
      'display': 'flex',
      'flex-direction': 'column',
      'gap': '12px',
      'margin': '0'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<fieldset data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${legend ? `  <legend style="font-weight: 800; padding: 0 8px; color: inherit;">${legend}</legend>\n` : ''}${children}</fieldset>\n`;
  });

  Blockly.Blocks['web_label'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🏷️ תווית שדה (<label>):")
          .appendField(new Blockly.FieldTextInput("שם מלא:"), "TEXT")
          .appendField("למזהה (for):")
          .appendField(new Blockly.FieldTextInput(""), "FOR_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תגית <label> נגישה המקושרת לשדה קלט לפי מזהה (ID)");
    }
  };
  setGen('web_label', function(block) {
    const text = getBlockProp(block, 'TEXT', 'תווית');
    const forId = getBlockProp(block, 'FOR_ID', '').trim();
    const styleStr = buildUniversalStyleString(block, {
      'display': 'block',
      'font-weight': '700',
      'font-size': '0.92rem',
      'color': 'inherit',
      'margin-bottom': '4px'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<label data-block-id="${block.id}" ${forId ? `for="${forId.replace(/"/g, '&quot;')}"` : ''} style="${styleStr}" ${extraAttrs}>${text}</label>\n`;
  });

  Blockly.Blocks['web_select_container'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔽 תיבת בחירה (<select>) מזהה:")
          .appendField(new Blockly.FieldTextInput("select1"), "ELEMENT_ID")
          .appendField("שם:")
          .appendField(new Blockly.FieldTextInput("choice"), "NAME")
          .appendField("חובה:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "REQUIRED");
      this.appendStatementInput('CHILDREN')
          .setCheck(null)
          .appendField("אפשרויות (<option>):");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תיבת בחירה נפתחת (<select>). הכנס לתוכה בלוקי 'אפשרות (<option>)'");
    }
  };
  setGen('web_select_container', function(block) {
    const elId = getBlockProp(block, 'ELEMENT_ID', 'select1').trim();
    const name = getBlockProp(block, 'NAME', '').trim();
    const req = getBlockProp(block, 'REQUIRED', 'FALSE') === 'TRUE' || getBlockProp(block, 'REQUIRED', false) === true;
    const children = javascriptGenerator.statementToCode(block, 'CHILDREN') || '';
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'padding': '11px 14px',
      'border-radius': '10px',
      'border': '1px solid #cbd5e1',
      'background-color': '#ffffff',
      'font-size': '0.95rem',
      'font-family': 'inherit',
      'box-sizing': 'border-box'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<select id="${elId.replace(/"/g, '&quot;')}" ${name ? `name="${name.replace(/"/g, '&quot;')}"` : ''} ${req ? 'required' : ''} data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}>\n${children}</select>\n`;
  });

  Blockly.Blocks['web_select_option'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("▫️ אפשרות (<option>) טקסט:")
          .appendField(new Blockly.FieldTextInput("אפשרות 1"), "LABEL")
          .appendField("ערך:")
          .appendField(new Blockly.FieldTextInput("opt1"), "VALUE")
          .appendField("נבחר:")
          .appendField(new Blockly.FieldCheckbox("FALSE"), "SELECTED");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#059669');
      this.setTooltip("תגית <option> בתוך תיבת בחירה (<select>)");
    }
  };
  setGen('web_select_option', function(block) {
    const label = getBlockProp(block, 'LABEL', 'אפשרות');
    const value = getBlockProp(block, 'VALUE', '');
    const selected = getBlockProp(block, 'SELECTED', 'FALSE') === 'TRUE' || getBlockProp(block, 'SELECTED', false) === true;
    return `<option data-block-id="${block.id}" value="${value.replace(/"/g, '&quot;')}" ${selected ? 'selected' : ''}>${label}</option>\n`;
  });

  // 11.9 Enhanced DOM Interactivity Actions
  Blockly.Blocks['action_toggle_element'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("👁️ הצג / הסתר אלמנט לפי מזהה (ID):")
          .appendField(new Blockly.FieldTextInput("myBox"), "TARGET_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("מציג או מסתיר כל אלמנט בדף שיש לו מזהה ID תואם");
    }
  };
  setGen('action_toggle_element', function(block) {
    const id = getBlockProp(block, 'TARGET_ID', 'myBox').trim();
    return `(() => { const el = document.getElementById(${JSON.stringify(id)}); if (el) el.style.display = (getComputedStyle(el).display === 'none') ? '' : 'none'; })();\n`;
  });

  Blockly.Blocks['action_toggle_class'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🏷️ החלף CSS Class לאלמנט ID:")
          .appendField(new Blockly.FieldTextInput("myBox"), "TARGET_ID")
          .appendField("קלאס:")
          .appendField(new Blockly.FieldTextInput("active"), "CLASS_NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("מוסיף או מסיר מחלקת CSS (classList.toggle) מאלמנט — מצוין לתפריטים, כפתורים נבחרים וטאבים");
    }
  };
  setGen('action_toggle_class', function(block) {
    const id = getBlockProp(block, 'TARGET_ID', 'myBox').trim();
    const cls = getBlockProp(block, 'CLASS_NAME', 'active').trim();
    return `(() => { const el = document.getElementById(${JSON.stringify(id)}); if (el && ${JSON.stringify(cls)}) el.classList.toggle(${JSON.stringify(cls)}); })();\n`;
  });

  Blockly.Blocks['action_dialog_control'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🪟 חלון קופץ (<dialog>) ID:")
          .appendField(new Blockly.FieldTextInput("myModal"), "TARGET_ID")
          .appendField("פעולה:")
          .appendField(new Blockly.FieldDropdown([
            ["פתח כמודאל (showModal)", "showModal"],
            ["סגור חלון (close)", "close"]
          ]), "MODE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("פותח או סוגר בלוק <dialog> מקורי של HTML5");
    }
  };
  setGen('action_dialog_control', function(block) {
    const id = getBlockProp(block, 'TARGET_ID', 'myModal').trim();
    const mode = getBlockProp(block, 'MODE', 'showModal') === 'close' ? 'close' : 'showModal';
    return `(() => { const dlg = document.getElementById(${JSON.stringify(id)}); if (dlg && typeof dlg[${JSON.stringify(mode)}] === 'function') dlg[${JSON.stringify(mode)}](); })();\n`;
  });

  Blockly.Blocks['action_set_style'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🎨 שנה סגנון CSS לאלמנט ID:")
          .appendField(new Blockly.FieldTextInput("myBox"), "TARGET_ID")
          .appendField("מאפיין:")
          .appendField(new Blockly.FieldTextInput("background-color"), "PROP")
          .appendField("ערך:")
          .appendField(new Blockly.FieldTextInput("#2563eb"), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#d97706');
      this.setTooltip("משנה כל תכונת CSS של אלמנט בזמן ריצה (למשל background-color, transform, opacity, display)");
    }
  };
  setGen('action_set_style', function(block) {
    const id = getBlockProp(block, 'TARGET_ID', 'myBox').trim();
    const prop = getBlockProp(block, 'PROP', 'background-color').trim();
    const val = getBlockProp(block, 'VALUE', '');
    return `(() => { const el = document.getElementById(${JSON.stringify(id)}); if (el && ${JSON.stringify(prop)}) el.style.setProperty(${JSON.stringify(prop)}, ${JSON.stringify(val)}); })();\n`;
  });

  // 11.10 Database Connection, Live CRUD, Seed & User Auth Blocks (SmartDB + Firebase REST / External REST)
  Blockly.Blocks['db_connect_config'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🗄️ התחברות לדאטה-בייס | מנוע:")
          .appendField(new Blockly.FieldDropdown([
            ["💾 SmartDB מובנה (LocalStorage)", "local"],
            ["🔥 Firebase Realtime DB (REST URL)", "firebase"],
            ["🌐 שרת REST API חיצוני", "rest"]
          ]), "DB_MODE")
          .appendField("טבלה ראשית:")
          .appendField(new Blockly.FieldTextInput("projects"), "COLLECTION");
      this.appendDummyInput()
          .appendField("כתובת מסד נתונים (לענן / REST):")
          .appendField(new Blockly.FieldTextInput("https://your-project-default-rtdb.firebaseio.com"), "DB_URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f766e');
      this.setTooltip("מחבר את הדף למסד נתונים (מקומי SmartDB או ענן Firebase Realtime Database / REST API)");
    }
  };
  setGen('db_connect_config', function(block) {
    const mode = getBlockProp(block, 'DB_MODE', 'local');
    const url = getBlockProp(block, 'DB_URL', '');
    const collection = getBlockProp(block, 'COLLECTION', 'projects').trim() || 'projects';
    return `<script data-block-id="${block.id}">window.smartDB && window.smartDB.configure({ mode: ${JSON.stringify(mode)}, url: ${JSON.stringify(url)}, collection: ${JSON.stringify(collection)} });</script>\n`;
  });

  Blockly.Blocks['db_seed_data'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌱 אתחל נתוני פתיחה בדאטה-בייס | טבלה:")
          .appendField(new Blockly.FieldTextInput("projects"), "COLLECTION");
      this.appendDummyInput()
          .appendField("רשומות JSON (יטען אם הטבלה ריקה):")
          .appendField(new Blockly.FieldTextInput('[{"title":"פרויקט דוגמה","client":"SmartClient","budget":"₪4,500","status":"פעיל"}]'), "JSON_DATA");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f766e');
      this.setTooltip("ממלא את טבלת הדאטה-בייס בנתוני הדגמה בפעם הראשונה שהאתר נפתח");
    }
  };
  setGen('db_seed_data', function(block) {
    const collection = getBlockProp(block, 'COLLECTION', 'projects').trim() || 'projects';
    const rawJson = getBlockProp(block, 'JSON_DATA', '[]');
    return `<script data-block-id="${block.id}">window.smartDB && window.smartDB.seed(${JSON.stringify(collection)}, ${JSON.stringify(rawJson)});</script>\n`;
  });

  Blockly.Blocks['db_save_record'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("💾 שמור רשומה לדאטה-בייס | טבלה:")
          .appendField(new Blockly.FieldTextInput("projects"), "COLLECTION");
      this.appendDummyInput()
          .appendField("מזהי שדות (IDs מופרדים בפסיק):")
          .appendField(new Blockly.FieldTextInput("projectName,clientEmail,planSelect"), "FIELD_IDS");
      this.appendDummyInput()
          .appendField("תיבת הודעה ID:")
          .appendField(new Blockly.FieldTextInput("dbStatusOut"), "STATUS_ID")
          .appendField("רענן רשימה ID:")
          .appendField(new Blockly.FieldTextInput("dbRecordsFeed"), "TARGET_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f766e');
      this.setTooltip("קורא ערכים משדות הטופס ושומר רשומה חדשה ישירות לדאטה-בייס (להנחה בתוך כפתור שליחה)");
    }
  };
  setGen('db_save_record', function(block) {
    const col = encodeURIComponent(getBlockProp(block, 'COLLECTION', 'projects').trim() || 'projects');
    const fields = encodeURIComponent(getBlockProp(block, 'FIELD_IDS', ''));
    const statusId = encodeURIComponent(getBlockProp(block, 'STATUS_ID', '').trim());
    const targetId = encodeURIComponent(getBlockProp(block, 'TARGET_ID', '').trim());
    return `window.smartDB && window.smartDB.saveFromInputs(decodeURIComponent('${col}'), decodeURIComponent('${fields}'), decodeURIComponent('${statusId}'), decodeURIComponent('${targetId}')); `;
  });

  Blockly.Blocks['db_render_list'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📊 הצג נתונים חיים מהדאטה-בייס | טבלה:")
          .appendField(new Blockly.FieldTextInput("projects"), "COLLECTION")
          .appendField("מזהה מיכל:")
          .appendField(new Blockly.FieldTextInput("dbRecordsFeed"), "TARGET_ID");
      this.appendDummyInput()
          .appendField("תצוגה:")
          .appendField(new Blockly.FieldDropdown([
            ["🃏 כרטיסיות מעוצבות", "cards"],
            ["📋 טבלה מסודרת", "table"]
          ]), "VIEW_MODE")
          .appendField("כפתור מחיקה:")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "ALLOW_DELETE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f766e');
      this.setTooltip("מרנדר אוטומטית את כל הרשומות מהדאטה-בייס ומתעדכן בזמן אמת אחרי כל שמירה או מחיקה");
    }
  };
  setGen('db_render_list', function(block) {
    const col = getBlockProp(block, 'COLLECTION', 'projects').trim() || 'projects';
    const targetId = getBlockProp(block, 'TARGET_ID', `dbView_${block.id.slice(0, 5)}`).trim();
    const viewMode = getBlockProp(block, 'VIEW_MODE', 'cards');
    const allowDelete = getBlockProp(block, 'ALLOW_DELETE', 'TRUE') === 'TRUE' || getBlockProp(block, 'ALLOW_DELETE', true) === true;
    const styleStr = buildUniversalStyleString(block, {
      'width': '100%',
      'min-height': '80px',
      'display': 'flex',
      'flex-direction': 'column',
      'gap': '12px'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<div id="${targetId.replace(/"/g, '&quot;')}" data-block-id="${block.id}" style="${styleStr}" ${extraAttrs}></div>\n<script>window.smartDB && window.smartDB.mountView(${JSON.stringify(col)}, ${JSON.stringify(targetId)}, { viewMode: ${JSON.stringify(viewMode)}, allowDelete: ${allowDelete} });</script>\n`;
  });

  Blockly.Blocks['db_auth_action'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔐 אימות משתמשים ב-DB | פעולה:")
          .appendField(new Blockly.FieldDropdown([
            ["🔑 התחברות משתמש (Login)", "login"],
            ["📝 הרשמה חדשה (Register)", "register"],
            ["🚪 התנתקות (Logout)", "logout"]
          ]), "MODE");
      this.appendDummyInput()
          .appendField("שדה אימייל ID:")
          .appendField(new Blockly.FieldTextInput("authEmail"), "EMAIL_ID")
          .appendField("סיסמה ID:")
          .appendField(new Blockly.FieldTextInput("authPassword"), "PASS_ID")
          .appendField("שם מלא ID:")
          .appendField(new Blockly.FieldTextInput("authName"), "NAME_ID");
      this.appendDummyInput()
          .appendField("תיבת סטטוס ID:")
          .appendField(new Blockly.FieldTextInput("authStatusBox"), "STATUS_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f766e');
      this.setTooltip("מאמת, רושם או מנתק משתמשים מול טבלת users בדאטה-בייס ושומר סשן פעיל");
    }
  };
  setGen('db_auth_action', function(block) {
    const mode = encodeURIComponent(getBlockProp(block, 'MODE', 'login'));
    const emailId = encodeURIComponent(getBlockProp(block, 'EMAIL_ID', 'authEmail').trim());
    const passId = encodeURIComponent(getBlockProp(block, 'PASS_ID', 'authPassword').trim());
    const nameId = encodeURIComponent(getBlockProp(block, 'NAME_ID', 'authName').trim());
    const statusId = encodeURIComponent(getBlockProp(block, 'STATUS_ID', 'authStatusBox').trim());
    return `window.smartDB && window.smartDB.authAction({ mode: decodeURIComponent('${mode}'), emailId: decodeURIComponent('${emailId}'), passId: decodeURIComponent('${passId}'), nameId: decodeURIComponent('${nameId}'), statusId: decodeURIComponent('${statusId}') }); `;
  });

  Blockly.Blocks['db_session_badge'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("👤 תגית סטטוס משתמש מחובר | קישור לפורטל:")
          .appendField(new Blockly.FieldTextInput("portal.html"), "PORTAL_URL");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#0f766e');
      this.setTooltip("מציג בסרגל או בדף האם המשתמש מחובר (עם שמו וכפתור התנתקות) או אורח");
    }
  };
  setGen('db_session_badge', function(block) {
    const portalUrl = getBlockProp(block, 'PORTAL_URL', 'portal.html').trim() || 'portal.html';
    const wid = `wbSess_${block.id.replace(/[^a-zA-Z0-9_]/g, '')}`;
    const styleStr = buildUniversalStyleString(block, {
      'display': 'inline-flex',
      'align-items': 'center',
      'gap': '8px',
      'padding': '6px 12px',
      'border-radius': '999px',
      'background-color': 'rgba(255,255,255,0.12)',
      'color': '#f8fafc',
      'font-size': '0.82rem',
      'font-weight': '700'
    });
    const extraAttrs = buildBlockExtraAttributes(block);
    return `<div id="${wid}" data-block-id="${block.id}" data-wb-session-widget="true" style="${styleStr}" ${extraAttrs}></div>\n<script>window.smartDB && window.smartDB.mountSessionWidget(${JSON.stringify(wid)}, ${JSON.stringify(portalUrl)});</script>\n`;
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
      name: "🧱 מבנה ופריסה",
      colour: "#0f172a",
      contents: [
        { kind: "block", type: "web_page_container" },
        { kind: "block", type: "web_semantic_container" },
        { kind: "block", type: "web_grid_container" },
        { kind: "block", type: "web_row_flex" },
        { kind: "block", type: "web_card" },
        { kind: "block", type: "web_navbar_custom" },
        { kind: "block", type: "web_divider" },
        { kind: "block", type: "web_spacer" }
      ]
    },
    {
      kind: "category",
      name: "📝 טקסטים וכותרות",
      colour: "#2563eb",
      contents: [
        { kind: "block", type: "web_heading" },
        { kind: "block", type: "web_paragraph" },
        { kind: "block", type: "web_badge" },
        { kind: "block", type: "web_text_format" },
        { kind: "block", type: "web_text_output_label" },
        { kind: "block", type: "web_output_box" }
      ]
    },
    {
      kind: "category",
      name: "📊 רשימות וטבלאות",
      colour: "#7c3aed",
      contents: [
        { kind: "block", type: "web_list_container" },
        { kind: "block", type: "web_list_item" },
        { kind: "block", type: "web_table" },
        { kind: "block", type: "web_table_section" },
        { kind: "block", type: "web_table_row" },
        { kind: "block", type: "web_table_cell" }
      ]
    },
    {
      kind: "category",
      name: "🎨 מדיה ווקטור",
      colour: "#db2777",
      contents: [
        { kind: "block", type: "web_image" },
        { kind: "block", type: "web_figure" },
        { kind: "block", type: "web_svg_icon" },
        { kind: "block", type: "web_html5_video" },
        { kind: "block", type: "web_video_embed" },
        { kind: "block", type: "web_audio_player" },
        { kind: "block", type: "web_iframe_embed" }
      ]
    },
    {
      kind: "category",
      name: "🔘 קישורים ורכיבים",
      colour: "#ea580c",
      contents: [
        { kind: "block", type: "web_link" },
        { kind: "block", type: "web_button_with_actions" },
        { kind: "block", type: "web_button" },
        { kind: "block", type: "web_button_link" },
        { kind: "block", type: "web_details_accordion" },
        { kind: "block", type: "web_dialog_modal" },
        { kind: "block", type: "web_progress_meter" }
      ]
    },
    {
      kind: "category",
      name: "📋 טפסים וקלט HTML5",
      colour: "#059669",
      contents: [
        { kind: "block", type: "web_form" },
        { kind: "block", type: "web_fieldset" },
        { kind: "block", type: "web_label" },
        { kind: "block", type: "web_input_field" },
        { kind: "block", type: "web_textarea" },
        { kind: "block", type: "web_select_container" },
        { kind: "block", type: "web_select_option" },
        { kind: "block", type: "web_checkbox" },
        { kind: "block", type: "web_slider_input" },
        { kind: "block", type: "web_color_picker_input" },
        { kind: "block", type: "web_submit_button" }
      ]
    },
    {
      kind: "category",
      name: "🗄️ דאטה-בייס ואימות",
      colour: "#0f766e",
      contents: [
        { kind: "block", type: "db_connect_config" },
        { kind: "block", type: "db_seed_data" },
        { kind: "block", type: "db_save_record" },
        { kind: "block", type: "db_render_list" },
        { kind: "block", type: "db_auth_action" },
        { kind: "block", type: "db_session_badge" }
      ]
    },
    {
      kind: "category",
      name: "⚡ אירועים ו-JS",
      colour: "#d97706",
      contents: [
        { kind: "block", type: "action_display_in_element" },
        { kind: "block", type: "action_read_input_to_output" },
        { kind: "block", type: "action_toggle_element" },
        { kind: "block", type: "action_toggle_class" },
        { kind: "block", type: "action_dialog_control" },
        { kind: "block", type: "action_set_style" },
        { kind: "block", type: "action_navigate_page" },
        { kind: "block", type: "action_open_url" },
        { kind: "block", type: "action_alert" },
        { kind: "block", type: "action_change_bg" },
        { kind: "block", type: "action_form_alert_data" },
        { kind: "block", type: "action_send_form_to_whatsapp" },
        { kind: "block", type: "action_reset_form" },
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
      name: "💻 HTML ו-CSS חופשי",
      colour: "#475569",
      contents: [
        { kind: "block", type: "web_custom_html" },
        { kind: "block", type: "web_custom_css" }
      ]
    }
  ]
};

// Human-friendly Hebrew & HTML tag search index for the toolbox filter bar
export const WEB_BLOCK_SEARCH_LABELS = {
  web_page_container: "דף אינטרנט בסיס מסגרת עמוד page html",
  web_semantic_container: "אזור סמנטי מקטע section header nav main article aside footer div",
  web_grid_container: "רשת גריד עמודות grid columns layout",
  web_row_flex: "שורה גמישה flex row עמודות הצמדה",
  web_card: "כרטיסייה קופסה מיכל card box container",
  web_navbar_custom: "סרגל ניווט תפריט עליון navbar header nav",
  web_divider: "קו מפריד hr divider line",
  web_spacer: "מרווח ריווח גובה spacer gap",
  web_heading: "כותרת h1 h2 h3 h4 h5 h6 heading title",
  web_paragraph: "פסקה טקסט paragraph p text",
  web_badge: "תגית תג תווית מדליה badge pill span",
  web_text_format: "ציטוט קוד הדגשה blockquote mark code pre strong em small time",
  web_text_output_label: "תווית פלט טקסט דינמי span output",
  web_output_box: "תיבת פלט תצוגה תוצאה output box",
  web_list_container: "רשימה תבליטים ממוספרת ul ol list",
  web_list_item: "פריט רשימה שורה li item",
  web_table: "טבלה נתונים table",
  web_table_section: "אזור טבלה כותרת גוף סיכום thead tbody tfoot",
  web_table_row: "שורה בטבלה tr row",
  web_table_cell: "תא טבלה עמודה מיזוג th td cell colspan rowspan",
  web_image: "תמונה מדיה img image src alt",
  web_figure: "מסגרת תמונה כיתוב figure figcaption",
  web_svg_icon: "אייקון וקטור סמל כוכב רקטה svg icon vector",
  web_html5_video: "וידאו סרטון נגן video mp4 autoplay loop",
  web_video_embed: "יוטיוב סרטון הטמעה youtube video",
  web_audio_player: "אודיו שמע מוזיקה פודקאסט audio mp3",
  web_iframe_embed: "הטמעה מפה אייפריים iframe embed map",
  web_link: "קישור לינק עוגן a href link",
  web_button_with_actions: "כפתור אינטראקטיבי לחצן פעולות button click",
  web_button: "כפתור פשוט לחצן button",
  web_button_link: "כפתור קישור button link",
  web_details_accordion: "אקורדיון נפתח שאלות נפוצות details summary faq",
  web_dialog_modal: "חלון קופץ מודאל פופאפ dialog modal popup",
  web_progress_meter: "מד התקדמות אחוזים פס טעינה progress meter",
  web_form: "טופס יצירת קשר הרשמה form",
  web_fieldset: "קבוצת שדות מסגרת טופס fieldset legend",
  web_label: "תווית שדה label for",
  web_input_field: "שדה קלט אינפוט טקסט אימייל טלפון סיסמה תאריך מספר קובץ input",
  web_textarea: "תיבת טקסט מרובת שורות הודעה textarea",
  web_select_container: "תיבת בחירה רשימה נפתחת select dropdown",
  web_select_option: "אפשרות בחירה option select",
  web_checkbox: "תיבת סימון צק בוקס אישור checkbox",
  web_slider_input: "סליידר מחוון טווח range slider",
  web_color_picker_input: "בוחר צבע קלט צבע color picker",
  web_submit_button: "כפתור שליחה טופס submit",
  db_connect_config: "דאטה בייס מסד נתונים חיבור firebase rest database config",
  db_seed_data: "אתחול נתוני דוגמה טבלה seed json database",
  db_save_record: "שמור רשומה דאטה בייס טופס הוספה save database insert",
  db_render_list: "הצג רשומות טבלה כרטיסים דאטה בייס database list feed",
  db_auth_action: "התחברות הרשמה התנתקות אימות משתמשים login register logout auth",
  db_session_badge: "משתמש מחובר פרופיל תגית סשן user session badge",
  action_display_in_element: "הצג טקסט באלמנט שינוי תוכן innerText",
  action_read_input_to_output: "קרא משדה הצג בפלט input output",
  action_toggle_element: "הצג הסתר אלמנט toggle display hide show",
  action_toggle_class: "החלף קלאס עיצוב classList toggle",
  action_dialog_control: "פתח סגור חלון קופץ מודאל dialog showModal close",
  action_set_style: "שנה סגנון CSS דינמי style setProperty",
  action_navigate_page: "עבור לדף פנימי ניווט page navigate",
  action_open_url: "פתח קישור חיצוני אתר url",
  action_alert: "הודעה קופצת התראה alert",
  action_change_bg: "שנה צבע רקע דף background",
  action_form_alert_data: "אסוף נתוני טופס הודעה form alert",
  action_send_form_to_whatsapp: "שלח טופס וואטסאפ whatsapp",
  action_reset_form: "אפס נקה טופס reset",
  action_scroll_top: "גלול למעלה scroll top",
  action_play_sound: "נגן צליל אפקט sound beep",
  action_custom_js: "קוד גאווה סקריפט חופשי javascript js",
  val_get_input: "קרא ערך שדה input value",
  val_static_text: "טקסט קבוע מחרוזת string",
  val_join_text: "חבר שרשר טקסטים join concat",
  web_custom_html: "קוד HTML חופשי custom html",
  web_custom_css: "עיצוב CSS חופשי style keyframes media"
};



