/**
 * IDE-Inspired Project Explorer Module
 * Handles dynamic split-screen project studio rendering, search, category filtering,
 * 250ms CSS fade transitions, and mobile drawer toggles.
 */

let projectsData = null;
let activeProjectId = 'enterprise_rag';
let activeCategory = 'all';
let searchQuery = '';

export async function initProjectExplorer() {
  const ideWindow = document.querySelector('.ide-window');
  if (!ideWindow) return;

  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) {
      throw new Error(`Failed to load projects.json (${response.status})`);
    }
    projectsData = await response.json();
  } catch (err) {
    console.error('Project Explorer Error:', err);
    return;
  }

  // Bind Event Listeners
  setupCategoryFilters();
  setupSearchInput();
  setupMobileDrawer();
  
  // Initial Render
  renderSidebarList();
  renderProjectStudio(activeProjectId);
}

function setupCategoryFilters() {
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeCategory = item.getAttribute('data-category');
      renderSidebarList();
    });
  });
}

function setupSearchInput() {
  const searchInput = document.querySelector('#sidebar-project-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderSidebarList();
  });
}

function setupMobileDrawer() {
  const toggleBtn = document.querySelector('#mobile-explorer-toggle');
  const sidebar = document.querySelector('.ide-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    toggleBtn.textContent = sidebar.classList.contains('mobile-open') ? '✕ Close Explorer' : '☰ Explorer';
  });
}

function getFilteredProjects() {
  if (!projectsData) return [];

  const list = Object.values(projectsData);
  return list.filter(project => {
    // 1. Category Match
    let matchesCategory = true;
    if (activeCategory === 'featured') {
      matchesCategory = project.isFeatured === true;
    } else if (activeCategory !== 'all') {
      matchesCategory = project.category === activeCategory;
    }

    // 2. Search Match
    let matchesSearch = true;
    if (searchQuery) {
      const haystack = `${project.title} ${project.subtitle} ${project.tags ? project.tags.join(' ') : ''}`.toLowerCase();
      matchesSearch = haystack.includes(searchQuery);
    }

    return matchesCategory && matchesSearch;
  });
}

function renderSidebarList() {
  const listContainer = document.querySelector('#sidebar-projects-list');
  if (!listContainer) return;

  const filtered = getFilteredProjects();

  if (!filtered.length) {
    listContainer.innerHTML = `<div style="padding: 16px; color: #8b949e; font-size: 0.82rem; text-align: center;">No projects found</div>`;
    return;
  }

  listContainer.innerHTML = filtered.map(project => {
    const isActive = project.id === activeProjectId ? 'active' : '';
    const imgUrl = project.heroImage ? project.heroImage : 'assets/projects/enterprise_rag_agent.png';

    return `
      <div class="project-list-item ${isActive}" data-id="${project.id}">
        <img src="${imgUrl}" alt="${project.title}" class="project-thumb-mini" />
        <div class="project-list-info">
          <div class="project-list-title">${project.title}</div>
        </div>
        <div class="active-dot"></div>
      </div>
    `;
  }).join('');

  // Bind click handler to list items
  listContainer.querySelectorAll('.project-list-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      if (id && id !== activeProjectId) {
        switchProject(id);
      }
    });
  });
}

function switchProject(id) {
  activeProjectId = id;
  
  // Highlight active in sidebar
  document.querySelectorAll('.project-list-item').forEach(item => {
    if (item.getAttribute('data-id') === id) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Fade out studio, update DOM, fade in
  const studioWrapper = document.querySelector('#studio-content-wrapper');
  if (studioWrapper) {
    studioWrapper.classList.add('fade-out');
    setTimeout(() => {
      renderProjectStudio(id);
      studioWrapper.classList.remove('fade-out');
    }, 200);
  } else {
    renderProjectStudio(id);
  }
}

function renderProjectStudio(id) {
  if (!projectsData || !projectsData[id]) return;

  const p = projectsData[id];
  
  // 1. Update Breadcrumb
  const breadcrumbPath = document.querySelector('#ide-active-path');
  if (breadcrumbPath) {
    breadcrumbPath.textContent = p.title;
  }

  // 2. Render Main Studio Content
  const studioWrapper = document.querySelector('#studio-content-wrapper');
  if (!studioWrapper) return;

  const heroImg = p.heroImage || 'assets/projects/enterprise_rag_agent.png';
  const tagPillsHtml = p.tags ? p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('') : '';
  
  const techBadgesHtml = p.techStackDetailed ? p.techStackDetailed.map(t => `
    <span class="tech-badge-item">
      <img src="${t.badge}" alt="${t.name}" />
    </span>
  `).join('') : '';

  const checklistHtml = p.keyFeatures ? p.keyFeatures.map(f => `
    <li><i class="fas fa-check-circle"></i> <span>${f}</span></li>
  `).join('') : '';

  const impactHtml = p.quantifiableImpact ? p.quantifiableImpact.map(st => `
    <div class="impact-stat-item">
      <div class="stat-val">${st.value}</div>
      <div class="stat-lbl">${st.label}</div>
    </div>
  `).join('') : '';

  const archHtml = p.architecture ? p.architecture.map((step, idx) => `
    <div class="arch-node">
      <span>${step}</span>
      <i class="fas fa-arrow-right arch-arrow"></i>
    </div>
  `).join('') : '';

  // Find related projects
  const relatedHtml = p.relatedProjectIds ? p.relatedProjectIds.map(relId => {
    const rel = projectsData[relId];
    if (!rel) return '';
    return `
      <div class="related-item-card" data-rel-id="${rel.id}">
        <img src="${rel.heroImage || 'assets/projects/enterprise_rag_agent.png'}" alt="${rel.title}" class="related-thumb" />
        <div class="related-name">${rel.title}</div>
      </div>
    `;
  }).join('') : '';

  studioWrapper.innerHTML = `
    <!-- HERO SPLIT SECTION -->
    <div class="project-studio-hero">
      <div class="hero-left-details">
        <div class="hero-meta-header">
          ${p.isFeatured ? '<span class="featured-pill-badge">★ Featured</span>' : ''}
        </div>
        <h1 class="project-title-large">${p.title}</h1>
        <p class="project-subtitle-text">${p.subtitle}</p>

        <div class="project-tag-pills">
          ${tagPillsHtml}
        </div>

        <div class="hero-cta-buttons">
          ${p.links && p.links.caseStudy ? `<a href="${p.links.caseStudy}" target="_blank" class="btn-studio-primary">View Case Study <i class="fas fa-arrow-right"></i></a>` : ''}
          ${p.links && p.links.github ? `<a href="${p.links.github}" target="_blank" class="btn-studio-secondary"><i class="fab fa-github"></i> GitHub</a>` : ''}
          ${p.links && p.links.demo ? `<a href="${p.links.demo}" target="_blank" class="btn-studio-secondary"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
        </div>
      </div>

      <div class="hero-right-frame">
        <div class="hero-screenshot-frame">
          <div class="frame-bar"></div>
          <img src="${heroImg}" alt="${p.title}" class="frame-img" />
        </div>
      </div>
    </div>

    <!-- PROMINENT MOBILE-ONLY DETAILS TOGGLE BUTTON -->
    <button 
      id="studio-mobile-details-toggle" 
      class="btn-mobile-details-toggle" 
      aria-expanded="false" 
      aria-controls="bento-studio-grid-wrapper" 
      type="button"
    >
      <span class="toggle-text">View Project Details</span>
      <i class="fas fa-chevron-down toggle-chevron" aria-hidden="true"></i>
    </button>

    <!-- BENTO DETAILS GRID WRAPPER (12 SECTIONS) -->
    <div id="bento-studio-grid-wrapper" class="bento-studio-grid-wrapper mobile-collapsed">
      <div class="bento-studio-grid">
        <!-- OVERVIEW -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-info-circle"></i> OVERVIEW</div>
          <p class="bento-card-text">${p.overview}</p>
        </div>

        <!-- TECH STACK -->
        <div class="bento-card span-1">
          <div class="bento-card-title"><i class="fas fa-layer-group"></i> TECH STACK</div>
          <div class="tech-badges-grid">
            ${techBadgesHtml}
          </div>
        </div>

        <!-- IMPACT -->
        <div class="bento-card span-1">
          <div class="bento-card-title"><i class="fas fa-chart-line"></i> IMPACT</div>
          <div class="impact-stats-wrapper">
            ${impactHtml}
          </div>
        </div>

        <!-- KEY FEATURES -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-list-check"></i> KEY FEATURES</div>
          <ul class="bento-checklist">
            ${checklistHtml}
          </ul>
        </div>

        <!-- SYSTEM ARCHITECTURE -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-sitemap"></i> SYSTEM ARCHITECTURE</div>
          <div class="architecture-flow">
            ${archHtml}
          </div>
        </div>

        <!-- PROBLEM -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-exclamation-triangle"></i> PROBLEM</div>
          <p class="bento-card-text">${p.problem}</p>
        </div>

        <!-- SOLUTION -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-lightbulb"></i> SOLUTION</div>
          <p class="bento-card-text">${p.solution}</p>
        </div>

        <!-- ENGINEERING DECISIONS -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-cogs"></i> ENGINEERING DECISIONS</div>
          <ul class="bento-checklist">
            ${p.engineeringDecisions ? p.engineeringDecisions.map(d => `<li><i class="fas fa-sliders-h"></i> <span>${d}</span></li>`).join('') : ''}
          </ul>
        </div>

        <!-- CHALLENGES & LESSONS LEARNED -->
        <div class="bento-card span-2">
          <div class="bento-card-title"><i class="fas fa-graduation-cap"></i> CHALLENGES & LESSONS</div>
          <p class="bento-card-text" style="margin-bottom: 12px;"><strong>Challenge:</strong> ${p.challenges}</p>
          <p class="bento-card-text"><strong>Lesson Learned:</strong> ${p.lessonsLearned}</p>
        </div>

        <!-- RELATED PROJECTS -->
        <div class="bento-card span-4">
          <div class="bento-card-title"><i class="fas fa-network-wired"></i> RELATED PROJECTS</div>
          <div class="related-grid">
            ${relatedHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Mobile Details Toggle Handler
  const mobileToggleBtn = studioWrapper.querySelector('#studio-mobile-details-toggle');
  const detailsWrapper = studioWrapper.querySelector('#bento-studio-grid-wrapper');
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

  // Bind click handlers for related projects
  studioWrapper.querySelectorAll('.related-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const relId = card.getAttribute('data-rel-id');
      if (relId) switchProject(relId);
    });
  });
}
