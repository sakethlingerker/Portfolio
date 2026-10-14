import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createPortfolioChat } from "../src/scripts/modules/workbench-chat.js";

const projectData = JSON.parse(await readFile(resolve(process.cwd(), "public/data/projects.json"), "utf8"));
const profile = {
  profile: {
    name: "Saketh Lingerker",
    role: "Incoming Systems Engineer @ Tata Consultancy Services (TCS Digital Offer Accepted, Awaiting Onboarding)",
    education: "B.Tech in Computer Science & Engineering from JNTUH University College of Engineering, Manthani (2021–2025, CGPA: 7.47/10.0)",
    summary: "Computer Science Engineer specializing in practical AI/ML systems and production-ready web applications.",
    contact: "Email: saketh1805@gmail.com",
    truthRules: ["TCS offer accepted; awaiting official onboarding."]
  },
  experience: [
    { company: "Tata Consultancy Services (TCS iON)", role: "Systems Engineer Offer Accepted", period: "Jul 2025 – Awaiting Joining", details: "Offer accepted; awaiting official joining." },
    { company: "IIIT Hyderabad", role: "AI/ML Research Intern", period: "Nov 2024 – Jun 2025", details: "Worked on Voice Activity Detection (VAD) and acoustic feature evaluation." }
  ],
  certifications: [
    { name: "TCS iON NPT – GET IT", score: "89%", type: "Professional Assessment" },
    { name: "TCS iON NQT – Cognitive", score: "91.51% percentile", type: "Cognitive Assessment" }
  ],
  skills: { languages: ["Python", "JavaScript", "SQL"], ai_ml: ["LangChain", "FAISS", "Scikit-Learn"] }
};

function createChat() {
  return createPortfolioChat(projectData, profile);
}

test("lists every project from public/data/projects.json", () => {
  const chat = createChat();
  const result = chat.answer("What projects have you built?");
  assert.equal(Object.keys(projectData).length, 10);
  assert.match(result.html, /10 software projects/);
  for (const project of Object.values(projectData)) {
    assert.ok(result.html.includes(project.title), "Missing project: " + project.title);
  }
});

test("resolves ordinal follow-up after the project list", () => {
  const chat = createChat();
  chat.answer("What projects have you built?");
  const result = chat.answer("Tell me more about the second one.");
  assert.match(result.html, /Vehicle Insurance MLOps Pipeline/);
  assert.match(result.html, /data-open-project="mlops"/);
});

test("selects a documented architecture candidate and preserves that context", () => {
  const chat = createChat();
  const first = chat.answer("Which project has the strongest engineering architecture?");
  assert.match(first.html, /documented stages/i);
  const followUp = chat.answer("Why did you choose that architecture?");
  assert.match(followUp.html, /engineering decision|portfolio documents|document/i);
  assert.match(followUp.html, /data-open-project=/);
});

test("answers project technology and deployment follow-ups using the selected project", () => {
  const chat = createChat();
  chat.answer("Which project has the strongest engineering architecture?");
  const technology = chat.answer("What technologies does it use?");
  assert.match(technology.html, /Documented technologies/);
  assert.match(technology.html, /Python|Docker|FAISS|LangChain/);
  const deployment = chat.answer("How is it deployed?");
  assert.match(deployment.html, /deployment|project data|demo|hosting|pipeline/i);
});

test("compares current context with the MLOps project", () => {
  const chat = createChat();
  chat.answer("Tell me about your projects.");
  const result = chat.answer("Compare it with the MLOps project.");
  assert.match(result.html, /workbench-chat-compare/);
  assert.match(result.html, /Enterprise-Ready RAG Agent/);
  assert.match(result.html, /Vehicle Insurance MLOps Pipeline/);
});

test("answers IIIT Hyderabad research and TCS status from profile knowledge", () => {
  const chat = createChat();
  const research = chat.answer("What research did you do at IIIT Hyderabad?");
  assert.match(research.html, /AI\/ML Research Intern/);
  assert.match(research.html, /Voice Activity Detection/);
  const tcs = chat.answer("What is your current TCS status?");
  assert.match(tcs.html, /Offer accepted/);
  assert.match(tcs.html, /not documented|joining|offer/i);
});

test("retrieves profile skills, education and assessments without mixing them with projects", () => {
  const chat = createChat();
  assert.match(chat.answer("What are your technical skills?").html, /Python/);
  assert.match(chat.answer("Where did you study?").html, /JNTUH/);
  assert.match(chat.answer("What is your NQT score?").html, /91\.51%/);
});

test("returns a specific unavailable-information response for unrelated questions", () => {
  const chat = createChat();
  const result = chat.answer("Who won the Nobel Prize in Physics in 1980?");
  assert.match(result.html, /couldn't find portfolio information/i);
  assert.doesNotMatch(result.html, /Welcome to my portfolio assistant/i);
  assert.doesNotMatch(result.html, /You can ask about his projects.*verified credentials/i);
});

test("preserves conversation state across multiple questions", () => {
  const chat = createChat();
  chat.answer("Tell me about the Enterprise RAG project.");
  chat.answer("Why did you choose that architecture?");
  const context = chat.getContext();
  assert.equal(context.selectedProjectId, "enterprise_rag");
  assert.equal(chat.getHistory().length, 2);
});
