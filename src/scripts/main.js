// Main Entry Point
// CSS is now loaded via index.html to prevent FOUC
// import '../css/main.css';
import { initTheme } from "./modules/theme.js";
import { initUI } from "./modules/ui.js";
import { initEmail } from "./modules/email.js";
import { showToast, setupGlobalErrorHandling } from "./modules/utils.js";
import { initChatbot } from "./modules/chatbot.js";
import { initTerminal } from "./modules/terminal.js";
import { initProjects } from "./modules/projects.js";
import { initMatchmaker } from "./modules/matchmaker.js";
import { initMagneticButtons } from "./modules/magnetic-buttons.js";
import { initCustomCursor } from "./modules/custom-cursor.js";
import { toast } from "./modules/toast.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize AOS
  if (window.AOS) AOS.init();

  setupGlobalErrorHandling();

  initTheme();
  initUI();
  try {
    await initEmail(); // Now async
  } catch (error) {
    console.error("EmailJS initialization failed:", error);
  }
  initChatbot();
  initTerminal();
  initProjects();
  initMatchmaker();
  initMagneticButtons();
  initCustomCursor();

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          // console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          // console.log('SW registration failed: ', registrationError);
        });
    });
  }
});
