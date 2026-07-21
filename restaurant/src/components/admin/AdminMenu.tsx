"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { Upload, FileSpreadsheet, X, Wine, UtensilsCrossed, Download, Trash2, Loader2, Plus, Settings2 } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import FoodImage from "@/components/shared/FoodImage";
import AdminModal from "@/components/admin/AdminModal";
import MenuItemForm from "@/components/admin/MenuItemForm";
import Toggle from "@/components/ui/Toggle";
import { useConfig } from "@/hooks/useConfig";
import { useUpdateConfig } from "@/hooks/useUpdateConfig";
import {
  useMenuItemsAdmin,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useBulkCreateMenuItems,
} from "@/hooks/useApi";
import type { MenuItem } from "@/types";

function CategoryManager({
  categories,
  onSave,
  isPending,
  onClose,
}: {
  categories: string[];
  onSave: (cats: string[]) => void;
  isPending: boolean;
  onClose: () => void;
}) {
  const [newCat, setNewCat] = useState("");
  const [localCats, setLocalCats] = useState(categories.filter((c) => c.toLowerCase() !== "all"));

  const add = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (localCats.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Category already exists");
      return;
    }
    setLocalCats((prev) => [...prev, trimmed]);
    setNewCat("");
  };

  const remove = (idx: number) => {
    setLocalCats((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          className="admin-input"
          type="text"
          placeholder="New category name…"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          style={{ flex: 1 }}
        />
        <button type="button" className="admin-btn-primary" onClick={add}>
          <Plus size={13} /> Add
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {localCats.length === 0 && <p className="admin-empty" style={{ padding: 16 }}>No categories yet.</p>}
        {localCats.map((cat, idx) => (
          <div
            key={cat}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "var(--a-gold-dim)",
              borderRadius: 6,
            }}
          >
            <span style={{ fontWeight: 500 }}>{cat}</span>
            <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => remove(idx)}>
              <X size={12} /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="admin-detail-actions">
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => onSave(["All", ...localCats])}
          disabled={isPending}
        >
          {isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Categories"}
        </button>
        <button type="button" className="admin-btn-sm" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default function AdminMenu() {
  const { config } = useConfig();
  const updateConfig = useUpdateConfig();
  const categories = useMemo(() => config.menuCategories, [config.menuCategories]);

  const [filter, setFilter] = useState("All");
  const [addMode, setAddMode] = useState(false);
  const [catMode, setCatMode] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");
  const [importMode, setImportMode] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Partial<MenuItem>[]>([]);
  const [importStatus, setImportStatus] = useState<"" | "loading" | "done" | "error">("");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const { data: menuItems = [] } = useMenuItemsAdmin();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const bulkCreate = useBulkCreateMenuItems();

  const filtered = useMemo(() => {
    return filter === "All" ? menuItems : menuItems.filter((i) => i.category === filter);
  }, [filter, menuItems]);

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setImageUrl(item.image || "");
  };

  const closeEdit = () => {
    setEditItem(null);
    setImageUrl("");
  };

  const openAdd = () => {
    setAddMode(true);
    setImageUrl("");
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

  const handleSaveCategories = useCallback(async (cats: string[]) => {
    try {
      await updateConfig.mutateAsync({ menuCategories: cats });
      toast.success("Categories updated");
      setCatMode(false);
    } catch {
      toast.error("Failed to update categories");
    }
  }, [updateConfig]);

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

  const barItems = filter === "All" ? menuItems.filter((i) => i.category.toLowerCase() === "drinks & bar") : [];
  const foodItems = filter === "All" ? menuItems.filter((i) => i.category.toLowerCase() !== "drinks & bar") : filtered;

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Menu Items</h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="admin-panel-badge">{menuItems.length} items</span>
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={openAdd}>
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
            <button type="button" className="admin-btn-sm" onClick={() => setCatMode(true)}>
              <Settings2 size={13} /> Categories
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
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`admin-chip ${filter === cat ? "admin-chip--active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat.toLowerCase() === "drinks & bar" ? <Wine size={13} style={{ marginRight: 4 }} /> : cat === "All" ? null : <UtensilsCrossed size={13} style={{ marginRight: 4 }} />}
              {cat}
            </button>
          ))}
        </div>

        {filter === "All" && barItems.length > 0 && (
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

        {filter === "All" && foodItems.length > 0 && (
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
      <AdminModal open={addMode} onClose={() => { setAddMode(false); setImageUrl(""); }} title="Add Menu Item" size="md">
        <MenuItemForm
          image={imageUrl}
          onImageChange={setImageUrl}
          isPending={createMenuItem.isPending}
          submitLabel="Create Item"
          onCancel={() => { setAddMode(false); setImageUrl(""); }}
          onSubmit={async (values) => {
            try {
              await createMenuItem.mutateAsync({
                name: values.name,
                category: values.category as MenuItem["category"],
                price: values.price,
                description: values.description,
                image: imageUrl,
                featured: Boolean(values.featured),
                visible: values.visible === undefined ? true : Boolean(values.visible),
              });
              toast.success("Menu item created");
              setAddMode(false);
              setImageUrl("");
            } catch {
              toast.error("Failed to create menu item");
            }
          }}
        />
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal open={!!editItem} onClose={closeEdit} title="Edit Menu Item" size="md">
        {editItem && (
          <MenuItemForm
            defaultValues={{
              name: editItem.name,
              category: editItem.category,
              price: editItem.price,
              description: editItem.description || "",
              featured: Boolean(editItem.featured),
              visible: Boolean(editItem.visible),
            }}
            image={imageUrl}
            onImageChange={setImageUrl}
            isPending={updateMenuItem.isPending}
            submitLabel="Save Changes"
            onCancel={closeEdit}
            onSubmit={async (values) => {
              try {
                await updateMenuItem.mutateAsync({
                  id: (editItem._id || editItem.id)!,
                  name: values.name,
                  category: values.category as MenuItem["category"],
                  price: values.price,
                  description: values.description,
                  image: imageUrl,
                  featured: Boolean(values.featured),
                  visible: values.visible === undefined ? true : Boolean(values.visible),
                });
                toast.success("Menu item updated");
                closeEdit();
              } catch {
                toast.error("Failed to update menu item");
              }
            }}
          />
        )}
        {editItem && (
          <div className="admin-detail-actions" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="admin-btn-sm admin-btn-sm--danger"
              onClick={() => { setDeleteItem(editItem); }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
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

      {/* Manage Categories Modal */}
      <AdminModal open={catMode} onClose={() => setCatMode(false)} title="Manage Menu Categories" size="md">
        <CategoryManager
          categories={categories}
          onSave={handleSaveCategories}
          isPending={updateConfig.isPending}
          onClose={() => setCatMode(false)}
        />
      </AdminModal>
    </div>
  );
}
