import { PORTRAIT_PARTICLES } from './portrait-particles.js';

/**
 * Cinematic Editorial Portfolio Controller
 * Coordinates boot screen, reading progress, toolkit accordion, mobile navigation,
 * and smooth scene transitions.
 */

export function initCinematicUI() {
  // 1. Boot Screen Dismissal
  const bootScreen = document.querySelector('.boot');
  if (bootScreen) {
    const hideBoot = () => {
      if (bootScreen.classList.contains('boot-hidden')) return;
      bootScreen.classList.add('boot-hidden');
      document.body.classList.remove('preloader-active');
      document.body.classList.add('hero-ready');
      window.dispatchEvent(new CustomEvent('hero:ready'));
      setTimeout(() => {
        bootScreen.style.display = 'none';
      }, 800);
    };
    if (document.readyState === 'complete') {
      setTimeout(hideBoot, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hideBoot, 400));
    }
  }

  // 2. Reading Progress Bar
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / docHeight));
        progressBar.style.transform = `scaleX(${progress})`;
      }
    }, { passive: true });
  }

  // 3. Mobile Navigation Drawer
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-cinematic-menu');
  const mobileLinks = document.querySelectorAll('.mobile-cinematic-menu a');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
        }
      });
    });
  }

  // 4. Engineering Vocabulary / Toolkit Accordion
  const toolRows = document.querySelectorAll('.tool-row');
  toolRows.forEach(row => {
    const btn = row.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const isExpanded = row.classList.contains('expanded');
        // If clicking an unexpanded row, optionally close siblings or toggle
        toolRows.forEach(r => {
          if (r !== row) {
            r.classList.remove('expanded');
            r.querySelector('button')?.setAttribute('aria-expanded', 'false');
          }
        });
        row.classList.toggle('expanded', !isExpanded);
        btn.setAttribute('aria-expanded', (!isExpanded).toString());
      });
    }
  });

  // 5. Back to Top Smooth Trigger
  const backTopBtn = document.querySelector('.back-to-top-btn, .back-top');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Navigation Link Active State Tracker (Scrollspy)
  const trackedSectionIds = ['proof', 'work', 'projects', 'toolkit', 'journey', 'contact'];
  const sectionNavMap = {
    'proof': '#proof',
    'work': '#work',
    'projects': '#work', // macOS Finder System Studio maps to Projects nav link
    'toolkit': '#toolkit',
    'journey': '#journey',
    'contact': '#contact'
  };

  const navLinks = document.querySelectorAll('.topbar nav a');
  const mobileNavLinks = document.querySelectorAll('.mobile-cinematic-menu a[href^="#"]');
  const talkBtn = document.querySelector('.talk-btn');

  function updateNavScrollSpy() {
    const scrollY = window.scrollY;
    const topbarHeight = 70;
    const activationPoint = scrollY + topbarHeight + 120;
    const isBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70);

    let activeTarget = null;

    if (isBottom) {
      activeTarget = '#contact';
    } else {
      for (const id of trackedSectionIds) {
        const sec = document.getElementById(id);
        if (!sec) continue;
        // Ignore collapsed/hidden elements (e.g. collapsed System Studio)
        if (sec.offsetParent === null && sec.classList.contains('studio-collapsed')) continue;

        const rect = sec.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = top + rect.height;

        if (top <= activationPoint && bottom > (scrollY + topbarHeight)) {
          activeTarget = sectionNavMap[id] || `#${id}`;
        }
      }
    }

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === activeTarget);
    });

    // Update Mobile Drawer Links
    mobileNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === activeTarget);
    });

    // Update Talk Action Button
    if (talkBtn) {
      talkBtn.classList.toggle('active', activeTarget === '#contact');
    }
  }

  // Instant active feedback when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', updateNavScrollSpy, { passive: true });
  window.addEventListener('resize', updateNavScrollSpy, { passive: true });
  // Initial check on load
  updateNavScrollSpy();

  // 7. Cinematic Hero Portrait Animation Sequencer
  initCinematicHeroPortrait();
}

/**
 * 8-STAGE CINEMATIC HERO PORTRAIT CONTROLLER
 * Coordinates the full futuristic reveal sequence matching the reference:
 * Stage 1: Initial blurred silhouette (0–500ms)
 * Stage 2: Orange-red particle assembly (500–1200ms)
 * Stage 3: Image forming & vector contours (1200–2000ms)
 * Stage 4: Horizontal scan beam with progressive clip unmasking (2000–2800ms)
 * Stage 5: Technical telemetry & plain-text <SL /> reveal (2800–3400ms)
/**
 * ACCURATE IMAGE-DERIVED PARTICLE RECONSTRUCTION & SYNCHRONIZED SCAN REVEAL
 * Stages A through E matching reference:
 * Stage A: Initial dark cinematic frame with blurred base & faint ambient particles (0-700ms)
 * Stage B: Orange-red scanning laser begins downward sweep (700ms+)
 * Stage C: Particles converge from scattered positions onto image-derived targets in sync with scan
 * Stage D: Progressive reveal of high-res portrait unmasked directly behind scan line
 * Stage E: Final resolved state - 100% sharp photo, settled contour particles, idle breathing
 */
export function initCinematicHeroPortrait() {
  const wrapper = document.getElementById('hero-cinematic-portrait');
  if (!wrapper) return;

  const canvas = document.getElementById('portrait-particle-canvas');
  const revealLayer = document.getElementById('portrait-reveal-layer');
  const scanBeam = document.getElementById('portrait-scan-beam');
  const cinematicImg = revealLayer ? revealLayer.querySelector('.cinematic-portrait-img') : null;

  // Exact portrait dimensions (Display-picture.jpg)
  const IMG_W = 7086;
  const IMG_H = 7526;

  // Coordinate mapping ensuring exact alignment with object-fit: cover, object-position: center center
  function getCoverTransform(cW, cH) {
    const cAspect = cW / cH;
    const iAspect = IMG_W / IMG_H;
    let renderW, renderH, offsetX, offsetY;
    if (cAspect > iAspect) {
      renderW = cW;
      renderH = cW / iAspect;
      offsetX = 0;
      offsetY = (cH - renderH) / 2;
    } else {
      renderH = cH;
      renderW = cH * iAspect;
      offsetX = (cW - renderW) / 2;
      offsetY = 0;
    }
    return {
      mapX: (normX) => offsetX + normX * renderW,
      mapY: (normY) => offsetY + normY * renderH
    };
  }

  // Helper to instantly set final state (also used for reduced-motion)
  const finalizeInstant = () => {
    wrapper.classList.remove('stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5', 'stage-6', 'stage-7');
    wrapper.classList.add('stage-8', 'stage-final');
    if (revealLayer) revealLayer.style.clipPath = 'inset(0 0 0 0)';
    if (scanBeam) scanBeam.style.opacity = '0';
    if (cinematicImg) {
      cinematicImg.style.filter = 'none';
      cinematicImg.style.opacity = '1';
    }
  };

  let animationStarted = false;
  let animId = null;

  const startCinematicSequence = (force = false) => {
    if (!force && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finalizeInstant();
      return;
    }

    if (animationStarted) return;
    animationStarted = true;

    // Stage 1 initial setup
    wrapper.classList.remove('stage-2', 'stage-3', 'stage-4', 'stage-5', 'stage-6', 'stage-7', 'stage-8', 'stage-final');
    wrapper.classList.add('stage-1');

    if (!canvas) {
      setTimeout(finalizeInstant, 2500);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      finalizeInstant();
      return;
    }

    // Set canvas dimensions
    let rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = canvas.offsetWidth || rect.width || 340;
    let H = canvas.offsetHeight || rect.height || Math.round(W * (window.innerWidth <= 480 ? 1.26 : (window.innerWidth <= 768 ? 1.15 : 1.06)));

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let transform = getCoverTransform(W, H);

    // Build persistent particles directly from image-derived coordinates
    const particles = PORTRAIT_PARTICLES.map((kp, idx) => {
      const tx = transform.mapX(kp.x);
      const ty = transform.mapY(kp.y);

      // Scatter outward directionally from center
      const angle = (idx * 0.43) % (Math.PI * 2);
      const dist = kp.isFace ? (32 + ((idx * 13) % 48)) : (42 + ((idx * 21) % 76));
      const sx = tx + Math.cos(angle) * dist;
      const sy = ty + Math.sin(angle) * dist;

      return {
        normX: kp.x,
        normY: kp.y,
        targetX: tx,
        targetY: ty,
        currentX: sx,
        currentY: sy,
        startX: sx,
        startY: sy,
        radius: kp.r || 1.4,
        isFace: kp.isFace,
        cat: kp.cat,
        phase: (idx * 0.37) % (Math.PI * 2)
      };
    });

    const faceParticles = particles.filter(p => p.isFace);

    // Responsive update on resize
    const handleResize = () => {
      if (!canvas) return;
      const nw = canvas.offsetWidth || 340;
      const nh = canvas.offsetHeight || Math.round(nw * (window.innerWidth <= 480 ? 1.26 : (window.innerWidth <= 768 ? 1.15 : 1.06)));
      if (nw === W && nh === H) return;
      W = nw;
      H = nh;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      transform = getCoverTransform(W, H);
      particles.forEach(p => {
        p.targetX = transform.mapX(p.normX);
        p.targetY = transform.mapY(p.normY);
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // =========================================================================
      // STAGE A: 0 - 700 ms (Initial dark state: blurred base, faint ambient dots)
      // =========================================================================
      if (elapsed < 700) {
        if (!wrapper.classList.contains('stage-1')) {
          wrapper.className = 'cinematic-portrait-wrapper stage-1';
        }
        if (revealLayer) revealLayer.style.clipPath = 'inset(0 0 100% 0)';
        if (scanBeam) scanBeam.style.opacity = '0';

        // Draw a small number of faint ambient orange-red particles drifting gently
        const ambientCount = 35;
        for (let i = 0; i < ambientCount; i++) {
          const p = particles[i * 12 % particles.length];
          const driftX = p.startX + Math.sin(elapsed * 0.003 + p.phase) * 4;
          const driftY = p.startY + Math.cos(elapsed * 0.003 + p.phase) * 4;
          const alpha = 0.22 + 0.12 * Math.sin(elapsed * 0.006 + p.phase);

          ctx.fillStyle = '#F45135';
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(driftX, driftY, p.radius * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // =========================================================================
      // STAGES B, C & D: 700 - 3,400 ms (Orange scan line, particle reconstruction,
      // and progressive high-res photo reveal synchronized to beam position)
      // =========================================================================
      else if (elapsed >= 700 && elapsed < 3400) {
        const scanRawP = (elapsed - 700) / 2700; // 0 to 1
        // Smooth cubic ease-in-out for realistic cinematic travel
        const scanEase = scanRawP < 0.5 
          ? 2 * scanRawP * scanRawP 
          : -1 + (4 - 2 * scanRawP) * scanRawP;

        const scanY = scanEase * H;

        // Stage class management based on scan progress
        if (scanRawP < 0.28) {
          if (!wrapper.classList.contains('stage-2')) {
            wrapper.className = 'cinematic-portrait-wrapper stage-2';
          }
        } else if (scanRawP < 0.60) {
          if (!wrapper.classList.contains('stage-3')) {
            wrapper.className = 'cinematic-portrait-wrapper stage-3';
          }
        } else if (scanRawP < 0.88) {
          if (!wrapper.classList.contains('stage-4')) {
            wrapper.className = 'cinematic-portrait-wrapper stage-4';
          }
        } else {
          if (!wrapper.classList.contains('stage-5')) {
            wrapper.className = 'cinematic-portrait-wrapper stage-5';
          }
        }

        // 1. Animate horizontal scan beam
        if (scanBeam) {
          scanBeam.style.opacity = '1';
          scanBeam.style.transform = `translateY(${Math.round(scanY)}px)`;
        }

        // 2. Synchronized Progressive Image Reveal (Clipping mask matches scan beam exactly)
        if (revealLayer) {
          const clipBottomPercent = Math.max(0, (1 - scanEase) * 100);
          revealLayer.style.clipPath = `inset(0 0 ${clipBottomPercent.toFixed(2)}% 0)`;
        }

        // 3. Facial HUD vector contour lines connecting neighboring landmarks near the beam
        ctx.lineWidth = 0.75;
        for (let i = 0; i < faceParticles.length; i++) {
          const p1 = faceParticles[i];
          const distToBeam1 = scanY - p1.targetY;
          if (distToBeam1 > -45 && distToBeam1 < 25) {
            for (let j = i + 1; j < Math.min(i + 5, faceParticles.length); j++) {
              const p2 = faceParticles[j];
              const distToBeam2 = scanY - p2.targetY;
              if (distToBeam2 > -45 && distToBeam2 < 25) {
                const dx = p1.currentX - p2.currentX;
                const dy = p1.currentY - p2.currentY;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 16) {
                  const lineAlpha = (1 - Math.abs(distToBeam1) / 45) * 0.42;
                  ctx.strokeStyle = `rgba(255, 96, 50, ${lineAlpha})`;
                  ctx.beginPath();
                  ctx.moveTo(p1.currentX, p1.currentY);
                  ctx.lineTo(p2.currentX, p2.currentY);
                  ctx.stroke();
                }
              }
            }
          }
        }

        // 4. Particle convergence synchronized to scan line
        particles.forEach(p => {
          const diff = scanY - p.targetY;

          // Case A: Ahead of the scan line (not yet reached)
          if (diff < -75) {
            // Slight ambient drift
            p.currentX = p.startX + Math.sin(elapsed * 0.003 + p.phase) * 3;
            p.currentY = p.startY + Math.cos(elapsed * 0.003 + p.phase) * 3;
            ctx.fillStyle = '#F45135';
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.22 + 0.12 * Math.sin(elapsed * 0.005 + p.phase);
            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, p.radius * 0.85, 0, Math.PI * 2);
            ctx.fill();
          }

          // Case B: Scan beam approaching & crossing particle (Active Convergence)
          else if (diff >= -75 && diff < 12) {
            const u = (diff + 75) / 87; // 0 to 1
            const easeK = 1 - Math.pow(1 - u, 3); // fast convergence snap

            p.currentX = p.startX + (p.targetX - p.startX) * easeK;
            p.currentY = p.startY + (p.targetY - p.startY) * easeK;

            // Highly energized particle flash at laser beam intersection
            const energy = Math.sin(u * Math.PI);
            ctx.fillStyle = energy > 0.65 ? '#FFFFFF' : '#FF6038';
            ctx.shadowColor = '#F45135';
            ctx.shadowBlur = 8 * energy + 3;
            ctx.globalAlpha = 0.6 + 0.4 * energy;
            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, p.radius * (1 + 0.3 * energy), 0, Math.PI * 2);
            ctx.fill();

            // Core highlight
            if (p.isFace || p.cat === 'pocket_square') {
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(p.currentX, p.currentY, p.radius * 0.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Case C: Behind the scan line (Locked onto image feature, settles into subtle contour)
          else {
            p.currentX = p.targetX;
            p.currentY = p.targetY;

            // Smooth transition from laser brightness to settled contour glow
            const settleTime = Math.min(1, (diff - 12) / 60);
            const baseContourAlpha = p.isFace ? 0.42 : 0.28;
            const breathing = 0.85 + 0.15 * Math.sin(elapsed * 0.004 + p.phase);
            const settledAlpha = baseContourAlpha * breathing;
            const currentAlpha = 0.95 * (1 - settleTime) + settledAlpha * settleTime;

            ctx.fillStyle = p.isFace ? '#FF653C' : '#F45135';
            ctx.shadowColor = '#F45135';
            ctx.shadowBlur = 4 * (1 - settleTime) + 2;
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(p.targetX, p.targetY, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // =========================================================================
      // STAGE D/E: 3,400 - 4,200 ms (Scan beam finishes, interface fades in)
      // =========================================================================
      else if (elapsed >= 3400 && elapsed < 4200) {
        if (!wrapper.classList.contains('stage-6')) {
          wrapper.className = 'cinematic-portrait-wrapper stage-6';
        }

        // Ensure full reveal of photograph
        if (revealLayer) revealLayer.style.clipPath = 'inset(0 0 0 0)';

        // Scan beam fades away smoothly
        if (scanBeam) {
          const fadeOutP = Math.max(0, 1 - (elapsed - 3400) / 400);
          scanBeam.style.opacity = fadeOutP.toString();
        }

        // Render settled particles with calm breathing contour
        particles.forEach(p => {
          const baseAlpha = p.isFace ? 0.38 : 0.24;
          const breathing = 0.85 + 0.15 * Math.sin(elapsed * 0.0035 + p.phase);
          ctx.fillStyle = p.isFace ? '#FF653C' : '#F45135';
          ctx.shadowColor = '#F45135';
          ctx.shadowBlur = 2;
          ctx.globalAlpha = baseAlpha * breathing;
          ctx.beginPath();
          ctx.arc(p.targetX, p.targetY, p.radius * 0.95, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // =========================================================================
      // STAGE E: 4,200 ms onward (Final Resolved State: 100% sharp photo, calm contour)
      // =========================================================================
      else if (elapsed >= 4200) {
        if (!wrapper.classList.contains('stage-8')) {
          wrapper.className = 'cinematic-portrait-wrapper stage-8 stage-final';
          if (cinematicImg) {
            cinematicImg.style.filter = 'none';
            cinematicImg.style.opacity = '1';
          }
        }

        if (scanBeam) scanBeam.style.opacity = '0';
        if (revealLayer) revealLayer.style.clipPath = 'inset(0 0 0 0)';

        // Gentle, restrained contour breathing around face and shoulders
        particles.forEach(p => {
          // Silhouette and facial landmark particles form a subtle accent
          const baseAlpha = p.isFace ? 0.32 : 0.20;
          const breathing = 0.85 + 0.15 * Math.sin(elapsed * 0.003 + p.phase);
          ctx.fillStyle = '#F45135';
          ctx.globalAlpha = baseAlpha * breathing;
          ctx.beginPath();
          ctx.arc(p.targetX, p.targetY, p.radius * 0.9, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
  };

  // Expose restart function globally for verification and manual re-triggers
  window.restartHeroAnimation = () => {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    wrapper.className = 'cinematic-portrait-wrapper stage-1';
    if (revealLayer) revealLayer.style.clipPath = 'inset(0 0 100% 0)';
    if (scanBeam) {
      scanBeam.style.opacity = '0';
      scanBeam.style.transform = 'translateY(0)';
    }
    if (cinematicImg) {
      cinematicImg.style.filter = 'blur(2.5px)';
      cinematicImg.style.opacity = '0.9';
    }
    animationStarted = false;
    startCinematicSequence(true);
  };

  // Allow clicking the portrait card to replay the full sequence anytime
  wrapper.style.cursor = 'pointer';
  wrapper.setAttribute('title', 'Click to replay cinematic sequence');
  wrapper.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    window.restartHeroAnimation();
  });

  // Trigger once upon view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => startCinematicSequence(false), 200);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(wrapper);
  } else {
    setTimeout(() => startCinematicSequence(false), 300);
  }
}


