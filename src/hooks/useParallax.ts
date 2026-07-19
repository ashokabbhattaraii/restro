"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";


/**
 * Attaches a GSAP ScrollTrigger parallax effect to the returned ref.
 * The element will translate vertically by `distance` px over the scroll range.
 */
export function useParallax(distance = 120) {
  initGSAP();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.to(el, {
      y: distance * 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [distance]);

  return ref;
}
