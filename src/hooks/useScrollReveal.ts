"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";


export function useScrollReveal(once = true) {
  initGSAP();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
      },
      onLeaveBack: once
        ? undefined
        : () => gsap.set(el, { opacity: 0, y: 30 }),
    });

    return () => trigger.kill();
  }, [once]);

  return { ref };
}
