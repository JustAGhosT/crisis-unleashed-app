import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Read the body to avoid unhandled stream, but we don't use it here
    await request.json().catch(() => undefined);
    // TODO: forward to analytics sink (PostHog/GA4/OTLP) if configured
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
