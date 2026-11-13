/**
 * Theme Manager
 * Ensures the editorial dark visual theme is preserved without obsolete navbar toggles.
 */
export function initTheme() {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark");
}
