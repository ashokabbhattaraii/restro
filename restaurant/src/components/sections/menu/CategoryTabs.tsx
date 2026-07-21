"use client";

import { useConfig } from "@/hooks/useConfig";
import { slugify } from "@/lib/utils";

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  const { config, loading } = useConfig();
  const categories = config.menuCategories.length > 0 ? config.menuCategories : ["All", "Nepali", "Indian", "Chinese", "BBQ & Grill", "Drinks & Bar", "Desserts"];

  const handleClick = (category: string) => {
    onChange(category);
    const url = category === "All" ? window.location.pathname : `#${slugify(category)}`;
    window.history.replaceState(null, "", url);
  };

  if (loading) return null;

  return (
    <div className="sticky-tabs">
      <div className="container tab-row">
        {categories.map((category) => (
          <button
            className={active === category ? "active" : ""}
            key={category}
            onClick={() => handleClick(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
