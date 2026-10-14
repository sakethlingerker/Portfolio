/**
 * Engineering Workbench Controller Module
 * Dark Cinematic Diagnostic & Investigation Suite (<SL /> Branding)
 * Modes: Find Projects, Inspect Architecture, Compare Projects, Ask About My Work
 */

import { loadProjectsData } from './projects-data.js';
import { openProjectInStudio } from './projects.js';
import { createPortfolioChat } from './workbench-chat.js';

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
let portfolioChat = null;
let chatSubmissionQueue = Promise.resolve();
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

  portfolioChat = createPortfolioChat(() => projectsMap, VERIFIED_KNOWLEDGE_BASE);
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
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      const query = askInput.value.trim();
      if (query) {
        handleAskSubmit(query);
        askInput.value = '';
        askInput.style.height = '';
      }
    }
  });

  askInput?.addEventListener('input', () => {
    askInput.style.height = 'auto';
    askInput.style.height = Math.min(112, Math.max(38, askInput.scrollHeight)) + 'px';
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
  const question = String(questionText || '').trim();
  const messagesContainer = document.getElementById('workbench-chat-messages');
  if (!messagesContainer || !question) return;

  if (!portfolioChat) {
    portfolioChat = createPortfolioChat(() => projectsMap, VERIFIED_KNOWLEDGE_BASE);
  }

  const userBubble = document.createElement('div');
  userBubble.className = 'workbench-chat-bubble user';
  userBubble.textContent = question;
  userBubble.setAttribute('dir', 'auto');
  messagesContainer.appendChild(userBubble);

  const assistantBubble = document.createElement('div');
  assistantBubble.className = 'workbench-chat-bubble assistant is-typing';
  assistantBubble.dataset.typing = 'true';
  assistantBubble.setAttribute('role', 'status');
  assistantBubble.setAttribute('aria-label', 'Generating response');
  assistantBubble.innerHTML = '<span class="workbench-typing-indicator" aria-hidden="true"><span></span><span></span><span></span></span>';
  messagesContainer.appendChild(assistantBubble);
  scrollChatToLatest(messagesContainer);

  // Queue messages in order so conversation references resolve deterministically.
  chatSubmissionQueue = chatSubmissionQueue
    .then(() => new Promise((resolve) => window.setTimeout(resolve, 280)))
    .then(() => {
      const result = portfolioChat.answer(question);
      assistantBubble.innerHTML = result.html;
      assistantBubble.removeAttribute('data-typing');
      assistantBubble.removeAttribute('aria-label');
      assistantBubble.classList.remove('is-typing');
      bindChatActions(assistantBubble);
      scrollChatToLatest(messagesContainer);
    })
    .catch((error) => {
      console.error('Workbench chat response error:', error);
      assistantBubble.textContent = 'A response could not be generated from the available portfolio data.';
      assistantBubble.removeAttribute('data-typing');
      assistantBubble.removeAttribute('aria-label');
      assistantBubble.classList.remove('is-typing');
      scrollChatToLatest(messagesContainer);
    });
}

function scrollChatToLatest(container) {
  if (!container) return;
  window.requestAnimationFrame(() => {
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  });
}

function bindChatActions(messageBubble) {
  messageBubble.querySelectorAll('[data-open-project]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const projectId = button.getAttribute('data-open-project');
      if (projectId) navigateToProject(projectId);
    });
  });

  messageBubble.querySelectorAll('[data-inspect-arch]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const projectId = button.getAttribute('data-inspect-arch');
      if (!projectId) return;
      activeArchProjectId = projectId;
      activeArchStageIndex = 0;
      const selector = document.getElementById('workbench-arch-project-select');
      if (selector) selector.value = projectId;
      switchMode('architecture');
    });
  });
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
