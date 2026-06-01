"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSWR from "swr";
import FoodImage from "@/components/shared/FoodImage";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { fetcher } from "@/lib/utils";
import type { MenuItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedDishesSection() {
  const { data = [] } = useSWR<MenuItem[]>("/api/menu?featured=true", fetcher);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || data.length === 0) return;

    const items = grid.querySelectorAll<HTMLElement>(".dish-card-wrapper");
    gsap.set(items, { opacity: 0, y: 60 });

    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
    });

    return () => trigger.kill();
  }, [data]);

  return (
    <section className="section">
      <div className="container">
        <SectionHeader label="Our Signatures" title="Crafted with Tradition" />
        <div className="dish-grid snap-row" ref={gridRef}>
          {data.map((dish) => (
            <div key={dish.id} className="dish-card-wrapper">
              <Card className="dish-card">
                <FoodImage src={dish.image} alt={dish.name} />
                <div className="dish-body">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <div className="dish-footer">
                    <span>{dish.price}</span>
                    <Button href="/menu" variant="ghost">View Menu</Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
