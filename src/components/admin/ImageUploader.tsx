import { UploadCloud } from "lucide-react";

export default function ImageUploader() {
  return (
    <div className="upload-zone">
      <UploadCloud size={28} />
      <strong>Drop images here</strong>
      <span>JPG, PNG, or WebP up to 5MB</span>
    </div>
  );
}
