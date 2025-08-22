import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the auth cookie with explicit path
    const resp = NextResponse.json({ success: true });
    resp.cookies.delete({ name: "auth_token", path: "/" });
    return resp;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
