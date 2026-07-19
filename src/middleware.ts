import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

function generateId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function shouldLog(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return false;
  if (pathname.startsWith("/favicon")) return false;
  if (pathname.startsWith("/images/")) return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId = generateId();
  const { pathname, search } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  let response: NextResponse;

  if (pathname === "/login") {
    response = NextResponse.redirect(new URL("/portal", request.url));
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  response.headers.set("x-request-id", requestId);
  response.headers.set("x-response-time", `${Date.now() - start}ms`);

  if (shouldLog(pathname)) {
    const duration = Date.now() - start;
    logger.api.success(
      request.method,
      pathname + search,
      response.status,
      duration,
      requestId
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
