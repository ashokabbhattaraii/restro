import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { messages } from "@/lib/constants";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { messageSchema } from "@/lib/validations";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`message:${ip}`, 5, 60 * 60 * 1000);

  if (!limited.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = messageSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  return NextResponse.json(
    {
      ...parsed.data,
      id: crypto.randomUUID(),
      name: sanitizeText(parsed.data.name),
      subject: sanitizeText(parsed.data.subject),
      message: sanitizeText(parsed.data.message),
      read: false,
      createdAt: new Date().toISOString(),
    },
    { status: 201 },
  );
}
