import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Temporary mock users for development. Replace with real backend auth.
// Passwords are sourced from environment variables to avoid hardcoded secrets.
// Set NEXT_PUBLIC_AUTH_ADMIN_EMAIL, AUTH_ADMIN_PASSWORD, NEXT_PUBLIC_AUTH_USER_EMAIL, AUTH_USER_PASSWORD in your env.
const adminEmail = process.env.NEXT_PUBLIC_AUTH_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.AUTH_ADMIN_PASSWORD; // required for admin login
const userEmail = process.env.NEXT_PUBLIC_AUTH_USER_EMAIL ?? "user@example.com";
const userPassword = process.env.AUTH_USER_PASSWORD; // required for user login

type DevUser = { id: string; username: string; email: string; password?: string; role: "admin" | "user" };

const mockUsers: DevUser[] = [
  { id: "1", username: "admin", email: adminEmail, password: adminPassword, role: "admin" },
  { id: "2", username: "user", email: userEmail, password: userPassword, role: "user" },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Reject if the corresponding env password is not configured
    const user = mockUsers.find((u) => u.email === email && !!u.password && u.password === password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is not set. Refusing to issue tokens.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
