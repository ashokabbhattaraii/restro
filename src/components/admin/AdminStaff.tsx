"use client";

import OptimizedImage from "@/components/shared/OptimizedImage";
import Toggle from "@/components/ui/Toggle";
import { staff } from "@/lib/constants";

export default function AdminStaff() {
  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Staff</h2>
          <button type="button" className="admin-btn-primary">+ Add Member</button>
        </div>
        <div className="admin-staff-grid">
          {staff.map((member) => (
            <div className="admin-staff-card" key={member.id}>
              <div className="admin-staff-photo">
                <OptimizedImage src={member.image} alt={member.name} />
              </div>
              <div className="admin-staff-info">
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </div>
              <div className="admin-staff-actions">
                <Toggle checked={member.visible} label="Public" />
                <button type="button" className="admin-btn-sm">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
