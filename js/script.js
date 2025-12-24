// Initialize libraries
document.addEventListener("DOMContentLoaded", function () {
  AOS.init();

  // Initialize Typed.js
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

  // Theme toggle functionality
  const toggleBtn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const body = document.body;

  function setTheme(isLight) {
    if (isLight) {
      body.classList.add("light-mode");
      body.classList.remove("dark");
      if (icon) icon.innerHTML = '<img src="assets/sun.png" alt="Light Mode" style="width: 19px; height: 19px;">';
    } else {
      body.classList.remove("light-mode");
      body.classList.add("dark");
      if (icon) icon.innerHTML = '<i class="fas fa-moon" ></i>';
    }
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') setTheme(false);
  else if (savedTheme === 'light') setTheme(true);
  else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(!prefersDark);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isLight = !body.classList.contains("light-mode");
      setTheme(isLight);
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // Tilt effect for cards
  VanillaTilt.init(document.querySelectorAll(".project-card, .experience-card, .skill-card"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
  });

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

  // EmailJS Configuration
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: "GvfnZrKiGDpB0yff1",
    SERVICE_ID: "service_oglwqbv",
    TEMPLATE_ID: "template_n533ec8"
  };
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

  function checkRateLimit() {
    const lastSubmission = localStorage.getItem('last_submission_time');
    if (lastSubmission) {
      const fiveMinutes = 5 * 60 * 1000;
      const timePassed = Date.now() - parseInt(lastSubmission);
      if (timePassed < fiveMinutes) {
        return { limited: true, remaining: Math.ceil((fiveMinutes - timePassed) / 60000) };
      }
    }
    return { limited: false };
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const rateLimitStatus = checkRateLimit();
      if (rateLimitStatus.limited) {
        showToast(`⏳ Please wait ${rateLimitStatus.remaining} minutes before sending another message.`, "error");
        return;
      }

      const btn = this.querySelector("button[type='submit']");
      const originalText = btn.textContent;
      btn.classList.add("loading");
      btn.textContent = "Sending...";

      document.getElementById("email-time").value = new Date().toLocaleString();

      emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, this)
        .then(() => {
          this.reset();
          localStorage.setItem('last_submission_time', Date.now().toString());
          showToast("📬 Message sent! Talk soon 👋", "success");
          btn.classList.remove("loading");
          btn.textContent = "Message Sent! 🚀";
          btn.style.backgroundColor = "var(--success)";
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
          }, 3000);
        })
        .catch((error) => {
          btn.classList.remove("loading");
          btn.textContent = originalText;
          let errorMessage = !navigator.onLine ? "❌ No internet connection." : "❌ Email service error.";
          showToast(errorMessage, "error");
          console.error("EmailJS Error:", error);
        });
    });
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `form-message ${type}`;
    toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; max-width: 400px; z-index: 9999; padding: 12px 20px; border-radius: 12px; font-size: 16px; font-weight: 500; box-shadow: 0 8px 20px rgba(0,0,0,0.2); transition: opacity 0.3s ease-in-out; background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: #fff;`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

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
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollProgress) scrollProgress.style.width = `${(scrollTop / scrollHeight) * 100}%`;

    // Back to Top
    if (backToTopBtn) backToTopBtn.classList.toggle("visible", scrollTop > 500);
  });

  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Projects: Filtering & Search
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById('project-search');

  function updateProjectVisibility() {
    const searchQuery = searchInput?.value.toLowerCase().trim() || "";
    const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
    
    document.querySelectorAll(".project-card").forEach((card) => {
      const category = card.getAttribute("data-category");
      const title = card.querySelector('.project-title')?.textContent.toLowerCase() || "";
      const description = card.querySelector('.project-description')?.textContent.toLowerCase() || "";
      const matchesSearch = !searchQuery || `${title} ${description}`.includes(searchQuery);
      const matchesFilter = activeFilter === "all" || category === activeFilter;
      
      if (matchesSearch && matchesFilter) {
        card.classList.remove("hide");
        card.classList.add("show");
      } else {
        card.classList.add("hide");
        card.classList.remove("show");
      }
    });
    setTimeout(() => AOS.refresh(), 100);
  }

  filterBtns.forEach(btn => btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateProjectVisibility();
  }));
  if (searchInput) searchInput.addEventListener("input", updateProjectVisibility);

  // Resume Modal
  const resumeModal = document.getElementById("resume-modal");
  const resumeCloseModal = document.getElementById("close-resume-modal");
  const resumeButtons = document.querySelectorAll('a[href*="Saketh_Lingerker_8688791352.pdf"]');

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }

  if (resumeModal && resumeButtons.length > 0) {
    resumeButtons.forEach(btn => {
      if (!btn.hasAttribute('download')) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const isMobile = isMobileDevice();
          document.querySelectorAll('.desktop-view').forEach(el => el.style.display = isMobile ? 'none' : 'block');
          document.querySelector('.mobile-view').style.display = isMobile ? 'block' : 'none';
          resumeModal.classList.add("open");
          document.body.style.overflow = "hidden";
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

      document.getElementById("modal-title").innerText = title; // Plain text title
      // document.getElementById("modal-description").textContent = desc; // Removed description per new design

      document.getElementById("modal-tags").innerHTML = tags;
      document.getElementById("modal-links").innerHTML = links; // Inject links at bottom
      
      const probSec = document.getElementById("modal-problem-section");
      const probText = document.getElementById("modal-problem");
      if (problem && probSec && probText) {
        probText.innerHTML = problem;
        probSec.style.display = "block";
      } else if (probSec) probSec.style.display = "none";

      // Handle Case Study (Impact/Lessons)
      const caseStudyContent = card.querySelector(".project-case-study")?.innerHTML;
      const caseStudyContainer = document.getElementById("modal-case-study");
      const caseStudySection = document.getElementById("modal-case-study-section");
      
      if (caseStudyContent && caseStudyContainer) {
        caseStudyContainer.innerHTML = caseStudyContent;
        if(caseStudySection) caseStudySection.style.display = "block";
      } else if (caseStudySection) {
        caseStudySection.style.display = "none";
      }

      const highlights = card.querySelector(".project-highlights")?.innerHTML;
      if (highlights) document.getElementById("modal-highlights").innerHTML = highlights;

      projectModal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  if (closeProjectModal) closeProjectModal.addEventListener("click", () => {
    projectModal.classList.remove("open");
    document.body.style.overflow = "auto";
  });

  // Interactive Features (Chatbot, Terminal, Quiz, Snippets)
  
  // Chatbot
  const chatbot = document.getElementById("ai-chatbot");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMsgs = document.getElementById("ai-chatbot-messages");
  
  const chatbotResponses = {
    "hello": "Hi there! How can I help you learn more about Saketh?",
    "projects": "Saketh has worked on AI Interior Designers, ATS Resume Experts, and MLOps pipelines.",
    "skills": "His core skills include Python, ML (TensorFlow, PyTorch), Full-Stack (React, Flask), and Cloud.",
    "contact": "Reach him at saketh1805@gmail.com or via the form above."
  };

  document.getElementById("chatbot-toggle")?.addEventListener("click", () => chatbot.classList.toggle("active"));
  document.getElementById("close-chatbot")?.addEventListener("click", () => chatbot.classList.remove("active"));

  function chatMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;
    div.textContent = text;
    chatbotMsgs.appendChild(div);
    chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
  }

  document.getElementById("send-chatbot")?.addEventListener("click", () => {
    const val = chatbotInput.value.trim();
    if (!val) return;
    chatMessage(val, "user");
    chatbotInput.value = "";
    const response = chatbotResponses[Object.keys(chatbotResponses).find(k => val.toLowerCase().includes(k))] || "Interesting! Ask about 'projects', 'skills', or 'contact'.";
    setTimeout(() => chatMessage(response, "ai"), 500);
  });

  // Terminal
  const terminal = document.getElementById("portfolio-terminal");
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  
  const termCommands = {
    "help": "Commands: help, ls, whoami, contact, clear, theme",
    "ls": "about.txt  projects/  skills/  contact.info  resume.pdf",
    "whoami": "Saketh Lingerker - AI/ML Engineer & Full-Stack Developer."
  };

  document.getElementById("terminal-toggle")?.addEventListener("click", () => terminal.classList.toggle("active"));
  document.getElementById("close-terminal")?.addEventListener("click", () => terminal.classList.remove("active"));
  window.addEventListener("keydown", (e) => { if (e.key === "`") terminal.classList.toggle("active"); });

  if (termInput) termInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const cmd = termInput.value.toLowerCase().trim();
      termInput.value = "";
      const line = document.createElement("div");
      line.className = "terminal-line";
      line.textContent = `saketh@portfolio:~$ ${cmd}`;
      termOutput.appendChild(line);
      
      if (cmd === "clear") termOutput.innerHTML = "";
      else if (cmd === "theme") document.getElementById("theme-toggle")?.click();
      else {
        const out = document.createElement("div");
        out.className = "terminal-line command-output";
        out.textContent = termCommands[cmd] || `Command not found: ${cmd}`;
        termOutput.appendChild(out);
      }
      termOutput.scrollTop = termOutput.scrollHeight;
    }
  });

  // Quiz
  const quizModal = document.getElementById("quiz-modal");
  const quizQ = document.getElementById("quiz-question");
  const quizO = document.getElementById("quiz-options");
  const quizR = document.getElementById("quiz-result");
  
  let qIdx = 0;
  const questions = [{ q: "Area of interest?", o: ["AI/ML", "Web Dev"] }];
  
  document.getElementById("quiz-toggle")?.addEventListener("click", () => {
    quizModal.classList.add("open");
    qIdx = 0;
    quizR.classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    showQ();
  });

  function showQ() {
    quizQ.textContent = questions[qIdx].q;
    quizO.innerHTML = "";
    questions[qIdx].o.forEach(opt => {
      const b = document.createElement("div");
      b.className = "quiz-option";
      b.textContent = opt;
      b.onclick = () => {
        document.getElementById("quiz-container").classList.add("hidden");
        quizR.classList.remove("hidden");
        document.getElementById("matched-project-display").innerHTML = "<h4>Recommended: AI Virtual Designer</h4>";
      };
      quizO.appendChild(b);
    });
  }
  
  document.getElementById("close-quiz")?.addEventListener("click", () => quizModal.classList.remove("open"));



  // Privacy Policy
  document.getElementById("privacy-policy-link")?.addEventListener("click", () => document.getElementById("privacy-modal").classList.add("open"));
  document.getElementById("close-privacy")?.addEventListener("click", () => document.getElementById("privacy-modal").classList.remove("active"));

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target === privacyModal || e.target === quizModal) {
      e.target.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  });
});
