import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the auth cookie with explicit path
    const resp = NextResponse.json({ success: true });
    // Use set with an expired date to clear cookie and satisfy types
    resp.cookies.set({ name: "auth_token", value: "", path: "/", httpOnly: true, expires: new Date(0) });
    return resp;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
