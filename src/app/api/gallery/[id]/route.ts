import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addAuditLog } from "@/lib/audit-log";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  addAuditLog({
    action: "delete",
    resource: "gallery",
    resourceId: id,
    summary: `Deleted gallery image ${id}`,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true });
}
