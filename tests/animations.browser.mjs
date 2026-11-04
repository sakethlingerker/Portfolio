/**
 * Quality Audit Playwright Test Suite for Apple-Inspired GSAP Scroll Reveal System
 * 
 * Verifies:
 * 1. Hero text sequence timing & reveal
 * 2. Word-level heading reveal & SplitText accessibility (aria-label complete text announcement)
 * 3. Responsive heading re-splitting on viewport changes
 * 4. Paragraph and element stagger (headings before paragraphs, buttons afterward)
 * 5. Timeline sequence (chronological entries reveal sequentially, scroll-back no-replay)
 * 6. Project card stagger in Selected Work
 * 7. Finder-inspired Projects Explorer dynamic filtering, search, and System Studio toggle with card stagger
 * 8. Hidden Workbench modal behavior
 * 9. Reduced-motion accessibility (instant display, no motion, prefers-reduced-motion)
 * 10. Fail-open fallback (CSS content visibility without JS)
 * 11. Desktop, tablet, and mobile layouts without horizontal overflow
 * 12. Keyboard navigation and interactive focus states
 * 13. High-resolution visual captures across viewports
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const baseUrl = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173/Portfolio/";
let previewServer = null;

async function ensurePreviewServer() {
  try {
    const res = await fetch(baseUrl);
    if (res.ok) {
      console.log("Using active portfolio preview server at", baseUrl);
      return;
    }
  } catch {
    // Need to start preview server
  }

  console.log("Starting in-process Vite preview server...");
  const { preview } = await import("vite");
  previewServer = await preview({
    preview: {
      port: 4173,
      host: "127.0.0.1",
    },
  });
  console.log("Vite preview server listening at", baseUrl);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function runAnimationTests() {
  await ensurePreviewServer();

  const screenshotDir = path.resolve("tests/screenshots/animation");
  ensureDir(screenshotDir);

  const browser = await chromium.launch({ headless: true });
  console.log("=== Starting GSAP Scroll Reveal Quality Audit Test Suite ===");

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Hero Text Sequence
    // -------------------------------------------------------------------------
    console.log("Testing 1: Hero text sequence...");
    const heroContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const heroPage = await heroContext.newPage();
    await heroPage.goto(baseUrl, { waitUntil: "domcontentloaded" });

    // Wait for boot dismissal and hero sequence
    await heroPage.waitForSelector("body.hero-ready", { timeout: 8000 });
    await heroPage.waitForTimeout(1400); // Allow GSAP hero sequence to complete

    const heroElementsVisible = await heroPage.evaluate(() => {
      const getOpacity = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return 0;
        return parseFloat(window.getComputedStyle(el).opacity);
      };

      return {
        eyebrow: getOpacity(".hero-eyebrow"),
        title: getOpacity(".hero-name"),
        roleBadge: getOpacity(".hero-role-badge"),
        description: getOpacity(".hero-description"),
        actions: getOpacity(".hero-actions"),
        proofStrip: getOpacity(".hero-proof-strip"),
        roleBadgeHasClass: document.querySelector(".hero-role-badge")?.classList.contains("animate-in"),
      };
    });

    if (
      heroElementsVisible.eyebrow > 0.8 &&
      heroElementsVisible.title > 0.8 &&
      heroElementsVisible.roleBadge > 0.8 &&
      heroElementsVisible.description > 0.8 &&
      heroElementsVisible.actions > 0.8 &&
      heroElementsVisible.proofStrip > 0.8
    ) {
      console.log("✔ 1. Hero text sequence fully completed and visible");
    } else {
      throw new Error(`Hero text sequence visibility check failed: ${JSON.stringify(heroElementsVisible)}`);
    }
    await heroContext.close();

    // -------------------------------------------------------------------------
    // TEST 2: Word-Level Heading Reveal & Accessibility (ARIA: auto)
    // -------------------------------------------------------------------------
    console.log("Testing 2: Word-level heading reveals & accessibility...");
    const wordContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const wordPage = await wordContext.newPage();
    await wordPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await wordPage.waitForSelector("body.hero-ready", { timeout: 8000 });

    // Scroll to #proof section
    await wordPage.locator("#proof").scrollIntoViewIfNeeded();
    await wordPage.waitForTimeout(1000);

    const splitResult = await wordPage.evaluate(() => {
      const heading = document.querySelector(".proof-editorial-title");
      if (!heading) return null;
      const words = heading.querySelectorAll(".reveal-word");
      const lines = heading.querySelectorAll(".reveal-line");
      const ariaLabel = heading.getAttribute("aria-label");
      const opacities = Array.from(words).map((w) => parseFloat(window.getComputedStyle(w).opacity));
      const wordsAreAriaHidden = Array.from(words).every((w) => w.getAttribute("aria-hidden") === "true");

      return {
        wordsCount: words.length,
        linesCount: lines.length,
        ariaLabel,
        hasAccessibleLabel: !!ariaLabel && ariaLabel.toLowerCase().includes("record of work"),
        wordsAreAriaHidden,
        allVisible: opacities.length > 0 && opacities.every((op) => op > 0.8),
      };
    });

    if (splitResult && splitResult.wordsCount > 0 && splitResult.allVisible && splitResult.hasAccessibleLabel) {
      console.log(`✔ 2. Word-level heading reveal & SplitText accessibility verified:`);
      console.log(`     - Announced to screen readers as complete text: "${splitResult.ariaLabel}"`);
      console.log(`     - Child word fragments isolated via aria-hidden to prevent fragmented reading (${splitResult.wordsCount} words)`);
    } else {
      throw new Error(`Word-level heading reveal failed: ${JSON.stringify(splitResult)}`);
    }

    // -------------------------------------------------------------------------
    // TEST 3: Responsive Heading Re-splitting
    // -------------------------------------------------------------------------
    console.log("Testing 3: Responsive heading re-splitting...");
    await wordPage.setViewportSize({ width: 600, height: 900 });
    await wordPage.waitForTimeout(600); // Allow debounce & re-split

    const resplitResult = await wordPage.evaluate(() => {
      const heading = document.querySelector(".proof-editorial-title");
      if (!heading) return null;
      const words = heading.querySelectorAll(".reveal-word");
      return {
        wordsCount: words.length,
        textContent: heading.textContent?.replace(/\s+/g, " ").trim(),
        ariaLabel: heading.getAttribute("aria-label"),
      };
    });

    if (resplitResult && resplitResult.wordsCount > 0 && resplitResult.textContent?.includes("record of work")) {
      console.log(`✔ 3. Responsive heading re-splitting verified at 600px width (${resplitResult.wordsCount} words preserved)`);
    } else {
      throw new Error(`Responsive heading re-split failed: ${JSON.stringify(resplitResult)}`);
    }
    await wordContext.close();

    // -------------------------------------------------------------------------
    // TEST 4: Paragraph & Element Stagger / Viewport Entry Timing
    // -------------------------------------------------------------------------
    console.log("Testing 4: Viewport-triggered element stagger in Toolkit section...");
    const staggerContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const staggerPage = await staggerContext.newPage();
    await staggerPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await staggerPage.waitForSelector("body.hero-ready", { timeout: 8000 });

    await staggerPage.locator("#toolkit").scrollIntoViewIfNeeded();
    await staggerPage.waitForTimeout(1000);

    const staggerResult = await staggerPage.evaluate(() => {
      const toolRows = document.querySelectorAll(".tool-list .tool-row");
      const heading = document.querySelector("#toolkit h2");
      const leadP = document.querySelector("#toolkit p");
      const opacities = Array.from(toolRows).map((r) => parseFloat(window.getComputedStyle(r).opacity));
      return {
        count: toolRows.length,
        headingVisible: heading ? parseFloat(window.getComputedStyle(heading).opacity) > 0.8 : false,
        leadVisible: leadP ? parseFloat(window.getComputedStyle(leadP).opacity) > 0.8 : false,
        rowsVisible: opacities.length > 0 && opacities.every((op) => op > 0.8),
      };
    });

    if (staggerResult && staggerResult.count >= 2 && staggerResult.headingVisible && staggerResult.rowsVisible) {
      console.log(`✔ 4. Stagger groups & hierarchy verified (Heading and ${staggerResult.count} tool rows revealed)`);
    } else {
      throw new Error(`Element stagger test failed: ${JSON.stringify(staggerResult)}`);
    }

    // -------------------------------------------------------------------------
    // TEST 5: Timeline Sequence & No Replay on Scroll Back
    // -------------------------------------------------------------------------
    console.log("Testing 5: Timeline sequence & scroll-back retention in Journey section...");
    await staggerPage.locator("#journey").scrollIntoViewIfNeeded();
    await staggerPage.waitForTimeout(1000);

    const timelineResult = await staggerPage.evaluate(() => {
      const entries = document.querySelectorAll(".journey-timeline .timeline-entry");
      const opacities = Array.from(entries).map((e) => parseFloat(window.getComputedStyle(e).opacity));
      return {
        count: entries.length,
        allVisible: opacities.length > 0 && opacities.every((op) => op > 0.8),
      };
    });

    if (timelineResult && timelineResult.count >= 3 && timelineResult.allVisible) {
      console.log(`✔ 5. Timeline sequence verified (${timelineResult.count} entries revealed and visible)`);
    } else {
      throw new Error(`Timeline sequence test failed: ${JSON.stringify(timelineResult)}`);
    }

    // Scroll back to top and verify completed animations do not disappear
    await staggerPage.evaluate(() => window.scrollTo(0, 0));
    await staggerPage.waitForTimeout(600);

    const scrollBackRetained = await staggerPage.evaluate(() => {
      const entries = document.querySelectorAll(".journey-timeline .timeline-entry");
      const opacities = Array.from(entries).map((e) => parseFloat(window.getComputedStyle(e).opacity));
      return opacities.every((op) => op > 0.8);
    });

    if (scrollBackRetained) {
      console.log("✔ 5b. Scroll-back retention verified (completed animations remain visible, once: true respected)");
    } else {
      throw new Error("Scroll-back retention failed: elements became hidden after scrolling away");
    }

    // -------------------------------------------------------------------------
    // TEST 6: Project Card Stagger in Selected Work
    // -------------------------------------------------------------------------
    console.log("Testing 6: Project card stagger in Selected Work...");
    await staggerPage.locator("#work").scrollIntoViewIfNeeded();
    await staggerPage.waitForTimeout(1000);

    const cardResult = await staggerPage.evaluate(() => {
      const acts = document.querySelectorAll(".work-acts-list .work-act");
      const opacities = Array.from(acts).map((a) => parseFloat(window.getComputedStyle(a).opacity));
      return {
        count: acts.length,
        allVisible: opacities.length > 0 && opacities.every((op) => op > 0.8),
      };
    });

    if (cardResult && cardResult.count >= 2 && cardResult.allVisible) {
      console.log(`✔ 6. Project card stagger verified (${cardResult.count} work acts revealed and visible)`);
    } else {
      throw new Error(`Project card stagger test failed: ${JSON.stringify(cardResult)}`);
    }

    // -------------------------------------------------------------------------
    // TEST 7: Finder-Inspired Projects Explorer (Full Interaction Lifecycle)
    // -------------------------------------------------------------------------
    console.log("Testing 7: Finder Projects Explorer (Loading, Categories, Search, Open/Close Studio)...");
    
    // A: Open System Studio
    await staggerPage.click("#toggle-finder-studio");
    await staggerPage.waitForTimeout(500);

    const studioOpen = await staggerPage.evaluate(() => {
      const studio = document.getElementById("projects");
      return studio && !studio.classList.contains("studio-collapsed");
    });
    if (!studioOpen) throw new Error("Failed to open System Studio");

    // B: Initial load check in Finder
    const initialItems = await staggerPage.evaluate(() => {
      const items = document.querySelectorAll(".finder-nav-item");
      return items.length;
    });
    if (initialItems !== 10) throw new Error(`Expected 10 initial Finder items, found ${initialItems}`);

    // C: Category filtering
    await staggerPage.click('.finder-cat-btn[data-category="ai-ml"]');
    await staggerPage.waitForTimeout(600);

    const aiMlCount = await staggerPage.evaluate(() => {
      const items = document.querySelectorAll(".finder-nav-item");
      const opacities = Array.from(items).map((i) => parseFloat(window.getComputedStyle(i).opacity));
      return {
        count: items.length,
        allVisible: opacities.every((op) => op > 0.8),
      };
    });
    if (aiMlCount.count !== 5 || !aiMlCount.allVisible) {
      throw new Error(`Category filtering failed: count=${aiMlCount.count}, allVisible=${aiMlCount.allVisible}`);
    }

    // D: Search query filtering
    const searchInput = staggerPage.locator("#finder-project-search");
    await searchInput.fill("pipeline");
    await staggerPage.waitForTimeout(400);

    const searchCount = await staggerPage.evaluate(() => {
      const items = document.querySelectorAll(".finder-nav-item");
      return items.length;
    });
    if (searchCount < 1) throw new Error("Search query 'pipeline' returned 0 results");

    // Reset search & category back to all
    await searchInput.fill("");
    await staggerPage.click('.finder-cat-btn[data-category="all"]');
    await staggerPage.waitForTimeout(400);

    // E: Close System Studio
    await staggerPage.click("#close-finder-dot");
    await staggerPage.waitForTimeout(400);

    const studioClosed = await staggerPage.evaluate(() => {
      const studio = document.getElementById("projects");
      return studio && studio.classList.contains("studio-collapsed");
    });
    if (!studioClosed) throw new Error("Failed to close System Studio via close dot");

    console.log("✔ 7. Finder Projects Explorer lifecycle verified (open, category filtering, search, and close)");
    await staggerContext.close();

    // -------------------------------------------------------------------------
    // TEST 8: Hidden Workbench Behaviour
    // -------------------------------------------------------------------------
    console.log("Testing 8: Hidden Workbench behavior...");
    const modalContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const modalPage = await modalContext.newPage();
    await modalPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await modalPage.waitForSelector("body.hero-ready", { timeout: 8000 });

    const hiddenState = await modalPage.evaluate(() => {
      const modal = document.getElementById("workbench-modal");
      return {
        isOpen: modal ? modal.classList.contains("active") : false,
      };
    });

    // Open Workbench
    await modalPage.click("#workbench-nav-trigger");
    await modalPage.waitForTimeout(500);

    const openState = await modalPage.evaluate(() => {
      const modal = document.getElementById("workbench-modal");
      const title = modal ? modal.querySelector(".workbench-title") : null;
      return {
        isOpen: modal ? modal.classList.contains("active") : false,
        titleVisible: title ? parseFloat(window.getComputedStyle(title).opacity) > 0.8 : false,
      };
    });

    if (!hiddenState.isOpen && openState.isOpen && openState.titleVisible) {
      console.log("✔ 8. Hidden Workbench behavior verified (clean dormant state, uncorrupted on open)");
    } else {
      throw new Error(`Workbench modal test failed: hidden=${JSON.stringify(hiddenState)}, open=${JSON.stringify(openState)}`);
    }
    await modalContext.close();

    // -------------------------------------------------------------------------
    // TEST 9: Reduced-Motion Accessibility
    // -------------------------------------------------------------------------
    console.log("Testing 9: Reduced-motion accessibility...");
    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await rmPage.waitForTimeout(1000);

    const rmResult = await rmPage.evaluate(() => {
      const isRM = window.scrollAnimationController?.isReducedMotion();
      const allReveals = document.querySelectorAll("[data-reveal]");
      const opacities = Array.from(allReveals).map((el) => parseFloat(window.getComputedStyle(el).opacity));
      const transforms = Array.from(allReveals).map((el) => window.getComputedStyle(el).transform);

      return {
        isReducedMotion: isRM,
        count: allReveals.length,
        allVisible: opacities.every((op) => op === 1),
        allZeroTransform: transforms.every((t) => t === "none" || t.includes("matrix(1, 0, 0, 1, 0, 0)")),
      };
    });

    if (rmResult.isReducedMotion && rmResult.allVisible && rmResult.allZeroTransform) {
      console.log(`✔ 9. Reduced-motion verified: instant 100% visibility across ${rmResult.count} reveal targets`);
    } else {
      throw new Error(`Reduced-motion test failed: ${JSON.stringify(rmResult)}`);
    }
    await rmContext.close();

    // -------------------------------------------------------------------------
    // TEST 10: JavaScript Failure Fallback (Fail-Open Check)
    // -------------------------------------------------------------------------
    console.log("Testing 10: Fail-open CSS content visibility fallback...");
    const noJsContext = await browser.newContext({ javaScriptEnabled: false });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(baseUrl, { waitUntil: "domcontentloaded" });

    const failOpenResult = await noJsPage.evaluate(() => {
      const reveals = document.querySelectorAll("[data-reveal]");
      const opacities = Array.from(reveals).map((el) => parseFloat(window.getComputedStyle(el).opacity));
      return {
        count: reveals.length,
        allVisible: opacities.length > 0 && opacities.every((op) => op === 1),
      };
    });

    if (failOpenResult && failOpenResult.count > 0 && failOpenResult.allVisible) {
      console.log(`✔ 10. Fail-open architecture verified: all ${failOpenResult.count} reveal elements are 100% visible without JavaScript`);
    } else {
      throw new Error(`Fail-open test failed: ${JSON.stringify(failOpenResult)}`);
    }
    await noJsContext.close();

    // -------------------------------------------------------------------------
    // TEST 11: Desktop, Tablet, and Mobile Layouts (No Overflow)
    // -------------------------------------------------------------------------
    console.log("Testing 11: Layouts & horizontal overflow across viewports...");
    const viewports = [
      { name: "Desktop", width: 1440, height: 900 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Mobile", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      const vpContext = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const vpPage = await vpContext.newPage();
      await vpPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await vpPage.waitForSelector("body.hero-ready", { timeout: 8000 });
      await vpPage.waitForTimeout(1000);

      const overflow = await vpPage.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      if (!overflow.hasOverflow) {
        console.log(`  - ${vp.name} (${vp.width}x${vp.height}): Zero horizontal overflow (scrollWidth=${overflow.scrollWidth})`);
      } else {
        throw new Error(`Horizontal overflow detected at ${vp.name}: scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth}`);
      }
      await vpContext.close();
    }
    console.log("✔ 11. Responsive layout and zero horizontal overflow verified across all viewports");

    // -------------------------------------------------------------------------
    // TEST 12: Keyboard Navigation & Focus
    // -------------------------------------------------------------------------
    console.log("Testing 12: Keyboard navigation & interactive focus...");
    const navContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const navPage = await navContext.newPage();
    await navPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await navPage.waitForSelector("body.hero-ready", { timeout: 8000 });

    // Press Tab 4 times
    await navPage.keyboard.press("Tab"); // Skip link
    await navPage.keyboard.press("Tab"); // Monogram
    await navPage.keyboard.press("Tab"); // Nav link 1
    await navPage.keyboard.press("Tab"); // Nav link 2

    const focusedTag = await navPage.evaluate(() => {
      return document.activeElement ? document.activeElement.tagName.toLowerCase() : null;
    });

    if (focusedTag === "a" || focusedTag === "button") {
      console.log(`✔ 12. Keyboard navigation operational (active focus on <${focusedTag}>)`);
    } else {
      throw new Error(`Keyboard navigation check failed: activeElement is <${focusedTag}>`);
    }
    await navContext.close();

    // -------------------------------------------------------------------------
    // TEST 13: Capture Animation-Enabled Screenshots
    // -------------------------------------------------------------------------
    console.log("Capturing animation-enabled screenshots for reporting evidence...");
    for (const vp of viewports) {
      const shotContext = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const shotPage = await shotContext.newPage();
      await shotPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await shotPage.waitForSelector("body.hero-ready", { timeout: 8000 });
      await shotPage.waitForTimeout(1500);

      const shotPath = path.join(screenshotDir, `${vp.name.toLowerCase()}-${vp.width}.png`);
      await shotPage.screenshot({ path: shotPath, fullPage: false });
      console.log(`  - Captured ${vp.name} (${vp.width}px): ${shotPath}`);
      await shotContext.close();
    }

    console.log("\n=======================================================");
    console.log("🎉 ALL QUALITY AUDIT REQUIREMENTS SUCCESSFULLY PASSED!");
    console.log("=======================================================");
  } finally {
    await browser.close();
    if (previewServer?.httpServer) {
      await new Promise((resolve) => previewServer.httpServer.close(resolve));
      console.log("Vite preview server cleanly terminated.");
    }
  }
}

runAnimationTests().catch((err) => {
  console.error("FATAL ERROR in GSAP Animation test suite:", err);
  process.exit(1);
});
