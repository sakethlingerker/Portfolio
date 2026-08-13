/**
 * Certifications & Achievements Studio Controller Module
 * Handles filter system, search, dynamic stats, featured list, and persistent inspector studio.
 */

import {
  getCertifications,
  getAchievements,
  getCertificationsByCategory,
  searchCertifications,
  getFeaturedCertifications,
  getCertificationsStats
} from '../data/certifications.js';

let activeCategory = 'all';
let searchQuery = '';
let selectedCertId = null;

export function initCertifications() {
  const container = document.querySelector('#achievements') || document.querySelector('.certifications-section');
  if (!container) return;

  const allCerts = getCertifications();
  if (allCerts.length > 0) {
    selectedCertId = allCerts[0].id;
  }

  renderStudioLayout();
}

function renderStats() {
  const statsRoot = document.querySelector('#cert-stats-root');
  if (!statsRoot) return;

  const stats = getCertificationsStats();

  statsRoot.innerHTML = `
    <div class="cert-stat-card" data-aos="fade-up">
      <div class="cert-stat-icon"><i class="fas fa-certificate"></i></div>
      <div>
        <div class="cert-stat-num">${stats.certifications}</div>
        <div class="cert-stat-lbl">Certifications</div>
      </div>
    </div>

    <div class="cert-stat-card" data-aos="fade-up" data-aos-delay="100">
      <div class="cert-stat-icon"><i class="fas fa-building"></i></div>
      <div>
        <div class="cert-stat-num">${stats.organizations}</div>
        <div class="cert-stat-lbl">Organizations</div>
      </div>
    </div>

    <div class="cert-stat-card" data-aos="fade-up" data-aos-delay="200">
      <div class="cert-stat-icon"><i class="fas fa-layer-group"></i></div>
      <div>
        <div class="cert-stat-num">${stats.domains}</div>
        <div class="cert-stat-lbl">Technical Domains</div>
      </div>
    </div>

    <div class="cert-stat-card" data-aos="fade-up" data-aos-delay="300">
      <div class="cert-stat-icon"><i class="fas fa-trophy"></i></div>
      <div>
        <div class="cert-stat-num">${stats.achievements}</div>
        <div class="cert-stat-lbl">Major Achievements</div>
      </div>
    </div>
  `;
}

function renderFeaturedCredentials() {
  const featuredRoot = document.querySelector('#featured-credentials-root');
  if (!featuredRoot) return;

  const featuredList = getFeaturedCertifications();

  featuredRoot.innerHTML = featuredList
    .map(
      (c) => `
    <div class="featured-cred-card" data-id="${c.id}">
      <div>
        <div class="featured-logo-wrapper">
          <img src="${c.issuerLogo}" alt="${c.issuer}" class="featured-logo-img" />
        </div>
        <h4 class="featured-cred-title">${c.title}</h4>
        ${c.score ? `<span class="featured-score-badge">${c.score}</span>` : ''}
      </div>
      <div>
        <div class="featured-cred-date"><i class="far fa-calendar-alt"></i> ${c.date}</div>
        <div class="featured-skills-row">
          ${c.skills.slice(0, 3).map((s) => `<span class="mini-skill-chip">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `
    )
    .join('');

  featuredRoot.querySelectorAll('.featured-cred-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) {
        selectedCertId = id;
        renderStudioLayout();
      }
    });
  });
}

function renderCategoryPills() {
  const pillsRoot = document.querySelector('#cert-category-pills-root');
  if (!pillsRoot) return;

  const categories = ['All', 'AI / ML', 'Cloud', 'Data', 'Professional'];

  pillsRoot.innerHTML = categories
    .map(
      (cat) => `
    <button class="cert-cat-pill ${cat.toLowerCase() === activeCategory ? 'active' : ''}" data-category="${cat.toLowerCase()}">
      ${cat}
    </button>
  `
    )
    .join('');

  pillsRoot.querySelectorAll('.cert-cat-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      pillsRoot.querySelectorAll('.cert-cat-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category') || 'all';
      renderStudioLayout();
    });
  });
}

function setupSearchListener() {
  const searchInput = document.querySelector('#cert-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderStudioLayout();
  });
}

function getFilteredCertifications() {
  let list = getCertifications();

  if (activeCategory !== 'all') {
    list = list.filter((c) => c.category.toLowerCase() === activeCategory.toLowerCase());
  }

  if (searchQuery.trim()) {
    list = searchCertifications(searchQuery);
  }

  return list;
}

function renderStudioLayout() {
  const filteredList = getFilteredCertifications();
  const gridRoot = document.querySelector('#cert-grid-root');
  const inspectorRoot = document.querySelector('#cert-inspector-root');

  if (!gridRoot || !inspectorRoot) return;

  if (filteredList.length === 0) {
    gridRoot.innerHTML = `
      <div style="grid-column: span 2; padding: 40px; text-align: center; color: #8b949e;">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>No certifications match your criteria</p>
      </div>
    `;
    inspectorRoot.innerHTML = `<div style="padding: 20px; color: #8b949e; text-align: center;">Select a certification to inspect details</div>`;
    return;
  }

  // If selected cert is not in filtered list, pick first
  const activeExists = filteredList.some((c) => c.id === selectedCertId);
  if (!activeExists && filteredList.length > 0) {
    selectedCertId = filteredList[0].id;
  }

  // Render Grid
  gridRoot.innerHTML = filteredList
    .map((c) => {
      const isActive = c.id === selectedCertId ? 'active' : '';
      return `
        <div class="cert-item-card ${isActive}" data-id="${c.id}">
          <div class="cert-card-top">
            <div class="cert-card-title-group">
              <h5 class="cert-card-title">${c.title}</h5>
              <p class="cert-card-issuer">${c.issuer}</p>
            </div>
            ${c.score ? `<span class="cert-card-score">${c.score}</span>` : ''}
          </div>
          <div class="cert-card-bottom">
            <span class="cert-card-date"><i class="far fa-calendar-alt"></i> ${c.date}</span>
            <span class="cert-card-cat">${c.category}</span>
          </div>
        </div>
      `;
    })
    .join('');

  gridRoot.querySelectorAll('.cert-item-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) {
        selectedCertId = id;
        renderStudioLayout();
      }
    });
  });

  // Render Persistent Inspector Panel
  const currentIndex = filteredList.findIndex((c) => c.id === selectedCertId);
  const selectedCert = filteredList[currentIndex >= 0 ? currentIndex : 0];

  if (selectedCert) {
    inspectorRoot.innerHTML = `
      <div class="cert-inspector-panel">
        <div class="inspector-nav-header">
          <div class="inspector-counter">
            <button class="nav-arrow-btn" id="cert-nav-prev" ${currentIndex === 0 ? 'disabled style="opacity:0.3;"' : ''}>
              <i class="fas fa-chevron-left"></i>
            </button>
            <span>${currentIndex + 1} / ${filteredList.length}</span>
            <button class="nav-arrow-btn" id="cert-nav-next" ${currentIndex === filteredList.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="inspector-preview-frame" id="inspector-preview-trigger">
          <img src="${selectedCert.image}" alt="${selectedCert.title}" class="inspector-preview-img" onerror="this.src='src/assets/enterprise_rag_agent.png'" />
        </div>

        <div class="inspector-details">
          <h3 class="inspector-title">${selectedCert.title}</h3>
          <p class="inspector-issuer">${selectedCert.issuer}</p>

          <div class="inspector-meta-table">
            <div class="inspector-meta-row">
              <span>Issued:</span>
              <span class="inspector-meta-val">${selectedCert.date}</span>
            </div>
            ${selectedCert.credentialId ? `
              <div class="inspector-meta-row">
                <span>Credential ID:</span>
                <span class="inspector-meta-val">${selectedCert.credentialId}</span>
              </div>
            ` : ''}
            <div class="inspector-meta-row">
              <span>Category:</span>
              <span class="inspector-meta-val">${selectedCert.category}</span>
            </div>
            ${selectedCert.score ? `
              <div class="inspector-meta-row">
                <span>Result:</span>
                <span class="inspector-meta-val">${selectedCert.score}</span>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 10px;">
            <span style="font-size: 0.76rem; color: #8b949e; font-weight: 700; text-transform: uppercase;">Skills Demonstrated</span>
            <div class="inspector-skills-list">
              ${selectedCert.skills.map((s) => `<div class="inspector-skill-item"><i class="fas fa-check-circle"></i> <span>${s}</span></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="inspector-actions">
          ${selectedCert.verificationUrl ? `
            <a href="${selectedCert.verificationUrl}" target="_blank" class="btn-inspector-primary">
              View Verification <i class="fas fa-external-link-alt"></i>
            </a>
          ` : ''}
          ${selectedCert.pdfUrl ? `
            <a href="${selectedCert.pdfUrl}" target="_blank" class="btn-inspector-secondary" download>
              <i class="fas fa-download"></i> Download PDF
            </a>
          ` : ''}
        </div>
      </div>
    `;

    // Arrow Nav Listeners
    const prevBtn = inspectorRoot.querySelector('#cert-nav-prev');
    const nextBtn = inspectorRoot.querySelector('#cert-nav-next');
    if (prevBtn && currentIndex > 0) {
      prevBtn.addEventListener('click', () => {
        selectedCertId = filteredList[currentIndex - 1].id;
        renderStudioLayout();
      });
    }
    if (nextBtn && currentIndex < filteredList.length - 1) {
      nextBtn.addEventListener('click', () => {
        selectedCertId = filteredList[currentIndex + 1].id;
        renderStudioLayout();
      });
    }

    // Lightbox Trigger
    const previewTrigger = inspectorRoot.querySelector('#inspector-preview-trigger');
    if (previewTrigger) {
      previewTrigger.addEventListener('click', () => openFullCertificateModal(selectedCert));
    }
  }
}

function renderAchievementsMilestones() {
  const milestonesRoot = document.querySelector('#milestones-root');
  if (!milestonesRoot) return;

  const achievements = getAchievements();

  milestonesRoot.innerHTML = `
    <div class="achievements-milestones-card" data-aos="fade-up">
      <div class="milestones-header">
        <div class="milestones-title-group">
          <h4 class="milestones-heading">Achievements & Milestones</h4>
          <p class="milestones-subheading">Major research internships, competitive performance, and career selections.</p>
        </div>
      </div>
      
      <div class="milestones-list">
        ${achievements
          .map(
            (a) => `
          <div class="milestone-item">
            <div class="milestone-badge">
              <i class="fas fa-award"></i>
            </div>
            <div class="milestone-info">
              <div class="milestone-top-row">
                <h5 class="milestone-title">${a.title}</h5>
                ${a.tag ? `<span class="milestone-tag-chip">${a.tag}</span>` : ''}
              </div>
              <div class="milestone-meta">
                <span><i class="fas fa-building"></i> ${a.issuer}</span>
                <span class="milestone-dot">•</span>
                <span><i class="far fa-calendar-alt"></i> ${a.date}</span>
              </div>
              <p class="milestone-desc">${a.description}</p>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function openFullCertificateModal(cert) {
  let modal = document.querySelector('#cert-lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cert-lightbox-modal';
    modal.className = 'finder-lightbox active';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="finder-lightbox-backdrop" id="cert-lightbox-backdrop"></div>
    <div class="finder-lightbox-container">
      <button class="finder-lightbox-close" id="cert-lightbox-close" aria-label="Close modal">
        <i class="fas fa-times"></i> <span>Close</span>
      </button>
      <img src="${cert.image}" alt="${cert.title}" class="finder-lightbox-img" onerror="this.src='src/assets/enterprise_rag_agent.png'" />
      <div class="finder-lightbox-caption">${cert.title} — ${cert.issuer} (${cert.date})</div>
    </div>
  `;

  modal.classList.add('active');
  document.body.classList.add('finder-lightbox-open');

  const closeFn = () => {
    modal.classList.remove('active');
    document.body.classList.remove('finder-lightbox-open');
  };

  const backdrop = modal.querySelector('#cert-lightbox-backdrop');
  const closeBtn = modal.querySelector('#cert-lightbox-close');
  if (backdrop) backdrop.addEventListener('click', closeFn);
  if (closeBtn) closeBtn.addEventListener('click', closeFn);

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeFn();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
}
