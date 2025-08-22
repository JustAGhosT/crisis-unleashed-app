import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Discard the body quickly; we don't need it.
    await request.body?.cancel();
    // TODO: forward to analytics sink (PostHog/GA4/OTLP) if configured
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
