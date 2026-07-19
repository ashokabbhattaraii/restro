import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addAuditLog } from "@/lib/audit-log";
import { DEFAULT_CONFIG } from "@/lib/config";
import type { RestaurantConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

let currentConfig: RestaurantConfig = { ...DEFAULT_CONFIG };

export async function GET() {
  return NextResponse.json(currentConfig);
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, unknown> = await request.json();

  const allowed = [
    "acceptingReservations", "maxGuests", "maxDaysAhead",
    "slotIntervalMinutes", "hours", "closedDates",
    "phoneOne", "phoneTwo", "location", "message",
  ];

  const partial: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) partial[key] = body[key];
  }

  currentConfig = { ...currentConfig, ...partial } as RestaurantConfig;

  addAuditLog({
    action: "update",
    resource: "reservation",
    summary: "Updated restaurant configuration (hours, settings)",
    details: { changed: Object.keys(partial) },
    admin: admin.user.name,
  });

  return NextResponse.json(currentConfig);
}
