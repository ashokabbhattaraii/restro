"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import GalleryFilter from "@/components/sections/gallery/GalleryFilter";
import Lightbox from "@/components/shared/Lightbox";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { useGalleryImages } from "@/hooks/useApi";
import { useConfig } from "@/hooks/useConfig";


export default function MasonryGrid() {
  initGSAP();
  const [filter, setFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data: data = [] } = useGalleryImages(filter === "All" ? undefined : filter);
  const { config } = useConfig();
  const galleryFilters = useMemo(() => config.galleryCategories.length > 0 ? config.galleryCategories : ["All", "Food", "Dining Area", "Bar", "Events", "Exterior"], [config.galleryCategories]);
  const gridRef = useRef<HTMLDivElement>(null);
  const prevFilter = useRef(filter);

  useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!hash) return;
      const match = galleryFilters.find((c) => slugify(c) === hash);
      if (match) setFilter(match);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [galleryFilters]);

  const images = useMemo(() => data, [data]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = grid.querySelectorAll<HTMLElement>(".gallery-tile");
    if (tiles.length === 0) return;

    const isSwitch = prevFilter.current !== filter;
    prevFilter.current = filter;

    if (isSwitch) {
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.88, y: 30 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.39, stagger: { each: 0.06, from: "random" }, ease: "power3.out",
        }
      );
    } else {
      gsap.set(tiles, { opacity: 0, scale: 0.9, y: 40 });
      ScrollTrigger.create({
        trigger: grid,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(tiles, {
            opacity: 1, scale: 1, y: 0,
            duration: 0.42, stagger: { each: 0.07, from: "start" }, ease: "power3.out",
          });
        },
      });
    }
  }, [images, filter]);

  const move = (direction: number) => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + direction + images.length) % images.length;
    });
  };

  return (
    <>
      <GalleryFilter active={filter} onChange={setFilter} />
      <section className="section">
        <div className="container masonry-grid" ref={gridRef}>
          {images.map((item, index) => (
            <button
              className={`gallery-tile ${item.shape ?? ""}`}
              key={item._id || item.id}
              onClick={() => setActiveIndex(index)}
              type="button"
              aria-label={`View ${item.title}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <strong>{item.title}</strong>
              <span className="zoom-mark" aria-hidden="true"><Search size={22} /></span>
            </button>
          ))}
        </div>

        {images.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <p>No images found in this category.</p>
          </div>
        )}
      </section>
      <Lightbox images={images} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onMove={move} />
    </>
  );
}
