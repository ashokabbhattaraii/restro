import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";

export default function MenuItemForm() {
  return (
    <form className="admin-form">
      <label><span>Name</span><Input /></label>
      <label><span>Category</span><Select><option>Nepali</option><option>Indian</option><option>Chinese</option></Select></label>
      <label><span>Description</span><Textarea rows={3} /></label>
      <label><span>Price</span><Input /></label>
      <div className="admin-toggle-row"><Toggle checked label="Featured" /><Toggle checked label="Visible" /></div>
      <Button>Save Item</Button>
    </form>
  );
}
