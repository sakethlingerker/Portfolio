// Main Entry Point
// CSS is now loaded via index.html to prevent FOUC
// import '../css/main.css';
import { initTheme } from "./modules/theme.js";
import "./preloader.js"; // Import preloader to run its IIFE
import { initUI, initJourneyTimeline } from "./modules/ui.js";
import { initEmail } from "./modules/email.js";
import { setupGlobalErrorHandling } from "./modules/utils.js";
import { initTerminal } from "./modules/terminal.js";
import { initWorkbench } from "./modules/workbench.js";
import { initProjects } from "./modules/projects.js";
import { initMatchmaker } from "./modules/matchmaker.js";
import { initCertifications } from "./modules/certifications.js";
import { initCinematicUI } from "./modules/cinematic.js";
import { toast } from "./modules/toast.js";

async function initApp() {
  // Initialize AOS
  if (window.AOS) AOS.init();

  setupGlobalErrorHandling();

  initRoleBadgeAnimation();

  initCinematicUI();
  initTheme();
  initUI();
  initJourneyTimeline();
  try {
    await initEmail();
  } catch (error) {
    console.error("EmailJS initialization failed:", error);
  }
  await initProjects();
  await initWorkbench();
  await initMatchmaker();
  initCertifications();
  initTerminal();

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .catch((registrationError) => {
          console.warn('SW registration skipped: ', registrationError);
        });
    });
  }
}

function initRoleBadgeAnimation() {
  const badge = document.querySelector('.hero-role-badge');
  if (!badge) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    badge.classList.add('animate-in');
    return;
  }

  const triggerAnimation = () => {
    if (badge.classList.contains('animate-in')) return;
    badge.classList.add('animate-in');
  };

  const isPreloaderActive = () => {
    const boot = document.querySelector('.boot:not(.boot-hidden)');
    const preloader = document.getElementById('preloader');
    return !!((boot && getComputedStyle(boot).display !== 'none') || 
              (preloader && !preloader.classList.contains('slide-out')) || 
              document.body.classList.contains('preloader-active'));
  };

  if (!isPreloaderActive() || document.body.classList.contains('hero-ready')) {
    setTimeout(triggerAnimation, 200);
  } else {
    window.addEventListener('hero:ready', () => {
      // 120ms pause after boot begins fading so the hero is visible and user clearly witnesses the entrance
      setTimeout(triggerAnimation, 120);
    }, { once: true });
    // Fallback if hero:ready event is missed or preloader finishes early
    setTimeout(triggerAnimation, 4000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

