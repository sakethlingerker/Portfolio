/**
 * Home Page Entry Script
 * Initializes the editorial developer identity hero, proof metrics, featured projects preview,
 * global navigation, and GSAP scroll reveals.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initWorkbench } from "../modules/workbench.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";
import { initCinematicHeroPortrait } from "../modules/cinematic.js";
import "../preloader.js";

async function initHomePage() {
  setupGlobalErrorHandling();

  // Initialize shared navigation shell for 'home' page
  initGlobalNav("home");

  // Dismiss boot preloader smoothly
  initBootPreloader();

  // Initialize Workbench in background for Ctrl+K launcher
  try {
    await initWorkbench();
  } catch (err) {
    console.warn("Workbench initialization warning:", err);
  }

  // Initialize GSAP scroll reveal system (triggers hero sequence)
  const scrollController = initScrollReveals();
  window.scrollAnimationController = scrollController;

  // Initialize exact 8-stage cinematic hero portrait animation & HUD
  initCinematicHeroPortrait();

  // Register Service Worker
  registerServiceWorker();
}

function initBootPreloader() {
  const bootScreen = document.querySelector(".boot");
  if (!bootScreen) {
    document.body.classList.add("hero-ready");
    window.dispatchEvent(new CustomEvent("hero:ready"));
    return;
  }

  const hideBoot = () => {
    if (bootScreen.classList.contains("boot-hidden")) return;
    bootScreen.classList.add("boot-hidden");
    document.body.classList.remove("preloader-active");
    document.body.classList.add("hero-ready");
    window.dispatchEvent(new CustomEvent("hero:ready"));
    setTimeout(() => {
      bootScreen.style.display = "none";
    }, 700);
  };

  if (document.readyState === "complete") {
    setTimeout(hideBoot, 200);
  } else {
    window.addEventListener("load", () => setTimeout(hideBoot, 200));
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const base = import.meta.env?.BASE_URL || "./";
    const swPath = `${base.endsWith("/") ? base : `${base}/`}sw.js`;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(swPath).catch((err) => {
        console.warn("SW registration skipped:", err);
      });
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePage);
} else {
  initHomePage();
}

