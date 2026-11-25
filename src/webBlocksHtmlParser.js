// =========================================================================
// 🔄 WEBBLOCKS HTML ⇄ BLOCKLY XML PARSER & SERIALIZER
// Enables lossless round-trip (Download HTML -> Upload HTML -> Edit Blocks)
// AND intelligent parsing of any standard HTML file into WebBlocks!
// =========================================================================

const WEBBLOCKS_META_REGEX = /<!--\s*WEBBLOCKS_STATE_V1:([A-Za-z0-9+/=]+)\s*-->/;

// Safely encode UTF-8 object to Base64
export function encodeWebBlocksState(stateObj) {
  try {
    const jsonStr = JSON.stringify(stateObj);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (e) {
    console.warn('Error encoding WebBlocks state:', e);
    return '';
  }
}

// Safely decode Base64 to UTF-8 object
export function decodeWebBlocksState(base64Str) {
  try {
    const binary = atob(base64Str.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn('Error decoding WebBlocks state:', e);
    return null;
  }
}

// Extract embedded WebBlocks metadata from an HTML string if present
export function extractEmbeddedWebBlocksState(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return null;
  const match = htmlString.match(WEBBLOCKS_META_REGEX);
  if (match && match[1]) {
    return decodeWebBlocksState(match[1]);
  }
  return null;
}

// Escape special characters for XML text nodes
function escapeXml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert rgb/rgba string to hex if needed
function normalizeColorValue(val, fallback = '') {
  if (!val) return fallback;
  const trimmed = val.trim();
  if (trimmed.startsWith('#')) return trimmed;
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = Math.min(255, parseInt(rgbMatch[1], 10)).toString(16).padStart(2, '0');
    const g = Math.min(255, parseInt(rgbMatch[2], 10)).toString(16).padStart(2, '0');
    const b = Math.min(255, parseInt(rgbMatch[3], 10)).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return trimmed;
}

// Parse inline style attribute into a key-value map
function parseStyleAttribute(styleStr) {
  const map = {};
  if (!styleStr || typeof styleStr !== 'string') return map;
  const parts = styleStr.split(';');
  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx > 0) {
      const key = part.slice(0, colonIdx).trim().toLowerCase();
      const val = part.slice(colonIdx + 1).trim();
      if (key && val) {
        map[key] = val;
      }
    }
  }
  return map;
}

// Extract custom CSS properties from parsed style map so Design Studio preserves them
function extractCustomPropsFromStyleMap(styleMap, ignoredKeys = []) {
  const custom = {};
  const ignoreSet = new Set(ignoredKeys.map(k => k.toLowerCase()));

  const mapping = {
    'background-color': 'BG_COLOR',
    'color': 'TEXT_COLOR',
    'font-family': 'FONT',
    'font-size': 'FONT_SIZE',
    'font-weight': 'FONT_WEIGHT',
    'text-align': 'ALIGN',
    'text-decoration': 'TEXT_DECORATION',
    'font-style': 'FONT_STYLE',
    'line-height': 'LINE_HEIGHT',
    'letter-spacing': 'LETTER_SPACING',
    'padding': 'PADDING',
    'margin': 'MARGIN',
    'width': 'WIDTH',
    'height': 'HEIGHT',
    'min-height': 'MIN_HEIGHT',
    'max-width': 'MAX_WIDTH',
    'border-radius': 'RADIUS',
    'box-shadow': 'SHADOW',
    'opacity': 'OPACITY',
    'justify-content': 'JUSTIFY',
    'align-items': 'ALIGN_ITEMS',
    'flex-direction': 'DIRECTION',
    'flex-wrap': 'WRAP',
    'gap': 'GAP'
  };

  for (const [cssKey, propName] of Object.entries(mapping)) {
    if (!ignoreSet.has(cssKey) && styleMap[cssKey] !== undefined) {
      let val = styleMap[cssKey];
      if (cssKey === 'background-color' || cssKey === 'color') {
        val = normalizeColorValue(val, val);
      }
      custom[propName] = val;
    }
  }

  if (styleMap['background'] && styleMap['background'].includes('gradient')) {
    custom.GRADIENT = styleMap['background'];
  } else if (styleMap['background-image'] && styleMap['background-image'].includes('gradient')) {
    custom.GRADIENT = styleMap['background-image'];
  }

  return custom;
}

// Build a single <block> XML string
function createBlockXml(type, fields = {}, statements = {}, values = {}, customProps = null, xy = null) {
  const xyAttr = xy ? ` x="${xy.x}" y="${xy.y}"` : '';
  let inner = '';

  if (customProps && Object.keys(customProps).length > 0) {
    inner += `<data>${escapeXml(JSON.stringify(customProps))}</data>`;
  }

  for (const [fName, fVal] of Object.entries(fields)) {
    if (fVal !== undefined && fVal !== null) {
      inner += `<field name="${escapeXml(fName)}">${escapeXml(fVal)}</field>`;
    }
  }

  for (const [vName, vXml] of Object.entries(values)) {
    if (vXml) {
      inner += `<value name="${escapeXml(vName)}">${vXml}</value>`;
    }
  }

  for (const [sName, sXml] of Object.entries(statements)) {
    if (sXml) {
      inner += `<statement name="${escapeXml(sName)}">${sXml}</statement>`;
    }
  }

  return `<block type="${escapeXml(type)}"${xyAttr}>${inner}</block>`;
}

// Chain an array of <block> XML strings using <next>...</next>
function chainBlocksXml(blockXmlList) {
  const valid = (blockXmlList || []).filter(Boolean);
  if (valid.length === 0) return '';
  let current = valid[valid.length - 1];
  for (let i = valid.length - 2; i >= 0; i--) {
    const item = valid[i];
    current = item.replace(/<\/block>\s*$/, `<next>${current}</next></block>`);
  }
  return current;
}

// Parse onclick JavaScript string into WebBlocks action blocks
function parseOnClickToActionBlocks(onclickStr) {
  if (!onclickStr || typeof onclickStr !== 'string') return '';
  const actions = [];
  const raw = onclickStr.trim();

  // Split by semicolons that are outside parentheses/quotes (simple heuristic)
  const statements = raw
    .split(/;\s*(?=(?:[^']*'[^']*')*[^']*$)/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    let m;
    if ((m = stmt.match(/^alert\(\s*['"](.*)['"]\s*\)$/))) {
      actions.push(createBlockXml('action_alert', { MSG: m[1].replace(/\\'/g, "'") }));
    } else if ((m = stmt.match(/^smartChangeBg\(\s*['"](.*)['"]\s*\)$/))) {
      actions.push(createBlockXml('action_change_bg', { COLOR: m[1] }));
    } else if ((m = stmt.match(/^smartNavigate\(\s*['"](.*)['"]\s*\)$/))) {
      actions.push(createBlockXml('action_navigate_page', { PAGE: m[1] }));
    } else if ((m = stmt.match(/^smartOpenUrl\(\s*['"](.*)['"]\s*\)$/))) {
      actions.push(createBlockXml('action_open_url', { URL: m[1] }));
    } else if (stmt.startsWith('smartScrollTop(')) {
      actions.push(createBlockXml('action_scroll_top'));
    } else if (stmt.startsWith('smartPlaySound(')) {
      actions.push(createBlockXml('action_play_sound'));
    } else if ((m = stmt.match(/^smartResetForm\(\s*['"](.*)['"]\s*\)$/))) {
      actions.push(createBlockXml('action_reset_form', { FORM_ID: m[1] }));
    } else if ((m = stmt.match(/^smartSetText\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*\)$/))) {
      actions.push(createBlockXml(
        'action_set_element_text',
        { TARGET_ID: m[1] },
        {},
        { NEW_TEXT: createBlockXml('val_static_text', { TEXT: m[2] }) }
      ));
    } else {
      actions.push(createBlockXml('action_custom_js', { CODE: stmt.endsWith(';') ? stmt : `${stmt};` }));
    }
  }

  return chainBlocksXml(actions);
}

// Parse a single DOM element (and its children) into one or more Blockly XML blocks
function parseDomElementToBlockXml(el) {
  if (!el || el.nodeType !== 1) return null;
  const tag = el.tagName.toLowerCase();

  // Skip scripts and inspection badges injected by the preview runtime
  if (tag === 'script' || tag === 'style' || tag === 'link' || tag === 'meta' || tag === 'title') {
    return null;
  }
  if (el.classList && el.classList.contains('web-block-dim-badge')) {
    return null;
  }

  const styleAttr = el.getAttribute('style') || '';
  const styleMap = parseStyleAttribute(styleAttr);

  // 1. NAVBAR (<nav>)
  if (tag === 'nav') {
    const h2 = el.querySelector('h2, h1, h3, .brand');
    const title = h2 ? h2.textContent.trim() : 'האתר שלי 🚀';
    const hasHamburger = !!Array.from(el.querySelectorAll('button')).find(b => b.textContent.includes('☰'));
    const allLinks = Array.from(el.querySelectorAll('a'));
    const ctaLink = allLinks.find(a => (a.getAttribute('style') || '').includes('background'));
    const ctaText = ctaLink ? ctaLink.textContent.trim() : '';

    let styleType = 'classic_cta';
    if (hasHamburger) {
      styleType = 'hamburger';
    } else if (styleMap['border-radius'] === '9999px') {
      styleType = 'floating_pill';
    } else if (!ctaLink && allLinks.length > 0) {
      styleType = 'centered';
    }

    const align = (h2 && (h2.getAttribute('style') || '').includes('center')) ? 'center' : 'right';
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['display', 'justify-content', 'align-items', 'width', 'position']);

    return createBlockXml('web_navbar', {
      STYLE_TYPE: styleType,
      TITLE: title,
      ALIGN: align,
      CTA_TEXT: ctaText
    }, {}, {}, customProps);
  }

  // 2. FOOTER (<footer>)
  if (tag === 'footer') {
    const h3 = el.querySelector('h3, h2, h4, strong');
    const brand = h3 ? h3.textContent.trim() : 'העסק שלי';
    const divs = Array.from(el.querySelectorAll('div'));
    const lastDiv = divs.length > 0 ? divs[divs.length - 1] : null;
    const copyright = lastDiv ? lastDiv.textContent.trim() : 'כל הזכויות שמורות © 2026';
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['width', 'text-align']);

    return createBlockXml('web_footer', {
      BRAND: brand,
      COPYRIGHT: copyright
    }, {}, {}, customProps);
  }

  // 3. HEADINGS (<h1>..<h6>)
  if (/^h[1-6]$/.test(tag)) {
    const text = el.textContent.trim();
    const elementId = el.getAttribute('id') || 'heading_1';
    const align = styleMap['text-align'] || 'right';
    const color = normalizeColorValue(styleMap['color'], '#0f172a');
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['text-align']);
    customProps.COLOR = color;

    return createBlockXml('web_heading', {
      TEXT: text,
      TAG: tag,
      ELEMENT_ID: elementId,
      ALIGN: align
    }, {}, {}, customProps);
  }

  // 4. PARAGRAPH (<p>)
  if (tag === 'p') {
    const text = el.textContent.trim();
    const elementId = el.getAttribute('id') || 'paragraph_1';
    const size = styleMap['font-size'] || '16px';
    const color = normalizeColorValue(styleMap['color'], '#475569');
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    customProps.COLOR = color;

    return createBlockXml('web_paragraph', {
      TEXT: text,
      ELEMENT_ID: elementId,
      SIZE: ['14px', '16px', '18px'].includes(size) ? size : '16px'
    }, {}, {}, customProps);
  }

  // 5. SPAN / BADGE (<span>)
  if (tag === 'span') {
    const text = el.textContent.trim();
    const elementId = el.getAttribute('id') || 'badge_1';
    const bg = normalizeColorValue(styleMap['background-color'], '#dbeafe');
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);

    return createBlockXml('web_badge', {
      TEXT: text,
      ELEMENT_ID: elementId,
      BG_COLOR: bg
    }, {}, {}, customProps);
  }

  // 6. HORIZONTAL DIVIDER (<hr>)
  if (tag === 'hr') {
    let color = '#e2e8f0';
    if (styleMap['border-top']) {
      const m = styleMap['border-top'].match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
      if (m) color = normalizeColorValue(m[1], '#e2e8f0');
    }
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['border', 'border-top', 'width']);
    return createBlockXml('web_divider', { COLOR: color }, {}, {}, customProps);
  }

  // 7. IMAGE (<img>)
  if (tag === 'img') {
    const src = el.getAttribute('src') || '';
    const width = styleMap['width'] || '100%';
    const radius = styleMap['border-radius'] || '12px';
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);

    return createBlockXml('web_image', {
      SRC: src,
      WIDTH: ['100%', '300px', '150px'].includes(width) ? width : '100%',
      RADIUS: ['12px', '50%', '0px'].includes(radius) ? radius : '12px'
    }, {}, {}, customProps);
  }

  // 8. YOUTUBE VIDEO IFRAME (<iframe>)
  if (tag === 'iframe') {
    const src = el.getAttribute('src') || '';
    const m = src.match(/embed\/([^?&"']+)/);
    const videoId = m ? m[1] : 'dQw4w9WgXcQ';
    return createBlockXml('web_video_embed', { VIDEO_ID: videoId });
  }

  // 9. LINKS & LINK BUTTONS (<a>)
  if (tag === 'a') {
    const href = el.getAttribute('href') || '#';
    const label = el.textContent.trim();
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);

    if (href.includes('wa.me/')) {
      let phone = href.split('wa.me/')[1]?.split('?')[0] || '0501234567';
      if (phone.startsWith('972')) phone = '0' + phone.slice(3);
      return createBlockXml('web_whatsapp_button', {
        PHONE: phone,
        LABEL: label
      }, {}, {}, customProps);
    }

    if (href.startsWith('tel:')) {
      const phone = href.replace('tel:', '');
      return createBlockXml('web_call_button', {
        PHONE: phone,
        LABEL: label
      }, {}, {}, customProps);
    }

    if (href.endsWith('.html') && (styleMap['background-color'] || styleMap['padding'])) {
      const validPages = ['index.html', 'about.html', 'services.html', 'contact.html'];
      return createBlockXml('web_button_link', {
        LABEL: label,
        TARGET_PAGE: validPages.includes(href) ? href : 'index.html'
      }, {}, {}, customProps);
    }

    return createBlockXml('web_link', {
      TEXT: label,
      URL: href
    }, {}, {}, customProps);
  }

  // 10. BUTTON (<button>)
  if (tag === 'button') {
    const label = el.textContent.trim() || 'כפתור';
    const typeAttr = (el.getAttribute('type') || 'button').toLowerCase();
    const onclick = el.getAttribute('onclick') || '';
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    const doXml = parseOnClickToActionBlocks(onclick);

    if (typeAttr === 'submit') {
      return createBlockXml('web_submit_button', { LABEL: label }, { DO: doXml }, {}, customProps);
    }

    if (onclick.includes('document.body.style.backgroundColor')) {
      const m = onclick.match(/backgroundColor\s*=\s*['"]([^'"]+)['"]/);
      return createBlockXml('web_action_change_bg', {
        LABEL: label,
        TARGET_COLOR: m ? m[1] : '#fef08a'
      }, {}, {}, customProps);
    }

    return createBlockXml('web_button', { LABEL: label }, { DO: doXml }, {}, customProps);
  }

  // 11. FORM (<form>)
  if (tag === 'form') {
    const formId = el.getAttribute('id') || 'contact_form';
    let formTitle = 'טופס יצירת קשר';
    const childrenToParse = [];

    const childNodes = Array.from(el.children);
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      if (i === 0 && /^h[1-6]$/i.test(child.tagName)) {
        formTitle = child.textContent.trim();
      } else {
        const blk = parseDomElementToBlockXml(child);
        if (blk) childrenToParse.push(blk);
      }
    }

    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_form', {
      FORM_TITLE: formTitle,
      FORM_ID: formId
    }, {
      CHILDREN: chainBlocksXml(childrenToParse)
    }, {}, customProps);
  }

  // 12. STANDALONE INPUT / TEXTAREA / SELECT
  if (tag === 'input') {
    const type = (el.getAttribute('type') || 'text').toLowerCase();
    const placeholder = el.getAttribute('placeholder') || '';
    const inputId = el.getAttribute('id') || 'TextBox1';
    return createBlockXml('web_input_field', {
      LABEL: 'שדה קלט:',
      INPUT_ID: inputId,
      TYPE: ['text', 'tel', 'email', 'password', 'number', 'date'].includes(type) ? type : 'text',
      PLACEHOLDER: placeholder
    });
  }

  if (tag === 'textarea') {
    return createBlockXml('web_textarea', {
      LABEL: 'הודעה:',
      INPUT_ID: el.getAttribute('id') || 'user_message',
      PLACEHOLDER: el.getAttribute('placeholder') || ''
    });
  }

  if (tag === 'select') {
    const opts = Array.from(el.querySelectorAll('option')).map(o => o.textContent.trim());
    return createBlockXml('web_dropdown_select', {
      LABEL: 'בחר אפשרות:',
      INPUT_ID: el.getAttribute('id') || 'selected_service',
      OPT1: opts[0] || 'אפשרות 1',
      OPT2: opts[1] || 'אפשרות 2',
      OPT3: opts[2] || 'אפשרות 3'
    });
  }

  // 13. MODULAR LISTS (<ul> / <ol> / <li>)
  if (tag === 'ul' || tag === 'ol') {
    const childLis = Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean);
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_list_container', {
      LIST_TYPE: tag,
      MARKER: styleMap['list-style-type'] || 'default'
    }, {
      CHILDREN: chainBlocksXml(childLis)
    }, {}, customProps);
  }
  if (tag === 'li') {
    const elemChildren = Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean);
    const directText = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_list_item', {
      TEXT: directText || (elemChildren.length === 0 ? el.textContent.trim() : '')
    }, {
      CHILDREN: chainBlocksXml(elemChildren)
    }, {}, customProps);
  }

  // 13b. SEMANTIC TEXT FORMATTERS (blockquote, mark, code, pre, strong, em, small, time)
  if (['blockquote', 'mark', 'code', 'pre', 'strong', 'em', 'small', 'time'].includes(tag)) {
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_text_format', {
      TAG: tag,
      CONTENT: el.textContent.trim()
    }, {}, {}, customProps);
  }

  // 13c. MODULAR HTML5 TABLES (<table>, <thead>/<tbody>/<tfoot>, <tr>, <th>/<td>)
  if (tag === 'table') {
    const childXml = chainBlocksXml(Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean));
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['border-collapse']);
    return createBlockXml('web_table', {}, { CHILDREN: childXml }, {}, customProps);
  }
  if (tag === 'thead' || tag === 'tbody' || tag === 'tfoot') {
    const childXml = chainBlocksXml(Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean));
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_table_section', { SECTION_TAG: tag }, { CHILDREN: childXml }, {}, customProps);
  }
  if (tag === 'tr') {
    const childXml = chainBlocksXml(Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean));
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_table_row', {}, { CHILDREN: childXml }, {}, customProps);
  }
  if (tag === 'th' || tag === 'td') {
    const elemChildren = Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean);
    const directText = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_table_cell', {
      CELL_TAG: tag,
      TEXT: directText || (elemChildren.length === 0 ? el.textContent.trim() : ''),
      COLSPAN: el.getAttribute('colspan') || '1',
      ROWSPAN: el.getAttribute('rowspan') || '1'
    }, { CHILDREN: chainBlocksXml(elemChildren) }, {}, customProps);
  }

  // 13d. MEDIA, VECTOR & INTERACTIVE HTML5 (<figure>, <video>, <iframe>, <svg>, <details>, <dialog>, <progress>/<meter>)
  if (tag === 'figure') {
    const figCap = el.querySelector(':scope > figcaption');
    const mediaChildren = Array.from(el.children)
      .filter(c => c.tagName.toLowerCase() !== 'figcaption')
      .map(c => parseDomElementToBlockXml(c))
      .filter(Boolean);
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_figure', {
      CAPTION: figCap ? figCap.textContent.trim() : ''
    }, { CHILDREN: chainBlocksXml(mediaChildren) }, {}, customProps);
  }
  if (tag === 'video') {
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_html5_video', {
      SRC: el.getAttribute('src') || '',
      POSTER: el.getAttribute('poster') || '',
      CONTROLS: el.hasAttribute('controls') ? 'TRUE' : 'FALSE',
      AUTOPLAY: el.hasAttribute('autoplay') ? 'TRUE' : 'FALSE',
      MUTED: el.hasAttribute('muted') ? 'TRUE' : 'FALSE',
      LOOP: el.hasAttribute('loop') ? 'TRUE' : 'FALSE'
    }, {}, {}, customProps);
  }
  if (tag === 'iframe') {
    const src = el.getAttribute('src') || '';
    if (src.includes('youtube.com/embed/')) {
      const m = src.match(/embed\/([^?&"']+)/);
      return createBlockXml('web_video_embed', { VIDEO_ID: m ? m[1] : 'dQw4w9WgXcQ' });
    }
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['border']);
    return createBlockXml('web_iframe_embed', {
      SRC: src,
      TITLE: el.getAttribute('title') || 'תוכן מוטמע',
      HEIGHT: styleMap['height'] || '360px'
    }, {}, {}, customProps);
  }
  if (tag === 'svg') {
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_svg_icon', {
      ICON: 'custom',
      SIZE: styleMap['width'] || '32px',
      COLOR: normalizeColorValue(styleMap['color'], '#2563eb'),
      CUSTOM_SVG: el.innerHTML.trim()
    }, {}, {}, customProps);
  }
  if (tag === 'details') {
    const sumEl = el.querySelector(':scope > summary');
    const bodyChildren = Array.from(el.children)
      .filter(c => c.tagName.toLowerCase() !== 'summary')
      .map(c => parseDomElementToBlockXml(c))
      .filter(Boolean);
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_details_accordion', {
      SUMMARY: sumEl ? sumEl.textContent.trim() : 'פרטים נוספים',
      OPEN_DEFAULT: el.hasAttribute('open') ? 'TRUE' : 'FALSE'
    }, { CHILDREN: chainBlocksXml(bodyChildren) }, {}, customProps);
  }
  if (tag === 'dialog') {
    const childXml = chainBlocksXml(Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean));
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_dialog_modal', {
      ELEMENT_ID: el.getAttribute('id') || 'myModal',
      OPEN_DEFAULT: el.hasAttribute('open') ? 'TRUE' : 'FALSE'
    }, { CHILDREN: childXml }, {}, customProps);
  }
  if (tag === 'progress' || tag === 'meter') {
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_progress_meter', {
      TAG: tag,
      VALUE: el.getAttribute('value') || '75',
      MAX: el.getAttribute('max') || '100'
    }, {}, {}, customProps);
  }

  // 13e. FORM MODULAR CONTROLS (<fieldset>, <label>, <select>, <option>)
  if (tag === 'fieldset') {
    const legEl = el.querySelector(':scope > legend');
    const fieldChildren = Array.from(el.children)
      .filter(c => c.tagName.toLowerCase() !== 'legend')
      .map(c => parseDomElementToBlockXml(c))
      .filter(Boolean);
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_fieldset', {
      LEGEND: legEl ? legEl.textContent.trim() : 'קבוצת שדות'
    }, { CHILDREN: chainBlocksXml(fieldChildren) }, {}, customProps);
  }
  if (tag === 'label') {
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_label', {
      TEXT: el.textContent.trim(),
      FOR_ID: el.getAttribute('for') || ''
    }, {}, {}, customProps);
  }
  if (tag === 'select') {
    const optXml = chainBlocksXml(Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean));
    const customProps = extractCustomPropsFromStyleMap(styleMap, []);
    return createBlockXml('web_select_container', {
      ELEMENT_ID: el.getAttribute('id') || 'select1',
      NAME: el.getAttribute('name') || '',
      REQUIRED: el.hasAttribute('required') ? 'TRUE' : 'FALSE'
    }, { CHILDREN: optXml }, {}, customProps);
  }
  if (tag === 'option') {
    return createBlockXml('web_select_option', {
      LABEL: el.textContent.trim(),
      VALUE: el.getAttribute('value') || el.textContent.trim(),
      SELECTED: el.hasAttribute('selected') ? 'TRUE' : 'FALSE'
    });
  }

  // 13f. SEMANTIC HTML5 CONTAINERS (<section>, <article>, <main>, <aside>, <header>)
  if (['section', 'article', 'main', 'aside', 'header'].includes(tag)) {
    const childXml = chainBlocksXml(Array.from(el.children).map(c => parseDomElementToBlockXml(c)).filter(Boolean));
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['box-sizing']);
    return createBlockXml('web_semantic_container', {
      TAG: tag,
      ELEMENT_ID: el.getAttribute('id') || ''
    }, { CHILDREN: childXml }, {}, customProps);
  }

  // 14. DIV (Composite & Container Blocks)
  if (tag === 'div') {
    const children = Array.from(el.children).filter(
      c => !(c.classList && c.classList.contains('web-block-dim-badge'))
    );

    // 14a. Spacer div (no children, no text, has height)
    if (children.length === 0 && !el.textContent.trim() && styleMap['height']) {
      const h = styleMap['height'];
      return createBlockXml('web_spacer', {
        HEIGHT: ['16px', '32px', '48px', '64px'].includes(h) ? h : '32px'
      });
    }

    // 14b. YouTube video wrapper div (contains single iframe)
    if (children.length === 1 && children[0].tagName.toLowerCase() === 'iframe') {
      const src = children[0].getAttribute('src') || '';
      if (src.includes('youtube.com/embed/')) {
        const m = src.match(/embed\/([^?&"']+)/);
        return createBlockXml('web_video_embed', { VIDEO_ID: m ? m[1] : 'dQw4w9WgXcQ' });
      }
    }

    // 14c. Button wrapper div (web_button / web_button_with_actions)
    if (children.length >= 1 && children.length <= 2 && children[0].tagName.toLowerCase() === 'button') {
      const btn = children[0];
      const btnStyleMap = parseStyleAttribute(btn.getAttribute('style') || '');
      const label = btn.textContent.trim() || 'כפתור';
      const onclick = btn.getAttribute('onclick') || '';
      const doXml = parseOnClickToActionBlocks(onclick);
      const customProps = extractCustomPropsFromStyleMap(btnStyleMap, []);
      return createBlockXml('web_button', { LABEL: label }, { DO: doXml }, {}, customProps);
    }

    // 14d. Bullet item div (2 spans: icon + text)
    if (children.length === 2 && children[0].tagName.toLowerCase() === 'span' && children[1].tagName.toLowerCase() === 'span') {
      const iconText = children[0].textContent.trim();
      const mainText = children[1].textContent.trim();
      const validIcons = ['✅', '🚀', '⭐', '💡', '🔹'];
      const customProps = extractCustomPropsFromStyleMap(styleMap, ['display', 'align-items', 'gap']);
      return createBlockXml('web_bullet_item', {
        ICON: validIcons.includes(iconText) ? iconText : '✅',
        TEXT: mainText
      }, {}, {}, customProps);
    }

    // 14e. Combined Input + Button (web_input_with_button)
    const directLabel = el.querySelector(':scope > label');
    const flexInputRow = el.querySelector(':scope > div > input');
    const flexBtn = el.querySelector(':scope > div > button');
    if (directLabel && flexInputRow && flexBtn) {
      const onclick = flexBtn.getAttribute('onclick') || '';
      const doXml = parseOnClickToActionBlocks(onclick);
      return createBlockXml('web_input_with_button', {
        LABEL: directLabel.textContent.trim(),
        INPUT_ID: flexInputRow.getAttribute('id') || 'TextBox1',
        BTN_LABEL: flexBtn.textContent.trim() || 'הצג תוצאה 🚀'
      }, { DO: doXml });
    }

    // 14f. Checkbox wrapper (input[type=checkbox] + label)
    if (children.length === 2 && children[0].tagName.toLowerCase() === 'input' && (children[0].getAttribute('type') || '').toLowerCase() === 'checkbox') {
      return createBlockXml('web_checkbox', {
        LABEL: children[1].textContent.trim(),
        INPUT_ID: children[0].getAttribute('id') || 'agree_updates'
      });
    }

    // 14g. Range Slider wrapper (div with label+span, plus input[type=range])
    const rangeInput = el.querySelector(':scope > input[type="range"]');
    if (rangeInput) {
      const lbl = el.querySelector('label');
      return createBlockXml('web_slider_input', {
        LABEL: lbl ? lbl.textContent.trim() : 'בחר ערך:',
        INPUT_ID: rangeInput.getAttribute('id') || 'range_val',
        MIN: rangeInput.getAttribute('min') || '1',
        MAX: rangeInput.getAttribute('max') || '100',
        VALUE: rangeInput.getAttribute('value') || '50'
      });
    }

    // 14h. Color Picker wrapper (label + input[type=color])
    const colorInput = el.querySelector(':scope > input[type="color"]');
    if (colorInput) {
      const lbl = el.querySelector('label');
      return createBlockXml('web_color_picker_input', {
        LABEL: lbl ? lbl.textContent.trim() : 'בחר צבע:',
        INPUT_ID: colorInput.getAttribute('id') || 'fav_color',
        VALUE: colorInput.getAttribute('value') || '#2563eb'
      });
    }

    // 14i. Standard Input Field wrapper (label + input)
    const textInput = el.querySelector(':scope > input');
    if (directLabel && textInput && children.length === 2) {
      const type = (textInput.getAttribute('type') || 'text').toLowerCase();
      const inputStyleMap = parseStyleAttribute(textInput.getAttribute('style') || '');
      const customProps = extractCustomPropsFromStyleMap(inputStyleMap, ['width', 'box-sizing']);
      return createBlockXml('web_input_field', {
        LABEL: directLabel.textContent.trim(),
        INPUT_ID: textInput.getAttribute('id') || 'TextBox1',
        TYPE: ['text', 'tel', 'email', 'password', 'number', 'date'].includes(type) ? type : 'text',
        PLACEHOLDER: textInput.getAttribute('placeholder') || ''
      }, {}, {}, customProps);
    }

    // 14j. Textarea wrapper (label + textarea)
    const textareaEl = el.querySelector(':scope > textarea');
    if (directLabel && textareaEl && children.length === 2) {
      const taStyleMap = parseStyleAttribute(textareaEl.getAttribute('style') || '');
      const customProps = extractCustomPropsFromStyleMap(taStyleMap, ['width', 'box-sizing']);
      return createBlockXml('web_textarea', {
        LABEL: directLabel.textContent.trim(),
        INPUT_ID: textareaEl.getAttribute('id') || 'user_message',
        PLACEHOLDER: textareaEl.getAttribute('placeholder') || ''
      }, {}, {}, customProps);
    }

    // 14k. Select Dropdown wrapper (label + select)
    const selectEl = el.querySelector(':scope > select');
    if (directLabel && selectEl && children.length === 2) {
      const opts = Array.from(selectEl.querySelectorAll('option')).map(o => o.textContent.trim());
      return createBlockXml('web_dropdown_select', {
        LABEL: directLabel.textContent.trim(),
        INPUT_ID: selectEl.getAttribute('id') || 'selected_service',
        OPT1: opts[0] || 'אפשרות 1',
        OPT2: opts[1] || 'אפשרות 2',
        OPT3: opts[2] || 'אפשרות 3'
      });
    }

    // 14l. Output Display Box (id ends with _card or starts with 📤)
    const divId = el.getAttribute('id') || '';
    if (children.length === 2 && (divId.endsWith('_card') || children[0].textContent.includes('📤'))) {
      const titleText = children[0].textContent.replace('📤', '').trim();
      const boxId = children[1].getAttribute('id') || divId.replace('_card', '') || 'Label1';
      const defaultText = children[1].textContent.trim();
      const customProps = extractCustomPropsFromStyleMap(styleMap, []);
      return createBlockXml('web_output_box', {
        TITLE: titleText,
        BOX_ID: boxId,
        DEFAULT_TEXT: defaultText
      }, {}, {}, customProps);
    }

    // 14m. Stat Counter Box (2 child divs where first has id and 2rem font)
    if (children.length === 2 && children[0].tagName.toLowerCase() === 'div' && children[1].tagName.toLowerCase() === 'div' && (children[0].getAttribute('style') || '').includes('2rem')) {
      const boxId = children[0].getAttribute('id') || 'counter_1';
      const val = children[0].textContent.trim();
      const label = children[1].textContent.trim();
      const customProps = extractCustomPropsFromStyleMap(styleMap, []);
      return createBlockXml('web_stat_counter', {
        LABEL: label,
        BOX_ID: boxId,
        VALUE: val
      }, {}, {}, customProps);
    }

    // 14n. Simple Text Output Label (no element children, has id and text)
    if (children.length === 0 && divId) {
      const customProps = extractCustomPropsFromStyleMap(styleMap, []);
      return createBlockXml('web_text_output_label', {
        BOX_ID: divId,
        DEFAULT_TEXT: el.textContent.trim()
      }, {}, {}, customProps);
    }

    // 14o. Simple text div with no children and no id
    if (children.length === 0 && el.textContent.trim()) {
      const customProps = extractCustomPropsFromStyleMap(styleMap, []);
      return createBlockXml('web_paragraph', {
        TEXT: el.textContent.trim(),
        ELEMENT_ID: 'paragraph_1',
        SIZE: '16px'
      }, {}, {}, customProps);
    }

    // Recursively parse child elements for container blocks (Flexbox Row or Card)
    const parsedChildren = children.map(c => parseDomElementToBlockXml(c)).filter(Boolean);
    const childrenXml = chainBlocksXml(parsedChildren);

    // 14p0. CSS Grid Container (display: grid)
    if (styleMap['display'] === 'grid') {
      const gridCols = styleMap['grid-template-columns'] || 'repeat(auto-fit, minmax(260px, 1fr))';
      const allowedCols = [
        'repeat(auto-fit, minmax(260px, 1fr))',
        'repeat(2, 1fr)',
        'repeat(3, 1fr)',
        'repeat(4, 1fr)',
        '1fr 2fr',
        '2fr 1fr',
        '1fr'
      ];
      const customProps = extractCustomPropsFromStyleMap(styleMap, ['display']);
      if (!allowedCols.includes(gridCols)) customProps.GRID_COLS = gridCols;
      return createBlockXml('web_grid_container', {
        GRID_COLS: allowedCols.includes(gridCols) ? gridCols : 'repeat(auto-fit, minmax(260px, 1fr))',
        GAP: styleMap['gap'] || '24px'
      }, {
        CHILDREN: childrenXml
      }, {}, customProps);
    }

    // 14p. Flexbox Row (display: flex and flex-direction: row / row-reverse)
    const isFlex = styleMap['display'] === 'flex';
    const flexDir = styleMap['flex-direction'] || '';
    if (isFlex && (flexDir === 'row' || flexDir === 'row-reverse') && !styleMap['box-shadow'] && !styleMap['border-radius']) {
      const justify = styleMap['justify-content'] || 'flex-start';
      const validDirs = ['row', 'column', 'row-reverse', 'column-reverse'];
      const validJustify = ['flex-start', 'center', 'flex-end', 'space-between'];
      const customProps = extractCustomPropsFromStyleMap(styleMap, ['display']);

      return createBlockXml('web_row_flex', {
        DIRECTION: validDirs.includes(flexDir) ? flexDir : 'row',
        JUSTIFY: validJustify.includes(justify) ? justify : 'flex-start'
      }, {
        CHILDREN: childrenXml
      }, {}, customProps);
    }

    // 14q. Default Container -> Card (web_card)
    const bg = normalizeColorValue(styleMap['background-color'], '#ffffff');
    const radius = styleMap['border-radius'] || '16px';
    const shadow = styleMap['box-shadow'] || '0 4px 6px -1px rgba(0,0,0,0.1)';
    const validRadius = ['8px', '16px', '24px', '32px', '0px'];
    const validShadow = [
      '0 4px 6px -1px rgba(0,0,0,0.1)',
      '0 20px 25px -5px rgba(0,0,0,0.12)',
      '0 0 25px rgba(37,99,235,0.2)',
      'none'
    ];
    const customProps = extractCustomPropsFromStyleMap(styleMap, ['display']);

    return createBlockXml('web_card', {
      BG_COLOR: bg,
      RADIUS: validRadius.includes(radius) ? radius : '16px',
      SHADOW: validShadow.includes(shadow) ? shadow : '0 4px 6px -1px rgba(0,0,0,0.1)'
    }, {
      CHILDREN: childrenXml
    }, {}, customProps);
  }

  // Fallback for any other custom HTML tag
  return createBlockXml('web_custom_html', {
    RAW_HTML: el.outerHTML
  });
}

// Main entry point: Convert any HTML document or snippet into Blockly Workspace XML
export function parseHtmlToBlocklyXml(htmlString, options = { ignoreEmbeddedState: false }) {
  if (!htmlString || typeof htmlString !== 'string') return null;

  // 1. Check for lossless embedded WebBlocks state first (unless explicitly parsing raw DOM edits)
  if (!options.ignoreEmbeddedState) {
    const embedded = extractEmbeddedWebBlocksState(htmlString);
    if (embedded && embedded.xml) {
      return {
        xml: embedded.xml,
        pageName: embedded.pageName || null,
        filename: embedded.filename || null,
        allPages: embedded.allPages || null,
        source: 'embedded'
      };
    }
  }

  // 2. Parse HTML DOM and reconstruct blocks
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const body = doc.body;
    if (!body) return null;

    const titleEl = doc.querySelector('title');
    let pageName = titleEl ? titleEl.textContent.split('-')[0].trim() : null;

    const topElements = Array.from(body.children).filter(el => {
      const t = el.tagName.toLowerCase();
      return t !== 'script' && t !== 'style' && !(el.classList && el.classList.contains('web-block-dim-badge'));
    });

    let containerBg = '#f8fafc';
    let containerFont = 'Arial, sans-serif';
    let containerCustomProps = {};
    let innerElements = topElements;

    const validFonts = [
      'Arial, sans-serif',
      'Heebo, sans-serif',
      'Assistant, sans-serif',
      'Rubik, sans-serif',
      'Secular One, sans-serif',
      'Varela Round, sans-serif'
    ];

    // Check if there is a single root page container div
    if (topElements.length === 1 && topElements[0].tagName.toLowerCase() === 'div') {
      const rootDiv = topElements[0];
      const rootStyle = parseStyleAttribute(rootDiv.getAttribute('style') || '');
      if (rootStyle['min-height'] === '100vh' || rootDiv.hasAttribute('data-block-id')) {
        containerBg = normalizeColorValue(rootStyle['background-color'], '#f8fafc');
        const rawFont = rootStyle['font-family'] || 'Arial, sans-serif';
        const matchedFont = validFonts.find(f => rawFont.toLowerCase().includes(f.split(',')[0].toLowerCase()));
        containerFont = matchedFont || 'Arial, sans-serif';
        containerCustomProps = extractCustomPropsFromStyleMap(rootStyle, ['min-height', 'direction', 'display', 'flex-direction', 'width', 'overflow-x']);
        innerElements = Array.from(rootDiv.children).filter(el => {
          const t = el.tagName.toLowerCase();
          return t !== 'script' && t !== 'style' && !(el.classList && el.classList.contains('web-block-dim-badge'));
        });
      }
    } else {
      const bodyStyle = parseStyleAttribute(body.getAttribute('style') || '');
      if (bodyStyle['background-color']) {
        containerBg = normalizeColorValue(bodyStyle['background-color'], '#f8fafc');
      }
    }

    const childBlockXmls = innerElements
      .map(el => parseDomElementToBlockXml(el))
      .filter(Boolean);

    const rootBlockXml = createBlockXml(
      'web_page_container',
      {
        BG_COLOR: containerBg,
        FONT: containerFont
      },
      {
        CHILDREN: chainBlocksXml(childBlockXmls)
      },
      {},
      containerCustomProps,
      { x: 50, y: 30 }
    );

    const fullXml = `<xml xmlns="https://developers.google.com/blockly/xml">${rootBlockXml}</xml>`;
    return {
      xml: fullXml,
      pageName,
      filename: null,
      allPages: null,
      source: 'dom_parser'
    };
  } catch (err) {
    console.error('Error parsing HTML to Blockly XML:', err);
    return null;
  }
}
