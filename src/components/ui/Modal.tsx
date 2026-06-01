"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export default function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (open) {
      gsap.set(backdrop, { display: "flex" });
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power1.out" });
      gsap.fromTo(
        panel,
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    } else {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => { gsap.set(backdrop, { display: "none" }); },
      });
    }
  }, [open]);

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      style={{ display: "none", opacity: 0 }}
    >
      <div ref={panelRef} className="modal-panel" style={{ opacity: 0 }}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button onClick={onClose} type="button">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
