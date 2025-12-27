export function initUI() {
  // Initialize Typed.js
  if (typeof Typed !== 'undefined') {
    new Typed("#typed", {
      strings: [
        "Saketh Lingerker",
        "AI/ML Developer",
        "Full-Stack Developer",
        "Deep Learning Enthusiast",
        "Tech Explorer",
      ],
      typeSpeed: 50,
      backSpeed: 80,
      backDelay: 2000,
      loop: true,
      showCursor: false,
    });
  }

  // Tilt effect for cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".project-card, .experience-card, .skill-card"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
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

  if (mobileMenuToggle) mobileMenuToggle.addEventListener("click", () => mobileNavOverlay.classList.add("active"));
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", () => mobileNavOverlay.classList.remove("active"));
  document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
    link.addEventListener("click", () => mobileNavOverlay.classList.remove("active"));
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
      const title = card.querySelector(".project-title").textContent.trim();
      const desc = card.querySelector(".project-description").textContent.trim();
      const tags = card.querySelector(".project-tags").innerHTML;
      const links = card.querySelector(".project-links").innerHTML;
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
    if (e.target === privacyModal || e.target === document.getElementById("quiz-modal")) {
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
}
