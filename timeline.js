/**
 * timeline.js
 * Renders the MVP timeline items.
 * Depends on: data.js
 */
(function () {
  'use strict';

  function timelineItemHTML({ label, dotClass, title, tasks }) {
    const taskItems = tasks.map(t => `<li>${t}</li>`).join('');
    return `
      <div class="timeline-item reveal">
        <div class="timeline-label">${label}</div>
        <div class="timeline-dot${dotClass ? ' ' + dotClass : ''}"></div>
        <div class="timeline-card">
          <h4>${title}</h4>
          <ul>${taskItems}</ul>
        </div>
      </div>`;
  }

  function renderTimeline() {
    const container = document.getElementById('timeline');
    if (!container) return;
    container.innerHTML = window.SL_DATA.timeline.map(timelineItemHTML).join('');
  }

  document.addEventListener('DOMContentLoaded', renderTimeline);
})();
