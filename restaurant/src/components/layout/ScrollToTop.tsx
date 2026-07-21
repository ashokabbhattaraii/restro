"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  // Smooth the progress so the ring eases instead of snapping.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => scrollY.on("change", (latest) => setVisible(latest > 400)), [scrollY]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          className="scroll-top"
          type="button"
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg className="scroll-top-ring" viewBox="0 0 48 48" aria-hidden="true">
            {/* Track */}
            <circle cx="24" cy="24" r="21" className="scroll-top-track" />
            {/* Progress — pathLength normalized to 1 so it maps directly to scroll progress */}
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              className="scroll-top-progress"
              pathLength={1}
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp size={19} className="scroll-top-icon" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
