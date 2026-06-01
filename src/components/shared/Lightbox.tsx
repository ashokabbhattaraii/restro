"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import type { GalleryImage } from "@/types";
import { shimmer, toBase64 } from "@/lib/utils";

export default function Lightbox({
  images,
  activeIndex,
  onClose,
  onMove,
}: {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onMove: (direction: number) => void;
}) {
  const active = activeIndex === null ? null : images[activeIndex];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onMove(-1);
      if (event.key === "ArrowRight") onMove(1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onMove]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="lightbox-counter">
            {activeIndex! + 1} / {images.length}
          </div>
          <button className="lightbox-close" onClick={onClose} type="button" aria-label="Close">
            <X size={20} />
          </button>
          <button className="lightbox-arrow" onClick={() => onMove(-1)} type="button" aria-label="Previous">
            <ChevronLeft size={24} />
          </button>
          <motion.figure
            className="lightbox-frame"
            key={active.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div className="lightbox-image-wrap">
              <Image
                src={active.image}
                alt={active.title}
                fill
                sizes="90vw"
                quality={90}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1200, 800))}`}
              />
            </div>
            <figcaption>
              <span>{active.category}</span>
              <strong>{active.title}</strong>
            </figcaption>
          </motion.figure>
          <button className="lightbox-arrow" onClick={() => onMove(1)} type="button" aria-label="Next">
            <ChevronRight size={24} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
