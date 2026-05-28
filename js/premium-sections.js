/* =========================================================================
   premium-sections.js — Services & Reviews Animations
   =========================================================================
   Handles: Service card reveals, review card reveals, review stats counter,
   mobile review carousel with dot sync, helpful button toggle, and
   services CTA banner animation. Falls back to IntersectionObserver
   when GSAP is unavailable.
   ========================================================================= */

(function () {
  'use strict';

  function initPremiumSections() {

    var gsapReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    /* =====================================================================
       1. SERVICE CARD GSAP ANIMATIONS
       ===================================================================== */
    var serviceCards = document.querySelectorAll('.service-card-premium');

    if (gsapReady && serviceCards.length) {
      gsap.fromTo(serviceCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: serviceCards[0].parentElement || serviceCards[0],
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    /* =====================================================================
       2. REVIEW CARD GSAP ANIMATIONS
       ===================================================================== */
    var reviewCards = document.querySelectorAll('.review-card-premium');

    if (gsapReady && reviewCards.length) {
      gsap.fromTo(reviewCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: reviewCards[0].parentElement || reviewCards[0],
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    /* =====================================================================
       3. REVIEW STATS COUNTER ANIMATION
       ===================================================================== */
    var reviewStatNumbers = document.querySelectorAll('.review-stat-number');

    if (reviewStatNumbers.length) {
      var reviewStatsTriggered = false;

      /* Parse targets like '10k', '4.9+', '15+' */
      function parseStatTarget(raw) {
        raw = (raw || '').trim();
        var suffix = '';
        var numStr = raw;

        /* Extract trailing suffix characters: k, +, %, etc. */
        var match = raw.match(/^([0-9.]+)(.*)$/);
        if (match) {
          numStr = match[1];
          suffix = match[2];
        }

        return {
          value: parseFloat(numStr) || 0,
          isFloat: numStr.indexOf('.') !== -1,
          suffix: suffix
        };
      }

      function animateReviewCounter(el) {
        var raw = el.getAttribute('data-target') || el.textContent;
        var parsed = parseStatTarget(raw);
        var duration = 1800;
        var startTime = null;

        function easeOutCubic(t) {
          return 1 - Math.pow(1 - t, 3);
        }

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = easeOutCubic(progress);
          var current = eased * parsed.value;

          if (parsed.isFloat) {
            el.textContent = current.toFixed(1) + parsed.suffix;
          } else {
            el.textContent = Math.floor(current).toLocaleString() + parsed.suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            /* Snap to exact final value */
            if (parsed.isFloat) {
              el.textContent = parsed.value.toFixed(1) + parsed.suffix;
            } else {
              el.textContent = parsed.value.toLocaleString() + parsed.suffix;
            }
          }
        }

        requestAnimationFrame(step);
      }

      function triggerReviewCounters() {
        if (reviewStatsTriggered) return;
        reviewStatsTriggered = true;
        reviewStatNumbers.forEach(animateReviewCounter);
      }

      /* Use GSAP ScrollTrigger if available, otherwise IntersectionObserver */
      if (gsapReady) {
        var statsContainer = reviewStatNumbers[0].closest('.review-stats') ||
                             reviewStatNumbers[0].parentElement;
        if (statsContainer) {
          ScrollTrigger.create({
            trigger: statsContainer,
            start: 'top 90%',
            once: true,
            onEnter: triggerReviewCounters
          });
        }
      } else {
        var statsObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              triggerReviewCounters();
              statsObserver.disconnect();
            }
          });
        }, { threshold: 0.2 });

        var statsWrap = reviewStatNumbers[0].closest('.review-stats') ||
                        reviewStatNumbers[0].parentElement;
        if (statsWrap) statsObserver.observe(statsWrap);
      }
    }

    /* =====================================================================
       4. REVIEW CAROUSEL (Mobile Horizontal Scroll)
       ===================================================================== */
    var reviewGrid = document.querySelector('.reviews-premium-grid');
    var carouselDots = document.querySelectorAll('.review-dot');

    if (reviewGrid && carouselDots.length) {

      /* Sync dots on scroll */
      var dotScrollTicking = false;

      reviewGrid.addEventListener('scroll', function () {
        if (!dotScrollTicking) {
          requestAnimationFrame(function () {
            updateActiveDot();
            dotScrollTicking = false;
          });
          dotScrollTicking = true;
        }
      }, { passive: true });

      function updateActiveDot() {
        var cards = reviewGrid.querySelectorAll('.review-card-premium');
        if (!cards.length) return;

        var scrollLeft = reviewGrid.scrollLeft;
        var cardWidth = cards[0].offsetWidth;
        var gap = parseInt(window.getComputedStyle(reviewGrid).gap, 10) || 16;
        var activeIdx = Math.round(scrollLeft / (cardWidth + gap));

        activeIdx = Math.max(0, Math.min(activeIdx, carouselDots.length - 1));

        carouselDots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === activeIdx);
        });
      }

      /* Click dot → scroll to card */
      carouselDots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          var cards = reviewGrid.querySelectorAll('.review-card-premium');
          if (!cards[i]) return;

          var cardWidth = cards[i].offsetWidth;
          var gap = parseInt(window.getComputedStyle(reviewGrid).gap, 10) || 16;
          var targetScroll = i * (cardWidth + gap);

          reviewGrid.scrollTo({ left: targetScroll, behavior: 'smooth' });
        });
      });

      /* Initialise first dot */
      updateActiveDot();
    }

    /* =====================================================================
       5. REVIEW HELPFUL BUTTON
       ===================================================================== */
    var helpfulBtns = document.querySelectorAll('.review-helpful-btn');

    helpfulBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isActive = btn.classList.toggle('active');

        /* Update count if a counter span exists */
        var countEl = btn.querySelector('.helpful-count');
        if (countEl) {
          var count = parseInt(countEl.textContent, 10) || 0;
          countEl.textContent = isActive ? count + 1 : Math.max(0, count - 1);
        }

        /* Micro-interaction: brief scale pulse */
        btn.style.transform = 'scale(1.15)';
        setTimeout(function () {
          btn.style.transform = '';
        }, 200);
      });
    });

    /* =====================================================================
       6. INTERSECTION OBSERVER FALLBACK
       ===================================================================== */
    if (!gsapReady) {
      var revealEls = document.querySelectorAll('.service-card-premium, .review-card-premium');

      if (revealEls.length) {
        /* Set initial hidden state */
        revealEls.forEach(function (el) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
              revealObserver.unobserve(el);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) {
          revealObserver.observe(el);
        });
      }
    }

    /* =====================================================================
       7. SERVICES CTA BANNER ANIMATION
       ===================================================================== */
    var ctaBanner = document.querySelector('.services-cta-banner');

    if (ctaBanner) {
      if (gsapReady) {
        gsap.from(ctaBanner, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaBanner,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });
      } else {
        /* IO fallback for the CTA banner */
        ctaBanner.style.opacity = '0';
        ctaBanner.style.transform = 'translateY(24px)';
        ctaBanner.style.transition = 'opacity 0.7s ease, transform 0.7s ease';

        var bannerObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              ctaBanner.style.opacity = '1';
              ctaBanner.style.transform = 'translateY(0)';
              bannerObserver.disconnect();
            }
          });
        }, { threshold: 0.2 });

        bannerObserver.observe(ctaBanner);
      }
    }

  } /* end initPremiumSections */

  /* -----------------------------------------------------------------------
     Bootstrap
     ----------------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumSections);
  } else {
    initPremiumSections();
  }

})();
