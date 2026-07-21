"use client";

import { useState, useMemo, useCallback } from "react";
import AdminModal from "@/components/admin/AdminModal";
import Toggle from "@/components/ui/Toggle";
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer } from "@/hooks/useApi";
import { Gift, Pencil, Trash2, Loader2, Plus, ArrowUpDown, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import type { OfferItem } from "@/types";

export default function AdminOffers() {
  const [addMode, setAddMode] = useState(false);
  const [editOffer, setEditOffer] = useState<OfferItem | null>(null);
  const [deleteOfferItem, setDeleteOfferItem] = useState<OfferItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: offers = [] } = useOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();

  const sorted = useMemo(() => {
    return [...offers].sort((a, b) =>
      sortOrder === "asc" ? a.sortOrder - b.sortOrder : b.sortOrder - a.sortOrder
    );
  }, [offers, sortOrder]);

  const fieldVal = useCallback((form: HTMLFormElement, name: string) => {
    return (form.elements.namedItem(name) as HTMLInputElement)?.value || "";
  }, []);

  const handleCreate = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createOffer.mutateAsync({
        title: fieldVal(form, "title"),
        description: fieldVal(form, "description"),
        pct: fieldVal(form, "pct"),
        unit: fieldVal(form, "unit"),
        validity: fieldVal(form, "validity"),
        cta: fieldVal(form, "cta"),
        active: true,
        sortOrder: offers.length,
      });
      toast.success("Offer created");
      setAddMode(false);
      form.reset();
    } catch {
      toast.error("Failed to create offer");
    }
  }, [createOffer, offers.length, fieldVal]);

  const handleSave = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editOffer) return;
    const form = e.currentTarget;
    try {
      await updateOffer.mutateAsync({
        id: editOffer.id,
        title: fieldVal(form, "title"),
        description: fieldVal(form, "description"),
        pct: fieldVal(form, "pct"),
        unit: fieldVal(form, "unit"),
        validity: fieldVal(form, "validity"),
        cta: fieldVal(form, "cta"),
      });
      toast.success("Offer updated");
      setEditOffer(null);
    } catch {
      toast.error("Failed to update offer");
    }
  }, [editOffer, updateOffer, fieldVal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteOfferItem) return;
    try {
      await deleteOffer.mutateAsync(deleteOfferItem.id);
      toast.success("Offer deleted");
      setDeleteOfferItem(null);
    } catch {
      toast.error("Failed to delete offer");
    }
  }, [deleteOfferItem, deleteOffer]);

  const toggleActive = useCallback(async (offer: OfferItem) => {
    try {
      await updateOffer.mutateAsync({ id: offer.id, active: !offer.active });
      toast.success(offer.active ? "Offer deactivated" : "Offer activated");
    } catch {
      toast.error("Failed to update offer");
    }
  }, [updateOffer]);

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2><Gift size={17} /> Offers & Deals</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="admin-panel-badge">{offers.length} offers</span>
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setAddMode(true)}>
              <Plus size={13} /> Add Offer
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button type="button" className="admin-btn-sm" onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}>
            <ArrowUpDown size={12} /> Sort {sortOrder === "asc" ? "↓" : "↑"}
          </button>
        </div>

        <div className="admin-event-grid">
          {sorted.length === 0 ? (
            <p className="admin-empty">No offers yet. Create your first offer.</p>
          ) : (
            sorted.map((offer) => (
              <div className="admin-event-card" key={offer.id}>
                <div style={{ padding: "16px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
                    {offer.pct}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--a-text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {offer.unit}
                  </span>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    <Toggle
                      checked={offer.active}
                      onChange={() => toggleActive(offer)}
                      label=""
                    />
                  </div>
                </div>
                <div className="admin-event-card-body">
                  <h3>{offer.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--body)" }}>{offer.description}</p>
                  {offer.validity && (
                    <p style={{ fontSize: 12, color: "var(--a-text-3)" }}>🗓 {offer.validity}</p>
                  )}
                  <div className="admin-event-card-actions">
                    <button type="button" className="admin-btn-sm" onClick={() => setEditOffer(offer)} disabled={updateOffer.isPending}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => setDeleteOfferItem(offer)} disabled={deleteOffer.isPending}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AdminModal open={addMode} onClose={() => setAddMode(false)} title="Add Offer" size="md">
        <form className="admin-form" onSubmit={handleCreate}>
          <div className="admin-form-row">
            <label><span>Badge % (e.g. 20%)</span><input className="admin-input" name="pct" required placeholder="20%" /></label>
            <label><span>Badge Unit (e.g. OFF)</span><input className="admin-input" name="unit" placeholder="OFF" /></label>
          </div>
          <label><span>Title</span><input className="admin-input" name="title" required /></label>
          <label><span>Description</span><textarea className="admin-input admin-textarea" name="description" rows={2} required /></label>
          <label><span>Validity (e.g. Valid Daily · 5:00 PM – 8:00 PM)</span><input className="admin-input" name="validity" /></label>
          <label><span>CTA Text (e.g. Reserve a Spot)</span><input className="admin-input" name="cta" defaultValue="Book Now" /></label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createOffer.isPending}>
              {createOffer.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Offer"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setAddMode(false)}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={!!editOffer} onClose={() => setEditOffer(null)} title="Edit Offer" size="md">
        {editOffer && (
          <form className="admin-form" onSubmit={handleSave}>
            <div className="admin-form-row">
              <label><span>Badge %</span><input className="admin-input" name="pct" defaultValue={editOffer.pct} required /></label>
              <label><span>Badge Unit</span><input className="admin-input" name="unit" defaultValue={editOffer.unit} /></label>
            </div>
            <label><span>Title</span><input className="admin-input" name="title" defaultValue={editOffer.title} required /></label>
            <label><span>Description</span><textarea className="admin-input admin-textarea" name="description" rows={2} defaultValue={editOffer.description} required /></label>
            <label><span>Validity</span><input className="admin-input" name="validity" defaultValue={editOffer.validity} /></label>
            <label><span>CTA Text</span><input className="admin-input" name="cta" defaultValue={editOffer.cta} /></label>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={updateOffer.isPending}>
                {updateOffer.isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={() => setEditOffer(null)}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>

      <AdminModal open={!!deleteOfferItem} onClose={() => setDeleteOfferItem(null)} title="Delete Offer" size="sm">
        {deleteOfferItem && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon"><Trash2 size={20} /></div>
            <p>Delete offer <strong>{deleteOfferItem.title}</strong>?</p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={deleteOffer.isPending} onClick={handleDeleteConfirm}>
                {deleteOffer.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={() => setDeleteOfferItem(null)}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
