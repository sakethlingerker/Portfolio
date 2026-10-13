import { CONFIG } from '../config.js';
import { toast } from './toast.js';

// Safe in-memory storage fallback that never throws SecurityError
const memoryStore = new Map();

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return memoryStore.get(key) || null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    memoryStore.set(key, String(value));
  }
}

export async function initEmail() {
  const contactForm = document.getElementById("contact-form") || document.querySelector("form.contact-terminal-form");
  if (!contactForm) {
    console.warn("Contact form not found in DOM.");
    return;
  }

  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');
  const messageInput = contactForm.querySelector('textarea[name="message"]');
  const submitBtn = contactForm.querySelector('#contact-submit-btn') || contactForm.querySelector("button[type='submit']");
  const btnLabel = submitBtn ? submitBtn.querySelector('.btn-label-text') : null;

  const nameFeedback = document.getElementById('name-feedback');
  const emailFeedback = document.getElementById('email-feedback');
  const messageFeedback = document.getElementById('message-feedback');

  const nameContainer = document.getElementById('name-container');
  const emailContainer = document.getElementById('email-container');
  const messageContainer = document.getElementById('message-container');

  // Clear validation error on field input
  [
    { input: nameInput, feedback: nameFeedback, container: nameContainer },
    { input: emailInput, feedback: emailFeedback, container: emailContainer },
    { input: messageInput, feedback: messageFeedback, container: messageContainer }
  ].forEach(({ input, feedback, container }) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (feedback) feedback.textContent = '';
      if (container) container.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    });
  });

  // Dynamically load EmailJS with custom in-memory storage provider to prevent SecurityError
  let emailjs = null;
  const hasEmailJsConfig = Boolean(CONFIG.EMAILJS_PUBLIC_KEY && CONFIG.EMAILJS_SERVICE_ID && CONFIG.EMAILJS_TEMPLATE_ID);

  if (hasEmailJsConfig) {
    try {
      const module = await import('@emailjs/browser');
      emailjs = module.default;
      
      const customStorageProvider = {
        get: (key) => Promise.resolve(safeGetStorage(key)),
        set: (key, value) => { safeSetStorage(key, value); return Promise.resolve(); },
        remove: (key) => { memoryStore.delete(key); return Promise.resolve(); }
      };

      emailjs.init({
        publicKey: CONFIG.EMAILJS_PUBLIC_KEY,
        storageProvider: customStorageProvider
      });
      console.log("EmailJS initialized with safe storage provider");
    } catch (error) {
      console.warn("EmailJS SDK initialization notice (using direct API fallback):", error);
    }
  }

  function checkRateLimit() {
    try {
      const lastSubmission = safeGetStorage('last_submission_time');
      if (lastSubmission) {
        const fiveMinutes = 5 * 60 * 1000;
        const timePassed = Date.now() - parseInt(lastSubmission, 10);
        if (timePassed < fiveMinutes) {
          return { limited: true, remaining: Math.ceil((fiveMinutes - timePassed) / 60000) };
        }
      }
    } catch (error) {
      // Safe fallback
    }
    return { limited: false };
  }

  function openMailtoFallback(name, email, message) {
    const recipient = 'saketh1805@gmail.com';
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hello Saketh,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}\nSent via Portfolio Contact Form`
    );
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Honeypot Spam Check
    const honeypot = this.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value) {
      toast.success("Message Sent!", "I'll get back to you soon 👋");
      this.reset();
      return;
    }

    // 2. Validate Inputs
    let hasError = false;
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      hasError = true;
      if (nameFeedback) nameFeedback.textContent = 'Please enter your full name.';
      if (nameContainer) nameContainer.classList.add('has-error');
      if (nameInput) {
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.focus();
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      hasError = true;
      if (emailFeedback) emailFeedback.textContent = 'Please enter your email address.';
      if (emailContainer) emailContainer.classList.add('has-error');
      if (emailInput) {
        emailInput.setAttribute('aria-invalid', 'true');
        if (!name && nameInput) nameInput.focus(); else emailInput.focus();
      }
    } else if (!emailRegex.test(email)) {
      hasError = true;
      if (emailFeedback) emailFeedback.textContent = 'Please enter a valid email address.';
      if (emailContainer) emailContainer.classList.add('has-error');
      if (emailInput) {
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
      }
    }

    if (!message) {
      hasError = true;
      if (messageFeedback) messageFeedback.textContent = 'Please enter your message.';
      if (messageContainer) messageContainer.classList.add('has-error');
      if (messageInput) {
        messageInput.setAttribute('aria-invalid', 'true');
        if (!name && !email && nameInput) nameInput.focus();
        else if (!email && emailInput) emailInput.focus();
        else messageInput.focus();
      }
    }

    if (hasError) {
      toast.error("Required Fields Missing", "Please fill in all required fields.");
      return;
    }

    // 3. Rate Limit Check
    const rateLimitStatus = checkRateLimit();
    if (rateLimitStatus.limited) {
      toast.warning("Rate Limit", `Please wait ${rateLimitStatus.remaining} minute(s) before sending another message.`);
      return;
    }

    // 4. Loading State
    if (submitBtn) {
      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;
    }
    const defaultLabelText = btnLabel ? btnLabel.textContent : "Send Message";
    if (btnLabel) btnLabel.textContent = "Sending...";

    const templateParams = {
      name: name,
      from_name: name,
      user_name: name,
      email: email,
      from_email: email,
      user_email: email,
      reply_to: email,
      message: message,
      to_name: 'Saketh Lingerker',
      time: new Date().toLocaleString()
    };

    let sendSuccess = false;
    let errorMessage = '';

    // 5. Attempt Send via EmailJS (SDK or Direct API)
    if (hasEmailJsConfig) {
      try {
        if (emailjs && typeof emailjs.send === 'function') {
          const res = await emailjs.send(
            CONFIG.EMAILJS_SERVICE_ID,
            CONFIG.EMAILJS_TEMPLATE_ID,
            templateParams,
            CONFIG.EMAILJS_PUBLIC_KEY
          );
          if (res && (res.status === 200 || res.text === 'OK')) {
            sendSuccess = true;
          }
        } else {
          // Direct HTTP fallback if SDK unavailable
          const apiRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: CONFIG.EMAILJS_SERVICE_ID,
              template_id: CONFIG.EMAILJS_TEMPLATE_ID,
              user_id: CONFIG.EMAILJS_PUBLIC_KEY,
              template_params: templateParams
            })
          });
          if (apiRes.ok) {
            sendSuccess = true;
          } else {
            const errText = await apiRes.text();
            errorMessage = errText || `HTTP ${apiRes.status}`;
          }
        }
      } catch (err) {
        console.error("EmailJS dispatch error:", err);
        errorMessage = err?.text || err?.message || String(err);
      }
    }

    // 6. Handle Outcome
    if (sendSuccess) {
      contactForm.reset();
      safeSetStorage('last_submission_time', Date.now().toString());

      toast.success("Message Sent!", "Thank you for reaching out! I'll get back to you soon 👋");

      if (submitBtn) submitBtn.classList.remove("is-loading");
      if (btnLabel) btnLabel.textContent = "Message Sent! 🚀";

      setTimeout(() => {
        if (btnLabel) btnLabel.textContent = defaultLabelText;
        if (submitBtn) submitBtn.disabled = false;
      }, 3500);
    } else {
      if (submitBtn) {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
      }
      if (btnLabel) btnLabel.textContent = defaultLabelText;

      // Provide clear feedback if EmailJS Gmail service needs re-authorizing
      const isGmailTokenIssue = errorMessage.includes("Invalid grant") || errorMessage.includes("reconnect your Gmail");
      if (isGmailTokenIssue) {
        toast.warning(
          "Email Gateway Notice",
          "EmailJS Gmail service requires re-authorizing. Opening prefilled email client..."
        );
      } else {
        toast.info(
          "Transmission Fallback",
          "Opening prefilled email client to send directly to saketh1805@gmail.com..."
        );
      }

      setTimeout(() => {
        openMailtoFallback(name, email, message);
      }, 700);
    }
  });
}
