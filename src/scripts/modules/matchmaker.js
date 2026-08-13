import { loadProjectsData, getProjectsList, getProjectById } from './projects-data.js';

let userAnswers = {};

export async function initMatchmaker() {
    // Expose functions to global scope for HTML onclick attributes
    window.handleQuizAnswer = handleQuizAnswer;
    window.resetQuiz = resetQuiz;

    // Pre-fetch projects data
    await loadProjectsData();
}

function handleQuizAnswer(step, answer) {
    userAnswers[`q${step}`] = answer;
    
    // Update Progress
    const progressFill = document.getElementById('quiz-progress-fill');
    if (progressFill) progressFill.style.width = `${(step / 2) * 100}%`;

    if (step === 1) {
        // Show Question 2 with dynamic options based on Q1
        const q2Text = document.getElementById('quiz-q2-text');
        const q2Options = document.getElementById('quiz-q2-options');
        
        const step1 = document.getElementById('quiz-step-1');
        const step2 = document.getElementById('quiz-step-2');
        if (step1) step1.classList.remove('active');
        if (step2) step2.classList.add('active');
        
        if (answer === 'genai') {
            if (q2Text) q2Text.textContent = "What interests you most?";
            if (q2Options) {
                q2Options.innerHTML = `
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'resume')">
                        <i class="fas fa-file-alt"></i>
                        <span>Automating Resume Optimization</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'visual')">
                        <i class="fas fa-palette"></i>
                        <span>Visual Design & Creativity</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'language')">
                        <i class="fas fa-language"></i>
                        <span>Global Language Detection</span>
                    </button>
                `;
            }
        } else if (answer === 'ml_data') {
            if (q2Text) q2Text.textContent = "What interests you most?";
            if (q2Options) {
                q2Options.innerHTML = `
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'financial')">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Predicting Financial/Travel Costs</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'agriculture')">
                        <i class="fas fa-seedling"></i>
                        <span>Optimizing Agriculture Output</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'environmental')">
                        <i class="fas fa-leaf"></i>
                        <span>Visualizing Environmental Impact</span>
                    </button>
                `;
            }
        } else {
            if (q2Text) q2Text.textContent = "What interests you most?";
            if (q2Options) {
                q2Options.innerHTML = `
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'backend')">
                        <i class="fas fa-database"></i>
                        <span>Complex Backend & Analytics</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'frontend')">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Frontend UX & APIs</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'cloud')">
                        <i class="fas fa-cloud"></i>
                        <span>Cloud Infra & CI/CD Pipelines</span>
                    </button>
                `;
            }
        }
    } else if (step === 2) {
        // Show results with best matching project from projects.json
        showResult();
    }
}

function showResult() {
    const step2 = document.getElementById('quiz-step-2');
    const resultStep = document.getElementById('quiz-result-step');
    if (step2) step2.classList.remove('active');
    if (resultStep) resultStep.classList.add('active');
    
    // Mapping key to project ID in projects.json
    const idMap = {
        'genai_resume': 'ats_resume',
        'genai_visual': 'interior_design',
        'genai_language': 'polyglot',
        'ml_data_financial': 'flight_fare',
        'ml_data_agriculture': 'crop_yield',
        'ml_data_environmental': 'clearview',
        'engineering_backend': 'smart_feedback',
        'engineering_frontend': 'cloudcast',
        'engineering_cloud': 'mlops'
    };
    
    const mappingKey = `${userAnswers.q1}_${userAnswers.q2}`;
    const targetProjectId = idMap[mappingKey];
    
    let matchedProject = getProjectById(targetProjectId);
    if (!matchedProject) {
        const allList = getProjectsList();
        matchedProject = allList[0] || null;
    }
    
    const display = document.getElementById('quiz-recommendation-display');
    if (!display || !matchedProject) return;

    const githubLink = matchedProject.links?.github || matchedProject.links?.caseStudy || '#';
    const tagsHtml = (matchedProject.tags || []).slice(0, 4).map(tag => `<span class="result-tag">${tag}</span>`).join('');

    display.innerHTML = `
        <div class="quiz-results-header">
            <i class="fas fa-check-circle" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 1rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Perfect Match Found!</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Based on your interests, here's your best project match
            </p>
        </div>
        
        <div class="single-result-container">
            <div class="quiz-result-card featured-match">
                <div class="relevance-badge">Perfect Match</div>
                <h4 class="result-card-title">${matchedProject.title}</h4>
                <p class="result-card-description">${matchedProject.subtitle || matchedProject.overview}</p>
                <div class="result-card-tags">
                    ${tagsHtml}
                </div>
                <a href="${githubLink}" target="_blank" rel="noopener noreferrer" 
                   class="result-card-btn">
                    <i class="fab fa-github"></i> View Project
                </a>
            </div>
        </div>
    `;
    
    const restartBtn = document.querySelector('#quiz-result-step .primary-btn');
    if (restartBtn) restartBtn.style.display = 'inline-block';
}

function resetQuiz() {
    userAnswers = {};
    const resultStep = document.getElementById('quiz-result-step');
    const step2 = document.getElementById('quiz-step-2');
    const step1 = document.getElementById('quiz-step-1');
    if (resultStep) resultStep.classList.remove('active');
    if (step2) step2.classList.remove('active');
    if (step1) step1.classList.add('active');
    
    const progressFill = document.getElementById('quiz-progress-fill');
    if (progressFill) progressFill.style.width = '0%';
}
