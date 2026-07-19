import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadImageLocal(file: File): Promise<{ url: string; publicId: string }> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const hash = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${hash}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await writeFile(filepath, buffer);

  return {
    url: `/uploads/${filename}`,
    publicId: filename,
  };
}

export function isLocalUploadUrl(url: string): boolean {
  return url.startsWith("/uploads/");
}

export async function deleteImageLocal(publicId: string): Promise<void> {
  const filepath = path.join(UPLOAD_DIR, publicId);
  if (existsSync(filepath)) {
    await unlink(filepath);
  }
}
