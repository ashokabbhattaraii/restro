import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsed = menuItemSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  addAuditLog({
    action: "update",
    resource: "menu",
    resourceId: id,
    summary: `Updated menu item ${parsed.data.name || id}`,
    details: parsed.data,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true, item: parsed.data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  addAuditLog({
    action: "delete",
    resource: "menu",
    resourceId: id,
    summary: `Deleted menu item ${id}`,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true });
}
