import { initTheme } from './theme.js';
// Conflicting theme logic removed to enforce consistent dark style
export function initTerminal() {
  const terminal = document.getElementById("portfolio-terminal");
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  const promptText = "saketh@portfolio:~$ ";

  // Styling constants
  const green = "color: #50fa7b;";
  const yellow = "color: #f1fa8c;";
  const orange = "color: #ffb86c;";

  // Command output types - MOVED TO TOP
  const outputTypes = {
    TEXT: "text",
    HTML: "html", 
    ACTION: "action",
    NULL: "null",
    ERROR: "error"
  };

  const termCommands = {
    "help": `Available commands: <span class="cmd-keyword">ls</span> - List portfolio sections <span class="cmd-keyword">goto [sec]</span> - Scroll to a section <span class="cmd-keyword">whoami</span> - About Saketh <span class="cmd-keyword">clear</span> - Clear terminal <span class="cmd-keyword">contact</span> - Show contact info <span class="cmd-keyword">skills</span> - List key skills`,
    "ls": `Sections: <span class="cmd-keyword">home</span>, <span class="cmd-keyword">experience</span>, <span class="cmd-keyword">skills</span>, <span class="cmd-keyword">projects</span>, <span class="cmd-keyword">achievements</span>, <span class="cmd-keyword">contact</span>`,
    "sections": `Available sections: <span class="cmd-keyword">home</span>, <span class="cmd-keyword">experience</span>, <span class="cmd-keyword">skills</span>, <span class="cmd-keyword">projects</span>, <span class="cmd-keyword">achievements</span>, <span class="cmd-keyword">contact</span>`,
    "whoami": "Saketh Lingerker - AI/ML Engineer & Full-Stack Developer.",
    "skills": "AI/ML (TensorFlow, PyTorch, Generative AI), MLOps (AWS, Docker), Web (Flask, Django), Python, SQL.",
    "projects": "ATS Resume Expert, AI Interior Designer, MLOps Pipeline, Polyglot AI, Crop Yield Prediction...",
    "social": "GitHub: <a href='https://github.com/sakethlingerker' target='_blank'>github.com/sakethlingerker</a> <br>LinkedIn: <a href='https://www.linkedin.com/in/sakethlingerker/' target='_blank'>linkedin.com/in/sakethlingerker/</a>",
    "contact": "Email: <a href='mailto:saketh1805@gmail.com'>saketh1805@gmail.com</a> | Phone: +91 8688791352",
    "about.txt": "I am an AI/ML Engineer and Full-Stack Developer passionate about building intelligent systems. I specialize in Generative AI, MLOps, and scalable web applications.",
    "contact.info": "Email: <a href='mailto:saketh1805@gmail.com'>saketh1805@gmail.com</a> | Phone: +91 8688791352",
    "resume.pdf": "Opening resume..."
  };

  // Section mapping with IDs and display names
  const sections = {
    "home": { id: "home", name: "Home", description: "Hero section with introduction" },
    "experience": { id: "experience", name: "Experience & Education", description: "Timeline of work and education" },
    "skills": { id: "skills", name: "Skills", description: "Technical skills and technologies" },
    "projects": { id: "projects", name: "Projects", description: "Project showcase" },
    "project-matchmaker": { id: "project-matchmaker", name: "Project Matchmaker", description: "Interactive project recommender" },
    "achievements": { id: "achievements", name: "Achievements", description: "Certifications and awards" },
    "contact": { id: "contact", name: "Contact", description: "Get in touch section" }
  };

  const handleCommand = (cmd) => {
    const lowerCmd = cmd.toLowerCase().trim();
    
    // Handle goto command
    if (lowerCmd.startsWith("goto ")) {
      const sectionName = lowerCmd.split(" ")[1];
      return handleGotoSection(sectionName);
    }

    // File reading shortcuts (cat)
    if (lowerCmd.startsWith("cat ")) {
      const file = lowerCmd.split(" ")[1];
      if (termCommands[file]) {
        // Check if it's a file that should return HTML
        const htmlFiles = ["contact.info", "social", "contact", "help", "ls", "sections"];
        const type = htmlFiles.includes(file) ? outputTypes.HTML : outputTypes.TEXT;
        return { type, content: termCommands[file] };
      }
      return { type: outputTypes.ERROR, content: `cat: ${file}: No such file or directory` };
    }

    // Direct section access
    if (sections[lowerCmd]) {
      return handleGotoSection(lowerCmd);
    }

    // Direct file access similar to 'cat' or running executable
    if (lowerCmd === "about.txt" || lowerCmd === "contact.info") {
      const type = lowerCmd === "contact.info" ? outputTypes.HTML : outputTypes.TEXT;
      return { type, content: termCommands[lowerCmd] };
    }
    
    // Resume handling
    if (lowerCmd === "resume" || lowerCmd === "resume.pdf") {
      const resumeBtn = document.querySelector('a[href*="Saketh_Lingerker_8688791352.pdf"]');
      if(resumeBtn) {
          resumeBtn.click();
          return { type: outputTypes.TEXT, content: "Opening resume preview..." };
      }
      return { type: outputTypes.ERROR, content: "Error: Resume file not found." };
    }

    // Social command - returns clickable links
    if (lowerCmd === "social") {
      return { type: outputTypes.HTML, content: termCommands["social"] };
    }

    // Contact command - returns clickable email link
    if (lowerCmd === "contact") {
      return { type: outputTypes.HTML, content: termCommands["contact"] };
    }

    // Theme handling
    if (lowerCmd === "theme") {
      document.getElementById("theme-toggle")?.click();
      return { type: outputTypes.TEXT, content: "Theme toggled." };
    }

    // Clear handling
    if (lowerCmd === "clear") {
      termOutput.innerHTML = `
        <div class="terminal-line">Welcome to Saketh's Interactive Terminal v1.0.0</div>
        <div class="terminal-line">Type 'help' to see available commands.</div>
        <div class="terminal-line">Tip: Try 'social' or 'goto projects' to navigate</div>
      `;
      return { type: outputTypes.NULL, content: null };
    }

    // GUI/Exit handling
    if (lowerCmd === "gui" || lowerCmd === "exit") {
      terminal.classList.remove("active");
      return { type: outputTypes.TEXT, content: "Exiting terminal mode..." };
    }

    // About command (alternative to cat about.txt)
    if (lowerCmd === "about") {
      return { type: outputTypes.TEXT, content: termCommands["about.txt"] };
    }

    // Help command - returns HTML with styled keywords
    if (lowerCmd === "help") {
      return { type: outputTypes.HTML, content: termCommands["help"] };
    }

    // LS command - returns HTML with styled keywords
    if (lowerCmd === "ls") {
      return { type: outputTypes.HTML, content: termCommands["ls"] };
    }

    // Sections command - returns HTML with styled keywords
    if (lowerCmd === "sections") {
      return { type: outputTypes.HTML, content: termCommands["sections"] };
    }

    // Skills command
    if (lowerCmd === "skills") {
      return { type: outputTypes.TEXT, content: termCommands["skills"] };
    }

    // Projects command
    if (lowerCmd === "projects") {
      return { type: outputTypes.TEXT, content: termCommands["projects"] };
    }

    // Whoami command
    if (lowerCmd === "whoami") {
      return { type: outputTypes.TEXT, content: termCommands["whoami"] };
    }

    return { type: outputTypes.ERROR, content: `Command not found: ${cmd}. Type 'help' for options.` };
  };

  const handleGotoSection = (sectionName) => {
    const section = sections[sectionName];
    if (!section) {
      // Try to find partial matches
      const matches = Object.keys(sections).filter(key => 
        key.includes(sectionName) || sections[key].name.toLowerCase().includes(sectionName)
      );
      
      if (matches.length === 0) {
        return { type: outputTypes.ERROR, content: `Section '${sectionName}' not found. Available: ${Object.keys(sections).join(', ')}` };
      }
      
      if (matches.length === 1) {
        const matchedSection = sections[matches[0]];
        scrollToSection(matchedSection.id);
        return { type: outputTypes.TEXT, content: `Navigating to ${matchedSection.name}...` };
      }
      
      return { type: outputTypes.TEXT, content: `Multiple matches found: ${matches.join(', ')}. Please be more specific.` };
    }
    
    scrollToSection(section.id);
    return { type: outputTypes.TEXT, content: `Navigating to ${section.name}...` };
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close terminal first for better UX
      terminal.classList.remove("active");
      
      // Smooth scroll to section with offset for header
      setTimeout(() => {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Optional: Highlight the section briefly
        element.style.boxShadow = '0 0 0 3px var(--accent)';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }, 300);
    } else {
      console.warn(`Section with id '${sectionId}' not found`);
    }
  };

  // Initialize terminal with welcome message
  const initializeTerminal = () => {
    termOutput.innerHTML = `
      <div class="terminal-line">Welcome to Saketh's Interactive Terminal v1.0.0</div>
      <div class="terminal-line">Type 'help' to see available commands.</div>
      <div class="terminal-line">Tip: Try 'social' or 'goto projects' to navigate</div>
    `;
  };

  // Terminal toggle functionality
  document.getElementById("terminal-toggle")?.addEventListener("click", () => {
    terminal.classList.toggle("active");
    if (terminal.classList.contains("active")) {
      setTimeout(() => termInput.focus(), 100);
    }
  });
  
  document.getElementById("close-terminal")?.addEventListener("click", () => {
    terminal.classList.remove("active");
  });
  
  // Keyboard shortcut (backtick) to toggle terminal
  window.addEventListener("keydown", (e) => { 
    if (e.key === "`" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      terminal.classList.toggle("active");
      if (terminal.classList.contains("active")) {
        setTimeout(() => termInput.focus(), 100);
      }
    }
  });

  // Handle command input
  if (termInput) {
    termInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const cmd = termInput.value;
        // console.log("Terminal Input:", cmd); // Debug log
        termInput.value = "";
        
        // Don't show the command if it's "clear"
        if (cmd.trim().toLowerCase() !== "clear") {
          const cmdLine = document.createElement("div");
          cmdLine.className = "terminal-line";
          cmdLine.innerHTML = `<span class="terminal-prompt">${promptText}</span><span class="terminal-command-history">${cmd}</span>`;
          termOutput.appendChild(cmdLine);
        }
        
        try {
          const response = handleCommand(cmd);
          // console.log("Terminal Response:", response); // Debug log
          
          if (response.type !== outputTypes.NULL) {
            const respLine = document.createElement("div");
            respLine.className = "terminal-line command-output";
            
            // Add error class for error messages
            if (response.type === outputTypes.ERROR) {
              respLine.classList.add("error");
            }
            
            // Add HTML content or text content based on type
            if (response.type === outputTypes.HTML) {
              respLine.innerHTML = response.content;
            } else {
              respLine.textContent = response.content;
            }
            
            termOutput.appendChild(respLine);
          }
        } catch (error) {
          console.error("Terminal Error:", error);
          const errLine = document.createElement("div");
          errLine.className = "terminal-line command-output error";
          errLine.textContent = "System Error: " + error.message;
          termOutput.appendChild(errLine);
        }
        
        // Auto-scroll to bottom
        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });

    // Add command history navigation (arrow up/down)
    let commandHistory = [];
    let historyIndex = -1;
    
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          if (historyIndex < 0) {
            historyIndex = commandHistory.length - 1;
          } else if (historyIndex > 0) {
            historyIndex--;
          }
          termInput.value = commandHistory[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            termInput.value = commandHistory[historyIndex] || "";
          } else {
            historyIndex = commandHistory.length;
            termInput.value = "";
          }
        }
      } else if (e.key === "Enter") {
        // Add to history when command is entered
        const cmd = termInput.value.trim();
        if (cmd && cmd.toLowerCase() !== "clear") {
          commandHistory.push(cmd);
          historyIndex = commandHistory.length;
        }
      }
    });
  }

  // Add auto-completion for section names
  if (termInput) {
    termInput.addEventListener("input", (e) => {
      const value = termInput.value.trim();
      if (value.startsWith("goto ")) {
        const partial = value.substring(5).toLowerCase();
        const matches = Object.keys(sections).filter(section => 
          section.startsWith(partial) || sections[section].name.toLowerCase().startsWith(partial)
        );
        
        // Could implement auto-complete suggestion UI here
        if (matches.length === 1 && partial) {
          // Auto-complete logic (optional)
          // termInput.value = `goto ${matches[0]}`;
        }
      }
    });
  }

  // Close terminal via traffic light
  document.getElementById("close-terminal-traffic-light")?.addEventListener("click", () => {
    terminal.classList.remove("active");
  });
  
  // Initialize terminal on load
  initializeTerminal();
}