/* =========================================================================
   script.js — Main Orthopedic Clinic Website Controller
   =========================================================================
   Orchestrates: GSAP scroll animations, mobile navigation, typing effect,
   stat counters, footer accordion, back-to-top, newsletter, and more.
   ========================================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     initClinicSite — Master initialiser
     ----------------------------------------------------------------------- */
  function initClinicSite() {

    /* — Cache DOM refs --------------------------------------------------- */
    const body          = document.body;
    const navbar        = document.querySelector('.navbar');
    const navToggle     = document.querySelector('.nav-toggle');
    const navLinks      = document.querySelector('.nav-links');
    const navOverlay    = document.querySelector('.nav-overlay');
    const backToTopBtn  = document.querySelector('.back-to-top');
    const typingTarget  = document.getElementById('typingText');

    /* =====================================================================
       1. GSAP SETUP
       ===================================================================== */
    const gsapReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    if (gsapReady) {
      gsap.registerPlugin(ScrollTrigger);

      /* Refresh triggers after images / fonts settle */
      window.addEventListener('load', function () {
        ScrollTrigger.refresh();
      });
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 2000);
    }

    /* =====================================================================
       2. MOBILE NAVIGATION
       ===================================================================== */
    function openMobileNav() {
      if (navToggle)  navToggle.classList.add('active');
      if (navLinks)   navLinks.classList.add('open');
      if (navOverlay) navOverlay.classList.add('open');
      body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      if (navToggle)  navToggle.classList.remove('active');
      if (navLinks)   navLinks.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('open');
      body.style.overflow = '';
    }

    if (navToggle) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks && navLinks.classList.contains('open');
        isOpen ? closeMobileNav() : openMobileNav();
      });
    }

    /* Close on overlay click */
    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileNav);
    }

    /* Close on menu close button click */
    document.querySelectorAll('.nav-menu-close').forEach(function (btn) {
      btn.addEventListener('click', closeMobileNav);
    });

    /* Close on nav-link click */
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMobileNav);
      });
    }

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    /* Close when resizing to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) closeMobileNav();
    });

    /* =====================================================================
       3. NAVBAR SCROLL STATE
       ===================================================================== */
    var scrollTicking = false;

    function updateNavbar() {
      if (!navbar) return;
      if (window.scrollY > 12) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      scrollTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(updateNavbar);
        scrollTicking = true;
      }
    }, { passive: true });

    /* Fire once on load */
    updateNavbar();

    /* =====================================================================
       4. ACTIVE SECTION TRACKING
       ===================================================================== */
    var sections = document.querySelectorAll('section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightActiveSection() {
      var scrollPos = window.scrollY + window.innerHeight * 0.35;

      sections.forEach(function (section) {
        var top    = section.offsetTop;
        var height = section.offsetHeight;
        var id     = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navAnchors.forEach(function (a) {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + id) {
              a.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    highlightActiveSection();

    /* =====================================================================
       5. TYPING ANIMATION
       ===================================================================== */
    if (typingTarget) {
      var phrases = [
        'Your Journey to Pain-Free Movement Starts Here',
        'Expert Orthopedic Care You Can Trust',
        'Regain Your Mobility, Reclaim Your Life'
      ];

      var phraseIdx   = 0;
      var charIdx     = 0;
      var isDeleting  = false;
      var typeSpeed   = 60;   // ms per character (typing)
      var deleteSpeed = 30;   // ms per character (deleting)
      var pauseTime   = 2000; // ms pause between phrases

      function typeLoop() {
        var current = phrases[phraseIdx];

        if (!isDeleting) {
          /* Typing forward */
          charIdx++;
          typingTarget.textContent = current.substring(0, charIdx);

          if (charIdx === current.length) {
            /* Finished typing — pause then start deleting */
            isDeleting = true;
            setTimeout(typeLoop, pauseTime);
            return;
          }
          setTimeout(typeLoop, typeSpeed);
        } else {
          /* Deleting */
          charIdx--;
          typingTarget.textContent = current.substring(0, charIdx);

          if (charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(typeLoop, 400); // brief pause before next phrase
            return;
          }
          setTimeout(typeLoop, deleteSpeed);
        }
      }

      /* Kick off after a short delay so the hero is visible first */
      setTimeout(typeLoop, 800);
    }

    /* =====================================================================
       6. GSAP SCROLL ANIMATIONS
       ===================================================================== */
    if (gsapReady) {
      initGSAPAnimations();
    } else {
      /* Fallback — make everything visible immediately */
      document.querySelectorAll(
        '.hero-content, .hero-image, .stat-item, .about-image, ' +
        '.about-content, .why-card, .appointment, ' +
        '.contact-card, .contact-map-wrap iframe, footer'
      ).forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }

    function initGSAPAnimations() {

      /* — Helper: default ScrollTrigger settings ----------------------- */
      function stDefaults(trigger, start) {
        return {
          trigger: trigger,
          start: start || 'top 88%',
          toggleActions: 'play none none none'
        };
      }

      /* — Hero content ------------------------------------------------- */
      var heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        gsap.from(heroContent, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: stDefaults(heroContent, 'top 95%')
        });
      }

      /* — Hero image --------------------------------------------------- */
      var heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        gsap.from(heroImage, {
          x: 60,
          opacity: 0,
          duration: 1.1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: stDefaults(heroImage, 'top 95%')
        });
      }

      /* — Stats counter ------------------------------------------------ */
      var statsBar = document.querySelector('.stats-bar');
      if (statsBar) {
        var statNumbers = statsBar.querySelectorAll('.stat-number');

        ScrollTrigger.create({
          trigger: statsBar,
          start: 'top 90%',
          once: true,
          onEnter: function () {
            statNumbers.forEach(function (el) {
              animateCounter(el);
            });
          }
        });
      }

      /* — About image -------------------------------------------------- */
      var aboutImage = document.querySelector('.about-image');
      if (aboutImage) {
        gsap.from(aboutImage, {
          x: -36,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: stDefaults(aboutImage)
        });
      }

      /* — About content children --------------------------------------- */
      var aboutContent = document.querySelector('.about-content');
      if (aboutContent) {
        gsap.from(aboutContent.children, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: stDefaults(aboutContent)
        });
      }

      /* — Why Choose cards --------------------------------------------- */
      var whyCards = document.querySelectorAll('.why-card');
      if (whyCards.length) {
        gsap.from(whyCards, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: stDefaults(whyCards[0])
        });
      }

      /* — Appointment section ------------------------------------------ */
      var appointmentSection = document.querySelector('.appointment');
      if (appointmentSection) {
        gsap.from(appointmentSection.children, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: stDefaults(appointmentSection)
        });
      }

      /* — Contact cards ------------------------------------------------ */
      var contactCards = document.querySelectorAll('.contact-card');
      if (contactCards.length) {
        gsap.from(contactCards, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: stDefaults(contactCards[0])
        });
      }

      /* — Map iframe --------------------------------------------------- */
      var mapIframe = document.querySelector('.contact-map-wrap iframe');
      if (mapIframe) {
        gsap.from(mapIframe, {
          scale: 0.98,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: stDefaults(mapIframe)
        });
      }

      /* — Footer ------------------------------------------------------- */
      var footer = document.querySelector('footer');
      if (footer) {
        gsap.from(footer, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: stDefaults(footer, 'top 98%')
        });
      }
    }

    /* — Counter animation helper --------------------------------------- */
    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000; // ms
      var startTime = null;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easedProgress = easeOutCubic(progress);
        var current = Math.floor(easedProgress * target);

        el.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    /* =====================================================================
       7. VISIBILITY SAFETY NET
       ===================================================================== */
    var animatedSelectors = [
      '.hero-content', '.hero-image', '.stat-item', '.about-image',
      '.about-content', '.service-card-premium', '.why-card',
      '.appointment', '.contact-card', '.contact-map-wrap iframe',
      'footer', '.review-card-premium', '.services-cta-banner'
    ];

    function ensureVisibility() {
      animatedSelectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          var opacity = window.getComputedStyle(el).opacity;
          if (parseFloat(opacity) < 0.1) {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      });
    }

    /* Two-pass safety: at load + 700ms, and after 2.2s absolute */
    setTimeout(ensureVisibility, 2200);
    window.addEventListener('load', function () {
      setTimeout(ensureVisibility, 700);
    });

    /* =====================================================================
       8. FOOTER ACCORDION (Mobile)
       ===================================================================== */
    var footerItems = document.querySelectorAll('.accordion-item');

    footerItems.forEach(function (item) {
      var header = item.querySelector('.accordion-header');
      if (!header) return;

      header.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        /* Close all others */
        footerItems.forEach(function (other) {
          other.classList.remove('active');
          var content = other.querySelector('.accordion-content');
          if (content) content.style.maxHeight = null;
        });

        /* Toggle current */
        if (!isActive) {
          item.classList.add('active');
          var content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });

    /* On desktop resize → expand all */
    function handleFooterResize() {
      if (window.innerWidth >= 768) {
        footerItems.forEach(function (item) {
          item.classList.add('active');
          var content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = 'none';
        });
      }
    }

    window.addEventListener('resize', handleFooterResize);
    handleFooterResize();

    /* =====================================================================
       9. BACK TO TOP BUTTON
       ===================================================================== */
    if (backToTopBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* =====================================================================
       10. NEWSLETTER FORM
       ===================================================================== */
    var newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var btn = newsletterForm.querySelector('button');
        if (!btn) return;

        var originalText = btn.textContent;
        var originalBg   = btn.style.backgroundColor;

        btn.textContent = 'Subscribed! ✓';
        btn.style.backgroundColor = '#28a745';
        btn.disabled = true;

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.backgroundColor = originalBg;
          btn.disabled = false;
          newsletterForm.reset();
        }, 2500);
      });
    }

    /* =====================================================================
       11. TOUCH DEVICE DETECTION
       ===================================================================== */
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      body.classList.add('touch-device');
    }

  } /* end initClinicSite */

  /* -----------------------------------------------------------------------
     Bootstrap
     ----------------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClinicSite);
  } else {
    initClinicSite();
  }

})();
