import { CONFIG } from '../config.js';
import { showToast } from './utils.js';

export function initEmail() {
  // Initialize EmailJS
  if (window.emailjs) {
      emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
  } else {
      console.error("EmailJS SDK not loaded");
      return;
  }

  function checkRateLimit() {
    const lastSubmission = localStorage.getItem('last_submission_time');
    if (lastSubmission) {
      const fiveMinutes = 5 * 60 * 1000;
      const timePassed = Date.now() - parseInt(lastSubmission);
      if (timePassed < fiveMinutes) {
        return { limited: true, remaining: Math.ceil((fiveMinutes - timePassed) / 60000) };
      }
    }
    return { limited: false };
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // 1. Honeypot Spam Check
      const honeypot = this.querySelector('input[name="_honey"]');
      if (honeypot && honeypot.value) {
        // Bot detected - fake success
        // console.log("Spam detected/prevented");
        showToast("📬 Message sent! Talk soon 👋", "success");
        this.reset();
        return;
      }

      // 2. Validate Inputs
      const name = this.querySelector('input[name="name"]').value.trim();
      const email = this.querySelector('input[name="email"]').value.trim();
      const message = this.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !message) {
        showToast("⚠️ Please fill in all required fields.", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("⚠️ Previous enter a valid email address.", "error");
        return;
      }

      // 3. Rate Limit Check
      const rateLimitStatus = checkRateLimit();
      if (rateLimitStatus.limited) {
        showToast(`⏳ Please wait ${rateLimitStatus.remaining} minutes before sending another message.`, "error");
        return;
      }

      const btn = this.querySelector("button[type='submit']");
      const originalText = btn.textContent;
      btn.classList.add("loading");
      btn.textContent = "Sending...";

      const emailTimeField = document.getElementById("email-time");
      if(emailTimeField) emailTimeField.value = new Date().toLocaleString();

      emailjs.sendForm(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, this)
        .then(() => {
          this.reset();
          localStorage.setItem('last_submission_time', Date.now().toString());
          showToast("📬 Message sent! Talk soon 👋", "success");
          btn.classList.remove("loading");
          btn.textContent = "Message Sent! 🚀";
          btn.style.backgroundColor = "var(--success)";
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
          }, 3000);
        })
        .catch((error) => {
          btn.classList.remove("loading");
          btn.textContent = originalText;
          let errorMessage = !navigator.onLine ? "❌ No internet connection." : "❌ Email service error.";
          showToast(errorMessage, "error");
          console.error("EmailJS Error:", error);
        });
    });
  }
}
