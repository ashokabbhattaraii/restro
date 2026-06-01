"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

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
          <ArrowUp size={20} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
