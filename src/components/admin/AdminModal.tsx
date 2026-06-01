"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function AdminModal({ open, onClose, title, children, size = "md" }: AdminModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 400, md: 520, lg: 680 };

  return (
    <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal" ref={ref} style={{ maxWidth: widths[size] }}>
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
