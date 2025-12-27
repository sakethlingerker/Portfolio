export function initProjects() {
  // Projects: Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");

  function updateProjectVisibility() {
    const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
    
    document.querySelectorAll(".project-card").forEach((card) => {
      const category = card.getAttribute("data-category");
      const matchesFilter = activeFilter === "all" || category === activeFilter;
      
      if (matchesFilter) {
        card.classList.remove("hide");
        card.classList.add("show");
      } else {
        card.classList.add("hide");
        card.classList.remove("show");
      }
    });
    // Assuming AOS is global or we need to handle it. AOS should be globally available if imported in main.
    if(window.AOS) setTimeout(() => window.AOS.refresh(), 100);
  }

  filterBtns.forEach(btn => btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateProjectVisibility();
  }));

  // Quiz Logic
  initQuiz();
}

function initQuiz() {
  // ===== Project Matchmaker (9-Project Decision Tree) =====
  let quizHistory = {}; 

  // Attach handleQuizAnswer to window so inline onclicks work, 
  // OR refactor HTML to not use onclick="handleQuizAnswer(...)".
  // For this refactor, attaching to window is the path of least resistance for now,
  // but ideally we should attach event listeners in JS. 
  // Let's refactor to window for backward compatibility with existing HTML structure if we don't change HTML.
  // The user asked to split JS, not rewrite all HTML structure. 
  
  window.handleQuizAnswer = function(step, value) {
    const step1 = document.getElementById("quiz-step-1");
    const step2 = document.getElementById("quiz-step-2");
    
    // Step 1: Broad Domain
    if (step === 1) {
      quizHistory.domain = value;
      transitionToStep(step1, step2, 66);
      
      const q2Text = document.getElementById("quiz-q2-text");
      const q2Options = document.getElementById("quiz-q2-options");
      if(q2Options) q2Options.innerHTML = "";

      // Branch 1: Generative AI & NLP
      if (value === 'genai') {
        if(q2Text) q2Text.innerText = "What specific problem intrigues you?";
        if(q2Options) q2Options.innerHTML = `
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'resume')">
            <i class="fas fa-file-alt"></i> <span>Automating Resume Optimization</span>
          </button>
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'vision')">
            <i class="fas fa-paint-brush"></i> <span>Visual Design & Creativity</span>
          </button>
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'lang')">
            <i class="fas fa-language"></i> <span>Global Language Detection</span>
          </button>
        `;
      } 
      // Branch 2: Predictive ML & Data
      else if (value === 'ml_data') {
        if(q2Text) q2Text.innerText = "Choose a data challenge:";
        if(q2Options) q2Options.innerHTML = `
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'flight')">
            <i class="fas fa-plane"></i> <span>Predicting Financial/Travel Costs</span>
          </button>
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'crop')">
            <i class="fas fa-seedling"></i> <span>Optimizing Agriculture Output</span>
          </button>
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'air')">
            <i class="fas fa-wind"></i> <span>Visualizing Environmental Impact</span>
          </button>
        `;
      }
      // Branch 3: Web Engineering & MLOps
      else if (value === 'engineering') {
        if(q2Text) q2Text.innerText = "What is your preferred focus?";
        if(q2Options) q2Options.innerHTML = `
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'backend')">
            <i class="fas fa-database"></i> <span>Complex Backend & Analytics</span>
          </button>
           <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'frontend')">
            <i class="fas fa-cloud-sun"></i> <span>Frontend UX & APIs</span>
          </button>
          <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'ops')">
            <i class="fas fa-cogs"></i> <span>Cloud Infra & CI/CD Pipelines</span>
          </button>
        `;
      }
    } 
    // Step 2: Specific Project Selection
    else if (step === 2) {
      if (quizHistory.domain === 'genai') {
        if (value === 'resume') showRecommendation("ats_resume");
        else if (value === 'vision') showRecommendation("interior_design");
        else if (value === 'lang') showRecommendation("polyglot");
      } 
      else if (quizHistory.domain === 'ml_data') {
        if (value === 'flight') showRecommendation("flight_fare");
        else if (value === 'crop') showRecommendation("crop_yield");
        else if (value === 'air') showRecommendation("clearview");
      }
      else if (quizHistory.domain === 'engineering') {
        if (value === 'backend') showRecommendation("smart_feedback");
        else if (value === 'frontend') showRecommendation("cloudcast");
        else if (value === 'ops') showRecommendation("mlops");
      }
    }
  };

  function transitionToStep(from, to, progressVal) {
    const progress = document.getElementById("quiz-progress-fill");
    from.classList.remove("active");
    setTimeout(() => {
        from.style.display = "none";
        to.style.display = "block";
        setTimeout(() => to.classList.add("active"), 50);
    }, 400);
    if(progress) progress.style.width = `${progressVal}%`;
  }

  function showRecommendation(projectKey) {
    const step1 = document.getElementById("quiz-step-1");
    const step2 = document.getElementById("quiz-step-2");
    const resultStep = document.getElementById("quiz-result-step");
    const recDisplay = document.getElementById("quiz-recommendation-display");
    const progress = document.getElementById("quiz-progress-fill");

    // Full 9-Project Data
    // Fetch project data (now dynamic)
    fetch('./data/projects.json')
      .then(response => response.json())
      .then(projects => {
        const rec = projects[projectKey];
        if (!rec) {
            console.error("Project not found:", projectKey);
            return;
        }

        // Build Card (Reference Style)
        // Parse Markdown Bold
        const formattedDesc = rec.desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        recDisplay.innerHTML = `
          <div class="recommend-card fade-up">
            <div class="result-header">
               <!-- Accent Line Removed -->
               <h2 class="result-heading">You should check out...</h2>
            </div>
            
            <h3 class="result-project-title">${rec.title}</h3>
            
            <p class="result-description">${formattedDesc}</p>
            
            <div class="result-actions">
               <a href="${rec.link}" target="_blank" class="btn result-btn primary-result-btn">${rec.btnText || "View Project"}</a>
               <button onclick="resetQuiz()" class="btn result-btn secondary-result-btn">Restart Quiz</button>
            </div>
          </div>
        `;

        // Hide Current Steps
        step1.classList.remove("active");
        step2.classList.remove("active");
        step1.style.display = "none";
        step2.style.display = "none";

        // Show Result
        resultStep.style.display = "block";
        setTimeout(() => resultStep.classList.add("active"), 50);
        
        if(progress) progress.style.width = "100%";
      })
      .catch(error => console.error('Error loading project data:', error));

    // const projects = { ... } was removed.
    // The rest of the synchronous logic was moved inside .then() or handled there.
    // logic below this block needs to be removed or adjusted as it depended on 'rec' being available synchronously.


    // Logic moved to fetch callback
  }

  window.resetQuiz = function() {
    const step1 = document.getElementById("quiz-step-1");
    const step2 = document.getElementById("quiz-step-2");
    const resultStep = document.getElementById("quiz-result-step");
    const progress = document.getElementById("quiz-progress-fill");

    if (step2) step2.classList.remove("active");
    if (resultStep) resultStep.classList.remove("active");
    
    if(step2) step2.style.display = "none";
    if(resultStep) resultStep.style.display = "none";
    
    if(step1) {
        step1.style.display = "block";
        setTimeout(() => step1.classList.add("active"), 50);
    }

    quizHistory = {}; // Reset history
    if(progress) progress.style.width = "33%";
  };

  // Quiz Modal Launchers
  const quizModal = document.getElementById("quiz-modal");
  document.getElementById("quiz-toggle")?.addEventListener("click", () => {
    quizModal.classList.add("open");
  });
  
  document.getElementById("close-quiz")?.addEventListener("click", () => quizModal.classList.remove("open"));

  // Simple Quiz (Old, if exists)
  const quizR = document.getElementById("quiz-result");
  if(quizR) {
    // Legacy support if there was another quiz logic
  }
}
