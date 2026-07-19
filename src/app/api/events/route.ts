import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { events } from "@/lib/constants";
import { eventSchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? events.length);
  return NextResponse.json(events.filter((event) => event.active).slice(0, limit));
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = eventSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  addAuditLog({
    action: "create",
    resource: "event",
    summary: `Created event "${parsed.data.title}"`,
    admin: admin.user.name,
  });

  return NextResponse.json({ id: crypto.randomUUID(), ...parsed.data }, { status: 201 });
}
