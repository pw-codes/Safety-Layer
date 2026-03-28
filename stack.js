/**
 * stack.js
 * Renders the tech stack grid with FREE badges.
 * Depends on: data.js
 */
(function () {
  'use strict';

  function stackItemHTML({ icon, category, name }) {
    return `
      <div class="stack-item reveal">
        <div class="stack-badge">${icon}</div>
        <div class="stack-info">
          <span>${category}</span>
          <strong>${name} <span class="free-badge">FREE</span></strong>
        </div>
      </div>`;
  }

  function renderStack() {
    const grid = document.getElementById('stackGrid');
    if (!grid) return;
    grid.innerHTML = window.SL_DATA.stack.map(stackItemHTML).join('');
  }

  document.addEventListener('DOMContentLoaded', renderStack);
})();
