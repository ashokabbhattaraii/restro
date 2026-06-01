"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, restaurant } from "@/lib/constants";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const wrapper = mobileNavRef.current;
    if (!wrapper) return;

    const overlay = wrapper.querySelector(".mobile-nav-overlay");
    const sidebar = wrapper.querySelector(".mobile-nav-sidebar");

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.set(wrapper, { display: "block" });
      
      gsap.fromTo(overlay, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      
      gsap.fromTo(sidebar, 
        { x: "100%" }, 
        { x: "0%", duration: 0.4, ease: "power3.out" }
      );

      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.35, delay: 0.1, stagger: 0.05, ease: "power2.out" }
      );
    } else {
      document.body.style.overflow = "";

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(wrapper, { display: "none" });
        }
      });

      tl.to(itemsRef.current.filter(Boolean), {
        opacity: 0,
        x: 20,
        duration: 0.15,
        stagger: 0.03,
        ease: "power2.in"
      }, 0);

      tl.to(sidebar, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in"
      }, 0);

      tl.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, 0);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link className="brand flex items-center gap-3" href="/">
            <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-10 w-auto rounded-full object-contain filter drop-shadow-[0_0_8px_rgba(230,195,98,0.25)]" />
            <span className="font-display tracking-tight text-xl md:text-2xl">{restaurant.name}</span>
          </Link>
          <nav className="nav-links desktop-nav" aria-label="Primary">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link className={active ? "active" : ""} href={link.href} key={link.href}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="nav-actions">
            <ThemeToggle />
            <Button href="/reservation" variant="ghost" className="nav-cta">
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

      <div
        ref={mobileNavRef}
        className="mobile-nav-wrapper"
        style={{ display: "none" }}
      >
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)} />
        
        <aside className="mobile-nav-sidebar">
          <div className="mobile-nav-header">
            <Link className="brand flex items-center gap-2" href="/" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-9 w-auto rounded-full object-contain filter drop-shadow-[0_0_6px_rgba(230,195,98,0.25)]" />
              <span className="font-display tracking-tight text-lg">{restaurant.monogram}</span>
            </Link>
            <button
              aria-label="Close menu"
              className="menu-close-btn"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            {navLinks.map((link, index) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <div
                  key={link.href}
                  ref={(el) => { itemsRef.current[index] = el; }}
                  style={{ opacity: 0 }}
                  className="mobile-nav-item"
                >
                  <Link
                    className={active ? "active" : ""}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <span>{link.label}</span>
                  </Link>
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
              <p className="phone-numbers">{restaurant.phoneOne} · {restaurant.phoneTwo}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
