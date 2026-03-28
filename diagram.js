/**
 * diagram.js
 * Builds and injects the hero architecture SVG diagram.
 * Depends on: nothing (pure SVG generation).
 */
(function () {
  'use strict';

  function buildDiagramSVG() {
    return `
<svg viewBox="0 0 420 360" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="SafeLayer architecture diagram">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow2">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Outer panel -->
  <rect x="10" y="10" width="400" height="340" rx="2" fill="#0d1520" stroke="#1a2a3a" stroke-width="1"/>
  <rect x="24" y="24" width="372" height="312" rx="1" fill="#060a0f" stroke="#1a2a3a" stroke-width="0.5"/>

  <!-- Header bar -->
  <rect x="24" y="60" width="372" height="1" fill="#00e5ff" opacity="0.15"/>
  <text x="32" y="50" font-family="monospace" font-size="8" fill="#6b88a4" letter-spacing="2">SAFELAYER MONITORING ACTIVE</text>
  <circle cx="388" cy="46" r="4" fill="#39ff14" opacity="0.9" filter="url(#glow)">
    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.4s" repeatCount="indefinite"/>
  </circle>

  <!-- Node: User -->
  <rect x="30" y="80" width="90" height="50" rx="2" fill="#0f1e2e" stroke="#1a2a3a"/>
  <text x="75" y="100" text-anchor="middle" font-family="monospace" font-size="7" fill="#6b88a4" letter-spacing="1">USER</text>
  <text x="75" y="116" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#e8f0fe" font-weight="bold">Request</text>

  <!-- Arrow 1 -->
  <line x1="122" y1="105" x2="148" y2="105" stroke="#00e5ff" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1s" repeatCount="indefinite"/>
  </line>
  <polygon points="148,101 156,105 148,109" fill="#00e5ff"/>

  <!-- Node: API Layer -->
  <rect x="156" y="80" width="90" height="50" rx="2" fill="#0f1e2e" stroke="#1a2a3a"/>
  <text x="201" y="100" text-anchor="middle" font-family="monospace" font-size="7" fill="#6b88a4" letter-spacing="1">LAYER</text>
  <text x="201" y="116" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#e8f0fe" font-weight="bold">API</text>

  <!-- Arrow 2 -->
  <line x1="248" y1="105" x2="274" y2="105" stroke="#00e5ff" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1s" repeatCount="indefinite" begin="0.3s"/>
  </line>
  <polygon points="274,101 282,105 274,109" fill="#00e5ff"/>

  <!-- Node: AI Model -->
  <rect x="282" y="80" width="100" height="50" rx="2" fill="#0f1e2e" stroke="#1a2a3a"/>
  <text x="332" y="100" text-anchor="middle" font-family="monospace" font-size="7" fill="#6b88a4" letter-spacing="1">MODEL</text>
  <text x="332" y="116" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#e8f0fe" font-weight="bold">AI Core</text>

  <!-- Vertical arrow -->
  <line x1="332" y1="132" x2="332" y2="162" stroke="#00e5ff" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1s" repeatCount="indefinite" begin="0.6s"/>
  </line>
  <polygon points="328,162 332,170 336,162" fill="#00e5ff"/>

  <!-- Node: Safety Engine -->
  <rect x="240" y="170" width="180" height="60" rx="2" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1.5" filter="url(#glow)"/>
  <text x="330" y="193" text-anchor="middle" font-family="monospace" font-size="7" fill="#00e5ff" letter-spacing="2">SAFETY ENGINE</text>
  <text x="330" y="212" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#00e5ff" font-weight="bold">Risk Scoring + Filter</text>

  <!-- Risk tier badges -->
  <rect x="250" y="198" width="44" height="20" rx="1" fill="rgba(57,255,20,0.15)"  stroke="rgba(57,255,20,0.4)"/>
  <text x="272" y="212" text-anchor="middle" font-family="monospace" font-size="7" fill="#39ff14">SAFE</text>
  <rect x="302" y="198" width="44" height="20" rx="1" fill="rgba(255,200,0,0.1)"   stroke="rgba(255,200,0,0.3)"/>
  <text x="324" y="212" text-anchor="middle" font-family="monospace" font-size="7" fill="#ffc800">RISKY</text>
  <rect x="354" y="198" width="52" height="20" rx="1" fill="rgba(255,77,109,0.15)" stroke="rgba(255,77,109,0.4)"/>
  <text x="380" y="212" text-anchor="middle" font-family="monospace" font-size="7" fill="#ff4d6d">DANGER</text>

  <!-- Arrow left to output -->
  <line x1="238" y1="200" x2="190" y2="200" stroke="#39ff14" stroke-width="1.5" stroke-dasharray="4,3">
    <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1s" repeatCount="indefinite" begin="0.9s"/>
  </line>
  <polygon points="190,196 182,200 190,204" fill="#39ff14"/>

  <!-- Node: Output -->
  <rect x="90" y="170" width="90" height="60" rx="2" fill="#0f1e2e" stroke="#39ff14" stroke-width="1"/>
  <text x="135" y="192" text-anchor="middle" font-family="monospace" font-size="7" fill="#39ff14" letter-spacing="1">OUTPUT</text>
  <text x="135" y="212" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#e8f0fe" font-weight="bold">Safe Response</text>

  <!-- Arrow to analytics row -->
  <line x1="135" y1="232" x2="135" y2="258" stroke="#6b88a4" stroke-width="1" stroke-dasharray="3,3"/>
  <polygon points="131,258 135,266 139,258" fill="#6b88a4"/>

  <!-- Bottom nodes -->
  <rect x="30"  y="266" width="100" height="48" rx="2" fill="#0f1e2e" stroke="#1a2a3a"/>
  <text x="80"  y="285" text-anchor="middle" font-family="monospace" font-size="7" fill="#6b88a4" letter-spacing="1">ANALYTICS</text>
  <text x="80"  y="303" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#e8f0fe" font-weight="bold">Grafana+Prometheus</text>

  <rect x="140" y="266" width="100" height="48" rx="2" fill="#0f1e2e" stroke="#1a2a3a"/>
  <text x="190" y="285" text-anchor="middle" font-family="monospace" font-size="7" fill="#6b88a4" letter-spacing="1">COMPLIANCE</text>
  <text x="190" y="303" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#e8f0fe" font-weight="bold">Reports + Logs</text>

  <rect x="250" y="266" width="120" height="48" rx="2" fill="#0f1e2e" stroke="#1a2a3a"/>
  <text x="310" y="285" text-anchor="middle" font-family="monospace" font-size="7" fill="#6b88a4" letter-spacing="1">QUEUE</text>
  <text x="310" y="303" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#e8f0fe" font-weight="bold">Redis + Celery</text>

  <!-- Bottom accent line -->
  <line x1="24" y1="338" x2="396" y2="338" stroke="#00e5ff" stroke-width="0.5" opacity="0.3"/>
</svg>`;
  }

  function init() {
    const container = document.getElementById('heroDiagram');
    if (!container) return;
    container.innerHTML = buildDiagramSVG();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
