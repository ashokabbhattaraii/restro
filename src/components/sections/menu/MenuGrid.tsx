"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import FoodImage from "@/components/shared/FoodImage";
import CategoryTabs from "@/components/sections/menu/CategoryTabs";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { menuCategories } from "@/lib/constants";
import { fetcher, slugify } from "@/lib/utils";
import type { MenuItem } from "@/types";

export default function MenuGrid() {
  const [active, setActive] = useState("All");
  const { data = [] } = useSWR<MenuItem[]>("/api/menu", fetcher);

  // Sync the active category with the URL hash so mega-menu deep links
  // (e.g. /menu#nepali) and shareable links land on the right section.
  useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!hash) return;
      const match = menuCategories.find((category) => slugify(category) === hash);
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

  return (
    <>
      <CategoryTabs active={active} onChange={setActive} />
      <section className="section menu-section">
        <div className="container menu-stack">
          {Object.entries(grouped).map(([category, items]) => (
            <section className="menu-category" key={category} id={slugify(category)}>
              <div className="menu-category-head">
                <div>
                  <span className="menu-category-eyebrow">Our Selection</span>
                  <h2>{category}</h2>
                </div>
                <span className="menu-count">{items.length} {items.length === 1 ? "dish" : "dishes"}</span>
              </div>
              <motion.div className="menu-grid" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
                {items.map((item) => (
                  <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
                    <Card className="menu-item">
                      <FoodImage src={item.image} alt={item.name} />
                      <div className="menu-copy">
                        <div className="menu-title-line">
                          <h3>{item.name}</h3>
                          <span />
                          <strong>{item.price}</strong>
                        </div>
                        <p>{item.description}</p>
                        <div className="diet-row">
                          {item.dietary.map((chip) => (
                            <Badge key={chip}>{chip}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
