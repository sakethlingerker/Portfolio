import { CONFIG } from '../config.js';
import { toast } from './toast.js';

// Mock localStorage if it's blocked (for browser environments with restricted access)
function ensureLocalStorage() {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    console.warn("localStorage is blocked, using in-memory fallback");
    // Create a simple in-memory storage mock
    if (!window.localStorage) {
      const mockStorage = {
        _data: {},
        setItem: function(id, val) { this._data[id] = String(val); },
        getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : null; },
        removeItem: function(id) { delete this._data[id]; },
        clear: function() { this._data = {}; }
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true
      });
    }
    return false;
  }
}

export async function initEmail() {
  // Ensure localStorage is available (or mocked)
  ensureLocalStorage();

  // Dynamically import EmailJS to catch SecurityErrors at import time
  let emailjs;
  try {
    const module = await import('@emailjs/browser');
    emailjs = module.default;
    console.log("EmailJS loaded successfully");
  } catch (error) {
    console.error("Failed to load EmailJS (localStorage may be blocked):", error);
    // Show a fallback message to user
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        toast.error("Contact Form Unavailable", "Please email me directly at saketh1805@gmail.com");
      });
    }
    return; // Exit early if EmailJS can't be loaded
  }

  // Initialize EmailJS with the public key
  try {
    if (!CONFIG.EMAILJS_PUBLIC_KEY) {
      console.error("EmailJS Error: Missing Public Key. Check GitHub Secrets.");
      return;
    }
    
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("EmailJS initialization error:", error);
  }

  function checkRateLimit() {
    try {
      const lastSubmission = localStorage.getItem('last_submission_time');
      if (lastSubmission) {
        const fiveMinutes = 5 * 60 * 1000;
        const timePassed = Date.now() - parseInt(lastSubmission);
        if (timePassed < fiveMinutes) {
          return { limited: true, remaining: Math.ceil((fiveMinutes - timePassed) / 60000) };
        }
      }
    } catch (error) {
      console.warn("localStorage access denied, skipping rate limit check");
    }
    return { limited: false };
  }

  // Try multiple methods to find the form
  let contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    contactForm = document.querySelector("form.contact-form-modern");
  }
  
  console.log("Contact form found:", contactForm);
  
  if (contactForm) {
    console.log("Attaching submit listener to contact form");
    contactForm.addEventListener("submit", function (e) {
      console.log("Form submit event triggered!");
      e.preventDefault();
      
      // 1. Honeypot Spam Check
      const honeypot = this.querySelector('input[name="_honey"]');
      if (honeypot && honeypot.value) {
        // Bot detected - fake success
        toast.success("Message Sent!", "I'll get back to you soon 👋");
        this.reset();
        return;
      }

      // 2. Validate Inputs
      const name = this.querySelector('input[name="name"]').value.trim();
      const email = this.querySelector('input[name="email"]').value.trim();
      const message = this.querySelector('textarea[name="message"]').value.trim();

      if (!name || !email || !message) {
        toast.error("Missing Information", "Please fill in all required fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid Email", "Please enter a valid email address.");
        return;
      }

      // 3. Rate Limit Check
      const rateLimitStatus = checkRateLimit();
      if (rateLimitStatus.limited) {
        toast.warning("Slow Down!", `Please wait ${rateLimitStatus.remaining} minutes before sending another message.`);
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
          try {
            localStorage.setItem('last_submission_time', Date.now().toString());
          } catch (error) {
            console.warn("Could not save submission time to localStorage");
          }
          toast.success("Message Sent!", "Thanks for reaching out! I'll get back to you soon 👋");
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
          let errorTitle = !navigator.onLine ? "No Internet Connection" : "Service Error";
          let errorMsg = !navigator.onLine ? "Please check your connection and try again." : "Something went wrong. Please try again later.";
          toast.error(errorTitle, errorMsg);
          console.error("EmailJS Error:", error);
        });
    });
  } else {
    console.error("Contact form not found!");
  }
}

