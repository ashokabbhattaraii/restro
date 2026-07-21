import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function generateId(): string {
  return crypto.randomUUID().slice(0, 8);
}

export async function proxy(request: NextRequest) {
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

  // Request logging lives in the API server (my-backend), which is where the
  // API actually runs — logging it here only ever described page navigations.
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
