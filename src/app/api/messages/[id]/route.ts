import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addAuditLog } from "@/lib/audit-log";

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  addAuditLog({
    action: "update",
    resource: "message",
    resourceId: id,
    summary: `Marked message ${id} as read`,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true });
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
    resource: "message",
    resourceId: id,
    summary: `Deleted message ${id}`,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true });
}
