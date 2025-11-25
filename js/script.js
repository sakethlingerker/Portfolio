// Initialize libraries
document.addEventListener("DOMContentLoaded", function () {
  AOS.init();
  // Remove Rellax since you don't have .rellax elements
  // new Rellax(".rellax");

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

  // Function to set theme
  function setTheme(isLight) {
    if (isLight) {
      body.classList.add("light-mode");
      body.classList.remove("dark");
      icon.innerHTML =
        '<img src="assets/sun.png" alt="Light Mode" style="width: 19px; height: 19px;">';
    } else {
      body.classList.remove("light-mode");
      body.classList.add("dark");
      icon.innerHTML = '<i class="fas fa-moon" ></i>';
    }
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    setTheme(true);
  } else {
    setTheme(false);
  }

  toggleBtn.addEventListener("click", () => {
    const isLight = !body.classList.contains("light-mode");
    setTheme(isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Tilt effect for cards
  VanillaTilt.init(
    document.querySelectorAll(".project-card, .experience-card, .skill-card"),
    {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    }
  );

  // Smooth scrolling for navigation links
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

  // Animation on scroll for project cards
  const projectCards = document.querySelectorAll(".project-card");
  const experienceCards = document.querySelectorAll(".experience-card");
  const skillCards = document.querySelectorAll(".skill-card");
  const skillTags = document.querySelectorAll(".skill-tag");

  // Set initial state for animated elements
  const elements = [
    ...projectCards,
    ...experienceCards,
    ...skillCards,
    ...skillTags,
  ];
  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  // Animate on scroll using Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));

  // Initialize EmailJS
  emailjs.init("GvfnZrKiGDpB0yff1");

  // Contact form submission
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      document.getElementById("email-time").value = new Date().toLocaleString();

      emailjs
        .sendForm("service_oglwqbv", "template_n533ec8", this)
        .then(() => {
          this.reset();

          // Success toast
          const toast = document.createElement("div");
          toast.textContent = "📬 Message sent! Talk soon 👋";
          toast.style.position = "fixed";
          toast.style.bottom = "20px";
          toast.style.right = "20px";
          toast.style.background = "#2563eb";
          toast.style.color = "#fff";
          toast.style.padding = "12px 20px";
          toast.style.borderRadius = "12px";
          toast.style.fontSize = "16px";
          toast.style.fontWeight = "500";
          toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
          toast.style.zIndex = "9999";
          toast.style.transition = "opacity 0.3s ease-in-out";
          document.body.appendChild(toast);

          setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
          }, 4000);
        })
        .catch((error) => {
          alert("Something went wrong.");
          console.error(error);
        });
    });

  // Mobile navigation functionality
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileNavOverlay.classList.add("active");
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("active");
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("active");
    });
  });

  // Active link highlighting
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(
      ".main-nav-links a, .mobile-nav-links a"
    );

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Scroll Progress Bar & Back to Top
  const scrollProgress = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    if(scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Back to Top Button Visibility
    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Project Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectItems.forEach((item) => {
        if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
          item.classList.remove("hide");
          item.classList.add("show");
        } else {
          item.classList.add("hide");
          item.classList.remove("show");
        }
      });
      
      // Refresh AOS to recalculate positions after layout change
      setTimeout(() => {
        AOS.refresh();
      }, 100); // Small delay to ensure DOM update
    });
  });

  // RESUME MODAL - FIXED VERSION
  const resumeModal = document.getElementById("resume-modal");
  const resumeCloseModal = document.getElementById("close-resume-modal");
  
  // Find ALL resume buttons (including the one in hero section)
  const resumeButtons = document.querySelectorAll('a[href*="Saketh_Lingerker_8688791352.pdf"]');
  
  console.log("Found resume buttons:", resumeButtons.length);

  if (resumeButtons.length > 0 && resumeModal && resumeCloseModal) {
    resumeButtons.forEach(btn => {
      // Only add listener to buttons that are NOT download links
      if (!btn.hasAttribute('download')) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("Opening resume modal");
          resumeModal.classList.add("open");
          document.body.style.overflow = "hidden";
        });
      }
    });

    resumeCloseModal.addEventListener("click", () => {
      resumeModal.classList.remove("open");
      document.body.style.overflow = "auto";
    });

    window.addEventListener("click", (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove("open");
        document.body.style.overflow = "auto";
      }
    });
    
    console.log("Resume modal initialized successfully!");
  } else {
    console.log("Resume modal elements not found:", {
      resumeButtons: resumeButtons.length,
      resumeModal: !!resumeModal,
      resumeCloseModal: !!resumeCloseModal
    });
  }

  // Header Shrink on Scroll
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("shrink");
    } else {
      header.classList.remove("shrink");
    }
  });

  // Timeline Read More Toggle
  const timelineToggles = document.querySelectorAll(".timeline-toggle");
  timelineToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const details = toggle.previousElementSibling;
      details.classList.toggle("hidden");
      toggle.classList.toggle("active");
      
      if (details.classList.contains("hidden")) {
        toggle.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
      } else {
        toggle.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
      }
      
      // Refresh AOS
      setTimeout(() => AOS.refresh(), 300);
    });
  });

  // Custom Cursor
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  
  if (cursor && follower) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      
      // Small delay for follower
      setTimeout(() => {
        follower.style.left = e.clientX + "px";
        follower.style.top = e.clientY + "px";
      }, 50);
    });

    // Hover effects
    const links = document.querySelectorAll("a, button, .btn, .filter-btn, .skill-tag, .project-card");
    links.forEach(link => {
      link.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
        follower.classList.add("active");
      });
      link.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
        follower.classList.remove("active");
      });
    });
  }

  // Project Modals
  const projectModal = document.getElementById("project-modal");
  const closeProjectModal = document.getElementById("close-project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-description");
  const modalProblemSection = document.getElementById("modal-problem-section");
  const modalProblem = document.getElementById("modal-problem");
  const modalHighlights = document.getElementById("modal-highlights");
  const modalTags = document.getElementById("modal-tags");
  const modalLinks = document.getElementById("modal-links");
  const modalProjectCards = document.querySelectorAll(".project-card");

  if (projectModal && closeProjectModal) {
    modalProjectCards.forEach(card => {
      card.addEventListener("click", (e) => {
        // Prevent modal opening if clicking directly on a link
        if (e.target.closest("a")) return;

        const title = card.querySelector(".project-title").textContent.trim();
        const desc = card.querySelector(".project-description").textContent.trim();
        const highlightsList = card.querySelector(".project-highlights");
        const tags = card.querySelector(".project-tags").innerHTML;
        const links = card.querySelector(".project-links").innerHTML;

        // Create title with inline link
        modalTitle.innerHTML = `${title} <span class="modal-title-links">${links}</span>`;
        modalDesc.textContent = desc;
        modalTags.innerHTML = tags;
        modalLinks.innerHTML = ''; // Clear the bottom links section

        // Handle Problem Statement extraction
        const problemDiv = card.querySelector(".project-problem");
        const problemStatement = problemDiv ? problemDiv.innerHTML.trim() : "";

        if (problemStatement && modalProblemSection && modalProblem) {
          modalProblem.innerHTML = problemStatement;
          modalProblemSection.style.display = "block";
        } else if (modalProblemSection) {
          modalProblemSection.style.display = "none";
        }

        // Handle Highlights
        if (highlightsList) {
          modalHighlights.innerHTML = highlightsList.innerHTML;
        }

        projectModal.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    closeProjectModal.addEventListener("click", () => {
      projectModal.classList.remove("open");
      document.body.style.overflow = "auto";
    });

    window.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove("open");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Contact Form Loading State
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      const btn = this.querySelector("button[type='submit']");
      if (btn) {
        const originalText = btn.textContent;
        btn.classList.add("loading");
        btn.textContent = "Sending..."; 

        // Simulate success after 2 seconds (or replace with actual promise handling)
        setTimeout(() => {
          btn.classList.remove("loading");
          btn.textContent = "Message Sent! 🚀";
          btn.style.backgroundColor = "var(--success)";
          
          // Reset form
          contactForm.reset();

          // Reset button after another 3 seconds
          setTimeout(() => {
             btn.textContent = originalText;
             btn.style.backgroundColor = ""; // Revert to original CSS
          }, 3000);
        }, 2000);
      }
    });
  }
});

// RESUME MODAL - Fixed PDF opening and close button
const resumeModal = document.getElementById("resume-modal");
const resumeCloseModal = document.getElementById("close-resume-modal");
const resumeButtons = document.querySelectorAll('a[href*="Saketh_Lingerker_8688791352.pdf"]');

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

if (resumeButtons.length > 0 && resumeModal && resumeCloseModal) {
    resumeButtons.forEach(btn => {
        if (!btn.hasAttribute('download')) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                
                const isMobile = isMobileDevice();
                console.log("Opening resume on:", isMobile ? "Mobile" : "Desktop");
                
                if (isMobile) {
                    // Show mobile image preview
                    document.querySelectorAll('.desktop-view').forEach(el => el.style.display = 'none');
                    document.querySelector('.mobile-view').style.display = 'block';
                } else {
                    // Show desktop PDF iframe
                    document.querySelectorAll('.desktop-view').forEach(el => el.style.display = 'block');
                    document.querySelector('.mobile-view').style.display = 'none';
                }
                
                resumeModal.classList.add("open");
                document.body.style.overflow = "hidden";
            });
        }
    });

    // FIXED: PDF opening functionality
    document.getElementById('open-pdf-btn')?.addEventListener('click', function() {
        const pdfUrl = 'assets/Saketh_Lingerker_8688791352.pdf';
        
        // Method 1: Try to open in new tab
        const newWindow = window.open(pdfUrl, '_blank');
        
        // Method 2: If blocked, use download approach
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            console.log("Popup blocked, forcing download");
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.target = '_blank';
            link.download = 'Saketh_Lingerker_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        // Close the modal after opening PDF
        resumeModal.classList.remove("open");
        document.body.style.overflow = "auto";
    });

    resumeCloseModal.addEventListener("click", () => {
        resumeModal.classList.remove("open");
        document.body.style.overflow = "auto";
    });

    window.addEventListener("click", (e) => {
        if (e.target === resumeModal) {
            resumeModal.classList.remove("open");
            document.body.style.overflow = "auto";
        }
    });

    // Simple image zoom for mobile
    const resumeImage = document.querySelector('.resume-image');
    if (resumeImage) {
        let isZoomed = false;
        
        resumeImage.addEventListener('click', function() {
            isZoomed = !isZoomed;
            this.classList.toggle('zoomed');
        });
        
        // Auto-exit zoom when clicking outside (on modal background)
        resumeModal.addEventListener('click', function(e) {
            if (isZoomed && !e.target.classList.contains('resume-image')) {
                resumeImage.classList.remove('zoomed');
                isZoomed = false;
            }
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (resumeModal.classList.contains('open')) {
        const isMobile = isMobileDevice();
        if (isMobile) {
            document.querySelectorAll('.desktop-view').forEach(el => el.style.display = 'none');
            document.querySelector('.mobile-view').style.display = 'block';
        } else {
            document.querySelectorAll('.desktop-view').forEach(el => el.style.display = 'block');
            document.querySelector('.mobile-view').style.display = 'none';
        }
    }
});