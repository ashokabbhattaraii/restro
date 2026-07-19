import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const checks: Record<string, "ok" | "fail" | "skipped"> = {};

  checks["app"] = "ok";

  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      const { connectDb } = await import("@/lib/db");
      await connectDb();
      checks["database"] = "ok";
    } catch {
      checks["database"] = "fail";
    }
  } else {
    checks["database"] = "skipped";
  }

  const healthy = Object.values(checks).every((v) => v === "ok" || v === "skipped");
  const duration = Date.now() - start;

  logger.info("Health check", {
    path: "/api/health",
    duration,
    healthy,
    checks,
  });

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
