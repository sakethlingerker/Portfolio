// Main Entry Point
// CSS is now loaded via index.html to prevent FOUC
// import '../css/main.css';
import { initTheme } from './modules/theme.js';
import { initUI } from './modules/ui.js';
import { initEmail } from './modules/email.js';
import { showToast, setupGlobalErrorHandling } from './modules/utils.js';
import { initChatbot } from './modules/chatbot.js';
import { initTerminal } from './modules/terminal.js';
import { initProjects } from './modules/projects.js';

document.addEventListener("DOMContentLoaded", function () {
    // Initialize AOS
    if(window.AOS) AOS.init();
    
    setupGlobalErrorHandling();

    initTheme();
    initUI();
    initEmail();
    initChatbot();
    initTerminal();
    initProjects();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    // console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    // console.log('SW registration failed: ', registrationError);
                });
        });
    }
});
