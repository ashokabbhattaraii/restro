"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

const statusStyles: Record<string, string> = {
  confirmed: "badge-success",
  pending: "badge-warning",
  cancelled: "badge-danger",
  contacted: "badge-info",
};

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  return <span className={`admin-badge ${statusStyles[s] || ""}`}>{status}</span>;
}

function defaultRender<T>(value: T[keyof T], _row: T): React.ReactNode {
  if (value === null || value === undefined) return "—";
  return String(value);
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
}: {
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}) {
  const hasActions = !!(onView || onEdit || onDelete);

  if (data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No entries found.</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            {hasActions && <th className="table-actions-th">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id || row.id || String((row as Record<string, unknown>)[String(columns[0]?.key)])}>
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td key={String(col.key)}>
                    {col.key === "status" || col.key === "category" ? (
                      <StatusBadge status={String(value ?? "")} />
                    ) : col.render ? (
                      col.render(value, row)
                    ) : (
                      defaultRender(value, row)
                    )}
                  </td>
                );
              })}
              {hasActions && (
                <td className="table-actions">
                  {onView && (
                    <button type="button" className="admin-btn-sm" onClick={() => onView(row)} aria-label="View">
                      <Eye size={13} /> View
                    </button>
                  )}
                  {onEdit && (
                    <button type="button" className="admin-btn-sm" onClick={() => onEdit(row)} aria-label="Edit">
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => onDelete(row)} aria-label="Delete">
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
