"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { initGSAP } from "@/lib/gsap";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: ReactNode }) {
  initGSAP();
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.inOut" });
  }, [pathname]);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
