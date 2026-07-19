import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an array of items" }, { status: 400 });
  }

  const count = body.length;

  addAuditLog({
    action: "import",
    resource: "menu",
    summary: `Imported ${count} menu items via Excel/CSV`,
    details: { count },
    admin: admin.user.name,
  });

  return NextResponse.json({ ok: true, count }, { status: 201 });
}
