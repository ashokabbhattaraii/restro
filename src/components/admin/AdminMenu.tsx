"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X, Wine, UtensilsCrossed, Download, Trash2, Loader2, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import FoodImage from "@/components/shared/FoodImage";
import AdminModal from "@/components/admin/AdminModal";
import Toggle from "@/components/ui/Toggle";
import {
  useMenuItemsAdmin,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useBulkCreateMenuItems,
} from "@/hooks/useApi";
import type { MenuItem } from "@/types";

const CATEGORIES = ["all", "nepali", "indian", "chinese", "bbq & grill", "drinks & bar", "desserts"];

export default function AdminMenu() {
  const [filter, setFilter] = useState("all");
  const [addMode, setAddMode] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editVisible, setEditVisible] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");
  const [importMode, setImportMode] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Partial<MenuItem>[]>([]);
  const [importStatus, setImportStatus] = useState<"" | "loading" | "done" | "error">("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const { data: menuItems = [] } = useMenuItemsAdmin();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const bulkCreate = useBulkCreateMenuItems();

  const filtered = filter === "all" ? menuItems : menuItems.filter((i) => i.category.toLowerCase() === filter);

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setEditFeatured(Boolean(item.featured));
    setEditVisible(Boolean(item.visible));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const form = e.currentTarget;
    try {
      await updateMenuItem.mutateAsync({
        id: (editItem._id || editItem.id)!,
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        category: (form.elements.namedItem("category") as HTMLSelectElement).value as MenuItem["category"],
        price: (form.elements.namedItem("price") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        featured: editFeatured,
        visible: editVisible,
      });
      toast.success("Menu item updated");
      setEditItem(null);
    } catch {
      toast.error("Failed to update menu item");
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createMenuItem.mutateAsync({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        category: (form.elements.namedItem("category") as HTMLSelectElement).value as MenuItem["category"],
        price: (form.elements.namedItem("price") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        featured: (form.elements.namedItem("featured") as HTMLInputElement).checked,
        visible: true,
      });
      toast.success("Menu item created");
      setAddMode(false);
    } catch {
      toast.error("Failed to create menu item");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await deleteMenuItem.mutateAsync((deleteItem._id || deleteItem.id)!);
      toast.success("Menu item deleted");
      setDeleteItem(null);
    } catch {
      toast.error("Failed to delete menu item");
    }
  };

  const handleBulkUpdate = useCallback(async () => {
    if (!bulkPrice.trim()) return;
    const prefix = bulkPrice.match(/^[A-Za-z\s,]+/) ? bulkPrice.match(/^[A-Za-z\s,]+/)![0] : "IQD ";
    const numPart = bulkPrice.replace(/^[^\d]+/, "");
    const loading = toast.loading(`Updating ${filtered.length} items…`);
    try {
      await Promise.all(
        filtered.map((item) =>
          updateMenuItem.mutateAsync({
            id: (item._id || item.id)!,
            price: `${prefix}${numPart}`,
          })
        )
      );
      toast.dismiss(loading);
      toast.success(`${filtered.length} prices updated`);
      setBulkMode(false);
      setBulkPrice("");
    } catch {
      toast.dismiss(loading);
      toast.error("Bulk price update failed");
    }
  }, [bulkPrice, filtered, updateMenuItem]);

  const handleToggleVisibility = async (item: MenuItem) => {
    try {
      await updateMenuItem.mutateAsync({
        id: (item._id || item.id)!,
        visible: !item.visible,
      });
      toast.success(item.visible ? "Item hidden" : "Item visible");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
        const mapped = json.map((row) => ({
          name: row.name || row.Name || row.NAME || "",
          category: row.category || row.Category || row.CATEGORY || "Nepali",
          description: row.description || row.Description || row.DESCRIPTION || "",
          price: row.price || row.Price || row.PRICE || "IQD 0",
          image: row.image || row.Image || row.IMAGE || row.img || "",
          dietary: (row.dietary || row.Dietary || row.DIETARY || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
          featured: row.featured === "true" || row.featured === "TRUE" || row.Featured === "true",
          visible: row.visible !== "false" && row.visible !== "FALSE",
        })) as Partial<MenuItem>[];
        setImportPreview(mapped);
        toast.success(`${mapped.length} items parsed from file`);
      } catch {
        toast.error("Failed to parse file — check the format");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    setImportFile(file);
    parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleImportConfirm = async () => {
    if (!importPreview.length) return;
    setImportStatus("loading");
    const loading = toast.loading(`Importing ${importPreview.length} items…`);
    try {
      await bulkCreate.mutateAsync(importPreview);
      toast.dismiss(loading);
      toast.success(`${importPreview.length} items imported`);
      setImportStatus("done");
      setTimeout(() => {
        setImportMode(false);
        setImportFile(null);
        setImportPreview([]);
        setImportStatus("");
      }, 1200);
    } catch {
      toast.dismiss(loading);
      toast.error("Import failed — check your data format");
      setImportStatus("error");
    }
  };

  const downloadExample = () => {
    const exampleData = [
      { name: "Momo Steamed", category: "Nepali", price: "IQD 6,000", description: "Hand-folded dumplings with sesame achar", image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=1000&q=85", dietary: "SPICY, HALAL", featured: "true" },
      { name: "Butter Chicken", category: "Indian", price: "IQD 9,000", description: "Tandoor chicken in velvet tomato sauce", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85", dietary: "HALAL", featured: "true" },
      { name: "Spring Rolls", category: "Chinese", price: "IQD 5,500", description: "Golden rolls with sweet chili dip", image: "https://images.unsplash.com/photo-1606525437679-037aca6a5e73?auto=format&fit=crop&w=1000&q=85", dietary: "VEG", featured: "false" },
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exampleData);
    XLSX.utils.book_append_sheet(wb, ws, "Menu");
    XLSX.writeFile(wb, "menu-import-template.xlsx");
    toast.success("Example sheet downloaded");
  };

  const barItems = filter === "all" ? menuItems.filter((i) => i.category.toLowerCase() === "drinks & bar") : [];
  const foodItems = filter === "all" ? menuItems.filter((i) => i.category.toLowerCase() !== "drinks & bar") : filtered;

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Menu Items</h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="admin-panel-badge">{menuItems.length} items</span>
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setAddMode(true)}>
              <Plus size={13} /> Add Item
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setImportMode((v) => !v)}>
              <Upload size={13} /> Import
            </button>
            <button
              type="button"
              className={`admin-btn-sm ${bulkMode ? "admin-btn-primary" : ""}`}
              onClick={() => setBulkMode((v) => !v)}
            >
              <Upload size={13} /> Bulk Price
            </button>
          </div>
        </div>

        {importMode && (
          <div className="admin-import-section">
            <div className="admin-import-header">
              <FileSpreadsheet size={18} />
              <span>Import from Excel / CSV</span>
              <button type="button" className="admin-btn-sm" style={{ marginLeft: "auto" }} onClick={() => { setImportMode(false); setImportFile(null); setImportPreview([]); }}>
                <X size={14} />
              </button>
            </div>
            <div
              ref={dropRef}
              className="admin-upload-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                hidden
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
              {importFile ? (
                <p>{importFile.name} ({importPreview.length} items parsed)</p>
              ) : (
                <>
                  <Upload size={24} />
                  <p>Drop a .xlsx or .csv file here, or click to browse</p>
                  <span className="admin-upload-hint">Columns: name, category, price, description, image, dietary, featured</span>
                  <button type="button" className="admin-btn-sm" style={{ marginTop: 8 }} onClick={(e) => { e.stopPropagation(); downloadExample(); }}>
                    <Download size={12} /> Download example sheet
                  </button>
                </>
              )}
            </div>
            {importPreview.length > 0 && (
              <div className="admin-import-preview">
                <div className="admin-import-preview-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Dietary</th>
                        <th>Featured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.name}</td>
                          <td><span className="admin-badge">{item.category}</span></td>
                          <td>{item.price}</td>
                          <td>{item.dietary?.join(", ")}</td>
                          <td>{item.featured ? "✓" : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="admin-import-actions">
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleImportConfirm}
                    disabled={importStatus === "loading"}
                  >
                    {importStatus === "loading" ? <><Loader2 size={13} className="animate-spin" /> Importing…</> : importStatus === "done" ? "✓ Imported" : `Import ${importPreview.length} Items`}
                  </button>
                  <button type="button" className="admin-btn-sm" onClick={() => { setImportFile(null); setImportPreview([]); }}>
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {bulkMode && (
          <div className="bulk-bar">
            <span>Set price for {filtered.length} visible items:</span>
            <input
              className="admin-input"
              type="text"
              placeholder="IQD 10,000"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
            />
            <button type="button" className="admin-btn-primary" onClick={handleBulkUpdate} disabled={!bulkPrice.trim() || updateMenuItem.isPending}>
              {updateMenuItem.isPending ? <><Loader2 size={13} className="animate-spin" /> Updating…</> : "Apply to All"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setBulkMode(false)}>Cancel</button>
          </div>
        )}

        <div className="admin-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`admin-chip ${filter === cat ? "admin-chip--active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "drinks & bar" ? <Wine size={13} style={{ marginRight: 4 }} /> : cat === "all" ? null : <UtensilsCrossed size={13} style={{ marginRight: 4 }} />}
              {cat}
            </button>
          ))}
        </div>

        {filter === "all" && barItems.length > 0 && (
          <>
            <div className="admin-section-divider">
              <Wine size={16} />
              <span>Bar & Drinks</span>
              <span className="admin-panel-badge">{barItems.length}</span>
            </div>
            <div className="admin-menu-grid">
              {barItems.map((item) => (
                <div
                  className="admin-menu-card admin-menu-card--bar"
                  key={item._id || item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEdit(item)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openEdit(item); }}
                >
                  <FoodImage src={item.image} alt={item.name} />
                  <div className="admin-menu-card-body">
                    <div className="admin-menu-card-top">
                      <h3>{item.name}</h3>
                    </div>
                    <span className="admin-badge">{item.category}</span>
                    <div className="admin-menu-card-footer">
                      <strong>{item.price}</strong>
                      <Toggle checked={Boolean(item.visible)} label="" onChange={() => handleToggleVisibility(item)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filter === "all" && foodItems.length > 0 && (
          <div className="admin-section-divider">
            <UtensilsCrossed size={16} />
            <span>Food Menu</span>
            <span className="admin-panel-badge">{foodItems.length}</span>
          </div>
        )}

        <div className="admin-menu-grid">
          {foodItems.map((item) => (
            <div
              className="admin-menu-card"
              key={item._id || item.id}
              role="button"
              tabIndex={0}
              onClick={() => openEdit(item)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openEdit(item); }}
            >
              <FoodImage src={item.image} alt={item.name} />
              <div className="admin-menu-card-body">
                <div className="admin-menu-card-top">
                  <h3>{item.name}</h3>
                </div>
                <span className="admin-badge">{item.category}</span>
                <div className="admin-menu-card-footer">
                  <strong>{item.price}</strong>
                  <Toggle checked={Boolean(item.visible)} label="" onChange={() => handleToggleVisibility(item)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      <AdminModal open={addMode} onClose={() => setAddMode(false)} title="Add Menu Item" size="md">
        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            <span>Name</span>
            <input className="admin-input" name="name" required />
          </label>
          <label>
            <span>Category</span>
            <select className="admin-input admin-select" name="category" defaultValue="Nepali">
              <option>Nepali</option>
              <option>Indian</option>
              <option>Chinese</option>
              <option>BBQ & Grill</option>
              <option>Drinks & Bar</option>
              <option>Desserts</option>
            </select>
          </label>
          <label>
            <span>Price</span>
            <input className="admin-input" name="price" placeholder="IQD 10,000" required />
          </label>
          <label>
            <span>Description</span>
            <textarea className="admin-input admin-textarea" name="description" rows={3} />
          </label>
          <label className="admin-toggle-row" style={{ flexDirection: "row", alignItems: "center", gap: 8, textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
            <input type="checkbox" name="featured" /> <span>Featured item</span>
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createMenuItem.isPending}>
              {createMenuItem.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Item"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setAddMode(false)}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Menu Item" size="md">
        {editItem && (
          <form className="admin-form" onSubmit={handleSave}>
            <label>
              <span>Name</span>
              <input className="admin-input" name="name" defaultValue={editItem.name} required />
            </label>
            <label>
              <span>Category</span>
              <select className="admin-input admin-select" name="category" defaultValue={editItem.category}>
                <option>Nepali</option>
                <option>Indian</option>
                <option>Chinese</option>
                <option>BBQ & Grill</option>
                <option>Drinks & Bar</option>
                <option>Desserts</option>
              </select>
            </label>
            <label>
              <span>Price</span>
              <input className="admin-input" name="price" defaultValue={editItem.price} required />
            </label>
            <label>
              <span>Description</span>
              <textarea className="admin-input admin-textarea" name="description" rows={3} defaultValue={editItem.description || ""} />
            </label>
            <div className="admin-toggle-row">
              <Toggle checked={editFeatured} onChange={setEditFeatured} label="Featured" />
              <Toggle checked={editVisible} onChange={setEditVisible} label="Visible" />
            </div>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={updateMenuItem.isPending}>
                {updateMenuItem.isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => { setEditItem(null); setDeleteItem(editItem); }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminModal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Menu Item" size="sm">
        {deleteItem && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon"><Trash2 size={20} /></div>
            <p>Delete <strong>{deleteItem.name}</strong> from the menu?</p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={deleteMenuItem.isPending} onClick={handleDeleteConfirm}>
                {deleteMenuItem.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={() => setDeleteItem(null)}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
