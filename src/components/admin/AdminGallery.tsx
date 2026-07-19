"use client";

import { useState, useMemo, useCallback } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { Trash2, UploadCloud, GripVertical, Search, Plus, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import OptimizedImage from "@/components/shared/OptimizedImage";
import AdminPagination from "@/components/admin/AdminPagination";
import { useGalleryImages, useCreateGalleryImage, useDeleteGalleryImage } from "@/hooks/useApi";
import toast from "react-hot-toast";
import type { GalleryImage } from "@/types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CATEGORIES = ["all", "Food", "Dining Area", "Bar", "Events", "Exterior"];

function SortableImage({
  item,
  onDelete,
}: {
  item: { _id?: string; id?: string; image: string; title: string; category: string };
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item._id || item.id || item.image });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`admin-gallery-item dnd-gallery-item ${isDragging ? "dragging" : ""}`}
    >
      <OptimizedImage src={item.image} alt={item.title} />
      <div className="admin-gallery-item-overlay">
        <button
          type="button"
          className="drag-handle"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>
        <span className="admin-badge">{item.category}</span>
        <button
          type="button"
          className="admin-gallery-delete"
          aria-label="Delete"
          onClick={() => onDelete(item._id || item.id || "")}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const { data: galleryImages = [] } = useGalleryImages();
  const createImage = useCreateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const [addMode, setAddMode] = useState(false);
  const [items, setItems] = useState<typeof galleryImages>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => {
      setSearch(val);
      setCurrentPage(1);
    }, []),
    250
  );

  const displayItems = items.length > 0 ? items : galleryImages;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return displayItems.filter((img) => {
      const matchSearch = !search ||
        img.title.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || img.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [displayItems, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteImage.mutateAsync(id);
      toast.success("Image deleted");
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleCreateImage = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createImage.mutateAsync({
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        category: (form.elements.namedItem("category") as HTMLSelectElement).value as GalleryImage["category"],
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
      });
      toast.success("Image added to gallery");
      setAddMode(false);
    } catch {
      toast.error("Failed to add image");
    }
  }, [createImage]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = paginatedItems.findIndex(
      (i) => (i._id || i.id || i.image) === active.id
    );
    const newIndex = paginatedItems.findIndex(
      (i) => (i._id || i.id || i.image) === over.id
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = [...paginatedItems];
    const [moved] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, moved);
    setItems(newItems);
  };

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Gallery</h2>
          <span className="admin-panel-badge">{galleryImages.length} images</span>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-input admin-search-input"
              type="text"
              placeholder="Search by title or category…"
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <div className="admin-filters-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`admin-chip ${categoryFilter === cat ? "admin-chip--active" : ""}`}
                onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="admin-btn-primary" style={{ marginBottom: 16, alignSelf: "flex-start" }} onClick={() => setAddMode(true)}>
          <Plus size={14} /> Add Image
        </button>

        {paginatedItems.length === 0 ? (
          <p className="admin-empty">No images match your search.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={paginatedItems.map((i) => i._id || i.id || i.image)}
              strategy={rectSortingStrategy}
            >
              <div className="admin-gallery-grid">
                {paginatedItems.map((item) => (
                  <SortableImage
                    key={item._id || item.id || item.image}
                    item={item}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={filtered.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      {/* Add Image Modal */}
      <AdminModal open={addMode} onClose={() => setAddMode(false)} title="Add Gallery Image" size="md">
        <form className="admin-form" onSubmit={handleCreateImage}>
          <label>
            <span>Title</span>
            <input className="admin-input" name="title" required />
          </label>
          <label>
            <span>Category</span>
            <select className="admin-input admin-select" name="category" defaultValue="Food">
              <option>Food</option>
              <option>Dining Area</option>
              <option>Bar</option>
              <option>Events</option>
              <option>Exterior</option>
            </select>
          </label>
          <label>
            <span>Image URL</span>
            <input className="admin-input" name="image" placeholder="https://…" required />
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createImage.isPending}>
              {createImage.isPending ? <><Loader2 size={13} className="animate-spin" /> Adding…</> : "Add to Gallery"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setAddMode(false)}>Cancel</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
