/**
 * Local, retrieval-grounded conversation engine for Engineering Workbench.
 * Source of truth: public/data/projects.json plus the verified profile knowledge
 * passed in from workbench.js. This is not an LLM integration.
 */

const STOP_WORDS = new Set([
  "a","an","and","are","as","at","be","been","but","by","can","could","did","do","does","for","from",
  "has","have","how","i","in","into","is","it","its","me","my","of","on","or","our","please","should",
  "so","tell","that","the","their","them","there","these","they","this","those","to","use","used","using",
  "was","we","were","what","when","where","which","who","why","will","with","would","you","your",
  "project","projects","work","built","build","about","more","one","ones"
]);

const PROJECT_ALIASES = {
  enterprise_rag: ["enterprise rag", "rag agent", "rag", "document q and a", "document qa", "document question answering"],
  mlops: ["mlops", "vehicle insurance", "insurance pipeline", "vehicle insurance pipeline"],
  smart_feedback: ["smart feedback", "feedback collection", "feedback analysis", "feedback system"],
  ats_resume: ["ats resume", "resume expert", "resume tracking", "ats tool"],
  crop_yield: ["crop yield", "yield prediction", "crop prediction"],
  clearview: ["clearview", "air quality", "air quality insights"],
  interior_design: ["ai interior", "interior design", "interior designer", "virtual interior designer"],
  flight_fare: ["flight fare", "flight price", "flight prediction", "fare prediction"],
  polyglot: ["polyglot", "language detection", "language translation", "language classifier"],
  cloudcast: ["cloudcast", "weather app", "weather application"]
};

const INTENT_TERMS = {
  list: ["all my projects", "what projects", "which projects", "list projects", "projects have you built", "tell me about your projects", "show me your projects"],
  compare: ["compare", "comparison", "versus", "vs", "difference between"],
  decision: ["why", "tradeoff", "trade off", "engineering decision", "design decision", "why choose", "why did you choose"],
  deployment: ["deploy", "deployed", "deployment", "hosting", "hosted", "production", "release", "ci cd", "cloud"],
  technology: ["technology", "technologies", "tech stack", "framework", "libraries", "tools used", "what stack"],
  architecture: ["architecture", "system design", "pipeline", "stages", "components", "flow"],
  challenge: ["challenge", "challenges", "difficult", "difficulty", "bottleneck", "tradeoff", "trade off"],
  impact: ["impact", "result", "results", "metric", "metrics", "performance", "outcome", "improvement", "accuracy"],
  features: ["features", "functionality", "capabilities", "what can it do"],
  problem: ["problem", "solution", "solve", "solved", "objective", "purpose", "why was it needed"],
  overview: ["overview", "explain", "describe", "tell me more", "what is", "how does it work", "how it works"]
};

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
  });
}

export function normalizeChatQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9.+#/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensOf(value) {
  return normalizeChatQuery(value)
    .split(" ")
    .filter(function (token) {
      return token.length > 1 && !STOP_WORDS.has(token);
    });
}

function includesAny(query, phrases) {
  return phrases.some(function (phrase) {
    return query.includes(normalizeChatQuery(phrase));
  });
}

function valuesFromProjects(projectsSource) {
  const source = typeof projectsSource === "function" ? projectsSource() : projectsSource;
  if (Array.isArray(source)) return source.filter(Boolean);
  return Object.values(source || {}).filter(Boolean);
}

function projectById(projects, id) {
  return projects.find(function (project) { return project.id === id; }) || null;
}

function stageText(stage) {
  return [
    stage.name, stage.category, (stage.tech || stage.technologies || []).join(" "),
    stage.inputs, stage.outputs, stage.responsibility, stage.responsibilities,
    stage.engineeringDecision, stage.engineeringDecisions
  ].filter(Boolean).join(" ");
}

function projectText(project) {
  const tech = (project.techStackDetailed || []).map(function (item) { return item.name || item; }).join(" ");
  const impact = (project.quantifiableImpact || []).map(function (item) { return item.value + " " + item.label; }).join(" ");
  const stages = (project.architectureStages || []).map(stageText).join(" ");
  return [
    project.title, project.subtitle, project.category, (project.tags || []).join(" "),
    project.overview, project.problem, project.solution, (project.architecture || []).join(" "),
    stages, (project.keyFeatures || []).join(" "), tech, impact, project.challenges,
    (project.lessonsLearned || []).join ? project.lessonsLearned.join(" ") : project.lessonsLearned,
    (project.engineeringDecisions || []).join ? project.engineeringDecisions.join(" ") : project.engineeringDecisions
  ].filter(Boolean).join(" ");
}

function findExplicitProjectIds(query, projects) {
  const normalized = normalizeChatQuery(query);
  const matches = [];
  projects.forEach(function (project) {
    const aliases = [project.title, project.id.replace(/_/g, " ")].concat(PROJECT_ALIASES[project.id] || []);
    const matchedAlias = aliases
      .filter(Boolean)
      .sort(function (a, b) { return normalizeChatQuery(b).length - normalizeChatQuery(a).length; })
      .some(function (alias) {
        const cleanAlias = normalizeChatQuery(alias);
        return cleanAlias.length > 2 && (" " + normalized + " ").includes(" " + cleanAlias + " ");
      });
    if (matchedAlias) matches.push(project.id);
  });
  return matches;
}

function scoreProject(query, project) {
  const qTokens = Array.from(new Set(tokensOf(query)));
  const title = normalizeChatQuery(project.title);
  const tags = normalizeChatQuery((project.tags || []).join(" "));
  const tech = normalizeChatQuery((project.techStackDetailed || []).map(function (item) { return item.name || item; }).join(" "));
  const overview = normalizeChatQuery([project.subtitle, project.overview].filter(Boolean).join(" "));
  const details = normalizeChatQuery([
    project.problem, project.solution, (project.architecture || []).join(" "),
    (project.architectureStages || []).map(stageText).join(" "),
    (project.keyFeatures || []).join(" "), project.challenges
  ].filter(Boolean).join(" "));
  let score = 0;
  qTokens.forEach(function (token) {
    if (title.includes(token)) score += token.length > 3 ? 6 : 3;
    if (tags.includes(token)) score += 3;
    if (tech.includes(token)) score += 3;
    if (overview.includes(token)) score += 2;
    if (details.includes(token)) score += 1;
  });
  if (qTokens.length > 1 && title.includes(qTokens.join(" "))) score += 10;
  return score;
}

function detectIntent(query) {
  const q = normalizeChatQuery(query);
  if (includesAny(q, INTENT_TERMS.compare)) return "compare";
  if (includesAny(q, INTENT_TERMS.list) || /\b(all|list|show)\b.*\bprojects\b/.test(q)) return "list";
  if (/\b(best|strongest|most complex|most advanced|most sophisticated)\b/.test(q) &&
      /\b(project|architecture|engineering|system|work)\b/.test(q)) return "best";
  if (/\b(which project|what project)\b/.test(q) && /\b(architecture|strongest|best|complex)\b/.test(q)) return "best";
  if (includesAny(q, INTENT_TERMS.decision) || /\bwhy\b/.test(q)) return "decision";
  if (includesAny(q, INTENT_TERMS.challenge)) return "challenge";
  if (includesAny(q, INTENT_TERMS.deployment)) return "deployment";
  if (includesAny(q, INTENT_TERMS.technology)) return "technology";
  if (includesAny(q, INTENT_TERMS.architecture)) return "architecture";
  if (includesAny(q, INTENT_TERMS.impact)) return "impact";
  if (includesAny(q, INTENT_TERMS.features)) return "features";
  if (includesAny(q, INTENT_TERMS.problem)) return "problem";
  if (includesAny(q, INTENT_TERMS.overview)) return "overview";
  return "overview";
}

function detectProfileIntent(query, knowledgeBase, hasProjectContext) {
  const q = normalizeChatQuery(query);
  if (/\b(tcs|tata consultancy|onboarding|joining letter|employment status|current job|offer status|systems engineer offer)\b/.test(q)) return "tcs";
  if (/\b(iiit|research internship|research intern|voice activity|vad|acoustic feature|research work)\b/.test(q)) return "research";
  if (/\b(certifications?|credentials?|nqt|get it assessment|exam score|assessment score|certificate)\b/.test(q)) return "certifications";
  if (/\b(education|college|degree|jntuh|cgpa|gpa|b tech|btech|university|study|studied|academic|school)\b/.test(q)) return "education";
  if (/\b(contact|email address|phone number|linkedin|github profile|hire you|reach you)\b/.test(q)) return "contact";
  const generalSkillsQuestion = /\b(my|your) (technical )?skills\b|\bskill set\b|\bwhat (programming )?languages do you know\b|\bwhat technologies do you know\b|\btech stack\b/.test(q);
  if (generalSkillsQuestion && !hasProjectContext && !/\b(used|uses|use in|project|it)\b/.test(q)) return "skills";
  if (/\b(who are you|about saketh|about me|tell me about yourself)\b/.test(q)) return "profile";
  if (!hasProjectContext && /\b(technologies do you use|what technologies are you familiar with)\b/.test(q)) return "skills";
  return "";
}

function findOrdinalProjectId(query, lastListProjectIds) {
  const q = normalizeChatQuery(query);
  let index = -1;
  if (/\b(first|1st|number one|number 1)\b/.test(q)) index = 0;
  if (/\b(second|2nd|number two|number 2)\b/.test(q)) index = 1;
  if (/\b(third|3rd|number three|number 3)\b/.test(q)) index = 2;
  if (/\b(fourth|4th|number four|number 4)\b/.test(q)) index = 3;
  return index >= 0 && lastListProjectIds[index] ? lastListProjectIds[index] : "";
}

function asText(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(" ");
  if (typeof value === "object") return Object.values(value).map(asText).filter(Boolean).join(" ");
  return String(value);
}

function projectButton(project, label) {
  return '<button type="button" class="workbench-chat-project-link" data-open-project="' +
    escapeHtml(project.id) + '">' + escapeHtml(label || ("Open " + project.title + " in System Studio")) + ' <span aria-hidden="true">↗</span></button>';
}

function externalLink(url, label) {
  if (!url || !/^https:\/\/[^\s"'<>]+$/i.test(url)) return "";
  return '<a class="workbench-chat-external-link" href="' + escapeHtml(url) +
    '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ↗</a>';
}

function renderBullets(items) {
  if (!items || !items.length) return "";
  return "<ul>" + items.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") + "</ul>";
}

function techList(project) {
  const names = (project.techStackDetailed || []).map(function (item) { return item.name || item; });
  (project.architectureStages || []).forEach(function (stage) {
    (stage.tech || stage.technologies || []).forEach(function (tech) {
      names.push(typeof tech === "string" ? tech : tech.name);
    });
  });
  return Array.from(new Set(names.filter(Boolean)));
}

function architectureDocScore(project) {
  const stages = project.architectureStages || [];
  const documentedStages = stages.filter(function (stage) {
    return Boolean(stage.name && (stage.inputs || stage.outputs) && (stage.responsibility || stage.engineeringDecision || stage.engineeringDecisions));
  }).length;
  const decisionCount = stages.filter(function (stage) { return Boolean(stage.engineeringDecision || stage.engineeringDecisions); }).length;
  const cloudTerms = normalizeChatQuery(projectText(project));
  const deploymentEvidence = /\b(aws|ec2|ecr|s3|docker|ci cd|deployment|deployed|production)\b/.test(cloudTerms) ? 2 : 0;
  return stages.length * 2 + documentedStages + decisionCount + Math.min(techList(project).length, 10) + (project.quantifiableImpact || []).length + deploymentEvidence;
}

function projectLinkArea(project) {
  const links = project.links || {};
  return '<div class="workbench-chat-actions">' + projectButton(project) +
    externalLink(links.github, "GitHub") + externalLink(links.demo, "Live demo") + "</div>";
}

function renderProjectList(projects) {
  return '<p>The portfolio data contains <strong>' + projects.length + ' software projects</strong>:</p><ol class="workbench-chat-project-list">' +
    projects.map(function (project) {
      return '<li><div><strong>' + escapeHtml(project.title) + '</strong><span>' +
        escapeHtml(project.subtitle || project.overview || "Project details are available in the portfolio data.") +
        '</span></div>' + projectButton(project, "View in Studio") + '</li>';
    }).join("") + "</ol>";
}

function renderComparison(a, b) {
  function col(project) {
    const impacts = (project.quantifiableImpact || []).map(function (item) { return item.value + " — " + item.label; });
    return '<section class="workbench-chat-compare-column"><h4>' + escapeHtml(project.title) + '</h4>' +
      '<p><strong>Problem</strong><br>' + escapeHtml(project.problem || "Not documented in the project data.") + '</p>' +
      '<p><strong>Approach</strong><br>' + escapeHtml(project.solution || project.overview || "Not documented in the project data.") + '</p>' +
      '<p><strong>Technologies</strong><br>' + escapeHtml(techList(project).join(", ") || "Not documented") + '</p>' +
      '<p><strong>Documented impact</strong><br>' + escapeHtml(impacts.join("; ") || "No quantified impact is listed.") + '</p>' +
      projectLinkArea(project) + '</section>';
  }
  return "<p>Here is a source-based comparison of the two projects.</p><div class=\"workbench-chat-compare\">" + col(a) + col(b) + "</div>";
}

function profileAnswer(intent, knowledgeBase, question) {
  const kb = knowledgeBase || {};
  const profile = kb.profile || {};
  const experience = kb.experience || [];
  const certifications = kb.certifications || [];
  if (intent === "tcs") {
    const tcs = experience.find(function (item) { return /tcs|tata consultancy/i.test(item.company || ""); });
    return "<p><strong>TCS status:</strong> " + escapeHtml(profile.role || (tcs ? tcs.role : "TCS offer information")) + ".</p>" +
      "<p>" + escapeHtml(tcs ? tcs.details : "The verified profile knowledge base does not contain further TCS details.") + "</p>" +
      "<p>The portfolio records an accepted offer, not completed employment. A confirmed joining date is not documented here.</p>";
  }
  if (intent === "research") {
    const item = experience.find(function (entry) { return /iiit|research/i.test((entry.company || "") + " " + (entry.role || "")); });
    if (!item) return "<p>The current profile knowledge base does not contain a detailed research-internship record.</p>";
    return "<p><strong>" + escapeHtml(item.role) + " — " + escapeHtml(item.company) + "</strong></p>" +
      "<p><strong>Period:</strong> " + escapeHtml(item.period || "Not specified") + "</p><p>" + escapeHtml(item.details) + "</p>";
  }
  if (intent === "certifications") {
    return "<p>The profile knowledge base lists these certifications and assessments:</p><ul>" + certifications.map(function (item) {
      return "<li><strong>" + escapeHtml(item.name) + "</strong>" +
        (item.score ? " — " + escapeHtml(item.score) : "") +
        (item.type ? " <span>(" + escapeHtml(item.type) + ")</span>" : "") + "</li>";
    }).join("") + "</ul>";
  }
  if (intent === "education") {
    return "<p><strong>Education</strong></p><p>" + escapeHtml(profile.education || "Education details are not present in the profile knowledge base.") + "</p>";
  }
  if (intent === "skills") {
    const groups = kb.skills || profile.skills || {};
    const names = Object.entries(groups).map(function (entry) {
      return "<li><strong>" + escapeHtml(entry[0].replace(/_/g, " ")) + ":</strong> " + escapeHtml(asText(entry[1])) + "</li>";
    }).join("");
    return "<p><strong>Technical skills listed in the profile</strong></p><ul>" + names + "</ul>";
  }
  if (intent === "contact") {
    return "<p><strong>Contact and profiles</strong></p><p>" + escapeHtml(profile.contact || "Contact details are not documented in the profile knowledge base.") + "</p>";
  }
  if (intent === "profile") {
    return "<p><strong>" + escapeHtml(profile.name || "Profile") + "</strong></p><p>" +
      escapeHtml(profile.summary || "A profile summary is not available in the current portfolio data.") + "</p><p>" +
      escapeHtml(profile.education || "") + "</p>";
  }
  return "<p>I couldn't find profile information related to “" + escapeHtml(question) + "” in the available portfolio sources.</p>";
}

function projectAnswer(project, intent) {
  const title = "<p><strong>" + escapeHtml(project.title) + "</strong></p>";
  const stages = project.architectureStages || [];
  const allTech = techList(project);
  if (intent === "technology") {
    return title + "<p><strong>Documented technologies:</strong> " + escapeHtml(allTech.join(", ") || "No technology list is available for this project.") + ".</p>" +
      projectLinkArea(project);
  }
  if (intent === "deployment") {
    const evidenceStages = stages.filter(function (stage) {
      return /\b(deploy|deployment|host|hosting|production|release|ci cd|aws|ec2|ecr|container|streamlit cloud|live service)\b/i.test(stageText(stage));
    });
    const architectureText = (project.architecture || []).filter(function (line) {
      return /\b(deploy|deployment|host|hosting|production|release|ci cd|aws|ec2|ecr|container)\b/i.test(line);
    });
    let body = "";
    if (evidenceStages.length || architectureText.length) {
      body += "<p>Deployment-related details documented in the project:</p>" + renderBullets(
        architectureText.concat(evidenceStages.map(function (stage) {
          return stage.name + ": " + [stage.outputs, stage.responsibility, stage.engineeringDecision].filter(Boolean).join(" ");
        })).slice(0, 4)
      );
    } else {
      body += "<p>The project data does not describe a full deployment pipeline or hosting configuration.</p>";
    }
    if (project.links && project.links.demo) {
      body += "<p>A live demo link is listed in the portfolio: " + externalLink(project.links.demo, "Open demo") + ". The link alone does not establish other infrastructure details.</p>";
    }
    return title + body + projectLinkArea(project);
  }
  if (intent === "challenge") {
    const lessons = asText(project.lessonsLearned);
    return title + "<p><strong>Documented challenge:</strong> " + escapeHtml(project.challenges || "A specific challenge is not documented for this project.") + "</p>" +
      (lessons ? "<p><strong>Lessons learned:</strong> " + escapeHtml(lessons) + "</p>" : "") + projectLinkArea(project);
  }
  if (intent === "impact") {
    const impacts = (project.quantifiableImpact || []).map(function (item) { return item.value + " — " + item.label; });
    return title + (impacts.length ? "<p><strong>Results recorded in the project data</strong></p>" + renderBullets(impacts) :
      "<p>The current project data does not list quantified results or measured performance metrics.</p>") + projectLinkArea(project);
  }
  if (intent === "features") {
    return title + (project.keyFeatures && project.keyFeatures.length ?
      "<p><strong>Key features</strong></p>" + renderBullets(project.keyFeatures) :
      "<p>Feature details are not listed for this project.</p>") + projectLinkArea(project);
  }
  if (intent === "decision") {
    const decisions = stages.map(function (stage) {
      const decision = stage.engineeringDecision || stage.engineeringDecisions;
      return decision ? stage.name + ": " + asText(decision) : "";
    }).filter(Boolean);
    const legacyDecisions = asText(project.engineeringDecisions);
    if (!decisions.length && legacyDecisions) decisions.push(legacyDecisions);
    return title + (decisions.length ?
      "<p>The portfolio documents these engineering decisions; it does not record a separate explanation for every decision.</p>" +
      renderBullets(decisions.slice(0, 4)) :
      "<p>The project data describes its architecture but does not document the reasoning behind the design choices in enough detail to answer that precisely.</p>") +
      projectLinkArea(project);
  }
  if (intent === "architecture") {
    if (!stages.length) return title + "<p>Stage-by-stage architecture details are unavailable in the project data.</p>" + projectLinkArea(project);
    return title + "<p>The documented architecture has " + stages.length + " stages:</p>" +
      renderBullets(stages.map(function (stage, index) {
        return (stage.stageNumber || index + 1) + ". " + stage.name + (stage.responsibility ? " — " + stage.responsibility : "");
      })) + '<button type="button" class="workbench-chat-project-link" data-inspect-arch="' +
      escapeHtml(project.id) + '">Inspect architecture stages <span aria-hidden="true">↗</span></button>' + projectLinkArea(project);
  }
  if (intent === "problem") {
    return title + "<p><strong>Problem</strong><br>" + escapeHtml(project.problem || "Not documented in project data.") + "</p>" +
      "<p><strong>Solution</strong><br>" + escapeHtml(project.solution || "Not documented in project data.") + "</p>" + projectLinkArea(project);
  }
  return title + "<p>" + escapeHtml(project.overview || project.subtitle || "A summary is not available in the project data.") + "</p>" +
    (project.keyFeatures && project.keyFeatures.length ? "<p><strong>Key features</strong></p>" + renderBullets(project.keyFeatures.slice(0, 4)) : "") +
    projectLinkArea(project);
}

function bestArchitectureAnswer(projects) {
  const ranked = projects.filter(function (project) {
    return (project.architectureStages || []).length > 0;
  }).sort(function (a, b) {
    return architectureDocScore(b) - architectureDocScore(a);
  });
  const candidates = ranked.slice(0, Math.min(2, ranked.length));
  const rows = candidates.map(function (project) {
    const stageCount = (project.architectureStages || []).length;
    const techNames = techList(project);
    const focus = project.id === "enterprise_rag" ? "document ingestion, retrieval, grounded generation, and citation verification" :
      project.id === "mlops" ? "data validation, model evaluation, containerization, and automated delivery" :
      (project.subtitle || project.overview || "");
    return "<li><strong>" + escapeHtml(project.title) + "</strong> — " + stageCount +
      " documented architecture stages. " + escapeHtml(focus) + "<br>" +
      projectButton(project, "Inspect this project") + "</li>";
  }).join("");
  return "<p>The portfolio doesn't define an objectively “best” architecture. Based on the depth of documented stages, decisions, technology details, and impact fields, these are strong candidates to inspect:</p>" +
    "<ol>" + rows + "</ol><p>The RAG project is a useful reference for retrieval and grounded answers; the MLOps pipeline is a useful reference for automated training and cloud delivery. The right choice depends on which engineering problem you want to evaluate.</p>";
}

export function createPortfolioChat(projectsSource, knowledgeBase) {
  const state = {
    history: [],
    selectedProjectId: "",
    lastListProjectIds: []
  };

  function record(question, html, projectIds) {
    state.history.push({ question: question, answer: html, projectIds: projectIds.slice() });
    if (state.history.length > 12) state.history.shift();
    return { html: html, projectIds: projectIds.slice(), historyLength: state.history.length };
  }

  function answer(questionText) {
    const question = String(questionText || "").trim();
    if (!question) return { html: "", projectIds: [], historyLength: state.history.length };
    const projects = valuesFromProjects(projectsSource);
    const query = normalizeChatQuery(question);
    if (!projects.length) {
      return record(question, "<p>Portfolio project data is currently unavailable, so I couldn't retrieve a grounded answer.</p>", []);
    }

    const projectContextExists = Boolean(state.selectedProjectId);
    const profileIntent = detectProfileIntent(query, knowledgeBase, projectContextExists);
    if (profileIntent) return record(question, profileAnswer(profileIntent, knowledgeBase, question), []);

    const intent = detectIntent(query);
    const allIds = projects.map(function (project) { return project.id; });

    if (intent === "list") {
      state.lastListProjectIds = allIds.slice();
      state.selectedProjectId = "";
      return record(question, renderProjectList(projects), allIds);
    }

    if (intent === "best") {
      const html = bestArchitectureAnswer(projects);
      const ranked = projects.filter(function (project) { return (project.architectureStages || []).length > 0; })
        .sort(function (a, b) { return architectureDocScore(b) - architectureDocScore(a); }).slice(0, 2);
      const ids = ranked.map(function (project) { return project.id; });
      state.lastListProjectIds = ids.slice();
      state.selectedProjectId = ids[0] || "";
      return record(question, html, ids);
    }

    let ids = findExplicitProjectIds(question, projects);
    const ordinalId = findOrdinalProjectId(question, state.lastListProjectIds);
    const refersToContext = /\b(it|its|that|this|the project|that project|this project|that architecture|the second one|those two|them)\b/.test(query);
    if (ordinalId) {
      ids = [ordinalId];
    } else if (ids.length && refersToContext && state.selectedProjectId && !ids.includes(state.selectedProjectId)) {
      ids = [state.selectedProjectId].concat(ids.filter(function (id) { return id !== state.selectedProjectId; }));
    } else if (!ids.length && refersToContext && state.selectedProjectId) {
      ids = [state.selectedProjectId];
    } else if (!ids.length && state.selectedProjectId && ["technology","deployment","challenge","impact","features","architecture","decision","problem","overview"].includes(intent) &&
               !/\b(my skills|your skills|what technologies do you know|tech stack)\b/.test(query)) {
      ids = [state.selectedProjectId];
    }

    if (intent === "compare") {
      if (ids.length < 2 && state.lastListProjectIds.length >= 2) {
        const selected = state.selectedProjectId || state.lastListProjectIds[0];
        const other = ids.find(function (id) { return id !== selected; }) ||
          state.lastListProjectIds.find(function (id) { return id !== selected; });
        ids = [selected, other].filter(Boolean);
      }
      if (ids.length < 2) {
        const ranked = projects.map(function (project) {
          return { project: project, score: scoreProject(query, project) };
        }).sort(function (a, b) { return b.score - a.score; });
        ids = ids.concat(ranked.map(function (item) { return item.project.id; }.bind(null)).filter(function (id) { return !ids.includes(id); })).slice(0, 2);
      }
      const a = projectById(projects, ids[0]);
      const b = projectById(projects, ids[1]);
      if (a && b) {
        state.lastListProjectIds = [a.id, b.id];
        state.selectedProjectId = a.id;
        return record(question, renderComparison(a, b), [a.id, b.id]);
      }
      return record(question, "<p>I couldn't identify two projects in the available portfolio data to compare.</p>", []);
    }

    if (!ids.length) {
      const ranked = projects.map(function (project) {
        return { project: project, score: scoreProject(query, project) };
      }).sort(function (a, b) { return b.score - a.score; });
      const meaningful = ranked.filter(function (item) { return item.score >= 3; });
      if (meaningful.length) ids = [meaningful[0].project.id];
    }

    const project = projectById(projects, ids[0]);
    if (!project) {
      return record(question, "<p>I couldn't find portfolio information about “" + escapeHtml(question) + "” in the available sources.</p>", []);
    }
    state.selectedProjectId = project.id;
    if (ids.length > 1) state.lastListProjectIds = ids.slice();
    const html = projectAnswer(project, intent);
    return record(question, html, [project.id]);
  }

  return {
    answer: answer,
    getHistory: function () { return state.history.slice(); },
    getContext: function () {
      return { selectedProjectId: state.selectedProjectId, lastListProjectIds: state.lastListProjectIds.slice() };
    },
    clear: function () {
      state.history = [];
      state.selectedProjectId = "";
      state.lastListProjectIds = [];
    }
  };
}
