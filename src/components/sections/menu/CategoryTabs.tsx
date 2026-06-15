"use client";

import { menuCategories } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  const handleClick = (category: string) => {
    onChange(category);
    const url = category === "All" ? window.location.pathname : `#${slugify(category)}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="sticky-tabs">
      <div className="container tab-row">
        {menuCategories.map((category) => (
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
