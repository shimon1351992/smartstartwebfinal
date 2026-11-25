import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Blockly from 'blockly';
import { javascriptGenerator } from "blockly/javascript";
import MonacoEditor from 'react-monaco-editor';
import {
  registerWebBlocks,
  WEB_BLOCKS_TOOLBOX,
  WEB_BLOCK_SEARCH_LABELS,
  generateDynamicCssForWorkspace
} from './webBlocksDefinitions';
import WebBlockDesignPanel from './WebBlockDesignPanel';
import { encodeWebBlocksState, parseHtmlToBlocklyXml } from './webBlocksHtmlParser';
import { getActiveServerUrl } from './serverPort';
import './WebBlocks.css';

// Register WebBlocks once at module load
registerWebBlocks();

// Standard crisp system font across the entire project
const SYSTEM_FONT = "'Heebo', 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

// Helper to wrap reusable consistent 4-page navbar XML
const buildStarterNavbarXml = (nextXml = '') => `<block type="web_navbar_custom">
  <field name="BG_COLOR">#0f172a</field>
  <data>{"GRADIENT":"linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)","PADDING_TOP":"14","PADDING_BOTTOM":"14","PADDING_RIGHT":"22","PADDING_LEFT":"22","RADIUS":"16px","BOX_SHADOW":"0 12px 30px -8px rgba(15,23,42,0.35)","BORDER_WIDTH":"1","BORDER_STYLE":"solid","BORDER_COLOR":"rgba(148,163,184,0.2)"}</data>
  <statement name="CHILDREN">
    <block type="web_heading">
      <field name="TEXT">NexusPro ⚡</field>
      <field name="TAG">h3</field>
      <field name="ELEMENT_ID">brandLogo</field>
      <field name="ALIGN">right</field>
      <data>{"COLOR":"#ffffff","FONT_WEIGHT":"900"}</data>
      <next>
        <block type="web_row_flex">
          <field name="DIRECTION">row</field>
          <field name="JUSTIFY">center</field>
          <data>{"GAP":"18","ALIGN_ITEMS":"center"}</data>
          <statement name="CHILDREN">
            <block type="web_link">
              <field name="TEXT">🏠 דף הבית</field>
              <field name="URL">index.html</field>
              <field name="TARGET">_self</field>
              <data>{"COLOR":"#f8fafc","TEXT_DECORATION":"none","FONT_WEIGHT":"700","HOVER_COLOR":"#38bdf8"}</data>
              <next>
                <block type="web_link">
                  <field name="TEXT">💼 שירותים ומחירים</field>
                  <field name="URL">services.html</field>
                  <field name="TARGET">_self</field>
                  <data>{"COLOR":"#cbd5e1","TEXT_DECORATION":"none","FONT_WEIGHT":"700","HOVER_COLOR":"#38bdf8"}</data>
                  <next>
                    <block type="web_link">
                      <field name="TEXT">🗄️ פורטל ודאטה-בייס</field>
                      <field name="URL">portal.html</field>
                      <field name="TARGET">_self</field>
                      <data>{"COLOR":"#cbd5e1","TEXT_DECORATION":"none","FONT_WEIGHT":"700","HOVER_COLOR":"#38bdf8"}</data>
                      <next>
                        <block type="web_link">
                          <field name="TEXT">📞 צור קשר</field>
                          <field name="URL">contact.html</field>
                          <field name="TARGET">_self</field>
                          <data>{"COLOR":"#cbd5e1","TEXT_DECORATION":"none","FONT_WEIGHT":"700","HOVER_COLOR":"#38bdf8"}</data>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="db_session_badge">
              <field name="PORTAL_URL">portal.html</field>
              <data>{"BG_COLOR":"rgba(56,189,248,0.16)","BORDER_WIDTH":"1","BORDER_STYLE":"solid","BORDER_COLOR":"rgba(56,189,248,0.4)","RADIUS":"999px"}</data>
            </block>
          </next>
        </block>
      </next>
    </block>
  </statement>
  ${nextXml ? `<next>${nextXml}</next>` : ''}
</block>`;

// Initial commercial multi-page website built from modular HTML5 + CSS3 + Database blocks
const INITIAL_PAGES = [
  {
    id: 'index',
    name: '🏠 דף הבית',
    filename: 'index.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="24" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">Heebo, sans-serif</field>
        <field name="ALIGN_ITEMS">center</field>
        <field name="SITE_WIDTH">1140px</field>
        <statement name="CHILDREN">
          ${buildStarterNavbarXml(`
            <block type="web_semantic_container">
              <field name="TAG">section</field>
              <field name="ELEMENT_ID">heroSection</field>
              <data>{"GRADIENT":"linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)","PADDING_TOP":"44","PADDING_BOTTOM":"44","PADDING_RIGHT":"34","PADDING_LEFT":"34","RADIUS":"24px","BOX_SHADOW":"0 25px 50px -12px rgba(15,23,42,0.35)","MARGIN_BOTTOM":"28"}</data>
              <statement name="CHILDREN">
                <block type="web_grid_container">
                  <field name="GRID_COLS">repeat(auto-fit, minmax(280px, 1fr))</field>
                  <field name="GAP">28px</field>
                  <data>{"ALIGN_ITEMS":"center","MARGIN_BOTTOM":"0"}</data>
                  <statement name="CHILDREN">
                    <block type="web_semantic_container">
                      <field name="TAG">div</field>
                      <field name="ELEMENT_ID">heroCopy</field>
                      <data>{"BG_COLOR":"transparent","PADDING":"0","GAP":"14"}</data>
                      <statement name="CHILDREN">
                        <block type="web_badge">
                          <field name="TEXT">SaaS • HTML5 + CSS3 + Database 🚀</field>
                          <field name="ELEMENT_ID">heroBadge</field>
                          <field name="BG_COLOR">#312e81</field>
                          <data>{"TEXT_COLOR":"#93c5fd","BORDER_WIDTH":"1","BORDER_STYLE":"solid","BORDER_COLOR":"rgba(147,197,253,0.35)"}</data>
                          <next>
                            <block type="web_heading">
                              <field name="TEXT">בונים מוצרים דיגיטליים שמכניסים תוצאות אמיתיות</field>
                              <field name="TAG">h1</field>
                              <field name="ELEMENT_ID">heroTitle</field>
                              <field name="ALIGN">right</field>
                              <data>{"COLOR":"#ffffff","FONT_SIZE":"38","LINE_HEIGHT":"1.2","FONT_WEIGHT":"900"}</data>
                              <next>
                                <block type="web_paragraph">
                                  <field name="TEXT">פלטפורמת NexusPro משלבת מבנה HTML5 סמנטי, עיצוב CSS3 מסחרי, טפסים חכמים, מערכת משתמשים וחיבור ישיר לדאטה-בייס — הכל בבלוקים מודולריים.</field>
                                  <field name="ELEMENT_ID">heroDesc</field>
                                  <field name="SIZE">16px</field>
                                  <data>{"COLOR":"#cbd5e1","LINE_HEIGHT":"1.7"}</data>
                                  <next>
                                    <block type="web_row_flex">
                                      <field name="DIRECTION">row</field>
                                      <field name="JUSTIFY">flex-start</field>
                                      <data>{"GAP":"12"}</data>
                                      <statement name="CHILDREN">
                                        <block type="web_button_link">
                                          <field name="LABEL">צפה במסלולים ומחירים 💎</field>
                                          <field name="TARGET_PAGE">services.html</field>
                                          <data>{"GRADIENT":"linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)","PADDING_TOP":"12","PADDING_BOTTOM":"12","PADDING_RIGHT":"22","PADDING_LEFT":"22","RADIUS":"12px","BOX_SHADOW":"0 10px 24px -4px rgba(37,99,235,0.5)","HOVER_SCALE":"1.04"}</data>
                                          <next>
                                            <block type="web_button_link">
                                              <field name="LABEL">לפורטל ודאטה-בייס 🗄️</field>
                                              <field name="TARGET_PAGE">portal.html</field>
                                              <data>{"BG_COLOR":"rgba(255,255,255,0.1)","BORDER_WIDTH":"1","BORDER_STYLE":"solid","BORDER_COLOR":"rgba(255,255,255,0.3)","PADDING_TOP":"12","PADDING_BOTTOM":"12","PADDING_RIGHT":"20","PADDING_LEFT":"20","RADIUS":"12px","HOVER_BG":"rgba(255,255,255,0.2)"}</data>
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
                        <block type="web_figure">
                          <field name="CAPTION">דשבורד ניהול ומעקב בזמן אמת — SmartDB</field>
                          <data>{"BG_COLOR":"rgba(255,255,255,0.06)","PADDING":"10","RADIUS":"20px","BORDER_WIDTH":"1","BORDER_STYLE":"solid","BORDER_COLOR":"rgba(255,255,255,0.16)","COLOR":"#cbd5e1"}</data>
                          <statement name="CHILDREN">
                            <block type="web_image">
                              <field name="SRC">https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&amp;auto=format&amp;fit=crop</field>
                              <field name="ALT">אנליטיקה וניהול פרויקטים בזמן אמת</field>
                              <field name="WIDTH">100%</field>
                              <field name="RADIUS">12px</field>
                            </block>
                          </statement>
                        </block>
                      </next>
                    </block>
                  </statement>
                </block>
              </statement>
              <next>
                <block type="web_grid_container">
                  <field name="GRID_COLS">repeat(auto-fit, minmax(250px, 1fr))</field>
                  <field name="GAP">20px</field>
                  <statement name="CHILDREN">
                    <block type="web_card">
                      <field name="BG_COLOR">#ffffff</field>
                      <field name="RADIUS">18px</field>
                      <field name="CONTENT_ALIGN">right</field>
                      <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                      <data>{"HOVER_TRANSLATE_Y":"-6px","HOVER_SHADOW":"0 20px 35px -10px rgba(37,99,235,0.18)","TRANSITION":"all 0.25s ease"}</data>
                      <statement name="CHILDREN">
                        <block type="web_svg_icon">
                          <field name="ICON">bolt</field>
                          <field name="SIZE">34px</field>
                          <field name="COLOR">#2563eb</field>
                          <next>
                            <block type="web_heading">
                              <field name="TEXT">ביצועים ו-SEO מלא</field>
                              <field name="TAG">h3</field>
                              <field name="ELEMENT_ID">feat1Head</field>
                              <field name="ALIGN">right</field>
                              <next>
                                <block type="web_paragraph">
                                  <field name="TEXT">קוד סמנטי נקי עם תגיות HTML5 מלאות, טעינה מהירה וציון נגישות גבוה.</field>
                                  <field name="ELEMENT_ID">feat1Desc</field>
                                  <field name="SIZE">14px</field>
                                  <next>
                                    <block type="web_progress_meter">
                                      <field name="TAG">progress</field>
                                      <field name="VALUE">98</field>
                                      <field name="MAX">100</field>
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
                          <field name="RADIUS">18px</field>
                          <field name="CONTENT_ALIGN">right</field>
                          <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                          <data>{"HOVER_TRANSLATE_Y":"-6px","HOVER_SHADOW":"0 20px 35px -10px rgba(15,118,110,0.2)","TRANSITION":"all 0.25s ease"}</data>
                          <statement name="CHILDREN">
                            <block type="web_svg_icon">
                              <field name="ICON">shield</field>
                              <field name="SIZE">34px</field>
                              <field name="COLOR">#0f766e</field>
                              <next>
                                <block type="web_heading">
                                  <field name="TEXT">דאטה-בייס ואימות משתמשים</field>
                                  <field name="TAG">h3</field>
                                  <field name="ELEMENT_ID">feat2Head</field>
                                  <field name="ALIGN">right</field>
                                  <next>
                                    <block type="web_paragraph">
                                      <field name="TEXT">שמירה ושליפה בזמן אמת, חיבור ל-Firebase REST או SmartDB, והרשמת לקוחות.</field>
                                      <field name="ELEMENT_ID">feat2Desc</field>
                                      <field name="SIZE">14px</field>
                                      <next>
                                        <block type="web_progress_meter">
                                          <field name="TAG">progress</field>
                                          <field name="VALUE">100</field>
                                          <field name="MAX">100</field>
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
                              <field name="RADIUS">18px</field>
                              <field name="CONTENT_ALIGN">right</field>
                              <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                              <data>{"HOVER_TRANSLATE_Y":"-6px","HOVER_SHADOW":"0 20px 35px -10px rgba(124,58,237,0.2)","TRANSITION":"all 0.25s ease"}</data>
                              <statement name="CHILDREN">
                                <block type="web_svg_icon">
                                  <field name="ICON">gem</field>
                                  <field name="SIZE">34px</field>
                                  <field name="COLOR">#7c3aed</field>
                                  <next>
                                    <block type="web_heading">
                                      <field name="TEXT">עיצוב CSS3 ברמה מסחרית</field>
                                      <field name="TAG">h3</field>
                                      <field name="ELEMENT_ID">feat3Head</field>
                                      <field name="ALIGN">right</field>
                                      <next>
                                        <block type="web_paragraph">
                                          <field name="TEXT">Flexbox, Grid, גרדיאנטים, מצבי :hover והתאמה מלאה לסמארטפון ולטאבלט.</field>
                                          <field name="ELEMENT_ID">feat3Desc</field>
                                          <field name="SIZE">14px</field>
                                          <next>
                                            <block type="web_progress_meter">
                                              <field name="TAG">progress</field>
                                              <field name="VALUE">96</field>
                                              <field name="MAX">100</field>
                                            </block>
                                          </next>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </statement>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="web_card">
                      <field name="BG_COLOR">#ffffff</field>
                      <field name="RADIUS">20px</field>
                      <field name="CONTENT_ALIGN">right</field>
                      <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                      <statement name="CHILDREN">
                        <block type="web_text_format">
                          <field name="TAG">blockquote</field>
                          <field name="CONTENT">"עברנו ל-NexusPro ובנינו תוך יומיים מערכת הזמנות ופורטל לקוחות מחובר לדאטה-בייס שנראה כמו חברת הייטק!"</field>
                          <next>
                            <block type="web_text_format">
                              <field name="TAG">small</field>
                              <field name="CONTENT">— דניאל לוי, מייסד DigitalFlow ⭐ דירוג 4.9/5</field>
                            </block>
                          </next>
                        </block>
                      </statement>
                      <next>
                        <block type="web_semantic_container">
                          <field name="TAG">footer</field>
                          <field name="ELEMENT_ID">siteFooter</field>
                          <data>{"BG_COLOR":"#0f172a","COLOR":"#94a3b8","RADIUS":"18px","PADDING":"26","TEXT_ALIGN":"center","ALIGN_ITEMS":"center","MARGIN_TOP":"12"}</data>
                          <statement name="CHILDREN">
                            <block type="web_heading">
                              <field name="TEXT">NexusPro Digital Studio</field>
                              <field name="TAG">h4</field>
                              <field name="ELEMENT_ID">footerBrand</field>
                              <field name="ALIGN">center</field>
                              <data>{"COLOR":"#ffffff"}</data>
                              <next>
                                <block type="web_text_format">
                                  <field name="TAG">small</field>
                                  <field name="CONTENT">כל הזכויות שמורות © 2026 NexusPro • נבנה במלואו באמצעות HTML5, CSS3 ובלוקי דאטה-בייס</field>
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
          `)}
        </statement>
      </block>
    </xml>`
  },
  {
    id: 'services',
    name: '💼 שירותים ומחירים',
    filename: 'services.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="24" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">Heebo, sans-serif</field>
        <field name="ALIGN_ITEMS">center</field>
        <field name="SITE_WIDTH">1140px</field>
        <statement name="CHILDREN">
          ${buildStarterNavbarXml(`
            <block type="web_semantic_container">
              <field name="TAG">main</field>
              <field name="ELEMENT_ID">servicesMain</field>
              <data>{"PADDING":"10","GAP":"24"}</data>
              <statement name="CHILDREN">
                <block type="web_card">
                  <field name="BG_COLOR">#ffffff</field>
                  <field name="RADIUS">20px</field>
                  <field name="CONTENT_ALIGN">center</field>
                  <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                  <statement name="CHILDREN">
                    <block type="web_badge">
                      <field name="TEXT">תמחור שקוף ומסלולי צמיחה 💎</field>
                      <field name="ELEMENT_ID">pricingBadge</field>
                      <field name="BG_COLOR">#ede9fe</field>
                      <data>{"TEXT_COLOR":"#6d28d9"}</data>
                      <next>
                        <block type="web_heading">
                          <field name="TEXT">בחר את החבילה המתאימה לעסק שלך</field>
                          <field name="TAG">h1</field>
                          <field name="ELEMENT_ID">pricingHeroH1</field>
                          <field name="ALIGN">center</field>
                          <next>
                            <block type="web_paragraph">
                              <field name="TEXT">כל המסלולים כוללים עיצוב מותאם אישית, אבטחת SSL וחיבור מלא למסד נתונים.</field>
                              <field name="ELEMENT_ID">pricingHeroSub</field>
                              <field name="SIZE">16px</field>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="web_grid_container">
                      <field name="GRID_COLS">repeat(auto-fit, minmax(250px, 1fr))</field>
                      <field name="GAP">22px</field>
                      <statement name="CHILDREN">
                        <block type="web_card">
                          <field name="BG_COLOR">#ffffff</field>
                          <field name="RADIUS">20px</field>
                          <field name="CONTENT_ALIGN">right</field>
                          <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                          <statement name="CHILDREN">
                            <block type="web_badge">
                              <field name="TEXT">Starter</field>
                              <field name="ELEMENT_ID">p1Badge</field>
                              <field name="BG_COLOR">#dbeafe</field>
                              <next>
                                <block type="web_heading">
                                  <field name="TEXT">₪149 / חודש</field>
                                  <field name="TAG">h2</field>
                                  <field name="ELEMENT_ID">p1Price</field>
                                  <field name="ALIGN">right</field>
                                  <next>
                                    <block type="web_list_container">
                                      <field name="LIST_TYPE">ul</field>
                                      <field name="MARKER">default</field>
                                      <statement name="CHILDREN">
                                        <block type="web_list_item">
                                          <field name="TEXT">עד 5 עמודים מעוצבים</field>
                                          <next>
                                            <block type="web_list_item">
                                              <field name="TEXT">טופס יצירת קשר שמור ב-DB</field>
                                              <next>
                                                <block type="web_list_item">
                                                  <field name="TEXT">תמיכה במייל</field>
                                                </block>
                                              </next>
                                            </block>
                                          </next>
                                        </block>
                                      </statement>
                                      <next>
                                        <block type="web_button">
                                          <field name="LABEL">בקש הצעה למסלול</field>
                                          <statement name="DO">
                                            <block type="action_dialog_control">
                                              <field name="TARGET_ID">quoteModal</field>
                                              <field name="MODE">showModal</field>
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
                              <field name="BG_COLOR">#0f172a</field>
                              <field name="RADIUS">20px</field>
                              <field name="CONTENT_ALIGN">right</field>
                              <field name="SHADOW">0 20px 30px -8px rgba(15,23,42,0.14)</field>
                              <data>{"GRADIENT":"linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)","BORDER_WIDTH":"2","BORDER_STYLE":"solid","BORDER_COLOR":"#6366f1","COLOR":"#ffffff"}</data>
                              <statement name="CHILDREN">
                                <block type="web_badge">
                                  <field name="TEXT">Business Pro ⭐ הכי נמכר</field>
                                  <field name="ELEMENT_ID">p2Badge</field>
                                  <field name="BG_COLOR">#4f46e5</field>
                                  <data>{"TEXT_COLOR":"#ffffff"}</data>
                                  <next>
                                    <block type="web_heading">
                                      <field name="TEXT">₪349 / חודש</field>
                                      <field name="TAG">h2</field>
                                      <field name="ELEMENT_ID">p2Price</field>
                                      <field name="ALIGN">right</field>
                                      <data>{"COLOR":"#ffffff"}</data>
                                      <next>
                                        <block type="web_list_container">
                                          <field name="LIST_TYPE">ul</field>
                                          <field name="MARKER">default</field>
                                          <data>{"COLOR":"#e2e8f0"}</data>
                                          <statement name="CHILDREN">
                                            <block type="web_list_item">
                                              <field name="TEXT">עמודים ללא הגבלה + אנימציות</field>
                                              <next>
                                                <block type="web_list_item">
                                                  <field name="TEXT">פורטל לקוחות + מערכת התחברות</field>
                                                  <next>
                                                    <block type="web_list_item">
                                                      <field name="TEXT">סנכרון Firebase Cloud DB</field>
                                                    </block>
                                                  </next>
                                                </block>
                                              </next>
                                            </block>
                                          </statement>
                                          <next>
                                            <block type="web_button">
                                              <field name="LABEL">התחל תקופת ניסיון 🚀</field>
                                              <data>{"GRADIENT":"linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"}</data>
                                              <statement name="DO">
                                                <block type="action_dialog_control">
                                                  <field name="TARGET_ID">quoteModal</field>
                                                  <field name="MODE">showModal</field>
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
                                  <field name="RADIUS">20px</field>
                                  <field name="CONTENT_ALIGN">right</field>
                                  <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                                  <statement name="CHILDREN">
                                    <block type="web_badge">
                                      <field name="TEXT">Enterprise</field>
                                      <field name="ELEMENT_ID">p3Badge</field>
                                      <field name="BG_COLOR">#d1fae5</field>
                                      <data>{"TEXT_COLOR":"#065f46"}</data>
                                      <next>
                                        <block type="web_heading">
                                          <field name="TEXT">₪790 / חודש</field>
                                          <field name="TAG">h2</field>
                                          <field name="ELEMENT_ID">p3Price</field>
                                          <field name="ALIGN">right</field>
                                          <next>
                                            <block type="web_list_container">
                                              <field name="LIST_TYPE">ul</field>
                                              <field name="MARKER">default</field>
                                              <statement name="CHILDREN">
                                                <block type="web_list_item">
                                                  <field name="TEXT">שרתי ענן ייעודיים + API</field>
                                                  <next>
                                                    <block type="web_list_item">
                                                      <field name="TEXT">ליווי מפתח אישי 24/7</field>
                                                      <next>
                                                        <block type="web_list_item">
                                                          <field name="TEXT">גיבויים אוטומטיים כל שעה</field>
                                                        </block>
                                                      </next>
                                                    </block>
                                                  </next>
                                                </block>
                                              </statement>
                                              <next>
                                                <block type="web_button_link">
                                                  <field name="LABEL">תיאום פגישה אישית 📞</field>
                                                  <field name="TARGET_PAGE">contact.html</field>
                                                  <data>{"BG_COLOR":"#0f172a"}</data>
                                                </block>
                                              </next>
                                            </block>
                                          </next>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </statement>
                      <next>
                        <block type="web_table">
                          <field name="CAPTION">📊 טבלת השוואת תכונות ומסלולים</field>
                          <statement name="CHILDREN">
                            <block type="web_table_section">
                              <field name="SECTION">thead</field>
                              <data>{"BG_COLOR":"#0f172a","COLOR":"#ffffff"}</data>
                              <statement name="CHILDREN">
                                <block type="web_table_row">
                                  <statement name="CHILDREN">
                                    <block type="web_table_cell">
                                      <field name="TAG">th</field>
                                      <field name="CONTENT">תכונה</field>
                                      <field name="COLSPAN">1</field>
                                      <field name="ROWSPAN">1</field>
                                      <next>
                                        <block type="web_table_cell">
                                          <field name="TAG">th</field>
                                          <field name="CONTENT">Starter</field>
                                          <field name="COLSPAN">1</field>
                                          <field name="ROWSPAN">1</field>
                                          <next>
                                            <block type="web_table_cell">
                                              <field name="TAG">th</field>
                                              <field name="CONTENT">Business Pro ⭐</field>
                                              <field name="COLSPAN">1</field>
                                              <field name="ROWSPAN">1</field>
                                            </block>
                                          </next>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                </block>
                              </statement>
                              <next>
                                <block type="web_table_section">
                                  <field name="SECTION">tbody</field>
                                  <statement name="CHILDREN">
                                    <block type="web_table_row">
                                      <statement name="CHILDREN">
                                        <block type="web_table_cell">
                                          <field name="TAG">td</field>
                                          <field name="CONTENT">חיבור לדאטה-בייס (SmartDB / Firebase)</field>
                                          <field name="COLSPAN">1</field>
                                          <field name="ROWSPAN">1</field>
                                          <next>
                                            <block type="web_table_cell">
                                              <field name="TAG">td</field>
                                              <field name="CONTENT">בסיסי (טפסים)</field>
                                              <field name="COLSPAN">1</field>
                                              <field name="ROWSPAN">1</field>
                                              <next>
                                                <block type="web_table_cell">
                                                  <field name="TAG">td</field>
                                                  <field name="CONTENT">מלא + אימות משתמשים ✅</field>
                                                  <field name="COLSPAN">1</field>
                                                  <field name="ROWSPAN">1</field>
                                                </block>
                                              </next>
                                            </block>
                                          </next>
                                        </block>
                                      </statement>
                                      <next>
                                        <block type="web_table_row">
                                          <statement name="CHILDREN">
                                            <block type="web_table_cell">
                                              <field name="TAG">td</field>
                                              <field name="CONTENT">רספונסיביות וסטודיו CSS3</field>
                                              <field name="COLSPAN">1</field>
                                              <field name="ROWSPAN">1</field>
                                              <next>
                                                <block type="web_table_cell">
                                                  <field name="TAG">td</field>
                                                  <field name="CONTENT">כן ✅</field>
                                                  <field name="COLSPAN">1</field>
                                                  <field name="ROWSPAN">1</field>
                                                  <next>
                                                    <block type="web_table_cell">
                                                      <field name="TAG">td</field>
                                                      <field name="CONTENT">מלא + מצבי Hover ומובייל ✅</field>
                                                      <field name="COLSPAN">1</field>
                                                      <field name="ROWSPAN">1</field>
                                                    </block>
                                                  </next>
                                                </block>
                                              </next>
                                            </block>
                                          </statement>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="web_details_accordion">
                              <field name="SUMMARY">❓ האם אפשר לעדכן חבילה או לחבר לדאטה-בייס פרטי בכל שלב?</field>
                              <field name="OPEN_DEFAULT">FALSE</field>
                              <statement name="CHILDREN">
                                <block type="web_paragraph">
                                  <field name="TEXT">בהחלט! ניתן לחבר את האתר ל-Firebase Realtime Database או לכל שרת REST API באמצעות בלוק החיבור בלחיצה אחת.</field>
                                  <field name="ELEMENT_ID">faqAns1</field>
                                  <field name="SIZE">14px</field>
                                </block>
                              </statement>
                              <next>
                                <block type="web_dialog_modal">
                                  <field name="ELEMENT_ID">quoteModal</field>
                                  <field name="OPEN_DEFAULT">FALSE</field>
                                  <statement name="CHILDREN">
                                    <block type="web_heading">
                                      <field name="TEXT">הצטרפות מהירה למסלול 🎉</field>
                                      <field name="TAG">h3</field>
                                      <field name="ELEMENT_ID">modalTitle</field>
                                      <field name="ALIGN">right</field>
                                      <next>
                                        <block type="web_paragraph">
                                          <field name="TEXT">ניתן להירשם מיידית דרך פורטל הלקוחות או להשאיר פרטים בעמוד צור קשר!</field>
                                          <field name="ELEMENT_ID">modalDesc</field>
                                          <field name="SIZE">14px</field>
                                          <next>
                                            <block type="web_row_flex">
                                              <field name="DIRECTION">row</field>
                                              <field name="JUSTIFY">flex-start</field>
                                              <statement name="CHILDREN">
                                                <block type="web_button_link">
                                                  <field name="LABEL">מעבר להרשמה בפורטל 🔑</field>
                                                  <field name="TARGET_PAGE">portal.html</field>
                                                  <next>
                                                    <block type="web_button">
                                                      <field name="LABEL">סגור</field>
                                                      <data>{"BG_COLOR":"#64748b"}</data>
                                                      <statement name="DO">
                                                        <block type="action_dialog_control">
                                                          <field name="TARGET_ID">quoteModal</field>
                                                          <field name="MODE">close</field>
                                                        </block>
                                                      </statement>
                                                    </block>
                                                  </next>
                                                </block>
                                              </statement>
                                            </block>
                                          </next>
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
                  </next>
                </block>
              </statement>
            </block>
          `)}
        </statement>
      </block>
    </xml>`
  },
  {
    id: 'portal',
    name: '🗄️ פורטל ודאטה-בייס',
    filename: 'portal.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="24" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">Heebo, sans-serif</field>
        <field name="ALIGN_ITEMS">center</field>
        <field name="SITE_WIDTH">1140px</field>
        <statement name="CHILDREN">
          ${buildStarterNavbarXml(`
            <block type="db_connect_config">
              <field name="DB_MODE">local</field>
              <field name="COLLECTION">projects</field>
              <field name="DB_URL">https://your-project-default-rtdb.firebaseio.com</field>
              <next>
                <block type="db_seed_data">
                  <field name="COLLECTION">projects</field>
                  <field name="JSON_DATA">[{"title":"אפליקציית משלוחים מהירה","client":"FoodExpress IL","plan":"Business Pro","budget":"4500"},{"title":"חנות אלקטרוניקה פרימיום","client":"TechZone","plan":"Enterprise","budget":"8900"},{"title":"דף נחיתה לקמפיין השקה","client":"NovaMarketing","plan":"Starter","budget":"2400"}]</field>
                  <next>
                    <block type="web_semantic_container">
                      <field name="TAG">main</field>
                      <field name="ELEMENT_ID">portalMain</field>
                      <data>{"PADDING":"10","GAP":"22"}</data>
                      <statement name="CHILDREN">
                        <block type="web_card">
                          <field name="BG_COLOR">#0f172a</field>
                          <field name="RADIUS">20px</field>
                          <field name="CONTENT_ALIGN">right</field>
                          <field name="SHADOW">0 20px 30px -8px rgba(15,23,42,0.14)</field>
                          <data>{"GRADIENT":"linear-gradient(135deg, #0f172a 0%, #0f766e 100%)","COLOR":"#ffffff"}</data>
                          <statement name="CHILDREN">
                            <block type="web_badge">
                              <field name="TEXT">SmartDB + Firebase Ready 🗄️</field>
                              <field name="ELEMENT_ID">dbTopBadge</field>
                              <field name="BG_COLOR">rgba(255,255,255,0.16)</field>
                              <data>{"TEXT_COLOR":"#99f6e4"}</data>
                              <next>
                                <block type="web_heading">
                                  <field name="TEXT">פורטל לקוחות וניהול מאגר נתונים חי</field>
                                  <field name="TAG">h1</field>
                                  <field name="ELEMENT_ID">portalH1</field>
                                  <field name="ALIGN">right</field>
                                  <data>{"COLOR":"#ffffff"}</data>
                                  <next>
                                    <block type="web_paragraph">
                                      <field name="TEXT">הירשם או התחבר כמשתמש אמיתי, הוסף פרויקטים ישירות לטבלת הנתונים וראה כל שינוי מתעדכן בזמן אמת!</field>
                                      <field name="ELEMENT_ID">portalSub</field>
                                      <field name="SIZE">15px</field>
                                      <data>{"COLOR":"#ccfbf1"}</data>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="web_grid_container">
                              <field name="GRID_COLS">repeat(auto-fit, minmax(300px, 1fr))</field>
                              <field name="GAP">22px</field>
                              <statement name="CHILDREN">
                                <block type="web_card">
                                  <field name="BG_COLOR">#ffffff</field>
                                  <field name="RADIUS">20px</field>
                                  <field name="CONTENT_ALIGN">right</field>
                                  <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                                  <statement name="CHILDREN">
                                    <block type="web_heading">
                                      <field name="TEXT">🔐 התחברות והרשמה למערכת</field>
                                      <field name="TAG">h2</field>
                                      <field name="ELEMENT_ID">authTitle</field>
                                      <field name="ALIGN">right</field>
                                      <next>
                                        <block type="web_form">
                                          <field name="FORM_TITLE">חשבון משתמש (נשמר ב-DB)</field>
                                          <field name="FORM_ID">authPortalForm</field>
                                          <statement name="CHILDREN">
                                            <block type="web_input_field">
                                              <field name="LABEL">שם מלא (להרשמה):</field>
                                              <field name="INPUT_ID">authName</field>
                                              <field name="TYPE">text</field>
                                              <field name="PLACEHOLDER">ישראל ישראלי</field>
                                              <field name="REQUIRED">false</field>
                                              <next>
                                                <block type="web_input_field">
                                                  <field name="LABEL">אימייל:</field>
                                                  <field name="INPUT_ID">authEmail</field>
                                                  <field name="TYPE">email</field>
                                                  <field name="PLACEHOLDER">user@company.com</field>
                                                  <field name="REQUIRED">true</field>
                                                  <next>
                                                    <block type="web_input_field">
                                                      <field name="LABEL">סיסמה:</field>
                                                      <field name="INPUT_ID">authPassword</field>
                                                      <field name="TYPE">password</field>
                                                      <field name="PLACEHOLDER">••••••</field>
                                                      <field name="REQUIRED">true</field>
                                                      <next>
                                                        <block type="web_row_flex">
                                                          <field name="DIRECTION">row</field>
                                                          <field name="JUSTIFY">flex-start</field>
                                                          <statement name="CHILDREN">
                                                            <block type="web_button">
                                                              <field name="LABEL">🔑 התחבר</field>
                                                              <statement name="DO">
                                                                <block type="db_auth_action">
                                                                  <field name="MODE">login</field>
                                                                  <field name="EMAIL_ID">authEmail</field>
                                                                  <field name="PASS_ID">authPassword</field>
                                                                  <field name="NAME_ID">authName</field>
                                                                  <field name="STATUS_ID">authStatusBox</field>
                                                                </block>
                                                              </statement>
                                                              <next>
                                                                <block type="web_button">
                                                                  <field name="LABEL">📝 הירשם כחדש</field>
                                                                  <data>{"BG_COLOR":"#0f766e"}</data>
                                                                  <statement name="DO">
                                                                    <block type="db_auth_action">
                                                                      <field name="MODE">register</field>
                                                                      <field name="EMAIL_ID">authEmail</field>
                                                                      <field name="PASS_ID">authPassword</field>
                                                                      <field name="NAME_ID">authName</field>
                                                                      <field name="STATUS_ID">authStatusBox</field>
                                                                    </block>
                                                                  </statement>
                                                                </block>
                                                              </next>
                                                            </block>
                                                          </statement>
                                                          <next>
                                                            <block type="web_output_box">
                                                              <field name="TITLE">סטטוס התחברות:</field>
                                                              <field name="OUTPUT_ID">authStatusBox</field>
                                                              <field name="DEFAULT_TEXT">הזן פרטים להרשמה או התחברות...</field>
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
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type="web_card">
                                      <field name="BG_COLOR">#ffffff</field>
                                      <field name="RADIUS">20px</field>
                                      <field name="CONTENT_ALIGN">right</field>
                                      <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                                      <statement name="CHILDREN">
                                        <block type="web_heading">
                                          <field name="TEXT">➕ שמור רשומה חדשה לדאטה-בייס</field>
                                          <field name="TAG">h2</field>
                                          <field name="ELEMENT_ID">addRecTitle</field>
                                          <field name="ALIGN">right</field>
                                          <next>
                                            <block type="web_form">
                                              <field name="FORM_TITLE">פרויקט חדש בטבלת projects</field>
                                              <field name="FORM_ID">newProjectForm</field>
                                              <statement name="CHILDREN">
                                                <block type="web_input_field">
                                                  <field name="LABEL">שם הפרויקט:</field>
                                                  <field name="INPUT_ID">title</field>
                                                  <field name="TYPE">text</field>
                                                  <field name="PLACEHOLDER">לדוגמה: אתר מכירות VIP</field>
                                                  <field name="REQUIRED">true</field>
                                                  <next>
                                                    <block type="web_input_field">
                                                      <field name="LABEL">שם הלקוח:</field>
                                                      <field name="INPUT_ID">client</field>
                                                      <field name="TYPE">text</field>
                                                      <field name="PLACEHOLDER">חברת אלפא בע"מ</field>
                                                      <field name="REQUIRED">true</field>
                                                      <next>
                                                        <block type="web_label">
                                                          <field name="TEXT">מסלול נבחר:</field>
                                                          <field name="FOR_ID">plan</field>
                                                          <next>
                                                            <block type="web_select_container">
                                                              <field name="ELEMENT_ID">plan</field>
                                                              <field name="NAME">plan</field>
                                                              <field name="REQUIRED">TRUE</field>
                                                              <statement name="CHILDREN">
                                                                <block type="web_select_option">
                                                                  <field name="LABEL">Business Pro ⭐</field>
                                                                  <field name="VALUE">Business Pro</field>
                                                                  <field name="SELECTED">TRUE</field>
                                                                  <next>
                                                                    <block type="web_select_option">
                                                                      <field name="LABEL">Starter</field>
                                                                      <field name="VALUE">Starter</field>
                                                                      <field name="SELECTED">FALSE</field>
                                                                      <next>
                                                                        <block type="web_select_option">
                                                                          <field name="LABEL">Enterprise Cloud</field>
                                                                          <field name="VALUE">Enterprise</field>
                                                                          <field name="SELECTED">FALSE</field>
                                                                        </block>
                                                                      </next>
                                                                    </block>
                                                                  </next>
                                                                </block>
                                                              </statement>
                                                              <next>
                                                                <block type="web_slider_input">
                                                                  <field name="LABEL">תקציב משוער (₪):</field>
                                                                  <field name="INPUT_ID">budget</field>
                                                                  <field name="MIN">1500</field>
                                                                  <field name="MAX">15000</field>
                                                                  <field name="VALUE">5000</field>
                                                                  <next>
                                                                    <block type="web_submit_button">
                                                                      <field name="LABEL">💾 שמור בדאטה-בייס ורענן</field>
                                                                      <statement name="DO">
                                                                        <block type="db_save_record">
                                                                          <field name="COLLECTION">projects</field>
                                                                          <field name="FIELD_IDS">title,client,plan,budget</field>
                                                                          <field name="STATUS_ID">dbStatusOut</field>
                                                                          <field name="TARGET_ID">dbRecordsFeed</field>
                                                                        </block>
                                                                      </statement>
                                                                      <next>
                                                                        <block type="web_output_box">
                                                                          <field name="TITLE">תוצאת שמירה:</field>
                                                                          <field name="OUTPUT_ID">dbStatusOut</field>
                                                                          <field name="DEFAULT_TEXT">מוכן לשמירת רשומה חדשה...</field>
                                                                        </block>
                                                                      </next>
                                                                    </block>
                                                                  </next>
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
                                            </block>
                                          </next>
                                        </block>
                                      </statement>
                                    </block>
                                  </next>
                                </block>
                              </statement>
                              <next>
                                <block type="web_card">
                                  <field name="BG_COLOR">#ffffff</field>
                                  <field name="RADIUS">20px</field>
                                  <field name="CONTENT_ALIGN">right</field>
                                  <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                                  <statement name="CHILDREN">
                                    <block type="web_heading">
                                      <field name="TEXT">📊 פרויקטים חיים מתוך הדאטה-בייס (projects)</field>
                                      <field name="TAG">h2</field>
                                      <field name="ELEMENT_ID">dbFeedHeading</field>
                                      <field name="ALIGN">right</field>
                                      <next>
                                        <block type="db_render_list">
                                          <field name="COLLECTION">projects</field>
                                          <field name="TARGET_ID">dbRecordsFeed</field>
                                          <field name="VIEW_MODE">cards</field>
                                          <field name="ALLOW_DELETE">TRUE</field>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          `)}
        </statement>
      </block>
    </xml>`
  },
  {
    id: 'contact',
    name: '📞 צור קשר',
    filename: 'contact.html',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="24" y="20">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">Heebo, sans-serif</field>
        <field name="ALIGN_ITEMS">center</field>
        <field name="SITE_WIDTH">1140px</field>
        <statement name="CHILDREN">
          ${buildStarterNavbarXml(`
            <block type="db_connect_config">
              <field name="DB_MODE">local</field>
              <field name="COLLECTION">leads</field>
              <field name="DB_URL">https://your-project-default-rtdb.firebaseio.com</field>
              <next>
                <block type="web_card">
                  <field name="BG_COLOR">#ffffff</field>
                  <field name="RADIUS">20px</field>
                  <field name="CONTENT_ALIGN">right</field>
                  <field name="SHADOW">0 4px 12px rgba(15,23,42,0.08)</field>
                  <statement name="CHILDREN">
                    <block type="web_heading">
                      <field name="TEXT">נשמח לבנות יחד את האתר הבא שלך! 📞</field>
                      <field name="TAG">h1</field>
                      <field name="ELEMENT_ID">contactH1</field>
                      <field name="ALIGN">right</field>
                      <next>
                        <block type="web_form">
                          <field name="FORM_TITLE">שליחת פנייה ישירות למאגר הלידים</field>
                          <field name="FORM_ID">contactForm</field>
                          <statement name="CHILDREN">
                            <block type="web_fieldset">
                              <field name="LEGEND">פרטי יצירת קשר</field>
                              <statement name="CHILDREN">
                                <block type="web_input_field">
                                  <field name="LABEL">שם מלא:</field>
                                  <field name="INPUT_ID">leadName</field>
                                  <field name="TYPE">text</field>
                                  <field name="PLACEHOLDER">הקלד שם מלא...</field>
                                  <field name="REQUIRED">true</field>
                                  <next>
                                    <block type="web_input_field">
                                      <field name="LABEL">אימייל:</field>
                                      <field name="INPUT_ID">leadEmail</field>
                                      <field name="TYPE">email</field>
                                      <field name="PLACEHOLDER">name@company.com</field>
                                      <field name="REQUIRED">true</field>
                                      <next>
                                        <block type="web_input_field">
                                          <field name="LABEL">תאריך יעד להשקה:</field>
                                          <field name="INPUT_ID">launchDate</field>
                                          <field name="TYPE">date</field>
                                          <field name="PLACEHOLDER"></field>
                                          <field name="REQUIRED">false</field>
                                          <next>
                                            <block type="web_textarea">
                                              <field name="LABEL">תיאור הפרויקט:</field>
                                              <field name="INPUT_ID">leadMsg</field>
                                              <field name="PLACEHOLDER">ספר לנו על העסק והיעדים שלך...</field>
                                              <next>
                                                <block type="web_row_flex">
                                                  <field name="DIRECTION">row</field>
                                                  <field name="JUSTIFY">flex-start</field>
                                                  <statement name="CHILDREN">
                                                    <block type="web_submit_button">
                                                      <field name="LABEL">💾 שלח ושמור בדאטה-בייס 🚀</field>
                                                      <statement name="DO">
                                                        <block type="db_save_record">
                                                          <field name="COLLECTION">leads</field>
                                                          <field name="FIELD_IDS">leadName,leadEmail,launchDate,leadMsg</field>
                                                          <field name="STATUS_ID">contactDbOut</field>
                                                          <field name="TARGET_ID">leadsFeed</field>
                                                        </block>
                                                      </statement>
                                                      <next>
                                                        <block type="web_whatsapp_button">
                                                          <field name="PHONE">0501234567</field>
                                                          <field name="LABEL">שיחה מהירה ב-WhatsApp 💬</field>
                                                        </block>
                                                      </next>
                                                    </block>
                                                  </statement>
                                                  <next>
                                                    <block type="web_output_box">
                                                      <field name="TITLE">סטטוס פנייה:</field>
                                                      <field name="OUTPUT_ID">contactDbOut</field>
                                                      <field name="DEFAULT_TEXT">ממתין לשליחת הפנייה...</field>
                                                    </block>
                                                  </next>
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
                            </block>
                          </statement>
                          <next>
                            <block type="web_heading">
                              <field name="TEXT">📋 פניות אחרונות שנשמרו בדאטה-בייס</field>
                              <field name="TAG">h3</field>
                              <field name="ELEMENT_ID">leadsHeading</field>
                              <field name="ALIGN">right</field>
                              <next>
                                <block type="db_render_list">
                                  <field name="COLLECTION">leads</field>
                                  <field name="TARGET_ID">leadsFeed</field>
                                  <field name="VIEW_MODE">table</field>
                                  <field name="ALLOW_DELETE">TRUE</field>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          `)}
        </statement>
      </block>
    </xml>`
  }
];

function WebBlocks() {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  const iframeRef = useRef(null);
  const fileInputRef = useRef(null);
  const projectImageInputRef = useRef(null);

  const [localProjectImages, setLocalProjectImages] = useState(() => {
    try {
      const saved = localStorage.getItem('smartstart_project_images_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smartstart_project_images_v1', JSON.stringify(localProjectImages));
    } catch {}
  }, [localProjectImages]);

  // Multi-page Website State
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState('index');
  const pagesXmlRef = useRef({});

  // Studio Mode: false = Build Mode (Right: Blockly, Left: Preview), true = Design Studio Mode (Right: Large Live Site, Left: Design Controls)
  const [isDesignStudioMode, setIsDesignStudioMode] = useState(false);
  // Dedicated Live Code IDE Mode (Pure Code without Blocks + Live Preview)
  const [isLiveCodeMode, setIsLiveCodeMode] = useState(false);
  const [codeIdeMode, setCodeIdeMode] = useState('full'); // 'full' (single HTML doc) | 'tabs' (HTML + CSS + JS tabs)
  const [activeCodeTab, setActiveCodeTab] = useState('html'); // 'html' | 'css' | 'js'
  const [tabHtml, setTabHtml] = useState(
    `<div class="hero-card">\n  <span class="badge">✨ נבנה בקוד חי</span>\n  <h1>ברוכים הבאים לאתר שלי! 🚀</h1>\n  <p>כאן אפשר לכתוב קוד HTML, CSS ו-JavaScript חופשי ולראות את התוצאה בזמן אמת.</p>\n  <button onclick="celebrateClick()">לחץ להפעלת אפקט ⚡</button>\n  <div id="output-msg"></div>\n</div>`
  );
  const [tabCss, setTabCss] = useState(
    `body {\n  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);\n  color: #ffffff;\n  font-family: 'Heebo', sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  padding: 24px;\n}\n\n.hero-card {\n  background: rgba(255, 255, 255, 0.08);\n  backdrop-filter: blur(14px);\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  border-radius: 24px;\n  padding: 42px;\n  max-width: 680px;\n  width: 100%;\n  text-align: center;\n  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);\n}\n\n.badge {\n  background: #7c3aed;\n  color: #fff;\n  padding: 6px 16px;\n  border-radius: 999px;\n  font-weight: 800;\n  font-size: 0.85rem;\n  display: inline-block;\n  margin-bottom: 16px;\n}\n\nh1 {\n  font-size: 2.5rem;\n  margin: 0 0 14px 0;\n}\n\np {\n  color: #cbd5e1;\n  font-size: 1.1rem;\n  line-height: 1.6;\n  margin-bottom: 24px;\n}\n\nbutton {\n  background: linear-gradient(135deg, #2563eb, #7c3aed);\n  color: #ffffff;\n  border: none;\n  padding: 13px 28px;\n  border-radius: 12px;\n  font-size: 1rem;\n  font-weight: 800;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\nbutton:hover {\n  transform: scale(1.06);\n}\n\n#output-msg {\n  margin-top: 18px;\n  font-weight: 700;\n  color: #38bdf8;\n}`
  );
  const [tabJs, setTabJs] = useState(
    `function celebrateClick() {\n  const out = document.getElementById('output-msg');\n  if (out) {\n    out.innerText = '🎉 כל הכבוד! הקוד שלך פועל בזמן אמת!';\n  }\n}`
  );

  // Themes & Starter Templates Modal
  const [showThemesModal, setShowThemesModal] = useState(false);
  // Active dropdown menu in the single top header ('pages' | 'tools' | 'file' | 'view' | 'snippets' | null)
  const [openHeaderMenu, setOpenHeaderMenu] = useState(null);

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const lastSelectedBlockRef = useRef(null);
  const prevGeneratedCodeRef = useRef('');

  // Left Panel Sub-tab when in Build Mode: 'preview' (Live Site)
  const [leftBuildTab, setLeftBuildTab] = useState('preview');
  
  // Responsive Device Viewport in Preview: 'desktop' | 'tablet' | 'mobile'
  const [deviceView, setDeviceView] = useState('desktop');

  // Full Screen Canvas Toggle: true = 100% Canvas (Focus Mode), false = Split Screen
  const [isFullCanvas, setIsFullCanvas] = useState(false);
  // Full Screen Live Preview Toggle: true = 100% Live Site Preview, false = Split Screen
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [, setDesignPropVersion] = useState(0);
  const [blockSearchQuery, setBlockSearchQuery] = useState('');
  const [, setLayerRevision] = useState(0);

  // Build hierarchical element tree for the Layers Inspector tab
  const layerNodes = (() => {
    if (!workspace.current) return [];
    const result = [];
    const describeBlock = (blk) => {
      const searchLabel = (WEB_BLOCK_SEARCH_LABELS[blk.type] || '').split(' ').slice(0, 3).join(' ');
      const textVal =
        blk.getFieldValue?.('TEXT') ||
        blk.getFieldValue?.('TITLE') ||
        blk.getFieldValue?.('LABEL') ||
        blk.getFieldValue?.('SUMMARY') ||
        blk.getFieldValue?.('TAG') ||
        blk.getFieldValue?.('ELEMENT_ID') ||
        '';
      const cleanSnippet = String(textVal).trim().slice(0, 26);
      return cleanSnippet ? `${searchLabel || blk.type}: "${cleanSnippet}"` : (searchLabel || blk.type);
    };
    const walkChain = (firstBlock, depth) => {
      let cur = firstBlock;
      while (cur) {
        result.push({ id: cur.id, type: cur.type, label: describeBlock(cur), depth });
        const childrenConn = cur.getInput?.('CHILDREN')?.connection || cur.getInput?.('DO')?.connection;
        const firstChild = childrenConn && childrenConn.targetBlock ? childrenConn.targetBlock() : null;
        if (firstChild) walkChain(firstChild, depth + 1);
        cur = cur.nextConnection && cur.nextConnection.targetBlock ? cur.nextConnection.targetBlock() : null;
      }
    };
    workspace.current.getTopBlocks(true).forEach((top) => walkChain(top, 0));
    return result;
  })();

  // Generated HTML Code for active page
  const [code, setCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploadBanner, setUploadBanner] = useState(null);

  // AI Web Block Generator Modal State
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false);
  const [inlineAiPrompt, setInlineAiPrompt] = useState('');
  const [isGeneratingInlineBlock, setIsGeneratingInlineBlock] = useState(false);

  // Helper to get active page object
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // Sync block.customProperties into block.data so Blockly XML natively serializes all Design Studio styles
  const syncWorkspaceCustomPropsToData = () => {
    if (!workspace.current) return;
    try {
      const allBlocks = workspace.current.getAllBlocks(false);
      allBlocks.forEach(b => {
        if (b.customProperties && typeof b.customProperties === 'object' && Object.keys(b.customProperties).length > 0) {
          b.data = JSON.stringify(b.customProperties);
        }
      });
    } catch (e) {}
  };

  // Hydrate block.customProperties from block.data after loading XML into Blockly workspace
  const hydrateWorkspaceCustomPropsFromData = () => {
    if (!workspace.current) return;
    try {
      const allBlocks = workspace.current.getAllBlocks(false);
      allBlocks.forEach(b => {
        if (b.data) {
          try {
            const parsed = JSON.parse(b.data);
            if (parsed && typeof parsed === 'object') {
              b.customProperties = { ...(b.customProperties || {}), ...parsed };
            }
          } catch (err) {}
        }
      });
    } catch (e) {}
  };

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
        syncWorkspaceCustomPropsToData();
        const dom = Blockly.Xml.workspaceToDom(workspace.current);
        const xmlText = Blockly.Xml.domToText(dom);
        pagesXmlRef.current[activePageId] = xmlText;
        return xmlText;
      } catch (e) {
        console.warn(e);
      }
    }
    return '';
  };

  // Update HTML Code function with Built-in Universal Responsive Engine & Embedded State Metadata
  const updateCode = (force = false) => {
    if (!workspace.current) return;
    syncWorkspaceCustomPropsToData();
    const generated = javascriptGenerator.workspaceToCode(workspace.current);
    const dynamicCssRules = generateDynamicCssForWorkspace(workspace.current);
    const docSignature = `${generated}\n/*CSS*/\n${dynamicCssRules}`;
    if (!force && docSignature === prevGeneratedCodeRef.current) {
      return; // Do NOT reload iframe if code & CSS haven't changed!
    }
    prevGeneratedCodeRef.current = docSignature;
    setLayerRevision((v) => v + 1);

    // Serialize current Blockly XML so downloaded HTML files can be uploaded back for 100% lossless editing
    let embeddedStateComment = '';
    try {
      const dom = Blockly.Xml.workspaceToDom(workspace.current);
      const xmlText = Blockly.Xml.domToText(dom);
      if (activePageId) {
        pagesXmlRef.current[activePageId] = xmlText;
      }
      const encoded = encodeWebBlocksState({
        xml: xmlText,
        pageId: activePage.id,
        pageName: activePage.name,
        filename: activePage.filename
      });
      if (encoded) {
        embeddedStateComment = `\n  <!-- WEBBLOCKS_STATE_V1:${encoded} -->`;
      }
    } catch (e) {}

    const fullDoc = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${activePage.name} - ${activePage.filename}</title>
  <!-- 🔤 Google Fonts for Hebrew & Modern Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&family=Fredoka:wght@400;500;600;700&family=Heebo:wght@300;400;500;700;800;900&family=Karantina:wght@400;700&family=Rubik:wght@300;400;500;700;900&family=Secular+One&family=Varela+Round&display=swap" rel="stylesheet">
  <!-- 🎨 FontAwesome 6 Icons & Animate.css Design Libraries -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  <style>
    /* =========================================================================
       🌐 SmartStart WebBlocks Pro - מנוע עיצוב, מרכוז אוטומטי והתאמה לכל המסכים
       מתאים אוטומטית למסכי מחשב רחבים, לפטופים, טאבלטים וכל סוגי הסמארטפונים
       ========================================================================= */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      scroll-behavior: smooth;
      font-family: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      -webkit-text-size-adjust: 100%;
    }
    button, input, select, textarea { font-family: inherit; max-width: 100%; }
    img, video, iframe, canvas, svg { max-width: 100%; height: auto; }
    div[data-block-id], section[data-block-id], form[data-block-id], nav[data-block-id], footer[data-block-id], details[data-block-id] {
      max-width: 100%;
    }

    /* 🎯 מרכוז אוטומטי של כל חלקי האתר באמצע המסך (מונע היצמדות לימין במסכים רחבים) */
    body > div[data-block-id] > div[data-block-id],
    body > div[data-block-id] > section[data-block-id],
    body > div[data-block-id] > nav[data-block-id],
    body > div[data-block-id] > footer[data-block-id],
    body > div[data-block-id] > form[data-block-id],
    body > div[data-block-id] > details[data-block-id] {
      max-width: var(--site-max-width, 1140px);
      width: 100%;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    /* כרטיסיות בתוך רשת עמודות (Grid) מתפרסות על העמודה שלהן */
    .wb-grid-container > div[data-block-id] {
      margin: 0 !important;
      max-width: 100% !important;
      height: 100%;
    }

    /* סרגל ניווט גמיש: מונע שורה שבורה כשמכניסים קבוצת Flex של קישורים */
    .wb-navbar-custom {
      flex-wrap: wrap !important;
      gap: 12px 20px !important;
    }
    .wb-navbar-custom > div[data-block-id] {
      width: auto !important;
      flex: 0 1 auto;
    }

    /* מניעת מתיחה של תגיות וכפתורים לרוחב 100% של הכרטיסייה */
    span[id^="badge_"], a[data-block-id] {
      width: fit-content !important;
    }

    /* כאשר כרטיסייה מוגדרת עם יישור למרכז - ממרכזים גם את הכותרות והפסקאות שבתוכה */
    .wb-card[style*="text-align: center"] h1,
    .wb-card[style*="text-align: center"] h2,
    .wb-card[style*="text-align: center"] h3,
    .wb-card[style*="text-align: center"] h4,
    .wb-card[style*="text-align: center"] p {
      text-align: center !important;
    }
    .wb-card[style*="text-align: center"] > div[data-block-id] {
      justify-content: center;
    }

    /* 📟 טאבלטים ומסכים בינוניים (Tablet <= 1024px) */
    @media screen and (max-width: 1024px) {
      body > div[data-block-id] {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      div[style*="display: flex"] {
        flex-wrap: wrap !important;
      }
    }

    /* 📱 סמארטפונים ומסכים ניידים (Mobile <= 768px) */
    @media screen and (max-width: 768px) {
      body > div[data-block-id] {
        padding: 14px 12px !important;
      }
      h1 {
        font-size: clamp(1.5rem, 6vw, 2.05rem) !important;
        line-height: 1.3 !important;
        word-break: break-word;
      }
      h2 {
        font-size: clamp(1.28rem, 5vw, 1.65rem) !important;
        line-height: 1.35 !important;
        word-break: break-word;
      }
      h3 {
        font-size: clamp(1.12rem, 4.5vw, 1.35rem) !important;
        line-height: 1.4 !important;
      }
      p, li, label, span {
        word-break: break-word;
      }
      nav[data-block-id] {
        padding: 12px 14px !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
      }
      div[data-block-id][style*="padding: 24px"],
      div[data-block-id][style*="padding: 28px"],
      div[data-block-id][style*="padding: 32px"],
      section[data-block-id],
      form[data-block-id] {
        padding: 20px 16px !important;
      }
      div[style*="display: flex"] {
        flex-wrap: wrap !important;
        gap: 12px !important;
      }
      iframe {
        min-height: 220px !important;
        height: auto !important;
        aspect-ratio: 16 / 9;
      }
    }

    /* 📱 מסכים קטנים במיוחד (Small Mobile <= 480px) */
    @media screen and (max-width: 480px) {
      body > div[data-block-id] {
        padding: 10px 8px !important;
      }
      div[style*="display: flex"] > button,
      div[style*="display: flex"] > a[data-block-id] {
        flex: 1 1 100% !important;
        width: 100% !important;
        justify-content: center !important;
        text-align: center !important;
      }
      button[data-block-id], a[data-block-id][style*="padding"] {
        min-height: 44px;
      }
    }

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
  <style id="wb-dynamic-css">
    ${dynamicCssRules}
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

    // 🗄️ SmartDB Runtime Engine (LocalStorage Persistent DB + Optional Firebase/REST Sync + Auth)
    window.smartDB = (function() {
      var cfg = { mode: 'local', url: '', collection: 'projects' };
      var views = {};
      var sessionWidgets = {};
      var LABEL_MAP = {
        title: 'כותרת',
        client: 'לקוח',
        plan: 'מסלול',
        budget: 'תקציב',
        leadName: 'שם',
        leadEmail: 'אימייל',
        launchDate: 'יעד השקה',
        leadMsg: 'הודעה',
        newProjTitle: 'פרויקט',
        newProjClient: 'לקוח',
        newProjPlan: 'מסלול',
        newProjBudget: 'תקציב',
        name: 'שם',
        email: 'אימייל',
        role: 'תפקיד',
        createdAt: 'תאריך'
      };

      function esc(v) {
        return String(v === undefined || v === null ? '' : v)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function keyOf(col) {
        return 'wb_smartdb_' + col;
      }

      function readCol(col) {
        try {
          var raw = localStorage.getItem(keyOf(col));
          var parsed = raw ? JSON.parse(raw) : [];
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }

      function writeCol(col, rows) {
        try {
          localStorage.setItem(keyOf(col), JSON.stringify(rows || []));
        } catch (e) {}
        notifyCollection(col);
      }

      function setStatus(statusId, msg) {
        if (!statusId) return;
        smartSetText(statusId, msg);
      }

      function isRemoteConfigured() {
        return (cfg.mode === 'firebase' || cfg.mode === 'rest') &&
          cfg.url &&
          cfg.url.indexOf('http') === 0 &&
          cfg.url.indexOf('your-project-default-rtdb') === -1;
      }

      function remoteEndpoint(col) {
        var cleanUrl = String(cfg.url || '');
        while (cleanUrl.slice(-1) === '/') cleanUrl = cleanUrl.slice(0, -1);
        return cfg.mode === 'firebase'
          ? cleanUrl + '/' + encodeURIComponent(col) + '.json'
          : cleanUrl + '/' + encodeURIComponent(col);
      }

      function syncRemoteFetch(col) {
        if (!isRemoteConfigured() || typeof fetch !== 'function') return;
        fetch(remoteEndpoint(col))
          .then(function(res) { return res.ok ? res.json() : null; })
          .then(function(data) {
            if (!data) return;
            var list = Array.isArray(data)
              ? data
              : Object.keys(data).map(function(k) {
                  var item = data[k] || {};
                  if (!item.id) item.id = k;
                  return item;
                });
            if (list.length > 0) writeCol(col, list);
          })
          .catch(function() {});
      }

      function syncRemoteSave(col, record) {
        if (!isRemoteConfigured() || typeof fetch !== 'function') return;
        fetch(remoteEndpoint(col), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        }).catch(function() {});
      }

      function renderView(targetId) {
        var spec = views[targetId];
        var container = document.getElementById(targetId);
        if (!spec || !container) return;
        var rows = readCol(spec.collection);
        if (!rows.length) {
          container.innerHTML = '<div style="padding:20px;border:1px dashed #cbd5e1;border-radius:14px;text-align:center;color:#64748b;background:#f8fafc;font-weight:600;">אין עדיין רשומות במאגר "' + esc(spec.collection) + '".</div>';
          return;
        }

        var skipKeys = { id: true, pass: true };
        if (spec.viewMode === 'table') {
          var cols = [];
          rows.forEach(function(r) {
            Object.keys(r).forEach(function(k) {
              if (!skipKeys[k] && cols.indexOf(k) === -1) cols.push(k);
            });
          });
          var html = '<div style="overflow-x:auto;border:1px solid #cbd5e1;border-radius:14px;background:#ffffff;box-shadow:0 4px 14px rgba(15,23,42,0.06);">' +
            '<table style="width:100%;border-collapse:collapse;text-align:right;font-size:0.9rem;">' +
            '<thead><tr style="background:#0f172a;color:#ffffff;">';
          cols.forEach(function(c) {
            html += '<th style="padding:11px 14px;font-weight:800;">' + esc(LABEL_MAP[c] || c) + '</th>';
          });
          if (spec.allowDelete) html += '<th style="padding:11px 14px;width:72px;text-align:center;">פעולות</th>';
          html += '</tr></thead><tbody>';
          rows.forEach(function(r, idx) {
            var rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
            html += '<tr style="background:' + rowBg + ';border-top:1px solid #e2e8f0;">';
            cols.forEach(function(c) {
              html += '<td style="padding:10px 14px;color:#1e293b;">' + esc(r[c] || '-') + '</td>';
            });
            if (spec.allowDelete) {
              html += '<td style="padding:8px 12px;text-align:center;">' +
                '<button type="button" data-col="' + esc(spec.collection) + '" data-rec-id="' + esc(r.id) + '" onclick="window.smartDB.deleteFromBtn(this)" style="border:none;background:#fee2e2;color:#b91c1c;padding:5px 10px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.78rem;">מחק</button>' +
                '</td>';
            }
            html += '</tr>';
          });
          html += '</tbody></table></div>';
          container.innerHTML = html;
          return;
        }

        var cardsHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;width:100%;">';
        rows.forEach(function(r) {
          var titleKey = r.title ? 'title' : (r.newProjTitle ? 'newProjTitle' : Object.keys(r).find(function(k) { return !skipKeys[k] && k !== 'createdAt'; }));
          var headingVal = titleKey ? r[titleKey] : 'רשומה';
          cardsHtml += '<div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;box-shadow:0 6px 16px rgba(15,23,42,0.06);display:flex;flex-direction:column;gap:8px;justify-content:space-between;">';
          cardsHtml += '<div><div style="font-weight:800;font-size:1.02rem;color:#0f172a;margin-bottom:8px;">' + esc(headingVal) + '</div>';
          Object.keys(r).forEach(function(k) {
            if (skipKeys[k] || k === titleKey) return;
            cardsHtml += '<div style="font-size:0.86rem;color:#475569;margin-bottom:3px;"><strong style="color:#0f172a;">' + esc(LABEL_MAP[k] || k) + ':</strong> ' + esc(r[k]) + '</div>';
          });
          cardsHtml += '</div>';
          if (spec.allowDelete) {
            cardsHtml += '<div style="display:flex;justify-content:flex-end;padding-top:6px;border-top:1px solid #f1f5f9;">' +
              '<button type="button" data-col="' + esc(spec.collection) + '" data-rec-id="' + esc(r.id) + '" onclick="window.smartDB.deleteFromBtn(this)" style="border:1px solid #fecaca;background:#fff1f2;color:#be123c;padding:4px 10px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.78rem;">🗑️ מחק</button>' +
              '</div>';
          }
          cardsHtml += '</div>';
        });
        cardsHtml += '</div>';
        container.innerHTML = cardsHtml;
      }

      function notifyCollection(col) {
        Object.keys(views).forEach(function(targetId) {
          if (views[targetId].collection === col) {
            renderView(targetId);
          }
        });
      }

      function readSession() {
        try {
          var raw = localStorage.getItem('wb_smartdb_session');
          return raw ? JSON.parse(raw) : null;
        } catch (e) {
          return null;
        }
      }

      function renderSessionWidget(wid) {
        var el = document.getElementById(wid);
        if (!el) return;
        var portalUrl = sessionWidgets[wid] || 'portal.html';
        var sess = readSession();
        if (sess && sess.email) {
          el.innerHTML = '<span>🟢 מחובר: <strong>' + esc(sess.name || sess.email) + '</strong></span>' +
            '<button type="button" onclick="window.smartDB.logout()" style="border:none;background:rgba(255,255,255,0.2);color:#ffffff;padding:2px 8px;border-radius:999px;cursor:pointer;font-size:0.75rem;font-weight:700;">התנתק</button>';
        } else {
          el.innerHTML = '<a href="' + esc(portalUrl) + '" onclick="return window.smartDB.navTo(this,event)" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:700;">🔑 התחברות / פורטל</a>';
        }
      }

      function notifySessions() {
        Object.keys(sessionWidgets).forEach(renderSessionWidget);
      }

      return {
        configure: function(opts) {
          if (opts) {
            cfg.mode = opts.mode || 'local';
            cfg.url = opts.url || '';
            cfg.collection = opts.collection || 'projects';
          }
          if (isRemoteConfigured()) {
            syncRemoteFetch(cfg.collection);
          }
        },
        seed: function(col, rawJson) {
          if (!col || readCol(col).length > 0) return;
          try {
            var arr = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
            if (!Array.isArray(arr)) return;
            var prepared = arr.map(function(item, i) {
              var copy = Object.assign({}, item);
              if (!copy.id) copy.id = 'seed_' + Date.now() + '_' + i;
              if (!copy.createdAt) copy.createdAt = new Date().toLocaleDateString('he-IL');
              return copy;
            });
            writeCol(col, prepared);
          } catch (e) {}
        },
        getAll: readCol,
        saveFromInputs: function(col, fieldIdsCsv, statusId, targetId) {
          var ids = String(fieldIdsCsv || '').split(',').map(function(s) { return s.trim(); }).filter(Boolean);
          var rec = {
            id: 'rec_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            createdAt: new Date().toLocaleDateString('he-IL')
          };
          var hasVal = false;
          ids.forEach(function(fid) {
            var el = document.getElementById(fid);
            if (!el) return;
            var val = el.type === 'checkbox' ? (el.checked ? 'כן' : 'לא') : String(el.value || '').trim();
            if (val) hasVal = true;
            rec[fid] = val;
          });
          if (!hasVal) {
            setStatus(statusId, '⚠️ אנא מלא לפחות שדה אחד לפני השמירה.');
            return;
          }
          var nextRows = [rec].concat(readCol(col));
          writeCol(col, nextRows);
          syncRemoteSave(col, rec);
          ids.forEach(function(fid) {
            var el = document.getElementById(fid);
            if (el && el.tagName !== 'SELECT' && el.type !== 'checkbox') el.value = '';
          });
          if (targetId && views[targetId]) renderView(targetId);
          setStatus(statusId, '✅ הרשומה נשמרה בהצלחה במאגר "' + col + '" (' + nextRows.length + ' רשומות)!');
        },
        deleteRecord: function(col, recId) {
          var nextRows = readCol(col).filter(function(r) { return String(r.id) !== String(recId); });
          writeCol(col, nextRows);
        },
        mountView: function(col, targetId, opts) {
          views[targetId] = {
            collection: col || 'projects',
            viewMode: (opts && opts.viewMode) || 'cards',
            allowDelete: !(opts && opts.allowDelete === false)
          };
          renderView(targetId);
          if (isRemoteConfigured()) syncRemoteFetch(col);
        },
        authAction: function(opts) {
          var mode = (opts && opts.mode) || 'login';
          var statusId = opts && opts.statusId;
          if (mode === 'logout') {
            try { localStorage.removeItem('wb_smartdb_session'); } catch (e) {}
            notifySessions();
            setStatus(statusId, '👋 התנתקת מהמערכת בהצלחה.');
            return;
          }
          var emailEl = opts && opts.emailId ? document.getElementById(opts.emailId) : null;
          var passEl = opts && opts.passId ? document.getElementById(opts.passId) : null;
          var nameEl = opts && opts.nameId ? document.getElementById(opts.nameId) : null;
          var email = emailEl ? String(emailEl.value || '').trim().toLowerCase() : '';
          var pass = passEl ? String(passEl.value || '').trim() : '';
          var fullName = nameEl ? String(nameEl.value || '').trim() : '';
          if (!email || !pass) {
            setStatus(statusId, '⚠️ יש להזין כתובת אימייל וסיסמה.');
            return;
          }
          var users = readCol('users');
          if (mode === 'register') {
            var exists = users.some(function(u) { return String(u.email || '').toLowerCase() === email; });
            if (exists) {
              setStatus(statusId, '⚠️ משתמש עם האימייל הזה כבר רשום — לחץ על התחברות.');
              return;
            }
            var newUser = {
              id: 'usr_' + Date.now(),
              name: fullName || email.split('@')[0],
              email: email,
              pass: pass,
              role: 'חבר רשום',
              createdAt: new Date().toLocaleDateString('he-IL')
            };
            writeCol('users', [newUser].concat(users));
            try {
              localStorage.setItem('wb_smartdb_session', JSON.stringify({ name: newUser.name, email: newUser.email, role: newUser.role }));
            } catch (e) {}
            notifySessions();
            setStatus(statusId, '🎉 ההרשמה הושלמה והתחברת כ-' + newUser.name + '!');
            return;
          }
          var found = users.find(function(u) {
            return String(u.email || '').toLowerCase() === email && String(u.pass || '') === pass;
          });
          if (!found) {
            setStatus(statusId, '❌ פרטי ההתחברות שגויים. נסה demo@nexuspro.co.il / 123456 או הירשם.');
            return;
          }
          try {
            localStorage.setItem('wb_smartdb_session', JSON.stringify({ name: found.name, email: found.email, role: found.role || 'חבר רשום' }));
          } catch (e) {}
          notifySessions();
          setStatus(statusId, '✅ ברוך הבא, ' + (found.name || found.email) + '! הסשן נשמר בהצלחה.');
        },
        mountSessionWidget: function(wid, portalUrl) {
          sessionWidgets[wid] = portalUrl || 'portal.html';
          renderSessionWidget(wid);
        },
        deleteFromBtn: function(btn) {
          if (!btn) return;
          var col = btn.getAttribute('data-col');
          var recId = btn.getAttribute('data-rec-id');
          if (col && recId) this.deleteRecord(col, recId);
        },
        logout: function() {
          this.authAction({ mode: 'logout' });
        },
        navTo: function(el, ev) {
          if (window.parent && window.parent !== window && el) {
            if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
            window.parent.postMessage({ type: 'WEBLOCKS_NAVIGATE', page: el.getAttribute('href') }, '*');
            return false;
          }
          return true;
        }
      };
    })();
  </script>
</head>
<body>
${generated}${embeddedStateComment}
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
        rtl: false,
        toolboxPosition: 'start',
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
        if (event.type === Blockly.Events.BLOCK_CHANGE && event.element === 'field' && event.blockId && event.name && workspace.current) {
          try {
            const changedBlock = workspace.current.getBlockById(event.blockId);
            if (changedBlock && event.newValue !== undefined && event.newValue !== null) {
              changedBlock.customProperties = changedBlock.customProperties || {};
              changedBlock.customProperties[event.name] = event.newValue;
              changedBlock.data = JSON.stringify(changedBlock.customProperties);
            }
          } catch (e) {}
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
      if (workspace.current && !isDesignStudioMode && !isLiveCodeMode) {
        Blockly.svgResize(workspace.current);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullCanvas, isFullPreview, isDesignStudioMode, isLiveCodeMode]);

  // Filter Blockly toolbox categories live from search bar
  useEffect(() => {
    if (!workspace.current) return;
    const q = (blockSearchQuery || '').trim().toLowerCase();
    if (!q) {
      workspace.current.updateToolbox(WEB_BLOCKS_TOOLBOX);
      return;
    }
    const seen = new Set();
    const matchedBlocks = [];
    WEB_BLOCKS_TOOLBOX.contents.forEach((cat) => {
      (cat.contents || []).forEach((item) => {
        if (item.kind !== 'block' || !item.type || seen.has(item.type)) return;
        const searchable = `${item.type} ${WEB_BLOCK_SEARCH_LABELS[item.type] || ''}`.toLowerCase();
        if (searchable.includes(q)) {
          seen.add(item.type);
          matchedBlocks.push({ kind: 'block', type: item.type });
        }
      });
    });
    workspace.current.updateToolbox({
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: `🔍 תוצאות (${matchedBlocks.length})`,
          colour: '#2563eb',
          contents: matchedBlocks.length > 0 ? matchedBlocks : [{ kind: 'label', text: 'לא נמצאו בלוקים תואמים' }]
        }
      ]
    });
    const tb = workspace.current.getToolbox && workspace.current.getToolbox();
    const firstItem = tb && tb.getToolboxItems && tb.getToolboxItems()[0];
    if (firstItem && tb.setSelectedItem) {
      tb.setSelectedItem(firstItem);
    }
  }, [blockSearchQuery]);

  // Load XML string into Blockly Workspace
  const loadPageXmlToWorkspace = (pageId) => {
    if (!workspace.current) return;
    const xml = pagesXmlRef.current[pageId] || INITIAL_PAGES.find(p => p.id === pageId)?.xml;
    if (xml) {
      try {
        workspace.current.clear();
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace.current);
        hydrateWorkspaceCustomPropsFromData();
      } catch (e) {
        console.error("Error loading XML to workspace:", e);
      }
    }
  };

  // Convert HTML string (from uploaded file or edited code) into Blockly Blocks on the active page
  const applyHtmlStringToBlocks = (htmlContent, sourceLabel = 'קובץ HTML') => {
    if (!workspace.current || !htmlContent || !htmlContent.trim()) return;
    try {
      const result = parseHtmlToBlocklyXml(htmlContent, { fallbackBg: '#f8fafc' });
      if (!result || !result.xml) return;

      workspace.current.clear();
      const dom = Blockly.utils.xml.textToDom(result.xml);
      Blockly.Xml.domToWorkspace(dom, workspace.current);
      hydrateWorkspaceCustomPropsFromData();

      pagesXmlRef.current[activePageId] = result.xml;

      const topBlocks = workspace.current.getTopBlocks(true);
      if (topBlocks.length > 0) {
        setSelectedBlockId(topBlocks[0].id);
        lastSelectedBlockRef.current = topBlocks[0];
      } else {
        setSelectedBlockId(null);
      }

      prevGeneratedCodeRef.current = '';
      updateCode(true);

      const msg = result.restoredFromEmbeddedState
        ? `✅ "${sourceLabel}" נטען בהצלחה! כל הבלוקים והעיצובים שוחזרו במלואם להמשך עריכה.`
        : `✅ "${sourceLabel}" פוענח והומר לבלוקים בהצלחה! כעת ניתן לערוך את כל האלמנטים.`;
      setUploadBanner({ text: msg, type: 'success' });
      setTimeout(() => setUploadBanner(null), 5000);
    } catch (err) {
      console.error('Error converting HTML to blocks:', err);
      setUploadBanner({ text: '⚠️ אירעה שגיאה בטעינת קובץ ה-HTML לבלוקים. בדוק שהקובץ תקין.', type: 'error' });
      setTimeout(() => setUploadBanner(null), 5000);
    }
  };

  // Handle HTML File Upload from computer
  const handleUploadHtmlFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        applyHtmlStringToBlocks(content, file.name);
      }
    };
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
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

  // Update a field safely and persist customProperties in block.data
  const handleUpdateBlockField = (block, fieldName, value) => {
    if (!block) return;
    block.customProperties = block.customProperties || {};
    block.customProperties[fieldName] = value;
    try {
      const field = typeof block.getField === 'function' ? block.getField(fieldName) : null;
      if (field) {
        if (typeof field.getOptions === 'function') {
          const opts = field.getOptions(false) || [];
          if (opts.some((opt) => Array.isArray(opt) && opt[1] === value)) {
            block.setFieldValue(value, fieldName);
          }
        } else {
          block.setFieldValue(value, fieldName);
        }
      }
    } catch (e) {}
    if (block.customProperties) {
      try {
        block.data = JSON.stringify(block.customProperties);
      } catch (e) {}
    }
    setDesignPropVersion(v => v + 1);
    updateCode(true);
  };

  // Open clean live website preview in a new browser tab
  const handleOpenPreviewInNewTab = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
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

      // In Full Website Preview mode, keep the preview 100% clean like a real published website!
      if (isFullPreview) return;

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
            } else if (href.includes('portal')) {
              handleSwitchPage('portal');
            } else if (href.includes('services')) {
              handleSwitchPage('services');
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
        } else if (pageTarget.includes('portal')) {
          handleSwitchPage('portal');
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

  // =========================================================================
  // 🤖 סוכן AI חי ב-WebBlocks (שיחה, יצירת תמונות FLUX.1, העלאת תמונות ויצירת בלוקים)
  // =========================================================================
  const [wbAgentMode, setWbAgentMode] = useState('auto'); // 'auto' | 'image' | 'block' | 'chat'
  const [wbAgentMessages, setWbAgentMessages] = useState([
    {
      id: 'wb_welcome',
      role: 'assistant',
      type: 'text',
      text: 'שלום! 👋 אני סוכן ה-AI של WebBlocks.\nאפשר לדבר איתי כאן וליצור:\n🖼️ תמונות חדשות לאתר (עם מודל FLUX.1 ב-Hugging Face) ולהוסיף אותן כבלוק תמונה בלחיצה אחת!\n🧩 בלוקים ורכיבים מוכנים שמתווספים אוטומטית למשטח הבלוקים שלך.\n💬 רעיונות לסלוגנים, טקסטים, קודי צבעי HEX או תשובות לכל שאלה.'
    }
  ]);
  const wbFileInputRef = useRef(null);

  // הוספת בלוק תמונה (web_image) ישירות לתוך משטח ה-Blockly!
  const insertImageBlockToCanvas = (imageUrl, altText = 'תמונה באתר') => {
    if (!workspace.current || !imageUrl) return;
    try {
      const imgBlock = workspace.current.newBlock('web_image');
      if (imgBlock.getField('SRC')) imgBlock.setFieldValue(imageUrl, 'SRC');
      else if (imgBlock.getField('URL')) imgBlock.setFieldValue(imageUrl, 'URL');
      if (imgBlock.getField('ALT')) imgBlock.setFieldValue(altText, 'ALT');
      if (imgBlock.getField('WIDTH')) imgBlock.setFieldValue('400px', 'WIDTH');
      if (imgBlock.getField('RADIUS')) imgBlock.setFieldValue('16px', 'RADIUS');
      imgBlock.initSvg();
      imgBlock.render();

      // ניסיון חיבור אוטומטי לסוף שרשרת הבלוקים בתוך הדף הראשי (web_page_container)
      const topBlocks = workspace.current.getTopBlocks(true);
      const pageContainer = topBlocks.find((b) => b.type === 'web_page_container');
      const childrenInput = pageContainer?.getInput('CHILDREN');
      if (childrenInput && childrenInput.connection) {
        let targetConn = childrenInput.connection;
        while (targetConn.targetBlock()) {
          const nextBlk = targetConn.targetBlock();
          if (nextBlk.nextConnection) {
            targetConn = nextBlk.nextConnection;
          } else {
            break;
          }
        }
        if (targetConn && imgBlock.previousConnection && !targetConn.isConnected()) {
          targetConn.connect(imgBlock.previousConnection);
        }
      } else {
        imgBlock.moveBy(50, 50);
      }

      setSelectedBlockId(imgBlock.id);
      lastSelectedBlockRef.current = imgBlock;
      updateCode();
    } catch (e) {
      console.error('Insert image block error:', e);
    }
  };

  // העלאת תמונה מהמחשב לתוך סוכן ה-AI ב-WebBlocks
  const handleWebBlocksAgentFileUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) return;
    const serverUrl = getActiveServerUrl();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result;
      if (!dataUrl) return;
      let finalUrl = dataUrl;
      try {
        const resp = await fetch(`${serverUrl}/api/web-track/upload-ai-asset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl, filename: file.name })
        });
        const data = await resp.json();
        if (resp.ok && data?.url) {
          finalUrl = `${serverUrl}${data.url}`;
        }
      } catch {}

      setWbAgentMessages((prev) => [
        ...prev,
        {
          id: `wb_upload_${Date.now()}`,
          role: 'assistant',
          type: 'image',
          text: `העלית את התמונה "${file.name}"! תוכל להוסיף אותה כבלוק תמונה לדף שלך בלחיצה אחת:`,
          imageUrl: finalUrl,
          prompt: file.name
        }
      ]);
    };
    reader.readAsDataURL(file);
  };

  // שליחת הודעה לסוכן ה-AI של WebBlocks (תמונה / בלוק / שיחה)
  const handleGenerateWebBlockInline = async () => {
    const prompt = inlineAiPrompt.trim();
    if (!prompt || isGeneratingInlineBlock) return;
    setIsGeneratingInlineBlock(true);
    setInlineAiPrompt('');

    setWbAgentMessages((prev) => [
      ...prev,
      { id: `wb_u_${Date.now()}`, role: 'user', type: 'text', text: prompt }
    ]);

    const serverUrl = getActiveServerUrl();
    const lower = prompt.toLowerCase();
    const isImageReq =
      wbAgentMode === 'image' ||
      (wbAgentMode === 'auto' &&
        /(צור\s+(לי\s+)?תמונ|תמונה\s+של|צור\s+(לי\s+)?לוגו|צור\s+(לי\s+)?באנר|צייר)/.test(lower));
    const isBlockReq =
      wbAgentMode === 'block' ||
      (wbAgentMode === 'auto' &&
        !isImageReq &&
        /(צור\s+(לי\s+)?בלוק|הוסף\s+בלוק|טופס|כרטיסיית|כרטיסיה|טבלה|מחירון)/.test(lower));

    try {
      if (isImageReq) {
        const cleaned = prompt
          .replace(/^(צור לי תמונה של|צור תמונה של|תמונה של|צור לי לוגו של|צור לי באנר של|צייר לי)\s*/i, '')
          .trim() || prompt;
        const resp = await fetch(`${serverUrl}/api/web-track/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: cleaned,
            styleSuffix: 'modern clean high resolution website visual, sharp focus, 8k',
            width: 640,
            height: 480
          })
        });
        const data = await resp.json();
        if (!resp.ok || !data?.imageUrl) {
          throw new Error(data?.error || 'שגיאה ביצירת התמונה');
        }
        setWbAgentMessages((prev) => [
          ...prev,
          {
            id: `wb_img_${Date.now()}`,
            role: 'assistant',
            type: 'image',
            text: `יצרתי עבורך את התמונה עבור "${prompt}"! לחץ למטה כדי להוסיף אותה כבלוק תמונה לאתר שלך:`,
            imageUrl: data.imageUrl,
            prompt
          }
        ]);
      } else if (isBlockReq) {
        const generatedId = `ai_web_${Date.now()}`;
        let htmlSnippet = `<div data-block-id="${generatedId}" style="background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; margin: 14px auto; max-width: 720px; box-shadow: 0 6px 18px rgba(15,23,42,0.06);">\n  <h3 style="color: #0f172a; margin-bottom: 8px;">${prompt}</h3>\n</div>\n`;

        try {
          const aiResp = await fetch(`${serverUrl}/api/gemini`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `אתה מחולל בלוקי HTML מעוצבים בעברית (RTL). צור אך ורק קטע קוד HTML אחד (ללא תגיות html/head/body וללא סימני markdown) עבור הבקשה הבאה: "${prompt}". השתמש בעיצוב inline-style עשיר, מודרני ויפהפה עם צלליות, פינות עגולות וצבעים מקצועיים.`
            })
          });
          const aiData = await aiResp.json();
          const cleanedHtml = (aiData?.result || '')
            .replace(/```html/gi, '')
            .replace(/```/g, '')
            .trim();
          if (cleanedHtml && cleanedHtml.startsWith('<')) {
            htmlSnippet = `<div data-block-id="${generatedId}" style="width: 100%; max-width: var(--site-max-width, 1140px); margin: 14px auto;">\n${cleanedHtml}\n</div>`;
          }
        } catch {}

        Blockly.Blocks[generatedId] = {
          init: function() {
            this.appendDummyInput().appendField(
              `✨ בלוק AI: ${prompt.length > 26 ? prompt.substring(0, 26) + '...' : prompt}`
            );
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#7c3aed');
            this.setTooltip(`בלוק שנוצר ע"י סוכן ה-AI: ${prompt}`);
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
          const created = workspace.current.newBlock(generatedId);
          created.initSvg();
          created.render();
          created.moveBy(40, 40);
          setSelectedBlockId(created.id);
          lastSelectedBlockRef.current = created;
          updateCode();
        }

        setWbAgentMessages((prev) => [
          ...prev,
          {
            id: `wb_blk_${Date.now()}`,
            role: 'assistant',
            type: 'text',
            text: `✅ יצרתי והוספתי את הבלוק "${prompt}" למשטח הבלוקים שלך! תוכל לגרור אותו למקום הרצוי בדף.`
          }
        ]);
      } else {
        const resp = await fetch(`${serverUrl}/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `אתה סוכן ה-AI של תלמיד שבונה אתר ב-WebBlocks (בלוקים ויזואליים ל-HTML/CSS/JS). ענה בעברית קצרה, ברורה וידידותית לבקשה הבאה (ספק סלוגנים, קודי צבעי HEX או הסבר איך לבנות בבלוקים): ${prompt}`
          })
        });
        const data = await resp.json();
        setWbAgentMessages((prev) => [
          ...prev,
          {
            id: `wb_txt_${Date.now()}`,
            role: 'assistant',
            type: 'text',
            text: data?.result || 'אני כאן לכל שאלה! תוכל לבקש ממני ליצור תמונה, ליצור בלוק חדש או להציע סלוגנים וצבעים.'
          }
        ]);
      }
    } catch (err) {
      setWbAgentMessages((prev) => [
        ...prev,
        {
          id: `wb_err_${Date.now()}`,
          role: 'assistant',
          type: 'text',
          text: '⚠️ אירעה שגיאה קלה בתקשורת עם השרת, נסה שוב בעוד רגע.'
        }
      ]);
    } finally {
      setIsGeneratingInlineBlock(false);
    }
  };

  // =========================================================================
  // 💻 LIVE CODE STUDIO IDE HELPERS (3-Tab HTML/CSS/JS Compiler & Snippets)
  // =========================================================================
  const compileTabsToFullHtml = (hStr, cStr, jStr) => {
    const full = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activePage.name} - Live Code</title>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&family=Heebo:wght@400;500;700;800;900&family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
${cStr}
  </style>
</head>
<body>
${hStr}
  <script>
${jStr}
  </script>
</body>
</html>`;
    setCode(full);
  };

  const handleInsertLiveCodeSnippet = (snippetType) => {
    const snippets = {
      hero: `\n<section style="background: linear-gradient(135deg, #1e1b4b, #312e81); color: #fff; padding: 48px 28px; border-radius: 22px; text-align: center; max-width: 1100px; margin: 20px auto; box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
  <span style="background: rgba(255,255,255,0.18); padding: 6px 16px; border-radius: 999px; font-weight: 800; font-size: 0.85rem;">🚀 הדור הבא</span>
  <h1 style="font-size: 2.6rem; margin: 14px 0;">ברוכים הבאים לאתר החדש שלי</h1>
  <p style="color: #cbd5e1; max-width: 600px; margin: 0 auto 24px auto; font-size: 1.1rem;">עיצוב מודרני, רספונסיבי ומהיר שנכתב ישירות בעורך הקוד החי.</p>
  <a href="#contact" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 800;">התחל עכשיו</a>
</section>\n`,
      grid3: `\n<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; max-width: 1100px; margin: 24px auto;">
  <div style="background: #ffffff; color: #0f172a; padding: 24px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); text-align: right;">
    <h3>⚡ מהירות שיא</h3>
    <p style="color: #475569;">אתר מהיר ורספונסיבי לכל מסך ומכשיר.</p>
  </div>
  <div style="background: #ffffff; color: #0f172a; padding: 24px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); text-align: right;">
    <h3>🎨 עיצוב יוקרתי</h3>
    <p style="color: #475569;">שימוש בצבעים מודרניים, צלליות ואנימציות.</p>
  </div>
  <div style="background: #ffffff; color: #0f172a; padding: 24px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); text-align: right;">
    <h3>🤖 שילוב AI</h3>
    <p style="color: #475569;">תוכן, תמונות ורכיבים חכמים בעזרת בינה מלאכותית.</p>
  </div>
</div>\n`,
      product: `\n<div style="background: #ffffff; color: #0f172a; border-radius: 18px; overflow: hidden; max-width: 340px; margin: 20px auto; box-shadow: 0 10px 25px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; text-align: right;">
  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop" style="width: 100%; height: 200px; object-fit: contain;" />
  <div style="padding: 20px;">
    <div style="color: #f59e0b; margin-bottom: 6px;">⭐⭐⭐⭐⭐</div>
    <h3 style="margin: 0 0 8px 0;">אוזניות גיימינג Pro</h3>
    <p style="color: #64748b; font-size: 0.9rem; margin: 0 0 16px 0;">סאונד היקפי 7.1 ותאורת RGB חכמה.</p>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <strong style="font-size: 1.4rem;">₪299</strong>
      <button onclick="alert('נוסף לסל! 🛒')" style="background: #2563eb; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 800; cursor: pointer;">הוסף לסל 🛒</button>
    </div>
  </div>
</div>\n`,
      calculator: `\n<div style="background: #ffffff; color: #0f172a; padding: 28px; border-radius: 18px; max-width: 440px; margin: 24px auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: right;">
  <h3 style="margin-top: 0;">🧮 מחשבון הצעת מחיר חכם</h3>
  <label style="display: block; margin-bottom: 6px; font-weight: 700;">כמות מוצרים:</label>
  <input id="calc_qty" type="number" value="2" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 12px;" />
  <label style="display: block; margin-bottom: 6px; font-weight: 700;">מחיר ליחידה (₪):</label>
  <input id="calc_price" type="number" value="150" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 16px;" />
  <button onclick="var q=Number(document.getElementById('calc_qty').value)||0; var p=Number(document.getElementById('calc_price').value)||0; document.getElementById('calc_res').innerText='סה״כ לתשלום: ₪' + (q*p);" style="width: 100%; background: #10b981; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: 800; cursor: pointer;">חשב סה״כ ⚡</button>
  <div id="calc_res" style="margin-top: 14px; font-size: 1.2rem; font-weight: 900; color: #059669; text-align: center;">סה״כ לתשלום: ₪300</div>
</div>\n`
    };

    const snippet = snippets[snippetType];
    if (!snippet) return;

    if (codeIdeMode === 'tabs') {
      const nextHtml = tabHtml + '\n' + snippet;
      setTabHtml(nextHtml);
      setActiveCodeTab('html');
      compileTabsToFullHtml(nextHtml, tabCss, tabJs);
    } else {
      if (code.includes('</body>')) {
        setCode(code.replace('</body>', `${snippet}\n</body>`));
      } else {
        setCode(code + '\n' + snippet);
      }
    }
  };

  // =========================================================================
  // 🎨 1-CLICK GLOBAL DESIGN THEMES & STARTER TEMPLATES
  // =========================================================================
  const applyGlobalThemePreset = (themeId) => {
    if (!workspace.current) return;
    const allBlocks = workspace.current.getAllBlocks(false);

    allBlocks.forEach((b) => {
      b.customProperties = b.customProperties || {};
      const setFieldOrProp = (k, v) => {
        try {
          if (typeof b.getField === 'function' && b.getField(k)) {
            b.setFieldValue(v, k);
          } else {
            b.customProperties[k] = v;
          }
        } catch {
          b.customProperties[k] = v;
        }
      };

      if (themeId === 'center_all') {
        if (b.type === 'web_page_container') {
          setFieldOrProp('ALIGN_ITEMS', 'center');
        }
        if (b.type === 'web_card') {
          setFieldOrProp('CONTENT_ALIGN', 'center');
          b.customProperties['ALIGN_ITEMS'] = 'center';
          b.customProperties['TEXT_ALIGN'] = 'center';
        }
        if (b.type === 'web_heading' || b.type === 'web_paragraph') {
          setFieldOrProp('ALIGN', 'center');
          b.customProperties['TEXT_ALIGN'] = 'center';
        }
        if (b.type === 'web_row_flex') {
          setFieldOrProp('JUSTIFY', 'center');
        }
      } else if (themeId === 'cyber_neon') {
        if (b.type === 'web_page_container') {
          setFieldOrProp('BG_COLOR', '#0f172a');
          setFieldOrProp('FONT', 'Rubik, sans-serif');
          setFieldOrProp('ALIGN_ITEMS', 'center');
        }
        if (b.type === 'web_card') {
          setFieldOrProp('BG_COLOR', '#1e293b');
          setFieldOrProp('RADIUS', '24px');
          setFieldOrProp('SHADOW', '0 0 28px rgba(124,58,237,0.28)');
          b.customProperties['BORDER_WIDTH'] = '1px';
          b.customProperties['BORDER_COLOR'] = '#4f46e5';
          b.customProperties['TEXT_COLOR'] = '#f8fafc';
        }
        if (b.type === 'web_heading') {
          setFieldOrProp('COLOR', '#f8fafc');
        }
        if (b.type === 'web_paragraph' || b.type === 'web_bullet_item') {
          setFieldOrProp('COLOR', '#cbd5e1');
        }
        if (b.type === 'web_badge') {
          setFieldOrProp('BG_COLOR', '#4c1d95');
          b.customProperties['TEXT_COLOR'] = '#ddd6fe';
        }
      } else if (themeId === 'glass_pro') {
        if (b.type === 'web_page_container') {
          setFieldOrProp('BG_COLOR', '#eef2ff');
          b.customProperties['GRADIENT'] = 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #dbeafe 100%)';
          setFieldOrProp('FONT', 'Heebo, sans-serif');
          setFieldOrProp('ALIGN_ITEMS', 'center');
        }
        if (b.type === 'web_card') {
          setFieldOrProp('BG_COLOR', 'rgba(255,255,255,0.82)');
          setFieldOrProp('RADIUS', '24px');
          setFieldOrProp('SHADOW', '0 20px 30px -8px rgba(15,23,42,0.14)');
          b.customProperties['BLUR_AMOUNT'] = '14';
          b.customProperties['BORDER_WIDTH'] = '1px';
          b.customProperties['BORDER_COLOR'] = '#ffffff';
        }
        if (b.type === 'web_heading') {
          setFieldOrProp('COLOR', '#1e1b4b');
        }
        if (b.type === 'web_paragraph') {
          setFieldOrProp('COLOR', '#334155');
        }
      } else if (themeId === 'emerald_clean') {
        if (b.type === 'web_page_container') {
          setFieldOrProp('BG_COLOR', '#f0fdf4');
          setFieldOrProp('FONT', 'Assistant, sans-serif');
          setFieldOrProp('ALIGN_ITEMS', 'center');
        }
        if (b.type === 'web_card') {
          setFieldOrProp('BG_COLOR', '#ffffff');
          setFieldOrProp('RADIUS', '20px');
          b.customProperties['BORDER_WIDTH'] = '1px';
          b.customProperties['BORDER_COLOR'] = '#bbf7d0';
        }
        if (b.type === 'web_heading') {
          setFieldOrProp('COLOR', '#064e3b');
        }
        if (b.type === 'web_badge') {
          setFieldOrProp('BG_COLOR', '#dcfce7');
          b.customProperties['TEXT_COLOR'] = '#166534';
        }
      }

      if (b.customProperties && Object.keys(b.customProperties).length > 0) {
        b.data = JSON.stringify(b.customProperties);
      }
    });

    prevGeneratedCodeRef.current = '';
    updateCode(true);
    setShowThemesModal(false);
    setUploadBanner({
      text: '🎨 ערכת העיצוב הוחלה בהצלחה על כל רכיבי העמוד!',
      type: 'success'
    });
    setTimeout(() => setUploadBanner(null), 4000);
  };

  const loadStarterTemplate = (templateId) => {
    if (!workspace.current) return;

    if (templateId === 'nexus_enterprise') {
      try {
        setPages(INITIAL_PAGES);
        INITIAL_PAGES.forEach(p => {
          pagesXmlRef.current[p.id] = p.xml;
        });
        setActivePageId('index');
        workspace.current.clear();
        const dom = Blockly.utils.xml.textToDom(INITIAL_PAGES[0].xml);
        Blockly.Xml.domToWorkspace(dom, workspace.current);
        hydrateWorkspaceCustomPropsFromData();
        prevGeneratedCodeRef.current = '';
        updateCode(true);
        setIsLiveCodeMode(false);
        setIsDesignStudioMode(false);
        setShowThemesModal(false);
        setUploadBanner({
          text: '🏆 פרויקט המערכת המלא (NexusPro - 4 עמודים + דאטה-בייס ואימות משתמשים) נטען בהצלחה!',
          type: 'success'
        });
        setTimeout(() => setUploadBanner(null), 4000);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    const templatesXml = {
      gaming_pro: `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="web_page_container" x="24" y="20">
          <field name="BG_COLOR">#0f172a</field>
          <field name="FONT">'Rubik', sans-serif</field>
          <field name="ALIGN_ITEMS">center</field>
          <field name="SITE_WIDTH">1140px</field>
          <statement name="CHILDREN">
            <block type="web_navbar_custom">
              <field name="BG_COLOR">#1e293b</field>
              <field name="JUSTIFY">space-between</field>
              <field name="ALIGN_ITEMS">center</field>
              <field name="GAP">14px</field>
              <statement name="CHILDREN">
                <block type="web_heading">
                  <field name="TEXT">CyberArena 🎮</field>
                  <field name="TAG">h3</field>
                  <field name="COLOR">#ffffff</field>
                  <field name="ALIGN">right</field>
                  <next>
                    <block type="web_button">
                      <field name="LABEL">הצטרף לטורניר 🚀</field>
                      <field name="BG_COLOR">#7c3aed</field>
                      <field name="TEXT_COLOR">#ffffff</field>
                      <field name="ALERT_MSG">ההרשמה לטורניר נפתחה! 🏆</field>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="web_semantic_container">
                  <field name="TAG">section</field>
                  <field name="ELEMENT_ID">gamingHero</field>
                  <statement name="CHILDREN">
                    <block type="web_grid_container">
                      <field name="GRID_COLS">repeat(2, 1fr)</field>
                      <field name="GAP">28px</field>
                      <statement name="CHILDREN">
                        <block type="web_card">
                          <field name="BG_COLOR">#1e293b</field>
                          <field name="RADIUS">20px</field>
                          <field name="SHADOW">0 20px 25px -5px rgba(0,0,0,0.25)</field>
                          <statement name="CHILDREN">
                            <block type="web_badge">
                              <field name="TEXT">זירת הגיימינג של ישראל 🔥</field>
                              <field name="BG_COLOR">#7c3aed</field>
                              <field name="TEXT_COLOR">#ffffff</field>
                              <next>
                                <block type="web_heading">
                                  <field name="TEXT">ציוד קצה וטורנירים נושאי פרסים</field>
                                  <field name="TAG">h1</field>
                                  <field name="COLOR">#ffffff</field>
                                  <field name="ALIGN">right</field>
                                  <next>
                                    <block type="web_paragraph">
                                      <field name="TEXT">הצטרפו לאלפי גיימרים בקהילה המובילה, שדרגו את עמדת הגיימינג שלכם והתחרו בלייב.</field>
                                      <field name="COLOR">#cbd5e1</field>
                                      <field name="SIZE">16px</field>
                                      <next>
                                        <block type="web_link">
                                          <field name="TEXT">לפרטים והרשמה →</field>
                                          <field name="HREF">about.html</field>
                                          <field name="TARGET">_self</field>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="web_image">
                              <field name="SRC">https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&amp;auto=format&amp;fit=crop</field>
                              <field name="ALT">עמדת גיימינג מקצועית</field>
                              <field name="WIDTH">100%</field>
                              <field name="RADIUS">20px</field>
                            </block>
                          </next>
                        </block>
                      </statement>
                    </block>
                  </statement>
                  <next>
                    <block type="web_grid_container">
                      <field name="GRID_COLS">repeat(3, 1fr)</field>
                      <field name="GAP">20px</field>
                      <statement name="CHILDREN">
                        <block type="web_card">
                          <field name="BG_COLOR">#1e293b</field>
                          <field name="RADIUS">16px</field>
                          <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.2)</field>
                          <statement name="CHILDREN">
                            <block type="web_image">
                              <field name="SRC">https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&amp;auto=format&amp;fit=crop</field>
                              <field name="ALT">אוזניות Cyber Pro</field>
                              <field name="WIDTH">100%</field>
                              <field name="RADIUS">12px</field>
                              <next>
                                <block type="web_heading">
                                  <field name="TEXT">אוזניות Cyber Pro — ₪299</field>
                                  <field name="TAG">h3</field>
                                  <field name="COLOR">#ffffff</field>
                                  <field name="ALIGN">right</field>
                                  <next>
                                    <block type="web_paragraph">
                                      <field name="TEXT">סאונד היקפי 7.1 ותאורת RGB חכמה.</field>
                                      <field name="COLOR">#94a3b8</field>
                                      <field name="SIZE">14px</field>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="web_card">
                              <field name="BG_COLOR">#1e293b</field>
                              <field name="RADIUS">16px</field>
                              <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.2)</field>
                              <statement name="CHILDREN">
                                <block type="web_image">
                                  <field name="SRC">https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&amp;auto=format&amp;fit=crop</field>
                                  <field name="ALT">מקלדת מכנית</field>
                                  <field name="WIDTH">100%</field>
                                  <field name="RADIUS">12px</field>
                                  <next>
                                    <block type="web_heading">
                                      <field name="TEXT">מקלדת Neon RGB — ₪349</field>
                                      <field name="TAG">h3</field>
                                      <field name="COLOR">#ffffff</field>
                                      <field name="ALIGN">right</field>
                                      <next>
                                        <block type="web_paragraph">
                                          <field name="TEXT">סוויצ׳ים מהירים ושלדת אלומיניום.</field>
                                          <field name="COLOR">#94a3b8</field>
                                          <field name="SIZE">14px</field>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </statement>
                              <next>
                                <block type="web_card">
                                  <field name="BG_COLOR">#1e293b</field>
                                  <field name="RADIUS">16px</field>
                                  <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.2)</field>
                                  <statement name="CHILDREN">
                                    <block type="web_image">
                                      <field name="SRC">https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&amp;auto=format&amp;fit=crop</field>
                                      <field name="ALT">עכבר גיימינג</field>
                                      <field name="WIDTH">100%</field>
                                      <field name="RADIUS">12px</field>
                                      <next>
                                        <block type="web_heading">
                                          <field name="TEXT">עכבר Ultra — ₪199</field>
                                          <field name="TAG">h3</field>
                                          <field name="COLOR">#ffffff</field>
                                          <field name="ALIGN">right</field>
                                          <next>
                                            <block type="web_paragraph">
                                              <field name="TEXT">חיישן מדויק ומשקל נוצה 58 גרם.</field>
                                              <field name="COLOR">#94a3b8</field>
                                              <field name="SIZE">14px</field>
                                            </block>
                                          </next>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </statement>
                      <next>
                        <block type="web_details_accordion">
                          <field name="SUMMARY">תוך כמה זמן מגיע המשלוח?</field>
                          <field name="OPEN_DEFAULT">FALSE</field>
                          <statement name="CHILDREN">
                            <block type="web_paragraph">
                              <field name="TEXT">כל ההזמנות יוצאות עם שליח מהיר עד הבית ומגיעות תוך 24–48 שעות!</field>
                              <field name="COLOR">#334155</field>
                              <field name="SIZE">14px</field>
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
        </block>
      </xml>`,
      startup_pro: `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="web_page_container" x="24" y="20">
          <field name="BG_COLOR">#f8fafc</field>
          <field name="FONT">'Heebo', sans-serif</field>
          <field name="ALIGN_ITEMS">center</field>
          <field name="SITE_WIDTH">1140px</field>
          <statement name="CHILDREN">
            <block type="web_navbar_custom">
              <field name="BG_COLOR">#0f172a</field>
              <field name="JUSTIFY">space-between</field>
              <field name="ALIGN_ITEMS">center</field>
              <field name="GAP">14px</field>
              <statement name="CHILDREN">
                <block type="web_heading">
                  <field name="TEXT">NovaTech 🚀</field>
                  <field name="TAG">h3</field>
                  <field name="COLOR">#ffffff</field>
                  <field name="ALIGN">right</field>
                  <next>
                    <block type="web_link">
                      <field name="TEXT">תיאום הדגמה</field>
                      <field name="URL">contact.html</field>
                      <field name="TARGET">_self</field>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="web_semantic_container">
                  <field name="TAG">section</field>
                  <field name="ELEMENT_ID">startupHero</field>
                  <statement name="CHILDREN">
                    <block type="web_card">
                      <field name="BG_COLOR">#ffffff</field>
                      <field name="RADIUS">20px</field>
                      <field name="SHADOW">0 20px 25px -5px rgba(0,0,0,0.12)</field>
                      <statement name="CHILDREN">
                        <block type="web_badge">
                          <field name="TEXT">טכנולוגיית העתיד כאן ✨</field>
                          <field name="BG_COLOR">#dbeafe</field>
                          <field name="TEXT_COLOR">#1d4ed8</field>
                          <next>
                            <block type="web_heading">
                              <field name="TEXT">הפלטפורמה החכמה שמזניקה את העסק שלך</field>
                              <field name="TAG">h1</field>
                              <field name="COLOR">#0f172a</field>
                              <field name="ALIGN">right</field>
                              <next>
                                <block type="web_paragraph">
                                  <field name="TEXT">אוטומציה חכמה, ניתוח נתונים בזמן אמת וחוויית משתמש מרהיבה בכל מכשיר.</field>
                                  <field name="COLOR">#475569</field>
                                  <field name="SIZE">16px</field>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </statement>
                    </block>
                  </statement>
                  <next>
                    <block type="web_grid_container">
                      <field name="GRID_COLS">repeat(2, 1fr)</field>
                      <field name="GAP">24px</field>
                      <statement name="CHILDREN">
                        <block type="web_card">
                          <field name="BG_COLOR">#ffffff</field>
                          <field name="RADIUS">18px</field>
                          <field name="SHADOW">0 4px 6px -1px rgba(0,0,0,0.1)</field>
                          <statement name="CHILDREN">
                            <block type="web_heading">
                              <field name="TEXT">חבילת Starter — ₪49/חודש</field>
                              <field name="TAG">h3</field>
                              <field name="COLOR">#0f172a</field>
                              <field name="ALIGN">right</field>
                              <next>
                                <block type="web_list_container">
                                  <field name="LIST_TYPE">ul</field>
                                  <field name="MARKER">default</field>
                                  <statement name="CHILDREN">
                                    <block type="web_list_item">
                                      <field name="TEXT">גישה לכל הכלים הבסיסיים</field>
                                      <next>
                                        <block type="web_list_item">
                                          <field name="TEXT">דוחות חודשיים ותמיכה במייל</field>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="web_card">
                              <field name="BG_COLOR">#0f172a</field>
                              <field name="RADIUS">18px</field>
                              <field name="SHADOW">0 20px 25px -5px rgba(0,0,0,0.2)</field>
                              <statement name="CHILDREN">
                                <block type="web_badge">
                                  <field name="TEXT">הכי משתלם ⭐</field>
                                  <field name="BG_COLOR">#2563eb</field>
                                  <field name="TEXT_COLOR">#ffffff</field>
                                  <next>
                                    <block type="web_heading">
                                      <field name="TEXT">חבילת VIP Pro — ₪129/חודש</field>
                                      <field name="TAG">h3</field>
                                      <field name="COLOR">#ffffff</field>
                                      <field name="ALIGN">right</field>
                                      <next>
                                        <block type="web_list_container">
                                          <field name="LIST_TYPE">ul</field>
                                          <field name="MARKER">default</field>
                                          <statement name="CHILDREN">
                                            <block type="web_list_item">
                                              <field name="TEXT">גישה מלאה ללא הגבלה + מנוע AI</field>
                                              <next>
                                                <block type="web_list_item">
                                                  <field name="TEXT">ליווי אישי 24/7 וכל העדכונים</field>
                                                </block>
                                              </next>
                                            </block>
                                          </statement>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </statement>
                            </block>
                          </next>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>`
    };

    const xml = templatesXml[templateId];
    if (!xml) return;

    try {
      workspace.current.clear();
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, workspace.current);
      hydrateWorkspaceCustomPropsFromData();
      pagesXmlRef.current[activePageId] = xml;
      prevGeneratedCodeRef.current = '';
      updateCode(true);
      setIsLiveCodeMode(false);
      setIsDesignStudioMode(false);
      setShowThemesModal(false);
      setUploadBanner({
        text: '🚀 תבנית האתר המקצועית נטענה בהצלחה! כעת ניתן לערוך כל בלוק.',
        type: 'success'
      });
      setTimeout(() => setUploadBanner(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadProjectImageInBlocks = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target?.result || '');
        if (!dataUrl) return;
        const cleanName = file.name.trim();
        setLocalProjectImages((prev) => ({
          ...prev,
          [cleanName]: dataUrl,
          'banner.jpg': dataUrl
        }));

        // אם יש כבר בלוק תמונה במשטח העבודה, נעדכן לו את שם התמונה אוטומטית בשדה SRC
        if (workspace.current) {
          try {
            const allBlocks = workspace.current.getAllBlocks(false);
            const imgBlock = allBlocks.find((b) => b.type === 'web_image');
            if (imgBlock && typeof imgBlock.getField === 'function') {
              if (imgBlock.getField('SRC')) imgBlock.setFieldValue(cleanName, 'SRC');
              if (imgBlock.getField('URL')) imgBlock.setFieldValue(cleanName, 'URL');
              prevGeneratedCodeRef.current = '';
              updateCode(true);
            }
          } catch {}
        }

        setUploadBanner({
          text: `✅ התמונה "${cleanName}" הועלתה! בבלוק "🖼️ תמונה | קישור URL:" כתוב בשדה הקישור: ${cleanName}`,
          type: 'success'
        });
        setTimeout(() => setUploadBanner(null), 6000);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleStartCleanPage = () => {
    if (!workspace.current) return;
    const cleanXml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="web_page_container" x="30" y="25">
        <field name="BG_COLOR">#f8fafc</field>
        <field name="FONT">'Heebo', sans-serif</field>
      </block>
    </xml>`;
    try {
      workspace.current.clear();
      const dom = Blockly.utils.xml.textToDom(cleanXml);
      Blockly.Xml.domToWorkspace(dom, workspace.current);
      pagesXmlRef.current[activePageId] = cleanXml;
      const topBlocks = workspace.current.getTopBlocks(true);
      if (topBlocks.length > 0) {
        setSelectedBlockId(topBlocks[0].id);
        lastSelectedBlockRef.current = topBlocks[0];
      }
      prevGeneratedCodeRef.current = '';
      updateCode(true);
      setUploadBanner({
        text: '🧹 משטח העבודה נוקה לדף ראשי (Container) נקי – מוכן לבנייה צעד אחר צעד!',
        type: 'success'
      });
      setTimeout(() => setUploadBanner(null), 4500);
    } catch (e) {}
  };

  const previewCodeWithLocalImages = (() => {
    let doc = code || '';
    Object.entries(localProjectImages || {}).forEach(([fileName, dataUrl]) => {
      if (!fileName || !dataUrl) return;
      const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      doc = doc.replace(new RegExp(`src=(["'])${escaped}\\1`, 'gi'), `src=$1${dataUrl}$1`);
      doc = doc.replace(new RegExp(`url\\((["']?)${escaped}\\1\\)`, 'gi'), `url($1${dataUrl}$1)`);
    });
    return doc;
  })();

  return (
    <div
      className="webblocks-studio-root"
      style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f8fafc", direction: "rtl", overflow: 'hidden', fontFamily: SYSTEM_FONT }}
      onClick={() => {
        if (openHeaderMenu) setOpenHeaderMenu(null);
      }}
    >
      
      {/* קלט נסתר להעלאת קובץ HTML מהמחשב */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm"
        onChange={handleUploadHtmlFile}
        style={{ display: 'none' }}
      />

      {/* קלט נסתר להעלאת תמונה מתיקיית הפרויקט במחשב */}
      <input
        ref={projectImageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUploadProjectImageInBlocks}
        style={{ display: 'none' }}
      />

      {/* 🧭 סרגל עליון מאורגן ל-3 אזורים ברורים */}
      <header className="wb-header" onClick={(e) => e.stopPropagation()}>
        {/* אזור ימין: חזרה, לוגו וניהול עמודי האתר */}
        <div className="wb-header-zone">
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#f8fafc',
              padding: '6px 11px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700',
              border: '1px solid rgba(255,255,255,0.16)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            🏠 חזרה
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.15rem' }}>🌐</span>
            <span style={{ fontSize: '0.96rem', fontWeight: '800', color: '#ffffff' }}>
              WebBlocks Pro
            </span>
          </div>

          {/* תפריט עמודים */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenHeaderMenu(openHeaderMenu === 'pages' ? null : 'pages')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.18)',
                padding: '6px 11px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📄 {activePage.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>▾</span>
            </button>

            {openHeaderMenu === 'pages' && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.2)',
                minWidth: '230px',
                padding: '6px',
                zIndex: 120,
                color: '#0f172a'
              }}>
                <div style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: '800', color: '#64748b' }}>
                  עמודי האתר שלך ({pages.length})
                </div>
                {pages.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSwitchPage(p.id);
                        setOpenHeaderMenu(null);
                      }}
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        background: activePageId === p.id ? '#eff6ff' : 'transparent',
                        color: activePageId === p.id ? '#1d4ed8' : '#1e293b',
                        border: 'none',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: activePageId === p.id ? '800' : '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{p.name}</span>
                      {activePageId === p.id && <span>✓</span>}
                    </button>
                    {p.id !== 'index' && (
                      <button
                        type="button"
                        title="מחק עמוד"
                        onClick={() => {
                          setPages((prev) => prev.filter((item) => item.id !== p.id));
                          if (activePageId === p.id) handleSwitchPage('index');
                        }}
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '6px', fontSize: '0.8rem' }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                <div style={{ height: '1px', background: '#e2e8f0', margin: '6px 0' }} />
                <button
                  type="button"
                  onClick={() => {
                    setOpenHeaderMenu(null);
                    handleAddNewPage();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    background: 'transparent',
                    color: '#2563eb',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  ➕ הוסף עמוד חדש לאתר
                </button>
              </div>
            )}
          </div>
        </div>

        {/* אזור מרכז: בורר 4 מצבי עבודה נקיים */}
        <div className="wb-mode-switcher">
          <button
            type="button"
            className={`wb-mode-btn ${!isLiveCodeMode && !isDesignStudioMode && !isFullPreview ? 'active' : ''}`}
            onClick={() => {
              setIsLiveCodeMode(false);
              setIsDesignStudioMode(false);
              setIsFullPreview(false);
              setIsFullCanvas(false);
              setOpenHeaderMenu(null);
            }}
          >
            <span>🧩</span>
            <span>בנייה ועיצוב</span>
          </button>

          <button
            type="button"
            className={`wb-mode-btn ${!isLiveCodeMode && isDesignStudioMode && !isFullPreview ? 'active' : ''}`}
            onClick={() => {
              const blk = getSelectedBlockObject();
              if (blk && blk.id) setSelectedBlockId(blk.id);
              setIsLiveCodeMode(false);
              setIsDesignStudioMode(true);
              setIsFullPreview(false);
              setIsFullCanvas(false);
              setOpenHeaderMenu(null);
            }}
          >
            <span>🎨</span>
            <span>סטודיו מוגדל</span>
          </button>

          <button
            type="button"
            className={`wb-mode-btn ${!isLiveCodeMode && isFullPreview ? 'active' : ''}`}
            onClick={() => {
              setIsLiveCodeMode(false);
              setIsDesignStudioMode(false);
              setIsFullCanvas(false);
              setIsFullPreview(true);
              setOpenHeaderMenu(null);
            }}
          >
            <span>👁️</span>
            <span>תצוגה מלאה</span>
          </button>

          <button
            type="button"
            className={`wb-mode-btn ${isLiveCodeMode ? 'active' : ''}`}
            onClick={() => {
              setIsDesignStudioMode(false);
              setIsFullPreview(false);
              setIsFullCanvas(false);
              setIsLiveCodeMode(true);
              setOpenHeaderMenu(null);
            }}
          >
            <span>💻</span>
            <span>קוד חי</span>
          </button>
        </div>

        {/* אזור שמאל: ביטול/בצע שוב, מסכים, כלים, וייצוא */}
        <div className="wb-header-zone">
          {/* Undo / Redo */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.08)', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              title="בטל פעולה (Ctrl+Z)"
              onClick={() => workspace.current?.undo(false)}
              style={{ border: 'none', background: 'transparent', color: '#e2e8f0', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              ↩️
            </button>
            <button
              type="button"
              title="בצע שוב (Ctrl+Y)"
              onClick={() => workspace.current?.undo(true)}
              style={{ border: 'none', background: 'transparent', color: '#e2e8f0', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              ↪️
            </button>
          </div>

          {/* בורר גודל מסך + מיקוד קנבס */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.08)', padding: '3px', borderRadius: '8px' }}>
            {[
              { id: 'desktop', icon: '🖥️', title: 'תצוגת מחשב' },
              { id: 'tablet', icon: '📟', title: 'תצוגת טאבלט' },
              { id: 'mobile', icon: '📱', title: 'תצוגת סמארטפון' }
            ].map((dev) => (
              <button
                key={dev.id}
                type="button"
                onClick={() => setDeviceView(dev.id)}
                title={dev.title}
                style={{
                  background: deviceView === dev.id ? '#2563eb' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  padding: '4px 7px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {dev.icon}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsFullPreview(false);
                setIsFullCanvas((prev) => !prev);
              }}
              title="הרחב משטח בלוקים למסך מלא"
              style={{
                background: isFullCanvas ? '#059669' : 'transparent',
                color: '#ffffff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ⛶
            </button>
          </div>

          {/* תפריט כלים ועיצוב */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenHeaderMenu(openHeaderMenu === 'tools' ? null : 'tools')}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>✨ כלים ו-AI</span>
              <span style={{ fontSize: '0.7rem' }}>▾</span>
            </button>

            {openHeaderMenu === 'tools' && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.2)',
                minWidth: '245px',
                padding: '6px',
                zIndex: 120,
                color: '#0f172a'
              }}>
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); setShowThemesModal(true); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#1e293b', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🎨</span><span>ערכות עיצוב ותבניות מוכנות</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); applyGlobalThemePreset('center_all'); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#1d4ed8', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🎯</span><span>מרכז את כל האתר לאמצע המסך</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); setShowAIGeneratorModal(true); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#ea580c', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>✨</span><span>יצירת בלוק חכם עם AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); projectImageInputRef.current?.click(); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#6d28d9', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🖼️</span><span>העלה תמונה מהמחשב לפרויקט</span>
                </button>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 0' }} />
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); handleStartCleanPage(); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#b45309', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🧹</span><span>נקה והתחל מדף ראשי נקי</span>
                </button>
              </div>
            )}
          </div>

          {/* תפריט קובץ וייצוא */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenHeaderMenu(openHeaderMenu === 'file' ? null : 'file')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.18)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>📂 קובץ</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>▾</span>
            </button>

            {openHeaderMenu === 'file' && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.2)',
                minWidth: '230px',
                padding: '6px',
                zIndex: 120,
                color: '#0f172a'
              }}>
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); handleDownloadHtml(); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#0284c7', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📥</span><span>הורד קובץ HTML למחשב</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setOpenHeaderMenu(null); fileInputRef.current?.click(); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#6d28d9', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📂</span><span>העלה קובץ HTML להמשך עריכה</span>
                </button>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 0' }} />
                <button
                  type="button"
                  onClick={() => { handleCopyCode(); setOpenHeaderMenu(null); }}
                  style={{ width: '100%', textAlign: 'right', background: 'transparent', color: '#334155', border: 'none', padding: '9px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{copySuccess ? '✅' : '📋'}</span><span>{copySuccess ? 'הקוד הועתק ללוח!' : 'העתק קוד HTML ללוח'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🔔 הודעת חיווי */}
      {uploadBanner && (
        <div style={{
          background: uploadBanner.type === 'error' ? '#fef2f2' : '#ecfdf5',
          color: uploadBanner.type === 'error' ? '#b91c1c' : '#047857',
          borderBottom: `1px solid ${uploadBanner.type === 'error' ? '#fecaca' : '#a7f3d0'}`,
          padding: '8px 20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: SYSTEM_FONT
        }}>
          <span>{uploadBanner.text}</span>
          <button
            onClick={() => setUploadBanner(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: '700', fontSize: '0.9rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 🖥️ אזור עבודה ראשי */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* 💻 מצב קוד חי מלא (HTML / CSS / JS עם Monaco + תצוגה חיה) */}
        {isLiveCodeMode && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1.15, display: 'flex', flexDirection: 'column', borderLeft: '1.5px solid #cbd5e1', background: '#0f172a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: '#1e293b', borderBottom: '1px solid #334155', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '4px', background: '#0f172a', padding: '3px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCodeIdeMode('full')}
                    style={{ border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', background: codeIdeMode === 'full' ? '#2563eb' : 'transparent', color: codeIdeMode === 'full' ? '#fff' : '#94a3b8' }}
                  >
                    📄 קוד האתר מהבלוקים
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeIdeMode('tabs');
                      compileTabsToFullHtml(tabHtml, tabCss, tabJs);
                    }}
                    style={{ border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', background: codeIdeMode === 'tabs' ? '#7c3aed' : 'transparent', color: codeIdeMode === 'tabs' ? '#fff' : '#94a3b8' }}
                  >
                    🧪 Sandbox (HTML/CSS/JS)
                  </button>
                </div>
                {codeIdeMode === 'tabs' && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { id: 'html', label: 'HTML' },
                      { id: 'css', label: 'CSS' },
                      { id: 'js', label: 'JS' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveCodeTab(t.id)}
                        style={{ border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.76rem', fontWeight: '800', cursor: 'pointer', background: activeCodeTab === t.id ? '#38bdf8' : '#334155', color: activeCodeTab === t.id ? '#0f172a' : '#e2e8f0' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minHeight: 0, direction: 'ltr' }}>
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language={codeIdeMode === 'full' ? 'html' : (activeCodeTab === 'js' ? 'javascript' : activeCodeTab)}
                  theme="vs-dark"
                  value={
                    codeIdeMode === 'full'
                      ? code
                      : activeCodeTab === 'html'
                      ? tabHtml
                      : activeCodeTab === 'css'
                      ? tabCss
                      : tabJs
                  }
                  onChange={(newVal) => {
                    if (codeIdeMode === 'full') {
                      setCode(newVal);
                    } else if (activeCodeTab === 'html') {
                      setTabHtml(newVal);
                      compileTabsToFullHtml(newVal, tabCss, tabJs);
                    } else if (activeCodeTab === 'css') {
                      setTabCss(newVal);
                      compileTabsToFullHtml(tabHtml, newVal, tabJs);
                    } else {
                      setTabJs(newVal);
                      compileTabsToFullHtml(tabHtml, tabCss, newVal);
                    }
                  }}
                  options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on', automaticLayout: true }}
                />
              </div>
            </div>
            <div style={{ flex: 0.85, background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <iframe
                ref={iframeRef}
                title="Live Code Preview"
                srcDoc={previewCodeWithLocalImages}
                onLoad={handleIframeLoad}
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 אזור ימין: משטח בלוקים (במצב בנייה) / אתר חי גדול (במצב סטודיו עיצוב)  */}
        {/* ========================================================================= */}
        {!isLiveCodeMode && (
        <div style={{ 
          flex: isFullCanvas ? 1 : (isDesignStudioMode ? 1.35 : 1.18), 
          minWidth: 0,
          display: isFullPreview ? 'none' : 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          borderLeft: isFullCanvas ? 'none' : '1.5px solid #e2e8f0', 
          background: '#ffffff', 
          position: 'relative',
          transition: 'flex 0.2s ease',
          fontFamily: SYSTEM_FONT
        }}>
          <div dir="ltr" style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden', direction: 'ltr' }}>
            {/* חיפוש בלוקים מהיר מעל משטח העבודה */}
            {!isDesignStudioMode && (
              <div className="wb-search-bar">
                <span style={{ fontSize: '0.9rem' }}>🔍</span>
                <input
                  type="text"
                  value={blockSearchQuery}
                  onChange={(e) => setBlockSearchQuery(e.target.value)}
                  placeholder="חפש בלוק (grid, טופס, svg...)"
                  aria-label="חיפוש בלוק"
                />
                {blockSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setBlockSearchQuery('')}
                    style={{ border: 'none', background: '#f1f5f9', borderRadius: '6px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}
                    title="נקה חיפוש"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* 1. משטח הבלוקים של Blockly (LTR מסודר משמאל לימין) */}
            <div 
              ref={blocklyDiv} 
              dir="ltr"
              style={{ 
                width: "100%",
                height: "100%", 
                background: "#ffffff",
                direction: "ltr",
                display: isDesignStudioMode ? 'none' : 'block'
              }} 
            />

            {/* 2. תצוגת האתר החי הגדול (מוצגת במצב סטודיו לעיצוב מוגדל) */}
            {isDesignStudioMode && !isFullPreview && (
              <div dir="rtl" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#f1f5f9', direction: 'rtl' }}>
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
                      maxWidth: '100%',
                      maxHeight: '100%',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                      borderRadius: '26px',
                      border: '8px solid #334155',
                      overflow: 'hidden',
                      background: '#ffffff'
                    } : deviceView === 'tablet' ? {
                      width: '768px',
                      height: '92%',
                      maxWidth: '100%',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.16)',
                      borderRadius: '20px',
                      border: '8px solid #475569',
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
                      srcDoc={previewCodeWithLocalImages}
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
        )}

        {/* ========================================================================= */}
        {/* 📱 אזור שמאל: Inspector מאוחד (תצוגה חיה | עיצוב CSS | שכבות הדף)       */}
        {/* ========================================================================= */}
        {!isLiveCodeMode && (
        <div style={{ 
          flex: isFullPreview ? 1 : 1.0, 
          minWidth: 0,
          display: isFullCanvas ? 'none' : 'flex', 
          flexDirection: "column", 
          background: "#ffffff",
          overflow: 'hidden',
          fontFamily: SYSTEM_FONT
        }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* במצב סטודיו לעיצוב מוגדל - מציג ישירות את פאנל העיצוב */}
            {isDesignStudioMode && !isFullPreview && (
              <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
                <WebBlockDesignPanel 
                  selectedBlock={currentSelectedBlock}
                  onUpdateField={handleUpdateBlockField}
                  onBackToToolbox={() => setIsDesignStudioMode(false)}
                />
              </div>
            )}

            {/* במצב בנייה רגיל - Inspector עם 3 לשוניות ברורות */}
            {(!isDesignStudioMode || isFullPreview) && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f1f5f9', minHeight: 0, overflow: 'hidden' }}>
                {!isFullPreview && (
                  <div className="wb-inspector-tabs">
                    <button
                      type="button"
                      className={`wb-inspector-tab ${leftBuildTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setLeftBuildTab('preview')}
                    >
                      <span>👁️</span>
                      <span>תצוגה חיה</span>
                    </button>
                    <button
                      type="button"
                      className={`wb-inspector-tab ${leftBuildTab === 'design' ? 'active' : ''}`}
                      onClick={() => {
                        const blk = getSelectedBlockObject();
                        if (blk && blk.id) setSelectedBlockId(blk.id);
                        setLeftBuildTab('design');
                      }}
                    >
                      <span>🎨</span>
                      <span>עיצוב CSS</span>
                    </button>
                    <button
                      type="button"
                      className={`wb-inspector-tab ${leftBuildTab === 'layers' ? 'active' : ''}`}
                      onClick={() => setLeftBuildTab('layers')}
                    >
                      <span>🌳</span>
                      <span>שכבות ({layerNodes.length})</span>
                    </button>
                  </div>
                )}

                {isFullPreview && (
                  <div style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '8px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    borderBottom: '1px solid #334155'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.88rem', color: '#38bdf8' }}>
                        👁️ תצוגה מקדימה חיה של האתר שלך
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {pages.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleSwitchPage(p.id)}
                            style={{
                              background: activePageId === p.id ? '#2563eb' : '#1e293b',
                              color: '#ffffff',
                              border: activePageId === p.id ? '1px solid #60a5fa' : '1px solid #334155',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontFamily: SYSTEM_FONT
                            }}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={handleOpenPreviewInNewTab}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          fontFamily: SYSTEM_FONT,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        🌐 פתח בחלון דפדפן חדש
                      </button>

                      <button
                        onClick={() => setIsFullPreview(false)}
                        style={{
                          background: '#1e293b',
                          color: '#f8fafc',
                          border: '1px solid #475569',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          fontFamily: SYSTEM_FONT
                        }}
                      >
                        ✕ חזרה לעריכה
                      </button>
                    </div>
                  </div>
                )}

                {!isFullPreview && leftBuildTab === 'design' ? (
                  <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
                    <WebBlockDesignPanel 
                      selectedBlock={currentSelectedBlock}
                      onUpdateField={handleUpdateBlockField}
                      onBackToToolbox={() => setLeftBuildTab('preview')}
                    />
                  </div>
                ) : !isFullPreview && leftBuildTab === 'layers' ? (
                  <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', marginBottom: '6px', padding: '0 4px' }}>
                      מבנה העץ של הדף (לחץ לבחירה ועיצוב מהיר)
                    </div>
                    {layerNodes.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.86rem' }}>
                        אין עדיין בלוקים בדף זה. גרור בלוקים מהתפריט מימין!
                      </div>
                    ) : (
                      layerNodes.map((node) => {
                        const isSel = selectedBlockId === node.id;
                        return (
                          <div
                            key={node.id}
                            className={`wb-layer-item ${isSel ? 'selected' : ''}`}
                            style={{ paddingRight: `${10 + node.depth * 16}px` }}
                            onClick={() => {
                              setSelectedBlockId(node.id);
                              if (workspace.current) {
                                const blk = workspace.current.getBlockById(node.id);
                                if (blk) {
                                  lastSelectedBlockRef.current = blk;
                                  blk.select();
                                  workspace.current.centerOnBlock(node.id);
                                }
                              }
                              applyActiveInspectionHighlight(node.id);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{node.depth > 0 ? '↳' : '📄'}</span>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {node.label}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBlockId(node.id);
                                if (workspace.current) {
                                  const blk = workspace.current.getBlockById(node.id);
                                  if (blk) {
                                    lastSelectedBlockRef.current = blk;
                                    blk.select();
                                  }
                                }
                                setLeftBuildTab('design');
                              }}
                              style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', padding: '2px 7px', fontSize: '0.72rem', fontWeight: '700', color: '#2563eb', cursor: 'pointer', flexShrink: 0 }}
                            >
                              🎨 עצב
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
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
                        maxWidth: '100%',
                        maxHeight: '100%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        borderRadius: '24px',
                        border: '6px solid #334155',
                        overflow: 'hidden',
                        background: '#ffffff'
                      } : deviceView === 'tablet' ? {
                        width: '768px',
                        height: '92%',
                        maxWidth: '100%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        borderRadius: '18px',
                        border: '6px solid #475569',
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
                        srcDoc={previewCodeWithLocalImages}
                        onLoad={handleIframeLoad}
                        sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
        )}
      </div>

      {/* 🎨 מודל ערכות עיצוב ותבניות מוכנות (Themes & Starter Templates) */}
      {showThemesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(6px)',
            padding: '20px',
            fontFamily: SYSTEM_FONT
          }}
          onClick={() => setShowThemesModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              maxWidth: '780px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              direction: 'rtl',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                  🎨 ערכות עיצוב חכמות ותבניות אתר ברמת-על
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                  החל ערכת עיצוב על הבלוקים הקיימים שלך או טען תבנית אתר שלמה ומוכנה לעריכה:
                </p>
              </div>
              <button
                onClick={() => setShowThemesModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800' }}
              >
                ✕
              </button>
            </div>

            {/* חלק 1: ערכות עיצוב ומרכוז בלחיצה אחת */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontWeight: '800', fontSize: '0.98rem', color: '#1e293b', marginBottom: '10px' }}>
                1. החל עיצוב או מרכוז על האתר הקיים שלך:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                {[
                  {
                    id: 'center_all',
                    title: '🎯 מרכוז מלא של כל האתר',
                    desc: 'ממרכז את כל הכרטיסיות, הכותרות והכפתורים לאמצע המסך.',
                    bg: '#eff6ff',
                    border: '#93c5fd',
                    color: '#1e40af'
                  },
                  {
                    id: 'cyber_neon',
                    title: '🌌 סייבר-גיימינג כהה (Neon)',
                    desc: 'רקע לילה כהה, כרטיסיות ניאון סגול-כחול וגופן Rubik.',
                    bg: '#1e1b4b',
                    border: '#6366f1',
                    color: '#ffffff'
                  },
                  {
                    id: 'glass_pro',
                    title: '💎 זכוכית יוקרתית (Glass)',
                    desc: 'רקע מדורג עדין וכרטיסיות זכוכית חצי-שקופות עם טשטוש.',
                    bg: '#f5f3ff',
                    border: '#c4b5fd',
                    color: '#5b21b6'
                  },
                  {
                    id: 'emerald_clean',
                    title: '🌿 אמרלד נקי ומרענן',
                    desc: 'עיצוב בהיר ונקי בגווני ירוק-מנטה מודרניים.',
                    bg: '#ecfdf5',
                    border: '#6ee7b7',
                    color: '#065f46'
                  }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => applyGlobalThemePreset(th.id)}
                    style={{
                      textAlign: 'right',
                      background: th.bg,
                      color: th.color,
                      border: `2px solid ${th.border}`,
                      padding: '14px',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '4px' }}>
                      {th.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.88, lineHeight: 1.4 }}>
                      {th.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* חלק 2: תבניות אתר מלאות */}
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.98rem', color: '#1e293b', marginBottom: '10px' }}>
                2. טען תבנית אתר שלמה בבלוקים (Pro Starter Templates):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ border: '2px solid #0f766e', borderRadius: '12px', padding: '16px', background: '#f0fdfa' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px' }}>
                    🏆 אתר עסקי מלא (4 עמודים + דאטה-בייס) — NexusPro
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    פרויקט שלם ב-4 עמודים (דף הבית, שירותים ומחירים, פורטל משתמשים עם הרשמה/התחברות ו-CRUD בדאטה-בייס, צור קשר).
                  </p>
                  <button
                    onClick={() => loadStarterTemplate('nexus_enterprise')}
                    style={{
                      background: '#0f766e',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗄️ טען מערכת מלאה (4 עמודים)
                  </button>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px' }}>
                    🎮 אתר גיימינג וטורנירים מלא (CyberArena)
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    כולל סרגל ניווט, באנר Hero דו-צדדי, רשת 3 כרטיסי מוצרים עם דירוג כוכבים ומחיר, שאלות נפוצות מתקפלות, רשתות חברתיות ופוטר.
                  </p>
                  <button
                    onClick={() => loadStarterTemplate('gaming_pro')}
                    style={{
                      background: '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🚀 טען תבנית גיימינג
                  </button>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px' }}>
                    🚀 דף נחיתה לסטארט-אפ / חברה (NovaTech)
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    כולל סרגל ניווט, אזור פתיחה ממורכז, רשת השוואת חבילות מחיר (Starter מול VIP Pro), כרטיס המלצת לקוח ופוטר.
                  </p>
                  <button
                    onClick={() => loadStarterTemplate('startup_pro')}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🚀 טען תבנית סטארט-אפ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 חלון שיחה בצ'אט עם סוכן ה-AI של WebBlocks (תמונות FLUX.1 + יצירת בלוקים + טקסט) */}
      {showAIGeneratorModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(6px)',
            fontFamily: SYSTEM_FONT,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '680px',
              maxWidth: '96vw',
              maxHeight: '88vh',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              direction: 'rtl',
              fontFamily: SYSTEM_FONT,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '2px solid #8b5cf6'
            }}
          >
            {/* כותרת חלון סוכן ה-AI */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
                color: '#ffffff',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.35rem' }}>🤖</span>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    צ'אט סוכן ה-AI של WebBlocks — תמונות, בלוקים וטקסט
                  </h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#ddd6fe', marginTop: '2px' }}>
                  מחובר ל-Hugging Face (FLUX.1 ליצירת תמונות + Qwen2.5-Coder / DeepSeek לבלוקים וטקסט)
                </div>
              </div>

              <button
                onClick={() => setShowAIGeneratorModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '900'
                }}
              >
                ✕
              </button>
            </div>

            {/* בורר מצבים בצ'אט */}
            <div
              style={{
                background: '#f5f3ff',
                borderBottom: '1px solid #ddd6fe',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}
            >
              {[
                { id: 'auto', label: '🤖 אוטומטי' },
                { id: 'image', label: '🖼️ יצירת תמונה (FLUX.1)' },
                { id: 'block', label: '🧩 יצירת בלוק חכם לדף' },
                { id: 'chat', label: '💬 שיחה, סלוגן וצבעים' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setWbAgentMode(m.id)}
                  style={{
                    background:
                      wbAgentMode === m.id
                        ? 'linear-gradient(135deg, #7c3aed, #db2777)'
                        : '#ffffff',
                    color: wbAgentMode === m.id ? '#ffffff' : '#4c1d95',
                    border: wbAgentMode === m.id ? 'none' : '1px solid #c4b5fd',
                    borderRadius: '999px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* אזור הודעות הצ'אט */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '280px',
                maxHeight: '420px'
              }}
            >
              {wbAgentMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        background: isUser ? '#2563eb' : '#ffffff',
                        color: isUser ? '#ffffff' : '#0f172a',
                        border: isUser ? 'none' : '1.5px solid #cbd5e1',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 12px rgba(15,23,42,0.06)'
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', fontWeight: '800', marginBottom: '4px', color: isUser ? '#dbeafe' : '#6d28d9' }}>
                        {isUser ? '🧑‍💻 אתה' : '🤖 סוכן ה-AI'}
                      </div>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </div>

                      {msg.type === 'image' && msg.imageUrl && (
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <img
                            src={msg.imageUrl}
                            alt={msg.prompt || 'AI Image'}
                            style={{
                              width: '100%',
                              maxHeight: '220px',
                              objectFit: 'contain',
                              borderRadius: '10px',
                              background: '#0f172a'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => {
                                insertImageBlockToCanvas(msg.imageUrl, msg.prompt);
                                setShowAIGeneratorModal(false);
                              }}
                              style={{
                                flex: 1,
                                background: '#10b981',
                                color: '#052e16',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontWeight: '900',
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
                            >
                              ➕ הוסף כתמונת בלוק לאתר עכשיו!
                            </button>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(msg.imageUrl)}
                              style={{
                                background: '#7c3aed',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontWeight: '800',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              📋 העתק URL
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isGeneratingInlineBlock && (
                <div style={{ textAlign: 'left', color: '#6d28d9', fontWeight: '800', fontSize: '0.86rem' }}>
                  ⏳ סוכן ה-AI מכין את התוצאה...
                </div>
              )}
            </div>

            {/* שורת הקלט התחתונה */}
            <div
              style={{
                padding: '12px 16px',
                background: '#ffffff',
                borderTop: '1.5px solid #e2e8f0',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end'
              }}
            >
              <input
                ref={wbFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  handleWebBlocksAgentFileUpload(e.target.files);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => wbFileInputRef.current?.click()}
                style={{
                  background: '#f5f3ff',
                  color: '#6d28d9',
                  border: '1.5px solid #c4b5fd',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                📎 העלה תמונה
              </button>

              <textarea
                rows={2}
                value={inlineAiPrompt}
                onChange={(e) => setInlineAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerateWebBlockInline();
                  }
                }}
                placeholder={
                  wbAgentMode === 'image'
                    ? 'כתוב איזו תמונה ליצור (למשל: צור לי תמונה של המבורגר גורמה)...'
                    : wbAgentMode === 'block'
                    ? 'תאר איזה בלוק ליצור ולהוסיף לדף (למשל: כרטיסיית מוצר יוקרתית / טופס הרשמה)...'
                    : 'בקש תמונה ("צור לי תמונה של..."), בלוק חדש לדף, או שאל כל שאלה...'
                }
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontFamily: SYSTEM_FONT,
                  resize: 'none',
                  outline: 'none'
                }}
              />

              <button
                onClick={handleGenerateWebBlockInline}
                disabled={isGeneratingInlineBlock || !inlineAiPrompt.trim()}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  opacity: !inlineAiPrompt.trim() || isGeneratingInlineBlock ? 0.6 : 1,
                  fontFamily: SYSTEM_FONT,
                  flexShrink: 0
                }}
              >
                {isGeneratingInlineBlock ? '⏳ מייצר...' : '🚀 שלח לסוכן'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebBlocks;

