"use client";

import {
  CalendarCheck,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  PartyPopper,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { restaurant } from "@/lib/constants";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/events", label: "Events", icon: PartyPopper },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { logout, admin } = useAdmin();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="admin-sidebar-overlay" onClick={onClose} />
      )}
      <aside className={`admin-sidebar ${open ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo flex items-center gap-2">
            <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-8 w-auto rounded-full object-contain filter drop-shadow-[0_0_6px_rgba(230,195,98,0.25)]" />
            <strong className="tracking-tight text-lg">NR&B</strong>
            <span>Admin</span>
          </div>
          {onClose && (
            <button className="admin-sidebar-close" type="button" onClick={onClose} aria-label="Close menu">
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="admin-nav">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                className={active ? "active" : ""}
                href={link.href}
                key={link.href}
                onClick={onClose}
              >
                <Icon size={17} strokeWidth={1.7} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-user">
          <div className="avatar">{admin?.name?.[0] || "A"}</div>
          <div>
            <strong>{admin?.name || "Admin"}</strong>
            <span>Manager</span>
          </div>
          <button type="button" className="admin-logout-btn" onClick={logout} aria-label="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}
