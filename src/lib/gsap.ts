import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

export function initGSAP() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.normalizeScroll(true);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animDefaults() {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      overwrite: "auto",
    } as const;
  }
  return {};
}

export const STAGGER_FAST = 0.05;
export const STAGGER_MED = 0.08;
export const STAGGER_SLOW = 0.11;

export const DURATION_FAST = 0.3;
export const DURATION_MED = 0.45;
export const DURATION_SLOW = 0.6;

export { gsap, ScrollTrigger };
