"use client";

import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function useCounter(to: number, duration = 1.2) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toString());
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, duration, inView, to]);

  return { ref, value: rounded };
}
