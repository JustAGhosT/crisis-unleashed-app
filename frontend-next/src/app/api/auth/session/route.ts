import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
export const dynamic = "force-dynamic";

// In a real application, this would be stored in a database
const MOCK_USERS = [
  {
    id: "user-123",
    username: "CommanderAlpha",
    email: "user@example.com",
    password: "password", // In a real app, this would be hashed
    avatar: "https://via.placeholder.com/100",
    role: "user",
  },
  {
    id: "admin-456",
    username: "AdminOverlord",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    avatar: "https://via.placeholder.com/100",
    role: "admin",
  },
];

export async function GET() {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token");

    if (!authCookie?.value) {
      return NextResponse.json({ user: null });
    }

    // Verify and decode the JWT set by login
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set");
      const resp = NextResponse.json({ user: null });
      resp.cookies.delete("auth_token");
      return resp;
    }

    let userId: string | undefined;
    try {
      const payload = jwt.verify(authCookie.value, secret, {
        algorithms: ["HS256"],
        issuer: "crisis-unleashed",
        audience: "crisis-unleashed-client",
      }) as JwtPayload;
      userId = typeof payload.sub === "string" ? payload.sub : undefined;
    } catch {
      // Invalid/expired token – clear cookie and return null session
      const resp = NextResponse.json({ user: null });
      resp.cookies.delete("auth_token");
      return resp;
    }

    // Find the user (in a real app, this would query a database)
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      const resp = NextResponse.json({ user: null });
      resp.cookies.delete("auth_token");
      return resp;
    }

    // Return user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Session error:", error);
    const resp = NextResponse.json({ user: null });
    resp.cookies.delete("auth_token");
    return resp;
  }
}
