/* =========================================================================
   cta-bar.js — Mobile Sticky CTA Bar
   =========================================================================
   Shows a persistent call-to-action bar on mobile screens (< 640px) after
   a 3-second delay OR once the user scrolls past the hero section.
   The bar auto-hides when the user reaches the appointment / contact
   section (they're already converting). Dismissal is remembered for the
   session via sessionStorage.
   ========================================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'ctaBarDismissed';
  var MOBILE_BREAKPOINT = 640;

  function initCtaBar() {

    var ctaBar     = document.querySelector('.cta-bar');
    var closeBtn   = ctaBar ? ctaBar.querySelector('.cta-close') : null;
    var hero       = document.querySelector('.hero, #hero, [data-section="hero"]');
    var appointment = document.querySelector('.appointment, #appointment, #book-appointment');
    var contact    = document.querySelector('.contact, #contact');

    if (!ctaBar) return;

    /* — State ----------------------------------------------------------- */
    var isDismissed   = sessionStorage.getItem(STORAGE_KEY) === '1';
    var hasShown      = false;
    var isVisible     = false;
    var timerFired    = false;
    var scrollPassed  = false;

    /* If previously dismissed this session, never show */
    if (isDismissed) return;

    /* — Helpers --------------------------------------------------------- */
    function isMobile() {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }

    function showBar() {
      if (isDismissed || isVisible || !isMobile()) return;
      isVisible = true;
      hasShown  = true;
      ctaBar.classList.add('visible');
      ctaBar.classList.remove('hidden');
    }

    function hideBar() {
      if (!isVisible) return;
      isVisible = false;
      ctaBar.classList.remove('visible');
      ctaBar.classList.add('hidden');
    }

    function dismissBar() {
      isDismissed = true;
      hideBar();
      sessionStorage.setItem(STORAGE_KEY, '1');
    }

    /* — Is user near a converting section? ------------------------------ */
    function isNearConversion() {
      var scrollY = window.scrollY;
      var viewH   = window.innerHeight;
      var bottomEdge = scrollY + viewH;

      /* Check appointment section */
      if (appointment) {
        var aTop = appointment.offsetTop;
        var aBot = aTop + appointment.offsetHeight;
        if (bottomEdge >= aTop + 80 && scrollY < aBot) return true;
      }

      /* Check contact section */
      if (contact) {
        var cTop = contact.offsetTop;
        var cBot = cTop + contact.offsetHeight;
        if (bottomEdge >= cTop + 80 && scrollY < cBot) return true;
      }

      return false;
    }

    /* — Close button ---------------------------------------------------- */
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dismissBar();
      });
    }

    /* — 3-second timer trigger ----------------------------------------- */
    setTimeout(function () {
      timerFired = true;
      if (!isDismissed && isMobile() && !isNearConversion()) {
        showBar();
      }
    }, 3000);

    /* — Scroll-based triggers ------------------------------------------ */
    var scrollTicking = false;

    window.addEventListener('scroll', function () {
      if (isDismissed) return;

      if (!scrollTicking) {
        requestAnimationFrame(function () {

          /* Trigger: scrolled past hero */
          if (!scrollPassed && hero) {
            var heroBottom = hero.offsetTop + hero.offsetHeight;
            if (window.scrollY > heroBottom) {
              scrollPassed = true;
            }
          }

          /* Should we show? */
          var shouldShow = (timerFired || scrollPassed) && isMobile();

          if (shouldShow && !isNearConversion()) {
            showBar();
          } else if (isNearConversion() && isVisible) {
            hideBar();
          } else if (!isNearConversion() && hasShown && !isVisible && shouldShow) {
            /* Re-show after leaving a conversion section */
            showBar();
          }

          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    /* — Resize: hide on desktop, re-evaluate on mobile ----------------- */
    window.addEventListener('resize', function () {
      if (isDismissed) return;

      if (!isMobile()) {
        hideBar();
      } else if (hasShown && !isNearConversion()) {
        showBar();
      }
    });

  } /* end initCtaBar */

  /* -----------------------------------------------------------------------
     Bootstrap
     ----------------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCtaBar);
  } else {
    initCtaBar();
  }

})();
