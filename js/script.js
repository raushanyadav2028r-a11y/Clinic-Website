
    document.addEventListener("DOMContentLoaded", function () {
      // 1. Fixed Header & Scrolled Class
      var header = document.getElementById("siteHeader");
      
      function checkScroll() {
        if (window.scrollY > 60) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
      window.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll(); // Initial check

      // 2. Mobile Right-Side Drawer Navigation
      var navToggle   = document.getElementById("navToggle");
      var drawer      = document.getElementById("mobileDrawer");
      var backdrop    = document.getElementById("menuBackdrop");
      var drawerClose = document.getElementById("drawerClose");
      var drawerLinks = Array.from(drawer.querySelectorAll("a"));
      // Also keep desktop nav-menu links for active-state tracking
      var navMenu     = document.getElementById("navMenu");
      var navLinks    = Array.from(document.querySelectorAll(".nav-menu a, .drawer-nav a"));

      function openDrawer() {
        drawer.style.display   = "flex";
        backdrop.style.display = "block";
        // Force reflow so transitions fire
        drawer.getBoundingClientRect();
        backdrop.getBoundingClientRect();
        drawer.classList.add("open");
        backdrop.classList.add("active");
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.style.overflow = "hidden";
        document.getElementById("floatCall").classList.add("hide-float");
        document.getElementById("floatWA").classList.add("hide-float");
        setTimeout(function () {
          var firstLink = drawer.querySelector("a");
          if (firstLink) firstLink.focus();
        }, 100);
      }

      function closeDrawer() {
        drawer.classList.remove("open");
        backdrop.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
        document.body.style.overflow = "";
        document.getElementById("floatCall").classList.remove("hide-float");
        document.getElementById("floatWA").classList.remove("hide-float");
        navToggle.focus();
        // Hide after transition
        setTimeout(function () {
          if (!drawer.classList.contains("open")) {
            drawer.style.display   = "none";
            backdrop.style.display = "none";
          }
        }, 460);
      }

      function toggleDrawer(event) {
        event.stopPropagation();
        drawer.classList.contains("open") ? closeDrawer() : openDrawer();
      }

      navToggle.addEventListener("click", toggleDrawer);
      drawerClose.addEventListener("click", closeDrawer);

      // Close on drawer link click
      drawerLinks.forEach(function (link) {
        link.addEventListener("click", closeDrawer);
      });

      // Close on backdrop click
      backdrop.addEventListener("click", closeDrawer);

      // Escape key closes
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && drawer.classList.contains("open")) {
          closeDrawer();
        }
      });

      // Swipe gestures: left-edge swipe right = open, swipe left = close
      var touchStartX = 0;
      var touchStartY = 0;

      document.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      }, { passive: true });

      document.addEventListener("touchend", function (e) {
        var diffX = e.changedTouches[0].clientX - touchStartX;
        var diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
          // Swipe right on left edge → open
          if (diffX > 60 && touchStartX < 40 && !drawer.classList.contains("open")) {
            openDrawer();
          }
          // Swipe left anywhere when open → close
          if (diffX < -60 && drawer.classList.contains("open")) {
            closeDrawer();
          }
        }
      }, { passive: true });

      // Focus trap inside drawer
      var focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      drawer.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        var focusable = Array.from(drawer.querySelectorAll(focusableSelectors));
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { last.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
      });

      // 3. Smooth Reveals & Link Active Tracking using IntersectionObserver
      if ("IntersectionObserver" in window) {
        // Section Reveal Observer
        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });

        document.querySelectorAll(".reveal").forEach(function (el) {
          revealObserver.observe(el);
        });

        // Navigation Active Links Observer
        var navObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var sectionId = entry.target.id;
              navLinks.forEach(function (link) {
                var hrefId = link.getAttribute("href").substring(1);
                link.classList.toggle("active", hrefId === sectionId);
              });
            }
          });
        }, { rootMargin: "-45% 0px -48% 0px", threshold: 0 });

        document.querySelectorAll("main section[id]").forEach(function (section) {
          navObserver.observe(section);
        });
      } else {
        // Fallback for browsers lacking observer support
        document.querySelectorAll(".reveal").forEach(function (el) {
          el.classList.add("visible");
        });
      }

      // 4. Accordion Toggle Logic with scrollHeight adjustment
      var faqItems = Array.from(document.querySelectorAll(".faq-item"));

      function adjustFaqHeight(item) {
        var answer = item.querySelector(".faq-answer");
        if (item.classList.contains("open")) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.style.maxHeight = "0px";
        }
      }

      faqItems.forEach(function (item) {
        var button = item.querySelector(".faq-question");
        // Initialize height states
        adjustFaqHeight(item);

        button.addEventListener("click", function () {
          var isCurrentOpen = item.classList.contains("open");

          // Close all accordion panels
          faqItems.forEach(function (other) {
            other.classList.remove("open");
            other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            adjustFaqHeight(other);
          });

          // Toggle current panel
          if (!isCurrentOpen) {
            item.classList.add("open");
            button.setAttribute("aria-expanded", "true");
            adjustFaqHeight(item);
          }
        });
      });

      // Re-calculate open panel scroll heights on window resizing
      window.addEventListener("resize", function () {
        faqItems.forEach(adjustFaqHeight);
      }, { passive: true });

      // 5. Contact Form Submit Validation & WhatsApp Link Generator
      var appointmentForm = document.getElementById("appointmentForm");
      var patientName = document.getElementById("patientName");
      var patientPhone = document.getElementById("patientPhone");
      var nameError = document.getElementById("nameError");
      var phoneError = document.getElementById("phoneError");
      var appointmentStatus = document.getElementById("appointmentStatus");
      var appointmentSubmitBtn = document.getElementById("appointmentSubmitBtn");

      // Restrict name to letters/spaces and phone to digits only
      if (patientName) {
        patientName.addEventListener("input", function () {
          this.value = this.value.replace(/[^A-Za-z\s]/g, "");
        });
      }

      if (patientPhone) {
        patientPhone.addEventListener("input", function () {
          this.value = this.value.replace(/[^0-9]/g, "");
        });
      }

      appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Clear error flags
        nameError.classList.remove("show");
        phoneError.classList.remove("show");
        appointmentStatus.classList.remove("show");

        var nameVal = patientName.value.trim();
        var phoneVal = patientPhone.value.trim();
        var cleanDigits = phoneVal.replace(/\D/g, "");
        var nameIsValid = /^[A-Za-z\s]+$/.test(nameVal);

        var hasError = false;

        // Perform validations
        if (!nameVal || !nameIsValid) {
          nameError.classList.add("show");
          patientName.focus();
          hasError = true;
        }

        if (cleanDigits.length < 10) {
          phoneError.classList.add("show");
          if (!hasError) {
            patientPhone.focus();
          }
          hasError = true;
        }

        if (hasError) {
          return;
        }

        // Fetch selected reason value from custom radio card inputs
        var checkedRadio = appointmentForm.querySelector("input[name='reason']:checked");
        var reasonVal = checkedRadio ? checkedRadio.value : "Routine Checkup";

        // Generate pre-filled WhatsApp text block
        var textPayload = 
          "Hi Dr. Arjun Mehta,\n" +
          "I want to book an appointment.\n\n" +
          "Name: " + nameVal + "\n" +
          "Phone: " + phoneVal + "\n" +
          "Reason: " + reasonVal + "\n\n" +
          "Please confirm availability.";

        var waUrl = "https://wa.me/919576689637?text=" + encodeURIComponent(textPayload);

        // Show loading status and trigger URL launch
        appointmentSubmitBtn.disabled = true;
        appointmentSubmitBtn.textContent = "Opening WhatsApp...";
        appointmentStatus.classList.add("show");

        window.open(waUrl, "_blank");

        // Re-enable trigger after a short window
        setTimeout(function () {
          appointmentSubmitBtn.disabled = false;
          appointmentSubmitBtn.textContent = "Send Appointment Request via WhatsApp →";
        }, 3000);
      }); // ← closes appointmentForm submit handler

      // Highlight the contact form after hero button scroll
      var heroBookBtn = document.querySelector('.hero-book-btn');
      if (heroBookBtn) {
        heroBookBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }

          setTimeout(function () {
            var highlightTarget = document.querySelector('.appointment-form-card') || document.querySelector('#appointmentForm') || document.querySelector('form');
            if (highlightTarget) {
              highlightTarget.style.transition = 'box-shadow 0.4s ease';
              highlightTarget.style.boxShadow  = '0 0 0 2px #DC1E32, 0 0 30px rgba(220,30,50,0.30)';
              setTimeout(function () {
                highlightTarget.style.boxShadow = '';
              }, 2000);
            }
          }, 900);
        });
      }

      // 6. Typewriter autotype effect on H1 heading
      (function () {
        var typedEl = document.getElementById('typed-word');
        if (!typedEl) {
          console.error('typed-word element not found');
          return;
        }

        var words = [
          'Radial Angioplasty',
          'Pacemaker Implants',
          'Heart Failure Care',
          'Coronary Stenting',
          'Cardiac Diagnosis',
          '3D Echo & TMT',
          'ICD Implantation',
          'Preventive Cardiology'
        ];

        var wordIndex  = 0;
        var charIndex  = 0;
        var isDeleting = false;
        var isPaused   = false;

        function type() {
          var currentWord = words[wordIndex];

          if (isPaused) {
            isPaused   = false;
            isDeleting = true;
            setTimeout(type, 1400);
            return;
          }

          if (!isDeleting) {
            typedEl.textContent = currentWord.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentWord.length) {
              isPaused  = true;
              charIndex = currentWord.length;
              setTimeout(type, 1400);
              return;
            }
            setTimeout(type, 80);
          } else {
            typedEl.textContent = currentWord.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
              isDeleting = false;
              wordIndex  = (wordIndex + 1) % words.length;
              setTimeout(type, 350);
              return;
            }
            setTimeout(type, 45);
          }
        }

        setTimeout(type, 800);
      })();

    }); // ← closes DOMContentLoaded
  