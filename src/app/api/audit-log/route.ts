import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAuditLog } from "@/lib/audit-log";
import { apiError, apiSuccess } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) {
    return apiError("Unauthorized", 401);
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 200, 500);
  const offset = Number(url.searchParams.get("offset")) || 0;
  const action = url.searchParams.get("action") || "all";
  const resource = url.searchParams.get("resource") || "all";
  const search = url.searchParams.get("search") || "";

  const { entries, total } = getAuditLog(limit, offset, { action, resource, search });

  return apiSuccess({ entries, total, limit, offset });
}
