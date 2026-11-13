/**
 * Global Navigation & Shared Shell Controller
 * Manages topbar scroll state, mobile drawer, reading progress, active page markers,
 * and base-path-aware navigation.
 */

import { initTheme } from "./theme.js";
import { openWorkbench } from "./workbench.js";

export function initGlobalNav(currentPage = "home") {
  initTheme();
  setupScrollState();
  setupMobileMenu();
  setupReadingProgress();
  setupActiveNavHighlight(currentPage);
  setupFooterNav(currentPage);
  setupWorkbenchTriggers();
  setupBaseLinks();
  setupFloatingBackToTop();
  setupSegmentedRail3D();
}

/**
 * Automatically ensures the current page is excluded from footer navigation
 * and preserves correct GitHub Pages base path (/Portfolio/).
 */
function setupFooterNav(currentPage) {
  const base = import.meta.env?.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  // Find all footer navigation links marked with data-footer-link
  const footerLinks = document.querySelectorAll('.footer-nav-col a[data-footer-link]');

  footerLinks.forEach((link) => {
    const page = link.getAttribute('data-footer-link');
    if (!page) return;

    // Automatically exclude current page
    if (page === currentPage) {
      link.closest('li')?.remove();
      return;
    }

    // Ensure link navigates with correct base path
    let targetHref = normalizedBase;
    if (page !== 'home') {
      targetHref = `${normalizedBase}${page}/`;
    }
    link.setAttribute('href', targetHref);
  });
}

/**
 * Ensures internal links work correctly under both root and base paths (/Portfolio/)
 */
function setupBaseLinks() {
  const base = import.meta.env?.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  // Normalize links that start with /Portfolio/ if base is different, or ensure base is prepended
  document.querySelectorAll('a[data-nav-link], .rail-segment[data-page], .rail-talk-btn[data-page], .mobile-cinematic-menu a[data-page]').forEach((link) => {
    const page = link.getAttribute('data-nav-link') || link.getAttribute('data-page');
    if (!page) return;

    let targetHref = normalizedBase;
    if (page !== 'home') {
      targetHref = `${normalizedBase}${page}/`;
    }
    link.setAttribute('href', targetHref);
  });
}

function setupScrollState() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const updateHeader = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    topbar.classList.toggle("scrolled", scrollTop > 40);
    topbar.classList.toggle("shrink", scrollTop > 90);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-cinematic-menu");
  if (!menuToggle || !mobileMenu) return;

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.innerHTML = shouldOpen
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>`;
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  };

  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      toggleMenu(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && mobileMenu.classList.contains("open")) {
      toggleMenu(false);
    }
  });
}

function setupReadingProgress() {
  const progressBar = document.querySelector(".reading-progress");
  if (!progressBar) return;

  let ticking = false;
  const updateProgress = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const progress = Math.min(1, Math.max(0, window.scrollY / docHeight));
      progressBar.style.transform = `scaleX(${progress})`;
    }
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();
}

function setupActiveNavHighlight(currentPage) {
  const navLinks = document.querySelectorAll(
    ".rail-segment[data-page], .rail-talk-btn[data-page], .topbar nav a, .mobile-cinematic-menu a[data-page], .talk-btn[data-page]"
  );
  navLinks.forEach((link) => {
    const page = link.getAttribute("data-page");
    const isActive = page === currentPage;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setupWorkbenchTriggers() {
  const desktopBtn = document.getElementById("workbench-nav-trigger");
  const mobileBtn = document.getElementById("mobile-workbench-trigger");

  if (desktopBtn) {
    desktopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openWorkbench();
    });
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mobileMenu = document.querySelector(".mobile-cinematic-menu");
      if (mobileMenu) {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      }
      openWorkbench();
    });
  }
}

/**
 * Manages the floating Back to Top button:
 * - Appears after scrolling down (> 320px)
 * - Smoothly scrolls to top on click (respecting prefers-reduced-motion)
 * - Automatically initializes or injects the button if missing
 */
function setupFloatingBackToTop() {
  let btn = document.getElementById("floating-back-to-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "floating-back-to-top";
    btn.className = "floating-back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.setAttribute("title", "Back to top");
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    document.body.appendChild(btn);
  }

  const updateVisibility = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    btn.classList.toggle("visible", scrollTop > 320);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

/**
 * Subtle 3D tilt and micro-interactions for the segmented rail navbar
 */
function setupSegmentedRail3D() {
  const segments = document.querySelectorAll(".rail-segment, .rail-workbench-btn, .rail-talk-btn, .rail-brand-badge");
  if (!segments.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  segments.forEach((seg) => {
    let bounds = null;

    const onMouseEnter = () => {
      bounds = seg.getBoundingClientRect();
    };

    const onMouseMove = (e) => {
      if (!bounds) bounds = seg.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = (mouseX / bounds.width) - 0.5; // -0.5 to 0.5
      const yPct = (mouseY / bounds.height) - 0.5;

      const tiltX = -yPct * 7; // subtle max 3.5deg
      const tiltY = xPct * 7;

      seg.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      seg.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    };

    const onMouseLeave = () => {
      seg.style.removeProperty("--tilt-x");
      seg.style.removeProperty("--tilt-y");
      bounds = null;
    };

    seg.addEventListener("mouseenter", onMouseEnter, { passive: true });
    seg.addEventListener("mousemove", onMouseMove, { passive: true });
    seg.addEventListener("mouseleave", onMouseLeave, { passive: true });
  });
}

