import { NextResponse } from "next/server";

export function apiError(
  message: string,
  status: number = 500,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      error: message,
      status,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
