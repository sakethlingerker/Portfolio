/**
 * GENUINE 3D SCROLL-LINKED ENGINEERING CORE - STANDALONE SCRIPT
 * Hardware-accelerated CSS 3D Scene with true depth & ScrollTrigger motion
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded. Please ensure GSAP and ScrollTrigger are loaded.");
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const hero = document.getElementById("hero") || document.querySelector(".hero-3d-section") || document.querySelector(".hero-section");
  const cubeWrapper = document.getElementById("cube-wrapper") || document.querySelector(".cube-wrapper");
  const cubeInner = document.getElementById("cube-inner") || document.querySelector(".cube-inner");
  const hero3dContainer = document.getElementById("hero-3d-container") || document.querySelector(".hero-3d-container");

  if (!cubeWrapper) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Initial 3D Isometric View Setup
  gsap.set(cubeWrapper, {
    rotationX: 20,
    rotationY: -35,
    transformStyle: "preserve-3d"
  });

  const platform = document.querySelector(".platform");
  if (platform) {
    gsap.set(platform, {
      rotationX: 62,
      rotationZ: -45,
      transformStyle: "preserve-3d"
    });
  }

  if (prefersReduced) {
    gsap.set(document.querySelectorAll("[data-hero-elem], .hero-eyebrow, .hero-display-heading, .hero-lead-desc, .hero-cta-group, .hero-3d-col, .hero-expertise-strip"), {
      opacity: 1,
      y: 0,
      scale: 1
    });
    return;
  }

  // 2. Entrance Animation Sequence
  const kicker = document.querySelector("[data-hero-elem='kicker'], .hero-eyebrow");
  const heading = document.querySelector("[data-hero-elem='heading'], .hero-display-heading");
  const headingLines = heading ? heading.querySelectorAll(".heading-line") : [];
  const accentBar = document.querySelector("[data-hero-elem='accent-bar'], .headline-accent-bar");
  const desc = document.querySelector("[data-hero-elem='desc'], .hero-lead-desc");
  const ctas = document.querySelectorAll(".hero-cta-group a, .hero-cta-group button");
  const stripItems = document.querySelectorAll(".hero-expertise-strip .expertise-item");

  gsap.set([kicker, desc, accentBar], { opacity: 0, y: 15 });
  if (headingLines.length > 0) gsap.set(headingLines, { opacity: 0, y: 22 });
  else if (heading) gsap.set(heading, { opacity: 0, y: 22 });
  gsap.set(ctas, { opacity: 0, y: 14 });
  gsap.set(stripItems, { opacity: 0, y: 12 });
  if (hero3dContainer) gsap.set(hero3dContainer, { opacity: 0, scale: 0.88 });

  const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  entranceTl
    .to(kicker, { opacity: 1, y: 0, duration: 0.5 }, 0.08)
    .to(headingLines.length > 0 ? headingLines : heading, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, 0.2)
    .to(accentBar, { opacity: 1, y: 0, duration: 0.4 }, 0.38)
    .to(desc, { opacity: 1, y: 0, duration: 0.6 }, 0.45)
    .to(ctas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.58)
    .to(hero3dContainer, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 0.4)
    .to(stripItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.75);

  // 3. ScrollTrigger Scroll-Linked Rotation (Scrubbing based on scroll)
  if (typeof ScrollTrigger !== "undefined" && hero) {
    const isMobile = window.innerWidth <= 768;

    gsap.to(cubeWrapper, {
      rotationY: isMobile ? 180 : 360,
      rotationX: 15,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    const panelCode = document.querySelector(".panel-code");
    const panelAi = document.querySelector(".panel-ai");
    const panelCloud = document.querySelector(".panel-cloud");

    if (panelCode) {
      gsap.to(panelCode, {
        y: isMobile ? -20 : -35,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 }
      });
    }

    if (panelAi) {
      gsap.to(panelAi, {
        y: isMobile ? -30 : -55,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 }
      });
    }

    if (panelCloud) {
      gsap.to(panelCloud, {
        y: isMobile ? -15 : -25,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 }
      });
    }

    if (platform) {
      gsap.to(platform, {
        y: isMobile ? 18 : 28,
        rotationX: 62,
        rotationZ: -45,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1.5 }
      });
    }
  }

  // 4. Idle Floating Animations (Independent of scroll)
  if (cubeInner) {
    gsap.to(cubeInner, {
      y: 6,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  const panelCode = document.querySelector(".panel-code");
  const panelAi = document.querySelector(".panel-ai");
  const panelCloud = document.querySelector(".panel-cloud");

  if (panelCode) {
    gsap.to(panelCode, {
      z: "+=12",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  if (panelAi) {
    gsap.to(panelAi, {
      z: "+=14",
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.3
    });
  }

  if (panelCloud) {
    gsap.to(panelCloud, {
      z: "+=10",
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.6
    });
  }
});
