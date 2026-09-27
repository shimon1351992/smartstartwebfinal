import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Blockly from 'blockly';
import { javascriptGenerator } from "blockly/javascript";
import MonacoEditor from 'react-monaco-editor';
import { registerWebBlocks, WEB_BLOCKS_TOOLBOX } from './webBlocksDefinitions';
import WebBlockDesignPanel from './WebBlockDesignPanel';

// Register WebBlocks once at module load
registerWebBlocks();

// Standard crisp system font across the entire project
const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Initial starter pages
const INITIAL_PAGES = [
  {
    id: 'index',
    name: '🏠 דף הבית',
    filename: 'index.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="30" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">system-ui, sans-serif</field>
        <statement name="CHILDREN">
          <block type="web_navbar">
            <field name="STYLE_TYPE">hamburger</field>
            <field name="TITLE">העסק שלי 🚀</field>
            <field name="ALIGN">right</field>
            <field name="CTA_TEXT">צור קשר 🚀</field>
            <next>
              <block type="web_card">
                <field name="BG_COLOR">#ffffff</field>
                <field name="RADIUS">16px</field>
                <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.1)</field>
                <statement name="CHILDREN">
                  <block type="web_badge">
                    <field name="TEXT">ברוכים הבאים! ✨</field>
                    <field name="BG_COLOR">#dbeafe</field>
                    <field name="TEXT_COLOR">#1e40af</field>
                    <next>
                      <block type="web_heading">
                        <field name="TEXT">שירותי מחשוב ופיתוח אתרים</field>
                        <field name="TAG">h1</field>
                        <field name="COLOR">#0f172a</field>
                        <field name="ALIGN">right</field>
                        <next>
                          <block type="web_paragraph">
                            <field name="TEXT">אנחנו מספקים פתרונות דיגיטליים מתקדמים לעסקים, בניית אתרים מודרניים ועיצוב חוויית משתמש ברמה הגבוהה ביותר.</field>
                            <field name="COLOR">#475569</field>
                            <field name="SIZE">16px</field>
                            <next>
                              <block type="web_row_flex">
                                <field name="DIRECTION">row</field>
                                <field name="JUSTIFY">flex-start</field>
                                <field name="GAP">16px</field>
                                <statement name="CHILDREN">
                                  <block type="web_whatsapp_button">
                                    <field name="PHONE">0501234567</field>
                                    <field name="LABEL">💬 שלח וואטסאפ ישיר</field>
                                    <next>
                                      <block type="web_button_link">
                                        <field name="LABEL">קרא עלינו עוד ℹ️</field>
                                        <field name="TARGET_PAGE">about.html</field>
                                      </block>
                                    </next>
                                  </block>
                                </statement>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="web_card">
                    <field name="BG_COLOR">#ffffff</field>
                    <field name="RADIUS">16px</field>
                    <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.1)</field>
                    <statement name="CHILDREN">
                      <block type="web_heading">
                        <field name="TEXT">היתרונות שלנו 🌟</field>
                        <field name="TAG">h2</field>
                        <field name="COLOR">#0f172a</field>
                        <field name="ALIGN">right</field>
                        <next>
                          <block type="web_bullet_item">
                            <field name="ICON">✅</field>
                            <field name="TEXT">מהירות שיא וקוד נקי ומאובטח</field>
                            <next>
                              <block type="web_bullet_item">
                                <field name="ICON">⭐</field>
                                <field name="TEXT">התאמה מלאה למחשב, טאבלט וסמארטפון</field>
                                <next>
                                  <block type="web_bullet_item">
                                    <field name="ICON">💡</field>
                                    <field name="TEXT">ליווי אישי ותמיכה לאורך כל הדרך</field>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="web_footer">
                        <field name="BRAND">העסק שלי</field>
                        <field name="COPYRIGHT">כל הזכויות שמורות © 2026</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  },
  {
    id: 'about',
    name: 'ℹ️ אודות',
    filename: 'about.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="30" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">system-ui, sans-serif</field>
        <statement name="CHILDREN">
          <block type="web_navbar">
            <field name="STYLE_TYPE">hamburger</field>
            <field name="TITLE">העסק שלי 🚀</field>
            <field name="ALIGN">right</field>
            <field name="CTA_TEXT">צור קשר 🚀</field>
            <next>
              <block type="web_card">
                <field name="BG_COLOR">#ffffff</field>
                <field name="RADIUS">16px</field>
                <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.1)</field>
                <statement name="CHILDREN">
                  <block type="web_heading">
                    <field name="TEXT">מי אנחנו? ℹ️</field>
                    <field name="TAG">h1</field>
                    <field name="COLOR">#0f172a</field>
                    <field name="ALIGN">right</field>
                    <next>
                      <block type="web_paragraph">
                        <field name="TEXT">אנחנו צוות מפתחים ומעצבים מנוסה שאוהב ליצור מוצרים דיגיטליים שהופכים עסקים למובילים בתחומם.</field>
                        <field name="COLOR">#475569</field>
                        <field name="SIZE">16px</field>
                        <next>
                          <block type="web_image">
                            <field name="SRC">https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&amp;auto=format&amp;fit=crop</field>
                            <field name="WIDTH">100%</field>
                            <field name="RADIUS">12px</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="web_footer">
                    <field name="BRAND">העסק שלי</field>
                    <field name="COPYRIGHT">כל הזכויות שמורות © 2026</field>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  },
  {
    id: 'contact',
    name: '📞 צור קשר',
    filename: 'contact.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="30" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">system-ui, sans-serif</field>
        <statement name="CHILDREN">
          <block type="web_navbar">
            <field name="STYLE_TYPE">hamburger</field>
            <field name="TITLE">העסק שלי 🚀</field>
            <field name="ALIGN">right</field>
            <field name="CTA_TEXT">צור קשר 🚀</field>
            <next>
              <block type="web_card">
                <field name="BG_COLOR">#ffffff</field>
                <field name="RADIUS">16px</field>
                <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.1)</field>
                <statement name="CHILDREN">
                  <block type="web_heading">
                    <field name="TEXT">נשמח לשמוע מכם! 📞</field>
                    <field name="TAG">h1</field>
                    <field name="COLOR">#0f172a</field>
                    <field name="ALIGN">right</field>
                    <next>
                      <block type="web_input_field">
                        <field name="LABEL">שם מלא:</field>
                        <field name="PLACEHOLDER">הקלד שם מלא...</field>
                        <field name="TYPE">text</field>
                        <next>
                          <block type="web_input_field">
                            <field name="LABEL">טלפון ליצירת קשר:</field>
                            <field name="PLACEHOLDER">050-0000000</field>
                            <field name="TYPE">tel</field>
                            <next>
                              <block type="web_textarea">
                                <field name="LABEL">תוכן ההודעה:</field>
                                <field name="PLACEHOLDER">כתוב כאן מה תרצה לשאול...</field>
                                <next>
                                  <block type="web_button">
                                    <field name="LABEL">שלח פנייה 🚀</field>
                                    <field name="BG_COLOR">#2563eb</field>
                                    <field name="TEXT_COLOR">#ffffff</field>
                                    <field name="ALERT_MSG">הפנייה נשלחה בהצלחה! נחזור אליך בהקדם ✨</field>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="web_footer">
                    <field name="BRAND">העסק שלי</field>
                    <field name="COPYRIGHT">כל הזכויות שמורות © 2026</field>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`
  }
];

function WebBlocks() {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  const iframeRef = useRef(null);

  // Multi-page Website State
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState('index');
  const pagesXmlRef = useRef({});

  // Studio Mode: false = Build Mode (Right: Blockly, Left: Preview), true = Design Studio Mode (Right: Large Live Site, Left: Design Controls)
  const [isDesignStudioMode, setIsDesignStudioMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const lastSelectedBlockRef = useRef(null);
  const prevGeneratedCodeRef = useRef('');

  // Left Panel Sub-tab when in Build Mode: 'preview' (Live Site) | 'code' (Monaco Code)
  const [leftBuildTab, setLeftBuildTab] = useState('preview');
  
  // Responsive Device Viewport in Preview: 'desktop' | 'mobile'
  const [deviceView, setDeviceView] = useState('desktop');

  // Full Screen Canvas Toggle: true = 100% Canvas (Focus Mode), false = Split Screen
  const [isFullCanvas, setIsFullCanvas] = useState(false);
  // Full Screen Live Preview Toggle: true = 100% Live Site Preview, false = Split Screen
  const [isFullPreview, setIsFullPreview] = useState(false);

  // Generated HTML Code for active page
  const [code, setCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // AI Web Block Generator Modal State
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false);
  const [inlineAiPrompt, setInlineAiPrompt] = useState('');
  const [isGeneratingInlineBlock, setIsGeneratingInlineBlock] = useState(false);

  // Helper to get active page object
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // Resolve current selected block safely
  const getSelectedBlockObject = () => {
    if (workspace.current && selectedBlockId) {
      const b = workspace.current.getBlockById(selectedBlockId);
      if (b) {
        lastSelectedBlockRef.current = b;
        return b;
      }
    }
    if (workspace.current) {
      const topBlocks = workspace.current.getTopBlocks(true);
      if (topBlocks.length > 0) {
        lastSelectedBlockRef.current = topBlocks[0];
        return topBlocks[0];
      }
    }
    return lastSelectedBlockRef.current;
  };

  const currentSelectedBlock = getSelectedBlockObject();

  // Save current workspace XML into ref
  const saveCurrentPageXml = () => {
    if (workspace.current && activePageId) {
      try {
        const dom = Blockly.Xml.workspaceToDom(workspace.current);
        const xmlText = Blockly.Xml.domToText(dom);
        pagesXmlRef.current[activePageId] = xmlText;
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Update HTML Code function with Live Inspector Glow Styles
  const updateCode = (force = false) => {
    if (!workspace.current) return;
    const generated = javascriptGenerator.workspaceToCode(workspace.current);
    if (!force && generated === prevGeneratedCodeRef.current) {
      return; // Do NOT reload iframe if code hasn't changed!
    }
    prevGeneratedCodeRef.current = generated;
    const fullDoc = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activePage.name} - ${activePage.filename}</title>
  <!-- 🔤 Google Fonts for Hebrew Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&family=Heebo:wght@300;400;600;700;800;900&family=Rubik:wght@300;400;500;700;900&family=Secular+One&family=Varela+Round&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; }
    button, input, select, textarea { font-family: inherit; }

    /* 🎯 Live Element Highlight & Inspection Dimension Frame */
    .web-block-active-inspect {
      outline: 2.5px solid #2563eb !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2), 0 8px 25px rgba(37, 99, 235, 0.35) !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
    }
    .web-block-dim-badge {
      position: absolute !important;
      top: -24px !important;
      right: 0 !important;
      background: #2563eb !important;
      color: #ffffff !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      padding: 2px 8px !important;
      border-radius: 6px !important;
      box-shadow: 0 2px 8px rgba(37,99,235,0.4) !important;
      z-index: 999999 !important;
      white-space: nowrap !important;
      pointer-events: none !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      direction: ltr !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      animation: badgePop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }
    @keyframes badgePop {
      0% { transform: scale(0.7); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes webBlockGlow {
      0% { outline-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25), 0 4px 16px rgba(37, 99, 235, 0.3); }
      100% { outline-color: #06b6d4; box-shadow: 0 0 0 8px rgba(6, 182, 212, 0.35), 0 8px 28px rgba(6, 182, 212, 0.5); }
    }
    @keyframes smartPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes smartFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes smartGlowPulse {
      0% { filter: drop-shadow(0 0 4px rgba(37,99,235,0.3)); }
      100% { filter: drop-shadow(0 0 16px rgba(37,99,235,0.8)); }
    }
  </style>
  <script>
    function smartChangeBg(color) {
      try {
        document.body.style.setProperty('background', color, 'important');
        document.body.style.setProperty('background-color', color, 'important');
        var conts = document.querySelectorAll('div[data-block-id]');
        if (conts && conts.length > 0) {
          conts[0].style.setProperty('background', color, 'important');
          conts[0].style.setProperty('background-color', color, 'important');
        }
      } catch(e) {
        console.error(e);
      }
    }

    function smartPlaySound() {
      try {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        var ctx = new AudioCtx();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      } catch(e) {
        console.warn('Audio error:', e);
      }
    }

    function smartNavigate(page) {
      try {
        window.parent.postMessage({ type: 'WEBLOCKS_NAVIGATE', page: page }, '*');
      } catch(e) {
        window.location.href = page;
      }
    }

    function smartOpenUrl(url) {
      try {
        window.open(url, '_blank');
      } catch(e) {
        window.location.href = url;
      }
    }

    function smartScrollTop() {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      } catch(e) {}
    }

    function smartDisplayInput(inputId, outputId, prefix, suffix) {
      try {
        var val = smartGetText(inputId);
        smartSetText(outputId, (prefix || '') + val + (suffix || ''));
      } catch(e) {
        console.error(e);
      }
    }

    function smartAlertInput(inputId, prefix, suffix) {
      try {
        var val = smartGetText(inputId);
        alert((prefix || '') + val + (suffix || ''));
      } catch(e) {
        console.error(e);
      }
    }

    function smartSendWhatsAppForm(phone, nameId, msgId) {
      try {
        var cleanPhone = (phone || '').replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '972' + cleanPhone.slice(1);
        var nameInput = document.getElementById(nameId);
        var msgInput = document.getElementById(msgId);
        var nameVal = nameInput ? nameInput.value : '';
        var msgVal = msgInput ? msgInput.value : '';
        var fullText = encodeURIComponent('שלום, שמי ' + nameVal + '.\n' + msgVal);
        window.open('https://wa.me/' + cleanPhone + '?text=' + fullText, '_blank');
      } catch(e) {
        console.error(e);
      }
    }

    function smartResetForm(formId) {
      try {
        var form = document.getElementById(formId);
        if (form && typeof form.reset === 'function') {
          form.reset();
        } else {
          document.querySelectorAll('input:not([type=submit]), textarea').forEach(function(i){ i.value = ''; });
        }
      } catch(e) {
        console.error(e);
      }
    }

    function smartGetText(inputId) {
      try {
        var el = document.getElementById(inputId);
        if (el && el.value !== undefined && el.value !== null && el.value.trim() !== '') {
          return el.value;
        }
        var els = document.querySelectorAll('#' + inputId + ', [name="' + inputId + '"], [data-id="' + inputId + '"]');
        for (var i = 0; i < els.length; i++) {
          if (els[i].value !== undefined && els[i].value !== null && els[i].value.trim() !== '') {
            return els[i].value;
          }
        }
        var anyInputs = document.querySelectorAll('input:not([type=button]):not([type=submit]), textarea');
        for (var j = 0; j < anyInputs.length; j++) {
          if (anyInputs[j].value !== undefined && anyInputs[j].value !== null && anyInputs[j].value.trim() !== '') {
            return anyInputs[j].value;
          }
        }
        if (el) return el.value || el.innerText || el.textContent || '';
      } catch(e) {
        console.error('smartGetText error:', e);
      }
      return '';
    }

    function smartSetText(targetId, newText) {
      try {
        var val = (newText !== undefined && newText !== null) ? String(newText) : '';
        
        // 1. Direct ID match
        var el = document.getElementById(targetId);
        if (el) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = val;
          } else {
            el.innerText = val;
            el.textContent = val;
          }
          return;
        }

        // 2. Query selector match
        var els = document.querySelectorAll('#' + targetId + ', [data-block-id="' + targetId + '"], [id="' + targetId + '_text"], [id="' + targetId + '_output"]');
        if (els && els.length > 0) {
          els.forEach(function(item) {
            if (item.tagName === 'INPUT' || item.tagName === 'TEXTAREA') {
              item.value = val;
            } else {
              item.innerText = val;
              item.textContent = val;
            }
          });
          return;
        }

        // 3. Fallback to any output element
        var fallbacks = document.querySelectorAll('[id*="output"], [id*="Label"], [id*="label"]');
        fallbacks.forEach(function(item) {
          if (item.tagName !== 'INPUT' && item.tagName !== 'TEXTAREA') {
            item.innerText = val;
            item.textContent = val;
          }
        });
      } catch(e) {
        console.error('smartSetText error:', e);
      }
    }
  </script>
</head>
<body>
${generated}
</body>
</html>`;
    setCode(fullDoc);
  };

  // Initialize Blockly Workspace
  useEffect(() => {
    registerWebBlocks();

    INITIAL_PAGES.forEach(p => {
      pagesXmlRef.current[p.id] = p.xml;
    });

    if (blocklyDiv.current && !workspace.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: WEB_BLOCKS_TOOLBOX,
        scrollbars: true,
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.88,
          maxScale: 2.0,
          minScale: 0.45,
          scaleSpeed: 1.1
        },
        grid: {
          spacing: 24,
          length: 3,
          colour: '#e2e8f0',
          snap: true
        }
      });

      loadPageXmlToWorkspace('index');

      workspace.current.addChangeListener((event) => {
        if (event.isUiEvent || event.type === Blockly.Events.SELECTED || event.type === Blockly.Events.CLICK || event.type === Blockly.Events.VIEWPORT_CHANGE || event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
          if (event.type === Blockly.Events.SELECTED && event.newElementId) {
            setSelectedBlockId(event.newElementId);
            const b = workspace.current.getBlockById(event.newElementId);
            if (b) lastSelectedBlockRef.current = b;
          }
          return; // DO NOT regenerate code or reload iframe on UI / selection events!
        }
        updateCode();
      });

      updateCode(true);
    }

    return () => {
      if (workspace.current) {
        try {
          workspace.current.dispose();
          workspace.current = null;
        } catch (e) {}
      }
    };
  }, []);

  // Resize workspace when layout changes or switching back to Build mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (workspace.current && !isDesignStudioMode) {
        Blockly.svgResize(workspace.current);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullCanvas, isFullPreview, isDesignStudioMode]);

  // Load XML string into Blockly Workspace
  const loadPageXmlToWorkspace = (pageId) => {
    if (!workspace.current) return;
    const xml = pagesXmlRef.current[pageId] || INITIAL_PAGES.find(p => p.id === pageId)?.xml;
    if (xml) {
      try {
        workspace.current.clear();
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace.current);
      } catch (e) {
        console.error("Error loading XML to workspace:", e);
      }
    }
  };

  // Switch Active Page with Auto-Save
  const handleSwitchPage = (pageId) => {
    if (pageId === activePageId) return;
    saveCurrentPageXml();
    setActivePageId(pageId);
    loadPageXmlToWorkspace(pageId);
    setSelectedBlockId(null);
  };

  // Add a new page
  const handleAddPage = (pageName) => {
    const cleanId = pageName.toLowerCase().replace(/[^a-z0-9]/g, '_') || `page_${Date.now()}`;
    const pageTitle = pageName.trim() || 'עמוד חדש';

    const newPage = {
      id: cleanId,
      name: pageTitle,
      filename: `${cleanId}.html`,
      xml: `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="web_page_container" x="40" y="40">
          <field name="BG_COLOR">#f8fafc</field>
          <field name="FONT">system-ui, sans-serif</field>
          <statement name="CHILDREN">
            <block type="web_navbar">
              <field name="STYLE_TYPE">hamburger</field>
              <field name="TITLE">העסק שלי 🚀</field>
              <field name="ALIGN">right</field>
              <field name="CTA_TEXT">צור קשר 🚀</field>
              <next>
                <block type="web_card">
                  <field name="BG_COLOR">#ffffff</field>
                  <field name="RADIUS">16px</field>
                  <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.1)</field>
                  <statement name="CHILDREN">
                    <block type="web_heading">
                      <field name="TEXT">${pageTitle.trim()}</field>
                      <field name="TAG">h1</field>
                      <field name="COLOR">#0f172a</field>
                      <field name="ALIGN">right</field>
                    </block>
                  </statement>
                  <next>
                    <block type="web_footer">
                      <field name="BRAND">העסק שלי</field>
                      <field name="COPYRIGHT">כל הזכויות שמורות © 2026</field>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>`
    };

    saveCurrentPageXml();
    pagesXmlRef.current[cleanId] = newPage.xml;
    setPages(prev => [...prev, newPage]);
    setActivePageId(cleanId);
    loadPageXmlToWorkspace(cleanId);
  };

  const handleAddNewPage = () => {
    const pageTitle = window.prompt("הזן שם לעמוד החדש (למשל: גלריה, שירותים, מחירון):", "גלריה");
    if (!pageTitle || !pageTitle.trim()) return;
    handleAddPage(pageTitle.trim());
  };

  // Update a field safely
  const handleUpdateBlockField = (block, fieldName, value) => {
    if (!block) return;
    try {
      if (typeof block.getField === 'function' && block.getField(fieldName)) {
        block.setFieldValue(value, fieldName);
      } else {
        block.customProperties = block.customProperties || {};
        block.customProperties[fieldName] = value;
      }
    } catch (e) {
      block.customProperties = block.customProperties || {};
      block.customProperties[fieldName] = value;
    }
    updateCode(true);
  };

  // Active Element Inspection Highlight and Live Dimensions Badge
  const applyActiveInspectionHighlight = (targetBlockId) => {
    if (!iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!doc) return;

      // Clear existing highlights and dimension badges
      doc.querySelectorAll('.web-block-active-inspect').forEach(el => {
        el.classList.remove('web-block-active-inspect');
      });
      doc.querySelectorAll('.web-block-dim-badge').forEach(el => {
        el.remove();
      });

      const activeId = targetBlockId || selectedBlockId || lastSelectedBlockRef.current?.id;
      if (!activeId) return;

      const target = doc.querySelector(`[data-block-id="${activeId}"]`);
      if (target) {
        target.classList.add('web-block-active-inspect');
        
        // Calculate and display live dimensions badge
        const rect = target.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);

        if (w > 0 && h > 0) {
          const badge = doc.createElement('div');
          badge.className = 'web-block-dim-badge';
          badge.innerHTML = `<span>📐 ${w}px × ${h}px</span>`;
          
          const pos = window.getComputedStyle(target).position;
          if (!pos || pos === 'static') {
            target.style.position = 'relative';
          }
          target.appendChild(badge);
        }

        // 🎯 Auto-scroll into view smoothly so the user always sees the element being designed without manual scrolling!
        try {
          target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch (scrollErr) {
          try {
            target.scrollIntoView(true);
          } catch (e) {}
        }
      }
    } catch (err) {}
  };

  // Update Live Preview iframe content and apply two-way Inspection Highlight
  const handleIframeLoad = () => {
    if (!iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!doc) return;

      // 1. Navigation handling inside iframe
      const links = doc.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.endsWith('.html') || href === '#')) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = pages.find(p => p.filename === href);
            if (targetPage) {
              handleSwitchPage(targetPage.id);
            } else if (href.includes('about')) {
              handleSwitchPage('about');
            } else if (href.includes('contact')) {
              handleSwitchPage('contact');
            } else if (href.includes('index')) {
              handleSwitchPage('index');
            }
          });
        }
      });

      // 2. Interactive Selection: Clicking on an element in the Live Preview highlights it in Blockly and in the Design Studio!
      const inspectableElements = doc.querySelectorAll('[data-block-id]');
      inspectableElements.forEach(el => {
        if (!el.style.cursor || el.style.cursor === 'default') {
          el.style.cursor = 'pointer';
        }
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const bId = el.getAttribute('data-block-id');
          if (bId) {
            setSelectedBlockId(bId);
            applyActiveInspectionHighlight(bId);
            if (workspace.current) {
              const targetBlk = workspace.current.getBlockById(bId);
              if (targetBlk) {
                lastSelectedBlockRef.current = targetBlk;
                try {
                  if (typeof targetBlk.select === 'function') targetBlk.select();
                } catch (err) {}
              }
            }
          }
        });
      });

      // 3. Immediately apply highlight to active element on load and scroll into view!
      setTimeout(() => {
        applyActiveInspectionHighlight();
      }, 50);
      setTimeout(() => {
        applyActiveInspectionHighlight();
      }, 150);
    } catch (err) {}
  };

  // Sync Live Highlight and Dimensions Badge cleanly whenever selectedBlockId, mode, or code changes
  useEffect(() => {
    const timer = setTimeout(() => {
      applyActiveInspectionHighlight(selectedBlockId);
    }, 60);
    return () => clearTimeout(timer);
  }, [selectedBlockId, isDesignStudioMode, code]);

  // Cross-frame navigation listener from action_navigate_page
  useEffect(() => {
    const handleWindowMessage = (e) => {
      if (e.data && e.data.type === 'WEBLOCKS_NAVIGATE') {
        const pageTarget = e.data.page;
        if (!pageTarget) return;
        const targetPage = pages.find(p => p.filename === pageTarget || p.id === pageTarget);
        if (targetPage) {
          handleSwitchPage(targetPage.id);
        } else if (pageTarget.includes('about')) {
          handleSwitchPage('about');
        } else if (pageTarget.includes('contact')) {
          handleSwitchPage('contact');
        } else if (pageTarget.includes('services')) {
          handleSwitchPage('services');
        } else if (pageTarget.includes('index')) {
          handleSwitchPage('index');
        }
      }
    };
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [pages]);

  // Copy Code Handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Download active page HTML File Handler
  const handleDownloadHtml = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activePage.filename || 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // AI Web Block Generator Handler
  const handleGenerateWebBlockInline = () => {
    if (!inlineAiPrompt.trim()) return;
    setIsGeneratingInlineBlock(true);

    setTimeout(() => {
      const prompt = inlineAiPrompt.trim();
      const generatedId = `ai_web_${Date.now()}`;
      
      let htmlSnippet = `<div data-block-id="${generatedId}" style="background: #ffffff; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 12px 0;">\n  <h3 style="color: #0f172a; margin-bottom: 8px;">${prompt}</h3>\n</div>\n`;
      
      if (prompt.includes('טופס') || prompt.includes('הרשמה') || prompt.includes('יצירת קשר')) {
        htmlSnippet = `<div data-block-id="${generatedId}" style="background: #ffffff; padding: 24px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; margin: 16px 0;">\n  <h3 style="color: #1e293b; margin-bottom: 14px; font-weight: 700;">📝 טופס הרשמה מהיר</h3>\n  <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #475569;">שם מלא:</label>\n  <input type="text" placeholder="הקלד שם מלא..." style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px;" />\n  <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #475569;">אימייל:</label>\n  <input type="email" placeholder="name@example.com" style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; margin-bottom: 16px;" />\n  <button onclick="alert('ההרשמה נקלטה בהצלחה! 🚀')" style="width: 100%; background: #2563eb; color: #ffffff; border: none; padding: 12px; font-weight: 700; border-radius: 8px; cursor: pointer;">שלח טופס 🚀</button>\n</div>\n`;
      } else if (prompt.includes('מוצר') || prompt.includes('כרטיסייה') || prompt.includes('מחיר')) {
        htmlSnippet = `<div data-block-id="${generatedId}" style="background: #ffffff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; border: 1px solid #e2e8f0; max-width: 320px; margin: 16px auto;">\n  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop" style="width: 100%; border-radius: 12px; height: 180px; object-fit: cover; margin-bottom: 12px;" />\n  <h3 style="color: #0f172a; margin-bottom: 6px;">שעון חכם Pro</h3>\n  <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 12px;">השעון החכם המתקדם ביותר עם חיישני דופק ומסך AMOLED.</p>\n  <div style="font-size: 1.4rem; font-weight: 700; color: #2563eb; margin-bottom: 14px;">₪299</div>\n  <button onclick="alert('נוסף לסל הקניות! 🛒')" style="background: #2563eb; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">הוסף לסל 🛒</button>\n</div>\n`;
      }

      Blockly.Blocks[generatedId] = {
        init: function() {
          this.appendDummyInput()
              .appendField(`✨ AI: ${prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt}`);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour('#ea580c');
          this.setTooltip(`בלוק HTML שנוצר על ידי AI: ${prompt}`);
        }
      };
      const aiGen = function() {
        return `${htmlSnippet}\n`;
      };
      if (javascriptGenerator.forBlock) {
        javascriptGenerator.forBlock[generatedId] = aiGen;
      }
      javascriptGenerator[generatedId] = aiGen;

      if (workspace.current) {
        try {
          const created = workspace.current.newBlock(generatedId);
          created.initSvg();
          created.render();
          created.moveBy(40, 40);
          setSelectedBlockId(created.id);
          lastSelectedBlockRef.current = created;
        } catch (e) {
          console.error(e);
        }
      }

      setIsGeneratingInlineBlock(false);
      setInlineAiPrompt('');
      setShowAIGeneratorModal(false);
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8fafc", direction: "rtl", overflow: 'hidden', fontFamily: SYSTEM_FONT }}>
      
      {/* 🧭 סרגל עליון בהיר, מודרני ואלגנטי (Top Header) */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '10px 20px', 
        background: '#ffffff', 
        borderBottom: '1.5px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        zIndex: 20,
        fontFamily: SYSTEM_FONT
      }}>
        {/* ימין: כפתור חזרה ולוגו */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            background: '#f1f5f9', 
            color: '#1e293b', 
            padding: '7px 14px', 
            borderRadius: '8px', 
            fontSize: '0.85rem', 
            fontWeight: '600',
            border: '1px solid #cbd5e1',
            transition: 'all 0.15s ease',
            fontFamily: SYSTEM_FONT
          }}>
            🏠 חזרה
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🌐</span>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2, fontFamily: SYSTEM_FONT }}>
                WebBlocks Studio
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: SYSTEM_FONT }}>
                {isDesignStudioMode ? '🎨 סטודיו לעיצוב חי' : 'בניית אתרים מודרניים בבלוקים'}
              </span>
            </div>
          </div>
        </div>

        {/* מרכז: כרטיסיות עמודי האתר */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          {pages.map(p => (
            <button
              key={p.id}
              onClick={() => handleSwitchPage(p.id)}
              style={{
                background: activePageId === p.id ? '#2563eb' : 'transparent',
                color: activePageId === p.id ? '#ffffff' : '#475569',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: activePageId === p.id ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                fontFamily: SYSTEM_FONT
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={handleAddNewPage}
            title="הוסף עמוד חדש לאתר"
            style={{
              background: 'transparent',
              color: '#0284c7',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: SYSTEM_FONT
            }}
          >
            ➕ עמוד חדש
          </button>
        </div>

        {/* שמאל: פעולות מהירות */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setShowAIGeneratorModal(true)} 
            style={{ 
              background: 'linear-gradient(135deg, #f97316, #ea580c)', 
              border: 'none', 
              color: '#ffffff', 
              padding: '8px 14px', 
              borderRadius: '8px', 
              fontWeight: '600', 
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(234,88,12,0.25)',
              fontFamily: SYSTEM_FONT
            }}
          >
            ✨ AI Block
          </button>

          <button 
            onClick={handleDownloadHtml}
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0284c7',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: SYSTEM_FONT
            }}
          >
            📥 הורד קובץ
          </button>

          <button 
            onClick={handleCopyCode}
            style={{
              background: copySuccess ? '#dcfce7' : '#ffffff',
              border: '1px solid ' + (copySuccess ? '#86efac' : '#cbd5e1'),
              color: copySuccess ? '#15803d' : '#334155',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: SYSTEM_FONT
            }}
          >
            {copySuccess ? '✅ הועתק' : '📋 העתק קוד'}
          </button>
        </div>
      </header>

      {/* 🖥️ אזור עבודה ראשי דינמי (Build Mode ↔️ Design Studio Mode) */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        
        {/* ========================================================================= */}
        {/* 🌟 אזור ימין הגדול: משטח בלוקים (במצב בנייה) / אתר חי גדול (במצב עיצוב)       */}
        {/* ========================================================================= */}
        <div style={{ 
          flex: isFullCanvas ? 1 : (isDesignStudioMode ? 1.5 : 1.3), 
          display: isFullPreview ? 'none' : 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          borderLeft: isFullCanvas ? 'none' : '1.5px solid #e2e8f0', 
          background: '#ffffff', 
          position: 'relative',
          transition: 'flex 0.2s ease',
          fontFamily: SYSTEM_FONT
        }}>
          
          {/* סרגל עליון של האזור הימני */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '8px 16px', 
            background: isDesignStudioMode ? '#ecfdf5' : '#f8fafc', 
            borderBottom: '1px solid #e2e8f0',
            fontFamily: SYSTEM_FONT
          }}>
            
            {/* כותרת מצב: בנייה בבלוקים / סטודיו עיצוב חי */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>
                {isDesignStudioMode ? '👁️' : '🧩'}
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: isDesignStudioMode ? '#065f46' : '#1e293b', fontFamily: SYSTEM_FONT }}>
                {isDesignStudioMode ? `תצוגת אתר חיה בגודל מלא (${activePage.name})` : `משטח עבודה בבלוקים (${activePage.name})`}
              </span>
              {selectedBlockId && !isDesignStudioMode && (
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', fontFamily: SYSTEM_FONT }}>
                  🎯 מסומן בלייב
                </span>
              )}
            </div>

            {/* כפתורי בקרה: מעבר בין מצב בנייה למצב עיצוב + מסך מלא */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              
              {/* כפתורי מכשיר במצב עיצוב */}
              {isDesignStudioMode && (
                <div style={{ display: 'flex', gap: '2px', background: '#ffffff', padding: '2px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <button 
                    onClick={() => setDeviceView('desktop')}
                    title="מחשב"
                    style={{
                      background: deviceView === 'desktop' ? '#2563eb' : 'transparent',
                      border: 'none',
                      color: deviceView === 'desktop' ? '#ffffff' : '#64748b',
                      padding: '4px 10px',
                      borderRadius: '5px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: SYSTEM_FONT
                    }}
                  >
                    🖥️ מסך מחשב
                  </button>
                  <button 
                    onClick={() => setDeviceView('mobile')}
                    title="סמארטפון"
                    style={{
                      background: deviceView === 'mobile' ? '#2563eb' : 'transparent',
                      border: 'none',
                      color: deviceView === 'mobile' ? '#ffffff' : '#64748b',
                      padding: '4px 10px',
                      borderRadius: '5px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: SYSTEM_FONT
                    }}
                  >
                    📱 מובייל
                  </button>
                </div>
              )}

              {/* כפתור המעבר הראשי: עצב אלמנט ↔️ חזרה לבנייה בבלוקים */}
              <button
                onClick={() => {
                  if (!isDesignStudioMode) {
                    const blk = getSelectedBlockObject();
                    if (blk && blk.id) {
                      setSelectedBlockId(blk.id);
                    }
                  }
                  setIsDesignStudioMode(prev => !prev);
                  if (isFullCanvas) setIsFullCanvas(false);
                }}
                style={{
                  background: isDesignStudioMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isDesignStudioMode ? '0 2px 10px rgba(16,185,129,0.3)' : '0 2px 10px rgba(37,99,235,0.25)',
                  transition: 'all 0.15s ease',
                  fontFamily: SYSTEM_FONT
                }}
              >
                {isDesignStudioMode ? '🧩 חזרה לבנייה בבלוקים' : '🎨 כניסה לעיצוב אלמנט'}
              </button>

              {/* כפתור מסך מלא (זמין גם במצב בנייה וגם במצב עיצוב!) */}
              <button
                onClick={() => {
                  setIsFullCanvas(prev => !prev);
                  if (isFullPreview) setIsFullPreview(false);
                }}
                title={isFullCanvas ? "חזור לתצוגה מפוצלת" : (isDesignStudioMode ? "הרחב תצוגת אתר למסך מלא" : "הרחב משטח בלוקים למסך מלא")}
                style={{
                  background: isFullCanvas ? '#2563eb' : '#ffffff',
                  color: isFullCanvas ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isFullCanvas ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                  fontFamily: SYSTEM_FONT
                }}
              >
                {isFullCanvas ? '◧ תצוגה מפוצלת' : '⛶ מסך מלא'}
              </button>

            </div>
          </div>

          {/* תוכן האזור הימני: או משטח הבלוקים או האתר החי הגדול */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            
            {/* 1. משטח הבלוקים של Blockly (נשמר תמיד ב-DOM, מוסתר רק במצב עיצוב) */}
            <div 
              ref={blocklyDiv} 
              style={{ 
                width: "100%",
                height: "100%", 
                background: "#ffffff",
                display: isDesignStudioMode ? 'none' : 'block'
              }} 
            />

            {/* 2. תצוגת האתר החי הגדול (מוצגת במצב סטודיו לעיצוב!) */}
            {isDesignStudioMode && (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f1f5f9' }}>
                {/* שורת כתובת מדומה */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  </div>
                  <div style={{ flex: 1, background: '#f8fafc', color: '#64748b', padding: '3px 12px', borderRadius: '5px', fontSize: '0.78rem', fontFamily: 'monospace', border: '1px solid #cbd5e1', direction: 'ltr' }}>
                    https://my-site.co.il/{activePage.filename}
                  </div>
                </div>

                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: deviceView === 'desktop' ? '0' : '20px',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}>
                  <div style={
                    deviceView === 'mobile' ? {
                      width: '360px',
                      height: '640px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                      borderRadius: '26px',
                      border: '8px solid #334155',
                      overflow: 'hidden',
                      background: '#ffffff'
                    } : {
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: '#ffffff'
                    }
                  }>
                    <iframe 
                      ref={iframeRef}
                      title="Live HTML Preview"
                      srcDoc={code}
                      onLoad={handleIframeLoad}
                      sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 📱 אזור שמאל: פאנל עיצוב (במצב עיצוב) / אתר קומפקטי וקוד (במצב בנייה)       */}
        {/* ========================================================================= */}
        <div style={{ 
          flex: isFullPreview ? 1 : (isDesignStudioMode ? 0.9 : 0.9), 
          display: isFullCanvas ? 'none' : 'flex', 
          flexDirection: "column", 
          background: "#ffffff",
          overflow: 'hidden',
          fontFamily: SYSTEM_FONT
        }}>
            
            {/* במצב בנייה רגיל: סרגל עליון עם כפתורי תצוגה מקדימה וקוד */}
            {!isDesignStudioMode && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '8px 14px', 
                background: '#f8fafc', 
                borderBottom: '1px solid #e2e8f0',
                fontFamily: SYSTEM_FONT
              }}>
                <div style={{ display: 'flex', gap: '3px', background: '#ffffff', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <button 
                    onClick={() => setLeftBuildTab('preview')}
                    style={{ 
                      background: leftBuildTab === 'preview' ? '#2563eb' : 'transparent', 
                      color: leftBuildTab === 'preview' ? '#ffffff' : '#475569',
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: SYSTEM_FONT
                    }}
                  >
                    👁️ תצוגה מקדימה
                  </button>
                  
                  <button 
                    onClick={() => setLeftBuildTab('code')}
                    style={{ 
                      background: leftBuildTab === 'code' ? '#2563eb' : 'transparent', 
                      color: leftBuildTab === 'code' ? '#ffffff' : '#475569',
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: SYSTEM_FONT
                    }}
                  >
                    💻 קוד HTML
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {leftBuildTab === 'preview' && (
                    <div style={{ display: 'flex', gap: '2px', background: '#ffffff', padding: '2px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <button 
                        onClick={() => setDeviceView('desktop')}
                        title="מחשב"
                        style={{
                          background: deviceView === 'desktop' ? '#2563eb' : 'transparent',
                          border: 'none',
                          color: deviceView === 'desktop' ? '#ffffff' : '#64748b',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontFamily: SYSTEM_FONT
                        }}
                      >
                        🖥️
                      </button>
                      <button 
                        onClick={() => setDeviceView('mobile')}
                        title="סמארטפון"
                        style={{
                          background: deviceView === 'mobile' ? '#2563eb' : 'transparent',
                          border: 'none',
                          color: deviceView === 'mobile' ? '#ffffff' : '#64748b',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontFamily: SYSTEM_FONT
                        }}
                      >
                        📱
                      </button>
                    </div>
                  )}

                  {/* ⛶ כפתור מסך מלא לתצוגה מקדימה בלייב */}
                  <button
                    onClick={() => {
                      setIsFullPreview(prev => !prev);
                      if (isFullCanvas) setIsFullCanvas(false);
                    }}
                    title={isFullPreview ? "חזור לתצוגה מפוצלת" : "הרחב תצוגה מקדימה למסך מלא"}
                    style={{
                      background: isFullPreview ? '#2563eb' : '#ffffff',
                      color: isFullPreview ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isFullPreview ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                      fontFamily: SYSTEM_FONT
                    }}
                  >
                    {isFullPreview ? '◧ תצוגה מפוצלת' : '⛶ מסך מלא'}
                  </button>
                </div>
              </div>
            )}

            {/* תוכן האזור השמאלי */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* מצב 1: פאנל העיצוב (מוצג כשנמצאים בסטודיו לעיצוב!) */}
              {isDesignStudioMode && (
                <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
                  <WebBlockDesignPanel 
                    selectedBlock={currentSelectedBlock}
                    onUpdateField={handleUpdateBlockField}
                    onBackToToolbox={() => setIsDesignStudioMode(false)}
                  />
                </div>
              )}

              {/* מצב 2: תצוגה מקדימה קומפקטית של האתר (במצב בנייה רגיל) */}
              {!isDesignStudioMode && leftBuildTab === 'preview' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    </div>
                    <div style={{ flex: 1, background: '#f8fafc', color: '#64748b', padding: '3px 10px', borderRadius: '5px', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid #cbd5e1', direction: 'ltr' }}>
                      https://my-site.co.il/{activePage.filename}
                    </div>
                  </div>

                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: deviceView === 'desktop' ? '0' : '16px',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}>
                    <div style={
                      deviceView === 'mobile' ? {
                        width: '340px',
                        height: '580px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        borderRadius: '24px',
                        border: '6px solid #334155',
                        overflow: 'hidden',
                        background: '#ffffff'
                      } : {
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#ffffff'
                      }
                    }>
                      <iframe 
                        ref={iframeRef}
                        title="Live HTML Preview"
                        srcDoc={code}
                        onLoad={handleIframeLoad}
                        sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* מצב 3: עורך קוד Monaco */}
              {!isDesignStudioMode && leftBuildTab === 'code' && (
                <div style={{ width: '100%', height: '100%' }}>
                  <MonacoEditor
                    height="100%"
                    language="html"
                    theme="vs-dark"
                    value={code}
                    options={{
                      selectOnLineNumbers: true,
                      readOnly: false,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      minimap: { enabled: true },
                      fontSize: 13,
                      lineHeight: 20,
                      fontFamily: 'Consolas, "Fira Code", monospace'
                    }}
                    onChange={(newValue) => setCode(newValue)}
                  />
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ✨ מודל מחולל בלוקי HTML ב-AI */}
      {showAIGeneratorModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(15, 23, 42, 0.6)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 10000, 
          backdropFilter: 'blur(6px)',
          fontFamily: SYSTEM_FONT
        }}>
          <div style={{ 
            background: '#ffffff', 
            padding: '24px', 
            borderRadius: '16px', 
            width: '480px', 
            maxWidth: '90%', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
            direction: 'rtl',
            fontFamily: SYSTEM_FONT
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>✨</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0, fontFamily: SYSTEM_FONT }}>
                  מחולל בלוקי HTML ב-AI
                </h3>
              </div>
              <button 
                onClick={() => setShowAIGeneratorModal(false)} 
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '14px', lineHeight: 1.5, fontFamily: SYSTEM_FONT }}>
              תאר בשפה חופשית את האלמנט שתרצה ליצור (למשל: <em>טופס הרשמה</em> או <em>כרטיסיית מוצר</em>), וה-AI יוסיף אותו מיד למשטח הבלוקים!
            </p>
            
            <textarea 
              value={inlineAiPrompt} 
              onChange={(e) => setInlineAiPrompt(e.target.value)} 
              placeholder="לדוגמה: כרטיסיית מוצר יוקרתית עם תמונה, מחיר וכפתור רכישה..." 
              style={{ 
                width: '100%', 
                height: '90px', 
                marginBottom: '16px', 
                boxSizing: 'border-box',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                fontFamily: SYSTEM_FONT,
                outline: 'none'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={() => setShowAIGeneratorModal(false)} 
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: SYSTEM_FONT
                }}
              >
                ביטול
              </button>
              <button 
                onClick={handleGenerateWebBlockInline} 
                disabled={isGeneratingInlineBlock || !inlineAiPrompt.trim()}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  opacity: (!inlineAiPrompt.trim() || isGeneratingInlineBlock) ? 0.6 : 1,
                  fontFamily: SYSTEM_FONT
                }}
              >
                {isGeneratingInlineBlock ? '⏳ מייצר בלוק...' : '✨ צור בלוק'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebBlocks;
