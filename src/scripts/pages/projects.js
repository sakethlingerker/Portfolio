/**
 * Projects Page Entry Script
 * Initializes the full Project Explorer, macOS Finder / System Studio split-view,
 * interactive dynamic SVG architecture diagrams with stage inspector,
 * Engineering Workbench (all 4 modes), Project Matchmaker, and lightbox preview.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initProjects, openProjectInStudio } from "../modules/projects.js";
import { initWorkbench } from "../modules/workbench.js";
import { initMatchmaker } from "../modules/matchmaker.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";

async function initProjectsPage() {
  setupGlobalErrorHandling();

  // Initialize shared navigation shell for 'projects' page
  initGlobalNav("projects");

  // Dismiss any boot preloader immediately
  const boot = document.querySelector(".boot");
  if (boot) boot.style.display = "none";
  document.body.classList.remove("preloader-active");
  document.body.classList.add("hero-ready");

  // Initialize Projects module & System Studio
  try {
    await initProjects();
  } catch (err) {
    console.error("Failed to initialize Projects module:", err);
  }

  // Initialize Engineering Workbench
  try {
    await initWorkbench();
  } catch (err) {
    console.error("Failed to initialize Workbench:", err);
  }

  // Initialize Project Matchmaker Quiz
  try {
    await initMatchmaker();
  } catch (err) {
    console.warn("Failed to initialize Matchmaker:", err);
  }

  // Check URL parameters or hash for direct project targeting (e.g. ?id=enterprise_rag or #enterprise_rag)
  handleInitialTargetProject();

  // Initialize GSAP scroll reveals
  const scrollController = initScrollReveals();
  window.scrollAnimationController = scrollController;

  // Register Service Worker
  registerServiceWorker();
}

function handleInitialTargetProject() {
  try {
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get("id") || window.location.hash.replace("#", "");
    if (targetId && typeof openProjectInStudio === "function") {
      setTimeout(() => {
        openProjectInStudio(targetId);
      }, 150);
    }
  } catch (e) {
    // URL parsing fallback
  }
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
  document.addEventListener("DOMContentLoaded", initProjectsPage);
} else {
  initProjectsPage();
}

