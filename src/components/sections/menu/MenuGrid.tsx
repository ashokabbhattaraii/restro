"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import useSWR from "swr";
import FoodImage from "@/components/shared/FoodImage";
import CategoryTabs from "@/components/sections/menu/CategoryTabs";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { fetcher } from "@/lib/utils";
import type { MenuItem } from "@/types";

export default function MenuGrid() {
  const [active, setActive] = useState("All");
  const { data = [] } = useSWR<MenuItem[]>("/api/menu", fetcher);

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
            <section className="menu-category" key={category}>
              <h2>{category}</h2>
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
