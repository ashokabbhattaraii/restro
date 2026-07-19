import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { galleryImages } from "@/lib/constants";
import { gallerySchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const images = category ? galleryImages.filter((item) => item.category === category) : galleryImages;
  return NextResponse.json(images);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = gallerySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  addAuditLog({
    action: "create",
    resource: "gallery",
    summary: `Added gallery image "${parsed.data.title}"`,
    admin: admin.user.name,
  });

  return NextResponse.json({ id: crypto.randomUUID(), ...parsed.data }, { status: 201 });
}
