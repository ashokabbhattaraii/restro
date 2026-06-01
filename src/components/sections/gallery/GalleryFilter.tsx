"use client";

const filters = ["All", "Food", "Dining Area", "Bar", "Events", "Exterior"];

export default function GalleryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (filter: string) => void;
}) {
  return (
    <div className="sticky-tabs">
      <div className="container tab-row">
        {filters.map((filter) => (
          <button
            className={active === filter ? "active" : ""}
            key={filter}
            onClick={() => onChange(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
