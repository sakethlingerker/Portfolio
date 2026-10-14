/**
 * Preloader Logic
 * Handles the full-screen loading animation lifecycle.
 */

(function initPreloader() {
  const preloader = document.getElementById('preloader') || document.querySelector('.boot');
  
  if (!preloader) return;

  // 1. Lock scrolling immediately
  document.body.classList.add('preloader-active');

  // 2. Define removal function
  const removePreloader = () => {
    if (preloader.classList.contains('slide-out') || preloader.classList.contains('boot-hidden')) return;

    preloader.classList.add('slide-out');
    preloader.classList.add('boot-hidden');
    
    // Immediately unlock and signal hero readiness as preloader slides out
    document.body.classList.remove('preloader-active');
    document.body.classList.add('hero-ready');
    window.dispatchEvent(new CustomEvent('hero:ready'));

    // Wait for transition to finish (matches CSS 0.8s)
    setTimeout(() => {
      if (typeof preloader.remove === 'function') {
        preloader.remove();
      } else {
        preloader.style.display = 'none';
      }
    }, 800);
  };

  // 3. Listen for window load (all assets loaded)
  const onReady = () => {
    setTimeout(removePreloader, 400); 
  };

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady);
  }

  // Fallback: If load event doesn't fire within 6 seconds, remove anyway
  setTimeout(() => {
    if (document.body.classList.contains('preloader-active')) {
      removePreloader();
    }
  }, 6000);

})();
