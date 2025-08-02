import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, let's disable middleware authentication and handle it in API routes
  console.log("Middleware - Request path:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
