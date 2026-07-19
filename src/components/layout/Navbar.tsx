"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { initGSAP } from "@/lib/gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, restaurant } from "@/lib/constants";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useConfig } from "@/hooks/useConfig";

export default function Navbar() {
  initGSAP();
  const { config } = useConfig();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Desktop mega-menu reveal
  useEffect(() => {
    if (!openMenu) return;
    const panel = panelRefs.current[openMenu];
    if (!panel) return;

    const links = panel.querySelectorAll(".mega-link");
    const tl = gsap.timeline();
    tl.fromTo(
      panel,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.34, ease: "power3.out" }
    ).fromTo(
      links,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.045, ease: "power2.out" },
      "-=0.18"
    );

    return () => { tl.kill(); };
  }, [openMenu]);

  // Mobile drawer
  useEffect(() => {
    const wrapper = mobileNavRef.current;
    if (!wrapper) return;

    const overlay = wrapper.querySelector(".mobile-nav-overlay");
    const sidebar = wrapper.querySelector(".mobile-nav-sidebar");

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.set(wrapper, { display: "block" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
      gsap.fromTo(sidebar, { x: "100%" }, { x: "0%", duration: 0.3, ease: "power3.out" });
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.25, delay: 0.08, stagger: 0.04, ease: "power2.out" }
      );
    } else {
      document.body.style.overflow = "";
      const tl = gsap.timeline({ onComplete: () => { gsap.set(wrapper, { display: "none" }); } });
      tl.to(itemsRef.current.filter(Boolean), { opacity: 0, x: 20, duration: 0.1, stagger: 0.02, ease: "power2.in" }, 0);
      tl.to(sidebar, { x: "100%", duration: 0.2, ease: "power3.in" }, 0);
      tl.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);
    }

    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Swipe to close mobile nav
  useEffect(() => {
    const sidebar = mobileNavRef.current?.querySelector(".mobile-nav-sidebar") as HTMLElement | null;
    if (!sidebar || !open) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0].clientX < window.innerWidth * 0.15) return;
      startX = e.touches[0].clientX;
      isDragging = true;
      gsap.set(sidebar, { clearProps: "transform" });
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (diff > 0) {
        gsap.set(sidebar, { x: -diff });
      }
    };

    const onTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      if (diff > 80) {
        setOpen(false);
      } else {
        gsap.to(sidebar, { x: "0%", duration: 0.25, ease: "power2.out" });
      }
    };

    sidebar.addEventListener("touchstart", onTouchStart, { passive: true });
    sidebar.addEventListener("touchmove", onTouchMove, { passive: true });
    sidebar.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      sidebar.removeEventListener("touchstart", onTouchStart);
      sidebar.removeEventListener("touchmove", onTouchMove);
      sidebar.removeEventListener("touchend", onTouchEnd);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <>
      <header
        className={`site-nav ${scrolled ? "site-nav-scrolled" : ""} ${openMenu ? "site-nav-mega-open" : ""}`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="container nav-inner">
          <Link className="brand flex items-center gap-3" href="/">
            <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-10 w-auto rounded-full object-contain filter drop-shadow-[0_0_8px_rgba(179,137,29,0.25)]" />
            <span className="font-display tracking-tight text-xl md:text-2xl">{restaurant.name}</span>
          </Link>

          <nav className="nav-links desktop-nav" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const hasChildren = !!link.children?.length;
              return (
                <div
                  key={link.href}
                  className="nav-item"
                  onMouseEnter={() => setOpenMenu(hasChildren ? link.href : null)}
                >
                  <Link
                    className={`nav-link ${active ? "active" : ""}`}
                    href={link.href}
                    aria-haspopup={hasChildren || undefined}
                    aria-expanded={hasChildren ? openMenu === link.href : undefined}
                  >
                    {link.label}
                    {hasChildren && <ChevronDown size={14} className="nav-caret" aria-hidden="true" />}
                  </Link>

                  {hasChildren && openMenu === link.href && (
                    <div
                      className="mega-panel"
                      ref={(el) => { panelRefs.current[link.href] = el; }}
                    >
                      <div className="mega-panel-inner glass-panel">
                        <div className="mega-head">
                          <span className="mega-eyebrow">{link.label}</span>
                          <Link className="mega-viewall" href={link.href} onClick={() => setOpenMenu(null)}>
                            View all
                          </Link>
                        </div>
                        <div className="mega-grid">
                          {link.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="mega-link"
                              onClick={() => setOpenMenu(null)}
                            >
                              <strong>{child.label}</strong>
                              {child.description && <span>{child.description}</span>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            <Button href="/reservation" variant="primary" className="nav-cta">
              Reserve a Table
            </Button>
            <button
              aria-expanded={open}
              aria-label="Toggle navigation"
              className={`menu-toggle ${open ? "menu-toggle-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              type="button"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div ref={mobileNavRef} className="mobile-nav-wrapper" style={{ display: "none" }}>
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)} />

        <aside className="mobile-nav-sidebar">
          <div className="mobile-nav-header">
            <Link className="brand flex items-center gap-2" href="/" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-9 w-auto rounded-full object-contain filter drop-shadow-[0_0_6px_rgba(179,137,29,0.25)]" />
              <span className="font-display tracking-tight text-lg">{restaurant.monogram}</span>
            </Link>
            <button aria-label="Close menu" className="menu-close-btn" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              const hasChildren = !!link.children?.length;
              const isExpanded = expanded === link.href;
              return (
                <div
                  key={link.href}
                  ref={(el) => { itemsRef.current[index] = el; }}
                  style={{ opacity: 0 }}
                  className="mobile-nav-item"
                >
                  <div className="mobile-nav-row">
                    <Link
                      className={active ? "active" : ""}
                      href={link.href}
                      onClick={() => setOpen(false)}
                    >
                      <span>{link.label}</span>
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        className={`mobile-sub-toggle ${isExpanded ? "open" : ""}`}
                        aria-label={`Toggle ${link.label} submenu`}
                        aria-expanded={isExpanded}
                        onClick={() => setExpanded(isExpanded ? null : link.href)}
                      >
                        <ChevronDown size={18} />
                      </button>
                    )}
                  </div>
                  {hasChildren && isExpanded && (
                    <div className="mobile-sub-links">
                      {link.children!.map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setOpen(false)}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mobile-nav-footer">
            <Button href="/reservation" onClick={() => setOpen(false)} className="w-full">
              Reserve a Table
            </Button>
            <div className="mobile-nav-info">
              <p>{restaurant.cuisine}</p>
              <p className="phone-numbers">{config.phoneOne} · {config.phoneTwo}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
