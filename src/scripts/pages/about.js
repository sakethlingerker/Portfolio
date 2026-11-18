/**
 * About Page Entry Script
 * Initializes professional identity, 8-stage cinematic portrait animation,
 * Engineering Mindset, interactive Systems Atlas, Learning Frontier (Agentic AI),
 * The Journey timeline with distinct milestones, verified certifications,
 * closing CTA, and global navigation.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initJourneyTimeline } from "../modules/ui.js";
import { initCertifications } from "../modules/certifications.js";
import { initWorkbench } from "../modules/workbench.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";
import { initSystemsAtlas } from "../modules/skills.js";
import { initCinematicHeroPortrait } from "../modules/cinematic.js";

async function initAboutPage() {
  setupGlobalErrorHandling();

  // Initialize shared navigation shell for 'about' page
  initGlobalNav("about");

  // Dismiss any boot preloader
  const boot = document.querySelector(".boot");
  if (boot) boot.style.display = "none";
  document.body.classList.remove("preloader-active");
  document.body.classList.add("hero-ready");

  // Initialize exact 8-stage cinematic hero portrait animation & HUD frame on About page
  initCinematicHeroPortrait();

  // Initialize interactive Systems Atlas
  initSystemsAtlas();

  // Initialize The Journey Timeline & collapsible credential drawers
  initJourneyTimeline();

  // Initialize Certifications filtering and modal inspection
  initCertifications();
  initCredentialsFilter();

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

function initCredentialsFilter() {
  const filterButtons = document.querySelectorAll(".cert-filter-btn");
  const credentialRows = document.querySelectorAll(".credentials-list .credential-row");
  if (!filterButtons.length || !credentialRows.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      credentialRows.forEach((row) => {
        const category = row.dataset.category;
        const shouldShow = filter === "all" || category === filter;
        row.style.display = shouldShow ? "grid" : "none";
      });

      if (
        window.scrollAnimationController &&
        typeof window.scrollAnimationController.refresh === "function"
      ) {
        window.scrollAnimationController.refresh();
      }
    });
  });
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
  document.addEventListener("DOMContentLoaded", initAboutPage);
} else {
  initAboutPage();
}
