/**
 * Engineering Workbench Controller Module
 * Dark Cinematic Diagnostic & Investigation Suite (<SL /> Branding)
 * Modes: Find Projects, Inspect Architecture, Compare Projects, Ask About My Work
 */

import { loadProjectsData } from './projects-data.js';
import { openProjectInStudio } from './projects.js';

// Verified Grounded Knowledge Base for "Ask About My Work"
const VERIFIED_KNOWLEDGE_BASE = {
  profile: {
    name: "Saketh Lingerker",
    role: "Incoming Systems Engineer @ Tata Consultancy Services (TCS Digital Offer Accepted, Awaiting Onboarding)",
    location: "Hyderabad, Telangana, India",
    education: "B.Tech in Computer Science & Engineering from JNTUH University College of Engineering, Manthani (2021–2025, CGPA: 7.47/10.0)",
    summary: "Computer Science Engineer specializing in practical AI/ML systems, production-ready web applications, Retrieval-Augmented Generation (RAG), and MLOps cloud pipelines on AWS.",
    contact: "Email: saketh1805@gmail.com | Phone: +91 8688791352 | Portfolio: https://sakethlingerker.github.io/Portfolio/",
    truthRules: [
      "Saketh accepted the TCS Digital (Systems Engineer) offer after achieving 89% in GET-IT and 91.51% in Cognitive NQT, and is currently awaiting official onboarding. He does NOT currently work at TCS.",
      "Saketh was an AI/ML Research Intern at IIIT Hyderabad (Nov 2024 - Jun 2025). He was NOT a Teaching Assistant and NOT a Co-founder.",
      "Saketh holds a B.Tech CSE degree. He DOES NOT hold a Master's degree.",
      "Saketh specializes in Python, LangChain, FAISS, Docker, AWS (EC2/ECR/S3), Flask, and JavaScript. He does NOT list Azure or unverified frameworks."
    ]
  },
  experience: [
    {
      company: "Tata Consultancy Services (TCS iON)",
      role: "Graduate Engineer Trainee - IT (Systems Engineer Offer Accepted)",
      period: "Jul 2025 – Present (Awaiting Joining)",
      details: "Offered Systems Engineer role via TCS Digital recruitment following competitive assessments: TCS iON GET-IT (89%) and TCS iON Cognitive NQT (91.51%). Currently awaiting official joining date."
    },
    {
      company: "IIIT Hyderabad (International Institute of Information Technology)",
      role: "AI/ML Research Intern",
      period: "Nov 2024 – Jun 2025",
      details: "Researched Voice Activity Detection (VAD) algorithms for speech segment detection in noisy environments, built AI video summarization workflows, and conducted quantitative evaluations of acoustic feature extractors. Verified Research Certificate issued."
    }
  ],
  certifications: [
    { name: "TCS iON NPT – GET IT", score: "89% (Proficiency Certificate)", type: "Professional Assessment", verified: true },
    { name: "TCS iON NQT – Cognitive", score: "91.51% Percentile", type: "Cognitive Assessment", verified: true },
    { name: "TCS iON NQT – Psychometric Assessment", score: "High Performance", type: "Psychometric Assessment", verified: true },
    { name: "English with British Council", score: "CEFR B1 (Speaking) / B2+ (Writing)", type: "Language Proficiency", verified: true },
    { name: "IIIT Hyderabad AI/ML Research Internship Certificate", score: "Verified Research Completion", type: "Research Internship", verified: true },
    { name: "Deloitte Australia Data Analytics Simulation", score: "Job Simulation Certificate", type: "Industry Simulation", verified: true },
    { name: "Tata Group Data Analytics Simulation", score: "Job Simulation Certificate", type: "Industry Simulation", verified: true },
    { name: "AWS Cloud Practitioner Essentials", score: "Course Completion Certificate", type: "Cloud Training", verified: true }
  ],
  skills: {
    languages: ["Python", "JavaScript", "SQL", "HTML5", "CSS3", "C/C++"],
    ai_ml: ["LangChain", "FAISS", "ChromaDB", "Groq API", "Llama 3.3 70B", "Google Gemini API", "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "OpenCV", "NLTK", "Stable Diffusion"],
    backend: ["Flask RESTful APIs", "JWT Auth & RBAC", "SQLite", "MongoDB Atlas"],
    cloud_devops: ["AWS (EC2, ECR, S3)", "Docker Containerization", "GitHub Actions CI/CD", "Streamlit", "Git"]
  }
};

let isInitialized = false;
let projectsMap = {};
let activeMode = 'projects';
let activeArchProjectId = 'enterprise_rag';
let activeArchStageIndex = 0;
let lastFocusedElement = null;
let recentSearches = ['RAG architecture', 'MLOps pipeline', 'AWS projects'];

export async function initWorkbench() {
  if (isInitialized) return;

  const modal = document.getElementById('workbench-modal');
  if (!modal) return;

  // Load project data
  try {
    projectsMap = await loadProjectsData();
  } catch (err) {
    console.error('Workbench: Failed to load projects data:', err);
  }

  setupEventListeners();
  populateInitialData();
  isInitialized = true;
}

function setupEventListeners() {
  const modal = document.getElementById('workbench-modal');
  const desktopTrigger = document.getElementById('workbench-nav-trigger');
  const mobileTrigger = document.getElementById('mobile-workbench-trigger');
  const closeBtn = document.getElementById('workbench-close-btn');
  const backdrop = document.getElementById('workbench-backdrop');
  const searchInput = document.getElementById('workbench-search-input');
  const askInput = document.getElementById('workbench-ask-input');
  const askSubmitBtn = document.getElementById('workbench-ask-submit-btn');

  // Trigger clicks
  desktopTrigger?.addEventListener('click', (e) => {
    e.preventDefault();
    openWorkbench();
  });

  mobileTrigger?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.mobile-cinematic-menu')?.classList.remove('active');
    openWorkbench();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeWorkbench();
  });

  backdrop?.addEventListener('click', (e) => {
    e.preventDefault();
    closeWorkbench();
  });

  // Global Keyboard Shortcuts: Ctrl+K / Cmd+K and Escape
  window.addEventListener('keydown', (e) => {
    const isCtrlOrCmd = e.metaKey || e.ctrlKey;

    if (isCtrlOrCmd && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggleWorkbench();
      return;
    }

    if (e.key === 'Escape' && isWorkbenchOpen()) {
      e.preventDefault();
      e.stopPropagation();
      closeWorkbench();
      return;
    }

    // Quick single-key shortcuts when workbench is open and user isn't in an input
    if (isWorkbenchOpen()) {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      if (!isInput && !isCtrlOrCmd && !e.altKey) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          triggerQuickAction('terminal');
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          triggerQuickAction('resume');
        } else if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          triggerQuickAction('github');
        } else if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          triggerQuickAction('linkedin');
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          triggerQuickAction('email');
        } else if (e.key === '1') {
          e.preventDefault();
          switchMode('projects');
        } else if (e.key === '2') {
          e.preventDefault();
          switchMode('architecture');
        } else if (e.key === '3') {
          e.preventDefault();
          switchMode('compare');
        } else if (e.key === '4') {
          e.preventDefault();
          switchMode('ask');
        }
      }
    }
  });

  // Top search input live filtering
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    handleSearchInput(query);
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        addRecentSearch(query);
        if (activeMode === 'ask') {
          handleAskSubmit(query);
          searchInput.value = '';
        }
      }
    }
  });

  // Dedicated Ask Pane Input & Button
  askInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = askInput.value.trim();
      if (query) {
        handleAskSubmit(query);
        askInput.value = '';
      }
    }
  });

  askSubmitBtn?.addEventListener('click', () => {
    const query = askInput ? askInput.value.trim() : '';
    if (query) {
      handleAskSubmit(query);
      askInput.value = '';
    }
  });

  // Mode Card Switchers
  const modeCards = document.querySelectorAll('.workbench-mode-card');
  modeCards.forEach((card) => {
    card.addEventListener('click', () => {
      const mode = card.getAttribute('data-mode');
      if (mode) switchMode(mode);
    });
  });

  // Try Chips in Search Area
  const tryChips = document.querySelectorAll('.workbench-try-chip');
  tryChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query && searchInput) {
        searchInput.value = query;
        switchMode('projects');
        handleSearchInput(query);
        addRecentSearch(query);
      }
    });
  });

  // Suggested Questions Cards in Find Projects pane
  const questionCards = document.querySelectorAll('.workbench-question-card');
  questionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const q = card.getAttribute('data-question') || card.querySelector('.workbench-question-text')?.textContent?.trim();
      if (q) {
        switchMode('ask');
        handleAskSubmit(q);
      }
    });
  });

  // Ask Chips (Suggested question chips inside Ask pane)
  const askChips = document.querySelectorAll('[data-ask]');
  askChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-ask') || chip.textContent.trim();
      if (q) {
        switchMode('ask');
        handleAskSubmit(q);
      }
    });
  });

  // Architecture Project Selector
  const archSelect = document.getElementById('workbench-arch-project-select');
  archSelect?.addEventListener('change', (e) => {
    activeArchProjectId = e.target.value;
    activeArchStageIndex = 0;
    renderArchitectureFlow();
  });

  // Compare Selectors
  const compSelectA = document.getElementById('compare-select-a');
  const compSelectB = document.getElementById('compare-select-b');
  compSelectA?.addEventListener('change', () => renderComparisonMatrix());
  compSelectB?.addEventListener('change', () => renderComparisonMatrix());

  // Quick Action Buttons
  document.getElementById('quick-action-terminal')?.addEventListener('click', (e) => {
    e.preventDefault();
    triggerQuickAction('terminal');
  });

  document.getElementById('quick-action-resume')?.addEventListener('click', () => {
    closeWorkbench();
  });

  document.getElementById('quick-action-github')?.addEventListener('click', () => {
    closeWorkbench();
  });

  document.getElementById('quick-action-linkedin')?.addEventListener('click', () => {
    closeWorkbench();
  });

  document.getElementById('quick-action-email')?.addEventListener('click', () => {
    closeWorkbench();
  });

  // Recent Searches Clear
  document.getElementById('workbench-recent-clear')?.addEventListener('click', (e) => {
    e.preventDefault();
    recentSearches = [];
    renderRecentSearches();
  });
}

export function isWorkbenchOpen() {
  const modal = document.getElementById('workbench-modal');
  return modal ? modal.classList.contains('active') : false;
}

export function openWorkbench(targetMode = null) {
  const modal = document.getElementById('workbench-modal');
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (targetMode) {
    switchMode(targetMode);
  } else {
    // Refresh search results
    const input = document.getElementById('workbench-search-input');
    const q = input ? input.value.trim() : '';
    handleSearchInput(q);
  }

  // Focus search input
  setTimeout(() => {
    const input = document.getElementById('workbench-search-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 60);
}

export function closeWorkbench() {
  const modal = document.getElementById('workbench-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    try {
      lastFocusedElement.focus();
    } catch (e) {}
  }
}

export function toggleWorkbench() {
  if (isWorkbenchOpen()) {
    closeWorkbench();
  } else {
    openWorkbench();
  }
}

function switchMode(mode) {
  activeMode = mode;

  // Update mode cards
  document.querySelectorAll('.workbench-mode-card').forEach((card) => {
    const cardMode = card.getAttribute('data-mode');
    card.classList.toggle('active', cardMode === mode);
  });

  // Update view panes
  const panes = {
    projects: document.getElementById('workbench-pane-projects'),
    architecture: document.getElementById('workbench-pane-architecture'),
    compare: document.getElementById('workbench-pane-compare'),
    ask: document.getElementById('workbench-pane-ask')
  };

  Object.entries(panes).forEach(([key, pane]) => {
    if (pane) pane.classList.toggle('active', key === mode);
  });

  // Render view-specific content
  if (mode === 'architecture') {
    renderArchitectureFlow();
  } else if (mode === 'compare') {
    renderComparisonMatrix();
  } else if (mode === 'ask') {
    const askInput = document.getElementById('workbench-ask-input');
    setTimeout(() => askInput?.focus(), 80);
  }
}

function populateInitialData() {
  populateArchitectureSelector();
  populateCompareSelectors();
  renderRecentSearches();
  renderArchitectureFlow();
  renderSearchResults(Object.values(projectsMap), '');
}

/* ==========================================================================
   MODE 1: FIND PROJECTS (SEARCH ENGINE)
   ========================================================================== */

function handleSearchInput(query) {
  const cleanQ = (query || '').toLowerCase().trim();
  const queryDisplay = document.getElementById('workbench-query-display');
  if (queryDisplay) {
    queryDisplay.textContent = cleanQ ? `"${cleanQ}"` : '"all"';
  }

  if (activeMode !== 'projects' && cleanQ.length > 0) {
    switchMode('projects');
  }

  const allProjects = Object.values(projectsMap);
  if (!cleanQ) {
    renderSearchResults(allProjects, '');
    return;
  }

  // Multi-field intelligent matching
  const matched = allProjects.filter((p) => {
    const title = (p.title || '').toLowerCase();
    const sub = (p.subtitle || '').toLowerCase();
    const overview = (p.overview || '').toLowerCase();
    const problem = (p.problem || '').toLowerCase();
    const solution = (p.solution || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const tags = (p.tags || []).join(' ').toLowerCase();
    const tech = (p.techStackDetailed || []).map((t) => t.name).join(' ').toLowerCase();
    const arch = (p.architecture || []).join(' ').toLowerCase();
    const features = (p.keyFeatures || []).join(' ').toLowerCase();
    const impact = (p.quantifiableImpact || []).map((i) => `${i.value} ${i.label}`).join(' ').toLowerCase();

    return (
      title.includes(cleanQ) ||
      sub.includes(cleanQ) ||
      overview.includes(cleanQ) ||
      problem.includes(cleanQ) ||
      solution.includes(cleanQ) ||
      category.includes(cleanQ) ||
      tags.includes(cleanQ) ||
      tech.includes(cleanQ) ||
      arch.includes(cleanQ) ||
      features.includes(cleanQ) ||
      impact.includes(cleanQ)
    );
  });

  renderSearchResults(matched, cleanQ);
}

function renderSearchResults(projects, query) {
  const container = document.getElementById('workbench-results-list');
  const countEl = document.getElementById('workbench-results-count');

  if (countEl) {
    countEl.textContent = `${projects.length} result${projects.length === 1 ? '' : 's'}`;
  }

  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `
      <div style="padding: 32px 16px; text-align: center; color: #7E8581; font-family: var(--font-mono);">
        <i class="fas fa-search" style="font-size: 22px; color: #F45135; margin-bottom: 10px; display: block;"></i>
        <div style="font-size: 13px; color: #D8DFD6; margin-bottom: 4px;">No projects found matching "${query}"</div>
        <div style="font-size: 11px;">Try searching for <code>rag</code>, <code>aws</code>, <code>docker</code>, <code>pipeline</code>, or <code>mlops</code>.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = projects
    .map((p) => {
      const tags = (p.tags || []).slice(0, 4);
      const thumb = p.heroImage || 'assets/projects/enterprise_rag_agent.png';

      return `
        <div class="workbench-project-item" data-project-id="${p.id}" tabindex="0" role="button" aria-label="View project ${p.title}">
          <div class="workbench-project-info">
            <img src="${thumb}" alt="${p.title}" class="workbench-project-thumb" onerror="this.src='src/assets/Display-picture.jpg'" />
            <div class="workbench-project-text">
              <h4 class="workbench-project-title">${p.title}</h4>
              <p class="workbench-project-sub">${p.subtitle || p.overview}</p>
              <div class="workbench-tags-row">
                ${tags
                  .map(
                    (tag, idx) =>
                      `<span class="workbench-tag ${idx === 0 ? 'accent-tag' : ''}">${tag}</span>`
                  )
                  .join('')}
              </div>
            </div>
          </div>
          <span class="workbench-project-action">View project &rarr;</span>
        </div>
      `;
    })
    .join('');

  // Wire click & enter handlers to navigate directly to the specific project in System Studio
  container.querySelectorAll('.workbench-project-item').forEach((item) => {
    const handleSelect = () => {
      const id = item.getAttribute('data-project-id');
      if (id) {
        navigateToProject(id);
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

function navigateToProject(projectId) {
  closeWorkbench();

  // Clean navigation with smooth transition avoiding modal close race conditions
  setTimeout(() => {
    openProjectInStudio(projectId);
  }, 100);
}

// Global hook for chat buttons or external triggers
if (typeof window !== 'undefined') {
  window.workbenchNavigateToProject = navigateToProject;
}

/* ==========================================================================
   MODE 2: ARCHITECTURE INSPECTOR (ALL 10 PROJECTS)
   ========================================================================== */

function populateArchitectureSelector() {
  const select = document.getElementById('workbench-arch-project-select');
  if (!select) return;

  const projects = Object.values(projectsMap).filter(
    (p) => p && p.architectureStages && p.architectureStages.length > 0
  );

  const available = projects.length > 0 ? projects : Object.values(projectsMap);

  select.innerHTML = available
    .map(
      (p) => `<option value="${p.id}" ${p.id === activeArchProjectId ? 'selected' : ''}>${p.title}</option>`
    )
    .join('');

  if (!available.some((p) => p.id === activeArchProjectId)) {
    activeArchProjectId = available[0]?.id || 'enterprise_rag';
    select.value = activeArchProjectId;
  } else {
    select.value = activeArchProjectId;
  }
}

function renderArchitectureFlow() {
  const project = projectsMap[activeArchProjectId];
  if (!project) return;

  const stages = project.architectureStages || [];
  const flowContainer = document.getElementById('workbench-arch-flow');
  const detailContainer = document.getElementById('workbench-arch-detail');

  if (!flowContainer || !detailContainer) return;

  if (stages.length === 0) {
    flowContainer.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 28px 16px; text-align: center; color: #7E8581; font-family: var(--font-mono);">
        <i class="fas fa-info-circle" style="font-size: 20px; color: #F45135; margin-bottom: 8px; display: block;"></i>
        <div style="color: #D8DFD6; margin-bottom: 4px;">Detailed architecture diagram is currently unavailable for ${project.title}.</div>
        <div style="font-size: 11px;">You can view project details directly in System Studio.</div>
        <button class="workbench-tag accent-tag" style="margin-top: 12px; cursor: pointer;" onclick="window.workbenchNavigateToProject('${project.id}')">
          Open in System Studio &rarr;
        </button>
      </div>
    `;
    detailContainer.innerHTML = '';
    return;
  }

  // Ensure activeArchStageIndex is within bounds
  if (activeArchStageIndex >= stages.length) {
    activeArchStageIndex = 0;
  }

  // Render interactive stage nodes
  flowContainer.innerHTML = stages
    .map((s, idx) => {
      const isActive = idx === activeArchStageIndex;
      return `
        <div class="workbench-stage-node ${isActive ? 'active' : ''}" data-stage-idx="${idx}" tabindex="0" role="button" aria-label="Inspect stage 0${s.stageNumber || idx + 1}: ${s.name}">
          <div class="workbench-stage-top">
            <span class="workbench-stage-num">0${s.stageNumber || idx + 1}</span>
            <span class="workbench-stage-category">${s.category || 'STAGE'}</span>
          </div>
          <h5 class="workbench-stage-title">${s.name}</h5>
        </div>
      `;
    })
    .join('');

  // Wire stage node click and keyboard events
  flowContainer.querySelectorAll('.workbench-stage-node').forEach((node) => {
    const handleStageSelect = () => {
      activeArchStageIndex = parseInt(node.getAttribute('data-stage-idx'), 10) || 0;
      renderArchitectureFlow();
    };

    node.addEventListener('click', handleStageSelect);
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStageSelect();
      }
    });
  });

  // Render active stage detail card
  const stage = stages[activeArchStageIndex] || stages[0];
  const techList = stage.tech || stage.technologies || [];
  const techPills = techList
    .map((t) => `<span class="workbench-tag accent-tag">${t}</span>`)
    .join(' ');

  detailContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; flex-wrap: wrap; gap: 8px;">
      <div>
        <span style="font-family: var(--font-mono); font-size: 11px; color: #F45135;">STAGE 0${stage.stageNumber || activeArchStageIndex + 1} &middot; ${stage.category || 'PROCESSING'}</span>
        <h4 style="font-family: var(--font-display); font-size: 15px; color: #FFF; margin: 2px 0 0 0;">${stage.name}</h4>
      </div>
      <div style="display: flex; gap: 4px; flex-wrap: wrap;">${techPills}</div>
    </div>

    <div class="workbench-detail-row">
      <span class="workbench-detail-label">Inputs</span>
      <span class="workbench-detail-value">${stage.inputs || 'Verified pipeline inputs'}</span>
    </div>

    <div class="workbench-detail-row">
      <span class="workbench-detail-label">Outputs</span>
      <span class="workbench-detail-value">${stage.outputs || 'Verified stage outputs'}</span>
    </div>

    <div class="workbench-detail-row">
      <span class="workbench-detail-label">Component Responsibility</span>
      <span class="workbench-detail-value">${stage.responsibility || stage.responsibilities || 'Documented system responsibility'}</span>
    </div>

    <div class="workbench-detail-row">
      <span class="workbench-detail-label">Verified Engineering Decision</span>
      <span class="workbench-detail-value" style="color: #F0F0EB; font-style: italic;">"${stage.engineeringDecision || stage.engineeringDecisions || 'Documented engineering trade-off'}"</span>
    </div>

    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: flex-end;">
      <button class="workbench-tag" style="cursor: pointer;" onclick="window.workbenchNavigateToProject('${project.id}')">
        Inspect Complete System in Studio &rarr;
      </button>
    </div>
  `;
}

/* ==========================================================================
   MODE 3: COMPARE PROJECTS
   ========================================================================== */

function populateCompareSelectors() {
  const selectA = document.getElementById('compare-select-a');
  const selectB = document.getElementById('compare-select-b');
  if (!selectA || !selectB) return;

  const projects = Object.values(projectsMap);
  const optionsHtml = projects
    .map((p) => `<option value="${p.id}">${p.title}</option>`)
    .join('');

  selectA.innerHTML = optionsHtml;
  selectB.innerHTML = optionsHtml;

  selectA.value = 'enterprise_rag';
  selectB.value = 'mlops';
}

function renderComparisonMatrix() {
  const selectA = document.getElementById('compare-select-a');
  const selectB = document.getElementById('compare-select-b');
  const container = document.getElementById('workbench-compare-matrix');
  if (!selectA || !selectB || !container) return;

  const pA = projectsMap[selectA.value] || Object.values(projectsMap)[0];
  const pB = projectsMap[selectB.value] || Object.values(projectsMap)[1];
  if (!pA || !pB) return;

  const renderCol = (p) => {
    const tech = (p.tags || []).slice(0, 4).map((t) => `<span class="workbench-tag">${t}</span>`).join(' ');
    const impact = (p.quantifiableImpact || []).map((i) => `<li><strong>${i.value}</strong> ${i.label}</li>`).join('');

    return `
      <div class="workbench-compare-column">
        <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px;">
          <span style="font-family: var(--font-mono); font-size: 10px; color: #F45135; text-transform: uppercase;">${p.category}</span>
          <h4 style="font-family: var(--font-display); font-size: 14.5px; color: #FFF; margin: 2px 0 6px 0;">${p.title}</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">${tech}</div>
        </div>

        <div class="workbench-detail-row">
          <span class="workbench-detail-label">Problem Solved</span>
          <span class="workbench-detail-value">${p.problem || 'Standardized problem domain.'}</span>
        </div>

        <div class="workbench-detail-row">
          <span class="workbench-detail-label">Architectural Solution</span>
          <span class="workbench-detail-value">${p.solution || 'Modular system architecture.'}</span>
        </div>

        <div class="workbench-detail-row">
          <span class="workbench-detail-label">Verified Impact</span>
          <ul style="padding-left: 16px; margin: 0; font-size: 11.5px; color: #D8DFD6; line-height: 1.45;">
            ${impact || '<li>Documented engineering metrics.</li>'}
          </ul>
        </div>

        <div style="margin-top: auto; padding-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="workbench-tag accent-tag" style="cursor: pointer;" onclick="window.workbenchNavigateToProject('${p.id}')">
            View in Studio &rarr;
          </button>
          ${p.links?.github ? `<a href="${p.links.github}" target="_blank" rel="noopener" class="workbench-tag" style="text-decoration: none;"><i class="fab fa-github"></i> GitHub</a>` : ''}
          ${p.links?.demo ? `<a href="${p.links.demo}" target="_blank" rel="noopener" class="workbench-tag" style="text-decoration: none;"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
        </div>
      </div>
    `;
  };

  container.innerHTML = `${renderCol(pA)}${renderCol(pB)}`;
}

/* ==========================================================================
   MODE 4: ASK ABOUT MY WORK (GROUNDED DIGITAL TWIN)
   ========================================================================== */

function handleAskSubmit(questionText) {
  const messagesContainer = document.getElementById('workbench-chat-messages');
  if (!messagesContainer || !questionText) return;

  // Append user message bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'workbench-chat-bubble user';
  userBubble.textContent = questionText;
  messagesContainer.appendChild(userBubble);
  messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });

  // Generate grounded answer
  const answer = generateGroundedAnswer(questionText);

  // Append assistant message bubble with slight delay for realistic feel
  setTimeout(() => {
    const aiBubble = document.createElement('div');
    aiBubble.className = 'workbench-chat-bubble assistant';
    aiBubble.innerHTML = answer;
    messagesContainer.appendChild(aiBubble);

    // Wire any project action buttons inside the answer
    aiBubble.querySelectorAll('[data-open-project]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = btn.getAttribute('data-open-project');
        if (pId) navigateToProject(pId);
      });
    });

    aiBubble.querySelectorAll('[data-inspect-arch]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pId = btn.getAttribute('data-inspect-arch');
        if (pId) {
          activeArchProjectId = pId;
          activeArchStageIndex = 0;
          switchMode('architecture');
        }
      });
    });

    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
  }, 100);
}

function normalizeQuery(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[?.,!/\\#@$%^&*()_+=\[\]{};:"'<>~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateGroundedAnswer(rawQuery) {
  const q = normalizeQuery(rawQuery);

  // 1. TCS Status & Employment Verification
  if (
    q.includes('tcs') ||
    q.includes('tata consultancy') ||
    q.includes('joining') ||
    q.includes('onboarding') ||
    q.includes('systems engineer') ||
    q.includes('current role') ||
    q.includes('current job') ||
    q.includes('work at tcs') ||
    (q.includes('offer') && !q.includes('certif'))
  ) {
    return `
      <strong>TCS Status & Verified Assessment Record:</strong><br/>
      Saketh accepted the competitive <strong>TCS Digital (Systems Engineer)</strong> offer following verified technical evaluations:<br/>
      &bull; <strong>TCS iON GET-IT:</strong> 89% score (Proficiency Certificate)<br/>
      &bull; <strong>TCS iON Cognitive NQT:</strong> 91.51% percentile<br/>
      &bull; <strong>Current Status:</strong> Offer accepted; Saketh is currently awaiting his official joining letter and onboarding schedule.<br/>
      <em>Note: He does <u>not</u> currently work as an active employee at TCS until official joining commences.</em>
    `;
  }

  // 2. IIIT Hyderabad Research Internship
  if (
    q.includes('iiit') ||
    q.includes('research') ||
    q.includes('hyderabad') ||
    q.includes('vad') ||
    q.includes('voice activity') ||
    q.includes('acoustic') ||
    q.includes('internship') ||
    q.includes('intern')
  ) {
    return `
      <strong>IIIT Hyderabad Research Internship (Nov 2024 &ndash; Jun 2025):</strong><br/>
      Saketh completed a 7-month documented AI/ML research internship at the International Institute of Information Technology, Hyderabad:<br/>
      &bull; <strong>Voice Activity Detection (VAD):</strong> Investigated signal processing &amp; deep learning algorithms for speech segment detection in severe acoustic noise.<br/>
      &bull; <strong>AI Video Summarization:</strong> Built automated summarization pipelines using acoustic and semantic cues.<br/>
      &bull; <strong>Acoustic Feature Extraction:</strong> Conducted quantitative evaluations across spectral representations.<br/>
      &bull; <strong>Verification:</strong> Official IIIT Hyderabad Research Certificate issued and verified on file.
    `;
  }

  // 3. Best ML Project / Strongest Engineering Projects / Highest Impact
  if (
    q.includes('best ml') ||
    q.includes('highest impact') ||
    q.includes('strongest ml') ||
    q.includes('top ml') ||
    q.includes('best project') ||
    q.includes('strongest project') ||
    q.includes('strongest engineering') ||
    q.includes('top project') ||
    q.includes('flagship') ||
    q.includes('favorite project') ||
    q.includes('recommended project')
  ) {
    return `
      <strong>Strongest Documented Engineering Projects:</strong><br/>
      Saketh's portfolio highlights two flagship production systems based on architecture depth and verified results:<br/><br/>
      <strong>1. Enterprise-Ready RAG Agent (AI Platform / GenAI):</strong><br/>
      &bull; PyMuPDF ingestion, table-to-Markdown restoration, dual vector search (FAISS + ChromaDB), Groq Llama 3.3 70B, arXiv paper routing, and page-level citation verification.<br/>
      &bull; <em>Impact:</em> ~80% reduction in hallucinations with &lt;5s query latency.<br/>
      <div style="margin: 6px 0 10px 0;">
        <button class="workbench-tag accent-tag" data-open-project="enterprise_rag" style="cursor: pointer;">Open Enterprise-RAG in Studio &rarr;</button>
      </div>
      <strong>2. Vehicle Insurance MLOps Pipeline (Cloud / MLOps):</strong><br/>
      &bull; Automated 6-stage delivery on AWS (EC2, S3, ECR) with MongoDB Atlas, schema validation, Docker containerization, and GitHub Actions CI/CD.<br/>
      &bull; <em>Impact:</em> 85% reduction in deployment time with zero-downtime releases.<br/>
      <div style="margin-top: 6px;">
        <button class="workbench-tag accent-tag" data-open-project="mlops" style="cursor: pointer;">Open Insurance MLOps in Studio &rarr;</button>
      </div>
    `;
  }

  // 4. AWS & Cloud Deployment Projects
  if (
    q.includes('aws') ||
    q.includes('cloud deployment') ||
    q.includes('cloud project') ||
    q.includes('ec2') ||
    q.includes('ecr') ||
    q.includes('s3') ||
    q.includes('amazon web services')
  ) {
    return `
      <strong>Projects Utilizing AWS &amp; Cloud Infrastructure:</strong><br/>
      &bull; <strong>Vehicle Insurance MLOps Pipeline:</strong> Production cloud pipeline utilizing AWS EC2 (self-hosted runner &amp; prediction API on port 5080), AWS S3 (model artifact benchmarking and versioning), AWS ECR (Docker container registry), and IAM authentication.<br/>
      &bull; <strong>Enterprise-Ready RAG Agent:</strong> Deployed cloud instance on Streamlit Cloud with Groq API cloud acceleration for 70B parameter models.<br/>
      <div style="margin-top: 8px; display: flex; gap: 8px;">
        <button class="workbench-tag accent-tag" data-open-project="mlops" style="cursor: pointer;">View MLOps AWS Architecture &rarr;</button>
        <button class="workbench-tag" data-open-project="enterprise_rag" style="cursor: pointer;">View RAG Cloud System &rarr;</button>
      </div>
    `;
  }

  // 5. RAG Architecture Explanation
  if (
    q.includes('rag') ||
    q.includes('retrieval augmented') ||
    q.includes('pdf') ||
    q.includes('llama 3') ||
    q.includes('chromadb') ||
    q.includes('faiss')
  ) {
    return `
      <strong>Enterprise-Ready RAG Agent Architecture:</strong><br/>
      A 6-stage retrieval-augmented generation pipeline engineered to eliminate LLM hallucinations:<br/>
      1. <strong>Document Ingestion:</strong> PyMuPDF extracts text streams with table-to-Markdown restoration.<br/>
      2. <strong>Semantic Chunking:</strong> Recursive chunking (~200&ndash;500 tokens) with 10&ndash;15% overlap.<br/>
      3. <strong>Dual Indexing:</strong> High-speed in-memory FAISS indexing alongside persistent ChromaDB collections.<br/>
      4. <strong>Intent Routing &amp; Retrieval:</strong> Branches between local document Q&A and automated arXiv paper discovery.<br/>
      5. <strong>Inference:</strong> Low-latency inference via Groq Llama 3.3 70B (or Google Gemini fallback).<br/>
      6. <strong>Citation Verification:</strong> Injects page-referenced source citations (~80% reduction in hallucinations).<br/>
      <div style="margin-top: 8px; display: flex; gap: 8px;">
        <button class="workbench-tag accent-tag" data-open-project="enterprise_rag" style="cursor: pointer;">Open in Studio &rarr;</button>
        <button class="workbench-tag" data-inspect-arch="enterprise_rag" style="cursor: pointer;">Inspect Architecture Stages &rarr;</button>
      </div>
    `;
  }

  // 6. MLOps Architecture Explanation
  if (
    q.includes('mlops') ||
    q.includes('insurance') ||
    q.includes('pipeline') ||
    q.includes('ci cd') ||
    q.includes('github actions')
  ) {
    return `
      <strong>Vehicle Insurance MLOps Pipeline Architecture:</strong><br/>
      An end-to-end continuous training &amp; deployment workflow on AWS:<br/>
      1. <strong>Cloud Ingestion:</strong> Automated ingestion from MongoDB Atlas.<br/>
      2. <strong>Schema Validation:</strong> Config-driven validation using schema rules to prevent drift.<br/>
      3. <strong>Transformation:</strong> Serialized preprocessor ensuring feature parity in inference.<br/>
      4. <strong>Model Evaluation:</strong> Automated promotion comparing candidates against S3 production benchmarks.<br/>
      5. <strong>Containerization:</strong> Docker container packaging prediction microservice.<br/>
      6. <strong>Automated CI/CD:</strong> GitHub Actions pushes to ECR and deploys to EC2 runner (85% faster releases).<br/>
      <div style="margin-top: 8px; display: flex; gap: 8px;">
        <button class="workbench-tag accent-tag" data-open-project="mlops" style="cursor: pointer;">Open in Studio &rarr;</button>
        <button class="workbench-tag" data-inspect-arch="mlops" style="cursor: pointer;">Inspect Architecture Stages &rarr;</button>
      </div>
    `;
  }

  // 7. Certifications & Verified Assessment Records
  if (
    q.includes('certif') ||
    q.includes('credential') ||
    q.includes('license') ||
    q.includes('nqt') ||
    q.includes('get it') ||
    q.includes('assessment') ||
    q.includes('score') ||
    q.includes('exam')
  ) {
    return `
      <strong>Verified Certifications &amp; Assessments:</strong><br/>
      <strong>Competitive Technical Assessments:</strong><br/>
      &bull; <strong>TCS iON NPT &ndash; GET IT:</strong> 89% score (Certificate of Proficiency)<br/>
      &bull; <strong>TCS iON NQT &ndash; Cognitive:</strong> 91.51% percentile<br/>
      &bull; <strong>TCS iON Psychometric Assessment:</strong> High Performance<br/>
      <strong>Language &amp; Academic Credentials:</strong><br/>
      &bull; <strong>British Council English:</strong> CEFR B1 (Speaking) / B2+ (Writing)<br/>
      &bull; <strong>IIIT Hyderabad AI/ML Research Certificate:</strong> Completed 7-month research internship<br/>
      <strong>Industry Simulations &amp; Cloud:</strong><br/>
      &bull; <strong>Deloitte Australia Data Analytics Simulation:</strong> Job simulation credential<br/>
      &bull; <strong>Tata Group Data Analytics Simulation:</strong> Job simulation credential<br/>
      &bull; <strong>AWS Cloud Practitioner Essentials:</strong> Course completion certificate
    `;
  }

  // 8. Tech Stack & Engineering Skills
  if (
    q.includes('tech stack') ||
    q.includes('technologies') ||
    q.includes('framework') ||
    q.includes('skills') ||
    q.includes('languages') ||
    q.includes('tools') ||
    q.includes('specialize in') ||
    q.includes('tech')
  ) {
    return `
      <strong>Core Technical Specializations:</strong><br/>
      &bull; <strong>Programming Languages:</strong> Python, JavaScript, SQL, HTML5, CSS3, C/C++<br/>
      &bull; <strong>AI / GenAI / ML:</strong> LangChain, FAISS, ChromaDB, Groq Llama 3.3 70B, Google Gemini API, PyTorch, TensorFlow/Keras, Scikit-Learn, OpenCV, NLTK, Stable Diffusion<br/>
      &bull; <strong>Cloud &amp; DevOps:</strong> AWS (EC2, ECR, S3), Docker Containerization, GitHub Actions CI/CD, Git, Streamlit<br/>
      &bull; <strong>Backend &amp; Databases:</strong> Flask RESTful APIs, JWT Auth &amp; RBAC, SQLite, MongoDB Atlas.
    `;
  }

  // 9. Education & Academic Background
  if (
    q.includes('education') ||
    q.includes('college') ||
    q.includes('degree') ||
    q.includes('jntuh') ||
    q.includes('university') ||
    q.includes('gpa') ||
    q.includes('cgpa') ||
    q.includes('btech') ||
    q.includes('b tech')
  ) {
    return `
      <strong>Academic Background:</strong><br/>
      &bull; <strong>Degree:</strong> Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering<br/>
      &bull; <strong>Institution:</strong> JNTUH University College of Engineering, Manthani (2021 &ndash; 2025)<br/>
      &bull; <strong>Cumulative GPA:</strong> 7.47 / 10.0<br/>
      &bull; <strong>Leadership:</strong> College Fest Coordinator &middot; Lead Technical Coordinator (headed tech infrastructure and hack tracks).
    `;
  }

  // 10. Contact Information
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('phone') ||
    q.includes('reach out') ||
    q.includes('hire')
  ) {
    return `
      <strong>Contact &amp; Profiles:</strong><br/>
      &bull; <strong>Email:</strong> <a href="mailto:saketh1805@gmail.com" style="color: #F45135;">saketh1805@gmail.com</a><br/>
      &bull; <strong>Phone:</strong> +91 8688791352<br/>
      &bull; <strong>GitHub:</strong> <a href="https://github.com/sakethlingerker" target="_blank" rel="noopener" style="color: #F45135;">github.com/sakethlingerker</a><br/>
      &bull; <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/sakethlingerker/" target="_blank" rel="noopener" style="color: #F45135;">linkedin.com/in/sakethlingerker</a>
    `;
  }

  // Honest fallback for unverified queries
  return `I don't have verified information about that in Saketh's portfolio. You can ask about his projects, architecture decisions, tech stack, research internship at IIIT Hyderabad, TCS status, or verified credentials.`;
}

/* ==========================================================================
   QUICK ACTIONS & RECENT SEARCHES
   ========================================================================== */

function triggerQuickAction(action) {
  closeWorkbench();

  if (action === 'terminal') {
    const term = document.getElementById('portfolio-terminal');
    const input = document.getElementById('terminal-input');
    if (term) {
      term.classList.add('active');
      setTimeout(() => input?.focus(), 80);
    }
  } else if (action === 'resume') {
    const link = document.createElement('a');
    link.href = 'assets/Saketh_Lingerker_8688791352.pdf';
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
  } else if (action === 'github') {
    window.open('https://github.com/sakethlingerker', '_blank', 'noopener');
  } else if (action === 'linkedin') {
    window.open('https://www.linkedin.com/in/sakethlingerker/', '_blank', 'noopener');
  } else if (action === 'email') {
    window.location.href = 'mailto:saketh1805@gmail.com';
  }
}

function addRecentSearch(query) {
  if (!query) return;
  const filtered = recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
  recentSearches = [query, ...filtered].slice(0, 5);
  renderRecentSearches();
}

function renderRecentSearches() {
  const container = document.getElementById('workbench-recent-list');
  if (!container) return;

  if (recentSearches.length === 0) {
    container.innerHTML = `<span style="font-size: 11px; color: #5E6561; font-family: var(--font-mono); padding: 4px 8px;">No recent searches</span>`;
    return;
  }

  container.innerHTML = recentSearches
    .map(
      (s) => `
      <button class="workbench-recent-item" data-query="${s}">
        <span>${s}</span>
        <i class="fas fa-arrow-right"></i>
      </button>
    `
    )
    .join('');

  container.querySelectorAll('.workbench-recent-item').forEach((item) => {
    item.addEventListener('click', () => {
      const q = item.getAttribute('data-query');
      if (q) {
        const input = document.getElementById('workbench-search-input');
        if (input) {
          input.value = q;
          switchMode('projects');
          handleSearchInput(q);
        }
      }
    });
  });
}
