import { type NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export function authenticateRequest(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return { authenticated: false, error: "No token provided" };
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return { authenticated: false, error: "Invalid token" };
  }

  return {
    authenticated: true,
    user: {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    },
  };
}
