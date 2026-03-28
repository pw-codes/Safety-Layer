/**
 * architecture.js
 * Renders the architecture pipeline flow nodes.
 * Depends on: data.js
 */
(function () {
  'use strict';

  function nodeHTML({ label, name, highlight }) {
    return `
      <div class="arch-node${highlight ? ' highlight' : ''}">
        <span>${label}</span>
        <strong>${name}</strong>
      </div>`;
  }

  function renderArchitecture() {
    const container = document.getElementById('archFlow');
    if (!container) return;

    const nodes  = window.SL_DATA.archNodes;
    const parts  = [];

    nodes.forEach((node, i) => {
      parts.push(nodeHTML(node));
      if (i < nodes.length - 1) {
        parts.push(`<div class="arch-arrow">→→</div>`);
      }
    });

    // Add scanner line inside
    parts.unshift('<div class="scanner-line"></div>');
    container.innerHTML = parts.join('');
  }

  document.addEventListener('DOMContentLoaded', renderArchitecture);
})();
