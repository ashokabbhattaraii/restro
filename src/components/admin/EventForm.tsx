import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";

export default function EventForm() {
  return (
    <form className="admin-form">
      <label><span>Title</span><Input /></label>
      <label><span>Description</span><Textarea rows={3} /></label>
      <label><span>Date</span><Input type="date" /></label>
      <label><span>Time</span><Input type="time" /></label>
      <label><span>Type</span><Select><option>Live Music</option><option>Happy Hour</option><option>Festival</option><option>Special</option></Select></label>
      <Toggle checked label="Active" />
      <Button>Save Event</Button>
    </form>
  );
}
