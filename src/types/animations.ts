import type { gsap } from "gsap";

/**
 * Types for Apple-inspired Scroll Animation System
 */

export type RevealVariant =
  | "heading"
  | "words"
  | "lines"
  | "fade-up"
  | "scale-in"
  | "hero"
  | "stagger";

export interface RevealOptions {
  duration?: number;
  yOffset?: number;
  wordStagger?: number;
  elementStagger?: number;
  ease?: string;
  triggerHook?: string;
  once?: boolean;
}

export interface AnimationController {
  init(): void;
  destroy(): void;
  refresh(): void;
  playHero(): gsap.core.Timeline | null;
  isReducedMotion(): boolean;
  isInitialized(): boolean;
}

