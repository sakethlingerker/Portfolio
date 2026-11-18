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
 * - Controlled via `data-reveal`, `data-reveal-group`, and semantic element selectors
 * - Individual content elements animate progressively as they enter the viewport
 */

// Global Animation Context & State
let animationCtx: gsap.Context | null = null;
let splitInstances: SplitText[] = [];
let isSystemInitialized = false;
let heroTimeline: gsap.core.Timeline | null = null;
let lastWindowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
let currentConfig: Required<RevealOptions>;

const DEFAULT_CONFIG: Required<RevealOptions> = {
  duration: 0.65,
  yOffset: 20,
  wordStagger: 0.04,
  elementStagger: 0.1,
  ease: "power2.out",
  triggerHook: "top 85%",
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

      // 3. Dedicated per-card sequence for Featured Project Acts (.work-act)
      initProjectActsReveals(currentConfig);

      // 4. Dedicated per-entry triggers for Journey Timeline (.timeline-entry)
      initTimelineReveals(currentConfig);

      // 5. Batch reveals for card grids (KPI cards, role cards, inquiry cards, philosophy items)
      initCardBatchReveals(currentConfig);

      // 6. Progressive pipeline steps on Research page
      initPipelineStepsReveals(currentConfig);

      // 7. Framed contact form and inputs
      initContactFormReveals(currentConfig);

      // 8. Staggered groups for remaining data-reveal-group containers
      initStaggerGroups(currentConfig);

      // 9. Standalone editorial elements
      initStandaloneReveals(currentConfig);

      // 10. Hero text sequence synchronization
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
    if (
      heading.classList.contains("hero-name") ||
      heading.classList.contains("hero-display-heading") ||
      heading.closest("#hero, #home")
    ) return;
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
          clearProps: "willChange,transform",
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
          clearProps: "willChange,transform",
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
 * Dedicated reveal system for Featured Project Acts (.work-act) on Home page
 * Each card triggers individually when entering the viewport at top 85%.
 * Inside each card, elements stagger gracefully:
 * Card container -> Header/meta -> Category, headline & description -> Tech pills -> Actions.
 */
export function initProjectActsReveals(config = DEFAULT_CONFIG): void {
  const cards = document.querySelectorAll<HTMLElement>(".work-acts-list > .work-act, .selected-work .work-act");
  if (!cards.length) return;

  cards.forEach((card) => {
    const meta = card.querySelector<HTMLElement>(".work-meta");
    const title = card.querySelector<HTMLElement>(".work-act-title");
    const category = card.querySelector<HTMLElement>(".work-act-category");
    const headline = card.querySelector<HTMLElement>(".work-act-copy h4");
    const desc = card.querySelector<HTMLElement>(".work-act-desc");
    const techPills = card.querySelector<HTMLElement>(".work-tech-pills");
    const actions = card.querySelector<HTMLElement>(".work-act-actions");

    const headerItems = [meta, title].filter(Boolean) as HTMLElement[];
    const copyItems = [category, headline, desc].filter(Boolean) as HTMLElement[];
    const bottomItems = [techPills, actions].filter(Boolean) as HTMLElement[];

    // Set fail-open initial states
    gsap.set(card, {
      y: config.yOffset * 1.1,
      opacity: 0,
      willChange: "transform, opacity",
    });

    if (headerItems.length) {
      gsap.set(headerItems, { y: 14, opacity: 0 });
    }
    if (copyItems.length) {
      gsap.set(copyItems, { y: 14, opacity: 0 });
    }
    if (bottomItems.length) {
      gsap.set(bottomItems, { y: 12, opacity: 0 });
    }

    const cardTl = gsap.timeline({
      paused: true,
      defaults: { ease: config.ease },
      onComplete: () => {
        // Clear transforms and will-change so hover animations and link clicks behave natively
        gsap.set([card, ...headerItems, ...copyItems, ...bottomItems], {
          clearProps: "willChange,transform",
        });
      },
    });

    // 1. Card container enters
    cardTl.to(card, {
      y: 0,
      opacity: 1,
      duration: config.duration,
    }, 0);

    // 2. Header elements (meta & title)
    if (headerItems.length) {
      cardTl.to(
        headerItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
        },
        0.12
      );
    }

    // 3. Category, headline & description
    if (copyItems.length) {
      cardTl.to(
        copyItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
        },
        0.22
      );
    }

    // 4. Tech pills & action buttons
    if (bottomItems.length) {
      cardTl.to(
        bottomItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
        },
        0.34
      );
    }

    // Attach individual ScrollTrigger to each card
    ScrollTrigger.create({
      trigger: card,
      start: card.dataset.revealTrigger || config.triggerHook,
      once: config.once,
      onEnter: () => cardTl.play(),
    });
  });
}

/**
 * Dedicated reveal system for About Page Journey Timeline (.journey-timeline .timeline-entry)
 * Each milestone entry triggers individually as it scrolls into view at top 85%.
 */
export function initTimelineReveals(config = DEFAULT_CONFIG): void {
  const entries = document.querySelectorAll<HTMLElement>(".journey-timeline .timeline-entry");
  if (!entries.length) return;

  entries.forEach((entry) => {
    const meta = entry.querySelector<HTMLElement>(".timeline-meta");
    const marker = entry.querySelector<HTMLElement>(".timeline-marker");
    const body = entry.querySelector<HTMLElement>(".timeline-body");

    gsap.set(entry, {
      y: config.yOffset,
      opacity: 0,
      willChange: "transform, opacity",
    });

    if (marker) {
      gsap.set(marker, { scale: 0.85, opacity: 0 });
    }

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: config.ease },
      onComplete: () => {
        gsap.set([entry, meta, marker, body].filter(Boolean) as HTMLElement[], {
          clearProps: "willChange,transform",
        });
      },
    });

    tl.to(entry, {
      y: 0,
      opacity: 1,
      duration: config.duration,
    }, 0);

    if (marker) {
      tl.to(
        marker,
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
        },
        0.1
      );
    }

    if (body) {
      tl.fromTo(
        body,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 },
        0.15
      );
    }

    ScrollTrigger.create({
      trigger: entry,
      start: entry.dataset.revealTrigger || config.triggerHook,
      once: config.once,
      onEnter: () => tl.play(),
    });
  });
}

/**
 * Batch reveals for card grids across pages using ScrollTrigger.batch:
 * Targets [data-reveal="card"], .kpi-card, .role-card, .inquiry-card,
 * .proof-assessment-item, .overview-grid > .card, .philosophy-item.
 */
export function initCardBatchReveals(config = DEFAULT_CONFIG): void {
  const selector = [
    '[data-reveal="card"]',
    '.kpi-grid > .kpi-card',
    '.two-col > .role-card',
    '.inquiry-grid > .inquiry-card',
    '.overview-grid > .card',
    '.philosophy-list > .philosophy-item',
    '.proof-assessments-grid > .proof-assessment-item',
  ].join(", ");

  const cards = document.querySelectorAll<HTMLElement>(selector);
  const validCards = Array.from(cards).filter((card) => {
    return !card.closest(".hero, .work-acts-list, .studio-collapsed, .modal-hidden, [hidden]");
  });

  if (!validCards.length) return;

  gsap.set(validCards, {
    y: config.yOffset,
    opacity: 0,
    willChange: "transform, opacity",
  });

  ScrollTrigger.batch(validCards, {
    start: config.triggerHook,
    once: config.once,
    interval: 0.08,
    batchMax: 4,
    onEnter: (batch) => {
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.elementStagger,
        overwrite: "auto",
        clearProps: "willChange,transform",
      });
    },
  });
}

/**
 * Progressive pipeline steps on Research page
 */
export function initPipelineStepsReveals(config = DEFAULT_CONFIG): void {
  const pipelineBox = document.querySelector<HTMLElement>(".pipeline-box");
  if (!pipelineBox) return;

  const steps = pipelineBox.querySelectorAll<HTMLElement>(".pipeline-steps > .step-node");
  if (!steps.length) return;

  gsap.set(steps, {
    y: 16,
    opacity: 0,
    willChange: "transform, opacity",
  });

  ScrollTrigger.create({
    trigger: pipelineBox,
    start: config.triggerHook,
    once: config.once,
    onEnter: () => {
      gsap.to(steps, {
        y: 0,
        opacity: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: 0.12,
        clearProps: "willChange,transform",
      });
    },
  });
}

/**
 * Progressive Contact Form reveal
 */
export function initContactFormReveals(config = DEFAULT_CONFIG): void {
  const formFrame = document.querySelector<HTMLElement>(".contact-form-frame");
  if (!formFrame) return;

  const header = formFrame.querySelector<HTMLElement>(".form-frame-header");
  const formGroups = formFrame.querySelectorAll<HTMLElement>(".form-group, .btn-contact-submit");

  gsap.set(formFrame, {
    y: config.yOffset,
    opacity: 0,
    willChange: "transform, opacity",
  });

  if (header) gsap.set(header, { y: 12, opacity: 0 });
  if (formGroups.length) gsap.set(formGroups, { y: 14, opacity: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: config.ease },
    onComplete: () => {
      gsap.set([formFrame, header, ...Array.from(formGroups)].filter(Boolean) as HTMLElement[], {
        clearProps: "willChange,transform",
      });
    },
  });

  tl.to(formFrame, {
    y: 0,
    opacity: 1,
    duration: config.duration,
  }, 0);

  if (header) {
    tl.to(header, { y: 0, opacity: 1, duration: 0.45 }, 0.1);
  }

  if (formGroups.length) {
    tl.to(
      formGroups,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
      },
      0.18
    );
  }

  ScrollTrigger.create({
    trigger: formFrame,
    start: formFrame.dataset.revealTrigger || config.triggerHook,
    once: config.once,
    onEnter: () => tl.play(),
  });
}

/**
 * Staggered animation groups for remaining [data-reveal-group] containers
 */
export function initStaggerGroups(config = DEFAULT_CONFIG): void {
  const groups = document.querySelectorAll<HTMLElement>("[data-reveal-group]");

  groups.forEach((group) => {
    // Avoid animating inside hero or specialized containers
    if (group.closest(".hero, .work-acts-list, .journey-timeline, .pipeline-box, .studio-collapsed, .modal-hidden, [hidden]")) return;

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
      clearProps: "willChange,transform",
      scrollTrigger: {
        trigger: group,
        start: triggerHook,
        once: config.once,
      },
    });
  });
}

/**
 * Standalone elements with data-reveal="fade-up", scale-in, text
 */
function initStandaloneReveals(config = DEFAULT_CONFIG): void {
  const elements = document.querySelectorAll<HTMLElement>(
    '[data-reveal="fade-up"], [data-reveal="scale-in"], [data-reveal="text"]'
  );

  elements.forEach((el) => {
    // Ignore elements inside custom systems or hidden containers
    if (
      el.closest(
        "[data-reveal-group], .work-acts-list, .journey-timeline, .pipeline-steps, .contact-form-frame, .hero, .studio-collapsed, .modal-hidden, [hidden]"
      ) ||
      el.classList.contains("work-act") ||
      el.classList.contains("timeline-entry")
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
      clearProps: "willChange,transform",
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
 * Minimal Editorial Tech Hero entrance:
 * 1. Eyebrow fade-in (0.1s)
 * 2. Headline reveal (0.22s)
 * 3. Description fade-up (0.42s)
 * 4. CTA stagger (0.58s)
 * 5. Geometric shape reveal (0.72s)
 * 6. Expertise strip reveal (0.88s)
 * Seamlessly hooks into `hero:ready` event emitted after preloader dismisses
 */
export function initHeroSequence(config = DEFAULT_CONFIG): gsap.core.Timeline | null {
  const hero = document.getElementById("hero") || document.getElementById("home");
  if (!hero) return null;

  // If hero is the 3D engineering core section, it is orchestrated by hero-3d.js
  if (hero.classList.contains("hero-3d-section")) {
    return null;
  }

  const kicker = hero.querySelector<HTMLElement>("[data-hero-elem='kicker'], .hero-eyebrow, .hero-kicker");
  const heading = hero.querySelector<HTMLElement>("[data-hero-elem='heading'], .hero-display-heading");
  const headingLines = heading
    ? Array.from(heading.querySelectorAll<HTMLElement>(".heading-line"))
    : [];
  const description = hero.querySelector<HTMLElement>("[data-hero-elem='desc'], .hero-lead-desc, .hero-description");
  const ctaGroup = hero.querySelector<HTMLElement>("[data-hero-elem='cta'], .hero-cta-group, .hero-actions");
  const ctaButtons = ctaGroup
    ? Array.from(ctaGroup.querySelectorAll<HTMLElement>("a, button"))
    : [];
  const visualCol = hero.querySelector<HTMLElement>("[data-hero-elem='visual'], .hero-visual-col, .hero-geometric-visual");
  const expertiseStrip = hero.querySelector<HTMLElement>("[data-hero-elem='expertise'], .hero-expertise-strip, .hero-meta-strip");
  const expertiseItems = expertiseStrip
    ? Array.from(expertiseStrip.querySelectorAll<HTMLElement>(".expertise-item, .meta-strip-item"))
    : [];

  // Legacy element references for fail-open fallback
  const title = hero.querySelector<HTMLElement>(".hero-name");
  const nameSpans = title
    ? Array.from(title.querySelectorAll<HTMLElement>(".hero-name-first, .hero-name-last"))
    : [];
  const roleBadge = hero.querySelector<HTMLElement>(".hero-role-badge");
  const secondaryLine = hero.querySelector<HTMLElement>(".hero-secondary-line");

  const allHeroTargets = [
    kicker,
    heading,
    ...headingLines,
    description,
    ctaGroup,
    ...ctaButtons,
    visualCol,
    expertiseStrip,
    ...expertiseItems,
    title,
    ...nameSpans,
    roleBadge,
    secondaryLine,
  ].filter(Boolean) as HTMLElement[];

  if (prefersReducedMotion()) {
    allHeroTargets.forEach((target) => {
      gsap.set(target, { opacity: 1, y: 0, clearProps: "all" });
    });
    return null;
  }

  // Fail-open initial state for hero elements
  if (kicker) gsap.set(kicker, { y: 12, opacity: 0 });
  if (headingLines.length > 0) {
    gsap.set(headingLines, { y: 20, opacity: 0 });
  } else if (heading) {
    gsap.set(heading, { y: 20, opacity: 0 });
  }
  if (nameSpans.length > 0) {
    gsap.set(nameSpans, { y: 20, opacity: 0, display: "inline-block" });
  } else if (title) {
    gsap.set(title, { y: 20, opacity: 0 });
  }
  if (roleBadge) gsap.set(roleBadge, { y: 16, opacity: 0 });
  if (description) gsap.set(description, { y: 16, opacity: 0 });
  if (secondaryLine) gsap.set(secondaryLine, { y: 14, opacity: 0 });
  if (ctaButtons.length > 0) {
    gsap.set(ctaButtons, { y: 14, opacity: 0 });
  } else if (ctaGroup) {
    gsap.set(ctaGroup, { y: 14, opacity: 0 });
  }
  if (visualCol) gsap.set(visualCol, { y: 18, opacity: 0 });
  if (expertiseItems.length > 0) {
    gsap.set(expertiseItems, { y: 12, opacity: 0 });
  } else if (expertiseStrip) {
    gsap.set(expertiseStrip, { y: 12, opacity: 0 });
  }

  // Build Hero Entrance Timeline
  heroTimeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
    onComplete: () => {
      // Clear inline transform and will-change to avoid layout/font rendering differences
      allHeroTargets.forEach((t) => t && gsap.set(t, { clearProps: "willChange,transform" }));
    },
  });

  // 1. Eyebrow fade-in (0.1s)
  if (kicker) {
    heroTimeline.to(kicker, { y: 0, opacity: 1, duration: 0.5 }, 0.1);
  }

  // 2. Headline reveal (0.22s)
  if (headingLines.length > 0) {
    heroTimeline.to(
      headingLines,
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.1 },
      0.22
    );
  } else if (heading) {
    heroTimeline.to(heading, { y: 0, opacity: 1, duration: 0.65 }, 0.22);
  } else if (nameSpans.length > 0) {
    heroTimeline.to(
      nameSpans,
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.06 },
      0.22
    );
  } else if (title) {
    heroTimeline.to(title, { y: 0, opacity: 1, duration: 0.65 }, 0.22);
  }

  // Legacy role badge if present
  if (roleBadge) {
    heroTimeline.call(() => roleBadge.classList.add("animate-in"), [], 0.35);
    heroTimeline.to(roleBadge, { y: 0, opacity: 1, duration: 0.6 }, 0.35);
  }

  // 3. Description fade-up (0.42s)
  if (description) {
    heroTimeline.to(description, { y: 0, opacity: 1, duration: 0.6 }, 0.42);
  }
  if (secondaryLine) {
    heroTimeline.to(secondaryLine, { y: 0, opacity: 1, duration: 0.55 }, 0.52);
  }

  // 4. CTA stagger (0.58s)
  if (ctaButtons.length > 0) {
    heroTimeline.to(
      ctaButtons,
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
      0.58
    );
  } else if (ctaGroup) {
    heroTimeline.to(ctaGroup, { y: 0, opacity: 1, duration: 0.55 }, 0.58);
  }

  // 5. Geometric shape reveal (0.72s)
  if (visualCol) {
    heroTimeline.to(visualCol, { y: 0, opacity: 1, duration: 0.65 }, 0.72);
  }

  // 6. Expertise strip reveal (0.88s)
  if (expertiseItems.length > 0) {
    heroTimeline.to(
      expertiseItems,
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
      0.88
    );
  } else if (expertiseStrip) {
    heroTimeline.to(expertiseStrip, { y: 0, opacity: 1, duration: 0.55 }, 0.88);
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

  // Kill any remaining ScrollTriggers (preserve hero 3D triggers)
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger && (trigger.trigger as HTMLElement).id === "hero") return;
    trigger.kill();
  });

  isSystemInitialized = false;
  heroTimeline = null;
}

/**
 * Fail-open safety fallback: ensures every text and container is 100% visible
 */
function revealAllContentInstantly(): void {
  const elements = document.querySelectorAll<HTMLElement>(
    `[data-reveal], [data-reveal-group] > *, .hero-text *, .work-act, .work-act *, ` +
    `.journey-timeline .timeline-entry, .journey-timeline .timeline-entry *, ` +
    `.kpi-card, .role-card, .inquiry-card, .proof-assessment-item, .overview-grid > .card, ` +
    `.philosophy-item, .step-node, .contact-form-frame, .contact-form-frame *`
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
