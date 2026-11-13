/**
 * Research Page Entry Script
 * Initializes technical research presentation on Speech Signal Processing & VAD
 * conducted at Language Technologies Research Center (LTRC), IIIT Hyderabad,
 * interactive architecture diagram, and verified credentials.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initWorkbench } from "../modules/workbench.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";

async function initResearchPage() {
  setupGlobalErrorHandling();

  // Initialize shared navigation shell for 'research' page
  initGlobalNav("research");

  // Dismiss any boot preloader
  const boot = document.querySelector(".boot");
  if (boot) boot.style.display = "none";
  document.body.classList.remove("preloader-active");
  document.body.classList.add("hero-ready");

  // Initialize Workbench in background for Ctrl+K
  try {
    await initWorkbench();
  } catch (err) {
    console.warn("Workbench initialization warning:", err);
  }

  // Initialize GSAP scroll reveals
  const scrollController = initScrollReveals();
  window.scrollAnimationController = scrollController;

  // Register Service Worker
  registerServiceWorker();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const base = import.meta.env?.BASE_URL || "./";
    const swPath = `${base.endsWith("/") ? base : `${base}/`}sw.js`;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(swPath).catch(() => {});
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initResearchPage);
} else {
  initResearchPage();
}

