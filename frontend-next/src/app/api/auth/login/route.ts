import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Temporary mock users for development. Replace with real backend auth.
const mockUsers = [
  { id: "1", username: "admin", email: "admin@example.com", password: "adminpass", role: "admin" },
  { id: "2", username: "user", email: "user@example.com", password: "userpass", role: "user" },
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

    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || "dev-secret";

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
      token,
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
