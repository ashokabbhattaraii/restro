"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import FoodImage from "@/components/shared/FoodImage";
import AdminModal from "@/components/admin/AdminModal";
import Toggle from "@/components/ui/Toggle";
import { menuItems } from "@/lib/constants";

type MenuItem = (typeof menuItems)[number];

export default function AdminMenu() {
  const [filter, setFilter] = useState("all");
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const categories = ["all", ...new Set(menuItems.map((i) => i.category.toLowerCase()))];
  const filtered = filter === "all" ? menuItems : menuItems.filter((i) => i.category.toLowerCase() === filter);

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Menu Items</h2>
          <button type="button" className="admin-btn-primary">+ Add Item</button>
        </div>
        <div className="admin-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`admin-chip ${filter === cat ? "admin-chip--active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="admin-menu-grid">
          {filtered.map((item) => (
            <div className="admin-menu-card" key={item.id}>
              <FoodImage src={item.image} alt={item.name} />
              <div className="admin-menu-card-body">
                <div className="admin-menu-card-top">
                  <h3>{item.name}</h3>
                  <button
                    type="button"
                    className="admin-menu-edit-btn"
                    onClick={() => setEditItem(item)}
                    aria-label="Edit"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
                <span className="admin-badge">{item.category}</span>
                <div className="admin-menu-card-footer">
                  <strong>{item.price}</strong>
                  <Toggle checked={Boolean(item.visible)} label="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AdminModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Menu Item" size="md">
        {editItem && (
          <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setEditItem(null); }}>
            <label>
              <span>Name</span>
              <input className="admin-input" defaultValue={editItem.name} />
            </label>
            <label>
              <span>Category</span>
              <select className="admin-input admin-select" defaultValue={editItem.category}>
                <option>Nepali</option>
                <option>Indian</option>
                <option>Chinese</option>
                <option>BBQ & Grill</option>
                <option>Drinks</option>
                <option>Desserts</option>
              </select>
            </label>
            <label>
              <span>Price</span>
              <input className="admin-input" defaultValue={editItem.price} />
            </label>
            <label>
              <span>Description</span>
              <textarea className="admin-input admin-textarea" rows={3} defaultValue={editItem.description || ""} />
            </label>
            <div className="admin-toggle-row">
              <Toggle checked={Boolean(editItem.featured)} label="Featured" />
              <Toggle checked={Boolean(editItem.visible)} label="Visible" />
            </div>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary">Save Changes</button>
              <button type="button" className="admin-btn-sm admin-btn-sm--danger">Delete Item</button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
