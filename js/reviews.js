/* ==========================================================================
   Reviews Page JS - Premium White & Blue Healthcare Design
   ========================================================================== */

(function () {
  'use strict';

  /* ================================
     1. Reviews Data
  ================================ */
  var reviewsData = [
    {
      id: 1, initials: 'RP', name: 'Ravi Prakash',
      treatment: 'Knee Replacement', treatmentSlug: 'knee-replacement',
      rating: 5,
      text: 'Dr. Your Name performed my mother\'s knee replacement surgery last year. From the first consultation to the final follow-up, the care was exceptional. She is now walking without pain for the first time in a decade. We are forever grateful to Dr. Your Name and the entire Your Clinic Name team.',
      location: 'Gomti Nagar, Your City', date: '3 months ago',
      dateSort: new Date('2026-02-28').getTime(),
      verified: true, helpful: 24, hasPhoto: false,
      doctorResponse: 'Thank you for your trust, Ravi! It was our privilege to care for your mother. - Dr. Your Name'
    },
    {
      id: 2, initials: 'AK', name: 'Arjun Kapoor',
      treatment: 'Sports Injury (ACL)', treatmentSlug: 'sports-injury',
      rating: 5,
      text: 'I had a severe ACL tear from a football accident. Dr. Your Name not only performed the reconstruction surgery flawlessly but also guided me through a structured rehab program. I was back on the field in 7 months. Best orthopedic surgeon in Your City.',
      location: 'Hazratganj, Your City', date: '1 month ago',
      dateSort: new Date('2026-04-28').getTime(),
      verified: true, helpful: 18, hasPhoto: false,
      doctorResponse: 'Watching you get back on the field was incredible! Keep playing. - Dr. Your Name'
    },
    {
      id: 3, initials: 'SM', name: 'Sunita Mehra',
      treatment: 'Fracture Care', treatmentSlug: 'fracture-care',
      rating: 5,
      text: 'My father had a complex hip fracture after a fall. Dr. Your Name operated urgently and the recovery was remarkable. His calm demeanor and clear explanations made a stressful time so much easier. Highly recommend Your Clinic Name.',
      location: 'Aliganj, Your City', date: '2 weeks ago',
      dateSort: new Date('2026-05-14').getTime(),
      verified: true, helpful: 31, hasPhoto: false,
      doctorResponse: null
    },
    {
      id: 4, initials: 'PS', name: 'Priya Singh',
      treatment: 'Spine Surgery', treatmentSlug: 'spine-surgery',
      rating: 5,
      text: 'After suffering from chronic back pain for 5 years, Dr. Your Name\'s microdiscectomy changed my life. The minimally invasive approach meant I was home in 2 days. I can finally play with my kids without pain. Can\'t thank him enough!',
      location: 'Indira Nagar, Your City', date: '1 month ago',
      dateSort: new Date('2026-04-28').getTime(),
      verified: false, helpful: 15, hasPhoto: false,
      doctorResponse: 'So happy to hear you\'re pain-free, Priya! - Dr. Your Name'
    },
    {
      id: 5, initials: 'MF', name: 'Mohd. Faizan',
      treatment: 'Hip Replacement', treatmentSlug: 'hip-replacement',
      rating: 4,
      text: 'Very professional doctor. My hip replacement surgery went smoothly. The only reason for 4 stars is the waiting time during follow-up visits, but the quality of care makes up for it. Would definitely recommend Dr. Your Name.',
      location: 'Aminabad, Your City', date: '2 months ago',
      dateSort: new Date('2026-03-28').getTime(),
      verified: true, helpful: 9, hasPhoto: false,
      doctorResponse: 'Thank you, Faizan. We\'re working on reducing wait times for follow-ups. - Dr. Your Name'
    },
    {
      id: 6, initials: 'AG', name: 'Ananya Gupta',
      treatment: 'Arthroscopy', treatmentSlug: 'knee-replacement',
      rating: 5,
      text: 'Had shoulder arthroscopy for a rotator cuff tear. Dr. Your Name explained everything clearly before surgery — the procedure, recovery timeline, and expected outcomes. Recovery was faster than expected. The physiotherapy team is also excellent.',
      location: 'Gomti Nagar, Your City', date: '3 weeks ago',
      dateSort: new Date('2026-05-07').getTime(),
      verified: true, helpful: 12, hasPhoto: false,
      doctorResponse: null
    },
    {
      id: 7, initials: 'VK', name: 'Vikas Kumar',
      treatment: 'Knee Replacement', treatmentSlug: 'knee-replacement',
      rating: 5,
      text: 'Both my parents got their knee replacements done by Dr. Your Name within 6 months of each other. The consistency in care and results was remarkable. The clinic is clean, well-equipped, and the staff is very supportive.',
      location: 'Gomti Nagar Extension, Your City', date: '4 months ago',
      dateSort: new Date('2026-01-15').getTime(),
      verified: true, helpful: 20, hasPhoto: false,
      doctorResponse: 'Thank you for trusting us with your entire family, Vikas! - Dr. Your Name'
    },
    {
      id: 8, initials: 'NN', name: 'Neha Narang',
      treatment: 'Spine Surgery', treatmentSlug: 'spine-surgery',
      rating: 5,
      text: 'I was terrified of spine surgery, but Dr. Your Name put all my fears to rest. He explained every step with such patience. The surgery was a success and my recovery has been smooth. Truly a blessing for Your City!',
      location: 'Hazratganj, Your City', date: '3 weeks ago',
      dateSort: new Date('2026-05-07').getTime(),
      verified: false, helpful: 14, hasPhoto: false,
      doctorResponse: null
    }
  ];

  /* ================================
     2. State
  ================================ */
  var state = {
    filter: 'all',
    sort: 'recent',
    search: '',
    visibleCount: 4,
    pageSize: 4,
    renderedCards: false
  };

  var reviewsGrid = document.getElementById('reviewsGrid');
  var loadMoreBtn = document.getElementById('loadMoreBtn');
  var loadMoreWrap = document.getElementById('loadMoreWrap');
  var noResults = document.getElementById('noResults');
  var showingCount = document.getElementById('showingCount');
  var searchInput = document.getElementById('searchInput');
  var sortSelect = document.getElementById('sortSelect');

  /* ================================
     3. Helper: Stars HTML
  ================================ */
  function starsHTML(rating) {
    var s = '';
    for (var i = 1; i <= 5; i++) {
      s += '<i class="fas fa-star text-' + (i <= rating ? 'amber-500' : 'gray-200') + ' text-xs sm:text-sm ' + (i <= rating ? 'star-filled' : '') + '"></i>';
    }
    return s;
  }

  /* ================================
     4. Helper: Star Sparkle
  ================================ */
  function sparkleStars(container) {
    if (!container) return;
    var stars = container.querySelectorAll('.star-filled');
    stars.forEach(function (s, i) {
      setTimeout(function () {
        s.classList.remove('star-sparkle');
        void s.offsetWidth;
        s.classList.add('star-sparkle');
      }, i * 150);
    });
  }

  /* ================================
     5. Render Single Review Card
  ================================ */
  function renderCard(r, index) {
    var ratingLabel = r.rating === 5 ? 'Excellent' : r.rating === 4 ? 'Very Good' : r.rating === 3 ? 'Good' : 'Average';
    var verifiedHTML = r.verified
      ? '<span class="verified-badge"><i class="fas fa-check-circle text-[8px]"></i> Verified Patient</span>'
      : '<span class="text-[10px] text-slate-300 font-medium">Community Member</span>';
    var responseHTML = r.doctorResponse
      ? '<div class="mt-4 pt-3 border-t border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent -mx-6 px-6 py-4 -mb-6 mt-auto"><div class="flex items-start gap-2"><div class="w-7 h-7 rounded-full bg-gradient-to-br from-brand-blue to-brand-indigo flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">DR</div><div><p class="text-xs text-slate-600"><span class="text-brand-blue font-bold not-italic">Dr. Your Name</span> <span class="text-slate-300 font-medium">replied:</span></p><p class="text-xs text-slate-500 italic mt-0.5">"' + r.doctorResponse + '"</p></div></div></div>'
      : '';
    var stars = starsHTML(r.rating);

    var html =
      '<div class="review-card bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col transition-all duration-350 hover:-translate-y-0.5" data-id="' + r.id + '" data-treatment="' + r.treatmentSlug + '" data-rating="' + r.rating + '" data-date="' + r.dateSort + '">' +
        '<div class="flex items-start gap-3 mb-3">' +
          '<div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-indigo flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0 shadow-md shadow-brand-blue/20 avatar-bounce ring-2 ring-white">' + r.initials + '</div>' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-center flex-wrap gap-1.5">' +
              '<h3 class="font-bold text-brand-slate text-sm sm:text-base truncate">' + r.name + '</h3>' +
              verifiedHTML +
            '</div>' +
            '<div class="flex items-center flex-wrap gap-1.5 mt-1.5">' +
              '<span class="treatment-tag">' + r.treatment + '</span>' +
              '<span class="text-slate-400 text-[10px] font-semibold">' + r.date + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-2 mb-3 review-stars">' +
          '<div class="flex items-center gap-0.5">' + stars + '</div>' +
          '<span class="text-xs text-brand-blue font-semibold">' + ratingLabel + '</span>' +
        '</div>' +
        '<div class="review-text text-slate-500 text-sm leading-relaxed mb-3 bg-slate-50/50 rounded-xl p-3 -mx-1">' +
          '<i class="fas fa-quote-left text-brand-blue/15 text-xs mr-1"></i>' +
          '<span class="review-text-content">' + r.text + '</span>' +
        '</div>' +
        '<div class="flex items-center gap-3 text-xs text-slate-400 mb-4 font-medium">' +
          '<span><i class="fas fa-map-marker-alt text-brand-blue/40 text-[10px] mr-1"></i>' + r.location + '</span>' +
          '<span class="text-slate-200">|</span>' +
          '<span><i class="fas fa-calendar text-brand-blue/40 text-[10px] mr-1"></i>' + r.date + '</span>' +
        '</div>' +
        '<div class="flex items-center justify-between flex-wrap gap-2 mt-auto pt-3 border-t border-slate-100">' +
          '<button class="helpful-btn text-xs text-slate-400 flex items-center gap-1.5 transition-all duration-200 hover:text-brand-blue font-semibold px-3 py-1.5 rounded-full hover:bg-brand-blue/5" data-id="' + r.id + '"><i class="fas fa-thumbs-up"></i> <span class="helpful-count">' + r.helpful + '</span></button>' +
          '<div class="flex items-center gap-1.5">' +
            '<button class="read-more-btn text-brand-blue text-xs font-bold hover:underline hidden">Read More <i class="fas fa-chevron-down text-[8px] ml-0.5"></i></button>' +
            '<a href="https://wa.me/91XXXXXXXXXX?text=Hello%20Doctor%2C%20I%20want%20to%20book%20an%20appointment%20for%20' + encodeURIComponent(r.treatment) + '" target="_blank" rel="noopener" class="text-xs font-bold text-white bg-gradient-to-r from-brand-blue to-brand-indigo px-4 py-2 rounded-full shadow-sm shadow-brand-blue/15 transition-all duration-300 hover:shadow-md hover:shadow-brand-blue/25 hover:-translate-y-0.5"><i class="fab fa-whatsapp text-white/90 text-[10px] mr-1"></i> Book Treatment</a>' +
          '</div>' +
        '</div>' +
        responseHTML +
      '</div>';
    return html;
  }

  /* ================================
     6. Filter & Sort Logic
  ================================ */
  function getFiltered() {
    var filtered = reviewsData.slice();

    // Filter by treatment
    if (state.filter !== 'all') {
      filtered = filtered.filter(function (r) { return r.treatmentSlug === state.filter; });
    }

    // Search
    if (state.search.trim()) {
      var q = state.search.trim().toLowerCase();
      filtered = filtered.filter(function (r) {
        return r.name.toLowerCase().indexOf(q) !== -1 ||
               r.text.toLowerCase().indexOf(q) !== -1 ||
               r.treatment.toLowerCase().indexOf(q) !== -1 ||
               r.location.toLowerCase().indexOf(q) !== -1;
      });
    }

    // Sort
    if (state.sort === 'recent') {
      filtered.sort(function (a, b) { return b.dateSort - a.dateSort; });
    } else if (state.sort === 'highest') {
      filtered.sort(function (a, b) { return b.rating - a.rating || b.dateSort - a.dateSort; });
    }

    return filtered;
  }

  function renderReviews() {
    if (!reviewsGrid) return;

    var filtered = getFiltered();
    var total = filtered.length;
    var show = Math.min(state.visibleCount, total);
    var sliced = filtered.slice(0, show);

    // Build HTML
    var html = '';
    for (var i = 0; i < sliced.length; i++) {
      html += renderCard(sliced[i], i);
    }
    reviewsGrid.innerHTML = html;

    // Results count
    if (showingCount) showingCount.textContent = show;
    var totalReviews = reviewsData.length;
    var resultsEl = document.getElementById('resultsCount');
    if (resultsEl) {
      resultsEl.innerHTML = 'Showing <strong class="text-brand-slate">' + show + '</strong> of <strong class="text-brand-slate">' + totalReviews + '</strong> reviews';
    }

    // Load more
    if (loadMoreBtn) {
      if (show >= total) {
        loadMoreBtn.textContent = 'All ' + total + ' reviews loaded';
        loadMoreBtn.disabled = true;
        loadMoreBtn.classList.add('opacity-60', 'cursor-not-allowed');
      } else {
        loadMoreBtn.textContent = 'Load More Reviews (' + (total - show) + ' remaining)';
        loadMoreBtn.disabled = false;
        loadMoreBtn.classList.remove('opacity-60', 'cursor-not-allowed');
      }
    }
    if (loadMoreWrap) {
      loadMoreWrap.style.display = total <= show ? 'none' : 'block';
    }

    // No results
    if (noResults) {
      noResults.classList.toggle('hidden', total > 0);
    }

    // Star sparkle
    var starContainers = reviewsGrid.querySelectorAll('.review-stars');
    starContainers.forEach(function (c, i) {
      setTimeout(function () { sparkleStars(c); }, i * 200);
    });

    // Read more logic
    var textContents = reviewsGrid.querySelectorAll('.review-text-content');
    textContents.forEach(function (el) {
      var fullText = el.textContent;
      if (fullText.length > 120) {
        var shortened = fullText.substring(0, 120) + '...';
        var parent = el.parentElement;
        var readMoreBtn = parent.parentElement.querySelector('.read-more-btn');
        if (readMoreBtn) {
          readMoreBtn.classList.remove('hidden');
          el.textContent = shortened;
          readMoreBtn.dataset.expanded = 'false';
          readMoreBtn.dataset.fullText = fullText;
        }
      }
    });

    // Helpful votes
    initHelpfulButtons();

    // Entry animation
    var cards = reviewsGrid.querySelectorAll('.review-card');
    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(function () {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 100);
    });

    state.renderedCards = true;
  }

  /* ================================
     7. Read More
  ================================ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.read-more-btn');
    if (!btn) return;
    e.preventDefault();
    var expanded = btn.dataset.expanded === 'true';
    var textContent = btn.closest('.review-card').querySelector('.review-text-content');
    var fullText = btn.dataset.fullText || textContent.textContent;
    if (expanded) {
      textContent.textContent = fullText.substring(0, 120) + '...';
      btn.innerHTML = 'Read More <i class="fas fa-chevron-down text-[8px] ml-0.5"></i>';
      btn.dataset.expanded = 'false';
    } else {
      textContent.textContent = fullText;
      btn.innerHTML = 'Read Less <i class="fas fa-chevron-up text-[8px] ml-0.5"></i>';
      btn.dataset.expanded = 'true';
    }
  });

  /* ================================
     8. Helpful Votes (localStorage)
  ================================ */
  function initHelpfulButtons() {
    var buttons = document.querySelectorAll('.helpful-btn');
    buttons.forEach(function (btn) {
      var id = btn.dataset.id;
      var countEl = btn.querySelector('.helpful-count');
      var voted = localStorage.getItem('review_helpful_' + id);

      if (voted) {
        btn.classList.add('text-brand-blue', 'pointer-events-none');
        btn.classList.remove('text-slate-400');
      }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.dataset.id;
        if (localStorage.getItem('review_helpful_' + id)) return;
        var count = parseInt(countEl.textContent, 10);
        count++;
        countEl.textContent = count;
        btn.classList.add('text-brand-blue', 'pointer-events-none');
        btn.classList.remove('text-slate-400');
        localStorage.setItem('review_helpful_' + id, 'true');
        // Animate
        btn.style.transition = 'none';
        btn.style.transform = 'scale(1.3)';
        setTimeout(function () {
          btn.style.transition = 'transform 0.3s ease';
          btn.style.transform = 'scale(1)';
        }, 50);
      });
    });
  }

  /* ================================
     9. Filter Pills
  ================================ */
  document.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      state.filter = pill.dataset.filter;
      state.visibleCount = 4;
      renderReviews();
    });
  });

  /* ================================
     10. Sort
  ================================ */
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = this.value;
      state.visibleCount = 4;
      renderReviews();
    });
  }

  /* ================================
     11. Search (debounced)
  ================================ */
  var searchTimer;
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.search = searchInput.value;
        state.visibleCount = 4;
        renderReviews();
      }, 300);
    });
  }

  /* ================================
     12. Clear Filters
  ================================ */
  var clearBtn = document.getElementById('clearFiltersBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach(function (p) {
        p.classList.toggle('active', p.dataset.filter === 'all');
      });
      state.filter = 'all';
      state.sort = 'recent';
      state.search = '';
      state.visibleCount = 4;
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'recent';
      renderReviews();
    });
  }

  /* ================================
     13. Load More
  ================================ */
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      state.visibleCount += state.pageSize;
      renderReviews();
    });
  }

  /* ================================
     14. Star Rating (Write Review)
  ================================ */
  var starContainer = document.getElementById('starRating');
  if (starContainer) {
    var selectedRating = 0;
    starContainer.querySelectorAll('i').forEach(function (star) {
      star.addEventListener('mouseenter', function () {
        var val = parseInt(star.dataset.star, 10);
        highlightStars(val);
      });
      star.addEventListener('click', function () {
        selectedRating = parseInt(star.dataset.star, 10);
        highlightStars(selectedRating);
      });
    });
    starContainer.addEventListener('mouseleave', function () {
      highlightStars(selectedRating);
    });
    function highlightStars(count) {
      starContainer.querySelectorAll('i').forEach(function (s) {
        var val = parseInt(s.dataset.star, 10);
        s.className = val <= count ? 'fas fa-star text-amber-500 cursor-pointer transition-all duration-150' : 'far fa-star text-slate-300 cursor-pointer transition-all duration-150';
      });
    }
  }

  /* ================================
     15. Counter Animation
  ================================ */
  function animateCounters() {
    document.querySelectorAll('.counter').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '+';
      var decimals = target % 1 === 0 ? 0 : 1;
      var duration = 2000;
      var startTime = null;
      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = eased * target;
        el.textContent = current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(animate);
    });
  }

  /* ================================
     16. GSAP Scroll Animations
  ================================ */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    gsap.from('.rating-summary-card', { y: 24, duration: 0.8, ease: 'power3.out', delay: 0.3, clearProps: 'transform' });
    var videoAnim = { y: 24, duration: 0.6, stagger: 0.12, ease: 'power2.out', clearProps: 'transform' };
    if (typeof ScrollTrigger !== 'undefined') {
      videoAnim.scrollTrigger = { trigger: '.video-card', start: 'top 85%' };
    }
    gsap.from('.video-card', videoAnim);
  }

  /* ================================
     17. Mobile Booking Bar Visibility
  ================================ */
  var mobileBar = document.getElementById('mobileBookingBar');
  var askDoctor = document.getElementById('askDoctor');
  if (mobileBar || askDoctor) {
    var heroSection = document.getElementById('reviews-hero');
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 500;
      if (mobileBar) {
        mobileBar.classList.toggle('visible', scrollY > heroBottom - 100);
      }
      if (askDoctor) {
        askDoctor.classList.toggle('visible', scrollY > 600);
      }
    });
  }

  /* ================================
     18. Filter Bar Shadow
  ================================ */
  var filterBar = document.getElementById('filterBar');
  if (filterBar) {
    window.addEventListener('scroll', function () {
      filterBar.classList.toggle('scrolled', window.pageYOffset > 20);
    });
  }

  /* ================================
     19. Write Review Form
  ================================ */
  var reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = reviewForm.querySelector('button[type="submit"]');
      btn.textContent = 'Thank You!';
      btn.classList.add('bg-brand-emerald', 'text-white');
      btn.classList.remove('bg-brand-blue');
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Submit Your Review';
        btn.classList.remove('bg-brand-emerald', 'text-white');
        btn.classList.add('bg-brand-blue');
        btn.disabled = false;
        reviewForm.reset();
        if (starContainer) highlightStars(0);
      }, 3000);
    });
  }

  /* ================================
     20. Init
  ================================ */
  function initReviewsPage() {
    renderReviews();
    animateCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewsPage, { once: true });
  } else {
    initReviewsPage();
  }

})();
