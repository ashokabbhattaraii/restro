"use client";

import { useState, useMemo, useCallback } from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import AdminModal from "@/components/admin/AdminModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { useStaff, useCreateStaff, useUpdateStaff } from "@/hooks/useApi";
import { Search, Pencil, Trash2, Loader2, Eye, EyeOff, Users, Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { StaffMember } from "@/types";

export default function AdminStaff() {
  const [addMode, setAddMode] = useState(false);
  const { data: staff = [] } = useStaff(false);
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);
  const [editVisible, setEditVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const departments = useMemo(() => {
    const depts = new Set(staff.map((m) => m.department).filter(Boolean));
    return ["all", ...Array.from(depts)];
  }, [staff]);

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => {
      setSearch(val);
      setCurrentPage(1);
    }, []),
    250
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staff.filter((m) => {
      const matchSearch = !search ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.bio || "").toLowerCase().includes(q);
      const matchDept = deptFilter === "all" || m.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [staff, search, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedStaff = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const selectMember = useCallback((member: StaffMember) => {
    setSelectedMember(member);
    setSearch("");
    setDeptFilter("all");
  }, []);

  const openEdit = useCallback((member: StaffMember) => {
    setEditMember(member);
    setEditVisible(member.visible);
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editMember) return;
    const form = e.currentTarget;
    try {
      await updateStaff.mutateAsync({
        id: (editMember._id || editMember.id)!,
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        role: (form.elements.namedItem("role") as HTMLInputElement).value,
        department: (form.elements.namedItem("department") as HTMLInputElement).value,
        bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
        visible: editVisible,
      });
      toast.success("Staff member updated");
      setEditMember(null);
    } catch {
      toast.error("Failed to update staff member");
    }
  }, [editMember, editVisible, updateStaff]);

  const handleCreateStaff = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createStaff.mutateAsync({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        role: (form.elements.namedItem("role") as HTMLInputElement).value,
        department: (form.elements.namedItem("department") as HTMLInputElement).value,
        bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
        visible: true,
      });
      toast.success("Staff member created");
      setAddMode(false);
    } catch {
      toast.error("Failed to create staff member");
    }
  }, [createStaff]);

  const handleToggleVisibility = useCallback(async (member: StaffMember, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const deptColor = (dept: string) => {
    const map: Record<string, string> = {
      kitchen: "#d97706",
      service: "#059669",
      management: "#7c3aed",
      bar: "#0891b2",
    };
    return map[dept.toLowerCase()] || "#8a6510";
  };

  return (
    <div className="admin-page-content">
      <div className="admin-staff-layout">
        {/* ── Staff List ── */}
        <div className="admin-staff-list">
          <div className="admin-panel-header">
            <h2>Staff</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="admin-panel-badge">{staff.length} members</span>
              <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setAddMode(true)}>
                <Plus size={13} /> Add Staff
              </button>
            </div>
          </div>

          <div className="admin-staff-filters">
            <div className="admin-search-wrap">
              <Search size={14} className="admin-search-icon" />
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
              {departments.map((d) => (
                <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>
              ))}
            </select>
          </div>

          <div className="admin-staff-items">
            {paginatedStaff.map((member) => {
              const isSelected = selectedMember?._id === member._id || selectedMember?.id === member.id;
              return (
                <button
                  key={member._id || member.id}
                  type="button"
                  className={`admin-staff-item ${isSelected ? "admin-staff-item--active" : ""}`}
                  onClick={() => selectMember(member)}
                >
                  <div className="admin-staff-item-photo">
                    <OptimizedImage src={member.image} alt={member.name} />
                    <span
                      className={`admin-staff-item-dot ${member.visible ? "admin-staff-item-dot--online" : ""}`}
                      title={member.visible ? "Visible" : "Hidden"}
                    />
                  </div>
                  <div className="admin-staff-item-info">
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                    <span className="admin-staff-item-dept">
                      <span className="admin-badge" style={{ backgroundColor: deptColor(member.department) + "20", color: deptColor(member.department), border: `1px solid ${deptColor(member.department)}30` }}>
                        {member.department}
                      </span>
                    </span>
                  </div>
                  <div className="admin-staff-item-bio">
                    {member.bio?.slice(0, 60)}{member.bio?.length > 60 ? "…" : ""}
                  </div>
                </button>
              );
            })}
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            totalRows={filtered.length}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
          />
        </div>

        {/* ── Detail Panel ── */}
        <div className="admin-staff-detail">
          {selectedMember ? (
            <>
              {/* Hero section */}
              <div className="admin-staff-detail-hero">
                <div className="admin-staff-detail-photo">
                  <OptimizedImage src={selectedMember.image} alt={selectedMember.name} />
                </div>
                <div className="admin-staff-detail-heading">
                  <h3>{selectedMember.name}</h3>
                  <span className="admin-staff-detail-role">{selectedMember.role}</span>
                  <div className="admin-staff-detail-meta">
                    <span className="admin-badge" style={{ backgroundColor: deptColor(selectedMember.department) + "20", color: deptColor(selectedMember.department), border: `1px solid ${deptColor(selectedMember.department)}30` }}>
                      <Users size={11} /> {selectedMember.department || "General"}
                    </span>
                    <span className={`admin-staff-vis-badge ${selectedMember.visible ? "admin-staff-vis-badge--on" : ""}`}>
                      {selectedMember.visible ? <><Eye size={11} /> Visible</> : <><EyeOff size={11} /> Hidden</>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio section */}
              <div className="admin-staff-detail-section">
                <h4>Biography</h4>
                <p>{selectedMember.bio || "No biography provided."}</p>
              </div>

              {/* Stats row */}
              <div className="admin-staff-detail-stats">
                <div className="admin-staff-detail-stat">
                  <span>Department</span>
                  <strong>{selectedMember.department || "—"}</strong>
                </div>
                <div className="admin-staff-detail-stat">
                  <span>Role</span>
                  <strong>{selectedMember.role}</strong>
                </div>
                <div className="admin-staff-detail-stat">
                  <span>Public Profile</span>
                  <strong>{selectedMember.visible ? "Active" : "Inactive"}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="admin-staff-detail-actions">
                <button type="button" className="admin-btn-primary" onClick={() => openEdit(selectedMember)}>
                  <Pencil size={13} /> Edit Profile
                </button>
                <button
                  type="button"
                  className="admin-btn-sm"
                  onClick={(e) => handleToggleVisibility(selectedMember, e)}
                  disabled={updateStaff.isPending}
                >
                  {selectedMember.visible ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
                </button>
              </div>
            </>
          ) : (
            <div className="admin-staff-detail-empty">
              <Users size={40} strokeWidth={1.2} />
              <p>Select a staff member to view details</p>
              <span>{staff.length} members · {staff.filter((m) => m.visible).length} visible</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      <AdminModal open={addMode} onClose={() => setAddMode(false)} title="Add Staff Member" size="md">
        <form className="admin-form" onSubmit={handleCreateStaff}>
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
            <span>Image URL</span>
            <input className="admin-input" name="image" />
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createStaff.isPending}>
              {createStaff.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Staff"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setAddMode(false)}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal open={!!editMember} onClose={() => setEditMember(null)} title="Edit Staff Member" size="md">
        {editMember && (
          <form className="admin-form" onSubmit={handleSave}>
            <div className="admin-staff-edit-photo-row">
              <div className="admin-staff-edit-photo">
                <OptimizedImage src={editMember.image} alt={editMember.name} />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "var(--a-text)", margin: 0 }}>{editMember.name}</p>
                <p style={{ fontSize: 13, color: "var(--a-text-3)", margin: "2px 0 0" }}>{editMember.role}</p>
              </div>
            </div>
            <label>
              <span>Name</span>
              <input className="admin-input" name="name" defaultValue={editMember.name} required />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Role</span>
                <input className="admin-input" name="role" defaultValue={editMember.role} required />
              </label>
              <label>
                <span>Department</span>
                <input className="admin-input" name="department" defaultValue={editMember.department} />
              </label>
            </div>
            <label>
              <span>Biography</span>
              <textarea className="admin-input admin-textarea" name="bio" rows={4} defaultValue={editMember.bio} />
            </label>
            <label>
              <span>Image URL</span>
              <input className="admin-input" name="image" defaultValue={editMember.image} />
            </label>
            <div className="admin-toggle-row">
              <div className="toggle" onClick={() => setEditVisible((v) => !v)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setEditVisible((v) => !v); }}>
                <span className={editVisible ? "toggle-on" : ""}><span /></span>
                <span>Visible on public page</span>
              </div>
            </div>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={updateStaff.isPending}>
                {updateStaff.isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={() => setEditMember(null)}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
