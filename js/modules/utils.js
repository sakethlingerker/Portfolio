export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `form-message ${type}`;
  toast.style.cssText = `position: fixed; bottom: 20px; right: 20px; max-width: 400px; z-index: 9999; padding: 12px 20px; border-radius: 12px; font-size: 16px; font-weight: 500; box-shadow: 0 8px 20px rgba(0,0,0,0.2); transition: opacity 0.3s ease-in-out; background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: #fff;`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function setupGlobalErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // showToast("An unexpected error occurred. Please refresh.", "error"); 
    // Commented out to avoid spamming user on minor non-critical errors, 
    // but useful for debugging or strict environments.
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Rejection:', event.reason);
    // showToast("A network or data error occurred.", "error");
  });
}
