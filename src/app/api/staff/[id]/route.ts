import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { staffSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = staffSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  return NextResponse.json({ ok: true, staff: parsed.data });
}

export async function DELETE() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
