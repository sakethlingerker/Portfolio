/**
 * Contact Page Entry Script
 * Initializes EmailJS contact form, direct contact channels,
 * technical coordinates world map graphic, and global navigation.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initEmail } from "../modules/email.js";
import { initWorkbench } from "../modules/workbench.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";

async function initContactPage() {
  setupGlobalErrorHandling();

  // Initialize shared navigation shell for 'contact' page
  initGlobalNav("contact");

  // Dismiss any boot preloader
  const boot = document.querySelector(".boot");
  if (boot) boot.style.display = "none";
  document.body.classList.remove("preloader-active");
  document.body.classList.add("hero-ready");

  // Initialize EmailJS contact form
  try {
    await initEmail();
  } catch (err) {
    console.error("EmailJS initialization error:", err);
  }

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
  document.addEventListener("DOMContentLoaded", initContactPage);
} else {
  initContactPage();
}

