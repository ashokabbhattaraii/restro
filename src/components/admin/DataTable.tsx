"use client";

export type DataTableRow = Record<string, string | number | boolean | undefined>;

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    confirmed: "badge-success",
    pending: "badge-warning",
    cancelled: "badge-danger",
  };
  return <span className={`admin-badge ${map[s] || ""}`}>{status}</span>;
}

export default function DataTable({
  columns,
  rows,
  actions = false,
  onView,
  onEdit,
}: {
  columns: string[];
  rows: DataTableRow[];
  actions?: boolean;
  onView?: (row: DataTableRow) => void;
  onEdit?: (row: DataTableRow) => void;
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={String(row.id ?? i)}>
              {columns.map((col) => {
                const val = row[col];
                if (col === "status" || col === "category") {
                  return <td key={col}><StatusBadge status={String(val)} /></td>;
                }
                return <td key={col}>{String(val ?? "")}</td>;
              })}
              {actions && (
                <td className="table-actions">
                  {onView && <button type="button" className="admin-btn-sm" onClick={() => onView(row)}>View</button>}
                  {onEdit && <button type="button" className="admin-btn-sm" onClick={() => onEdit(row)}>Edit</button>}
                  {!onView && !onEdit && <button type="button" className="admin-btn-sm">View</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
