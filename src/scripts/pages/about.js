/**
 * About Page Entry Script
 * Initializes professional introduction, engineering philosophy,
 * The Journey timeline with collapsible credentials, technical toolkit accordion,
 * verified certifications, and global navigation.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initJourneyTimeline } from "../modules/ui.js";
import { initCertifications } from "../modules/certifications.js";
import { initWorkbench } from "../modules/workbench.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";

async function initAboutPage() {
  setupGlobalErrorHandling();

  // Initialize shared navigation shell for 'about' page
  initGlobalNav("about");

  // Dismiss any boot preloader
  const boot = document.querySelector(".boot");
  if (boot) boot.style.display = "none";
  document.body.classList.remove("preloader-active");
  document.body.classList.add("hero-ready");

  // Initialize The Journey Timeline & collapsible details
  initJourneyTimeline();

  // Initialize Toolkit Accordion
  initToolkitAccordion();

  // Initialize Certifications
  initCertifications();

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

function initToolkitAccordion() {
  const toolRows = document.querySelectorAll(".tool-row");
  toolRows.forEach((row) => {
    const btn = row.querySelector("button");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isExpanded = row.classList.contains("expanded");
      toolRows.forEach((r) => {
        if (r !== row) {
          r.classList.remove("expanded");
          r.querySelector("button")?.setAttribute("aria-expanded", "false");
        }
      });
      row.classList.toggle("expanded", !isExpanded);
      btn.setAttribute("aria-expanded", String(!isExpanded));
      if (window.scrollAnimationController) {
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

