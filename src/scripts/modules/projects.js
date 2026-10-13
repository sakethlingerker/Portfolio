/**
 * Projects Module - Refined macOS Finder Split-View Interface
 * Single source of truth: Consumes public/data/projects.json via projects-data.js.
 */

import { loadProjectsData, getProjectsList, getProjectById } from './projects-data.js';

let projectsMap = {};
let activeProjectId = 'enterprise_rag';
let activeCategory = 'all';
let searchQuery = '';

export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env?.BASE_URL || './';
  const cleanPath = path.startsWith('./') ? path.slice(2) : (path.startsWith('/') ? path.slice(1) : path);
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${cleanPath}`;
}

export async function initProjects() {
  const finderWindow = document.querySelector('.finder-window');
  if (!finderWindow) return;

  try {
    projectsMap = await loadProjectsData();
    if (!projectsMap || Object.keys(projectsMap).length === 0) return;
  } catch (err) {
    console.error('Failed to initialize projects module:', err);
    return;
  }

  // Update Dynamic Counts
  updateCategoryCounts();

  // Bind Event Listeners
  setupCategoryFilters();
  setupSearchInput();
  setupMobileToggle();
  setupImageLightbox();
  setupStudioToggle();

  // Initial Render
  renderSidebarList();
  renderProjectDetail(activeProjectId);
}

function updateCategoryCounts() {
  const list = Object.values(projectsMap);
  const countAll = document.querySelector('#count-all');
  const countFeatured = document.querySelector('#count-featured');
  const countAiMl = document.querySelector('#count-ai-ml');
  const countFullstack = document.querySelector('#count-fullstack');
  const countMlops = document.querySelector('#count-mlops');
  const countDataScience = document.querySelector('#count-datascience');

  if (countAll) countAll.textContent = list.length;
  if (countFeatured) countFeatured.textContent = list.filter((p) => p.isFeatured === true).length;
  if (countAiMl) countAiMl.textContent = list.filter((p) => p.category === 'ai-ml').length;
  if (countFullstack) countFullstack.textContent = list.filter((p) => p.category === 'fullstack').length;
  if (countMlops) countMlops.textContent = list.filter((p) => p.category === 'mlops').length;
  if (countDataScience) countDataScience.textContent = list.filter((p) => p.category === 'datascience').length;
}

function setupCategoryFilters() {
  const catButtons = document.querySelectorAll('.finder-cat-btn');
  catButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      catButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderSidebarList();
    });
  });
}

function setupSearchInput() {
  const searchInput = document.querySelector('#finder-project-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target.value || '').toLowerCase().trim();
    renderSidebarList();
  });
}

function setupMobileToggle() {
  const toggleBtn = document.querySelector('#finder-mobile-toggle');
  const sidebar = document.querySelector('#finder-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    const isOpen = sidebar.classList.contains('mobile-open');
    toggleBtn.innerHTML = isOpen
      ? `<i class="fas fa-times"></i> <span>Close</span>`
      : `<i class="fas fa-list"></i> <span>Projects</span>`;
  });
}

function setupImageLightbox() {
  const lightbox = document.querySelector('#finder-lightbox');
  const backdrop = document.querySelector('#finder-lightbox-backdrop');
  const closeBtn = document.querySelector('#finder-lightbox-close');

  if (!lightbox) return;

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('finder-lightbox-open');
  };

  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('finder-lightbox-container')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openImageLightbox(imgSrc, title) {
  const lightbox = document.querySelector('#finder-lightbox');
  const lightboxImg = document.querySelector('#finder-lightbox-img');
  const caption = document.querySelector('#finder-lightbox-caption');

  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = imgSrc;
  lightboxImg.alt = title;
  if (caption) {
    caption.textContent = `${title} — Click outside or Esc to close`;
  }

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('finder-lightbox-open');
}

function setupStudioToggle() {
  const toggleBtn = document.querySelector('#toggle-finder-studio');
  const studioSection = document.querySelector('#projects');
  const closeDot = document.querySelector('#close-finder-dot');

  if (toggleBtn && studioSection) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = studioSection.classList.contains('studio-collapsed');
      if (isCollapsed) {
        studioSection.classList.remove('studio-collapsed');
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Close System Studio';
        toggleBtn.setAttribute('aria-expanded', 'true');
        studioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        studioSection.classList.add('studio-collapsed');
        toggleBtn.innerHTML = '<i class="fas fa-folder-open"></i> Launch System Studio';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (closeDot && studioSection) {
    closeDot.addEventListener('click', (e) => {
      e.preventDefault();
      studioSection.classList.add('studio-collapsed');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fas fa-folder-open"></i> Launch System Studio';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Keyboard shortcut: Escape closes studio when open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && studioSection && !studioSection.classList.contains('studio-collapsed')) {
      const lightbox = document.getElementById('finder-lightbox');
      const workbenchModal = document.getElementById('workbench-modal');
      const isWorkbenchOpen = workbenchModal && workbenchModal.classList.contains('active');
      const isLightboxOpen = lightbox && lightbox.classList.contains('active');
      if (!isLightboxOpen && !isWorkbenchOpen) {
        studioSection.classList.add('studio-collapsed');
        if (toggleBtn) {
          toggleBtn.innerHTML = '<i class="fas fa-folder-open"></i> Launch System Studio';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });
}

export function openProjectInStudio(projectId) {
  if (!projectId) return;

  const studioSection = document.querySelector('#projects');
  const toggleBtn = document.querySelector('#toggle-finder-studio');

  // 1. Reveal System Studio section if collapsed
  if (studioSection && studioSection.classList.contains('studio-collapsed')) {
    studioSection.classList.remove('studio-collapsed');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-times"></i> Close System Studio';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  // 2. Reset filters so the target project is guaranteed to be in the list
  activeCategory = 'all';
  searchQuery = '';
  const searchInput = document.querySelector('#finder-project-search');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.finder-cat-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
  });
  renderSidebarList();

  // 3. Select project and render details
  if (projectsMap[projectId]) {
    selectProject(projectId);
  } else {
    console.warn(`Projects: Unknown project ID "${projectId}"`);
  }

  // 4. Scroll smoothly to the studio section
  if (studioSection) {
    studioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 5. If mobile drawer is open, close it
  const sidebar = document.querySelector('#finder-sidebar');
  if (sidebar && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
    const mobileToggle = document.querySelector('#finder-mobile-toggle');
    if (mobileToggle) {
      mobileToggle.innerHTML = `<i class="fas fa-list"></i> <span>Projects</span>`;
    }
  }
}

// Global reference for seamless interop
if (typeof window !== 'undefined') {
  window.openProjectInStudio = openProjectInStudio;
}

function getFilteredProjects() {
  const allProjects = Object.values(projectsMap);
  return allProjects.filter((p) => {
    let matchCat = true;
    if (activeCategory === 'featured') {
      matchCat = p.isFeatured === true;
    } else if (activeCategory !== 'all') {
      matchCat = p.category === activeCategory;
    }

    let matchSearch = true;
    if (searchQuery) {
      const haystack = `${p.title} ${p.subtitle || ''} ${p.overview || ''} ${p.category || ''} ${(p.tags || []).join(' ')} ${(p.techStackDetailed || []).map((t) => t.name).join(' ')}`.toLowerCase();
      matchSearch = haystack.includes(searchQuery);
    }

    return matchCat && matchSearch;
  });
}

function renderSidebarList() {
  const listContainer = document.querySelector('#finder-project-list');
  if (!listContainer) return;

  const filtered = getFilteredProjects();

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="finder-empty-state">
        <i class="fas fa-folder-open" style="margin-bottom: 6px; font-size: 1.1rem; opacity: 0.5;"></i>
        <p>No projects match criteria</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered
    .map((p) => {
      const isActive = p.id === activeProjectId ? 'active' : '';
      const thumb = getAssetUrl(p.heroImage || 'assets/projects/enterprise_rag_agent.png');

      return `
        <div class="finder-nav-item ${isActive}" data-id="${p.id}" tabindex="0" role="button" aria-label="Select ${p.title}">
          <div class="finder-item-thumb-wrapper">
            <img src="${thumb}" alt="${p.title}" class="finder-item-thumb" />
          </div>
          <div class="finder-item-info">
            <div class="finder-item-title">${p.title}</div>
            <div class="finder-item-subtitle">${p.subtitle || p.category}</div>
          </div>
          <div class="finder-active-indicator"></div>
        </div>
      `;
    })
    .join('');

  // Bind click & keyboard handlers to sidebar items
  listContainer.querySelectorAll('.finder-nav-item').forEach((item) => {
    const handleSelect = () => {
      const id = item.getAttribute('data-id');
      if (id && id !== activeProjectId) {
        selectProject(id);
      }

      // Close mobile drawer on selection if open
      const sidebar = document.querySelector('#finder-sidebar');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        const toggleBtn = document.querySelector('#finder-mobile-toggle');
        if (toggleBtn) {
          toggleBtn.innerHTML = `<i class="fas fa-list"></i> <span>Projects</span>`;
        }
      }
    };

    item.addEventListener('click', handleSelect);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });
}

function selectProject(id) {
  if (!projectsMap[id]) return;
  activeProjectId = id;

  // Immediate update for sidebar active state
  document.querySelectorAll('.finder-nav-item').forEach((item) => {
    if (item.getAttribute('data-id') === id) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Smooth 200ms transition and scroll position reset for workspace panel
  const workspaceContainer = document.querySelector('#finder-detail-container');
  const workspaceScrollParent = document.querySelector('#finder-workspace');

  if (workspaceContainer) {
    workspaceContainer.classList.add('finder-fade-out');
    setTimeout(() => {
      renderProjectDetail(id);
      workspaceContainer.classList.remove('finder-fade-out');
      if (workspaceScrollParent) {
        workspaceScrollParent.scrollTop = 0;
      }
    }, 200);
  } else {
    renderProjectDetail(id);
    if (workspaceScrollParent) {
      workspaceScrollParent.scrollTop = 0;
    }
  }
}

/**
 * Dynamic "System Flow" (System Architecture / How It Works) Reusable Component
 * Adapts dynamically to project category & actual architecture steps in projects.json
 */
function renderSystemFlowSection(steps, projectCategory = 'ai-ml') {
  if (!steps || steps.length === 0) return '';

  const normalizeStageStep = (stepStr, idx, total) => {
    const text = stepStr.toLowerCase();
    let category = 'PROCESSING';

    // Intelligently classify Stage Category based on project category and step keywords
    if (
      idx === 0 ||
      text.includes('upload') ||
      text.includes('ingestion') ||
      text.includes('input') ||
      text.includes('dataset') ||
      text.includes('raw') ||
      text.includes('client') ||
      text.includes('source') ||
      text.includes('search') ||
      text.includes('user')
    ) {
      if (projectCategory === 'fullstack') category = 'FRONTEND';
      else if (projectCategory === 'mlops') category = 'DATA SOURCE';
      else category = 'INPUT';
    } else if (
      idx === total - 1 ||
      text.includes('output') ||
      text.includes('citation') ||
      text.includes('dashboard') ||
      text.includes('ui') ||
      text.includes('prediction') ||
      text.includes('result') ||
      text.includes('delivery') ||
      text.includes('monitoring') ||
      text.includes('pages') ||
      text.includes('report')
    ) {
      if (projectCategory === 'fullstack') category = 'RESPONSE';
      else if (projectCategory === 'mlops') category = 'MONITORING';
      else if (projectCategory === 'datascience') category = 'PREDICTION';
      else category = 'OUTPUT';
    } else if (text.includes('vector') || text.includes('faiss') || text.includes('chroma') || text.includes('retriev')) {
      category = 'RETRIEVAL';
    } else if (text.includes('mongo') || text.includes('sql') || text.includes('database')) {
      category = 'DATABASE';
    } else if (text.includes('registry')) {
      category = 'MODEL REGISTRY';
    } else if (text.includes('model') || text.includes('llm') || text.includes('neural') || text.includes('pytorch') || text.includes('groq') || text.includes('gemini') || text.includes('classifi') || text.includes('ensemble') || text.includes('svm') || text.includes('stable diffusion') || text.includes('keras')) {
      category = 'INTELLIGENCE';
    } else if (text.includes('evaluat') || text.includes('validat') || text.includes('benchmark')) {
      category = 'EVALUATION';
    } else if (text.includes('api') || text.includes('flask') || text.includes('backend') || text.includes('express')) {
      category = 'BACKEND API';
    } else if (text.includes('deploy') || text.includes('docker') || text.includes('ecr') || text.includes('ec2') || text.includes('cicd') || text.includes('action')) {
      category = 'DEPLOYMENT';
    } else if (text.includes('chunk') || text.includes('parse') || text.includes('preprocess') || text.includes('normaliz') || text.includes('clean') || text.includes('feature') || text.includes('extract') || text.includes('token')) {
      if (text.includes('feature')) category = 'FEATURE ENG';
      else category = 'PROCESSING';
    }

    // Format Step Title & One Short Explanation
    let title = stepStr;
    let desc = '';

    if (stepStr.includes('&')) {
      const parts = stepStr.split('&');
      title = parts[0].trim();
      desc = parts.slice(1).join('&').trim();
    } else if (stepStr.includes('-')) {
      const parts = stepStr.split('-');
      title = parts[0].trim();
      desc = parts.slice(1).join('-').trim();
    } else if (stepStr.includes('(')) {
      const parts = stepStr.split('(');
      title = parts[0].trim();
      desc = parts[1].replace(')', '').trim();
    } else if (stepStr.includes(':')) {
      const parts = stepStr.split(':');
      title = parts[0].trim();
      desc = parts.slice(1).join(':').trim();
    }

    return {
      stepNumber: String(idx + 1).padStart(2, '0'),
      category,
      title,
      desc
    };
  };

  const stagesHtml = steps
    .map((stepStr, idx) => {
      const { stepNumber, category, title, desc } = normalizeStageStep(stepStr, idx, steps.length);
      const isLast = idx === steps.length - 1;

      return `
        <div class="finder-sys-stage" data-step="${stepNumber}">
          <div class="finder-sys-stage-box">
            <div class="finder-sys-stage-meta">
              <span class="finder-sys-num">[${stepNumber}]</span>
              <span class="finder-sys-cat">${category}</span>
            </div>
            <h4 class="finder-sys-title">${title}</h4>
            ${desc ? `<p class="finder-sys-desc">${desc}</p>` : ''}
          </div>
          ${
            !isLast
              ? `
            <div class="finder-sys-connector" aria-hidden="true">
              <i class="fas fa-arrow-right sys-conn-arrow"></i>
            </div>
          `
              : ''
          }
        </div>
      `;
    })
    .join('');

  return `
    <div class="finder-card span-full finder-system-architecture-card">
      <div class="finder-system-flow-header">
        <span class="finder-sys-eyebrow">SYSTEM ARCHITECTURE</span>
        <h3 class="finder-card-header"><i class="fas fa-sitemap"></i> How It Works</h3>
      </div>
      <div class="finder-system-flow-container">
        <div class="finder-system-flow-track">
          ${stagesHtml}
        </div>
      </div>
    </div>
  `;
}

function renderProjectDetail(id) {
  const p = projectsMap[id] || getProjectsList()[0];
  if (!p) return;

  // Update Breadcrumb
  const breadcrumb = document.querySelector('#finder-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `<span class="finder-bc-prefix">Projects / </span><span class="finder-bc-name">${p.title}</span>`;
  }

  const workspaceContainer = document.querySelector('#finder-detail-container');
  if (!workspaceContainer) return;

  const heroImg = getAssetUrl(p.heroImage || 'assets/projects/enterprise_rag_agent.png');

  // Tech stack shield badges
  const techBadgesHtml = p.techStackDetailed
    ? p.techStackDetailed
        .map(
          (t) => `
      <span class="finder-tech-badge" title="${t.name}">
        <img src="${t.badge}" alt="${t.name}" loading="lazy" />
      </span>
    `
        )
        .join('')
    : (p.tags || []).map((t) => `<span class="finder-tag-pill">${t}</span>`).join('');

  // Key features
  const featuresHtml = p.keyFeatures
    ? p.keyFeatures
        .map(
          (f) => `
      <li><i class="fas fa-check-circle"></i> <span>${f}</span></li>
    `
        )
        .join('')
    : '';

  // System Flow / How It Works Section
  const howItWorksHtml = renderSystemFlowSection(p.architecture, p.category);

  // Quantified Impact metrics
  const impactHtml = p.quantifiableImpact
    ? p.quantifiableImpact
        .map(
          (imp) => `
      <div class="finder-impact-card">
        <div class="finder-impact-val">${imp.value}</div>
        <div class="finder-impact-lbl">${imp.label}</div>
      </div>
    `
        )
        .join('')
    : '';

  // Related projects cards
  const relatedHtml = p.relatedProjectIds
    ? p.relatedProjectIds
        .map((relId) => {
          const rel = projectsMap[relId];
          if (!rel) return '';
          return `
        <div class="finder-related-card" data-rel-id="${rel.id}" tabindex="0" role="button" aria-label="View related project ${rel.title}">
          <img src="${getAssetUrl(rel.heroImage || 'assets/projects/enterprise_rag_agent.png')}" alt="${rel.title}" class="finder-related-thumb" />
          <div class="finder-related-info">
            <div class="finder-related-title">${rel.title}</div>
            <span class="finder-related-cat">${rel.category}</span>
          </div>
        </div>
      `;
        })
        .join('')
    : '';

  // Category display label
  const categoryLabels = {
    'ai-ml': 'AI / Machine Learning',
    fullstack: 'Full Stack Web Engineering',
    mlops: 'MLOps & Cloud Architecture',
    datascience: 'Data Science & Analytics'
  };
  const categoryLabel = categoryLabels[p.category] || p.category.toUpperCase();

  // Links buttons
  const githubLink = p.links?.github || null;
  const demoLink = p.links?.demo || null;

  workspaceContainer.innerHTML = `
    <!-- TOP WORKSPACE HEADER & HERO IMAGE (Strict Hierarchy: Category -> Title -> Subtitle -> Action Links -> Screenshot Frame) -->
    <div class="finder-workspace-header">
      <div class="finder-header-info">
        <div class="finder-meta-bar">
          <span class="finder-category-badge">${categoryLabel}</span>
          ${p.isFeatured ? '<span class="finder-featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
        </div>
        <h1 class="finder-project-title">${p.title}</h1>
        <p class="finder-project-subtitle">${p.subtitle || p.overview}</p>
        
        <div class="finder-action-links">
          ${demoLink ? `<a href="${demoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary finder-btn-cta"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
          ${githubLink ? `<a href="${githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline finder-btn-cta"><i class="fab fa-github"></i> GitHub Repo</a>` : ''}
        </div>
      </div>

      <div class="finder-preview-frame" tabindex="0" role="button" aria-label="Click to enlarge ${p.title} preview image">
        <div class="finder-frame-bar">
          <span class="finder-frame-url">${p.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local</span>
        </div>
        <div class="finder-preview-img-wrapper">
          <img src="${heroImg}" alt="${p.title} Preview" class="finder-preview-img" />
          <div class="finder-zoom-overlay">
            <i class="fas fa-search-plus"></i> <span>Click to Enhance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PROMINENT MOBILE-ONLY DETAILS TOGGLE BUTTON -->
    <button 
      id="finder-mobile-details-toggle" 
      class="btn-mobile-details-toggle" 
      aria-expanded="false" 
      aria-controls="finder-details-grid-wrapper" 
      type="button"
    >
      <span class="toggle-text">View Project Details</span>
      <i class="fas fa-chevron-down toggle-chevron" aria-hidden="true"></i>
    </button>

    <!-- WORKSPACE BENTO DETAILS GRID WRAPPER (Documented Case Study Content) -->
    <div id="finder-details-grid-wrapper" class="finder-details-grid-wrapper mobile-collapsed">
      <div class="finder-details-grid">
        <!-- 1. OVERVIEW -->
        <div class="finder-card span-full">
          <h3 class="finder-card-header"><i class="fas fa-align-left"></i> Overview</h3>
          <p class="finder-card-text">${p.overview}</p>
        </div>

        <!-- 2. PROBLEM & SOLUTION -->
        <div class="finder-card span-half">
          <h3 class="finder-card-header"><i class="fas fa-exclamation-triangle"></i> Problem Statement</h3>
          <p class="finder-card-text">${p.problem}</p>
        </div>

        <div class="finder-card span-half">
          <h3 class="finder-card-header"><i class="fas fa-lightbulb"></i> Engineering Solution</h3>
          <p class="finder-card-text">${p.solution}</p>
        </div>

        <!-- 3. SYSTEM ARCHITECTURE / HOW IT WORKS -->
        ${howItWorksHtml}

        <!-- 4. QUANTIFIED IMPACT & TECH STACK -->
        ${
          impactHtml
            ? `
          <div class="finder-card span-half">
            <h3 class="finder-card-header"><i class="fas fa-chart-line"></i> Quantified Impact</h3>
            <div class="finder-impact-grid">
              ${impactHtml}
            </div>
          </div>
        `
            : ''
        }

        <div class="finder-card ${impactHtml ? 'span-half' : 'span-full'}">
          <h3 class="finder-card-header"><i class="fas fa-cubes"></i> Technology Stack</h3>
          <div class="finder-tech-badges">
            ${techBadgesHtml}
          </div>
        </div>

        <!-- 5. KEY FEATURES & ENGINEERING DECISIONS -->
        ${
          featuresHtml
            ? `
          <div class="finder-card span-half">
            <h3 class="finder-card-header"><i class="fas fa-list-check"></i> Key Features</h3>
            <ul class="finder-features-list">
              ${featuresHtml}
            </ul>
          </div>
        `
            : ''
        }

        ${
          p.engineeringDecisions
            ? `
          <div class="finder-card span-half">
            <h3 class="finder-card-header"><i class="fas fa-cogs"></i> Engineering Decisions</h3>
            <ul class="finder-features-list">
              ${p.engineeringDecisions.map((d) => `<li><i class="fas fa-sliders-h"></i> <span>${d}</span></li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }

        <!-- 6. RELATED PROJECTS -->
        ${
          relatedHtml
            ? `
          <div class="finder-card span-full">
            <h3 class="finder-card-header"><i class="fas fa-network-wired"></i> Related Projects</h3>
            <div class="finder-related-grid">
              ${relatedHtml}
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;

  // Bind Mobile Details Toggle Handler
  const mobileToggleBtn = workspaceContainer.querySelector('#finder-mobile-details-toggle');
  const detailsWrapper = workspaceContainer.querySelector('#finder-details-grid-wrapper');
  if (mobileToggleBtn && detailsWrapper) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        detailsWrapper.classList.remove('expanded');
        detailsWrapper.classList.add('mobile-collapsed');
        mobileToggleBtn.querySelector('.toggle-text').textContent = 'View Project Details';
        mobileToggleBtn.querySelector('.toggle-chevron').className = 'fas fa-chevron-down toggle-chevron';
      } else {
        mobileToggleBtn.setAttribute('aria-expanded', 'true');
        detailsWrapper.classList.remove('mobile-collapsed');
        detailsWrapper.classList.add('expanded');
        mobileToggleBtn.querySelector('.toggle-text').textContent = 'Hide Project Details';
        mobileToggleBtn.querySelector('.toggle-chevron').className = 'fas fa-chevron-up toggle-chevron';
      }
    });
  }

  // Bind click & keyboard handlers to preview image zoom
  const previewFrame = workspaceContainer.querySelector('.finder-preview-frame');
  if (previewFrame) {
    const triggerZoom = () => openImageLightbox(heroImg, p.title);
    previewFrame.addEventListener('click', triggerZoom);
    previewFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerZoom();
      }
    });
  }

  // Bind click & keyboard handlers to related project cards
  workspaceContainer.querySelectorAll('.finder-related-card').forEach((card) => {
    const handleRelClick = () => {
      const relId = card.getAttribute('data-rel-id');
      if (relId) selectProject(relId);
    };

    card.addEventListener('click', handleRelClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleRelClick();
      }
    });
  });
}
