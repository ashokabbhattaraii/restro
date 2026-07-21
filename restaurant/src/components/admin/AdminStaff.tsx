"use client";

import { useState, useMemo, useCallback } from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import ImageUploader from "@/components/admin/ImageUploader";
import Toggle from "@/components/ui/Toggle";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@/hooks/useApi";
import { Search, Pencil, Trash2, Loader2, Eye, EyeOff, Users, Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { StaffMember } from "@/types";

const DEPARTMENT_COLORS: Record<string, string> = {
  kitchen: "#d97706",
  service: "#059669",
  management: "#7c3aed",
  bar: "#0891b2",
};

function getDeptColor(dept: string) {
  return DEPARTMENT_COLORS[dept.toLowerCase()] || "#8a6510";
}

const VISIBILITY_OPTIONS = [
  { value: "all", label: "All Visibility" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
] as const;

export default function AdminStaff() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [visibleFilter, setVisibleFilter] = useState<"all" | "visible" | "hidden">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<StaffMember | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "add" | null>(null);
  const [editVisible, setEditVisible] = useState(true);
  const [addImage, setAddImage] = useState("");
  const [editImage, setEditImage] = useState("");

  const { data: staff = [] } = useStaff(false);
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const isPending = updateStaff.isPending || createStaff.isPending || deleteStaff.isPending;

  const departments = useMemo(() => {
    const depts = new Set(staff.map((m) => m.department).filter(Boolean));
    return ["all", ...Array.from(depts)];
  }, [staff]);

  const debouncedSearch = useDebouncedCallback(
    useCallback((value: string) => {
      setSearch(value);
      setCurrentPage(1);
    }, []),
    300
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staff.filter((m) => {
      const matchSearch = !search ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.bio || "").toLowerCase().includes(q);
      const matchDept = deptFilter === "all" || m.department === deptFilter;
      const matchVis = visibleFilter === "all" ||
        (visibleFilter === "visible" && m.visible) ||
        (visibleFilter === "hidden" && !m.visible);
      return matchSearch && matchDept && matchVis;
    });
  }, [staff, search, deptFilter, visibleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedRows = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const visibleCount = useMemo(() => staff.filter((m) => m.visible).length, [staff]);
  const hiddenCount = staff.length - visibleCount;

  const openModal = useCallback((row: StaffMember | null, mode: typeof modalMode) => {
    setSelectedRow(row);
    setModalMode(mode);
    if (row) setEditVisible(row.visible);
    if (mode === "add") setAddImage("");
    if (mode === "edit" && row) setEditImage(row.image || "");
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRow(null);
    setModalMode(null);
    setEditVisible(true);
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRow) return;
    const form = e.currentTarget;
    try {
      await updateStaff.mutateAsync({
        id: (selectedRow._id || selectedRow.id)!,
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        role: (form.elements.namedItem("role") as HTMLInputElement).value,
        department: (form.elements.namedItem("department") as HTMLInputElement).value,
        bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
        image: editImage,
        visible: editVisible,
      });
      toast.success("Staff member updated");
      closeModal();
    } catch {
      toast.error("Failed to update staff member");
    }
  }, [selectedRow, editVisible, editImage, updateStaff, closeModal]);

  const handleCreate = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createStaff.mutateAsync({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        role: (form.elements.namedItem("role") as HTMLInputElement).value,
        department: (form.elements.namedItem("department") as HTMLInputElement).value,
        bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
        image: addImage,
        visible: true,
      });
      toast.success("Staff member created");
      closeModal();
    } catch {
      toast.error("Failed to create staff member");
    }
  }, [createStaff, closeModal, addImage]);

  const handleToggleVisibility = useCallback(async (member: StaffMember) => {
    try {
      await updateStaff.mutateAsync({
        id: (member._id || member.id)!,
        visible: !member.visible,
      });
      toast.success(member.visible ? "Staff hidden from public" : "Staff now visible to public");
    } catch {
      toast.error("Failed to update visibility");
    }
  }, [updateStaff]);

  const handleDelete = useCallback(async () => {
    if (!selectedRow) return;
    try {
      await deleteStaff.mutateAsync((selectedRow._id || selectedRow.id)!);
      toast.success("Staff member deleted");
      closeModal();
    } catch {
      toast.error("Failed to delete staff member");
    }
  }, [selectedRow, deleteStaff, closeModal]);

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Staff</h2>
          <div className="admin-panel-header-actions">
            <span className="admin-panel-badge">{staff.length} members</span>
            {visibleCount > 0 && (
              <span className="admin-panel-badge" style={{ background: "#059669", color: "#fff" }}>
                {visibleCount} visible
              </span>
            )}
            {hiddenCount > 0 && (
              <span className="admin-panel-badge" style={{ background: "#e74c3c", color: "#fff" }}>
                {hiddenCount} hidden
              </span>
            )}
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => openModal(null, "add")}>
              <Plus size={13} /> Add Staff
            </button>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-input admin-search-input"
              type="text"
              placeholder="Search name, role, bio…"
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-input admin-select"
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Departments</option>
            {departments.filter((d) => d !== "all").map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            className="admin-input admin-select"
            value={visibleFilter}
            onChange={(e) => { setVisibleFilter(e.target.value as typeof visibleFilter); setCurrentPage(1); }}
          >
            {VISIBILITY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <DataTable<StaffMember>
          columns={[
            {
              key: "name",
              label: "Staff Member",
              render: (_value, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative", width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <OptimizedImage src={row.image} alt={row.name} />
                  </div>
                  <span>{row.name}</span>
                </div>
              ),
            },
            { key: "role", label: "Role" },
            {
              key: "department",
              label: "Department",
              render: (value) => {
                const dept = String(value || "");
                const color = getDeptColor(dept);
                return (
                  <span className="admin-staff-dept-badge" style={{ background: `${color}20`, color: color, border: `1px solid ${color}30` }}>
                    <Users size={11} /> {dept || "General"}
                  </span>
                );
              },
            },
            {
              key: "visible",
              label: "Visibility",
              render: (value) => (
                <span className={`admin-badge ${value ? "badge-success" : "badge-danger"}`}>
                  {value ? "Visible" : "Hidden"}
                </span>
              ),
            },
          ]}
          data={paginatedRows}
          onView={(row) => openModal(row, "view")}
          onEdit={(row) => openModal(row, "edit")}
          onDelete={(row) => openModal(row, "delete")}
        />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={filtered.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      {/* View Modal */}
      <AdminModal open={modalMode === "view" && !!selectedRow} onClose={closeModal} title="Staff Details" size="md">
        {selectedRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item admin-detail-item--full" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 80, height: 80, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                <OptimizedImage src={selectedRow.image} alt={selectedRow.name} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>{selectedRow.name}</p>
                <p style={{ margin: 0, color: "var(--a-text-3)" }}>{selectedRow.role}</p>
              </div>
            </div>
            <div className="admin-detail-item">
              <label>Department</label>
              <p>
                <span
                  className="admin-staff-dept-badge"
                  style={{
                    background: `${getDeptColor(selectedRow.department)}20`,
                    color: getDeptColor(selectedRow.department),
                    border: `1px solid ${getDeptColor(selectedRow.department)}30`,
                  }}
                >
                  <Users size={11} /> {selectedRow.department || "General"}
                </span>
              </p>
            </div>
            <div className="admin-detail-item">
              <label>Public Profile</label>
              <p>
                <span className={`admin-badge ${selectedRow.visible ? "badge-success" : "badge-danger"}`}>
                  {selectedRow.visible ? "Visible" : "Hidden"}
                </span>
              </p>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <label>Biography</label>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{selectedRow.bio || "No biography provided."}</p>
            </div>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-primary" onClick={() => setModalMode("edit")}>
                <Pencil size={13} /> Edit Profile
              </button>
              <button
                type="button"
                className="admin-btn-sm"
                onClick={() => handleToggleVisibility(selectedRow)}
                disabled={updateStaff.isPending}
              >
                {selectedRow.visible ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
              </button>
              <button
                type="button"
                className="admin-btn-sm admin-btn-sm--danger"
                onClick={() => setModalMode("delete")}
                disabled={isPending}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Add Modal */}
      <AdminModal open={modalMode === "add"} onClose={closeModal} title="Add Staff Member" size="md">
        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            <span>Name</span>
            <input className="admin-input" name="name" required />
          </label>
          <div className="admin-form-row">
            <label>
              <span>Role</span>
              <input className="admin-input" name="role" required />
            </label>
            <label>
              <span>Department</span>
              <input className="admin-input" name="department" />
            </label>
          </div>
          <label>
            <span>Biography</span>
            <textarea className="admin-input admin-textarea" name="bio" rows={3} />
          </label>
          <label>
            <span>Photo</span>
            <ImageUploader value={addImage} onChange={setAddImage} folder="staff" />
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createStaff.isPending}>
              {createStaff.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Staff"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal open={modalMode === "edit" && !!selectedRow} onClose={closeModal} title="Edit Staff Member" size="md">
        {selectedRow && (
          <form className="admin-form" onSubmit={handleSave}>
            <div className="admin-staff-edit-photo-row">
              <div className="admin-staff-edit-photo">
                <OptimizedImage src={selectedRow.image} alt={selectedRow.name} />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--a-text)", margin: 0 }}>{selectedRow.name}</p>
                <p style={{ fontSize: 13, color: "var(--a-text-3)", margin: "2px 0 0" }}>{selectedRow.role}</p>
              </div>
            </div>
            <label>
              <span>Name</span>
              <input className="admin-input" name="name" defaultValue={selectedRow.name} required />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Role</span>
                <input className="admin-input" name="role" defaultValue={selectedRow.role} required />
              </label>
              <label>
                <span>Department</span>
                <input className="admin-input" name="department" defaultValue={selectedRow.department} />
              </label>
            </div>
            <label>
              <span>Biography</span>
              <textarea className="admin-input admin-textarea" name="bio" rows={4} defaultValue={selectedRow.bio} />
            </label>
<label>
              <span>Photo</span>
              <ImageUploader value={editImage} onChange={setEditImage} folder="staff" />
            </label>
            <div className="admin-toggle-row">
              <Toggle checked={editVisible} onChange={setEditVisible} label="Visible on public page" />
            </div>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={updateStaff.isPending}>
                {updateStaff.isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal open={modalMode === "delete" && !!selectedRow} onClose={closeModal} title="Delete Staff Member" size="sm">
        {selectedRow && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon"><Trash2 size={20} /></div>
            <p>Delete <strong>{selectedRow.name}</strong>?</p>
            <p className="admin-delete-confirm-hint">Role: {selectedRow.role}</p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={deleteStaff.isPending} onClick={handleDelete}>
                {deleteStaff.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
