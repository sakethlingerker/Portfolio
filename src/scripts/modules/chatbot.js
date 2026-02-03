/* 
 * Enhanced Portfolio Chatbot
 * Features: Structured Data, Intent Detection, Context Awareness, Quick Replies
 */

// --- 1. KNOWLEDGE BASE ---
const PORTFOLIO_DATA = {
  profile: {
    name: "Saketh Lingerker",
    title: "AI/ML Engineer & Full-Stack Developer",
    email: "saketh1805@gmail.com",
    resumeLink: "assets/Saketh_Lingerker_8688791352.pdf",
    portfolioUrl: "https://sakethlingerker.github.io/Portfolio/",
    socials: {
      github: "https://github.com/sakethlingerker",
      linkedin: "https://www.linkedin.com/in/sakethlingerker/",
    }
  },
  education: {
    degree: "B.Tech in Computer Science",
    university: "JNTUH University College of Engineering, Manthani",
    year: "Dec 2021 – Jul 2025",
    cgpa: "7.47/10.0"
  },
  experience: [
    {
      role: "Graduate Engineer Trainee - IT",
      company: "Tata Consultancy Services (TCS iON Job Achiever)",
      duration: "Jul 2025 - Present",
      desc: "Industry-readiness training focused on core software engineering, full-stack systems, and modern tech stacks." 
    },
    {
      role: "AI/ML Research Intern",
      company: "IIIT Hyderabad",
      duration: "Nov 2024 - Jun 2025",
      desc: "Worked on Voice Activity Detection and AI-driven models with real-world applications in video summarization." 
    }
  ],
  skills: {
    languages: ["Python", "JavaScript", "SQL", "HTML5", "CSS3", "C/C++"],
    ai_ml_frameworks: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenCV", "LangChain"],
    web_backend: ["Flask", "Streamlit", "RESTful APIs", "Responsive Design", "Chart.js"],
    data_science: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Data Analysis", "Data Visualization"],
    tech_concepts: ["Machine Learning", "Deep Learning", "Generative AI", "Computer Vision", "NLP", "MLOps"],
    tools: ["Git", "Docker", "AWS", "MongoDB", "MySQL", "SQLite", "CI/CD"]
  },
  projects: [
    {
      name: "Smart Feedback Collection and Analysis System",
      category: "Full-Stack / AI",
      tech: "Flask, SQLAlchemy, NLTK, JavaScript, Chart.js",
      description: "Full-stack web app with multi-layer authentication and real-time sentiment analysis for dynamic feedback insights.",
      liveUrl: "#"
    },
    {
      name: "ATS Resume Expert Pro",
      category: "AI/ML",
      tech: "Python, Streamlit, Google Gemini API, NLP",
      description: "AI-powered resume analysis tool that optimizes resumes for ATS systems and provides detailed recommendations.",
      liveUrl: "https://resume-tracking-sakethlingerker.streamlit.app"
    },
    {
      name: "AI Virtual Interior Designer",
      category: "Generative AI",
      tech: "Python, PyTorch, Stable Diffusion, Streamlit",
      description: "Generative AI application that creates customized interior designs with real-time cost estimation.",
      liveUrl: "#"
    },
    {
      name: "Vehicle Insurance MLOps Pipeline",
      category: "MLOps",
      tech: "Python, AWS, MongoDB, Docker, CI/CD",
      description: "End-to-end scalable MLOps pipeline automating model deployment and monitoring for insurance analytics.",
      liveUrl: "#"
    },
    {
      name: "Crop Yield Prediction Model",
      category: "Machine Learning",
      tech: "TensorFlow, Keras, Flask",
      description: "Neural network predicting agricultural crop yields with integration through a simple web interface.",
      liveUrl: "#"
    },
    {
      name: "ClearView – Interactive Air Quality Insights",
      category: "Data Science / Visualization",
      tech: "Python, Streamlit, Power BI",
      description: "Interactive data visualization dashboard offering real-time air quality insights and trend analysis.",
      liveUrl: "https://air-quality-insight.streamlit.app"
    },
    {
      name: "Polyglot AI – Language Detection System",
      category: "NLP",
      tech: "Python, Scikit-Learn",
      description: "NLP model to detect and classify text into multiple languages, with API integration for real-time use.",
      liveUrl: "#"
    },
    {
      name: "Real-Time Flight Fare Prediction App",
      category: "AI/ML",
      tech: "Python, Flask, Scikit-learn",
      description: "Machine learning web app forecasting flight fares using historical and real-time data.",
      liveUrl: "#"
    },
    {
      name: "Cloudcast – Advanced Weather App",
      category: "Web",
      tech: "JavaScript, HTML5, CSS3",
      description: "Feature-rich weather app supporting live forecasts, geolocation, and dynamic UI themes.",
      liveUrl: "https://sakethlingerker.github.io"
    }
  ],
  achievements: [
    "Deloitte Australia – Data Analytics Simulation",
    "Tata Group – Data Analytics Simulation",
    "IIIT Hyderabad AI/ML Training & Research Completion",
    "AWS Cloud Practitioner Certification",
    "Coding Club Mentor – 50+ Students",
    "College Fest Technical Coordinator"
  ]
};


// --- 2. CHATBOT BRAIN (Logic Layer) ---
class ChatbotBrain {
  constructor() {
    this.context = {
      lastIntent: null,
      lastProjectList: null,
      persona: 'professional' // professional, friendly, genz
    };
    
    // NLU Keywords & Scoring
    this.intents = {
      PROJECTS: ["projects", "work", "build", "portfolio", "created", "demo", "app", "projets", "proj", "applications", "apps"],
      SKILLS: ["skills", "stack", "technologies", "tools", "languages", "code", "skils", "tech", "knowledge"],
      EXPERIENCE: ["experience", "job", "worked", "intern", "company", "career", "role", "exp", "tcs", "experiences"],
      EDUCATION: ["education", "college", "degree", "university", "study", "cgpa", "school"],
      CONTACT: ["contact", "email", "reach", "hire", "social", "connect", "message", "cntact", "linkedin", "github", "github", "mail"],
      RESUME: ["resume", "cv", "download", "pdf"],
      GREETING: ["hi", "hello", "hey", "sup", "greetings", "start", "hlo", "yo", "hola", "morning"],
      ABOUT: ["who", "about", "saketh", "author", "introduce", "biography"],
      ACKNOWLEDGEMENT: ["okay", "ok", "thanks", "thank", "cool", "got it", "nice", "awesome"]
    };

    // Analytics Tracker
    this.analytics = {
      projects: 0,
      skills: 0,
      experience: 0,
      contact: 0,
      resume: 0,
      acknowledgement: 0
    };
  }

  setPersona(mode) {
    this.context.persona = mode;
  }

  analyzeIntent(input) {
    const text = input.toLowerCase();
    let scores = {};

    // 1. Check Keywords (Scoring)
    for (const [intent, keywords] of Object.entries(this.intents)) {
      scores[intent] = 0;
      keywords.forEach(word => {
        if (text.includes(word)) scores[intent]++;
      });
    }

    // 2. Find Best Match
    const bestMatch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    
    // Threshold check (must have at least 1 keyword match)
    if (bestMatch[1] > 0) return { type: bestMatch[0], confidence: bestMatch[1], rawInput: text };

    // 3. Context / Follow-up Handling (Memory)
    if (this.context.lastIntent === 'PROJECTS' && this.context.lastProjectList) {
      if (text.includes("second") || text.includes("2nd") || text.includes("next")) {
        return { type: 'PROJECT_FollowUp', index: 1 };
      }
      if (text.includes("first") || text.includes("1st")) {
        return { type: 'PROJECT_FollowUp', index: 0 };
      }
    }

    return { type: 'UNKNOWN' };
  }

  generateResponse(intentData) {
    const { type, index } = intentData;
    this.context.lastIntent = type; // Update Memory

    // Track Analytics
    if (this.analytics[type.toLowerCase()] !== undefined) {
      this.analytics[type.toLowerCase()]++;
      // Log removed for production
      // console.log("Chatbot Analytics:", this.analytics);
    }

    switch (type) {
      case 'GREETING':
        return {
          text: this.getPersonaText({
             professional: "Hi there! I'm Saketh's AI Assistant. How can I facilitate your review of his portfolio?",
             friendly: "Hi! 👋 I'm Saketh's AI buddy. Looking for his cool projects or skills?",
             genz: "Yo! ⚡ Welcome to the portfolio. Wanna see some cracked projects?"
          }),
          options: ["Projects 🚀", "Skills 🛠️", "Experience 💼", "Contact 📫"]
        };

      case 'PROJECTS':
        this.context.lastProjectList = PORTFOLIO_DATA.projects; // Save to memory
        
        // Generate Cards
        const projCards = PORTFOLIO_DATA.projects.map(p => `
          <div class="chat-project-card">
            <b>${p.name}</b>
            <small>${p.category} • ${p.tech.split(',')[0]}</small>
            <a href="${p.liveUrl}" target="_blank">View Live 🔗</a>
          </div>
        `).join("");

        return {
          text: this.getPersonaText({
            professional: `Saketh has delivered ${PORTFOLIO_DATA.projects.length} key projects combining AI and Web Engineering.`,
            friendly: `Here are the awesome projects Saketh built! 🚀`,
            genz: `Check these out, straight fire 🔥`
          }) + `<br>${projCards}`,
          options: ["AI Projects", "Web Projects", "Skills"]
        };

      case 'PROJECT_FollowUp':
         const proj = this.context.lastProjectList[index];
         if(!proj) return { text: "I couldn't find that one.", options: ["All Projects"] };
         return {
           text: `<b>${proj.name}</b><br>${proj.description}<br><br>Built with: ${proj.tech}`,
           options: ["Back to List"]
         };

      case 'SKILLS':
        return {
          text: `Saketh's Tech Stack: 🛠️<br>
          • <b>AI/ML:</b> ${PORTFOLIO_DATA.skills.ai_ml_frameworks.slice(0,3).join(', ')}<br>
          • <b>Web:</b> ${PORTFOLIO_DATA.skills.web_backend.slice(0,3).join(', ')}<br>
          • <b>Tools:</b> ${PORTFOLIO_DATA.skills.tools.slice(0,3).join(', ')}`,
          options: ["Python Details", "Experiences"]
        };

      case 'EXPERIENCE':
        const current = PORTFOLIO_DATA.experience[0];
        return {
          text: `Currently working as <b>${current.role}</b> at <b>${current.company}</b>.<br>He's learning enterprise-scale systems!`,
          options: ["Resume 📄", "Projects"]
        };

      case 'CONTACT':
        const raw = (intentData.rawInput || "").toLowerCase();
        if (raw.includes("linkedin")) {
          return {
            text: `Explore Saketh's professional profile on LinkedIn! 💼<br><br><a href="${PORTFOLIO_DATA.profile.socials.linkedin}" target="_blank" class="chat-link">Visit LinkedIn Profile 🔗</a>`,
            options: ["GitHub 🚀", "Email 📫", "Skills"]
          };
        }
        if (raw.includes("github")) {
          return {
            text: `Explore Saketh's projects on GitHub! 🚀<br><br><a href="${PORTFOLIO_DATA.profile.socials.github}" target="_blank" class="chat-link">Visit GitHub Profile 🔗</a>`,
            options: ["LinkedIn 💼", "Email 📫", "Projects"]
          };
        }
        return {
          text: `Let's connect! 🤝<br><br>
          📧 <a href="mailto:${PORTFOLIO_DATA.profile.email}">${PORTFOLIO_DATA.profile.email}</a>`,
          options: ["LinkedIn 💼", "GitHub 🚀", "Resume 📄"]
        };

      case 'RESUME':
        return {
          text: `You can download my latest resume from here: 📄<br><br><a href="${PORTFOLIO_DATA.profile.resumeLink}" target="_blank" class="chat-link">Download Resume (PDF) ⬇️</a>`,
          options: ["Okay!", "Projects 🚀"]
        };

      case 'ACKNOWLEDGEMENT':
        return {
          text: this.getPersonaText({
             professional: "Glad I could help! Is there anything else you'd like to know about Saketh's background?",
             friendly: "No problem! 😊 Anything else I can show you? Skills, projects, or contact info?",
             genz: "No cap, glad to help! 💯 What's next? Projects or Tech Stack?"
          }),
          options: ["Projects 🚀", "Skills 🛠️", "Contact 📫"]
        };

      default:
        return {
          text: this.getPersonaText({
             professional: "I apologize, I didn't quite catch that. Could you clarify?",
             friendly: "Oops, I missed that! 😅 Try asking about Projects or Skills.",
             genz: "Bruh, I don't get it. 💀 Ask about Projects?"
          }),
          options: ["Projects 🚀", "Skills 🛠️", "Contact"]
        };
    }
  }

  getPersonaText(variants) {
    return variants[this.context.persona] || variants['friendly'];
  }
}

// --- 3. CHATBOT UI (View Layer) ---
class ChatbotUI {
  constructor() {
    this.brain = new ChatbotBrain();
    this.dom = {
      container: document.getElementById("ai-chatbot"),
      messages: document.getElementById("ai-chatbot-messages"),
      input: document.getElementById("chatbot-input"),
      sendBtn: document.getElementById("send-chatbot"),
      toggleBtn: document.getElementById("chatbot-toggle"),
      closeBtn: document.getElementById("close-chatbot")
    };
    
    this.recognition = null;
    this.isListening = false;
    
    this.init();
  }

  init() {
    if (!this.dom.container) return; // Guard clause

    // Listeners
    this.dom.toggleBtn?.addEventListener("click", () => this.toggle());
    this.dom.closeBtn?.addEventListener("click", () => this.close());
    this.dom.sendBtn?.addEventListener("click", () => this.processUserInput());
    this.dom.input?.addEventListener("keydown", (e) => {
      if (e.key === 'Enter') this.processUserInput();
    });
    
    // Inject Voice Button
    this.addVoiceButton();

    // Initial Typing Wrapper
    this.createTypingIndicator();
  }

  addVoiceButton() {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

    const micBtn = document.createElement("button");
    micBtn.className = "mic-btn";
    micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    micBtn.ariaLabel = "Voice Input";
    
    // Insert before send button
    this.dom.sendBtn.parentNode.insertBefore(micBtn, this.dom.sendBtn);
    
    // Setup API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    
    this.recognition.onstart = () => {
       this.isListening = true;
       micBtn.classList.add("listening");
    };

    this.recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
            this.addMessage("⚠️ Please enable microphone permissions.", "ai");
        } else {
            this.addMessage("⚠️ Voice error: " + event.error, "ai");
        }
        this.isListening = false;
        micBtn.classList.remove("listening");
    };

    this.recognition.onend = () => {
       this.isListening = false;
       micBtn.classList.remove("listening");
       // Auto-send when speaking stops
       if(this.dom.input.value) this.processUserInput();
    };

    this.recognition.onresult = (e) => {
       const transcript = e.results[0][0].transcript;
       this.dom.input.value = transcript;
    };

    micBtn.onclick = () => {
      // console.log("Mic button clicked");
      if(this.isListening) {
        this.recognition.stop();
        // console.log("Stopping recognition");
      } else {
        try {
          this.recognition.start();
          // console.log("Starting recognition");
        } catch (err) {
          console.error("Failed to start recognition:", err);
          this.addMessage("⚠️ Voice error: " + err.message, "ai");
        }
      }
    };
  }

  speakResponse(text) {
    // Basic TTS
    if(!window.speechSynthesis) return;
    // Strip HTML tags
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.rate = 1.1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }

  toggle() {
    this.dom.container.classList.toggle("active");
  }

  close() {
    this.dom.container.classList.remove("active");
  }

  createTypingIndicator() {
    const div = document.createElement("div");
    div.className = "typing-indicator";
    div.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    this.dom.messages.appendChild(div);
    this.typingIndicator = div;
  }

  showTyping() {
    this.typingIndicator.classList.add("active");
    this.scrollToBottom();
  }

  hideTyping() {
    this.typingIndicator.classList.remove("active");
    this.dom.messages.appendChild(this.typingIndicator); 
  }

  addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;
    div.innerHTML = text;
    this.dom.messages.insertBefore(div, this.typingIndicator);
    this.scrollToBottom();
  }

  addQuickReplies(options) {
    if (!options || options.length === 0) return;
    
    // Create/Clear suggestions container
    let container = this.dom.container.querySelector(".quick-replies-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "quick-replies-container";
        this.dom.messages.after(container); // Place it outside messages, above input
    }
    container.innerHTML = ""; 

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "quick-reply-btn";
      btn.textContent = opt;
      btn.onclick = () => {
        this.addMessage(opt, "user");
        container.innerHTML = ""; // Clear after selection
        const cleanOpt = opt.replace(/[^\w\s]/gi, '').trim(); 
        this.handleResponse(cleanOpt);
      };
      container.appendChild(btn);
    });
    this.scrollToBottom();
  }

  async processUserInput() {
    const text = this.dom.input.value.trim();
    if (!text) return;

    this.dom.input.value = "";
    this.addMessage(text, "user");
    
    // Clear suggestions
    const container = this.dom.container.querySelector(".quick-replies-container");
    if (container) container.innerHTML = "";

    await this.handleResponse(text);
  }

  async handleResponse(input) {
    this.showTyping();

    // Smart Delay based on input length
    const delay = Math.min(2000, Math.max(800, input.length * 30));
    
    return new Promise(resolve => {
      setTimeout(() => {
        this.hideTyping();
        
        try {
            const cleanInput = input.replace(/[^\w\s]/gi, '').trim(); // Basic clean
            const intent = this.brain.analyzeIntent(cleanInput);
            const data = this.brain.generateResponse(intent);
            
            this.addMessage(data.text, "ai");
            this.addQuickReplies(data.options);
            
            // Speak the response (Optional: can toggle off)
            // this.speakResponse(data.text);
        
        } catch(e) {
            console.error(e);
            this.addMessage("Oops! My brain froze 🥶 Try again?", "ai");
        }
        
        resolve();
      }, delay);
    });
  }

  scrollToBottom() {
    this.dom.messages.scrollTop = this.dom.messages.scrollHeight;
  }
}

// --- 4. EXPORT ---
export function initChatbot() {
  window.chatbot = new ChatbotUI(); // Export to window for access
}
