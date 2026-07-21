"use client";

import { useConfig } from "@/hooks/useConfig";
import { slugify } from "@/lib/utils";

export default function GalleryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (filter: string) => void;
}) {
  const { config, loading } = useConfig();
  const filters = config.galleryCategories.length > 0 ? config.galleryCategories : ["All", "Food", "Dining Area", "Bar", "Events", "Exterior"];

  const handleClick = (filter: string) => {
    onChange(filter);
    const url = filter === "All" ? window.location.pathname : `#${slugify(filter)}`;
    window.history.replaceState(null, "", url);
  };

  if (loading) return null;

  return (
    <div className="sticky-tabs">
      <div className="container tab-row">
        {filters.map((filter) => (
          <button
            className={active === filter ? "active" : ""}
            key={filter}
            onClick={() => handleClick(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
