import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { reservations } from "@/lib/constants";
import { sanitizeText } from "@/lib/utils";
import { reservationSchema } from "@/lib/validations";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`reservation:${ip}`, 10, 60 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = reservationSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const reservation = {
    ...parsed.data,
    id: crypto.randomUUID(),
    name: sanitizeText(parsed.data.name),
    phone: sanitizeText(parsed.data.phone),
    status: "Pending",
  };

  return NextResponse.json(reservation, { status: 201 });
}
