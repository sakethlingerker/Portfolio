// Initialize libraries
document.addEventListener("DOMContentLoaded", function() {
  AOS.init();
  new Rellax('.rellax');

  // Initialize Typed.js
  new Typed("#typed", {
    strings: [
      "Saketh Lingerker",
      "AI/ML Developer",
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
      icon.innerHTML = '<img src="assets/sun.png" alt="Light Mode" style="width: 16px; height: 16px;">';
    } else {
      body.classList.remove("light-mode");
      body.classList.add("dark");
      icon.innerHTML = '<i class="fas fa-moon"></i>';
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
    document.querySelectorAll(
      ".project-card, .experience-card, .skill-card"
    ),
    {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    }
  );

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
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
  const elements = [...projectCards, ...experienceCards, ...skillCards, ...skillTags];
  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  // Animate on scroll
  const animateOnScroll = () => {
    elements.forEach((el) => {
      const elPosition = el.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;

      if (elPosition < screenPosition) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  };

  window.addEventListener("scroll", animateOnScroll);
  window.addEventListener("load", animateOnScroll);

  // Initialize EmailJS
  emailjs.init("GvfnZrKiGDpB0yff1");

  // Contact form submission
  document.getElementById("contact-form").addEventListener("submit", function(e) {
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
    const navLinks = document.querySelectorAll(".main-nav-links a, .mobile-nav-links a");

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
});

module.exports = {
  darkMode: 'class',
  // ...rest of config
}