"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";
import Image from "next/image";
import CategoryTabs from "@/components/sections/menu/CategoryTabs";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { menuCategories } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { useMenuItems } from "@/hooks/useApi";
import type { MenuItem } from "@/types";


function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="menu-item">
      <div className="menu-item-img">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 104px"
        />
      </div>

      <div className="menu-copy">
        <div className="menu-title-line">
          <h3>{item.name}</h3>
          <span />
          <strong>{item.price}</strong>
        </div>
        <p style={{ fontSize: "13px", margin: "6px 0 10px", lineHeight: 1.5 }}>{item.description}</p>
        <div className="diet-row">
          {item.dietary.map((chip) => (
            <Badge key={chip}>{chip}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function MenuGrid() {
  initGSAP();
  const [active, setActive] = useState("All");
  const { data: data = [] } = useMenuItems();
  const gridRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef(active);

  useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!hash) return;
      const match = menuCategories.find((c) => slugify(c) === hash);
      if (match) setActive(match);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const grouped = useMemo(() => {
    const filtered = active === "All" ? data : data.filter((item) => item.category === active);
    return filtered.reduce<Record<string, MenuItem[]>>((acc, item) => {
      acc[item.category] ??= [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [active, data]);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll<HTMLElement>(".menu-item-wrap");
    if (items.length === 0) return;

    const isSwitch = prevActive.current !== active;
    prevActive.current = active;

    if (isSwitch) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.33, stagger: 0.05, ease: "power3.out" }
      );
    } else {
      const sections = gridRef.current.querySelectorAll<HTMLElement>(".menu-category");
      sections.forEach((section) => {
        const sectionItems = section.querySelectorAll<HTMLElement>(".menu-item-wrap");
        gsap.set(sectionItems, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(sectionItems, { opacity: 1, y: 0, duration: 0.36, stagger: 0.05, ease: "power2.out" });
          },
        });
      });
    }
  }, [grouped, active]);

  return (
    <>
      <CategoryTabs active={active} onChange={setActive} />
      <section className="section menu-section">
        <div className="container menu-stack" ref={gridRef}>
          {Object.entries(grouped).map(([category, items]) => (
            <section className="menu-category" key={category} id={slugify(category)}>
              <div className="menu-category-head">
                <div>
                  <span className="menu-category-eyebrow">Our Selection</span>
                  <h2>{category}</h2>
                </div>
                <span className="menu-count">{items.length} {items.length === 1 ? "dish" : "dishes"}</span>
              </div>

              <div className="menu-grid">
                {items.map((item) => (
                  <div key={item._id || item.id} className="menu-item-wrap" style={{ opacity: 0 }}>
                    <MenuItemCard item={item} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
