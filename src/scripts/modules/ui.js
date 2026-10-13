export function initUI() {
  // Initialize Typed.js if container exists
  if (document.querySelector("#typed") && typeof Typed !== 'undefined') {
    new Typed("#typed", {
      strings: [
        "Saketh Lingerker",
        "Incoming Systems Engineer @ TCS",
        "Full-Stack & AI Engineer",
        "Former AI/ML Research Intern @ IIIT-H",
      ],
      typeSpeed: 50,
      backSpeed: 80,
      backDelay: 2000,
      loop: true,
      showCursor: false,
    });
  }



  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Animation on scroll
  const elementsToAnimate = [
    ...document.querySelectorAll(".project-card"),
    ...document.querySelectorAll(".experience-card"),
    ...document.querySelectorAll(".skill-card"),
    ...document.querySelectorAll(".skill-tag"),
  ];

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  elementsToAnimate.forEach((el) => observer.observe(el));

  // Mobile Menu
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");

  if (mobileMenuToggle && mobileNavOverlay) mobileMenuToggle.addEventListener("click", () => mobileNavOverlay.classList.add("active"));
  if (mobileMenuClose && mobileNavOverlay) mobileMenuClose.addEventListener("click", () => mobileNavOverlay.classList.remove("active"));
  if (mobileNavOverlay) {
    document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
      link.addEventListener("click", () => mobileNavOverlay.classList.remove("active"));
    });
  }

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
      mobileNavOverlay.classList.remove('active');
    }
  });

  // Scroll Listeners (Active Link, Progress Bar, Header Shrink)
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".main-nav-links a, .mobile-nav-links a");
    const header = document.querySelector(".header");
    const scrollProgress = document.getElementById("scroll-progress");
    const backToTopBtn = document.getElementById("back-to-top");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Active Highlight
    let current = "";
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 100) current = section.getAttribute("id");
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href")?.substring(1) === current);
    });

    // Shrink Header
    if (header) header.classList.toggle("shrink", scrollTop > 100);

    // Progress Bar
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    // scrollTop is already defined above at line 88

    let scrollPercent = 0;
    if (docHeight > winHeight) {
        scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    }
    
    const scrollPercentRounded = Math.min(100, Math.max(0, Math.round(scrollPercent)));

    if (scrollProgress) {
        scrollProgress.style.width = `${scrollPercentRounded}%`;
    }

    // Back to Top
    if (backToTopBtn) backToTopBtn.classList.toggle("visible", scrollTop > 500);
  });

  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Resume Modal
  const resumeModal = document.getElementById("resume-modal");
  const resumeCloseModal = document.getElementById("close-resume-modal");
  const resumeButtons = document.querySelectorAll('a[href*="Saketh_Lingerker_8688791352.pdf"]');

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }

  function openResume() {
    if (!resumeModal) return;
    const isMobile = isMobileDevice();
    document.querySelectorAll('.desktop-view').forEach(el => el.style.display = isMobile ? 'none' : 'block');
    const mobileEl = document.querySelector('.mobile-view');
    if (mobileEl) mobileEl.style.display = isMobile ? 'block' : 'none';
    resumeModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  if (resumeModal && resumeButtons.length > 0) {
    resumeButtons.forEach(btn => {
      if (!btn.hasAttribute('download')) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          openResume();
        });
      }
    });

    resumeCloseModal?.addEventListener("click", () => {
      resumeModal.classList.remove("open");
      document.body.style.overflow = "auto";
    });

    document.getElementById('open-pdf-btn')?.addEventListener('click', () => {
      window.open('assets/Saketh_Lingerker_8688791352.pdf', '_blank');
      resumeModal.classList.remove("open");
      document.body.style.overflow = "auto";
    });
  }

  // Project Modal
  const projectModal = document.getElementById("project-modal");
  const closeProjectModal = document.getElementById("close-project-modal");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const title = card.querySelector(".project-title")?.textContent.trim() || "";
      const desc = card.querySelector(".project-description")?.textContent.trim() || "";
      const tags = card.querySelector(".project-tags")?.innerHTML || "";
      const links = card.querySelector(".project-links")?.innerHTML || "";
      const problem = card.querySelector(".project-problem")?.innerHTML.trim() || "";

      document.getElementById("modal-title").innerText = title;
      document.getElementById("modal-tags").innerHTML = tags;
      document.getElementById("modal-links").innerHTML = links;
      
      const highlights = card.querySelector(".project-highlights")?.innerHTML || "";
      const caseStudy = card.querySelector(".project-case-study");
      
      let impactContent = "";
      
      if (caseStudy) {
        const h4s = caseStudy.querySelectorAll("h4");
        h4s.forEach(h4 => {
          const text = h4.textContent.toLowerCase();
          if (text.includes("impact")) {
            impactContent = h4.nextElementSibling?.innerHTML || "";
          }
        });
      }

      // Helper to update sections
      const updateModalSection = (secId, textId, content) => {
        const sec = document.getElementById(secId);
        const txt = document.getElementById(textId);
        if (content && content.trim() !== "" && sec && txt) {
          txt.innerHTML = content;
          sec.style.display = "block";
        } else if (sec) {
          sec.style.display = "none";
        }
      };

      updateModalSection("modal-problem-section", "modal-problem", problem);
      updateModalSection("modal-solution-section", "modal-highlights", highlights);
      updateModalSection("modal-impact-section", "modal-impact", impactContent);

      projectModal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  if (closeProjectModal) closeProjectModal.addEventListener("click", () => {
    projectModal.classList.remove("open");
    document.body.style.overflow = "auto";
  });

  // Privacy Policy
  const privacyModal = document.getElementById("privacy-modal");
  document.getElementById("privacy-policy-link")?.addEventListener("click", () => {
    privacyModal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  document.getElementById("close-privacy")?.addEventListener("click", () => {
    privacyModal.classList.remove("open");
    document.body.style.overflow = "auto";
  });

  // Timeline Toggle (Read More/Less)
  document.querySelectorAll('.timeline-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.timeline-content');
      const details = parent ? parent.querySelector('.timeline-details') : null;
      
      if (details) {
        const isHidden = details.classList.contains('hidden');
        details.classList.toggle('hidden');
        button.innerHTML = isHidden ? 
          `Read Less <i class="fas fa-chevron-up"></i>` : 
          `Read More <i class="fas fa-chevron-down"></i>`;
      }
    });
  });

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target === projectModal || e.target === privacyModal || e.target === document.getElementById("quiz-modal")) {
      e.target.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  });

  // Close modals on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(modal => {
        modal.classList.remove("open");
        document.body.style.overflow = "auto";
      });
    }
  });

  // Initialize Skills Connected Ecosystem paths & animations
  initSkillsEcosystemConnectors();
}

function initSkillsEcosystemConnectors() {
  const svg = document.querySelector('.skills-connector-svg');
  if (!svg) return;

  const hub = document.getElementById('skills-hub');
  const nodeAi = document.getElementById('node-ai-ml');
  const nodeSe = document.getElementById('node-soft-eng');
  const nodeDa = document.getElementById('node-data-anal');

  // Main paths
  const pathHubAi = document.getElementById('path-hub-ai');
  const pathHubSe = document.getElementById('path-hub-se');
  const pathHubDa = document.getElementById('path-hub-da');
  const pathMobileSpine = document.getElementById('path-mobile-spine');

  // Main static nodes indicators
  const dotHubAi = document.getElementById('node-dot-hub-ai');
  const dotHubSe = document.getElementById('node-dot-hub-se');
  const dotHubDa = document.getElementById('node-dot-hub-da');

  function updateEcosystemGeometry() {
    const isMobile = window.innerWidth <= 767;
    const svgRect = svg.getBoundingClientRect();

    if (!hub || !nodeAi || !nodeSe || !nodeDa) return;

    const rectHub = hub.getBoundingClientRect();
    const rectAi = nodeAi.getBoundingClientRect();
    const rectSe = nodeSe.getBoundingClientRect();
    const rectDa = nodeDa.getBoundingClientRect();

    // Hub center coordinates relative to SVG
    const xh = rectHub.left + rectHub.width / 2 - svgRect.left;
    const yh = rectHub.top + rectHub.height / 2 - svgRect.top;

    // AI & ML card bottom-center coordinates
    const x_ai = rectAi.left + rectAi.width / 2 - svgRect.left;
    const y_ai = rectAi.bottom - svgRect.top;

    // SE card top-right (or right center) coordinates
    const x_se = rectSe.right - svgRect.left;
    const y_se = rectSe.top + rectSe.height / 2 - svgRect.top;
    const x_se_top = rectSe.left + rectSe.width / 2 - svgRect.left;
    const y_se_top = rectSe.top - svgRect.top;

    // DA card top-left coordinates
    const x_da = rectDa.left - svgRect.left;
    const y_da = rectDa.top + rectDa.height / 2 - svgRect.top;
    const x_da_top = rectDa.left + rectDa.width / 2 - svgRect.left;
    const y_da_top = rectDa.top - svgRect.top;

    if (!isMobile) {
      // 1. Draw main paths
      const d_hub_ai = `M ${xh} ${yh} L ${x_ai} ${y_ai}`;
      pathHubAi.setAttribute('d', d_hub_ai);

      const d_hub_se = `M ${xh} ${yh} C ${xh - 60} ${yh + 20}, ${x_se + 60} ${y_se}, ${x_se} ${y_se}`;
      pathHubSe.setAttribute('d', d_hub_se);

      const d_hub_da = `M ${xh} ${yh} C ${xh + 60} ${yh + 20}, ${x_da - 60} ${y_da}, ${x_da} ${y_da}`;
      pathHubDa.setAttribute('d', d_hub_da);

      // Position static visual dots at center of connector curves
      try {
        if (dotHubAi) {
          const len = pathHubAi.getTotalLength();
          if (len > 0) {
            const pt = pathHubAi.getPointAtLength(len * 0.5);
            dotHubAi.setAttribute('cx', pt.x);
            dotHubAi.setAttribute('cy', pt.y);
          }
        }
        if (dotHubSe) {
          const len = pathHubSe.getTotalLength();
          if (len > 0) {
            const pt = pathHubSe.getPointAtLength(len * 0.5);
            dotHubSe.setAttribute('cx', pt.x);
            dotHubSe.setAttribute('cy', pt.y);
          }
        }
        if (dotHubDa) {
          const len = pathHubDa.getTotalLength();
          if (len > 0) {
            const pt = pathHubDa.getPointAtLength(len * 0.5);
            dotHubDa.setAttribute('cx', pt.x);
            dotHubDa.setAttribute('cy', pt.y);
          }
        }
      } catch (err) {
        // SVG paths might not have computed length yet
      }

      // 2. Draw branch paths for each individual skill dots
      const drawBranch = (dotId, pathId, startX, startY, side) => {
        const dot = document.getElementById(dotId);
        const path = document.getElementById(pathId);
        if (!dot || !path) return;
        const dotRect = dot.getBoundingClientRect();
        const xd = dotRect.left + dotRect.width / 2 - svgRect.left;
        const yd = dotRect.top + dotRect.height / 2 - svgRect.top;

        let d_branch = '';
        if (side === 'left') {
          d_branch = `M ${startX} ${startY} C ${startX - 35} ${startY}, ${xd + 35} ${yd}, ${xd} ${yd}`;
        } else {
          d_branch = `M ${startX} ${startY} C ${startX + 35} ${startY}, ${xd - 35} ${yd}, ${xd} ${yd}`;
        }
        path.setAttribute('d', d_branch);
      };

      // AI branches: left
      const x_ai_left = rectAi.left - svgRect.left;
      const y_ai_left = rectAi.top + rectAi.height / 2 - svgRect.top;
      drawBranch('dot-ai-ml1', 'path-ai-ml1', x_ai_left, y_ai_left, 'left');
      drawBranch('dot-ai-ml2', 'path-ai-ml2', x_ai_left, y_ai_left, 'left');
      drawBranch('dot-ai-ml3', 'path-ai-ml3', x_ai_left, y_ai_left, 'left');

      // AI branches: right
      const x_ai_right = rectAi.right - svgRect.left;
      const y_ai_right = rectAi.top + rectAi.height / 2 - svgRect.top;
      drawBranch('dot-ai-tf', 'path-ai-tf', x_ai_right, y_ai_right, 'right');
      drawBranch('dot-ai-pt', 'path-ai-pt', x_ai_right, y_ai_right, 'right');
      drawBranch('dot-ai-sl', 'path-ai-sl', x_ai_right, y_ai_right, 'right');
      drawBranch('dot-ai-kr', 'path-ai-kr', x_ai_right, y_ai_right, 'right');

      // SE branches: left
      const x_se_left = rectSe.left - svgRect.left;
      const y_se_left = rectSe.top + rectSe.height / 2 - svgRect.top;
      drawBranch('dot-se-py', 'path-se-py', x_se_left, y_se_left, 'left');
      drawBranch('dot-se-ja', 'path-se-ja', x_se_left, y_se_left, 'left');
      drawBranch('dot-se-c', 'path-se-c', x_se_left, y_se_left, 'left');
      drawBranch('dot-se-js', 'path-se-js', x_se_left, y_se_left, 'left');

      // SE branches: right
      const x_se_right = rectSe.right - svgRect.left;
      const y_se_right = rectSe.top + rectSe.height / 2 - svgRect.top;
      drawBranch('dot-se-ht', 'path-se-ht', x_se_right, y_se_right, 'right');
      drawBranch('dot-se-cs', 'path-se-cs', x_se_right, y_se_right, 'right');
      drawBranch('dot-se-bs', 'path-se-bs', x_se_right, y_se_right, 'right');
      drawBranch('dot-se-fk', 'path-se-fk', x_se_right, y_se_right, 'right');

      // DA branches: left
      const x_da_left = rectDa.left - svgRect.left;
      const y_da_left = rectDa.top + rectDa.height / 2 - svgRect.top;
      drawBranch('dot-da-pd', 'path-da-pd', x_da_left, y_da_left, 'left');
      drawBranch('dot-da-np', 'path-da-np', x_da_left, y_da_left, 'left');
      drawBranch('dot-da-sq', 'path-da-sq', x_da_left, y_da_left, 'left');
      drawBranch('dot-da-ss', 'path-da-ss', x_da_left, y_da_left, 'left');

      // DA branches: right
      const x_da_right = rectDa.right - svgRect.left;
      const y_da_right = rectDa.top + rectDa.height / 2 - svgRect.top;
      drawBranch('dot-da-eda', 'path-da-eda', x_da_right, y_da_right, 'right');
      drawBranch('dot-da-da', 'path-da-da', x_da_right, y_da_right, 'right');
      drawBranch('dot-da-mp', 'path-da-mp', x_da_right, y_da_right, 'right');
      drawBranch('dot-da-pl', 'path-da-pl', x_da_right, y_da_right, 'right');
      drawBranch('dot-da-pb', 'path-da-pb', x_da_right, y_da_right, 'right');

    } else {
      // Mobile vertical journey spine
      const d_spine = `M ${xh} ${y_ai} L ${xh} ${yh} L ${xh} ${Math.min(y_se_top, y_da_top)}`;
      pathMobileSpine.setAttribute('d', d_spine);
    }
  }

  // Hover animations & One-shot signal trigger function
  function triggerOneShotSignal(pathId, color) {
    const pathElement = document.getElementById(pathId);
    if (!pathElement) return;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "3");
    circle.setAttribute("fill", color);
    circle.style.pointerEvents = "none";

    const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
    anim.setAttribute("dur", "0.6s");
    anim.setAttribute("repeatCount", "1");
    anim.setAttribute("fill", "remove");

    const mpath = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
    mpath.setAttribute("href", `#${pathId}`);

    anim.appendChild(mpath);
    circle.appendChild(anim);
    svg.appendChild(circle);

    try {
      anim.beginElement();
    } catch (e) {
      // browser compatibility fallback
    }

    setTimeout(() => {
      circle.remove();
    }, 650);
  }

  function bindEcosystemEvents() {
    const bindNodeHover = (nodeEl, mainPathEl, activeColor, branchPaths) => {
      if (!nodeEl || !mainPathEl) return;
      nodeEl.addEventListener('mouseenter', () => {
        mainPathEl.classList.add('active');
        branchPaths.forEach(id => {
          const path = document.getElementById(id);
          if (path) path.classList.add('active');
        });
      });

      nodeEl.addEventListener('mouseleave', () => {
        mainPathEl.classList.remove('active');
        branchPaths.forEach(id => {
          const path = document.getElementById(id);
          if (path) path.classList.remove('active');
        });
      });
    };

    const aiBranches = ['path-ai-ml1', 'path-ai-ml2', 'path-ai-ml3', 'path-ai-tf', 'path-ai-pt', 'path-ai-sl', 'path-ai-kr'];
    const seBranches = ['path-se-py', 'path-se-ja', 'path-se-c', 'path-se-js', 'path-se-ht', 'path-se-cs', 'path-se-bs', 'path-se-fk'];
    const daBranches = ['path-da-pd', 'path-da-np', 'path-da-sq', 'path-da-ss', 'path-da-eda', 'path-da-da', 'path-da-mp', 'path-da-pl', 'path-da-pb'];

    bindNodeHover(nodeAi, pathHubAi, 'var(--accent-purple)', aiBranches);
    bindNodeHover(nodeSe, pathHubSe, 'var(--accent-blue)', seBranches);
    bindNodeHover(nodeDa, pathHubDa, 'var(--accent-green)', daBranches);

    // Bind skill labels to highlight path and fire a one-shot signal dot
    document.querySelectorAll('.skill-label-item').forEach(label => {
      const pathId = label.getAttribute('data-path');
      const wrapper = label.closest('.skills-node-wrapper');
      if (!wrapper) return;
      const containerClass = wrapper.className;
      let color = 'var(--accent-blue)';
      if (containerClass.includes('container-ai')) color = 'var(--accent-purple)';
      if (containerClass.includes('container-da')) color = 'var(--accent-green)';

      label.addEventListener('mouseenter', () => {
        const path = document.getElementById(pathId);
        if (path) path.classList.add('active');
        triggerOneShotSignal(pathId, color);
      });

      label.addEventListener('mouseleave', () => {
        const path = document.getElementById(pathId);
        if (path) path.classList.remove('active');
      });
    });
  }

  // Debounced draw logic for performance and handling layout transitions
  let resizeTimeout = null;
  function debouncedDraw() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateEcosystemGeometry();
    }, 100);
  }

  window.addEventListener('resize', debouncedDraw);
  window.addEventListener('orientationchange', debouncedDraw);

  // Stagger draw to allow page offsets, fonts, and grid rendering to complete
  setTimeout(updateEcosystemGeometry, 100);
  setTimeout(updateEcosystemGeometry, 500);
  setTimeout(updateEcosystemGeometry, 1000);

  // ResizeObserver on the right ecosystem column to handle reactive grid changes instantly
  if ('ResizeObserver' in window) {
    const rightCol = document.querySelector('.skills-right-col');
    if (rightCol) {
      const colObserver = new ResizeObserver(() => {
        debouncedDraw();
      });
      colObserver.observe(rightCol);
    }
  }

  // IntersectionObserver to pause/draw when section is scrolled out of viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Trigger drawing when entering
        if (entry.isIntersecting) {
          updateEcosystemGeometry();
        }
      });
    }, { threshold: 0.1 });
    const skillsEl = document.getElementById('skills') || document.getElementById('toolkit');
    if (skillsEl) observer.observe(skillsEl);
  }

  bindEcosystemEvents();
  initJourneyTimeline();
}

export function initJourneyTimeline() {
  const toggleButtons = document.querySelectorAll('.timeline-toggle-btn');
  toggleButtons.forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const controlsId = btn.getAttribute('aria-controls');
      const target = document.getElementById(controlsId);
      if (!target) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const willExpand = !isExpanded;
      btn.setAttribute('aria-expanded', String(willExpand));

      if (willExpand) {
        target.removeAttribute('hidden');
        target.style.display = 'block';
      } else {
        target.setAttribute('hidden', '');
        target.style.display = 'none';
      }

      const textSpan = btn.querySelector('.toggle-text');
      if (textSpan) {
        textSpan.textContent = willExpand ? 'Hide details' : 'View details';
      }
    });
  });
}
