import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { AnimationController, RevealOptions } from "../../types/animations";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Apple-Inspired Cinematic Editorial Scroll & Motion System
 * 
 * Progressive enhancement architecture:
 * - Content is NEVER hidden by global CSS rules
 * - If JS is disabled or GSAP fails, all content renders statically and remains 100% visible
 * - Fully respects `prefers-reduced-motion: reduce`
 * - Controlled via `data-reveal` and `data-reveal-group` HTML attributes
 */

// Global Animation Context & State
let animationCtx: gsap.Context | null = null;
let splitInstances: SplitText[] = [];
let isSystemInitialized = false;
let heroTimeline: gsap.core.Timeline | null = null;
let lastWindowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
let currentConfig: Required<RevealOptions>;

const DEFAULT_CONFIG: Required<RevealOptions> = {
  duration: 0.75,
  yOffset: 24,
  wordStagger: 0.04,
  elementStagger: 0.1,
  ease: "power3.out",
  triggerHook: "top 82%",
  once: true,
};

currentConfig = { ...DEFAULT_CONFIG };

/**
 * Checks whether user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Initializes the entire scroll reveal system
 */
export function initScrollReveals(options: RevealOptions = {}): AnimationController {
  currentConfig = { ...DEFAULT_CONFIG, ...options };

  // Fail-open for reduced motion
  if (prefersReducedMotion()) {
    isSystemInitialized = true;
    revealAllContentInstantly();
    return createController();
  }

  try {
    // Clean up previous animations if re-initializing
    destroyScrollAnimations();

    // Use gsap.context for scoped lifecycle cleanup
    animationCtx = gsap.context(() => {
      // 1. Heading & Word-level reveals
      initHeadingReveals(currentConfig);

      // 2. Line-level editorial reveals
      initLineReveals(currentConfig);

      // 3. Staggered groups (cards, timeline entries, skill items, proof metrics)
      initStaggerGroups(currentConfig);

      // 4. Standalone fade-up items
      initStandaloneReveals(currentConfig);

      // 5. Hero text sequence synchronization
      initHeroSequence(currentConfig);
    });

    setupResizeObserver();
    isSystemInitialized = true;
  } catch (error) {
    console.warn("[ScrollReveal] Initialization failed; reverting to fail-open fallback:", error);
    revealAllContentInstantly();
  }

  return createController();
}

/**
 * Sets up debounced width-change observer for responsive re-splitting
 */
function setupResizeObserver(): void {
  if (typeof window === "undefined") return;
  lastWindowWidth = window.innerWidth;

  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener(
    "resize",
    () => {
      if (prefersReducedMotion()) return;
      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        // Ignore mobile address bar height fluctuations; only re-split on meaningful width changes
        if (Math.abs(currentWidth - lastWindowWidth) > 20) {
          lastWindowWidth = currentWidth;
          refreshHeadingSplits();
        }
      }, 250);
    },
    { passive: true }
  );
}

/**
 * Re-splits headings when viewport width shifts across breakpoints
 */
export function refreshHeadingSplits(): void {
  if (prefersReducedMotion() || !isSystemInitialized) return;

  try {
    splitInstances.forEach((split) => {
      try {
        split.revert();
      } catch {
        // Ignored
      }
    });
    splitInstances = [];

    // Re-initialize heading reveals
    initHeadingReveals(currentConfig);
    ScrollTrigger.refresh();
  } catch (e) {
    console.warn("[ScrollReveal] Re-split failed:", e);
  }
}

/**
 * Word-level heading reveals using SplitText
 */
export function initHeadingReveals(config = DEFAULT_CONFIG): void {
  const headingElements = document.querySelectorAll<HTMLElement>(
    '[data-reveal="heading"], [data-reveal="words"]'
  );

  headingElements.forEach((heading) => {
    // Avoid splitting hero title (handled with exact semantic spans in initHeroSequence)
    if (heading.classList.contains("hero-name")) return;
    // Avoid re-splitting or splitting if hidden inside collapsed modals
    if (heading.closest(".studio-collapsed, .modal-hidden, [hidden]")) return;

    try {
      const split = new SplitText(heading, {
        type: "words,lines",
        linesClass: "reveal-line",
        wordsClass: "reveal-word",
        tag: "span",
        aria: "auto",
      });

      splitInstances.push(split);

      if (split.words && split.words.length > 0) {
        // Set fail-open initial state inside JS only
        gsap.set(split.words, {
          y: config.yOffset,
          opacity: 0,
          willChange: "transform, opacity",
        });

        const triggerHook = heading.dataset.revealTrigger || config.triggerHook;
        const delay = parseFloat(heading.dataset.revealDelay || "0");

        gsap.to(split.words, {
          y: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          stagger: config.wordStagger,
          delay,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: heading,
            start: triggerHook,
            once: config.once,
            toggleActions: "play none none none",
          },
        });
      }
    } catch (e) {
      console.warn("[ScrollReveal] Failed to split heading:", heading, e);
      gsap.set(heading, { opacity: 1, clearProps: "all" });
    }
  });
}

/**
 * Editorial line reveals using SplitText
 */
export function initLineReveals(config = DEFAULT_CONFIG): void {
  const lineElements = document.querySelectorAll<HTMLElement>('[data-reveal="lines"]');

  lineElements.forEach((el) => {
    if (el.closest(".studio-collapsed, .modal-hidden, [hidden]")) return;

    try {
      const split = new SplitText(el, {
        type: "lines",
        linesClass: "reveal-line-inner",
        tag: "span",
      });

      splitInstances.push(split);

      if (split.lines && split.lines.length > 0) {
        gsap.set(split.lines, {
          y: config.yOffset * 0.75,
          opacity: 0,
          willChange: "transform, opacity",
        });

        const triggerHook = el.dataset.revealTrigger || config.triggerHook;

        gsap.to(split.lines, {
          y: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          stagger: config.wordStagger * 1.5,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: triggerHook,
            once: config.once,
          },
        });
      }
    } catch (e) {
      console.warn("[ScrollReveal] Failed to split lines:", el, e);
      gsap.set(el, { opacity: 1, clearProps: "all" });
    }
  });
}

/**
 * Staggered animation groups (cards, assessments, timeline, skill rows)
 */
export function initStaggerGroups(config = DEFAULT_CONFIG): void {
  const groups = document.querySelectorAll<HTMLElement>("[data-reveal-group]");

  groups.forEach((group) => {
    // Avoid animating inside hero (hero has dedicated initHeroSequence)
    if (group.closest(".hero, .studio-collapsed, .modal-hidden, [hidden]")) return;

    const items = group.querySelectorAll<HTMLElement>(":scope > *");
    if (items.length === 0) return;

    // Fail-open initial state inside JS
    gsap.set(items, {
      y: config.yOffset,
      opacity: 0,
      willChange: "transform, opacity",
    });

    const triggerHook = group.dataset.revealTrigger || config.triggerHook;
    const groupStagger = parseFloat(group.dataset.revealStagger || String(config.elementStagger));

    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: config.duration,
      ease: config.ease,
      stagger: groupStagger,
      clearProps: "willChange",
      scrollTrigger: {
        trigger: group,
        start: triggerHook,
        once: config.once,
      },
    });
  });
}

/**
 * Standalone elements with data-reveal="fade-up" or similar
 */
function initStandaloneReveals(config = DEFAULT_CONFIG): void {
  const elements = document.querySelectorAll<HTMLElement>(
    '[data-reveal="fade-up"], [data-reveal="scale-in"]'
  );

  elements.forEach((el) => {
    // Ignore elements inside a stagger group, inside hero, or inside hidden containers
    if (
      el.closest("[data-reveal-group]") ||
      el.closest(".hero, .studio-collapsed, .modal-hidden, [hidden]")
    ) {
      return;
    }

    const isScale = el.dataset.reveal === "scale-in";
    const yOffset = isScale ? 0 : config.yOffset;
    const initialScale = isScale ? 0.96 : 1;

    gsap.set(el, {
      y: yOffset,
      scale: initialScale,
      opacity: 0,
      willChange: "transform, opacity",
    });

    const triggerHook = el.dataset.revealTrigger || config.triggerHook;
    const delay = parseFloat(el.dataset.revealDelay || "0");

    gsap.to(el, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: config.duration,
      ease: config.ease,
      delay,
      clearProps: "willChange",
      scrollTrigger: {
        trigger: el,
        start: triggerHook,
        once: config.once,
      },
    });
  });
}

/**
 * Synchronized Hero Text Reveal Sequence
 * Seamlessly hooks into `hero:ready` event emitted after preloader dismisses
 */
export function initHeroSequence(config = DEFAULT_CONFIG): gsap.core.Timeline | null {
  const hero = document.getElementById("home");
  if (!hero) return null;

  const title = hero.querySelector<HTMLElement>(".hero-name");
  const nameSpans = title
    ? (Array.from(title.querySelectorAll<HTMLElement>(".hero-name-first, .hero-name-last")))
    : [];
  const roleBadge = hero.querySelector<HTMLElement>(".hero-role-badge");
  const description = hero.querySelector<HTMLElement>(".hero-description");
  const secondaryLine = hero.querySelector<HTMLElement>(".hero-secondary-line");
  const actions = hero.querySelector<HTMLElement>(".hero-actions");
  const proofStrip = hero.querySelector<HTMLElement>(".hero-proof-strip");
  const proofItems = proofStrip ? Array.from(proofStrip.querySelectorAll<HTMLElement>(".proof-item")) : [];

  if (prefersReducedMotion()) {
    if (nameSpans.length > 0) {
      gsap.set(nameSpans, { opacity: 1, y: 0 });
    } else if (title) {
      gsap.set(title, { opacity: 1, y: 0 });
    }
    if (roleBadge) {
      roleBadge.classList.add("animate-in");
      gsap.set(roleBadge, { opacity: 1, y: 0 });
    }
    if (description) gsap.set(description, { opacity: 1, y: 0 });
    if (secondaryLine) gsap.set(secondaryLine, { opacity: 1, y: 0 });
    if (actions) gsap.set(actions, { opacity: 1, y: 0 });
    if (proofItems.length > 0) gsap.set(proofItems, { opacity: 1, y: 0 });
    return null;
  }

  // Fail-open initial state for hero elements
  if (nameSpans.length > 0) {
    gsap.set(nameSpans, { y: 22, opacity: 0, display: "inline-block" });
  } else if (title) {
    gsap.set(title, { y: 22, opacity: 0 });
  }
  if (roleBadge) gsap.set(roleBadge, { y: 18, opacity: 0 });
  if (description) gsap.set(description, { y: 16, opacity: 0 });
  if (secondaryLine) gsap.set(secondaryLine, { y: 14, opacity: 0 });
  if (actions) gsap.set(actions, { y: 16, opacity: 0 });
  if (proofItems.length > 0) gsap.set(proofItems, { y: 14, opacity: 0 });

  // Build Hero Entrance Timeline
  heroTimeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
    onComplete: () => {
      // Clear inline transform and will-change to avoid layout/font rendering differences
      const targets = [title, roleBadge, description, secondaryLine, actions, proofStrip, ...nameSpans, ...proofItems];
      targets.forEach((t) => t && gsap.set(t, { clearProps: "willChange,transform" }));
    },
  });

  // 1. Main title words (0.15s)
  if (nameSpans.length > 0) {
    heroTimeline.to(
      nameSpans,
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
      0.15
    );
  } else if (title) {
    heroTimeline.to(title, { y: 0, opacity: 1, duration: 0.7 }, 0.15);
  }

  // 3. Technical role badge (0.35s)
  if (roleBadge) {
    heroTimeline.call(
      () => {
        roleBadge.classList.add("animate-in");
      },
      [],
      0.35
    );
    heroTimeline.to(roleBadge, { y: 0, opacity: 1, duration: 0.65 }, 0.35);
  }

  // 4. Description and secondary line (0.45s)
  if (description) {
    heroTimeline.to(description, { y: 0, opacity: 1, duration: 0.65 }, 0.45);
  }
  if (secondaryLine) {
    heroTimeline.to(secondaryLine, { y: 0, opacity: 1, duration: 0.6 }, 0.55);
  }

  // 5. Action CTA buttons (0.65s)
  if (actions) {
    heroTimeline.to(actions, { y: 0, opacity: 1, duration: 0.65 }, 0.65);
  }

  // 6. Professional proof strip numbers (0.75s)
  if (proofItems.length > 0) {
    heroTimeline.to(
      proofItems,
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
      0.75
    );
  } else if (proofStrip) {
    heroTimeline.to(proofStrip, { y: 0, opacity: 1, duration: 0.6 }, 0.75);
  }

  // Lifecycle trigger: execute timeline when hero is ready
  const startHeroSequence = () => {
    if (heroTimeline && !heroTimeline.isActive() && heroTimeline.progress() === 0) {
      heroTimeline.play();
    }
  };

  const isPreloaderDone =
    document.body.classList.contains("hero-ready") ||
    !document.querySelector(".boot:not(.boot-hidden)");

  if (isPreloaderDone) {
    setTimeout(startHeroSequence, 100);
  } else {
    window.addEventListener("hero:ready", () => setTimeout(startHeroSequence, 100), {
      once: true,
    });
    // Fallback if hero:ready event is missed
    setTimeout(startHeroSequence, 3500);
  }

  return heroTimeline;
}

/**
 * Refreshes ScrollTrigger measurements after dynamic layout shifts
 * (e.g., project filtering, accordion toggling, modal show/hide)
 */
export function refreshScrollAnimations(): void {
  if (prefersReducedMotion()) return;
  try {
    ScrollTrigger.refresh();
  } catch (e) {
    console.warn("[ScrollReveal] ScrollTrigger refresh error:", e);
  }
}

/**
 * Safely cleans up all ScrollTrigger instances and active splits
 */
export function destroyScrollAnimations(): void {
  if (animationCtx) {
    animationCtx.revert();
    animationCtx = null;
  }

  // Revert all SplitText instances to restore original DOM
  splitInstances.forEach((split) => {
    try {
      split.revert();
    } catch {
      // Ignored during cleanup
    }
  });
  splitInstances = [];

  // Kill any remaining ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  isSystemInitialized = false;
  heroTimeline = null;
}

/**
 * Fail-open safety fallback: ensures every text and container is 100% visible
 */
function revealAllContentInstantly(): void {
  const elements = document.querySelectorAll<HTMLElement>(
    "[data-reveal], [data-reveal-group] > *, .hero-text *"
  );
  elements.forEach((el) => {
    el.style.opacity = "1";
    el.style.visibility = "visible";
    el.style.transform = "none";
  });
}

/**
 * Helper to build controller return object
 */
function createController(): AnimationController {
  return {
    init: () => initScrollReveals(),
    destroy: destroyScrollAnimations,
    refresh: refreshScrollAnimations,
    playHero: () => {
      if (heroTimeline) heroTimeline.restart();
      return heroTimeline;
    },
    isReducedMotion: prefersReducedMotion,
    isInitialized: () => isSystemInitialized,
  };
}
