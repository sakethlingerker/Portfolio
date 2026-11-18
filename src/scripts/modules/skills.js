/**
 * Skills & Systems Atlas Module
 * Synchronizes Home (Technical Focus) and About (Systems Atlas) sections
 * using the shared skills data model and powers the accessible accordion and interactive Systems Atlas.
 */

import { skillsData } from "../data/skills.ts";

export { skillsData };

/**
 * Generates semantic HTML markup for the skills toolkit rows (Home page)
 * @param {string} prefix - Unique prefix for accessible IDs ('home' or 'about')
 * @param {number} defaultExpandedIndex - Index of the initially expanded row (default: 0)
 * @returns {string} HTML string of tool rows
 */
export function renderSkillsMarkup(prefix = "tool", defaultExpandedIndex = 0) {
  return skillsData
    .map((category, index) => {
      const isExpanded = index === defaultExpandedIndex;
      const btnId = `toolkit-btn-${prefix}-${category.id}`;
      const panelId = `toolkit-panel-${prefix}-${category.id}`;

      const techChips = category.technologies
        .map(
          (tech) =>
            `<span><i class="${tech.icon}" aria-hidden="true"></i> ${tech.name}</span>`
        )
        .join("");

      return `
        <div class="tool-row ${isExpanded ? "expanded" : ""}" data-category-id="${category.id}">
          <button type="button"
                  id="${btnId}"
                  aria-expanded="${isExpanded ? "true" : "false"}"
                  aria-controls="${panelId}">
            <span>${category.name} <span class="tool-count">${category.count}</span></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <div id="${panelId}" class="tool-content" role="region" aria-labelledby="${btnId}">
            <div>
              <p>${category.description}</p>
              <div class="tools-grid">
                ${techChips}
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Binds accessible accordion interactions to all rows in a tool list
 * @param {HTMLElement} container - The .tool-list container
 */
export function bindToolkitAccordion(container) {
  if (!container) return;

  const toolRows = container.querySelectorAll(".tool-row");
  if (!toolRows.length) return;

  toolRows.forEach((row) => {
    const btn = row.querySelector("button");
    if (!btn) return;

    if (btn.dataset.accordionBound === "true") return;
    btn.dataset.accordionBound = "true";

    const toggleRow = () => {
      const isCurrentlyExpanded = row.classList.contains("expanded");
      const willExpand = !isCurrentlyExpanded;

      toolRows.forEach((r) => {
        if (r !== row) {
          r.classList.remove("expanded");
          const rBtn = r.querySelector("button");
          if (rBtn) rBtn.setAttribute("aria-expanded", "false");
        }
      });

      row.classList.toggle("expanded", willExpand);
      btn.setAttribute("aria-expanded", String(willExpand));

      if (
        window.scrollAnimationController &&
        typeof window.scrollAnimationController.refresh === "function"
      ) {
        window.scrollAnimationController.refresh();
      }
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleRow();
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRow();
      }
    });
  });
}

/**
 * Initializes the Skills Toolkit: renders from shared data and binds accordion
 * @param {string} containerSelector - CSS selector for target .tool-list elements
 */
export function initSkillsToolkit(
  containerSelector = ".toolkit .tool-list"
) {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers.length) return;

  containers.forEach((container) => {
    const isHome = Boolean(container.closest(".toolkit"));
    const prefix = isHome ? "home" : "tool";

    container.innerHTML = renderSkillsMarkup(prefix, 0);
    bindToolkitAccordion(container);
  });
}

/**
 * Initializes the interactive Systems Atlas component on the About page
 * Coordinates domain selection, topology node highlights, and cross-domain jumps.
 * @param {string} containerSelector - CSS selector for .systems-atlas container
 */
export function initSystemsAtlas(containerSelector = ".systems-atlas") {
  const atlas = document.querySelector(containerSelector);
  if (!atlas) return;

  const tabs = atlas.querySelectorAll(".atlas-tab-btn");
  const panels = atlas.querySelectorAll(".atlas-domain-panel");
  const jumpButtons = atlas.querySelectorAll(".atlas-jump-btn");
  const mobileButtons = atlas.querySelectorAll(".atlas-mobile-accordion-btn");

  function selectDomain(domainId) {
    // 1. Update Desktop Tabs
    tabs.forEach((tab) => {
      const isSelected = tab.dataset.domainId === domainId;
      tab.classList.toggle("active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    // 2. Update Desktop Panels
    panels.forEach((panel) => {
      const isMatch = panel.dataset.domainId === domainId;
      panel.classList.toggle("active", isMatch);
      panel.hidden = !isMatch;
      panel.style.display = isMatch ? "grid" : "none";
    });

    // 3. Update Mobile Accordion Panels
    mobileButtons.forEach((btn) => {
      const isMatch = btn.dataset.domainId === domainId;
      btn.setAttribute("aria-expanded", String(isMatch));
      const targetPanel = atlas.querySelector(`#atlas-mobile-panel-${btn.dataset.domainId}`);
      if (targetPanel) {
        targetPanel.hidden = !isMatch;
        targetPanel.style.display = isMatch ? "block" : "none";
      }
    });

    // Refresh ScrollTrigger
    if (
      window.scrollAnimationController &&
      typeof window.scrollAnimationController.refresh === "function"
    ) {
      window.scrollAnimationController.refresh();
    }
  }

  // Bind desktop tab events
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectDomain(tab.dataset.domainId);
    });

    tab.addEventListener("keydown", (e) => {
      let nextIndex = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      }
      if (nextIndex !== null) {
        e.preventDefault();
        tabs[nextIndex].focus();
        selectDomain(tabs[nextIndex].dataset.domainId);
      }
    });
  });

  // Bind cross-domain topology jump buttons
  jumpButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.dataset.targetDomain;
      if (targetId) {
        selectDomain(targetId);
        const targetTab = atlas.querySelector(`.atlas-tab-btn[data-domain-id="${targetId}"]`);
        if (targetTab) {
          targetTab.focus();
        }
      }
    });
  });

  // Bind mobile accordion toggles
  mobileButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const domainId = btn.dataset.domainId;
      const isCurrentlyExpanded = btn.getAttribute("aria-expanded") === "true";
      if (isCurrentlyExpanded) {
        btn.setAttribute("aria-expanded", "false");
        const targetPanel = atlas.querySelector(`#atlas-mobile-panel-${domainId}`);
        if (targetPanel) {
          targetPanel.hidden = true;
          targetPanel.style.display = "none";
        }
      } else {
        selectDomain(domainId);
      }
    });
  });

  // Initialize with Domain 01 active
  const initialTab = tabs[0];
  if (initialTab && initialTab.dataset.domainId) {
    selectDomain(initialTab.dataset.domainId);
  }
}
