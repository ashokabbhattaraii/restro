import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { menuItems } from "@/lib/constants";
import { sanitizeText } from "@/lib/utils";
import { menuItemSchema } from "@/lib/validations";

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
  if (!(await requireAdmin())) {
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

  return NextResponse.json(item, { status: 201 });
}
