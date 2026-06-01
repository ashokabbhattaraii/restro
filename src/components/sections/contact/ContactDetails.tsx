import { Camera, MapPin, MessageCircle, Phone, ThumbsUp } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { restaurant } from "@/lib/constants";

const rows = [
  { label: "Address", value: restaurant.location, icon: MapPin },
  { label: "Phone 1", value: restaurant.phoneOne, icon: Phone },
  { label: "Phone 2", value: restaurant.phoneTwo, icon: Phone },
  { label: "WhatsApp", value: restaurant.phoneOne, icon: MessageCircle },
  { label: "Instagram", value: "@nepali.restaurant.bar", icon: Camera },
  { label: "Facebook", value: "Nepali Restaurant & Bar", icon: ThumbsUp },
];

export default function ContactDetails() {
  return (
    <Card className="contact-card">
      <h2>Contact Details</h2>
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <div className="contact-row" key={row.label}>
            <span className="contact-icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <div>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          </div>
        );
      })}
      <Button href={`https://wa.me/964${restaurant.phoneOne.slice(1)}`}>WhatsApp</Button>
    </Card>
  );
}
