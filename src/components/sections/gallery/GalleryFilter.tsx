"use client";

import { galleryFilters } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export default function GalleryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (filter: string) => void;
}) {
  const handleClick = (filter: string) => {
    onChange(filter);
    const url = filter === "All" ? window.location.pathname : `#${slugify(filter)}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="sticky-tabs">
      <div className="container tab-row">
        {galleryFilters.map((filter) => (
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
