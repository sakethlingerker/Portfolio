export function showToast(message, type = "success") {
  // Create or get toast container
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element with proper structure
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Determine icon and title based on type
  const config = {
    success: { icon: 'fa-circle-check', title: 'Success!' },
    error: { icon: 'fa-circle-xmark', title: 'Error!' },
    warning: { icon: 'fa-triangle-exclamation', title: 'Warning!' },
    info: { icon: 'fa-circle-info', title: 'Info' }
  };
  
  const { icon, title } = config[type] || config.success;
  
  // Build toast HTML structure
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${icon}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
    <div class="toast-progress">
      <div class="toast-progress-bar"></div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Trigger show animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  });
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
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
