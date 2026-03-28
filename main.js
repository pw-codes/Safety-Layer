/**
 * main.js
 * App bootstrap: scroll-reveal observer, navbar scroll effect.
 * Depends on: all other modules already loaded.
 */
(function () {
  'use strict';

  /* ── Scroll-reveal (IntersectionObserver) ── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all .reveal elements added by other modules
    // We run this slightly deferred so dynamic content is in the DOM
    setTimeout(function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
      });
    }, 100);
  }

  /* ── Navbar scroll tint ── */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbar.style.borderBottomColor = 'rgba(0,229,255,0.2)';
      } else {
        navbar.style.borderBottomColor = '';
      }
    }, { passive: true });
  }

  /* ── Smooth-scroll for nav links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initNavbar();
    initSmoothScroll();
    console.log('[SafeLayer] Frontend initialized ✓');
  });
})();
