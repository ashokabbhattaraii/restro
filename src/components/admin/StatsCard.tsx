import type { LucideIcon } from "lucide-react";

export default function StatsCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="stats-card">
      <div className="stats-card-icon">
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div className="stats-card-body">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      {trend && <em className="stats-card-trend">{trend}</em>}
    </div>
  );
}
