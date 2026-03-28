/**
 * stats.js
 * Renders the stats bar from SL_DATA.stats.
 * Depends on: data.js
 */
(function () {
  'use strict';

  function renderStats() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    const html = window.SL_DATA.stats.map(({ num, label }) => `
      <div>
        <div class="stat-num">${num}</div>
        <div class="stat-label">${label}</div>
      </div>
    `).join('');

    grid.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', renderStats);
})();
