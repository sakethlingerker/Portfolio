import { loadProjectsData } from "./projects-data.js";

/* 
 * Ask Saketh - Digital Twin RAG Assistant
 * 100% Grounded in Verified Portfolio Context to Eliminate Hallucinations
 */

// --- 1. STRUCTURED PORTFOLIO KNOWLEDGE BASE ---
const VERIFIED_KNOWLEDGE_BASE = {
  profile: `
PROFILE & TRUTH CONTRACT:
- Full Name: Saketh Lingerker
- Primary Role & Status: Incoming Systems Engineer @ Tata Consultancy Services (TCS Digital Offer Accepted, Awaiting Official Onboarding).
- Truth Rule: Saketh ACCEPTED the TCS Digital offer following GET-IT (89%) & Cognitive NQT (91.51%) scores, but HAS NOT JOINED YET. Do NOT state that Saketh currently works at TCS.
- Core Summary: Software & AI Engineer specializing in Retrieval-Augmented Generation (RAG), Full-Stack REST APIs (Flask), Computer Vision (Stable Diffusion), and MLOps Cloud Pipelines (AWS + Docker + CI/CD).
- Location: Hyderabad, Telangana, India
- Links: Email: saketh1805@gmail.com | Portfolio: https://sakethlingerker.github.io/Portfolio/ | GitHub: https://github.com/sakethlingerker | LinkedIn: https://www.linkedin.com/in/sakethlingerker/
`,

  experience: `
EXPERIENCE:
1. Tata Consultancy Services (TCS iON Job Achiever)
   - Role: Graduate Engineer Trainee - IT (Systems Engineer Offer Accepted)
   - Duration: Jul 2025 - Feb 2026
   - Details: Accepted competitive TCS Digital / Systems Engineer offer following GET-IT and NQT readiness assessments. Currently awaiting official onboarding date.
   - Assessment Scores: TCS iON GET-IT (89%), TCS iON Cognitive NQT (91.51%), TCS Psychometric (High Performance), British Council English (CEFR B1 Speaking, B2+ Writing).

2. IIIT Hyderabad (International Institute of Information Technology)
   - Role: AI/ML Research Intern
   - Duration: Nov 2024 - Jun 2025
   - Truth Rule: Saketh was an AI/ML Research Intern (NOT a Master's student, NOT a Teaching Assistant, NOT a Co-founder).
   - Research Details: Researched Voice Activity Detection (VAD) algorithms for speech segment detection in noisy environments, built AI video summarization workflows, and conducted quantitative evaluations of acoustic feature extractors. Verified Research Certificate issued.
`,

  education: `
EDUCATION:
- Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering
- Institution: JNTUH University College of Engineering, Manthani
- Duration: Dec 2021 – Jul 2025
- CGPA: 7.47 / 10.0
- Truth Rule: Saketh completed B.Tech CSE at JNTUH. He DOES NOT hold a Master's degree.
`,

  skills: `
TECHNICAL SKILLS:
- Programming Languages: Python, JavaScript, SQL, HTML5, CSS3, C/C++
- AI & GenAI Frameworks: LangChain, FAISS, ChromaDB, Groq Llama 3.3 API, Google Gemini API, PyTorch, TensorFlow, Keras, Scikit-learn, OpenCV, NLTK, Stable Diffusion
- Backend & Databases: Flask RESTful APIs, JWT Authentication & RBAC, SQLite, MongoDB Atlas
- Cloud & MLOps Tools: AWS (EC2/ECR/S3), Docker Containerization, GitHub Actions CI/CD, Streamlit, Power BI, Git
- Truth Rule: Saketh does NOT use Azure or microservices frameworks not listed here.
`,

  certifications: `
CERTIFICATIONS & SCORES:
1. TCS iON NPT – GET IT: 89% Score (Verified PDF Certificate)
2. TCS iON NQT – Cognitive: 91.51% Score (Verified PDF Certificate)
3. TCS iON NQT – Psychometric: High Performance (Verified PDF Certificate)
4. TCS iON NPT – English with British Council: CEFR B1 Speaking, CEFR B2+ Writing (Verified PDF Certificate)
5. IIIT Hyderabad AI/ML Research Internship Certificate (Verified PDF Certificate)
`,

  achievements: `
ACHIEVEMENTS:
- Deloitte Australia Data Analytics Virtual Experience Simulation
- Tata Group Data Analytics Virtual Experience Simulation
- IIIT Hyderabad AI/ML Training & Research Completion Certificate
- AWS Cloud Practitioner Infrastructure Projects
- Coding Club Mentor: Mentored 50+ junior students in Python & Web Engineering
- Technical Event Coordinator for University Tech Fest
`,

  projects: {}
};

function populateProjectsKnowledgeBase(projectsData) {
  if (!projectsData) return;
  Object.values(projectsData).forEach((p) => {
    const key = p.id;
    const impactText = p.quantifiableImpact ? p.quantifiableImpact.map((i) => `${i.value} ${i.label}`).join(", ") : "";
    const techText = p.tags ? p.tags.join(", ") : "";
    const archText = p.architecture ? p.architecture.join(" -> ") : "";
    const linkText = p.links?.github || p.links?.demo || p.links?.caseStudy || "";

    const projectBlock = `
PROJECT: ${p.title}
- Category: ${p.category}
- Tech Stack: ${techText}
- Overview: ${p.subtitle || p.overview}
- Problem: ${p.problem || ""}
- Solution: ${p.solution || ""}
- Architecture: ${archText}
- Impact: ${impactText}
- Link: ${linkText}
`;

    VERIFIED_KNOWLEDGE_BASE.projects[key] = projectBlock;

    // Aliases for historical intent detectors
    if (key === "mlops") VERIFIED_KNOWLEDGE_BASE.projects["mlops_pipeline"] = projectBlock;
    if (key === "interior_design") VERIFIED_KNOWLEDGE_BASE.projects["interior_designer"] = projectBlock;
  });
}

// --- 2. INTENT DETECTOR & RAG RETRIEVER ---
function detectIntentAndRetrieveContext(userQuestion, conversationHistory = []) {
  const query = userQuestion.toLowerCase().trim();
  let intent = "GENERAL";
  let chunks = [];
  let sources = [];

  // Determine previous project context from conversation history if follow-up
  let lastProject = null;
  if (conversationHistory.length > 0) {
    const historyText = JSON.stringify(conversationHistory).toLowerCase();
    if (historyText.includes("enterprise rag") || historyText.includes("enterprise-ready rag")) lastProject = VERIFIED_KNOWLEDGE_BASE.projects.enterprise_rag;
    else if (historyText.includes("mlops")) lastProject = VERIFIED_KNOWLEDGE_BASE.projects.mlops_pipeline;
    else if (historyText.includes("smart feedback")) lastProject = VERIFIED_KNOWLEDGE_BASE.projects.smart_feedback;
    else if (historyText.includes("ats resume")) lastProject = VERIFIED_KNOWLEDGE_BASE.projects.ats_resume;
  }

  // 1. Comparison Queries
  if (query.includes("compare") || query.includes("vs") || query.includes("versus") || query.includes("difference between")) {
    intent = "COMPARISON";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.enterprise_rag);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.smart_feedback);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.mlops_pipeline);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.ats_resume);
    sources.push("⚖️ Project Matrix");
  }
  // 2. Recommendation / Role Queries
  else if (query.includes("recommend") || query.includes("best project") || query.includes("which project") || query.includes("hiring for") || query.includes("role")) {
    intent = "RECOMMENDATION";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.enterprise_rag);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.mlops_pipeline);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.smart_feedback);
    sources.push("🎯 Role Matcher");
  }
  // 3. Research / IIIT Query
  else if (query.includes("iiit") || query.includes("hyderabad") || query.includes("vad") || query.includes("speech") || query.includes("research")) {
    intent = "RESEARCH";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.experience);
    sources.push("🔬 IIIT-H Research Intern");
  }
  // 4. TCS / Assessment Scores Query
  else if (query.includes("tcs") || query.includes("offer") || query.includes("get-it") || query.includes("nqt") || query.includes("digital")) {
    intent = "TCS";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.experience);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.certifications);
    sources.push("💼 TCS Digital Offer");
  }
  // 5. Specific Projects Query
  else if (query.includes("rag") || query.includes("langchain") || query.includes("faiss") || query.includes("llama")) {
    intent = "PROJECT";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.enterprise_rag);
    sources.push("🚀 Enterprise RAG Agent");
  }
  else if (query.includes("mlops") || query.includes("aws") || query.includes("docker") || query.includes("ci/cd")) {
    intent = "PROJECT";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.mlops_pipeline);
    sources.push("⚙️ MLOps Pipeline");
  }
  else if (query.includes("feedback") || query.includes("sentiment") || query.includes("nltk") || query.includes("jwt")) {
    intent = "PROJECT";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.smart_feedback);
    sources.push("⚡ Smart Feedback System");
  }
  else if (query.includes("ats") || query.includes("gemini") || (query.includes("resume") && query.includes("expert"))) {
    intent = "PROJECT";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.projects.ats_resume);
    sources.push("📄 ATS Resume Expert");
  }
  // 6. Education Query
  else if (query.includes("education") || query.includes("cgpa") || query.includes("college") || query.includes("jntuh") || query.includes("b.tech") || query.includes("degree") || query.includes("master")) {
    intent = "EDUCATION";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.education);
    sources.push("🎓 Education @ JNTUH");
  }
  // 7. Skills Query
  else if (query.includes("skill") || query.includes("technology") || query.includes("technologies") || query.includes("stack") || query.includes("languages") || query.includes("tools")) {
    intent = "SKILLS";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.skills);
    sources.push("🛠️ Tech Stack");
  }
  // 8. Follow-up Query ("Why did you choose LangChain?", "How does it work?")
  else if (lastProject && (query.includes("why") || query.includes("how") || query.includes("choose") || query.includes("explain"))) {
    intent = "FOLLOW_UP";
    chunks.push(lastProject);
    sources.push("🔍 Follow-Up Context");
  }
  // 9. Default / Profile / Recruiter Query ("Tell me about Saketh", "Why hire Saketh?", "Resume summary")
  else {
    intent = "ABOUT_ME";
    chunks.push(VERIFIED_KNOWLEDGE_BASE.profile);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.experience);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.education);
    chunks.push(VERIFIED_KNOWLEDGE_BASE.skills);
    sources.push("📄 Verified Portfolio");
  }

  const contextText = [...new Set(chunks)].join("\n---\n");
  const uniqueSources = [...new Set(sources)];

  return { intent, contextText, uniqueSources };
}

// --- 3. DIGITAL TWIN SYSTEM PROMPT ---
const DIGITAL_TWIN_SYSTEM_PROMPT = `You are Ask Saketh, Saketh Lingerker's Digital Twin Portfolio Assistant.

You speak as Saketh Lingerker's authorized digital representative and portfolio assistant.

STRICT TRUTH DIRECTIVES:
1. Answer ONLY using Saketh's verified portfolio information provided in the CONTEXT below.
2. NEVER invent experience, degrees, certifications, or technologies not explicitly listed in the context.
   - Saketh completed B.Tech CSE at JNTUH (Dec 2021 - Jul 2025 | CGPA 7.47/10.0). Saketh DOES NOT hold a Master's degree.
   - Saketh was an AI/ML Research Intern at IIIT Hyderabad (Nov 2024 - Jun 2025). Saketh was NOT a Teaching Assistant and NOT a Co-founder.
   - Saketh ACCEPTED the TCS Digital / Systems Engineer offer and is AWAITING JOINING. Saketh DOES NOT currently work at TCS.
   - Saketh does NOT use Azure or microservices frameworks not listed in his skills.
3. If the user asks for information NOT in the context, reply strictly:
   "I don't have verified information about that in Saketh's portfolio."

FORMATTING GUIDELINES:
- For Projects: Include Overview, Problem, Solution, Technologies, Architecture, Impact, and GitHub link.
- For Comparisons: Use a clean Markdown comparison table with metrics.
- For Role Recommendations: Detail the recommended projects with "Why it matters" bullet points.
- For Recruiter Summaries: Provide a clean, bulleted breakdown under 150 words.`;

// --- 4. SIMPLE MARKDOWN PARSER ---
function renderMarkdown(mdText) {
  if (!mdText) return "";
  let html = mdText
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 🔗</a>')
    .replace(/^[\•\-\*]\s+(.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  html = html.replace(/<\/ul><br\/><ul>/g, '').replace(/<\/ul><ul>/g, '');
  return html;
}

// --- 5. CHATBOT CONTROLLER CLASS ---
class AskSakethUI {
  constructor() {
    this.conversationHistory = [];
    
    this.dom = {
      container: document.getElementById("ai-chatbot"),
      messages: document.getElementById("ai-chatbot-messages"),
      welcomeScreen: document.getElementById("chatbot-welcome-screen"),
      input: document.getElementById("chatbot-input"),
      sendBtn: document.getElementById("send-chatbot"),
      toggleBtn: document.getElementById("chatbot-toggle"),
      closeBtn: document.getElementById("close-chatbot"),
      clearBtn: document.getElementById("clear-chatbot")
    };

    this.init();
  }

  init() {
    if (!this.dom.container) return;

    this.dom.toggleBtn?.addEventListener("click", () => this.toggle());
    this.dom.closeBtn?.addEventListener("click", () => this.close());
    this.dom.clearBtn?.addEventListener("click", () => this.clearChat());

    this.dom.sendBtn?.addEventListener("click", () => this.handleUserInput());
    this.dom.input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleUserInput();
    });

    document.querySelectorAll(".prompt-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const prompt = btn.getAttribute("data-prompt") || btn.textContent.trim();
        this.submitPrompt(prompt);
      });
    });

    this.createTypingIndicator();
  }

  toggle() {
    this.dom.container.classList.toggle("active");
  }

  close() {
    this.dom.container.classList.remove("active");
  }

  clearChat() {
    this.conversationHistory = [];
    if (this.dom.messages && this.dom.welcomeScreen) {
      this.dom.messages.innerHTML = "";
      this.dom.messages.appendChild(this.dom.welcomeScreen);
      this.dom.welcomeScreen.style.display = "flex";
      this.createTypingIndicator();
    }
  }

  createTypingIndicator() {
    const div = document.createElement("div");
    div.className = "typing-indicator";
    div.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    this.dom.messages.appendChild(div);
    this.typingIndicator = div;
  }

  showTyping() {
    if (this.typingIndicator) {
      this.typingIndicator.classList.add("active");
      this.scrollToBottom();
    }
  }

  hideTyping() {
    if (this.typingIndicator) {
      this.typingIndicator.classList.remove("active");
      this.dom.messages.appendChild(this.typingIndicator);
    }
  }

  hideWelcomeScreen() {
    if (this.dom.welcomeScreen) {
      this.dom.welcomeScreen.style.display = "none";
    }
  }

  appendUserMessage(text) {
    this.hideWelcomeScreen();
    const div = document.createElement("div");
    div.className = "message user-message";
    div.innerHTML = `<p>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
    this.dom.messages.insertBefore(div, this.typingIndicator);
    this.scrollToBottom();
  }

  appendAIMessage(markdownText, sources = []) {
    this.hideWelcomeScreen();
    const formattedHtml = renderMarkdown(markdownText);

    const div = document.createElement("div");
    div.className = "message ai-message";

    let sourcesHtml = "";
    if (sources && sources.length > 0) {
      sourcesHtml = `<div class="message-sources">
        <span class="source-label"><i class="fas fa-microchip"></i> Digital Twin Context:</span>
        ${sources.map(s => `<span class="source-tag">${s}</span>`).join("")}
      </div>`;
    }

    div.innerHTML = `
      <div class="ai-response-body">${formattedHtml}</div>
      ${sourcesHtml}
      <div class="ai-response-actions">
        <button class="action-btn copy-btn" title="Copy Response"><i class="fas fa-copy"></i> Copy</button>
      </div>
    `;

    this.dom.messages.insertBefore(div, this.typingIndicator);

    const copyBtn = div.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(markdownText).then(() => {
          copyBtn.innerHTML = `<i class="fas fa-check"></i> Copied`;
          setTimeout(() => {
            copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy`;
          }, 2000);
        });
      });
    }

    this.scrollToBottom();
  }

  submitPrompt(promptText) {
    if (!promptText) return;
    this.appendUserMessage(promptText);
    this.fetchResponse(promptText);
  }

  handleUserInput() {
    const text = this.dom.input.value.trim();
    if (!text) return;
    this.dom.input.value = "";
    this.submitPrompt(text);
  }

  async fetchResponse(userText) {
    this.showTyping();

    // 1. Detect Intent and Retrieve Context
    const { intent, contextText, uniqueSources } = detectIntentAndRetrieveContext(userText, this.conversationHistory);

    // 2. Build RAG-Grounded Prompt
    const ragPromptText = `VERIFIED PORTFOLIO CONTEXT (ONLY SOURCE OF TRUTH):
---
${contextText}
---

USER QUESTION:
${userText}`;

    this.conversationHistory.push({
      role: "user",
      parts: [{ text: ragPromptText }]
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: this.conversationHistory,
          systemInstruction: DIGITAL_TWIN_SYSTEM_PROMPT
        })
      });

      const data = await res.json();
      this.hideTyping();

      if (data && !data.fallback && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const replyText = data.candidates[0].content.parts[0].text;
        
        this.conversationHistory.push({
          role: "model",
          parts: [{ text: replyText }]
        });

        this.appendAIMessage(replyText, uniqueSources);
      } else {
        this.appendAIMessage("I don't have verified information about that in Saketh's portfolio.", uniqueSources);
      }
    } catch (err) {
      this.hideTyping();
      this.appendAIMessage("I don't have verified information about that in Saketh's portfolio.", uniqueSources);
    }
  }

  scrollToBottom() {
    if (this.dom.messages) {
      this.dom.messages.scrollTop = this.dom.messages.scrollHeight;
    }
  }
}

// Export initialization function
export async function initChatbot() {
  const data = await loadProjectsData();
  populateProjectsKnowledgeBase(data);
  window.chatbot = new AskSakethUI();
}
