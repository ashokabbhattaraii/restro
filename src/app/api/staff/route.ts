import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { staff } from "@/lib/constants";
import { staffSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const publicOnly = url.searchParams.get("public") === "true";

  if (!publicOnly && !(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(publicOnly ? staff.filter((member) => member.visible) : staff);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = staffSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  return NextResponse.json({ id: crypto.randomUUID(), ...parsed.data }, { status: 201 });
}
