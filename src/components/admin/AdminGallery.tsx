"use client";

import { Trash2, UploadCloud } from "lucide-react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { galleryImages } from "@/lib/constants";

export default function AdminGallery() {
  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Gallery</h2>
          <button type="button" className="admin-btn-primary">
            <UploadCloud size={14} /> Upload
          </button>
        </div>

        <div className="admin-upload-zone">
          <UploadCloud size={24} strokeWidth={1.5} />
          <p>Drop images here or click to browse</p>
          <span>JPG, PNG, WebP · Max 5MB</span>
        </div>

        <div className="admin-gallery-grid">
          {galleryImages.map((item) => (
            <div className="admin-gallery-item" key={item.id}>
              <OptimizedImage src={item.image} alt={item.title} />
              <div className="admin-gallery-item-overlay">
                <span className="admin-badge">{item.category}</span>
                <button type="button" className="admin-gallery-delete" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
