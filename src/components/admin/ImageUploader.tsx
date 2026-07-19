"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, Link, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import OptimizedImage from "@/components/shared/OptimizedImage";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ImageUploader({ value, onChange, folder = "restaurant" }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const applyLink = useCallback(() => {
    if (!linkUrl.trim()) return;
    onChange(linkUrl.trim());
    setLinkUrl("");
  }, [linkUrl, onChange]);

  return (
    <div className="image-uploader" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {value ? (
        <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--a-border)" }}>
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <OptimizedImage src={value} alt="Preview" sizes="400px" />
          </div>
          <button
            type="button"
            className="admin-btn-sm"
            onClick={() => onChange("")}
            style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none" }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "var(--a-gold)" : "var(--a-border)"}`,
            borderRadius: 8,
            padding: 28,
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? "var(--a-gold-dim)" : "var(--a-surface-2)",
            transition: "all 160ms",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin" style={{ color: "var(--a-gold)" }} />
              <p style={{ margin: "8px 0 0", fontSize: 14 }}>Uploading…</p>
            </>
          ) : (
            <>
              <UploadCloud size={28} style={{ color: "var(--a-gold)" }} />
              <p style={{ margin: "8px 0 0", fontSize: 14, fontWeight: 600 }}>Drop image here or click to browse</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--a-text-3)" }}>JPG, PNG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Link size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--a-text-3)" }} />
          <input
            className="admin-input"
            type="text"
            placeholder="Or paste image URL…"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={{ paddingLeft: 34, width: "100%" }}
          />
        </div>
        <button type="button" className="admin-btn-sm" onClick={applyLink} disabled={!linkUrl.trim()}>
          Use URL
        </button>
      </div>
    </div>
  );
}
