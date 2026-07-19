import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addAuditLog } from "@/lib/audit-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  addAuditLog({
    action: "update",
    resource: "reservation",
    resourceId: id,
    summary: `Updated reservation ${id}${body.status ? ` → ${body.status}` : ""}`,
    details: body,
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
    resource: "reservation",
    resourceId: id,
    summary: `Deleted reservation ${id}`,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true });
}
