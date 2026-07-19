import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { staffSchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsed = staffSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  addAuditLog({
    action: "update",
    resource: "staff",
    resourceId: id,
    summary: `Updated staff member "${parsed.data.name || id}"`,
    details: parsed.data,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true, staff: parsed.data });
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
    resource: "staff",
    resourceId: id,
    summary: `Deleted staff member ${id}`,
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true });
}
