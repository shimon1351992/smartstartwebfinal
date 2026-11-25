import React, { useEffect, useState } from 'react';
import * as Blockly from 'blockly';
import { registerWebBlocks } from './webBlocksDefinitions';

// Ensure WebBlocks custom Blockly definitions are registered once
let blocksRegistered = false;
function ensureRegistered() {
  if (!blocksRegistered) {
    registerWebBlocks();
    blocksRegistered = true;
  }
}

// In-memory cache so navigating between slides renders SVG previews instantaneously
const svgSnapshotCache = new Map();

function renderBlocklySvgSnapshot(cacheKey, xmlText) {
  if (svgSnapshotCache.has(cacheKey)) {
    return svgSnapshotCache.get(cacheKey);
  }

  ensureRegistered();

  const tempHost = document.createElement('div');
  tempHost.style.position = 'fixed';
  tempHost.style.left = '-10000px';
  tempHost.style.top = '-10000px';
  tempHost.style.width = '1100px';
  tempHost.style.height = '800px';
  tempHost.style.visibility = 'hidden';
  tempHost.style.pointerEvents = 'none';
  tempHost.setAttribute('dir', 'ltr');
  document.body.appendChild(tempHost);

  let workspace = null;
  try {
    workspace = Blockly.inject(tempHost, {
      readOnly: true,
      rtl: false,
      sounds: false,
      scrollbars: false,
      zoom: { startScale: 1 }
    });

    const wrappedXml = xmlText.trim().startsWith('<xml')
      ? xmlText
      : `<xml xmlns="https://developers.google.com/blockly/xml">${xmlText}</xml>`;

    const dom = Blockly.utils.xml.textToDom(wrappedXml);
    Blockly.Xml.domToWorkspace(dom, workspace);

    // Trigger SVG layout measurements cleanly
    workspace.resizeContents();

    const injectionDiv = tempHost.querySelector('.injectionDiv');
    const tempSvg = workspace.getParentSvg();
    const blockCanvas = tempSvg?.querySelector('.blocklyBlockCanvas');

    if (!tempSvg || !blockCanvas) {
      return null;
    }

    const clonedCanvas = blockCanvas.cloneNode(true);
    clonedCanvas.removeAttribute('transform');

    // Measure bbox of the actual blocks
    const bbox = blockCanvas.getBBox();
    const pad = 12;
    const vbX = Math.floor(bbox.x - pad);
    const vbY = Math.floor(bbox.y - pad);
    const vbW = Math.max(90, Math.ceil(bbox.width + pad * 2));
    const vbH = Math.max(44, Math.ceil(bbox.height + pad * 2));

    const defsEl = tempSvg.querySelector('defs');
    let defsHtml = '';
    if (defsEl) {
      const clonedDefs = defsEl.cloneNode(true);
      clonedDefs.querySelectorAll('pattern[id^="blocklyGridPattern"]').forEach((n) => n.remove());
      defsHtml = clonedDefs.outerHTML;
    }

    const result = {
      wrapperClass: injectionDiv?.getAttribute('class') || 'injectionDiv geras-renderer classic-theme',
      svgClass: tempSvg.getAttribute('class') || 'blocklySvg',
      viewBox: `${vbX} ${vbY} ${vbW} ${vbH}`,
      vbW,
      vbH,
      innerHtml: `${defsHtml}${clonedCanvas.outerHTML}`
    };

    svgSnapshotCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('BlocklyVisualPreview snapshot fallback:', cacheKey, err);
    return null;
  } finally {
    if (workspace) {
      try {
        workspace.dispose();
      } catch {}
    }
    if (tempHost.parentNode) {
      tempHost.parentNode.removeChild(tempHost);
    }
  }
}

/**
 * Renders an authentic, crystal-clear visual Blockly block preview (image/SVG)
 * matching the exact LTR WebBlocks Pro appearance.
 */
export default function BlocklyVisualPreview({
  blockType,
  blockXml,
  fallbackTitle,
  accentColor = '#2563eb',
  maxHeight = 250
}) {
  const xmlSource = blockXml || (blockType ? `<block type="${blockType}"></block>` : '');
  const cacheKey = xmlSource;

  const [snapshot, setSnapshot] = useState(() =>
    cacheKey && svgSnapshotCache.has(cacheKey) ? svgSnapshotCache.get(cacheKey) : null
  );

  useEffect(() => {
    if (!cacheKey) {
      setSnapshot(null);
      return;
    }
    if (svgSnapshotCache.has(cacheKey)) {
      setSnapshot(svgSnapshotCache.get(cacheKey));
      return;
    }
    const snap = renderBlocklySvgSnapshot(cacheKey, xmlSource);
    setSnapshot(snap);
  }, [cacheKey, xmlSource]);

  if (!cacheKey) return null;

  let displayW = 320;
  let displayH = 90;
  if (snapshot) {
    const scaleByWidth = Math.min(1.08, 620 / snapshot.vbW);
    const scaleByHeight = maxHeight / snapshot.vbH;
    const scale = Math.max(0.55, Math.min(scaleByWidth, scaleByHeight));
    displayW = Math.round(snapshot.vbW * scale);
    displayH = Math.round(snapshot.vbH * scale);
  }

  return (
    <div
      dir="ltr"
      className="wb-block-preview-wrap"
      style={{
        backgroundColor: '#fcfdff',
        backgroundImage: 'radial-gradient(#dbe3ef 1.15px, transparent 1.15px)',
        backgroundSize: '18px 18px',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '88px',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    >
      {snapshot ? (
        <div
          className={snapshot.wrapperClass}
          style={{
            position: 'relative',
            background: 'transparent',
            height: 'auto',
            width: '100%',
            overflow: 'visible',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <svg
            className={snapshot.svgClass}
            viewBox={snapshot.viewBox}
            width={displayW}
            height={displayH}
            style={{
              position: 'static',
              background: 'transparent',
              width: `${displayW}px`,
              maxWidth: '100%',
              height: `${displayH}px`,
              overflow: 'visible',
              display: 'block',
              flexShrink: 0
            }}
            dangerouslySetInnerHTML={{ __html: snapshot.innerHtml }}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: accentColor,
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '0.9rem'
          }}
        >
          <span>🧩</span>
          <span>{fallbackTitle || blockType}</span>
        </div>
      )}
    </div>
  );
}
