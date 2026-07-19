"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";


type Direction = "up" | "left" | "right" | "fade";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  fade: { x: 0, y: 0 },
};

export default function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: {
  children?: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
}) {
  initGSAP();
  const ref = useRef<HTMLDivElement>(null);
  const offset = offsets[direction];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, x: offset.x, y: offset.y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.45,
          delay,
          ease: "power2.out",
        });
      },
      onLeaveBack: once
        ? undefined
        : () => {
            gsap.set(el, { opacity: 0, x: offset.x, y: offset.y });
          },
    });

    return () => trigger.kill();
  }, [delay, offset.x, offset.y, once]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
