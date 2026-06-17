"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSWR from "swr";
import GalleryFilter from "@/components/sections/gallery/GalleryFilter";
import Lightbox from "@/components/shared/Lightbox";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { galleryFilters, galleryImages as staticImages } from "@/lib/constants";
import { fetcher, slugify } from "@/lib/utils";
import type { GalleryImage } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function MasonryGrid() {
  const [filter, setFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data = staticImages } = useSWR<GalleryImage[]>(
    `/api/gallery${filter === "All" ? "" : `?category=${encodeURIComponent(filter)}`}`,
    fetcher
  );
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
  }, []);

  const images = useMemo(() => data, [data]);

  /* ── Animate tiles on filter change or initial load ── */
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
          duration: 0.6, stagger: { each: 0.06, from: "random" }, ease: "power3.out",
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
            duration: 0.65, stagger: { each: 0.07, from: "start" }, ease: "power3.out",
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
              key={item.id}
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
              <Badge>{item.category}</Badge>
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
