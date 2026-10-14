import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173/Portfolio/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForFunction(() => document.body.classList.contains("hero-ready"), null, { timeout: 15000 }).catch(() => {});
  await page.locator("#workbench-nav-trigger").click({ timeout: 15000 });
  await page.locator("#workbench-modal.active").waitFor({ state: "visible", timeout: 10000 });
  await page.locator('.workbench-mode-card[data-mode="ask"]').click();
  await page.locator("#workbench-pane-ask.active").waitFor({ state: "visible" });

  const messageList = page.locator("#workbench-chat-messages");
  assert.equal(await messageList.locator(".workbench-chat-bubble").count(), 0, "Chat should open empty");
  assert.equal(await page.locator("#workbench-ask-input").getAttribute("placeholder"),
    "Ask me about a project, technology, or engineering decision...");

  const input = page.locator("#workbench-ask-input");
  await input.fill("first line");
  await input.press("Shift+Enter");
  assert.match(await input.inputValue(), /first line\n$/);
  assert.equal(await messageList.locator(".workbench-chat-bubble.user").count(), 0, "Shift+Enter must not submit");
  await input.fill("");

  async function ask(question) {
    const before = await messageList.locator('.workbench-chat-bubble.assistant:not([data-typing="true"])').count();
    await input.fill(question);
    await input.press("Enter");
    await page.waitForFunction((previous) => {
      return document.querySelectorAll('#workbench-chat-messages .workbench-chat-bubble.assistant:not([data-typing="true"])').length > previous;
    }, before, { timeout: 15000 });
    const latest = messageList.locator('.workbench-chat-bubble.assistant:not([data-typing="true"])').last();
    await latest.waitFor({ state: "visible" });
    await latest.scrollIntoViewIfNeeded();
    return { locator: latest, text: await latest.innerText() };
  }

  // 1. List all projects from the live project dataset.
  let answer = await ask("What projects have you built?");
  assert.match(answer.text, /Enterprise-Ready RAG Agent/);
  assert.match(answer.text, /Vehicle Insurance MLOps Pipeline/);
  assert.match(answer.text, /10 software projects/);

  // 2. Rank architecture based on documented source fields; no invented score.
  answer = await ask("Which project has the strongest engineering architecture?");
  assert.match(answer.text, /documented stages/i);
  assert.doesNotMatch(answer.text, /100%|state-of-the-art|industry-leading/i);

  // 3. "that architecture" must refer to the prior answer's selected project.
  answer = await ask("Why did you choose that architecture?");
  assert.match(answer.text, /engineering decision|documents these engineering decisions|reasoning/i);

  // 4-5. Pronoun-based technology and deployment follow-ups.
  answer = await ask("What technologies does it use?");
  assert.match(answer.text, /Documented technologies/);
  assert.match(answer.text, /Python|Docker|FAISS|LangChain/);
  answer = await ask("How is it deployed?");
  assert.match(answer.text, /deployment|project data|demo|hosting|pipeline/i);

  // 6. Compare selected project to the explicit MLOps project.
  answer = await ask("Compare it with the MLOps project.");
  assert.match(answer.text, /Vehicle Insurance MLOps Pipeline/);
  assert.match(answer.text, /Crop Yield Prediction Model/);
  assert.match(answer.text, /avoid comparing a project against itself/i);
  assert.ok(await answer.locator.locator('.workbench-chat-project-link[data-open-project="mlops"]').count());

  // 7-8. Profile topics come from the verified profile knowledge base.
  answer = await ask("What research did you do at IIIT Hyderabad?");
  assert.match(answer.text, /Research Intern|Voice Activity Detection/i);
  answer = await ask("What is your current TCS status?");
  assert.match(answer.text, /offer accepted|awaiting|joining/i);
  assert.doesNotMatch(answer.text, /currently works as an active employee/i);

  // 9. Unrelated queries get a specific, concise unavailable-information answer.
  answer = await ask("Who won the Nobel Prize in Physics in 1980?");
  assert.match(answer.text, /couldn't find portfolio information/i);
  assert.doesNotMatch(answer.text, /Welcome to my portfolio assistant|verified information about that/i);

  // 10. "the second one" should resolve to the second project in the last relevant list.
  answer = await ask("Tell me more about the second one.");
  assert.match(answer.text, /Vehicle Insurance MLOps Pipeline/);

  // Click the project reference and confirm System Studio selects the matching item.
  await answer.locator.locator('.workbench-chat-project-link[data-open-project="mlops"]').click();
  await page.waitForFunction(() => {
    const studio = document.querySelector("#projects");
    return studio && !studio.classList.contains("studio-collapsed") &&
      document.querySelector('#finder-project-list .finder-nav-item.active[data-id="mlops"]');
  }, null, { timeout: 15000 });

  assert.deepEqual(pageErrors, [], "Browser console page errors were reported");
  console.log("PASS: conversational Workbench browser regression (10 prompt cases, follow-ups, input, project navigation)");
} finally {
  await browser.close();
}
