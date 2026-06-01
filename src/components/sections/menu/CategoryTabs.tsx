"use client";

const categories = ["All", "Nepali", "Indian", "Chinese", "BBQ & Grill", "Drinks & Bar", "Desserts"];

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="sticky-tabs">
      <div className="container tab-row">
        {categories.map((category) => (
          <button
            className={active === category ? "active" : ""}
            key={category}
            onClick={() => onChange(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
