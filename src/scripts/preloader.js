/**
 * Preloader Logic
 * Handles the full-screen loading animation lifecycle.
 */

(function initPreloader() {
  const preloader = document.getElementById('preloader');
  
  if (!preloader) return;

  // 1. Lock scrolling immediately
  document.body.classList.add('preloader-active');

  // 2. Define removal function
  const removePreloader = () => {
    // Add slide-out class to trigger CSS transition
    preloader.classList.add('slide-out');

    // Wait for transition to finish (matches CSS 0.8s)
    setTimeout(() => {
      // Unlock scrolling
      document.body.classList.remove('preloader-active');
      
      // Remove from DOM to cleanup
      preloader.remove();
    }, 800);
  };

  // 3. Listen for window load (all assets loaded)
  window.addEventListener('load', () => {
    // Minimum viewing time for the cool animation (e.g., 2.5s)
    setTimeout(removePreloader, 2500); 
  });

  // Fallback: If load event doesn't fire within 8 seconds, remove anyway
  setTimeout(() => {
    if (document.body.classList.contains('preloader-active')) {
      removePreloader();
    }
  }, 8000);

})();
