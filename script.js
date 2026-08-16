/* ==========================================================================
   RANA ESPORTS — PRODUCTION JAVASCRIPT ENGINE (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ===== 1. GLOBAL SCROLL ENGINE =====
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 40) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');

        if (scrollPosition > 400) backToTopBtn?.classList.add('show');
        else backToTopBtn?.classList.remove('show');

        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== 2. SIDEBAR MENU =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar?.classList.add('open');
    sidebarOverlay?.classList.add('active');
    sidebar?.setAttribute('aria-hidden', 'false');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }
  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarOverlay?.classList.remove('active');
    sidebar?.setAttribute('aria-hidden', 'true');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    if (!isAnyOverlayOpen()) document.body.classList.remove('no-scroll');
  }
  hamburgerBtn?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);
  // In-page anchor links (and the legal page links, which now navigate
  // away to their own .html files) close the sidebar on click.
  document.querySelectorAll('.sidebar-link[href]').forEach((link) => link.addEventListener('click', closeSidebar));

  // ===== 3. REVIEW MODAL =====
  const openReviewModalBtn = document.getElementById('openReviewModalBtn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewModalOverlay = document.getElementById('reviewModalOverlay');
  const reviewModalClose = document.getElementById('reviewModalClose');

  function openReviewModal() {
    closeSidebar();
    reviewModal?.classList.add('open');
    reviewModalOverlay?.classList.add('active');
    reviewModal?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  function closeReviewModal() {
    reviewModal?.classList.remove('open');
    reviewModalOverlay?.classList.remove('active');
    reviewModal?.setAttribute('aria-hidden', 'true');
    if (!isAnyOverlayOpen()) document.body.classList.remove('no-scroll');
  }

  openReviewModalBtn?.addEventListener('click', openReviewModal);
  reviewModalClose?.addEventListener('click', closeReviewModal);
  reviewModalOverlay?.addEventListener('click', closeReviewModal);

  function isAnyOverlayOpen() {
    return sidebar?.classList.contains('open') ||
           reviewModal?.classList.contains('open');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (reviewModal?.classList.contains('open')) closeReviewModal();
    else if (sidebar?.classList.contains('open')) closeSidebar();
  });

  // ===== 3B. URL HASH -> REDIRECT OLD LEGAL-DRAWER LINKS (payment gateway
  // KYC links used to point at #disclaimer, #privacy-policy, etc. Those
  // sections now live on their own pages, so forward old links there
  // automatically instead of 404-ing or doing nothing.) =====
  (function handleLegalHashOnLoad() {
    const LEGAL_PAGE_MAP = {
      'disclaimer': 'disclaimer.html',
      'privacy-policy': 'privacy-policy.html',
      'data-deletion': 'data-deletion.html',
      'terms': 'terms.html',
      'refund': 'refund.html'
    };
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    if (LEGAL_PAGE_MAP[hash]) {
      window.location.replace(LEGAL_PAGE_MAP[hash]);
    } else if (hash === 'contactUs') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(() => {
          const offset = window.innerWidth < 640 ? 64 : 80;
          const destY = contactSection.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: destY, behavior: 'smooth' });
        }, 300);
      }
    }
  })();

  // ===== 5. UPDATE BANNER SWIPER =====
  if (document.querySelector('.updateSwiper') && window.Swiper) {
    new Swiper('.updateSwiper', {
      loop: true,
      speed: 700,
      grabCursor: true,
      touchEventsTarget: 'container',
      resistanceRatio: 0.85,
      autoplay: { delay: 4500, disableOnInteraction: false },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true }
    });
  }

  // ===== 6. APP PREVIEW SWIPER =====
  if (document.querySelector('.previewSwiper') && window.Swiper) {
    new Swiper('.previewSwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      speed: 550,
      touchReleaseOnEdges: true,
      coverflowEffect: { rotate: 12, stretch: -8, depth: 100, modifier: 1.1, slideShadows: true },
      loop: true,
      autoplay: { delay: 3200, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true }
    });
  }

  // ===== 7. CASCADE REVEAL ON SCROLL (dashboard sections only) =====
  const revealTargets = document.querySelectorAll('.feature-card, .stat-block');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  revealTargets.forEach((card, index) => {
    const staggerIndex = window.innerWidth > 768 ? (index % 4) : (index % 2);
    card.style.setProperty('--stagger-delay', `${staggerIndex * 80}ms`);
    revealObserver.observe(card);
  });

  const revealStyles = document.createElement('style');
  revealStyles.textContent = `
    .feature-card, .stat-block {
      opacity: 0; transform: translateY(20px); will-change: transform, opacity;
    }
    .feature-card.visible, .stat-block.visible {
      opacity: 1; transform: translateY(0);
      transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1) var(--stagger-delay),
                  transform 0.5s cubic-bezier(0.16,1,0.3,1) var(--stagger-delay);
    }
  `;
  document.head.appendChild(revealStyles);

  // ===== 8. ACTIVE SECTION MENU HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-link[href]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        sidebarLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('active-link', active);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-20% 0px -50% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));

  // ===== 9. RIPPLE CLICK EFFECT =====
  const rippleTargets = document.querySelectorAll('.download-btn, .nav-download-btn-small, .contact-card, .btn-secondary, .btn-rate-us, .review-readmore');
  rippleTargets.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      const clientX = e.clientX || (e.touches ? e.touches[0].clientX : rect.left + rect.width / 2);
      const clientY = e.clientY || (e.touches ? e.touches[0].clientY : rect.top + rect.height / 2);
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${clientX - rect.left - radius}px`;
      ripple.style.top = `${clientY - rect.top - radius}px`;
      ripple.className = 'quantum-ripple';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      const old = this.querySelector('.quantum-ripple');
      if (old) old.remove();
      this.appendChild(ripple);
    }, { passive: true });
  });

  const rippleStyles = document.createElement('style');
  rippleStyles.textContent = `
    .quantum-ripple {
      position: absolute; border-radius: 50%;
      background: rgba(255,215,0,0.4); transform: scale(0);
      animation: rippleFall 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
      pointer-events: none;
    }
    @keyframes rippleFall { to { transform: scale(2.8); opacity: 0; } }
  `;
  document.head.appendChild(rippleStyles);

  // ===== 10. AMBIENT GOLD PARTICLES =====
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const fragment = document.createDocumentFragment();
    const isLowEndMobile = window.innerWidth < 640;
    const totalParticles = isLowEndMobile ? 12 : 25;

    for (let i = 0; i < totalParticles; i++) {
      const particle = document.createElement('div');
      const dimensions = Math.random() * 3 + 1.2;
      const posX = Math.random() * 100;
      const life = Math.random() * 10 + 8;
      const delay = Math.random() * 6;
      particle.style.cssText = `
        position:absolute; width:${dimensions}px; height:${dimensions}px;
        background:${Math.random() > 0.4 ? 'linear-gradient(to top, #C49600, #FFD700)' : '#FFF1A3'};
        border-radius:50%; left:${posX}%; bottom:-20px; opacity:0;
        box-shadow:0 0 6px #FFD700; pointer-events:none;
        animation: premiumFloat ${life}s ${delay}s linear infinite;
      `;
      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);

    const floatStyles = document.createElement('style');
    floatStyles.textContent = `
      @keyframes premiumFloat {
        0% { transform: translateY(0) scale(0.8); opacity: 0; }
        15% { opacity: 0.5; }
        85% { opacity: 0.15; }
        100% { transform: translateY(-105vh) scale(1.1); opacity: 0; }
      }
    `;
    document.head.appendChild(floatStyles);
  }

  // ===== 11. DESKTOP MOUSE GLOW =====
  if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const glow = document.createElement('div');
    glow.className = 'hud-mouse-glow';
    document.body.appendChild(glow);
    const glowStyles = document.createElement('style');
    glowStyles.textContent = `
      .hud-mouse-glow {
        position: fixed; width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%);
        pointer-events: none; z-index: 0; transform: translate(-50%,-50%);
        transition: transform 0.08s cubic-bezier(0.16,1,0.3,1); will-change: left, top;
      }
    `;
    document.head.appendChild(glowStyles);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  // ===== 12. SMOOTH ANCHOR SCROLL (in-page section links only — legal
  // links and contact.html link now navigate as normal hrefs) =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      if (targetSelector === '#') return;
      const dest = document.querySelector(targetSelector);
      if (dest) {
        e.preventDefault();
        const offset = window.innerWidth < 640 ? 64 : 80;
        const destY = dest.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: destY, behavior: 'smooth' });
      }
    });
  });

  // ===== 13. DOWNLOAD BUTTON -> FIREBASE COUNTER HOOK =====
  document.querySelectorAll('[data-download-track]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof ranaCountDownload === 'function') ranaCountDownload();
    });
  });

  // ===== 14. RATE & REVIEW WIDGET =====
  const starPicker = document.getElementById('ranaStarPicker');
  const reviewForm = document.getElementById('ranaReviewForm');
  let selectedRating = 0;

  if (starPicker) {
    const stars = Array.from(starPicker.querySelectorAll('i'));
    const paintStars = (value) => {
      stars.forEach((star) => {
        const starValue = Number(star.dataset.value);
        star.classList.toggle('fas', starValue <= value);
        star.classList.toggle('far', starValue > value);
      });
    };
    stars.forEach((star) => {
      star.addEventListener('click', () => {
        selectedRating = Number(star.dataset.value);
        starPicker.dataset.selected = selectedRating;
        paintStars(selectedRating);
      });
      star.addEventListener('mouseenter', () => paintStars(Number(star.dataset.value)));
    });
    starPicker.addEventListener('mouseleave', () => paintStars(selectedRating));
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('ranaReviewStatus');
      if (!selectedRating) {
        if (statusEl) { statusEl.textContent = 'Please select a star rating first.'; statusEl.className = 'review-status error'; }
        return;
      }
      const emailInput = document.getElementById('ranaReviewEmail');
      const roleInput = document.getElementById('ranaReviewRole');
      const textInput = document.getElementById('ranaReviewText');

      if (typeof ranaSubmitReview !== 'function') {
        if (statusEl) { statusEl.textContent = 'Reviews are temporarily unavailable.'; statusEl.className = 'review-status error'; }
        return;
      }

      const submitBtn = reviewForm.querySelector('.btn-secondary');
      if (submitBtn) submitBtn.disabled = true;

      ranaSubmitReview({ rating: selectedRating, text: textInput.value, email: emailInput.value, role: roleInput ? roleInput.value : '' })
        .then(() => {
          if (statusEl) { statusEl.textContent = 'Thanks! Your review is live.'; statusEl.className = 'review-status success'; }
          reviewForm.reset();
          if (roleInput) roleInput.selectedIndex = 0;
          selectedRating = 0;
          if (starPicker) {
            starPicker.dataset.selected = 0;
            starPicker.querySelectorAll('i').forEach((s) => { s.classList.remove('fas'); s.classList.add('far'); });
          }
          setTimeout(closeReviewModal, 900);
        })
        .catch((err) => {
          console.warn('Rana Esports: review submit failed', err);
          if (statusEl) { statusEl.textContent = 'Something went wrong. Please try again.'; statusEl.className = 'review-status error'; }
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

    // ===== 15. READ MORE REVIEWS =====
  const readMoreBtn = document.getElementById('reviewReadMoreBtn');
  readMoreBtn?.addEventListener('click', () => {
    if (typeof ranaToggleReviewView === 'function') ranaToggleReviewView();
  });

  // ===== 16. APK DOWNLOAD VIDEO INTERCEPT (10 SECONDS AD) =====
  const downloadLinks = document.querySelectorAll('a[href$=".apk"]');
  const videoAdOverlay = document.getElementById('videoAdOverlay');
  const adVideoPlayer = document.getElementById('adVideoPlayer');
  const adSecondsText = document.getElementById('adSeconds');
  const adProgressFill = document.getElementById('adProgressFill');

  let targetApkUrl = '';
  let adInterval;

  if (downloadLinks.length > 0 && videoAdOverlay) {
    downloadLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        targetApkUrl = link.getAttribute('href');

        if (adInterval) clearInterval(adInterval);

        videoAdOverlay.classList.add('active');
        document.body.classList.add('no-scroll');

        adVideoPlayer.muted = false;

        adVideoPlayer.currentTime = 0;
        adVideoPlayer.play().catch(err => {
            console.log("Autoplay error:", err);
            adVideoPlayer.muted = true;
            adVideoPlayer.play();
        });

        let timeLeft = 10;
        adSecondsText.textContent = timeLeft;
        adProgressFill.style.width = '0%';

        adInterval = setInterval(() => {
          timeLeft--;
          adSecondsText.textContent = timeLeft;
          adProgressFill.style.width = `${((10 - timeLeft) / 10) * 100}%`;

          if (timeLeft <= 0) {
            clearInterval(adInterval);
            finishAdAndDownload();
          }
        }, 1000);
      });
    });
  }

  function finishAdAndDownload() {
    videoAdOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    adVideoPlayer.pause();

    if (targetApkUrl) {
      const tempLink = document.createElement('a');
      tempLink.href = targetApkUrl;
      tempLink.setAttribute('download', '');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  }

  // ===== 17. COPY-TO-CLIPBOARD BUTTONS =====
  // Used on data-deletion.html and refund.html so users can copy the
  // ready-made request message with one tap and paste it into the Help
  // Desk chat or an email to the admin.
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      const text = target.innerText.trim();

      const markCopied = () => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied!';
        btn.classList.add('copied');
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = original;
          btn.classList.remove('copied');
          btn.disabled = false;
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied).catch(() => {
          fallbackCopy(target, markCopied);
        });
      } else {
        fallbackCopy(target, markCopied);
      }
    });
  });

  function fallbackCopy(target, onDone) {
    try {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
      if (onDone) onDone();
    } catch (err) {
      console.warn('Rana Esports: copy fallback failed', err);
    }
  }

  // ===== 18. PRICING CARD CAROUSELS (India ₹ / Other Countries $) =====
  // Auto-scrolls right-to-left, holds each card ~1s, loops endlessly,
  // and stays fully swipeable by finger/mouse (pauses autoplay briefly
  // on interaction, then resumes).
  if (document.querySelector('.pricingSwiperIndia') && window.Swiper) {
    new Swiper('.pricingSwiperIndia', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 650,
      loop: true,
      coverflowEffect: { rotate: 8, stretch: -6, depth: 90, modifier: 1, slideShadows: false },
      autoplay: { delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.pricingSwiperIndia .swiper-pagination', clickable: true }
    });
  }

  if (document.querySelector('.pricingSwiperGlobal') && window.Swiper) {
    new Swiper('.pricingSwiperGlobal', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 650,
      loop: true,
      coverflowEffect: { rotate: 8, stretch: -6, depth: 90, modifier: 1, slideShadows: false },
      autoplay: { delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.pricingSwiperGlobal .swiper-pagination', clickable: true }
    });
  }

}); // <--- DOMContentLoaded यहाँ खत्म होता है (इसे मत हटाना)

/* ==========================================================================
   VIDEO TABS SWITCHER
   ========================================================================== */
const videoTabs = document.querySelectorAll('.video-tab');
const engVideos = document.getElementById('englishVideos');
const hinVideos = document.getElementById('hindiVideos');

if (videoTabs.length > 0) {
  videoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      videoTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.vidTab === 'hindi') {
        engVideos.style.display = 'none';
        hinVideos.style.display = 'grid';
      } else {
        engVideos.style.display = 'grid';
        hinVideos.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   ASYNC YOUTUBE FRAME INTEGRATION
   ========================================================================== */
let ytPlayers = [];

window.onYouTubeIframeAPIReady = function () {
  'use strict';
  try {
    const engVids = [
      { id: 'playerEng1', vid: '5F9_qyL2ngA' },
      { id: 'playerEng2', vid: 'Rg2jCzljzRE' },
      { id: 'playerEng3', vid: '5F9_qyL2ngA' }
    ];
    const hinVids = [
      { id: 'playerHin1', vid: 'Rg2jCzljzRE' },
      { id: 'playerHin2', vid: '5F9_qyL2ngA' },
      { id: 'playerHin3', vid: 'Rg2jCzljzRE' }
    ];

    [...engVids, ...hinVids].forEach(video => {
      if (document.getElementById(video.id)) {
        let player = new YT.Player(video.id, {
          videoId: video.vid,
          events: { onStateChange: cascadePlayerStateMonitor }
        });
        ytPlayers.push(player);
      }
    });
  } catch (error) {
    console.warn('YouTube API error:', error);
  }
};

function cascadePlayerStateMonitor(event) {
  'use strict';
  if (event.data === YT.PlayerState.PLAYING) {
    ytPlayers.forEach(player => {
      if (player !== event.target && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    });
  }
}
