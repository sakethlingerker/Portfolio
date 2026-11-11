import { gsap } from 'gsap';
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
      if (window.scrollAnimationController) window.scrollAnimationController.refresh();
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
        animateFinderNavItems();
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
  // Render and animate
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
    .map((p, idx) => {
      const isActive = p.id === activeProjectId ? 'active' : '';
      const indexLabel = String(idx + 1).padStart(2, '0');

      return `
        <div class="finder-nav-item ${isActive}" data-id="${p.id}" tabindex="0" role="button" aria-label="Select ${p.title}">
          <span class="finder-item-index" aria-hidden="true">${indexLabel}</span>
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
  }); animateFinderNavItems();
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
function renderSystemFlowSection(steps, projectCategory = 'ai-ml', project = null) {
  const p = project || { id: 'project', architectureStages: null, architecture: steps };
  const stages = p.architectureStages || [];

  const normalizeStageStep = (stepStr, idx, total) => {
    const text = (stepStr || '').toLowerCase();
    let category = 'PROCESSING';

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

  const normalizedStages = stages.length > 0
    ? stages
    : (steps || []).map((stepStr, idx) => {
      const { stepNumber, category, title, desc } = normalizeStageStep(stepStr, idx, steps.length);
      return {
        stageNumber: idx + 1,
        name: title,
        category,
        tech: [],
        inputs: 'Raw pipeline input data',
        outputs: 'Processed stage results',
        responsibility: desc || title,
        engineeringDecision: 'Designed for robust validation and clean throughput.'
      };
    });

  if (normalizedStages.length === 0) return '';

  const totalStages = normalizedStages.length;
  const nodeW = 146;
  const nodeH = 94;
  const gap = 34;
  const padLeft = 16;
  const padTop = 18;
  const totalSvgWidth = padLeft * 2 + totalStages * nodeW + (totalStages - 1) * gap;
  const totalSvgHeight = 132;

  let svgPathsHtml = '';
  let svgNodesHtml = '';

  normalizedStages.forEach((stage, idx) => {
    const x = padLeft + idx * (nodeW + gap);
    const y = padTop;
    const stageNum = String(stage.stageNumber || idx + 1).padStart(2, '0');
    const category = (stage.category || 'PROCESSING').toUpperCase();
    const rawName = stage.name || ('Stage ' + stageNum);

    let line1 = rawName;
    let line2 = '';
    if (rawName.length > 16 && rawName.includes(' ')) {
      const words = rawName.split(' ');
      const mid = Math.ceil(words.length / 2);
      line1 = words.slice(0, mid).join(' ');
      line2 = words.slice(mid).join(' ');
    }

    if (idx < totalStages - 1) {
      const x1 = x + nodeW;
      const y1 = y + Math.round(nodeH / 2);
      const x2 = x + nodeW + gap - 8;
      const y2 = y1;
      const pathId = 'arch-path-' + p.id + '-' + idx;

      svgPathsHtml += `
        <g class="arch-path-group" aria-hidden="true">
          <path id="${pathId}" class="arch-svg-path" d="M ${x1} ${y1} L ${x2} ${y2}" marker-end="url(#arch-arrow-${p.id})" />
          <circle class="arch-flow-dot" r="3" fill="#F45135">
            <animateMotion dur="${(2.0 + idx * 0.25).toFixed(2)}s" repeatCount="indefinite" path="M ${x1} ${y1} L ${x2} ${y2}" />
          </circle>
        </g>
      `;
    }

    svgNodesHtml += `
      <g class="arch-svg-node ${idx === 0 ? 'active' : ''}" data-stage-idx="${idx}" tabindex="0" role="button" aria-label="Inspect Stage ${stageNum}: ${rawName}">
        <rect class="arch-node-bg" x="${x}" y="${y}" width="${nodeW}" height="${nodeH}" rx="8" ry="8" />
        <rect class="arch-node-accent-line" x="${x + 10}" y="${y + 2}" width="26" height="2.5" rx="1" fill="#F45135" />
        <text class="arch-node-num" x="${x + 12}" y="${y + 22}">[${stageNum}]</text>
        <text class="arch-node-cat" x="${x + 50}" y="${y + 22}">${category}</text>
        <text class="arch-node-title" x="${x + 12}" y="${y + 46}">
          <tspan x="${x + 12}" dy="0">${line1}</tspan>
          ${line2 ? `<tspan x="${x + 12}" dy="16">${line2}</tspan>` : ''}
        </text>
        <circle class="arch-node-indicator" cx="${x + nodeW - 14}" cy="${y + 18}" r="3.5" />
      </g>
    `;
  });

  const initialStage = normalizedStages[0];
  const initialTechPills = (initialStage.tech || [])
    .map((t) => `<span class="finder-tech-pill">${t}</span>`)
    .join(' ');

  return `
    <div class="finder-card span-full finder-system-architecture-card">
      <div class="finder-system-flow-header">
        <div>
          <span class="finder-sys-eyebrow">SYSTEM ARCHITECTURE</span>
          <h3 class="finder-card-header"><i class="fas fa-sitemap"></i> Interactive Architecture Diagram</h3>
        

      <!-- Animated Responsive SVG Diagram Canvas -->
      <div class="arch-svg-container" tabindex="0" aria-label="Interactive SVG Architecture Diagram">
        <svg class="arch-svg-canvas" viewBox="0 0 ${totalSvgWidth} ${totalSvgHeight}" width="${totalSvgWidth}" height="${totalSvgHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arch-arrow-${p.id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F45135" />
            </marker>
          </defs>
          ${svgPathsHtml}
          ${svgNodesHtml}
        </svg>
      </div>

      <!-- Live Stage Inspector Deep-Dive -->
      <div id="finder-stage-deepdive" class="finder-stage-deepdive" role="region" aria-live="polite" aria-label="Selected Pipeline Stage Details">
        <div class="stage-deepdive-header">
          <div class="stage-deepdive-meta">
            <span class="stage-num">[0${initialStage.stageNumber || 1}]</span>
            <span class="stage-cat">${initialStage.category || 'PROCESSING'}</span>
          </div>
          <h4 class="stage-title">${initialStage.name}</h4>
          ${initialTechPills ? `<div class="stage-tech-row">${initialTechPills}</div>` : ''}
        </div>
        <div class="stage-deepdive-grid">
          <div class="stage-deepdive-col">
            <span class="deepdive-label"><i class="fas fa-sign-in-alt"></i> INPUTS</span>
            <p class="deepdive-val">${initialStage.inputs || 'Verified pipeline inputs'}</p>
          </div>
          <div class="stage-deepdive-col">
            <span class="deepdive-label"><i class="fas fa-sign-out-alt"></i> OUTPUTS</span>
            <p class="deepdive-val">${initialStage.outputs || 'Verified stage outputs'}</p>
          </div>
          <div class="stage-deepdive-col span-2">
            <span class="deepdive-label"><i class="fas fa-tasks"></i> COMPONENT RESPONSIBILITY</span>
            <p class="deepdive-val">${initialStage.responsibility || 'System responsibility'}</p>
          </div>
          ${initialStage.engineeringDecision
      ? `
            <div class="stage-deepdive-col span-2 decision">
              <span class="deepdive-label"><i class="fas fa-microchip"></i> VERIFIED ENGINEERING DECISION</span>
              <p class="deepdive-val">"${initialStage.engineeringDecision}"</p>
            </div>
          `
      : ''
    }
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
  const howItWorksHtml = renderSystemFlowSection(p.architecture, p.category, p);

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

        <!-- 3b. TECHNICAL RIGOR & ENGINEERING CHALLENGES -->
        ${p.challenges
      ? `
          <div class="finder-card span-full finder-challenges-card">
            <div class="finder-challenges-header">
              <span class="finder-sys-eyebrow">TECHNICAL RIGOR</span>
              <h3 class="finder-card-header"><i class="fas fa-shield-alt"></i> Engineering Challenge &amp; Resolution</h3>
            </div>
            <div class="finder-challenge-body">
              <div class="finder-challenge-item">
                <span class="finder-challenge-badge challenge"><i class="fas fa-exclamation-triangle"></i> Challenge</span>
                <p class="finder-challenge-text">${p.challenges}</p>
              </div>
              ${p.lessonsLearned
        ? `
                <div class="finder-challenge-item">
                  <span class="finder-challenge-badge resolution"><i class="fas fa-check-circle"></i> Architectural Resolution</span>
                  <p class="finder-challenge-text">${p.lessonsLearned}</p>
                </div>
              `
        : ''
      }
            </div>
          </div>
        `
      : ''
    }


        <!-- 4. QUANTIFIED IMPACT & TECH STACK -->
        ${impactHtml
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
        ${featuresHtml
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

        ${p.engineeringDecisions
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
        ${relatedHtml
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

  // Bind interactive SVG stage node events
  const stageNodes = workspaceContainer.querySelectorAll('.arch-svg-node');
  const deepDiveCard = workspaceContainer.querySelector('#finder-stage-deepdive');
  if (stageNodes.length && deepDiveCard && p.architectureStages && p.architectureStages.length) {
    const updateStageSelection = (idx) => {
      const stage = p.architectureStages[idx];
      if (!stage) return;

      stageNodes.forEach((node) => {
        const isSelected = parseInt(node.getAttribute('data-stage-idx'), 10) === idx;
        node.classList.toggle('active', isSelected);
      });

      const techPills = (stage.tech || []).map((t) => `<span class="finder-tech-pill">${t}</span>`).join(' ');

      deepDiveCard.innerHTML = `
        <div class="stage-deepdive-header">
          <div class="stage-deepdive-meta">
            <span class="stage-num">[0${stage.stageNumber || idx + 1}]</span>
            <span class="stage-cat">${stage.category || 'PROCESSING'}</span>
          </div>
          <h4 class="stage-title">${stage.name}</h4>
          ${techPills ? `<div class="stage-tech-row">${techPills}</div>` : ''}
        </div>
        <div class="stage-deepdive-grid">
          <div class="stage-deepdive-col">
            <span class="deepdive-label"><i class="fas fa-sign-in-alt"></i> INPUTS</span>
            <p class="deepdive-val">${stage.inputs || 'Verified pipeline inputs'}</p>
          </div>
          <div class="stage-deepdive-col">
            <span class="deepdive-label"><i class="fas fa-sign-out-alt"></i> OUTPUTS</span>
            <p class="deepdive-val">${stage.outputs || 'Verified stage outputs'}</p>
          </div>
          <div class="stage-deepdive-col span-2">
            <span class="deepdive-label"><i class="fas fa-tasks"></i> COMPONENT RESPONSIBILITY</span>
            <p class="deepdive-val">${stage.responsibility || 'System responsibility'}</p>
          </div>
          ${stage.engineeringDecision
          ? `
            <div class="stage-deepdive-col span-2 decision">
              <span class="deepdive-label"><i class="fas fa-microchip"></i> VERIFIED ENGINEERING DECISION</span>
              <p class="deepdive-val">"${stage.engineeringDecision}"</p>
            </div>
          `
          : ''
        }
        </div>
      `;
    };

    stageNodes.forEach((node) => {
      const idx = parseInt(node.getAttribute('data-stage-idx'), 10) || 0;
      node.addEventListener('click', () => updateStageSelection(idx));
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateStageSelection(idx);
        }
      });
    });
  }
}

export function animateFinderNavItems() {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  const items = document.querySelectorAll('#finder-project-list .finder-nav-item');
  if (items.length > 0) {
    gsap.fromTo(items,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.025, ease: 'power2.out', clearProps: 'transform,opacity' }
    );
  }
}
