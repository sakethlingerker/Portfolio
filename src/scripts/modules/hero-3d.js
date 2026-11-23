/**
 * 3D Engineering Core Hero Animation Module
 * Genuine CSS 3D Scene with ScrollTrigger scroll-linked rotation,
 * independent floating idle animations, and coordinated entrance sequence.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ensure global reference for testing and standalone coordination
if (typeof window !== "undefined") {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

export function initHero3D() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const cubeWrapper = document.getElementById("cube-wrapper");
  const cubeInner = document.getElementById("cube-inner");
  const hero3dContainer = document.getElementById("hero-3d-container");

  if (!cubeWrapper || !hero3dContainer) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Initial 3D Isometric View Setup
  gsap.set(cubeWrapper, {
    rotationX: 20,
    rotationY: -35,
    transformStyle: "preserve-3d"
  });

  const platform = hero.querySelector(".platform");
  if (platform) {
    gsap.set(platform, {
      rotationX: 62,
      rotationZ: -45,
      transformStyle: "preserve-3d"
    });
  }

  // If user prefers reduced motion, set static elements and exit
  if (prefersReduced) {
    gsap.set([
      "[data-hero-elem='kicker']",
      "[data-hero-elem='heading']",
      "[data-hero-elem='accent-bar']",
      "[data-hero-elem='desc']",
      "[data-hero-elem='cta']",
      "[data-hero-elem='3d-col']",
      "[data-hero-elem='expertise']",
      hero3dContainer,
      cubeWrapper
    ], {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: "all"
    });
    gsap.set(cubeWrapper, {
      rotationX: 20,
      rotationY: -35
    });
    return;
  }

  // 2. Entrance Animation Sequence (Synchronized with page load or preloader dismissal)
  const eyebrow = hero.querySelector("[data-hero-elem='kicker']");
  const heading = hero.querySelector("[data-hero-elem='heading']");
  const headingLines = heading ? heading.querySelectorAll(".heading-line") : [];
  const accentBar = hero.querySelector("[data-hero-elem='accent-bar']");
  const desc = hero.querySelector("[data-hero-elem='desc']");
  const ctaGroup = hero.querySelector("[data-hero-elem='cta']");
  const ctaButtons = ctaGroup ? ctaGroup.querySelectorAll("a") : [];
  const expertiseStrip = hero.querySelector("[data-hero-elem='expertise']");
  const expertiseItems = expertiseStrip ? expertiseStrip.querySelectorAll(".expertise-item") : [];

  // Initial hidden state for entrance
  gsap.set([eyebrow, desc, accentBar], { opacity: 0, y: 15 });
  gsap.set(headingLines, { opacity: 0, y: 22 });
  gsap.set(ctaButtons, { opacity: 0, y: 14 });
  gsap.set(expertiseItems, { opacity: 0, y: 12 });
  gsap.set(hero3dContainer, { opacity: 0 });

  const entranceTl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
    onComplete: () => {
      gsap.set([eyebrow, desc, headingLines, ctaButtons, expertiseItems, hero3dContainer], {
        clearProps: "willChange,transform,opacity"
      });
      gsap.set(cubeWrapper, {
        rotationX: 22,
        rotationY: -38,
        transformStyle: "preserve-3d"
      });
    }
  });

  entranceTl
    .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0.08)
    .to(headingLines, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, 0.2)
    .to(accentBar, { opacity: 1, y: 0, duration: 0.4 }, 0.38)
    .to(desc, { opacity: 1, y: 0, duration: 0.6 }, 0.45)
    .to(ctaButtons, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.58)
    .to(hero3dContainer, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.4)
    .to(expertiseItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.75);

  const startEntrance = () => entranceTl.play();

  // Listen for preloader completion or trigger immediately
  if (document.body.classList.contains("hero-ready") || !document.querySelector(".boot")) {
    startEntrance();
  } else {
    window.addEventListener("hero:ready", startEntrance, { once: true });
    // Safety fallback
    setTimeout(startEntrance, 1200);
  }

  // 3. ScrollTrigger Scroll-Linked Animation (Scroll Scrub)
  const isMobile = window.innerWidth <= 768;

  // Cube Rotation Linked to Scroll Progress
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

  // Parallax on Floating Panels during scroll
  const panelCode = hero.querySelector(".panel-code");
  const panelAi = hero.querySelector(".panel-ai");
  const panelCloud = hero.querySelector(".panel-cloud");

  if (panelCode) {
    gsap.to(panelCode, {
      y: isMobile ? -20 : -35,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  if (panelAi) {
    gsap.to(panelAi, {
      y: isMobile ? -30 : -55,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  if (panelCloud) {
    gsap.to(panelCloud, {
      y: isMobile ? -15 : -25,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  if (platform) {
    gsap.to(platform, {
      y: isMobile ? 18 : 28,
      rotationX: 62,
      rotationZ: -45,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.5
      }
    });
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
}
