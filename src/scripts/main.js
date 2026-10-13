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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

