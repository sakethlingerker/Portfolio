/**
 * Research Page Entry Script
 * Handles global navigation, Engineering Workbench (Ctrl+K),
 * and empirical research benchmarks (Tabs & interactive controls)
 * conducted at Speech Lab (LTRC), IIIT Hyderabad.
 */

import { initGlobalNav } from "../modules/nav.js";
import { initWorkbench } from "../modules/workbench.js";
import { initScrollReveals } from "../animations/scroll-reveal.ts";
import { setupGlobalErrorHandling } from "../modules/utils.js";

/**
 * Tab switcher function matching reference implementation.
 * Exposes switchTab to window for inline onclick handlers,
 * while also attaching direct event listeners for keyboard/touch accessibility.
 */
export function switchTab(event, tabId) {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  panels.forEach(panel => {
    panel.classList.remove('active');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
    event.currentTarget.setAttribute('aria-selected', 'true');
  } else {
    const btn = Array.from(buttons).find(b => b.getAttribute('onclick')?.includes(tabId));
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    }
  }

  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active');
    // Ensure all elements inside activated tab are 100% visible
    const innerElements = target.querySelectorAll('[data-reveal], [data-reveal-group] > *, .table-wrap, .callout, .signal-demo');
    innerElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
    if (window.scrollAnimationController && window.scrollAnimationController.refresh) {
      window.scrollAnimationController.refresh();
    }
  }
}

// Expose globally on window so inline onclick="switchTab(event, 'exp1')" works without error
if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
}

function initExperimentTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.setAttribute('role', 'tab');
    if (btn.classList.contains('active')) {
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.setAttribute('aria-selected', 'false');
    }

    // Keyboard support: Enter or Space triggers tab switch
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

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

  // Initialize Experiment Tabs keyboard handlers
  initExperimentTabs();

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
