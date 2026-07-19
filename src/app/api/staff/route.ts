import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { staff } from "@/lib/constants";
import { staffSchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const publicOnly = url.searchParams.get("public") === "true";

  if (!publicOnly && !(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(publicOnly ? staff.filter((member) => member.visible) : staff);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = staffSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  addAuditLog({
    action: "create",
    resource: "staff",
    summary: `Added staff member "${parsed.data.name}"`,
    admin: admin.user.name,
  });

  return NextResponse.json({ id: crypto.randomUUID(), ...parsed.data }, { status: 201 });
}
