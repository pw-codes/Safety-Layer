/**
 * pricing.js
 * Renders the pricing grid cards.
 * Depends on: data.js
 */
(function () {
  'use strict';

  function pricingCardHTML({ tier, price, period, desc, featured, features }) {
    const featureItems = features.map(f => `<li>${f}</li>`).join('');
    return `
      <div class="pricing-card${featured ? ' featured' : ''} reveal">
        <div class="pricing-tier">${tier}</div>
        <div class="pricing-price">${price}<sub>${period}</sub></div>
        <div class="pricing-desc">${desc}</div>
        <ul class="pricing-features">${featureItems}</ul>
      </div>`;
  }

  function renderPricing() {
    const grid = document.getElementById('pricingGrid');
    if (!grid) return;
    grid.innerHTML = window.SL_DATA.pricing.map(pricingCardHTML).join('');
  }

  document.addEventListener('DOMContentLoaded', renderPricing);
})();
