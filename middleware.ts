import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  // Protected routes
  const protectedPaths = ["/api/parcels", "/api/agents", "/api/status", "/api/reports", "/api/analytics"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId)
    requestHeaders.set("x-user-role", decoded.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
