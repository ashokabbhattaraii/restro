import OptimizedImage from "@/components/shared/OptimizedImage";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import type { StaffMember } from "@/types";

export default function StaffCard({ member }: { member: StaffMember }) {
  return (
    <Card className="admin-staff-card">
      <div className="team-photo">
        <OptimizedImage src={member.image} alt={member.name} />
      </div>
      <h3>{member.name}</h3>
      <span>{member.role}</span>
      <Toggle checked={member.visible} label="Public" />
    </Card>
  );
}
