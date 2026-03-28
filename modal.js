/**
 * modal.js
 * Handles the "Get Early Access" modal — open, close, email submit.
 * Depends on: nothing (pure DOM).
 */
(function () {
  'use strict';

  var overlay, box, closeBtn, emailInput, submitBtn, msgEl;

  function openModal() {
    overlay.classList.add('active');
    emailInput.focus();
  }

  function closeModal() {
    overlay.classList.remove('active');
    emailInput.value = '';
    msgEl.textContent = '';
    msgEl.className = 'modal-msg';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleSubmit() {
    var email = emailInput.value.trim();

    if (!email) {
      msgEl.textContent = 'Please enter your email address.';
      msgEl.className = 'modal-msg error';
      return;
    }

    if (!isValidEmail(email)) {
      msgEl.textContent = 'Please enter a valid email address.';
      msgEl.className = 'modal-msg error';
      return;
    }

    // Simulate async API call (replace with real fetch to /api/waitlist)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(function () {
      msgEl.textContent = '✓ You\'re on the list! We\'ll be in touch soon.';
      msgEl.className = 'modal-msg success';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Notify Me';
      emailInput.value = '';
    }, 1000);
  }

  function init() {
    overlay   = document.getElementById('modalOverlay');
    closeBtn  = document.getElementById('modalClose');
    emailInput = document.getElementById('emailInput');
    submitBtn = document.getElementById('submitEmail');
    msgEl     = document.getElementById('modalMsg');

    if (!overlay) return;

    // Trigger buttons
    var triggers = [
      document.getElementById('earlyAccessBtn'),
      document.getElementById('ctaMainBtn'),
    ];
    triggers.forEach(function (btn) {
      if (btn) btn.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay background click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    submitBtn.addEventListener('click', handleSubmit);

    emailInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSubmit();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
