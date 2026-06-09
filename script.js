/* ==========================================================================
   ALISHA ESPORTS PRO PRODUCTION JAVASCRIPT ENGINE (script.js)
   Theme: High-Performance VIP Event Loops / Mobile Optimized HUD VFX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ===== 1. PERFORMANCE CONTEXT: GLOBAL SCROLL ENGINE =====
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;

        // Navbar VIP Glow Transformation
        if (scrollPosition > 40) {
          navbar?.classList.add('scrolled');
        } else {
          navbar?.classList.remove('scrolled');
        }

        // Back To Top HUD Toggle
        if (scrollPosition > 400) {
          backToTopBtn?.classList.add('show');
        } else {
          backToTopBtn?.classList.remove('show');
        }

        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Smooth Back To Top Navigation Execution
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ===== 2. HUD COMPONENT: TACTICAL SIDEBAR MATRIX =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar?.classList.add('open');
    sidebarOverlay?.classList.add('active');
    sidebar?.setAttribute('aria-hidden', 'false');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Fixed double mobile scroll bypass
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarOverlay?.classList.remove('active');
    sidebar?.setAttribute('aria-hidden', 'true');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Close sidebar globally on link execution
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });


  // ===== 3. SLIDER CONFIG: WIDESCREEN UPDATE BANNER (MOBILE INTERTIA) =====
  if (document.querySelector('.updateSwiper')) {
    new Swiper(".updateSwiper", {
      loop: true,
      speed: 700,
      grabCursor: true,
      touchEventsTarget: 'container',
      resistanceRatio: 0.85, // Smooth native swipe resistance on mobile
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
      },
    });
  }


  // ===== 4. SLIDER CONFIG: VERTICAL APP PREVIEW (COVERFLOW OVERHAUL) =====
  if (document.querySelector('.previewSwiper')) {
    new Swiper(".previewSwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      speed: 550,
      touchReleaseOnEdges: true,
      coverflowEffect: {
        rotate: 12,
        stretch: -8,
        depth: 100,
        modifier: 1.1,
        slideShadows: true,
      },
      loop: true,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }


  // ===== 5. INTERSECTION MATRIX: CASCADE MOUNT TRANSITIONS =====
  const featureCards = document.querySelectorAll('.feature-card');
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }); // Adjusted thresholds dynamically for fast swiping

  featureCards.forEach((card, index) => {
    // Injecting optimal matrix transition tags safely
    const staggerIndex = window.innerWidth > 768 ? (index % 4) : (index % 2);
    card.style.setProperty('--stagger-delay', `${staggerIndex * 80}ms`);
    cardObserver.observe(card);
  });


  // ===== 6. NAV MATRICES: ACTIVE SECTION MONITOR =====
  const sections = document.querySelectorAll('section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentActiveId = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentActiveId}`) {
            link.style.color = '#FFD700';
            link.style.background = 'rgba(255, 215, 0, 0.06)';
            link.style.borderLeftColor = '#FFD700';
          } else {
            link.style.color = '';
            link.style.background = '';
            link.style.borderLeftColor = 'transparent';
          }
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-20% 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));


  // ===== 7. QUANTUM RIPPLE ENGINE: TACTICAL CLICK VFX =====
  const downloadBtns = document.querySelectorAll('.download-btn, .nav-download-btn-small, .contact-card');
  
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const boundingDimensions = this.getBoundingClientRect();
      const diameter = Math.max(boundingDimensions.width, boundingDimensions.height);
      const radius = diameter / 2;

      // Logic safely fallback elements for standard mobile touch positioning
      const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${clientX - boundingDimensions.left - radius}px`;
      ripple.style.top = `${clientY - boundingDimensions.top - radius}px`;
      ripple.className = 'quantum-ripple';

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      
      const oldRipple = this.querySelector('.quantum-ripple');
      if (oldRipple) oldRipple.remove();

      this.appendChild(ripple);
    }, { passive: true });
  });

  // Structural system ripples styling hooks
  const structuralStyles = document.createElement('style');
  structuralStyles.textContent = `
    .feature-card {
      opacity: 0;
      transform: translateY(20px);
      will-change: transform, opacity;
    }
    .feature-card.visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger-delay),
                  transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger-delay);
    }
    .quantum-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 215, 0, 0.4);
      transform: scale(0);
      animation: rippleFall 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      pointer-events: none;
    }
    @keyframes rippleFall {
      to { transform: scale(2.8); opacity: 0; }
    }
  `;
  document.head.appendChild(structuralStyles);


  // ===== 8. LUXURY ENGINE: AMBIENT GOLD PARTICLES =====
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const fragment = document.createDocumentFragment();
    const isLowEndMobile = window.innerWidth < 640;
    const totalParticles = isLowEndMobile ? 12 : 25; // Performance optimizing block for mobile batteries

    for (let i = 0; i < totalParticles; i++) {
      const particle = document.createElement('div');
      const dimensions = Math.random() * 3 + 1.2;
      const structuralPositionX = Math.random() * 100;
      const lifeDuration = Math.random() * 10 + 8;
      const executionDelay = Math.random() * 6;

      particle.style.cssText = `
        position: absolute;
        width: ${dimensions}px;
        height: ${dimensions}px;
        background: ${Math.random() > 0.4 ? 'linear-gradient(to top, #C49600, #FFD700)' : '#FFF1A3'};
        border-radius: 50%;
        left: ${structuralPositionX}%;
        bottom: -20px;
        opacity: 0;
        box-shadow: 0 0 6px #FFD700;
        pointer-events: none;
        animation: premiumFloat ${lifeDuration}s ${executionDelay}s linear infinite;
      `;
      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);

    const fluidAmbientStyles = document.createElement('style');
    fluidAmbientStyles.textContent = `
      @keyframes premiumFloat {
        0% { transform: translateY(0) scale(0.8); opacity: 0; }
        15% { opacity: 0.5; }
        85% { opacity: 0.15; }
        100% { transform: translateY(-105vh) scale(1.1); opacity: 0; }
      }
    `;
    document.head.appendChild(fluidAmbientStyles);
  }


  // ===== 9. VIP EXCLUSIVE: TACTICAL DESKTOP GLOW MOUSE TRAIL =====
  if (window.innerWidth > 1024) {
    const mouseGlowContainer = document.createElement('div');
    mouseGlowContainer.className = 'hud-mouse-glow';
    document.body.appendChild(mouseGlowContainer);

    const glowStyles = document.createElement('style');
    glowStyles.textContent = `
      .hud-mouse-glow {
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.04) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: transform 0.08s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: left, top;
      }
    `;
    document.head.appendChild(glowStyles);

    document.addEventListener('mousemove', (e) => {
      mouseGlowContainer.style.left = `${e.clientX}px`;
      mouseGlowContainer.style.top = `${e.clientY}px`;
    }, { passive: true });
  }


  // ===== 10. ADVANCED TACTICAL SMOOTH LINK TRANSITS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      if (targetSelector === '#') return;
      
      const destinationBlock = document.querySelector(targetSelector);
      if (destinationBlock) {
        e.preventDefault();
        const offsetLayoutCorrection = window.innerWidth < 640 ? 64 : 80; // Adaptive tracking offset boundaries
        const destinationY = destinationBlock.getBoundingClientRect().top + window.scrollY - offsetLayoutCorrection;
        
        window.scrollTo({
          top: destinationY,
          behavior: 'smooth'
        });
      }
    });
  });

});


/* ==========================================================================
   11. ASYNCHRONOUS ENGINE: GLOBAL YOUTUBE FRAME INTEGRATION (PAUSE OVERLAP)
   ========================================================================== */
let player1, player2;

window.onYouTubeIframeAPIReady = function() {
  'use strict';
  try {
    if (document.getElementById('player1')) {
      player1 = new YT.Player('player1', {
        videoId: '5F9_qyL2ngA',
        events: { 'onStateChange': cascadePlayerStateMonitor }
      });
    }
    if (document.getElementById('player2')) {
      player2 = new YT.Player('player2', {
        videoId: 'NHC_33pEUKQ',
        events: { 'onStateChange': cascadePlayerStateMonitor }
      });
    }
  } catch (error) {
    console.warn("YouTube API Frame handshake dropped or delayed:", error);
  }
};

function cascadePlayerStateMonitor(event) {
  'use strict';
  if (event.data === YT.PlayerState.PLAYING) {
    if (event.target === player1 && player2 && typeof player2.pauseVideo === 'function') {
      player2.pauseVideo();
    }
    if (event.target === player2 && player1 && typeof player1.pauseVideo === 'function') {
      player1.pauseVideo();
    }
  }
}
