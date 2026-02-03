export function initMatchmaker() {
    // Expose functions to global scope for HTML onclick attributes
    window.handleQuizAnswer = handleQuizAnswer;
    window.resetQuiz = resetQuiz;
}

// Comprehensive project database with GitHub links and relevance scores
const projectsDatabase = [
    {
        title: "ATS Resume Expert Pro",
        description: "AI-powered resume optimizer using GPT-4 for ATS compatibility and job matching",
        tags: ["Gen AI", "GPT-4", "Python", "Streamlit"],
        github: "https://github.com/sakethlingerker/ATS",
        category: "ai",
        scores: { ai: 95, web: 25, data: 35, innovation: 95, technical: 85, realworld: 90 }
    },
    {
        title: "AI Virtual Interior Designer",
        description: "Transform room designs with AI-powered interior visualization and style recommendations",
        tags: ["Computer Vision", "Gen AI", "Python"],
        github: "https://github.com/sakethlingerker/AI-Interior-Designer",
        category: "ai",
        scores: { ai: 90, web: 30, data: 25, innovation: 92, technical: 80, realworld: 85 }
    },
    {
        title: "Polyglot AI",
        description: "Multi-language translation and conversation assistant powered by advanced NLP models",
        tags: ["NLP", "Translation", "AI"],
        github: "https://github.com/sakethlingerker/Polyglot-AI",
        category: "ai",
        scores: { ai: 88, web: 35, data: 30, innovation: 85, technical: 75, realworld: 88 }
    },
    {
        title: "Smart Feedback Collection System",
        description: "Intelligent feedback analysis with sentiment detection and automated categorization",
        tags: ["Full Stack", "NLP", "React", "MongoDB"],
        github: "https://github.com/sakethlingerker/FeedBack",
        category: "web",
        scores: { ai: 45, web: 95, data: 50, innovation: 75, technical: 88, realworld: 92 }
    },
    {
        title: "Real-Time Flight Fare Prediction",
        description: "ML-powered application predicting flight prices with 92% accuracy for smart booking",
        tags: ["Machine Learning", "Flask", "Python"],
        github: "https://github.com/sakethlingerker/Flight-Fare-Prediction",
        category: "web",
        scores: { ai: 55, web: 85, data: 75, innovation: 70, technical: 80, realworld: 95 }
    },
    {
        title: "Cloudcast - Advanced Weather App",
        description: "Real-time weather monitoring with detailed forecasts and interactive visualizations",
        tags: ["API Integration", "JavaScript", "Weather"],
        github: "https://github.com/sakethlingerker/WeatherApp",
        category: "web",
        scores: { ai: 20, web: 90, data: 60, innovation: 65, technical: 70, realworld: 88 }
    },
    {
        title: "Crop Yield Prediction Model",
        description: "Neural network achieving 97% accuracy for precision agriculture and resource optimization",
        tags: ["TensorFlow", "Keras", "Agriculture"],
        github: "https://github.com/sakethlingerker/Minor-Project",
        category: "data",
        scores: { ai: 65, web: 30, data: 95, innovation: 80, technical: 85, realworld: 92 }
    },
    {
        title: "ClearView – Air Quality Insights",
        description: "Interactive AQI dashboard with real-time monitoring and 95% data accuracy",
        tags: ["Data Viz", "Analytics", "Python"],
        github: "https://github.com/sakethlingerker/ClearView---Interactive-Air-Quality-Insights-",
        category: "data",
        scores: { ai: 35, web: 50, data: 92, innovation: 75, technical: 70, realworld: 90 }
    },
    {
        title: "Vehicle Insurance MLOps Pipeline",
        description: "End-to-end MLOps with automated deployment, CI/CD, and AWS infrastructure",
        tags: ["MLOps", "AWS", "Docker", "CI/CD"],
        github: "https://github.com/sakethlingerker/MLOPS-Project",
        category: "data",
        scores: { ai: 70, web: 40, data: 88, innovation: 82, technical: 95, realworld: 85 }
    }
];

let userAnswers = {};

function handleQuizAnswer(step, answer) {
    userAnswers[`q${step}`] = answer;
    
    // Update Progress
    const progressFill = document.getElementById('quiz-progress-fill');
    if(progressFill) progressFill.style.width = `${(step / 2) * 100}%`;

    if (step === 1) {
        // Show Question 2 with dynamic options based on Q1
        const q2Text = document.getElementById('quiz-q2-text');
        const q2Options = document.getElementById('quiz-q2-options');
        
        document.getElementById('quiz-step-1').classList.remove('active');
        document.getElementById('quiz-step-2').classList.add('active');
        
        // Dynamic Q2 questions based on Q1 selection
        if(answer === 'genai') {
            q2Text.textContent = "What interests you most?";
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
        } else if(answer === 'ml_data') {
             q2Text.textContent = "What interests you most?";
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
        } else {
             q2Text.textContent = "What interests you most?";
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
    } else if (step === 2) {
        // Show results with best matching project
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz-step-2').classList.remove('active');
    document.getElementById('quiz-result-step').classList.add('active');
    
    // Map quiz answers to specific projects
    const projectMap = {
        'genai_resume': 'ATS Resume Expert Pro',
        'genai_visual': 'AI Virtual Interior Designer',
        'genai_language': 'Polyglot AI',
        'ml_data_financial': 'Real-Time Flight Fare Prediction',
        'ml_data_agriculture': 'Crop Yield Prediction Model',
        'ml_data_environmental': 'ClearView – Air Quality Insights',
        'engineering_backend': 'Smart Feedback Collection System',
        'engineering_frontend': 'Cloudcast - Advanced Weather App',
        'engineering_cloud': 'Vehicle Insurance MLOps Pipeline'
    };
    
    // Get the mapping key from user answers
    const mappingKey = `${userAnswers.q1}_${userAnswers.q2}`;
    const targetProjectTitle = projectMap[mappingKey];
    
    // Find the project in database
    const matchedProject = projectsDatabase.find(p => p.title === targetProjectTitle);
    
    // Fallback to first project if mapping fails
    const bestMatch = matchedProject || projectsDatabase[0];
    
    // Generate single result card
    const display = document.getElementById('quiz-recommendation-display');
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
                <h4 class="result-card-title">${bestMatch.title}</h4>
                <p class="result-card-description">${bestMatch.description}</p>
                <div class="result-card-tags">
                    ${bestMatch.tags.slice(0, 4).map(tag => `
                        <span class="result-tag">${tag}</span>
                    `).join('')}
                </div>
                <a href="${bestMatch.github}" target="_blank" rel="noopener noreferrer" 
                   class="result-card-btn">
                    <i class="fab fa-github"></i> View Project
                </a>
            </div>
        </div>
    `;
    
    // Show restart button
    const restartBtn = document.querySelector('#quiz-result-step .primary-btn');
    if(restartBtn) restartBtn.style.display = 'inline-block';
}

function resetQuiz() {
    userAnswers = {};
    document.getElementById('quiz-result-step').classList.remove('active');
    document.getElementById('quiz-step-2').classList.remove('active');
    document.getElementById('quiz-step-1').classList.add('active');
    const progressFill = document.getElementById('quiz-progress-fill');
    if(progressFill) progressFill.style.width = '0%';
}
