"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/reservations": "Reservations",
  "/admin/menu": "Menu Management",
  "/admin/gallery": "Gallery",
  "/admin/events": "Events",
  "/admin/staff": "Staff",
  "/admin/messages": "Messages",
};

export default function AdminTopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="admin-topbar">
      {onMenuToggle && (
        <button type="button" className="admin-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <Menu size={18} strokeWidth={1.8} />
        </button>
      )}
      <div className="admin-topbar-title">
        <span>Admin / {title}</span>
        <h1>{title}</h1>
      </div>
      <div className="admin-topbar-actions">
        <ThemeToggle />
        <button type="button" aria-label="Notifications">
          <Bell size={16} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
