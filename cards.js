/**
 * cards.js
 * Renders: split problem/solution cards, feature cards, roadmap cards.
 * Depends on: data.js
 */
(function () {
  'use strict';

  /** Build a split card (problem / solution) */
  function splitCardHTML({ cls, icon, title, body }) {
    return `
      <div class="split-card ${cls} reveal">
        <div class="split-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${body}</p>
      </div>`;
  }

  /** Build a feature / roadmap card */
  function featureCardHTML({ num, icon, title, body }, index) {
    const numStr = num || `${String(index + 1).padStart(2, '0')} / ??`;
    return `
      <div class="feature-card reveal">
        ${num ? `<span class="feature-num">${numStr}</span>` : ''}
        <div class="feature-icon">${icon}</div>
        <h4>${title}</h4>
        <p>${body}</p>
      </div>`;
  }

  function renderSplitCards() {
    const el = document.getElementById('splitCards');
    if (!el) return;
    el.innerHTML = window.SL_DATA.splitCards.map(splitCardHTML).join('');
  }

  function renderFeatures() {
    const el = document.getElementById('featuresGrid');
    if (!el) return;
    el.innerHTML = window.SL_DATA.features.map(featureCardHTML).join('');
  }

  function renderRoadmap() {
    const el = document.getElementById('roadmapGrid');
    if (!el) return;
    el.innerHTML = window.SL_DATA.roadmap.map((item, i) => featureCardHTML(item, i)).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderSplitCards();
    renderFeatures();
    renderRoadmap();
  });
})();
