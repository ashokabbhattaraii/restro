import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { menuItems } from "@/lib/constants";
import { sanitizeText } from "@/lib/utils";
import { menuItemSchema } from "@/lib/validations";
import { addAuditLog } from "@/lib/audit-log";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const featured = url.searchParams.get("featured") === "true";
  const category = url.searchParams.get("category");
  const items = menuItems.filter((item) => {
    if (!item.visible) return false;
    if (featured && !item.featured) return false;
    if (category && item.category !== category) return false;
    return true;
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = menuItemSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const item = {
    ...parsed.data,
    id: sanitizeText(parsed.data.name).toLowerCase().replaceAll(" ", "-"),
  };

  addAuditLog({
    action: "create",
    resource: "menu",
    summary: `Created menu item "${parsed.data.name}"`,
    admin: admin.user.name,
  });

  return NextResponse.json(item, { status: 201 });
}
