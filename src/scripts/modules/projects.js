/**
 * Projects Module
 * Handles project filtering and interactions.
 */

export function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // 2. Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // 3. Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Optional: Add animation class here if needed
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });
      
      // Re-trigger AOS layout refresh if available
      if (window.AOS) {
        setTimeout(() => window.AOS.refresh(), 100);
      }
    });
  });
}
