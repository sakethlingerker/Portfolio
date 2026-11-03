import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import http from "node:http";
import { resolve } from "node:path";
import { chromium } from "playwright";

const BASELINE_COMMIT = process.env.BASELINE_COMMIT || "ee53012";
const PORT = 4175;
const BASE_URL = `http://127.0.0.1:${PORT}/Portfolio/`;

const screenshotsDir = resolve(process.cwd(), "tests/screenshots");
const baselineDir = resolve(screenshotsDir, "baseline");
const cacheDir = resolve(process.cwd(), "node_modules/.cache/baseline-site");

mkdirSync(baselineDir, { recursive: true });

async function checkIsReachable(url) {
  return new Promise((res) => {
    const req = http.get(url, (response) => {
      res(response.statusCode >= 200 && response.statusCode < 400);
    });
    req.on("error", () => res(false));
    req.setTimeout(1500, () => {
      req.destroy();
      res(false);
    });
  });
}

async function preparePageForDeterministicScreenshot(page) {
  // 1. Wait for web fonts to load completely
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  // 2. Wait for all images to complete loading and decoding with a safety timeout
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll("img"));
    const imgPromises = images.map((img) => {
      if (img.complete) {
        return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
      }
      return new Promise((resolve) => {
        img.addEventListener("load", () => resolve(img.decode ? img.decode().catch(() => {}) : undefined), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
        setTimeout(resolve, 2000);
      });
    });
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    await Promise.race([Promise.all(imgPromises), timeout]);
  });

  // 3. Disable CSS transitions, animations, and blinking carets during screenshot capture
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        transition: none !important;
        -webkit-animation: none !important;
        -moz-animation: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `
  });

  // 4. Ensure deterministic clean canvas state for portrait animation
  await page.evaluate(() => {
    const canvas = document.getElementById("portrait-particle-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  });

  // 5. Reset scroll position and allow layout to settle
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function main() {
  console.log(`=== Generating Baseline Screenshots from Commit ${BASELINE_COMMIT} ===`);

  // Ensure commit is available in local git history
  try {
    execSync(`git rev-parse --verify ${BASELINE_COMMIT}`, { stdio: "ignore" });
  } catch {
    console.log(`Commit ${BASELINE_COMMIT} not found locally; fetching from origin...`);
    execSync("git fetch origin main", { stdio: "inherit" });
  }

  // Extract baseline commit files to cache directory
  if (existsSync(cacheDir)) {
    rmSync(cacheDir, { recursive: true, force: true });
  }
  mkdirSync(cacheDir, { recursive: true });

  console.log(`Extracting files from commit ${BASELINE_COMMIT} to ${cacheDir}...`);
  const archivePath = resolve(process.cwd(), "node_modules/.cache/baseline-original.zip");
  execSync(`git archive ${BASELINE_COMMIT} -o "${archivePath}"`, { stdio: "inherit" });

  // Cross-platform zip extraction using PowerShell on Windows or unzip on Unix
  if (process.platform === "win32") {
    execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${cacheDir}' -Force"`, { stdio: "inherit" });
  } else {
    execSync(`unzip -q "${archivePath}" -d "${cacheDir}"`, { stdio: "inherit" });
  }
  rmSync(archivePath, { force: true });

  // Build the extracted baseline site with Vite
  console.log("Building baseline site with Vite...");
  const distDir = resolve(cacheDir, "dist");
  const { build } = await import("vite");
  await build({
    root: cacheDir,
    build: {
      outDir: distDir,
      emptyOutDir: true
    },
    configFile: false,
    base: "/Portfolio/"
  });

  // Start in-process preview server for baseline build
  console.log(`Starting baseline preview server on port ${PORT}...`);
  const { preview } = await import("vite");
  const previewServer = await preview({
    root: cacheDir,
    preview: {
      port: PORT,
      host: "127.0.0.1",
      open: false
    },
    build: {
      outDir: distDir
    },
    configFile: false,
    base: "/Portfolio/"
  });

  const isUp = await checkIsReachable(BASE_URL);
  if (!isUp) {
    throw new Error(`Failed to reach baseline preview server at ${BASE_URL}`);
  }
  console.log(`Baseline preview server ready at ${BASE_URL}`);

  // Launch Playwright Chromium
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 }
  ];

  try {
    for (const vp of viewports) {
      console.log(`Capturing baseline for ${vp.name} (${vp.width}x${vp.height})...`);
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1
      });

      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForFunction(() => document.body.classList.contains("hero-ready"), null, { timeout: 15000 }).catch(() => {});

      await preparePageForDeterministicScreenshot(page);

      // Viewport screenshot
      const vpPath = resolve(baselineDir, `${vp.name}.png`);
      await page.screenshot({ path: vpPath, fullPage: false, animations: "disabled" });

      // Full-page screenshot
      const fpPath = resolve(baselineDir, `${vp.name}-full.png`);
      await page.screenshot({ path: fpPath, fullPage: true, animations: "disabled" });

      await page.close();
      console.log(`  ✔ Saved ${vp.name}.png and ${vp.name}-full.png`);
    }

    console.log("\n🎉 All baseline fixtures successfully captured from commit", BASELINE_COMMIT);
  } finally {
    await browser.close();
    if (previewServer?.httpServer) {
      await new Promise((res) => previewServer.httpServer.close(res));
    }
    rmSync(cacheDir, { recursive: true, force: true });
    console.log("Baseline preview server cleanly terminated.");
  }
}

main().catch((err) => {
  console.error("Baseline generation failed:", err);
  process.exit(1);
});
