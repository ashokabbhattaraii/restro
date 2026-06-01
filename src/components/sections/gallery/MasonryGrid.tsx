"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import GalleryFilter from "@/components/sections/gallery/GalleryFilter";
import Lightbox from "@/components/shared/Lightbox";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Badge from "@/components/ui/Badge";
import { fetcher } from "@/lib/utils";
import type { GalleryImage } from "@/types";

export default function MasonryGrid() {
  const [filter, setFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data = [] } = useSWR<GalleryImage[]>(`/api/gallery${filter === "All" ? "" : `?category=${encodeURIComponent(filter)}`}`, fetcher);

  const images = useMemo(() => data, [data]);
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
        <div className="container masonry-grid">
          {images.map((item, index) => (
            <button
              className={`gallery-tile ${item.shape ?? ""}`}
              key={item.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <OptimizedImage src={item.image} alt={item.title} />
              <Badge>{item.category}</Badge>
              <strong>{item.title}</strong>
              <span className="zoom-mark"><Search size={24} /></span>
            </button>
          ))}
        </div>
      </section>
      <Lightbox images={images} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onMove={move} />
    </>
  );
}
